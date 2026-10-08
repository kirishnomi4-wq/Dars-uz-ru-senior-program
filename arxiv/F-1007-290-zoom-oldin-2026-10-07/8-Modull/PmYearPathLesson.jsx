import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 10-Modul · 10-dars (PM, 2-tur) «Bir yilda nimalarni qurdingiz?» — kalit m8-10, 16 ekran. Skeletdan (src/skelet/NamunaDars.jsx) qurildi, konveyer 05.10.2026.
// Manba-haqiqat: feedback/F-1005-10modul/10-PmYearPath-v3.md (GATE M) · saboqlar: feedback/F-1005-10modul/QURUVCHI_SABOQ.md.
// Bitta vizual — vaqt chizig'i (YilChizigi, bitta manba CHIZIQ). Keys — K1 Uzum (bank). USTAXONA — 9 va 10-ekran; artefakt pm-m8d10-yol (11-dars o'qiydi).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ru-qoldiq-istisno s11: to'liq nima sayt va so'rab bilan tekshirish keyin
// (11-ekran kodi: ma'lumot va «Keyin:» qiymatlari tekshiruv solishtiradigan o'zbekcha qiymat — KOD_UCH bilan bir xil; ruschaga o'girilmaydi)
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QQadamlar, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';

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

const LESSON_META = { lessonId: 'pm-m8d10-yol-v1', lessonTitle: { uz: 'Bir yilda nimalarni qurdingiz?', ru: "Что вы построили за год?" } };
// 16 ekran · PM 2-tur (artefakt yozma) · oqim: kirish → reja → vaqt chizig'i → 1-savol → qurdim/o'rgandim → 2-savol → Uzum → keyingi qadam → 3-savol →
//   mustaqil ish → juftlik → kod → yakuniy savol → podium → kartochkalar → yakun. Manba-haqiqat: feedback/F-1005-10modul/10-PmYearPath-v3.md (GATE M).
const HW_TOKENS = [
  { t: { uz: 'chiziq', ru: "линия" }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'loyiha', ru: "проект" }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'portfolio', ru: "портфолио" }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'keyin', ru: "дальше" }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'koding',      template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
// Har ekranning vazifasi (Quruvchi + Jonli uchun xarita)
const SCREEN_INTENTS = [
  'hook: portfolio «Loyihalarim» va bo\'sh chiziq', 'reja: chiziq skeleti + 4 qadam', 'vaqt chizig\'i: 7 karta modul nuqtasiga (atama)', '1-savol: har moduldan asosiy loyiha',
  'qurdim va o\'rgandim: 3 qadam', '2-savol: «O\'rgandim» gapi', 'Uzum: ikki sana chiziqda (bashorat)', 'keyingi qadam: kengaygan chiziq, uch belgi (atama)',
  '3-savol: darslik boti', 'mustaqil: o\'z chizig\'i (5+)', 'juftlik: aytib berish + «Keyin»', 'kod: vaqtChizigi funksiyasi', 'yakuniy savol: aytib berish tartibi',
  'podium', 'kartochkalar', 'yakun'
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
              <div className="mono small" style={{ color: T.ink2, whiteSpace: 'nowrap' }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
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

// ⚡ JONLI: javob kaliti — ballik testlar (MD: 3 → D, 5 → B, 8 → A, 12 → C) + praktika signallari (-1 sentinel, variant yo'q)
const INLINE_KEYS = { s3: 3, s5: 1, s8: 0, s12: 2, chiziq: -1, organdim: -1, keyin: -1, practice: -1, juftlik: -1, koding: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran indeksi; PM darsida emoji o'rniga raqam, S-026)
const RECAPS = {
  3: {
    title: { uz: "Qaysi loyihalar qo'yiladi", ru: "Какие проекты ставятся" },
    cards: [
      { ic: '1', h: { uz: "Vaqt chizig'i", ru: "Линия времени" }, body: { uz: "Vaqt chizig'i — loyihalar qurilgan vaqti tartibida turgan bitta chiziq.", ru: "Линия времени — одна линия, на которой проекты стоят в порядке их создания." } },
      { ic: '2', h: { uz: 'Har moduldan', ru: "Из каждого модуля" }, body: { uz: "Har moduldan asosiy loyiha qo'yiladi, kichigi ham.", ru: "Ставится главный проект каждого модуля, и маленький тоже." } },
      { ic: '3', h: { uz: "O'sish", ru: "Рост" }, body: { uz: "O'sish shundan ko'rinadi: bitta sahifadan prodda ishlayotgan saytgacha.", ru: "Так виден рост: от одной страницы до сайта, работающего в проде." }, ask: { uz: 'Bir yil oldin qaysi loyihani qura olardingiz?', ru: "Какой проект вы могли бы построить год назад?" } }
    ]
  },
  5: {
    title: { uz: "«O'rgandim» gapi", ru: "Фраза «Умею»" },
    cards: [
      { ic: '1', h: { uz: 'Loyiha nomi', ru: "Название проекта" }, body: { uz: 'Loyiha nomi nima qurilganini aytadi.', ru: "Название проекта говорит, что построено." } },
      { ic: '2', h: { uz: "O'rgandim", ru: "Умею" }, body: { uz: "«O'rgandim» endi nima qila olishingizni ko'rsatadi.", ru: "«Умею» показывает, что вы теперь можете делать." } },
      { ic: '3', h: { uz: 'Nima emas', ru: "Что не подходит" }, body: { uz: "Nom takrori yoki fikr («yoqdi») — «O'rgandim» emas.", ru: "Повтор названия или мнение («понравилось») — это не «Умею»." }, ask: { uz: "AvtoIjara'dan keyin nima qila oladigan bo'ldingiz?", ru: "Что вы стали уметь после AvtoIjara?" } }
    ]
  },
  8: {
    title: { uz: 'Keyingi qadam', ru: "Следующий шаг" },
    cards: [
      { ic: '1', h: { uz: 'Ta\'rif', ru: "Определение" }, body: { uz: "Keyingi qadam — vaqt chizig'idan o'sadigan bitta aniq ish.", ru: "Следующий шаг — одна конкретная работа, которая вырастает из линии времени." } },
      { ic: '2', h: { uz: 'Uch belgi', ru: "Три признака" }, body: { uz: "Uch belgi: bitta, aniq, chiziqdan o'sadi.", ru: "Три признака: одно, конкретное, растёт из линии." } },
      { ic: '3', h: { uz: '«Maydon» misoli', ru: "Пример «Maydon»" }, body: { uz: "«Maydon»da Mentor jamoa yig'ishni tanladi — suhbatdagi «2 / 5» dalillardan biri.", ru: "В «Maydon» Ментор выбрал сбор команды: «2 / 5» в разговорах — одно из доказательств." }, ask: { uz: "Darslik almashish botida yana qanday keyingi qadam bo'lishi mumkin?", ru: "Какой ещё следующий шаг может быть у бота обмена учебниками?" } }
    ]
  },
  12: {
    title: { uz: 'Aytib berish tartibi', ru: "Порядок рассказа" },
    cards: [
      { ic: '1', h: { uz: 'Boshi', ru: "Начало" }, body: { uz: 'Birinchi loyihadan boshlanadi.', ru: "Начинается с первого проекта." } },
      { ic: '2', h: { uz: "O'rtasi", ru: "Середина" }, body: { uz: 'Oxirgisigacha qurilgan tartibda boriladi.', ru: "Идём до последнего в порядке создания." } },
      { ic: '3', h: { uz: 'Oxiri', ru: "Конец" }, body: { uz: 'Eng oxirida — keyingi qadam.', ru: "В самом конце — следующий шаг." }, ask: { uz: "Sherigingiz eng yoqqan loyihasidan boshlasa, nima ko'rinmay qoladi?", ru: "Если партнёр начнёт с самого любимого проекта, что станет не видно?" } }
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

// ===== DARSNING BITTA VIZUALI — vaqt chizig'i (YilChizigi, 163/180): bitta manba CHIZIQ; ko'rinishlar: tik · toliq (7+ nuqta — ikki qator) · kengaygan · voqea · qadam =====
// F-1005-175 (06.10): «oyoq» yoylari yo'q (SABOQ 28) · ikki qator (SABOQ 27) · uchish — useUchish (SABOQ 19)
// qolip-maket: yc-d yc-katak ycq-n yp-kar yp-tan yp-kk
// Manba: MD A-6 jadvali — modul nomlari (tayanch 4 / dastur v9), loyiha nomlari (App.jsx Proyekt qatorlari), «O'rgandim» — Mentor misoli (App.jsx sub yozuvlaridan).
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const yakkaMi = (live) => !live || (live.mode !== 'student' && live.mode !== 'mentor');
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
// Harakatsizlikda bitta ipucha (javobni aytmaydi): kalit o'zgarsa sanoq qaytadan boshlanadi
const useIpucha = (faol, kalit, ms = 40000) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(false);
    if (!faol) return undefined;
    const t = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(t);
  }, [faol, kalit, ms]);
  return on;
};
const YOL_KEY = 'pm-m8d10-yol';
const CHIZIQ = [
  { modul: 1, yorliq: 'Foundation', nom: null, nima: null },
  { modul: 2, yorliq: 'HTML-CSS', nom: { uz: 'Portfolio sayt', ru: "Сайт-портфолио" }, nima: { uz: "HTML va CSS'da sahifa yasash", ru: "делать страницу на HTML и CSS" } },
  { modul: 3, yorliq: 'JavaScript', nom: { uz: "Mini-do'kon", ru: "Мини-магазин" }, nima: { uz: "saytni bo'laklab, AI bilan yig'ish", ru: "собирать сайт по частям вместе с ИИ" } },
  { modul: 4, yorliq: 'React', nom: 'AvtoIjara', nima: { uz: "React'da sahifa va API bilan ishlash", ru: "работать со страницей и API на React" } },
  { modul: 5, yorliq: 'Node + PostgreSQL', nom: 'AvtoStoyanka', nima: { uz: "Backend yozib, ma'lumotni PostgreSQL'da saqlash", ru: "писать Backend и хранить данные в PostgreSQL" } },
  { modul: 6, yorliq: 'NestJS, test, CI/CD', nom: 'KitobShop', nima: { uz: "NestJS'da Backend yozish va deployni avtomatlashtirish", ru: "писать Backend на NestJS и автоматизировать деплой" } },
  { modul: 7, yorliq: { uz: 'Botlar', ru: "Боты" }, nom: { uz: 'Telegram bot', ru: "Telegram-бот" }, nima: { uz: "botga Database va AI'ni ulash", ru: "подключать к боту Database и ИИ" } },
  { modul: 8, yorliq: { uz: "To'liq tizim", ru: "Полная система" }, nom: { uz: "To'liq tizim", ru: "Полная система" }, nima: { uz: "sayt, ilova va botni bitta Backend'ga ulash", ru: "подключать сайт, приложение и бота к одному Backend" } },
  { modul: 9, yorliq: { uz: 'Loyiham kim uchun', ru: "Для кого мой проект" }, nom: 'Maydon', nima: { uz: "muammoni odamlardan so'rab topish", ru: "находить проблему, расспрашивая людей" }, mentor: true },
  { modul: 10, yorliq: { uz: 'Gipotezani tekshirish', ru: "Проверка гипотезы" }, nom: { uz: 'Maydon prodda', ru: "Maydon в проде" }, nima: { uz: 'hodisalarni sanab, gipotezani raqam bilan tekshirish', ru: "считать события и проверять гипотезу числом" }, mentor: true }
];
// «Maydon» pastki nuqtalari (7-ekran, kengaygan) · «Besh suhbat» — bog'lanish manbai (9-Modul suhbatlari: jamoa 2 / 5)
const MAYDON_PASTKI = {
  9: [{ uz: 'Muammo topildi', ru: "Проблема найдена" }, { uz: 'Besh suhbat', ru: "Пять разговоров" }, { uz: 'MVP va deploy', ru: "MVP и деплой" }, { uz: 'Sinov va tuzatish', ru: "Тест и исправление" }],
  10: [{ uz: 'Bosh raqam va OKR', ru: "Главное число и OKR" }, { uz: 'Hodisalar va dashboard', ru: "События и дашборд" }, { uz: 'A/B test', ru: "A/B-тест" }, { uz: 'Himoya va prod', ru: "Защита и прод" }]
};
const KEYIN_MENTOR = { t: { uz: "Jamoa yig'ish: o'yinchi «odam kerak» deb yozadi", ru: "Сбор команды: игрок пишет «нужен человек»" }, dan: 'p9-1', yorliq: { uz: 'jamoaga odam yetmadi — 2 / 5', ru: "не хватало людей в команду — 2 / 5" } };
const BELGILAR = [{ k: 'bitta', t: { uz: 'bitta', ru: "одно" } }, { k: 'aniq', t: { uz: 'aniq', ru: "конкретное" } }, { k: 'osadi', t: { uz: "chiziqdan o'sadi", ru: "растёт из линии" } }];
const QAVS = { nima: { uz: "Nima bo'ldi?", ru: "Что было?" }, keyin: { uz: 'Keyin nima?', ru: "Что дальше?" } };
const YC = { qurdim: { uz: 'Qurdim', ru: "Построил(а)" }, organdim: { uz: "O'rgandim", ru: "Умею" }, keyin: { uz: 'Keyin', ru: "Дальше" }, mentor: { uz: 'Mentor misoli', ru: "Пример Ментора" }, otkaz: { uz: "o'tkazildi", ru: "пропущено" } };
const mYorliq = (c) => `${c.modul} · ${tr(c.yorliq)}`;
let ycSon = 0;

// Uchish (SABOQ 19, FLIP): bosilgan narsa joyidan yangi joyiga uchib boradi. Manba to'rtburchagi bosishda olinadi,
// yangi joydagi element (data-uch) chizilgach o'sha nuqtadan o'z joyiga suriladi. Kam harakat rejimida — darrov joyida.
const uchir = (dan, el, ms = 560) => {
  if (!dan || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !dan.width) return;
  const z = (el.offsetWidth || g.width) / g.width; // .lesson-root zoom tuzatmasi (transform zoom'siz px'da)
  const dx = ((dan.left + dan.width / 2) - (g.left + g.width / 2)) * z;
  const dy = ((dan.top + dan.height / 2) - (g.top + g.height / 2)) * z;
  const s = Math.min(2.4, Math.max(0.5, dan.width / g.width));
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.8 }, { transform: 'translate(0, 0) scale(1)', opacity: 1 }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' });
};
const useUchish = () => {
  const q = useRef(null);
  useLayoutEffect(() => {
    const u = q.current;
    if (!u) return;
    q.current = null;
    uchir(u.r, document.querySelector(`.lesson-root [data-uch="${u.k}"]`), u.ms);
  });
  return useCallback((manba, k, ms) => { if (manba && manba.getBoundingClientRect) q.current = { r: manba.getBoundingClientRect(), k, ms }; }, []);
};

// Bog'lanish chizig'i (SVG): nuqtalar markazini o'lchab chizadi — egri (keyingi qadam), strelka (bir yil), yoy (muammodan), qavs (oraliq)
function useBogChiziq(ref, bog, deps) {
  const [chiz, setChiz] = useState({ w: 0, h: 0, q: [] });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !bog.length) { setChiz(c => (c.q.length ? { w: 0, h: 0, q: [] } : c)); return undefined; }
    const olch = () => {
      const r = el.getBoundingClientRect(); if (!r.width) return;
      const s = el.offsetWidth / r.width;
      const nuq = (k) => { let d = el.querySelector(`[data-yc="${k}"]`); if (d && !d.getBoundingClientRect().width) d = el.querySelector(`[data-yc="${k}t"]`); if (!d) return null; const q = d.getBoundingClientRect(); return { x: (q.left + q.width / 2 - r.left) * s, y: (q.top + q.height / 2 - r.top) * s, l: (q.left - r.left) * s }; };
      setChiz({ w: el.offsetWidth, h: el.offsetHeight, q: bog.map(b => { const a = nuq(b.dan), c = nuq(b.gacha || 'keyin'), kd = nuq('keyin'); return a && c ? { ...b, a, c: el.offsetWidth < 520 && kd && b.chap ? kd : c, chap: b.chap && el.offsetWidth >= 520, tor: el.offsetWidth < 520 && !!b.chap } : null; }).filter(Boolean) });
    };
    olch();
    const t = setTimeout(olch, 480);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(olch) : null;
    if (ro) ro.observe(el);
    return () => { clearTimeout(t); if (ro) ro.disconnect(); };
  }, deps); // eslint-disable-line
  return chiz;
}
const BogQatlam = ({ chiz, uid }) => {
  if (!chiz.q.length) return null;
  return (
    <>
      <svg className="yc-svg" width={chiz.w} height={chiz.h} viewBox={`0 0 ${chiz.w} ${chiz.h}`} aria-hidden="true">
        <defs><marker id={`yc-uq-${uid}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" /></marker></defs>
        {chiz.q.map((b, i) => {
          const { a, c } = b;
          const gor = Math.abs(c.x - a.x) >= Math.abs(c.y - a.y);
          let d;
          if (b.tur === 'tirsak') { const y = Math.max(a.y, c.y) + 50; d = `M ${a.x} ${a.y + 38} V ${y} H ${c.x} V ${c.y + 40}`; }
          else if (b.tur === 'strelka') d = gor ? `M ${a.x} ${chiz.h - 10} L ${c.x} ${chiz.h - 10}` : `M ${chiz.w - 10} ${a.y} L ${chiz.w - 10} ${c.y}`;
          else if (b.tur === 'yoy') d = gor ? `M ${a.x + 8} ${a.y + 8} Q ${(a.x + c.x) / 2} ${a.y + 46} ${c.x - 9} ${c.y + 8}` : `M ${a.x + 12} ${a.y} Q ${a.x + 54} ${(a.y + c.y) / 2} ${c.x + 12} ${c.y}`;
          else if (b.tur === 'qavs') d = gor ? `M ${a.x} ${a.y + 16} v 8 H ${c.x} v -8` : `M ${a.x + 16} ${a.y} h 8 V ${c.y} h -8`;
          else if (b.tor) d = `M ${a.x} ${a.y + 8} Q ${a.x} ${c.y}, ${c.x + 16} ${c.y}`;
          else if (gor && b.chap) { const dip = Math.max(70, Math.abs(c.l - a.x) * 0.3); d = `M ${a.x} ${a.y + 8} C ${a.x} ${a.y + dip}, ${c.l - dip} ${c.y}, ${c.l - 3} ${c.y}`; }
          else { const dip = Math.max(70, Math.abs(gor ? c.x - a.x : c.y - a.y) * 0.3); d = gor ? `M ${a.x} ${a.y + 8} C ${a.x} ${a.y + dip}, ${c.x - dip * 0.7} ${c.y + dip}, ${c.x - 12} ${c.y + 9}` : `M ${a.x + 8} ${a.y} C ${a.x + dip} ${a.y}, ${c.x + dip} ${c.y}, ${c.x + 14} ${c.y}`; }
          return <path key={i} d={d} pathLength="1" className={cxx('yc-bog', b.tur || 'egri')} markerEnd={b.tur === 'qavs' ? undefined : `url(#yc-uq-${uid})`} />;
        })}
      </svg>
      {chiz.q.map((b, i) => {
        const { a, c } = b;
        const gor = Math.abs(c.x - a.x) >= Math.abs(c.y - a.y);
        const dip = Math.max(70, Math.abs(gor ? c.x - a.x : c.y - a.y) * 0.3);
        if (b.tor && b.tur !== 'strelka' && b.tur !== 'yoy' && b.tur !== 'qavs') return b.yorliq ? <span key={i} className="yc-bog-l tik" style={{ left: Math.max(70, a.x - 60), top: (a.y + c.y) / 2 + 10 }}>{b.yorliq}</span> : null;
        const cx = gor && b.chap ? c.l : c.x;
        const x = b.tur === 'strelka' ? (gor ? (a.x + c.x) / 2 : chiz.w - 18) : b.tur === 'yoy' ? (gor ? (a.x + c.x) / 2 : a.x + 50) : b.tur === 'qavs' ? (gor ? (a.x + c.x) / 2 : a.x + 30) : (gor ? a.x + (cx - a.x) * 0.42 : a.x + dip * 0.8);
        const y = b.tur === 'strelka' ? (gor ? chiz.h - 10 : (a.y + c.y) / 2) : b.tur === 'yoy' ? (gor ? a.y + 36 : (a.y + c.y) / 2) : b.tur === 'qavs' ? (gor ? a.y + 34 : (a.y + c.y) / 2) : (gor ? (b.chap ? a.y + dip * 0.62 : Math.max(a.y, c.y) + dip * 0.74) : (a.y + c.y) / 2);
        return b.yorliq ? <span key={i} className={cxx('yc-bog-l', b.tur || 'egri', !gor && 'tik')} style={{ left: x, top: y }}>{b.yorliq}</span> : null;
      })}
    </>
  );
};

// Bitta nuqta: modul yorlig'i · o'q (ikki yarim chiziq + doira) · karta (Qurdim / O'rgandim) · ostidagi kulrang yorliq
const YcNuqta = ({ p, i, chap, ong, tur }) => {
  const bos = p.onBos;
  const dr = bos ? { onDragOver: (e) => e.preventDefault(), onDrop: (e) => { e.preventDefault(); bos(); } } : {};
  const karta = (tur === 'toliq' || tur === 'kengaygan') && p.holat !== 'bosh' && p.karta !== false && (p.nom || p.holat === 'otkaz');
  return (
    <div className={cxx('yc-n', `h-${p.holat}`, p.yashirin && 'yc-yash', p.joriy && 'joriy', p.xato && 'xato', p.mentor && 'ycm', p.kutadi && 'kutadi', p.pastki && 'kenG', p.kir && 'kir')} style={{ '--i': i }}>
      <span className="yc-m"><span>{p.yorliq}</span>{p.belgi && <b className="yc-belgi">{p.belgi}</b>}{p.chip && <em className="yc-chip">{p.chip}</em>}</span>
      <span className="yc-o">
        <i className={cxx('yc-l', chap && 'on')} /><i className={cxx('yc-r', ong && 'on')} />
        {bos
          ? <button type="button" className="yc-d" data-yc={p.k} onClick={bos} {...dr} aria-label={p.yorliq ? String(p.yorliq) : undefined} />
          : <span className="yc-d" data-yc={p.k} />}
        {p.pastki && <span className="yc-sd-q">{p.pastki.map((s, j) => <i key={j} className="yc-sd" data-yc={`p${p.modul}-${j}`} />)}</span>}
      </span>
      {p.pastki && <span className="yc-sdl">{p.pastki.map((s, j) => <em key={j} className={p.manba === j ? 'manba' : undefined} data-yc={`p${p.modul}-${j}t`}>{s}</em>)}</span>}
      {karta && p.holat === 'otkaz' ? (
        <span className="yc-otk">{tr(YC.otkaz)}</span>
      ) : karta ? (
        <div className={cxx('yc-kar', p.qisqa && 'qisqa')} key={p.kalit || 'k'} data-uch={p.uch}>
          {p.holat === 'toliq' && <span className="yc-ok" aria-hidden="true">✓</span>}
          {p.mentor && <span className="yc-mt">{tr(YC.mentor)}</span>}
          <span className="yc-q"><b>{tr(YC.qurdim)}:</b> <span className="yc-qt">{p.nom}</span></span>
          {p.nima !== undefined && <span className={cxx('yc-q', p.xato && 'err')}><b>{tr(YC.organdim)}:</b> {p.nima ? <span className="yc-qt" data-uch={p.uchNima}>{p.nima}</span> : <i className="yc-uzuq" />}</span>}
          {p.ichida}
        </div>
      ) : (tur === 'toliq' || tur === 'kengaygan') ? (p.osti ? <span className="yc-osti">{p.osti}</span> : <span className="yc-bo" />) : null}
      {karta || (tur !== 'toliq' && tur !== 'kengaygan') ? (p.osti ? <span className="yc-osti">{p.osti}</span> : (tur === 'toliq' ? <span className="yc-bo" /> : null)) : (tur === 'toliq' ? <span className="yc-bo" /> : null)}
    </div>
  );
};

// keyin: { holat: 'yashirin'|'yopiq'|'bosh'|'joriy'|'toliq', t, belgilar: [{ t, h }], onBos, kutadi, katta }
const YcKeyin = ({ k, i, chap, tur }) => {
  const bos = k.onBos;
  const dr = bos ? { onDragOver: (e) => e.preventDefault(), onDrop: (e) => { e.preventDefault(); bos(); } } : {};
  return (
    <div className={cxx('yc-n', 'yc-k', `k-${k.holat}`, k.holat === 'joy' && 'yc-yash', k.katta && 'katta', k.kutadi && 'kutadi', k.joriy && 'joriy')} style={{ '--i': i }}>
      <span className="yc-m">{k.yorliq || tr(YC.keyin)}</span>
      <span className="yc-o">
        <i className={cxx('yc-l', 'kirish', chap && 'on')} />
        {bos
          ? <button type="button" className="yc-d" data-yc="keyin" onClick={bos} {...dr} aria-label={tr(YC.keyin)} />
          : <span className="yc-d" data-yc="keyin" />}
      </span>
      {(tur === 'toliq' || tur === 'kengaygan' || k.t || k.belgilar) && (
        <div className="yc-kk">
          {k.t && <div className={cxx('yc-kar', 'keyin', k.holat === 'toliq' && 'tol')} data-yc="keyin-k" data-uch="keyin-k">{k.holat === 'toliq' && <span className="yc-ok" aria-hidden="true">✓</span>}<span className="yc-q">{k.t}</span></div>}
          {k.katak && !k.t && <button type="button" className={cxx('yc-katak', k.kutadi && 'kutadi')} onClick={bos} disabled={!bos} aria-label={tr(YC.keyin)} {...dr} />}
          {k.belgilar && <span className="yc-bel">{k.belgilar.map((b, j) => <em key={j} className={cxx(b.h, b.h && 'kir')} style={{ '--j': j }}>{b.h === 'ok' ? '✓ ' : b.h === 'err' ? '✗ ' : ''}{b.t}</em>)}</span>}
          {k.dalil && <span className="yc-dalil"><b>{k.dalil.manba}:</b> {k.dalil.t}</span>}
        </div>
      )}
    </div>
  );
};

// «tik» ko'rinish (0-ekran): nomlar bir tomonda, chiziq tepadan pastga 1 → 10 chizilib boradi, nomlar navbat bilan chiqadi
const YcTik = ({ nuqtalar, keyin, className }) => (
  <div className={cxx('yc', 'yc-tik', className)}>
    {nuqtalar.map((p, i) => (
      <div key={p.k} className={cxx('yct-n', `h-${p.holat}`)} style={{ '--i': i }} data-yc={p.k}>
        <span className="yct-d" /><span className="yct-m">{p.yorliq}</span>
      </div>
    ))}
    {keyin && <div className={cxx('yct-n', 'yct-k', `k-${keyin.holat}`)} style={{ '--i': nuqtalar.length }}><span className="yct-d" /><span className="yct-m">{tr(YC.keyin)}</span></div>}
  </div>
);
// «qadam» ko'rinish (9, 10-ekran, SABOQ 29): har modul — raqamli doira (holat: ✓ · joriy · o'tkazildi) + qisqartirilgan nom; bosilsa o'sha modul kartasi ochiladi
const YcQadam = ({ nuqtalar, keyin, children }) => (
  <div className="ycq-qator" style={{ '--n': nuqtalar.length + (keyin ? 1 : 0) }}>
    {nuqtalar.map((p, i) => {
      const El = p.onBos ? 'button' : 'div';
      const on = i > 0 && (p.holat === 'toliq' || p.holat === 'nom') && (nuqtalar[i - 1].holat === 'toliq' || nuqtalar[i - 1].holat === 'nom');
      return (
        <El key={p.k} {...(p.onBos ? { type: 'button', onClick: p.onBos, title: p.nom || undefined } : {})} className={cxx('ycq-n', `h-${p.holat}`, p.joriy && 'joriy', p.tanlangan && 'tanl')} style={{ '--i': i }}>
          <span className="ycq-o"><i className={cxx('ycq-l', on && 'on')} /><span className="ycq-d" data-yc={p.k}>{p.holat === 'toliq' ? '✓' : p.modul}</span></span>
          {p.holat === 'otkaz'
            ? <em className="ycq-otk">{tr(YC.otkaz)}</em>
            : <span className="ycq-nom" data-uch={`q-${p.k}`}>{p.nom || '…'}</span>}
        </El>
      );
    })}
    {keyin && (
      <div className={cxx('ycq-n', 'ycq-k', `k-${keyin.holat}`)} style={{ '--i': nuqtalar.length }}>
        <span className="ycq-o"><i className={cxx('ycq-l', keyin.holat === 'toliq' && 'on')} /><span className="ycq-d" data-yc="keyin">{keyin.holat === 'toliq' ? '✓' : ''}</span></span>
        <span className="ycq-nom" data-uch="q-keyin" title={keyin.t || undefined}>{keyin.t || tr(YC.keyin)}</span>
      </div>
    )}
    {children}
  </div>
);
// SABOQ 27: bir qatorga 6 tadan ko'p karta sig'dirilmaydi — «to'liq» ko'rinishda 7+ nuqta ikki qatorga bo'linadi (1–5 · 6–10 + «Keyin»)
const QATOR_EN = 5;
const YilChizigi = ({ tur = 'toliq', nuqtalar = [], keyin, qavs = false, bog = [], kir = false, sahna, pastida, className, children }) => {
  const ref = useRef(null);
  const uid = useRef(++ycSon).current;
  const tolalar = nuqtalar.map((p, i) => (p.holat === 'nom' || p.holat === 'toliq' ? i : -1)).filter(i => i >= 0);
  const b0 = tolalar.length ? tolalar[0] : -1;
  const b1 = tolalar.length ? tolalar[tolalar.length - 1] : -1;
  const kv = keyin && keyin.holat !== 'yashirin';
  const keyinOn = kv && keyin.holat === 'toliq';
  const chiz = useBogChiziq(ref, bog, [JSON.stringify(bog.map(b => [b.dan, b.gacha, b.tur])), tur, nuqtalar.length, kv]);
  if (tur === 'tik') return <YcTik nuqtalar={nuqtalar} keyin={kv ? keyin : null} className={className} />;
  if (tur === 'qadam') {
    return (
      <div ref={ref} className={cxx('yc', 'yc-qadam', chiz.q.length && 'yc-past', className)} style={{ '--ustun': `repeat(${nuqtalar.length + (kv ? 1 : 0)}, minmax(0, 1fr))` }}>
        {qavs && <div className="yc-qavslar" aria-hidden="true"><span className="yc-qavs" style={{ gridColumn: `1 / span ${nuqtalar.length}` }}>{tr(QAVS.nima)}</span>{kv && <span className="yc-qavs k">{tr(QAVS.keyin)}</span>}</div>}
        <YcQadam nuqtalar={nuqtalar} keyin={kv ? keyin : null} />
        <BogQatlam chiz={chiz} uid={uid} />
        {children}
      </div>
    );
  }
  if (!nuqtalar.length) return <div className={cxx('yc', 'yc-skelet', className)} aria-hidden="true"><i /></div>;
  const ikki = tur === 'toliq' && nuqtalar.length > 6;
  const ustunTur = (p) => (p.pastki ? '2.8fr' : tur === 'kengaygan' ? '0.32fr' : '1fr');
  const keyinUstun = tur === 'kengaygan' ? '2.2fr' : tur === 'toliq' ? '0.8fr' : keyin.t ? '1.6fr' : '1fr';
  const ustun = ikki
    ? `repeat(${QATOR_EN}, minmax(0, 1fr)) minmax(0, ${kv ? keyinUstun : '0.8fr'})`
    : [...nuqtalar.map(ustunTur), ...(kv ? [keyinUstun] : [])].join(' ');
  const nuqta = (p, i) => <YcNuqta key={p.k} p={p} i={i} tur={tur} chap={b0 >= 0 && i > b0 && i <= b1} ong={(b0 >= 0 && i >= b0 && i < b1) || (i === nuqtalar.length - 1 && keyinOn)} />;
  const davomOn = b0 >= 0 && QATOR_EN - 1 >= b0 && QATOR_EN - 1 < b1;
  return (
    <div ref={ref} lang={__lang} className={cxx('yc', `yc-${tur}`, ikki && 'yc-ikki', kir && 'kir', chiz.q.some(c => c.tur === 'strelka') && 'yc-past', className)} style={{ '--ustun': ustun, '--oddiy': nuqtalar.filter(p => !p.pastki).length }}>
      {sahna}
      {qavs && <div className="yc-qavslar" aria-hidden="true"><span className="yc-qavs" style={{ gridColumn: `1 / span ${nuqtalar.length}` }}>{tr(QAVS.nima)}</span>{kv && <span className="yc-qavs k">{tr(QAVS.keyin)}</span>}</div>}
      {ikki ? (<>
        <div className="yc-qator q1">
          {nuqtalar.slice(0, QATOR_EN).map((p, i) => nuqta(p, i))}
          <span className={cxx('yc-davom', davomOn && 'on')} aria-hidden="true" />
        </div>
        <div className="yc-qator q2">
          {nuqtalar.slice(QATOR_EN).map((p, i) => nuqta(p, i + QATOR_EN))}
          {kv && <YcKeyin k={keyin} i={nuqtalar.length} tur={tur} chap={keyinOn} />}
        </div>
      </>) : (
        <div className="yc-qator">
          {nuqtalar.map(nuqta)}
          {kv && <YcKeyin k={keyin} i={nuqtalar.length} tur={tur} chap={keyinOn} />}
          {pastida && <div className="yc-pastida">{pastida}</div>}
        </div>
      )}
      <BogQatlam chiz={chiz} uid={uid} />
      {children}
    </div>
  );
};

// O'qituvchi eslatmasi — faqat mentor (proyektor) rejimida, bosilganda ochiladi
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="yp-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="yp-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: "Заметка ментору" })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="yp-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: "Заметка" })}</QTugma>;
};
// 151-qonun: nishon sharti qatori (birinchi urinish); nishon olingach yoki mashq-o'tishida ko'rinmaydi
const NishonQatori = ({ screen }) => {
  const olingan = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const { isMentor } = useJonli();
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || isMentor || (olingan && olingan.has(ach))) return null;
  const ketdi = am.missed.has(sid);
  return <p className={cxx('yp-nishon', ketdi && 'ketdi')}>{ketdi ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: "Значок был за первую попытку." }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: "Сделаете верно с первой попытки — значок ваш." })}</p>;
};
// Artefakt-strip «Chizig'im» (U-042): 11, 14, 15-ekranlarda — o'quvchining saqlangan chizig'i ixcham (10-ekranda chiziqning o'zi turadi)
const ChizigimStrip = ({ yol }) => {
  const s = lsGet(YOL_KEY);
  if (!s || !Array.isArray(s.loyihalar) || !s.loyihalar.length) return null;
  const otk = Array.isArray(yol) ? yol.filter(y => y.holat === 'otkaz').map(y => y.modul) : [];
  const jami = CHIZIQ.length - otk.length;
  return (
    <div className="yp-strip fade-up">
      <span className="yp-strip-l">{tr({ uz: "Chizig'im", ru: "Моя линия" })}</span>
      <span className="yp-strip-d" aria-hidden="true"><i style={{ width: `${Math.round(Math.min(1, s.loyihalar.length / Math.max(1, jami)) * 100)}%` }} /></span>
      <span className="yp-strip-n">{s.loyihalar.length} / {jami}</span>
    </div>
  );
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
    <div className="yp-ovoz fade-step">
      {variantlar.map((v, i) => (
        <div key={i} className={cxx('yp-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="yp-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>
      ))}
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish: sof so'rovnoma, J-026 — hammaga correct: false, maqtovsiz; chapda portfolio + «tik» chiziq, javobdan keyin «Loyihalarim»ga strelka) =====
const HOOK_OPTS = [
  { id: 'nol', son: 0, t: { uz: "Hali bitta ham o'z loyiham yo'q", ru: "Пока нет ни одного своего проекта" } },
  { id: 'bir', son: 2, t: { uz: "Bir-ikkita o'z loyiham turibdi", ru: "Есть один-два своих проекта" } },
  { id: 'uch', son: 3, t: { uz: "Uchta va undan ko'p loyiham bor", ru: "Три проекта и больше" } }
];
const PortfolioMaket = ({ son, ochiq }) => (
  <div className="yp-br" aria-hidden="true">
    <div className="yp-br-bosh"><i /><i /><i /><span className="yp-br-url">{tr({ uz: 'ismingiz.netlify.app', ru: 'vashe-imya.netlify.app' })}</span></div>
    <div className="yp-br-ichi">
      <span className="yp-br-ism" />
      <span className="yp-br-b">{tr({ uz: 'Men haqimda', ru: "Обо мне" })}</span>
      <span className="yp-br-ch" /><span className="yp-br-ch qisqa" />
      <span className={cxx('yp-br-b', 'on', ochiq && 'sol')}>{tr({ uz: 'Loyihalarim', ru: "Мои проекты" })}{ochiq && <b className="yp-br-son">{son > 2 ? '3+' : son}</b>}</span>
      {[0, 1, 2].map(i => <span key={i} className={cxx('yp-br-ch', 'loy', i < son && 'toq')} style={{ '--i': i }} />)}
      <span className="yp-br-b">{tr({ uz: 'Aloqa', ru: "Контакты" })}</span>
      <span className="yp-br-ch qisqa" />
    </div>
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const tanlov = HOOK_OPTS.find(o => o.id === picked);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: "Выберите один вариант" }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Portfolio saytingizda <A>nechta loyiha</A> turibdi?</>, ru: <>Сколько <A>проектов</A> на вашем сайте-портфолио?</> })}
        mentor={<Mentor>{tr({ uz: "Bir yil oldin portfolio'ga «Loyihalarim» bo'limini qo'shgandingiz. Eslab ko'ring va bittasini tanlang.", ru: "Год назад вы добавили в портфолио раздел «Мои проекты». Вспомните и выберите один вариант." })}</Mentor>}
        maket={<div className={cxx('yp-s0', tanlov && 'ochiq')}>
          <PortfolioMaket son={tanlov ? tanlov.son : 0} ochiq={!!tanlov} />
          <span className="yp-s0-ok" aria-hidden="true"><i /></span>
          <YilChizigi tur="tik" nuqtalar={CHIZIQ.map(c => ({ k: `m${c.modul}`, yorliq: mYorliq(c), holat: 'bosh' }))} />
        </div>}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
        javob={<>
          {picked !== null && <p className="yp-javob fade-step">{tr({ uz: "Portfolio bir yil oldin yozilgan. O'shandan beri kursda ko'p loyiha qurildi — ular hali bitta joyga yig'ilmagan.", ru: "Портфолио написано год назад. С тех пор на курсе построено много проектов — они ещё не собраны в одном месте." })}</p>}
          {isLive && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
        </>}
      />
      <MentorNote>{tr({ uz: "Portfolio sayti ochilmaydigan o'quvchi ham tanlaydi — savol eslash haqida. Javobni muhokama qilmang: chiziqni keyingi ekranlar to'ldiradi.", ru: "Выбирает и ученик, у которого сайт-портфолио не открывается: вопрос — на память. Не обсуждайте ответ: линию заполнят следующие экраны." })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda yakuniy chiziq oldindan — matnsiz kartalar navbat bilan tushadi, «Keyin» yonadi; o'ngda «01 · matn · teg») =====
const REJA = [
  { t: { uz: "Loyihalaringizni qurilgan tartibida bitta chiziqqa qo'yasiz", ru: "Поставите свои проекты на одну линию в порядке их создания" }, teg: { uz: "vaqt chizig'i", ru: "линия времени" } },
  { t: { uz: "Har loyihada nimani o'rganganingizni yozasiz", ru: "Напишете, чему научились в каждом проекте" }, teg: { uz: "o'rgandim", ru: "умею" } },
  { t: { uz: "Uzum'ning ikki sanasini chiziqda ko'rasiz", ru: "Увидите на линии две даты Uzum" }, teg: { uz: 'voqea', ru: "история" } },
  { t: { uz: 'Bitta keyingi qadamni tanlaysiz', ru: "Выберете один следующий шаг" }, teg: { uz: 'keyingi qadam', ru: "следующий шаг" } }
];
// Dars oxiridagi chiziqning oldindan ko'rinishi (SABOQ 20): matnsiz kartalar navbat bilan chiziqqa tushadi, oxirida «Keyin» yonadi —
// loyiha nomlari yozilmaydi (2-ekran javobini ochmaydi, MD 1-ekran)
const REJA_N = CHIZIQ.length;
const RejaChiziq = () => {
  const [n, setN] = useState(() => (kamHarakat() ? REJA_N + 1 : 0));
  useEffect(() => {
    if (n > REJA_N) return undefined;
    const t = setTimeout(() => setN(v => v + 1), n === 0 ? 300 : 360);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <YilChizigi tur="toliq" className="yp-reja-yc"
      nuqtalar={CHIZIQ.map((c, i) => ({ k: `m${c.modul}`, yorliq: String(c.modul), holat: i < n ? 'nom' : 'bosh', nom: <i className="yc-sk" />, nima: '' }))}
      keyin={{ holat: n > REJA_N ? 'toliq' : 'bosh', katta: true }} />
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: "Начинаем" })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun bir yilda qurganingizni <A>bitta chiziqqa</A> qo'yasiz.</>, ru: <>Всё построенное за год — <A>на одной линии</A>.</> })}
      mentor={<Mentor>{tr({ uz: "Chiziqning oxirida «Maydon» turadi — bugungi misol shu. Darsda chiziqni boshlab, keyingi qadamni yozasiz; bo'sh joylarini uyda to'ldirasiz.", ru: "В конце линии стоит «Maydon» — это сегодняшний пример. На уроке вы начнёте линию и напишете следующий шаг; пустые места заполните дома." })}</Mentor>}
      chapYorliq={tr({ uz: "Dars oxirida — yillik yo'l: loyihalar vaqt chizig'ida va keyingi qadam", ru: "В конце урока — годовой путь: проекты на линии времени и следующий шаг" })}
      chap={<RejaChiziq />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — VAQT CHIZIG'I (QTushuncha, markaziy): yetti karta bittadan → modul nuqtasi; atama 7/7 dan keyin (T-011) · nishon timeKeeper =====
// Navbat (aralash, MD): bir vaqtda bitta karta; `ishora` — bitta kartada ikkinchi xatodan keyin ochiladi (ekran — tartib, xotira testi emas)
const KARTALAR = [
  { id: 'tg', modul: 7, ishora: { uz: 'bot + Database + AI', ru: "бот + Database + ИИ" } },
  { id: 'pf', modul: 2, ishora: { uz: 'HTML + CSS', ru: "HTML + CSS" } },
  { id: 'ks', modul: 6, ishora: { uz: 'NestJS + test', ru: "NestJS + тест" } },
  { id: 'ai', modul: 4, ishora: { uz: 'React + API', ru: "React + API" } },
  { id: 'tt', modul: 8, ishora: { uz: 'sayt + ilova + bot', ru: "сайт + приложение + бот" } },
  { id: 'md', modul: 3, ishora: { uz: 'JavaScript + AI', ru: "JavaScript + ИИ" } },
  { id: 'as', modul: 5, ishora: { uz: 'Backend + PostgreSQL', ru: "Backend + PostgreSQL" } }
];
const S2 = {
  xato: { uz: 'Bu loyiha boshqa modulda qurilgan — modul nomiga qarang.', ru: "Этот проект построен в другом модуле — посмотрите на название модуля." },
  avtoijara: { uz: "AvtoIjara Backend'i shu yerda, sayti esa oldinroq qurilgan.", ru: "Backend AvtoIjara строился здесь, а сайт к нему — раньше." },
  ipucha: { uz: "Kartadagi loyihada nima ishlatilgan edi? Shu nomdagi modulni toping.", ru: "Что использовалось в проекте на карточке? Найдите модуль с таким названием." },
  foundation: { uz: "bo'lgan bo'lsa — o'zingiz qo'shasiz", ru: "если был — добавите сами" }
};
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const achMiss = useContext(AchMissCtx);
  const [joy, setJoy] = useState(() => (storedAnswer || isMentor ? KARTALAR.map(k => k.modul) : []));
  const [tanlandi, setTanlandi] = useState(false);
  const [flash, setFlash] = useState(null);
  const [xato, setXato] = useState(null);
  const [miss, setMiss] = useState({});
  const xatoRef = useRef(false);
  const karRef = useRef(null);
  const uch = useUchish();
  const done = joy.length >= KARTALAR.length;
  const tugadi = useTugadi(done, 1200, !!storedAnswer || isMentor);
  const joriy = KARTALAR.find(k => !joy.includes(k.modul));
  const ipucha = useIpucha(!done && !isMentor, `${joy.length}-${flash ? flash.k : 0}`, 40000);
  useEffect(() => { if (!flash) return undefined; const t = setTimeout(() => setFlash(null), 650); return () => clearTimeout(t); }, [flash]);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    const first = !xatoRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'chiziq', screenIdx: screen, correct: first, picked: true, solved: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'chiziq', 0, true, 0);
  }, [done]); // eslint-disable-line
  const qoy = (modul) => {
    if (done || !joriy || isMentor) return;
    if (modul === joriy.modul) { uch(karRef.current, `k-m${modul}`, 620); setJoy(j => [...j, modul]); setTanlandi(false); setXato(null); return; }
    xatoRef.current = true;
    if (achMiss) achMiss.miss(screen);
    setMiss(m => ({ ...m, [joriy.id]: (m[joriy.id] || 0) + 1 }));
    setFlash({ modul, k: Date.now() });
    setXato(joriy.id === 'ai' && modul === 5 ? S2.avtoijara : S2.xato);
  };
  const nuqtalar = CHIZIQ.map(c => {
    const bor = !!c.mentor || joy.includes(c.modul);
    const nishon = !done && !bor && c.modul <= 8;
    return {
      k: `m${c.modul}`, modul: c.modul, yorliq: mYorliq(c), mentor: c.mentor, kalit: bor ? 'bor' : 'yoq', uch: `k-m${c.modul}`,
      holat: bor ? 'nom' : 'bosh', nom: bor ? tr(c.nom) : null,
      xato: !!(flash && flash.modul === c.modul), kutadi: nishon && tanlandi, onBos: nishon ? () => qoy(c.modul) : undefined,
      osti: c.modul === 1 ? tr(S2.foundation) : done && c.modul === 2 ? tr({ uz: 'bitta sahifa', ru: "одна страница" }) : done && c.modul === 10 ? tr({ uz: 'prodda ishlayotgan sayt', ru: "сайт, работающий в проде" }) : null
    };
  });
  const silk = flash ? `s${flash.k}` : '';
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · vaqt chizig'i", ru: "Понятие · линия времени" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Kartalarni joylang', ru: "Разложите карточки" })} (${joy.length}/7)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng tugadi={tugadi}
        sarlavha={tr({ uz: <>Loyihalaringiz <A>qaysi tartibda</A> qurilgan?</>, ru: <>В каком <A>порядке</A> строились ваши проекты?</> })}
        mentor={<Mentor>{tr({ uz: "Kurs loyihalarining kartalari aralashib ketgan. Kartani tanlang, so'ng uning modulini bosing.", ru: "Карточки проектов курса перемешались. Выберите карточку, потом нажмите её модуль." })}</Mentor>}
        vizual={<YilChizigi tur="toliq" nuqtalar={nuqtalar} keyin={{ holat: 'yopiq' }} bog={done ? [{ dan: 'm2', gacha: 'm10', tur: 'strelka', yorliq: tr({ uz: 'bir yil', ru: "один год" }) }] : []} />}
        harakat={!done && joriy && (
          <div className="yp-s2-h">
            <div className="yp-dasta">
            {KARTALAR.length - joy.length > 1 && <i className="yp-dasta-q q1" aria-hidden="true" />}
            {KARTALAR.length - joy.length > 2 && <i className="yp-dasta-q q2" aria-hidden="true" />}
            <button type="button" ref={karRef} key={`${joriy.id}${silk}`} className={cxx('yp-kar', tanlandi ? 'on' : 'chorla', flash && 'silk')} draggable={!isMentor}
              onDragStart={(e) => { try { e.dataTransfer.setData('text/plain', joriy.id); } catch { /* sudrash ishlamasa — bosish yetadi */ } setTanlandi(true); }}
              onClick={() => setTanlandi(t => !t)}>
              <span className="yp-kar-y">{tr(YC.qurdim)}</span>
              <b>{tr(CHIZIQ[joriy.modul - 1].nom)}</b>
              {(miss[joriy.id] || 0) >= 2 && <span className="yp-ishora">{tr(joriy.ishora)}</span>}
            </button>
            </div>
            {xato && <QXato>{tr(xato)}</QXato>}
            {!xato && ipucha && <QIzoh>{tr(S2.ipucha)}</QIzoh>}
            <NishonQatori screen={screen} />
          </div>
        )}
        natija={done && <QIzoh>{tr({ uz: "Loyihalar qurilgan vaqti tartibida turgan chiziq vaqt chizig'i deyiladi.", ru: "Линия, на которой проекты стоят в порядке их создания, называется линией времени." })}</QIzoh>}
        xulosa={done && tr({ uz: "Bu chiziqda bir yillik o'sish ko'rinadi: bitta sahifadan prodda ishlayotgan saytgacha.", ru: "На этой линии виден рост за год: от одной страницы до сайта, работающего в проде." })}
      />
      <MentorNote>{tr({ uz: "Foundation moduli bo'lmagan guruhda 1-nuqta bo'sh qoladi — bu xato emas. Sinfdan so'rang: bir yil oldin shu yetti loyihadan qaysi birini qura olardingiz? «Portfolio — bitta sahifa» yorlig'i 2-moduldagi HTML praktikasidan (besh bo'limli bitta sahifa).", ru: "В группе без модуля Foundation точка 1 остаётся пустой — это не ошибка. Спросите класс: какой из этих семи проектов вы могли бы построить год назад? Ярлык «одна страница» у портфолио — из HTML-практики 2-го модуля (одна страница из пяти разделов)." })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 3, ✔ D) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · vaqt chizig'i", ru: "Проверка · линия времени" })}
    questionText="Yillik vaqt chizig'iga qaysi loyihalaringizni qo'yasiz?"
    question={tr({ uz: <h2 className="title h-ask">Yillik vaqt chizig'iga <A>qaysi loyihalaringizni</A> qo'yasiz?</h2>, ru: <h2 className="title h-ask"><A>Какие свои проекты</A> вы поставите на годовую линию времени?</h2> })}
    options={[
      { uz: 'Eng yaxshi chiqqan ikki-uchtasini', ru: "Два-три самых удачных" },
      { uz: 'Oxirgi va eng katta bittasini', ru: "Один — последний и самый большой" },
      { uz: 'Internetga chiqib ishlayotganlarini', ru: "Те, что работают в интернете" },
      { uz: 'Har moduldagi asosiy loyihasini', ru: "Главный проект каждого модуля" }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Har moduldan asosiy loyiha turadi — kichigi ham o'sishni ko'rsatadi.", ru: "На линии — главный проект каждого модуля: даже маленький показывает рост." }}
    explainWrong={{
      0: { uz: "Yaxshisini tanlasangiz, qayerdan boshlaganingiz ko'rinmaydi.", ru: "Если выбрать лучшие, не видно, с чего вы начали." },
      1: { uz: "Bitta loyihadan chiziq chiqmaydi — o'sish ko'rinmaydi.", ru: "Из одного проекта линия не получится — рост не виден." },
      2: { uz: "Internetga chiqmagan loyihada ham o'rganganingiz bor.", ru: "И в проекте, который не вышел в интернет, вы чему-то научились." },
      default: { uz: "Bir yillik o'sish ko'rinishi uchun nima kerak?", ru: "Что нужно, чтобы был виден рост за год?" }
    }} />
);

// ===== SCREEN 4 — QURDIM VA O'RGANDIM (QTushuncha keng: chiziqda uch loyiha — joriysi halqada; tanlov ostida, to'g'ri gap kartaga uchadi · nishon skillSpotter) =====
// Har qadam: { modul, togri, tuzoq: [2], joy } — to'g'ri gap o'rni har qadamda boshqa (aralash tartib)
const ORGANDIM_TANLOV = [
  { modul: 5, joy: 1, togri: { uz: "Backend yozib, ma'lumotni PostgreSQL'da saqlash", ru: "Писать Backend и хранить данные в PostgreSQL" },
    tuzoq: [{ uz: 'AvtoStoyanka sayti va panelini oxirigacha qurish', ru: "Достроить сайт и панель AvtoStoyanka до конца" }, { uz: "Loyiha kuni sinfda hammaga juda qiziq o'tdi", ru: "День проекта в классе всем очень понравился" }] },
  { modul: 7, joy: 2, togri: { uz: "Botga Database va AI'ni ulash", ru: "Подключать к боту Database и ИИ" },
    tuzoq: [{ uz: 'Sinfdoshlar Telegram botni maqtagani', ru: "Одноклассники хвалили Telegram-бота" }, { uz: 'Bot loyihasini oxirigacha qurish', ru: "Достроить проект бота до конца" }] },
  { modul: 9, joy: 0, togri: { uz: "Muammoni odamlardan so'rab topish", ru: "Находить проблему, расспрашивая людей" },
    tuzoq: [{ uz: 'Maydon saytini noldan qurib chiqish', ru: "Построить сайт Maydon с нуля" }, { uz: 'Futbol haqidagi loyiha menga yoqqani', ru: "Мне понравился проект про футбол" }] }
];
const tanlovRo = (q) => { const a = q.tuzoq.map(t => ({ t, ok: false })); a.splice(q.joy, 0, { t: q.togri, ok: true }); return a; };
const S4 = {
  xato: { uz: 'Bu gap endi nima qila olishingizni aytmaydi.', ru: "Эта фраза не говорит, что вы теперь умеете." },
  ipucha: { uz: "Shu loyihadan keyin nimani qila oladigan bo'ldingiz? O'shani toping.", ru: "Что вы стали уметь после этого проекта? Найдите эту фразу." }
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const achMiss = useContext(AchMissCtx);
  const [q, setQ] = useState(() => (storedAnswer || isMentor ? 3 : 0));
  const [silk, setSilk] = useState(null);
  const [xato, setXato] = useState(false);
  const xatoRef = useRef(false);
  const done = q >= 3;
  const tugadi = useTugadi(done, 900, !!storedAnswer || isMentor);
  const ipucha = useIpucha(!done && !isMentor, `${q}-${silk ? silk.k : 0}`, 42000);
  useEffect(() => { if (!silk) return undefined; const t = setTimeout(() => setSilk(s => (s ? { ...s, i: -1 } : s)), 650); return () => clearTimeout(t); }, [silk && silk.k]); // eslint-disable-line
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    const first = !xatoRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'organdim', screenIdx: screen, correct: first, picked: true, solved: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'organdim', 0, true, 0);
  }, [done]); // eslint-disable-line
  const uch = useUchish();
  const tanla = (v, i, el) => {
    if (done || isMentor) return;
    if (v.ok) { uch(el, `o-m${ORGANDIM_TANLOV[q].modul}`, 640); setQ(n => n + 1); setXato(false); setSilk(null); return; }
    xatoRef.current = true;
    if (achMiss) achMiss.miss(screen);
    setXato(true); setSilk({ i, k: Date.now() });
  };
  const cur = ORGANDIM_TANLOV[q];
  // SABOQ 21, 24: alohida qadam-ro'yxati yo'q — chiziqdagi uch loyiha o'zi qadam (joriysi halqada, o'tgani ✓); tanlov — chiziq ostida, joriy karta tagida
  const nuqtalar = ORGANDIM_TANLOV.map((t, i) => ({
    k: `m${t.modul}`, modul: t.modul, yorliq: mYorliq(CHIZIQ[t.modul - 1]), kalit: i < q ? 'tol' : 'och',
    holat: i < q ? 'toliq' : 'nom', joriy: i === q, nom: tr(CHIZIQ[t.modul - 1].nom), nima: i < q ? tr(t.togri) : '', uchNima: `o-m${t.modul}`,
    xato: i === q && !!silk && silk.i >= 0
  }));
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · qurdim va o'rgandim", ru: "Понятие · построил(а) и умею" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "«O'rgandim»ni toping", ru: "Найдите «Умею»" })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng tugadi={tugadi}
        sarlavha={tr({ uz: <>Loyiha nomidan <A>nima o'rganganingiz</A> bilinadimi?</>, ru: <>Видно ли по названию проекта, <A>чему вы научились</A>?</> })}
        mentor={<Mentor>{tr({ uz: "Bu loyihalarda «O'rgandim» hali bo'sh. Har biriga mos gapni tanlang.", ru: "В этих проектах поле «Умею» пока пустое. Выберите для каждого подходящую фразу." })}</Mentor>}
        vizual={<YilChizigi tur="toliq" className="yp-s4-yc" nuqtalar={nuqtalar} />}
        harakat={!done && cur && <div className="yp-s4-h" style={{ '--q': q }}>
          <div className="yp-tan-ro" key={q}>
            {tanlovRo(cur).map((v, i) => (
              <button type="button" key={silk && silk.i === i ? `${i}-${silk.k}` : i} className={cxx('yp-tan', silk && silk.i === i && 'silk')} style={{ '--j': i }} disabled={isMentor} onClick={(e) => tanla(v, i, e.currentTarget)}>{tr(v.t)}</button>
            ))}
          </div>
          {xato && <QXato>{tr(S4.xato)}</QXato>}
          {!xato && ipucha && <QIzoh>{tr(S4.ipucha)}</QIzoh>}
          <NishonQatori screen={screen} />
        </div>}
        xulosa={done && tr({ uz: "Loyiha nomi nima qurilganini aytadi. «O'rgandim» esa endi nima qila olishingizni ko'rsatadi.", ru: "Название проекта говорит, что построено. А «Умею» показывает, что вы теперь можете делать." })}
      />
      <MentorNote>{tr({ uz: "Har loyihada sinfdan bitta odamni so'rang: «Shu loyihadan keyin nima qila oladigan bo'ldingiz?» «AvtoIjara qildim» desa — bu nom, «O'rgandim» emas. Masdar shakli («saqlash», «ulash») — chiziqdagi yozuv shakli; og'zaki javob «… qila olaman» bo'lishi mumkin.", ru: "По каждому проекту спросите одного ученика: «Что вы стали уметь после этого проекта?» Если скажет «Сделал(а) AvtoIjara» — это название, а не «Умею». Инфинитив («хранить», «подключать») — форма записи на линии; устно можно ответить «Я умею …»." })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 1, ✔ B) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · o'rgandim", ru: "Проверка · умею" })}
    questionText="Portfolio sayt uchun «O'rgandim»ga qaysi gap yoziladi?"
    question={tr({ uz: <h2 className="title h-ask">Portfolio sayt uchun <A>«O'rgandim»ga</A> qaysi gap yoziladi?</h2>, ru: <h2 className="title h-ask">Какую фразу написать в <A>«Умею»</A> для сайта-портфолио?</h2> })}
    options={[
      { uz: 'Portfolio sayt loyihasini oxiriga yetkazish', ru: "Довести проект сайта-портфолио до конца" },
      { uz: "Sahifani HTML va CSS'da qo'lda yasash", ru: "Делать страницу вручную на HTML и CSS" },
      { uz: "Sayt do'stlarga CSS bilan chiroyli ko'ringani", ru: "Сайт с CSS показался друзьям красивым" },
      { uz: 'Sayt bir yildan beri internetda turgani', ru: "Сайт уже год висит в интернете" }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Bu gap loyihadan keyin nima qila olishingizni aytadi.', ru: "Эта фраза говорит, что вы стали уметь после проекта." }}
    explainWrong={{
      0: { uz: "Bu loyiha nomini takrorladi — nima o'rgandingiz?", ru: "Это повтор названия проекта — чему вы научились?" },
      2: { uz: 'Bu fikr — endi nima qila olasiz?', ru: "Это мнение — что вы теперь умеете?" },
      3: { uz: 'Bu sayt haqida gap — siz nima qila olasiz?', ru: "Это фраза о сайте — а что умеете вы?" },
      default: { uz: "Loyihadan keyin nima qila oladigan bo'ldingiz?", ru: "Что вы стали уметь после проекта?" }
    }} />
);

// ===== SCREEN 6 — UZUM (QVoqea, K1 mintaqaviy; PM-028): nuqtalar · bosqich nomi · jonli sahna (telefon, mashina, topshirish punkti) + vaqt chizig'i «voqea» · 3/4 bashorat =====
// Manba (o'quvchi ko'rmaydi): PM_Prompt_v8.md bank K1 Uzum (reviziya yanvar 2026) — 2022-yil oktabr ishga tushdi; saytdan emas, logistikadan boshladi
//   (o'z mashinalari, topshirish punktlari, ertasi kuni yetkazish), chunki bungacha xarid Instagram/Telegram guruhlari orqali, yetkazib berishsiz edi;
//   2024-yil mart — mamlakatning birinchi «unicorn»i («unicorn» = bahosi 1 mlrd dollardan yuqori). Tashqi tasdiq: TechCrunch, 25.03.2024.
//   «Bir yarim yilga yaqin» — ikki bank sanasi orasidagi hisob (17 oy), yangi fakt emas. Boshqa raqam qo'shilmaydi; «keyin?» nuqtasi bo'sh qoladi.
// SABOQ 8: bosqich gapi Mentorda (har bosqichda almashadi); sahnada — bosqich nomi va jonli maket. SABOQ 2: nom o'z rangida, logotipsiz, tanish maket.
const UZUM_BOSQICH = [
  { h: { uz: 'Bungacha', ru: "До этого" }, m: { uz: "Uzum'gacha odamlar narsani ko'pincha Telegram va Instagram guruhlaridan olardi — yetkazib berishsiz.", ru: "До Uzum люди чаще всего покупали вещи в группах Telegram и Instagram — без доставки." } },
  { h: { uz: '2022-yil oktabr · ishga tushdi', ru: "Октябрь 2022 · запуск" }, m: { uz: "Uzum saytdan emas, yetkazib berishdan boshladi: o'z mashinalari, topshirish punktlari va ertasi kuni yetkazish.", ru: "Uzum начал не с сайта, а с доставки: свои машины, пункты выдачи и доставка на следующий день." } },
  { h: { uz: 'Qancha vaqt ketdi?', ru: "Сколько прошло времени?" }, bashorat: true, m: { uz: "Bahosi 1 milliard dollardan oshgan kompaniya «unicorn» deyiladi. O'zbekistonda bunday kompaniya hali yo'q edi.", ru: "Компанию, которая стоит больше 1 миллиарда долларов, называют «единорогом» (unicorn). В Узбекистане такой компании ещё не было." } },
  { h: { uz: "2024-yil mart · birinchi «unicorn»", ru: "Март 2024 · первый «единорог»" }, m: { uz: "Ishga tushganidan bir yarim yilga yaqin o'tib, Uzum mamlakatning birinchi «unicorn»i bo'ldi.", ru: "Примерно через полтора года после запуска Uzum стал первым «единорогом» страны." } }
];
const UZUM_TAXMIN = [
  { k: 'bir', t: { uz: 'Bir yilga yetmay', ru: "Меньше года" } },
  { k: 'yarim', t: { uz: 'Bir yarim yilga yaqin', ru: "Около полутора лет" } },
  { k: 'besh', t: { uz: "Besh yildan ko'proq", ru: "Больше пяти лет" } }
];
const Uzum = () => <span className="yp-uzum">Uzum</span>;
// Chizilgan telefon: «chat» — guruh-chat (pufaklar matnsiz), «ilova» — Uzum ilovasi oynasi (nom o'z rangida, logotipsiz)
const UzumTelefon = ({ ekran }) => (
  <div className={cxx('yp-tel', ekran)} aria-hidden="true">
    <span className="yp-tel-k" />
    <div className="yp-tel-e" key={ekran}>
      {ekran === 'chat' ? (<>
        <div className="yp-ch-bosh"><i /><span /></div>
        <div className="yp-ch-ro">
          <span className="yp-pf chap"><i /><i className="q" /></span>
          <span className="yp-pf chap rasm"><b /></span>
          <span className="yp-pf ong"><i className="q" /></span>
          <span className="yp-pf chap"><i /><i className="q" /></span>
          <span className="yp-pf ong"><i /></span>
        </div>
      </>) : (<>
        <div className="yp-uz-bosh"><Uzum /><span className="yp-uz-q" /></div>
        <div className="yp-uz-ro">{[0, 1, 2, 3].map(i => <span key={i} className={`yp-uz-m m${i}`}><i /><b /></span>)}</div>
        <div className="yp-uz-yet"><i className="yp-mini-m" /><span>{tr({ uz: 'ertaga', ru: "завтра" })}</span></div>
      </>)}
    </div>
  </div>
);
const UzumMashina = ({ yur }) => (
  <div className={cxx('yp-yol', yur && 'yur')} aria-hidden="true">
    <div className="yp-mash"><span className="yp-mash-k" /><span className="yp-mash-t" /><i className="g1" /><i className="g2" /></div>
    <div className="yp-punkt"><span className="yp-punkt-t" /><span className="yp-punkt-d" /><span className="yp-punkt-o"><i /><i /><i /><i /></span></div>
    <span className="yp-yol-c" />
  </div>
);
// SABOQ 26: yorliqlar faqat o'z bosqichida (keyingi bosqichda yo'qoladi); yakunda sahna kichrayadi (SABOQ 25)
const UzumSahna = ({ b }) => (
  <div className={cxx('yp-uz-sahna', `b${b}`, b >= 3 && 'kichik')}>
    {b === 0 && <p className="yp-uz-tanish"><Uzum /> — {tr({ uz: 'narsani telefonda tanlasangiz, yetkazib beradigan internet-magazin', ru: "интернет-магазин: выбираете вещь в телефоне — он доставляет" })}</p>}
    <div className="yp-uz-q">
      <div className="yp-uz-tq"><UzumTelefon ekran={b === 0 ? 'chat' : 'ilova'} />{b <= 1 && <span key={`t${b}`} className={cxx('yp-tag', b === 0 ? 'oldin' : 'keyin')}>{b === 0 ? tr({ uz: 'yetkazib berishsiz', ru: "без доставки" }) : tr({ uz: 'ertasi kuni yetkazish', ru: "доставка на следующий день" })}</span>}</div>
      {b >= 1 && <div className="yp-uz-lq"><UzumMashina yur={b === 1} />{b === 1 && <span className="yp-tag keyin">{tr({ uz: 'o\'z mashinalari · topshirish punkti', ru: "свои машины · пункт выдачи" })}</span>}</div>}
    </div>
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 3 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const done = b >= 3;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bq = UZUM_BOSQICH[b];
  const kutish = !!bq.bashorat && !taxmin;
  const keyingi = () => { if (b < 3) setB(b + 1); else onNext(); };
  useEffect(() => {
    if (!done || storedAnswer) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 1200);
    return () => clearTimeout(t);
  }, [done]); // eslint-disable-line
  const tx = UZUM_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Uzum /> · {b + 1}/4</>;
  // To'rt joy doim bor (pozitsiya bosqichdan bosqichga siljimaydi); hali ochilmagani ko'rinmaydi
  const nuqtalar = [
    { k: 'v0', yorliq: tr({ uz: 'bungacha', ru: "до этого" }), holat: 'otkaz', karta: false },
    { k: 'v1', yorliq: '2022 · ' + tr({ uz: 'oktabr', ru: "октябрь" }), holat: b >= 1 ? 'nom' : 'bosh', yashirin: b < 1, kir: b === 1 },
    b >= 3 ? { k: 'v2', yorliq: '2024 · ' + tr({ uz: 'mart', ru: "март" }), holat: 'nom', kir: true, chip: 'unicorn' } : { k: 'v2', yorliq: '', belgi: '?', holat: 'bosh', yashirin: b < 2 }
  ];
  const bog = [
    ...(b >= 1 ? [{ dan: 'v0', gacha: 'v1', tur: 'yoy', yorliq: b === 1 ? tr({ uz: 'muammodan', ru: "из проблемы" }) : undefined }] : []),
    ...(b >= 3 ? [{ dan: 'v1', gacha: 'v2', tur: 'qavs', yorliq: tr({ uz: 'bir yarim yilga yaqin', ru: "около полутора лет" }) }] : [])
  ];
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: "Из мира бизнеса" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={kutish ? tr({ uz: 'Avval belgilang', ru: "Сначала отметьте" }) : b < 3 ? `${tr({ uz: 'Keyingi bosqich', ru: "Следующий этап" })} (${b + 1}/4)` : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Uzum />'ning <A>ikki sanasi</A> nimani ko'rsatadi?</>, ru: <>Что показывают <A>две даты</A> <Uzum />?</> })}
        nuqtalar={<>
          <Mentor key={`m${b}`}>{b === 0 && <>{tr({ uz: "Bu voqeani eshitgansiz — endi uni vaqt chizig'ida ko'ring.", ru: "Эту историю вы слышали — теперь посмотрите на неё на линии времени." })} </>}{tr(bq.m)}</Mentor>
          <div className="yp-nuq"><span className="yp-nuq-l">{yorliq}</span>{UZUM_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="yp-voqea" key={b}>
          <span className="yp-voqea-h">{tr(bq.h)}</span>
          <Zoomable>
            <YilChizigi tur="voqea" sahna={<UzumSahna b={b} />} nuqtalar={nuqtalar} bog={bog}
              keyin={{ holat: b >= 3 ? 'bosh' : 'joy', yorliq: tr({ uz: 'keyin?', ru: "дальше?" }) }} />
          </Zoomable>
          {bq.bashorat && !taxmin && <QBashorat yorliq={yorliq} savol={tr({ uz: <>Uzum «unicorn» bo'lishiga <b>qancha vaqt</b> ketdi?</>, ru: <>Сколько <b>времени</b> понадобилось Uzum, чтобы стать «единорогом»?</> })}
            variantlar={UZUM_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />}
          {taxmin && b === 2 && <div className="yp-taxmin" role="status"><span className="yp-taxmin-s">{tr({ uz: "Uzum «unicorn» bo'lishiga qancha vaqt ketdi?", ru: "Сколько времени понадобилось Uzum, чтобы стать «единорогом»?" })}</span><span className="yp-taxmin-b">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{tr(tx.t)}</b></span></div>}
          {done && <QXulosa>{tx && <span className={cxx('yp-nat-tx', taxmin === 'yarim' && 'ok')}>{taxmin === 'yarim'
            ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: "Ваше предположение оказалось верным" })
            : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t).toLowerCase()} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: 'bir yarim yilga yaqin', ru: "около полутора лет" })}</b></>}</span>}
            {tr({ uz: "Uzum'ning ikki sanasi chiziqda turibdi. Birinchi qadam muammodan o'sgan: xarid yetkazib berishsiz edi.", ru: "Две даты Uzum стоят на линии. Первый шаг вырос из проблемы: покупка была без доставки." })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "«Baho» — kompaniya qancha turishi. Raqam va sanalar keys bankidan; boshqa raqam (foydalanuvchilar soni, keyingi yillar bahosi) qo'shmang. Uzum'ning keyingi qadami bankda yo'q — «keyin?» nuqtasi bo'sh qoladi, uni taxmin qilib to'ldirmang.", ru: "«Стоимость» — сколько стоит компания. Числа и даты — из банка кейсов; другие числа (число пользователей, стоимость в следующие годы) не добавляйте. Следующего шага Uzum в банке нет — точка «дальше?» остаётся пустой, не заполняйте её догадкой." })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — KEYINGI QADAM (QTushuncha: «kengaygan» chiziq · uch karta → «Keyin»; atama to'g'ri kartadan keyin, T-011) =====
const KEYIN_KARTALAR = [
  { id: 'kop', t: { uz: "Ko'proq narsa o'rganib, keyin «Maydon»ni yaxshilash", ru: "Больше узнать, а потом улучшить «Maydon»" }, b: { bitta: true, aniq: false, osadi: true }, x: { uz: 'Qaysi ish qilinadi — aniq yozilmagan.', ru: "Какая именно работа — не написано." } },
  { id: 'ikki', t: { uz: "Jamoa yig'ish va eslatmani birga qo'shish", ru: "Добавить сбор команды и напоминание вместе" }, b: { bitta: false, aniq: true, osadi: true }, x: { uz: 'Bu ikki ish — qaysi biri birinchi?', ru: "Это две работы — какая первая?" } },
  { id: 'jamoa', t: KEYIN_MENTOR.t, b: { bitta: true, aniq: true, osadi: true } }
];
const S7_IPUCHA = { uz: "Har kartani «Keyin» ostidagi uch yorliq bilan solishtiring.", ru: "Сравните каждую карточку с тремя ярлыками под «Дальше»." };
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [tanlov, setTanlov] = useState(null);
  const [tushdi, setTushdi] = useState(() => (storedAnswer || isMentor ? 'jamoa' : null));
  const [qadam, setQadam] = useState(() => (storedAnswer || isMentor ? 3 : 0));
  const [xato, setXato] = useState(null);
  const uch = useUchish();
  const karta = KEYIN_KARTALAR.find(k => k.id === tushdi);
  const done = !!karta && karta.id === 'jamoa' && qadam >= 3;
  const tugadi = useTugadi(done, 1100, !!storedAnswer || isMentor);
  const ipucha = useIpucha(!done && !tushdi && !isMentor, `${xato ? xato.id : ''}-${tanlov}`, 40000);
  useEffect(() => {
    if (!tushdi || qadam >= 3) return undefined;
    const t = setTimeout(() => setQadam(n => n + 1), kamHarakat() ? 0 : 380);
    return () => clearTimeout(t);
  }, [tushdi, qadam]);
  useEffect(() => {
    if (!karta || qadam < 3 || karta.id === 'jamoa') return undefined;
    const t = setTimeout(() => { uch(document.querySelector('.lesson-root [data-uch="keyin-k"]'), `kk-${karta.id}`, 480); setXato(karta); setTushdi(null); setQadam(0); }, 1100);
    return () => clearTimeout(t);
  }, [karta, qadam]);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'keyin', screenIdx: screen, correct: true, picked: true, solved: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'keyin', 0, true, 0);
  }, [done]); // eslint-disable-line
  const qoy = (id, el) => {
    const k = id || tanlov;
    if (!k || tushdi || isMentor) return;
    uch(el || document.querySelector(`.lesson-root [data-uch="kk-${k}"]`), 'keyin-k', 560);
    setTushdi(k); setQadam(0); setTanlov(null); setXato(null);
  };
  // Telefonda (CSS @media 640 bilan bir xil) egri chiziq ustun matnlarini kesib o'tadi — o'rniga manba yozuvi rangda va «Keyin» ostida dalil qatori
  const tor = useIsMobile(641);
  const [manbaM, manbaJ] = KEYIN_MENTOR.dan.slice(1).split('-').map(Number);
  const nuqtalar = CHIZIQ.map(c => ({
    k: `m${c.modul}`, modul: c.modul, holat: c.nom ? 'nom' : 'bosh', mentor: c.mentor, karta: false,
    yorliq: c.mentor ? mYorliq({ modul: c.modul, yorliq: c.nom }) : String(c.modul),
    pastki: MAYDON_PASTKI[c.modul] ? MAYDON_PASTKI[c.modul].map(tr) : undefined,
    manba: done && tor && c.modul === manbaM ? manbaJ : undefined
  }));
  const keyin = {
    holat: done ? 'toliq' : tushdi ? 'joriy' : 'bosh', katta: true, kutadi: !!tanlov && !tushdi, katak: !done,
    t: karta ? tr(karta.t) : null, onBos: tanlov && !tushdi ? () => qoy() : undefined,
    belgilar: BELGILAR.map((b, i) => ({ t: tr(b.t), h: karta && qadam > i ? (karta.b[b.k] ? 'ok' : 'err') : undefined })),
    dalil: done && tor ? { manba: tr(MAYDON_PASTKI[manbaM][manbaJ]), t: tr(KEYIN_MENTOR.yorliq) } : null
  };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · keyingi qadam', ru: "Понятие · следующий шаг" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Kartani «Keyin»ga qo'ying", ru: "Положите карточку в «Дальше»" })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng tugadi={tugadi}
        sarlavha={tr({ uz: <>«Maydon» chizig'ining <A>davomiga</A> nima yoziladi?</>, ru: <>Что пишется в <A>продолжение</A> линии «Maydon»?</> })}
        mentor={<Mentor>{tr({ uz: "Chiziq ikki savolga javob beradi: nima bo'ldi va keyin nima. Kartalardan bittasini «Keyin»ga qo'ying.", ru: "Линия отвечает на два вопроса: что было и что дальше. Положите одну из карточек в «Дальше»." })}</Mentor>}
        vizual={<YilChizigi tur="kengaygan" qavs nuqtalar={nuqtalar} keyin={keyin} bog={done && !tor ? [{ dan: KEYIN_MENTOR.dan, gacha: 'keyin-k', chap: true, tur: 'egri', yorliq: tr(KEYIN_MENTOR.yorliq) }] : []}
          pastida={!done && <div className="yp-s7-h">
            <div className="yp-kk-ro">
              {KEYIN_KARTALAR.map((k, i) => (
                <button type="button" key={k.id} data-uch={`kk-${k.id}`} style={{ '--j': i }} className={cxx('yp-kk', tanlov === k.id && 'on', tushdi === k.id && 'ketdi', !tanlov && !tushdi && !xato && 'chorla')} disabled={!!tushdi || isMentor} draggable={!tushdi && !isMentor}
                  onDragStart={(e) => { try { e.dataTransfer.setData('text/plain', k.id); } catch { /* bosish yetadi */ } setTanlov(k.id); }}
                  onClick={(e) => qoy(k.id, e.currentTarget)}><span>{tr(k.t)}</span><i className="yp-kk-uq" aria-hidden="true" /></button>
              ))}
            </div>
            {xato && <QXato>{tr(xato.x)}</QXato>}
            {!xato && ipucha && <QIzoh>{tr(S7_IPUCHA)}</QIzoh>}
          </div>} />}
        natija={done && <div className="yp-s7-n">
          <QIzoh>{tr({ uz: "Vaqt chizig'idan o'sadigan bitta aniq ish keyingi qadam deyiladi.", ru: "Одна конкретная работа, которая вырастает из линии времени, называется следующим шагом." })}</QIzoh>
          <p className="yp-kulrang">{tr({ uz: "«Chiziqdan o'sadi» — oldingi loyiha, kuzatuv, raqam yoki tugallanmagan ishdan kelib chiqadi.", ru: "«Растёт из линии» — значит, вытекает из прошлого проекта, наблюдения, числа или незаконченной работы." })}</p>
        </div>}
        xulosa={done && tr({ uz: "Bu misolda Mentor jamoa yig'ishni tanladi; suhbatdagi «2 / 5» — shu qarorning dalillaridan biri.", ru: "В этом примере Ментор выбрал сбор команды; «2 / 5» из разговоров — одно из доказательств этого решения." })}
      />
      <MentorNote>{tr({ uz: "Birinchi Demo Day nutqining oxirgi bo'lagi ham «Keyingi qadam» edi — eslating. To'lov, eslatma va jamoa yig'ish — uchalasi o'tgan moduldagi MVP'ning «Keyin» ro'yxatidan; bittasi tanlanadi: suhbatlarda jamoa — 2 / 5, pul — 1 / 5, eslatma — 0. Son — dalil, avtomatik tanlov emas. Sinfdan so'rang: «Keyin»ga «hammasini yaxshilash» yozilsa, ertaga nimadan boshlaysiz?", ru: "Последняя часть первой речи на Demo Day тоже была «Следующий шаг» — напомните. Оплата, напоминание и сбор команды — все три из списка «Потом» MVP прошлого модуля; выбирается один: в разговорах команда — 2 / 5, деньги — 1 / 5, напоминание — 0. Число — доказательство, а не автоматический выбор. Спросите класс: если в «Дальше» написать «улучшить всё», с чего начнёте завтра?" })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 8 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s8 = 0, ✔ A; ikkinchi olam — darslik almashish boti, P-002) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · keyingi qadam', ru: "Проверка · следующий шаг" })}
    questionText="Darslik almashish botida odamlar kerakli darslikni topolmadi. Keyingi qadam qaysi?"
    question={tr({ uz: <h2 className="title h-ask">Darslik almashish botida odamlar kerakli darslikni topolmadi. <A>Keyingi qadam</A> qaysi?</h2>, ru: <h2 className="title h-ask">В боте обмена учебниками люди не нашли нужный учебник. Какой <A>следующий шаг</A>?</h2> })}
    options={[
      { uz: 'Botga darslikni nomidan qidirishni qo\'shish', ru: "Добавить в бота поиск учебника по названию" },
      { uz: "Dasturlashni har kuni ko'proq o'rganib borish", ru: "Каждый день больше изучать программирование" },
      { uz: "Botga sayt, mobil ilova va chatni birdan qo'shish", ru: "Сразу добавить к боту сайт, приложение и чат" },
      { uz: 'Bir kun katta IT kompaniyasida ishlay boshlash', ru: "Однажды начать работать в большой IT-компании" }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Bu bitta aniq ish va u odamlar topolmagan narsadan o'sadi.", ru: "Это одна конкретная работа, и она растёт из того, что люди не нашли." }}
    explainWrong={{
      1: { uz: 'Bu niyat — qaysi ish qilinishi aniq emas.', ru: "Это намерение — неясно, какая работа будет сделана." },
      2: { uz: 'Uchta ish birdan — qaysi biri birinchi?', ru: "Три работы сразу — какая первая?" },
      3: { uz: "Bu orzu — botdagi muammodan o'smaydi.", ru: "Это мечта — она не растёт из проблемы бота." },
      default: { uz: "Uch belgini eslang: bitta, aniq, chiziqdan o'sadi.", ru: "Вспомните три признака: одно, конкретное, растёт из линии." }
    }} />
);

// ===== TEKSHIRUV FUNKSIYALARI (9, 10-ekran; PM-108 — taxmin, hukm emas: matnlar «… o'xshaydi»). node sinovi: scratchpad 10-qurish/tekshiruv-sinov.mjs =====
// TEKSHIRUV-BOSHI
const normYoz = (s) => String(s || '').toLowerCase().replace(/[\u02BB\u02BC\u2018\u2019`]/g, "'").replace(/[\u00AB\u00BB"\u201C\u201D]/g, '').replace(/\s+/g, ' ').trim();
const sozRo = (s) => normYoz(s).split(/[^a-z\u0400-\u04FF0-9']+/).map(w => w.replace(/^'+|'+$/g, '')).filter(Boolean);
const TAKROR_OXIR = /^(qurdim|qildim|bitirdim|построил|построила|сделал|сделала|закончил|закончила)$/; // ru rejimida o'quvchi ruscha yozadi
const FIKR_SOZ = /^(yoqdi|qiziq|chiroyli|maqtadi|понрав|интересн|красив|хвалил)/;
// 9-ekran: «Qurdim» (nom) va «O'rgandim» (nima). Natija: null — o'tdi; { kod, blok } — blok: bloklaydi, aks holda yo'naltiradi
const tekshirOrgandim = (nom, nima) => {
  const n = normYoz(nom), m = normYoz(nima);
  if (!n) return { kod: 'nom', blok: true };
  if (!m) return { kod: 'bosh', blok: true };
  const ns = sozRo(n).filter(w => w.length >= 3);
  const ms = sozRo(m);
  const nomdan = ms.some(w => ns.some(x => w.startsWith(x)));
  if (ms.some(w => FIKR_SOZ.test(w))) return { kod: 'fikr', blok: false };
  if ((nomdan && ms.length < 4) || TAKROR_OXIR.test(ms[ms.length - 1] || '')) return { kod: 'takror', blok: false };
  if (m.length <= 10) return { kod: 'qisqa', blok: false };
  return null;
};
const MAVHUM_SOZ = /^(ko'proq|yaxshila|rivojlantir|o'rganaman|больше|лучше|улучш|развив|научус|изучу)/;
const TOLDIRUVCHI = ['и', 'буду', 'хочу', 'стану', 'потом', 'ещё', 'еще', 'что-то', 'всё', 'все', 'проект', 'проекта', 'сайт', 'сайта', 'бот', 'бота', 'приложение', 'код', 'много', 'с', 'для', 'хорошо', 'я', 'сам', 'сама', 'работу', 'программирование', 'va', 'keyin', 'yana', 'narsa', 'narsani', 'narsalarni', 'hamma', 'hammasini', 'loyiha', 'loyihani', 'loyihamni', 'sayt', 'saytni', 'saytimni', 'bot', 'botni', 'ilova', 'ilovani', 'kod', 'kodni', "ko'p", 'bilan', 'uchun', 'yaxshi', 'yaxshiroq', 'men', "o'zim", 'ish', 'ishni', 'dasturlash', 'dasturlashni'];
const FEL = /(sh|moq|man|miz|ib|adi|ть|ться|ю|ем|им)$/;
// 10-ekran: «Keyin» matni va tanlangan loyiha (modul raqami yoki null)
const tekshirKeyin = (matn, modul) => {
  const m = normYoz(matn);
  if (!m) return { kod: 'bosh', blok: true };
  if (modul == null) return { kod: 'tanla', blok: true };
  if (m.length <= 12) return { kod: 'qisqa', blok: false };
  const ms = sozRo(m);
  const bolak = m.split(/[,;]/).map(x => x.trim()).filter(Boolean);
  const felli = m.split(/ va | и /).filter(p => sozRo(p).some(w => w.length >= 4 && FEL.test(w))).length;
  if (bolak.length >= 3 || felli >= 2) return { kod: 'kop', blok: false };
  const qolgan = ms.filter(w => !MAVHUM_SOZ.test(w) && !TOLDIRUVCHI.includes(w) && !FEL.test(w));
  if (ms.some(w => MAVHUM_SOZ.test(w)) && qolgan.length === 0) return { kod: 'mavhum', blok: false };
  return null;
};
// TEKSHIRUV-OXIRI

// ===== SCREEN 9 — MUSTAQIL ISH (QMustaqil, USTAXONA 1): «qadam» chiziq + bitta katta karta (SABOQ 29) · artefakt pm-m8d10-yol · nishon timelineBuilder =====
const XABAR9 = {
  nom: { uz: 'Loyiha nomini yozing.', ru: "Напишите название проекта." },
  bosh: { uz: "Bu loyihada nimani o'rgandingiz? Bitta gap yozing.", ru: "Чему вы научились в этом проекте? Напишите одну фразу." },
  takror: { uz: "Nomni takrorlayotganga o'xshaydi — nima qila olasiz?", ru: "Похоже на повтор названия — что вы умеете?" },
  fikr: { uz: "Bu fikrga o'xshaydi — endi nima qila olasiz?", ru: "Похоже на мнение — что вы теперь умеете?" },
  qisqa: { uz: 'Juda qisqa: aniq nimani qila olasiz?', ru: "Слишком коротко: что именно вы умеете?" }
};
const QOLDIR9 = { uz: "Shunday qoldirsangiz — yana «Chiziqqa yozish»ni bosing.", ru: "Если оставить так — снова нажмите «Записать на линию»." };
const YOZISH = { uz: 'Chiziqqa yozish', ru: "Записать на линию" };
const YORDAM = { uz: 'Yordam', ru: "Подсказка" };
const boshYol = () => CHIZIQ.map(c => ({ modul: c.modul, nom: c.nom ? tr(c.nom) : '', nima: '', holat: c.nom ? 'bosh' : 'otkaz' }));
const yolLsdan = () => {
  const s = lsGet(YOL_KEY);
  if (!s || !Array.isArray(s.loyihalar) || !s.loyihalar.length) return null;
  return boshYol().map(y => { const l = s.loyihalar.find(x => x.modul === y.modul); return l ? { ...y, nom: l.nom, nima: l.nima, holat: 'toliq' } : y; });
};
const yolSaqla = (yol) => { const s = lsGet(YOL_KEY) || {}; lsSet(YOL_KEY, { ...s, loyihalar: yol.filter(y => y.holat === 'toliq').map(({ modul, nom, nima }) => ({ modul, nom, nima })), keyin: s.keyin || '', keyinModul: s.keyinModul ?? null, savedAt: Date.now() }); };
const MaydonInput = ({ value, onChange, placeholder, xato, kopQator, onEnter }) => {
  const ref = useRef(null);
  useLayoutEffect(() => { const el = ref.current; if (!el || !kopQator) return; el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 112)}px`; }, [value, kopQator]);
  return <textarea ref={ref} rows={1} value={value} placeholder={placeholder} className={cxx('yp-kirit', xato && 'err')} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (onEnter) onEnter(); } }} />;
};
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [yol, setYol] = useState(() => storedAnswer?.yol || yolLsdan() || boshYol());
  const boshJoriy = (y) => y.findIndex(v => v.holat === 'bosh');
  const [joriy, setJoriy] = useState(() => (isMentor ? 8 : boshJoriy(yol)));
  const [qor, setQor] = useState(() => { const i = boshJoriy(yol); return i >= 0 ? { nom: yol[i].nom, nima: yol[i].nima } : { nom: '', nima: '' }; });
  const [ogoh, setOgoh] = useState(null);
  const [yordam, setYordam] = useState(false);
  const ozgardi = useRef(false);
  const yuborildi = useRef(!!storedAnswer?.solved);
  const nomRef = useRef(null);
  const uch = useUchish();
  const soni = yol.filter(y => y.holat === 'toliq').length;
  const jami = yol.filter(y => y.holat !== 'otkaz').length;
  const tayyor = soni >= 5;
  useEffect(() => {
    if (!ozgardi.current) return;
    yolSaqla(yol);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, yol, soni, picked: true, solved: tayyor, correct: tayyor });
    if (tayyor && !yuborildi.current && live && live.mode === 'student') { yuborildi.current = true; live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
  }, [yol]); // eslint-disable-line
  const och = (i, y = yol) => { setJoriy(i); setOgoh(null); setYordam(false); setQor(i >= 0 ? { nom: y[i].nom, nima: y[i].nima } : { nom: '', nima: '' }); };
  const keyingisi = (y, dan) => { const n = y.length; for (let s = 1; s <= n; s++) { const i = (dan + s) % n; if (y[i].holat === 'bosh') return i; } return -1; };
  const ozgartir = (yangi) => { ozgardi.current = true; setYol(yangi); och(keyingisi(yangi, joriy), yangi); };
  const yoz = () => {
    if (joriy < 0) return;
    const r = tekshirOrgandim(qor.nom, qor.nima);
    if (r && (r.blok || !ogoh || ogoh.kod !== r.kod)) { setOgoh({ ...r, k: Date.now() }); return; }
    uch(nomRef.current, `q-m${yol[joriy].modul}`, 640);
    ozgartir(yol.map((v, i) => (i === joriy ? { ...v, nom: qor.nom.trim(), nima: qor.nima.trim(), holat: 'toliq' } : v)));
  };
  const otkaz = () => { if (joriy < 0) return; ozgartir(yol.map((v, i) => (i === joriy ? { ...v, nom: '', nima: '', holat: 'otkaz' } : v))); };
  const qosh = (i) => { ozgardi.current = true; const y = yol.map((v, j) => (j === i ? { ...v, holat: 'bosh' } : v)); setYol(y); och(i, y); };
  const mentorYol = CHIZIQ.map(c => ({ modul: c.modul, nom: c.nom ? tr(c.nom) : '', nima: c.nima ? tr(c.nima) : '', holat: c.nom ? 'toliq' : 'otkaz' }));
  const korYol = isMentor ? mentorYol : yol;
  // SABOQ 29: tepada ixcham chiziq (holat belgisi bilan), bir vaqtda bitta katta karta; uzun matn chiziqda qisqartiriladi (…)
  const nuqtalar = korYol.map((y, i) => {
    const j = i === joriy;
    return {
      k: `m${y.modul}`, modul: y.modul, joriy: j, holat: y.holat === 'toliq' ? 'toliq' : y.holat === 'otkaz' ? 'otkaz' : 'bosh',
      nom: (j && !isMentor ? qor.nom : y.nom) || '', onBos: j ? undefined : () => (isMentor ? setJoriy(i) : och(i))
    };
  });
  const jy = joriy >= 0 ? korYol[joriy] : null;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: "Самостоятельная работа" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tayyor && !isMentor} label={tayyor || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Chiziqni to'ldiring", ru: "Заполните линию" })} (${soni} / ${jami})`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>O'z loyihalaringizni <A>chiziqqa</A> qo'ying.</>, ru: <>Поставьте свои проекты <A>на линию</A>.</> })}
        mentor={<Mentor>{tr({ uz: "Kursdagi nomlar oldindan yozilgan — o'zingiz qurganingizga almashtiring. Har biriga «O'rgandim»ni yozing.", ru: "Названия курса уже вписаны — замените их на то, что построили сами. Для каждого заполните «Умею»." })}</Mentor>}
        qadamlar={<Zoomable><YilChizigi tur="qadam" nuqtalar={nuqtalar} keyin={{ holat: 'bosh' }} /></Zoomable>}
        forma={<>
          {jy && <div className={cxx('yp-forma', 'yp-f9', ogoh && 'xato')} key={joriy}>
            <span className="yp-forma-h">{mYorliq(CHIZIQ[joriy])}</span>
            {isMentor ? (
              <div className="yp-f9-ro"><span className="yc-q"><b>{tr(YC.qurdim)}:</b> {jy.nom || tr(YC.otkaz)}</span>{jy.nima && <span className="yc-q"><b>{tr(YC.organdim)}:</b> {jy.nima}</span>}</div>
            ) : jy.holat === 'otkaz' ? (
              <div className="yp-f9-otk"><em className="ycq-otk">{tr(YC.otkaz)}</em><QTugma ikkinchi onClick={() => qosh(joriy)}>{tr({ uz: "Qo'shish", ru: "Добавить" })}</QTugma></div>
            ) : (<>
              <div className="yp-f9-ro">
                <label className="yp-mayd" ref={nomRef}><span>{tr(YC.qurdim)}</span><MaydonInput value={qor.nom} placeholder={tr({ uz: 'Loyiha nomi', ru: "Название проекта" })} xato={ogoh && ogoh.kod === 'nom'} onChange={(v) => setQor(q => ({ ...q, nom: v }))} onEnter={yoz} /></label>
                <label className="yp-mayd"><span>{tr(YC.organdim)}</span><MaydonInput kopQator value={qor.nima} placeholder={tr({ uz: 'Endi nima qila olasiz?', ru: "Что вы теперь умеете?" })} xato={ogoh && ogoh.kod !== 'nom'} onChange={(v) => setQor(q => ({ ...q, nima: v }))} onEnter={yoz} /></label>
              </div>
              {ogoh && <QXato key={ogoh.k}>{tr(XABAR9[ogoh.kod])}</QXato>}
              {ogoh && !ogoh.blok && <p className="yp-kulrang">{tr(QOLDIR9)}</p>}
              <div className="yp-forma-t">
                <QTugma ikkinchi onClick={otkaz}>{tr({ uz: 'Bu modulda loyiha qurmadim', ru: "В этом модуле я не строил(а) проект" })}</QTugma>
                <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma>
                <QTugma className="yp-bos" onClick={yoz}>{tr(YOZISH)}</QTugma>
              </div>
              {yordam && <QIzoh>{tr({ uz: "Eslay olmasangiz, portfolio saytingiz va GitHub'dagi repo'laringizga qarang. Ichingizda «Endi … qila olaman» deb ayting va o'rtasini yozing.", ru: "Если не помните, посмотрите на свой сайт-портфолио и репозитории на GitHub. Скажите про себя «Теперь я умею …» и напишите середину." })}</QIzoh>}
            </>)}
            {!isMentor && <p className="yp-kulrang">{tr({ uz: "Qurmagan loyiha yozilmaydi — bunday modulni «o'tkazildi» deb belgilaysiz.", ru: "Проект, который вы не строили, не пишется — такой модуль отметьте как «пропущено»." })}</p>}
          </div>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} label={{ uz: "Chiziqni to'ldirganlar (5+)", ru: "Заполнили линию (5+)" }} />}
        </>}
      >
        {tayyor && !isMentor && <QXulosa>{tr({ uz: `Vaqt chizig'ingizda ${soni} ta loyiha bor: har birida nima o'rganganingiz yozilgan.`, ru: `На вашей линии времени ${soni} проектов: в каждом написано, чему вы научились.` })}</QXulosa>}
        <MentorNote>{tr({ uz: "Eng ko'p xato — «O'rgandim»ga loyiha nomini qayta yozish («AvtoIjara qildim»). «Shu loyihadan keyin nima qila oladigan bo'ldingiz?» deb so'rang. Kursdagi nom o'quvchiniki bo'lmasa (o'z g'oyasini qurgan bo'lsa) — o'zinikini yozadi. 5 tadan kam yozgan o'quvchi uyda to'ldiradi.", ru: "Самая частая ошибка — снова писать в «Умею» название проекта («Сделал(а) AvtoIjara»). Спросите: «Что вы стали уметь после этого проекта?» Если название из курса не его (строил свою идею) — пишет своё. Кто написал меньше 5, дополняет дома." })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — JUFTLIKDA ISH (QMustaqil, USTAXONA 2): aytib berish (taymer) → «Keyin» + «Qaysi loyihadan o'sadi?» · artefakt keyin, keyinModul · nishon nextStep =====
const XABAR10 = {
  bosh: { uz: 'Keyingi qadamni yozing.', ru: "Напишите следующий шаг." },
  tanla: { uz: "Keyingi qadam qaysi loyihadan o'sadi? Bittasini tanlang.", ru: "Из какого проекта растёт следующий шаг? Выберите один." },
  qisqa: { uz: 'Juda qisqa: aniq nima qilasiz?', ru: "Слишком коротко: что именно сделаете?" },
  kop: { uz: "Bir nechta ishga o'xshaydi — birinchisini qoldiring.", ru: "Похоже на несколько работ — оставьте первую." },
  mavhum: { uz: 'Aniqroq: qayerda va nima qilasiz?', ru: "Конкретнее: где и что сделаете?" }
};
// Katta aylana taymer (bitta tugma): halqa soniya sari qisqaradi, o'rtada katta son
const TAYMER_R = 52;
function Taymer({ soniya, yakka, onTugadi }) {
  const [st, setSt] = useState({ yur: false, qoldi: soniya, bitdi: false });
  useEffect(() => {
    if (!st.yur) return undefined;
    if (st.qoldi <= 0) { setSt({ yur: false, qoldi: 0, bitdi: true }); if (onTugadi) onTugadi(); return undefined; }
    const t = setTimeout(() => setSt(p => ({ ...p, qoldi: p.qoldi - 1 })), 1000);
    return () => clearTimeout(t);
  }, [st.yur, st.qoldi]); // eslint-disable-line
  const ulush = st.yur ? st.qoldi / soniya : (st.bitdi ? 0 : 1);
  const C = 2 * Math.PI * TAYMER_R;
  const L = yakka
    ? { bosh: { uz: '30 soniyani boshlash', ru: "Запустить 30 секунд" }, yana: { uz: '↻ Yana 30 soniya', ru: "↻ Ещё 30 секунд" } }
    : { bosh: { uz: '1 daqiqani boshlash', ru: "Запустить 1 минуту" }, yana: { uz: '↻ Yana 1 daqiqa', ru: "↻ Ещё 1 минута" } };
  return (
    <div className={cxx('yp-taymer', st.yur && 'yur')}>
      <div className="yp-taymer-h">
        <svg viewBox="0 0 120 120" aria-hidden="true"><circle className="f" cx="60" cy="60" r={TAYMER_R} /><circle className="o" cx="60" cy="60" r={TAYMER_R} style={{ strokeDasharray: C, strokeDashoffset: C * (1 - ulush) }} /></svg>
        <span className="yp-taymer-s">{Math.floor(st.qoldi / 60)}:{String(st.qoldi % 60).padStart(2, '0')}</span>
      </div>
      {st.yur
        ? <QTugma ikkinchi onClick={() => { setSt({ yur: false, qoldi: soniya, bitdi: true }); if (onTugadi) onTugadi(); }}>{tr({ uz: "To'xtatish", ru: "Остановить" })}</QTugma>
        : <QTugma className={!st.bitdi ? 'yp-bos' : undefined} ikkinchi={st.bitdi} onClick={() => setSt({ yur: true, qoldi: soniya, bitdi: false })}>{tr(st.bitdi ? L.yana : L.bosh)}</QTugma>}
    </div>
  );
}
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const yakka = yakkaMi(live);
  const s = lsGet(YOL_KEY) || {};
  const ozi = Array.isArray(s.loyihalar) && s.loyihalar.length > 0;
  const manba = CHIZIQ.map(c => {
    const l = ozi ? s.loyihalar.find(x => x.modul === c.modul) : null;
    const nom = ozi ? (l ? l.nom : '') : (c.nom ? tr(c.nom) : '');
    return { modul: c.modul, nom, bor: !!nom };
  });
  const [qadam, setQadam] = useState(() => (storedAnswer || isMentor ? 1 : 0));
  const [matn, setMatn] = useState(() => storedAnswer?.keyin ?? (s.keyin || ''));
  const [modul, setModul] = useState(() => storedAnswer?.keyinModul ?? (s.keyinModul ?? null));
  const [ogoh, setOgoh] = useState(null);
  const [saqlandi, setSaqlandi] = useState(() => storedAnswer?.belgilar || null);
  const [yordam, setYordam] = useState(false);
  const kRef = useRef(null);
  const uch = useUchish();
  const yoz = () => {
    const r = tekshirKeyin(matn, modul);
    if (r && (r.blok || !ogoh || ogoh.kod !== r.kod)) { setOgoh({ ...r, k: Date.now() }); return; }
    const belgilar = { bitta: !(r && r.kod === 'kop'), aniq: !(r && (r.kod === 'mavhum' || r.kod === 'qisqa')), osadi: true };
    const toza = !r;
    const eski = lsGet(YOL_KEY) || {};
    lsSet(YOL_KEY, { loyihalar: eski.loyihalar || [], ...eski, keyin: matn.trim(), keyinModul: modul, savedAt: Date.now() });
    uch(kRef.current, 'q-keyin', 620);
    setSaqlandi(belgilar); setOgoh(null);
    onAnswer(screen, { stage: 'juftlik', screenIdx: screen, keyin: matn.trim(), keyinModul: modul, belgilar, picked: true, solved: true, correct: toza || !!storedAnswer?.correct });
    if (live && live.mode === 'student' && !storedAnswer) live.submitAnswer(PRACTICE_BASE + screen, 'juftlik', 0, true, 0);
  };
  // O'quvchi chizig'i toza: to'ldirilgani — nomli doira, o'tkazilgani — kulrang «o'tkazildi» chip (SABOQ 28: yoy yo'q)
  const nuqtalar = manba.map(m => ({ k: `m${m.modul}`, modul: m.modul, nom: m.nom, holat: m.bor ? 'nom' : 'otkaz', tanlangan: modul === m.modul }));
  const keyin = { holat: saqlandi ? 'toliq' : 'joriy', t: saqlandi ? matn.trim() : null };
  const QADAM = [yakka ? tr({ uz: "Chizig'ingizni ovoz chiqarib aytib bering (30 soniya)", ru: "Расскажите свою линию вслух (30 секунд)" }) : tr({ uz: 'Sherigingizga aytib bering', ru: "Расскажите партнёру" }), tr({ uz: '«Keyin»ni yozing', ru: "Напишите «Дальше»" })];
  const qi = saqlandi ? 1 : qadam;
  return (
    <Stage eyebrow={tr({ uz: 'Juftlikda ish', ru: "Работа в паре" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!saqlandi && !isMentor} label={saqlandi || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "«Keyin»ni yozing", ru: "Напишите «Дальше»" })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Sherigingiz <A>«Keyin nima?»</A> desa, nima deysiz?</>, ru: <>Что вы скажете, если партнёр спросит <A>«Что дальше?»</A></> })}
        mentor={<Mentor>{tr({ uz: "Chizig'ingizni sherigingizga birinchi loyihadan boshlab aytib bering, keyin o'rin almashing. Javobingizni «Keyin»ga yozing.", ru: "Расскажите партнёру свою линию, начиная с первого проекта, потом поменяйтесь. Запишите ответ в «Дальше»." })}</Mentor>}
        qadamlar={<Zoomable><YilChizigi tur="qadam" qavs={!!saqlandi} nuqtalar={nuqtalar} keyin={keyin} bog={saqlandi && modul != null ? [{ dan: `m${modul}`, gacha: 'keyin', tur: 'tirsak' }] : []} /></Zoomable>}
        forma={<>
          {/* Bir vaqtda bitta qadam katta: sarlavhada qadam raqami, ikkinchisi ko'rinmaydi */}
          <div className={cxx('yp-forma', 'yp-q10', ogoh && 'xato', saqlandi && 'saq')} key={saqlandi ? 's' : qi}>
            <div className="yp-q10-bosh"><i className={cxx('yp-q10-n', saqlandi && 'ok')}>{saqlandi ? '✓' : qi + 1}</i><span>{QADAM[qi]}</span><em>{qi + 1} / 2</em></div>
            {qi === 0 && !isMentor && <Taymer soniya={yakka ? 30 : 60} yakka={yakka} onTugadi={() => setQadam(1)} />}
            {qi === 1 && !saqlandi && <>
              <label className="yp-mayd" ref={kRef}><span>{tr(YC.keyin)}<span className="yp-bel">{BELGILAR.map(b => <em key={b.k}>{tr(b.t)}</em>)}</span></span><MaydonInput kopQator value={matn} placeholder={tr({ uz: 'Bitta aniq ish: nima qilasiz?', ru: "Одна конкретная работа: что сделаете?" })} xato={ogoh && ogoh.kod !== 'tanla'} onChange={setMatn} onEnter={yoz} /></label>
              <span className="yp-forma-s">{tr({ uz: "Qaysi loyihadan o'sadi?", ru: "Из какого проекта растёт?" })}</span>
              <div className="yp-chip-ro yp-q10-ch">{manba.filter(m => m.bor).map(m => <QChip key={m.modul} title={m.nom} holat={modul === m.modul ? 'on' : undefined} className={ogoh && ogoh.kod === 'tanla' ? 'yp-chorla' : undefined} onClick={() => { setModul(m.modul); if (ogoh && ogoh.kod === 'tanla') setOgoh(null); }}><i>{m.modul}</i><span>{m.nom}</span></QChip>)}</div>
              {ogoh && <QXato key={ogoh.k}>{tr(XABAR10[ogoh.kod])}</QXato>}
              {ogoh && !ogoh.blok && <p className="yp-kulrang">{tr(QOLDIR9)}</p>}
              <div className="yp-forma-t">
                <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma>
                <QTugma className="yp-bos" onClick={yoz}>{tr(YOZISH)}</QTugma>
              </div>
              {yordam && <QIzoh>{tr({ uz: "Oxirgi loyihangizga qarang: odamlar nimadan qiynaldi yoki nima so'radi? Keyingi qadam shundan o'sadi.", ru: "Посмотрите на свой последний проект: с чем людям было трудно или что они просили? Следующий шаг растёт из этого." })}</QIzoh>}
            </>}
            {saqlandi && <>
              <p className="yp-q10-k"><b>{tr(YC.keyin)}:</b> {matn.trim()}</p>
              <span className="yp-bel">{BELGILAR.map((b, j) => <em key={b.k} className={saqlandi[b.k] ? 'ok' : undefined} style={{ '--j': j }}>{saqlandi[b.k] ? '✓ ' : ''}{tr(b.t)}</em>)}</span>
              {!isMentor && <div className="yp-saq"><QTugma ikkinchi onClick={() => setSaqlandi(null)}>{tr({ uz: 'Tahrirlash', ru: "Изменить" })}</QTugma></div>}
            </>}
          </div>
          {isMentor && <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Keyingi qadamni yozganlar', ru: "Написали следующий шаг" }} />}
        </>}
      >
        {saqlandi && <QXulosa>{tr({ uz: "Chizig'ingiz to'liq: nima bo'ldi va keyin nima.", ru: "Ваша линия полная: что было и что дальше." })}</QXulosa>}
        <MentorNote>{tr({ uz: "Taymerni siz boshqaring — 1 daqiqadan keyin «O'rin almashing» deng. Sherik «Keyin nima?» deb so'raganda javob bitta ish bo'lsin; «hammasini» desa — «Ertaga nimadan boshlaysiz?» deb so'rang. Bu bir daqiqalik aytib berish — 11-darsdagi besh daqiqalik pitchga tayyorgarlik (o'quvchiga aytilmaydi).", ru: "Таймером управляете вы — через 1 минуту скажите «Поменяйтесь». Когда партнёр спрашивает «Что дальше?», ответ — одна работа; если скажет «всё» — спросите «С чего начнёте завтра?». Этот минутный рассказ — подготовка к пятиминутному питчу на 11-м уроке (ученикам этого не говорите)." })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 11 — KOD YOZISH (QKod; darvoza → vazifa → kod oynasi; ma'lumot shakli pm-m8d10-yol.loyihalar bilan bir xil) =====
const KOD_STARTER = {
  uz: `// «Maydon» — vaqt chizig'ining oxirgi qismi (Mentor misoli)
const loyihalar = [
  { modul: 8, nom: "To'liq tizim", nima: "sayt, ilova va botni bitta Backend'ga ulash" },
  { modul: 9, nom: "Maydon", nima: "muammoni odamlardan so'rab topish" },
  { modul: 10, nom: "Maydon prodda", nima: "hodisalarni sanab, gipotezani raqam bilan tekshirish" }
];

function vaqtChizigi(royxat, keyin) {
  // har loyiha uchun: "Maydon (9-modul): muammoni odamlardan so'rab topish"
  // "O'rgandim" bo'sh bo'lsa — "?"; eng oxirida: "Keyin: ..."
  return [];   // shu joyni siz yozasiz
}

console.log(vaqtChizigi(loyihalar, "jamoa yig'ish"));
// [ "To'liq tizim (8-modul): sayt, ilova va botni bitta Backend'ga ulash",
//   "Maydon (9-modul): muammoni odamlardan so'rab topish",
//   "Maydon prodda (10-modul): hodisalarni sanab, gipotezani raqam bilan tekshirish",
//   "Keyin: jamoa yig'ish" ]
console.log(vaqtChizigi([], "birinchi loyiha"));
// [ "Keyin: birinchi loyiha" ]
console.log(vaqtChizigi([{ modul: 7, nom: "Telegram bot", nima: "" }], "qidiruv qo'shish"));
// [ "Telegram bot (7-modul): ?", "Keyin: qidiruv qo'shish" ]
`,
  ru: `// «Maydon» — последняя часть линии времени (пример Ментора)
const loyihalar = [
  { modul: 8, nom: "To'liq tizim", nima: "sayt, ilova va botni bitta Backend'ga ulash" },
  { modul: 9, nom: "Maydon", nima: "muammoni odamlardan so'rab topish" },
  { modul: 10, nom: "Maydon prodda", nima: "hodisalarni sanab, gipotezani raqam bilan tekshirish" }
];

function vaqtChizigi(royxat, keyin) {
  // для каждого проекта: "Maydon (9-modul): muammoni odamlardan so'rab topish"
  // если «Умею» пусто — "?"; в самом конце: "Keyin: ..."
  return [];   // это место пишете вы
}

console.log(vaqtChizigi(loyihalar, "jamoa yig'ish"));
// [ "To'liq tizim (8-modul): sayt, ilova va botni bitta Backend'ga ulash",
//   "Maydon (9-modul): muammoni odamlardan so'rab topish",
//   "Maydon prodda (10-modul): hodisalarni sanab, gipotezani raqam bilan tekshirish",
//   "Keyin: jamoa yig'ish" ]
console.log(vaqtChizigi([], "birinchi loyiha"));
// [ "Keyin: birinchi loyiha" ]
console.log(vaqtChizigi([{ modul: 7, nom: "Telegram bot", nima: "" }], "qidiruv qo'shish"));
// [ "Telegram bot (7-modul): ?", "Keyin: qidiruv qo'shish" ]
`
};
// Shartlar xulq-atvorga bog'langan (for ham, map ham o'tadi); boshlang'ich kod 0/3 (§140-B) — node sinovi: scratchpad 10-qurish/kod-sinov.mjs
const KOD_UCH = `[{modul:8,nom:"To'liq tizim",nima:"sayt, ilova va botni bitta Backend'ga ulash"},{modul:9,nom:"Maydon",nima:"muammoni odamlardan so'rab topish"},{modul:10,nom:"Maydon prodda",nima:"hodisalarni sanab, gipotezani raqam bilan tekshirish"}]`;
const KOD_VAZIFA = [
  { uz: "Har loyiha uchun «Nom (N-modul): o'rgandim» matni qo'shiladi", ru: "Для каждого проекта добавляется текст «Название (N-modul): умею»" },
  { uz: "«O'rgandim» bo'sh bo'lsa, o'rniga «?» qo'yiladi", ru: "Если поле «Умею» пустое, вместо него ставится «?»" },
  { uz: 'Oxirida «Keyin: …» turadi', ru: "В конце стоит «Keyin: …»" }
];
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: "Пишем код" },
  title: { uz: 'app.js — vaqtChizigi funksiyasini yakunlang', ru: "app.js — допишите функцию vaqtChizigi" },
  files: [{ name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: { uz: '// har loyiha uchun matn, oxirida «Keyin»', ru: "// текст для каждого проекта, в конце «Keyin»" } }],
  requirements: [
    { id: 'matn', label: KOD_VAZIFA[0],
      check: C.evalEquals(`JSON.stringify(vaqtChizigi(${KOD_UCH},"jamoa yig'ish"))`, JSON.stringify(["To'liq tizim (8-modul): sayt, ilova va botni bitta Backend'ga ulash", "Maydon (9-modul): muammoni odamlardan so'rab topish", 'Maydon prodda (10-modul): hodisalarni sanab, gipotezani raqam bilan tekshirish', "Keyin: jamoa yig'ish"]), { uz: "Har loyihaga «Nom (N-modul): o'rgandim» matni qo'shilsin.", ru: "Для каждого проекта пусть добавляется текст «Название (N-modul): умею»." }) },
    { id: 'keyin', label: KOD_VAZIFA[2],
      check: C.evalEquals('JSON.stringify(vaqtChizigi([],"birinchi loyiha"))', JSON.stringify(['Keyin: birinchi loyiha']), { uz: "Bo'sh ro'yxatda ham oxirida «Keyin: …» tursin.", ru: "И в пустом списке в конце пусть стоит «Keyin: …»." }) },
    { id: 'savol', label: KOD_VAZIFA[1],
      check: C.evalEquals(`JSON.stringify(vaqtChizigi([{modul:7,nom:"Telegram bot",nima:""}],"qidiruv qo'shish"))`, JSON.stringify(['Telegram bot (7-modul): ?', "Keyin: qidiruv qo'shish"]), { uz: "«O'rgandim» bo'sh bo'lsa, o'rniga «?» qo'ying.", ru: "Если поле «Умею» пустое, поставьте вместо него «?»." }) }
  ]
};
const KOD_DARVOZA = [
  { id: 'birinchi', t: { uz: 'Birinchi loyiha', ru: "Первый проект" }, ok: false, x: { uz: 'Chiziq birinchi loyihadan boshlanadi, tugamaydi.', ru: "Линия начинается с первого проекта, а не заканчивается им." } },
  { id: 'katta', t: { uz: 'Eng katta loyiha', ru: "Самый большой проект" }, ok: false, x: { uz: "Chiziq hajm bo'yicha emas, vaqt bo'yicha turadi.", ru: "Линия стоит не по размеру, а по времени." } },
  { id: 'keyin', t: { uz: 'Keyingi qadam', ru: "Следующий шаг" }, ok: true }
];
// Kod namunasi (o'qish uchun; nusxalanmaydi — PM-082 d): darvozadan keyin `keyin` parametri bir lahza ajraladi
const KodNamuna = ({ ajrat }) => (
  <pre className={cxx('yp-kod', ajrat && 'ajrat')} onCopy={(e) => e.preventDefault()} aria-label="app.js">
    {tr(KOD_STARTER).split('\n').slice(0, 12).map((l, i) => {
      if (l.trim().startsWith('//')) return <span key={i} className="yp-kod-iz">{l}{'\n'}</span>;
      const m = /^(function vaqtChizigi\(royxat, )(keyin)(\) \{)$/.exec(l);
      if (!m) return <span key={i}>{l}{'\n'}</span>;
      return <span key={i}>{m[1]}<b className="yp-kod-k">{m[2]}</b>{m[3]}{'\n'}</span>;
    })}
  </pre>
);
// Natija massivi oldindan (SABOQ 20 — chap karta bo'sh qolmaydi): savoldan oldin to'rt bo'sh katak, oxirgisida «?»;
// to'g'ri javobdan keyin funksiya qaytaradigan qatorlar navbat bilan tushadi (oxirgisi — «Keyin»), kod yechilgach har biri ✓
const NATIJA_QATOR = ["To'liq tizim (8-modul): sayt, ilova va botni bitta Backend'ga ulash", "Maydon (9-modul): muammoni odamlardan so'rab topish", 'Maydon prodda (10-modul): hodisalarni sanab, gipotezani raqam bilan tekshirish', "Keyin: jamoa yig'ish"];
const NatijaKorinish = ({ ochiq, yon }) => (
  <ol className={cxx('yp-nat', ochiq && 'ochiq')}>
    {NATIJA_QATOR.map((q, i) => (
      <li key={i} className={cxx(i === NATIJA_QATOR.length - 1 && 'oxir', yon > i && 'yon')} style={{ '--j': i }}>
        <i className="yp-nat-i" aria-hidden="true">[{i}]</i>
        {yon > i && <b className="yp-nat-ok" aria-hidden="true">✓</b>}
        <span className="yp-nat-t">{ochiq ? q : (i === NATIJA_QATOR.length - 1 ? '?' : '')}</span>
      </li>
    ))}
  </ol>
);
// QKod o'ng ustun propining qolip-nomi («Editor» ma'nosidagi o'zbekcha so'z) til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi —
// u o'quvchi matni emas, qolip API nomi; shuning uchun prop shu doimiy orqali beriladi (9-Modul 1-dars yechimi, MEXANIZM-TAKLIF 10).
const QKOD_ONG = 'muh\u0061rrir';
const Screen11 = ({ screen, storedAnswer, answers, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'keyin' : null));
  const [miss, setMiss] = useState(null);
  const [ajrat, setAjrat] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(() => (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const [yon, setYon] = useState(() => (storedAnswer && storedAnswer.solved ? 4 : 0));
  const stage2 = !!gpick || isMentor || done;
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 2400); return () => clearTimeout(t); }, [ajrat]);
  useEffect(() => { if (!done || yon >= 4) return undefined; const t = setTimeout(() => setYon(n => n + 1), kamHarakat() ? 0 : 380); return () => clearTimeout(t); }, [done, yon]);
  const pickGate = (g) => {
    if (stage2) return;
    if (g.ok) { setGpick(g.id); setMiss(null); setAjrat(true); } else setMiss({ id: g.id, k: Date.now() });
  };
  const finish = ({ codes, code: htmlCode }) => {
    const yangi = (codes && codes['app.js']) || htmlCode || code || tr(KOD_STARTER);
    setOpen(false); setCode(yangi);
    if (!done) {
      setDone(true);
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: yangi, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish', ru: "Пишем код" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Javobni tanlang', ru: "Выберите ответ" }) : tr({ uz: 'Kodni yozing', ru: "Напишите код" })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Chiziqdan portfolio matnini chiqaradigan <A>kod</A> yozamiz.</>, ru: <>Пишем <A>код</A>: из линии — текст портфолио.</> })}
        mentor={<Mentor>{!stage2
          ? tr({ uz: "Loyihalarni qo'lda yozdingiz — endi shu ishni funksiya bajaradi. Ma'lumot — «Maydon» qismidan, natija — portfolio uchun.", ru: "Вы записывали проекты вручную — теперь эту работу сделает функция. Данные — из части «Maydon», результат — для портфолио." })
          : tr({ uz: "Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va nima chiqqanini shu yerda ko'rasiz.", ru: "Нажмите кнопку — откроется окно кода: вы пишете код и сразу видите здесь, что получилось." })}</Mentor>}
        vazifa={<>
          <ChizigimStrip yol={answers && answers[9] && answers[9].yol} />
          <div className="yp-darvoza">
            <span className="yp-darvoza-s">{tr({ uz: 'Natija massivining oxirgi elementi nima bo\'ladi?', ru: "Каким будет последний элемент массива-результата?" })}</span>
            <div className="yp-chip-ro">
              {KOD_DARVOZA.map(g => {
                const silk = miss && miss.id === g.id;
                return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} silk={silk} holat={gpick === g.id ? 'ok' : silk ? 'err' : undefined} disabled={stage2 && gpick !== g.id} className={!stage2 ? 'yp-chorla' : undefined} onClick={() => pickGate(g)}>{tr(g.t)}</QChip>;
              })}
            </div>
            {miss && <QXato>{tr(KOD_DARVOZA.find(g => g.id === miss.id).x)}</QXato>}
            <NatijaKorinish ochiq={stage2} yon={yon} />
          </div>
          {stage2 && <ol className="yp-vazifa">{KOD_VAZIFA.map((v, i) => <li key={i}><i>{i + 1}</i><span>{tr(v)}</span></li>)}</ol>}
        </>}
        yordam={stage2 && <div className="yp-yordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma>
          {yordam && <>
            <QIzoh>{fmtCode(tr({ uz: "Bo'sh massiv oching, loyihalarni `for` bilan aylanib, har biriga matn qo'shing. Sikl tugagach, «Keyin: …» ni qo'shing.", ru: "Создайте пустой массив, пройдите по проектам циклом `for` и добавьте текст для каждого. Когда цикл закончится, добавьте «Keyin: …»." }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: "Eslatma (JavaScript darslaridan): `for` — ro'yxatni birma-bir aylanadi · `if` — shart to'g'ri bo'lsa ishlaydi · `push` — massiv oxiriga qo'shadi · `return` — qiymatni qaytaradi.", ru: "Напоминание (из уроков JavaScript): `for` — проходит список по одному · `if` — срабатывает, если условие верно · `push` — добавляет в конец массива · `return` — возвращает значение." }))}</QIzoh>
          </>}
        </div>}
        {...{ [QKOD_ONG]: <div className="yp-kodoyna">
          {stage2 && <div className="yp-amal"><QTugma className={!done && !isMentor ? 'yp-bos' : undefined} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: "Открыть компилятор" })}</QTugma></div>}
          <KodNamuna ajrat={ajrat} />
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      />
      <MentorNote>{tr({ uz: "Ko'p uchraydigan xato — «Keyin»ni sikl ichiga qo'yish: u har loyihadan keyin takrorlanadi. Console'da ko'rsating: chiziqda «Keyin» bitta va eng oxirida.", ru: "Частая ошибка — поставить «Keyin» внутрь цикла: он повторяется после каждого проекта. Покажите в Console: на линии «Keyin» один и в самом конце." })}</MentorNote>
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), kod oynasi qobig'i tashqi zoomni bekor qiladi */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_STARTER)} storageKey="pm-m8d10-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s12 = 2, ✔ C; chiziq tartibi va keyingi qadam oxirida) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: "Итоговая проверка" })}
    questionText="Sherigingizga chizig'ingizni qaysi tartibda aytib berasiz?"
    question={tr({ uz: <h2 className="title h-ask">Sherigingizga chizig'ingizni <A>qaysi tartibda</A> aytib berasiz?</h2>, ru: <h2 className="title h-ask">В каком <A>порядке</A> вы расскажете партнёру свою линию?</h2> })}
    options={[
      { uz: "Eng yoqqan loyihadan boshlab, so'ng qolganlarini", ru: "Начиная с самого любимого проекта, потом остальные" },
      { uz: "Keyingi qadamdan boshlab, so'ng loyihalarni", ru: "Начиная со следующего шага, потом проекты" },
      { uz: 'Birinchisidan boshlab, oxirida keyingi qadam', ru: "Начиная с первого, в конце — следующий шаг" },
      { uz: 'Eng katta loyihadan boshlab, kichigiga qarab', ru: "Начиная с самого большого проекта, к меньшим" }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Bu darsda chiziq qurilgan tartibda aytiladi, keyingi qadam — oxirida.", ru: "На этом уроке линию рассказывают в порядке создания, следующий шаг — в конце." }}
    explainWrong={{
      0: { uz: "Yoqqanidan boshlasangiz, o'sish tartibi buziladi.", ru: "Если начать с любимого, порядок роста нарушится." },
      1: { uz: "Nima bo'lganini eshitmasa, keyingi qadam tushunarsiz.", ru: "Если партнёр не услышит, что было, следующий шаг будет непонятен." },
      3: { uz: "Kattasidan boshlasangiz, qayerdan boshlaganingiz yo'qoladi.", ru: "Если начать с большого, теряется, с чего вы начали." },
      default: { uz: 'Chiziq qaysi tartibda turadi — shuni eslang.', ru: "Вспомните, в каком порядке стоит линия." }
    }} />
);

// ===== 🏅 NISHONLAR (4) — 151-qonun: 2, 4-ekran birinchi urinish; 9, 10-ekran ish bajarilgani (tekin bonus yo'q, S-034) =====
const ACHIEVEMENTS = {
  timeKeeper: { icon: '⏳', name: 'Time Keeper!', desc: { uz: 'Loyihalarni qurilgan tartibida joyladingiz', ru: "Вы расставили проекты в порядке создания" } },
  skillSpotter: { icon: '🔍', name: 'Skill Spotter!', desc: { uz: "Uch loyihada nima o'rganilganini topdingiz", ru: "Вы нашли, чему научились в трёх проектах" } },
  timelineBuilder: { icon: '🧭', name: 'Timeline Builder!', desc: { uz: "O'z vaqt chizig'ingizni tuzdingiz", ru: "Вы составили свою линию времени" } },
  nextStep: { icon: '👣', name: 'Next Step!', desc: { uz: "Chizig'ingizga keyingi qadamni yozdingiz", ru: "Вы записали на линию следующий шаг" } }
};
// Ekran id → nishon. s2/s4: `correct` = xatosiz birinchi urinish (AchMissCtx.miss) · s9: 5 ta to'liq nuqta · s10: «Keyin» tekshiruvdan o'tdi va loyiha tanlandi
const ACH_TRIGGERS = { s2: 'timeKeeper', s4: 'skillSpotter', s9: 'timelineBuilder', s10: 'nextStep' };

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


// Podium savol yorliqlari (kalitlar = SCORED_IDX: 3, 5, 8, 12)
const Q_LABELS = {
  3: { uz: "1 — Qaysi loyihalar qo'yiladi", ru: "1 — Какие проекты ставятся" },
  5: { uz: "2 — «O'rgandim» gapi", ru: "2 — Фраза «Умею»" },
  8: { uz: '3 — Keyingi qadam', ru: "3 — Следующий шаг" },
  12: { uz: '4 — Aytib berish tartibi', ru: "4 — Порядок рассказа" }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'chiziq', ru: "линия" }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'loyiha', ru: "проект" }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'modul', ru: "модуль" }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'yil', ru: "год" }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: "o'rgandim", ru: "умею" }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'keyin', ru: "дальше" }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'qadam', ru: "шаг" }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'portfolio', ru: "портфолио" }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (MD; har biri 3 marta)
const QUIZ_BANK = [
  { q: { uz: "Vaqt chizig'ida loyihalar qanday tartibda turadi?", ru: "В каком порядке стоят проекты на линии времени?" }, opts: [{ uz: "Qurilgan vaqti bo'yicha, birinchisidan", ru: "По времени создания, с первого" }, { uz: 'Eng yoqqanidan boshlab, eng yoqmaganigacha', ru: "От самого любимого до самого нелюбимого" }, { uz: 'Eng kattasidan boshlab, kichigigacha', ru: "От самого большого до маленького" }, { uz: "Ko'p vaqt olganidan boshlab, ozigacha", ru: "От самого долгого до короткого" }], correct: 0 },
  { q: { uz: 'Bir yil oldingi portfolio sayt chiziqning qayeriga yaqin turadi?', ru: "Ближе к какому месту линии стоит прошлогодний сайт-портфолио?" }, opts: [{ uz: 'Oxiriga — eng yangi loyiha sifatida', ru: "К концу — как самый новый проект" }, { uz: 'Boshiga — dastlabki loyihalardan biri', ru: "К началу — один из первых проектов" }, { uz: "O'rtasiga — eng muhim loyiha bo'lgani uchun", ru: "К середине — как самый важный проект" }, { uz: 'Hech qayerga — u juda kichik loyiha', ru: "Никуда — это слишком маленький проект" }], correct: 1 },
  { q: { uz: "«AvtoIjara saytini qurdim» — «O'rgandim»ga to'g'ri keladimi?", ru: "«Я построил(а) сайт AvtoIjara» — подходит для «Умею»?" }, opts: [{ uz: 'Ha — loyiha nomi aniq yozilgan', ru: "Да — название проекта написано точно" }, { uz: "Ha — gap o'tgan zamonda to'g'ri yozilgan", ru: "Да — фраза верно написана в прошедшем времени" }, { uz: "Yo'q — u loyiha nomini takrorlaydi", ru: "Нет — она повторяет название проекта" }, { uz: "Yo'q — gap juda qisqa yozilgan", ru: "Нет — фраза слишком короткая" }], correct: 2 },
  { q: { uz: "Qaysi gap «O'rgandim»ga mos keladi?", ru: "Какая фраза подходит для «Умею»?" }, opts: [{ uz: "Endi loyiham juda chiroyli ko'rinadi", ru: "Теперь мой проект выглядит очень красиво" }, { uz: "Endi KitobShop'ni oxirigacha qurib bo'ldim", ru: "Теперь я достроил(а) KitobShop до конца" }, { uz: 'Endi Mentor loyihamni juda maqtaydi', ru: "Теперь Ментор очень хвалит мой проект" }, { uz: "Endi botga AI'ni o'zim ulay olaman", ru: "Теперь я умею без помощи подключать ИИ к боту" }], correct: 3 },
  { q: { uz: 'Uzum qachon ishga tushgan?', ru: "Когда запустился Uzum?" }, opts: [{ uz: '2022-yil oktabrda', ru: "В октябре 2022 года" }, { uz: '2020-yil sentabrda', ru: "В сентябре 2020 года" }, { uz: '2024-yil martda', ru: "В марте 2024 года" }, { uz: '2019-yil oktabrda', ru: "В октябре 2019 года" }], correct: 0 },
  { q: { uz: "Uzum'gacha odamlar narsani ko'pincha qayerdan olardi?", ru: "Где люди чаще всего покупали вещи до Uzum?" }, opts: [{ uz: 'Chet eldagi katta saytlardan', ru: "На больших зарубежных сайтах" }, { uz: 'Telegram va Instagram guruhlaridan', ru: "В группах Telegram и Instagram" }, { uz: "Shahardagi katta bozor va do'konlardan", ru: "На больших рынках и в магазинах города" }, { uz: "Maktabdagi e'lonlar taxtasidan", ru: "С доски объявлений в школе" }], correct: 1 },
  { q: { uz: "Uzum 2024-yilda «unicorn» bo'ldi. Bu nimani bildiradi?", ru: "В 2024 году Uzum стал «единорогом». Что это значит?" }, opts: [{ uz: 'Ishchilari soni mingtadan oshganini', ru: "Что сотрудников стало больше тысячи" }, { uz: "Bir yilda o'nta shaharga ochilganini", ru: "Что за год открылся в десяти городах" }, { uz: 'Bahosi 1 milliard dollardan oshganini', ru: "Что его стоимость превысила 1 миллиард долларов" }, { uz: 'Hamma xaridni o\'zi yetkaza boshlaganini', ru: "Что начал сам доставлять все покупки" }], correct: 2 },
  { q: { uz: "Uzum'ning birinchi qadami nimadan o'sgan?", ru: "Из чего вырос первый шаг Uzum?" }, opts: [{ uz: 'Sayt dizayni eskirib qolganidan', ru: "Из того, что дизайн сайта устарел" }, { uz: "Shaharda do'konlar kamligidan", ru: "Из того, что в городе мало магазинов" }, { uz: 'Reklama juda arzonlashganidan', ru: "Из того, что реклама сильно подешевела" }, { uz: 'Yetkazib berishsiz xariddan', ru: "Из покупок без доставки" }], correct: 3 },
  { q: { uz: 'Keyingi qadamning belgilaridan biri qaysi?', ru: "Какой из признаков следующего шага?" }, opts: [{ uz: 'Bitta va aniq ish', ru: "Одна конкретная работа" }, { uz: 'Eng katta va qiyin ish', ru: "Самая большая и трудная работа" }, { uz: 'Hammaga yoqadigan ish', ru: "Работа, которая нравится всем" }, { uz: 'Tez tugaydigan ish', ru: "Работа, которая быстро заканчивается" }], correct: 0 },
  { q: { uz: "«Ko'proq o'rganaman» — keyingi qadam bo'ladimi?", ru: "«Буду больше учиться» — это следующий шаг?" }, opts: [{ uz: 'Ha — u kelajakdagi ish haqida yozilgan', ru: "Да — она написана о будущей работе" }, { uz: "Yo'q — qaysi ish ekani aniq emas", ru: "Нет — неясно, какая это работа" }, { uz: "Ha — o'rganish hammaga kerak", ru: "Да — учиться нужно всем" }, { uz: "Yo'q — u juda uzun yozilgan", ru: "Нет — она слишком длинная" }], correct: 1 },
  { q: { uz: "«Maydon» keyingi qadami nimadan o'sdi?", ru: "Из чего вырос следующий шаг «Maydon»?" }, opts: [{ uz: 'Mentorning futbolga qiziqishidan', ru: "Из интереса Ментора к футболу" }, { uz: "Boshqa saytlarda ko'rgan narsadan", ru: "Из того, что видели на других сайтах" }, { uz: 'Suhbatda o\'yinchilar aytganidan', ru: "Из того, что игроки сказали в разговорах" }, { uz: "A/B testdagi B variantining yutug'idan", ru: "Из победы варианта B в A/B-тесте" }], correct: 2 },
  { q: { uz: 'Bu modulda loyiha qurmagan bo\'lsangiz, chiziqda nima qilasiz?', ru: "Если в этом модуле вы не строили проект, что делаете на линии?" }, opts: [{ uz: 'Sinfdoshimning loyihasini yozib qo\'yaman', ru: "Записываю проект одноклассника" }, { uz: "O'ylab topilgan loyiha nomini yozaman", ru: "Пишу придуманное название проекта" }, { uz: 'Chiziqni shu joyda tugatib qo\'yaman', ru: "Заканчиваю линию на этом месте" }, { uz: "Modulni «o'tkazildi» deb belgilayman", ru: "Отмечаю модуль как «пропущено»" }], correct: 3 },
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
const MentorPracticeStats = ({ live, screen, label }) => {
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
      <div className="card-lbl" style={{ color: T.accent }}>{label ? tr(label) : tr({ uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
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

// 🃏 Kartochka mexanikasi va ko'rinishi — qolipda: QKartochka (DE-204). Ta'riflar so'zma-so'z (T-042); alohida ekran, Mentorsiz (SABOQ 12, 16)
const KARTOCHKALAR = [
  { front: { uz: "Vaqt chizig'i nima?", ru: "Что такое линия времени?" }, back: { uz: 'Loyihalar qurilgan vaqti tartibida turgan bitta chiziq', ru: "Одна линия, на которой проекты стоят в порядке их создания" } },
  { front: { uz: "Vaqt chizig'iga qaysi loyihalar qo'yiladi?", ru: "Какие проекты ставятся на линию времени?" }, back: { uz: 'Har moduldan asosiy loyiha — kichigi ham', ru: "Главный проект каждого модуля — и маленький тоже" } },
  { front: { uz: "Chiziqda bir yillik o'sish qanday ko'rinadi?", ru: "Как на линии виден рост за год?" }, back: { uz: 'Bitta sahifadan prodda ishlayotgan saytgacha', ru: "От одной страницы до сайта, работающего в проде" } },
  { front: { uz: 'Loyiha nomi nimani aytadi?', ru: "Что говорит название проекта?" }, back: { uz: 'Nima qurilganini', ru: "Что построено" } },
  { front: { uz: "«O'rgandim»ga nima yoziladi?", ru: "Что пишется в «Умею»?" }, back: { uz: 'Endi nima qila olishingiz', ru: "Что вы теперь умеете" } },
  { front: { uz: "«AvtoStoyanka saytini qurdim» — «O'rgandim» bo'ladimi?", ru: "«Я построил(а) сайт AvtoStoyanka» — это «Умею»?" }, back: { uz: "Yo'q: u loyiha nomini takrorlaydi", ru: "Нет: это повтор названия проекта" } },
  { front: { uz: 'Uzum nimadan boshlagan?', ru: "С чего начал Uzum?" }, back: { uz: 'Saytdan emas, yetkazib berishdan (2022-yil oktabr)', ru: "Не с сайта, а с доставки (октябрь 2022)" } },
  { front: { uz: '«Unicorn» nima?', ru: "Что такое «единорог»?" }, back: { uz: 'Bahosi 1 milliard dollardan oshgan kompaniya', ru: "Компания, стоимость которой больше 1 миллиарда долларов" } },
  { front: { uz: "Uzum qachon mamlakatning birinchi «unicorn»i bo'ldi?", ru: "Когда Uzum стал первым «единорогом» страны?" }, back: { uz: '2024-yil martda', ru: "В марте 2024 года" } },
  { front: { uz: 'Keyingi qadam nima?', ru: "Что такое следующий шаг?" }, back: { uz: "Vaqt chizig'idan o'sadigan bitta aniq ish", ru: "Одна конкретная работа, которая вырастает из линии времени" } },
  { front: { uz: 'Keyingi qadamning uch belgisi qaysilar?', ru: "Какие три признака у следующего шага?" }, back: { uz: "Bitta · aniq · chiziqdan o'sadi", ru: "Одно · конкретное · растёт из линии" } },
  { front: { uz: "Mentor «Maydon»ga nega jamoa yig'ishni tanladi?", ru: "Почему Ментор выбрал для «Maydon» сбор команды?" }, back: { uz: 'Dalil bor edi: suhbatlarda beshtadan ikkitasiga jamoaga odam yetmagan — tanlov Mentorniki', ru: "Было доказательство: в разговорах у двоих из пяти не хватало людей в команду — выбор за Ментором" } }
];
const ScreenFlashcards = ({ screen, storedAnswer, answers, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        <ChizigimStrip yol={answers && answers[9] && answers[9].yol} />
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */}
        <div className={cxx('yp-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="yp-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: "Нажмите на карточку — откроется ответ" })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «kim uchun · nechta · muddat» + raqamli qadamlar; alohida .homework.jsx yo'q — tayanch 4) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: "Для кого" }, v: { uz: "portfolio'ngizni ochadigan odamlar", ru: "люди, которые открывают ваше портфолио" } },
  { k: { uz: 'Nechta', ru: "Сколько" }, v: { uz: "1 vaqt chizig'i", ru: "1 линия времени" } },
  { k: { uz: 'Muddat', ru: "Срок" }, v: { uz: 'keyingi darsgacha', ru: "до следующего урока" } }
];
const HW_QADAM = [
  { uz: "Chizig'ingizdagi bo'sh qolgan loyihalarga «O'rgandim»ni yozing.", ru: "Заполните «Умею» у проектов, которые остались пустыми на вашей линии." },
  { uz: "Portfolio saytingizning «Loyihalarim» bo'limiga chiziqdagi loyihalarni tartib bilan yozing va qayta deploy qiling.", ru: "Впишите проекты с линии по порядку в раздел «Мои проекты» сайта-портфолио и сделайте деплой заново." },
  { uz: "Chizig'ingizni oilangizdan yoki tanishlaringizdan bir kishiga bir daqiqada aytib bering; u tushunmagan joyni qayta yozing.", ru: "Расскажите свою линию за одну минуту одному человеку из семьи или знакомых; перепишите место, которое он не понял." }
];
const HwCard = ({ keyingi }) => (
  <div className="card yp-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: "Что сделаете дома?" })}</div>
    <div className="yp-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="yp-hw-q"><span className="yp-hw-k">{tr(r.k)}</span><span className="yp-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="yp-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
    <p className="yp-kulrang">{tr({ uz: "Portfolio saytingiz ochilmasa — chiziqni GitHub'dagi istalgan repo'ngizning README fayliga yozing.", ru: "Если сайт-портфолио не открывается — запишите линию в файл README любого своего репозитория на GitHub." })}</p>
    {keyingi && <span className="yp-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Bugungi asosiy fikr» (P-013, ScoreRing ostida — kartochkaga qo'shilmaydi). CODE STRIKE va arena — darsda =====
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
    { uz: "Vaqt chizig'iga har moduldan asosiy loyiha qo'yiladi, kichigi ham.", ru: "На линию времени ставится главный проект каждого модуля, и маленький тоже." },
    { uz: "«O'rgandim» loyiha nomini takrorlamaydi: u endi nima qila olishingizni aytadi.", ru: "«Умею» не повторяет название проекта: оно говорит, что вы теперь можете делать." },
    { uz: "Uzum'ning birinchi qadami odamlarning muammosidan o'sgan: xarid yetkazib berishsiz edi.", ru: "Первый шаг Uzum вырос из проблемы людей: покупка была без доставки." },
    { uz: "Keyingi qadam bitta va aniq ish; u oldingi dalildan o'sadi, tanlov esa sizniki.", ru: "Следующий шаг — одна конкретная работа; он растёт из прежнего доказательства, а выбор за вами." }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Besh daqiqada nimani ko'rsatasiz?»</b>.</>, ru: <>Следующий урок — <b>«Что вы покажете за пять минут?»</b>.</> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: "Итог урока" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: "Урок окончен" })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Yillik yo'l tayyor: <A>vaqt chizig'i va keyingi qadam</A>.</>, ru: <>Годовой путь готов: <A>линия времени и следующий шаг</A>.</> })}
        cta={<>
          <div className="yp-fikr fade-up d1"><span className="yp-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: "Главная мысль урока" })}</span><p className="yp-fikr-t small">{tr({ uz: "Vaqt chizig'i bir yilda nima bo'lganini ko'rsatadi, keyingi qadam esa shu chiziqdan o'sadi.", ru: "Линия времени показывает, что было за год, а следующий шаг вырастает из этой линии." })}</p></div>
          <ChizigimStrip yol={answers && answers[9] && answers[9].yol} />
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
export default function PmYearPathLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARS VIZUALI — vaqt chizig'i (yc-) va ekran bo'laklari (yp-). Faqat qolip tokenlari (D3), emoji yo'q (D4); brend va maket ranglari — maket mazmuni === */
        .yc { position: relative; width: 100%; min-width: 0; padding: 4px 2px 6px; }
        .yc.yc-past { padding-bottom: 34px; }
        .yc-skelet { height: 30px; display: flex; align-items: center; }
        .yc-skelet i { display: block; width: 100%; height: 2px; border-radius: 2px; background: ${T.line}; }
        .yc-qator { display: grid; grid-template-columns: var(--ustun); grid-template-rows: auto auto auto auto auto; column-gap: 0; align-items: start; }
        .yc-n { display: grid; grid-row: span 5; grid-template-rows: subgrid; justify-items: center; min-width: 0; text-align: center; }
        .yc.kir .yc-n, .yc-n.kir { animation: yc-kir .42s cubic-bezier(.2,.9,.3,1.1) both; }
        .yc.kir .yc-n { animation-delay: calc(var(--i) * 0.11s); }
        .yc-m { font-family: 'Manrope', sans-serif; font-size: 10.5px; font-weight: 700; line-height: 1.25; color: ${T.ink2}; padding: 0 3px; min-height: 26px; display: flex; align-items: flex-end; justify-content: center; gap: 4px; overflow-wrap: anywhere; }
        .yc-belgi { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: ${T.accent}; }
        .yc-o { position: relative; width: 100%; height: 30px; display: flex; align-items: center; justify-content: center; }
        .yc-l, .yc-r { position: absolute; top: 50%; height: 0; border-top: 2px dashed ${fon(T.ink2, 0.35)}; }
        .yc-l { left: 0; right: 50%; } .yc-r { left: 50%; right: 0; }
        .yc-n:first-child .yc-l, .yc-n:last-child .yc-r { display: none; }
        .yc-l.on, .yc-r.on { border-top: 2.5px solid ${T.accent}; transition: border-color .4s; }
        .yc-k .yc-l.kirish::after { content: ''; position: absolute; right: 12px; top: -6px; border: 5px solid transparent; border-left: 7px solid var(--yc-uq, ${fon(T.ink2, 0.55)}); }
        .yc-k .yc-l.kirish.on { --yc-uq: ${T.accent}; } /* o'q rangi o'zgaruvchida: telefonda o'q pastga qaraydi */
        .yc-d { position: relative; z-index: 1; width: 18px; height: 18px; border-radius: 50%; padding: 0; background: ${T.paper}; border: 2px dashed ${fon(T.ink2, 0.5)}; transition: background .3s, border-color .3s, transform .3s, box-shadow .3s; font: inherit; }
        button.yc-d { cursor: pointer; }
        button.yc-d:hover { transform: scale(1.15); border-color: ${T.accent}; }
        .yc-n.h-nom .yc-d, .yc-n.h-toliq .yc-d { background: ${T.accent}; border: 2px solid ${T.accent}; }
        .yc-n.h-otkaz .yc-d { width: 11px; height: 11px; background: ${T.line}; border: 2px solid ${T.line}; }
        .yc-voqea .yc-n.h-otkaz .yc-o .yc-l, .yc-voqea .yc-n.h-otkaz .yc-o .yc-r { border-top-color: transparent; }
        .yc-n.joriy .yc-d { box-shadow: 0 0 0 4px ${T.accentSoft}, 0 0 0 6px ${T.accent}; animation: yc-puls 1.6s ease-out infinite; }
        .yc-n.kutadi .yc-d { border-color: ${T.accent}; border-style: solid; animation: yc-puls 1.4s ease-out infinite; }
        .yc-n.xato .yc-d { background: ${T.errFon}; border-color: ${T.err}; border-style: solid; animation: yc-silk .45s ease-out; }
        .yc-n.ycm .yc-d { box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .yc-kar { position: relative; width: calc(100% - 6px); margin: 6px 3px 0; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 6px 6px; display: flex; flex-direction: column; gap: 4px; text-align: left; box-shadow: 0 6px 14px -10px rgba(${T.shadowBase},0.3); animation: yc-kir .38s ease-out both; align-self: stretch; }
        .yc-n.ycm .yc-kar { border-color: ${T.accent}; }
        .yc-n.joriy .yc-kar { border-color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accentSoft}; }
        .yc-q { font-size: 11.5px; line-height: 1.35; color: ${T.ink}; overflow-wrap: break-word; hyphens: auto; }
        .yc-q b { display: block; font-size: 9.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .yc-q.err { background: ${T.errFon}; border-radius: 6px; padding: 2px 4px; }
        .yc-uzuq { display: block; height: 0; margin-top: 7px; border-top: 1.5px dashed ${fon(T.ink2, 0.4)}; }
        .yc-mt { align-self: flex-start; white-space: nowrap; font-size: 8.5px; font-weight: 800; padding: 1px 6px; border-radius: 999px; background: ${T.accentSoft}; color: ${T.accent}; }
        .yc-ok { position: absolute; top: -7px; right: -6px; width: 18px; height: 18px; border-radius: 50%; background: ${T.ok}; color: #FFFFFF; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; animation: yc-kir .3s ease-out both; }
        .yc-osti { margin-top: 6px; max-width: calc(100% - 8px); font-size: 10.5px; font-weight: 700; line-height: 1.35; text-align: center; color: ${T.ink2}; padding: 2px 9px; border-radius: 7px; background: ${T.bg}; border: 1px solid ${T.line}; animation: fade-step .35s ease-out both; }
        .yc-bo { display: block; min-height: 0; }
        .yc-kk { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; padding: 0 4px; margin-top: 6px; grid-row: 3 / span 3; }
        .yc-kar.keyin { margin: 0; width: 100%; }
        .yc-kar.keyin.tol { border-color: ${T.ok}; }
        .yc-bel { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; }
        .yc-bel em { font-style: normal; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; padding: 2px 8px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .yc-bel em.ok { background: ${T.okFon}; color: ${T.ok}; border-color: transparent; }
        .yc-bel em.err { background: ${T.errFon}; color: ${T.err}; border-color: transparent; }
        .yc-bel em.kir { animation: yc-kir .3s ease-out both; }
        .yc-k .yc-d { border-style: dashed; }
        .yc-k.katta .yc-d { width: 26px; height: 26px; }
        .yc-k.k-joriy .yc-d, .yc-k.joriy .yc-d { border-color: ${T.accent}; border-style: solid; box-shadow: 0 0 0 4px ${T.accentSoft}; animation: yc-puls 1.6s ease-out infinite; }
        .yc-k.k-toliq .yc-d { background: ${T.accent}; border: 2px solid ${T.accent}; animation: none; }
        .yc-k.k-yopiq .yc-d { opacity: .55; }
        .yc-k.kutadi .yc-d { animation: yc-puls 1.3s ease-out infinite; border-color: ${T.accent}; }
        .yc-k { animation: yc-kir .45s ease-out both; }
        .yc-qavslar { display: grid; grid-template-columns: var(--ustun); margin-bottom: 2px; }
        .yc-qavs { position: relative; text-align: center; font-size: 11px; font-weight: 800; color: ${T.accent}; padding-bottom: 7px; margin: 0 8px; border-bottom: 1.5px solid ${fon(T.accent, 0.45)}; animation: fade-step .4s ease-out both; }
        .yc-qavs::before, .yc-qavs::after { content: ''; position: absolute; bottom: -1.5px; width: 1.5px; height: 7px; background: ${fon(T.accent, 0.45)}; }
        .yc-qavs::before { left: 0; } .yc-qavs::after { right: 0; }
        .yc-qavs.k { grid-column: -2 / -1; }
        .yc-svg { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; z-index: 2; }
        .yc-svg marker path { fill: ${T.accent}; }
        .yc-bog { fill: none; stroke: ${T.accent}; stroke-width: 2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: yc-chiz .9s ease-out forwards; }
        .yc-bog.strelka { stroke: ${fon(T.ink2, 0.6)}; stroke-width: 1.5; }
        .yc-bog.qavs { stroke: ${T.ink2}; stroke-width: 1.5; }
        .yc-bog-l { position: absolute; transform: translate(-50%, -50%); z-index: 3; white-space: nowrap; font-size: 11px; font-weight: 800; padding: 2px 9px; border-radius: 999px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${fon(T.accent, 0.35)}; animation: yc-bog-kir .5s ease-out .5s both; }
        @keyframes yc-bog-kir { from { opacity: 0; } to { opacity: 1; } }
        .yc-bog-l.strelka, .yc-bog-l.qavs { color: ${T.ink2}; border-color: ${T.line}; }
        .yc-bog-l.tik { transform: translate(-50%, -50%) rotate(0deg); white-space: normal; max-width: 120px; text-align: center; }
        /* Telefonda egri chiziq o'rniga: manba yozuvi rangda + «Keyin» ostida dalil qatori (7-ekran) */
        .yc-dalil { align-self: flex-start; font-size: 11px; font-weight: 700; line-height: 1.35; padding: 3px 10px; border-radius: 999px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${fon(T.accent, 0.35)}; animation: fade-step .5s ease-out .5s both; }
        .yc-dalil b { font-weight: 800; }
        .yc-sdl em.manba { color: ${T.accent}; font-weight: 800; }
        /* Kengaygan ko'rinish (7-ekran): 1–8 ixcham, 9–10 pastki nuqtalari bilan, «Keyin» katta */
        .yc-kengaygan .yc-m { font-size: 10px; }
        .yc-n.kenG .yc-m { font-size: 11.5px; color: ${T.ink}; }
        .yc-n.kenG .yc-o { justify-content: flex-start; padding-left: calc(50% / 4 - 9px); gap: 0; }
        .yc-n.kenG .yc-o > .yc-d { position: absolute; left: 6px; }
        .yc-sd-q { display: grid; grid-template-columns: repeat(4, 1fr); width: 100%; padding-left: 26px; justify-items: center; }
        .yc-sd { position: relative; z-index: 1; width: 11px; height: 11px; border-radius: 50%; background: ${T.paper}; border: 2px solid ${T.accent}; }
        .yc-sdl { display: grid; grid-template-columns: repeat(4, 1fr); width: 100%; padding-left: 26px; gap: 2px; }
        .yc-sdl em { font-style: normal; font-size: 10px; font-weight: 600; line-height: 1.25; color: ${T.ink2}; text-align: center; overflow-wrap: break-word; hyphens: auto; padding-top: 4px; }
        .yc-yash { visibility: hidden; }
        .yc-chip { font-style: normal; white-space: nowrap; font-size: 10px; font-weight: 800; padding: 1px 7px; border-radius: 999px; background: ${T.accentSoft}; color: ${T.accent}; }
        .yc-voqea .yc-qator { margin-top: 4px; }
        .yc.yc-voqea { padding-bottom: 44px; }
        .yc-kengaygan { padding-bottom: 16px; }
        .yc-voqea .yc-m { font-size: 12px; color: ${T.ink}; }
        .yc-voqea .yc-osti { color: ${T.accent}; background: ${T.accentSoft}; border-color: transparent; }
        .yc-voqea .yc-n.h-otkaz .yc-d { width: 14px; height: 14px; background: ${fon(T.ink2, 0.45)}; border-color: transparent; }
        @keyframes yc-kir { from { opacity: 0; transform: translateY(-8px) scale(.92); } to { opacity: 1; transform: none; } }
        @keyframes yc-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        @keyframes yc-silk { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        @keyframes yc-chiz { to { stroke-dashoffset: 0; } }
        /* O'tkazilgan modul (SABOQ 28): yoy yo'q — chiziq davom etadi, nuqta kichik kulrang, ostida kulrang chip */
        .yc-otk { margin-top: 8px; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 999px; padding: 2px 10px; white-space: nowrap; animation: fade-step .35s ease-out both; }
        .yc-sk { display: inline-block; vertical-align: middle; width: 78%; height: 7px; border-radius: 4px; background: ${fon(T.ink2, 0.28)}; }
        .yc-qt { overflow-wrap: anywhere; }
        /* «Keyin» katagi (7-ekran): karta tushadigan bo'sh joy */
        .yc-katak { font: inherit; width: 100%; min-height: 56px; border-radius: 12px; border: 2px dashed ${fon(T.ink2, 0.4)}; background: ${fon(T.paper, 0.6)}; padding: 0; transition: border-color .25s, background .25s; }
        .yc-katak:not(:disabled) { cursor: pointer; }
        .yc-kengaygan .yc-katak { min-height: 50px; }
        .yc-katak.kutadi { border-color: ${T.accent}; background: ${T.accentSoft}; animation: yp-chegara 1.2s ease-in-out infinite; }
        .yc-pastida { grid-column: 1 / -2; grid-row: 6; min-width: 0; padding-top: 12px; }
        /* Ko'rinish «tik» (0-ekran): 1 → 10 chiziq tepadan pastga chizilib boradi, nomlar navbat bilan chiqadi */
        .yc-tik { display: flex; flex-direction: column; padding: 4px 0; }
        .yct-n { position: relative; display: flex; align-items: center; gap: 11px; min-height: 29px; }
        .yct-n:not(:last-child)::after { content: ''; position: absolute; left: 8px; top: calc(50% + 7px); height: calc(100% - 14px); border-left: 2px solid ${fon(T.ink2, 0.25)}; transform-origin: top; animation: yct-chiz .16s linear both; animation-delay: calc(var(--i) * 0.11s + 0.12s); }
        .yct-d { position: relative; z-index: 1; flex-shrink: 0; width: 18px; height: 18px; margin-left: 0; border-radius: 50%; background: ${T.paper}; border: 2px solid ${fon(T.ink2, 0.4)}; animation: yct-pop .3s cubic-bezier(.2,.9,.3,1.4) both; animation-delay: calc(var(--i) * 0.11s); }
        .yct-m { font-size: 13.5px; font-weight: 700; line-height: 1.25; color: ${T.ink2}; animation: yct-m .32s ease-out both; animation-delay: calc(var(--i) * 0.11s + 0.05s); }
        .yct-k .yct-d { border-color: ${T.accent}; }
        .yct-k .yct-m { color: ${T.accent}; }
        @keyframes yct-chiz { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes yct-pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes yct-m { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
        /* Ko'rinish «qadam» (9, 10-ekran, SABOQ 29): raqamli doira · holat · qisqartirilgan nom */
        .yc-qadam { padding: 2px 0 4px; }
        .yc-qadam.yc-past { padding-bottom: 30px; }
        .yc-qadam .yc-qavslar { margin-bottom: 6px; }
        .ycq-qator { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); row-gap: 14px; }
        .ycq-n { position: relative; display: flex; flex-direction: column; align-items: center; gap: 7px; min-width: 0; padding: 0 3px; font: inherit; color: inherit; background: none; border: none; text-align: center; animation: yc-kir .35s ease-out both; animation-delay: calc(var(--i) * 0.05s); }
        button.ycq-n { cursor: pointer; }
        button.ycq-n:hover .ycq-d { transform: scale(1.1); border-color: ${T.accent}; }
        .ycq-o { position: relative; width: 100%; height: 34px; display: flex; align-items: center; justify-content: center; }
        .ycq-l { position: absolute; top: 50%; right: 50%; width: 100%; height: 0; border-top: 2px dashed ${fon(T.ink2, 0.35)}; }
        .ycq-l.on { border-top: 2.5px solid ${T.accent}; }
        .ycq-n:first-child .ycq-l { display: none; }
        .ycq-k .ycq-l::after { content: ''; position: absolute; right: 22px; top: -6px; border: 5px solid transparent; border-left: 7px solid var(--yc-uq, ${fon(T.ink2, 0.55)}); }
        .ycq-k .ycq-l.on { --yc-uq: ${T.accent}; }
        .ycq-d { position: relative; z-index: 1; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: ${T.ink2}; background: ${T.paper}; border: 2px dashed ${fon(T.ink2, 0.5)}; transition: transform .2s, background .3s, border-color .3s, color .3s; }
        .ycq-n.h-nom .ycq-d { background: ${T.accent}; border: 2px solid ${T.accent}; color: #FFFFFF; }
        .ycq-n.h-toliq .ycq-d { background: ${T.ok}; border: 2px solid ${T.ok}; color: #FFFFFF; font-size: 15px; animation: ycq-tush .5s cubic-bezier(.2,.9,.3,1.5) both; }
        .ycq-n.h-otkaz .ycq-d { width: 22px; height: 22px; font-size: 11px; background: ${T.line}; border: none; }
        .ycq-n.joriy .ycq-d { background: ${T.accentSoft}; border: 2px solid ${T.accent}; color: ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.16)}; animation: yc-puls 1.6s ease-out infinite; }
        .ycq-n.tanl .ycq-d { box-shadow: 0 0 0 4px ${fon(T.accent, 0.25)}; transform: scale(1.12); }
        .ycq-k .ycq-d { width: 34px; height: 34px; border-color: ${T.accent}; }
        .ycq-k.k-joriy .ycq-d { background: ${T.accentSoft}; animation: yc-puls 1.6s ease-out infinite; }
        .ycq-k.k-toliq .ycq-d { background: ${T.accent}; border: 2px solid ${T.accent}; color: #FFFFFF; font-size: 15px; animation: ycq-tush .5s cubic-bezier(.2,.9,.3,1.5) both; }
        .ycq-nom { display: block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12.5px; font-weight: 700; line-height: 1.3; color: ${T.ink2}; }
        .ycq-n.h-nom .ycq-nom, .ycq-n.h-toliq .ycq-nom { color: ${T.ink}; }
        .ycq-n.joriy .ycq-nom, .ycq-n.tanl .ycq-nom, .ycq-k .ycq-nom { color: ${T.accent}; }
        .ycq-otk { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 999px; padding: 1px 8px; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
        @keyframes ycq-tush { 0% { transform: translateY(-10px) scale(.6); } 60% { transform: translateY(2px) scale(1.08); } 100% { transform: none; } }
        @keyframes yp-chegara { 0%, 100% { border-color: ${T.line}; } 50% { border-color: ${fon(T.accent, 0.7)}; } }
        /* Keng ekran: «to'liq» va «kengaygan» ko'rinish kattaroq va o'qiladigan (SABOQ 27); telefonda — vertikal (pastdagi @media) */
        @media (min-width: 641px) {
          .yc-toliq .yc-m { font-size: 12.5px; min-height: 20px; }
          .yc-toliq .yc-o { height: 30px; }
          .yc-toliq .yc-d { width: 22px; height: 22px; }
          .yc-toliq .yc-n.h-otkaz .yc-d { width: 13px; height: 13px; }
          .yc-toliq .yc-kar { width: calc(100% - 12px); margin: 5px 6px 0; padding: 8px 10px; border-radius: 12px; gap: 5px; }
          .yc-toliq .yc-q { font-size: 13.5px; }
          .yc-toliq .yc-q b { font-size: 10px; margin-bottom: 1px; }
          .yc-toliq .yc-osti { font-size: 11.5px; }
          .yc-ikki .yc-qator + .yc-qator { margin-top: 10px; }
          .yc-ikki .yc-qator.q2 > .yc-n:first-child .yc-l { display: block; left: -6px; }
          .yc-davom { grid-column: 6; grid-row: 2; position: relative; height: 30px; }
          .yc-davom::before { content: ''; position: absolute; left: 0; right: 30%; top: 50%; border-top: 2px dashed ${fon(T.ink2, 0.35)}; }
          .yc-davom::after { content: ''; position: absolute; left: 70%; top: calc(50% - 5px); border: 5px solid transparent; border-left: 7px solid var(--yc-uq, ${fon(T.ink2, 0.45)}); }
          .yc-davom.on::before { border-top: 2.5px solid ${T.accent}; }
          .yc-davom.on { --yc-uq: ${T.accent}; }
          .yc-kengaygan .yc-qator { grid-template-rows: auto auto auto auto auto auto; }
          .yc-kengaygan .yc-k { grid-row: span 6; }
          .yc-kengaygan .yc-k .yc-kk { grid-row: 6; align-self: start; padding-top: 12px; margin-top: 0; }
          .yc-kengaygan .yc-m { font-size: 11.5px; }
          .yc-kengaygan .yc-n.kenG .yc-m { font-size: 13px; }
          .yc-kengaygan .yc-sdl em { font-size: 11.5px; line-height: 1.3; hyphens: auto; -webkit-hyphens: auto; overflow-wrap: break-word; padding-left: 2px; padding-right: 2px; }
          .yc-kengaygan .yc-sd-q, .yc-kengaygan .yc-sdl { padding-left: 20px; }
          .yc-kengaygan .yc-bel em { font-size: 12px; padding: 3px 10px; }
          .yc-kengaygan .yc-bel { flex-direction: column; align-items: stretch; text-align: center; }
          .yc-kengaygan .yc-kar.keyin .yc-q { font-size: 13px; font-weight: 700; }
        }
        /* Telefon (393): chiziq vertikal — nuqtalar tepadan pastga, kartalar o'ngda, «Keyin» eng pastda */
        @media (max-width: 640px) {
          .yc-qator { grid-template-columns: 1fr; grid-template-rows: none; }
          .yc-qavslar { display: flex; justify-content: space-between; gap: 8px; grid-template-columns: none; }
          .yc-qavs, .yc-qavs.k { grid-column: auto !important; margin: 0; border-bottom: none; padding: 0; }
          .yc-qavs::before, .yc-qavs::after { display: none; }
          .yc-n { grid-row: auto; grid-template-rows: none; grid-template-columns: 30px 1fr; justify-items: start; text-align: left; column-gap: 8px; }
          .yc-n > .yc-o { grid-column: 1; grid-row: 1 / span 6; width: 30px; height: auto; min-height: 30px; align-self: stretch; align-items: flex-start; padding-top: 6px; }
          .yc-n > :not(.yc-o) { grid-column: 2; }
          .yc-m { grid-row: auto; width: auto; min-height: 0; justify-content: flex-start; padding: 7px 0 0; text-align: left; }
          .yc-l, .yc-r { top: 0; left: 50%; right: auto; width: 0; height: auto; border-top: none; border-left: 2px dashed ${fon(T.ink2, 0.35)}; }
          .yc-l { top: 0; height: 15px; bottom: auto; } .yc-r { top: 15px; bottom: 0; }
          .yc-l.on, .yc-r.on { border-top: none; border-left: 2.5px solid ${T.accent}; }
          .yc-d { margin-top: 0; }
          .yc-k .yc-l.kirish::after { right: auto; top: 6px; left: -6px; border: 5px solid transparent; border-top: 7px solid var(--yc-uq, ${fon(T.ink2, 0.55)}); }
          .yc-kar { width: 100%; margin: 4px 0 10px; }
          .yc-kk { align-items: flex-start; padding: 0; margin: 4px 0 8px; grid-row: auto; }
          .yc-bel { justify-content: flex-start; }
          .yc-osti { margin: 2px 0 8px; }
          .yc-n.kenG .yc-o { padding-left: 0; justify-content: center; }
          .yc-n.kenG .yc-o > .yc-d { position: relative; left: auto; }
          .yc-sd-q { display: none; }
          .yc-sdl { grid-template-columns: 1fr 1fr; padding-left: 0; margin-bottom: 8px; }
          .yc-sdl em { text-align: left; }
          /* Kengaygan (7-ekran): pastki nuqtasiz modullar (1–8) bitta gorizontal qatorda — kartalar birinchi ekranga sig'adi (SABOQ 11) */
          .yc-kengaygan .yc-qator { grid-template-columns: repeat(var(--oddiy), minmax(0, 1fr)); }
          .yc-kengaygan .yc-n.kenG, .yc-kengaygan .yc-k { grid-column: 1 / -1; }
          .yc-kengaygan .yc-n:not(.kenG):not(.yc-k) { grid-template-columns: none; justify-items: center; text-align: center; margin-bottom: 8px; }
          .yc-kengaygan .yc-n:not(.kenG):not(.yc-k) > .yc-o { grid-column: auto; grid-row: auto; width: 100%; height: 26px; min-height: 0; align-items: center; padding-top: 0; }
          .yc-kengaygan .yc-n:not(.kenG):not(.yc-k) > :not(.yc-o) { grid-column: auto; }
          .yc-kengaygan .yc-n:not(.kenG):not(.yc-k) .yc-m { justify-content: center; padding: 0; }
          .yc-kengaygan .yc-n:not(.kenG):not(.yc-k) .yc-bo { display: none; }
          .yc-kengaygan .yc-n:not(.kenG):not(.yc-k) .yc-l, .yc-kengaygan .yc-n:not(.kenG):not(.yc-k) .yc-r { top: 50%; bottom: auto; height: 0; width: auto; border-left: none; border-top: 2px dashed ${fon(T.ink2, 0.35)}; }
          .yc-kengaygan .yc-n:not(.kenG):not(.yc-k) .yc-l { left: 0; right: 50%; } .yc-kengaygan .yc-n:not(.kenG):not(.yc-k) .yc-r { left: 50%; right: 0; }
          .yc-kengaygan .yc-n:not(.kenG):not(.yc-k) .yc-l.on, .yc-kengaygan .yc-n:not(.kenG):not(.yc-k) .yc-r.on { border-left: none; border-top: 2.5px solid ${T.accent}; }
          .yc.yc-past { padding-bottom: 6px; padding-right: 30px; }
          /* Voqea (Uzum, 4 nuqta) telefonda ham gorizontal qoladi — sig'adi */
          .yc-voqea .yc-qator { grid-template-columns: var(--ustun); grid-template-rows: auto auto auto auto auto; }
          .yc-voqea .yc-n { grid-row: span 5; grid-template-rows: subgrid; grid-template-columns: none; justify-items: center; text-align: center; }
          .yc-voqea .yc-n > .yc-o { grid-column: auto; grid-row: auto; width: 100%; height: 30px; min-height: 0; align-items: center; padding-top: 0; }
          .yc-voqea .yc-n > :not(.yc-o) { grid-column: auto; }
          .yc-voqea .yc-m { flex-direction: column; justify-content: flex-end; align-items: center; gap: 2px; text-align: center; padding: 0 2px; min-height: 26px; font-size: 11px; }
          .yc-voqea .yc-m > span { white-space: nowrap; }
          .yc-voqea .yc-l, .yc-voqea .yc-r { top: 50%; bottom: auto; height: 0; width: auto; border-left: none; border-top: 2px dashed ${fon(T.ink2, 0.35)}; }
          .yc-voqea .yc-l { left: 0; right: 50%; } .yc-voqea .yc-r { left: 50%; right: 0; }
          .yc-voqea .yc-l.on, .yc-voqea .yc-r.on { border-left: none; border-top: 2.5px solid ${T.accent}; }
          .yc-voqea .yc-n.h-otkaz .yc-o .yc-l, .yc-voqea .yc-n.h-otkaz .yc-o .yc-r { border-top-color: transparent; }
          .yc-voqea .yc-k .yc-l.kirish::after { left: auto; right: 12px; top: -6px; border: 5px solid transparent; border-left: 7px solid var(--yc-uq, ${fon(T.ink2, 0.55)}); }
          .yc-pastida { grid-column: 1 / -1; grid-row: auto; padding-top: 4px; }
          .yc-davom { display: none; }
          .yc-ikki .yc-qator.q2 > .yc-n:first-child .yc-l { display: block; }
          .yc-otk { margin: 4px 0 10px; }
          .ycq-qator { grid-template-columns: repeat(5, minmax(0, 1fr)); }
          .ycq-n:nth-child(5n + 1) .ycq-l { display: none; }
          .ycq-d { width: 30px; height: 30px; }
          .ycq-nom { font-size: 11.5px; }
          .ycq-otk { font-size: 11px; padding: 1px 6px; overflow: visible; }
        }
        @media (prefers-reduced-motion: reduce) {
          .yc .yc-n, .yc-kar, .yc-ok, .yc-osti, .yc-otk, .yc-bel em, .yc-qavs, .yc-k, .yc-bog-l, .yc-dalil, .yp-kar, .yp-tan, .yp-kk, .yp-mash, .yp-tel, .yp-tel-e, .yp-br-ch.loy, .yp-fc-ipucha i, .yp-bos { animation: none !important; }
          .yp-voqea .q-bashorat, .yp-voqea .q-bashorat .q-chip, .yct-n::after, .yct-d, .yct-m, .ycq-n, .ycq-d, .yc-katak, .yp-br-b.sol, .yp-br-son, .yp-bel em, .yp-nat li, .yp-nat-ok, .yp-q10-n, .yp-chorla, .yp-reja-yc .yc-k .yc-d { animation: none !important; }
          .yp-s0-ok i, .yp-s0-ok i::before, .yp-taymer-h circle.o, .yp-uz-sahna.kichik { transition: none !important; }
          .yc-n.joriy .yc-d, .yc-n.kutadi .yc-d, .yc-k .yc-d { animation: none !important; }
          .yc-bog { animation: none; stroke-dashoffset: 0; }
        }
        /* === Ekran bo'laklari (yp-) === */
        .yp-javob { margin: 4px 0 0; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); line-height: 1.5; color: ${T.ink2}; }
        .yp-s0 { display: grid; grid-template-columns: minmax(0, 1.25fr) 40px minmax(0, 1fr); align-items: center; gap: 0 4px; }
        .yp-s0-ok { position: relative; height: 2px; align-self: center; margin-top: 26px; }
        .yp-s0-ok i { position: absolute; inset: 0; border-top: 2px dashed ${T.accent}; transform: scaleX(0); transform-origin: right; transition: transform .5s ease-out .45s; }
        .yp-s0-ok i::before { content: ''; position: absolute; left: -2px; top: -7px; border: 6px solid transparent; border-right: 8px solid ${T.accent}; border-left: none; opacity: 0; transition: opacity .2s ease-out .9s; }
        .yp-s0.ochiq .yp-s0-ok i { transform: scaleX(1); }
        .yp-s0.ochiq .yp-s0-ok i::before { opacity: 1; }
        .yp-s0 .yc-tik { padding-left: 4px; }
        .yp-br { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.4); }
        .yp-br-bosh { display: flex; align-items: center; gap: 5px; padding: 8px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .yp-br-bosh i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; }
        .yp-br-url { margin-left: 8px; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; background: ${T.paper}; border-radius: 6px; padding: 3px 9px; }
        .yp-br-ichi { display: flex; flex-direction: column; gap: 6px; padding: 12px 16px 14px; }
        .yp-br-ism { width: 46%; height: 12px; border-radius: 4px; background: ${T.ink}; opacity: .8; margin-bottom: 4px; }
        .yp-br-b { font-size: 11px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .06em; margin-top: 4px; }
        .yp-br-b.on { color: ${T.accent}; display: flex; align-items: center; gap: 8px; }
        .yp-br-b.sol { animation: yp-halqa-m 1.4s ease-out .6s 2; border-radius: 6px; }
        .yp-br-son { display: inline-flex; align-items: center; justify-content: center; min-width: 22px; height: 22px; padding: 0 6px; border-radius: 999px; background: ${T.accent}; color: #FFFFFF; font-size: 12px; letter-spacing: 0; animation: ycq-tush .45s cubic-bezier(.2,.9,.3,1.5) .3s both; }
        @keyframes yp-halqa-m { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        .yp-br-ch { height: 7px; border-radius: 4px; background: ${T.line}; width: 86%; transition: background .4s; }
        .yp-br-ch.qisqa { width: 58%; }
        .yp-br-ch.loy { width: 72%; }
        .yp-br-ch.loy.toq { background: ${T.ink2}; animation: yp-toq .4s ease-out both; animation-delay: calc(var(--i) * 0.12s); }
        @keyframes yp-toq { from { background: ${T.line}; } }
        .yp-ovoz { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .yp-ovoz-q { display: grid; grid-template-columns: 1fr 90px 26px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink2}; }
        .yp-ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .yp-ovoz-y { height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .yp-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width .5s; }
        .yp-reja-yc { margin-top: 6px; }
        .yp-reja-yc .yc-kar { margin: 6px 3px 0; width: calc(100% - 6px); padding: 6px 7px; }
        .yp-reja-yc .yc-q b { font-size: 9px; }
        .yp-reja-yc .yc-m { font-size: 12px; min-height: 22px; }
        .yp-reja-yc .yc-k.k-toliq .yc-d { box-shadow: 0 0 0 5px ${fon(T.accent, 0.18)}; animation: ycq-tush .5s cubic-bezier(.2,.9,.3,1.5) both, yc-puls 1.6s ease-out .5s 3; }
        .yp-s2-h { display: flex; flex-direction: column; align-items: center; gap: 10px; padding-top: 6px; }
        .yp-dasta { position: relative; display: flex; justify-content: center; }
        .yp-dasta-q { position: absolute; inset: 0; border-radius: 16px; background: ${T.paper}; border: 1.5px solid ${T.line}; }
        .yp-dasta-q.q1 { transform: translate(7px, 6px) rotate(2deg); opacity: .8; }
        .yp-dasta-q.q2 { transform: translate(14px, 12px) rotate(4deg); opacity: .5; }
        .yp-kar { position: relative; z-index: 1; font: inherit; cursor: grab; display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 280px; padding: 18px 34px; border-radius: 16px; background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.55); animation: yp-kar-kir .45s cubic-bezier(.2,.9,.3,1.2) both; transition: border-color .2s, box-shadow .2s; }
        @keyframes yp-kar-kir { from { opacity: 0; transform: translateY(18px) scale(.94); } to { opacity: 1; transform: none; } }
        .yp-kar b { font-size: 23px; font-weight: 800; }
        .yp-kar.on { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}, 0 10px 22px -14px rgba(${T.shadowBase},0.5); }
        .yp-kar.chorla { animation: yp-kar-kir .45s cubic-bezier(.2,.9,.3,1.2) both, yp-halqa 1.8s ease-out .6s 3; }
        .yp-chorla { animation: yp-chegara 1.6s ease-in-out .5s 3; }
        .yp-kar.silk { animation: yc-silk .45s ease-out; border-color: ${T.err}; }
        .yp-kar-y { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.ink2}; }
        .yp-ishora { margin-top: 4px; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 999px; padding: 2px 10px; animation: fade-step .3s ease-out both; }
        p.yp-nishon { margin: 0; font-size: 12px; color: ${T.ink2}; text-align: center; }
        p.yp-nishon.ketdi { opacity: .75; }
        @keyframes yp-halqa { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        .yp-s4-h { position: relative; display: flex; flex-direction: column; gap: 10px; padding-top: 12px; }
        .yp-s4-h::before { content: ''; position: absolute; top: 0; left: calc((var(--q) + 0.5) * 33.333% - 9px); border: 9px solid transparent; border-bottom: 10px solid ${T.accent}; border-top: none; transition: left .45s cubic-bezier(.2,.8,.2,1); }
        .yp-s4-yc .yc-kar { min-height: 92px; }
        .yp-s4-yc .yc-n.joriy .yc-kar { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .yp-tan-ro { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; padding: 12px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.accent}; }
        .yp-tan { font: inherit; text-align: left; cursor: pointer; font-size: 14px; font-weight: 600; line-height: 1.4; color: ${T.ink}; padding: 11px 14px; border-radius: 11px; background: ${T.bg}; border: 1.5px solid ${T.line}; transition: border-color .2s, background .2s; animation: yp-kar-kir .4s ease-out both; animation-delay: calc(var(--j) * 0.09s); }
        .yp-tan:hover:not(:disabled) { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .yp-tan.silk { animation: yc-silk .45s ease-out; border-color: ${T.err}; }
        .yp-nuq { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .yp-nuq-l { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; margin-right: 6px; }
        .yp-nuq i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; transition: background .3s, transform .3s; }
        .yp-nuq i.ok { background: ${T.ok}; } .yp-nuq i.cur { background: ${T.accent}; transform: scale(1.25); }
        .yp-voqea { display: flex; flex-direction: column; gap: 6px; width: 100%; animation: fade-step .35s ease-out both; }
        .yp-voqea-h { font-weight: 800; font-size: clamp(16px,1.9vw,19px); color: ${T.ink}; text-align: center; }
        .yp-voqea .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 8px 14px; }
        .yp-voqea .q-bashorat .q-yorliq { margin: 0; }
        .yp-voqea .q-bashorat .q-variantlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .yp-voqea .q-bashorat { animation: yp-kar-kir .45s ease-out .25s both; }
        .yp-voqea .q-bashorat .q-chip { animation: yp-kar-kir .4s ease-out both; }
        .yp-voqea .q-bashorat .q-chip:nth-child(1) { animation-delay: .45s; } .yp-voqea .q-bashorat .q-chip:nth-child(2) { animation-delay: .55s; } .yp-voqea .q-bashorat .q-chip:nth-child(3) { animation-delay: .65s; }
        .yp-voqea .q-taxmin { text-align: center; }
        .yp-uzum { font-weight: 800; color: #7000FF; white-space: nowrap; }
        .yp-uz-sahna { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        p.yp-uz-tanish { margin: 0; font-size: 14px; color: ${T.ink}; text-align: center; animation: fade-step .4s ease-out both; }
        .yp-uz-q { display: flex; align-items: flex-end; justify-content: center; gap: clamp(18px, 5vw, 56px); flex-wrap: wrap; }
        .yp-uz-tq, .yp-uz-lq { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .yp-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; letter-spacing: .04em; padding: 3px 11px; border-radius: 999px; animation: fade-step .35s ease-out both; }
        .yp-tag.oldin { background: ${T.paper}; color: ${T.ink2}; border: 1px solid ${T.line}; }
        .yp-tag.keyin { background: ${T.okFon}; color: ${T.ok}; }
        .yp-tel { position: relative; width: 100px; height: 172px; background: linear-gradient(160deg,#2A2933,#16151C); border-radius: 22px; padding: 6px; box-shadow: 0 16px 28px -14px rgba(${T.shadowBase},0.6); animation: yc-kir .38s ease-out both; }
        .yp-tel-k { position: absolute; top: 6px; left: 50%; transform: translateX(-50%); width: 36%; height: 10px; border-radius: 0 0 7px 7px; background: #16151C; z-index: 3; }
        .yp-tel-e { width: 100%; height: 100%; border-radius: 17px; overflow: hidden; background: #F4F4F6; display: flex; flex-direction: column; animation: fade-step .45s ease-out both; }
        .yp-tel.chat .yp-tel-e { background: #DCE8F1; }
        .yp-ch-bosh { display: flex; align-items: center; gap: 6px; padding: 16px 8px 6px; background: #FFFFFF; }
        .yp-ch-bosh i { width: 16px; height: 16px; border-radius: 50%; background: #9CC6E4; }
        .yp-ch-bosh span { flex: 1; height: 6px; border-radius: 3px; background: #C9D3DC; }
        .yp-ch-ro { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 8px 7px; }
        .yp-pf { display: flex; flex-direction: column; gap: 4px; max-width: 78%; padding: 6px 8px; border-radius: 10px; background: #FFFFFF; animation: yc-kir .35s ease-out both; }
        .yp-pf:nth-child(2) { animation-delay: .15s; } .yp-pf:nth-child(3) { animation-delay: .3s; } .yp-pf:nth-child(4) { animation-delay: .45s; } .yp-pf:nth-child(5) { animation-delay: .6s; }
        .yp-pf.chap { align-self: flex-start; border-bottom-left-radius: 3px; }
        .yp-pf.ong { align-self: flex-end; background: #E1F7CB; border-bottom-right-radius: 3px; }
        .yp-pf i { display: block; width: 62px; height: 5px; border-radius: 3px; background: #C9D3DC; }
        .yp-pf i.q { width: 38px; }
        .yp-pf.rasm { padding: 4px; }
        .yp-pf.rasm b { display: block; width: 66px; height: 42px; border-radius: 7px; background: linear-gradient(135deg, #F6C9A8, #E8956B); }
        .yp-uz-bosh { display: flex; flex-direction: column; gap: 4px; padding: 12px 7px 5px; background: #FFFFFF; }
        .yp-uz-bosh .yp-uzum { font-size: 14px; }
        .yp-uz-bosh .yp-uz-q { display: block; height: 14px; border-radius: 7px; background: #EEEEF2; }
        .yp-uz-ro { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding: 6px; }
        .yp-uz-m { display: flex; flex-direction: column; gap: 3px; background: #FFFFFF; border-radius: 7px; padding: 4px; }
        .yp-uz-m i { display: block; height: 15px; border-radius: 4px; }
        .yp-uz-m.m0 i { background: #FFD7C2; } .yp-uz-m.m1 i { background: #CDE7FF; } .yp-uz-m.m2 i { background: #D9F2D5; } .yp-uz-m.m3 i { background: #F1DBFF; }
        .yp-uz-m b { display: block; height: 5px; width: 70%; border-radius: 3px; background: #D5D5DE; }
        .yp-uz-yet { margin-top: auto; display: flex; align-items: center; gap: 6px; padding: 5px 8px; background: #7000FF; color: #FFFFFF; font-size: 11px; font-weight: 800; }
        .yp-mini-m { display: inline-block; width: 16px; height: 9px; border-radius: 2px 5px 2px 2px; background: #FFFFFF; }
        .yp-yol { position: relative; width: 220px; height: 104px; }
        .yp-yol-c { position: absolute; left: 0; right: 0; bottom: 10px; height: 4px; border-radius: 2px; background: repeating-linear-gradient(90deg, ${T.line} 0 14px, transparent 14px 24px); } /* kesik-ok: yo'l o'rtasidagi chiziq — yetkazib beruvchi mashina rasmining qismi */
        .yp-mash { position: absolute; left: 6px; bottom: 14px; width: 92px; height: 50px; z-index: 2; }
        .yp-yol.yur .yp-mash { animation: yp-yur 1.6s cubic-bezier(.3,.7,.3,1) both; }
        .yp-mash-k { position: absolute; left: 0; bottom: 10px; width: 64px; height: 38px; border-radius: 6px 4px 3px 3px; background: #7000FF; }
        .yp-mash-t { position: absolute; left: 60px; bottom: 10px; width: 30px; height: 28px; border-radius: 3px 12px 3px 3px; background: #5A00CC; box-shadow: inset -6px 6px 0 -2px #CFE6FF; }
        .yp-mash i { position: absolute; bottom: 0; width: 18px; height: 18px; border-radius: 50%; background: #1B1630; box-shadow: inset 0 0 0 5px #3A3550; }
        .yp-mash i.g1 { left: 10px; } .yp-mash i.g2 { left: 64px; }
        .yp-punkt { position: absolute; right: 4px; bottom: 14px; width: 96px; height: 86px; }
        .yp-punkt-t { position: absolute; left: -4px; right: -4px; top: 0; height: 16px; border-radius: 4px 4px 0 0; background: #7000FF; }
        .yp-punkt::before { content: ''; position: absolute; left: 0; right: 0; top: 14px; bottom: 0; background: #FFFFFF; border: 1.5px solid #D9D3EE; border-top: none; border-radius: 0 0 4px 4px; }
        .yp-punkt-d { position: absolute; left: 12px; bottom: 0; width: 26px; height: 46px; border-radius: 3px 3px 0 0; background: #CFC6EF; z-index: 1; }
        .yp-punkt-o { position: absolute; right: 10px; top: 28px; width: 46px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; z-index: 1; }
        .yp-punkt-o i { height: 14px; border-radius: 2px; background: #E8B98A; box-shadow: inset 0 -3px 0 #C99566; }
        @keyframes yp-yur { from { transform: translateX(-70px); opacity: .2; } to { transform: none; opacity: 1; } }
        .yp-taxmin { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 14px; padding: 9px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; animation: fade-step .3s ease-out both; }
        .yp-taxmin-s { font-size: 13.5px; font-weight: 600; color: ${T.ink2}; min-width: 0; }
        .yp-taxmin-b { font-size: 13.5px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 12px; border-radius: 999px; white-space: nowrap; }
        .yp-s7-h { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .yp-kk-ro { display: flex; flex-direction: column; gap: 10px; width: min(100%, 560px); }
        .yp-kk { position: relative; font: inherit; cursor: pointer; display: flex; align-items: center; gap: 12px; text-align: left; font-size: 14.5px; font-weight: 700; line-height: 1.4; color: ${T.ink}; padding: 12px 16px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 6px 14px -12px rgba(${T.shadowBase},0.5); transition: border-color .2s, opacity .3s, transform .2s; animation: yp-kar-kir .4s ease-out both; animation-delay: calc(var(--j) * 0.1s); }
        .yp-kk > span { flex: 1; min-width: 0; }
        .yp-kk-uq { flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; background: ${T.accentSoft}; position: relative; transition: background .2s; }
        .yp-kk-uq::after { content: ''; position: absolute; left: 10px; top: 8px; border: 5px solid transparent; border-left: 7px solid var(--yp-uq, ${T.accent}); }
        .yp-kk:hover:not(:disabled) { border-color: ${T.accent}; transform: translateX(3px); }
        .yp-kk:hover:not(:disabled) .yp-kk-uq { background: ${T.accent}; }
        .yp-kk:hover:not(:disabled) .yp-kk-uq { --yp-uq: #FFFFFF; }
        .yp-kk.chorla { animation: yp-kar-kir .4s ease-out both, yp-chegara 1.6s ease-in-out .8s 3; animation-delay: calc(var(--j) * 0.1s), calc(var(--j) * 0.25s + 0.8s); }
        .yp-kk.on { border-color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accentSoft}; }
        .yp-kk.ketdi { opacity: .3; animation: none; }
        .yp-kk:disabled { cursor: default; }
        .yp-s7-n { display: flex; flex-direction: column; gap: 4px; }
        p.yp-kulrang { margin: 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; }
        .yp-forma { display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 14px; padding: 14px 16px; animation: yc-kir .3s ease-out both; }
        .yp-forma-h { font-size: 12px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; color: ${T.accent}; }
        .yp-forma-s { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .yp-mayd { display: flex; flex-direction: column; gap: 4px; }
        .yp-mayd > span { font-size: 10.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .yp-kirit { font: inherit; font-size: 14.5px; line-height: 1.45; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 9px 12px; resize: none; overflow: hidden; outline: none; transition: border-color .2s, background .2s; }
        .yp-kirit:focus { border-color: ${T.accent}; background: ${T.paper}; }
        .yp-kirit.err { background: ${T.errFon}; border-color: ${T.err}; }
        .yp-forma-t { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .yp-forma-t > :last-child { margin-left: auto; }
        .yp-chip-ro { display: flex; flex-wrap: wrap; gap: 7px; }
        .yp-mini { padding: 4px 10px !important; font-size: 11.5px !important; align-self: flex-start; }
        .yp-bos { animation: yp-halqa 1.8s ease-out .5s 3; }
        .yp-saq { display: flex; justify-content: flex-end; }
        .yp-taymer { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 6px 0 4px; }
        .yp-taymer-h { position: relative; width: 150px; height: 150px; }
        .yp-taymer > .q-btn { margin: 0 auto !important; }
        .yp-taymer-h svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .yp-taymer-h circle { fill: none; stroke-width: 9; }
        .yp-taymer-h circle.f { stroke: ${T.line}; }
        .yp-taymer-h circle.o { stroke: ${T.accent}; stroke-linecap: round; transition: stroke-dashoffset 1s linear; }
        .yp-taymer-s { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 34px; font-weight: 800; color: ${T.ink}; }
        .yp-taymer.yur .yp-taymer-s { color: ${T.accent}; }
        .yp-strip { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; align-self: flex-start; padding: 6px 12px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .yp-strip-l { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.accent}; }
        .yp-strip-d { position: relative; width: 120px; height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .yp-strip-d i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; background: ${T.accent}; transition: width .6s ease-out; }
        .yp-strip-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .yp-darvoza { display: flex; flex-direction: column; gap: 8px; margin: 8px 0 10px; }
        .yp-darvoza-s { font-size: 14px; font-weight: 700; color: ${T.ink}; }
        ol.yp-vazifa { list-style: none; display: flex; flex-direction: column; gap: 7px; margin: 4px 0 8px; }
        ol.yp-vazifa li { display: flex; gap: 9px; align-items: flex-start; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        ol.yp-vazifa li i { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .yp-yordam { display: flex; flex-direction: column; gap: 7px; align-items: flex-start; }
        .yp-kodoyna { display: flex; flex-direction: column; gap: 10px; }
        .yp-kod { margin: 0; background: ${CODE.bg}; color: ${CODE.text}; border-radius: 12px; padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; user-select: none; -webkit-user-select: none; }
        .yp-kod-iz { color: ${CODE.comment}; font-style: italic; }
        .yp-kod-k { font-weight: 700; color: ${CODE.attr}; border-radius: 4px; transition: background .4s, color .4s; }
        .yp-kod.ajrat .yp-kod-k { background: ${CODE.attr}; color: ${CODE.bg}; padding: 0 3px; }
        .yp-amal { display: flex; justify-content: flex-end; }
        /* 6-ekran yakuni (SABOQ 25): sahna kichrayadi, taxmin — xulosaning birinchi qatori */
        .yp-uz-sahna.kichik { transform: scale(.72); transform-origin: top center; margin-bottom: -44px; transition: transform .5s ease-out; }
        .yp-nat-tx { display: block; margin-bottom: 6px; font-size: 13.5px; font-weight: 700; color: ${T.ink2}; }
        .yp-nat-tx b { color: ${T.ink}; }
        .yp-nat-tx.ok { color: ${T.ok}; }
        /* 9-ekran (SABOQ 29): bitta katta karta, maydonlar yonma-yon, joy keng */
        .q-mustaqil:has(.yp-f9), .q-mustaqil:has(.yp-q10) { max-width: none; }
        .yp-f9 { gap: 12px; padding: 16px 18px; }
        .yp-f9-ro { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.6fr); gap: 14px; align-items: start; }
        .yp-f9-ro .yc-q { font-size: 14px; }
        .yp-f9-otk { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .yp-f9-otk .ycq-otk { font-size: 13px; padding: 4px 12px; }
        /* 10-ekran: bir vaqtda bitta qadam katta */
        .yp-q10 { gap: 12px; padding: 16px 18px; max-width: 760px; width: 100%; margin: 0 auto; }
        .yp-q10-bosh { display: flex; align-items: center; gap: 10px; font-size: 15.5px; font-weight: 800; color: ${T.ink}; }
        .yp-q10-bosh > span { flex: 1; min-width: 0; }
        .yp-q10-bosh em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .yp-q10-n { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: ${T.accent}; color: #FFFFFF; font-style: normal; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .yp-q10-n.ok { background: ${T.ok}; animation: ycq-tush .5s cubic-bezier(.2,.9,.3,1.5) both; }
        .yp-q10.saq { border-color: ${T.ok}; }
        p.yp-q10-k { margin: 0; font-size: 15px; line-height: 1.5; color: ${T.ink}; }
        p.yp-q10-k b { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; margin-right: 6px; }
        .yp-mayd > span .yp-bel { margin-left: 10px; letter-spacing: 0; text-transform: none; }
        .yp-bel { display: inline-flex; flex-wrap: wrap; gap: 5px; vertical-align: middle; }
        .yp-bel em { font-style: normal; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; padding: 2px 9px; border-radius: 999px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .yp-bel em.ok { background: ${T.okFon}; color: ${T.ok}; border-color: transparent; animation: ycq-tush .45s cubic-bezier(.2,.9,.3,1.5) both; animation-delay: calc(var(--j) * 0.15s + 0.3s); }
        .yp-q10-ch { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
        .yp-q10-ch .q-chip { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 8px 11px; }
        .yp-q10-ch .q-chip i { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .yp-q10-ch .q-chip.on i { background: ${T.accent}; color: #FFFFFF; }
        .yp-q10-ch .q-chip span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        /* 11-ekran: chap karta cho'zilmaydi (SABOQ 20), natija massivi oldindan */
        .q-kod:has(.yp-nat) { align-items: start; }
        .q-kod:has(.yp-nat) > .q-col > .q-karta { flex-grow: 0; }
        ol.yp-nat { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        ol.yp-nat li { list-style: none; display: flex; align-items: flex-start; gap: 8px; min-height: 31px; padding: 6px 10px; border-radius: 10px; border: 1.5px dashed ${fon(T.ink2, 0.35)}; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.45; color: ${T.ink}; transition: border-color .3s, background .3s; }
        .yp-nat-i { flex-shrink: 0; font-style: normal; font-weight: 700; color: ${T.ink2}; min-width: 26px; }
        .yp-nat-t { flex: 1; min-width: 0; overflow-wrap: anywhere; }
        .yp-nat-ok { flex-shrink: 0; width: 18px; height: 18px; border-radius: 50%; background: ${T.ok}; color: #FFFFFF; font-size: 11px; display: flex; align-items: center; justify-content: center; animation: ycq-tush .45s cubic-bezier(.2,.9,.3,1.5) both; }
        ol.yp-nat li.oxir .yp-nat-t { color: ${T.accent}; font-weight: 700; }
        ol.yp-nat.ochiq li { border-style: solid; border-color: ${T.line}; background: ${T.paper}; animation: yp-kar-kir .4s ease-out both; animation-delay: calc(var(--j) * 0.14s); }
        ol.yp-nat.ochiq li.oxir { border-color: ${T.accent}; background: ${T.accentSoft}; }
        ol.yp-nat li.yon { border-color: ${fon(T.ok, 0.45)}; }
        .yp-mnote-c { align-self: flex-end; }
        .yp-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .yp-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.accent}; }
        .yp-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: yp-halqa 1.8s ease-out .4s 3; }
        p.yp-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.yp-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: yc-puls 1.4s ease-out 3; }
        .yp-fikr { display: flex; flex-direction: column; gap: 3px; align-items: center; text-align: center; background: ${T.paper}; border-radius: 16px; padding: 10px 20px 14px; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .yp-fikr-l { font-weight: 800; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.yp-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        .yp-hw { display: flex; flex-direction: column; gap: 10px; }
        .yp-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .yp-hw-q { display: flex; flex-direction: column; gap: 2px; background: ${T.bg}; border-radius: 10px; padding: 8px 10px; }
        .yp-hw-k { font-size: 10.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .yp-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.yp-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        ol.yp-hw-qadam li { display: flex; gap: 9px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        ol.yp-hw-qadam li i { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .yp-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        @media (max-width: 640px) {
          .yp-hw-karta { grid-template-columns: 1fr; }
          .yp-kk-ro { width: 100%; }
          .yp-tan-ro { grid-template-columns: 1fr; }
          .yp-s4-h::before { display: none; }
          .yp-f9-ro { grid-template-columns: 1fr; }
          .yp-s0 { grid-template-columns: minmax(0, 1.1fr) 26px minmax(0, 1fr); }
          .yp-s0 .yct-m { font-size: 11.5px; }
          .yp-uz-sahna.kichik { transform: scale(.8); margin-bottom: -30px; }
          .yp-reja-yc .yc-kar, .yp-reja-yc .yc-kk { display: none; }
          .yp-reja-yc .yc-n > .yc-o { min-height: 26px; }
          .yp-kar { min-width: 0; width: 100%; }
          .yp-tel { width: 112px; height: 190px; }
          .yp-yol { width: 210px; height: 110px; }
          .yp-forma-t > :last-child { margin-left: 0; }
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
        /* Telefonda (≤640) o'ngda joy yo'q — ⛶ mazmun ustida alohida qatorda turadi, matn va kartani yopmaydi (10-Modul pilot, F-1005-171) */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
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
