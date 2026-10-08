import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 12-Modul · 5-dars «Ulanish uzilsa: buzamiz va tuzatamiz» (m10-05, TEX, keyssiz). Skeletdan (src/skelet/NamunaDars.jsx) + 2-pilot (WebSocketBasicsLesson) yechimlari — nusxa, import emas; MD v3 bo'yicha:
//   feedback/F-1006-12modul/05-BreakAndFix-v3.md + 05-FILTR.md (MD — manba-haqiqat; E 40–55 — eng ustun). 19 ekran:
//   0 QKirish · 1 QReja · 2, 4, 6, 9, 11 QTushuncha · 3, 5, 7, 10 test (QTest) · 8 QKod (HtmlCompiler) · 12 QMustaqil · 13 QTartib (final) ·
//   14, 15 amaliyot bloki (QBlok + ScreenBlok) · 16 podium · 17 kartochkalar (alohida ekran) · 18 QYakun.
// Bitta vizual — real vaqt sahnasi IkkiTelefonSahna (SAHNA, NAMUNA_OYIN, MENTOR_YOZUV): chapda «1-telefon · siz», o'rtada Backend, o'ngda «2-telefon · boshqa o'yinchi» + buzish yozuvi kartasi (BuzishYozuvi).
// Saqlanadi: pm-m10d5-buzish (tayanch 8 shakli aynan) · pm-m10d5-code. O'qiydi: pm-m10d3-talab (chekka, buzilmasin), pm-m9d8-platforma (trek) — kalit yo'q bo'lsa ham ekran ishlaydi.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QKod, QMustaqil, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';
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

const LESSON_META = { lessonId: 'm10-05-v1', lessonTitle: { uz: "Ulanish uzilsa: buzamiz va tuzatamiz", ru: "Если соединение оборвётся: ломаем и чиним" } };
// 20 ekran · oqim: kirish → reja → (tushuncha → test)× → kod → tushuncha → test → sxema → mustaqil ish → final → 2 amaliyot bloki → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'buzish yozuvi', ru: 'запись поломки' }, l: 6, tp: 20, s: 13, d: 6 },
  { t: { uz: 'qayta ulanish', ru: 'переподключение' }, l: 70, tp: 14, s: 12, d: 7.5 },
  { t: 'BUZISH.md', l: 20, tp: 72, s: 12, d: 8.5 },
  { t: { uz: 'takrorlanmadi', ru: 'не повторилось' }, l: 74, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's18', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD ✔: s3 C · s5 A · s7 D · s10 B · s13 — final (picked 0/1 sentinel). `practice: -1` — sentinel (QKod, mustaqil ish, bloklar).
const INLINE_KEYS = { s3: 2, s5: 0, s7: 3, s10: 1, s13: 0, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI). S-026: kod qatori bor joyda kod, qolganida raqam.
const rcKod = (s) => <code className="qcode">{s}</code>;
const RcIzoh = ({ t }) => <span className="rc-izoh">{tr(t)}</span>;
const RECAPS = {
  3: {
    title: { uz: 'Uzilishdagi hodisa keyin kelmaydi', ru: 'Событие во время обрыва потом не приходит' },
    cards: [
      { ic: '1', h: { uz: 'Uchish rejimida ulanish uziladi.', ru: 'В режиме полёта соединение обрывается.' } },
      { ic: '2', h: { uz: 'Shu payt yuborilgan hodisa bu misolda keyin ham kelmaydi.', ru: 'Событие, отправленное в это время, в этом примере не придёт и потом.' } },
      { ic: '3', h: { uz: "Tuzatish: qayta ulanganda ro'yxat Backend'dan qayta so'raladi.", ru: 'Исправление: при переподключении список заново запрашивается у Backend.' }, ask: { uz: "Belgi «Ulangan» — ekrandagi son yangi ekanini qanday bilasiz?", ru: 'Значок «Подключено» — как вы узнаете, что число на экране новое?' } }
    ]
  },
  5: {
    title: { uz: <><code className="qcode">connect</code> har qayta ulanishda ishlaydi</>, ru: <><code className="qcode">connect</code> срабатывает при каждом переподключении</> },
    cards: [
      { ic: null, h: { uz: 'Birinchi ulanishda ishlaydi', ru: 'Срабатывает при первом подключении' }, vis: rcKod("ulanish.on('connect', …)") },
      { ic: null, h: { uz: "Qayta ulanishda ham ishlaydi", ru: 'Срабатывает и при переподключении' }, vis: <RcIzoh t={{ uz: "ichidagi tinglovchi yana qo'shiladi", ru: 'слушатель внутри добавляется снова' }} /> },
      { ic: null, h: { uz: 'Tinglovchi tashqarida — bir marta', ru: 'Слушатель снаружи — один раз' }, vis: rcKod("ulanish.on('oyin-ozgardi', …)"), ask: { uz: 'Ilova uch marta qayta ulansa, bitta qo\'shilishga nechta jonli xabar chiqardi?', ru: 'Если приложение переподключится три раза, сколько живых сообщений появилось бы на одно присоединение?' } }
    ]
  },
  7: {
    title: { uz: 'Xonaga qaytish', ru: 'Возврат в комнату' },
    cards: [
      { ic: null, h: { uz: 'Uzilganda ulanish xonadan chiqadi', ru: 'При обрыве соединение выходит из комнаты' }, vis: rcKod('Xona oyin-1: 0') },
      { ic: null, h: { uz: "Qayta ulanish — yangi ulanish: xonaga o'zi kirmaydi", ru: 'Переподключение — новое соединение: само в комнату не входит' } },
      { ic: null, h: { uz: 'Tuzatish: ochiq o\'yin xonasiga qayta kiradi', ru: 'Исправление: снова входит в комнату открытой игры' }, vis: rcKod('oyin-ochildi'), ask: { uz: 'Xonaga qaytmagan ilova qaysi sonni olmay qoladi?', ru: 'Какое число не получит приложение, не вернувшееся в комнату?' } }
    ]
  },
  10: {
    title: { uz: 'Buzish yozuvi', ru: 'Запись поломки' },
    cards: [
      { ic: '1', h: { uz: 'Nima qildim', ru: 'Что я сделал' } },
      { ic: '2', h: { uz: 'Nima kutdim', ru: 'Что я ожидал' } },
      { ic: '3', h: { uz: "Nima bo'ldi → belgi: buzildi yoki buzilmadi", ru: 'Что произошло → отметка: сломалось или не сломалось' }, ask: { uz: 'Nega «Nima kutdim» buzishdan oldin yoziladi?', ru: 'Почему «Что я ожидал» пишут до поломки?' } }
    ]
  },
  13: {
    title: { uz: 'Buzishdan qayta tekshiruvgacha', ru: 'От поломки до повторной проверки' },
    cards: [
      { ic: '1', h: { uz: 'Kutish yoziladi, keyin ilova buziladi', ru: 'Записывают ожидание, потом ломают приложение' } },
      { ic: '2', h: { uz: "Yozuv agentga beriladi — o'zgartirish qilingach «tuzatish qilindi»", ru: 'Запись отдают агенту — после изменения «исправление сделано»' } },
      { ic: '3', h: { uz: "O'sha usul bilan qayta — «qayta tekshiruvda takrorlanmadi»", ru: 'Снова тем же способом — «при повторной проверке не повторилось»' }, ask: { uz: 'Agent «tuzatdim» dedi, siz qayta tekshirmadingiz. Yozuvda nima turadi?', ru: 'Агент сказал «исправил», вы не перепроверили. Что будет в записи?' } }
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

// ===== BITTA VIZUAL — real vaqt sahnasi IkkiTelefonSahna (163, 180): bitta manba SAHNA + NAMUNA_OYIN + MENTOR_YOZUV, har ekran shuni ishlatadi (tayanch 9.16) =====
// qolip-maket: bf-qoshil bf-samolyot bf-versiya bf-karta bf-urinish bf-qayta bf-no-btn bf-ms-q bf-yf-ok
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const halqa = (on) => (on ? 'bf-halqa' : undefined);
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Ketma-ket sahna qadamlari: [[kechikish ms, fn], …]; ekran yopilsa taymerlar tozalanadi; reduced-motion — kechikishsiz (holatlar bir zumda almashadi, DE-200)
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

const NAMUNA_OYIN = { id: 1, vaqt: { uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' }, joy: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, kerak: 10 };
// Jonli xabar matni — tayanch 1.4 (so'zma-so'z)
const JONLI_XABAR = { uz: "Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10", ru: 'Суббота, 18:00 — присоединился ещё один игрок: 9 / 10' };
// «Maydon Jamoa» nomi — 11-Modul tayanch 9.62 yashili (PM palitrasining ok yashilidan farqli; F-1006-389)
const MAYDON_RANG = '#2E9E4F';
const SAHNA = {
  t1: { uz: '1-telefon · siz', ru: 'Телефон 1 · вы' },
  t2: { uz: "2-telefon · boshqa o'yinchi", ru: 'Телефон 2 · другой игрок' },
  nom: 'Maydon Jamoa',
  backend: 'Backend',
  orqa: { uz: "‹ O'yinlar", ru: '‹ Игры' },
  oyinlar: { uz: "O'yinlar", ru: 'Игры' },
  kun: { uz: 'Shanba', ru: 'Суббота' },
  qoshil: { uz: "Qo'shilaman", ru: 'Присоединяюсь' },
  qoshildi: { uz: "Qo'shildingiz", ru: 'Вы присоединились' },
  koryapti: { uz: "Hozir ko'ryapti:", ru: 'Сейчас смотрят:' },
  eski: { uz: 'eski', ru: 'старое' },
  ochiq: { uz: 'ochiq', ru: 'открыто' },
  kelmadi: { uz: 'kelmadi', ru: 'не дошло' },
  versiya: { uz: 'Yangi versiya', ru: 'Новая версия' },
  versiyaQator: { uz: 'yangi versiya ishga tushmoqda…', ru: 'новая версия запускается…' },
  kv: { hodisa: 'oyin-ozgardi', sorov: null }
};
// Uch ulanish holati — bitta komponent (UlanishBelgisi); rang faqat holat (D3)
const BELGILAR = {
  ulangan: { t: { uz: 'Ulangan', ru: 'Подключено' }, rang: 'ok' },
  ulanmoqda: { t: { uz: 'Ulanmoqda…', ru: 'Подключается…' }, rang: 'accent' },
  ulanmagan: { t: { uz: 'Ulanmagan', ru: 'Не подключено' }, rang: 'ink2' }
};
// Buzish yozuvi belgilari (A-bo'lim 10): buzildi — err · buzilmadi — ink2 · tuzatish qilindi — accent · takrorlanmadi — ok · yana buzildi — err
const YOZUV_BELGI = {
  buzildi: { uz: 'buzildi', ru: 'сломалось' },
  buzilmadi: { uz: 'buzilmadi', ru: 'не сломалось' },
  tuzatildi: { uz: 'tuzatish qilindi', ru: 'исправление сделано' },
  takrorlanmadi: { uz: 'qayta tekshiruvda takrorlanmadi', ru: 'при повторной проверке не повторилось' },
  takrorlandi: { uz: 'qayta tekshiruvda yana buzildi', ru: 'при повторной проверке снова сломалось' }
};
const YOZUV_QATOR = [
  { k: 'qildim', t: { uz: 'Nima qildim', ru: 'Что я сделал' } },
  { k: 'kutdim', t: { uz: 'Nima kutdim', ru: 'Что я ожидал' } },
  { k: 'boldi', t: { uz: "Nima bo'ldi", ru: 'Что произошло' } }
];
// Uch buzish usuli — kalit barqaror (tartib o'zgarmaydi: internet · fon · versiya); qilaman — 12-ekrandagi oldindan yozilgan «Nima qilaman»
const USULLAR = [
  { k: 'internet', nom: { uz: 'Internetni uzish', ru: 'Отключить интернет' }, qilaman: { uz: "Uchish rejimini yoqaman; belgi «Ulanmoqda…» bo'lgach boshqa akkaunt o'zgarish qiladi; keyin o'chiraman.", ru: 'Включаю режим полёта; когда значок станет «Подключается…», другой аккаунт вносит изменение; потом выключаю.' } },
  { k: 'fon', nom: { uz: 'Fonga olib qaytarish', ru: 'Свернуть и вернуться' }, qilaman: { uz: "Boshqa ilovaga o'taman; shu payt boshqa akkaunt o'zgarish qiladi; bir daqiqadan keyin qaytaman.", ru: 'Переключаюсь на другое приложение; в это время другой аккаунт вносит изменение; через минуту возвращаюсь.' } },
  { k: 'versiya', nom: { uz: "Backend'ning yangi versiyasi", ru: 'Новая версия Backend' }, qilaman: { uz: "Render'da Backend'ni qayta chiqaraman; belgi «Ulangan» bo'lgach, boshqa akkaunt o'zgarish qiladi.", ru: 'Перевыпускаю Backend на Render; когда значок станет «Подключено», другой аккаунт вносит изменение.' } }
];
const usulNom = (k) => (USULLAR.find(u => u.k === k) || USULLAR[0]).nom;
// Mentor misolining buzish yozuvi (A-bo'lim 4-band jadvali, aynan) — 9, 11-ekranlar, A1/A2 kutilgan natija, A2 Yordami, 12-ekran Mentor rejimi
const MENTOR_YOZUV = [
  { usul: 'internet', belgi: 'buzildi', keyin: 'takrorlanmadi',
    qildim: { uz: "Uchish rejimini yoqdim; belgi «Ulanmoqda…» bo'lgach agent tekshiruv akkauntidan «Shanba, 18:00» ga qo'shildi; keyin uchish rejimini o'chirdim.", ru: 'Включил режим полёта; когда значок стал «Подключается…», агент с тестового аккаунта присоединился к «Суббота, 18:00»; потом выключил режим полёта.' },
    kutdim: { uz: "Belgi «Ulangan» bo'lgach, «9 / 10» ko'rinadi.", ru: 'Когда значок станет «Подключено», будет видно «9 / 10».' },
    boldi: { uz: "Belgi «Ulangan», lekin «8 / 10» qoldi.", ru: 'Значок «Подключено», но осталось «8 / 10».' } },
  { usul: 'fon', belgi: 'buzilmadi', keyin: null,
    qildim: { uz: "Boshqa ilovaga o'tdim; shu payt agent tekshiruv akkauntidan qo'shildi; bir daqiqadan keyin qaytdim.", ru: 'Переключился на другое приложение; в это время агент присоединился с тестового аккаунта; через минуту вернулся.' },
    kutdim: { uz: "Qaytganimda «9 / 10» ko'rinadi.", ru: 'Когда вернусь, будет видно «9 / 10».' },
    boldi: { uz: "Qaytganimda «9 / 10», belgi «Ulangan».", ru: 'Когда вернулся — «9 / 10», значок «Подключено».' } },
  { usul: 'versiya', belgi: 'buzildi', keyin: 'takrorlanmadi',
    qildim: { uz: "Render'da Backend'ni qayta chiqardim; belgi yana «Ulangan» bo'lgach, ikkinchi telefonda o'yinni ochdim va agent tekshiruv akkauntidan qo'shildi.", ru: 'Перевыпустил Backend на Render; когда значок снова стал «Подключено», открыл игру на втором телефоне, и агент присоединился с тестового аккаунта.' },
    kutdim: { uz: "Bitta jonli xabar; ikkinchi telefonda «Hozir ko'ryapti: 2».", ru: 'Одно живое сообщение; на втором телефоне «Hozir ko\'ryapti: 2».' },
    boldi: { uz: "Jonli xabar ikki marta chiqdi; ikkinchi telefonda «Hozir ko'ryapti: 1».", ru: 'Живое сообщение появилось дважды; на втором телефоне «Hozir ko\'ryapti: 1».' } }
];
// Buzishdan qayta tekshiruvgacha — 6 bo'lak (13-ekran final)
const TUZATISH_YOLI = [
  { id: 'kutish', label: { uz: 'Talabdagi chekka holatdan nima kutishingizni yozasiz', ru: 'Пишете, чего ждёте от крайнего случая из требования' } },
  { id: 'buzish', label: { uz: 'Ilovani bitta usul bilan buzasiz', ru: 'Ломаете приложение одним способом' } },
  { id: 'yozish', label: { uz: "Nima bo'lganini yozib, belgi qo'yasiz", ru: 'Записываете, что произошло, и ставите отметку' } },
  { id: 'agent', label: { uz: 'Yozuvni agentga berasiz', ru: 'Отдаёте запись агенту' } },
  { id: 'tuzatish', label: { uz: "Agent o'zgartirish qilgach, «tuzatish qilindi» deb belgilaysiz", ru: 'Когда агент внёс изменение, отмечаете «исправление сделано»' } },
  { id: 'qayta', label: { uz: "O'sha usul bilan qayta buzib, natijani yozasiz", ru: 'Снова ломаете тем же способом и записываете результат' } }
];
const BUZISH_KALIT = 'pm-m10d5-buzish';
const TALAB_KALIT = 'pm-m10d3-talab';

const UlanishBelgisi = ({ holat }) => {
  if (!holat) return null;
  const b = BELGILAR[holat];
  return <span key={holat} className={cx('bf-belgi', holat)}><i className="bf-belgi-n" />{b && tr(b.t)}</span>;
};
const SamolyotIc = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5l8 2.5z" fill="currentColor" /></svg>
);
const Qadam = ({ q }) => (q ? <span className="bf-qadam fade-step"><i>{q.n}</i>{tr(q.t)}</span> : null);
// Jonli xabar — ilova ekrani ustida, tepada (1 yoki 2 ta, ustma-ust); matn tayanch 1.4
const JonliXabarlar = ({ n }) => (n > 0
  ? <span className="bf-jx-ust">{Array.from({ length: n }, (_, i) => <span key={i} className="bf-jx" style={{ animationDelay: `${i * 0.3}s` }}>{tr(JONLI_XABAR)}</span>)}</span>
  : null);

// Telefon ichidagi ekranlar: oyin · oyinlar · boshqa (nomsiz kulrang chat oynasi — «boshqa ilova», 9-ekran)
const TelEkran = ({ t }) => {
  const ekran = t.ekran || 'oyin';
  if (ekran === 'boshqa') return (
    <div className="bf-boshqa" aria-hidden="true"><span className="bf-bo-bar" /><span className="bf-bo-p" /><span className="bf-bo-p o" /><span className="bf-bo-p" /><span className="bf-bo-inp" /></div>
  );
  if (ekran === 'oyinlar') return (
    <div className="bf-oyinlar">
      <div className="bf-ol-bosh"><b className="bf-ol-sar">{tr(SAHNA.oyinlar)}</b><UlanishBelgisi holat={t.belgi} /></div>
      <span className="bf-kun">{tr(SAHNA.kun)}</span>
      <button type="button" className={cx('bf-karta', t.onKarta && 'bos', halqa(t.kartaHalqa))} disabled={!t.onKarta} onClick={t.onKarta}>
        <b>{tr(NAMUNA_OYIN.vaqt)}</b><span>{tr(NAMUNA_OYIN.joy)}</span>
        <span className="bf-karta-son">{t.son ?? 8} / 10</span>
      </button>
    </div>
  );
  const son = t.son;
  return (
    <div className="bf-oyin">
      <span className="bf-oyin-tepa"><span className="bf-oyin-orqa">{tr(SAHNA.orqa)}</span><UlanishBelgisi holat={t.belgi} /></span>
      <b className="bf-oyin-sar">{tr(NAMUNA_OYIN.vaqt)}</b>
      <span className="bf-oyin-joy">{tr(NAMUNA_OYIN.joy)}</span>
      <span className="bf-hisob"><b key={String(son)} className={cx('bf-son', t.sonYangi && 'yangi')}>{son == null ? '…' : son}</b> / 10{t.eski && <em className="bf-eski">{tr(t.eski)}</em>}</span>
      <span className="bf-doiralar" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} className={cx(son != null && i < son && 'bor', t.sonYangi && son != null && i === son - 1 && 'yangi')} />)}</span>
      {t.koryapti != null && <span className="bf-kory">{tr(SAHNA.koryapti)} <b key={t.koryapti} className={cx(t.koryYangi && 'bf-pop')}>{t.koryapti}</b>{t.koryEski && <em className="bf-eski">{tr(SAHNA.eski)}</em>}</span>}
      {t.qoshilYoq ? null : <button type="button" className={cx('bf-qoshil', t.qoshildi && 'off', halqa(t.qoshilHalqa))} disabled={!t.onQoshil || t.qoshildi} onClick={t.onQoshil}>{tr(t.qoshildi ? SAHNA.qoshildi : SAHNA.qoshil)}</button>}
    </div>
  );
};
// Telefon — o'lchami barqaror 172×272 (SABOQ 22), yorliq ramka ustida (SABOQ 23), nom o'z rangida (logotip yo'q, D4). Sudrash yo'q — pointer capture olinmaydi (E 47)
const Telefon = ({ no, t = {} }) => (
  <div className="bf-tel-ust">
    {t.tex ? <span className="bf-tel-yorliq tex">{t.tex}</span> : <span className={cx('bf-tel-yorliq', no === 1 ? 'b1' : 'b2')}>{tr(no === 1 ? SAHNA.t1 : SAHNA.t2)}</span>}
    <div className="bf-telefon">
      <div className="bf-tel-bar">
        <span className="bf-tel-nom">{SAHNA.nom}</span>
        {t.samolyot !== undefined && (
          <button type="button" className={cx('bf-samolyot', t.samolyot && 'on', halqa(t.samolyotHalqa))} disabled={!t.onSamolyot} onClick={t.onSamolyot}
            aria-label={tr({ uz: 'Uchish rejimi', ru: 'Режим полёта' })} aria-pressed={!!t.samolyot}><SamolyotIc /></button>
        )}
      </div>
      <div className="bf-tel-ekran" key={t.ekran || 'oyin'}>
        <TelEkran t={t} />
        <JonliXabarlar n={t.jx || 0} />
      </div>
    </div>
    <Qadam q={t.qadam} />
    {t.osti}
  </div>
);
const BackendTugun = ({ b = {} }) => (
  <div className="bf-be-ust">
    <div className="bf-be-joy">
      <div className={cx('bf-backend', b.yonadi && 'yon', b.tugildi && 'tugildi', b.ok && 'ok', b.xato && 'xato')}>
        <span className="bf-be-nom">{SAHNA.backend}</span>
        {b.db != null && <span className={cx('bf-db', b.dbYon && 'yon')}>Database: <b key={b.db} className={cx(b.dbYangi && 'bf-pop')}>{b.db}</b></span>}
        {b.ichi}
        {b.qator && <span className="bf-be-qator fade-step">{tr(b.qator)}</span>}
      </div>
    </div>
    <Qadam q={b.qadam} />
    {b.osti}
  </div>
);
// Konvert chiziq bo'ylab uchadi: yon 'be' — telefondan Backend'ga, 'tel' — Backend'dan telefonga; toxta 'sonadi' — uzilgan joyda so'nadi
const Konvert = ({ k, no, tik }) => {
  if (!k) return null;
  const telBosh = tik || no === 1;
  const ab = telBosh ? k.yon === 'be' : k.yon !== 'be';
  const anim = `bf-kv-${tik ? 'y' : 'x'}-${k.toxta || (ab ? 'ab' : 'ba')}`;
  const y = k.yorliq !== undefined ? k.yorliq : SAHNA.kv[k.tur];
  return <span className={cx('bf-kv', k.tur, k.toxta)} style={{ animationName: anim }}><i className="bf-kv-i" />{y && <b className="bf-kv-y">{tr(y)}</b>}</span>;
};
// Chiziq holatlari: yoq · ochiq · uzilgan (uzuq, kulrang, boshida ↻; urin — urinish nuqtalari) · tiklan (↻ chiziqni tiklaydi)
const Chiziq = ({ holat = 'yoq', no, tik, k, yorliq, urin }) => (
  <div className={cx('bf-chiziq', tik ? 'tik' : 'yot', `n${no}`, `h-${holat}`)}>
    <span className="bf-chiziq-i" key={holat} />
    {holat === 'ochiq' && <b className="bf-chiziq-y ok">{tr(SAHNA.ochiq)}</b>}
    {(holat === 'uzilgan' || holat === 'tiklan') && <b className={cx('bf-chiziq-r', holat === 'tiklan' && 'aylan')} aria-hidden="true">↻</b>}
    {urin && holat === 'uzilgan' && <span className="bf-urin" aria-hidden="true"><i /><i /><i /></span>}
    {yorliq && <b className="bf-chiziq-y past">{tr(yorliq)}</b>}
    <Konvert key={k ? k.id : 'yoq'} k={k} no={no} tik={tik} />
  </div>
);
// IkkiTelefonSahna — 2-pilot sahnasi bilan bir xil ko'rinish (nusxa, import emas): chapda «1-telefon · siz», o'rtada Backend, o'ngda «2-telefon · boshqa o'yinchi».
// ixcham (yoki telefon) — telefonlar tepada yonma-yon, Backend pastda, chiziqlar tik. Bitta telefonli ekranda — telefon va Backend.
const IkkiTelefonSahna = ({ t1, t2, be, c1, c2, k1, k2, y1, urin, ixcham }) => {
  const mob = useIsMobile(640);
  const tik = !!(ixcham || mob);
  const ikki = !!t2;
  return (
    <div className={cx('bf-sahna', tik ? 'tik' : 'yot', ikki ? 'ikki' : 'bir', !be && 'bes')}>
      <div className="bf-s-t1"><Telefon no={1} t={t1} /></div>
      {be && <div className="bf-s-c1"><Chiziq holat={c1} no={1} tik={tik} k={k1} yorliq={y1} urin={urin} /></div>}
      {be && <div className="bf-s-be"><BackendTugun b={be} /></div>}
      {ikki && be && <div className="bf-s-c2"><Chiziq holat={c2} no={2} tik={tik} k={k2} urin={urin} /></div>}
      {ikki && <div className="bf-s-t2"><Telefon no={2} t={t2} /></div>}
    </div>
  );
};

// Buzish yozuvi (9, 11, 14, 15-ekranlar): karta — usul nomi, uch qator, belgi joyi; ixcham qator — usul · belgi
const YBelgi = ({ b }) => (b ? <em className={cx('bf-yb', b)}>{tr(YOZUV_BELGI[b])}</em> : <em className="bf-yb bosh" aria-hidden="true" />);
const BuzishYozuvi = ({ no, usul, matn = {}, korinadi = 3, belgi, tuz, qayta, kichik, className, children }) => (
  <div className={cx('bf-yozuv', kichik && 'kichik', className)}>
    <span className="bf-yz-bosh"><i>{no}</i><b>{tr(usulNom(usul))}</b></span>
    {YOZUV_QATOR.map((q, i) => (
      <span key={q.k} className={cx('bf-yz-q', i < korinadi && matn[q.k] && 'bor')}><em>{tr(q.t)}</em><span key={i < korinadi ? 'b' : 'y'} className="bf-yz-m">{i < korinadi && matn[q.k] ? tx(matn[q.k]) : '…'}</span></span>
    ))}
    {(belgi !== undefined || tuz || qayta) && <span className="bf-yz-belgilar"><YBelgi b={belgi} />{tuz && <YBelgi b="tuzatildi" />}{qayta && <YBelgi b={qayta} />}</span>}
    {children}
  </div>
);
const YozuvIx = ({ no, usul, belgi, tuz, qayta, yangi }) => (
  <span className={cx('bf-yix', yangi && 'yangi')}><i>{no}</i><b>{tr(usulNom(usul))}</b>{belgi && <YBelgi b={belgi} />}{tuz && <YBelgi b="tuzatildi" />}{qayta && <YBelgi b={qayta} />}</span>
);
// Chat pufagi (T-008: olam ichidagi matn)
const Puf = ({ kim, siz, children }) => <span className={cx('bf-puf', siz ? 'siz' : 'ag')}><b>{kim}</b><span>{children}</span></span>;

// Ballsiz bashorat: tanlangach ixcham qator bo'lib natijagacha turadi (SABOQ 11); har chipning o'z yengil chegarasi, guruh ramkasi yo'q (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="bf-halqa-g"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="bf-bash-ix fade-step"><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosaning birinchi, kichik qatori (E 42): tanlangan javob qaytarilmaydi (u tepada turibdi)
const Natija = ({ togri, haqiqat, haqYorliq }) => (togri
  ? <span className="bf-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="bf-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr(haqYorliq || { uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
// Bitta yashil quti: taxmin qatori · xulosa · izoh (E 42 — izoh alohida kulrang qator bo'lib osilmaydi)
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="bf-x-m">{matn}</span>{izoh && <span className="bf-x-iz">{izoh}</span>}</>;
const navYorliq = (taxmin, q, jami, qadamY, done) => (done ? { uz: 'Davom etish', ru: 'Продолжить' }
  : !taxmin ? BASH_YORLIQ
    : { uz: `${qadamY.uz} (${q}/${jami})`, ru: `${qadamY.ru} (${q}/${jami})` });
const QADAMLAR_Y = { uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' };
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };
const Ustoz = ({ satrlar }) => <div className="bf-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tr(s)}</span>)}</div>;

// ===== SCREEN 0 — KIRISH (QKirish: ikki telefon + agent pufagi; «Qo'shilaman» → konvert → 1-telefonda «9 / 10» va bitta jonli xabar; keyin variantlar faol) =====
const AGENT_DEDI = { uz: 'Tayyor! Talabdagi uchala chekka holatni bajardim.', ru: 'Готово! Все три крайних случая из требования сделал.' };
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Hozir ishladi — uzilishda ham ishlaydi', ru: 'Сейчас сработало — сработает и при обрыве' } },
  { id: 'b', label: { uz: "Internetni o'zim uzib, natijaga qarayman", ru: 'Сам отключу интернет и посмотрю на результат' } },
  { id: 'c', label: { uz: "Agent «bajardim» dedi — shuning o'zi yetadi", ru: 'Агент сказал «сделал» — этого достаточно' } }
];
const HOOK_JAVOB = {
  a: { uz: <><b>Qiziq fikr!</b> Hozir internet bor edi. Talabdagi chekka holat esa uzilishda bo'ladi — uni hali hech kim ko'rmadi.</>, ru: <><b>Интересная мысль!</b> Сейчас интернет был. А крайний случай из требования бывает при обрыве — его ещё никто не видел.</> },
  b: { uz: <><b>Aynan!</b> Chekka holat oddiy paytda ko'rinmaydi. Uni o'zingiz yuzaga keltirasiz va nima bo'lganiga qaraysiz.</>, ru: <><b>Именно!</b> Крайний случай в обычное время не виден. Вы сами его вызываете и смотрите, что произошло.</> },
  c: { uz: <><b>Qiziq fikr!</b> Agentning «bajardim» degani — da'vo. Natijani o'zingiz ko'rmaguningizcha, u tekshirilmagan.</>, ru: <><b>Интересная мысль!</b> «Сделал» агента — это заявление. Пока вы сами не увидите результат, оно не проверено.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [bosildi, setBosildi] = useState(avval);
  const [kv, setKv] = useState({ k1: null, k2: null });
  const [db, setDb] = useState(avval ? 9 : 8);
  const [son1, setSon1] = useState(avval ? 9 : 8);
  const [jx, setJx] = useState(0);
  const [faol, setFaol] = useState(avval);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const ketma = useKetma();
  const qoshil = () => {
    if (bosildi) return;
    setBosildi(true); setSc(n => n + 1);
    setKv({ k1: null, k2: { id: 'q', tur: 'sorov', yon: 'be' } });
    ketma([[900, () => { setKv({ k1: null, k2: null }); setDb(9); }],
      [300, () => setKv({ k1: { id: 'h', tur: 'hodisa', yon: 'tel' }, k2: null })],
      [900, () => { setKv({ k1: null, k2: null }); setSon1(9); setJx(1); }],
      [700, () => { setFaol(true); setSc(n => n + 1); }],
      [2600, () => setJx(0)]]);
  };
  const pick = (v) => { if (picked !== null || !faol) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const javob = picked !== null;
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!javob} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('bf-k', faol && !javob && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Ulanish uzilsa ham ishlashini <span className="italic" style={{ color: T.accent }}>qanday bilasiz</span>?</>, ru: <>Как вы узнаете, что всё работает <span className="italic" style={{ color: T.accent }}>и при обрыве соединения</span>?</> })}
          mentor={<Mentor>{faol
            ? tr({ uz: "Endi o'ngdagi javoblardan birini tanlang.", ru: 'Теперь выберите один из ответов справа.' })
            : tr({ uz: "Mentor misolida agent talabdagi uch chekka holatni «bajardim» dedi — ikkinchi telefonda «Qo'shilaman» ni bosing.", ru: 'В примере Ментора агент сказал, что «сделал» три крайних случая из требования, — нажмите «Qo\'shilaman» на втором телефоне.' })}</Mentor>}
          maket={<div className="bf-k0">
            <div className="bf-agent fade-step"><Puf kim="Antigravity">{tr(AGENT_DEDI)}</Puf>{javob && <em className="bf-dava fade-step">{tr({ uz: "da'vo · tekshirilmagan", ru: 'заявление · не проверено' })}</em>}</div>
            <IkkiTelefonSahna ixcham
              t1={{ belgi: 'ulangan', son: son1, sonYangi: son1 === 9 && !avval, koryapti: 2, qoshildi: true, jx }}
              t2={{ belgi: 'ulangan', son: bosildi ? 9 : 8, sonYangi: bosildi && !avval, koryapti: 2, qoshildi: bosildi, onQoshil: bosildi ? null : qoshil, qoshilHalqa: !bosildi }}
              be={{ db, dbYangi: db === 9 && !avval }} c1="ochiq" c2="ochiq" k1={kv.k1} k2={kv.k2} />
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={!faol}
          javob={javob && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda dars oxiridagi buzish yozuvi — uch usul va bo'sh belgi joyi, qatorlar navbat bilan; o'ngda «01 · matn · teg») =====
const REJA = [
  { t: { uz: "Internet uzilganda nima ko'rinmay qolishini topish", ru: 'Найти, что перестаёт быть видно при обрыве интернета' }, teg: { uz: 'uzilish', ru: 'обрыв' } },
  { t: { uz: 'Bitta o\'zgarish nega ikki marta chiqishini bilish', ru: 'Понять, почему одно изменение появляется дважды' }, teg: { uz: 'takror hodisa', ru: 'повторное событие' } },
  { t: { uz: "Qayta ulangan ilova o'yin xonasiga qaytishi", ru: 'Переподключённое приложение возвращается в комнату игры' }, teg: { uz: 'qayta ulanish', ru: 'переподключение' } },
  { t: { uz: "O'z ilovangizni buzish, tuzatish va qayta tekshirish", ru: 'Сломать, исправить и перепроверить своё приложение' }, teg: { uz: 'uchta muammo', ru: 'три проблемы' } }
];
const RejaYozuv = () => (
  <div className="bf-rj">
    {USULLAR.map((u, i) => <span key={u.k} className="bf-rj-q" style={{ animationDelay: `${0.25 + i * 0.12}s` }}><i>{i + 1}</i><b>{tr(u.nom)}</b><em className="bf-yb bosh" aria-hidden="true" /></span>)}
    <code className="bf-rj-f">BUZISH.md</code>
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => {
  const isMentor = useMentorLive();
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun ilovangizni <span className="italic" style={{ color: T.accent }}>buzib ko'rasiz va tuzatasiz</span>.</>, ru: <>Сегодня вы <span className="italic" style={{ color: T.accent }}>сломаете и исправите</span> своё приложение.</> })}
        mentor={<Mentor>{tr({ uz: "Avval Maydon Jamoa'da uch muammoni topib, sababini ko'rasiz. Keyin xuddi shuni o'z ilovangizda qilasiz.", ru: 'Сначала найдёте три проблемы в Maydon Jamoa и увидите их причину. Потом сделаете то же в своём приложении.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<RejaYozuv />}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <p className="bf-reja-past">{tx({ uz: "o'z repo'ngiz — `BUZISH.md` va tuzatishlar · Mentor misoli `maydon-jamoa` · boshlanish `m12-dars-05-start` · namuna `m12-dars-05-done`", ru: 'ваш репозиторий — `BUZISH.md` и исправления · пример Ментора `maydon-jamoa` · начало `m12-dars-05-start` · образец `m12-dars-05-done`' })}</p>
        <QIzoh>{tx({ uz: "Mentor misolida `m12-dars-05-start` — agent «bajardim» deganidan keyingi kod; muammolar shu darsda topiladi.", ru: 'В примере Ментора `m12-dars-05-start` — код после того, как агент сказал «сделал»; проблемы находятся на этом уроке.' })}</QIzoh>
        {isMentor && <Ustoz satrlar={[
          { uz: "Og'ir qismlar — 8-ekran (kod oynasi) va ikki blok (Render'da qayta chiqarish bir necha daqiqa olishi mumkin). 2, 4, 6-ekranlarga ortiqcha vaqt bermang. Juftlikda ishlash qulay: sherik telefonida ham shu ekran ochiq tursa, «Hozir ko'ryapti» tekshiriladi.", ru: 'Тяжёлые части — экран 8 (окно кода) и два блока (перевыпуск на Render может занять несколько минут). Не тратьте лишнее время на экраны 2, 4, 6. Удобно работать в паре: если на телефоне партнёра открыт тот же экран, проверяется «Hozir ko\'ryapti».' },
          { uz: "Qayta ulanish raqamlari (o'quvchi so'rasa): socket.io birinchi urinishni ≈1 soniyadan keyin qiladi, har urinishda kutish ikki barobar o'sadi, lekin 5 soniyadan oshmaydi; urinishlar soni sukutda cheklanmagan. Darsda — «odatda bir necha soniyada».", ru: 'Цифры переподключения (если ученик спросит): socket.io делает первую попытку примерно через 1 секунду, с каждой попыткой ожидание растёт вдвое, но не больше 5 секунд; число попыток по умолчанию не ограничено. На уроке — «обычно за несколько секунд».' }
        ]} />}
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · uzilish (bashorat + 3 qadam): samolyot → «Ulanmoqda…»; qo'shilish → konvert uzilgan joyda so'nadi «kelmadi»; samolyot o'chadi → «Ulangan», «8 / 10» «eski» =====
const S2_TAXMIN = [{ k: '8', t: { uz: '«8 / 10»', ru: '«8 / 10»' } }, { k: '9', t: { uz: '«9 / 10»', ru: '«9 / 10»' } }];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [band, setBand] = useState(false);
  const [samolyot, setSamolyot] = useState(false);
  const [c1, setC1] = useState('ochiq');
  const [k1, setK1] = useState(null);
  const [belgi, setBelgi] = useState('ulangan');
  const [db, setDb] = useState(avval ? 9 : 8);
  const [dbYon, setDbYon] = useState(false);
  const [qoshildi, setQoshildi] = useState(avval);
  const [kelmadi, setKelmadi] = useState(false);
  const [eski, setEski] = useState(avval);
  const ketma = useKetma();
  const done = q >= 3;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const samYoq = () => { if (!taxmin || q !== 0 || band) return; setSamolyot(true); setC1('uzilgan'); setBelgi('ulanmoqda'); setQ(1); };
  const qoshil = () => {
    if (q !== 1 || band) return;
    setBand(true); setQoshildi(true); setDb(9);
    ketma([[450, () => setK1({ id: 'h', tur: 'hodisa', yon: 'tel', toxta: 'sonadi' })], [1000, () => { setK1(null); setKelmadi(true); setQ(2); setBand(false); }]]);
  };
  const samOch = () => {
    if (q !== 2 || band) return;
    setBand(true); setSamolyot(false); setKelmadi(false); setC1('tiklan');
    ketma([[2000, () => { setC1('ochiq'); setBelgi('ulangan'); setEski(true); setDbYon(true); setQ(3); setBand(false); }], [1300, () => setDbYon(false)]]);
  };
  const samBos = q === 0 ? samYoq : q === 2 ? samOch : null;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · uzilish', ru: 'Понятие · обрыв' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 3, QADAMLAR_Y, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Internet qaytgach, ekranda <span className="italic" style={{ color: T.accent }}>qaysi son</span> turadi?</>, ru: <>Какое число будет на экране, <span className="italic" style={{ color: T.accent }}>когда вернётся интернет</span>?</> })}
        mentor={<Mentor>{tr({ uz: 'Birinchi telefonda uchish rejimini yoqing va qadamlarni tartib bilan bajaring.', ru: 'Включите режим полёта на первом телефоне и выполните шаги по порядку.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "Belgi yana «Ulangan» bo'lgach, birinchi telefonda qaysi son turadi?", ru: 'Когда значок снова станет «Подключено», какое число будет на первом телефоне?' }} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="bf-viz">
          <IkkiTelefonSahna
            t1={{ belgi, son: 8, eski: eski && SAHNA.eski, qoshildi: true, samolyot, onSamolyot: taxmin && !band && !tugadi ? samBos : null, samolyotHalqa: !!(taxmin && !band && samBos && !tugadi),
              qadam: !taxmin || band || tugadi ? null : q === 0 ? { n: 1, t: { uz: 'Uchish rejimini yoqing', ru: 'Включите режим полёта' } } : q === 2 ? { n: 3, t: { uz: "Uchish rejimini o'chiring", ru: 'Выключите режим полёта' } } : null }}
            be={{ db, dbYangi: db === 9 && !avval, dbYon }}
            t2={{ belgi: 'ulangan', son: qoshildi ? 9 : 8, sonYangi: qoshildi && !avval, qoshildi, onQoshil: q === 1 && !band ? qoshil : null, qoshilHalqa: q === 1 && !band,
              qadam: q === 1 && !band ? { n: 2, t: { uz: "Ikkinchi telefonda qo'shiling", ru: 'Присоединитесь на втором телефоне' } } : null }}
            c1={c1} c2="ochiq" k1={k1} y1={kelmadi ? SAHNA.kelmadi : null} />
          {done && <p className="bf-nom fade-step">{tr({ uz: <>Ilovaning chekka holatini ataylab yuzaga keltirib tekshirish — <b>buzish</b>.</>, ru: <>Намеренно вызвать крайний случай приложения и проверить — <b>«ломать»</b>.</> })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === '8'} haqiqat={{ uz: '«8 / 10» — eski son', ru: '«8 / 10» — старое число' }} />}
          matn={tr({ uz: "Bu misolda uzilish paytida yuborilgan hodisa keyin kelmadi: belgi «Ulangan», son esa eski.", ru: 'В этом примере событие, отправленное во время обрыва, потом не пришло: значок «Подключено», а число старое.' })}
          izoh={tr({ uz: "Tuzatish: qayta ulanganda ro'yxat Backend'dan qayta so'raladi.", ru: 'Исправление: при переподключении список заново запрашивается у Backend.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 2, C) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Internet qaytdi, belgi «Ulangan», son esa eski. Nega?"
    question={tr({ uz: <h2 className="title h-ask">Internet qaytdi, belgi «Ulangan», son esa eski. <span className="italic" style={{ color: T.accent }}>Nega?</span></h2>, ru: <h2 className="title h-ask">Интернет вернулся, значок «Подключено», а число старое. <span className="italic" style={{ color: T.accent }}>Почему?</span></h2> })}
    options={[
      { uz: "Backend qo'shilishni hali yozmagan edi", ru: 'Backend ещё не записал присоединение' },
      { uz: 'Ilova hodisani ikki marta sanagan edi', ru: 'Приложение посчитало событие дважды' },
      { uz: 'Uzilishdagi hodisa keyin kelmagan edi', ru: 'Событие во время обрыва потом не пришло' },
      { uz: "Belgi ulanishni xato ko'rsatgan edi", ru: 'Значок показал соединение неверно' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Bu misolda Backend uzilgan ilova uchun hodisani saqlamaydi — qayta ulangach ham u kelmaydi.', ru: 'В этом примере Backend не хранит событие для отключённого приложения — оно не придёт и после переподключения.' }}
    explainWrong={{
      0: { uz: "Sahnada «Database: 9» edi — qo'shilish yozilgan.", ru: 'На сцене было «Database: 9» — присоединение записано.' },
      1: { uz: 'Ikki marta sanash uchun hodisa avval kelishi kerak.', ru: 'Чтобы посчитать дважды, событие сначала должно прийти.' },
      3: { uz: "Ulanish haqiqatan tiklangan — belgi to'g'ri edi.", ru: 'Соединение действительно восстановлено — значок был верным.' },
      default: { uz: 'Uzilish paytida yuborilgan hodisa keyin kelmaydi.', ru: 'Событие, отправленное во время обрыва, потом не приходит.' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA · qayta ulanish (bashorat + 2 qadam): «Yangi versiya» → uzilish, urinish nuqtalari, tiklanish; kod kartasida connect yonadi, «Tinglovchilar: 2»; qo'shilish → ikki jonli xabar =====
const S4_TAXMIN = [{ k: 'bir', t: { uz: 'Bitta', ru: 'Одно' } }, { k: 'ikki', t: { uz: 'Ikkita', ru: 'Два' } }, { k: 'uch', t: { uz: 'Uchta', ru: 'Три' } }];
const KodKarta = ({ yorliq, izoh, qatorlar, yon = {} }) => (
  <div className="bf-kod">
    <span className="bf-kod-y">{yorliq}</span>
    <div className="bf-kod-p">{qatorlar.map((s, i) => <span key={i + s + (yon[i] || '')} className={cx('bf-kod-q', yon[i])}>{s || ' '}</span>)}</div>
    {izoh && <span className="bf-kod-iz">{izoh}</span>}
  </div>
);
const KOD4 = ["ulanish.on('connect', () => {", "  ulanish.on('oyin-ozgardi', () => {", '    korsat();', '    jonliXabar();', '  });', '});'];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [c, setC] = useState('ochiq');
  const [urin, setUrin] = useState(false);
  const [belgi, setBelgi] = useState('ulangan');
  const [beQator, setBeQator] = useState(null);
  const [yon, setYon] = useState({});
  const [tingl, setTingl] = useState(avval ? 2 : 1);
  const [k1, setK1] = useState(null);
  const [son1, setSon1] = useState(avval ? 9 : 8);
  const [jx, setJx] = useState(avval ? 2 : 0);
  const [qoshildi, setQoshildi] = useState(avval);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const versiya = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setBeQator(SAHNA.versiyaQator);
    ketma([[600, () => { setC('uzilgan'); setUrin(true); setBelgi('ulanmoqda'); }],
      [2600, () => { setC('tiklan'); setUrin(false); }],
      [2000, () => { setC('ochiq'); setBelgi('ulangan'); setBeQator(null); setYon({ 0: 'yon' }); }],
      [700, () => setYon({ 0: 'yon', 1: 'yon' })],
      [600, () => { setTingl(2); setQ(1); setBand(false); }]]);
  };
  const qoshil = () => {
    if (q !== 1 || band) return;
    setBand(true); setQoshildi(true); setYon({});
    ketma([[450, () => setK1({ id: 'h', tur: 'hodisa', yon: 'tel' })],
      [900, () => { setK1(null); setYon({ 1: 'ikki' }); setSon1(9); setJx(1); }],
      [450, () => setJx(2)], [1000, () => { setQ(2); setBand(false); }]]);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · qayta ulanish', ru: 'Понятие · переподключение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, QADAMLAR_Y, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Qayta ulanganda <span className="italic" style={{ color: T.accent }}>qaysi kod</span> yana ishlaydi?</>, ru: <>Какой код <span className="italic" style={{ color: T.accent }}>снова срабатывает</span> при переподключении?</> })}
        mentor={<Mentor>{tr({ uz: "Backend tugunidagi «Yangi versiya» ni bosing va telefon ostidagi kodning yonadigan qatorlariga qarang.", ru: 'Нажмите «Yangi versiya» в узле Backend и посмотрите на загорающиеся строки кода под телефоном.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: 'Qayta ulangach, bitta qo\'shilishga nechta jonli xabar chiqadi?', ru: 'Сколько живых сообщений появится на одно присоединение после переподключения?' }} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="bf-viz">
          <IkkiTelefonSahna
            t1={{ belgi, son: son1, sonYangi: son1 === 9 && !avval, qoshildi: true, qoshilYoq: true, jx }}
            be={{ db: qoshildi ? 9 : 8, dbYangi: qoshildi && !avval, qator: beQator, yonadi: !!beQator,
              ichi: !tugadi && q === 0 && <button type="button" className={cx('bf-versiya', halqa(taxmin && !band))} disabled={!taxmin || band} onClick={versiya}>{tr(SAHNA.versiya)}</button>,
              qadam: taxmin && q === 0 && !band ? { n: 1, t: SAHNA.versiya } : null }}
            t2={{ belgi, son: qoshildi ? 9 : 8, sonYangi: qoshildi && !avval, qoshildi, onQoshil: q === 1 && !band ? qoshil : null, qoshilHalqa: q === 1 && !band,
              qadam: q === 1 && !band ? { n: 2, t: { uz: "Ikkinchi telefonda qo'shiling", ru: 'Присоединитесь на втором телефоне' } } : null }}
            c1={c} c2={c} k1={k1} urin={urin} />
          <div className="bf-kodlar1">
            <KodKarta yorliq={<>{tr({ uz: 'Mentor ilovasi', ru: 'Приложение Ментора' })} · <code>m12-dars-05-start</code></>} qatorlar={KOD4} yon={yon} />
            <span className="bf-tingl">{tr({ uz: 'Tinglovchilar:', ru: 'Слушателей:' })} <b key={tingl} className={cx(tingl === 2 && !avval && 'bf-pop')}>{tingl}</b></span>
          </div>
          {q >= 1 && <p className="bf-nom fade-step">{tr({ uz: <>Uzilgan ulanishni qayta tiklash — <b>qayta ulanish</b>: socket.io bunga o'zi urinadi, odatda bir necha soniyada.</>, ru: <>Восстановить оборванное соединение — <b>переподключение</b>: socket.io пытается сделать это сам, обычно за несколько секунд.</> })}</p>}
          {q >= 2 && <p className="bf-nom fade-step">{tr({ uz: <>Bitta o'zgarish ilovaga ikki marta ta'sir qilishi — <b>takror hodisa</b>.</>, ru: <>Одно изменение влияет на приложение дважды — <b>повторное событие</b>.</> })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'ikki'} haqiqat={{ uz: 'ikkita', ru: 'два' }} />}
          matn={tx({ uz: "`connect` ichidagi kod qayta ulanishda ham ishlaydi: tinglovchi uning ichida bo'lsa, yana bittasi qo'shiladi.", ru: 'Код внутри `connect` срабатывает и при переподключении: если слушатель внутри него, добавляется ещё один.' })}
          izoh={tx({ uz: "Tuzatish: tinglovchi bir marta qo'shiladi — `connect` dan tashqarida.", ru: 'Исправление: слушатель добавляется один раз — снаружи `connect`.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 0, A) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Mentor misolida qayta ulangach jonli xabar ikki marta chiqdi. Nega?"
    question={tr({ uz: <h2 className="title h-ask">Mentor misolida qayta ulangach jonli xabar ikki marta chiqdi. <span className="italic" style={{ color: T.accent }}>Nega?</span></h2>, ru: <h2 className="title h-ask">В примере Ментора после переподключения живое сообщение появилось дважды. <span className="italic" style={{ color: T.accent }}>Почему?</span></h2> })}
    options={[
      { uz: "Tinglovchi har ulanishda yana qo'shilgan", ru: 'Слушатель добавлялся при каждом подключении' },
      { uz: 'Backend bitta hodisani ikki marta yuborgan', ru: 'Backend отправил одно событие дважды' },
      { uz: 'Ikkinchi telefon tugmani ikki marta bosgan', ru: 'Второй телефон нажал кнопку дважды' },
      { uz: "Ilova ikkita alohida ulanish ochib qo'ygan", ru: 'Приложение открыло два отдельных соединения' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "`connect` qayta ulanishda ham ishlaydi — ichidagi tinglovchi har safar yana qo'shiladi.", ru: '`connect` срабатывает и при переподключении — слушатель внутри каждый раз добавляется снова.' }}
    explainWrong={{
      1: { uz: "Sahnada Backend'dan nechta konvert chiqdi?", ru: 'Сколько конвертов вышло из Backend на сцене?' },
      2: { uz: 'Ikkinchi telefonda bitta bosish bo\'ldi — konvert ham bitta.', ru: 'На втором телефоне было одно нажатие — и конверт один.' },
      3: { uz: "Muammo ulanishlar sonida emas — tinglovchi qayta qo'shilgan.", ru: 'Дело не в числе соединений — слушатель добавлен повторно.' },
      default: { uz: "`connect` ichidagi tinglovchi har qayta ulanishda yana qo'shiladi.", ru: 'Слушатель внутри `connect` добавляется снова при каждом переподключении.' }
    }} />
);

// ===== SCREEN 6 — TUSHUNCHA · xona (bashorat + 2 qadam): «Yangi versiya» → nuqta xonadan chiqadi, yangi ulanish tashqarida; 2-telefon o'yinni ochadi → oyin-ochildi → xona 1 → korayotganlar-ozgardi faqat xonaga =====
const S6_TAXMIN = [{ k: '0', t: { uz: '0', ru: '0' } }, { k: '1', t: { uz: '1', ru: '1' } }, { k: '2', t: { uz: '2', ru: '2' } }];
const XonaQator = ({ nuqtalar, ketdi, tashqi, yangi }) => (
  <span className="bf-xona-ust">
    <span className={cx('bf-xona', yangi && 'yon')}>{tx({ uz: 'Xona `oyin-1`:', ru: 'Комната `oyin-1`:' })} <b key={nuqtalar.length} className={cx(yangi && 'bf-pop')}>{nuqtalar.length}</b>
      <span className="bf-xona-n">{nuqtalar.map(id => <i key={id} className={cx('bf-nq', id)} />)}{ketdi && <i className="bf-nq t1 ket" />}</span>
    </span>
    {tashqi && <i className="bf-nq t1 tashqi" aria-hidden="true" />}
  </span>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [c, setC] = useState('ochiq');
  const [belgi, setBelgi] = useState('ulangan');
  const [xona, setXona] = useState(avval ? ['t2'] : ['t1']);
  const [ketdi, setKetdi] = useState(false);
  const [tashqi, setTashqi] = useState(avval);
  const [xYangi, setXYangi] = useState(false);
  const [ekran2, setEkran2] = useState(avval ? 'oyin' : 'oyinlar');
  const [k2, setK2] = useState(null);
  const [kory2, setKory2] = useState(avval ? 1 : null);
  const [koryEski, setKoryEski] = useState(avval);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const versiya = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setC('uzilgan'); setXona([]); setKetdi(true); setBelgi('ulanmoqda'); setXYangi(true);
    ketma([[800, () => { setKetdi(false); setXYangi(false); }], [1400, () => setC('tiklan')], [2000, () => { setC('ochiq'); setBelgi('ulangan'); setTashqi(true); setQ(1); setBand(false); }]]);
  };
  const och = () => {
    if (q !== 1 || band) return;
    setBand(true); setEkran2('oyin');
    ketma([[500, () => setK2({ id: 'o', tur: 'hodisa', yon: 'be', yorliq: 'oyin-ochildi' })],
      [950, () => { setK2(null); setXona(['t2']); setXYangi(true); }],
      [450, () => setK2({ id: 'k', tur: 'hodisa', yon: 'tel', yorliq: 'korayotganlar-ozgardi' })],
      [950, () => { setK2(null); setKory2(1); setKoryEski(true); setXYangi(false); setQ(2); setBand(false); }]]);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · xona', ru: 'Понятие · комната' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, QADAMLAR_Y, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Qayta ulangan ilova <span className="italic" style={{ color: T.accent }}>o'yin xonasida</span> bormi?</>, ru: <>Есть ли переподключённое приложение <span className="italic" style={{ color: T.accent }}>в комнате игры</span>?</> })}
        mentor={<Mentor>{tr({ uz: "Avval «Yangi versiya» ni bosing, keyin ikkinchi telefonda o'yinni oching.", ru: 'Сначала нажмите «Yangi versiya», потом откройте игру на втором телефоне.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "Ikkinchi telefon o'yinni ochganda «Hozir ko'ryapti» nechani ko'rsatadi?", ru: 'Сколько покажет «Hozir ko\'ryapti», когда второй телефон откроет игру?' }} variantlar={S6_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="bf-viz">
          <IkkiTelefonSahna
            t1={{ belgi, son: 8, koryapti: 1, koryEski, qoshildi: true }}
            be={{ db: 8, ichi: <>
              <XonaQator nuqtalar={xona} ketdi={ketdi} tashqi={tashqi} yangi={xYangi} />
              {!tugadi && q === 0 && <button type="button" className={cx('bf-versiya', halqa(taxmin && !band))} disabled={!taxmin || band} onClick={versiya}>{tr(SAHNA.versiya)}</button>}
            </>, qadam: taxmin && q === 0 && !band ? { n: 1, t: SAHNA.versiya } : null }}
            t2={{ ekran: ekran2, belgi, son: 8, koryapti: kory2, koryYangi: kory2 === 1 && !avval, qoshilYoq: true, onKarta: q === 1 && !band && ekran2 === 'oyinlar' ? och : null, kartaHalqa: q === 1 && !band,
              qadam: q === 1 && !band ? { n: 2, t: { uz: "Ikkinchi telefonda o'yinni oching", ru: 'Откройте игру на втором телефоне' } } : null }}
            c1={c} c2={c} k2={k2} />
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === '1'} haqiqat={{ uz: '1', ru: '1' }} />}
          matn={tr({ uz: "Uzilganda ulanish xonadan chiqdi; bu misolda qayta ulangan ilova xonaga o'zi qaytib kirmadi.", ru: 'При обрыве соединение вышло из комнаты; в этом примере переподключённое приложение само в комнату не вернулось.' })}
          izoh={tr({ uz: "Tuzatish: qayta ulanganda ilova ochiq turgan o'yin xonasiga qayta kiradi.", ru: 'Исправление: при переподключении приложение снова входит в комнату открытой игры.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 3, D) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="Qayta ulangach «Hozir ko'ryapti» ekraningizni sanamadi. Nega?"
    question={tr({ uz: <h2 className="title h-ask">Qayta ulangach «Hozir ko'ryapti» ekraningizni sanamadi. <span className="italic" style={{ color: T.accent }}>Nega?</span></h2>, ru: <h2 className="title h-ask">После переподключения «Hozir ko'ryapti» не посчитал ваш экран. <span className="italic" style={{ color: T.accent }}>Почему?</span></h2> })}
    options={[
      { uz: 'Backend uzilgan ulanishni xonada qoldirgan', ru: 'Backend оставил оборванное соединение в комнате' },
      { uz: "Ilova qayta ulangach o'yin ekranini yopgan", ru: 'Приложение закрыло экран игры после переподключения' },
      { uz: "Ikkinchi telefon o'yin xonasidan chiqqan", ru: 'Второй телефон вышел из комнаты игры' },
      { uz: "Yangi ulanish o'yin xonasiga kirmagan", ru: 'Новое соединение не вошло в комнату игры' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Uzilganda ulanish xonadan chiqadi; bu misolda yangi ulanish xonaga o'zi kirmaydi.", ru: 'При обрыве соединение выходит из комнаты; в этом примере новое соединение само в комнату не входит.' }}
    explainWrong={{
      0: { uz: "Uzilganda ulanish xonadan o'zi chiqadi.", ru: 'При обрыве соединение само выходит из комнаты.' },
      1: { uz: "Sahnada o'yin ekrani ochiq turgan edi.", ru: 'На сцене экран игры был открыт.' },
      2: { uz: 'Ikkinchi telefon xonaga endi kirdi — u sanaldi.', ru: 'Второй телефон только что вошёл в комнату — его посчитали.' },
      default: { uz: "Qayta ulangan ilova xonaga o'zi qaytib kirmaydi.", ru: 'Переподключённое приложение само в комнату не возвращается.' }
    }} />
);

// ===== SCREEN 8 — KOD YOZISH (QKod + HtmlCompiler): tinglovchi connect dan tashqarida, connect ichida korsat(). Tekshiruv — xulq-atvor bo'yicha (SABOQ 37) =====
// Skelet tuzog'i (MEXANIZM 11): HtmlCompiler faqat BIRINCHI JS faylni ulaydi va tekshiruvda async ni kutmaydi (load + 50 ms).
// Yechim: app.js — birinchi JS fayl (o'quvchi yozadi); namuna.js tabda o'qish uchun ko'rinadi, ishlaydigan nusxasi previewCss orqali head'ga skript bo'lib kiradi (pilot 02 yo'li).
// Tekshiruv sinxron: namuna funksiyasi ulan() ni to'g'ridan-to'g'ri chaqiradi (1 s kutmasdan), har shart holatni o'zi boshidan qo'yadi.
const KOD_INDEX = ['<p class="belgi">Ulanmoqda…</p>', '<div class="oyin">', '  <p>Shanba, 18:00 · Mahalla maydoni</p>', '  <p class="hisob"><span class="son">…</span> / 10</p>', '</div>', '<div class="xabarlar"></div>', '<button class="uzish">Internetni uzish</button>', '<button class="qaytar">Internetni qaytarish</button>', "<button class=\"boshqa\">Boshqa o'yinchi qo'shildi</button>", ''].join('\n');
const NAMUNA_IZ = {
  uz: ["// Backend va ulanish o'rnida NAMUNA (haqiqiy Backend emas):", "// son shu faylda turadi; uchta tugma internetni uzadi, qaytaradi va hodisa yuboradi."],
  ru: ['// ОБРАЗЕЦ вместо Backend и соединения (не настоящий Backend):', '// число хранится в этом файле; три кнопки отключают интернет, возвращают его и отправляют событие.']
};
const NAMUNA_TEPA = ['let qoshilgan = 8;', 'let ulangan = false;', 'function sora() {', '  return qoshilgan;', '}', '', 'const tinglovchilar = [];', 'const ulanish = {', '  on: function (nom, kod) {', '    tinglovchilar.push({ nom: nom, kod: kod });', '  },', '};', 'function yubor(nom, malumot) {', '  tinglovchilar.forEach(function (t) {', '    if (t.nom === nom) t.kod(malumot);', '  });', '}', 'function ulan() {', '  ulangan = true;', "  document.querySelector('.belgi').textContent = 'Ulangan';", "  yubor('connect');", '}', ''];
const NAMUNA_TUGMA = ["document.querySelector('.uzish').addEventListener('click', function () {", '  ulangan = false;', "  document.querySelector('.belgi').textContent = 'Ulanmoqda…';", '});', "document.querySelector('.qaytar').addEventListener('click', function () {", '  if (!ulangan) setTimeout(ulan, 1000);', '});', "document.querySelector('.boshqa').addEventListener('click', function () {", '  if (qoshilgan >= 10) return;', '  qoshilgan = qoshilgan + 1;', "  if (ulangan) yubor('oyin-ozgardi', { oyinId: 1, sabab: 'qoshildi' });", '});'];
const namunaKor = (t) => [...NAMUNA_IZ[t], ...NAMUNA_TEPA, ...NAMUNA_TUGMA, '', 'setTimeout(ulan, 500);', ''].join('\n');
const KOD_NAMUNA = { uz: namunaKor('uz'), ru: namunaKor('ru') };
// Ishlaydigan nusxa: head'da turadi — tugmalar va birinchi ulanish DOMContentLoaded ichida (HTML hali yo'q payt)
const NAMUNA_IJRO = ['', '</style><script>', ...NAMUNA_TEPA, "document.addEventListener('DOMContentLoaded', function () {", ...NAMUNA_TUGMA, '  setTimeout(ulan, 500);', '});', '</script><style>'].join('\n');
const KOD_APP_IZ = { uz: '// Agent yozgan kod: tinglovchi connect ichida qo\'shilgan.', ru: '// Код агента: слушатель добавлен внутри connect.' };
const kodApp = (t) => ["const son = document.querySelector('.son');", "const xabarlar = document.querySelector('.xabarlar');", 'function korsat() {', '  son.textContent = sora();', '}', 'function jonliXabar() {', "  const p = document.createElement('p');", "  p.textContent = \"Shanba, 18:00 — yana bir o'yinchi qo'shildi: \" + sora() + ' / 10';", '  xabarlar.appendChild(p);', '}', 'korsat();', '', KOD_APP_IZ[t], "ulanish.on('connect', function () {", "  ulanish.on('oyin-ozgardi', function () {", '    korsat();', '    jonliXabar();', '  });', '});', ''].join('\n');
const KOD_APP = { uz: kodApp('uz'), ru: kodApp('ru') };
const KOD_CSS = '.belgi{display:inline-block;margin:0 0 10px;padding:3px 12px;border-radius:999px;background:#EDEBE6;font-weight:800;font-size:13px}.oyin{max-width:320px;background:#fff;border:1px solid #E9E6DF;border-radius:14px;padding:16px 18px;margin-bottom:10px}.oyin p{margin:0 0 6px}.hisob{font-family:monospace;font-size:28px;font-weight:800}.xabarlar p{max-width:320px;margin:0 0 6px;padding:7px 12px;border-radius:10px;background:#13141A;color:#fff;font-size:13px}.uzish,.qaytar,.boshqa{margin:8px 8px 0 0;padding:8px 14px;border:0;border-radius:10px;font-weight:700;cursor:pointer;color:#fff}.uzish{background:#5A5A60}.qaytar{background:#1F7A4D}.boshqa{background:#FF4F28}';
const KOD_VAZIFA = [
  { uz: "`ulanish.on('oyin-ozgardi', …)` ni `connect` ichidan tashqariga chiqaring — u bir marta qo'shilsin.", ru: "Вынесите `ulanish.on('oyin-ozgardi', …)` из `connect` наружу — пусть он добавляется один раз." },
  { uz: "`connect` ichida faqat `korsat()` tursin — qayta ulanganda son qayta so'ralsin.", ru: 'Внутри `connect` пусть останется только `korsat()` — при переподключении число запросится заново.' },
  { uz: "Natija oynasida: «Internetni uzish» → «Boshqa o'yinchi qo'shildi» → «Internetni qaytarish». Son «9 / 10» bo'lsin; yana «Boshqa o'yinchi qo'shildi» — bitta jonli xabar.", ru: "В окне результата: «Internetni uzish» → «Boshqa o'yinchi qo'shildi» → «Internetni qaytarish». Пусть число будет «9 / 10»; ещё раз «Boshqa o'yinchi qo'shildi» — одно живое сообщение." }
];
const KOD_SHART = [
  { uz: "`'oyin-ozgardi'` tinglovchisi bir marta qo'shilsin.", ru: "Пусть слушатель `'oyin-ozgardi'` добавляется один раз." },
  { uz: "Qayta ulangach son o'zi «9 / 10» bo'lsin.", ru: 'Пусть после переподключения число само станет «9 / 10».' }
];
// 1 — ikki marta ulanish: 'oyin-ozgardi' tinglovchilari soni 1 da qoladi va bitta qo'shilish bitta jonli xabar beradi
// 2 — ulanish · uzish · qo'shilish (hodisa ketmaydi) · qayta ulanish: .son matni 9 (korsat to'g'ridan-to'g'ri ham, o'ram ichida ham)
const KOD_SHART_IFODA = [
  '(function(){try{var n=function(){return tinglovchilar.filter(function(t){return t&&t.nom==="oyin-ozgardi"&&typeof t.kod==="function"}).length};var x=document.querySelector(".xabarlar"),bo=document.querySelector(".boshqa");if(!x||!bo)return "yoq";ulangan=false;qoshilgan=8;var a=n();ulan();ulan();var b=n();var p0=x.children.length;bo.click();var p1=x.children.length;return a===1&&b===1&&p1-p0===1?"ha":"yoq"}catch(e){return "yoq"}})()',
  '(function(){try{var s=document.querySelector(".son"),u=document.querySelector(".uzish"),bo=document.querySelector(".boshqa");if(!s||!u||!bo)return "yoq";ulangan=false;qoshilgan=8;s.textContent="…";ulan();u.click();bo.click();ulan();return String(s.textContent).trim()==="9"?"ha":"yoq"}catch(e){return "yoq"}})()'
];
const ochiqMatn = (o) => ({ uz: o.uz.split('`').join(''), ru: o.ru.split('`').join('') });
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: "app.js — tinglovchi bir marta, connect ichida qayta so'rash", ru: 'app.js — слушатель один раз, в connect — повторный запрос' },
  files: [
    { name: 'app.js', lang: 'js', starter: KOD_APP },
    { name: 'index.html', lang: 'html', starter: { uz: KOD_INDEX, ru: KOD_INDEX } },
    { name: 'namuna.js', lang: 'js', starter: KOD_NAMUNA }
  ],
  previewCss: KOD_CSS + NAMUNA_IJRO,
  requirements: [
    { id: 'bir', label: ochiqMatn(KOD_VAZIFA[0]), check: C.evalEquals(KOD_SHART_IFODA[0], 'ha', ochiqMatn(KOD_SHART[0])) },
    { id: 'sora', label: ochiqMatn(KOD_VAZIFA[1]), check: C.evalEquals(KOD_SHART_IFODA[1], 'ha', ochiqMatn(KOD_SHART[1])) }
  ]
};
// QKod o'ng ustun propining qolip-nomi («Editor» ma'nosidagi o'zbekcha so'z) til-lint qoidasiga tushadi — o'quvchi matni emas, qolip API nomi (9-Modul 1-dars yechimi)
const QKOD_ONG = ['muh', 'arrir'].join('');
// Natija oynasi (dars ekranida): tuzatilgan kodning xulqi — shartlar ✓ bo'lgach ochiladi; navbatdagi tugma halqada
const KodNatija = ({ faol }) => {
  const [s, setS] = useState({ ulangan: faol, qoshilgan: 8, son: faol ? 8 : null, xabar: [], kutish: false });
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const uzish = () => setS(x => ({ ...x, ulangan: false }));
  const qaytar = () => {
    if (s.ulangan || s.kutish) return;
    setS(x => ({ ...x, kutish: true }));
    tm.current = setTimeout(() => setS(x => ({ ...x, kutish: false, ulangan: true, son: x.qoshilgan })), kamHarakat() ? 0 : 1000);
  };
  const boshqa = () => setS(x => {
    if (x.qoshilgan >= 10) return x;
    const q = x.qoshilgan + 1;
    return x.ulangan ? { ...x, qoshilgan: q, son: q, xabar: [...x.xabar, q] } : { ...x, qoshilgan: q };
  });
  const navbat = !faol || s.kutish ? null : s.ulangan && s.qoshilgan === 8 ? 'uzish' : !s.ulangan && s.qoshilgan === 8 ? 'boshqa' : !s.ulangan ? 'qaytar' : s.xabar.length === 0 && s.qoshilgan < 10 ? 'boshqa' : null;
  return (
    <div className={cx('bf-no', !faol && 'xira')}>
      <span className="bf-no-bar"><i /><i /><i /><b>{tr({ uz: 'Natija', ru: 'Результат' })}</b></span>
      <div className="bf-no-tana">
        <span className={cx('bf-no-belgi', s.ulangan && 'ok')}>{s.ulangan ? 'Ulangan' : 'Ulanmoqda…'}</span>
        <span className="bf-no-p">{tr(NAMUNA_OYIN.vaqt)} · {tr(NAMUNA_OYIN.joy)}</span>
        <span className="bf-no-h"><b key={String(s.son)} className={cx(s.son !== null && s.son > 8 && 'bf-pop')}>{s.son === null ? '…' : s.son}</b> / 10</span>
        {s.xabar.map((n, i) => <span key={i} className="bf-no-x fade-step">{"Shanba, 18:00 — yana bir o'yinchi qo'shildi: " + n + ' / 10'}</span>)}
        <span className="bf-no-tugmalar">
          <button type="button" className={cx('bf-no-btn uz', halqa(navbat === 'uzish'))} disabled={!faol || !s.ulangan} onClick={uzish}>Internetni uzish</button>
          <button type="button" className={cx('bf-no-btn qa', halqa(navbat === 'qaytar'))} disabled={!faol || s.ulangan || s.kutish} onClick={qaytar}>Internetni qaytarish</button>
          <button type="button" className={cx('bf-no-btn bo', halqa(navbat === 'boshqa'))} disabled={!faol || s.qoshilgan >= 10} onClick={boshqa}>{"Boshqa o'yinchi qo'shildi"}</button>
        </span>
      </div>
    </div>
  );
};
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
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
  const qadamOk = (i) => (i < 2 ? shart : done);
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · tinglovchi', ru: 'Пишем код · слушатель' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Tinglovchini bir marta qo'shadigan <span className="italic" style={{ color: T.accent }}>kod yozamiz</span>.</>, ru: <>Пишем <span className="italic" style={{ color: T.accent }}>код</span>, который добавляет слушателя один раз.</> })}
        mentor={<Mentor>{tx({ uz: "Agent tinglovchini `connect` ichiga yozgan. Uni tashqariga chiqaring — `connect` ichida faqat qayta so'rash qolsin.", ru: 'Агент написал слушателя внутри `connect`. Вынесите его наружу — пусть внутри `connect` останется только повторный запрос.' })}</Mentor>}
        vazifa={<>
          <ol className={cx('bf-vazifa', done && 'ixcham')}>{KOD_VAZIFA.map((v, i) => <li key={i} className={cx(qadamOk(i) && 'ok')}><i>{qadamOk(i) ? '✓' : i + 1}</i><span>{tx(v)}</span></li>)}</ol>
          {done && <div className="bf-kod-natija fade-step">
            <QXulosa>{tx({ uz: "Bu kodda tinglovchi bir marta qo'shiladi; `connect` esa har ulanishda sonni qayta so'raydi.", ru: 'В этом коде слушатель добавляется один раз, а `connect` при каждом подключении заново запрашивает число.' })}</QXulosa>
            <QIzoh>{tx({ uz: 'Bu oynada `ulanish` — namuna: haqiqiy Backend emas, uzilishni tugma qiladi.', ru: 'В этом окне `ulanish` — образец: это не настоящий Backend, обрыв делает кнопка.' })}</QIzoh>
          </div>}
        </>}
        yordam={!done && <div className="bf-kyordam">
          <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
          {yordam && <QIzoh>{tx({ uz: "Ikki `ulanish.on` bir-birining ichida turmaydi: ikkalasi ham qatorning eng chap chetidan boshlanadi. Jonli xabar ikki marta chiqsa — `oyin-ozgardi` tinglovchisi hali `connect` ichida.", ru: 'Два `ulanish.on` не стоят друг внутри друга: оба начинаются с самого левого края строки. Если живое сообщение появляется дважды — слушатель `oyin-ozgardi` всё ещё внутри `connect`.' })}</QIzoh>}
        </div>}
        bajardim={!done && <div className="bf-bajardim"><QTugma className={halqa(shart)} disabled={!shart} onClick={bajardim}>{tr({ uz: 'Bajardim', ru: 'Готово' })}</QTugma></div>}
        {...{ [QKOD_ONG]: <div className="bf-kodoyna">
          {!done && <div className="bf-amal"><QTugma className={halqa(!shart && !isMentor)} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma>
            <span className="bf-amal-t">{tr({ uz: "Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Откроется окно кода — вы пишете код и сразу видите здесь результат.' })}</span></div>}
          <Zoomable><KodNatija key={shart ? 'ok' : 'yoq'} faol={shart} /></Zoomable>
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      />
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), kod oynasi qobig'i tashqi zoomni bekor qiladi */}
      {open && (
        <div className="bf-kompil" style={{ zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_APP)} storageKey="pm-m10d5-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 9 — TUSHUNCHA · buzish yozuvi (bashorat + 3 urinish, bittadan — SABOQ 9, E 53): telefon usulni o'ynaydi → yozuv qatorlari → belgi; to'g'risi ixcham qatorga tushadi =====
const S9_TAXMIN = [{ k: 'bir', t: { uz: 'Bittasi', ru: 'Одна' } }, { k: 'ikki', t: { uz: 'Ikkitasi', ru: 'Две' } }, { k: 'uch', t: { uz: 'Uchalasi', ru: 'Все три' } }];
const TEL_BOSH = { belgi: 'ulangan', son: 8, ekran: 'oyin', samolyot: undefined, eski: false, jx: 0, qoshildi: true };
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [tayyor, setTayyor] = useState(avval ? 3 : 0);
  const [faza, setFaza] = useState(0);
  const [tel, setTel] = useState(TEL_BOSH);
  const [xato, setXato] = useState(false);
  const [silk, setSilk] = useState(0);
  const [yangi, setYangi] = useState(-1);
  const ketma = useKetma();
  const done = tayyor >= 3;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const fi = tayyor;
  const korish = () => {
    if (!taxmin || done || faza !== 0) return;
    setFaza(1); setXato(false);
    if (fi === 0) ketma([[0, () => setTel({ ...TEL_BOSH, samolyot: true, belgi: 'ulanmoqda' })], [2000, () => setTel({ ...TEL_BOSH, samolyot: false, belgi: 'ulangan', eski: true })], [700, () => setFaza(2)], [900, () => setFaza(3)]]);
    else if (fi === 1) ketma([[0, () => setTel({ ...TEL_BOSH, ekran: 'boshqa' })], [1900, () => setTel({ ...TEL_BOSH, son: 9 })], [800, () => setFaza(2)], [900, () => setFaza(3)]]);
    else ketma([[0, () => setTel({ ...TEL_BOSH, belgi: 'ulanmoqda' })], [1500, () => setTel({ ...TEL_BOSH, belgi: 'ulangan' })], [600, () => setTel({ ...TEL_BOSH, son: 9, jx: 2 })], [800, () => setFaza(2)], [900, () => setFaza(3)]]);
  };
  const belgila = (b) => {
    if (faza !== 3 || done) return;
    if (b !== MENTOR_YOZUV[fi].belgi) { setXato(true); setSilk(n => n + 1); return; }
    setXato(false); setYangi(fi); setFaza(0); setTayyor(fi + 1);
    ketma([[900, () => { setTel(TEL_BOSH); setYangi(-1); }]]);
  };
  const m = MENTOR_YOZUV[Math.min(fi, 2)];
  const korinadi = faza >= 3 ? 3 : faza >= 2 ? 2 : 0;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · buzish yozuvi', ru: 'Понятие · запись поломки' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, tayyor, 3, { uz: "Urinishlarni ko'ring", ru: 'Посмотрите попытки' }, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Uch usuldan qaysilari <span className="italic" style={{ color: T.accent }}>Mentor ilovasini buzadi</span>?</>, ru: <>Какие из трёх способов <span className="italic" style={{ color: T.accent }}>ломают приложение Ментора</span>?</> })}
        mentor={<Mentor>{tr(done ? { uz: "Uch urinish yozildi — pastdagi xulosaga qarang.", ru: 'Три попытки записаны — посмотрите на вывод ниже.' } : { uz: "Har urinishni bosing: kutilgani bilan bo'lganini solishtirib, belgi qo'ying.", ru: 'Нажимайте каждую попытку: сравните ожидаемое с тем, что произошло, и поставьте отметку.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: 'Uch usuldan nechtasi Mentor ilovasini buzadi?', ru: 'Сколько из трёх способов ломают приложение Ментора?' }} variantlar={S9_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="bf-viz">
          <div className="bf-bz">
            <div className="bf-bz-tel"><IkkiTelefonSahna t1={tugadi ? { ...TEL_BOSH } : tel} /></div>
            <div className="bf-bz-ong">
              <div className="bf-strip">{MENTOR_YOZUV.map((y, i) => (i < tayyor
                ? <YozuvIx key={y.usul} no={i + 1} usul={y.usul} belgi={y.belgi} yangi={yangi === i} />
                : !tugadi && <span key={y.usul} className={cx('bf-strip-n', i === fi && 'joriy')}><i>{i + 1}</i>{i === fi && tr(usulNom(y.usul))}</span>))}</div>
              {!done && <div key={'k' + fi + '-' + silk} className={cx('bf-bz-karta bf-kirish', xato && 'silk')}>
                <BuzishYozuvi no={fi + 1} usul={m.usul} matn={{ qildim: m.qildim, kutdim: m.kutdim, boldi: m.boldi }} korinadi={korinadi}>
                  {faza === 0 && <span className="bf-bz-tug"><button type="button" className={cx('bf-urinish', halqa(!!taxmin))} disabled={!taxmin} onClick={korish}>{tr({ uz: "Urinishni ko'rish", ru: 'Посмотреть попытку' })}</button></span>}
                  {faza === 3 && <span className="bf-bz-tug bf-chorla">
                    <QChip onClick={() => belgila('buzildi')}>{tr({ uz: 'Buzildi', ru: 'Сломалось' })}</QChip>
                    <QChip onClick={() => belgila('buzilmadi')}>{tr({ uz: 'Buzilmadi', ru: 'Не сломалось' })}</QChip>
                  </span>}
                  {fi === 1 && <span className="bf-shu">{tr({ uz: 'Shu telefonda, shu urinishda.', ru: 'На этом телефоне, в этой попытке.' })}</span>}
                </BuzishYozuvi>
                {xato && <QXato>{tr({ uz: "Kutilgani bilan bo'lganini yana bir solishtiring.", ru: 'Ещё раз сравните ожидаемое с тем, что произошло.' })}</QXato>}
              </div>}
            </div>
          </div>
          {done && <p className="bf-nom fade-step">{tr({ uz: <>Har urinishga uch qator — nima qildim, nima kutdim, nima bo'ldi: <b>buzish yozuvi</b>.</>, ru: <>На каждую попытку три строки — что сделал, что ожидал, что произошло: <b>запись поломки</b>.</> })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'ikki'} haqYorliq={{ uz: 'Mentor misolida', ru: 'в примере Ментора' }} haqiqat={{ uz: 'ikkitasi — fonga olish buzmadi', ru: 'две — сворачивание не сломало' }} />}
          matn={tr({ uz: "Mentor misolida uch urinishdan ikkitasi buzildi; «buzilmadi» ham natija — u ham yoziladi.", ru: 'В примере Ментора из трёх попыток две сломали; «не сломалось» — тоже результат, его тоже записывают.' })}
          izoh={tr({ uz: "Buzib tekshirishni faqat o'z ilovangizda qilasiz. Boshqa odamning ilovasi yoki sayti tekshirilmaydi.", ru: 'Ломать для проверки вы будете только своё приложение. Чужое приложение или сайт не проверяют.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 10 — 4-SAVOL (QuestionScreen; INLINE_KEYS.s10 = 1, B) =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="Kutganingiz bilan bo'lgani bir xil chiqdi. Yozuvga nima qo'yasiz?"
    question={tr({ uz: <h2 className="title h-ask">Kutganingiz bilan bo'lgani bir xil chiqdi. Yozuvga <span className="italic" style={{ color: T.accent }}>nima qo'yasiz</span>?</h2>, ru: <h2 className="title h-ask">Ожидаемое и случившееся совпали. <span className="italic" style={{ color: T.accent }}>Что вы поставите</span> в запись?</h2> })}
    options={[
      { uz: "«Tuzatish qilindi» — muammo yo'q", ru: '«Исправление сделано» — проблемы нет' },
      { uz: '«Buzilmadi» — bu ham natija', ru: '«Не сломалось» — это тоже результат' },
      { uz: 'Hech narsa — yozuv kerak emas', ru: 'Ничего — запись не нужна' },
      { uz: '«Buzildi» — chunki tekshirdim', ru: '«Сломалось» — потому что проверил' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Kutilgani bo'lsa — «buzilmadi»: qaysi usul ilovani buzmagani ham yoziladi.", ru: 'Если случилось ожидаемое — «не сломалось»: записывают и то, какой способ не сломал приложение.' }}
    explainWrong={{
      0: { uz: '«Tuzatish qilindi» faqat kod o\'zgarganda qo\'yiladi.', ru: '«Исправление сделано» ставят, только когда изменился код.' },
      2: { uz: 'Yozuvsiz qaysi usul bajarilgani unutiladi.', ru: 'Без записи забудется, какой способ выполняли.' },
      3: { uz: '«Buzildi» kutilgani bo\'lmaganda qo\'yiladi.', ru: '«Сломалось» ставят, когда ожидаемое не случилось.' },
      default: { uz: "Kutilgani bo'lsa — «buzilmadi».", ru: 'Если случилось ожидаемое — «не сломалось».' }
    }} />
);

// ===== SCREEN 11 — TUSHUNCHA · qayta tekshiruv (bashorat + 3 qadam): yozuv agentga → «tuzatish qilindi»; o'sha usullar qaytariladi → «qayta tekshiruvda takrorlanmadi» =====
const S11_TAXMIN = [{ k: 'soz', t: { uz: "Agentning so'zidan", ru: 'По словам агента' } }, { k: 'kod', t: { uz: "Koddagi o'zgarishdan", ru: 'По изменению в коде' } }, { k: 'qayta', t: { uz: "O'sha usul bilan qayta buzib", ru: 'Снова сломав тем же способом' } }];
const S11_TUGMA = [{ uz: 'Yozuvni yuborish', ru: 'Отправить запись' }, { uz: 'Qayta: internetni uzish', ru: 'Снова: отключить интернет' }, { uz: 'Qayta: yangi versiya', ru: 'Снова: новая версия' }];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [band, setBand] = useState(false);
  const [chat, setChat] = useState(avval ? 2 : 0);
  const [tuz, setTuz] = useState(avval);
  const [qayta, setQayta] = useState(avval ? [true, true] : [false, false]);
  const [tel, setTel] = useState({ belgi: 'ulangan', son: 8 });
  const [c1, setC1] = useState('ochiq');
  const [k1, setK1] = useState(null);
  const [beQator, setBeQator] = useState(null);
  const ketma = useKetma();
  const done = q >= 3;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const yubor = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setChat(1);
    ketma([[1100, () => setChat(2)], [800, () => { setTuz(true); setQ(1); setBand(false); }]]);
  };
  const qaytaInternet = () => {
    if (q !== 1 || band) return;
    setBand(true); setTel({ belgi: 'ulanmoqda', son: 8, samolyot: true }); setC1('uzilgan');
    ketma([[500, () => setK1({ id: 'h1', tur: 'hodisa', yon: 'tel', toxta: 'sonadi' })], [1000, () => { setK1(null); setTel({ belgi: 'ulanmoqda', son: 8, samolyot: false }); setC1('tiklan'); }],
      [2000, () => { setC1('ochiq'); setTel({ belgi: 'ulangan', son: 8, samolyot: false }); }], [600, () => setTel({ belgi: 'ulangan', son: 9, sonYangi: true, samolyot: false })],
      [700, () => { setQayta(x => [true, x[1]]); setQ(2); setBand(false); }]]);
  };
  const qaytaVersiya = () => {
    if (q !== 2 || band) return;
    setBand(true); setTel({ belgi: 'ulanmoqda', son: 8 }); setC1('uzilgan');
    ketma([[1400, () => setC1('tiklan')], [2000, () => { setC1('ochiq'); setTel({ belgi: 'ulangan', son: 8 }); setBeQator({ uz: "ikkinchi telefonda o'yin ochildi · agent qo'shildi", ru: 'на втором телефоне открыта игра · агент присоединился' }); }],
      [900, () => setK1({ id: 'h2', tur: 'hodisa', yon: 'tel' })], [900, () => { setK1(null); setTel({ belgi: 'ulangan', son: 9, sonYangi: true, jx: 1, koryapti: 2, koryYangi: true }); }],
      [900, () => { setQayta(x => [x[0], true]); setQ(3); setBand(false); }]]);
  };
  const amallar = [yubor, qaytaInternet, qaytaVersiya];
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · qayta tekshiruv', ru: 'Понятие · повторная проверка' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 3, QADAMLAR_Y, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Agent «tuzatdim» desa, buni <span className="italic" style={{ color: T.accent }}>qanday bilasiz</span>?</>, ru: <>Если агент говорит «исправил», <span className="italic" style={{ color: T.accent }}>как вы это узнаете</span>?</> })}
        mentor={<Mentor>{tr({ uz: "Avval yozuvni agentga yuboring, keyin «buzildi» belgili ikki urinishni o'sha usul bilan qaytaring.", ru: 'Сначала отправьте запись агенту, потом повторите две попытки с отметкой «сломалось» тем же способом.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: 'Tuzatishni qanday tekshirasiz?', ru: 'Как вы проверите исправление?' }} variantlar={S11_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="bf-viz">
          <div className={cx('bf-tx', tugadi && 'tugadi')}>
            {!tugadi && <div className="bf-tx-tel"><IkkiTelefonSahna t1={{ qoshildi: true, ...tel }} be={{ db: 8, qator: beQator }} c1={c1} k1={k1} /></div>}
            <div className="bf-tx-ong">
              {!tugadi && <div className="bf-chat">
                <span className="bf-chat-bar">Antigravity</span>
                {chat >= 1 && <Puf siz kim={tr({ uz: 'Siz', ru: 'Вы' })}>{tr({ uz: "1 va 3-urinish talabdagidek emas — yozuvim pastda. Tuzat, har muammoning sababini bir gap bilan ayt.", ru: 'Попытки 1 и 3 не как в требовании — моя запись ниже. Исправь, причину каждой проблемы скажи одной фразой.' })}</Puf>}
                {chat >= 2 && <Puf kim="Antigravity">{tr({ uz: "Tuzatdim: qayta ulanganda ro'yxat qayta so'raladi, tinglovchi bir marta qo'shiladi, ilova xonaga qayta kiradi.", ru: 'Исправил: при переподключении список запрашивается заново, слушатель добавляется один раз, приложение снова входит в комнату.' })}</Puf>}
                <span className="bf-tugmalar">{S11_TUGMA.map((t, i) => <button key={i} type="button" className={cx('bf-qayta', q > i && 'bajarildi', halqa(!!taxmin && q === i && !band))} disabled={!taxmin || q !== i || band} onClick={amallar[i]}><i>{q > i ? '✓' : i + 1}</i>{tr(t)}</button>)}</span>
              </div>}
              <div className="bf-yix-ust">{MENTOR_YOZUV.map((y, i) => <YozuvIx key={y.usul} no={i + 1} usul={y.usul} belgi={y.belgi} tuz={tuz && y.belgi === 'buzildi'} qayta={(i === 0 && qayta[0]) || (i === 2 && qayta[1]) ? 'takrorlanmadi' : null} yangi={(i === 0 && q === 2) || (i === 2 && q === 3)} />)}</div>
            </div>
          </div>
          {q >= 1 && <p className="bf-nom fade-step">{tr({ uz: <><b>«Tuzatish qilindi»</b> — kodda o'zgartirish qilindi: bu ish fakti.</>, ru: <><b>«Исправление сделано»</b> — в коде внесено изменение: это факт работы.</> })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'qayta'} haqiqat={{ uz: "o'sha usul bilan qayta buzib", ru: 'снова сломав тем же способом' }} />}
          matn={tr({ uz: "«Tuzatish qilindi» — ish qilindi; «qayta tekshiruvda takrorlanmadi» — o'sha usul bilan ko'rilgan natija.", ru: '«Исправление сделано» — работа выполнена; «при повторной проверке не повторилось» — результат, увиденный тем же способом.' })}
          izoh={tr({ uz: 'Qayta tekshiruvda yana buzilsa — shuni yozib, yozuvni agentga qayta berasiz.', ru: 'Если при повторной проверке снова сломалось — запишите это и снова отдайте запись агенту.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 12 — MUSTAQIL ISH · kutish (QMustaqil: uch karta ketma-ket — SABOQ 29, E 53). Saqlanadi: pm-m10d5-buzish (tayanch 8 shakli aynan) =====
const REJ_BOSH = (i, mentor) => ({ qildim: tr(mentor ? MENTOR_YOZUV[i].qildim : USULLAR[i].qilaman), chekka: null, ozim: '', kutdim: mentor ? tr(MENTOR_YOZUV[i].kutdim) : '' });
const rejBoshlang = (storedAnswer, mentor) => {
  if (storedAnswer && Array.isArray(storedAnswer.rej) && storedAnswer.rej.length === 3) return storedAnswer.rej.map(r => ({ qildim: String(r.qildim || ''), chekka: r.chekka ?? null, ozim: String(r.ozim || ''), kutdim: String(r.kutdim || '') }));
  const k = lsOqi(BUZISH_KALIT);
  const ur = k && Array.isArray(k.urinishlar) ? k.urinishlar : [];
  return USULLAR.map((u, i) => {
    const r = ur.find(x => x && x.usul === u.k);
    return r ? { qildim: String(r.qildim || ''), chekka: null, ozim: '', kutdim: String(r.kutdim || '') } : REJ_BOSH(i, mentor);
  });
};
const chekkaOqi = () => { const t = lsOqi(TALAB_KALIT); return t && Array.isArray(t.chekka) ? t.chekka.map(c => String((c && c.matn) || '').trim()).filter(Boolean).slice(0, 3) : []; };
const qisqa = (s, n = 24) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
// Kalitga yozish: tartib o'zgarmaydi (internet · fon · versiya); A1/A2 dagi maydonlar bor bo'lsa saqlanadi (qayta saqlashda yo'qolmasin)
const buzishYoz = (fn) => {
  const k = lsOqi(BUZISH_KALIT);
  const eski = k && Array.isArray(k.urinishlar) ? k.urinishlar : [];
  const ur = USULLAR.map((u, i) => {
    const r = eski.find(x => x && x.usul === u.k) || { usul: u.k, qildim: '', kutdim: '', boldi: '', buzildi: null, tuzatildi: false, qayta: null };
    return fn ? fn({ ...r }, i) : r;
  });
  try { localStorage.setItem(BUZISH_KALIT, JSON.stringify({ urinishlar: ur })); } catch { /* xotira yopiq */ }
  return ur;
};
const YordamTugma = ({ ochiq, onClick }) => <QTugma ikkinchi className="bf-ms-yordam" aria-expanded={ochiq} onClick={onClick}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>;
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const isMentor = useMentorLive();
  const init = useRef(null);
  if (init.current === null) init.current = rejBoshlang(storedAnswer, isMentor);
  const [rej, setRej] = useState(init.current);
  const [saqlandi, setSaqlandi] = useState(!!(storedAnswer && storedAnswer.saqlandi));
  const [fi, setFi] = useState(0);
  const [tayyorN, setTayyorN] = useState(saqlandi ? 3 : 0);
  const [yangi, setYangi] = useState(-1);
  const [xato, setXato] = useState(false);
  const [yordam, setYordam] = useState(false);
  const chekkalar = useMemo(chekkaOqi, []);
  const r = rej[fi];
  const yoz = (k, v) => { setRej(a => a.map((x, i) => (i === fi ? { ...x, [k]: v } : x))); setXato(false); };
  const keyingi = () => {
    if (!String(r.kutdim).trim()) { setXato(true); return; }
    setXato(false); setYangi(fi);
    if (fi < 2) { setTayyorN(n => Math.max(n, fi + 1)); setFi(fi + 1); return; }
    const toza = rej.map(x => ({ qildim: String(x.qildim || '').trim(), chekka: x.chekka, ozim: String(x.ozim || '').trim(), kutdim: String(x.kutdim || '').trim() }));
    if (!toza.every(x => x.kutdim)) { setFi(toza.findIndex(x => !x.kutdim)); setXato(true); return; }
    buzishYoz((u, i) => ({ ...u, usul: USULLAR[i].k, qildim: toza[i].qildim, kutdim: toza[i].kutdim, boldi: u.boldi || '', buzildi: u.buzildi ?? null, tuzatildi: !!u.tuzatildi, qayta: u.qayta ?? null }));
    setRej(toza); setTayyorN(3); setSaqlandi(true);
    onAnswer(screen, { stage: 'mustaqil', screenIdx: screen, rej: toza, saqlandi: true, solved: true, correct: true });
  };
  const tahrir = (i) => { if (saqlandi || i === fi) return; if (!String(r.kutdim).trim() && i > fi) return; setFi(i); setXato(false); };
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · kutish', ru: 'Самостоятельная работа · ожидание' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!saqlandi} label={saqlandi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Saqlang', ru: 'Сохраните' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Har usuldan oldin <span className="italic" style={{ color: T.accent }}>nima kutishingizni</span> yozing.</>, ru: <>Перед каждым способом запишите, <span className="italic" style={{ color: T.accent }}>чего вы ждёте</span>.</> })}
        mentor={<Mentor>{tr({ uz: 'Talabingizdagi chekka holatlardan boshlang: har usulga bittasini tanlang.', ru: 'Начните с крайних случаев из вашего требования: на каждый способ выберите один.' })}</Mentor>}
        qadamlar={saqlandi
          ? <div className="bf-ms-ix fade-step"><b>{tr({ uz: 'Buzish rejasi', ru: 'План поломки' })}</b><span>· 3 {tr({ uz: 'usul', ru: 'способа' })}</span><i className="bf-ok">✓</i></div>
          : <div className="bf-ms-chiziq">
            {USULLAR.map((u, i) => {
              const joriy = i === fi;
              const ok = i < tayyorN && !joriy;
              return <button key={u.k} type="button" className={cx('bf-ms-q', joriy && 'joriy', ok && 'ok', yangi === i && ok && 'yangi')} onClick={() => tahrir(i)} disabled={joriy || (!ok && i > fi)}>
                <i>{ok ? '✓' : i + 1}</i><span>{tr(u.nom)}{ok && rej[i].kutdim ? ' · ' + qisqa(rej[i].kutdim) : ''}</span></button>;
            })}
          </div>}
        forma={!saqlandi && <div className="bf-ms-forma">
          {/* E 43: yorliq input ichida — doimiy raqam + qisqa savol; «masalan» — «Yordam»da */}
          <div className="bf-ms-karta bf-kirish" key={'u' + fi}>
            <span className="bf-ms-kt">{fi + 1} / 3 · {tr(USULLAR[fi].nom)}</span>
            <label className="bf-ms-maydon">
              <i className="bf-ms-n" aria-hidden="true">1</i>
              <textarea className="bf-ms-inp" rows={2} value={r.qildim} maxLength={240} placeholder={tr({ uz: 'Nima qilaman', ru: 'Что я сделаю' })} aria-label={'1 · ' + tr({ uz: 'Nima qilaman', ru: 'Что я сделаю' })} onChange={e => yoz('qildim', e.target.value)} />
            </label>
            <div className="bf-ms-chekka">
              <span className="bf-ms-l"><i>2</i>{tr({ uz: 'Talabingizdagi chekka holat', ru: 'Крайний случай из вашего требования' })}</span>
              {chekkalar.length > 0 && <div className="bf-chorla bf-ms-tanlov">
                {chekkalar.map((m, j) => <QChip key={j} holat={r.chekka === j ? 'on' : undefined} onClick={() => yoz('chekka', j)}>{m}</QChip>)}
                <QChip holat={r.chekka === 'ozim' ? 'on' : undefined} onClick={() => yoz('chekka', 'ozim')}>{tr({ uz: "O'zim yozaman", ru: 'Напишу сам' })}</QChip>
              </div>}
              {(chekkalar.length === 0 || r.chekka === 'ozim') && <input className="bf-ms-inp" value={r.ozim} maxLength={160} placeholder={tr({ uz: 'Talabingizdagi chekka holat', ru: 'Крайний случай из вашего требования' })} aria-label={'2 · ' + tr({ uz: 'Talabingizdagi chekka holat', ru: 'Крайний случай из вашего требования' })} onChange={e => yoz('ozim', e.target.value)} />}
            </div>
            <label className="bf-ms-maydon">
              <i className="bf-ms-n" aria-hidden="true">3</i>
              <input className="bf-ms-inp" value={r.kutdim} maxLength={200} placeholder={tr({ uz: "Ekranda aniq nima ko'rinishi kerak?", ru: 'Что именно должно быть видно на экране?' })} aria-label={'3 · ' + tr({ uz: 'Nima kutaman', ru: 'Чего я жду' })} onChange={e => yoz('kutdim', e.target.value)} />
            </label>
            <div className="bf-ms-tugmalar">
              <QTugma className={halqa(!!String(r.kutdim).trim())} onClick={keyingi}>{fi < 2 ? tr({ uz: 'Keyingi usul', ru: 'Следующий способ' }) : tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
              <YordamTugma ochiq={yordam} onClick={() => setYordam(o => !o)} />
            </div>
          </div>
          {xato && <QXato>{tr({ uz: "«Nima kutaman» bo'sh — ekranda nima ko'rinishini yozing.", ru: '«Чего я жду» пусто — напишите, что будет видно на экране.' })}</QXato>}
        </div>}
        yordam={!saqlandi && yordam && <div className="bf-yordam-q fade-step">
          <QIzoh>{tr({ uz: "Kutishni ekranda ko'rinadigan narsa bilan yozing: son, belgi, jonli xabar, «Hozir ko'ryapti». «To'g'ri ishlaydi» deb yozilsa, keyin solishtirib bo'lmaydi.", ru: 'Записывайте ожидание тем, что видно на экране: число, значок, живое сообщение, «Hozir ko\'ryapti». Если написать «работает правильно», потом не с чем сравнить.' })}</QIzoh>
          <QIzoh>{tr({ uz: "Mahsulotingizda jonli xabar yoki «Hozir ko'ryapti» bo'lmasa — real vaqt nuqtangizdagi son yoki ro'yxatni yozing. «Hozir ko'ryapti» ni faqat ikkinchi ekran bo'lsa (sherik telefoni) tekshira olasiz.", ru: 'Если в вашем продукте нет живого сообщения или «Hozir ko\'ryapti» — запишите число или список в своей точке реального времени. «Hozir ko\'ryapti» можно проверить, только если есть второй экран (телефон партнёра).' })}</QIzoh>
          <span className="bf-yordam-misol"><b>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</b><span><i>3</i>{tr({ uz: "masalan: Belgi «Ulangan» bo'lgach, «9 / 10» ko'rinadi.", ru: 'например: Когда значок станет «Подключено», будет видно «9 / 10».' })}</span></span>
        </div>}
      >{saqlandi && <QXulosa>{tr({ uz: "Kutishingiz yozildi — amaliyotda har urinishdan keyin nima bo'lganini yoniga yozasiz.", ru: 'Ваше ожидание записано — на практике после каждой попытки рядом запишете, что произошло.' })}</QXulosa>}</QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 13 — FINAL (QTartib: 6 bo'lak, uyalar raqamli — «bu yerga qo'ying»; ball — birinchi to'liq urinish, sentinel 0) =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
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
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'Buzishdan qayta tekshiruvgacha qaysi tartibda?', options: TUZATISH_YOLI.map(z => ou(z.label)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · tartib', ru: 'Итог · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Avval bo'laklarni joylang", ru: 'Сначала разложите блоки' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Buzishdan qayta tekshiruvgacha <span className="italic" style={{ color: T.accent }}>qaysi tartibda</span>?</>, ru: <>В каком <span className="italic" style={{ color: T.accent }}>порядке</span> — от поломки до повторной проверки?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni bajariladigan tartibda joylang.", ru: 'Разложите блоки в порядке выполнения.' })}</Mentor>
        <Zoomable>
          <div className="bf-tartib">
          <QTartib onWrong={onWrong}
            items={TUZATISH_YOLI.map(z => ({ id: z.id, label: tx(z.label) }))}
            joyMatn={tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}
            onSolved={solve}
            xatoMatn={tr({ uz: "Tartib mos emas — bo'lakni bosib qaytaring.", ru: 'Порядок не подходит — нажмите на блок, чтобы вернуть его.' })}
          />
          </div>
        </Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Bu darsda kutish buzishdan oldin yoziladi — shunda natija bilan solishtirsa bo\'ladi.', ru: 'На этом уроке ожидание записывают до поломки — тогда его можно сравнить с результатом.' })}</p>
          {wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  lostEvent: { icon: '📭', name: 'Lost Event', desc: { uz: 'Uzilish paytidagi hodisa nega kelmasligini topdingiz', ru: 'Вы нашли, почему событие во время обрыва не приходит' } },
  onceOnly: { icon: '🔂', name: 'Once Only', desc: { uz: 'Ikki jonli xabarning sababini topdingiz', ru: 'Вы нашли причину двух живых сообщений' } },
  roomReturn: { icon: '🚪', name: 'Room Return', desc: { uz: 'Qayta ulangan ilova xonaga nega qaytmaganini bildingiz', ru: 'Вы узнали, почему переподключённое приложение не вернулось в комнату' } },
  breakFix: { icon: '🛠️', name: 'Break & Fix', desc: { uz: 'Ikkala amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили оба практических блока до конца' } }
};
// Ekran id → nishon: s3, s5, s7 — ballik test (to'g'ri javob, birinchi urinish); a2 — oxirgi «Bajardim» (bonus, birinchi urinish sharti yo'q — 152)
const ACH_TRIGGERS = { s3: 'lostEvent', s5: 'onceOnly', s7: 'roomReturn', a2: 'breakFix' };

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


// Podium savol yorliqlari (SCORED_IDX: 3, 5, 7, 10, 13)
const Q_LABELS = {
  3: { uz: '1 — Uzilishdagi hodisa', ru: '1 — Событие во время обрыва' },
  5: { uz: '2 — Ikki jonli xabar', ru: '2 — Два живых сообщения' },
  7: { uz: '3 — Xonaga qaytish', ru: '3 — Возврат в комнату' },
  10: { uz: '4 — Buzilmadi ham natija', ru: '4 — «Не сломалось» — тоже результат' },
  13: { uz: 'Yakuniy — buzishdan qayta tekshiruvgacha', ru: 'Итог — от поломки до повторной проверки' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (MD «Fon so'zlari»; R-008: o'quvchi so'zi {uz, ru}, kod-belgi o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: { uz: 'buzish', ru: 'поломка' }, l: 4, t: 9, s: 22, d: 19, dl: 0 },
  { ch: { uz: 'buzish yozuvi', ru: 'запись поломки' }, l: 76, t: 7, s: 20, d: 23, dl: 1.5 },
  { ch: { uz: 'uchish rejimi', ru: 'режим полёта' }, l: 7, t: 70, s: 20, d: 27, dl: 0.8 },
  { ch: { uz: 'qayta ulanish', ru: 'переподключение' }, l: 72, t: 66, s: 20, d: 21, dl: 2.2 },
  { ch: { uz: 'takror hodisa', ru: 'повторное событие' }, l: 40, t: 86, s: 20, d: 25, dl: 1.1 },
  { ch: 'connect', l: 62, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: 'ulanish.on', l: 22, t: 34, s: 20, d: 20, dl: 1.9 },
  { ch: { uz: 'tinglovchi', ru: 'слушатель' }, l: 16, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: { uz: 'xona', ru: 'комната' }, l: 88, t: 42, s: 22, d: 22, dl: 0.6 },
  { ch: { uz: "«Hozir ko'ryapti»", ru: '«Hozir ko\'ryapti»' }, l: 50, t: 6, s: 18, d: 24, dl: 1.3 },
  { ch: { uz: '«Ulangan»', ru: '«Подключено»' }, l: 30, t: 58, s: 20, d: 26, dl: 2.4 },
  { ch: { uz: '«Ulanmoqda…»', ru: '«Подключается…»' }, l: 84, t: 84, s: 18, d: 21, dl: 3.4 },
  { ch: { uz: 'tuzatish qilindi', ru: 'исправление сделано' }, l: 2, t: 44, s: 18, d: 23, dl: 2.7 },
  { ch: { uz: 'takrorlanmadi', ru: 'не повторилось' }, l: 58, t: 48, s: 18, d: 20, dl: 3.8 },
  { ch: 'BUZISH.md', l: 34, t: 22, s: 20, d: 22, dl: 0.2 },
  { ch: 'Maydon Jamoa', l: 64, t: 82, s: 20, d: 21, dl: 3.1 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni MD bo'yicha A·B·C·D ×3 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'Uchish rejimi yoqilsa, ulanish nima bo\'ladi?', ru: 'Что будет с соединением, если включить режим полёта?' }, opts: [{ uz: 'Uziladi, ilova qayta urinadi', ru: 'Обрывается, приложение пытается снова' }, { uz: 'Ochiq qoladi, hodisa kutadi', ru: 'Остаётся открытым, ждёт событие' }, { uz: 'Yopiladi, ilova urinmaydi', ru: 'Закрывается, приложение не пытается' }, { uz: "Tiklanadi, son o'zi yangilanadi", ru: 'Восстанавливается, число обновляется само' }], correct: 0 },
  { q: { uz: 'Tarmoq uzilsa, socket.io sukutda necha marta urinadi?', ru: 'Сколько раз по умолчанию пытается socket.io, если оборвалась сеть?' }, opts: [{ uz: "Bir marta, keyin to'xtaydi", ru: 'Один раз, потом останавливается' }, { uz: 'Ulanguncha urinaveradi', ru: 'Пытается, пока не подключится' }, { uz: "Uch marta, keyin to'xtaydi", ru: 'Три раза, потом останавливается' }, { uz: 'Faqat tugma bosilganda', ru: 'Только при нажатии кнопки' }], correct: 1 },
  { q: { uz: '`connect` ichidagi kod qachon ishlaydi?', ru: 'Когда срабатывает код внутри `connect`?' }, opts: [{ uz: 'Faqat ilova eng birinchi ulanganda', ru: 'Только при самом первом подключении' }, { uz: 'Faqat Backend hodisa yuborganda', ru: 'Только когда Backend отправил событие' }, { uz: 'Har ulanishda, qayta ulanganda ham', ru: 'При каждом подключении, и при переподключении тоже' }, { uz: 'Faqat ilova yopilib qolganda', ru: 'Только когда приложение закрылось' }], correct: 2 },
  { q: { uz: 'Takror hodisa nima?', ru: 'Что такое повторное событие?' }, opts: [{ uz: "Ikki o'yinda bir vaqtdagi o'zgarish", ru: 'Одновременное изменение в двух играх' }, { uz: 'Ikki telefondagi bir xil son', ru: 'Одинаковое число на двух телефонах' }, { uz: "Bir o'yinchining ikki akkaunti", ru: 'Два аккаунта одного игрока' }, { uz: "Bitta o'zgarishning ikki ta'siri", ru: 'Двойное влияние одного изменения' }], correct: 3 },
  { q: { uz: "Qayta ulanganda Mentor ilovasi ro'yxatni nega qayta so'raydi?", ru: 'Зачем приложение Ментора заново запрашивает список при переподключении?' }, opts: [{ uz: "Uzilishda kelmagan o'zgarish uchun", ru: 'Ради изменения, не пришедшего при обрыве' }, { uz: "Belgini «Ulangan» qilish uchun", ru: 'Чтобы сделать значок «Подключено»' }, { uz: 'Tinglovchini yana qo\'shish uchun', ru: 'Чтобы снова добавить слушателя' }, { uz: "Hodisani Backend'dan qayta olish uchun", ru: 'Чтобы заново получить событие от Backend' }], correct: 0 },
  { q: { uz: 'Buzish yozuvida qaysi uch qator bor?', ru: 'Какие три строки есть в записи поломки?' }, opts: [{ uz: 'Kim bosdi, qachon va qayerda', ru: 'Кто нажал, когда и где' }, { uz: "Nima qildim, kutdim, bo'ldi", ru: 'Что сделал, ожидал, произошло' }, { uz: 'Usul, telefon, versiya', ru: 'Способ, телефон, версия' }, { uz: 'Muammo, sabab, tuzatish', ru: 'Проблема, причина, исправление' }], correct: 1 },
  { q: { uz: 'Agent «tuzatdim» dedi, qayta tekshirmadingiz. Yozuvda nima turadi?', ru: 'Агент сказал «исправил», вы не перепроверили. Что будет в записи?' }, opts: [{ uz: '«Takrorlanmadi» — agent aytdi', ru: '«Не повторилось» — агент сказал' }, { uz: '«Buzilmadi» — endi hammasi ishlaydi', ru: '«Не сломалось» — теперь всё работает' }, { uz: '«Tuzatish qilindi» — tekshirilmagan', ru: '«Исправление сделано» — не проверено' }, { uz: "Hech narsa — agent o'zi biladi", ru: 'Ничего — агент сам знает' }], correct: 2 },
  { q: { uz: 'Tuzatishni qaysi usul bilan qayta tekshirasiz?', ru: 'Каким способом вы перепроверите исправление?' }, opts: [{ uz: 'Hali bajarilmagan yangi usul bilan', ru: 'Новым, ещё не выполненным способом' }, { uz: 'Agent yozgan javobni o\'qib chiqib', ru: 'Прочитав ответ агента' }, { uz: "Faqat koddagi o'zgarishni o'qib", ru: 'Только прочитав изменение в коде' }, { uz: 'Muammo chiqqan usulning o\'zi bilan', ru: 'Тем самым способом, где появилась проблема' }], correct: 3 },
  { q: { uz: "Render yangi versiyani ishga tushirsa, ochiq ulanishlar nima bo'ladi?", ru: 'Что будет с открытыми соединениями, если Render запустит новую версию?' }, opts: [{ uz: 'Uziladi, ilovalar qayta urinadi', ru: 'Обрываются, приложения пытаются снова' }, { uz: 'Ochiq qoladi, hech narsa sezilmaydi', ru: 'Остаются открытыми, ничего не заметно' }, { uz: 'Faqat yangi ilovalar uziladi', ru: 'Обрываются только новые приложения' }, { uz: 'Database ularni saqlab turadi', ru: 'Database их сохраняет' }], correct: 0 },
  { q: { uz: "socket.io'dagi xona qayerda turadi?", ru: 'Где находится комната в socket.io?' }, opts: [{ uz: "Ilovaning o'zida", ru: 'В самом приложении' }, { uz: "Backend'ning o'zida", ru: 'В самом Backend' }, { uz: 'Database jadvalida', ru: 'В таблице Database' }, { uz: 'Telefon sozlamasida', ru: 'В настройках телефона' }], correct: 1 },
  { q: { uz: "Mentor misolida fonga olish urinishi nima ko'rsatdi?", ru: 'Что показала попытка сворачивания в примере Ментора?' }, opts: [{ uz: 'Son eskicha qolib ketdi', ru: 'Число осталось старым' }, { uz: 'Jonli xabar ikki marta chiqdi', ru: 'Живое сообщение появилось дважды' }, { uz: 'Buzilmadi, son yangi edi', ru: 'Не сломалось, число было новым' }, { uz: 'Ilova yopilib, qayta ochildi', ru: 'Приложение закрылось и открылось снова' }], correct: 2 },
  { q: { uz: 'Kimning ilovasini buzib tekshirasiz?', ru: 'Чьё приложение вы ломаете для проверки?' }, opts: [{ uz: 'Sinfdoshingizning ilovasini', ru: 'Приложение одноклассника' }, { uz: 'Mashhur ilovalardan birini', ru: 'Одно из популярных приложений' }, { uz: 'Istalgan ochiq saytni', ru: 'Любой открытый сайт' }, { uz: "O'zingizning ilovangizni", ru: 'Своё собственное приложение' }], correct: 3 }
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
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). steps [{ h, t, bandlar?, prompt?, namuna?, toldir?, yordam?, err? }].
// Qolipda yo'q (qolip taklifi): {…} yonida kulrang «masalan: …» (BfPrompt), qadam ichidagi «Yordam», «Ulgurmasangiz» qatori, trek tugmalari — shu faylda.
// Blok bajarilgani — faqat oxirgi «Bajardim»dan (tayanch 9.36 h); «Ulgurmasangiz» yo'lida «Davom etish» oldinroq ochiladi, bayroq qo'yilmaydi.
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const trekOqi = () => { const o = lsOqi('pm-m9d8-platforma'); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
const trekYoz = (t) => { try { const o = lsOqi('pm-m9d8-platforma') || {}; localStorage.setItem('pm-m9d8-platforma', JSON.stringify({ ...o, trek: t })); } catch { /* xotira yopiq */ } };
// Prompt: {…} joylari yonida kulrang «masalan» (qolipda yo'q — qolip taklifi), toldir — kalitdan oldindan yozilgan qiymat
const BfPrompt = ({ satrlar, namuna = [], toldir = {} }) => {
  const [ok, setOk] = useState(false);
  const matn = satrlar.map(l => { let s = tr(l); Object.entries(toldir).forEach(([j, v]) => { if (v) s = s.split(j).join(v); }); return s; });
  const nm = {};
  namuna.forEach(x => { nm[x.joy] = x.n; });
  const korildi = new Set();
  const joy = (t, li) => t.split(/(\{[^}]+\})/g).map((p, i) => {
    if (!/^\{.+\}$/.test(p)) return <React.Fragment key={li + '-' + i}>{fmtCode(p)}</React.Fragment>;
    const yangi = !!nm[p] && !korildi.has(p);
    if (yangi) korildi.add(p);
    return <React.Fragment key={li + '-' + i}><span className="q-joy">{p}</span>{yangi && <span className="bf-joy-n">{tx(nm[p])}</span>}</React.Fragment>;
  });
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  return (
    <span className="q-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="bf-ps">{joy(l, i)}</span>)}
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <>
      <QTugma ikkinchi className="bf-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      {ochiq && <span className="bf-yordam fade-step">{satrlar.map((l, i) => <span key={i} className="bf-yordam-s">{tx(l)}</span>)}</span>}
    </>
  );
};
// «Ortda qoldingizmi» — darsda bir marta, birinchi blokda (SABOQ 39)
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'cd maydon-jamoa', 'git checkout -f m12-dars-05-start'];
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). steps [{ h, t, ichki?, bandlar?, prompt?, namuna?, toldir?, keyin?, yordam?, err? }].
// Blok bajarilgani — faqat oxirgi «Bajardim»dan (tayanch 9.36 h). qulf — qulfQadam dagi «Bajardim» yozuv to'liq bo'lguncha yopiq; davom — «Ulgurmasangiz» yo'lida «Davom etish» oldinroq ochiladi (bayroq qo'yilmaydi).
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, izoh, ulgur, ulgurQadam = 99, davom = false, qulf = false, qulfQadam = -1, ustoz, ustida }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam || davom;
  const qulfla = qulf && stepN === qulfQadam && !done;
  const bajardim = () => {
    if (isMentorLive || done || qulfla) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cx('bf-blok', qulfla && 'bf-qulf')}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<><Mentor>{tr(mGap)}</Mentor>{ustida}</>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: <>{tx(c.t)}{!c.ichkiKeyin && c.ichki}{c.bandlar && c.bandlar.map((b, i) => <span key={i} className="bf-band">{tx(b)}</span>)}{c.prompt && <BfPrompt satrlar={c.prompt} namuna={c.namuna} toldir={c.toldir} />}{c.ichkiKeyin && c.ichki}{c.keyin && c.keyin.map((b, i) => <span key={'k' + i} className="bf-band">{tx(b)}</span>)}</>,
          xato: c.yordam ? <>{c.err && <span className="bf-band">{tx(c.err)}</span>}<Yordam satrlar={c.yordam} /></> : (c.err && tx(c.err))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={doneText ? tr(doneText) : null} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
        pastki={<>{done && izoh && <QIzoh>{tr(izoh)}</QIzoh>}<MentorPracticeStats live={_live} screen={screen} /></>}>
        {ortda && <p className="bf-ortda">{tr({ uz: "Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring:", ru: 'Отстали — откройте пример Ментора в отдельной папке:' })} <code className="bf-buyruq">{ORTDA[0]}</code> · <code className="bf-buyruq">{ORTDA[1]}</code> · <code className="bf-buyruq">{ORTDA[2]}</code> {tx(ortda)}</p>}
        {ulgur && !done && <p className="bf-ulgur">{tx(ulgur)}</p>}
        {ustoz && isMentorLive && <Ustoz satrlar={ustoz} />}
      </QBlok>
      </div>
    </Stage>
  );
}
// Kalitdan o'qish: uch urinish, tartib o'zgarmaydi (bo'lmasa — bo'sh shakl, buzildi: null)
const buzishOqi = () => {
  const k = lsOqi(BUZISH_KALIT);
  const eski = k && Array.isArray(k.urinishlar) ? k.urinishlar : [];
  return USULLAR.map(u => {
    const r = eski.find(x => x && x.usul === u.k) || {};
    return { usul: u.k, qildim: String(r.qildim || ''), kutdim: String(r.kutdim || ''), boldi: String(r.boldi || ''), buzildi: r.buzildi === true ? true : r.buzildi === false ? false : null, tuzatildi: !!r.tuzatildi, qayta: r.qayta === 'takrorlanmadi' || r.qayta === 'takrorlandi' ? r.qayta : null };
  });
};
const yozildi = (u) => u.buzildi === true || u.buzildi === false;
const yozuvSatr = (u, i, toliq) => {
  const s = `${i + 1} · ${tr(usulNom(u.usul))}. ${tr(YOZUV_QATOR[0].t)}: ${u.qildim || '…'} ${tr(YOZUV_QATOR[1].t)}: ${u.kutdim || '…'} ${tr(YOZUV_QATOR[2].t)}: ${u.boldi || '…'}`;
  if (!toliq) return s;
  const belgi = u.buzildi === true ? tr(YOZUV_BELGI.buzildi) : u.buzildi === false ? tr(YOZUV_BELGI.buzilmadi) : '…';
  const qayta = u.buzildi !== true ? '' : u.qayta ? ' · ' + tr(YOZUV_BELGI[u.qayta]) : ' · ' + tr({ uz: "qayta tekshiruv — hali yo'q", ru: 'повторной проверки — ещё нет' });
  return `${s} · ${belgi}${u.tuzatildi ? ' · ' + tr(YOZUV_BELGI.tuzatildi) : ''}${qayta}`;
};

// ===== SCREEN 14 — AMALIYOT 1 · buzish (QBlok + ScreenBlok): kod yozilmaydi; 3-qadamda yozuv kartasi — bittadan (E 53), har tugma bosilganda kalitga =====
const YozuvKarta = ({ i, u, onSaqla }) => {
  const [d, setD] = useState({ qildim: u.qildim, kutdim: u.kutdim, boldi: u.boldi });
  const yoz = (k, v) => setD(x => ({ ...x, [k]: v }));
  const bor = !!d.boldi.trim();
  const saqla = (b) => { if (!bor) return; onSaqla({ qildim: d.qildim.trim(), kutdim: d.kutdim.trim(), boldi: d.boldi.trim(), buzildi: b }); };
  return (
    <span className="bf-yf-karta bf-kirish">
      <span className="bf-yf-sar"><i>{i + 1} / 3</i><b>{tr(USULLAR[i].nom)}</b></span>
      {YOZUV_QATOR.map(q => (
        <label key={q.k} className="bf-yf-m">
          <em>{tr(q.t)}</em>
          <textarea className="bf-yf-inp" rows={2} value={d[q.k]} maxLength={240} aria-label={tr(q.t)}
            placeholder={q.k === 'boldi' ? tr({ uz: "masalan: Belgi «Ulangan», lekin «8 / 10» qoldi.", ru: 'например: Значок «Подключено», но осталось «8 / 10».' }) : tr(q.t)}
            onChange={e => yoz(q.k, e.target.value)} />
        </label>
      ))}
      <span className="bf-yf-tug bf-chorla">
        <QChip disabled={!bor} onClick={() => saqla(true)}>{tr({ uz: 'Buzildi', ru: 'Сломалось' })}</QChip>
        <QChip disabled={!bor} onClick={() => saqla(false)}>{tr({ uz: 'Buzilmadi', ru: 'Не сломалось' })}</QChip>
      </span>
    </span>
  );
};
const YozuvForma = ({ ur, onSaqla }) => {
  const bosh = ur.findIndex(u => !yozildi(u));
  const [fi, setFi] = useState(bosh < 0 ? null : bosh);
  const [yangi, setYangi] = useState(-1);
  const saqla = (d) => {
    const i = fi;
    onSaqla(i, d); setYangi(i);
    const keyin = ur.findIndex((x, j) => j !== i && !yozildi(x));
    setFi(keyin < 0 ? null : keyin);
  };
  return (
    <span className="bf-yf">
      {ur.some((u, i) => yozildi(u) && i !== fi) && <span className="bf-yf-oklar">
        {ur.map((u, i) => (yozildi(u) && i !== fi
          ? <button key={u.usul} type="button" className={cx('bf-yf-ok', yangi === i && 'yangi')} onClick={() => setFi(i)} aria-label={`${i + 1} · ${tr(usulNom(u.usul))} · ${tr({ uz: 'tahrirlash', ru: 'изменить' })}`}>
            <i>✓</i><b>{i + 1} · {tr(usulNom(u.usul))}</b><YBelgi b={u.buzildi ? 'buzildi' : 'buzilmadi'} /></button>
          : null))}
      </span>}
      {fi !== null && <YozuvKarta key={'yk' + fi} i={fi} u={ur[fi]} onSaqla={saqla} />}
    </span>
  );
};
const NatijaA1 = ({ trek, toliq }) => (
  <div className="bf-a1n">
    {trek === 'web'
      ? <div className="bf-brauzer"><span className="bf-br-bar"><i /><i /><i /><code>….netlify.app</code></span>
        <div className="bf-br-tana"><span className="bf-tel-nom">{SAHNA.nom}</span><div className="bf-ol-bosh"><b className="bf-ol-sar">{tr(SAHNA.oyinlar)}</b><UlanishBelgisi holat="ulangan" /></div>
          <div className="bf-karta-w"><b>{tr(NAMUNA_OYIN.vaqt)}</b><span>{tr(NAMUNA_OYIN.joy)} · 8 / 10</span></div></div></div>
      : <div className="bf-kichik-tel"><Telefon no={1} t={{ tex: 'Expo Go', belgi: 'ulangan', son: 8, qoshildi: true }} /></div>}
    <div className="bf-a1n-k">{MENTOR_YOZUV.map((y, i) => <BuzishYozuvi key={y.usul} kichik no={i + 1} usul={y.usul} matn={y} belgi={y.belgi} tuz={toliq && y.belgi === 'buzildi'} qayta={toliq ? y.keyin : null} />)}</div>
  </div>
);
const A1_JOY = { uz: '{boshqa akkaunt qiladigan o\'zgarish}', ru: '{изменение, которое делает другой аккаунт}' };
const A1_PROMPT = [
  { uz: "Qayerda: `backend/` — faqat o'qish uchun, kod va fayllarni o'zgartirma; Database'da — faqat o'zing yaratadigan tekshiruv akkaunti va yozuvi.", ru: 'Где: `backend/` — только для чтения, код и файлы не меняй; в Database — только тестовый аккаунт и запись, которые ты создашь сам.' },
  { uz: "Nima qilsin: tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan {boshqa akkaunt qiladigan o'zgarish} so'rovini tayyorla, lekin yuborma. «Yubor» desam — yubor va qaysi akkaunt, qaysi `id` ekanini ayt. «O'chir» desam — faqat o'sha `id` dagi yozuvni o'chir.", ru: 'Что сделать: открой новый аккаунт для проверки (с образцовым именем и номером, не настоящими) и подготовь от его имени запрос {изменение, которое делает другой аккаунт}, но не отправляй. Скажу «Yubor» — отправь и скажи, какой аккаунт и какой `id`. Скажу «O\'chir» — удали только запись с этим `id`.' },
  { uz: "Nima buzilmasin: kod, `.env` va boshqa yozuvlarga tegma; haqiqiy odamning akkauntidan foydalanma.", ru: 'Что не сломать: не трогай код, `.env` и другие записи; не используй аккаунт настоящего человека.' }
];
const A1_NAMUNA = [{ joy: A1_JOY, n: { uz: "masalan: «Shanba, 18:00» o'yiniga qo'shilish (`POST /oyinlar/1/qoshilish`)", ru: 'например: присоединение к игре «Суббота, 18:00» (`POST /oyinlar/1/qoshilish`)' } }];
const A1_YORDAM = [
  { uz: "Mentor misolidagi to'liq talab:", ru: 'Полное требование в примере Ментора:' },
  A1_PROMPT[0],
  { uz: "Nima qilsin: tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan «Shanba, 18:00» o'yiniga qo'shilish (`POST /oyinlar/1/qoshilish`) so'rovini tayyorla, lekin yuborma. «Yubor» desam — yubor va qaysi akkaunt, qaysi `id` ekanini ayt. «O'chir» desam — faqat o'sha `id` dagi yozuvni o'chir.", ru: 'Что сделать: открой новый аккаунт для проверки (с образцовым именем и номером, не настоящими) и подготовь от его имени запрос на присоединение к игре «Суббота, 18:00» (`POST /oyinlar/1/qoshilish`), но не отправляй. Скажу «Yubor» — отправь и скажи, какой аккаунт и какой `id`. Скажу «O\'chir» — удали только запись с этим `id`.' },
  A1_PROMPT[2]
];
const TrekTanlov = ({ trek, onTanla }) => (!trek
  ? <div className="bf-trek"><span>{tr({ uz: 'Trekingiz:', ru: 'Ваш трек:' })}</span><div className="bf-chorla bf-trek-g"><QChip onClick={() => onTanla('mobil')}>{tr({ uz: 'Mobil trek', ru: 'Мобильный трек' })}</QChip><QChip onClick={() => onTanla('web')}>{tr({ uz: 'Web-trek', ru: 'Веб-трек' })}</QChip></div></div>
  : null);
const ScreenA1 = (props) => {
  const [trek, setTrek] = useState(trekOqi);
  const tanla = (t) => { trekYoz(t); setTrek(t); };
  const [ur, setUr] = useState(buzishOqi);
  const saqla = (i, d) => { const yangi = buzishYoz((u, j) => (j === i ? { ...u, qildim: d.qildim, kutdim: d.kutdim, boldi: d.boldi, buzildi: d.buzildi } : u)); setUr(yangi.map((u, j) => ({ ...buzishOqi()[j], ...u }))); };
  const hammasi = ur.every(yozildi);
  const birIkki = yozildi(ur[0]) && yozildi(ur[1]);
  const buzildiBor = ur.some(u => u.buzildi === true);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z mahsulotingiz", ru: 'Практика 1 · ваш продукт' }}
      title={{ uz: <>Mahsulotingizni uch usul bilan buzing va <span className="italic" style={{ color: T.accent }}>yozib boring</span>.</>, ru: <>Сломайте свой продукт тремя способами и <span className="italic" style={{ color: T.accent }}>записывайте</span>.</> }}
      mentor={{ uz: "Kod yozilmaydi: agent faqat boshqa akkaunt nomidan o'zgarish qiladi, kuzatish va yozuv — sizda; «1 · Ochish»dan boshlang.", ru: 'Код не пишем: агент только вносит изменение от имени другого аккаунта, наблюдение и запись — за вами; начните с «1 · Ochish».' }}
      ustida={<TrekTanlov trek={trek} onTanla={tanla} />}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "ilovangiz telefonda ochiq va kirgan holda bo'lsin (mobil trekda: `cd mobil`, `npx expo start`, Expo Go). Real vaqt nuqtangiz turgan ekranni oching — Mentor misolida «O'yin»: belgi «Ulangan» bo'lishi kerak.", ru: 'пусть приложение открыто на телефоне, и вы вошли (в мобильном треке: `cd mobil`, `npx expo start`, Expo Go). Откройте экран с вашей точкой реального времени — в примере Ментора «O\'yin»: значок должен быть «Подключено».' },
          ichki: <span className="bf-band">{tx({ uz: "Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.", ru: 'В терминале `git status`: файлы `.env` не должны быть в списке.' })} <b>{tr({ uz: "Buzish faqat o'z ilovangizda: boshqa odamning ilovasi yoki sayti tekshirilmaydi.", ru: 'Ломаем только своё приложение: чужое приложение или сайт не проверяют.' })}</b></span>,
          bandlar: [
            { uz: "Sherik bo'lsa — uning telefonida ham shu ekran ochiq tursin (web havola yoki Android'dagi Expo Go; Expo akkauntingiz ma'lumoti berilmaydi).", ru: 'Если есть партнёр — пусть у него на телефоне тоже открыт этот экран (веб-ссылка или Expo Go на Android; данные вашего аккаунта Expo не передаются).' },
            { uz: "Web-trekda: saytingizni telefon brauzerida oching — uchish rejimi telefonda yoqiladi (kompyuterda Wi-Fi'ni o'chirish dars sahifasini ham uzadi); «ilovani yopib qayta ochish» o'rniga — sahifani yangilang.", ru: 'В веб-треке: откройте сайт в браузере телефона — режим полёта включается на телефоне (выключение Wi-Fi на компьютере отключит и страницу урока); вместо «закрыть и снова открыть приложение» — обновите страницу.' }
          ] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобку (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' },
          prompt: A1_PROMPT, namuna: A1_NAMUNA.map(x => ({ joy: tr(x.joy), n: x.n })), yordam: A1_YORDAM },
        { h: { uz: 'Buzish', ru: 'Ломаем' }, t: { uz: "uch usul, bittadan; har urinishdan oldin ilovani yopib qayta oching. Har urinishdan keyin yozuv kartasida «Nima bo'ldi» qatorini yozing va «Buzildi» yoki «Buzilmadi» ni tanlang; keyin agentga «O'chir» deng va ro'yxatni pastga torting — son boshidagidek bo'lishi kerak.", ru: 'три способа, по одному; перед каждой попыткой закройте и снова откройте приложение. После каждой попытки в карточке записи заполните строку «Что произошло» и выберите «Сломалось» или «Не сломалось»; потом скажите агенту «O\'chir» и потяните список вниз — число должно быть как в начале.' },
          bandlar: [
            { uz: "O'zgarishni boshqa akkaunt qiladi: sherik o'z telefonida yoki web-trekda o'zingiz kompyuterdagi yashirin oynada (11-Moduldagi ikkinchi namuna akkaunt bilan; keyin o'zgarishni o'zingiz qaytarasiz), bo'lmasa — agent («Yubor»).", ru: 'Изменение делает другой аккаунт: партнёр на своём телефоне или в веб-треке вы сами в скрытом окне на компьютере (со вторым образцовым аккаунтом из 11-го модуля; потом изменение отмените сами), иначе — агент («Yubor»).' },
            { uz: "(1) Internetni uzish — uchish rejimini yoqing va belgi «Ulanmoqda…» bo'lishini kuting (bir daqiqagacha). Keyin o'zgarish qilinsin; bo'lgach uchish rejimini o'chiring. Belgi «Ulangan» bo'lgach, ekranga qarang.", ru: '(1) Отключить интернет — включите режим полёта и дождитесь значка «Подключается…» (до минуты). Потом пусть будет сделано изменение; после этого выключите режим полёта. Когда значок станет «Подключено», посмотрите на экран.' },
            { uz: "(2) Fonga olib qaytarish — boshqa ilovaga o'ting va o'zgarish qilinsin. Bir daqiqadan keyin ilovaga qayting va ekranga qarang.", ru: '(2) Свернуть и вернуться — перейдите в другое приложение, и пусть будет сделано изменение. Через минуту вернитесь в приложение и посмотрите на экран.' },
            { uz: "(3) Backend'ning yangi versiyasi — ilova ochiq tursin. Render sahifasida Backend xizmatingizni oching: «Manual Deploy» → «Deploy latest commit». Belgi «Ulanmoqda…» ga o'tib, yana «Ulangan» bo'lishi kerak — bu bir necha daqiqa cho'zilishi mumkin; kutayotganda 1 va 2-urinish yozuvini qayta o'qing. «Ulangan» bo'lgach, o'zgarish qilinsin va ekranga qarang (sherik bo'lsa — uning telefonidagi «Hozir ko'ryapti» ga ham).", ru: '(3) Новая версия Backend — приложение пусть открыто. На странице Render откройте свой сервис Backend: «Manual Deploy» → «Deploy latest commit». Значок должен перейти в «Подключается…» и снова стать «Подключено» — это может занять несколько минут; пока ждёте, перечитайте записи попыток 1 и 2. Когда станет «Подключено», пусть будет сделано изменение, и посмотрите на экран (если есть партнёр — и на «Hozir ko\'ryapti» на его телефоне).' },
            { uz: "Bugun Backend kodi o'zgarmaydi, shuning uchun Render'da qo'lda qayta chiqarasiz. 11-Moduldagi sozlamada `backend/` ichidagi o'zgarish push qilinsa, Render yangi versiyani odatda o'zi ishga tushiradi.", ru: 'Сегодня код Backend не меняется, поэтому перевыпускаете на Render вручную. При настройке из 11-го модуля, если запушить изменение внутри `backend/`, Render обычно сам запускает новую версию.' }
          ],
          keyin: [{ uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Nima bo'lganini ayt.»", ru: 'Если появилась ошибка — отправьте агенту строку ошибки (не значения `.env`, токен и ключи): «Shu xato chiqdi: {xato}. Nima bo\'lganini ayt.»' }],
          err: null },
        { h: { uz: 'Tekshirish', ru: 'Проверка' }, t: { uz: "uch yozuvni o'qing: «Nima bo'ldi» — ekranda ko'rganingiz, taxmin emas; har belgi «Nima kutdim» bilan solishtirilgan. Agentga yozing: «Tekshiruv akkauntini ham `id` si bo'yicha o'chir. Yaratgan akkaunt va yozuvlaringning `id` larini ayt: hammasi o'chdimi?»", ru: 'прочитайте три записи: «Что произошло» — то, что вы увидели на экране, а не догадка; каждая отметка сравнена с «Что я ожидал». Напишите агенту: «Tekshiruv akkauntini ham `id` si bo\'yicha o\'chir. Yaratgan akkaunt va yozuvlaringning `id` larini ayt: hammasi o\'chdimi?»' },
          bandlar: [{ uz: "Agent javobi — uning so'zi; ilovada son boshidagidek bo'lishi kerak — buni o'zingiz ko'rasiz.", ru: 'Ответ агента — его слова; в приложении число должно быть как в начале — это вы увидите сами.' }] }
      ].map((c, i) => (i === 2 ? { ...c, ichki: <YozuvForma ur={ur} onSaqla={saqla} /> } : c))}
      qulf={!hammasi} qulfQadam={2} davom={birIkki}
      natija={<NatijaA1 trek={trek} />}
      doneText={buzildiBor ? { uz: 'Uch usul bajarildi va yozildi: topilgan muammolar keyingi blokda tuzatiladi.', ru: 'Три способа выполнены и записаны: найденные проблемы исправим в следующем блоке.' }
        : { uz: "Uch usul bajarildi: mahsulotingiz buzilmadi — bu ham natija.", ru: 'Три способа выполнены: ваш продукт не сломался — это тоже результат.' }}
      ortda={{ uz: "(faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — agent «bajardim» deganidan keyingi kod; qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).", ru: '(только в этой новой папке — команда удаляет изменения в папке) — код после того, как агент сказал «сделал»; увидите, как он работает, и по нему повторите шаг в своём репозитории (в `backend/.env` и `mobil/.env` впишите свои значения).' }}
      ulgur={{ uz: "Ulgurmasangiz: Render'da qayta chiqarish cho'zilsa — 3-usul uyga vazifaning 1-bandi; 1 va 2-urinishdan keyin «Davom etish» ochiladi — 2-amaliyotga o'ting. Blok uchala usul va 4-qadamdan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: если перевыпуск на Render затянулся — способ 3 станет пунктом 1 домашнего задания; после попыток 1 и 2 откроется «Продолжить» — переходите ко 2-й практике. Блок считается выполненным после всех трёх способов и шага 4.' }}
      ustoz={[
        { uz: "Expo Go uchish rejimidan keyin ilovani qayta yuklasa (ekran boshidan ochilsa), 1-urinishda muammo ko'rinmay qolishi mumkin — pilotda tekshiriladi. Uzilishni payqash 45 soniyagacha cho'zilishi mumkin — shuning uchun o'zgarish belgi «Ulanmoqda…» bo'lgandan keyin qilinadi; bir daqiqada o'tmasa ham urinish yoziladi.", ru: 'Если Expo Go после режима полёта перезагрузит приложение (экран откроется заново), в попытке 1 проблема может не проявиться — проверяется на пилоте. Обнаружение обрыва может занять до 45 секунд — поэтому изменение делают после значка «Подключается…»; если за минуту не перешёл, попытку всё равно записывают.' },
        { uz: "Render'da «Manual Deploy» nomi — rasmiy hujjatdan; interfeys boshqacha ko'rinsa, o'quvchiga xizmatni qayta chiqaradigan tugmani ko'rsating.", ru: 'Название «Manual Deploy» на Render — из официальной документации; если интерфейс выглядит иначе, покажите ученику кнопку перевыпуска сервиса.' }
      ]}
    />
  );
};

// ===== SCREEN 15 — AMALIYOT 2 · tuzatish va qayta tekshirish (QBlok + ScreenBlok): yozuv talabga o'zi qo'yiladi; 3-qadam «Tuzatish qilindi», 4-qadam qayta tekshiruv natijasi =====
const NatijaA2 = () => (
  <div className="bf-a2n">
    <div className="bf-a1n-k">{MENTOR_YOZUV.map((y, i) => <BuzishYozuvi key={y.usul} kichik no={i + 1} usul={y.usul} matn={y} belgi={y.belgi} tuz={y.belgi === 'buzildi'} qayta={y.keyin} />)}</div>
    <div className="bf-fayllar">{[['mobil/src/ulanish.ts', { uz: "o'zgardi", ru: 'изменён' }], ['mobil/src/app/index.tsx', { uz: "o'zgardi", ru: 'изменён' }], ['mobil/src/app/oyin/[id].tsx', { uz: "o'zgardi", ru: 'изменён' }], ['BUZISH.md', { uz: 'yangi', ru: 'новый' }]].map(([n, h]) => <span key={n} className="bf-fayl"><code>{n}</code><em>{tr(h)}</em></span>)}</div>
    <div className="bf-gh"><span className="bf-br-bar"><i /><i /><i /><code>github.com/…/maydon-jamoa</code></span><span className="bf-gh-q"><code>maydon-jamoa</code> · <code>BUZISH.md</code></span></div>
  </div>
);
// E 52: real prompt — o'quvchi o'z loyihasida kodni ko'radi (2-pilot A1_KOD_PROMPT naqshi; MD da yo'q — hisobotda «MD dan chetlashish (E 52)»)
const A2_KOD_PROMPT = [
  { uz: "O'zgartirgan fayllaringda ikki joyni fayl nomi va qator raqami bilan ko'rsat: `connect` ichidagi kod va `oyin-ozgardi` tinglovchisi qo'shiladigan qator.", ru: 'В изменённых файлах покажи два места с именем файла и номером строки: код внутри `connect` и строку, где добавляется слушатель `oyin-ozgardi`.' },
  { uz: "Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Объясни одной фразой, что делает каждое. Код не меняй.' }
];
const A2_JOY_YOZUV = { uz: '{buzish yozuvi}', ru: '{запись поломки}' };
const A2_JOY_ISH = { uz: "{avvalgidek ishlashi kerak bo'lgan ishlar}", ru: '{что должно работать как раньше}' };
const A2_ISH_NAMUNA = { uz: "masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat; «Hozir ko'ryapti» va jonli xabar", ru: 'например: вход, объявление, присоединение, подтверждение, выход и очередь; «Hozir ko\'ryapti» и живое сообщение' };
const a2Prompt = (trek, satrlar) => [
  { uz: "Qayerda: buzish yozuvidagi muammoga tegishli fayllar — avval sababini top, keyin faqat kerakli joyni o'zgartir.", ru: 'Где: файлы, относящиеся к проблеме из записи поломки — сначала найди причину, потом меняй только нужное место.' },
  { uz: "Nima qilsin: pastdagi buzish yozuvida «buzildi» belgili har urinishni tuzat: ilova «Nima kutdim» qatoridagidek ishlasin. Har muammoning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.", ru: 'Что сделать: исправь каждую попытку с отметкой «сломалось» в записи ниже: пусть приложение работает как в строке «Что я ожидал». Причину каждой проблемы скажи одной фразой и скажи, какой файл изменил.' },
  ...(satrlar.length ? satrlar.map(s => ({ uz: s, ru: s })) : [A2_JOY_YOZUV]),
  trek === 'web'
    ? { uz: "Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; «Yangilash» tugmasi qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: {что должно работать как раньше} пусть работает как раньше; кнопка «Yangilash» пусть останется. Не трогай файлы `.env`. Больше ничего не трогай, скажи изменённые файлы.' }
    : { uz: "Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: {что должно работать как раньше} пусть работает как раньше; обновление потягиванием вниз пусть останется. Не трогай файлы `.env`. Больше ничего не трогай, скажи изменённые файлы.' }
];
const a2Yordam = (trek) => [
  { uz: "Mentor misolidagi to'liq talab:", ru: 'Полное требование в примере Ментора:' },
  trek === 'web' ? { uz: "Qayerda: `prototip/` — ulanish fayli va real vaqt sahifalari. Backend'ga tegma.", ru: 'Где: `prototip/` — файл соединения и страницы реального времени. Backend не трогай.' }
    : { uz: "Qayerda: `mobil/` — ulanish fayli va real vaqt ekranlari. Backend'ga tegma.", ru: 'Где: `mobil/` — файл соединения и экраны реального времени. Backend не трогай.' },
  { uz: "Nima qilsin: pastdagi buzish yozuvida «buzildi» belgili har urinishni tuzat: ilova «Nima kutdim» qatoridagidek ishlasin. Har muammoning sababini bir gap bilan ayt.", ru: 'Что сделать: исправь каждую попытку с отметкой «сломалось» в записи ниже: пусть приложение работает как в строке «Что я ожидал». Причину каждой проблемы скажи одной фразой.' },
  ...[0, 2].map(i => { const y = MENTOR_YOZUV[i]; return { uz: `${i + 1} · ${usulNom(y.usul).uz}. Nima qildim: ${y.qildim.uz} Nima kutdim: ${y.kutdim.uz} Nima bo'ldi: ${y.boldi.uz}`, ru: `${i + 1} · ${usulNom(y.usul).ru}. Что я сделал: ${y.qildim.ru} Что я ожидал: ${y.kutdim.ru} Что произошло: ${y.boldi.ru}` }; }),
  trek === 'web' ? { uz: "Nima buzilmasin: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; «Yangilash» tugmasi qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход, объявление, присоединение, подтверждение, выход и очередь пусть работают как раньше; кнопка «Yangilash» пусть останется. Не трогай файлы `.env`. Больше ничего не трогай, скажи изменённые файлы.' }
    : { uz: "Nima buzilmasin: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход, объявление, присоединение, подтверждение, выход и очередь пусть работают как раньше; обновление потягиванием вниз пусть останется. Не трогай файлы `.env`. Больше ничего не трогай, скажи изменённые файлы.' }
];
const buzilmasinOqi = () => { const t = lsOqi(TALAB_KALIT); const b = t && t.buzilmasin; return typeof b === 'string' ? b.trim() : Array.isArray(b) ? b.map(x => String(x || '').trim()).filter(Boolean).join(', ') : ''; };
// 3-qadam: «buzildi» belgili har urinishga «Tuzatish qilindi» (ish fakti) · 4-qadam: qayta tekshiruv natijasi — ikki alohida tugma, ikki alohida qadam (sinf 2d)
const TuzatTugmalar = ({ ur, onYoz }) => (
  <span className="bf-tz">{ur.map((u, i) => (u.buzildi === true
    ? <span key={u.usul} className="bf-tz-q"><b>{i + 1} · {tr(usulNom(u.usul))}</b>
      <span className="bf-chorla"><QChip holat={u.tuzatildi ? 'on' : undefined} aria-pressed={u.tuzatildi} onClick={() => onYoz(i, { tuzatildi: !u.tuzatildi })}>{u.tuzatildi ? '✓ ' : ''}{tr({ uz: 'Tuzatish qilindi', ru: 'Исправление сделано' })}</QChip></span></span>
    : null))}</span>
);
const QaytaTugmalar = ({ ur, onYoz }) => (
  <span className="bf-tz">{ur.map((u, i) => (u.buzildi === true
    ? <span key={u.usul} className="bf-tz-q"><b>{i + 1} · {tr(usulNom(u.usul))}</b>
      <span className="bf-chorla">
        <QChip holat={u.qayta === 'takrorlanmadi' ? 'on' : undefined} onClick={() => onYoz(i, { qayta: 'takrorlanmadi' })}>{tr({ uz: 'Qayta tekshiruvda takrorlanmadi', ru: 'При повторной проверке не повторилось' })}</QChip>
        <QChip holat={u.qayta === 'takrorlandi' ? 'on' : undefined} onClick={() => onYoz(i, { qayta: 'takrorlandi' })}>{tr({ uz: 'Qayta tekshiruvda yana buzildi', ru: 'При повторной проверке снова сломалось' })}</QChip>
      </span></span>
    : null))}</span>
);
const ScreenA2 = (props) => {
  const [trek, setTrek] = useState(trekOqi);
  const tanla = (t) => { trekYoz(t); setTrek(t); };
  const [ur, setUr] = useState(buzishOqi);
  const onYoz = (i, maydon) => { buzishYoz((u, j) => (j === i ? { ...u, ...maydon } : u)); setUr(buzishOqi()); };
  const buzildi = ur.filter(u => u.buzildi === true);
  const ish = useMemo(buzilmasinOqi, []);
  const satrlar = ur.map((u, i) => (u.buzildi === true ? yozuvSatr(u, i, false) : null)).filter(Boolean);
  const toliq = ur.map((u, i) => yozuvSatr(u, i, true));
  const doneText = buzildi.length === 0
    ? (ur.every(u => u.buzildi === false) ? { uz: "Yozuvingiz `BUZISH.md` da: uch usul ilovangizni buzmadi.", ru: 'Ваша запись в `BUZISH.md`: три способа не сломали приложение.' } : null)
    : buzildi.some(u => u.qayta === 'takrorlandi') ? { uz: 'Tuzatish qilindi, bitta urinish yana buzildi — uyda davom etasiz.', ru: 'Исправление сделано, одна попытка снова сломалась — продолжите дома.' }
      : buzildi.every(u => u.tuzatildi && u.qayta === 'takrorlanmadi') ? { uz: "Tuzatish qilindi va qayta tekshirildi: yozuvingiz `BUZISH.md` da.", ru: 'Исправление сделано и перепроверено: ваша запись в `BUZISH.md`.' } : null;
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z repo'ngiz", ru: 'Практика 2 · ваш репозиторий' }}
      title={{ uz: <>Topilgan muammolarni tuzating va <span className="italic" style={{ color: T.accent }}>qayta tekshiring</span>.</>, ru: <>Исправьте найденные проблемы и <span className="italic" style={{ color: T.accent }}>перепроверьте</span>.</> }}
      mentor={{ uz: "Yozuvingizni agentga so'zma-so'z berasiz: tuzatishni u qiladi, natijani esa siz tekshirasiz; «1 · Ochish»dan boshlang.", ru: 'Свою запись вы отдаёте агенту слово в слово: исправляет он, а результат проверяете вы; начните с «1 · Ochish».' }}
      ustida={<TrekTanlov trek={trek} onTanla={tanla} />}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "1-amaliyotdagi yozuvingiz pastdagi talabga o'zi qo'yilgan — «buzildi» belgili urinishlarni o'qib chiqing. Ilovangiz telefonda ochiq tursin (mobil trekda `npx expo start` ishlab tursin).", ru: 'ваша запись из 1-й практики уже подставлена в требование ниже — прочитайте попытки с отметкой «сломалось». Пусть приложение открыто на телефоне (в мобильном треке пусть работает `npx expo start`).' },
          bandlar: [{ uz: "Hech biri «buzildi» bo'lmasa — 2 va 3-qadamni o'tkazib yuboring: 4-qadamda faqat `BUZISH.md` yoziladi.", ru: 'Если ни одной «сломалось» нет — пропустите шаги 2 и 3: на шаге 4 пишется только `BUZISH.md`.' }] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "qavslarni tekshiring (tahrirlasangiz bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'проверьте скобки (можно отредактировать), нажмите «Скопировать» и отправьте в Antigravity:' },
          prompt: a2Prompt(trek, satrlar), namuna: ish ? [] : [{ joy: tr(A2_JOY_ISH), n: A2_ISH_NAMUNA }], toldir: ish ? { [tr(A2_JOY_ISH)]: ish } : {}, yordam: a2Yordam(trek) },
        { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q. Agent aytgan sabablarni o'qing — ular uning so'zi; natijani 4-qadam ko'rsatadi.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают с тем, что сказал агент, `.env` в списке нет. Прочитайте причины, которые назвал агент, — это его слова; результат покажет шаг 4.' },
          bandlar: [
            { uz: "Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`). Web-trekda: `git add <fayl>` → `git commit -m \"qayta ulanish tuzatishi\"` → `git push` — Netlify saytni odatda o'zi yangilaydi.", ru: 'В мобильном треке Expo Go обычно сам перезагружает приложение (если нет — `r` в терминале). В веб-треке: `git add <fayl>` → `git commit -m "qayta ulanish tuzatishi"` → `git push` — Netlify обычно сам обновляет сайт.' },
            { uz: "Agent `backend/` ni ham o'zgartirgan bo'lsa — ikkala trekda shu fayllarni `git push` qiling va Render'da yangi versiya tugashini kuting.", ru: 'Если агент изменил и `backend/` — в обоих треках сделайте `git push` этих файлов и дождитесь окончания новой версии на Render.' },
            { uz: "Agent har muammo uchun qaysi faylni o'zgartirganini aytgan va u `git status` da ko'ringan bo'lsa, o'sha urinishga «Tuzatish qilindi» ni belgilang — bu ish fakti: kodda o'zgartirish qilindi; to'g'riligini 4-qadam ko'rsatadi.", ru: 'Если агент назвал, какой файл изменил для каждой проблемы, и он виден в `git status`, отметьте у этой попытки «Исправление сделано» — это факт работы: в коде внесено изменение; правильность покажет шаг 4.' },
            { uz: "Agentdan o'zgartirgan kodidagi ikki joyni ko'rsatishni so'rang — darsda ko'rgan `connect` va tinglovchini o'z loyihangizda topasiz:", ru: 'Попросите агента показать два места в изменённом коде — найдёте в своём проекте `connect` и слушателя, которых видели на уроке:' }
          ],
          prompt: A2_KOD_PROMPT, ichkiKeyin: true,
          keyin: [{ uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если появилась ошибка — отправьте агенту строку ошибки (не значения `.env`, токен и ключи): «Shu xato chiqdi: {xato}. Tuzat.»' }],
          tugmalar: 'tuz' },
        { h: { uz: 'Qayta tekshirish va GitHub', ru: 'Перепроверка и GitHub' }, t: { uz: "«buzildi» belgili har urinishni o'sha usul bilan qaytaring (ilovani yopib oching, agentga «Yubor», keyin «O'chir»). Tanlang: «Qayta tekshiruvda takrorlanmadi» · «Qayta tekshiruvda yana buzildi».", ru: 'повторите каждую попытку с отметкой «сломалось» тем же способом (закройте и откройте приложение, агенту «Yubor», потом «O\'chir»). Выберите: «При повторной проверке не повторилось» · «При повторной проверке снова сломалось».' },
          bandlar: [
            { uz: "Yana buzilsa — agentga: «{usul} qayta tekshiruvda yana buzildi: {nima bo'ldi}. Tuzat.» va o'sha usulni yana bir marta qaytaring; qolgani — uyda.", ru: 'Если снова сломалось — агенту: «{usul} qayta tekshiruvda yana buzildi: {nima bo\'ldi}. Tuzat.» и повторите этот способ ещё раз; остальное — дома.' },
            { uz: 'Keyin agentga:', ru: 'Потом агенту:' }
          ],
          prompt: [{ uz: "`BUZISH.md` yarat: pastdagi yozuvimni so'zma-so'z ko'chir — har urinishning uch qatori, belgisi, tuzatish va qayta tekshiruv natijasi. Boshqa faylga tegma.", ru: 'Создай `BUZISH.md`: перенеси мою запись ниже слово в слово — три строки каждой попытки, отметку, исправление и результат повторной проверки. Другие файлы не трогай.' }, ...toliq.map(s => ({ uz: s, ru: s }))],
          keyin: [
            { uz: "`BUZISH.md` ni yozuvingiz bilan solishtiring; mos bo'lsa — `git status` → `git add BUZISH.md` va tuzatilgan fayllar (`git add .` emas) → `git commit -m \"buzish va tuzatish\"` → `git push`.", ru: 'Сравните `BUZISH.md` со своей записью; если совпадает — `git status` → `git add BUZISH.md` и исправленные файлы (не `git add .`) → `git commit -m "buzish va tuzatish"` → `git push`.' },
            { uz: "`git push` xato bersa — xato qatorini agentga yuboring (token va kalitlarni emas).", ru: 'Если `git push` выдаст ошибку — отправьте агенту строку ошибки (не токен и ключи).' }
          ],
          tugmalar: 'qayta' }
      ].map(c => (c.tugmalar === 'tuz' ? { ...c, ichki: <TuzatTugmalar ur={ur} onYoz={onYoz} /> } : c.tugmalar === 'qayta' ? { ...c, ichki: <QaytaTugmalar ur={ur} onYoz={onYoz} /> } : c))}
      natija={<NatijaA2 />}
      doneText={doneText}
      ulgur={{ uz: "Ulgurmasangiz: 3-usulning qayta tekshiruvi — uyda; `BUZISH.md` bugun yozilsa, shu urinish qatorida «qayta tekshiruv — hali yo'q» turadi.", ru: 'Если не успеваете: повторная проверка способа 3 — дома; если `BUZISH.md` пишется сегодня, в строке этой попытки будет «повторной проверки — ещё нет».' }}
      ulgurQadam={3}
    />
  );
};

const KARTALAR = [
  { front: { uz: 'Buzish nima?', ru: 'Что значит «ломать»?' }, back: { uz: 'Ilovaning chekka holatini ataylab yuzaga keltirib tekshirish', ru: 'Намеренно вызвать крайний случай приложения и проверить' }, note: { uz: "Bu darsda — faqat o'z ilovangizda, uch usul bilan", ru: 'На этом уроке — только в своём приложении, тремя способами' } },
  { front: { uz: 'Uch buzish usuli qaysilar?', ru: 'Какие три способа поломки?' }, back: { uz: "Internetni uzish, fonga olib qaytarish, Backend'ning yangi versiyasi", ru: 'Отключить интернет, свернуть и вернуться, новая версия Backend' }, note: { uz: 'Mentor misolida ikkitasi ilovani buzdi', ru: 'В примере Ментора два из них сломали приложение' } },
  { front: { uz: 'Buzish yozuvida qaysi uch qator bor?', ru: 'Какие три строки в записи поломки?' }, back: { uz: "Nima qildim, nima kutdim, nima bo'ldi", ru: 'Что сделал, что ожидал, что произошло' }, note: { uz: 'Oxirida belgi: buzildi yoki buzilmadi', ru: 'В конце отметка: сломалось или не сломалось' } },
  { front: { uz: '«Nima kutdim» qachon yoziladi?', ru: 'Когда пишут «Что я ожидал»?' }, back: { uz: 'Buzishdan oldin', ru: 'До поломки' }, note: { uz: "Shunda natija bilan solishtirsa bo'ladi", ru: 'Тогда его можно сравнить с результатом' } },
  { front: { uz: "Uzilish paytida yuborilgan hodisa nima bo'ladi?", ru: 'Что будет с событием, отправленным во время обрыва?' }, back: { uz: 'Bu misolda keyin ham kelmaydi', ru: 'В этом примере оно не придёт и потом' }, note: { uz: "Tuzatish: qayta ulanganda ro'yxat qayta so'raladi", ru: 'Исправление: при переподключении список запрашивается заново' } },
  { front: { uz: 'Qayta ulanish nima?', ru: 'Что такое переподключение?' }, back: { uz: 'Uzilgan ulanishni qayta tiklash', ru: 'Восстановление оборванного соединения' }, note: { uz: "socket.io bunga o'zi urinadi — odatda bir necha soniyada", ru: 'socket.io пытается сделать это сам — обычно за несколько секунд' } },
  { front: { uz: '`connect` ichidagi kod qachon ishlaydi?', ru: 'Когда срабатывает код внутри `connect`?' }, back: { uz: 'Birinchi ulanishda va har qayta ulanishda', ru: 'При первом подключении и при каждом переподключении' }, note: { uz: "Shuning uchun tinglovchi uning tashqarisida qo'shiladi", ru: 'Поэтому слушатель добавляется снаружи него' } },
  { front: { uz: 'Takror hodisa nima?', ru: 'Что такое повторное событие?' }, back: { uz: "Bitta o'zgarish ilovaga ikki marta ta'sir qilishi", ru: 'Одно изменение влияет на приложение дважды' }, note: { uz: 'Mentor misolida — jonli xabar ikki marta chiqdi', ru: 'В примере Ментора — живое сообщение появилось дважды' } },
  { front: { uz: "Ulanish uzilsa, xonada nima bo'ladi?", ru: 'Что происходит в комнате, если соединение оборвалось?' }, back: { uz: 'Ulanish xonadan chiqadi', ru: 'Соединение выходит из комнаты' }, note: { uz: "Mentor misolida qayta ulangach ilova o'yin xonasiga qayta kiradi", ru: 'В примере Ментора после переподключения приложение снова входит в комнату игры' } },
  { front: { uz: '«Tuzatish qilindi» nimani bildiradi?', ru: 'Что означает «исправление сделано»?' }, back: { uz: "Kodda o'zgartirish qilingani — bu ish fakti", ru: 'Что в коде внесено изменение — это факт работы' }, note: { uz: "Natijani qayta tekshiruv ko'rsatadi", ru: 'Результат покажет повторная проверка' } },
  { front: { uz: '«Qayta tekshiruvda takrorlanmadi» qachon yoziladi?', ru: 'Когда пишут «при повторной проверке не повторилось»?' }, back: { uz: "O'sha usul bilan qayta buzib ko'rilganda muammo chiqmasa", ru: 'Если при повторной поломке тем же способом проблема не появилась' }, note: { uz: 'Shu telefonda, shu urinishda — hamma telefon uchun isbot emas', ru: 'На этом телефоне, в этой попытке — не доказательство для всех телефонов' } },
  { front: { uz: 'Agentning «bajardim» degani nima?', ru: 'Что значит «сделал» от агента?' }, back: { uz: "Da'vo — hali tekshirilmagan", ru: 'Заявление — ещё не проверено' }, note: { uz: "Natijani o'zingiz buzib ko'rib bilasiz", ru: 'Результат вы узнаете, сами сломав и посмотрев' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('bf-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tr(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="bf-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204, texnik darslar standarti; E 50). Sarlavha va ✓ yorlig'i holatga qarab (pm-m10d5-buzish + A1, A2 bayroqlari; E 54 — har holatda rost) =====
const HW_QADAM = [
  { b: { uz: 'Tugatish', ru: 'Завершить' }, t: { uz: "— darsda ulgurmagan usulni bajaring va yozing (ko'pincha — Render'da qayta chiqarish); «buzildi» bo'lsa — yozuvni agentga bering va o'sha usul bilan qayta tekshiring.", ru: '— выполните и запишите способ, на который не хватило времени (чаще всего — перевыпуск на Render); если «сломалось» — отдайте запись агенту и перепроверьте тем же способом.' } },
  { b: { uz: 'Yana bir marta', ru: 'Ещё раз' }, t: { uz: "— bugun natijasi kutganingizdan boshqacha chiqqan yoki qayta tekshiruvi tugamagan usulni ertaga yana bajaring: natija o'shandaymi? Farq bo'lsa, `BUZISH.md` ga yangi urinish qo'shing.", ru: '— способ, результат которого сегодня отличался от ожидаемого или повторная проверка которого не закончена, выполните завтра ещё раз: результат тот же? Если есть разница, добавьте в `BUZISH.md` новую попытку.' } },
  { b: { uz: 'Talab', ru: 'Требование' }, t: { uz: "— bugun topilgan har muammo talabingizdagi chekka holatlar ro'yxatida bormi? Yo'q bo'lsa — README'dagi «Real vaqt» bo'limiga bitta chekka holat qo'shing.", ru: '— есть ли каждая найденная сегодня проблема в списке крайних случаев вашего требования? Если нет — добавьте один крайний случай в раздел «Real vaqt» в README.' } }
];
const HwCard = ({ keyingi }) => (
  <div className="card bf-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div>
    <div className="bf-hw-karta">
      <span className="bf-hw-q"><em>{tr({ uz: 'kim uchun', ru: 'для кого' })}</em><b>{tr({ uz: "o'z ilovangiz", ru: 'ваше приложение' })}</b></span>
      <span className="bf-hw-q"><em>{tr({ uz: 'nechta', ru: 'сколько' })}</em><b>{tr({ uz: 'uch usul', ru: 'три способа' })}</b></span>
      <span className="bf-hw-q"><em>{tr({ uz: 'muddat', ru: 'срок' })}</em><b>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</b></span>
    </div>
    <ol className="bf-hw-qadam">{HW_QADAM.map((h, i) => <li key={i}><i>{i + 1}</i><span><b>{tr(h.b)}</b> {tx(h.t)}</span></li>)}</ol>
    {keyingi && <span className="bf-hw-keyingi">{keyingi}</span>}
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
  const ur = buzishOqi();
  const buzildi = ur.filter(u => u.buzildi === true);
  const hechBiri = !ur.some(yozildi);
  const holat = a1 && a2 && buzildi.length > 0 && buzildi.every(u => u.tuzatildi && u.qayta === 'takrorlanmadi') ? 'toliq'
    : ur.every(u => u.buzildi === false) ? 'buzilmadi'
      : buzildi.some(u => u.tuzatildi) ? 'qayta'
        : buzildi.length > 0 && (a1 || ur.every(yozildi)) ? 'tuzatish'
          : hechBiri ? 'yoq' : 'boshlandi';
  const SARLAVHA = {
    toliq: { uz: 'Topilgan muammolar tuzatildi va qayta tekshirildi.', ru: 'Найденные проблемы исправлены и перепроверены.' },
    buzilmadi: { uz: 'Uch usul bajarildi — mahsulotingiz buzilmadi.', ru: 'Три способа выполнены — ваш продукт не сломался.' },
    qayta: { uz: 'Tuzatish qilindi — qayta tekshirish qoldi.', ru: 'Исправление сделано — осталась повторная проверка.' },
    tuzatish: { uz: 'Muammolar yozildi — tuzatish qoldi.', ru: 'Проблемы записаны — осталось исправление.' },
    boshlandi: { uz: 'Buzish boshlandi — qolgan usullarni uyda bajaring.', ru: 'Поломка начата — остальные способы выполните дома.' },
    yoq: { uz: 'Buzish yozuvi hali yozilmagan — usullarni uyda bajaring.', ru: 'Запись поломки ещё не написана — выполните способы дома.' }
  };
  // ✓ «BUZISH.md tayyor» — faqat 1 yoki 2-holatda va BUZISH.md yozilgan bo'lsa (A2 oxirgi qadami)
  const chipBor = (holat === 'toliq' || holat === 'buzilmadi') && a2;
  const RECAP = [
    { uz: "Chekka holat oddiy paytda ko'rinmaydi — uni ataylab yuzaga keltirib tekshirasiz.", ru: 'Крайний случай в обычное время не виден — его намеренно вызывают и проверяют.' },
    { uz: "Bu misolda uzilish paytida yuborilgan hodisa keyin kelmaydi, shuning uchun qayta ulanganda ro'yxat qayta so'raladi.", ru: 'В этом примере событие, отправленное во время обрыва, потом не приходит, поэтому при переподключении список запрашивается заново.' },
    { uz: "`connect` ichidagi kod har qayta ulanishda ishlaydi, shuning uchun tinglovchi uning tashqarisida bir marta qo'shiladi.", ru: 'Код внутри `connect` срабатывает при каждом переподключении, поэтому слушатель добавляется один раз снаружи него.' },
    { uz: "Uzilganda ulanish xonadan chiqadi; Mentor misolida tuzatishdan keyin qayta ulangan ilova o'yin xonasiga qayta kiradi.", ru: 'При обрыве соединение выходит из комнаты; в примере Ментора после исправления переподключённое приложение снова входит в комнату игры.' },
    { uz: "«Tuzatish qilindi» — ish fakti; «qayta tekshiruvda takrorlanmadi» — o'sha usul bilan ko'rilgan natija.", ru: '«Исправление сделано» — факт работы; «при повторной проверке не повторилось» — результат, увиденный тем же способом.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className={cx('bf-yakun', !chipBor && 'yoq-chip')}>
        <QYakun til={__lang}
          chip={<>{tx({ uz: '`BUZISH.md` tayyor', ru: '`BUZISH.md` готов' })}</>}
          togri={correct} jami={total}
          sarlavha={tr(SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(r => tx(r))}
          uyga={<HwCard keyingi={tr({ uz: <>Keyingi dars — <b>«Birinchi foydalanuvchilar sizni qayerdan topadi?»</b></>, ru: <>Следующий урок — <b>«Где вас найдут первые пользователи?»</b></> })} />}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function BreakAndFixLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, ScreenA1, ScreenA2, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI — «ikki telefon va Backend» sahnasi (bf-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Telefon 172×272 hamma ekranda (SABOQ 22) === */
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (tebranish yengil — 11-Modul SABOQ 32) */
        .bf-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: bf-puls 2.2s ease-out .3s 3; }
        @keyframes bf-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        /* Variantlar va tanlov chiplari: guruh atrofida ramka YO'Q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (F-1006-376/381/385, «donavoy») */
        .bf-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: bf-chorla-v 1.8s ease-out .5s 2; }
        @keyframes bf-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .bf-halqa-g .q-chip:not(:disabled), .bf-chorla > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: bf-chorla-c 1.8s ease-out .5s 2; }
        @keyframes bf-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .bf-k.faol .q-variant:nth-child(2), .bf-halqa-g .q-chip:nth-child(2), .bf-chorla > .q-chip:nth-child(2) { animation-delay: .75s; }
        .bf-k.faol .q-variant:nth-child(3), .bf-halqa-g .q-chip:nth-child(3), .bf-chorla > .q-chip:nth-child(3) { animation-delay: 1s; }
        .bf-halqa-g .q-chip:nth-child(4), .bf-chorla > .q-chip:nth-child(4) { animation-delay: 1.25s; }
        .bf-halqa-g .q-chip:nth-child(5), .bf-chorla > .q-chip:nth-child(5) { animation-delay: 1.5s; }
        .bf-pop { display: inline-block; animation: bf-pop 0.55s cubic-bezier(.3,1.5,.5,1); color: ${T.accent}; }
        @keyframes bf-pop { 0% { transform: scale(1.45); } 100% { transform: scale(1); } }
        .bf-k { display: contents; }
        .bf-viz { display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
        p.bf-nom { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        p.bf-nom b { color: ${T.accent}; }
        /* Yashil xulosa ichida: taxmin qatori (kichik) · asosiy gap · izoh (kichik, ingichka ajratgich) — quti qalin bo'lmaydi (F-1006-380/382) */
        .q-xulosa .bf-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .bf-x-tx b { color: ${T.ink}; } .q-xulosa .bf-x-tx.ok, .q-xulosa .bf-x-tx.ok b { color: ${T.ok}; } .q-xulosa .bf-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .bf-x-m { display: block; }
        .q-xulosa .bf-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        .bf-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .bf-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        /* Sahna joylashuvi: yot — bir qatorda; tik — telefonlar tepada, Backend pastda */
        .bf-sahna { user-select: none; -webkit-user-select: none; display: grid; gap: 0 10px; padding-top: 30px; justify-content: center; align-items: start; }
        .bf-sahna.yot.ikki { grid-template-columns: auto minmax(56px, 120px) auto minmax(56px, 120px) auto; grid-template-areas: "t1 c1 be c2 t2"; }
        .bf-sahna.yot.bir { grid-template-columns: auto minmax(56px, 110px) auto; grid-template-areas: "t1 c1 be"; }
        .bf-sahna.tik.ikki { grid-template-columns: 172px 172px; column-gap: 12px; grid-template-areas: "t1 t2" "c1 c2" "be be"; }
        .bf-sahna.tik.bir { grid-template-columns: auto; grid-template-areas: "t1" "c1" "be"; justify-items: center; }
        .bf-sahna.bes.tik.ikki { grid-template-areas: "t1 t2"; }
        .bf-sahna.bes.bir { grid-template-columns: auto; grid-template-areas: "t1"; }
        .bf-s-t1 { grid-area: t1; } .bf-s-t2 { grid-area: t2; } .bf-s-c1 { grid-area: c1; } .bf-s-c2 { grid-area: c2; } .bf-s-be { grid-area: be; justify-self: center; }
        .bf-sahna.tik .bf-s-c1, .bf-sahna.tik .bf-s-c2 { justify-self: center; }
        /* Telefon */
        .bf-tel-ust { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; width: 172px; }
        .bf-sahna.yot .bf-tel-ust:has(.bf-kod) { width: auto; }
        .bf-tel-yorliq { position: absolute; top: -28px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 999px; white-space: nowrap; }
        .bf-tel-yorliq.b1 { background: ${T.accentSoft}; color: ${T.accent}; } .bf-tel-yorliq.b2 { background: ${fon(T.ink, 0.08)}; color: ${T.ink}; }
        .bf-tel-yorliq.tex { position: static; transform: none; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink2}; }
        .bf-telefon { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 5px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .bf-telefon.tortiladi { touch-action: none; cursor: grab; }
        .bf-tel-bar { position: relative; display: flex; align-items: center; justify-content: center; height: 18px; flex: none; }
        .bf-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: ${MAYDON_RANG}; letter-spacing: 0.01em; }
        .bf-samolyot { position: absolute; right: 0; top: -1px; width: 22px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid ${T.line}; border-radius: 7px; background: ${T.bg}; color: ${T.ink2}; cursor: pointer; padding: 0; transition: background 0.25s, color 0.25s; }
        .bf-samolyot.on { background: ${T.accent}; color: #fff; border-color: ${T.accent}; }
        .bf-samolyot:disabled { cursor: default; }
        .bf-tel-ekran { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; animation: bf-ekran 0.35s ease-out both; transition: transform 0.18s; }
        @keyframes bf-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        .bf-oyin { display: flex; flex-direction: column; gap: 3px; flex: 1; min-height: 0; }
        .bf-oyin-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .bf-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .bf-oyin-joy { font-size: 12px; color: ${T.ink2}; }
        .bf-hisob { display: inline-flex; align-items: baseline; gap: 6px; align-self: flex-start; margin-top: 4px; padding: 0 2px; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${T.ink2}; border-radius: 6px; }
        .bf-son { display: inline-block; font-size: 22px; font-weight: 800; color: ${T.ink}; }
        .bf-son.yangi { color: ${T.accent}; animation: bf-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .bf-eski { font-family: 'Manrope'; font-style: normal; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; background: ${fon(T.ink, 0.07)}; border-radius: 999px; padding: 1px 7px; animation: fade-in-up 0.4s ease-out both; }
        .bf-doiralar { display: grid; grid-template-columns: repeat(5, 14px); gap: 6px; margin: 3px 0 4px; }
        .bf-doiralar i { width: 14px; height: 14px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .bf-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.38)}; }
        .bf-doiralar i.yangi { background: ${T.accent}; animation: bf-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .bf-qoshil { margin-top: auto; flex: none; display: flex; align-items: center; justify-content: center; height: 30px; border: 0; border-radius: 10px; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-size: 12px; font-weight: 800; cursor: pointer; transition: background 0.3s, color 0.3s; }
        .bf-qoshil:disabled { cursor: default; }
        .bf-qoshil:disabled:not(.off) { background: ${fon(T.accent, 0.16)}; color: ${T.accent}; }
        .bf-qoshil.off { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .bf-oyinlar { display: flex; flex-direction: column; gap: 5px; flex: 1; min-height: 0; }
        .bf-ol-bosh { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .bf-ol-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .bf-kun { font-size: 11px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.04em; }
        .bf-karta { display: flex; flex-direction: column; gap: 1px; padding: 6px 8px; border-radius: 9px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11px; line-height: 1.3; color: ${T.ink2}; }
        .bf-karta b { font-size: 12px; color: ${T.ink}; }
        .bf-karta.yangi { border-color: ${T.ok}; background: ${fon(T.ok, 0.1)}; animation: bf-kirdi 0.5s ease-out both; }
        @keyframes bf-kirdi { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .bf-karta-son { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; display: flex; align-items: baseline; gap: 6px; }
        .bf-belgi { display: inline-flex; align-items: center; gap: 5px; height: 20px; padding: 0 8px; border-radius: 999px; font-size: 10.5px; font-weight: 800; white-space: nowrap; animation: fade-in-up 0.35s ease-out both; }
        .bf-belgi-n { width: 7px; height: 7px; border-radius: 50%; flex: none; }
        .bf-belgi.ulangan { background: ${fon(T.ok, 0.12)}; color: ${T.ok}; } .bf-belgi.ulangan .bf-belgi-n { background: ${T.ok}; }
        .bf-belgi.ulanmoqda { background: ${T.accentSoft}; color: ${T.accent}; } .bf-belgi.ulanmoqda .bf-belgi-n { background: ${T.accent}; animation: bf-miltil 1.6s ease-in-out infinite; }
        .bf-belgi.ulanmagan { background: ${fon(T.ink, 0.07)}; color: ${T.ink2}; } .bf-belgi.ulanmagan .bf-belgi-n { background: ${T.ink2}; }
        .bf-belgi.joy { padding: 0 6px; background: ${fon(T.ink, 0.05)}; } .bf-belgi.joy .bf-belgi-n { background: ${fon(T.ink, 0.3)}; }
        @keyframes bf-miltil { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .bf-konvert .bf-kv-i { width: 30px; height: 21px; }
        .bf-konvert.ochiq .bf-kv-i { background: ${T.paper}; border-color: ${T.ok}; }
        /* Tik sahnada (telefon, ixcham): konvert telefon OSTIDA, yozuvi yonida — 2-telefon ustiga tushmaydi (o'z topilmam, 07.10) */
        .bf-sahna.tik .bf-konvert { position: relative; top: auto; right: auto; gap: 6px; }
        .bf-sahna.tik .bf-konvert-y { position: static; }
        .bf-qadam { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 4px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; font-weight: 700; color: ${T.ink}; white-space: nowrap; }
        .bf-qadam i { width: 20px; height: 20px; border-radius: 50%; background: ${T.accent}; color: #fff; font-style: normal; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; }
        /* Backend tuguni */
        .bf-be-ust { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .bf-sahna.yot .bf-be-joy { height: 272px; display: flex; align-items: center; justify-content: center; }
        .bf-backend { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 132px; max-width: 190px; padding: 12px 14px; border-radius: 16px; background: ${T.ink}; color: ${T.paper}; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.6); transition: box-shadow 0.3s; }
        .bf-backend.yon { box-shadow: 0 0 0 4px ${fon(T.accent, 0.35)}; }
        .bf-backend.ok { box-shadow: 0 0 0 4px ${fon(T.ok, 0.35)}; } .bf-backend.xato { box-shadow: 0 0 0 4px ${fon(T.err, 0.4)}; animation: bf-be-silk .4s ease-in-out; }
        @keyframes bf-be-silk { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        /* 7-ekran: kod kartalari sahna ostida ikki ustunda — telefon, chiziq va Backend bir-biriga tegib turadi (F-1006-379) */
        .bf-kodlar .bf-kod { max-width: none; }
        .bf-kodlar .bf-tugmalar { justify-content: flex-start; }
        @media (max-width: 760px) { .bf-kodlar { grid-template-columns: minmax(0, 1fr); } }
        .bf-backend.tugildi { animation: bf-tugil 0.5s cubic-bezier(.3,1.4,.5,1) both; }
        @keyframes bf-tugil { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }
        .bf-be-nom { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
        .bf-db { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 2px 9px; border-radius: 7px; background: ${fon(T.paper, 0.12)}; transition: background 0.3s; }
        .bf-db.yon { background: ${T.accent}; }
        .bf-db b { color: ${T.paper}; }
        .bf-be-qator { font-size: 11.5px; font-weight: 700; color: ${T.paper}; opacity: 0.85; text-align: center; }
        /* Chiziq va konvert */
        .bf-chiziq { position: relative; }
        .bf-chiziq.yot { height: 272px; min-width: 56px; }
        .bf-chiziq.tik { height: 46px; width: 30px; }
        .bf-chiziq-i { position: absolute; display: block; opacity: 0; transition: opacity 0.3s; }
        .bf-chiziq.yot .bf-chiziq-i { left: 0; right: 0; top: calc(50% - 1.5px); height: 3px; }
        .bf-chiziq.tik .bf-chiziq-i { top: 0; bottom: 0; left: calc(50% - 1.5px); width: 3px; }
        .bf-chiziq.yot.h-savol .bf-chiziq-i, .bf-chiziq.yot.h-sondi .bf-chiziq-i, .bf-chiziq.yot.h-uzilgan .bf-chiziq-i, .bf-chiziq.yot.h-tiklan .bf-chiziq-i { opacity: 1; background: repeating-linear-gradient(90deg, ${fon(T.ink, 0.28)} 0 7px, transparent 7px 13px); }
        .bf-chiziq.tik.h-savol .bf-chiziq-i, .bf-chiziq.tik.h-sondi .bf-chiziq-i, .bf-chiziq.tik.h-uzilgan .bf-chiziq-i, .bf-chiziq.tik.h-tiklan .bf-chiziq-i { opacity: 1; background: repeating-linear-gradient(180deg, ${fon(T.ink, 0.28)} 0 7px, transparent 7px 13px); }
        .bf-chiziq.h-sondi .bf-chiziq-i { opacity: 0.55; }
        .bf-chiziq.h-sorov .bf-chiziq-i { opacity: 1; background: ${T.accent}; box-shadow: 0 0 10px ${fon(T.accent, 0.5)}; }
        .bf-chiziq.h-bir .bf-chiziq-i { background: ${T.accent}; animation: bf-bir 1.4s ease-out both; }
        @keyframes bf-bir { 0% { opacity: 0; } 25% { opacity: 1; } 100% { opacity: 0; } }
        .bf-chiziq.h-chizil .bf-chiziq-i, .bf-chiziq.h-ochiq .bf-chiziq-i { opacity: 1; background: ${T.ok}; }
        .bf-chiziq.yot.h-chizil .bf-chiziq-i { transform-origin: left center; animation: bf-chizx 0.6s ease-out both; }
        .bf-chiziq.yot.n2.h-chizil .bf-chiziq-i { transform-origin: right center; }
        .bf-chiziq.tik.h-chizil .bf-chiziq-i { transform-origin: center top; animation: bf-chizy 0.6s ease-out both; }
        @keyframes bf-chizx { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes bf-chizy { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .bf-chiziq.h-ochiq .bf-chiziq-i { animation: bf-ochiq 2.6s ease-in-out infinite; }
        @keyframes bf-ochiq { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; } 50% { box-shadow: 0 0 9px 1px ${fon(T.ok, 0.45)}; } }
        .bf-chiziq.h-uzildi .bf-chiziq-i { opacity: 1; background: ${T.err}; animation: bf-uzildi 0.55s ease-in both; }
        @keyframes bf-uzildi { 0% { opacity: 1; } 100% { opacity: 0; } }
        .bf-chiziq.h-tiklan .bf-chiziq-i::after { content: ''; position: absolute; inset: 0; background: ${T.ok}; transform-origin: left center; animation: bf-chizx 2s linear both; }
        .bf-chiziq.tik.h-tiklan .bf-chiziq-i::after { transform-origin: center top; animation-name: bf-chizy; }
        .bf-chiziq.h-yopiq .bf-chiziq-i { opacity: 0; background: ${T.ok}; animation: bf-uzildi 0.6s ease-in both; }
        .bf-chiziq-y { position: absolute; z-index: 2; left: 50%; top: calc(50% - 30px); transform: translateX(-50%); padding: 1px 8px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; font-family: 'Manrope'; font-size: 12px; font-weight: 800; color: ${T.ink2}; white-space: nowrap; animation: fade-in-up 0.4s ease-out both; }
        .bf-chiziq-y.ok { color: ${T.ok}; border-color: ${fon(T.ok, 0.5)}; }
        .bf-chiziq-y.past { top: calc(50% + 10px); color: ${T.err}; border-color: ${fon(T.err, 0.45)}; }
        .bf-chiziq.tik .bf-chiziq-y { top: 50%; left: calc(50% + 14px); transform: translateY(-50%); }
        .bf-chiziq.tik .bf-chiziq-y.past { left: auto; right: calc(50% + 14px); }
        .bf-chiziq-r { position: absolute; z-index: 2; left: -4px; top: calc(50% - 12px); width: 22px; height: 22px; border-radius: 50%; background: ${T.paper}; border: 1px solid ${T.line}; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; color: ${T.accent}; }
        .bf-chiziq.tik .bf-chiziq-r { left: calc(50% - 11px); top: -4px; }
        .bf-chiziq-r.aylan { animation: bf-aylan 1s linear infinite; }
        @keyframes bf-aylan { to { transform: rotate(360deg); } }
        .bf-kv { position: absolute; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 2px; pointer-events: none; animation-duration: 0.9s; animation-timing-function: ease-in-out; animation-fill-mode: both; }
        .bf-kv.qaytadi { animation-duration: 1.1s; } .bf-kv.sonadi { animation-duration: 1s; }
        .bf-chiziq.yot .bf-kv { top: 50%; transform: translate(-50%, -28%); }
        .bf-chiziq.tik .bf-kv { left: 50%; transform: translate(-50%, -50%); }
        .bf-kv-i { position: relative; display: block; width: 26px; height: 18px; border-radius: 4px; background: ${T.paper}; border: 1.5px solid ${T.accent}; overflow: hidden; flex: none; }
        .bf-kv-i::before { content: ''; position: absolute; left: 50%; top: -9px; width: 15px; height: 15px; border: 1.5px solid ${T.accent}; transform: translateX(-50%) rotate(45deg); }
        .bf-kv.hodisa .bf-kv-i, .bf-konvert .bf-kv-i { background: ${T.accent}; }
        .bf-kv.hodisa .bf-kv-i::before, .bf-konvert .bf-kv-i::before { border-color: ${T.paper}; }
        .bf-konvert.ochiq .bf-kv-i::before { border-color: ${T.ok}; top: 9px; }
        .bf-kv-y { order: -1; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; padding: 1px 6px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; white-space: nowrap; }
        .bf-kv.hodisa .bf-kv-y { color: ${T.accent}; border-color: ${fon(T.accent, 0.45)}; }
        @keyframes bf-kv-x-ab { from { left: 0%; } to { left: 100%; } }
        @keyframes bf-kv-x-ba { from { left: 100%; } to { left: 0%; } }
        @keyframes bf-kv-y-ab { from { top: 0%; } to { top: 100%; } }
        @keyframes bf-kv-y-ba { from { top: 100%; } to { top: 0%; } }
        @keyframes bf-kv-x-qaytadi { 0% { left: 100%; } 40% { left: 72%; } 50% { left: 66%; } 58% { left: 74%; } 66% { left: 66%; } 100% { left: 100%; opacity: 0.2; } }
        @keyframes bf-kv-y-qaytadi { 0% { top: 100%; } 40% { top: 72%; } 50% { top: 66%; } 58% { top: 74%; } 66% { top: 66%; } 100% { top: 100%; opacity: 0.2; } }
        @keyframes bf-kv-x-sonadi { 0% { left: 100%; opacity: 1; } 60% { left: 50%; opacity: 1; } 100% { left: 50%; opacity: 0; } }
        @keyframes bf-kv-y-sonadi { 0% { top: 100%; opacity: 1; } 60% { top: 50%; opacity: 1; } 100% { top: 50%; opacity: 0; } }
        /* Konvert ichi, sahna tugmalari, kod kartalari */
        .bf-qayta, .bf-tokensiz, .bf-token { padding: 8px 14px; border: 1.5px solid ${T.ink}; border-radius: 10px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-size: 13px; font-weight: 800; cursor: pointer; white-space: nowrap; }
        .bf-qayta:disabled, .bf-tokensiz:disabled, .bf-token:disabled { cursor: default; }
        .bf-qayta.xira { opacity: 0.45; }
        .bf-tugmalar { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
        .bf-kod { display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 400px; padding: 10px 12px; border-radius: 12px; background: ${CODE.bg}; color: ${CODE.text}; }
        .bf-kod-y { font-size: 11.5px; color: ${CODE.punct}; }
        .bf-kod-y code { font-family: 'JetBrains Mono', monospace; color: ${CODE.attr}; }
        .bf-kod-p { display: flex; flex-direction: column; overflow-x: auto; }
        .bf-kod-q { display: block; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.6; white-space: pre; padding: 0 4px; border-radius: 4px; transition: background 0.3s; }
        .bf-kod-q.yon { background: ${fon(CODE.attr, 0.16)}; box-shadow: inset 2px 0 0 ${CODE.attr}; } /* qizil fon xato qatordek o'qilardi (F-1006-379) */ .bf-kod-q.xira { background: ${fon(T.paper, 0.1)}; color: ${CODE.comment}; }
        .bf-kod-q.err { background: ${fon(T.err, 0.45)}; } .bf-kod-q.ok { background: ${fon(T.ok, 0.4)}; }
        .bf-kod-iz { font-size: 11.5px; line-height: 1.45; color: ${CODE.punct}; }
        .bf-kod-iz .qcode { background: ${fon(T.paper, 0.12)}; color: ${CODE.attr}; }
        p.bf-reja-past { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        .bf-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; font-size: 13px; color: ${T.ink2}; }
        .bf-ustoz b { color: ${T.ink}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        /* 12-ekran: telefon chapda, sxema jadvali o'ngda */
        .bf-sx-tel .bf-sahna { padding-top: 30px; }
        @keyframes bf-qator { 0% { opacity: 0; transform: translateX(16px); background: ${fon(T.ok, 0.22)}; } 30% { opacity: 1; transform: none; background: ${fon(T.ok, 0.22)}; } 100% { background: transparent; } }
        .bf-sx-alt { display: none; flex-wrap: wrap; gap: 4px 12px; font-size: 12.5px; color: ${T.ink2}; } /* faqat tor ekranda («Kim oladi» ustuni yashirilganda) */
        /* 9-ekran: kod oynasi */
        .bf-vazifa { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .bf-vazifa li { display: flex; gap: 8px; align-items: flex-start; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .bf-vazifa li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.bg}; color: ${T.ink2}; border: 1px solid ${T.line}; }
        .bf-vazifa li.ok i { background: ${T.ok}; color: #fff; border-color: ${T.ok}; }
        .bf-vazifa.ixcham li { font-size: 12.5px; color: ${T.ink2}; }
        .bf-kod-natija { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
        .bf-kyordam { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 10px; }
        .bf-yordam-q { display: flex; flex-direction: column; gap: 6px; }
        .bf-bajardim { display: flex; justify-content: flex-end; margin-top: 12px; }
        .bf-kodoyna { display: flex; flex-direction: column; gap: 12px; }
        .bf-amal { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .bf-amal-t { font-size: 13px; color: ${T.ink2}; }
        .bf-kompil { position: fixed; inset: 0; z-index: 2000; background: ${T.bg}; }
        .bf-no { border: 1.5px solid ${T.line}; border-radius: 14px; overflow: hidden; background: ${T.paper}; transition: opacity 0.3s; }
        .bf-no.xira { opacity: 0.55; }
        .bf-no-bar { display: flex; align-items: center; gap: 5px; padding: 7px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .bf-no-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; }
        .bf-no-bar b { margin-left: 6px; font-size: 11.5px; color: ${T.ink2}; }
        .bf-no-tana { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 14px 16px; }
        .bf-no-p { font-size: 13px; color: ${T.ink2}; }
        .bf-no-h { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; }
        .bf-no-btn { padding: 8px 14px; border: 0; border-radius: 10px; background: ${T.ink}; color: ${T.paper}; font-family: 'Manrope'; font-size: 13px; font-weight: 700; cursor: pointer; }
        .bf-no-btn:disabled { opacity: 0.5; cursor: default; }
        /* 13-ekran: mustaqil ish */
        .bf-ms-chiziq { display: flex; flex-wrap: wrap; gap: 6px; }
        .bf-ms-q { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 4px 10px 4px 4px; border-radius: 999px; border: 1px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope'; font-size: 12px; color: ${T.ink}; cursor: pointer; animation: bf-kirdi 0.35s ease-out both; }
        .bf-ms-q span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .bf-ms-q i { flex: none; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.ok}; color: #fff; }
        .bf-ms-q.joriy { border-color: ${T.accent}; } .bf-ms-q.joriy i { background: ${T.accent}; }
        .bf-ms-q.yangi { padding-right: 4px; cursor: default; }
        .bf-ms-forma { display: flex; flex-direction: column; gap: 12px; }
        .bf-ms-karta { display: flex; flex-direction: column; gap: 8px; max-width: 640px; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 12px 26px -18px rgba(${T.shadowBase},0.4); }
        .bf-ms-maydon { position: relative; display: block; }
        .bf-ms-n { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; pointer-events: none; }
        .bf-ms-maydon .bf-ms-inp { padding-left: 38px; }
        .bf-ms-l { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .bf-ms-l i { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 10.5px; background: ${T.accentSoft}; color: ${T.accent}; }
        .bf-ms-inp { width: 100%; padding: 8px 10px; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.bg}; font-family: 'Manrope'; font-size: 14px; color: ${T.ink}; }
        .bf-ms-inp:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .bf-ms-inp::placeholder { color: ${fon(T.ink, 0.4)}; }
        .bf-ms-tugmalar, .bf-ms-past { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 2px; }
        .bf-ms-yordam { margin-left: auto; }
        .bf-yordam-misol { display: flex; flex-direction: column; gap: 3px; max-width: 640px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px dashed ${fon(T.ink, 0.22)}; font-size: 13px; color: ${T.ink}; }
        .bf-yordam-misol > b { font-size: 11.5px; font-weight: 800; color: ${T.ink2}; margin-bottom: 2px; }
        .bf-yordam-misol > span { display: flex; gap: 8px; align-items: baseline; }
        .bf-yordam-misol i { flex: none; width: 16px; font-style: normal; font-size: 11px; font-weight: 800; color: ${T.accent}; }
        .bf-ms-ix { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 12px; background: ${fon(T.ok, 0.1)}; border: 1px solid ${fon(T.ok, 0.4)}; font-size: 14px; color: ${T.ink}; align-self: flex-start; }
        .bf-ok { font-style: normal; color: ${T.ok}; font-weight: 800; }
        /* Amaliyot bloklari */
        .bf-trek { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .bf-trek-g { display: inline-flex; gap: 6px; padding: 3px; border-radius: 12px; }
        .bf-band { display: block; margin-top: 6px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .bf-ps { display: block; margin: 2px 0; font-size: 13px; line-height: 1.5; }
        .bf-joy-n { margin-left: 6px; font-size: 12px; color: ${fon(T.ink, 0.5)}; font-style: italic; }
        .bf-yordam-btn { margin-top: 6px; }
        .bf-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px dashed ${T.line}; }
        .bf-yordam-s { display: block; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; }
        p.bf-ortda, p.bf-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        p.bf-ulgur { padding: 6px 10px; border-left: 0; border-radius: 10px; background: ${T.bg}; }
        .bf-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 1px 6px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; }
        .bf-a1n { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .bf-fayllar { display: flex; flex-direction: column; gap: 4px; width: 100%; max-width: 320px; padding: 8px 10px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .bf-fayl { display: flex; justify-content: space-between; gap: 10px; font-size: 12px; }
        .bf-fayl code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; overflow-wrap: anywhere; }
        .bf-fayl em { font-style: normal; color: ${T.ok}; font-weight: 700; white-space: nowrap; }
        .bf-brauzer { width: 100%; max-width: 320px; border: 1.5px solid ${T.ink}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .bf-br-bar { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .bf-br-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; }
        .bf-br-bar code { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .bf-br-tana { display: flex; flex-direction: column; gap: 8px; padding: 12px; }
        /* Kartochkalar va yakun */
        .bf-flash { display: flex; flex-direction: column; gap: 10px; }
        /* 14-ekran tartibi: texnik darslar naqshi — oq bo'lak, accent chegara, «⠿» tutqich; uyalar past (F-1006-384; 159/4, 4a-Modul) */
        .bf-tartib .q-dd-slots { gap: 7px; }
        .bf-tartib .q-dd-slot { min-height: 46px; padding: 5px 10px; border-radius: 12px; }
        .bf-tartib .q-dd-pool { gap: 7px; }
        .bf-tartib .q-dd-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px, 1.5vw, 14px); line-height: 1.35; color: ${T.accent}; background: ${T.paper}; border: 2px solid ${T.accent}; border-radius: 10px; padding: 7px 12px 7px 10px; text-align: left; box-shadow: 0 6px 14px -10px ${fon(T.accent, 0.6)}; }
        .bf-tartib .q-dd-chip::before { content: '⠿'; margin-right: 7px; opacity: 0.7; }
        .bf-tartib .q-dd-chip code, .bf-tartib .q-dd-chip .qcode { font-family: 'JetBrains Mono', monospace; font-size: 0.92em; padding: 0 4px; border-radius: 4px; background: ${T.accentSoft}; color: ${T.accent}; }
        .bf-tartib .q-dd-slot .q-dd-chip { min-width: 0; }
        .bf-tartib .q-dd-slot.ok .q-dd-chip { border-color: ${T.ok}; color: ${T.ok}; box-shadow: none; }
        .bf-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: bf-puls 1.8s ease-out .4s 3; } /* 10-Modul naqshi: ingichka chegara, puls 3 marta (F-1006-387) */
        p.bf-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.bf-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .bf-yakun { display: contents; }
        .bf-yakun.yoq-chip .done-chip { display: none; }
        .bf-hw { display: flex; flex-direction: column; gap: 10px; }
        .bf-hw-karta { display: flex; flex-wrap: wrap; gap: 8px 16px; }
        .bf-hw-q { display: inline-flex; gap: 6px; align-items: baseline; font-size: 13px; }
        .bf-hw-q em { font-style: normal; color: ${T.ink2}; } .bf-hw-q b { color: ${T.ink}; }
        .bf-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .bf-hw-qadam li { display: flex; gap: 8px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .bf-hw-qadam li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        .bf-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        /* === 5-dars qo'shimchalari (bf-): jonli xabar, ulanish belgisi o'yin ekranida, boshqa ilova, urinish nuqtalari, xona, buzish yozuvi, chat, mustaqil ish, bloklar === */
        .bf-oyin-tepa { display: flex; align-items: center; justify-content: space-between; gap: 4px; }
        .bf-kory { align-self: flex-start; display: inline-flex; align-items: baseline; gap: 4px; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .bf-kory b { color: ${T.ink}; font-family: 'JetBrains Mono', monospace; }
        .bf-jx-ust { position: absolute; z-index: 5; top: 0; left: -2px; right: -2px; display: flex; flex-direction: column; gap: 4px; pointer-events: none; }
        .bf-jx { display: block; padding: 6px 8px; border-radius: 10px; background: ${T.ink}; color: ${T.paper}; font-size: 10.5px; font-weight: 700; line-height: 1.3; box-shadow: 0 8px 18px -8px rgba(${T.shadowBase},0.6); animation: bf-jx-kir 0.4s cubic-bezier(.3,1.3,.5,1) both; }
        @keyframes bf-jx-kir { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
        .bf-boshqa { flex: 1; display: flex; flex-direction: column; gap: 7px; padding: 4px 2px; border-radius: 12px; background: ${fon(T.ink, 0.06)}; animation: bf-ekran-kir 0.35s ease-out both; }
        @keyframes bf-ekran-kir { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .bf-bo-bar { height: 16px; border-radius: 8px 8px 4px 4px; background: ${fon(T.ink, 0.14)}; }
        .bf-bo-p { width: 70%; height: 22px; border-radius: 10px; background: ${fon(T.ink, 0.12)}; }
        .bf-bo-p.o { align-self: flex-end; width: 56%; background: ${fon(T.ink, 0.2)}; }
        .bf-bo-inp { margin-top: auto; height: 20px; border-radius: 999px; background: ${fon(T.ink, 0.1)}; }
        .bf-karta { display: flex; flex-direction: column; gap: 1px; text-align: left; padding: 6px 8px; border-radius: 9px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 11px; line-height: 1.3; color: ${T.ink2}; }
        .bf-karta:disabled { cursor: default; } .bf-karta.bos { cursor: pointer; border-color: ${fon(T.accent, 0.6)}; background: ${T.paper}; }
        .bf-karta b { font-size: 12px; color: ${T.ink}; }
        .bf-karta-son { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; }
        .bf-versiya { margin-top: 2px; padding: 7px 11px; border: 1.5px dashed ${T.paper}; border-radius: 10px; background: ${fon(T.paper, 0.08)}; color: ${T.paper}; font-family: 'Manrope'; font-size: 12.5px; font-weight: 800; cursor: pointer; }
        .bf-versiya:disabled { cursor: default; opacity: 0.6; }
        .bf-urin { position: absolute; z-index: 2; display: flex; gap: 5px; }
        .bf-chiziq.yot .bf-urin { left: 24px; top: calc(50% - 4px); } .bf-chiziq.tik .bf-urin { top: 24px; left: calc(50% + 10px); flex-direction: column; }
        .bf-urin i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.15)}; animation: bf-urin 0.4s ease-out both; }
        .bf-urin i:nth-child(1) { animation-delay: 0.4s; } .bf-urin i:nth-child(2) { animation-delay: 1.1s; } .bf-urin i:nth-child(3) { animation-delay: 2.2s; }
        @keyframes bf-urin { to { background: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.2)}; } }
        .bf-xona-ust { display: inline-flex; align-items: center; gap: 8px; }
        .bf-xona { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 3px 8px; border-radius: 8px; border: 1px dashed ${fon(T.paper, 0.5)}; transition: background 0.3s; }
        .bf-xona.yon { background: ${fon(T.accent, 0.45)}; }
        .bf-xona .qcode { background: transparent; color: ${T.paper}; padding: 0; }
        .bf-xona b { color: ${T.paper}; }
        .bf-xona-n { display: inline-flex; gap: 4px; min-width: 10px; }
        .bf-nq { display: inline-block; width: 9px; height: 9px; border-radius: 50%; animation: bf-tugil-n 0.4s ease-out both; }
        .bf-nq.t1 { background: ${T.accent}; } .bf-nq.t2 { background: ${T.paper}; }
        .bf-nq.ket { animation: bf-nq-ket 0.8s ease-in both; }
        .bf-nq.tashqi { box-shadow: 0 0 0 3px ${fon(T.accent, 0.25)}; }
        @keyframes bf-tugil-n { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: none; } }
        @keyframes bf-nq-ket { to { opacity: 0; transform: translate(26px, -14px); } }
        .bf-k0 { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .bf-agent { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; max-width: 356px; width: 100%; }
        .bf-puf { display: flex; flex-direction: column; gap: 2px; max-width: 100%; padding: 8px 12px; border-radius: 14px; font-size: 13px; line-height: 1.4; animation: fade-in-up 0.4s ease-out both; }
        .bf-puf b { font-size: 11px; font-weight: 800; }
        .bf-puf.ag { align-self: flex-start; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; border-bottom-left-radius: 4px; }
        .bf-puf.ag b { color: ${T.ink2}; }
        .bf-puf.siz { align-self: flex-end; background: ${T.accentSoft}; color: ${T.ink}; border-bottom-right-radius: 4px; }
        .bf-puf.siz b { color: ${T.accent}; }
        .bf-dava { font-style: normal; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${fon(T.ink, 0.07)}; border-radius: 999px; padding: 2px 10px; }
        .bf-rj { display: flex; flex-direction: column; gap: 8px; padding: 14px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.5); }
        .bf-rj-q { display: grid; grid-template-columns: 22px minmax(0, 1fr) 92px; align-items: center; gap: 10px; font-size: 14px; color: ${T.ink}; animation: fade-in-up 0.45s ease-out both; }
        .bf-rj-q i { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        .bf-rj-q b { font-weight: 700; }
        .bf-rj-f { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; padding: 2px 8px; border-radius: 6px; background: ${T.bg}; animation: fade-in-up 0.45s ease-out 0.7s both; }
        .bf-yb { display: inline-flex; align-items: center; font-style: normal; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 999px; white-space: nowrap; }
        .bf-yb.bosh { height: 20px; min-width: 80px; border: 1.5px dashed ${fon(T.ink, 0.25)}; }
        .bf-yb.buzildi { background: ${fon(T.err, 0.12)}; color: ${T.err}; }
        .bf-yb.buzilmadi { background: ${fon(T.ink, 0.08)}; color: ${T.ink2}; }
        .bf-yb.tuzatildi { background: ${T.accentSoft}; color: ${T.accent}; }
        .bf-yb.takrorlanmadi { background: ${fon(T.ok, 0.13)}; color: ${T.ok}; }
        .bf-yb.takrorlandi { background: ${fon(T.err, 0.12)}; color: ${T.err}; }
        .bf-yozuv { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 12px 26px -18px rgba(${T.shadowBase},0.55); }
        .bf-yz-bosh { display: flex; align-items: center; gap: 8px; font-size: 14.5px; font-weight: 800; color: ${T.ink}; }
        .bf-yz-bosh i { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; background: ${T.accent}; color: #fff; }
        .bf-yz-q { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 8px; align-items: baseline; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .bf-yz-q em { font-style: normal; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; }
        .bf-yz-q:not(.bor) .bf-yz-m { color: ${fon(T.ink, 0.3)}; }
        .bf-yz-q.bor .bf-yz-m { animation: fade-in-up 0.4s ease-out both; }
        .bf-yz-belgilar { display: flex; flex-wrap: wrap; gap: 6px; }
        .bf-yozuv.kichik { padding: 8px 10px; gap: 3px; box-shadow: none; }
        .bf-yozuv.kichik .bf-yz-bosh { font-size: 12.5px; } .bf-yozuv.kichik .bf-yz-bosh i { width: 18px; height: 18px; font-size: 10.5px; }
        .bf-yozuv.kichik .bf-yz-q { grid-template-columns: 82px minmax(0, 1fr); font-size: 11.5px; } .bf-yozuv.kichik .bf-yz-q em { font-size: 10.5px; }
        .bf-yix { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; }
        .bf-yix i { width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${fon(T.ok, 0.14)}; color: ${T.ok}; }
        .bf-yix b { font-weight: 700; color: ${T.ink}; }
        .bf-yix.yangi { animation: bf-yix-tush 1.1s ease-out both; }
        @keyframes bf-yix-tush { 0% { opacity: 0; transform: translateY(26px) scale(0.96); background: ${fon(T.ok, 0.22)}; } 35% { opacity: 1; transform: none; background: ${fon(T.ok, 0.22)}; } 100% { background: ${T.paper}; } }
        .bf-bz { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 18px; align-items: start; }
        .bf-bz-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .bf-bz-tel, .bf-tx-tel { display: flex; justify-content: center; }
        .bf-strip { display: flex; flex-direction: column; gap: 6px; }
        .bf-strip-n { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; padding: 3px 10px 3px 3px; border-radius: 999px; border: 1px solid ${T.line}; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .bf-strip-n i { width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; background: ${T.bg}; }
        .bf-strip-n.joriy { border-color: ${T.accent}; color: ${T.accent}; } .bf-strip-n.joriy i { background: ${T.accent}; color: #fff; }
        .bf-strip:has(.bf-strip-n) { flex-direction: row; flex-wrap: wrap; align-items: center; }
        .bf-strip:has(.bf-strip-n) .bf-yix { padding: 3px 8px; }
        .bf-bz-karta { display: flex; flex-direction: column; gap: 8px; }
        .bf-bz-karta.silk .bf-yozuv { animation: q-silk 0.32s ease-in-out; }
        .bf-kirish { animation: bf-kirish 0.45s cubic-bezier(.3,1.2,.5,1) both; }
        @keyframes bf-kirish { from { opacity: 0; transform: translateX(26px); } to { opacity: 1; transform: none; } }
        .bf-bz-tug { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
        .bf-urinish, .bf-qayta { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border: 1.5px solid ${T.ink}; border-radius: 10px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-size: 13px; font-weight: 800; cursor: pointer; }
        .bf-urinish:disabled, .bf-qayta:disabled { cursor: default; }
        .bf-qayta:disabled:not(.bajarildi) { opacity: 0.5; }
        .bf-qayta i { width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; background: ${T.accent}; color: #fff; }
        .bf-qayta.bajarildi { border-color: ${T.line}; color: ${T.ink2}; } .bf-qayta.bajarildi i { background: ${T.ok}; }
        .bf-shu { font-size: 12px; color: ${T.ink2}; }
        .bf-tx { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 16px; align-items: start; }
        .bf-tx.tugadi { grid-template-columns: minmax(0, 1fr); max-width: 560px; }
        .bf-tx-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .bf-chat { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 14px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .bf-chat-bar { font-size: 11.5px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.05em; }
        .bf-tugmalar { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-start; }
        .bf-yix-ust { display: flex; flex-direction: column; gap: 6px; }
        .bf-kodlar1 { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px; }
        .bf-kodlar1 .bf-kod { max-width: 400px; }
        .bf-tingl { display: inline-flex; align-items: baseline; gap: 6px; padding: 6px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .bf-tingl b { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: ${T.ink}; }
        .bf-kod-q.ikki { animation: bf-ikki 1.4s ease-in-out both; }
        @keyframes bf-ikki { 0%, 40%, 100% { background: transparent; } 15%, 60% { background: ${fon(CODE.attr, 0.3)}; box-shadow: inset 2px 0 0 ${CODE.attr}; } 85% { background: ${fon(CODE.attr, 0.16)}; } }
        .bf-no-belgi { display: inline-flex; padding: 2px 10px; border-radius: 999px; background: ${T.accentSoft}; color: ${T.accent}; font-size: 12px; font-weight: 800; }
        .bf-no-belgi.ok { background: ${fon(T.ok, 0.12)}; color: ${T.ok}; }
        .bf-no-x { display: block; max-width: 320px; padding: 6px 10px; border-radius: 10px; background: ${T.ink}; color: ${T.paper}; font-size: 12px; }
        .bf-no-tugmalar { display: flex; flex-wrap: wrap; gap: 6px; }
        .bf-no-btn.uz { background: ${T.ink2}; } .bf-no-btn.qa { background: ${T.ok}; } .bf-no-btn.bo { background: ${T.accent}; }
        .bf-ms-kt { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .bf-ms-chekka { display: flex; flex-direction: column; gap: 6px; }
        .bf-ms-tanlov { display: flex; flex-wrap: wrap; gap: 6px; }
        textarea.bf-ms-inp { resize: vertical; line-height: 1.45; }
        .bf-ms-maydon:has(textarea) .bf-ms-n { top: 18px; }
        .bf-ms-q.ok i { background: ${T.ok}; color: #fff; }
        .bf-ms-q:not(.ok):not(.joriy) i { background: ${T.bg}; color: ${T.ink2}; }
        .bf-ms-q.yangi { animation: bf-yix-tush 1.1s ease-out both; }
        .bf-ms-q:disabled { cursor: default; }
        .bf-blok { display: contents; }
        .bf-qulf .q-blok-q.joriy .q-blok-tana > .q-btn { opacity: 0.45; pointer-events: none; }
        .bf-yf { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
        .bf-yf-oklar { display: flex; flex-direction: column; gap: 6px; }
        .bf-yf-ok { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; text-align: left; padding: 6px 10px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope'; font-size: 13px; cursor: pointer; }
        .bf-yf-ok:hover { border-color: ${T.ok}; }
        .bf-yf-ok i { font-style: normal; font-weight: 800; color: ${T.ok}; } .bf-yf-ok b { color: ${T.ink}; }
        .bf-yf-ok.yangi { animation: bf-yix-tush 1.1s ease-out both; }
        .bf-yf-karta { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.35)}; box-shadow: 0 12px 26px -18px rgba(${T.shadowBase},0.55); }
        .bf-yf-sar { display: flex; align-items: center; gap: 8px; font-size: 14px; color: ${T.ink}; }
        .bf-yf-sar i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; color: ${T.accent}; }
        .bf-yf-m { display: flex; flex-direction: column; gap: 3px; }
        .bf-yf-m em { font-style: normal; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; }
        .bf-yf-inp { width: 100%; padding: 7px 10px; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.bg}; font-family: 'Manrope'; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; resize: vertical; }
        .bf-yf-inp:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .bf-yf-inp::placeholder { color: ${fon(T.ink, 0.4)}; }
        .bf-yf-tug { display: flex; flex-wrap: wrap; gap: 8px; }
        .bf-tz { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .bf-tz-q { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .bf-tz-q b { font-size: 13px; color: ${T.ink}; margin-right: auto; }
        .bf-tz-q .bf-chorla { display: flex; flex-wrap: wrap; gap: 6px; }
        .bf-kichik-tel { zoom: 0.72; }
        .bf-a1n-k { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .bf-a2n { display: flex; flex-direction: column; gap: 10px; }
        .bf-karta-w { display: flex; flex-direction: column; gap: 1px; padding: 6px 8px; border-radius: 9px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11px; color: ${T.ink2}; }
        .bf-karta-w b { font-size: 12px; color: ${T.ink}; }
        .bf-gh { border: 1.5px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .bf-gh-q { display: block; padding: 8px 10px; font-size: 12px; color: ${T.ink2}; }
        .bf-gh-q code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; }
        .rc-izoh { font-size: 13px; color: ${T.ink2}; }
        @media (max-width: 760px) { .bf-bz, .bf-tx { grid-template-columns: minmax(0, 1fr); justify-items: center; } .bf-bz-ong, .bf-tx-ong { width: 100%; } .bf-yz-q { grid-template-columns: minmax(0, 1fr); gap: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .bf-jx, .bf-boshqa, .bf-urin i, .bf-nq, .bf-nq.ket, .bf-puf, .bf-rj-q, .bf-rj-f, .bf-yz-q.bor .bf-yz-m, .bf-yix.yangi, .bf-kirish, .bf-kod-q.ikki, .bf-ms-q.yangi, .bf-yf-ok.yangi, .bf-bz-karta.silk .bf-yozuv { animation: none !important; }
          .bf-urin i { background: ${T.accent}; } .bf-nq.ket { display: none; }
        }
        /* ⛶ kattalashtirish — skeletda tushib qolgan qoida (SABOQ 38) */
        /* ikki klassli selektor: keyingi «.zoomable position relative» qoidasi oynani joyidan siljitib, ekran chetidan kesardi (F-1006-386) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(920px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        /* ⛶ oynasi ekran markazida: ota-blokdagi animatsiya/transform «position: fixed»ni o'ziga bog'lab, oynani siljitib kesardi (A2 natijasi — F-1006-386) */
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 900px) {
        }
        @media (max-width: 640px) { .bf-sahna { padding-top: 60px; } .bf-sx-tel .bf-sahna { padding-top: 60px; } }
        @media (max-width: 400px) {
          .bf-sahna.tik.ikki { grid-template-columns: 168px 168px; column-gap: 6px; }
          .bf-sahna.tik.ikki .bf-tel-ust, .bf-sahna.tik.ikki .bf-telefon { width: 168px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bf-halqa, .bf-k.faol .q-variant, .bf-halqa-g .q-chip, .bf-chorla > .q-chip, .bf-flash.yangi .fc-card .fc-front { animation: none !important; }
          .bf-kv { display: none !important; }
          .bf-pop, .bf-son.yangi, .bf-doiralar i.yangi, .bf-chiziq-i, .bf-chiziq-i::after, .bf-chiziq-r.aylan, .bf-belgi, .bf-belgi-n, .bf-tel-ekran, .bf-backend.tugildi, .bf-karta.yangi, .bf-sx-r.yangi, .bf-rd-r, .bf-ms-q, .bf-konvert, .bf-readme, .bf-eski, .bf-chiziq-y { animation: none !important; transition: none !important; }
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
