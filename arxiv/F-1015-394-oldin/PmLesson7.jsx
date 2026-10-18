

































import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM 7-DARS (Modul 3 · PM1) — USER STORY: KIM VA NIMA UCHUN? — PLATFORM STANDARD v16
// G'oya: fychani emas — foydalanuvchining ASL ishini (job) tushunish.
// Qolip: "[foydalanuvchi] sifatida, men [harakat]ni xohlayman, [natija] uchun".
// Jobs-to-be-Done: odam parmani emas — teshikni xohlaydi (mahsulotni ishni bajarish uchun "yollaydi").
// React bog'lanish: har user story → bitta komponent/feature.
// Yuguruvchi abrazets (MATN_KORPUS §13 — bitta real mahsulot, o'smir hayotidan KIM):
//   "Imtihonga tayyorlanayotgan o'quvchi sifatida, men videoni 2 barobar tez ko'rishni
//    xohlayman, bir kechada ko'proq mavzuga ulgurish uchun."
// Shu namuna darsning HAMMA ekranida bir xil ushlanadi — o'quvchi bitta naqshga taqlid qiladi.
// AUDIOSIZ — ovoz yo'q, faqat matn va animatsiya.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  honey: '#E0892B', honeySoft: '#FBEFDD', grape: '#7B3FE4', grapeSoft: '#EFE9FB',
  shadowBase: '58, 53, 48'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };
const G = "Georgia, serif";

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
// Payload/analitika doim UZ-etalon (RU_I18N_SPEC 5-Modul konvensiyasi)
const ouz = (o) => (o && typeof o === 'object' && !React.isValidElement(o) && o.uz !== undefined) ? o.uz : o;
const MentorCtx = createContext(null);

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

// ===== IKONKALAR =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  x: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.2}><path d="M6 6l12 12M18 6L6 18" /></svg>),
  arrow: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={1.9}><path d="M4 12h14" /><path d="M13 6l6 6-6 6" /></svg>),
  user: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-3.6 3.2-5.8 7-5.8s7 2.2 7 5.8" /></svg>),
  problem: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1 .9-1 1.7" /><path d="M12 16.7h.01" /></svg>),
  chat: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M4 5h16v11H9l-4 4v-4H4z" /></svg>),
  // real ilovalar (rol + ish uchun)
  youtube: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><rect x="2" y="5" width="20" height="14" rx="4.2" fill="#FF0000" /><path d="M10 8.6v6.8L15.8 12z" fill="#fff" /></svg>),
  taxi: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><path d="M4 16.2l1.5-4.9A2.5 2.5 0 0 1 7.9 9.6h8.2a2.5 2.5 0 0 1 2.4 1.7l1.5 4.9v3a.8.8 0 0 1-.8.8h-1.5a.8.8 0 0 1-.8-.8V19H6.6v.2a.8.8 0 0 1-.8.8H4.3a.8.8 0 0 1-.8-.8z" fill="#FFB300" /><rect x="9" y="6.4" width="6" height="2.6" rx="0.5" fill="#222" /><circle cx="7.6" cy="16.4" r="1.15" fill="#222" /><circle cx="16.4" cy="16.4" r="1.15" fill="#222" /></svg>),
  market: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><path d="M5 9.5h14V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" fill="#7B3FE4" fillOpacity="0.18" /><path d="M3.4 5.5h17.2l1.05 3.3a2.25 2.25 0 0 1-4.35.55 2.25 2.25 0 0 1-4.3 0 2.25 2.25 0 0 1-4.3 0 2.25 2.25 0 0 1-4.35-.55z" fill="#7B3FE4" /><rect x="9.7" y="13" width="4.6" height="7" rx="0.8" fill="#7B3FE4" /></svg>),
  telegram: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><circle cx="12" cy="12" r="11" fill="#29A9EB" /><path d="M17.9 7.2l-2.05 9.4c-.15.68-.56.84-1.13.52l-3.1-2.28-1.5 1.44c-.16.16-.3.3-.62.3l.22-3.1 5.68-5.13c.25-.22-.05-.34-.38-.12l-7 4.42-3.02-.94c-.66-.2-.67-.66.14-.97l11.8-4.55c.55-.2 1.03.13.98.49z" fill="#fff" /></svg>)
};

// PM-7 belgilar: kursor (harakat), nishon (natija), parma + teshik (JTBD), hikoya
const p7sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const p7 = {
  cursor: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p7sv}><path d="M5 3l5.5 15 2.2-6 6-2.2z" /></svg>),
  target: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p7sv}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></svg>),
  drill: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p7sv}><path d="M3 8.5h8v6H3z" /><path d="M11 10h3.5l3.5-1.5v7L14.5 14H11" /><path d="M5.5 14.5V18h3.5v-3.5" /></svg>),
  hole: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p7sv}><rect x="4" y="4" width="16" height="16" rx="1.5" /><circle cx="12" cy="10.5" r="1.7" /><path d="M12 10.5l3.5 7h-7z" /></svg>),
  story: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p7sv}><path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4z" /><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" /></svg>),
  spark: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p7sv}><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1" /></svg>)
};

// ---- Sahifa-holat saqlovi (F-0730-01): reload'da o'quvchi o'z ekraniga qaytadi.
// TTL 6 soat (kechagi chala urinish bugungi darsga aralashmasin); ekran soni
// o'zgargan bo'lsa saqlov bekor; har qanday xatoda jimgina 0-ekrandan boshlanadi.
const PROG_TTL_MS = 6 * 60 * 60 * 1000;
const _progKey = (id) => `ccProgress:${id}`;
const progRead = (id, total) => {
  try {
    const p = JSON.parse(localStorage.getItem(_progKey(id)) || 'null');
    if (!p || p.total !== total || Date.now() - (p.savedAt || 0) > PROG_TTL_MS) return null;
    return p;
  } catch { return null; }
};
const progWrite = (id, o) => { try { localStorage.setItem(_progKey(id), JSON.stringify(o)); } catch {} };
const progClear = (id) => { try { localStorage.removeItem(_progKey(id)); } catch {} };
/* F-0927 (PM7, foydalanuvchi): asosiy .btn qora (T.ink) edi → accent (159/5); faqat shu qator o'zgardi */
const LESSON_META = { lessonId: 'pm-user-story-07-v16', lessonTitle: { uz: 'User Story — kim va nima uchun', ru: 'User Story — кто и зачем' } };
const HW_TOKENS = [
  { t: { uz: 'amaliyot', ru: 'практика' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'loyiha', ru: 'проект' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'mashq', ru: 'упражнение' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'natija', ru: 'результат' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5b', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's13', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// ===== KONSEPT LEKSIKONI =====
// User Story 3 bo'lagi
const PARTS = [
  { key: 'kim', label: { uz: 'KIM', ru: 'КТО' }, color: T.honey, ic: Ico.user(18), job: { uz: 'Foydalanuvchi roli — bu odam qanday holatda? "Foydalanuvchi" emas, aniq odam.', ru: 'Роль пользователя — в какой ситуации этот человек? Не «пользователь», а конкретный человек.' }, ex: { uz: 'Imtihonga tayyorlanayotgan o\'quvchi sifatida', ru: 'Как ученик, который готовится к экзамену' } },
  { key: 'harakat', label: { uz: 'HARAKAT', ru: 'ДЕЙСТВИЕ' }, color: T.blue, ic: p7.cursor(18), job: { uz: 'U ilovada aynan nima qilmoqchi — bitta aniq harakat.', ru: 'Что именно он хочет сделать в приложении — одно конкретное действие.' }, ex: { uz: 'men videoni 2 barobar tez ko\'rishni xohlayman', ru: 'я хочу смотреть видео в 2 раза быстрее' } },
  { key: 'natija', label: { uz: 'NATIJA (nima uchun)', ru: 'РЕЗУЛЬТАТ (зачем)' }, color: T.grape, ic: p7.target(18), job: { uz: 'Shu harakatdan keyin uning hayotida nima o\'zgaradi.', ru: 'Что изменится в его жизни после этого действия.' }, ex: { uz: 'bir kechada ko\'proq mavzuga ulgurish uchun', ru: 'чтобы за один вечер успеть пройти больше тем' } }
];
const PMETA = {}; PARTS.forEach(p => { PMETA[p.key] = p; });

// Real ilovalar: rol + ASL ish (Jobs-to-be-Done)
const APPS = {
  youtube: { ic: Ico.youtube(26), name: 'YouTube', role: { uz: 'O\'quvchi', ru: 'Ученик' }, job: { uz: 'biror narsani video orqali tez o\'rganmoqchi.', ru: 'хочет быстро чему-то научиться по видео.' } },
  taxi: { ic: Ico.taxi(26), name: { uz: 'Taksi', ru: 'Такси' }, role: { uz: 'Yo\'lovchi', ru: 'Пассажир' }, job: { uz: 'kutmasdan, tez va xavfsiz manzilga yetib olmoqchi.', ru: 'хочет без ожидания, быстро и безопасно доехать до места.' } },
  market: { ic: Ico.market(26), name: { uz: 'Bozor', ru: 'Барахолка' }, role: { uz: 'Sotuvchi', ru: 'Продавец' }, job: { uz: 'ortiqcha narsasini tez sotib, pul ishlamoqchi.', ru: 'хочет быстро продать ненужную вещь и заработать.' } },
  telegram: { ic: Ico.telegram(26), name: 'Telegram', role: { uz: 'Do\'st', ru: 'Друг' }, job: { uz: 'uzoqdagi yaqini bilan bir zumda, bepul gaplashmoqchi.', ru: 'хочет мгновенно и бесплатно поговорить с близким, который далеко.' } }
};

// Darsning yuguruvchi namunasi — bitta joyda turadi, hamma ekran shundan oziqlanadi
const HERO = {
  noaniq: 'Videoni tezlashtiraylik.',
  kim: 'Imtihonga tayyorlanayotgan o\'quvchi',
  harakat: 'videoni 2 barobar tez ko\'rish',
  natija: 'bir kechada ko\'proq mavzuga ulgurish'
};
const HERO_LINE = `${HERO.kim} sifatida, men ${HERO.harakat}ni xohlayman, ${HERO.natija} uchun.`;
// UZ-RU: yuguruvchi namunaning ruscha egizagi (UZ HERO bayt-aynan qoladi). Ruscha qolip: «Как [кто], я хочу [действие], чтобы [результат].»
const HERO_RU = {
  noaniq: 'Давайте ускорим видео.',
  kim: 'ученик, который готовится к экзамену',
  harakat: 'смотреть видео в 2 раза быстрее',
  natija: 'за один вечер успеть пройти больше тем'
};
const HERO_LINE_RU = `Как ${HERO_RU.kim}, я хочу ${HERO_RU.harakat}, чтобы ${HERO_RU.natija}.`;

const Split = ({ children, refEl }) => <div className="split" ref={refEl}>{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic; // F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi
  const padH = isMobile ? 12 : 100;
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
            <div className="chrome-left eyebrow"><span className="dot" /><span>{tr(eyebrow)}</span></div>
            <div className="mono small" style={{ color: T.ink3 }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
          </div>
        </div>
        <div ref={contentRef} onClick={onContentClick} onScroll={onContentScroll} className={`stage-content ${narrow ? 'narrow' : ''}`} style={{ paddingLeft: padH, paddingRight: padH }}>{children}</div>
        {navContent && <div className="stage-nav" style={{ paddingLeft: padH, paddingRight: padH }}>{navContent}</div>}
      </div>
    </MentorCtx.Provider>
  );
};
const NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Orqaga', ru: 'Назад' })}</button>;
const NavNext = ({ disabled, label = { uz: 'Davom etish', ru: 'Продолжить' }, onClick }) => <button className="btn-white-accent" disabled={disabled} onClick={onClick} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{tr(label)}</button>;

const FeedbackBlock = ({ show, isCorrect, children }) => {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (show) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => { setVisible(true); setTimeout(() => { if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 350); })); }
    else { setVisible(false); const t = setTimeout(() => setMounted(false), 400); return () => clearTimeout(t); }
  }, [show]);
  if (!mounted) return null;
  return <div ref={ref} className={`feedback-block ${visible ? 'visible' : ''}`}><div className={isCorrect ? 'frame-success' : 'frame-soft'}>{children}</div></div>;
};

const QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  const pick = (i) => {
    if (solved) return;
    setPicked(i);
    const isCorrect = i === correctIdx;
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect;
    if (isCorrect) setSolved(true);
    onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ouz), correctIndex: correctIdx, correctAnswer: ouz(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ouz(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
  };
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!solved} label={solved ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' }} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: picked !== null ? 8 : 11 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (solved) { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; }
            else if (i === picked) cls += ' option-picked-wrong';
            return (
              <button key={i} className={cls} disabled={solved} onClick={() => pick(i)} style={{ padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && i === correctIdx ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{tr(opt)}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: solved ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}</p>
          <p className="body" style={{ margin: 0 }}>{solved ? tr(explainCorrect) : tr(explainWrong[picked] ?? explainWrong.default)}</p>
        </FeedbackBlock>
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
        <span className="mentor-name">Mentor{collapsed && <span className="mentor-cue">{tr({ uz: " · ko'rsatmani ochish ▾", ru: ' · открыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

const Q = ({ children, max = 760 }) => <h2 className="title h-ask fade-up" style={{ maxWidth: max }}>{children}</h2>;
const IcoChip = ({ color = T.accent, soft = T.accentSoft, children, size = 46 }) => (
  <span style={{ width: size, height: size, borderRadius: 13, background: soft, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{children}</span>
);

const MentorCollapseScroll = ({ targetRef }) => {
  const ctx = useContext(MentorCtx) || {};
  const prev = useRef(false);
  useEffect(() => {
    if (ctx.enabled && ctx.collapsed && !prev.current && targetRef && targetRef.current) {
      const el = targetRef.current;
      setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 420);
    }
    prev.current = !!ctx.collapsed;
  }, [ctx.collapsed, ctx.enabled, targetRef]);
  return null;
};

// Qora "ro'yxat" kartasi (umumiy)
const SpecCard = ({ items, minH = 200, title = { uz: 'Ro\'yxat', ru: 'Список' }, icon }) => (
  <div className="spec-card" style={{ minHeight: minH }}>
    <div className="spec-head"><span style={{ display: 'inline-flex', color: '#9FB4D8' }}>{icon || p7.story(15)}</span><span className="spec-title">{tr(title)}</span></div>
    {items.map((it, i) => (
      <div key={i} className={it.text ? 'feat-pop' : ''}>
        {it.label && <span className="spec-lbl" style={{ color: it.color || '#9FB4D8' }}>{it.label}</span>}
        <p className="spec-text" style={{ color: it.text ? '#E8E5DD' : '#6B7585', fontStyle: it.text ? 'normal' : 'italic' }}>{it.text || tr(it.ph)}</p>
      </div>
    ))}
  </div>
);

// ===== SIGNATURE: User Story jonli yig'iladigan karta =====
const StoryFrag = ({ text, color, ph }) => (
  <span className={text ? 'feat-pop' : ''} style={{ display: 'inline', color: text ? color : '#6B7585', fontStyle: text ? 'normal' : 'italic', fontWeight: text ? 700 : 400 }}>{tr(text) || tr(ph)}</span>
);
const StoryCard = ({ kim, harakat, natija, minH = 150 }) => (
  <div className="spec-card" style={{ minHeight: minH, justifyContent: 'center' }}>
    <div className="spec-head"><span style={{ display: 'inline-flex', color: '#9FB4D8' }}>{p7.story(15)}</span><span className="spec-title">User Story</span></div>
    <p style={{ fontFamily: G, fontSize: 'clamp(14.5px,2vw,17px)', lineHeight: 1.75, color: '#E8E5DD', margin: '4px 0 0' }}>
      {tr({ uz: <><StoryFrag text={kim} color="#FFCB6B" ph="[kim]" /> sifatida, men <StoryFrag text={harakat} color="#82AAFF" ph="[harakat]" />ni xohlayman, <StoryFrag text={natija} color="#C792EA" ph="[natija]" /> uchun.</>, ru: <>Как <StoryFrag text={kim} color="#FFCB6B" ph="[кто]" />, я хочу <StoryFrag text={harakat} color="#82AAFF" ph="[действие]" />, чтобы <StoryFrag text={natija} color="#C792EA" ph="[результат]" />.</> })}
    </p>
  </div>
);

const Zoomable = ({ children }) => {
  const [big, setBig] = useState(false);
  useEffect(() => {
    if (!big) return;
    const onKey = (e) => { if (e.key === 'Escape') setBig(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [big]);
  return (
    <>
      {big && <div className="zoom-backdrop" onClick={() => setBig(false)} />}
      <div className={`zoomable ${big ? 'zoom-on' : ''}`}>
        <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>
        {children}
      </div>
    </>
  );
};

// ===== SCREEN 0 — HOOK =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [mode, setMode] = useState('vague');
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const OPTS = [
    { id: 'a', label: { uz: 'Qisqaroq bo\'lgani uchun', ru: 'Потому что короче' } },
    { id: 'b', label: { uz: 'Kim, nima va nima uchun — aniq aytgani uchun', ru: 'Потому что чётко сказано: кто, что и зачем' } },
    { id: 'c', label: { uz: 'Farqi yo\'q, ikkalasi bir xil', ru: 'Разницы нет, они одинаковые' } }
  ];
  const pick = (id) => { if (picked !== null) return; setPicked(id); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: true }); };
  return (
    <Stage eyebrow={{ uz: 'Kirish', ru: 'Вступление' }} screen={screen} navContent={<NavNext disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr({ uz: <>Bir buyruq berdingiz — <span className="italic" style={{ color: T.accent }}>to'g'ri</span> narsa qilinadimi?</>, ru: <>Вы дали задачу — сделают ли <span className="italic" style={{ color: T.accent }}>то, что нужно</span>?</> })}</h1>
        <Mentor>{tr({ uz: <>Jamoada kimdir "videoni tezlashtiraylik" dedi. Ikki xil buyruq bor — birini bosing va <b style={{ color: T.ink }}>nima</b> qurilganini ko'ring.</>, ru: <>В команде кто-то сказал: «давайте ускорим видео». Есть две формулировки задачи — нажмите на любую и посмотрите, <b style={{ color: T.ink }}>что</b> в итоге сделали.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${mode === 'vague' ? 'chip-on' : ''}`} onClick={() => setMode('vague')}>{tr({ uz: 'Noaniq buyruq', ru: 'Размытая задача' })}</button>
              <button className={`chip ${mode === 'story' ? 'chip-on' : ''}`} onClick={() => setMode('story')}>User Story</button>
            </div>
            <div key={mode} className="demo-swap" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: T.bg, borderRadius: 10, padding: '10px 13px', border: `1px dashed ${T.ink3}` }}>
                <span className="mono small" style={{ color: T.ink3 }}>{tr({ uz: 'BUYRUQ', ru: 'ЗАДАЧА' })}</span>
                <p style={{ fontFamily: G, fontSize: 'clamp(13px,1.7vw,15px)', color: T.ink, margin: '3px 0 0' }}>{mode === 'vague' ? tr({ uz: `"${HERO.noaniq}"`, ru: `«${HERO_RU.noaniq}»` }) : tr({ uz: `"${HERO_LINE}"`, ru: `«${HERO_LINE_RU}»` })}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', color: T.ink3, transform: 'rotate(90deg)' }}>{Ico.arrow(16)}</div>
              <div style={{ background: T.paper, borderRadius: 12, padding: '14px', boxShadow: `0 8px 20px -8px rgba(${T.shadowBase},0.16)`, borderLeft: `4px solid ${mode === 'story' ? T.success : T.accent}` }}>
                <span className="mono small" style={{ color: mode === 'story' ? T.success : T.accent }}>{tr({ uz: 'NIMA QURILDI', ru: 'ЧТО СДЕЛАЛИ' })}</span>
                {mode === 'vague' ? (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: T.accent, color: '#fff', fontWeight: 800, fontSize: 14.5, padding: '12px 22px', borderRadius: 8, transform: 'rotate(-4deg)' }}>{tr({ uz: 'YUKLASH TEZLIGI', ru: 'СКОРОСТЬ ЗАГРУЗКИ' })}</span>
                    <p className="small" style={{ color: T.accent, margin: '4px 0 0', fontStyle: 'italic', textAlign: 'center' }}>{tr({ uz: "Video tez yuklanadigan bo'ldi — ammo o'quvchi buni so'ramagan edi.", ru: 'Видео стало быстрее загружаться — но ученик просил не об этом.' })}</p>
                  </div>
                ) : (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.bg, borderRadius: 8, padding: '8px 11px' }}><span style={{ display: 'inline-flex' }}>{Ico.youtube(18)}</span><span style={{ fontFamily: G, fontSize: 13, color: T.ink2 }}>{tr({ uz: 'Video sahifasi', ru: 'Страница видео' })}</span><span style={{ marginLeft: 'auto', background: T.success, color: '#fff', fontFamily: "'Manrope'", fontWeight: 700, fontSize: 11.5, padding: '6px 11px', borderRadius: 7, display: 'inline-flex', alignItems: 'center', gap: 5 }}>{p7.cursor(12)} {tr({ uz: '2× tezlik', ru: 'скорость 2×' })}</span></div>
                    <p className="small" style={{ color: T.success, margin: '6px 0 0', fontStyle: 'italic' }}>{tr({ uz: "Aynan o'sha o'quvchiga kerak bo'lgan narsa chiqdi.", ru: 'Получилось именно то, что нужно этому ученику.' })}</p>
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: "Qaysi buyruq to'g'ri narsa quradi?", ru: 'С какой задачей сделают то, что нужно?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => { const on = picked === o.id; return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>); })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Noaniq buyruq → noto'g'ri narsa. <b>Kim · nima · nima uchun</b> aytilsa — aynan kerakli narsa qilinadi. Buni <b>User Story</b> deyiladi.</>, ru: <>Размытая задача → не то, что нужно. Если сказать <b>кто · что · зачем</b> — сделают именно нужное. Это называется <b>User Story</b>.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (JTBD: parma → teshik) =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: 'Foydalanuvchining ASL ishini (job) toping', ru: 'Найдите НАСТОЯЩУЮ задачу (job) пользователя' }, tag: '' },
    { text: { uz: 'User Story: kim · harakat · natija', ru: 'User Story: кто · действие · результат' }, tag: '' },
    { text: { uz: 'Noaniq so\'rovni User Story\'ga aylantiring', ru: 'Превратите размытую просьбу в User Story' }, tag: '' },
    { text: { uz: 'Kuchli va zaif user story\'ni ajratish', ru: 'Отличать сильную user story от слабой' }, tag: { uz: 'mashq', ru: 'упражнение' } },
    { text: { uz: 'O\'z loyihangiz uchun 5 user story yozasiz', ru: 'Напишете 5 user story для своего проекта' }, tag: { uz: 'amaliyot', ru: 'практика' } }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const IdeaBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "Bugungi asosiy g'oya", ru: 'Главная идея урока' })}</p>
      <div className="fade-up frame" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(16px,2.5vw,22px)', justifyContent: 'center' }}>
        <span style={{ color: T.ink3, display: 'inline-flex' }}>{p7.drill(34)}</span>
        <span style={{ color: T.ink3, display: 'inline-flex' }}>{Ico.x(16)}</span>
        <span style={{ color: T.success, display: 'inline-flex' }}>{p7.hole(34)}</span>
        <span style={{ color: T.success, display: 'inline-flex' }}>{Ico.check(18)}</span>
      </div>
      <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>Odam parmani emas — teshikni xohlaydi.</b> Foydalanuvchi mahsulotni <b>ishni bajarish</b> uchun "yollaydi". Buni <b>Jobs-to-be-Done</b> deyiladi.</>, ru: <><b>Человеку нужна не дрель, а дырка в стене.</b> Пользователь «нанимает» продукт, чтобы <b>сделать дело</b>. Это называется <b>Jobs-to-be-Done</b>.</> })}</p>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: '→ Har User Story → bitta React komponent/fycha', ru: '→ Каждая User Story → один React-компонент/фича' })}</p>
    </Col>
  );
  const StepsBlock = (<Col><p className="flow-label">{tr({ uz: '5 qadam', ru: '5 шагов' })}</p><ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span>{s.tag && <span className="step-tag">{tr(s.tag)}</span>}</span></li>))}</ol></Col>);
  return (
    <Stage eyebrow={{ uz: 'Reja', ru: 'План' }} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up"><span className="italic" style={{ color: T.accent }}>{tr({ uz: 'Foydalanuvchi aslida nima ishni qildirmoqchi?', ru: 'Какую задачу пользователь на самом деле хочет решить?' })}</span></h2></div>
        <Mentor>{tr({ uz: <>Komponent qurishdan oldin so'rang: bu <b style={{ color: T.ink }}>kimga</b> va <b style={{ color: T.ink }}>qanday ish</b> uchun? Buni <b style={{ color: T.ink }}>User Story</b> bilan yozamiz.</>, ru: <>Прежде чем делать компонент, спросите: это <b style={{ color: T.ink }}>для кого</b> и <b style={{ color: T.ink }}>для какой задачи</b>? Это мы запишем в виде <b style={{ color: T.ink }}>User Story</b>.</> })}</Mentor>
        {!isNarrow ? (<Zoomable><Split>{IdeaBlock}{StepsBlock}</Split></Zoomable>) : !showSteps ? (<div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{IdeaBlock}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "5 qadamni ko'rish", ru: 'Посмотреть 5 шагов' })}</button></div>) : (<div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ G'oyani ko'rish", ru: '↩ Посмотреть идею' })}</button>{StepsBlock}</div>)}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — REAL ILOVALAR: rol + ASL ish =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const KEYS = Object.keys(APPS);
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(storedAnswer ? new Set(KEYS) : new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= KEYS.length;
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = active ? APPS[active] : null;
  return (
    <Stage eyebrow={{ uz: 'ASL ish (job)', ru: 'Настоящая задача (job)' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `${seen.size}/4 ko'ring`, ru: `Посмотрите ${seen.size}/4` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Odamlar bu ilovalarni qaysi <span className="italic" style={{ color: T.accent }}>ish</span> uchun "yollaydi"?</>, ru: <>Для какой <span className="italic" style={{ color: T.accent }}>задачи</span> люди «нанимают» эти приложения?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har ilova ortida foydalanuvchining bitta <b style={{ color: T.ink }}>ASL ishi</b> bor. Bittasini bosib, kim va qanday ishni ko'ring.</>, ru: <>За каждым приложением стоит одна <b style={{ color: T.ink }}>НАСТОЯЩАЯ задача</b> пользователя. Нажмите на любое и посмотрите: кто и какая задача.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {KEYS.map(k => (<button key={k} onClick={() => tap(k)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', border: 'none', borderRadius: 13, padding: '13px 12px', background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -7px rgba(255,79,40,0.22)` : `0 6px 16px -8px rgba(${T.shadowBase},0.16)`, transition: 'all 0.18s' }}><span style={{ display: 'inline-flex' }}>{APPS[k].ic}</span><span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13.5, color: T.ink }}>{tr(APPS[k].name)}</span>{seen.has(k) && <span style={{ marginLeft: 'auto', color: T.success, display: 'inline-flex' }}>{Ico.check(13)}</span>}</button>))}
            </div>
          </Col>
          <Col>
            {cur ? (
              <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span style={{ display: 'inline-flex' }}>{cur.ic}</span><span className="sk-wordbadge">{tr(cur.name)}</span></span>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, margin: '13px 0 0' }}><span style={{ color: T.honey, display: 'inline-flex', marginTop: 1 }}>{Ico.user(16)}</span><p className="body" style={{ margin: 0, color: T.ink }}><b style={{ color: T.honey }}>{tr({ uz: 'Kim:', ru: 'Кто:' })}</b> {tr(cur.role)}</p></div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, margin: '8px 0 0' }}><span style={{ color: T.grape, display: 'inline-flex', marginTop: 1 }}>{p7.target(16)}</span><p className="body" style={{ margin: 0, color: T.ink2 }}><b style={{ color: T.grape }}>{tr({ uz: 'ASL ish:', ru: 'Настоящая задача:' })}</b> {tr(cur.job)}</p></div>
              </div>
            ) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Bir ilovani bosing', ru: 'Нажмите на приложение' })}</p></div> : null)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ko'rdingizmi — odam "ilova"ni emas, <b>ishini bajarishni</b> xohlaydi. User Story shu ishni yozadi.</>, ru: <>Видите — человеку нужно не «приложение», а <b>решить свою задачу</b>. User Story описывает именно эту задачу.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — NOANIQLIK: bir so'rov, uch xil tushunish =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [v, setV] = useState('vague');
  const [seen, setSeen] = useState(storedAnswer ? new Set(['vague', 'clear']) : new Set(['vague']));
  const done = seen.size >= 2;
  const set = (x) => { setV(x); setSeen(prev => { const n = new Set(prev); n.add(x); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const GUESSES = [{ uz: 'Video tez yuklansinmi?', ru: 'Чтобы видео быстрее загружалось?' }, { uz: 'Ko\'rish tezligi tugmasimi?', ru: 'Кнопку скорости просмотра?' }, { uz: 'Internet tezlashsinmi?', ru: 'Чтобы интернет стал быстрее?' }];
  return (
    <Stage eyebrow={{ uz: 'Noaniqlik', ru: 'Размытость' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Ikkalasini ko\'ring', ru: 'Посмотрите оба' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Noaniq so'rovni har kim <span className="italic" style={{ color: T.accent }}>boshqacha</span> tushunadi</>, ru: <>Размытую просьбу каждый понимает <span className="italic" style={{ color: T.accent }}>по-своему</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>"Videoni tezlashtiraylik" desangiz — uch kishi uchta boshqa narsani tasavvur qiladi. User Story bo'lsa — hammasi <b style={{ color: T.ink }}>bir xil</b> narsani tushunadi. Ikkalasini bosib solishtiring.</>, ru: <>Скажете «давайте ускорим видео» — и три человека представят три разные вещи. А с User Story все поймут <b style={{ color: T.ink }}>одно и то же</b>. Нажмите оба варианта и сравните.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${v === 'vague' ? 'chip-on' : ''}`} onClick={() => set('vague')}>{tr({ uz: '"Videoni tezlashtiraylik"', ru: '«Давайте ускорим видео»' })}</button>
              <button className={`chip ${v === 'clear' ? 'chip-on' : ''}`} onClick={() => set('clear')}>User Story</button>
            </div>
            {v === 'vague'
              ? <div key="v" className="demo-swap" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{GUESSES.map((g, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: T.paper, borderRadius: 11, padding: '10px 13px', borderLeft: `3px solid ${T.accent}`, boxShadow: `0 5px 14px -8px rgba(${T.shadowBase},0.16)` }}><span style={{ color: T.ink3, display: 'inline-flex' }}>{Ico.user(16)}</span><span style={{ fontFamily: "'Manrope'", fontSize: 13, color: T.ink2 }}>{tr({ uz: <>{i + 1}-kishi:</>, ru: <>{i + 1}-й человек:</> })}</span><span style={{ fontFamily: G, fontStyle: 'italic', color: T.accent, fontSize: 13.5 }}>{tr(g)}</span></div>))}</div>
              : <div key="c" className="demo-swap"><StoryCard kim={{ uz: HERO.kim, ru: HERO_RU.kim }} harakat={{ uz: HERO.harakat, ru: HERO_RU.harakat }} natija={{ uz: HERO.natija, ru: HERO_RU.natija }} minH={130} /></div>}
          </Col>
          <Col>
            {v === 'vague'
              ? <div className="frame-warn fade-step" key="w"><p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tr({ uz: '3 xil tushunish', ru: '3 разных понимания' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Uchtasi ham "tez" so\'zini eshitdi, lekin uchtasi uch xil ishni tasavvur qildi. Kim haq? Hech kim — so\'rovning o\'zi noaniq.', ru: 'Все трое услышали слово «быстрее», но представили три разные задачи. Кто прав? Никто — размыта сама просьба.' })}</p></div>
              : <div className="frame-success fade-step" key="s"><p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tr({ uz: '1 aniq tushunish', ru: '1 чёткое понимание' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Kim aytayotgani, nima so'rayotgani va nima uchun so'rayotgani yozilgan — endi taxmin qiladigan joy qolmadi.", ru: 'Написано, кто просит, что просит и зачем — гадать больше не нужно.' })}</p></div>}
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bir gapga uchta savolning javobi sig'ib ketdi — va noaniqlik yo'qoldi. <b>Aniqlik = to'g'ri mahsulot.</b></>, ru: <>В одно предложение поместились ответы на три вопроса — и размытость исчезла. <b>Чёткость = правильный продукт.</b></> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={{ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' }}
    questionText="User Story nimadan iborat?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>User Story <span className="italic" style={{ color: T.accent }}>nimadan</span> iborat?</>, ru: <>Из <span className="italic" style={{ color: T.accent }}>чего</span> состоит User Story?</> })}</h2></>}
    options={[{ uz: 'Rang, shrift va o\'lcham', ru: 'Цвет, шрифт и размер' }, { uz: 'Kim · harakat · natija (nima uchun)', ru: 'Кто · действие · результат (зачем)' }, { uz: 'Faqat tugma nomi', ru: 'Только название кнопки' }, { uz: 'Qaysi texnologiyada qilinishi', ru: 'На какой технологии это сделать' }]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! User Story = kim (rol) + harakat (nima xohlaydi) + natija (nima uchun). Uchchovi birga — to'liq, aniq buyruq.", ru: 'Верно! User Story = кто (роль) + действие (чего хочет) + результат (зачем). Все три вместе — полная и чёткая задача.' }}
    explainWrong={{ 0: { uz: 'Rang/shrift — dizayn. User Story esa kim, nima va nima uchunni aytadi.', ru: 'Цвет и шрифт — это дизайн. А User Story говорит, кто, что и зачем.' }, 2: { uz: 'Faqat nom yetarli emas — kim va nima uchun ham kerak.', ru: 'Одного названия мало — нужны ещё «кто» и «зачем».' }, 3: { uz: 'Texnologiya — ilova ichida qanday qilinishi. User Story esa odamga nima kerakligini aytadi.', ru: 'Технология — это как всё устроено внутри приложения. А User Story говорит, что нужно человеку.' }, default: { uz: 'User Story = kim · harakat · natija.', ru: 'User Story = кто · действие · результат.' } }} />
);

// ===== SCREEN 5 — 3 BO'LAK (tap → vazifa) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(storedAnswer ? new Set(PARTS.map(p => p.key)) : new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= PARTS.length;
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: "3 bo'lak", ru: '3 части' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `${seen.size}/3 bo'lakni oching`, ru: `Откройте части: ${seen.size}/3` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>User Story qaysi <span className="italic" style={{ color: T.accent }}>3 bo'lak</span>dan iborat?</>, ru: <>Из каких <span className="italic" style={{ color: T.accent }}>3 частей</span> состоит User Story?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har birini bosing: <b style={{ color: T.honey }}>KIM</b> · <b style={{ color: T.blue }}>HARAKAT</b> · <b style={{ color: T.grape }}>NATIJA</b>. Bitta YouTube misolida ko'rasiz — pastdagi karta bosgan sari to'lib boradi.</>, ru: <>Нажмите на каждую: <b style={{ color: T.honey }}>КТО</b> · <b style={{ color: T.blue }}>ДЕЙСТВИЕ</b> · <b style={{ color: T.grape }}>РЕЗУЛЬТАТ</b>. Разберём на одном примере с YouTube — карточка внизу заполняется с каждым нажатием.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PARTS.map(s => (<button key={s.key} onClick={() => tap(s.key)} style={{ display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 12, padding: '12px 14px', background: T.paper, boxShadow: active === s.key ? `inset 0 0 0 2px ${s.color}, 0 8px 20px -8px ${s.color}44` : `0 6px 16px -8px rgba(${T.shadowBase},0.16)`, transition: 'all 0.18s' }}><span style={{ color: s.color, display: 'inline-flex' }}>{s.ic}</span><span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13.5, color: s.color }}>{tr(s.label)}</span>{seen.has(s.key) && <span style={{ marginLeft: 'auto', color: T.success, display: 'inline-flex' }}>{Ico.check(14)}</span>}</button>))}
            </div>
            <div className="fade-up delay-2"><StoryCard kim={seen.has('kim') ? { uz: HERO.kim, ru: HERO_RU.kim } : ''} harakat={seen.has('harakat') ? { uz: HERO.harakat, ru: HERO_RU.harakat } : ''} natija={seen.has('natija') ? { uz: HERO.natija, ru: HERO_RU.natija } : ''} minH={130} /></div>
          </Col>
          <Col>
            {active ? (<div className="sk-info fade-step" key={active}><span className="sk-tagbig"><span style={{ color: PMETA[active].color, display: 'inline-flex' }}>{PMETA[active].ic}</span><span className="sk-wordbadge" style={{ color: PMETA[active].color, background: PMETA[active].color + '1c' }}>{tr(PMETA[active].label)}</span></span><p className="body" style={{ color: T.ink, margin: '12px 0 0' }}>{tr(PMETA[active].job)}</p><p style={{ fontFamily: G, fontStyle: 'italic', color: T.ink2, margin: '9px 0 0', fontSize: 13.5, lineHeight: 1.5 }}>{tr({ uz: <>"{tr(PMETA[active].ex)}"</>, ru: <>«{tr(PMETA[active].ex)}»</> })}</p></div>) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Bir bo'lakni bosing", ru: 'Нажмите на часть' })}</p></div> : null)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Uchchovi birga turgandagina gap to'liq bo'ldi. Bittasini olib tashlang — darrov taxmin qiladigan joy paydo bo'ladi.", ru: 'Предложение стало полным, только когда все три части на месте. Уберите одну — и сразу придётся гадать.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5b — TEST 2 =====
const Screen5b = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={{ uz: 'Tekshiruv', ru: 'Проверка' }}
    questionText="User Story'da '...uchun' (natija) qismi nega kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Mustahkamlash', ru: 'Закрепление' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>"...uchun" (natija) qismi <span className="italic" style={{ color: T.accent }}>nega</span> kerak?</>, ru: <><span className="italic" style={{ color: T.accent }}>Зачем</span> нужна часть «...чтобы» (результат)?</> })}</h2></>}
    options={[{ uz: 'Jumlani uzaytirish uchun', ru: 'Чтобы предложение было длиннее' }, { uz: 'Foydalanuvchining ASL maqsadini (job) ko\'rsatadi', ru: 'Показывает НАСТОЯЩУЮ цель пользователя (job)' }, { uz: 'Texnologiyani tanlash uchun', ru: 'Чтобы выбрать технологию' }, { uz: 'Rangni belgilash uchun', ru: 'Чтобы выбрать цвет' }]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! Natija — harakatdan keyin odamning hayotida nima o'zgarishini aytadi. 'Bir kechada ko'proq mavzuga ulgurish' deyilgani uchun tezlik tugmasi qo'yildi; agar 'internetsiz ham ko'rish' deyilganda — butunlay boshqa narsa qilingan bo'lardi.", ru: 'Верно! Результат говорит, что изменится в жизни человека после действия. Кнопку скорости сделали, потому что сказано «за один вечер успеть больше тем»; если бы сказали «смотреть без интернета» — сделали бы совсем другое.' }}
    explainWrong={{ 0: { uz: 'Maqsad uzaytirish emas. Natija — odamning hayotida nima o\'zgarishini aytadi.', ru: 'Цель — не удлинить. Результат говорит, что изменится в жизни человека.' }, 2: { uz: 'Texnologiya — boshqa narsa. Natija foydalanuvchi nimaga erishishini aytadi.', ru: 'Технология — это другое. Результат говорит, чего добьётся пользователь.' }, 3: { uz: 'Rang — dizayn. Natija esa harakatdan keyingi foydani ko\'rsatadi.', ru: 'Цвет — это дизайн. А результат показывает пользу после действия.' }, default: { uz: 'Natija — harakatdan keyin odamning hayotida nima o\'zgarishini ko\'rsatadi.', ru: 'Результат показывает, что изменится в жизни человека после действия.' } }} />
);

// ===== SCREEN 6 — USER STORY TUG'ILADI (stepper) =====
const BIRTH = [
  { key: 'soz', label: { uz: 'NOANIQ SO\'ROV', ru: 'РАЗМЫТАЯ ПРОСЬБА' }, color: T.ink3, ic: Ico.problem(18), text: { uz: HERO.noaniq, ru: HERO_RU.noaniq } },
  { key: 'kim', label: { uz: 'KIM buni so\'rayapti?', ru: 'КТО об этом просит?' }, color: T.honey, ic: Ico.user(18), text: { uz: `${HERO.kim} sifatida`, ru: `Как ${HERO_RU.kim}` } },
  { key: 'harakat', label: { uz: 'U aynan NIMA qilmoqchi?', ru: 'ЧТО именно он хочет сделать?' }, color: T.blue, ic: p7.cursor(18), text: { uz: `men ${HERO.harakat}ni xohlayman`, ru: `я хочу ${HERO_RU.harakat}` } },
  { key: 'natija', label: { uz: 'Bundan unga NIMA foyda?', ru: 'КАКАЯ ему от этого польза?' }, color: T.grape, ic: p7.target(18), text: { uz: `${HERO.natija} uchun`, ru: `чтобы ${HERO_RU.natija}` } }
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? BIRTH.length : 0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const isMobile = useIsMobile();
  const done = step >= BIRTH.length;
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => { clearTimeout(timer.current); setStep(0); setRunning(true); const tick = (i) => { setStep(i); if (i < BIRTH.length) timer.current = setTimeout(() => tick(i + 1), 850); else setRunning(false); }; timer.current = setTimeout(() => tick(1), 350); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: "User Story tug'iladi", ru: 'Рождение User Story' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval kuzating', ru: 'Сначала посмотрите' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.4vw,13px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Noaniq so'rovdan User Story <span className="italic" style={{ color: T.accent }}>qanday</span> tug'iladi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> из размытой просьбы рождается User Story?</> })}</h2></div>
        <Mentor>{tr({ uz: "Noaniq so'rovga uchta savol beramiz — javoblari yig'ilib, gap o'zi to'liq bo'lib qoladi. Tugmani bosing va kuzating.", ru: 'Зададим размытой просьбе три вопроса — ответы соберутся, и предложение само станет полным. Нажмите кнопку и смотрите.' })}</Mentor>
        <Zoomable>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {BIRTH.map((s, i) => { const on = step > i; return (<React.Fragment key={s.key}><div style={{ display: 'flex', alignItems: 'center', gap: 11, background: T.paper, borderRadius: 11, padding: '9px 13px', opacity: on ? 1 : 0.4, boxShadow: on ? `0 7px 18px -10px rgba(${T.shadowBase},0.18)` : 'none', transition: 'all 0.45s' }}><IcoChip color={on ? s.color : T.ink3} soft={on ? s.color + '1c' : '#ECEAE5'} size={31}>{s.ic}</IcoChip><div style={{ minWidth: 0, flex: 1 }}><p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: '0.04em', color: on ? s.color : T.ink3, margin: 0 }}>{tr(s.label)}</p>{on && <p style={{ fontFamily: G, fontStyle: 'italic', fontSize: 13, color: T.ink2, margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isMobile ? 'normal' : 'nowrap' }}>{tr({ uz: <>"{tr(s.text)}"</>, ru: <>«{tr(s.text)}»</> })}</p>}</div>{on && i > 0 && <span style={{ color: T.success }}>{Ico.check(15)}</span>}</div>{i < BIRTH.length - 1 && <div style={{ display: 'flex', justifyContent: 'center', color: step > i + 1 ? T.success : T.ink3, transform: 'rotate(90deg)', lineHeight: 1, transition: 'color 0.3s' }}>{Ico.arrow(12)}</div>}</React.Fragment>); })}
        </div>
        <button className="btn" onClick={run} disabled={running} style={{ alignSelf: 'flex-start' }}>{running ? tr({ uz: 'Tug\'ilmoqda…', ru: 'Рождается…' }) : (done ? tr({ uz: '↻ Yana ko\'rish', ru: '↻ Посмотреть ещё раз' }) : tr({ uz: 'User Story\'ni tug\'dirish', ru: 'Собрать User Story' }))}</button>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana: <b>"{HERO_LINE}"</b> Bir gapda uchta savolning javobi turibdi — endi taxmin qiladigan joy yo'q.</>, ru: <>Вот: <b>«{HERO_LINE_RU}»</b> В одном предложении — ответы на три вопроса, гадать больше не нужно.</> })}</p></div>}
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — KUCHLI vs ZAIF USER STORY (compare) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [v, setV] = useState('strong');
  const [seen, setSeen] = useState(storedAnswer ? new Set(['strong', 'weak']) : new Set(['strong']));
  const done = seen.size >= 2;
  const set = (x) => { setV(x); setSeen(prev => { const n = new Set(prev); n.add(x); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Kuchli vs zaif', ru: 'Сильная vs слабая' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Ikkalasini ko\'ring', ru: 'Посмотрите обе' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi hikoyani o'qib, nima qilish kerakligi <span className="italic" style={{ color: T.accent }}>darrov</span> tushuniladi?</>, ru: <>Прочитав какую историю, <span className="italic" style={{ color: T.accent }}>сразу</span> понятно, что делать?</> })}</h2></div>
        <Mentor>{tr({ uz: "Ikki hikoya — biri aniq, biri noaniq. Ikkalasini bosing va o'zingizdan so'rang: gapdagi odamni ko'z oldingizga keltira olyapsizmi?", ru: 'Две истории — одна чёткая, другая размытая. Нажмите обе и спросите себя: можете ли вы представить человека из этого предложения?' })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${v === 'strong' ? 'chip-on' : ''}`} onClick={() => set('strong')}>{tr({ uz: 'Kuchli', ru: 'Сильная' })}</button>
              <button className={`chip ${v === 'weak' ? 'chip-on' : ''}`} onClick={() => set('weak')}>{tr({ uz: 'Zaif', ru: 'Слабая' })}</button>
            </div>
            <div key={v}>{v === 'strong'
              ? <StoryCard kim={{ uz: HERO.kim, ru: HERO_RU.kim }} harakat={{ uz: HERO.harakat, ru: HERO_RU.harakat }} natija={{ uz: HERO.natija, ru: HERO_RU.natija }} minH={140} />
              : <StoryCard kim={{ uz: 'Foydalanuvchi', ru: 'пользователь' }} harakat={{ uz: 'yangi tugma', ru: 'новую кнопку' }} natija={{ uz: "qulay bo'lishi", ru: 'было удобно' }} minH={140} />}</div>
          </Col>
          <Col>
            {v === 'strong'
              ? <div className="frame-success fade-step" key="s"><p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tr({ uz: 'Aniq', ru: 'Чётко' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Bu odamni ko'z oldingizga keltira olasiz: kechasi imtihonga tayyorlanyapti, vaqti kam. Shuning uchun aynan tezlik tugmasi kerakligi o'z-o'zidan kelib chiqadi.", ru: 'Этого человека легко представить: вечером готовится к экзамену, времени мало. Поэтому сразу ясно, что ему нужна именно кнопка скорости.' })}</p></div>
              : <div className="frame-warn fade-step" key="w"><p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tr({ uz: 'Noaniq', ru: 'Размыто' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Bu odamni ko\'z oldingizga keltira olmaysiz. "Foydalanuvchi" — hamma va hech kim; "qulay bo\'lishi" esa hech qanday o\'zgarishni ko\'rsatmaydi.', ru: 'Этого человека не представить. «Пользователь» — это все и никто; а «было удобно» не показывает никаких изменений.' })}</p></div>}
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Farqni sinash oson: <b>gapdagi odamni ko'z oldingizga keltira oldingizmi?</b> Keltira olsangiz — hikoya kuchli.</>, ru: <>Проверить разницу легко: <b>смогли ли вы представить человека из предложения?</b> Если да — история сильная.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — MOSLASH: rol ↔ ASL ish =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const ROLES = [
    { id: 'youtube', role: { uz: 'O\'quvchi', ru: 'Ученик' } },
    { id: 'taxi', role: { uz: 'Yo\'lovchi', ru: 'Пассажир' } },
    { id: 'market', role: { uz: 'Sotuvchi', ru: 'Продавец' } },
    { id: 'telegram', role: { uz: 'Do\'st', ru: 'Друг' } }
  ];
  const JOBS = [
    { id: 'market', text: { uz: 'ortiqcha narsani sotib pul ishlash', ru: 'продать ненужную вещь и заработать' } },
    { id: 'youtube', text: { uz: 'video orqali biror narsani o\'rganish', ru: 'научиться чему-то по видео' } },
    { id: 'telegram', text: { uz: 'yaqini bilan bir zumda gaplashish', ru: 'мгновенно поговорить с близким' } },
    { id: 'taxi', text: { uz: 'kutmasdan tez manzilga yetib olish', ru: 'быстро доехать без ожидания' } }
  ];
  const [sel, setSel] = useState(null);
  const [matched, setMatched] = useState(storedAnswer ? Object.fromEntries(ROLES.map(r => [r.id, true])) : {});
  const [wrong, setWrong] = useState(null);
  const done = Object.keys(matched).length >= ROLES.length;
  const pickR = (id) => { if (matched[id]) return; setSel(id); setWrong(null); };
  const pickJ = (id) => { if (!sel) return; if (id === sel) { setMatched(prev => ({ ...prev, [sel]: true })); setSel(null); setWrong(null); } else setWrong(id); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cardBtn = (extra) => ({ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', border: 'none', borderRadius: 12, padding: '12px 14px', fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 'clamp(13px,1.5vw,14.5px)', color: T.ink, transition: 'all 0.18s', ...extra });
  return (
    <Stage eyebrow={{ uz: 'Moslash', ru: 'Сопоставление' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `${Object.keys(matched).length}/${ROLES.length} moslang`, ru: `Соедините: ${Object.keys(matched).length}/${ROLES.length}` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har <span className="italic" style={{ color: T.accent }}>rolni</span> uning ASL ishi bilan ulang</>, ru: <>Соедините каждую <span className="italic" style={{ color: T.accent }}>роль</span> с её НАСТОЯЩЕЙ задачей</> })}</h2></div>
        <Mentor>{tr({ uz: <>Avval <b style={{ color: T.ink }}>rolni</b>, keyin uning <b style={{ color: T.ink }}>ASL ishini</b> bosing.</>, ru: <>Сначала нажмите на <b style={{ color: T.ink }}>роль</b>, потом — на её <b style={{ color: T.ink }}>НАСТОЯЩУЮ задачу</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Kim (rol)', ru: 'Кто (роль)' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {ROLES.map(r => { const m = matched[r.id]; const on = sel === r.id; return (<button key={r.id} onClick={() => pickR(r.id)} disabled={m} style={cardBtn({ cursor: m ? 'default' : 'pointer', opacity: m ? 0.5 : 1, background: m ? T.successSoft : T.paper, boxShadow: on ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -7px rgba(255,79,40,0.22)` : `0 6px 16px -8px rgba(${T.shadowBase},0.16)` })}><span style={{ color: m ? T.success : T.honey, display: 'inline-flex' }}>{m ? Ico.check(17) : Ico.user(17)}</span><span style={{ flex: 1, fontWeight: 700 }}>{tr(r.role)}</span></button>); })}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'ASL ish (job)', ru: 'Настоящая задача (job)' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {JOBS.map(j => { const m = matched[j.id]; const isWrong = wrong === j.id; return (<button key={j.id} onClick={() => pickJ(j.id)} disabled={m || !sel} className={isWrong ? 'shake-x' : ''} style={cardBtn({ cursor: (m || !sel) ? 'default' : 'pointer', opacity: m ? 0.5 : (!sel ? 0.65 : 1), background: m ? T.successSoft : (isWrong ? T.accentSoft : T.paper), boxShadow: `0 6px 16px -8px rgba(${T.shadowBase},0.16)` })}><span style={{ color: m ? T.success : T.grape, display: 'inline-flex' }}>{m ? Ico.check(16) : p7.target(16)}</span><span style={{ flex: 1 }}>{tr(j.text)}</span></button>); })}
            </div>
            {wrong && !done && <p className="small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: "Bu boshqa rolning ishi. Qaytadan urinib ko'ring.", ru: 'Это задача другой роли. Попробуйте ещё раз.' })}</p>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Zo'r! Har rolning aniq bir ASL ishi bor — User Story shu ishni yozadi.", ru: 'Отлично! У каждой роли есть своя НАСТОЯЩАЯ задача — User Story описывает именно её.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 3 (mentor keysi) =====
const Screen9 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={{ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' }}
    questionText="Qaysi User Story to'g'ri yozilgan?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Qaysi User Story <span className="italic" style={{ color: T.accent }}>to'g'ri</span> yozilgan?</>, ru: <>Какая User Story написана <span className="italic" style={{ color: T.accent }}>правильно</span>?</> })}</h2></>}
    options={[{ uz: 'Tugma qizil bo\'lsin', ru: 'Пусть кнопка будет красной' }, { uz: `${HERO.kim} sifatida, men ${HERO.harakat}ni xohlayman, ${HERO.natija} uchun`, ru: `Как ${HERO_RU.kim}, я хочу ${HERO_RU.harakat}, чтобы ${HERO_RU.natija}` }, { uz: 'Saytga JavaScript qo\'shamiz', ru: 'Добавим на сайт JavaScript' }, { uz: 'Foydalanuvchiga yoqsin', ru: 'Чтобы пользователю понравилось' }]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! Bu gapda uchchala savolning javobi ham bor: kim so'rayapti, u nima qilmoqchi va bundan unga qanday foyda.", ru: 'Верно! В этом предложении есть ответы на все три вопроса: кто просит, что он хочет сделать и какая ему от этого польза.' }}
    explainWrong={{ 0: { uz: '"Qizil bo\'lsin" — rang haqida. Kim so\'rayapti va bundan unga nima foyda — ikkalasi ham yo\'q.', ru: '«Пусть будет красной» — это про цвет. Нет ни того, кто просит, ни того, какая ему польза.' }, 2: { uz: 'Bu — texnik vazifa. Unda foydalanuvchi ham, uning foydasi ham yo\'q.', ru: 'Это техническая задача. В ней нет ни пользователя, ни его пользы.' }, 3: { uz: '"Yoqsin" — hech qanday o\'zgarishni ko\'rsatmaydi. Kim? Qanday harakat? Undan keyin nima o\'zgaradi?', ru: '«Чтобы понравилось» не показывает никаких изменений. Кто? Какое действие? Что изменится после него?' }, default: { uz: 'To\'liq hikoyada uchchala javob bo\'ladi: kim · nima qilmoqchi · undan qanday foyda.', ru: 'В полной истории есть все три ответа: кто · что хочет сделать · какая от этого польза.' } }} />
);

// ===== SCREEN 10 — NATIJASIZ STORY'NI TUZATISH (debug) =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [found, setFound] = useState(!!storedAnswer);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const done = fixed;
  const WEAK_NATIJA = 'shunchaki qulay bo\'lgani';
  const GOOD_NATIJA = HERO.natija;
  const lines = [
    { key: 'kim', label: { uz: 'KIM', ru: 'КТО' }, color: T.honey, text: { uz: `${HERO.kim} sifatida`, ru: `Как ${HERO_RU.kim}` } },
    { key: 'harakat', label: { uz: 'HARAKAT', ru: 'ДЕЙСТВИЕ' }, color: T.blue, text: { uz: `men ${HERO.harakat}ni xohlayman`, ru: `я хочу ${HERO_RU.harakat}` } },
    { key: 'natija', label: { uz: 'NATIJA', ru: 'РЕЗУЛЬТАТ' }, color: T.grape, text: '' }
  ];
  const clickLine = (k) => { if (found || fixed) return; if (k === 'natija') setFound(true); };
  const fix = () => setFixed(true);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Tuzatish', ru: 'Исправление' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : (found ? { uz: 'Endi tuzating', ru: 'Теперь исправьте' } : { uz: 'Zaif bo\'lakni toping', ru: 'Найдите слабую часть' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bu User Story'da qaysi bo'lak <span className="italic" style={{ color: T.accent }}>zaif</span>?</>, ru: <>Какая часть этой User Story <span className="italic" style={{ color: T.accent }}>слабая</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Hikoya yozilgan, lekin bitta qatori <b style={{ color: T.ink }}>hech narsa aytmayapti</b>. Qaysi biri? O'sha qatorni bosing.</>, ru: <>История написана, но одна её строка <b style={{ color: T.ink }}>ничего не говорит</b>. Какая? Нажмите на эту строку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">STORY</span><span className="ai-bubble">{tr({ uz: 'Tekshiring:', ru: 'Проверьте:' })}</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lines.map(l => { const isNatija = l.key === 'natija'; const bad = found && !fixed && isNatija; const txt = isNatija ? (fixed ? tr({ uz: GOOD_NATIJA + ' uchun', ru: 'чтобы ' + HERO_RU.natija }) : tr({ uz: WEAK_NATIJA + ' uchun', ru: 'чтобы было просто удобно' })) : tr(l.text); return (<div key={l.key} onClick={() => clickLine(l.key)} style={{ cursor: (found || fixed) ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', gap: 2, background: bad ? T.accentSoft : (fixed && isNatija ? T.successSoft : T.bg), borderRadius: 10, padding: '9px 12px', boxShadow: bad ? `inset 0 0 0 1.5px ${T.accent}` : 'none', transition: 'all 0.18s' }}><span className="mono" style={{ fontSize: 9.5, fontWeight: 700, color: l.color, textTransform: 'uppercase' }}>{tr(l.label)}</span><span style={{ fontFamily: G, fontSize: 13, color: T.ink }}>{tr({ uz: <>"{txt}"</>, ru: <>«{txt}»</> })}</span></div>); })}
              </div>
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={fix}>{tr({ uz: 'ASL maqsad bilan almashtirish', ru: 'Заменить НАСТОЯЩЕЙ целью' })}</button>}
            </div>
          </Col>
          <Col>
            {!found && <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Uchala qatorni o\'qing. Ikkitasi aniq narsa aytadi. Bittasi esa o\'qib bo\'lgach ham savol qoldiradi: "xo\'sh, keyin nima o\'zgaradi?" — o\'sha qatorni bosing.', ru: 'Прочитайте все три строки. Две говорят что-то конкретное. А после третьей остаётся вопрос: «и что потом изменится?» — нажмите на эту строку.' })}</p></div>}
            {found && !fixed && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: 'Topdingiz!', ru: 'Нашли!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: '"shunchaki qulay bo\'lgani uchun" deganda hayotda hech narsa o\'zgarmaydi. Videoni tez ko\'rgan o\'quvchi aynan nimaga ulguradi? Almashtirib ko\'ring.', ru: '«чтобы было просто удобно» — от этого в жизни ничего не меняется. Что именно успеет ученик, если будет смотреть видео быстрее? Попробуйте заменить.' })}</p></div>}
            {fixed && <div className="takeaway fade-step"><div className="ta-bulb" style={{ color: T.grape, display: 'inline-flex' }}>{p7.target(34)}</div><p className="ta-h">{tr({ uz: "Natija — hayotdagi o'zgarish", ru: 'Результат — это изменение в жизни' })}</p><p className="ta-sub">{tr({ uz: '"qulay bo\'lsin" emas, "bir kechada ko\'proq mavzuga ulguraman"', ru: 'не «чтобы было удобно», а «за один вечер успею больше тем»' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — USER STORY YIG'ISH (build) =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const POOL = {
    kim: { label: { uz: 'KIM', ru: 'КТО' }, color: T.honey, a: { uz: 'Foydalanuvchi', ru: 'пользователь' }, b: { uz: HERO.kim, ru: HERO_RU.kim } },
    harakat: { label: { uz: 'HARAKAT', ru: 'ДЕЙСТВИЕ' }, color: T.blue, a: { uz: 'yaxshiroq video ko\'rish', ru: 'смотреть видео лучше' }, b: { uz: HERO.harakat, ru: HERO_RU.harakat } },
    natija: { label: { uz: 'NATIJA', ru: 'РЕЗУЛЬТАТ' }, color: T.grape, a: { uz: 'qulay bo\'lishi', ru: 'было удобно' }, b: { uz: HERO.natija, ru: HERO_RU.natija } }
  };
  const KEYS = ['kim', 'harakat', 'natija'];
  const [pick, setPick] = useState(storedAnswer?.pick || {});
  const allGood = KEYS.every(k => pick[k] === 'b');
  const allPicked = KEYS.every(k => pick[k]);
  const workRef = useRef(null);
  const set = (k, v) => { if (allGood) return; setPick(prev => ({ ...prev, [k]: v })); };
  useEffect(() => {
    if (!allGood) return;
    if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, pick });
    if (typeof window !== 'undefined' && window.innerWidth < 768 && workRef.current) { const el = workRef.current; setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 360); }
  }, [allGood]);
  return (
    <Stage eyebrow={{ uz: "User Story yig'ish", ru: 'Сборка User Story' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!allGood} label={allGood ? { uz: 'Davom etish', ru: 'Продолжить' } : (allPicked ? { uz: 'Eng aniq variantni tanlang', ru: 'Выберите самый чёткий вариант' } : { uz: 'Har bo\'lakdan tanlang', ru: 'Выберите в каждой части' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har bo'lak uchun <span className="italic" style={{ color: T.accent }}>aniqroq</span> variantni tanlang</>, ru: <>Для каждой части выберите <span className="italic" style={{ color: T.accent }}>более чёткий</span> вариант</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har qator uchun ikkita variant bor: biri mavhum, biri aniq. <b style={{ color: T.ink }}>Aniq</b> bo'lganini tanlang — o'ngdagi karta shu zahoti to'lib boradi.</>, ru: <>Для каждой строки есть два варианта: один общий, другой конкретный. Выберите <b style={{ color: T.ink }}>конкретный</b> — карточка справа сразу заполнится.</> })}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        <Zoomable>
        <div className="split" ref={workRef}>
          <Col>
            {KEYS.map(k => (<div key={k}><p className="flow-label" style={{ margin: '0 0 6px', color: POOL[k].color }}>{tr(POOL[k].label)}</p><div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{['a', 'b'].map(v => { const on = pick[k] === v; return (<button key={v} onClick={() => set(k, v)} style={{ textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: 10, padding: '10px 13px', fontFamily: G, fontSize: 13.5, color: on ? '#fff' : T.ink, background: on ? POOL[k].color : T.paper, boxShadow: on ? `0 6px 14px -6px ${POOL[k].color}` : `0 5px 14px -8px rgba(${T.shadowBase},0.16)`, transition: 'all 0.16s' }}>{tr(POOL[k][v])}</button>); })}</div></div>))}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Sizning User Story', ru: 'Ваша User Story' })}</p>
            <StoryCard kim={pick.kim ? POOL.kim[pick.kim] : ''} harakat={pick.harakat ? POOL.harakat[pick.harakat] : ''} natija={pick.natija ? POOL.natija[pick.natija] : ''} minH={150} />
            {allGood && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Uchchala aniq variantni topdingiz. Chapdagi mavhum variantlarni yana o\'qib ko\'ring — ular ham "to\'g\'ri"dek tuyulardi, lekin hech kimni ko\'z oldingizga keltirmasdi.', ru: 'Вы нашли все три конкретных варианта. Перечитайте общие варианты слева — они тоже казались «правильными», но никого не помогали представить.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST 4 =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={{ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' }}
    questionText="User Story nega kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>User Story <span className="italic" style={{ color: T.accent }}>nega</span> kerak?</>, ru: <><span className="italic" style={{ color: T.accent }}>Зачем</span> нужна User Story?</> })}</h2></>}
    options={[{ uz: 'Hujjat chiroyli ko\'rinishi uchun', ru: 'Чтобы документ красиво выглядел' }, { uz: 'Hamma aynan bir xil narsani tushunsin — behuda ish qilinmasin', ru: 'Чтобы все поняли одно и то же — и не делали лишнюю работу' }, { uz: 'Ilova tezroq ishlashi uchun', ru: 'Чтобы приложение работало быстрее' }, { uz: 'Ko\'proq tugma qo\'shish uchun', ru: 'Чтобы добавить больше кнопок' }]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! Hikoya aniq bo'lsa — hamma bir xil narsani tushunadi. Noaniq bo'lsa, har kim o'zicha tasavvur qiladi va oxirida kerakmas narsa chiqadi: vaqt ham, kuch ham behuda ketadi.", ru: 'Верно! Если история чёткая — все понимают одно и то же. Если размытая — каждый представляет своё, и в итоге получается ненужная вещь: время и силы потрачены зря.' }}
    explainWrong={{ 0: { uz: 'Maqsad chiroyli hujjat emas. Hikoya nima qilinishi kerakligini aniqlaydi.', ru: 'Цель — не красивый документ. История определяет, что нужно сделать.' }, 2: { uz: 'Ilova tezligi — butunlay boshqa narsa. Hikoya nima qilinishini aytadi, qanchalik tez ishlashini emas.', ru: 'Скорость приложения — совсем другое. История говорит, что сделать, а не как быстро оно будет работать.' }, 3: { uz: 'Gap tugma sonida emas — kerakli narsaning o\'zi qilinishida.', ru: 'Дело не в количестве кнопок — а в том, чтобы сделать именно то, что нужно.' }, default: { uz: 'Hikoya kerak — hamma bir xil narsani tushunsin va behuda ish qilinmasin.', ru: 'История нужна, чтобы все поняли одно и то же и не делали лишнюю работу.' } }} />
);

// ===== SCREEN 13 — NAMUNA: 3 user story =====
const CASE_STORIES = [
  { kim: { uz: HERO.kim, ru: HERO_RU.kim }, harakat: { uz: HERO.harakat, ru: HERO_RU.harakat }, natija: { uz: HERO.natija, ru: HERO_RU.natija }, why: { uz: 'Bu odamning holati aytilgan: imtihonga tayyorlanyapti, ya\'ni vaqti kam. Shuning uchun unga aynan tezlik tugmasi kerak — boshqa hech narsa emas.', ru: 'Здесь сказано, в какой он ситуации: готовится к экзамену, значит, времени мало. Поэтому ему нужна именно кнопка скорости — и ничего больше.' } },
  { kim: { uz: 'Yo\'lda ketayotgan tomoshabin', ru: 'зритель в дороге' }, harakat: { uz: 'videoni oldindan yuklab qo\'yish', ru: 'заранее скачать видео' }, natija: { uz: 'internet yo\'q joyda ham ko\'ra olish', ru: 'смотреть его даже там, где нет интернета' }, why: { uz: 'Xuddi shu YouTube, lekin boshqa odam — va butunlay boshqa narsa kerak bo\'lib qoldi. Uni tezlik emas, internetsizlik qiynayapti.', ru: 'Тот же YouTube, но другой человек — и нужно уже совсем другое. Ему мешает не скорость, а отсутствие интернета.' } },
  { kim: { uz: 'Yangi kanal egasi', ru: 'владелец нового канала' }, harakat: { uz: 'videoni kim ko\'rganini bilish', ru: 'знать, кто смотрел моё видео' }, natija: { uz: 'kimga mos video yasashni tushunish', ru: 'понять, для кого снимать видео' }, why: { uz: 'Bu odam video ko\'rgani kelmagan — u video yasaydi. Ilova bitta, lekin uchinchi odamning ishi ham butunlay boshqa.', ru: 'Этот человек пришёл не смотреть видео — он их снимает. Приложение одно, но и у третьего человека задача совсем другая.' } }
];
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set([0, 1, 2]) : new Set());
  const isNarrow = useIsMobile(768);
  const [active, setActive] = useState(null);
  const done = seen.size >= CASE_STORIES.length;
  const tap = (i) => { setActive(i); setSeen(prev => { const n = new Set(prev); n.add(i); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = active !== null ? CASE_STORIES[active] : null;
  return (
    <Stage eyebrow={{ uz: 'Namuna', ru: 'Пример' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Endi navbat sizga →', ru: 'Теперь ваша очередь →' } : { uz: `${seen.size}/3 storyni oching`, ru: `Откройте story: ${seen.size}/3` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta YouTube — <span className="italic" style={{ color: T.accent }}>uch xil</span> odam, uch xil hikoya</>, ru: <>Один YouTube — <span className="italic" style={{ color: T.accent }}>три разных</span> человека, три разные истории</> })}</h2></div>
        <Mentor>{tr({ uz: "Uchala hikoya ham bitta ilova haqida. Har birini bosing va nega uchtasiga uch xil narsa kerakligini ko'ring.", ru: 'Все три истории — про одно приложение. Нажмите на каждую и посмотрите, почему троим нужны три разные вещи.' })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {CASE_STORIES.map((s, i) => { const open = seen.has(i); return (<button key={i} onClick={() => tap(i)} style={{ textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 12, padding: '11px 14px', background: active === i ? T.paper : T.paper, display: 'flex', alignItems: 'flex-start', gap: 9, boxShadow: active === i ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -8px rgba(255,79,40,0.2)` : (open ? `inset 0 0 0 1px ${T.success}55` : `0 6px 16px -8px rgba(${T.shadowBase},0.16)`), transition: 'all 0.18s' }}><span className="mono" style={{ fontSize: 12, fontWeight: 800, color: T.accent }}>{i + 1}</span><span style={{ fontFamily: G, fontSize: 13, color: T.ink, lineHeight: 1.5 }}>{tr({ uz: <><b style={{ color: T.honey }}>{tr(s.kim)}</b> sifatida, men <b style={{ color: T.blue }}>{tr(s.harakat)}</b>ni xohlayman, <b style={{ color: T.grape }}>{tr(s.natija)}</b> uchun.</>, ru: <>Как <b style={{ color: T.honey }}>{tr(s.kim)}</b>, я хочу <b style={{ color: T.blue }}>{tr(s.harakat)}</b>, чтобы <b style={{ color: T.grape }}>{tr(s.natija)}</b>.</> })}</span>{open && <span style={{ color: T.success, display: 'inline-flex' }}>{Ico.check(13)}</span>}</button>); })}
            </div>
          </Col>
          <Col>
            {cur ? (<div className="sk-info fade-step" key={active}><span className="sk-tagbig"><span className="sk-wordbadge">{tr({ uz: <>{active + 1}-User Story</>, ru: <>User Story {active + 1}</> })}</span></span><p className="body" style={{ color: T.ink, margin: '12px 0 0' }}>{tr(cur.why)}</p></div>) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Bir storyni bosing', ru: 'Нажмите на story' })}</p></div> : null)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Ilova bitta bo'lsa ham, KIM o'zgargani hamon boshqa narsa kerak bo'lib qoldi. Shuning uchun hikoya doim aniq bir odam tilidan yoziladi.", ru: 'Приложение одно, но стоило поменяться тому, КТО, — и понадобилось другое. Поэтому история всегда пишется от лица конкретного человека.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — QOIDA =====
const Screen14 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={{ uz: 'Qoida', ru: 'Правило' }} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Yakuniy ishga →', ru: 'К итоговой работе →' }} onClick={onNext} /></>}>
    <div className="screen">
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Fychani emas — <span className="italic" style={{ color: T.accent }}>ASL ishni</span> yoz</>, ru: <>Пишите не фичу — а <span className="italic" style={{ color: T.accent }}>НАСТОЯЩУЮ задачу</span></> })}</h2></div>
      <Mentor>{tr({ uz: <>Biror narsa qilishdan oldin hikoyani yozing: <b style={{ color: T.ink }}>kim, nima va nima uchun</b>. Shunda hamma bir xil narsani tushunadi va vaqt behuda ketmaydi.</>, ru: <>Прежде чем что-то делать, напишите историю: <b style={{ color: T.ink }}>кто, что и зачем</b>. Тогда все поймут одно и то же, и время не уйдёт впустую.</> })}</Mentor>
      <Zoomable>
      <div className="split">
        <Col>
          <div className="frame fade-up" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 'clamp(18px,2.6vw,26px)' }}>
            <IcoChip size={54} color={T.grape} soft={T.grapeSoft}>{p7.story(28)}</IcoChip>
            <div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, margin: 0, color: T.ink, fontSize: 'clamp(18px,2.4vw,22px)' }}>{tr({ uz: 'User Story = ASL ish', ru: 'User Story = НАСТОЯЩАЯ задача' })}</p><p className="body" style={{ margin: '3px 0 0', color: T.ink2 }}>{tr({ uz: 'Parma emas — teshik. Kim · harakat · natija.', ru: 'Не дрель — а дырка. Кто · действие · результат.' })}</p></div>
          </div>
        </Col>
        <Col>
          <p className="flow-label">{tr({ uz: "Har User Story — 3 bo'lak", ru: 'В каждой User Story — 3 части' })}</p>
          <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PARTS.map((s, i) => (<React.Fragment key={s.key}><div style={{ display: 'flex', alignItems: 'center', gap: 11, background: T.paper, borderRadius: 11, padding: '10px 13px', boxShadow: `0 5px 14px -8px rgba(${T.shadowBase},0.16)` }}><span style={{ color: s.color, display: 'inline-flex' }}>{s.ic}</span><span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, color: T.ink, fontSize: 13.5 }}>{tr(s.label)}</span></div>{i < PARTS.length - 1 && <span style={{ color: T.ink3, textAlign: 'center', fontSize: 11 }}>↓</span>}</React.Fragment>))}
          </div>
        </Col>
      </div>
      </Zoomable>
    </div>
  </Stage>
);

// ===== SCREEN 15 — YAKUNIY: 5 user story =====
const emptyStories = () => ['', '', '', '', ''];
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [rows, setRows] = useState(() => storedAnswer?.rows || emptyStories());
  const filled = rows.filter(x => x.trim().length >= 15).length;
  const passed = filled >= 3;
  const prevPassed = useRef(false);
  const workRef = useRef(null);
  useEffect(() => {
    if (passed && !prevPassed.current) {
      prevPassed.current = true;
      onAnswer(screen, { correct: true, rows, stage: 'final', screenIdx: screen });
      if (typeof window !== 'undefined' && window.innerWidth < 768 && workRef.current) { const el = workRef.current; setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 360); }
    }
  }, [passed]);
  const upd = (i, v) => setRows(prev => prev.map((x, idx) => (idx === i ? v : x)));
  const items = rows.map((x, i) => ({ label: `STORY ${i + 1}`, color: '#9FB4D8', text: x.trim() ? x : '', ph: { uz: 'yozilmagan…', ru: 'не написано…' } }));
  return (
    <Stage eyebrow={{ uz: 'Yakuniy ish', ru: 'Итоговая работа' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Yozing (${filled}/3)`, ru: `Напишите (${filled}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'z loyihangiz uchun <span className="italic" style={{ color: T.accent }}>5 User Story</span> yozing</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>5 User Story</span> для своего проекта</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi navbat sizga. YouTube misolidagidek yozing: <b style={{ color: T.honey }}>kim</b> sifatida, men <b style={{ color: T.blue }}>nima qilishni</b> xohlayman, <b style={{ color: T.grape }}>nima o'zgarishi</b> uchun. Kamida 3 tasi to'lsa — davom etasiz.</>, ru: <>Теперь ваша очередь. Пишите, как в примере с YouTube: как <b style={{ color: T.honey }}>кто</b>, я хочу <b style={{ color: T.blue }}>что сделать</b>, чтобы <b style={{ color: T.grape }}>что изменилось</b>. Заполните хотя бы 3 — и можно идти дальше.</> })}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        <Zoomable>
        <div className="split" ref={workRef}>
          <Col>
            {rows.map((x, i) => { const ok = x.trim().length >= 15; return (<div key={i} style={{ background: T.paper, borderRadius: 12, padding: '10px 12px', boxShadow: ok ? `inset 0 0 0 1.5px ${T.success}, 0 6px 16px -9px rgba(31,122,77,0.16)` : `0 6px 16px -9px rgba(${T.shadowBase},0.16)`, transition: 'box-shadow 0.2s' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><span style={{ color: ok ? T.success : T.ink3, display: 'inline-flex' }}>{ok ? Ico.check(15) : <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: T.ink3 }}>{i + 1}</span>}</span><span className="mono" style={{ fontSize: 10.5, fontWeight: 700, color: T.ink, textTransform: 'uppercase' }}>User Story {i + 1}</span></div><textarea value={x} onChange={e => upd(i, e.target.value)} placeholder={tr({ uz: "masalan: yo'lda ketayotgan tomoshabin sifatida, men videoni oldindan yuklab qo'yishni xohlayman, internet yo'q joyda ham ko'ra olish uchun", ru: 'например: как зритель в дороге, я хочу заранее скачать видео, чтобы смотреть его даже там, где нет интернета' })} rows={2} style={{ width: '100%', fontFamily: G, fontSize: 13.5, color: T.ink, background: T.bg, border: 'none', borderRadius: 9, padding: '8px 11px', resize: 'vertical', minHeight: 36, outline: 'none', lineHeight: 1.45, boxSizing: 'border-box' }} /></div>); })}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Sizning User Story'laringiz", ru: 'Ваши User Story' })}</p>
            <SpecCard items={items} minH={190} title={{ uz: 'Mening loyiham', ru: 'Мой проект' }} />
            {passed && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Tayyor! Har User Story → bitta komponent. Endi loyihangizni qurishni biladigan bo'ldingiz.", ru: 'Готово! Каждая User Story → один компонент. Теперь вы знаете, как строить свой проект.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 16 — YAKUN =====
const Screen16 = ({ screen, answers, onReset, onPrev, onFinish }) => {
  // F-0803-08: uyga vazifa kapsulasi — bosilganda topshiriq kartasi ochiladi
  const [hwOpen, setHwOpen] = useState(false);
  const [hwCharge, setHwCharge] = useState(false);
  const fireHw = () => { if (hwCharge || hwOpen) return; setHwCharge(true); setTimeout(() => { setHwOpen(true); setHwCharge(false); }, 500); };
  const RECAP = [{ uz: 'User Story = kim · harakat · natija', ru: 'User Story = кто · действие · результат' }, { uz: 'Jobs-to-be-Done: parma emas — teshik kerak', ru: 'Jobs-to-be-Done: нужна не дрель — а дырка' }, { uz: 'Noaniq so\'rov → noto\'g\'ri mahsulot', ru: 'Размытая просьба → неправильный продукт' }, { uz: 'Har User Story → bitta React komponent', ru: 'Каждая User Story → один React-компонент' }];
  const HOMEWORK = [{ b: { uz: 'Sevimli ilovangizni oching', ru: 'Откройте любимое приложение' }, t: { uz: '— eng ko\'p ishlatadigan 2 ta ishini hikoya qilib yozing', ru: '— опишите историями 2 задачи, для которых вы его чаще всего используете' } }, { b: { uz: 'Bitta ilova — uch xil odam', ru: 'Одно приложение — три разных человека' }, t: { uz: '— o\'sha ilovaga 3 xil KIM tilidan hikoya yozing', ru: '— напишите для него истории от лица 3 разных КТО' } }, { b: { uz: 'Loyihangizni to\'ldiring', ru: 'Дополните свой проект' }, t: { uz: '— bugungi 5 tani sayqallang yoki yana qo\'shing', ru: '— доработайте сегодняшние 5 или добавьте ещё' } }];
  const GLOSSARY = [{ b: 'User Story', t: { uz: '— foydalanuvchi ehtiyojining qisqa yozuvi', ru: '— короткая запись потребности пользователя' } }, { b: { uz: 'Rol', ru: 'Роль' }, t: { uz: '— kim (mentor, xaridor, mehmon...)', ru: '— кто (ментор, покупатель, гость...)' } }, { b: { uz: 'Natija (job)', ru: 'Результат (job)' }, t: { uz: '— foydalanuvchining ASL maqsadi', ru: '— НАСТОЯЩАЯ цель пользователя' } }, { b: 'Jobs-to-be-Done', t: { uz: '— odam mahsulotni ish bajarish uchun "yollaydi"', ru: '— человек «нанимает» продукт, чтобы сделать дело' } }];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const [open, setOpen] = useState(false);
  const glossRef = useRef(null);
  const isNarrow = useIsMobile(768);
  const toggleGloss = () => setOpen(o => { const nv = !o; if (nv && isNarrow) setTimeout(() => { if (glossRef.current) glossRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 80); return nv; });
  return (
    <Stage eyebrow={{ uz: 'Tayyor', ru: 'Готово' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">{Ico.check(11)}</span> {tr({ uz: 'PM darsi tugadi', ru: 'PM-урок пройден' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi siz <span className="italic" style={{ color: T.accent }}>foydalanuvchidek</span> o'ylaysiz.</>, ru: <>Теперь вы думаете <span className="italic" style={{ color: T.accent }}>как пользователь</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span style={{ color: T.success, display: 'inline-flex' }}>{Ico.check(15)}</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck" style={{ display: 'inline-flex' }}>{Ico.check(15)}</span><span>{tr(r)}</span></li>))}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${hwCharge ? 'charging' : ''}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{tr(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
            <span className="hw-big-s">{tr({ uz: 'Amaliy topshiriqni bajarish →', ru: 'Выполнить практическое задание →' })}</span>
          </button>
        </div>
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "User Story ko'nikmangizni mashq qiling:", ru: 'Потренируйте навык User Story:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: 'Har User Story — qaysidir komponentning ASL sababi! 🎯', ru: 'Каждая User Story — НАСТОЯЩАЯ причина какого-то компонента! 🎯' })}</p></div>}
        <div ref={glossRef} className="gloss fade-up d4" style={{ scrollMarginBottom: 16 }}><div className="gloss-head" onClick={toggleGloss}><span className="lbl">{tr({ uz: "Kalit so'zlar (takrorlash)", ru: 'Ключевые слова (повторение)' })}</span><span className="gloss-toggle">{open ? '−' : '+'}</span></div>{open && (<div className="gloss-body">{GLOSSARY.map((g, i) => (<span key={i}><b>{tr(g.b)}</b> {tr(g.t)}{i < GLOSSARY.length - 1 ? ' · ' : ''}</span>))}</div>)}</div>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT
export default function PmLesson7({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
  // F-0730-01: saqlangan progress bir marta o'qiladi — reload'da o'quvchi o'z ekraniga qaytadi.
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) savedRef.current = progRead(LESSON_META.lessonId, TOTAL_SCREENS);
  const saved = savedRef.current;
  const [screen, setScreen] = useState(() => saved ? Math.min(Math.max(saved.screen || 0, 0), TOTAL_SCREENS - 1) : 0);
  const [answers, setAnswers] = useState(() => (saved && saved.answers) || {});
  const startTimeRef = useRef(saved?.startedAt || Date.now());
  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));
  const recordAnswer = (idx, data) => setAnswers(a => ({ ...a, [idx]: data }));
  const reset = () => { progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers]);

  const finishLesson = () => {
    progClear(LESSON_META.lessonId); // F-0730-01: yakunlangan dars saqlovi tozalanadi
    const scoredMeta = SCREEN_META.filter(s => s.scored);
    const finalMeta = scoredMeta.filter(s => s.scope === 'final');
    const scoredAnswers = SCREEN_META.map((s, i) => (s.scored ? answers[i] : null)).filter(Boolean);
    const correctAnswers = scoredAnswers.filter(a => a.correct).length;
    const finalCorrect = SCREEN_META.map((s, i) => (s.scored && s.scope === 'final' ? answers[i] : null)).filter(Boolean).filter(a => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scoredMeta.length, correctAnswers,
      scorePercent: scoredMeta.length ? Math.round((correctAnswers / scoredMeta.length) * 100) : 0,
      finalScore: finalCorrect, finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : (scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false),
      answers: SCREEN_META.map((_s, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === 'function') onFinished(payload);
  };

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        /* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; height: 100dvh; overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.45s cubic-bezier(.2,.7,.2,1) forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

        @keyframes feat-pop { 0% { transform: scale(.82); opacity: 0; } 60% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        .feat-pop { animation: feat-pop .34s cubic-bezier(.2,.7,.2,1); }
        @keyframes shake { 0%,100% { transform: none; } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
        .shake-x { animation: shake 0.42s; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.accent}; color: #fff; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .option:hover:not(:disabled) { background: #FDFBF7; transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -8px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.5 !important; box-shadow: none !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(255,79,40,0.34) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.2); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -7px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI === */
        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .hook-option:hover:not(:disabled):not(.on) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -8px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .demo-swap { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }

        /* === STAGE === */
        .stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(255,79,40,0.55), 0 0 3px rgba(255,79,40,0.4); }

        /* === FRAME === */
        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === SPEC / STORY CARD (qora) === */
        .spec-card { background: ${CODE.bg}; border-radius: 14px; padding: 16px 17px; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.3); display: flex; flex-direction: column; gap: 12px; }
        .spec-head { display: flex; align-items: center; gap: 8px; padding-bottom: 9px; border-bottom: 1px solid #ffffff18; }
        .spec-title { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #9FB4D8; }
        .spec-lbl { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
        .spec-text { font-family: 'Georgia, serif'; font-size: clamp(13px,1.7vw,15px); line-height: 1.5; margin: 3px 0 0; }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .step-num { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 16px 18px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); animation: fade-step 0.34s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === AI CARD / TAKEAWAY === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.grape}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.grapeSoft}; border-radius: 14px; padding: 22px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.grape}; font-weight: 600; font-size: 13px; margin: 0; }

        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { display: inline-flex; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; flex-shrink: 0; margin-top: 1px; }
        /* F-0803-08 — UYGA VAZIFA KAPSULASI (PmLesson2 etaloni): yakun sahifasida
           «Endi siz bilasiz» dan KEYIN turadi, bosilganda topshiriq kartasi ochiladi. */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.03); } 100% { filter: brightness(1); } }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent); transform: rotate(8deg); animation: hw-shine 4.6s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(120,60,220,.6), 0 0 40px rgba(124,58,237,.72), 0 0 96px rgba(124,58,237,.4), inset 0 0 60px rgba(124,58,237,.44); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none !important; } }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .gloss-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; cursor: pointer; } .gloss-head .lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; } .gloss-toggle { font-size: 18px; color: ${T.ink2}; }
        .gloss-body { padding: 0 17px 15px; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.7; animation: fade-step 0.3s; } .gloss-body b { color: ${T.ink}; }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
      `}</style>
      <div className="lesson-root">
        <Current screen={screen} storedAnswer={answers[screen]} answers={answers} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
      </div>
    </LangContext.Provider>
  );
}
