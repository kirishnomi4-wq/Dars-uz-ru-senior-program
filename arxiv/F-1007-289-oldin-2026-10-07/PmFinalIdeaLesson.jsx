import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul (LMS) · 4-dars «O'n intervyudan keyin qaysi g'oya qoladi?» — PM 2-tur, 16 ekran (kalit m9-04, kod papkasi src/9-Modull).
// Manba-haqiqat: feedback/F-1005-11modul/04-PmFinalIdea-v3.md (GATE M) · Filtr 04-FILTR.md. Skeletdan (src/skelet/NamunaDars.jsx) qurilgan, qolip — src/qolip.
// Oqim: kirish → reja → takrorlangan javob (tushuncha) → 1-savol → harakat belgisi → 2-savol → YouTube → 3-savol → final g'oya →
//   o'z sanog'i → final g'oyangiz (juftlik) → kod (VS Code) → yakuniy savol → podium → kartochkalar → yakun.
// O'qiydi: pm-m9d3-intervyu (g'oya nomlari; uy yozuvlari qog'ozda — sanoqni o'quvchi kiritadi, tayanch 9.44).
// Yozadi: pm-m9d4-final (10-ekran; 5 va 16-darslar o'qiydi — maydon nomlari tayanch 8 aynan). 9-ekran doskasi — dars javobida (answers), alohida kalit yo'q.
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================

// D3: palitra umumiy qolipdan — neytral 5 · modul rangi 2 · holat 2 (shadowBase — soya, rang tokeni emas)
const T = { ...qolipRang('pm'), shadowBase: '27, 22, 48' };
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
// Payload/analitika uchun UZ-etalon (til almashsa ham hisobot bir xil qoladi)
const ou = (o) => (o && typeof o === 'object' && !React.isValidElement(o)) ? (o.uz ?? '') : o;

// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext } from '../live/index.js';
// D1–D4 (F-1004 2-qism, 04.10.2026): umumiy qolip — ekran turlari, ikki tugma, 9 token, emojisiz yuza (src/qolip/QOLIP.md)
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QQadamlar, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';







const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const AchCtx = createContext(null); //  olingan nishonlar (Set) — Stage hisoblagichi uchun
const AchMissCtx = createContext(null); //  151-qonun: { missed:Set<ekran id>, miss(idx), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi

// Matn ichidagi `kod` bo'laklarini chip qilib ko'rsatadi (qcode)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

// AUDIOSIZ dars — useAudio/getAudioEngine zaglushkasi (QuestionScreen imzosi saqlanadi, TTS yo'q)
const getAudioEngine = () => null;
const useAudio = () => ({ muted: true, isPlaying: false, currentSegment: null, waitingFor: null, triggerEvent: () => {}, replay: () => {}, toggleMute: () => {} });

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

const LESSON_META = { lessonId: 'pm-m9d4-v1', lessonTitle: { uz: "O'n intervyudan keyin qaysi g'oya qoladi?", ru: 'Какая идея останется после десяти интервью?' } };
// 16 ekran · PM 2-tur (artefakt — o'quvchining sanoq doskasi, final g'oya va muammo gapi) · ballik testlar 3, 5, 7, 12 (✔ D · B · C · A)
const HW_TOKENS = [
  { t: { uz: 'yozuv', ru: 'запись' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'sanoq', ru: 'подсчёт' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: "final g'oya", ru: 'финальная идея' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'muammo gapi', ru: 'фраза о проблеме' }, l: 74, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'koding',      template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);


const Split = ({ children }) => <div className="split">{children}</div>;
const Zoomable = ({ children }) => {
  const [big, setBig] = useState(false);
  // bo'sh ustunda ⛶ va yorliq yolg'iz osilmasin (F-0926-01, 111-qonun): mazmun DOM bo'yicha o'lchanadi —
  // children ko'pincha doim mavjud <div> (ichi bo'sh), shuning uchun React.Children yetmaydi.
  const zref = useRef(null);
  const [hasContent, setHasContent] = useState(true);
  // ⛶ bo'sh joy ustida osilmasin (ZBTN, 159-qonun): tugma ostidagi ustunda ko'rinadigan narsa yo'q bo'lsa — yashirin.
  const [zFloat, setZFloat] = useState(false);
  useEffect(() => {
    const el = zref.current; if (!el || typeof MutationObserver === 'undefined') return;
    const ink = (n) => {
      if (!el.contains(n) || n === el || n.classList?.contains('zoom-btn') || n.closest?.('.zoom-btn')) return false;
      if (/^(IMG|svg|CANVAS|INPUT|TEXTAREA|BUTTON|VIDEO|SELECT|path|rect|circle|line|polygon)$/.test(n.tagName)) return true;
      if ([...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())) return true;
      const cs = getComputedStyle(n); const bg = cs.backgroundColor.match(/[\d.]+/g);
      return (bg && (bg.length < 4 || Number(bg[3]) > 0.05)) || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
    };
    const run = () => {
      const zb = el.querySelector(':scope > .zoom-btn');
      if (!zb || el.classList.contains('zoom-on')) { setZFloat(false); return; }
      const r = zb.getBoundingClientRect(), zr = el.getBoundingClientRect(); if (!r.width) return;
      let hit = false;
      for (let y = r.top; y < Math.min(r.top + 220, zr.bottom) && !hit; y += 18) for (const x of [r.left - 30, r.left - 140]) {
        if (x < zr.left) continue; if (document.elementsFromPoint(x, y).some(ink)) { hit = true; break; }
      }
      setZFloat(!hit);
    };
    let raf = 0; const sch = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(run); };
    sch(); const t = setTimeout(sch, 700); // fade-kirish tugagach yana bir bor
    const mo = new MutationObserver(sch); mo.observe(el, { childList: true, subtree: true, characterData: true });
    window.addEventListener('resize', sch);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); mo.disconnect(); window.removeEventListener('resize', sch); };
  }, []);
  useLayoutEffect(() => {
    const el = zref.current; if (!el) return;
    const kids = [...el.childNodes].filter(n => !(n.nodeType === 1 && n.classList.contains('zoom-btn')));
    const c = kids.some(n => (n.textContent || '').trim().length > 0 || (n.nodeType === 1 && n.querySelector('img,svg,canvas,input,textarea,video,iframe,button')));
    if (c !== hasContent) setHasContent(c);
  });
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
      <div ref={zref} className={`zoomable ${big ? 'zoom-on' : ''}${hasContent ? '' : ' z-empty'}${zFloat ? ' z-float' : ''}`}>
        {hasContent && <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>}
        {children}
      </div>
    </>
  );
};
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

// 🏅 Yuqori paneldagi nishon hisoblagichi (Stage chrome)
// 🏅 Yuqori paneldagi nishon hisoblagichi (Stage chrome)
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
  if (gate && gate.live && gate.live.mode === 'mentor') return null; // 🔴 mentor proyektorida nishon YO'Q (hooklardan KEYIN)
  return (
    <div className="ach-cnt-wrap">
      <button className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Badges" title="Badges">
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && (
        <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">🏅 Badges — {count}/{total}</div>
          {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(earned && earned.has(id)); return (
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-nm">{tr(a.name)}</span></div>
          ); })}
        </div>
      )}
    </div>
  );
}

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768); // mobil: Mentor yig'ilish rejimi
  const collapseOn = isNarrow && !mentorStatic; // F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]); // har ekranda Mentor ochiq holatdan boshlanadi
  // mobil: yangi bo'lak ochilganda pastga silliq surish (scrollSignal o'zgarsa)
  useEffect(() => {
    if (!scrollSignal || !isNarrow) return;
    const el = contentRef.current;
    if (!el) return;
    const t = setTimeout(() => { if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }, 240);
    return () => clearTimeout(t);
  }, [scrollSignal, isNarrow]);
  const setCollapsed = useCallback((v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) { const el = contentRef.current; requestAnimationFrame(() => { if (el) el.scrollTo({ top: 0, behavior: 'auto' }); }); }
  }, []);
  const onContentClick = (e) => {
    if (!collapseOn || mCollapsed) return;
    if (e.target && e.target.closest && e.target.closest('.mentor')) return; // Mentorning o'ziga tegsa — yig'maymiz
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AchCounter />
              <div className="mono small" style={{ color: T.ink2 }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
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
const NavNext = ({ disabled, label, onClick, optionalLive }) => {
  const lbl = tr(label) || tr({ uz: 'Davom etish', ru: 'Продолжить' });
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Mashq signallari (doska, final, koding) — sentinel -1 (500+ zona, ballsiz).
// To'g'ri javob o'rni MD dagidek: s3 — D · s5 — B · s7 — C · s12 — A (yangi dars, birinchi marta belgilangan).
const INLINE_KEYS = { s3: 3, s5: 1, s7: 2, s12: 0, doska: -1, final: -1, koding: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); PM darsida belgi o'rnida raqam (S-026)
const RECAPS = {
  3: { title: { uz: 'Takrorlangan javob', ru: 'Повторяющийся ответ' }, cards: [
    { ic: '1', h: { uz: "Ikkala g'oyaga bir xil savollar berilgan — javoblar yonma-yon sanaladi.", ru: 'Обеим идеям задали одинаковые вопросы — ответы считают рядом.' } },
    { ic: '2', h: { uz: "Bir necha yozuvda bir xil ma'noda qaytgan javob — takrorlangan javob.", ru: 'Ответ, который с тем же смыслом вернулся в нескольких записях, — повторяющийся ответ.' } },
    { ic: '3', h: { uz: "Mentor misolida muammo jamoada 5 yozuvdan 4 tasida, to'garakda 3 tasida — farq bitta yozuv.", ru: 'В примере Ментора проблема в команде — в 4 записях из 5, в кружках — в 3: разница в одну запись.' }, ask: { uz: 'Yozuvlaringizda qaysi qiyinchilik bir necha marta chiqdi?', ru: 'Какая трудность встретилась в ваших записях несколько раз?' } }
  ] },
  5: { title: { uz: 'Harakat belgisi', ru: 'Знак действия' }, cards: [
    { ic: '1', h: { uz: "«Ishlatib ko'raman» — bu va'da: hali bo'lmagan ish.", ru: '«Попробую» — это обещание: дело, которого ещё не было.' } },
    { ic: '2', h: { uz: "Odam sinab ko'rishga kun belgiladi — bu harakat belgisi: so'z emas, ish.", ru: 'Человек назначил день, чтобы попробовать, — это знак действия: не слово, а дело.' } },
    { ic: '3', h: { uz: "Mentor misolida belgi: jamoa yig'ishda 4 / 5, to'garakda 1 / 5.", ru: 'В примере Ментора знак: сбор команды — 4 / 5, кружки — 1 / 5.' }, ask: { uz: 'Intervyularingizda kim sinovga kun belgiladi?', ru: 'Кто в ваших интервью назначил день для пробы?' } }
  ] },
  7: { title: { uz: 'YouTube', ru: 'YouTube' }, cards: [
    { ic: '1', h: { uz: "YouTube avval tanishuv sayti bo'lib boshlangan — bu g'oya ishlamagan.", ru: 'YouTube начинался как сайт знакомств — эта идея не сработала.' } },
    { ic: '2', h: { uz: 'Asoschilar odamlar saytga har xil video yuklayotganini payqagan.', ru: 'Основатели заметили, что люди загружают на сайт самые разные видео.' } },
    { ic: '3', h: { uz: "Sayt «hamma narsa uchun video» bo'lib o'zgargan.", ru: 'Сайт превратился в «видео для всего».' }, ask: { uz: 'Yozuvlaringizda odamlar siz kutmagan nima qilgan?', ru: 'Что неожиданного сделали люди в ваших записях?' } }
  ] },
  12: { title: { uz: 'Teng sanoqda', ru: 'Когда счёт равный' }, cards: [
    { ic: '1', h: { uz: "Muammo ikkala g'oyada teng chiqishi mumkin.", ru: 'Проблема может выйти поровну в обеих идеях.' } },
    { ic: '2', h: { uz: 'Shunda doskadagi harakat belgisi qatoriga ham qarang.', ru: 'Тогда посмотрите и на строку знака действия на доске.' } },
    { ic: '3', h: { uz: '10 intervyu — kichik son: tanlov uchun dalil, isbot emas.', ru: '10 интервью — небольшое число: довод для выбора, а не доказательство.' }, ask: { uz: "Sizning doskangizda qaysi qator ikki g'oyani ko'proq ajratdi?", ru: 'Какая строка на вашей доске сильнее развела две идеи?' } }
  ] }
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
        <span className="rc-tag">{tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        {card.ic && <div className="rc-ic">{card.ic}</div>}
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">{tr({ uz: 'Sinfga savol:', ru: 'Вопрос классу:' })} {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}${tr({ uz: '-karta', ru: '-я карта' })}`} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Дальше →' })}</button>}
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
        <span className="mstats-lbl">{tr({ uz: 'Jonli natija', ru: 'Живой результат' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri", ru: 'верно' })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'xato', ru: 'неверно' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda', ru: 'ожидаем' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi', ru: 'ответили' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda', ru: 'ожидаем' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "Kim nimani tanlagani va to'g'ri/xato soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: 'Кто что выбрал и число верных/неверных скрыто — при нажатии «Открыть результат» всё появится сразу и у вас, и на экранах учеников.' })}</p>
      )}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
          const n = data.rows.filter(a => a.picked === i).length;
          const pct = answered ? Math.round((n / answered) * 100) : 0;
          const isC = reveal && i === correctIdx;
          const col = isC ? T.ok : MSTATS_COLORS[i % 4];
          return (
            <div key={i} className={`mstats-row ${reveal && !isC ? 'dimmed' : ''}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? '✓' : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round((n / maxN) * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.ok, fontWeight: 800 } : undefined}>{n > 0 ? `${n} ${tr({ uz: "o'quvchi", ru: 'уч.' })} · ${pct}%` : '—'}</span>
            </div>
          );
        })}
      </div>}
      {reveal && answered > 0 && (() => {
        const pct = Math.round((ok / answered) * 100);
        const level = answered < RECAP_MIN_ANSWERS ? 'few' : pct < RECAP_NEED_PCT ? 'need' : pct < RECAP_GOOD_PCT ? 'maybe' : 'good';
        return (
          <div className={`mstats-verdict ${level}`}>
            {level === 'need' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>Только <b>{pct}%</b> верных — тема осталась непонятной классу. Перед продолжением коротко повторите.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: 'Qayta tushuntirish — ', ru: 'Объяснить заново — ' })}{tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <><b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <><b>{pct}%</b> верных — неплохо. При желании коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <><b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <><b>{pct}%</b> верных — класс усвоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — по процентам судить трудно. Оцените сами.</> })}</p>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr({ uz: 'Kutilmoqda:', ru: 'Ожидаем:' })}</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: 'Большинство ошиблось — похоже, тема осталась непонятной. Объясните ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
    </div>
  );
}

// Testdan keyingi karta (MD: javob topilgach savol ostida) — paydo bo'lgach ko'rinadigan joyga silliq suriladi
const TestViz = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => { if (ref.current && ref.current.scrollIntoView) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 650); return () => clearTimeout(t); }, []);
  return <div ref={ref} className="fi-test-viz fade-step">{children}</div>;
};
const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev, vizual }) => {
  const _am = useContext(AchMissCtx);
  const fpPractice = !!(_am && _am.practice); // 151-qonun 6-band: «Qaytadan» mashq-o'tishi — hech qayerga yozilmaydi
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: 'on_mount', waits_for: { type: 'option_picked' } }] : null);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student'); // jonli dars: BITTA urinish — xato bo'lsa ham qotadi
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now()); // tezlik: savol ochilgandan bosishgacha (teng ballda hal qiladi)
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  // MENTOR (proyektor): o'zi javob BERMAYDI — «Natijani ochish» bosilguncha to'g'ri javob sir saqlanadi.
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  // 📖 Qayta tushuntirish (recap) — natija past chiqsa mentor ochadi; o'quvchi xato qilsa o'zi ham ochishi mumkin
  const [recapOpen, setRecapOpen] = useState(false);
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect(() => { if (isMentorLive && liveRevealScreen === screen) setMReveal(true); }, [isMentorLive, liveRevealScreen, screen]);
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === correctIdx;
    setPicked(i);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect; // ball: 1-urinishni qotirib qo'yamiz
    if (oneShot) {
      // Jonli dars: javob darhol qotadi (to'g'ri ham, xato ham) va serverga yoziladi
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    // Har urinish tarixga (LMS analitika, 0005): ball emas, yozuv; modulsiz eski darsda recordAttempt yo'q
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: options.map(ou), picked: ou(options[i]), correct: ou(options[correctIdx]), lang: (typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz' });
    if (audioText) { audio.triggerEvent('option_picked'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? (audioOk || "To'g'ri.") : (audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.")); }, 300); }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx; // jonli darsda xato bosib qotgan
  // KAHOOT REVEAL: jonli darsda javob bosilgach to'g'ri/XATO ham sir — faqat «javob qabul qilindi».
  // Mentor «Natijani ochish»/keyingi sahifa/dars tugashi bilan hammada birdan ochiladi.
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed; // javob qotdi — natija mentordan kutilmoqda
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' }))} onClick={onNext} /></>}>
      {/* D1/DE-203: ko'rinish — qolip QTest (texnik darslar standarti); mantiq (jonli ball, bitta urinish, mentor ochishi) — shu yerda */}
      <QTest
        savol={tr(question)}
        ogoh={oneShot && !solved && tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: 'Живой урок — одна попытка, подумайте перед нажатием!' })}
        variantlar={options.map(opt => fmtCode(tr(opt)))}
        ixcham={picked !== null}
        yopiq={solved || isMentorLive}
        onTanla={pick}
        holat={(i) => isMentorLive
          ? (mReveal ? (i === correctIdx ? 'ok' : 'xira') : undefined)
          : solved
            ? (waiting ? (i === picked ? 'kutish' : undefined) : i === correctIdx ? 'ok' : (wrongLocked && i === picked ? 'xato' : 'xira'))
            : (i === picked ? 'xato' : undefined)}
        javob={(isMentorLive ? mReveal : picked !== null) && (
          <QTestJavob key={`${picked}-${solved}-${waiting}`} tur={waiting ? 'kutish' : (isMentorLive || (solved && !wrongLocked)) ? 'ok' : 'qayta'}
            sarlavha={isMentorLive
              ? <>{tr({ uz: "✓ To'g'ri javob:", ru: '✓ Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
              : waiting
                ? tr({ uz: 'Javobingiz qabul qilindi', ru: 'Ваш ответ принят' })
                : wrongLocked
                  ? <>{tr({ uz: "To'g'ri javob:", ru: 'Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}>
            <p>{isMentorLive
              ? fmtCode(tr(explainCorrect))
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
                : wrongLocked
                  ? fmtCode(tr(explainWrong[picked] ?? explainWrong.default))
                  : solved ? fmtCode(tr(explainCorrect)) : fmtCode(tr(explainWrong[picked] ?? explainWrong.default))}</p>
            {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi; jonli darsda — reveal'dan keyin */}
            {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
              <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>
            )}
          </QTestJavob>
        )}
      >
        {/* MD: javob topilgach (jonli darsda — natija ochilgandan keyin) savol ostida kichik karta */}
        {vizual && ((solved && revealed) || (isMentorLive && mReveal)) && <TestViz>{vizual}</TestViz>}
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </QTest>
    </Stage>
  );
};

function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.ok : T.accent;
  const R = 50, ST = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState(C);
  useEffect(() => { const t = setTimeout(() => setOff(C * (1 - PCT)), 200); return () => clearTimeout(t); }, [C, PCT]);
  return (
    <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink2 + '40'} strokeWidth={ST} />
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

const Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;

const Kw = Jx; // kod bo'yog'i: kalit so'z (tag rangi)

// ===== DARSNING O'Z QATLAMI — 11-Modul 4-dars «O'n intervyudan keyin qaysi g'oya qoladi?» (MD v3: feedback/F-1005-11modul/04-PmFinalIdea-v3.md) =====
// Bitta vizual (163/180) — «Ikki g'oya doskasi»: chapda yozuv kartalari (YozuvKarta / YozuvChip), o'ngda sanoq doskasi (SanoqDoska).
// Bitta manba: MENTOR_YOZUVLAR + SANOQ_QATORLAR (tayanch 1.3 aynan) va o'quvchi doskasi (9-ekran). Ko'rinishlar: to'liq · ixcham · o'quvchiniki · qator.
// qolip-maket: fi-savol fi-goya-b fi-tahrir fi-nom-b
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
// Bitta ipucha — harakatsizlikda (javobni aytmaydi); kalit o'zgarsa vaqt qaytadan sanaladi
const useIpucha = (faol, kalit, ms = 40000) => {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(false); if (!faol) return undefined; const t = setTimeout(() => setOn(true), ms); return () => clearTimeout(t); }, [faol, kalit, ms]);
  return on;
};
// Son sanab o'sadi (SABOQ 19); kam harakat rejimida — darrov joyida
const useSanoq = (son, ms = 90) => {
  const [k, setK] = useState(son);
  useEffect(() => {
    if (k === son) return undefined;
    if (kamHarakat()) { setK(son); return undefined; }
    const t = setTimeout(() => setK(v => v + (son > v ? 1 : -1)), ms);
    return () => clearTimeout(t);
  }, [k, son, ms]);
  return k;
};
// Uchish (FLIP): bosilgan joyning to'rtburchagi olinadi, yangi joydagi element (data-uch) o'sha nuqtadan o'z joyiga suriladi
const uchir = (dan, el, ms = 600) => {
  if (!dan || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !dan.width) return;
  const z = (el.offsetWidth || g.width) / g.width;
  const dx = ((dan.left + dan.width / 2) - (g.left + g.width / 2)) * z;
  const dy = ((dan.top + dan.height / 2) - (g.top + g.height / 2)) * z;
  const s = Math.min(2.4, Math.max(0.4, dan.width / g.width));
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.8 }, { transform: 'translate(0, 0) scale(1)', opacity: 1 }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' });
};
const useUchish = () => {
  const q = useRef([]);
  useLayoutEffect(() => {
    if (!q.current.length) return;
    const navbat = q.current; q.current = [];
    navbat.forEach(u => uchir(u.r, document.querySelector(`.lesson-root [data-uch="${u.k}"]`), u.ms));
  });
  return useCallback((manba, k, ms) => {
    const r = manba && (manba.getBoundingClientRect ? manba.getBoundingClientRect() : manba);
    if (r) q.current.push({ r, k, ms });
  }, []);
};
// O'qituvchi eslatmasi — faqat mentor ko'rinishida (MD aytgan joylarda)
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="fi-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="fi-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="fi-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
};
// 151-qonun: nishon sharti (birinchi urinish); olingach yoki mashq-o'tishida ko'rinmaydi
const NishonQatori = ({ screen }) => {
  const olingan = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const { isMentor } = useJonli();
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || isMentor || (olingan && olingan.has(ach))) return null;
  const ketdi = am.missed.has(sid);
  return <p className={cxx('fi-nishon', ketdi && 'ketdi')}>{ketdi ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</p>;
};
// Jonli dars: hook ovozlari chizig'i (sof so'rovnoma, J-026)
const OvozChizigi = ({ live, screen, variantlar, mening }) => {
  const [son, setSon] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!pin) return undefined;
    let on = true, t = null;
    const ayl = async () => {
      try { const rows = await liveAnswers(pin, screen); if (on) setSon(variantlar.map((_, i) => rows.filter(r => r.picked === i).length)); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(ayl, 3000);
    };
    ayl();
    return () => { on = false; clearTimeout(t); };
  }, [pin, screen]); // eslint-disable-line
  if (!son) return null;
  const jami = son.reduce((a, b) => a + b, 0);
  return (
    <div className="fi-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={cxx('fi-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="fi-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>)}
    </div>
  );
};
// Mentor statistikasi (9, 10-ekran): o'quvchilar yuborgan mashq signali (500+ zona) bo'yicha ikki son
const MentorSanoq = ({ screen, yorliqlar, hisob }) => {
  const { live, isMentor } = useJonli();
  const pin = live && live.pin;
  const [d, setD] = useState(null);
  useEffect(() => {
    if (!isMentor || !pin) return undefined;
    let on = true, t = null;
    const ayl = async () => {
      try { const [p, r] = await Promise.all([livePlayers(pin), liveAnswers(pin, PRACTICE_BASE + screen)]); if (on) setD({ jami: p.length, rows: r }); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(ayl, 3000);
    };
    ayl();
    return () => { on = false; clearTimeout(t); };
  }, [isMentor, pin, screen]); // eslint-disable-line
  if (!isMentor) return null;
  const sonlar = d ? hisob(d.rows, d.jami) : yorliqlar.map(() => '—');
  return <div className="fi-mstat fade-up">{yorliqlar.map((y, i) => <div key={i} className="fi-mstat-q"><b>{sonlar[i]}</b><span>{tr(y)}</span></div>)}</div>;
};
// Kod-ekran: jonli darsda sinf holati (o'quvchiga ko'rinmaydi — PM-082 f)
const SinfHolat = ({ live, screen }) => {
  const [d, setD] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!pin) return undefined;
    let on = true, t = null;
    const ayl = async () => {
      try { const [pl, rows] = await Promise.all([livePlayers(pin), liveAnswers(pin, PRACTICE_BASE + screen)]); if (on) setD({ jami: pl.length, ok: new Set(rows.map(r => r.player_id)).size }); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(ayl, 3000);
    };
    ayl();
    return () => { on = false; clearTimeout(t); };
  }, [pin, screen]);
  if (!d) return null;
  return <p className="fi-sinf">{tr({ uz: `Sinfda: ${d.ok} bajardi · ${Math.max(0, d.jami - d.ok)} hali bajarmoqda`, ru: `В классе: ${d.ok} выполнили · ${Math.max(0, d.jami - d.ok)} ещё выполняют` })}</p>;
};
// Bosiladigan joy halqasi (SABOQ 11, 32): accent halqa, juda yengil to'lqin; guruhda — bitta halqa guruh atrofida
const halqa = (on) => (on ? 'fi-halqa' : undefined);
const T_TAXMIN = { uz: 'Taxminingiz', ru: 'Ваше предположение' };
const T_TOGRI_CHIQDI = { uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' };
const T_DAVOM = { uz: 'Davom etish', ru: 'Продолжить' };
const T_BASH_Y = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const T_YORDAM = { uz: 'Yordam', ru: 'Подсказка' };
const T_SAQLASH = { uz: 'Saqlash', ru: 'Сохранить' };
const T_QOLDIR = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставить так — нажмите «Сохранить» ещё раз.' };
// Bashorat: tanlovgacha karta (variantlar guruhida bitta halqa), tanlangach — ixcham qator «Taxminingiz: …» (SABOQ 11)
const Bashorat = ({ savol, variantlar, tanlov, onTanla, yorliq }) => (tanlov == null
  ? <div className="fi-bash"><QBashorat yorliq={yorliq || tr(T_BASH_Y)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="fi-bashq fade-step"><span>{tr(savol)}</span><span className="fi-bashq-t">{tr(T_TAXMIN)}: <b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></span></div>);
// Natija qatori (QTaxmin ma'nosi): xulosaning birinchi qatori (SABOQ 25)
const TaxminQator = ({ variantlar, tanlov, togri, haqiqat, haqYorliq }) => {
  const v = variantlar.find(x => x.k === tanlov);
  if (!v) return null;
  return tanlov === togri
    ? <span className="fi-tx ok">{tr(T_TOGRI_CHIQDI)} <b>✓</b></span>
    : <span className="fi-tx">{tr(T_TAXMIN)}: {tr(v.t).toLowerCase()} <b className="yoq">✕</b> · {tr(haqYorliq || { uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(haqiqat)}</b></span>;
};

// ----- Ma'lumot: Mentorning 10 yozuvi va sanoq (tayanch 1.3 AYNAN; 04-FILTR 4, 5) -----
const GOYA_NOM = { jamoa: { uz: "Jamoa yig'ish", ru: 'Сбор команды' }, togarak: { uz: "Mahalla to'garaklari", ru: 'Кружки махалли' } };
const GOYA_KIM = { jamoa: { uz: "mahalladagi o'yinchilar", ru: 'игроки махалли' }, togarak: { uz: "to'garak izlayotgan o'smirlar", ru: 'подростки, которые ищут кружок' } };
const GOYALAR = ['jamoa', 'togarak'];
const CHIZIQ = { uz: '—', ru: '—' };
const MENTOR_YOZUVLAR = [
  { n: 1, goya: 'jamoa', guruh: 'oyinchi', muammo: true, belgi: true, kim: { uz: "o'yinchi, 15 yosh", ru: 'игрок, 15 лет' },
    oxirgi: { uz: "o'tgan shanba: 10 kishi kerak edi, 7 kishi keldi", ru: 'в прошлую субботу: нужно было 10 человек, пришли 7' },
    qanday: { uz: "Telegram guruhida «kim keladi?» deb yozdi", ru: 'написал в Telegram-группе «кто придёт?»' },
    qiyin: { uz: "kim «+» qo'ygani xabarlar orasida yo'qoldi", ru: 'кто поставил «+», потерялось среди сообщений' }, hozir: { uz: 'Telegram guruhi', ru: 'Telegram-группа' } },
  { n: 2, goya: 'jamoa', guruh: 'oyinchi', muammo: true, belgi: true, kim: { uz: "o'yinchi, 14 yosh", ru: 'игрок, 14 лет' },
    oxirgi: { uz: 'kecha: ikki kishi oxirgi daqiqada kelmadi', ru: 'вчера: двое не пришли в последнюю минуту' },
    qanday: { uz: "tanishlariga birma-bir qo'ng'iroq qildi", ru: 'обзвонил знакомых по одному' },
    qiyin: { uz: 'kim aniq kelishini bilmadi', ru: 'не знал, кто точно придёт' }, hozir: { uz: "Telegram guruhi va qo'ng'iroq", ru: 'Telegram-группа и звонки' } },
  { n: 3, goya: 'jamoa', guruh: 'oyinchi', muammo: true, belgi: true, kim: { uz: "o'yinchi, 16 yosh, o'yinni ko'pincha o'zi yig'adi", ru: 'игрок, 16 лет, часто сам собирает игру' },
    oxirgi: { uz: "uch kun oldin: 6 kishi yig'ildi, o'yin bo'lmadi", ru: 'три дня назад: собралось 6 человек, игры не было' },
    qanday: { uz: 'guruhga uch marta yozdi', ru: 'три раза написал в группу' },
    qiyin: { uz: 'javoblar boshqa xabarlar ostida qoldi', ru: 'ответы остались под другими сообщениями' }, hozir: { uz: 'Telegram guruhi', ru: 'Telegram-группа' } },
  { n: 4, goya: 'jamoa', guruh: 'oyinchi', muammo: false, belgi: false, kim: { uz: "o'yinchi, 13 yosh", ru: 'игрок, 13 лет' },
    oxirgi: { uz: "o'tgan hafta: hamma keldi", ru: 'на прошлой неделе: пришли все' },
    qanday: { uz: "akasi guruhda yig'di", ru: 'брат собрал в группе' },
    qiyin: { uz: "«qiyin bo'lmadi»", ru: '«трудно не было»' }, hozir: { uz: 'Telegram guruhi', ru: 'Telegram-группа' } },
  { n: 5, goya: 'jamoa', guruh: 'oyinchi', muammo: true, belgi: true, kim: { uz: "o'yinchi, 15 yosh", ru: 'игрок, 15 лет' },
    oxirgi: { uz: 'yakshanba: 10 kerak edi, 8 kishi keldi', ru: 'в воскресенье: нужно было 10, пришли 8' },
    qanday: { uz: 'guruhga yozdi, maydonda kutdi', ru: 'написал в группу, ждал на поле' },
    qiyin: { uz: "javoblar yo'qoldi, kim kelishini bilmadi", ru: 'ответы потерялись, не знал, кто придёт' }, hozir: { uz: 'Telegram guruhi', ru: 'Telegram-группа' } },
  { n: 6, goya: 'togarak', guruh: 'osmir', muammo: true, belgi: false, kim: { uz: "o'smir, 14 yosh", ru: 'подросток, 14 лет' },
    oxirgi: { uz: 'yozda: robototexnika to\'garagini qidirdi, topolmadi', ru: 'летом: искал кружок робототехники, не нашёл' },
    qanday: { uz: "onasi tanishlaridan so'radi", ru: 'мама спросила у знакомых' },
    qiyin: { uz: "qayerda va qachon ekani noma'lum", ru: 'неизвестно, где и когда' }, hozir: { uz: 'ota-onaning tanishlari', ru: 'знакомые родителей' } },
  { n: 7, goya: 'togarak', guruh: 'ota-ona', muammo: true, belgi: true, kim: { uz: "ota-ona (o'g'li 13 yoshda)", ru: 'родитель (сыну 13 лет)' },
    oxirgi: { uz: "sentabrda: suzish to'garagini qidirdi", ru: 'в сентябре: искал кружок плавания' },
    qanday: { uz: "mahalla guruhida va tanishlardan so'radi", ru: 'спросил в группе махалли и у знакомых' },
    qiyin: { uz: "jadvalni bilish uchun borib ko'rish kerak", ru: 'чтобы узнать расписание, надо идти и смотреть' }, hozir: { uz: 'tanishlar', ru: 'знакомые' } },
  { n: 8, goya: 'togarak', guruh: 'osmir', muammo: false, belgi: false, kim: { uz: "o'smir, 15 yosh", ru: 'подросток, 15 лет' },
    oxirgi: { uz: "«hech izlamaganman — onam biladi»", ru: '«никогда не искал — мама знает»' },
    qanday: CHIZIQ, qiyin: CHIZIQ, hozir: { uz: 'onasi tanlaydi', ru: 'выбирает мама' }, iqtibos: { uz: '«onam biladi»', ru: '«мама знает»' } },
  { n: 9, goya: 'togarak', guruh: 'osmir', muammo: false, belgi: false, kim: { uz: "o'smir, 13 yosh", ru: 'подросток, 13 лет' },
    oxirgi: { uz: "«to'garakni dadam topadi, men bilmayman»", ru: '«кружок находит папа, я не знаю»' },
    qanday: CHIZIQ, qiyin: CHIZIQ, hozir: { uz: 'dadasi tanlaydi', ru: 'выбирает папа' }, iqtibos: { uz: '«dadam topadi»', ru: '«папа находит»' } },
  { n: 10, goya: 'togarak', guruh: 'ota-ona', muammo: true, belgi: false, kim: { uz: 'ota-ona (qizi 14 yoshda)', ru: 'родитель (дочери 14 лет)' },
    oxirgi: { uz: "avgustda: rasm to'garagi", ru: 'в августе: кружок рисования' },
    qanday: { uz: "tanishlardan so'radi, uch joyga borib ko'rdi", ru: 'спросил у знакомых, сходил в три места' },
    qiyin: { uz: "vaqtini bilish uchun har biriga borish kerak bo'ldi", ru: 'чтобы узнать время, пришлось идти в каждое' }, hozir: { uz: 'tanishlar', ru: 'знакомые' } }
];
const yozuvlarG = (g) => MENTOR_YOZUVLAR.filter(y => y.goya === g);
const BELGI_HA = { uz: 'kun belgiladi', ru: 'назначил день' };
const BELGI_YOQ = { uz: "yo'q", ru: 'нет' };
// Doska qatorlari: savol-tugma (2, 4-ekran) · nom · har g'oyada son, mos yozuvlar va qisqa javob (tayanch 1.3)
const SANOQ_QATORLAR = [
  { id: 'muammo', maydon: 'oxirgi', savol: { uz: "Oxirgi marta muammo bo'ldimi?", ru: 'Была ли проблема в последний раз?' }, nom: { uz: "Muammo bo'lgan", ru: 'Была проблема' },
    jamoa: { n: 4, yozuvlar: [1, 2, 3, 5] }, togarak: { n: 3, yozuvlar: [6, 7, 10], ost: { uz: '2 tasi izlamagan: «onam biladi»', ru: '2 не искали: «мама знает»' } } },
  { id: 'hozir', maydon: 'hozir', savol: { uz: 'Hozir nima bilan hal qilyapti?', ru: 'Чем решает сейчас?' }, nom: { uz: 'Hozir nima bilan', ru: 'Чем сейчас' },
    jamoa: { n: 5, yozuvlar: [1, 2, 3, 4, 5], matn: { uz: 'Telegram guruhi', ru: 'Telegram-группа' } }, togarak: { n: 3, yozuvlar: [6, 7, 10], matn: { uz: 'tanishlar orqali', ru: 'через знакомых' } } },
  { id: 'qiyin', maydon: 'qiyin', savol: { uz: "Eng qiyini nima bo'ldi?", ru: 'Что было труднее всего?' }, nom: { uz: 'Eng qiyini', ru: 'Труднее всего' },
    jamoa: { n: 3, yozuvlar: [1, 3, 5], matn: { uz: "javoblar yo'qoladi", ru: 'ответы теряются' } }, togarak: { n: 3, yozuvlar: [6, 7, 10], matn: { uz: 'qayerda va qachon — bilinmaydi', ru: 'где и когда — неизвестно' } } },
  { id: 'belgi', maydon: 'belgi', savol: { uz: 'Belgilarni ochish', ru: 'Открыть знаки' }, nom: { uz: 'Harakat belgisi', ru: 'Знак действия' },
    jamoa: { n: 4, yozuvlar: [1, 2, 3, 5] }, togarak: { n: 1, yozuvlar: [7] } }
];
const SQ = Object.fromEntries(SANOQ_QATORLAR.map(q => [q.id, q]));
const mUstun = (x = {}) => GOYALAR.map(g => ({ k: g, nom: tr(GOYA_NOM[g]), ...(x[g] || {}) }));
// Mentor doskasining katagi: beshta nuqta (yozuv raqami ostida), son, qisqa javob, kulrang ost-qator
const mKatak = (q, g, ajr = {}) => {
  const s = q[g];
  return { n: s.n, jami: 5, nuqta: yozuvlarG(g).map(y => ({ r: y.n, on: s.yozuvlar.includes(y.n), farq: ajr.farq === y.n })), matn: s.matn && tr(s.matn), ost: s.ost && tr(s.ost), ostAjrat: ajr.ost };
};
const mQator = (id, holat, x = {}) => {
  const q = SQ[id];
  return { id, nom: tr(q.nom), holat, kat: { jamoa: mKatak(q, 'jamoa', x.jamoa), togarak: mKatak(q, 'togarak', x.togarak) }, ...x };
};
const yozuvMos = (id, y) => SQ[id][y.goya].yozuvlar.includes(y.n);

// ----- Vizual: yozuv kartasi, yozuv chipi, sanoq doskasi -----
// holat: 'yopiq' (faqat raqam) · 'ochiq' (raqam + Kim) · 'mos' (accent fon, ✓) · 'kul' (mos emas) · maydon — joriy savolga javob qatori
const javobMatn = (y, maydon) => (maydon === 'belgi' ? tr(y.belgi ? BELGI_HA : BELGI_YOQ) : tr(y[maydon]));
const YozuvKarta = ({ y, holat = 'ochiq', maydon, i = 0, ajrat, className }) => (
  <div className={cxx('fi-yk', holat, ajrat && 'ajrat', className)} style={{ '--i': i }} data-yk={y.n}>
    <span className="fi-yk-n">{y.n}</span>
    <span className="fi-yk-b">
      {holat === 'yopiq'
        ? <span className="fi-yk-parda">{tr({ uz: 'yopiq', ru: 'закрыто' })}</span>
        : <span className="fi-yk-kim">{tr(y.kim)}</span>}
      {holat !== 'yopiq' && maydon && <span className={cxx('fi-yk-j', maydon === 'belgi' && (y.belgi ? 'ha' : 'yoq'))} key={maydon}>{javobMatn(y, maydon)}</span>}
    </span>
    {holat === 'mos' && <i className="fi-yk-ok" aria-hidden="true">✓</i>}
  </div>
);
// Ixcham ko'rinish: raqam-yorliq (✓ — shu qatorda mos), ichida ixtiyoriy qisqa yorliq
const YozuvChip = ({ y, ok, yon, i = 0, children, className }) => (
  <span className={cxx('fi-yc', ok && 'ok', yon && 'yon', className)} style={{ '--i': i }} data-yc={y.n}>
    <b>{y.n}</b>{ok && <i aria-hidden="true">✓</i>}{children}
  </span>
);
// Son sanab o'sadi — katak birinchi marta to'lganda 0 dan
const SonKatak = ({ n, jami, toldi }) => {
  const k = useSanoq(toldi ? n : 0, 110);
  return <span className={cxx('fi-sd-son', toldi && 'toldi')}>{toldi ? k : '?'} / {jami}</span>;
};
const SdKatak = ({ c, toldi, kichik }) => (
  <div className={cxx('fi-sd-k', toldi && 'toldi')}>
    <span className="fi-sd-kq"><span className="fi-nq" aria-hidden="true">{c.nuqta.map((d, i) => <i key={i} className={cxx(toldi && d.on && 'on', toldi && d.farq && 'farq')} style={{ '--i': i }}>{!kichik && <b>{d.r}</b>}</i>)}</span>
    <SonKatak n={c.n} jami={c.jami} toldi={toldi} /></span>
    {toldi && c.matn && <span className="fi-sd-m">{c.matn}</span>}
    {toldi && c.ost && <span className={cxx('fi-sd-ost', c.ostAjrat && 'ajrat')}>{c.ost}</span>}
  </div>
);
// SanoqDoska: ustunlar [{ k, nom, ust?, ost? }] · qatorlar [{ id, nom, holat: 'bosh'|'kul'|'savol'|'toldi', savol?, yangi?, ajrat?, kat: { [k]: katak } }]
const SanoqDoska = ({ ustunlar, qatorlar, kichik, className, uch, sarlavhasiz }) => (
  <div className={cxx('fi-sd', kichik && 'kichik', className)} data-uch={uch}>
    {!sarlavhasiz && <div className="fi-sd-h"><span className="fi-sd-hl" />{ustunlar.map(u => <div key={u.k} className="fi-sd-hc" data-ust={u.k}>{u.ust}<span className="fi-sd-nom">{u.nom}</span>{u.ost}</div>)}</div>}
    {qatorlar.map((r, ri) => (
      <div key={r.id} className={cxx('fi-sd-q', r.holat, r.yangi && 'yangi', r.ajrat && 'ajrat')} style={{ '--r': ri }} data-sq={r.id}>
        <span className="fi-sd-nm">{r.nom}</span>
        {r.holat === 'savol'
          ? <div className="fi-sd-sv">{r.savol}</div>
          : ustunlar.map(u => <SdKatak key={u.k} c={r.kat[u.k]} toldi={r.holat === 'toldi'} kichik={kichik} />)}
      </div>
    ))}
  </div>
);
// Ikki ustunli yozuvlar: «Jamoa yig'ish» (1–5) · «Mahalla to'garaklari» (6–10); ustun nomi doska ustuni bilan bir (SABOQ 35)
const YozuvUstunlar = ({ render, ust, ost, className }) => (
  <div className={cxx('fi-yu', className)}>
    {GOYALAR.map(g => (
      <div key={g} className={cxx('fi-yu-c', g)}>
        <div className="fi-yu-h">{tr(GOYA_NOM[g])}{ust && ust(g)}</div>
        <div className="fi-yu-ro">{yozuvlarG(g).map((y, i) => render(y, i))}</div>
        {ost && ost(g)}
      </div>
    ))}
  </div>
);
// Chap — yozuvlar, o'ng — doska (SABOQ 21)
const Doska2 = ({ chap, ong, className }) => <div className={cxx('fi-d2', className)}><div className="fi-d2-l">{chap}</div><div className="fi-d2-r">{ong}</div></div>;

// ===== SCREEN 0 — KIRISH (QKirish: sof so'rovnoma, J-026 — hammaga correct: false, maqtovsiz) · maket: ikki g'oya va o'nta yopiq yozuv =====
const HOOK_OPTS = [
  { id: 'yoqadi', t: { uz: "Qaysi biri o'zimga ko'proq yoqishiga", ru: 'Какая больше нравится мне самому' } },
  { id: 'tez', t: { uz: 'Qaysi birini tezroq qura olishimga', ru: 'Какую я смогу построить быстрее' } },
  { id: 'kop', t: { uz: "Qaysi muammo ko'proq odamda borligiga", ru: 'Какая проблема есть у большего числа людей' } }
];
const HookMaket = ({ ochildi }) => (
  <div className="fi-hm">
    <span className="fi-kul">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</span>
    <YozuvUstunlar className="fi-hm-yu"
      ust={(g) => <span className="fi-yu-kim">{tr(GOYA_KIM[g])}</span>}
      render={(y) => <YozuvKarta key={y.n} y={y} holat={y.n <= ochildi ? 'ochiq' : 'yopiq'} className={y.n <= ochildi ? 'ochildi' : undefined} />}
      ost={() => ochildi >= 10 && <span className="fi-yu-son fade-step">? / 5</span>} />
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [ochildi, setOchildi] = useState(storedAnswer ? 10 : 0);
  // Tanlovdan keyin o'nta yopiq yozuv navbat bilan (100 ms) ochiladi — Kim qatori chiqadi; oxirida «? / 5»
  useEffect(() => {
    if (picked === null || ochildi >= 10) return undefined;
    if (kamHarakat()) { setOchildi(10); return undefined; }
    const t = setTimeout(() => setOchildi(o => o + 1), ochildi === 0 ? 380 : 100);
    return () => clearTimeout(t);
  }, [picked, ochildi]);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr(T_DAVOM)} onClick={onNext} />}>
      <div className={cxx('fi-s0', picked === null && !isMentor && 'tanlovsiz')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>O'n intervyudan keyin <A>qaysi g'oya qoladi?</A></>, ru: <>Какая идея <A>останется</A> после десяти интервью?</> })}
          mentor={<Mentor>{tr({ uz: "Ikki g'oya bo'yicha intervyular tugadi — endi bittasini tanlash kerak. Siz g'oyani nimaga qarab tanlardingiz?", ru: 'Интервью по двум идеям закончились — теперь нужно выбрать одну. По чему вы бы выбирали идею?' })}</Mentor>}
          maket={<HookMaket ochildi={ochildi} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
          javob={<>
            {picked !== null && <p className="fi-javob fade-step">{tr({ uz: "Uchalasining ham sababi bor. Qiziqish va qurish vaqti saralashda ko'rilgan — bugun yozuvlar nima deyishini sanaymiz.", ru: 'У всех трёх есть основание. Интерес и время на постройку смотрели при отборе — сегодня посчитаем, что говорят записи.' })}</p>}
            {isLive && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        />
      </div>
      <MentorNote>{tr({ uz: "Javobni muhokama qilmang — 2 va 4-ekranlar o'zi ochadi. Uyda o'nta yozuv yig'magan o'quvchi ham tanlaydi: 9-ekranda bor yozuvlari bilan sanaydi. To'garak kartasidagi «Kim uchun» — 1-dars yozuvi («to'garak izlayotgan o'smirlar»); bu darsda yozuvlar shu qatorni tekshiradi.", ru: 'Не обсуждайте ответ — 2-й и 4-й экраны откроют сами. Выбирает и тот, кто не собрал дома десять записей: на 9-м экране он посчитает те, что есть. «Для кого» на карточке кружков — запись 1-го урока («подростки, которые ищут кружок»); в этом уроке записи проверяют эту строку.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda doska shakli — ustun va qator nomlari bilan, nuqtalar navbat bilan; kashfiyot ochilmaydi) =====
const YouTube = () => <span className="fi-yt">YouTube</span>;
const REJA = [
  { t: { uz: "Ikki g'oya bo'yicha takrorlangan javoblarni sanaysiz", ru: 'Посчитаете повторяющиеся ответы по двум идеям' }, teg: { uz: 'sanoq', ru: 'подсчёт' } },
  { t: { uz: 'Kim faqat gapirganini, kim ish qilganini ajratasiz', ru: 'Отделите тех, кто только говорил, от тех, кто сделал дело' }, teg: { uz: 'harakat belgisi', ru: 'знак действия' } },
  { t: { uz: <><YouTube /> qanday g'oyadan boshlanganini ko'rasiz</>, ru: <>Увидите, с какой идеи начинался <YouTube /></> }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: "O'z yozuvlaringizdan bitta g'oyani tanlab, muammo gapini yozasiz", ru: 'Выберете одну идею по своим записям и напишете фразу о проблеме' }, teg: { uz: "final g'oya", ru: 'финальная идея' } }
];
const RejaChizma = () => (
  <div className="fi-rj">
    <div className="fi-rj-fin"><span>{tr({ uz: "Final g'oya", ru: 'Финальная идея' })}</span><b>?</b></div>
    <SanoqDoska kichik className="fi-rj-sd" ustunlar={mUstun()} qatorlar={SANOQ_QATORLAR.map(q => mQator(q.id, 'bosh'))} />
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun o'nta yozuvdan <A>bitta g'oyani</A> tanlaysiz.</>, ru: <>Сегодня из десяти записей вы выберете <A>одну идею</A>.</> })}
      mentor={<Mentor>{tr({ uz: "Intervyu savollari ikkala g'oyaga bir xil edi — shuning uchun javoblarni yonma-yon sanash mumkin.", ru: 'Вопросы интервью были одинаковыми для обеих идей — поэтому ответы можно считать рядом.' })}</Mentor>}
      chapYorliq={tr({ uz: "Dars oxirida: takrorlangan javoblar va final g'oya", ru: 'В конце урока: повторяющиеся ответы и финальная идея' })}
      chap={<RejaChizma />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — TAKRORLANGAN JAVOBLAR (QTushuncha markaziy: bashorat → uch savol-tugma doskada → kartalarga javob yoziladi, doska to'ladi → atama) =====
const S2_TAXMIN = [
  { k: 'jamoa', t: { uz: "Jamoa yig'ishda", ru: 'В сборе команды' } },
  { k: 'teng', t: { uz: 'Ikkalasida teng', ru: 'Поровну в обеих' } },
  { k: 'togarak', t: { uz: "Mahalla to'garaklarida", ru: 'В кружках махалли' } }
];
const S2_SAVOL = { uz: "Qaysi g'oyada muammo ko'proq yozuvda chiqadi?", ru: 'В какой идее проблема встречается в большем числе записей?' };
const S2_IDS = ['muammo', 'hozir', 'qiyin'];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [yangi, setYangi] = useState(null);
  const done = q >= 3;
  const tugadi = useTugadi(done, 2800, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1500); return () => clearTimeout(t); }, [yangi]);
  const bos = (i) => { if (!taxmin || i !== q) return; setQ(i + 1); setYangi(i); };
  const joriyId = q > 0 ? S2_IDS[q - 1] : null;
  const qatorlar = [
    ...S2_IDS.map((id, i) => (i < q
      ? mQator(id, 'toldi', { yangi: yangi === i })
      : { id, nom: tr(SQ[id].nom), holat: 'savol', savol: <button type="button" className={cxx('fi-savol', halqa(!!taxmin && i === q))} disabled={!taxmin || i !== q} onClick={() => bos(i)}>{tr(SQ[id].savol)}</button> })),
    mQator('belgi', 'kul')
  ];
  const chap = tugadi
    ? <YozuvUstunlar className="ixcham" render={(y, i) => <YozuvChip key={y.n} y={y} ok={y.muammo} i={i} />} />
    : <YozuvUstunlar render={(y, i) => <YozuvKarta key={`${y.n}-${joriyId || 'o'}`} y={y} i={i} holat={joriyId ? (yozuvMos(joriyId, y) ? 'mos' : 'kul') : 'ochiq'} maydon={joriyId && SQ[joriyId].maydon} />} />;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · takrorlangan javob', ru: 'Понятие · повторяющийся ответ' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr(T_DAVOM) : `${tr({ uz: 'Savollarni bosing', ru: 'Нажмите на вопросы' })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Qaysi javob <A>bir necha yozuvda</A> chiqdi?</>, ru: <>Какой ответ встретился <A>в нескольких записях</A>?</> })}
        mentor={<Mentor>{tr({ uz: 'Doskadagi savollarni birma-bir bosing va yozuvlarga qarang.', ru: 'Нажимайте вопросы на доске по одному и смотрите на записи.' })}</Mentor>}
        bashorat={!done && <Bashorat savol={S2_SAVOL} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<Doska2 className={cxx(tugadi && 'tugadi')} chap={chap} ong={<SanoqDoska ustunlar={mUstun()} qatorlar={qatorlar} />} />}
        natija={done ? <QIzoh>{tr({ uz: "Bir necha yozuvda bir xil ma'noda qaytgan javob — takrorlangan javob.", ru: 'Ответ, который с тем же смыслом вернулся в нескольких записях, — повторяющийся ответ.' })}</QIzoh>
          : ipucha && <QIzoh>{tr({ uz: 'Doskadagi yoqilgan savolni bosing — yozuvlar javob beradi.', ru: 'Нажмите активный вопрос на доске — записи ответят.' })}</QIzoh>}
        xulosa={done && <><TaxminQator variantlar={S2_TAXMIN} tanlov={taxmin} togri="jamoa" haqiqat={{ uz: "jamoa yig'ishda", ru: 'в сборе команды' }} />{tr({ uz: "Bu misolda muammo ikkala g'oyada ham takrorlandi: farq — bitta yozuv.", ru: 'В этом примере проблема повторилась в обеих идеях: разница — одна запись.' })}</>}
      />
      <MentorNote>{tr({ uz: "9-Modulda besh yozuvdan bitta muammo topilgan edi — bugun ikki g'oya yonma-yon sanaladi; savollar bir xil bo'lgani uchun qatorlar solishtiriladi. Sinfdan so'rang: «Hozir nima bilan» qatorida jamoada 5 / 5 — bu nimani bildiradi? (Hammada hozirgi yo'l bor — Telegram guruhi; yangi mahsulot shu yo'ldan qulayroq bo'lishi kerak.) 2-yozuvdagi «kim aniq kelishini bilmadi» 8-ekranda muammo gapiga kiradi.", ru: 'В 9-м модуле из пяти записей нашли одну проблему — сегодня две идеи считают рядом; вопросы одинаковые, поэтому строки можно сравнивать. Спросите класс: в строке «Чем сейчас» у команды 5 / 5 — что это значит? (У всех есть нынешний способ — Telegram-группа; новый продукт должен быть удобнее него.) «Не знал, кто точно придёт» из 2-й записи войдёт во фразу о проблеме на 8-м экране.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ D, INLINE_KEYS.s3 = 3; savol ustida yorliq yo'q — SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · takrorlangan javob', ru: 'Проверка · повторяющийся ответ' })}
    questionText="Muammo jamoada 4 yozuvda, to'garakda 3 tasida. Bu nima degani?"
    question={tr({ uz: <h2 className="title h-ask">Muammo jamoada 4 yozuvda, to'garakda 3 tasida. <A>Bu nima degani?</A></h2>, ru: <h2 className="title h-ask">Проблема в команде — в 4 записях, в кружках — в 3. <A>Что это значит?</A></h2> })}
    options={[
      { uz: "Jamoa yig'ish g'oyasi endi isbotlandi", ru: 'Идея сбора команды теперь доказана' },
      { uz: "To'garak g'oyasida muammo umuman yo'q", ru: 'В идее кружков проблемы нет совсем' },
      { uz: "Bu sonlardan hech narsa bilib bo'lmaydi", ru: 'Из этих чисел ничего не узнать' },
      { uz: "Muammo ikkala g'oyada ham takrorlangan", ru: 'Проблема повторилась в обеих идеях' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Farq — bitta yozuv: muammo ikkala g'oyada ham bir necha odamda bor.", ru: 'Разница — одна запись: проблема есть у нескольких людей в обеих идеях.' }}
    explainWrong={{
      0: { uz: 'Bitta yozuv farqi — belgi, isbot emas.', ru: 'Разница в одну запись — признак, а не доказательство.' },
      1: { uz: "To'garakda ham uch yozuvda muammo bo'lgan.", ru: 'В кружках проблема тоже была в трёх записях.' },
      2: { uz: "Sanoq ikki g'oyani yonma-yon ko'rsatadi.", ru: 'Подсчёт показывает две идеи рядом.' },
      default: { uz: 'Doskadagi birinchi qatorni eslang: sonlar qanday?', ru: 'Вспомните первую строку доски: какие там числа?' }
    }}
    vizual={<SanoqDoska kichik className="fi-sd-1" ustunlar={mUstun()} qatorlar={[mQator('muammo', 'toldi', { jamoa: { farq: 5 } })]} />} />
);

// ===== SCREEN 4 — HARAKAT BELGISI (QTushuncha, 2 qadam): belgilar yozuv yorliqlariga tushadi → to'garak yozuvlari Kim bo'yicha ikki guruhga suriladi =====
const S4_TAXMIN = [{ k: '1', t: { uz: 'Bittasi', ru: 'Один' } }, { k: '3', t: { uz: 'Uchtasi', ru: 'Трое' } }, { k: '5', t: { uz: 'Beshtasi', ru: 'Пятеро' } }];
const S4_SAVOL = { uz: "To'garak g'oyasida nechta odam kun belgilagan?", ru: 'Сколько человек в идее кружков назначили день?' };
const S4_QADAM = [{ uz: 'Belgilar', ru: 'Знаки' }, { uz: 'Kim belgiladi', ru: 'Кто назначил' }];
const GURUH = [{ k: 'osmir', t: { uz: "o'smir", ru: 'подросток' } }, { k: 'ota-ona', t: { uz: 'ota-ona', ru: 'родитель' } }];
const S4_IZOH1 = { uz: "Harakat belgisi — odam so'z bilan emas, ish bilan ko'rsatgan qiziqish; bu misolda — sinovga kun belgiladi.", ru: 'Знак действия — интерес, который человек показал не словом, а делом; в этом примере — назначил день для пробы.' };
const S4_IZOH2 = { uz: "To'garakda kunni ota-ona belgiladi, o'smirlar esa belgilamadi.", ru: 'В кружках день назначил родитель, а подростки — нет.' };
const BelgiChip = ({ y, ochiq, i, yon, iqtibos }) => (
  <YozuvChip y={y} i={i} yon={yon} ok={ochiq && y.belgi} className={cxx('fi-yc-b', ochiq && (y.belgi ? 'ha' : 'yoq'), ochiq && 'tushdi')}>
    <span className="fi-yc-k">{tr(y.kim)}</span>
    {ochiq && <span className="fi-yc-t">{javobMatn(y, 'belgi')}</span>}
    {iqtibos && y.iqtibos && <span className="fi-yc-q fade-step">{tr(y.iqtibos)}</span>}
  </YozuvChip>
);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qadam, setQadam] = useState(storedAnswer ? 2 : 0);
  const [yangi, setYangi] = useState(false);
  const uch = useUchish();
  const done = qadam >= 2;
  const tugadi = useTugadi(done, 2800, !!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!yangi) return undefined; const t = setTimeout(() => setYangi(false), 1500); return () => clearTimeout(t); }, [yangi]);
  const belgiOch = () => { if (!taxmin || qadam !== 0) return; setQadam(1); setYangi(true); };
  // To'garak yozuvlari Kim bo'yicha guruhlarga suriladi (FLIP: eski joydan yangi joyga)
  const guruhla = () => {
    if (qadam !== 1) return;
    yozuvlarG('togarak').forEach(y => uch(document.querySelector(`.lesson-root [data-uch="s4c-${y.n}"]`), `s4c-${y.n}`, 640));
    setQadam(2);
  };
  const ochiq = qadam >= 1;
  const togarakUst = (g) => g === 'togarak' && qadam === 1 && !tugadi && <QTugma ikkinchi className={cxx('fi-kim-b', 'fi-halqa')} onClick={guruhla}>{tr({ uz: 'Kim belgiladi?', ru: 'Кто назначил?' })}</QTugma>;
  const chap = (
    <div className="fi-s4-yu">
      {GOYALAR.map(g => (
        <div key={g} className={cxx('fi-yu-c', g)}>
          <div className="fi-yu-h">{tr(GOYA_NOM[g])}{togarakUst(g)}</div>
          {g === 'togarak' && qadam >= 2
            ? <div className="fi-grplar">{GURUH.map(gr => (
                <div key={gr.k} className="fi-grp fade-step">
                  <span className="fi-grp-l">{tr(gr.t)}</span>
                  <div className="fi-yu-ro">{yozuvlarG('togarak').filter(y => y.guruh === gr.k).map((y, i) => <span key={y.n} data-uch={`s4c-${y.n}`}><BelgiChip y={y} ochiq i={i} yon={y.n === 7} iqtibos /></span>)}</div>
                </div>))}</div>
            : <div className="fi-yu-ro">{yozuvlarG(g).map((y, i) => <span key={y.n} data-uch={g === 'togarak' ? `s4c-${y.n}` : undefined}><BelgiChip y={y} ochiq={ochiq} i={i} /></span>)}</div>}
        </div>
      ))}
    </div>
  );
  const qatorlar = [
    mQator('muammo', 'toldi', qadam >= 2 ? { togarak: { ost: true }, ajrat: !tugadi } : {}),
    mQator('hozir', 'toldi'),
    mQator('qiyin', 'toldi'),
    qadam >= 1 ? mQator('belgi', 'toldi', { yangi }) : { id: 'belgi', nom: tr(SQ.belgi.nom), holat: 'savol', savol: <button type="button" className={cxx('fi-savol', halqa(!!taxmin))} disabled={!taxmin} onClick={belgiOch}>{tr(SQ.belgi.savol)}</button> }
  ];
  const navLabel = done ? tr(T_DAVOM) : qadam === 0 ? tr({ uz: '① Belgilarni oching', ru: '① Откройте знаки' }) : tr({ uz: "② Kim belgilaganini ko'ring", ru: '② Посмотрите, кто назначил' });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · harakat belgisi', ru: 'Понятие · знак действия' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Sinovga kimlar <A>kun belgiladi?</A></>, ru: <>Кто <A>назначил день</A> для пробы?</> })}
        mentor={<Mentor>{tr({ uz: "Har intervyu oxirida sinab ko'rishga vaqt so'ralgan: avval belgilarni oching.", ru: 'В конце каждого интервью просили время на пробу: сначала откройте знаки.' })}</Mentor>}
        bashorat={!done && <Bashorat savol={S4_SAVOL} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        harakat={<QQadamlar qadamlar={S4_QADAM.map(tr)} joriy={done ? undefined : qadam} />}
        vizual={<Doska2 className="fi-s4" chap={chap} ong={<SanoqDoska ustunlar={mUstun()} qatorlar={qatorlar} />} />}
        natija={ochiq && <div className="fi-izohlar">{(qadam === 1 || tugadi) && <QIzoh>{tr(S4_IZOH1)}</QIzoh>}{qadam >= 2 && <QIzoh>{tr(S4_IZOH2)}</QIzoh>}</div>}
        xulosa={done && <><TaxminQator variantlar={S4_TAXMIN} tanlov={taxmin} togri="1" haqiqat={{ uz: 'bittasi', ru: 'один' }} />{tr({ uz: "Bu misolda harakat belgisi jamoa yig'ishda kuchliroq; to'garakda ikki o'smir tanlovni ota-onasiga qoldirgan.", ru: 'В этом примере знак действия сильнее у сбора команды; в кружках двое подростков оставили выбор родителям.' })}</>}
      />
      <MentorNote>{tr({ uz: "Belgi — so'z emas, ish: «ishlatardim» degani va sinovga kun belgilash bir xil emas (9-Modulda bunday javob «va'da» deyilgan). «Yo'q» — odam qiziqmaydi degani emas: vaqti yo'q bo'lishi ham mumkin; belgi — dalillardan biri. Sinfdan so'rang: to'garak ilovasini kim ochadi, kim tanlaydi? To'garak g'oyasi yomon emas — bu yozuvlarda tanlovchi boshqa odam (ota-ona) ekani ko'rindi.", ru: 'Знак — не слово, а дело: «пользовался бы» и назначенный день для пробы — не одно и то же (в 9-м модуле такой ответ назывался «обещанием»). «Нет» не значит, что человеку неинтересно: может не быть времени; знак — один из доводов. Спросите класс: кто откроет приложение кружков, а кто выбирает? Идея кружков не плохая — в этих записях видно, что выбирает другой человек (родитель).' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; ✔ B, INLINE_KEYS.s5 = 1; ikkinchi olam — umumiy intervyu, P-002) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · harakat belgisi', ru: 'Проверка · знак действия' })}
    questionText="Mentor misolidagidek, qaysi biri harakat belgisi?"
    question={tr({ uz: <h2 className="title h-ask">Mentor misolidagidek, qaysi biri <A>harakat belgisi?</A></h2>, ru: <h2 className="title h-ask">Как в примере Ментора, что из этого — <A>знак действия?</A></h2> })}
    options={[
      { uz: "Chiqsa, ishlatib ko'rishini aytdi", ru: 'Сказал, что попробует, когда выйдет' },
      { uz: "Sinab ko'rishga o'zi kun belgiladi", ru: 'Сам назначил день, чтобы попробовать' },
      { uz: "G'oyani yoqtirganini aytib maqtadi", ru: 'Похвалил идею, сказал, что нравится' },
      { uz: 'Do\'stlari ham ishlatishini aytdi', ru: 'Сказал, что друзья тоже будут пользоваться' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Odam o'z vaqtidan kun belgiladi — bu so'z emas, ish.", ru: 'Человек выделил день из своего времени — это не слово, а дело.' }}
    explainWrong={{
      0: { uz: "Bu va'da: hali bo'lmagan ish haqida.", ru: 'Это обещание: о деле, которого ещё не было.' },
      2: { uz: "Yoqqani — so'z: odam hech narsa qilmadi.", ru: 'Понравилось — это слово: человек ничего не сделал.' },
      3: { uz: 'Bu boshqalar haqida taxmin, ish emas.', ru: 'Это догадка о других, а не дело.' },
      default: { uz: 'Odam nima qildi — shuni qidiring.', ru: 'Ищите, что человек сделал.' }
    }}
    vizual={<div className="fi-s5v"><YozuvChip y={MENTOR_YOZUVLAR[6]} ok className="fi-yc-b ha"><span className="fi-yc-t">{tr({ uz: 'Belgi: ha · kun belgiladi', ru: 'Знак: да · назначил день' })}</span></YozuvChip></div>} />
);

// ===== SCREEN 6 — YOUTUBE (QVoqea, PM keys K15 — bank matni: video-tanishuv sayti → har xil video → «hamma narsa uchun video»; raqamsiz) =====
// Manba (o'quvchi ko'rmaydi): PM_Prompt_v8.md K15 (bank: raqamsiz) · tayanch 5. «Video qo'yiladigan va ko'riladigan sayt» — brend izohi (S-018, umumiy bilim).
// Sahna — chizilgan brauzer oynasi; logotip, o'ynatish tugmasi, asoschi surati, yil va son chizilmaydi (bankda yo'q).
const YOUTUBE_BOSQICH = [
  { h: { uz: 'Tanishuv sayti', ru: 'Сайт знакомств' }, m: { uz: "YouTube avval tanishuv sayti bo'lib boshlangan: odamlar o'zi haqida video qo'yib, tanishishi kerak edi.", ru: 'YouTube начинался как сайт знакомств: люди должны были выкладывать видео о себе и знакомиться.' } },
  { h: { uz: 'Har xil video', ru: 'Разные видео' }, m: { uz: "Tanishuv g'oyasi ishlamagan. Lekin asoschilar odamlar saytga har xil video yuklayotganini payqagan.", ru: 'Идея знакомств не сработала. Но основатели заметили, что люди загружают на сайт самые разные видео.' } },
  { h: { uz: 'Hamma narsa uchun video', ru: 'Видео для всего' }, m: { uz: "Asoschilar saytni «hamma narsa uchun video» qilib o'zgartirgan — shu ishlagan.", ru: 'Основатели превратили сайт в «видео для всего» — это и сработало.' } }
];
const YT_TAXMIN = [
  { k: 'faqat', t: { uz: 'Faqat tanishuv videosini', ru: 'Только видео для знакомства' } },
  { k: 'asosan', t: { uz: 'Asosan tanishuv videosini', ru: 'В основном видео для знакомства' } },
  { k: 'har', t: { uz: 'Har xil videoni', ru: 'Самые разные видео' } }
];
const YT_SAVOL = { uz: 'Odamlar saytga qanday video yuklagan?', ru: 'Какие видео люди загружали на сайт?' };
// Video kartalari — har biri boshqa rangda, ichida boshqa chizilgan belgi (mavzu yozuvi yo'q)
const VIDEOLAR = [
  { k: 'nota', rang: '#FFE3D6' }, { k: 'top', rang: '#DDEFE4' }, { k: 'kamera', rang: '#E1E9FB' },
  { k: 'mashina', rang: '#FFF1CC' }, { k: 'gul', rang: '#F7DDEA' }, { k: 'kitob', rang: '#E8E2FA' }
];
const VideoBelgi = ({ k }) => (
  <svg className="fi-vb" viewBox="0 0 48 32" aria-hidden="true">
    {k === 'nota' && <g fill="#C2502E"><ellipse cx="18" cy="23" rx="5" ry="3.6" /><ellipse cx="31" cy="20" rx="5" ry="3.6" /><rect x="21.6" y="6" width="2.4" height="17" /><rect x="34.6" y="4" width="2.4" height="16" /><path d="M21.6 6 L37 3 L37 7 L21.6 10 Z" /></g>}
    {k === 'top' && <g><circle cx="24" cy="16" r="10" fill="#FFFFFF" stroke="#2F6B4A" strokeWidth="1.6" /><polygon points="24,11 28.5,14.3 26.8,19.5 21.2,19.5 19.5,14.3" fill="#2F6B4A" /></g>}
    {k === 'kamera' && <g><rect x="12" y="10" width="24" height="16" rx="3" fill="#3E5C9A" /><rect x="18" y="7" width="8" height="4" rx="1.5" fill="#3E5C9A" /><circle cx="24" cy="18" r="5" fill="#E1E9FB" /><circle cx="24" cy="18" r="2.6" fill="#3E5C9A" /></g>}
    {k === 'mashina' && <g><path d="M11 20 L14 13 H31 L36 20 Z" fill="#D9932B" /><rect x="9" y="19" width="30" height="6" rx="2" fill="#D9932B" /><circle cx="16" cy="26" r="3" fill="#3B3F5C" /><circle cx="32" cy="26" r="3" fill="#3B3F5C" /><rect x="17" y="15" width="6" height="4" rx="1" fill="#FFF8E4" /><rect x="25" y="15" width="6" height="4" rx="1" fill="#FFF8E4" /></g>}
    {k === 'gul' && <g><rect x="23" y="17" width="2" height="11" fill="#2F9E7A" />{[0, 72, 144, 216, 288].map(a => <ellipse key={a} cx="24" cy="10" rx="3.6" ry="5" fill="#D96C8A" transform={`rotate(${a} 24 14)`} />)}<circle cx="24" cy="14" r="3" fill="#F2C14E" /></g>}
    {k === 'kitob' && <g><path d="M10 8 Q17 6 24 9 V27 Q17 24 10 26 Z" fill="#7B61C9" /><path d="M38 8 Q31 6 24 9 V27 Q31 24 38 26 Z" fill="#9A83E0" /></g>}
  </svg>
);
// Profil-video kartasidagi odam (SABOQ 36: bosh, soch, yuz, rangli kiyim — siluet emas)
const ProfilOdam = () => (
  <svg className="fi-prof" viewBox="0 0 80 52" aria-hidden="true">
    <rect x="0" y="0" width="80" height="52" rx="5" fill="#FDE9D9" />
    <path d="M20 52 C21 38 59 38 60 52 Z" fill="#E07A5F" />
    <rect x="36.5" y="30" width="7" height="8" rx="2" fill="#E3A87C" />
    <circle cx="40" cy="22" r="10.5" fill="#E3A87C" />
    <path d="M29.5 21 C28.5 7 51.5 7 50.5 21 C46.5 15 35.5 14 29.5 21 Z" fill="#2E2019" />
    <circle cx="36.4" cy="22.6" r="1.3" fill="#2A2730" /><circle cx="43.6" cy="22.6" r="1.3" fill="#2A2730" />
    <path d="M36.8 26.6 Q40 29.4 43.2 26.6" stroke="#8A4B3A" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <circle cx="33.6" cy="26" r="1.9" fill="#E8867A" opacity="0.35" /><circle cx="46.4" cy="26" r="1.9" fill="#E8867A" opacity="0.35" />
  </svg>
);
const YouTubeSahna = ({ b }) => {
  const videolar = b === 0 ? [] : VIDEOLAR.slice(0, b === 1 ? 5 : 6);
  return (
    <div className={cxx('fi-ytb', `b${b}`)} aria-hidden="true">
      <div className="fi-br-bar"><i /><i /><i /><span className="fi-br-url" /></div>
      <div className="fi-ytb-e">
        <div className="fi-ytb-h"><YouTube />{b === 2 && <span className="fi-ytb-yorliq" key="y">{tr({ uz: 'hamma narsa uchun video', ru: 'видео для всего' })}</span>}</div>
        <div className="fi-ytb-tor">
          {b < 2 && <div className={cxx('fi-vk', 'profil', b === 1 && 'xira')}><ProfilOdam /><span className="fi-vk-l">{tr({ uz: "O'zim haqimda", ru: 'О себе' })}</span><i className="fi-vk-pl">▸</i></div>}
          {b === 0 && [0, 1].map(i => <div key={i} className="fi-vk bosh" />)}
          {videolar.map((v, i) => <div key={v.k} className="fi-vk video" style={{ '--i': i, background: v.rang }}><VideoBelgi k={v.k} /></div>)}
        </div>
      </div>
    </div>
  );
};
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [xulosaVaqt, setXulosaVaqt] = useState(!!storedAnswer);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!done || xulosaVaqt) return undefined; const t = setTimeout(() => setXulosaVaqt(true), kamHarakat() ? 0 : 1700); return () => clearTimeout(t); }, [done, xulosaVaqt]);
  const bq = YOUTUBE_BOSQICH[b];
  const kutish = b === 0 && !taxmin;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  const yorliq = <><YouTube /> · {b + 1}/3</>;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish || (done && !xulosaVaqt)} label={done ? tr(T_DAVOM) : `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/3)`} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><YouTube /> qanday g'oyadan <A>boshlangan?</A></>, ru: <>С какой идеи <A>начинался</A> <YouTube />?</> })}
        nuqtalar={<>
          <Mentor key={`m${b}`}>{tr(bq.m)}</Mentor>
          <div className="fi-nuq"><span className="fi-nuq-l">{yorliq}</span>{YOUTUBE_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="fi-voqea">
          {b === 0 && <p className="fi-yt-tanish"><YouTube /> — {tr({ uz: "video qo'yiladigan va ko'riladigan sayt.", ru: 'сайт, где выкладывают и смотрят видео.' })}</p>}
          <span className="fi-voqea-h" key={`h${b}`}>{tr(bq.h)}</span>
          <Zoomable><YouTubeSahna b={b} /></Zoomable>
          {kutish && <Bashorat yorliq={yorliq} savol={YT_SAVOL} variantlar={YT_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
          {taxmin && !(done && xulosaVaqt) && <Bashorat savol={YT_SAVOL} variantlar={YT_TAXMIN} tanlov={taxmin} />}
          {done && xulosaVaqt && <QXulosa><TaxminQator variantlar={YT_TAXMIN} tanlov={taxmin} togri="har" haqiqat={{ uz: 'har xil videoni', ru: 'самые разные видео' }} />{tr({ uz: "YouTube asoschilari g'oyani odamlar saytda nima qilayotganiga qarab o'zgartirgan.", ru: 'Основатели YouTube изменили идею, глядя на то, что люди делают на сайте.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Ko'prik: bu darsda ham yozuvlar g'oyani o'zgartirishi mumkin — to'garak yozuvlarida ikki o'smir tanlovni ota-onasiga qoldirgan. Bankdan tashqari yil, son, asoschi ismi qo'shmang; «tanishuv sayti» mavzusini kengaytirmang — voqeaning ma'nosi: odamlar nima qilganiga qarash.", ru: 'Мостик: и в этом уроке записи могут изменить идею — в записях о кружках двое подростков оставили выбор родителям. Не добавляйте лет, чисел и имён основателей вне банка; не расширяйте тему «сайта знакомств» — смысл истории: смотреть на то, что делают люди.' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; ✔ C, INLINE_KEYS.s7 = 2; YouTube voqeasi) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · YouTube', ru: 'Проверка · YouTube' })}
    questionText="YouTube asoschilari g'oyani nimaga qarab o'zgartirgan?"
    question={tr({ uz: <h2 className="title h-ask"><YouTube /> asoschilari g'oyani <A>nimaga qarab</A> o'zgartirgan?</h2>, ru: <h2 className="title h-ask"><A>На что глядя</A> основатели <YouTube /> изменили идею?</h2> })}
    options={[
      { uz: 'Raqobatchi saytlar nima qilayotganiga', ru: 'На то, что делают сайты-конкуренты' },
      { uz: 'Sayt nomi odamlarga qanchalik yoqqaniga', ru: 'На то, как людям нравится название сайта' },
      { uz: 'Odamlar saytga qanday video yuklaganiga', ru: 'На то, какие видео люди загружали на сайт' },
      { uz: "O'zlari qaysi videoni ko'proq yoqtirganiga", ru: 'На то, какие видео больше нравились им самим' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Ular odamlar har xil video yuklayotganini payqagan.', ru: 'Они заметили, что люди загружают самые разные видео.' }}
    explainWrong={{
      0: { uz: "Voqeada raqobatchilar haqida gap bo'lmadi.", ru: 'В истории не было речи о конкурентах.' },
      1: { uz: "Voqeada sayt nomi haqida gap bo'lmadi.", ru: 'В истории не было речи о названии сайта.' },
      3: { uz: 'Ular o\'zlariga emas, odamlarga qarashgan.', ru: 'Они смотрели не на себя, а на людей.' },
      default: { uz: 'Ikkinchi bosqichni eslang: asoschilar nimani payqadi?', ru: 'Вспомните второй этап: что заметили основатели?' }
    }} />
);

// ===== SCREEN 8 — FINAL G'OYA (QTushuncha markaziy, 3 qadam; SABOQ 9/13/34): Mentor tanlovi → muammo gapi yozuvlardan → nom «Maydon Jamoa» =====
const MJ_NOM = 'Maydon Jamoa';
const MaydonJamoa = () => <span className="fi-mj-nom">{MJ_NOM}</span>;
const S8_QADAM = [{ uz: 'Tanlov', ru: 'Выбор' }, { uz: 'Muammo gapi', ru: 'Фраза о проблеме' }, { uz: 'Nom', ru: 'Название' }];
const S8_MENTOR = [
  { uz: "Doskaga qarab belgilang: Mentor qaysi g'oyani bitiruvgacha quradi?", ru: 'Посмотрите на доску и отметьте: какую идею Ментор будет строить до выпуска?' },
  { uz: "Muammo gapini yozuvlardan yig'ing: har bo'lakka mos gapni tanlang.", ru: 'Соберите фразу о проблеме из записей: выберите подходящие слова для каждой части.' },
  { uz: 'Final g\'oyaga nom beramiz: Maydon Jamoa.', ru: 'Даём финальной идее название: Maydon Jamoa.' }
];
const S8_TAXMIN = GOYALAR.map(g => ({ k: g, t: GOYA_NOM[g] }));
const MUAMMO_BOLAK = [
  { k: 'kim', nom: { uz: 'Kim', ru: 'Кто' }, togri: 1, manba: [1, 2, 3, 4, 5],
    tanlov: [{ uz: 'Hamma odamlar', ru: 'Все люди' }, { uz: "O'yinchilar", ru: 'Игроки' }, { uz: 'Maydon egalari', ru: 'Владельцы полей' }],
    xato: { 0: { uz: '«Hamma» juda keng. Yozuvlarda kim gapirgan?', ru: '«Все» — слишком широко. Кто говорил в записях?' }, 2: { uz: 'Bu yozuvlarda maydon egasi gapirmagan.', ru: 'В этих записях владелец поля не говорил.' } },
    yordam: { uz: "1–5-yozuvlarda gapirganlarning hammasi maydonda o'ynaydi.", ru: 'Все, кто говорил в записях 1–5, играют на поле.' } },
  { k: 'qachon', nom: { uz: 'Qachon', ru: 'Когда' }, togri: 0, manba: [1, 3, 5],
    tanlov: [{ uz: "o'yindan oldin", ru: 'перед игрой' }, { uz: "o'yin tugagandan keyin", ru: 'после окончания игры' }, { uz: "maydon band bo'lganda", ru: 'когда поле занято' }],
    xato: { 1: { uz: "Yozuvlarda qiyinchilik o'yindan oldin bo'lgan.", ru: 'В записях трудность была до игры.' }, 2: { uz: "Band maydon — boshqa muammo; bu yerda odam yetmagan.", ru: 'Занятое поле — другая проблема; здесь не хватило людей.' } },
    yordam: { uz: "Yozuvlardagi «Oxirgi marta» qatori o'yindan oldinmi, keyinmi?", ru: 'Строка «В последний раз» в записях — до игры или после?' } },
  { k: 'nima', nom: { uz: 'Nimadan qiynaladi', ru: 'От чего страдают' }, togri: 2, manba: [1, 2, 3, 5],
    tanlov: [{ uz: 'Telegram guruhida xabar yozishda qiynaladi', ru: 'с трудом пишут сообщения в Telegram-группе' }, { uz: "o'yin e'loni ilovasi yo'qligidan qiynaladi", ru: 'страдают от того, что нет приложения для объявлений об игре' }, { uz: "jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi", ru: 'с трудом собирают достаточно людей в команду и узнают, кто точно придёт' }],
    xato: { 0: { uz: "Yozish qiyin emas — javoblar xabarlar orasida yo'qoladi.", ru: 'Писать не трудно — ответы теряются среди сообщений.' }, 1: { uz: "Bu yechim — muammo gapida ilova bo'lmaydi.", ru: 'Это решение — во фразе о проблеме приложения нет.' } },
    yordam: { uz: "Muammo gapida yechim bo'lmaydi: odam aynan nimadan qiynalgan?", ru: 'Во фразе о проблеме нет решения: от чего именно страдал человек?' } }
];
const MENTOR_GAP = { uz: "O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.", ru: 'Игрокам трудно перед игрой собрать достаточно людей в команду и узнать, кто точно придёт.' };
const T_FINAL = { uz: "Final g'oya", ru: 'Финальная идея' };
const T_KEYIN = { uz: '«Keyin»', ru: '«Потом»' };
// Final kartasi (8 va 10-ekran): final joyi · muammo gapi (bo'laklar yoki yig'ilgan gap) · dalil-qator · «Keyin» qutisi
const FinalKarta = ({ nom, nomUch, slotYorliq, slotOng, qatorlar, gap, dalil, keyin, keyinUch, keyinOst, keyinYoq, yashil, className }) => (
  <div className={cxx('fi-fk', yashil && 'yashil', className)}>
    <div className={cxx('fi-fk-slot', nom && 'bor')}><span className="fi-fk-l">{slotYorliq || tr(T_FINAL)}</span>{nom ? <span className="fi-fk-nom" data-uch={nomUch}>{nom}</span> : <b className="fi-fk-bo">?</b>}{slotOng}</div>
    {gap ? <p className="fi-fk-gap fade-step">{gap}</p> : qatorlar}
    {dalil && <span className="fi-fk-dalil fade-step">{dalil}</span>}
    {!keyinYoq && <div className={cxx('fi-fk-keyin', keyin && 'bor')}><span className="fi-fk-kl">{tr(T_KEYIN)}</span>{keyin && <span className="fi-fk-kn" data-uch={keyinUch}>{keyin}</span>}{keyinOst}</div>}
  </div>
);
// Telefon maketi (≈170×272, SABOQ 22): nom «Maydon Jamoa» harfma-harf, namuna e'lon (tayanch 9.2) — chizma, hali qurilmagan
const JamoaTelefon = ({ yoz }) => {
  const [n, setN] = useState(() => (yoz && !kamHarakat() ? 0 : MJ_NOM.length));
  useEffect(() => { if (n >= MJ_NOM.length) return undefined; const t = setTimeout(() => setN(n + 1), 85); return () => clearTimeout(t); }, [n]);
  return (
    <div className="fi-tel-w">
      <div className="fi-tel">
        <span className="fi-tel-k" />
        <div className="fi-tel-e">
          <span className="fi-tel-nom">{MJ_NOM.slice(0, n)}{n < MJ_NOM.length && <i className="fi-kursor" />}</span>
          <div className="fi-elon">
            <span className="fi-elon-q"><b>{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b><span>{tr({ uz: 'Mahalla maydoni', ru: 'Поле махалли' })}</span></span>
            <span className="fi-elon-s"><b>8 / 10</b><span className="fi-elon-d">{[...Array(10)].map((_, i) => <i key={i} className={i < 8 ? 'on' : ''} style={{ '--i': i }} />)}</span></span>
            <span className="fi-elon-b">{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
          </div>
        </div>
      </div>
      <span className="fi-kul">{tr({ uz: 'chizma — hali qurilmagan', ru: 'набросок — ещё не построено' })}</span>
    </div>
  );
};
// Ixcham Mentor doskasi (8-ekran): ustun nomi ostida yozuv raqamlari — manba yozuvlari bir lahza yonadi
const IxchamDoska = ({ yonadi = [], ajrat = [], className, uch }) => (
  <SanoqDoska kichik className={className} uch={uch} ustunlar={mUstun(Object.fromEntries(GOYALAR.map(g => [g, { ost: <span className="fi-yc-ro">{yozuvlarG(g).map((y, i) => <YozuvChip key={y.n} y={y} i={i} yon={yonadi.includes(y.n)} />)}</span> }])))}
    qatorlar={SANOQ_QATORLAR.map(q => mQator(q.id, 'toldi', { ajrat: ajrat.includes(q.id) }))} />
);
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const am = useContext(AchMissCtx);
  const { isMentor } = useJonli();
  const [tanlov, setTanlov] = useState(storedAnswer?.tanlov ?? null);
  const [qadam, setQadam] = useState(storedAnswer ? 3 : 0); // 0 tanlov · 1 muammo gapi · 2 nom · 3 tayyor
  const [b, setB] = useState(storedAnswer ? 3 : 0);
  const [xato, setXato] = useState(null);
  const [xatoBor, setXatoBor] = useState(!!storedAnswer?.xato);
  const [yonadi, setYonadi] = useState([]);
  const [dalilYon, setDalilYon] = useState(false);
  const [yangiQ, setYangiQ] = useState(null);
  const [nom, setNom] = useState(!!storedAnswer);
  const uch = useUchish();
  const refs = { jamoa: useRef(null), togarak: useRef(null) };
  const done = qadam >= 3;
  const tugadi = useTugadi(done, 1600, !!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'final', screenIdx: screen, correct: true, picked: true, tanlov, xato: xatoBor }); }, [done]); // eslint-disable-line
  // Ketma-ket qadamlar o'zi ochiladi (SABOQ 34): tanlovdan ≈2 s keyin — muammo gapi; uch bo'lakdan keyin — «Nom berish»
  useEffect(() => { if (qadam !== 0 || !tanlov) return undefined; const t = setTimeout(() => { setQadam(1); setDalilYon(false); }, kamHarakat() ? 300 : 2300); return () => clearTimeout(t); }, [qadam, tanlov]);
  useEffect(() => { if (qadam !== 1 || b < 3) return undefined; const t = setTimeout(() => setQadam(2), kamHarakat() ? 200 : 1400); return () => clearTimeout(t); }, [qadam, b]);
  useEffect(() => { if (!yonadi.length) return undefined; const t = setTimeout(() => setYonadi([]), 1500); return () => clearTimeout(t); }, [yonadi]);
  useEffect(() => { if (yangiQ === null) return undefined; const t = setTimeout(() => setYangiQ(null), 1200); return () => clearTimeout(t); }, [yangiQ]);
  useEffect(() => { if (!nom || done) return undefined; const t = setTimeout(() => setQadam(3), kamHarakat() ? 200 : 1900); return () => clearTimeout(t); }, [nom, done]);
  const tanla = (g) => {
    if (tanlov || isMentor) return;
    uch(refs.jamoa.current, 's8fin', 700); uch(refs.togarak.current, 's8key', 760);
    setTanlov(g); setDalilYon(true);
  };
  const bolakBos = (i, e) => {
    if (qadam !== 1 || b >= 3) return;
    const bq = MUAMMO_BOLAK[b];
    if (i === bq.togri) {
      uch(e.currentTarget, `s8b${b}`, 620);
      setB(b + 1); setYonadi(bq.manba); setXato(null); setYangiQ(b);
    } else {
      setXato({ i, k: Date.now() });
      if (!xatoBor) { setXatoBor(true); if (am) am.miss(screen); }
    }
  };
  const nomBer = () => { if (qadam === 2 && !nom) setNom(true); };
  const tx = (tanlov || isMentor) && !done;
  const qatorlar = MUAMMO_BOLAK.map((bq, i) => {
    const joriy = qadam === 1 && i === b;
    return (
      <div key={bq.k} className={cxx('fi-fk-q', joriy && 'joriy', i < b && 'bor', yangiQ === i && 'yangi', joriy && xato && 'xato')}>
        <span className="fi-fk-ql">{tr(bq.nom)}</span>
        {i < b ? <span className="fi-fk-qm" data-uch={`s8b${i}`}>{tr(bq.tanlov[bq.togri])}</span> : <span className="fi-fk-uzuq" />}
        {joriy && <div className="fi-fk-tan">
          <div className="fi-guruh-v">{bq.tanlov.map((t, j) => { const silk = xato && xato.i === j; return <QChip key={silk ? `${j}-${xato.k}` : j} silk={silk} holat={silk ? 'err' : undefined} className="fi-tanlov-c" style={{ '--i': j }} onClick={(e) => bolakBos(j, e)}>{tr(t)}</QChip>; })}</div>
          {xato && bq.xato[xato.i] && <QXato>{tr(bq.xato[xato.i])}</QXato>}
          {xatoBor && <QIzoh>{tr(bq.yordam)}</QIzoh>}
        </div>}
      </div>
    );
  });
  const navLabel = done ? tr(T_DAVOM) : qadam === 0 ? tr({ uz: '① Tanlang', ru: '① Выберите' }) : qadam === 1 ? `${tr({ uz: "② Muammo gapini yig'ing", ru: '② Соберите фразу о проблеме' })} (${b}/3)` : tr({ uz: '③ Nom bering', ru: '③ Дайте название' });
  const izoh = <QIzoh>{tr({ uz: "Intervyudan keyin tanlangan, bitiruvgacha quriladigan bitta g'oya — final g'oya.", ru: 'Одна идея, выбранная после интервью и которую строят до выпуска, — финальная идея.' })}</QIzoh>;
  const taxQ = <TaxminQator variantlar={S8_TAXMIN} tanlov={tanlov} togri="jamoa" haqYorliq={{ uz: 'Mentor tanlovi', ru: 'выбор Ментора' }} haqiqat={{ uz: "jamoa yig'ish", ru: 'сбор команды' }} />;
  const vizual = (
    <div className={cxx('fi-s8', tugadi && 'tugadi')}>
      <div className="fi-s8-l">
        {nom ? <JamoaTelefon yoz={!storedAnswer} /> : <IxchamDoska className="fi-s8-sd" yonadi={yonadi} ajrat={dalilYon ? ['muammo', 'belgi'] : []} />}
        {qadam === 2 && !nom && <QTugma className="fi-halqa fi-nom-tugma" onClick={nomBer}>{tr({ uz: 'Nom berish', ru: 'Дать название' })}</QTugma>}
      </div>
      <div className="fi-s8-r">
        {qadam === 0 && !tanlov && !isMentor && <div className="fi-goya-tanlov fi-guruh">{GOYALAR.map(g => <button key={g} ref={refs[g]} type="button" className="fi-goya-b" onClick={() => tanla(g)}>{tr(GOYA_NOM[g])}</button>)}</div>}
        <FinalKarta yashil={nom}
          nom={(tanlov || isMentor) && (nom ? <MaydonJamoa /> : tr(GOYA_NOM.jamoa))} nomUch="s8fin"
          qatorlar={qatorlar}
          gap={b >= 3 && qadam >= 2 && tr(MENTOR_GAP)}
          dalil={nom && tr({ uz: 'Muammo 4 / 5 · belgi 4 / 5', ru: 'Проблема 4 / 5 · знак 4 / 5' })}
          keyin={(tanlov || isMentor) && tr(GOYA_NOM.togarak)} keyinUch="s8key"
          keyinOst={(tanlov || isMentor) && <span className="fi-fk-sabab">{tr({ uz: "ikki o'smir tanlovni ota-onasiga qoldirgan", ru: 'двое подростков оставили выбор родителям' })}</span>} />
        {qadam === 1 && <NishonQatori screen={screen} />}
      </div>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · final g'oya", ru: 'Понятие · финальная идея' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={isMentor && !done ? tr(T_DAVOM) : navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Mentorning ikki g'oyasidan <A>qaysi biri qoladi?</A></>, ru: <>Какая из двух идей Ментора <A>останется?</A></> })}
        mentor={<Mentor key={`m${Math.min(qadam, 2)}`}>{tr(S8_MENTOR[Math.min(qadam, 2)])}</Mentor>}
        harakat={<QQadamlar qadamlar={S8_QADAM.map(tr)} joriy={done ? undefined : qadam} />}
        vizual={vizual}
        natija={tx && <div className="fi-izohlar">{tanlov && taxQ}{izoh}</div>}
        xulosa={done && <>{tanlov && taxQ}{tr({ uz: "10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas.", ru: '10 интервью — небольшое число; это довод для выбора, а не доказательство.' })}</>}
      />
      <MentorNote>{tr({ uz: "Muammo gapi qolipi — 9-Moduldagidek: kim · qachon · nimadan qiynaladi; unda yechim yo'q. «Maydon Jamoa» — shu ekrandan modul bo'yi mahsulot nomi. Sinfdan so'rang: to'garak g'oyasi o'chirildimi? (Yo'q — «Keyin» qutisida.) Telefondagi e'lon — chizma, hali qurilmagan; quriladigan narsa keyingi darslarda tanlanadi (o'quvchiga aytilmaydi).", ru: 'Шаблон фразы о проблеме — как в 9-м модуле: кто · когда · от чего страдает; решения в ней нет. «Maydon Jamoa» — с этого экрана название продукта на весь модуль. Спросите класс: идею кружков удалили? (Нет — она в коробке «Потом».) Объявление в телефоне — набросок, ещё не построено; что строить, выберут на следующих уроках (ученикам не говорится).' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 9 — SIZNING SANOG'INGIZ (QMustaqil, USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29) · sanoq qog'ozdan (tayanch 9.44) · nishon repeatFinder =====
// O'qiydi: pm-m9d3-intervyu (g'oya nomlari; darsdagi 1–2 haqiqiy yozuv — faqat eslatma, sanalmaydi). Doska — dars javobida (10, 15-ekranlar shundan o'qiydi).
const INTERVYU_KEY = 'pm-m9d3-intervyu';
const FINAL_KEY = 'pm-m9d4-final';
const qisqa = (s, n = 34) => { const t = String(s || '').trim(); return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t; };
const intervyuLs = () => {
  const v = lsGet(INTERVYU_KEY);
  const goyalar = v && Array.isArray(v.goyalar) ? v.goyalar : [];
  const nomlar = [0, 1].map(i => { const g = goyalar[i]; const t = g && (g.nom || g.matn); return typeof t === 'string' ? t.trim() : ''; });
  const yozuvlar = v && Array.isArray(v.yozuvlar) ? v.yozuvlar.filter(y => y && typeof y === 'object' && y.tur !== 'mashq') : [];
  return { nomlar, yozuvlar };
};
const yozuvGi = (y, nomlar) => {
  if (y.goya === 0 || y.goya === 1) return y.goya;
  if (y.goya === 'a') return 0;
  if (y.goya === 'b') return 1;
  return nomlar.findIndex(n => n && n === y.goya);
};
const KK = ['a', 'b'];
const BOSH_D = { nom: '', N: null, n: null, m: null, qiyin: '', qn: null, saqlandi: false };
const oraliq = (dan, gacha) => (gacha >= dan ? [...Array(gacha - dan + 1)].map((_, i) => dan + i) : []);
const O_QATOR = ['muammo', 'qiyin', 'belgi'];
const oKatak = (d, id) => {
  const N = d.N || 0;
  const son = id === 'muammo' ? d.n : id === 'belgi' ? d.m : d.qn;
  return { n: son || 0, jami: N, nuqta: oraliq(1, N).map(r => ({ r, on: r <= (son || 0) })), matn: id === 'qiyin' && d.qiyin ? qisqa(d.qiyin, 44) : null };
};
// O'quvchi doskasi (9, 10, 15-ekran): ikki ustun — o'z g'oya nomlari, uch qator (Muammo bo'lgan · Eng qiyini · Harakat belgisi)
const oUstun = (doska, nomG, x = {}) => KK.map(k => ({ k, nom: qisqa(nomG(k), 30), ...(x[k] || {}) }));
const oQatorlar = (doska) => O_QATOR.map(id => ({ id, nom: tr(SQ[id].nom), holat: 'toldi', kat: Object.fromEntries(KK.map(k => [k, oKatak(doska[k] || BOSH_D, id)])) }));
const XABAR9 = {
  nom: { uz: "G'oya nomini yozing.", ru: 'Напишите название идеи.' },
  qiyinBosh: { uz: 'Bir necha yozuvda chiqqan qiyinchilikni yozing.', ru: 'Напишите трудность, которая встретилась в нескольких записях.' },
  bitta: { uz: "Bu bitta yozuvda chiqdi — takrorlangani emas.", ru: 'Это встретилось в одной записи — это не повтор.' }
};
const tekshir9 = (d, nomKerak) => {
  if (nomKerak && !d.nom.trim()) return { k: 'nom', tur: 'nom', q: true };
  if (!d.qiyin.trim()) return { k: 'qiyin', tur: 'qiyinBosh', q: true };
  if (d.qn === 1) return { k: 'qiyin', tur: 'bitta' };
  return null;
};
// Son-tanlagich (qog'ozdagi yozuvlardan): bir guruhda bitta halqa (SABOQ 32)
const SonTanlagich = ({ dan, gacha, qiymat, onTanla, faol, disabled }) => (
  <div className={cxx('fi-st', faol && 'fi-guruh')}>{oraliq(dan, gacha).map(v => <QChip key={v} holat={qiymat === v ? 'on' : undefined} disabled={disabled} onClick={() => onTanla(v)}>{v}</QChip>)}</div>
);
const SonNuqta = ({ son, jami }) => {
  const k = useSanoq(son || 0, 80);
  return <span className="fi-sn"><span className="fi-nq kichik" aria-hidden="true">{oraliq(1, jami).map(i => <i key={i} className={i <= k ? 'on' : ''} />)}</span><b>{son == null ? '?' : k} / {jami}</b></span>;
};
// Artefakt-strip «Doskam» (U-042): 9 (yuqori ixcham chiziq), 10 va 15-ekran
const DoskamStrip = ({ doska, nomG, joriy, final, uchKey }) => {
  const soni = KK.filter(k => doska && doska[k] && doska[k].saqlandi).length;
  return (
    <div className="fi-strip fade-up">
      <span className="fi-strip-l">{tr({ uz: 'Doskam', ru: 'Моя доска' })}</span>
      {nomG && KK.map((k, i) => <span key={k} className={cxx('fi-strip-g', joriy === k && 'joriy', doska && doska[k] && doska[k].saqlandi && 'ok')} data-uch={uchKey ? `${uchKey}-${k}` : undefined}><b>{i + 1}</b>{qisqa(nomG(k), 26) || '…'}{doska && doska[k] && doska[k].saqlandi && <i aria-hidden="true">✓</i>}</span>)}
      <span className="fi-strip-n">{soni}/2{soni === 2 ? ' ✓' : ''}</span>
      {final && <span className="fi-strip-f">{tr({ uz: 'Final', ru: 'Финал' })} ✓</span>}
    </div>
  );
};
const PH9 = { nom: [{ uz: "1-g'oya nomi", ru: 'Название 1-й идеи' }, { uz: "2-g'oya nomi", ru: 'Название 2-й идеи' }], qiyin: { uz: 'Qaysi qiyinchilik bir necha yozuvda chiqdi?', ru: 'Какая трудность встретилась в нескольких записях?' } };
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [kalit] = useState(intervyuLs);
  const nomKerak = (i) => !kalit.nomlar[i];
  const [doska, setDoska] = useState(() => (storedAnswer && storedAnswer.doska) || { a: { ...BOSH_D, nom: kalit.nomlar[0] }, b: { ...BOSH_D, nom: kalit.nomlar[1] } });
  const [joriy, setJoriy] = useState(() => (storedAnswer ? null : 'a'));
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [kartaK, setKartaK] = useState(0);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const soni = KK.filter(k => doska[k].saqlandi).length;
  const done = soni === 2 && joriy === null;
  const nomG = (k) => doska[k].nom;
  const d = joriy ? doska[joriy] : null;
  const ji = joriy === 'b' ? 1 : 0;
  const setD = (f) => { setDoska(o => ({ ...o, [joriy]: { ...o[joriy], ...f } })); if (xato && Object.keys(f).includes(xato.k)) setXato(null); };
  const tanlaN = (v) => setD({ N: v, n: d.n != null && d.n > v ? v : d.n, m: d.m != null && d.m > v ? v : d.m, qn: d.qn != null && d.qn > v ? v : d.qn });
  const saqla = () => {
    if (!d) return;
    const t = tekshir9(d, nomKerak(ji));
    const imzo = t && `${t.tur}|${d.qiyin.trim()}|${d.qn}`;
    if (t && (t.q || !(xato && xato.imzo === imzo))) { setXato({ ...t, imzo, kk: Date.now() }); return; }
    setXato(null);
    const yangi = { ...doska, [joriy]: { ...d, nom: d.nom.trim(), qiyin: d.qiyin.trim(), saqlandi: true } };
    uch(kartaRef.current, `s9c-${joriy}`, 640);
    setDoska(yangi);
    const keyingi = KK.find(k => !yangi[k].saqlandi) || null;
    setJoriy(keyingi); setYordam(false); setKartaK(k => k + 1);
    if (!keyingi) {
      const birinchi = storedAnswer === undefined;
      onAnswer(screen, { stage: 'sanoq', screenIdx: screen, practice: 'doska', correct: true, picked: true, solved: true, doska: yangi });
      if (birinchi && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'doska', yangi.a.N >= 5 && yangi.b.N >= 5 ? 1 : 0, true, 0);
    }
  };
  const tahrir = (k) => { if (isMentor || joriy) return; setJoriy(k); setXato(null); setKartaK(x => x + 1); };
  const tayyor = !!(d && d.N && d.n != null && d.m != null && d.qn != null);
  // Navbatdagi bosiladigan joy: Nechta yozuv? → uch son-tanlagich → Eng qiyini qatori → «Saqlash»
  const navbat = !d ? null : nomKerak(ji) && !d.nom.trim() ? 'nom' : !d.N ? 'N' : d.n == null ? 'n' : d.m == null ? 'm' : !d.qiyin.trim() ? 'qiyin' : d.qn == null ? 'qn' : 'saqla';
  const eslatma = d ? kalit.yozuvlar.filter(y => yozuvGi(y, kalit.nomlar) === ji).slice(0, 2) : [];
  const xq = (k) => xato && xato.k === k && <div className="fi-xato-q"><QXato>{tr(XABAR9[xato.tur])}</QXato>{!xato.q && <QIzoh>{tr(T_QOLDIR)}</QIzoh>}</div>;
  const karta = d && (
    <div className="fi-s9-k fi-karta-kir" key={kartaK} ref={kartaRef}>
      <div className="fi-s9-ch">{KK.map((k, i) => <span key={k} className={cxx('fi-ch', joriy === k && 'on', doska[k].saqlandi && joriy !== k && 'ok')}><b>{i + 1}</b>{qisqa(nomG(k), 28) || tr(PH9.nom[i])}{doska[k].saqlandi && joriy !== k && <i aria-hidden="true">✓</i>}</span>)}</div>
      <div className="fi-s9-g"><div className="fi-s9-c">
      <div className="fi-s9-q">
        <span className="fi-s9-l">{tr({ uz: 'Nechta yozuv?', ru: 'Сколько записей?' })}</span>
        <SonTanlagich dan={1} gacha={10} qiymat={d.N} onTanla={tanlaN} faol={navbat === 'N'} />
      </div>
      <div className={cxx('fi-s9-q', !d.N && 'xira')}>
        <span className="fi-s9-l">{tr(SQ.muammo.nom)}</span>
        <span className="fi-s9-s">{tr({ uz: 'Nechtasida odam oxirgi marta qiynalganini aytgan?', ru: 'Во скольких записях человек сказал, что в последний раз было трудно?' })}</span>
        <div className="fi-s9-r"><SonTanlagich dan={1} gacha={d.N || 0} qiymat={d.n} onTanla={(v) => setD({ n: v })} faol={navbat === 'n'} />{d.N ? <SonNuqta son={d.n} jami={d.N} /> : null}</div>
        <span className="fi-s9-yo">{tr({ uz: "Bu sanoq — sizning o'qishingiz: qaysi yozuvda muammo bo'lganini javobga qarab o'zingiz belgilaysiz.", ru: 'Этот подсчёт — ваше прочтение: в какой записи была проблема, вы отмечаете сами по ответу.' })}</span>
      </div>
      <div className={cxx('fi-s9-q', !d.N && 'xira')}>
        <span className="fi-s9-l">{tr(SQ.belgi.nom)}</span>
        <span className="fi-s9-s">{tr({ uz: 'Nechtasida «ha» — kun belgilagan?', ru: 'Во скольких «да» — назначили день?' })}</span>
        <div className="fi-s9-r"><SonTanlagich dan={0} gacha={d.N || -1} qiymat={d.m} onTanla={(v) => setD({ m: v })} faol={navbat === 'm'} />{d.N ? <SonNuqta son={d.m} jami={d.N} /> : null}</div>
      </div>
      </div><div className="fi-s9-c">
      {eslatma.length > 0 && <div className="fi-esl"><span className="fi-esl-l">{tr({ uz: 'Darsdagi yozuv', ru: 'Запись с урока' })}</span>{eslatma.map((y, i) => <span key={i} className="fi-esl-k"><b>{qisqa(y.kim, 28)}</b>{y.qiyin && <span>{qisqa(y.qiyin, 40)}</span>}<i>{tr({ uz: 'Belgi', ru: 'Знак' })}: {String(y.belgi === true ? 'ha' : y.belgi === false ? "yo'q" : y.belgi || '—')}</i></span>)}</div>}
      {nomKerak(ji) && <div className={cxx('fi-s9-q', 'nom', xato && xato.k === 'nom' && 'xato')}>
        <input className={cxx('fi-inp', navbat === 'nom' && 'fi-halqa-i')} value={d.nom} placeholder={tr(PH9.nom[ji])} aria-label={tr(PH9.nom[ji])} onChange={(e) => setD({ nom: e.target.value })} />
        {xq('nom')}
      </div>}
      <div className={cxx('fi-s9-q', !d.N && 'xira', xato && xato.k === 'qiyin' && 'xato')}>
        <span className="fi-s9-l">{tr(SQ.qiyin.nom)}</span>
        <input className={cxx('fi-inp', navbat === 'qiyin' && 'fi-halqa-i')} value={d.qiyin} disabled={!d.N} placeholder={tr(PH9.qiyin)} aria-label={tr(SQ.qiyin.nom)} onChange={(e) => setD({ qiyin: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter' && tayyor) saqla(); }} />
        <span className="fi-s9-s">{tr({ uz: 'Nechta yozuvda?', ru: 'В скольких записях?' })}</span>
        <div className="fi-s9-r"><SonTanlagich dan={1} gacha={d.N || 0} qiymat={d.qn} onTanla={(v) => setD({ qn: v })} faol={navbat === 'qn'} />{d.N ? <SonNuqta son={d.qn} jami={d.N} /> : null}</div>
        {xq('qiyin')}
      </div>
      <div className="fi-amal">
        <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(T_YORDAM)}</QTugma>
        <QTugma className={halqa(navbat === 'saqla')} disabled={!tayyor} onClick={saqla}>{tr(T_SAQLASH)}</QTugma>
      </div>
      </div></div>
      {yordam && <div className="fi-yordam fade-step"><QIzoh>{tr({ uz: "Yozuvlarni birma-bir o'qing: oxirgi marta odam qiynalganmi? Keyin «Eng qiyini» qatorlarini solishtiring — so'zlari boshqa, ma'nosi bir xil javoblar qaysilari?", ru: 'Читайте записи по одной: было ли человеку трудно в последний раз? Потом сравните строки «Труднее всего» — какие ответы разными словами говорят об одном?' })}</QIzoh></div>}
    </div>
  );
  const vaqtincha = done && (doska.a.N < 5 || doska.b.N < 5);
  const harxil = done && doska.a.N !== doska.b.N;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={`${soni}-${joriy}`} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr(T_DAVOM) : `${tr({ uz: "Ikkala g'oyani saqlang", ru: 'Сохраните обе идеи' })} (${soni}/2)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Yozuvlaringizda qaysi javob <A>takrorlandi?</A></>, ru: <>Какой ответ <A>повторился</A> в ваших записях?</> })}
        mentor={<Mentor>{tr({ uz: "Qog'ozdagi yozuvlaringizni har g'oya bo'yicha alohida sanang.", ru: 'Посчитайте свои записи на бумаге отдельно по каждой идее.' })}</Mentor>}
        qadamlar={isMentor
          ? <><MentorSanoq screen={screen} yorliqlar={[{ uz: 'Doskasini saqlaganlar', ru: 'Сохранили доску' }, { uz: '5 + 5 yozuvga yetganlar', ru: 'Дошли до 5 + 5 записей' }]} hisob={(rows, jami) => [`${rows.length} / ${jami}`, String(rows.filter(r => r.picked > 0).length)]} />
            <IxchamDoska className="fi-s9-mentor" /></>
          : (done
            ? <SanoqDoska className="fi-s9-sd fade-step" ustunlar={oUstun(doska, nomG, Object.fromEntries(KK.map(k => [k, { ust: <button type="button" className="fi-tahrir" aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })} onClick={() => tahrir(k)}>✎</button> }])))} qatorlar={oQatorlar(doska)} />
            : <DoskamStrip doska={doska} nomG={(k) => nomG(k) || tr(PH9.nom[k === 'a' ? 0 : 1])} joriy={joriy} uchKey="s9c" />)}
        forma={!isMentor && karta}
      >
        {done && !isMentor && <div className="fi-izohlar">
          {vaqtincha && <QIzoh>{tr({ uz: "Har g'oyada 5 tadan yozuv bo'lsa, final g'oyani tanlaysiz; hozircha — vaqtincha tanlov.", ru: 'Если в каждой идее будет по 5 записей, вы выберете финальную идею; пока — временный выбор.' })}</QIzoh>}
          {harxil && <QIzoh>{tr({ uz: 'Yozuvlar soni har xil — sonlarni ehtiyot bilan solishtiring.', ru: 'Число записей разное — сравнивайте числа осторожно.' })}</QIzoh>}
        </div>}
        {done && !isMentor && <QXulosa>{tr({ uz: "Doskangiz tayyor: ikki g'oya bir xil qatorlar bilan sanaldi.", ru: 'Ваша доска готова: две идеи посчитаны по одинаковым строкам.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Yozuvi yo'q o'quvchi sherigining yozuvlari bilan mashq qiladi (tanlovi vaqtincha). Yozuvlar 5 + 5 dan kam bo'lsa ham sanaladi — tanlov vaqtincha, uyda to'ldiriladi. Eng ko'p xato — «yoqdi» degan javobni muammo deb sanash: «Odam oxirgi marta qiynalganmi?» deb so'rang.", ru: 'Ученик без записей тренируется на записях партнёра (выбор временный). Даже если записей меньше 5 + 5, их считают — выбор временный, дома дополняется. Самая частая ошибка — считать проблемой ответ «понравилось»: спросите «Было ли человеку трудно в последний раз?».' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — FINAL G'OYANGIZ (QMustaqil, juftlik 3 qadam; yakka — 2) · yozadi pm-m9d4-final (tayanch 8 aynan) · nishon finalIdea =====
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normYoz = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/[«»".,!?;:]+/g, ' ').replace(/\s+/g, ' ').trim();
const YECHIM_RE = /(^| )(ilova|sayt|bot|kerak)/;
const HAMMA_RE = /^(hamma|hamma odamlar|har kim|barcha odamlar|barcha)$/;
const XABAR10 = {
  yechim: { uz: 'Bu yechim. Odam nimadan qiynalishini yozing.', ru: 'Это решение. Напишите, от чего страдает человек.' },
  hamma: { uz: '«Hamma» juda keng. Yozuvlarda kim gapirgan?', ru: '«Все» — слишком широко. Кто говорил в записях?' },
  qiynal: { uz: 'Oxirida «qiynaladi» tursin: nimadan qiynaladi?', ru: 'Пусть в конце будет «страдает»: от чего страдает?' },
  qisqa: { uz: "Qisqa qoldi: to'liq yozing.", ru: 'Слишком коротко: напишите полностью.' }
};
const BOLAK10 = [
  { k: 'kim', nom: { uz: 'Kim', ru: 'Кто' }, ph: { uz: 'Kim qiynaladi?', ru: 'Кто страдает?' } },
  { k: 'qachon', nom: { uz: 'Qachon', ru: 'Когда' }, ph: { uz: 'Qachon qiynaladi?', ru: 'Когда страдает?' } },
  { k: 'nima', nom: { uz: 'Nimadan qiynaladi', ru: 'От чего страдает' }, ph: { uz: '… qiynaladi', ru: '… страдает' } }
];
// Javob-qatorlari bloklamaydi, yo'naltiradi (ikkinchi «Saqlash» o'tadi); bo'sh qator — bloklaydi
const tekshir10 = (bol) => {
  const kim = normYoz(bol.kim), nima = normYoz(bol.nima);
  const bosh = BOLAK10.find(b => !bol[b.k].trim());
  if (bosh) return { k: bosh.k, tur: 'qisqa', q: true };
  const yech = BOLAK10.find(b => YECHIM_RE.test(normYoz(bol[b.k])));
  if (yech) return { k: yech.k, tur: 'yechim' };
  if (HAMMA_RE.test(kim)) return { k: 'kim', tur: 'hamma' };
  if (!/qiynal/.test(nima)) return { k: 'nima', tur: 'qiynal' };
  if (nima.split(' ').filter(Boolean).length < 3) return { k: 'nima', tur: 'qisqa' };
  return null;
};
const boshHarf = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const yigGap = (bol) => {
  const q = [boshHarf(bol.kim.trim()), bol.qachon.trim(), bol.nima.trim().replace(/[.!?\s]+$/, '')].filter(Boolean);
  return q.length ? `${q.join(' ')}.` : '';
};
const Screen10 = ({ screen, storedAnswer, answers, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const juft = isStudent;
  const [kalit] = useState(intervyuLs);
  const doska = (answers && answers[9] && answers[9].doska) || null;
  const nomG = (k) => { const i = k === 'a' ? 0 : 1; return (doska && doska[k] && doska[k].nom) || kalit.nomlar[i] || tr({ uz: `${i + 1}-g'oya`, ru: `Идея ${i + 1}` }); };
  const [sherik, setSherik] = useState(storedAnswer?.sherik ?? null);
  const [final, setFinal] = useState(storedAnswer?.final ?? null);
  const [sabab, setSabab] = useState(storedAnswer?.keyin?.sabab ?? '');
  const [negaShu, setNegaShu] = useState(storedAnswer?.negaShu ?? '');
  const [bol, setBol] = useState(storedAnswer?.bolaklar ?? { kim: '', qachon: '', nima: '' });
  const [xato, setXato] = useState(null);
  const [saqlandi, setSaqlandi] = useState(!!storedAnswer);
  const [yashil, setYashil] = useState(false);
  const refs = { a: useRef(null), b: useRef(null) };
  const uch = useUchish();
  useEffect(() => { if (!yashil) return undefined; const t = setTimeout(() => setYashil(false), 1300); return () => clearTimeout(t); }, [yashil]);
  const boshqa = final === 'a' ? 'b' : 'a';
  const dd = (k) => (doska && doska[k]) || null;
  const vaqtincha = !doska || (dd('a').N || 0) < 5 || (dd('b').N || 0) < 5;
  const kichikroq = !!(final && dd(final) && dd(boshqa) && dd(final).n < dd(boshqa).n && dd(final).m < dd(boshqa).m);
  const dalilQ = (k) => { const x = dd(k); return x && x.N ? tr({ uz: `Muammo ${x.n} / ${x.N} · belgi ${x.m} / ${x.N}`, ru: `Проблема ${x.n} / ${x.N} · знак ${x.m} / ${x.N}` }) : null; };
  const qadamlar = juft ? [{ uz: 'Sherigingiz tanlaydi', ru: 'Выбирает партнёр' }, { uz: 'Siz tanlaysiz', ru: 'Выбираете вы' }, { uz: 'Muammo gapi', ru: 'Фраза о проблеме' }] : [{ uz: 'Siz tanlaysiz', ru: 'Выбираете вы' }, { uz: 'Muammo gapi', ru: 'Фраза о проблеме' }];
  const qi = juft ? (sherik == null ? 0 : final == null ? 1 : 2) : (final == null ? 0 : 1);
  const tanla = (k) => { if (final || isMentor || (juft && sherik == null)) return; uch(refs[k].current, 's10fin', 680); uch(refs[k === 'a' ? 'b' : 'a'].current, 's10key', 740); setFinal(k); };
  const ozgar = (k, v) => { setBol(o => ({ ...o, [k]: v })); if (xato && xato.k === k) setXato(null); };
  const gap = yigGap(bol);
  const toliq = !!(final && sabab.trim() && BOLAK10.every(b => bol[b.k].trim()) && (!kichikroq || negaShu.trim()));
  const saqla = () => {
    if (!toliq || saqlandi) return;
    const t = tekshir10(bol);
    const imzo = t && `${t.tur}|${normYoz(bol[t.k])}`;
    if (t && (t.q || !(xato && xato.imzo === imzo))) { setXato({ ...t, imzo, kk: Date.now() }); return; }
    setXato(null);
    const dal = (k) => ({ takror: dd(k) ? dd(k).n : null, belgi: dd(k) ? dd(k).m : null });
    const qy = (k) => ({ matn: dd(k) ? dd(k).qiyin : '', n: dd(k) ? dd(k).qn : null });
    const bolaklar = { kim: bol.kim.trim(), qachon: bol.qachon.trim(), nima: bol.nima.trim() };
    lsSet(FINAL_KEY, { goya: nomG(final), final, muammoGapi: gap, bolaklar, dalil: { a: dal('a'), b: dal('b') }, qiyin: { a: qy('a'), b: qy('b') }, yozuvlarSoni: { a: dd('a') ? dd('a').N : null, b: dd('b') ? dd('b').N : null }, keyin: { goya: nomG(boshqa), sabab: sabab.trim() }, vaqtincha, savedAt: Date.now() });
    setSaqlandi(true); setYashil(true);
    onAnswer(screen, { stage: 'final', screenIdx: screen, practice: 'final', correct: true, picked: true, solved: true, final, sherik, bolaklar, keyin: { sabab: sabab.trim() }, negaShu: negaShu.trim(), vaqtincha });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'final', juft && sherik === final ? 1 : 0, true, 0);
  };
  const xq = (k) => xato && xato.k === k && <div className="fi-xato-q"><QXato>{tr(xato.q ? { uz: "Qatorni to'ldiring.", ru: 'Заполните строку.' } : XABAR10[xato.tur])}</QXato>{!xato.q && <QIzoh>{tr(T_QOLDIR)}</QIzoh>}</div>;
  const navbat = juft && sherik == null ? 'sherik' : !final ? 'goya' : !sabab.trim() ? 'sabab' : kichikroq && !negaShu.trim() ? 'nega' : BOLAK10.find(b => !bol[b.k].trim())?.k || 'saqla';
  const negaJoriy = navbat === 'nega';
  const sherikBlok = juft && <div className="fi-s10-sh">
    {sherik == null
      ? <><span className="fi-s10-shl">{tr({ uz: 'Sherigingiz tanladi:', ru: 'Партнёр выбрал:' })}</span><div className="fi-guruh fi-s10-shv">{KK.map(k => <QTugma key={k} ikkinchi onClick={() => setSherik(k)}>{qisqa(nomG(k), 30)}</QTugma>)}</div></>
      : <span className="fi-sherik-tag fade-step">{tr({ uz: 'Sherik', ru: 'Партнёр' })}: <b>{qisqa(nomG(sherik), 30)}</b></span>}
  </div>;
  const solishtir = juft && sherik != null && final && <div className="fi-sol fade-step">
    <span className="fi-sol-p">{tr({ uz: 'Sherik', ru: 'Партнёр' })}: <b>{qisqa(nomG(sherik), 22)}</b></span>
    <i className={cxx('fi-sol-ch', sherik === final ? 'bir' : 'boshqa')} aria-hidden="true" />
    <span className="fi-sol-p">{tr({ uz: 'Siz', ru: 'Вы' })}: <b>{qisqa(nomG(final), 22)}</b></span>
    {sherik !== final && <QIzoh>{tr({ uz: 'Sherigingizga qaysi dalil yoki sabab tanlovingizga ta\'sir qilganini ayting.', ru: 'Скажите партнёру, какой довод или причина повлияли на ваш выбор.' })}</QIzoh>}
    <span className="fi-sol-kul">{tr({ uz: "Sherik tanlovi dalil emas: u doskangizni boshqa odam qanday o'qishini ko'rsatadi.", ru: 'Выбор партнёра — не довод: он показывает, как вашу доску читает другой человек.' })}</span>
  </div>;
  const qatorlar = !saqlandi && <div className="fi-s10-bol">
    {BOLAK10.map(b => (
      <div key={b.k} className={cxx('fi-fk-q', b.k, navbat === b.k && 'joriy', xato && xato.k === b.k && 'xato')}>
        <span className="fi-fk-ql">{tr(b.nom)}</span>
        <input key={xato && xato.k === b.k ? xato.kk : 'i'} className={cxx('fi-inp', navbat === b.k && 'fi-halqa-i')} value={bol[b.k]} placeholder={tr(b.ph)} aria-label={tr(b.nom)} onChange={(e) => ozgar(b.k, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saqla(); }} />
        {xq(b.k)}
      </div>
    ))}
    <div className="fi-s10-yak"><p className="fi-s10-gap">{gap || '…'}</p><QTugma className={halqa(navbat === 'saqla')} disabled={!toliq} onClick={saqla}>{tr(T_SAQLASH)}</QTugma></div>
  </div>;
  const keyinOst = final && (saqlandi
    ? sabab.trim() && <span className="fi-fk-sabab">{sabab.trim()}</span>
    : <input className={cxx('fi-inp', 'kichik', navbat === 'sabab' && 'fi-halqa-i')} value={sabab} placeholder={tr({ uz: 'Bir gap bilan', ru: 'Одной фразой' })} aria-label={tr({ uz: 'Nega keyin?', ru: 'Почему потом?' })} onChange={(e) => setSabab(e.target.value)} />);
  const forma = isMentor
    ? <><MentorSanoq screen={screen} yorliqlar={[{ uz: 'Sherigi bilan bir xil tanlaganlar', ru: 'Выбрали так же, как партнёр' }, { uz: "Final g'oyasini saqlaganlar", ru: 'Сохранили финальную идею' }]} hisob={(rows, jami) => [String(rows.filter(r => r.picked > 0).length), `${rows.length} / ${jami}`]} />
      <FinalKarta nom={<MaydonJamoa />} gap={tr(MENTOR_GAP)} dalil={tr({ uz: 'Muammo 4 / 5 · belgi 4 / 5', ru: 'Проблема 4 / 5 · знак 4 / 5' })} keyin={tr(GOYA_NOM.togarak)} /></>
    : <>
      {!final && doska && <div className="fi-s10-d">{sherikBlok}<SanoqDoska kichik className="fi-s10-sd" ustunlar={oUstun(doska, nomG)} qatorlar={oQatorlar(doska)} /></div>}
      {!final && !doska && sherikBlok}
      {!final && (!juft || sherik != null) && <div className="fi-s10-g fi-guruh">{KK.map(k => <button key={k} ref={refs[k]} type="button" className="fi-goya-b katta" onClick={() => tanla(k)}><b>{qisqa(nomG(k), 40)}</b>{dalilQ(k) && <span>{dalilQ(k)}</span>}</button>)}</div>}
      {solishtir}
      {final && <FinalKarta yashil={yashil} className={saqlandi ? 'saqlandi' : undefined}
        slotYorliq={vaqtincha ? tr({ uz: 'Vaqtincha tanlov', ru: 'Временный выбор' }) : undefined}
        nom={qisqa(nomG(final), 44)} nomUch="s10fin"
        qatorlar={<>
          {!saqlandi && <div className={cxx('fi-fk-keyin', 'bor', 'fi-s10-key')}><span className="fi-fk-kl">{tr(T_KEYIN)}</span><span className="fi-fk-kn" data-uch="s10key">{qisqa(nomG(boshqa), 40)}</span><span className="fi-fk-nega">{tr({ uz: 'Nega keyin?', ru: 'Почему потом?' })}</span>{keyinOst}</div>}
          {kichikroq && !saqlandi && <div className="fi-s10-ogoh"><QIzoh>{tr({ uz: 'Doskada sonlar ikkinchi g\'oyada kattaroq. Sababini yozing.', ru: 'На доске числа больше у второй идеи. Напишите причину.' })}</QIzoh>
            <input className={cxx('fi-inp', negaJoriy && 'fi-halqa-i')} value={negaShu} placeholder={tr({ uz: "Nega shu g'oya?", ru: 'Почему эта идея?' })} aria-label={tr({ uz: "Nega shu g'oya?", ru: 'Почему эта идея?' })} onChange={(e) => setNegaShu(e.target.value)} /></div>}
          {qatorlar}
        </>}
        gap={saqlandi && gap}
        slotOng={!saqlandi && dalilQ(final) && <span className="fi-fk-dalil">{dalilQ(final)}</span>}
        dalil={saqlandi && dalilQ(final)}
        keyinYoq={!saqlandi} keyin={qisqa(nomG(boshqa), 40)} keyinOst={keyinOst} />}
    </>;
  const done = saqlandi;
  const navLabel = done || isMentor ? tr(T_DAVOM) : juft
    ? [tr({ uz: '① Sherigingiz tanlasin', ru: '① Пусть выберет партнёр' }), tr({ uz: "② O'zingiz tanlang", ru: '② Выберите сами' }), tr({ uz: '③ Muammo gapini yozing', ru: '③ Напишите фразу о проблеме' })][qi]
    : [tr({ uz: "① O'zingiz tanlang", ru: '① Выберите сами' }), tr({ uz: '② Muammo gapini yozing', ru: '② Напишите фразу о проблеме' })][qi];
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish', ru: 'Работа в паре' }) : tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={`${qi}-${saqlandi}`} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Bitiruvgacha <A>qaysi g'oyani</A> qurasiz?</>, ru: <><A>Какую идею</A> вы будете строить до выпуска?</> })}
        mentor={<Mentor>{juft ? tr({ uz: 'Avval doskangizni sherigingizga ko\'rsating: u qaysi g\'oyani tanlaydi?', ru: 'Сначала покажите доску партнёру: какую идею он выберет?' }) : tr({ uz: "Doskangizga qarab bitta g'oyani tanlang — ikkinchisi «Keyin» qutisiga o'tadi.", ru: 'Посмотрите на доску и выберите одну идею — вторая перейдёт в коробку «Потом».' })}</Mentor>}
        qadamlar={!isMentor && !done && <QQadamlar qadamlar={qadamlar.map(tr)} joriy={qi} />}
        forma={forma}
      >
        {done && !isMentor && <DoskamStrip doska={doska} final />}
        {done && !isMentor && <QXulosa>{vaqtincha ? tr({ uz: "Vaqtincha tanlov saqlandi: yozuvlar 5 + 5 bo'lganda doskani qayta ko'ring.", ru: 'Временный выбор сохранён: когда записей будет 5 + 5, посмотрите доску ещё раз.' }) : tr({ uz: "Final g'oyangiz saqlandi; ikkinchi g'oya «Keyin» qutisida turibdi.", ru: 'Ваша финальная идея сохранена; вторая идея лежит в коробке «Потом».' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Sherik boshqacha tanlasa — g'oya yomon degani emas: doskadagi sonlar bilan tanlov orasida nima borligini so'rang (qiziqish, qurish vaqti). Jamoa yig'ishni tavsiya qilmang — har o'quvchining o'z g'oyasi. 2–3 juftlikdan so'rang: qaysi dalil yoki sabab tanlovga ta'sir qildi?", ru: 'Если партнёр выбрал иначе — это не значит, что идея плохая: спросите, что стоит между числами на доске и выбором (интерес, время на постройку). Не советуйте сбор команды — у каждого ученика своя идея. Спросите 2–3 пары: какой довод или причина повлияли на выбор?' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 11 — KOD YOZISH (QKod, VS Code — qo'lda yoziladi; tayanch 4, PM-082): darvoza-savol → vazifa + Yordam + «Bajardim»; terminal «Kutilgan natija» boshidan xira =====
// Kod matni qatorlar massivi (template-satr emas — backtik yo'q). Kod oynasi (HtmlCompiler) yo'q — pm-m9d4-code kaliti kerak emas.
const KD_BOSH = {
  uz: ["// sanoq.js — Mentor misoli: ikki g'oya bo'yicha o'nta yozuv", "// muammo — oxirgi marta muammo bo'lganmi · belgi — sinovga kun belgilaganmi"],
  ru: ['// sanoq.js — пример Ментора: десять записей по двум идеям', '// muammo — была ли проблема в последний раз · belgi — назначил ли день для пробы']
};
const KD_YOZUVLAR = [
  '  { goya: "jamoa", muammo: true, belgi: true },          // 1',
  '  { goya: "jamoa", muammo: true, belgi: true },          // 2',
  '  { goya: "jamoa", muammo: true, belgi: true },          // 3',
  '  { goya: "jamoa", muammo: false, belgi: false },        // 4',
  '  { goya: "jamoa", muammo: true, belgi: true },          // 5',
  '  { goya: "to\'garak", muammo: true, belgi: false },      // 6',
  '  { goya: "to\'garak", muammo: true, belgi: true },       // 7',
  '  { goya: "to\'garak", muammo: false, belgi: false },     // 8',
  '  { goya: "to\'garak", muammo: false, belgi: false },     // 9',
  '  { goya: "to\'garak", muammo: true, belgi: false },      // 10'
];
const KD_ICHI = {
  uz: ['    const y = yozuvlar[i];   // y — shu aylanishdagi yozuv', "    // Shu yerga: y.goya shu g'oya bo'lsa — jami'ga bitta qo'shing,", "    // ichida: y.muammo rost bo'lsa — muammoSoni'ga, y.belgi rost bo'lsa — belgiSoni'ga (Yordam ▸)"],
  ru: ['    const y = yozuvlar[i];   // y — запись на этом проходе цикла', '    // Сюда: если y.goya — эта идея, прибавьте к jami единицу,', '    // внутри: если y.muammo истинно — к muammoSoni, если y.belgi истинно — к belgiSoni (Подсказка ▸)']
};
const kdKod = (t) => [...KD_BOSH[t], 'const yozuvlar = [', ...KD_YOZUVLAR, '];', '', 'function sanoq(goya) {', '  let jami = 0;', '  let muammoSoni = 0;', '  let belgiSoni = 0;',
  '  for (let i = 0; i < yozuvlar.length; i++) {', ...KD_ICHI[t], '  }', '  console.log(goya + " — muammo " + muammoSoni + " / " + jami + " · belgi " + belgiSoni + " / " + jami);', '}', '', 'sanoq("jamoa");', 'sanoq("to\'garak");'];
const KD_NATIJA = ['jamoa — muammo 4 / 5 · belgi 4 / 5', "to'garak — muammo 3 / 5 · belgi 1 / 5"];
const KD_SHART = [
  { uz: "Har g'oya uchun bitta qator", ru: 'По одной строке на каждую идею' },
  { uz: 'Qatorda muammo va belgi soni', ru: 'В строке — число проблем и знаков' },
  { uz: 'Sonlar doskadagi bilan bir xil', ru: 'Числа такие же, как на доске' }
];
const KD_ESLATMA = [
  { k: 'y.goya', t: { uz: 'yozuvdagi `goya` qiymati', ru: 'значение `goya` в записи' } },
  { k: '===', t: { uz: 'ikki qiymat tengmi', ru: 'равны ли два значения' } },
  { k: 'if (...)', t: { uz: "shart rost bo'lsa, ichidagi qator ishlaydi", ru: 'если условие верно, срабатывает строка внутри' } },
  { k: 'if (y.muammo)', t: { uz: "`y.muammo` rost (`true`) bo'lsa ishlaydi", ru: 'срабатывает, если `y.muammo` истинно (`true`)' } },
  { k: 'jami = jami + 1', t: { uz: "songa bitta qo'shadi", ru: 'прибавляет к числу единицу' } },
  { k: 'terminal', plain: true, t: { uz: <><code className="qcode">node sanoq.js</code> yozib natijani ko'radigan oyna</>, ru: <>окно, где пишете <code className="qcode">node sanoq.js</code> и видите результат</> } }
];
const KD_QADAM = [
  { uz: <>Shart: <code className="qcode">{'if (y.goya === goya) { … }'}</code></>, ru: <>Условие: <code className="qcode">{'if (y.goya === goya) { … }'}</code></> },
  { uz: <>Ichida: <code className="qcode">jami = jami + 1;</code></>, ru: <>Внутри: <code className="qcode">jami = jami + 1;</code></> },
  { uz: <>Yana ichida ikki shart: <code className="qcode">if (y.muammo) muammoSoni = muammoSoni + 1;</code> va <code className="qcode">if (y.belgi) belgiSoni = belgiSoni + 1;</code></>, ru: <>Ещё внутри два условия: <code className="qcode">if (y.muammo) muammoSoni = muammoSoni + 1;</code> и <code className="qcode">if (y.belgi) belgiSoni = belgiSoni + 1;</code></> }
];
const GATE_OPTS = [
  { t: { uz: <><code className="qcode">goya</code> qiymati "jamoa" bo'lgan yozuvlarni oladi</>, ru: <>берёт записи, где значение <code className="qcode">goya</code> — "jamoa"</> }, ok: true },
  { t: { uz: "Ro'yxatdagi birinchi beshta yozuvni oladi", ru: 'берёт первые пять записей списка' }, xato: { uz: "Yozuvlar aralash bo'lishi mumkin: g'oya `goya` dan bilinadi.", ru: 'Записи могут идти вперемешку: идею узнают по `goya`.' } },
  { t: { uz: <><code className="qcode">belgi</code> qiymati <code className="qcode">true</code> bo'lgan yozuvlarni oladi</>, ru: <>берёт записи, где значение <code className="qcode">belgi</code> — <code className="qcode">true</code></> }, xato: { uz: "`belgi` kun belgilaganini aytadi, g'oyani emas.", ru: '`belgi` говорит о назначенном дне, а не об идее.' } }
];
const JS_TOKEN = /(\/\/[^\n]*|"[^"]*"|\b(?:const|let|for|function)\b|\bgoya\b)/g;
const jsHl = (ln, ajrat) => ln.split(JS_TOKEN).filter(p => p !== undefined && p !== '').map((p, i) => {
  if (p.startsWith('//')) return <span key={i} className="fi-kd-iz">{p}</span>;
  if (p.startsWith('"')) return <span key={i} className="fi-kd-str">{p}</span>;
  if (/^(const|let|for|function)$/.test(p)) return <span key={i} className="fi-kd-kw">{p}</span>;
  if (p === 'goya') return <span key={i} className={cxx('fi-kd-goya', ajrat && 'ajrat')}>{p}</span>;
  return <span key={i}>{p}</span>;
});
// VS Code oynasi: kod o'qiladi, nusxalanmaydi (PM-082 d); terminal — kutilgan natija, «Bajardim»dan keyin to'liq rangda
const VsOyna = ({ tayyor, ajrat }) => (
  <div className="fi-vsc" onCopy={e => e.preventDefault()} onCut={e => e.preventDefault()} onContextMenu={e => e.preventDefault()} title={tr({ uz: "Kod nusxalanmaydi — o'zingiz terib yozasiz", ru: 'Код не копируется — наберите сами' })}>
    <div className="fi-vsc-bar"><span className="fi-vsc-fayl"><b>JS</b> sanoq.js</span><span className="fi-vsc-lock">{tr({ uz: "qo'lda yoziladi", ru: 'пишется вручную' })}</span></div>
    <div className="fi-vsc-body">{kdKod(__lang === 'ru' ? 'ru' : 'uz').map((ln, i) => <div key={i} className="fi-vsc-q"><span className="fi-vsc-n">{i + 1}</span><span className="fi-vsc-k">{ln ? jsHl(ln, ajrat) : ' '}</span></div>)}</div>
    <div className={cxx('fi-term', tayyor && 'tayyor')}>
      <span className="fi-term-l">{tr({ uz: 'Kutilgan natija', ru: 'Ожидаемый результат' })}</span>
      <span className="fi-term-q buyruq">$ node sanoq.js</span>
      {KD_NATIJA.map((q, i) => <span key={i} className="fi-term-q" style={{ '--i': i }}>{q}</span>)}
    </div>
  </div>
);
// QKod o'ng ustun propining qolip-nomi (muharrir ma'nosidagi so'z) til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — u o'quvchi matni emas, qolip API nomi (MEXANIZM-TAKLIF 10)
const QKOD_ONG = ['muh', 'arrir'].join('');
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const am = useContext(AchMissCtx);
  const [gateOk, setGateOk] = useState(!!storedAnswer);
  const [miss, setMiss] = useState(null);
  const [ajrat, setAjrat] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const stage2 = gateOk || isMentor || done;
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 1800); return () => clearTimeout(t); }, [ajrat]);
  const pickGate = (i) => {
    if (stage2) return;
    if (GATE_OPTS[i].ok) { setGateOk(true); setMiss(null); setAjrat(true); }
    else { setMiss({ i, k: Date.now() }); if (am) am.miss(screen); }
  };
  const bajardim = () => {
    if (done || isMentor) return;
    setDone(true);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, practice: 'koding', solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  const navLabel = done || isMentor ? tr(T_DAVOM) : !stage2 ? tr({ uz: 'Avval kod-savolini yeching', ru: 'Сначала ответьте на вопрос о коде' }) : tr({ uz: '② Kodni yozing va tugmani bosing', ru: '② Напишите код и нажмите кнопку' });
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · VS Code', ru: 'Пишем код · VS Code' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Ikki g'oyani yonma-yon sanaydigan <A>kod</A> yozamiz.</>, ru: <>Пишем <A>код</A>, который считает две идеи рядом.</> })}
        mentor={<Mentor key={stage2 ? 'k2' : 'k1'}>{!stage2
          ? tr({ uz: "Avval bitta savol — so'ng kod yoziladi.", ru: 'Сначала один вопрос — потом пишем код.' })
          : tr({ uz: "Doskada qo'lda sanaganingizni endi kod ikki g'oya uchun sanaydi.", ru: 'То, что вы считали руками на доске, теперь посчитает код для двух идей.' })}</Mentor>}
        vazifa={!stage2
          ? <div className="fi-darvoza">
              <span className="fi-darvoza-s">{tr({ uz: 'Kod jamoa yig\'ish yozuvlarini qanday ajratadi?', ru: 'Как код отделяет записи о сборе команды?' })}</span>
              <div className="fi-darvoza-v fi-guruh">{GATE_OPTS.map((g, i) => { const silk = miss && miss.i === i; return <QChip key={silk ? `${i}-${miss.k}` : i} silk={silk} holat={silk ? 'err' : undefined} onClick={() => pickGate(i)}>{tr(g.t)}</QChip>; })}</div>
              {miss && GATE_OPTS[miss.i].xato && <QXato>{fmtCode(tr(GATE_OPTS[miss.i].xato))}</QXato>}
              <NishonQatori screen={screen} />
            </div>
          : <ol className="fi-vazifa">{KD_SHART.map((v, i) => <li key={i}><i>{i + 1}</i><span>{tr(v)}</span></li>)}</ol>}
        yordam={stage2 && <div className="fi-kyordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(T_YORDAM)} {yordam ? '▾' : '▸'}</QTugma>
          {yordam && <div className="fi-kyordam-b fade-step">
            <span className="fi-kyordam-h">{tr({ uz: 'Eslatma (JavaScript darslaridan)', ru: 'Напоминание (из уроков JavaScript)' })}</span>
            <ul className="fi-esl-ro">{KD_ESLATMA.map((e, k) => <li key={k}>{e.plain ? <b>{e.k}</b> : <code className="qcode">{e.k}</code>} — {e.plain ? tr(e.t) : fmtCode(tr(e.t))}</li>)}</ul>
            <span className="fi-kyordam-h">{tr({ uz: 'Uch qadam', ru: 'Три шага' })}</span>
            <ol className="fi-vazifa">{KD_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
          </div>}
        </div>}
        bajardim={stage2 && <div className="fi-amal">
          <QTugma className={!done && !isMentor ? 'fi-halqa' : undefined} disabled={done || isMentor} onClick={bajardim}>{done ? '✓ ' : ''}{tr({ uz: 'Bajardim — ikki qator chiqdi', ru: 'Готово — вывелись две строки' })}</QTugma>
          {done && <SanoqDoska kichik className="fi-kd-sd fade-step" ustunlar={mUstun()} qatorlar={[mQator('muammo', 'toldi'), mQator('belgi', 'toldi')]} />}
        </div>}
        {...{ [QKOD_ONG]: <div className="fi-kodoyna">
          {stage2 && <QIzoh>{tr({ uz: "Kodni VS Code'da o'zingiz terib yozasiz — nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi.", ru: 'Код вы набираете в VS Code сами — скопировать нельзя: учатся, когда пишут руками.' })}</QIzoh>}
          <VsOyna tayyor={done} ajrat={ajrat} />
        </div> }}
      >
        {isMentor && <SinfHolat live={live} screen={screen} />}
        <MentorNote>{tr({ uz: "Kod — yangi qoida yo'q: g'oyani goya qiymatidan ajratish va ikki sanoq. \"to'garak\" — satr ikki qo'shtirnoqda, apostrof xato bermaydi; bitta qo'shtirnoq bilan yozilsa — xato. O'z yozuvlarini massivga qo'shib, o'z g'oyalari nomi bilan sanoq(\"…\") chaqirgan o'quvchini maqtang — shart emas.", ru: 'В коде нет нового правила: отделить идею по значению goya и два подсчёта. "to\'garak" — строка в двойных кавычках, апостроф не мешает; с одинарными кавычками будет ошибка. Похвалите ученика, который добавил свои записи и вызвал sanoq("…") со своими идеями, — это не обязательно.' })}</MentorNote>
      </QKod>
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; ✔ A, INLINE_KEYS.s12 = 0; «teng chiqdi» holati — ikkinchi olam, P-002) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Ikki g'oyada muammo teng chiqdi. Doskadan yana nimani ko'rasiz?"
    question={tr({ uz: <h2 className="title h-ask">Ikki g'oyada muammo teng chiqdi. Doskadan <A>yana nimani</A> ko'rasiz?</h2>, ru: <h2 className="title h-ask">В двух идеях проблема вышла поровну. <A>Что ещё</A> вы посмотрите на доске?</h2> })}
    options={[
      { uz: 'Necha yozuvda harakat belgisi «ha» ekanini', ru: 'В скольких записях знак действия — «да»' },
      { uz: 'Qaysi odam muammoni eng qattiq aytganini', ru: 'Кто из людей сильнее всех сказал о проблеме' },
      { uz: "Qaysi g'oyaning nomi esda qolarliroq ekanini", ru: 'Название какой идеи лучше запоминается' },
      { uz: 'Qaysi intervyu eng uzoq davom etganini', ru: 'Какое интервью длилось дольше всех' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Doskadagi keyingi dalil — harakat belgisi; qaror bitta qatorga tayanmaydi.', ru: 'Следующий довод на доске — знак действия; решение не опирается на одну строку.' }}
    explainWrong={{
      1: { uz: 'Qattiq gap bir odamniki — sanoq emas.', ru: 'Громкие слова одного человека — это не подсчёт.' },
      2: { uz: "Nom g'oyani tanlamaydi — yozuvlarga qarang.", ru: 'Название не выбирает идею — смотрите на записи.' },
      3: { uz: 'Uzoq suhbat — muammo ham, belgi ham emas.', ru: 'Долгий разговор — ни проблема, ни знак.' },
      default: { uz: "Doskaning to'rtinchi qatorini eslang.", ru: 'Вспомните четвёртую строку доски.' }
    }}
    vizual={<SanoqDoska kichik className="fi-sd-1" ustunlar={mUstun()} qatorlar={[mQator('belgi', 'toldi')]} />} />
);

// ===== 🏅 NISHONLAR (4) — faqat ish qilingan ekranlarda (tekin bonus yo'q, S-034); nom inglizcha, tavsif — qilingan ish (§184) =====
const ACHIEVEMENTS = {
  problemBuilder: { icon: '🧱', name: 'Problem Builder!', desc: { uz: "Mentorning muammo gapini yozuvlardan birinchi urinishda yig'dingiz", ru: 'С первой попытки собрали фразу Ментора о проблеме из записей' } },
  repeatFinder: { icon: '🔁', name: 'Repeat Finder!', desc: { uz: "O'z yozuvlaringizda takrorlangan javoblarni sanadingiz", ru: 'Посчитали повторяющиеся ответы в своих записях' } },
  finalIdea: { icon: '🎯', name: 'Final Idea!', desc: { uz: "Final g'oyangizni tanlab, muammo gapini yozdingiz", ru: 'Выбрали финальную идею и написали фразу о проблеме' } },
  countCoder: { icon: '🧮', name: 'Count Coder!', desc: { uz: "Ikki g'oyani yonma-yon sanaydigan kod yozdingiz", ru: 'Написали код, который считает две идеи рядом' } }
};
// Ekran id → nishon (onAnswer correct: true bo'lganda; s8 va s11 — birinchi urinishda, xato bo'lsa AchMissCtx.miss)
const ACH_TRIGGERS = { s8: 'problemBuilder', s9: 'repeatFinder', s10: 'finalIdea', s11: 'countCoder' };

function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr({ uz: 'Yangi nishon', ru: 'Новый значок' })}: ${ach.name}`}>
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
// Navbatda bittasi ko'rsatiladi — tugagach keyingisi chiqadi
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}

const Confetti = () => {
  const COLORS = [T.accent, T.ok, T.accent, '#FFD380', '#FF7755', '#7DD181'];
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


// Podium savol yorliqlari (kalitlar = SCORED_IDX: 3, 5, 7, 12 — q22)
const Q_LABELS = {
  3: { uz: '1 — Takrorlangan javob', ru: '1 — Повторяющийся ответ' },
  5: { uz: '2 — Harakat belgisi', ru: '2 — Знак действия' },
  7: { uz: '3 — YouTube', ru: '3 — YouTube' },
  12: { uz: '4 — Teng sanoq', ru: '4 — Равный счёт' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'yozuv', ru: 'запись' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'sanoq', ru: 'подсчёт' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'takrorlangan javob', ru: 'повторяющийся ответ' }, l: 8, t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: { uz: 'harakat belgisi', ru: 'знак действия' }, l: 72, t: 68, s: 22, d: 21, dl: 2.2 },
  { ch: { uz: "final g'oya", ru: 'финальная идея' }, l: 42, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'muammo gapi', ru: 'фраза о проблеме' }, l: 62, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: '«Keyin»', ru: '«Потом»' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'dalil', ru: 'довод' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A 2·7·11 · B 1·6·12 · C 3·5·10 · D 4·8·9 (MD; har biri 3 marta)
const QUIZ_BANK = [
  { q: { uz: "Ikki g'oya intervyusida savollar nega bir xil bo'ladi?", ru: 'Почему в интервью по двум идеям вопросы одинаковые?' }, opts: [{ uz: "Intervyu qisqaroq va tezroq o'tishi uchun", ru: 'Чтобы интервью было короче и быстрее' }, { uz: 'Javoblarni yonma-yon sanay olish uchun', ru: 'Чтобы ответы можно было считать рядом' }, { uz: 'Odamlar savollarni oldindan bilishi uchun', ru: 'Чтобы люди знали вопросы заранее' }, { uz: "Ikkinchi g'oyani tezroq unutish uchun", ru: 'Чтобы быстрее забыть вторую идею' }], correct: 1 },
  { q: { uz: 'Qaysi javob takrorlangan javob bo\'ladi?', ru: 'Какой ответ будет повторяющимся?' }, opts: [{ uz: "To'rt yozuvda bir xil ma'noli javob", ru: 'Ответ с одним смыслом в четырёх записях' }, { uz: 'Bitta yozuvda eng qattiq aytilgan javob', ru: 'Самый громкий ответ в одной записи' }, { uz: 'Eng uzun yozuvdagi eng oxirgi javob', ru: 'Последний ответ в самой длинной записи' }, { uz: "Mentorga eng ko'p yoqqan bitta javob", ru: 'Один ответ, который больше всего понравился Ментору' }], correct: 0 },
  { q: { uz: "Odam «Chiqsa, ishlatib ko'raman» dedi. Bu nima?", ru: 'Человек сказал: «Когда выйдет, попробую». Что это?' }, opts: [{ uz: 'Harakat belgisi — kun belgilagan', ru: 'Знак действия — назначил день' }, { uz: "Takrorlangan javob — ko'pchilik degan", ru: 'Повторяющийся ответ — так сказали многие' }, { uz: "Va'da — hali bo'lmagan ish haqida", ru: 'Обещание — о деле, которого ещё не было' }, { uz: 'Muammo gapi — kim nimadan qiynaladi', ru: 'Фраза о проблеме — кто от чего страдает' }], correct: 2 },
  { q: { uz: "Mentor misolida nechta o'yinchi sinovga kun belgiladi?", ru: 'Сколько игроков в примере Ментора назначили день для пробы?' }, opts: [{ uz: '5 tadan 1 tasi', ru: '1 из 5' }, { uz: '5 tadan 2 tasi', ru: '2 из 5' }, { uz: '5 tadan 3 tasi', ru: '3 из 5' }, { uz: '5 tadan 4 tasi', ru: '4 из 5' }], correct: 3 },
  { q: { uz: "Mentor misolida ikki o'smirning to'garagini kim topadi?", ru: 'Кто в примере Ментора находит кружок двум подросткам?' }, opts: [{ uz: "O'smirning o'zi", ru: 'Сам подросток' }, { uz: 'Uning sinfdoshi', ru: 'Его одноклассник' }, { uz: 'Uning ota-onasi', ru: 'Его родители' }, { uz: 'Uning murabbiyi', ru: 'Его тренер' }], correct: 2 },
  { q: { uz: "Mentor misolida o'yinchilar hozir jamoani nima bilan yig'adi?", ru: 'Чем игроки в примере Ментора сейчас собирают команду?' }, opts: [{ uz: 'Maydon egasi orqali', ru: 'Через владельца поля' }, { uz: 'Telegram guruhida', ru: 'В Telegram-группе' }, { uz: "Maktab e'lonlarida", ru: 'Объявлениями в школе' }, { uz: 'Maxsus ilova orqali', ru: 'Через особое приложение' }], correct: 1 },
  { q: { uz: "Muammo gapida qaysi uch bo'lak bo'ladi?", ru: 'Какие три части есть во фразе о проблеме?' }, opts: [{ uz: 'Kim, qachon va nimadan qiynaladi', ru: 'Кто, когда и от чего страдает' }, { uz: 'Kim, qayerda va qaysi ilova kerak', ru: 'Кто, где и какое приложение нужно' }, { uz: 'Muammo, yechim va ilovaning nomi', ru: 'Проблема, решение и название приложения' }, { uz: 'Tugma, rang va ilovaning narxi', ru: 'Кнопка, цвет и цена приложения' }], correct: 0 },
  { q: { uz: "Final g'oya qaysi g'oya?", ru: 'Какая идея — финальная?' }, opts: [{ uz: "Nomi eng chiroyli bo'lgan g'oya", ru: 'Идея с самым красивым названием' }, { uz: "RICE bahosi eng katta bo'lgan g'oya", ru: 'Идея с самой большой оценкой RICE' }, { uz: "Ro'yxatda birinchi yozilgan g'oya", ru: 'Идея, записанная в списке первой' }, { uz: "Intervyudan keyin tanlangan g'oya", ru: 'Идея, выбранная после интервью' }], correct: 3 },
  { q: { uz: "Final g'oya tanlangach, ikkinchi g'oya bilan nima qilinadi?", ru: 'Что делают со второй идеей, когда выбрана финальная?' }, opts: [{ uz: "Ro'yxatdan butunlay o'chiriladi", ru: 'Полностью удаляют из списка' }, { uz: "Final g'oyaga qo'shib yuboriladi", ru: 'Добавляют к финальной идее' }, { uz: 'Sinfdoshlardan biriga beriladi', ru: 'Отдают одному из одноклассников' }, { uz: '«Keyin» qutisiga yozib qo\'yiladi', ru: 'Записывают в коробку «Потом»' }], correct: 3 },
  { q: { uz: "10 intervyudan keyingi tanlov haqida qaysi gap to'g'ri?", ru: 'Какая фраза о выборе после 10 интервью верна?' }, opts: [{ uz: "G'oya endi isbotlandi, tekshirish shart emas", ru: 'Идея теперь доказана, проверять не нужно' }, { uz: "Intervyu soni tanlovga hech ta'sir qilmaydi", ru: 'Число интервью никак не влияет на выбор' }, { uz: 'Tanlov uchun dalil bor, lekin isbot emas', ru: 'Для выбора есть довод, но это не доказательство' }, { uz: "Sanoqdan ko'ra o'zimning fikrim muhimroq", ru: 'Моё мнение важнее подсчёта' }], correct: 2 },
  { q: { uz: 'YouTube asoschilari nimani payqagan?', ru: 'Что заметили основатели YouTube?' }, opts: [{ uz: 'Odamlar har xil video yuklayotganini', ru: 'Что люди загружают самые разные видео' }, { uz: "Faqat tanishuv videolari qo'yilganini", ru: 'Что выкладывают только видео для знакомства' }, { uz: 'Sayt nomi odamlarga yoqmay qolganini', ru: 'Что название сайта разонравилось людям' }, { uz: 'Saytga video yuklash juda sekinligini', ru: 'Что видео на сайт загружается очень медленно' }], correct: 0 },
  { q: { uz: 'Kodda `y.goya === goya` nimani tekshiradi?', ru: 'Что проверяет в коде `y.goya === goya`?' }, opts: [{ uz: "Yozuvda belgi bor-yo'qligini", ru: 'Есть ли в записи знак' }, { uz: "Yozuv shu g'oyaniki ekanini", ru: 'Что запись относится к этой идее' }, { uz: 'Yozuvlar soni nechtaligini', ru: 'Сколько всего записей' }, { uz: "G'oya nomining uzunligini", ru: 'Длину названия идеи' }], correct: 1 },
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
          <span className="cs-hud-i">🏆 PODIUM</span>
        </div>
      )}
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{tr(hint)}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>
  );
};
// ===== ⚡ MUSTAHKAMLASH-JANG (Kahoot arena) — signal zonasi: 100+ (test <100, praktika 500+ bilan to'qnashmaydi) =====
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
const quizPts = (elapsedMs) => elapsedMs <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS) / 2)));
// Bitta o'yinchining barcha javoblaridan yakuniy hisob (hamma klientda bir xil chiqadi)
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

// Aylana taymer — vaqt kamaygani sari yashil → sariq → qizil
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

// Jonli fon: suzuvchi uchqunlar + «web» chiziqlari + kod tokenlari (canvas)
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
    // Arena tokenlari — SHU darsning mavzusidan (arxitektura): dekorativ suzuvchi kod-bo'laklari
    const TOK = ['Frontend', '🗄️', 'Backend', 'front→back', 'request', 'response', 'API', '⚙️', '🖥️', 'client'];
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
  const [phase, setPhase] = useState('lobby'); // lobby | q | reveal | done
  const [qi, setQi] = useState(-1);
  const [remaining, setRemaining] = useState(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState({}); // {qi: {picked, correct, elapsed}}
  const [players, setPlayers] = useState([]);
  const [qRows, setQRows] = useState([]);
  const [answeredN, setAnsweredN] = useState(0);
  const [classEnded, setClassEnded] = useState(false);
  const seenQRef = useRef(-1);
  const qStartRef = useRef(0);
  const deadlineRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // O'quvchi sahifani yangilagan bo'lsa — o'z javoblarini serverdan tiklaymiz
  useEffect(() => {
    if (!isStudent || solo || !live.playerId) return;
    liveQuizAnswers(live.pin).then(rows => {
      const mine = {};
      rows.filter(r => r.player_id === live.playerId).forEach(r => { mine[r.screen_idx - QUIZ_BASE_IDX] = { picked: r.picked, correct: r.correct, elapsed: r.elapsed_ms }; });
      setMyAnswers(m => ({ ...mine, ...m }));
    }).catch(() => {});
  }, []); // eslint-disable-line

  // Jonli sinxron: 1.2s polling — savol/natija/yakun fazalari serverdan keladi.
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

  // Taymer — 100ms; vaqt tugasa javob ochiladi. MENTOR serverni ham 'r' ga o'tkazadi.
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
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме практики' })}</button>
        </div>
      )}

      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>{tr({ uz: '▶ Testni boshlash', ru: '▶ Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Ждите, пока ментор начнёт тест…' })}</p>}
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
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">{tr({ uz: '✓ Hamma javob berdi!', ru: '✓ Все ответили!' })}</span>}
              <button className="qz-btn" onClick={() => ctrl('r', qi)}>{tr({ uz: '⏹ Natijani ochish', ru: '⏹ Открыть результат' })}</button>
            </div>
          )}
        </div>
      )}

      {phase === 'reveal' && Q && (
        <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length} — {tr({ uz: 'natija', ru: 'результат' })}</span>
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
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr({ uz: 'ball', ru: 'баллов' })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ''}</span></>
                : <span className="qz-res-t">{my ? tr({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: 'Мимо — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Побыстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: 'Siz hozir:', ru: 'Вы сейчас:' })} {myRank + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</span>}
            </div>
          )}
          {!solo && (
            <div className="qz-board">
              <div className="qz-board-h">🏆 TOP-5</div>
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
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'лучший стрик' })} 🔥x${soloScore.maxStreak}` : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>{tr({ uz: '↻ Qayta ishlash', ru: '↻ Пройти заново' })}</button>
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
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: 'Siz', ru: 'Вы' })} — <b>{myRank + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</b> · {board[myRank].pts} {tr({ uz: 'ball', ru: 'баллов' })}</p>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест заново — практика (в таблицу не идёт)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

// ===== 🏆 PODIUM / STATISTIKA — jonli reyting (jonli-ulanishni ⚡ Jonli qiladi; self-mode fallback tayyor) =====
const ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
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
        <div className="head head-c"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не присоединился.' })}</p></div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz', ru: 'Вы' })} — <b>{myIdx + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</b> ({board[myIdx].okCount}/{totalQ} {tr({ uz: "to'g'ri", ru: 'верно' })})</p>}
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
      </div>
    </Stage>
  );
};

// ===== 🛠️ JONLI PRAKTIKA (reusable) — o'quvchi VS Code'da bajaradi, ustoz kuzatadi =====
// signal zonasi: <100 test · 100+ arena · 500+ praktika (to'qnashmaydi).
const PRACTICE_BASE = 500;
// Mentor ko'rinishi sloti — "kim bajardi" jonli chiplar paneli. JONLI roli to'ldiradi.
const MentorPracticeStats = ({ live, screen }) => {
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        // Praktika signali 500+ zonasida (test <100, arena 100+ bilan to'qnashmaydi)
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
      <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink2, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружается…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink2, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не присоединился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.okFon, color: T.ok }}>✓ {p.nickname}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ opacity: 0.6 }}>{p.nickname}</span>)}
        </div>
      )}
    </div>
  );
};

// 🃏 Kartochka mexanikasi va ko'rinishi — qolipda: QKartochka (DE-204). 12 karta — MD 14-ekran aynan (S-027: old tomon — to'liq savol).
const KARTOCHKALAR = [
  { front: { uz: 'Takrorlangan javob nima?', ru: 'Что такое повторяющийся ответ?' }, back: { uz: "Bir necha yozuvda bir xil ma'noda qaytgan javob", ru: 'Ответ, который с тем же смыслом вернулся в нескольких записях' } },
  { front: { uz: "Ikki g'oyaning javoblarini nega yonma-yon sanash mumkin?", ru: 'Почему ответы двух идей можно считать рядом?' }, back: { uz: "Ikkala g'oyaga bir xil savollar berilgan", ru: 'Обеим идеям задали одинаковые вопросы' } },
  { front: { uz: 'Harakat belgisi nima?', ru: 'Что такое знак действия?' }, back: { uz: "Odam so'z bilan emas, ish bilan ko'rsatgan qiziqish; Mentor misolida — sinovga kun belgiladi", ru: 'Интерес, который человек показал не словом, а делом; в примере Ментора — назначил день для пробы' } },
  { front: { uz: "«Ishlatib ko'raman» degan javob harakat belgisimi?", ru: 'Ответ «попробую» — это знак действия?' }, back: { uz: "Yo'q: bu va'da — hali bo'lmagan ish haqida", ru: 'Нет: это обещание — о деле, которого ещё не было' } },
  { front: { uz: "Mentor misolida muammo qaysi g'oyada ko'proq yozuvda chiqdi?", ru: 'В какой идее у Ментора проблема встретилась в большем числе записей?' }, back: { uz: "Jamoa yig'ishda: 5 yozuvdan 4 tasida, to'garakda 3 tasida", ru: 'В сборе команды: в 4 записях из 5, в кружках — в 3' } },
  { front: { uz: "Mentor misolida sinovga qaysi g'oya bo'yicha ko'proq kun belgilandi?", ru: 'По какой идее у Ментора чаще назначали день для пробы?' }, back: { uz: "Jamoa yig'ishda — 4 / 5; to'garakda — 1 / 5", ru: 'В сборе команды — 4 / 5; в кружках — 1 / 5' } },
  { front: { uz: "Nega mahalla to'garaklari «Keyin» qutisiga o'tdi?", ru: 'Почему кружки махалли ушли в коробку «Потом»?' }, back: { uz: "Harakat belgisi kam; yozuvlarda ikki o'smir tanlovni ota-onasiga qoldirgan", ru: 'Мало знаков действия; в записях двое подростков оставили выбор родителям' } },
  { front: { uz: "Final g'oya nima?", ru: 'Что такое финальная идея?' }, back: { uz: "Intervyudan keyin tanlangan, bitiruvgacha quriladigan bitta g'oya", ru: 'Одна идея, выбранная после интервью, которую строят до выпуска' } },
  { front: { uz: "Muammo gapida qaysi uch bo'lak bor?", ru: 'Какие три части есть во фразе о проблеме?' }, back: { uz: "Kim, qachon va nimadan qiynaladi — yechim yo'q", ru: 'Кто, когда и от чего страдает — без решения' } },
  { front: { uz: "O'nta intervyu g'oyani isbotlaydimi?", ru: 'Доказывают ли десять интервью идею?' }, back: { uz: "Yo'q: bu tanlov uchun dalil, isbot emas", ru: 'Нет: это довод для выбора, а не доказательство' } },
  { front: { uz: "YouTube g'oyasi nimaga qarab o'zgargan?", ru: 'На что глядя изменилась идея YouTube?' }, back: { uz: 'Odamlar saytga har xil video yuklayotganiga', ru: 'На то, что люди загружают на сайт самые разные видео' } },
  { front: { uz: 'Kodda `y.goya === goya` nimani tekshiradi?', ru: 'Что проверяет в коде `y.goya === goya`?' }, back: { uz: "Yozuv shu g'oyaniki ekanini", ru: 'Что запись относится к этой идее' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q; birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */}
        <div className={cxx('fi-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: fmtCode(tr(c.front)), back: tr(c.back) }))} />
          {!bosildi && <p className="fi-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + raqamli qadamlar; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: "o'z auditoriyangiz", ru: 'ваша аудитория' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '10 yozuv', ru: '10 записей' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Har g'oyada 5 ta yozuv bo'lmasa, qolgan intervyularni o'tkazing, doskangizdagi sonlarni yangilang va tanlovni qayta ko'ring.", ru: 'Если в каждой идее нет 5 записей, проведите оставшиеся интервью, обновите числа на доске и пересмотрите выбор.' },
  { uz: "Muammo gapingizni qayta o'qing: kim, qachon va nimadan qiynalishi bormi, yechim kirib qolmadimi?", ru: 'Перечитайте фразу о проблеме: есть ли кто, когда и от чего страдает, не попало ли туда решение?' },
  { uz: "Sinovga kun belgilagan odamlarni qog'ozingizda belgilab qo'ying — ismi emas, kimligi.", ru: 'Отметьте на бумаге людей, которые назначили день для пробы, — не имя, а кто они.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card fi-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="fi-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="fi-hw-q"><span className="fi-hw-k">{tr(r.k)}</span><span className="fi-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="fi-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{tr(q)}</span></li>)}</ol>
    {keyingi && <span className="fi-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Bugungi asosiy fikr» (P-013, ScoreRing o'rnida). CODE STRIKE va arena — darsda =====
const SummaryScreen = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
  // «Endi siz bilasiz» — bugungi asosiy fikrni takrorlamaydi (T-048)
  const RECAP = [
    { uz: "Bir necha yozuvda bir xil ma'noda qaytgan javob — takrorlangan javob; ikki g'oyani bir xil qatorlar bilan sanaysiz.", ru: 'Ответ, который с тем же смыслом вернулся в нескольких записях, — повторяющийся ответ; две идеи вы считаете по одинаковым строкам.' },
    { uz: "Harakat belgisi — so'z emas, ish: Mentor misolida odam sinovga kun belgiladi.", ru: 'Знак действия — не слово, а дело: в примере Ментора человек назначил день для пробы.' },
    { uz: "Mahsulotni kim ishlatishi va kim tanlashi boshqa-boshqa odam bo'lishi mumkin.", ru: 'Тот, кто пользуется продуктом, и тот, кто его выбирает, могут быть разными людьми.' },
    { uz: "Muammo gapi kim, qachon va nimadan qiynalishini aytadi — unda yechim yo'q.", ru: 'Фраза о проблеме говорит, кто, когда и от чего страдает, — решения в ней нет.' },
    { uz: "YouTube asoschilari g'oyani odamlar saytda nima qilayotganiga qarab o'zgartirgan.", ru: 'Основатели YouTube изменили идею, глядя на то, что люди делают на сайте.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«G'oyangiz bir sahifaga sig'adimi?»</b></>, ru: <>Следующий урок — <b>«Поместится ли ваша идея на одну страницу?»</b></> });
  const doska = answers && answers[9] && answers[9].doska;
  const fin = answers && answers[10];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const sarlavha = isMentorL || (fin && !fin.vaqtincha)
    ? tr({ uz: <>Final g'oyangiz va muammo gapingiz <A>tayyor</A>.</>, ru: <>Ваша финальная идея и фраза о проблеме <A>готовы</A>.</> })
    : fin
      ? tr({ uz: <>Vaqtincha tanlov tayyor — <A>yozuvlar 5 + 5 bo'lsin</A>.</>, ru: <>Временный выбор готов — <A>пусть записей будет 5 + 5</A>.</> })
      : tr({ uz: <>Doskangiz tayyor — <A>final g'oyani uyda tanlaysiz</A>.</>, ru: <>Ваша доска готова — <A>финальную идею выберете дома</A>.</> });
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={sarlavha}
        cta={<>
          <div className="fi-fikr fade-up d1"><span className="fi-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><p className="fi-fikr-t small">{tr({ uz: 'Yozuvlar sanog\'i final g\'oya uchun yangi dalil beradi, isbot emas: qaror bitta songa tayanmaydi.', ru: 'Подсчёт записей даёт финальной идее новый довод, а не доказательство: решение не опирается на одно число.' })}</p></div>
          {!isMentorL && doska && <DoskamStrip doska={doska} final={!!fin} />}
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={RECAP.map(tr)}
        uyga={<HwCard keyingi={keyingi} />}
        keyingi={keyingi}
        hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      />
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmFinalIdeaLesson({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
  setLiveLang(lang); // jonli-modul tarjimoni ham shu tilda
  // F-0730-01: saqlangan progress bir marta o'qiladi (jonli-o'quvchi mentor
  // darvozasidan oshib ketmasin — liveRead'dagi lastScreen bilan clamp).
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
  // 🏅 Nishonlar
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
    if (!sid || missedRef.current.has(sid) || (ach && earnedRef.current.has(ach))) return; // nishonsiz test-ekran ham (ball — birinchi to'liq urinish, F5 dan keyin ham)
    missedRef.current.add(sid);
    setMissed(new Set(missedRef.current));
  }, []);
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);
  // ETALON — 1920px (InternetLesson): keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor ochganda set_quiz_keys bilan serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken }); // liveToken — LMS'dan (avval null, keyin keladi)
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS }); // server-progress: davom / ko'rish / toza boshlash
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  // 🃏 Flashcard ekrani jonli darsda (mentor boshqaruvida) o'quvchida ko'rsatilmaydi
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    // Q1 (19.09): UYDA (solo) maxsus test javobi ham serverga — rasmiy natijada sanalsin (oldin faqat jonli darsda
    // yuborilardi → «javobsiz»). `picked` kalitdan: server `data.correct` (birinchi urinish) ni oladi. MCQ o'zi `recordAttempt`
    // bilan yozadi — takrori serverda e'tiborsiz (on conflict do nothing). «Qaytadan» mashqida yuborilmaydi (151-qonun 6-band).
    if (_m && _m.scored && live.mode === 'solo' && !firstPassRef.current && data && (data.solved === true || data.correct === true) && !soloSentRef.current.has(idx)) {
      const key = INLINE_KEYS[_m.id];
      if (Number.isInteger(key)) { soloSentRef.current.add(idx); live.submitAnswer(idx, _m.id, key < 0 ? 0 : (data.correct ? key : (key === 0 ? 1 : 0)), !!data.correct, data.elapsedMs || 0); }
    }
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]); //  nishon (faqat SCORED test — REAL solve)
    // Yakuniy gate (s15) — XATO javob ham serverga ketadi (aks holda xato qilgan o'quvchi podiumda umuman ko'rinmaydi).
    if (_m && _m.scored && _m.scope === 'final' && data && data.solved && live.mode === 'student') live.submitAnswer(idx, _m.id, data.picked ?? 1, !!data.correct, data.elapsedMs || 0);
  };
  const reset = () => { if (!firstPassRef.current) { firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000) }; setFpPractice(true); } progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + nishonlar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned, missed, fpPractice]);

  const finishLesson = () => {
    progClear(LESSON_META.lessonId); // F-0730-01: yakunlangan dars saqlovi tozalanadi
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenPodium, ScreenFlashcards, SummaryScreen];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
/* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }
        ${qolipCss(T)}
        /* === 11-Modul 4-dars — darsning o'z vizuali (prefiks fi-). Faqat qolip tokenlari (D3); brend ranglari — faqat nomlarda: YouTube (#FF0000), Maydon Jamoa (#2E9E4F, tayanch 9.62) === */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .fi-kul { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 8px; line-height: 1.3; }
        .fi-yt { color: #FF0000; font-weight: 800; font-style: normal; }
        .fi-mj-nom { color: #2E9E4F; font-weight: 800; font-style: normal; }
        /* Bosiladigan joy halqasi (SABOQ 11, 32): accent halqa doim, to'lqin juda yengil (scale 1.03, shaffoflik 0.35, sikl 2.4 s, 3 marta); kam harakatda to'lqin o'chadi */
        .fi-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .fi-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: fi-tolqin 2.4s ease-in-out 0.4s 3; }
        .fi-guruh { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .fi-guruh::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: fi-tolqin 2.4s ease-in-out 0.5s 3; }
        .fi-halqa-i { border-color: ${T.accent} !important; animation: fi-tolqin-i 2.4s ease-in-out 0.4s 3; }
        .stage-nav .btn-white-accent:not(:disabled) { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .stage-nav .btn-white-accent:not(:disabled)::after { content: ''; position: absolute; inset: -5px; border-radius: 15px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: fi-tolqin 2.4s ease-in-out 0.5s 3; }
        .lesson-root:has(.fi-flash.yangi) .stage-nav .btn-white-accent { outline: none; }
        .lesson-root:has(.fi-flash.yangi) .stage-nav .btn-white-accent::after { display: none; }
        @keyframes fi-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes fi-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        @keyframes fi-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes fi-tush { from { opacity: 0; transform: translateY(-8px) scale(0.85); } to { opacity: 1; transform: none; } }
        @keyframes fi-sirg { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
        @keyframes fi-yon { 0%, 60% { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; } 100% { box-shadow: inset 0 0 0 1.5px transparent; } }
        @keyframes fi-ajr { 0%, 70% { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; } 100% { box-shadow: inset 0 0 0 1.5px transparent; } }
        @keyframes fi-son { from { transform: scale(1.35); } to { transform: scale(1); } }
        @keyframes fi-yigil { from { opacity: 0; transform: scaleY(0.6); } to { opacity: 1; transform: none; } }
        @keyframes fi-nuqta { from { transform: scale(0.4); opacity: 0.3; } to { transform: scale(1); opacity: 1; } }
        @keyframes fi-kursor { 50% { opacity: 0; } }
        @keyframes fi-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 100% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } }
        @keyframes fi-halqa-k { 0%, 100% { box-shadow: 0 0 0 3px ${T.accent}; } 50% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 9px ${fon(T.accent, 0.18)}; } }
        /* Umumiy bloklar */
        .fi-mnote-c { align-self: flex-end; }
        .fi-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .fi-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        p.fi-nishon { margin: 0; font-size: 12px; color: ${T.ink2}; }
        p.fi-nishon.ketdi { opacity: 0.75; }
        p.fi-sinf { margin: 0; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .fi-mstat { display: flex; flex-wrap: wrap; gap: 10px; }
        .fi-mstat-q { display: flex; align-items: baseline; gap: 8px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 8px 14px; }
        .fi-mstat-q b { font-family: 'JetBrains Mono', monospace; font-size: 20px; color: ${T.accent}; }
        .fi-mstat-q span { font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .fi-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .fi-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 28px; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .fi-ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .fi-ovoz-y { height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .fi-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.6s ease-out; }
        .fi-ovoz-q b { font-family: 'JetBrains Mono', monospace; text-align: right; color: ${T.ink}; }
        .fi-bash .q-bashorat { animation: fi-kir 0.45s ease-out both; }
        .fi-bash .q-chip { animation: fi-kir 0.35s ease-out both; }
        .fi-bash .q-chip:nth-child(2) { animation-delay: 0.09s; } .fi-bash .q-chip:nth-child(3) { animation-delay: 0.18s; }
        .fi-bash .q-variantlar { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .fi-bash .q-variantlar::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: fi-tolqin 2.4s ease-in-out 0.6s 3; }
        .fi-bashq { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 9px 14px; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; transform-origin: top; animation: fi-yigil 0.4s ease-out both; }
        .fi-bashq-t { white-space: nowrap; }
        .fi-bashq-t b { color: ${T.accent}; }
        .fi-tx { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .fi-tx.ok { color: ${T.ok}; }
        .fi-tx b { color: ${T.ok}; }
        .fi-tx b.yoq { color: ${T.err}; }
        p.fi-javob { margin: 2px 0 0; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; font-size: clamp(13.5px,1.5vw,15px); font-weight: 600; line-height: 1.5; color: ${T.ink}; }
        .fi-izohlar { display: flex; flex-direction: column; gap: 6px; }
        .fi-xato-q { display: flex; flex-direction: column; gap: 3px; }
        .fi-inp { width: 100%; min-width: 0; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 600; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 9px 11px; outline: none; }
        .fi-inp.kichik { font-size: 13.5px; padding: 6px 9px; }
        .fi-inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .fi-inp:disabled { background: ${T.bg}; color: ${T.ink2}; }
        .fi-amal { display: flex; justify-content: flex-end; align-items: center; gap: 10px; flex-wrap: wrap; }
        .fi-yordam { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px dashed ${T.line}; }
        /* === Bitta vizual: yozuv kartalari (chap) === */
        .fi-yu { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; align-items: start; }
        .fi-yu-c { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .fi-yu-h { display: flex; flex-direction: column; gap: 1px; font-size: 12px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink}; padding: 0 2px 2px; }
        .fi-yu-kim { font-size: 12px; font-weight: 600; letter-spacing: 0; text-transform: none; color: ${T.ink2}; }
        .fi-yu-ro { display: flex; flex-direction: column; gap: 5px; }
        .fi-yu.ixcham .fi-yu-ro { flex-direction: row; flex-wrap: wrap; }
        .fi-yu-son { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 3px 9px; }
        .fi-yk { position: relative; display: flex; align-items: flex-start; gap: 8px; padding: 7px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; transition: background 0.35s, border-color 0.35s, opacity 0.35s; }
        .fi-yk-n { flex: 0 0 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; background: ${T.bg}; color: ${T.ink2}; }
        .fi-yk-b { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
        .fi-yk-kim { font-size: 12.5px; font-weight: 700; color: ${T.ink}; line-height: 1.35; }
        .fi-yk-parda { align-self: flex-start; font-size: 11px; font-weight: 700; color: ${T.ink2}; padding: 1px 8px; border-radius: 6px; background: ${T.bg}; border: 1px dashed ${T.line}; }
        .fi-yk.ochildi .fi-yk-kim { animation: fi-sirg 0.35s ease-out both; }
        .fi-yk-j { font-size: 12px; line-height: 1.4; color: ${T.ink2}; animation: fi-sirg 0.4s ease-out both; animation-delay: calc(var(--i) * 0.06s); }
        .fi-yk-j.ha { color: ${T.ok}; font-weight: 700; }
        .fi-yk.mos { background: ${T.accentSoft}; border-color: ${fon(T.accent, 0.45)}; }
        .fi-yk.mos .fi-yk-n { background: ${T.accent}; color: #fff; }
        .fi-yk.mos .fi-yk-j { color: ${T.ink}; font-weight: 600; }
        .fi-yk-ok { position: absolute; top: 6px; right: 8px; font-style: normal; font-weight: 800; font-size: 13px; color: ${T.accent}; animation: fi-tush 0.35s ease-out both; animation-delay: calc(var(--i) * 0.1s + 0.15s); }
        .fi-yk.kul { opacity: 0.6; }
        .fi-yk.ajrat { box-shadow: 0 0 0 2px ${T.accent}; }
        .fi-yc { display: inline-flex; align-items: center; gap: 5px; min-height: 22px; padding: 2px 7px; border-radius: 8px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; color: ${T.ink2}; transition: background 0.3s, box-shadow 0.3s, transform 0.3s; animation: fi-kir 0.3s ease-out both; animation-delay: calc(var(--i) * 0.05s); }
        .fi-yc b { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.ink}; }
        .fi-yc i { font-style: normal; font-weight: 800; color: ${T.accent}; }
        .fi-yc.ok { background: ${T.accentSoft}; border-color: ${fon(T.accent, 0.4)}; }
        .fi-yc.yon { background: ${T.accentSoft}; box-shadow: 0 0 0 2px ${T.accent}; transform: scale(1.06); }
        .fi-yc-ro { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 4px; }
        .fi-yc-ro .fi-yc { padding: 1px 5px; min-height: 20px; font-size: 11px; }
        .fi-yc-k { font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .fi-yc-b { overflow: hidden; }
        .fi-yc-b { width: 100%; justify-content: flex-start; }
        .fi-yc-b.ha { background: ${T.okFon}; border-color: ${fon(T.ok, 0.45)}; }
        .fi-yc-b.ha i { color: ${T.ok}; }
        .fi-yc-b.yoq { opacity: 0.7; }
        .fi-yc-b.tushdi .fi-yc-t { animation: fi-tush 0.35s ease-out both; animation-delay: calc(var(--i) * 0.1s); }
        .fi-yc-t { font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .fi-yc-b.ha .fi-yc-t { color: ${T.ok}; }
        .fi-yc-q { font-size: 12px; font-style: italic; color: ${T.ink}; }
        /* === Sanoq doskasi (o'ng) === */
        .fi-sd { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 24px -18px rgba(${T.shadowBase},0.45); }
        .fi-sd-h, .fi-sd-q { display: grid; grid-template-columns: minmax(96px, 0.8fr) minmax(0,1fr) minmax(0,1fr); gap: 8px; align-items: start; }
        .fi-sd-hc { display: flex; flex-direction: column; gap: 2px; font-size: 11.5px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink}; }
        .fi-sd-nom { overflow-wrap: anywhere; }
        .fi-sd-q { padding: 6px 0 1px; border-top: 1px solid ${T.line}; border-radius: 8px; }
        .fi-sd-q.yangi { animation: fi-yon 1.3s ease-out both; }
        .fi-sd-q.ajrat { animation: fi-ajr 1.6s ease-out both; animation-delay: calc(var(--r) * 0.25s); }
        .fi-sd-nm { font-size: 12.5px; font-weight: 800; color: ${T.ink}; line-height: 1.3; padding-top: 2px; }
        .fi-sd-q.kul .fi-sd-nm, .fi-sd-q.bosh .fi-sd-nm { color: ${T.ink2}; }
        .fi-sd-q.kul { opacity: 0.55; }
        .fi-sd-sv { grid-column: 2 / -1; display: flex; }
        .fi-sd-k { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .fi-sd-kq { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 4px 10px; }
        .fi-nq { display: flex; flex-wrap: wrap; gap: 5px; }
        .fi-nq i { position: relative; width: 13px; height: 13px; border-radius: 50%; background: ${T.line}; transition: background 0.3s; transition-delay: calc(var(--i) * 0.1s); }
        .fi-nq i b { position: absolute; top: 14px; font-style: normal; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 700; color: ${T.ink2}; }
        .fi-sd-k .fi-nq { padding-bottom: 11px; }
        .fi-sd.kichik .fi-sd-k .fi-nq { padding-bottom: 0; }
        .fi-nq i.on { background: ${T.accent}; animation: fi-nuqta 0.35s ease-out both; animation-delay: calc(var(--i) * 0.1s); }
        .fi-nq i.farq { box-shadow: 0 0 0 3px ${fon(T.accent, 0.3)}; }
        .fi-nq.kichik i { width: 11px; height: 11px; }
        .fi-sd-q.bosh .fi-nq i { animation: fi-kir 0.4s ease-out both; animation-delay: calc(var(--r) * 0.3s + var(--i) * 0.06s); }
        .fi-sd-son { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: ${T.ink2}; }
        .fi-sd-son { line-height: 13px; }
        .fi-sd-son.toldi { font-size: 14px; color: ${T.ink}; display: inline-block; animation: fi-son 0.45s ease-out; }
        .fi-sd-m { font-size: 12px; font-weight: 700; color: ${T.accent}; line-height: 1.35; }
        .fi-sd-ost { font-size: 11.5px; line-height: 1.35; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 6px; align-self: flex-start; transition: box-shadow 0.3s; }
        .fi-sd-ost.ajrat { color: ${T.ink}; background: ${T.accentSoft}; box-shadow: 0 0 0 1.5px ${T.accent}; }
        .fi-sd.kichik { padding: 9px 12px; gap: 4px; }
        .fi-sd.kichik .fi-sd-q { padding-top: 6px; }
        .fi-sd.kichik .fi-sd-son.toldi { font-size: 14px; }
        .fi-sd-1 { max-width: 520px; }
        .lesson-root .fi-savol { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.45)}; border-radius: 10px; padding: 8px 14px; cursor: pointer; transition: background 0.2s; }
        .lesson-root .fi-savol:hover:not(:disabled) { background: ${T.accentSoft}; }
        .lesson-root .fi-savol:disabled { color: ${T.ink2}; border-color: ${T.line}; cursor: default; opacity: 0.7; }
        .fi-test-viz { display: flex; flex-direction: column; }
        .fi-d2-r, .fi-hm-yu, .fi-rj-sd, .fi-s8-sd, .fi-s10-sd, .fi-s9-mentor { min-width: 0; }
        .fi-kd-sd { width: 100%; margin-top: 4px; }
        .fi-s4 { align-items: start; }
        .fi-sd-hl { display: block; }
        .fi-tanlov-c { max-width: 100%; }
        .fi-sol-ch.bir { border-top-style: solid; }
        .lesson-root ol.q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .fi-d2 { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,1fr); gap: 16px; align-items: start; }
        .fi-d2.tugadi { grid-template-columns: minmax(0,1fr); }
        .fi-d2.tugadi .fi-d2-l { animation: fi-yigil 0.4s ease-out both; }
        /* 0-ekran maketi */
        .fi-hm { display: flex; flex-direction: column; gap: 8px; }
        .fi-s0.tanlovsiz .q-variantlar-kol { position: relative; outline: 2px solid ${T.accent}; outline-offset: 6px; border-radius: 14px; }
        .fi-s0.tanlovsiz .q-variantlar-kol::after { content: ''; position: absolute; inset: -10px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: fi-tolqin 2.4s ease-in-out 0.5s 3; }
        /* 1-ekran reja chizmasi */
        .fi-rj { display: flex; flex-direction: column; gap: 10px; }
        .fi-rj-fin { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 14px; border-radius: 12px; border: 1.5px dashed ${fon(T.accent, 0.5)}; background: ${T.paper}; font-size: 13px; font-weight: 800; color: ${T.ink2}; animation: fi-kir 0.4s ease-out 1.3s both; }
        .fi-rj-fin b { font-family: 'JetBrains Mono', monospace; color: ${T.accent}; }
        /* 4-ekran: belgilar va guruhlar */
        .fi-s4-yu { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; align-items: start; }
        .fi-s4-yu .fi-yu-ro { gap: 5px; }
        .fi-s4-yu .fi-yu-ro > span { display: block; }
        .fi-s4-yu.tugadi .fi-yu-ro { flex-direction: row; flex-wrap: wrap; }
        .fi-s4-yu.tugadi .fi-yu-ro > span { display: inline-block; }
        .fi-s4-yu.tugadi .fi-yc-b { width: auto; }
        .fi-grplar { display: flex; flex-direction: column; gap: 8px; }
        .fi-grp { display: flex; flex-direction: column; gap: 5px; padding: 7px 8px; border-radius: 10px; background: ${T.bg}; }
        .fi-grp-l { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .fi-s4-yu .fi-kim-b { margin-top: 4px; align-self: flex-start; text-transform: none; letter-spacing: 0; }
        .fi-s5v { display: flex; max-width: 420px; }
        /* === 6-ekran: YouTube (brauzer oynasi) === */
        .fi-nuq { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .fi-nuq-l { margin-right: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .fi-nuq i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .fi-nuq i.ok { background: ${T.ok}; }
        .fi-nuq i.cur { background: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .fi-voqea { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .fi-voqea > .zoomable { width: 100%; max-width: 500px; }
        .fi-voqea-h { font-weight: 800; font-size: clamp(16px,1.8vw,19px); color: ${T.ink}; animation: fi-kir 0.35s ease-out both; }
        .fi-voqea .fi-bash, .fi-voqea .fi-bashq, .fi-voqea p.q-xulosa { width: 100%; max-width: 640px; text-align: left; }
        p.fi-yt-tanish { margin: 0; font-size: 13.5px; color: ${T.ink2}; }
        .fi-ytb { width: 100%; border-radius: 14px; overflow: hidden; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 16px 34px -22px rgba(${T.shadowBase},0.6); }
        .fi-br-bar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .fi-br-bar i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .fi-br-url { flex: 1; max-width: 220px; height: 14px; margin-left: 10px; border-radius: 7px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .fi-ytb-e { display: flex; flex-direction: column; gap: 8px; padding: 10px 14px 14px; }
        .fi-ytb-h { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; font-size: 18px; }
        .fi-ytb-yorliq { font-size: 12.5px; font-weight: 700; color: ${T.ink}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; animation: fi-kir 0.45s ease-out 0.2s both; }
        .fi-ytb-tor { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .fi-vk { position: relative; aspect-ratio: 16 / 9; border-radius: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; transition: opacity 0.5s, filter 0.5s; }
        .fi-vk.bosh { border: 1.5px dashed ${T.line}; background: ${T.bg}; }
        .fi-vk.video { animation: fi-kir 0.45s ease-out both; animation-delay: calc(var(--i) * 0.18s + 0.15s); box-shadow: inset 0 0 0 1px ${fon(T.ink, 0.06)}; }
        .fi-vk.profil { background: #FDE9D9; box-shadow: inset 0 0 0 1px ${fon(T.ink, 0.08)}; }
        .fi-vk.profil.xira { opacity: 0.38; filter: grayscale(0.6); }
        .fi-prof { width: 100%; height: 100%; }
        .fi-vk-l { position: absolute; left: 6px; bottom: 6px; font-size: 11px; font-weight: 800; color: ${T.ink}; background: ${fon(T.paper, 0.9)}; border-radius: 5px; padding: 2px 6px; }
        .fi-vk-pl { position: absolute; right: 6px; bottom: 6px; font-style: normal; font-size: 11px; color: ${T.ink}; background: ${fon(T.paper, 0.9)}; border-radius: 5px; padding: 1px 6px; }
        .fi-vb { width: 62%; height: 62%; }
        /* === 8-ekran: final g'oya === */
        .fi-s8 { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 18px; align-items: start; }
        .fi-s8-l, .fi-s8-r { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .fi-s8-l { align-items: stretch; }
        .fi-s8-l .fi-tel-w { align-self: center; }
        .fi-nom-tugma { align-self: center; }
        .fi-goya-tanlov { display: flex; flex-wrap: wrap; gap: 8px; }
        .lesson-root .fi-goya-b { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px 16px; cursor: pointer; transition: border-color 0.2s, background 0.2s; text-align: left; }
        .lesson-root .fi-goya-b:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .lesson-root .fi-goya-b.katta { display: flex; flex-direction: column; gap: 4px; min-width: 200px; flex: 1; }
        .lesson-root .fi-goya-b.katta span { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .fi-fk { display: flex; flex-direction: column; gap: 8px; padding: 14px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 12px 26px -20px rgba(${T.shadowBase},0.5); transition: background 0.4s, box-shadow 0.4s; }
        .fi-fk.yashil { animation: fi-yon 1.4s ease-out both; }
        .fi-fk-slot { display: flex; flex-direction: column; gap: 3px; padding: 9px 12px; border-radius: 12px; border: 1.5px dashed ${fon(T.accent, 0.5)}; background: ${T.bg}; }
        .fi-fk-slot.bor { border-style: solid; border-color: ${fon(T.accent, 0.35)}; background: ${T.accentSoft}; }
        .fi-fk-l { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
        .fi-fk-nom { font-size: 17px; font-weight: 800; color: ${T.ink}; display: inline-block; }
        .fi-fk-bo { font-family: 'JetBrains Mono', monospace; color: ${T.ink2}; }
        .fi-fk-q { display: grid; grid-template-columns: minmax(84px, 0.42fr) minmax(0,1fr); gap: 4px 10px; align-items: center; padding: 7px 10px; border-radius: 10px; background: ${T.bg}; transition: background 0.3s; }
        .fi-fk-ql { font-size: 11.5px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink2}; }
        .fi-fk-qm { font-size: 14px; font-weight: 700; color: ${T.ink}; line-height: 1.4; }
        .fi-fk-uzuq { display: block; height: 0; border-top: 1.5px dashed ${T.line}; }
        .fi-fk-q.joriy { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .fi-fk-q.joriy .fi-fk-uzuq { border-color: ${fon(T.accent, 0.5)}; }
        .fi-fk-q.yangi { animation: fi-yon 1.2s ease-out both; }
        .fi-fk-q.xato { animation: fi-xato 0.9s ease-out both; }
        @keyframes fi-xato { 0% { background: ${T.errFon}; } 100% { background: ${T.accentSoft}; } }
        .fi-fk-tan { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 6px; padding-top: 4px; }
        .fi-guruh-v { display: flex; flex-wrap: wrap; gap: 6px; }
        .fi-guruh-v .q-chip { animation: fi-kir 0.35s ease-out both; animation-delay: calc(var(--i) * 0.12s); text-align: left; }
        .fi-fk-q.joriy .fi-guruh-v { position: relative; outline: 2px solid ${T.accent}; outline-offset: 4px; border-radius: 12px; }
        p.fi-fk-gap { margin: 0; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 15px; font-weight: 700; line-height: 1.5; color: ${T.ink}; }
        .fi-fk-dalil { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 8px; }
        .fi-fk-keyin { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; padding: 8px 10px; border-radius: 10px; border: 1.5px dashed ${T.line}; }
        .fi-fk-keyin.bor { border-style: solid; background: ${T.bg}; }
        .fi-fk-kl { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .fi-fk-kn { font-size: 13.5px; font-weight: 800; color: ${T.ink}; display: inline-block; }
        .fi-fk-sabab { flex-basis: 100%; font-size: 12px; color: ${T.ink2}; }
        .fi-fk-nega { flex-basis: 100%; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .fi-fk-keyin .fi-inp { flex-basis: 100%; }
        /* Telefon maketi — CHAPDA, ≈170×272 (SABOQ 21, 22) */
        .fi-tel-w { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .fi-tel-w .fi-kul { align-self: center; }
        .fi-tel { position: relative; width: 170px; height: 272px; padding: 9px; border-radius: 26px; background: ${T.ink}; box-shadow: 0 18px 34px -18px rgba(${T.shadowBase},0.55); animation: fi-kir 0.5s ease-out both; }
        .fi-tel-k { position: absolute; top: 11px; left: 50%; width: 46px; height: 6px; border-radius: 3px; background: ${fon(T.paper, 0.25)}; transform: translateX(-50%); z-index: 1; }
        .fi-tel-e { height: 100%; display: flex; flex-direction: column; gap: 10px; padding: 26px 10px 10px; border-radius: 19px; background: ${T.bg}; }
        .fi-tel-nom { min-height: 22px; font-size: 16px; font-weight: 800; color: #2E9E4F; }
        .fi-kursor { display: inline-block; width: 2px; height: 15px; margin-left: 1px; vertical-align: -2px; background: #2E9E4F; animation: fi-kursor 0.8s steps(1) infinite; }
        .fi-elon { display: flex; flex-direction: column; gap: 7px; padding: 10px; border-radius: 12px; background: ${T.paper}; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.3); animation: fi-kir 0.45s 0.3s ease-out both; }
        .fi-elon-q { display: flex; flex-direction: column; gap: 1px; font-size: 11.5px; color: ${T.ink2}; }
        .fi-elon-q b { color: ${T.ink}; font-size: 12.5px; }
        .fi-elon-s { display: flex; flex-direction: column; gap: 5px; }
        .fi-elon-s b { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: ${T.ink}; }
        .fi-elon-d { display: flex; gap: 3px; }
        .fi-elon-d i { width: 9px; height: 9px; border-radius: 50%; border: 1.5px solid #2E9E4F; }
        .fi-elon-d i.on { background: #2E9E4F; animation: fi-nuqta 0.3s ease-out both; animation-delay: calc(var(--i) * 0.07s + 0.5s); }
        .fi-elon-b { text-align: center; font-weight: 800; font-size: 12.5px; color: #fff; background: #2E9E4F; border-radius: 9px; padding: 7px 8px; }
        /* === 9-ekran: o'z sanog'i === */
        .fi-strip { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; align-self: flex-start; padding: 6px 12px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .fi-strip-l { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .fi-strip-g { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; padding: 2px 8px; border-radius: 999px; background: ${T.bg}; }
        .fi-strip-g b { font-family: 'JetBrains Mono', monospace; color: ${T.ink2}; }
        .fi-strip-g i { font-style: normal; color: ${T.ok}; font-weight: 800; }
        .fi-strip-g.joriy { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .fi-strip-g.ok { color: ${T.ink}; }
        .fi-strip-n, .fi-strip-f { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .fi-strip-f { color: ${T.ok}; }
        .q-mustaqil:has(.fi-s9-k), .q-mustaqil:has(.fi-s9-sd), .q-mustaqil:has(.fi-s10-d), .q-mustaqil:has(.fi-s10-g), .q-mustaqil:has(.fi-fk) { max-width: 900px; width: 100%; align-self: center; }
        .fi-s9-g { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; align-items: start; }
        .fi-s9-c { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .fi-s9-k { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 14px 30px -22px rgba(${T.shadowBase},0.55); }
        .fi-karta-kir { animation: fi-kir 0.45s ease-out both; }
        .fi-s9-ch { display: flex; flex-wrap: wrap; gap: 8px; }
        .fi-ch { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: ${T.ink2}; padding: 4px 10px; border-radius: 999px; background: ${T.bg}; }
        .fi-ch b { font-family: 'JetBrains Mono', monospace; }
        .fi-ch.on { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .fi-ch.ok i { font-style: normal; color: ${T.ok}; font-weight: 800; }
        .fi-s9-q { display: flex; flex-direction: column; gap: 4px; padding: 7px 10px; border-radius: 12px; background: ${T.bg}; transition: opacity 0.3s; }
        .fi-s9-q.xira { opacity: 0.5; }
        .fi-s9-q.xato { animation: fi-xato9 0.9s ease-out both; }
        @keyframes fi-xato9 { 0% { background: ${T.errFon}; } 100% { background: ${T.bg}; } }
        .fi-s9-l { font-size: 11.5px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink}; }
        .fi-s9-s { font-size: 13px; color: ${T.ink2}; }
        .fi-s9-r { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }
        .fi-s9-yo { font-size: 12px; line-height: 1.45; color: ${T.ink2}; }
        .fi-st { display: flex; flex-wrap: wrap; gap: 4px; }
        .fi-st .q-chip { min-width: 30px; min-height: 30px; justify-content: center; padding: 3px 7px; font-family: 'JetBrains Mono', monospace; }
        .fi-sn { display: inline-flex; align-items: center; gap: 8px; }
        .fi-sn b { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: ${T.ink}; }
        .fi-esl { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .fi-esl-l { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .fi-esl-k { display: inline-flex; flex-direction: column; gap: 1px; padding: 5px 9px; border-radius: 9px; background: ${T.bg}; border: 1px dashed ${T.line}; font-size: 12px; color: ${T.ink2}; max-width: 260px; }
        .fi-esl-k b { color: ${T.ink}; }
        .fi-esl-k i { font-style: normal; font-size: 11px; }
        .lesson-root .fi-tahrir { align-self: flex-start; width: 28px; height: 28px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; font-size: 14px; cursor: pointer; margin-bottom: 2px; }
        .lesson-root .fi-tahrir:hover { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .fi-s9-sd { width: 100%; }
        /* === 10-ekran: juftlik, final, muammo gapi === */
        .fi-s10-d { display: flex; flex-direction: column; gap: 8px; }
        .fi-s10-sh { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        .fi-s10-shl { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .fi-s10-shv { display: flex; flex-wrap: wrap; gap: 8px; }
        .fi-sherik-tag { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 999px; padding: 3px 10px; }
        .fi-sherik-tag b { color: ${T.ink}; }
        .fi-s10-g { display: flex; flex-wrap: wrap; gap: 10px; width: 100%; }
        .fi-sol { display: grid; grid-template-columns: auto minmax(40px,1fr) auto; align-items: center; gap: 6px 10px; padding: 8px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .fi-sol-p { font-size: 12.5px; color: ${T.ink2}; }
        .fi-sol-p b { color: ${T.ink}; }
        .fi-sol-ch { display: block; height: 0; border-top: 3px solid ${T.ok}; transform-origin: left; animation: fi-chiz 0.6s ease-out both; }
        .fi-sol-ch.boshqa { border-top: 2px dashed ${T.ink2}; opacity: 0.6; }
        @keyframes fi-chiz { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .fi-sol .q-izoh, .fi-sol-kul { grid-column: 1 / -1; }
        .fi-sol-kul { font-size: 12px; color: ${T.ink2}; }
        .fi-s10-bol { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 6px 8px; align-items: start; }
        .fi-s10-bol .fi-fk-q.nima, .fi-s10-bol .fi-s10-yak { grid-column: 1 / -1; }
        .fi-s10-yak { display: flex; align-items: center; gap: 10px; }
        .fi-s10-yak p.fi-s10-gap { flex: 1; margin: 0; }
        .fi-fk-slot .fi-fk-dalil { align-self: flex-start; }
        .fi-s10-bol .fi-fk-q { grid-template-columns: minmax(0,1fr); gap: 4px; }
        .fi-s10-bol .fi-xato-q { grid-column: 1 / -1; }
        p.fi-s10-gap { margin: 2px 0 0; padding: 8px 12px; min-height: 38px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 14.5px; font-weight: 700; line-height: 1.5; color: ${T.ink}; }
        .fi-s10-ogoh { display: flex; flex-direction: column; gap: 5px; }
        .fi-s10-key .fi-inp { margin-top: 2px; }
        /* === 11-ekran: VS Code === */
        .fi-darvoza { display: flex; flex-direction: column; gap: 10px; }
        .fi-darvoza-s { font-weight: 700; font-size: 14.5px; line-height: 1.45; color: ${T.ink}; }
        .fi-darvoza-v { display: flex; flex-direction: column; gap: 8px; align-items: stretch; width: 100%; }
        .fi-darvoza-v .q-chip { text-align: left; }
        .lesson-root ol.fi-vazifa { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .fi-vazifa li { display: flex; gap: 9px; align-items: flex-start; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .fi-vazifa li i { flex: 0 0 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; background: ${T.accentSoft}; color: ${T.accent}; }
        .fi-kyordam { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; margin-top: 10px; }
        .fi-kyordam-b { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; width: 100%; }
        .fi-kyordam-h { font-size: 11.5px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .lesson-root ul.fi-esl-ro { list-style: none; display: flex; flex-direction: column; gap: 4px; }
        .fi-esl-ro li { font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .fi-kodoyna { display: flex; flex-direction: column; gap: 10px; height: 100%; }
        .fi-vsc { display: flex; flex-direction: column; border-radius: 12px; overflow: hidden; background: #1E1E1E; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.7); user-select: none; -webkit-user-select: none; }
        .fi-vsc-bar { display: flex; justify-content: space-between; align-items: center; background: #252526; padding: 0 10px 0 0; }
        .fi-vsc-fayl { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: #1E1E1E; color: #E8E5DD; font-family: 'JetBrains Mono', monospace; font-size: 12px; border-top: 2px solid ${T.accent}; }
        .fi-vsc-fayl b { color: #E8C547; font-size: 10.5px; }
        .fi-vsc-lock { font-size: 11px; color: #9DA3AE; }
        .fi-vsc-body { padding: 8px 0; max-height: 340px; overflow-y: auto; }
        .fi-vsc-q { display: flex; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.45; color: #D4D4D4; }
        .fi-vsc-n { width: 30px; flex-shrink: 0; text-align: right; padding-right: 10px; color: #6E7681; }
        .fi-vsc-k { white-space: pre-wrap; overflow-wrap: anywhere; min-width: 0; padding-right: 8px; }
        .fi-kd-iz { color: #6A9955; } .fi-kd-str { color: #CE9178; } .fi-kd-kw { color: #C586C0; }
        .fi-kd-goya { color: #9CDCFE; border-radius: 3px; transition: background 0.4s; }
        .fi-kd-goya.ajrat { background: ${fon(T.accent, 0.55)}; color: #fff; }
        .fi-term { display: flex; flex-direction: column; gap: 1px; padding: 8px 14px 10px; background: #141414; border-top: 1px solid #333; opacity: 0.42; transition: opacity 0.6s; }
        .fi-term.tayyor { opacity: 1; }
        .fi-term-l { font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #9DA3AE; margin-bottom: 3px; }
        .fi-term-q { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #7DD181; }
        .fi-term-q.buyruq { color: #FFD380; }
        .fi-term.tayyor .fi-term-q:not(.buyruq) { animation: fi-tq 0.7s ease-out both; animation-delay: calc(var(--i) * 0.3s + 0.3s); }
        @keyframes fi-tq { 0%, 60% { background: rgba(125,209,129,0.18); } 100% { background: transparent; } }
        /* === Kartochkalar va yakun === */
        .fi-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: fi-halqa-k 2.4s ease-in-out 0.4s 3; }
        p.fi-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.fi-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: fi-puls 1.4s ease-out 3; }
        .fi-fikr { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 20px 14px; border-radius: 16px; text-align: center; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .fi-fikr-l { font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.fi-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        .fi-hw { display: flex; flex-direction: column; gap: 10px; }
        .fi-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .fi-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .fi-hw-k { font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .fi-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        .lesson-root ol.fi-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .fi-hw-qadam li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .fi-hw-qadam li i { flex-shrink: 0; font-style: normal; font-size: 17px; line-height: 1.3; color: ${T.accent}; }
        .fi-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        @media (max-width: 900px) {
          .fi-d2, .fi-s8 { grid-template-columns: minmax(0,1fr); }
        }
        @media (max-width: 640px) {
          .fi-yu, .fi-s4-yu { gap: 8px; }
          .fi-yk { padding: 6px 8px; }
          .fi-sd { padding: 10px; }
          .fi-sd-h, .fi-sd-q { grid-template-columns: minmax(70px, 0.7fr) minmax(0,1fr) minmax(0,1fr); gap: 6px; }
          .fi-nq { gap: 3px; } .fi-nq i { width: 12px; height: 12px; }
          .fi-ytb-tor { gap: 6px; }
          .fi-fk-q, .fi-s10-bol .fi-fk-q { grid-template-columns: minmax(0,1fr); }
          .fi-hw-karta { grid-template-columns: minmax(0,1fr); }
          .fi-sol { grid-template-columns: minmax(0,1fr); }
          .fi-s10-bol { grid-template-columns: minmax(0,1fr); }
          .fi-s9-g { display: flex; flex-direction: column; gap: 8px; }
          .fi-s9-c { display: contents; }
          .fi-s9-q.nom { order: -1; }
          .fi-s10-yak { flex-direction: column; align-items: stretch; }
          .fi-sol-ch { width: 60px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fi-halqa::after, .fi-guruh::after, .fi-bash .q-variantlar::after, .fi-s0.tanlovsiz .q-variantlar-kol::after, .stage-nav .btn-white-accent::after { animation: none !important; opacity: 0 !important; }
          .fi-halqa-i, .fi-yk-j, .fi-yk-ok, .fi-yc, .fi-yc-t, .fi-nq i, .fi-sd-son, .fi-sd-q, .fi-vk, .fi-tel, .fi-elon, .fi-elon-d i, .fi-fk, .fi-fk-q, .fi-karta-kir, .fi-term-q, .fi-sol-ch, .fi-rj-fin, .fi-bashq, .fi-bash .q-bashorat, .fi-bash .q-chip, .fi-guruh-v .q-chip, .fi-ytb-yorliq, .fi-voqea-h, .fi-kursor, .fi-flash .fc-front, p.fi-fc-ipucha i, .fi-d2-l { animation: none !important; transition: none !important; }
        }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px ${fon(T.accent, 0.35)}, 0 0 0 1px ${fon(T.accent, 0.12)}; }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px ${fon(T.accent, 0.55)}; }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoomable.z-float > .zoom-btn { visibility: hidden; } /* ⛶ bo'sh joy ustida osilmasin (ZBTN, 159-qonun) */
        .flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band, F-0926-01) */
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        /* F-1004-12: ⛶ matn ustiga tushmasin. Keng ekranda tugma kontentdan tashqarida, o'ng chetda turadi;
           torroq ekranda ichkarida qoladi va o'ng ustunning birinchi yorlig'iga o'ngdan 40 px joy beriladi. */
        @media (min-width: 1200px) { .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: -42px; } .zoomable.z-float:not(.zoom-on) > .zoom-btn { visibility: visible; } }
        @media (max-width: 1199px) { .zoomable:not(.z-float):not(.zoom-on) > .split > :last-child > :is(p, h2, h3, h4, .eyebrow, .flow-label, .note-h):first-child, .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn + :is(p, h2, h3, h4, .eyebrow, .flow-label, .note-h) { padding-right: 40px; } }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); } /* skeletda tushib qolgan edi — ⛶ ishlamasdi (F-1006-271) */
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI (radio) === */
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }


        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        /* === STAGE === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px ${fon(T.accent, 0.55)}; }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px ${fon(T.accent, 0.55)}, 0 0 3px ${fon(T.accent, 0.4)}; }
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px ${fon(T.accent, 0.22)}; }
        .frame-success { background: ${T.okFon}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .head-c { text-align: center; align-items: center; } /* F-1003-04: natija ekrani — bitta o'q */
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
        .ai-line.bad { background: ${fon(T.accent, 0.16)}; box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }

        /* === YAKUN === */
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink2}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }

        /* === JSON KO'RINISHI === */

        /* === MA'LUMOT JADVALI === */

        /* === SXEMA JADVAL-KARTOCHKASI === */

        /* === BOG'LANISH TUGMASI (s10) === */

        /* === TANLASH QATORI (s13) === */

        /* === YAKUNIY SXEMA KANVAS (s15) === */

        /* === Instagram POST KARTOCHKASI === */

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
        .lp-step:hover:not(.on) { box-shadow: 0 8px 18px -7px rgba(${T.shadowBase},0.24); }
        .lp-step.on { background: ${T.okFon}; color: ${T.ok}; box-shadow: inset 0 0 0 1.5px ${T.ok}55; }
        .lp-step.on .lp-check { background: ${T.ok}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done { animation: none !important; } }
        .lp-mstats { background: ${T.accentSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

        /* === 🃏 FLASHCARDS — qolipda: QKartochka (DE-204) === */

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

        /* === 🏅 ACHIEVEMENTS — hisoblagich + to'liq-ekran bayram === */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px ${fon(T.accent, 0.4)}; }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink2}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px ${fon(T.accent, 0.18)}; } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 222px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink2}; }
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

        /* === Konfetti (yakun bayrami) === */
        .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
        .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.3); }
        @keyframes confetti-fall { 0% { transform: translateY(-24px) rotate(0deg); opacity: 0; } 8% { opacity: 1; } 55% { transform: translateY(48vh) translateX(22px) rotate(320deg); } 100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }

        /* === 🏆 PODIUM / STATISTIKA SAHIFASI === */
        .pod-stage { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px,2vw,20px); padding-top: 8px; }
        .pod-medal { font-size: clamp(26px,4vw,38px); line-height: 1; }
        .pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: ${T.ink}; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-score { font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; }
        .pod-bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, ${T.accent}, ${T.accent}BB); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); }
        .pod-1 .pod-bar { height: clamp(74px,11vw,120px); }
        .pod-2 .pod-bar { height: clamp(52px,8vw,86px); background: linear-gradient(180deg, ${T.ink2}, ${T.ink2}); }
        .pod-3 .pod-bar { height: clamp(38px,6vw,62px); background: linear-gradient(180deg, #C98A3D, #DDA55C); }
        .pod-col.me .pod-name { color: ${T.ok}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.ok}; } /* 11.16: o'quvchining O'Z natijasi YASHIL (qizil faqat xato javob uchun) */
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: ${T.okFon}; outline: 1.5px solid ${T.ok}66; }
        .pod-rank { min-width: 22px; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .pod-row-name { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-row-dots { display: flex; gap: 4px; }
        .pod-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(${T.shadowBase},0.15); }
        .pod-dot.ok { background: ${T.ok}; }
        .pod-dot.bad { background: ${T.accent}; }
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink2}; }

        /* === ⚡ CODE STRIKE — CTA neon-kapsula (arena STRUKTURASI ⚡ Jonliniki) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px; /* 192 (F-1004-57): CODE STRIKE — kapsula, platforma standarti */
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
        .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none; background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%); animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }
        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }
        /* === MENTOR STATISTIKASI (jonli test + yozma ish panellari) === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px ${fon(T.accent, 0.5)}; }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px ${fon(T.accent, 0.5)}; } 50% { box-shadow: 0 4px 18px 0 ${fon(T.accent, 0.55)}; } }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.accent}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.ok}; }
        .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
        .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
        .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
        .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .mstats-chip.okc  { background: ${T.okFon}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.ok}; }
        .mstats-chip.badc { background: ${T.accentSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.accent}; }
        .mstats-chip.waitc { background: rgba(${T.shadowBase},0.06); } .mstats-chip.waitc .mstats-chip-n, .mstats-chip.waitc .mstats-chip-t { color: ${T.ink2}; }
        .mstats-chip.ansc { background: ${fon(T.accent, 0.10)}; } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.accent}; }
        .mstats-hidden { margin: 0; font-family: 'Manrope'; font-size: 12.5px; font-style: italic; color: ${T.ink2}; }
        .mstats-bars { display: flex; flex-direction: column; gap: 8px; }
        .mstats-row { display: flex; align-items: center; gap: 10px; transition: opacity 0.4s; }
        .mstats-row.dimmed { opacity: 0.4; }
        .mstats-abc { width: 28px; height: 28px; border-radius: 9px; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); }
        .mstats-track { flex: 1; height: 16px; background: rgba(${T.shadowBase},0.07); border-radius: 99px; overflow: hidden; }
        .mstats-fill { display: block; height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1); opacity: 0.85; }
        .mstats-count { min-width: 108px; text-align: right; font-size: 12px; font-weight: 600; color: ${T.ink2}; white-space: nowrap; }
        .mstats-waitrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .mstats-wait-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .mstats-wait-chip { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.07); border-radius: 99px; padding: 3px 10px; }
        .mstats-wait-chip.more { color: ${T.ink2}; }
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink2}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px ${fon(T.accent, 0.5)}; transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px ${fon(T.accent, 0.55)}; }
        .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
        .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .rc-open-mini:hover { transform: translateY(-1px); }

        /* === 📖 QAYTA TUSHUNTIRISH (recap overlay) — proyektorga katta shrift === */
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
        .rc-flow { display: flex; align-items: center; justify-content: center; gap: clamp(6px,1.4vw,12px); flex-wrap: wrap; }
        .rc-chip { font-weight: 700; font-size: clamp(13px,2vw,18px); background: ${T.paper}; color: ${T.ink}; border-radius: 12px; padding: clamp(8px,1.4vw,13px) clamp(12px,2vw,18px); box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.2); white-space: nowrap; }
        .rc-arr { font-size: clamp(15px,2.2vw,22px); color: ${T.accent}; font-weight: 800; }
        .rc-ask { font-weight: 600; font-size: clamp(13px,1.8vw,16px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 18px; max-width: 660px; }
        .rc-nav { width: 100%; max-width: 880px; display: flex; align-items: center; gap: 14px; flex-shrink: 0; padding-top: 8px; }
        .rc-dots { flex: 1; display: flex; justify-content: center; gap: 8px; }
        .rc-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .rc-dot.fill { background: ${T.ink2}; }
        .rc-dot.cur { background: ${T.accent}; width: 26px; }
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.accent}; color: #fff; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover:not(:disabled) { background: ${T.accent}; }
        .rc-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
        .rc-btn.ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
        .rc-btn.ghost:hover:not(:disabled) { background: ${T.paper}; color: ${T.ink}; }
        .rc-btn.done { background: ${T.ok}; color: #fff; }
        .rc-btn.done:hover { background: #17603C; }
        @media (max-width: 640px) {
          .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; }
          .rc-dots { width: 100%; order: -1; }
          .rc-btn { font-size: 13px; padding: 11px 16px; }
        }

        /* === ⚡ CTA (yakun sahifasida) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }

        /* ===== ⚡ ARENA — issiq CoddyCamp muhiti ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, ${fon(T.accent, 0.14)} 0%, ${fon(T.accent, 0)} 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; }
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
        .qz-pchip.me { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border-color: transparent; box-shadow: 0 0 22px ${fon(T.accent, 0.45)}; }
        @keyframes qz-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .qz-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 26px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 14px 26px -10px ${fon(T.accent, 0.6)}, inset 0 2px 0 rgba(255,255,255,0.3); transition: transform 0.18s; }
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
        .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px); box-shadow: 0 18px 34px -12px rgba(0,0,0,0.6), 0 0 40px -2px rgba(var(--gl),0.6), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -4px 0 rgba(0,0,0,0.24), inset 0 0 0 1.5px rgba(0,0,0,0.26); }
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

        /* --- kod-atama chip (fmtCode) arena variantlari --- */
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        /* --- CodeStrike bolt FX qatlami --- */
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

        /* tap-hint affordance: bosilmagan karta "meni bos" deb pulslaydi */
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%,100% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 8px ${fon(T.accent, 0)}; } }
        .bnode.on { opacity: 1; transform: scale(1); }
        .bnode.trig.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px ${fon(T.accent, 0.3)}; }
        .bnode.sheet.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px ${fon(T.accent, 0.3)}; }
        .bnode.act.on { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 8px 18px -6px rgba(31,122,77,0.3); }
        .bflow-arrow.on { color: ${T.accent}; opacity: 1; }
        @keyframes think-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .gear-slot.on { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 6px 16px -6px rgba(31,122,77,0.26); background: ${T.okFon}; }
        .bot-status.on .bot-status-dot { background: ${T.ok}; box-shadow: 0 0 8px rgba(31,122,77,0.55); }
        @keyframes bot-status-danger { 0%,100% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 1.5px ${T.err}55; } 50% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 5px ${T.err}22; } }
        .ns-cell.filled { border-style: solid; border-color: ${T.line}; }
        .ns-cust.ok { box-shadow: inset 0 0 0 1.5px ${T.ok}; } .ns-cust.ok .ns-cust-msg { color: ${T.ok}; }
        @keyframes ns-dots-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes rz-shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .itm-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -8px ${fon(T.accent, 0.3)}; }

        /* to'g'ri terilganda — qadamlar KETMA-KET tasdiqlanadi (yuqoridan pastga to'lqin) */
        /* SNAP — bo'lak slotga tushganda "qulflandi" hissi (fill-mode YO'Q — sudrash transform'i erkin qolsin) */

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi (11.7). Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        /* 11.15 — jonli badge xira, hover'da tiniq (proyektorda xalaqit bermaydi) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* ===== 🏙️ SHAHAR KONTENT KOMPONENTLARI (arxitektura darsi) ===== */
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope'; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }
        @keyframes rev-in { from { opacity: 0; transform: translateY(-6px) scale(0.96); } to { opacity: 1; transform: none; } }
        .fl-node.done { opacity: 1; background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        .fl-node.on { opacity: 1; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 18px -4px ${fon(T.accent, 0.45)}; transform: translateY(-3px); animation: fl-pulse 1.1s infinite ease-in-out; }
        @keyframes fl-pulse { 0%,100% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 16px -6px ${fon(T.accent, 0.4)}; } 50% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 24px -2px ${fon(T.accent, 0.65)}; } }
        @keyframes fl-move { from { left: -7px; opacity: 0; } 25% { opacity: 1; } to { left: calc(100% - 6px); opacity: 1; } }
        .cm-client.on { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 5px 14px -6px rgba(31,122,77,0.26); }
        .agent-step.done { background: ${T.okFon}; }
        .agent-step.done .as-phase { color: ${T.ok}; }

        /* S21 — har og'ir animatsiyaga TINCH variant. */
        @media (prefers-reduced-motion: reduce) {
          .itm-card.tap-hint, .gchip.tap-hint, .btn-soft.tap-hint,
          .shake, .fl-node.on { animation: none !important; }
        }
        /* qaytarilgan keyframes (saralashdan keyin) */
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr(LESSON_META.lessonTitle)} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} live={live} />
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
