import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 14-Modul (LMS) 3-dars «Mahsulot tezligi: o'lchaymiz va tezlashtiramiz» — TEX, modul cho'qqisi (MD: feedback/F-1008-14modul/03-ProductSpeed-v3.md).
// Skeletdan (src/skelet/NamunaDars.jsx) qurildi, 08.10.2026 (F-1008-572). 19 ekran: 0 QKirish · 1 QReja · 2, 4, 5, 7, 9 QTushuncha · 3, 6, 8, 10 test (QTest) ·
//   11 QTushuncha (mashq: haqiqiy hisobotdan tuzatish tanlash, ballsiz) · 12 karta dastasi (final) · 13–15 amaliyot bloki (QBlok) · podium · kartochkalar · yakun.
// Bitta vizual — «telefon brauzeri + Lighthouse hisoboti» (TANISH_SAYT — haqiqiy o'lchov 08.10.2026, LH_CHEGARA, LH_MEZON, ISH_TARTIBI). F-1008-594: tanish saytlar, Mentor sonlari olib tashlandi.
// qolip-maket: tz-ochish tz-analyze tz-desktop tz-sekin tz-element tz-bos tz-olcham tz-hammasi tz-keyin tz-tepa tz-ilova tz-olib tz-qayta tz-tk-ix tz-btn tz-ls-t tz-is-t tz-nusxa
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm12-03-v1', lessonTitle: { uz: "Mahsulot tezligi: o'lchaymiz va tezlashtiramiz", ru: 'Скорость продукта: измеряем и ускоряем' } }; // 14-Modul 3-dars (LMS), 1-to'lqin pilot — MD feedback/F-1008-14modul/03-ProductSpeed-v3.md
const HW_TOKENS = [
  { t: { uz: 'TEZLIK.md', ru: 'TEZLIK.md' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'Lighthouse', ru: 'Lighthouse' }, l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'oldin', ru: 'до' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'keyin', ru: 'после' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
// 19 ekran (MD KOD 1): hook · rule · exploration · test · exploration ×2 · test · exploration · test · exploration · test · practice(kod) · test(final) · practice(blok) ×3 · stats · flashcards · summary
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
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). s3 B · s6 D · s8 A · s10 C (MD ✔); s12 — final (picked 0/1 sentinel, correct maydoni haqiqiy).
// Mashq (11) va bloklar (13, 14, 15) — `practice: -1` (signal 500+ zonasida, variant yo'q).
const INLINE_KEYS = { s3: 1, s6: 3, s8: 0, s10: 2, s12: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI). Kod qatori bor joyda kod, qolganida raqam (S-026)
const rcKod = (s) => <code className="qcode">{s}</code>;
const rcRaqam = (n) => <b className="tz-rc-n">{n}</b>;
const RECAPS = {
  3: {
    title: { uz: 'Bir xil sharoit', ru: 'Одинаковые условия' },
    cards: [
      { ic: null, h: { uz: "O'sha sahifa — oldin ham, keyin ham lending.", ru: 'Та же страница — и «до», и «после» лендинг.' }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: "O'sha rejim", ru: 'Тот же режим' }, body: { uz: rcKod('Device: Mobile'), ru: rcKod('Device: Mobile') } },
      { ic: null, h: { uz: "Incognito oyna — qo'shilgan dasturlar aralashmaydi.", ru: 'Окно Incognito — расширения не вмешиваются.' }, body: { uz: rcRaqam(3), ru: rcRaqam(3) }, ask: { uz: "Oldin Desktop'da, keyin Mobile'da o'lchasangiz, farq nimadan chiqqanini qanday bilasiz?", ru: 'Если сначала мерить в Desktop, а потом в Mobile, как узнать, откуда разница?' } }
    ]
  },
  6: {
    title: { uz: 'Rasm joyi', ru: 'Место картинки' },
    cards: [
      { ic: null, h: { uz: "Rasm kelguncha joyi bo'sh — tugma tepada.", ru: 'Пока картинки нет, её место пустое — кнопка наверху.' }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: 'Rasm keldi, tugma suriladi', ru: 'Картинка пришла, кнопка сдвигается' }, body: { uz: rcKod('CLS'), ru: rcKod('CLS') } },
      { ic: null, h: { uz: 'Joy oldindan band', ru: 'Место занято заранее' }, body: { uz: rcKod('width="180" height="320"'), ru: rcKod('width="180" height="320"') }, ask: { uz: "Tugma pastga sakrasa, odam qayerni bosib qo'yishi mumkin?", ru: 'Если кнопка прыгнет вниз, куда может нажать человек?' } }
    ]
  },
  8: {
    title: { uz: 'Keyin yuklash', ru: 'Загрузка позже' },
    cards: [
      { ic: null, h: { uz: 'Pastdagi rasm', ru: 'Нижняя картинка' }, body: { uz: rcKod('loading="lazy"'), ru: rcKod('loading="lazy"') } },
      { ic: null, h: { uz: 'Unga yaqinlashganda yuklanadi.', ru: 'Загружается, когда к ней приближаются.' }, body: { uz: rcRaqam(2), ru: rcRaqam(2) } },
      { ic: null, h: { uz: 'Tepadagi rasm — sahifa bilan birga, atributsiz.', ru: 'Верхняя картинка — вместе со страницей, без атрибута.' }, body: { uz: rcRaqam(3), ru: rcRaqam(3) }, ask: { uz: "Tepadagi rasm kech chiqsa, Lighthouse'dagi qaysi son o'zgaradi?", ru: 'Если верхняя картинка появится поздно, какое число в Lighthouse изменится?' } }
    ]
  },
  10: {
    title: { uz: 'Brauzer band vaqti', ru: 'Время занятости браузера' },
    cards: [
      { ic: null, h: { uz: "Sahifa ko'rinadi, lekin brauzer kodni bajaryapti.", ru: 'Страница видна, но браузер выполняет код.' }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: "Ochilishda brauzer band bo'lgan vaqt", ru: 'Время, когда браузер занят при открытии' }, body: { uz: rcKod('TBT, ms'), ru: rcKod('TBT, ms') } },
      { ic: null, h: { uz: 'Bu misolda kod kamaygach, tugma ertaroq javob berdi.', ru: 'В этом примере, когда кода стало меньше, кнопка ответила раньше.' }, body: { uz: rcRaqam(3), ru: rcRaqam(3) }, ask: { uz: "Kutubxonani o'chirishdan oldin nega dalil so'raladi?", ru: 'Почему перед удалением библиотеки просят доказательство?' } }
    ]
  },
  12: {
    title: { uz: 'Ish tartibi', ru: 'Порядок работы' },
    cards: [
      { ic: null, h: { uz: "O'lchash · «Oldin»", ru: 'Замер · «До»' }, body: { uz: rcRaqam('1 · 2'), ru: rcRaqam('1 · 2') } },
      { ic: null, h: { uz: "Ro'yxat · Dalilli tuzatish", ru: 'Список · Исправление с доказательством' }, body: { uz: rcRaqam('3 · 4'), ru: rcRaqam('3 · 4') } },
      { ic: null, h: { uz: "Qayta o'lchash · Solishtirish", ru: 'Повторный замер · Сравнение' }, body: { uz: rcRaqam('5 · 6'), ru: rcRaqam('5 · 6') }, ask: { uz: "Avval tuzatib, keyin o'lchasangiz, nimani bilolmay qolasiz?", ru: 'Если сначала исправить, а потом мерить, что вы не сможете узнать?' } }
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

// ===== 14-Modul 3-dars yordamchilari (tz- prefiksi: global .mentor va boshqa darslar bilan to'qnashmaydi) =====
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const halqa = (on) => (on ? 'tz-halqa' : undefined);
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
const NB = ' ';
// Son ko'rinishi: null — o'lchanmagan («—», son to'qilmaydi); o'nlik vergul bilan
const sonYoz = (v, birlik) => (v == null || v === '' ? '—' : String(v).replace('.', ',') + (birlik ? NB + birlik : ''));
const Bo = ({ on, className, children, ...p }) => (on ? <button type="button" className={className} onClick={on} {...p}>{children}</button> : <span className={className}>{children}</span>);
const SoatIc = () => <svg className="tz-soat" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 4.6V8l2.4 1.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;

// Bashorat: tanlangach yopilmaydi — ixcham qator natijagacha turadi (SABOQ 11); variantlar — har birining o'z yengil chegarasi (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="tz-chorla"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="tz-bash-ix fade-step"><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosaning birinchi kichik qatori; QIzoh — oxirgi kichik qatori (E 42)
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="tz-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="tz-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="tz-x-m">{matn}</span>{izoh && <span className="tz-x-iz">{izoh}</span>}</>;
const QADAMLAR_Y = { uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' };
const navYorliq = (taxmin, q, jami, done) => (done ? { uz: 'Davom etish', ru: 'Продолжить' }
  : !taxmin ? BASH_YORLIQ
    : { uz: `${QADAMLAR_Y.uz} (${q}/${jami})`, ru: `${QADAMLAR_Y.ru} (${q}/${jami})` });
const NomQator = ({ matn }) => (matn ? <p className="tz-nom fade-step">{tx(matn)}</p> : null);
const Ustoz = ({ satrlar }) => (useMentorLive() ? <div className="tz-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div> : null);
// Qadam belgilari — harakat tugmasi yonida (SABOQ 21)
const Qadamlar = ({ q, list }) => <span className="tz-qb">{list.map((t, i) => <span key={i} className={cx('tz-qb-i', i < q && 'ok', i === q && 'joriy')}><i>{i < q ? '✓' : i + 1}</i>{tr(t)}</span>)}</span>;

// ===== BITTA VIZUAL — telefon brauzeri + Lighthouse hisoboti (F-1008-594: tanish saytlar, haqiqiy o'lchov; 163/180): hamma ekran shu manbalardan o'qiydi =====
// Lighthouse'ning o'z uch rangi — faqat panel ichida (brend rangi kabi, D3 tokenlaridan tashqarida; MD KOD 3). Rang ma'nosi matnda so'z bilan (2-ekran)
const LH_RANG = { qizil: '#FF4E42', sariq: '#FFA400', yashil: '#0CCE6B' };
// Rasmiy chegaralar (Manbalar 1, 3, 5): 0–49 · 50–89 · 90–100; LCP 2,5 s; CLS 0,1; TBT (Mobile) 200 ms
const LH_CHEGARA = {
  baho: [{ dan: 0, gacha: 49, rang: 'qizil', h: 'q' }, { dan: 50, gacha: 89, rang: 'sariq', h: 's' }, { dan: 90, gacha: 100, rang: 'yashil', h: 'y' }],
  lcp: 2.5, cls: 0.1, tbt: 200
};
const bahoRang = (b) => { if (b == null) return null; const o = LH_CHEGARA.baho.find(x => b >= x.dan && b <= x.gacha); return o ? o.rang : null; };
// Metrika belgisi (▲ qizil · ■ to'q sariq · ● yashil) — Lighthouse ball egri chizig'idagi ikki nuqta (yashil chegarasi · qizil boshlanishi), Mobile va Desktop alohida
const LH_MEZON = {
  mobile: { fcp: [1.8, 3], lcp: [2.5, 4], tbt: [200, 600], cls: [0.1, 0.25], si: [3.4, 5.8] },
  desktop: { fcp: [0.9, 1.6], lcp: [1.2, 2.4], tbt: [150, 350], cls: [0.1, 0.25], si: [1.3, 2.3] }
};
const lhH = (rejim, id, v) => { const m = LH_MEZON[rejim][id]; return v <= m[0] ? 'y' : v <= m[1] ? 's' : 'q'; };
const METRIK = [
  { id: 'fcp', nom: 'First Contentful Paint', b: 's' },
  { id: 'lcp', nom: 'Largest Contentful Paint', b: 's' },
  { id: 'tbt', nom: 'Total Blocking Time', b: 'ms' },
  { id: 'cls', nom: 'Cumulative Layout Shift', b: '' },
  { id: 'si', nom: 'Speed Index', b: 's' }
];
const metrik = (id) => METRIK.find(m => m.id === id);
const sonF = (v) => (v == null ? '' : Number.isInteger(v) && Math.abs(v) >= 1000 ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, NB) : String(v).replace('.', ','));
// Tanish saytlar (qaror A, 08.10): sonlar FAQAT feedback/F-1008-14modul/vositalar/olchov-2026-10-08.json dan — Lighthouse 13.5.0, Mobile (simulated throttling), har sayt bir o'lchov.
// Nom rangi faqat tasdiqlangani: YouTube #FF0000 · Texnomart #FBC100 (sariq matn o'qilmaydi — ink matn + sariq nuqta). OLX, Kun.uz, Olcha — rang o'lchanmagan, ink. Logotip va sayt surati yo'q.
const TANISH_SAYT = {
  youtube: { nom: 'YouTube', manzil: 'youtube.com', rang: '#FF0000', mobile: { baho: 31, fcp: 6.3, si: 7.1, lcp: 7.8, tbt: 1997, cls: 0.001 } },
  olx: { nom: 'OLX', manzil: 'olx.uz', mobile: { baho: 30, fcp: 3.1, si: 10.8, lcp: 7.5, tbt: 7725, cls: 0.066, keraksizKib: 1354 } },
  kun: { nom: 'Kun.uz', manzil: 'kun.uz', mobile: { baho: 54, fcp: 1.7, si: 6.4, lcp: 3.8, tbt: 2141, cls: 0.006 }, desktop: { baho: 74, fcp: 0.8, si: 1.6, lcp: 3.5, tbt: 174, cls: 0 } },
  texnomart: { nom: 'Texnomart', manzil: 'texnomart.uz', rang: '#FBC100', nuqta: true, mobile: { baho: 9, fcp: 1.8, si: 13.0, lcp: 19.8, tbt: 5170, cls: 1.544, siljish: 5 } },
  olcha: { nom: 'Olcha', manzil: 'olcha.uz', mobile: { baho: 36, fcp: 1.6, si: 9.6, lcp: 6.1, tbt: 4114, cls: 0.106, olchamsizRasm: 6 } }
};
const TEZLIK_SAHNA = {
  // 7-ekran vaqt chizig'i: 4 belgi (son yo'q — namuna sahifa)
  chiziq: [
    { id: 'ochildi', t: { uz: 'ochildi', ru: 'открылась' }, x: 3 },
    { id: 'matn', t: { uz: 'birinchi matn', ru: 'первый текст' }, x: 33 },
    { id: 'katta', t: { uz: 'eng katta narsa', ru: 'самое большое' }, x: 62 },
    { id: 'hamma', t: { uz: 'hamma rasm', ru: 'все картинки' }, x: 94 }
  ],
  // 9-ekran kod ustuni (OLX: «Reduce unused JavaScript» 1 354 KiB ≈ 1,3 MB)
  kod: [
    { id: 'ilova', t: { uz: 'sahifa kodi', ru: 'код страницы' }, h: 3 },
    { id: 'kerakli', t: { uz: 'kerakli kutubxonalar', ru: 'нужные библиотеки' }, h: 2 },
    { id: 'ortiq', t: { uz: 'ishlatilmaydigan kod ≈1,3' + NB + 'MB', ru: 'неиспользуемый код ≈1,3' + NB + 'MB' }, h: 2, ust: { uz: 'yuklanadi, ishlatilmaydi', ru: 'загружается, не используется' } }
  ]
};
// Final (12-ekran) va kartochka shu tartibdan o'qiydi
const ISH_TARTIBI = [
  { id: 'olch', label: { uz: "Sahifani Mobile rejimida o'lchash", ru: 'Замерить страницу в режиме Mobile' } },
  { id: 'oldin', label: { uz: "Sonlarni «Oldin» deb yozish", ru: 'Записать числа как «Было»' } },
  { id: 'royxat', label: { uz: "Agentdan rasm va kutubxona ro'yxatini olish", ru: 'Получить у агента список картинок и библиотек' } },
  { id: 'tuzat', label: { uz: 'Dalili bor tuzatishni tanlab qilish', ru: 'Выбрать и сделать исправление с доказательством' } },
  { id: 'qayta', label: { uz: "Xuddi shu sharoitda qayta o'lchash", ru: 'Перемерить в тех же условиях' } },
  { id: 'sol', label: { uz: 'Oldin va keyin sonlarini solishtirish', ru: 'Сравнить числа «до» и «после»' } }
];

// --- kichik qismlar ---
const SODDA_Y = { uz: 'soddalashtirilgan sahna', ru: 'упрощённая сцена' };
const NAMUNA_Y = { uz: 'namuna', ru: 'образец' };
const Sodda = ({ matn }) => <span className="tz-sodda">{tr(matn || SODDA_Y)}</span>;
const Manba = ({ toliq }) => <span className="tz-manba">{toliq ? tr({ uz: "Lighthouse · Mobile · 08.10.2026, bir o'lchov", ru: 'Lighthouse · Mobile · 08.10.2026, один замер' }) : tr({ uz: "08.10 o'lchovi", ru: 'замер 08.10' })}</span>;
const SaytNom = ({ s }) => <span className="tz-snom" style={s.rang && !s.nuqta ? { color: s.rang } : undefined}>{s.nuqta && <i style={{ background: s.rang }} />}{s.nom}</span>;
const QulfIc = () => <svg className="tz-qulf" viewBox="0 0 12 12" width="9" height="9" aria-hidden="true"><rect x="2.2" y="5.2" width="7.6" height="5.6" rx="1.2" fill="currentColor" /><path d="M3.8 5.4V3.9a2.2 2.2 0 0 1 4.4 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>;
const LupaIc = () => <svg className="tz-lupa" viewBox="0 0 14 14" width="11" height="11" aria-hidden="true"><circle cx="6" cy="6" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M9.2 9.2l3.3 3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
const RasmIc = () => <svg className="tz-rasm-ic" viewBox="0 0 24 18" width="22" height="16" aria-hidden="true"><rect x="1" y="1" width="22" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="7.5" cy="6" r="2" fill="currentColor" /><path d="M2.5 15.5l6-6 4 4 3-3 6 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
// Rasm joyi: 'kut' (hali kelmagan — kulrang, miltillaydi) · 'joy' (o'lcham bilan band) · 'bor' (keldi)
const Rasm = ({ holat = 'bor', sinf, children }) => <span className={cx('tz-rasm', holat, sinf)}>{holat === 'bor' && <RasmIc />}{children}</span>;
const Chiz = ({ n = 2, katta }) => <span className={cx('tz-chiz', katta && 'katta')}>{Array.from({ length: n }, (_, i) => <i key={i} className={i === n - 1 ? 'q' : undefined} />)}</span>;
const Qidiruv = ({ tugma }) => <span className="tz-qd"><LupaIc /><i />{tugma}</span>;
const BosishY = ({ yashil }) => <span className={cx('tz-bosish', yashil && 'ok')}>{tr({ uz: 'bosish shu yerga tushdi', ru: 'нажатие попало сюда' })}</span>;
const Ikonlar = ({ n = 2 }) => <span className="tz-sp-ik">{Array.from({ length: n }, (_, i) => <i key={i} />)}</span>;

// Telefon brauzeri (≈260×470): status qatori, Chrome manzil satri, yuklanish chizig'i, sahifa; ostida yorliq
const Telefon = ({ manzil, yuk = 100, qora, sinf, ost, children }) => (
  <div className={cx('tz-tel-ust', sinf)}>
    <div className="tz-tel">
      <div className="tz-tel-ich">
        <span className="tz-tel-st"><i className="kam" /></span>
        <span className="tz-tel-bar"><span className="tz-tel-m"><QulfIc />{manzil}</span></span>
        <span className="tz-tel-yuk"><span className={yuk >= 100 ? 'tamom' : undefined} style={{ width: yuk + '%' }} /></span>
        <div className={cx('tz-tel-s', qora && 'qora')}>{children}</div>
      </div>
    </div>
    {ost}
  </div>
);

// --- Soddalashtirilgan sayt sahifalari (tanish tuzilish, kulrang joylar; real e'lon/yangilik/odam yo'q) ---
// YouTube bosh sahifasi: b — 1 sarlavha+qidiruv · 2 video kartalari joyi · 3–5 rasmlar birma-bir
const YoutubeSahifa = ({ b = 5 }) => (
  <div className="tz-sp">
    {b >= 1 && <span className="tz-sp-hd tz-kir"><SaytNom s={TANISH_SAYT.youtube} /><Ikonlar n={3} /></span>}
    {b >= 1 && <span className="tz-kir"><Qidiruv /></span>}
    {b >= 2 && [0, 1, 2].map(i => <span key={i} className="tz-yt-k tz-kir"><Rasm holat={b >= i + 3 ? 'bor' : 'kut'} sinf="tz-yt-r" /><span className="tz-yt-m"><i className="tz-av" /><Chiz /></span></span>)}
  </div>
);
// Kun.uz bosh sahifasi: b — 1 sarlavha · 2 yangiliklar (rasm kutilmoqda) · 3 rasmlar keldi
const KunSahifa = ({ b = 3 }) => (
  <div className="tz-sp">
    {b >= 1 && <span className="tz-sp-hd tz-kir"><SaytNom s={TANISH_SAYT.kun} /><Ikonlar /></span>}
    {b >= 2 && <span className="tz-kun-b tz-kir"><Rasm holat={b >= 3 ? 'bor' : 'kut'} sinf="tz-kun-r" /><Chiz katta /></span>}
    {b >= 2 && [0, 1, 2, 3].map(i => <span key={i} className="tz-kun-q tz-kir"><Rasm holat={b >= 3 ? 'bor' : 'kut'} sinf="tz-kun-kr" /><Chiz /></span>)}
  </div>
);
// OLX bosh sahifasi: b — 1 sarlavha+qidiruv+bo'limlar · 2 e'lon kartalari (rasm kutilmoqda) · 3 rasmlar keldi; tanla — 4-ekranda elementni bosish; tugma — 9-ekranda qidiruv tugmasi
const OlxSahifa = ({ b = 3, tanla, tanlangan, silk, tugma }) => {
  const el = (id, c) => cx(c, tanla && 'tz-element', tanlangan === id && 'tanlandi', silk === id && 'silk');
  const bos = (id) => (tanla ? () => tanla(id) : undefined);
  return (
    <div className="tz-sp">
      {b >= 1 && <span className="tz-sp-hd tz-kir"><SaytNom s={TANISH_SAYT.olx} /><Ikonlar /></span>}
      {b >= 1 && <Bo on={bos('qidiruv')} className={el('qidiruv', 'tz-olx-qb tz-kir')}><Qidiruv tugma={tugma} /></Bo>}
      {b >= 1 && <Bo on={bos('kat')} className={el('kat', 'tz-olx-kat tz-kir')}>{Array.from({ length: 8 }, (_, i) => <span key={i}><i /><em /></span>)}</Bo>}
      {b >= 2 && <span className="tz-olx-y tz-kir">{tr({ uz: "E'lonlar", ru: 'Объявления' })}</span>}
      {b >= 2 && <span className="tz-olx-ro tz-kir">{[0, 1].map(i => (
        <span key={i} className="tz-olx-k">
          {i === 0 ? <Bo on={bos('rasm')} className={el('rasm', 'tz-olx-rb')}><Rasm holat={b >= 3 ? 'bor' : 'kut'} sinf="tz-olx-r">{tanlangan === 'rasm' && <em className="tz-lcp-b">LCP</em>}</Rasm></Bo> : <span className="tz-olx-rb"><Rasm holat={b >= 3 ? 'bor' : 'kut'} sinf="tz-olx-r" /></span>}
          <Chiz n={3} />
        </span>
      ))}</span>}
    </div>
  );
};
// Texnomart: pastki qism n marta sakraydi — har sakrashda oldingi joyida qizil iz qoladi
const SAKRASH_PX = 13;
const TexnomartSahifa = ({ n = 0 }) => (
  <div className="tz-sp">
    <span className="tz-sp-hd tz-kir"><SaytNom s={TANISH_SAYT.texnomart} /><Ikonlar /></span>
    <span className="tz-kir"><Qidiruv /></span>
    <span className="tz-tx-ban tz-kir"><Rasm /></span>
    <span className="tz-tx-pz">
      {Array.from({ length: n }, (_, i) => <i key={i} className="tz-iz" style={{ transform: 'translateY(' + i * SAKRASH_PX + 'px)' }} />)}
      <span className="tz-tx-past" style={{ transform: 'translateY(' + n * SAKRASH_PX + 'px)' }}>
        <span className="tz-tx-ro">{[0, 1].map(i => <span key={i} className="tz-tx-k"><Rasm sinf="tz-tx-r" /><Chiz /></span>)}</span>
        <Chiz n={3} />
      </span>
    </span>
    {n > 0 && <span key={n} className="tz-sanoq">{tr({ uz: 'siljish:', ru: 'сдвиг:' })} {n}</span>}
  </div>
);
// Namuna sahifa (5-ekran, 2-qadam): rasm 'yoq' (joyi yo'q) · 'joy' (o'lcham bilan band) · 'bor'; tugma 'qizil' — sakradi, qizil iz qoladi
const NamunaSahifa = ({ rasm = 'bor', tugma, onTugma, bosish }) => (
  <div className="tz-sp tz-nm">
    <Chiz katta />
    {rasm !== 'yoq' && <Rasm holat={rasm === 'joy' ? 'joy' : 'bor'} sinf="tz-nm-r">{rasm === 'joy' && <em>180{NB}×{NB}320</em>}{bosish === 'rasm' && <BosishY />}</Rasm>}
    <Bo on={onTugma} className={cx('tz-nm-t', tugma, onTugma && 'tz-halqa')}>{tr({ uz: "Qo'shilmoqchiman", ru: 'Хочу присоединиться' })}{bosish === 'tugma' && <BosishY yashil />}</Bo>
    <Chiz n={3} />
  </div>
);
// E'lonlar sahifasi (7-ekran, namuna): 6 karta, 1–4 birinchi ekranda, 5–6 pastda; rs — har rasm holati; lazy — `loading="lazy"` yorlig'i
const ElonlarSahifa = ({ rs, lazy = [], lazyQizil, aylan }) => (
  <div className={cx('tz-sp tz-el', aylan && 'aylan')}>
    <div className="tz-el-ich">
      <span className="tz-sp-hd"><b className="tz-el-nom">{tr({ uz: "E'lonlar", ru: 'Объявления' })}</b><Ikonlar /></span>
      <Qidiruv />
      <span className="tz-el-g">
        {rs.map((h, i) => (
          <React.Fragment key={i}>
            {i === 4 && <span className="tz-cheg"><b>{tr({ uz: 'birinchi ekran', ru: 'первый экран' })}</b></span>}
            <span className="tz-el-k">
              <Rasm holat={h} sinf="tz-el-r"><em className="tz-el-n">{i + 1}</em>{lazy[i] && <code className={cx('tz-lazy', i < 4 && lazyQizil && 'qizil')}>lazy</code>}</Rasm>
              <Chiz />
            </span>
          </React.Fragment>
        ))}
      </span>
    </div>
  </div>
);

// --- Lighthouse (Chrome DevTools hisobotiga o'xshash; logotipsiz) ---
const LhIc = ({ h }) => <i className={cx('tz-ic', h)} aria-hidden="true" />;
const LhGauge = ({ baho, chizildi = true, o = 'o' }) => {
  const r = chizildi ? bahoRang(baho) : null;
  const R = 44, C = 2 * Math.PI * R;
  const ul = chizildi && baho != null ? baho / 100 : 0;
  const rang = r ? LH_RANG[r] : null;
  return (
    <span className={cx('tz-g', o)} style={rang ? { '--g': rang, '--gf': fon(rang, 0.1) } : undefined}>
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r={R} className="tz-g-f" /><circle cx="50" cy="50" r={R} className="tz-g-y" style={{ '--c': C, strokeDasharray: C, strokeDashoffset: C * (1 - ul) }} transform="rotate(-90 50 50)" /></svg>
      {chizildi && baho != null && <b key={baho}>{baho}</b>}
    </span>
  );
};
const LhShkala = () => <span className="tz-shk">{LH_CHEGARA.baho.map(b => <span key={b.rang} className="tz-shk-b"><LhIc h={b.h} />{b.dan}–{b.gacha}</span>)}</span>;
const LhMetrik = ({ id, v, rejim = 'mobile', yangi, holat }) => {
  const m = metrik(id);
  return (
    <span className={cx('tz-mt', yangi && 'yangi', holat)}>
      <span className="tz-mt-n"><LhIc h={lhH(rejim, id, v)} />{m.nom}</span>
      <b className="tz-mt-v">{sonF(v)}{m.b ? NB + m.b : ''}</b>
    </span>
  );
};
// Sozlama qatori (boshlang'ich ekran): Mode · Device (Mobile | Desktop) · Categories
const LhSozlama = ({ device = 'mobile', onDesktop, desktopHalqa }) => (
  <span className="tz-lh-soz">
    <span>Mode: <b>Navigation</b></span>
    <span>Device: <b className={cx('tz-dev', device === 'mobile' && 'on')}>Mobile</b> | <Bo on={onDesktop} className={cx('tz-dev tz-desktop', device === 'desktop' && 'on', halqa(desktopHalqa))}>Desktop</Bo></span>
    <span>Categories: <b>Performance</b></span>
  </span>
);
// Hisobot oynasi: DevTools yorliqlari · sozlama · doira + «Performance» · METRICS (2 ustun)
const LhHisobot = ({ rejim = 'mobile', olchov, chizildi, ochiq, sozlama, izoh, sayt }) => (
  <div className="tz-rep">
    <span className="tz-rep-tab"><i>Elements</i><i>Console</i><b>Lighthouse</b></span>
    {sozlama}
    {ochiq && <div className="tz-rep-b">
      <span className="tz-rep-g">
        <LhGauge key={rejim} baho={olchov.baho} chizildi={chizildi} o="k" />
        <b className="tz-rep-p">Performance</b>
        <span className="tz-rep-est">Values are estimated and may vary.</span>
        {izoh ? <span className="tz-doira-iz2 fade-step">{izoh}</span> : <LhShkala />}
      </span>
      <span className="tz-rep-m">
        <span className="tz-rep-mh">METRICS</span>
        <span className="tz-rep-grid">{METRIK.map(m => <LhMetrik key={m.id + rejim} id={m.id} v={olchov[m.id]} rejim={rejim} yangi holat={chizildi ? undefined : 'kul'} />)}</span>
        {sayt && <span className="tz-rep-sayt"><SaytNom s={sayt} /> · {rejim === 'mobile' ? 'Mobile' : 'Desktop'} · <Manba /></span>}
      </span>
    </div>}
  </div>
);
// Kichik panel (4, 5, 9-ekran): «Lighthouse · sayt · 08.10 o'lchovi» + ichidagi qatorlar
const LhKichik = ({ sayt, children }) => (
  <div className="tz-rep kichik">
    <span className="tz-rep-hd"><b>Lighthouse</b>{sayt && <SaytNom s={sayt} />}<Manba /></span>
    {children}
  </div>
);
// Vaqt chizig'i (4, 7-ekran); holat: undefined (kulrang) · 'yon' · 'acc' · 'qizil'; katta belgi suriladi (7-ekran 3-qadam)
const VaqtChiziq = ({ holat = {}, kattaX, uchdi, belgilar = TEZLIK_SAHNA.chiziq }) => (
  <span className="tz-vc">
    <span className="tz-vc-l" />
    {belgilar.map((m, i) => {
      const x = m.id === 'katta' && kattaX != null ? kattaX : m.x;
      return <span key={m.id} className={cx('tz-vc-m', holat[m.id], i % 2 ? 'past' : 'tepa', i === 0 && 'bir', i === belgilar.length - 1 && 'ox')} style={{ left: x + '%' }}><i /><em>{tr(m.t)}</em></span>;
    })}
    {uchdi && <span className="tz-uchar" style={{ '--x0': (belgilar.find(m => m.id === 'katta') || {}).x + '%' }}>LCP</span>}
  </span>
);
// Kod ustuni (9-ekran): bloklar «bajarilmoqda» bo'lib yonadi; ishlatilmaydigan kod chiqib ketadi
const KodUstun = ({ yonadi = -1, tugadi = 0, olindi, yorliq }) => (
  <span className="tz-kodu">
    <span className="tz-kodu-h">{tr({ uz: 'Yuklanadigan kod', ru: 'Загружаемый код' })}</span>
    <span className="tz-kodu-u">
      {TEZLIK_SAHNA.kod.map((b, i) => (b.id === 'ortiq' && olindi === 'ketdi') ? null : (
        <span key={b.id} className={cx('tz-kodu-b', b.id === 'ortiq' && 'kul', yonadi === i && 'yon', i < tugadi && yonadi !== i && 'ish', b.id === 'ortiq' && olindi === 'chiqmoqda' && 'chiq')} style={{ minHeight: b.h * 15 }}>
          {b.ust && <em>{tr(b.ust)}</em>}{tr(b.t)}{yonadi === i && <i className="tz-kodu-baj">{tr({ uz: 'bajarilmoqda', ru: 'выполняется' })}</i>}
        </span>
      ))}
    </span>
    {yorliq && <span key={yorliq} className="tz-kodu-y fade-step">{yorliq === 'keyin' ? tr({ uz: 'agar olib tashlansa — soddalashtirilgan sahna', ru: 'если убрать — упрощённая сцена' }) : tr({ uz: 'oldin', ru: 'до' })}</span>}
  </span>
);
// «brauzer band» chizig'i — TBT shu chiziq (uzunlik)
const BandChiziq = ({ uz = 0, yorliq, toxtadi, yur, dur = 3 }) => (
  <span className={cx('tz-band', toxtadi && 'toxtadi')}>
    <span className="tz-band-i"><span className={cx('tz-band-f', yur && 'yur')} style={{ width: uz + '%', transitionDuration: yur ? dur + 's' : undefined }} /></span>
    <em>{yorliq || tr({ uz: 'brauzer band', ru: 'браузер занят' })}</em>
  </span>
);
// Yuklanish ro'yxati (7-ekran): olti rasm va «Yuklangan: n / 6»
const YuklanRoyxat = ({ yuklandi, korinmagan = [], lazy = [], lazyQizil }) => (
  <span className="tz-yr">
    <span className="tz-yr-h">{tr({ uz: 'Yuklanmoqda', ru: 'Загружается' })}<b key={yuklandi.filter(Boolean).length}>{tr({ uz: 'Yuklangan:', ru: 'Загружено:' })} {yuklandi.filter(Boolean).length}{NB}/{NB}{yuklandi.length}</b></span>
    {yuklandi.map((ok, i) => (
      <span key={i} className={cx('tz-yr-q', ok && 'ok')}>
        <i />{tr({ uz: (i + 1) + "-e'lon rasmi", ru: 'картинка объявления ' + (i + 1) })}{lazy[i] && <code className={cx('tz-lazy', i < 4 && lazyQizil && 'qizil')}>lazy</code>}{korinmagan[i] && <em>{tr({ uz: "hali ko'rinmagan", ru: 'ещё не видно' })}</em>}
      </span>
    ))}
  </span>
);
// TEZLIK.md maketi — o'quvchining O'Z sonlari (pm-m12d3-tezlik); yo'q bo'lsa kulrang yozuv (son ham, «—» ham emas)
const TezlikMd = ({ oldin, keyin, keyinUstun = true, tuzatishlar, github, bosh }) => {
  const QAT = [['baho', 'Lighthouse bahosi'], ['lcp', 'LCP, s'], ['cls', 'CLS'], ['tbt', 'TBT, ms'], ['bundleKb', 'Kod hajmi, kB']];
  const kat = (o, id) => (o && o[id] != null ? sonF(o[id]) : <em className="tz-md-b">{tr(bosh)}</em>);
  return (
    <span className="tz-md">
      <span className="tz-md-bar">{github && <b>GitHub</b>}<code>TEZLIK.md</code></span>
      <b className="tz-md-h">Tezlik</b>
      <span className="tz-md-s">Sahifa: lending · Mobile · Incognito</span>
      <span className="tz-md-j"><span className="sar"><i>Son</i><i>Oldin</i><i>Keyin</i></span>{QAT.map(([id, n]) => <span key={id}><i>{n}</i><i>{kat(oldin, id)}</i><i>{keyinUstun ? kat(keyin, id) : ''}</i></span>)}</span>
      {tuzatishlar && <span className="tz-md-t"><b>Tuzatishlar</b>{tuzatishlar.length ? tuzatishlar.map((t, i) => <i key={i}>{t}</i>) : <i><em className="tz-md-b">{tr(bosh)}</em></i>}</span>}
    </span>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish): telefon brauzerida YouTube — «Ochish» → qora ekran → qidiruv → kartalar, taymer LCP gacha → variantlar → doira 31 + manba =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Sahifani boshqa kompyuterda ochib ko'raman", ru: 'Открою страницу на другом компьютере' } },
  { id: 'b', label: { uz: "Sahifani o'lchov asbobi bilan tekshiraman", ru: 'Проверю страницу инструментом измерения' } },
  { id: 'c', label: { uz: "Agentga «sahifani tezlashtir» deb yozaman", ru: 'Напишу агенту «ускорь страницу»' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> O'lchov qaysi joy sekinligini son bilan ko'rsatadi — tuzatish o'sha joydan boshlanadi.</>, ru: <><b>Именно!</b> Измерение показывает числом, какое место медленное, — исправление начинается оттуда.</> },
  a: { uz: <><b>Qiziq fikr!</b> Boshqa kompyuterda boshqacha ochilishi mumkin — lekin qaysi joy sekinligi bilinmaydi.</>, ru: <><b>Интересная мысль!</b> На другом компьютере может открыться иначе — но какое место медленное, не узнать.</> },
  c: { uz: <><b>Qiziq fikr!</b> Agent ham nimani tuzatishni bilishi kerak — avval buni o'lchov ko'rsatadi.</>, ru: <><b>Интересная мысль!</b> Агенту тоже нужно знать, что исправлять, — сначала это покажет измерение.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const YT = TANISH_SAYT.youtube;
  const avval = !!storedAnswer;
  // b: -1 hali ochilmagan · 0 qora ekran · 1 sarlavha va qidiruv · 2 bo'limlar · 3–5 video kartalari (5 — eng katta narsa ko'rindi)
  const [b, setB] = useState(avval ? 5 : -1);
  const [yuk, setYuk] = useState(avval ? 100 : 0);
  const [vaqt, setVaqt] = useState(avval ? YT.mobile.lcp : 0);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const ketma = useKetma();
  const tRef = useRef(null);
  useEffect(() => () => clearInterval(tRef.current), []);
  const ochildi = b >= 5;
  const ochish = () => {
    if (b !== -1) return;
    setSc(n => n + 1); setB(0); setYuk(8);
    // Sahnada tezlashtirilgan: 1 soniya sahna = 1,5 soniya o'lchov; taymer LCP (7,8 s) da to'xtaydi
    if (!kamHarakat()) { const t0 = Date.now(); tRef.current = setInterval(() => setVaqt(Math.min(YT.mobile.lcp, Math.round((Date.now() - t0) * 0.015) / 10)), 100); }
    ketma([[2000, () => { setB(1); setYuk(40); }], [900, () => { setB(2); setYuk(55); }], [700, () => { setB(3); setYuk(70); }], [700, () => { setB(4); setYuk(85); }],
      [900, () => { clearInterval(tRef.current); setVaqt(YT.mobile.lcp); setB(5); setYuk(100); setSc(n => n + 1); }]]);
  };
  const pick = (v) => { if (picked !== null || !ochildi) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const javob = picked !== null;
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!javob} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('tz-k', ochildi && !javob && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Sahifangiz sekin ochilsa, <span className="italic" style={{ color: T.accent }}>sababini qanday topasiz?</span></>, ru: <>Если страница открывается медленно, <span className="italic" style={{ color: T.accent }}>как найти причину?</span></> })}
          mentor={<Mentor>{ochildi
            ? tr({ uz: "Endi o'ngdagi javoblardan birini tanlang.", ru: 'Теперь выберите один из ответов справа.' })
            : tr({ uz: 'Hakamlar oldida kutish uzoq tuyuladi — «Ochish» ni bosing va sahifani kuzating.', ru: 'Перед судьями ожидание кажется долгим — нажмите «Открыть» и следите за страницей.' })}</Mentor>}
          maket={<div className="tz-k-maket">
            <div className="tz-k-telw">
              <Telefon manzil={YT.manzil} yuk={yuk} qora={b === 0}>{b >= 1 ? <YoutubeSahifa b={b} /> : <div className="tz-sp" />}</Telefon>
              {b === -1 && <QTugma className="tz-ochish tz-halqa tz-k-play" onClick={ochish}>{tr({ uz: 'Ochish', ru: 'Открыть' })}</QTugma>}
            </div>
            {b !== -1 && <span className="tz-k-ost">
                <span className={cx('tz-taymer', ochildi && 'tamom')}><SoatIc /><b>{vaqt.toFixed(1).replace('.', ',')}{NB}s</b><em>{tr({ uz: 'sahnada tezlashtirilgan', ru: 'в сцене ускорено' })}</em></span>
                {javob && <span className="tz-k-lh fade-step"><LhGauge baho={YT.mobile.baho} o="m" /><span><b><SaytNom s={YT} /> · Performance</b><Manba toliq /></span></span>}
              </span>}
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={!ochildi}
          javob={javob && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda uch haqiqiy doira (YouTube · OLX · Kun.uz) va o'quvchining TEZLIK.md kartasi, o'ngda «01 · matn · teg» =====
const REJA = [
  { t: { uz: "Sahifa tezligini son bilan o'lchash", ru: 'Измерить скорость страницы числом' }, teg: { uz: 'Lighthouse', ru: 'Lighthouse' } },
  { t: { uz: 'Rasm kelganda sahifa siljimasligi', ru: 'Чтобы страница не сдвигалась, когда приходит картинка' }, teg: { uz: 'rasmlar', ru: 'картинки' } },
  { t: { uz: 'Yuklanadigan keraksiz kodni topish', ru: 'Найти ненужный загружаемый код' }, teg: { uz: 'yuklanadigan kod hajmi', ru: 'объём загружаемого кода' } },
  { t: { uz: 'Oldin va keyin sonlarini solishtirish', ru: 'Сравнить числа «до» и «после»' }, teg: { uz: 'oldin va keyin', ru: 'до и после' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const tez = useMemo(() => tezOqi(), []);
  const UCH = [TANISH_SAYT.youtube, TANISH_SAYT.olx, TANISH_SAYT.kun];
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun lendingingizni o'lchab, <span className="italic" style={{ color: T.accent }}>dalil bilan tuzatasiz</span>.</>, ru: <>Сегодня вы замерите лендинг и <span className="italic" style={{ color: T.accent }}>исправите его с доказательством</span>.</> })}
        mentor={<Mentor>{tr({ uz: "13-Modulda mahsulotingiz buzilmasligini tekshirgansiz — bugun u qanchalik tez ochilishini o'lchaysiz. «Tezlashdi» deyish uchun bitta shart bor: oldin va keyin soni.", ru: 'В 13-м модуле вы проверяли, что продукт не ломается, — сегодня измерите, как быстро он открывается. Чтобы сказать «ускорился», нужно одно условие: число «до» и «после».' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="tz-reja-chap">
          <span className="tz-uch">{UCH.map((s, i) => (
            <span key={s.nom} className="tz-uch-i" style={{ animationDelay: i * 0.15 + 's' }}><LhGauge baho={s.mobile.baho} /><SaytNom s={s} /><Manba /></span>
          ))}</span>
          <p className="tz-uch-gap">{tr({ uz: "Tanish saytlar ham shunday o'lchanadi — bugun o'z lendingingizni o'lchaysiz.", ru: 'Знакомые сайты измеряются так же — сегодня вы измерите свой лендинг.' })}</p>
          <TezlikMd oldin={tez.oldin} keyin={tez.keyin} bosh={{ uz: "o'lchaysiz", ru: 'измерите' }} />
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <p className="tz-mono-q">{tx({ uz: "o'z repo'ngiz — `lending/` va `TEZLIK.md`", ru: 'ваш репозиторий — `lending/` и `TEZLIK.md`' })}</p>
        <Ustoz satrlar={[
          { uz: "Darsning og'ir qismi — 12-ekran (haqiqiy hisobot mashqi) va uch blok (har birida tashqi kutish: Lighthouse 30–60 soniya, Netlify yangilanishi, Expo Atlas yoki `npm run build`). 3-ekrandagi «Desktop» qadamiga ortiqcha vaqt bermang.", ru: 'Тяжёлая часть урока — 12-й экран (упражнение с настоящим отчётом) и три блока (в каждом внешнее ожидание: Lighthouse 30–60 секунд, обновление Netlify, Expo Atlas или `npm run build`). Не тратьте лишнее время на шаг «Desktop» на 3-м экране.' },
          { uz: "Sinf interneti sekin yoki o'zgaruvchan bo'lsa, sonlar boshqacha chiqadi — har o'quvchi oldin va keyinni bir xil joyda, bir xil sharoitda o'lchasin (Incognito oyna, Mobile rejimi, o'sha sahifa). Brauzerga qo'shilgan dasturlar (Extensions) va antivirus natijaga ta'sir qiladi.", ru: 'Если интернет в классе медленный или нестабильный, числа будут другими — пусть каждый ученик меряет «до» и «после» в одном месте и в одних условиях (окно Incognito, режим Mobile, та же страница). Расширения браузера (Extensions) и антивирус влияют на результат.' },
          { uz: "Bugun yangi funksiya qo'shilmaydi: agent «yana bir narsa qo'shay» desa — rad etiladi. Vaqt yetmasa — qisqartirish: 3-ekranda «Desktop» qadami o'tkaziladi · 10-ekranning 3-qadami va 5-ekranning 2-qadami siz ko'rsatasiz · 2-amaliyotda faqat 1 tuzatish (rasm) · kartochkalar uyda.", ru: 'Сегодня новая функция не добавляется: если агент предложит «добавлю ещё кое-что» — отказываемся. Если не хватает времени — сокращение: на 3-м экране шаг «Desktop» пропускается · 3-й шаг 10-го экрана и 2-й шаг 5-го экрана показываете вы · во 2-й практике только 1 исправление (картинки) · карточки дома.' }
        ]} />
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA (QTushuncha): Kun.uz + DevTools Lighthouse hisoboti — «Analyze page load» → 54, METRICS · «Desktop» → 74, o'zi «Mobile» ga qaytadi =====
const S2_TAXMIN = [{ k: '5', t: { uz: '1 dan 5 gacha', ru: 'от 1 до 5' } }, { k: '10', t: { uz: '0 dan 10 gacha', ru: 'от 0 до 10' } }, { k: '100', t: { uz: '0 dan 100 gacha', ru: 'от 0 до 100' } }];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const K = TANISH_SAYT.kun;
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [device, setDevice] = useState('mobile');
  const [chizildi, setChizildi] = useState(avval);
  const [b, setB] = useState(3);
  const [yuk, setYuk] = useState(100);
  const [dIzoh, setDIzoh] = useState(false);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1100, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  // Lighthouse sahifani qayta ochadi: oq ekran → sarlavha → yangiliklar → rasmlar
  const qayta = (keyin) => [[0, () => { setB(0); setYuk(12); }], [380, () => { setB(1); setYuk(40); }], [300, () => { setB(2); setYuk(70); }], [380, () => { setB(3); setYuk(100); }], ...keyin];
  const analyze = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setChizildi(false);
    ketma(qayta([[300, () => setChizildi(true)], [1100, () => { setQ(1); setBand(false); }]]));
  };
  const desktop = () => {
    if (q !== 1 || band) return;
    setBand(true); setDevice('desktop'); setChizildi(false);
    ketma(qayta([[300, () => { setChizildi(true); setDIzoh(true); }], [2000, () => { setDevice('mobile'); setDIzoh(false); setChizildi(false); }], [300, () => { setChizildi(true); setQ(2); setBand(false); }]]));
  };
  const dsk = device === 'desktop';
  const ochiq = q >= 1 || chizildi || band;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Lighthouse bahosi', ru: 'Понятие · оценка Lighthouse' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Sahifa qanchalik tez ochilishini <span className="italic" style={{ color: T.accent }}>nima o'lchaydi?</span></>, ru: <>Что <span className="italic" style={{ color: T.accent }}>измеряет</span>, как быстро открывается страница?</> })}
        mentor={<Mentor>{q === 0
          ? tr({ uz: "Chrome ichida o'lchov asbobi bor — o'ngdagi «Analyze page load» ni bosing.", ru: 'В Chrome есть инструмент измерения — нажмите справа «Analyze page load».' })
          : tr({ uz: "Endi tepadagi «Desktop» ni bosib, bahoni yana bir ko'ring.", ru: 'Теперь нажмите сверху «Desktop» и посмотрите оценку ещё раз.' })}</Mentor>}
        vizual={<div className="tz-v">
          <div className={cx('tz-sahna', tugadi && 'tz-s2-tug')}>
            <div className="tz-chap"><Telefon manzil={K.manzil} yuk={yuk} sinf={dsk ? 'keng' : undefined} ost={<Sodda />}>{b >= 1 ? <KunSahifa b={b} /> : <div className="tz-sp" />}</Telefon></div>
            <div className="tz-ung">
              {!tugadi && <Bashorat savol={{ uz: 'Bu asbob sahifaga qanday baho beradi?', ru: 'Какую оценку этот инструмент ставит странице?' }} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
              <LhHisobot rejim={device} olchov={dsk ? K.desktop : K.mobile} chizildi={chizildi} ochiq={ochiq} sayt={K}
                izoh={dIzoh ? tr({ uz: 'boshqa sharoit', ru: 'другие условия' }) : null}
                sozlama={!tugadi && <span className="tz-rep-soz">
                  <LhSozlama device={device} onDesktop={q === 1 && !band ? desktop : undefined} desktopHalqa={q === 1 && !band} />
                  <span className="tz-lh-amal">
                    <Bo on={taxmin && q === 0 && !band ? analyze : undefined} className={cx('tz-analyze', halqa(!!taxmin && q === 0 && !band))}>Analyze page load</Bo>
                    <Qadamlar q={q} list={[{ uz: "O'lchang", ru: 'Измерьте' }, { uz: 'Desktop', ru: 'Desktop' }]} />
                  </span>
                </span>} />
              <div className={cx('tz-nom2', tugadi && 'yon')}>
                <NomQator matn={q >= 1 ? { uz: "Chrome ichidagi o'lchov asbobi — Lighthouse; u sahifaga 0 dan 100 gacha baho beradi — Lighthouse bahosi.", ru: 'Инструмент измерения в Chrome — Lighthouse; он ставит странице оценку от 0 до 100 — оценка Lighthouse.' } : null} />
                <NomQator matn={q >= 2 ? { uz: "Shkala: 0–49 — qizil, 50–89 — to'q sariq, 90–100 — yashil.", ru: 'Шкала: 0–49 — красный, 50–89 — оранжевый, 90–100 — зелёный.' } : null} />
              </div>
            </div>
          </div>
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === '100'} haqiqat={{ uz: '0 dan 100 gacha', ru: 'от 0 до 100' }} />}
          matn={tr({ uz: "Bu darsda tezlik Lighthouse bahosi va uch soni bilan tekshiriladi: oldin va keyin — o'sha sahifa, o'sha rejim.", ru: 'В этом уроке скорость проверяется оценкой Lighthouse и тремя её числами: «до» и «после» — та же страница, тот же режим.' })}
          izoh={tr({ uz: "Baho har o'lchashda biroz farq qilishi mumkin; 100 shart emas — Lighthouse buni «juda qiyin» deydi.", ru: 'Оценка может немного отличаться при каждом замере; 100 не обязательно — Lighthouse называет это «очень трудным».' })} />}
      >
        <Ustoz satrlar={[
          { uz: 'Vaznlar: LCP 25% · TBT 30% · CLS 25% · FCP 10% · Speed Index 10%. Mobile va Desktop — Lighthouse ikki xil sharoitda o\'lchaydi; shuning uchun darsda faqat Mobile.', ru: 'Веса: LCP 25% · TBT 30% · CLS 25% · FCP 10% · Speed Index 10%. Mobile и Desktop — Lighthouse меряет в двух разных условиях; поэтому на уроке только Mobile.' },
          { uz: "Sahnadagi sonlar — Kun.uz bosh sahifasining 08.10.2026 dagi bitta o'lchovi: Mobile 54, Desktop 74. Qayta o'lchansa son biroz farq qiladi; sayt haqida baho emas — o'lchov sharoiti bilan birga aytiladi.", ru: 'Числа в сцене — один замер главной страницы Kun.uz от 08.10.2026: Mobile 54, Desktop 74. При повторном замере число немного изменится; это не оценка сайта — говорится вместе с условиями замера.' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen; INLINE_KEYS.s3 = 1, B) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Oldin va keyingi bahoni qanday o'lchaysiz?"
    question={<h2 className="title h-ask">{tr({ uz: "Oldin va keyingi bahoni qanday o'lchaysiz?", ru: 'Как вы измерите оценку «до» и «после»?' })}</h2>}
    options={[
      { uz: 'Oldin Mobile rejimida, keyin Desktop rejimida', ru: 'Сначала в режиме Mobile, потом в режиме Desktop' },
      { uz: "Ikkalasini o'sha sahifada, Mobile rejimida", ru: 'Обе на той же странице, в режиме Mobile' },
      { uz: "Oldin Lighthouse bilan, keyin agentdan so'rab", ru: 'Сначала через Lighthouse, потом спросив агента' },
      { uz: 'Oldin lendingda, keyin ilova sahifasida', ru: 'Сначала на лендинге, потом на странице приложения' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Solishtirish uchun ikkala o'lchov bir xil sharoitda: o'sha sahifa, o'sha rejim.", ru: 'Чтобы сравнить, оба замера — в одних условиях: та же страница, тот же режим.' }}
    explainWrong={{
      0: { uz: 'Rejim almashsa, baho boshqa sharoitda chiqadi.', ru: 'Если сменить режим, оценка выйдет в других условиях.' },
      2: { uz: "Agentning gapi — da'vo; keyingi son qayerda?", ru: 'Слова агента — утверждение; где число «после»?' },
      3: { uz: 'Ikki xil sahifa — ikki xil son; nimani solishtirasiz?', ru: 'Две разные страницы — два разных числа; что вы сравните?' },
      default: { uz: "Solishtirish uchun ikkala o'lchov bir xil sharoitda: o'sha sahifa, o'sha rejim.", ru: 'Чтобы сравнить, оба замера — в одних условиях: та же страница, тот же режим.' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA LCP: OLX — «Sekin ochish» → birinchi matn 3,1 s, e'lon rasmi 7,5 s → eng katta narsani bosish → belgi LCP qatoriga uchadi =====
const S4_TAXMIN = [{ k: 'harf', t: { uz: 'Birinchi harfning', ru: 'Первой буквы' } }, { k: 'katta', t: { uz: 'Eng katta narsaning', ru: 'Самого большого элемента' } }, { k: 'oxirgi', t: { uz: 'Oxirgi rasmning', ru: 'Последней картинки' } }];
// OLX vaqt chizig'i — haqiqiy FCP va LCP (08.10 o'lchovi); x — 0–8,5 s shkalasida
const vcX = (s) => Math.round(3 + (s / 8.5) * 88);
const S4_CHIZIQ = () => {
  const m = TANISH_SAYT.olx.mobile;
  return [
    { id: 'ochildi', t: { uz: 'ochildi', ru: 'открылась' }, x: 3 },
    { id: 'matn', t: { uz: 'birinchi matn · ' + sonF(m.fcp) + NB + 's', ru: 'первый текст · ' + sonF(m.fcp) + NB + 's' }, x: vcX(m.fcp) },
    { id: 'katta', t: { uz: 'eng katta narsa · ' + sonF(m.lcp) + NB + 's', ru: 'самое большое · ' + sonF(m.lcp) + NB + 's' }, x: vcX(m.lcp) }
  ];
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const OLX = TANISH_SAYT.olx;
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [b, setB] = useState(avval ? 3 : 0);
  const [yuk, setYuk] = useState(avval ? 100 : 0);
  const [silk, setSilk] = useState(null);
  const [xato, setXato] = useState(false);
  const [uchdi, setUchdi] = useState(avval);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const sekin = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setB(0); setYuk(5);
    ketma([[900, () => { setB(1); setYuk(45); }], [1200, () => { setB(2); setYuk(75); }], [1500, () => { setB(3); setYuk(100); }], [700, () => { setQ(1); setBand(false); }]]);
  };
  const tanla = (id) => {
    if (q !== 1 || uchdi) return;
    if (id === 'rasm') { setXato(false); setSilk(null); setUchdi(true); ketma([[1000, () => setQ(2)]]); }
    else { setSilk(null); requestAnimationFrame(() => setSilk(id)); setXato(true); }
  };
  const vc = { ochildi: b >= 1 ? 'yon' : undefined, matn: b >= 1 ? 'yon' : undefined, katta: b >= 3 ? 'acc' : undefined };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · LCP', ru: 'Понятие · LCP' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, Math.min(q, 2), 2, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Sahifadagi eng katta narsa <span className="italic" style={{ color: T.accent }}>qachon ko'rinadi?</span></>, ru: <>Когда <span className="italic" style={{ color: T.accent }}>видно самое большое</span> на странице?</> })}
        mentor={<Mentor>{q === 0
          ? tr({ uz: 'Sahifani qadamma-qadam oching — «Sekin ochish» ni bosing.', ru: 'Откройте страницу шаг за шагом — нажмите «Медленно открыть».' })
          : tr({ uz: "Endi o'sha narsani sahifaning o'zida bosib ko'rsating.", ru: 'Теперь нажмите на этот элемент прямо на странице.' })}</Mentor>}
        vizual={<div className="tz-v">
          <div className={cx('tz-sahna', tugadi && 'tz-tug')}>
            <div className="tz-chap">
              <Telefon manzil={OLX.manzil} yuk={yuk} ost={<Sodda />}>{b >= 1 ? <OlxSahifa b={b} tanla={q === 1 && !uchdi ? tanla : null} tanlangan={uchdi ? 'rasm' : null} silk={silk} /> : <div className="tz-sp" />}</Telefon>
            </div>
            <div className="tz-ung">
              {!tugadi && <Bashorat savol={{ uz: "Lighthouse qaysi narsaning ko'rinish vaqtini kuzatadi?", ru: 'Время появления чего отслеживает Lighthouse?' }} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
              {!tugadi && <span className="tz-amal">
                <Bo on={taxmin && q === 0 && !band ? sekin : undefined} className={cx('tz-btn', (q > 0 || band) && 'xira', halqa(!!taxmin && q === 0 && !band))}>{tr({ uz: 'Sekin ochish', ru: 'Медленно открыть' })}</Bo>
                <Qadamlar q={q} list={[{ uz: 'Sekin ochish', ru: 'Медленно открыть' }, { uz: 'Eng kattasini toping', ru: 'Найдите самое большое' }]} />
              </span>}
              <LhKichik sayt={OLX}>
                <VaqtChiziq holat={vc} uchdi={uchdi && !avval} belgilar={S4_CHIZIQ()} />
                <LhMetrik id="lcp" v={OLX.mobile.lcp} holat={uchdi ? 'acc' : 'kul'} yangi={uchdi && !avval} />
              </LhKichik>
              {xato && !uchdi && <QXato>{tr({ uz: "Bu ham ko'rinadi — lekin undan kattaroq narsa bormi?", ru: 'Это тоже видно — но есть ли что-то больше?' })}</QXato>}
              <NomQator matn={uchdi ? { uz: "Birinchi ekrandagi eng katta rasm yoki matn ko'ringan vaqt — LCP; soniyada o'lchanadi.", ru: 'Время, когда показалась самая большая картинка или текст первого экрана, — LCP; измеряется в секундах.' } : null} />
            </div>
          </div>
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'katta'} haqiqat={{ uz: 'eng katta narsaning', ru: 'самого большого элемента' }} />}
          matn={tr({ uz: "Bu o'lchovda eng katta narsa — e'lon rasmi; YouTube'da esa matn bloki edi.", ru: 'В этом замере самое большое — картинка объявления; а на YouTube это был блок текста.' })}
          izoh={tr({ uz: "Rasmiy tavsiya: LCP 2,5 soniya yoki kamroq bo'lsin.", ru: 'Официальная рекомендация: LCP — 2,5 секунды или меньше.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "LCP — eng katta rasm, matn bloki yoki video. Sahnadagi LCP elementi va vaqtlari — OLX bosh sahifasining 08.10.2026 dagi bitta o'lchovidan (Mobile): e'lon rasmi; YouTube'da shu kuni matn bloki chiqqan.", ru: 'LCP — самая большая картинка, блок текста или видео. Элемент LCP и время в сцене — из одного замера главной страницы OLX от 08.10.2026 (Mobile): картинка объявления; на YouTube в тот день это был блок текста.' },
          { uz: "«Birinchi harf» (FCP) — bahoning 10 foizi, darsda nomi bilan; o'quvchi so'rasa: «birinchi matn yoki rasm chiqqan vaqt».", ru: '«Первая буква» (FCP) — 10 процентов оценки, на уроке только название; если ученик спросит: «время, когда появился первый текст или картинка».' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 5 — TUSHUNCHA CLS: Texnomart — pastki qism 5 marta sakraydi, CLS 1,544 · namuna: «Qo'shilmoqchiman» → bosish rasmga tushadi · o'chirgich → joy band =====
const S5_TAXMIN = [{ k: 'joyida', t: { uz: 'Joyida qoladi', ru: 'Останется на месте' } }, { k: 'past', t: { uz: 'Pastga suriladi', ru: 'Сдвинется вниз' } }];
const KodKarta = ({ olcham }) => (
  <div className="tz-kk fade-up">
    <span className="tz-kk-y"><code>lending/index.html</code> · {tr({ uz: 'tepadagi rasm', ru: 'верхняя картинка' })}</span>
    <span className="tz-kk-k">
      <span className="tz-kk-q"><Jx>&lt;img</Jx> <At>src</At>=<St>"oyinlar.png"</St> <At>alt</At>=<St>"O'yinlar ekrani"</St>{!olcham && <Jx>&gt;</Jx>}</span>
      {olcham && <span className="tz-kk-q yangi">{'     '}<At>width</At>=<St>"180"</St> <At>height</At>=<St>"320"</St><Jx>&gt;</Jx></span>}
    </span>
    <span className="tz-kk-iz">{tx({ uz: "`width` va `height` — rasmning sahifadagi o'lchami, pikselda; brauzer joyni rasm kelmasdan band qiladi.", ru: '`width` и `height` — размер картинки на странице в пикселях; браузер занимает место до прихода картинки.' })}</span>
  </div>
);
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const TX = TANISH_SAYT.texnomart;
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  // k: 'bosh' · 'tx' (Texnomart, sakrashlar) · 'matn' (namuna: rasm hali yo'q) · 'siljidi' · 'joy' · 'keldi'
  const [k, setK] = useState(avval ? 'keldi' : 'bosh');
  const [n, setN] = useState(avval ? TX.mobile.siljish : 0);
  const [clsTx, setClsTx] = useState(avval);
  const [yuk, setYuk] = useState(avval ? 100 : 0);
  const [olcham, setOlcham] = useState(avval);
  const [bosish, setBosish] = useState(avval ? 'tugma' : null);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  // 1-qadam: Texnomart ochiladi — pastki qism 5 marta sakraydi (08.10 o'lchovi), CLS chiqadi; so'ng namuna sahifa (rasm hali yo'q, tugma bosishga tayyor)
  const och = () => {
    if (!taxmin || q !== 0 || band || k !== 'bosh') return;
    setBand(true); setK('tx'); setYuk(30);
    const sak = Array.from({ length: TX.mobile.siljish }, (_, i) => [i === 0 ? 700 : 650, () => { setN(i + 1); setYuk(30 + (i + 1) * 14); }]);
    ketma([...sak, [500, () => { setClsTx(true); setYuk(100); }], [1600, () => { setK('matn'); setYuk(60); setBand(false); }]]);
  };
  const tugmaBos = () => {
    if (q !== 0 || k !== 'matn') return;
    setK('siljidi'); setBosish('rasm'); setYuk(100);
    ketma([[900, () => setQ(1)]]);
  };
  const olchamYoz = () => {
    if (q !== 1 || band) return;
    setOlcham(true); setBand(true);
    ketma([[700, () => { setK('joy'); setBosish(null); setYuk(40); }], [1000, () => { setK('keldi'); setYuk(100); }], [600, () => setBosish('tugma')], [900, () => { setQ(2); setBand(false); }]]);
  };
  const namuna = (h) => (h === 'matn' ? { rasm: 'yoq', onTugma: q === 0 ? tugmaBos : undefined }
    : h === 'siljidi' ? { rasm: 'bor', tugma: 'qizil', bosish: 'rasm' }
      : h === 'joy' ? { rasm: 'joy' }
        : { rasm: 'bor', tugma: 'yashil', bosish: bosish === 'tugma' ? 'tugma' : null });
  const txSah = k === 'bosh' || k === 'tx';
  const clsPanel = <LhKichik sayt={TX}>
    <LhMetrik id="cls" v={TX.mobile.cls} holat={clsTx ? undefined : 'kul'} yangi={clsTx && !avval} key={String(clsTx)} />
    {clsTx && <span className="tz-rep-iz fade-step">{tr({ uz: 'pastki qism 5 marta siljigan · rasmiy chegara: 0,1', ru: 'нижняя часть сдвинулась 5 раз · официальная граница: 0,1' })}</span>}
  </LhKichik>;
  const NOM_CLS = { uz: "Ko'rinib turgan narsa joyidan siljishi — sahifa siljishi; Lighthouse uni CLS deb o'lchaydi (birliksiz son).", ru: 'Когда видимый элемент сдвигается с места — это сдвиг страницы; Lighthouse измеряет его как CLS (число без единиц).' };
  const IKKI = [{ h: 'siljidi', t: { uz: "o'lchamsiz — tugma siljidi", ru: 'без размеров — кнопка сдвинулась' } }, { h: 'keldi', t: { uz: "o'lcham bilan — joyida", ru: 'с размерами — на месте' } }];
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · CLS', ru: 'Понятие · CLS' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Rasm kelganda tugma <span className="italic" style={{ color: T.accent }}>nega pastga sakraydi?</span></>, ru: <>Почему кнопка <span className="italic" style={{ color: T.accent }}>прыгает вниз</span>, когда приходит картинка?</> })}
        mentor={<Mentor>{q === 0
          ? tr({ uz: "Avval «Sahifani ochish» ni, keyin «Qo'shilmoqchiman» ni bosing.", ru: 'Сначала нажмите «Открыть страницу», потом «Хочу присоединиться».' })
          : tx({ uz: 'Endi rasmga o\'lcham yozing — «`width` va `height`» o\'chirgichini yoqing.', ru: 'Теперь задайте картинке размер — включите переключатель «`width` и `height`».' })}</Mentor>}
        vizual={<div className="tz-v">
          {tugadi
            ? <div className="tz-sahna tz-tug">
              <div className="tz-ikki">{IKKI.map(x => (
                <div key={x.h} className={cx('tz-ikki-u', x.h === 'keldi' ? 'ok' : 'err')}>
                  <span className="tz-mini-br"><span className="tz-mini-bar"><i /><i /><i /><b>{tr(NAMUNA_Y)}</b></span>{x.h === 'keldi' ? <NamunaSahifa rasm="joy" tugma="yashil" bosish="tugma" /> : <NamunaSahifa rasm="bor" tugma="qizil" bosish="rasm" />}</span>
                  <span className="tz-ikki-y">{tr(x.t)}</span>
                </div>
              ))}</div>
              <div className="tz-ung"><NomQator matn={NOM_CLS} />{clsPanel}<KodKarta olcham={olcham} /></div>
            </div>
            : <div className="tz-sahna">
              <div className="tz-chap">
                <Telefon manzil={txSah ? TX.manzil : tr(NAMUNA_Y)} yuk={yuk} ost={<Sodda matn={txSah ? SODDA_Y : NAMUNA_Y} />}>
                  {k === 'bosh' ? <div className="tz-sp" /> : txSah ? <TexnomartSahifa n={n} /> : <NamunaSahifa {...namuna(k)} />}
                </Telefon>
              </div>
              <div className="tz-ung">
                <Bashorat savol={{ uz: 'Rasm kelganda tugma nima bo\'ladi?', ru: 'Что будет с кнопкой, когда придёт картинка?' }} variantlar={S5_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />
                <span className="tz-amal">
                  <Bo on={taxmin && q === 0 && k === 'bosh' && !band ? och : undefined} className={cx('tz-btn', k !== 'bosh' && 'xira', halqa(!!taxmin && k === 'bosh' && !band))}>{tr({ uz: 'Sahifani ochish', ru: 'Открыть страницу' })}</Bo>
                  <Bo on={q === 1 && !band ? olchamYoz : undefined} className={cx('tz-olcham', olcham && 'on', q === 0 && 'xira', halqa(q === 1 && !band))}><i className="tz-sw" />{tx({ uz: '`width` va `height`: ', ru: '`width` и `height`: ' })}{olcham ? tr({ uz: 'bor', ru: 'есть' }) : tr({ uz: "yo'q", ru: 'нет' })}</Bo>
                  <Qadamlar q={q} list={[{ uz: "Bosib ko'ring", ru: 'Нажмите' }, { uz: "O'lcham yozing", ru: 'Задайте размер' }]} />
                </span>
                {clsPanel}
                <NomQator matn={q >= 1 ? NOM_CLS : null} />
                <KodKarta olcham={olcham} />
              </div>
            </div>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'past'} haqiqat={{ uz: 'pastga suriladi', ru: 'сдвинется вниз' }} />}
          matn={tx({ uz: "Bu misolda `width` va `height` rasm uchun joyni oldindan band qiladi — tugma siljimaydi.", ru: 'В этом примере `width` и `height` заранее занимают место для картинки — кнопка не сдвигается.' })}
          izoh={tr({ uz: "Rasmiy tavsiya: CLS 0,1 yoki kamroq bo'lsin.", ru: 'Официальная рекомендация: CLS — 0,1 или меньше.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "Rasmiy (web.dev): «we recommend adding `width` and `height` attributes to all `<img>` tags» — brauzer joyni oldindan band qiladi. CSS'da `height: auto` bo'lsa, rasm nisbati saqlanadi.", ru: 'Официально (web.dev): «we recommend adding `width` and `height` attributes to all `<img>` tags» — браузер заранее занимает место. Если в CSS `height: auto`, пропорции картинки сохраняются.' },
          { uz: "1-qadam — Texnomart bosh sahifasining 08.10.2026 dagi bitta o'lchovi (Mobile): CLS 1,544, pastki qism 5 marta siljigan. 2-qadam va 180 × 320 — namuna sahifa.", ru: '1-й шаг — один замер главной страницы Texnomart от 08.10.2026 (Mobile): CLS 1,544, нижняя часть сдвинулась 5 раз. 2-й шаг и 180 × 320 — страница-образец.' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 6 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s6 = 3, D) =====
const Screen6 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Rasm kelganda tugma siljidi. Nima qilasiz?"
    question={<h2 className="title h-ask">{tr({ uz: 'Rasm kelganda tugma siljidi. Nima qilasiz?', ru: 'Когда пришла картинка, кнопка сдвинулась. Что вы сделаете?' })}</h2>}
    options={[
      { uz: 'Tugmaga yorqinroq rang va soya beraman', ru: 'Дам кнопке цвет ярче и тень' },
      { uz: 'Rasmga `loading="lazy"` yozaman', ru: 'Допишу картинке `loading="lazy"`' },
      { uz: 'Sahifani boshqa brauzerda ochaman', ru: 'Открою страницу в другом браузере' },
      { uz: 'Rasmga `width` va `height` yozaman', ru: 'Допишу картинке `width` и `height`' }
    ]} correctIdx={3}
    explainCorrect={{ uz: '`width` va `height` rasm joyini oldindan band qiladi — tugma siljimaydi.', ru: '`width` и `height` заранее занимают место картинки — кнопка не сдвигается.' }}
    explainWrong={{
      0: { uz: "Rang o'zgarsa ham rasm joyi bo'sh qoladi.", ru: 'Даже если сменить цвет, место картинки остаётся пустым.' },
      1: { uz: 'Bu rasm tepada — uning joyini nima band qiladi?', ru: 'Эта картинка вверху — что займёт её место?' },
      2: { uz: "Boshqa brauzerda ham rasm o'lchami oldindan noma'lum.", ru: 'И в другом браузере размер картинки заранее неизвестен.' },
      default: { uz: '`width` va `height` rasm joyini oldindan band qiladi — tugma siljimaydi.', ru: '`width` и `height` заранее занимают место картинки — кнопка не сдвигается.' }
    }} />
);

// ===== SCREEN 7 — TUSHUNCHA keyin yuklash: e'lonlar sahifasi (namuna, 6 karta) — «Hammasi birdan» → 6/6 · «Keyin yuklash» → 4/6, aylantirishda 5/6, 6/6 · «Tepadagisiga ham» → LCP kechikadi =====
const S7_TAXMIN = [{ k: 'ochilish', t: { uz: 'Sahifa ochilishi bilan', ru: 'Сразу при открытии страницы' } }, { k: 'yaqin', t: { uz: 'Unga yaqinlashganda', ru: 'Когда к ней приближаются' } }, { k: 'bosilganda', t: { uz: 'Faqat bosilganda', ru: 'Только при нажатии' } }];
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const N6 = [0, 1, 2, 3, 4, 5];
  const TEPA = (i) => i < 4; // 1–4 — birinchi ekranda, 5–6 — pastda
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [band, setBand] = useState(false);
  const [yuk, setYuk] = useState(avval ? 100 : 0);
  const [och, setOch] = useState(avval);
  const [rs, setRs] = useState(avval ? N6.map(() => 'bor') : N6.map(() => 'kut'));
  const [kor, setKor] = useState(N6.map(() => false));
  const [lazyP, setLazyP] = useState(avval);
  const [lazyT, setLazyT] = useState(null);
  const [aylan, setAylan] = useState(false);
  const [katta, setKatta] = useState(null);
  const ketma = useKetma();
  const done = q >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const yangila = (f) => setRs(r => r.map((x, j) => (f(j) ? 'bor' : x)));
  const kut = () => setRs(N6.map(() => 'kut'));
  const hammasi = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true);
    ketma([[100, () => { setOch(true); setYuk(40); }], [800, () => { setRs(N6.map(() => 'bor')); setKor(N6.map(i => !TEPA(i))); setYuk(100); }], [1000, () => { setQ(1); setBand(false); }]]);
  };
  const keyin = () => {
    if (q !== 1 || band) return;
    setBand(true); setLazyP(true); setKor(N6.map(() => false));
    ketma([[500, () => { kut(); setYuk(20); setAylan(false); }], [600, () => { yangila(TEPA); setYuk(100); }], [800, () => setAylan(true)], [1400, () => yangila(i => i === 4)], [700, () => yangila(i => i === 5)], [900, () => { setQ(2); setBand(false); }]]);
  };
  const tepaHam = () => {
    if (q !== 2 || band) return;
    setBand(true); setLazyT('bor');
    ketma([[500, () => { setAylan(false); kut(); setYuk(20); setKatta(null); }], [700, () => setYuk(60)], [1600, () => { yangila(TEPA); setYuk(100); setKatta('qizil'); setLazyT('qizil'); }], [1200, () => { setQ(3); setBand(false); }]]);
  };
  // Tugadi: sahna «Keyin yuklash» holatida (1–4 — oddiy, 5–6 — loading="lazy")
  const f = tugadi;
  const yuklandi = f ? N6.map(() => true) : rs.map(x => x === 'bor');
  const lazy = N6.map(i => (TEPA(i) ? (!f && !!lazyT) : (f || lazyP)));
  const vc = { ochildi: och || f ? 'yon' : undefined, matn: och || f ? 'yon' : undefined, katta: f ? 'acc' : (och ? (katta || 'acc') : undefined), hamma: yuklandi.every(Boolean) ? 'yon' : undefined };
  const TUGMALAR = [
    { t: { uz: 'Hammasi birdan', ru: 'Все сразу' }, on: hammasi, q: 0 },
    { t: { uz: 'Keyin yuklash', ru: 'Загрузить позже' }, on: keyin, q: 1 },
    { t: { uz: 'Tepadagisiga ham', ru: 'И верхней тоже' }, on: tepaHam, q: 2 }
  ];
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · keyin yuklash', ru: 'Понятие · загрузка позже' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 3, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ko'rinmayotgan rasmni <span className="italic" style={{ color: T.accent }}>qachon yuklash kerak?</span></>, ru: <>Когда <span className="italic" style={{ color: T.accent }}>загружать</span> картинку, которую не видно?</> })}
        mentor={<Mentor>{tr(q === 0 ? { uz: 'Ikki usulni solishtiring — avval «Hammasi birdan» ni bosing.', ru: 'Сравните два способа — сначала нажмите «Все сразу».' }
          : q === 1 ? { uz: "Endi pastdagi ikki rasmni keyinga qoldiring — «Keyin yuklash» ni bosing.", ru: 'Теперь отложите две нижние картинки — нажмите «Загрузить позже».' }
            : { uz: "Shu atributni tepadagi rasmga ham qo'yib ko'ring — «Tepadagisiga ham» ni bosing.", ru: 'Поставьте этот атрибут и верхней картинке — нажмите «И верхней тоже».' })}</Mentor>}
        vizual={<div className="tz-v">
          <div className={cx('tz-sahna', f && 'tz-tug')}>
            <div className="tz-chap">
              <Telefon manzil={tr({ uz: "e'lonlar sahifasi", ru: 'страница объявлений' })} yuk={f ? 100 : yuk} ost={<Sodda matn={{ uz: "e'lonlar sahifasi (namuna)", ru: 'страница объявлений (образец)' }} />}>
                {!och && !f ? <div className="tz-sp" /> : <ElonlarSahifa rs={f ? N6.map(() => 'bor') : rs} lazy={lazy} lazyQizil={!f && lazyT === 'qizil'} aylan={!f && aylan} />}
              </Telefon>
            </div>
            <div className="tz-ung">
              {!tugadi && <Bashorat savol={{ uz: 'Pastdagi rasm qachon yuklansa yaxshi?', ru: 'Когда лучше загружать нижнюю картинку?' }} variantlar={S7_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
              {!f && <span className="tz-amal">
                {TUGMALAR.map((b, i) => <Bo key={i} on={taxmin && q === b.q && !band ? b.on : undefined} className={cx('tz-btn', q !== b.q && 'xira', halqa(!!taxmin && q === b.q && !band))}>{tr(b.t)}</Bo>)}
                <Qadamlar q={q} list={TUGMALAR.map(b => b.t)} />
              </span>}
              <div className="tz-ong">
                <YuklanRoyxat yuklandi={yuklandi} korinmagan={f ? [] : kor} lazy={lazy} lazyQizil={!f && lazyT === 'qizil'} />
                <VaqtChiziq holat={vc} kattaX={!f && katta === 'qizil' ? 80 : null} />
              </div>
              <NomQator matn={q >= 2 ? { uz: 'Ekrandan tashqaridagi rasm faqat kerak bo\'lganda yuklanadi — keyin yuklash: `loading="lazy"`.', ru: 'Картинка за пределами экрана загружается только когда нужна — загрузка позже: `loading="lazy"`.' } : null} />
            </div>
          </div>
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'yaqin'} haqiqat={{ uz: 'unga yaqinlashganda', ru: 'когда к ней приближаются' }} />}
          matn={tx({ uz: 'Bu misolda `loading="lazy"` faqat pastdagi rasmlarda: tepadagi rasm sahifa bilan birga yuklanadi.', ru: 'В этом примере `loading="lazy"` только у нижних картинок: верхняя загружается вместе со страницей.' })}
          izoh={tr({ uz: "Rasmiy ogohlantirish: birinchi ekrandagi rasmga, ayniqsa LCP rasmiga, keyin yuklash qo'yilmaydi.", ru: 'Официальное предупреждение: картинке первого экрана, особенно картинке LCP, загрузку позже не ставят.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "Rasmiy (web.dev): «Don't lazy-load images that are likely to be in-viewport when the page loads, especially LCP images.» Keyin yuklanadigan rasmlarga ham `width` va `height` (aks holda brauzer ularni 0 × 0 deb hisoblab, hammasini birdan yuklashi mumkin).", ru: 'Официально (web.dev): «Don\'t lazy-load images that are likely to be in-viewport when the page loads, especially LCP images.» Картинкам с загрузкой позже тоже нужны `width` и `height` (иначе браузер может счесть их 0 × 0 и загрузить все сразу).' },
          { uz: "`loading=\"lazy\"` ni qo'llab-quvvatlamaydigan eski brauzer atributni e'tiborsiz qoldiradi — sahifa buzilmaydi. «Qancha yaqinlashganda» — brauzerning o'zi hal qiladi; darsda masofa aytilmaydi.", ru: 'Старый браузер без поддержки `loading="lazy"` просто игнорирует атрибут — страница не ломается. «Насколько близко» — решает сам браузер; на уроке расстояние не называем.' },
          { uz: "Brauzer rasmni ekranga yetmasdan ancha oldin yuklay boshlaydi: qisqa sahifada pastdagi rasm ham sahifa bilan birga kelishi mumkin; sahna uzun sahifani ko'rsatadi.", ru: 'Браузер начинает грузить картинку задолго до того, как она дойдёт до экрана: на короткой странице нижняя картинка может прийти вместе со страницей; сцена показывает длинную страницу.' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 8 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s8 = 0, A) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText='loading="lazy" qaysi rasmga yoziladi?'
    question={<h2 className="title h-ask">{tx({ uz: '`loading="lazy"` qaysi rasmga yoziladi?', ru: 'Какой картинке пишут `loading="lazy"`?' })}</h2>}
    options={[
      { uz: 'Sahifaning pastidagi rasmga', ru: 'Картинке внизу страницы' },
      { uz: 'Birinchi ekrandagi katta rasmga', ru: 'Большой картинке первого экрана' },
      { uz: 'Sahifadagi hamma rasmlarga', ru: 'Всем картинкам на странице' },
      { uz: 'Eng kichik hajmli rasmga', ru: 'Самой лёгкой картинке' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Pastdagi rasm unga yaqinlashganda yuklanadi; tepadagisi sahifa bilan birga.', ru: 'Нижняя картинка загружается, когда к ней приближаются; верхняя — вместе со страницей.' }}
    explainWrong={{
      1: { uz: "Bu rasm birinchi ko'rinadi — kechiksa, LCP ham kechikadi.", ru: 'Эту картинку видно первой — если она опоздает, опоздает и LCP.' },
      2: { uz: "Tepadagi rasm ham kechikadi — LCP nima bo'ladi?", ru: 'Верхняя картинка тоже опоздает — что будет с LCP?' },
      3: { uz: 'Hajm emas, joyi muhim: rasm sahifaning qayerida?', ru: 'Важен не вес, а место: где картинка на странице?' },
      default: { uz: 'Pastdagi rasm unga yaqinlashganda yuklanadi; tepadagisi sahifa bilan birga.', ru: 'Нижняя картинка загружается, когда к ней приближаются; верхняя — вместе со страницей.' }
    }} />
);

// ===== SCREEN 9 — TUSHUNCHA TBT va kod hajmi: OLX — «Ochish va bosish» → bloklar ishlaydi, TBT 7 725 ms · «Olib tashlash» → ishlatilmaydigan kod chiqadi · «Qayta ochish» → chiziq qisqa =====
const S9_TAXMIN = [{ k: 'rasm', t: { uz: 'Rasmlarni yuklayapti', ru: 'Загружает картинки' } }, { k: 'kod', t: { uz: 'Kodni bajaryapti', ru: 'Выполняет код' } }, { k: 'hech', t: { uz: 'Hech narsa qilmayapti', ru: 'Ничего не делает' } }];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const OLX = TANISH_SAYT.olx;
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [band, setBand] = useState(false);
  const [och, setOch] = useState(avval);
  const [yuk, setYuk] = useState(avval ? 100 : 0);
  const [yonadi, setYonadi] = useState(-1);
  const [ish, setIsh] = useState(avval ? 2 : 0);
  const [tugma, setTugma] = useState(avval ? 'bosildi' : null);
  const tRef = useRef(avval ? 'bosildi' : null);
  const [olindi, setOlindi] = useState(avval ? 'ketdi' : null);
  const [bar1, setBar1] = useState(avval ? 100 : 0);
  const [bar2, setBar2] = useState(avval ? 66 : 0);
  const [ikkinchi, setIkkinchi] = useState(avval);
  const [tbt, setTbt] = useState(avval);
  const ketma = useKetma();
  const done = q >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const setT = (v) => { tRef.current = v; setTugma(v); };
  const bos = () => { if (tRef.current === null) setT('kutadi'); };
  // n blok ketma-ket «bajarilmoqda»; chiziq shu vaqt ichida o'sadi; oxirida kutgan bosish o'tadi
  const ishla = (n, setBar, oxiri) => {
    const qad = [[80, () => { setOch(true); setYuk(100); setIsh(0); setYonadi(0); setBar(n === 3 ? 100 : 66); }]];
    for (let i = 1; i < n; i++) qad.push([1000, () => { setIsh(i); setYonadi(i); }]);
    qad.push([1000, () => { setIsh(n); setYonadi(-1); setT('bosildi'); oxiri(); }]);
    ketma(qad);
    ketma([[900, () => { if (tRef.current === null) setT('kutadi'); }]]);
  };
  const ochBos = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setT(null);
    ishla(3, setBar1, () => { setTbt(true); ketma([[700, () => { setQ(1); setBand(false); }]]); });
  };
  const olib = () => {
    if (q !== 1 || band) return;
    setBand(true); setOlindi('chiqmoqda');
    ketma([[800, () => { setOlindi('ketdi'); setQ(2); setBand(false); }]]);
  };
  const qayta = () => {
    if (q !== 2 || band) return;
    setBand(true); setT(null); setIkkinchi(true); setOch(false); setYuk(20);
    ishla(2, setBar2, () => { ketma([[800, () => { setQ(3); setBand(false); }]]); });
  };
  const tugmaJsx = <Bo on={band && tugma === null ? bos : undefined} className={cx('tz-qd-t', tugma, band && tugma === null && 'tz-halqa')}>{tugma === 'kutadi' && <SoatIc />}{tr({ uz: 'Qidirish', ru: 'Найти' })}{tugma === 'bosildi' && <b className="tz-qd-ok">✓</b>}</Bo>;
  const TUGMALAR = [
    { t: { uz: 'Ochish va bosish', ru: 'Открыть и нажать' }, on: ochBos, q: 0 },
    { t: { uz: 'Olib tashlash', ru: 'Убрать' }, on: olib, q: 1 },
    { t: { uz: 'Qayta ochish', ru: 'Открыть снова' }, on: qayta, q: 2 }
  ];
  const QB = [{ uz: 'Ochib bosing', ru: 'Откройте и нажмите' }, { uz: 'Olib tashlang', ru: 'Уберите' }, { uz: 'Qayta bosing', ru: 'Нажмите снова' }];
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · yuklanadigan kod hajmi', ru: 'Понятие · объём загружаемого кода' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 3, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Sahifa ko'rinib turibdi — <span className="italic" style={{ color: T.accent }}>tugma nega bosilmayapti?</span></>, ru: <>Страница видна — <span className="italic" style={{ color: T.accent }}>почему кнопка не нажимается?</span></> })}
        mentor={<Mentor>{tr(q === 0 ? { uz: "Endi sahifani oching va «Qidirish» ni bosib ko'ring — «Ochish va bosish» ni bosing.", ru: 'Теперь откройте страницу и попробуйте нажать «Найти» — нажмите «Открыть и нажать».' }
          : q === 1 ? { uz: "Sahifa ishlatmaydigan kod ham yuklanadi — «Olib tashlash» ni bosing.", ru: 'Загружается и код, который страница не использует, — нажмите «Убрать».' }
            : { uz: "Endi «Qayta ochish» ni bosing va farqni ko'ring.", ru: 'Теперь нажмите «Открыть снова» и посмотрите на разницу.' })}</Mentor>}
        vizual={<div className="tz-v">
          <div className={cx('tz-sahna', tugadi && 'tz-tug')}>
            <div className="tz-chap">
              <Telefon manzil={OLX.manzil} yuk={yuk} sinf="ilova9" ost={<Sodda />}>{och || avval ? <OlxSahifa b={3} tugma={tugmaJsx} /> : <div className="tz-sp" />}</Telefon>
              <span className="tz-bandlar">
                <BandChiziq uz={bar1} yur={!avval} yorliq={ikkinchi ? tr({ uz: 'oldin', ru: 'до' }) : null} toxtadi={q >= 1} />
                {ikkinchi && <BandChiziq uz={bar2} yur={!avval} dur={2} yorliq={tr({ uz: 'keyin', ru: 'после' })} toxtadi={q >= 3} />}
              </span>
            </div>
            <div className="tz-ung">
              {!tugadi && <Bashorat savol={{ uz: 'Tugma bosilmagan paytda brauzer nima qilyapti?', ru: 'Что делает браузер, пока кнопка не нажимается?' }} variantlar={S9_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
              {!tugadi && <span className="tz-amal">
                {TUGMALAR.map((b, i) => <Bo key={i} on={taxmin && q === b.q && !band ? b.on : undefined} className={cx('tz-btn', q !== b.q && 'xira', halqa(!!taxmin && q === b.q && !band))}>{tr(b.t)}</Bo>)}
                <Qadamlar q={q} list={QB} />
              </span>}
              <LhKichik sayt={OLX}>
                <LhMetrik id="tbt" v={OLX.mobile.tbt} holat={tbt ? undefined : 'kul'} yangi={tbt && !avval} key={String(tbt)} />
                {tbt && <span className="tz-audit fade-step"><span className="tz-audit-h"><LhIc h="q" /><b>Reduce unused JavaScript</b><em>Est savings of {sonF(OLX.mobile.keraksizKib)}{NB}KiB</em></span><span className="tz-audit-iz">{tr({ uz: 'Sahifa ishlatmaydigan kod ham yuklanadi.', ru: 'Загружается и код, который страница не использует.' })}</span></span>}
                <KodUstun yonadi={yonadi} tugadi={ish} olindi={olindi} yorliq={q >= 2 || olindi ? 'keyin' : (q >= 1 ? 'oldin' : null)} />
              </LhKichik>
              <div className={cx('tz-nom2', tugadi && 'yon')}>
                <NomQator matn={q >= 1 ? { uz: "Sahifa ochilayotganda brauzer kod bilan band bo'lib, bosishga javob berolmagan vaqt — TBT; millisekundda.", ru: 'Время, когда при открытии страницы браузер занят кодом и не может ответить на нажатие, — TBT; в миллисекундах.' } : null} />
                <NomQator matn={q >= 2 ? { uz: "Ilova ochilganda yuklanadigan hamma kod — yuklanadigan kod hajmi; mobil trekda uni Expo Atlas ko'rsatadi.", ru: 'Весь код, который загружается при открытии приложения, — объём загружаемого кода; в мобильном треке его показывает Expo Atlas.' } : null} />
              </div>
            </div>
          </div>
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'kod'} haqiqat={{ uz: 'kodni bajaryapti', ru: 'выполняет код' }} />}
          matn={tr({ uz: 'Bu misolda kod kamaygach brauzer ertaroq bo\'shadi va tugma ertaroq javob berdi.', ru: 'В этом примере, когда кода стало меньше, браузер освободился раньше и кнопка ответила раньше.' })}
          izoh={tr({ uz: "Lighthouse'da Mobile rejimida TBT 200 ms gacha bo'lsa — yashil.", ru: 'В Lighthouse в режиме Mobile TBT до 200 мс — зелёный.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "TBT — sahifa sichqoncha bosishi, ekranga teginish yoki klaviaturaga javob bera olmagan umumiy vaqt; 50 ms dan uzun ish — «long task», shundan ortig'i sanaladi; birinchi tavsiya — keraksiz JavaScript'ni kamaytirish. TBT bosish kechikishi emas — FCP va TTI orasidagi 50 ms dan uzun ishlarning ortig'i yig'indisi; sahnadagi bosish — faqat «nega muhim» ko'rsatkichi.", ru: 'TBT — общее время, когда страница не могла ответить на клик мыши, касание экрана или клавиатуру; работа дольше 50 мс — «long task», считается то, что сверх этого; первая рекомендация — сократить ненужный JavaScript. TBT — не задержка нажатия, а сумма превышений работ длиннее 50 мс между FCP и TTI; нажатие в сцене — только показатель «почему это важно».' },
          { uz: "OLX sonlari (TBT 7 725 ms, «Reduce unused JavaScript» 1 354 KiB) — 08.10.2026 dagi bitta o'lchov (Mobile). «Olib tashlash» va «Qayta ochish» — soddalashtirilgan sahna: OLX da bunday o'zgarish qilinmagan. Vite hujjati: «the JavaScript size itself is related to the execution time».", ru: 'Числа OLX (TBT 7 725 ms, «Reduce unused JavaScript» 1 354 KiB) — один замер от 08.10.2026 (Mobile). «Убрать» и «Открыть снова» — упрощённая сцена: на OLX такого изменения не делали. Документация Vite: «the JavaScript size itself is related to the execution time».' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 10 — 4-SAVOL (QuestionScreen; INLINE_KEYS.s10 = 2, C) =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="Sahifa ochilayotganda brauzer kod bilan band bo'ldi. Qaysi son buni ko'rsatadi?"
    question={<h2 className="title h-ask">{tr({ uz: "Sahifa ochilayotganda brauzer kod bilan band bo'ldi. Qaysi son buni ko'rsatadi?", ru: 'При открытии страницы браузер был занят кодом. Какое число это показывает?' })}</h2>}
    options={[
      { uz: 'LCP — eng katta narsa vaqti', ru: 'LCP — время самого большого элемента' },
      { uz: 'CLS — sahifa siljishi', ru: 'CLS — сдвиг страницы' },
      { uz: "TBT — band bo'lgan vaqt", ru: 'TBT — время занятости' },
      { uz: 'Yuklangan rasmlar soni', ru: 'Число загруженных картинок' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "TBT — ochilishda brauzer kod bilan band bo'lgan vaqt.", ru: 'TBT — время, когда при открытии браузер был занят кодом.' }}
    explainWrong={{
      0: { uz: "LCP ko'rinishni o'lchaydi — brauzer bandligini emas.", ru: 'LCP измеряет появление, а не занятость браузера.' },
      1: { uz: "Tugma joyida turgan edi — siljish bo'lmagan.", ru: 'Кнопка стояла на месте — сдвига не было.' },
      3: { uz: "Rasmlar soni vaqt emas — kutilgan vaqtni nima o'lchaydi?", ru: 'Число картинок — не время; что измеряет время ожидания?' },
      default: { uz: "TBT — ochilishda brauzer kod bilan band bo'lgan vaqt.", ru: 'TBT — время, когда при открытии браузер был занят кодом.' }
    }} />
);

// ===== SCREEN 11 — MASHQ: haqiqiy hisobotdan tuzatish tanlash (F-1008-587, qaror B; QTushuncha, ballsiz — INLINE_KEYS.practice = -1) =====
// Karta dastasi (12-ekran TartibDasta naqshi): bittadan topilma kartasi, uch tugma; to'g'ri tanlov chapdagi raqamli qatorga yoziladi
const TUZATISH = [
  { id: 'olcham', t: { uz: 'Rasmga width va height yozish', ru: 'Записать картинке width и height' } },
  { id: 'kod', t: { uz: 'Keraksiz kodni olib tashlash', ru: 'Убрать ненужный код' } },
  { id: 'lazy', t: { uz: 'Pastdagi rasmga loading="lazy" qo\'yish', ru: 'Поставить нижней картинке loading="lazy"' } }
];
const TOPILMA = () => [
  { sayt: TANISH_SAYT.olx, h: 'q', ui: 'Reduce unused JavaScript', son: 'Est savings of ' + sonF(TANISH_SAYT.olx.mobile.keraksizKib) + NB + 'KiB', iz: { uz: 'Sahifa ishlatmaydigan kod ham yuklanadi.', ru: 'Загружается и код, который страница не использует.' }, togri: 'kod' },
  { sayt: TANISH_SAYT.olcha, h: 's', ui: 'Image elements do not have explicit width and height', son: { uz: TANISH_SAYT.olcha.mobile.olchamsizRasm + ' ta rasm', ru: TANISH_SAYT.olcha.mobile.olchamsizRasm + ' картинок' }, iz: { uz: 'Rasmlarda o\'lcham yozilmagan.', ru: 'У картинок не записан размер.' }, togri: 'olcham' },
  { sayt: TANISH_SAYT.olx, h: 'q', ui: 'Total Blocking Time', son: sonF(TANISH_SAYT.olx.mobile.tbt) + NB + 'ms', iz: { uz: "Ochilishda brauzer kod bilan band bo'lgan.", ru: 'При открытии браузер был занят кодом.' }, togri: 'kod' }
];
const TopilmaKarta = ({ k, n, jami }) => (
  <span className="tz-tp">
    <span className="tz-tp-bosh"><SaytNom s={k.sayt} /><em>{n}{NB}/{NB}{jami}</em></span>
    <span className="tz-tp-ui"><LhIc h={k.h} /><b>{k.ui}</b></span>
    <span className="tz-tp-son">{tr(k.son)}</span>
    <span className="tz-tp-iz">{tr(k.iz)}</span>
  </span>
);
const TopilmaDasta = ({ yechildi, onYechildi }) => {
  const L = TOPILMA();
  const [javob, setJavob] = useState(() => (yechildi ? L.map(k => k.togri) : []));
  const [xato, setXato] = useState(null);
  const i = javob.length;
  const joriy = L[i] || null;
  const tanla = (id) => {
    if (!joriy) return;
    if (id === joriy.togri) { const nj = [...javob, id]; setJavob(nj); setXato(null); if (nj.length === L.length && onYechildi) onYechildi(); }
    else setXato(x => ({ k: (x ? x.k : 0) + 1, id }));
  };
  return (
    <div className={cx('tz-tj tz-tpj', !joriy && 'yigildi')}>
      <div className="tz-tp-ro">
        {L.map((k, j) => (
          <span key={j} className={cx('tz-tp-q', javob[j] && 'ok', j === i && 'joriy')}>
            <i>{javob[j] ? '✓' : j + 1}</i>
            <span><SaytNom s={k.sayt} /> · <code>{k.ui}</code>{javob[j] && <b className="fade-step">{tr(TUZATISH.find(t => t.id === javob[j]).t)}</b>}</span>
          </span>
        ))}
      </div>
      {joriy && <div className="tz-tj-ong">
        <div className="tz-dasta">
          {L.length - i > 1 && <i className="tz-dasta-q q1" aria-hidden="true" />}
          {L.length - i > 2 && <i className="tz-dasta-q q2" aria-hidden="true" />}
          <div key={i + '-' + (xato ? xato.k : 0)} className={cx('tz-gap tz-tp-k', xato && 'silk')}><TopilmaKarta k={joriy} n={i + 1} jami={L.length} /></div>
        </div>
        <span className="tz-tp-tug">{TUZATISH.map(t => <button key={t.id} type="button" className={cx('tz-tp-b', xato && xato.id === t.id && 'xato')} onClick={() => tanla(t.id)}>{tr(t.t)}</button>)}</span>
        {xato && <QXato key={xato.k}>{tr({ uz: 'Bu topilma boshqa narsa haqida: izohni qayta o\'qing.', ru: 'Эта находка о другом: перечитайте пояснение.' })}</QXato>}
      </div>}
    </div>
  );
};
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [done, setDone] = useState(avval);
  const tugadi = useTugadi(done, 1100, avval);
  const yechildi = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'Mashq · haqiqiy hisobot', solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Mashq · haqiqiy hisobot', ru: 'Упражнение · настоящий отчёт' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval tanlang', ru: 'Сначала выберите' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng harakatAvval tugadi={tugadi}
        sarlavha={tr({ uz: <>Hisobotdagi topilmaga <span className="italic" style={{ color: T.accent }}>qaysi tuzatish mos?</span></>, ru: <>Какое <span className="italic" style={{ color: T.accent }}>исправление подходит</span> к находке из отчёта?</> })}
        mentor={<Mentor>{tr({ uz: "Bu topilmalar — tanish saytlarning 08.10 hisobotidan. Har kartaga mos tuzatishni tanlang.", ru: 'Эти находки — из отчёта знакомых сайтов от 08.10. Для каждой карточки выберите подходящее исправление.' })}</Mentor>}
        harakat={<TopilmaDasta yechildi={avval} onYechildi={yechildi} />}
        vizual={tugadi && <TopilmaDasta yechildi />}
        xulosa={done && <XulosaQ matn={tr({ uz: "Hisobotdagi topilma qaysi tuzatish kerakligini ko'rsatadi; qilishdan oldin dalilni tekshirasiz.", ru: 'Находка в отчёте показывает, какое исправление нужно; перед тем как делать, вы проверяете доказательство.' })}
          izoh={tr({ uz: '1-amaliyotda o\'z lendingingiz uchun agent shunday ro\'yxat beradi — siz tanlaysiz.', ru: 'В 1-й практике агент даст такой же список для вашего лендинга — выбираете вы.' })} />}
      >
        {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        <Ustoz satrlar={[
          { uz: "Topilmalar — 08.10.2026 dagi bitta Lighthouse o'lchovidan (Mobile); qayta o'lchansa son biroz farq qiladi. «Est savings» — Lighthouse taxmini, kafolat emas.", ru: 'Находки — из одного замера Lighthouse от 08.10.2026 (Mobile); при повторном замере число немного изменится. «Est savings» — оценка Lighthouse, не гарантия.' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 12 — FINAL (QTartib: uyalarda faqat raqam va «bu yerga qo'ying»; ball — birinchi to'liq urinish; INLINE_KEYS.s12 = 0 sentinel) =====
// Karta dastasi (F-1008-588, global PM/TEX gap-tartibi — 8-Modul PmPitchRehearsal naqshi; SABOQ P4): o'ngda bittadan karta, chapda raqamli uyalar; uyani bosish yoki sudrash
const DASTA_TARTIB = ['qayta', 'tuzat', 'olch', 'oldin', 'sol', 'royxat']; // aralash tartib qat'iy
const TartibDasta = ({ yechildi, onYechildi, onXato }) => {
  const ids = ISH_TARTIBI.map(z => z.id);
  const [joy, setJoy] = useState(() => (yechildi ? ids.slice() : ids.map(() => null)));
  const [xato, setXato] = useState(null);
  const [ust, setUst] = useState(null);
  const pool = DASTA_TARTIB.filter(id => !joy.includes(id));
  const joriy = pool[0] || null;
  const lbl = (id) => tr(ISH_TARTIBI.find(z => z.id === id).label);
  const qoy = (i) => {
    if (!joriy || joy[i]) return;
    setUst(null);
    if (ids[i] === joriy) { const nj = joy.slice(); nj[i] = joriy; setJoy(nj); setXato(null); if (nj.every(Boolean) && onYechildi) onYechildi(); }
    else { setXato(x => ({ k: (x ? x.k : 0) + 1, i })); if (onXato) onXato(); }
  };
  const dr = (i) => (joriy && !joy[i] ? { onDragOver: (e) => { e.preventDefault(); if (ust !== i) setUst(i); }, onDragLeave: () => setUst(u => (u === i ? null : u)), onDrop: (e) => { e.preventDefault(); qoy(i); } } : {});
  return (
    <div className={cx('tz-tj', !joriy && 'yigildi')}>
      <div className="q-dd-slots tz-tj-uyalar">
        {joy.map((id, i) => (
          <button key={i} type="button" className={cx('q-dd-slot', 'tz-uya', id && 'filled ok', !id && joriy && 'kutadi', ust === i && 'ust', xato && xato.i === i && !id && 'bad')} disabled={!!id || !joriy} onClick={() => qoy(i)} {...dr(i)}>
            <span className="q-dd-n">{i + 1}</span>
            {id ? <span className="tz-uya-gap">{lbl(id)}</span> : <span className="q-dd-hint">{tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}</span>}
          </button>
        ))}
      </div>
      {joriy && <div className="tz-tj-ong">
        <div className="tz-dasta">
          {pool.length > 1 && <i className="tz-dasta-q q1" aria-hidden="true" />}
          {pool.length > 2 && <i className="tz-dasta-q q2" aria-hidden="true" />}
          <div key={joriy + (xato ? xato.k : 0)} className={cx('tz-gap', xato && 'silk')} draggable
            onDragStart={(e) => { try { e.dataTransfer.setData('text/plain', joriy); e.dataTransfer.effectAllowed = 'move'; } catch { /* sudrash ishlamasa — bosish yetadi */ } }}>
            <span className="tz-gap-n">{6 - pool.length + 1}{NB}/{NB}6</span>
            <span className="tz-gap-t">{lbl(joriy)}</span>
          </div>
        </div>
        {xato && <QXato key={xato.k}>{tr({ uz: "Bu joyga boshqa ish keladi: avval o'lchanadi, keyin tuzatiladi.", ru: 'Сюда встаёт другое дело: сначала замер, потом исправление.' })}</QXato>}
      </div>}
    </div>
  );
};
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const wrongEverRef = useRef(false);
  const onWrong = () => { wrongEverRef.current = true; if (achMiss) achMiss.miss(screen); };
  const firedRef = useRef(!!storedAnswer);
  const [done, setDone] = useState(!!storedAnswer);
  const [recapOpen, setRecapOpen] = useState(false);
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  const solve = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setDone(true);
    const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'Tezlashtirish ishi qaysi tartibda qilinadi?', options: ISH_TARTIBI.map(z => ou(z.label)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · tartib', ru: 'Итог · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Avval tartibni yig'ing", ru: 'Сначала соберите порядок' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng harakatAvval tugadi={tugadi}
        sarlavha={tr({ uz: <>Tezlashtirish ishi <span className="italic" style={{ color: T.accent }}>qaysi tartibda</span> qilinadi?</>, ru: <>В каком <span className="italic" style={{ color: T.accent }}>порядке</span> делается работа по ускорению?</> })}
        mentor={<Mentor>{tr({ uz: "Kartadagi ishni o'qing va chapdagi o'z joyini bosing.", ru: 'Прочитайте дело на карточке и нажмите на его место слева.' })}</Mentor>}
        harakat={<TartibDasta yechildi={!!storedAnswer} onYechildi={solve} onXato={onWrong} />}
        vizual={tugadi && <TartibDasta yechildi />}
        xulosa={done && <><span className="tz-x-m">{tr({ uz: "Bu darsda avval o'lchanadi, keyin tuzatiladi; «tezlashdi» — faqat oldin va keyin soni bilan.", ru: 'В этом уроке сначала измеряют, потом исправляют; «ускорился» — только с числами «до» и «после».' })}</span>{wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}</>}
      >
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </QTushuncha>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — Kod darsi: inglizcha nom «!» siz (9.23); tavsif qilingan ishni aytadi =====
const ACHIEVEMENTS = {
  shiftStopper: { icon: '📐', name: 'Shift Stopper', desc: { uz: 'Tugma siljiganda rasmga nima yozilishini topdingiz', ru: 'Вы нашли, что дописать картинке, когда кнопка сдвигается' } },
  lazyBelow: { icon: '🖼️', name: 'Lazy Below', desc: { uz: 'Keyin yuklash qaysi rasmga yozilishini topdingiz', ru: 'Вы нашли, какой картинке пишут загрузку позже' } },
  quickTap: { icon: '⚡', name: 'Quick Tap', desc: { uz: "Brauzer band bo'lgan vaqtni qaysi son ko'rsatishini topdingiz", ru: 'Вы нашли, какое число показывает время занятости браузера' } },
  measuredTwice: { icon: '📏', name: 'Measured Twice', desc: { uz: "Mahsulotingizni oldin va keyin o'zingiz o'lchadingiz", ru: 'Вы сами замерили свой продукт до и после' } }
};
// Ekran id → nishon: 6, 8, 10 — ballik test (birinchi urinishda to'g'ri); a3 — 3-amaliyot 2-qadam «Saqlash» (oldin va keyin ikkalasi saqlangan — bonus, 152)
const ACH_TRIGGERS = { s6: 'shiftStopper', s8: 'lazyBelow', s10: 'quickTap', a3: 'measuredTwice' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 6, 8, 10, 12)
const Q_LABELS = {
  3: { uz: '1 — Bir xil sharoit', ru: '1 — Одинаковые условия' },
  6: { uz: '2 — Rasm joyi', ru: '2 — Место картинки' },
  8: { uz: '3 — Keyin yuklash', ru: '3 — Загрузка позже' },
  10: { uz: '4 — Brauzer band vaqti', ru: '4 — Время занятости браузера' },
  12: { uz: 'Yakuniy — ish tartibi', ru: 'Итог — порядок работы' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — MD «Fon so'zlari» (R-008: kod so'zlari ru'da ham o'sha; o'quvchi so'zi {uz, ru})
const QZ_BG_SHAPES = [
  { ch: 'Lighthouse', l: 4, t: 8, s: 26, d: 19, dl: 0 },
  { ch: 'LCP', l: 84, t: 6, s: 26, d: 23, dl: 1.5 },
  { ch: 'CLS', l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: 'TBT', l: 76, t: 70, s: 24, d: 21, dl: 2.2 },
  { ch: 'width', l: 44, t: 86, s: 20, d: 25, dl: 1.1 },
  { ch: 'height', l: 64, t: 28, s: 20, d: 17, dl: 0.4 },
  { ch: 'loading="lazy"', l: 22, t: 38, s: 18, d: 20, dl: 1.9 },
  { ch: { uz: 'keyin yuklash', ru: 'загрузка позже' }, l: 18, t: 16, s: 18, d: 18, dl: 2.9 },
  { ch: { uz: 'yuklanadigan kod hajmi', ru: 'объём загружаемого кода' }, l: 52, t: 54, s: 16, d: 22, dl: 0.6 },
  { ch: 'Expo Atlas', l: 88, t: 42, s: 18, d: 24, dl: 1.3 },
  { ch: 'npm run build', l: 30, t: 60, s: 16, d: 26, dl: 2.4 },
  { ch: 'Mobile', l: 58, t: 10, s: 20, d: 20, dl: 0.2 },
  { ch: 'Incognito', l: 6, t: 46, s: 18, d: 23, dl: 1.7 },
  { ch: 'TEZLIK.md', l: 70, t: 86, s: 18, d: 19, dl: 2.6 },
  { ch: { uz: 'oldin', ru: 'до' }, l: 36, t: 6, s: 20, d: 21, dl: 0.9 },
  { ch: { uz: 'keyin', ru: 'после' }, l: 90, t: 58, s: 20, d: 18, dl: 2.0 },
  { ch: 'Speed Index', l: 12, t: 90, s: 18, d: 24, dl: 1.4 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (MD aynan)
const QUIZ_BANK = [
  { q: { uz: 'Lighthouse bahosi qaysi oraliqda bo\'ladi?', ru: 'В каком диапазоне оценка Lighthouse?' }, opts: [{ uz: '0 dan 100 gacha', ru: 'от 0 до 100' }, { uz: '10 dan 50 gacha', ru: 'от 10 до 50' }, { uz: '0 dan 5 gacha', ru: 'от 0 до 5' }, { uz: '1 dan 50 gacha', ru: 'от 1 до 50' }], correct: 0 },
  { q: { uz: 'Lighthouse bahosida yashil rang qaysi oraliq?', ru: 'Какой диапазон оценки Lighthouse зелёный?' }, opts: [{ uz: '50 dan 89 gacha', ru: 'от 50 до 89' }, { uz: '90 dan 100 gacha', ru: 'от 90 до 100' }, { uz: '0 dan 49 gacha', ru: 'от 0 до 49' }, { uz: '70 dan 100 gacha', ru: 'от 70 до 100' }], correct: 1 },
  { q: { uz: 'Lighthouse 100 ball haqida nima deydi?', ru: 'Что Lighthouse говорит о 100 баллах?' }, opts: [{ uz: 'Har sahifa uchun majburiy', ru: 'Обязательно для каждой страницы' }, { uz: 'Faqat Desktop rejimida bor', ru: 'Бывает только в режиме Desktop' }, { uz: 'Juda qiyin va kutilmaydi', ru: 'Очень трудно и не ожидается' }, { uz: "Faqat yangi saytlarda bo'ladi", ru: 'Бывает только у новых сайтов' }], correct: 2 },
  { q: { uz: 'LCP uchun rasmiy tavsiya qancha?', ru: 'Какая официальная рекомендация для LCP?' }, opts: [{ uz: '0,1 soniya yoki kamroq', ru: '0,1 секунды или меньше' }, { uz: '200 ms yoki kamroq', ru: '200 мс или меньше' }, { uz: '25 soniya yoki kamroq', ru: '25 секунд или меньше' }, { uz: '2,5 soniya yoki kamroq', ru: '2,5 секунды или меньше' }], correct: 3 },
  { q: { uz: "CLS qanday birlikda o'lchanadi?", ru: 'В каких единицах измеряется CLS?' }, opts: [{ uz: 'Birliksiz son, masalan 0,05', ru: 'Число без единиц, например 0,05' }, { uz: 'Soniyada, masalan 2,5 soniya', ru: 'В секундах, например 2,5 секунды' }, { uz: 'Millisekundda, masalan 200 ms', ru: 'В миллисекундах, например 200 мс' }, { uz: 'Kilobaytda, masalan 300', ru: 'В килобайтах, например 300' }], correct: 0 },
  { q: { uz: 'Lighthouse bahosida qaysi sonning ulushi eng katta?', ru: 'У какого числа самая большая доля в оценке Lighthouse?' }, opts: [{ uz: 'LCP — 25 foiz', ru: 'LCP — 25 процентов' }, { uz: 'TBT — 30 foiz', ru: 'TBT — 30 процентов' }, { uz: 'CLS — 25 foiz', ru: 'CLS — 25 процентов' }, { uz: 'FCP — 10 foiz', ru: 'FCP — 10 процентов' }], correct: 1 },
  { q: { uz: "Tepadagi rasmga keyin yuklash qo'yilsa, nima bo'lishi mumkin?", ru: 'Что может случиться, если верхней картинке поставить загрузку позже?' }, opts: [{ uz: 'CLS nolga tushadi', ru: 'CLS упадёт до нуля' }, { uz: 'Kod hajmi kamayadi', ru: 'Объём кода уменьшится' }, { uz: 'LCP kechikishi mumkin', ru: 'LCP может задержаться' }, { uz: 'Rasm umuman chiqmaydi', ru: 'Картинка совсем не появится' }], correct: 2 },
  { q: { uz: "Mobil trekda yuklanadigan kod hajmini nima ko'rsatadi?", ru: 'Что в мобильном треке показывает объём загружаемого кода?' }, opts: [{ uz: 'Lighthouse bahosi', ru: 'Оценка Lighthouse' }, { uz: 'Netlify sahifasi', ru: 'Страница Netlify' }, { uz: 'Render sozlamasi', ru: 'Настройка Render' }, { uz: 'Expo Atlas oynasi', ru: 'Окно Expo Atlas' }], correct: 3 },
  { q: { uz: "Lighthouse'ni qaysi oynada ishga tushirasiz?", ru: 'В каком окне вы запускаете Lighthouse?' }, opts: [{ uz: 'Incognito oynasida', ru: 'В окне Incognito' }, { uz: 'Netlify sahifasida', ru: 'На странице Netlify' }, { uz: 'Antigravity oynasida', ru: 'В окне Antigravity' }, { uz: 'Expo Atlas oynasida', ru: 'В окне Expo Atlas' }], correct: 0 },
  { q: { uz: "Mobile rejimida TBT qachon yashil bo'ladi?", ru: 'Когда TBT в режиме Mobile зелёный?' }, opts: [{ uz: "600 ms dan ko'p bo'lsa", ru: 'Если больше 600 мс' }, { uz: "200 ms gacha bo'lsa", ru: 'Если до 200 мс' }, { uz: "2500 ms gacha bo'lsa", ru: 'Если до 2500 мс' }, { uz: "1000 ms dan ko'p bo'lsa", ru: 'Если больше 1000 мс' }], correct: 1 },
  { q: { uz: "Kutubxonani o'chirishdan oldin agent nimani ko'rsatadi?", ru: 'Что агент показывает перед удалением библиотеки?' }, opts: [{ uz: 'Lighthouse bahosini', ru: 'Оценку Lighthouse' }, { uz: 'Yangi kutubxona nomini', ru: 'Имя новой библиотеки' }, { uz: 'Kerak emasligi dalilini', ru: 'Доказательство, что она не нужна' }, { uz: 'Sahifa siljishini', ru: 'Сдвиг страницы' }], correct: 2 },
  { q: { uz: '«Tezlashdi» deyish uchun nima kerak?', ru: 'Что нужно, чтобы сказать «ускорился»?' }, opts: [{ uz: 'Agentning «tayyor» degani', ru: '«Готово» от агента' }, { uz: "Sahifaning yangi ko'rinishi", ru: 'Новый вид страницы' }, { uz: 'Sinfdoshning «tez» degani', ru: '«Быстро» от одноклассника' }, { uz: 'Oldin va keyingi sonlar', ru: 'Числа «до» и «после»' }], correct: 3 }
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

// ===== AMALIYOT BLOKLARI (13, 14, 15) — ScreenBlok + QBlok + prompt; hammasi o'quvchining o'z repo'sida (Mentor misoli — namuna) =====
// Saqlash: pm-m12d3-tezlik = { trek, oldin: { baho, lcp, cls, tbt, bundleKb }, keyin: { … }, bundleTur, tuzatishlar: [string] (0–2), savedAt } — tayanch 8 aynan (6-dars o'qiydi)
const TEZLIK_KALIT = 'pm-m12d3-tezlik';
const tezOqi = () => { const o = lsOqi(TEZLIK_KALIT); return o && typeof o === 'object' ? o : {}; };
const tezYoz = (yangi) => { const o = tezOqi(); lsYoz(TEZLIK_KALIT, { ...o, ...yangi, savedAt: Date.now() }); };
const trekOqi = () => {
  const p = lsOqi('pm-m9d8-platforma');
  if (p && (p.trek === 'mobil' || p.trek === 'web')) return { trek: p.trek, platforma: true };
  const t = tezOqi().trek;
  return { trek: t === 'mobil' || t === 'web' ? t : null, platforma: false };
};
const bundleTurOl = (trek) => (trek === 'mobil' ? 'atlas-android' : trek === 'web' ? 'build-eng-katta-js' : null);
const olchovBor = (o) => !!o && typeof o === 'object' && ['baho', 'lcp', 'cls', 'tbt', 'bundleKb'].some(k => o[k] != null);
const sonP = (v) => (v == null ? null : String(v).replace('.', ','));
const bugun = () => { const d = new Date(); const p = (n) => String(n).padStart(2, '0'); return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`; };
const OLCHOV_MAYDON = [
  { id: 'baho', n: '1', y: { uz: 'Lighthouse bahosi (0–100)', ru: 'Оценка Lighthouse (0–100)' }, nom: { uz: 'Lighthouse bahosi', ru: 'Оценка Lighthouse' }, birlik: '', butun: true, osishYaxshi: true },
  { id: 'lcp', n: '2', y: { uz: 'LCP, soniya', ru: 'LCP, секунды' }, nom: { uz: 'LCP, s', ru: 'LCP, с' }, birlik: 's' },
  { id: 'cls', n: '3', y: { uz: 'CLS', ru: 'CLS' }, nom: { uz: 'CLS', ru: 'CLS' }, birlik: '' },
  { id: 'tbt', n: '4', y: { uz: 'TBT, ms', ru: 'TBT, мс' }, nom: { uz: 'TBT, ms', ru: 'TBT, мс' }, birlik: 'ms' },
  { id: 'bundleKb', n: '5', y: { uz: 'Kod hajmi, kB', ru: 'Объём кода, kB' }, nom: { uz: 'Kod hajmi, kB', ru: 'Объём кода, kB' }, birlik: 'kB' }
];
const NATIJA_YORLIQ = { uz: 'kutilgan natija', ru: 'ожидаемый результат' };
const YOZASIZ = { uz: 'shu yerga yozasiz', ru: 'запишете сюда' };
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
const Band = ({ children }) => <span className="tz-band-q">{children}</span>;
const Kulrang = ({ children }) => <span className="tz-kulrang">{children}</span>;
// «{avvalgidek …}» tekshiruvi: kamida ikkita ish vergul bilan; «hammasi», «ilova» kabi bitta so'z emas (ikki tilli)
const BIR_SOZ = /^(hammasi|hamma|barchasi|barcha|ilova|loyiha|все|всё|приложение|проект)$/i;
const ikkiIsh = (s) => { const t = String(s || '').trim(); const b = t.split(/[,;]/).map(x => x.trim()).filter(x => x.length >= 2); return b.length >= 2 && !b.some(x => BIR_SOZ.test(x)); };
// Prompt qutisi: {…} joylari — kulrang namuna bilan; avto — kartadan/trekdan oldindan; kod (`…`) ichidagi qavs joy emas
const TzPrompt = ({ satrlar, avto = {}, joylar = [], qiymat = {}, onYoz, tekshir }) => {
  const [ok, setOk] = useState(false);
  const [xato, setXato] = useState(null);
  const subst = (s) => {
    let a = s;
    Object.entries(avto).forEach(([k, v]) => { if (v != null && v !== '') a = a.split(k).join(v); });
    joylar.forEach(j => { const v = String(qiymat[j.id] || '').trim(); if (v) a = a.split(j.joy).join(v); });
    return a;
  };
  const matn = satrlar.map(l => subst(tr(l)));
  const kor = (t, li) => t.split('`').flatMap((p, i) => (i % 2
    ? [<code key={li + 'c' + i} className="qcode">{p}</code>]
    : p.split(/(\{[^}\s][^}]*\})/g).map((x, j) => (/^\{[^\s].*\}$/.test(x) ? <span key={li + '-' + i + '-' + j} className="q-joy">{x}</span> : <React.Fragment key={li + '-' + i + '-' + j}>{x}</React.Fragment>))));
  const nusxa = async () => {
    const x = tekshir ? tekshir(qiymat) : null;
    if (x) { setXato(x); return; }
    setXato(null);
    try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="q-prompt tz-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa tz-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="tz-ps">{kor(l, i)}</span>)}
      {joylar.length > 0 && <span className="tz-joylar">{joylar.map(j => (
        <label key={j.id} className="tz-joy-m"><span className="tz-joy-n">{j.joy}</span>
          <input type="text" value={qiymat[j.id] || ''} maxLength={200} placeholder={tr(j.namuna)} onChange={e => { setXato(null); onYoz(j.id, e.target.value); }} /></label>))}</span>}
      {xato && <span className="tz-xato" role="status">{tr(xato)}</span>}
    </span>
  );
};
const Yordam = ({ satrlar, sarlavha, ost }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <span className="tz-yordam-ust">
      <QTugma ikkinchi className="tz-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="tz-yordam fade-step">{sarlavha && <b>{tr(sarlavha)}</b>}{satrlar.map((l, i) => <span key={i} className="tz-yordam-s">{tx(l)}</span>)}{ost && <span className="tz-kulrang">{tx(ost)}</span>}</span>}
    </span>
  );
};
// Trek: pm-m9d8-platforma.trek bo'lsa — kulrang qator; bo'lmasa — ikki chip (tanlov pm-m12d3-tezlik.trek ga)
const TrekQator = ({ trek, platforma, onTanla }) => (platforma
  ? <Kulrang>{tr({ uz: 'Trekingiz: ', ru: 'Ваш трек: ' })}{trek === 'mobil' ? tr({ uz: 'mobil', ru: 'мобильный' }) : 'web'}</Kulrang>
  : <span className={cx('tz-trek', !trek && 'tz-chorla')}>{[['mobil', { uz: 'Mobil trek', ru: 'Мобильный трек' }], ['web', { uz: 'Web-trek', ru: 'Веб-трек' }]].map(([id, t]) => <button type="button" key={id} className={cx('q-chip', trek === id && 'on')} onClick={() => onTanla(id)}>{tr(t)}</button>)}</span>);
// O'lchov kartasi — bitta karta, 5 maydon, yorliq input ichida (E 43); o'nlik vergul va nuqta; «kB | MB» chipi (MB ×1000)
const OlchovKarta = ({ tur, trek, eski, onSaqla }) => {
  const [v, setV] = useState(() => { const o = tezOqi()[tur]; return Object.fromEntries(OLCHOV_MAYDON.map(m => [m.id, o && o[m.id] != null ? sonP(o[m.id]) : ''])); });
  const [mb, setMb] = useState(false);
  const [saqlandi, setSaqlandi] = useState(() => olchovBor(tezOqi()[tur]));
  const yoz = (id, s) => { setSaqlandi(false); setV(o => ({ ...o, [id]: String(s).replace(/[^\d.,]/g, '').slice(0, 9) })); };
  const saqla = () => {
    const r = {};
    OLCHOV_MAYDON.forEach(m => { const n = parseFloat(String(v[m.id]).replace(',', '.')); r[m.id] = Number.isFinite(n) ? (m.id === 'bundleKb' && mb ? Math.round(n * 1000) : m.butun ? Math.round(n) : n) : null; });
    if (mb) { setMb(false); setV(o => ({ ...o, bundleKb: r.bundleKb == null ? '' : sonP(r.bundleKb) })); }
    setSaqlandi(true); onSaqla(r);
  };
  return (
    <span className="tz-ok">
      <span className="tz-ok-h">{tur === 'oldin' ? tr({ uz: '«Oldin»', ru: '«До»' }) : tr({ uz: '«Keyin»', ru: '«После»' })}</span>
      {OLCHOV_MAYDON.map(m => (
        <label key={m.id} className="tz-ok-m">
          <b>{m.n}</b>
          <input type="text" inputMode="decimal" value={v[m.id]} placeholder={tr(m.y)} aria-label={tr(m.y)} onChange={e => yoz(m.id, e.target.value)} />
          {m.id === 'bundleKb' && trek && <em>{trek === 'mobil' ? 'Atlas, Android' : tr({ uz: 'build, eng katta fayl', ru: 'build, самый большой файл' })}</em>}
          {m.id === 'bundleKb' && <span className="tz-ok-chip">{['kB', 'MB'].map(b => <button type="button" key={b} className={cx('q-chip', (b === 'MB') === mb && 'on')} onClick={() => setMb(b === 'MB')}>{b}</button>)}</span>}
          {eski && <em className="tz-ok-eski">{tr({ uz: 'Oldin', ru: 'До' })}: {sonYoz(eski[m.id], m.birlik)}</em>}
        </label>
      ))}
      <span className="tz-ok-amal"><QTugma ikkinchi className={halqa(!saqlandi)} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>{saqlandi && <span className="tz-ok-ok fade-step">✓ {tr({ uz: 'Saqlandi', ru: 'Сохранено' })}</span>}</span>
    </span>
  );
};
// Solishtirish qatorlari — faqat sonlardan (baho — oshgani yaxshi; LCP, CLS, TBT, kB — kamaygani yaxshi); «tezlashdi» so'zi yo'q
const Solishtir = ({ oldin, keyin }) => {
  if (!oldin || !keyin) return null;
  const qatorlar = OLCHOV_MAYDON.filter(m => oldin[m.id] != null && keyin[m.id] != null).map(m => {
    const o = oldin[m.id], k = keyin[m.id];
    const yon = k > o ? 'oshdi' : k < o ? 'kamaydi' : 'tengdi';
    const yaxshi = yon === 'tengdi' ? null : (m.osishYaxshi ? yon === 'oshdi' : yon === 'kamaydi');
    const soz = { oshdi: { uz: 'oshdi', ru: 'выросло' }, kamaydi: { uz: 'kamaydi', ru: 'уменьшилось' }, tengdi: { uz: "o'zgarmadi", ru: 'не изменилось' } }[yon];
    return <span key={m.id} className={cx('tz-sol', yaxshi === true && 'ok', yaxshi === false && 'err')}>{tr(m.nom)}: {sonYoz(o)} {tr({ uz: 'edi', ru: 'было' })}, {sonYoz(k)} {tr({ uz: "bo'ldi", ru: 'стало' })} — <b>{tr(soz)}</b></span>;
  });
  return qatorlar.length ? <span className="tz-sol-ro fade-step">{qatorlar}</span> : null;
};
// 1-amaliyot 4-qadam: tanlov kartasi — bittadan (E 53): «1-tuzatish — rasmlar» → «2-tuzatish — kutubxona yoki fayl»; saqlanganlar ixcham ✓ qator (bosib tahrirlanadi)
const TUZ_KARTA = [
  { id: 'rasmlar', h: { uz: '1-tuzatish — rasmlar', ru: '1-е исправление — картинки' }, ph: { uz: "ro'yxatdagi rasm(lar)ni belgilang", ru: 'отметьте картинку(и) из списка' }, yoq: { uz: "Lendingda rasm yo'q", ru: 'На лендинге нет картинок' } },
  { id: 'kutubxona', h: { uz: '2-tuzatish — kutubxona yoki fayl', ru: '2-е исправление — библиотека или файл' }, ph: { uz: 'bittasini belgilang', ru: 'отметьте одну' }, yoq: { uz: 'Keraksizi topilmadi', ru: 'Ненужной не нашлось' } }
];
const TuzatishKarta = ({ saqlangan, onSaqla }) => {
  const boshQ = () => { const r = {}; TUZ_KARTA.forEach(k => { const s = (saqlangan || []).find(x => x.startsWith(k.id + ':')); r[k.id] = s ? s.slice(k.id.length + 1).trim() : (saqlangan ? null : ''); }); return r; };
  const [q, setQ] = useState(boshQ);
  const [i, setI] = useState(saqlangan ? 2 : 0);
  const tayyor = (qq) => onSaqla(TUZ_KARTA.filter(k => qq[k.id]).map(k => `${k.id}: ${qq[k.id]}`));
  const qadam = (val) => { const qq = { ...q, [TUZ_KARTA[i].id]: val }; setQ(qq); if (i === 1) tayyor(qq); setI(i + 1); };
  const k = TUZ_KARTA[i];
  return (
    <span className="tz-tk">
      {TUZ_KARTA.slice(0, i).map((x, j) => <button type="button" key={x.id} className="tz-tk-ix" onClick={() => setI(j)}><b>✓</b>{tr(x.h)}: {q[x.id] ? q[x.id] : tr({ uz: "yo'q", ru: 'нет' })}</button>)}
      {k && <span className="tz-tk-karta fade-step" key={k.id}>
        <span className="tz-tk-n">{tr(k.h)} <em>{i + 1}{NB}/{NB}2</em></span>
        <input type="text" value={q[k.id] || ''} maxLength={120} placeholder={tr(k.ph)} aria-label={tr(k.h)} onChange={e => setQ(o => ({ ...o, [k.id]: e.target.value }))} />
        <span className="tz-tk-btn">
          <QTugma ikkinchi className={halqa(!!String(q[k.id] || '').trim())} disabled={!String(q[k.id] || '').trim()} onClick={() => qadam(String(q[k.id]).trim())}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
          <QTugma ikkinchi onClick={() => qadam(null)}>{tr(k.yoq)}</QTugma>
        </span>
      </span>}
      <Kulrang>{tr({ uz: "Ikkalasi «yo'q» — ham to'g'ri natija.", ru: 'Оба «нет» — тоже правильный результат.' })}</Kulrang>
    </span>
  );
};
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, izoh, ulgur, ulgurQadam = 99, ulgurShart, qulf, ustoz, extra }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const ochiq = done || (stepN >= ulgurQadam && (!ulgurShart || ulgurShart()));
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
      <div className={cx('tz-blok', qulfli && 'qulf', done && 'tugadi')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={steps.map(c => ({ h: tr(c.h), t: c.t, xato: c.xato }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={doneText ? tr(doneText) : null} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<>{done && izoh && <QIzoh>{tr(izoh)}</QIzoh>}<MentorPracticeStats live={_live} screen={screen} /></>}>
          {ortda && !done && <p className="tz-ortda">{tx(ortda)}</p>}
          {ulgur && !done && <p className="tz-ulgur">{tx(ulgur)}</p>}
          {ustoz && isMentorLive && <div className="tz-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{ustoz.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>}
        </QBlok>
      </div>
    </Stage>
  );
}

// --- 1-amaliyot: o'lchash «Oldin» ---
const A1_PROMPT = [
  { uz: "Qayerda: repo ildizi — yangi fayl `TEZLIK.md`; `lending/` va `{ilova papkasi}` — faqat o'qish uchun.", ru: 'Где: корень репозитория — новый файл `TEZLIK.md`; `lending/` и `{ilova papkasi}` — только для чтения.' },
  { uz: "Nima qilsin: `TEZLIK.md` ga «Tezlik» sarlavhasini, ostiga «Sahifa: lending · Mobile · Incognito · {bugungi sana}» qatorini va jadval yoz: ustunlar «Son · Oldin · Keyin»; qatorlar: Lighthouse bahosi — {baho} · LCP, s — {LCP} · CLS — {CLS} · TBT, ms — {TBT} · Kod hajmi, kB ({qayerdan}) — {kB}. «Keyin» ustuni bo'sh qolsin.", ru: 'Что сделать: запиши в `TEZLIK.md` заголовок «Tezlik», под ним строку «Sahifa: lending · Mobile · Incognito · {bugungi sana}» и таблицу: столбцы «Son · Oldin · Keyin»; строки: Lighthouse bahosi — {baho} · LCP, s — {LCP} · CLS — {CLS} · TBT, ms — {TBT} · Kod hajmi, kB ({qayerdan}) — {kB}. Столбец «Keyin» оставь пустым.' },
  { uz: "Keyin hech narsani o'zgartirmasdan ikki ro'yxat ber. 1) `lending/` dagi har rasm: fayl nomi, fayl hajmi, sahifada qanday o'lchamda ko'rinadi, `width` va `height` bormi, birinchi ekrandami yoki pastdami. 2) `{ilova papkasi}` kodiga import qilingan, lekin hozirgi mahsulotda kerak bo'lmagan kutubxona yoki fayl (ishlatilmaydigan ekran, komponent, kutubxona) — har biri uchun qayerda import qilingani va nega kerak emasligini ko'rsat. `package.json` da bor, lekin hech qayerda import qilinmagan kutubxonani ro'yxatga kiritma — u yuklanadigan kodga kirmaydi.", ru: 'Потом, ничего не меняя, дай два списка. 1) каждая картинка в `lending/`: имя файла, вес файла, в каком размере видна на странице, есть ли `width` и `height`, на первом экране или ниже. 2) библиотеки или файлы, импортированные в код `{ilova papkasi}`, но не нужные в нынешнем продукте (неиспользуемый экран, компонент, библиотека) — для каждого покажи, где импортирован и почему не нужен. Библиотеку, которая есть в `package.json`, но нигде не импортирована, в список не включай — она не входит в загружаемый код.' },
  { uz: "Nima buzilmasin: `TEZLIK.md` dan boshqa faylga tegma. `.env` fayllariga tegma. O'zgargan fayllarni ayt.", ru: 'Что не сломать: кроме `TEZLIK.md`, файлы не трогай. Файлы `.env` не трогай. Назови изменённые файлы.' }
];
const A1_YORDAM = [
  { uz: "Qayerda: repo ildizi — yangi fayl `TEZLIK.md`; `lending/` va `mobil/` — faqat o'qish uchun.", ru: 'Где: корень репозитория — новый файл `TEZLIK.md`; `lending/` и `mobil/` — только для чтения.' },
  { uz: "Nima qilsin: `TEZLIK.md` ga «Tezlik» sarlavhasini, ostiga «Sahifa: lending · Mobile · Incognito · {sana}» qatorini va jadval yoz: ustunlar «Son · Oldin · Keyin»; qatorlar: Lighthouse bahosi — {oldin baho} · LCP, s — {oldin LCP} · CLS — {oldin CLS} · TBT, ms — {oldin TBT} · Kod hajmi, kB (Expo Atlas) — {oldin kB}. «Keyin» ustuni bo'sh qolsin.", ru: 'Что сделать: запиши в `TEZLIK.md` заголовок «Tezlik», под ним строку «Sahifa: lending · Mobile · Incognito · {sana}» и таблицу: столбцы «Son · Oldin · Keyin»; строки: Lighthouse bahosi — {oldin baho} · LCP, s — {oldin LCP} · CLS — {oldin CLS} · TBT, ms — {oldin TBT} · Kod hajmi, kB (Expo Atlas) — {oldin kB}. Столбец «Keyin» оставь пустым.' },
  { uz: "Keyin hech narsani o'zgartirmasdan ikki ro'yxat ber. 1) `lending/` dagi har rasm: fayl nomi, fayl hajmi, sahifada qanday o'lchamda ko'rinadi, `width` va `height` bormi, birinchi ekrandami yoki pastdami. 2) `mobil/` kodiga import qilingan, lekin hozirgi mahsulotda kerak bo'lmagan kutubxona yoki fayl (ishlatilmaydigan ekran, komponent, kutubxona) — har biri uchun qayerda import qilingani va nega kerak emasligini ko'rsat. `package.json` da bor, lekin hech qayerda import qilinmagan kutubxonani ro'yxatga kiritma — u yuklanadigan kodga kirmaydi.", ru: 'Потом, ничего не меняя, дай два списка. 1) каждая картинка в `lending/`: имя файла, вес файла, в каком размере видна на странице, есть ли `width` и `height`, на первом экране или ниже. 2) библиотеки или файлы, импортированные в код `mobil/`, но не нужные в нынешнем продукте (неиспользуемый экран, компонент, библиотека) — для каждого покажи, где импортирован и почему не нужен. Библиотеку, которая есть в `package.json`, но нигде не импортирована, в список не включай — она не входит в загружаемый код.' },
  A1_PROMPT[3]
];
const A1Natija = () => {
  const tez = tezOqi();
  return (
    <div className="tz-an">
      <TezlikMd oldin={tez.oldin} keyinUstun={false} bosh={YOZASIZ} />
      <span className="tz-agent"><b>{tr({ uz: "Agent ro'yxati", ru: 'Список агента' })}</b><i>{tx({ uz: "rasm fayli · hajmi · pastda · `width` yo'q", ru: 'файл картинки · вес · ниже · `width` нет' })}</i><i>{tx({ uz: 'kutubxona · `mobil/` da import bor, ishlatilmaydi', ru: 'библиотека · в `mobil/` есть импорт, не используется' })}</i></span>
    </div>
  );
};
const ScreenA1 = (props) => {
  const tk = useMemo(trekOqi, []);
  const [trek, setTrek] = useState(tk.trek);
  const [tez, setTez] = useState(tezOqi);
  const yangila = () => setTez(tezOqi());
  const trekTanla = (t) => { setTrek(t); tezYoz({ trek: t, bundleTur: bundleTurOl(t) }); yangila(); };
  const oldinSaqla = (r) => { tezYoz({ trek, oldin: r, bundleTur: bundleTurOl(trek) }); yangila(); };
  const tuzSaqla = (arr) => { tezYoz({ tuzatishlar: arr }); yangila(); };
  const oldin = olchovBor(tez.oldin) ? tez.oldin : null;
  const tuz = Array.isArray(tez.tuzatishlar) ? tez.tuzatishlar : null;
  const papka = trek === 'mobil' ? 'mobil/' : trek === 'web' ? 'prototip/' : null;
  const avto = {
    '{ilova papkasi}': papka, '{bugungi sana}': bugun(),
    '{baho}': oldin && sonP(oldin.baho), '{LCP}': oldin && sonP(oldin.lcp), '{CLS}': oldin && sonP(oldin.cls), '{TBT}': oldin && sonP(oldin.tbt), '{kB}': oldin && sonP(oldin.bundleKb),
    '{qayerdan}': trek === 'mobil' ? 'Expo Atlas, Android' : trek === 'web' ? 'npm run build, eng katta fayl' : null
  };
  const mobil = trek !== 'web', web = trek !== 'mobil';
  const n = tuz ? tuz.length : 0;
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z mahsulotingiz", ru: 'Практика 1 · ваш продукт' }}
      title={{ uz: <>Lendingingizni o'lchab, <span className="italic" style={{ color: T.accent }}>sonlarni «Oldin» deb yozing</span>.</>, ru: <>Замерьте лендинг и <span className="italic" style={{ color: T.accent }}>запишите числа как «До»</span>.</> }}
      mentor={{ uz: "Avval o'lchaysiz, keyin tuzatasiz — «1 · Ochish»dan boshlang.", ru: 'Сначала измеряете, потом исправляете — начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tx({ uz: "Chrome'da yangi Incognito oyna oching: Ctrl + Shift + N (Mac: ⌘ + Shift + N). Unda lendingingiz manzilini oching (Netlify'dagi). Iloji bo'lsa — keyin ham o'sha kompyuter va o'sha internet.", ru: 'Откройте в Chrome новое окно Incognito: Ctrl + Shift + N (Mac: ⌘ + Shift + N). Откройте в нём адрес своего лендинга (на Netlify). По возможности и потом — тот же компьютер и тот же интернет.' })}
          <Band>{tx({ uz: "DevTools'ni oching: F12 yoki Ctrl + Shift + I (Mac: Cmd + Option + I). Panellar qatoridan «Lighthouse» ni tanlang. Sozlang: Mode — «Navigation», Device — «Mobile», Categories — faqat «Performance».", ru: 'Откройте DevTools: F12 или Ctrl + Shift + I (Mac: Cmd + Option + I). В ряду панелей выберите «Lighthouse». Настройте: Mode — «Navigation», Device — «Mobile», Categories — только «Performance».' })}</Band>
          <Band>{tx({ uz: "Incognito nega kerak — brauzerga qo'shilgan dasturlar (Extensions) natijaga aralashmasin; Lighthouse hujjati shunday maslahat beradi.", ru: 'Зачем Incognito — чтобы расширения браузера (Extensions) не вмешивались в результат; так советует документация Lighthouse.' })}</Band>
          <Band><TrekQator trek={trek} platforma={tk.platforma} onTanla={trekTanla} /></Band></> },
        { h: { uz: "O'lchash", ru: 'Измерить' }, t: <>{tx({ uz: "«Analyze page load» ni bosing va hisobotni kuting (odatda 30–60 soniya). Hisobotdan to'rt sonni kartaga yozing.", ru: 'Нажмите «Analyze page load» и дождитесь отчёта (обычно 30–60 секунд). Перенесите из отчёта четыре числа в карточку.' })}
          <Band>{tx({ uz: 'Keyin ilovangizning yuklanadigan kod hajmi — beshinchi maydon:', ru: 'Затем объём загружаемого кода вашего приложения — пятое поле:' })}</Band>
          {!tk.platforma && !trek && <Band><TrekQator trek={trek} platforma={false} onTanla={trekTanla} /></Band>}
          {mobil && <Band>{tx({ uz: "mobil trek — terminalda `mobil/` papkasida: `EXPO_ATLAS=true npx expo export`, keyin `npx expo-atlas .expo/atlas.jsonl`. Brauzerda Atlas oynasi ochiladi — Android uchun yuklanadigan kod hajmini yozing.", ru: 'мобильный трек — в терминале в папке `mobil/`: `EXPO_ATLAS=true npx expo export`, затем `npx expo-atlas .expo/atlas.jsonl`. В браузере откроется окно Atlas — запишите объём загружаемого кода для Android.' })}</Band>}
          {mobil && <Kulrang>{tx({ uz: "Windows PowerShell'da birinchi buyruq boshqacha: `$env:EXPO_ATLAS=\"true\"; npx expo export`. Ishlamasa — agentdan so'rang: «Expo Atlas'ni shu kompyuterda ishga tushirish buyrug'ini ayt. Hech narsani o'zgartirma.»", ru: 'В Windows PowerShell первая команда другая: `$env:EXPO_ATLAS="true"; npx expo export`. Если не работает — спросите агента: «Expo Atlas\'ni shu kompyuterda ishga tushirish buyrug\'ini ayt. Hech narsani o\'zgartirma.»' })}</Kulrang>}
          {web && <Band>{tx({ uz: "web-trek — terminalda `prototip/` papkasida: `npm run build`. Terminal har faylning hajmini kB da ko'rsatadi — eng katta `.js` faylning hajmini yozing (bitta son; bu builddagi fayl hajmi — ilova ochilganda yuklanadigan hamma kod emas).", ru: 'веб-трек — в терминале в папке `prototip/`: `npm run build`. Терминал покажет вес каждого файла в kB — запишите вес самого большого `.js` файла (одно число; это вес файла в сборке — не весь код, который загружается при открытии приложения).' })}</Band>}
          <Band>{tr({ uz: "Lighthouse lending sahifasini, kod hajmi esa ilova kodini o'lchaydi — ikki xil narsa, ikki alohida son.", ru: 'Lighthouse измеряет страницу лендинга, а объём кода — код приложения: это две разные вещи, два отдельных числа.' })}</Band>
          <OlchovKarta tur="oldin" trek={trek} onSaqla={oldinSaqla} />
          <Kulrang>{tr({ uz: "Hajm MB da chiqsa — kartadagi «MB» chipini tanlang, dars kB ga aylantiradi.", ru: 'Если объём в MB — выберите на карточке чип «MB», урок переведёт в kB.' })}</Kulrang>
          {mobil && <Band>{tx({ uz: "Mobil trekda: `.expo/` papkasi push qilinmaydi — Atlas fayli ichida loyiha sozlamalari bor (Expo hujjati: faqat ishonchli odamga). Bir marta tekshiring: `git ls-files .expo` — natija bo'sh bo'lsin (Git allaqachon kuzatayotgan bo'lsa `git status` ko'rsatmaydi). Bo'sh bo'lmasa yoki `git status` da `.expo/` ko'rinsa — agentga: «`.expo/` papkasini `.gitignore` ga qo'sh va Git kuzatuvidan chiqar.»", ru: 'В мобильном треке: папку `.expo/` не пушим — в файле Atlas есть настройки проекта (документация Expo: только доверенным людям). Проверьте один раз: `git ls-files .expo` — результат должен быть пустым (если Git уже отслеживает, `git status` не покажет). Если не пусто или `git status` показывает `.expo/` — агенту: «`.expo/` papkasini `.gitignore` ga qo\'sh va Git kuzatuvidan chiqar.»' })}</Band>}</> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslar kartadan oldindan to'ldirilgan; tekshiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'скобки заранее заполнены из карточки; проверьте, нажмите «Скопировать» и отправьте в Antigravity:' })}
          <TzPrompt satrlar={A1_PROMPT} avto={avto} />
          <Band>{tx({ uz: "Agent tugatgach: `git status` — faqat `TEZLIK.md` (va `.gitignore`, agar qo'shilgan bo'lsa), `.env` va `.expo/` yo'q; `git add TEZLIK.md` → `git commit -m \"tezlik oldin\"` → `git push`.", ru: 'Когда агент закончит: `git status` — только `TEZLIK.md` (и `.gitignore`, если добавлен), `.env` и `.expo/` нет; `git add TEZLIK.md` → `git commit -m "tezlik oldin"` → `git push`.' })}</Band>
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq talab (mobil trek)", ru: 'Полное требование из примера Ментора (мобильный трек)' }} satrlar={A1_YORDAM} /></> },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: '(1) GitHub\'da ', ru: '(1) Откройте на GitHub ' })}{fmtCode('`TEZLIK.md`')}{tr({ uz: " ni oching: jadvaldagi sonlar kartangizdagi bilan bir xilmi.", ru: ': совпадают ли числа в таблице с вашей карточкой.' })}
          <Band>{tr({ uz: "(2) Agent ro'yxatlarida har band yonida dalil bormi: rasm — fayl hajmi va joyi; kutubxona yoki fayl — qayerda import qilingani va nega kerak emasligi. Dalilsiz band — tanlanmaydi.", ru: '(2) Есть ли в списках агента доказательство у каждого пункта: картинка — вес файла и место; библиотека или файл — где импортирован и почему не нужен. Пункт без доказательства не выбирается.' })}</Band>
          <Band>{tr({ uz: "(3) Dalili bor tuzatishlarni tanlang — 0, 1 yoki 2 ta:", ru: '(3) Выберите исправления с доказательством — 0, 1 или 2:' })}</Band>
          <TuzatishKarta saqlangan={tuz} onSaqla={tuzSaqla} />
          <Band>{tr({ uz: "Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Несовпавшее напишите агенту: «{nima} talabdagidek emas: {qanday bo\'lsin}. Boshqa joyga tegma, o\'zgargan fayllarni ayt.»' })}</Band></> }
      ]}
      qulf={(i) => (i === 1 && !oldin) || (i === 3 && !tuz)}
      natija={<A1Natija />}
      ulgur={{ uz: "Ulgurmasangiz: Lighthouse uzoq kutilsa — 2-qadamdan keyin «Davom etish» ochiladi (sonlar saqlangan bo'lsa); 3–4-qadam 2-amaliyot boshida qilinadi. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: если Lighthouse долго ждать — после 2-го шага откроется «Продолжить» (если числа сохранены); шаги 3–4 делаются в начале 2-й практики. Блок считается выполненным после «Готово» на 4-м шаге.' }}
      ulgurQadam={2} ulgurShart={() => !!oldin}
      doneText={n > 0 ? { uz: `«Oldin» sonlari yozildi va ${n} tuzatish tanlandi — endi uni qilasiz.`, ru: `Числа «До» записаны, выбрано исправлений: ${n} — теперь сделаете их.` } : { uz: "«Oldin» sonlari yozildi — dalili bor tuzatish topilmadi; qayta o'lchov baribir qilinadi.", ru: 'Числа «До» записаны — исправления с доказательством не нашлось; повторный замер всё равно делается.' }}
      izoh={{ uz: "Agent ro'yxati — taklif: qaysi tuzatishni qilishni siz tanladingiz.", ru: 'Список агента — предложение: какое исправление делать, выбрали вы.' }}
      ustoz={[
        { uz: "DevTools'da «Lighthouse» paneli ko'rinmasa — panellar qatoridagi «»» belgisi ostida bo'ladi. Lighthouse o'lchovi paytida boshqa ilovalarni yopish so'raladi — sharoit bir xil bo'lsin. Sonlarni sinfda qo'l ko'tartirib solishtirilmaydi.", ru: 'Если в DevTools не видно панели «Lighthouse» — она под значком «»» в ряду панелей. Во время замера Lighthouse просим закрыть другие приложения — условия должны быть одинаковыми. Числа в классе поднятием рук не сравниваем.' }
      ]} />
  );
};

// --- 2-amaliyot: dalilli tuzatish (0–2) ---
const A2_QAYERDA = { uz: "Qayerda: `lending/` — rasmlar va `index.html`; `{ilova papkasi}` — `package.json` va kod.", ru: 'Где: `lending/` — картинки и `index.html`; `{ilova papkasi}` — `package.json` и код.' };
const A2_RASM = { uz: "Nima qilsin: 1) Rasmlar: {rasmlar} ni sahifada kerak bo'ladigan o'lchamdan ortiqcha katta bo'lmaydigan qilib kichraytir — rasm xira bo'lib qolmasin; fayl nomi va turi o'zgarmasin. `lending/index.html` dagi har `<img>` ga haqiqiy `width` va `height` yoz. Birinchi ekrandan pastdagi rasmlarga `loading=\"lazy\"` qo'y, birinchi ekrandagi rasmga qo'yma.", ru: 'Что сделать: 1) Картинки: уменьши {rasmlar} так, чтобы они были не больше нужного на странице размера, — без потери чёткости; имя и тип файла не меняй. Каждому `<img>` в `lending/index.html` запиши настоящие `width` и `height`. Картинкам ниже первого экрана поставь `loading="lazy"`, картинке первого экрана — не ставь.' };
const A2_KUTUB = { uz: "2) Kutubxona yoki fayl: {kutubxona} hozirgi mahsulotda kerak emasligini qayta tekshir" + " — qayerda import qilinganini va nega kerak emasligini ko'rsat. Men «Davom et» deb yozmagunimcha o'chirma; keyin uning importini va faqat unga tegishli kodni olib tashla; kutubxona bo'lsa — `{ilova papkasi}package.json` dan ham.", ru: '2) Библиотека или файл: ещё раз проверь, что {kutubxona} не нужна в нынешнем продукте, — покажи, где импортирована и почему не нужна. Не удаляй, пока я не напишу «Davom et»; потом убери её импорт и только относящийся к ней код; если это библиотека — и из `{ilova papkasi}package.json`.' };
const A2_BUZ = { uz: "Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; lending ko'rinishi o'zgarmasin. Rasmni kichraytirish uchun loyihaga yangi kutubxona qo'shma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: {avvalgidek ishlashi kerak bo\'lgan ishlar} работают как раньше; вид лендинга не меняется. Для уменьшения картинок не добавляй в проект новую библиотеку. Файлы `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' };
const A2_YORDAM = [
  { uz: "Qayerda: `lending/` — rasmlar va `index.html`; `mobil/` — `package.json` va kod.", ru: 'Где: `lending/` — картинки и `index.html`; `mobil/` — `package.json` и код.' },
  { uz: "Nima qilsin: 1) Rasmlar: {Mentor rasmlari} ni sahifada kerak bo'ladigan o'lchamdan ortiqcha katta bo'lmaydigan qilib kichraytir — rasm xira bo'lib qolmasin; fayl nomi va turi o'zgarmasin. `lending/index.html` dagi har `<img>` ga haqiqiy `width` va `height` yoz. Birinchi ekrandan pastdagi rasmlarga `loading=\"lazy\"` qo'y, birinchi ekrandagi rasmga qo'yma.", ru: 'Что сделать: 1) Картинки: уменьши {Mentor rasmlari} так, чтобы они были не больше нужного на странице размера, — без потери чёткости; имя и тип файла не меняй. Каждому `<img>` в `lending/index.html` запиши настоящие `width` и `height`. Картинкам ниже первого экрана поставь `loading="lazy"`, картинке первого экрана — не ставь.' },
  { uz: "2) Kutubxona yoki fayl: {Mentor kutubxonasi} hozirgi mahsulotda kerak emasligini qayta tekshir" + " — qayerda import qilinganini va nega kerak emasligini ko'rsat. Men «Davom et» deb yozmagunimcha o'chirma; keyin uning importini va faqat unga tegishli kodni olib tashla; kutubxona bo'lsa — `mobil/package.json` dan ham.", ru: '2) Библиотека или файл: ещё раз проверь, что {Mentor kutubxonasi} не нужна в нынешнем продукте, — покажи, где импортирована и почему не нужна. Не удаляй, пока я не напишу «Davom et»; потом убери её импорт и только относящийся к ней код; если это библиотека — и из `mobil/package.json`.' },
  { uz: "Nima buzilmasin: kirish, «O'yinlar» ro'yxati, qo'shilish, real vaqt va «Qo'shilmoqchiman» tugmasi avvalgidek ishlasin; lending ko'rinishi o'zgarmasin. Rasmni kichraytirish uchun loyihaga yangi kutubxona qo'shma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход, список «O\'yinlar», присоединение, реальное время и кнопка «Qo\'shilmoqchiman» работают как раньше; вид лендинга не меняется. Для уменьшения картинок не добавляй в проект новую библиотеку. Файлы `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' }
];
const A2_KOD_PROMPT = [{ uz: "O'zgartirgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: `loading=\"lazy\"` qo'yilgan `<img>` qatorlari va birinchi ekrandagi rasm qatori. Har biri nega shunday ekanini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в изменённом коде два места с именем файла и номером строки: строки `<img>` с `loading="lazy"` и строку картинки первого экрана. Одной фразой объясни, почему каждое так. Код не меняй.' }];
const A2Natija = () => (
  <div className="tz-an">
    <span className="tz-fayllar">
      <span className="tz-fayl2"><code>lending/index.html</code><em>{tx({ uz: "o'zgardi: `width`, `height`, pastdagilarga `loading=\"lazy\"`", ru: 'изменён: `width`, `height`, нижним — `loading="lazy"`' })}</em></span>
      <span className="tz-fayl2"><code>lending/</code><em>{tr({ uz: 'rasm fayli · kichraytirildi', ru: 'файл картинки · уменьшен' })}</em></span>
      <span className="tz-fayl2"><code>mobil/package.json</code><em>{tr({ uz: 'kutubxona olib tashlandi', ru: 'библиотека убрана' })}</em></span>
      <span className="tz-fayl2"><code>mobil/package-lock.json</code><em>{tr({ uz: "o'zgardi", ru: 'изменён' })}</em></span>
    </span>
    <span className="tz-kk-k kichik">
      <span className="tz-kk-q"><Jx>&lt;img</Jx> <At>src</At>=<St>"oyinlar.png"</St> <At>width</At>=<St>"180"</St> <At>height</At>=<St>"320"</St><Jx>&gt;</Jx></span>
      <span className="tz-kk-q yangi"><Jx>&lt;img</Jx> <At>src</At>=<St>"…"</St> <At>loading</At>=<St>"lazy"</St> <At>width</At>=<St>"180"</St> <At>height</At>=<St>"320"</St><Jx>&gt;</Jx></span>
    </span>
  </div>
);
const ScreenA2 = (props) => {
  const tk = useMemo(trekOqi, []);
  const tez = useMemo(tezOqi, []);
  const tuz = Array.isArray(tez.tuzatishlar) ? tez.tuzatishlar : null;
  const ol = (id) => { const s = tuz && tuz.find(x => x.startsWith(id + ':')); return s ? s.slice(id.length + 1).trim() : ''; };
  const yoqR = !!tuz && !ol('rasmlar');
  const yoqK = !!tuz && !ol('kutubxona');
  const nol = !!tuz && tuz.length === 0;
  const [q, setQ] = useState(() => ({ rasmlar: ol('rasmlar'), kutubxona: ol('kutubxona'), avval: '' }));
  const yoz = (k, v) => setQ(o => ({ ...o, [k]: v }));
  const papka = tk.trek === 'mobil' ? 'mobil/' : tk.trek === 'web' ? 'prototip/' : null;
  const satrlar = [A2_QAYERDA, ...(yoqR ? [] : [A2_RASM]), ...(yoqK ? [] : [yoqR ? { uz: 'Nima qilsin: ' + A2_KUTUB.uz, ru: 'Что сделать: ' + A2_KUTUB.ru } : A2_KUTUB]), A2_BUZ];
  const joylar = [
    ...(yoqR ? [] : [{ id: 'rasmlar', joy: '{rasmlar}', namuna: { uz: "masalan: telefon maketi surati (lending/ dagi fayl nomi)", ru: 'например: снимок макета телефона (имя файла в lending/)' } }]),
    ...(yoqK ? [] : [{ id: 'kutubxona', joy: '{kutubxona}', namuna: { uz: "masalan: ro'yxatdagi — import qilingan, lekin kerak bo'lmagan kutubxona nomi", ru: 'например: из списка — имя импортированной, но ненужной библиотеки' } }]),
    { id: 'avval', joy: "{avvalgidek ishlashi kerak bo'lgan ishlar}", namuna: { uz: "masalan: kirish, «O'yinlar» ro'yxati, qo'shilish, «Qo'shilmoqchiman» tugmasi", ru: 'например: вход, список «O\'yinlar», присоединение, кнопка «Qo\'shilmoqchiman»' } }
  ];
  const tekshir = (v) => (ikkiIsh(v.avval) ? null : { uz: 'Ikkita aniq ish yozing: masalan, kirish, qo\'shilish.', ru: 'Напишите два конкретных дела: например, вход, присоединение.' });
  const soni = [q.rasmlar, q.kutubxona].filter(x => String(x || '').trim()).length;
  const tanlov = { uz: `1-tuzatish: ${yoqR ? "yo'q" : (q.rasmlar || '{rasmlar}')} · 2-tuzatish: ${yoqK ? "yo'q" : (q.kutubxona || '{kutubxona}')}`, ru: `1-е исправление: ${yoqR ? 'нет' : (q.rasmlar || '{rasmlar}')} · 2-е исправление: ${yoqK ? 'нет' : (q.kutubxona || '{kutubxona}')}` };
  const QADAM1 = { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tr({ uz: "Antigravity'da o'z repo'ngizni oching.", ru: 'Откройте свой репозиторий в Antigravity.' })}
    <Kulrang>{tr(tanlov)}</Kulrang>
    <Band>{tr({ uz: "Bugun ilovaga yangi narsa qo'shilmaydi: agent «yana bir narsa qo'shay» desa — «Yo'q, faqat talabdagi ish» deng.", ru: 'Сегодня в приложение ничего нового не добавляем: если агент предложит «добавлю ещё кое-что» — скажите «Yo\'q, faqat talabdagi ish».' })}</Band></> };
  const steps = nol ? [QADAM1] : [
    QADAM1,
    { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni tekshiring va to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'проверьте и заполните скобки, нажмите «Скопировать» и отправьте в Antigravity:' })}
      <TzPrompt satrlar={satrlar} avto={{ '{ilova papkasi}': papka }} joylar={joylar} qiymat={q} onYoz={yoz} tekshir={tekshir} />
      <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq talab (mobil trek)", ru: 'Полное требование из примера Ментора (мобильный трек)' }} satrlar={A2_YORDAM} /></> },
    { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tr({ uz: "agent dalilni ko'rsatadi: import bor, lekin kerak emas (ishlatadigan joy yo'q yoki faqat ishlatilmaydigan ekranda) — «Davom et» deb yozing; kerakli joyda ishlatilsa — «To'xta, o'chirma» deb yozing (2-tuzatish qilinmaydi).", ru: 'агент показывает доказательство: импорт есть, но не нужен (нет места использования или только на неиспользуемом экране) — напишите «Davom et»; если используется в нужном месте — напишите «To\'xta, o\'chirma» (2-е исправление не делается).' })}
      <Band>{tx({ uz: "Agent tugatgach — avval o'zingiz ko'ring, keyin push: (1) ilova ishlaydimi: mobil trek — `npx expo start` → Expo Go'da asosiy yo'l (Mentor misolida: kirish → «O'yinlar» → «Qo'shilaman»); web-trek — `prototip/` da `npm run dev` va o'sha yo'l brauzerda; (2) `lending/index.html` ni kompyuter brauzerida oching: rasmlar joyida va xira emas, tepadagi rasm qatorida `loading=\"lazy\"` yo'q.", ru: 'Когда агент закончит — сначала посмотрите сами, потом push: (1) работает ли приложение: мобильный трек — `npx expo start` → основной путь в Expo Go (в примере Ментора: вход → «O\'yinlar» → «Qo\'shilaman»); веб-трек — `npm run dev` в `prototip/` и тот же путь в браузере; (2) откройте `lending/index.html` в браузере компьютера: картинки на месте и не мутные, в строке верхней картинки нет `loading="lazy"`.' })}</Band>
      <Band>{tx({ uz: "Ishlasa: `git status` — o'zgargan fayllar agent ro'yxati bilan bir xil, `.env` va `.expo/` yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"tezlik: rasmlar va kutubxona\"`, `git push`. Netlify lendingni yangilaydi — odatda bir necha daqiqa. Ishlamasa — pastdagi xato yo'li, push yo'q.", ru: 'Если работает: `git status` — изменённые файлы совпадают со списком агента, `.env` и `.expo/` нет; добавьте каждый файл через `git add <fayl>`, `git commit -m "tezlik: rasmlar va kutubxona"`, `git push`. Netlify обновит лендинг — обычно за несколько минут. Если не работает — путь ошибки ниже, без push.' })}</Band>
      <Band>{tr({ uz: "Kutayotganda agentdan o'zgargan joyni ko'rsatishni so'rang:", ru: 'Пока ждёте, попросите агента показать изменённое место:' })}</Band>
      <TzPrompt satrlar={A2_KOD_PROMPT} /></>,
      xato: tx({ uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.» Kutubxona olib tashlangach ilova ochilmasa — agentga: «O'chirilgan {kutubxona} ni qayta qo'y — faqat shu o'chirishni qaytar, boshqa joyga tegma.»; 2-tuzatish qilinmagan sanaladi.", ru: 'Если ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Shu xato chiqdi: {xato}. Tuzat.» Если после удаления библиотеки приложение не открывается — агенту: «O\'chirilgan {kutubxona} ni qayta qo\'y — faqat shu o\'chirishni qaytar, boshqa joyga tegma.»; 2-е исправление считается несделанным.' }) },
    { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "talabning har gapini o'zingiz ko'ring:", ru: 'проверьте сами каждую фразу требования:' })}
      <Band>{tr({ uz: "(1) Lendingingizni telefoningizda oching: tepadagi rasm aylantirmasdan ko'rinadimi, rasmlar xira yoki cho'zilgan emasmi, «Qo'shilmoqchiman» (yoki sizdagi asosiy tugma) bosiladimi.", ru: '(1) Откройте лендинг на телефоне: видна ли верхняя картинка без прокрутки, не мутные ли и не растянутые картинки, нажимается ли «Qo\'shilmoqchiman» (или ваша главная кнопка).' })}</Band>
      <Band>{tx({ uz: "(2) `lending/index.html` da tepadagi rasm qatorida `loading=\"lazy\"` yo'q, hamma `<img>` da `width` va `height` bor.", ru: '(2) В `lending/index.html` в строке верхней картинки нет `loading="lazy"`, у всех `<img>` есть `width` и `height`.' })}</Band>
      <Band>{tr({ uz: "(3) Netlify'dagi lending yangilanganini ko'ring (rasmlar yangisi); ilova — 3-qadamda push'dan oldin tekshirilgan.", ru: '(3) Убедитесь, что лендинг на Netlify обновился (картинки новые); приложение проверено на 3-м шаге до push.' })}</Band>
      <Band>{tr({ uz: "Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.» → push → qayta tekshiring.", ru: 'Несовпавшее напишите агенту: «{nima} talabdagidek emas: {qanday bo\'lsin}. Boshqa joyga tegma, o\'zgargan fayllarni ayt.» → push → проверьте снова.' })}</Band></> }
  ];
  const doneText = nol || soni === 0 ? { uz: "Bu safar dalili bor tuzatish topilmadi — qayta o'lchov baribir qilinadi.", ru: 'На этот раз исправления с доказательством не нашлось — повторный замер всё равно делается.' }
    : soni === 1 ? { uz: 'Bitta tuzatish qilindi — ikkinchisi uchun keraksiz narsa topilmadi.', ru: 'Сделано одно исправление — для второго ненужного не нашлось.' }
      : { uz: "Ikki tuzatish qilindi — endi xuddi shu sharoitda qayta o'lchaysiz.", ru: 'Сделаны два исправления — теперь перемерите в тех же условиях.' };
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z repo'ngiz", ru: 'Практика 2 · ваш репозиторий' }}
      title={{ uz: <>Dalili bor tuzatishlarni qiling: <span className="italic" style={{ color: T.accent }}>rasm, keraksiz kod</span>.</>, ru: <>Сделайте исправления с доказательством: <span className="italic" style={{ color: T.accent }}>картинки, ненужный код</span>.</> }}
      mentor={{ uz: "Talab tayyor — tanlagan tuzatishingiz qavslarga qo'yilgan; «1 · Ochish»dan boshlang.", ru: 'Требование готово — выбранное исправление подставлено в скобки; начните с «1 · Открыть».' }}
      steps={steps}
      natija={<A2Natija />}
      ulgur={nol ? null : { uz: "Ulgurmasangiz: Netlify kutishi cho'zilsa — 4-qadamning (1) bandi 3-amaliyot boshida; «Davom etish» 3-qadamdan keyin ochiladi. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: если ожидание Netlify затянулось — пункт (1) 4-го шага в начале 3-й практики; «Продолжить» откроется после 3-го шага. Блок считается выполненным после «Готово» на 4-м шаге.' }}
      ulgurQadam={nol ? 99 : 3}
      doneText={doneText}
      izoh={{ uz: "Agentning «tayyor» degani — da'vo; tezlik o'zgargani 3-amaliyotdagi sonlardan bilinadi.", ru: '«Готово» от агента — утверждение; изменилась ли скорость, покажут числа в 3-й практике.' }}
      extra={() => ({ tuzatishSoni: nol ? 0 : soni })}
      ustoz={[
        { uz: "Agent rasmni o'zgartira olmasa (asbob yo'q) — o'quvchi faqat `width`, `height` va `loading` qismini qiladi; yakunda «1-tuzatish» baribir qilingan sanaladi (atributlar bor).", ru: 'Если агент не может изменить картинку (нет инструмента) — ученик делает только `width`, `height` и `loading`; в итоге «1-е исправление» всё равно считается сделанным (атрибуты есть).' },
        { uz: "Kutubxona olib tashlangach ilova ochilmasa — agentga «faqat shu o'chirishni qaytar» (3-qadam xato yo'li; `git revert` o'rgatilmaydi, agent boshqa joyga tegmasin); kerak bo'lsa o'qituvchi yordam beradi.", ru: 'Если после удаления библиотеки приложение не открывается — агенту «верни только это удаление» (путь ошибки 3-го шага; `git revert` не изучаем, агент не трогает другое); при необходимости помогает учитель.' }
      ]} />
  );
};

// --- 3-amaliyot: qayta o'lchash «Keyin» ---
const A3Natija = () => {
  const tez = tezOqi();
  return (
    <div className="tz-an">
      <TezlikMd oldin={tez.oldin} keyin={tez.keyin} github tuzatishlar={Array.isArray(tez.tuzatishlar) ? tez.tuzatishlar : []} bosh={YOZASIZ} />
    </div>
  );
};
const ozgarganlar = (o, k) => (o && k ? OLCHOV_MAYDON.filter(m => o[m.id] != null && k[m.id] != null && o[m.id] !== k[m.id])
  .map(m => `${m.id === 'baho' ? 'Lighthouse bahosi' : m.id === 'bundleKb' ? 'Kod hajmi' : m.id.toUpperCase()} ${sonYoz(o[m.id], m.birlik)} → ${sonYoz(k[m.id], m.birlik)}`) : []);
const ScreenA3 = (props) => {
  const tk = useMemo(trekOqi, []);
  const [tez, setTez] = useState(tezOqi);
  const [qaytaIzoh, setQaytaIzoh] = useState(null);
  const oldin = olchovBor(tez.oldin) ? tez.oldin : null;
  const keyin = olchovBor(tez.keyin) ? tez.keyin : null;
  const tuz = Array.isArray(tez.tuzatishlar) ? tez.tuzatishlar : null;
  const keyinSaqla = (r) => {
    const avvalgi = olchovBor(tez.keyin) ? tez.keyin : null;
    if (avvalgi) { const f = ozgarganlar(avvalgi, r); setQaytaIzoh(f.length ? f.join('; ') : null); }
    tezYoz({ keyin: r }); setTez(tezOqi());
    if (oldin && olchovBor(r)) props.onAnswer(props.screen, { ...(props.storedAnswer || {}), stage: 'practice-olchov', olchov: true, correct: true });
  };
  const avto = {
    '{baho}': keyin && sonP(keyin.baho), '{LCP}': keyin && sonP(keyin.lcp), '{CLS}': keyin && sonP(keyin.cls), '{TBT}': keyin && sonP(keyin.tbt), '{kB}': keyin && sonP(keyin.bundleKb),
    '{tuzatishlar}': tuz ? (tuz.length ? tuz.join('; ') : 'bu safar tuzatish tanlanmadi') : null,
    '{izoh}': qaytaIzoh ? `Jadval ostiga «Izoh: qayta o'lchov — ${qaytaIzoh}» qatorini yoz.` : ''
  };
  const A3_PROMPT = [
    { uz: 'Qayerda: `TEZLIK.md`.', ru: 'Где: `TEZLIK.md`.' },
    { uz: "Nima qilsin: «Keyin» ustuniga sonlarni yoz: Lighthouse bahosi — {baho} · LCP, s — {LCP} · CLS — {CLS} · TBT, ms — {TBT} · Kod hajmi, kB — {kB}. Jadval ostiga «Tuzatishlar» sarlavhasini va qatorlarni yoz: {tuzatishlar} (tanlanmagan bo'lsa — «bu safar tuzatish tanlanmadi»). {izoh} Xulosa yoki baho so'zi qo'shma — faqat sonlar.", ru: 'Что сделать: запиши числа в столбец «Keyin»: Lighthouse bahosi — {baho} · LCP, s — {LCP} · CLS — {CLS} · TBT, ms — {TBT} · Kod hajmi, kB — {kB}. Под таблицей запиши заголовок «Tuzatishlar» и строки: {tuzatishlar} (если не выбраны — «bu safar tuzatish tanlanmadi»). {izoh} Выводов и слов-оценок не добавляй — только числа.' },
    { uz: "Nima buzilmasin: «Oldin» ustuni o'zgarmasin. Boshqa faylga tegma. O'zgargan fayllarni ayt.", ru: 'Что не сломать: столбец «Oldin» не меняется. Другие файлы не трогай. Назови изменённые файлы.' }
  ];
  const ozg = ozgarganlar(oldin, keyin);
  const ilovaOzg = tuz ? tuz.some(t => t.startsWith('kutubxona:')) : null;
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 3 · o'z mahsulotingiz", ru: 'Практика 3 · ваш продукт' }}
      title={{ uz: <>Xuddi shu sharoitda qayta o'lchang <span className="italic" style={{ color: T.accent }}>va solishtiring</span>.</>, ru: <>Перемерьте в тех же условиях <span className="italic" style={{ color: T.accent }}>и сравните</span>.</> }}
      mentor={{ uz: "Sharoit o'sha qolsin: o'sha sahifa, Mobile rejimi, Incognito oyna — «1 · Ochish»dan boshlang.", ru: 'Условия те же: та же страница, режим Mobile, окно Incognito — начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tr({ uz: "Netlify'da lendingning yangi versiyasi chiqqanini ko'ring (sahifani oching: rasmlar yangisi). Yangi Incognito oyna → lending → DevTools → «Lighthouse»: Mode — «Navigation», Device — «Mobile», Categories — faqat «Performance» (1-amaliyotdagidek; iloji bo'lsa o'sha kompyuter, o'sha internet).", ru: 'Убедитесь, что на Netlify вышла новая версия лендинга (откройте страницу: картинки новые). Новое окно Incognito → лендинг → DevTools → «Lighthouse»: Mode — «Navigation», Device — «Mobile», Categories — только «Performance» (как в 1-й практике; по возможности тот же компьютер и тот же интернет).' })}</> },
        { h: { uz: "Qayta o'lchash", ru: 'Перемерить' }, t: <>{tr({ uz: "«Analyze page load» → to'rt son kartaga «Keyin» (yonida kulrang — «Oldin» sonlari).", ru: '«Analyze page load» → четыре числа в карточку «После» (рядом серым — числа «До»).' })}
          <Band>{tx({ uz: "Kod hajmi — 1-amaliyotdagi o'sha buyruq bilan (mobil — Expo Atlas, web — `npm run build`).", ru: 'Объём кода — той же командой, что в 1-й практике (мобильный — Expo Atlas, веб — `npm run build`).' })}</Band>
          <OlchovKarta tur="keyin" trek={tk.trek} eski={tez.oldin || {}} onSaqla={keyinSaqla} />
          <Solishtir oldin={oldin} keyin={keyin} />
          <Kulrang>{tr({ uz: "Baho har o'lchashda biroz farq qilishi mumkin — shuning uchun sonning o'zi yoziladi, «tezlashdi» so'zi emas. Bir son boshqalarga teskari ketsa — yana bir marta o'lchang: kartada oxirgi o'lchov qoladi, ikkala sonni 3-qadamda TEZLIK.md izoh qatoriga yozasiz.", ru: 'Оценка может немного отличаться при каждом замере — поэтому записывают само число, а не слово «ускорился». Если одно число пошло против остальных — измерьте ещё раз: в карточке останется последний замер, оба числа запишете на 3-м шаге в строку пояснения TEZLIK.md.' })}</Kulrang></> },
        { h: { uz: 'TEZLIK.md', ru: 'TEZLIK.md' }, t: <>{tr({ uz: "«Nusxalash» bilan agentga yuboring (qavslar kartadan oldindan):", ru: 'Отправьте агенту через «Скопировать» (скобки заранее из карточки):' })}
          <TzPrompt satrlar={A3_PROMPT} avto={avto} />
          <Band>{tx({ uz: "Agent tugatgach: `git status` — faqat `TEZLIK.md`; `git add TEZLIK.md` → `git commit -m \"tezlik keyin\"` → `git push`.", ru: 'Когда агент закончит: `git status` — только `TEZLIK.md`; `git add TEZLIK.md` → `git commit -m "tezlik keyin"` → `git push`.' })}</Band></> },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "(1) Netlify'dagi lendingni telefoningizda oching: rasmlar yangisi, tepadagi rasm aylantirmasdan ko'rinadi, tugma joyida.", ru: '(1) Откройте лендинг на Netlify на телефоне: картинки новые, верхняя картинка видна без прокрутки, кнопка на месте.' })}
          <Band>{tx({ uz: "(2) GitHub'da `TEZLIK.md` — ikkala ustun to'la, «Tuzatishlar» qatorlari bor.", ru: '(2) На GitHub в `TEZLIK.md` — оба столбца заполнены, есть строки «Tuzatishlar».' })}</Band>
          {ilovaOzg !== false && <Band>{tr({ uz: "Ilova o'zgargan bo'lsa (2-tuzatish qilingan) — uning yangi versiyasi (brauzer ko'rinishi, APK) darsda emas: uyga vazifa 1 (APK navbati uzoq).", ru: 'Если приложение изменилось (сделано 2-е исправление) — его новая версия (браузерная версия, APK) не на уроке: домашнее задание 1 (очередь APK долгая).' })}</Band>}
          {ilovaOzg !== true && <Band>{tr({ uz: "2-tuzatish qilinmagan bo'lsa — ilova o'zgarmagan, uyga vazifa 1 da bu qism yo'q.", ru: 'Если 2-е исправление не делалось — приложение не изменилось, в домашнем задании 1 этой части нет.' })}</Band>}</> }
      ]}
      qulf={(i) => i === 1 && !keyin}
      natija={<A3Natija />}
      ulgur={{ uz: "Ulgurmasangiz: 4-qadam (telefonda ko'rish, GitHub) — uyda; 2-qadamdan keyin «Davom etish» ochiladi. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: 4-й шаг (просмотр на телефоне, GitHub) — дома; после 2-го шага откроется «Продолжить». Блок считается выполненным после «Готово» на 4-м шаге.' }}
      ulgurQadam={2} ulgurShart={() => !!keyin}
      doneText={!oldin || !keyin ? null : ozg.length ? { uz: `Ikki o'lchov yozildi — o'zgargan sonlar: ${ozg.join(', ')}.`, ru: `Два замера записаны — изменившиеся числа: ${ozg.join(', ')}.` } : { uz: "Ikki o'lchov yozildi — sonlar o'zgarmadi; farq TEZLIK.md da.", ru: 'Два замера записаны — числа не изменились; разница в TEZLIK.md.' }}
      izoh={{ uz: 'Kod hajmi va baho alohida sonlar: biri kamayib, ikkinchisi o\'zgarmasligi mumkin.', ru: 'Объём кода и оценка — отдельные числа: одно может уменьшиться, а другое не измениться.' }}
      extra={() => ({ correct: !!(oldin && keyin), olchov: !!(oldin && keyin) })}
      ustoz={[
        { uz: "APK va brauzer ko'rinishi — uyga; darsda faqat lending va `TEZLIK.md` tekshiriladi. Lending push bilan yangilanmagan bo'lsa — Netlify sahifasida oxirgi yangilanish holatini ko'ring.", ru: 'APK и браузерная версия — дома; на уроке проверяются только лендинг и `TEZLIK.md`. Если лендинг не обновился после push — посмотрите статус последнего обновления на странице Netlify.' }
      ]} />
  );
};

// 🃏 KARTOCHKALAR (12) — alohida ekran, Mentor yo'q (SABOQ 12, 16)
const KARTALAR = [
  { front: { uz: 'Lighthouse nima?', ru: 'Что такое Lighthouse?' }, back: { uz: "Chrome ichidagi sahifani o'lchaydigan asbob", ru: 'Инструмент в Chrome, который измеряет страницу' }, note: { uz: 'Undagi bo\'lim nomi Performance — tezlik; baho 0 dan 100 gacha', ru: 'Раздел в нём называется Performance — скорость; оценка от 0 до 100' } },
  { front: { uz: 'Lighthouse bahosining ranglari qanday?', ru: 'Какие цвета у оценки Lighthouse?' }, back: { uz: "0–49 qizil, 50–89 to'q sariq, 90–100 yashil", ru: '0–49 красный, 50–89 оранжевый, 90–100 зелёный' }, note: { uz: "100 bo'lishi shart emas — Lighthouse buni juda qiyin deydi", ru: '100 не обязательно — Lighthouse называет это очень трудным' } },
  { front: { uz: 'LCP nima?', ru: 'Что такое LCP?' }, back: { uz: "Birinchi ekrandagi eng katta rasm yoki matn ko'ringan vaqt", ru: 'Время, когда показалась самая большая картинка или текст первого экрана' }, note: { uz: 'Soniyada; rasmiy tavsiya — 2,5 soniya yoki kamroq', ru: 'В секундах; официальная рекомендация — 2,5 секунды или меньше' } },
  { front: { uz: 'CLS nima?', ru: 'Что такое CLS?' }, back: { uz: "Ko'rinib turgan narsalarning joyidan siljishi", ru: 'Сдвиг видимых элементов с места' }, note: { uz: 'Birliksiz son; rasmiy tavsiya — 0,1 yoki kamroq', ru: 'Число без единиц; официальная рекомендация — 0,1 или меньше' } },
  { front: { uz: 'TBT nima?', ru: 'Что такое TBT?' }, back: { uz: "Sahifa ochilayotganda brauzer kod bilan band bo'lgan vaqt", ru: 'Время, когда при открытии страницы браузер занят кодом' }, note: { uz: 'Millisekundda; shunda bosish kutadi; Mobile rejimida 200 ms gacha — yashil', ru: 'В миллисекундах; в это время нажатие ждёт; в режиме Mobile до 200 мс — зелёный' } },
  { front: { uz: 'Rasm siljimasligi uchun unga nima yoziladi?', ru: 'Что дописать картинке, чтобы она не сдвигала страницу?' }, back: { uz: '`width` va `height`', ru: '`width` и `height`' }, note: { uz: 'Brauzer rasm joyini oldindan band qiladi', ru: 'Браузер заранее занимает место картинки' } },
  { front: { uz: 'Keyin yuklash nima?', ru: 'Что такое загрузка позже?' }, back: { uz: 'Ekrandan tashqaridagi rasm faqat kerak bo\'lganda yuklanishi', ru: 'Картинка за пределами экрана загружается только когда нужна' }, note: { uz: '`loading="lazy"`; inglizchasi: lazy load', ru: '`loading="lazy"`; по-английски: lazy load' } },
  { front: { uz: 'Birinchi ekrandagi rasm qanday yuklanadi?', ru: 'Как загружается картинка первого экрана?' }, back: { uz: 'Sahifa bilan birga — `loading="lazy"` siz', ru: 'Вместе со страницей — без `loading="lazy"`' }, note: { uz: 'Ayniqsa LCP rasmi: kechiksa, LCP ham kechikadi', ru: 'Особенно картинка LCP: если опоздает, опоздает и LCP' } },
  { front: { uz: 'Yuklanadigan kod hajmi nima?', ru: 'Что такое объём загружаемого кода?' }, back: { uz: 'Ilova ochilganda yuklanadigan kod hajmi', ru: 'Объём кода, который загружается при открытии приложения' }, note: { uz: "Inglizchasi: bundle. Mobil trekda Expo Atlas ko'rsatadi", ru: 'По-английски: bundle. В мобильном треке показывает Expo Atlas' } },
  { front: { uz: "Web-trekda kod hajmini qayerda ko'rasiz?", ru: 'Где в веб-треке увидеть объём кода?' }, back: { uz: '`npm run build` natijasida', ru: 'В результате `npm run build`' }, note: { uz: 'Eng katta `.js` faylning hajmi, kB da', ru: 'Вес самого большого `.js` файла, в kB' } },
  { front: { uz: 'Oldin va keyin qanday sharoitda o\'lchanadi?', ru: 'В каких условиях меряют «до» и «после»?' }, back: { uz: "O'sha sahifa, Mobile rejimi, Incognito oyna", ru: 'Та же страница, режим Mobile, окно Incognito' }, note: { uz: "Baho har o'lchashda biroz farq qilishi mumkin", ru: 'Оценка может немного отличаться при каждом замере' } },
  { front: { uz: '«Tezlashdi» deyish uchun nima kerak?', ru: 'Что нужно, чтобы сказать «ускорился»?' }, back: { uz: 'Oldin va keyingi sonlar', ru: 'Числа «до» и «после»' }, note: { uz: 'Ular `TEZLIK.md` da yoziladi', ru: 'Они записываются в `TEZLIK.md`' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('tz-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="tz-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (texnik darslar standarti, 192/204; SABOQ E 50 — «Bugungi asosiy fikr» yo'q). Sarlavha holatga qarab, har biri rost (E 54); baho taqqoslanmaydi =====
const HW_QADAM = [
  { b: { uz: 'Tugatish va yangi versiya', ru: 'Завершить и новая версия' }, t: { uz: "— darsda ulgurmagan qismni bajaring: «Keyin» sonlari `TEZLIK.md` da bo'lsin. Ilova o'zgargan bo'lsa (2-tuzatish) — yangi versiyasini chiqaring: mobil trek — `mobil/` da `npx expo export -p web` → `netlify deploy --prod --dir dist`; APK — `eas build -p android --profile preview` (navbat uzoq), tayyor bo'lgach lendingdagi «Android: ilovani o'rnatish» havolasi; web-trek — push'dan keyin Netlify o'zi yangilaydi, eski ko'rinsa `prototip/` da `netlify deploy --prod`.", ru: '— доделайте то, на что не хватило времени на уроке: числа «После» должны быть в `TEZLIK.md`. Если приложение изменилось (2-е исправление) — выпустите новую версию: мобильный трек — в `mobil/` `npx expo export -p web` → `netlify deploy --prod --dir dist`; APK — `eas build -p android --profile preview` (очередь долгая), когда будет готов — ссылка «Android: ilovani o\'rnatish» на лендинге; веб-трек — после push Netlify обновит сам, если видна старая версия — в `prototip/` `netlify deploy --prod`.' } },
  { b: { uz: 'Ilova sahifasi (xohlasangiz)', ru: 'Страница приложения (по желанию)' }, t: { uz: "— Lighthouse'ni ilovangiz sahifasida ham ishlating (web-trek — sayt, mobil trek — brauzer ko'rinishi), xuddi shu sozlama bilan; sonlarni `TEZLIK.md` ga alohida qator qilib yozing.", ru: '— запустите Lighthouse и на странице приложения (веб-трек — сайт, мобильный трек — браузерная версия) с теми же настройками; запишите числа в `TEZLIK.md` отдельной строкой.' } }
];
const HwCard = ({ keyingi }) => (
  <div className="card tz-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div>
    <div className="tz-hw-karta">
      <span className="tz-hw-q"><em>{tr({ uz: 'kim uchun', ru: 'для кого' })}</em><b>{tr({ uz: "o'z mahsulotingiz", ru: 'ваш продукт' })}</b></span>
      <span className="tz-hw-q"><em>{tr({ uz: 'nechta', ru: 'сколько' })}</em><b>{tr({ uz: 'ikki ish', ru: 'два дела' })}</b></span>
      <span className="tz-hw-q"><em>{tr({ uz: 'muddat', ru: 'срок' })}</em><b>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</b></span>
    </div>
    <ol className="tz-hw-qadam">{HW_QADAM.map((h, i) => <li key={i}><i>{i + 1}</i><span><b>{tr(h.b)}</b> {tx(h.t)}</span></li>)}</ol>
    {keyingi && <span className="tz-hw-keyingi">{keyingi}</span>}
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
  const tez = tezOqi();
  const oldin = olchovBor(tez.oldin);
  const keyin = olchovBor(tez.keyin);
  const a2 = !!answers[SCREEN_META.findIndex(m => m.id === 'a2')]?.solved;
  const sarlavha = oldin && keyin ? { uz: 'Oldin va keyin o\'lchandi — farq TEZLIK.md da sonlarda.', ru: '«До» и «после» измерены — разница в числах в TEZLIK.md.' }
    : oldin && a2 ? { uz: "Tuzatish qilindi — qayta o'lchash qoldi.", ru: 'Исправление сделано — осталось перемерить.' }
      : oldin ? { uz: '«Oldin» sonlari yozildi — tuzatish hali qilinmagan.', ru: 'Числа «До» записаны — исправление ещё не сделано.' }
        : { uz: "Lending hali o'lchanmagan — qadamlarni uyda bajaring.", ru: 'Лендинг ещё не измерен — выполните шаги дома.' };
  const RECAP = [
    { uz: 'Lighthouse sahifaga 0 dan 100 gacha baho beradi; oldin va keyin bir xil sharoitda o\'lchanadi.', ru: 'Lighthouse ставит странице оценку от 0 до 100; «до» и «после» меряют в одних условиях.' },
    { uz: "LCP — eng katta narsa ko'ringan vaqt, TBT — ochilishda brauzer kod bilan band bo'lgan vaqt.", ru: 'LCP — время появления самого большого элемента, TBT — время, когда при открытии браузер занят кодом.' },
    { uz: '`width` va `height` rasm joyini oldindan band qilishga yordam beradi — bu misolda tugma siljimadi.', ru: '`width` и `height` помогают заранее занять место картинки — в этом примере кнопка не сдвинулась.' },
    { uz: '`loading="lazy"` birinchi ekrandan tashqaridagi rasmga yoziladi, birinchi ekrandagisiga emas.', ru: '`loading="lazy"` пишут картинке за пределами первого экрана, а не картинке первого экрана.' },
    { uz: "Tezlik haqida gap — aynan qaysi son qancha o'zgargani bilan; «tezlashdi» so'zi o'rniga son.", ru: 'Говорим о скорости — какое именно число и насколько изменилось; вместо слова «ускорился» — число.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className={cx('tz-yakun', !(oldin && keyin) && 'yoq-chip')}>
        <QYakun til={__lang}
          chip={tr({ uz: "Oldin va keyin o'lchandi", ru: '«До» и «после» измерены' })}
          togri={correct} jami={total}
          sarlavha={tr(sarlavha)}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(r => tx(r))}
          uyga={<HwCard keyingi={tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: demo uchun sayqal»</b></>, ru: <>Следующий урок — <b>«Loyiha kuni: demo uchun sayqal»</b></> })} />}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function ProductSpeedLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenA1, ScreenA2, ScreenA3, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === 14-Modul 3-dars (tz-): bitta vizual — brauzer + Lighthouse paneli. Faqat qolip tokenlari (D3) + Lighthouse uch rangi maket ichida; emoji yo'q (D4) === */
        .tz-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: tz-puls 2.2s ease-out .3s 3; }
        @keyframes tz-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .tz-k { display: contents; }
        .tz-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: tz-chorla-v 1.8s ease-out .5s 2; }
        .tz-k.faol .q-variant:nth-child(2), .tz-chorla .q-chip:nth-child(2) { animation-delay: .75s; }
        .tz-k.faol .q-variant:nth-child(3), .tz-chorla .q-chip:nth-child(3) { animation-delay: 1s; }
        .tz-chorla .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: tz-chorla-c 1.8s ease-out .5s 2; }
        @keyframes tz-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes tz-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        @media (min-width: 761px) { .tz-k .q-split { grid-template-columns: 300px minmax(0, 460px); gap: 32px; align-items: center; } }
        .tz-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .tz-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        .q-xulosa .tz-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .tz-x-tx b { color: ${T.ink}; } .q-xulosa .tz-x-tx.ok, .q-xulosa .tz-x-tx.ok b { color: ${T.ok}; } .q-xulosa .tz-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .tz-x-m { display: block; }
        .q-xulosa .tz-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.tz-nom { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .tz-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .tz-ustoz b { color: ${T.ink}; }
        .tz-qb { display: inline-flex; flex-wrap: wrap; gap: 6px 10px; align-items: center; }
        .tz-qb-i { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .tz-qb-i i { font-style: normal; width: 18px; height: 18px; border-radius: 50%; background: ${T.line}; color: ${T.ink2}; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; }
        .tz-qb-i.joriy { color: ${T.accent}; } .tz-qb-i.joriy i { background: ${T.accent}; color: #fff; }
        .tz-qb-i.ok { color: ${T.ok}; } .tz-qb-i.ok i { background: ${T.okFon}; color: ${T.ok}; }
        .tz-v { display: flex; flex-direction: column; gap: 10px; }
        .tz-sahna { display: flex; flex-wrap: wrap; gap: 18px; align-items: flex-start; justify-content: center; }
        .tz-sahna.kirish { justify-content: flex-start; }
        .tz-chap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .tz-chap .q-btn { margin-left: 0; }
        .tz-ung { display: flex; flex-direction: column; gap: 10px; flex: 1 1 300px; min-width: 0; max-width: 560px; }
        .tz-ung .tz-lh, .tz-ung .tz-ong { max-width: none; }
        .tz-ung .tz-kk { width: 100%; }
        .tz-sahna.reja { justify-content: flex-start; flex-wrap: nowrap; }
        .tz-hw { display: flex; flex-direction: column; }
        .tz-lh.tz-lh-vc { gap: 6px; }
        .tz-ok-m em.tz-ok-eski { margin-left: auto; color: ${T.ink2}; }
        .tz-prompt { display: block; }
        .tz-tartib .q-dd-chip { font-family: 'Manrope', sans-serif; }
        .tz-yordam-btn { align-self: flex-start; }
        .tz-ung .tz-amal { justify-content: flex-start; max-width: none; }
        .q-fokus .tz-br-ust { zoom: .82; }
        /* 9-ekran tugagan holat: ilova sahifasining bo'sh pastki qismi qisqaradi, ikki ta'rif yonma-yon (xulosa 1280x773 ga sig'adi, SABOQ A4) */
        .q-fokus .tz-tel-ust.ilova9 { zoom: .52; }
        .tz-nom2 { display: flex; flex-direction: column; gap: 10px; }
        .tz-nom2.yon { display: grid; grid-template-columns: 1fr 1fr; align-items: stretch; }
        .tz-lh-g { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
        .tz-lh-gd { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .tz-lh-g .tz-lq-ro { flex: 1; min-width: 190px; }
        .tz-ong { display: flex; flex-direction: column; gap: 12px; padding: 10px 12px; border: 1px solid ${T.line}; border-radius: 12px; background: ${T.paper}; min-width: 250px; max-width: 320px; }
        .tz-sodda { align-self: center; font-size: 11.5px; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; padding: 2px 8px; border-radius: 6px; }
        /* Brauzer oynasi: telefon kengligida, o'lcham barqaror (≈204×365) */
        .tz-br-ust { display: flex; flex-direction: column; gap: 4px; align-items: center; }
        .tz-br-y { font-size: 11px; font-weight: 700; color: ${T.ink2}; letter-spacing: .02em; }
        .tz-br { width: 204px; border: 1.5px solid ${T.line}; border-radius: 14px; background: ${T.paper}; overflow: hidden; box-shadow: 0 10px 26px -14px rgba(${T.shadowBase},0.35); transition: width .4s ease; }
        .tz-br-ust.keng .tz-br { width: 300px; }
        .tz-br-bar { height: 26px; display: flex; align-items: center; gap: 4px; padding: 0 8px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .tz-br-bar i { width: 6px; height: 6px; border-radius: 50%; background: ${T.line}; flex: none; }
        .tz-br-m { margin-left: 4px; flex: 1; min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tz-br-yuk { height: 3px; }
        .tz-br-yuk span { display: block; height: 100%; background: ${T.accent}; transition: width .5s ease, opacity .5s ease .5s; }
        .tz-br-yuk span.tamom { opacity: 0; }
        .tz-br-s { height: 336px; position: relative; overflow: hidden; background: ${T.paper}; }
        /* Lending (namuna) sahifasi */
        .tz-ls { height: 100%; }
        .tz-ls-ich { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 9px 10px; transition: transform 2.6s ease-in-out; }
        .tz-ls.aylan .tz-ls-ich { transform: translateY(-128px); }
        .tz-ls-nom { font-size: 10.5px; font-weight: 800; letter-spacing: .01em; }
        .tz-ls-h { font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 800; line-height: 1.25; color: ${T.ink}; text-align: left; background: none; border: 0; padding: 0; margin: 0; animation: tz-kir .35s ease both; }
        .tz-ls-r { position: relative; display: block; border-radius: 8px; padding: 0; border: 0; background: none; }
        .tz-ls-r.tepa { width: 60px; height: 106px; align-self: center; }
        .tz-ls-r.past { width: 54px; height: 96px; }
        .tz-ls-past { display: flex; gap: 10px; align-self: center; }
        .tz-surat { display: flex; flex-direction: column; gap: 3px; width: 100%; height: 100%; padding: 5px 3px; border: 2px solid ${T.ink}; border-radius: 9px; background: ${T.paper}; overflow: hidden; animation: tz-kir .4s ease both; }
        .tz-surat b { font-size: 8.5px; font-weight: 800; line-height: 1.15; color: ${T.ink}; }
        .tz-surat i { font-style: normal; font-size: 7.5px; line-height: 1.2; color: ${T.ink}; background: ${T.bg}; border-radius: 3px; padding: 2px 3px; }
        .tz-joy { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; border-radius: 8px; background: ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: ${T.ink2}; }
        .tz-lazy { position: absolute; left: 3px; right: 3px; bottom: 3px; font-family: 'JetBrains Mono', monospace; font-size: 7.5px; line-height: 1.25; text-align: center; padding: 1px 3px; border-radius: 4px; background: ${CODE.bg}; color: ${CODE.attr}; animation: tz-kir .3s ease both; }
        .tz-yr .tz-lazy { position: static; font-size: 9.5px; margin-left: 4px; white-space: nowrap; }
        .tz-lazy.qizil { background: ${T.err}; color: #fff; text-decoration: line-through; }
        .tz-ls-t { position: relative; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; color: #fff; background: ${T.ink}; border: 0; border-radius: 7px; padding: 5px 10px; white-space: nowrap; }
        button.tz-ls-t { cursor: pointer; }
        .tz-ls-t.qizil { box-shadow: 0 0 0 2px ${T.err}; animation: tz-sakra .7s cubic-bezier(.3,1.4,.5,1) both; }
        .tz-ls-t.qizil::before { content: ''; position: absolute; left: -3px; right: -3px; top: -115px; height: calc(100% + 6px); border: 1.5px dashed ${T.err}; border-radius: 8px; animation: tz-kir .4s ease .3s both; }
        .tz-ls-t.yashil { box-shadow: 0 0 0 2px ${T.ok}; }
        @keyframes tz-sakra { 0% { transform: translateY(-112px); } 70% { transform: translateY(5px); } 100% { transform: none; } }
        .tz-bosish { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 8.5px; font-weight: 800; line-height: 1.25; padding: 2px 5px; border-radius: 5px; background: ${T.err}; color: #fff; white-space: nowrap; z-index: 2; animation: tz-pop .4s ease both; }
        .tz-bosish.ok { background: ${T.ok}; top: -12px; }
        .tz-ls-f { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; color: ${T.ink2}; }
        .tz-ls-f i { font-style: normal; width: 14px; height: 14px; border-radius: 50%; background: ${fon(T.ok, 0.2)}; color: ${T.ok}; font-size: 8.5px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
        .tz-ls.uzun .tz-ls-f { flex-direction: column; align-items: flex-start; gap: 22px; padding: 6px 0 26px; }
        .tz-cheg { position: absolute; left: 0; right: 0; top: 318px; border-top: 1.5px dashed ${T.ink2}; }
        .tz-cheg b { position: absolute; right: 6px; top: -15px; font-size: 9px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; padding: 0 3px; }
        .tz-element { cursor: pointer; border-radius: 7px; box-shadow: 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: tz-chorla-c 1.8s ease-out .3s 2; }
        .tz-ls-h.tz-element { padding: 2px 3px; }
        .tz-element.tanlandi { box-shadow: 0 0 0 2.5px ${T.accent}; animation: none; }
        .tz-element.silk { animation: tz-silk .45s ease; }
        @keyframes tz-silk { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        @keyframes tz-kir { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        @keyframes tz-pop { from { opacity: 0; transform: translate(-50%, -50%) scale(.85); } to { opacity: 1; transform: translate(-50%, -50%); } }
        /* Ilova (brauzer ko'rinishi) sahifasi */
        .tz-is { display: flex; flex-direction: column; gap: 8px; padding: 10px; }
        .tz-is.bosh { height: 100%; }
        .tz-is-h { font-size: 14px; font-weight: 800; color: ${T.ink}; animation: tz-kir .3s ease both; }
        .tz-is-k { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 9px 10px; border-radius: 10px; background: ${T.bg}; font-size: 11.5px; color: ${T.ink2}; animation: tz-kir .35s ease .05s both; }
        .tz-is-k b { font-size: 12.5px; color: ${T.ink}; }
        .tz-is-son { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .tz-is-son.yangi { color: ${T.ok}; animation: tz-kir .4s ease both; }
        .tz-is-t { display: inline-flex; align-items: center; gap: 4px; margin-top: 4px; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; color: #fff; background: ${T.ink}; border: 0; border-radius: 7px; padding: 5px 10px; }
        button.tz-is-t { cursor: pointer; }
        .tz-is-t.kutadi { opacity: .7; }
        .tz-is-t.bosildi { box-shadow: 0 0 0 2px ${T.ok}; }
        .tz-soat { flex: none; }
        /* Lighthouse paneli (logotipsiz) */
        .tz-lh { display: flex; flex-direction: column; gap: 9px; padding: 10px 12px; border: 1px solid ${T.line}; border-radius: 12px; background: ${T.paper}; min-width: 240px; max-width: 320px; }
        .tz-lh.tug { animation: tz-kir .5s ease both; align-items: center; min-width: 150px; }
        .tz-lh-nom { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .tz-lh-soz { display: flex; flex-wrap: wrap; gap: 3px 10px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; }
        .tz-dev { font: inherit; background: none; border: 0; padding: 0 2px; color: ${T.ink2}; border-radius: 4px; }
        .tz-dev.on { color: ${T.ink}; font-weight: 800; box-shadow: inset 0 -2px 0 ${T.accent}; }
        button.tz-desktop { cursor: pointer; color: ${T.accent}; font-weight: 700; }
        .tz-lh-amal { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .tz-analyze { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 8px; border: 0; background: ${T.line}; color: ${T.ink2}; white-space: nowrap; }
        button.tz-analyze { cursor: pointer; background: ${T.accent}; color: #fff; }
        .tz-doira { display: flex; flex-direction: column; align-items: center; gap: 4px; align-self: center; }
        .tz-doira-d { position: relative; width: 76px; height: 76px; }
        .tz-doira.kichik .tz-doira-d { width: 56px; height: 56px; }
        .tz-doira-d svg { width: 100%; height: 100%; display: block; }
        .tz-doira-iz { fill: none; stroke: ${T.line}; stroke-width: 7; }
        .tz-doira-yoy { fill: none; stroke: ${T.ink2}; stroke-width: 7; stroke-linecap: round; transition: stroke-dashoffset 1s ease, stroke .3s ease; }
        .tz-doira.bosh-son .tz-doira-yoy { stroke: ${fon(T.ink2, 0.45)}; }
        .tz-doira-son { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; color: ${T.ink2}; }
        .tz-doira.kichik .tz-doira-son { font-size: 15px; }
        .tz-doira-y { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; animation: tz-kir .3s ease both; }
        .tz-doira-iz2 { font-size: 11px; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 7px; }
        .tz-shk { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
        .tz-shk-b { display: inline-flex; align-items: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; padding: 2px 6px; border-radius: 6px; border: 1px solid ${T.line}; white-space: nowrap; }
        .tz-shk-b i { width: 8px; height: 8px; border-radius: 50%; }
        .tz-shk-b.on { border-color: ${T.ink}; color: ${T.ink}; font-weight: 800; }
        .tz-lq-ro { display: flex; flex-direction: column; gap: 3px; }
        .tz-lq { display: flex; justify-content: space-between; gap: 10px; font-size: 12px; padding: 4px 8px; border-radius: 6px; background: ${T.bg}; color: ${T.ink}; white-space: nowrap; }
        .tz-lq b { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
        .tz-lq span { font-family: 'JetBrains Mono', monospace; }
        .tz-lq.kul { opacity: .6; }
        .tz-lq.err { background: ${T.errFon}; color: ${T.err}; }
        .tz-lq.ok { background: ${T.okFon}; color: ${T.ok}; }
        .tz-lq.acc { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; font-weight: 800; }
        .tz-lq.yangi { animation: tz-kir .45s ease both; }
        .tz-lq-ro .tz-lq.yangi:nth-child(2) { animation-delay: .07s; } .tz-lq-ro .tz-lq.yangi:nth-child(3) { animation-delay: .14s; } .tz-lq-ro .tz-lq.yangi:nth-child(4) { animation-delay: .21s; } .tz-lq-ro .tz-lq.yangi:nth-child(5) { animation-delay: .28s; }
        /* Vaqt chizig'i (4, 7-ekran) */
        .tz-vc { position: relative; height: 72px; min-width: 250px; }
        .tz-vc-l { position: absolute; left: 0; right: 0; top: 35px; height: 2px; background: ${T.line}; }
        .tz-vc-m { position: absolute; top: 29px; transform: translateX(-50%); transition: left .7s ease; }
        .tz-vc-m i { display: block; width: 14px; height: 14px; border-radius: 50%; background: ${T.line}; border: 2px solid ${T.paper}; transition: background .3s ease; }
        .tz-vc-m em { position: absolute; left: 50%; transform: translateX(-50%); font-style: normal; font-size: 11px; color: ${T.ink2}; white-space: nowrap; }
        .tz-vc-m:nth-child(2) em { left: -3px; transform: none; } .tz-vc-m:nth-child(5) em { left: auto; right: -3px; transform: none; }
        .tz-vc-m.tepa em { bottom: 18px; } .tz-vc-m.past em { top: 18px; }
        .tz-vc-m.yon i { background: ${T.ink2}; } .tz-vc-m.yon em { color: ${T.ink}; }
        .tz-vc-m.acc i { background: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; } .tz-vc-m.acc em { color: ${T.accent}; font-weight: 700; }
        .tz-vc-m.qizil i { background: ${T.err}; box-shadow: 0 0 0 3px ${T.errFon}; } .tz-vc-m.qizil em { color: ${T.err}; font-weight: 700; }
        .tz-uchar { position: absolute; z-index: 3; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #fff; background: ${T.accent}; border-radius: 6px; padding: 2px 6px; pointer-events: none; animation: tz-uch 1s ease-in-out forwards; }
        @keyframes tz-uch { 0% { left: var(--x0); top: 24px; opacity: 1; } 85% { opacity: 1; } 100% { left: 6px; top: 84px; opacity: 0; } }
        /* Kod ustuni va «brauzer band» chizig'i (9-ekran) */
        .tz-kodu { display: flex; flex-direction: column; gap: 6px; }
        .tz-kodu-h { font-size: 11px; font-weight: 800; color: ${T.ink2}; }
        .tz-kodu-u { display: flex; flex-direction: column; gap: 4px; padding-left: 8px; border-left: 3px solid ${T.line}; overflow: hidden; }
        .tz-kodu-b { display: flex; flex-direction: column; justify-content: center; gap: 1px; padding: 4px 8px; border-radius: 6px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; font-weight: 700; color: ${T.ink}; transition: background .25s ease, border-color .25s ease; }
        .tz-kodu-b em { font-style: normal; font-size: 10px; font-weight: 600; color: ${T.ink2}; }
        .tz-kodu-b.kul { border-style: dashed; color: ${T.ink2}; }
        .tz-kodu-b.yon { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .tz-kodu-b.ish { border-color: ${fon(T.ink2, 0.5)}; }
        .tz-kodu-baj { font-style: normal; font-size: 10px; color: ${T.accent}; }
        .tz-kodu-b.chiq { animation: tz-chiq .8s ease forwards; }
        @keyframes tz-chiq { to { transform: translateX(110%); opacity: 0; } }
        .tz-kodu-y { align-self: flex-start; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; padding: 2px 8px; border-radius: 6px; }
        .tz-bandlar { display: flex; flex-direction: column; gap: 6px; width: 204px; }
        .tz-band { display: flex; align-items: center; gap: 6px; }
        .tz-band-i { flex: 1; height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .tz-band-f { display: block; height: 100%; background: ${T.err}; border-radius: 4px; }
        .tz-band-f.yur { transition: width 3s linear; }
        .tz-band em { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.err}; white-space: nowrap; }
        /* Yuklanish ro'yxati (7-ekran) */
        .tz-yr { display: flex; flex-direction: column; gap: 5px; }
        .tz-yr-h { display: flex; justify-content: space-between; gap: 10px; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; }
        .tz-yr-h b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; white-space: nowrap; animation: tz-kir .3s ease both; }
        .tz-yr-q { display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 4px 8px; border-radius: 6px; background: ${T.bg}; color: ${T.ink}; }
        .tz-yr-q > i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; flex: none; transition: background .3s ease; }
        .tz-yr-q.ok > i { background: ${T.ok}; }
        .tz-yr-q em { font-style: normal; font-size: 10.5px; color: ${T.ink2}; margin-left: auto; white-space: nowrap; }
        /* Harakat tugmalari (sahna ostida) */
        .tz-amal { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px 8px; max-width: 330px; }
        .tz-btn { font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 700; padding: 7px 12px; border-radius: 9px; border: 1.5px solid ${T.accent}; color: ${T.accent}; background: ${T.paper}; white-space: nowrap; }
        button.tz-btn { cursor: pointer; }
        .tz-btn.xira { border-color: ${T.line}; color: ${T.ink2}; opacity: .55; }
        .tz-ochish { margin-top: 2px; }
        .tz-olcham { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 10px; border-radius: 9px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; white-space: nowrap; }
        button.tz-olcham { cursor: pointer; border-color: ${T.accent}; }
        .tz-olcham.xira { opacity: .5; }
        .tz-sw { position: relative; width: 26px; height: 14px; border-radius: 8px; background: ${T.line}; transition: background .25s ease; flex: none; }
        .tz-sw::after { content: ''; position: absolute; top: 2px; left: 2px; width: 10px; height: 10px; border-radius: 50%; background: ${T.paper}; transition: left .25s ease; }
        .tz-olcham.on .tz-sw { background: ${T.ok}; } .tz-olcham.on .tz-sw::after { left: 14px; }
        /* Kod kartasi (5-ekran, sahna ostida — E 46) */
        .tz-kk { display: flex; flex-direction: column; gap: 6px; align-self: center; width: min(560px, 100%); }
        .tz-kk-y { font-size: 11.5px; color: ${T.ink2}; }
        .tz-kk-y code { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; }
        .tz-kk-k { display: flex; flex-direction: column; background: ${CODE.bg}; border-radius: 10px; padding: 10px 12px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6; color: ${CODE.text}; overflow-x: auto; }
        .tz-kk-k.kichik { font-size: 10px; padding: 8px 10px; }
        .tz-kk-q { white-space: pre; border-radius: 4px; }
        .tz-kk-q.yangi { background: ${fon(T.ok, 0.22)}; animation: tz-kir .45s ease both; }
        .tz-kk-iz { font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .tz-ikki { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; }
        .tz-ikki-u { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .tz-ikki-y { font-size: 12.5px; font-weight: 700; }
        .tz-ikki-u.ok .tz-ikki-y { color: ${T.ok}; } .tz-ikki-u.err .tz-ikki-y { color: ${T.err}; }
        /* Reja */
        .tz-reja-chap { display: flex; flex-direction: column; gap: 10px; }
        .tz-fayl { display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 12px; padding: 6px 10px; border: 1px solid ${T.line}; border-radius: 8px; background: ${T.paper}; color: ${T.ink2}; }
        .tz-fayl code { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; }
        p.tz-mono-q { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.6; color: ${T.ink2}; }
        /* Kod oynasi (11-ekran) */
        ol.tz-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.tz-vazifa li { display: flex; gap: 9px; align-items: flex-start; font-size: 13.5px; line-height: 1.45; }
        ol.tz-vazifa li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        ol.tz-vazifa li.ok i { background: ${T.okFon}; color: ${T.ok}; }
        ol.tz-vazifa.ixcham li { font-size: 12.5px; }
        .tz-kod-natija, .tz-kyordam { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
        .tz-kyordam > .q-btn { align-self: flex-start; margin-left: 0; }
        .tz-bajardim { display: flex; justify-content: flex-end; margin-top: 10px; }
        .tz-kodoyna { display: flex; flex-direction: column; gap: 10px; }
        .tz-kamal { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        .tz-kamal .q-btn { margin-left: 0; }
        .tz-kamal-t { font-size: 12.5px; color: ${T.ink2}; flex: 1; min-width: 180px; }
        .tz-kompil { position: fixed; inset: 0; z-index: 2000; }
        .tz-no { border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.paper}; max-width: 340px; }
        .tz-no-bar { display: flex; align-items: center; gap: 4px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .tz-no-bar i { width: 6px; height: 6px; border-radius: 50%; background: ${T.line}; }
        .tz-no-bar b { margin-left: 6px; font-size: 11px; color: ${T.ink2}; }
        .tz-no-t { display: flex; flex-direction: column; align-items: flex-start; gap: 7px; padding: 10px 12px; }
        .tz-no-h { font-size: 14px; font-weight: 800; line-height: 1.3; color: ${T.ink}; }
        .tz-no-r { width: 60px; height: 106px; display: block; }
        .tz-no-btn { font-size: 12px; padding: 4px 10px; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.bg}; color: ${T.ink}; }
        .tz-no-s { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; animation: tz-kir .35s ease both; }
        .tz-no-s.ok { color: ${T.ok}; font-weight: 800; }
        /* Amaliyot bloklari */
        .tz-blok { display: contents; }
        .tz-blok.qulf .q-blok-q.joriy .q-blok-tana > .q-btn { opacity: .45; pointer-events: none; }
        .tz-band-q, .tz-kulrang, .tz-xato, .tz-ps, .tz-joylar, .tz-yordam, .tz-yordam-s, .tz-yordam-ust, .tz-tk, .tz-ok, .tz-sol-ro, .tz-trek { display: block; }
        .tz-band-q { margin-top: 6px; }
        .tz-kulrang { margin-top: 6px; font-size: 12.5px; color: ${T.ink2}; }
        .tz-xato { margin-top: 6px; font-size: 13px; font-weight: 700; color: ${T.err}; }
        .q-blok-t .qcode, .tz-yordam .qcode, .tz-ps .qcode { white-space: normal; overflow-wrap: anywhere; }
        .tz-ps { margin: 0; padding: 0 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink}; overflow-wrap: anywhere; }
        .tz-ps + .tz-ps { margin-top: 4px; }
        .tz-ps .q-joy { display: inline-block; max-width: 100%; }
        .tz-joylar { margin-top: 8px; }
        .tz-joylar > * + * { margin-top: 6px; }
        .tz-joy-m { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 0 0 0 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .tz-joy-m:focus-within { border-color: ${T.accent}; }
        .tz-joy-n { flex: none; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.accent}; }
        .tz-joy-m input { flex: 1; min-width: 160px; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 14px; padding: 10px 10px 10px 0; color: ${T.ink}; }
        .tz-nusxa { flex: none; }
        .tz-yordam-ust { margin-top: 8px; }
        .tz-yordam-ust .q-btn { margin-left: 0; }
        .tz-yordam { margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; }
        .tz-yordam b { display: block; margin-bottom: 4px; font-size: 12px; color: ${T.ink2}; }
        .tz-yordam-s + .tz-yordam-s { margin-top: 4px; }
        .tz-trek { margin-top: 2px; }
        .tz-trek .q-chip + .q-chip { margin-left: 6px; }
        /* Blok tugagach (F-1008-590): bajarilgan qadamlar ro'yxati yashirinadi (tugadi kartasi aytadi), o'ngda faqat asosiy natija — TEZLIK.md / o'zgargan fayllar */
        .tz-blok.tugadi .q-blok-qadamlar { display: none; }
        .tz-blok.tugadi .tz-an > .tz-an-lh, .tz-blok.tugadi .tz-an > .tz-agent, .tz-blok.tugadi .tz-an > .tz-an-ikki, .tz-blok.tugadi .tz-an > .tz-lq-ro, .tz-blok.tugadi .tz-an > .tz-atlas, .tz-blok.tugadi .tz-an > .tz-kk-k { display: none; }
        p.tz-ortda, p.tz-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        p.tz-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.paper}; }
        .tz-ok { margin-top: 8px; padding: 10px; border: 1.5px solid ${T.line}; border-radius: 12px; background: ${T.paper}; max-width: 440px; }
        .tz-ok > * + * { margin-top: 6px; }
        .tz-ok-h { display: block; font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .tz-ok-m { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 0 8px; }
        .tz-ok-m:focus-within { border-color: ${T.accent}; }
        .tz-ok-m b { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.accent}; width: 12px; }
        .tz-ok-m input { flex: 1; min-width: 120px; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 14px; padding: 9px 0; color: ${T.ink}; }
        .tz-ok-m em { font-style: normal; font-size: 11px; color: ${T.ink2}; white-space: nowrap; }
        .tz-ok-chip { display: inline-flex; gap: 4px; }
        .tz-ok-amal { display: flex; align-items: center; gap: 10px; }
        .tz-ok-amal .q-btn { margin-left: 0; }
        .tz-ok-ok { font-size: 12.5px; font-weight: 700; color: ${T.ok}; }
        .tz-sol-ro { margin-top: 8px; }
        .tz-sol-ro > * + * { margin-top: 4px; }
        .tz-sol { display: block; font-size: 12.5px; padding: 4px 8px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; animation: tz-kir .35s ease both; }
        .tz-sol b { color: ${T.ink2}; } .tz-sol.ok b { color: ${T.ok}; } .tz-sol.err b { color: ${T.err}; }
        .tz-tk { margin-top: 6px; }
        .tz-tk > * + * { margin-top: 6px; }
        .tz-tk-ix { display: flex; gap: 6px; width: 100%; font-family: 'Manrope', sans-serif; font-size: 12.5px; text-align: left; background: ${T.okFon}; border: 0; border-radius: 8px; padding: 6px 10px; cursor: pointer; color: ${T.ink}; }
        .tz-tk-ix b { color: ${T.ok}; }
        .tz-tk-karta { display: flex; flex-direction: column; gap: 8px; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px; background: ${T.paper}; max-width: 440px; }
        .tz-tk-n { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .tz-tk-n em { font-style: normal; font-size: 11px; color: ${T.ink2}; white-space: nowrap; }
        .tz-tk-karta input { border: 1.5px solid ${T.line}; border-radius: 9px; padding: 8px 10px; font-family: 'Manrope', sans-serif; font-size: 14px; color: ${T.ink}; outline: 0; }
        .tz-tk-karta input:focus { border-color: ${T.accent}; }
        .tz-tk-btn { display: flex; flex-wrap: wrap; gap: 8px; }
        .tz-tk-btn .q-btn { margin-left: 0; }
        /* Kutilgan natija maketlari */
        .tz-an { display: flex; flex-direction: column; gap: 8px; font-size: 12px; }
        .tz-an-lh { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; border: 1px solid ${T.line}; border-radius: 10px; padding: 8px 10px; background: ${T.paper}; }
        .tz-an-lh .tz-lh-nom { width: 100%; }
        .tz-an-lh .tz-lq-ro { flex: 1; min-width: 150px; }
        .tz-an-ikki { display: flex; gap: 18px; justify-content: center; }
        .tz-lq-ro .tz-atlas { padding: 4px 8px; border: 0; background: ${T.bg}; border-radius: 6px; }
        .tz-atlas { display: flex; justify-content: space-between; gap: 10px; align-items: center; border: 1px solid ${T.line}; border-radius: 10px; padding: 6px 10px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
        .tz-atlas b { font-family: 'Manrope', sans-serif; font-size: 11px; color: ${T.ink2}; }
        .tz-md { display: flex; flex-direction: column; gap: 3px; border: 1px solid ${T.line}; border-radius: 10px; overflow: hidden; background: ${T.paper}; }
        .tz-md-bar { display: flex; align-items: center; gap: 6px; padding: 5px 8px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; font-size: 11px; color: ${T.ink2}; }
        .tz-md-bar code { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; }
        .tz-md-h { padding: 2px 10px 0; font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .tz-md-s { padding: 0 10px; font-size: 11px; color: ${T.ink2}; }
        .tz-md-j { display: flex; flex-direction: column; padding: 2px 10px 6px; }
        .tz-md-j > span { display: grid; grid-template-columns: minmax(0, 1.8fr) minmax(0, .6fr) minmax(0, .6fr); gap: 6px; padding: 2px 0; border-bottom: 1px solid ${T.line}; }
        .tz-md-j i, .tz-md-t i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink}; }
        .tz-md-j .sar i { font-weight: 800; color: ${T.ink2}; }
        .tz-md-t { display: flex; flex-direction: column; gap: 2px; padding: 0 10px 8px; }
        .tz-md-t b { font-size: 12px; }
        .tz-agent { display: flex; flex-direction: column; gap: 3px; border: 1px dashed ${T.line}; border-radius: 10px; padding: 6px 10px; }
        .tz-agent b { font-size: 11px; color: ${T.ink2}; }
        .tz-agent i { font-style: normal; font-size: 11.5px; color: ${T.ink}; }
        .tz-fayllar { display: flex; flex-direction: column; gap: 4px; }
        .tz-fayl2 { display: flex; flex-direction: column; padding: 5px 8px; border: 1px solid ${T.line}; border-radius: 8px; background: ${T.paper}; }
        .tz-fayl2 code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink}; }
        .tz-fayl2 em { font-style: normal; font-size: 11px; color: ${T.ink2}; }
        .tz-mini { align-self: center; zoom: .62; }
        /* Uyga vazifa, kartochkalar, yakun */
        .tz-hw-karta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .tz-hw-q { display: inline-flex; flex-direction: column; gap: 2px; padding: 6px 10px; border-radius: 10px; background: ${T.bg}; }
        .tz-hw-q em { font-style: normal; font-size: 11px; color: ${T.ink2}; }
        .tz-hw-q b { font-size: 13px; color: ${T.ink}; }
        ol.tz-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.tz-hw-qadam li { display: flex; gap: 9px; align-items: flex-start; font-size: 13.5px; line-height: 1.5; }
        ol.tz-hw-qadam li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        .tz-hw-keyingi { display: block; margin-top: 10px; font-size: 13px; color: ${T.ink2}; }
        .tz-flash { display: flex; flex-direction: column; gap: 10px; }
        .tz-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: tz-puls 1.8s ease-out .4s 3; }
        /* Kartochka (F-1008-593, global): orqa yuz — neytral to'q (qolipdagi zarg'aldoq gradiyent o'rniga), qizil/zarg'aldoq soya yo'q */
        .tz-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .tz-flash .fc-front { box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        /* 12-ekran karta dastasi (F-1008-588) */
        .tz-tj { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 20px; align-items: start; }
        .tz-tj-uyalar { gap: 8px; }
        .tz-tj.yigildi { grid-template-columns: 1fr; }
        .tz-tj .q-dd-slot { min-height: 50px; padding: 7px 12px; text-align: left; font: inherit; cursor: default; }
        .tz-tj .q-dd-slot.kutadi { cursor: pointer; border-color: ${fon(T.accent, 0.5)}; background: ${fon(T.accent, 0.04)}; }
        .tz-tj .q-dd-slot.kutadi:hover, .tz-tj .q-dd-slot.ust { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .tz-uya-gap { flex: 1; min-width: 0; font-size: 15px; line-height: 1.4; font-weight: 600; color: ${T.ink}; }
        .tz-tj-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; position: sticky; top: 8px; }
        .tz-dasta { position: relative; padding-bottom: 10px; }
        .tz-dasta-q { position: absolute; left: 10px; right: 10px; height: 100%; top: 0; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; }
        .tz-dasta-q.q1 { transform: translateY(6px); left: 6px; right: 6px; }
        .tz-dasta-q.q2 { transform: translateY(12px); left: 12px; right: 12px; opacity: .7; }
        .tz-gap { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 6px; padding: 14px 18px; border-radius: 14px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}, 0 14px 28px -16px rgba(${T.shadowBase},0.4); cursor: grab; animation: fade-in-up .3s ease-out both; }
        .tz-gap:active { cursor: grabbing; }
        .tz-gap.silk { animation: q-silk .42s ease-in-out; }
        .tz-gap-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .tz-gap-t { font-size: 16px; font-weight: 600; line-height: 1.45; color: ${T.ink}; }
        @media (max-width: 760px) { .tz-tj { grid-template-columns: 1fr; gap: 12px; } .tz-tj-ong { order: -1; position: static; } }
        p.tz-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.ink2}; }
        p.tz-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .tz-yakun { display: contents; }
        .tz-yakun.yoq-chip .done-chip { display: none; }
        /* ⛶ oynasi ekran markazida (E 48): ikki klassli selektor; ota-blokdagi animatsiya/transform «position: fixed»ni o'ziga bog'lamasin */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 96vw); max-height: 92vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on), .q-fokus:has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 760px) {
          .tz-lh, .tz-ong { min-width: 0; width: 100%; max-width: 360px; }
          .tz-vc { min-width: 0; }
          .tz-sahna { gap: 12px; flex-direction: column; flex-wrap: nowrap; align-items: stretch; }
          .tz-sahna.kirish, .tz-sahna.reja { flex-direction: row; flex-wrap: wrap; align-items: flex-start; }
          .tz-ung { display: contents; }
          .tz-nom2.yon { grid-template-columns: 1fr; }
          .tz-ung > .tz-chorla, .tz-ung > .tz-bash-ix { order: -2; margin-right: 38px; }
          .tz-ung > .tz-amal, .tz-ung > .tz-sodda { order: -1; }
          .tz-ung > .tz-lh, .tz-ung > .tz-ong { max-width: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tz-halqa, .tz-k.faol .q-variant, .tz-chorla .q-chip, .tz-element, .tz-surat, .tz-lazy, .tz-ls-t.qizil, .tz-ls-t.qizil::before, .tz-bosish, .tz-ls-h, .tz-is-h, .tz-is-k, .tz-is-son.yangi, .tz-lh.tug, .tz-doira-y, .tz-lq.yangi, .tz-uchar, .tz-kodu-b.chiq, .tz-yr-h b, .tz-kk-q.yangi, .tz-no-s, .tz-sol, .tz-flash.yangi .fc-card .fc-front { animation: none !important; }
          .tz-uchar { display: none; }
          .tz-kodu-b.chiq { opacity: 0; }
          .tz-ls-ich, .tz-br, .tz-br-yuk span, .tz-doira-yoy, .tz-vc-m, .tz-band-f, .tz-kodu-b, .tz-sw, .tz-sw::after { transition: none !important; }
        }
        .tz-rc-n { font-family: 'JetBrains Mono', monospace; font-size: 26px; color: ${T.accent}; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px ${fon(T.accent, 0.35)}, 0 0 0 1px ${fon(T.accent, 0.12)}; }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px ${fon(T.accent, 0.55)}; }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === F-1008-594: telefon brauzeri, tanish saytlar (soddalashtirilgan), DevTools Lighthouse hisoboti === */
        .tz-kir { animation: tz-kir .4s ease both; }
        .tz-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 7px; }
        .tz-tel { width: 260px; height: 470px; padding: 8px; border-radius: 36px; background: ${T.ink}; box-shadow: 0 18px 40px -20px rgba(${T.shadowBase},0.55), inset 0 0 0 2px ${fon(T.paper, 0.08)}; transition: width .45s ease; }
        .tz-tel-ust.keng .tz-tel { width: 340px; }
        .tz-tel-ich { display: flex; flex-direction: column; height: 100%; border-radius: 28px; overflow: hidden; background: ${T.paper}; }
        .tz-tel-st { flex: none; height: 20px; display: flex; justify-content: center; align-items: center; }
        .tz-tel-st .kam { width: 64px; height: 12px; border-radius: 8px; background: ${T.ink}; }
        .tz-tel-bar { flex: none; padding: 4px 10px 6px; }
        .tz-tel-m { display: flex; align-items: center; gap: 6px; height: 28px; padding: 0 12px; border-radius: 14px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tz-qulf { flex: none; color: ${T.ink2}; }
        .tz-lupa { flex: none; }
        .tz-rasm-ic { flex: none; opacity: .85; }
        .tz-tel-yuk { flex: none; height: 3px; }
        .tz-tel-yuk span { display: block; height: 100%; background: ${T.accent}; transition: width .5s ease, opacity .5s ease .5s; }
        .tz-tel-yuk span.tamom { opacity: 0; }
        .tz-tel-s { position: relative; flex: 1; min-height: 0; overflow: hidden; background: ${T.paper}; transition: background .25s ease; }
        .tz-tel-s.qora { background: ${T.ink}; }
        .tz-sp { display: flex; flex-direction: column; gap: 8px; padding: 9px 12px; height: 100%; position: relative; }
        .tz-sp-hd { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .tz-snom { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope', sans-serif; font-weight: 800; letter-spacing: -.01em; color: ${T.ink}; white-space: nowrap; }
        .tz-snom i { width: 8px; height: 8px; border-radius: 50%; flex: none; }
        .tz-sp-hd .tz-snom { font-size: 17px; }
        .tz-sp-ik { display: flex; gap: 7px; }
        .tz-sp-ik i { width: 18px; height: 18px; border-radius: 50%; background: ${T.line}; }
        .tz-qd { display: flex; align-items: center; gap: 7px; height: 30px; padding: 0 5px 0 11px; border-radius: 15px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; }
        .tz-qd > i { flex: 1; height: 7px; max-width: 90px; border-radius: 4px; background: ${T.line}; }
        .tz-sp-chip { display: flex; gap: 6px; }
        .tz-sp-chip i { height: 20px; width: 46px; border-radius: 7px; background: ${T.bg}; }
        .tz-sp-chip i.on { background: ${T.ink}; width: 34px; }
        .tz-chiz { display: flex; flex-direction: column; gap: 5px; }
        .tz-chiz i { display: block; height: 7px; width: 92%; border-radius: 4px; background: ${T.line}; }
        .tz-chiz i.q { width: 58%; }
        .tz-chiz.katta i { height: 10px; }
        .tz-rasm { position: relative; display: flex; align-items: center; justify-content: center; border-radius: 9px; background: ${T.line}; color: ${fon(T.ink2, 0.75)}; overflow: hidden; }
        .tz-rasm.bor { background: ${T.bg}; box-shadow: inset 0 0 0 1px ${T.line}; animation: tz-rasm-k .45s ease both; }
        .tz-rasm.kut::after { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, ${fon(T.paper, 0.6)} 50%, transparent 70%); animation: tz-shim 1.3s linear infinite; }
        .tz-rasm.joy { background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.ok, 0.6)}; }
        .tz-rasm.joy em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ok}; }
        @keyframes tz-rasm-k { from { opacity: .3; } to { opacity: 1; } }
        @keyframes tz-shim { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        .tz-yt-k { display: flex; flex-direction: column; gap: 5px; }
        .tz-yt-r { height: 68px; }
        .tz-yt-k + .tz-yt-k { margin-top: -1px; }
        .tz-yt-m { display: flex; gap: 8px; align-items: flex-start; }
        .tz-yt-m .tz-chiz { flex: 1; }
        .tz-av { flex: none; width: 22px; height: 22px; border-radius: 50%; background: ${T.line}; }
        .tz-kun-b { display: flex; flex-direction: column; gap: 7px; }
        .tz-kun-r { height: 104px; }
        .tz-kun-q { display: flex; gap: 9px; align-items: center; }
        .tz-kun-kr { flex: none; width: 64px; height: 40px; border-radius: 7px; }
        .tz-kun-q .tz-chiz { flex: 1; }
        .tz-olx-qb { display: block; padding: 0; border: 0; background: none; text-align: left; border-radius: 15px; }
        .tz-olx-kat { display: grid; grid-template-columns: repeat(4, 1fr); gap: 9px 6px; padding: 4px 2px; border: 0; background: none; border-radius: 10px; }
        .tz-olx-kat > span { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .tz-olx-kat > span i { width: 32px; height: 32px; border-radius: 50%; background: ${T.bg}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .tz-olx-kat > span em { width: 30px; height: 5px; border-radius: 3px; background: ${T.line}; }
        .tz-olx-y { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .tz-olx-ro { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
        .tz-olx-k { display: flex; flex-direction: column; gap: 6px; padding: 6px; border-radius: 10px; background: ${T.paper}; box-shadow: 0 0 0 1px ${T.line}; }
        .tz-olx-rb { display: block; padding: 0; border: 0; background: none; border-radius: 9px; }
        .tz-olx-r { height: 108px; }
        .tz-olx-k .tz-chiz i:last-child { width: 42%; height: 9px; background: ${fon(T.ink2, 0.35)}; }
        button.tz-element { cursor: pointer; font: inherit; }
        .tz-qd-t { position: relative; display: inline-flex; align-items: center; gap: 4px; margin-left: auto; height: 22px; padding: 0 10px; border-radius: 11px; border: 0; background: ${T.ink}; color: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; white-space: nowrap; }
        button.tz-qd-t { cursor: pointer; }
        .tz-qd-t.kutadi { opacity: .65; }
        .tz-qd-t.bosildi { box-shadow: 0 0 0 2px ${T.ok}; }
        .tz-qd-t .tz-bosish.ok { top: auto; bottom: -26px; left: auto; right: 0; transform: none; animation: tz-kir .35s ease both; }
        .tz-tx-ban { display: block; }
        .tz-tx-ban .tz-rasm { height: 74px; }
        .tz-tx-pz { position: relative; display: block; }
        .tz-tx-past { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; transition: transform .4s cubic-bezier(.3,1.5,.5,1); }
        .tz-tx-ro { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
        .tz-tx-k { display: flex; flex-direction: column; gap: 6px; padding: 6px; border-radius: 10px; box-shadow: 0 0 0 1px ${T.line}; }
        .tz-tx-r { height: 76px; }
        .tz-iz { position: absolute; left: -4px; right: -4px; top: -4px; bottom: -4px; border: 1.5px dashed ${T.err}; border-radius: 10px; background: ${fon(T.err, 0.04)}; animation: tz-kir .3s ease both; }
        .tz-sanoq { position: absolute; right: 10px; bottom: 10px; z-index: 2; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.paper}; background: ${T.err}; padding: 3px 9px; border-radius: 8px; animation: tz-sanoq .4s ease both; }
        @keyframes tz-sanoq { 0% { transform: scale(1.25); } 100% { transform: none; } }
        .tz-nm { --rw: 112px; --rh: 199px; align-items: center; }
        .tz-nm > .tz-chiz { align-self: stretch; }
        .tz-nm-r { width: var(--rw); height: var(--rh); flex: none; overflow: visible; }
        .tz-nm-t { position: relative; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; color: ${T.paper}; background: ${T.ink}; border: 0; border-radius: 9px; padding: 8px 14px; white-space: nowrap; }
        button.tz-nm-t { cursor: pointer; }
        .tz-nm-t.qizil { box-shadow: 0 0 0 2px ${T.err}; animation: tz-nm-sak .4s cubic-bezier(.3,1.4,.5,1) both; }
        .tz-nm-t.qizil::before { content: ''; position: absolute; left: -4px; right: -4px; top: calc(-1 * var(--rh) - 9px); height: calc(100% + 8px); border: 1.5px dashed ${T.err}; border-radius: 10px; animation: tz-kir .3s ease .3s both; }
        .tz-nm-t.yashil { box-shadow: 0 0 0 2px ${T.ok}; }
        @keyframes tz-nm-sak { 0% { transform: translateY(calc(-1 * var(--rh) - 9px)); } 75% { transform: translateY(5px); } 100% { transform: none; } }
        .tz-nm .tz-bosish { top: 50%; }
        .tz-nm-t .tz-bosish.ok { top: -14px; }
        .tz-el { padding: 0; overflow: hidden; }
        .tz-el-ich { display: flex; flex-direction: column; gap: 9px; padding: 9px 12px 20px; transition: transform 2.4s ease-in-out; }
        .tz-el.aylan .tz-el-ich { transform: translateY(-150px); }
        .tz-el-nom { font-size: 16px; font-weight: 800; color: ${T.ink}; }
        .tz-el-g { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 9px; }
        .tz-el-k { display: flex; flex-direction: column; gap: 5px; padding: 5px; border-radius: 10px; box-shadow: 0 0 0 1px ${T.line}; }
        .tz-el-r { height: 92px; }
        .tz-el-n { position: absolute; left: 5px; top: 5px; z-index: 1; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border-radius: 5px; padding: 0 5px; }
        .tz-el-g .tz-cheg { position: relative; top: auto; grid-column: 1 / -1; height: 0; margin: 14px 0 10px; border-top: 1.5px dashed ${T.ink2}; }
        .tz-el-g .tz-lazy { left: 5px; right: 5px; bottom: 5px; font-size: 9.5px; }
        .tz-sodda { align-self: center; }
        .tz-manba { font-size: 11px; color: ${T.ink2}; white-space: nowrap; }
        /* DevTools Lighthouse hisoboti */
        .tz-ic { display: inline-block; flex: none; width: 10px; height: 10px; }
        .tz-ic.q { background: ${LH_RANG.qizil}; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
        .tz-ic.s { background: ${LH_RANG.sariq}; width: 9px; height: 9px; }
        .tz-ic.y { background: ${LH_RANG.yashil}; border-radius: 50%; }
        .tz-g { position: relative; display: inline-flex; align-items: center; justify-content: center; flex: none; width: 72px; height: 72px; --g: ${T.ink2}; --gf: ${T.bg}; }
        .tz-g.k { width: 104px; height: 104px; } .tz-g.m { width: 54px; height: 54px; }
        .tz-g svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .tz-g-f { fill: var(--gf); stroke: ${fon(T.ink2, 0.12)}; stroke-width: 8; }
        .tz-g-y { fill: none; stroke: var(--g); stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 1s ease, stroke .3s ease; animation: tz-g-ch 1.1s ease both; }
        @keyframes tz-g-ch { from { stroke-dashoffset: var(--c); } }
        .tz-g b { position: relative; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: var(--g); animation: tz-kir .5s ease .4s both; }
        .tz-g.k b { font-size: 34px; } .tz-g.m b { font-size: 17px; }
        .tz-shk { display: flex; flex-wrap: wrap; gap: 4px 10px; justify-content: center; }
        .tz-shk-b { display: inline-flex; align-items: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; white-space: nowrap; }
        .tz-rep { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 12px; background: ${T.paper}; overflow: hidden; box-shadow: 0 10px 26px -16px rgba(${T.shadowBase},0.35); }
        .tz-rep-tab { display: flex; gap: 2px; padding: 0 8px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; font-size: 11.5px; }
        .tz-rep-tab i, .tz-rep-tab b { font-style: normal; padding: 6px 10px; color: ${T.ink2}; }
        .tz-rep-tab b { color: ${T.ink}; font-weight: 700; box-shadow: inset 0 -2px 0 ${T.accent}; }
        .tz-rep-soz { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-bottom: 1px solid ${T.line}; }
        .tz-lh-soz b { color: ${T.ink}; font-weight: 700; }
        .tz-rep-b { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 14px 18px; align-items: center; padding: 14px 14px 12px; animation: tz-kir .4s ease both; }
        .tz-rep-g { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; max-width: 170px; }
        .tz-rep-p { font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .tz-rep-est { font-size: 10.5px; line-height: 1.35; color: ${T.ink2}; }
        .tz-rep-m { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .tz-rep-mh { font-size: 11px; font-weight: 800; letter-spacing: .08em; color: ${T.ink2}; padding-bottom: 4px; border-bottom: 1px solid ${T.line}; }
        .tz-rep-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }
        .tz-mt { display: flex; flex-direction: column; gap: 2px; padding: 6px 0; border-bottom: 1px solid ${T.line}; min-width: 0; transition: opacity .3s ease; }
        .tz-mt-n { display: flex; align-items: center; gap: 6px; font-size: 11.5px; line-height: 1.25; color: ${T.ink}; }
        .tz-mt-v { padding-left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 19px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .tz-mt.kul { opacity: .4; }
        .tz-mt.yangi { animation: tz-kir .45s ease both; }
        .tz-rep-grid .tz-mt.yangi:nth-child(2) { animation-delay: .08s; } .tz-rep-grid .tz-mt.yangi:nth-child(3) { animation-delay: .16s; } .tz-rep-grid .tz-mt.yangi:nth-child(4) { animation-delay: .24s; } .tz-rep-grid .tz-mt.yangi:nth-child(5) { animation-delay: .32s; }
        .tz-mt.acc { margin: 0 -8px; padding: 6px 8px; border-radius: 8px; border-bottom: 0; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .tz-rep-sayt { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; font-size: 11px; color: ${T.ink2}; }
        .tz-rep-sayt .tz-snom { font-size: 12px; }
        .tz-rep.kichik { padding: 10px 14px 12px; gap: 8px; }
        .tz-rep-hd { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding-bottom: 6px; border-bottom: 1px solid ${T.line}; }
        .tz-rep-hd > b { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .tz-rep-hd .tz-snom { font-size: 14px; }
        .tz-rep-hd .tz-manba { margin-left: auto; }
        .tz-rep-iz { font-size: 12px; color: ${T.ink2}; }
        .tz-rep.kichik .tz-mt { border-bottom: 0; }
        .tz-audit { display: flex; flex-direction: column; gap: 3px; padding: 7px 9px; border-radius: 8px; background: ${T.bg}; }
        .tz-audit-h { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 7px; font-size: 12px; }
        .tz-audit-h b { color: ${T.ink}; }
        .tz-audit-h em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.err}; white-space: nowrap; }
        .tz-audit-iz { padding-left: 17px; font-size: 12px; color: ${T.ink2}; }
        .tz-vc-m.bir em { left: -3px; transform: none; } .tz-vc-m.ox em { left: auto; right: -3px; transform: none; }
        /* 0-ekran: maket chapda (300 px), variantlar o'ngda (max 460 px), bir balandlikda markazda */
        .tz-k-maket { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 300px; }
        /* F-1008-580 (2): «Ochish» telefon ekranining o'rtasida — birinchi qarashda ko'rinadi; hook telefoni pastroq — ost qatori 1280x800 ga sig'adi */
        .tz-k-telw { position: relative; }
        .tz-k-telw .tz-tel { height: 390px; }
        .tz-k-play { position: absolute; left: 50%; top: 54%; translate: -50% -50%; z-index: 2; }
        .tz-k-ost { display: flex; align-items: center; justify-content: center; gap: 8px; width: 300px; }
        .tz-taymer { display: inline-grid; grid-template-columns: auto auto; align-items: center; gap: 1px 6px; flex: none; padding: 5px 10px; border-radius: 9px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink2}; }
        .tz-taymer b { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; color: ${T.ink}; min-width: 48px; }
        .tz-taymer.tamom b { color: ${T.err}; }
        .tz-taymer em { grid-column: 1 / -1; font-style: normal; font-size: 10px; line-height: 1.2; max-width: 78px; }
        .tz-k-lh { display: flex; align-items: center; gap: 8px; }
        .tz-k-lh > span { display: flex; flex-direction: column; gap: 2px; font-size: 12px; }
        .tz-k-lh > span > b { display: inline-flex; align-items: center; gap: 4px; color: ${T.ink}; white-space: nowrap; }
        .tz-k-lh > span > b .tz-snom { font-size: 12px; }
        .tz-k-lh .tz-manba { white-space: normal; max-width: 140px; line-height: 1.3; }
        .tz-k-lh .tz-g.m { width: 50px; height: 50px; }
        /* 1-ekran: uch haqiqiy doira */
        .tz-uch { display: flex; gap: 10px; justify-content: space-between; }
        .tz-uch-i { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px 8px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; animation: tz-kir .45s ease both; }
        .tz-uch-i .tz-snom { font-size: 14px; }
        p.tz-uch-gap { margin: 0; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        .tz-md-b { font-style: normal; font-family: 'Manrope', sans-serif; font-size: 10.5px; color: ${fon(T.ink2, 0.7)}; white-space: nowrap; }
        .tz-md-j > span { grid-template-columns: minmax(0, 1.3fr) minmax(0, .85fr) minmax(0, .85fr); }
        /* tugagan holat: telefon ixchamroq, ikki holat yonma-yon */
        .tz-s2-tug .tz-chap { display: none; }
        .tz-s2-tug .tz-ung { flex-direction: row; align-items: flex-start; max-width: none; gap: 16px; }
        .tz-s2-tug .tz-ung > .tz-rep { flex: 0 1 560px; }
        .tz-s2-tug .tz-nom2.yon { flex: 1 1 280px; grid-template-columns: 1fr; }
        .q-fokus .tz-ung { margin-right: 38px; max-width: 700px; }
        .q-fokus .tz-yr { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 8px; }
        .q-fokus .tz-yr-h { grid-column: 1 / -1; }
        .q-fokus .tz-audit { display: none; }
        .q-fokus .tz-tp-ro { margin-right: 38px; }
        .q-fokus .tz-kodu-b { min-height: 0 !important; padding: 3px 8px; }
        .tz-qd-ok { color: ${T.ok}; font-size: 12px; animation: tz-kir .3s ease both; }
        .q-fokus .tz-tel-ust { zoom: .6; }
        .tz-olx-rb.tanlandi { box-shadow: 0 0 0 2.5px ${T.accent}; }
        .tz-lcp-b { position: absolute; left: 6px; top: 6px; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; color: ${T.paper}; background: ${T.accent}; border-radius: 5px; padding: 1px 6px; animation: tz-kir .35s ease both; }
        .tz-mini-br { display: flex; flex-direction: column; width: 220px; border-radius: 14px; overflow: hidden; background: ${T.paper}; box-shadow: 0 0 0 1px ${T.line}, 0 10px 24px -16px rgba(${T.shadowBase},0.4); }
        .tz-mini-bar { display: flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .tz-mini-bar i { width: 6px; height: 6px; border-radius: 50%; background: ${T.line}; }
        .tz-mini-bar b { margin-left: 6px; font-size: 10.5px; color: ${T.ink2}; }
        .tz-mini-br .tz-sp { height: auto; }
        .tz-ikki .tz-nm { --rw: 64px; --rh: 114px; }
        .tz-tug .tz-ikki { gap: 14px; }
        .tz-tug .tz-kk-iz { display: none; }
        .tz-ikki .tz-nm-t { font-size: 11px; padding: 6px 11px; }
        /* 11-ekran: topilma kartalari */
        .tz-tpj { grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); }
        .tz-tp-ro { display: flex; flex-direction: column; gap: 8px; }
        .tz-tp-q { display: flex; align-items: flex-start; gap: 10px; min-height: 52px; padding: 9px 12px; border-radius: 12px; border: 1.5px dashed ${T.line}; background: ${T.paper}; font-size: 13px; line-height: 1.4; color: ${T.ink2}; }
        .tz-tp-q > i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.line}; color: ${T.ink2}; }
        .tz-tp-q > span { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 6px; min-width: 0; }
        .tz-tp-q code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; overflow-wrap: anywhere; }
        .tz-tp-q .tz-snom { font-size: 13px; }
        .tz-tp-q b { flex-basis: 100%; font-size: 14px; color: ${T.ok}; }
        .tz-tp-q.joriy { border-color: ${fon(T.accent, 0.5)}; }
        .tz-tp-q.joriy > i { background: ${T.accent}; color: ${T.paper}; }
        .tz-tp-q.ok { border-style: solid; border-color: ${fon(T.ok, 0.45)}; background: ${T.okFon}; color: ${T.ink}; }
        .tz-tp-q.ok > i { background: ${T.ok}; color: ${T.paper}; }
        .tz-tp-k { cursor: default; }
        .tz-tp { display: flex; flex-direction: column; gap: 7px; }
        .tz-tp-bosh { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .tz-tp-bosh .tz-snom { font-size: 18px; }
        .tz-tp-bosh em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .tz-tp-ui { display: flex; align-items: flex-start; gap: 8px; padding: 8px 10px; border-radius: 8px; background: ${T.bg}; }
        .tz-tp-ui .tz-ic { margin-top: 4px; }
        .tz-tp-ui b { font-size: 14px; line-height: 1.35; color: ${T.ink}; }
        .tz-tp-son { padding-left: 28px; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .tz-tp-iz { font-size: 15px; line-height: 1.45; color: ${T.ink}; }
        .tz-tp-tug { display: flex; flex-direction: column; gap: 7px; }
        .tz-tp-b { text-align: left; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 600; color: ${T.ink}; padding: 10px 14px; border-radius: 11px; border: 1.5px solid ${fon(T.accent, 0.45)}; background: ${T.paper}; cursor: pointer; transition: border-color .2s ease, background .2s ease; }
        .tz-tp-b:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .tz-tp-b.xato { border-color: ${T.err}; background: ${T.errFon}; }
        @media (max-width: 760px) {
          .tz-k-maket { width: 100%; }
          .tz-tel { width: 248px; height: 452px; }
          .tz-tel-ust.keng .tz-tel { width: 280px; }
          .tz-rep-b { grid-template-columns: 1fr; justify-items: center; }
          .tz-rep-m { width: 100%; }
          .tz-ung > .tz-rep { order: 0; }
          .tz-uch { gap: 6px; }
          .tz-ikki .tz-mini-br { width: 160px; }
          .tz-tpj { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tz-kir, .tz-rasm.bor, .tz-rasm.kut::after, .tz-g-y, .tz-g b, .tz-mt.yangi, .tz-rep-b, .tz-iz, .tz-sanoq, .tz-nm-t.qizil, .tz-nm-t.qizil::before, .tz-uch-i, .tz-qd-t .tz-bosish.ok, .tz-lcp-b, .tz-qd-ok { animation: none !important; }
          .tz-tel, .tz-tel-yuk span, .tz-tel-s, .tz-tx-past, .tz-el-ich, .tz-mt, .tz-g-y { transition: none !important; }
        }
        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoomable.z-float > .zoom-btn { visibility: hidden; } /* ⛶ bo'sh joy ustida osilmasin (ZBTN, 159-qonun) */
        .flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band, F-0926-01) */
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        /* F-1004-12: ⛶ matn ustiga tushmasin. Keng ekranda tugma kontentdan tashqarida, o'ng chetda turadi;
           torroq ekranda ichkarida qoladi va o'ng ustunning birinchi yorlig'iga o'ngdan 40 px joy beriladi. */
        @media (min-width: 1200px) { .zoomable:not(.zoom-on) > .zoom-btn { top: 8px; right: 8px; } .zoomable.z-float:not(.zoom-on) > .zoom-btn { visibility: visible; } } /* F-1008-583: ⛶ vizual burchagida, kontentdan tashqarida emas */
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
