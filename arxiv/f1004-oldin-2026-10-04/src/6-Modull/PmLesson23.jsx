import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
// Kod kompilyatori — UMUMIY modul (F-0809-05 · GATE S 3-qarori). Tugma bilan ochiladigan
// to'liq-ekran asbob, shuning uchun CodeStrike brendida (PM_DARS_ETALON 1-bo'lim istisnosi).
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM · M6-D6 — ILOVA O'ZI QAROR QILSA, KIMGA TEGADI (chegara — mahsulot qarori)
// Senariy-manba: pm-senariylar/M6-D6-Etika.md ([AVTO-GATE S] YOPILDI, 2026-08-19).
// Misol-ip: o'quvchining mini-do'koni — ikki sahna: do'kon ilovasi (s4) va do'kon boti (s9).
// Imzo-vizual: OQIBAT-KO'ZGUSI — chapda uch ish, o'ngda shu qaror tegadigan odam.
// Kirish-artefakt: pm-m6d2-prd (JIM ZAXIRA — yo'q bo'lsa varaq-kartasi umuman chizilmaydi).
// Chiqish-artefakt: pm-m6d6-chegara = { chegaralar: [{qaror, jabr} x3], savedAt } -> m6-12.
// INFRA MANBAI: src/4-Modull/PmLesson11.jsx (jonli relslar, Stage, QuestionScreen,
//   MentorTestStats, RecapOverlay, PairTimer, ScreenPodium, CodeStrike-arena, nishonlar)
//   + src/4a-Modull/PmLesson15.jsx (kompilyatorning fixed-qobig'i, zoom-bekori).
// KODING: umumiy kompilyator (registr R1 navbati: m6-02 VS Code -> m6-06 kompilyator).
// BIR TILLI (UZ): tarjima-yordamchisi yo'q; RU alohida sweep'da qo'shiladi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================
// ============================================================

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
const LESSON_META = { lessonId: 'pm-m6d6-v1', lessonTitle: { uz: "Ilova o'zi qaror qilsa, kimga tegadi?", ru: 'Если приложение решает само, кого это касается?' } };
// YAKUN-TUZILMASI ETALONDAN (P0 PmUserStory · PmLesson2 · PmLesson4 · M3-D10):
// koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa BIR sahifada).
// Uy-vazifa va arena alohida ekran BO'LMAYDI — ikkovi ham yakun ichida.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom', scored: false, scope: 'hook' },        // 0  · BLOK 1
  { id: 's1',  type: 'rule',        template: 'custom', scored: false, scope: null },          // 1  · BLOK 2
  { id: 's2',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 2  · BLOK 3 teoriya-1
  { id: 's3',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 3  · TEST-1
  { id: 's4',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 4  · YADRO: oqibat-ko'zgusi
  { id: 's5',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 5  · TEST-2
  { id: 's6',  type: 'case',        template: 'custom', scored: false, scope: null },          // 6  · haqiqiy holat
  { id: 's7',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 7  · TEST-3
  { id: 's8',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 8  · BLOK 4 uch chegara
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
  s0: "Bola ilova so'ramay qaror qilganda unga qanday tuyulganini tanlaydi va ikkala tanlovda ham bir xil savolga keladi",
  s1: "Bola dars oxirida uchta qarorni o'zi yozib olishini oldindan ko'radi",
  s2: "Bola ikki kartani ochib ilova so'rab qiladigan ish bilan o'zi qiladigan ishning farqini topadi",
  s3: "Bola uchta do'kondan qay birida chegara borligini tanlaydi",
  s4: "Bola uch ishda «AI o'zi qiladi» tugmasini bosib qaror kimga tegishini ko'radi, so'ng bitta ishni odamga qaytaradi",
  s5: "Bola chegara birinchi navbatda qaysi ishga qo'yilishini aniqlaydi",
  s6: "Bola AI ilovasi ekranining pastidagi qator nima uchun turganini biladi",
  s7: "Bola chegara qaysi ikki qadam orasiga qo'yilishini tanlaydi",
  s8: "Bola mahsulotiga uchta chegarani bittalab yozadi va har biriga bu qaror tegadigan aniq odamni qo'yadi",
  s9: "Bola do'kon botining to'rt qarorini u tegadigan odamga qo'shadi",
  s10: "Bola kompilyatorda chegara kerak ishlarni topadigan funksiyani yozadi",
  s11: "Bola hamma ishga chegara qo'yilsa do'konda nima bo'lishini tanlaydi",
  s12: "Bola uch chegarasini yoddan aytadi va bir qatorda yozib qoldiradi",
  s13: "Bola o'z natijasini (jonlida — guruh reytingini) ko'radi",
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

// Scored ekranlar javob kaliti — darslik-jonli TASDIQLAYDI (senariy 4-bo'limi bilan qatorma-qator).
// Kalit nomi = submitAnswer'ga uzatilgan question_id: testlarda SCREEN_META.id, praktikada zona-nomi.
// -1 = ishtirok-sentinel (server: to'ldirgani = to'g'ri). Praktika signal-zonasi: PRACTICE_BASE+screen.
const INLINE_KEYS = { s3: 1, s5: 2, s7: 0, s11: 1, kozgu: -1, practice: -1, juft: -1, koding: -1 };
// Har scored ekran uchun qayta-tushuntirish. Kalitlar = scored ekran INDEKSI (3/5/7/11).
const RECAPS = {
  3: {
    title: { uz: 'Chegara — oldindan qilingan qaror', ru: 'Граница — решение, принятое заранее' },
    cards: [
      { ic: '⚖️', h: { uz: 'Chegara nima', ru: 'Что такое граница' }, body: { uz: <>Ilova qaysi ishni o'zi qilaverishi, qaysisini odamdan o'tkazishi haqida oldindan qilingan qaror.</>, ru: <>Заранее принятое решение о том, какую работу приложение делает само, а какую пропускает через человека.</> } },
      { ic: '🙋', h: { uz: 'Chegara ilovani to\'xtatmaydi', ru: 'Граница не останавливает приложение' }, body: { uz: <>U bitta ishni ilovadan olib, <b>odamga qaytaradi</b>. Qolgan ishlarni ilova avvalgidek o'zi qilaveradi.</>, ru: <>Она забирает у приложения одну работу и <b>возвращает её человеку</b>. Остальное приложение делает само, как и раньше.</> } },
      { ic: '🛒', h: { uz: 'Do\'konda buni qanday ko\'rasiz', ru: 'Как это выглядит в магазине' }, body: { uz: <>Javobni AI yozadi, yuborishdan oldin uni <b>do'kon egasi o'qiydi</b> — ish AI da qoldi, qaror odamda.</>, ru: <>Ответ пишет AI, а перед отправкой его <b>читает владелец магазина</b> — работа осталась у AI, решение у человека.</> }, ask: { uz: "Do'koningizda qaysi ish odamdan o'tishi kerak?", ru: 'Какая работа в вашем магазине должна проходить через человека?' } }
    ]
  },
  5: {
    title: { uz: 'Chegara qaysi ishga kerak', ru: 'Какой работе нужна граница' },
    cards: [
      { ic: '🙋', h: { uz: 'So\'ralgan ishni odam to\'xtata oladi', ru: 'Работу, о которой спросили, человек может остановить' }, body: { uz: <>Ilova avval so'rasa, xato javob <b>odamning oldida</b> to'xtaydi — chegara u yerda allaqachon bor.</>, ru: <>Если приложение сначала спрашивает, ошибочный ответ останавливается <b>перед человеком</b> — граница там уже есть.</> } },
      { ic: '🤖', h: { uz: 'O\'zi qilingan ishni hech kim to\'xtatmaydi', ru: 'Работу, которую приложение сделало само, никто не остановит' }, body: { uz: <>Ilova so'ramay qilsa, ish to'g'ri mijozga boradi. Shuning uchun chegara <b>birinchi navbatda</b> shunday ishga qo'yiladi.</>, ru: <>Если приложение делает, не спросив, работа уходит прямо к клиенту. Поэтому границу ставят <b>в первую очередь</b> именно на такую работу.</> } },
      { ic: '🔎', h: { uz: 'Ikki savol yetadi', ru: 'Хватит двух вопросов' }, body: { uz: <>Buni ilova <b>o'zi qiladimi</b>? Bu ish <b>odamga tegadimi</b>? Ikkalasi ham «ha» bo'lsa — shu ishga chegara kerak.</>, ru: <>Приложение <b>делает это само</b>? Эта работа <b>касается человека</b>? Если оба ответа «да» — этой работе нужна граница.</> }, ask: { uz: "Do'konda ilova o'zi qiladigan yana qaysi ish bor?", ru: 'Какую ещё работу приложение в магазине делает само?' } }
    ]
  },
  7: {
    title: { uz: 'AI yozadi, odam o\'qib chiqadi', ru: 'AI пишет, человек проверяет' },
    cards: [
      { ic: '📱', h: { uz: 'Ilovaning o\'zi yozib qo\'ygan', ru: 'Приложение написало это само' }, body: { uz: <>AI bilan yozishadigan ilova ekranining pastiga o'sha qatorni <b>o'zi</b> yozib qo'ygan: javobni tekshirib ko'ring.</>, ru: <>Приложение для переписки с AI <b>само</b> написало внизу экрана эту строку: проверяйте ответ.</> } },
      { ic: '⏱', h: { uz: 'Chegara qayerga tushadi', ru: 'Где проходит граница' }, body: { uz: <>U <b>AI yozgan payt</b> bilan <b>mijoz o'qigan payt</b> orasiga tushadi — shu oraliqda odam javobni ko'rib chiqadi.</>, ru: <>Она проходит между <b>моментом, когда AI написал</b>, и <b>моментом, когда клиент прочитал</b>, — в этом промежутке человек проверяет ответ.</> } },
      { ic: '🛒', h: { uz: 'Tavsif ham shunday', ru: 'С описанием так же' }, body: { uz: <>AI tavsifni yozadi, do'kon egasi o'qiydi, keyin tavsif saytga chiqadi.</>, ru: <>AI пишет описание, владелец магазина его читает, и только потом описание появляется на сайте.</> }, ask: { uz: "Xato tavsif qaysi qadamda tutiladi?", ru: 'На каком шаге ловят ошибочное описание?' } }
    ]
  },
  11: {
    title: { uz: "Chegara tanlab qo'yiladi", ru: 'Границу ставят выборочно' },
    cards: [
      { ic: '🎯', h: { uz: 'Chegarani qaysi ish oladi', ru: 'Какая работа получает границу' }, body: { uz: <>Chegara <b>odamga eng og'ir tegadigan</b> ishga qo'yiladi — hamma ishga emas.</>, ru: <>Границу ставят на работу, которая <b>тяжелее всего ударит по человеку</b>, — а не на всё подряд.</> } },
      { ic: '🛑', h: { uz: 'Hamma ishga qo\'ysangiz', ru: 'Если поставить на всё' }, body: { uz: <>Har ish do'kon egasini kutadi — <b>do'kon sekinlashadi</b>.</>, ru: <>Каждая работа ждёт владельца магазина — <b>магазин замедляется</b>.</> } },
      { ic: '🙋', h: { uz: 'Aniq kim', ru: 'Кто именно' }, body: { uz: <>Har chegarada bu qaror tegadigan aniq odamlar yoziladi: «buyurtma bergan mijoz», «manzilini qisqa yozgan mijoz».</>, ru: <>В каждой границе записывают конкретных людей, которых касается это решение: «клиент, сделавший заказ», «клиент, коротко написавший адрес».</> }, ask: { uz: "Uch chegarangizdan qay biri eng aniq odamni aytadi?", ru: 'Какая из ваших трёх границ называет самого конкретного человека?' } }
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
    <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title={tr({ uz: 'Mentorga eslatma — bosib oching', ru: 'Заметка ментору — нажмите, чтобы открыть' })}>{tr({ uz: '📋 Eslatma', ru: '📋 Заметка' })}</button>
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
// 🛒 DARS MA'LUMOTLARI — o'quvchining mini-do'koni (bitta misol-ip, 108-qonun)
// Ikki sahna, bitta olam: s4 — do'kon ilovasining uch ishi · s9 — do'konning boti.
// ============================================================

// ===== SCREEN 0 — HOOK: ilova so'ramay qaror qildi =====
const HOOK_OPTS = [
  { k: 'qulay',    ic: '🙂', t: { uz: "Qulay bo'lgan — vaqtimni tejadi", ru: 'Было удобно — сэкономило время' } },
  { k: 'yoqmagan', ic: '😕', t: { uz: "Yoqmagan — o'zim tanlamoqchi edim", ru: 'Не понравилось — хотелось выбрать самому' } },
];
// 100-qonun: tanlov yoziladi, hech qayerda O'QILMAYDI.
const HOOK_KEY = 'pm-m6d6-hook-choice';
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
    <Stage eyebrow={tr({ uz: "Kirish · so'ramay qilingan ish", ru: 'Вступление · работа без спроса' })} screen={screen} navContent={<NavNext optionalLive turnBusy={picked === null && !isMentor} disabled={picked === null && !isMentor} label={opened ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' })} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ilova so'ramay qaror qilsa, sizga qanday <span className="italic" style={{ color: T.accent }}>tuyulgan?</span></>, ru: <>Приложение решило без спроса — как вам <span className="italic" style={{ color: T.accent }}>это показалось?</span></> })}</h2></div>
        <Mentor>{tr({ uz: "Ba'zan ilova o'zi tanlab qo'yadi, o'zi xabar yuboradi, o'zi obunani uzaytiradi.", ru: 'Иногда приложение само что-то выбирает, само отправляет сообщение, само продлевает подписку.' })}</Mentor>
        <div className="hrow two fade-up delay-1">
          {HOOK_OPTS.map((o, i) => (
            <button key={o.k} className={`hopt${picked === i ? ' on' : ''}${opened ? ' open' : ''}${!opened && optWave ? waveCls(true, i, HOOK_OPTS.length) : ''}`} disabled={opened} onClick={() => pick(i)}>
              <span className="hopt-ic">{o.ic}</span>
              <span className="hopt-nom">{tr(o.t)}</span>
            </button>
          ))}
        </div>
        {opened && (
          /* IMZO-SAHNA: ikkala tanlovda ham AYNAN bir xil natija ochiladi (104/119-qonun) */
          <div className="frame-soft h0end fade-step">
            <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ikkalasi ham bo'ladi: ba'zi ishni ilova o'zi qilsa qulay, ba'zisini odam o'zi hal qilmoqchi. Farq bitta savolda: <b>bu qaror kimga tegadi?</b> Bugun shu savolni o'zingiz qurayotgan mini-do'konga berasiz.</>, ru: <>Бывает и то, и другое: одну работу удобно отдать приложению, другую человек хочет решить сам. Разница в одном вопросе: <b>кого касается это решение?</b> Сегодня вы зададите этот вопрос мини-магазину, который сами строите.</> })}</p>
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
                  <span className="hvote-lbl">{o.ic} {tr(o.t)}</span>
                  <span className="hvote-track"><span className="hvote-fill" style={{ width: `${Math.max(pct, totalVotes ? 4 : 0)}%` }} /></span>
                  <span className="hvote-pct mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
        <MentorNote>{tr({ uz: "Ovozlar bo'linadi — ikkala tomonning ham hayotiy dalili bor. Shu bo'linishning o'zi darsga eshik: qulaylik ham rost, so'ramaslik ham rost. Javobni oldindan aytmang.", ru: 'Голоса разделятся — у обеих сторон есть жизненные доводы. Само это разделение — вход в урок: и удобство правда, и «без спроса» правда. Не называйте ответ заранее.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: uch qaror-qatori o'z-o'zidan yozilib chiqadi (18-qonun WOW) =====
// Demo-uchligi ATAYLAB s4 uchligidan ham, s9 to'rtligidan ham TASHQARIDA (spoyler-taqiq):
// bular do'konning boshqa ishlari. §126: «chegara» so'zi bu ekranda YO'Q.
const DEMO_QAROR = [
  { m: { uz: "Narxni o'zi o'zgartirmaydi", ru: 'Не меняет цену само' },          b: { uz: "Eski narxni ko'rgan mijoz", ru: 'Клиент, видевший старую цену' } },
  { m: { uz: "Sharhni o'zi o'chirmaydi", ru: 'Не удаляет отзыв само' },            b: { uz: 'Sharh yozgan mijoz', ru: 'Клиент, написавший отзыв' } },
  { m: { uz: "Buyurtmani o'zi to'lovga yubormaydi", ru: 'Не отправляет заказ на оплату само' }, b: { uz: "Hali o'ylab turgan mijoz", ru: 'Клиент, который ещё думает' } },
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начнём →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun mini-do'koningiz uchun <span className="italic" style={{ color: T.accent }}>uchta qaror</span> yozasiz.</>, ru: <>Сегодня вы запишете <span className="italic" style={{ color: T.accent }}>три решения</span> для своего мини-магазина.</> })}</h2></div>
      <Mentor>{tr({ uz: "Har qator — ilova o'zi qilmaydigan ish va bu qaror tegadigan odam.", ru: 'Каждая строка — работа, которую приложение не делает само, и человек, которого касается это решение.' })}</Mentor>
      <div className="s1demo">
        <span className="s1demo-lbl">{tr({ uz: "🛒 Mini-do'kon", ru: '🛒 Мини-магазин' })}</span>
        <div className="s1demo-list">
          {DEMO_QAROR.map((d, i) => (
            <span key={tr(d.m)} className="s1row" style={{ '--dd': `${0.5 + i * 0.8}s` }}>
              <span className="s1row-t">{tr(d.m)}</span>
              <i className="s1row-arw" style={{ '--dd2': `${0.95 + i * 0.8}s` }}>→</i>
              <span className="s1row-b" style={{ '--dd2': `${1.05 + i * 0.8}s` }}>{tr(d.b)}</span>
              <span className="s1row-ok" style={{ '--dd3': `${1.35 + i * 0.8}s` }}>✅</span>
            </span>
          ))}
        </div>
      </div>
      <MentorNote>{tr({ uz: "Ro'yxat yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.", ru: 'Пока список дописывается, не говорите — картинка представит себя сама.' })}</MentorNote>
    </div>
  </Stage>
);

// ===== SCREEN 2 — TEORIYA-1: ilova so'raydimi yoki o'zi qiladimi (46-qonun toggle) =====
const S2_CARDS = [
  { ic: '🙋', h: { uz: "Ilova so'raydi", ru: 'Приложение спрашивает' },     b: { uz: "Avval odamdan so'raydi, keyin qiladi — xato bo'lsa odam to'xtatadi.", ru: 'Сначала спрашивает человека, потом делает — если ошибка, человек её остановит.' } },
  { ic: '🤖', h: { uz: "Ilova o'zi qiladi", ru: 'Приложение делает само' },  b: { uz: "So'ramay qiladi — tez bo'ladi, lekin xato bo'lsa uni to'xtatadigan odam yo'q.", ru: 'Делает без спроса — это быстро, но если ошибка, остановить её некому.' } },
];
// Chegaraning uch darajasi (MD v2, A-bo'lim): xulosa-bosqichida ta'rif ostida chiqadi.
const S2_LEVELS = [
  { ic: '🤖', h: { uz: "O'zi qilaversin", ru: 'Пусть делает само' },            b: { uz: "masalan, mahsulot narxini ko'rsatish", ru: 'например, показывать цену товара' } },
  { ic: '🙋', h: { uz: 'Odam tasdiqlagach qilsin', ru: 'Пусть делает после подтверждения человека' }, b: { uz: 'masalan, buyurtmani bekor qilish', ru: 'например, отменять заказ' } },
  { ic: '⛔', h: { uz: "O'zi umuman qilmasin", ru: 'Пусть вообще не делает само' },   b: { uz: 'masalan, pulni qaytarish', ru: 'например, возвращать деньги' } },
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
  // 400-belgi qoidasi (PmLesson20 s2 pretsedenti): kartalar va xulosa BIR VAQTDA turmaydi —
  // ikkala karta ko'rilgach ekran xulosa-bosqichiga o'tadi; «Kartalarga qaytish» tugmasi
  // 46-qonun toggle'ini saqlaydi (karta hech qachon qulflanmaydi).
  const [faza, setFaza] = useState('kartalar');
  useEffect(() => {
    if (!allSeen) return;
    const t = setTimeout(() => setFaza('xulosa'), 700);
    return () => clearTimeout(t);
  }, [allSeen]);
  const xulosa = faza === 'xulosa' && allSeen;
  return (
    <Stage eyebrow={tr({ uz: 'Muhokama · ikki karta', ru: 'Обсуждение · две карточки' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!allSeen && !isMentor} disabled={!allSeen && !isMentor} label={allSeen || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `👆 Yana ${qoldi} kartani oching`, ru: `👆 Осталось открыть карточек: ${qoldi}` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)', justifyContent: 'flex-start' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ilova o'zi qaror qilsa, <span className="italic" style={{ color: T.accent }}>kimga</span> tegadi?</>, ru: <>Если приложение решает само, <span className="italic" style={{ color: T.accent }}>кого</span> это касается?</> })}</h2></div>
        <Mentor>{tr({ uz: 'Ilovaning har ishi oxirida odam turadi. Ikki kartani bosib solishtiring.', ru: 'В конце каждой работы приложения стоит человек. Нажмите на две карточки и сравните.' })}</Mentor>
        {!xulosa && (
          <div className="dfc-grid fade-up delay-1">
            {S2_CARDS.map((c, i) => (
              <button key={tr(c.h)} type="button" className={`dfc${opened[i] ? ' open' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => toggle(i)}>
                <span className="dfc-top"><span className="dfc-ic">{c.ic}</span><span className="dfc-h">{tr(c.h)}</span></span>
                <span className="dfc-b">{opened[i] ? tr(c.b) : '· · ·'}</span>
              </button>
            ))}
          </div>
        )}
        {xulosa && (
          <>
            <div className="xul fade-step">
              <span className="xul-h">{tr({ uz: "Chegara — ilova qaysi ishni o'zi qilaverishi, qaysi ishni avval odamga ko'rsatishi yoki umuman qilmasligi haqida oldindan qilingan qaror.", ru: 'Граница — это заранее принятое решение о том, какую работу приложение делает само, какую сначала показывает человеку, а какую не делает вообще.' })}</span>
              <ul className="xul-lv">
                {S2_LEVELS.map(l => <li key={l.ic}><i>{l.ic}</i><span><b>{tr(l.h)}</b> — {tr(l.b)}</span></li>)}
              </ul>
              <p className="xul-b">{tr({ uz: <>4-darsda agentga <b>vakolat chegarasi</b> qo'ygan edingiz: nima mumkin, nima mumkin emas va qachon odam tasdig'i kerak. Bugun xuddi shu fikrni butun mini-do'koningizga qo'llaysiz.</>, ru: <>На 4-м уроке вы поставили агенту <b>границу полномочий</b>: что можно, что нельзя и когда нужно подтверждение человека. Сегодня вы примените ту же идею ко всему мини-магазину.</> })}</p>
            </div>
            <button type="button" className="nextsig" onClick={() => setFaza('kartalar')}>{tr({ uz: '◂ Kartalarga qaytish', ru: '◂ Вернуться к карточкам' })}</button>
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== TEST-EKRAN sarlavhasi (105-qonun: .h-ask) =====
const TestQ = ({ ask }) => <h2 className="title h-ask">{ask}</h2>;

const Screen3 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: "Tekshiruv · qaysi do'konda", ru: 'Проверка · в каком магазине' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: "Uchala do'konda ham mijozga AI javob yozadi. Qaysi birida chegara bor?", ru: 'Во всех трёх магазинах клиенту отвечает AI. В каком из них есть граница?' })} />}
    questionText={tr({ uz: "Uchala do'konda ham mijozga AI javob yozadi, qaysi birida chegara bor", ru: 'Во всех трёх магазинах клиенту отвечает AI, в каком из них есть граница' })}
    options={[tr({ uz: "Javobni AI yozib, o'zi yuboradigan do'konda", ru: 'В магазине, где AI пишет ответ и сам его отправляет' }), tr({ uz: "Javobni AI yozib, egasi yuboradigan do'konda", ru: 'В магазине, где AI пишет ответ, а отправляет владелец' }), tr({ uz: "Javobni AI ikki marta yozadigan do'konda", ru: 'В магазине, где AI пишет ответ дважды' })]}
    correctIdx={1}
    explainCorrect={tr({ uz: "Chegara AI'ni to'xtatmaydi — uning ishini odamdan o'tkazadi.", ru: 'Граница не останавливает AI — она пропускает его работу через человека.' })}
    explainWrong={{
      0: tr({ uz: "Bu yerda javob hech kimdan o'tmaydi: AI yozdi va o'zi yubordi.", ru: 'Здесь ответ ни через кого не проходит: AI написал и сам отправил.' }),
      2: tr({ uz: "Ikki marta yozilgan javob ham AI niki — uni o'qib chiqadigan odam yo'q.", ru: 'Ответ, написанный дважды, всё равно от AI — нет человека, который бы его прочитал.' }),
      default: tr({ uz: "Chegara AI'ni to'xtatmaydi — uning ishini odamdan o'tkazadi.", ru: 'Граница не останавливает AI — она пропускает его работу через человека.' })
    }}
  />
);

// ===== SCREEN 4 — YADRO: OQIBAT-KO'ZGUSI (markaziy mexanika) =====
// Chapda ilovaning uch ishi, har birida ikki tanlov; o'ngda — shu qaror tegadigan odam.
// 🔴 IPUCHA-ZINAPOYASI: taymer bosishga BOG'LIQ EMAS — u faqat ekran ochiq turganda yuradi.
const ISHLAR = [
  { id: 'javob', ic: '💬', t: { uz: 'Mijozning savoliga javob', ru: 'Ответ на вопрос клиента' },
    ai: { uz: "AI o'zi yozib yuboradi", ru: 'AI сам пишет и отправляет' }, odam: { uz: "Javobni do'kon egasi o'qib chiqadi", ru: 'Ответ читает владелец магазина' },
    kim: { uz: "«Zaryadlagich qo'shib berasizmi?» deb so'ragan mijoz", ru: 'Клиент, спросивший «Положите зарядку в комплект?»' },
    fakt: { uz: "AI «qo'shib beramiz» deb yozdi; quti ochilganda zaryadlagich yo'q edi", ru: 'AI написал «положим»; когда открыли коробку, зарядки там не было' },
    tinch: { uz: "Do'kon egasi o'qib chiqdi — xato mijozga yetib bormadi", ru: 'Владелец магазина прочитал — ошибка не дошла до клиента' } },
  { id: 'tavsif', ic: '✍️', t: { uz: 'Mahsulot tavsifi (sayt sahifasidagi matn)', ru: 'Описание товара (текст на странице сайта)' },
    ai: { uz: "AI yozib, saytga o'zi chiqaradi", ru: 'AI пишет и сам выкладывает на сайт' }, odam: { uz: "Do'kon egasi o'qib, keyin chiqaradi", ru: 'Владелец магазина читает, потом выкладывает' },
    kim: { uz: "Tavsifni o'qib olgan mijoz", ru: 'Клиент, прочитавший описание' },
    fakt: { uz: "Tavsifda «suvga chidaydi» deb turgan edi; quloqchin yomg'irda ishlamay qoldi", ru: 'В описании было «не боится воды»; наушники перестали работать под дождём' },
    tinch: { uz: "Do'kon egasi o'qib chiqdi — xato mijozga yetib bormadi", ru: 'Владелец магазина прочитал — ошибка не дошла до клиента' } },
  { id: 'bekor', ic: '🚫', t: { uz: 'Tushunarsiz manzilli buyurtma', ru: 'Заказ с непонятным адресом' },
    ai: { uz: "Ilova o'zi bekor qiladi", ru: 'Приложение само отменяет' }, odam: { uz: "Ilova mijozdan so'raydi", ru: 'Приложение спрашивает клиента' },
    kim: { uz: 'Manzilini qisqa yozgan mijoz', ru: 'Клиент, коротко написавший адрес' },
    fakt: { uz: "Buyurtmasi bekor bo'ldi; u kechgacha kutib o'tirdi", ru: 'Его заказ отменили; он прождал до вечера' },
    tinch: { uz: "Ilova so'radi — mijoz manzilini to'g'irladi", ru: 'Приложение спросило — клиент исправил адрес' } },
];
// Chegara qaysi ishga qo'yilganiga qarab AYNAN SHU tanlovga javob (korpus §139)
const KZQ_RES = {
  javob: { uz: "✅ Endi xato javob mijozga yetib bormaydi. Qolgan ikki ishni AI o'zi qilaveradi — do'kon sekinlashmadi.", ru: '✅ Теперь ошибочный ответ не дойдёт до клиента. Две другие работы AI по-прежнему делает сам — магазин не замедлился.' },
  tavsif: { uz: "Bu ham chegara. Lekin tavsif bir marta yoziladi, mijoz savoli esa har kuni keladi — xato javob ham har kuni takrorlanadi.", ru: 'Это тоже граница. Но описание пишут один раз, а вопросы клиентов приходят каждый день — и ошибочный ответ тоже повторяется каждый день.' },
  bekor: { uz: "Bu ham chegara. Lekin bekor qilishdan oldin ilova mijozdan so'raydi — u yerda odam bor. Xato javobni esa hech kim o'qimaydi.", ru: 'Это тоже граница. Но перед отменой приложение спрашивает клиента — там человек уже есть. А ошибочный ответ не читает никто.' },
};
const KOZGU_KEY = 'pm-m6d6-kozgu';
const KZ_TIP_SEC = 40, KZ_FREE_SEC = 115;
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [pick, setPick] = useState(() => storedAnswer?.pick || {});
  const [seenAi, setSeenAi] = useState(() => storedAnswer?.seenAi || {});
  const [focus, setFocus] = useState(() => storedAnswer?.focus || null);
  const [chegara, setChegara] = useState(() => storedAnswer?.chegara || null);
  const [sec, setSec] = useState(0);
  const qolgan = ISHLAR.filter(m => !seenAi[m.id]).length;
  const stage1 = qolgan === 0;
  const hammasiOdam = stage1 && ISHLAR.every(m => pick[m.id] === 'odam');
  const done = stage1 && !!chegara;
  useEffect(() => {
    if (done || isMentor) return;
    const t = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [done, isMentor]);
  const tipOn = !done && !isMentor && sec >= KZ_TIP_SEC;
  const rescue = !done && !isMentor && sec >= KZ_FREE_SEC;
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'kozgu', screenIdx: screen, pick, seenAi, focus, chegara, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'kozgu', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  useEffect(() => { try { localStorage.setItem(KOZGU_KEY, JSON.stringify({ pick, chegara })); } catch {} }, [pick, chegara]);
  const tanla = (id, rejim) => {
    if (isMentor) return;
    setPick(p => ({ ...p, [id]: rejim }));
    setFocus(id);
    if (rejim === 'ai') setSeenAi(p => (p[id] ? p : { ...p, [id]: true }));
  };
  const kuz = focus ? ISHLAR.find(m => m.id === focus) : null;
  const kuzAi = kuz ? pick[kuz.id] === 'ai' : false;
  const navLabel = done || isMentor || rescue
    ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !stage1 ? tr({ uz: `① Yana ${qolgan} ishda «AI o'zi qiladi» tugmasini bosing`, ru: `① Осталось работ: ${qolgan} — нажмите в них кнопку AI` }) : tr({ uz: '② Bitta ishni odamga qaytaring', ru: '② Верните одну работу человеку' });
  return (
    <Stage eyebrow={tr({ uz: 'Sinov · qaror va odam', ru: 'Опыт · решение и человек' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor && !rescue} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.3vw,13px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har ishda «AI o'zi qiladi» tugmasini bosing: AI xato qilsa, <span className="italic" style={{ color: T.accent }}>kimga tegadi?</span></>, ru: <>В каждой работе нажмите кнопку «AI делает сам»: если AI ошибётся, <span className="italic" style={{ color: T.accent }}>кого это коснётся?</span></> })}</h2></div>
        {!stage1 && <Mentor>{tr({ uz: "Avtomatlashtirish foydali — lekin ba'zi ishda odam nazorati kerak. Ilovaning uch ishi, har birida ikki tanlov. Har tanlovda shu qaror tegadigan odam chiqadi.", ru: 'Автоматизация полезна — но в некоторых работах нужен контроль человека. У приложения три работы, в каждой два варианта. При каждом выборе появляется человек, которого касается это решение.' })}</Mentor>}
        <div className="split s4">
          <Col gap={9}>
            <div className={`kzg${Object.keys(pick).length > 0 ? ' calm' : ''}`}>
              {ISHLAR.map(m => (
                <div key={m.id} className={`kzg-row${focus === m.id ? ' cur' : ''}`}>
                  <span className="kzg-h"><i>{m.ic}</i>{tr(m.t)}</span>
                  <div className="kzg-opts">
                    <button type="button" className={`kzg-opt ai${pick[m.id] === 'ai' ? ' on' : ''}`} onClick={() => tanla(m.id, 'ai')} disabled={isMentor}>🤖 {tr(m.ai)}</button>
                    <button type="button" className={`kzg-opt od${pick[m.id] === 'odam' ? ' on' : ''}`} onClick={() => tanla(m.id, 'odam')} disabled={isMentor}>🙋 {tr(m.odam)}</button>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col gap={9}>
            <div className="mir">
              <span className="mir-lgd">{tr({ uz: "🔴 — AI xato qilsa, shu odamga zarar yetadi · ⚪ — xato bo'lsa ham, u odamga yetib bormaydi", ru: '🔴 — если AI ошибётся, этот человек пострадает · ⚪ — даже если будет ошибка, до этого человека она не дойдёт' })}</span>
              {kuz ? (
                <div className={`mir-card ${kuzAi ? 'hit' : 'calm'}`} key={`${kuz.id}-${kuzAi ? 'a' : 'o'}`}>
                  <span className="mir-dot" aria-hidden="true"><i /></span>
                  <span className="mir-who">{tr(kuz.kim)}</span>
                  <span className="mir-fact">{tr(kuzAi ? kuz.fakt : kuz.tinch)}</span>
                </div>
              ) : (
                <div className="mir-empty">{tr({ uz: "Ishlardan birida tugmani bosing — bu yerda odam paydo bo'ladi", ru: 'Нажмите кнопку в одной из работ — здесь появится человек' })}</div>
              )}
            </div>
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Uch ishni ochganlar', ru: 'Открыли три работы' }} />
          </Col>
        </div>
        {stage1 && !chegara && hammasiOdam && (
          <p className="bhint fade-step">{tr({ uz: "Uchala ishni ham do'kon egasi o'qisa, har buyurtma uni kutib turadi — do'kon sekinlashadi, egasi esa hammasiga ulgurmaydi. Faqat bittasini odamga qoldiring, qolgan ikkitasini AI qilaversin.", ru: 'Если все три работы будет читать владелец магазина, каждый заказ будет его ждать — магазин замедлится, а владелец не успеет за всем. Оставьте человеку только одну, а две другие пусть делает AI.' })}</p>
        )}
        {stage1 && !chegara && !hammasiOdam && (
          <div className="kzq fade-step">
            <span className="kzq-ask">{tr({ uz: <>Hamma ishni odam o'qib chiqa olmaydi: uch ishdan faqat <b>bittasi</b> odamdan o'tadi. Qay birini odamga qaytarasiz?</>, ru: <>Человек не может проверять всё: из трёх работ через человека проходит только <b>одна</b>. Какую вы вернёте человеку?</> })}</span>
            <div className="kzq-chips">
              {ISHLAR.map(m => <button key={m.id} type="button" className="kzq-chip" onClick={() => setChegara(m.id)}>{m.ic} {tr(m.t)}</button>)}
            </div>
          </div>
        )}
        {chegara && (
          <div className="bdone fade-step">
            <p className="kzq-res">{tr(KZQ_RES[chegara])}</p>
            <span className="done-mini">{tr({ uz: "Buni o'zingiz topdingiz: chegara ilovani to'xtatmaydi — bitta ishni odamga qaytaradi", ru: 'Вы нашли это сами: граница не останавливает приложение — она возвращает одну работу человеку' })}</span>
            <button type="button" className="btn-soft kzq-again" onClick={() => setChegara(null)}>{tr({ uz: '↻ Boshqasini tanlash', ru: '↻ Выбрать другую' })}</button>
          </div>
        )}
        {tipOn && !done && <p className="bhint fade-step">{tr({ uz: "Yana bir kartada «AI o'zi qiladi» tugmasini bosing.", ru: 'Нажмите кнопку «AI делает сам» ещё на одной карточке.' })}</p>}
        {rescue && !done && <p className="small fade-step" style={{ margin: 0, color: T.ink3, fontWeight: 600 }}>{tr({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: 'Остальное разберём вместе чуть позже — «Продолжить» открыто.' })}</p>}
        <MentorNote>{tr({ uz: "Bolalar uchala tugmani ham «odam o'qiydi» holatiga o'tkazib qo'yadi — bu eng foydali xato. Ekranning o'zi to'xtatadi; siz so'rang: har buyurtma do'kon egasini kutib tursa, do'kon ishlaydimi? Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Дети переключат все три кнопки на «читает человек» — это самая полезная ошибка. Экран сам остановит; а вы спросите: если каждый заказ ждёт владельца, будет ли магазин работать? Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто.' })}</MentorNote>
      </div>
    </Stage>
  );
};

const Screen5 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · chegara qayerga', ru: 'Проверка · куда ставят границу' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: "Chegara birinchi navbatda qaysi ishga kerak bo'ladi?", ru: 'На какую работу границу ставят в первую очередь?' })} />}
    questionText={tr({ uz: "Chegara birinchi navbatda qaysi ishga kerak bo'ladi", ru: 'На какую работу границу ставят в первую очередь' })}
    options={[tr({ uz: "Ilova mijozdan so'rab qiladigan ishga", ru: 'На работу, которую приложение делает, спросив клиента' }), tr({ uz: "Do'kon egasi o'zi qo'lda qiladigan ishga", ru: 'На работу, которую владелец магазина делает сам вручную' }), tr({ uz: "Ilova so'ramay, o'zi qiladigan ishga", ru: 'На работу, которую приложение делает само, без спроса' })]}
    correctIdx={2}
    explainCorrect={tr({ uz: "So'rab qilingan ishni odam to'xtata oladi; ilova so'ramay qiladigan ishni esa hech kim to'xtatmaydi. Lekin har bunday ishga emas — faqat odamga tegadiganiga, ayniqsa muhim yoki xavfli ishga: pul, bekor qilish, mijozga va'da.", ru: 'Работу, о которой спросили, человек может остановить, а работу, которую приложение делает без спроса, не остановит никто. Но не каждую такую работу — только ту, что касается человека, особенно важную или опасную: деньги, отмена, обещание клиенту.' })}
    explainWrong={{
      0: tr({ uz: "So'rab qilingan ishda odam allaqachon turibdi — u xatoni ko'rib to'xtatadi.", ru: 'В работе «со спросом» человек уже стоит — он увидит ошибку и остановит её.' }),
      1: tr({ uz: "Qo'lda qilinadigan ishni odam boshidan oxirigacha o'zi bajaradi.", ru: 'Ручную работу человек от начала до конца делает сам.' }),
      default: tr({ uz: "Chegara ilova o'zi qiladigan va odamga tegadigan ishga qo'yiladi.", ru: 'Границу ставят на работу, которую приложение делает само и которая касается человека.' })
    }}
  />
);

// ===== SCREEN 6 — HAQIQIY HOLAT: zaxira ilgak (33/56/91b-qonun qolipi) =====
// 🔴 O'ylab topilgan kompaniya, voqea va raqam YO'Q: o'quvchi o'z telefonida o'n soniyada
// tekshirib ko'ra oladigan holat. Ekranda birorta foiz, sana yoki statistika yo'q.
// 🔴 109-qonun: ball bermaydigan bashorat — bitta.
const HOLAT_SLIDES = [
  { ic: '💬', h: { uz: 'Telefon yoki kompyuterda AI bilan yozishasiz (masalan, Gemini, ChatGPT yoki Claude)', ru: 'Вы переписываетесь с AI на телефоне или компьютере (например, Gemini, ChatGPT или Claude)' },
    body: { uz: <>Savol yozasiz, javob bir necha soniyada keladi.</>, ru: <>Пишете вопрос — ответ приходит за несколько секунд.</> } },
  { ic: '📄', h: { uz: 'Ekranning pastida kichkina bitta qator turadi', ru: 'Внизу экрана стоит одна маленькая строка' },
    body: { uz: <>Kulrang, mayda harflar bilan. Qaysi savol yozsangiz ham, u o'sha joyda turaveradi.</>, ru: <>Серыми мелкими буквами. Какой бы вопрос вы ни написали, она остаётся на том же месте.</> } },
  { ic: null, h: null, body: null,
    predict: { ask: { uz: "Sizningcha, o'sha qator u yerda nima uchun turadi?", ru: 'Как вы думаете, зачем там стоит эта строка?' }, chips: [
      { t: { uz: "Ilovani yozganlarning nomi ko'rinib tursin", ru: 'Чтобы были видны имена создателей приложения' } },
      { t: { uz: "Javob necha so'z bo'lgani ko'rinib tursin", ru: 'Чтобы было видно, сколько слов в ответе' } },
      { t: { uz: "O'qigan odam javobni tekshirib ko'rsin", ru: 'Чтобы читающий проверил ответ' } },
    ], ans: 2,
      hit: { uz: "Topdingiz! O'qigan odam javobni tekshirib ko'rsin", ru: 'Угадали! Чтобы читающий проверил ответ' },
      miss: { uz: "Adashdingiz — asl javob: o'qigan odam javobni tekshirib ko'rsin", ru: 'Мимо — правильный ответ: чтобы читающий проверил ответ' } } },
  { ic: '✅', h: { uz: "O'sha qatorda nima yozilgan", ru: 'Что написано в этой строке' },
    body: { uz: <>Taxminan shunday: «AI xato qilishi mumkin — muhim ma'lumotni tekshiring». Aniq so'zlari ilovaga qarab biroz farq qiladi. Javobni AI yozdi, unga ishonadigan esa — <b>odam</b>.</>, ru: <>Примерно так: «AI может ошибаться — проверяйте важную информацию». Точные слова немного отличаются в разных приложениях. Ответ написал AI, а верит ему <b>человек</b>.</> } },
  { ic: null, h: null, body: null, bridge: true },
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
  const last = i === HOLAT_SLIDES.length - 1;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const c = HOLAT_SLIDES[i];
  const bet = c.predict ? bets[i] : undefined;
  const betPending = !!(c.predict && bet === undefined);
  const betHint = useTurnHint(betPending && !isMentorK);
  // 44-qonun oilasi: mentor rejimida ham javob OLDINDAN ochilmaydi — u ham bosib ochadi.
  const showSlide = c.h && (!c.predict || bet !== undefined);
  return (
    <Stage eyebrow={tr({ uz: '📱 Haqiqiy holat', ru: '📱 Реальный случай' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending && !isMentorK} disabled={betPending && !isMentorK} label={betPending && !isMentorK ? tr({ uz: "Avval o'zingiz belgilang", ru: 'Сначала отметьте сами' }) : last ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Keyingi bosqich (${i + 1}/${HOLAT_SLIDES.length})`, ru: `Следующий шаг (${i + 1}/${HOLAT_SLIDES.length})` })} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI bilan yozishganda har kuni ko'radigan <span className="italic" style={{ color: T.accent }}>bitta qator</span></>, ru: <><span className="italic" style={{ color: T.accent }}>Одна строка</span>, которую вы каждый день видите, когда переписываетесь с AI</> })}</h2></div>
        {c.predict && (
          <div className={`kp-bet fade-step${bet !== undefined ? ' answered' : ''}`} key={`b${i}`}>
            {/* 🔴 ETALON 22 (sanoq-mosligi): bashoratli bosqichda ham hisoblagich uzluksiz
                turadi (1·2·3·4·5) va har bosqichda AYNAN BITTA joyda ko'rinadi. */}
            <span className="k-slide-eyebrow">{bet === undefined ? tr({ uz: "🎲 Avval o'zingiz belgilab ko'ring", ru: '🎲 Сначала попробуйте отметить сами' }) : tr({ uz: 'Haqiqiy holat', ru: 'Реальный случай' })} · {i + 1} / {HOLAT_SLIDES.length}</span>
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
            {!c.predict && <span className="k-slide-eyebrow">{tr({ uz: 'Haqiqiy holat', ru: 'Реальный случай' })} · {i + 1} / {HOLAT_SLIDES.length}</span>}
            <div className="k-slide-ic">{c.ic}</div>
            <h3 className="k-slide-h">{tr(c.h)}</h3>
            <p className="k-slide-body">{tr(c.body)}</p>
          </div>
        )}
        <div className="k-dots">{HOLAT_SLIDES.map((_, k) => {
          const ochiq = k <= maxSeen && !(betPending && k > i);
          return <button key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} disabled={!ochiq} onClick={() => ochiq && setI(k)} aria-label={tr({ uz: `${k + 1}-bosqich`, ru: `Шаг ${k + 1}` })} title={ochiq ? undefined : tr({ uz: 'Avval shu bosqichni tugating', ru: 'Сначала завершите этот шаг' })} />;
        })}</div>
        {c.bridge && (
          <div className="frame-soft fade-step" key={`k${i}`}>
            {/* ETALON 22: ko'prik-bosqichi ham sanoqqa kiradi — zanjir uzilmaydi */}
            <span className="k-slide-eyebrow">{tr({ uz: 'Haqiqiy holat', ru: 'Реальный случай' })} · {i + 1} / {HOLAT_SLIDES.length}</span>
            <p className="body" style={{ margin: '10px 0 0', color: T.ink }}>{tr({ uz: <>Demak AI javob yozadi, tekshirishni odam qiladi — buni ilovaning o'zi ochiq yozib qo'ygan. Mini-do'koningizda ham shu savol turadi: qaysi ishni AI o'zi qilaversin, qaysi biri odamdan o'tsin. <b>Bu qarorni ilova emas, ilovani yaratayotgan odam qiladi</b> — ya'ni siz.</>, ru: <>Значит, AI пишет ответ, а проверяет человек — приложение само открыто об этом написало. В вашем мини-магазине стоит тот же вопрос: какую работу пусть AI делает сам, а какая пусть проходит через человека. <b>Это решение принимает не приложение, а тот, кто его создаёт</b>, — то есть вы.</> })}</p>
          </div>
        )}
        <MentorNote>{tr({ uz: "Hozir telefonini ochib ko'rmoqchi bo'lganlar bo'ladi — ruxsat bering, bu darsning eng foydali o'ttiz soniyasi.", ru: 'Кто-то захочет открыть телефон и проверить — разрешите, это самые полезные тридцать секунд урока.' })}</MentorNote>
      </div>
    </Stage>
  );
};

const Screen7 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · chegara qaysi oraliqda', ru: 'Проверка · в каком промежутке граница' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: "AI mahsulot tavsifini yozdi. Chegara qaysi ikki qadam orasiga qo'yiladi?", ru: 'AI написал описание товара. Между какими двумя шагами ставят границу?' })} />}
    questionText={tr({ uz: "AI tavsif yozdi, chegara qaysi ikki qadam orasiga qo'yiladi", ru: 'AI написал описание, между какими двумя шагами ставят границу' })}
    options={[tr({ uz: 'Yozilgandan keyin, saytga chiqishdan oldin', ru: 'После написания, до публикации на сайте' }), tr({ uz: "Saytga chiqqandan keyin, mijoz o'qishidan oldin", ru: 'После публикации на сайте, до того как прочитает клиент' }), tr({ uz: "Mijoz o'qigandan keyin, buyurtma berishdan oldin", ru: 'После того как клиент прочитал, до заказа' })]}
    correctIdx={0}
    explainCorrect={tr({ uz: "AI yozadi, odam o'qib chiqadi. Xato tavsif saytga chiqmasdan turib tutiladi.", ru: 'AI пишет, человек проверяет. Ошибочное описание ловят до того, как оно попадёт на сайт.' })}
    explainWrong={{
      1: tr({ uz: "Saytga chiqqan tavsifni mijoz istalgan payt ochadi — tekshirishga ulgurilmaydi.", ru: 'Описание на сайте клиент может открыть в любой момент — проверить уже не успеют.' }),
      2: tr({ uz: "Mijoz o'qib bo'lgan bo'lsa, xato tavsif unga allaqachon yetib borgan.", ru: 'Если клиент уже прочитал, ошибочное описание до него уже дошло.' }),
      default: tr({ uz: "AI yozadi, odam o'qib chiqadi — chegara shu ikkovining orasida turadi.", ru: 'AI пишет, человек проверяет — граница стоит между этими двумя шагами.' })
    }}
  />
);

// ===== SCREEN 8 — UCH CHEGARA, BITTALAB (48/80/85/92/106d-qonun) =====
// Chiqish-artefakt (registr R2 Batch 5): { chegaralar: [{qaror, jabr} x3], savedAt } -> m6-12.
const OUT_KEY = 'pm-m6d6-chegara';
// Kirish-artefakt — JIM ZAXIRA: yo'q bo'lsa varaq-kartasi umuman chizilmaydi (korpus §69).
const PRD_KEY = 'pm-m6d2-prd';
const STAR_KEY = 'pm-m6d6-star';
const readPrd = () => {
  try {
    const v = JSON.parse(localStorage.getItem(PRD_KEY) || 'null');
    const p = v && v.prd;
    if (p && typeof p.kim === 'string' && typeof p.yechim === 'string' && p.kim.trim() && p.yechim.trim()) return { kim: p.kim.trim(), yechim: p.yechim.trim() };
  } catch {}
  return null;
};
const APO = "['\\u02BB\\u2019]";
const normSoz = (s) => (s || '').toLowerCase().replace(new RegExp(APO, 'g'), '').replace(tr({ uz: /[^a-z0-9 ]+/gi, ru: /[^a-z0-9\u0400-\u04FF ]+/gi }), ' ').replace(/\s+/g, ' ').trim();
// Inkor-belgisi: chegara — ilova nima QILMASLIGI (106d(c), dars o'z so'zlaridan)
// UZ-RU: RU rejimida ikkala tilning inkor-shakli ham qabul qilinadi (tr() faqat chaqiruv paytida).
const INKOR = { uz: /(maydi|masin|masligi|may$|may )/, ru: /(maydi|masin|masligi|may$|may |(^| )(не|нельзя|никогда|запрещено)( |$))/ };
// Guruh nomlari bitta aniq odamning o'rnini bosmaydi
const GURUH = { uz: ['hamma', 'odamlar', 'mijozlar', 'foydalanuvchilar', 'bolalar', 'jamiyat'], ru: ['hamma', 'odamlar', 'mijozlar', 'foydalanuvchilar', 'bolalar', 'jamiyat', 'все', 'люди', 'клиенты', 'покупатели', 'пользователи', 'дети', 'общество'] };
const faqatGuruh = (s) => { const t = normSoz(s).split(' ').filter(Boolean); return t.length > 0 && t.every(w => tr(GURUH).includes(w)); };
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [prd] = useState(() => readPrd());
  const [list, setList] = useState(() => (storedAnswer && Array.isArray(storedAnswer.chegaralar)) ? storedAnswer.chegaralar : []);
  const [dQaror, setDQaror] = useState('');
  const [dJabr, setDJabr] = useState('');
  const [edit, setEdit] = useState(null);
  const [focus, setFocus] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const [star, setStar] = useState(() => { try { return localStorage.getItem(STAR_KEY) || ''; } catch { return ''; } });
  const done = list.length >= 3;
  const savedRef = useRef(false);
  const uzunQ = dQaror.trim().length >= 8;
  const jabrBor = dJabr.trim().length >= 4;
  const inkorBor = uzunQ && tr(INKOR).test(normSoz(dQaror));
  const guruhOnly = jabrBor && faqatGuruh(dJabr);
  const takror = uzunQ && list.some((r, k) => k !== edit && normSoz(r.qaror) === normSoz(dQaror));
  const birXil = jabrBor && list.length >= 2 && edit === null && list.every(r => normSoz(r.jabr) === normSoz(dJabr));
  const canSave = uzunQ && jabrBor && !guruhOnly && !takror;
  // 32-qonun: topshiriq-shartlari jonli chiplarda — har biri SAQLANGAN qatorlardan o'qiladi
  const yozilgan = list.slice(0, 3);
  const bariInkor = yozilgan.length > 0 && yozilgan.every(r => tr(INKOR).test(normSoz(r.qaror)));
  const bariAniq = yozilgan.length > 0 && yozilgan.every(r => !faqatGuruh(r.jabr));
  const inputTurn = useTurnHint(!done && !uzunQ && !focus && !isMentor);
  useEffect(() => {
    if (!done || savedRef.current) return;
    savedRef.current = true;
    try { localStorage.setItem(OUT_KEY, JSON.stringify({ chegaralar: list.slice(0, 3), savedAt: Date.now() })); } catch {}
    if (storedAnswer === undefined || !storedAnswer.solved) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, chegaralar: list.slice(0, 3), solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  useEffect(() => {
    if (!done || !savedRef.current) return;
    try { localStorage.setItem(OUT_KEY, JSON.stringify({ chegaralar: list.slice(0, 3), savedAt: Date.now() })); } catch {}
  }, [list, done]);
  const save = () => {
    if (!canSave) return;
    const v = { qaror: dQaror.trim(), jabr: dJabr.trim() };
    setList(p => (edit === null ? [...p, v] : p.map((r, k) => (k === edit ? v : r))));
    setDQaror(''); setDJabr(''); setEdit(null);
  };
  const startEdit = (k) => { setEdit(k); setDQaror(list[k].qaror); setDJabr(list[k].jabr); };
  const saveStar = (v) => { setStar(v); try { localStorage.setItem(STAR_KEY, v); } catch {} };
  const nQadam = edit === null ? list.length + 1 : edit + 1;
  const navLabel = done || isMentor
    ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : list.length === 0 ? tr({ uz: '① Birinchi chegarani yozing va saqlang', ru: '① Напишите и сохраните первую границу' }) : tr({ uz: `② Yana ${3 - list.length} chegara yozing`, ru: `② Осталось написать границ: ${3 - list.length}` });
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Mini-do'koningizga <span className="italic" style={{ color: T.accent }}>uchta chegara</span> yozing.</>, ru: <>Напишите для мини-магазина <span className="italic" style={{ color: T.accent }}>три границы</span>.</> })}</h2></div>
        {prd && (
          <div className="varaq fade-up">
            <span className="varaq-t">{tr({ uz: <>O'z varag'ingizdan: {prd.kim} uchun — {prd.yechim}</>, ru: <>Из вашего листа: для {prd.kim} — {prd.yechim}</> })}</span>
            <span className="varaq-s">{tr({ uz: "Bu — shu modulda quradigan mini-do'koningiz. Unga uchta chegara yozasiz.", ru: 'Это мини-магазин, который вы строите в этом модуле. Вы напишете для него три границы.' })}</span>
          </div>
        )}
        <Mentor>{tr({ uz: "Har ishga bitta savol bering: ilova buni o'zi qilsa va xato qilsa, kimga tegadi?", ru: 'Задайте каждой работе один вопрос: если приложение сделает это само и ошибётся, кого это коснётся?' })}</Mentor>
        {/* 80a: havoda uch doira — yozilgani yashil, joriysi aksent halqada, kelgusi punktir */}
        <div className="stps fade-up">
          {[0, 1, 2].map(k => (
            <span key={k} className={`stp ${list.length > k ? 'done' : (edit === null ? list.length : edit) === k ? 'on' : ''}`}><i>{list.length > k ? '✓' : k + 1}</i>{tr({ uz: <>{k + 1}-chegara</>, ru: <>Граница {k + 1}</> })}</span>
          ))}
        </div>
        <div className="split">
          <Col gap={9}>
            {/* 80b: ekranning yagona kartasi — ikki yozuv-joyi + jonli javob-qatori */}
            {(!done || edit !== null) && (
              <div className="wsp-ed">
                <GrowInput className={`reflect-input${inputTurn ? ' await' : ''}${uzunQ ? ' filled' : ''}`} value={dQaror} maxLength={90}
                  placeholder={tr({ uz: "Ilova qaysi ishni o'zi qilmaydi?", ru: 'Какую работу приложение не делает само?' })}
                  aria-label={tr({ uz: "Ilova qaysi ishni o'zi qilmaydi?", ru: 'Какую работу приложение не делает само?' })}
                  onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                  onChange={e => setDQaror(e.target.value)} />
                <GrowInput className={`reflect-input${jabrBor ? ' filled' : ''}`} value={dJabr} maxLength={90}
                  placeholder={tr({ uz: 'Bu qaror kimga tegadi?', ru: 'Кого касается это решение?' })}
                  aria-label={tr({ uz: 'Bu qaror qaysi odamga tegadi?', ru: 'Какого человека касается это решение?' })}
                  onChange={e => setDJabr(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') save(); }} />
                {/* 106d: ikki tomonlama javob — bloklamaydi, yo'naltiradi */}
                {dQaror.trim().length > 0 && !uzunQ && <p className="sfb ask">{tr({ uz: "Juda qisqa qoldi — ilova aynan qaysi ishni o'zi qilmasligini yozing.", ru: 'Слишком коротко — напишите, какую именно работу приложение не делает само.' })}</p>}
                {uzunQ && takror && <p className="sfb ask">{tr({ uz: 'Bu ish yuqorida allaqachon yozilgan — boshqa ishni oling.', ru: 'Эта работа уже написана выше — возьмите другую.' })}</p>}
                {uzunQ && !takror && !inkorBor && <p className="sfb ask">{tr({ uz: <>Chegara — ilova nima <b>qilmasligi</b>. «…maydi» shaklida yozing.</>, ru: <>Граница — это то, что приложение <b>не делает</b>. Напишите в форме «…не делает».</> })}</p>}
                {guruhOnly && <p className="sfb ask">{tr({ uz: "«Hamma», «mijozlar» — bu kim? Qaysi mijoz? O'sha paytda u nima qilayotgan edi?", ru: '«Все», «клиенты» — это кто? Какой клиент? Что он делал в тот момент?' })}</p>}
                {!guruhOnly && birXil && <p className="sfb ask">{tr({ uz: "Uchala qator bitta odamga tegyapti — do'konda boshqa odam ham bor.", ru: 'Все три строки касаются одного человека — в магазине есть и другие люди.' })}</p>}
                {canSave && inkorBor && !birXil && <p className="sfb ok">{tr({ uz: 'Ish ham, odam ham yozildi.', ru: 'Записаны и работа, и человек.' })}</p>}
                <button type="button" className="wsp-save" disabled={!canSave} onClick={save}>{edit === null ? tr({ uz: 'Saqlash →', ru: 'Сохранить →' }) : tr({ uz: '✓ Yangilash', ru: '✓ Обновить' })}</button>
              </div>
            )}
            {/* 80c: yozilganlar YOZISH PAYTIDA ko'rinmaydi; uchtasi yozilgach ro'yxat ochiladi */}
            {done && edit === null && (
              <div className="wsp-list fade-step">
                <span className="wsp-list-h">{tr({ uz: "Mini-do'koningizning uch chegarasi", ru: 'Три границы вашего мини-магазина' })}</span>
                {list.slice(0, 3).map((r, k) => (
                  <span key={k} className="wsp-item">
                    <span className="wsp-item-n">{k + 1}</span>
                    <span className="wsp-item-t">{r.qaror} <i className="wsp-arw">→</i> {r.jabr}</span>
                    <button type="button" className="wsp-item-edit" title={tr({ uz: 'Tahrirlash', ru: 'Изменить' })} onClick={() => startEdit(k)}>✎</button>
                  </span>
                ))}
              </div>
            )}
          </Col>
          <Col gap={9}>
            <div className="wsp-task">
              <span className="wsp-task-lbl">{tr({ uz: '🎯 Topshiriq', ru: '🎯 Задание' })}</span>
              <span className="wsp-task-nom">{tr({ uz: 'Har chegarada aniq kim ekani', ru: 'В каждой границе — кто именно' })}</span>
              <div className="wsp-chk">
                <span className={`wsp-chk-i${done && bariInkor ? ' on' : ''}`}><i>{done && bariInkor ? '✓' : '○'}</i>{tr({ uz: '«…maydi» bilan tugaydi', ru: 'Сформулировано с «не»' })}</span>
                <span className={`wsp-chk-i${done && bariAniq ? ' on' : ''}`}><i>{done && bariAniq ? '✓' : '○'}</i>{tr({ uz: 'Aniq kim yozilgan', ru: 'Написано, кто именно' })}</span>
              </div>
            </div>
            <div className="wsxrow">
              <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: '💡 Yordam', ru: '💡 Подсказка' })} {yordamOpen ? '▾' : '▸'}</button>
                {yordamOpen && <div className="wsx-body"><p>{tr({ uz: "Ikki savol bering: ilova buni so'ramay qilsa nima bo'ladi? Bu qaror aniq kimga tegadi?", ru: 'Задайте два вопроса: что будет, если приложение сделает это без спроса? Кого именно касается это решение?' })}</p></div>}
              </div>
              <div className={`wsx star ${starOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setStarOpen(o => !o)}>{tr({ uz: "⭐ Qo'shimcha", ru: '⭐ Дополнительно' })} {starOpen ? '▾' : '▸'}</button>
                {starOpen && <div className="wsx-body">
                  <p>{tr({ uz: "Ilova o'zi qilaversa ham bo'ladigan bitta ishni toping. Nega unga chegara kerak emas — bir qatorda yozing.", ru: 'Найдите одну работу, которую приложение вполне может делать само. Напишите в одну строку, почему ей не нужна граница.' })}</p>
                  <GrowInput className="reflect-input" value={star} onChange={e => saveStar(e.target.value)} maxLength={120} placeholder={tr({ uz: 'Qaysi ish va nega chegarasiz qolaveradi?', ru: 'Какая работа и почему остаётся без границы?' })} />
                </div>}
              </div>
            </div>
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Uch chegarani yozganlar', ru: 'Написали три границы' }} />
          </Col>
        </div>
        {done && edit === null && <div className="done-mini fade-step">{tr({ uz: <>✅ Uch chegarangiz yozildi <span className="dm-sub">— har birida bu qaror tegadigan aniq odamlar yozilgan.</span></>, ru: <>✅ Три ваши границы записаны <span className="dm-sub">— в каждой указано, кого именно касается это решение.</span></> })}</div>}
        <MentorNote>{tr({ uz: "«Ilova hech qanday xato qilmasin» degan qatorlar chiqadi — bu eng foydali xato. Javob-qatori uni tutadi, siz so'rang: bu qaysi ISH haqida? Baholash mezoni bitta: qator «…maydi» bilan tugaydimi va yonida aniq kim ekani yozilganmi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Появятся строки вроде «Приложение не должно ошибаться» — это самая полезная ошибка. Строка-подсказка её поймает, а вы спросите: о какой РАБОТЕ это? Критерий оценки один: сформулирована ли строка через «…не делает» и указано ли рядом, кто именно. Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEKSHIRUV: QARORNI ODAMIGA QO'SHING (26-qonun: yangi mexanika) =====
// Yangi sahna, o'sha olam (91-qonun): do'kon ilovasi (s4) -> do'konning boti (s9).
// To'rtlik s4 uchligini takrorlamaydi (§102); to'rtala odam ham «mijoz» bilan tugaydi,
// ya'ni juftlikni nom-mosligi bilan topib bo'lmaydi (§127).
const BOT_QARORLAR = [
  { id: 'q1', ic: '🌙', t: { uz: "Buyurtma tasdig'ini kechasi soat ikkida yuboradi", ru: 'Отправляет подтверждение заказа в два часа ночи' }, odam: 'o1', sabab: { uz: 'Xabar ertalab ham yetardi — uyqusi bo\'lindi', ru: 'Сообщение подождало бы и до утра — а сон прервался' } },
  { id: 'q2', ic: '🔁', t: { uz: "Javob kelmasa, har o'n daqiqada qayta yozadi", ru: 'Если нет ответа, пишет снова каждые десять минут' }, odam: 'o2', sabab: { uz: "Darsdan chiqqanda telefoni bir xil xabarlarga to'lib ketgan edi", ru: 'После урока его телефон был забит одинаковыми сообщениями' } },
  { id: 'q3', ic: '🧹', t: { uz: "Bir hafta javob bermagan buyurtmani o'zi bekor qiladi", ru: 'Сам отменяет заказ, если неделю нет ответа' }, odam: 'o3', sabab: { uz: 'Tuzalib qaraganda buyurtmasi bekor bo\'lgan edi', ru: 'Когда он выздоровел, заказ уже был отменён' } },
  { id: 'q4', ic: '🏷', t: { uz: "Chegirma xabarini faqat ko'p buyurtma berganlarga yuboradi", ru: 'Отправляет сообщение о скидке только тем, кто много заказывает' }, odam: 'o4', sabab: { uz: "Chegirma bo'lganini umuman bilmadi", ru: 'Он вообще не узнал о скидке' } },
];
const BOT_ODAMLAR = [
  { id: 'o2', t: { uz: "Dars paytida telefonini o'chirib qo'yadigan mijoz", ru: 'Клиент, который выключает телефон на уроках' } },
  { id: 'o4', t: { uz: 'Birinchi marta buyurtma bergan mijoz', ru: 'Клиент, сделавший первый заказ' } },
  { id: 'o1', t: { uz: 'Telefonini yostiq yonida qoldiradigan mijoz', ru: 'Клиент, который оставляет телефон у подушки' } },
  { id: 'o3', t: { uz: "Kasal bo'lib yotib qolgan mijoz", ru: 'Клиент, который слёг с болезнью' } },
];
const JUFT_KEY = 'pm-m6d6-juft';
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [pairs, setPairs] = useState(() => { /* F-0915-02 */ const p = storedAnswer?.pairs; const out = {}; if (p && typeof p === 'object') for (const [k, v] of Object.entries(p)) if (BOT_ODAMLAR.some(o => o.id === v)) out[k] = v; return out; });
  const [selQ, setSelQ] = useState(null);
  const [miss, setMiss] = useState('');
  const [missedOnce, setMissedOnce] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  // 🔴 ETALON 44: mentor rejimida javob-kaliti FAQAT «Natijani ochish»dan keyin
  const [mReveal, setMReveal] = useState(false);
  const n = Object.keys(pairs).length;
  const done = n >= BOT_QARORLAR.length;
  // To'rtinchi juftlik o'z-o'zidan qo'shiladi — uchtasi topilgach boshqa variant qolmaydi
  useEffect(() => {
    if (n !== BOT_QARORLAR.length - 1) return;
    const oxirgi = BOT_QARORLAR.find(q => !pairs[q.id]);
    if (!oxirgi) return;
    const t = setTimeout(() => setPairs(p => ({ ...p, [oxirgi.id]: oxirgi.odam })), 700);
    return () => clearTimeout(t);
  }, [n]); // eslint-disable-line
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      try { localStorage.setItem(JUFT_KEY, JSON.stringify({ pairs, savedAt: Date.now() })); } catch {}
      onAnswer(screen, { stage: 'juft', screenIdx: screen, pairs, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'juft', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const bosQaror = (id) => {
    if (isMentor || pairs[id] || done) return;
    setMiss('');
    setSelQ(p => (p === id ? null : id));
  };
  const bosOdam = (oid) => {
    if (isMentor || done) return;
    if (!selQ) { setMiss({ uz: '👆 Avval bitta qarorni bosing.', ru: '👆 Сначала нажмите одно решение.' }); return; }
    const q = BOT_QARORLAR.find(x => x.id === selQ);
    if (q && q.odam === oid) { setPairs(p => ({ ...p, [q.id]: oid })); setSelQ(null); setMiss(''); return; }
    setMissedOnce(true);
    if (achMiss) achMiss.miss(screen);
    setMiss({ uz: "Bu odam ham bot bilan uchrashadi — lekin boshqa paytda. Qaysi qaror aynan shu paytga tushadi?", ru: 'Этот человек тоже сталкивается с ботом — но в другой момент. Какое решение приходится именно на этот момент?' });
  };
  const korinsin = !isMentor || mReveal;
  const juftlangan = (oid) => Object.values(pairs).includes(oid);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${Math.max(BOT_QARORLAR.length - 1 - n, 1)} juftlikni tuzing`, ru: `Осталось составить пар: ${Math.max(BOT_QARORLAR.length - 1 - n, 1)}` });
  return (
    <Stage eyebrow={tr({ uz: "Tekshiruv · do'konning boti", ru: 'Проверка · бот магазина' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(9px,1.4vw,14px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har qarorni u tegadigan odamga <span className="italic" style={{ color: T.accent }}>qo'shing</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Соедините</span> каждое решение с человеком, которого оно касается.</> })}</h2></div>
        <Mentor>{tr({ uz: "Uch chegarangiz tayyor — endi shu savolni do'konning botiga beramiz. Avval bot o'zi qiladigan ishni, keyin shu qaror tegadigan odamni bosing.", ru: 'Три ваши границы готовы — теперь зададим тот же вопрос боту магазина. Сначала нажмите работу, которую бот делает сам, затем — человека, которого касается это решение.' })}</Mentor>
        {isMentor && !mReveal && (
          <div className="jft-mrev">
            <span>{tr({ uz: "Javoblar «Natijani ochish»da ko'rinadi — proyektorda oldindan ochilmaydi.", ru: 'Ответы видны после «Открыть результат» — на проекторе заранее не открываются.' })}</span>
            <button type="button" className="wsp-save" onClick={() => { setMReveal(true); setPairs(Object.fromEntries(BOT_QARORLAR.map(q => [q.id, q.odam]))); }}>{tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>
          </div>
        )}
        <div className="split">
          <Col gap={9}>
            <div className="jft-col">
              {BOT_QARORLAR.map(q => {
                const ok = korinsin && !!pairs[q.id];
                return (
                  <div key={q.id} className={`jft-wrap${ok ? ' ok' : ''}`}>
                    <button type="button" className={`jft-card q${selQ === q.id ? ' sel' : ''}${ok ? ' done' : ''}`} onClick={() => bosQaror(q.id)} disabled={ok || isMentor}>
                      <span className="jft-ic">{q.ic}</span><span className="jft-t">{tr(q.t)}</span>
                      {ok && <span className="jft-mark">✓</span>}
                    </button>
                    {ok && <span className="jft-sabab">{tr(BOT_ODAMLAR.find(o => o.id === pairs[q.id]).t)} — {tr(q.sabab)}</span>}
                  </div>
                );
              })}
            </div>
          </Col>
          <Col gap={9}>
            <div className="jft-col">
              {BOT_ODAMLAR.map(o => {
                const ok = korinsin && juftlangan(o.id);
                return (
                  <button key={o.id} type="button" className={`jft-card o${ok ? ' done' : ''}${selQ && !ok ? ' live' : ''}`} onClick={() => bosOdam(o.id)} disabled={ok || isMentor}>
                    <span className="jft-t">{tr(o.t)}</span>
                    {ok && <span className="jft-mark">✓</span>}
                  </button>
                );
              })}
            </div>
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label={{ uz: "To'rt juftlikni tuzganlar", ru: 'Составили четыре пары' }} />
          </Col>
        </div>
        {!done && <AchRule screen={screen} />}
        {/* YORDAM-savoli ekran boshida TURMAYDI: faqat birinchi xatodan keyin ochiladi */}
        {miss && !done && <p className="bhint fade-step">{tr(miss)}</p>}
        {missedOnce && !done && (
          <div className={`wsx ${yordamOpen ? 'open' : ''}`} style={{ maxWidth: 560 }}>
            <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: '💡 Yordam', ru: '💡 Подсказка' })} {yordamOpen ? '▾' : '▸'}</button>
            {yordamOpen && <div className="wsx-body"><p>{tr({ uz: 'Ikki savol bering: bu odam qaysi paytda telefoniga qaray oladi?', ru: 'Задайте два вопроса: в какой момент этот человек может посмотреть в телефон?' })}</p><p>{tr({ uz: 'Bot undan nimani kutyapti?', ru: 'Чего бот от него ждёт?' })}</p></div>}
          </div>
        )}
        {done && (
          <div className="bdone fade-step">
            <span className="done-mini">{tr({ uz: <>✅ To'rtala qarorni ham bot o'zi qildi <span className="dm-sub">— to'rtala odam ham buni so'ramagan edi</span></>, ru: <>✅ Все четыре решения бот принял сам <span className="dm-sub">— никто из четырёх людей об этом не просил</span></> })}</span>
          </div>
        )}
        <MentorNote>{tr({ uz: "Eng ko'p adashiladigan joy — ikkinchi va uchinchi juftlik: ikkalasida ham mijoz botga javob bermaydi. Farq nega javob bermaganida: biri darsda, biri kasal. Ish-tartibi: juftlikda ishlating — har o'quvchi sherigining uch chegarasini o'qib, har biriga «bu qaror kimga tegadi?» deb so'raydi; odam nomlanmasa, qator qayta yoziladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Чаще всего ошибаются на второй и третьей паре: в обеих клиент не отвечает боту. Разница в том, почему не ответил: один на уроке, другой болеет. Порядок работы: в парах — каждый ученик читает три границы соседа и к каждой спрашивает «кого касается это решение?»; если человек не назван, строку переписывают. Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — KODING: chegara kerak ishlarni topadigan kod (26/82/87-qonun) =====
// Umumiy kompilyator (src/compilator/HtmlCompiler.jsx) — sof JS: brauzer-oynasi chizilmaydi.
const KODING_KEY = 'pm-m6d6-code';
const readKoding = () => { try { const v = JSON.parse(localStorage.getItem(KODING_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const writeKodingOpen = (open) => { try { const p = readKoding() || {}; localStorage.setItem(KODING_KEY, JSON.stringify({ ...p, open })); } catch {} };

// Darvoza-mashq (82e): darsning O'Z bilimi — m6-04 dagi vakolat chegarasi qadami
const GATE_ITEMS = [
  { id: 'g1', t: { uz: "Odamdan tasdiq so'raydi", ru: 'Просит подтверждения у человека' },       ok: true },
  { id: 'g2', t: { uz: 'Ishni ikki marta bajaradi', ru: 'Выполняет работу дважды' },      ok: false },
  { id: 'g3', t: { uz: "Darhol o'zi bajarib qo'yadi", ru: 'Сразу выполняет сам' }, ok: false },
];

const KOD_STARTER = { uz: `// Har ish uchun ikki qiymat: ilova buni o'zi qiladimi va bu ish kimga tegadi
// tegadi: "" — bu ish hech kimga tegmaydi (do'konning ichki ishi)
const dokonIshlari = [
  { nom: "javobYozish",     oziQiladi: true,  tegadi: "mijoz" },
  { nom: "narxOzgartirish", oziQiladi: false, tegadi: "mijoz" },
  { nom: "buyurtmaBekor",   oziQiladi: true,  tegadi: "mijoz" },
  { nom: "hisobotYigish",   oziQiladi: true,  tegadi: "" }
];

const botIshlari = [
  { nom: "kechasiXabar",  oziQiladi: true,  tegadi: "mijoz" },
  { nom: "adminXabar",    oziQiladi: true,  tegadi: "" },
  { nom: "chegirmaXabar", oziQiladi: false, tegadi: "mijoz" }
];

function chegaraKerak(ishlar) {
  // Ilova o'zi qiladigan va odamga tegadigan ishlarning nomini qaytaring
  return [];   // <- bu joyni siz to'ldirasiz
}

console.log(chegaraKerak(dokonIshlari));
console.log(chegaraKerak(botIshlari));`, ru: `// Для каждой работы два значения: делает ли приложение это само и кого эта работа касается
// tegadi: "" — эта работа никого не касается (внутренняя работа магазина)
const dokonIshlari = [
  { nom: "javobYozish",     oziQiladi: true,  tegadi: "mijoz" },
  { nom: "narxOzgartirish", oziQiladi: false, tegadi: "mijoz" },
  { nom: "buyurtmaBekor",   oziQiladi: true,  tegadi: "mijoz" },
  { nom: "hisobotYigish",   oziQiladi: true,  tegadi: "" }
];

const botIshlari = [
  { nom: "kechasiXabar",  oziQiladi: true,  tegadi: "mijoz" },
  { nom: "adminXabar",    oziQiladi: true,  tegadi: "" },
  { nom: "chegirmaXabar", oziQiladi: false, tegadi: "mijoz" }
];

function chegaraKerak(ishlar) {
  // Верните имена работ, которые приложение делает само и которые касаются человека
  return [];   // <- это место заполняете вы
}

console.log(chegaraKerak(dokonIshlari));
console.log(chegaraKerak(botIshlari));` };

const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish · chegara kerak ishlar', ru: 'Пишем код · работы, которым нужна граница' },
  title: { uz: 'Chegara kerak ishlarni toping', ru: 'Найдите работы, которым нужна граница' },
  brief: { uz: <>Funksiya ilova <b>o'zi qiladigan</b> va <b>odamga tegadigan</b> ishlarning nomini qaytarsin. Pastdagi <span className="mono">console.log</span> ikki ro'yxatning natijasini ko'rsatadi.</>, ru: <>Пусть функция вернёт имена работ, которые приложение <b>делает само</b> и которые <b>касаются человека</b>. Внизу <span className="mono">console.log</span> покажет результат для двух списков.</> },
  files: [{ name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: { uz: "// ikki shartga ham mos ishlarning nomini yig'ib qaytaring", ru: '// соберите и верните имена работ, подходящих под оба условия' } }],
  requirements: [
    { id: 'r1', label: { uz: "Do'kon ro'yxatidan javobYozish qaytdi", ru: 'Из списка магазина вернулся javobYozish' },
      check: C.evalEquals("chegaraKerak(dokonIshlari).includes('javobYozish')", 'true', { uz: "javobYozish ni ilova o'zi qiladi va u mijozga tegadi — nomi ro'yxatga tushsin", ru: 'javobYozish приложение делает само, и эта работа касается клиента — пусть её имя попадёт в список' }) },
    { id: 'r2', label: { uz: "Do'kon ro'yxatidan buyurtmaBekor qaytdi, hisobotYigish esa qaytmadi", ru: 'Из списка магазина вернулся buyurtmaBekor, а hisobotYigish — нет' },
      check: C.evalEquals("chegaraKerak(dokonIshlari).includes('buyurtmaBekor') && !chegaraKerak(dokonIshlari).includes('hisobotYigish')", 'true', { uz: "hisobotYigish hech kimga tegmaydi (tegadi bo'sh) — u ro'yxatga tushmasin", ru: 'hisobotYigish никого не касается (tegadi пустое) — пусть она не попадёт в список' }) },
    { id: 'r3', label: { uz: "Bot ro'yxatidan faqat kechasiXabar qaytdi", ru: 'Из списка бота вернулся только kechasiXabar' },
      check: C.evalEquals("chegaraKerak(botIshlari).join(',')", 'kechasiXabar', { uz: "Bot ro'yxatida ikki shartga ham mos ish bitta", ru: 'В списке бота под оба условия подходит только одна работа' }) },
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
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: '① Javobni belgilang', ru: '① Отметьте ответ' }) : tr({ uz: '② Kodni yozing', ru: '② Напишите код' });
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · kod oynasi', ru: 'Пишем код · окно кода' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.5vw,15px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Chegara kerak ishlarni topadigan <span className="italic" style={{ color: T.accent }}>kod</span> yozamiz.</>, ru: <>Пишем <span className="italic" style={{ color: T.accent }}>код</span>, который находит работы, которым нужна граница.</> })}</h2></div>
        {!stage2 ? (
          <>
            <Mentor>{tr({ uz: 'Kodda ish ikki shartga tekshiriladi. Avval bitta savolga javob bering.', ru: 'В коде работа проверяется по двум условиям. Сначала ответьте на один вопрос.' })}</Mentor>
            <div className={`cmt hunt${missedOnce ? ' calm' : ''}`}>
              <span className="cmt-lbl">{tr({ uz: "Chegarada odam tasdig'i talab qilingan. Agent ishni boshlashdan oldin nima qiladi?", ru: 'Граница требует подтверждения человека. Что делает агент, прежде чем начать работу?' })}</span>
              <div className="gt-rows">
                {GATE_ITEMS.map(g => (
                  <button key={g.id} type="button" className={`fchoice${miss === g.id ? ' miss' : ''}`} onClick={() => pickGate(g)}>
                    {tr(g.t)}
                  </button>
                ))}
              </div>
              {missedOnce && <p className="cmt-tip">{tr({ uz: "Tasdiq ish boshlanishidan oldin so'raladi. Agent ishni boshlashdan oldin kimga murojaat qiladi?", ru: 'Подтверждение спрашивают до начала работы. К кому агент обращается, прежде чем начать работу?' })}</p>}
            </div>
          </>
        ) : (
          <>
            <Mentor>{tr({ uz: <>Hozir har qarorni odamiga qo'shdingiz — endi shu ishni kod bajaradi. Kodda har ishning ikki qiymati bor: <b style={{ color: T.ink }}>oziQiladi</b> — ilova buni o'zi qiladimi, <b style={{ color: T.ink }}>tegadi</b> — bu ish kimga tegadi.</>, ru: <>Вы только что соединили каждое решение с его человеком — теперь эту работу выполнит код. В коде у каждой работы два значения: <b style={{ color: T.ink }}>oziQiladi</b> — делает ли приложение это само, <b style={{ color: T.ink }}>tegadi</b> — кого касается эта работа.</> })}</Mentor>
            <div className="cmt-fold fade-step"><span className="cmt-done">{tr({ uz: "✓ Belgilandi: Odamdan tasdiq so'raydi", ru: '✓ Отмечено: Просит подтверждения у человека' })}</span></div>
            <div className="split">
              <Col gap={10}>
                <div className={`kdpanel${done ? ' is-done' : ''}`}>
                  <p className="flow-label">{tr({ uz: 'Kod nima qilsin', ru: 'Что должен делать код' })}</p>
                  <ol className="kdreq">
                    <li>{tr({ uz: <>Do'kon ro'yxatidan <code className="qcode">javobYozish</code> qaytdi</>, ru: <>Из списка магазина вернулся <code className="qcode">javobYozish</code></> })}</li>
                    <li>{tr({ uz: <>Do'kon ro'yxatidan <code className="qcode">buyurtmaBekor</code> qaytdi, <code className="qcode">hisobotYigish</code> esa qaytmadi</>, ru: <>Из списка магазина вернулся <code className="qcode">buyurtmaBekor</code>, а <code className="qcode">hisobotYigish</code> — нет</> })}</li>
                    <li>{tr({ uz: <>Bot ro'yxatidan faqat <code className="qcode">kechasiXabar</code> qaytdi</>, ru: <>Из списка бота вернулся только <code className="qcode">kechasiXabar</code></> })}</li>
                  </ol>
                  <div className={`wsx star ${yordamOpen ? 'open' : ''}`}>
                    <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: '💡 Yordam', ru: '💡 Подсказка' })} {yordamOpen ? '▾' : '▸'}</button>
                    {yordamOpen && <div className="wsx-body">
                      <p>{tr({ uz: <>Bitta ishdan boshlang: <code className="qcode">javobYozish</code> ni ilova o'zi qiladimi? Bu ish odamga tegadimi? Ikkalasi ham ha bo'lsa — nomi ro'yxatga tushadi.</>, ru: <>Начните с одной работы: <code className="qcode">javobYozish</code> приложение делает само? Эта работа касается человека? Если оба ответа «да» — её имя попадает в список.</> })}</p>
                      <p>{tr({ uz: <>⭐ Qo'shimcha: <code className="qcode">narxOzgartirish</code> ishining <code className="qcode">oziQiladi</code> qiymatini <code className="qcode">true</code> ga o'zgartiring va do'kon ro'yxati endi nima berishini ko'ring.</>, ru: <>⭐ Дополнительно: поменяйте у работы <code className="qcode">narxOzgartirish</code> значение <code className="qcode">oziQiladi</code> на <code className="qcode">true</code> и посмотрите, что теперь выдаст список магазина.</> })}</p>
                    </div>}
                  </div>
                  {done && <div className="done-mini fade-step">{tr({ uz: <>✅ Uchala shart bajarildi <span className="dm-sub">— kod endi chegara kerak ishlarni o'zi topadi</span></>, ru: <>✅ Все три условия выполнены <span className="dm-sub">— теперь код сам находит работы, которым нужна граница</span></> })}</div>}
                  {!done && isSelf && (
                    <button className="kd-skip" onClick={onNext}>{tr({ uz: '✓ Bu kodni sinfda yozganman →', ru: '✓ Я писал этот код в классе →' })}</button>
                  )}
                </div>
                <StudentPracticePulse live={live} screen={screen} />
                <MentorPracticeStats live={live} screen={screen} label={{ uz: "Kodni yozib bo'lganlar", ru: 'Дописали код' }} />
              </Col>
              <Col gap={10}>
                <div className="klaunch">
                  <span className="klaunch-lbl">{tr({ uz: "Ikki ro'yxat — bitta funksiya", ru: 'Два списка — одна функция' })}</span>
                  <p className="klaunch-b">{tr({ uz: "Kompilyator — kod yozib, natijasini darhol ko'rsatadigan oyna: chapda kod, o'ngda natija.", ru: 'Компилятор — окно, где вы пишете код и сразу видите результат: слева код, справа результат.' })}</p>
                  <button className={`kod-launch-btn${openHint ? ' turn-ring' : ''}`} onClick={() => { setOpen(true); writeKodingOpen(true); }}>
                    {done ? tr({ uz: '↻ Kompilyatorni qayta ochish', ru: '↻ Открыть компилятор снова' }) : tr({ uz: '🛠 Kompilyatorni ochish', ru: '🛠 Открыть компилятор' })}
                  </button>
                  {done && <span className="klaunch-sub">{tr({ uz: 'Bajarildi — xohlasangiz kodni yana sayqallang', ru: 'Выполнено — при желании ещё отшлифуйте код' })}</span>}
                </div>
              </Col>
            </div>
          </>
        )}
        <MentorNote>{tr({ uz: "Kod — oqibat ekranidagi ishning to'g'ridan-to'g'ri tarjimasi, shuni ochiq ayting: qo'lda bosgan tugma endi obyektdagi ikki qiymat. Kod shu oynada yoziladi — 10 daqiqa yetadi; ulgurmagan o'quvchi uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Код — прямой перевод работы с экрана последствий, скажите это открыто: кнопка, которую нажимали руками, теперь — два значения в объекте. Код пишется в этом окне — хватит 10 минут; кто не успел, получит домой короткий вариант. Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто.' })}</MentorNote>
      </div>
      {/* 🔴 ZOOM IKKI MARTA TUSHMASIN (18-ov (a)): `.lesson-root` da `zoom: var(--lz)` bor,
          `.hc-root` ham o'zi `zoom: var(--lz)` qo'yadi — keng ekranda (2560x1440 · --lz 1.33)
          ikkovi ko'payib `.hc-bottom` ekrandan chiqib ketardi. Qobiqdagi teskari bekor
          zoomni bekor qiladi — kompilyator o'z lz sida, viewport ICHIDA qoladi. */}
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
const REFLECT_KEY = 'pm-m6d6-reflection';
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
              ? <span className="pair-now">{tr({ uz: 'Hozir ovoz chiqarib ayting', ru: 'Сейчас скажите вслух' })}</span>
              : <><span className="pair-now">{tr({ uz: <>Hozir <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span> gapiradi</>, ru: <>Сейчас говорит <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span></> })}</span><span className="pair-next">{isA ? tr({ uz: 'keyin — B navbati', ru: 'потом — очередь B' }) : tr({ uz: 'oxirgi navbat', ru: 'последняя очередь' })}</span></>}
          </div>
        </div>
      ) : (solo && !st.done) ? null : (
        <p className="pair-now" style={{ margin: 0 }}>{st.done
          ? (solo ? tr({ uz: "✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla!", ru: '✓ Время вышло — вы рассказали. Молодец!' }) : tr({ uz: "✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla!", ru: '✓ Время вышло — рассказали оба. Молодцы!' }))
          : (solo ? tr({ uz: "30 soniya — ovoz chiqarib o'zingizga ayting.", ru: '30 секунд — расскажите вслух самому себе.' }) : tr({ uz: 'Har biringizga 30 soniyadan — avval A, keyin B.', ru: 'По 30 секунд каждому — сначала A, потом B.' }))}</p>
      )}
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
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Uch chegarangizni <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</>, ru: <>Сможете назвать свои три границы <span className="italic" style={{ color: T.accent }}>по памяти</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Ekranga qaramasdan javob bering: ilova qaysi ishni o'zi qilmaydi va bu kimga tegadi?", ru: 'Ответьте, не глядя на экран: какую работу приложение не делает само и кого это касается?' })}</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">🗣 {yakka ? tr({ uz: "Ovoz chiqarib ayting: qaysi ish va qaysi odam", ru: 'Скажите вслух: какая работа и какой человек' }) : tr({ uz: 'Sherigingizga ayting: qaysi ish va qaysi odam', ru: 'Скажите соседу: какая работа и какой человек' })}</span></div></div>
            <PairTimer onStage={setPairStage} muted={written} solo={yakka} />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr({ uz: '✍️ Endi bir qator yozing', ru: '✍️ Теперь напишите одну строку' })}</span></div></div>
            <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
              <GrowInput className="reflect-input" value={text} onChange={e => save(e.target.value)} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} placeholder={tr({ uz: "Ilova ... ni o'zi qilmaydi, bu qaror ... ga tegadi", ru: 'Приложение само не делает ..., это решение касается ...' })} maxLength={160} />
            </span>
            {written && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>{tr({ uz: '✓ Yozildi!', ru: '✓ Записано!' })}</p>}
          </div>
        </div>
        <MentorNote>{tr({ uz: "Uchdan biri odamni nomlay olmasa — oqibat ekranini qayta oching va o'ng tomondagi kartani birga o'qing.", ru: 'Если треть класса не может назвать человека — снова откройте экран последствий и вместе прочитайте карточку справа.' })}</MentorNote>
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
        : (<p className="fc-hint" />)}
    </div>
  );
}
const FLASHCARDS = [
  { front: { uz: 'Chegara nima?', ru: 'Что такое граница?' }, back: { uz: "Ilova qaysi ishni o'zi qilaverishi, qaysisini odamdan o'tkazishi haqida oldindan qilingan qaror", ru: 'Заранее принятое решение о том, какую работу приложение делает само, а какую пропускает через человека' } },
  { front: { uz: "Chegara qaysi ishga qo'yiladi?", ru: 'На какую работу ставят границу?' }, back: { uz: "Ilova o'zi qiladigan va odamga tegadigan ishga", ru: 'На работу, которую приложение делает само и которая касается человека' } },
  { front: { uz: 'Chegara yozishdan oldin qaysi savol beriladi?', ru: 'Какой вопрос задают, прежде чем написать границу?' }, back: { uz: 'Bu qaror kimga tegadi?', ru: 'Кого касается это решение?' } },
  { front: { uz: 'Qaror tegadigan odam qanday yoziladi?', ru: 'Как записывают человека, которого касается решение?' }, back: { uz: "Aniq kim ekanini aytib — «hamma» deb emas", ru: 'Называют, кто именно, — а не «все»' } },
  { front: { uz: 'AI yozgan tavsif saytga chiqishidan oldin nima bo\'ladi?', ru: 'Что происходит, прежде чем описание от AI попадёт на сайт?' }, back: { uz: "Do'kon egasi o'qib chiqadi", ru: 'Его читает владелец магазина' } },
  { front: { uz: 'Hamma ishga chegara qo\'yilsa nima bo\'ladi?', ru: 'Что будет, если поставить границу на все работы?' }, back: { uz: "Har ish odamni kutadi — do'kon sekinlashadi", ru: 'Каждая работа ждёт человека — магазин замедляется' } },
  { front: { uz: 'Bot tasdiqni kechasi yuborsa, kimga tegadi?', ru: 'Если бот отправит подтверждение ночью, кого это коснётся?' }, back: { uz: 'Telefonini yostiq yonida qoldiradigan mijozga', ru: 'Клиента, который оставляет телефон у подушки' } },
  { front: { uz: "AI javobni mijozga o'zi yozib yuborsa, kimga tegadi?", ru: 'Если AI сам напишет и отправит ответ клиенту, кого это коснётся?' }, back: { uz: "«Zaryadlagich qo'shib berasizmi?» deb so'ragan mijozga", ru: 'Клиента, который спросил «Положите зарядку в комплект?»' } },
  { front: { uz: 'Chegarani kim qo\'yadi?', ru: 'Кто ставит границу?' }, back: { uz: 'Ilovani yaratayotgan odam — ya\'ni siz', ru: 'Тот, кто создаёт приложение, — то есть вы' } },
  { front: { uz: 'Agentga qo\'yilgan chegara nima deb ataladi?', ru: 'Как называется граница, поставленная агенту?' }, back: { uz: 'Vakolat chegarasi — inglizcha guardrail', ru: 'Граница полномочий — по-английски guardrail' } },
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
    question={<TestQ ask={tr({ uz: "Do'kon egasi hamma ishga chegara qo'ydi. Endi nima bo'ladi?", ru: 'Владелец магазина поставил границу на все работы. Что теперь будет?' })} />}
    questionText={tr({ uz: "Do'kon egasi hamma ishga chegara qo'ydi, endi nima bo'ladi", ru: 'Владелец магазина поставил границу на все работы, что теперь будет' })}
    options={[tr({ uz: "Xatolar kamayadi, ish tezligi esa o'zgarmaydi", ru: 'Ошибок станет меньше, а скорость работы не изменится' }), tr({ uz: "Har ish do'kon egasi o'qiguncha turib qoladi", ru: 'Каждая работа будет ждать, пока её прочитает владелец' }), tr({ uz: "Do'kon egasi faqat eng muhim ishlarni o'qiydi", ru: 'Владелец будет читать только самые важные работы' })]}
    correctIdx={1}
    explainCorrect={tr({ uz: "Do'kon sekinlashadi: har ish odamni kutadi, egasi esa hammasiga ulgurmaydi. Shuning uchun chegara tanlab qo'yiladi — odamga eng og'ir tegadigan ishga.", ru: 'Магазин замедляется: каждая работа ждёт человека, а владелец не успевает за всем. Поэтому границу ставят выборочно — на работу, которая тяжелее всего ударит по человеку.' })}
    explainWrong={{
      0: tr({ uz: "Xatolar kamayadi, lekin tezlik tushadi: har ish do'kon egasini kutadi.", ru: 'Ошибок станет меньше, но скорость упадёт: каждая работа ждёт владельца.' }),
      2: tr({ uz: "Chegara hamma ishga qo'yilgan — demak do'kon egasi eng muhimini emas, har bir ishni o'qiydi.", ru: 'Граница стоит на всех работах — значит, владелец читает не только самое важное, а каждую работу.' }),
      default: tr({ uz: "Hamma ishga chegara qo'ysangiz, har ish do'kon egasi o'qiguncha turib qoladi.", ru: 'Если поставить границу на все работы, каждая будет ждать, пока её прочитает владелец.' })
    }}
  />
);
// ===== UYGA VAZIFA — alohida ekran EMAS, YAKUN sahifasi ichida (etalon: P0 · PmLesson2 · PmLesson4) =====
const HW_KEY = 'pm-m6d6-hw-target';
const HW_VARIANT = [
  { k: 'toliq', t: { uz: "To'liq · ~20 daqiqa", ru: 'Полный · ~20 минут' } },
  { k: 'qisqa', t: { uz: 'Qisqa · ~10 daqiqa', ru: 'Короткий · ~10 минут' } },
];
const HW_STEPS = {
  toliq: [{ uz: "Mini-do'koningizning yana bir ishini toping", ru: 'Найдите ещё одну работу вашего мини-магазина' }, { uz: "Chegarani «…maydi» shaklida yozing", ru: 'Напишите границу в форме «…не делает»' }, { uz: "Yoniga jabr ko'radigan bitta odamni qo'ying", ru: 'Поставьте рядом одного человека, который пострадает' }],
  qisqa: [{ uz: "Uch chegarangizni qayta o'qing", ru: 'Перечитайте свои три границы' }, { uz: 'Eng aniq odamni aytadiganini belgilang', ru: 'Отметьте ту, что называет самого конкретного человека' }, { uz: 'Sababini bir gap bilan yozing', ru: 'Напишите причину одним предложением' }],
};
const readHwTarget = () => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } };
// Uy-vazifa kapsulasi fonidagi xira so'z-tokenlar — dars atamalari (CodeStrike cs-sky oilasi)
const HW_TOKENS = [
  { t: { uz: 'chegara', ru: 'граница' },  l: 5,  tp: 16, s: 12, d: 6.5 },
  { t: { uz: 'qaror', ru: 'решение' },    l: 80, tp: 12, s: 11, d: 7.5 },
  { t: { uz: 'mijoz', ru: 'клиент' },    l: 12, tp: 70, s: 11, d: 8 },
  { t: { uz: 'javob', ru: 'ответ' },    l: 64, tp: 76, s: 12, d: 6 },
  { t: { uz: 'odam', ru: 'человек' },     l: 86, tp: 52, s: 10, d: 9 },
  { t: '✅',        l: 36, tp: 8,  s: 12, d: 7 },
  { t: { uz: 'bot', ru: 'бот' },      l: 3,  tp: 44, s: 12, d: 8.5 },
];
const HwCard = ({ variant, onPick }) => {
  const steps = HW_STEPS[variant] || HW_STEPS.toliq;
  const pickTurn = useTurnHint(!variant && !!onPick);
  return (
    <div className="card fade-step">
      <div className="card-lbl" style={{ color: T.accent }}>📝 {tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      {(
        <>
          <p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Uyda ro'yxatingizni davom ettirasiz: mini-do'koningizning yana bir ishini topib, chegarasini va bu qaror kimga tegishini yozasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.", ru: 'Дома вы продолжите свой список: найдёте ещё одну работу мини-магазина и напишете её границу и кого касается это решение. Сколько у вас времени — выбираете сами.' })}</p>
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
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Nechta', ru: 'Сколько' })}</span><span className="pmtask-v"><b>{variant === 'qisqa' ? tr({ uz: '1 ta belgilash', ru: '1 отметка' }) : tr({ uz: '1 ta yangi chegara', ru: '1 новая граница' })}</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Muddat', ru: 'Срок' })}</span><span className="pmtask-v"><b>{tr({ uz: 'navbatdagi darsgacha', ru: 'до следующего урока' })}</b></span></div>
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
  mirrorCheck: { icon: '🪞', name: 'Mirror Check!', desc: { uz: "Qaror kimga tegishini o'zingiz ko'rdingiz", ru: 'Вы сами увидели, кого касается решение' } },
  ruleMaker:   { icon: '✍️', name: 'Rule Maker!',   desc: { uz: 'Uch chegarani odami bilan yozdingiz', ru: 'Вы написали три границы вместе с людьми' } },
  pairFinder:  { icon: '🔗', name: 'Pair Finder!',  desc: { uz: "To'rt qarorni odamiga qo'shdingiz", ru: 'Вы соединили четыре решения с людьми' } },
  limitCoder:  { icon: '🛠', name: 'Limit Coder!',  desc: { uz: 'Chegara kerak ishlarni kod bilan topdingiz', ru: 'Вы нашли кодом работы, которым нужна граница' } },
};
const ACH_TRIGGERS = { s4: 'mirrorCheck', s8: 'ruleMaker', s9: 'pairFinder', s10: 'limitCoder' };

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
    : tr({ uz: "🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: '🏅 Выполните верно с первой попытки — награда ваша.' })}</p>;
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
const Q_LABELS = { 3: { uz: "1 — Qaysi do'konda chegara", ru: '1 — В каком магазине граница' }, 5: { uz: '2 — Chegara qaysi ishga', ru: '2 — На какую работу граница' }, 7: { uz: '3 — Chegaraning joyi', ru: '3 — Место границы' }, 11: { uz: '4 — Yakuniy savol', ru: '4 — Итоговый вопрос' } };
const QUIZ_MS = 15000;
const QZ_BG_SHAPES = [
  { ch: { uz: 'chegara', ru: 'граница' }, l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'qaror', ru: 'решение' },   l: 85, t: 8,  s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'mijoz', ru: 'клиент' },   l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'javob', ru: 'ответ' },   l: 74, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: { uz: 'bot', ru: 'бот' },     l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'odam', ru: 'человек' },    l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'tavsif', ru: 'описание' },  l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: { uz: 'ilova', ru: 'приложение' },   l: 55, t: 5,  s: 20, d: 22, dl: 0.6 },
  { ch: '✅',       l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '🔴',       l: 16, t: 52, s: 28, d: 26, dl: 2.6 },
  { ch: '🛒',       l: 2,  t: 30, s: 30, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike — 12 savol · 3/3/3/3 · kalit-tsikli 0,3,2,1 · 1,0,2,3 · 0,2,1,3.
const QUIZ_BANK = [
  { q: { uz: 'Chegara nima?', ru: 'Что такое граница?' }, opts: [{ uz: "Ilova qaysi ishni o'zi qilmasligi haqidagi qaror", ru: 'Решение о том, какую работу приложение не делает само' }, { uz: "Ilova qaysi ishni birinchi bo'lib o'zi qilishi haqidagi qaror", ru: 'Решение о том, какую работу приложение первым делает само' }, { uz: "Ilova qaysi mijozga xabar yuborishi haqidagi qaror", ru: 'Решение о том, какому клиенту приложение отправит сообщение' }, { uz: "Ilova qaysi sahifani o'zi ochmasligi haqidagi qaror", ru: 'Решение о том, какую страницу приложение не открывает само' }], correct: 0 },
  { q: { uz: "Ilova so'raydigan ish bilan o'zi qiladigan ishning farqi nimada?", ru: 'Чем работа, о которой приложение спрашивает, отличается от работы, которую оно делает само?' }, opts: [{ uz: "So'ralgan ish odamga tezroq yetib boradi", ru: 'Работа со спросом быстрее доходит до человека' }, { uz: "O'zi qiladigan ishda odam kamroq xato qiladi", ru: 'В работе, которую приложение делает само, человек меньше ошибается' }, { uz: "So'ralgan ishni ilova ikki marta bajaradi", ru: 'Работу со спросом приложение выполняет дважды' }, { uz: "So'ralgan ishni odam to'xtata oladi", ru: 'Работу со спросом человек может остановить' }], correct: 3 },
  { q: { uz: "Do'kon egasi kuniga faqat bitta ishni o'zi o'qib chiqa oladi. Qaysi ishni tanlagani to'g'ri?", ru: 'Владелец магазина может сам прочитать только одну работу в день. Какую правильно выбрать?' }, opts: [{ uz: "Mijozga o'zi qo'ng'iroq qiladigan ishni", ru: 'Работу, где он сам звонит клиенту' }, { uz: "Ilova mijozdan so'rab bajaradigan ishni", ru: 'Работу, которую приложение делает, спросив клиента' }, { uz: "Ilova hech kimdan so'ramay bajaradigan ishni", ru: 'Работу, которую приложение делает, ни у кого не спросив' }, { uz: "Ilova hech qachon bajarmaydigan ishni", ru: 'Работу, которую приложение никогда не делает' }], correct: 2 },
  { q: { uz: "Ilova mijozning savatidan mahsulotni o'zi olib tashlasa, kimga tegadi?", ru: 'Если приложение само уберёт товар из корзины клиента, кого это коснётся?' }, opts: [{ uz: "Do'konga tovar keltirib beradigan sotuvchi", ru: 'Продавец, который привозит товар в магазин' }, { uz: "Savatni to'ldirib, to'lovga o'tayotgan mijoz", ru: 'Клиент, который наполнил корзину и переходит к оплате' }, { uz: "Do'kon saytini yasab bergan dasturchi", ru: 'Программист, который сделал сайт магазина' }, { uz: "Mijozlar buyurtmasini omborda yig'adigan xodim", ru: 'Сотрудник, который собирает заказы на складе' }], correct: 1 },
  { q: { uz: "Tavsif hech kim o'qimay saytga chiqsa, nima bo'ladi?", ru: 'Что будет, если описание попадёт на сайт, никем не прочитанное?' }, opts: [{ uz: "Mijoz tavsifni saytda umuman ko'rmay qoladi", ru: 'Клиент вообще не увидит описание на сайте' }, { uz: "Xato tavsifni mijoz o'qib, ishonib qoladi", ru: 'Клиент прочитает ошибочное описание и поверит ему' }, { uz: "Sayt tavsifni o'zi qayta yozib chiqadi", ru: 'Сайт сам перепишет описание' }, { uz: "Mijozning buyurtmasi o'z-o'zidan bekor bo'ladi", ru: 'Заказ клиента сам собой отменится' }], correct: 1 },
  { q: { uz: "Buyurtmani ilova o'zi bekor qilsa, kimga tegadi?", ru: 'Если приложение само отменит заказ, кого это коснётся?' }, opts: [{ uz: "Manzilini qisqa yozib yuborgan mijoz", ru: 'Клиент, коротко написавший адрес' }, { uz: "Buyurtmani mijozga yetkazadigan haydovchi", ru: 'Водитель, который доставляет заказ клиенту' }, { uz: "Do'konga tovar keltiradigan sotuvchi", ru: 'Продавец, который привозит товар в магазин' }, { uz: "Mijozlar to'lovini hisoblab boradigan xodim", ru: 'Сотрудник, который считает оплаты клиентов' }], correct: 0 },
  { q: { uz: "Ilova kech qolgan buyurtmaning yetkazish vaqtini o'zi o'zgartirib qo'ydi. Bu ishga nega chegara kerak?", ru: 'Приложение само изменило время доставки опаздывающего заказа. Зачем этой работе граница?' }, opts: [{ uz: "Ilova vaqtni tez-tez o'zgartirsa, sayt sekinlashadi", ru: 'Если приложение часто меняет время, сайт тормозит' }, { uz: "Yangi vaqt do'kon ro'yxatida ikki marta yoziladi", ru: 'Новое время дважды записывается в список магазина' }, { uz: "Yangi vaqtga ishonib kutgan mijoz aldanib qoladi", ru: 'Клиент, который поверил новому времени и ждал, окажется обманут' }, { uz: "Vaqt o'zgargani do'kon hisobotiga tushmay qoladi", ru: 'Изменение времени не попадёт в отчёт магазина' }], correct: 2 },
  { q: { uz: "Bot tasdiq xabarini kechasi soat ikkida yuborsa, kimga tegadi?", ru: 'Если бот отправит подтверждение в два часа ночи, кого это коснётся?' }, opts: [{ uz: "Ertalab ishga shoshib chiqadigan mijoz", ru: 'Клиент, который утром торопится на работу' }, { uz: "Kechasi do'konni yopib ketgan do'kon egasi", ru: 'Владелец, который ночью закрыл магазин' }, { uz: "Buyurtmani ertalab mijozga olib chiqadigan haydovchi", ru: 'Водитель, который утром везёт заказ клиенту' }, { uz: 'Telefonini yostiq yonida qoldiradigan mijoz', ru: 'Клиент, который спит, не выключив телефон' }], correct: 3 },
  { q: { uz: "Bir hafta telefoniga qaray olmagan mijozga botning qaysi qarori tegdi?", ru: 'Клиент неделю не мог посмотреть в телефон. Какое решение бота его задело?' }, opts: [{ uz: "Bot buyurtmani o'zi bekor qilib yubordi", ru: 'Бот сам отменил заказ' }, { uz: "Bot tasdiq xabarini o'zi kechasi yubordi", ru: 'Бот сам отправил подтверждение ночью' }, { uz: "Bot mahsulot tavsifini o'zi qayta yozdi", ru: 'Бот сам переписал описание товара' }, { uz: "Bot chegirmani ko'p buyurtma berganlarga yubordi", ru: 'Бот отправил скидку тем, кто много заказывает' }], correct: 0 },
  { q: { uz: "Birinchi marta buyurtma bergan mijoz chegirmadan bexabar qoldi. Botning qaysi qarori shunga olib keldi?", ru: 'Клиент, сделавший первый заказ, не узнал о скидке. Какое решение бота к этому привело?' }, opts: [{ uz: "Tasdiq xabarini kechasi soat ikkida yuborishi", ru: 'Отправлять подтверждение в два часа ночи' }, { uz: "Javob kelmagan buyurtmani o'zi bekor qilishi", ru: 'Самому отменять заказ, если нет ответа' }, { uz: "Chegirmani faqat ko'p buyurtma berganlarga yuborishi", ru: 'Отправлять скидку только тем, кто много заказывает' }, { uz: "Javob kelmaguncha har o'n daqiqada yozib turishi", ru: 'Писать каждые десять минут, пока нет ответа' }], correct: 2 },
  { q: { uz: "Do'kon egasi endi har bir buyurtmani o'zi o'qib chiqishga majbur. Sabab nima?", ru: 'Владелец магазина теперь вынужден сам читать каждый заказ. В чём причина?' }, opts: [{ uz: "AI javoblari mijozlarga to'g'ridan-to'g'ri ketgan", ru: 'Ответы AI уходили прямо клиентам' }, { uz: "Do'kondagi hamma ishga chegara qo'yib chiqilgan", ru: 'На все работы в магазине поставили границы' }, { uz: "Bot kechalari umuman ishlamay qo'ygan", ru: 'Бот совсем перестал работать по ночам' }, { uz: "Chegirma xabari hamma mijozlarga yuborilgan", ru: 'Сообщение о скидке отправили всем клиентам' }], correct: 1 },
  { q: { uz: "Ilovaga yangi ish qo'shilmoqchi: mijozga tabrikni o'zi yuborish. Chegara kerakmi — buni kim hal qiladi?", ru: 'В приложение хотят добавить новую работу: самому отправлять клиенту поздравление. Нужна ли граница — кто это решает?' }, opts: [{ uz: "Ilovaning o'zi sinab hal qiladi", ru: 'Приложение само проверит и решит' }, { uz: "Tabrik keladigan mijozning o'zi", ru: 'Сам клиент, которому придёт поздравление' }, { uz: "Ilovaga kod yozgan dasturchi", ru: 'Программист, написавший код приложения' }, { uz: 'Ilovani yaratayotgan odam', ru: 'Тот, кто создаёт приложение' }], correct: 3 },
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
    const TOK = ['chegara', 'qaror', 'mijoz', 'javob', 'bot', 'odam', 'tavsif', 'ilova', '✅', '🔴'];
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
        <div className="head head-c"><h2 className="title h-title fade-up">{isLive ? tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></>, ru: <>Наши сегодняшние <span className="italic" style={{ color: T.accent }}>победители</span></> }) : tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш сегодняшний <span className="italic" style={{ color: T.accent }}>результат</span></> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="pod-solo">
              <div className="pod-solo-sec">
                <span className="pod-solo-lbl">{tr({ uz: '🏅 Nishonlar', ru: '🏅 Значки' })}</span>
                <div className="pod-solo-badges">
                  {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return <span key={id} className={`pod-solo-b ${got ? 'got' : ''}`} title={a.name}>{got ? a.icon : '🔒'}</span>; })}
                </div>
              </div>
            </div>
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.', ru: 'Это ваш личный результат. На живом уроке здесь появится рейтинг всей группы и тройка лучших 🥇🥈🥉 (подиум).' })}</p></div>
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
// Tuzilma etalondan (P0 PmUserStory · PmLesson2 · PmLesson4 · M3-D10):
// hero (h-sub YO'Q) -> CodeStrike -> «Endi siz bilasiz» -> uy-vazifa kapsulasi -> nishonlar.
const ScreenSummary = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const live = _gate.live;
  const isMentorL = !!(live && live.mode === 'mentor');
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const RECAP = [
    { uz: "Chegara — ilova qaysi ishni o'zi qilaverishi, qaysisini odamdan o'tkazishi haqida oldindan qilingan qaror.", ru: 'Граница — это заранее принятое решение о том, какую работу приложение делает само, а какую пропускает через человека.' },
    { uz: "Chegara ilova o'zi qiladigan va odamga tegadigan ishga qo'yiladi — ayniqsa muhim yoki xavfli ishga.", ru: 'Границу ставят на работу, которую приложение делает само и которая касается человека, — особенно на важную или опасную.' },
    { uz: 'Har chegarada bu qaror tegadigan aniq odamlar yoziladi.', ru: 'В каждой границе записывают конкретных людей, которых касается это решение.' },
    { uz: "Chegarani ilova emas, ilovani yaratayotgan odam qo'yadi — ya'ni siz.", ru: 'Границу ставит не приложение, а тот, кто его создаёт, — то есть вы.' },
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
  // 77-qonun (tekshiruvchi topilmasi, M3-D10): kapsula bosilganda topshiriq-karta yakun
  // sahifasini uzaytirib yuborardi (+247/+147/+99 skroll, variant tanlansa +397) va karta
  // ekran ostida qolardi. Yechim tuzilmaviy: karta sahifaga qo'shilmaydi — RecapOverlay
  // naqshidagi to'liq-ekran qatlamida ochiladi. Sahifa uzunligi o'zgarmaydi => skroll 0;
  // scrollIntoView mitigatsiyasi endi keraksiz.
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
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="hero">
          <div className="hero-l">
            <div className="hero-chips"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span>{!isMentorL && <span className="score-chip fade-up">{correct}/{total} {tr({ uz: "to'g'ri", ru: 'верно' })}</span>}</div>
            <h2 className="title h-title fade-up d1">{tr({ uz: <>Uchta <span className="italic" style={{ color: T.accent }}>chegarangiz</span> yozildi.</>, ru: <>Три ваши <span className="italic" style={{ color: T.accent }}>границы</span> записаны.</> })}</h2>
          </div>
          
        </div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Дождитесь ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        {/* «Endi siz bilasiz» va nishonlar yonma-yon (58-qonun): yakun-sahifasi bir ko'z bilan ko'rinadi. */}
        {isMentorL ? recapCard : (
          <div className="split sum2">
            {recapCard}
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
          </div>
        )}
        <p className="next-note fade-up d4">{tr({ uz: <>🚀 Keyingi dars — <b>O'z Skill'ingizni yozing:</b> AI uchun o'zingiz yo'riqnoma yozib, uni sinab ko'rasiz.</>, ru: <>🚀 Следующий урок — <b>Создаём свой Skill:</b> вы сами напишете инструкцию для AI и проверите её.</> })}</p>
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
        <MentorNote>{tr({ uz: "Arena tugagach podium — g'oliblarni nomlab tabriklang. Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa. Muddat — navbatdagi darsgacha. Tekshirishda bitta savolga qarang: qatorda bitta aniq odam nomlanganmi?", ru: 'После арены — подиум: назовите победителей и поздравьте их. Домашнее задание: тем, кто закончил задание по коду в классе, — полный вариант, кто не успел — короткий. Срок — до следующего урока. При проверке смотрите на один вопрос: назван ли в строке один конкретный человек?' })}</MentorNote>
      </div>
    </Stage>
  );
};
// ============================================================ CSS
const CSS_BASE = `
  html, body { margin: 0; padding: 0; }
  .lesson-root, .lesson-root * { box-sizing: border-box; }
  .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
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
  .head-c { text-align: center; align-items: center; } /* F-1003-04: natija ekrani — bitta o'q */
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
  .hero-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .score-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; font-variant-numeric: tabular-nums; color: ${T.accent}; background: ${T.accentSoft}; padding: 5px 12px; border-radius: 999px; } /* F-1003-04/05: yakunda halqa o'rniga yorliq */
  .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
  .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
  .ring-wrap svg { display: block; width: 100%; height: 100%; }
  .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .ring-num { font-family: 'Source Serif 4', serif; font-size: 30px; font-weight: 500; line-height: 1; }
  .ring-den { color: ${T.ink3}; font-size: 20px; }
  .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
  .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); min-width: 0; overflow-wrap: anywhere; }
  .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
  .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
  .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
  .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; }
  .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; min-width: 0; overflow-wrap: anywhere; }
  .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
  .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
`;
// Dars-vizuallari: xotira tugmalari (imzo-vizual), telefon-maketi, jadval, yozish-kartasi.
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
  .hvote-pct { min-width: 38px; text-align: right; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
  @media (prefers-reduced-motion: reduce) { .hopt, .hvote-fill { transition: none; } }

  /* HOOK yopuvchi qatori: ikkala tanlovda ham AYNAN bir xil natija (104/119-qonun) */
  .h0end { max-width: 720px; align-self: center; width: 100%; }
  /* MAQSAD (s1) — uch qaror-qatori o'z-o'zidan yozilib chiqadi, odam o'sib chiqadi (18-qonun) */
  .s1demo { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 18px; padding: clamp(13px,2vw,18px) clamp(15px,2.4vw,22px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; max-width: 680px; align-self: center; width: 100%; }
  .s1demo-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.accent}; }
  .s1demo-list { display: flex; flex-direction: column; gap: 7px; }
  .s1row { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; background: ${T.bg}; border-radius: 11px; padding: 9px 12px; opacity: 0; animation: s1-in 0.5s cubic-bezier(.3,1.4,.45,1) forwards; animation-delay: var(--dd); min-width: 0; }
  /* 42-qonun: fe'l ↔ ekran jarayoni — chap bo'lak chapdan o'ngga «yozilib chiqadi» */
  .s1row-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; clip-path: inset(0 100% 0 0); animation: s1-write 0.62s ease-out forwards; animation-delay: var(--dd); }
  .s1row-arw { font-style: normal; font-weight: 800; color: ${T.accent}; opacity: 0; animation: s1-ok 0.3s ease-out forwards; animation-delay: var(--dd2); }
  /* Odam-kapsulasi s4 dagidek O'SIB chiqadi — imzo-vizualning sadosi.
     Kengayish clip-path bilan: kapsula chapdan o'ngga QURILADI, matn cho'zilib buzilmaydi. */
  .s1row-b { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 4px 12px; overflow-wrap: anywhere; min-width: 0; opacity: 0; animation: s1-grow 0.5s cubic-bezier(.3,1.25,.45,1) forwards; animation-delay: var(--dd2); }
  .s1row-ok { margin-left: auto; font-size: 15px; opacity: 0; animation: s1-ok 0.4s ease-out forwards; animation-delay: var(--dd3); }
  @keyframes s1-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes s1-write { to { clip-path: inset(0 0 0 0); } }
  @keyframes s1-grow { 0% { opacity: 0; clip-path: inset(0 100% 0 0 round 99px); } 40% { opacity: 1; } 100% { opacity: 1; clip-path: inset(0 0 0 0 round 99px); } }
  @keyframes s1-ok { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) { .s1row, .s1row-ok, .s1row-arw, .s1row-b { animation: none; opacity: 1; clip-path: none; } .s1row-t { animation: none; clip-path: none; } }

  /* TEORIYA-1 (s2): ikki karta — bosilsa ochiladi/yopiladi (46-qonun) */
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
  /* IMZO-VIZUAL (s4): chapda uch ish va ikki tanlov, o'ngda — qaror tegadigan odam */
  .split.s4 { grid-template-columns: minmax(0,1.06fr) minmax(0,0.94fr); }
  @media (max-width: 1000px) { .split.s4 { grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,20px); } }
  /* MOBIL (s4): ustunlar bir-birining ostiga tushganda mexanika MA'NOSI buzilardi — tugmani
     bosgan bola oqibatni ko'rmay qolardi. Shuning uchun ko'zgu tepaga chiqadi va yopishib
     turadi: bosish va o'zgarish bir ko'rish maydonida qoladi. */
  @media (max-width: 860px) {
    .split.s4 > .col:last-child { display: contents; }
    /* Yopishgan ko'zgu tor ekranning yarmidan ko'pini egallamaydi: ichki bo'shliqlar
       qisqaradi va balandlik cheklanadi — chapdagi uch ish doim barmoq ostida qoladi. */
    .split.s4 .mir { order: -1; position: sticky; top: 0; z-index: 4; gap: 7px; padding: 10px 12px; max-height: 52vh; max-height: 52svh; overflow-y: auto; overscroll-behavior: contain; }
    .split.s4 .mir-lgd { font-size: 10.8px; padding: 6px 9px; }
    .split.s4 .mir-h { font-size: 12.5px; }
    .split.s4 .mir-card { padding: 10px 12px; gap: 6px; }
    .split.s4 .mir-card .mir-who { font-size: 14.5px; }
    .split.s4 .mir-empty { padding: 13px 12px; }
  }

  /* SOYA-ZINAPOYASI: .kzg va .mir — L3 (imzo-sahna, darsda YAGONA shu daraja).
     Artefakt-kartalar L2 (0 12px 28px -14px), yo'riq-qatorlar L1.5, chiplar inset-halqa. */
  .kzg { display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border-radius: 18px; padding: clamp(12px,1.9vw,16px); box-shadow: 0 18px 38px -18px rgba(${T.shadowBase},0.32), inset 0 0 0 1.5px ${T.line}; animation: kzg-pulse 1.9s ease-in-out infinite; min-width: 0; }
  .kzg.calm { animation: none; }
  /* Pulsning tinch fazasi resting-soya bilan AYNAN bir xil — karta sakramaydi */
  @keyframes kzg-pulse { 0%, 100% { box-shadow: 0 18px 38px -18px rgba(${T.shadowBase},0.32), inset 0 0 0 1.5px ${T.line}, 0 0 0 0 rgba(91,61,230,0); } 50% { box-shadow: 0 18px 38px -18px rgba(${T.shadowBase},0.32), inset 0 0 0 1.5px ${T.accent}66, 0 0 0 8px rgba(91,61,230,0.08); } }
  @media (prefers-reduced-motion: reduce) { .kzg { animation: none; } }
  .kzg-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.55vw,14px); color: ${T.ink}; }
  .kzg-row { display: flex; flex-direction: column; gap: 6px; background: ${T.bg}; border-radius: 13px; padding: 9px 11px; min-width: 0; box-shadow: inset 0 0 0 1.5px transparent; transition: box-shadow 0.18s; }
  .kzg-row.cur { box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .kzg-h { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .kzg-h i { font-style: normal; font-size: 18px; line-height: 1; flex-shrink: 0; }
  .kzg-opts { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 6px; }
  @media (max-width: 620px) { .kzg-opts { grid-template-columns: minmax(0,1fr); } }
  .kzg-opt { text-align: left; background: ${T.paper}; border: none; border-radius: 10px; padding: 8px 10px; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(11.5px,1.35vw,12.8px); line-height: 1.35; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: background 0.16s, box-shadow 0.16s, color 0.16s, transform 0.12s; min-width: 0; overflow-wrap: anywhere; }
  .kzg-opt:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .kzg-opt:active:not(:disabled) { transform: scale(0.985); }
  .kzg-opt:disabled { cursor: default; }
  .kzg-opt:focus-visible { outline: none; box-shadow: inset 0 0 0 2px ${T.accent}, 0 0 0 4px rgba(91,61,230,0.22); }
  .kzg-opt.ai.on { background: ${T.accentSoft}; color: ${T.ink}; box-shadow: inset 0 0 0 2px ${T.accent}; }
  /* Ikkala tanlov TENG: bu yerda «to'g'ri javob» yo'q (ballanmaydi). Shuning uchun yashil
     EMAS — odam-tanlovi KIM-ko'kida, AI-tanlovi accent-indigoda; ikkalasi ham bir og'irlikda. */
  .kzg-opt.od.on { background: ${T.blueSoft}; color: ${T.ink}; box-shadow: inset 0 0 0 2px ${T.blue}; }
  @media (prefers-reduced-motion: reduce) { .kzg-row, .kzg-opt { transition: none; } }

  /* KO'ZGU (s4 o'ng yarmi) — L3 soya; odam va fakt-qatori harakatdan KEYIN chiqadi */
  .mir { display: flex; flex-direction: column; gap: 9px; background: ${T.ink}; border-radius: 20px; padding: clamp(11px,1.8vw,15px); box-shadow: 0 20px 44px -18px rgba(${T.shadowBase},0.46); min-width: 0; }
  .mir-lgd { font-family: 'Manrope'; font-weight: 700; font-size: clamp(11px,1.25vw,12.2px); line-height: 1.5; color: rgba(255,255,255,0.88); background: rgba(255,255,255,0.08); border-radius: 9px; padding: 7px 10px; min-width: 0; overflow-wrap: anywhere; }
  .mir-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.45vw,13.5px); color: #fff; padding-left: 2px; }
  .mir-card { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 14px; padding: clamp(11px,1.7vw,15px); min-width: 0; animation: mir-in 0.42s cubic-bezier(.3,1.25,.45,1) both; box-shadow: inset 0 0 0 2px transparent; }
  .mir-card.hit { box-shadow: inset 0 0 0 2px ${T.err}55; }
  .mir-card.calm { box-shadow: inset 0 0 0 2px ${T.success}55; }
  @keyframes mir-in { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) { .mir-card { animation: none; } }
  /* §134 legendasi rang-ko'r bolaga ham yetsin: belgi PLITA ustida turadi va plita SHAKLI
     ham farqlanadi — jabr = burchakli plita, tinch = dumaloq plita. Rang ikkinchi signal. */
  .mir-dot { display: inline-flex; align-items: center; justify-content: center; align-self: flex-start; flex-shrink: 0; width: 30px; height: 30px; font-size: 15px; line-height: 1; }
  .mir-card.hit .mir-dot { background: ${T.errSoft}; border-radius: 9px; box-shadow: inset 0 0 0 2px ${T.err}88; }
  .mir-card.calm .mir-dot { background: ${T.successSoft}; border-radius: 50%; box-shadow: inset 0 0 0 2px ${T.success}88; }
  .mir-dot i { display: block; width: 12px; height: 12px; border-radius: 50%; }
  .mir-card.hit .mir-dot i { background: ${T.err}; }
  .mir-card.calm .mir-dot i { background: #fff; box-shadow: inset 0 0 0 1.5px ${T.ink3}; }
  .mir-who { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px,1.85vw,16.5px); line-height: 1.3; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .mir-fact { font-family: 'Manrope'; font-weight: 600; font-size: clamp(12px,1.45vw,13.5px); line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; }
  .mir-empty { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); line-height: 1.5; color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.06); border-radius: 14px; padding: clamp(16px,2.6vw,26px) clamp(12px,1.8vw,16px); text-align: center; min-width: 0; overflow-wrap: anywhere; }

  /* s4 ikkinchi bosqichi: chegara-qarori (bir ekranda YIG'ILMAYDI — mentor-gapi yopiladi) */
  .kzq { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 4px 16px 16px 4px; padding: clamp(11px,1.8vw,15px) clamp(13px,2vw,18px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22); min-width: 0; }
  .kzq-ask { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px,1.85vw,16.5px); line-height: 1.35; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .kzq-chips { display: flex; flex-wrap: wrap; gap: 7px; }
  .kzq-chip { background: ${T.bg}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(11.5px,1.35vw,12.8px); color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: background 0.16s, box-shadow 0.16s, color 0.16s; min-width: 0; overflow-wrap: anywhere; }
  .kzq-chip:hover { background: ${T.accentSoft}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .kzq-res { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .kzq-again { align-self: flex-start; }
  @media (prefers-reduced-motion: reduce) { .kzq-chip { transition: none; } }

  /* TEKSHIRUV (s9): chapda botning to'rt qarori, o'ngda to'rt odam */
  .jft-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.45vw,13.5px); color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
  .jft-col { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
  .jft-wrap { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
  .jft-card { display: flex; align-items: center; gap: 9px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 13px; padding: 10px 12px; cursor: pointer; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.line}; transition: background 0.15s, box-shadow 0.15s, transform 0.12s; min-width: 0; }
  .jft-card:hover:not(:disabled) { box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.accent}66; }
  .jft-card:active:not(:disabled) { transform: scale(0.99); }
  .jft-card:focus-visible { outline: none; box-shadow: inset 0 0 0 2px ${T.accent}, 0 0 0 4px rgba(91,61,230,0.22); }
  .jft-card.sel { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}; }
  /* Chapdan qaror tanlangan lahzada o'ng ustun BIR MARTA yorishadi (navbat-pulsi emas:
     javobni aytib qo'ymasligi uchun hammasi teng va takrorlanmaydi). */
  .jft-card.live { box-shadow: inset 0 0 0 1.5px ${T.accent}66; animation: jft-open 0.5s ease-out; }
  @keyframes jft-open { 0% { box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 0 0 0 rgba(91,61,230,0.26); } 100% { box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 0 0 9px rgba(91,61,230,0); } }
  /* Juftlik topilganda karta «joyiga o'tiradi» — 27-qonun mikro-harakati */
  .jft-card.done { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}; cursor: default; animation: jft-snap 0.34s cubic-bezier(.3,1.5,.45,1); }
  @keyframes jft-snap { 0% { transform: scale(0.965); } 55% { transform: scale(1.02); } 100% { transform: scale(1); } }
  .jft-card:disabled { cursor: default; }
  .jft-ic { font-size: 18px; line-height: 1; flex-shrink: 0; }
  .jft-t { flex: 1; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); line-height: 1.4; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .jft-mark { flex-shrink: 0; font-size: 13px; font-weight: 800; color: ${T.success}; }
  .jft-sabab { margin-left: 27px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(11px,1.3vw,12.2px); line-height: 1.45; color: ${T.ink2}; background: ${T.successSoft}; border-radius: 9px; padding: 6px 10px; min-width: 0; overflow-wrap: anywhere; animation: jft-in 0.3s ease-out both; }
  @keyframes jft-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
  .jft-mrev { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; background: ${T.paper}; border-radius: 14px; padding: 10px 14px; box-shadow: inset 0 0 0 1.5px ${T.line}; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
  @media (prefers-reduced-motion: reduce) { .jft-card, .jft-card.live, .jft-card.done, .jft-sabab { transition: none; animation: none; } .jft-card:active:not(:disabled) { transform: none; } }

  /* KIRISH-ARTEFAKT (s8): o'quvchining o'z varag'i — bitta qator, o'qish holatida */
  .varaq { display: flex; flex-direction: column; gap: 3px; background: ${T.paper}; border-radius: 4px 12px 12px 4px; padding: 9px 13px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.2); max-width: 720px; min-width: 0; }
  .varaq-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.45vw,13.5px); line-height: 1.4; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .varaq-s { font-family: 'Manrope'; font-weight: 600; font-size: clamp(11px,1.3vw,12.2px); color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }

  /* YOZISH-EKRANI (s8): muharrir-kartasi, topshiriq-paneli, yozilganlar ro'yxati */
  /* Fokus-yuza (L2.5): imzo-sahnadan past turadi, boshqa kartalardan esa accent-halqa bilan ajraladi */
  .wsp-ed { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 14px 30px -15px rgba(${T.shadowBase},0.25), inset 0 0 0 2px ${T.accent}44; min-width: 0; }
  .wsp-ed-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; }
  .wsp-q { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink3}; margin-top: 2px; }
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
  .wsp-item-edit { flex-shrink: 0; background: none; border: none; cursor: pointer; font-size: 14px; color: ${T.ink3}; border-radius: 8px; padding: 2px 6px; }
  .wsp-item-edit:hover { color: ${T.accent}; background: ${T.accentSoft}; }
  .wsp-task { display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; border-radius: 14px; padding: 11px 14px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; }
  .wsp-task-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
  .wsp-task-nom { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(15px,2vw,18px); color: ${T.ink}; line-height: 1.25; overflow-wrap: anywhere; min-width: 0; }
  .wsp-chk { display: flex; flex-direction: column; gap: 4px; margin-top: 2px; }
  .wsp-chk-i { display: flex; align-items: flex-start; gap: 7px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(11.5px,1.35vw,12.5px); line-height: 1.4; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; }
  .wsp-chk-i i { font-style: normal; flex-shrink: 0; font-weight: 800; color: ${T.ink3}; }
  .wsp-chk-i.on, .wsp-chk-i.on i { color: ${T.success}; }

  /* BOSQICHLI OCHILISH (94-qonun): uch qadam-doirasi */
  .stps { display: flex; flex-wrap: wrap; gap: 8px; }
  .stp { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 5px 12px 5px 5px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .stp i { font-style: normal; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${T.bg}; color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 11px; }
  .stp.on { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .stp.on i { background: ${T.accent}; color: #fff; }
  .stp.done { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .stp.done i { background: ${T.success}; color: #fff; }

  /* 81-qonun: maydon-signallari MA'NO rangida (qizil hech qachon). */
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

  /* XULOSA-KARTASI (s2) va yordamchi qatorlar */
  /* Bosqich-qaytish tugmasi (PmLesson20 s2 dan) — xulosa-fazadan kartalarga qaytadi */
  .nextsig { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border: none; border-radius: 10px; padding: 8px 15px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.accent}44; }
  .nextsig:hover { background: ${T.accent}; color: #fff; }
  .xul { background: ${T.paper}; border-radius: 14px; padding: clamp(13px,2vw,18px); display: flex; flex-direction: column; gap: 7px; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.2); }
  .xul-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; }
  .xul-b { margin: 0; font-size: clamp(13.5px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
  .xul-lv { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
  .xul-lv li { display: flex; align-items: flex-start; gap: 8px; font-size: clamp(13.5px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
  .xul-lv li i { font-style: normal; flex: none; }
  .next-note { margin: 0; text-align: center; font-size: clamp(13px,1.5vw,14.5px); line-height: 1.45; color: ${T.ink2}; }
  .next-note b { color: ${T.ink}; }
  .bhint { margin: 0; align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 9px; padding: 7px 12px; min-width: 0; overflow-wrap: anywhere; }
  .bdone { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }

  /* KODING darvoza-mashqi (82e) va kompilyator launch-kartasi */
  .gt-rows { display: flex; flex-direction: column; gap: 7px; }
  .fchoice { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); border: none; border-radius: 12px; padding: 10px 14px; background: ${T.paper}; color: ${T.ink}; cursor: pointer; text-align: left; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.16s; max-width: 100%; min-width: 0; overflow-wrap: anywhere; }
  .fchoice:hover { box-shadow: inset 0 0 0 1.5px ${T.accent}66; transform: translateY(-1px); }
  .fchoice.miss { background: ${T.errSoft}; color: ${T.err}; box-shadow: inset 0 0 0 2px ${T.err}; animation: cmt-shake 0.4s ease; }
  @keyframes cmt-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 55% { transform: translateX(5px); } 80% { transform: translateX(-2px); } }
  .cmt { background: ${T.bg}; border-radius: 13px; padding: 11px 13px; display: flex; flex-direction: column; gap: 9px; }
  .cmt.hunt { animation: cmt-hunt 1.7s ease-in-out infinite; }
  .cmt.calm { animation: none; }
  @keyframes cmt-hunt { 0%, 100% { box-shadow: 0 0 0 0 rgba(110,75,255,0.4); } 50% { box-shadow: 0 0 0 9px rgba(110,75,255,0); } }
  .cmt-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.ink}; }
  .cmt-fold { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; background: ${T.successSoft}; border-radius: 99px; padding: 7px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; max-width: 100%; min-width: 0; overflow-wrap: anywhere; }
  .cmt-done { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.5vw,13.5px); color: ${T.success}; animation: fade-step 0.3s ease-out; }
  .cmt-tip { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13px); line-height: 1.45; color: ${T.ink2}; background: ${T.accentSoft}; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; animation: fade-step 0.3s ease-out; }
  @media (prefers-reduced-motion: reduce) { .cmt.hunt, .cmt-tip, .cmt-done, .fchoice.miss { animation: none; } .fchoice, .fchoice:hover { transition: none; transform: none; } }
  .kdpanel { position: relative; background: ${T.paper}; border-radius: 16px; padding: 11px 13px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.18); min-width: 0; transition: border-color 0.3s; }
  /* F-0926-05 #16: yashil ramka olindi — holatni tugma yoki yozuv aytadi */
  /* F-1003-21: umumiy ol{padding:0} chekinishni yeb qo'yardi — raqam-belgili qatorlar (8-dars naqshi) */
  .lesson-root ol.kdreq { margin: 0; padding-left: 0; list-style: none; counter-reset: kd; display: flex; flex-direction: column; gap: 5px; }
  .kdreq li { counter-increment: kd; display: flex; align-items: flex-start; gap: 8px; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; background: ${T.bg}; border-radius: 9px; padding: 6px 10px; min-width: 0; overflow-wrap: anywhere; }
  .kdreq li::before { content: counter(kd); flex-shrink: 0; width: 17px; height: 17px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 10.5px; display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
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
  /* Uy-vazifa qatlami (RecapOverlay .rc-overlay naqshi) — karta sahifani uzaytirmaydi */
  .hw-ov { position: fixed; inset: 0; z-index: 10005; background: ${T.bg}; display: flex; align-items: center; justify-content: center; padding: clamp(14px,3vw,32px); overflow-y: auto; animation: fade-step 0.3s ease-out; font-family: 'Manrope', sans-serif; }
  .hw-ov-in { position: relative; width: 100%; max-width: 680px; min-width: 0; }
  .hw-ov-x { position: absolute; top: -6px; right: 0; transform: translateY(-100%); }
  @media (max-height: 720px) { .hw-ov { align-items: flex-start; } .hw-ov-x { top: 0; right: 0; transform: none; z-index: 2; } }
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
  .pod-solo { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
  .pod-solo-sec { background: ${T.paper}; border-radius: 14px; padding: 12px 18px; display: flex; flex-direction: column; align-items: center; gap: 8px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); }
  .pod-solo-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  .pod-solo-badges { display: flex; gap: 9px; align-items: center; }
  .pod-solo-b { font-size: 24px; line-height: 1; }
  .pod-solo-b:not(.got) { filter: grayscale(1) opacity(0.45); font-size: 18px; }

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

  /* 58/60-qonun (past ekran: 1280x800 va 1440x900) — yakun-sahifasi BIR KO'Z bilan sig'sin.
     Qisqaradigan narsa faqat BO'SHLIQ: so'z kattaliklari o'z joyida, CODE STRIKE so'ziga
     esa umuman tegilmaydi (20-qonun). Katta ekranda (2560x1440) hech narsa o'zgarmaydi. */
  @media (max-height: 900px) {
    .ring-wrap { width: 104px; height: 104px; }
    .ring-num { font-size: 26px; }
    .ring-den { font-size: 17px; }
    .card { padding: 12px 16px; }
    .card-lbl { margin-bottom: 7px; }
    .recap { gap: 6px; }
    .ach-coll { gap: 8px; }
    .ach-grid { gap: 8px; }
    .ach-badge { padding: 9px 8px; }
    .cs-cta .cs-cap { padding: clamp(10px,1.4vw,15px) clamp(18px,2.6vw,32px); gap: clamp(3px,0.5vw,6px); }
    .cs-hud-i { padding: 4px 12px; }
    .cs-enter { font-size: clamp(12px,1.5vw,14px); }
    .hw-big { padding: clamp(13px,1.8vw,17px) clamp(26px,3.4vw,44px); gap: 4px; }
    .hw-big-t { font-size: clamp(21px,2.8vw,26px); }
    .hw-big-s { font-size: clamp(13px,1.7vw,15px); }
    /* s9 juftlash: to'rt sabab-qatori ochilganda ham ekran BUTUN qoladi */
    .jft-card { padding: 8px 11px; }
    .jft-col { gap: 6px; }
    .jft-wrap { gap: 4px; }
    .jft-sabab { padding: 5px 9px; }
    /* Uyga-vazifa kartasi ochilganda: bo'shliqlar yig'iladi (77-qonun avto-siljishi bilan juft) */
    .hw-chips { gap: 8px; margin-bottom: 8px; }
    .hw-chip { padding: 8px 15px; font-size: clamp(12.5px,1.5vw,14px); }
    .pmtask-head { padding: 8px 14px; }
    .pmtask-row { padding: 7px 14px; }
    .pmtask-steps { gap: 7px; padding: 10px 14px 12px; }
  }

  /* 58-qonun (past ekran 1280x800) — nishon olingach tavsif ochiladi va nishon-kartochka
     bo'yiga cho'ziladi (4 nishonda +47px skroll). Tavsif 👦 uchun ZARUR: nishon nomini
     u faqat tavsif bilan tushunadi — shuning uchun MATN qisqarmaydi, JOYLASHUV yig'iladi:
     ikonka chapga chiqadi, nom + tavsif o'ng ustunda ustma-ust turadi (indeks-karta qatori).
     900px bo'yli ekranda ustunli ko'rinish o'z joyida qoladi. */
  @media (max-height: 850px) {
    .ring-wrap { width: 94px; height: 94px; }
    .cs-cta .cs-cap { padding: clamp(9px,1.2vw,12px) clamp(16px,2.4vw,28px); }
    /* qolgan bo'shliqlar ham yig'iladi — so'z kattaliklariga tegilmaydi */
    .split.sum2 .card { padding: 10px 14px; }
    .split.sum2 .card-lbl { margin-bottom: 5px; }
    .split.sum2 .recap { gap: 5px; }
    .hw-big { padding: 12px clamp(26px,3.4vw,44px); }
    .split.sum2 .ach-badge { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; column-gap: 9px; row-gap: 1px; text-align: left; padding: 8px 10px; }
    .split.sum2 .ach-badge-ic { grid-column: 1; grid-row: 1 / span 2; font-size: 23px; }
    .split.sum2 .ach-badge.locked .ach-badge-ic { font-size: 18px; }
    .split.sum2 .ach-badge-name { grid-column: 2; }
    .split.sum2 .ach-badge-desc { grid-column: 2; }
  }

`;
// ============================================================ LESSON ROOT
export default function PmLesson23({ lang: langProp, onFinished, liveToken }) {
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
