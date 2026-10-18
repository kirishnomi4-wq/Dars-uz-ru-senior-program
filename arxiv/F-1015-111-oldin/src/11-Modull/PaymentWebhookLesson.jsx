import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul · 3-dars «Webhook: to'lov Backend'ga qanday yetib keladi» (m11-03, TEX — modul cho'qqisi). Skeletdan (src/skelet/NamunaDars.jsx) qurilgan, 08.10.2026.
// Manba-haqiqat: feedback/F-1007-13modul/03-PaymentWebhook-v3.md (+ 03-FILTR.md). 20 ekran:
//   0 QKirish · 1 QReja · 2, 4, 6, 9, 11, 12 QTushuncha · 3, 5, 8, 10 test (QTest) · 7 QKod (HtmlCompiler, ko'p fayl) · 13 QMustaqil · 14 QTartib (final) ·
//   15, 16 amaliyot bloki (QBlok + ScreenBlok) · 17 podium · 18 QKartochka · 19 QYakun.
// Bitta vizual — TolovSahna (telefon · to'lov xizmati · Backend), manbalar: TOLOV_SAHNA, MASHQ_SAHIFA, NAMUNA_XABAR, MENTOR_SXEMA, ISHLASH_TARTIBI, XIZMAT_KARTALAR.
// Real pul yo'q: karta maydoni (raqam, muddat, CVV) hech qayerda chizilmaydi; maxfiy kalit qiymati yo'q — faqat nomi (TOLOV_KALITI).
// Saqlanadi: pm-m11d3-oqim (13-ekran qatorlar, A2 4-qadam test) · pm-m11d3-code (kod oynasi). O'qiladi: pm-m9d8-platforma (trek), pm-m11d2-model (eslatma qatori).
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QKod, QMustaqil, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';
// Kod oynasi (7-ekran) — umumiy kompilyator moduli; ko'p fayl: app.js (o'quvchi) · index.html · namuna.js
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

const LESSON_META = { lessonId: 'm11-03-v1', lessonTitle: { uz: "Webhook: to'lov Backend'ga qanday yetib keladi", ru: "Вебхук: как платёж доходит до Backend" } };
// 20 ekran (MD v3, GATE M 13M-GATE-1): kirish → reja → (tushuncha → savol)× → kod oynasi → sxema → mustaqil ish → final → 2 amaliyot bloki → podium → kartochkalar → yakun.
const HW_TOKENS = [
  { t: { uz: "to'lov xabari", ru: 'сообщение о платеже' }, l: 6, tp: 20, s: 13, d: 6 },
  { t: { uz: 'imzo', ru: 'подпись' }, l: 72, tp: 14, s: 12, d: 7.5 },
  { t: { uz: 'takror xabar', ru: 'повторное сообщение' }, l: 20, tp: 72, s: 12, d: 8.5 },
  { t: { uz: 'test rejim', ru: 'тестовый режим' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD ✔ o'rni: s3 C · s5 A · s8 D · s10 B; s14 — final sentinel 0 (picked 0 — birinchi urinishda topdi).
// QKod (7), QMustaqil (13) va bloklar (15, 16) — `practice: -1` (variant yo'q, signal 500+ zonasida).
const INLINE_KEYS = { s3: 2, s5: 0, s8: 3, s10: 1, s14: 0, practice: -1 };
// 📖 RECAPS — har ballik testga 3 karta (kalit = ekran INDEKSI; S-026: kod qatori bor joyda kod, qolganida raqam)
const rcKod = (s) => <code className="qcode">{s}</code>;
const rcRaqam = (n) => <b className="pw-rc-n">{n}</b>;
const RECAPS = {
  3: {
    title: { uz: "To'lov xabarini xizmat yuboradi", ru: 'Сообщение о платеже отправляет сервис' },
    cards: [
      { ic: null, h: { uz: "Tashkilotchi xizmatning sahifasida to'laydi.", ru: 'Организатор платит на странице сервиса.' }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: "Xizmat to'lov xabarini Backend manziliga o'zi yuboradi", ru: 'Сервис сам отправляет сообщение о платеже на адрес Backend' }, body: { uz: rcKod('POST /tolov/webhook'), ru: rcKod('POST /tolov/webhook') } },
      { ic: null, h: { uz: 'Backend «qabul qildim» deb javob beradi', ru: 'Backend отвечает «принял»' }, body: { uz: rcKod('200'), ru: rcKod('200') }, ask: { uz: "Ilovaning «to'landi» degan gapiga ishonsak, nima bo'lishi mumkin?", ru: 'Что может случиться, если верить словам приложения «оплачено»?' } }
    ]
  },
  5: {
    title: { uz: 'Imzo', ru: 'Подпись' },
    cards: [
      { ic: null, h: { uz: 'Xizmat imzoni kalit bilan hisoblaydi', ru: 'Сервис вычисляет подпись ключом' }, body: { uz: rcKod("createHmac('sha256', TOLOV_KALITI)"), ru: rcKod("createHmac('sha256', TOLOV_KALITI)") } },
      { ic: null, h: { uz: 'Imzo sarlavhada keladi, kalit esa kelmaydi', ru: 'Подпись приходит в заголовке, а ключ — нет' }, body: { uz: rcKod('X-Imzo: 3f9a…'), ru: rcKod('X-Imzo: 3f9a…') } },
      { ic: null, h: { uz: 'Mos kelmasa — hech narsa yozilmaydi', ru: 'Не совпало — ничего не записывается' }, body: { uz: rcKod('401'), ru: rcKod('401') }, ask: { uz: "Kalit README'ga yozilib qolsa, kim soxta xabar yasay oladi?", ru: 'Если ключ попал в README, кто сможет сделать поддельное сообщение?' } }
    ]
  },
  8: {
    title: { uz: 'Takror xabar', ru: 'Повторное сообщение' },
    cards: [
      { ic: null, h: { uz: "Javob yo'qolsa, xizmat o'sha xabarni qayta yuboradi.", ru: 'Если ответ потерялся, сервис отправляет то же сообщение снова.' }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: "Backend to'lov raqamini tekshiradi", ru: 'Backend проверяет номер платежа' }, body: { uz: rcKod('yozilganlar.includes(raqam)'), ru: rcKod('yozilganlar.includes(raqam)') } },
      { ic: null, h: { uz: 'Takrorga ham javob, lekin yozuvsiz', ru: 'На повтор тоже ответ, но без записи' }, body: { uz: rcKod('200 { takror: true }'), ru: rcKod('200 { takror: true }') }, ask: { uz: <>Takror xabarga {rcKod('401')} qaytarilsa, xizmat nima qiladi?</>, ru: <>Что сделает сервис, если на повтор вернуть {rcKod('401')}?</> } }
    ]
  },
  10: {
    title: { uz: "Rad etilgan to'lov", ru: 'Отклонённый платёж' },
    cards: [
      { ic: null, h: { uz: "To'lov o'tmasa ham xabar keladi", ru: 'Даже если платёж не прошёл, сообщение приходит' }, body: { uz: rcKod("holat: 'rad'"), ru: rcKod("holat: 'rad'") } },
      { ic: null, h: { uz: 'Backend uni yozadi', ru: 'Backend его записывает' }, body: { uz: rcKod('m-102 · rad'), ru: rcKod('m-102 · rad') } },
      { ic: null, h: { uz: "Hech narsa ochilmaydi; sahifada «To'lov o'tmadi».", ru: 'Ничего не открывается; на странице «Платёж не прошёл».' }, body: { uz: rcRaqam(3), ru: rcRaqam(3) }, ask: { uz: "Rad yozuvi bo'lmasa, tashkilotchi «to'lovim qayerda?» desa, nima javob berasiz?", ru: 'Если записи об отказе нет, что вы ответите организатору на «где мой платёж?»' } }
    ]
  },
  14: {
    title: { uz: 'Ishlash tartibi', ru: 'Порядок обработки' },
    cards: [
      { ic: null, h: { uz: "1 · Bosish · 2 · To'lov xabari", ru: '1 · Нажатие · 2 · Сообщение о платеже' }, body: null },
      { ic: null, h: { uz: '3 · Imzo · 4 · To\'lov raqami yangimi', ru: '3 · Подпись · 4 · Новый ли номер платежа' }, body: null },
      { ic: null, h: { uz: <>5 · Yozuv · 6 · {rcKod('200')}</>, ru: <>5 · Запись · 6 · {rcKod('200')}</> }, body: null, ask: { uz: <>Backend {rcKod('200')} ni yozishdan oldin qaytarsa-yu, yozuv chiqmay qolsa, nima bo'ladi?</>, ru: <>Что будет, если Backend вернёт {rcKod('200')} до записи, а запись не получится?</> } }
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

// ===== BITTA VIZUAL — «telefon · to'lov xizmati · Backend» sahnasi (163, 180): bitta manba TOLOV_SAHNA + MASHQ_SAHIFA + NAMUNA_XABAR, har ekran TolovSahna'ni ishlatadi =====
// Karta maydoni (raqam, muddat, CVV) hech bir holatda chizilmaydi (TAQIQLAR 1). Logotip va emoji yo'q (D4). Rang — faqat holat (D3).
// qolip-maket: pw-sb pw-tolash pw-rad pw-bot pw-haqiqiy pw-soxta pw-kuting pw-takror pw-yana pw-chip pw-karta pw-sabab pw-no-btn pw-tk-btn
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
// Uzun buyruq (30+ belgi) so'z ichida bo'linmasin: kod bo'lagida faqat nuqtadan keyin <wbr> (B6)
const kodWbr = (p) => (p.length > 30 ? p.split(/(?<=\.)/).flatMap((b, j) => (j ? [<wbr key={'w' + j} />, b] : [b])) : p);
const txW = (o) => { const s = tr(o); return typeof s === 'string' && s.includes('`') ? s.split('`').map((p, i) => (i % 2 ? <code className="qcode pw-kod-w" key={i}>{kodWbr(p)}</code> : p)) : s; };
// Manzil faqat «…» va «/» dan keyin bo'linadi (B5): bo'laklar bo'linmaydi, orasida <wbr>
const manzilWbr = (s) => s.split(/(?<=[/…])/).flatMap((b, i) => (i ? [<wbr key={'w' + i} />, <span key={i}>{b}</span>] : [<span key={i}>{b}</span>]));
const halqa = (on) => (on ? 'pw-halqa' : undefined);
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Ketma-ket sahna qadamlari: [[kechikish ms, fn], …]; ekran yopilsa taymerlar tozalanadi; reduced-motion — holatlar kechikishsiz almashadi (DE-200)
function useKetma() {
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  return useCallback((qadamlar) => {
    const kam = kamHarakat();
    let t = 0;
    qadamlar.forEach(([ms, fn]) => { t += kam ? 0 : ms; tm.current.push(setTimeout(fn, t)); });
  }, []);
}
const lsOqi = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsYoz = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* xotira yopiq */ } };
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };

// «Maydon Jamoa» nomi — 11-Modul 9.62 yashili (9, 10, 12-Modul darslaridagi rang bilan bir). Brend nomlari — o'z rangida, logotipsiz (11-ekran).
const MAYDON_RANG = '#2E9E4F';
const TOLOV_SAHNA = {
  telYorliq: { uz: 'telefon · brauzer', ru: 'телефон · браузер' },
  telTg: { uz: 'telefon · Telegram', ru: 'телефон · Telegram' },
  manzil: 'maydon-jamoa-….onrender.com/tolov-mashq',
  xizmat: { uz: "To'lov xizmati", ru: 'Платёжный сервис' },
  xizmatIzoh: { uz: "pulni qabul qiladigan kompaniya · bu darsda — mashq", ru: 'компания, принимающая деньги · на уроке — учебная' },
  xizmatIzoh0: { uz: 'pulni qabul qiladigan kompaniya', ru: 'компания, принимающая деньги' },
  boshqaServer: { uz: 'boshqa kompaniya serveri', ru: 'сервер другой компании' },
  telegram: 'Telegram',
  botingiz: { uz: 'botingiz', ru: 'ваш бот' },
  botManzil: '…onrender.com/telegram',
  kompyuter: { uz: 'boshqa kompyuter', ru: 'другой компьютер' },
  birKalit: { uz: "bir xil kalit — faqat shu ikkalasida", ru: 'один и тот же ключ — только у этих двоих' },
  chiroq: { uxlayapti: { uz: 'uxlayapti', ru: 'спит' }, uygonmoqda: { uz: "uyg'onmoqda…", ru: 'просыпается…' }, uygoq: { uz: "uyg'oq", ru: 'не спит' } },
  javobKelmadi: { uz: 'javob kelmadi', ru: 'ответ не пришёл' },
  qabulQilindi: { uz: 'qabul qilindi', ru: 'принято' },
  ikkiQator: { uz: "bitta to'lov — ikki qator", ru: 'один платёж — две строки' },
  hechNarsa: { uz: 'hech narsa ochilmaydi', ru: 'ничего не открывается' },
  takror: (yoq) => (yoq ? { uz: 'Takror tekshiruvi: yoqiq', ru: 'Проверка повтора: вкл.' } : { uz: "Takror tekshiruvi: o'chiq", ru: 'Проверка повтора: выкл.' }),
  xizmatSahifa: { uz: "xizmatning o'z sahifasi", ru: 'собственная страница сервиса' },
  kartaQoladi: { uz: "karta ma'lumoti shu yerda qoladi", ru: 'данные карты остаются здесь' },
  ilova: { uz: 'ilova', ru: 'приложение' },
  brauzer: { uz: 'brauzer', ru: 'браузер' },
  tolovgaOtish: { uz: "To'lovga o'tish", ru: 'Перейти к оплате' },
  oyin: { uz: 'Shanba, 18:00 · Mahalla maydoni · 8\u00a0/\u00a010', ru: 'Суббота, 18:00 · Поле махалли · 8\u00a0/\u00a010' },
  qatorSoni: (n) => ({ uz: `${n} qator`, ru: `${n} ${n === 1 ? 'строка' : n >= 2 && n <= 4 ? 'строки' : 'строк'}` })
};
// «Mashq to'lov» sahifasi (tayanch 1.3 aynan): sarlavha, test qatori, mahsulot qatori, summa + «Mentorning taxmini», tugmalar
const MASHQ_SAHIFA = {
  sarlavha: { uz: "Mashq to'lov", ru: 'Учебная оплата' },
  test: { uz: "Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.", ru: 'Это учебная страница. Карта не запрашивается, деньги не списываются.' },
  mahsulot: { uz: 'Pro, 30 kun', ru: 'Pro, 30 дней' },
  summa: { uz: "10 000 so'm", ru: '10 000 сумов' },
  taxmin: { uz: 'Mentorning taxmini', ru: 'Оценка Ментора' },
  tolash: { uz: "To'lash (mashq)", ru: 'Оплатить (учебно)' },
  rad: { uz: 'Rad etish (mashq)', ru: 'Отклонить (учебно)' },
  ikki: { uz: 'Ikki marta yuborish', ru: 'Отправить дважды' },
  imzosiz: { uz: 'Imzosiz yuborish', ru: 'Отправить без подписи' },
  tolandi: { uz: "To'landi (mashq)", ru: 'Оплачено (учебно)' },
  otmadi: { uz: "To'lov o'tmadi", ru: 'Платёж не прошёл' }
};
// Namuna xabar (tayanch 9.1): to'lov raqami m-…, hisob 7, imzo qisqartirilgan — hech qanday kalitdan hisoblanmagan
const NAMUNA_XABAR = { tolovRaqami: 'm-101', holat: 'tolandi', summa: 10000, oyinchiId: 7, imzo: '7c1e…' };
const xabarQatorlar = (x) => [`tolovRaqami: '${x.tolovRaqami}'`, `holat: '${x.holat}'`, `summa: ${x.summa}`, `oyinchiId: ${x.oyinchiId}`];
// Mentor sxemasi — besh qator (A-bo'lim 4, tayanch 1.3): 12-ekran kartalari, A2 Yordami va kutilgan natija, kartochka
const MENTOR_SXEMA = [
  { id: 'q1', kim: { uz: 'Ilova', ru: 'Приложение' }, nima: { uz: "«To'lovga o'tish» bosilganda to'lov sahifasini ochadi", ru: 'при нажатии «Перейти к оплате» открывает страницу оплаты' }, kimga: 'brauzer', yol: 'ilova-brauzer' },
  { id: 'q2', kim: { uz: 'Tashkilotchi', ru: 'Организатор' }, nima: { uz: "to'lov sahifasida to'laydi yoki rad etadi; karta ma'lumoti faqat xizmatda", ru: 'на странице оплаты платит или отклоняет; данные карты только у сервиса' }, kimga: 'xizmat', yol: 'telefon-xizmat' },
  { id: 'q3', kim: { uz: "To'lov xizmati", ru: 'Платёжный сервис' }, nima: { uz: "to'lov xabarini yuboradi: `POST /tolov/webhook`", ru: 'отправляет сообщение о платеже: `POST /tolov/webhook`' }, kimga: 'backend', yol: 'xizmat-backend' },
  { id: 'q4', kim: { uz: 'Backend', ru: 'Backend' }, nima: { uz: "imzoni tekshiradi, to'lovni bir marta yozadi, Pro muddatini uzaytiradi, `200` qaytaradi", ru: 'проверяет подпись, записывает платёж один раз, продлевает Pro, возвращает `200`' }, kimga: 'xizmat', yol: 'backend-xizmat' },
  { id: 'q5', kim: { uz: 'Ilova', ru: 'Приложение' }, nima: { uz: 'Pro holatini qayta so\'raydi: `GET /men`', ru: 'заново запрашивает статус Pro: `GET /men`' }, kimga: 'backend', yol: 'telefon-backend' }
];
const KIMGA = { brauzer: { uz: 'Brauzer', ru: 'Браузер' }, xizmat: { uz: "To'lov xizmati", ru: 'Платёжный сервис' }, backend: { uz: 'Backend', ru: 'Backend' }, ilova: { uz: 'Ilova', ru: 'Приложение' } };
const KIMGA_TARTIB = ['brauzer', 'xizmat', 'backend', 'ilova'];
// Ishlash tartibi — 6 bo'lak (14-ekran final)
const ISHLASH_TARTIBI = [
  { id: 'bosadi', label: { uz: "Tashkilotchi «To'lash (mashq)» ni bosadi", ru: 'Организатор нажимает «Оплатить (учебно)»' } },
  { id: 'yuboradi', label: { uz: "To'lov xizmati to'lov xabarini yuboradi", ru: 'Платёжный сервис отправляет сообщение о платеже' } },
  { id: 'imzo', label: { uz: 'Backend imzoni tekshiradi', ru: 'Backend проверяет подпись' } },
  { id: 'yangimi', label: { uz: "Backend to'lov raqami yangiligini tekshiradi", ru: 'Backend проверяет, новый ли номер платежа' } },
  { id: 'yozadi', label: { uz: "Backend to'lovni `tolovlar` ga yozadi", ru: 'Backend записывает платёж в `tolovlar`' } },
  { id: 'qaytaradi', label: { uz: 'Backend xizmatga `200` qaytaradi', ru: 'Backend возвращает сервису `200`' } }
];
// Real xizmatlar — ko'prik (tayanch 1.3, 6; rasmiy fakt 07.10.2026). Rang — vizual bosqichda tekshiriladi (Payme — 9-Modul 1-dars maket rangi)
const XIZMAT_KARTALAR = [
  { id: 'payme', nom: 'Payme', rang: '#00899A', izoh: { uz: "O'zbekistondagi to'lov xizmati", ru: 'платёжный сервис в Узбекистане' },
    qatorlar: [{ uz: "Javob yo'qolsa, Payme xuddi shu so'rovni qayta yuboradi; summa tiyinda keladi.", ru: 'Если ответ потерялся, Payme повторяет тот же запрос; сумма приходит в тийинах.' },
      { uz: 'Kassa faqat yuridik shaxs yoki YaTT (yakka tartibdagi tadbirkor) uchun ochiladi.', ru: 'Кассу открывают только юрлицу или ИП (индивидуальному предпринимателю).' }] },
  { id: 'click', nom: 'Click', rang: '#0079C1', izoh: { uz: "O'zbekistondagi to'lov xizmati", ru: 'платёжный сервис в Узбекистане' },
    qatorlar: [{ uz: "Click ikki so'rov yuboradi — Prepare va Complete; har birida maxfiy kalit qo'shib hisoblangan imzo bor.", ru: 'Click отправляет два запроса — Prepare и Complete; в каждом подпись, вычисленная с секретным ключом.' },
      { uz: "To'lov allaqachon o'tgan bo'lsa, Backend «Already paid» deb javob beradi.", ru: 'Если платёж уже прошёл, Backend отвечает «Already paid».' }] },
  { id: 'stripe', nom: 'Stripe', rang: '#635BFF', izoh: { uz: "xorijdagi to'lov xizmati", ru: 'зарубежный платёжный сервис' },
    qatorlar: [{ uz: 'Bitta xabar bir necha marta kelishi mumkin — Stripe ishlangan xabar raqamlarini yozib qo\'yishni maslahat beradi.', ru: 'Одно сообщение может прийти несколько раз — Stripe советует записывать номера обработанных сообщений.' },
      { uz: "Hisob ochiladigan davlatlar ro'yxatida O'zbekiston yo'q.", ru: 'В списке стран, где открывают аккаунт, Узбекистана нет.' }] }
];

const QulfIc = () => <svg className="pw-qulf-ic" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><rect x="3" y="7" width="10" height="7.5" rx="1.6" fill="currentColor" /><path d="M5.2 7V5.3a2.8 2.8 0 0 1 5.6 0V7" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>;
const SoatIc = ({ yur }) => <svg className={cx('pw-soat-ic', yur && 'yur')} viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.4" /><path className="pw-soat-mil" d="M8 8V4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 8h2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
const NoutbukIc = () => <svg viewBox="0 0 40 26" width="40" height="26" aria-hidden="true"><rect x="7" y="2" width="26" height="17" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M2 22h36l-3 3H5z" fill="currentColor" /></svg>;
const Qadam = ({ q }) => (q ? <span className="pw-qadam fade-step"><i>{q.n}</i>{tr(q.t)}</span> : null);

// Telefon ekranlari: mashq (to'lov sahifasi) · telegram (7-Modul ko'prigi) · xizmatSahifa (haqiqiy xizmat — karta maydonisiz) · ilova (12-ekran)
// F-1007-478: mashq sahifasi tanish to'lov sahifasi ko'rinishida (Payme maketi: brend sarlavha · savdogar · summa · katta tugma); matn va URL — mashq
const PAYME_RANG = '#00B5B5';
const MashqSahifa = ({ t }) => (
  <div className="pw-mashq pm">
    <div className="pw-pm-bosh"><b>Payme</b><span>{tr({ uz: 'mashq', ru: 'учебно' })}</span></div>
    <b className="pw-m-sar">{tr(MASHQ_SAHIFA.sarlavha)}</b>
    <span className="pw-m-nom"><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b> · {tr(MASHQ_SAHIFA.mahsulot)}</span>
    <span className="pw-m-summa pm"><b>{tr(MASHQ_SAHIFA.summa)}</b><em>{tr(MASHQ_SAHIFA.taxmin)}</em></span>
    <button type="button" className={cx('pw-tolash pm', halqa(t.tolashHalqa))} disabled={!t.onTolash} onClick={t.onTolash}>{tr(MASHQ_SAHIFA.tolash)}</button>
    <button type="button" className={cx('pw-rad', halqa(t.radHalqa))} disabled={!t.onRad} onClick={t.onRad}>{tr(MASHQ_SAHIFA.rad)}</button>
    <span className="pw-m-test">{tr(MASHQ_SAHIFA.test)}</span>
    {t.holat && <span key={t.holat} className={cx('pw-m-holat', t.holat === 'tolandi' ? 'ok' : 'err')}>{tr(t.holat === 'tolandi' ? MASHQ_SAHIFA.tolandi : MASHQ_SAHIFA.otmadi)}</span>}
  </div>
);
const TelEkran = ({ t }) => {
  if (t.ekran === 'telegram') return (
    <div className="pw-tg">
      <div className="pw-tg-bosh"><b>{tr(TOLOV_SAHNA.botingiz)}</b></div>
      <div className="pw-tg-chat">
        {(t.chat || []).map((c, i) => <span key={i} className={cx('pw-tg-p', c.men ? 'men' : 'bot')}>{c.t}</span>)}
      </div>
      <button type="button" className={cx('pw-bot', halqa(t.botHalqa))} disabled={!t.onBot} onClick={t.onBot}>{tr({ uz: 'Botga yozish', ru: 'Написать боту' })}</button>
    </div>
  );
  if (t.ekran === 'xizmatSahifa') return (
    <div className="pw-xs">
      <div className="pw-br-bar"><code>{tr(TOLOV_SAHNA.boshqaServer)}</code></div>
      <div className="pw-xs-tana"><b>{tr(TOLOV_SAHNA.xizmatSahifa)}</b><span className="pw-xs-y">{tr(TOLOV_SAHNA.kartaQoladi)}</span></div>
    </div>
  );
  if (t.ekran === 'ilova') return (
    <div className="pw-ilova">
      <span className="pw-tag">{tr(TOLOV_SAHNA.ilova)}</span>
      <b className="pw-il-nom" style={{ color: MAYDON_RANG }}>Maydon Jamoa</b>
      <span className="pw-il-oyin">{tr(TOLOV_SAHNA.oyin)}</span>
      <span className={cx('pw-il-btn', t.ilovaYon && 'yon')}>{tr(TOLOV_SAHNA.tolovgaOtish)}</span>
      <span className="pw-il-test">{tr({ uz: 'Test rejim: pul yechilmaydi', ru: 'Тестовый режим: деньги не списываются' })}</span>
      {t.brauzerOchiq && <div className="pw-il-br"><span className="pw-tag">{tr(TOLOV_SAHNA.brauzer)}</span><b>{tr(MASHQ_SAHIFA.sarlavha)}</b><span className="pw-m-test">{tr(MASHQ_SAHIFA.test)}</span></div>}
    </div>
  );
  return (
    <>
      <div className="pw-br-bar"><code>{manzilWbr(TOLOV_SAHNA.manzil)}</code></div>
      <MashqSahifa t={t} />
    </>
  );
};
// Telefon — o'lchami barqaror 170×272 hamma ekranda (SABOQ 22), yorliq ramka ustida (SABOQ 23)
const Telefon = ({ t = {} }) => (
  <div className={cx('pw-tel-ust', t.xira && 'xira', t.halqa && 'pw-joriy')}>
    <span className="pw-tel-yorliq">{tr(t.ekran === 'telegram' ? TOLOV_SAHNA.telTg : TOLOV_SAHNA.telYorliq)}</span>
    <div className="pw-telefon"><div className="pw-tel-ekran" key={t.ekran || 'mashq'}><TelEkran t={t} /></div></div>
    <Qadam q={t.qadam} />
    {t.osti}
  </div>
);
const XizmatTugun = ({ x }) => (
  <div className="pw-x-ust">
    <div className={cx('pw-xizmat', x.tugildi && 'tugildi', x.halqa && 'pw-joriy', x.ichida && 'ichida', x.server && 'server')} key={x.kalit || 'x'}>
      <b className="pw-x-nom" style={x.rang ? { color: x.rang } : undefined}>{tr(x.nom || TOLOV_SAHNA.xizmat)}</b>
      {x.izoh !== null && <span className="pw-x-izoh">{tr(x.izoh || TOLOV_SAHNA.xizmatIzoh)}</span>}
      {x.qulf && <span className="pw-qulf"><QulfIc /><code>TOLOV_KALITI</code></span>}
      {x.qator && <span className="pw-hisob fade-step">{x.qator}</span>}
      {x.soat && <span className={cx('pw-soat', x.soat)}><SoatIc yur={x.soat === 'kut'} /></span>}
      {x.yorliq && <span key={x.yorliq.tur} className={cx('pw-x-yorliq', x.yorliq.tur)}>{tr(x.yorliq.t)}</span>}
    </div>
    <Qadam q={x.qadam} />
    {x.osti}
  </div>
);
const MiniJadval = ({ j }) => (
  <div className="pw-jadval">
    <div className="pw-j-bosh"><code>tolovlar</code><span key={j.qatorlar.length} className={cx('pw-j-son', j.yangi != null && 'pw-pop')}>{tr(TOLOV_SAHNA.qatorSoni(j.qatorlar.length))}</span></div>
    <div className="pw-j-sar"><span>tolov_raqami</span><span>holat</span></div>
    {j.qatorlar.map((q, i) => <div key={i + q.r} className={cx('pw-j-q', q.tur, j.yangi === i && 'yangi')}><span>{q.r}</span><span>{q.h}</span></div>)}
    {j.izoh && <span className="pw-j-izoh err fade-step">{tr(j.izoh)}</span>}
  </div>
);
const XabarOchiq = ({ x }) => (
  <div className="pw-xabar fade-step">
    {xabarQatorlar(x).map((s, i) => <code key={i} className={cx(x.ajrat && s.startsWith(x.ajrat) && 'ajrat')}>{s}</code>)}
    {x.imzo ? <code className="pw-xb-imzo">X-Imzo: {x.imzo}</code> : <code className="pw-xb-imzo yoq">X-Imzo: —</code>}
  </div>
);
const BackendTugun = ({ b = {} }) => (
  <div className="pw-be-ust">
    <div className={cx('pw-backend', b.halqa && 'pw-joriy', b.silk && 'silk', b.tugildi && 'tugildi')} key={b.kalit || 'b'}>
      <div className="pw-be-bosh">
        <b>{tr(b.nom || 'Backend')}</b>
        {b.yorliq && <code className="pw-be-url">{b.yorliq}</code>}
        {b.chiroq && <span key={b.chiroq} className={cx('pw-chiroq', b.chiroq)}><i />{tr(TOLOV_SAHNA.chiroq[b.chiroq])}</span>}
      </div>
      {b.ikkiQism && <div className="pw-be-qism fade-step"><span className="pw-qulf"><QulfIc /><code>TOLOV_KALITI · .env</code></span>
        <span className="pw-bq">{tr(MASHQ_SAHIFA.sarlavha)} <code>GET /tolov-mashq</code></span><span className="pw-bq"><code>POST /tolov/webhook</code></span></div>}
      {b.qulf && !b.ikkiQism && <span className="pw-qulf"><QulfIc /><code>TOLOV_KALITI · .env</code></span>}
      {b.xabar && <XabarOchiq x={b.xabar} />}
      {(b.qatorlar || []).map((q, i) => <span key={i + String(q.k || '')} className={cx('pw-be-q fade-step', q.tur)}>{tx(q.t)}</span>)}
      {b.jadval && <MiniJadval j={b.jadval} />}
      {b.ochirgich && <button type="button" className={cx('pw-takror', b.ochirgich.yoqiq && 'on', halqa(b.ochirgich.halqa))} disabled={!b.ochirgich.onClick} onClick={b.ochirgich.onClick} aria-pressed={!!b.ochirgich.yoqiq}><i />{tr(TOLOV_SAHNA.takror(b.ochirgich.yoqiq))}</button>}
    </div>
    <Qadam q={b.qadam} />
    {b.osti}
  </div>
);
// Konvert chiziq bo'ylab uchadi: yon 'ab' — chapdan o'ngga (yoki tepadan pastga), 'ba' — teskari; toxta 'sonadi' — yo'l o'rtasida so'nadi
const Konvert = ({ k, tik }) => {
  if (!k) return null;
  const anim = `pw-kv-${tik ? 'y' : 'x'}-${k.toxta === 'sonadi' ? (k.yon === 'ba' ? 'bs' : 'as') : k.yon}`;
  return <span className={cx('pw-kv', k.tur, k.soxta && 'soxta', k.rad && 'rad')} style={{ animationName: anim }}><i className="pw-kv-i" />{k.yorliq && <b className="pw-kv-y">{tr(k.yorliq)}</b>}</span>;
};
// Chiziq holatlari: bor · savol (uzuq, «?») · yonadi (bir marta yonadi) · yoq (ko'rinmas)
const Chiziq = ({ holat = 'bor', tik, k, yorliq, uz }) => (
  <div className={cx('pw-chiziq', tik ? 'tik' : 'yot', `h-${holat}`, uz && 'uz')}>
    <span className="pw-chiziq-i" key={holat} />
    {holat === 'savol' && <b className="pw-chiziq-s">?</b>}
    {yorliq && <b className="pw-chiziq-y">{tr(yorliq)}</b>}
    <Konvert key={k ? k.id : 'yoq'} k={k} tik={tik} />
  </div>
);
// Sahna: chapda telefon, o'rtada to'lov xizmati (yoki 2-ekran 1-qadamda Telegram), o'ngda Backend; 4-ekranda xizmat ostida «boshqa kompyuter».
// Telefonda (≤640) — ustma-ust: telefon, xizmat, Backend; chiziqlar tik (konvert tepadan pastga uchadi).
const TolovSahna = ({ tel, xizmat, backend, kompyuter, c1 = 'bor', c2 = 'bor', c3 = 'bor', k1, k2, k3, y2, y3, sinf, ost }) => {
  const mob = useIsMobile(640);
  const tik = mob;
  const xizmatYoq = !xizmat || xizmat.ichida;
  return (
    <div className={cx('pw-sahna', tik ? 'tik' : 'yot', xizmatYoq && 'xyoq', kompyuter && 'kmp', sinf)}>
      <div className="pw-s-tel"><Telefon t={tel} /></div>
      {xizmatYoq
        ? <div className="pw-s-c12"><Chiziq holat={c1} tik={tik} k={k1 || k2} yorliq={y2} uz /></div>
        : <>
          <div className="pw-s-c1"><Chiziq holat={c1} tik={tik} k={k1} /></div>
          <div className="pw-s-x"><XizmatTugun x={xizmat} />{tik && kompyuter && <div className={cx('pw-kompyuter', kompyuter.yon && 'yon')}><NoutbukIc /><span>{tr(TOLOV_SAHNA.kompyuter)}</span></div>}</div>
          <div className="pw-s-c2"><Chiziq holat={c2} tik={tik} k={k2 || (tik ? k3 : null)} yorliq={y2} /></div>
        </>}
      {kompyuter && !tik && <>
        <div className="pw-s-k"><div className={cx('pw-kompyuter', kompyuter.yon && 'yon')}><NoutbukIc /><span>{tr(TOLOV_SAHNA.kompyuter)}</span></div></div>
        <div className="pw-s-c3"><Chiziq holat={c3} tik={false} k={k3} yorliq={y3} /></div>
      </>}
      <div className="pw-s-be"><BackendTugun b={backend} /></div>
      {ost && <div className="pw-s-ost">{ost}</div>}
    </div>
  );
};

// Ballsiz bashorat: tanlangach ixcham qator bo'lib natijagacha turadi (SABOQ 11); har chipning o'z yengil chegarasi (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="pw-halqa-g"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="pw-bash-ix fade-step"><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosaning birinchi kichik qatori; QIzoh — oxirgi kichik qatori (E 42)
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="pw-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="pw-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="pw-x-m">{matn}</span>{izoh && <span className="pw-x-iz">{izoh}</span>}</>;
const navYorliq = (taxmin, q, jami, qadamY, done) => (done ? { uz: 'Davom etish', ru: 'Продолжить' }
  : !taxmin ? BASH_YORLIQ
    : { uz: `${qadamY.uz} (${q}/${jami})`, ru: `${qadamY.ru} (${q}/${jami})` });
const QADAMLAR_Y = { uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' };
const NomQator = ({ matn }) => (matn ? <p className="pw-nom fade-step" key={ou(matn).slice(0, 12)}>{tx(matn)}</p> : null);
const Ustoz = ({ satrlar }) => (useMentorLive() ? <div className="pw-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div> : null);
const jadvalQ = (r, h, tur) => ({ r, h, tur: tur || (h === 'rad' ? 'rad' : undefined) });

// ===== SCREEN 0 — KIRISH (QKirish): «To'lash (mashq)» → «To'landi (mashq)», Backend jim («?»); javobdan keyin xizmat tuguni tug'iladi va konvert uchadi =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Ilova Backend'ga «to'landi» deb yozadi", ru: 'Приложение пишет Backend «оплачено»' } },
  { id: 'b', label: { uz: "To'lov xizmati Backend'ga o'zi yozadi", ru: 'Платёжный сервис сам пишет Backend' } },
  { id: 'c', label: { uz: "Backend xizmatdan har daqiqa so'raydi", ru: 'Backend каждую минуту спрашивает сервис' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> 7-Modulda botingizga Telegram xabarni o'zi yuborardi — bu yerda xabarni to'lov xizmati yuboradi.</>, ru: <><b>Именно!</b> В 7-м модуле Telegram сам отправлял сообщение вашему боту — здесь сообщение отправляет платёжный сервис.</> },
  a: { uz: <><b>Qiziq fikr!</b> Ilova faqat sahifani ochadi, pulni ko'rmaydi. Uning gapiga ishonsak, to'lamagan ham «to'landi» deya oladi.</>, ru: <><b>Интересная мысль!</b> Приложение только открывает страницу и денег не видит. Если верить ему, «оплачено» скажет и тот, кто не платил.</> },
  c: { uz: <><b>Qiziq fikr!</b> So'rab turish ham yo'l, lekin Mentor misolida xizmat Backend'ga o'zi yozadi — so'rash shart emas.</>, ru: <><b>Интересная мысль!</b> Спрашивать тоже можно, но в примере Ментора сервис сам пишет Backend — спрашивать не нужно.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [tolandi, setTolandi] = useState(avval);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [xizmat, setXizmat] = useState(avval);
  const [k2, setK2] = useState(null);
  const [c1, setC1] = useState('bor');
  const [qator, setQator] = useState(avval ? 1 : 0);
  const [sc, setSc] = useState(0);
  const ketma = useKetma();
  const tolash = () => { if (tolandi) return; setTolandi(true); setSc(n => n + 1); };
  const pick = (v) => {
    if (picked !== null || !tolandi) return;
    setPicked(v); setSc(n => n + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    ketma([[350, () => { setXizmat(true); setC1('yonadi'); }], [700, () => setK2({ id: 'h', tur: 'xabar', yon: 'ab', yorliq: 'POST /tolov/webhook' })], [950, () => { setK2(null); setQator(1); }]]);
  };
  const javob = picked !== null;
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!javob} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('pw-k', tolandi && !javob && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>To'lov o'tdi — Backend buni <span className="italic" style={{ color: T.accent }}>qayerdan biladi?</span></>, ru: <>Платёж прошёл — <span className="italic" style={{ color: T.accent }}>откуда Backend это знает?</span></> })}
          mentor={<Mentor>{tolandi
            ? tr({ uz: "Endi o'ngdagi javoblardan birini tanlang.", ru: 'Теперь выберите один из ответов справа.' })
            : tr({ uz: "Mentor misolida tashkilotchi brauzerda to'lov sahifasini ochgan — «To'lash (mashq)» ni bosing.", ru: 'В примере Ментора организатор открыл страницу оплаты в браузере — нажмите «Оплатить (учебно)».' })}</Mentor>}
          maket={<TolovSahna sinf="ixcham kvyashir"
            tel={{ holat: tolandi ? 'tolandi' : null, onTolash: tolandi ? null : tolash, tolashHalqa: !tolandi }}
            xizmat={xizmat ? { tugildi: true, izoh: TOLOV_SAHNA.xizmatIzoh0 } : null}
            backend={{ jadval: { qatorlar: qator ? [jadvalQ('m-101', 'tolandi')] : [], yangi: qator && !avval ? 0 : null } }}
            c1={xizmat ? c1 : (tolandi && !qator ? 'savol' : 'bor')} c2="bor" k2={k2} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={!tolandi}
          javob={javob && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda dars oxiridagi holat — konvert bir marta o'zi uchadi, qator kiradi, `200` qaytadi; o'ngda «01 · matn · teg» =====
const REJA = [
  { t: { uz: 'Xabar kimdan kelganini tekshirish', ru: 'Проверить, от кого пришло сообщение' }, teg: { uz: 'imzo', ru: 'подпись' } },
  { t: { uz: "Bitta to'lovni bir marta yozish", ru: 'Записать один платёж один раз' }, teg: { uz: 'takror xabar', ru: 'повторное сообщение' } },
  { t: { uz: "O'tmagan to'lovni ajratish", ru: 'Отделить непрошедший платёж' }, teg: { uz: "rad etilgan to'lov", ru: 'отклонённый платёж' } },
  { t: { uz: "O'z Backend'ingizda mashq to'lov bilan tekshirish", ru: 'Проверить на своём Backend учебной оплатой' }, teg: { uz: 'test rejim', ru: 'тестовый режим' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [k2, setK2] = useState(null);
  const [qator, setQator] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[700, () => setK2({ id: 'x', tur: 'xabar', yon: 'ab', yorliq: 'POST /tolov/webhook' })], [950, () => { setK2(null); setQator(1); }], [600, () => setK2({ id: 'j', tur: 'javob', yon: 'ba', yorliq: '200' })], [950, () => setK2(null)]]); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun Backend'ingiz <span className="italic" style={{ color: T.accent }}>mashq to'lovni</span> qabul qiladi.</>, ru: <>Сегодня ваш Backend <span className="italic" style={{ color: T.accent }}>примет учебную оплату</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z Backend'ingizda qilasiz. Pul yechilmaydi: bu kursda to'lov — mashq.", ru: 'Каждый шаг вы сначала увидите на примере «Maydon Jamoa», потом сделаете на своём Backend. Деньги не списываются: на этом курсе оплата — учебная.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="pw-reja-chap"><TolovSahna sinf="ixcham kvyashir"
          tel={{ holat: 'tolandi' }} xizmat={{ izoh: TOLOV_SAHNA.xizmatIzoh0 }}
          backend={{ jadval: { qatorlar: qator ? [jadvalQ('m-101', 'tolandi')] : [], yangi: qator ? 0 : null } }} k2={k2} />
          <span className="pw-readme"><b>README.md</b><span>{tr({ uz: "«To'lov» · 5 qator", ru: '«To\'lov» · 5 строк' })}</span></span></div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <p className="pw-reja-past">{tx({ uz: "o'z repo'ngiz — `backend/` va `README.md` «To'lov» · Mentor misoli `maydon-jamoa` · tayyor holat `m13-dars-03-done`", ru: 'ваш репозиторий — `backend/` и `README.md` «To\'lov» · пример Ментора `maydon-jamoa` · готовое состояние `m13-dars-03-done`' })}</p>
        <Ustoz satrlar={[
          { uz: "Darsning og'ir qismi — 8-ekran (kod oynasi) va ikki blok (har birida Render'da yangi versiya kutiladi). 3, 12-ekranlarga ortiqcha vaqt bermang. Vaqt yetmasa A2 uyga vazifaning 1-bandiga o'tadi; sxema 14-ekranda saqlanadi.", ru: 'Тяжёлая часть урока — экран 8 (окно кода) и два блока (в каждом ждём новую версию на Render). Не тратьте лишнее время на экраны 3 и 12. Если не хватит времени, A2 уходит в пункт 1 домашнего задания; схема сохраняется на экране 14.' },
          { uz: "Pul chegarasi: darsda hech kim haqiqiy to'lov xizmatiga ro'yxatdan o'tmaydi, karta ma'lumotini yozmaydi va hech kimga ko'rsatmaydi; mashq sahifasi karta so'ramaydi. O'quvchi «Payme ulasam bo'ladimi?» desa — 11-ekrandagi halol gap: real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan (FK 27-modda, lex.uz/docs/-111189); bu kursda emas.", ru: 'Денежная граница: на уроке никто не регистрируется в настоящем платёжном сервисе, не пишет и никому не показывает данные карты; учебная страница карту не запрашивает. Если ученик спросит «Можно подключить Payme?» — честная фраза с экрана 11: реальный запуск — с письменного согласия родителей и через юрлицо или ИП (ГК, ст. 27, lex.uz/docs/-111189); не на этом курсе.' },
          { uz: "Uxlagan Backend'ni ataylab buzish — 5-darsning ishi (o'quvchiga va'da qilinmaydi).", ru: 'Намеренно ломать спящий Backend — задача 5-го урока (ученикам не обещаем).' }
        ]} />
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · to'lov xabari (bashorat + 2 qadam): 7-Modul olami (Telegram · botingiz) → yorliqlar almashadi → to'lov xabari =====
const S2_TAXMIN = [{ k: 'tel', t: { uz: 'Tashkilotchining telefoniga', ru: 'На телефон организатора' } }, { k: 'manzil', t: { uz: "Backend'ning ochiq manziliga", ru: 'На открытый адрес Backend' } }, { k: 'db', t: { uz: "To'g'ridan-to'g'ri Database'ga", ru: 'Прямо в Database' } }];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [olam, setOlam] = useState(avval ? 'tolov' : 'tg');
  const [chat, setChat] = useState([]);
  const [k1, setK1] = useState(null);
  const [k2, setK2] = useState(null);
  const [holat, setHolat] = useState(avval ? 'tolandi' : null);
  const [xabar, setXabar] = useState(avval);
  const [qator, setQator] = useState(avval ? 1 : 0);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1100, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bot = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setChat([{ men: true, t: 'Salom!' }]);
    ketma([[250, () => setK1({ id: 'a', tur: 'xabar', yon: 'ab' })], [900, () => { setK1(null); setK2({ id: 'b', tur: 'xabar', yon: 'ab', yorliq: TOLOV_SAHNA.botManzil }); }],
      [950, () => setK2({ id: 'c', tur: 'javob', yon: 'ba', yorliq: '200' })], [900, () => { setK2(null); setK1({ id: 'd', tur: 'javob', yon: 'ba' }); }],
      [850, () => { setK1(null); setChat(c => [...c, { men: false, t: '✓' }]); setQ(1); }], [1500, () => { setOlam('tolov'); setBand(false); }]]);
  };
  const tolash = () => {
    if (q !== 1 || band || olam !== 'tolov') return;
    setBand(true); setHolat('tolandi');
    ketma([[400, () => setK2({ id: 'e', tur: 'xabar', yon: 'ab', yorliq: 'POST /tolov/webhook' })], [950, () => { setK2(null); setXabar(true); }],
      [900, () => setQator(1)], [700, () => setK2({ id: 'f', tur: 'javob', yon: 'ba', yorliq: '200' })], [950, () => { setK2(null); setQ(2); setBand(false); }]]);
  };
  const tg = olam === 'tg';
  const togri = taxmin === 'manzil';
  const nom = q === 0 ? null : tg || q === 1 && !xabar ? { uz: '7-Modulda: Telegram yangi xabarni botingiz manziliga o\'zi yuboradi — bu webhook.', ru: 'В 7-м модуле: Telegram сам отправляет новое сообщение на адрес вашего бота — это webhook (вебхук).' }
    : { uz: "To'lov xizmati Backend'ga yuboradigan xabar — to'lov xabari; texnik nomi webhook.", ru: 'Сообщение, которое платёжный сервис отправляет Backend, — сообщение о платеже; техническое название webhook.' };
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · to'lov xabari", ru: 'Понятие · сообщение о платеже' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, QADAMLAR_Y, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Xizmat xabarni Backend'ning <span className="italic" style={{ color: T.accent }}>qayeriga</span> yuboradi?</>, ru: <>Куда именно в Backend сервис <span className="italic" style={{ color: T.accent }}>отправляет сообщение</span>?</> })}
        mentor={<Mentor>{tr(q === 0 ? { uz: "7-Modulda Telegram yangi xabarni botingiz manziliga o'zi yuborardi — avval «Botga yozish» ni bosib, o'shani eslang.", ru: 'В 7-м модуле Telegram сам отправлял новое сообщение на адрес вашего бота — сначала нажмите «Написать боту» и вспомните это.' }
          : { uz: "Endi xuddi shu yo'lni to'lov bilan ko'ring — «To'lash (mashq)» ni bosing.", ru: 'Теперь посмотрите тот же путь с оплатой — нажмите «Оплатить (учебно)».' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "To'lov xizmati xabarni qayerga yuboradi?", ru: 'Куда платёжный сервис отправляет сообщение?' }} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="pw-viz">
          <TolovSahna
            tel={tg ? { ekran: 'telegram', chat, onBot: taxmin && q === 0 && !band ? bot : null, botHalqa: !!taxmin && q === 0 && !band, qadam: taxmin && q === 0 && !band ? { n: 1, t: { uz: 'Botga yozing', ru: 'Напишите боту' } } : null }
              : { holat, onTolash: q === 1 && !band && !tugadi ? tolash : null, tolashHalqa: q === 1 && !band, qadam: q === 1 && !band && !tugadi ? { n: 2, t: { uz: "To'lang", ru: 'Оплатите' } } : null }}
            xizmat={tg ? { nom: TOLOV_SAHNA.telegram, izoh: null, kalit: 'tg' } : { kalit: 'tolov', tugildi: !avval }}
            backend={tg ? { nom: TOLOV_SAHNA.botingiz, yorliq: TOLOV_SAHNA.botManzil, kalit: 'tg' }
              : { kalit: 'tolov', tugildi: !avval, xabar: xabar && NAMUNA_XABAR, jadval: { qatorlar: qator ? [jadvalQ('m-101', 'tolandi')] : [], yangi: qator && !avval ? 0 : null } }}
            k1={k1} k2={k2} />
          {<NomQator matn={nom} />}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={togri} haqiqat={{ uz: "Backend'ning ochiq manziliga", ru: 'на открытый адрес Backend' }} />}
          matn={tx({ uz: "Ilova so'ramaydi: to'lov xizmati xabarni Backend manziliga o'zi yuboradi, Backend `200` bilan javob beradi.", ru: 'Приложение не спрашивает: платёжный сервис сам отправляет сообщение на адрес Backend, Backend отвечает `200`.' })}
          izoh={tx({ uz: "`200` — «qabul qildim» degan javob; `summa` so'mda, 10\u00a0000 — Mentorning taxmini.", ru: '`200` — ответ «принял»; `summa` в сумах, 10\u00a0000 — оценка Ментора.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen; INLINE_KEYS.s3 = 2, C) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Mentor misolida to'lov o'tganini Backend kimdan biladi?"
    question={tr({ uz: <h2 className="title h-ask">Mentor misolida to'lov o'tganini Backend <span className="italic" style={{ color: T.accent }}>kimdan biladi?</span></h2>, ru: <h2 className="title h-ask">В примере Ментора от кого Backend <span className="italic" style={{ color: T.accent }}>узнаёт об оплате?</span></h2> })}
    options={[
      { uz: 'Tashkilotchining ilovasidan', ru: 'Из приложения организатора' },
      { uz: 'Tashkilotchining SMS xabaridan', ru: 'Из SMS организатора' },
      { uz: "To'lov xizmatining xabaridan", ru: 'Из сообщения платёжного сервиса' },
      { uz: "Database'ning o'z yozuvidan", ru: 'Из собственной записи Database' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Mentor misolida to'lov xizmati to'lov xabarini Backend manziliga o'zi yuboradi.", ru: 'В примере Ментора платёжный сервис сам отправляет сообщение о платеже на адрес Backend.' }}
    explainWrong={{
      0: { uz: "Ilova faqat sahifani ochadi — pulni kim ko'radi?", ru: 'Приложение только открывает страницу — кто видит деньги?' },
      1: { uz: "SMS telefonga keladi — Backend'ga-chi?", ru: 'SMS приходит на телефон — а в Backend?' },
      3: { uz: 'Database faqat yozilganni biladi — yozuvni kim boshlaydi?', ru: 'Database знает только записанное — кто начинает запись?' },
      default: { uz: "Ilova faqat sahifani ochadi — pulni kim ko'radi?", ru: 'Приложение только открывает страницу — кто видит деньги?' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA · imzo (bashorat + 2 qadam; kod kartasi sahna ostida — E 46) =====
const S4_TAXMIN = [{ k: 'yozadi', t: { uz: "Backend uni to'lov deb yozadi", ru: 'Backend запишет его как платёж' } }, { k: 'ajratadi', t: { uz: 'Backend uni ajratib, yozmaydi', ru: 'Backend отличит его и не запишет' } }];
const IMZO_KOD = [
  "const kutilgan = createHmac('sha256', process.env.TOLOV_KALITI)",
  '  .update(tana)',
  "  .digest('hex');",
  'if (imzo !== kutilgan) throw new UnauthorizedException(); // 401'
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [xQator, setXQator] = useState(null);
  const [bQator, setBQator] = useState(avval ? [{ k: 'm', t: { uz: 'tana + kalit → b04e… · mos emas ✗', ru: 'тело + ключ → b04e… · не совпадает ✗' }, tur: 'err' }] : []);
  const [k2, setK2] = useState(null);
  const [k3, setK3] = useState(null);
  const [ifH, setIfH] = useState(avval ? 'err' : null);
  const ifRef = useRef(null);
  const [silk, setSilk] = useState(false);
  const [kmp, setKmp] = useState(false);
  const [qatorlar, setQatorlar] = useState(avval ? [jadvalQ('m-101', 'tolandi'), jadvalQ('m-102', 'tolandi')] : [jadvalQ('m-101', 'tolandi')]);
  const [yangi, setYangi] = useState(null);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const haqiqiy = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setXQator('tana + kalit → 3f9a…');
    ketma([[700, () => setK2({ id: 'h', tur: 'xabar', yon: 'ab', yorliq: 'm-102 · X-Imzo: 3f9a…' })], [950, () => { setK2(null); setBQator([{ k: 'h', t: { uz: 'tana + kalit → 3f9a…', ru: 'тело + ключ → 3f9a…' } }]); }],
      [700, () => { setBQator([{ k: 'h2', t: { uz: 'tana + kalit → 3f9a… · mos ✓', ru: 'тело + ключ → 3f9a… · совпадает ✓' }, tur: 'ok' }]); setIfH('ok'); }],
      [700, () => { setQatorlar(r => [...r, jadvalQ('m-102', 'tolandi')]); setYangi(1); }], [600, () => setK2({ id: 'j', tur: 'javob', yon: 'ba', yorliq: '200' })],
      [950, () => { setK2(null); setXQator(null); setQ(1); setBand(false); }]]);
  };
  const soxta = () => {
    if (q !== 1 || band) return;
    setBand(true); setKmp(true); setIfH(null); setYangi(null);
    ketma([[300, () => setK3({ id: 's', tur: 'xabar', yon: 'ab', soxta: true, yorliq: "m-999 · X-Imzo: —" })], [950, () => { setK3(null); setBQator([{ k: 's', t: { uz: 'tana + kalit → b04e…', ru: 'тело + ключ → b04e…' } }]); }],
      [700, () => { setBQator([{ k: 's2', t: { uz: 'tana + kalit → b04e… · mos emas ✗', ru: 'тело + ключ → b04e… · не совпадает ✗' }, tur: 'err' }]); setIfH('err'); setSilk(true); }],
      [600, () => setK3({ id: 'r', tur: 'javob', rad: true, yon: 'ba', yorliq: '401' })], [950, () => { setK3(null); setSilk(false); setKmp(false); setQ(2); setBand(false); }]]);
  };
  const togri = taxmin === 'ajratadi';
  // Haqiqiy/Soxta bosilganda kod kartasidagi if qatori ko'rinsin (B1): rang tushganda unga yaqin skroll (faqat sahna yurganda)
  useEffect(() => { if (ifH && band && ifRef.current) ifRef.current.scrollIntoView({ block: 'nearest', behavior: kamHarakat() ? 'auto' : 'smooth' }); }, [ifH]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · imzo', ru: 'Понятие · подпись' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, { uz: 'Ikkalasini yuboring', ru: 'Отправьте оба' }, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Soxta «to'landi» xabarini Backend <span className="italic" style={{ color: T.accent }}>qanday ajratadi?</span></>, ru: <>Как Backend <span className="italic" style={{ color: T.accent }}>отличает</span> поддельное «оплачено»?</> })}
        mentor={<Mentor>{tr({ uz: "Backend manzili internetda ochiq — avval «Haqiqiy xabar» ni, keyin «Soxta xabar» ni yuboring.", ru: 'Адрес Backend открыт в интернете — сначала отправьте «Настоящее сообщение», потом «Поддельное сообщение».' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "Manzilni bilgan begona odam «to'landi» deb yozsa, nima bo'ladi?", ru: 'Что будет, если посторонний, знающий адрес, напишет «оплачено»?' }} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className={cx('pw-viz', tugadi && 'pw-v-yakun')}>
          <TolovSahna sinf="imzo"
            tel={{ xira: true, holat: 'tolandi' }}
            xizmat={{ qulf: true, qator: xQator }}
            kompyuter={{ yon: kmp }}
            backend={{ qulf: true, silk, qatorlar: bQator, jadval: { qatorlar, yangi } }}
            k2={k2} k3={k3} y2={TOLOV_SAHNA.birKalit} />
          <div className="pw-ost">
          {!tugadi && <div className="pw-harakat tik">
            <button type="button" className={cx('pw-sb pw-haqiqiy', halqa(!!taxmin && q === 0 && !band))} disabled={!taxmin || q !== 0 || band} onClick={haqiqiy}>{tr({ uz: 'Haqiqiy xabar', ru: 'Настоящее сообщение' })}</button>
            <button type="button" className={cx('pw-sb pw-soxta', halqa(q === 1 && !band))} disabled={q !== 1 || band} onClick={soxta}>{tr({ uz: 'Soxta xabar', ru: 'Поддельное сообщение' })}</button>
            <Qadam q={taxmin && !band && q < 2 ? (q === 0 ? { n: 1, t: { uz: 'Haqiqiy xabar', ru: 'Настоящее сообщение' } } : { n: 2, t: { uz: 'Soxta xabar', ru: 'Поддельное сообщение' } }) : null} />
          </div>}
          {tugadi && <div className="pw-ikki fade-step"><span className="ok">{tr({ uz: 'mos ✓ · ', ru: 'совпадает ✓ · ' })}<code>200</code></span><span className="err">{tr({ uz: 'mos emas ✗ · ', ru: 'не совпадает ✗ · ' })}<code>401</code></span></div>}
          <div className="pw-kod">
            <span className="pw-kod-y"><code>backend</code> · {tr({ uz: 'imzo tekshiruvi', ru: 'проверка подписи' })}</span>
            <pre className="pw-kod-tana">{IMZO_KOD.map((l, i) => <span key={i} ref={i === 3 ? ifRef : undefined} className={cx(i === 3 && ifH)}>{l}</span>)}</pre>
            <span className="pw-kod-iz">{tx({ uz: "`TOLOV_KALITI` — `.env` da, kodda faqat nomi; `imzo` — `X-Imzo` sarlavhasidan, `tana` — kelgan xabar matni.", ru: '`TOLOV_KALITI` — в `.env`, в коде только имя; `imzo` — из заголовка `X-Imzo`, `tana` — текст пришедшего сообщения.' })}</span>
            <span className="pw-kod-iz">{tr({ uz: "Bu — qisqa ko'rinish: repo'da imzolar xavfsiz usulda solishtiriladi.", ru: 'Это короткий вид: в репозитории подписи сравниваются безопасным способом.' })}</span>
          </div>
          </div>
          {<NomQator matn={done ? { uz: "Xabar maxfiy kalitni biladigan tomondan kelganini ko'rsatadigan belgi — imzo: xizmat uni kalit bilan hisoblaydi, Backend qayta hisoblab solishtiradi.", ru: 'Знак, показывающий, что сообщение пришло от стороны, знающей секретный ключ, — подпись: сервис вычисляет её с ключом, Backend вычисляет заново и сравнивает.' } : null} />}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={togri} haqiqat={{ uz: 'Backend uni ajratib, yozmaydi', ru: 'Backend отличит его и не запишет' }} />}
          matn={tr({ uz: 'Bu misolda kalit xabar ichida ketmaydi: faqat imzo ketadi, Backend uni o\'zidagi kalit bilan qayta hisoblaydi.', ru: 'В этом примере ключ внутри сообщения не идёт: идёт только подпись, Backend пересчитывает её своим ключом.' })}
          izoh={tx({ uz: "Imzo xabar kalitni biladigan tomondan kelganini ko'rsatadi; to'lov o'tgan-o'tmaganini esa `holat` aytadi.", ru: 'Подпись показывает, что сообщение пришло от стороны, знающей ключ; а прошёл ли платёж — говорит `holat`.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "Imzo — hisob (HMAC SHA-256), qo'l imzosiga o'xshatilmaydi (darsda metafora yo'q). Repo'da imzolar `timingSafeEqual` bilan solishtiriladi — kartadagi `!==` o'qish uchun qisqartirilgan.", ru: 'Подпись — вычисление (HMAC SHA-256), с подписью от руки не сравниваем (на уроке без метафор). В репозитории подписи сравниваются через `timingSafeEqual` — `!==` на карточке сокращён для чтения.' },
          { uz: "Imzo «aynan shu kompaniya yubordi» demaydi: kalitni bilgan har kim imzolay oladi (shu darsdagi mashq sahifasi ham) — shuning uchun kalit faqat ikki joyda turadi.", ru: 'Подпись не говорит «отправила именно эта компания»: подписать может любой, кто знает ключ (и учебная страница этого урока) — поэтому ключ хранится только в двух местах.' },
          { uz: "7-Moduldagi bot haqida so'rashsa: Telegram ham webhook so'roviga `X-Telegram-Bot-Api-Secret-Token` sarlavhasini qo'shadi — `setWebhook` da `secret_token` berilgan bo'lsa; 7-Modul botida bu qo'yilmagan.", ru: 'Если спросят про бота из 7-го модуля: Telegram тоже добавляет к запросу webhook заголовок `X-Telegram-Bot-Api-Secret-Token` — если в `setWebhook` задан `secret_token`; в боте 7-го модуля это не задано.' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 0, A) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Imzosiz «to'landi» xabari keldi. Mentor Backend'i nima qiladi?"
    question={tr({ uz: <h2 className="title h-ask">Imzosiz «to'landi» xabari keldi. Mentor Backend'i <span className="italic" style={{ color: T.accent }}>nima qiladi?</span></h2>, ru: <h2 className="title h-ask">Пришло «оплачено» без подписи. Что <span className="italic" style={{ color: T.accent }}>сделает Backend Ментора?</span></h2> })}
    options={[
      { uz: '`401` qaytaradi, hech narsa yozmaydi', ru: 'вернёт `401`, ничего не запишет' },
      { uz: "`200` qaytaradi, to'lovni yozib qo'yadi", ru: 'вернёт `200`, запишет платёж' },
      { uz: "`401` qaytaradi, to'lovni baribir yozadi", ru: 'вернёт `401`, но платёж всё равно запишет' },
      { uz: '`200` qaytaradi, qatorni «rad» deb yozadi', ru: 'вернёт `200`, запишет строку как «rad»' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Imzo mos kelmasa, Backend `401` qaytaradi va `tolovlar` ga hech narsa yozilmaydi.", ru: 'Если подпись не совпала, Backend возвращает `401`, и в `tolovlar` ничего не записывается.' }}
    explainWrong={{
      1: { uz: "Imzo tekshirilmasa, soxta xabar ham to'lov bo'lib qoladi.", ru: 'Если не проверять подпись, поддельное сообщение тоже станет платежом.' },
      2: { uz: 'Qator yozilsa, soxta xabar baribir jadvalda qoladi.', ru: 'Если строка записана, поддельное сообщение всё равно осталось в таблице.' },
      3: { uz: '«Rad» — xizmat aytadigan holat; bu xabar xizmatdan emas.', ru: '«rad» — статус от сервиса; это сообщение не от сервиса.' },
      default: { uz: "Imzo tekshirilmasa, soxta xabar ham to'lov bo'lib qoladi.", ru: 'Если не проверять подпись, поддельное сообщение тоже станет платежом.' }
    }} />
);

// ===== SCREEN 6 — TUSHUNCHA · takror xabar (bashorat + 3 qadam): uxlagan Backend, javob yo'lda so'nadi, xizmat qayta yuboradi; «Takror tekshiruvi» bilan qayta yuradi =====
const S6_TAXMIN = [{ k: 'yoq', t: { uz: 'Xabarni boshqa yubormaydi', ru: 'Больше не отправит сообщение' } }, { k: 'qayta', t: { uz: 'Xabarni qayta yuboradi', ru: 'Отправит сообщение повторно' } }];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [band, setBand] = useState(false);
  const [holat, setHolat] = useState(avval ? 'tolandi' : null);
  const [chiroq, setChiroq] = useState(avval ? 'uygoq' : 'uxlayapti');
  const [soat, setSoat] = useState(avval ? null : 'kut');
  const [xYorliq, setXYorliq] = useState(avval ? { t: TOLOV_SAHNA.qabulQilindi, tur: 'ok' } : null);
  const [qatorlar, setQatorlar] = useState(avval ? [jadvalQ('m-101', 'tolandi')] : []);
  const [yangi, setYangi] = useState(null);
  const [izoh, setIzoh] = useState(null);
  const [bQator, setBQator] = useState([]);
  const [yoqiq, setYoqiq] = useState(avval);
  const [k2, setK2] = useState(null);
  const ketma = useKetma();
  const done = q >= 3;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const yozildi = (birinchi) => { setQatorlar(r => [...r, jadvalQ('m-101', 'tolandi')]); setYangi(birinchi ? 0 : 1); };
  // 1-qadam: birinchi xabar yoziladi, javob yo'lda so'nadi
  const birinchiYol = (keyin) => [
    [350, () => setK2({ id: 'x1' + keyin, tur: 'xabar', yon: 'ab', yorliq: 'm-101' })], [950, () => { setK2(null); setChiroq('uygonmoqda'); }],
    [1900, () => { setChiroq('uygoq'); yozildi(true); }], [600, () => setK2({ id: 'j1' + keyin, tur: 'javob', yon: 'ba', toxta: 'sonadi', yorliq: '200' })],
    [800, () => { setK2(null); setSoat('toxta'); setXYorliq({ t: TOLOV_SAHNA.javobKelmadi, tur: 'err' }); }]
  ];
  const tolash = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setHolat('tolandi');
    ketma([...birinchiYol('a'), [300, () => { setQ(1); setBand(false); }]]);
  };
  const kuting = () => {
    if (q !== 1 || band) return;
    setBand(true); setXYorliq(null); setSoat('kut');
    ketma([[300, () => setK2({ id: 'x2', tur: 'xabar', yon: 'ab', yorliq: 'm-101' })], [950, () => { setK2(null); yozildi(false); }],
      [600, () => { setQatorlar(r => r.map(x => ({ ...x, tur: 'err' }))); setIzoh(TOLOV_SAHNA.ikkiQator); setSoat(null); }], [400, () => { setQ(2); setBand(false); }]]);
  };
  const yoq = () => {
    if (q !== 2 || band) return;
    setBand(true); setYoqiq(true);
    ketma([[500, () => { setQatorlar([]); setIzoh(null); setYangi(null); setChiroq('uxlayapti'); setSoat('kut'); setXYorliq(null); setBQator([]); }], ...birinchiYol('b'),
      [500, () => { setXYorliq(null); setSoat('kut'); setK2({ id: 'x3', tur: 'xabar', yon: 'ab', yorliq: 'm-101' }); }], [950, () => { setK2(null); setYangi(null); setBQator([{ k: 'bor', t: { uz: 'm-101 — bor · yozilmaydi', ru: 'm-101 — есть · не записываем' }, tur: 'ok' }]); }],
      [700, () => setK2({ id: 'j3', tur: 'javob', yon: 'ba', yorliq: '200 { takror: true }' })], [950, () => { setK2(null); setSoat(null); setXYorliq({ t: TOLOV_SAHNA.qabulQilindi, tur: 'ok' }); setQ(3); setBand(false); }]]);
  };
  const togri = taxmin === 'qayta';
  const mGap = q === 0 ? { uz: "Mentor misolida Backend uxlab qolgan — «To'lash (mashq)» ni bosing va xizmatga qarang.", ru: 'В примере Ментора Backend уснул — нажмите «Оплатить (учебно)» и смотрите на сервис.' }
    : q === 1 ? { uz: "Xizmat javobni kutib qoldi — «Kuting» ni bosing.", ru: 'Сервис ждёт ответа — нажмите «Подождать».' }
      : { uz: "Bitta to'lov ikki marta yozildi — Backend ichidagi «Takror tekshiruvi» ni yoqing.", ru: 'Один платёж записан дважды — включите «Проверку повтора» внутри Backend.' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · takror xabar', ru: 'Понятие · повторное сообщение' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 3, QADAMLAR_Y, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mentor misolida xizmat javob olmasa, <span className="italic" style={{ color: T.accent }}>nima qiladi?</span></>, ru: <>Что делает сервис в примере Ментора, <span className="italic" style={{ color: T.accent }}>если не получил ответ?</span></> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: 'Javob kelmasa, xizmat nima qiladi?', ru: 'Что сделает сервис, если ответ не придёт?' }} variantlar={S6_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="pw-viz">
          <TolovSahna
            tel={{ holat, onTolash: taxmin && q === 0 && !band ? tolash : null, tolashHalqa: !!taxmin && q === 0 && !band, qadam: taxmin && q === 0 && !band ? { n: 1, t: { uz: "To'lang", ru: 'Оплатите' } } : null }}
            xizmat={{ soat, yorliq: xYorliq, qadam: q === 1 && !band && !tugadi ? { n: 2, t: { uz: 'Kuting', ru: 'Подождите' } } : null,
              osti: !tugadi && <button type="button" className={cx('pw-kuting', halqa(q === 1 && !band))} disabled={q !== 1 || band} onClick={kuting}>{tr({ uz: 'Kuting', ru: 'Подождать' })}</button> }}
            backend={{ chiroq, qatorlar: bQator, jadval: { qatorlar, yangi, izoh },
              ochirgich: tugadi ? null : { yoqiq, halqa: q === 2 && !band, onClick: q === 2 && !band ? yoq : null },
              qadam: q === 2 && !band && !tugadi ? { n: 3, t: { uz: 'Tekshiruvni yoqing', ru: 'Включите проверку' } } : null }}
            k2={k2} sinf={tugadi ? 'yakun6' : undefined} ost={tugadi && <div className="pw-ikki fade-step"><span className="err">{tr({ uz: 'tekshiruvsiz — 2 qator', ru: 'без проверки — 2 строки' })}</span><span className="ok">{tr({ uz: 'tekshiruv bilan — 1 qator', ru: 'с проверкой — 1 строка' })}</span></div>} />
          {<NomQator matn={q >= 2 ? { uz: "Bitta to'lov haqidagi xabar ikki marta kelishi — takror xabar.", ru: 'Когда сообщение об одном платеже приходит дважды — это повторное сообщение.' } : null} />}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={togri} haqiqat={{ uz: 'xabarni qayta yuboradi', ru: 'отправит сообщение повторно' }} />}
          matn={tx({ uz: "Bu misolda bitta to'lov raqami bir marta yoziladi; takrorga ham `200` qaytadi — xizmat qayta yubormasin.", ru: 'В этом примере один номер платежа записывается один раз; на повтор тоже возвращается `200` — чтобы сервис больше не отправлял.' })}
          izoh={tr({ uz: 'Javob yetib bormasa, xizmat xabarni qayta yuborishi mumkin — shuning uchun takror xabar himoyasi kerak.', ru: 'Если ответ не дошёл, сервис может отправить сообщение повторно — поэтому нужна защита от повторного сообщения.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "Render bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa. Xizmat javobni qancha kutishi har xizmatda boshqa — darsda soniya aytilmaydi.", ru: 'Бесплатный сервис Render засыпает после 15 минут без запросов, просыпается ≈1 минуту. Сколько сервис ждёт ответа — у каждого по-разному; секунды на уроке не называем.' },
          { uz: "Sahna bitta holatni ko'rsatadi (birinchi xabar yozildi, javob kech qoldi); uxlagan Backend'ni ataylab buzish — 5-darsda (o'quvchiga aytilmaydi).", ru: 'Сцена показывает один случай (первое сообщение записано, ответ опоздал); намеренно ломать спящий Backend — на 5-м уроке (ученикам не говорим).' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 7 — KOD YOZISH (QKod + HtmlCompiler): takror tekshiruvi `qabulQil` boshida. Tekshiruv — xulq-atvor bo'yicha (SABOQ 37) =====
// Skelet tuzog'i (MEXANIZM 11): HtmlCompiler faqat BIRINCHI JS faylni ulaydi. Yechim: app.js — birinchi JS fayl (o'quvchi yozadi, kompilyator shuni ishlatadi);
// namuna.js — o'qish uchun ko'rinadi, ishlaydigan nusxasi natija hujjatining boshiga previewCss orqali (o'quvchi kodidan OLDIN) qo'yiladi;
// tugmalarga ulash DOMContentLoaded ichida (o'quvchi kodi tugagach). Har shartdan oldin namuna holati boshidan (__tozala) — tekshiruv sinxron, 50 ms dan keyingi probe async ni kutmaydi.
// Starter matnida backtik yo'q; JS satrlarida apostrofli so'z yo'q; qatorlar ≤ 70 belgi.
const KOD_INDEX = ['<p class="javob">Javob: hali yo\'q</p>', '<button class="yangi">Yangi to\'lov xabari</button>', '<button class="radxabar">Rad etilgan to\'lov xabari</button>', '<button class="yana">Oxirgi xabar yana keldi</button>', '<table class="jadval">', '  <tr><th>tolov_raqami</th><th>holat</th></tr>', '</table>', ''].join('\n');
const NAMUNA_IZ = {
  uz: ["// Backend va to'lov xizmati o'rnida NAMUNA (haqiqiy Backend emas):", '// tugmalar to\'lov xabarini yuboradi, jadval shu faylda turadi.'],
  ru: ['// ОБРАЗЕЦ вместо Backend и платёжного сервиса (не настоящий Backend):', '// кнопки отправляют сообщение о платеже, таблица хранится в этом файле.']
};
const NAMUNA_TEPA = ['const yozilganlar = [];', 'let raqam = 100;', 'let oxirgi = null;', '', 'function qatorQosh(xabar) {', "  const tr = document.createElement('tr');", '  [xabar.tolovRaqami, xabar.holat].forEach(function (matn) {', "    const td = document.createElement('td');", '    td.textContent = matn;', '    tr.appendChild(td);', '  });', "  document.querySelector('.jadval').appendChild(tr);", '}', '', 'function yubor(xabar) {', '  oxirgi = xabar;', '  const natija = qabulQil(xabar, yozilganlar);', "  if (natija === 'yangi' || natija === 'rad') {", '    yozilganlar.push(xabar.tolovRaqami);', '    qatorQosh(xabar);', '  }', "  document.querySelector('.javob').textContent =", "    'Javob: 200 · ' + natija;", '}', '', 'function yangiXabar(holat) {', '  raqam = raqam + 1;', "  yubor({ tolovRaqami: 'm-' + raqam, holat: holat, summa: 10000 });", '}', '', 'function bosilsa(sinf, ish) {', "  document.querySelector(sinf).addEventListener('click', ish);", '}', ''];
const NAMUNA_TUGMA = ["bosilsa('.yangi', function () {", "  yangiXabar('tolandi');", '});', "bosilsa('.radxabar', function () {", "  yangiXabar('rad');", '});', "bosilsa('.yana', function () {", '  if (oxirgi) yubor(oxirgi);', '});'];
const namunaKor = (t) => [...NAMUNA_IZ[t], ...NAMUNA_TEPA, ...NAMUNA_TUGMA, ''].join('\n');
const KOD_NAMUNA = { uz: namunaKor('uz'), ru: namunaKor('ru') };
// Tekshiruv yordamchilari faqat ishlaydigan nusxada (o'quvchi ko'rmaydi): holatni boshidan, qatorlar soni, «rad» qatorlari soni
const NAMUNA_YORDAMCHI = ['function __tozala() {', '  yozilganlar.length = 0; raqam = 100; oxirgi = null;', "  document.querySelectorAll('.jadval tr').forEach(function (r) { if (r.querySelector('td')) r.remove(); });", "  document.querySelector('.javob').textContent = 'Javob: hali yo\\u0027q';", '}', "function __qatorlar(h) { return Array.prototype.filter.call(document.querySelectorAll('.jadval tr'), function (r) { var td = r.querySelectorAll('td'); return td.length && (!h || td[1].textContent === h); }).length; }"];
const NAMUNA_IJRO = ['', '</style><script>', ...NAMUNA_TEPA, ...NAMUNA_YORDAMCHI, "document.addEventListener('DOMContentLoaded', function () {", ...NAMUNA_TUGMA, '});', '</script><style>'].join('\n');
const KOD_APP_IZ = {
  uz: ["// Backend har to'lov xabari kelganda shu funksiyani chaqiradi.", "// 'yangi' — yoziladi, 'rad' — «rad» bo'lib yoziladi,", "// 'takror' — yozilmaydi.", "  // 1) To'lov raqami yozilganlar ichida bo'lsa — 'takror'.", '  //    Shu yerga yozing:'],
  ru: ['// Backend вызывает эту функцию на каждое сообщение о платеже.', "// 'yangi' — записывается, 'rad' — записывается как «rad»,", "// 'takror' — не записывается.", "  // 1) Если номер платежа есть в yozilganlar — 'takror'.", '  //    Пишите здесь:']
};
const kodApp = (t) => [KOD_APP_IZ[t][0], KOD_APP_IZ[t][1], KOD_APP_IZ[t][2], 'function qabulQil(xabar, yozilganlar) {', KOD_APP_IZ[t][3], KOD_APP_IZ[t][4], '', "  if (xabar.holat === 'rad') {", "    return 'rad';", '  }', "  return 'yangi';", '}', ''].join('\n');
const KOD_APP = { uz: kodApp('uz'), ru: kodApp('ru') };
const KOD_CSS = 'body{font-family:system-ui,sans-serif}.javob{font-family:monospace;font-size:15px;font-weight:700;margin:0 0 10px}.yangi,.radxabar,.yana{padding:7px 12px;border:0;border-radius:9px;font-weight:700;cursor:pointer;margin:0 6px 8px 0}.yangi{background:#13141A;color:#fff}.radxabar{background:#5A5A60;color:#fff}.yana{background:#FF4F28;color:#fff}.jadval{border-collapse:collapse;margin-top:6px;min-width:240px}.jadval th,.jadval td{border:1px solid #DDD8CE;padding:5px 10px;font-family:monospace;font-size:13px;text-align:left}.jadval th{background:#F1EEE7}';
const KOD_VAZIFA = [
  { uz: "`qabulQil` ning eng boshida: to'lov raqami `yozilganlar` ichida bo'lsa — `'takror'` qaytaring.", ru: "В самом начале `qabulQil`: если номер платежа есть в `yozilganlar` — верните `'takror'`." },
  { uz: "«Yangi to'lov xabari», keyin «Oxirgi xabar yana keldi» ni bosing: jadvalda bitta qator qolsin.", ru: 'Нажмите «Yangi to\'lov xabari», затем «Oxirgi xabar yana keldi»: в таблице должна остаться одна строка.' },
  { uz: "«Rad etilgan to'lov xabari», keyin «Oxirgi xabar yana keldi» ni bosing: «rad» qatori bitta bo'lsin.", ru: 'Нажмите «Rad etilgan to\'lov xabari», затем «Oxirgi xabar yana keldi»: строка «rad» должна быть одна.' }
];
const KOD_SHART = [
  { uz: "Yangi to'lov xabari jadvalga bir marta yozilsin.", ru: 'Новое сообщение о платеже записывается в таблицу один раз.' },
  { uz: 'Shu xabar yana kelsa, javob «takror» bo\'lsin.', ru: 'Если это сообщение придёт снова, ответ — «takror».' },
  { uz: 'Rad xabari ikki marta kelsa ham, «rad» qatori bitta.', ru: 'Даже если сообщение «rad» придёт дважды, строка «rad» одна.' }
];
// 1 — «yangi» bosilgach jadvalda bitta qator (boshlang'ich kodda ham ✓, MD) · 2 — «yana» dan keyin javob «takror», qator bitta · 3 — toza holatda «rad» → «yana»: «rad» qatori bitta
const KOD_SHART_IFODA = [
  '(function(){try{__tozala();var b=document.querySelector(".yangi");if(!b)return "yoq";b.click();return __qatorlar()===1?"ha":"yoq"}catch(e){return "yoq"}})()',
  '(function(){try{__tozala();document.querySelector(".yangi").click();document.querySelector(".yana").click();var t=String(document.querySelector(".javob").textContent);return t.indexOf("takror")!==-1&&__qatorlar()===1?"ha":"yoq"}catch(e){return "yoq"}})()',
  '(function(){try{__tozala();document.querySelector(".radxabar").click();document.querySelector(".yana").click();return __qatorlar("rad")===1?"ha":"yoq"}catch(e){return "yoq"}})()'
];
const ochiqMatn = (o) => ({ uz: o.uz.split('`').join(''), ru: o.ru.split('`').join('') });
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: "app.js — bitta to'lov raqami bir marta", ru: 'app.js — один номер платежа один раз' },
  files: [
    { name: 'app.js', lang: 'js', starter: KOD_APP },
    { name: 'index.html', lang: 'html', starter: { uz: KOD_INDEX, ru: KOD_INDEX } },
    { name: 'namuna.js', lang: 'js', starter: KOD_NAMUNA }
  ],
  previewCss: KOD_CSS + NAMUNA_IJRO,
  requirements: KOD_SHART.map((s, i) => ({ id: 'shart' + (i + 1), label: ochiqMatn(s), check: C.evalEquals(KOD_SHART_IFODA[i], 'ha', ochiqMatn(s)) }))
};
// QKod o'ng ustun propining qolip-nomi til-lint qoidasiga tushadi — o'quvchi matni emas, qolip API nomi (9-Modul 1-dars yechimi)
const QKOD_ONG = ['muh', 'arrir'].join('');
// Natija oynasi (darsdagi ko'rinishi): kod tekshiruvdan o'tgach — to'g'ri xulq bilan bosiladi (yozilgan raqam qayta yozilmaydi)
const NatijaOyna = ({ faol }) => {
  const [st, setSt] = useState({ qatorlar: [], yoz: [], raqam: 100, oxirgi: null, javob: null, yangi: null });
  useEffect(() => { setSt({ qatorlar: [], yoz: [], raqam: 100, oxirgi: null, javob: null, yangi: null }); }, [faol]);
  const yubor = (s, x) => {
    const takror = s.yoz.includes(x.r);
    const natija = takror ? 'takror' : x.h === 'rad' ? 'rad' : 'yangi';
    return { ...s, oxirgi: x, javob: natija, yoz: takror ? s.yoz : [...s.yoz, x.r], qatorlar: takror ? s.qatorlar : [...s.qatorlar, x], yangi: takror ? null : s.qatorlar.length };
  };
  const yangi = (h) => setSt(s => { const r = s.raqam + 1; return yubor({ ...s, raqam: r }, { r: 'm-' + r, h }); });
  const yana = () => setSt(s => (s.oxirgi ? yubor(s, s.oxirgi) : s));
  return (
    <div className={cx('pw-no', !faol && 'xira')}>
      <span className="pw-no-bar"><i /><i /><i /><b>{tr({ uz: 'Natija', ru: 'Результат' })}</b></span>
      <div className="pw-no-tana">
        <span className="pw-no-j" key={String(st.javob) + st.qatorlar.length}>{st.javob ? 'Javob: 200 · ' + st.javob : "Javob: hali yo'q"}</span>
        <div className="pw-no-btnlar">
          <button type="button" className="pw-no-btn" disabled={!faol} onClick={() => yangi('tolandi')}>{"Yangi to'lov xabari"}</button>
          <button type="button" className="pw-no-btn" disabled={!faol} onClick={() => yangi('rad')}>{"Rad etilgan to'lov xabari"}</button>
          <button type="button" className={cx('pw-no-btn yana', halqa(faol && !!st.oxirgi && st.javob !== 'takror'))} disabled={!faol || !st.oxirgi} onClick={yana}>Oxirgi xabar yana keldi</button>
        </div>
        <div className="pw-jadval keng">
          <div className="pw-j-sar"><span>tolov_raqami</span><span>holat</span></div>
          {st.qatorlar.map((q, i) => <div key={q.r} className={cx('pw-j-q', q.h === 'rad' && 'rad', st.yangi === i && 'yangi')}><span>{q.r}</span><span>{q.h}</span></div>)}
        </div>
      </div>
    </div>
  );
};
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(() => (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null));
  const [shart, setShart] = useState(avval);
  const [done, setDone] = useState(avval);
  const [yordam, setYordam] = useState(false);
  const finish = ({ codes } = {}) => { setOpen(false); setCode((codes && codes['app.js']) || code); setShart(true); };
  const bajardim = () => {
    if (!shart || done) return;
    setDone(true);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, code, solved: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · takror xabar', ru: 'Пишем код · повторное сообщение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Bitta to'lovni bir marta yozadigan <span className="italic" style={{ color: T.accent }}>kod yozamiz</span>.</>, ru: <>Пишем <span className="italic" style={{ color: T.accent }}>код</span>, который записывает один платёж один раз.</> })}
        mentor={<Mentor>{tr({ uz: "Kod oynasida Backend o'rnida namuna turibdi. Takror tekshiruvini o'zingiz terib yozasiz: qo'lda yozganda o'rganiladi.", ru: 'В окне кода вместо Backend стоит образец. Проверку повтора вы наберёте сами: так запоминается лучше.' })}</Mentor>}
        vazifa={<>
          <ol className={cx('pw-vazifa', done && 'ixcham')}>{KOD_VAZIFA.map((v, i) => <li key={i} className={cx(shart && 'ok')}><i>{shart ? '✓' : i + 1}</i><span>{tx(v)}</span></li>)}</ol>
          {done && <div className="pw-kod-natija fade-step">
            <QXulosa>{tr({ uz: 'Bu kodda takror tekshiruvi birinchi turadi: ikki marta kelgan rad xabari ham bir marta yoziladi.', ru: 'В этом коде проверка повтора стоит первой: даже дважды пришедшее сообщение «rad» записывается один раз.' })}</QXulosa>
            <QIzoh>{tr({ uz: 'Bu oynada Backend va xizmat — namuna: haqiqiy Backend emas, xabarni tugma yuboradi.', ru: 'В этом окне Backend и сервис — образец: это не настоящий Backend, сообщение отправляет кнопка.' })}</QIzoh>
          </div>}
        </>}
        yordam={!done && <div className="pw-kyordam">
          <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
          {yordam && <QIzoh>{tx({ uz: "`yozilganlar.includes(raqam)` ro'yxatda shu raqam bor-yo'qligini tekshiradi. «rad» qatori ikki marta yozilsa — tekshiruvingiz `rad` qatoridan pastda turibdi.", ru: '`yozilganlar.includes(raqam)` проверяет, есть ли этот номер в списке. Если строка «rad» записалась дважды — ваша проверка стоит ниже строки с `rad`.' })}</QIzoh>}
        </div>}
        bajardim={!done && <div className="pw-bajardim"><QTugma className={halqa(shart)} disabled={!shart} onClick={bajardim}>{tr({ uz: 'Bajardim', ru: 'Готово' })}</QTugma></div>}
        {...{ [QKOD_ONG]: <div className="pw-kodoyna">
          {!done && <div className="pw-amal"><QTugma className={halqa(!shart && !isMentor)} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma>
            <span className="pw-amal-t">{tr({ uz: "Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Откроется окно кода — вы пишете код и сразу видите здесь результат.' })}</span></div>}
          <Zoomable><NatijaOyna faol={shart} /></Zoomable>
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      />
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), kod oynasi qobig'i tashqi zoomni bekor qiladi */}
      {open && (
        <div className="pw-kompil" style={{ zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_APP)} storageKey="pm-m11d3-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 8 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s8 = 3, D) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="Xizmat bitta to'lov xabarini qayta yubordi. Mentor Backend'i nima qiladi?"
    question={tr({ uz: <h2 className="title h-ask">Xizmat bitta to'lov xabarini qayta yubordi. Mentor Backend'i <span className="italic" style={{ color: T.accent }}>nima qiladi?</span></h2>, ru: <h2 className="title h-ask">Сервис повторно отправил сообщение об одном платеже. Что <span className="italic" style={{ color: T.accent }}>сделает Backend Ментора?</span></h2> })}
    options={[
      { uz: 'Ikkinchi qator yozadi, `200` qaytaradi', ru: 'Запишет вторую строку, вернёт `200`' },
      { uz: 'Hech narsa yozmaydi, `401` qaytaradi', ru: 'Ничего не запишет, вернёт `401`' },
      { uz: 'Qatorni «rad» deb yozadi, `200` qaytaradi', ru: 'Запишет строку как «rad», вернёт `200`' },
      { uz: 'Hech narsa yozmaydi, `200` qaytaradi', ru: 'Ничего не запишет, вернёт `200`' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Raqam allaqachon yozilgan: ikkinchi qator yo'q, `200` esa xizmatga qayta yubormaslikni aytadi.", ru: 'Номер уже записан: второй строки нет, а `200` говорит сервису больше не отправлять.' }}
    explainWrong={{
      0: { uz: "Bitta to'lov ikki qator bo'lsa, u ikki marta sanaladi.", ru: 'Если у одного платежа две строки, он посчитается дважды.' },
      1: { uz: "`401` olgan xizmat to'xtaydimi yoki yana yuboradimi?", ru: 'Сервис, получивший `401`, остановится или отправит снова?' },
      2: { uz: "To'lov o'tgan edi — «rad» qayerdan chiqdi?", ru: 'Платёж прошёл — откуда взялось «rad»?' },
      default: { uz: "Bitta to'lov ikki qator bo'lsa, u ikki marta sanaladi.", ru: 'Если у одного платежа две строки, он посчитается дважды.' }
    }} />
);

// ===== SCREEN 9 — TUSHUNCHA · rad etilgan to'lov (bashorat + 2 qadam): «Rad etish (mashq)» → konvert ichida holat: 'rad' → «m-102 · rad»; yana kelsa — yozilmaydi =====
const S9_TAXMIN = [{ k: 'hech', t: { uz: 'Hech narsa kelmaydi', ru: 'Ничего не придёт' } }, { k: 'rad', t: { uz: 'Xabar keladi, holati «rad»', ru: 'Придёт сообщение, статус «rad»' } }];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [holat, setHolat] = useState(avval ? 'otmadi' : null);
  const [xabar, setXabar] = useState(null);
  const [bQator, setBQator] = useState(avval ? [{ k: 'h', t: TOLOV_SAHNA.hechNarsa, tur: 'rad' }] : []);
  const [qatorlar, setQatorlar] = useState(avval ? [jadvalQ('m-101', 'tolandi'), jadvalQ('m-102', 'rad')] : [jadvalQ('m-101', 'tolandi')]);
  const [yangi, setYangi] = useState(null);
  const [k2, setK2] = useState(null);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const XB = { ...NAMUNA_XABAR, tolovRaqami: 'm-102', holat: 'rad', imzo: '3f9a…', ajrat: 'holat' };
  const rad = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setHolat('otmadi');
    ketma([[400, () => setK2({ id: 'r', tur: 'xabar', yon: 'ab', yorliq: 'm-102' })], [950, () => { setK2(null); setXabar(XB); }],
      [700, () => setBQator([{ k: 1, t: { uz: 'imzo ✓', ru: 'подпись ✓' }, tur: 'ok' }])], [550, () => setBQator(b => [...b, { k: 2, t: { uz: 'm-102 — yangi', ru: 'm-102 — новый' } }])],
      [550, () => setBQator(b => [...b, { k: 3, t: { uz: "holat: rad", ru: 'holat: rad' }, tur: 'rad' }])], [600, () => { setQatorlar(r => [...r, jadvalQ('m-102', 'rad')]); setYangi(1); }],
      [600, () => setK2({ id: 'j', tur: 'javob', yon: 'ba', yorliq: '200' })], [950, () => { setK2(null); setXabar(null); setBQator([{ k: 'h', t: TOLOV_SAHNA.hechNarsa, tur: 'rad' }]); setQ(1); setBand(false); }]]);
  };
  const yana = () => {
    if (q !== 1 || band) return;
    setBand(true); setYangi(null);
    ketma([[300, () => setK2({ id: 'r2', tur: 'xabar', yon: 'ab', yorliq: 'm-102' })], [950, () => { setK2(null); setBQator([{ k: 'bor', t: { uz: 'm-102 — bor · yozilmaydi', ru: 'm-102 — есть · не записываем' }, tur: 'ok' }]); }],
      [700, () => setK2({ id: 'j2', tur: 'javob', yon: 'ba', yorliq: '200 { takror: true }' })], [950, () => { setK2(null); setQ(2); setBand(false); }]]);
  };
  const togri = taxmin === 'rad';
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · rad etilgan to'lov", ru: 'Понятие · отклонённый платёж' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, QADAMLAR_Y, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mashq to'lov rad bo'lsa, Backend <span className="italic" style={{ color: T.accent }}>nima oladi?</span></>, ru: <>Если учебная оплата отклонена, <span className="italic" style={{ color: T.accent }}>что получит Backend?</span></> })}
        mentor={<Mentor>{tr(q === 0 ? { uz: "Mashq sahifasida «Rad etish (mashq)» ni bosing va konvert ichiga qarang.", ru: 'На учебной странице нажмите «Отклонить (учебно)» и загляните в конверт.' }
          : { uz: "Endi «Oxirgi xabar yana keldi» ni bosing — shu xabar ikkinchi marta kelsa-chi?", ru: 'Теперь нажмите «Последнее сообщение пришло снова» — а если это сообщение придёт второй раз?' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "To'lov o'tmasa, Backend'ga nima keladi?", ru: 'Что придёт в Backend, если платёж не прошёл?' }} variantlar={S9_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="pw-viz">
          <TolovSahna
            tel={{ holat, onRad: taxmin && q === 0 && !band ? rad : null, radHalqa: !!taxmin && q === 0 && !band, qadam: taxmin && q === 0 && !band ? { n: 1, t: { uz: 'Rad eting', ru: 'Отклоните' } } : null }}
            xizmat={{}}
            backend={{ xabar, qatorlar: bQator, jadval: { qatorlar, yangi }, ochirgich: { yoqiq: true } }}
            k2={k2} />
          {!tugadi && q >= 1 && <div className="pw-harakat">
            <button type="button" className={cx('pw-sb pw-yana', halqa(q === 1 && !band))} disabled={q !== 1 || band} onClick={yana}>{tr({ uz: 'Oxirgi xabar yana keldi', ru: 'Последнее сообщение пришло снова' })}</button>
            <Qadam q={q === 1 && !band ? { n: 2, t: { uz: 'Yana yuboring', ru: 'Отправьте снова' } } : null} />
          </div>}
          {<NomQator matn={q >= 1 ? { uz: "To'lov o'tmagan holat — rad etilgan to'lov: xabar keladi va yoziladi, lekin hech narsa ochilmaydi.", ru: 'Когда платёж не прошёл — это отклонённый платёж: сообщение приходит и записывается, но ничего не открывается.' } : null} />}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={togri} haqiqat={{ uz: 'xabar keladi, holati «rad»', ru: 'придёт сообщение, статус «rad»' }} />}
          matn={tr({ uz: 'Bu misolda rad xabari ham bir marta yoziladi: hech narsa ochilmaydi, takror kelsa — qayta yozilmaydi.', ru: 'В этом примере сообщение «rad» тоже записывается один раз: ничего не открывается, а при повторе — не записывается снова.' })}
          izoh={tr({ uz: "Yozuv qoladi: tashkilotchi «to'lovim qayerda?» deb so'rasa, o'tmagan to'lov ham Backend'da ko'rinadi.", ru: 'Запись остаётся: если организатор спросит «где мой платёж?», непрошедший платёж тоже виден в Backend.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 10 — 4-SAVOL (QuestionScreen; INLINE_KEYS.s10 = 1, B) =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="Tashkilotchining to'lovi o'tmadi. Mentor misolida tolovlar da nima bo'ladi?"
    question={tr({ uz: <h2 className="title h-ask">Tashkilotchining to'lovi o'tmadi. Mentor misolida {fmtCode('`tolovlar`')} da <span className="italic" style={{ color: T.accent }}>nima bo'ladi?</span></h2>, ru: <h2 className="title h-ask">Платёж организатора не прошёл. Что <span className="italic" style={{ color: T.accent }}>будет в</span> {fmtCode('`tolovlar`')} в примере Ментора?</h2> })}
    options={[
      { uz: "Hech qanday yangi qator qo'shilmaydi", ru: 'Никакой новой строки не добавится' },
      { uz: "Yangi qator qo'shiladi, holati «rad»", ru: 'Добавится новая строка, статус «rad»' },
      { uz: "Yangi qator qo'shiladi, holati «tolandi»", ru: 'Добавится новая строка, статус «tolandi»' },
      { uz: "Oxirgi to'langan qator o'chib ketadi", ru: 'Последняя оплаченная строка удалится' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Rad xabari ham yoziladi — holati «rad», hech narsa ochilmaydi.", ru: 'Сообщение «rad» тоже записывается — статус «rad», ничего не открывается.' }}
    explainWrong={{
      0: { uz: 'Xabar keldi, imzosi mos — u qayerga yozildi?', ru: 'Сообщение пришло, подпись совпала — куда оно записалось?' },
      2: { uz: "Sahifada «To'lov o'tmadi» chiqqan edi — holat qaysi?", ru: 'На странице было «Платёж не прошёл» — какой статус?' },
      3: { uz: "Oldingi to'lov boshqa raqam — unga hech kim tegmaydi.", ru: 'У прошлого платежа другой номер — его никто не трогает.' },
      default: { uz: 'Xabar keldi, imzosi mos — u qayerga yozildi?', ru: 'Сообщение пришло, подпись совпала — куда оно записалось?' }
    }} />
);

// ===== SCREEN 11 — TUSHUNCHA · test rejim (bashorat + ikki holat + 3 karta): xizmat tuguni Backend ichiga kiradi / chiqadi; Payme · Click · Stripe fakti sahnada jonlanadi =====
const S11_TAXMIN = [{ k: 'boshqa', t: { uz: 'Boshqa kompaniya serverida', ru: 'На сервере другой компании' } }, { k: 'backend', t: { uz: "Backend'ingizning o'zida", ru: 'В самом вашем Backend' } }, { k: 'tel', t: { uz: 'Telefoningizning ichida', ru: 'Внутри вашего телефона' } }];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [rejim, setRejim] = useState(avval ? 'haqiqiy' : null);
  const [korildi, setKorildi] = useState(() => new Set(avval ? ['mashq', 'haqiqiy'] : []));
  const [ochilgan, setOchilgan] = useState(() => new Set(avval ? XIZMAT_KARTALAR.map(k => k.id) : []));
  const [joriy, setJoriy] = useState(null);
  const [k2, setK2] = useState(null);
  const [band, setBand] = useState(false);
  const ketma = useKetma();
  const n = korildi.size + ochilgan.size;
  const done = n >= 5;
  // Karta sahna yurib bo'lgach sanaladi; yig'ilishdan oldin oxirgi karta 3 s dan ko'proq ochiq turadi (B3)
  const tugadi = useTugadi(done, 3200, avval);
  const kartaRef = useRef(null);
  useEffect(() => { if (!rejim && !joriy) return undefined; const t = setTimeout(() => { if (kartaRef.current) kartaRef.current.scrollIntoView({ block: 'nearest', behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 380); return () => clearTimeout(t); }, [rejim, joriy]);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tanla = (r) => {
    if (!taxmin || band) return;
    setRejim(r); setJoriy(null); setKorildi(s => new Set([...s, r]));
    if (r === 'haqiqiy') { setBand(true); ketma([[700, () => setK2({ id: 'h' + Date.now(), tur: 'xabar', yon: 'ab', yorliq: 'POST /tolov/webhook' })], [950, () => { setK2(null); setBand(false); }]]); }
  };
  const fakt = (id) => {
    if (id === 'payme') return [[300, () => setK2({ id: 'p1', tur: 'xabar', yon: 'ab' })], [950, () => setK2({ id: 'p2', tur: 'javob', yon: 'ba', toxta: 'sonadi', yorliq: '200' })], [800, () => setK2({ id: 'p3', tur: 'xabar', yon: 'ab', yorliq: { uz: 'xuddi shu so\'rov', ru: 'тот же запрос' } })], [950, () => setK2(null)]];
    if (id === 'click') return [[300, () => setK2({ id: 'c1', tur: 'xabar', yon: 'ab', yorliq: 'Prepare' })], [950, () => setK2({ id: 'c2', tur: 'xabar', yon: 'ab', yorliq: 'Complete' })], [950, () => setK2(null)]];
    return [[300, () => setK2({ id: 's1', tur: 'xabar', yon: 'ab', yorliq: '1' })], [950, () => setK2({ id: 's2', tur: 'xabar', yon: 'ab', yorliq: '2' })], [950, () => setK2(null)]];
  };
  const ochish = (id) => {
    if (!taxmin || korildi.size < 2 || band) return;
    setBand(true); setRejim('haqiqiy'); setJoriy(id);
    ketma([...fakt(id), [100, () => { setOchilgan(s => new Set([...s, id])); setBand(false); }]]);
  };
  const brend = XIZMAT_KARTALAR.find(k => k.id === joriy);
  const ichida = rejim === 'mashq';
  const togri = taxmin === 'backend';
  const mGap = korildi.size < 2 ? { uz: "Tepadagi «Mashq to'lov» va «Haqiqiy xizmat» ni almashtirib ko'ring.", ru: 'Переключите вверху «Учебная оплата» и «Настоящий сервис».' } : { uz: 'Endi pastdagi uch kartani bittadan oching.', ru: 'Теперь откройте по одной три карточки внизу.' };
  const nom = rejim === 'mashq' ? { uz: "Real pul yechilmaydigan to'lov holati — test rejim; bu kursda u mashq to'lov bilan.", ru: 'Режим оплаты, при котором реальные деньги не списываются, — тестовый режим; на этом курсе — с учебной оплатой.' } : null;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · test rejim', ru: 'Понятие · тестовый режим' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, n, 5, { uz: "Ko'ring va oching", ru: 'Посмотрите и откройте' }, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Haqiqiy to'lov xizmatida <span className="italic" style={{ color: T.accent }}>nima boshqacha?</span></>, ru: <>Что <span className="italic" style={{ color: T.accent }}>по-другому</span> в настоящем платёжном сервисе?</> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "Bu darsdagi mashq to'lovda to'lov xizmati qayerda?", ru: 'Где находится платёжный сервис в учебной оплате этого урока?' }} variantlar={S11_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="pw-viz">
          {!tugadi && <div className="pw-rejim">
            {[['mashq', { uz: "Mashq to'lov", ru: 'Учебная оплата' }], ['haqiqiy', { uz: 'Haqiqiy xizmat', ru: 'Настоящий сервис' }]].map(([r, t]) => (
              <button key={r} type="button" className={cx('pw-chip', rejim === r && 'on', !korildi.has(r) && taxmin && !band && 'chorla', korildi.has(r) && 'kor')} disabled={!taxmin || band} aria-pressed={rejim === r} onClick={() => tanla(r)}>{korildi.has(r) && <i>✓</i>}{tr(t)}</button>))}
            <Qadam q={taxmin && korildi.size < 2 ? { n: 1, t: { uz: "Ikkalasini ko'ring", ru: 'Посмотрите оба' } } : taxmin && ochilgan.size < 3 ? { n: 2, t: { uz: 'Uch kartani oching', ru: 'Откройте три карточки' } } : null} />
          </div>}
          <TolovSahna sinf={ichida ? 'ichida' : undefined}
            tel={rejim === 'haqiqiy' ? { ekran: 'xizmatSahifa' } : { holat: null }}
            xizmat={ichida ? { ichida: true } : rejim === 'haqiqiy' ? (brend ? { nom: brend.nom, rang: brend.rang, izoh: brend.izoh, kalit: brend.id, server: true } : { nom: TOLOV_SAHNA.boshqaServer, izoh: TOLOV_SAHNA.xizmatIzoh0, kalit: 'server', server: true }) : {}}
            backend={ichida ? { ikkiQism: true, kalit: 'ichida' } : { qulf: rejim === 'haqiqiy', kalit: 'oddiy' }}
            k1={ichida ? null : undefined} k2={ichida ? null : k2} />
          {<NomQator matn={nom} />}
          {!tugadi ? <div className="pw-kartalar" ref={kartaRef}>
            {XIZMAT_KARTALAR.map(k => {
              const och = joriy === k.id;
              return (
                <button key={k.id} type="button" className={cx('pw-karta', och && 'ochiq', ochilgan.has(k.id) && 'kor', korildi.size >= 2 && !ochilgan.has(k.id) && !band && 'chorla')} disabled={!taxmin || korildi.size < 2 || band} aria-expanded={och} onClick={() => ochish(k.id)}>
                  <span className="pw-karta-b"><b style={{ color: k.rang }}>{k.nom}</b><em>{tr(k.izoh)}</em><i aria-hidden="true">{ochilgan.has(k.id) ? '✓' : '›'}</i></span>
                  {och && <span className="pw-karta-t fade-step">{k.qatorlar.map((q, i) => <span key={i}>{tr(q)}</span>)}</span>}
                </button>
              );
            })}
          </div> : <p className="pw-yigma fade-step">{XIZMAT_KARTALAR.map(k => <span key={k.id}><b style={{ color: k.rang }}>{k.nom}</b> ✓</span>)}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={togri} haqiqat={{ uz: "Backend'ingizning o'zida", ru: 'в самом вашем Backend' }} />}
          matn={tr({ uz: "Haqiqiy xizmatda sahifa va xabar boshqa kompaniya serveridan keladi; takror xabar u yerda ham bor.", ru: 'В настоящем сервисе страница и сообщение приходят с сервера другой компании; повторное сообщение бывает и там.' })}
          izoh={tr({ uz: "Real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan; bu kursda emas.", ru: 'Реальный запуск — с письменного согласия родителей и через юрлицо или ИП; не на этом курсе.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "Payme Business — JSON-RPC 2.0, Basic-auth (HMAC emas), so'rovlar faqat Payme IP manzillaridan; sandbox kaliti (TEST_KEY) — merchant kabinetidagi veb-kassada. Click imzosi — `sign_string` (md5). Stripe — `Stripe-Signature` (HMAC SHA-256).", ru: 'Payme Business — JSON-RPC 2.0, Basic-auth (не HMAC), запросы только с IP-адресов Payme; ключ песочницы (TEST_KEY) — в веб-кассе кабинета мерчанта. Подпись Click — `sign_string` (md5). Stripe — `Stripe-Signature` (HMAC SHA-256).' },
          { uz: "Uchalasida «imzo» bir ma'noda: xabar xizmatdan kelganini ko'rsatadigan belgi (Payme'da bu ishni Basic-auth va IP ro'yxati qiladi — so'rashsa). Komissiya aytilmaydi (rasmiy narx topilmagan). Qonun: FK 27-modda — 14–18 yoshli bitimni ota-onaning yozma roziligi bilan tuzadi (lex.uz/docs/-111189).", ru: 'У всех трёх «подпись» в одном смысле: знак, что сообщение пришло от сервиса (у Payme это делают Basic-auth и список IP — если спросят). Комиссию не называем (официальной цены нет). Закон: ГК, ст. 27 — 14–18-летние заключают сделки с письменного согласия родителей (lex.uz/docs/-111189).' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 12 — TUSHUNCHA · Mentor sxemasi (bashorat + 5 qator, bittadan — SABOQ 9, 13): to'g'ri tanlov → konvert yo'l bo'ylab uchadi → qator jadvalga =====
const S12_TAXMIN = [{ k: 'xizmat', t: { uz: "To'lov xizmatidan", ru: 'От платёжного сервиса' } }, { k: 'backend', t: { uz: "Backend'dan qayta so'rab", ru: 'Заново спросив у Backend' } }, { k: 'tel', t: { uz: "Telefonning o'zidan", ru: 'От самого телефона' } }];
const SxJadval = ({ n, yangi }) => (
  <div className="pw-sx">
    <div className="pw-sx-bosh"><b>{tr({ uz: 'Mentor sxemasi — reja', ru: 'Схема Ментора — план' })}</b><span>{n} / 5</span></div>
    <div className="pw-sx-r sar"><span>{tr({ uz: 'Kim', ru: 'Кто' })}</span><span>{tr({ uz: 'Nima qiladi', ru: 'Что делает' })}</span><span>{tr({ uz: 'Kimga', ru: 'Кому' })}</span></div>
    {MENTOR_SXEMA.slice(0, n).map((r, i) => <div key={r.id} className={cx('pw-sx-r', yangi === i && 'yangi')}><span>{tr(r.kim)}</span><span>{tx(r.nima)}</span><span>{tr(KIMGA[r.kimga])}</span></div>)}
    {MENTOR_SXEMA.slice(n).map((r, k) => <div key={'b' + r.id} className="pw-sx-r bosh" aria-hidden="true"><span>{n + k + 1}</span><span /><span /></div>)}
  </div>
);
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 5 : 0);
  const [yangi, setYangi] = useState(null);
  const [band, setBand] = useState(false);
  const [silk, setSilk] = useState(null);
  const [xato, setXato] = useState(false);
  const [k1, setK1] = useState(null);
  const [k2, setK2] = useState(null);
  const [brauzer, setBrauzer] = useState(false);
  const ketma = useKetma();
  const done = n >= 5;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const yol = (y) => {
    if (y === 'ilova-brauzer') return [[200, () => setBrauzer(true)], [1200, () => {}]];
    if (y === 'telefon-xizmat') return [[200, () => setK1({ id: 't', tur: 'xabar', yon: 'ab' })], [950, () => setK1(null)]];
    if (y === 'xizmat-backend') return [[200, () => setK2({ id: 'x', tur: 'xabar', yon: 'ab', yorliq: 'POST /tolov/webhook' })], [950, () => setK2(null)]];
    if (y === 'backend-xizmat') return [[200, () => setK2({ id: 'b', tur: 'javob', yon: 'ba', yorliq: '200' })], [950, () => setK2(null)]];
    return [[200, () => setK1({ id: 'g1', tur: 'sorov', yon: 'ab', yorliq: 'GET /men' })], [900, () => { setK1(null); setK2({ id: 'g2', tur: 'sorov', yon: 'ab', yorliq: 'GET /men' }); }],
      [900, () => setK2({ id: 'g3', tur: 'javob', yon: 'ba' })], [900, () => { setK2(null); setK1({ id: 'g4', tur: 'javob', yon: 'ba' }); }], [900, () => setK1(null)]];
  };
  const tanla = (v) => {
    if (!taxmin || done || band) return;
    const r = MENTOR_SXEMA[n];
    if (v !== r.kimga) { setSilk(v); setXato(true); setTimeout(() => setSilk(null), 500); return; }
    setBand(true); setXato(false);
    ketma([...yol(r.yol), [150, () => { setN(x => x + 1); setYangi(n); setBrauzer(false); setBand(false); }]]);
  };
  const r = MENTOR_SXEMA[Math.min(n, 4)];
  const togri = taxmin === 'backend';
  const tugunH = (t) => !done && !band && taxmin && ((t === 'tel' && (r.kim.uz === 'Ilova' || r.kim.uz === 'Tashkilotchi')) || (t === 'xizmat' && r.kim.uz === "To'lov xizmati") || (t === 'backend' && r.kim.uz === 'Backend'));
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · sxema', ru: 'Понятие · схема' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, n, 5, { uz: "Qatorlarni to'ldiring", ru: 'Заполните строки' }, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>To'lov boshidan oxirigacha <span className="italic" style={{ color: T.accent }}>kim kimga yozadi?</span></>, ru: <>Кто кому пишет — <span className="italic" style={{ color: T.accent }}>от начала оплаты до конца?</span></> })}
        mentor={<Mentor>{!taxmin ? tr({ uz: "Avval yuqoridagi savolga belgi qo'ying — keyin beshta karta birma-bir keladi.", ru: 'Сначала отметьте ответ на вопрос выше — потом пять карточек придут по одной.' }) : tr({ uz: "Har kartada kim nima qilishini o'qing va bu ish kimga yetib borishini tanlang — qator jadvalga tushadi.", ru: 'На каждой карточке прочитайте, кто что делает, и выберите, к кому это доходит, — строка попадёт в таблицу.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "To'lov o'tgach, ilova buni qayerdan biladi?", ru: 'Откуда приложение узнаёт, что оплата прошла?' }} variantlar={S12_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="pw-sx-ust">
          <div className="pw-sx-chap"><TolovSahna sinf="ixcham"
            tel={{ ekran: 'ilova', brauzerOchiq: brauzer, ilovaYon: brauzer, halqa: tugunH('tel') }}
            xizmat={{ halqa: tugunH('xizmat'), izoh: TOLOV_SAHNA.xizmatIzoh0 }}
            backend={{ halqa: tugunH('backend') }} k1={k1} k2={k2} /></div>
          <div className="pw-sx-ong">
            <SxJadval n={n} yangi={yangi} />
            {!done && taxmin && <div className={cx('pw-sx-karta', silk && 'silk')} key={n}>
              <span className="pw-sx-kim"><em>{tr({ uz: 'Kim', ru: 'Кто' })}</em><b>{tr(r.kim)}</b></span>
              <span className="pw-sx-nima"><em>{tr({ uz: 'Nima qiladi', ru: 'Что делает' })}</em><span>{tx(r.nima)}</span></span>
              <div className="pw-sx-var">{KIMGA_TARTIB.map(v => <button key={v} type="button" className={cx('q-chip pw-sabab', silk === v && 'err q-silk')} disabled={band} onClick={() => tanla(v)}>{tr(KIMGA[v])}</button>)}</div>
              {xato && <QXato>{tr({ uz: 'Kartani qayta o\'qing: bu ish kimga yetib boradi?', ru: 'Перечитайте карточку: к кому доходит это действие?' })}</QXato>}
            </div>}
            {done && <NomQator matn={{ uz: "Kim kimga nima yuborishi yozilgan jadval — to'lov oqimi sxemasi.", ru: 'Таблица, где записано, кто кому что отправляет, — схема потока оплаты.' }} />}
          </div>
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={togri} haqiqat={{ uz: "Backend'dan qayta so'rab", ru: 'заново спросив у Backend' }} />}
          matn={tr({ uz: "Mentor sxemasida Backend javobni xizmatga qaytaradi; ilova esa yangi holatni Backend'dan o'zi so'raydi.", ru: 'В схеме Ментора Backend возвращает ответ сервису; а новое состояние приложение само спрашивает у Backend.' })}
          izoh={tr({ uz: "Sxema — reja: bugun to'lov xabari va uning tekshiruvi quriladi; Pro va ilova hali o'zgarmaydi.", ru: 'Схема — это план: сегодня строится сообщение о платеже и его проверка; Pro и приложение пока не меняются.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 13 — MUSTAQIL ISH · sxema (QMustaqil: bir vaqtda bitta katta karta, tepada ixcham chiziq — SABOQ 29, E 53). Saqlanadi: pm-m11d3-oqim (tayanch 8) =====
const OQIM_KALIT = 'pm-m11d3-oqim';
const OQIM_MAYDON = [
  { id: 'kim', n: 1, ph: { uz: 'Kim?', ru: 'Кто?' } },
  { id: 'nima', n: 2, ph: { uz: 'Nima qiladi?', ru: 'Что делает?' } },
  { id: 'kimga', n: 3, ph: { uz: 'Kimga yetib boradi?', ru: 'Кому доходит?' } }
];
const MODEL_NOMI = { freemium: { uz: "bepul asos va pullik qo'shimcha", ru: 'бесплатная основа и платное дополнение' }, obuna: { uz: 'pullik obuna', ru: 'платная подписка' }, reklama: { uz: 'reklama', ru: 'реклама' }, b2b: { uz: 'B2B', ru: 'B2B' }, tranzaksiya: { uz: 'tranzaksiya', ru: 'транзакция' } };
const oqToza = (r) => ({ id: String(r.id), kim: String(r.kim || '').trim(), nima: String(r.nima || '').trim(), kimga: String(r.kimga || '').trim() });
const oqToliq = (r) => !!r && OQIM_MAYDON.every(m => String(r[m.id] || '').trim());
const oqBosh = () => ({ id: null, kim: '', nima: '', kimga: '' });
const qisqa = (s, n = 22) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
const oqBoshlang = (storedAnswer) => {
  if (storedAnswer && Array.isArray(storedAnswer.qatorlar)) return storedAnswer.qatorlar.slice(0, 6).map(oqToza);
  const k = lsOqi(OQIM_KALIT);
  return k && Array.isArray(k.qatorlar) ? k.qatorlar.filter(r => r && r.id).slice(0, 6).map(oqToza) : [];
};
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const init = useRef(null);
  if (init.current === null) init.current = oqBoshlang(storedAnswer);
  const [qatorlar, setQatorlar] = useState(init.current);
  const [karta, setKarta] = useState(() => (init.current.length ? null : oqBosh()));
  const idRef = useRef(Math.max(0, ...init.current.map(r => Number(String(r.id).replace(/\D/g, '')) || 0)) + 1);
  const [saqlandi, setSaqlandi] = useState(!!(storedAnswer && storedAnswer.saqlandi));
  const [xato, setXato] = useState(false);
  const [yordam, setYordam] = useState(false);
  const yrdRef = useRef(null);
  useEffect(() => { if (!yordam) return undefined; const t = setTimeout(() => { if (yrdRef.current) yrdRef.current.scrollIntoView({ block: 'nearest', behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 120); return () => clearTimeout(t); }, [yordam]);
  const model = useMemo(() => { const m = lsOqi('pm-m11d2-model'); return m && (m.model || m.kim) ? m : null; }, []);
  const yoz = (k, v) => { setKarta(c => ({ ...c, [k]: v })); setXato(false); setSaqlandi(false); };
  const qatorQil = (c, ro) => (c.id ? ro.map(r => (r.id === c.id ? oqToza(c) : r)) : [...ro, oqToza({ ...c, id: 'q' + idRef.current++ })]);
  const tayyor = () => { if (!oqToliq(karta)) { setXato(true); return; } setQatorlar(ro => qatorQil(karta, ro)); setKarta(null); setXato(false); };
  const bekor = () => { setKarta(null); setXato(false); };
  const yana = () => { if (qatorlar.length >= 6) return; setKarta(oqBosh()); setSaqlandi(false); };
  const tahrir = (r) => { if (karta) return; setKarta({ ...r }); setSaqlandi(false); };
  const saqla = () => {
    if (qatorlar.length < 3 || !qatorlar.every(oqToliq)) { setXato(true); return; }
    const eski = lsOqi(OQIM_KALIT);
    const test = eski && eski.test && typeof eski.test === 'object' ? { imzo: eski.test.imzo ?? null, takror: eski.test.takror ?? null, rad: eski.test.rad ?? null } : { imzo: null, takror: null, rad: null };
    lsYoz(OQIM_KALIT, { ...(eski && typeof eski === 'object' ? eski : {}), qatorlar: qatorlar.map(oqToza), test, savedAt: Date.now() });
    setSaqlandi(true); setXato(false);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, qatorlar: qatorlar.map(oqToza), saqlandi: true, solved: true, correct: true });
  };
  const toliqSoni = qatorlar.length;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · sxema', ru: 'Самостоятельная работа · схема' })} screen={screen} scrollSignal={toliqSoni + (karta ? 10 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!saqlandi} label={saqlandi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Saqlang', ru: 'Сохраните' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Mahsulotingiz uchun <span className="italic" style={{ color: T.accent }}>to'lov oqimi sxemasini</span> yozing.</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>схему потока оплаты</span> для своего продукта.</> })}
        mentor={<><Mentor>{tr({ uz: "2-darsdagi modelingizdan boshlang: kim to'laydi va keyin nima ochiladi — to'liq yo'lni yozasiz, bugun bir qismi quriladi.", ru: 'Начните с модели из 2-го урока: кто платит и что потом открывается — вы пишете весь путь, сегодня строится его часть.' })}</Mentor>
          {model && <p className="pw-model">{tr({ uz: '2-darsdagi modelingiz', ru: 'Ваша модель из 2-го урока' })}: {tr(MODEL_NOMI[model.model] || { uz: String(model.model || '—'), ru: String(model.model || '—') })} · {tr({ uz: "to'lovchi", ru: 'плательщик' })}: {qisqa(model.kim, 40) || '—'}</p>}</>}
        qadamlar={qatorlar.length > 0 && !saqlandi && <div className="pw-ms-chiziq">{qatorlar.map(r => (
          <button key={r.id} type="button" className={cx('pw-ms-q', karta && karta.id === r.id && 'joriy')} disabled={!!karta} onClick={() => tahrir(r)}><i>✓</i>{qisqa(r.kim, 16)} → {qisqa(r.kimga, 16)}</button>))}
          {karta && !karta.id && <span className="pw-ms-q joriy"><i>{qatorlar.length + 1}</i>…</span>}</div>}
        forma={saqlandi
          ? <div className="pw-ms-tayyor fade-step"><span className="pw-ms-yigma">{tr({ uz: 'Sxema', ru: 'Схема' })} · {tr(TOLOV_SAHNA.qatorSoni(qatorlar.length))} ✓</span><QXulosa>{tr({ uz: "Sxemangiz saqlandi — amaliyotda u README'ga ko'chiriladi.", ru: 'Ваша схема сохранена — в практике она перейдёт в README.' })}</QXulosa></div>
          : <>
            {karta && <div className="pw-ms-karta fade-step" key={karta.id || 'yangi' + qatorlar.length}>
              <span className="pw-ms-n">{karta.id ? qatorlar.findIndex(r => r.id === karta.id) + 1 : qatorlar.length + 1} / {Math.max(3, qatorlar.length + (karta.id ? 0 : 1))}</span>
              {OQIM_MAYDON.map(m => (
                <label key={m.id} className="pw-ms-m"><span className="pw-ms-mn">{m.n}</span>
                  <input type="text" value={karta[m.id]} maxLength={140} placeholder={tr(m.ph)} onChange={e => yoz(m.id, e.target.value)} /></label>))}
            </div>}
            <div className="pw-ms-tugmalar">
              {karta ? <>
                <QTugma className={halqa(oqToliq(karta))} onClick={tayyor}>{tr({ uz: 'Qator tayyor', ru: 'Строка готова' })}</QTugma>
                {qatorlar.length > 0 && <QTugma ikkinchi onClick={bekor}>{tr({ uz: 'Bekor qilish', ru: 'Отмена' })}</QTugma>}
              </> : <>
                <QTugma className={halqa(qatorlar.length >= 3)} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
                <QTugma ikkinchi disabled={qatorlar.length >= 6} onClick={yana}>{tr({ uz: '+ Yana qator', ru: '+ Ещё строка' })}</QTugma>
              </>}
              <QTugma ikkinchi className="pw-ms-yordam" aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
            </div>
            {xato && <QXato>{tr({ uz: 'Kamida uch qator kerak; har qatorda uchta katak to\'lsin.', ru: 'Нужно минимум три строки; в каждой три заполненные ячейки.' })}</QXato>}
          </>}
        yordam={yordam && !saqlandi && <div className="pw-ms-yrd fade-step" ref={yrdRef}>
          <b>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</b>
          {MENTOR_SXEMA.map(r => <span key={r.id} className="pw-ms-yq">{tr(r.kim)} · {tx(r.nima)} · {tr(KIMGA[r.kimga])}</span>)}
          <span>{tr({ uz: "Bu kursda sxemada kamida uch qator bo'ladi: to'lov xabari, Backend tekshiruvi va natijani kim so'rashi. Odamlar roli bilan yoziladi («tashkilotchi», «xaridor») — ism emas.", ru: 'На этом курсе в схеме минимум три строки: сообщение о платеже, проверка Backend и кто спрашивает результат. Людей пишем по роли («организатор», «покупатель») — не по имени.' })}</span>
          <span>{tr({ uz: "Modelingizda pulni boshqa kompaniya to'lasa (reklama, B2B) — o'sha kompaniyani «Kim» qatoriga yozing; sxema shakli o'zgarmaydi.", ru: 'Если в вашей модели платит другая компания (реклама, B2B) — запишите её в строку «Кто»; форма схемы не меняется.' })}</span>
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 14 — FINAL (QTartib: uyalar raqamli, «bu yerga qo'ying» — tartibni ochmaydi; ball — birinchi to'liq urinish; sentinel 0) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
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
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "To'lov xabari qaysi tartibda ishlanadi?", options: ISHLASH_TARTIBI.map(z => ou(z.label)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · tartib', ru: 'Итог · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Avval bo'laklarni joylang", ru: 'Сначала разложите блоки' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>To'lov xabari <span className="italic" style={{ color: T.accent }}>qaysi tartibda</span> ishlanadi?</>, ru: <>В каком <span className="italic" style={{ color: T.accent }}>порядке</span> обрабатывается сообщение о платеже?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni bajariladigan tartibda joylang.", ru: 'Разложите блоки в порядке выполнения.' })}</Mentor>
        <div className="pw-tartib">
          <QTartib onWrong={onWrong}
            items={ISHLASH_TARTIBI.map(z => ({ id: z.id, label: tx(z.label) }))}
            joyMatn={tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}
            onSolved={solve}
            xatoMatn={tr({ uz: "Tartib mos emas — bo'lakni bosib qaytaring.", ru: 'Порядок не подходит — нажмите на блок, чтобы вернуть его.' })}
          />
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tx({ uz: "Bu misolda avval imzo, keyin takror tekshiriladi; `200` esa yozib bo'lingandan keyin qaytadi.", ru: 'В этом примере сначала проверяется подпись, потом повтор; а `200` возвращается после того, как запись сделана.' })}</p>
          {wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — 4 ta: uchta ballik savol (birinchi urinish) + bonus «Webhook Tested» (A2 4-qadam «Bajardim», uchala tekshiruv belgilangan; natijadan qat'i nazar — GATE M M-q6 A) =====
const ACHIEVEMENTS = {
  signatureGuard: { icon: '🔏', name: 'Signature Guard', desc: { uz: 'Imzosiz xabarga Backend nima qilishini topdingiz', ru: 'Вы нашли, что Backend делает с сообщением без подписи' } },
  countedOnce: { icon: '🔁', name: 'Counted Once', desc: { uz: "Takror kelgan to'lov xabariga to'g'ri javobni topdingiz", ru: 'Вы нашли верный ответ на повторное сообщение о платеже' } },
  declinedLogged: { icon: '🧾', name: 'Declined Logged', desc: { uz: "Rad etilgan to'lov qanday yozilishini topdingiz", ru: 'Вы нашли, как записывается отклонённый платёж' } },
  webhookTested: { icon: '🧪', name: 'Webhook Tested', desc: { uz: "Mashq to'lov bilan uch tekshiruvni o'zingiz o'tkazdingiz", ru: 'Вы сами провели три проверки учебной оплатой' } },
};
// Ekran id → nishon. Ballik savollar (correct = birinchi urinish) va A2 bloki (4-qadam «Bajardim» faqat uchala tekshiruv belgilangach ochiladi).
const ACH_TRIGGERS = { s5: 'signatureGuard', s8: 'countedOnce', s10: 'declinedLogged', a2: 'webhookTested' };

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


// Podium savol yorliqlari (SCORED_IDX indekslari: 3, 5, 8, 10, 14)
const Q_LABELS = {
  3: { uz: '1 — Xabarni kim yuboradi', ru: '1 — Кто отправляет сообщение' },
  5: { uz: '2 — Imzosiz xabar', ru: '2 — Сообщение без подписи' },
  8: { uz: '3 — Takror xabar', ru: '3 — Повторное сообщение' },
  10: { uz: "4 — Rad etilgan to'lov", ru: '4 — Отклонённый платёж' },
  14: { uz: 'Yakuniy — ishlash tartibi', ru: 'Итог — порядок обработки' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — MD «Fon so'zlari» (R-008: o'quvchi so'zi {uz, ru}; kod so'zlari ru'da ham o'sha)
const QZ_BG_SHAPES = [
  { ch: { uz: "to'lov xabari", ru: 'сообщение о платеже' }, l: 4, t: 8, s: 20, d: 19, dl: 0 },
  { ch: 'webhook', l: 80, t: 6, s: 26, d: 23, dl: 1.5 },
  { ch: 'POST /tolov/webhook', l: 6, t: 70, s: 18, d: 27, dl: 0.8 },
  { ch: { uz: 'imzo', ru: 'подпись' }, l: 76, t: 64, s: 24, d: 21, dl: 2.2 },
  { ch: 'X-Imzo', l: 42, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'TOLOV_KALITI', l: 60, t: 24, s: 20, d: 17, dl: 0.4 },
  { ch: { uz: 'takror xabar', ru: 'повторное сообщение' }, l: 22, t: 34, s: 20, d: 20, dl: 1.9 },
  { ch: 'tolov_raqami', l: 16, t: 16, s: 18, d: 18, dl: 2.9 },
  { ch: { uz: "rad etilgan to'lov", ru: 'отклонённый платёж' }, l: 52, t: 48, s: 18, d: 22, dl: 0.6 },
  { ch: "holat: 'rad'", l: 86, t: 40, s: 18, d: 24, dl: 1.3 },
  { ch: { uz: 'test rejim', ru: 'тестовый режим' }, l: 30, t: 56, s: 20, d: 26, dl: 2.4 },
  { ch: { uz: "mashq to'lov", ru: 'учебная оплата' }, l: 64, t: 80, s: 20, d: 21, dl: 3.1 },
  { ch: '200', l: 40, t: 6, s: 24, d: 19, dl: 1.7 },
  { ch: '401', l: 90, t: 84, s: 24, d: 23, dl: 0.9 },
  { ch: 'tolovlar', l: 4, t: 46, s: 18, d: 20, dl: 2.6 },
  { ch: 'Maydon Jamoa', l: 70, t: 92, s: 18, d: 22, dl: 3.4 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni MD bo'yicha A·B·C·D ×3 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: '7-Modulda botingiz yangi xabarni webhook bilan qanday olardi?', ru: 'Как в 7-м модуле ваш бот получал новое сообщение через webhook?' }, opts: [{ uz: "Telegram o'zi manziliga yuborardi", ru: 'Telegram сам отправлял на его адрес' }, { uz: "Bot Telegram'dan qayta so'rardi", ru: 'Бот снова спрашивал Telegram' }, { uz: 'Foydalanuvchi qo\'lda yuborardi', ru: 'Пользователь отправлял вручную' }, { uz: 'Render har daqiqa tekshirib turardi', ru: 'Render проверял каждую минуту' }], correct: 0 },
  { q: { uz: "Mentor sxemasida karta ma'lumoti qayerda qoladi?", ru: 'Где остаются данные карты в схеме Ментора?' }, opts: [{ uz: "Backend'ning jadvalida", ru: 'В таблице Backend' }, { uz: "Faqat to'lov xizmatida", ru: 'Только у платёжного сервиса' }, { uz: 'Ilovaning xotirasida', ru: 'В памяти приложения' }, { uz: 'README faylining ichida', ru: 'Внутри файла README' }], correct: 1 },
  { q: { uz: '`X-Imzo` sarlavhasida nima keladi?', ru: 'Что приходит в заголовке `X-Imzo`?' }, opts: [{ uz: "`.env` dagi kalitning o'zi", ru: 'Сам ключ из `.env`' }, { uz: 'Tashkilotchining paroli', ru: 'Пароль организатора' }, { uz: 'Kalit bilan hisoblangan imzo', ru: 'Подпись, вычисленная ключом' }, { uz: "To'lovning summasi va sanasi", ru: 'Сумма и дата платежа' }], correct: 2 },
  { q: { uz: '`TOLOV_KALITI` qiymatini qayerga yozasiz?', ru: 'Куда вы запишете значение `TOLOV_KALITI`?' }, opts: [{ uz: "README'ga, hamma ko'rib tursin", ru: 'В README, чтобы все видели' }, { uz: 'Kodga, alohida bitta qatorga', ru: 'В код, отдельной строкой' }, { uz: 'Agentga, promptning ichiga', ru: 'Агенту, внутрь промпта' }, { uz: '`.env` va Render sozlamasiga', ru: 'В `.env` и настройки Render' }], correct: 3 },
  { q: { uz: "Imzo mos keldi. Bu nimani ko'rsatadi?", ru: 'Подпись совпала. Что это показывает?' }, opts: [{ uz: 'Kalitni biladigan tomon yuborgan', ru: 'Отправила сторона, знающая ключ' }, { uz: "To'lov muvaffaqiyatli o'tgan", ru: 'Платёж прошёл успешно' }, { uz: "Summa narxga aynan to'g'ri keladi", ru: 'Сумма точно равна цене' }, { uz: 'Xabar birinchi marta kelgan', ru: 'Сообщение пришло впервые' }], correct: 0 },
  { q: { uz: "Javob yo'qolsa, Payme nima qiladi?", ru: 'Что делает Payme, если ответ потерялся?' }, opts: [{ uz: 'Shu xabarni boshqa yubormaydi', ru: 'Больше не отправляет это сообщение' }, { uz: "Xuddi shu so'rovni qayta yuboradi", ru: 'Отправляет тот же запрос снова' }, { uz: 'Yangi raqam bilan qayta yuboradi', ru: 'Отправляет снова с новым номером' }, { uz: 'Tashkilotchining ilovasiga yozadi', ru: 'Пишет в приложение организатора' }], correct: 1 },
  { q: { uz: 'Stripe takror xabar haqida nimani maslahat beradi?', ru: 'Что Stripe советует про повторные сообщения?' }, opts: [{ uz: "Har xabarni ikki marta yozib qo'yishni", ru: 'Записывать каждое сообщение дважды' }, { uz: 'Xabarlarni tartib bilan kutishni', ru: 'Ждать сообщения по порядку' }, { uz: 'Ishlangan xabar raqamlarini yozishni', ru: 'Записывать номера обработанных сообщений' }, { uz: 'Takror xabarga `401` qaytarishni', ru: 'Возвращать `401` на повтор' }], correct: 2 },
  { q: { uz: "Mentor Backend'i takror xabarni nimaga qarab taniydi?", ru: 'По чему Backend Ментора узнаёт повторное сообщение?' }, opts: [{ uz: 'Xabardagi summaga qarab', ru: 'По сумме в сообщении' }, { uz: "To'lovchining ismiga qarab", ru: 'По имени плательщика' }, { uz: 'Xabar kelgan vaqtga qarab', ru: 'По времени прихода сообщения' }, { uz: "To'lov raqamiga qarab", ru: 'По номеру платежа' }], correct: 3 },
  { q: { uz: "Bu darsdagi mashq to'lov sahifasi qayerda turadi?", ru: 'Где находится учебная страница оплаты этого урока?' }, opts: [{ uz: "Backend'ingizning ichida", ru: 'Внутри вашего Backend' }, { uz: 'Payme kompaniyasi serverida', ru: 'На сервере компании Payme' }, { uz: 'Telefoningiz xotirasida', ru: 'В памяти вашего телефона' }, { uz: "GitHub repo'ngiz sahifasida", ru: 'На странице вашего репозитория GitHub' }], correct: 0 },
  { q: { uz: "Mashq to'lov sahifasi xabarni qayerda imzolaydi?", ru: 'Где учебная страница оплаты подписывает сообщение?' }, opts: [{ uz: "Brauzerda, sahifaning o'zida", ru: 'В браузере, на самой странице' }, { uz: "Backend'da, kodning o'zida", ru: 'В Backend, в самом коде' }, { uz: 'Telefonda, ilovaning ichida', ru: 'В телефоне, внутри приложения' }, { uz: "GitHub'da, push qilingan paytda", ru: 'В GitHub, во время push' }], correct: 1 },
  { q: { uz: 'Sxemadagi «Kimga» ustuni nimani aytadi?', ru: 'Что говорит столбец «Кому» в схеме?' }, opts: [{ uz: "Kim to'lov qilganini", ru: 'Кто заплатил' }, { uz: "Qancha to'langanini", ru: 'Сколько заплачено' }, { uz: 'Ish kimga borishini', ru: 'К кому идёт действие' }, { uz: "Qachon to'langanini", ru: 'Когда заплачено' }], correct: 2 },
  { q: { uz: 'Mentor sxemasida ilova Pro holatini qayerdan biladi?', ru: 'Откуда приложение в схеме Ментора знает статус Pro?' }, opts: [{ uz: "To'lov xizmatining xabaridan", ru: 'Из сообщения платёжного сервиса' }, { uz: "To'lov sahifasining o'zidan", ru: 'С самой страницы оплаты' }, { uz: "Telefonga kelgan SMS'dan", ru: 'Из SMS на телефон' }, { uz: "Backend'dan qayta so'rab", ru: 'Заново спросив у Backend' }], correct: 3 },
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). Qolipda yo'q (qolip taklifi): {…} joyi uchun maydon va kulrang «masalan: …» (PwPrompt),
// qadam ichidagi «Yordam», «Ulgurmasangiz» qatori, tekshiruv kartasi — shu faylda. Blok bajarilgani — faqat oxirgi «Bajardim»dan (12-Modul 9.36 h);
// «Ulgurmasangiz» yo'lida «Davom etish» oldinroq ochiladi (A1 — 3-qadamdan, A2 — 2-qadamdan keyin, E 55), bayroq qo'yilmaydi.
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const trekOqi = () => { const o = lsOqi('pm-m9d8-platforma'); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
// «{avvalgidek …}» tekshiruvi: kamida ikkita ish vergul bilan; «hammasi», «ilova» kabi bitta so'z emas (ikki tilli — uz va ru so'zlari)
const BIR_SOZ = /^(hammasi|hamma|barchasi|barcha|ilova|loyiha|все|всё|приложение|проект)$/i;
const ikkiIsh = (s) => { const t = String(s || '').trim(); const bandlar = t.split(/[,;]/).map(x => x.trim()).filter(x => x.length >= 2); return bandlar.length >= 2 && !bandlar.some(x => BIR_SOZ.test(x)); };
const PwPrompt = ({ satrlar, joylar = [], qiymat = {}, onYoz, tekshir }) => {
  const [ok, setOk] = useState(false);
  const [xato, setXato] = useState(null);
  const almash = (s) => joylar.reduce((a, j) => { const v = String(qiymat[j.id] || '').trim(); return v ? a.split(tr(j.joy)).join(v) : a; }, s);
  const matn = satrlar.map(l => almash(tr(l)));
  // {…} joyi — faqat bo'shliqsiz boshlanadigan qavs (kod ichidagi `{ ok: true }` kabi obyekt joy emas, fmtCode juftligi buzilmasin)
  const joy = (t, li) => t.split(/(\{[^}\s][^}]*\})/g).map((p, i) => (/^\{[^\s].*\}$/.test(p) ? <span key={li + '-' + i} className="q-joy">{p}</span> : <React.Fragment key={li + '-' + i}>{fmtCode(p)}</React.Fragment>));
  const nusxa = async () => {
    const x = tekshir ? tekshir(qiymat) : null;
    if (x) { setXato(x); return; }
    setXato(null);
    try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="q-prompt pw-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa pw-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="pw-ps">{l.split('\n').map((s, k) => <span key={k} className="pw-ps-q">{joy(s, i + '-' + k)}</span>)}</span>)}
      {joylar.length > 0 && <span className="pw-joylar">{joylar.map(j => (
        <label key={j.id} className="pw-joy-m"><span className="pw-joy-n">{tr(j.joy)}</span>
          {j.kop ? <textarea rows={4} value={qiymat[j.id] || ''} placeholder={tr(j.namuna)} onChange={e => { setXato(null); onYoz(j.id, e.target.value); }} />
            : <input type="text" value={qiymat[j.id] || ''} maxLength={200} placeholder={tr(j.namuna)} onChange={e => { setXato(null); onYoz(j.id, e.target.value); }} />}</label>))}</span>}
      {xato && <span className="pw-xato" role="status">{tr(xato)}</span>}
    </span>
  );
};
const Yordam = ({ satrlar, sarlavha }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <span className="pw-yordam-ust">
      <QTugma ikkinchi className="pw-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="pw-yordam fade-step">{sarlavha && <b>{tr(sarlavha)}</b>}{satrlar.map((l, i) => <span key={i} className="pw-yordam-s">{tx(l)}</span>)}</span>}
    </span>
  );
};
// Telefonda blok qadami (13-Modul sinf-supurish A): Stage eng pastga surmaydi — natija maketi ostida joriy band va tugash xulosasi ekrandan tepada qolardi.
// Joriy band boshi kontent tepasiga (16 px), tugash xulosasi markazga suriladi.
const telBlokSur = (tugadi) => {
  const bajarilgan = document.querySelectorAll('.q-blok-q.bajarildi');
  const el = tugadi ? document.querySelector('.q-blok-tugadi') || bajarilgan[bajarilgan.length - 1] : document.querySelector('.q-blok-q.joriy');
  const c = el && el.closest('.stage-content');
  if (!c) return;
  const cr = c.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const markaz = tugadi && r.height < cr.height - 32;
  const delta = markaz ? (r.top + r.bottom) / 2 - (cr.top + cr.bottom) / 2 : r.top - cr.top - 16;
  c.scrollTo({ top: c.scrollTop + delta, behavior: kamHarakat() ? 'auto' : 'smooth' });
};
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, izoh, ulgur, ulgurQadam = 99, qulf, ustoz, extra }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam;
  const qulfli = !done && !!qulf && qulf(stepN);
  const bajardim = () => {
    if (isMentorLive || done || qulfli) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, ...(extra ? extra() : {}) });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const birinchi = useRef(stepN); // oldingi qadam: StrictMode ikkinchi chaqiruvida ham ochilishda surilmaydi
  const tor = useIsMobile(768);
  useEffect(() => {
    if (birinchi.current === stepN) { return; }
    birinchi.current = stepN;
    const t = setTimeout(() => { if (tor) { telBlokSur(done); return; } const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, tor ? 420 : 120); // telefonda — Mentor yig'ilish o'tishidan (0,38 s) keyin
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={tor ? 0 : stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cx('pw-blok', qulfli && 'qulf')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={steps.map(c => ({ h: tr(c.h), t: c.t, xato: c.xato }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<>{done && izoh && <QIzoh>{tr(izoh)}</QIzoh>}<MentorPracticeStats live={_live} screen={screen} /></>}>
          {ortda && <p className="pw-ortda">{tx(ortda)}</p>}
          {ulgur && !done && <p className="pw-ulgur">{tx(ulgur)}</p>}
          {ustoz && isMentorLive && <div className="pw-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{ustoz.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>}
        </QBlok>
      </div>
    </Stage>
  );
}
const Band = ({ children }) => <span className="pw-band">{children}</span>;
const Kulrang = ({ children }) => <span className="pw-kulrang">{children}</span>;
const KodPrompt = ({ satrlar }) => <PwPrompt satrlar={satrlar} />;

// --- 1-amaliyot: kutilgan natija — fayl kartasi, `git grep` natijasi (faqat nom), Neon jadvali (olti ustun, 0 qator)
const A1_FAYLLAR = [['backend/src/tolov/…', { uz: "yangi papka: jadval va yo'l", ru: 'новая папка: таблица и путь' }], ['backend/src/main.ts', { uz: "o'zgardi — xom tana", ru: 'изменён — сырое тело' }], ['backend/.env.example', { uz: '+ TOLOV_KALITI=, qiymatsiz', ru: '+ TOLOV_KALITI=, без значения' }], ['README.md', { uz: "o'zgaruvchilar: + TOLOV_KALITI", ru: 'переменные: + TOLOV_KALITI' }]];
const NEON_USTUN = ['id', 'tolov_raqami', 'oyinchi_id', 'summa', 'holat', 'yaratilgan'];
const NeonJadval = ({ qatorlar = [] }) => (
  <div className="pw-neon">
    <span className="pw-neon-b"><b>Neon SQL Editor</b><code>tolovlar</code><em>{tr(TOLOV_SAHNA.qatorSoni(qatorlar.length))}</em></span>
    <div className="pw-neon-t" style={{ gridTemplateColumns: `repeat(${NEON_USTUN.length}, max-content)` }}>
      {NEON_USTUN.map(u => <span key={u} className="sar">{u}</span>)}
      {qatorlar.map((r, i) => r.map((c, k) => <span key={i + '-' + k} className={cx(c === 'rad' && 'rad')}>{c}</span>))}
    </div>
  </div>
);
const A1Natija = () => (
  <div className="pw-an">
    <div className="pw-fayllar">{A1_FAYLLAR.map(([n, h]) => <span key={n} className="pw-fayl"><code>{n}</code><em>{tr(h)}</em></span>)}</div>
    <div className="pw-term"><span className="buyruq">$ git grep -n "TOLOV_KALITI"</span><span>backend/src/tolov/…: process.env.TOLOV_KALITI</span><span>backend/.env.example:…: TOLOV_KALITI=</span><span>README.md:…: TOLOV_KALITI</span></div>
    <NeonJadval />
  </div>
);
const A1_PROMPT = [
  { uz: "Qayerda: `backend/` — yangi jadval `tolovlar` va yangi yo'l `POST /tolov/webhook`.", ru: 'Где: `backend/` — новая таблица `tolovlar` и новый путь `POST /tolov/webhook`.' },
  { uz: "Nima qilsin: `tolovlar` ustunlari — `id`, `tolov_raqami` (noyob: bitta raqam jadvalda bir marta), {to'lovchi hisobi}, `summa` (so'mda), `holat` (`tolandi` yoki `rad`), `yaratilgan`. Jadvalni loyihadagi avvalgi jadvallar qanday yaratilgan bo'lsa, shunday yarat.", ru: 'Что сделать: столбцы `tolovlar` — `id`, `tolov_raqami` (уникальный: один номер в таблице один раз), {счёт плательщика}, `summa` (в сумах), `holat` (`tolandi` или `rad`), `yaratilgan`. Создай таблицу так же, как созданы прежние таблицы проекта.' },
  { uz: "`POST /tolov/webhook` tanasi — `{ tolovRaqami, holat, summa }` va to'lovchi hisobi; sarlavha `X-Imzo`. Tartib: 1) imzoni tekshir" + " — HMAC SHA-256, so'rovning xom tanasi bo'yicha, kalit `.env` dagi `TOLOV_KALITI`; imzolarni `timingSafeEqual` bilan solishtir — undan oldin `X-Imzo` 64 belgili hex ekanini tekshir; imzo yo'q, shakli noto'g'ri yoki mos kelmasa — `401` va hech narsa yozma; `TOLOV_KALITI` bo'sh bo'lsa ham hech bir xabarni qabul qilma.", ru: 'Тело `POST /tolov/webhook` — `{ tolovRaqami, holat, summa }` и счёт плательщика; заголовок `X-Imzo`. Порядок: 1) проверь подпись — HMAC SHA-256 по сырому телу запроса, ключ `TOLOV_KALITI` из `.env`; сравнивай подписи через `timingSafeEqual` — перед этим проверь, что `X-Imzo` — hex из 64 символов; если подписи нет, формат неверный или не совпадает — `401` и ничего не записывай; если `TOLOV_KALITI` пуст — не принимай ни одного сообщения.' },
  { uz: "2) maydonlarni tekshir: `tolovRaqami` bo'sh emas, `summa` musbat butun son, to'lovchi hisobi mavjud, `holat` faqat `tolandi` yoki `rad` — aks holda `400`. 3) shu `tolovRaqami` jadvalda bor bo'lsa — yozma, `200 { takror: true }` qaytar. 4) aks holda qatorni `holat` bilan yoz va `200 { ok: true }` qaytar; `rad` bo'lsa ham yoziladi, boshqa hech narsa o'zgarmaydi. Ikki bir xil xabar bir vaqtda kelib, jadvaldagi noyoblik ikkinchisini to'xtatsa — unga ham `200 { takror: true }` qaytar, `500` emas.", ru: '2) проверь поля: `tolovRaqami` не пустой, `summa` — целое положительное число, счёт плательщика существует, `holat` только `tolandi` или `rad` — иначе `400`. 3) если такой `tolovRaqami` уже есть в таблице — не записывай, верни `200 { takror: true }`. 4) иначе запиши строку с `holat` и верни `200 { ok: true }`; `rad` тоже записывается, больше ничего не меняется. Если два одинаковых сообщения пришли одновременно и уникальность таблицы остановила второе — ему тоже верни `200 { takror: true }`, а не `500`.' },
  { uz: "Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin. `TOLOV_KALITI` qiymatini kodga, logga va README'ga yozma — faqat `.env` dan o'qi; `backend/.env.example` va README'dagi o'zgaruvchilar ro'yxatiga nomini qiymatsiz qo'sh. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: {что должно работать как раньше} работает как раньше. Не пиши значение `TOLOV_KALITI` в код, лог и README — читай только из `.env`; добавь имя без значения в `backend/.env.example` и в список переменных README. Не трогай файлы `.env`. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_JOYLAR = [
  { id: 'hisob', joy: { uz: "{to'lovchi hisobi}", ru: '{счёт плательщика}' }, namuna: { uz: 'masalan: oyinchi_id — oyinchilar jadvalidagi hisob (tanada oyinchiId)', ru: 'например: oyinchi_id — счёт из таблицы oyinchilar (в теле oyinchiId)' } },
  { id: 'avval', joy: { uz: "{avvalgidek ishlashi kerak bo'lgan ishlar}", ru: '{что должно работать как раньше}' }, namuna: { uz: "masalan: kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar", ru: 'например: вход, объявление игры, присоединение, реальное время и напоминания' } }
];
const A1_YORDAM = [
  A1_PROMPT[0],
  { uz: "Nima qilsin: `tolovlar` ustunlari — `id`, `tolov_raqami` (noyob: bitta raqam jadvalda bir marta), `oyinchi_id` — `oyinchilar` jadvalidagi hisob (tanada `oyinchiId`), `summa` (so'mda), `holat` (`tolandi` yoki `rad`), `yaratilgan`. Jadvalni loyihadagi avvalgi jadvallar qanday yaratilgan bo'lsa, shunday yarat.", ru: 'Что сделать: столбцы `tolovlar` — `id`, `tolov_raqami` (уникальный: один номер в таблице один раз), `oyinchi_id` — счёт из таблицы `oyinchilar` (в теле `oyinchiId`), `summa` (в сумах), `holat` (`tolandi` или `rad`), `yaratilgan`. Создай таблицу так же, как созданы прежние таблицы проекта.' },
  { uz: "`POST /tolov/webhook` tanasi — `{ tolovRaqami, holat, summa, oyinchiId }`; sarlavha `X-Imzo`. Tartib: 1) imzoni tekshir" + " — HMAC SHA-256, so'rovning xom tanasi bo'yicha, kalit `.env` dagi `TOLOV_KALITI`; imzolarni `timingSafeEqual` bilan solishtir — undan oldin `X-Imzo` 64 belgili hex ekanini tekshir; imzo yo'q, shakli noto'g'ri yoki mos kelmasa — `401` va hech narsa yozma; `TOLOV_KALITI` bo'sh bo'lsa ham hech bir xabarni qabul qilma.", ru: 'Тело `POST /tolov/webhook` — `{ tolovRaqami, holat, summa, oyinchiId }`; заголовок `X-Imzo`. Порядок: 1) проверь подпись — HMAC SHA-256 по сырому телу запроса, ключ `TOLOV_KALITI` из `.env`; сравнивай подписи через `timingSafeEqual` — перед этим проверь, что `X-Imzo` — hex из 64 символов; если подписи нет, формат неверный или не совпадает — `401` и ничего не записывай; если `TOLOV_KALITI` пуст — не принимай ни одного сообщения.' },
  A1_PROMPT[3],
  { uz: "Nima buzilmasin: kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar avvalgidek ishlasin. `TOLOV_KALITI` qiymatini kodga, logga va README'ga yozma — faqat `.env` dan o'qi; `backend/.env.example` va README'dagi o'zgaruvchilar ro'yxatiga nomini qiymatsiz qo'sh. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход, объявление игры, присоединение, реальное время и напоминания работают как раньше. Не пиши значение `TOLOV_KALITI` в код, лог и README — читай только из `.env`; добавь имя без значения в `backend/.env.example` и в список переменных README. Не трогай файлы `.env`. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_KOD_PROMPT = [{ uz: "Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: imzo tekshiriladigan qator, to'lov raqami jadvalda bor-yo'qligi tekshiriladigan qator va qator yoziladigan joy. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в написанном коде три места с именем файла и номером строки: строку проверки подписи, строку, где проверяется, есть ли номер платежа в таблице, и место записи строки. Объясни одной фразой, что делает каждое. Код не меняй.' }];
const ScreenA1 = (props) => {
  const [q, setQ] = useState({});
  const yoz = (k, v) => setQ(o => ({ ...o, [k]: v }));
  const tekshir = (v) => (ikkiIsh(v.avval) ? null : { uz: "Ikkita aniq ish yozing: masalan, kirish, e'lon berish.", ru: 'Напишите два конкретных дела: например, вход, объявление игры.' });
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z repo'ngiz", ru: 'Практика 1 · ваш репозиторий' }}
      title={{ uz: <>Backend'ingiz to'lov xabarini <span className="italic" style={{ color: T.accent }}>tekshirib qabul qilsin</span>.</>, ru: <>Пусть ваш Backend <span className="italic" style={{ color: T.accent }}>принимает сообщение о платеже с проверкой</span>.</> }}
      mentor={{ uz: "Talab tayyor — ikki joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.", ru: 'Требование готово — два места заполните под свой продукт; начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tx({ uz: "Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin; ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»", ru: 'Откройте свой репозиторий в Antigravity. В терминале `git status`: файлов `.env` в списке быть не должно; если видны — агенту: «Добавь файлы `.env` в `.gitignore`.»' })}
          <Band>{tx({ uz: "Keyin `git ls-files backend/.env` — natija bo'sh bo'lishi kerak (fayl Git'da kuzatilmayapti); fayl nomi chiqsa — o'qituvchiga ayting: kalitlar almashtiriladi.", ru: 'Затем `git ls-files backend/.env` — результат должен быть пустым (файл не отслеживается Git); если появилось имя файла — скажите учителю: ключи заменят.' })}</Band>
          <Band>{txW({ uz: "`backend/.env` ga yangi qator yozing: `TOLOV_KALITI=` va tasodifiy uzun kalit — uni terminalda yarating: `node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"` (64 belgili harf-raqam chiqadi); o'zingiz o'ylagan so'z yoki parolingiz emas. Shu nom va qiymatni Render'da xizmatingizning Environment bo'limiga qo'shib saqlang.", ru: 'Добавьте в `backend/.env` новую строку: `TOLOV_KALITI=` и случайный длинный ключ — создайте его в терминале: `node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"` (выйдет 64 буквы и цифры); не придуманное слово и не ваш пароль. Эти имя и значение добавьте и сохраните в разделе Environment вашего сервиса на Render.' })}</Band>
          <Band><b>{tr({ uz: "Kalitni agentga, chatga, README'ga va skrinshotga yozmang", ru: 'Не пишите ключ агенту, в чат, в README и на скриншот' })}</b>{tr({ uz: " — agent faqat uning nomini biladi. Bu blok ikkala trekda bir xil: o'zgarish faqat ", ru: ' — агент знает только его имя. Этот блок одинаков в обоих треках: изменения только в ' })}{fmtCode('`backend/`')}{tr({ uz: ' da.', ru: '.' })}</Band></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' })}
          <PwPrompt satrlar={A1_PROMPT} joylar={A1_JOYLAR} qiymat={q} onYoz={yoz} tekshir={tekshir} />
          <Kulrang>{tx({ uz: "Haqiqiy Backend'da oxirgi himoya — Database: noyob `tolov_raqami` bir xil xabarni ikkinchi marta yozdirmaydi.", ru: 'В настоящем Backend последняя защита — Database: уникальный `tolov_raqami` не даст записать одно и то же сообщение второй раз.' })}</Kulrang>
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq talab", ru: 'Полное требование из примера Ментора' }} satrlar={A1_YORDAM} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"tolov webhook\"`, `git push`.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают со списком агента, `.env` в списке нет; добавьте каждый файл через `git add <fayl>`, `git commit -m "tolov webhook"`, `git push`.' })}
          <Band>{tr({ uz: "Render Backend'ning yangi versiyasini chiqaradi — Render sahifasida tugashini kuting (bir necha daqiqa cho'zilishi mumkin).", ru: 'Render выпустит новую версию Backend — дождитесь окончания на странице Render (может занять несколько минут).' })}</Band>
          <Band>{tr({ uz: "Kutayotganda agentdan yozgan kodidagi uch joyni ko'rsatishni so'rang — darsda ko'rgan tartibni o'z loyihangizda topasiz:", ru: 'Пока ждёте, попросите агента показать три места в написанном коде — найдёте в своём проекте порядок, который видели на уроке:' })}</Band>
          <KodPrompt satrlar={A1_KOD_PROMPT} /></>,
          xato: tx({ uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Вышла такая ошибка: {ошибка}. Исправь.»' }) },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "talabning har gapini o'zingiz ko'ring. Mentor misolida:", ru: 'проверьте сами каждую фразу требования. В примере Ментора:' })}
          <Band>{tr({ uz: "(1) Agent ko'rsatgan uch qatorni oching: tartib — avval imzo, keyin to'lov raqami, keyin yozuv.", ru: '(1) Откройте три строки, которые показал агент: порядок — сначала подпись, потом номер платежа, потом запись.' })}</Band>
          <Band>{tx({ uz: "(2) Terminalda `git grep -n \"TOLOV_KALITI\"`: natijada faqat nom bo'lsin (`process.env.TOLOV_KALITI`, `.env.example` va README qatori). Kalitning o'zi chiqsa — agentga «Kalit qiymatini koddan olib tashla, faqat `.env` dan o'qi.» deng, `.env` va Render'da kalitni yangisiga almashtiring.", ru: '(2) В терминале `git grep -n "TOLOV_KALITI"`: в результате должно быть только имя (`process.env.TOLOV_KALITI`, строки `.env.example` и README). Если виден сам ключ — скажите агенту «Убери значение ключа из кода, читай только из `.env`.», и замените ключ на новый в `.env` и на Render.' })}</Band>
          <Band>{tx({ uz: "(3) Neon SQL Editor'da `SELECT id, tolov_raqami, oyinchi_id, summa, holat, yaratilgan FROM tolovlar;` (to'lovchi hisobi ustuni — talabingizdagi nom) — jadval bor va bo'sh, olti ustun ko'rinadi; ustun yo'q bo'lsa Neon xato beradi. Jadval yo'q bo'lsa — Render'da yangi versiya tugaganini ko'ring, keyin agentga: «`tolovlar` jadvali Neon'da yo'q. Avvalgi jadvallar qanday yaratilgan bo'lsa, shunday yarat va nima qilganingni ayt.»", ru: '(3) В Neon SQL Editor: `SELECT id, tolov_raqami, oyinchi_id, summa, holat, yaratilgan FROM tolovlar;` (столбец счёта плательщика — имя из вашего требования) — таблица есть и пуста, видно шесть столбцов; если столбца нет, Neon выдаст ошибку. Если таблицы нет — убедитесь, что новая версия на Render готова, затем агенту: «Таблицы `tolovlar` нет в Neon. Создай так же, как прежние таблицы, и скажи, что сделал.»' })}</Band>
          <Band>{tr({ uz: "Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Несовпавшее напишите агенту: «{что} не как в требовании: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»' })}</Band></> }
      ]}
      natija={<A1Natija />}
      ortda={{ uz: "Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-03-done` — oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` ga o'z qiymatlaringizni yozasiz (`TOLOV_KALITI` ham).", ru: 'Отстали? Откройте пример Ментора вне своего репозитория, в новой папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-03-done` — последнюю команду запускайте только в этой новой папке: она стирает изменения в папке. В `backend/.env` впишите свои значения (и `TOLOV_KALITI`).' }}
      ulgur={{ uz: "Ulgurmasangiz: Render kutishi cho'zilsa — 4-qadamning (3) Neon tekshiruvi uyda; 3-qadamdan keyin «Davom etish» ochiladi — 2-amaliyotga o'ting. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: затянулось ожидание Render — проверку (3) в Neon из шага 4 сделайте дома; после шага 3 откроется «Продолжить» — переходите ко 2-й практике. Блок считается выполненным после «Готово» на шаге 4.' }}
      ulgurQadam={3}
      doneText={{ uz: "Yo'l va jadval qurildi — ular qanday ishlashini mashq to'lov bilan tekshirasiz.", ru: 'Путь и таблица построены — как они работают, проверите учебной оплатой.' }}
      izoh={{ uz: "Kodni agent yozdi — to'g'ri ishlashini 2-amaliyotdagi uch tekshiruv ko'rsatadi.", ru: 'Код написал агент — правильно ли он работает, покажут три проверки во 2-й практике.' }}
      ustoz={[
        { uz: "Xom tana — NestJS `rawBody: true`: agent `main.ts` ni o'zgartiradi; o'quvchi so'rasa — «imzo xabar matnining o'zidan hisoblanadi, shuning uchun matn o'zgarmasdan olinadi». Jadval yaratilishi — 11-Modul loyihasidagi usulga qarab (agent aytadi).", ru: 'Сырое тело — NestJS `rawBody: true`: агент меняет `main.ts`; если ученик спросит — «подпись считается по самому тексту сообщения, поэтому текст берётся без изменений». Создание таблицы — как в проекте 11-го модуля (агент скажет).' },
        { uz: "Kalit qiymati ekranda, chatda yoki loyihada ko'rinib qolsa — yangisi qo'yiladi (`.env` va Render); eskisi ishlatilmaydi.", ru: 'Если значение ключа засветилось на экране, в чате или в проекте — ставим новый (`.env` и Render); старый не используем.' },
        { uz: "`timingSafeEqual` uzunligi har xil buferlarda xato tashlaydi — shuning uchun talabda avval imzo shakli tekshiriladi. `git ls-files` da `.env` chiqsa — u ilgari Git'ga tushgan: kalitlar (Neon, JWT, sanoq, to'lov) yangisiga almashtiriladi.", ru: '`timingSafeEqual` выбрасывает ошибку на буферах разной длины — поэтому в требовании сначала проверяется формат подписи. Если `git ls-files` показал `.env` — он раньше попал в Git: ключи (Neon, JWT, счётчик, оплата) меняем на новые.' }
      ]} />
  );
};

// --- 2-amaliyot: tekshiruv kartasi (3 ta, bittadan): «Kutilganidek» → true, «Boshqacha» → false; saqlanadi pm-m11d3-oqim.test (har bosishda)
const TEKSHIRUVLAR = [
  { id: 'imzo', nom: { uz: 'Imzo', ru: 'Подпись' }, bos: { uz: '«Imzosiz yuborish»', ru: '«Imzosiz yuborish» (без подписи)' },
    kut: { uz: "sahifada javob `401` bo'lishi kerak; Neon'da `SELECT tolov_raqami, holat FROM tolovlar ORDER BY yaratilgan DESC;` — yangi qator yo'q.", ru: 'на странице ответ должен быть `401`; в Neon `SELECT tolov_raqami, holat FROM tolovlar ORDER BY yaratilgan DESC;` — новой строки нет.' } },
  { id: 'takror', nom: { uz: 'Takror', ru: 'Повтор' }, bos: { uz: '«Ikki marta yuborish»', ru: '«Ikki marta yuborish» (дважды)' },
    kut: { uz: "birinchi javob `200 { ok: true }`, ikkinchisi `200 { takror: true }`; `tolovlar` da shu raqam bilan bitta qator.", ru: 'первый ответ `200 { ok: true }`, второй `200 { takror: true }`; в `tolovlar` одна строка с этим номером.' } },
  { id: 'rad', nom: { uz: 'Rad', ru: 'Отказ' }, bos: { uz: '«Rad etish (mashq)»', ru: '«Rad etish (mashq)» (отклонить)' },
    kut: { uz: "javob `200`; `tolovlar` da yangi qator, holati `rad`.", ru: 'ответ `200`; в `tolovlar` новая строка, статус `rad`.' } }
];
const testOqi = () => { const o = lsOqi(OQIM_KALIT); const t = o && o.test && typeof o.test === 'object' ? o.test : {}; return { imzo: t.imzo ?? null, takror: t.takror ?? null, rad: t.rad ?? null }; };
const testYoz = (t) => { const o = lsOqi(OQIM_KALIT); lsYoz(OQIM_KALIT, { ...(o && typeof o === 'object' ? o : { qatorlar: [] }), test: t, savedAt: Date.now() }); };
const TekshiruvKarta = ({ test, onBelgi }) => {
  const joriy = TEKSHIRUVLAR.findIndex(t => test[t.id] === null);
  const [ochiq, setOchiq] = useState(null);
  const k = ochiq !== null ? ochiq : joriy;
  return (
    <span className="pw-tk">
      {TEKSHIRUVLAR.map((t, i) => {
        const v = test[t.id];
        if (i === k) return (
          <span key={t.id} className="pw-tk-karta fade-step">
            <span className="pw-tk-n">{i + 1} / 3 · <b>{tr(t.nom)}</b></span>
            <span className="pw-tk-q"><em>{tr({ uz: 'Bosing', ru: 'Нажмите' })}</em>{tr(t.bos)}</span>
            <span className="pw-tk-q"><em>{tr({ uz: 'Kutiladi', ru: 'Ожидается' })}</em>{tx(t.kut)}</span>
            <span className="pw-tk-btnlar pw-chorla">
              <button type="button" className={cx('q-chip pw-tk-btn', v === true && 'ok')} onClick={() => { onBelgi(t.id, true); setOchiq(null); }}>{tr({ uz: 'Kutilganidek', ru: 'Как ожидалось' })}</button>
              <button type="button" className={cx('q-chip pw-tk-btn', v === false && 'err')} onClick={() => { onBelgi(t.id, false); setOchiq(null); }}>{tr({ uz: 'Boshqacha', ru: 'По-другому' })}</button>
            </span>
          </span>
        );
        if (v === null) return null;
        return <button key={t.id} type="button" className={cx('pw-tk-ix', v ? 'ok' : 'err')} onClick={() => setOchiq(i)}><i>{v ? '✓' : '✕'}</i>{tr(t.nom)} — {tr(v ? { uz: 'Kutilganidek', ru: 'Как ожидалось' } : { uz: 'Boshqacha', ru: 'По-другому' })}</button>;
      })}
    </span>
  );
};
const A2Natija = () => (
  <div className="pw-an">
    <div className="pw-brauzer">
      <span className="pw-brz-bar"><i /><i /><i /><code>{TOLOV_SAHNA.manzil}</code></span>
      <div className="pw-brz-tana">
        <b className="pw-m-sar">{tr(MASHQ_SAHIFA.sarlavha)}</b>
        <span className="pw-m-test">{tr(MASHQ_SAHIFA.test)}</span>
        <span className="pw-m-nom"><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b> — {tr(MASHQ_SAHIFA.mahsulot)} · {tr(MASHQ_SAHIFA.summa)} <em>{tr(MASHQ_SAHIFA.taxmin)}</em></span>
        <span className="pw-brz-btnlar">{['tolash', 'rad', 'ikki', 'imzosiz'].map(b => <span key={b} className="pw-brz-btn">{tr(MASHQ_SAHIFA[b])}</span>)}</span>
      </div>
    </div>
    <div className="pw-javoblar">
      <span>{tr(MASHQ_SAHIFA.imzosiz)} — <code className="err">401</code></span>
      <span>{tr(MASHQ_SAHIFA.ikki)} — <code className="ok">{'200 { ok: true }'}</code> · <code className="ok">{'200 { takror: true }'}</code></span>
      <span>{tr(MASHQ_SAHIFA.rad)} — <code className="ok">{'200 { ok: true }'}</code></span>
    </div>
    <NeonJadval qatorlar={[['…', 'm-…', '7', '10000', 'tolandi', '…'], ['…', 'm-…', '7', '10000', 'rad', '…']]} />
    <div className="pw-readme-k">
      <b>README.md · {tr({ uz: "«To'lov»", ru: '«To\'lov»' })}</b>
      <span className="pw-rk-s">{tr({ uz: "Reja: to'lov oqimi", ru: 'Reja: to\'lov oqimi (план)' })}</span>
      <div className="pw-rk-t">{MENTOR_SXEMA.map(r => <React.Fragment key={r.id}><span>{tr(r.kim)}</span><span>{tx(r.nima)}</span><span>{tr(KIMGA[r.kimga])}</span></React.Fragment>)}</div>
      <span className="pw-rk-h">{tx({ uz: "Hozir ishlaydi: to'lov xabari `POST /tolov/webhook` da qabul qilinadi va `tolovlar` ga yoziladi; Pro va ilova hali o'zgarmaydi. Test rejim: pul yechilmaydi.", ru: 'Hozir ishlaydi (сейчас работает): сообщение о платеже принимается в `POST /tolov/webhook` и записывается в `tolovlar`; Pro и приложение пока не меняются. Тестовый режим: деньги не списываются.' })}</span>
    </div>
  </div>
);
const A2_PROMPT = (sxema) => [
  { uz: "Qayerda: `backend/` — yangi sahifa `GET /tolov-mashq` (oddiy HTML, Backend'ning o'zi beradi) va `README.md` — yangi «To'lov» bo'limi.", ru: 'Где: `backend/` — новая страница `GET /tolov-mashq` (простой HTML, отдаёт сам Backend) и `README.md` — новый раздел «To\'lov».' },
  { uz: "Nima qilsin: sahifa manzildagi `oyinchi` va `summa` ni oladi. Sahifada: sarlavha «Mashq to'lov», ostida «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.», keyin «{nima uchun to'lov}» va summa. Karta yoki boshqa to'lov ma'lumoti so'raladigan maydon bo'lmasin; Payme yoki Click nomi va ko'rinishi ishlatilmasin.", ru: 'Что сделать: страница берёт из адреса `oyinchi` и `summa`. На странице: заголовок «Mashq to\'lov», под ним «Bu sahifa — mashq. Karta so\'ralmaydi, pul yechilmaydi.», затем «{за что платят}» и сумма. Полей для карты или других платёжных данных быть не должно; название и вид Payme или Click не использовать.' },
  { uz: "To'rt tugma: «To'lash (mashq)» — yangi to'lov raqami, holat `tolandi` · «Rad etish (mashq)» — yangi raqam, holat `rad` · «Ikki marta yuborish» — bitta raqam bilan bir xil xabar ikki marta · «Imzosiz yuborish» — `X-Imzo` sarlavhasisiz.", ru: 'Четыре кнопки: «To\'lash (mashq)» — новый номер платежа, статус `tolandi` · «Rad etish (mashq)» — новый номер, статус `rad` · «Ikki marta yuborish» — одно и то же сообщение с одним номером дважды · «Imzosiz yuborish» — без заголовка `X-Imzo`.' },
  { uz: "Har tugma bosilganda yangi to'lov raqami (`m-` bilan boshlansin). Xabarni Backend'da bitta JSON satr qilib yasasin, aynan shu satrni `TOLOV_KALITI` bilan imzolasin va aynan shu satrni tana qilib o'zining `POST /tolov/webhook` manziliga haqiqiy so'rov qilib yuborsin — kalit brauzerga chiqmasin. Sahifada har yuborishning javobi ko'rinsin: holat kodi va tanasi.", ru: 'При каждом нажатии — новый номер платежа (начинается с `m-`). Пусть сообщение собирается в Backend одной строкой JSON, именно эта строка подписывается `TOLOV_KALITI` и именно она отправляется телом настоящим запросом на свой `POST /tolov/webhook` — ключ в браузер не попадает. На странице виден ответ на каждую отправку: код статуса и тело.' },
  { uz: "`README.md` dagi «To'lov» bo'limiga «Reja: to'lov oqimi» sarlavhasini va uning ostiga pastdagi qatorlarni uch ustunli jadval qilib yoz: kim · nima qiladi · kimga. So'zlarimni o'zgartirma, qator qo'shma.", ru: 'В раздел «To\'lov» в `README.md` запиши заголовок «Reja: to\'lov oqimi» и под ним строки ниже таблицей из трёх столбцов: кто · что делает · кому. Мои слова не меняй, строк не добавляй.' },
  sxema,
  { uz: "Jadval ostiga «Hozir ishlaydi:» bilan boshlanadigan bitta qator yoz: {hozirgi holat}", ru: 'Под таблицей напиши одну строку, начинающуюся с «Hozir ishlaydi:»: {текущее состояние}' },
  { uz: "Nima buzilmasin: `POST /tolov/webhook` dagi tekshiruvlar o'zgarmasin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: проверки в `POST /tolov/webhook` не меняются. Значение `TOLOV_KALITI` никуда не пиши. Не трогай файлы `.env`. Больше ничего не трогай, назови изменённые файлы.' }
];
const SXEMA_JOY = { uz: '{sxema qatorlari}', ru: '{строки схемы}' };
const A2_JOYLAR = [
  { id: 'nima', joy: { uz: "{nima uchun to'lov}", ru: '{за что платят}' }, namuna: { uz: 'masalan: Maydon Jamoa — Pro, 30 kun', ru: 'например: Maydon Jamoa — Pro, 30 дней' } },
  { id: 'sxema', kop: true, joy: SXEMA_JOY, namuna: { uz: 'masalan: To\'lov xizmati | to\'lov xabarini yuboradi: POST /tolov/webhook | Backend', ru: 'например: Платёжный сервис | отправляет сообщение о платеже: POST /tolov/webhook | Backend' } },
  { id: 'hozir', joy: { uz: '{hozirgi holat}', ru: '{текущее состояние}' }, namuna: { uz: "masalan: to'lov xabari qabul qilinadi va yoziladi; boshqa hech narsa o'zgarmaydi. Test rejim: pul yechilmaydi.", ru: 'например: сообщение о платеже принимается и записывается; больше ничего не меняется. Тестовый режим: деньги не списываются.' } }
];
const A2_YORDAM = [
  A2_PROMPT(null)[0],
  { uz: "Nima qilsin: sahifa manzildagi `oyinchi` va `summa` ni oladi. Sahifada: sarlavha «Mashq to'lov», ostida «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.», keyin «Maydon Jamoa — Pro, 30 kun» va summa. Karta yoki boshqa to'lov ma'lumoti so'raladigan maydon bo'lmasin; Payme yoki Click nomi va ko'rinishi ishlatilmasin.", ru: 'Что сделать: страница берёт из адреса `oyinchi` и `summa`. На странице: заголовок «Mashq to\'lov», под ним «Bu sahifa — mashq. Karta so\'ralmaydi, pul yechilmaydi.», затем «Maydon Jamoa — Pro, 30 kun» и сумма. Полей для карты или других платёжных данных быть не должно; название и вид Payme или Click не использовать.' },
  A2_PROMPT(null)[2], A2_PROMPT(null)[3], A2_PROMPT(null)[4],
  ...MENTOR_SXEMA.map(r => ({ uz: `${r.kim.uz} | ${r.nima.uz.split('`').join('')} | ${KIMGA[r.kimga].uz}`, ru: `${r.kim.ru} | ${r.nima.ru.split('`').join('')} | ${KIMGA[r.kimga].ru}` })),
  { uz: "Jadval ostiga «Hozir ishlaydi:» bilan boshlanadigan bitta qator yoz: to'lov xabari `POST /tolov/webhook` da qabul qilinadi va `tolovlar` ga yoziladi; Pro va ilova hali o'zgarmaydi. Test rejim: pul yechilmaydi.", ru: 'Под таблицей напиши одну строку, начинающуюся с «Hozir ishlaydi:»: сообщение о платеже принимается в `POST /tolov/webhook` и записывается в `tolovlar`; Pro и приложение пока не меняются. Тестовый режим: деньги не списываются.' },
  A2_PROMPT(null)[7]
];
const A2_KOD_PROMPT = [{ uz: "Mashq sahifasining kodida ikki joyni fayl nomi va qator raqami bilan ko'rsat: xabar imzolanadigan qator va xabar `POST /tolov/webhook` ga yuboriladigan qator. Kalit brauzerga chiqmasligini qaysi qator ko'rsatadi — bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'В коде учебной страницы покажи два места с именем файла и номером строки: строку, где сообщение подписывается, и строку, где оно отправляется в `POST /tolov/webhook`. Одной фразой скажи, какая строка показывает, что ключ не попадает в браузер. Код не меняй.' }];
const ScreenA2 = (props) => {
  const [q, setQ] = useState(() => { const o = lsOqi(OQIM_KALIT); const ro = o && Array.isArray(o.qatorlar) ? o.qatorlar.filter(r => r && r.kim) : []; return { sxema: ro.map(r => `${r.kim} | ${r.nima} | ${r.kimga}`).join('\n') }; });
  const yoz = (k, v) => setQ(o => ({ ...o, [k]: v }));
  const [test, setTest] = useState(testOqi);
  const belgi = (id, v) => { setTest(t => { const n = { ...t, [id]: v }; testYoz(n); return n; }); };
  const uchala = TEKSHIRUVLAR.every(t => test[t.id] !== null);
  const hammasiOk = TEKSHIRUVLAR.every(t => test[t.id] === true);
  const trek = useMemo(trekOqi, []);
  const trekGap = { mobil: { uz: 'mobil trek — sahifani telefoningiz brauzerida ochasiz', ru: 'мобильный трек — открываете страницу в браузере телефона' }, web: { uz: 'web-trek — kompyuteringiz brauzerida ochasiz', ru: 'веб-трек — открываете в браузере компьютера' } };
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z repo'ngiz", ru: 'Практика 2 · ваш репозиторий' }}
      title={{ uz: <>Mashq to'lov bilan <span className="italic" style={{ color: T.accent }}>imzo, takror va radni</span> tekshiring.</>, ru: <>Проверьте учебной оплатой <span className="italic" style={{ color: T.accent }}>подпись, повтор и отказ</span>.</> }}
      mentor={{ uz: "Sahifa xabarni Backend'da imzolaydi — kalit brauzerga chiqmaydi; «1 · Ochish»dan boshlang.", ru: 'Страница подписывает сообщение в Backend — ключ в браузер не попадает; начните с «1 · Открыть».' }}
      qulf={(n) => n === 3 && !uchala}
      extra={() => ({ test: { ...test }, hammasiOk })}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tx({ uz: "1-amaliyotdagi yo'l Render'da ishlab turibdi. Neon SQL Editor'da o'z hisobingiz raqamini toping: `SELECT id FROM oyinchilar WHERE login = '{loginingiz}';` (jadval va ustun nomi — mahsulotingizdagidek).", ru: 'Путь из 1-й практики работает на Render. В Neon SQL Editor найдите номер своего аккаунта: `SELECT id FROM oyinchilar WHERE login = \'{ваш логин}\';` (имена таблицы и столбца — как в вашем продукте).' })}
          <Band>{tx({ uz: "Topa olmasangiz — agentdan so'rang: «Foydalanuvchilar jadvalida {loginim} hisobining `id` sini ayt. Hech narsani o'zgartirma.» Mustaqil ishdagi sxemangiz pastdagi talabga o'zi qo'yilgan — o'qib chiqing.", ru: 'Не нашли — спросите агента: «Скажи `id` аккаунта {мой логин} в таблице пользователей. Ничего не меняй.» Схема из самостоятельной работы уже вставлена в требование ниже — прочитайте.' })}</Band>
          <Band>{trek ? tr(trekGap[trek]) : <>{tr(trekGap.mobil)} · {tr(trekGap.web)}</>}{tr({ uz: ' (ikkalasida tekshiruv bir xil).', ru: ' (проверка в обоих одинакова).' })}</Band></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni tekshiring va to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'проверьте и заполните скобки, нажмите «Скопировать» и отправьте в Antigravity:' })}
          <PwPrompt satrlar={A2_PROMPT(SXEMA_JOY)} joylar={A2_JOYLAR} qiymat={q} onYoz={yoz} />
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq talab", ru: 'Полное требование из примера Ментора' }} satrlar={A2_YORDAM} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; `git add <fayl>` → `git commit -m \"mashq tolov\"` → `git push`. Render'da yangi versiya tugashini kuting.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают со списком агента, `.env` в списке нет; `git add <fayl>` → `git commit -m "mashq tolov"` → `git push`. Дождитесь новой версии на Render.' })}
          <Band>{tr({ uz: 'Kutayotganda agentga:', ru: 'Пока ждёте — агенту:' })}</Band>
          <KodPrompt satrlar={A2_KOD_PROMPT} />
          <Band>{tx({ uz: "Render tayyor bo'lgach brauzerda oching: `{Backend manzili}/tolov-mashq?oyinchi={hisob raqami}&summa={summa}` — masalan: `maydon-jamoa-….onrender.com/tolov-mashq?oyinchi=7&summa=10000`.", ru: 'Когда Render готов, откройте в браузере: `{адрес Backend}/tolov-mashq?oyinchi={номер аккаунта}&summa={сумма}` — например: `maydon-jamoa-….onrender.com/tolov-mashq?oyinchi=7&summa=10000`.' })}</Band>
          <Band>{tr({ uz: "Sahifa birinchi ochilishda bir daqiqagacha kechikishi mumkin: bepul Backend uxlab qolgan bo'lsa, uyg'onadi.", ru: 'Первое открытие может задержаться до минуты: если бесплатный Backend уснул, он просыпается.' })}</Band></>,
          xato: tx({ uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Вышла такая ошибка: {ошибка}. Исправь.»' }) },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "uch tekshiruv, bittadan; har biridan keyin tekshiruv kartasida «Kutilganidek» yoki «Boshqacha» ni tanlang:", ru: 'три проверки, по одной; после каждой выберите в карточке проверки «Как ожидалось» или «По-другому»:' })}
          <TekshiruvKarta test={test} onBelgi={belgi} />
          {uchala && <>
            <Band>{tr({ uz: "«Boshqacha» bo'lsa — agentga: «{tekshiruv}: kutganim {nima kutdim}, bo'ldi {nima bo'ldi}. Tuzat, o'zgargan fayllarni ayt.» → push → Render → o'sha tugma bilan qayta tekshiring.", ru: 'Если «По-другому» — агенту: «{проверка}: ждал {что ждал}, вышло {что вышло}. Исправь, назови изменённые файлы.» → push → Render → проверьте снова той же кнопкой.' })}</Band>
            <Band>{tx({ uz: "Oxirida README'dagi «To'lov» bo'limini sxemangiz bilan solishtiring: so'zlar bir xilmi, qator qo'shilmaganmi. Farq bo'lsa — agentga «Faqat README.md dagi «To'lov» bo'limini men yozgandek qil.», keyin `git add README.md` → `git commit` → `git push`.", ru: 'В конце сравните раздел «To\'lov» в README со своей схемой: те же ли слова, не добавлены ли строки. Если есть разница — агенту «Сделай только раздел «To\'lov» в README.md так, как я написал.», затем `git add README.md` → `git commit` → `git push`.' })}</Band></>}</> }
      ]}
      natija={<A2Natija />}
      ulgur={{ uz: "Ulgurmasangiz: Render kutishi cho'zilsa — 4-qadam uyga vazifaning 1-bandi; «Davom etish» 2-qadamdan keyin ochiladi. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: затянулось ожидание Render — шаг 4 станет пунктом 1 домашнего задания; «Продолжить» откроется после шага 2. Блок считается выполненным после «Готово» на шаге 4.' }}
      ulgurQadam={2}
      doneText={hammasiOk ? { uz: "Uch tekshiruv o'tdi: imzosiz `401`, takror bitta qator, rad yozildi.", ru: 'Три проверки пройдены: без подписи `401`, повтор — одна строка, отказ записан.' } : { uz: "Tekshiruv tugamagan: «Boshqacha» chiqqanini tuzatib, qayta tekshiring.", ru: 'Проверка не закончена: исправьте то, что вышло «По-другому», и проверьте снова.' }}
      izoh={{ uz: "Bu sahifa — mashq yordamchisi: hisob va summa manzildan olinadi; haqiqiy to'lovda ularni Backend o'zi biladi.", ru: 'Эта страница — учебный помощник: аккаунт и сумма берутся из адреса; при настоящей оплате Backend знает их сам.' }}
      ustoz={[
        { uz: "Mashq sahifasi va tugmalari faqat o'quvchining o'z Backend'ini chaqiradi; boshqa odamning Backend'iga yoki haqiqiy to'lov xizmatiga hech narsa yuborilmaydi.", ru: 'Учебная страница и её кнопки вызывают только собственный Backend ученика; ничего не отправляется в чужой Backend или в настоящий платёжный сервис.' },
        { uz: "Sahifa ochiq manzilda turadi: pul va Pro yo'q, lekin manzilni bilgan odam mashq qatori yarata oladi (`m-` raqamli, sanoqqa kirmaydi). 4-darsdan sahifa faqat Backend bergan to'lov raqami bilan ishlaydi; real to'lovga o'tilsa mashq sahifasi o'chiriladi — bu kursda emas.", ru: 'Страница открыта по адресу: денег и Pro нет, но знающий адрес может создать учебную строку (номер `m-`, в счёт не идёт). С 4-го урока страница работает только с номером платежа от Backend; при переходе на реальную оплату учебную страницу удаляют — не на этом курсе.' }
      ]} />
  );
};

// 🃏 KARTOCHKALAR — 12 ta, alohida ekran, Mentorsiz (SABOQ 12, 16); karta ostida birinchi bosishgacha «Kartani bosing — javob ochiladi», yuzi ingichka accent chegarada (E 49)
const KARTALAR = [
  { front: { uz: "To'lov xizmati nima?", ru: 'Что такое платёжный сервис?' }, back: { uz: 'Pulni qabul qiladigan kompaniya', ru: 'Компания, которая принимает деньги' }, note: { uz: 'Masalan, Click va Payme', ru: 'Например, Click и Payme' } },
  { front: { uz: "To'lov sahifasi nima?", ru: 'Что такое страница оплаты?' }, back: { uz: "Brauzerda ochiladigan, odam to'laydigan sahifa", ru: 'Страница в браузере, где человек платит' }, note: { uz: "Karta ma'lumoti faqat shu sahifada — Backend'ga kirmaydi", ru: 'Данные карты только на этой странице — в Backend не попадают' } },
  { front: { uz: "To'lov xabari nima?", ru: 'Что такое сообщение о платеже?' }, back: { uz: "To'lov xizmati Backend'ga yuboradigan xabar: to'landi yoki rad etildi", ru: 'Сообщение, которое платёжный сервис отправляет Backend: оплачено или отклонено' }, note: { uz: 'Texnik nomi — webhook; 7-Modulda botingiz Telegram xabarini shunday olardi', ru: 'Техническое название — webhook; в 7-м модуле ваш бот так получал сообщения Telegram' } },
  { front: { uz: "Mentor misolida to'lov xabari qayerga keladi?", ru: 'Куда приходит сообщение о платеже в примере Ментора?' }, back: { uz: '`POST /tolov/webhook`', ru: '`POST /tolov/webhook`' }, note: { uz: 'Tanada: `tolovRaqami`, `holat`, `summa`, `oyinchiId`', ru: 'В теле: `tolovRaqami`, `holat`, `summa`, `oyinchiId`' } },
  { front: { uz: 'Imzo nima?', ru: 'Что такое подпись?' }, back: { uz: "Xabar maxfiy kalitni biladigan tomondan kelganini ko'rsatadigan belgi", ru: 'Знак, что сообщение пришло от стороны, знающей секретный ключ' }, note: { uz: "Kalit faqat xizmat va Backend'da; mashqda Backend'ning o'zi imzolaydi", ru: 'Ключ только у сервиса и Backend; в учебной оплате подписывает сам Backend' } },
  { front: { uz: "Imzo mos kelmasa, Mentor Backend'i nima qiladi?", ru: 'Что делает Backend Ментора, если подпись не совпала?' }, back: { uz: '`401` qaytaradi, hech narsa yozmaydi', ru: 'Возвращает `401`, ничего не записывает' }, note: { uz: "Imzo `X-Imzo` sarlavhasida keladi; kalitning o'zi xabarda yo'q", ru: 'Подпись приходит в заголовке `X-Imzo`; самого ключа в сообщении нет' } },
  { front: { uz: 'Takror xabar nima?', ru: 'Что такое повторное сообщение?' }, back: { uz: "Bitta to'lov haqidagi xabarning ikki marta kelishi", ru: 'Когда сообщение об одном платеже приходит дважды' }, note: { uz: "Inglizchasi: idempotency. To'lov raqami bir marta sanaladi", ru: 'По-английски: idempotency. Номер платежа считается один раз' } },
  { front: { uz: 'Takror xabarga Backend nima javob beradi?', ru: 'Что Backend отвечает на повторное сообщение?' }, back: { uz: '`200`, lekin ikkinchi qator yozilmaydi', ru: '`200`, но вторая строка не записывается' }, note: { uz: "`200` bo'lmasa, xizmat yana yuborardi", ru: 'Без `200` сервис отправлял бы снова' } },
  { front: { uz: "Rad etilgan to'lov nima?", ru: 'Что такое отклонённый платёж?' }, back: { uz: "To'lov o'tmagan holat", ru: 'Состояние, когда платёж не прошёл' }, note: { uz: "Yoziladi, lekin hech narsa ochilmaydi; sahifada «To'lov o'tmadi»", ru: 'Записывается, но ничего не открывается; на странице «Платёж не прошёл»' } },
  { front: { uz: 'Test rejim nima?', ru: 'Что такое тестовый режим?' }, back: { uz: "Real pul yechilmaydigan to'lov holati", ru: 'Режим оплаты, при котором реальные деньги не списываются' }, note: { uz: "Inglizchasi: sandbox. Bu kursda — mashq to'lov bilan", ru: 'По-английски: sandbox. На этом курсе — с учебной оплатой' } },
  { front: { uz: '`TOLOV_KALITI` qayerda turadi?', ru: 'Где хранится `TOLOV_KALITI`?' }, back: { uz: "Faqat `.env` da va Render sozlamasida", ru: 'Только в `.env` и в настройках Render' }, note: { uz: "Kodda faqat nomi; agentga, README'ga va skrinshotga yozilmaydi", ru: 'В коде только имя; агенту, в README и на скриншот не пишется' } },
  { front: { uz: "To'lov oqimi sxemasida qaysi uch ustun bor?", ru: 'Какие три столбца в схеме потока оплаты?' }, back: { uz: 'Kim · nima qiladi · kimga', ru: 'Кто · что делает · кому' }, note: { uz: 'Mentor sxemasida besh qator', ru: 'В схеме Ментора пять строк' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('pw-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="pw-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — qolipdan: QYakun (DE-204, texnik darslar standarti; SABOQ E 50 — «Bugungi asosiy fikr» yo'q). Sarlavha holatga qarab, har biri rost (E 54) =====
const HW_QADAM = [
  { b: { uz: 'Tugatish', ru: 'Завершить' }, t: { uz: "— darsda ulgurmagan blokni bajaring: `tolovlar` da mashq to'lov qatorlari tursin, uchala tekshiruv belgilangan bo'lsin, README'da «To'lov» bo'limi bo'lsin.", ru: '— выполните блок, на который не хватило времени: в `tolovlar` есть строки учебной оплаты, все три проверки отмечены, в README есть раздел «To\'lov».' } },
  { b: { uz: 'Sxema', ru: 'Схема' }, t: { uz: "— sxemangizni mahsulotingizdagi haqiqiy tugma va ekran nomlari bilan solishtiring: nom farq qilsa — darsdagi sxema kartasida va README'da tuzating.", ru: '— сравните схему с настоящими названиями кнопок и экранов вашего продукта: если название отличается — исправьте в карточке схемы на уроке и в README.' } }
];
// PM-109 / F-1007-475: erta tugatgan o'quvchi yo'li — AI to'lov xizmati rolida 4 xabar beradi, o'quvchi Backend'i nima qilishini aytadi (sinfda gemini.google.com)
const AI_SOROV = { uz: "Sen to'lov xizmatisan. Menga navbat bilan 4 ta webhook xabari ber: imzosi to'g'ri, imzosi noto'g'ri, takror (bir xil to'lov raqami), rad etilgan (holat: rad). Har xabar — qisqa JSON: tolovRaqami, holat, summa, oyinchiId va X-Imzo sarlavhasi. Har biridan keyin men Backend'im nima qilishini yozaman (yozadi yoki yozmaydi, javobi 200 yoki 401); sen to'g'ri-noto'g'riligini bir gapda ayt va nega. Mahsulot: Maydon Jamoa, Pro 30 kun, 10 000 so'm. Birinchi xabarni ber.",
  ru: 'Ты платёжный сервис. Дай мне по очереди 4 webhook-сообщения: с верной подписью, с неверной подписью, повтор (тот же номер платежа), отклонённый (holat: rad). Каждое — короткий JSON: tolovRaqami, holat, summa, oyinchiId и заголовок X-Imzo. После каждого я напишу, что делает мой Backend (записывает или нет, ответ 200 или 401); ты одной фразой скажи, верно ли, и почему. Продукт: Maydon Jamoa, Pro 30 дней, 10 000 сумов. Дай первое сообщение.' };
const AiDavomCard = () => {
  const [nusxa, setNusxa] = useState(false);
  const kochir = () => { try { navigator.clipboard.writeText(tr(AI_SOROV)); setNusxa(true); setTimeout(() => setNusxa(false), 1800); } catch { /* qo'lda belgilab oladi */ } };
  return (
    <div className="card pw-ai fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Erta tugatdingizmi? AI bilan davom eting', ru: 'Закончили раньше? Продолжите с AI' })}</div>
      <p className="pw-ai-m">{tr({ uz: "gemini.google.com'ni oching, pastdagi so'rovni yuboring — AI to'lov xizmati bo'lib to'rt xabar beradi. Har biriga Backend'ingiz nima qilishini yozing; adashgan joyingizni «Orqaga» bilan 5–9-ekranlarda qayta ko'ring.", ru: 'Откройте gemini.google.com, отправьте запрос ниже — AI как платёжный сервис даст четыре сообщения. На каждое напишите, что делает ваш Backend; где ошиблись — вернитесь через «Orqaga» на экраны 5–9.' })}</p>
      <pre className="pw-ai-sorov">{tr(AI_SOROV)}</pre>
      <button type="button" className="q-chip pw-ai-btn" onClick={kochir}>{nusxa ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: "So'rovni nusxalash", ru: 'Скопировать запрос' })}</button>
    </div>
  );
};
const HwCard = ({ keyingi }) => (
  <div className="card pw-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div>
    <div className="pw-hw-karta">
      <span className="pw-hw-q"><em>{tr({ uz: 'kim uchun', ru: 'для кого' })}</em><b>{tr({ uz: "o'z mahsulotingiz", ru: 'ваш продукт' })}</b></span>
      <span className="pw-hw-q"><em>{tr({ uz: 'nechta', ru: 'сколько' })}</em><b>{tr({ uz: 'ikki ish', ru: 'два дела' })}</b></span>
      <span className="pw-hw-q"><em>{tr({ uz: 'muddat', ru: 'срок' })}</em><b>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</b></span>
    </div>
    <ol className="pw-hw-qadam">{HW_QADAM.map((h, i) => <li key={i}><i>{i + 1}</i><span><b>{tr(h.b)}</b> {tx(h.t)}</span></li>)}</ol>
    {keyingi && <span className="pw-hw-keyingi">{keyingi}</span>}
  </div>
);
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
  const idx = (id) => SCREEN_META.findIndex(m => m.id === id);
  const a1 = !!answers[idx('a1')]?.solved;
  const a2 = !!answers[idx('a2')]?.solved;
  const oqim = lsOqi(OQIM_KALIT);
  const t = testOqi();
  const uchOk = a2 && t.imzo === true && t.takror === true && t.rad === true;
  const sxema = !!answers[idx('s13')]?.saqlandi || !!(oqim && Array.isArray(oqim.qatorlar) && oqim.qatorlar.length);
  const sarlavha = a1 && a2 ? (uchOk ? { uz: "To'lov xabari Backend'ingizda — uch tekshiruv o'tdi.", ru: 'Сообщение о платеже в вашем Backend — три проверки пройдены.' } : { uz: "To'lov xabari yo'li bor — tekshiruvni tugatish qoldi.", ru: 'Путь сообщения о платеже есть — осталось закончить проверку.' })
    : a1 ? { uz: "Yo'l va jadval qurildi — uch tekshiruv qoldi.", ru: 'Путь и таблица построены — остались три проверки.' }
      : sxema ? { uz: "Sxemangiz tayyor — to'lov xabari yo'lini qurish qoldi.", ru: 'Ваша схема готова — осталось построить путь сообщения о платеже.' }
        : { uz: 'Webhook hali qurilmagan — qadamlarni uyda bajaring.', ru: 'Webhook ещё не построен — выполните шаги дома.' };
  const RECAP = [
    { uz: "To'lov o'tganini Backend'ga to'lov xizmati xabar bilan aytadi — bu webhook.", ru: 'О прошедшей оплате Backend сообщает платёжный сервис сообщением — это webhook.' },
    { uz: "Imzo xabar maxfiy kalitni biladigan tomondan kelganini ko'rsatadi: Backend uni qayta hisoblab solishtiradi.", ru: 'Подпись показывает, что сообщение пришло от стороны, знающей секретный ключ: Backend пересчитывает её и сравнивает.' },
    { uz: "Bitta to'lov xabari ikki marta kelishi mumkin, shuning uchun to'lov raqami bir marta yoziladi.", ru: 'Сообщение об одном платеже может прийти дважды, поэтому номер платежа записывается один раз.' },
    { uz: "Rad etilgan to'lov ham yoziladi, lekin hech narsa ochilmaydi.", ru: 'Отклонённый платёж тоже записывается, но ничего не открывается.' },
    { uz: "Test rejimda pul yechilmaydi; haqiqiy xizmatda sahifa va xabar boshqa kompaniya serveridan keladi.", ru: 'В тестовом режиме деньги не списываются; в настоящем сервисе страница и сообщение приходят с сервера другой компании.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className={cx('pw-yakun', !uchOk && 'yoq-chip')}>
        <QYakun til={__lang}
          chip={tr({ uz: "Uch tekshiruv o'tdi", ru: 'Три проверки пройдены' })}
          togri={correct} jami={total}
          sarlavha={tr(sarlavha)}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
            {!(_live && _live.mode === 'mentor') && <AiDavomCard />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard keyingi={tr({ uz: <>Keyingi dars — <b>«Narxni qanday belgilaysiz?»</b></>, ru: <>Следующий урок — <b>«Как назначить цену?»</b></> })} />}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PaymentWebhookLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, ScreenA1, ScreenA2, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI — «telefon · to'lov xizmati · Backend» sahnasi (pw-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Telefon 170×272 hamma ekranda (SABOQ 22) === */
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .pw-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: pw-puls 2.2s ease-out .3s 3; }
        @keyframes pw-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .pw-joriy { outline: 2px solid ${T.accent}; outline-offset: 3px; border-radius: 14px; }
        /* Variantlar va tanlov chiplari: guruh ramkasi YO'Q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .pw-k { display: contents; }
        .pw-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: pw-chorla-v 1.8s ease-out .5s 2; }
        @keyframes pw-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .pw-halqa-g .q-chip:not(:disabled), .pw-chorla > .q-chip:not(:disabled), .pw-sx-var > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: pw-chorla-c 1.8s ease-out .5s 2; }
        @keyframes pw-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .pw-k.faol .q-variant:nth-child(2), .pw-halqa-g .q-chip:nth-child(2), .pw-chorla > .q-chip:nth-child(2), .pw-sx-var > .q-chip:nth-child(2) { animation-delay: .75s; }
        .pw-k.faol .q-variant:nth-child(3), .pw-halqa-g .q-chip:nth-child(3), .pw-sx-var > .q-chip:nth-child(3) { animation-delay: 1s; }
        .pw-sx-var > .q-chip:nth-child(4) { animation-delay: 1.25s; }
        .pw-pop { display: inline-block; animation: pw-pop 0.55s cubic-bezier(.3,1.5,.5,1); color: ${T.accent}; }
        @keyframes pw-pop { 0% { transform: scale(1.4); } 100% { transform: scale(1); } }
        .pw-viz { display: flex; flex-direction: column; gap: 12px; align-items: stretch; }
        .pw-ai-m { margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .pw-ai-sorov { margin: 0 0 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; white-space: pre-wrap; }
        .pw-ai-btn { margin: 0; }
        /* F-1007-476: kirish sahnasi (502 px) ustunga sig'maydi — maket ustuni o'z kengligida, variantlar yonida */
        @media (min-width: 761px) { .pw-k .q-split { grid-template-columns: max-content minmax(0, 1fr); gap: 28px; } }
        p.pw-nom { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .pw-qadam { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: ${T.accent}; }
        .pw-qadam i { font-style: normal; width: 18px; height: 18px; border-radius: 50%; background: ${T.accent}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; }
        /* Sahna — grid: telefon · chiziq · xizmat · chiziq · Backend; 2-qatorda (4-ekran) «boshqa kompyuter» va uning chizig'i */
        .pw-sahna.yot { display: grid; grid-template-columns: 170px minmax(26px,1fr) minmax(112px,150px) minmax(26px,1fr) minmax(168px,226px); grid-template-rows: auto; align-items: center; column-gap: 0; padding: 4px 0; }
        .pw-sahna.yot.kmp { grid-template-rows: auto auto; row-gap: 10px; }
        .pw-sahna.yot .pw-s-tel { grid-column: 1; grid-row: 1 / span 2; align-self: start; }
        .pw-sahna.yot .pw-s-c1 { grid-column: 2; grid-row: 1; }
        .pw-sahna.yot .pw-s-x { grid-column: 3; grid-row: 1; }
        .pw-sahna.yot .pw-s-c2 { grid-column: 4; grid-row: 1; }
        .pw-sahna.yot .pw-s-c12 { grid-column: 2 / 5; grid-row: 1; }
        .pw-sahna.yot .pw-s-k { grid-column: 3; grid-row: 2; display: flex; justify-content: center; }
        .pw-sahna.yot .pw-s-c3 { grid-column: 4; grid-row: 2; }
        .pw-sahna.yot .pw-s-be { grid-column: 5; grid-row: 1 / span 2; align-self: center; }
        .pw-sahna.yot:not(.kmp) .pw-s-tel, .pw-sahna.yot:not(.kmp) .pw-s-be { grid-row: 1; align-self: center; }
        .pw-sahna.tik { display: flex; flex-direction: column; align-items: center; gap: 0; }
        .pw-sahna.tik > div { width: 100%; display: flex; justify-content: center; }
        .pw-sahna.tik .pw-s-x { flex-direction: row; gap: 10px; align-items: center; }
        /* Telefon ramkasi: o'lchami barqaror, yorliq ramka ustida */
        .pw-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 5px; width: 170px; transition: opacity .3s; }
        .pw-tel-ust.xira { opacity: .5; }
        .pw-tel-yorliq { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; letter-spacing: .02em; }
        .pw-telefon { width: 170px; height: 272px; border-radius: 24px; background: ${T.ink}; padding: 7px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.55); flex: none; }
        .pw-tel-ekran { position: relative; width: 100%; height: 100%; border-radius: 17px; background: ${T.paper}; overflow: hidden; display: flex; flex-direction: column; animation: fade-step .35s ease; }
        .pw-br-bar { flex: none; padding: 3px 7px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .pw-br-bar code { display: block; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: -0.02em; line-height: 1.2; color: ${T.ink2}; overflow-wrap: normal; }
        .pw-br-bar code span { white-space: nowrap; }
        .pw-mashq { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 3px; padding: 5px 8px; }
        .pw-mashq.pm { padding: 0 0 5px; gap: 4px; }
        .pw-mashq.pm > :not(.pw-pm-bosh) { margin: 0 8px; }
        .pw-pm-bosh { display: flex; align-items: center; justify-content: space-between; padding: 5px 8px; background: ${PAYME_RANG}; color: #fff; font-size: 13px; font-weight: 900; letter-spacing: .01em; }
        .pw-pm-bosh span { font-size: 9.5px; font-weight: 700; background: rgba(255,255,255,.28); border-radius: 6px; padding: 1px 5px; }
        .pw-mashq.pm .pw-m-sar { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pw-m-summa.pm b { font-size: 17px; font-weight: 900; }
        .pw-tolash.pm { background: ${PAYME_RANG}; color: #fff; padding: 6px 8px; }
        .pw-mashq.pm .pw-m-test { font-size: 10px; margin-top: auto; }
        .pw-m-sar { font-size: 13.5px; font-weight: 800; color: ${T.ink}; }
        .pw-m-test { font-size: 11px; line-height: 1.22; color: ${T.ink2}; }
        .pw-m-nom { font-size: 11.5px; line-height: 1.3; color: ${T.ink}; }
        .pw-m-summa { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 6px; font-size: 13px; color: ${T.ink}; }
        .pw-m-summa em, .pw-m-nom em { font-style: normal; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 0 5px; }
        .pw-tolash, .pw-rad, .pw-bot { font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 700; border: 0; border-radius: 9px; padding: 4px 8px; cursor: pointer; }
        .pw-tolash { background: ${T.ink}; color: #fff; }
        .pw-rad { background: ${T.bg}; color: ${T.ink}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .pw-tolash:disabled, .pw-rad:disabled, .pw-bot:disabled { cursor: default; }
        .pw-m-holat { font-size: 11.5px; font-weight: 800; padding: 1px 7px; border-radius: 7px; animation: pw-kir .5s ease both; }
        .pw-m-holat.ok { color: ${T.ok}; background: ${T.okFon}; } .pw-m-holat.err { color: ${T.err}; background: ${T.errFon}; }
        @keyframes pw-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .pw-tg { flex: 1; display: flex; flex-direction: column; min-height: 0; }
        .pw-tg-bosh { flex: none; padding: 7px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; font-size: 12.5px; }
        .pw-tg-chat { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 9px; }
        .pw-tg-p { max-width: 80%; padding: 5px 9px; border-radius: 12px; font-size: 12px; animation: pw-kir .4s ease both; }
        .pw-tg-p.men { align-self: flex-end; background: ${T.accentSoft}; color: ${T.ink}; }
        .pw-tg-p.bot { align-self: flex-start; background: ${T.bg}; color: ${T.ok}; font-weight: 800; }
        .pw-bot { margin: 0 9px 9px; background: ${T.ink}; color: #fff; }
        .pw-xs { flex: 1; display: flex; flex-direction: column; background: ${T.bg}; }
        .pw-xs-tana { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 12px; text-align: center; color: ${T.ink2}; font-size: 12.5px; }
        .pw-xs-y { font-size: 11.5px; padding: 4px 8px; border-radius: 8px; border: 1px dashed ${T.line}; background: ${T.paper}; }
        .pw-ilova { position: relative; flex: 1; display: flex; flex-direction: column; gap: 7px; padding: 10px; }
        .pw-tag { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 6px; }
        .pw-il-nom { font-size: 13.5px; }
        .pw-il-oyin { font-size: 11.5px; line-height: 1.35; color: ${T.ink}; padding: 7px; border-radius: 9px; border: 1px solid ${T.line}; }
        .pw-il-btn { align-self: stretch; text-align: center; font-size: 11.5px; font-weight: 700; padding: 6px; border-radius: 9px; background: ${T.ink}; color: #fff; transition: box-shadow .3s; }
        .pw-il-test { font-size: 10.5px; line-height: 1.3; text-align: center; color: ${T.ink2}; }
        .pw-il-btn.yon { box-shadow: 0 0 0 3px ${fon(T.accent, 0.5)}; }
        .pw-il-br { position: absolute; left: 6px; right: 6px; bottom: 6px; top: 46px; display: flex; flex-direction: column; gap: 6px; padding: 9px; border-radius: 12px; background: ${T.paper}; box-shadow: 0 -10px 24px -12px rgba(${T.shadowBase},0.45); animation: pw-yuqori .45s ease both; }
        @keyframes pw-yuqori { from { transform: translateY(100%); opacity: 0; } to { transform: none; opacity: 1; } }
        /* Tugunlar: to'lov xizmati · Backend · boshqa kompyuter */
        .pw-x-ust, .pw-be-ust { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .pw-xizmat { width: 100%; min-width: 112px; max-width: 150px; display: flex; flex-direction: column; gap: 4px; padding: 9px 10px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 8px 18px -12px rgba(${T.shadowBase},0.4); }
        .pw-xizmat.tugildi { animation: pw-tugil .55s cubic-bezier(.3,1.4,.5,1) both; }
        @keyframes pw-tugil { from { opacity: 0; transform: scale(.85); } to { opacity: 1; transform: none; } }
        .pw-xizmat.server { background: ${T.bg}; }
        .pw-x-nom { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .pw-x-izoh { font-size: 11px; line-height: 1.3; color: ${T.ink2}; }
        .pw-x-yorliq { font-size: 11.5px; font-weight: 800; padding: 2px 7px; border-radius: 7px; align-self: flex-start; animation: pw-kir .4s ease both; }
        .pw-x-yorliq.err { color: ${T.err}; background: ${T.errFon}; } .pw-x-yorliq.ok { color: ${T.ok}; background: ${T.okFon}; }
        .pw-qulf { display: inline-flex; align-items: center; gap: 4px; align-self: flex-start; padding: 2px 6px; border-radius: 7px; background: ${T.bg}; color: ${T.ink}; }
        .pw-qulf code { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; }
        .pw-qulf-ic { color: ${T.ink2}; flex: none; }
        .pw-hisob { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.accent}; }
        .pw-soat { display: inline-flex; color: ${T.ink2}; } .pw-soat.toxta { color: ${T.err}; }
        .pw-soat-ic.yur .pw-soat-mil { transform-origin: 8px 8px; animation: pw-aylan 2s linear infinite; }
        @keyframes pw-aylan { to { transform: rotate(360deg); } }
        .pw-kuting, .pw-sb { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 999px; border: 1.5px dashed ${T.accent}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; }
        .pw-kuting:disabled, .pw-sb:disabled { opacity: .45; cursor: default; }
        .pw-sb { font-size: 13px; padding: 7px 14px; }
        .pw-backend { width: 100%; min-width: 168px; max-width: 226px; display: flex; flex-direction: column; gap: 6px; padding: 10px; border-radius: 14px; background: ${T.ink}; color: #fff; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.6); }
        .pw-backend.tugildi { animation: pw-tugil .5s ease both; }
        .pw-backend.silk { animation: pw-silk .45s ease; }
        @keyframes pw-silk { 0%, 100% { transform: none; } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .pw-be-bosh { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
        .pw-be-bosh b { font-size: 13.5px; }
        .pw-be-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${fon(T.paper, 0.75)}; }
        .pw-chiroq { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: ${fon(T.paper, 0.7)}; }
        .pw-chiroq i { width: 8px; height: 8px; border-radius: 50%; background: ${T.ink2}; }
        .pw-chiroq.uygonmoqda i { background: ${T.accent}; } .pw-chiroq.uygoq { color: #fff; } .pw-chiroq.uygoq i { background: ${T.ok}; box-shadow: 0 0 8px ${fon(T.ok, 0.8)}; }
        .pw-backend .pw-qulf { background: ${fon(T.paper, 0.12)}; color: #fff; } .pw-backend .pw-qulf-ic { color: ${fon(T.paper, 0.7)}; }
        .pw-be-qism { display: flex; flex-direction: column; gap: 5px; }
        .pw-bq { font-size: 11.5px; padding: 5px 7px; border-radius: 8px; background: ${fon(T.paper, 0.1)}; } .pw-bq code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${fon(T.paper, 0.85)}; }
        .pw-be-q { font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.35; padding: 3px 7px; border-radius: 7px; background: ${fon(T.paper, 0.08)}; color: ${fon(T.paper, 0.9)}; }
        .pw-be-q.ok { background: ${fon(T.ok, 0.35)}; color: #fff; } .pw-be-q.err { background: ${fon(T.err, 0.4)}; color: #fff; } .pw-be-q.rad { color: ${fon(T.paper, 0.75)}; }
        .pw-be-q .qcode { background: transparent; color: inherit; padding: 0; }
        .pw-xabar { display: flex; flex-direction: column; gap: 1px; padding: 6px 8px; border-radius: 8px; background: ${T.paper}; color: ${T.ink}; }
        .pw-xabar code { font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.4; } .pw-xabar code.ajrat { color: ${T.err}; font-weight: 800; }
        .pw-xb-imzo { color: ${T.accent}; } .pw-xb-imzo.yoq { color: ${T.ink2}; }
        .pw-jadval { display: flex; flex-direction: column; border-radius: 9px; overflow: hidden; background: ${T.paper}; color: ${T.ink}; }
        .pw-j-bosh { display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 4px 8px; background: ${T.bg}; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pw-j-bosh code { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        .pw-j-sar, .pw-j-q { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 3px 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .pw-j-sar { color: ${T.ink2}; border-bottom: 1px solid ${T.line}; }
        .pw-j-q + .pw-j-q { border-top: 1px solid ${T.line}; }
        .pw-j-q.yangi { animation: pw-qator 1.4s ease both; }
        @keyframes pw-qator { 0% { opacity: 0; transform: translateY(-6px); background: ${T.okFon}; } 20% { opacity: 1; transform: none; } 75% { background: ${T.okFon}; } 100% { background: transparent; } }
        .pw-j-q.err { background: ${T.errFon}; color: ${T.err}; } .pw-j-q.rad { color: ${T.ink2}; }
        .pw-j-izoh { font-size: 11px; font-weight: 800; padding: 3px 8px; } .pw-j-izoh.err { color: ${T.err}; background: ${T.errFon}; }
        .pw-takror { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 700; padding: 5px 9px; border-radius: 999px; border: 1px solid ${fon(T.paper, 0.35)}; background: transparent; color: #fff; cursor: pointer; }
        .pw-takror i { width: 24px; height: 13px; border-radius: 999px; background: ${fon(T.paper, 0.3)}; position: relative; transition: background .25s; }
        .pw-takror i::after { content: ''; position: absolute; top: 2px; left: 2px; width: 9px; height: 9px; border-radius: 50%; background: #fff; transition: left .25s; }
        .pw-takror.on i { background: ${T.ok}; } .pw-takror.on i::after { left: 13px; }
        .pw-takror:disabled { cursor: default; }
        .pw-kompyuter { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 10px; border-radius: 12px; border: 1.5px dashed ${T.line}; color: ${T.ink2}; font-size: 11.5px; font-weight: 700; transition: all .3s; }
        .pw-kompyuter.yon { border-color: ${T.err}; color: ${T.err}; background: ${T.errFon}; }
        /* Chiziq va konvert (xabar · javob · so'rov) — chiziq bo'ylab uchadi; reduced-motion — konvert yurmaydi */
        .pw-chiziq { position: relative; display: flex; align-items: center; justify-content: center; }
        .pw-chiziq.yot { height: 34px; width: 100%; }
        .pw-chiziq.tik { width: 40px; height: 44px; }
        .pw-chiziq-i { position: absolute; background: ${T.line}; border-radius: 2px; }
        .pw-chiziq.yot .pw-chiziq-i { left: 4px; right: 4px; top: 50%; height: 2px; margin-top: -1px; }
        .pw-chiziq.tik .pw-chiziq-i { top: 2px; bottom: 2px; left: 50%; width: 2px; margin-left: -1px; }
        .pw-chiziq.h-savol .pw-chiziq-i { background: transparent; border-top: 2px dashed ${T.ink2}; height: 0; }
        .pw-chiziq.tik.h-savol .pw-chiziq-i { border-top: 0; border-left: 2px dashed ${T.ink2}; width: 0; }
        .pw-chiziq.h-yonadi .pw-chiziq-i { animation: pw-yonadi 1s ease 1; }
        @keyframes pw-yonadi { 0%, 100% { background: ${T.line}; } 40% { background: ${T.accent}; box-shadow: 0 0 8px ${fon(T.accent, 0.6)}; } }
        .pw-chiziq-s { position: relative; z-index: 1; font-size: 15px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; padding: 0 5px; }
        .pw-chiziq-y { position: absolute; left: 0; right: 0; top: calc(50% + 6px); text-align: center; font-size: 11px; font-weight: 600; line-height: 1.25; color: ${T.ink2}; }
        .pw-chiziq.tik .pw-chiziq-y { top: auto; left: calc(50% + 10px); right: auto; width: 140px; text-align: left; }
        .pw-kv { position: absolute; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 1px; animation-duration: .9s; animation-timing-function: ease-in-out; animation-fill-mode: both; }
        .pw-chiziq.yot .pw-kv { top: -2px; }
        .pw-chiziq.tik .pw-kv { left: 4px; }
        .pw-kv-i { width: 22px; height: 15px; border-radius: 3px; background: ${T.accent}; position: relative; box-shadow: 0 4px 10px -4px ${fon(T.accent, 0.7)}; }
        .pw-kv-i::after { content: ''; position: absolute; left: 3px; right: 3px; top: 2px; height: 6px; border-left: 1.5px solid #fff; border-bottom: 1.5px solid #fff; transform: skewY(0) rotate(-45deg) scale(.55); transform-origin: center; }
        .pw-kv.javob .pw-kv-i { background: ${T.ok}; box-shadow: 0 4px 10px -4px ${fon(T.ok, 0.7)}; }
        .pw-kv.sorov .pw-kv-i { background: ${T.ink}; }
        .pw-kv.rad .pw-kv-i { background: ${T.err}; box-shadow: 0 4px 10px -4px ${fon(T.err, 0.7)}; }
        .pw-kv.rad .pw-kv-i::after { content: '×'; left: 0; right: 0; top: -2px; height: auto; border: 0; transform: none; color: #fff; font: 800 15px/1 'Manrope', sans-serif; text-align: center; }
        .pw-kv.rad .pw-kv-y { color: ${T.err}; }
        .pw-kv.soxta .pw-kv-i { background: ${T.ink2}; }
        .pw-kv-y { order: -1; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; white-space: nowrap; color: ${T.ink}; background: ${T.paper}; border-radius: 6px; padding: 0 5px; box-shadow: 0 2px 6px -3px rgba(${T.shadowBase},0.4); }
        .pw-sahna.yot.kvyashir .pw-kv-y { display: none; }
        .pw-chiziq.tik .pw-kv { flex-direction: row; gap: 6px; } .pw-chiziq.tik .pw-kv-y { order: 1; }
        @keyframes pw-kv-x-ab { 0% { left: 0; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: calc(100% - 24px); opacity: 0; } }
        @keyframes pw-kv-x-ba { 0% { left: calc(100% - 24px); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: 0; opacity: 0; } }
        @keyframes pw-kv-x-bs { 0% { left: calc(100% - 24px); opacity: 0; } 15% { opacity: 1; } 55% { opacity: 1; } 100% { left: 40%; opacity: 0; } }
        @keyframes pw-kv-x-as { 0% { left: 0; opacity: 0; } 15% { opacity: 1; } 55% { opacity: 1; } 100% { left: 45%; opacity: 0; } }
        @keyframes pw-kv-y-ab { 0% { top: 0; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { top: calc(100% - 16px); opacity: 0; } }
        @keyframes pw-kv-y-ba { 0% { top: calc(100% - 16px); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { top: 0; opacity: 0; } }
        @keyframes pw-kv-y-bs { 0% { top: calc(100% - 16px); opacity: 0; } 15% { opacity: 1; } 100% { top: 40%; opacity: 0; } }
        @keyframes pw-kv-y-as { 0% { top: 0; opacity: 0; } 15% { opacity: 1; } 100% { top: 45%; opacity: 0; } }
        /* Sahna ostidagi harakat qatori, ikki natija, kod kartasi */
        .pw-harakat { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        .pw-ost { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 2fr); gap: 14px; align-items: start; }
        .pw-harakat.tik { flex-direction: column; align-items: flex-start; }
        .pw-harakat .q-btn, .pw-kyordam .q-btn, .pw-yordam-ust .q-btn { margin-left: 0; }
        .pw-ost .pw-ikki { flex-direction: column; align-items: flex-start; }
        @media (max-width: 760px) { .pw-ost { grid-template-columns: 1fr; } .pw-harakat.tik { flex-direction: row; } }
        .pw-ikki { display: flex; flex-wrap: wrap; gap: 10px; }
        .pw-sahna.yot .pw-s-ost { grid-column: 2 / 5; grid-row: 1; align-self: end; justify-self: center; margin-bottom: 4px; }
        .pw-sahna.tik .pw-s-ost { margin-top: 10px; }
        /* Yakuniy holat kompyuterda bitta ekranga sig'adi (B1, B2): 4-ekran — sahna kichrayib chapda, natija va kod kartasi o'ngda; 6-ekran — sahna biroz kichrayadi */
        @media (min-width: 761px) {
          .pw-viz.pw-v-yakun { display: grid; grid-template-columns: 512px minmax(0, 1fr); gap: 16px; align-items: start; } /* F-1007-477: max-content + zoom .8 birinchi ustunni 968 px qilardi */
          .pw-viz.pw-v-yakun > .pw-sahna.yot { width: 640px; zoom: .8; grid-template-columns: 170px 30px 140px 100px 200px; }
          .pw-viz.pw-v-yakun .pw-ost { grid-template-columns: 1fr; gap: 10px; }
          .pw-viz.pw-v-yakun .pw-ost .pw-ikki { flex-direction: row; }
          .pw-viz.pw-v-yakun .pw-kod-iz { display: none; }
          .pw-viz.pw-v-yakun pre.pw-kod-tana { font-size: 11px; }
          .pw-sahna.yot.yakun6 { zoom: .9; }
        }
        .pw-ikki span { font-size: 13px; font-weight: 800; padding: 5px 11px; border-radius: 9px; }
        .pw-ikki .ok { color: ${T.ok}; background: ${T.okFon}; } .pw-ikki .err { color: ${T.err}; background: ${T.errFon}; }
        .pw-ikki code { font-family: 'JetBrains Mono', monospace; }
        .pw-kod { display: flex; flex-direction: column; gap: 5px; padding: 10px 12px; border-radius: 12px; background: ${CODE.bg}; }
        .pw-kod-y { font-size: 11.5px; color: ${CODE.comment}; } .pw-kod-y code { font-family: 'JetBrains Mono', monospace; color: ${CODE.attr}; }
        pre.pw-kod-tana { margin: 0; font-variant-ligatures: none; display: flex; flex-direction: column; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.5; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; }
        pre.pw-kod-tana span { border-radius: 4px; padding: 0 4px; transition: background .3s; scroll-margin-bottom: 14px; }
        .pw-kartalar, .pw-ms-yrd { scroll-margin-bottom: 12px; }
        pre.pw-kod-tana span.ok { background: ${fon(T.ok, 0.45)}; } pre.pw-kod-tana span.err { background: ${fon(T.err, 0.5)}; }
        .pw-kod-iz { font-size: 12px; line-height: 1.45; color: ${fon(T.paper, 0.72)}; }
        .pw-kod-iz .qcode { background: ${fon(T.paper, 0.12)}; color: #fff; }
        /* 11-ekran: ikki nomli tugma, uch karta */
        .pw-rejim { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .pw-chip, .pw-karta { font-family: 'Manrope', sans-serif; cursor: pointer; }
        .pw-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; font-weight: 700; padding: 8px 14px; border-radius: 999px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; }
        .pw-chip.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pw-chip.chorla { border-color: ${fon(T.accent, 0.6)}; animation: pw-chorla-c 1.8s ease-out .5s 2; }
        .pw-chip i { font-style: normal; color: ${T.ok}; }
        .pw-chip:disabled { opacity: .55; cursor: default; }
        .pw-kartalar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; align-items: start; }
        .pw-karta { text-align: left; display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; box-shadow: 0 6px 14px -10px rgba(${T.shadowBase},0.4); }
        .pw-karta.chorla { border-color: ${fon(T.accent, 0.6)}; }
        .pw-karta.ochiq { border-color: ${T.accent}; }
        .pw-karta:disabled { cursor: default; }
        .pw-karta-b { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; }
        .pw-karta-b b { font-size: 15px; font-weight: 800; } .pw-karta-b em { font-style: normal; font-size: 11.5px; color: ${T.ink2}; flex: 1; }
        .pw-karta-b i { font-style: normal; font-weight: 800; color: ${T.accent}; } .pw-karta.kor .pw-karta-b i { color: ${T.ok}; }
        .pw-karta-t { display: flex; flex-direction: column; gap: 4px; font-size: 12.5px; line-height: 1.45; color: ${T.ink}; }
        p.pw-yigma { margin: 0; display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: 13.5px; color: ${T.ok}; font-weight: 700; }
        /* 12-ekran: sahna chapda, sxema jadvali o'ngda (E 45: jadval — ma'lumot; karta — bosiladigan) */
        .pw-sx-ust { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 16px; align-items: start; }
        .pw-sx-chap .pw-sahna.yot { grid-template-columns: 170px minmax(18px,1fr) minmax(96px,118px) minmax(18px,1fr) minmax(112px,140px); }
        .pw-sx-chap .pw-xizmat { min-width: 96px; } .pw-sx-chap .pw-backend { min-width: 112px; }
        .pw-sx-ong { display: flex; flex-direction: column; gap: 10px; }
        .pw-sx { border-radius: 10px; overflow: hidden; background: ${T.bg}; border: 1px solid ${T.line}; }
        .pw-sx-bosh { display: flex; justify-content: space-between; gap: 8px; padding: 7px 10px; background: ${T.ink}; color: #fff; font-size: 12.5px; }
        .pw-sx-r { display: grid; grid-template-columns: 0.8fr 1.6fr 0.8fr; gap: 8px; padding: 5px 10px; font-size: 12px; line-height: 1.35; color: ${T.ink}; border-top: 1px solid ${T.line}; }
        .pw-sx-r.bosh { opacity: .55; } .pw-sx-r.bosh span:first-child { color: ${T.ink2}; font-weight: 700; } .pw-sx-r.bosh span { border-bottom: 1px dashed ${fon(T.ink2, 0.5)}; min-height: 18px; }
        .pw-sx-r.sar { font-weight: 700; color: ${T.ink2}; border-top: 0; }
        .pw-sx-r.yangi { animation: pw-qator 1.4s ease both; }
        .pw-sx-karta { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.accent}; box-shadow: 0 10px 22px -14px rgba(${T.shadowBase},0.5); animation: pw-kir .4s ease both; }
        .pw-sx-karta.silk { animation: pw-silk .45s ease; }
        .pw-sx-kim, .pw-sx-nima { display: flex; flex-direction: column; gap: 2px; font-size: 13.5px; line-height: 1.4; }
        .pw-sx-kim em, .pw-sx-nima em { font-style: normal; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: ${T.ink2}; }
        .pw-sx-var { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        .pw-sx-var .q-chip { justify-content: center; }
        /* Reja ekrani: sahna + README qatori */
        .pw-reja-chap { display: flex; flex-direction: column; gap: 10px; }
        .pw-readme { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; padding: 6px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; }
        .pw-readme b { font-family: 'JetBrains Mono', monospace; font-size: 12px; } .pw-readme span { color: ${T.ink2}; }
        p.pw-reja-past { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink2}; }
        .pw-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .pw-ustoz b { color: ${T.ink}; }
        /* Bashorat ixcham qatori, yashil xulosa ichidagi taxmin qatori va izoh (E 42) */
        .pw-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .pw-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        .q-xulosa .pw-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .pw-x-tx b { color: ${T.ink}; } .q-xulosa .pw-x-tx.ok, .q-xulosa .pw-x-tx.ok b { color: ${T.ok}; } .q-xulosa .pw-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .pw-x-m { display: block; }
        .q-xulosa .pw-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        /* 7-ekran: vazifa, natija oynasi, kod oynasi qobig'i */
        ol.pw-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.pw-vazifa li { display: flex; gap: 9px; align-items: flex-start; font-size: 13.5px; line-height: 1.45; }
        ol.pw-vazifa li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        ol.pw-vazifa li.ok i { background: ${T.okFon}; color: ${T.ok}; }
        ol.pw-vazifa.ixcham li { font-size: 12.5px; }
        .pw-kod-natija, .pw-kyordam { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
        .pw-kyordam > .q-btn { align-self: flex-start; }
        .pw-bajardim { display: flex; justify-content: flex-end; margin-top: 10px; }
        .pw-kodoyna { display: flex; flex-direction: column; gap: 10px; }
        .pw-amal { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        .pw-amal-t { font-size: 12.5px; color: ${T.ink2}; flex: 1; min-width: 180px; }
        .pw-no { border-radius: 12px; overflow: hidden; border: 1px solid ${T.line}; background: ${T.paper}; transition: opacity .3s; }
        .pw-no.xira { opacity: .55; }
        .pw-no-bar { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; font-size: 12px; color: ${T.ink2}; }
        .pw-no-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; } .pw-no-bar b { margin-left: 6px; }
        .pw-no-tana { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; }
        .pw-no-j { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: ${T.ink}; animation: fade-step .3s ease; }
        .pw-no-btnlar { display: flex; flex-wrap: wrap; gap: 6px; }
        .pw-no-btn { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 10px; border: 0; border-radius: 9px; background: ${T.ink}; color: #fff; cursor: pointer; }
        .pw-no-btn.yana { background: ${T.accent}; }
        .pw-no-btn:disabled { opacity: .45; cursor: default; }
        .pw-jadval.keng { border: 1px solid ${T.line}; min-height: 52px; }
        .pw-kompil { position: fixed; inset: 0; z-index: 2000; }
        /* 13-ekran: mustaqil ish (bitta katta karta, yorliq input ichida — E 43) */
        .pw-model { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        p.pw-model { padding-left: 52px; }
        .pw-ms-chiziq { display: flex; flex-wrap: wrap; gap: 6px; }
        .pw-ms-q { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600; padding: 5px 10px; border-radius: 999px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .pw-ms-q i { font-style: normal; color: ${T.ok}; font-weight: 800; } .pw-ms-q.joriy { border-color: ${T.accent}; color: ${T.accent}; } .pw-ms-q.joriy i { color: ${T.accent}; }
        .pw-ms-q:disabled { cursor: default; }
        .pw-ms-karta { display: flex; flex-direction: column; gap: 8px; padding: 14px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.accent}; box-shadow: 0 12px 24px -16px rgba(${T.shadowBase},0.5); }
        .pw-ms-n { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .pw-ms-m, .pw-joy-m { display: flex; align-items: center; gap: 8px; padding: 0 0 0 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .pw-ms-m:focus-within, .pw-joy-m:focus-within { border-color: ${T.accent}; }
        .pw-ms-mn { flex: none; font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .pw-ms-m input, .pw-joy-m input, .pw-joy-m textarea { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 14px; padding: 10px 10px 10px 0; color: ${T.ink}; resize: vertical; }
        .pw-ms-tugmalar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .pw-ms-tugmalar .pw-ms-yordam { margin-left: auto; }
        .pw-ms-tayyor { display: flex; flex-direction: column; gap: 10px; }
        .pw-ms-yigma { align-self: flex-start; font-size: 13.5px; font-weight: 800; padding: 6px 12px; border-radius: 10px; background: ${T.okFon}; color: ${T.ok}; }
        .pw-ms-yrd { display: flex; flex-direction: column; gap: 5px; padding: 12px; border-radius: 12px; background: ${T.bg}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .pw-ms-yrd b { color: ${T.ink}; } .pw-ms-yq { color: ${T.ink}; }
        .pw-tartib .q-dd-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; } /* F-1007-480: rang qolipniki (accent), override yo'q */
        .pw-tartib .q-dd-chip::before { content: '⠿'; margin-right: 6px; opacity: .7; }
        .pw-tartib .q-dd-chip code { background: rgba(255,255,255,.22); color: #fff; }
        .pw-tartib .q-dd-slot { min-height: 44px; }
        /* Amaliyot bloklari: prompt va maydonlar, Yordam, tekshiruv kartasi, kutilgan natija */
        .pw-blok { display: contents; }
        .pw-blok.qulf .q-blok-q.joriy .q-blok-tana > .q-btn { opacity: .45; pointer-events: none; }
        .pw-band, .pw-kulrang, .pw-xato, .pw-ps, .pw-ps-q, .pw-joylar, .pw-yordam, .pw-yordam-s, .pw-tk, .pw-tk-karta, .pw-tk-q, .pw-tk-n, .pw-tk-btnlar { display: block; }
        .pw-band { margin-top: 6px; }
        .q-blok-t .qcode, .pw-tk .qcode, .pw-yordam .qcode { white-space: normal; overflow-wrap: anywhere; }
        .q-blok-t .qcode.pw-kod-w { overflow-wrap: normal; word-break: normal; }
        .pw-kulrang { margin-top: 6px; font-size: 12.5px; color: ${T.ink2}; }
        .pw-xato { margin-top: 6px; font-size: 13px; font-weight: 700; color: ${T.err}; }
        .pw-prompt { display: block; margin-top: 8px; }
        .pw-ps { margin: 0; padding: 0 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink}; overflow-wrap: anywhere; }
        .pw-ps + .pw-ps { margin-top: 4px; }
        .pw-ps .q-joy { display: inline-block; max-width: 100%; }
        .pw-joylar { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .pw-joy-m { flex-wrap: wrap; }
        .pw-joy-n { flex: none; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.accent}; }
        .pw-yordam-ust { display: block; margin-top: 8px; }
        .pw-yordam-btn { align-self: flex-start; } .pw-nusxa { flex: none; }
        .pw-yordam { margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; }
        .pw-yordam b { display: block; margin-bottom: 4px; font-size: 12px; color: ${T.ink2}; }
        .pw-yordam-s + .pw-yordam-s { margin-top: 4px; }
        .pw-tk { margin-top: 8px; }
        .pw-tk-karta { padding: 10px 12px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; }
        .pw-tk-n { font-size: 12px; color: ${T.ink2}; margin-bottom: 4px; } .pw-tk-n b { color: ${T.ink}; }
        .pw-tk-q { font-size: 13px; line-height: 1.45; margin-top: 3px; } .pw-tk-q em { font-style: normal; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: ${T.ink2}; margin-right: 6px; }
        .pw-tk-btnlar { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .pw-tk-ix { display: flex; align-items: center; gap: 6px; margin-top: 6px; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 700; padding: 5px 10px; border-radius: 9px; border: 0; cursor: pointer; }
        .pw-tk-ix.ok { background: ${T.okFon}; color: ${T.ok}; } .pw-tk-ix.err { background: ${T.errFon}; color: ${T.err}; }
        .pw-tk-ix i { font-style: normal; }
        p.pw-ortda, p.pw-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        @media (max-width: 640px) { p.pw-ortda .qcode, p.pw-ulgur .qcode { white-space: normal; overflow-wrap: anywhere; } } /* 13-Modul sinf-supurish C: uzun buyruq (git clone URL) telefonda o'ng chetdan kesilmaydi */
        p.pw-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.bg}; }
        .pw-an { display: flex; flex-direction: column; gap: 10px; }
        .pw-fayllar { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pw-fayl { display: flex; flex-wrap: wrap; gap: 4px 10px; align-items: baseline; font-size: 12px; }
        .pw-fayl code { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; } .pw-fayl em { font-style: normal; color: ${T.ink2}; }
        .pw-term { font-variant-ligatures: none; display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: 12px; background: ${CODE.bg}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.5; color: ${CODE.text}; overflow-wrap: anywhere; }
        .pw-term .buyruq { color: ${CODE.attr}; }
        .pw-neon { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .pw-neon-b { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 10px; font-size: 12px; }
        .pw-neon-b code { font-family: 'JetBrains Mono', monospace; } .pw-neon-b em { font-style: normal; color: ${T.ink2}; }
        .pw-neon-t { display: grid; gap: 2px 10px; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 11px; overflow-x: auto; }
        .pw-neon-t .sar { color: ${T.ink2}; font-weight: 700; } .pw-neon-t .rad { color: ${T.ink2}; }
        .pw-brauzer { border-radius: 12px; overflow: hidden; border: 1px solid ${T.line}; background: ${T.paper}; }
        .pw-brz-bar { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .pw-brz-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; flex: none; }
        .pw-brz-bar code { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; overflow-wrap: anywhere; }
        .pw-brz-tana { display: flex; flex-direction: column; gap: 5px; padding: 10px 12px; }
        .pw-brz-btnlar { display: flex; flex-wrap: wrap; gap: 6px; }
        .pw-brz-btn { font-size: 11.5px; font-weight: 700; padding: 5px 9px; border-radius: 8px; background: ${T.ink}; color: #fff; }
        .pw-javoblar { display: flex; flex-direction: column; gap: 4px; font-size: 12.5px; color: ${T.ink}; }
        .pw-javoblar code { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 0 5px; border-radius: 5px; }
        .pw-javoblar code { white-space: nowrap; } .pw-javoblar code.ok { background: ${T.okFon}; color: ${T.ok}; } .pw-javoblar code.err { background: ${T.errFon}; color: ${T.err}; }
        .pw-readme-k { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; }
        .pw-readme-k > b { font-family: 'JetBrains Mono', monospace; }
        .pw-rk-s { font-weight: 800; } .pw-rk-h { color: ${T.ink2}; line-height: 1.45; }
        .pw-rk-t { display: grid; grid-template-columns: auto 1fr auto; gap: 3px 10px; font-size: 11.5px; line-height: 1.4; }
        /* Kartochka va yakun */
        .pw-flash { display: flex; flex-direction: column; gap: 10px; }
        .pw-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: pw-puls 1.8s ease-out .4s 3; }
        p.pw-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.pw-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .pw-rc-n { font-family: 'JetBrains Mono', monospace; font-size: 26px; color: ${T.accent}; }
        .pw-yakun { display: contents; }
        .pw-yakun.yoq-chip .done-chip { display: none; }
        .pw-hw { display: flex; flex-direction: column; gap: 10px; }
        .pw-hw-karta { display: flex; flex-wrap: wrap; gap: 8px 16px; }
        .pw-hw-q { display: inline-flex; gap: 6px; align-items: baseline; font-size: 13px; }
        .pw-hw-q em { font-style: normal; color: ${T.ink2}; } .pw-hw-q b { color: ${T.ink}; }
        ol.pw-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.pw-hw-qadam li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.5; }
        .pw-hw-qadam li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        .pw-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        /* ⛶ kattalashtirish — skeletda tushib qolgan qoida (SABOQ 38); ikki klassli selektor — keyingi «.zoomable position relative» qoidasi oynani siljitmasin (E 48) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 96vw); max-height: 92vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        /* 13-Modul sinf-supurish B: ⛶ oynasi faqat ko'rish uchun — maket ichidagi tugma (telefon tugmasi, jadval katagi, belgi) oynada bosilmaydi, harakat ⛶ dan tashqarida qoladi. Kirish ekrani variantlari va maket tugmasi qolipniki — tegilmaydi. */
        .zoom-on button:not(.zoom-btn) { pointer-events: none; cursor: default; }
        .q-kirish .zoom-on button { pointer-events: auto; cursor: pointer; }
        /* ⛶ oynasi ekran markazida: ota-blokdagi animatsiya/transform «position: fixed»ni o'ziga bog'lab, oynani siljitardi */
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 900px) {
          .pw-sx-ust { grid-template-columns: 1fr; }
          .pw-kartalar { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .pw-xizmat, .pw-backend { max-width: 300px; }
          .pw-sahna.tik .pw-s-be .pw-be-ust, .pw-sahna.tik .pw-s-x .pw-x-ust { width: min(300px, 100%); }
          .pw-sx-var { grid-template-columns: 1fr 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pw-halqa, .pw-k.faol .q-variant, .pw-halqa-g .q-chip, .pw-chorla > .q-chip, .pw-sx-var > .q-chip, .pw-chip.chorla, .pw-flash.yangi .fc-card .fc-front, .pw-pop, .pw-j-q.yangi, .pw-sx-r.yangi, .pw-xizmat, .pw-backend, .pw-m-holat, .pw-tg-p, .pw-il-br, .pw-sx-karta, .pw-x-yorliq, .pw-tel-ekran, .pw-chiziq-i, .pw-soat-mil { animation: none !important; }
          .pw-kv { display: none !important; }
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
