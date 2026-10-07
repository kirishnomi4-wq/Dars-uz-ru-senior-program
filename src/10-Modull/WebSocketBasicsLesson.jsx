import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 12-Modul · 2-dars «WebSocket: ekran o'zi yangilanadigan ulanish» (m10-02, TEX — modulning texnik cho'qqisi). Skeletdan (src/skelet/NamunaDars.jsx), MD v3 bo'yicha:
//   feedback/F-1006-12modul/02-WebSocketBasics-v3.md + 02-FILTR.md (MD — manba-haqiqat). 20 ekran:
//   0 QKirish · 1 QReja · 2, 4, 5, 7, 10, 12 QTushuncha · 3, 6, 8, 11 test (QTest) · 9 QKod (HtmlCompiler) · 13 QMustaqil · 14 QTartib (final) ·
//   15, 16 amaliyot bloki (QBlok + ScreenBlok) · 17 podium · 18 kartochkalar (alohida ekran) · 19 QYakun.
// Bitta vizual — «ikki telefon va Backend» sahnasi (SAHNA, NAMUNA_OYIN → Sahna): chapda «1-telefon · siz», o'rtada Backend («Database: N»), o'ngda «2-telefon · boshqa o'yinchi».
// Saqlanadi: pm-m10d2-sxema (3-dars o'qiydi) · pm-m10d2-code. O'qiydi: pm-m9d8-platforma (trek), pm-m9d5-prd (funksiyalar) — kalit yo'q bo'lsa ham ekran ishlaydi.
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

const LESSON_META = { lessonId: 'm10-02-v1', lessonTitle: { uz: "WebSocket: ekran o'zi yangilanadigan ulanish", ru: 'WebSocket: соединение, при котором экран обновляется сам' } };
// 20 ekran · oqim: kirish → reja → (tushuncha → test)× → kod → tushuncha → test → sxema → mustaqil ish → final → 2 amaliyot bloki → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'doimiy ulanish', ru: 'постоянное соединение' }, l: 6, tp: 20, s: 13, d: 6 },
  { t: { uz: 'hodisa', ru: 'событие' }, l: 72, tp: 14, s: 12, d: 7.5 },
  { t: 'socket.io', l: 20, tp: 72, s: 12, d: 8.5 },
  { t: { uz: 'sxema', ru: 'схема' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD ✔: s3 B · s6 D · s8 A · s11 C · s14 — final (picked 0/1 sentinel). `practice: -1` — sentinel (QKod, mustaqil ish, bloklar).
const INLINE_KEYS = { s3: 1, s6: 3, s8: 0, s11: 2, s14: 0, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI). S-026: kod qatori bor joyda kod, qolganida raqam.
const rcKod = (s) => <code className="qcode">{s}</code>;
const RECAPS = {
  3: {
    title: { uz: "Backend faqat so'rovga javob beradi", ru: 'Backend отвечает только на запрос' },
    cards: [
      { ic: '1', h: { uz: "Ilova so'raydi — Backend javob beradi.", ru: 'Приложение спрашивает — Backend отвечает.' } },
      { ic: '2', h: { uz: "So'rov bo'lmasa, Backend'dan ilovaga yo'l ochilmaydi.", ru: 'Без запроса путь от Backend к приложению не открывается.' } },
      { ic: '3', h: { uz: "Shuning uchun 11-Modulda son ekran ochilganda va pastga tortganda yangilanadi.", ru: 'Поэтому в 11-м модуле число обновляется при открытии экрана и при потягивании вниз.' }, ask: { uz: "Ekran bir soat ochiq tursa-yu, hech kim uni tortmasa, son nima bo'ladi?", ru: 'Если экран открыт час и никто его не тянет, что будет с числом?' } }
    ]
  },
  6: {
    title: { uz: "Hodisa aytadi, ilova so'raydi", ru: 'Событие сообщает, приложение спрашивает' },
    cards: [
      { ic: null, h: { uz: 'Hodisaning nomi bor', ru: 'У события есть название' }, vis: rcKod('oyin-ozgardi') },
      { ic: null, h: { uz: "Ma'lumotida ikki maydon", ru: 'В данных два поля' }, vis: rcKod("{ oyinId: 1, sabab: 'qoshildi' }") },
      { ic: null, h: { uz: "Yangi sonni ilova qayta so'raydi", ru: 'Новое число приложение запрашивает заново' }, vis: rcKod('GET /oyinlar'), ask: { uz: "Hodisa sonning o'zini olib kelsa, nima noqulay bo'lishi mumkin edi?", ru: 'Что могло бы быть неудобно, если бы событие приносило само число?' } }
    ]
  },
  8: {
    title: { uz: 'Ulanish token bilan', ru: 'Соединение с токеном' },
    cards: [
      { ic: null, h: { uz: 'Ilova ulanayotganda tokenni yuboradi', ru: 'Приложение при подключении отправляет токен' }, vis: rcKod('auth: { token }') },
      { ic: null, h: { uz: 'Backend tokenni tekshiradi', ru: 'Backend проверяет токен' }, vis: rcKod('handleConnection(ulanish)') },
      { ic: null, h: { uz: "Token yaroqsiz bo'lsa, ulanish yopiladi", ru: 'Если токен недействителен, соединение закрывается' }, vis: rcKod('ulanish.disconnect()'), ask: { uz: 'Token tekshirilmasa, kimlar ulana olardi?', ru: 'Если токен не проверять, кто смог бы подключиться?' } }
    ]
  },
  11: {
    title: { uz: 'Uch ulanish holati', ru: 'Три состояния соединения' },
    cards: [
      { ic: '1', h: { uz: 'Ulangan — hodisalar keladi.', ru: 'Подключено — события приходят.' } },
      { ic: '2', h: { uz: "Ulanmoqda — ulanish yo'q, ilova o'zi ulanishga urinmoqda; shu payt bo'lgan hodisalar kelmaydi.", ru: 'Подключается — соединения нет, приложение само пытается подключиться; события в это время не приходят.' } },
      { ic: '3', h: { uz: 'Ulanmagan — ilova urinmayapti.', ru: 'Не подключено — приложение не пытается.' }, ask: { uz: "Belgi yana «Ulangan» bo'ldi. Ekrandagi son yangimi — buni qanday bilasiz?", ru: 'Значок снова «Подключено». Новое ли число на экране — как это узнать?' } }
    ]
  },
  14: {
    title: { uz: "Hodisa yo'li", ru: 'Путь события' },
    cards: [
      { ic: null, h: { uz: "1 · Ulanish · 2 · Bosish · 3 · Database'ga yozuv", ru: '1 · Соединение · 2 · Нажатие · 3 · Запись в Database' } },
      { ic: null, h: { uz: '4 · Backend hodisa yuboradi', ru: '4 · Backend отправляет событие' }, vis: rcKod('oyin-ozgardi') },
      { ic: null, h: { uz: "5 · Ilova qayta so'raydi · 6 · «9 / 10» ko'rinadi", ru: '5 · Приложение запрашивает заново · 6 · видно «9 / 10»' }, ask: { uz: "Backend hodisani Database'ga yozishdan oldin yuborsa, ilova qaysi sonni oladi?", ru: 'Если Backend отправит событие до записи в Database, какое число получит приложение?' } }
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

// ===== BITTA VIZUAL — «ikki telefon va Backend» sahnasi (163, 180): bitta manba SAHNA + NAMUNA_OYIN, har ekran Sahna'ni ishlatadi (tayanch 9.16) =====
// qolip-maket: ws-qoshil ws-yubor ws-tort ws-ikon ws-konvert ws-qayta ws-tokensiz ws-token ws-samolyot ws-kalit ws-sabab ws-no-btn ws-ms-q
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const halqa = (on) => (on ? 'ws-halqa' : undefined);
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
  tash: { uz: 'Kelishini tasdiqladi:', ru: 'Подтвердили приход:' },
  navbat: { uz: 'Navbatda:', ru: 'В очереди:' },
  yangiKarta: { uz: 'Yakshanba, 18:00 · Maktab maydoni · 0 / 10', ru: 'Воскресенье, 18:00 · Школьное поле · 0 / 10' },
  eski: { uz: 'eski', ru: 'старое' },
  eskiMumkin: { uz: "eski bo'lishi mumkin", ru: 'может быть старым' },
  ochiq: { uz: 'ochiq', ru: 'открыто' },
  kelmadi: { uz: 'kelmadi', ru: 'не дошло' },
  ochilmagan: { uz: 'ochilmagan', ru: 'не открыт' },
  tort: { uz: '↓ Pastga torting', ru: '↓ Потяните вниз' },
  kv: { sorov: { uz: "so'rov", ru: 'запрос' }, javob: { uz: 'javob', ru: 'ответ' }, hodisa: 'oyin-ozgardi' }
};
// Uch ulanish holati — 1, 7, 10, 15-ekranlarda bitta komponent (UlanishBelgisi); rang faqat holat (D3)
const BELGILAR = {
  ulangan: { t: { uz: 'Ulangan', ru: 'Подключено' }, rang: 'ok' },
  ulanmoqda: { t: { uz: 'Ulanmoqda…', ru: 'Подключается…' }, rang: 'accent' },
  ulanmagan: { t: { uz: 'Ulanmagan', ru: 'Не подключено' }, rang: 'ink2' }
};
// Mentor sxemasi — besh qator (A-bo'lim 4, tayanch 1.2): 12-ekran kartalari, A2 kutilgan natija, kartochka
const MENTOR_SXEMA = [
  { id: 'q1', nuqta: { uz: "«8 / 10» va qo'shilganlar ro'yxati", ru: '«8 / 10» и список присоединившихся' }, kimNima: { uz: "o'yinchi «Qo'shilaman» ni bosadi", ru: 'игрок нажимает «Qo\'shilaman»' }, sabab: 'qoshildi', ekranda: { uz: "«8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi", ru: '«8 / 10» → «9 / 10», в списке новый игрок' }, kor: 'son', oldin: 8, keyin: 9 },
  { id: 'q2', nuqta: { uz: "«8 / 10» va qo'shilganlar ro'yxati", ru: '«8 / 10» и список присоединившихся' }, kimNima: { uz: "o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa)", ru: 'игрок выходит из игры (если заходит следующий из очереди — то же событие)' }, sabab: 'chiqdi', ekranda: { uz: "son va ro'yxat yangilanadi", ru: 'число и список обновляются' }, kor: 'son', oldin: 9, keyin: 8 },
  { id: 'q3', nuqta: { uz: '«Kelaman» belgilari', ru: 'отметки «Kelaman»' }, kimNima: { uz: "o'yinchi «Kelaman» ni bosadi", ru: 'игрок нажимает «Kelaman»' }, sabab: 'tasdiqladi', ekranda: { uz: '«Kelishini tasdiqladi: 7 / 9» → «8 / 9»', ru: '«Kelishini tasdiqladi: 7 / 9» → «8 / 9»' }, kor: 'tash', oldin: 7, keyin: 8 },
  { id: 'q4', nuqta: { uz: '«Navbatda: N»', ru: '«Navbatda: N»' }, kimNima: { uz: "o'yinchi navbatga yoziladi", ru: 'игрок записывается в очередь' }, sabab: 'navbatga-yozildi', ekranda: { uz: '«Navbatda: 1»', ru: '«Navbatda: 1»' }, kor: 'navbat', oldin: 0, keyin: 1 },
  { id: 'q5', nuqta: { uz: "o'yinlar ro'yxati", ru: 'список игр' }, kimNima: { uz: "tashkilotchi o'yin e'lon qiladi", ru: 'организатор объявляет игру' }, sabab: 'elon-berildi', ekranda: { uz: "ro'yxatda yangi karta", ru: 'в списке новая карточка' }, kor: 'karta', oldin: 0, keyin: 1 }
];
const SABABLAR = ['qoshildi', 'chiqdi', 'tasdiqladi', 'navbatga-yozildi', 'elon-berildi'];
const KIM_OLADI = { uz: 'hamma ulangan ilova', ru: 'все подключённые приложения' };
// Hodisa yo'li — 6 bo'lak (14-ekran final)
const HODISA_YOLI = [
  { id: 'ulanadi', label: { uz: "Ilova Backend'ga token bilan ulanadi", ru: 'Приложение подключается к Backend с токеном' } },
  { id: 'bosadi', label: { uz: "Boshqa o'yinchi «Qo'shilaman» ni bosadi", ru: 'Другой игрок нажимает «Qo\'shilaman»' } },
  { id: 'yozadi', label: { uz: "Backend qo'shilishni Database'ga yozib tugatadi", ru: 'Backend заканчивает запись присоединения в Database' } },
  { id: 'yuboradi', label: { uz: 'Backend `oyin-ozgardi` hodisasini yuboradi', ru: 'Backend отправляет событие `oyin-ozgardi`' } },
  { id: 'soraydi', label: { uz: "Ilova `GET /oyinlar` dan qayta so'raydi", ru: 'Приложение заново запрашивает `GET /oyinlar`' } },
  { id: 'korinadi', label: { uz: 'Ekraningizda «9 / 10» ko\'rinadi', ru: 'На вашем экране видно «9 / 10»' } }
];

const UlanishBelgisi = ({ holat }) => {
  if (!holat) return null;
  const b = BELGILAR[holat];
  return <span key={holat} className={cx('ws-belgi', holat)}><i className="ws-belgi-n" />{b && tr(b.t)}</span>;
};
const SamolyotIc = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5l8 2.5z" fill="currentColor" /></svg>
);
const Qadam = ({ q }) => (q ? <span className="ws-qadam fade-step"><i>{q.n}</i>{tr(q.t)}</span> : null);

// Telefon ichidagi ekranlar: oyin · oyinlar · bosh (bosh ekran, ilova belgisi)
const TelEkran = ({ t }) => {
  const ekran = t.ekran || 'oyin';
  if (ekran === 'bosh') return (
    <div className="ws-bosh">
      <button type="button" className={cx('ws-ikon', halqa(t.ikonHalqa))} disabled={!t.onIkon} onClick={t.onIkon}>
        <span className="ws-ikon-sh" aria-hidden="true" /><span className="ws-ikon-t">{SAHNA.nom}</span>
      </button>
    </div>
  );
  if (ekran === 'oyinlar') return (
    <div className="ws-oyinlar">
      <div className="ws-ol-bosh"><b className="ws-ol-sar">{tr(SAHNA.oyinlar)}</b><UlanishBelgisi holat={t.belgi} /></div>
      <span className="ws-kun">{tr(SAHNA.kun)}</span>
      <div className={cx('ws-karta', halqa(t.kartaHalqa), t.joy === 'karta' && 'ws-joy')}>
        <b>{tr(NAMUNA_OYIN.vaqt)}</b><span>{tr(NAMUNA_OYIN.joy)}</span>
        <span className="ws-karta-son"><b key={t.son} className={cx(t.sonYangi && 'ws-pop')}>{t.son ?? 8}</b> / 10{t.eski && <em className="ws-eski">{tr(t.eski)}</em>}</span>
      </div>
      {t.yangiKarta && <div className="ws-karta yangi"><span>{tr(SAHNA.yangiKarta)}</span></div>}
    </div>
  );
  const son = t.son;
  return (
    <div className="ws-oyin">
      <span className="ws-oyin-orqa">{tr(SAHNA.orqa)}</span>
      <b className="ws-oyin-sar">{tr(NAMUNA_OYIN.vaqt)}</b>
      <span className="ws-oyin-joy">{tr(NAMUNA_OYIN.joy)}</span>
      <span className={cx('ws-hisob', halqa(t.sonHalqa), t.joy === 'son' && 'ws-joy')}><b key={String(son)} className={cx('ws-son', t.sonYangi && 'yangi')}>{son == null ? '…' : son}</b> / 10{t.eski && <em className="ws-eski">{tr(t.eski)}</em>}</span>
      <span className="ws-doiralar" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} className={cx(son != null && i < son && 'bor', t.sonYangi && son != null && i === son - 1 && 'yangi')} />)}</span>
      {t.tash != null && <span className={cx('ws-tash', halqa(t.tashHalqa), t.joy === 'tash' && 'ws-joy')}>{tr(SAHNA.tash)} <b key={t.tash} className={cx(t.tashYangi && 'ws-pop')}>{t.tash}</b> / 9</span>}
      {t.navbat != null && <span className={cx('ws-tash', halqa(t.navbatHalqa), t.joy === 'navbat' && 'ws-joy')}>{tr(SAHNA.navbat)} <b key={t.navbat} className={cx(t.navbatYangi && 'ws-pop')}>{t.navbat}</b></span>}
      {t.qoshilYoq ? null : <button type="button" className={cx('ws-qoshil', t.qoshildi && 'off', halqa(t.qoshilHalqa))} disabled={!t.onQoshil || t.qoshildi} onClick={t.onQoshil}>{tr(t.qoshildi ? SAHNA.qoshildi : SAHNA.qoshil)}</button>}
    </div>
  );
};
// Telefon — o'lchami barqaror 172×272 (SABOQ 22), yorliq ramka ustida (SABOQ 23), nom o'z rangida (logotip yo'q, D4).
// Pastga tortish (2-ekran): sudrash — pointer events, 60 px dan oshsa; klaviatura va bosish — «↓ Pastga torting» tugmasi (11-Modul 8-dars naqshi).
// Tugma ustida pointer capture olinmaydi: aks holda click tugmaga yetmaydi va bosish ishlamaydi (F-1006-377 — o'quvchi 2-ekranda to'xtab qolgan).
const Telefon = ({ no, t = {} }) => {
  const [dy, setDy] = useState(0);
  const dyRef = useRef(0);
  const bosh = useRef(null);
  const pd = (e) => { if (!t.onTort || (e.target.closest && e.target.closest('button'))) return; bosh.current = e.clientY; dyRef.current = 0; try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* eski brauzer */ } };
  const pm = (e) => { if (bosh.current == null) return; const d = Math.max(0, Math.min(90, e.clientY - bosh.current)); dyRef.current = d; setDy(d); };
  const pu = () => { if (bosh.current == null) return; bosh.current = null; const d = dyRef.current; dyRef.current = 0; setDy(0); if (d > 60 && t.onTort) t.onTort(); };
  return (
    <div className="ws-tel-ust">
      {t.tex ? <span className="ws-tel-yorliq tex">{t.tex}</span> : <span className={cx('ws-tel-yorliq', no === 1 ? 'b1' : 'b2')}>{tr(no === 1 ? SAHNA.t1 : SAHNA.t2)}</span>}
      <div className={cx('ws-telefon', t.onTort && 'tortiladi')} onPointerDown={pd} onPointerMove={pm} onPointerUp={pu} onPointerCancel={pu}>
        <div className="ws-tel-bar">
          <span className="ws-tel-nom">{SAHNA.nom}</span>
          {t.samolyot !== undefined && (
            <button type="button" className={cx('ws-samolyot', t.samolyot && 'on', halqa(t.samolyotHalqa))} disabled={!t.onSamolyot} onClick={t.onSamolyot}
              aria-label={tr({ uz: 'Uchish rejimi', ru: 'Режим полёта' })} aria-pressed={!!t.samolyot}><SamolyotIc /></button>
          )}
        </div>
        {t.onTort && <button type="button" className={cx('ws-tort', halqa(t.tortHalqa))} onClick={t.onTort}>{tr(SAHNA.tort)}</button>}
        <div className="ws-tel-ekran" key={t.ekran || 'oyin'} style={dy ? { transform: `translateY(${Math.round(dy * 0.5)}px)` } : undefined}>
          {dy > 0 && <span className={cx('ws-tort-ic', dy > 60 && 'tayyor')} aria-hidden="true">↻</span>}
          <TelEkran t={t} />
        </div>
      </div>
      {t.konvert && (
        <button type="button" className={cx('ws-konvert', t.konvert === 'ochiq' && 'ochiq', halqa(t.konvertHalqa))} disabled={!t.onKonvert} onClick={t.onKonvert}
          aria-label={tr({ uz: 'Konvert', ru: 'Конверт' })}>
          <i className="ws-kv-i" />{t.konvert === 'yopiq' && <><span className="ws-konvert-n" /><span className="ws-konvert-y">{tr(SAHNA.ochilmagan)}</span></>}
        </button>
      )}
      <Qadam q={t.qadam} />
      {t.osti}
    </div>
  );
};
const BackendTugun = ({ b = {} }) => (
  <div className="ws-be-ust">
    <div className="ws-be-joy">
      <div className={cx('ws-backend', b.yonadi && 'yon', b.tugildi && 'tugildi', b.ok && 'ok', b.xato && 'xato')}>
        <span className="ws-be-nom">{SAHNA.backend}</span>
        {b.db != null && <span className={cx('ws-db', b.dbYon && 'yon')}>Database: <b key={b.db} className={cx(b.dbYangi && 'ws-pop')}>{b.db}</b></span>}
        {b.ichi}
        {b.qator && <span className="ws-be-qator fade-step">{tr(b.qator)}</span>}
      </div>
    </div>
    <Qadam q={b.qadam} />
    {b.osti}
  </div>
);
// Konvert chiziq bo'ylab uchadi: yon 'be' — telefondan Backend'ga, 'tel' — Backend'dan telefonga; toxta 'qaytadi' (yo'l yo'q) · 'sonadi' (uzilgan joyda)
const Konvert = ({ k, no, tik }) => {
  if (!k) return null;
  const telBosh = tik || no === 1;
  const ab = telBosh ? k.yon === 'be' : k.yon !== 'be';
  const anim = `ws-kv-${tik ? 'y' : 'x'}-${k.toxta || (ab ? 'ab' : 'ba')}`;
  const y = k.yorliq !== undefined ? k.yorliq : SAHNA.kv[k.tur];
  return <span className={cx('ws-kv', k.tur, k.toxta)} style={{ animationName: anim }}><i className="ws-kv-i" />{y && <b className="ws-kv-y">{tr(y)}</b>}</span>;
};
// Chiziq holatlari: yoq · savol · sondi · bir (bir marta yonib so'nadi) · sorov · chizil · ochiq · uzildi · uzilgan · tiklan · yopiq
const Chiziq = ({ holat = 'yoq', no, tik, k, yorliq }) => (
  <div className={cx('ws-chiziq', tik ? 'tik' : 'yot', `n${no}`, `h-${holat}`)}>
    <span className="ws-chiziq-i" key={holat} />
    {holat === 'savol' && <b className="ws-chiziq-y">?</b>}
    {holat === 'ochiq' && <b className="ws-chiziq-y ok">{tr(SAHNA.ochiq)}</b>}
    {(holat === 'uzilgan' || holat === 'tiklan') && <b className={cx('ws-chiziq-r', holat === 'tiklan' && 'aylan')} aria-hidden="true">↻</b>}
    {yorliq && <b className="ws-chiziq-y past">{tr(yorliq)}</b>}
    <Konvert key={k ? k.id : 'yoq'} k={k} no={no} tik={tik} />
  </div>
);
// Sahna: chapda «1-telefon · siz», o'rtada Backend, o'ngda «2-telefon · boshqa o'yinchi» (bitta telefonli ekranda — telefon va Backend).
// ixcham (yoki telefon) — telefonlar tepada yonma-yon, Backend pastda, chiziqlar tik.
const Sahna = ({ t1, t2, be, c1, c2, k1, k2, y1, ixcham }) => {
  const mob = useIsMobile(640);
  const tik = !!(ixcham || mob);
  const ikki = !!t2;
  return (
    <div className={cx('ws-sahna', tik ? 'tik' : 'yot', ikki ? 'ikki' : 'bir', !be && 'bes')}>
      <div className="ws-s-t1"><Telefon no={1} t={t1} /></div>
      {be && <div className="ws-s-c1"><Chiziq holat={c1} no={1} tik={tik} k={k1} yorliq={y1} /></div>}
      {be && <div className="ws-s-be"><BackendTugun b={be} /></div>}
      {ikki && be && <div className="ws-s-c2"><Chiziq holat={c2} no={2} tik={tik} k={k2} /></div>}
      {ikki && <div className="ws-s-t2"><Telefon no={2} t={t2} /></div>}
    </div>
  );
};

// Ballsiz bashorat: tanlangach ixcham qator bo'lib natijagacha turadi (SABOQ 11); har chipning o'z yengil chegarasi, guruh ramkasi yo'q (F-1006-376)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="ws-halqa-g"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="ws-bash-ix fade-step"><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosaning birinchi, kichik qatori (F-1006-380): tanlangan javob qaytarilmaydi (u tepada turibdi)
const Natija = ({ togri, haqiqat, haqYorliq }) => (togri
  ? <span className="ws-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="ws-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr(haqYorliq || { uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
// Bitta yashil quti: taxmin qatori · xulosa · izoh (F-1006-380/382 — izoh alohida kulrang qator bo'lib osilmaydi)
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="ws-x-m">{matn}</span>{izoh && <span className="ws-x-iz">{izoh}</span>}</>;
const navYorliq = (taxmin, q, jami, qadamY, done) => (done ? { uz: 'Davom etish', ru: 'Продолжить' }
  : !taxmin ? BASH_YORLIQ
    : { uz: `${qadamY.uz} (${q}/${jami})`, ru: `${qadamY.ru} (${q}/${jami})` });
const QADAMLAR_Y = { uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' };
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };

// ===== SCREEN 0 — KIRISH (QKirish: ikki telefon; «Qo'shilaman» → 2-telefonda «9 / 10», 1-telefonda «8 / 10» «eski»; javobdan keyin Backend tug'iladi) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Backend yangi sonni hali bilmaydi', ru: 'Backend ещё не знает новое число' } },
  { id: 'b', label: { uz: "Ilova Backend'dan qayta so'ramadi", ru: 'Приложение не запросило у Backend заново' } },
  { id: 'c', label: { uz: 'Ikkinchi telefon sizga yubormadi', ru: 'Второй телефон вам не отправил' } }
];
const HOOK_JAVOB = {
  a: { uz: <><b>Qiziq fikr!</b> Backend biladi: qo'shilish Database'ga yozildi. Ilova esa undan hali qayta so'ramadi.</>, ru: <><b>Интересная мысль!</b> Backend знает: присоединение записано в Database. А приложение ещё не запросило заново.</> },
  b: { uz: <><b>Aynan!</b> 11-Modulda ilova so'raganda yangilanadi: ekran ochilganda va pastga tortib yangilaganda.</>, ru: <><b>Именно!</b> В 11-м модуле приложение обновляется, когда запрашивает: при открытии экрана и при потягивании вниз.</> },
  c: { uz: <><b>Qiziq fikr!</b> Telefonlar bir-birini tanimaydi: ikkalasi ham sonni faqat Backend'dan so'raydi.</>, ru: <><b>Интересная мысль!</b> Телефоны не знают друг друга: оба запрашивают число только у Backend.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [bosildi, setBosildi] = useState(avval);
  const [eski, setEski] = useState(avval);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const ketma = useKetma();
  const qoshil = () => { if (bosildi) return; setBosildi(true); setSc(n => n + 1); ketma([[2000, () => setEski(true)]]); };
  const pick = (v) => { if (picked !== null || !eski) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const javob = picked !== null;
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!javob} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('ws-k', eski && !javob && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Sizning ekraningizda nega hali <span className="italic" style={{ color: T.accent }}>«8 / 10»</span> turibdi?</>, ru: <>Почему на вашем экране всё ещё <span className="italic" style={{ color: T.accent }}>«8 / 10»</span>?</> })}
          mentor={<Mentor>{eski
            ? tr({ uz: "Endi o'ngdagi javoblardan birini tanlang.", ru: 'Теперь выберите один из ответов справа.' })
            : tr({ uz: "Maydon Jamoa 11-Modul oxiridagi holatda: ikkinchi telefonda «Qo'shilaman» ni bosing va birinchisiga qarang.", ru: 'Maydon Jamoa в состоянии конца 11-го модуля: нажмите «Qo\'shilaman» на втором телефоне и посмотрите на первый.' })}</Mentor>}
          maket={<Sahna ixcham
            t1={{ son: 8, eski: eski && SAHNA.eski, qoshilYoq: false }}
            t2={{ son: bosildi ? 9 : 8, sonYangi: bosildi, qoshildi: bosildi, onQoshil: qoshil, qoshilHalqa: !bosildi }}
            be={javob ? { db: 9, tugildi: true } : null} c1={javob ? 'savol' : 'yoq'} c2={javob ? 'bir' : 'yoq'} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={!eski}
          javob={javob && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda dars oxiridagi holat — belgi «Ulangan», ochiq chiziq bir marta chiziladi; o'ngda «01 · matn · teg») =====
const REJA = [
  { t: { uz: "Ekran nega o'zi yangilanmasligini ko'rish", ru: 'Увидеть, почему экран не обновляется сам' }, teg: { uz: "so'rov", ru: 'запрос' } },
  { t: { uz: 'Ochiq turadigan ulanish va undan keladigan xabar', ru: 'Открытое соединение и сообщение по нему' }, teg: { uz: 'doimiy ulanish, hodisalar', ru: 'постоянное соединение, события' } },
  { t: { uz: "Ilovani Backend'ga ulash, belgini tekshirish", ru: 'Подключить приложение к Backend, проверить значок' }, teg: { uz: 'ulanish', ru: 'соединение' } },
  { t: { uz: 'Mahsulotingiz uchun sxema yozish', ru: 'Написать схему для вашего продукта' }, teg: { uz: 'real vaqt oqimi sxemasi', ru: 'схема потока реального времени' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const isMentor = useMentorLive();
  const [c1, setC1] = useState('yoq');
  const [belgi, setBelgi] = useState('ulanmoqda');
  const ketma = useKetma();
  useEffect(() => { ketma([[500, () => setC1('chizil')], [900, () => { setC1('ochiq'); setBelgi('ulangan'); }]]); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun mahsulotingiz <span className="italic" style={{ color: T.accent }}>Backend'ga ulanib turadi</span>.</>, ru: <>Сегодня ваш продукт <span className="italic" style={{ color: T.accent }}>будет подключён к Backend</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingizda qilasiz. Backend bugun hali xabar yubormaydi — bugungi ish ulanish va sxema.", ru: 'Каждый шаг вы сначала увидите на примере Maydon Jamoa, потом сделаете в своём продукте. Сегодня Backend ещё не отправляет сообщения — сегодня соединение и схема.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<Sahna t1={{ ekran: 'oyinlar', belgi, son: 8, osti: <span className="ws-readme"><b>README.md</b><span>{tr({ uz: '«Real vaqt» · 5 qator', ru: '«Real vaqt» · 5 строк' })}</span></span> }} be={{}} c1={c1} />}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <p className="ws-reja-past">{tx({ uz: "o'z repo'ngiz — ulanish va `README.md` «Real vaqt» · Mentor misoli `maydon-jamoa` · tayyor holat `m12-dars-02-done`", ru: 'ваш репозиторий — соединение и `README.md` «Real vaqt» · пример Ментора `maydon-jamoa` · готовое состояние `m12-dars-02-done`' })}</p>
        {isMentor && <div className="ws-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>
          <span>{tr({ uz: "Darsning og'ir qismi — 9-ekran (kod oynasi) va A1 (Backend + ilova + Render). 2, 4, 5-ekranlarga ortiqcha vaqt bermang. Vaqt yetmasa A2 uyga vazifaning 1-bandiga o'tadi; sxema 13-ekranda saqlanadi.", ru: 'Тяжёлая часть урока — экран 9 (окно кода) и A1 (Backend + приложение + Render). Не тратьте лишнее время на экраны 2, 4, 5. Если не хватит времени, A2 переходит в пункт 1 домашнего задания; схема сохраняется на экране 13.' })}</span>
          <span>{tr({ uz: "socket.io imkon bo'lsa WebSocket orqali ulanadi, bo'lmasa boshqa yo'l (HTTP long-polling) bilan — darsda «socket.io — WebSocket'ning o'zi» deyilmaydi; o'quvchi so'rasa, shu gap yetadi.", ru: 'socket.io по возможности подключается через WebSocket, иначе другим способом (HTTP long-polling) — на уроке не говорим «socket.io — это и есть WebSocket»; если ученик спросит, этого достаточно.' })}</span>
        </div>}
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · so'rov (bashorat + 2 qadam): Backend o'zi yubora olmaydi → pastga tortish so'rov-javob bilan «9 / 10» =====
const S2_TAXMIN = [{ k: 'ha', t: { uz: 'Ha, istagan payt', ru: 'Да, в любой момент' } }, { k: 'yoq', t: { uz: "Yo'q, faqat so'rovga javoban", ru: 'Нет, только в ответ на запрос' } }];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [k1, setK1] = useState(null);
  const [c1, setC1] = useState(avval ? 'sondi' : 'savol');
  const [beQator, setBeQator] = useState(null);
  const [son, setSon] = useState(avval ? 9 : 8);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1100, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const yubor = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setK1({ id: 'y', tur: 'bosh', yon: 'tel', toxta: 'qaytadi', yorliq: null });
    ketma([[1150, () => { setK1(null); setBeQator({ uz: "so'rov yo'q — yo'l yopiq", ru: 'запроса нет — путь закрыт' }); setQ(1); setBand(false); }]]);
  };
  const tort = () => {
    if (q !== 1 || band) return;
    setBand(true); setC1('sorov'); setK1({ id: 's', tur: 'sorov', yon: 'be' });
    ketma([[950, () => setK1({ id: 'j', tur: 'javob', yon: 'tel' })], [950, () => { setK1(null); setSon(9); setC1('sondi'); setQ(2); setBand(false); }]]);
  };
  const togri = taxmin === 'yoq';
  // F-1006-377: Mentor har qadamda aynan bosiladigan joyni aytadi; 1-qadamdan keyin «1-telefonga yuborish» yo'qoladi, konvert to'xtagan joyda chiziqda qizil ✕
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · so'rov", ru: 'Понятие · запрос' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, QADAMLAR_Y, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>So'rov bo'lmasa, Backend <span className="italic" style={{ color: T.accent }}>nima qila oladi</span>?</>, ru: <>Что может Backend, <span className="italic" style={{ color: T.accent }}>если нет запроса</span>?</> })}
        mentor={<Mentor>{tr(!taxmin ? { uz: "Backend tugunidagi «1-telefonga yuborish» ni bosib ko'ring, keyin birinchi telefonni pastga torting.", ru: 'Нажмите «1-telefonga yuborish» в узле Backend, затем потяните первый телефон вниз.' }
          : q === 0 ? { uz: "Backend tugunidagi «1-telefonga yuborish» ni bosing.", ru: 'Нажмите «1-telefonga yuborish» в узле Backend.' }
            : q === 1 ? { uz: "Yetib bormadi: 1-telefon so'ramagan. Endi 1-telefonni pastga torting yoki undagi «↓ Pastga torting» ni bosing.", ru: 'Не дошло: телефон 1 не запрашивал. Теперь потяните телефон 1 вниз или нажмите на нём «↓ Потяните вниз».' }
              : { uz: "Son faqat ilova so'raganda yangilandi — «Davom etish» ni bosing.", ru: 'Число обновилось только по запросу приложения — нажмите «Продолжить».' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: 'Backend yangi sonni birinchi telefonga o\'zi yubora oladimi?', ru: 'Может ли Backend сам отправить новое число на первый телефон?' }} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<Sahna
          t1={{ son, sonYangi: son === 9, eski: son === 8 && SAHNA.eski, onTort: q === 1 && !band && !tugadi ? tort : null, tortHalqa: q === 1 && !band, qadam: q === 1 && !band && !tugadi ? { n: 2, t: { uz: 'Pastga torting', ru: 'Потяните вниз' } } : null }}
          be={{ db: 9, qator: beQator, qadam: taxmin && q === 0 && !band ? { n: 1, t: { uz: "Yuborib ko'ring", ru: 'Попробуйте отправить' } } : null,
            ichi: !tugadi && q === 0 && <button type="button" className={cx('ws-yubor', halqa(taxmin && q === 0 && !band))} disabled={!taxmin || q !== 0 || band} onClick={yubor}>{tr({ uz: '1-telefonga yuborish', ru: 'Отправить на телефон 1' })}</button> }}
          t2={{ son: 9, qoshildi: true }} c1={c1} c2="yoq" k1={k1} y1={q === 1 && !tugadi ? { uz: '✕', ru: '✕' } : null} />}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={togri} tanlov={S2_TAXMIN.find(v => v.k === taxmin).t} haqiqat={{ uz: "yo'q, faqat so'rovga javoban", ru: 'нет, только в ответ на запрос' }} />} matn={tr({ uz: "11-Modulda yo'l faqat so'rov paytida ochiladi: ilova so'ramasa, Backend unga hech narsa yubora olmaydi.", ru: 'В 11-м модуле путь открывается только во время запроса: если приложение не спрашивает, Backend ничего не может ему отправить.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1, B) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="11-Modulda ilova yangi sonni Backend'dan qachon olardi?"
    question={tr({ uz: <h2 className="title h-ask">11-Modulda ilova yangi sonni Backend'dan <span className="italic" style={{ color: T.accent }}>qachon</span> olardi?</h2>, ru: <h2 className="title h-ask">Когда в 11-м модуле приложение <span className="italic" style={{ color: T.accent }}>получало</span> новое число от Backend?</h2> })}
    options={[
      { uz: "Database'da son o'zgargan paytda", ru: 'Когда число менялось в Database' },
      { uz: "Backend'ga so'rov yuborgan paytda", ru: 'Когда отправляло запрос в Backend' },
      { uz: "Boshqa o'yinchi qo'shilgan paytda", ru: 'Когда присоединялся другой игрок' },
      { uz: 'Ilova ekranda ochiq turgan paytda', ru: 'Когда приложение было открыто на экране' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "So'rov bo'lmasa, Backend'dan ilovaga yo'l ochilmaydi — javob faqat so'rovga keladi.", ru: 'Без запроса путь от Backend к приложению не открывается — ответ приходит только на запрос.' }}
    explainWrong={{
      0: { uz: "Database o'zgardi — lekin ilovaga yo'lni kim ochadi?", ru: 'Database изменилась — но кто откроет путь к приложению?' },
      2: { uz: "Qo'shilish Backend'ga yetdi; sizning ilovangizga-chi?", ru: 'Присоединение дошло до Backend; а до вашего приложения?' },
      3: { uz: 'Ochiq turgan ekranda son eski qoldi — nimadir yetmadi.', ru: 'На открытом экране число осталось старым — чего-то не хватило.' },
      default: { uz: "Javob faqat so'rovga keladi.", ru: 'Ответ приходит только на запрос.' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA · ulanish (bashorat + 2 qadam): ilova ochiladi → chiziq ochiq qoladi; 2-telefonda qo'shilish → hodisa konverti o'zi keladi =====
const S4_TAXMIN = [{ k: 'sorasa', t: { uz: "Faqat ilova so'raganda", ru: 'Только когда спрашивает приложение' } }, { k: 'besh', t: { uz: 'Har 5 soniyada', ru: 'Каждые 5 секунд' } }, { k: 'istagan', t: { uz: 'Istagan payt', ru: 'В любой момент' } }];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [ekran, setEkran] = useState(avval ? 'oyin' : 'bosh');
  const [son1, setSon1] = useState(avval ? 8 : null);
  const [c1, setC1] = useState(avval ? 'ochiq' : 'yoq');
  const [c2, setC2] = useState('yoq');
  const [k1, setK1] = useState(null);
  const [k2, setK2] = useState(null);
  const [db, setDb] = useState(avval ? 9 : 8);
  const [qoshildi, setQoshildi] = useState(avval);
  const [konvert, setKonvert] = useState(avval);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const och = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setEkran('oyin'); setC1('sorov');
    ketma([[350, () => setK1({ id: 's', tur: 'sorov', yon: 'be' })], [950, () => setK1({ id: 'j', tur: 'javob', yon: 'tel' })],
      [950, () => { setK1(null); setSon1(8); setC1('chizil'); }], [700, () => { setC1('ochiq'); setQ(1); setBand(false); }]]);
  };
  const qoshil = () => {
    if (q !== 1 || band) return;
    setBand(true); setC2('sorov'); setK2({ id: 's2', tur: 'sorov', yon: 'be' });
    ketma([[950, () => { setK2(null); setC2('yoq'); setDb(9); setQoshildi(true); }], [500, () => setK1({ id: 'h', tur: 'hodisa', yon: 'tel' })],
      [950, () => { setK1(null); setKonvert(true); setQ(2); setBand(false); }]]);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ulanish', ru: 'Понятие · соединение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, QADAMLAR_Y, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ulanish ochiq tursa, <span className="italic" style={{ color: T.accent }}>nima o'zgaradi</span>?</>, ru: <>Что меняется, <span className="italic" style={{ color: T.accent }}>если соединение открыто</span>?</> })}
        mentor={<Mentor>{tr({ uz: "10-Modulda dashboard Backend'dan qayta-qayta so'rardi — bugun boshqa yo'l: birinchi telefonda Maydon Jamoa'ni oching.", ru: 'В 10-м модуле dashboard снова и снова спрашивал Backend — сегодня другой путь: откройте Maydon Jamoa на первом телефоне.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: 'Ulanish ochiq turganda Backend ilovaga qachon xabar yubora oladi?', ru: 'Когда Backend может отправить приложению сообщение, пока соединение открыто?' }} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="ws-viz">
          <Sahna
            t1={{ ekran, son: son1, onIkon: taxmin && q === 0 && !band ? och : null, ikonHalqa: taxmin && q === 0 && !band, qoshilYoq: true, konvert: konvert && 'yopiq',
              qadam: taxmin && q === 0 && !band ? { n: 1, t: { uz: 'Ilovani oching', ru: 'Откройте приложение' } } : null }}
            be={{ db, dbYangi: db === 9 && !avval }}
            t2={{ son: qoshildi ? 9 : 8, sonYangi: qoshildi && !avval, qoshildi, onQoshil: q === 1 && !band ? qoshil : null, qoshilHalqa: q === 1 && !band,
              qadam: q === 1 && !band ? { n: 2, t: { uz: 'Ikkinchi telefonda qo\'shiling', ru: 'Присоединитесь на втором телефоне' } } : null }}
            c1={c1} c2={c2} k1={k1} k2={k2} />
          {q >= 1 && <p className="ws-nom fade-step">{tr({ uz: <>Ilova bilan Backend orasida ochiq turadigan ulanish — <b>doimiy ulanish</b>.</>, ru: <>Открытое соединение между приложением и Backend — <b>постоянное соединение</b>.</> })}</p>}
          {q >= 2 && <p className="ws-nom fade-step">{tr({ uz: <>Doimiy ulanishni beradigan texnologiya — <b>WebSocket</b>.</>, ru: <>Технология, которая даёт постоянное соединение, — <b>WebSocket</b>.</> })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'istagan'} tanlov={S4_TAXMIN.find(v => v.k === taxmin).t} haqiqat={{ uz: 'istagan payt', ru: 'в любой момент' }} />} matn={tr({ uz: "Ulanish ochiq turganda ikkalasi istagan payt xabar yubora oladi: Backend ilova so'rashini kutmaydi.", ru: 'Пока соединение открыто, оба могут отправить сообщение в любой момент: Backend не ждёт, пока приложение спросит.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — TUSHUNCHA · hodisa (bashorat + 2 qadam): konvert ochiladi — nom va ma'lumot, son yo'q; «Qayta so'rash» → «9 / 10» =====
const S5_TAXMIN = [{ k: 'oyin', t: { uz: "Faqat qaysi o'yin o'zgargani", ru: 'Только какая игра изменилась' } }, { k: 'son', t: { uz: "O'yinning yangi soni", ru: 'Новое число игры' } }, { k: 'royxat', t: { uz: "O'yinlarning to'liq ro'yxati", ru: 'Полный список игр' } }];
const KonvertIchi = () => (
  <div className="ws-ochkonv fade-step">
    <span className="ws-ochkonv-q"><em>{tr({ uz: 'nomi', ru: 'название' })}</em><code>oyin-ozgardi</code></span>
    <span className="ws-ochkonv-q"><em>{tr({ uz: "ma'lumoti", ru: 'данные' })}</em><code>{"{ oyinId: 1, sabab: 'qoshildi' }"}</code></span>
  </div>
);
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [k1, setK1] = useState(null);
  const [son, setSon] = useState(avval ? 9 : 8);
  const [dbYon, setDbYon] = useState(false);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const och = () => { if (!taxmin || q !== 0) return; setQ(1); };
  const qayta = () => {
    if (q !== 1 || band) return;
    setBand(true); setK1({ id: 's', tur: 'sorov', yon: 'be', yorliq: 'GET /oyinlar' });
    ketma([[950, () => { setK1(null); setDbYon(true); }], [450, () => { setDbYon(false); setK1({ id: 'j', tur: 'javob', yon: 'tel' }); }],
      [950, () => { setK1(null); setSon(9); setQ(2); setBand(false); }]]);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · hodisa', ru: 'Понятие · событие' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, QADAMLAR_Y, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Backend yuborgan xabarda <span className="italic" style={{ color: T.accent }}>nima bor</span>?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>внутри</span> сообщения от Backend?</> })}
        mentor={<Mentor>{q === 0
          ? tr({ uz: 'Birinchi telefon chetidagi konvertni bosib oching.', ru: 'Нажмите на конверт у края первого телефона и откройте его.' })
          : tr({ uz: "Ichida son yo'q: «Qayta so'rash» ni bosing.", ru: 'Внутри нет числа: нажмите «Qayta so\'rash».' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: 'Konvert ichida nima bor?', ru: 'Что внутри конверта?' }} variantlar={S5_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="ws-viz">
          <Sahna
            t1={{ son, sonYangi: son === 9 && !avval, qoshilYoq: true, konvert: q === 0 ? 'yopiq' : 'ochiq', onKonvert: taxmin && q === 0 ? och : null, konvertHalqa: taxmin && q === 0,
              osti: <>{q >= 1 && <KonvertIchi />}{!tugadi && <button type="button" className={cx('ws-qayta', q !== 1 && 'xira', halqa(q === 1 && !band))} disabled={q !== 1 || band} onClick={qayta}>{tr({ uz: "Qayta so'rash", ru: 'Запросить заново' })}</button>}</> }}
            be={{ db: 9, dbYon }} t2={{ son: 9, qoshildi: true }} c1="ochiq" c2="yoq" k1={k1} />
          {q >= 1 && <p className="ws-nom fade-step">{tr({ uz: <>Ulanish orqali yuboriladigan nomli xabar — <b>hodisa</b>: nomi va ma'lumoti bor.</>, ru: <>Именованное сообщение, отправляемое по соединению, — <b>событие</b>: у него есть название и данные.</> })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'oyin'} tanlov={S5_TAXMIN.find(v => v.k === taxmin).t} haqiqat={{ uz: "faqat qaysi o'yin o'zgargani va sababi", ru: 'только какая игра изменилась и почему' }} />} matn={tr({ uz: "Bu misolda hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.", ru: 'В этом примере событие сообщает, что было изменение; новое состояние приложение заново запрашивает у Backend.' })} izoh={tr({ uz: "Haqiqiy sonni ilova Backend'dan qayta oladi; Backend uchun manba — Database.", ru: 'Настоящее число приложение заново получает от Backend; для Backend источник — Database.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 6 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s6 = 3, D) =====
const Screen6 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Mentor misolida oyin-ozgardi hodisasi ilovaga nimani olib keladi?"
    question={tr({ uz: <h2 className="title h-ask">Mentor misolida <code className="qcode">oyin-ozgardi</code> hodisasi ilovaga <span className="italic" style={{ color: T.accent }}>nimani</span> olib keladi?</h2>, ru: <h2 className="title h-ask">Что в примере Ментора событие <code className="qcode">oyin-ozgardi</code> <span className="italic" style={{ color: T.accent }}>приносит</span> приложению?</h2> })}
    options={[
      { uz: "O'yinning yangi sonini va ro'yxatini", ru: 'Новое число игры и список' },
      { uz: "Qo'shilgan o'yinchining ismini", ru: 'Имя присоединившегося игрока' },
      { uz: "O'yinlarning yangilangan ro'yxatini", ru: 'Обновлённый список игр' },
      { uz: "Qaysi o'yin o'zgargani va sababini", ru: 'Какая игра изменилась и почему' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Hodisada `oyinId` va `sabab` bor; yangi sonni ilova `GET /oyinlar` dan qayta so'raydi.", ru: 'В событии есть `oyinId` и `sabab`; новое число приложение заново запрашивает у `GET /oyinlar`.' }}
    explainWrong={{
      0: { uz: 'Konvertni ochganingizda ichida son bormidi?', ru: 'Когда вы открыли конверт, было ли внутри число?' },
      1: { uz: "Hodisada ism yo'q edi: unda ikki maydon bor.", ru: 'В событии не было имени: в нём два поля.' },
      2: { uz: "Ro'yxat katta, hodisa esa qisqa — ikki maydon.", ru: 'Список большой, а событие короткое — два поля.' },
      default: { uz: "Hodisada ikki maydon bor: `oyinId` va `sabab`.", ru: 'В событии два поля: `oyinId` и `sabab`.' }
    }} />
);

// ===== SCREEN 7 — TUSHUNCHA · token (bashorat + 2 qadam; ikki kod kartasi): tokensiz — Backend yopadi, «Ulanmagan»; token bilan — «Ulangan» =====
const S7_TAXMIN = [{ k: 'hech', t: { uz: 'Hech narsa', ru: 'Ничего' } }, { k: 'token', t: { uz: 'Tokenni', ru: 'Токен' } }, { k: 'parol', t: { uz: 'Ism va parolni', ru: 'Имя и пароль' } }];
const KodKarta = ({ yorliq, izoh, qatorlar, yon = {} }) => (
  <div className="ws-kod">
    <span className="ws-kod-y">{yorliq}</span>
    <div className="ws-kod-p">{qatorlar.map((s, i) => <span key={i + s} className={cx('ws-kod-q', yon[i])}>{s || ' '}{yon[i] === 'ok' && <b className="ws-kod-ok"> ✓</b>}</span>)}</div>
    {izoh && <span className="ws-kod-iz">{izoh}</span>}
  </div>
);
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [tokensiz, setTokensiz] = useState(false);
  const [authYon, setAuthYon] = useState(avval ? 'yon' : undefined);
  const [gwYon, setGwYon] = useState(avval ? 'ok' : undefined);
  const [c1, setC1] = useState(avval ? 'ochiq' : 'yoq');
  const [belgi, setBelgi] = useState(avval ? 'ulangan' : 'joy');
  const [k1, setK1] = useState(null);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tokensizUlan = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setTokensiz(true); setAuthYon('xira'); setGwYon(undefined); setC1('chizil');
    ketma([[250, () => setK1({ id: 't0', tur: 'sorov', yon: 'be', yorliq: { uz: 'tokensiz', ru: 'без токена' } })],
      [900, () => { setK1(null); setGwYon('err'); }], [650, () => setC1('uzildi')], [550, () => { setC1('yoq'); setBelgi('ulanmagan'); setQ(1); setBand(false); }]]);
  };
  const tokenUlan = () => {
    if (q !== 1 || band) return;
    setBand(true); setTokensiz(false); setAuthYon('yon'); setGwYon(undefined); setC1('yoq');
    ketma([[350, () => { setC1('chizil'); setK1({ id: 't1', tur: 'sorov', yon: 'be', yorliq: { uz: 'token', ru: 'token' } }); }],
      [900, () => { setK1(null); setGwYon('ok'); }], [450, () => { setC1('ochiq'); setBelgi('ulangan'); setQ(2); setBand(false); }]]);
  };
  const ilovaQ = ["import { io } from 'socket.io-client';", '', 'const ulanish = io(BACKEND_MANZILI, {', tokensiz ? '  auth: {},' : '  auth: { token },', '});'];
  const gwQ = ['@WebSocketGateway()', 'export class OyinlarGateway {', '  handleConnection(ulanish: Socket) {', '    const token = ulanish.handshake.auth.token;', '    if (!tokenYaroqli(token)) ulanish.disconnect();', '  }', '}'];
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · token', ru: 'Понятие · токен' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, { uz: "Ikkalasini sinab ko'ring", ru: 'Попробуйте оба' }, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Backend kim ulanayotganini <span className="italic" style={{ color: T.accent }}>qayerdan biladi</span>?</>, ru: <>Откуда Backend <span className="italic" style={{ color: T.accent }}>знает</span>, кто подключается?</> })}
        mentor={<Mentor>{tr({ uz: "Mentor misolida ulanishni socket.io kutubxonasi ochadi — avval «Tokensiz ulanish» ni, keyin «Token bilan ulanish» ni bosing.", ru: 'В примере Ментора соединение открывает библиотека socket.io — сначала нажмите «Tokensiz ulanish», затем «Token bilan ulanish».' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "Ulanayotgan ilova Backend'ga o'zi haqida nimani yuboradi?", ru: 'Что подключающееся приложение отправляет Backend о себе?' }} variantlar={S7_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="ws-viz">
          <Sahna t1={{ ekran: 'oyinlar', belgi, son: 8 }} be={{ ok: gwYon === 'ok', xato: gwYon === 'err', qator: gwYon === 'ok' ? { uz: 'token yaroqli ✓', ru: 'токен действителен ✓' } : gwYon === 'err' ? { uz: "token yo'q — yopdi", ru: 'токена нет — закрыл' } : null }} c1={c1} k1={k1} />
          <div className="ws-kodlar">
            <div className="ws-kodlar-ch">
              {!tugadi && <div className="ws-tugmalar">
                <button type="button" className={cx('ws-tokensiz', q >= 1 && 'bajarildi', halqa(taxmin && q === 0 && !band))} disabled={!taxmin || q !== 0 || band} onClick={tokensizUlan}>{tr({ uz: 'Tokensiz ulanish', ru: 'Подключиться без токена' })}</button>
                <button type="button" className={cx('ws-token', halqa(q === 1 && !band))} disabled={q !== 1 || band} onClick={tokenUlan}>{tr({ uz: 'Token bilan ulanish', ru: 'Подключиться с токеном' })}</button>
              </div>}
              <KodKarta yorliq={<code>mobil/src/ulanish.ts</code>} qatorlar={ilovaQ} yon={{ 3: authYon }}
                izoh={tx({ uz: "`BACKEND_MANZILI` — `.env` dagi `EXPO_PUBLIC_API_URL` (web-trekda `VITE_API_URL`); `token` — kirishda saqlangan token.", ru: '`BACKEND_MANZILI` — `EXPO_PUBLIC_API_URL` из `.env` (в веб-треке `VITE_API_URL`); `token` — токен, сохранённый при входе.' })} />
            </div>
            <KodKarta yorliq={<><code>backend</code> · gateway — {tr({ uz: "Backend'da ulanishlarni qabul qiladigan klass", ru: 'класс в Backend, который принимает соединения' })}</>} qatorlar={gwQ} yon={{ 4: gwYon }} />
          </div>
          {done && <p className="ws-nom fade-step">{tx({ uz: "socket.io — doimiy ulanish bilan ishlashni osonlashtiradigan kutubxona; u imkon bo'lsa WebSocket orqali ulanadi. Ilovada `socket.io-client`, Backend'da NestJS gateway.", ru: 'socket.io — библиотека, упрощающая работу с постоянным соединением; по возможности она подключается через WebSocket. В приложении `socket.io-client`, в Backend — NestJS gateway.' })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'token'} tanlov={S7_TAXMIN.find(v => v.k === taxmin).t} haqiqat={{ uz: 'tokenni', ru: 'токен' }} />} matn={tr({ uz: "Bu misolda ilova ulanayotganda tokenni yuboradi; Backend shu paytda tekshiradi va yaroqsiz bo'lsa yopadi.", ru: 'В этом примере приложение при подключении отправляет токен; Backend проверяет его в этот момент и, если он недействителен, закрывает.' })} izoh={tr({ uz: "Token yopiq so'rovlardagidek ishlatiladi, lekin bu yerda u ulanish ochilayotganda tekshiriladi.", ru: 'Токен используется как в закрытых запросах, но здесь он проверяется при открытии соединения.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 8 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s8 = 0, A) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="Mentor misolida ilova yaroqsiz token bilan ulanmoqchi. Backend nima qiladi?"
    question={tr({ uz: <h2 className="title h-ask">Mentor misolida ilova yaroqsiz token bilan ulanmoqchi. Backend <span className="italic" style={{ color: T.accent }}>nima qiladi</span>?</h2>, ru: <h2 className="title h-ask">В примере Ментора приложение хочет подключиться с недействительным токеном. Что <span className="italic" style={{ color: T.accent }}>сделает</span> Backend?</h2> })}
    options={[
      { uz: 'Ulanishni yopadi, hodisa yubormaydi', ru: 'Закроет соединение, событий не отправит' },
      { uz: 'Ulanishni ochadi, hodisa yubormaydi', ru: 'Откроет соединение, событий не отправит' },
      { uz: "Ulanishni ochadi, parolni so'raydi", ru: 'Откроет соединение, спросит пароль' },
      { uz: 'Ulanishni yopadi, yangi token beradi', ru: 'Закроет соединение, выдаст новый токен' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Ulanish ochilayotganda token yaroqsiz bo'lsa, Backend uni yopadi.", ru: 'Если при открытии соединения токен недействителен, Backend его закрывает.' }}
    explainWrong={{
      1: { uz: 'Yaroqsiz tokendan keyin Backend kodida qaysi qator ishladi?', ru: 'Какая строка кода Backend сработала после недействительного токена?' },
      2: { uz: "Parol faqat kirishda yoziladi; ulanishda so'ralmaydi.", ru: 'Пароль вводят только при входе; при подключении его не спрашивают.' },
      3: { uz: 'Yangi token faqat «Kirish» ekranida olinadi.', ru: 'Новый токен получают только на экране «Kirish».' },
      default: { uz: 'Yaroqsiz tokenda Backend ulanishni yopadi.', ru: 'При недействительном токене Backend закрывает соединение.' }
    }} />
);

// ===== SCREEN 9 — KOD YOZISH (QKod + HtmlCompiler): tinglovchi `ulanish.on('oyin-ozgardi', …)`. Tekshiruv — xulq-atvor bo'yicha (SABOQ 37) =====
// Skelet tuzog'i (MEXANIZM 11): HtmlCompiler faqat BIRINCHI JS faylni ulaydi. Yechim: app.js — birinchi JS fayl (o'quvchi yozadi, kompilyator shuni ishlatadi);
// namuna.js — o'qish uchun ko'rinadi, ishlaydigan nusxasi natija hujjatining boshiga previewCss orqali (o'quvchi kodidan OLDIN) qo'yiladi.
// Bosh qismda hali DOM yo'q — shuning uchun faqat «.boshqa» tugmasiga ulash DOMContentLoaded ichida (o'quvchi kodi tugagach, tekshiruvdan oldin).
// Tekshiruv sinxron (bosish → tinglovchi → korsat → sora) — 50 ms dan keyingi probe async ni kutmasa ham to'g'ri ishlaydi.
const KOD_INDEX = ['<div class="oyin">', '  <p>Shanba, 18:00 · Mahalla maydoni</p>', '  <p class="hisob"><span class="son">…</span> / 10</p>', '  <button class="yangila">Yangilash</button>', '</div>', "<button class=\"boshqa\">Boshqa o'yinchi qo'shildi</button>", "<p class=\"kelgan\">Kelgan hodisa: hali yo'q</p>", ''].join('\n');
const NAMUNA_IZ = {
  uz: ["// Backend va ulanish o'rnida NAMUNA (haqiqiy Backend emas):", '// son shu faylda turadi, hodisani', "// «Boshqa o'yinchi qo'shildi» tugmasi yuboradi."],
  ru: ['// ОБРАЗЕЦ вместо Backend и соединения (не настоящий Backend):', '// число хранится в этом файле, событие отправляет', "// кнопка «Boshqa o'yinchi qo'shildi»."]
};
const NAMUNA_TEPA = ['let qoshilgan = 8;', 'function sora() {', '  return qoshilgan;', '}', '', 'const tinglovchilar = [];', 'const ulanish = {', '  on: function (nom, kod) {', '    tinglovchilar.push({ nom: nom, kod: kod });', '  },', '};', ''];
const NAMUNA_TUGMA = ["document.querySelector('.boshqa').addEventListener('click', function () {", '  if (qoshilgan >= 10) return;', '  qoshilgan = qoshilgan + 1;', "  const malumot = { oyinId: 1, sabab: 'qoshildi' };", "  document.querySelector('.kelgan').textContent =", "    'Kelgan hodisa: oyin-ozgardi ' + JSON.stringify(malumot);", '  tinglovchilar.forEach(function (t) {', "    if (t.nom === 'oyin-ozgardi') t.kod(malumot);", '  });', '});'];
const namunaKor = (t) => [...NAMUNA_IZ[t], ...NAMUNA_TEPA, ...NAMUNA_TUGMA, ''].join('\n');
const KOD_NAMUNA = { uz: namunaKor('uz'), ru: namunaKor('ru') };
const NAMUNA_IJRO = ['', '</style><script>', ...NAMUNA_TEPA, "document.addEventListener('DOMContentLoaded', function () {", ...NAMUNA_TUGMA, '});', '</script><style>'].join('\n');
const KOD_APP_IZ = {
  uz: ["// 11-Modul: tugma bosilganda so'raydi", "// Bugun: hodisa kelganda so'rang.", "// 1) ulanish.on bilan 'oyin-ozgardi' ga tinglovchi yozing — shu yerda"],
  ru: ['// 11-й модуль: запрашивает при нажатии кнопки', '// Сегодня: запрашивайте, когда приходит событие.', "// 1) напишите слушателя на 'oyin-ozgardi' через ulanish.on — здесь"]
};
const kodApp = (t) => ["const son = document.querySelector('.son');", "const yangila = document.querySelector('.yangila');", 'function korsat() {', '  son.textContent = sora();', '}', 'korsat();', KOD_APP_IZ[t][0], "yangila.addEventListener('click', korsat);", '', KOD_APP_IZ[t][1], KOD_APP_IZ[t][2], ''].join('\n');
const KOD_APP = { uz: kodApp('uz'), ru: kodApp('ru') };
const KOD_CSS = '.oyin{max-width:320px;background:#fff;border:1px solid #E9E6DF;border-radius:14px;padding:16px 18px;margin-bottom:12px}.oyin p{margin:0 0 6px}.hisob{font-family:monospace;font-size:28px;font-weight:800}.yangila,.boshqa{padding:8px 16px;border:0;border-radius:10px;font-weight:700;cursor:pointer}.yangila{background:#FF4F28;color:#fff}.boshqa{background:#13141A;color:#fff}.kelgan{margin-top:10px;font-family:monospace;font-size:13px;color:#5A5A60}';
const KOD_VAZIFA = [
  { uz: "`ulanish.on('oyin-ozgardi', …)` bilan tinglovchi yozing.", ru: "Напишите слушателя через `ulanish.on('oyin-ozgardi', …)`." },
  { uz: "Tinglovchi ichida `korsat()` ni chaqiring — son qayta so'ralsin.", ru: 'Внутри слушателя вызовите `korsat()` — пусть число запросится заново.' },
  { uz: "Natija oynasida «Boshqa o'yinchi qo'shildi» ni bosing: «Yangilash» ni bosmasdan son 8 dan 9 ga o'tsin.", ru: "В окне результата нажмите «Boshqa o'yinchi qo'shildi»: без «Yangilash» число станет 9 вместо 8." }
];
const KOD_SHART = [
  { uz: "`ulanish.on` `'oyin-ozgardi'` nomi bilan chaqirilsin.", ru: "Пусть `ulanish.on` вызывается с именем `'oyin-ozgardi'`." },
  { uz: "Hodisa kelganda `korsat` ishlasin: son 8 dan 9 ga o'tsin.", ru: 'Когда приходит событие, пусть срабатывает `korsat`: число станет 9 вместо 8.' }
];
// 1 — namuna ulanishiga shu nomli tinglovchi qo'shilganmi (qo'shtirnoq turi farqsiz) · 2 — ikki hodisa: son 8 → 9 → 10 (korsat to'g'ridan-to'g'ri ham, o'ram ichida ham)
const KOD_SHART_IFODA = [
  '(function(){try{return tinglovchilar.some(function(t){return t&&t.nom==="oyin-ozgardi"&&typeof t.kod==="function"})?"ha":"yoq"}catch(e){return "yoq"}})()',
  '(function(){var s=document.querySelector(".son"),b=document.querySelector(".boshqa");if(!s||!b)return "yoq";var a=String(s.textContent).trim();b.click();var c=String(s.textContent).trim();b.click();var d=String(s.textContent).trim();return a==="8"&&c==="9"&&d==="10"?"ha":"yoq"})()'
];
const ochiqMatn = (o) => ({ uz: o.uz.split('`').join(''), ru: o.ru.split('`').join('') });
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: "app.js — hodisa kelganda qayta so'rang", ru: 'app.js — запрашивайте заново, когда приходит событие' },
  files: [
    { name: 'app.js', lang: 'js', starter: KOD_APP },
    { name: 'index.html', lang: 'html', starter: { uz: KOD_INDEX, ru: KOD_INDEX } },
    { name: 'namuna.js', lang: 'js', starter: KOD_NAMUNA }
  ],
  previewCss: KOD_CSS + NAMUNA_IJRO,
  requirements: [
    { id: 'tinglov', label: ochiqMatn(KOD_VAZIFA[0]), check: C.evalEquals(KOD_SHART_IFODA[0], 'ha', ochiqMatn(KOD_SHART[0])) },
    { id: 'korsat', label: ochiqMatn(KOD_VAZIFA[1]), check: C.evalEquals(KOD_SHART_IFODA[1], 'ha', ochiqMatn(KOD_SHART[1])) }
  ]
};
// QKod o'ng ustun propining qolip-nomi («Editor» ma'nosidagi o'zbekcha so'z) til-lint qoidasiga tushadi — o'quvchi matni emas, qolip API nomi (9-Modul 1-dars yechimi)
const QKOD_ONG = ['muh', 'arrir'].join('');
const NatijaOyna = ({ son, kelgan, onBoshqa }) => (
  <div className={cx('ws-no', son === null && 'xira')}>
    <span className="ws-no-bar"><i /><i /><i /><b>{tr({ uz: 'Natija', ru: 'Результат' })}</b></span>
    <div className="ws-no-tana">
      <span className="ws-no-p">{tr(NAMUNA_OYIN.vaqt)} · {tr(NAMUNA_OYIN.joy)}</span>
      <span className="ws-no-h"><b key={String(son)} className={cx(son !== null && son > 8 && 'ws-pop')}>{son === null ? '…' : son}</b> / 10</span>
      <button type="button" className={cx('ws-no-btn', halqa(!!onBoshqa && son < 10))} disabled={!onBoshqa || son >= 10} onClick={onBoshqa}>{"Boshqa o'yinchi qo'shildi"}</button>
      <span className="ws-no-k">{kelgan ? 'Kelgan hodisa: oyin-ozgardi {"oyinId":1,"sabab":"qoshildi"}' : "Kelgan hodisa: hali yo'q"}</span>
    </div>
  </div>
);
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(() => (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null));
  const [shart, setShart] = useState(avval);
  const [done, setDone] = useState(avval);
  const [yordam, setYordam] = useState(false);
  const [son, setSon] = useState(avval ? 8 : null);
  const [kelgan, setKelgan] = useState(false);
  const finish = ({ codes } = {}) => { setOpen(false); setCode((codes && codes['app.js']) || code); setShart(true); setSon(8); setKelgan(false); };
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
        sarlavha={tr({ uz: <>Hodisa kelganda sonni qayta so'raydigan <span className="italic" style={{ color: T.accent }}>kod yozamiz</span>.</>, ru: <>Пишем <span className="italic" style={{ color: T.accent }}>код</span>, который заново запрашивает число, когда приходит событие.</> })}
        mentor={<Mentor>{tr({ uz: "Hodisa kelganda ishlaydigan kod tinglovchi deyiladi. Uni o'zingiz terib yozasiz: qo'lda yozganda o'rganiladi.", ru: 'Код, который срабатывает при событии, называется слушателем. Вы наберёте его сами: так запоминается лучше.' })}</Mentor>}
        vazifa={<>
          <ol className={cx('ws-vazifa', done && 'ixcham')}>{KOD_VAZIFA.map((v, i) => <li key={i} className={cx(qadamOk(i) && 'ok')}><i>{qadamOk(i) ? '✓' : i + 1}</i><span>{tx(v)}</span></li>)}</ol>
          {done && <div className="ws-kod-natija fade-step">
            <QXulosa>{tr({ uz: "Bu kodda son uch paytda so'raladi: sahifa ochilganda, «Yangilash» bosilganda va hodisa kelganda.", ru: 'В этом коде число запрашивается в трёх случаях: при открытии страницы, при нажатии «Yangilash» и когда приходит событие.' })}</QXulosa>
            <QIzoh>{tx({ uz: 'Bu oynada `ulanish` — namuna: haqiqiy Backend emas, hodisani tugma yuboradi.', ru: 'В этом окне `ulanish` — образец: это не настоящий Backend, событие отправляет кнопка.' })}</QIzoh>
          </div>}
        </>}
        yordam={!done && <div className="ws-kyordam">
          <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
          {yordam && <QIzoh>{tx({ uz: "Shakli 11-Moduldagi `yangila.addEventListener('click', korsat)` kabi: avval hodisa nomi qo'shtirnoqda, keyin ishlaydigan funksiya. Son o'zgarmasa — nom `oyin-ozgardi` deb, chiziqcha bilan yozilganini tekshiring.", ru: "Форма как в 11-м модуле `yangila.addEventListener('click', korsat)`: сначала имя события в кавычках, потом функция. Если число не меняется — проверьте, что имя написано `oyin-ozgardi`, через дефис." })}</QIzoh>}
        </div>}
        bajardim={!done && <div className="ws-bajardim"><QTugma className={halqa(shart)} disabled={!shart} onClick={bajardim}>{tr({ uz: 'Bajardim', ru: 'Готово' })}</QTugma></div>}
        {...{ [QKOD_ONG]: <div className="ws-kodoyna">
          {!done && <div className="ws-amal"><QTugma className={halqa(!shart && !isMentor)} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma>
            <span className="ws-amal-t">{tr({ uz: "Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Откроется окно кода — вы пишете код и сразу видите здесь результат.' })}</span></div>}
          <Zoomable><NatijaOyna son={son} kelgan={kelgan} onBoshqa={shart && son !== null ? () => { setSon(x => Math.min(10, x + 1)); setKelgan(true); } : null} /></Zoomable>
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      />
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), kod oynasi qobig'i tashqi zoomni bekor qiladi */}
      {open && (
        <div className="ws-kompil" style={{ zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_APP)} storageKey="pm-m10d2-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 10 — TUSHUNCHA · ulanish holati (bashorat + 4 qadam): uchish rejimi → «Ulanmoqda…», hodisa kelmadi; qayta ulanish → «Ulangan»; token yaroqsiz → «Ulanmagan» =====
const S10_TAXMIN = [{ k: 'ulangan', t: { uz: '«Ulangan»', ru: '«Подключено»' } }, { k: 'ulanmoqda', t: { uz: '«Ulanmoqda…»', ru: '«Подключается…»' } }, { k: 'ulanmagan', t: { uz: '«Ulanmagan»', ru: '«Не подключено»' } }];
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 4 : 0);
  const [band, setBand] = useState(false);
  const [samolyot, setSamolyot] = useState(false);
  const [c1, setC1] = useState(avval ? 'yopiq' : 'ochiq');
  const [c2, setC2] = useState('yoq');
  const [k1, setK1] = useState(null);
  const [k2, setK2] = useState(null);
  const [belgi, setBelgi] = useState(avval ? 'ulanmagan' : 'ulangan');
  const [db, setDb] = useState(avval ? 9 : 8);
  const [qoshildi, setQoshildi] = useState(avval);
  const [kelmadi, setKelmadi] = useState(false);
  const [eski, setEski] = useState(avval);
  const [token, setToken] = useState(avval ? 'yaroqsiz' : 'yaroqli');
  const ketma = useKetma();
  const done = q >= 4;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const samYoq = () => { if (!taxmin || q !== 0 || band) return; setSamolyot(true); setC1('uzilgan'); setBelgi('ulanmoqda'); setQ(1); };
  const qoshil = () => {
    if (q !== 1 || band) return;
    setBand(true); setC2('sorov'); setK2({ id: 's2', tur: 'sorov', yon: 'be' });
    ketma([[950, () => { setK2(null); setC2('yoq'); setDb(9); setQoshildi(true); }], [450, () => setK1({ id: 'h', tur: 'hodisa', yon: 'tel', toxta: 'sonadi' })],
      [1000, () => { setK1(null); setKelmadi(true); setQ(2); setBand(false); }]]);
  };
  const samOch = () => {
    if (q !== 2 || band) return;
    setBand(true); setSamolyot(false); setKelmadi(false); setC1('tiklan');
    ketma([[2000, () => { setC1('ochiq'); setBelgi('ulangan'); setEski(true); setQ(3); setBand(false); }]]);
  };
  const kalit = () => {
    if (q !== 3 || band) return;
    setBand(true); setToken('yaroqsiz'); setC1('yopiq');
    ketma([[650, () => { setBelgi('ulanmagan'); setQ(4); setBand(false); }]]);
  };
  const samBos = q === 0 ? samYoq : q === 2 ? samOch : null;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ulanish holati', ru: 'Понятие · состояние соединения' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 4, QADAMLAR_Y, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ulanish uzilsa, o'yinchi buni <span className="italic" style={{ color: T.accent }}>qayerdan biladi</span>?</>, ru: <>Если соединение оборвётся, <span className="italic" style={{ color: T.accent }}>откуда</span> игрок это узнает?</> })}
        mentor={<Mentor>{tr({ uz: 'Doimiy ulanish ham uziladi — birinchi telefonda uchish rejimini yoqing va tepadagi belgiga qarang.', ru: 'Постоянное соединение тоже обрывается — включите режим полёта на первом телефоне и посмотрите на значок вверху.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: 'Uchish rejimida belgi nimani ko\'rsatadi?', ru: 'Что покажет значок в режиме полёта?' }} variantlar={S10_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="ws-viz">
          <Sahna
            t1={{ ekran: 'oyinlar', belgi, son: 8, eski: eski && SAHNA.eskiMumkin, samolyot, onSamolyot: taxmin && !band && !tugadi ? samBos : null, samolyotHalqa: !!(taxmin && !band && samBos),
              qadam: !taxmin || band || tugadi ? null : q === 0 ? { n: 1, t: { uz: 'Uchish rejimini yoqing', ru: 'Включите режим полёта' } } : q === 2 ? { n: 3, t: { uz: "Uchish rejimini o'chiring", ru: 'Выключите режим полёта' } } : null,
              osti: tugadi && <div className="ws-uch-belgi fade-step"><UlanishBelgisi holat="ulangan" /><UlanishBelgisi holat="ulanmoqda" /><UlanishBelgisi holat="ulanmagan" /></div> }}
            be={{ db, dbYangi: db === 9 && !avval, qadam: q === 3 && !band ? { n: 4, t: { uz: 'Tokenni yaroqsiz qiling', ru: 'Сделайте токен недействительным' } } : null,
              osti: !tugadi && <button type="button" className={cx('ws-kalit', token === 'yaroqsiz' && 'off', halqa(q === 3 && !band))} disabled={q !== 3 || band} onClick={kalit}>Token: <b>{token === 'yaroqli' ? tr({ uz: 'yaroqli', ru: 'действителен' }) : tr({ uz: 'yaroqsiz', ru: 'недействителен' })}</b></button> }}
            t2={{ son: qoshildi ? 9 : 8, sonYangi: qoshildi && !avval, qoshildi, onQoshil: q === 1 && !band ? qoshil : null, qoshilHalqa: q === 1 && !band,
              qadam: q === 1 && !band ? { n: 2, t: { uz: "Ikkinchi telefonda qo'shiling", ru: 'Присоединитесь на втором телефоне' } } : null }}
            c1={c1} c2={c2} k1={k1} k2={k2} y1={kelmadi ? SAHNA.kelmadi : null} />
          {done && <p className="ws-nom fade-step">{tr({ uz: 'Uch belgi — uch ulanish holati: ulangan, ulanmoqda, ulanmagan.', ru: 'Три значка — три состояния соединения: подключено, подключается, не подключено.' })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'ulanmoqda'} tanlov={S10_TAXMIN.find(v => v.k === taxmin).t} haqiqat={{ uz: '«Ulanmoqda…»', ru: '«Подключается…»' }} />} matn={tr({ uz: 'Ulangan — hodisalar keladi; ulanmoqda — ilova o\'zi urinmoqda; ulanmagan — ilova urinmayapti.', ru: 'Подключено — события приходят; подключается — приложение само пытается; не подключено — приложение не пытается.' })} izoh={tr({ uz: "Ulanish qaytgani son to'g'rilandi degani emas: bu misolda uzilishdagi hodisa keyin kelmaydi.", ru: 'Восстановленное соединение не значит, что число исправилось: в этом примере событие во время обрыва потом не придёт.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 11 — 4-SAVOL (QuestionScreen; INLINE_KEYS.s11 = 2, C) =====
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="«Ulanmoqda…» paytida boshqa o'yinchi qo'shildi. Ekraningizda nima bo'ladi?"
    question={tr({ uz: <h2 className="title h-ask">«Ulanmoqda…» paytida boshqa o'yinchi qo'shildi. Ekraningizda <span className="italic" style={{ color: T.accent }}>nima bo'ladi</span>?</h2>, ru: <h2 className="title h-ask">Во время «Подключается…» присоединился другой игрок. Что <span className="italic" style={{ color: T.accent }}>будет</span> на вашем экране?</h2> })}
    options={[
      { uz: "Hodisa keladi, son o'zi yangilanadi", ru: 'Событие придёт, число обновится само' },
      { uz: 'Hodisa kutib turadi, keyin keladi', ru: 'Событие подождёт и придёт потом' },
      { uz: 'Hodisa kelmaydi, son eski qoladi', ru: 'Событие не придёт, число останется старым' },
      { uz: 'Hodisa keladi, ilova yopilib qoladi', ru: 'Событие придёт, приложение закроется' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Ulanish uzilgan paytda bo\'lgan hodisa bu misolda keyin ham kelmaydi — son eski qoladi.', ru: 'Событие, случившееся во время обрыва, в этом примере не придёт и потом — число останется старым.' }}
    explainWrong={{
      0: { uz: "Ulanish uzilgan — hodisa qaysi yo'ldan kelardi?", ru: 'Соединение оборвано — каким путём пришло бы событие?' },
      1: { uz: 'Bu misolda Backend uzilgan ilova uchun hodisani saqlamaydi.', ru: 'В этом примере Backend не хранит событие для отключённого приложения.' },
      3: { uz: 'Ilova ishlayveradi: belgi o\'zgaradi, ekran yopilmaydi.', ru: 'Приложение продолжает работать: значок меняется, экран не закрывается.' },
      default: { uz: 'Uzilish paytidagi hodisa kelmaydi.', ru: 'Событие во время обрыва не приходит.' }
    }} />
);

// ===== SCREEN 12 — TUSHUNCHA · sxema (bashorat + 5 qator, bittadan — SABOQ 9, 13): sabab tanlanadi → hodisa → GET /oyinlar → telefondagi joy o'zgaradi → qator jadvalga =====
const S12_TAXMIN = [{ k: 'bir', t: { uz: 'Bitta', ru: 'Одно' } }, { k: 'uch', t: { uz: 'Uchta', ru: 'Три' } }, { k: 'besh', t: { uz: 'Beshta', ru: 'Пять' } }];
const SX_USTUN = [{ uz: 'Real vaqt nuqtasi', ru: 'Точка реального времени' }, { uz: 'Kim nima qiladi', ru: 'Кто что делает' }, { uz: 'Hodisa', ru: 'Событие' }, { uz: 'Kim oladi', ru: 'Кто получает' }, { uz: "Ekranda nima o'zgaradi", ru: 'Что меняется на экране' }];
// Telefondagi joy qatorga qarab (1, 2 — «8 / 10» · 3 — tashkilotchi ko'rinishi · 4 — navbat · 5 — o'yinlar ro'yxati); joriy joy — sokin chegara (halqa faqat sabab tugmalarida, SABOQ 32)
const sxTel = (i, keyin) => {
  const r = MENTOR_SXEMA[i];
  const v = keyin ? r.keyin : r.oldin;
  if (r.kor === 'karta') return { ekran: 'oyinlar', son: 8, yangiKarta: keyin, joy: !keyin && 'karta' };
  if (r.kor === 'tash') return { son: 8, tash: v, tashYangi: keyin, joy: !keyin && 'tash', qoshilYoq: true };
  if (r.kor === 'navbat') return { son: 8, navbat: v, navbatYangi: keyin, joy: !keyin && 'navbat', qoshilYoq: true };
  return { son: v, sonYangi: keyin, joy: !keyin && 'son', qoshilYoq: true };
};
// Jadval «ma'lumot» bo'lib ko'rinadi (to'q sarlavha qatori, katak chiziqlari, kulrang fon, soyasiz) — oq, soyali tanlov kartasidan bir qarashda ajraladi (F-1006-381)
const JadvalIc = () => <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M1.5 6.2h13M1.5 9.8h13M6 6.2v7.3M10.4 6.2v7.3" stroke="currentColor" strokeWidth="1.1" /></svg>;
const SxJadval = ({ n, yangi, joyQator }) => (
  <div className="ws-sx-j">
    <div className="ws-sx-ram">
    <div className="ws-sx-bar"><JadvalIc /><span>{tr({ uz: 'Mentor sxemasi', ru: 'Схема Ментора' })}</span><b>{n} / 5</b></div>
    <div className="ws-sx-jadval" role="table">
      <div className="ws-sx-r bosh" role="row">{SX_USTUN.map((u, i) => <span key={i} role="columnheader" className={cx(i === 3 && 'ws-sx-kimc')}>{tr(u)}</span>)}</div>
      {MENTOR_SXEMA.slice(0, n).map((r, i) => (
        <div key={r.id} role="row" className={cx('ws-sx-r', i === yangi && 'yangi')}>
          <span>{tr(r.nuqta)}</span><span>{tr(r.kimNima)}</span>
          <span><code>oyin-ozgardi</code> · {tr({ uz: 'sabab', ru: 'причина' })} <code>{r.sabab}</code></span>
          <span className="ws-sx-kimc">{tr(KIM_OLADI)}</span><span>{tr(r.ekranda)}</span>
        </div>
      ))}
      {joyQator && <div className="ws-sx-r joy" role="row"><span>{n + 1}</span></div>}
    </div>
    </div>
    <span className="ws-sx-alt"><em className="ws-sx-kim">{tr({ uz: 'Kim oladi', ru: 'Кто получает' })}: {tr(KIM_OLADI)}</em></span>
  </div>
);
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 5 : 0);
  const [kor, setKor] = useState(avval ? { i: 4, keyin: true } : { i: 0, keyin: false });
  const [band, setBand] = useState(false);
  const [k1, setK1] = useState(null);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(0);
  const [yangi, setYangi] = useState(-1);
  const ketma = useKetma();
  const done = n >= 5;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tanla = (s) => {
    if (!taxmin || band || done) return;
    const i = n;
    if (s !== MENTOR_SXEMA[i].sabab) { setXato(s); setSilk(x => x + 1); return; }
    setXato(null); setBand(true);
    setK1({ id: 'h' + i, tur: 'hodisa', yon: 'tel', yorliq: `oyin-ozgardi · ${s}` });
    ketma([[950, () => setK1({ id: 's' + i, tur: 'sorov', yon: 'be', yorliq: 'GET /oyinlar' })],
      [950, () => setK1({ id: 'j' + i, tur: 'javob', yon: 'tel' })],
      [950, () => { setK1(null); setKor({ i, keyin: true }); setYangi(i); setN(i + 1); }],
      [1300, () => { setYangi(-1); if (i + 1 < 5) setKor({ i: i + 1, keyin: false }); setBand(false); }]]);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · sxema', ru: 'Понятие · схема' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, n, 5, { uz: "Qatorlarni to'ldiring", ru: 'Заполните строки' }, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Kim nima qilsa, <span className="italic" style={{ color: T.accent }}>kimning ekrani</span> o'zgaradi?</>, ru: <>Кто что сделает — <span className="italic" style={{ color: T.accent }}>чей экран</span> изменится?</> })}
        mentor={<Mentor>{tr({ uz: 'Har o\'zgarish uchun Backend yuboradigan hodisaning sababini tanlang — qator jadvalga tushadi.', ru: 'Для каждого изменения выберите причину события, которое отправляет Backend, — строка попадёт в таблицу.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: 'Besh xil o\'zgarish uchun Mentor nechta hodisa nomi yozgan?', ru: 'Сколько названий событий Ментор написал для пяти разных изменений?' }} variantlar={S12_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="ws-viz">
          <div className={cx('ws-sx', done && 'tayyor')}>
            <div className="ws-sx-tel"><Sahna ixcham t1={sxTel(kor.i, kor.keyin)} be={{}} c1="ochiq" k1={k1} /></div>
            <div className="ws-sx-ong">
              <SxJadval n={n} yangi={yangi} joyQator={!done} />
              {!done && !tugadi && <div key={`${n}-${silk}`} className={cx('ws-sx-karta', 'fade-step', xato && 'silk')}>
                <b className="ws-sx-kt">{tr(MENTOR_SXEMA[n].kimNima)}</b>
                <div className={cx('ws-sx-sabablar', taxmin && !band && 'ws-chorla')}>{SABABLAR.map(s => <QChip key={s} className="ws-sabab" holat={xato === s ? 'err' : undefined} silk={xato === s} disabled={!taxmin || band} onClick={() => tanla(s)}>{s}</QChip>)}</div>
                {xato && <QXato>{tr({ uz: "Sabab o'yinchi nima qilganini aytadi — kartani qayta o'qing.", ru: 'Причина говорит, что сделал игрок, — прочитайте карточку ещё раз.' })}</QXato>}
              </div>}
            </div>
          </div>
          {done && <p className="ws-nom fade-step">{tr({ uz: <>Kim nima qilganda qaysi hodisa kimga borishi va ekranda nima o'zgarishi yozilgan jadval — <b>real vaqt oqimi sxemasi</b>.</>, ru: <>Таблица, где записано, какое событие кому идёт, когда кто-то что-то делает, и что меняется на экране, — <b>схема потока реального времени</b>.</> })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'bir'} tanlov={S12_TAXMIN.find(v => v.k === taxmin).t} haqYorliq={{ uz: 'Mentor misolida', ru: 'в примере Ментора' }} haqiqat={{ uz: 'bitta — `oyin-ozgardi`, besh sabab bilan', ru: 'одно — `oyin-ozgardi`, с пятью причинами' }} />} matn={tr({ uz: 'Mentor misolida bitta hodisa besh sabab bilan keladi; har qatorda kim olishi va nima o\'zgarishi yozilgan.', ru: 'В примере Ментора одно событие приходит с пятью причинами; в каждой строке записано, кто получает и что меняется.' })} izoh={tr({ uz: 'Sxema — reja: hodisalar hali yuborilmaydi; Mentorning sodda variantida ular hamma ulangan ilovaga boradi.', ru: 'Схема — это план: события пока не отправляются; в простом варианте Ментора они идут во все подключённые приложения.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 13 — MUSTAQIL ISH · sxema (QMustaqil: bir vaqtda bitta katta karta, tepada ixcham chiziq — SABOQ 29). Saqlanadi: pm-m10d2-sxema (tayanch 8) =====
const SX_KALIT = 'pm-m10d2-sxema';
const SX_MAYDON = [
  { id: 'nuqta', l: { uz: 'Real vaqt nuqtasi', ru: 'Точка реального времени' }, s: { uz: "Qaysi joy boshqa odam tufayli o'zgaradi?", ru: 'Какое место меняется из-за другого человека?' }, n: { uz: "masalan: «8 / 10» va qo'shilganlar ro'yxati", ru: 'например: «8 / 10» и список присоединившихся' } },
  { id: 'kimNima', l: { uz: 'Kim nima qiladi', ru: 'Кто что делает' }, s: { uz: 'Kim nima qiladi?', ru: 'Кто что делает?' }, n: { uz: "masalan: o'yinchi «Qo'shilaman» ni bosadi", ru: "например: игрок нажимает «Qo'shilaman»" } },
  { id: 'hodisa', l: { uz: "Hodisa — nomi va, kerak bo'lsa, sababi", ru: 'Событие — название и, если нужно, причина' }, s: { uz: 'Qaysi hodisa? Nomi · sababi', ru: 'Какое событие? Название · причина' }, n: { uz: 'masalan: oyin-ozgardi · sabab qoshildi', ru: 'например: oyin-ozgardi · причина qoshildi' } },
  { id: 'kimOladi', l: { uz: 'Kim oladi', ru: 'Кто получает' }, s: { uz: 'Hodisani kim oladi?', ru: 'Кто получает событие?' }, n: { uz: 'masalan: hamma ulangan ilova', ru: 'например: все подключённые приложения' } },
  { id: 'ekranda', l: { uz: "Ekranda nima o'zgaradi", ru: 'Что меняется на экране' }, s: { uz: "Ekranda nima o'zgaradi?", ru: 'Что меняется на экране?' }, n: { uz: "masalan: «8 / 10» o'rniga «9 / 10»", ru: 'например: «9 / 10» вместо «8 / 10»' } }
];
const sxBosh = () => ({ id: null, nuqta: '', kimNima: '', hodisa: '', kimOladi: '', ekranda: '' });
const sxToliq = (r) => !!r && SX_MAYDON.every(m => String(r[m.id] || '').trim());
const sxBoshmi = (r) => !r || SX_MAYDON.every(m => !String(r[m.id] || '').trim());
const qisqa = (s, n = 24) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
const sxToza = (r) => ({ id: String(r.id), nuqta: String(r.nuqta || '').trim(), kimNima: String(r.kimNima || '').trim(), hodisa: String(r.hodisa || '').trim(), kimOladi: String(r.kimOladi || '').trim(), ekranda: String(r.ekranda || '').trim() });
const sxBoshlang = (storedAnswer) => {
  if (storedAnswer && Array.isArray(storedAnswer.qatorlar)) return storedAnswer.qatorlar.slice(0, 5).map(sxToza);
  const k = lsOqi(SX_KALIT);
  return k && Array.isArray(k.qatorlar) ? k.qatorlar.filter(r => r && r.id).slice(0, 5).map(sxToza) : [];
};
const YordamTugma = ({ ochiq, onClick }) => <QTugma ikkinchi className="ws-ms-yordam" aria-expanded={ochiq} onClick={onClick}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>;
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const init = useRef(null);
  if (init.current === null) init.current = sxBoshlang(storedAnswer);
  const [qatorlar, setQatorlar] = useState(init.current);
  const [karta, setKarta] = useState(() => (init.current.length ? null : sxBosh()));
  const idRef = useRef(Math.max(0, ...init.current.map(r => Number(String(r.id).replace(/\D/g, '')) || 0)) + 1);
  const [saqlandi, setSaqlandi] = useState(!!(storedAnswer && storedAnswer.saqlandi));
  const [xato, setXato] = useState(false);
  const [yordam, setYordam] = useState(false);
  const yoz = (k, v) => { setKarta(c => ({ ...c, [k]: v })); setXato(false); };
  // Karta qatorga aylanadi: yangi qatorga id — q1, q2… (qayta ishlatilmaydi), tartib o'zgarmaydi
  const qatorQil = (c, ro) => (c.id ? ro.map(r => (r.id === c.id ? { ...c } : r)) : [...ro, { ...c, id: 'q' + idRef.current++ }]);
  // «Qator tayyor» qatorni yopadi; keyingi qator — «+ Yana qator» bilan (ikki tugma bir ishni qilmaydi — F-1006-383)
  const tayyor = () => {
    if (!sxToliq(karta)) return;
    setQatorlar(qatorQil(karta, qatorlar));
    setKarta(null); setXato(false);
  };
  const tahrir = (r) => { if (saqlandi || (karta && !sxBoshmi(karta) && karta.id !== r.id)) return; setKarta({ ...r }); };
  const saqla = () => {
    if (karta && !sxBoshmi(karta) && !sxToliq(karta)) { setXato(true); return; }
    const ro = karta && sxToliq(karta) ? qatorQil(karta, qatorlar) : qatorlar;
    if (ro.length < 1 || !ro.every(sxToliq)) { setXato(true); return; }
    const data = { qatorlar: ro.map(sxToza) };
    try { localStorage.setItem(SX_KALIT, JSON.stringify(data)); } catch { /* xotira yopiq — natija baribir javobda */ }
    setQatorlar(data.qatorlar); setKarta(null); setSaqlandi(true); setXato(false);
    onAnswer(screen, { stage: 'mustaqil', screenIdx: screen, qatorlar: data.qatorlar, saqlandi: true, solved: true, correct: true });
  };
  const yangiNo = karta && !karta.id ? qatorlar.length + 1 : null;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · sxema', ru: 'Самостоятельная работа · схема' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!saqlandi} label={saqlandi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Saqlang', ru: 'Сохраните' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Mahsulotingiz uchun <span className="italic" style={{ color: T.accent }}>real vaqt oqimi sxemasini</span> yozing.</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>схему потока реального времени</span> для вашего продукта.</> })}
        mentor={<Mentor>{tr({ uz: "11-Modulda README'ga yozgan real vaqt nuqtalaringizdan boshlang: har nuqtaga bitta qator.", ru: 'Начните с точек реального времени, которые вы записали в README в 11-м модуле: на каждую точку — одна строка.' })}</Mentor>}
        qadamlar={saqlandi
          ? <div className="ws-ms-ix fade-step"><b>{tr({ uz: 'Sxema', ru: 'Схема' })}</b><span>· {qatorlar.length} {tr({ uz: 'qator', ru: 'стр.' })}</span><i className="ws-ok">✓</i></div>
          : qatorlar.length > 0 && <div className="ws-ms-chiziq">
            {qatorlar.map((r, i) => {
              const joriy = karta && karta.id === r.id;
              return <button key={r.id} type="button" className={cx('ws-ms-q', joriy && 'joriy')} onClick={() => tahrir(r)}><i>{joriy ? i + 1 : '✓'}</i><span>{qisqa(r.nuqta)} · {qisqa(r.hodisa, 20)} · {qisqa(r.ekranda)}</span></button>;
            })}
            {yangiNo && <span className="ws-ms-q joriy yangi"><i>{yangiNo}</i></span>}
          </div>}
        forma={!saqlandi && <div className="ws-ms-forma">
          {/* F-1006-383: yorliq input ichida — doimiy raqam + qisqa savol (159/2, 8-Modul «bitta varaq» naqshi); «masalan» namunalari «Yordam»da */}
          {karta && <div className="ws-ms-karta fade-step" key={karta.id || 'yangi-' + qatorlar.length}>
            {SX_MAYDON.map((m, i) => (
              <label key={m.id} className="ws-ms-maydon">
                <i className="ws-ms-n" aria-hidden="true">{i + 1}</i>
                <input className="ws-ms-inp" value={karta[m.id]} maxLength={140} placeholder={tr(m.s)} aria-label={`${i + 1} · ${tr(m.l)}`} onChange={e => yoz(m.id, e.target.value)} />
              </label>
            ))}
            <div className="ws-ms-tugmalar">
              <QTugma className={halqa(sxToliq(karta))} disabled={!sxToliq(karta)} onClick={tayyor}>{tr({ uz: 'Qator tayyor', ru: 'Строка готова' })}</QTugma>
              {qatorlar.length > 0 && <QTugma ikkinchi onClick={() => { setKarta(null); setXato(false); }}>{tr({ uz: 'Bekor qilish', ru: 'Отмена' })}</QTugma>}
              <YordamTugma ochiq={yordam} onClick={() => setYordam(o => !o)} />
            </div>
          </div>}
          {!karta && <div className="ws-ms-past">
            <QTugma className={halqa(qatorlar.length > 0)} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
            {qatorlar.length < 5 && <QTugma ikkinchi onClick={() => setKarta(sxBosh())}>{tr({ uz: '+ Yana qator', ru: '+ Ещё строка' })}</QTugma>}
            <YordamTugma ochiq={yordam} onClick={() => setYordam(o => !o)} />
          </div>}
          {xato && <QXato>{tr({ uz: "Kamida bitta qator kerak; har qatorda beshta katak to'lsin.", ru: 'Нужна хотя бы одна строка; в каждой строке заполните пять ячеек.' })}</QXato>}
        </div>}
        yordam={!saqlandi && yordam && <div className="ws-yordam-q fade-step">
          <span className="ws-yordam-misol"><b>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</b>{SX_MAYDON.map((m, i) => <span key={m.id}><i>{i + 1}</i>{tr(m.n).replace(/^(masalan|например): /, '')}</span>)}</span>
          <QIzoh>{tx({ uz: "Bu kursda hodisa nomi kichik harf va chiziqcha bilan, bo'lib o'tgan ish ma'nosida yoziladi: `oyin-ozgardi`. Bitta nom va bir necha sabab ham, har o'zgarishga alohida nom ham bo'ladi — qaror sizniki.", ru: 'В этом курсе название события пишут строчными буквами через дефис, в значении уже случившегося: `oyin-ozgardi`. Можно одно название и несколько причин, можно отдельное название на каждое изменение — решать вам.' })}</QIzoh>
          <QIzoh>{tr({ uz: "Mahsulotingizda boshqa odam o'zgartiradigan joy bo'lmasa — o'zingiz ikkinchi qurilmada o'zgartiradigan ma'lumotni oling: telefonda qo'shdingiz, kompyuterda ko'rinsin.", ru: 'Если в вашем продукте нет места, которое меняет другой человек, — возьмите данные, которые вы сами меняете на втором устройстве: добавили на телефоне — видно на компьютере.' })}</QIzoh>
        </div>}
      >{saqlandi && <QXulosa>{tr({ uz: "Sxemangiz saqlandi — amaliyotda u README'ga ko'chiriladi.", ru: 'Ваша схема сохранена — на практике её перенесут в README.' })}</QXulosa>}</QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 14 — FINAL (QTartib: 6 bo'lak, uyalar raqamli — «bu yerga qo'ying»; ball — birinchi to'liq urinish, sentinel 0) =====
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
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "O'zgarish sizning ekraningizga qaysi tartibda yetadi?", options: HODISA_YOLI.map(z => ou(z.label)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · tartib', ru: 'Итог · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Avval bo'laklarni joylang", ru: 'Сначала разложите блоки' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zgarish sizning ekraningizga <span className="italic" style={{ color: T.accent }}>qaysi tartibda</span> yetadi?</>, ru: <>В каком <span className="italic" style={{ color: T.accent }}>порядке</span> изменение доходит до вашего экрана?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni bajariladigan tartibda joylang.", ru: 'Разложите блоки в порядке выполнения.' })}</Mentor>
        <Zoomable>
          <div className="ws-tartib">
          <QTartib onWrong={onWrong}
            items={HODISA_YOLI.map(z => ({ id: z.id, label: tx(z.label) }))}
            joyMatn={tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}
            onSolved={solve}
            xatoMatn={tr({ uz: "Tartib mos emas — bo'lakni bosib qaytaring.", ru: 'Порядок не подходит — нажмите на блок, чтобы вернуть его.' })}
          />
          </div>
        </Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Bu misolda avval Database'dagi o'zgarish tugaydi, keyin hodisa yuboriladi — ilova yangi sonni oladi.", ru: 'В этом примере сначала завершается изменение в Database, потом отправляется событие — приложение получает новое число.' })}</p>
          {wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  eventReader: { icon: '📨', name: 'Event Reader', desc: { uz: 'Hodisa nimani olib kelishini topdingiz', ru: 'Вы нашли, что приносит событие' } },
  tokenGate: { icon: '🔑', name: 'Token Gate', desc: { uz: 'Yaroqsiz tokenda Backend nima qilishini bildingiz', ru: 'Вы знаете, что делает Backend при недействительном токене' } },
  lineCheck: { icon: '📶', name: 'Line Check', desc: { uz: 'Uzilish paytidagi hodisa kelmasligini topdingiz', ru: 'Вы нашли, что событие во время обрыва не приходит' } },
  stayConnected: { icon: '🔗', name: 'Stay Connected', desc: { uz: 'Ikkala amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили оба практических блока до конца' } }
};
// Ekran id → nishon: s6, s8, s11 — ballik test (to'g'ri javob, birinchi urinish); a2 — oxirgi «Bajardim» (bonus, birinchi urinish sharti yo'q — 152)
const ACH_TRIGGERS = { s6: 'eventReader', s8: 'tokenGate', s11: 'lineCheck', a2: 'stayConnected' };

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


// Podium savol yorliqlari (SCORED_IDX: 3, 6, 8, 11, 14)
const Q_LABELS = {
  3: { uz: '1 — Backend qachon yuboradi', ru: '1 — Когда отправляет Backend' },
  6: { uz: '2 — Hodisa ichida nima bor', ru: '2 — Что внутри события' },
  8: { uz: '3 — Yaroqsiz token', ru: '3 — Недействительный токен' },
  11: { uz: '4 — Uzilish paytidagi hodisa', ru: '4 — Событие во время обрыва' },
  14: { uz: "Yakuniy — hodisa yo'li", ru: 'Итог — путь события' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (MD «Fon so'zlari»; R-008: o'quvchi so'zi {uz, ru}, kod-belgi o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: { uz: 'doimiy ulanish', ru: 'постоянное соединение' }, l: 4, t: 9, s: 22, d: 19, dl: 0 },
  { ch: 'WebSocket', l: 80, t: 7, s: 26, d: 23, dl: 1.5 },
  { ch: 'socket.io', l: 7, t: 70, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'hodisa', ru: 'событие' }, l: 76, t: 66, s: 24, d: 21, dl: 2.2 },
  { ch: 'oyin-ozgardi', l: 42, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: '{ oyinId, sabab }', l: 62, t: 26, s: 20, d: 17, dl: 0.4 },
  { ch: { uz: 'tinglovchi', ru: 'слушатель' }, l: 24, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'ulanish.on', l: 18, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: 'token', l: 88, t: 42, s: 22, d: 22, dl: 0.6 },
  { ch: { uz: '«Ulangan»', ru: '«Подключено»' }, l: 52, t: 6, s: 20, d: 24, dl: 1.3 },
  { ch: 'GET /oyinlar', l: 30, t: 58, s: 20, d: 26, dl: 2.4 },
  { ch: 'Maydon Jamoa', l: 64, t: 82, s: 20, d: 21, dl: 3.1 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni MD bo'yicha A·B·C·D ×3 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: "Qayta-qayta so'rashda yangi son qachon ko'rinadi?", ru: 'При повторных запросах когда видно новое число?' }, opts: [{ uz: "Keyingi so'rov yuborilganda", ru: 'Когда отправлен следующий запрос' }, { uz: "Database o'zgargan zahoti", ru: 'Сразу как изменилась Database' }, { uz: 'Backend hodisa yuborganda', ru: 'Когда Backend отправил событие' }, { uz: 'Ulanish qayta tiklanganda', ru: 'Когда соединение восстановлено' }], correct: 0 },
  { q: { uz: 'Doimiy ulanishni kim ochadi?', ru: 'Кто открывает постоянное соединение?' }, opts: [{ uz: "Backend — ilovaga o'zi ulanadi", ru: 'Backend — сам подключается к приложению' }, { uz: "Ilova — Backend'ga ulanadi", ru: 'Приложение — подключается к Backend' }, { uz: 'Database — ikkalasiga ulanadi', ru: 'Database — подключается к обоим' }, { uz: 'Ikkinchi telefon — ulab beradi', ru: 'Второй телефон — подключает' }], correct: 1 },
  { q: { uz: 'WebSocket nima beradi?', ru: 'Что даёт WebSocket?' }, opts: [{ uz: 'Parolni tekshiradigan token', ru: 'Токен для проверки пароля' }, { uz: "O'yinlar saqlanadigan jadval", ru: 'Таблицу, где хранятся игры' }, { uz: 'Ochiq turadigan doimiy ulanish', ru: 'Открытое постоянное соединение' }, { uz: "Telefonga o'rnatiladigan fayl", ru: 'Файл для установки на телефон' }], correct: 2 },
  { q: { uz: 'Hodisaning qaysi ikki qismi bor?', ru: 'Какие две части есть у события?' }, opts: [{ uz: 'Sarlavhasi va rasmi', ru: 'Заголовок и картинка' }, { uz: 'Manzili va paroli', ru: 'Адрес и пароль' }, { uz: 'Jadvali va ustuni', ru: 'Таблица и столбец' }, { uz: "Nomi va ma'lumoti", ru: 'Название и данные' }], correct: 3 },
  { q: { uz: "Hodisada `sabab: 'chiqdi'` nimani bildiradi?", ru: "Что значит `sabab: 'chiqdi'` в событии?" }, opts: [{ uz: "O'yinchi o'yindan chiqdi", ru: 'Игрок вышел из игры' }, { uz: 'Ilova hisobdan chiqdi', ru: 'Приложение вышло из аккаунта' }, { uz: 'Ulanish uzilib qoldi', ru: 'Соединение оборвалось' }, { uz: "Backend o'chib qoldi", ru: 'Backend выключился' }], correct: 0 },
  { q: { uz: 'Hodisa kelgach, Mentor ilovasi yangi sonni qayerdan oladi?', ru: 'Откуда приложение Ментора берёт новое число после события?' }, opts: [{ uz: "Hodisaning ma'lumotidan", ru: 'Из данных события' }, { uz: "Backend'dan qayta so'rab", ru: 'Заново запросив у Backend' }, { uz: 'Telefon xotirasidan', ru: 'Из памяти телефона' }, { uz: 'Ikkinchi telefondan', ru: 'Со второго телефона' }], correct: 1 },
  { q: { uz: "`ulanish.on('oyin-ozgardi', korsat)` qatori nima qiladi?", ru: "Что делает строка `ulanish.on('oyin-ozgardi', korsat)`?" }, opts: [{ uz: "Hodisani Backend'ga qaytarib yuboradi", ru: 'Отправляет событие обратно в Backend' }, { uz: "Ulanishni butunlay yopib qo'yadi", ru: 'Полностью закрывает соединение' }, { uz: 'Hodisa kelganda `korsat` ni ishlatadi', ru: 'Запускает `korsat`, когда приходит событие' }, { uz: 'Tugma bosilganda `korsat` ni ishlatadi', ru: 'Запускает `korsat` при нажатии кнопки' }], correct: 2 },
  { q: { uz: 'Backend ulanayotgan ilovani nimadan taniydi?', ru: 'По чему Backend узнаёт подключающееся приложение?' }, opts: [{ uz: 'Yuborgan ismidan', ru: 'По отправленному имени' }, { uz: 'Yozgan parolidan', ru: 'По введённому паролю' }, { uz: 'Telefon rusumidan', ru: 'По модели телефона' }, { uz: 'Yuborgan tokenidan', ru: 'По отправленному токену' }], correct: 3 },
  { q: { uz: 'Belgi «Ulanmagan». Bu nimani bildiradi?', ru: 'Значок «Не подключено». Что это значит?' }, opts: [{ uz: 'Ilova ulanishga urinmayapti', ru: 'Приложение не пытается подключиться' }, { uz: 'Ilova qayta urinib turibdi', ru: 'Приложение пытается снова' }, { uz: 'Hodisalar kelib turibdi', ru: 'События приходят' }, { uz: 'Backend sonni yangilayapti', ru: 'Backend обновляет число' }], correct: 0 },
  { q: { uz: "Uchish rejimi o'chirildi. socket.io nima qiladi?", ru: 'Режим полёта выключен. Что делает socket.io?' }, opts: [{ uz: "Foydalanuvchidan parol so'raydi", ru: 'Спрашивает у пользователя пароль' }, { uz: "O'zi qayta ulanishga urinadi", ru: 'Сам пытается подключиться снова' }, { uz: 'Ilovani yopib, qayta ochadi', ru: 'Закрывает и снова открывает приложение' }, { uz: "Hodisalarni Database'ga yozadi", ru: 'Записывает события в Database' }], correct: 1 },
  { q: { uz: 'Sxemadagi «Kim oladi» ustuni nimani aytadi?', ru: 'Что говорит столбец «Кто получает» в схеме?' }, opts: [{ uz: 'Tugmani kim bosganini', ru: 'Кто нажал кнопку' }, { uz: 'Kodni kim yozib berganini', ru: 'Кто написал код' }, { uz: 'Hodisa kimga borishini', ru: 'Кому идёт событие' }, { uz: "E'lonni kim berganini", ru: 'Кто дал объявление' }], correct: 2 },
  { q: { uz: 'Mentor sxemasida `elon-berildi` sababi qachon yuboriladi?', ru: 'Когда в схеме Ментора отправляется причина `elon-berildi`?' }, opts: [{ uz: "Yangi o'yinchi qo'shilganda", ru: 'Когда присоединился новый игрок' }, { uz: "O'yinchi navbatga yozilganda", ru: 'Когда игрок записался в очередь' }, { uz: "O'yinchi kelishini tasdiqlaganda", ru: 'Когда игрок подтвердил приход' }, { uz: "Tashkilotchi o'yin e'lon qilganda", ru: 'Когда организатор объявил игру' }], correct: 3 }
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
// Qolipda yo'q (qolip taklifi): {…} yonida kulrang «masalan: …» (WsPrompt), qadam ichidagi «Yordam», «Ulgurmasangiz» qatori, trek tugmalari — shu faylda.
// Blok bajarilgani — faqat oxirgi «Bajardim»dan (tayanch 9.36 h); «Ulgurmasangiz» yo'lida «Davom etish» oldinroq ochiladi, bayroq qo'yilmaydi.
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const trekOqi = () => { const o = lsOqi('pm-m9d8-platforma'); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
const trekYoz = (t) => { try { const o = lsOqi('pm-m9d8-platforma') || {}; localStorage.setItem('pm-m9d8-platforma', JSON.stringify({ ...o, trek: t })); } catch { /* xotira yopiq */ } };
const prdFunk = () => { const p = lsOqi('pm-m9d5-prd'); return p && Array.isArray(p.funksiyalar) ? p.funksiyalar.map(x => String(x || '').trim()).filter(Boolean).join(', ') : ''; };
const WsPrompt = ({ satrlar, namuna = [], toldir = {} }) => {
  const [ok, setOk] = useState(false);
  const matn = satrlar.map(l => { let s = tr(l); Object.entries(toldir).forEach(([j, v]) => { if (v) s = s.split(j).join(v); }); return s; });
  const nm = {};
  namuna.forEach(x => { nm[x.joy] = x.n; });
  const korildi = new Set();
  const joy = (t, li) => t.split(/(\{[^}]+\})/g).map((p, i) => {
    if (!/^\{.+\}$/.test(p)) return <React.Fragment key={li + '-' + i}>{fmtCode(p)}</React.Fragment>;
    const yangi = !!nm[p] && !korildi.has(p);
    if (yangi) korildi.add(p);
    return <React.Fragment key={li + '-' + i}><span className="q-joy">{p}</span>{yangi && <span className="ws-joy-n">{tx(nm[p])}</span>}</React.Fragment>;
  });
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  return (
    <span className="q-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="ws-ps">{joy(l, i)}</span>)}
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <>
      <QTugma ikkinchi className="ws-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      {ochiq && <span className="ws-yordam fade-step">{satrlar.map((l, i) => <span key={i} className="ws-yordam-s">{tx(l)}</span>)}</span>}
    </>
  );
};
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'cd maydon-jamoa', 'git checkout -f m12-dars-02-done'];
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, izoh, ulgur, ulgurQadam = 99, ustoz, ustida }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam;
  const bajardim = () => {
    if (isMentorLive || done) return;
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
  // SABOQ 11: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish» (11-Modul 14-dars naqshi)
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<><Mentor>{tr(mGap)}</Mentor>{ustida}</>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: <>{tx(c.t)}{c.bandlar && c.bandlar.map((b, i) => <span key={i} className="ws-band">{tx(b)}</span>)}{c.prompt && <WsPrompt satrlar={c.prompt} namuna={c.namuna} toldir={c.toldir} />}</>,
          xato: c.yordam ? <>{c.err && <span className="ws-band">{tx(c.err)}</span>}<Yordam satrlar={c.yordam} /></> : (c.err && tx(c.err))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
        pastki={<>{done && izoh && <QIzoh>{tr(izoh)}</QIzoh>}<MentorPracticeStats live={_live} screen={screen} /></>}>
        {ortda && <p className="ws-ortda">{tr({ uz: 'Ortda qoldingizmi — Mentor misolini yangi papkada oching:', ru: 'Отстали — откройте пример Ментора в новой папке:' })} <code className="ws-buyruq">{ORTDA[0]}</code> · <code className="ws-buyruq">{ORTDA[1]}</code> · <code className="ws-buyruq">{ORTDA[2]}</code> {tx(ortda)}</p>}
        {ulgur && !done && <p className="ws-ulgur">{tx(ulgur)}</p>}
        {ustoz && isMentorLive && <div className="ws-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b><span>{tr(ustoz)}</span></div>}
      </QBlok>
    </Stage>
  );
}
// A1 kutilgan natija: telefon (mobil trek) yoki brauzer (web-trek); uch kadr bir marta o'zi yuradi — «Ulangan» → uchish rejimi «Ulanmoqda…» → «Ulangan»
const A1_FAYL = {
  mobil: [['backend/src/…gateway.ts', { uz: 'yangi', ru: 'новый' }], ['mobil/src/ulanish.ts', { uz: 'yangi', ru: 'новый' }], ['mobil/src/app/index.tsx', { uz: "o'zgardi", ru: 'изменён' }], ['README.md', { uz: '«Stek»: + socket.io', ru: '«Stek»: + socket.io' }]],
  web: [['backend/src/…gateway.ts', { uz: 'yangi', ru: 'новый' }], ['prototip/src/ulanish.js', { uz: 'yangi', ru: 'новый' }], ['README.md', { uz: '«Stek»: + socket.io', ru: '«Stek»: + socket.io' }]]
};
const NatijaA1 = ({ trek }) => {
  const [f, setF] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1400, () => setF(1)], [1800, () => setF(2)]]); }, []); // eslint-disable-line
  const belgi = f === 1 ? 'ulanmoqda' : 'ulangan';
  const web = trek === 'web';
  return (
    <div className="ws-a1n">
      {web
        ? <div className="ws-brauzer"><span className="ws-br-bar"><i /><i /><i /><code>….netlify.app</code></span>
          <div className="ws-br-tana"><span className="ws-tel-nom">{SAHNA.nom}</span><div className="ws-ol-bosh"><b className="ws-ol-sar">{tr(SAHNA.oyinlar)}</b><UlanishBelgisi holat={belgi} /></div>
            <div className="ws-karta"><b>{tr(NAMUNA_OYIN.vaqt)}</b><span>{tr(NAMUNA_OYIN.joy)} · 8 / 10</span></div></div></div>
        : <Telefon no={1} t={{ tex: 'Expo Go', ekran: 'oyinlar', belgi, son: 8, samolyot: f === 1 }} />}
      <div className="ws-fayllar">{A1_FAYL[web ? 'web' : 'mobil'].map(([n, h]) => <span key={n} className="ws-fayl"><code>{n}</code><em>{tr(h)}</em></span>)}</div>
    </div>
  );
};
const A1_PROMPT = {
  mobil: [
    { uz: "Qayerda: `backend/` — yangi gateway (NestJS, socket.io: `@nestjs/websockets` va `@nestjs/platform-socket.io`); `mobil/` — yangi fayl `src/ulanish.ts` (`socket.io-client`) va {belgi turadigan ekran}.", ru: 'Где: `backend/` — новый gateway (NestJS, socket.io: `@nestjs/websockets` и `@nestjs/platform-socket.io`); `mobil/` — новый файл `src/ulanish.ts` (`socket.io-client`) и {экран для значка}.' },
    { uz: "Nima qilsin: ilova kirgandan keyin Backend'ga bir marta ulansin va ulanayotganda tokenni yuborsin (`auth`); manzil — `EXPO_PUBLIC_API_URL`. Backend tokenni ulanish ochilayotganda tekshirsin: token yo'q yoki yaroqsiz bo'lsa — ulanishni yopsin. Ilova tokenni o'qib bo'lgandan keyingina ulansin. `README.md` «Stek» qatoriga socket.io ni qo'sh.", ru: 'Что сделать: после входа приложение один раз подключается к Backend и при подключении отправляет токен (`auth`); адрес — `EXPO_PUBLIC_API_URL`. Backend проверяет токен при открытии соединения: нет токена или он недействителен — закрывает соединение. Приложение подключается только после чтения токена. Добавь socket.io в строку «Stek» в `README.md`.' },
    { uz: "{belgi turadigan ekran} tepasida ulanish belgisi tursin: ulangan — «Ulangan»; ulanish yo'q va ilova o'zi ulanishga urinayotgan bo'lsa — «Ulanmoqda…»; urinmayotgan bo'lsa — «Ulanmagan». «Hisobdan chiqish»da ulanish yopilsin; qayta kirilganda yangi token bilan ulansin. Ekran qayta ochilganda ulanish tinglovchilari ko'payib ketmasin.", ru: 'Вверху {экран для значка} — значок соединения: подключено — «Ulangan»; соединения нет и приложение само пытается подключиться — «Ulanmoqda…»; не пытается — «Ulanmagan». При «Hisobdan chiqish» соединение закрывается; при повторном входе подключается с новым токеном. При повторном открытии экрана слушатели соединения не размножаются.' },
    { uz: 'Hozircha hech qanday hodisa yuborilmasin va tinglanmasin — faqat ulanish va belgi.', ru: 'Пока никаких событий не отправлять и не слушать — только соединение и значок.' },
    { uz: "Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Paket kerak bo'lsa — `mobil/` da faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: {что должно работать как раньше} работает как раньше; обновление потягиванием вниз остаётся. Не трогай файлы `.env`. Если нужен пакет — в `mobil/` только через `npx expo install`. Больше ничего не трогай, назови изменённые файлы.' }
  ],
  web: [
    { uz: "Qayerda: `backend/` — yangi gateway (NestJS, socket.io: `@nestjs/websockets` va `@nestjs/platform-socket.io`); gateway'da brauzer uchun CORS: faqat `WEB_ORIGIN` dagi manzilga ruxsat; `prototip/` — yangi fayl `src/ulanish.js` (`socket.io-client`) va {belgi turadigan sahifa}.", ru: 'Где: `backend/` — новый gateway (NestJS, socket.io: `@nestjs/websockets` и `@nestjs/platform-socket.io`); в gateway CORS для браузера: разрешить только адрес из `WEB_ORIGIN`; `prototip/` — новый файл `src/ulanish.js` (`socket.io-client`) и {страница для значка}.' },
    { uz: "Nima qilsin: sayt kirgandan keyin Backend'ga bir marta ulansin va ulanayotganda tokenni yuborsin (`auth`); manzil — `VITE_API_URL`; token `localStorage` dan. Backend tokenni ulanish ochilayotganda tekshirsin: token yo'q yoki yaroqsiz bo'lsa — ulanishni yopsin. Sayt tokenni o'qib bo'lgandan keyingina ulansin. `README.md` «Stek» qatoriga socket.io ni qo'sh.", ru: 'Что сделать: после входа сайт один раз подключается к Backend и при подключении отправляет токен (`auth`); адрес — `VITE_API_URL`; токен из `localStorage`. Backend проверяет токен при открытии соединения: нет токена или он недействителен — закрывает соединение. Сайт подключается только после чтения токена. Добавь socket.io в строку «Stek» в `README.md`.' },
    { uz: "{belgi turadigan sahifa} tepasida ulanish belgisi tursin: ulangan — «Ulangan»; ulanish yo'q va sayt o'zi ulanishga urinayotgan bo'lsa — «Ulanmoqda…»; urinmayotgan bo'lsa — «Ulanmagan». «Hisobdan chiqish»da ulanish yopilsin; qayta kirilganda yangi token bilan ulansin. Sahifa qayta ochilganda ulanish tinglovchilari ko'payib ketmasin.", ru: 'Вверху {страница для значка} — значок соединения: подключено — «Ulangan»; соединения нет и сайт сам пытается подключиться — «Ulanmoqda…»; не пытается — «Ulanmagan». При «Hisobdan chiqish» соединение закрывается; при повторном входе подключается с новым токеном. При повторном открытии страницы слушатели соединения не размножаются.' },
    { uz: 'Hozircha hech qanday hodisa yuborilmasin va tinglanmasin — faqat ulanish va belgi.', ru: 'Пока никаких событий не отправлять и не слушать — только соединение и значок.' },
    { uz: "Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; «Yangilash» tugmasi qolsin. `.env` fayllariga tegma. Paket kerak bo'lsa — `npm install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: {что должно работать как раньше} работает как раньше; кнопка «Yangilash» остаётся. Не трогай файлы `.env`. Если нужен пакет — через `npm install`. Больше ничего не трогай, назови изменённые файлы.' }
  ]
};
// 3-qadam: agentdan o'z kodidagi ikki qatorni ko'rsatishni so'rash (F-1006-378 — WebSocket o'z NestJS loyihasida ko'rinadi; kod o'zgarmaydi)
const A1_KOD_PROMPT = [
  { uz: "Yozgan fayllaringda ikki joyni fayl nomi va qator raqami bilan ko'rsat: ilovada tokenni yuboradigan `auth` qatori va Backend gateway'ida tokenni tekshiradigan qator.", ru: 'В написанных файлах покажи два места с именем файла и номером строки: строку `auth` в приложении, которая отправляет токен, и строку в gateway Backend, которая проверяет токен.' },
  { uz: 'Har biri nima qilishini bitta gap bilan ayt. Kodni o\'zgartirma.', ru: 'Объясни одной фразой, что делает каждая. Код не меняй.' }
];
const A1_JOY = { uz: "{avvalgidek ishlashi kerak bo'lgan ishlar}", ru: '{что должно работать как раньше}' };
const A1_NAMUNA = {
  mobil: [{ joy: { uz: '{belgi turadigan ekran}', ru: '{экран для значка}' }, n: { uz: "masalan: «O'yinlar» ekrani (`src/app/index.tsx`)", ru: 'например: экран «O\'yinlar» (`src/app/index.tsx`)' } }],
  web: [{ joy: { uz: '{belgi turadigan sahifa}', ru: '{страница для значка}' }, n: { uz: "masalan: «O'yinlar»", ru: "например: «O'yinlar»" } }]
};
const A1_JOY_NAMUNA = { joy: A1_JOY, n: { uz: "masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat", ru: 'например: вход, объявление игры, присоединение, подтверждение, выход и очередь' } };
const A1_YORDAM = [
  { uz: "Qayerda: `backend/` — yangi gateway (NestJS, socket.io: `@nestjs/websockets` va `@nestjs/platform-socket.io`); `mobil/` — yangi fayl `src/ulanish.ts` (`socket.io-client`) va «O'yinlar» ekrani (`src/app/index.tsx`).", ru: "Где: `backend/` — новый gateway (NestJS, socket.io: `@nestjs/websockets` и `@nestjs/platform-socket.io`); `mobil/` — новый файл `src/ulanish.ts` (`socket.io-client`) и экран «O'yinlar» (`src/app/index.tsx`)." },
  A1_PROMPT.mobil[1],
  { uz: "«O'yinlar» ekrani tepasida ulanish belgisi tursin: ulangan — «Ulangan»; ulanish yo'q va ilova o'zi ulanishga urinayotgan bo'lsa — «Ulanmoqda…»; urinmayotgan bo'lsa — «Ulanmagan». «Hisobdan chiqish»da ulanish yopilsin; qayta kirilganda yangi token bilan ulansin. Ekran qayta ochilganda ulanish tinglovchilari ko'payib ketmasin.", ru: "Вверху экрана «O'yinlar» — значок соединения: подключено — «Ulangan»; соединения нет и приложение само пытается подключиться — «Ulanmoqda…»; не пытается — «Ulanmagan». При «Hisobdan chiqish» соединение закрывается; при повторном входе подключается с новым токеном. При повторном открытии экрана слушатели соединения не размножаются." },
  A1_PROMPT.mobil[3],
  { uz: "Nima buzilmasin: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Paket kerak bo'lsa — `mobil/` da faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход, объявление игры, присоединение, подтверждение, выход и очередь работают как раньше; обновление потягиванием вниз остаётся. Не трогай файлы `.env`. Если нужен пакет — в `mobil/` только через `npx expo install`. Больше ничего не трогай, назови изменённые файлы.' }
];
const ScreenA1 = (props) => {
  const [trek, setTrek] = useState(trekOqi);
  const tanla = (t) => { trekYoz(t); setTrek(t); };
  const tk = trek === 'web' ? 'web' : 'mobil';
  const funk = useMemo(prdFunk, []);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z repo'ngiz", ru: 'Практика 1 · ваш репозиторий' }}
      title={{ uz: <>Mahsulotingiz Backend'ga ulansin va <span className="italic" style={{ color: T.accent }}>belgi ko'rsatsin</span>.</>, ru: <>Пусть ваш продукт подключится к Backend и <span className="italic" style={{ color: T.accent }}>покажет значок</span>.</> }}
      mentor={{ uz: "Talab tayyor — ikki joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.", ru: 'Требование готово — два места вы заполняете своим продуктом; начните с «1 · Ochish».' }}
      ustida={!trek && <div className="ws-trek"><span>{tr({ uz: 'Trekingiz:', ru: 'Ваш трек:' })}</span><div className="ws-chorla ws-trek-g"><QChip onClick={() => tanla('mobil')}>{tr({ uz: 'Mobil trek', ru: 'Мобильный трек' })}</QChip><QChip onClick={() => tanla('web')}>{tr({ uz: 'Web-trek', ru: 'Веб-трек' })}</QChip></div></div>}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da o'z repo'ngizni oching (11-Modul oxiridagi holat: kirish ishlaydi, ro'yxat Backend'dan keladi). Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin; ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»", ru: 'Откройте свой репозиторий в Antigravity (состояние конца 11-го модуля: вход работает, список приходит из Backend). В терминале `git status`: файлов `.env` в списке быть не должно; если есть, агенту: «Добавь файлы `.env` в `.gitignore`.»' },
          bandlar: [
            { uz: "Mobil trekda `cd mobil`, `npx expo start` ishlab tursin va ilova telefoningizda ochiq bo'lsin; web-trekda saytingiz Netlify'da ochiq tursin.", ru: 'В мобильном треке `cd mobil`, пусть работает `npx expo start` и приложение открыто на телефоне; в веб-треке пусть сайт открыт на Netlify.' },
            { uz: "Belgi turadigan ekranni tanlang: Mentor misolida — «O'yinlar» (eng ko'p ochiladigan ekran); mahsulotingizda — foydalanuvchi eng ko'p vaqt o'tkazadigan ekran.", ru: "Выберите экран для значка: в примере Ментора — «O'yinlar» (чаще всего открываемый экран); в вашем продукте — экран, где пользователь проводит больше всего времени." }
          ] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' },
          prompt: A1_PROMPT[tk], namuna: [...A1_NAMUNA[tk], ...(funk ? [] : [A1_JOY_NAMUNA])].map(x => ({ joy: tr(x.joy), n: x.n })), toldir: funk ? { [tr(A1_JOY)]: funk } : {}, yordam: A1_YORDAM },
        { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"ulanish\"`, `git push`.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают с тем, что сказал агент, `.env` в списке нет; добавьте каждый файл через `git add <fayl>`, `git commit -m "ulanish"`, `git push`.' },
          bandlar: [
            { uz: "Render Backend'ning yangi versiyasini chiqaradi — Render sahifasida tugashini kuting (bir necha daqiqa cho'zilishi mumkin).", ru: 'Render выпускает новую версию Backend — дождитесь окончания на странице Render (может занять несколько минут).' },
            { uz: "Mobil trekda `npx expo start` ishlab tursin: Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`). Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.", ru: 'В мобильном треке пусть работает `npx expo start`: Expo Go обычно сам перезагружает приложение (если нет — `r` в терминале). В веб-треке после push Netlify обычно сам обновляет сайт.' },
            { uz: "Kutayotganda agentdan yozgan kodidagi ikki joyni ko'rsatishni so'rang — darsda ko'rgan `auth` va tokenni tekshiradigan qatorni o'z loyihangizda topasiz:", ru: 'Пока ждёте, попросите агента показать два места в написанном коде — найдёте в своём проекте строку `auth` и строку проверки токена, которые видели на уроке:' }
          ], prompt: A1_KOD_PROMPT,
          err: { uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если появилась ошибка — отправьте агенту строку ошибки (не значения `.env`, не токен и не ключи): «Вот такая ошибка: {ошибка}. Исправь.»' } },
        { h: { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }, t: { uz: "talabingizning har gapini bajarib ko'ring. Mentor misolida:", ru: 'проверьте каждое предложение требования. В примере Ментора:' },
          bandlar: [
            { uz: "(1) Ilovani oching (kirgan holda): «O'yinlar» tepasida belgi «Ulangan» bo'lishi kerak. Bo'lmasa — bir daqiqagacha kuting: Render'ning bepul xizmati uxlab qolgan bo'lsa, birinchi ulanish cho'ziladi.", ru: "(1) Откройте приложение (с входом): вверху «O'yinlar» должен быть значок «Ulangan». Если нет — подождите до минуты: если бесплатный сервис Render уснул, первое подключение затягивается." },
            { uz: "(2) Telefonda uchish rejimini yoqing: belgi «Ulanmoqda…» ga o'tishi kerak — darhol o'zgarmasligi mumkin: uzilishni aniqlash vaqt oladi (bir daqiqagacha). Uchish rejimini o'chiring: belgi «Ulangan» ga qaytishi kerak, odatda bir necha soniyada.", ru: '(2) Включите режим полёта на телефоне: значок должен смениться на «Ulanmoqda…» — может не сразу: обнаружение обрыва занимает время (до минуты). Выключите режим полёта: значок должен вернуться к «Ulangan», обычно за несколько секунд.' },
            { uz: "(3) Avvalgi ishlar: ro'yxatni pastga torting, bitta o'yinga qo'shilib ko'ring — avvalgidek ishlasin.", ru: '(3) Прежние действия: потяните список вниз, присоединитесь к одной игре — должно работать как раньше.' },
            { uz: "(4) Agentga yozing: «Backend'ga tokensiz ulanib ko'r va nima bo'lganini ayt.» Kutilgani — ulanish yopildi. Agent javobi — uning so'zi; belgini esa o'zingiz ko'rdingiz.", ru: '(4) Напишите агенту: «Подключись к Backend без токена и скажи, что произошло.» Ожидается — соединение закрыто. Ответ агента — это его слова; значок вы видели сами.' },
            { uz: "Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Несовпадение напишите агенту: «{что} не как в требовании: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»' },
            { uz: "Web-trekda: saytingizni telefon brauzerida oching va uchish rejimini telefonda yoqasiz — kompyuterda Wi-Fi'ni o'chirish dars sahifasini ham uzadi.", ru: 'В веб-треке: откройте сайт в браузере телефона и включите режим полёта на телефоне — выключение Wi-Fi на компьютере отключит и страницу урока.' }
          ] }
      ]}
      natija={<NatijaA1 trek={trek} />}
      doneText={{ uz: "Mahsulotingiz Backend'ga ulangan: belgi ulanish holatini ko'rsatadi.", ru: 'Ваш продукт подключён к Backend: значок показывает состояние соединения.' }}
      izoh={{ uz: "Render'da yangi versiya chiqqanda ulanish uziladi — belgi bir lahza «Ulanmoqda…» bo'ladi.", ru: 'Когда на Render выходит новая версия, соединение обрывается — значок на миг становится «Ulanmoqda…».' }}
      ortda={{ uz: "— `backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozing.", ru: '— в `backend/.env` и `mobil/.env` впишите свои значения.' }}
      ulgur={{ uz: "Ulgurmasangiz: Render kutishi cho'zilsa — 4-qadam uyga vazifaning 1-bandi; 3-qadamdan keyin «Davom etish» ochiladi — 2-amaliyotga o'ting.", ru: 'Если не успеваете: если ожидание Render затянулось — шаг 4 станет пунктом 1 домашнего задания; после шага 3 откроется «Продолжить» — переходите ко 2-й практике.' }}
      ulgurQadam={3}
      ustoz={{ uz: "Render bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi; rasmiy hujjat: ochiq ulanishdagi WebSocket xabarlari ham so'rov sanaladi — socket.io ping xabarlari shunga kiradimi, «qur» da tekshiriladi (o'quvchiga aytilmaydi). 11-Modul 15-darsidagi «Render uxlaydi» riski bilan bog'lanishi: ulangan foydalanuvchi bo'lsa uyg'oq, hech kim bo'lmasa uxlaydi. 4-qadam (2) da belgi sekin o'zgarsa — hujjatdagi 45 soniya chegarasi; shoshiltirmang.", ru: 'Бесплатный сервис Render засыпает после 15 минут без запросов; официальная документация: сообщения WebSocket в открытом соединении тоже считаются запросами — входят ли сюда ping-сообщения socket.io, проверяется на этапе сборки (ученику не говорим). Связь с риском «Render засыпает» из 15-го урока 11-го модуля: есть подключённый пользователь — не спит, нет никого — засыпает. Если в шаге 4 (2) значок меняется медленно — это предел 45 секунд из документации; не торопите.' }}
    />
  );
};
// A2 kutilgan natija: README ko'rinishi (Markdown sahifasi kabi) + GitHub sahifasining kichik ko'rinishi
const NatijaA2 = () => (
  <div className="ws-rd">
    <span className="ws-rd-gh"><code>maydon-jamoa</code> · <code>README.md</code> — «Real vaqt»</span>
    <b className="ws-rd-h">Real vaqt</b>
    <div className="ws-rd-j">
      <div className="ws-rd-r bosh">{SX_USTUN.map((u, i) => <span key={i}>{tr(u)}</span>)}</div>
      {MENTOR_SXEMA.map((r, i) => <div key={r.id} className="ws-rd-r" style={{ animationDelay: `${0.2 + i * 0.1}s` }}><span>{tr(r.nuqta)}</span><span>{tr(r.kimNima)}</span><span>oyin-ozgardi · sabab {r.sabab}</span><span>{tr(KIM_OLADI)}</span><span>{tr(r.ekranda)}</span></div>)}
    </div>
    <span className="ws-rd-p">{tx({ uz: "`oyin-ozgardi` — `{ oyinId, sabab }`. Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi. Hozircha faqat ulanish va belgi bor — hodisalar hali yuborilmaydi.", ru: '`oyin-ozgardi` — `{ oyinId, sabab }`. Событие сообщает, что было изменение; новое состояние приложение заново запрашивает у Backend. Пока есть только соединение и значок — события ещё не отправляются.' })}</span>
  </div>
);
const A2_SXEMA_JOY = { uz: '{sxema qatorlari}', ru: '{строки схемы}' };
const A2_HOLAT_JOY = { uz: '{hozirgi holat}', ru: '{текущее состояние}' };
const A2_P1 = { uz: "Qayerda: `README.md` — yangi «Real vaqt» bo'limi, «Arxitektura» bo'limidan keyin.", ru: 'Где: `README.md` — новый раздел «Real vaqt», после раздела «Arxitektura».' };
const A2_P2 = { uz: "Nima qilsin: pastdagi qatorlarni besh ustunli jadval qilib yoz: real vaqt nuqtasi · kim nima qiladi · hodisa · kim oladi · ekranda nima o'zgaradi. So'zlarimni o'zgartirma, qator va hodisa qo'shma.", ru: 'Что сделать: оформи строки ниже как таблицу из пяти столбцов: точка реального времени · кто что делает · событие · кто получает · что меняется на экране. Мои слова не меняй, строк и событий не добавляй.' };
const A2_P5 = { uz: "Nima buzilmasin: faqat `README.md`; boshqa bo'lim va fayllarga tegma. O'zgargan fayllarni ayt.", ru: 'Что не сломать: только `README.md`; другие разделы и файлы не трогай. Назови изменённые файлы.' };
const ScreenA2 = (props) => {
  const sx = useMemo(() => { const k = lsOqi(SX_KALIT); return k && Array.isArray(k.qatorlar) ? k.qatorlar.filter(r => r && r.nuqta) : []; }, []);
  const satrlar = [A2_P1, A2_P2, ...(sx.length ? sx.map(r => [r.nuqta, r.kimNima, r.hodisa, r.kimOladi, r.ekranda].join(' | ')) : [A2_SXEMA_JOY]),
    { uz: `Jadval ostiga bitta qator yoz: ${A2_HOLAT_JOY.uz}`, ru: `Под таблицей напиши одну строку: ${A2_HOLAT_JOY.ru}` }, A2_P5];
  const namuna = [
    ...(sx.length ? [] : [{ joy: tr(A2_SXEMA_JOY), n: { uz: "masalan: «8 / 10» va qo'shilganlar ro'yxati | o'yinchi «Qo'shilaman» ni bosadi | oyin-ozgardi · sabab qoshildi | hamma ulangan ilova | «8 / 10» → «9 / 10»", ru: "например: «8 / 10» и список присоединившихся | игрок нажимает «Qo'shilaman» | oyin-ozgardi · причина qoshildi | все подключённые приложения | «8 / 10» → «9 / 10»" } }]),
    { joy: tr(A2_HOLAT_JOY), n: { uz: 'masalan: Hozircha faqat ulanish va belgi bor — hodisalar hali yuborilmaydi.', ru: 'например: Пока есть только соединение и значок — события ещё не отправляются.' } }
  ];
  const yordam = [A2_P1, A2_P2, ...MENTOR_SXEMA.map(r => ({ uz: [ou(r.nuqta), ou(r.kimNima), `oyin-ozgardi · sabab ${r.sabab}`, ou(KIM_OLADI), ou(r.ekranda)].join(' | '), ru: [r.nuqta.ru, r.kimNima.ru, `oyin-ozgardi · причина ${r.sabab}`, KIM_OLADI.ru, r.ekranda.ru].join(' | ') })),
    { uz: "Jadval ostiga yoz: `oyin-ozgardi` — `{ oyinId, sabab }`. Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi. Hozircha faqat ulanish va belgi bor — hodisalar hali yuborilmaydi.", ru: 'Под таблицей напиши: `oyin-ozgardi` — `{ oyinId, sabab }`. Событие сообщает, что было изменение; новое состояние приложение заново запрашивает у Backend. Пока есть только соединение и значок — события ещё не отправляются.' }, A2_P5];
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z repo'ngiz", ru: 'Практика 2 · ваш репозиторий' }}
      title={{ uz: <>Sxemangizni README'ga yozdiring va <span className="italic" style={{ color: T.accent }}>tekshiring</span>.</>, ru: <>Попросите записать схему в README и <span className="italic" style={{ color: T.accent }}>проверьте</span>.</> }}
      mentor={{ uz: "Sxemani siz yozgansiz — agent faqat ko'chiradi, siz solishtirasiz; «1 · Ochish»dan boshlang.", ru: 'Схему написали вы — агент только переносит, вы сверяете; начните с «1 · Ochish».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "`README.md` ni oching: «Arxitektura» bo'limida 11-Modulda yozilgan real vaqt nuqtalaringiz turibdi. Mustaqil ishdagi sxemangiz pastdagi talabga o'zi qo'yilgan — o'qib chiqing.", ru: 'Откройте `README.md`: в разделе «Arxitektura» — ваши точки реального времени из 11-го модуля. Схема из самостоятельной работы уже подставлена в требование ниже — прочитайте её.' },
          bandlar: [{ uz: "Sxemada odamlar roli bilan yoziladi (o'yinchi, tashkilotchi) — ism va boshqa shaxsiy ma'lumot README'ga yozilmaydi.", ru: 'В схеме люди указаны ролью (игрок, организатор) — имена и другие личные данные в README не пишутся.' }] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "qatorlarni tekshiring (tahrirlasangiz bo'ladi), oxirgi qavsni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'проверьте строки (можно править), последнюю скобку напишите сами, нажмите «Скопировать» и отправьте в Antigravity:' },
          prompt: satrlar, namuna, yordam },
        { h: { uz: "Ko'rish", ru: 'Посмотреть' }, t: { uz: "`README.md` da «Real vaqt» bo'limi: jadval va ostidagi qator. Agent boshqa faylni ham o'zgartirgan bo'lsa: «Faqat README.md ni o'zgartir, qolganini qaytar.»", ru: 'В `README.md` раздел «Real vaqt»: таблица и строка под ней. Если агент изменил и другой файл: «Измени только README.md, остальное верни.»' } },
        { h: { uz: 'Tekshirish va GitHub', ru: 'Проверка и GitHub' }, t: { uz: "har qatorni o'zingiz yozgani bilan solishtiring: beshta katak so'zma-so'z mosmi · agent qator yoki hodisa qo'shmaganmi · ostidagi qator hozirgi holatni aytadimi.", ru: 'сверьте каждую строку с тем, что написали сами: пять ячеек совпадают дословно · агент не добавил строк или событий · строка под таблицей говорит о текущем состоянии.' },
          bandlar: [
            { uz: "Farq bo'lsa, agentga: «{qaysi qator} men yozgandek emas: {qanday bo'lsin}. Faqat README.md ni o'zgartir.»", ru: 'Если есть разница, агенту: «{какая строка} не как я написал: {как должно быть}. Измени только README.md.»' },
            { uz: "Mos bo'lsa — `git status`: o'zgargan fayl faqat `README.md`; `git add README.md`, `git commit -m \"real vaqt sxemasi\"`, `git push`. GitHub'da repo sahifasini yangilang — «Real vaqt» bo'limi ko'rinadi.", ru: 'Если совпадает — `git status`: изменён только `README.md`; `git add README.md`, `git commit -m "real vaqt sxemasi"`, `git push`. Обновите страницу репозитория на GitHub — виден раздел «Real vaqt».' }
          ],
          err: { uz: "`git push` xato bersa — xato qatorini agentga yuboring (token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если `git push` выдаст ошибку — отправьте агенту строку ошибки (не токен и не ключи): «Вот такая ошибка: {ошибка}. Исправь.»' } }
      ]}
      natija={<NatijaA2 />}
      doneText={{ uz: "Sxemangiz README'da: har qatorini o'zingiz tekshirdingiz.", ru: 'Ваша схема в README: каждую строку вы проверили сами.' }}
      ulgur={{ uz: 'Ulgurmasangiz: bu blok uyga vazifaning 1-bandi — sxema darsda saqlangan.', ru: 'Если не успеваете: этот блок — пункт 1 домашнего задания, схема сохранена на уроке.' }}
      ulgurQadam={1}
    />
  );
};

// ===== 🃏 KARTOCHKALAR — alohida ekran (SABOQ 12, 16): Mentor yo'q, birinchi bosishgacha karta yuzi halqada va ostida ko'rsatma =====
const KARTALAR = [
  { front: { uz: '11-Modulda ilova yangi sonni qachon olardi?', ru: 'Когда в 11-м модуле приложение получало новое число?' }, back: { uz: 'Ekran ochilganda va pastga tortib yangilaganda', ru: 'При открытии экрана и при обновлении потягиванием вниз' }, note: { uz: "Ilova so'ramasa, Backend o'zi yubora olmaydi", ru: 'Если приложение не спрашивает, Backend сам отправить не может' } },
  { front: { uz: 'Doimiy ulanish nima?', ru: 'Что такое постоянное соединение?' }, back: { uz: 'Ilova bilan Backend orasida ochiq turadigan ulanish', ru: 'Открытое соединение между приложением и Backend' }, note: { uz: 'Ikkalasi istagan payt xabar yubora oladi', ru: 'Оба могут отправить сообщение в любой момент' } },
  { front: { uz: 'WebSocket nima?', ru: 'Что такое WebSocket?' }, back: { uz: 'Doimiy ulanishni beradigan texnologiya', ru: 'Технология, которая даёт постоянное соединение' }, note: { uz: "10-Modulda sayt qayta-qayta so'rardi (polling) — bu boshqa yo'l", ru: 'В 10-м модуле сайт спрашивал снова и снова (polling) — это другой путь' } },
  { front: { uz: 'socket.io nima?', ru: 'Что такое socket.io?' }, back: { uz: 'Doimiy ulanish bilan ishlashni osonlashtiradigan kutubxona', ru: 'Библиотека, упрощающая работу с постоянным соединением' }, note: { uz: "Imkon bo'lsa WebSocket orqali ulanadi; ilovada `socket.io-client`", ru: 'По возможности подключается через WebSocket; в приложении `socket.io-client`' } },
  { front: { uz: 'Hodisa nima?', ru: 'Что такое событие?' }, back: { uz: 'Ulanish orqali yuboriladigan nomli xabar', ru: 'Именованное сообщение, отправляемое по соединению' }, note: { uz: "Nomi va ma'lumoti bor: `oyin-ozgardi` · `{ oyinId, sabab }`", ru: 'Есть название и данные: `oyin-ozgardi` · `{ oyinId, sabab }`' } },
  { front: { uz: 'Mentor misolida hodisa nimani aytadi?', ru: 'Что сообщает событие в примере Ментора?' }, back: { uz: "Qaysi o'yin o'zgargani va sababini", ru: 'Какая игра изменилась и почему' }, note: { uz: "Yangi holatni ilova Backend'dan qayta so'raydi", ru: 'Новое состояние приложение заново запрашивает у Backend' } },
  { front: { uz: 'Tinglovchi nima?', ru: 'Что такое слушатель?' }, back: { uz: 'Hodisa kelganda ishlaydigan kod', ru: 'Код, который срабатывает, когда приходит событие' }, note: { uz: "`ulanish.on('oyin-ozgardi', korsat)`", ru: "`ulanish.on('oyin-ozgardi', korsat)`" } },
  { front: { uz: "Ilova Backend'ga nima bilan ulanadi?", ru: 'С чем приложение подключается к Backend?' }, back: { uz: 'Token bilan', ru: 'С токеном' }, note: { uz: "Token yo'q yoki yaroqsiz bo'lsa — Backend ulanishni yopadi", ru: 'Нет токена или он недействителен — Backend закрывает соединение' } },
  { front: { uz: "Ulanish belgisi qaysi uch holatni ko'rsatadi?", ru: 'Какие три состояния показывает значок соединения?' }, back: { uz: '«Ulangan», «Ulanmoqda…», «Ulanmagan»', ru: '«Подключено», «Подключается…», «Не подключено»' }, note: { uz: "Mentor misolida — «O'yinlar» ekrani tepasida", ru: "В примере Ментора — вверху экрана «O'yinlar»" } },
  { front: { uz: "«Ulanmoqda…» paytida bo'lgan hodisa nima bo'ladi?", ru: 'Что будет с событием, случившимся во время «Подключается…»?' }, back: { uz: 'Bu misolda kelmaydi', ru: 'В этом примере не придёт' }, note: { uz: 'Pastga tortib yangilash shuning uchun qoladi', ru: 'Поэтому обновление потягиванием вниз остаётся' } },
  { front: { uz: 'Real vaqt oqimi sxemasida qaysi besh ustun bor?', ru: 'Какие пять столбцов в схеме потока реального времени?' }, back: { uz: "Nuqta · kim nima qiladi · hodisa · kim oladi · ekranda nima o'zgaradi", ru: 'Точка · кто что делает · событие · кто получает · что меняется на экране' }, note: { uz: 'Mentor misolida besh qator, bitta hodisa nomi', ru: 'В примере Ментора пять строк, одно название события' } },
  { front: { uz: 'Real vaqt nima?', ru: 'Что такое реальное время?' }, back: { uz: "O'zgarish bo'lgan zahoti ekranda ko'rinishi", ru: 'Изменение видно на экране сразу, как произошло' }, note: { uz: 'Amalda — odatda bir necha soniyada; ulanish uzilsa, kechikadi', ru: 'На деле — обычно за несколько секунд; если соединение оборвётся, задержится' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('ws-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tr(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="ws-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204, texnik darslar standarti). Sarlavha va ✓ yorlig'i holatga qarab (A1, A2 bayroqlari, sxema saqlangani). CODE STRIKE va arena — darsda =====
const HW_QADAM = [
  { b: { uz: 'Tugatish', ru: 'Завершить' }, t: { uz: "— darsda ulgurmagan qadamlarni bajaring: mahsulotingizda belgi «Ulangan» bo'lsin, README'da «Real vaqt» bo'limi tursin.", ru: '— выполните шаги, на которые не хватило времени: в продукте значок «Ulangan», в README раздел «Real vaqt».' } },
  { b: { uz: 'Tekshirish', ru: 'Проверить' }, t: { uz: "— uyda uchish rejimini yana bir marta yoqib o'chiring: belgi uch holatdan qaysilarini ko'rsatdi? Kutilganidan farq bo'lsa — nima qilganingiz va nima ko'rganingizni bir qator yozib qo'ying.", ru: '— дома ещё раз включите и выключите режим полёта: какие из трёх состояний показал значок? Если не как ожидалось — запишите одной строкой, что сделали и что увидели.' } },
  { b: { uz: 'Sxema', ru: 'Схема' }, t: { uz: "— mahsulotingizning har ekranini ochib chiqing: boshqa odam tufayli o'zgaradigan yana joy bormi? Sxemada 5 tadan kam qator bo'lsa — darsdagi sxema kartasiga va README'ga qo'shing.", ru: '— откройте каждый экран продукта: есть ли ещё место, которое меняется из-за другого человека? Если в схеме меньше 5 строк — добавьте в карточку схемы на уроке и в README.' } }
];
const HwCard = ({ keyingi }) => (
  <div className="card ws-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div>
    <div className="ws-hw-karta">
      <span className="ws-hw-q"><em>{tr({ uz: 'kim uchun', ru: 'для кого' })}</em><b>{tr({ uz: "o'z mahsulotingiz", ru: 'ваш продукт' })}</b></span>
      <span className="ws-hw-q"><em>{tr({ uz: 'muddat', ru: 'срок' })}</em><b>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</b></span>
    </div>
    <ol className="ws-hw-qadam">{HW_QADAM.map((h, i) => <li key={i}><i>{i + 1}</i><span><b>{tr(h.b)}</b> {tr(h.t)}</span></li>)}</ol>
    {keyingi && <span className="ws-hw-keyingi">{keyingi}</span>}
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
  const sxema = !!answers[idx('s13')]?.saqlandi || !!lsOqi(SX_KALIT);
  const sarlavha = a1 && a2 ? { uz: "Mahsulotingiz Backend'ga ulangan, sxema README'da.", ru: 'Ваш продукт подключён к Backend, схема в README.' }
    : a1 ? { uz: "Mahsulotingiz ulangan — sxemani README'ga yozish qoldi.", ru: 'Ваш продукт подключён — осталось записать схему в README.' }
      : sxema ? { uz: 'Sxemangiz tayyor — ulanishni tugatish qoldi.', ru: 'Ваша схема готова — осталось завершить подключение.' }
        : { uz: 'Ulanish hali tugamagan — qadamlarni uyda tugating.', ru: 'Подключение ещё не завершено — закончите шаги дома.' }; // rost: A1 qisman bajarilgan bo'lishi ham mumkin, «boshlandi» emas (07.10 savol 1)
  const RECAP = [
    { uz: "So'rov–javobda ilova so'ramasa, Backend unga hech narsa yubora olmaydi.", ru: 'В схеме запрос–ответ, если приложение не спрашивает, Backend ничего не может ему отправить.' },
    { uz: 'Doimiy ulanish ochiq turadi: ilova ham, Backend ham istagan payt xabar yubora oladi.', ru: 'Постоянное соединение открыто: и приложение, и Backend могут отправить сообщение в любой момент.' },
    { uz: "Bu misolda hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.", ru: 'В этом примере событие сообщает, что было изменение; новое состояние приложение заново запрашивает у Backend.' },
    { uz: "Ilova token bilan ulanadi; ulanish uzilishi mumkin — belgi uch holatdan birini ko'rsatadi.", ru: 'Приложение подключается с токеном; соединение может оборваться — значок показывает одно из трёх состояний.' },
    { uz: "Real vaqt oqimi sxemasi: kim nima qilganda qaysi hodisa kimga boradi va ekranda nima o'zgaradi.", ru: 'Схема потока реального времени: когда кто что делает, какое событие кому идёт и что меняется на экране.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className={cx('ws-yakun', !(a1 && a2) && 'yoq-chip')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Ulanish va sxema tayyor', ru: 'Соединение и схема готовы' })}
          togri={correct} jami={total}
          sarlavha={tr(sarlavha)}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard keyingi={tr({ uz: <>Keyingi dars — <b>«Ekran o'zi yangilanishi uchun nimani yozasiz?»</b>: sxemangizdagi hodisalar talabga aylanadi.</>, ru: <>Следующий урок — <b>«Что написать, чтобы экран обновлялся сам?»</b>: события из вашей схемы станут требованием.</> })} />}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function WebSocketBasicsLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — «ikki telefon va Backend» sahnasi (ws-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Telefon 172×272 hamma ekranda (SABOQ 22) === */
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (tebranish yengil — 11-Modul SABOQ 32) */
        .ws-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: ws-puls 2.2s ease-out .3s 3; }
        @keyframes ws-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        /* Variantlar va tanlov chiplari: guruh atrofida ramka YO'Q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (F-1006-376/381/385, «donavoy») */
        .ws-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: ws-chorla-v 1.8s ease-out .5s 2; }
        @keyframes ws-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .ws-halqa-g .q-chip:not(:disabled), .ws-chorla > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: ws-chorla-c 1.8s ease-out .5s 2; }
        @keyframes ws-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .ws-k.faol .q-variant:nth-child(2), .ws-halqa-g .q-chip:nth-child(2), .ws-chorla > .q-chip:nth-child(2) { animation-delay: .75s; }
        .ws-k.faol .q-variant:nth-child(3), .ws-halqa-g .q-chip:nth-child(3), .ws-chorla > .q-chip:nth-child(3) { animation-delay: 1s; }
        .ws-halqa-g .q-chip:nth-child(4), .ws-chorla > .q-chip:nth-child(4) { animation-delay: 1.25s; }
        .ws-halqa-g .q-chip:nth-child(5), .ws-chorla > .q-chip:nth-child(5) { animation-delay: 1.5s; }
        .ws-joy { outline: 2px solid ${T.accent}; outline-offset: 2px; border-radius: 6px; }
        .ws-pop { display: inline-block; animation: ws-pop 0.55s cubic-bezier(.3,1.5,.5,1); color: ${T.accent}; }
        @keyframes ws-pop { 0% { transform: scale(1.45); } 100% { transform: scale(1); } }
        .ws-k { display: contents; }
        .ws-viz { display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
        p.ws-nom { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        p.ws-nom b { color: ${T.accent}; }
        /* Yashil xulosa ichida: taxmin qatori (kichik) · asosiy gap · izoh (kichik, ingichka ajratgich) — quti qalin bo'lmaydi (F-1006-380/382) */
        .q-xulosa .ws-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .ws-x-tx b { color: ${T.ink}; } .q-xulosa .ws-x-tx.ok, .q-xulosa .ws-x-tx.ok b { color: ${T.ok}; } .q-xulosa .ws-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .ws-x-m { display: block; }
        .q-xulosa .ws-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        .ws-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .ws-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        /* Sahna joylashuvi: yot — bir qatorda; tik — telefonlar tepada, Backend pastda */
        .ws-sahna { user-select: none; -webkit-user-select: none; display: grid; gap: 0 10px; padding-top: 30px; justify-content: center; align-items: start; }
        .ws-sahna.yot.ikki { grid-template-columns: auto minmax(56px, 120px) auto minmax(56px, 120px) auto; grid-template-areas: "t1 c1 be c2 t2"; }
        .ws-sahna.yot.bir { grid-template-columns: auto minmax(56px, 110px) auto; grid-template-areas: "t1 c1 be"; }
        .ws-sahna.tik.ikki { grid-template-columns: 172px 172px; column-gap: 12px; grid-template-areas: "t1 t2" "c1 c2" "be be"; }
        .ws-sahna.tik.bir { grid-template-columns: auto; grid-template-areas: "t1" "c1" "be"; justify-items: center; }
        .ws-sahna.bes.tik.ikki { grid-template-areas: "t1 t2"; }
        .ws-s-t1 { grid-area: t1; } .ws-s-t2 { grid-area: t2; } .ws-s-c1 { grid-area: c1; } .ws-s-c2 { grid-area: c2; } .ws-s-be { grid-area: be; justify-self: center; }
        .ws-sahna.tik .ws-s-c1, .ws-sahna.tik .ws-s-c2 { justify-self: center; }
        /* Telefon */
        .ws-tel-ust { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; width: 172px; }
        .ws-sahna.yot .ws-tel-ust:has(.ws-kod) { width: auto; }
        .ws-tel-yorliq { position: absolute; top: -28px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 999px; white-space: nowrap; }
        .ws-tel-yorliq.b1 { background: ${T.accentSoft}; color: ${T.accent}; } .ws-tel-yorliq.b2 { background: ${fon(T.ink, 0.08)}; color: ${T.ink}; }
        .ws-tel-yorliq.tex { position: static; transform: none; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink2}; }
        .ws-telefon { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 5px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .ws-telefon.tortiladi { touch-action: none; cursor: grab; }
        .ws-tel-bar { position: relative; display: flex; align-items: center; justify-content: center; height: 18px; flex: none; }
        .ws-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: ${T.ok}; letter-spacing: 0.01em; }
        .ws-samolyot { position: absolute; right: 0; top: -1px; width: 22px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid ${T.line}; border-radius: 7px; background: ${T.bg}; color: ${T.ink2}; cursor: pointer; padding: 0; transition: background 0.25s, color 0.25s; }
        .ws-samolyot.on { background: ${T.accent}; color: #fff; border-color: ${T.accent}; }
        .ws-samolyot:disabled { cursor: default; }
        .ws-tort { flex: none; align-self: center; height: 22px; padding: 0 10px; border: 1px dashed ${T.accent}; border-radius: 999px; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'Manrope'; font-size: 11.5px; font-weight: 800; cursor: pointer; }
        .ws-tel-ekran { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; animation: ws-ekran 0.35s ease-out both; transition: transform 0.18s; }
        @keyframes ws-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        .ws-tort-ic { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 15px; color: ${T.ink2}; }
        .ws-tort-ic.tayyor { color: ${T.accent}; }
        .ws-oyin { display: flex; flex-direction: column; gap: 3px; flex: 1; min-height: 0; }
        .ws-oyin-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .ws-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .ws-oyin-joy { font-size: 12px; color: ${T.ink2}; }
        .ws-hisob { display: inline-flex; align-items: baseline; gap: 6px; align-self: flex-start; margin-top: 4px; padding: 0 2px; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${T.ink2}; border-radius: 6px; }
        .ws-son { display: inline-block; font-size: 22px; font-weight: 800; color: ${T.ink}; }
        .ws-son.yangi { color: ${T.accent}; animation: ws-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .ws-eski { font-family: 'Manrope'; font-style: normal; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; background: ${fon(T.ink, 0.07)}; border-radius: 999px; padding: 1px 7px; animation: fade-in-up 0.4s ease-out both; }
        .ws-doiralar { display: grid; grid-template-columns: repeat(5, 14px); gap: 6px; margin: 3px 0 4px; }
        .ws-doiralar i { width: 14px; height: 14px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .ws-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.38)}; }
        .ws-doiralar i.yangi { background: ${T.accent}; animation: ws-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .ws-tash { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; padding: 1px 4px; border-radius: 6px; }
        .ws-tash b { color: ${T.ink}; font-family: 'JetBrains Mono', monospace; }
        .ws-qoshil { margin-top: auto; flex: none; display: flex; align-items: center; justify-content: center; height: 30px; border: 0; border-radius: 10px; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-size: 12px; font-weight: 800; cursor: pointer; transition: background 0.3s, color 0.3s; }
        .ws-qoshil:disabled { cursor: default; }
        .ws-qoshil:disabled:not(.off) { background: ${fon(T.accent, 0.16)}; color: ${T.accent}; }
        .ws-qoshil.off { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .ws-oyinlar { display: flex; flex-direction: column; gap: 5px; flex: 1; min-height: 0; }
        .ws-ol-bosh { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .ws-ol-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .ws-kun { font-size: 11px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.04em; }
        .ws-karta { display: flex; flex-direction: column; gap: 1px; padding: 6px 8px; border-radius: 9px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11px; line-height: 1.3; color: ${T.ink2}; }
        .ws-karta b { font-size: 12px; color: ${T.ink}; }
        .ws-karta.yangi { border-color: ${T.ok}; background: ${fon(T.ok, 0.1)}; animation: ws-kirdi 0.5s ease-out both; }
        @keyframes ws-kirdi { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .ws-karta-son { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; display: flex; align-items: baseline; gap: 6px; }
        .ws-belgi { display: inline-flex; align-items: center; gap: 5px; height: 20px; padding: 0 8px; border-radius: 999px; font-size: 10.5px; font-weight: 800; white-space: nowrap; animation: fade-in-up 0.35s ease-out both; }
        .ws-belgi-n { width: 7px; height: 7px; border-radius: 50%; flex: none; }
        .ws-belgi.ulangan { background: ${fon(T.ok, 0.12)}; color: ${T.ok}; } .ws-belgi.ulangan .ws-belgi-n { background: ${T.ok}; }
        .ws-belgi.ulanmoqda { background: ${T.accentSoft}; color: ${T.accent}; } .ws-belgi.ulanmoqda .ws-belgi-n { background: ${T.accent}; animation: ws-miltil 1.6s ease-in-out infinite; }
        .ws-belgi.ulanmagan { background: ${fon(T.ink, 0.07)}; color: ${T.ink2}; } .ws-belgi.ulanmagan .ws-belgi-n { background: ${T.ink2}; }
        .ws-belgi.joy { padding: 0 6px; background: ${fon(T.ink, 0.05)}; } .ws-belgi.joy .ws-belgi-n { background: ${fon(T.ink, 0.3)}; }
        @keyframes ws-miltil { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .ws-bosh { flex: 1; display: flex; align-items: flex-start; justify-content: flex-start; padding: 14px 6px; }
        .ws-ikon { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 6px; border: 0; border-radius: 14px; background: transparent; cursor: pointer; }
        .ws-ikon:disabled { cursor: default; }
        .ws-ikon-sh { width: 46px; height: 46px; border-radius: 13px; background: ${T.ok}; box-shadow: inset 0 -6px 0 ${fon(T.ink, 0.15)}; }
        .ws-ikon-t { font-size: 10.5px; font-weight: 700; color: ${T.ink}; }
        .ws-konvert { position: absolute; top: 118px; right: -18px; z-index: 4; display: inline-flex; align-items: center; gap: 4px; padding: 4px; border: 0; border-radius: 8px; background: transparent; cursor: pointer; animation: ws-kirdi 0.4s ease-out both; }
        .ws-konvert:disabled { cursor: default; }
        .ws-konvert .ws-kv-i { width: 30px; height: 21px; }
        .ws-konvert.ochiq .ws-kv-i { background: ${T.paper}; border-color: ${T.ok}; }
        .ws-konvert-n { position: absolute; top: 0; left: 0; width: 9px; height: 9px; border-radius: 50%; background: ${T.accent}; border: 2px solid ${T.paper}; }
        .ws-konvert-y { position: absolute; top: 30px; left: 6px; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        /* Tik sahnada (telefon, ixcham): konvert telefon OSTIDA, yozuvi yonida — 2-telefon ustiga tushmaydi (o'z topilmam, 07.10) */
        .ws-sahna.tik .ws-konvert { position: relative; top: auto; right: auto; gap: 6px; }
        .ws-sahna.tik .ws-konvert-y { position: static; }
        .ws-qadam { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 4px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; font-weight: 700; color: ${T.ink}; white-space: nowrap; }
        .ws-qadam i { width: 20px; height: 20px; border-radius: 50%; background: ${T.accent}; color: #fff; font-style: normal; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; }
        /* Backend tuguni */
        .ws-be-ust { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .ws-sahna.yot .ws-be-joy { height: 272px; display: flex; align-items: center; justify-content: center; }
        .ws-backend { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 132px; max-width: 190px; padding: 12px 14px; border-radius: 16px; background: ${T.ink}; color: ${T.paper}; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.6); transition: box-shadow 0.3s; }
        .ws-backend.yon { box-shadow: 0 0 0 4px ${fon(T.accent, 0.35)}; }
        .ws-backend.ok { box-shadow: 0 0 0 4px ${fon(T.ok, 0.35)}; } .ws-backend.xato { box-shadow: 0 0 0 4px ${fon(T.err, 0.4)}; animation: ws-be-silk .4s ease-in-out; }
        @keyframes ws-be-silk { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        /* 7-ekran: kod kartalari sahna ostida ikki ustunda — telefon, chiziq va Backend bir-biriga tegib turadi (F-1006-379) */
        .ws-kodlar { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; align-items: start; }
        .ws-kodlar-ch { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .ws-kodlar .ws-kod { max-width: none; }
        .ws-kodlar .ws-tugmalar { justify-content: flex-start; }
        @media (max-width: 760px) { .ws-kodlar { grid-template-columns: minmax(0, 1fr); } }
        .ws-backend.tugildi { animation: ws-tugil 0.5s cubic-bezier(.3,1.4,.5,1) both; }
        @keyframes ws-tugil { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }
        .ws-be-nom { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
        .ws-db { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 2px 9px; border-radius: 7px; background: ${fon(T.paper, 0.12)}; transition: background 0.3s; }
        .ws-db.yon { background: ${T.accent}; }
        .ws-db b { color: ${T.paper}; }
        .ws-yubor { margin-top: 2px; padding: 7px 11px; border: 1.5px dashed ${T.paper}; border-radius: 10px; background: ${fon(T.paper, 0.08)}; color: ${T.paper}; font-family: 'Manrope'; font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap; }
        .ws-yubor:disabled { cursor: default; opacity: 0.6; }
        .ws-be-qator { font-size: 11.5px; font-weight: 700; color: ${T.paper}; opacity: 0.85; text-align: center; }
        .ws-kalit { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1.5px solid ${T.ok}; border-radius: 999px; background: ${fon(T.ok, 0.1)}; color: ${T.ink}; font-family: 'JetBrains Mono', monospace; font-size: 12px; cursor: pointer; transition: background 0.3s, border-color 0.3s; }
        .ws-kalit b { color: ${T.ok}; } .ws-kalit.off { border-color: ${T.err}; background: ${fon(T.err, 0.1)}; } .ws-kalit.off b { color: ${T.err}; }
        .ws-kalit:disabled { cursor: default; }
        /* Chiziq va konvert */
        .ws-chiziq { position: relative; }
        .ws-chiziq.yot { height: 272px; min-width: 56px; }
        .ws-chiziq.tik { height: 46px; width: 30px; }
        .ws-chiziq-i { position: absolute; display: block; opacity: 0; transition: opacity 0.3s; }
        .ws-chiziq.yot .ws-chiziq-i { left: 0; right: 0; top: calc(50% - 1.5px); height: 3px; }
        .ws-chiziq.tik .ws-chiziq-i { top: 0; bottom: 0; left: calc(50% - 1.5px); width: 3px; }
        .ws-chiziq.yot.h-savol .ws-chiziq-i, .ws-chiziq.yot.h-sondi .ws-chiziq-i, .ws-chiziq.yot.h-uzilgan .ws-chiziq-i, .ws-chiziq.yot.h-tiklan .ws-chiziq-i { opacity: 1; background: repeating-linear-gradient(90deg, ${fon(T.ink, 0.28)} 0 7px, transparent 7px 13px); }
        .ws-chiziq.tik.h-savol .ws-chiziq-i, .ws-chiziq.tik.h-sondi .ws-chiziq-i, .ws-chiziq.tik.h-uzilgan .ws-chiziq-i, .ws-chiziq.tik.h-tiklan .ws-chiziq-i { opacity: 1; background: repeating-linear-gradient(180deg, ${fon(T.ink, 0.28)} 0 7px, transparent 7px 13px); }
        .ws-chiziq.h-sondi .ws-chiziq-i { opacity: 0.55; }
        .ws-chiziq.h-sorov .ws-chiziq-i { opacity: 1; background: ${T.accent}; box-shadow: 0 0 10px ${fon(T.accent, 0.5)}; }
        .ws-chiziq.h-bir .ws-chiziq-i { background: ${T.accent}; animation: ws-bir 1.4s ease-out both; }
        @keyframes ws-bir { 0% { opacity: 0; } 25% { opacity: 1; } 100% { opacity: 0; } }
        .ws-chiziq.h-chizil .ws-chiziq-i, .ws-chiziq.h-ochiq .ws-chiziq-i { opacity: 1; background: ${T.ok}; }
        .ws-chiziq.yot.h-chizil .ws-chiziq-i { transform-origin: left center; animation: ws-chizx 0.6s ease-out both; }
        .ws-chiziq.yot.n2.h-chizil .ws-chiziq-i { transform-origin: right center; }
        .ws-chiziq.tik.h-chizil .ws-chiziq-i { transform-origin: center top; animation: ws-chizy 0.6s ease-out both; }
        @keyframes ws-chizx { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes ws-chizy { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .ws-chiziq.h-ochiq .ws-chiziq-i { animation: ws-ochiq 2.6s ease-in-out infinite; }
        @keyframes ws-ochiq { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; } 50% { box-shadow: 0 0 9px 1px ${fon(T.ok, 0.45)}; } }
        .ws-chiziq.h-uzildi .ws-chiziq-i { opacity: 1; background: ${T.err}; animation: ws-uzildi 0.55s ease-in both; }
        @keyframes ws-uzildi { 0% { opacity: 1; } 100% { opacity: 0; } }
        .ws-chiziq.h-tiklan .ws-chiziq-i::after { content: ''; position: absolute; inset: 0; background: ${T.ok}; transform-origin: left center; animation: ws-chizx 2s linear both; }
        .ws-chiziq.tik.h-tiklan .ws-chiziq-i::after { transform-origin: center top; animation-name: ws-chizy; }
        .ws-chiziq.h-yopiq .ws-chiziq-i { opacity: 0; background: ${T.ok}; animation: ws-uzildi 0.6s ease-in both; }
        .ws-chiziq-y { position: absolute; z-index: 2; left: 50%; top: calc(50% - 30px); transform: translateX(-50%); padding: 1px 8px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; font-family: 'Manrope'; font-size: 12px; font-weight: 800; color: ${T.ink2}; white-space: nowrap; animation: fade-in-up 0.4s ease-out both; }
        .ws-chiziq-y.ok { color: ${T.ok}; border-color: ${fon(T.ok, 0.5)}; }
        .ws-chiziq-y.past { top: calc(50% + 10px); color: ${T.err}; border-color: ${fon(T.err, 0.45)}; }
        .ws-chiziq.tik .ws-chiziq-y { top: 50%; left: calc(50% + 14px); transform: translateY(-50%); }
        .ws-chiziq.tik .ws-chiziq-y.past { left: auto; right: calc(50% + 14px); }
        .ws-chiziq-r { position: absolute; z-index: 2; left: -4px; top: calc(50% - 12px); width: 22px; height: 22px; border-radius: 50%; background: ${T.paper}; border: 1px solid ${T.line}; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; color: ${T.accent}; }
        .ws-chiziq.tik .ws-chiziq-r { left: calc(50% - 11px); top: -4px; }
        .ws-chiziq-r.aylan { animation: ws-aylan 1s linear infinite; }
        @keyframes ws-aylan { to { transform: rotate(360deg); } }
        .ws-kv { position: absolute; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 2px; pointer-events: none; animation-duration: 0.9s; animation-timing-function: ease-in-out; animation-fill-mode: both; }
        .ws-kv.qaytadi { animation-duration: 1.1s; } .ws-kv.sonadi { animation-duration: 1s; }
        .ws-chiziq.yot .ws-kv { top: 50%; transform: translate(-50%, -28%); }
        .ws-chiziq.tik .ws-kv { left: 50%; transform: translate(-50%, -50%); }
        .ws-kv-i { position: relative; display: block; width: 26px; height: 18px; border-radius: 4px; background: ${T.paper}; border: 1.5px solid ${T.accent}; overflow: hidden; flex: none; }
        .ws-kv-i::before { content: ''; position: absolute; left: 50%; top: -9px; width: 15px; height: 15px; border: 1.5px solid ${T.accent}; transform: translateX(-50%) rotate(45deg); }
        .ws-kv.hodisa .ws-kv-i, .ws-konvert .ws-kv-i { background: ${T.accent}; }
        .ws-kv.hodisa .ws-kv-i::before, .ws-konvert .ws-kv-i::before { border-color: ${T.paper}; }
        .ws-konvert.ochiq .ws-kv-i::before { border-color: ${T.ok}; top: 9px; }
        .ws-kv-y { order: -1; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; padding: 1px 6px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; white-space: nowrap; }
        .ws-kv.hodisa .ws-kv-y { color: ${T.accent}; border-color: ${fon(T.accent, 0.45)}; }
        @keyframes ws-kv-x-ab { from { left: 0%; } to { left: 100%; } }
        @keyframes ws-kv-x-ba { from { left: 100%; } to { left: 0%; } }
        @keyframes ws-kv-y-ab { from { top: 0%; } to { top: 100%; } }
        @keyframes ws-kv-y-ba { from { top: 100%; } to { top: 0%; } }
        @keyframes ws-kv-x-qaytadi { 0% { left: 100%; } 40% { left: 72%; } 50% { left: 66%; } 58% { left: 74%; } 66% { left: 66%; } 100% { left: 100%; opacity: 0.2; } }
        @keyframes ws-kv-y-qaytadi { 0% { top: 100%; } 40% { top: 72%; } 50% { top: 66%; } 58% { top: 74%; } 66% { top: 66%; } 100% { top: 100%; opacity: 0.2; } }
        @keyframes ws-kv-x-sonadi { 0% { left: 100%; opacity: 1; } 60% { left: 50%; opacity: 1; } 100% { left: 50%; opacity: 0; } }
        @keyframes ws-kv-y-sonadi { 0% { top: 100%; opacity: 1; } 60% { top: 50%; opacity: 1; } 100% { top: 50%; opacity: 0; } }
        /* Konvert ichi, sahna tugmalari, kod kartalari */
        .ws-ochkonv { display: flex; flex-direction: column; gap: 5px; width: 236px; max-width: 236px; padding: 8px 10px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.ok}; }
        .ws-ochkonv-q { display: flex; flex-direction: column; gap: 1px; font-size: 12px; }
        .ws-ochkonv-q em { font-style: normal; font-weight: 700; color: ${T.ink2}; min-width: 62px; }
        .ws-ochkonv-q code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; white-space: nowrap; }
        .ws-qayta, .ws-tokensiz, .ws-token { padding: 8px 14px; border: 1.5px solid ${T.ink}; border-radius: 10px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-size: 13px; font-weight: 800; cursor: pointer; white-space: nowrap; }
        .ws-qayta:disabled, .ws-tokensiz:disabled, .ws-token:disabled { cursor: default; }
        .ws-qayta.xira { opacity: 0.45; }
        .ws-tokensiz.bajarildi { border-color: ${T.line}; color: ${T.ink2}; }
        .ws-tugmalar { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
        .ws-kod { display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 400px; padding: 10px 12px; border-radius: 12px; background: ${CODE.bg}; color: ${CODE.text}; }
        .ws-kod-y { font-size: 11.5px; color: ${CODE.punct}; }
        .ws-kod-y code { font-family: 'JetBrains Mono', monospace; color: ${CODE.attr}; }
        .ws-kod-p { display: flex; flex-direction: column; overflow-x: auto; }
        .ws-kod-q { display: block; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.6; white-space: pre; padding: 0 4px; border-radius: 4px; transition: background 0.3s; }
        .ws-kod-q.yon { background: ${fon(CODE.attr, 0.16)}; box-shadow: inset 2px 0 0 ${CODE.attr}; } /* qizil fon xato qatordek o'qilardi (F-1006-379) */ .ws-kod-q.xira { background: ${fon(T.paper, 0.1)}; color: ${CODE.comment}; }
        .ws-kod-q.err { background: ${fon(T.err, 0.45)}; } .ws-kod-q.ok { background: ${fon(T.ok, 0.4)}; }
        .ws-kod-ok { color: ${CODE.str}; }
        .ws-kod-iz { font-size: 11.5px; line-height: 1.45; color: ${CODE.punct}; }
        .ws-kod-iz .qcode { background: ${fon(T.paper, 0.12)}; color: ${CODE.attr}; }
        .ws-uch-belgi { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
        .ws-readme { white-space: nowrap; display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; color: ${T.ink}; animation: fade-in-up 0.4s ease-out 0.9s both; }
        .ws-readme b { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        p.ws-reja-past { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        .ws-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; font-size: 13px; color: ${T.ink2}; }
        .ws-ustoz b { color: ${T.ink}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        /* 12-ekran: telefon chapda, sxema jadvali o'ngda */
        .ws-sx { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 18px; align-items: start; }
        .ws-sx-tel .ws-sahna { padding-top: 30px; }
        .ws-sx-ong { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .ws-sx-j { display: flex; flex-direction: column; gap: 6px; }
        .ws-sx-ram { border: 1px solid ${fon(T.ink, 0.2)}; border-radius: 10px; overflow: hidden; background: ${fon(T.ink, 0.025)}; }
        .ws-sx-bar { display: flex; align-items: center; gap: 7px; padding: 6px 10px; background: ${T.ink}; color: ${fon(T.paper, 0.82)}; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .ws-sx-bar b { margin-left: auto; font-weight: 700; color: ${T.paper}; }
        .ws-sx-jadval { display: flex; flex-direction: column; }
        .ws-sx-r > span + span { border-left: 1px solid ${fon(T.ink, 0.1)}; }
        .ws-sx-r:not(.bosh):not(.joy):nth-child(odd) { background: ${fon(T.ink, 0.03)}; }
        .ws-sx-r { display: grid; grid-template-columns: 1.1fr 1.2fr 1.15fr 0.9fr 1.1fr; gap: 0; border-top: 1px solid ${T.line}; }
        .ws-sx-r:first-child { border-top: 0; }
        .ws-sx-r > span { padding: 6px 8px; font-size: 12px; line-height: 1.35; color: ${T.ink}; overflow-wrap: anywhere; }
        .ws-sx-r > span code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.accent}; }
        .ws-sx-r.bosh > span { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; background: ${fon(T.ink, 0.07)}; }
        .ws-sx-r.yangi { animation: ws-qator 1.2s ease-out both; }
        @keyframes ws-qator { 0% { opacity: 0; transform: translateX(16px); background: ${fon(T.ok, 0.22)}; } 30% { opacity: 1; transform: none; background: ${fon(T.ok, 0.22)}; } 100% { background: transparent; } }
        .ws-sx-r.joy { grid-template-columns: 1fr; }
        .ws-sx-r.joy > span { margin: 6px 8px; padding: 6px; border: 1.5px dashed ${fon(T.ink, 0.25)}; border-radius: 8px; color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .ws-sx-alt { display: none; flex-wrap: wrap; gap: 4px 12px; font-size: 12.5px; color: ${T.ink2}; } /* faqat tor ekranda («Kim oladi» ustuni yashirilganda) */
        .ws-sx-alt b { color: ${T.ink}; }
        .ws-sx-kim { display: none; font-style: normal; }
        .ws-sx-karta { display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.3)}; box-shadow: 0 14px 30px -18px ${fon(T.accent, 0.45)}; }
        .ws-sx-karta.silk { animation: q-silk 0.32s ease-in-out; }
        .ws-sx-kt { font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .ws-sx-sabablar { display: flex; flex-wrap: wrap; gap: 8px; }
        .ws-sabab { font-family: 'JetBrains Mono', monospace; }
        /* 9-ekran: kod oynasi */
        .ws-vazifa { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .ws-vazifa li { display: flex; gap: 8px; align-items: flex-start; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .ws-vazifa li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.bg}; color: ${T.ink2}; border: 1px solid ${T.line}; }
        .ws-vazifa li.ok i { background: ${T.ok}; color: #fff; border-color: ${T.ok}; }
        .ws-vazifa.ixcham li { font-size: 12.5px; color: ${T.ink2}; }
        .ws-kod-natija { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
        .ws-kyordam { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 10px; }
        .ws-yordam-q { display: flex; flex-direction: column; gap: 6px; }
        .ws-bajardim { display: flex; justify-content: flex-end; margin-top: 12px; }
        .ws-kodoyna { display: flex; flex-direction: column; gap: 12px; }
        .ws-amal { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .ws-amal-t { font-size: 13px; color: ${T.ink2}; }
        .ws-kompil { position: fixed; inset: 0; z-index: 2000; background: ${T.bg}; }
        .ws-no { border: 1.5px solid ${T.line}; border-radius: 14px; overflow: hidden; background: ${T.paper}; transition: opacity 0.3s; }
        .ws-no.xira { opacity: 0.55; }
        .ws-no-bar { display: flex; align-items: center; gap: 5px; padding: 7px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .ws-no-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; }
        .ws-no-bar b { margin-left: 6px; font-size: 11.5px; color: ${T.ink2}; }
        .ws-no-tana { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 14px 16px; }
        .ws-no-p { font-size: 13px; color: ${T.ink2}; }
        .ws-no-h { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; }
        .ws-no-btn { padding: 8px 14px; border: 0; border-radius: 10px; background: ${T.ink}; color: ${T.paper}; font-family: 'Manrope'; font-size: 13px; font-weight: 700; cursor: pointer; }
        .ws-no-btn:disabled { opacity: 0.5; cursor: default; }
        .ws-no-k { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; overflow-wrap: anywhere; }
        /* 13-ekran: mustaqil ish */
        .ws-ms-chiziq { display: flex; flex-wrap: wrap; gap: 6px; }
        .ws-ms-q { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 4px 10px 4px 4px; border-radius: 999px; border: 1px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope'; font-size: 12px; color: ${T.ink}; cursor: pointer; animation: ws-kirdi 0.35s ease-out both; }
        .ws-ms-q span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ws-ms-q i { flex: none; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.ok}; color: #fff; }
        .ws-ms-q.joriy { border-color: ${T.accent}; } .ws-ms-q.joriy i { background: ${T.accent}; }
        .ws-ms-q.yangi { padding-right: 4px; cursor: default; }
        .ws-ms-forma { display: flex; flex-direction: column; gap: 12px; }
        .ws-ms-karta { display: flex; flex-direction: column; gap: 8px; max-width: 640px; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 12px 26px -18px rgba(${T.shadowBase},0.4); }
        .ws-ms-maydon { position: relative; display: block; }
        .ws-ms-n { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; pointer-events: none; }
        .ws-ms-maydon .ws-ms-inp { padding-left: 38px; }
        .ws-ms-l { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .ws-ms-l i { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 10.5px; background: ${T.accentSoft}; color: ${T.accent}; }
        .ws-ms-s { font-size: 12.5px; color: ${T.ink2}; }
        .ws-ms-inp { width: 100%; padding: 8px 10px; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.bg}; font-family: 'Manrope'; font-size: 14px; color: ${T.ink}; }
        .ws-ms-inp:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .ws-ms-inp::placeholder { color: ${fon(T.ink, 0.4)}; }
        .ws-ms-tugmalar, .ws-ms-past { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 2px; }
        .ws-ms-past { max-width: 640px; }
        .ws-ms-yordam { margin-left: auto; }
        .ws-yordam-misol { display: flex; flex-direction: column; gap: 3px; max-width: 640px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px dashed ${fon(T.ink, 0.22)}; font-size: 13px; color: ${T.ink}; }
        .ws-yordam-misol > b { font-size: 11.5px; font-weight: 800; color: ${T.ink2}; margin-bottom: 2px; }
        .ws-yordam-misol > span { display: flex; gap: 8px; align-items: baseline; }
        .ws-yordam-misol i { flex: none; width: 16px; font-style: normal; font-size: 11px; font-weight: 800; color: ${T.accent}; }
        .ws-ms-ix { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 12px; background: ${fon(T.ok, 0.1)}; border: 1px solid ${fon(T.ok, 0.4)}; font-size: 14px; color: ${T.ink}; align-self: flex-start; }
        .ws-ok { font-style: normal; color: ${T.ok}; font-weight: 800; }
        /* Amaliyot bloklari */
        .ws-trek { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .ws-trek-g { display: inline-flex; gap: 6px; padding: 3px; border-radius: 12px; }
        .ws-band { display: block; margin-top: 6px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .ws-ps { display: block; margin: 2px 0; font-size: 13px; line-height: 1.5; }
        .ws-joy-n { margin-left: 6px; font-size: 12px; color: ${fon(T.ink, 0.5)}; font-style: italic; }
        .ws-yordam-btn { margin-top: 6px; }
        .ws-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px dashed ${T.line}; }
        .ws-yordam-s { display: block; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; }
        p.ws-ortda, p.ws-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        p.ws-ulgur { padding: 6px 10px; border-left: 0; border-radius: 10px; background: ${T.bg}; }
        .ws-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 1px 6px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; }
        .ws-a1n { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .ws-fayllar { display: flex; flex-direction: column; gap: 4px; width: 100%; max-width: 320px; padding: 8px 10px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ws-fayl { display: flex; justify-content: space-between; gap: 10px; font-size: 12px; }
        .ws-fayl code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; overflow-wrap: anywhere; }
        .ws-fayl em { font-style: normal; color: ${T.ok}; font-weight: 700; white-space: nowrap; }
        .ws-brauzer { width: 100%; max-width: 320px; border: 1.5px solid ${T.ink}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .ws-br-bar { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .ws-br-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; }
        .ws-br-bar code { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .ws-br-tana { display: flex; flex-direction: column; gap: 8px; padding: 12px; }
        .ws-rd { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ws-rd-gh { font-size: 11.5px; color: ${T.ink2}; }
        .ws-rd-gh code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink}; }
        .ws-rd-h { font-size: 17px; font-weight: 800; color: ${T.ink}; padding-bottom: 4px; border-bottom: 1px solid ${T.line}; }
        .ws-rd-j { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 8px; overflow: hidden; }
        .ws-rd-r { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); border-top: 1px solid ${T.line}; animation: ws-kirdi 0.4s ease-out both; }
        .ws-rd-r:first-child { border-top: 0; }
        .ws-rd-r > span { padding: 4px 5px; font-size: 10px; line-height: 1.3; color: ${T.ink}; overflow-wrap: anywhere; }
        .ws-rd-r.bosh > span { font-weight: 800; color: ${T.ink2}; background: ${T.bg}; }
        .ws-rd-p { font-size: 11.5px; line-height: 1.5; color: ${T.ink}; }
        /* Kartochkalar va yakun */
        .ws-flash { display: flex; flex-direction: column; gap: 10px; }
        /* 14-ekran tartibi: texnik darslar naqshi — oq bo'lak, accent chegara, «⠿» tutqich; uyalar past (F-1006-384; 159/4, 4a-Modul) */
        .ws-tartib .q-dd-slots { gap: 7px; }
        .ws-tartib .q-dd-slot { min-height: 46px; padding: 5px 10px; border-radius: 12px; }
        .ws-tartib .q-dd-pool { gap: 7px; }
        .ws-tartib .q-dd-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px, 1.5vw, 14px); line-height: 1.35; color: ${T.accent}; background: ${T.paper}; border: 2px solid ${T.accent}; border-radius: 10px; padding: 7px 12px 7px 10px; text-align: left; box-shadow: 0 6px 14px -10px ${fon(T.accent, 0.6)}; }
        .ws-tartib .q-dd-chip::before { content: '⠿'; margin-right: 7px; opacity: 0.7; }
        .ws-tartib .q-dd-chip code, .ws-tartib .q-dd-chip .qcode { font-family: 'JetBrains Mono', monospace; font-size: 0.92em; padding: 0 4px; border-radius: 4px; background: ${T.accentSoft}; color: ${T.accent}; }
        .ws-tartib .q-dd-slot .q-dd-chip { min-width: 0; }
        .ws-tartib .q-dd-slot.ok .q-dd-chip { border-color: ${T.ok}; color: ${T.ok}; box-shadow: none; }
        .ws-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: ws-puls 1.8s ease-out .4s 3; } /* 10-Modul naqshi: ingichka chegara, puls 3 marta (F-1006-387) */
        p.ws-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.ws-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .ws-yakun { display: contents; }
        .ws-yakun.yoq-chip .done-chip { display: none; }
        .ws-hw { display: flex; flex-direction: column; gap: 10px; }
        .ws-hw-karta { display: flex; flex-wrap: wrap; gap: 8px 16px; }
        .ws-hw-q { display: inline-flex; gap: 6px; align-items: baseline; font-size: 13px; }
        .ws-hw-q em { font-style: normal; color: ${T.ink2}; } .ws-hw-q b { color: ${T.ink}; }
        .ws-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .ws-hw-qadam li { display: flex; gap: 8px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .ws-hw-qadam li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        .ws-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        /* ⛶ kattalashtirish — skeletda tushib qolgan qoida (SABOQ 38) */
        /* ikki klassli selektor: keyingi «.zoomable position relative» qoidasi oynani joyidan siljitib, ekran chetidan kesardi (F-1006-386) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(920px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        /* ⛶ oynasi ekran markazida: ota-blokdagi animatsiya/transform «position: fixed»ni o'ziga bog'lab, oynani siljitib kesardi (A2 natijasi — F-1006-386) */
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 900px) {
          .ws-sx { grid-template-columns: 1fr; justify-items: center; }
          .ws-sx-ong { width: 100%; }
          .ws-sx-r { grid-template-columns: 1fr 1fr 1fr 1fr; }
          .ws-sx-kimc { display: none; }
          .ws-sx-kim { display: inline; } .ws-sx-alt { display: flex; }
        }
        @media (max-width: 640px) { .ws-sahna { padding-top: 60px; } .ws-sx-tel .ws-sahna { padding-top: 60px; } }
        @media (max-width: 400px) {
          .ws-sahna.tik.ikki { grid-template-columns: 168px 168px; column-gap: 6px; }
          .ws-sahna.tik.ikki .ws-tel-ust, .ws-sahna.tik.ikki .ws-telefon { width: 168px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ws-halqa, .ws-k.faol .q-variant, .ws-halqa-g .q-chip, .ws-chorla > .q-chip, .ws-flash.yangi .fc-card .fc-front { animation: none !important; }
          .ws-kv { display: none !important; }
          .ws-pop, .ws-son.yangi, .ws-doiralar i.yangi, .ws-chiziq-i, .ws-chiziq-i::after, .ws-chiziq-r.aylan, .ws-belgi, .ws-belgi-n, .ws-tel-ekran, .ws-backend.tugildi, .ws-karta.yangi, .ws-sx-r.yangi, .ws-rd-r, .ws-ms-q, .ws-konvert, .ws-readme, .ws-eski, .ws-chiziq-y { animation: none !important; transition: none !important; }
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
