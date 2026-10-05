import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 9-Modul · 5-dars «Animatsiya: interfeys javob beradi» (m7-05) — skeletdan (src/skelet/NamunaDars.jsx, konveyer 04.10), MD v3: feedback/F-1005-9modul/05-Animation-v3.md.
// 20 ekran: s0 QKirish · s1 QReja · s2 s3 QTushuncha (transform, transition) · s4 1-savol · s5 QKod (HtmlCompiler) · s6 QTushuncha (rang) · s7 2-savol ·
//   s8 QKod · s9 s10 QTushuncha (Motion) · s11 3-savol · s12 QTushuncha+QQadamlar (ortiqcha harakat) · s13 4-savol · s14 QTushuncha (xatoni topish) ·
//   s15 final QTartib · a1 amaliyot bloki (QBlok + ScreenBlok, 172/173) · podium · sflash QKartochka (alohida ekran, SABOQ 12) · s19 QYakun.
// Bitta vizual — «Maydon» maketi (KATAKLAR → MaydonMaket, 163/180); RANG_YOLI — 6-ekran yorliqlari va 15-ekran finali.
// Platformada `motion` paketi yo'q (KOD 4): belgining kirish/ketishi CSS bilan taqlid, kod parchalari — repo'dagi haqiqiy Motion kodi.
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================

// D3: palitra umumiy qolipdan — neytral 5 · modul rangi 2 · holat 2 (shadowBase — soya, rang tokeni emas)
const T = { ...qolipRang('tex'), shadowBase: '58, 53, 48' };
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QKarta, QBashorat, QTaxmin, QQadamlar, QXato, QIzoh, QXulosa, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QKod, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';







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

const LESSON_META = { lessonId: 'm7-05-v1', lessonTitle: { uz: 'Animatsiya: interfeys javob beradi', ru: 'Анимация: интерфейс отвечает' } };
// 20 ekran (MD v3 05-Animation): kirish → reja → transform → transition → 1-savol → 1-element (kod) → rang → 2-savol → 2-element (kod) → Motion ×2 → 3-savol →
//   ortiqcha harakat → 4-savol → xatoni topish → final tartib → amaliyot bloki → podium → kartochkalar → yakun. «hodisa» so'zi bu darsda yo'q (T-015).
const HW_TOKENS = [
  { t: { uz: 'animatsiya', ru: 'анимация' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: 'transition', l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'katak', ru: 'ячейка' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: 'Motion', l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's12', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's14', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's19', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD ✔: s4 C · s7 A · s11 D · s13 B · s15 — final (picked 0/1 sentinel, correct maydoni haqiqiy).
// `practice: -1` — sentinel (QKod 5, 8 va blok 16 — variant yo'q).
const INLINE_KEYS = { s4: 2, s7: 0, s11: 3, s13: 1, s15: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI: 4, 7, 11, 13, 15). S-026: emoji o'rniga koddan bitta qator.
const RcKod = ({ t }) => <code className="an-rc-kod">{tr(t)}</code>;
const RECAPS = {
  4: {
    title: { uz: 'Silliq qaytish uchun transition', ru: 'transition для плавного возврата' },
    cards: [
      { ic: <RcKod t=".katak:active { transform: scale(0.95); }" />, h: { uz: ':active', ru: ':active' }, body: { uz: 'Bosib turilgan payt.', ru: 'Момент, когда элемент зажат.' } },
      { ic: <RcKod t="scale(0.95)" />, h: { uz: 'transform', ru: 'transform' }, body: { uz: 'Katakni kichraytiradi, qo\'shni kataklar joyida qoladi.', ru: 'Уменьшает ячейку, соседние остаются на месте.' } },
      { ic: <RcKod t="transition: transform 0.15s;" />, h: { uz: 'transition', ru: 'transition' }, body: { uz: 'Kichrayishga vaqt beradi.', ru: 'Даёт уменьшению время.' }, ask: { uz: 'Nega transition siz katak sakraydi?', ru: 'Почему без transition ячейка скачет?' } }
    ]
  },
  7: {
    title: { uz: 'Ikki xususiyat — vergul bilan', ru: 'Два свойства — через запятую' },
    cards: [
      { ic: <RcKod t=".katak.band { background-color: lightgray; }" />, h: { uz: 'band klassi', ru: 'Класс band' }, body: { uz: "band klassi qo'shilsa, fon kulrang bo'ladi.", ru: 'Если добавить класс band, фон станет серым.' } },
      { ic: <RcKod t="transition: transform 0.15s;" />, h: { uz: 'Faqat yozilgani', ru: 'Только записанное' }, body: { uz: 'transition faqat unda yozilgan xususiyatni silliq qiladi.', ru: 'transition делает плавным только указанное в нём свойство.' } },
      { ic: <RcKod t="transform 0.15s, background-color 0.3s" />, h: { uz: 'Vergul bilan', ru: 'Через запятую' }, body: { uz: 'Ikkinchi xususiyat vergul bilan, o\'z vaqti bilan.', ru: 'Второе свойство — через запятую, со своим временем.' }, ask: { uz: "Vergul o'rniga nuqta-vergul qo'yilsa nima bo'ladi?", ru: 'Что будет, если вместо запятой поставить точку с запятой?' } }
    ]
  },
  11: {
    title: { uz: 'exit — AnimatePresence ichida', ru: 'exit — внутри AnimatePresence' },
    cards: [
      { ic: <RcKod t="initial={{ opacity: 0, y: 8 }}" />, h: { uz: 'Kirish', ru: 'Вход' }, body: { uz: 'initial dan animate ga — belgi kiradi.', ru: 'От initial к animate — метка входит.' } },
      { ic: <RcKod t="exit={{ opacity: 0 }}" />, h: { uz: 'exit', ru: 'exit' }, body: { uz: 'Ketayotgandagi holat.', ru: 'Состояние при уходе.' } },
      { ic: <RcKod t="<AnimatePresence>" />, h: { uz: 'AnimatePresence', ru: 'AnimatePresence' }, body: { uz: 'Element olib tashlanayotganda exit ni ishlatadi.', ru: 'Включает exit, когда элемент убирают.' }, ask: { uz: 'AnimatePresence bo\'lmasa, belgi qanday ketadi?', ru: 'Как уйдёт метка без AnimatePresence?' } }
    ]
  },
  13: {
    title: { uz: 'Harakatni kamaytirgan odam', ru: 'Человек, уменьшивший движение' },
    cards: [
      { ic: <RcKod t="@media (prefers-reduced-motion: reduce)" />, h: { uz: 'Sayt biladi', ru: 'Сайт знает' }, body: { uz: 'Sayt buni prefers-reduced-motion orqali biladi.', ru: 'Сайт узнаёт это через prefers-reduced-motion.' } },
      { ic: <RcKod t=".katak:active { transform: none; }" />, h: { uz: "Kichrayish o'chadi", ru: 'Уменьшение отключается' }, body: { uz: 'Bosilgan katak endi kichraymaydi.', ru: 'Нажатая ячейка больше не уменьшается.' } },
      { ic: <RcKod t='reducedMotion="user"' />, h: { uz: 'Motion', ru: 'Motion' }, body: { uz: "Motion surilishni o'chiradi, shaffoflik qoladi.", ru: 'Motion отключает сдвиг, прозрачность остаётся.' }, ask: { uz: "Nega rang o'zgarishini o'chirmaymiz?", ru: 'Почему мы не отключаем смену цвета?' } }
    ]
  },
  15: {
    title: { uz: 'Bosishdan kulrang katakkacha', ru: 'От нажатия до серой ячейки' },
    cards: [
      { ic: <RcKod t='className="katak band"' />, h: { uz: 'Klass qo\'shiladi', ru: 'Добавляется класс' }, body: { uz: "O'yinchi bosadi, katakka band klassi qo'shiladi.", ru: 'Игрок нажимает, ячейке добавляется класс band.' } },
      { ic: <RcKod t="background-color 0.3s" />, h: { uz: 'Oraliq ranglar', ru: 'Промежуточные цвета' }, body: { uz: 'Brauzer 0.3 soniya oraliq ranglarni chizadi.', ru: 'Браузер 0.3 секунды рисует промежуточные цвета.' } },
      { ic: <RcKod t="lightgray" />, h: { uz: 'Kulrang', ru: 'Серый' }, body: { uz: "Katak kulrang bo'lib qoladi.", ru: 'Ячейка остаётся серой.' }, ask: { uz: 'transition qachon ishga tushadi?', ru: 'Когда срабатывает transition?' } }
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

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
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

// ===== DARSNING BITTA VIZUALI — «Maydon» maketi (163, 180): bitta manba KATAKLAR → MaydonMaket; RANG_YOLI — 6-ekran yorliqlari va 15-ekran finali =====
// qolip-maket: an-katak an-kalit an-switch an-top an-sarlavha an-belgi an-kq
// K1 (tayanch 5): 6 katak 16:00 … 21:00; Shanba namuna bandlari 17:00 va 20:00, 18:00 bo'sh. Rang: bo'sh — paper, band — line (7-dars bilan bir xil kulrang).
// KOD 4: platformada `motion` paketi yo'q — belgining kirish/ketishi CSS bilan taqlid qilinadi; kod parchalari esa repo'dagi haqiqiy Motion kodi.
const cx = (...a) => a.filter(Boolean).join(' ');
const KATAKLAR = [
  { soat: '16:00', oraliq: '16:00–17:00', band: false },
  { soat: '17:00', oraliq: '17:00–18:00', band: true },
  { soat: '18:00', oraliq: '18:00–19:00', band: false },
  { soat: '19:00', oraliq: '19:00–20:00', band: false },
  { soat: '20:00', oraliq: '20:00–21:00', band: true },
  { soat: '21:00', oraliq: '21:00–22:00', band: false }
];
const BOSH_BAND = KATAKLAR.filter(k => k.band).map(k => k.soat);
const oraliqOf = (s) => (KATAKLAR.find(k => k.soat === s) || {}).oraliq || s;
const RANG_YOLI = [
  { id: 'bosadi', label: { uz: "O'yinchi katakni bosadi", ru: 'Игрок нажимает на ячейку' } },
  { id: 'klass', label: { uz: "Katakka `band` klassi qo'shiladi", ru: 'Ячейке добавляется класс `band`' } },
  { id: 'oraliq', label: { uz: 'Brauzer 0.3 soniya oraliq ranglarni chizadi', ru: 'Браузер 0.3 секунды рисует промежуточные цвета' } },
  { id: 'kulrang', label: { uz: "Katak kulrang bo'lib qoladi", ru: 'Ячейка остаётся серой' } }
];
const BAND_SOZ = { uz: 'band', ru: 'занято' };
const BELGI_SOZ = { uz: 'Band qilindi', ru: 'Забронировано' };
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Tugagach xulosa ko'rinadigan joyga suriladi (asosiy seans tekshiruvi: 1280×773 da xulosa pastki panel ostida qolardi)
const useXulosaSkroll = (on, boshdan) => {
  const bosh = useRef(!!boshdan);
  useEffect(() => {
    if (!on || bosh.current) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 400);
    return () => clearTimeout(t);
  }, [on]);
};
// Kechiktirilgan ishlar — ekrandan chiqilganda hammasi tozalanadi
const useKeyin = () => {
  const tRef = useRef([]);
  useEffect(() => () => { tRef.current.forEach(clearTimeout); }, []);
  return useCallback((fn, ms) => { const id = setTimeout(fn, ms); tRef.current.push(id); return id; }, []);
};
// «Band qilindi» belgisi: chiqadi → 3 soniya turadi → so'nadi (Motion `exit`) yoki birdan yo'qoladi (`transition` bilan)
// kirish: 'past' (y: 8) · 'tepa' (y: -8) · 'joyida' (faqat shaffoflik) · 'birdan' · k — sekinlik koeffitsienti
const useBelgi = () => {
  const [belgi, setBelgi] = useState(null);
  const tRef = useRef([]);
  const tozala = useCallback(() => { tRef.current.forEach(clearTimeout); tRef.current = []; setBelgi(null); }, []);
  useEffect(() => () => { tRef.current.forEach(clearTimeout); }, []);
  const chiqar = useCallback((soat, { kirish = 'past', silliqKet = true, k = 1, turish = 3000 } = {}) => {
    tRef.current.forEach(clearTimeout); tRef.current = [];
    setBelgi({ soat, faza: 'tur', kirish, k, n: Date.now() });
    tRef.current.push(setTimeout(() => {
      if (silliqKet) { setBelgi(b => b && { ...b, faza: 'ket' }); tRef.current.push(setTimeout(() => setBelgi(null), 300 * k + 40)); }
      else setBelgi(null);
    }, turish));
  }, []);
  return { belgi, chiqar, tozala };
};
// Maket: brauzer oynasi · «Maydon» · kun yorlig'i «Shanba» (bosilmaydi) · 6 katak (2 ustun) · belgi joyi.
// Rejimlar props bilan: jim — scale 1, vaqtsiz · javob — scale .95, td .15, cd .3 · sekin — ×10, oraliq o'lchamlar xira · kam — scale 1, belgi «joyida».
// onBos(soat) — bosish boshlandi · onKatak(soat, band) — bosildi · bosilgan — tashqaridan bosib turish (o'zi o'ynash) · halqa — navbatdagi katak (SABOQ 11)
const MaydonMaket = ({ band = BOSH_BAND, faqat, jonli = true, onBos, onKatak, bosilgan, scale = 1, td = 0, tq, cd = 0, belgi, sekin = false, qoshni = false, halqa, silk, vaqt, ortiqcha, onOrtiqcha, onBelgi, ichki, katta = false, mini = false, bandRangsiz = false, belgiKatta = false }) => {
  const [bos, setBos] = useState(null);
  const [yon, setYon] = useState(0);
  const kataklar = faqat ? KATAKLAR.filter(k => faqat.includes(k.soat)) : KATAKLAR;
  const down = (s, b) => { if (!jonli || b) return; setBos(s); if (qoshni) setYon(n => n + 1); if (onBos) onBos(s); };
  const up = () => setBos(null);
  const pressed = bosilgan || bos;
  const belgiEl = belgi && (onBelgi
    ? <button type="button" key={`${belgi.n}-${silk && silk.soat === 'belgi' ? silk.k : 0}`} className={cx('an-belgi', `k-${belgi.kirish}`, belgi.faza === 'ket' && 'ket', silk && silk.soat === 'belgi' && 'an-silk')} style={{ '--bd': `${0.3 * belgi.k}s` }} onClick={onBelgi}>{tr(BELGI_SOZ)}: {belgi.soat}</button>
    : <span key={belgi.n} className={cx('an-belgi', `k-${belgi.kirish}`, belgi.faza === 'ket' && 'ket')} style={{ '--bd': `${0.3 * belgi.k}s` }}>{tr(BELGI_SOZ)}: {belgi.soat}</span>);
  return (
    <div className={cx('an-sayt', katta && 'katta', mini && 'mini')}>
      <div className="an-sayt-bar"><i /><i /><i /><span>localhost:5173</span></div>
      <div className="an-sayt-tana">
        <div className="an-bosh">
          {ortiqcha && ortiqcha.sarlavha !== 'yoq'
            ? <button type="button" className={cx('an-sarlavha', ortiqcha.sarlavha === 'on' ? 'miltilla' : 'toxta')} onClick={() => onOrtiqcha && onOrtiqcha('sarlavha')}>Maydon</button>
            : <b className="an-nom">Maydon</b>}
          {ortiqcha && ortiqcha.top !== 'yoq' && (
            <button type="button" className={cx('an-top', ortiqcha.top === 'on' ? 'aylan' : 'toxta')} onClick={() => onOrtiqcha && onOrtiqcha('top')} aria-label={tr({ uz: "To'p rasmi", ru: 'Рисунок мяча' })}>
              <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill={T.paper} stroke={T.ink} strokeWidth="2" /><path d="M20 12 L27 17 L24.5 25 L15.5 25 L13 17 Z" fill={T.ink} /><path d="M20 12 V4 M27 17 L35 14 M24.5 25 L29 32 M15.5 25 L11 32 M13 17 L5 14" stroke={T.ink} strokeWidth="1.6" /></svg>
            </button>
          )}
          <span className="an-kun">{tr({ uz: 'Shanba', ru: 'Суббота' })}</span>
        </div>
        <div className={cx('an-kataklar', faqat && faqat.length === 1 && 'yakka')} style={{ '--s': scale, '--td': `${td}s`, '--tq': `${tq ?? td}s`, '--cd': `${cd}s` }}>
          {kataklar.map(k => {
            const b = band.includes(k.soat);
            const p = pressed === k.soat;
            const sk = silk && silk.soat === k.soat;
            return (
              <div key={k.soat} className="an-kw">
                {sekin && p && scale < 1 && [0.98, 0.96, 0.95].map((g, i) => <i key={g} className="an-iz" style={{ '--g': g, animationDelay: `${0.2 + i * 0.45}s` }} />)}
                <button type="button" key={`${k.soat}-${qoshni && !p ? yon : 0}-${sk ? silk.k : 0}`}
                  className={cx('an-katak', b && !bandRangsiz && 'band', b && 'b', p && 'bos', qoshni && !p && yon > 0 && 'yon', halqa === k.soat && 'an-navbat', sk && 'an-silk', !jonli && 'jim')}
                  tabIndex={jonli ? 0 : -1} aria-disabled={b || !jonli}
                  onPointerDown={() => down(k.soat, b)} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}
                  onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') down(k.soat, b); }} onKeyUp={up}
                  onClick={() => { if (jonli && onKatak) onKatak(k.soat, b); }}>
                  <span>{k.oraliq}</span>{b && <small>{tr(BAND_SOZ)}</small>}
                </button>
                {vaqt && vaqt.soat === k.soat && <small className="an-vaqt">{vaqt.t}</small>}
              </div>
            );
          })}
        </div>
        {belgi !== undefined && <div className={cx('an-belgi-joy', belgiKatta && 'katta')}>{belgiEl}</div>}
        {ichki}
      </div>
    </div>
  );
};
// Kod parchasi (o'qish uchun): qatorlar [{ t, yon?, xira?, iz?, b?, tuz? }] — iz: yonidagi kulrang yorliq · b: bosiladigan qator (14-ekran) · holat[i]: 'err'
const KodBlok = ({ fayl, qatorlar, onQator, holat = {}, navbat = false, silk }) => (
  <div className={cx('an-kod', navbat && 'an-navbat')}>
    {fayl && <div className="an-kod-h">{fayl}</div>}
    <div className="an-kod-t" onCopy={e => e.preventDefault()}>
      {qatorlar.map((q, i) => {
        const ichi = <><span className="an-kq-t">{q.t || '\u00a0'}</span>{q.iz && <span className="an-kq-iz">{fmtCode(tr(q.iz))}</span>}</>;
        const sk = silk && silk.i === i;
        const qator = onQator && q.b
          ? <button type="button" key={`${i}-${sk ? silk.k : 0}`} className={cx('an-kq', 'bos', q.iz && 'iz', q.yon && 'yon', q.xira && 'xira', holat[i], sk && 'an-silk')} onClick={() => onQator(i)}>{ichi}</button>
          : <div key={i} className={cx('an-kq', q.iz && 'iz', q.yon && 'yon', q.xira && 'xira', holat[i])}>{ichi}</div>;
        return holat[i] === 'err' && q.tuz ? [qator, <div key={`${i}-tuz`} className="an-kq tuz"><span className="an-kq-t">{q.tuz}</span></div>] : qator;
      })}
    </div>
  </div>
);
// Ballsiz bashorat (181) — SABOQ 11: tanlangach yopilmaydi, ixcham qator bo'lib natijagacha turadi
const BASHORAT_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const TaxminIxcham = ({ savol, variantlar, taxmin }) => {
  const tx = variantlar.find(v => v.k === taxmin);
  if (!tx) return null;
  return (
    <div className="an-taxmin">
      <span className="q-yorliq">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span>
      <span className="an-taxmin-s">{savol}</span>
      <b className="an-taxmin-j">{tr(tx.t)}</b>
    </div>
  );
};
const Bashorat = ({ savol, variantlar, taxmin, onTanla, done }) => (!taxmin
  ? <div className="an-navbat-k"><QBashorat yorliq={tr(BASHORAT_YORLIQ)} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={onTanla} /></div>
  : (!done ? <TaxminIxcham savol={savol} variantlar={variantlar} taxmin={taxmin} /> : null));
const TaxminNatija = ({ variantlar, taxmin, togri, haqiqat }) => {
  const tx = variantlar.find(v => v.k === taxmin);
  if (!tx) return null;
  return (
    <QTaxmin togri={taxmin === togri}>{taxmin === togri
      ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение верно' })
      : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{fmtCode(tr(haqiqat))}</b></>}</QTaxmin>
  );
};
const NomQator = ({ children }) => <p className="an-nomqator">{children}</p>;
// «Sekin ko'rsatish» kaliti — chizilgan almashtirgich
const SekinKalit = ({ on, onClick }) => (
  <button type="button" className={cx('an-kalit', on && 'on')} onClick={onClick} aria-pressed={on}><i aria-hidden="true" />{tr({ uz: "Sekin ko'rsatish", ru: 'Показать медленно' })}</button>
);
const DAVOM = { uz: 'Davom etish', ru: 'Продолжить' };
const AVVAL_TAXMIN = { uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' };

// ===== SCREEN 0 — KIRISH (QKirish: «Maydon» jim · 18:00 bosiladi → ekran o'zgarmaydi → savol; ballsiz, J-026) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Ha, endi katak band bo'ldi", ru: 'Да, теперь ячейка занята' } },
  { id: 'b', label: { uz: "Yo'q, katak bo'sh qoldi", ru: 'Нет, ячейка осталась свободной' } },
  { id: 'c', label: { uz: "Ekrandan bilib bo'lmaydi", ru: 'По экрану не понять' } }
];
const HOOK_JAVOB = {
  a: { uz: <><b>Qiziq fikr!</b> Rost, sayt band qildi — lekin ekranda buni ko'rsatadigan hech narsa o'zgarmadi.</>, ru: <><b>Интересная мысль!</b> Правда, сайт забронировал — но на экране ничего не изменилось, что бы это показало.</> },
  b: { uz: <><b>Qiziq fikr!</b> Aslida sayt band qildi — ekran buni ko'rsatmadi, shuning uchun katak bo'sh ko'rindi.</>, ru: <><b>Интересная мысль!</b> На самом деле сайт забронировал — экран этого не показал, поэтому ячейка выглядела свободной.</> },
  c: { uz: <><b>Aynan!</b> Sayt katakni band qildi, ekran esa jim qoldi. O'yinchi yana bosadi yoki chiqib ketadi.</>, ru: <><b>Именно!</b> Сайт забронировал ячейку, а экран промолчал. Игрок нажмёт ещё раз или уйдёт.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [bosildi, setBosildi] = useState(avval);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const bos = (s) => { if (s !== '18:00' || bosildi) return; setBosildi(true); setSc(n => n + 1); };
  const pick = (v) => { if (picked !== null || !bosildi) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr(DAVOM)} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Bosganingizdan keyin <span className="italic" style={{ color: T.accent }}>katak band bo'ldimi?</span></>, ru: <>После нажатия <span className="italic" style={{ color: T.accent }}>ячейка забронирована?</span></> })}
        mentor={<Mentor>{tr({ uz: "O'tgan darsda Maydon sayti ishga tushdi, kataklar ekranda turibdi. Maketda 18:00–19:00 ni bir marta bosing.", ru: 'На прошлом уроке сайт Maydon заработал, ячейки стоят на экране. Нажмите в макете один раз 18:00–19:00.' })}</Mentor>}
        maket={<div className={cx('an-hook', bosildi && picked === null && 'tanla')}>
          <MaydonMaket band={BOSH_BAND} onKatak={bos} halqa={!bosildi ? '18:00' : null}
            ichki={picked !== null && <p className="an-ichki">{tr({ uz: 'Sayt ichida: 18:00–19:00 — band', ru: 'Внутри сайта: 18:00–19:00 — занято' })}</p>} />
        </div>}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={!bosildi}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda maket «javob beradi» rejimida bir marta o'zi o'ynaydi, o'ngda 4 qadam, pastda repo teglari) =====
const REJA = [
  { t: { uz: 'Bosilgan katak kichrayib qaytadi', ru: 'Нажатая ячейка уменьшается и возвращается' }, teg: 'transform' },
  { t: { uz: "Band katakning rangi silliq o'zgaradi", ru: 'Цвет занятой ячейки меняется плавно' }, teg: 'transition' },
  { t: { uz: "«Band qilindi» belgisi chiqib, so'nadi", ru: 'Метка «Band qilindi» появляется и гаснет' }, teg: 'Motion' },
  { t: { uz: "Uchalasi Maydon repo'sida ishlaydi", ru: 'Все три работают в репо Maydon' }, teg: 'repo' }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const keyin = useKeyin();
  const { belgi, chiqar } = useBelgi();
  const [band, setBand] = useState(BOSH_BAND);
  const [bos, setBos] = useState(null);
  useEffect(() => {
    if (kamHarakat()) { setBand([...BOSH_BAND, '18:00']); return; }
    keyin(() => setBos('18:00'), 900);
    keyin(() => { setBos(null); setBand([...BOSH_BAND, '18:00']); }, 1150);
    keyin(() => chiqar('18:00'), 1400);
  }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun Maydon'ga <span className="italic" style={{ color: T.accent }}>uchta animatsiya</span> yozasiz.</>, ru: <>Сегодня вы напишете для Maydon <span className="italic" style={{ color: T.accent }}>три анимации</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Avval har birini shu yerda sinab ko'rasiz, keyin Maydon repo'siga o'zingiz yozasiz.", ru: 'Сначала попробуете каждую здесь, потом сами напишете в репо Maydon.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<MaydonMaket band={band} jonli={false} bosilgan={bos} scale={0.95} td={0.15} cd={0.3} belgi={belgi} />}
        ongYorliq={tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: r.teg }))}
      >
        <p className="an-repo">repo <code>maydon</code> · {tr({ uz: 'boshlanish', ru: 'начало' })} <code>dars-04-done</code> · {tr({ uz: 'tayyor namuna', ru: 'готовый образец' })} <code>dars-05-done</code></p>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · transform (QTushuncha: bashorat → qiymat → bosib turish → katak kichrayadi, qo'shnilar joyida) =====
const S2_SAVOL = { uz: "Katak kichraysa, qo'shni kataklar nima bo'ladi?", ru: 'Если ячейка уменьшится, что будет с соседними?' };
const S2_TAXMIN = [
  { k: 'surildi', t: { uz: 'Ular ham suriladi', ru: 'Они тоже сдвинутся' } },
  { k: 'joyida', t: { uz: 'Joyida qoladi', ru: 'Останутся на месте' } },
  { k: 'kichraydi', t: { uz: 'Ular ham kichrayadi', ru: 'Они тоже уменьшатся' } }
];
const S2_QIYMAT = ['1', '0.95', '0.8'];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qiymat, setQiymat] = useState(avval ? '0.95' : '1');
  const [sinalgan, setSinalgan] = useState(() => new Set(avval ? S2_QIYMAT : []));
  const done = sinalgan.size >= S2_QIYMAT.length;
  const tugadi = useTugadi(done, 900, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bos = () => { if (!taxmin) return; setSinalgan(s => (s.has(qiymat) ? s : new Set([...s, qiymat]))); };
  const navbatQ = taxmin && !done && sinalgan.has(qiymat) ? S2_QIYMAT.find(v => !sinalgan.has(v)) : null;
  const kod = <KodBlok fayl="App.css" qatorlar={[{ t: '.katak:active {' }, { t: `  transform: scale(${qiymat});`, yon: true }, { t: '}' }]} />;
  const maket = <MaydonMaket jonli={!!taxmin} onBos={bos} scale={Number(qiymat)} qoshni halqa={taxmin && !done && !sinalgan.has(qiymat) ? '18:00' : null} />;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · transform', ru: 'Понятие · transform' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr(DAVOM) : !taxmin ? tr(AVVAL_TAXMIN) : tr({ uz: `3 qiymatni sinang (${sinalgan.size}/3)`, ru: `Попробуйте 3 значения (${sinalgan.size}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Bosilgan katak <span className="italic" style={{ color: T.accent }}>qanchaga kichraysin?</span></>, ru: <>Насколько <span className="italic" style={{ color: T.accent }}>уменьшить нажатую ячейку?</span></> })}
        mentor={<Mentor>{tr({ uz: "Ko'p ilovalarda tugma barmoq ostida biroz cho'kadi — odam shundan bosilganini sezadi. Qiymatni tanlang va 18:00–19:00 ni bosib turing.", ru: 'Во многих приложениях кнопка под пальцем чуть проседает — по этому человек чувствует нажатие. Выберите значение и зажмите 18:00–19:00.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN} taxmin={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={<div className="q-col">
          {kod}
          <div className="an-qiymatlar">{S2_QIYMAT.map(v => <QChip key={v} className={cx('an-chip-kod', navbatQ === v && 'an-navbat')} holat={qiymat === v ? 'on' : undefined} disabled={!taxmin} onClick={() => setQiymat(v)}>{sinalgan.has(v) && qiymat !== v ? '✓ ' : ''}{v}</QChip>)}</div>
          <QIzoh>{fmtCode(tr({ uz: '`:active` — bosib turilgan payt.', ru: '`:active` — момент, когда элемент зажат.' }))}</QIzoh>
        </div>}
        vizual={tugadi ? <div className="an-fokus">{kod}{maket}</div> : maket}
        natija={done && <>
          <NomQator>{fmtCode(tr({ uz: 'Elementni shunday kichraytirish yoki kattalashtirishni `transform` qiladi.', ru: 'Так уменьшает или увеличивает элемент `transform`.' }))}</NomQator>
          <TaxminNatija variantlar={S2_TAXMIN} taxmin={taxmin} togri="joyida" haqiqat={{ uz: 'joyida qoldi', ru: 'остались на месте' }} />
        </>}
        xulosa={done && fmtCode(tr({ uz: "`transform: scale(0.95)` katakni 95% gacha kichraytiradi, qo'shni kataklar joyida qoladi.", ru: '`transform: scale(0.95)` уменьшает ячейку до 95%, соседние ячейки остаются на месте.' }))}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — TUSHUNCHA · transition (vaqt → bosish; «Sekin ko'rsatish» ×10 va oraliq o'lchamlar; soniya hisoblagichi) =====
const S3_SAVOL = { uz: "0.15 soniya ko'zga qanday ko'rinadi?", ru: 'Как 0.15 секунды выглядят для глаза?' };
const S3_TAXMIN = [
  { k: 'sezilmaydi', t: { uz: 'Sezilmaydi', ru: 'Незаметно' } },
  { k: 'silliq', t: { uz: 'Silliq', ru: 'Плавно' } },
  { k: 'sekin', t: { uz: 'Sekin', ru: 'Медленно' } }
];
const S3_VAQT = ['0s', '0.15s', '1s'];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [vaqt, setVaqt] = useState(avval ? '0.15s' : '0s');
  const [sekin, setSekin] = useState(false);
  const [sinalgan, setSinalgan] = useState(() => new Set(avval ? S3_VAQT : []));
  const [hisob, setHisob] = useState(null);
  const rafRef = useRef(0);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  const done = sinalgan.size >= S3_VAQT.length;
  const tugadi = useTugadi(done, 900, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const dur = parseFloat(vaqt);
  const k = sekin && vaqt === '0.15s' ? 10 : 1;
  const bos = (s) => {
    if (!taxmin) return;
    setSinalgan(x => (x.has(vaqt) ? x : new Set([...x, vaqt])));
    cancelAnimationFrame(rafRef.current);
    const t0 = performance.now();
    const fmt = (v) => `${v.toFixed(dur >= 1 ? 1 : 2)} s`;
    const tick = () => { const v = Math.min(dur, (performance.now() - t0) / 1000 / k); setHisob({ soat: s, t: fmt(v) }); if (v < dur) rafRef.current = requestAnimationFrame(tick); };
    tick();
  };
  const navbatV = taxmin && !done && sinalgan.has(vaqt) ? S3_VAQT.find(v => !sinalgan.has(v)) : null;
  const kod = <KodBlok fayl="App.css" qatorlar={[{ t: '.katak {' }, { t: `  transition: transform ${vaqt};`, yon: true }, { t: '}' }, { t: '.katak:active {' }, { t: '  transform: scale(0.95);' }, { t: '}' }]} />;
  const maket = (
    <div className="an-vizual">
      <SekinKalit on={sekin} onClick={() => setSekin(v => !v)} />
      <MaydonMaket jonli={!!taxmin} onBos={bos} scale={0.95} td={dur * k} sekin={k > 1} vaqt={hisob} halqa={taxmin && !done && !sinalgan.has(vaqt) ? '18:00' : null} />
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · transition', ru: 'Понятие · transition' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr(DAVOM) : !taxmin ? tr(AVVAL_TAXMIN) : tr({ uz: `3 vaqtni sinang (${sinalgan.size}/3)`, ru: `Попробуйте 3 времени (${sinalgan.size}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Kichrayish <span className="italic" style={{ color: T.accent }}>qancha vaqt davom etsin?</span></>, ru: <>Сколько <span className="italic" style={{ color: T.accent }}>должно длиться уменьшение?</span></> })}
        mentor={<Mentor>{tr({ uz: "Hozir katak bir zumda cho'kib, bir zumda qaytadi — ko'z buni sakrash deb ko'radi. Vaqtni tanlang va katakni bosing.", ru: 'Сейчас ячейка мгновенно проседает и мгновенно возвращается — глаз видит это как скачок. Выберите время и нажмите на ячейку.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S3_SAVOL)} variantlar={S3_TAXMIN} taxmin={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={<div className="q-col">
          {kod}
          <div className="an-qiymatlar">{S3_VAQT.map(v => <QChip key={v} className={cx('an-chip-kod', navbatV === v && 'an-navbat')} holat={vaqt === v ? 'on' : undefined} disabled={!taxmin} onClick={() => { setVaqt(v); setHisob(null); }}>{sinalgan.has(v) && vaqt !== v ? '✓ ' : ''}{v}</QChip>)}</div>
          <QIzoh>{fmtCode(tr({ uz: '`s` — soniya.', ru: '`s` — секунда.' }))}</QIzoh>
        </div>}
        vizual={tugadi ? <div className="an-fokus">{kod}{maket}</div> : maket}
        natija={done && <>
          <NomQator>{fmtCode(tr({ uz: "Interfeysdagi shunday ko'rinadigan harakat — animatsiya; bu darsda biz holat o'zgarishini silliq qilamiz. CSS'da unga vaqtni `transition` beradi.", ru: 'Такое видимое движение в интерфейсе — анимация; в этом уроке мы делаем плавной смену состояния. В CSS время ей задаёт `transition`.' }))}</NomQator>
          <TaxminNatija variantlar={S3_TAXMIN} taxmin={taxmin} togri="silliq" haqiqat={{ uz: 'silliq', ru: 'плавно' }} />
        </>}
        xulosa={done && fmtCode(tr({ uz: "`transition` o'zgarishni berilgan vaqt ichida silliq bajaradi. Maydon'da kichrayish — 0.15 soniya.", ru: '`transition` выполняет изменение плавно за заданное время. В Maydon уменьшение — 0.15 секунды.' }))}
      />
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s4 = 2 — C; «To'g'ri javobni tanlang» yorlig'i yo'q, SABOQ 6) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Katak bosilganda sakrab kichrayadi. Kodga nima qo'shasiz?"
    question={tr({ uz: <h2 className="title h-ask">Katak bosilganda sakrab kichrayadi. <span className="italic" style={{ color: T.accent }}>Kodga nima qo'shasiz?</span></h2>, ru: <h2 className="title h-ask">При нажатии ячейка уменьшается скачком. <span className="italic" style={{ color: T.accent }}>Что добавите в код?</span></h2> })}
    options={[
      { uz: '`scale` ichiga kichikroq son yozaman', ru: 'Напишу в `scale` число поменьше' },
      { uz: '`transform` ni `.katak` ga ko\'chiraman', ru: 'Перенесу `transform` в `.katak`' },
      { uz: '`.katak` ga `transition` qo\'shaman', ru: 'Добавлю `transition` в `.katak`' },
      { uz: '`transform` o\'rniga `transition` yozaman', ru: 'Напишу `transition` вместо `transform`' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "`transition` kichrayishga vaqt beradi — katak silliq cho'kib qaytadi.", ru: '`transition` даёт уменьшению время — ячейка плавно проседает и возвращается.' }}
    explainWrong={{
      0: { uz: 'Son kichrayishni oshiradi, sakrash esa qoladi.', ru: 'Число усилит уменьшение, а скачок останется.' },
      1: { uz: 'Unda katak bosilmasdan ham doim kichik turadi.', ru: 'Тогда ячейка будет маленькой и без нажатия.' },
      3: { uz: "`transform` bo'lmasa, katak umuman kichraymaydi.", ru: 'Без `transform` ячейка вообще не уменьшится.' },
      default: { uz: '`transition` kichrayishga vaqt beradi.', ru: '`transition` даёт уменьшению время.' }
    }} />
);

// ===== SCREEN 5 / 8 — KOD YOZISH (QKod + HtmlCompiler, ko'p fayl; shartlar stylesheet tahlili bilan — regex emas; «Bajardim» shartlar ✓ bo'lgach) =====
// Kod nusxalanmaydi (qo'lda yoziladi). «Kompilyatorni ochish» — platforma tugmasi, nomi tegilmaydi.
const KOD_HTML_5 = `<h1>Maydon · Shanba</h1>
<div class="kataklar">
  <button class="katak">16:00–17:00</button>
  <button class="katak">18:00–19:00</button>
  <button class="katak">19:00–20:00</button>
</div>
`;
const KOD_CSS_5 = { uz: `.katak {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 14px 18px;
  /* 2) transition shu yerga */
}
/* 1) .katak:active qoidasi shu yerga */
`, ru: `.katak {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 14px 18px;
  /* 2) transition сюда */
}
/* 1) правило .katak:active сюда */
` };
// 8-ekran style.css — 5-ekrandagi saqlangan koddan (kompilyator qoralamasi); bo'lmasa namuna yechim
const KOD_CSS_NAMUNA = `.katak {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 14px 18px;
  transition: transform 0.15s;
}
.katak:active {
  transform: scale(0.95);
}
`;
const KOD_HTML_8 = `<h1>Maydon · Shanba</h1>
<div class="kataklar">
  <button class="katak">16:00–17:00</button>
  <button class="katak band">17:00–18:00</button>
  <button class="katak">18:00–19:00</button>
  <button class="katak">19:00–20:00</button>
</div>
`;
const KOD_JS_8 = `document.querySelectorAll('.katak').forEach(k => {
  k.addEventListener('click', () => k.classList.add('band'));
});
`;
const KOD_KALIT_5 = 'pm-m7d5-code';
const KOD_KALIT_8 = 'pm-m7d5-code-s8';
const saqlanganCss5 = () => { try { const v = JSON.parse(localStorage.getItem(KOD_KALIT_5) || 'null'); const c = v && v.codes && v.codes['style.css']; return typeof c === 'string' && c.trim() ? c : null; } catch { return null; } };
// CSS tahlili (HtmlCompiler ctx.cssRules — brauzer parse qilgan qoidalar)
const cssQoida = (x, sel) => (x.cssRules || []).filter(r => String(r.selector).split(',').map(s => s.trim()).includes(sel));
const scaleOk = (x) => cssQoida(x, '.katak:active').some(r => { const m = /scale\(\s*([\d.]+)\s*\)/.exec(r.props.transform || ''); const n = m ? parseFloat(m[1]) : NaN; return n >= 0.9 && n <= 0.98; });
const transitionda = (x, prop) => cssQoida(x, '.katak').some(r => String(r.props.transition || '').split(',').some(p => {
  const s = p.trim();
  return new RegExp('(^|\\s)(' + prop + '|all)(\\s|$)').test(s) && /(^|\s)\d*\.?\d+m?s(\s|$)/.test(s);
}));
const bandRangi = (x) => cssQoida(x, '.katak.band').some(r => !!String(r.props['background-color'] || '').trim());
const KOD5_VAZIFA = [
  { uz: '`.katak:active` qoidasini yozing: `transform: scale(0.95);`', ru: 'Напишите правило `.katak:active`: `transform: scale(0.95);`' },
  { uz: '`.katak` qoidasiga qo\'shing: `transition: transform 0.15s;`', ru: 'Добавьте в правило `.katak`: `transition: transform 0.15s;`' },
  { uz: "Natija oynasida katakni bosing — u silliq kichrayib qaytsin.", ru: 'Нажмите на ячейку в окне результата — пусть плавно уменьшится и вернётся.' }
];
const KOD8_VAZIFA = [
  { uz: '`.katak.band` qoidasini yozing: `background-color: lightgray;`', ru: 'Напишите правило `.katak.band`: `background-color: lightgray;`' },
  { uz: '`transition` ga vergul bilan qo\'shing: `background-color 0.3s`', ru: 'Добавьте в `transition` через запятую: `background-color 0.3s`' },
  { uz: "Bo'sh katakni bosing — rangi 0.3 soniyada kulranglashsin.", ru: 'Нажмите на свободную ячейку — пусть за 0.3 секунды станет серой.' }
];
// HtmlCompiler shart yorlig'i va maslahatini xom matn qilib chiqaradi — backtik olib tashlanadi (matn o'zi o'zgarmaydi)
const bt = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v).replace(/`/g, '')]));
const shart = (id, label, fn, hint) => ({ id, label: bt(label), check: C.custom(x => fn(x) || tr(bt(hint))) });
const KOD5_TASK = {
  eyebrow: { uz: 'Kod yozish · 1-element', ru: 'Пишем код · элемент 1' },
  title: { uz: 'style.css — bosilgan katakni kichraytiring', ru: 'style.css — уменьшите нажатую ячейку' },
  files: [
    { name: 'style.css', lang: 'css', starter: KOD_CSS_5 },
    { name: 'index.html', lang: 'html', starter: KOD_HTML_5 }
  ],
  requirements: [
    shart('active', KOD5_VAZIFA[0], x => scaleOk(x), { uz: '`.katak:active` ichida `transform: scale(0.95)` bo\'lsin.', ru: 'Пусть в `.katak:active` будет `transform: scale(0.95)`.' }),
    shart('transition', KOD5_VAZIFA[1], x => transitionda(x, 'transform'), { uz: "`.katak` dagi `transition` da `transform` va vaqt bo'lsin.", ru: 'Пусть в `transition` у `.katak` будут `transform` и время.' })
  ]
};
const kod8Task = (css) => ({
  eyebrow: { uz: 'Kod yozish · 2-element', ru: 'Пишем код · элемент 2' },
  title: { uz: 'style.css — band katak rangini silliq qiling', ru: 'style.css — сделайте цвет занятой ячейки плавным' },
  files: [
    { name: 'style.css', lang: 'css', starter: css },
    { name: 'index.html', lang: 'html', starter: KOD_HTML_8 },
    { name: 'app.js', lang: 'js', starter: KOD_JS_8 }
  ],
  requirements: [
    shart('band', KOD8_VAZIFA[0], x => bandRangi(x), { uz: "`.katak.band` ichida `background-color` bo'lsin.", ru: 'Пусть в `.katak.band` будет `background-color`.' }),
    shart('rang', KOD8_VAZIFA[1], x => transitionda(x, 'background-color'), { uz: "`transition` da `background-color` va vaqt bo'lsin.", ru: 'Пусть в `transition` будут `background-color` и время.' }),
    shart('transform', { uz: '`transform 0.15s` ham `transition` da qolsin', ru: '`transform 0.15s` тоже остаётся в `transition`' }, x => transitionda(x, 'transform'), { uz: '`transform 0.15s` ham `transition` da qolsin.', ru: 'Пусть `transform 0.15s` тоже останется в `transition`.' })
  ]
});
// Natija oynasi — o'quvchining o'z kodi haqiqiy brauzerda (iframe): katakni bosib, kichrayish va rangni o'zi ko'radi
const natijaHujjat = (codes) => `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;padding:16px;font-family:system-ui,sans-serif;color:#0E0E10}h1{font-size:18px;margin:0 0 12px}.kataklar{display:flex;flex-wrap:wrap;gap:8px}.katak{font:inherit;cursor:pointer}</style><style>${codes['style.css'] || ''}</style></head><body>${codes['index.html'] || ''}${codes['app.js'] ? `<script>${codes['app.js']}<\/script>` : ''}</body></html>`;
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — o'quvchi matni emas, qolip API nomi (1-dars QKOD_ONG naqshi; MEXANIZM-TAKLIF 10)
const QKOD_ONG = 'muh\u0061rrir';
const useKodMashq = ({ screen, storedAnswer, onAnswer, fayllar }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [open, setOpen] = useState(false);
  const [codes, setCodes] = useState(() => (storedAnswer && storedAnswer.codes) || null);
  const [otdi, setOtdi] = useState(!!(storedAnswer && storedAnswer.solved));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const [yordam, setYordam] = useState(false);
  const finish = ({ codes: c }) => { setOpen(false); if (c) setCodes(c); setOtdi(true); };
  const bajardim = () => {
    if (done || !otdi) return;
    setDone(true);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, codes, code: codes && codes['style.css'], solved: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  return { live, isMentor, open, setOpen, codes: codes || fayllar, otdi, done, yordam, setYordam, finish, bajardim };
};
const KodVazifa = ({ vazifa, otdi, done }) => (
  <ol className="an-vazifa">{vazifa.map((v, i) => { const ok = i < vazifa.length - 1 ? otdi : done; return <li key={i} className={ok ? 'ok' : undefined}><i>{ok ? '✓' : i + 1}</i><span>{fmtCode(tr(v))}</span></li>; })}</ol>
);
const KodOng = ({ m, fayl, onOch }) => (m.done
  ? <div className="an-natija-q"><span className="q-yorliq">{tr({ uz: 'Natija oynasi', ru: 'Окно результата' })}</span><iframe className="an-natija" title="natija" sandbox="allow-scripts" srcDoc={natijaHujjat(m.codes)} /></div>
  : <div className="an-kodoyna">
    <KodBlok fayl={fayl} qatorlar={String(m.codes['style.css'] || '').trimEnd().split('\n').map(t => ({ t }))} />
    <div className="an-amal"><QTugma className={!m.otdi && !m.isMentor ? 'an-navbat' : undefined} onClick={onOch}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma></div>
    {m.isMentor && <MentorPracticeStats live={m.live} screen={m.screen} />}
  </div>);
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const m = useKodMashq({ screen, storedAnswer, onAnswer, fayllar: { 'style.css': tr(KOD_CSS_5), 'index.html': KOD_HTML_5 } });
  m.screen = screen;
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · 1-element', ru: 'Пишем код · элемент 1' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!m.done && !m.isMentor} label={m.done || m.isMentor ? tr(DAVOM) : tr({ uz: 'Kodni yozing', ru: 'Напишите код' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Bosilgan katakni <span className="italic" style={{ color: T.accent }}>silliq kichraytiradigan</span> kod yozamiz.</>, ru: <>Пишем код, который <span className="italic" style={{ color: T.accent }}>плавно уменьшает</span> нажатую ячейку.</> })}
        mentor={<Mentor>{tr({ uz: "Kodni o'zingiz terib yozasiz — nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi. Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Код вы набираете сами — скопировать нельзя: учатся, когда пишут руками. Откроется окно кода — вы пишете код и видите результат здесь.' })}</Mentor>}
        vazifa={<KodVazifa vazifa={KOD5_VAZIFA} otdi={m.otdi} done={m.done} />}
        yordam={<div className="an-yordam">
          <QTugma ikkinchi onClick={() => m.setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
          {m.yordam && <QIzoh>{fmtCode(tr({ uz: "Natija o'zgarmasa, `:active` oldida bo'sh joy yo'qligini va `0.15s` da «s» harfi borligini tekshiring.", ru: 'Если результат не меняется, проверьте, что перед `:active` нет пробела и что в `0.15s` есть буква «s».' }))}</QIzoh>}
        </div>}
        bajardim={<div className="an-bajardim"><QTugma className={m.otdi && !m.done ? 'an-navbat' : undefined} disabled={!m.otdi || m.done} onClick={m.bajardim}>{tr({ uz: 'Bajardim', ru: 'Готово' })}</QTugma></div>}
        {...{ [QKOD_ONG]: <KodOng m={m} fayl="style.css" onOch={() => m.setOpen(true)} /> }}
      >
        {m.done && <QXulosa>{tr({ uz: "Katak bosilganini ko'rsatadi. Harakatga berilgan shunday kichik javob mikro-harakat deyiladi.", ru: 'Ячейка показывает, что её нажали. Такой маленький ответ на действие называется микро-движением.' })}</QXulosa>}
      </QKod>
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz) — qobiq tashqi zoomni bekor qiladi (1-dars, PmLesson25 naqshi) */}
      {m.open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD5_TASK} storageKey={KOD_KALIT_5} onContinue={m.finish} onBack={() => m.setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 6 — TUSHUNCHA · rang (birinchi band — sakraydi; tugma `, background-color 0.3s` qo'shadi; ikkinchisi — silliq; «Sekin ko'rsatish» — RANG_YOLI) =====
const S6_SAVOL = { uz: '`transition: transform 0.15s` turibdi. Rang ham silliq o\'zgaradimi?', ru: 'Стоит `transition: transform 0.15s`. Цвет тоже изменится плавно?' };
const S6_TAXMIN = [
  { k: 'silliq', t: { uz: 'Ha, silliq', ru: 'Да, плавно' } },
  { k: 'sakraydi', t: { uz: "Yo'q, sakraydi", ru: 'Нет, скачком' } }
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const keyin = useKeyin();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qoshildi, setQoshildi] = useState(avval);
  const [band, setBand] = useState(avval ? [...BOSH_BAND, '18:00', '19:00'] : BOSH_BAND);
  const [n, setN] = useState(avval ? 2 : 0);
  const [sekin, setSekin] = useState(false);
  const [yol, setYol] = useState(null);
  const [yon, setYon] = useState(false);
  const done = n >= 2;
  const tugadi = useTugadi(done, 1400, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const k = sekin ? 10 : 1;
  const qulf = n === 1 && !qoshildi;
  const katak = (s, b) => {
    if (!taxmin || b || done || qulf) return;
    const silliq = qoshildi;
    setN(x => x + 1); setYon(true); keyin(() => setYon(false), 1400);
    if (sekin) {
      setYol({ i: 0, otdi: !silliq });
      keyin(() => { setBand(bb => [...bb, s]); setYol({ i: 1, otdi: !silliq }); }, 700);
      if (silliq) { keyin(() => setYol({ i: 2, otdi: false }), 1000); keyin(() => setYol({ i: 4, otdi: false }), 700 + 3000 + 150); }
      else keyin(() => setYol({ i: 4, otdi: true }), 1300);
    } else setBand(bb => [...bb, s]);
  };
  const halqa = !taxmin || done ? null : n === 0 ? '18:00' : qoshildi ? '19:00' : null;
  const kod = <KodBlok fayl="App.css" qatorlar={[
    { t: '.katak {' },
    { t: `  transition: transform 0.15s${qoshildi ? ', background-color 0.3s' : ''};`, yon: qoshildi },
    { t: '}' },
    { t: '.katak.band {', yon },
    { t: '  background-color: lightgray;', yon },
    { t: '}' }
  ]} />;
  const maket = (
    <div className="an-vizual">
      <SekinKalit on={sekin} onClick={() => setSekin(v => !v)} />
      <MaydonMaket band={band} jonli={!!taxmin} onKatak={katak} scale={0.95} td={0.15} cd={qoshildi ? 0.3 * k : 0} halqa={halqa} />
      {sekin && <ol className="an-yol">{RANG_YOLI.map((r, i) => <li key={r.id} className={cx(yol && i < yol.i && 'otgan', yol && i === yol.i && 'joriy', yol && yol.otdi && i === 2 && yol.i > 2 && 'otdi')}><i>{i + 1}</i><span>{fmtCode(tr(r.label))}</span></li>)}</ol>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · rang', ru: 'Понятие · цвет' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr(DAVOM) : !taxmin ? tr(AVVAL_TAXMIN) : tr({ uz: `2 katakni band qiling (${n}/2)`, ru: `Забронируйте 2 ячейки (${n}/2)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Band bo'lgan katak <span className="italic" style={{ color: T.accent }}>rangi qanday o'zgaradi?</span></>, ru: <>Как <span className="italic" style={{ color: T.accent }}>меняется цвет</span> занятой ячейки?</> })}
        mentor={<Mentor>{fmtCode(tr({ uz: "Katak band bo'lsa, unga `band` klassi qo'shiladi va fon kulrang bo'ladi. `transition` ga nima qo'shishni tanlang va bo'sh katakni bosing.", ru: 'Когда ячейка занята, ей добавляется класс `band` и фон становится серым. Выберите, что добавить в `transition`, и нажмите на свободную ячейку.' }))}</Mentor>}
        bashorat={<Bashorat savol={fmtCode(tr(S6_SAVOL))} variantlar={S6_TAXMIN} taxmin={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={<div className="q-col">
          {kod}
          <QIzoh>{fmtCode(tr({ uz: '`.katak.band` — `katak` va `band` klassi ikkalasi bor element.', ru: '`.katak.band` — элемент, у которого есть оба класса: `katak` и `band`.' }))}</QIzoh>
          <div className="an-amal"><QTugma className={qulf && taxmin ? 'an-navbat' : undefined} disabled={qoshildi || n < 1} onClick={() => setQoshildi(true)}>{fmtCode(tr({ uz: "`, background-color 0.3s` ni qo'shish", ru: 'Добавить `, background-color 0.3s`' }))}</QTugma></div>
        </div>}
        vizual={tugadi ? <div className="an-fokus">{kod}{maket}</div> : maket}
        natija={done && <TaxminNatija variantlar={S6_TAXMIN} taxmin={taxmin} togri="sakraydi" haqiqat={{ uz: "sakradi — `transition` da rang yo'q edi", ru: 'скачком — в `transition` не было цвета' }} />}
        xulosa={done && fmtCode(tr({ uz: "`transition` faqat unda yozilgan xususiyatni silliq qiladi; ikkinchisi vergul bilan qo'shiladi.", ru: '`transition` делает плавным только указанное в нём свойство; второе добавляется через запятую.' }))}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — 2-SAVOL (INLINE_KEYS.s7 = 0 — A; to'rttalasi kod) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Band katak rangi sakrab o'zgaryapti. transition ga nima yozasiz?"
    question={tr({ uz: <h2 className="title h-ask">Band katak rangi sakrab o'zgaryapti. <span className="italic" style={{ color: T.accent }}><code className="qcode">transition</code> ga nima yozasiz?</span></h2>, ru: <h2 className="title h-ask">Цвет занятой ячейки меняется скачком. <span className="italic" style={{ color: T.accent }}>Что напишете в <code className="qcode">transition</code>?</span></h2> })}
    options={[
      '`transform 0.15s, background-color 0.3s`',
      '`transform 0.15s; background-color 0.3s`',
      '`transform 0.15s, background-color 3s`',
      '`transform, background-color 0.3s`'
    ]} correctIdx={0}
    explainCorrect={{ uz: "Ikki xususiyat vergul bilan yoziladi, har birining o'z vaqti bor.", ru: 'Два свойства пишутся через запятую, у каждого своё время.' }}
    explainWrong={{
      1: { uz: 'Nuqta-vergul qatorni tugatadi — rang unga kirmay qoladi.', ru: 'Точка с запятой завершает строку — цвет в неё не попадает.' },
      2: { uz: '3 soniya silliq, lekin o\'yinchi kutib qoladi.', ru: '3 секунды — плавно, но игрок будет ждать.' },
      3: { uz: '`transform` vaqtsiz qoldi — kichrayish yana sakraydi.', ru: '`transform` остался без времени — уменьшение снова скачет.' },
      default: { uz: "Ikki xususiyat vergul bilan yoziladi.", ru: 'Два свойства пишутся через запятую.' }
    }} />
);

// ===== SCREEN 8 — 2-ELEMENT (QKod + HtmlCompiler: index.html · app.js tayyor · style.css 5-ekrandagi koddan) =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const css0 = useMemo(() => saqlanganCss5() || KOD_CSS_NAMUNA, []);
  const task = useMemo(() => kod8Task(css0), [css0]);
  const m = useKodMashq({ screen, storedAnswer, onAnswer, fayllar: { 'style.css': css0, 'index.html': KOD_HTML_8, 'app.js': KOD_JS_8 } });
  m.screen = screen;
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · 2-element', ru: 'Пишем код · элемент 2' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!m.done && !m.isMentor} label={m.done || m.isMentor ? tr(DAVOM) : tr({ uz: 'Kodni yozing', ru: 'Напишите код' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Band katak rangini <span className="italic" style={{ color: T.accent }}>silliq o'zgartiradigan</span> kod yozamiz.</>, ru: <>Пишем код, который <span className="italic" style={{ color: T.accent }}>плавно меняет</span> цвет занятой ячейки.</> })}
        mentor={<Mentor>{fmtCode(tr({ uz: "Katakka `band` klassini `app.js` qo'shadi — siz faqat CSS'ni yozasiz.", ru: 'Класс `band` ячейке добавляет `app.js` — вы пишете только CSS.' }))}</Mentor>}
        vazifa={<KodVazifa vazifa={KOD8_VAZIFA} otdi={m.otdi} done={m.done} />}
        yordam={<div className="an-yordam">
          <QTugma ikkinchi onClick={() => m.setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
          {m.yordam && <QIzoh>{fmtCode(tr({ uz: "Ikki klass orasida bo'sh joy yo'q: `.katak.band`. Rang sakrasa, `transition` da vergul turganini tekshiring.", ru: 'Между двумя классами нет пробела: `.katak.band`. Если цвет скачет, проверьте запятую в `transition`.' }))}</QIzoh>}
        </div>}
        bajardim={<div className="an-bajardim"><QTugma className={m.otdi && !m.done ? 'an-navbat' : undefined} disabled={!m.otdi || m.done} onClick={m.bajardim}>{tr({ uz: 'Bajardim', ru: 'Готово' })}</QTugma></div>}
        {...{ [QKOD_ONG]: <KodOng m={m} fayl="style.css" onOch={() => m.setOpen(true)} /> }}
      >
        {m.done && <QXulosa>{tr({ uz: "Ikkinchi element tayyor: katak band bo'lganini rangi bilan ko'rsatadi.", ru: 'Второй элемент готов: ячейка показывает цветом, что она занята.' })}</QXulosa>}
      </QKod>
      {m.open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={task} storageKey={KOD_KALIT_8} onContinue={m.finish} onBack={() => m.setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 9 — TUSHUNCHA · Motion (bitta maketning ikki nusxasi: chap `transition` bilan · o'ng Motion bilan; P-057) =====
const S9_SAVOL = { uz: '`transition` bilan belgi qanday ketadi?', ru: 'Как уходит метка с `transition`?' };
const S9_TAXMIN = [
  { k: 'sondi', t: { uz: "Silliq so'nadi", ru: 'Плавно гаснет' } },
  { k: 'birdan', t: { uz: "Birdan yo'qoladi", ru: 'Исчезает сразу' } }
];
const BelgiYon = ({ tur, yorliq, faol, onKor }) => {
  const { belgi, chiqar } = useBelgi();
  const [faza, setFaza] = useState(0); // 0 — bosilmagan · 1 — chiqdi · 2 — ketdi
  useEffect(() => { if (faza === 1 && !belgi) { setFaza(2); onKor(); } }, [belgi]); // eslint-disable-line
  const motion = tur === 'motion';
  const bos = () => { if (!faol || belgi) return; setFaza(1); chiqar('18:00', motion ? { kirish: 'past', silliqKet: true } : { kirish: 'birdan', silliqKet: false }); };
  const y = motion ? { uz: 'silliq', ru: 'плавно' } : { uz: 'birdan', ru: 'сразу' };
  return (
    <div className="an-yon">
      <span className="q-yorliq">{fmtCode(tr(yorliq))}</span>
      <MaydonMaket mini faqat={['18:00']} band={belgi ? ['18:00'] : []} jonli={faol} onKatak={bos} scale={0.95} td={0.15} cd={0.3} belgi={belgi} belgiKatta halqa={faol && faza === 0 ? '18:00' : null} />
      <div className="an-yorlar">
        <span className={cx('an-yorl', faza >= 1 && 'on')}>{tr({ uz: 'chiqdi', ru: 'появилась' })}: {tr(y)}</span>
        <span className={cx('an-yorl', faza >= 2 && 'on')}>{tr({ uz: 'ketdi', ru: 'ушла' })}: {tr(y)}</span>
      </div>
    </div>
  );
};
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [kor, setKor] = useState(() => new Set(avval ? ['chap', 'ong'] : []));
  const [qayta, setQayta] = useState(0);
  const done = kor.size >= 2;
  const tugadi = useTugadi(done, 1200, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const korildi = (id) => setKor(s => (s.has(id) ? s : new Set([...s, id])));
  const vizual = (
    <div className="an-ikki">
      <BelgiYon key={`chap-${qayta}`} tur="transition" yorliq={{ uz: '`transition` bilan', ru: 'С `transition`' }} faol={!!taxmin} onKor={() => korildi('chap')} />
      <BelgiYon key={`ong-${qayta}`} tur="motion" yorliq={{ uz: 'Motion bilan', ru: 'С Motion' }} faol={!!taxmin} onKor={() => korildi('ong')} />
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Motion', ru: 'Понятие · Motion' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr(DAVOM) : !taxmin ? tr(AVVAL_TAXMIN) : tr({ uz: `Ikkala maketda bosing (${kor.size}/2)`, ru: `Нажмите в обоих макетах (${kor.size}/2)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>«Band qilindi» belgisi <span className="italic" style={{ color: T.accent }}>qanday chiqib, qanday ketadi?</span></>, ru: <>Как метка «Band qilindi» <span className="italic" style={{ color: T.accent }}>появляется и уходит?</span></> })}
        mentor={<Mentor>{tr({ uz: "Belgi oldin ekranda yo'q — React uni band qilingandan keyin chizadi va 3 soniyadan keyin olib tashlaydi. Ikkala maketda katakni bosing va kuzating.", ru: 'Сначала метки на экране нет — React рисует её после бронирования и через 3 секунды убирает. Нажмите на ячейку в обоих макетах и понаблюдайте.' })}</Mentor>}
        bashorat={<Bashorat savol={fmtCode(tr(S9_SAVOL))} variantlar={S9_TAXMIN} taxmin={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={taxmin && <div className="an-amal"><QTugma ikkinchi onClick={() => setQayta(x => x + 1)}>{tr({ uz: '↻ Qayta', ru: '↻ Заново' })}</QTugma></div>}
        vizual={vizual}
        natija={done && <>
          <NomQator>{fmtCode(tr({ uz: "O'ngdagini Motion (oldingi nomi Framer Motion) qiladi — React uchun animatsiya kutubxonasi, paketi `motion`.", ru: 'Правое делает Motion (прежнее название Framer Motion) — библиотека анимаций для React, пакет `motion`.' }))}</NomQator>
          <TaxminNatija variantlar={S9_TAXMIN} taxmin={taxmin} togri="birdan" haqiqat={{ uz: "birdan yo'qoldi", ru: 'исчезла сразу' }} />
        </>}
        xulosa={done && fmtCode(tr({ uz: "Oddiy `transition` olib tashlangan elementni ko'rsatmaydi. Bu misolda Motion kirish va ketishni osonlashtiradi.", ru: 'Обычный `transition` не показывает удалённый элемент. В этом примере Motion упрощает появление и уход.' }))}
      />
    </Stage>
  );
};

// ===== SCREEN 10 — Motion KODI (repo App.jsx parchasi P-065: `initial` qiymati · `AnimatePresence` kaliti → belgi shu bo'yicha kiradi va ketadi) =====
const S10_INITIAL = [
  { k: 'past', kod: '{ opacity: 0, y: 8 }' },
  { k: 'tepa', kod: '{ opacity: 0, y: -8 }' },
  { k: 'joyida', kod: '{ opacity: 0 }' }
];
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { belgi, chiqar } = useBelgi();
  const [ini, setIni] = useState('past');
  const [ap, setAp] = useState(true);
  const [sinalgan, setSinalgan] = useState(() => new Set(avval ? ['initial', 'ap'] : []));
  const done = sinalgan.size >= 2;
  const tugadi = useTugadi(done, 1600, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const katak = (s, b) => {
    if (b || belgi) return;
    chiqar(s, { kirish: ini, silliqKet: ap });
    setSinalgan(x => { const y = new Set(x); if (ini !== 'past') y.add('initial'); if (!ap) y.add('ap'); return y; });
  };
  const iniObj = S10_INITIAL.find(v => v.k === ini);
  const navbat = done ? null : !sinalgan.has('initial') ? (ini === 'past' ? 'ini' : 'katak') : !sinalgan.has('ap') ? (ap ? 'ap' : 'katak') : null;
  const kod = <KodBlok fayl="App.jsx" qatorlar={[
    { t: 'import { motion, AnimatePresence } from "motion/react"' },
    { t: '' },
    { t: '<AnimatePresence>', xira: !ap, iz: { uz: '`AnimatePresence` — element olib tashlanayotganda `exit` ni ishlatadi', ru: '`AnimatePresence` — включает `exit`, когда элемент убирают' } },
    { t: '  {belgi && (', iz: { uz: '`{belgi && …}` — `belgi` bo\'lsa, chiziladi', ru: '`{belgi && …}` — рисуется, если есть `belgi`' } },
    { t: '    <motion.div' },
    { t: '      key="belgi"' },
    { t: '      className="belgi"' },
    { t: `      initial={${iniObj.kod}}`, yon: true, iz: ini === 'past' ? { uz: '`initial` — chiqishdan oldingi holat · `y: 8` — 8 piksel pastda', ru: '`initial` — состояние до появления · `y: 8` — на 8 пикселей ниже' } : { uz: '`initial` — chiqishdan oldingi holat', ru: '`initial` — состояние до появления' } },
    { t: '      animate={{ opacity: 1, y: 0 }}', iz: { uz: '`animate` — kelib to\'xtaydigan holat', ru: '`animate` — состояние, где элемент останавливается' } },
    { t: '      exit={{ opacity: 0 }}', iz: { uz: '`exit` — ketayotgandagi holat', ru: '`exit` — состояние при уходе' } },
    { t: '      transition={{ duration: 0.3 }}' },
    { t: '    >' },
    { t: '      Band qilindi: {belgi}' },
    { t: '    </motion.div>' },
    { t: '  )}' },
    { t: '</AnimatePresence>', xira: !ap }
  ]} />;
  const maket = <MaydonMaket band={belgi ? [...BOSH_BAND, belgi.soat] : BOSH_BAND} onKatak={katak} scale={0.95} td={0.15} cd={0.3} belgi={belgi} belgiKatta halqa={navbat === 'katak' ? '18:00' : null} />;
  return (
    <Stage eyebrow={tr({ uz: 'Kod · Motion', ru: 'Код · Motion' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr(DAVOM) : tr({ uz: `2 narsani sinang (${sinalgan.size}/2)`, ru: `Попробуйте 2 вещи (${sinalgan.size}/2)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Belgi qayerdan va <span className="italic" style={{ color: T.accent }}>qanday kirib keladi?</span></>, ru: <>Откуда и <span className="italic" style={{ color: T.accent }}>как входит метка?</span></> })}
        mentor={<Mentor>{fmtCode(tr({ uz: "`motion.div` oddiy `div` ga o'xshaydi, lekin uch holatni biladi. Qiymatni almashtiring va katakni bosib, belgini qayta chiqaring.", ru: '`motion.div` похож на обычный `div`, но знает три состояния. Смените значение и, нажав на ячейку, снова вызовите метку.' }))}</Mentor>}
        harakat={<div className="q-col">
          <div className="an-qiymatlar"><span className="an-chip-l">initial</span>{S10_INITIAL.map(v => <QChip key={v.k} className={cx('an-chip-kod', navbat === 'ini' && v.k === 'tepa' && 'an-navbat')} holat={ini === v.k ? 'on' : undefined} onClick={() => setIni(v.k)}>{v.kod}</QChip>)}</div>
          <div className="an-qiymatlar"><QChip className={cx('an-chip-kod', navbat === 'ap' && 'an-navbat')} holat={ap ? 'on' : undefined} onClick={() => setAp(v => !v)}>{fmtCode(ap ? tr({ uz: '`AnimatePresence`: yoqilgan', ru: '`AnimatePresence`: включён' }) : tr({ uz: "`AnimatePresence`: o'chirilgan", ru: '`AnimatePresence`: выключен' }))}</QChip></div>
          {kod}
        </div>}
        vizual={tugadi ? <div className="an-fokus">{kod}{maket}</div> : maket}
        xulosa={done && fmtCode(tr({ uz: '`initial` dan `animate` ga — kirish, `exit` — ketish. Ketish ishlashi uchun `AnimatePresence` kerak.', ru: 'От `initial` к `animate` — вход, `exit` — уход. Чтобы уход работал, нужен `AnimatePresence`.' }))}
      />
    </Stage>
  );
};

// ===== SCREEN 11 — 3-SAVOL (INLINE_KEYS.s11 = 3 — D; to'rttalasi bir shaklda, §147) =====
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="Kodda exit bor, lekin belgi birdan yo'qoladi. Sabab nima?"
    question={tr({ uz: <h2 className="title h-ask">Kodda <code className="qcode">exit</code> bor, lekin belgi birdan yo'qoladi. <span className="italic" style={{ color: T.accent }}>Sabab nima?</span></h2>, ru: <h2 className="title h-ask">В коде есть <code className="qcode">exit</code>, но метка исчезает сразу. <span className="italic" style={{ color: T.accent }}>В чём причина?</span></h2> })}
    options={[
      { uz: "`initial` qatorida `opacity` yo'q", ru: 'В строке `initial` нет `opacity`' },
      { uz: "`animate` qatorida `y: 0` yo'q", ru: 'В строке `animate` нет `y: 0`' },
      { uz: '`exit` qatorida vaqt yozilmagan', ru: 'В строке `exit` не указано время' },
      { uz: "`<AnimatePresence>` qatori yo'q", ru: 'Нет строки `<AnimatePresence>`' }
    ]} correctIdx={3}
    explainCorrect={{ uz: '`exit` faqat `AnimatePresence` ichida ishlaydi — u element olib tashlanayotganda ketish animatsiyasini ishlatadi.', ru: '`exit` работает только внутри `AnimatePresence` — он включает анимацию ухода, когда элемент убирают.' }}
    explainWrong={{
      0: { uz: '`initial` kirishni boshqaradi, ketishni emas.', ru: '`initial` управляет входом, а не уходом.' },
      1: { uz: "`animate` — to'xtash holati, ketishga tegmaydi.", ru: '`animate` — состояние остановки, уход не затрагивает.' },
      2: { uz: "Vaqt yozilmasa ham Motion o'z vaqtini oladi.", ru: 'Даже без времени Motion берёт своё время.' },
      default: { uz: '`exit` faqat `AnimatePresence` ichida ishlaydi.', ru: '`exit` работает только внутри `AnimatePresence`.' }
    }} />
);

// ===== SCREEN 12 — ORTIQCHA HARAKAT (QTushuncha + QQadamlar, 2 qadam 163.8: ortiqchasini o'chirish → harakatni kamaytirish kaliti) =====
const S12_QADAM = [{ uz: "Ortiqchasini o'chiring", ru: 'Отключите лишнее' }, { uz: 'Harakatni kamaytiring', ru: 'Уменьшите движение' }];
const S12_AYLANA = ['16:00', '18:00', '19:00', '21:00'];
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const keyin = useKeyin();
  const { belgi, chiqar, tozala } = useBelgi();
  const [ort, setOrt] = useState(() => (avval ? { top: 'yoq', sarlavha: 'yoq' } : { top: 'on', sarlavha: 'on' }));
  const [qadam, setQadam] = useState(avval ? 2 : 0);
  const [kam, setKam] = useState(avval);
  const [silk, setSilk] = useState(null);
  const [xato, setXato] = useState(false);
  const [band, setBand] = useState(BOSH_BAND);
  const [bos, setBos] = useState(null);
  const ortN = ['top', 'sarlavha'].filter(id => ort[id] !== 'on').length;
  const done = qadam >= 2;
  const tugadi = useTugadi(done, 1500, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  // 1-qadam: uch foydali harakat o'zi aylanib turadi (jonli sayt) — o'quvchi ortiqchasini topadi; kam harakat rejimida aylanmaydi
  useEffect(() => {
    if (qadam !== 0 || kamHarakat()) return undefined;
    let i = 0; const ids = [];
    const aylana = () => {
      const s = S12_AYLANA[i++ % S12_AYLANA.length];
      setBos(s);
      ids.push(setTimeout(() => { setBos(null); setBand([...BOSH_BAND, s]); chiqar(s, { turish: 1500 }); }, 240));
      ids.push(setTimeout(() => setBand(BOSH_BAND), 2600));
      ids.push(setTimeout(aylana, 3300));
    };
    ids.push(setTimeout(aylana, 700));
    return () => ids.forEach(clearTimeout);
  }, [qadam]); // eslint-disable-line
  const ortiqchaBos = (id) => {
    if (qadam !== 0 || ort[id] !== 'on') return;
    const yangi = { ...ort, [id]: 'off' };
    setOrt(yangi); setXato(false);
    if (['top', 'sarlavha'].every(x => yangi[x] !== 'on')) keyin(() => { setOrt({ top: 'yoq', sarlavha: 'yoq' }); setQadam(1); tozala(); setBos(null); setBand(BOSH_BAND); }, 1000);
  };
  const foydali = (soat) => { if (qadam !== 0) return; setSilk({ soat, k: Date.now() }); setXato(true); };
  const kalit = () => {
    if (qadam !== 1 || kam) return;
    setKam(true);
    keyin(() => setBos('18:00'), 500);
    keyin(() => { setBos(null); setBand([...BOSH_BAND, '18:00']); chiqar('18:00', { kirish: 'joyida' }); }, 760);
    keyin(() => setQadam(2), 1700);
  };
  const katak = (s, b) => {
    if (qadam === 0) { foydali(s); return; }
    if (b || belgi) return;
    setBand(bb => [...bb, s]); chiqar(s, { kirish: kam ? 'joyida' : 'past' });
  };
  const kod = <KodBlok fayl="App.css · App.jsx" qatorlar={[
    { t: '@media (prefers-reduced-motion: reduce) {', yon: kam, xira: !kam },
    { t: '  .katak:active { transform: none; }', yon: kam, xira: !kam },
    { t: '}', xira: !kam },
    { t: '<MotionConfig reducedMotion="user">', yon: kam, xira: !kam }
  ]} />;
  const maket = (
    <div className="an-vizual">
      {qadam === 0 && <span className="an-hisob">{tr({ uz: 'Ortiqcha harakat', ru: 'Лишнее движение' })}: <b>{ortN}/2</b></span>}
      <MaydonMaket band={band} bosilgan={bos} onKatak={katak} scale={kam ? 1 : 0.95} td={0.15} cd={0.3} belgi={belgi} silk={silk}
        ortiqcha={ort} onOrtiqcha={ortiqchaBos} onBelgi={qadam === 0 ? () => foydali('belgi') : undefined} />
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ortiqcha harakat', ru: 'Понятие · лишнее движение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr(DAVOM) : tr({ uz: `2 qadamni bajaring (${Math.min(qadam, 2)}/2)`, ru: `Выполните 2 шага (${Math.min(qadam, 2)}/2)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Qaysi harakat o'yinchiga <span className="italic" style={{ color: T.accent }}>hech narsa demaydi?</span></>, ru: <>Какое движение <span className="italic" style={{ color: T.accent }}>ничего не говорит игроку?</span></> })}
        mentor={<Mentor>{tr({ uz: "Harakat «bosildi», «o'zgardi» yoki «tayyor» deb javob bermasa — u ortiqcha. Shundaylarini bosib o'chiring.", ru: 'Если движение не отвечает «нажато», «изменилось» или «готово» — оно лишнее. Нажмите на такие и отключите их.' })}</Mentor>}
        harakat={<div className="q-col">
          <QQadamlar qadamlar={S12_QADAM.map(q => tr(q))} joriy={done ? undefined : qadam} />
          {qadam === 0 && xato && <QXato>{tr({ uz: "Bu harakat o'yinchiga javob beradi — qoldiring.", ru: 'Это движение отвечает игроку — оставьте его.' })}</QXato>}
          {qadam >= 1 && !done && <QKarta className="an-qadam-k">
            <p className="an-qadam-t">{tr({ uz: "Ba'zi odamlarga ko'p harakat noqulay — boshi aylanishi mumkin; ular qurilmada harakatni kamaytiradi. Kalitni yoqing.", ru: 'Некоторым людям много движения неудобно — может кружиться голова; они уменьшают движение на устройстве. Включите переключатель.' })}</p>
            <button type="button" className={cx('an-switch', kam && 'on', !kam && 'an-navbat')} onClick={kalit} aria-pressed={kam}><i aria-hidden="true" /><span>{tr({ uz: 'Harakatni kamaytirish', ru: 'Уменьшить движение' })}</span></button>
            {kod}
          </QKarta>}
        </div>}
        vizual={tugadi ? <div className="an-fokus">{kod}{maket}</div> : maket}
        natija={done && <NomQator>{fmtCode(tr({ uz: 'Qurilmada harakat kamaytirilganini sayt `prefers-reduced-motion` orqali biladi.', ru: 'Что на устройстве уменьшено движение, сайт узнаёт через `prefers-reduced-motion`.' }))}</NomQator>}
        xulosa={done && tr({ uz: "O'yinchiga javob beradigan harakat qoladi. Harakatni kamaytirgan odamda rang va shaffoflik qoladi.", ru: 'Остаётся движение, которое отвечает игроку. У того, кто уменьшил движение, остаются цвет и прозрачность.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 13 — 4-SAVOL (INLINE_KEYS.s13 = 1 — B; javob shu kodga tegishli, audit 5) =====
const Screen13 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="Harakat kamaytirilsa, bizning Maydon kodimizda nima ishlaydi?"
    question={tr({ uz: <h2 className="title h-ask">Harakat kamaytirilsa, bizning Maydon kodimizda <span className="italic" style={{ color: T.accent }}>nima ishlaydi?</span></h2>, ru: <h2 className="title h-ask">Если движение уменьшено, <span className="italic" style={{ color: T.accent }}>что работает</span> в нашем коде Maydon?</h2> })}
    options={[
      { uz: 'Hamma animatsiya avvalgidek ishlaydi', ru: 'Вся анимация работает как прежде' },
      { uz: "Faqat rang va shaffoflik o'zgaradi", ru: 'Меняются только цвет и прозрачность' },
      { uz: "Hech qanday o'zgarish ko'rinmaydi", ru: 'Никаких изменений не видно' },
      { uz: 'Faqat katakning kichrayishi ishlaydi', ru: 'Работает только уменьшение ячейки' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Bu darsdagi kodda kichrayish va surilish o'chadi, rang va shaffoflik esa qoladi.", ru: 'В коде этого урока уменьшение и сдвиг отключаются, а цвет и прозрачность остаются.' }}
    explainWrong={{
      0: { uz: "Sozlama yoqilgan — kichrayish va surilish o'chadi.", ru: 'Настройка включена — уменьшение и сдвиг отключаются.' },
      2: { uz: "Hammasi o'chsa, o'yinchi yana bosilganini bilmaydi.", ru: 'Если отключить всё, игрок снова не узнает о нажатии.' },
      3: { uz: "Kichrayish — aynan o'chadigan harakat.", ru: 'Уменьшение — как раз то движение, что отключается.' },
      default: { uz: 'Rang va shaffoflik qoladi.', ru: 'Цвет и прозрачность остаются.' }
    }} />
);

// ===== SCREEN 14 — XATONI TOPISH (QTushuncha + QQadamlar, 3 qadam: kod qatorini bosish → to'g'ri qator qizil, tuzatilgani yashil → «Qayta sinash») =====
const S14_QADAM = [{ uz: 'Kichrayish sakraydi', ru: 'Уменьшение скачет' }, { uz: 'Qaytish sakraydi', ru: 'Возврат скачет' }, { uz: "Rang o'zgarmaydi", ru: 'Цвет не меняется' }];
const S14_KOD = [
  { qatorlar: ['.katak {', '  transition: transform 0.15;', '}', '.katak:active {', '  transform: scale(0.95);', '}'], xato: 1, tuz: '  transition: transform 0.15s;', izoh: { uz: "Bu qator to'g'ri. Vaqt qanday yozilgan?", ru: 'Эта строка верна. Как записано время?' } },
  { qatorlar: ['.katak {', '  background-color: white;', '}', '.katak:active {', '  transform: scale(0.95);', '  transition: transform 0.15s;', '}'], xato: 5, tuz: '.katak { transition: transform 0.15s; }', izoh: { uz: "Bu qator to'g'ri. Qo'yib yuborilganda qaysi qoida qoladi?", ru: 'Эта строка верна. Какое правило остаётся, когда отпускают?' } },
  { qatorlar: ['.katak {', '  transition: transform 0.15s, background-color 0.3s;', '}', '.katak .band {', '  background-color: lightgray;', '}'], xato: 3, tuz: '.katak.band {', izoh: { uz: "Bu qator to'g'ri. Selektorni harfma-harf o'qing.", ru: 'Эта строка верна. Прочитайте селектор по буквам.' } }
];
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const keyin = useKeyin();
  const [qadam, setQadam] = useState(avval ? 3 : 0);
  const [topildi, setTopildi] = useState(false);
  const [tuzatildi, setTuzatildi] = useState(avval);
  const [silk, setSilk] = useState(null);
  const [xato, setXato] = useState(null);
  const [band, setBand] = useState(BOSH_BAND);
  const [bos, setBos] = useState(null);
  const [sinyapti, setSinyapti] = useState(false);
  const done = qadam >= 3;
  const tugadi = useTugadi(done, 1200, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const q = S14_KOD[Math.min(qadam, 2)];
  const tuz = tuzatildi || done;
  const qator = (i) => {
    if (done || topildi) return;
    if (i === q.xato) { setTopildi(true); setXato(null); }
    else { setSilk({ i, k: Date.now() }); setXato(q.izoh); }
  };
  const qaytaSina = () => {
    if (!topildi || sinyapti) return;
    setTuzatildi(true); setSinyapti(true);
    if (qadam < 2) { keyin(() => setBos('18:00'), 250); keyin(() => setBos(null), 900); }
    else keyin(() => setBand(bb => [...bb, '18:00']), 250);
    keyin(() => { setQadam(x => x + 1); setTopildi(false); setSinyapti(false); setBand(BOSH_BAND); if (qadam < 2) setTuzatildi(false); }, 1900);
  };
  const td = qadam === 0 ? (tuz ? 0.15 : 0) : 0.15;
  const tq = qadam === 0 ? td : qadam === 1 ? (tuz ? 0.15 : 0) : 0.15;
  const holat = topildi ? { [q.xato]: 'err' } : {};
  const kod = <KodBlok fayl="App.css" qatorlar={q.qatorlar.map((t, i) => ({ t, b: t.trim() !== '}', tuz: i === q.xato ? q.tuz : undefined }))} onQator={done ? undefined : qator} holat={done ? {} : holat} silk={silk} navbat={!done && !topildi} />;
  const maket = <MaydonMaket band={band} bosilgan={bos} onKatak={(s, b) => { if (qadam === 2 && !b) setBand(bb => [...bb, s]); }} scale={0.95} td={td} tq={tq} cd={0.3} bandRangsiz={qadam === 2 && !tuz} />;
  return (
    <Stage eyebrow={tr({ uz: 'Xatoni topish', ru: 'Найдите ошибку' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr(DAVOM) : tr({ uz: `3 xatoni toping (${qadam}/3)`, ru: `Найдите 3 ошибки (${qadam}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Kod yozildi, lekin katak sakrayapti. <span className="italic" style={{ color: T.accent }}>Xato qayerda?</span></>, ru: <>Код написан, но ячейка скачет. <span className="italic" style={{ color: T.accent }}>Где ошибка?</span></> })}
        mentor={<Mentor>{tr({ uz: "Ko'pincha xato bitta harfda yoki bo'sh joyda bo'ladi. Natijaga qarang va xato qatorni bosing.", ru: 'Чаще всего ошибка в одной букве или пробеле. Посмотрите на результат и нажмите на строку с ошибкой.' })}</Mentor>}
        harakat={<div className="q-col">
          <QQadamlar qadamlar={S14_QADAM.map(x => tr(x))} joriy={done ? undefined : qadam} />
          {kod}
          {xato && !topildi && <QXato>{tr(xato)}</QXato>}
          {topildi && <div className="an-amal"><QTugma className={sinyapti ? undefined : 'an-navbat'} disabled={sinyapti} onClick={qaytaSina}>{tr({ uz: 'Qayta sinash', ru: 'Проверить снова' })}</QTugma></div>}
        </div>}
        vizual={tugadi ? <div className="an-fokus">{kod}{maket}</div> : maket}
        xulosa={done && fmtCode(tr({ uz: "Kichik xato butun harakatni buzadi: vaqt «s» bilan, `transition` — `.katak` da, klasslar orasida bo'sh joy yo'q.", ru: 'Маленькая ошибка ломает всё движение: время — с «s», `transition` — в `.katak`, между классами нет пробела.' }))}
      />
    </Stage>
  );
};

// ===== SCREEN 15 — FINAL (QTartib: RANG_YOLI — 6-ekran bilan bitta manba; uya izohi «bu yerga qo'ying»; ball — birinchi to'liq urinish, sentinel 0) =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const wrongEverRef = useRef(false);
  const onWrong = () => { wrongEverRef.current = true; if (achMiss) achMiss.miss(screen); };
  const firedRef = useRef(!!storedAnswer);
  const [done, setDone] = useState(!!storedAnswer);
  const [recapOpen, setRecapOpen] = useState(false);
  const solve = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setDone(true);
    const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Bosishdan kulrang katakkacha nima bo'ladi?", options: RANG_YOLI.map(z => ou(z.label)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · tartib', ru: 'Итог · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr(DAVOM) : tr({ uz: "Avval tartibni yig'ing", ru: 'Сначала соберите порядок' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bosishdan kulrang katakkacha <span className="italic" style={{ color: T.accent }}>nima bo'ladi?</span></>, ru: <>Что происходит <span className="italic" style={{ color: T.accent }}>от нажатия до серой ячейки?</span></> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni sodir bo'lish tartibida joylang.", ru: 'Разложите части в том порядке, в каком они происходят.' })}</Mentor>
        <Zoomable>
          <QTartib onWrong={onWrong}
            items={RANG_YOLI.map(z => ({ id: z.id, label: fmtCode(tr(z.label)) }))}
            joyMatn={tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}
            onSolved={solve}
            xatoMatn={tr({ uz: "Tartib xato — bo'lakni bosib qaytaring.", ru: 'Порядок неверный — нажмите на часть, чтобы вернуть её.' })}
          />
        </Zoomable>
        {done && <QXulosa>{fmtCode(tr({ uz: "Bosish klassni o'zgartiradi, `transition` esa eski va yangi rang orasini 0.3 soniyada to'ldiradi.", ru: 'Нажатие меняет класс, а `transition` заполняет промежуток между старым и новым цветом за 0.3 секунды.' }))}
          {wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </QXulosa>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 NISHONLAR (5) — inglizcha nom, medal o'yin qatlamida; Live Maydon — bonus (152), birinchi urinish sharti yo'q =====
const ACHIEVEMENTS = {
  smoothPress: { icon: '👆', name: 'Smooth Press', desc: { uz: 'Katak silliq qaytishi uchun nima kerakligini topdingiz', ru: 'Вы нашли, что нужно, чтобы ячейка плавно возвращалась' } },
  twoTransitions: { icon: '🎨', name: 'Two Transitions', desc: { uz: 'Ikki xususiyatni bitta transition ga yozdingiz', ru: 'Вы записали два свойства в один transition' } },
  exitReady: { icon: '🚪', name: 'Exit Ready', desc: { uz: 'exit ishlashi uchun nima kerakligini topdingiz', ru: 'Вы нашли, что нужно для работы exit' } },
  calmMotion: { icon: '🌙', name: 'Calm Motion', desc: { uz: 'Harakatni kamaytirgan odamga nima qolishini bildingiz', ru: 'Вы узнали, что остаётся тому, кто уменьшил движение' } },
  liveMaydon: { icon: '⚽', name: 'Live Maydon', desc: { uz: 'Amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили блок практики до конца' } }
};
// Ekran id → nishon: 4 test (birinchi urinish) + blok oxirgi «Bajardim» (bonus)
const ACH_TRIGGERS = { s4: 'smoothPress', s7: 'twoTransitions', s11: 'exitReady', s13: 'calmMotion', a1: 'liveMaydon' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 7, 11, 13, 15 — q22)
const Q_LABELS = {
  4: { uz: '1 — Silliq qaytish', ru: '1 — Плавный возврат' },
  7: { uz: '2 — Ikki xususiyat', ru: '2 — Два свойства' },
  11: { uz: '3 — Belgining ketishi', ru: '3 — Уход метки' },
  13: { uz: '4 — Kamaytirilgan harakat', ru: '4 — Уменьшенное движение' },
  15: { uz: '5 — Rang yo\'li', ru: '5 — Путь цвета' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning kod so'zlari (R-008: kod-belgi ru'da ham o'sha); Frontend/Backend va emoji yo'q
const QZ_BG_SHAPES = [
  { ch: 'transition', l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: 'scale(0.95)', l: 82, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: ':active', l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'exit', l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: 'motion.div', l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: '0.15s', l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: 'AnimatePresence', l: 24, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'Maydon', l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: 'transform', l: 56, t: 52, s: 22, d: 22, dl: 3.3 },
  { ch: '.katak.band', l: 88, t: 42, s: 20, d: 24, dl: 0.6 }
];
// ⚡ Jonli viktorina — 12 savol, ✔ o'rni A·B·C·D ×3 (aylanma, MD), ekran savollarining nusxasi emas (§144)
const QUIZ_BANK = [
  { q: { uz: 'Animatsiya o\'yinchiga nimani aytadi?', ru: 'Что анимация говорит игроку?' }, opts: [{ uz: '«Bosildi», «o\'zgardi» yoki «tayyor»', ru: '«Нажато», «изменилось» или «готово»' }, { uz: 'Saytda hozir nechta odam borligini', ru: 'Сколько людей сейчас на сайте' }, { uz: 'Sahifa qancha vaqtdan beri ochiqligini', ru: 'Сколько времени открыта страница' }, { uz: 'Katak qaysi rangda chiroyli turishini', ru: 'В каком цвете ячейка красивее' }], correct: 0 },
  { q: { uz: 'transform: scale(1.1) nima qiladi?', ru: 'Что делает transform: scale(1.1)?' }, opts: [{ uz: 'Elementni 10% ga kichraytiradi', ru: 'Уменьшает элемент на 10%' }, { uz: 'Elementni 10% ga kattalashtiradi', ru: 'Увеличивает элемент на 10%' }, { uz: 'Elementni 10 piksel o\'ngga suradi', ru: 'Сдвигает элемент на 10 пикселей вправо' }, { uz: 'Element rangini 10% ochroq qiladi', ru: 'Делает цвет элемента светлее на 10%' }], correct: 1 },
  { q: { uz: 'Tugma scale(0.9) bilan kichraydi. Ostidagi matn nima bo\'ladi?', ru: 'Кнопка уменьшается через scale(0.9). Что будет с текстом под ней?' }, opts: [{ uz: 'Tepaga ko\'tariladi', ru: 'Поднимется вверх' }, { uz: 'Pastga tushadi', ru: 'Опустится вниз' }, { uz: 'Joyida qoladi', ru: 'Останется на месте' }, { uz: 'U ham kichrayadi', ru: 'Тоже уменьшится' }], correct: 2 },
  { q: { uz: 'transition: transform 0.15s dagi 0.15s nimani bildiradi?', ru: 'Что значит 0.15s в transition: transform 0.15s?' }, opts: [{ uz: 'Katak necha marta kichrayishini', ru: 'Сколько раз уменьшится ячейка' }, { uz: 'Katak qancha kichrayishini', ru: 'Насколько уменьшится ячейка' }, { uz: 'Katak qachon bosilishini', ru: 'Когда нажмут на ячейку' }, { uz: 'O\'zgarish qancha davom etishini', ru: 'Сколько длится изменение' }], correct: 3 },
  { q: { uz: 'Bir transition da ikki xususiyat qanday ajratiladi?', ru: 'Как разделяют два свойства в одном transition?' }, opts: [{ uz: 'Vergul bilan', ru: 'Запятой' }, { uz: 'Nuqta-vergul bilan', ru: 'Точкой с запятой' }, { uz: 'Bo\'sh joy bilan', ru: 'Пробелом' }, { uz: 'Ikki nuqta bilan', ru: 'Двоеточием' }], correct: 0 },
  { q: { uz: '.katak.band selektori qaysi elementni topadi?', ru: 'Какой элемент находит селектор .katak.band?' }, opts: [{ uz: 'katak ichidagi band ni', ru: 'band внутри katak' }, { uz: 'Ikkala klassi bor elementni', ru: 'Элемент с обоими классами' }, { uz: 'Faqat band klassli har elementni', ru: 'Любой элемент только с классом band' }, { uz: 'Hamma katak klassli elementni', ru: 'Все элементы с классом katak' }], correct: 1 },
  { q: { uz: 'Tugma bosib turilgan payt CSS\'da qanday yoziladi?', ru: 'Как в CSS записать момент, когда кнопку зажали?' }, opts: [{ uz: '.tugma:hover', ru: '.tugma:hover' }, { uz: '.tugma.band', ru: '.tugma.band' }, { uz: '.tugma:active', ru: '.tugma:active' }, { uz: '.tugma .active', ru: '.tugma .active' }], correct: 2 },
  { q: { uz: 'Motion\'ni loyihaga qaysi buyruq qo\'shadi?', ru: 'Какая команда добавляет Motion в проект?' }, opts: [{ uz: 'npm run motion', ru: 'npm run motion' }, { uz: 'npm motion install', ru: 'npm motion install' }, { uz: 'npx motion', ru: 'npx motion' }, { uz: 'npm install motion', ru: 'npm install motion' }], correct: 3 },
  { q: { uz: 'motion.div dagi initial nimani bildiradi?', ru: 'Что означает initial в motion.div?' }, opts: [{ uz: 'Element chiqishidan oldingi holat', ru: 'Состояние до появления элемента' }, { uz: 'Element to\'xtaydigan oxirgi holat', ru: 'Последнее состояние, где элемент остановится' }, { uz: 'Element ketayotgandagi holat', ru: 'Состояние при уходе элемента' }, { uz: 'Element bosilgan paytdagi holat', ru: 'Состояние при нажатии на элемент' }], correct: 0 },
  { q: { uz: 'Ro\'yxatdan qator o\'chirilsa, u silliq ketishi uchun nima kerak?', ru: 'Что нужно, чтобы удалённая строка списка ушла плавно?' }, opts: [{ uz: 'initial da opacity: 0', ru: 'opacity: 0 в initial' }, { uz: 'AnimatePresence va exit', ru: 'AnimatePresence и exit' }, { uz: 'animate da y: 0', ru: 'y: 0 в animate' }, { uz: 'CSS\'dagi transition qatori', ru: 'Строка transition в CSS' }], correct: 1 },
  { q: { uz: 'Do\'kon saytida qaysi harakat ortiqcha?', ru: 'Какое движение на сайте магазина лишнее?' }, opts: [{ uz: 'Savatga qo\'shilganda son o\'zgarishi', ru: 'Смена числа при добавлении в корзину' }, { uz: 'Bosilgan tugma kichrayib qaytishi', ru: 'Нажатая кнопка уменьшается и возвращается' }, { uz: 'Doim miltillaydigan «Aksiya» yozuvi', ru: 'Постоянно мигающая надпись «Акция»' }, { uz: '«Buyurtma qabul qilindi» chiqishi', ru: 'Появление «Заказ принят»' }], correct: 2 },
  { q: { uz: 'prefers-reduced-motion nimani bildiradi?', ru: 'Что означает prefers-reduced-motion?' }, opts: [{ uz: 'Internet sekin ishlayotganini', ru: 'Что интернет работает медленно' }, { uz: 'Telefon quvvati kam qolganini', ru: 'Что у телефона мало заряда' }, { uz: 'Ekran yorqinligi pasaytirilganini', ru: 'Что яркость экрана снижена' }, { uz: 'Odam harakatni kamaytirganini', ru: 'Что человек уменьшил движение' }], correct: 3 }
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
    // Arena tokenlari — SHU darsning mavzusidan (animatsiya): dekorativ suzuvchi kod-bo'laklari
    const TOK = ['transition', 'transform', 'scale(0.95)', ':active', 'motion.div', 'exit', 'AnimatePresence', '0.15s', 'Maydon', 'initial'];
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok — ScreenBlok'ga ma'lumot: steps [{ h, t, prompt?: [satr], kimga?, err? }] · natija (kutilgan natija maketi) · ortda (M-q7/q8 buyruqlari).
// «Ortda qoldingizmi»: birinchi blokda dars-…-start, keyingilarida dars-…-done. Signal 500+ zonasida — faqat mentor ko'radi (MentorPracticeStats).
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda = [], doneText }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const bajardim = () => {
    if (isMentorLive || done) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(title), solved: true, correct: true, picked: true });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({ h: tr(c.h), t: fmtCode(tr(c.t)), prompt: c.prompt && c.prompt.map(l => tr(l)), kimga: c.prompt && tr(c.kimga || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }), xato: c.err && fmtCode(tr(c.err)) }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortda}
        pastki={<MentorPracticeStats live={_live} screen={screen} />} />
    </Stage>
  );
}
// ===== SCREEN 16 — AMALIYOT BLOKI (QBlok + ScreenBlok, 172/173 · ≈25 daq): bosish mantiqi — Antigravity, animatsiya — qo'lda (qaror 3, 4), 5-qadam — o'z g'oyangizga (qaror 8) =====
// 3- va 4-qadamda nusxa tugmasi yo'q (qo'lda yoziladi). O'ngda — «Maydon» maketining kattasi (kutilgan natija).
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot · Maydon repo'si", ru: 'Практика · репо Maydon' }}
    title={{ uz: <>Uch elementni <span className="italic" style={{ color: T.accent }}>Maydon saytiga</span> qo'shing.</>, ru: <>Добавьте три элемента <span className="italic" style={{ color: T.accent }}>на сайт Maydon</span>.</> }}
    mentor={{ uz: <>Bosish mantiqini Antigravity yozadi, animatsiyani — siz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Логику нажатия пишет Antigravity, анимацию — вы; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da `maydon` papkasini oching. Terminalda: `cd web`, `npm install motion`, keyin `npm run dev`. Brauzerda `localhost:5173` — Shanba kataklari chiqsin.", ru: 'Откройте в Antigravity папку `maydon`. В терминале: `cd web`, `npm install motion`, затем `npm run dev`. В браузере `localhost:5173` — пусть появятся ячейки субботы.' } },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'Нажмите «Скопировать» и отправьте в Antigravity:' }, prompt: [
        { uz: '`web/src/App.jsx`: bo\'sh vaqt katagi bosilsa, u band bo\'lsin — katakka `band` klassi qo\'shilsin.', ru: '`web/src/App.jsx`: если нажата свободная ячейка времени, пусть она станет занятой — ячейке добавится класс `band`.' },
        { uz: 'Kataklar ostida «Band qilindi: 18:00» kabi yozuv soati bilan chiqsin va 3 soniyadan keyin yo\'qolsin; soat `belgi` nomli state\'da tursin, yozuvga `belgi` klassini ber.', ru: 'Под ячейками пусть появится надпись с часом, как «Band qilindi: 18:00», и исчезнет через 3 секунды; час пусть хранится в state `belgi`, надписи дай класс `belgi`.' },
        { uz: 'Band katak qayta bosilmasin. Hozircha hammasi faqat saytda — Backend\'ga yuborilmasin.', ru: 'Занятая ячейка повторно не нажимается. Пока всё только на сайте — в Backend не отправлять.' },
        { uz: '`App.css` ga va animatsiyaga tegma — ularni men yozaman. O\'zgargan qatorlarni ayt.', ru: 'Не трогай `App.css` и анимацию — их напишу я. Скажи, какие строки изменились.' }
      ].map(bt), err: { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' } },
      { h: { uz: "CSS — qo'lda", ru: 'CSS — вручную' }, t: { uz: "`web/src/App.css` ni oching va o'zingiz terib yozing (nusxa yo'q): `.katak` ga `transition: transform 0.15s, background-color 0.3s;`, yangi qoida `.katak:active { transform: scale(0.95); }`, faylning oxiriga `@media (prefers-reduced-motion: reduce) { .katak:active { transform: none; } }`. Saqlang va katakni bosing: kichrayib qaytadi, rangi silliq kulranglashadi.", ru: 'Откройте `web/src/App.css` и наберите сами (без копирования): в `.katak` — `transition: transform 0.15s, background-color 0.3s;`, новое правило `.katak:active { transform: scale(0.95); }`, в конец файла — `@media (prefers-reduced-motion: reduce) { .katak:active { transform: none; } }`. Сохраните и нажмите на ячейку: уменьшится и вернётся, цвет плавно станет серым.' } },
      { h: { uz: "Motion — qo'lda", ru: 'Motion — вручную' }, t: { uz: '`App.jsx` tepasiga `import { motion, AnimatePresence, MotionConfig } from "motion/react"` ni yozing. Yozuvning `div` ini `motion.div` qiling (`key`, `initial`, `animate`, `exit`, `transition`) va uni `<AnimatePresence>` ichiga oling; butun sahifani `<MotionConfig reducedMotion="user">` ichiga oling. Saqlang va katakni bosing: «Band qilindi: 18:00» pastdan chiqadi va 3 soniyadan keyin so\'nadi.', ru: 'Вверху `App.jsx` напишите `import { motion, AnimatePresence, MotionConfig } from "motion/react"`. `div` надписи сделайте `motion.div` (`key`, `initial`, `animate`, `exit`, `transition`) и оберните его в `<AnimatePresence>`; всю страницу оберните в `<MotionConfig reducedMotion="user">`. Сохраните и нажмите на ячейку: «Band qilindi: 18:00» появится снизу и через 3 секунды погаснет.' }, err: { uz: "Ekranda xato chiqsa — matnini Antigravity'ga: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если на экране ошибка — её текст в Antigravity: «Вышла такая ошибка: {ошибка}. Исправь.»' } },
      { h: { uz: "O'z g'oyangizga", ru: 'Для своей идеи' }, t: { uz: "qavslarni o'z loyihangiz bo'yicha to'ldiring va «Nusxalash» — uyda o'z loyihangizda Antigravity'ga yuborasiz:", ru: 'заполните скобки по своему проекту и «Скопировать» — дома отправите в Antigravity в своём проекте:' }, prompt: [
        { uz: '{sahifa yoki fayl}: {bosiladigan tugma} bosilganda kichrayib qaytsin — `transform: scale(0.95)`, `transition` 0.15 soniya.', ru: '{страница или файл}: при нажатии на {кнопку} пусть уменьшается и возвращается — `transform: scale(0.95)`, `transition` 0.15 секунды.' },
        { uz: "{holati o'zgaradigan element} rangi 0.3 soniyada silliq o'zgarsin.", ru: 'Цвет {элемента, у которого меняется состояние} пусть плавно меняется за 0.3 секунды.' },
        { uz: "{tasdiq yozuvi} `motion` paketi bilan chiqib, so'nib ketsin (`AnimatePresence`, `exit`).", ru: '{Надпись-подтверждение} пусть появляется и гаснет с пакетом `motion` (`AnimatePresence`, `exit`).' },
        { uz: "Qurilmada harakat kamaytirilgan bo'lsa, kichrayish va surilish bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Если на устройстве уменьшено движение, пусть не будет уменьшения и сдвига. Больше ничего не трогай, скажи, какие файлы изменились.' }
      ].map(bt) }
    ]}
    natijaYorliq={{ uz: 'kutilgan natija · namuna: Maydon', ru: 'ожидаемый результат · образец: Maydon' }}
    natija={<MaydonMaket katta jonli={false} band={[...BOSH_BAND, '18:00']} belgi={{ soat: '18:00', faza: 'tur', kirish: 'birdan', k: 1, n: 0 }} />}
    ortda={['git fetch https://github.com/Azizbekcrypto/maydon --tags', 'git checkout -f dars-05-done']}
    doneText={{ uz: 'Maydon bosishga javob beradi: bosildi, o\'zgardi, band qilindi.', ru: 'Maydon отвечает на нажатие: нажато, изменилось, забронировано.' }} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran sflash (SABOQ 12), qolipdagi QKartochka (DE-204). Orqa tomon — oddiy matn; old va izoh — fmtCode.
const KARTALAR = [
  { front: { uz: "Harakat yoki holat o'zgarishiga kichik vizual javob qanday ataladi?", ru: 'Как называется маленький визуальный ответ на действие или смену состояния?' }, back: { uz: 'Mikro-harakat', ru: 'Микро-движение' }, note: { uz: 'Bizning misolda: bosilgan katak kichrayib qaytadi', ru: 'В нашем примере: нажатая ячейка уменьшается и возвращается' } },
  { front: { uz: 'Katakni 95% gacha qaysi qiymat kichraytiradi?', ru: 'Какое значение уменьшает ячейку до 95%?' }, back: { uz: 'transform: scale(0.95)', ru: 'transform: scale(0.95)' }, note: { uz: "Qo'shni kataklar joyida qoladi", ru: 'Соседние ячейки остаются на месте' } },
  { front: { uz: 'Bosib turilgan payt CSS\'da qanday yoziladi?', ru: 'Как в CSS записывается момент, когда элемент зажат?' }, back: { uz: ':active', ru: ':active' }, note: { uz: 'Masalan: `.katak:active`', ru: 'Например: `.katak:active`' } },
  { front: { uz: "O'zgarishga vaqtni qaysi xususiyat beradi?", ru: 'Какое свойство даёт изменению время?' }, back: { uz: 'transition', ru: 'transition' }, note: { uz: 'Qaysi xususiyat va qancha vaqt', ru: 'Какое свойство и сколько времени' } },
  { front: { uz: '`transition: transform 0.15s` dagi «s» nima?', ru: 'Что такое «s» в `transition: transform 0.15s`?' }, back: { uz: 'soniya', ru: 'секунда' }, note: { uz: '1 soniyada o\'yinchi kutib qoladi', ru: 'За 1 секунду игрок заждётся' } },
  { front: { uz: 'Bitta `transition` ga ikki xususiyat qanday yoziladi?', ru: 'Как записать два свойства в один `transition`?' }, back: { uz: 'Vergul bilan', ru: 'Через запятую' }, note: { uz: '`transform 0.15s, background-color 0.3s`', ru: '`transform 0.15s, background-color 0.3s`' } },
  { front: { uz: '`.katak.band` qaysi elementni topadi?', ru: 'Какой элемент находит `.katak.band`?' }, back: { uz: 'katak va band klassi bor elementni', ru: 'Элемент с классами katak и band' }, note: { uz: "Orasida bo'sh joy bo'lsa — boshqa selektor", ru: 'Если между ними пробел — это другой селектор' } },
  { front: { uz: "Motion qaysi buyruq bilan o'rnatiladi?", ru: 'Какой командой устанавливается Motion?' }, back: { uz: 'npm install motion', ru: 'npm install motion' }, note: { uz: 'Import: `motion/react`', ru: 'Импорт: `motion/react`' } },
  { front: { uz: 'Belgining chiqishdan oldingi holati qayerda yoziladi?', ru: 'Где записывается состояние метки до появления?' }, back: { uz: 'initial', ru: 'initial' }, note: { uz: "Kelib to'xtaydigan holat — `animate`", ru: 'Состояние, где она останавливается, — `animate`' } },
  { front: { uz: 'Belgining ketayotgandagi holati qayerda yoziladi?', ru: 'Где записывается состояние метки при уходе?' }, back: { uz: 'exit', ru: 'exit' }, note: { uz: '`AnimatePresence` ichida ishlaydi', ru: 'Работает внутри `AnimatePresence`' } },
  { front: { uz: 'Harakat kamaytirilganini sayt qanday biladi?', ru: 'Как сайт узнаёт, что движение уменьшено?' }, back: { uz: 'prefers-reduced-motion', ru: 'prefers-reduced-motion' }, note: { uz: "Kichrayish o'chadi, rang qoladi", ru: 'Уменьшение отключается, цвет остаётся' } },
  { front: { uz: 'Saytda qaysi harakat qoladi?', ru: 'Какое движение остаётся на сайте?' }, back: { uz: "O'yinchiga javob beradigani", ru: 'То, что отвечает игроку' }, note: { uz: "«Bosildi», «o'zgardi», «tayyor»", ru: '«Нажато», «изменилось», «готово»' } }
];
// SABOQ 16: kartochka ekrani — Mentor yo'q (KORPUS §61); birinchi bosishgacha karta yuzi halqada, ostida yorliq. Jonli darsda o'quvchida o'tkazib yuboriladi (FLASH_IDX).
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={`an-flash ${bosildi ? '' : 'yangi'}`} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: fmtCode(tr(c.front)), back: tr(c.back), note: c.note && fmtCode(tr(c.note)) }))} />
          {!bosildi && <p className="an-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — qolipdan: QYakun (DE-204, 192/204). CODE STRIKE va arena — o'yin qatlami, darsda. Bugungi asosiy fikr (P-013) — cta boshida, kichik =====
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
  const RECAP = [
    { uz: <><code className="qcode">transform: scale(0.95)</code> katakni kichraytiradi, qo'shni kataklar joyida qoladi</>, ru: <><code className="qcode">transform: scale(0.95)</code> уменьшает ячейку, соседние остаются на месте</> },
    { uz: <><code className="qcode">transition</code> o'zgarishni berilgan vaqt ichida silliq bajaradi</>, ru: <><code className="qcode">transition</code> выполняет изменение плавно за заданное время</> },
    { uz: <>Motion <code className="qcode">initial</code>, <code className="qcode">animate</code>, <code className="qcode">exit</code> bilan chiqish va ketishni silliq qiladi</>, ru: <>Motion с <code className="qcode">initial</code>, <code className="qcode">animate</code>, <code className="qcode">exit</code> делает появление и уход плавными</> },
    { uz: "Harakat kamaytirilgan qurilmada kichrayish o'chadi, rang va shaffoflik qoladi", ru: 'На устройстве с уменьшенным движением уменьшение отключается, цвет и прозрачность остаются' }
  ];
  const HOMEWORK = [
    { b: { uz: "O'z loyihangizda", ru: 'В своём проекте' }, t: { uz: "— amaliyotdagi 5-qadam promptini Antigravity'ga yuboring: uch element bosishga javob bersin", ru: '— отправьте в Antigravity промпт из 5-го шага практики: пусть три элемента отвечают на нажатие' } },
    { b: { uz: 'Tekshiring', ru: 'Проверьте' }, t: { uz: '— qurilmada harakatni kamaytirishni yoqib, sahifangizni oching: kichrayish o\'chdimi?', ru: '— включите на устройстве уменьшение движения и откройте страницу: уменьшение отключилось?' } },
    { b: { uz: 'Kuzating', ru: 'Понаблюдайте' }, t: { uz: "— telefoningizdagi bitta ilovada «bosildi», «o'zgardi», «tayyor» javoblarini toping va har birini bir gapda yozing", ru: '— найдите в одном приложении на телефоне ответы «нажато», «изменилось», «готово» и опишите каждый одним предложением' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Maydon javob beradi', ru: 'Maydon отвечает' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Endi bosishga <span className="italic" style={{ color: T.accent }}>javob beradigan sayt</span> qila olasiz.</>, ru: <>Теперь вы умеете делать <span className="italic" style={{ color: T.accent }}>сайт, который отвечает</span> на нажатие.</> })}
        cta={<>
          <p className="an-fikr fade-up d1">{tr({ uz: "Animatsiya bezak emas: u odamga «bosildi», «o'zgardi», «tayyor» deb javob beradi.", ru: 'Анимация — не украшение: она отвечает человеку «нажато», «изменилось», «готово».' })}</p>
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={RECAP.map(tr)}
        uyga={HOMEWORK.map(h => ({ b: tr(h.b), t: tr(h.t) }))}
        keyingi={tr({ uz: <>Keyingi dars — <b>«Birinchi odam kirganda nimani ko'rasiz?»</b>: Maydon bosishga javob beradi, endi odamlar unda nima qilayotganini ko'rish navbati.</>, ru: <>Следующий урок — <b>«Что вы увидите, когда зайдёт первый человек?»</b>: Maydon отвечает на нажатие, теперь очередь увидеть, что люди на нём делают.</> })}
        hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      />
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function AnimationLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenA1, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === 5-DARS — darsning o'z vizuali: «Maydon» maketi, kod parchasi, kalitlar. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .an-sayt { position: relative; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; min-width: 0; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.22); }
        .an-sayt-bar { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; min-width: 0; }
        .an-sayt-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; flex-shrink: 0; }
        .an-sayt-bar span { margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 6px; padding: 2px 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .an-sayt-tana { position: relative; padding: 12px 14px 12px; display: flex; flex-direction: column; gap: 10px; }
        .an-bosh { display: flex; align-items: center; gap: 10px; min-height: 30px; }
        .an-nom, .an-sarlavha { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 17px; color: ${T.ink}; }
        .an-sarlavha { background: none; border: none; padding: 2px 6px; margin: -2px -6px; border-radius: 8px; cursor: pointer; }
        .an-sarlavha.miltilla { animation: an-miltilla 0.9s steps(2, jump-none) infinite; }
        .an-sarlavha.toxta, .an-top.toxta { opacity: 0.35; animation: none; cursor: default; }
        @keyframes an-miltilla { 50% { color: ${T.accent}; opacity: 0.35; } }
        .an-top { width: 30px; height: 30px; padding: 0; border: none; background: none; cursor: pointer; border-radius: 50%; }
        .an-top svg { width: 100%; height: 100%; display: block; }
        .an-top.aylan svg { animation: an-aylan 1.4s linear infinite; }
        @keyframes an-aylan { to { transform: rotate(360deg); } }
        .an-kun { margin-left: auto; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.ink}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 8px; padding: 4px 12px; }
        .an-kataklar { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
        .an-kataklar.yakka { grid-template-columns: minmax(0, 1fr); }
        .an-kw { position: relative; display: flex; flex-direction: column; align-items: stretch; }
        .an-katak { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; min-height: 42px; padding: 5px 4px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 13.5px; font-weight: 700; cursor: pointer; user-select: none; -webkit-user-select: none; touch-action: manipulation; -webkit-tap-highlight-color: transparent; transform: scale(1); transition: transform var(--tq, 0s) ease, background-color var(--cd, 0s) ease, color var(--cd, 0s) ease; }
        .an-katak.bos { transform: scale(var(--s, 1)); transition: transform var(--td, 0s) ease, background-color var(--cd, 0s) ease, color var(--cd, 0s) ease; }
        .an-katak.band { background: ${T.line}; color: ${T.ink2}; }
        .an-katak.b { cursor: default; }
        .an-katak.jim { cursor: default; }
        .an-katak:focus { outline: none; }
        .an-katak:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .an-katak small { font-family: 'Manrope', sans-serif; font-size: 10.5px; font-weight: 700; }
        .an-katak.yon { animation: an-yon 0.9s ease-out; }
        @keyframes an-yon { 0%, 40% { border-color: ${T.accent}; } 100% { border-color: ${T.line}; } }
        .an-iz { position: absolute; inset: 0; z-index: 2; pointer-events: none; border: 1.5px dashed ${T.accent}; border-radius: 10px; transform: scale(var(--g)); opacity: 0; animation: an-iz 0.3s ease-out forwards; }
        @keyframes an-iz { to { opacity: 0.55; } }
        .an-vaqt { align-self: center; margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.accent}; }
        .an-belgi-joy { min-height: 34px; display: flex; align-items: center; justify-content: center; }
        .an-belgi-joy.katta { min-height: 52px; }
        .an-belgi { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px; border: none; background: ${T.ink}; color: ${T.paper}; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; --by: 8px; }
        .an-belgi-joy.katta .an-belgi { font-size: 14.5px; padding: 9px 18px; --by: 16px; }
        button.an-belgi { cursor: pointer; }
        .an-belgi.k-past { animation: an-kir-past var(--bd, 0.3s) ease-out both; }
        .an-belgi.k-tepa { animation: an-kir-tepa var(--bd, 0.3s) ease-out both; }
        .an-belgi.k-joyida { animation: an-kir-joy var(--bd, 0.3s) ease-out both; }
        .an-belgi.ket { animation: an-ket var(--bd, 0.3s) ease-in forwards; }
        @keyframes an-kir-past { from { opacity: 0; transform: translateY(var(--by)); } }
        @keyframes an-kir-tepa { from { opacity: 0; transform: translateY(calc(var(--by) * -1)); } }
        @keyframes an-kir-joy { from { opacity: 0; } }
        @keyframes an-ket { to { opacity: 0; } }
        p.an-ichki { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 8px; padding: 6px 10px; animation: q-kir 0.3s ease-out; }
        .an-sayt.mini .an-sayt-tana { padding: 10px 12px; }
        .an-sayt.katta .an-sayt-tana { padding: 14px 16px 16px; gap: 12px; }
        .an-sayt.katta .an-nom { font-size: 20px; }
        .an-sayt.katta .an-katak { min-height: 54px; font-size: 15px; }
        .an-silk { animation: an-silk 0.4s ease-in-out; }
        @keyframes an-silk { 20%, 60% { translate: -5px 0; } 40%, 80% { translate: 5px 0; } }
        /* kod parchasi (o'qish uchun, nusxalanmaydi) */
        .an-kod { background: ${CODE.bg}; border-radius: 12px; overflow: hidden; min-width: 0; }
        .an-kod-h { padding: 6px 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${CODE.comment}; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .an-kod-t { display: flex; flex-direction: column; padding: 8px 0; user-select: none; -webkit-user-select: none; }
        .an-kq { display: block; width: 100%; padding: 1px 12px; text-align: left; border: none; background: none; font: inherit; color: inherit; transition: background-color 0.3s ease, opacity 0.3s ease; }
        .an-kq-t { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; line-height: 1.6; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; }
        .an-kq.iz { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 36%); column-gap: 10px; align-items: baseline; }
        .an-kq.iz .an-kq-t { font-size: 12px; }
        .an-kq-iz { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; line-height: 1.35; color: ${CODE.punct}; text-align: left; }
        .an-kq-iz .qcode { background: rgba(255,255,255,0.08); color: ${CODE.attr}; }
        .an-kq.yon { background: rgba(255,211,128,0.14); }
        .an-kq.yon .an-kq-t { color: ${CODE.attr}; }
        .an-kq.xira { opacity: 0.35; }
        .an-kq.bos { cursor: pointer; }
        .an-kq.bos:hover { background: rgba(255,255,255,0.06); }
        .an-kq.err, .an-kq.err:hover { background: ${fon(T.err, 0.62)}; }
        .an-kq.err .an-kq-t { color: ${T.paper}; text-decoration: line-through; text-decoration-color: ${fon(T.paper, 0.6)}; }
        .an-kq.tuz { background: ${fon(T.ok, 0.32)}; animation: q-kir 0.3s ease-out; }
        .an-kq.tuz .an-kq-t { color: ${T.okFon}; }
        .an-kod.an-navbat { box-shadow: 0 0 0 2px ${T.accent}; }
        /* SABOQ 11: tanlangan bashorat — ixcham qator, natija chiqquncha turadi */
        .an-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; animation: q-kir 0.3s ease-out; }
        .an-taxmin-s { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .an-taxmin-j { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.accent}; background: ${T.accentSoft}; border: 1.5px solid ${T.accent}; border-radius: 9px; padding: 3px 11px; }
        /* SABOQ 11 (F-1005-85/87): navbatdagi bosiladigan element — halqa doim, yengil puls; kam harakat rejimida puls o'chadi, halqa qoladi */
        .an-navbat { box-shadow: 0 0 0 2px ${T.accent}; animation: an-navbat 1.6s ease-out infinite; }
        .an-katak.an-navbat { border-color: ${T.accent}; }
        @keyframes an-navbat { 0% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 2px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 12px ${fon(T.accent, 0)}; } }
        .an-navbat-k > .q-bashorat { box-shadow: 0 0 0 2px ${T.accent}; animation: an-navbat 1.6s ease-out infinite; }
        .q-kirish:has(.an-hook.tanla) .q-variantlar-kol { border-radius: 14px; box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}; animation: an-navbat-g 1.6s ease-out infinite; }
        @keyframes an-navbat-g { 0% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 9px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 19px ${fon(T.accent, 0)}; } }
        .an-qiymatlar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .an-chip-kod { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; }
        .an-chip-l { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        p.an-nomqator { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.6vw,15.5px); line-height: 1.5; color: ${T.ink}; padding: 10px 14px; background: ${T.accentSoft}; border-radius: 12px; animation: q-kir 0.3s ease-out; }
        .an-vizual { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .an-fokus { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
        .an-kalit, .an-switch { align-self: flex-start; display: inline-flex; align-items: center; gap: 9px; padding: 6px 12px 6px 6px; border-radius: 999px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; }
        .an-kalit i, .an-switch i { position: relative; width: 34px; height: 20px; border-radius: 999px; background: ${T.line}; transition: background-color 0.2s ease; flex-shrink: 0; }
        .an-kalit i::after, .an-switch i::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: ${T.paper}; box-shadow: 0 1px 3px rgba(${T.shadowBase},0.3); transition: transform 0.2s ease; }
        .an-kalit.on, .an-switch.on { border-color: ${T.accent}; }
        .an-kalit.on i, .an-switch.on i { background: ${T.accent}; }
        .an-kalit.on i::after, .an-switch.on i::after { transform: translateX(14px); }
        .an-yol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
        .an-yol li { display: flex; gap: 5px; align-items: flex-start; padding: 5px 7px; border-radius: 9px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 11.5px; font-weight: 600; line-height: 1.35; color: ${T.ink2}; opacity: 0.55; transition: opacity 0.3s ease, border-color 0.3s ease; }
        .an-yol li i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.ink2}; }
        .an-yol li.joriy { opacity: 1; border-color: ${T.accent}; color: ${T.ink}; background: ${T.accentSoft}; }
        .an-yol li.otgan { opacity: 1; color: ${T.ink}; }
        .an-yol li.otdi { opacity: 0.4; text-decoration: line-through; }
        .an-ikki { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .an-yon { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .an-yorlar { display: flex; flex-wrap: wrap; gap: 6px; }
        .an-yorl { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 3px 10px; opacity: 0.45; transition: opacity 0.3s ease, border-color 0.3s ease; }
        .an-yorl.on { opacity: 1; border-color: ${T.accent}; color: ${T.ink}; }
        .an-hisob { align-self: flex-start; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .an-hisob b { color: ${T.accent}; font-family: 'JetBrains Mono', monospace; }
        .an-qadam-k { display: flex; flex-direction: column; gap: 10px; }
        p.an-qadam-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 600; line-height: 1.5; color: ${T.ink}; }
        .an-amal { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 8px; }
        .an-yordam { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; margin-top: 10px; }
        .an-bajardim { display: flex; justify-content: flex-end; margin-top: 12px; }
        .an-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .an-vazifa li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .an-vazifa li i { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 12px; background: ${T.bg}; color: ${T.ink2}; border: 1px solid ${T.line}; }
        .an-vazifa li.ok i { background: ${T.okFon}; color: ${T.ok}; border-color: ${T.ok}; }
        .an-kodoyna { display: flex; flex-direction: column; gap: 12px; height: 100%; }
        .an-natija-q { display: flex; flex-direction: column; gap: 8px; height: 100%; animation: q-kir 0.35s ease-out; }
        .an-natija { width: 100%; min-height: 230px; flex: 1 1 auto; border: 1px solid ${T.line}; border-radius: 12px; background: ${T.paper}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        p.an-repo { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        p.an-repo code { color: ${T.ink}; font-weight: 700; }
        .rc-ic .an-rc-kod { display: inline-block; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(13px,2vw,18px); line-height: 1.4; color: ${CODE.text}; background: ${CODE.bg}; padding: 10px 16px; border-radius: 10px; overflow-wrap: anywhere; }
        .an-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: an-navbat-fc 1.6s ease-out infinite; }
        @keyframes an-navbat-fc { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        p.an-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .an-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: an-fc-nuqta 1.4s ease-in-out 3; }
        @keyframes an-fc-nuqta { 50% { transform: scale(1.6); opacity: .4; } }
        p.an-fikr { margin: 0; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 600; line-height: 1.5; color: ${T.ink2}; text-align: center; }
        @media (max-width: 640px) {
          .an-fokus, .an-ikki { grid-template-columns: minmax(0, 1fr); }
          .an-yol { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .an-kq.iz { grid-template-columns: minmax(0, 1fr); }
        }
        /* DE-200: kam harakat rejimida maketning o'z harakati to'xtaydi (navbat halqasi qoladi, puls yo'q) */
        @media (prefers-reduced-motion: reduce) {
          .an-katak, .an-katak.bos, .an-kq, .an-yol li, .an-yorl { transition: none !important; }
          .an-belgi, .an-iz, .an-top.aylan svg, .an-sarlavha.miltilla, .an-katak.yon, .an-silk, .an-navbat, .an-navbat-k > .q-bashorat, .q-kirish:has(.an-hook.tanla) .q-variantlar-kol, .an-flash.yangi .fc-card:not(.flip) .fc-front, .an-fc-ipucha i, p.an-ichki, p.an-nomqator, .an-taxmin, .an-natija-q { animation: none !important; }
          .an-iz { opacity: 0.55; }
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
            <LiveGate live={live} title={tr({ uz: 'Tizim arxitekturasi darsi', ru: 'Урок об архитектуре системы' })} />
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
