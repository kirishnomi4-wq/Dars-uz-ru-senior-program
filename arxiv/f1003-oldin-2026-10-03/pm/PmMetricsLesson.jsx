import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM · M5-D11 — BOTINGIZ YAXSHI ISHLAYOTGANINI QAYSI RAQAM AYTADI? (metrika)
// Senariy-manba: pm-senariylar/M5-D11-Metrika.md ([GATE S] 2026-09-28 + metodist korrekturasi).
// Misol-ip: o'quvchining O'Z Telegram-boti — M5 bo'yi qurgan boti (91/95/96/108-qonun).
// Imzo-vizual: /stat SUHBATI — ikki dushanba yonma-yon, jami o'sadi, qolgan uch raqam tushadi.
// Bosh keys: K9 Booking.com — faqat bank faktlari (o'zgarish odamlarning bir qismida · 2017 · 1000+).
// Kirish-artefakt: pm-m5d8-javoblar (m5-08) — JIM zaxira (§69).
// Chiqish-artefakt: pm-m5mx-raqamlar = { bosh: { nima, qachon }, raqamlar: [{ nom, nima, qachon } x3], savedAt }.
// INFRA MANBAI: src/5-Modull/PmLesson21.jsx (jonli relslar, Stage, QuestionScreen, MentorTestStats,
//   RecapOverlay, PairTimer, ScreenPodium, CodeStrike-arena, nishonlar) va PmLesson20.jsx (VS Code maketi).
// KODING: VS Code — o'quvchining o'z bot.js fayli, /stat buyrug'i (GATE S C2). Kompilyator EMAS.
// ATAMA-INTIZOMI: «metrika» faqat s2 da tug'iladi; inglizcha nomlar (DAU · retention · North Star)
//   faqat s5 va flashcard 5/7 da; testlar va arenada 0 (GATE S C3). «kir-» odam haqida 0.
// BIR TILLI (UZ): RU alohida sweep'da qo'shiladi.
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
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext } from '../live/index.js';

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};






const ou = (o) => (o && typeof o === 'object' && !React.isValidElement(o)) ? (o.uz ?? '') : o; // payload UZ-etalon (RU_I18N_SPEC 159)
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
const LESSON_META = { lessonId: 'pm-m5d11-metrika-v1', lessonTitle: { uz: 'Botingiz yaxshi ishlayotganini qaysi raqam aytadi?', ru: 'Какая цифра скажет, что ваш бот работает хорошо?' } };
// YAKUN-TUZILMASI ETALONDAN (P0 PmUserStory · PmLesson21 · M4c-D2):
// koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa BIR sahifada).
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom', scored: false, scope: 'hook' },        // 0  · BLOK 1
  { id: 's1',  type: 'rule',        template: 'custom', scored: false, scope: null },          // 1  · BLOK 2
  { id: 's2',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 2  · BLOK 3 teoriya-1
  { id: 's3',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 3  · TEST-1
  { id: 's4',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 4  · YADRO: /stat suhbati
  { id: 's5',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 5  · TEORIYA-2: uch nom
  { id: 's6',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 6  · TEST-2
  { id: 's7',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 7  · YADRO-2: foiz
  { id: 's8',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 8  · TEST-3
  { id: 's9',  type: 'case',        template: 'custom', scored: false, scope: null },          // 9  · K9 keys (Booking.com)
  { id: 's10', type: 'practice',    template: 'custom', scored: false, scope: null },          // 10 · BLOK 4 to'rt raqam
  { id: 's11', type: 'practice',    template: 'custom', scored: false, scope: null },          // 11 · BLOK 5 yozuvdan sanash
  { id: 's12', type: 'koding',      template: 'custom', scored: false, scope: null },          // 12 · BLOK 6 VS Code /stat
  { id: 's13', type: 'test',        template: 'custom', scored: true,  scope: 'final' },       // 13 · TEST-4
  { id: 's14', type: 'reflection',  template: 'custom', scored: false, scope: null },          // 14 · BLOK 7
  { id: 's15', type: 'stats',       template: 'custom', scored: false, scope: null },          // 15 · podium
  { id: 's16', type: 'flashcard',   template: 'custom', scored: false, scope: null },          // 16 · takrorlash
  { id: 's17', type: 'summary',     template: 'custom', scored: false, scope: null }           // 17 · BLOK 8 + 9
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun mavjud: 1 gaplik niyat (senariy 8-B jadvali).
export const SCREEN_INTENTS = {
  s0: "Bola bot yaxshi ishlayotganini qaysi raqamga qarab bilishini tanlaydi va jami soni faqat o'sishini eshitadi",
  s1: "Bola dars oxirida botining to'rt raqamini yozishini oldindan ko'radi",
  s2: "Bola fikr bilan sanab tekshirib bo'ladigan raqamni ajratib, metrika nima ekanini biladi",
  s3: "Bola sanab tekshirib bo'ladigan javobni tanlaydi",
  s4: "Bola botdan /stat so'rab, jami o'sganda qolgan uch raqam tushganini ko'radi",
  s5: "Bola uch raqamning har biri qaysi savolga javob berishini va nomini ochadi",
  s6: "Bola kechagilardan bugun ham kelganlar qaytganlar foizi ekanini aniqlaydi",
  s7: "Bola ikki juftlikni yuzta odamga keltirib, foizni solishtirishni o'rganadi",
  s8: "Bola har xil kattalikdagi ikki kunda qaysi kunda qaytganlar foizi katta ekanini topadi",
  s9: "Bola Booking har o'zgarishni odamlarning bir qismida sinab, raqamlarni solishtirishini biladi",
  s10: "Bola o'z botining bosh raqami va uch raqamini bittalab yozadi va har biri qachon sanalishini tanlaydi",
  s11: "Bola botning bir kunlik yozuvidan bir odamni bir marta sanab, uch raqamni topadi",
  s12: "Bola o'z botiga /stat buyrug'ini yozadi va bot bugun kelganlar sonini va bosh raqamni aytadi",
  s13: "Bola /stat javobidagi foiz nimani aytishini topadi",
  s14: "Bola botining bosh raqamini yoddan aytadi va bir qatorda yozadi",
  s15: "Bola o'z natijasini (jonlida — guruh reytingini) ko'radi",
  s16: "Bola o'nta karta bilan o'zini tekshiradi",
  s17: "Bola arenada bilimini sinaydi, uy-vazifasi va nishonlarini bir sahifada ko'radi"
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
// lint-keys QOIDA 2: scored bo'lmagan ekran s-qolipli kalit olmaydi — shuning uchun senariydagi
// s4/s7/s10/s11/s12 zonalari nom bilan: stat · foiz · raqamlar · yozuv · koding.
const INLINE_KEYS = { s3: 1, s6: 2, s8: 0, s13: 1, stat: -1, foiz: -1, raqamlar: -1, yozuv: -1, koding: -1 };
// Har scored ekran uchun qayta-tushuntirish. Kalitlar = scored ekran INDEKSI (3/6/8/13).
const RECAPS = {
  3: {
    title: { uz: 'Sanab tekshiriladigan raqam', ru: 'Цифра, которую можно проверить подсчётом' },
    cards: [
      { ic: '1', h: { uz: 'Metrika nima', ru: 'Что такое метрика' }, body: { uz: <>Bot haqida sanab tekshirib bo'ladigan raqam <b>metrika</b> deyiladi.</>, ru: <>Цифра о боте, которую можно проверить подсчётом, называется <b>метрикой</b>.</> } },
      { ic: '2', h: { uz: "Son bor — lekin fikr", ru: 'Число есть — но это мнение' }, body: { uz: <>«Juda qulay», «10 dan 9 ball» — bu fikr: har kim o'zicha baholaydi, uni sanab tekshirib bo'lmaydi.</>, ru: <>«Очень удобно», «9 баллов из 10» — это мнение: каждый оценивает по-своему, подсчётом это не проверить.</> } },
      { ic: '3', h: { uz: 'Yozuvdan tekshiring', ru: 'Проверьте по журналу' }, body: { uz: <>«Bugun 12 odam yozdi» degan gapni botga kelgan xabarlardan birma-bir sanab tekshirasiz.</>, ru: <>Фразу «Сегодня написали 12 человек» вы проверяете, пересчитав по одному сообщения, пришедшие боту.</> }, ask: { uz: "«Botim foydali» va «bugun 5 odam tugma bosdi» — qaysi birini sanab tekshirsa bo'ladi?", ru: '«Мой бот полезный» и «сегодня 5 человек нажали кнопку» — какую фразу можно проверить подсчётом?' } }
    ]
  },
  6: {
    title: { uz: 'Uch raqam — uch savol', ru: 'Три цифры — три вопроса' },
    cards: [
      { ic: '1', h: { uz: 'Bugun kelganlar', ru: 'Пришли сегодня' }, body: { uz: <>Bu raqam bitta savolga javob beradi: <b>botga bugun odam keldimi?</b></>, ru: <>Эта цифра отвечает на один вопрос: <b>приходили ли сегодня к боту люди?</b></> } },
      { ic: '2', h: { uz: 'Qaytganlar foizi va bosh raqam', ru: 'Процент вернувшихся и главная цифра' }, body: { uz: <>Qaytganlar foizi — <b>odamlar botga qaytyaptimi?</b> Bosh raqam — <b>bot o'z ishini bajardimi?</b></>, ru: <>Процент вернувшихся — <b>возвращаются ли люди к боту?</b> Главная цифра — <b>сделал ли бот свою работу?</b></> } },
      { ic: '3', h: { uz: 'Jami-chi?', ru: 'А «всего»?' }, body: { uz: <>Jami «qancha odam yig'ildi?» degan savolga javob beradi, bu uch savolga esa — yo'q.</>, ru: <>«Всего» отвечает на вопрос «сколько людей набралось?», а на эти три вопроса — нет.</> }, ask: { uz: "Kecha 20 odam keldi, bugun ulardan 6 tasi yana keldi. Bu qaysi raqam haqida?", ru: 'Вчера пришли 20 человек, сегодня 6 из них пришли снова. О какой это цифре?' } }
    ]
  },
  8: {
    title: { uz: 'Foizda solishtiring', ru: 'Сравнивайте в процентах' },
    cards: [
      { ic: '1', h: { uz: 'Foizni qanday topamiz', ru: 'Как найти процент' }, body: { uz: <>Qaytganlar sonini kechagi odamlar soniga bo'lib, <b>100 ga ko'paytiring</b>.</>, ru: <>Разделите число вернувшихся на число вчерашних людей и <b>умножьте на 100</b>.</> } },
      { ic: '2', h: { uz: 'Guruhlar har xil bo\'lsa', ru: 'Если группы разные' }, body: { uz: <>Odam soni har xil bo'lsa — qaytganlar sonini emas, <b>foizni solishtiring</b>.</>, ru: <>Если людей разное число — сравнивайте не число вернувшихся, а <b>процент</b>.</> } },
      { ic: '3', h: { uz: 'Yuzta odamga keltiring', ru: 'Приведите к сотне человек' }, body: { uz: <>Foiz aytadi: yuzta odam kelganda ulardan nechtasi qaytgan bo'lardi.</>, ru: <>Процент показывает: если бы пришли сто человек, сколько из них вернулись бы.</> }, ask: { uz: 'Bir kuni 50 odamdan 10 tasi qaytdi, boshqa kuni 5 odamdan 2 tasi. Qaysi kunda foiz katta?', ru: 'В один день из 50 человек вернулись 10, в другой — 2 из 5. В какой день процент больше?' } }
    ]
  },
  13: {
    title: { uz: 'Faqat jamiga qaramang', ru: 'Не смотрите только на «всего»' },
    cards: [
      { ic: '1', h: { uz: 'Jami soni', ru: 'Число «всего»' }, body: { uz: <>Jami soni <b>faqat o'sadi</b> — bot yomonlashsa ham kamaymaydi.</>, ru: <>Число «всего» <b>только растёт</b> — даже если бот стал хуже, оно не уменьшается.</> } },
      { ic: '2', h: { uz: 'Odamlar qaytyaptimi', ru: 'Возвращаются ли люди' }, body: { uz: <>Odamlar botda qolyaptimi — buni <b>qaytganlar foizi</b> aytadi.</>, ru: <>Остаются ли люди с ботом — это показывает <b>процент вернувшихся</b>.</> } },
      { ic: '3', h: { uz: 'Bosh raqam', ru: 'Главная цифра' }, body: { uz: <>Bot o'z ishini bajardimi — buni <b>bosh raqam</b> aytadi.</>, ru: <>Сделал ли бот свою работу — это показывает <b>главная цифра</b>.</> }, ask: { uz: '/stat javobi: jami 500, qaytganlar foizi 3. 3 foiz nimani aytadi?', ru: 'Ответ на /stat: всего 500, процент вернувшихся 3. О чём говорят эти 3 процента?' } }
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
  // KOD 14b: mustaqil rejimda ham — birinchi xatodan keyin «Qisqa takrorlash» havolasi (mentor tugmasidan tashqari)
  const [wrongOnce, setWrongOnce] = useState(() => !!(storedAnswer && storedAnswer.firstAttemptCorrect === false));
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect(() => { if (isMentorLive && liveRevealScreen === screen) setMReveal(true); }, [isMentorLive, liveRevealScreen, screen]);
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === correctIdx;
    setPicked(i);
    if (!isCorrect) setWrongOnce(true);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect;
    if (oneShot) {
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    // Har urinish tarixga (LMS analitika, 0005): ball emas, yozuv; modulsiz eski darsda recordAttempt yo'q
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: options.map(ou), picked: ou(options[i]), correct: ou(options[correctIdx]), lang: (typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz' });
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (ctaLabel || tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "Jonli dars — bitta urinish, o'ylab tanlang!", ru: "Живой урок — одна попытка, выбирайте обдуманно!" })}</p>}
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
                  ? <>{revealPrefix}: {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(tr(explainCorrect))
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
                : wrongLocked
                  ? fmtCode(tr(explainWrong[picked] ?? explainWrong.default))
                  : solved ? fmtCode(tr(explainCorrect)) : fmtCode(tr(explainWrong[picked] ?? explainWrong.default))}
          </p>
        </FeedbackBlock>
        {wrongOnce && hasRecap && !isMentorLive && !waiting && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — взглянуть на тему ещё раз" })}</button>}
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
    <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title={tr({ uz: 'Mentorga eslatma — bosib oching', ru: 'Заметка ментору — нажмите, чтобы открыть' })}>{tr({ uz: 'Eslatma', ru: "Заметка" })}</button>
  );
  return (
    <div className="mnote fade-up" onClick={() => setOpen(false)} title={tr({ uz: 'Yopish uchun bosing', ru: 'Нажмите, чтобы закрыть' })}>
      <span className="mnote-lbl">{tr({ uz: 'Mentorga eslatma', ru: "Заметка ментору" })}<span className="mnote-x">{tr({ uz: '✕ yopish', ru: '✕ закрыть' })}</span></span>
      <p className="mnote-body">{children}</p>
    </div>
  );
};

// ===== 🛠️ JONLI PRAKTIKA zonasi (500+) =====
const PRACTICE_BASE = 500;
const MentorPracticeStats = ({ live, screen, label = { uz: "Kim bajardi", ru: "Кто выполнил" } }) => {
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
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.accentSoft, color: T.accent, fontWeight: 700 }}>{p.nickname}</span>)}
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
      {tr({ uz: <>Sinfda: <b>{data.done}</b> bajardi{doing > 0 && <span className="dm-sub"> · {doing} hali bajarmoqda</span>}</>, ru: <>В классе: <b>{data.done}</b> выполнили{doing > 0 && <span className="dm-sub"> · {doing} ещё делают</span>}</> })}
    </div>
  );
};

// ============================================================
// 🤖 DARS MA'LUMOTLARI — o'quvchining O'Z Telegram-boti (bitta misol-ip, 108-qonun).
// s4 suhbati · s5 nomlari · s11 yozuvi · s12 kodi — bir olam: bot va unga keladigan odamlar.
// ============================================================
const kamHarakat = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
// Chiqish-artefakt (s10): { bosh: { nima, qachon }, raqamlar: [{ nom, nima, qachon } x3], savedAt }
const OUT_KEY = 'pm-m5mx-raqamlar';
const readRaqamlar = () => {
  try {
    const v = JSON.parse(localStorage.getItem(OUT_KEY) || 'null');
    if (!v || !v.bosh || !Array.isArray(v.raqamlar) || v.raqamlar.length < 3) return null;
    return v;
  } catch { return null; }
};
const qisqa = (s, n = 30) => { const t = String(s || '').trim(); return t.length > n ? `${t.slice(0, n)}…` : t; };

// ===== SCREEN 0 — HOOK: qaysi raqamga qarab bilasiz? =====
const HOOK_OPTS = [
  { k: 'jami',  t: { uz: 'Jami nechta odam /start bosganiga', ru: 'По тому, сколько всего людей нажали /start' }, javob: { uz: "Jami faqat o'sadi: bot bir hafta ishlamay tursa ham u kamaymaydi.", ru: '«Всего» только растёт: даже если бот неделю не работает, это число не уменьшается.' } },
  { k: 'bugun', t: { uz: 'Bugun nechta odam botga yozganiga', ru: 'По тому, сколько людей написали боту сегодня' }, javob: { uz: "Bugungi son har kuni o'zgaradi, lekin odam botdan keragini oldimi — buni aytmaydi.", ru: 'Сегодняшнее число меняется каждый день, но получил ли человек от бота нужное — оно не говорит.' } },
];
// Qator belgisi (A4-qo'shimcha): emoji o'rniga CSS nuqta — bosh raqam to'q, qolganlari och, jami kulrang.
const RowDot = ({ v }) => <i className={`mx-dot${v ? ` ${v}` : ''}`} aria-hidden="true" />;
// 100c-qonun: tanlov yoziladi, hech qayerda O'QILMAYDI.
const HOOK_KEY = 'pm-m5mx-hook';
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
    <Stage eyebrow={tr({ uz: 'Kirish · botingiz', ru: 'Вступление · ваш бот' })} screen={screen} navContent={<NavNext optionalLive turnBusy={picked === null && !isMentor} disabled={picked === null && !isMentor} label={opened ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' })} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bot yaxshi ishlayotganini qaysi <span className="italic" style={{ color: T.accent }}>raqamga</span> qarab bilasiz?</>, ru: <>По какой <span className="italic" style={{ color: T.accent }}>цифре</span> вы поймёте, что бот работает хорошо?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Botingizga odamlar /start bosib kelyapti. <span style={{ whiteSpace: 'nowrap' }}>8-darsda</span> botingizni ishlatgan odamdan so'ragan edingiz — bugun raqamlarga qaraymiz.</>, ru: <>К вашему боту приходят люди и нажимают /start. <span style={{ whiteSpace: 'nowrap' }}>На 8-м уроке</span> вы расспрашивали человека, который пользовался вашим ботом, — сегодня посмотрим на цифры.</> })}</Mentor>
        <div className="hrow two fade-up delay-1">
          {HOOK_OPTS.map((o, i) => (
            <button key={o.k} className={`hopt${picked === i ? ' on' : ''}${opened ? ' open' : ''}${!opened && optWave ? waveCls(true, i, HOOK_OPTS.length) : ''}`} disabled={opened} onClick={() => pick(i)}>
              <span className="hopt-nom">{tr(o.t)}</span>
            </button>
          ))}
        </div>
        {/* 104-qonun · §119 (A8-istisno): to'g'ri javob yo'q — har tanlovga o'z gapi + bitta umumiy qator, hukm yo'q */}
        {opened && (
          <div className="frame-soft h0end fade-step">
            {(picked !== null ? [HOOK_OPTS[picked]] : HOOK_OPTS).map(o => <p key={o.k} className="body" style={{ margin: 0, color: T.ink }}>{tr(o.javob)}</p>)}
            <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Demak bittasi yolg'iz yetmaydi — qaysi raqamlar kerakligini bugun topamiz.", ru: 'Значит, одной цифры мало — сегодня найдём, какие цифры нужны.' })}</p>
          </div>
        )}
        {/* §97: ovoz-diagrammasi FAQAT jonli darsda */}
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
                  <span className="hvote-pct mono">{n}</span>
                </div>
              );
            })}
          </div>
        )}
        <MentorNote>{tr({ uz: "Ovozlar bo'linadi — ikkala raqam ham yolg'iz yetmaydi, buni bolalar javobdan ko'radi. «Faqat o'sadi» degan joyda to'xtang va so'rang: bot bir hafta ishlamasa, jami soni nima bo'ladi?", ru: 'Голоса разделятся — ни одной из двух цифр самой по себе не хватает, это ученики увидят из ответа. На словах «только растёт» остановитесь и спросите: если бот неделю не работает, что будет с числом «всего»?' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: bot-javobi pufagi o'z-o'zidan yoziladi (18-qonun WOW) =====
// §125/§178: nomlar ham, sonlar ham yo'q — «?». s10 saqlangach pufak o'quvchining O'Z nomlari bilan yoziladi (80c).
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [mine] = useState(() => readRaqamlar());
  const rows = mine
    ? [{ t: qisqa(mine.bosh.nima) }, { t: qisqa(mine.raqamlar[0].nom) }, { t: qisqa(mine.raqamlar[1].nom) }, { t: qisqa(mine.raqamlar[2].nom) }]
    : [{ t: '' }, { t: '' }, { t: '' }, { t: '' }];
  return (
    <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun botingiz uchun <span className="italic" style={{ color: T.accent }}>to'rt raqam</span> tanlaysiz.</>, ru: <>Сегодня вы выберете для своего бота <span className="italic" style={{ color: T.accent }}>четыре цифры</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Bittasi — eng muhimi, uchtasi — unga yordam beradi. Dars oxirida shulardan ikkitasini — bugun kelganlar va bosh raqamni — sanaydigan /stat buyrug'ini botingizga yozasiz.", ru: 'Одна — самая важная, три помогают ей. В конце урока вы напишете для бота команду /stat, которая считает две из них — «пришли сегодня» и главную цифру.' })}</Mentor>
        <div className="tg s1tg fade-up delay-1" role="img" aria-label={tr({ uz: "Botga /stat yuborildi, bot to'rt qatorli javob yozmoqda", ru: 'Боту отправили /stat, бот пишет ответ из четырёх строк' })}>
          <span className="tg-me">/stat</span>
          <div className="tg-bot">
            {rows.map((r, i) => (
              <span key={i} className={`tg-l demo${i === 0 ? ' star' : ''}`} style={{ '--dd': `${0.7 + i * 0.75}s` }}>
                <RowDot v={i === 0 ? 'bosh' : ''} />{r.t && <span className="tg-nm">{r.t}:</span>}<span className="tg-q">?</span>
              </span>
            ))}
          </div>
        </div>
        <MentorNote>{tr({ uz: "Pufak yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.", ru: 'Пока пузырь не допишется, молчите — картинка всё покажет сама.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — TEORIYA-1: fikr ↔ sanaladigan raqam (46-qonun toggle) =====
const S2_CARDS = [
  { tur: 'fikr', h: { uz: '«Botim juda yaxshi ishlayapti»', ru: '«Мой бот работает очень хорошо»' }, b: { uz: "Buni sanab bo'lmaydi: har kim «yaxshi»ni o'zicha tushunadi.", ru: 'Это не посчитать: каждый понимает «хорошо» по-своему.' } },
  { tur: 'son', h: { uz: '«Bugun botga 12 odam yozdi»', ru: '«Сегодня боту написали 12 человек»' }, b: { uz: "Buni sanasa bo'ladi: botga kelgan xabarlarni sanab, 12 ta ekanini tekshirasiz.", ru: 'Это можно посчитать: пересчитаете сообщения, пришедшие боту, и проверите, что их 12.' } },
];
const Screen2 = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [opened, setOpened] = useState([false, false]);
  const [seen, setSeen] = useState([false, false]);
  const allSeen = seen.every(Boolean);
  // 46-qonun: karta QULFLANMAYDI — qayta bosilsa yopiladi; darvoza `seen` bilan alohida.
  const toggle = (i) => {
    setOpened(prev => prev.map((v, k) => (k === i ? !v : v)));
    setSeen(prev => (prev[i] ? prev : prev.map((v, k) => (k === i ? true : v))));
  };
  const pend = S2_CARDS.map((_, i) => String(i)).filter(k => !seen[Number(k)]);
  const lit = useTurnWalk(pend);
  const qoldi = seen.filter(v => !v).length;
  return (
    <Stage eyebrow={tr({ uz: 'Muhokama · ikki gap', ru: 'Обсуждение · две фразы' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!allSeen && !isMentor} disabled={!allSeen && !isMentor} label={allSeen || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${qoldi} kartani oching`, ru: `Осталось открыть карточек: ${qoldi}` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi gapni <span className="italic" style={{ color: T.accent }}>tekshirib</span> ko'rsa bo'ladi?</>, ru: <>Какую фразу можно <span className="italic" style={{ color: T.accent }}>проверить</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: 'Botingiz haqida ikki gap. Ikkala kartani bosing.', ru: 'Две фразы о вашем боте. Нажмите на обе карточки.' })}</Mentor>
        <div className="dfc-grid fade-up delay-1">
          {S2_CARDS.map((c, i) => (
            <button key={tr(c.h)} type="button" className={`dfc dfc-${c.tur}${opened[i] ? ' open' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => toggle(i)}>
              <span className="dfc-top"><span className="dfc-h">{tr(c.h)}</span><span className={`mx-mark${seen[i] ? ' ok' : ''}`} aria-hidden="true">{seen[i] ? '✓' : '›'}</span></span>
              <span className="dfc-b">{opened[i] ? tr(c.b) : '· · ·'}</span>
            </button>
          ))}
        </div>
        {allSeen && (
          <div className="xul fade-step">
            <span className="xul-h">{tr({ uz: "Bot haqida sanab tekshirib bo'ladigan raqam metrika deyiladi.", ru: 'Цифра о боте, которую можно проверить подсчётом, называется метрикой.' })}</span>
            <p className="xul-b">{tr({ uz: "Nimani sanashingiz aniq bo'lsa, uni har kim qayta sanab, o'sha sonni oladi.", ru: 'Если ясно, что именно считать, любой пересчитает и получит то же число.' })}</p>
          </div>
        )}
        <MentorNote>{tr({ uz: "Kimdir «metrika — guvohnoma-ku» desa: so'z bir xil, ma'no boshqa — bu yerda o'lchash.", ru: 'Если кто-то скажет «метрика — это же свидетельство о рождении»: слово одно, смысл другой — здесь это измерение.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== TEST-EKRAN sarlavhasi (105-qonun: .h-ask) =====
const TestQ = ({ ask }) => <h2 className="title h-ask">{ask}</h2>;

const Screen3 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: "Tekshiruv · sanab bo'ladigan raqam", ru: 'Проверка · цифра, которую можно посчитать' })} scope="module-mikro"
    question={<TestQ ask={tr({ uz: "Sizdan «Botingiz qanday ishlayapti?» deb so'rashdi. Qaysi javobni sanab tekshirib bo'ladi?", ru: 'Вас спросили: «Как работает ваш бот?» Какой ответ можно проверить подсчётом?' })} />}
    questionText="Sizdan «Botingiz qanday ishlayapti?» deb so'rashdi. Qaysi javobni sanab tekshirib bo'ladi?"
    options={[{ uz: 'Men botimga 10 dan 9 ball beraman', ru: 'Я ставлю своему боту 9 баллов из 10' }, { uz: 'Bugun botdan 9 odam javob oldi', ru: 'Сегодня 9 человек получили ответ от бота' }, { uz: "Botim sinfdagi 5 ta botning eng qulayi", ru: 'Мой бот — самый удобный из 5 ботов класса' }]}
    correctIdx={1}
    explainCorrect={{ uz: "9 odamni botga kelgan xabarlardan sanab tekshirasiz, «9 ball» va «eng qulay» esa — fikr.", ru: '9 человек вы проверите, пересчитав сообщения, пришедшие боту, а «9 баллов» и «самый удобный» — это мнение.' }}
    explainWrong={{
      0: { uz: "9 ball — sizning bahoyingiz. Son bor, lekin boshqa odam o'zicha boshqa ball beradi: bu fikr.", ru: '9 баллов — ваша оценка. Число есть, но другой человек поставит свой балл: это мнение.' },
      2: { uz: "5 ta botni sanasa bo'ladi, lekin «eng qulay»ini emas: kimgadir qulay, kimgadir yo'q.", ru: '5 ботов посчитать можно, а «самый удобный» — нет: кому-то удобно, кому-то нет.' },
      default: { uz: "Sanab tekshirib bo'ladigan gapni botga kelgan xabarlardan tekshirasiz: nechta odam keldi, nechtasi javob oldi.", ru: 'Фразу, которую можно посчитать, проверяют по сообщениям боту: сколько людей пришло, сколько получили ответ.' }
    }}
  />
);

// ===== SCREEN 4 — YADRO: /stat SUHBATI (markaziy mexanika · imzo-vizual) =====
// Holat: idle → (/stat) jami → (bashorat) ask → (3 chip) done. Tushgan raqam QIZIL EMAS — neytral indigo.
const STAT_KEY = 'pm-m5mx-stat';
const MONS = [
  { k: 'old', nom: { uz: "O'tgan dushanba", ru: 'Прошлый понедельник' }, jami: 100, bugun: 18, kecha: 20, qayt: 9, kerak: 15 },
  { k: 'new', nom: { uz: 'Bu dushanba', ru: 'Этот понедельник' },     jami: 120, bugun: 6,  kecha: 8,  qayt: 1, kerak: 4 },
];
const STAT_ROWS = [
  { k: 'bugun', dot: '', chip: { uz: 'Bugun kelganlar', ru: 'Пришли сегодня' }, line: (m) => ({ uz: `Bugun kelganlar: ${m.bugun}`, ru: `Пришли сегодня: ${m.bugun}` }), fakt: { uz: 'Bu dushanba botga uch barobar kam odam yozdi: 18 emas, 6.', ru: 'В этот понедельник боту написали втрое меньше людей: не 18, а 6.' } },
  { k: 'qayt',  dot: '', chip: { uz: 'Kechagilardan qaytgani', ru: 'Вернулись из вчерашних' }, line: (m) => ({ uz: `Kechagilardan qaytgani: ${m.kecha} tadan ${m.qayt}`, ru: `Вернулись из вчерашних: ${m.qayt} из ${m.kecha}` }), fakt: { uz: "O'tgan safar kechagi 20 odamdan 9 tasi qaytgan edi, bu safar 8 tadan 1 tasi.", ru: 'В прошлый раз из 20 вчерашних вернулись 9, в этот раз — 1 из 8.' } },
  { k: 'kerak', dot: 'bosh', chip: { uz: 'Keragini olganlar', ru: 'Получившие нужное' }, line: (m) => ({ uz: `Keragini olganlar: ${m.kerak}`, ru: `Получившие нужное: ${m.kerak}` }), fakt: { uz: 'Botdan kerakli javob olganlar ham kamaydi: 15 tadan 4 taga.', ru: 'Получивших от бота нужный ответ тоже стало меньше: было 15, стало 4.' } },
];
const STAT_BET = [{ uz: "Ha, 20 odam qo'shildi", ru: 'Да, добавилось 20 человек' }, { uz: "Bu raqamdan bilib bo'lmaydi", ru: 'По этой цифре не понять' }];
// A7: o'tgan dushanbadan bu dushanbaga yo'nalish — strelka chiziladi (Jami yuqoriga, qolgan uchtasi pastga; rang neytral).
const DirArrow = ({ up }) => (
  <svg className={`mx-arw${up ? ' up' : ''}`} viewBox="0 0 12 16" aria-hidden="true"><path pathLength="1" d="M6 15 V2 M2 6 L6 2 L10 6" /></svg>
);
const readStat = () => { try { const v = JSON.parse(localStorage.getItem(STAT_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [init] = useState(() => readStat());
  const [sent, setSent] = useState(() => !!(init && init.sent));
  const [bet, setBet] = useState(() => (init && Number.isInteger(init.bet) ? init.bet : null));
  const [asked, setAsked] = useState(() => (init && Array.isArray(init.asked) ? init.asked : []));
  const [last, setLast] = useState(null);
  const done = asked.length >= STAT_ROWS.length;
  useEffect(() => { try { localStorage.setItem(STAT_KEY, JSON.stringify({ sent, bet, asked, savedAt: Date.now() })); } catch {} }, [sent, bet, asked]);
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'stat', screenIdx: screen, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'stat', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const xulRef = useRef(null);
  useEffect(() => {
    if (!done || !xulRef.current) return;
    const t = setTimeout(() => { if (xulRef.current) xulRef.current.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [done]);
  const ask = (k) => { if (asked.includes(k) || isMentor) return; setAsked(p => [...p, k]); setLast(k); };
  const cmdTurn = useTurnHint(!sent && !isMentor);
  const betWave = useTurnHint(sent && bet === null && !isMentor);
  // A6: so'rash tugmalari navbat bilan — so'ralganlari ✓ bo'lib qoladi, keyingisi bittadan chiqadi.
  const nextRow = STAT_ROWS.find(r => !asked.includes(r.k));
  const shownRows = STAT_ROWS.filter(r => asked.includes(r.k) || (nextRow && r.k === nextRow.k));
  const askTurn = useTurnHint(bet !== null && !done && !isMentor);
  const lastRow = STAT_ROWS.find(r => r.k === last);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !sent ? tr({ uz: "① «/stat» buyrug'ini yuboring", ru: '① Отправьте команду «/stat»' })
      : bet === null ? tr({ uz: '② Savolga javob bering', ru: '② Ответьте на вопрос' })
        : tr({ uz: `③ Yana ${STAT_ROWS.length - asked.length} raqamni so'rang`, ru: `③ Осталось спросить цифр: ${STAT_ROWS.length - asked.length}` });
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · ikki dushanba', ru: 'Практика · два понедельника' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(9px,1.4vw,14px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>/stat yuboring va ikki dushanbani <span className="italic" style={{ color: T.accent }}>solishtiring</span>.</>, ru: <>Отправьте /stat и <span className="italic" style={{ color: T.accent }}>сравните</span> два понедельника.</> })}</h2></div>
        <Mentor>{bet === null ? tr({ uz: "Chapda — o'tgan dushanba, o'ngda — bu dushanba. Bot bitta, kunlar ikki xil.", ru: 'Слева — прошлый понедельник, справа — этот. Бот один, дни разные.' }) : tr({ uz: "Endi botdan yana uch raqamni so'rang va ikki suhbatni yonma-yon o'qing.", ru: 'Теперь спросите у бота ещё три цифры и прочитайте оба чата рядом.' })}</Mentor>
        <div className="mon fade-up delay-1">
          {MONS.map(m => (
            <div key={m.k} className={`mon-col ${m.k}`}>
              <span className="mon-chip">{tr(m.nom)}</span>
              <div className="tg">
                {sent && <span className="tg-me fade-step">/stat</span>}
                {sent && (
                  <div className="tg-bot fade-step">
                    <span className={`tg-l jami${asked.length ? ' dim' : ''}`}><RowDot v="jami" />{tr({ uz: <>Jami: {m.jami}</>, ru: <>Всего: {m.jami}</> })}{done && m.k === 'new' && <DirArrow up />}</span>
                    {STAT_ROWS.filter(r => asked.includes(r.k)).map(r => (
                      <span key={r.k} className="tg-l add"><RowDot v={r.dot} />{tr(r.line(m))}{done && m.k === 'new' && <DirArrow />}</span>
                    ))}
                  </div>
                )}
                {!sent && <span className="tg-empty">· · ·</span>}
              </div>
            </div>
          ))}
        </div>
        {!sent && (
          <button type="button" className={`stat-cmd${cmdTurn ? ' turn-ring' : ''}`} disabled={isMentor} onClick={() => setSent(true)}>/stat</button>
        )}
        {sent && !done && (
          <div className="s4bet fade-step">
            {bet === null ? (
              <>
                <span className="cmt-lbl">{tr({ uz: 'Faqat shu raqamga qarab: bot yaxshilandimi?', ru: 'Глядя только на эту цифру: бот стал лучше?' })}</span>
                <div className="gt-btns">
                  {STAT_BET.map((b, i) => (
                    <button key={tr(b)} type="button" className={`gt-b${waveCls(betWave, i, 2)}`} disabled={isMentor} onClick={() => setBet(i)}>{tr(b)}</button>
                  ))}
                </div>
              </>
            ) : (
              <div className="cmt-fold calm fade-step"><span className="cmt-done"><span className="cmt-tick">✓</span> {tr({ uz: <>Javobingiz: {tr(STAT_BET[bet])}</>, ru: <>Ваш ответ: {tr(STAT_BET[bet])}</> })}</span></div>
            )}
            {bet !== null && (
              <div className="stat-chips">
                {shownRows.map(r => {
                  const used = asked.includes(r.k);
                  return <button key={r.k} type="button" className={`stat-chip${used ? ' used' : ' fade-step'}${!used && askTurn ? ' turn-ring' : ''}`} disabled={used || isMentor} onClick={() => ask(r.k)}>{used ? `✓ ${tr(r.chip)}` : `+ ${tr(r.chip)}`}</button>;
                })}
              </div>
            )}
            {lastRow && <p key={lastRow.k} className="fakt-line fade-step">{tr(lastRow.fakt)}</p>}
          </div>
        )}
        {done && (
          <div className="xul fade-step" ref={xulRef}>
            <span className="xul-h">{tr({ uz: "Jami 100 dan 120 ga o'sdi — qolgan uch raqam esa tushdi.", ru: '«Всего» выросло со 100 до 120 — а остальные три цифры упали.' })}</span>
            <p className="xul-b">{tr({ uz: "Jami faqat o'sadi, shuning uchun bot qanday ishlayotganini u yolg'iz aytmaydi.", ru: '«Всего» только растёт, поэтому само по себе оно не скажет, как работает бот.' })}</p>
          </div>
        )}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Uch raqamni so\'raganlar', ru: 'Спросили три цифры' }} />
        <MentorNote>{tr({ uz: "«Jami 120 — ko'payibdi!» degan ovozlar chiqadi. Shunda o'ng suhbatdagi qolgan qatorlarni birga o'qing — xulosani bolalar o'zi aytsin. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Прозвучат голоса: «Всего 120 — стало больше!» Тогда прочитайте вместе остальные строки в правом чате — пусть вывод ученики сделают сами. Это задание выполняют ученики, вы наблюдаете; «Продолжить» для вас открыта.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — TEORIYA-2: pufakdagi qatorni bosing → nomi ochiladi (ta'lim-ochilma, ball yo'q) =====
const NOMLAR = [
  { k: 'bugun', dot: '', line: { uz: 'Bugun kelganlar: 6', ru: 'Пришли сегодня: 6' }, q: { uz: 'Botga bugun odam keldimi?', ru: 'Приходили ли сегодня к боту люди?' }, nom: { uz: 'Bugun kelganlar', ru: 'Пришли сегодня' }, def: { uz: "Bugun botga yozgan yoki tugma bosgan odamlar — har biri bir marta sanaladi.", ru: 'Люди, которые сегодня написали боту или нажали кнопку, — каждый считается один раз.' }, en: { uz: <><b>DAU</b> («kunlik faol foydalanuvchilar»)</>, ru: <><b>DAU</b> («ежедневные активные пользователи»)</> } },
  { k: 'qayt',  dot: '', line: { uz: 'Kechagilardan qaytgani: 8 tadan 1', ru: 'Вернулись из вчерашних: 1 из 8' }, q: { uz: 'Odamlar botga qaytyaptimi?', ru: 'Возвращаются ли люди к боту?' }, nom: { uz: 'Qaytganlar foizi', ru: 'Процент вернувшихся' }, def: { uz: <>Kecha kelgan har yuzta odamdan nechtasi bugun ham keldi — shu <b>qaytganlar foizi</b>.</>, ru: <>Сколько из каждой сотни вчерашних людей пришли и сегодня — это и есть <b>процент вернувшихся</b>.</> }, en: { uz: <><b>retention</b> («ushlab qolish»)</>, ru: <><b>retention</b> («удержание»)</> } },
  { k: 'kerak', dot: 'bosh', line: { uz: 'Keragini olganlar: 4', ru: 'Получившие нужное: 4' }, q: { uz: "Bot o'z ishini bajardimi?", ru: 'Сделал ли бот свою работу?' }, nom: { uz: 'Bosh raqam', ru: 'Главная цифра' }, def: { uz: <>Bot o'z ishini bajarganini sanaydigan raqam. Bu botda — keragini olgan odamlar.</>, ru: <>Цифра, которая считает, что бот сделал свою работу. В этом боте — люди, получившие нужное.</> }, en: { uz: <><b>North Star</b> («Qutb yulduzi» — yo'l ko'rsatadigan yulduz)</>, ru: <><b>North Star</b> («Полярная звезда» — звезда, указывающая путь)</> } },
];
const Screen5 = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState([]);
  const [jamiSeen, setJamiSeen] = useState(false);
  const allSeen = NOMLAR.every(n => seen.includes(n.k));
  // 46-qonun: qator qayta bosilsa karta yopiladi; bir vaqtda bitta karta ochiq (400-belgi).
  const toggle = (k) => {
    setOpen(o => (o === k ? null : k));
    if (k === 'jami') setJamiSeen(true);
    else setSeen(p => (p.includes(k) ? p : [...p, k]));
  };
  const pend = NOMLAR.map(n => n.k).filter(k => !seen.includes(k));
  const lit = useTurnWalk(isMentor ? [] : pend);
  const cur = NOMLAR.find(n => n.k === open);
  const qoldi = pend.length;
  return (
    <Stage eyebrow={tr({ uz: 'Muhokama · uch nom', ru: 'Обсуждение · три названия' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!allSeen && !isMentor} disabled={!allSeen && !isMentor} label={allSeen || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${qoldi} qatorni oching`, ru: `Осталось открыть строк: ${qoldi}` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har raqam qaysi <span className="italic" style={{ color: T.accent }}>savolga</span> javob beradi?</>, ru: <>На какой <span className="italic" style={{ color: T.accent }}>вопрос</span> отвечает каждая цифра?</> })}</h2></div>
        <Mentor>{tr({ uz: 'Har qatorni birma-bir bosing.', ru: 'Нажмите на каждую строку по очереди.' })}</Mentor>
        <div className="split s5 fade-up delay-1">
          <Col gap={8}>
            <span className="mon-chip">{tr({ uz: 'Bu dushanba', ru: 'Этот понедельник' })}</span>
            <div className="tg">
              <span className="tg-me">/stat</span>
              <div className="tg-bot">
                <button type="button" className={`tg-l jami tap${open === 'jami' ? ' on' : ''}${jamiSeen ? ' seen' : ''}`} onClick={() => toggle('jami')}><RowDot v="jami" />{tr({ uz: 'Jami: 120', ru: 'Всего: 120' })}</button>
                {NOMLAR.map(n => (
                  <button key={n.k} type="button" className={`tg-l tap${open === n.k ? ' on' : ''}${seen.includes(n.k) ? ' seen' : ''}${turnCls(lit, n.k, pend.length > 1)}`} onClick={() => toggle(n.k)}><RowDot v={n.dot} />{tr(n.line)}</button>
                ))}
              </div>
            </div>
          </Col>
          <Col gap={8}>
            {open === 'jami' && (
              <div className="nomk fade-step" key="jami">
                <span className="nomk-q">{tr({ uz: '«Botga jami qancha odam keldi?»', ru: '«Сколько всего людей пришло к боту?»' })}</span>
                <p className="nomk-def">{tr({ uz: "Botga /start bosgan hamma odam, har biri bir marta. U faqat o'sadi: bot qanday ishlayotganini yolg'iz aytmaydi.", ru: 'Все люди, нажавшие у бота /start, каждый один раз. Это число только растёт и само по себе не скажет, как работает бот.' })}</p>
              </div>
            )}
            {cur && (
              <div className="nomk fade-step" key={cur.k}>
                <span className="nomk-q">«{tr(cur.q)}»</span>
                <span className="nomk-nom"><RowDot v={cur.dot} />{tr(cur.nom)}</span>
                <p className="nomk-def">{tr(cur.def)}</p>
                <span className="nomk-en">{tr({ uz: <>Inglizchasi: {tr(cur.en)}</>, ru: <>По-английски: {tr(cur.en)}</> })}</span>
              </div>
            )}
            {!open && <span className="tg-empty nomk-wait">· · ·</span>}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

const Screen6 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · qaysi raqam', ru: 'Проверка · какая цифра' })} scope="module-mikro"
    question={<TestQ ask={tr({ uz: 'Kecha 10 odam keldi. Ulardan 3 tasi bugun ham keldi. Bu qaysi raqam haqida?', ru: 'Вчера пришли 10 человек. 3 из них пришли и сегодня. О какой это цифре?' })} />}
    questionText="Kecha 10 odam keldi. Ulardan 3 tasi bugun ham keldi. Bu qaysi raqam haqida?"
    options={[{ uz: 'Bugun kelganlar soni', ru: 'Число пришедших сегодня' }, { uz: 'Botning bosh raqami', ru: 'Главная цифра бота' }, { uz: 'Qaytganlar foizi', ru: 'Процент вернувшихся' }]}
    correctIdx={2}
    explainCorrect={{ uz: 'Kechagi 10 odamdan bugun ham kelgan 3 tasi sanalyapti — bu qaytganlar foizi.', ru: 'Считаются 3 человека из вчерашних 10, которые пришли и сегодня, — это процент вернувшихся.' }}
    explainWrong={{
      0: { uz: "Bugun kelganlar — bugun botga yozgan hamma odam. Bu yerda esa faqat kechagilardan kelganlar sanalyapti.", ru: '«Пришли сегодня» — все, кто сегодня написал боту. А здесь считаются только пришедшие из вчерашних.' },
      1: { uz: "Bosh raqam odam keragini olganini sanaydi. Bu yerda esa kechagi odamlar qaytgani sanalyapti.", ru: 'Главная цифра считает, получил ли человек нужное. А здесь считается, вернулись ли вчерашние люди.' },
      default: { uz: "Kechagi odamlardan bugun ham kelganlar — qaytganlar.", ru: 'Те из вчерашних, кто пришёл и сегодня, — это вернувшиеся.' }
    }}
  />
);

// ===== SCREEN 7 — YADRO-2: FOIZ — ikki holatni yuzta odamga keltirish =====
const FOIZ_KEY = 'pm-m5mx-ulush';
const JUFT = [
  { k: 'A', fakt: { uz: 'Dushanba 40 odam keldi, seshanba ulardan 8 tasi qaytdi', ru: 'В понедельник пришли 40 человек, во вторник 8 из них вернулись' }, a: 8, b: 40, p: 20 },
  { k: 'B', fakt: { uz: 'Payshanba 10 odam keldi, juma ulardan 4 tasi qaytdi', ru: 'В четверг пришли 10 человек, в пятницу 4 из них вернулись' }, a: 4, b: 10, p: 40 },
];
const DotGrid = ({ on, lit }) => (
  <span className="dots10" aria-hidden="true">
    {Array.from({ length: 100 }).map((_, i) => <i key={i} className={lit && i < on ? 'on' : ''} style={lit && i < on ? { '--di': `${i * 0.012}s` } : undefined} />)}
  </span>
);
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [init] = useState(() => { try { return JSON.parse(localStorage.getItem(FOIZ_KEY) || 'null'); } catch { return null; } });
  const [bet, setBet] = useState(() => (init && typeof init.bet === 'string' ? init.bet : null));
  const [calc, setCalc] = useState(() => (init && Array.isArray(init.calc) ? init.calc : []));
  const done = JUFT.every(j => calc.includes(j.k));
  useEffect(() => { try { localStorage.setItem(FOIZ_KEY, JSON.stringify({ bet, calc, savedAt: Date.now() })); } catch {} }, [bet, calc]);
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'foiz', screenIdx: screen, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'foiz', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const betWave = useTurnHint(bet === null && !isMentor);
  const pendCalc = bet === null ? [] : JUFT.map(j => j.k).filter(k => !calc.includes(k));
  // A6: «Foizni hisoblash» navbat bilan — avval A, keyin B.
  const navbat = pendCalc.length ? pendCalc[0] : null;
  const lit = useTurnWalk(isMentor || !navbat ? [] : [navbat]);
  const mentorGap = bet === null ? tr({ uz: "Ikki holatni o'qing va birini tanlang — keyin foizni hisoblaymiz.", ru: 'Прочитайте два случая и выберите один — потом посчитаем процент.' })
    : !done ? tr({ uz: "Odam soni har kuni har xil — shuning uchun har yuztadan nechtasi qaytishini sanaymiz. Bu — foiz.", ru: 'Людей каждый день разное число — поэтому считаем, сколько из каждой сотни возвращаются. Это — процент.' })
      : bet === 'B' ? tr({ uz: "Aynan! Foiz ham shuni ko'rsatdi.", ru: 'Именно! Процент показал то же самое.' }) : tr({ uz: "Qiziq fikr! Ko'pchilik shunday tanlaydi — foiz esa boshqacha chiqdi.", ru: 'Интересная мысль! Многие так выбирают — а процент вышел другим.' });
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : bet === null ? tr({ uz: '① Qaysi holat yaxshiroq — tanlang', ru: '① Выберите, какой случай лучше' }) : tr({ uz: `② Yana ${pendCalc.length} holatda foizni hisoblang`, ru: `② Посчитайте процент — осталось случаев: ${pendCalc.length}` });
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · foiz', ru: 'Практика · процент' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.5vw,15px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi holat <span className="italic" style={{ color: T.accent }}>yaxshiroq</span>: 8 odam yoki 4 odam?</>, ru: <>Какой случай <span className="italic" style={{ color: T.accent }}>лучше</span>: 8 человек или 4 человека?</> })}</h2></div>
        <Mentor>{mentorGap}</Mentor>
        {bet === null ? (
          <div className="gt-btns fade-up delay-1">
            {JUFT.map((j, i) => (
              <button key={j.k} type="button" className={`gt-b${waveCls(betWave, i, 2)}`} disabled={isMentor} onClick={() => setBet(j.k)}>{tr({ uz: <>{j.k} holat</>, ru: <>Случай {j.k}</> })}</button>
            ))}
          </div>
        ) : (
          <div className="cmt-fold calm fade-step"><span className="cmt-done"><span className="cmt-tick">✓</span> {tr({ uz: <>Tanlovingiz: {bet} holat</>, ru: <>Ваш выбор: случай {bet}</> })}</span></div>
        )}
        <div className="fz fade-up delay-1">
          {JUFT.map(j => {
            const on = calc.includes(j.k);
            return (
              <div key={j.k} className={`fz-pair${on ? ' on' : ''}`}>
                <span className="fz-k">{j.k}</span>
                <p className="fz-fakt">{tr(j.fakt)}</p>
                <div className="fz-body">
                  <DotGrid on={j.p} lit={on} />
                  <div className="fz-side">
                    {on
                      ? <span className="fz-calc mono fade-step">{j.a} ÷ {j.b} × 100 = <b>{j.p}</b></span>
                      : <button type="button" className={`fz-btn${turnCls(lit, j.k, false)}`} disabled={bet === null || isMentor || navbat !== j.k} onClick={() => setCalc(p => (p.includes(j.k) ? p : [...p, j.k]))}>{bet === null ? tr({ uz: 'Avval holatni tanlang', ru: 'Сначала выберите случай' }) : tr({ uz: 'Foizni hisoblash', ru: 'Посчитать процент' })}</button>}
                    {on && <span className="fz-cap fade-step">{tr({ uz: <>yuzta odamdan {j.p} tasi</>, ru: <>{j.p} из ста человек</> })}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {done && (
          <div className="xul fade-step">
            <span className="xul-h">{tr({ uz: "8 odam 4 tadan ko'p, lekin foiz B da ikki barobar katta: 40 va 20.", ru: '8 человек больше, чем 4, но процент в случае B вдвое больше: 40 и 20.' })}</span>
            <p className="xul-b">{tr({ uz: "Odam soni har xil bo'lsa — foizni solishtiring.", ru: 'Если людей разное число — сравнивайте процент.' })}</p>
          </div>
        )}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Foizni hisoblaganlar', ru: 'Посчитали процент' }} />
        <MentorNote>{tr({ uz: "Ko'pchilik «A — 8 odam qaytdi» deb tanlaydi. Hisobni bolalar o'zi ochsin, keyin so'rang: 40 kishilik va 10 kishilik guruhni qanday solishtiramiz? Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Многие выбирают «A — вернулись 8 человек». Пусть ученики сами откроют расчёт, потом спросите: как сравнить группу из 40 человек и группу из 10? Это задание выполняют ученики, вы наблюдаете; «Продолжить» для вас открыта.' })}</MentorNote>
      </div>
    </Stage>
  );
};

const Screen8 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · foiz', ru: 'Проверка · процент' })} scope="module-mikro"
    question={<TestQ ask={tr({ uz: 'Bir kuni 20 odamdan 5 tasi qaytdi, boshqa kuni 6 odamdan 3 tasi. Qaysi kunda foiz katta?', ru: 'В один день из 20 человек вернулись 5, в другой — 3 из 6. В какой день процент больше?' })} />}
    questionText="Bir kuni 20 odamdan 5 tasi qaytdi, boshqa kuni 6 odamdan 3 tasi. Qaysi kunda foiz katta?"
    options={[{ uz: 'Ikkinchi kunda — 6 odamdan 3 tasi', ru: 'Во второй день — 3 из 6' }, { uz: 'Birinchi kunda — 20 odamdan 5 tasi', ru: 'В первый день — 5 из 20' }, { uz: 'Ikkala kunda teng — har kuni qaytgan bor', ru: 'Одинаково — вернувшиеся есть в оба дня' }]}
    correctIdx={0}
    explainCorrect={{ uz: "Yuzta odamga keltirilsa, ikkinchi kunda 50, birinchisida 25 odam qaytgan bo'lardi.", ru: 'Если привести к сотне человек, во второй день вернулись бы 50, в первый — 25.' }}
    explainWrong={{
      1: { uz: "5 ta 3 tadan ko'p, lekin guruhlar har xil: 20 odamdan 5 tasi — yuztadan 25, 6 odamdan 3 tasi — yuztadan 50.", ru: '5 больше, чем 3, но группы разные: 5 из 20 — это 25 из ста, 3 из 6 — 50 из ста.' },
      2: { uz: "Ikkala kunda ham odam qaytgan, lekin foizlari har xil: 25 va 50.", ru: 'Люди вернулись в оба дня, но проценты разные: 25 и 50.' },
      default: { uz: "Guruhlar har xil kattalikda — foizni solishtiring.", ru: 'Группы разного размера — сравнивайте процент.' }
    }}
  />
);

// ===== SCREEN 9 — K9 BOOKING.COM: 2 slayd + 2 bashorat + ko'prik (5 bosqich) (33/56/91b-qonun) =====
// 🔴 §101/§124: faqat bank faktlari. Booking qaysi raqamga qaragani AYTILMAYDI. «A/B» so'zi 0 (29-qonun).
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
// Booking.com sahnasi — 5 kadr (har bosqichga bittadan), emoji turlari: 💻 📊
const KEYS_SCENE = {alt: {uz: "Saytdagi odamlar: yangi rangni bir qismi ko'radi, qolgani eskisini; keyin ikki guruhning raqami solishtiriladi", ru: "Люди на сайте: новый цвет видит часть, остальные — старый; потом цифры двух групп сравнивают"}, items: [{id: "site", e: "💻", x: 9, y: 50}, {id: "p1", d: 1, x: 24, y: 20}, {id: "p2", d: 1, x: 32, y: 20}, {id: "p3", d: 1, x: 40, y: 20}, {id: "p4", d: 1, x: 48, y: 20}, {id: "p5", d: 1, x: 24, y: 40}, {id: "p6", d: 1, x: 32, y: 40}, {id: "p7", d: 1, x: 40, y: 40}, {id: "p8", d: 1, x: 48, y: 40}, {id: "p9", d: 1, x: 24, y: 60}, {id: "p10", d: 1, x: 32, y: 60}, {id: "p11", d: 1, x: 40, y: 60}, {id: "p12", d: 1, x: 48, y: 60}, {id: "p13", d: 1, x: 24, y: 80}, {id: "p14", d: 1, x: 32, y: 80}, {id: "p15", d: 1, x: 40, y: 80}, {id: "p16", d: 1, x: 48, y: 80}, {id: "ch", e: "📊", x: 76, y: 50}, {id: "ok", t: "✓", x: 86, y: 50}], lines: [["p6", "ch"], ["p12", "ch"]], frames: [{on: ["site", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12", "p13", "p14", "p15", "p16"], cap: {uz: "Saytga kirganlar", ru: "Посетители сайта"}}, {pre: {on: ["site", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12", "p13", "p14", "p15", "p16"], cap: {uz: "Saytga kirganlar", ru: "Посетители сайта"}}, post: {on: ["site", "p1:alt", "p2:alt", "p3", "p4", "p5:alt", "p6:alt", "p7", "p8", "p9:alt", "p10:alt", "p11", "p12", "p13:alt", "p14:alt", "p15", "p16"], cap: {uz: "Yangi rang — bir qismiga", ru: "Новый цвет — части людей"}}}, {pre: {on: ["site", "p1:alt", "p2:alt", "p3", "p4", "p5:alt", "p6:alt", "p7", "p8", "p9:alt", "p10:alt", "p11", "p12", "p13:alt", "p14:alt", "p15", "p16"], cap: {uz: "Yangi rang — bir qismiga", ru: "Новый цвет — части людей"}}, post: {on: ["site", "p1:alt", "p2:alt", "p3", "p4", "p5:alt", "p6:alt", "p7", "p8", "p9:alt", "p10:alt", "p11", "p12", "p13:alt", "p14:alt", "p15", "p16", "ch"], lines: 2, cap: {uz: "Ikki guruh solishtiriladi", ru: "Две группы сравнивают"}}}, {on: ["site", "p1:alt", "p2:alt", "p3", "p4", "p5:alt", "p6:alt", "p7", "p8", "p9:alt", "p10:alt", "p11", "p12", "p13:alt", "p14:alt", "p15", "p16", "ch", "ok:ok"], lines: 2, cap: {uz: "Yaxshirog'i qoladi", ru: "Остаётся лучший"}}, {on: ["site", "p1:alt", "p2:alt", "p3", "p4", "p5:alt", "p6:alt", "p7", "p8", "p9:alt", "p10:alt", "p11", "p12", "p13:alt", "p14:alt", "p15", "p16", "ch", "ok:ok"], lines: 2, cap: {uz: "Yaxshirog'i qoladi", ru: "Остаётся лучший"}}]};
const K9_SLIDES = [
  { h: { uz: 'Joy band qilinadigan sayt', ru: 'Сайт для бронирования жилья' },
    body: { uz: <>Booking.com — mehmonxonada yoki ijara uyda oldindan joy band qilinadigan sayt. U yerda deyarli har bir o'zgarish — tugma rangi, matn, sahifadagi bo'limlar tartibi — <b>hammaga birdan ko'rsatilmaydi</b>.</>, ru: <>Booking.com — сайт, где заранее бронируют номер в гостинице или съёмное жильё. Там почти любое изменение — цвет кнопки, текст, порядок разделов на странице — <b>не показывают всем сразу</b>.</> } },
  { h: null, body: null,
    predict: { ask: { uz: 'Yangi tugma rangi avval kimga ko\'rsatiladi?', ru: 'Кому сначала покажут новый цвет кнопки?' }, chips: [
      { t: { uz: 'Saytdagi hamma odamga birdan', ru: 'Сразу всем на сайте' } },
      { t: { uz: 'Odamlarning bir qismiga', ru: 'Части людей' } },
      { t: { uz: 'Faqat kompaniya xodimlariga', ru: 'Только сотрудникам компании' } },
    ], ans: 1, hit: { uz: 'Aynan! Odamlarning bir qismiga.', ru: 'Именно! Части людей.' }, miss: { uz: 'Qiziq fikr! Aslida — odamlarning bir qismiga.', ru: 'Интересная мысль! На самом деле — части людей.' } } },
  { h: null, body: null,
    predict: { ask: { uz: 'Nega hammaga birdan emas?', ru: 'Почему не всем сразу?' }, chips: [
      { t: { uz: "Yangi rang hali tayyor bo'lmagani uchun", ru: 'Потому что новый цвет ещё не готов' } },
      { t: { uz: 'Hamma bir vaqtda saytga kirmagani uchun', ru: 'Потому что не все заходят на сайт одновременно' } },
      { t: { uz: 'Ikki guruhning raqamini solishtirish uchun', ru: 'Чтобы сравнить цифры двух групп' } },
    ], ans: 2, hit: { uz: 'Aynan! Ikki guruhning raqami solishtiriladi.', ru: 'Именно! Сравнивают цифры двух групп.' }, miss: { uz: 'Qiziq fikr! Aslida — ikki guruhning raqamini solishtirish uchun.', ru: 'Интересная мысль! На самом деле — чтобы сравнить цифры двух групп.' } } },
  { h: { uz: 'Ikki guruh — ikki raqam', ru: 'Две группы — две цифры' },
    body: { uz: <>Yangi rangni odamlarning bir qismi ko'radi, qolganlari eskisini ko'rib turadi. Keyin <b>ikki guruhning raqamlari solishtiriladi</b>: qaysi rangda raqam yaxshiroq bo'lsa, o'sha qoladi.</>, ru: <>Новый цвет видит часть людей, остальные продолжают видеть старый. Потом <b>сравнивают цифры двух групп</b>: с каким цветом цифра лучше, тот и остаётся.</> } },
  { h: null, body: null, bridge: true },
];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gateK = useContext(LiveGateCtx) || {};
  const isMentorK = !!(gateK.live && gateK.live.mode === 'mentor');
  const [i, setI] = useState(0);
  const [bets, setBets] = useState({});
  const [maxSeen, setMaxSeen] = useState(0);
  useEffect(() => { setMaxSeen(m => Math.max(m, i)); }, [i]);
  const last = i === K9_SLIDES.length - 1;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const c = K9_SLIDES[i];
  const bet = c.predict ? bets[i] : undefined;
  const betPending = !!(c.predict && bet === undefined);
  const betHint = useTurnHint(betPending && !isMentorK);
  const showSlide = c.h && (!c.predict || bet !== undefined);
  const N = K9_SLIDES.length;
  return (
    <Stage eyebrow={tr({ uz: 'Haqiqiy misol', ru: 'Реальный пример' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending && !isMentorK} disabled={betPending && !isMentorK} label={betPending && !isMentorK ? tr({ uz: 'Avval javobingizni belgilang', ru: 'Сначала отметьте свой ответ' }) : last ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Keyingi bosqich (${i + 1}/${N})`, ru: `Следующий шаг (${i + 1}/${N})` })} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen k-fill" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Booking.com'dagi <span className="italic" style={{ color: T.accent }}>yangi tugma rangi</span>.</>, ru: <>Новый <span className="italic" style={{ color: T.accent }}>цвет кнопки</span> на Booking.com.</> })}</h2></div>
        <KeysScene scene={KEYS_SCENE} step={i} answered={bet !== undefined} />
        {c.predict && (
          <div className={`kp-bet fade-step${bet !== undefined ? ' answered' : ''}`} key={`b${i}`}>
            <span className="k-slide-eyebrow">{bet === undefined ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала попробуйте ответить сами' }) : 'Booking.com'} · {i + 1} / {N}</span>
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
              <p className={`kp-res ${bet === c.predict.ans ? 'hit' : 'miss'}`}>{tr(bet === c.predict.ans ? c.predict.hit : c.predict.miss)}</p>
            )}
          </div>
        )}
        {showSlide && (
          <div className="k-slide fade-step" key={`s${i}`}>
            <span className="k-slide-eyebrow">Booking.com · {i + 1} / {N}</span>
            <h3 className="k-slide-h">{tr(c.h)}</h3>
            <p className="k-slide-body">{tr(c.body)}</p>
          </div>
        )}
        <div className="k-dots">{K9_SLIDES.map((_, k) => {
          const ochiq = k <= maxSeen && !(betPending && k > i);
          return <button key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} disabled={!ochiq} onClick={() => ochiq && setI(k)} aria-label={tr({ uz: `${k + 1}-bosqich`, ru: `Шаг ${k + 1}` })} title={ochiq ? undefined : tr({ uz: 'Avval shu bosqichni tugating', ru: 'Сначала завершите этот шаг' })} />;
        })}</div>
        {c.bridge && (
          <div className="frame-soft fade-step" key={`k${i}`}>
            <span className="k-slide-eyebrow">Booking.com · {i + 1} / {N}</span>
            <p className="body" style={{ margin: '10px 0 0', color: T.ink }}>{tr({ uz: <>Botingizda biror narsani o'zgartirsangiz — tugma qo'shsangiz yoki 9-darsdagidek fikrga qarab tuzatsangiz — shu savol chiqadi: bot yaxshi bo'ldimi? Buni bilish uchun bosh raqamni o'zgarishdan <b>oldin</b> o'lchab qo'yasiz, keyin yangi raqam bilan solishtirasiz.</>, ru: <>Когда вы что-то меняете в боте — добавляете кнопку или исправляете по отзывам, как на 9-м уроке, — возникает тот же вопрос: стал ли бот лучше? Чтобы это узнать, вы измеряете главную цифру <b>до</b> изменения, а потом сравниваете с новой цифрой.</> })}</p>
          </div>
        )}
        <MentorNote>{tr({ uz: "Booking qaysi raqamga qaraganini manba aytmaydi — o'zingizdan qo'shmang. Sinov usulini (odamlar guruhlarga qanday bo'linadi, qancha kutiladi) batafsil ochmang: bu darsda faqat g'oya kerak — o'zgarishni avval odamlarning bir qismi ko'radi va ikki guruhning raqami solishtiriladi.", ru: 'На какую цифру смотрел Booking, источник не говорит — не добавляйте от себя. Способ проверки (как людей делят на группы, сколько ждут) подробно не раскрывайте: на этом уроке нужна только идея — изменение сначала видит часть людей, и цифры двух групп сравнивают.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — BOTINGIZNING TO'RT RAQAMI (48/80/85/106d-qonun · bittalab-yozish) =====
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
// «Bot buni qachon biladi» chiplari = o'quvchi m5-03 da yozgan to'rt handler (87c). Chipda kod YO'Q.
const QACHON = [
  { k: 'start', t: { uz: '/start bosilganda', ru: 'нажали /start' }, kod: 'bot.start' },
  { k: 'xabar', t: { uz: 'xabar kelganda', ru: 'пришло сообщение' }, kod: "bot.on('text')" },
  { k: 'tugma', t: { uz: 'tugma bosilganda', ru: 'нажали кнопку' }, kod: 'bot.action / bot.hears' },
  { k: 'javob', t: { uz: 'bot kerakli javobni yuborganda', ru: 'бот отправил нужный ответ' }, kod: 'ctx.reply' },
];
const qachonMatn = (arr) => QACHON.filter(q => arr.includes(q.k)).map(q => tr(q.t)).join(tr({ uz: ' yoki ', ru: ' или ' }));
const RQ_CARDS = [
  { dot: 'bosh', nom: { uz: 'Bosh raqam', ru: 'Главная цифра' }, fixedNom: true, pre: '' },
  { dot: '', nom: { uz: 'Bugun kelganlar', ru: 'Пришли сегодня' }, fixedNom: true, pre: { uz: 'bugun botga yozgan yoki tugma bosgan odamlar', ru: 'люди, которые сегодня написали боту или нажали кнопку' } },
  { dot: '', nom: { uz: 'Qaytganlar foizi', ru: 'Процент вернувшихся' }, fixedNom: true, pre: { uz: 'kecha kelganlardan bugun ham kelganlar, foizda', ru: 'вчерашние, которые пришли и сегодня, в процентах' } },
  { dot: '', nom: '', fixedNom: false, pre: '' },
];
const normNom = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [eshitgan] = useState(() => readEshitgan());
  const [list, setList] = useState(() => {
    if (storedAnswer && Array.isArray(storedAnswer.kartalar)) return storedAnswer.kartalar;
    const v = readRaqamlar();
    return v ? [{ nom: tr({ uz: 'Bosh raqam', ru: 'Главная цифра' }), nima: v.bosh.nima, qachon: v.bosh.qachon || [] }, ...v.raqamlar.slice(0, 3)] : [];
  });
  const [edit, setEdit] = useState(null);
  const cur = edit === null ? list.length : edit;
  const card = RQ_CARDS[Math.min(cur, 3)];
  const [dNom, setDNom] = useState('');
  const [dNima, setDNima] = useState(() => tr(RQ_CARDS[Math.min(list.length, 3)].pre));
  const [dQ, setDQ] = useState([]);
  const [msg, setMsg] = useState('');
  const [yordamOpen, setYordamOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const done = list.length >= 4;
  const savedRef = useRef(false);
  const nimaOk = dNima.trim().length >= 3;
  const nomOk = card.fixedNom || dNom.trim().length >= 2;
  const takror = !card.fixedNom && nomOk && [RQ_CARDS[1].nom, RQ_CARDS[2].nom, RQ_CARDS[0].nom].some(n => normNom(tr(n)) === normNom(dNom));
  const qOk = dQ.length > 0;
  const canSave = nimaOk && nomOk && !takror && qOk;
  const writeOut = (l) => {
    try { localStorage.setItem(OUT_KEY, JSON.stringify({ bosh: { nima: l[0].nima, qachon: l[0].qachon }, raqamlar: l.slice(1, 4).map(r => ({ nom: r.nom, nima: r.nima, qachon: r.qachon })), savedAt: Date.now() })); } catch {}
  };
  useEffect(() => {
    if (!done || savedRef.current) return;
    savedRef.current = true;
    writeOut(list);
    if (storedAnswer === undefined || !storedAnswer.solved) {
      onAnswer(screen, { stage: 'raqamlar', screenIdx: screen, kartalar: list.slice(0, 4), solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'raqamlar', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  useEffect(() => { if (done && savedRef.current) writeOut(list); }, [list, done]);
  useEffect(() => {
    if (!msg) return undefined;
    const t = setTimeout(() => setMsg(''), 4200);
    return () => clearTimeout(t);
  }, [msg]);
  const toggleQ = (k) => setDQ(p => (p.includes(k) ? p.filter(x => x !== k) : [...p, k]));
  const save = () => {
    if (!canSave) return;
    const v = { nom: card.fixedNom ? tr(card.nom) : dNom.trim(), nima: dNima.trim(), qachon: dQ };
    const nextL = edit === null ? [...list, v] : list.map((r, k) => (k === edit ? v : r));
    setList(nextL);
    setMsg(tr({ uz: `✓ ${v.nom} yozildi: «${qisqa(v.nima, 40)}» — bot uni ${qachonMatn(v.qachon)} sanaydi.`, ru: `✓ ${v.nom} — записано: «${qisqa(v.nima, 40)}». Бот считает, когда ${qachonMatn(v.qachon)}.` }));
    const nx = edit === null ? nextL.length : null;
    setEdit(null); setDNom(''); setDQ([]);
    setDNima(nx !== null && nx < 4 ? tr(RQ_CARDS[nx].pre) : '');
  };
  const startEdit = (k) => { setEdit(k); setDNom(k === 3 ? list[k].nom : ''); setDNima(list[k].nima); setDQ(list[k].qachon || []); setMsg(''); };
  const hasQ = list.length > 0 && list.every(r => r.qachon && r.qachon.length > 0);
  const need = (!dNima.trim() && dQ.length === 0 && !dNom.trim()) ? ''
    : !nimaOk ? tr({ uz: "Nimani sanashini yozing.", ru: 'Напишите, что она считает.' })
    : !nomOk ? tr({ uz: 'Raqamingizga qisqa nom bering.', ru: 'Дайте цифре короткое название.' })
      : takror ? tr({ uz: "Bu raqam allaqachon yozilgan — boshqasini tanlang.", ru: 'Эта цифра уже записана — выберите другую.' })
        : !qOk ? tr({ uz: "Nima bo'lganda sanalishini tanlang — kamida bittasini.", ru: 'Выберите, когда она считается, — хотя бы один вариант.' }) : '';
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : list.length === 0 ? tr({ uz: '① Bosh raqamni yozing', ru: '① Запишите главную цифру' })
      : tr({ uz: `② Yana ${4 - list.length} raqamni yozing`, ru: `② Осталось записать цифр: ${4 - list.length}` });
  const editing = !done || edit !== null;
  return (
    <Stage eyebrow={tr({ uz: "Mustaqil ish · to'rt raqam", ru: 'Самостоятельная работа · четыре цифры' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Botingiz nimani <span className="italic" style={{ color: T.accent }}>sanaydi</span>?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>считает</span> ваш бот?</> })}</h2></div>
        {eshitgan && <span className="tasma fade-up">{tr({ uz: <>8-darsda eshitgan javoblaringiz: {eshitgan.join(' · ')}</>, ru: <>Ответы, которые вы услышали на 8-м уроке: {eshitgan.join(' · ')}</> })}</span>}
        {list.length === 0 && edit === null && <Mentor>{eshitgan
          ? tr({ uz: "Tepada — 8-darsda eshitgan javoblaringiz. Ularni botingiz sanay oladigan raqamga aylantiring.", ru: 'Вверху — ответы, которые вы услышали на 8-м уроке. Превратите их в цифры, которые ваш бот сможет посчитать.' })
          : tr({ uz: "Botingiz odamga nima beradi? Shuni sanaydigan raqamlarni yozing.", ru: 'Что ваш бот даёт человеку? Запишите цифры, которые это считают.' })}</Mentor>}
        {editing && <div className="stps fade-up">
          {RQ_CARDS.map((c, k) => (
            <span key={k} className={`stp ${list.length > k && edit !== k ? 'done' : cur === k ? 'on' : ''}`}><i>{list.length > k && edit !== k ? '✓' : k + 1}</i>{tr(c.nom) || tr({ uz: "O'z raqamingiz", ru: 'Ваша цифра' })}</span>
          ))}
        </div>}
        <div className="split">
          <Col gap={9}>
            {editing && (
              <div className="wsp-ed rq-ed" key={`c${cur}`}>
                <span className="rq-h"><RowDot v={card.dot} />{tr(card.nom) || tr({ uz: "O'z raqamingiz", ru: 'Ваша цифра' })}</span>
                {!card.fixedNom && (
                  <input className={`reflect-input${dNom.trim() ? ' filled' : ''}`} value={dNom} maxLength={32} placeholder={tr({ uz: 'Masalan: Menyu bosganlar', ru: 'Например: Нажали «Меню»' })} aria-label={tr({ uz: 'Raqamning qisqa nomi', ru: 'Короткое название цифры' })} onChange={e => setDNom(e.target.value)} />
                )}
                <span className="rq-lbl">{tr({ uz: 'Nimani sanaydi:', ru: 'Что считает:' })}</span>
                <input className={`reflect-input${nimaOk ? ' filled' : ''}`} value={dNima} maxLength={80} placeholder={cur === 3 ? tr({ uz: "Masalan: «Menyu» tugmasini bosgan odamlar", ru: 'Например: люди, нажавшие кнопку «Меню»' }) : tr({ uz: 'Nimani sanaysiz?', ru: 'Что вы считаете?' })} aria-label={tr({ uz: 'Bu raqam nimani sanaydi', ru: 'Что считает эта цифра' })} onChange={e => setDNima(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') save(); }} />
                {/* A6: «Nimani sanaydi» to'lgach — «Nima bo'lganda sanaladi» */}
                {nimaOk && <span className="rq-lbl fade-step">{tr({ uz: "Nima bo'lganda sanaladi:", ru: 'Когда считается:' })}</span>}
                {nimaOk && <div className="rq-chips fade-step">
                  {QACHON.map(q => (
                    <button key={q.k} type="button" className={`rq-chip${dQ.includes(q.k) ? ' on' : ''}`} aria-pressed={dQ.includes(q.k)} onClick={() => toggleQ(q.k)}>
                      {dQ.includes(q.k) ? '✓ ' : ''}{tr(q.t)}{edit !== null && <i className="rq-kod mono">= {q.kod}</i>}
                    </button>
                  ))}
                </div>}
                <div className="wsp-go">
                  <button type="button" className="wsp-save" disabled={!canSave} onClick={save}>{edit === null ? tr({ uz: 'Saqlash →', ru: 'Сохранить →' }) : tr({ uz: '✓ Yangilash', ru: '✓ Обновить' })}</button>
                  {!canSave && <span className="wsp-need">{need}</span>}
                </div>
                <span className="rq-note">{tr({ uz: 'Bir odam bir kunda bir marta sanaladi.', ru: 'Один человек за день считается один раз.' })}</span>
              </div>
            )}
            {msg && <p className="sfb ok fade-step">{msg}</p>}
            {done && edit === null && (
              <div className="wsp-list fade-step">
                <span className="wsp-list-h">{tr({ uz: "Botingizning to'rt raqami", ru: 'Четыре цифры вашего бота' })}</span>
                {list.slice(0, 4).map((r, k) => (
                  <span key={k} className="wsp-item">
                    <span className="wsp-item-n">{k + 1}</span>
                    <span className="wsp-item-t"><b>{r.nom}</b> <i className="wsp-arw">·</i> {r.nima} <i className="wsp-arw">·</i> {qachonMatn(r.qachon)}</span>
                    <button type="button" className="wsp-item-edit" onClick={() => startEdit(k)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button>
                  </span>
                ))}
              </div>
            )}
          </Col>
          <Col gap={9}>
            <div className="wsp-task">
              <span className="wsp-task-lbl">{tr({ uz: 'Topshiriq', ru: 'Задание' })}</span>
              <span className="wsp-task-nom">{tr({ uz: "To'rt raqam", ru: 'Четыре цифры' })}</span>
              <div className="wsp-chk">
                <span className={`wsp-chk-i${list.length >= 1 ? ' on' : ''}`}><i>{list.length >= 1 ? '✓' : '○'}</i>{tr({ uz: "Bosh raqam — bot o'z ishini bajarganini sanaydi", ru: 'Главная цифра — считает, что бот сделал свою работу' })}</span>
                <span className={`wsp-chk-i${done && hasQ ? ' on' : ''}`}><i>{done && hasQ ? '✓' : '○'}</i>{tr({ uz: "«Nima bo'lganda» tanlangan", ru: '«Когда считается» выбрано' })}</span>
                <span className={`wsp-chk-i${done ? ' on' : ''}`}><i>{done ? '✓' : '○'}</i>{tr({ uz: '4-raqam takrorlanmaydi', ru: '4-я цифра не повторяется' })}</span>
              </div>
            </div>
            <div className="wsxrow">
              {editing && (
                <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
                  <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })} {yordamOpen ? '▾' : '▸'}</button>
                  {yordamOpen && <div className="wsx-body"><p>{tr({ uz: <>Botingiz odamga nima beradi? Odam shuni olsa — <b>bitta sanaladi</b>. Bot buni odamdan so'ramaydi: o'zi yuborgan kerakli javobdan sanaydi (masalan, «buyurtmangiz saqlandi»).</>, ru: <>Что ваш бот даёт человеку? Если человек это получил — <b>засчитывается один</b>. Бот не спрашивает об этом человека: он считает по нужному ответу, который сам отправил (например, «ваш заказ сохранён»).</> })}</p></div>}
                </div>
              )}
              {done && (
                <div className={`wsx star ${starOpen ? 'open' : ''}`}>
                  <button className="wsx-toggle" onClick={() => setStarOpen(o => !o)}>{tr({ uz: "Qo'shimcha", ru: 'Дополнительно' })} {starOpen ? '▾' : '▸'}</button>
                  {starOpen && <div className="wsx-body"><p>{tr({ uz: 'Bugun botingizni kimlar ishlatganini eslang (masalan, sinfdoshlaringiz) va ularni sanang — bir odam bir marta.', ru: 'Вспомните, кто сегодня пользовался вашим ботом (например, одноклассники), и посчитайте их: один человек — один раз.' })}</p></div>}
                </div>
              )}
            </div>
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label={{ uz: "To'rt raqamni yozganlar", ru: 'Записали четыре цифры' }} />
          </Col>
        </div>
        <MentorNote>{tr({ uz: "«Odamlar mamnun» deb yozganlarga bitta savol: buni bot qaysi xabardan biladi? Javob topilmasa — raqam emas, fikr yozilgan. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Тем, кто написал «Люди довольны», один вопрос: из какого сообщения бот это узнает? Если ответа нет — записана не цифра, а мнение. Это задание выполняют ученики, вы наблюдаете; «Продолжить» для вас открыта.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — TEKSHIRUV: YOZUVDAN SANASH (26-qonun: yangi mexanika) =====
// Obyekt — bot-yozuvi qatorlari, harakat — SANASH, mezon — odam yagonaligi + hodisa turi.
const YOZUV_KEY = 'pm-m5mx-yozuv';
const LOG = [
  { v: '08:40', who: 'Kamola', bot: false, t: { uz: '/start bosdi', ru: 'нажала /start' } },
  { v: '08:40', who: 'Kamola', bot: true, ok: true, t: { uz: 'kerakli javobni yubordi', ru: 'отправил нужный ответ' } },
  { v: '09:15', who: 'Otabek', bot: false, t: { uz: '«salom» deb yozdi', ru: 'написал «привет»' } },
  { v: '09:15', who: 'Otabek', bot: true, t: { uz: '«Tushunmadim» dedi', ru: 'ответил «Не понял»' } },
  { v: '12:02', who: 'Kamola', bot: false, t: { uz: 'tugma bosdi', ru: 'нажала кнопку' } },
  { v: '12:02', who: 'Kamola', bot: true, ok: true, t: { uz: 'kerakli javobni yubordi', ru: 'отправил нужный ответ' } },
  { v: '16:30', who: 'Bekzod', bot: false, t: { uz: 'tugma bosdi', ru: 'нажал кнопку' } },
  { v: '16:30', who: 'Bekzod', bot: true, ok: true, t: { uz: 'kerakli javobni yubordi', ru: 'отправил нужный ответ' } },
  { v: '18:10', who: 'Sevara', bot: false, t: { uz: '/start bosdi', ru: 'нажала /start' } },
  { v: '18:10', who: 'Sevara', bot: true, t: { uz: 'salom berdi', ru: 'поздоровался' } },
];
const KECHA = ['Kamola', 'Otabek', 'Dilshod', 'Madina'];
// Xato bo'lsa — BITTA izoh: sabab topilsa sabab (why), topilmasa maslahat (hint).
const YZ_Q = [
  { q: { uz: 'Bugun kelganlar — kimlar botga keldi?', ru: '«Пришли сегодня» — кто приходил к боту?' }, rows: (r) => true, same: (r) => !r.bot, want: ['Kamola', 'Otabek', 'Bekzod', 'Sevara'],
    ok: { uz: 'Bugun 4 odam keldi: Kamola ikki marta yozdi, lekin bir marta sanaladi.', ru: 'Сегодня пришли 4 человека: Kamola написала дважды, но считается один раз.' }, hint: { uz: "Hali hammasi emas — yozuvni oxirigacha ko'ring.", ru: 'Ещё не все — просмотрите журнал до конца.' },
    why: (r, dup) => (r.bot ? { uz: "Bu qatorni bot yozgan — odam emas.", ru: 'Эту строку написал бот, а не человек.' } : dup ? { uz: `${r.who} allaqachon sanalgan — bir odam bir marta.`, ru: `${r.who} уже в списке: один человек — один раз.` } : null) },
  { q: { uz: 'Bosh raqam — kim keragini oldi?', ru: 'Главная цифра — кто получил нужное?' }, rows: (r) => r.bot, same: (r) => !!r.ok, want: ['Kamola', 'Bekzod'],
    ok: { uz: 'Keragini 2 odam oldi: Kamola va Bekzod.', ru: 'Нужное получили 2 человека: Kamola и Bekzod.' }, hint: { uz: 'Kerakli javob olgan yana bir odam bor.', ru: 'Есть ещё один человек, получивший нужный ответ.' },
    why: (r, dup) => (r.who === 'Otabek' ? { uz: "Otabek javob oldi, lekin keragini emas — bu raqamga qo'shilmaydi.", ru: 'Otabek получил ответ, но не нужный — в эту цифру он не входит.' } : r.who === 'Sevara' ? { uz: 'Salom — hali odamga kerakli javob emas.', ru: 'Приветствие — это ещё не нужный ответ.' } : dup ? { uz: `${r.who} allaqachon sanalgan — bir odam bir marta.`, ru: `${r.who} уже в списке: один человек — один раз.` } : null) },
  { q: { uz: 'Qaytganlar — kechagilardan kim bugun ham keldi?', ru: 'Вернувшиеся — кто из вчерашних пришёл и сегодня?' }, rows: (r) => !r.bot, same: (r) => !r.bot, want: ['Kamola', 'Otabek'],
    ok: { uz: "Kecha kelgan 4 odamdan 2 tasi bugun ham keldi — qaytganlar foizi 50.", ru: 'Из 4 вчерашних человек 2 пришли и сегодня — процент вернувшихся 50.' }, hint: { uz: "Kechagi ro'yxatdan yana bir ism bugun ham bor.", ru: 'Из вчерашнего списка сегодня есть ещё одно имя.' },
    why: (r, dup) => (dup ? { uz: `${r.who} allaqachon sanalgan — bir odam bir marta.`, ru: `${r.who} уже в списке: один человек — один раз.` } : !KECHA.includes(r.who) ? { uz: `${r.who} kecha kelmagan — u bugun birinchi marta keldi.`, ru: `${r.who} нет во вчерашнем списке — сегодня это первый приход.` } : null) },
];
// A7 (KOD): to'g'ri javobda belgilangan qatorlardan natijadagi ismlarga chiziq chiziladi — bir odamning
// ikki qatori bitta ismga qo'shiladi. Ustunlar bir-birining ostiga tushganda (≤860px) chiziq ko'rsatilmaydi.
const YZ_WIDE = 860;
function useYzLines(boxRef, rowRefs, nameRefs, active, pairs) {
  const [lines, setLines] = useState([]);
  const key = active ? pairs.map(p => `${p.i}-${p.who}`).join('|') : '';
  useEffect(() => {
    if (!active) { setLines([]); return undefined; }
    const calc = () => {
      const box = boxRef.current;
      if (!box || typeof window === 'undefined' || window.innerWidth <= YZ_WIDE) { setLines([]); return; }
      const br = box.getBoundingClientRect();
      const k = box.offsetWidth ? br.width / box.offsetWidth : 1;
      const out = [];
      for (const p of pairs) {
        const re = rowRefs.current[p.i], ne = nameRefs.current[p.who];
        if (!re || !ne) continue;
        const a = re.getBoundingClientRect(), b = ne.getBoundingClientRect();
        out.push({ id: `${p.i}-${p.who}`, x1: (a.right - br.left) / k, y1: (a.top + a.height / 2 - br.top) / k, x2: (b.left - br.left) / k, y2: (b.top + b.height / 2 - br.top) / k });
      }
      setLines(out);
    };
    const t = setTimeout(calc, 60);
    window.addEventListener('resize', calc);
    return () => { clearTimeout(t); window.removeEventListener('resize', calc); };
  }, [key]); // eslint-disable-line
  return lines;
}
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const am = useContext(AchMissCtx);
  const [init] = useState(() => { try { return JSON.parse(localStorage.getItem(YOZUV_KEY) || 'null'); } catch { return null; } });
  const [q, setQ] = useState(() => (init && Number.isInteger(init.q) ? Math.min(init.q, 3) : 0));
  const [sel, setSel] = useState([]);
  const [res, setRes] = useState(null); // null | { ok, text, row }
  const finished = q >= YZ_Q.length;
  useEffect(() => { try { localStorage.setItem(YOZUV_KEY, JSON.stringify({ q, savedAt: Date.now() })); } catch {} }, [q]);
  useEffect(() => {
    if (finished && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'yozuv', screenIdx: screen, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'yozuv', 0, true, 0);
    }
  }, [finished]); // eslint-disable-line
  const Q = YZ_Q[Math.min(q, YZ_Q.length - 1)];
  const toggle = (i) => {
    if (isMentor || finished || (res && res.ok)) return;
    setRes(null);
    setSel(p => (p.includes(i) ? p.filter(x => x !== i) : [...p, i]));
  };
  const check = () => {
    const seenW = [];
    let reason = null;
    for (const i of [...sel].sort((a, b) => a - b)) {
      const r = LOG[i];
      const dup = seenW.includes(r.who);
      const w = Q.why(r, dup);
      if (w && !reason) reason = { i, w };
      if (!dup) seenW.push(r.who);
    }
    const whoSet = [...new Set(sel.map(i => LOG[i].who))];
    const exact = !reason && whoSet.length === Q.want.length && Q.want.every(w => whoSet.includes(w)) && sel.length === Q.want.length;
    if (exact) { setRes({ ok: true, text: Q.ok }); return; }
    if (am && !am.practice) am.miss(screen);
    setRes({ ok: false, text: reason ? reason.w : Q.hint, row: reason ? reason.i : null });
  };
  const nextQ = () => { setQ(v => v + 1); setSel([]); setRes(null); };
  const pendWave = useTurnHint(!finished && sel.length === 0 && !isMentor);
  const navLabel = finished || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${YZ_Q.length - q} savolni tekshiring`, ru: `Осталось проверить вопросов: ${YZ_Q.length - q}` });
  // Chiziq: shu savolga mos har qator → natijadagi ism (ismlar qatordagi tartibda, takrorsiz).
  // Kamolaning ikki qatori bitta ismga tushadi — «bir odam bir marta» ko'z bilan ko'rinadi.
  const boxRef = useRef(null);
  const rowRefs = useRef({});
  const nameRefs = useRef({});
  const okNow = !!(res && res.ok && !finished);
  const pairs = okNow ? LOG.map((r, i) => ({ r, i })).filter(({ r }) => Q.want.includes(r.who) && Q.same(r)).map(({ r, i }) => ({ i, who: r.who })) : [];
  const names = [...new Set(pairs.map(p => p.who))];
  const lines = useYzLines(boxRef, rowRefs, nameRefs, okNow, pairs);
  return (
    <Stage eyebrow={tr({ uz: 'Tekshiruv · bot yozuvi', ru: 'Проверка · журнал бота' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!finished} disabled={!finished && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(9px,1.4vw,13px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Botning bir kunlik yozuvidan uch raqamni <span className="italic" style={{ color: T.accent }}>sanang</span>.</>, ru: <>По журналу бота за один день <span className="italic" style={{ color: T.accent }}>посчитайте</span> три цифры.</> })}</h2></div>
        {q === 0 && sel.length === 0 && !res && <Mentor>{tr({ uz: 'Har qator — botga kelgan hodisa (xabar, /start yoki tugma) yoki botning javobi. «Keragini oldi» — bot kerakli javobni yuborgan qator. Savolga mos qatorlarni bosing: bir odam bir marta sanaladi.', ru: 'Каждая строка — событие, пришедшее боту (сообщение, /start или кнопка), или ответ бота. «Получил нужное» — строка, где бот отправил нужный ответ. Нажимайте строки, подходящие к вопросу: один человек — один раз.' })}</Mentor>}
        <div className="split s11 yz-box" ref={boxRef}>
          <Col gap={8}>
            <div className="log fade-up delay-1" role="list">
              <span className="log-h">{tr({ uz: 'Seshanba · bot yozuvi', ru: 'Вторник · журнал бота' })}</span>
              {LOG.map((r, i) => {
                const can = !finished && Q.rows(r) && !isMentor;
                const on = sel.includes(i);
                const good = res && res.ok && on;
                const bad = res && !res.ok && res.row === i;
                return (
                  <button key={i} ref={el => { rowRefs.current[i] = el; }} type="button" role="listitem" className={`log-row${r.bot ? ' bot' : ' odam'}${on ? ' on' : ''}${good ? ' good' : ''}${bad ? ' bad' : ''}${can && pendWave ? ' hunt' : ''}`} disabled={!can} onClick={() => toggle(i)}>
                    <span className="log-n mono">{i + 1}</span>
                    <span className="log-v mono">{r.v}</span>
                    <span className="log-t">{r.bot ? tr({ uz: <>bot → {r.who} — {tr(r.t)}</>, ru: <>бот → {r.who} — {tr(r.t)}</> }) : <>{r.who} — {tr(r.t)}</>}</span>
                    {good && <span className="log-ok">✓</span>}
                  </button>
                );
              })}
            </div>
          </Col>
          <Col gap={9}>
            {!finished ? (
              <div className="wsp-task" key={`q${q}`}>
                <span className="wsp-task-lbl">{tr({ uz: <>Savol {q + 1} / {YZ_Q.length}</>, ru: <>Вопрос {q + 1} / {YZ_Q.length}</> })}</span>
                <span className="wsp-task-nom">{tr(Q.q)}</span>
                {q === 2 && <span className="tasma">{tr({ uz: <>Kecha kelganlar: {KECHA.join(' · ')}</>, ru: <>Вчера пришли: {KECHA.join(' · ')}</> })}</span>}
                <span className="yz-cnt mono">{tr({ uz: <>Belgilandi: {sel.length}</>, ru: <>Отмечено: {sel.length}</> })}</span>
                {!(res && res.ok) && <button type="button" className="wsp-save" disabled={sel.length === 0 || isMentor} onClick={check}>{tr({ uz: 'Tekshirish', ru: 'Проверить' })}</button>}
                {res && <p className={`sfb ${res.ok ? 'ok' : 'ask'} fade-step`}>{tr(res.text)}</p>}
                {okNow && (
                  <div className="yz-names fade-step">
                    {names.map(w => <span key={w} ref={el => { nameRefs.current[w] = el; }} className="yz-name">{w}</span>)}
                  </div>
                )}
                {res && res.ok && <button type="button" className="nextsig fade-step" onClick={nextQ}>{q < YZ_Q.length - 1 ? tr({ uz: 'Keyingi savol →', ru: 'Следующий вопрос →' }) : tr({ uz: 'Natijani ko\'rish →', ru: 'Посмотреть результат →' })}</button>}
                <AchRule screen={screen} />
              </div>
            ) : (
              <div className="xul fade-step">
                <span className="xul-h">{tr({ uz: 'Bugun kelganlar: 4 · Qaytganlar foizi: 50 · Bosh raqam: 2', ru: 'Пришли сегодня: 4 · Процент вернувшихся: 50 · Главная цифра: 2' })}</span>
                <p className="xul-b">{tr({ uz: "Bir kunning o'zidan uch xil raqam chiqdi — har biri boshqa savolga javob beradi.", ru: 'Из одного дня получились три разные цифры — каждая отвечает на свой вопрос.' })}</p>
              </div>
            )}
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Yozuvdan sanaganlar', ru: 'Посчитали по журналу' }} />
          </Col>
          {lines.length > 0 && (
            <svg className="yz-lines" aria-hidden="true">
              {lines.map((l, n) => {
                const mx = (l.x1 + l.x2) / 2;
                return <path key={l.id} pathLength="1" style={{ animationDelay: `${n * 0.12}s` }} d={`M${l.x1} ${l.y1} C${mx} ${l.y1}, ${mx} ${l.y2}, ${l.x2} ${l.y2}`} />;
              })}
            </svg>
          )}
        </div>
        <MentorNote>{tr({ uz: "Eng ko'p adashiladigan joy — Kamolaning ikkinchi qatori va Otabek: u keldi va qaytdi, lekin keragini olmadi. Uchala raqam har xil chiqishi — darsning o'zi. Juftlikda: sherigingiz oldingi ekranda yozgan bosh raqamni o'qing va so'rang: «Bot buni qaysi xabardan biladi?» Javob topilmasa — karta birga qayta yoziladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Чаще всего ошибаются на второй строке Kamola и на Otabek: он пришёл и вернулся, но нужное не получил. То, что все три цифры выходят разными, — и есть суть урока. В парах: прочитайте главную цифру, которую партнёр записал на прошлом экране, и спросите: «Из какого сообщения бот это узнает?» Если ответа нет — карточку переписывают вместе. Это задание выполняют ученики, вы наблюдаете; «Продолжить» для вас открыта.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — KODING: /stat buyrug'i — VS Code, o'quvchining O'Z bot.js fayli (26/82/87-qonun) =====
// Kod NUSXALANMAYDI (82d). Ma'lumot qo'lda yozilgan ro'yxat — izohda ochiq aytilgan (GATE S C5).
// 🔴 Kod-namunada shablon-satr YO'Q — satr qo'shish bilan (oq-ekran xavfi).
const KODING_KEY = 'pm-m5mx-code';
const readKoding = () => { try { const v = JSON.parse(localStorage.getItem(KODING_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
// Kod-savol (ballsiz): ✔ 2-o'rinda (4-savol A) — shart indeks emas, variantning `ok` belgisi bo'yicha.
const GATE_OPTS = [
  { t: { uz: 'Bot ishga tushgan zahoti', ru: 'Сразу после запуска бота' } },
  { t: { uz: 'Odam botga /stat deb yozganda', ru: 'Когда человек пишет боту /stat' }, ok: true },
  { t: { uz: 'Odam har qanday xabar yozganda', ru: 'Когда человек пишет любое сообщение' } },
];
const KOD_MATN = "// bot.js — bot.launch() qatoridan oldin qo'shing.\n"
  + "// Seshanba yozuvi (11-ekran): har qator — botning bitta javobi.\n"
  + "// telegram_id — odamning Telegram raqami (4-darsdagi users jadvalidagidek).\n"
  + "// kerakli: true — bot kerakli javobni yubordi.\n"
  + "// Hozircha ro'yxatni qo'lda yozdik. Haqiqiy botda bunday\n"
  + "// qatorlar bazada turadi (PostgreSQL — 4-darsda o'tgansiz).\n"
  + "const javoblar = [\n"
  + "  { telegram_id: 101, kerakli: true },  // Kamola\n"
  + "  { telegram_id: 102, kerakli: false }, // Otabek — «Tushunmadim»\n"
  + "  { telegram_id: 101, kerakli: true },  // Kamola\n"
  + "  { telegram_id: 103, kerakli: true },  // Bekzod\n"
  + "  { telegram_id: 104, kerakli: false }, // Sevara — salom\n"
  + "];\n"
  + "\n"
  + "function stat(javoblar) {\n"
  + "  // Bugun kelganlar — tayyor: bir odam bir marta\n"
  + "  // includes — ro'yxatda bormi? push — ro'yxatga qo'shadi\n"
  + "  const kelganlar = [];\n"
  + "  for (const j of javoblar) {\n"
  + "    if (!kelganlar.includes(j.telegram_id)) {\n"
  + "      kelganlar.push(j.telegram_id);\n"
  + "    }\n"
  + "  }\n"
  + "\n"
  + "  // 1) Keragini olganlarni yig'ing: yuqoridagi sikl,\n"
  + "  //    shartga j.kerakli qo'shiladi\n"
  + "  const keraginiOlganlar = [];\n"
  + "\n"
  + "  // 2) Natijaga bosh raqamni qo'shing: keraginiOlganlar soni\n"
  + "  return { bugun: kelganlar.length, kerakli: 0 };\n"
  + "}\n"
  + "\n"
  + "bot.command('stat', (ctx) => {\n"
  + "  const s = stat(javoblar);\n"
  + "  ctx.reply('Bugun kelganlar: ' + s.bugun + '\\nKeragini olganlar: ' + s.kerakli);\n"
  + "});";
const JS_TOKEN = /(\/\/[^\n]*|'[^']*'|"[^"]*"|\b(?:const|let|for|of|if|else|return|function)\b|\b\d+\b)/g;
const jsHl = (ln) => ln.split(JS_TOKEN).filter(p => p !== undefined && p !== '').map((p, i) => {
  if (p.startsWith('//')) return <span key={i} style={{ color: '#6A9955' }}>{p}</span>;
  if (p.startsWith('"') || p.startsWith("'")) return <span key={i} style={{ color: '#CE9178' }}>{p}</span>;
  if (/^(const|let|for|of|if|else|return|function)$/.test(p)) return <span key={i} style={{ color: '#C586C0' }}>{p}</span>;
  if (/^\d+$/.test(p)) return <span key={i} style={{ color: '#B5CEA8' }}>{p}</span>;
  return <span key={i}>{p}</span>;
});
const ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isSelf = !live || live.mode === 'self';
  const [saved] = useState(() => readKoding());
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done));
  const [gateOk, setGateOk] = useState(!!(saved && saved.gateOk));
  const [miss, setMiss] = useState(null);
  const [missedOnce, setMissedOnce] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
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
  const lines = KOD_MATN.split('\n');
  const doneTurn = useTurnHint(stage2 && !done && !isMentor);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Avval kod-savolini yeching', ru: 'Сначала ответьте на вопрос о коде' }) : tr({ uz: '② Kodni yozing va «Bajardim» tugmasini bosing', ru: '② Напишите код и нажмите «Готово»' });
  return (
    <Stage eyebrow={tr({ uz: 'Koding · VS Code', ru: 'Кодинг · VS Code' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.5vw,15px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>/stat</span>: bot raqamlarni o'zi aytadi.</>, ru: <><span className="italic" style={{ color: T.accent }}>/stat</span>: бот сам называет цифры.</> })}</h2></div>
        {!stage2 ? (
          <>
            <Mentor>{tr({ uz: 'Avval bitta savol — keyin kod yoziladi.', ru: 'Сначала один вопрос — потом пишем код.' })}</Mentor>
            <div className="cmt hunt">
              <span className="cmt-lbl">{tr({ uz: <><code className="qcode">bot.command('stat', …)</code> qachon ishlaydi?</>, ru: <>Когда срабатывает <code className="qcode">bot.command('stat', …)</code>?</> })}</span>
              <div className="gt-btns col3">
                {GATE_OPTS.map((g, i) => (
                  <button key={tr(g.t)} type="button" className={`gt-b${miss === i ? ' miss' : ''}`} onClick={() => pickGate(i)}>{tr(g.t)}</button>
                ))}
              </div>
              {missedOnce && <p className="cmt-tip">{tr({ uz: <><code className="qcode">bot.command</code> faqat o'z nomi bilan kelgan buyruqqa javob beradi: <code className="qcode">'stat'</code> — demak /stat. 3-darsda buyruqni ham shunday yozgansiz.</>, ru: <><code className="qcode">bot.command</code> отвечает только на команду со своим именем: <code className="qcode">'stat'</code> — значит, /stat. На 3-м уроке вы писали команду так же.</> })}</p>}
            </div>
          </>
        ) : (
          <>
            <Mentor>{tr({ uz: "11-ekranda yozuvdan qo'lda sanaganingizni endi kod sanaydi — o'sha seshanba yozuvidan. Kodda ikki joyni siz to'ldirasiz: 1 va 2. Kodni bot.js faylingizga, bot.launch() qatoridan oldin yozing.", ru: 'То, что на 11-м экране вы считали по журналу вручную, теперь посчитает код — по тому же журналу за вторник. В коде два места заполняете вы: 1 и 2. Напишите код в свой файл bot.js, перед строкой bot.launch().' })}</Mentor>
            <div className="cmt-fold fade-step"><span className="cmt-done">{tr({ uz: "✓ bot.command('stat', …) — odam botga /stat deb yozganda", ru: '✓ bot.command(\'stat\', …) — когда человек пишет боту /stat' })}</span></div>
            <div className="split kod">
              <Col gap={10}>
                <div className={`kdpanel${done ? ' is-done' : ''}`}>
                  <div className={`wsx star ${yordamOpen ? 'open' : ''}`}>
                    <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })} {yordamOpen ? '▾' : '▸'}</button>
                    {yordamOpen && <div className="wsx-body">
                      <p>{tr({ uz: <>Kelganlarni yig'adigan uch qatorga qarang: keragini olganlar uchun shartga <b>bitta narsa</b> qo'shiladi — <code className="qcode">j.kerakli &amp;&amp;</code>.</>, ru: <>Посмотрите на три строки, которые собирают пришедших: для получивших нужное в условие добавляется <b>одна вещь</b> — <code className="qcode">j.kerakli &amp;&amp;</code>.</> })}</p>
                      <p>{tr({ uz: <>Bot ishga tushmasa — bot.launch() qatoridan oldin <b>console.log(stat(javoblar));</b> yozing va terminalda <b>node bot.js</b> bilan natijani ko'ring. Terminalda <code className="qcode">{'{ bugun: 4, kerakli: 2 }'}</code> chiqsa — vazifa bajarilgan.</>, ru: <>Если бот не запускается — перед строкой bot.launch() напишите <b>console.log(stat(javoblar));</b> и посмотрите результат в терминале командой <b>node bot.js</b>. Если в терминале появилось <code className="qcode">{'{ bugun: 4, kerakli: 2 }'}</code> — задание выполнено.</> })}</p>
                      <p>{tr({ uz: "Qo'shimcha: javobga uchinchi qator qo'shing — bugun kelganlarning necha foizi keragini oldi (2 ÷ 4 × 100 = 50).", ru: 'Дополнительно: добавьте в ответ третью строку — какой процент пришедших сегодня получил нужное (2 ÷ 4 × 100 = 50).' })}</p>
                    </div>}
                  </div>
                  <button className={`lp-done-btn ${done ? 'is-done' : ''}${!done && doneTurn ? ' turn-ring' : ''}`} disabled={done} onClick={done ? undefined : complete}>
                    {done ? tr({ uz: '✓ Bajarildi', ru: '✓ Выполнено' }) : tr({ uz: 'Bajardim — bot /stat ga javob berdi', ru: 'Готово — бот ответил на /stat' })}
                  </button>
                  {!done && isSelf && (
                    <button className="kd-skip" onClick={onNext}>{tr({ uz: '✓ Bu mashqni sinfda bajarganman — davom etish →', ru: '✓ Это упражнение уже сделано в классе — продолжить →' })}</button>
                  )}
                </div>
                <StudentPracticePulse live={live} screen={screen} />
                <MentorPracticeStats live={live} screen={screen} label={{ uz: "/stat ni yozib bo'lganlar", ru: 'Написали /stat' }} />
              </Col>
              <Col gap={10}>
                <div className="vsc no-copy" onCopy={e => e.preventDefault()} onCut={e => e.preventDefault()} onPaste={e => e.preventDefault()} onContextMenu={e => e.preventDefault()}>
                  <div className="vsc-bar">
                    <span className="vsc-tab on">bot.js</span>
                    <span className="vsc-lock" title={tr({ uz: "Kod nusxalanmaydi — o'zingiz terib yozasiz", ru: 'Код не копируется — набираете сами' })}>{tr({ uz: "qo'lda yoziladi", ru: 'пишется вручную' })}</span>
                  </div>
                  <div className="vsc-body">
                    {lines.map((ln, i) => (
                      <div key={i} className="vsc-line"><span className="vsc-ln">{i + 1}</span><span className="vsc-code">{ln ? jsHl(ln) : ' '}</span></div>
                    ))}
                  </div>
                </div>
                {/* Jonli preview (WOW): kutilgan bot-javobi — «Bajardim» bosilguncha xira */}
                <div className={`tg kd-tg${done ? ' lit' : ''}`} aria-label={tr({ uz: "Telegram'da kutilgan javob", ru: 'Ожидаемый ответ в Telegram' })}>
                  <span className="tg-me">/stat</span>
                  <div className="tg-bot">
                    <span className="tg-l"><RowDot />Bugun kelganlar: 4</span>
                    <span className="tg-l"><RowDot v="bosh" />Keragini olganlar: 2</span>
                  </div>
                </div>
              </Col>
            </div>
          </>
        )}
        <MentorNote>{tr({ uz: <>Eng foydali xato — bir odamni ikki marta sanash (Kamola — 101 — bugun ikki marta kerakli javob oldi). Bot ishga tushmasa — zaxira yo'l: console.log bilan terminalda tekshirish. To'rt raqam ekranidagi «bot kerakli javobni yuborganda» varianti — kodda <code className="qcode">kerakli: true</code>. Kod 10 daqiqada yoziladi; ulgurmaganlar uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.</>, ru: <>Самая полезная ошибка — посчитать одного человека дважды (Kamola — 101 — сегодня дважды получила нужный ответ). Если бот не запускается — запасной путь: проверить в терминале через console.log. Вариант «бот отправил нужный ответ» с экрана четырёх цифр — в коде это <code className="qcode">kerakli: true</code>. Код пишется за 10 минут; кто не успел, получит домой короткий вариант. Это задание выполняют ученики, вы наблюдаете; «Продолжить» для вас открыта.</> })}</MentorNote>
      </div>
    </Stage>
  );
};

const ScreenFinalTest = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })} scope="final"
    question={<TestQ ask={tr({ uz: '/stat javobi: jami 300, bugun 6, qaytganlar foizi 5. Bu javobdan nimani bilasiz?', ru: 'Ответ на /stat: всего 300, сегодня 6, процент вернувшихся 5. Что вы узнаёте из этого ответа?' })} />}
    questionText="/stat javobi: jami 300, bugun 6, qaytganlar foizi 5. Bu javobdan nimani bilasiz?"
    options={[{ uz: "Bot tez o'syapti: jami 300 ga yetdi", ru: 'Бот быстро растёт: всего уже 300' }, { uz: 'Kechagi har yuzta odamdan 5 tasi bugun ham keldi', ru: 'Из каждой сотни вчерашних людей 5 пришли и сегодня' }, { uz: 'Botga har kuni 6 ta yangi odam keladi', ru: 'К боту каждый день приходят 6 новых людей' }]}
    correctIdx={1}
    explainCorrect={{ uz: 'Foiz shuni aytadi: kechagi yuzta odamdan 5 tasi bugun ham keldi.', ru: 'Процент говорит именно это: из сотни вчерашних людей 5 пришли и сегодня.' }}
    explainWrong={{
      0: { uz: "300 — jami yig'ilgan odam: u faqat o'sadi, bot tez o'syaptimi — buni aytmaydi.", ru: '300 — всего набравшихся людей: это число только растёт и не говорит, быстро ли растёт бот.' },
      2: { uz: "6 — bugun kelgan hamma odam; ularning nechtasi yangi ekanini bu son aytmaydi.", ru: '6 — все, кто пришёл сегодня; сколько из них новых, это число не говорит.' },
      default: { uz: "Har raqam o'z savoliga javob beradi: foiz — kechagilar bugun ham keldimi.", ru: 'Каждая цифра отвечает на свой вопрос: процент — пришли ли вчерашние и сегодня.' }
    }}
  />
);

// ===== SCREEN 14 — RECAP: 2 qadam (ayting + yozing) =====
const REFLECT_KEY = 'pm-m5mx-reflection';
// 🔴 Korpus §97: YAKKA o'quvchida sherik YO'Q — unga «A» va «B» navbati ko'rsatilmaydi.
// Yakka tarmoq: bitta 30 soniyalik navbat, neytral matn.
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
              ? null
              : <><span className="pair-now">{tr({ uz: <>Hozir <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span> gapiradi</>, ru: <>Сейчас говорит <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span></> })}</span><span className="pair-next">{isA ? tr({ uz: 'keyin — B navbati', ru: 'потом — очередь B' }) : tr({ uz: 'oxirgi navbat', ru: 'последняя очередь' })}</span></>}
          </div>
        </div>
      ) : (solo && !st.done) ? null : (
        <p className="pair-now" style={{ margin: 0 }}>{st.done
          ? (solo ? tr({ uz: "✓ Vaqt tugadi — aytib bo'ldingiz.", ru: "✓ Время вышло — вы всё рассказали." }) : tr({ uz: "✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz.", ru: "✓ Время вышло — вы оба всё рассказали." }))
          : (solo ? tr({ uz: "30 soniya — ovoz chiqarib o'zingizga ayting.", ru: '30 секунд — расскажите вслух самому себе.' }) : tr({ uz: 'Har biringizga 30 soniyadan — avval A, keyin B.', ru: 'По 30 секунд каждому — сначала A, потом B.' }))}</p>
      )}
      <div className="pair-timer-btns">
        {!st.running && <button className={st.done ? 'btn-soft' : `pair-start${startTurn ? '' : ' calm'}`} onClick={() => setSt({ running: true, left: TOTAL, done: false })}>{st.done ? (solo ? tr({ uz: '↻ Yana 30 soniya', ru: '↻ Ещё 30 секунд' }) : tr({ uz: '↻ Yana 1 daqiqa', ru: '↻ Ещё 1 минута' })) : (solo ? tr({ uz: '▶ 30 soniyani boshlash', ru: '▶ Запустить 30 секунд' }) : tr({ uz: '▶ 1 daqiqani boshlash', ru: '▶ Запустить минуту' }))}</button>}
        {st.running && <button className="btn-soft" onClick={() => setSt({ running: false, left: TOTAL, done: false })}>{tr({ uz: "To'xtatish", ru: "Остановить" })}</button>}
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
  // A6: 2-qadam 1-qadamdan keyin chiqadi; bir marta ochilgach ↻ bosilsa ham yopilmaydi
  const [step2, setStep2] = useState(() => written);
  useEffect(() => { if (pairStage === 'done') setStep2(true); }, [pairStage]);
  const inputTurn = useTurnHint(step2 && !written && !reflFocus);
  return (
    <Stage eyebrow={tr({ uz: 'Mustahkamlash · 2 qadam', ru: 'Закрепление · 2 шага' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!written} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Botingizning bosh raqamini <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</>, ru: <>Сможете назвать главную цифру своего бота <span className="italic" style={{ color: T.accent }}>по памяти</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Ekranga qaramay ayting: botingizning bosh raqami nima, u nima bo'lganda sanaladi va nega aynan shu?", ru: 'Скажите, не глядя на экран: какая главная цифра у вашего бота, когда она считается и почему именно она?' })}</Mentor>
        <div className="rcp-flow">
          <div className={`rcp-step fade-up delay-1${pairStage === 'done' ? ' rcp-folded' : ''}`}>
            <div className="rcp-step-h"><span className="rcp-n">{pairStage === 'done' ? '✓' : '1'}</span><div><span className="rcp-t">{yakka ? tr({ uz: "Avval ovoz chiqarib o'zingizga ayting", ru: 'Сначала скажите вслух самому себе' }) : tr({ uz: 'Sherigingizga ayting', ru: 'Расскажите партнёру' })}</span></div></div>
            <PairTimer onStage={setPairStage} muted={written} solo={yakka} />
          </div>
          {step2 && (
            <div className="rcp-step fade-step">
              <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr({ uz: 'Endi bir qator yozing', ru: 'Теперь напишите одну строку' })}</span></div></div>
              <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
                <textarea className="reflect-input ta" rows={2} aria-label={tr({ uz: "Botingizning bosh raqami va u nima bo'lganda sanaladi", ru: 'Главная цифра вашего бота и когда она считается' })} value={text} onChange={e => save(e.target.value.replace(/\n/g, ' '))} onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} placeholder={tr({ uz: "Bosh raqamim — ..., u ... bo'lganda sanaladi, chunki ...", ru: 'Моя главная цифра — ..., она считается, когда ..., потому что ...' })} maxLength={160} />
              </span>
              {written && (
                <div className="rcp-win fade-step">
                  <span className="rcp-win-t">{tr({ uz: '✓ Endi botingiz haqida «yaxshi ishlayapti» emas, raqam aytasiz.', ru: '✓ Теперь о своём боте вы назовёте цифру, а не «работает хорошо».' })}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <MentorNote>{tr({ uz: "Uchdan biri «nima bo'lganda sanaladi»ni aytolmasa — bot yozuvi ekranini qayta oching va kerakli javob olgan qatorlarni birga sanang.", ru: 'Если треть класса не может сказать, «когда считается», — снова откройте экран журнала бота и вместе посчитайте строки с нужным ответом.' })}</MentorNote>
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
  { front: { uz: 'Metrika nima?', ru: 'Что такое метрика?' }, back: { uz: "Bot haqida sanab tekshirib bo'ladigan raqam", ru: 'Цифра о боте, которую можно проверить подсчётом' } },
  { front: { uz: "Qaysi raqam faqat o'sadi va nega u yolg'iz yetmaydi?", ru: 'Какая цифра только растёт и почему её одной мало?' }, back: { uz: 'Jami /start bosganlar (har odam bir marta) — bot yomonlashsa ham kamaymaydi', ru: 'Всего нажавших /start (каждый человек один раз) — не уменьшается, даже если бот стал хуже' } },
  { front: { uz: '«Bugun kelganlar» nimani sanaydi?', ru: 'Что считает «Пришли сегодня»?' }, back: { uz: 'Bugun botga yozgan yoki tugma bosgan odamlarni — bir odam bir marta', ru: 'Людей, которые сегодня написали боту или нажали кнопку: один человек — один раз' } },
  { front: { uz: 'Odam qachon «qaytgan» deb sanaladi?', ru: 'Когда человека считают «вернувшимся»?' }, back: { uz: 'Kecha kelgan odam bugun ham kelsa', ru: 'Если человек пришёл вчера и пришёл сегодня' } },
  { front: { uz: 'Qaytganlar foizini qanday topasiz?', ru: 'Как найти процент вернувшихся?' }, back: { uz: "Qaytganlar sonini kechagi odamlar soniga bo'lib, 100 ga ko'paytirasiz (inglizchasi: retention)", ru: 'Делите число вернувшихся на число вчерашних людей и умножаете на 100 (по-английски: retention)' } },
  { front: { uz: 'Nega odam soni emas, foiz solishtiriladi?', ru: 'Почему сравнивают процент, а не число людей?' }, back: { uz: 'Guruhlar har xil kattalikda — foiz ularni yuzta odamga keltiradi', ru: 'Группы разного размера — процент приводит их к сотне человек' } },
  { front: { uz: 'Bosh raqam nimani sanaydi?', ru: 'Что считает главная цифра?' }, back: { uz: "Bot o'z ishini bajarganini — bu botda keragini olganlarni (inglizchasi: North Star)", ru: 'Что бот сделал свою работу — в этом боте получивших нужное (по-английски: North Star)' } },
  { front: { uz: "Bot «Tushunmadim» desa, bosh raqamga qo'shiladimi?", ru: 'Если бот ответил «Не понял», это входит в главную цифру?' }, back: { uz: "Yo'q — odam javob oldi, lekin keragini emas", ru: 'Нет — человек получил ответ, но не нужный' } },
  { front: { uz: "Booking yangi o'zgarishni qanday sinaydi?", ru: 'Как Booking проверяет новое изменение?' }, back: { uz: "Avval odamlarning bir qismiga ko'rsatadi va ikki guruhning raqamini solishtiradi", ru: 'Сначала показывает части людей и сравнивает цифры двух групп' } },
  { front: { uz: "/stat buyrug'i nimani aytadi?", ru: 'Что сообщает команда /stat?' }, back: { uz: 'Bugun kelganlar sonini va bosh raqamni — keragini olganlar sonini', ru: 'Число пришедших сегодня и главную цифру — число получивших нужное' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        {/* 99a: flashcard ekranida mentor YO'Q */}
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — alohida ekran EMAS, YAKUN sahifasi ichida =====
const HW_KEY = 'pm-m5mx-hw';
const HW_VARIANT = [
  { k: 'toliq', t: "To'liq · ~20 daqiqa" },
  { k: 'qisqa', t: 'Qisqa · ~10 daqiqa' },
];
const HW_STEPS = ['Botning yozuvini oching', 'Har odamni bir marta sanang', 'Raqamni jadvalga yozing'];
const readHwTarget = () => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } };
// Uy-vazifa kapsulasi fonidagi xira so'z-tokenlar — darsning O'Z lug'ati (§114)
const HW_TOKENS = [
  { t: 'raqam', l: 5,  tp: 16, s: 12, d: 6.5 },
  { t: 'keldi', l: 80, tp: 12, s: 11, d: 7.5 },
  { t: 'qaytdi', l: 12, tp: 70, s: 11, d: 8 },
  { t: 'foiz', l: 64, tp: 76, s: 12, d: 6 },
  { t: '/stat', l: 86, tp: 52, s: 10, d: 9 },
  { t: 'bosh raqam', l: 36, tp: 8,  s: 12, d: 7 },
  { t: 'metrika', l: 3,  tp: 44, s: 12, d: 8.5 },
];
const HwCard = ({ variant, onPick, innerRef }) => {
  const pickTurn = useTurnHint(!variant && !!onPick);
  return (
    <div className="card fade-step" ref={innerRef}>
      <div className="card-lbl" style={{ color: T.accent }}>Uyda nima qilasiz?</div>
      <p className="body" style={{ margin: '0 0 10px', color: T.ink }}>Uyda botingiz raqamlarini yozasiz: botning o'z yozuvlaridan bugun kelganlarni, qaytganlar foizini va bosh raqamni sanab qo'yasiz. Necha kun va nechta raqam — pastdagi kartada tanlaysiz.</p>
      <div className="hw-chips">
        {HW_VARIANT.map((v, vi) => (
          <button key={v.k} className={`hw-chip ${variant === v.k ? 'on' : ''}${waveCls(pickTurn, vi, HW_VARIANT.length)}`} onClick={() => onPick(v.k)}>{v.t}</button>
        ))}
      </div>
      {variant ? (
        <div className="pmtask fade-step">
          <div className="pmtask-head"><span className="pmtask-tag">Topshiriq kartasi</span><span className="pmtask-id">{variant === 'qisqa' ? 'QISQA' : "TO'LIQ"}</span></div>
          <div className="pmtask-rows">
            <div className="pmtask-row"><span className="pmtask-k">Nechta</span><span className="pmtask-v"><b>{variant === 'qisqa' ? 'bir kun · ikki raqam: bugun kelganlar va bosh raqam' : "ikki kun · to'rt raqam"}</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">Muddat</span><span className="pmtask-v"><b>keyingi darsgacha — sonlaringizni darsga olib keling</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">Odam kam</span><span className="pmtask-v"><b>botingizda odam kam bo'lsa — sinfdoshingizning botida sanang</b></span></div>
            {variant === 'toliq' && <div className="pmtask-row"><span className="pmtask-k">Qo'shimcha</span><span className="pmtask-v">/stat dagi qo'lda yozilgan ro'yxat o'rniga har xabar kelganda bazaga yozuv qo'shing (INSERT) — shunda /stat haqiqiy raqamni aytadi.</span></div>}
          </div>
          <div className="pmtask-steps">
            {HW_STEPS.map((s, i) => <span key={i} className="pmtask-step"><i>{i + 1}</i>{s}</span>)}
          </div>
        </div>
      ) : (
        <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>Variantni tanlang — topshiriq-karta shunga moslashadi.</p></div>
      )}
    </div>
  );
};
// ===== 🏅 NISHONLAR — 4 ta, faqat REAL tekshiriladigan harakatga (senariy 10-bo'lim) =====
const ACHIEVEMENTS = {
  twoMondays:  { icon: '🗓', name: 'Two Mondays',  desc: { uz: "Ikki dushanbani to'rt raqamda solishtirdingiz", ru: 'Вы сравнили два понедельника по четырём цифрам' } },
  starPicker:  { icon: '⭐', name: 'North Star',  desc: { uz: 'Botingiz uchun bosh raqam va uch yordamchi raqam yozdingiz', ru: 'Вы записали для своего бота главную цифру и три помогающие' } },
  fairCounter: { icon: '🧮', name: 'Fair Counter', desc: { uz: 'Birinchi urinishda yozuvdan har odamni bir martadan sanadingiz', ru: 'С первой попытки вы посчитали по журналу каждого человека один раз' } },
  statCommand: { icon: '🤖', name: 'Stat Builder', desc: { uz: "Botingizga /stat buyrug'ini yozdingiz", ru: 'Вы написали для своего бота команду /stat' } },
};
const ACH_TRIGGERS = { s4: 'twoMondays', s10: 'starPicker', s11: 'fairCounter', s12: 'statCommand' };

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

// Podium savol yorliqlari (scored indekslar 3/6/8/13)
const Q_LABELS = { 3: { uz: "1 — Sanab bo'ladigan raqam", ru: '1 — Цифра, которую можно посчитать' }, 6: { uz: '2 — Qaysi raqam', ru: '2 — Какая цифра' }, 8: { uz: '3 — Foiz', ru: '3 — Процент' }, 13: { uz: '4 — Yakuniy savol', ru: '4 — Итоговый вопрос' } };
const QUIZ_MS = 15000;
// §114: fon-dekor so'zlari shu dars lug'atidan (metrika · jami · foiz · bosh raqam · /stat …) — emojisiz (A4)
const QZ_BG_SHAPES = [
  { ch: { uz: 'raqam', ru: 'цифра' },  l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'keldi', ru: 'пришёл' },  l: 85, t: 8,  s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'qaytdi', ru: 'вернулся' }, l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'foiz', ru: 'процент' },   l: 74, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: '/stat',  l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'sanash', ru: 'подсчёт' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'odam', ru: 'человек' },   l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: { uz: 'yozuv', ru: 'журнал' },  l: 55, t: 5,  s: 20, d: 22, dl: 0.6 },
  { ch: { uz: 'metrika', ru: 'метрика' }, l: 91, t: 42, s: 22, d: 24, dl: 1.3 },
  { ch: { uz: 'bosh raqam', ru: 'главная цифра' }, l: 16, t: 52, s: 22, d: 26, dl: 2.6 },
  { ch: { uz: 'jami', ru: 'всего' },   l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike — 12 savol · 3/3/3/3 (0,3,2,1 · 1,0,2,3 · 0,2,1,3). Inglizcha nom 0 (§20). darslik-jonli TASDIQLAYDI.
const QUIZ_BANK = [
  { q: { uz: 'Metrika nima?', ru: 'Что такое метрика?' }, opts: [{ uz: "Sanab tekshirib bo'ladigan raqam", ru: 'Цифра, которую можно проверить подсчётом' }, { uz: 'Bot haqidagi yaxshi fikr', ru: 'Хорошее мнение о боте' }, { uz: "Botga o'zingiz qo'ygan ball", ru: 'Балл, который вы сами поставили боту' }, { uz: 'Botdagi har qanday son', ru: 'Любое число в боте' }], correct: 0 },
  { q: { uz: "Qaysi raqam faqat o'sadi?", ru: 'Какая цифра только растёт?' }, opts: [{ uz: 'Bugun /start bosganlar', ru: 'Нажавшие /start сегодня' }, { uz: 'Qaytganlar foizi', ru: 'Процент вернувшихся' }, { uz: 'Bosh raqam', ru: 'Главная цифра' }, { uz: 'Jami /start bosganlar', ru: 'Всего нажавших /start' }], correct: 3 },
  { q: { uz: "Kamola bugun botga 3 marta yozdi. «Bugun kelganlar» soniga nechta qo'shiladi?", ru: 'Kamola сегодня написала боту 3 раза. Сколько добавится к числу «Пришли сегодня»?' }, opts: [{ uz: '3 ta', ru: '3' }, { uz: '2 ta', ru: '2' }, { uz: '1 ta', ru: '1' }, { uz: '0 ta', ru: '0' }], correct: 2 },
  { q: { uz: 'Kecha 10 odam keldi, bugun ulardan 5 tasi qaytdi. Qaytganlar necha foiz?', ru: 'Вчера пришли 10 человек, сегодня 5 из них вернулись. Какой процент вернувшихся?' }, opts: [{ uz: '5 foiz', ru: '5 процентов' }, { uz: '50 foiz', ru: '50 процентов' }, { uz: '10 foiz', ru: '10 процентов' }, { uz: '15 foiz', ru: '15 процентов' }], correct: 1 },
  { q: { uz: 'Bir kunda botga 7 xil odam yozdi. Bu son qaysi raqam?', ru: 'За день боту написали 7 разных людей. Какая это цифра?' }, opts: [{ uz: 'Jami /start bosganlar', ru: 'Всего нажавших /start' }, { uz: 'Bugun kelganlar', ru: 'Пришли сегодня' }, { uz: 'Qaytganlar foizi', ru: 'Процент вернувшихся' }, { uz: 'Bosh raqam', ru: 'Главная цифра' }], correct: 1 },
  { q: { uz: 'Bu darsdagi botda bosh raqam nimani sanaydi?', ru: 'Что считает главная цифра в боте из этого урока?' }, opts: [{ uz: 'Keragini olgan odamlarni', ru: 'Людей, получивших нужное' }, { uz: 'Botga kelgan hamma odamni', ru: 'Всех, кто пришёл к боту' }, { uz: 'Javob olgan hamma odamni', ru: 'Всех, кто получил ответ' }, { uz: 'Bot yozgan xabarlar sonini', ru: 'Число сообщений, которые написал бот' }], correct: 0 },
  { q: { uz: "Guruhlar har xil kattalikda bo'lsa, nimani solishtirasiz?", ru: 'Если группы разного размера, что вы сравниваете?' }, opts: [{ uz: 'Qaytgan odamlar sonini', ru: 'Число вернувшихся людей' }, { uz: 'Kelgan odamlar sonini', ru: 'Число пришедших людей' }, { uz: 'Qaytganlar foizini', ru: 'Процент вернувшихся' }, { uz: 'Jami /start sonini', ru: 'Всего нажавших /start' }], correct: 2 },
  { q: { uz: "Bot «Tushunmadim» deb javob berdi. Bu bosh raqamga qo'shiladimi?", ru: 'Бот ответил «Не понял». Это входит в главную цифру?' }, opts: [{ uz: 'Ha — bot javob yubordi', ru: 'Да — бот отправил ответ' }, { uz: 'Ha — odam botga yozdi', ru: 'Да — человек написал боту' }, { uz: "Yo'q — odam /start bosmagan", ru: 'Нет — человек не нажал /start' }, { uz: "Yo'q — odam keragini olmadi", ru: 'Нет — человек не получил нужное' }], correct: 3 },
  { q: { uz: "Booking yangi o'zgarishni avval kimga ko'rsatadi?", ru: 'Кому Booking сначала показывает новое изменение?' }, opts: [{ uz: 'Odamlarning bir qismiga', ru: 'Части людей' }, { uz: "Faqat o'z xodimlariga", ru: 'Только своим сотрудникам' }, { uz: 'Hamma odamga birdan', ru: 'Сразу всем' }, { uz: 'Faqat eski mijozlarga', ru: 'Только старым клиентам' }], correct: 0 },
  { q: { uz: "Booking yangi o'zgarishni nega avval bir guruhga ko'rsatadi?", ru: 'Почему Booking сначала показывает новое изменение одной группе?' }, opts: [{ uz: "Rang hali tayyor bo'lmagani uchun", ru: 'Потому что цвет ещё не готов' }, { uz: 'Hamma bir vaqtda kirmagani uchun', ru: 'Потому что не все заходят одновременно' }, { uz: 'Ikki guruh raqamini solishtirish uchun', ru: 'Чтобы сравнить цифры двух групп' }, { uz: "Server og'irlashmasligi uchun", ru: 'Чтобы не перегружать сервер' }], correct: 2 },
  { q: { uz: 'Qaytganlar foizi qaysi savolga javob beradi?', ru: 'На какой вопрос отвечает процент вернувшихся?' }, opts: [{ uz: 'Bugun nechta odam keldi?', ru: 'Сколько людей пришло сегодня?' }, { uz: 'Kechagilar bugun ham keldimi?', ru: 'Пришли ли вчерашние и сегодня?' }, { uz: 'Bot odamga keragini berdimi?', ru: 'Дал ли бот человеку нужное?' }, { uz: "Jami nechta odam yig'ildi?", ru: 'Сколько всего людей набралось?' }], correct: 1 },
  { q: { uz: "/stat buyrug'ining kodini qayerga yozdingiz?", ru: 'Куда вы написали код команды /stat?' }, opts: [{ uz: 'users jadvaliga', ru: 'В таблицу users' }, { uz: 'Telegram kanaliga', ru: 'В Telegram-канал' }, { uz: "@BotFather'ga", ru: 'В @BotFather' }, { uz: 'bot.js faylingizga', ru: 'В свой файл bot.js' }], correct: 3 },
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
          <span className="cs-hud-i">{tr({ uz: 'PODIUM', ru: "ПОДИУМ" })}</span>
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
  let pts = 0, seria = 0, maxSeria = 0, ok = 0;
  for (let i = 0; i < QUIZ_BANK.length; i++) {
    const a = byQ[i];
    if (a && a.correct) { seria++; maxSeria = Math.max(maxSeria, seria); ok++; pts += quizPts(a.elapsed_ms) + (seria >= 2 ? 100 : 0); }
    else seria = 0;
  }
  return { pts, ok, maxSeria };
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
    const TOK = ['raqam', 'keldi', 'qaytdi', 'foiz', '/stat', 'sanash', 'odam', 'yozuv', 'metrika', 'jami'];
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

  const seriaUpTo = (k) => { let s = 0; for (let i = 0; i <= k; i++) { if (myAnswers[i]?.correct) s++; else s = 0; } return s; };
  const myPtsFor = (k) => { const a = myAnswers[k]; if (!a || !a.correct) return 0; return quizPts(a.elapsed) + (seriaUpTo(k) >= 2 ? 100 : 0); };

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
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar ⚡ bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают бонус ⚡!' })}</p>
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
              : <span className="qz-ansn">{seriaUpTo(qi - 1) >= 2 ? `⚡ x${seriaUpTo(qi - 1)}` : ' '}</span>}
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
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr({ uz: 'ball', ru: 'баллов' })}{seriaUpTo(qi) >= 2 ? tr({ uz: ` · ⚡ x${seriaUpTo(qi)} ketma-ket`, ru: ` · ⚡ x${seriaUpTo(qi)} подряд` }) : ''}</span></>
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
                  {b.maxSeria >= 2 && <span className="qz-bseria">⚡</span>}
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
              <p className="qz-sub">{tr({ uz: <>ball · {soloScore.ok}/{QUIZ_BANK.length} to'g'ri{soloScore.maxSeria >= 2 ? ` · ketma-ket to'g'ri ⚡x${soloScore.maxSeria}` : ''}</>, ru: <>баллов · {soloScore.ok}/{QUIZ_BANK.length} верно{soloScore.maxSeria >= 2 ? ` · подряд верно ⚡x${soloScore.maxSeria}` : ''}</> })}</p>
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
                    {b.maxSeria >= 2 && <span className="qz-bseria">⚡x{b.maxSeria}</span>}
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
// ===== SCREEN 17 — YAKUN: CodeStrike arenasi + uy-vazifa BIR sahifada =====
// hero -> CodeStrike -> «Endi siz bilasiz» + nishonlar -> uy-vazifa kapsulasi.
const ScreenSummary = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const live = _gate.live;
  const isMentorL = !!(live && live.mode === 'mentor');
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const RECAP = [
    { uz: "Bot haqida sanab tekshirib bo'ladigan raqam metrika deyiladi.", ru: 'Цифра о боте, которую можно проверить подсчётом, называется метрикой.' },
    { uz: "Jami soni faqat o'sadi — bot qanday ishlayotganini u yolg'iz aytmaydi.", ru: 'Число «всего» только растёт — само по себе оно не скажет, как работает бот.' },
    { uz: 'Qaytganlar foizi — kecha kelgan har yuzta odamdan nechtasi bugun ham keldi; odam soni har xil kunlar foizda solishtiriladi.', ru: 'Процент вернувшихся — сколько из каждой сотни вчерашних людей пришли и сегодня; дни с разным числом людей сравнивают в процентах.' },
    { uz: "Bosh raqam — bot o'z ishini bajarganini sanaydi: bu botda keragini olganlar.", ru: 'Главная цифра считает, что бот сделал свою работу: в этом боте — получившие нужное.' },
    { uz: "O'zgarishdan oldin bosh raqamni o'lchab qo'ying — keyin yangi raqam bilan solishtirasiz.", ru: 'Перед изменением измерьте главную цифру — потом сравните с новой.' },
  ];
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
  const [hwVariant, setHwVariant] = useState(() => readHwTarget());
  const pickHw = (k) => { setHwVariant(k); try { localStorage.setItem(HW_KEY, k); } catch {} };
  const [hwOpen, setHwOpen] = useState(false);
  const hwRef = useRef(null);
  useEffect(() => {
    if (!hwOpen) return;
    const t = setTimeout(() => { if (hwRef.current) hwRef.current.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'start' }); }, 260);
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
            <span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}</span>
            <h2 className="title h-title fade-up d1">{tr({ uz: <>Botingizning <span className="italic" style={{ color: T.accent }}>bosh raqami</span> tanlandi.</>, ru: <>Выбрана <span className="italic" style={{ color: T.accent }}>главная цифра</span> вашего бота.</> })}</h2>
          </div>
          {!isMentorL && <ScoreRing correct={correct} total={total} />}
        </div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: "Дождитесь ментора" }) : undefined} />
        </div>
        {arena && <QuizArena live={live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        {isMentorL ? recapCard : (
          <div className="split sum2">
            {recapCard}
            <div className="card ach-coll fade-up d4">
              <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: <>Nishonlaringiz — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</>, ru: <>Ваши значки — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</> })}</div>
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
        {/* A9: «Keyingi dars» — App.jsx m5-11 (n:12) bilan mos; uy vazifasi tugmasidan oldin */}
        <p className="next-lesson fade-up d4">{tr({ uz: <>Keyingi dars — <b>«Kecha kelgan odam bugun ham keldimi?»</b> Botingizning bir necha kunini yonma-yon qo'yasiz: kanalga e'lon bersangiz, kelganlar ko'payadi — qaytganlar-chi?</>, ru: <>Следующий урок — <b>«Тот, кто пришёл вчера, пришёл ли сегодня?»</b> Поставите рядом несколько дней своего бота: дадите объявление в канале — пришедших станет больше. А вернувшихся?</> })}</p>
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
        {hwOpen && <HwCard variant={hwVariant} onPick={pickHw} innerRef={hwRef} />}
        <MentorNote>{tr({ uz: "Arena tugagach podium — g'oliblarni nomlab tabriklang. Uy vazifasi: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa. Boti kam odam yig'gan bolalar sinfdoshining botida sanaydi — qoida o'sha. Tekshirishda: har kun uchun raqamlar yozilganmi, qaytganlar foizi foizda hisoblanganmi, bosh raqam qaysi bot-javobidan sanalgani yozilganmi.", ru: 'После арены — подиум: назовите победителей по именам и поздравьте. Домашнее задание: кто закончил код в классе — полный вариант, кто не успел — короткий. У кого к боту пришло мало людей, считают по боту одноклассника — правило то же. При проверке: записаны ли цифры за каждый день, посчитан ли процент вернувшихся в процентах, записано ли, по какому ответу бота считается главная цифра.' })}</MentorNote>
      </div>
    </Stage>
  );
};
// Dars-vizuallari: /stat suhbati (imzo-vizual), uch nom, foiz-to'ri, to'rt raqam, bot yozuvi, VS Code.
const CSS_M = `
  /* TELEGRAM-SUHBAT (imzo-vizual): o'ng tomonda sizning buyrug'ingiz, chapda bot javobi */
  .tg { background: ${T.paper}; border-radius: 16px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.22); min-width: 0; min-height: 96px; }
  .tg-me { align-self: flex-end; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: #fff; background: ${T.accent}; border-radius: 14px 14px 4px 14px; padding: 6px 12px; }
  .tg-bot { align-self: flex-start; display: flex; flex-direction: column; gap: 4px; background: ${T.bg}; border-radius: 14px 14px 14px 4px; padding: 9px 12px; min-width: 0; max-width: 100%; }
  .tg-l { display: flex; align-items: baseline; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.55vw,15px); line-height: 1.4; color: ${T.accent}; min-width: 0; overflow-wrap: anywhere; background: none; border: none; padding: 2px 0; text-align: left; }
  .tg-l.jami { color: ${T.ink2}; }
  .tg-l.jami.dim { color: ${T.ink3}; }
  .tg-l.add { animation: tg-in 0.35s ease-out both; }
  .tg-ic { font-style: normal; flex-shrink: 0; }
  .tg-nm { color: ${T.ink}; }
  .tg-q { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.accent}; }
  .tg-empty { color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.2em; align-self: center; margin: auto 0; }
  @keyframes tg-in { 0% { opacity: 0; transform: translateY(4px); } 100% { opacity: 1; transform: none; } }
  /* s1 MAQSAD: qatorlar o'z-o'zidan yoziladi (CSS-taymlayn); harakat kamaytirilganda darhol to'liq */
  .s1tg { max-width: 460px; width: 100%; align-self: center; }
  .s1tg .tg-bot { min-width: min(280px, 100%); }
  .tg-empty.nomk-wait { align-self: stretch; margin: 0; min-height: 132px; display: flex; align-items: center; justify-content: center; border: 1px solid ${T.line}; border-radius: 14px; background: rgba(255,255,255,0.45); }
  .tg-l.demo { opacity: 0; animation: tg-in 0.45s ease-out forwards; animation-delay: var(--dd, 0s); }
  .tg-l.demo.star { font-size: clamp(14px,1.75vw,17px); }
  /* s4: ikki dushanba yonma-yon — nomli ikki chip */
  .mon { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(10px,1.8vw,18px); }
  .mon-col { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
  .mon-chip { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.04em; color: ${T.ink2}; background: ${T.paper}; border-radius: 99px; padding: 5px 12px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .mon-col.new .mon-chip { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
  .stat-cmd { align-self: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 16px; color: #fff; background: ${T.accent}; border: none; border-radius: 99px; padding: 11px 28px; cursor: pointer; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5); }
  .stat-cmd:disabled { opacity: 0.5; cursor: default; }
  .s4bet { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 14px; padding: 12px 14px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; }
  .gt-b.on { box-shadow: inset 0 0 0 2px ${T.accent}; color: ${T.accent}; background: ${T.accentSoft}; }
  .gt-b:disabled { cursor: default; }
  .stat-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .stat-chip { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; }
  .stat-chip.used { color: ${T.success}; background: ${T.successSoft}; cursor: default; }
  .fakt-line { margin: 0; display: flex; gap: 8px; align-items: baseline; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  /* s5: bosiladigan qatorlar va nom-kartasi */
  .tg-l.tap { cursor: pointer; border-radius: 8px; padding: 4px 8px; margin: 0 -8px; transition: background 0.15s; }
  .tg-l.tap:hover, .tg-l.tap.on { background: ${T.accentSoft}; }
  .tg-l.tap::after { content: '›'; margin-left: 6px; color: ${T.ink3}; font-weight: 800; }
  .tg-l.tap.seen::after { content: '✓'; color: ${T.success}; font-size: 12px; }
  .nomk { background: ${T.paper}; border-radius: 14px; padding: 13px 15px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.22); min-width: 0; overflow-wrap: anywhere; }
  .nomk-ic { font-size: 22px; }
  .nomk-q { font-family: 'Source Serif 4', serif; font-style: italic; font-size: clamp(15px,1.9vw,18px); color: ${T.ink}; }
  .nomk-nom { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: ${T.accent}; }
  .nomk-def { margin: 0; font-size: clamp(13.5px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
  .nomk-en { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
  /* s7: FOIZ — ikki holat, 10×10 nuqta-to'r */
  .fz { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(10px,1.8vw,18px); }
  .fz-pair { position: relative; background: ${T.paper}; border-radius: 16px; padding: 12px 14px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; }
  .fz-k { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 8px; padding: 3px 10px; }
  .fz-fakt { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.55vw,14.5px); line-height: 1.45; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .fz-body { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
  .fz-side { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .fz-btn { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: #fff; background: ${T.accent}; border: none; border-radius: 11px; padding: 9px 16px; cursor: pointer; }
  .fz-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .fz-calc { font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
  .fz-calc b { color: ${T.success}; }
  .fz-cap { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.success}; }
  .dots10 { display: grid; grid-template-columns: repeat(10, 9px); gap: 3px; flex-shrink: 0; }
  .dots10 i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
  .dots10 i.on { background: ${T.success}; animation: dot-on 0.3s ease-out both; animation-delay: var(--di, 0s); }
  @keyframes dot-on { 0% { transform: scale(0.4); } 100% { transform: scale(1); } }
  /* s10: to'rt raqam kartasi */
  .rq-ed { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .rq-h { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; color: ${T.ink}; }
  .rq-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
  .rq-chips { display: flex; flex-wrap: wrap; gap: 7px; }
  .rq-chip { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 2px; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; background: ${T.bg}; border: none; border-radius: 10px; padding: 7px 12px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .rq-chip.on { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .rq-kod { font-style: normal; font-size: 10.5px; color: ${T.ink3}; }
  /* s11: bot yozuvi — qatorlar SANALADI (tekshiruv) */
  .log { background: ${T.paper}; border-radius: 16px; padding: 10px; display: flex; flex-direction: column; gap: 3px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; }
  .log-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.04em; color: ${T.ink2}; padding: 2px 6px 6px; }
  .log-row { display: grid; grid-template-columns: 20px 46px minmax(0,1fr) auto; gap: 8px; align-items: baseline; text-align: left; background: none; border: none; border-radius: 9px; padding: 6px 8px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; cursor: pointer; transition: background 0.15s, box-shadow 0.15s; }
  .log-row.odam { box-shadow: inset 3px 0 0 ${T.accent}88; }
  .log-row.bot { color: ${T.ink2}; background: ${T.bg}; box-shadow: inset 3px 0 0 ${T.ink3}66; }
  .log-row:disabled { cursor: default; opacity: 0.6; }
  .log-row:hover:not(:disabled) { background: ${T.bg}; }
  .log-row.on { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; opacity: 1; }
  .log-row.good { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
  .log-row.bad { animation: cmt-shake 0.4s ease; }
  .log-row.hunt { animation: log-hunt 2.2s ease-in-out infinite; }
  @keyframes log-hunt { 0%, 100% { background: transparent; } 50% { background: ${T.bg}; } }
  .log-n, .log-v { font-size: 11px; color: ${T.ink3}; }
  .log-t { min-width: 0; overflow-wrap: anywhere; }
  .log-ok { color: ${T.success}; font-weight: 800; }
  .yz-cnt { font-size: 12px; color: ${T.ink2}; }
  /* s12: kutilgan bot-javobi — «Bajardim» bosilguncha xira */
  .kd-tg { opacity: 0.45; transition: opacity 0.5s; flex-shrink: 0; }
  .split.kod .vsc { min-height: 0; flex-shrink: 1; display: flex; flex-direction: column; }
  .split.kod .vsc-body { flex: 1 1 auto; min-height: 0; }
  .kd-tg.lit { opacity: 1; }
  .nextsig { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border: none; border-radius: 10px; padding: 8px 15px; cursor: pointer; }
  .nextsig:hover { background: ${T.accent}; color: #fff; }
  /* KODING darvoza-tugmalari va VS Code maketi (PmLesson20 dan AYNAN) */
  .gt-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .gt-btns.col3 { flex-direction: column; align-items: stretch; }
  .gt-b { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 10px; padding: 9px 14px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; text-align: left; transition: box-shadow 0.15s, color 0.15s; }
  .gt-b:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}66; color: ${T.accent}; }
  .gt-b.miss { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; animation: cmt-shake 0.4s ease; }
  @keyframes cmt-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 55% { transform: translateX(5px); } 80% { transform: translateX(-2px); } }
  .vsc { position: relative; background: #1E1E1E; border-radius: 14px; overflow: hidden; box-shadow: 0 14px 30px -10px rgba(${T.shadowBase},0.35); }
  .vsc-bar { background: #252526; display: flex; align-items: center; gap: 2px; padding-right: 8px; }
  .vsc-tab { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: #8B949E; background: #2D2D2D; border: none; padding: 9px 14px; display: inline-flex; align-items: center; gap: 6px; }
  .vsc-tab.on { background: #1E1E1E; color: #E6EDF3; box-shadow: inset 0 2px 0 #007ACC; }
  .vsc-lock { margin-left: auto; font-family: 'Manrope'; font-weight: 700; font-size: 11px; letter-spacing: 0.04em; color: #B9A8E6; background: rgba(255,255,255,0.07); border-radius: 8px; padding: 5px 11px; }
  .vsc.no-copy .vsc-body { user-select: none; -webkit-user-select: none; }
  .vsc-body { padding: 10px 14px 12px 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11px,1.35vw,12.5px); color: #D4D4D4; line-height: 1.58; overflow: auto; max-height: clamp(240px, 46vh, 520px); scrollbar-width: thin; scrollbar-color: #4A4A4A #1E1E1E; }
  .vsc-line { display: flex; align-items: flex-start; min-width: max-content; }
  .vsc-ln { color: #6E7681; min-width: 26px; text-align: right; margin-right: 14px; font-size: 10.5px; flex-shrink: 0; user-select: none; }
  /* F-1001-70: kod qatori bo'linmaydi (izohdagi // va ism bir qatorda qoladi) — uzun qator gorizontal aylantiriladi */
  .vsc-code { white-space: pre; flex: 1 0 auto; }
  .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13.5px,1.7vw,15px); cursor: pointer; border: none; border-radius: 13px; padding: 12px 18px; background: ${T.accent}; color: #fff; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.4); }
  .lp-done-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; opacity: 1; }
  /* A4-qo'shimcha: qator belgisi — CSS nuqta (bosh raqam to'q va kattaroq, qolganlari och, jami kulrang) */
  .mx-dot { display: inline-block; flex-shrink: 0; align-self: center; width: 8px; height: 8px; border-radius: 50%; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}77; }
  .mx-dot.bosh { width: 11px; height: 11px; background: ${T.accent}; box-shadow: none; }
  .mx-dot.jami { background: ${T.ink3}; box-shadow: none; }
  /* s4: yo'nalish strelkasi chiziladi (A7) — rang neytral */
  .mx-arw { width: 10px; height: 14px; flex-shrink: 0; align-self: center; margin-left: 2px; }
  .mx-arw:not(.up) { transform: rotate(180deg); }
  .mx-arw path { fill: none; stroke: ${T.ink2}; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: mx-draw 1s ease-out 0.2s forwards; }
  @keyframes mx-draw { to { stroke-dashoffset: 0; } }
  /* s2: fikr kartasi kulrang, raqam kartasi asosiy rangda; ochiladigan karta belgisi (U1) */
  .dfc.dfc-fikr { border-left: 4px solid ${T.ink3}; }
  .dfc.dfc-fikr .dfc-h { color: ${T.ink2}; }
  .dfc.dfc-son { border-left: 4px solid ${T.accent}; }
  .dfc.dfc-son .dfc-h { color: ${T.accent}; }
  .mx-mark { margin-left: auto; flex-shrink: 0; font-family: 'Manrope'; font-weight: 800; font-size: 15px; color: ${T.ink3}; }
  .mx-mark.ok { color: ${T.success}; }
  /* s10 */
  .rq-note { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; }
  /* s11: to'g'ri javobda qator → ism chizig'i (A7) */
  .yz-box { position: relative; }
  .yz-lines { position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; z-index: 1; }
  .yz-lines path { fill: none; stroke: ${T.success}; stroke-width: 2; stroke-linecap: round; opacity: 0.75; stroke-dasharray: 1; stroke-dashoffset: 1; animation: mx-draw 0.9s ease-out forwards; }
  .yz-names { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
  @media (max-width: 860px) { .yz-names { flex-direction: row; flex-wrap: wrap; } }
  .yz-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 5px 13px; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
  /* s14: bajarilgan 1-qadam bitta qatorga yig'iladi (A6) */
  .rcp-step.rcp-folded { padding: 10px 16px; gap: 6px; }
  .rcp-step.rcp-folded .rcp-n { background: ${T.successSoft}; color: ${T.success}; box-shadow: none; }
  /* s17: keyingi dars (A9) */
  .next-lesson { margin: 0; text-align: center; font-size: clamp(13px,1.5vw,14.5px); line-height: 1.5; color: ${T.ink2}; }
  .next-lesson b { color: ${T.ink}; }
  @media (max-width: 860px) {
    .yz-lines { display: none; }
  }
  @media (max-width: 760px) {
    .mon, .fz { grid-template-columns: minmax(0,1fr); }
  }
  @media (prefers-reduced-motion: reduce) {
    .tg-l.demo { opacity: 1; animation: none; }
    .tg-l.add, .dots10 i.on, .log-row.hunt, .log-row.bad, .gt-b.miss { animation: none; }
    .mx-arw path, .yz-lines path { animation: none; stroke-dashoffset: 0; }
  }
`;
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
  .hopt.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 12px 26px -9px rgba(91,61,230,0.35); background: ${T.accentSoft}; }
  .hopt-ic { font-size: clamp(24px,3.4vw,32px); line-height: 1; color: ${T.ink}; } /* F-0926-05 #23: disabled-tugma rangi (rgba 0.3) emojini xiralashtirmasin */
  .hopt-nom { font-weight: 700; font-size: clamp(12.5px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.3; overflow-wrap: anywhere; }
  @media (max-width: 560px) { .hrow.two { grid-template-columns: minmax(0,1fr); } }
  .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
  .hvote-row { display: flex; align-items: center; gap: 10px; }
  .hvote-lbl { flex: 0 0 clamp(120px,26vw,230px); font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hvote-row.mine .hvote-lbl { color: ${T.accent}; }
  .hvote-track { flex: 1; height: 12px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
  .hvote-fill { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.6s cubic-bezier(.2,.7,.2,1); }
  .hvote-row.top .hvote-fill { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
  /* Yalang'och son yorliqsiz turmasin: sanoq odam-belgisi bilan bitta kapsulada —
     «%» ishlatilmaydi (8-A taqiq-jadvali), lekin son nimani sanayotgani ko'rinib turadi. */
  .hvote-pct { display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-width: 46px; font-size: 12.5px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 4px 10px; font-variant-numeric: tabular-nums; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .hvote-pct::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: 0.6; }
  .hvote-row.mine .hvote-pct { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}44; }
  .hvote-row.top .hvote-pct { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
  @media (prefers-reduced-motion: reduce) { .hopt, .hvote-fill { transition: none; } }
  /* Hook ustuni bitta enda turadi: tanlovlar → javob (720px) */
  .h0end { max-width: 720px; align-self: center; width: 100%; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
  /* IMZO-SAHNA — «ikki kun yonma-yon»: bugungi belgi kechagi ro'yxatda ham bo'lsa yashillanadi */
  @keyframes h0-hit {
    0%, 8% { background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.accent}; transform: scale(1); }
    16% { transform: scale(1.22); }
    22%, 78% { background: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; transform: scale(1); }
    92%, 100% { background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.accent}; transform: scale(1); }
  }
  @keyframes h0-run { 0%, 6% { left: 0; opacity: 0; } 10% { opacity: 1; } 20%, 100% { left: calc(100% - 8px); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) {
  }
  @media (max-width: 620px) { .h0end { flex-direction: column; align-items: flex-start; } }

  /* MAQSAD (s1) — uch kunlik hisob qatorlari o'z-o'zidan yozilib chiqadi (18-qonun) */
  @keyframes s1-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

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
     Rang-qonuni: qaytgan odam belgisi — success (bu chindan yutuq); birinchi marta kelgani —
     accent kontur; past qaytish qizil bo'yalmaydi (bu xato ham, nosozlik ham emas). */
  /* Belgilar-ustuni: align-self stretch — 23 belgili kun ham, 6 belgili kun ham AYNAN bir
     balandlikda turadi (qator balandligini eng to'lasi belgilaydi, ustunlar teng qoladi). */
  /* §135 rang-ko'rlik: ikki belgi RANGDAN TASHQARI to'lganligi bilan ham farq qiladi —
     birinchi marta kelgan = ichi bo'sh kontur (2px halqa), kecha ham kelgan = to'la bo'yalgan.
     Kul-rang ekranda ham ikkisi ajralib turadi (legenda emojisi bilan bir xil: ⬜ va 🟩). */
  /* §134 rang-kaliti TIRIK: chip ustiga kelinsa o'sha rangdagi belgilar ajralib chiqadi */
  /* §134 rang-legendasi: sarlavha qatorida, belgilarning O'ZI bilan bir xil rangda —
     yashil chip = yashil belgi, oq chip = indigo konturli belgi (bola kalitni sanashdan
     OLDIN o'qiydi). Chip hech qachon bukilmaydi va yashirilmaydi. */

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
  /* §134 kaliti: yashil katak = kelgan kun · ↩️ katak = qaytish kuni (katak rangi bilan AYNAN bir xil) */
  /* Katak o'lchami: kun-sarlavhasi va katak AYNAN bir kenglikda, ustunda markazda —
     to'r cho'zilgan tasma emas, barmoq tegadigan kvadratchaga yaqin katak bo'lib turadi. */

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
  .wsp-item-n { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: ${T.success}; color: #fff; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
  .wsp-item-t { flex: 1; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; line-height: 1.4; min-width: 0; overflow-wrap: anywhere; }
  .wsp-arw { font-style: normal; font-weight: 800; color: ${T.accent}; }
  .wsp-item-edit { flex-shrink: 0; background: none; border: none; cursor: pointer; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.accent}; border-radius: 8px; padding: 2px 6px; }
  .wsp-item-edit:hover { color: ${T.accent}; background: ${T.accentSoft}; }
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
  /* F-1001-70: s14 maydoni textarea — telefonda namuna matni kesilmaydi; Enter yangi qator qo'shmaydi (input kabi bir qator) */
  .reflect-input.ta { display: block; resize: none; line-height: 1.45; }
  .reflect-input.filled { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .reflect-input.await { animation: rin-wait 2.2s ease-in-out infinite; }
  @keyframes rin-wait { 0%, 100% { box-shadow: inset 0 0 0 1.5px ${T.line}; } 50% { box-shadow: inset 0 0 0 1.5px ${T.accent}77, 0 0 0 4px rgba(91,61,230,0.10); } }
  .reflect-input.await:focus { animation: none; }
  @media (prefers-reduced-motion: reduce) { .reflect-input.await { animation: none; box-shadow: inset 0 0 0 1.5px ${T.accent}55; } }
  .sfb { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; }
  .sfb.ok { color: ${T.success}; background: ${T.successSoft}; }
  .sfb.ask { color: ${T.accent}; background: ${T.accentSoft}; }
  .wsxrow { display: flex; gap: 18px; flex-wrap: wrap; align-items: flex-start; }
  .wsxrow > .wsx.open { flex: 1 1 100%; }
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
  /* U1 (F-1001-72 sinfi): ballsiz tanlov (s4 bashorat, s7 holat) yig'ilgan qatori NEYTRAL — yashil fon va yashil belgi yo'q. Modifikator calm; s12 kod-savoli yashil qoladi */
  .cmt-fold.calm { background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .cmt-fold.calm .cmt-done { color: ${T.ink}; }
  .cmt-fold.calm .cmt-tick { color: ${T.ink2}; }
  .cmt-tip { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13px); line-height: 1.45; color: ${T.ink2}; background: ${T.accentSoft}; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; animation: fade-step 0.3s ease-out; }
  @media (prefers-reduced-motion: reduce) { .cmt.hunt, .cmt-tip, .cmt-done, .fchoice.miss { animation: none; } .fchoice, .fchoice:hover { transition: none; transform: none; } }
  .kdpanel { position: relative; background: ${T.paper}; border-radius: 16px; padding: 11px 13px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.18); min-width: 0; transition: border-color 0.3s; }
  /* F-0926-05 #16: yashil ramka olindi — holatni tugma yoki yozuv aytadi */
  .kdpanel ol.kdreq { margin: 0; padding-left: 22px; display: flex; flex-direction: column; gap: 4px; }
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
  .fc-done-emoji { font-size: 40px; font-weight: 800; line-height: 1; color: ${T.success}; }
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
    .screen > .h0end { flex-grow: 1; max-height: 176px; }
    .screen > .hrow.two .hopt { justify-content: center; }
    /* s8 — yozish-ekrani: topshiriq-paneli cho'ziladi, muharrir-kartasi O'SMAYDI */
    .screen > .split:not(.s4):not(.kod):not(.sum2) { flex-grow: 1; align-items: stretch; max-height: 424px; }
    .split:not(.s4):not(.kod):not(.sum2) > .col { min-height: 0; }
    /* F-0926-05 #17: muharrir-kartasi cho'zilmaydi — ichidagiga mos (1-hafta kichik, har hafta bilan o'sadi); maydon tepada, joyidan qimirlamaydi */
    /* F-0926-05 #17: Yordam topshiriq-paneli ostida turadi — karta cho'zilmagach ustun oyog'ida bo'sh joyda osilib qolardi */
    /* s10 — ikki karta o'rtada turadi, cheklangan balandlikda */
    .screen > .split.kod { flex-grow: 1; align-items: stretch; max-height: 430px; }
    /* F-0926-05 #20: .cmt cho'zilmaydi — ichidagiga mos (159/13) */
    .screen > .cmt .gt-rows { gap: clamp(7px,1.4vh,13px); }
    .screen:has(.pod-card) { justify-content: center; }
    .s-fin { padding-bottom: 10px; }
    .split.kod > .col { min-height: 0; }
    .split.kod .klaunch { flex-grow: 1; justify-content: center; }
    /* F-1001-70: kdpanel cho'zilmaydi — ichidagiga mos (bo'm-bo'sh oq quti yo'q, F-0926-05 #20) */
    /* s4 — KALENDAR: sahna va fakt-paneli balandligini OLDINDAN egallaydi: kun ochilganda
       kataklar va panel SAKRAMAYDI, bola o'zgargan sonlarga qaraydi. */
    .screen > .split.s4 { flex-grow: 1; align-items: stretch; max-height: 220px; }
    .split.s4 > .col { min-height: 0; }
    .split.s4 > .col:first-child { justify-content: flex-start; }
    .split.s4 .fakt { flex-grow: 1; overflow: hidden; }
    /* s9 — belgilash-jadvali qolgan joyni to'ldiradi (raundlar orasida siljimaydi) */
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

  .rc-overlay { position: fixed; inset: 0; z-index: 10005; background: ${T.bg}; display: flex; flex-direction: column; align-items: center; padding: clamp(14px,3vw,32px); overflow-y: auto; animation: fade-step 0.3s ease-out; font-family: 'Manrope', sans-serif; }
  .rc-head { width: 100%; max-width: 880px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .rc-tag { font-weight: 800; font-size: clamp(11px,1.4vw,13px); letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 6px 14px; white-space: nowrap; }
  .rc-title { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.4vw,22px); color: ${T.ink}; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rc-x { background: ${T.paper}; border: none; border-radius: 10px; width: 36px; height: 36px; font-size: 15px; color: ${T.ink2}; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
  .rc-x:hover { color: ${T.accent}; }
  .rc-card { flex: 1; width: 100%; max-width: 880px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: clamp(10px,2.2vw,20px); padding: clamp(16px,3vw,28px) 0; animation: fade-step 0.35s ease-out; }
  .rc-ic { width: clamp(52px,8vw,72px); height: clamp(52px,8vw,72px); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(24px,3.6vw,34px); line-height: 1; color: ${T.accent}; background: ${T.accentSoft}; }
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
  .qz-bseria { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: #FF9A5D; }
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
export default function PmMetricsLesson({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
  setLiveLang(lang); // jonli-modul tarjimoni ham shu tilda (payload v2 lang maydoni shu yerdan — smoke I6)
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

  // Ekran-tartibi SCREEN_META bilan bir xil (18 ta)
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenCoding, ScreenFinalTest, ScreenReflection, ScreenPodium, ScreenFlashcards, ScreenSummary];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        /* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        ${CSS_BASE}
        ${CSS_LESSON}
        ${CSS_M}
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
