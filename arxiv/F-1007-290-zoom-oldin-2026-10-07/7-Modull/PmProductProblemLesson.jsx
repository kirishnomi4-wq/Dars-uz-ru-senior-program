import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 9-MODUL · 1-DARS (PM) — «Loyihangiz kimga kerak?» (kalit m7-01). Skeletdan (src/skelet/NamunaDars.jsx) qurildi — konveyer 3-bosqich, 05.10.2026.
// Manba-haqiqat: feedback/F-1005-9modul/01-PmProductProblem-v3.md (GATE M). 17 ekran · PM 2-tur (artefakt yozma) · USTAXONA s8, s10.
// TARKIB: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletdan;
//   kontent: s0 QKirish · s1 QReja · s2/s4/s9 QTushuncha · s3/s5/s7/s12 test (QuestionScreen → QTest) · s6 QVoqea ·
//   s8/s10/s13 QMustaqil · s11 QKod (+ HtmlCompiler) · podium · QKartochka · QYakun (+ PM HwCard, M-q9).
// Bitta vizual — auditoriya-karta (AudKarta, manba KARTALAR, 180): to'liq · ixcham · qator.
// Saqlash kalitlari (tayanch 6-bo'lim): pm-m7d1-ilovalar (s8) · pm-m7d1-muammolar (s10) · pm-m7d1-tanlangan (s13, 2-dars kirishi).
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QQadamlar, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';
// Kod oynasi — umumiy modul (s11; PM-082, «Kompilyatorni ochish» platforma tugmasi)
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

const LESSON_META = { lessonId: 'pm-m7d1-v1', lessonTitle: { uz: 'Loyihangiz kimga kerak?', ru: 'Кому нужен ваш проект?' } };
// 17 ekran · oqim: kirish → reja → tushuncha → 1-savol → uch mahsulot → 2-savol → Dropbox → 3-savol → mustaqil ish → Mentor ro'yxati → juftlik → kod → yakuniy savol → o'ylab ko'ring → podium → kartochkalar → yakun
// Uyga vazifa banneri fonidagi so'zlar (R-008)
const HW_TOKENS = [
  { t: { uz: 'muammo', ru: 'проблема' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'odam', ru: 'человек' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: "ro'yxat", ru: 'список' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'savol', ru: 'вопрос' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0  · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1  · QReja
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 2  · QTushuncha: loyiha va mahsulot
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 3  · 1-savol
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 4  · QTushuncha: uch mahsulot
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 5  · 2-savol
  { id: 's6',  type: 'case',        template: 'custom',   scored: false, scope: null },            // 6  · QVoqea: Dropbox
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 7  · 3-savol
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 8  · QMustaqil: USTAXONA 1
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 9  · QTushuncha: Mentor ro'yxati
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },            // 10 · QMustaqil: USTAXONA 2
  { id: 's11', type: 'koding',      template: 'custom',   scored: false, scope: null },            // 11 · QKod
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 12 · yakuniy savol
  { id: 's13', type: 'reflection',  template: 'custom',   scored: false, scope: null },            // 13 · QMustaqil: 2 qadam
  { id: 'podium', type: 'stats',      template: 'custom', scored: false, scope: null },            // 14 · podium
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },            // 15 · QKartochka
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }             // 16 · QYakun
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
  const faol = !((freeRide ? false : disabled) || locked); // F-1005-85: yoqilgan tugma — keyingi bosiladigan joy (halqa + qisqa puls)
  return <button className={`btn-white-accent${faol ? ' pp-bos-nav' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Dars yangi — ✔ o'rni MD bo'yicha birinchi marta: s3 = C · s5 = B · s7 = D · s12 = A.
const INLINE_KEYS = { s3: 2, s5: 1, s7: 3, s12: 0 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: 'Loyiha va mahsulot', ru: 'Проект и продукт' },
    cards: [
      { ic: '1', h: { uz: 'Loyiha', ru: 'Проект' }, body: { uz: 'Boshlanishi va oxiri bor qurish ishi.', ru: 'Работа по созданию, у которой есть начало и конец.' } },
      { ic: '2', h: { uz: 'Mahsulot', ru: 'Продукт' }, body: { uz: "Odamlar o'z muammosi uchun ishlatadigan sayt, ilova yoki xizmat.", ru: 'Сайт, приложение или сервис, которым люди пользуются для своей проблемы.' } },
      { ic: '3', h: { uz: 'Qanday bilinadi', ru: 'Как понять' }, body: { uz: "So'rang: odamlar uni o'z ishi uchun ishlatyaptimi? Havola qayerdan kelgani muhim emas.", ru: 'Спросите: пользуются ли им люди для своего дела? Откуда пришла ссылка — неважно.' }, ask: { uz: "Do'stingiz siz yuborgan havolani bir marta ochib ko'rdi. Bu mahsulotmi?", ru: 'Друг один раз открыл ссылку, которую вы прислали. Это продукт?' } }
    ]
  },
  5: {
    title: { uz: 'Yechimdan muammoga', ru: 'От решения к проблеме' },
    cards: [
      { ic: '1', h: { uz: "Ilovada nima ko'rinadi", ru: 'Что видно в приложении' }, body: { uz: "Ilovada odatda avval YECHIM ko'rinadi: u nima qiladi.", ru: 'В приложении обычно сначала видно РЕШЕНИЕ: что оно делает.' } },
      { ic: '2', h: { uz: 'MUAMMO qatori', ru: 'Строка ПРОБЛЕМА' }, body: { uz: 'Ilovasiz odam nimadan qiynalganini yozamiz.', ru: 'Пишем, с чем человек мучился без приложения.' } },
      { ic: '3', h: { uz: 'Muammo emas', ru: 'Не проблема' }, body: { uz: 'Xohish yoki rost fakt: unda hech kim qiynalmagan.', ru: 'Желание или просто факт: в нём никто не мучился.' }, ask: { uz: "Yandex Go bo'lmasa, yo'lovchi nimadan qiynalardi?", ru: 'Без Yandex Go с чем мучился бы пассажир?' } }
    ]
  },
  7: {
    title: { uz: 'Boshqalarga ham kerakmi', ru: 'Нужен ли другим' },
    cards: [
      { ic: '1', h: { uz: 'Boshlanishi', ru: 'Начало' }, body: { uz: 'Dropbox fleshkasini uyda unutgan dasturchining muammosidan boshlangan.', ru: 'Dropbox начался с проблемы программиста, который забыл флешку дома.' } },
      { ic: '2', h: { uz: 'Bir kunda', ru: 'За один день' }, body: { uz: "Video chiqqach, bir kun ichida 75 000 kishi kutish ro'yxatiga yozildi.", ru: 'После выхода видео за один день 75 000 человек записались в список ожидания.' } },
      { ic: '3', h: { uz: 'Kerakligi bilindi', ru: 'Стало понятно, что нужен' }, body: { uz: "Kutish ro'yxati shu muammo boshqalarda ham borligini ko'rsatdi.", ru: 'Список ожидания показал, что эта проблема есть и у других.' }, ask: { uz: 'Siz qurgan bot boshqalarga ham kerakligini qanday bilasiz?', ru: 'Как вы узнаете, что ваш бот нужен и другим?' } }
    ]
  },
  12: {
    title: { uz: "Avval kimdan so'raysiz", ru: 'Кого спросить сначала' },
    cards: [
      { ic: '1', h: { uz: 'Uch belgi', ru: 'Три признака' }, body: { uz: "Muammo odamning qilgan ishida ko'rinadi: qayta-qayta bo'ladi, odam o'zicha yo'l topgan yoki voz kechgan.", ru: 'Проблема видна в том, что человек делал: она повторяется, человек сам нашёл обходной путь или отказался.' } },
      { ic: '2', h: { uz: "Faqat sizda bo'lsa", ru: 'Если только у вас' }, body: { uz: "So'raydigan boshqa odam yo'q.", ru: 'Больше некого спросить.' } },
      { ic: '3', h: { uz: "Ko'p odamda bo'lsa", ru: 'Если у многих' }, body: { uz: "Avval o'shalardan so'raysiz.", ru: 'Сначала спрашиваете их самих.' }, ask: { uz: "Ro'yxatingizdagi qaysi muammo boshqalarda ham bor?", ru: 'Какая проблема из вашего списка есть и у других?' } }
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

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, vizual, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
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
  // F-1005-77: savol ostidagi karta ekranga kirganda yo'q — javob topilgach (jonli darsda natija ochilgach) to'g'ri javobni ko'rsatadi
  const kartaOchiq = isMentorLive ? mReveal : (solved && !waiting);
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' }))} onClick={onNext} /></>}>
      {/* D1/DE-203: ko'rinish — qolip QTest (texnik darslar standarti); mantiq (jonli ball, bitta urinish, mentor ochishi) — shu yerda */}
      <QTest
        savol={<>{tr(question)}{vizual && kartaOchiq && vizual()}</>}
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

// ===== DARSNING BITTA VIZUALI — auditoriya-karta (AudKarta, 163/180): KIM · MUAMMO · YECHIM («Kim mening foydalanuvchim?» darsidan) =====
// qolip-maket: pp-yozuv pp-qrow
// Uch ko'rinish bitta komponentdan: toliq (3 qator) · ixcham (nom + KIM) · qator (joy yorlig'i + gap). ust — karta tepasidagi maket (s2 qurilmalari).
// Qator holati: bo'sh (skelet uzuq chiziq) → yozildi (matn bir lahza ajralib kiradi) → joriy (accent) → xato (errFon). Rangli yon chiziq yo'q — «mahsulot» faqat yorliqda (F-1005-79).
// Manba — KARTALAR (pastda): NARSALAR (s0, s2) · MAHSULOTLAR (s4) · UZUM (s5) · DROPBOX (s6) · ROYXAT_MENTOR + MAYDON (s9, s11, s13).
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const SLOT = { kim: { uz: 'KIM', ru: 'КТО' }, muammo: { uz: 'MUAMMO', ru: 'ПРОБЛЕМА' }, yechim: { uz: 'YECHIM', ru: 'РЕШЕНИЕ' } };
const NEGA = { korsatish: { uz: "ko'rsatish uchun", ru: 'чтобы показать' }, ozIshi: { uz: "o'z ishi uchun", ru: 'для своего дела' } };
const KYORLIQ = { loyiha: { uz: 'loyiha', ru: 'проект' }, mahsulot: { uz: 'mahsulot', ru: 'продукт' } };
const HALI = { uz: "hali yo'q", ru: 'пока нет' };
const cxx = (...a) => a.filter(Boolean).join(' ');

// Brend nomi o'z rangida (PM-028, PM-029, S-018): logotip chizilmaydi — faqat nom. Ranglar maket mazmuni, mavzu tokeni emas (CSS: .pp-brend.<id>).
const BREND = { yandex: 'Yandex Go', payme: 'Payme', translate: 'Google Translate', dropbox: 'Dropbox', telegram: 'Telegram', uzum: 'Uzum Market' };
const Brend = ({ id, children }) => <span className={cxx('pp-brend', id)}>{children || BREND[id]}</span>;
// Chizilgan telefon (CSS): ramka · kesik · ekran. rang — ekran foni brend rangida (yandex | payme | translate | telegram); kichik — s2, katta — s4.
const Telefon = ({ rang, kichik, className, children }) => (
  <div className={cxx('pp-tel', rang, kichik ? 'kichik' : 'katta', className)} aria-hidden="true">
    <span className="pp-tel-kesik" />
    <div className="pp-tel-ekran">{children}</div>
  </div>
);
// F-1005-85 (qat'iy): bashorat tanlangach karta yo'qolmaydi — ixcham qator «Taxminingiz: N» natija (QTaxmin) chiqquncha turadi
const Bashorat = ({ yorliq, savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <QBashorat yorliq={yorliq} savol={savol} variantlar={variantlar} tanlov={tanlov} onTanla={onTanla} />
  : <div className="pp-taxmin-q" role="status"><span className="pp-taxmin-s">{savol}</span><span className="pp-taxmin-b">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{(variantlar.find(v => v.k === tanlov) || {}).t}</b></span></div>);
// Kichik bosh-siluet to'plami (maket ichida: telefon ekrani, kutish ro'yxati, olomon)
const Odamcha = ({ n, sinf = 'pp-odamcha' }) => Array.from({ length: n }).map((_, k) => <i key={k} className={sinf} style={{ '--k': k }} />);

// Chizilgan bosh-siluet (CSS doira + yarim doira, emoji emas)
const Siluet = ({ son = 1 }) => (
  <span className="ak-sil" aria-hidden="true">{Array.from({ length: son }).map((_, i) => <i key={i} style={{ animationDelay: `${i * 0.09}s` }} />)}</span>
);
const Odam = ({ o }) => (
  <span className={cxx('ak-odam', o.nega, o.so && 'so', o.kir && 'kir')}>
    <Siluet son={o.son || 1} />
    {o.t && <span className="ak-odam-t">{tr(o.t)}</span>}
    {o.nega && <span className={cxx('ak-nega', o.nega)}>{tr(NEGA[o.nega])}</span>}
  </span>
);
// q: { odamlar?, uyalar?, matn?, matnKey?, ichi? (kiritish qatori), hali?, holat? }
const AkQator = ({ slot, q }) => {
  const v = q || {};
  const odamlar = v.odamlar || [];
  const bor = !!v.matn || odamlar.length > 0 || v.uyalar > 0 || !!v.ichi;
  return (
    <div className={cxx('ak-q', v.holat)}>
      <span className="ak-slot">{tr(SLOT[slot])}</span>
      <div className="ak-q-b">
        {odamlar.map((o, i) => <Odam key={o.id ?? i} o={o} />)}
        {v.uyalar > 0 && Array.from({ length: v.uyalar }).map((_, i) => <span key={`u${i}`} className="ak-uya" aria-hidden="true" />)}
        {v.matn && <span key={v.matnKey ?? 'm'} className="ak-matn">{v.matn}</span>}
        {v.ichi}
        {v.hali && <span className="ak-hali">{tr(HALI)}</span>}
        {!bor && !v.hali && <span className="ak-skelet" aria-hidden="true" />}
      </div>
    </div>
  );
};
const AudKarta = ({ tur = 'toliq', nom, yorliq, toliq, kim, muammo, yechim, tartib, joy, matn, holat, ust, className, children }) => {
  if (tur === 'qator') return (
    <div className={cxx('ak', 'ak-qator', holat, className)}>
      {joy && <span className="ak-joy">{joy}</span>}
      {matn ? <span className="ak-matn" title={typeof matn === 'string' ? matn : undefined}>{matn}</span> : <span className="ak-skelet" aria-hidden="true" />}
      {children}
    </div>
  );
  const sl = tartib || (tur === 'ixcham' ? ['kim'] : ['kim', 'muammo', 'yechim']);
  const Q = { kim, muammo, yechim };
  return (
    <div className={cxx('ak', `ak-${tur}`, toliq && 'toliq', holat, className)}>
      {ust}
      {(nom || yorliq) && <div className="ak-bosh">{nom && <span className="ak-nom">{nom}</span>}{yorliq && <span key={yorliq} className={cxx('ak-yorliq', yorliq)}>{tr(KYORLIQ[yorliq])}</span>}</div>}
      {sl.map(s => <AkQator key={s} slot={s} q={Q[s]} />)}
      {children}
    </div>
  );
};

// ----- KARTALAR — darsning yagona ma'lumot manbai (180) -----
const SIZ = { uz: 'siz', ru: 'вы' };
const DOST = { uz: "do'stingiz", ru: 'ваш друг' };
// s0, s2: to'rt narsa · nega: 'korsatish' («ko'rsatish uchun») | 'ozIshi' («o'z ishi uchun»)
const NARSALAR = [
  { id: 'portfolio', nom: { uz: 'Portfolio saytingiz', ru: 'Ваш сайт-портфолио' }, nega: 'korsatish', kim: [{ t: SIZ }, { t: { uz: 'mentor', ru: 'ментор' } }, { t: DOST, nega: 'korsatish' }] },
  { id: 'bot', nom: { uz: 'Telegram botingiz', ru: 'Ваш Telegram-бот' }, nega: 'korsatish', kim: [{ t: SIZ }, { t: DOST, nega: 'korsatish' }] },
  { id: 'yandex', nom: { uz: 'Yandex Go', ru: 'Yandex Go' }, nega: 'ozIshi', kim: [{ t: { uz: "yo'lovchilar", ru: 'пассажиры' }, nega: 'ozIshi', son: 3 }] },
  { id: 'payme', nom: { uz: 'Payme', ru: 'Payme' }, nega: 'ozIshi', kim: [{ t: { uz: 'hisobi tugaganlar', ru: 'у кого кончился баланс' }, nega: 'ozIshi', son: 3 }] }
];
const narsa = (id) => NARSALAR.find(n => n.id === id);
// s4: uch ishlaydigan mahsulot · tuzoq — bitta xato-sinf (xohish yoki rost fakt, qiynalish yo'q, S-040) · joy — to'g'ri tanlov o'rni (har qadamda boshqa)
const MAHSULOTLAR = [
  { id: 'yandex', nom: <Brend id="yandex" />, joy: 1,
    yechim: { uz: "Telefondan mashina chaqiradi, narxni oldindan ko'rsatadi.", ru: 'Вызывает машину с телефона, заранее показывает цену.' },
    muammo: { uz: "Ko'chada taksi kutardi, narxni oldindan bilmasdi", ru: 'Ждал такси на улице, не знал цену заранее' },
    tuzoq: [{ uz: "Telefonida chiroyli xarita bo'lishini xohlardi", ru: 'Хотел красивую карту в телефоне' }, { uz: "Shaharda taksi haydovchilari juda ko'p edi", ru: 'В городе было очень много таксистов' }],
    kim: { uz: "kechqurun uyga qaytayotgan yo'lovchilar", ru: 'пассажиры, которые вечером едут домой' } },
  { id: 'payme', nom: <Brend id="payme" />, joy: 2,
    yechim: { uz: "Telefon hisobini uydan turib to'ldiradi.", ru: 'Пополняет баланс телефона, не выходя из дома.' },
    muammo: { uz: "Hisobni to'ldirish uchun do'konga borardi", ru: 'Ходил в магазин, чтобы пополнить баланс' },
    tuzoq: [{ uz: "Ilovada ko'p tugma bo'lishini xohlardi", ru: 'Хотел, чтобы в приложении было много кнопок' }, { uz: 'Telefonida internet bor edi', ru: 'В телефоне был интернет' }],
    kim: { uz: 'telefon hisobi tugab qolganlar', ru: 'у кого закончился баланс телефона' } },
  { id: 'translate', nom: <Brend id="translate" />, joy: 0,
    yechim: { uz: "Matnni bir bosishda boshqa tilga o'giradi.", ru: 'Переводит текст на другой язык одним нажатием.' },
    muammo: { uz: "Har so'zni lug'atdan qidirib, uzoq o'tirardi", ru: 'Долго сидел, ища каждое слово в словаре' },
    tuzoq: [{ uz: "Ingliz tili darsini juda yaxshi ko'rardi", ru: 'Очень любил уроки английского' }, { uz: "Uyida inglizcha kitoblar ko'p edi", ru: 'Дома было много английских книг' }],
    kim: { uz: "inglizcha matnni tushunmagan o'quvchilar", ru: 'ученики, которые не понимали английский текст' } }
];
const tanlovlar = (m) => { const a = m.tuzoq.map(t => ({ t, ok: false })); a.splice(m.joy, 0, { t: m.muammo, ok: true }); return a; };
// s5: yangi mahsulot (qo'llash)
const UZUM = { nom: <Brend id="uzum" />, kim: { uz: 'xaridorlar', ru: 'покупатели' }, yechim: { uz: 'Narsani telefonda topadi va yetkazib beradi.', ru: 'Находит вещь в телефоне и доставляет её.' } };
// s6: Dropbox kartasi (MUAMMO 1/5 da, YECHIM 2/5 da yoziladi)
const DROPBOX = {
  muammo: { uz: 'Fayllar bor fleshka uyda qolgan.', ru: 'Флешка с файлами осталась дома.' },
  yechim: { uz: 'Fayllarni internetda saqlab, istalgan kompyuterdan ochadi.', ru: 'Хранит файлы в интернете и открывает их с любого компьютера.' },
  ozi: { uz: "o'zi", ru: 'он сам' }
};
// s9 (Mentor ro'yxati) · s11 (kod yozuvlari) · s13 (zaxira karta) — bitta manba. Mentorning qolgan 9 muammosi — MD «TAYANCHGA SAVOL 1».
const JOY = { maktab: { uz: 'maktab', ru: 'школа' }, yol: { uz: "yo'l", ru: 'дорога' }, mahalla: { uz: 'mahalla', ru: 'махалля' } };
const MAYDON_MUAMMO = { uz: "Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak.", ru: 'Приходите на поле — занято; чтобы узнать свободное время, нужно звонить владельцу.' };
const ROYXAT_MENTOR = {
  tayyor: [
    { joy: 'maktab', t: { uz: "Tanaffusda telefonni quvvatlash uchun bo'sh rozetka topilmaydi.", ru: 'На перемене не найти свободную розетку, чтобы зарядить телефон.' } },
    { joy: 'maktab', t: { uz: "To'garak qaysi xonada ekanini bilmay, o'quvchilar xonama-xona yurishadi.", ru: 'Не зная, в каком кабинете кружок, ученики ходят из кабинета в кабинет.' } },
    { joy: 'yol', t: { uz: "Maktab oldida velosiped qo'yadigan joy yo'q — daraxtga bog'lab ketishadi.", ru: 'У школы негде поставить велосипед — его привязывают к дереву.' } },
    { joy: 'yol', t: { uz: "Kechqurun ko'cha chirog'i yonmaydi — o'smirlar telefon chirog'ini yoqib yurishadi.", ru: 'Вечером не горит уличный фонарь — подростки ходят с фонариком телефона.' } },
    { joy: 'mahalla', t: { uz: "Suv qachon o'chirilishini qo'shnilar kech bilishadi — idish to'ldirishga ulgurishmaydi.", ru: 'Соседи поздно узнают, когда отключат воду, — не успевают набрать воды.' } },
    { joy: 'mahalla', t: { uz: "Lift buzilganini odamlar uzoq kutib turgandan keyin bilishadi.", ru: 'О том, что лифт сломан, люди узнают только после долгого ожидания.' } }
  ],
  yozuvlar: [
    { id: 'y1', joy: 'yol', tur: 'muammo', t: { uz: "Velosiped g'ildiragi teshilsa, ustaxonani topolmay uyga yetaklab ketishadi.", ru: 'Если колесо велосипеда проколется, мастерскую не находят и ведут его домой.' } },
    { id: 'y2', joy: 'mahalla', tur: 'yechim', t: { uz: 'Mahallaga yana bitta maydon qurish kerak.', ru: 'В махалле нужно построить ещё одно поле.' } },
    { id: 'y3', joy: 'mahalla', tur: 'muammo', maydon: true, t: MAYDON_MUAMMO },
    { id: 'y4', joy: 'maktab', tur: 'fikr', t: { uz: "Futbol — eng qiziq o'yin.", ru: 'Футбол — самая интересная игра.' } },
    { id: 'y5', joy: 'maktab', tur: 'muammo', t: { uz: "Oshxonada bugun nima borligini bilish uchun navbatga turib ko'rishadi.", ru: 'Чтобы узнать, что сегодня в столовой, встают в очередь и смотрят.' } },
    { id: 'y6', joy: 'mahalla', tur: 'muammo', t: { uz: "Eski darsliklarni kimga berishni bilmay, o'quvchilar ularni uyda yillab saqlaydi.", ru: 'Не зная, кому отдать старые учебники, ученики годами хранят их дома.' } }
  ]
};
const MAYDON = { kim: { uz: "o'yinchilar (maydonda o'ynaydigan o'smirlar)", ru: 'игроки (подростки, которые играют на поле)' }, muammo: MAYDON_MUAMMO };
const KARTALAR = { NARSALAR, MAHSULOTLAR, UZUM, DROPBOX, ROYXAT_MENTOR, MAYDON };
const MaydonKarta = ({ className }) => (
  <AudKarta tur="toliq" nom={tr({ uz: 'Maydon', ru: 'Поле' })} toliq className={className}
    kim={{ odamlar: [{ t: KARTALAR.MAYDON.kim, son: 3 }] }} muammo={{ matn: tr(KARTALAR.MAYDON.muammo) }} yechim={{ hali: true }} />
);

// ----- Yordamchilar: saqlash (tayanch 6-bo'lim), yakka rejim, ipucha, taymer, mentor eslatmasi, nishon qoidasi -----
const KEY_ILOVALAR = 'pm-m7d1-ilovalar';
const KEY_MUAMMOLAR = 'pm-m7d1-muammolar';
const KEY_TANLANGAN = 'pm-m7d1-tanlangan';
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const yakkaMi = (live) => !live || (live.mode !== 'student' && live.mode !== 'mentor');
const norm = (s) => String(s || '').toLowerCase().replace(/[\u02BB\u02BC\u2018\u2019`]/g, "'").replace(/\s+/g, ' ').trim();
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const QOLDIR = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставить так — нажмите «Сохранить» ещё раз.' };
const SAQLASH = { uz: 'Saqlash', ru: 'Сохранить' };
const YORDAM = { uz: 'Yordam', ru: 'Подсказка' };
const TAHRIR = { uz: 'Tahrirlash', ru: 'Изменить' };

// 42 soniya harakatsizlikda bitta ipucha (javobni aytmaydi)
const useIpucha = (faol, kalit, ms = 42000) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(false);
    if (!faol) return undefined;
    const t = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(t);
  }, [faol, kalit, ms]);
  return on;
};
// 0 → N sanoq (bir lahzada); reduced-motion — darhol
const useSanoq = (n, faol) => {
  const [v, setV] = useState(faol && !kamHarakat() ? 0 : n);
  useEffect(() => {
    if (!faol || kamHarakat()) { setV(n); return undefined; }
    let raf = 0; const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1400); setV(Math.round(n * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [n, faol]);
  return v;
};
// P-051: mashq yakuni ochilganda xulosaga ~400 ms kechikish bilan silliq skroll (boshidan tugagan ekranda — yo'q)
const useXulosaSkroll = (on, boshdanTugagan) => {
  const bosh = useRef(!!boshdanTugagan);
  useEffect(() => {
    if (!on || bosh.current) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 400);
    return () => clearTimeout(t);
  }, [on]);
};
const fmtSon = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// Bir qatordan to'rt qatorgacha o'sadigan matn maydoni (DE-175)
const GrowInput = ({ value, onChange, onEnter, className, ...p }) => {
  const ref = useRef(null);
  useLayoutEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 112)}px`; }, [value]);
  return <textarea ref={ref} rows={1} value={value} onChange={onChange} className={cxx('pp-kirit', className)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && onEnter) { e.preventDefault(); onEnter(); } }} {...p} />;
};

// Taymer: boshlash · to'xtatish · ↻ yana (s10, s13)
function Taymer({ soniya, matn, onTugadi, chorla, onBoshla }) {
  const [st, setSt] = useState({ yur: false, qoldi: soniya, tugadi: false });
  useEffect(() => { setSt({ yur: false, qoldi: soniya, tugadi: false }); }, [soniya]);
  useEffect(() => {
    if (!st.yur) return undefined;
    if (st.qoldi <= 0) { setSt({ yur: false, qoldi: 0, tugadi: true }); if (onTugadi) onTugadi(); return undefined; }
    const t = setTimeout(() => setSt(p => ({ ...p, qoldi: p.qoldi - 1 })), 1000);
    return () => clearTimeout(t);
  }, [st.yur, st.qoldi]); // eslint-disable-line
  const ulush = st.yur ? st.qoldi / soniya : (st.tugadi ? 0 : 1);
  return (
    <div className={cxx('pp-taymer', st.yur && 'yur', st.tugadi && 'tugadi')}>
      <span className="pp-taymer-son">{Math.floor(st.qoldi / 60)}:{String(st.qoldi % 60).padStart(2, '0')}</span>
      <span className="pp-taymer-yol" aria-hidden="true"><i style={{ width: `${Math.round(ulush * 100)}%` }} /></span>
      {st.yur
        ? <QTugma ikkinchi onClick={() => setSt({ yur: false, qoldi: soniya, tugadi: false })}>{matn.toxtatish}</QTugma>
        : <QTugma ikkinchi className={chorla ? 'pp-bos' : undefined} onClick={() => { setSt({ yur: true, qoldi: soniya, tugadi: false }); if (onBoshla) onBoshla(); }}>{st.tugadi ? matn.yana : matn.boshlash}</QTugma>}
    </div>
  );
}

// O'qituvchi eslatmasi — faqat mentor (proyektor) rejimida, bosib ochiladi
const MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const [open, setOpen] = useState(false);
  if (!gate.live || gate.live.mode !== 'mentor') return null;
  if (!open) return <button type="button" className="mnote-chip" onClick={() => setOpen(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</button>;
  return (
    <div className="mnote fade-up" onClick={() => setOpen(false)} role="note">
      <span className="mnote-lbl">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span>
      <span className="mnote-body">{children}</span>
    </div>
  );
};

// 151-qonun: birinchi urinish nishoni — shart oldindan aytiladi (platforma yozuvi)
const AchRule = ({ screen }) => {
  const earned = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || (gate.live && gate.live.mode === 'mentor') || (earned && earned.has(ach))) return null;
  const lost = am.missed.has(sid);
  return <span className={cxx('ach-rule', lost && 'lost')}>{lost
    ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' })
    : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</span>;
};

// Jonli dars: hook ovozlari chizig'i (J-026 — hammaga correct: false)
const OvozChizigi = ({ live, screen, variantlar, mening }) => {
  const [n, setN] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!pin) return undefined;
    let on = true, t = null;
    const tick = async () => {
      try { const rows = await liveAnswers(pin, screen); if (on) setN(variantlar.map((_, i) => rows.filter(r => r.picked === i).length)); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [pin, screen]); // eslint-disable-line
  if (!n) return null;
  const jami = n.reduce((a, b) => a + b, 0);
  return (
    <div className="pp-ovoz fade-step" aria-label={tr({ uz: 'Jonli natija', ru: 'Живой результат' })}>
      {variantlar.map((v, i) => (
        <div key={i} className={cxx('pp-ovoz-q', mening === i && 'men')}>
          <span className="pp-ovoz-t">{v}</span>
          <span className="pp-ovoz-yol"><i style={{ width: `${jami ? Math.round((n[i] / jami) * 100) : 0}%` }} /></span>
          <span className="pp-ovoz-n">{n[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish: sof so'rovnoma, J-026 — hammaga correct: false, maqtov yo'q) =====
const HOOK_OPTS = [
  { id: 'ozim', t: { uz: "O'zim — ishlayaptimi deb tekshirdim", ru: 'Я сам — проверял, работает ли' }, odam: SIZ },
  { id: 'mentor', t: { uz: "Mentor — vazifamni ko'rib chiqish uchun", ru: 'Ментор — чтобы проверить задание' }, odam: { uz: 'mentor', ru: 'ментор' } },
  { id: 'dost', t: { uz: "Do'stim — havolasini o'zim yuborgandim", ru: 'Друг — ссылку я отправил сам' }, odam: DOST }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [yandex, setYandex] = useState(!!storedAnswer || isMentor);
  useEffect(() => {
    if (picked === null || yandex) return undefined;
    const t = setTimeout(() => setYandex(true), 900);
    return () => clearTimeout(t);
  }, [picked, yandex]);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const tanlangan = HOOK_OPTS.find(o => o.id === picked);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Portfolio saytingizni oxirgi marta <A>kim ochgan?</A></>, ru: <>Кто последним <A>открывал ваш сайт-портфолио?</A></> })}
        mentor={<Mentor>{tr({ uz: "Saytingiz hozir ham internetda turibdi. Eslab ko'ring va bittasini tanlang.", ru: 'Ваш сайт и сейчас в интернете. Вспомните и выберите один вариант.' })}</Mentor>}
        maket={<div className="pp-hook">
          <div className="pp-brauzer">
            <div className="pp-br-bar"><i /><i /><i /><span className="pp-br-url">ismingiz.netlify.app</span></div>
            <div className="pp-br-sahifa">
              <span className="pp-sk ism" /><span className="pp-sk yonalish" />
              <div className="pp-sk-kartalar"><span /><span /><span /></div>
            </div>
          </div>
          {/* F-1005-75: kartalar tanlovdan keyin chiqadi (javobga bog'liq vizual, saboq 4), bir balandlikda — bo'sh siluet-uyalarsiz */}
          {(tanlangan || isMentor) && <div className="pp-juftlik">
            <AudKarta tur="ixcham" className="kir" nom={tr(narsa('portfolio').nom)}
              kim={tanlangan ? { odamlar: [{ id: tanlangan.id, t: tanlangan.odam, nega: 'korsatish', kir: true }] } : { odamlar: narsa('portfolio').kim }} />
            {yandex && <AudKarta tur="ixcham" className="kir" nom={<Brend id="yandex" />} kim={{ odamlar: narsa('yandex').kim }} />}
          </div>}
        </div>}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
        javob={<>
          {picked !== null && <p className="hook-ack fade-step">{tr({ uz: "Uchalasida sayt ishingizni ko'rish uchun ochilgan. Yandex Go'ni esa odam o'z ishi uchun ochadi — uyga yetib olish uchun.", ru: 'Во всех трёх случаях сайт открывали, чтобы посмотреть вашу работу. А Yandex Go человек открывает для своего дела — чтобы добраться домой.' })}</p>}
          {isLive && (picked !== null || isMentor) && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
        </>}
      >
        <MentorNote>{tr({ uz: "Javobni muhokama qilmang — keyingi ekranlar o'zi ochadi. Saytini yo'qotgan o'quvchi ham tanlaydi: savol voqea haqida, sayt haqida emas.", ru: 'Не обсуждайте ответ — следующие экраны раскроют его сами. Ученик, потерявший сайт, тоже выбирает: вопрос о случае, а не о сайте.' })}</MentorNote>
      </QKirish>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda o'nta qator-karta skeleti ✓ oladi → bittasi to'liq kartaga aylanadi; skelet matnsiz, P-015) =====
const REJA = [
  { t: { uz: 'Mahsulot va loyiha farqini ajratasiz', ru: 'Отличите продукт от проекта' }, teg: { uz: 'farq', ru: 'разница' } },
  { t: { uz: 'Uchta ishlaydigan mahsulotni tahlil qilasiz', ru: 'Разберёте три работающих продукта' }, teg: { uz: 'tahlil', ru: 'разбор' } },
  { t: { uz: "Dropbox boshqalarga kerakligi qanday bilinganini ko'rasiz", ru: 'Увидите, как стало понятно, что Dropbox нужен другим' }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: "Sinfdoshingiz bilan atrofdan muammo yig'asiz", ru: 'Вместе с одноклассником соберёте проблемы вокруг' }, teg: { uz: 'juftlik', ru: 'пара' } }
];
const RejaChizma = () => {
  const [n, setN] = useState(() => (kamHarakat() ? 10 : 0));
  const [katta, setKatta] = useState(() => kamHarakat());
  useEffect(() => {
    if (n >= 10) { if (katta) return undefined; const t = setTimeout(() => setKatta(true), 600); return () => clearTimeout(t); }
    const t = setTimeout(() => setN(x => x + 1), n === 0 ? 500 : 400);
    return () => clearTimeout(t);
  }, [n, katta]);
  return (
    <div className={cxx('pp-reja', katta && 'katta')}>
      <div className="pp-reja-ro">
        {Array.from({ length: 10 }).map((_, i) => (
          <AudKarta key={i} tur="qator" holat={i < n ? 'ok' : undefined} className={katta && i === 2 ? 'tanlandi' : undefined}>
            {i < n && <span className="ak-belgi">✓</span>}
          </AudKarta>
        ))}
      </div>
      {katta && <AudKarta tur="toliq" className="kir" kim={{}} muammo={{}} yechim={{ hali: true }} />}
    </div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun atrofingizdan <A>o'nta muammo</A> yig'asiz.</>, ru: <>Сегодня вы соберёте <A>десять проблем</A> вокруг себя.</> })}
      mentor={<Mentor>{tr({ uz: "Bu modulda quradigan narsangiz shunday ro'yxatdagi bitta muammodan boshlanadi.", ru: 'То, что вы построите в этом модуле, начнётся с одной проблемы из такого списка.' })}</Mentor>}
      chapYorliq={tr({ uz: "Dars oxirida — atrofingizdan muammolar ro'yxati", ru: 'В конце урока — список проблем вокруг вас' })}
      chap={<RejaChizma />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — TUSHUNCHA: loyiha va mahsulot (bashorat → «Sizsiz bir kun» → atama misoldan KEYIN, PM-030/T-011) =====
// F-1005-76 (qaror A): har narsa o'z maketida — brauzer oynasi · Telegram chat · Yandex Go sariq ekrani · Payme ekrani.
// «Sizsiz bir kun»: tepada kun chizig'i (ertalab → kechqurun) · Yandex Go va Payme ekraniga odamlar oqib keladi ·
// portfolio va bot ekrani kulrang, «bugun hech kim ochmadi». Soxta son yo'q — oqimni siluetlar ko'rsatadi.
const S2_TAXMIN = [{ k: '1', t: '1' }, { k: '2', t: '2' }, { k: '3', t: '3' }];
const S2_KUN = 3600; // kun chizig'i davomiyligi (CSS .pp-kun.yur bilan bir xil)
const S2_YOQ = { uz: 'bugun hech kim ochmadi', ru: 'сегодня никто не открыл' };
const S2_ISHLATMADI = { uz: 'bugun hech kim ishlatmadi', ru: 'сегодня никто не пользовался' };
const S2Maket = ({ id }) => {
  if (id === 'portfolio') return (
    <div className="pp-mk" aria-hidden="true">
      <div className="pp-mk-ichi pp-brauzer pp-mk-br">
        <div className="pp-br-bar"><i /><i /><i /><span className="pp-br-url">ismingiz.netlify.app</span></div>
        <div className="pp-br-sahifa"><span className="pp-sk ism" /><span className="pp-sk yonalish" /><div className="pp-sk-kartalar"><span /><span /><span /></div></div>
      </div>
      <span className="pp-mk-yoq">{tr(S2_YOQ)}</span>
    </div>
  );
  if (id === 'bot') return (
    <div className="pp-mk" aria-hidden="true">
      <div className="pp-mk-ichi">
        <Telefon rang="telegram" kichik>
          <div className="pp-tg-bosh"><i /><span /></div>
          <div className="pp-tg-chat"><span className="pp-tg-b men">/start</span><span className="pp-tg-b"><i /><i /></span><span className="pp-tg-b"><i /></span></div>
        </Telefon>
      </div>
      <span className="pp-mk-yoq">{tr(S2_YOQ)}</span>
    </div>
  );
  if (id === 'yandex') return (
    <div className="pp-mk" aria-hidden="true">
      <Telefon rang="yandex" kichik>
        <span className="pp-yg-qayer"><i />{tr({ uz: 'Qayerga?', ru: 'Куда?' })}</span>
        <span className="pp-tel-oqim"><Odamcha n={9} /></span>
      </Telefon>
    </div>
  );
  return (
    <div className="pp-mk" aria-hidden="true">
      <Telefon rang="payme" kichik>
        <span className="pp-pm-qator"><i>+</i>{tr({ uz: "Hisobni to'ldirish", ru: 'Пополнить баланс' })}</span>
        <span className="pp-tel-oqim"><Odamcha n={9} /></span>
      </Telefon>
    </div>
  );
};
const s2Nom = (id, n) => id === 'yandex' || id === 'payme' ? <Brend id={id} />
  : id === 'bot' ? tr({ uz: <><Brend id="telegram" /> botingiz</>, ru: <>Ваш <Brend id="telegram" />-бот</> })
    : tr(n.nom);
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  // faza: 0 — hali · 1 — kun yurmoqda (oqim, kulrang ekran, siluetlar so'nadi) · 2 — KIM «bugun hech kim ishlatmadi» · 3 — ikki nom, yorliqlar va strelka
  const [faza, setFaza] = useState(storedAnswer ? 3 : 0);
  const done = faza >= 3;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  useEffect(() => {
    if (faza === 0 || faza >= 3) return undefined;
    const t = setTimeout(() => setFaza(f => f + 1), kamHarakat() ? 50 : (faza === 1 ? S2_KUN + 200 : 700));
    return () => clearTimeout(t);
  }, [faza]);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const karta = (id) => {
    const n = narsa(id);
    const ket = n.nega === 'korsatish';
    const kim = !ket ? { odamlar: n.kim.map((o, i) => ({ ...o, id: i })) }
      : faza === 0 ? { odamlar: n.kim.map((o, i) => ({ ...o, id: i })) }
        : faza === 1 ? { odamlar: n.kim.map((o, i) => ({ ...o, id: i, so: true })), matn: tr(S2_ISHLATMADI), holat: 'xira' }
          : { matn: tr(S2_ISHLATMADI), holat: 'xira' };
    return <AudKarta key={id} tur="ixcham" className={cxx('pp-s2-k', ket ? 'loyiha' : 'mahsulot')} ust={<S2Maket id={id} />} nom={s2Nom(id, n)} yorliq={faza >= 3 ? (ket ? 'loyiha' : 'mahsulot') : null} kim={kim} />;
  };
  const tx = taxmin;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · loyiha va mahsulot', ru: 'Понятие · проект и продукт' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Sizsiz bir kun', ru: 'День без вас' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Qurish tugasa, <A>mahsulot tayyormi?</A></>, ru: <>Если стройка закончена, <A>продукт готов?</A></> })}
        mentor={<Mentor>{tr({ uz: "To'rttasining qurilishi tugagan. «Sizsiz bir kun»ni bosing: hech kimga ko'rsatmasangiz, ularni kim o'z ishi uchun ishlatadi?", ru: 'Все четыре уже построены. Нажмите «День без вас»: если никому их не показывать, кто будет пользоваться ими для своего дела?' })}</Mentor>}
        bashorat={!done && <div className="pp-s2-bash">
          <Bashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "To'rttadan nechtasini odamlar o'z ishi uchun ishlatadi?", ru: 'Сколькими из четырёх люди пользуются для своего дела?' })} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />
          {taxmin && faza === 0 && <QTugma className="pp-bos" onClick={() => setFaza(1)}>{tr({ uz: 'Sizsiz bir kun', ru: 'День без вас' })}</QTugma>}
        </div>}
        vizual={<div className={cxx('pp-s2', `f${faza}`, storedAnswer && 'qayt')}>
          {faza >= 1 && <div className={cxx('pp-kun', faza === 1 && 'yur')} aria-hidden="true">
            <span>{tr({ uz: 'ertalab', ru: 'утро' })}</span>
            <span className="pp-kun-yol"><i /><b /></span>
            <span>{tr({ uz: 'kechqurun', ru: 'вечер' })}</span>
          </div>}
          <div className="pp-s2-guruhlar">
            <div className="pp-s2-guruh">
              {faza >= 3 ? <span className="pp-nom kir"><b>{tr({ uz: 'Loyiha tugadi', ru: 'Проект завершён' })}</b> — «{tr({ uz: 'qurish ishi', ru: 'работа по созданию' })}»</span> : <span className="pp-nom bosh" aria-hidden="true" />}
              <div className="pp-s2-juft">{['portfolio', 'bot'].map(karta)}</div>
            </div>
            <div className="pp-s2-guruh">
              {faza >= 3
                ? <span className="pp-nom kir"><span className="pp-strelka"><i aria-hidden="true" />{tr({ uz: 'avval — qurish ishi', ru: 'сначала — работа по созданию' })}</span><span><b>{tr({ uz: 'Mahsulot', ru: 'Продукт' })}</b> — «{tr({ uz: 'odamlar ishlatadi', ru: 'люди пользуются' })}»</span></span>
                : <span className="pp-nom bosh" aria-hidden="true" />}
              <div className="pp-s2-juft">{['yandex', 'payme'].map(karta)}</div>
            </div>
          </div>
        </div>}
        natija={done && tx && <QTaxmin togri={tx === '2'}>{tx === '2'
          ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
          : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tx} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>2</b></>}</QTaxmin>}
        xulosa={done && tr({ uz: "Saytni qurish — loyiha. Tayyor saytni odamlar o'z ishi uchun ishlatsa, u mahsulot bo'lib ishlaydi.", ru: 'Построить сайт — это проект. Если готовым сайтом люди пользуются для своего дела, он работает как продукт.' })}
      >
        <MentorNote>{tr({ uz: "Loyihani «yomon» demang — har mahsulot loyihadan boshlanadi. «Do'stim ham ochgan» desa, so'rang: ko'rish uchunmi yoki o'z ishi uchunmi?", ru: 'Не называйте проект «плохим» — каждый продукт начинается с проекта. Если скажут «друг тоже открывал», спросите: чтобы посмотреть или для своего дела?' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 2). Javob topilgach savol ostida ixcham karta: to'g'ri javobning KIM qatori (F-1005-77) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · loyiha va mahsulot', ru: 'Проверка · проект и продукт' })}
    vizual={() => <AudKarta tur="ixcham" className="pp-test-karta kir" nom={tr({ uz: <><Brend id="telegram" /> bot</>, ru: <><Brend id="telegram" />-бот</> })} yorliq="mahsulot"
      kim={{ odamlar: [{ id: 's', t: { uz: 'sinfdoshlar', ru: 'одноклассники' }, son: 3, kir: true, nega: 'ozIshi' }], holat: 'ok' }} />}
    questionText="Sinfingizda 4 ta Telegram bot bor. Qaysi biri mahsulot?"
    question={tr({ uz: <h2 className="title h-ask">Sinfingizda 4 ta Telegram bot bor. Qaysi biri <A>mahsulot</A>?</h2>, ru: <h2 className="title h-ask">В вашем классе 4 Telegram-бота. Какой из них — <A>продукт</A>?</h2> })}
    options={[
      { uz: 'Egasi uni bir marta qurib, keyin ochmay qo\'ygan', ru: 'Владелец собрал его один раз и больше не открывал' },
      { uz: "Do'stlari egasining iltimosi bilan bir marta ochgan", ru: 'Друзья открыли его один раз по просьбе владельца' },
      { uz: 'Sinfdoshlar uy vazifasini bilish uchun ishlatadi', ru: 'Одноклассники пользуются им, чтобы узнать домашку' },
      { uz: "Egasi Demo Day'da ota-onalarga ishlatib ko'rsatadi", ru: 'Владелец показывает его родителям на Demo Day' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Sinfdoshlar botni o'z muammosi uchun ishlatadi.", ru: 'Одноклассники пользуются ботом для своей проблемы.' }}
    explainWrong={{
      0: { uz: 'Bot qurildi, lekin uni hech kim ishlatmayapti.', ru: 'Бот собран, но им никто не пользуется.' },
      1: { uz: "Do'stlar ko'rib qo'ydi — o'z ishi uchun emas.", ru: 'Друзья посмотрели — не для своего дела.' },
      3: { uz: "Ota-onalar botni ko'rdi, lekin o'zi ishlatmaydi.", ru: 'Родители увидели бота, но сами им не пользуются.' },
      default: { uz: "Kim ishlatadi va nima uchun — shuni qarang.", ru: 'Посмотрите, кто пользуется и зачем.' }
    }} />
);

// ===== SCREEN 4 — UCH MAHSULOT (QTushuncha, markaziy: «yechimdan muammoga»; QQadamlar 163.8; nishon productSpotter) =====
// F-1005-78 (qaror A): chapda brend rangidagi telefon — YECHIM ko'rinadi. To'g'ri MUAMMO tanlansa: «oldin» (ilovasiz qiyinchilik) → «keyin» (ilova bilan).
// Narx summasi, logotip, emoji yo'q — faqat nom o'z rangida (PM-029).
const S4_TAG = { oldin: { uz: 'oldin', ru: 'до' }, keyin: { uz: 'keyin', ru: 'после' } };
const S4_OLDIN = 1300, S4_KEYIN = 1700; // ms: «oldin» kadri · «keyin» kadri (keyingi mahsulotgacha)
const S4Ekran = ({ id, holat }) => {
  if (id === 'yandex') return (
    <Telefon rang={holat === 'oldin' ? 'oldin' : 'yandex'} className={holat}>
      {holat === 'oldin'
        ? <div className="pp-s4-sahna pp-yg-kocha">
            <span className="pp-yg-yol"><i className="m1" /><i className="m2" /></span>
            <span className="pp-yg-trotuar"><span className="pp-odam-kut"><i /></span></span>
            <span className="pp-narx savol">{tr({ uz: 'narx: ?', ru: 'цена: ?' })}</span>
          </div>
        : <>
            <span className="pp-tel-nom">Yandex Go</span>
            <div className="pp-yg-xarita"><span className="pp-yg-pin" /><span className={cxx('pp-yg-mashina', holat === 'keyin' && 'kel')} /></div>
            <div className="pp-tel-varaq">
              <span className="pp-yg-qayer"><i />{tr({ uz: 'Qayerga?', ru: 'Куда?' })}</span>
              <span className={cxx('pp-narx', holat === 'keyin' && 'kir')}>{tr({ uz: 'narx: oldindan', ru: 'цена: заранее' })}</span>
            </div>
          </>}
    </Telefon>
  );
  if (id === 'payme') return (
    <Telefon rang={holat === 'oldin' ? 'oldin' : 'payme'} className={holat}>
      {holat === 'oldin'
        ? <div className="pp-s4-sahna pp-pm-yol">
            <span className="pp-uy" /><span className="pp-iz" /><span className="pp-dokon"><i /></span>
            <span className="pp-odam-yur" />
          </div>
        : <>
            <span className="pp-tel-nom">Payme</span>
            <div className="pp-tel-varaq">
              <span className="pp-pm-qator"><i>+</i>{tr({ uz: "Hisobni to'ldirish", ru: 'Пополнить баланс' })}</span>
              <span className="pp-pm-raqam"><i /><b /></span>
              {holat === 'keyin'
                ? <span className="pp-pm-tayyor kir"><span className="pp-uy kichik" />{tr({ uz: "uydan to'ldirildi ✓", ru: 'пополнено из дома ✓' })}</span>
                : <span className="pp-pm-tugma">{tr({ uz: "To'ldirish", ru: 'Пополнить' })}</span>}
            </div>
            <span className="pp-pm-tarix"><i /><i /></span>
          </>}
    </Telefon>
  );
  return (
    <Telefon rang={holat === 'oldin' ? 'oldin' : 'translate'} className={holat}>
      {holat === 'oldin'
        ? <div className="pp-s4-sahna pp-gt-kitob">
            <span className="pp-kitob"><i /><i /><b className="pp-lupa" /></span>
            <span className="pp-soat"><i /></span>
          </div>
        : <>
            <span className="pp-tel-nom">Google Translate</span>
            <div className="pp-tel-varaq pp-gt-oyna">
              <span className="pp-gt-til">{tr({ uz: 'Inglizcha', ru: 'Английский' })}</span>
              <span className="pp-gt-q"><i /><i /></span>
            </div>
            <span className="pp-gt-tugma" />
            <div className="pp-tel-varaq pp-gt-oyna">
              <span className="pp-gt-til">{tr({ uz: "O'zbekcha", ru: 'Узбекский' })}</span>
              <span className={cxx('pp-gt-q', 'tarjima', holat === 'keyin' && 'kir')}><i /><i /></span>
            </div>
          </>}
    </Telefon>
  );
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const xatoRef = useRef(false);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [ok, setOk] = useState(storedAnswer ? 3 : 0);
  const [holat, setHolat] = useState('yechim'); // telefon: yechim → (to'g'ri tanlovdan keyin) oldin → keyin → keyingi mahsulot
  const [xato, setXato] = useState(null);
  const [flash, setFlash] = useState(false);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  const ipucha = useIpucha(!done, `${q}-${xato ? xato.k : 0}`);
  useEffect(() => {
    if (holat === 'oldin') { const t = setTimeout(() => setHolat('keyin'), S4_OLDIN); return () => clearTimeout(t); }
    if (holat === 'keyin' && ok > q && q < 3) { const t = setTimeout(() => { setQ(ok); if (ok < 3) setHolat('yechim'); }, S4_KEYIN); return () => clearTimeout(t); }
    return undefined;
  }, [holat, ok, q]);
  useEffect(() => { if (!flash) return undefined; const t = setTimeout(() => setFlash(false), 700); return () => clearTimeout(t); }, [flash]);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tajriba', screenIdx: screen, correct: !xatoRef.current, picked: true, solved: true }); }, [done]); // eslint-disable-line
  const tanla = (i) => {
    if (done || ok > q) return;
    const v = tanlovlar(MAHSULOTLAR[q])[i];
    if (v.ok) { setXato(null); setOk(q + 1); setHolat('oldin'); }
    else { xatoRef.current = true; if (achMiss) achMiss.miss(screen); setXato({ q, i, k: Date.now() }); setFlash(true); }
  };
  const karta = (m, idx, kichik) => {
    const top = ok > idx;
    return (
      <AudKarta key={m.id} tur="toliq" nom={m.nom} yorliq="mahsulot" toliq={top} className={kichik ? 'kichik' : 'kir'}
        kim={top ? { odamlar: [{ id: 'k', t: m.kim, nega: 'ozIshi', son: 3, kir: !kichik }] } : {}}
        muammo={top ? { matn: tr(m.muammo) } : { holat: flash ? 'xato' : 'joriy' }}
        yechim={{ matn: tr(m.yechim) }} />
    );
  };
  const m = MAHSULOTLAR[Math.min(q, 2)];
  return (
    <Stage eyebrow={tr({ uz: 'Tajriba · uch ishlaydigan mahsulot', ru: 'Опыт · три работающих продукта' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Muammoni toping', ru: 'Найдите проблему' })} (${ok}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Bu mahsulot <A>kimning qaysi muammosini</A> yechadi?</>, ru: <>Чью и какую <A>проблему</A> решает этот продукт?</> })}
        mentor={<Mentor>{tr({ uz: "KIM, MUAMMO, YECHIM — «Kim mening foydalanuvchim?» darsidagi auditoriya-karta. Ilovada odatda avval YECHIM ko'rinadi — kimga va qaysi muammoga kerakligini siz topasiz.", ru: 'КТО, ПРОБЛЕМА, РЕШЕНИЕ — карта аудитории из урока «Кто мой пользователь?». В приложении обычно сначала видно РЕШЕНИЕ — кому и для какой проблемы оно нужно, находите вы.' })}</Mentor>}
        harakat={<div className="pp-s4-chap">
          <QQadamlar qadamlar={MAHSULOTLAR.map(x => BREND[x.id])} joriy={done ? undefined : Math.min(ok, 3)} />
          <div className="pp-s4-tel">
            <span className="pp-s4-tag-joy">{holat !== 'yechim' && <span key={holat} className={cxx('pp-tel-tag', holat)}>{tr(S4_TAG[holat])}</span>}</span>
            <S4Ekran key={`${m.id}-${holat}`} id={m.id} holat={holat} />
          </div>
          <AchRule screen={screen} />
        </div>}
        vizual={done
          ? <div className="pp-uch">{MAHSULOTLAR.map((x, i) => karta(x, i, true))}</div>
          : <div className="pp-s4">
              {karta(m, q, false)}
              {ok <= q && <div className="pp-tanlov">
                {tanlovlar(m).map((v, i) => {
                  const silk = xato && xato.q === q && xato.i === i;
                  return <QChip key={silk ? `x${xato.k}` : `c${q}-${i}`} silk={silk} onClick={() => tanla(i)}>{tr(v.t)}</QChip>;
                })}
              </div>}
              {xato && xato.q === q && ok <= q && <QXato>{tr({ uz: "Bu gapda odam nimadan qiynalgani ko'rinmaydi.", ru: 'В этой фразе не видно, с чем мучился человек.' })}</QXato>}
              {ipucha && ok <= q && <QIzoh>{tr({ uz: "YECHIMga qarang: ilova bo'lmasa, odam nimadan qiynalardi?", ru: 'Посмотрите на РЕШЕНИЕ: без приложения с чем мучился бы человек?' })}</QIzoh>}
            </div>}
        xulosa={done && tr({ uz: 'Bu uch mahsulot aniq odamlarning aniq muammosini yengillashtiradi.', ru: 'Эти три продукта облегчают конкретную проблему конкретных людей.' })}
      >
        <MentorNote>{tr({ uz: "Har mahsulotda sinfdan bitta odamni so'rang: «Siz ham shunday qiynalganmisiz?» Javob «ha» bo'lsa — KIM qatori uning o'zi.", ru: 'Для каждого продукта спросите одного ученика: «Вы тоже так мучились?» Если ответ «да» — строка КТО это он сам.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 1). Savol ustida Uzum Market kartasi: MUAMMO qatoriga tanlangan gap yoziladi =====
const S5_OPTS = [
  { uz: "Ilovada chegirma ko'p bo'lishini xohlardi", ru: 'Хотел, чтобы в приложении было много скидок' },
  { uz: "Kerakli narsani do'konma-do'kon qidirardi", ru: 'Искал нужную вещь из магазина в магазин' },
  { uz: "Shahar do'konlarida narsa juda ko'p turardi", ru: 'В магазинах города было очень много вещей' },
  { uz: "Telefonda buyurtma qilishni yaxshi ko'rardi", ru: 'Любил заказывать по телефону' }
];
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · MUAMMO qatori', ru: 'Проверка · строка ПРОБЛЕМА' })}
    vizual={() => <AudKarta tur="toliq" className="pp-test-karta kir" nom={UZUM.nom} yorliq="mahsulot"
      kim={{ odamlar: [{ t: UZUM.kim, son: 3 }] }}
      muammo={{ matn: tr(S5_OPTS[1]), holat: 'ok' }}
      yechim={{ matn: tr(UZUM.yechim) }} />}
    questionText="Uzum Market uchun MUAMMO qatoriga nima yoziladi?"
    question={tr({ uz: <h2 className="title h-ask">Uzum Market uchun <A>MUAMMO qatoriga</A> nima yoziladi?</h2>, ru: <h2 className="title h-ask">Что пишется в <A>строку ПРОБЛЕМА</A> для Uzum Market?</h2> })}
    options={S5_OPTS} correctIdx={1}
    explainCorrect={{ uz: "Odam nimadan qiynalgani ko'rinadi — ilova aynan shuni yengillashtiradi.", ru: 'Видно, с чем мучился человек, — приложение облегчает именно это.' }}
    explainWrong={{
      0: { uz: "Bu xohish — odam nimadan qiynalgani ko'rinmaydi.", ru: 'Это желание — не видно, с чем мучился человек.' },
      2: { uz: 'Bu rost gap, lekin unda hech kim qiynalmagan.', ru: 'Это правда, но в ней никто не мучился.' },
      3: { uz: "Bu yechimni takrorlaydi — qiyinchilik yo'q.", ru: 'Это повторяет решение — трудности нет.' },
      default: { uz: 'Ilovasiz odam nimadan qiynalardi — shuni toping.', ru: 'Найдите, с чем человек мучился бы без приложения.' }
    }} />
);

// ===== SCREEN 6 — DROPBOX (QVoqea, PM-028: nuqtalar · slayd-karta · DropboxSahna + auditoriya-karta · 3/5 da bashorat, S-015) =====
// Manba (o'quvchi ko'rmaydi, fakt tekshiruvi 05.10.2026):
//   avtobus Boston → Nyu-York, fleshka uyda; dastur 2007 — MIT News, 2012: https://news.mit.edu/2012/dropbox-ceo-alumnus-drew-houston-commencement-speaker-1113
//   «bu muammoga boshqa duch kelmaslik» — Fortune, 14.06.2017: https://fortune.com/2017/06/14/founder-dropbox-got-idea-chinatown-bus
//   demo video, 24 soatda 75 000 kishi kutish ro'yxatiga — TechCrunch, 01.11.2011: https://techcrunch.com/?p=442136
//   «Ular dasturni o'z fayllari uchun kutayotgan edi» — bizning xulosa (manbada so'zma-so'z yo'q).
// F-1005-81 (qaror A): bosqich gapini Mentor aytadi (m — har bosqichda almashadi, ≤2 gap); sahnada faqat bosqich nomi (h) va jonli maket.
// F-1005-80: sahnaga MD va manbada yo'q narsa qo'shilmaydi — avtobus, asoschi ismi, yil chizilmaydi (taqiq faqat sahnaga).
// F-1005-89 (qaror B): 1/5 Mentor gapi va bosqich nomi — GATE M matni aynan.
const DROPBOX_BOSQICH = [
  { h: { uz: 'Avtobusda, fleshkasiz', ru: 'В автобусе, без флешки' }, m: { uz: "Drew Houston Bostondan Nyu-Yorkka avtobusda ketayotgan edi. Yo'lda ishlamoqchi edi, lekin fayllari bor fleshka uyda, stol ustida qolgan.", ru: 'Дрю Хьюстон ехал на автобусе из Бостона в Нью-Йорк. Хотел поработать в дороге, но флешка с файлами осталась дома, на столе.' } },
  { h: { uz: "O'z muammosi uchun dastur", ru: 'Программа для своей проблемы' }, m: { uz: "Shu muammoga qayta duch kelmaslik uchun u fayllarni internet orqali istalgan kompyuterda ochadigan dastur yoza boshladi.", ru: 'Чтобы больше не сталкиваться с этой проблемой, он начал писать программу, которая открывает файлы через интернет на любом компьютере.' } },
  { h: { uz: "Video va kutish ro'yxati", ru: 'Видео и список ожидания' }, bashorat: true, m: { uz: "Dastur hali hamma uchun tayyor emas edi. U qanday ishlashini ko'rsatadigan video chiqdi — xohlaganlar kutish ro'yxatiga yozilardi.", ru: 'Программа ещё не была готова для всех. Вышло видео о том, как она работает, — желающие записывались в список ожидания.' } },
  { h: { uz: 'Bir kunda 75 000 kishi', ru: '75 000 человек за один день' }, m: { uz: "Video chiqqach, bir kun ichida 75 000 kishi kutish ro'yxatiga yozildi. Ular dasturni o'z fayllari uchun kutayotgan edi.", ru: 'После выхода видео за один день 75 000 человек записались в список ожидания. Они ждали программу для своих файлов.' } },
  { h: { uz: 'Boshqalarga ham kerak', ru: 'Нужна и другим' }, m: { uz: "Kutish ro'yxati shu muammo o'n minglab odamda borligini ko'rsatdi. Kartaning KIM qatoriga qarang.", ru: 'Список ожидания показал, что эта проблема есть у десятков тысяч людей. Посмотрите на строку КТО на карте.' } }
];
const DROPBOX_TAXMIN = [
  { k: 'yuz', t: { uz: 'Yuzlab odam', ru: 'Сотни людей' } },
  { k: 'ming', t: { uz: 'Minglab odam', ru: 'Тысячи людей' } },
  { k: 'onming', t: { uz: "O'n minglab odam", ru: 'Десятки тысяч людей' } }
];
// Sahna (F-1005-80, PM-028/029, S-018): chizilgan CSS/SVG maket, har bosqichda o'zgaradi; logotip yo'q — nom o'z rangida.
//   1/5 brend tanishtiruvi (nom · bir qator izoh · papkadagi fayl ikkinchi kompyuterda ham paydo bo'ladi) + noutbuk: USB uyasi bo'sh va miltillaydi, fleshka uydagi stolda (fikr pufagida)
//   2/5 fayl noutbukdan internet orqali ikkinchi kompyuterga uchib o'tadi · 3/5 video pleer (chiziq yuradi) va «Kutish ro'yxati» formasi — hisoblagich javobni ochmaydi
//   4/5 ro'yxat qatorlari tez oqadi, hisoblagich 0 → 75 000 · 5/5 bitta odamdan olomon; KIM qatori siluetlar bilan to'ladi (karta)
const KUTISH = { uz: "Kutish ro'yxati", ru: 'Список ожидания' };
const DbOyna = ({ kichik, children }) => (
  <div className={cxx('pp-db-oyna', kichik && 'kichik')}><span className="pp-db-oyna-bar"><i /><i /><i /></span><div className="pp-db-oyna-ichi">{children}</div></div>
);
const DbFayllar = ({ yangi }) => <span className="pp-db-fayllar"><span className="pp-db-papka" /><i className="pp-db-fayl" /><i className="pp-db-fayl" /><i className={cxx('pp-db-fayl', yangi && 'yangi')} /></span>;
const DbNoutbuk = ({ usb, children }) => (
  <div className="pp-db-nout">
    <div className="pp-db-qopqoq"><div className="pp-db-ekran">{children}</div></div>
    <div className="pp-db-asos"><span className="pp-db-klav" />{usb && <span className="pp-db-usb" />}</div>
  </div>
);
const DbMonitor = ({ children }) => (
  <div className="pp-db-mon"><div className="pp-db-qopqoq"><div className="pp-db-ekran">{children}</div></div><span className="pp-db-oyoq" /><span className="pp-db-taglik" /></div>
);
const DbVideo = ({ kichik }) => (
  <div className={cxx('pp-db-video', kichik && 'kichik')}>
    <div className="pp-db-v-ekran"><span className="pp-db-v-mini"><DbOyna kichik><i className="pp-db-fayl" /></DbOyna><span className="pp-db-v-ok" /><DbOyna kichik><i className="pp-db-fayl yangi" /></DbOyna></span><span className="pp-db-play" /></div>
    <div className="pp-db-v-pan"><span className="pp-db-pauza"><i /><i /></span><span className="pp-db-v-yol"><i /></span></div>
  </div>
);
const DbTanishuv = () => (
  <div className="pp-db-tanish">
    <span className="pp-db-tanish-t"><Brend id="dropbox" /> — {tr({ uz: 'fayllarni internetda saqlab, istalgan kompyuterdan ochadigan xizmat', ru: 'сервис, который хранит файлы в интернете и открывает их с любого компьютера' })}</span>
    <span className="pp-db-sinx" aria-hidden="true"><span className="pp-db-sinx-p"><i className="pp-db-fayl" /></span><span className="pp-db-sinx-yo" /><span className="pp-db-sinx-e"><i className="pp-db-fayl yangi" /></span></span>
  </div>
);
const DropboxSahna = ({ b }) => {
  const son = useSanoq(75000, b === 3);
  return (
    <div className={`pp-db-sahna b${b}`} role="img" aria-label={tr(DROPBOX_BOSQICH[b].h)}>
      {b >= 1 && <span className="pp-db-nom"><Brend id="dropbox" /></span>}
      {b === 0 && <>
        <DbNoutbuk usb><DbOyna><span className="pp-db-bosh"><span className="pp-db-usbb" />{tr({ uz: 'fleshka ulanmagan', ru: 'флешка не подключена' })}</span></DbOyna></DbNoutbuk>
        <div className="pp-db-fikr">
          <span className="pp-db-fikr-d d1" /><span className="pp-db-fikr-d d2" />
          <div className="pp-db-fikr-b">
            <span className="pp-db-deraza" />
            <span className="pp-db-stol"><span className="pp-db-chiroq" /><span className="pp-db-fleshka" /></span>
            <span className="pp-db-fikr-t">{tr({ uz: 'uyda', ru: 'дома' })}</span>
          </div>
        </div>
      </>}
      {b === 1 && <>
        <DbNoutbuk><DbOyna><DbFayllar /></DbOyna></DbNoutbuk>
        <div className="pp-db-bulut"><svg viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true"><path d="M4 38 Q60 -14 116 38" /></svg><span className="pp-db-bulut-i" /><span className="pp-db-bulut-t">{tr({ uz: 'internet', ru: 'интернет' })}</span></div>
        <DbMonitor><DbOyna><DbFayllar yangi /></DbOyna></DbMonitor>
        <i className="pp-db-fayl pp-db-uchar" />
      </>}
      {b === 2 && <>
        <DbVideo />
        <div className="pp-db-forma">
          <b>{tr(KUTISH)}</b>
          <span className="pp-db-input"><i>@</i><span /></span>
          <span className="pp-db-tugma">{tr({ uz: 'Yozilish', ru: 'Записаться' })}</span>
        </div>
      </>}
      {b === 3 && <>
        <DbVideo kichik />
        <div className="pp-db-forma royxat">
          <span className="pp-db-forma-bosh"><b>{tr(KUTISH)}</b><span className="pp-hisob">{fmtSon(son)}</span></span>
          <div className="pp-db-qatorlar"><div className={cxx('pp-db-q-iz', son >= 75000 && 'sekin')}>{Array.from({ length: 16 }).map((_, k) => <span key={k} className="pp-db-q"><i /><b style={{ width: `${46 + (((k % 8) * 37) % 40)}%` }} /></span>)}</div></div>
        </div>
      </>}
      {b === 4 && <>
        <div className="pp-db-bir"><span className="pp-db-fikr-b kichik"><span className="pp-db-fleshka" /></span><i className="pp-db-bir-odam" /><span className="pp-db-bir-t">{tr(DROPBOX.ozi)}</span></div>
        <span className="pp-db-strelka" />
        <div className="pp-db-olomon"><span className="pp-db-olomon-i"><Odamcha n={48} sinf="pp-db-o" /></span><span className="pp-hisob">75 000</span></div>
      </>}
    </div>
  );
};
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 4 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const done = b >= 4;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bq = DROPBOX_BOSQICH[b];
  const kutish = !!bq.bashorat && !taxmin;
  useXulosaSkroll(done, storedAnswer);
  const keyingi = () => { if (b < 4) setB(b + 1); else onNext(); };
  const yorliq = `Dropbox · ${b + 1}/5`;
  const tx = DROPBOX_TAXMIN.find(x => x.k === taxmin);
  const kimOdam = b === 0 ? {} : { odamlar: [{ id: 'ozi', t: DROPBOX.ozi }, ...(b >= 3 ? [{ id: 'kop', son: b >= 4 ? 12 : 6, kir: true }] : [])] };
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={b < 4 ? `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/5)` : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <>Dropbox <A>boshqalarga ham kerakligi</A> qanday bilindi?</>, ru: <>Как стало понятно, что Dropbox <A>нужен и другим</A>?</> })}
        nuqtalar={<>
          {/* F-1005-81: bosqich gapi Mentorda, har bosqichda almashadi (QVoqea da mentor slot yo'q — nuqtalar slotida) */}
          <Mentor key={`m${b}`}>{tr(bq.m)}</Mentor>
          <div className="pp-nuqtalar"><span className="pp-nuq-l">{yorliq}</span>{DROPBOX_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="pp-voqea" key={b}>
          <span className="pp-voqea-h">{tr(bq.h)}</span>
          <Zoomable>
            <div className="pp-dbx-w">
              {b === 0 && <DbTanishuv />}
              <div className="pp-dbx">
                <DropboxSahna b={b} />
                <AudKarta tur="toliq" nom={<Brend id="dropbox" />}
                  kim={kimOdam} muammo={{ matn: tr(DROPBOX.muammo) }} yechim={b >= 1 ? { matn: tr(DROPBOX.yechim) } : {}} />
              </div>
            </div>
          </Zoomable>
          {bq.bashorat && <QBashorat yorliq={yorliq} savol={tr({ uz: 'Bir kunda nechta odam yozildi?', ru: 'Сколько человек записалось за один день?' })}
            variantlar={DROPBOX_TAXMIN.map(x => ({ k: x.k, t: taxmin === x.k ? `${x.k === 'onming' ? '✓' : '✗'} ${tr(x.t)}` : tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />}
          {bq.bashorat && tx && <QTaxmin togri={tx.k === 'onming'}>{tx.k === 'onming'
            ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
            : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t).toLowerCase()} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: "o'n minglab", ru: 'десятки тысяч' })}</b></>}</QTaxmin>}
          {done && <QXulosa>{tr({ uz: "Dropbox bitta odamning muammosidan boshlangan. Kutish ro'yxati u boshqalarga ham kerakligini ko'rsatdi.", ru: 'Dropbox начался с проблемы одного человека. Список ожидания показал, что он нужен и другим.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Dropbox nomini bilmasliklari mumkin — izohning o'zi yetadi. Raqam manbadan; boshqa raqam qo'shmang.", ru: 'Название Dropbox могут не знать — пояснения достаточно. Число из источника; другие числа не добавляйте.' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 3; Dropbox qoidasi o'quvchi olamiga) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Dropbox'dagidek", ru: 'Проверка · как у Dropbox' })}
    questionText="O'zingiz uchun qurgan jadval botingiz boshqalarga ham kerakligini qachon bilasiz?"
    question={tr({ uz: <h2 className="title h-ask">O'zingiz uchun qurgan jadval botingiz <A>boshqalarga ham kerakligini</A> qachon bilasiz?</h2>, ru: <h2 className="title h-ask">Когда вы узнаете, что бот с расписанием, сделанный для себя, <A>нужен и другим</A>?</h2> })}
    options={[
      { uz: "Botga yana o'nta yangi tugma qo'shib qo'yganda", ru: 'Когда добавите в бота ещё десять новых кнопок' },
      { uz: 'Bot serverga chiqib, kechasi ham ishlaganda', ru: 'Когда бот выйдет на сервер и будет работать ночью' },
      { uz: "Botni Demo Day'da ota-onalarga ko'rsatganda", ru: 'Когда покажете бота родителям на Demo Day' },
      { uz: "Sinfdoshlar uni o'z jadvali uchun ishlatganda", ru: 'Когда одноклассники начнут пользоваться им для своего расписания' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Boshqalar botni o'z ishi uchun ishlata boshladi — demak, u ularga ham kerak.", ru: 'Другие начали пользоваться ботом для своего дела — значит, он нужен и им.' }}
    explainWrong={{
      0: { uz: 'Tugma ko\'paydi, lekin botni hali faqat siz ishlatasiz.', ru: 'Кнопок стало больше, но ботом пока пользуетесь только вы.' },
      1: { uz: 'Bot ishlayapti, lekin uni hali hech kim ishlatmadi.', ru: 'Бот работает, но им ещё никто не пользовался.' },
      2: { uz: "Ota-onalar botni siz ko'rsatganingiz uchun ko'rdi.", ru: 'Родители увидели бота, потому что его показали вы.' },
      default: { uz: 'Dropbox kerakligi qanday bilinganini eslang.', ru: 'Вспомните, как стало понятно, что Dropbox нужен.' }
    }} />
);

// ===== SCREEN 8 — MUSTAQIL ISH (QMustaqil, USTAXONA 1): uch ilova uchun auditoriya-karta · artefakt pm-m7d1-ilovalar · nishon appAnalyst =====
const ILOVA_QATOR = ['nom', 'yechim', 'muammo', 'kim'];
const ILOVA_IPUCHA = {
  nom: { uz: 'Ilova nomi', ru: 'Название приложения' },
  yechim: { uz: 'Ilova nima qiladi?', ru: 'Что делает приложение?' },
  muammo: { uz: 'Ilovasiz odam nimadan qiynalardi?', ru: 'С чем мучился бы человек без приложения?' },
  kim: { uz: 'Bu qanday odamlar?', ru: 'Что это за люди?' }
};
const XABAR8 = {
  bosh: { uz: "To'rt qatorni ham to'ldiring.", ru: 'Заполните все четыре строки.' },
  takror: { uz: 'MUAMMO yechimni takrorladi — odam nimadan qiynaldi?', ru: 'ПРОБЛЕМА повторяет решение — с чем мучился человек?' },
  xohish: { uz: "Bu xohish — odam nimadan qiynalgani ko'rinmaydi.", ru: 'Это желание — не видно, с чем мучился человек.' },
  kim: { uz: 'KIM aniqroq bo\'lsin: qanday odamlar?', ru: 'Уточните КТО: какие именно люди?' },
  nom: { uz: "Bu ilova ro'yxatda bor — boshqasini oling.", ru: 'Это приложение уже есть в списке — возьмите другое.' }
};
const sozlar = (s) => norm(s).split(/[^a-z\u0430-\u044F\u04510-9']+/i).filter(w => w.length > 2);
const umumiyUlush = (a, b) => { const A0 = sozlar(a); const B = new Set(sozlar(b)); return A0.length ? A0.filter(w => B.has(w)).length / A0.length : 0; };
const RE_XOHISH = /xohlardi|yoqardi|yaxshi ko'rardi/;
const RE_KIM_MAVHUM = /^(hamma|odamlar|hamma odamlar)[.!]?$/;
const tekshir8 = (qator, v, qoralama, kartalar, joriy) => {
  const n = norm(v);
  if (!n) return 'bosh';
  if (qator === 'nom' && kartalar.some((k, i) => i !== joriy && k && norm(k.nom) === n)) return 'nom';
  if (qator === 'muammo' && qoralama.yechim && umumiyUlush(n, qoralama.yechim) > 0.5) return 'takror';
  if (qator === 'muammo' && RE_XOHISH.test(n)) return 'xohish';
  if (qator === 'kim' && RE_KIM_MAVHUM.test(n)) return 'kim';
  return null;
};
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [kartalar, setKartalar] = useState(() => { const v = lsGet(KEY_ILOVALAR); return Array.isArray(v) ? v.filter(k => k && k.nom).slice(0, 3) : []; });
  const [tahrir, setTahrir] = useState(null);
  const [r, setR] = useState(0);
  const [qoralama, setQoralama] = useState({});
  const [val, setVal] = useState('');
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const done = kartalar.length >= 3 && tahrir === null;
  useXulosaSkroll(done, storedAnswer);
  const joriy = tahrir ?? kartalar.length;
  useEffect(() => {
    if (kartalar.length < 3 || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'ilovalar', correct: true, picked: true, solved: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  }, [kartalar.length]); // eslint-disable-line
  const saqla = () => {
    const qator = ILOVA_QATOR[r];
    const tur = tekshir8(qator, val, qoralama, kartalar, joriy);
    if (tur === 'bosh' || (tur && !(xato && xato.tur === tur && xato.v === val))) { setXato({ tur, v: val }); return; }
    setXato(null);
    const d = { ...qoralama, [qator]: val.trim() };
    if (r < 3) { setQoralama(d); setR(r + 1); setVal(tahrir !== null ? (kartalar[tahrir][ILOVA_QATOR[r + 1]] || '') : ''); return; }
    const yangi = kartalar.slice();
    if (tahrir !== null) yangi[tahrir] = d; else yangi.push(d);
    setKartalar(yangi); lsSet(KEY_ILOVALAR, yangi);
    setQoralama({}); setR(0); setTahrir(null); setVal('');
  };
  const tahrirla = (i) => { setTahrir(i); setR(0); setQoralama({}); setVal(kartalar[i].nom || ''); setXato(null); };
  const kirit = <GrowInput key={`${joriy}-${r}`} value={val} onChange={e => { setVal(e.target.value); }} onEnter={saqla} placeholder={tr(ILOVA_IPUCHA[ILOVA_QATOR[r]])} maxLength={140} aria-label={tr(ILOVA_IPUCHA[ILOVA_QATOR[r]])} />;
  const qq = (q) => {
    const i = ILOVA_QATOR.indexOf(q);
    if (i < r) return { matn: qoralama[q] };
    if (i === r) return { holat: xato ? 'xato' : 'joriy', ichi: kirit };
    return {};
  };
  const formaKarta = (
    <AudKarta tur="toliq" tartib={['yechim', 'muammo', 'kim']} className={cxx('pp-forma', r === 0 && (xato ? 'nom-xato' : 'nom-joriy'))}
      nom={r === 0 ? kirit : qoralama.nom} yechim={qq('yechim')} muammo={qq('muammo')} kim={qq('kim')} />
  );
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Uch kartani yozing', ru: 'Напишите три карты' })} (${kartalar.length}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Telefoningizdagi ilovalar <A>kimga kerak?</A></>, ru: <>Кому нужны <A>приложения в вашем телефоне?</A></> })}
        mentor={<Mentor>{tr({ uz: 'Har kuni ishlatadigan ilovalaringizni oling: avval ilova nima qilishini, keyin u kimning qaysi muammosini yechishini yozing.', ru: 'Возьмите приложения, которыми пользуетесь каждый день: сначала напишите, что делает приложение, потом — чью и какую проблему оно решает.' })}</Mentor>}
        qadamlar={!done && !isMentor && <div className="pp-doiralar" aria-hidden="true">{[0, 1, 2].map(i => <span key={i} className={cxx('pp-doira', i < kartalar.length && i !== tahrir ? 'ok' : i === joriy && 'cur')}>{i < kartalar.length && i !== tahrir ? '✓' : i + 1}</span>)}</div>}
        forma={isMentor
          ? <AudKarta tur="toliq" nom={MAHSULOTLAR[0].nom} yorliq="mahsulot" toliq kim={{ odamlar: [{ t: MAHSULOTLAR[0].kim, nega: 'ozIshi', son: 3 }] }} muammo={{ matn: tr(MAHSULOTLAR[0].muammo) }} yechim={{ matn: tr(MAHSULOTLAR[0].yechim) }} />
          : !done && <>
              {formaKarta}
              {xato && <div className="pp-xato"><QXato>{tr(XABAR8[xato.tur])}</QXato>{xato.tur !== 'bosh' && <QIzoh>{tr(QOLDIR)}</QIzoh>}</div>}
              <div className="pp-amal"><QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma><QTugma className={val.trim() ? 'pp-bos' : undefined} onClick={saqla}>{tr(SAQLASH)}</QTugma></div>
            </>}
        yordam={!done && !isMentor && yordam && <QIzoh>{tr({ uz: "Ilovani bir hafta ishlatmasangiz, nima qiyin bo'lardi? O'sha qiyinchilik MUAMMO qatoriga yoziladi.", ru: 'Если неделю не пользоваться приложением, что было бы трудно? Эта трудность и пишется в строку ПРОБЛЕМА.' })}</QIzoh>}
      >
        {isMentor && <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Uch kartani yozganlar', ru: 'Написали три карты' }} />}
        {done && !isMentor && <div className="pp-uch q-fokus">
          {kartalar.map((k, i) => (
            <AudKarta key={i} tur="toliq" nom={k.nom} toliq className="kichik"
              kim={{ odamlar: [{ t: k.kim, son: 3 }] }} muammo={{ matn: k.muammo }} yechim={{ matn: k.yechim }}>
              <div className="pp-amal"><QTugma ikkinchi onClick={() => tahrirla(i)}>{tr(TAHRIR)}</QTugma></div>
            </AudKarta>
          ))}
        </div>}
        {done && !isMentor && <QXulosa>{tr({ uz: 'Uch mahsulot kartangiz tayyor: har birida yechim kimningdir muammosini yengillashtiradi.', ru: 'Три карты продуктов готовы: в каждой решение облегчает чью-то проблему.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Eng ko'p xato — MUAMMO qatoriga yechimni qayta yozish («video ko'rsatadi»). «Ilova bo'lmasa, nima qilardingiz?» deb so'rang.", ru: 'Самая частая ошибка — снова писать решение в строку ПРОБЛЕМА («показывает видео»). Спросите: «Что бы вы делали без приложения?»' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 9 — MENTORNING RO'YXATI (QTushuncha: saralash · «maydon» muammosi shu yerda birinchi bor topiladi · nishon cleanList) =====
// F-1005-83 (qaror A): yozuvlar bittadan katta karta bo'lib chiqadi (manba yorlig'i + gap + uch belgi chipi) · «Ro'yxatga» / «Chiqarib tashlash»
//   to'g'ri — karta o'ngdagi ro'yxatga uchib kiradi (6/10 → 7/10 …), chiqarilgani chetga so'nadi · xato — karta silkinadi, sabab chiqadi (QXato)
//   oxirida ro'yxat yig'iladi, maydon yozuvi ajralib chiqib Maydon kartasiga aylanadi → QTaxmin → xulosa. Ro'yxatda bo'sh uzuq qator yo'q.
const XABAR9 = {
  yechim: { uz: 'Bu yechim — kim nimadan qiynalgani yozilmagan.', ru: 'Это решение — не написано, кто и с чем мучился.' },
  fikr: { uz: "Bu fikr — hech kim qiynalgani ko'rinmaydi.", ru: 'Это мнение — не видно, чтобы кто-то мучился.' },
  muammo: { uz: 'Bu yerda odam qiynalgan — belgisini toping.', ru: 'Здесь человек мучился — найдите признак.' }
};
const S9_TAXMIN = [{ k: '3', t: '3' }, { k: '4', t: '4' }, { k: '5', t: '5' }];
// «Muammoni qanday topamiz» darsidagi uch belgi — karta ostida chip (alohida eslatma qatori yo'q)
const UCH_BELGI = [
  { uz: "qayta-qayta bo'ladi", ru: 'повторяется снова и снова' },
  { uz: "o'zicha yo'l topgan", ru: 'нашёл обходной путь' },
  { uz: 'voz kechgan', ru: 'отказался' }
];
const S9_UCH = 430; // ms: karta ro'yxatga uchib kirishi / chetga so'nishi
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const xatoRef = useRef(false);
  const Y = ROYXAT_MENTOR.yozuvlar;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qoshilgan, setQoshilgan] = useState(() => (storedAnswer ? Y.filter(y => y.tur === 'muammo').map(y => y.id) : []));
  const [chiq, setChiq] = useState(() => (storedAnswer ? Y.filter(y => y.tur !== 'muammo').map(y => y.id) : []));
  const [uchish, setUchish] = useState(null); // { id, royxatga } — karta harakatda
  const [yangi, setYangi] = useState(null); // ro'yxatga hozirgina kirgan qator (ajralib turadi)
  const [xato, setXato] = useState(null);
  const soni = qoshilgan.length + chiq.length;
  const done = soni >= Y.length;
  const joriy = Y.find(y => !qoshilgan.includes(y.id) && !chiq.includes(y.id));
  const [bosqich2, setBosqich2] = useState(!!storedAnswer);
  useEffect(() => {
    if (!done || bosqich2) return undefined;
    const t = setTimeout(() => setBosqich2(true), kamHarakat() ? 100 : 1100);
    return () => clearTimeout(t);
  }, [done, bosqich2]);
  const tugadi = useTugadi(bosqich2, 0, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  const ipucha = useIpucha(!done && !!taxmin, `${soni}-${xato ? xato.k : 0}`);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'saralash', screenIdx: screen, correct: !xatoRef.current, picked: true, solved: true, taxmin }); }, [done]); // eslint-disable-line
  const hal = (y, royxatga) => {
    if (uchish || !taxmin) return;
    if (royxatga === (y.tur === 'muammo')) {
      setXato(null); setUchish({ id: y.id, royxatga });
      setTimeout(() => {
        if (royxatga) { setQoshilgan(a => [...a, y.id]); setYangi(y.id); } else setChiq(a => [...a, y.id]);
        setUchish(null);
      }, kamHarakat() ? 60 : S9_UCH);
    } else {
      xatoRef.current = true; if (achMiss) achMiss.miss(screen);
      setXato({ id: y.id, tur: royxatga ? y.tur : 'muammo', k: Date.now() });
    }
  };
  const byId = (id) => Y.find(y => y.id === id);
  const n = 6 + qoshilgan.length;
  const qator = (x, key, cls) => <AudKarta key={key} tur="qator" className={cls} joy={tr(JOY[x.joy])} matn={tr(x.t)} />;
  const royxat = (
    <div className={cxx('pp-mro', done && 'tola')}>
      <div className="pp-mro-bosh"><span className="pp-mro-l">{tr({ uz: "Mentor ro'yxati", ru: 'Список Ментора' })}</span><span key={n} className="pp-mro-n kir">{n} / 10</span></div>
      <div className="pp-mro-q">
        {ROYXAT_MENTOR.tayyor.map((x, i) => qator(x, `t${i}`))}
        {qoshilgan.map(id => { const y = byId(id); return qator(y, id, cxx(id === yangi && 'yangi', done && y.maydon && 'tanlandi')); })}
      </div>
    </div>
  );
  const silk = xato && joriy && xato.id === joriy.id;
  const karta = joriy && (
    <div key={silk ? `${joriy.id}-${xato.k}` : joriy.id} className={cxx('pp-s9-karta', silk && 'silk', uchish && (uchish.royxatga ? 'uch-royxat' : 'uch-chiq'))}>
      <div className="pp-s9-k-bosh"><span className="ak-joy">{tr(JOY[joriy.joy])}</span><span className="pp-s9-k-n">{soni + 1} / {Y.length}</span></div>
      <p className="pp-s9-k-t">{tr(joriy.t)}</p>
      <div className="pp-belgilar"><span className="pp-belgi-l">{tr({ uz: 'uch belgi', ru: 'три признака' })}</span>{UCH_BELGI.map((x, i) => <span key={i} className="pp-belgi">{tr(x)}</span>)}</div>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · muammo yig'ish", ru: 'Понятие · сбор проблем' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!bosqich2} label={bosqich2 ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Yozuvlarni joylang', ru: 'Разложите записи' })} (${soni}/6)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Qaysi yozuv <A>Mentor ro'yxatiga</A> tushadi?</>, ru: <>Какая запись попадёт <A>в список Ментора</A>?</> })}
        mentor={<Mentor>{tr({ uz: "Kecha maktab, yo'l va mahallada ko'rganlarimni yozib chiqdim. Har yozuvni ro'yxatga qo'shing yoki chiqarib tashlang.", ru: 'Вчера я записал то, что видел в школе, на дороге и в махалле. Каждую запись добавьте в список или уберите.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Olti yozuvdan nechtasi muammo?', ru: 'Сколько из шести записей — проблемы?' })} variantlar={S9_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        harakat={!done && <div className="pp-s9-chap">
          {karta}
          <div className="pp-amal">
            <QTugma ikkinchi disabled={!taxmin || !!uchish} onClick={() => joriy && hal(joriy, false)}>{tr({ uz: 'Chiqarib tashlash', ru: 'Убрать' })}</QTugma>
            <QTugma ikkinchi disabled={!taxmin || !!uchish} onClick={() => joriy && hal(joriy, true)}>{tr({ uz: "Ro'yxatga", ru: 'В список' })}</QTugma>
          </div>
          {xato && <QXato>{tr(XABAR9[xato.tur])}</QXato>}
          {ipucha && !xato && <QIzoh>{tr({ uz: 'Har yozuvda odam qiynalganmi — shuni qarang.', ru: 'Смотрите, мучился ли человек в каждой записи.' })}</QIzoh>}
          <AchRule screen={screen} />
        </div>}
        vizual={bosqich2
          ? <div className={cxx('pp-s9-yakun', storedAnswer && 'qayt')}>
              {/* F-1005-90 (qaror B): ro'yxat bitta ixcham qatorga yig'iladi — kulrang chiziqlar yo'q */}
              <div className="pp-mro-qator">
                <span className="pp-mro-l">{tr({ uz: "Mentor ro'yxati", ru: 'Список Ментора' })}</span>
                <span className="pp-mro-s">{tr({ uz: "muammolar yig'ildi", ru: 'проблемы собраны' })}</span>
                <span className="pp-mro-n">10 / 10 ✓</span>
              </div>
              <MaydonKarta className="pp-ajral" />
            </div>
          : royxat}
        natija={bosqich2 && taxmin && <QTaxmin togri={taxmin === '4'}>{taxmin === '4'
          ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
          : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {taxmin} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>4</b></>}</QTaxmin>}
        xulosa={bosqich2 && tr({ uz: "Mentor maydon muammosini tanladi: uni maydonda o'ynaydiganlardan so'rab bilish mumkin.", ru: 'Ментор выбрал проблему поля: о ней можно узнать, расспросив тех, кто играет на поле.' })}
      >
        <MentorNote>{tr({ uz: "Maydon — modul bo'yi misolimiz. Bugun yechim aytmang: «sayt qilamiz» deyish erta, avval o'yinchilarning o'zidan eshitiladi.", ru: 'Поле — наш пример на весь модуль. Сегодня не называйте решение: говорить «сделаем сайт» рано, сначала послушаем самих игроков.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 10 — JUFTLIKDA ISH (QMustaqil, USTAXONA 2): o'nta muammo · artefakt pm-m7d1-muammolar · nishon streetScout =====
const S10_SAVOL = [
  { uz: "Qayerda har safar kutishga to'g'ri keladi?", ru: 'Где каждый раз приходится ждать?' },
  { uz: "Nimani bilish uchun kimdandir so'radingiz?", ru: 'Что вы спрашивали у кого-то, чтобы узнать?' },
  { uz: 'Nimadan voz kechib, qaytib ketdingiz?', ru: 'От чего вы отказались и ушли обратно?' }
];
const S10_QADAM = {
  juft: [
    { t: { uz: "Sherigingizdan so'rang", ru: 'Спросите партнёра' }, soniya: 180, manba: 'sinfdosh' },
    { t: { uz: "O'rin almashing", ru: 'Поменяйтесь местами' }, soniya: 180, manba: 'ozim' },
    { t: { uz: "O'zingiz ko'rganlarni qo'shing", ru: 'Добавьте то, что видели сами' }, manba: 'ozim' }
  ],
  yakka: [
    { t: { uz: "Kecha ko'rgan odamlaringizni eslang", ru: 'Вспомните людей, которых видели вчера' }, manba: 'ozim' },
    { t: { uz: "O'zingiz ko'rganlarni qo'shing", ru: 'Добавьте то, что видели сами' }, manba: 'ozim' }
  ]
};
const MANBA = { sinfdosh: { uz: 'sinfdoshdan', ru: 'от одноклассника' }, ozim: { uz: "o'zim ko'rdim", ru: 'видел сам' } };
const XABAR10 = {
  takror: { uz: "Bu muammo ro'yxatda bor. Boshqa joyni eslang.", ru: 'Эта проблема уже в списке. Вспомните другое место.' },
  qisqa: { uz: 'Juda qisqa: kim, qayerda, nimadan qiynaldi?', ru: 'Слишком коротко: кто, где и с чем мучился?' },
  yechim: { uz: 'Bu yechim. Avval odam nimadan qiynalishini yozing.', ru: 'Это решение. Сначала напишите, с чем мучается человек.' },
  umumiy: { uz: 'Bu umumiy gap. Kim qiynaldi va qayerda?', ru: 'Это общие слова. Кто мучился и где?' }
};
// m2-16 dagi RE_YECHIM (kerak\b) bu yerda YO'Q: maydon muammosining o'zi «…qo'ng'iroq qilish kerak» bilan tugaydi (MD KOD 12).
const RE_YECHIM10 = /(qurish|qilish) kerak[.!]?$/;
const RE_ODAM = /o'quvchi|odam|qo'shni|o'yinchi|bola|\S+lar\b/;
const RE_MAVHUM = /(^|\s)(yomon|qiyin|hamma)(\s|[.,!?]|$)/;
const tekshir10 = (v, royxat, joriy) => {
  const n = norm(v);
  if (!n) return 'bosh';
  if (royxat.some((m, i) => i !== joriy && norm(m.matn) === n)) return 'takror';
  if (n.length <= 15) return 'qisqa';
  if (RE_YECHIM10.test(n) && !RE_ODAM.test(n)) return 'yechim';
  if (RE_MAVHUM.test(n) && n.split(' ').length <= 5) return 'umumiy';
  return null;
};
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const yakka = yakkaMi(live);
  const QADAM = yakka ? S10_QADAM.yakka : S10_QADAM.juft;
  const [royxat, setRoyxat] = useState(() => { const v = lsGet(KEY_MUAMMOLAR); return v && Array.isArray(v.muammolar) ? v.muammolar.filter(m => m && m.matn).slice(0, 10) : []; });
  const [qadam, setQadam] = useState(0);
  const [val, setVal] = useState('');
  const [tahrir, setTahrir] = useState(null);
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [vaqtBosh, setVaqtBosh] = useState(false);
  const n = royxat.length;
  const done = n >= 10 && tahrir === null;
  useXulosaSkroll(done, storedAnswer);
  const nSinf = royxat.filter(m => m.manba === 'sinfdosh').length;
  const q = QADAM[Math.min(qadam, QADAM.length - 1)];
  useEffect(() => {
    if (n < 10 || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'muammolar', correct: true, picked: true, solved: true, sinfdoshdan: nSinf });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', nSinf, true, 0);
  }, [n]); // eslint-disable-line
  const yoz = (yangi) => { setRoyxat(yangi); lsSet(KEY_MUAMMOLAR, { muammolar: yangi, savedAt: Date.now() }); };
  const saqla = () => {
    const joriy = tahrir ?? n;
    const tur = tekshir10(val, royxat, joriy);
    if (tur === 'bosh' || (tur && !(xato && xato.tur === tur && xato.v === val))) { setXato({ tur, v: val }); return; }
    setXato(null);
    if (tahrir !== null) { const y = royxat.slice(); y[tahrir] = { ...y[tahrir], matn: val.trim() }; yoz(y); setTahrir(null); }
    else yoz([...royxat, { matn: val.trim(), manba: q.manba }]);
    setVal('');
  };
  const tahrirla = (i) => { setTahrir(i); setVal(royxat[i].matn); setXato(null); };
  const kirit = <GrowInput value={val} onChange={e => { setVal(e.target.value); }} onEnter={saqla} placeholder={tr({ uz: 'Kim, qayerda, nimadan qiynaldi?', ru: 'Кто, где и с чем мучился?' })} maxLength={160} aria-label={tr({ uz: 'Kim, qayerda, nimadan qiynaldi?', ru: 'Кто, где и с чем мучился?' })} />;
  const xatoBlok = xato && <div className="pp-xato"><QXato>{tr(xato.tur === 'bosh' ? XABAR10.qisqa : XABAR10[xato.tur])}</QXato>{xato.tur !== 'bosh' && <QIzoh>{tr(QOLDIR)}</QIzoh>}</div>;
  const timerMatn = { boshlash: tr({ uz: '3 daqiqani boshlash', ru: 'Запустить 3 минуты' }), toxtatish: tr({ uz: "To'xtatish", ru: 'Остановить' }), yana: tr({ uz: '↻ Yana 3 daqiqa', ru: '↻ Ещё 3 минуты' }) };
  return (
    <Stage eyebrow={yakka ? tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' }) : tr({ uz: 'Juftlikda ish', ru: 'Работа в паре' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${10 - n} ta muammo yozing`, ru: `Напишите ещё ${10 - n}` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={yakka
          ? tr({ uz: <>Kecha kim <A>qayerda qiynaldi?</A></>, ru: <>Кто вчера и <A>где мучился?</A></> })
          : tr({ uz: <>Sinfdoshingiz kecha <A>qayerda qiynaldi?</A></>, ru: <>Где вчера <A>мучился ваш одноклассник?</A></> })}
        mentor={<Mentor>{yakka
          ? tr({ uz: "Pastdagi savollarni o'zingizga bering va kecha ko'rgan odamlaringizni eslang. Har muammoni bittadan yozing.", ru: 'Задайте себе вопросы ниже и вспомните людей, которых видели вчера. Записывайте каждую проблему по одной.' })
          : tr({ uz: "Sherigingizga pastdagi savollarni bering, keyin o'rin almashing. Eshitganingiz va o'zingiz ko'rganingizni bittadan yozing.", ru: 'Задайте партнёру вопросы ниже, потом поменяйтесь местами. Записывайте по одному то, что услышали и что видели сами.' })}</Mentor>}
        qadamlar={!done && <div className="pp-s10-bosh">
          <ol className="pp-savollar">{S10_SAVOL.map((s, i) => <li key={i}><i>{i + 1}</i><span>{tr(s)}</span></li>)}</ol>
          <div className="pp-bosq">{QADAM.map((x, i) => <QChip key={i} holat={i === qadam ? 'on' : (i < qadam ? 'ok' : undefined)} onClick={() => setQadam(i)}>{i < qadam ? '✓' : i + 1} {tr(x.t)}</QChip>)}</div>
          {q.soniya && <Taymer key={qadam} soniya={q.soniya} matn={timerMatn} chorla={!isMentor && n === 0 && !val && !vaqtBosh} onBoshla={() => setVaqtBosh(true)} onTugadi={() => setQadam(x => Math.min(x + 1, QADAM.length - 1))} />}
        </div>}
        forma={!done && !isMentor && <>
          <div className="pp-hisob-q"><div className="pp-nuqta10" aria-hidden="true">{Array.from({ length: 10 }).map((_, i) => <i key={i} className={i < n ? 'ok' : i === n ? 'cur' : ''}>{i < n ? '✓' : ''}</i>)}</div><span className="pp-mro-n">{n} / 10</span></div>
          {tahrir === null && <div className={cxx('pp-yozish', xato && 'xato', !val && (yakka || vaqtBosh || n > 0 || !q.soniya) && 'chorla')}>{kirit}</div>}
          {tahrir === null && xatoBlok}
          {tahrir === null && <div className="pp-amal"><QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma><QTugma className={val.trim() ? 'pp-bos' : undefined} onClick={saqla}>{tr(SAQLASH)}</QTugma></div>}
        </>}
        yordam={!done && !isMentor && yordam && <QIzoh>{tr({ uz: "Kecha uydan chiqqaningizdan qaytguningizcha borgan joylaringizni sanang: bekat, maktab, do'kon, maydon. Qayerda kutdingiz yoki kimdandir so'radingiz?", ru: 'Перечислите места, где вы были вчера с выхода из дома до возвращения: остановка, школа, магазин, поле. Где вы ждали или у кого-то спрашивали?' })}</QIzoh>}
      >
        {isMentor && <MentorPracticeStats live={live} screen={screen} label={{ uz: "O'nta muammoni yozganlar", ru: 'Написали десять проблем' }} sanoq={{ uz: 'sinfdoshdan yozilganlar', ru: 'записано от одноклассника' }} />}
        {!isMentor && n > 0 && <div className={cxx('pp-mlist', done && 'q-fokus')}>
          {royxat.map((m, i) => (
            <div key={i} className={cxx('pp-mq', i === n - 1 && !done && 'kir', tahrir === i && 'tahrir')}>
              {tahrir === i
                ? <>{<div className={cxx('pp-yozish', xato && 'xato')}>{kirit}</div>}{xatoBlok}<div className="pp-amal"><QTugma onClick={saqla}>{tr(SAQLASH)}</QTugma></div></>
                : <><span className="pp-mq-n">{i + 1}</span><span className="pp-mq-t">{m.matn}</span><span className={cxx('pp-manba', m.manba)}>{tr(MANBA[m.manba] || MANBA.ozim)}</span>
                  {done && tahrir === null && <QTugma ikkinchi onClick={() => tahrirla(i)}>{tr(TAHRIR)}</QTugma>}</>}
            </div>
          ))}
        </div>}
        {done && !isMentor && <QXulosa>{nSinf > 0
          ? tr({ uz: `O'nta muammo yig'dingiz: ${nSinf} tasini sinfdoshingizdan eshitdingiz.`, ru: `Вы собрали десять проблем: ${nSinf} из них услышали от одноклассника.` })
          : tr({ uz: "O'nta muammo yig'dingiz.", ru: 'Вы собрали десять проблем.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Taymerni siz boshqaring — 3 daqiqadan keyin «O'rin almashing» deng. 10 taga ulgurmagan o'quvchi uyda to'ldiradi.", ru: 'Таймером управляете вы — через 3 минуты скажите «Поменяйтесь местами». Кто не успеет до 10, допишет дома.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 11 — KOD YOZISH (QKod + HtmlCompiler; darvoza-mashq PM-082 c/e; kod nusxalanmaydi PM-082 d; «kompilyator» ta'riflanmaydi) =====
// Yozuvlar — Mentor ro'yxatidan (ROYXAT_MENTOR.yozuvlar, matn qisqartirilgan). Kod-nomlari ASCII: joy · matn · tur: "muammo" | "yechim" | "fikr".
const KOD_STARTER = { uz: `// Mentor ro'yxatidagi yozuvlar: joy, matn va turi
const yozuvlar = [
  { joy: "yo'l", matn: "Velosiped teshilsa, ustaxona topilmaydi", tur: "muammo" },
  { joy: "mahalla", matn: "Yana bitta maydon qurish kerak", tur: "yechim" },
  { joy: "maktab", matn: "Futbol — eng qiziq o'yin", tur: "fikr" },
  { joy: "maktab", matn: "Oshxonada nima borligini navbatda bilishadi", tur: "muammo" }
];

function muammolar(royxat) {
  // faqat muammolarning matni qaytsin
  return [];   // shu joyni siz yozasiz
}

console.log(muammolar(yozuvlar));
// ["Velosiped teshilsa, ustaxona topilmaydi", "Oshxonada nima borligini navbatda bilishadi"]
console.log(muammolar([]));
// []
console.log(muammolar([yozuvlar[1], yozuvlar[3]]));
// ["Oshxonada nima borligini navbatda bilishadi"]`,
  ru: `// Записи из списка Ментора: место, текст и тип
const yozuvlar = [
  { joy: "дорога", matn: "Если проколется колесо, мастерскую не найти", tur: "muammo" },
  { joy: "махалля", matn: "Нужно построить ещё одно поле", tur: "yechim" },
  { joy: "школа", matn: "Футбол — самая интересная игра", tur: "fikr" },
  { joy: "школа", matn: "Что есть в столовой, узнают в очереди", tur: "muammo" }
];

function muammolar(royxat) {
  // пусть вернётся только текст проблем
  return [];   // это место пишете вы
}

console.log(muammolar(yozuvlar));
// ["Если проколется колесо, мастерскую не найти",
//  "Что есть в столовой, узнают в очереди"]
console.log(muammolar([]));
// []
console.log(muammolar([yozuvlar[1], yozuvlar[3]]));
// ["Что есть в столовой, узнают в очереди"]` };
// Shartlar xulq-atvorga bog'langan (manba-regex emas): for...of ham, filter + map ham o'tadi; starter holatida uchalasi qizil.
const KOD_DATA = `[{joy:"yo'l",matn:"Velosiped teshilsa, ustaxona topilmaydi",tur:"muammo"},{joy:"mahalla",matn:"Yana bitta maydon qurish kerak",tur:"yechim"},{joy:"maktab",matn:"Futbol — eng qiziq o'yin",tur:"fikr"},{joy:"maktab",matn:"Oshxonada nima borligini navbatda bilishadi",tur:"muammo"}]`;
const KOD_VAZIFA = [
  { uz: "Funksiya ro'yxat (massiv) qaytaradi", ru: 'Функция возвращает список (массив)' },
  { uz: "Ro'yxatga faqat muammolarning matni tushadi", ru: 'В список попадает только текст проблем' },
  { uz: 'Uchala `console.log` kutilgandek chiqdi', ru: 'Все три `console.log` вывели ожидаемое' }
];
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: 'app.js — muammolar funksiyasini yakunlang', ru: 'app.js — допишите функцию muammolar' },
  files: [{ name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: { uz: "// muammolarning matnini yig'ib qaytaring", ru: '// соберите и верните текст проблем' } }],
  requirements: [
    { id: 'royxat', label: KOD_VAZIFA[0],
      check: C.evalEquals(`(function(){var a=muammolar(${KOD_DATA});return (Array.isArray(a)&&a.length===2)?"ha":"yoq";})()`, 'ha', { uz: "Funksiya ro'yxat qaytarsin: to'rt yozuvdan ikkitasi tushadi.", ru: 'Функция должна вернуть список: из четырёх записей попадают две.' }) },
    { id: 'faqat', label: KOD_VAZIFA[1],
      check: C.evalEquals(`(function(){var a=muammolar(${KOD_DATA});if(!Array.isArray(a))return "";return a.join("|");})()`, 'Velosiped teshilsa, ustaxona topilmaydi|Oshxonada nima borligini navbatda bilishadi', { uz: 'Faqat matn tushsin; yechim va fikr tushmasin.', ru: 'Пусть попадает только текст; решение и мнение — нет.' }) },
    { id: 'uch', label: { uz: 'Uchala console.log kutilgandek chiqdi', ru: 'Все три console.log вывели ожидаемое' },
      check: C.evalEquals(`(function(){var b=muammolar([]),c=muammolar([${KOD_DATA}[1],${KOD_DATA}[3]]);if(!Array.isArray(b)||!Array.isArray(c))return "";return b.length+"/"+c.join("|");})()`, '0/Oshxonada nima borligini navbatda bilishadi', { uz: "Bo'sh ro'yxatga — bo'sh; ikki yozuvdan bittasi tushadi.", ru: 'Для пустого списка — пустой; из двух записей попадает одна.' }) }
  ]
};
const KOD_DARVOZA = [
  { id: 'joy', ok: false, x: { uz: 'Joydan yozuv muammomi yoki yechimmi — bilinmaydi.', ru: 'По месту не понять, проблема это или решение.' } },
  { id: 'matn', ok: false, x: { uz: "Kod gapning ma'nosini o'qimaydi — unga belgi kerak.", ru: 'Код не читает смысл фразы — ему нужна метка.' } },
  { id: 'tur', ok: true }
];
// Kod namunasi (o'qish uchun; nusxalanmaydi): `tur` qiymatlari darvozadan keyin bir lahza ajraladi — muammo yashil, yechim va fikr kulrang
const KodNamuna = ({ ajrat }) => (
  <pre className={cxx('pp-kod', ajrat && 'ajrat')} onCopy={(e) => e.preventDefault()} aria-label="app.js">
    {tr(KOD_STARTER).split('\n').slice(0, 12).map((l, i) => {
      if (l.trim().startsWith('//')) return <span key={i} className="pp-kod-izoh">{l}{'\n'}</span>;
      const m = /^(.*tur: )"(muammo|yechim|fikr)"(.*)$/.exec(l);
      if (!m) return <span key={i}>{l}{'\n'}</span>;
      return <span key={i}>{m[1]}<b className={cxx('pp-tur', m[2])}>"{m[2]}"</b>{m[3]}{'\n'}</span>;
    })}
  </pre>
);
// QKod o'ng ustun propining qolip-nomi (Editor ma'nosidagi o'zbekcha so'z) til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi —
// u o'quvchi matni emas, qolip API nomi; propni shu doimiy orqali beramiz (hisobot 7-band: qoida yoki prop nomi asosiy seansda).
const QKOD_ONG = 'muh\u0061rrir';
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'tur' : null));
  const [miss, setMiss] = useState(null);
  const [ajrat, setAjrat] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(() => (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const stage2 = !!gpick || isMentor || done;
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 2400); return () => clearTimeout(t); }, [ajrat]);
  const pickGate = (g) => {
    if (stage2) return;
    if (g.ok) { setGpick(g.id); setMiss(null); setAjrat(true); }
    else setMiss({ id: g.id, k: Date.now() });
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
  const darvoza = (
    <div className="pp-darvoza">
      <span className="pp-darvoza-s">{tr({ uz: 'Kod yozuvni qaysi qiymatga qarab ajratadi?', ru: 'По какому значению код отделяет запись?' })}</span>
      <div className="pp-tanlov qator">
        {KOD_DARVOZA.map(g => {
          const silk = miss && miss.id === g.id;
          return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} silk={silk} holat={gpick === g.id ? 'ok' : undefined} disabled={stage2 && gpick !== g.id} onClick={() => pickGate(g)}><span className="mono">{g.id}</span></QChip>;
        })}
      </div>
      {miss && <QXato>{tr(KOD_DARVOZA.find(g => g.id === miss.id).x)}</QXato>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish', ru: 'Пишем код' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Qiymatni tanlang', ru: 'Выберите значение' }) : tr({ uz: 'Kodni yozing', ru: 'Напишите код' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Ro'yxatdan faqat muammolarni ajratadigan <A>kod</A> yozamiz.</>, ru: <>Пишем <A>код</A>, который отбирает из списка только проблемы.</> })}
        mentor={<Mentor>{!stage2
          ? tr({ uz: "9-ekranda yozuvlarni qo'lda ajratdingiz — endi shu ishni kod bajaradi. Yozuvlar — Mentor ro'yxatidan.", ru: 'На 9-м экране вы разбирали записи вручную — теперь эту работу сделает код. Записи — из списка Ментора.' })
          : tr({ uz: "Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Нажмите кнопку — откроется окно кода: вы пишете код и сразу видите результат здесь.' })}</Mentor>}
        vazifa={<>
          {darvoza}
          {stage2 && <ol className="pp-vazifa">{KOD_VAZIFA.map((v, i) => <li key={i}><i>{i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>}
        </>}
        yordam={stage2 && <div className="pp-yordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma>
          {yordam && <>
            <QIzoh>{fmtCode(tr({ uz: 'Bitta yozuvdan boshlang: birinchi yozuvning `tur` qiymati `"muammo"` mi? Ishlagach qolganlariga o\'ting.', ru: 'Начните с одной записи: значение `tur` у первой записи — `"muammo"`? Когда заработает, переходите к остальным.' }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: "Eslatma (JavaScript darslaridan): `function` — bitta vazifani bajaradigan kod bo'lagi · massiv — ro'yxat · `console.log` — qiymatni ekranga chiqaradi.", ru: 'Напоминание (из уроков JavaScript): `function` — кусочек кода, который выполняет одну задачу · массив — список · `console.log` — выводит значение на экран.' }))}</QIzoh>
          </>}
        </div>}
        {...{ [QKOD_ONG]: <div className="pp-kodoyna">
          <KodNamuna ajrat={ajrat} />
          {stage2 && <div className="pp-amal"><QTugma className={!done && !isMentor ? 'pp-bos' : undefined} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma></div>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      />
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), .hc-root ham o'zi qo'yadi — qobiq tashqi zoomni bekor qiladi (PmLesson25 naqshi). */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_STARTER)} storageKey="pm-m7d1-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s12 = 0; uch belgi + 2-darsga ko'prik) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Qaysi muammo haqida avval odamlardan so'raysiz?"
    question={tr({ uz: <h2 className="title h-ask">Qaysi muammo haqida <A>avval</A> odamlardan so'raysiz?</h2>, ru: <h2 className="title h-ask">О какой проблеме вы <A>сначала</A> спросите людей?</h2> })}
    options={[
      { uz: "Ko'p tengdoshda qayta-qayta bo'ladigan muammo", ru: 'О проблеме, которая повторяется у многих ровесников' },
      { uz: "Faqat o'zingizda qayta-qayta bo'ladigan muammo", ru: 'О проблеме, которая повторяется только у вас' },
      { uz: 'Bitta tanishingiz bir marta aytib o\'tgan muammo', ru: 'О проблеме, о которой один знакомый сказал один раз' },
      { uz: 'AI bilan yechish eng qiziq tuyulgan muammo', ru: 'О проблеме, которую интереснее всего решить с AI' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Bir necha odamda takrorlangan muammo haqida avval o'shalardan so'raymiz.", ru: 'О проблеме, которая повторилась у нескольких людей, сначала спрашиваем их самих.' }}
    explainWrong={{
      1: { uz: "Faqat sizda bo'lsa, so'raydigan boshqa odam yo'q.", ru: 'Если она только у вас, спросить больше некого.' },
      2: { uz: "Bir marta aytilgan — takror yo'q, tasodif bo'lishi mumkin.", ru: 'Сказано один раз — повтора нет, может быть случайностью.' },
      3: { uz: 'Qiziq texnologiya — hali hech kim qiynalgani emas.', ru: 'Интересная технология — это ещё не чьё-то мучение.' },
      default: { uz: 'Bu muammo yana kimda bor — shuni qarang.', ru: 'Посмотрите, у кого ещё есть эта проблема.' }
    }} />
);

// ===== SCREEN 13 — O'ZINGIZ O'YLAB KO'RING (QMustaqil, 2 qadam): bitta muammo → KIM qatori · artefakt pm-m7d1-tanlangan (2-dars kirishi) =====
const Screen13 = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const yakka = yakkaMi(live);
  const [royxat] = useState(() => { const v = lsGet(KEY_MUAMMOLAR); return v && Array.isArray(v.muammolar) ? v.muammolar.filter(m => m && m.matn) : []; });
  const [saqlangan] = useState(() => lsGet(KEY_TANLANGAN));
  const [tanlov, setTanlov] = useState(() => (saqlangan && saqlangan.matn && royxat.some(m => m.matn === saqlangan.matn) ? saqlangan.matn : null));
  const [kim, setKim] = useState(() => (saqlangan && saqlangan.kim) || '');
  const [vaqt, setVaqt] = useState(false);
  // tanlovdan keyin ro'yxat yig'iladi — karta va xulosa 773 balandlikda pastki panel ostiga kirmaydi; «Boshqa muammoni tanlash» qayta ochadi
  const [roOchiq, setRoOchiq] = useState(() => !(saqlangan && saqlangan.matn && royxat.some(m => m.matn === saqlangan.matn)));
  const zaxira = isMentor || royxat.length === 0;
  const yozildi = kim.trim().length >= 8;
  const tayyor = zaxira || (!!tanlov && yozildi);
  useEffect(() => { if (zaxira || !tanlov || !yozildi) return; lsSet(KEY_TANLANGAN, { matn: tanlov, kim: kim.trim() }); }, [tanlov, kim]); // eslint-disable-line
  const joriy = tayyor ? 2 : (vaqt || kim.length > 0 ? 1 : 0);
  const QADAM = [yakka ? { uz: 'Ovoz chiqarib ayting', ru: 'Скажите вслух' } : { uz: 'Sherigingizga ayting', ru: 'Скажите партнёру' }, { uz: 'KIM qatorini yozing', ru: 'Напишите строку КТО' }];
  const timerMatn = yakka
    ? { boshlash: tr({ uz: '30 soniyani boshlash', ru: 'Запустить 30 секунд' }), toxtatish: tr({ uz: "To'xtatish", ru: 'Остановить' }), yana: tr({ uz: '↻ Yana 30 soniya', ru: '↻ Ещё 30 секунд' }) }
    : { boshlash: tr({ uz: '1 daqiqani boshlash', ru: 'Запустить 1 минуту' }), toxtatish: tr({ uz: "To'xtatish", ru: 'Остановить' }), yana: tr({ uz: '↻ Yana 1 daqiqa', ru: '↻ Ещё 1 минута' }) };
  const kimKirit = <GrowInput value={kim} onChange={e => { setKim(e.target.value); }} placeholder={tr({ uz: 'Bu muammo yana kimlarda bor?', ru: 'У кого ещё есть эта проблема?' })} maxLength={140} aria-label={tr({ uz: 'Bu muammo yana kimlarda bor?', ru: 'У кого ещё есть эта проблема?' })} />;
  return (
    <Stage eyebrow={tr({ uz: "O'zingiz o'ylab ko'ring", ru: 'Подумайте сами' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tayyor} label={tayyor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'KIM qatorini yozing', ru: 'Напишите строку КТО' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Qaysi muammongiz <A>boshqalarda ham</A> bor?</>, ru: <>Какая ваша проблема <A>есть и у других</A>?</> })}
        mentor={<Mentor>{tr({ uz: <>Ro'yxatdan bitta muammoni tanlang va {yakka ? "ovoz chiqarib o'zingizga" : 'sherigingizga'} ayting: u yana kimlarda bor? Keyin KIM qatoriga yozing.</>, ru: <>Выберите из списка одну проблему и скажите {yakka ? 'вслух самому себе' : 'партнёру'}: у кого ещё она есть? Потом запишите в строку КТО.</> })}</Mentor>}
        qadamlar={<div className="pp-s10-bosh">
          <div className="pp-bosq">{QADAM.map((x, i) => <span key={i} className={cxx('pp-qchip', i === joriy && 'on', i < joriy && 'ok')}>{i < joriy ? '✓' : i + 1} {tr(x)}</span>)}</div>
          <Taymer soniya={yakka ? 30 : 60} matn={timerMatn} onTugadi={() => setVaqt(true)} />
        </div>}
        forma={zaxira
          ? <MaydonKarta className="kir" />
          : <>
              {(roOchiq || !tanlov) && <div className="pp-qrows">
                {royxat.map((m, i) => (
                  <button key={i} type="button" className={`pp-qrow ak ak-qator${tanlov === m.matn ? ' tanlandi' : ''}`} title={m.matn} onClick={() => { setTanlov(m.matn); setRoOchiq(false); }}>
                    <span className="ak-matn">{m.matn}</span>
                  </button>
                ))}
              </div>}
              {tanlov && <AudKarta key={tanlov} tur="toliq" className="kir"
                kim={yozildi ? { odamlar: [{ id: 'k', son: 4, kir: true }], ichi: kimKirit } : { holat: 'joriy', ichi: kimKirit }}
                muammo={{ matn: tanlov }} yechim={{ hali: true }}>
                {!roOchiq && <div className="pp-amal"><QTugma ikkinchi className="pp-boshqa" onClick={() => setRoOchiq(true)}>{tr({ uz: 'Boshqa muammoni tanlash', ru: 'Выбрать другую проблему' })}</QTugma></div>}
              </AudKarta>}
            </>}
      >
        {tayyor && !zaxira && <QXulosa>{tr({ uz: "Mahsulot shunday kartadan boshlanadi: KIM va MUAMMO bor, YECHIM hali bo'sh.", ru: 'Продукт начинается с такой карты: КТО и ПРОБЛЕМА есть, РЕШЕНИЕ пока пустое.' })}</QXulosa>}
      </QMustaqil>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — 4 ta, faqat REAL harakatga: s4 va s9 — birinchi urinish; s8 va s10 — ish tugaganda (151-qonun) =====
const ACHIEVEMENTS = {
  productSpotter: { icon: '🔍', name: 'Product Spotter!', desc: { uz: 'Uch mahsulotning muammosini birinchi urinishda topdingiz', ru: 'Вы с первой попытки нашли проблему трёх продуктов' } },
  appAnalyst: { icon: '📱', name: 'App Analyst!', desc: { uz: 'Uchta ilova uchun auditoriya-karta yozdingiz', ru: 'Вы написали карту аудитории для трёх приложений' } },
  cleanList: { icon: '🧹', name: 'Clean List!', desc: { uz: 'Mentor yozuvlaridan muammoni yechim va fikrdan ajratdingiz', ru: 'Вы отделили проблемы в записях Ментора от решений и мнений' } },
  streetScout: { icon: '🧭', name: 'Street Scout!', desc: { uz: "Atrofingizdan o'nta muammo yig'dingiz", ru: 'Вы собрали десять проблем вокруг себя' } }
};
// Ekran id → nishon. s4/s9: `correct` = xatosiz (birinchi urinish, AchMissCtx.miss) · s8/s10: ish tugadi.
const ACH_TRIGGERS = { s4: 'productSpotter', s8: 'appAnalyst', s9: 'cleanList', s10: 'streetScout' };

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


// Podium savol yorliqlari (q22: kalitlar = SCORED_IDX — 3, 5, 7, 12)
const Q_LABELS = {
  3: { uz: '1 — Qaysi bot mahsulot', ru: '1 — Какой бот — продукт' },
  5: { uz: '2 — MUAMMO qatori', ru: '2 — Строка ПРОБЛЕМА' },
  7: { uz: '3 — Boshqalarga kerakligi', ru: '3 — Нужен ли другим' },
  12: { uz: "4 — Avval kimdan so'raysiz", ru: '4 — Кого спросить сначала' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru})
const QZ_BG_SHAPES = [
  { ch: { uz: 'loyiha', ru: 'проект' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'mahsulot', ru: 'продукт' }, l: 82, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'muammo', ru: 'проблема' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'kim', ru: 'кто' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'yechim', ru: 'решение' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: "ro'yxat", ru: 'список' }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'sinfdosh', ru: 'одноклассник' }, l: 24, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'karta', ru: 'карта' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang — 12 savol, to'g'ri javob: A — 1, 7, 11 · B — 3, 6, 10 · C — 2, 5, 12 · D — 4, 8, 9 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'Qaysi biri loyiha?', ru: 'Что из этого — проект?' }, opts: [{ uz: "Saytni to'rt hafta ichida qurish ishi", ru: 'Работа по созданию сайта за четыре недели' }, { uz: 'Siz qurgan, sinfdoshlar ishlatadigan bot', ru: 'Ваш бот, которым пользуются одноклассники' }, { uz: "Yo'lovchilar taksi chaqiradigan ilova", ru: 'Приложение, где пассажиры вызывают такси' }, { uz: "Odamlar hisobini to'ldiradigan ilova", ru: 'Приложение, где люди пополняют баланс' }], correct: 0 },
  { q: { uz: 'Mahsulotni kim ishlatadi?', ru: 'Кто пользуется продуктом?' }, opts: [{ uz: 'Faqat uni qurgan odamning o\'zi', ru: 'Только тот, кто его построил' }, { uz: "Qurgan odam ko'rsatgan do'stlar", ru: 'Друзья, которым его показали' }, { uz: "Odamlar — o'z muammosi uchun", ru: 'Люди — для своей проблемы' }, { uz: 'Mentor — vazifani tekshirish uchun', ru: 'Ментор — чтобы проверить задание' }], correct: 2 },
  { q: { uz: 'Saytingiz internetga chiqdi, lekin uni faqat o\'zingiz ochasiz. Bu nima?', ru: 'Ваш сайт вышел в интернет, но открываете его только вы. Что это?' }, opts: [{ uz: 'Mahsulot — chunki u internetda turibdi', ru: 'Продукт — ведь он в интернете' }, { uz: 'Loyiha tugadi — hech kim ishlatmaydi', ru: 'Проект завершён — никто не пользуется' }, { uz: 'Mahsulot — chunki uni hamma ocha oladi', ru: 'Продукт — ведь его может открыть любой' }, { uz: 'Loyiha — chunki kodi juda kam yozilgan', ru: 'Проект — ведь кода написано мало' }], correct: 1 },
  { q: { uz: "Ilovani ishlatsangiz, auditoriya-kartaning qaysi qatori ko'rinib turadi?", ru: 'Когда вы пользуетесь приложением, какая строка карты аудитории видна?' }, opts: [{ uz: 'KIM — ilovani kimlar ishlatishi', ru: 'КТО — кто пользуется приложением' }, { uz: 'MUAMMO — odam nimadan qiynalgani', ru: 'ПРОБЛЕМА — с чем мучился человек' }, { uz: 'Hech biri — hammasi yashirin', ru: 'Ни одна — всё скрыто' }, { uz: 'YECHIM — ilova nima qilishi', ru: 'РЕШЕНИЕ — что делает приложение' }], correct: 3 },
  { q: { uz: 'Google Maps uchun MUAMMO qatoriga nima yoziladi?', ru: 'Что пишется в строку ПРОБЛЕМА для Google Maps?' }, opts: [{ uz: "Xaritada chiroyli rang bo'lishini xohlardi", ru: 'Хотел красивые цвета на карте' }, { uz: "Shaharda ko'chalar juda ko'p edi", ru: 'В городе было очень много улиц' }, { uz: "Yangi joyni odamlardan so'rab topardi", ru: 'Находил новое место, расспрашивая людей' }, { uz: "Telefonda xarita ko'rishni yaxshi ko'rardi", ru: 'Любил смотреть карту в телефоне' }], correct: 2 },
  { q: { uz: 'Muammoning uch belgisidan biri qaysi?', ru: 'Какой из трёх признаков проблемы здесь?' }, opts: [{ uz: 'Odam «menda muammo bor» deb aytadi', ru: 'Человек говорит: «у меня проблема»' }, { uz: "Odam o'zicha boshqa yo'l topgan", ru: 'Человек сам нашёл другой путь' }, { uz: 'Muammo haqida internetda yozilgan', ru: 'О проблеме написали в интернете' }, { uz: 'Muammoni yechadigan ilova bor', ru: 'Есть приложение, которое её решает' }], correct: 1 },
  { q: { uz: '«Maktabga yangi oshxona qurish kerak.» Bu yozuv nima?', ru: '«Школе нужно построить новую столовую». Что это за запись?' }, opts: [{ uz: "Yechim — unda kim qiynalgani yo'q", ru: 'Решение — в ней нет того, кто мучился' }, { uz: 'Muammo — unda «kerak» so\'zi bor', ru: 'Проблема — в ней есть слово «нужно»' }, { uz: "Muammo — u maktabda bo'lyapti", ru: 'Проблема — это происходит в школе' }, { uz: 'Yechim — chunki u juda qimmat', ru: 'Решение — потому что это очень дорого' }], correct: 0 },
  { q: { uz: 'Dropbox qanday muammodan boshlangan?', ru: 'С какой проблемы начался Dropbox?' }, opts: [{ uz: 'Kompyuterlar juda qimmat turardi', ru: 'Компьютеры стоили очень дорого' }, { uz: 'Internet juda sekin ishlab turardi', ru: 'Интернет работал очень медленно' }, { uz: 'Fayllarni chop etish juda qiyin edi', ru: 'Печатать файлы было очень трудно' }, { uz: 'Fayllar bor fleshka uyda qolgan edi', ru: 'Флешка с файлами осталась дома' }], correct: 3 },
  { q: { uz: "Dropbox'ni ko'rsatadigan video chiqqach nima bo'ldi?", ru: 'Что случилось после выхода видео о Dropbox?' }, opts: [{ uz: "Dasturni faqat do'stlari ko'rib chiqdi", ru: 'Программу посмотрели только друзья' }, { uz: "Dastur shu kuni yopib qo'yildi", ru: 'Программу в тот же день закрыли' }, { uz: "Videoni hech kim ko'rmay qoldi", ru: 'Видео никто не посмотрел' }, { uz: "O'n minglab odam ro'yxatga yozildi", ru: 'Десятки тысяч людей записались в список' }], correct: 3 },
  { q: { uz: "Do'stingiz siz yuborgan havola orqali kelib, botdan har kuni jadval ko'radi. Bot nima?", ru: 'Друг пришёл по вашей ссылке и каждый день смотрит в боте расписание. Что такое бот?' }, opts: [{ uz: 'Loyiha — chunki havolani o\'zingiz yuborgansiz', ru: 'Проект — ведь ссылку отправили вы' }, { uz: "Mahsulot — botni o'z ishi uchun ishlatadi", ru: 'Продукт — он пользуется ботом для своего дела' }, { uz: 'Mahsulot — chunki havolasi ishlayapti', ru: 'Продукт — ведь ссылка работает' }, { uz: 'Loyiha — chunki bot hali kichik', ru: 'Проект — ведь бот ещё маленький' }], correct: 1 },
  { q: { uz: "Muammo yig'ishda sherigingizdan nimani so'raysiz?", ru: 'О чём вы спросите партнёра при сборе проблем?' }, opts: [{ uz: "Nimani bilish uchun kimdandir so'raganini", ru: 'Что он спрашивал у кого-то, чтобы узнать' }, { uz: 'Qaysi ilovani qurib berishingizni xohlashini', ru: 'Какое приложение он хочет, чтобы вы сделали' }, { uz: 'Qaysi ilovani eng chiroyli deb bilishini', ru: 'Какое приложение он считает самым красивым' }, { uz: "G'oyangiz unga yoqadimi yoki yoqmaydimi", ru: 'Нравится ли ему ваша идея' }], correct: 0 },
  { q: { uz: 'Mentor nega maydon muammosini tanladi?', ru: 'Почему Ментор выбрал проблему поля?' }, opts: [{ uz: "Futbolni hammadan ham yaxshi ko'rgani uchun", ru: 'Потому что любит футбол больше всего' }, { uz: "Yangi maydon qurish arzon bo'lgani uchun", ru: 'Потому что построить новое поле дёшево' }, { uz: "O'yinchilardan so'rab bila olgani uchun", ru: 'Потому что может узнать у самих игроков' }, { uz: "Ro'yxatda u eng birinchi turgani uchun", ru: 'Потому что она стоит первой в списке' }], correct: 2 },
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
    // Arena tokenlari — SHU darsning lug'ati (QZ_BG_SHAPES bilan bitta manba)
    const TOK = QZ_BG_SHAPES.map(sh => tr(sh.ch));
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
const MentorPracticeStats = ({ live, screen, label, sanoq }) => {
  const [data, setData] = useState({ players: null, doneIds: new Set(), sum: 0 });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        // Praktika signali 500+ zonasida (test <100, arena 100+ bilan to'qnashmaydi)
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)), sum: rows.reduce((a, r) => a + (Number(r.picked) || 0), 0) });
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
      <div className="card-lbl" style={{ color: T.accent }}>{tr(label || { uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}{sanoq ? <> · {tr(sanoq)}: {data.sum}</> : null}</div>
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

// 🃏 Kartochka mexanikasi va ko'rinishi — qolipda: QKartochka (DE-204). Ta'riflar so'zma-so'z (T-042).
const KARTOCHKALAR = [
  { front: { uz: 'Loyiha nima?', ru: 'Что такое проект?' }, back: { uz: 'Boshlanishi va oxiri bor qurish ishi', ru: 'Работа по созданию, у которой есть начало и конец' } },
  { front: { uz: 'Mahsulot nima?', ru: 'Что такое продукт?' }, back: { uz: "Odamlar o'z muammosi uchun ishlatadigan sayt, ilova yoki xizmat", ru: 'Сайт, приложение или сервис, которым люди пользуются для своей проблемы' } },
  { front: { uz: "Loyiha va mahsulot qanday bog'lanadi?", ru: 'Как связаны проект и продукт?' }, back: { uz: "Saytni qurish — loyiha; tayyor saytni odamlar o'z ishi uchun ishlatsa, u mahsulot bo'lib ishlaydi", ru: 'Построить сайт — проект; если готовым сайтом люди пользуются для своего дела, он работает как продукт' } },
  { front: { uz: "Do'stingiz siz yuborgan havola orqali kelib, botdan har kuni jadvalini ko'radi. Bu mahsulotmi?", ru: 'Друг пришёл по вашей ссылке и каждый день смотрит в боте своё расписание. Это продукт?' }, back: { uz: "Ha: u botni o'z ishi uchun ishlatyapti — havola qayerdan kelgani muhim emas", ru: 'Да: он пользуется ботом для своего дела — откуда пришла ссылка, неважно' } },
  { front: { uz: 'Auditoriya-kartada qaysi uch qator bor?', ru: 'Какие три строки есть в карте аудитории?' }, back: { uz: 'KIM, MUAMMO, YECHIM', ru: 'КТО, ПРОБЛЕМА, РЕШЕНИЕ' } },
  { front: { uz: "Ilovada odatda avval qaysi qator ko'rinadi?", ru: 'Какая строка обычно видна в приложении первой?' }, back: { uz: 'YECHIM — ilova nima qilishi', ru: 'РЕШЕНИЕ — что делает приложение' } },
  { front: { uz: 'MUAMMO qatoriga nima yoziladi?', ru: 'Что пишется в строку ПРОБЛЕМА?' }, back: { uz: 'Ilovasiz odam nimadan qiynalgani', ru: 'С чем человек мучился без приложения' } },
  { front: { uz: 'Xohish nega muammo emas?', ru: 'Почему желание — не проблема?' }, back: { uz: "Unda odam qiynalgani ko'rinmaydi", ru: 'В нём не видно, что человек мучился' } },
  { front: { uz: 'Dropbox nimadan boshlangan?', ru: 'С чего начался Dropbox?' }, back: { uz: 'Fleshkasini uyda unutgan dasturchining muammosidan', ru: 'С проблемы программиста, который забыл флешку дома' } },
  { front: { uz: 'Dropbox boshqalarga ham kerakligi qanday bilindi?', ru: 'Как стало понятно, что Dropbox нужен и другим?' }, back: { uz: "Video chiqqach, bir kunda 75 000 kishi kutish ro'yxatiga yozildi", ru: 'После выхода видео за один день 75 000 человек записались в список ожидания' } },
  { front: { uz: 'Muammoning uch belgisi qaysilar?', ru: 'Какие три признака у проблемы?' }, back: { uz: "Qayta-qayta bo'ladi · odam o'zicha yo'l topgan · odam voz kechgan", ru: 'Повторяется снова и снова · человек сам нашёл обходной путь · человек отказался' } },
  { front: { uz: "Qaysi muammo haqida avval odamlardan so'raysiz?", ru: 'О какой проблеме вы сначала спросите людей?' }, back: { uz: "Bir necha odamda qayta-qayta bo'ladigani haqida", ru: 'О той, что повторяется у нескольких людей' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* F-1005-91 (qaror B): Mentor jim (KORPUS §61); ko'rsatma karta ostida, birinchi bosishgacha */}
        <div className={cxx('pp-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="pp-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: karta «kim bilan · nechta · muddat» + raqamli qadamlar; GATE M M-q9 — alohida .homework.jsx YO'Q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: "oilangiz va qo'shnilaringiz", ru: 'ваша семья и соседи' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: "1 odam, 3 yangi muammo, 5 odam ro'yxati", ru: '1 человек, 3 новые проблемы, список из 5 человек' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Oilangizdan yoki qo'shnilardan bitta odamga darsdagi uch savolni bering.", ru: 'Задайте одному человеку из семьи или соседей три вопроса из урока.' },
  { uz: "Uning javobidan va yo'lda ko'rganingizdan ro'yxatga 3 ta yangi muammo yozing.", ru: 'По его ответам и тому, что видели по дороге, допишите в список 3 новые проблемы.' },
  { uz: "Darsda tanlagan muammo bor 5 odamni toping va yozib qo'ying: ismi emas, kimligi (masalan: «maydonda o'ynaydigan qo'shni bola»).", ru: 'Найдите 5 человек, у которых есть выбранная на уроке проблема, и запишите: не имя, а кто это (например: «соседский мальчик, который играет на поле»).' }
];
const HwCard = ({ keyingi }) => (
  <div className="card pp-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="pp-hw-karta">
      {HW_KARTA.map((r, i) => <div key={i} className="pp-hw-q"><span className="pp-hw-k">{tr(r.k)}</span><span className="pp-hw-v">{tr(r.v)}</span></div>)}
    </div>
    <ol className="pp-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
    {keyingi && <span className="pp-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204). CODE STRIKE va arena — jonli o'yin qatlami, darsda =====
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
  // «Endi siz bilasiz» — A-2 ta'riflari so'zma-so'z (T-042)
  const RECAP = [
    { uz: 'Loyiha — boshlanishi va oxiri bor qurish ishi.', ru: 'Проект — работа по созданию, у которой есть начало и конец.' },
    { uz: "Mahsulot — odamlar o'z muammosi uchun ishlatadigan sayt, ilova yoki xizmat.", ru: 'Продукт — сайт, приложение или сервис, которым люди пользуются для своей проблемы.' },
    { uz: "Ilovada odatda avval yechim ko'rinadi — uning muammosi va kimga kerakligini siz topasiz.", ru: 'В приложении обычно сначала видно решение — его проблему и то, кому оно нужно, находите вы.' },
    { uz: "Bir necha odamda qayta-qayta bo'ladigan muammo haqida avval o'shalardan so'raysiz.", ru: 'О проблеме, которая повторяется у нескольких людей, сначала спрашиваете их самих.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Besh odamdan nimani bilib olasiz?»</b>: tanlagan muammo bor odamlar bilan qanday gaplashishni o'rganasiz.</>, ru: <>Следующий урок — <b>«Что вы узнаете от пяти человек?»</b>: научитесь разговаривать с людьми, у которых есть выбранная проблема.</> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Muammolar ro'yxatingiz <span className="italic" style={{ color: T.accent }}>tayyor</span>.</>, ru: <>Ваш список проблем <span className="italic" style={{ color: T.accent }}>готов</span>.</> })}
        cta={<>
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
export default function PmProductProblemLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARS VIZUALI — auditoriya-karta (ak-) va ekran bo'laklari (pp-). Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .ak { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 12px 14px; display: flex; flex-direction: column; gap: 6px; min-width: 0; position: relative; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.22); transition: box-shadow .35s, border-color .35s; text-align: left; }
        .ak.kir { animation: ak-kir .45s cubic-bezier(.2,.9,.3,1.1) both; }
        .ak-bosh { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-width: 0; min-height: 22px; }
        .ak-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px; color: ${T.ink}; min-width: 0; flex: 1; overflow-wrap: anywhere; }
        .ak-yorliq { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 999px; background: ${T.bg}; color: ${T.ink2}; border: 1px solid ${T.line}; flex-shrink: 0; animation: ak-kir .4s ease-out both; }
        .ak-yorliq.mahsulot { background: ${T.accentSoft}; color: ${T.accent}; border-color: transparent; }
        .ak-q { display: grid; grid-template-columns: 78px minmax(0,1fr); gap: 8px; align-items: center; padding: 6px 8px; border-radius: 10px; border: 1.5px solid transparent; transition: background .3s, border-color .3s; }
        .ak-q.joriy { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .ak-q.xato { background: ${T.errFon}; border-color: ${T.err}; }
        .ak-q.ok { background: ${T.okFon}; }
        .ak-slot { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; letter-spacing: .06em; color: ${T.ink2}; }
        .ak-q-b { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; min-width: 0; min-height: 22px; }
        .ak-matn { font-size: 14px; line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; border-radius: 6px; animation: ak-yoz .6s ease-out both; }
        .ak-q.xira .ak-matn { color: ${T.ink2}; font-style: italic; }
        .ak-skelet { flex: 1; min-width: 40px; height: 0; border-top: 2px dashed ${T.line}; }
        .ak-hali { display: inline-flex; align-items: center; gap: 8px; flex: 1; font-size: 12px; font-weight: 600; color: ${T.ink2}; font-style: italic; }
        .ak-hali::before { content: ''; flex: 0 0 48px; border-top: 2px dashed ${T.line}; }
        .ak-uya { width: 16px; height: 20px; border: 1.5px dashed ${T.line}; border-radius: 8px 8px 4px 4px; }
        .ak-odam { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 0; }
        .ak-odam.so { animation: ak-so .7s ease-in forwards; }
        .ak-odam-t { font-size: 13px; font-weight: 600; color: ${T.ink}; overflow-wrap: anywhere; }
        .ak-nega { font-size: 11px; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.bg}; color: ${T.ink2}; white-space: nowrap; }
        .ak-nega.ozIshi { background: ${T.okFon}; color: ${T.ok}; }
        .ak-q.xato .ak-nega { background: ${T.paper}; color: ${T.err}; }
        .ak-sil { display: inline-flex; gap: 1px; flex-shrink: 0; }
        .ak-sil i { position: relative; display: inline-block; width: 14px; height: 18px; }
        .ak-sil i::before { content: ''; position: absolute; left: 3.5px; top: 0; width: 7px; height: 7px; border-radius: 50%; background: ${T.ink2}; }
        .ak-sil i::after { content: ''; position: absolute; left: 0.5px; bottom: 0; width: 13px; height: 8px; border-radius: 8px 8px 2px 2px; background: ${T.ink2}; }
        .ak-odam.ozIshi .ak-sil i::before, .ak-odam.ozIshi .ak-sil i::after { background: ${T.ok}; }
        .ak-odam.kir .ak-sil i { animation: ak-oq .5s ease-out both; }
        .ak-qator { flex-direction: row; align-items: center; padding: 7px 10px; gap: 8px; border-radius: 10px; box-shadow: none; }
        .ak-qator .ak-matn { font-size: 13px; }
        .ak-qator.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .ak-qator.bosh { border-style: dashed; background: transparent; }
        .ak-qator.tanlandi { border-color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accentSoft}; }
        .ak-joy { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: ${T.accent}; background: ${T.accentSoft}; padding: 1px 7px; border-radius: 999px; flex-shrink: 0; }
        .ak-belgi { margin-left: auto; color: ${T.ok}; font-weight: 800; font-size: 13px; }
        .ak-ixcham .ak-q { grid-template-columns: 44px minmax(0,1fr); }
        .ak.kichik { padding: 10px 12px; }
        .ak.kichik .ak-q { grid-template-columns: 70px minmax(0,1fr); padding: 4px 6px; }
        .ak.kichik .ak-matn { font-size: 13px; }
        @keyframes ak-kir { from { opacity: 0; transform: translateY(8px) scale(.97); } }
        @keyframes ak-yoz { 0% { opacity: 0; background: ${T.accentSoft}; } 40% { opacity: 1; background: ${T.accentSoft}; } 100% { background: transparent; } }
        @keyframes ak-so { to { opacity: 0; transform: translateX(-10px); } }
        @keyframes ak-oq { from { opacity: 0; transform: translateX(-12px); } }

        /* --- F-1005-85 (qat'iy): keyingi bosiladigan joy — halqa doim, puls 2–3 marta; reduced-motion da faqat halqa --- */
        .pp-bos, .pp-bos-nav { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: pp-puls 1.6s ease-out .5s 3; }
        @keyframes pp-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70%, 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        .q-kirish .q-variantlar-kol:not(:has(.q-variant.on)) .q-variant:not(:disabled),
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled),
        .q-test-ro:not(:has(.q-test-v.xato, .q-test-v.ok, .q-test-v.kutish, .q-test-v.xira)) .q-test-v:not(:disabled),
        .pp-s4 .pp-tanlov .q-chip:not(:disabled):not(.q-silk),
        .pp-darvoza:not(:has(.q-chip.ok)) .q-chip:not(:disabled):not(.q-silk),
        .pp-s9-chap .pp-amal .q-btn:not(:disabled),
        .pp-qrows:not(:has(.tanlandi)) .pp-qrow,
        .pp-yozish.chorla .pp-kirit,
        .q-mustaqil .ak-q.joriy, .pp-forma.nom-joriy > .ak-bosh {
          box-shadow: 0 0 0 2px ${fon(T.accent, 0.32)}; animation: pp-chorla 1.7s ease-out .6s 2;
        }
        .q-variant:nth-child(2), .q-chip:not(.q-silk):nth-child(2), .q-test-v:nth-child(2), .pp-qrow:nth-child(2), .pp-s9-chap .pp-amal .q-btn:nth-child(2) { animation-delay: .78s; }
        .q-variant:nth-child(3), .q-chip:not(.q-silk):nth-child(3), .q-test-v:nth-child(3), .pp-qrow:nth-child(3) { animation-delay: .96s; }
        .q-test-v:nth-child(4), .pp-qrow:nth-child(4) { animation-delay: 1.14s; }
        @keyframes pp-chorla { 0% { box-shadow: 0 0 0 2px ${fon(T.accent, 0.32)}, 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 2px ${fon(T.accent, 0.32)}, 0 0 0 10px ${fon(T.accent, 0)}; } }
        .pp-taxmin-q { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 14px; padding: 9px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; animation: ak-kir .3s ease-out both; }
        .pp-taxmin-s { font-size: 13.5px; font-weight: 600; color: ${T.ink2}; min-width: 0; }
        .pp-taxmin-b { font-size: 13.5px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 12px; border-radius: 999px; white-space: nowrap; }
        .pp-taxmin-b b { font-family: 'JetBrains Mono', monospace; font-weight: 800; }
        .pp-s2-bash > .pp-taxmin-q { flex: 1; min-width: 0; }

        /* --- umumiy bo'laklar --- */
        .pp-amal { display: flex; justify-content: flex-end; align-items: center; gap: 10px; flex-wrap: wrap; }
        .pp-xato { display: flex; flex-direction: column; gap: 4px; }
        .pp-kirit { width: 100%; resize: none; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 10px; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.45; color: ${T.ink}; background: ${T.paper}; outline: none; min-height: 38px; }
        .pp-kirit:focus { border-color: ${T.accent}; }
        .ak-q.xato .pp-kirit, .pp-yozish.xato .pp-kirit { border-color: ${T.err}; }
        .ach-rule { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .ach-rule.lost { color: ${T.ink2}; font-style: italic; }
        .mnote-chip { align-self: flex-end; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; padding: 6px 12px; border-radius: 999px; border: 1px dashed ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; }
        .mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; }
        .mnote-lbl { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.accent}; }
        .mnote-body { font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .pp-doiralar { display: flex; gap: 10px; }
        .pp-doira { width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; border: 1.5px solid ${T.line}; color: ${T.ink2}; background: ${T.paper}; }
        .pp-doira.cur { border-color: ${T.accent}; color: ${T.accent}; background: ${T.accentSoft}; }
        .pp-doira.ok { border-color: ${T.ok}; color: ${T.paper}; background: ${T.ok}; }
        .pp-uch { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .pp-test-karta { margin-top: 14px; max-width: 560px; padding: 8px 12px; gap: 2px; }
        .pp-test-karta .ak-q { padding: 3px 8px; } .pp-test-karta .ak-matn { font-size: 13px; } .pp-test-karta .ak-bosh { min-height: 18px; } .pp-test-karta .ak-nom { font-size: 14px; }

        /* --- s0 kirish maketi --- */
        .pp-hook { display: flex; flex-direction: column; gap: 10px; }
        .pp-brauzer { border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .pp-br-bar { display: flex; align-items: center; gap: 5px; padding: 7px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .pp-br-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; }
        .pp-br-url { margin-left: 8px; flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; background: ${T.paper}; border-radius: 6px; padding: 2px 8px; }
        .pp-br-sahifa { padding: 12px; display: flex; flex-direction: column; gap: 7px; }
        .pp-sk { display: block; height: 10px; border-radius: 5px; background: ${T.line}; }
        .pp-sk.ism { width: 44%; height: 14px; }
        .pp-sk.yonalish { width: 62%; }
        .pp-sk-kartalar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin-top: 3px; }
        .pp-sk-kartalar span { height: 34px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .pp-juftlik { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; align-items: stretch; }
        .pp-juftlik > .ak { height: 100%; }
        .pp-ovoz { display: flex; flex-direction: column; gap: 6px; }
        .pp-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 28px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink2}; }
        .pp-ovoz-q.men { color: ${T.ink}; font-weight: 700; }
        .pp-ovoz-yol { height: 8px; border-radius: 4px; background: ${T.bg}; overflow: hidden; }
        .pp-ovoz-yol i { display: block; height: 100%; background: ${T.accent}; border-radius: 4px; transition: width .5s; }
        .pp-ovoz-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; text-align: right; }

        /* --- s1 reja chizmasi --- */
        .pp-reja { display: flex; flex-direction: column; gap: 10px; }
        .pp-reja-ro { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; transition: opacity .4s; }
        .pp-reja.katta .pp-reja-ro { opacity: .55; }
        .pp-reja-ro .ak-qator { min-height: 34px; padding: 6px 10px; }

        /* --- brend nomi va telefon maketi (F-1005-76/78/80). Brend ranglari — maket mazmuni (nom o'z rangida, logotip yo'q, PM-029) --- */
        .pp-brend { font-weight: 800; white-space: nowrap; }
        .pp-brend.yandex { background: #FCE000; color: #21201F; padding: 0 7px; border-radius: 6px; }
        .pp-brend.payme { color: #00899A; }
        .pp-brend.translate { color: #1A73E8; }
        .pp-brend.dropbox { color: #0061FF; }
        .pp-brend.telegram { color: #1C86C6; }
        .pp-brend.uzum { color: #7000FF; }
        .pp-tel { position: relative; flex-shrink: 0; background: linear-gradient(160deg,#2A2933,#16151C); border-radius: 24px; padding: 7px; box-shadow: 0 16px 30px -14px rgba(${T.shadowBase},0.6), inset 0 0 0 1px rgba(255,255,255,0.08); animation: pp-tel-kir .38s ease-out both; }
        .pp-tel.katta { width: 170px; height: 288px; }
        .pp-tel.kichik { width: 82px; height: 106px; border-radius: 15px; padding: 4px; animation: none; box-shadow: 0 10px 18px -12px rgba(${T.shadowBase},0.6); }
        .pp-tel-kesik { position: absolute; top: 7px; left: 50%; transform: translateX(-50%); width: 34%; height: 11px; border-radius: 0 0 8px 8px; background: #16151C; z-index: 3; }
        .pp-tel.kichik .pp-tel-kesik { top: 4px; height: 5px; border-radius: 0 0 4px 4px; }
        .pp-tel-ekran { position: relative; width: 100%; height: 100%; border-radius: 18px; overflow: hidden; background: #F4F4F6; display: flex; flex-direction: column; gap: 8px; padding: 22px 10px 10px; font-family: 'Manrope', sans-serif; color: #1B1630; }
        .pp-tel.kichik .pp-tel-ekran { border-radius: 11px; padding: 11px 5px 5px; gap: 4px; }
        .pp-tel.yandex .pp-tel-ekran { background: #FCE000; color: #21201F; }
        .pp-tel.payme .pp-tel-ekran { background: #19B7C5; color: #06333A; }
        .pp-tel.translate .pp-tel-ekran { background: #1A73E8; color: #FFFFFF; }
        .pp-tel.telegram .pp-tel-ekran { background: #DCE8F1; padding: 0; gap: 0; }
        .pp-tel.oldin .pp-tel-ekran { background: #E9E6EF; padding: 22px 8px 8px; }
        .pp-tel-nom { font-weight: 800; font-size: 15px; letter-spacing: -.01em; line-height: 1.2; }
        .pp-tel-varaq { background: #FFFFFF; color: #1B1630; border-radius: 12px; padding: 9px 10px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 4px 10px -6px rgba(0,0,0,0.35); }
        @keyframes pp-tel-kir { from { opacity: .35; transform: scale(.97); } }
        @keyframes pp-pop { from { opacity: 0; transform: scale(.6); } 70% { transform: scale(1.08); } to { opacity: 1; transform: none; } }
        @keyframes pp-kel { from { opacity: 0; transform: translate(-10px, 6px) scale(.6); } }
        .pp-odamcha, .pp-db-o { position: relative; display: block; width: 10px; height: 12px; }
        .pp-odamcha::before, .pp-db-o::before { content: ''; position: absolute; left: 30%; top: 0; width: 42%; height: 42%; border-radius: 50%; background: currentColor; }
        .pp-odamcha::after, .pp-db-o::after { content: ''; position: absolute; left: 5%; bottom: 0; width: 90%; height: 48%; border-radius: 50% 50% 2px 2px / 70% 70% 2px 2px; background: currentColor; }

        /* --- s2 to'rt narsa: har biri o'z maketida (F-1005-76) --- */
        .pp-s2 { display: flex; flex-direction: column; gap: 8px; }
        .pp-s2-bash { display: flex; align-items: center; gap: 12px 16px; }
        .pp-s2-bash > .q-bashorat { flex: 1; min-width: 0; display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: 4px 14px; padding: 10px 14px; }
        .pp-s2-bash > .q-bashorat > .q-yorliq { grid-column: 1 / -1; margin: 0; }
        .pp-s2-bash > .q-btn { flex-shrink: 0; align-self: center; animation: ak-kir .35s ease-out both; }
        .pp-s2-guruhlar { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 22px; align-items: stretch; }
        .pp-s2-guruh { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .pp-s2-juft { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; align-items: stretch; flex: 1; }
        .pp-s2-juft > .ak { height: 100%; }
        .pp-nom { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 10px; min-height: 24px; font-size: 14px; color: ${T.ink2}; }
        .pp-nom b { color: ${T.ink}; font-weight: 800; font-size: 16px; }
        .pp-nom.kir { animation: ak-kir .45s ease-out both; }
        .pp-nom .pp-strelka { flex-direction: row; gap: 6px; font-size: 11.5px; }
        .pp-nom .pp-strelka i { width: 30px; }
        .pp-strelka { display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; font-size: 11.5px; font-weight: 600; color: ${T.ink2}; line-height: 1.3; }
        .pp-strelka i { position: relative; display: block; width: 100px; height: 0; border-top: 1.5px solid ${T.ink2}; }
        .pp-strelka i::before { content: ''; position: absolute; left: -1px; top: -5px; width: 8px; height: 8px; border-left: 1.5px solid ${T.ink2}; border-bottom: 1.5px solid ${T.ink2}; transform: rotate(45deg); }
        .pp-mk { position: relative; height: 114px; border-radius: 10px; background: ${T.bg}; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 2px; }
        .pp-mk-ichi { display: flex; align-items: center; justify-content: center; }
        .pp-mk-br { width: 92%; display: flex; flex-direction: column; align-items: stretch; justify-content: flex-start; }
        .pp-mk-br .pp-br-bar { padding: 5px 7px; gap: 4px; }
        .pp-mk-br .pp-br-bar i { width: 6px; height: 6px; }
        .pp-mk-br .pp-br-url { font-size: 9.5px; margin-left: 4px; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pp-s2-k .ak-bosh { flex-wrap: wrap; row-gap: 4px; }
        .pp-s2-k .ak-nom { min-width: min-content; }
        .pp-mk-br .pp-br-sahifa { padding: 8px; gap: 5px; }
        .pp-mk-br .pp-sk { height: 7px; }
        .pp-mk-br .pp-sk.ism { height: 10px; }
        .pp-mk-br .pp-sk-kartalar span { height: 24px; }
        .pp-mk-yoq { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); z-index: 4; white-space: nowrap; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 3px 9px; opacity: 0; box-shadow: 0 4px 10px -6px rgba(${T.shadowBase},0.4); }
        .pp-s2.f1 .loyiha .pp-mk-ichi { animation: pp-kul .9s ease-out 1.3s both; }
        .pp-s2.f1 .loyiha .pp-mk-yoq { animation: pp-yoq .5s ease-out 1.9s both; }
        .pp-s2.f2 .loyiha .pp-mk-ichi, .pp-s2.f3 .loyiha .pp-mk-ichi { filter: grayscale(1); opacity: .42; }
        .pp-s2.f2 .loyiha .pp-mk-yoq, .pp-s2.f3 .loyiha .pp-mk-yoq { opacity: 1; }
        @keyframes pp-kul { to { filter: grayscale(1); opacity: .42; } }
        @keyframes pp-yoq { from { opacity: 0; transform: translate(-50%,-20%); } to { opacity: 1; transform: translate(-50%,-50%); } }
        .pp-tg-bosh { display: flex; align-items: center; gap: 4px; padding: 11px 5px 4px; background: #FFFFFF; }
        .pp-tg-bosh i { width: 12px; height: 12px; border-radius: 50%; background: linear-gradient(135deg,#5BC0F2,#2A9BDF); flex-shrink: 0; }
        .pp-tg-bosh span { height: 5px; flex: 1; border-radius: 3px; background: #D5DCE4; }
        .pp-tg-chat { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 4px; padding: 5px; }
        .pp-tg-b { align-self: flex-start; background: #FFFFFF; border-radius: 7px 7px 7px 2px; padding: 4px 5px; display: flex; flex-direction: column; gap: 3px; font-size: 8.5px; font-weight: 700; color: #1B1630; box-shadow: 0 1px 1px rgba(0,0,0,0.08); }
        .pp-tg-b i { display: block; height: 4px; border-radius: 2px; background: #D5DCE4; width: 44px; }
        .pp-tg-b i + i { width: 30px; }
        .pp-tg-b.men { align-self: flex-end; background: #E1FAC9; border-radius: 7px 7px 2px 7px; font-family: 'JetBrains Mono', monospace; }
        .pp-yg-qayer { display: flex; align-items: center; gap: 4px; background: #FFFFFF; color: #21201F; border-radius: 6px; padding: 4px 5px; font-weight: 800; font-size: 9px; line-height: 1.1; }
        .pp-yg-qayer i { width: 6px; height: 6px; border-radius: 50%; border: 2px solid #21201F; flex-shrink: 0; }
        .pp-pm-qator { display: flex; align-items: center; gap: 4px; background: #FFFFFF; color: #06333A; border-radius: 6px; padding: 4px 5px; font-weight: 800; font-size: 8.5px; line-height: 1.15; }
        .pp-pm-qator i { flex-shrink: 0; width: 12px; height: 12px; border-radius: 50%; background: #19B7C5; color: #06333A; font-style: normal; font-size: 10px; line-height: 12px; text-align: center; font-weight: 800; }
        .pp-tel.kichik .pp-pm-qator { font-size: 8px; gap: 3px; padding: 4px; letter-spacing: -.01em; }
        .pp-tel.kichik .pp-pm-qator i { width: 10px; height: 10px; line-height: 10px; font-size: 9px; }
        .pp-tel-oqim { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px 4px; justify-items: center; margin-top: auto; padding: 4px; border-radius: 6px; background: rgba(255,255,255,0.5); }
        .pp-s2.f0 .pp-tel-oqim { background: transparent; }
        .pp-s2.f1 .loyiha .ak-odam.so { flex-wrap: nowrap; white-space: nowrap; max-width: 240px; max-height: 24px; overflow: hidden; animation: pp-so-yigil 1s ease-in .3s forwards; }
        @keyframes pp-so-yigil { 55% { opacity: 0; max-width: 240px; max-height: 24px; } to { opacity: 0; max-width: 0; max-height: 0; margin-right: -10px; } }
        .pp-s2.f1 .loyiha .ak-matn { animation: pp-yoz2 .6s ease-out 1.4s both; }
        @keyframes pp-yoz2 { from { opacity: 0; transform: translateX(-6px); } }
        .pp-s2.f0 .pp-odamcha { opacity: 0; }
        .pp-s2.f1 .pp-odamcha { animation: pp-kel .45s cubic-bezier(.2,.9,.3,1.2) both; animation-delay: calc(.3s + var(--k) * .34s); }
        .pp-kun { display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: 10px; font-size: 12px; font-weight: 700; color: ${T.ink2}; animation: ak-kir .35s ease-out both; }
        .pp-kun-yol { position: relative; height: 6px; border-radius: 999px; background: ${T.line}; }
        .pp-kun-yol i { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; border-radius: 999px; background: linear-gradient(90deg, #F6C453, ${T.accent}); }
        .pp-kun-yol b { position: absolute; top: 50%; left: calc(100% - 8px); width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}; }
        .pp-kun.yur .pp-kun-yol i { animation: pp-kun-i 3.6s linear both; }
        .pp-kun.yur .pp-kun-yol b { animation: pp-kun-b 3.6s linear both; }
        @keyframes pp-kun-i { from { width: 0; } }
        @keyframes pp-kun-b { from { left: 8px; background: #F6B73C; box-shadow: 0 0 0 5px rgba(246,183,60,0.28); } }

        /* --- s4 uch mahsulot: chapda brend telefoni, «oldin → keyin» (F-1005-78) --- */
        .pp-s4 { display: flex; flex-direction: column; gap: 10px; }
        .pp-tanlov { display: flex; flex-direction: column; gap: 8px; }
        .pp-tanlov.qator { flex-direction: row; flex-wrap: wrap; }
        .pp-tanlov .q-chip { text-align: left; justify-content: flex-start; }
        .pp-s4-chap { display: flex; flex-direction: column; gap: 8px; align-items: stretch; }
        .pp-s4-chap .q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 16px; }
        .pp-s4-tel { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 4px 0 6px; border-radius: 18px; background: radial-gradient(ellipse at 50% 58%, ${T.accentSoft}, transparent 68%); }
        .pp-s4-tag-joy { min-height: 22px; display: flex; align-items: center; }
        .pp-tel-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; padding: 3px 11px; border-radius: 999px; animation: ak-kir .3s ease-out both; }
        .pp-tel-tag.oldin { background: ${T.paper}; color: ${T.ink2}; border: 1px solid ${T.line}; }
        .pp-tel-tag.keyin { background: ${T.okFon}; color: ${T.ok}; }
        .pp-tel.katta .pp-yg-qayer { font-size: 13px; padding: 8px 10px; border-radius: 9px; background: #F2F2F2; gap: 8px; }
        .pp-tel.katta .pp-yg-qayer i { width: 10px; height: 10px; }
        .pp-yg-xarita { position: relative; flex: 1; border-radius: 12px; overflow: hidden; background-color: #F1ECDD; background-image: linear-gradient(90deg, transparent 44%, #FFFFFF 44%, #FFFFFF 52%, transparent 52%), linear-gradient(0deg, transparent 38%, #FFFFFF 38%, #FFFFFF 45%, transparent 45%), linear-gradient(32deg, transparent 63%, #FFFFFF 63%, #FFFFFF 68%, transparent 68%); }
        .pp-yg-pin { position: absolute; left: 66%; top: 18%; width: 18px; height: 18px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: #21201F; }
        .pp-yg-pin::after { content: ''; position: absolute; left: 6px; top: 6px; width: 6px; height: 6px; border-radius: 50%; background: #FCE000; }
        .pp-yg-mashina { position: absolute; left: 40%; top: 44%; width: 32px; height: 16px; border-radius: 6px 10px 5px 5px; background: #FCE000; border: 2px solid #21201F; }
        .pp-yg-mashina::before, .pp-yg-mashina::after { content: ''; position: absolute; bottom: -6px; width: 8px; height: 8px; border-radius: 50%; background: #21201F; }
        .pp-yg-mashina::before { left: 3px; }
        .pp-yg-mashina::after { right: 3px; }
        .pp-yg-mashina.kel { animation: pp-mashina 1.3s cubic-bezier(.3,.1,.2,1) both; }
        @keyframes pp-mashina { from { left: -30%; top: 72%; } }
        .pp-narx { align-self: flex-start; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; padding: 4px 10px; border-radius: 999px; background: #21201F; color: #FCE000; }
        .pp-narx.kir { animation: pp-pop .45s cubic-bezier(.2,.9,.3,1.3) .75s both; }
        .pp-narx.savol { position: absolute; right: 10px; top: 12px; background: #FFFFFF; color: #21201F; font-size: 13px; box-shadow: 0 4px 10px -5px rgba(0,0,0,0.4); }
        .pp-s4-sahna { position: relative; flex: 1; border-radius: 12px; overflow: hidden; }
        .pp-yg-kocha { background: linear-gradient(180deg, #CFE3F3 0 48%, #BEB8AA 48% 58%, #4A4852 58% 100%); }
        .pp-yg-yol { position: absolute; left: 0; right: 0; top: 76%; height: 3px; background: repeating-linear-gradient(90deg, #FFFFFF 0 12px, transparent 12px 22px); } /* kesik-ok: yo'l chizig'i — sahna rasmi, bezak emas */
        .pp-yg-yol i { position: absolute; top: -18px; width: 30px; height: 14px; border-radius: 5px 8px 3px 3px; background: #8E8A97; animation: pp-otadi 1.8s linear infinite; }
        .pp-yg-yol i.m2 { top: 9px; background: #B3AEBB; animation-duration: 2.4s; animation-delay: -1s; }
        @keyframes pp-otadi { from { left: -30%; } to { left: 110%; } }
        .pp-yg-trotuar { position: absolute; left: 0; right: 0; top: 30%; height: 28%; }
        .pp-odam-kut { position: absolute; left: 34%; bottom: 0; width: 20px; height: 42px; }
        .pp-odam-kut::before { content: ''; position: absolute; left: 5px; top: 0; width: 11px; height: 11px; border-radius: 50%; background: #2E2B38; }
        .pp-odam-kut::after { content: ''; position: absolute; left: 1px; top: 12px; width: 18px; height: 30px; border-radius: 9px 9px 3px 3px; background: #2E2B38; }
        .pp-odam-kut i { position: absolute; left: 14px; top: 4px; width: 4px; height: 16px; border-radius: 2px; background: #2E2B38; transform: rotate(28deg); transform-origin: bottom center; animation: pp-qol 1.2s ease-in-out infinite; }
        @keyframes pp-qol { 50% { transform: rotate(10deg); } }
        .pp-pm-yol { background: linear-gradient(180deg, #DDEFF2 0 60%, #CFCBD6 60% 100%); }
        .pp-pm-yol .pp-uy, .pp-pm-yol .pp-dokon { bottom: 40%; }
        .pp-pm-yol .pp-iz { bottom: 37%; }
        .pp-pm-yol .pp-odam-yur { bottom: 39%; }
        .pp-pm-tarix { display: flex; flex-direction: column; gap: 7px; padding: 4px 6px 0; }
        .pp-pm-tarix i { display: flex; align-items: center; gap: 7px; height: 22px; border-radius: 8px; background: rgba(255,255,255,0.35); }
        .pp-pm-tarix i::before { content: ''; width: 14px; height: 14px; margin-left: 6px; border-radius: 50%; background: rgba(255,255,255,0.7); }
        .pp-pm-tarix i::after { content: ''; width: 46%; height: 5px; border-radius: 3px; background: rgba(255,255,255,0.7); }
        .pp-uy { position: absolute; left: 8%; bottom: 34%; width: 44px; height: 32px; background: #F3EEE6; border: 2px solid #4A4852; border-top-width: 0; }
        .pp-uy::before { content: ''; position: absolute; left: -8px; top: -20px; border-left: 28px solid transparent; border-right: 28px solid transparent; border-bottom: 20px solid #4A4852; }
        .pp-uy::after { content: ''; position: absolute; left: 15px; bottom: 0; width: 12px; height: 16px; background: #4A4852; border-radius: 3px 3px 0 0; }
        .pp-uy.kichik { position: relative; left: auto; bottom: auto; width: 16px; height: 11px; border-width: 1.5px; border-top-width: 0; flex-shrink: 0; margin-top: 7px; }
        .pp-uy.kichik::before { left: -4px; top: -7px; border-left-width: 10px; border-right-width: 10px; border-bottom-width: 7px; }
        .pp-uy.kichik::after { left: 5px; width: 4px; height: 6px; }
        .pp-dokon { position: absolute; right: 7%; bottom: 34%; width: 50px; height: 40px; background: #FFFFFF; border: 2px solid #4A4852; }
        .pp-dokon::before { content: ''; position: absolute; left: -5px; right: -5px; top: -12px; height: 12px; border-radius: 3px 3px 0 0; background: repeating-linear-gradient(90deg, #19B7C5 0 8px, #FFFFFF 8px 16px); border: 2px solid #4A4852; } /* kesik-ok: do'kon soyaboni chiziqlari — sahna rasmi */
        .pp-dokon i { position: absolute; left: 17px; bottom: 0; width: 13px; height: 20px; background: #4A4852; border-radius: 2px 2px 0 0; }
        .pp-iz { position: absolute; left: 26%; right: 26%; bottom: 31%; border-top: 2px dashed #8E8A97; }
        .pp-odam-yur { position: absolute; left: 24%; bottom: 33%; width: 14px; height: 30px; animation: pp-yur 1.2s ease-in-out both; }
        .pp-odam-yur::before { content: ''; position: absolute; left: 3px; top: 0; width: 9px; height: 9px; border-radius: 50%; background: #2E2B38; }
        .pp-odam-yur::after { content: ''; position: absolute; left: 0; top: 10px; width: 14px; height: 20px; border-radius: 7px 7px 2px 2px; background: #2E2B38; }
        @keyframes pp-yur { from { left: 24%; } to { left: 62%; } }
        .pp-tel.katta .pp-pm-qator { font-size: 13px; padding: 0; background: none; gap: 8px; }
        .pp-tel.katta .pp-pm-qator i { width: 24px; height: 24px; line-height: 24px; font-size: 16px; }
        .pp-pm-raqam { display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 8px; background: #F1F4F5; }
        .pp-pm-raqam i { width: 14px; height: 14px; border-radius: 50%; background: #19B7C5; flex-shrink: 0; }
        .pp-pm-raqam b { flex: 1; height: 6px; border-radius: 3px; background: #CFD6D9; }
        .pp-pm-tugma { text-align: center; font-weight: 800; font-size: 13px; padding: 8px; border-radius: 9px; background: #19B7C5; color: #06333A; }
        .pp-pm-tayyor { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 12px; line-height: 1.3; color: ${T.ok}; background: ${T.okFon}; border-radius: 9px; padding: 8px; }
        .pp-pm-tayyor.kir { animation: pp-pop .45s cubic-bezier(.2,.9,.3,1.3) .3s both; }
        .pp-tel.translate .pp-tel-nom { color: #FFFFFF; }
        .pp-gt-oyna { gap: 7px; flex: 1; }
        .pp-gt-til { font-size: 11px; font-weight: 800; color: #1A73E8; }
        .pp-gt-q { display: flex; flex-direction: column; gap: 6px; }
        .pp-gt-q i { display: block; height: 6px; border-radius: 3px; background: #D3DAE6; width: 90%; }
        .pp-gt-q i + i { width: 62%; }
        .pp-gt-q.tarjima i { background: #9CC0F5; }
        .pp-gt-q.kir i { animation: pp-chiz .45s ease-out .35s both; }
        .pp-gt-q.kir i + i { animation-delay: .55s; }
        @keyframes pp-chiz { from { width: 0; } }
        .pp-gt-tugma { position: relative; align-self: center; width: 30px; height: 30px; margin: -2px 0; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 10px -4px rgba(0,0,0,0.45); }
        .pp-gt-tugma::after { content: ''; position: absolute; left: 10px; top: 12px; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid #1A73E8; }
        .pp-tel.keyin .pp-gt-tugma { animation: pp-bos .5s ease-out both; }
        @keyframes pp-bos { 40% { transform: scale(.82); box-shadow: 0 0 0 7px rgba(255,255,255,0.35); } }
        .pp-gt-kitob { background: #EDE8DD; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
        .pp-kitob { position: relative; display: flex; width: 124px; height: 86px; }
        .pp-kitob i { flex: 1; border: 2px solid #6B5B45; background-color: #FFFFFF; background-image: repeating-linear-gradient(180deg, transparent 0 9px, #D7D1C4 9px 11px); background-clip: content-box; padding: 9px 7px; } /* kesik-ok: lug'at sahifasidagi qatorlar — sahna rasmi */
        .pp-kitob i:first-child { border-radius: 6px 0 0 6px; border-right-width: 1px; }
        .pp-kitob i:last-child { border-radius: 0 6px 6px 0; border-left-width: 1px; }
        .pp-lupa { position: absolute; left: 8px; top: 8px; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #4A4852; background: rgba(255,255,255,0.45); animation: pp-lupa 2.6s ease-in-out infinite; }
        .pp-lupa::after { content: ''; position: absolute; right: -9px; bottom: -8px; width: 11px; height: 4px; border-radius: 2px; background: #4A4852; transform: rotate(45deg); }
        @keyframes pp-lupa { 33% { left: 70px; top: 22px; } 66% { left: 16px; top: 46px; } }
        .pp-soat { position: relative; width: 36px; height: 36px; border-radius: 50%; border: 3px solid #4A4852; background: #FFFFFF; }
        .pp-soat::before { content: ''; position: absolute; left: 14px; top: 6px; width: 2px; height: 10px; background: #4A4852; }
        .pp-soat i { position: absolute; left: 14px; top: 14px; width: 2px; height: 11px; background: ${T.err}; transform-origin: top center; animation: pp-aylan 1.4s linear infinite; }
        @keyframes pp-aylan { to { transform: rotate(360deg); } }

        /* --- s6 Dropbox: jonli sahna (F-1005-80/81). Bosqich gapi Mentorda; sahnada bosqich nomi + maket --- */
        .pp-nuqtalar { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .pp-nuq-l { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; margin-right: 6px; }
        .pp-nuqtalar i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; transition: background .3s, transform .3s; }
        .pp-nuqtalar i.ok { background: ${T.ok}; }
        .pp-nuqtalar i.cur { background: ${T.accent}; transform: scale(1.25); }
        .pp-voqea { display: flex; flex-direction: column; gap: 8px; align-items: stretch; width: 100%; animation: ak-kir .35s ease-out both; }
        .pp-voqea-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,1.9vw,19px); color: ${T.ink}; text-align: center; }
        .pp-voqea .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 8px 14px; }
        .pp-voqea .q-bashorat .q-yorliq { margin: 0; }
        .pp-voqea .q-bashorat .q-variantlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .pp-voqea .q-taxmin { text-align: center; }
        .pp-dbx-w { display: flex; flex-direction: column; gap: 10px; }
        .pp-dbx { display: grid; grid-template-columns: minmax(0,1.18fr) minmax(0,0.82fr); gap: 14px; align-items: center; }
        .pp-hisob { display: inline-block; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 15px; color: #0061FF; background: #E6EFFF; padding: 2px 10px; border-radius: 999px; white-space: nowrap; }
        @media (max-width: 1199px) { .pp-dbx-w > .pp-db-tanish { padding-right: 46px; } .zoomable:not(.zoom-on) > .ak > .ak-bosh, .zoomable:not(.zoom-on) > .pp-s4 > .ak:first-child > .ak-bosh { padding-right: 36px; } }
        .pp-db-tanish { display: flex; align-items: center; justify-content: space-between; gap: 10px 16px; flex-wrap: wrap; padding: 9px 14px; border-radius: 12px; background: #EEF4FF; border: 1px solid #D4E3FF; animation: ak-kir .4s ease-out both; }
        .pp-db-tanish-t { flex: 1; min-width: 220px; font-size: 14px; line-height: 1.45; color: ${T.ink}; text-align: left; }
        .pp-db-tanish-t .pp-brend { font-size: 16px; }
        .pp-db-sinx { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .pp-db-sinx-p { position: relative; width: 40px; height: 28px; border-radius: 3px 6px 6px 6px; background: #0061FF; display: flex; align-items: center; justify-content: center; }
        .pp-db-sinx-p::before { content: ''; position: absolute; left: 0; top: -5px; width: 16px; height: 6px; border-radius: 3px 3px 0 0; background: #0061FF; }
        .pp-db-sinx-yo { position: relative; width: 38px; border-top: 2px dashed #7FA8FF; }
        .pp-db-sinx-yo::after { content: ''; position: absolute; top: -5px; left: 0; width: 8px; height: 8px; border-radius: 2px; background: #0061FF; animation: pp-sinx 2.4s ease-in-out infinite; }
        @keyframes pp-sinx { 0%, 15% { left: 0; opacity: 0; } 25% { opacity: 1; } 60% { left: calc(100% - 8px); opacity: 1; } 70%, 100% { left: calc(100% - 8px); opacity: 0; } }
        .pp-db-sinx-e { width: 44px; height: 32px; border-radius: 4px; border: 3px solid #2A2933; background: #EAF1FF; display: flex; align-items: center; justify-content: center; }
        .pp-db-sinx-e .pp-db-fayl.yangi, .pp-db-v-mini .pp-db-fayl.yangi { animation: pp-qonish 2.4s ease-in-out infinite; }
        @keyframes pp-qonish { 0%, 58% { opacity: 0; transform: scale(.4); } 68%, 92% { opacity: 1; transform: none; } 100% { opacity: 0; } }
        .pp-db-sahna { position: relative; height: 200px; border-radius: 14px; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; gap: 18px; padding: 16px 14px 18px; background: linear-gradient(180deg, #F8F7FC 0%, #F8F7FC 74%, #E9E5F1 74%, #E2DDEC 100%); }
        .pp-db-nom { position: absolute; top: 10px; left: 12px; z-index: 5; font-size: 14px; background: #FFFFFF; padding: 2px 10px; border-radius: 999px; box-shadow: 0 3px 8px -4px rgba(${T.shadowBase},0.4); }
        .pp-db-nout { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
        .pp-db-qopqoq { width: 168px; height: 108px; border-radius: 10px 10px 3px 3px; background: linear-gradient(160deg,#3A3946,#1F1E27); padding: 7px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08); }
        .pp-db-ekran { width: 100%; height: 100%; border-radius: 4px; background: linear-gradient(160deg,#EAF1FF,#D9E4FA); overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 6px; }
        .pp-db-asos { position: relative; width: 206px; height: 11px; border-radius: 2px 2px 10px 10px; background: linear-gradient(180deg,#DAD8E3,#ABA8B9); box-shadow: 0 7px 10px -6px rgba(${T.shadowBase},0.5); }
        .pp-db-klav { position: absolute; left: 50%; top: 2px; width: 48px; height: 3px; margin-left: -24px; border-radius: 2px; background: #9895A6; }
        .pp-db-usb { position: absolute; right: 6px; top: 3px; width: 10px; height: 5px; border-radius: 1px; background: #4A4852; box-shadow: 0 0 0 2px ${T.err}; animation: pp-milt 1s ease-in-out infinite; }
        @keyframes pp-milt { 50% { box-shadow: 0 0 0 5px rgba(194,54,43,0.18); background: ${T.err}; } }
        .pp-db-oyna { width: 100%; height: 100%; background: #FFFFFF; border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 2px 6px -3px rgba(0,0,0,0.3); }
        .pp-db-oyna.kichik { width: 56px; height: 42px; }
        .pp-db-oyna-bar { display: flex; gap: 3px; padding: 3px 5px; background: #EEF0F6; }
        .pp-db-oyna-bar i { width: 4px; height: 4px; border-radius: 50%; background: #C9C6D6; }
        .pp-db-oyna-ichi { flex: 1; display: flex; align-items: center; justify-content: center; padding: 4px; }
        .pp-db-bosh { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 10.5px; font-weight: 800; color: ${T.err}; text-align: center; line-height: 1.2; }
        .pp-db-usbb { position: relative; width: 24px; height: 12px; border-radius: 3px; border: 2px dashed ${T.err}; }
        .pp-db-usbb::after { content: ''; position: absolute; right: -8px; top: 1px; width: 6px; height: 6px; border: 2px dashed ${T.err}; border-left: none; }
        .pp-db-fayllar { display: flex; align-items: flex-end; gap: 5px; }
        .pp-db-papka { position: relative; width: 28px; height: 21px; border-radius: 2px 4px 4px 4px; background: #0061FF; }
        .pp-db-papka::before { content: ''; position: absolute; left: 0; top: -4px; width: 12px; height: 5px; border-radius: 2px 2px 0 0; background: #0061FF; }
        .pp-db-fayl { position: relative; display: inline-block; width: 15px; height: 19px; border-radius: 2px; background: #FFFFFF; border: 1.5px solid #8FB0F5; flex-shrink: 0; }
        .pp-db-fayl::after { content: ''; position: absolute; left: 3px; right: 3px; top: 5px; height: 1.5px; background: #8FB0F5; box-shadow: 0 3px 0 #8FB0F5, 0 6px 0 #8FB0F5; }
        .pp-db-fikr { position: relative; align-self: flex-start; margin-left: 30px; animation: pp-fikr .55s cubic-bezier(.2,.9,.3,1.2) .25s both; }
        @keyframes pp-fikr { from { opacity: 0; transform: scale(.6) translate(-20px, 20px); } }
        .pp-db-fikr-b { position: relative; width: 176px; height: 118px; border-radius: 44px; background: #FFFFFF; box-shadow: 0 8px 18px -10px rgba(${T.shadowBase},0.45), 0 0 0 1.5px ${T.line}; overflow: hidden; }
        .pp-db-fikr-d { position: absolute; border-radius: 50%; background: #FFFFFF; box-shadow: 0 0 0 1.5px ${T.line}; }
        .pp-db-fikr-d.d1 { width: 16px; height: 16px; left: -14px; bottom: -6px; }
        .pp-db-fikr-d.d2 { width: 9px; height: 9px; left: -28px; bottom: -20px; }
        .pp-db-deraza { position: absolute; left: 24px; top: 16px; width: 36px; height: 32px; border: 3px solid #C9B79A; border-radius: 3px; background: linear-gradient(180deg,#CFE3F3,#EAF4FB); }
        .pp-db-deraza::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; margin-left: -1px; background: #C9B79A; }
        .pp-db-deraza::after { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 2px; margin-top: -1px; background: #C9B79A; }
        .pp-db-stol { position: absolute; left: 16px; right: 16px; bottom: 30px; height: 6px; border-radius: 2px; background: #B98A5A; }
        .pp-db-stol::before, .pp-db-stol::after { content: ''; position: absolute; top: 6px; width: 4px; height: 18px; background: #9C7148; }
        .pp-db-stol::before { left: 8px; }
        .pp-db-stol::after { right: 8px; }
        .pp-db-chiroq { position: absolute; left: 12px; bottom: 6px; width: 3px; height: 24px; background: #6B6875; }
        .pp-db-chiroq::before { content: ''; position: absolute; left: -8px; top: -8px; width: 18px; height: 10px; border-radius: 9px 9px 2px 2px; background: #F2C14E; }
        .pp-db-fleshka { position: absolute; right: 34px; bottom: 6px; width: 26px; height: 11px; border-radius: 3px; background: #E2563C; box-shadow: 0 0 0 0 rgba(226,86,60,0.5); animation: pp-fleshka 1.6s ease-in-out infinite; }
        .pp-db-fleshka::after { content: ''; position: absolute; right: -7px; top: 2px; width: 7px; height: 7px; border-radius: 0 2px 2px 0; background: #C9C6D6; }
        @keyframes pp-fleshka { 50% { box-shadow: 0 0 0 6px rgba(226,86,60,0.0), 0 0 10px 2px rgba(226,86,60,0.45); } }
        .pp-db-fikr-t { position: absolute; left: 0; right: 0; bottom: 7px; text-align: center; font-size: 10.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.ink2}; }
        .pp-db-sahna.b1 { justify-content: space-between; padding-left: 26px; padding-right: 26px; }
        .pp-db-mon { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
        .pp-db-mon .pp-db-qopqoq { width: 150px; height: 98px; border-radius: 8px; }
        .pp-db-oyoq { width: 16px; height: 18px; background: linear-gradient(90deg,#B9B6C6,#D6D3E0); }
        .pp-db-taglik { width: 66px; height: 6px; border-radius: 4px 4px 2px 2px; background: #ABA8B9; }
        .pp-db-bulut { position: absolute; left: 22%; right: 22%; top: 16px; height: 120px; z-index: 0; }
        .pp-db-bulut svg { position: absolute; left: 0; top: 18px; width: 100%; height: 100px; overflow: visible; }
        .pp-db-bulut path { fill: none; stroke: #7FA8FF; stroke-width: 2; stroke-dasharray: 5 6; vector-effect: non-scaling-stroke; }
        .pp-db-bulut-i { position: absolute; left: 50%; top: 2px; width: 72px; height: 30px; margin-left: -36px; border-radius: 20px; background: #FFFFFF; box-shadow: 0 4px 10px -5px rgba(${T.shadowBase},0.45); }
        .pp-db-bulut-i::before { content: ''; position: absolute; left: 12px; top: -14px; width: 28px; height: 28px; border-radius: 50%; background: #FFFFFF; }
        .pp-db-bulut-i::after { content: ''; position: absolute; left: 32px; top: -8px; width: 24px; height: 24px; border-radius: 50%; background: #FFFFFF; }
        .pp-db-bulut-t { position: absolute; left: 0; right: 0; top: 38px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; }
        .pp-db-uchar { position: absolute; z-index: 4; left: 24%; top: 44%; animation: pp-uchar 2.8s ease-in-out infinite; box-shadow: 0 6px 12px -6px rgba(0,97,255,0.6); }
        @keyframes pp-uchar { 0% { left: 22%; top: 46%; opacity: 0; transform: scale(.7); } 10% { opacity: 1; } 36% { left: 48%; top: 10%; transform: scale(1.15); } 62% { left: 74%; top: 46%; opacity: 1; transform: scale(.9); } 68%, 100% { left: 74%; top: 46%; opacity: 0; } }
        .pp-db-sahna.b1 .pp-db-mon .pp-db-fayl.yangi { animation: pp-qonish 2.8s ease-in-out infinite; }
        .pp-db-sahna.b2, .pp-db-sahna.b3 { align-items: center; gap: 22px; }
        .pp-db-sahna.b2 { height: 176px; }
        .pp-db-video { width: 224px; display: flex; flex-direction: column; border-radius: 10px; overflow: hidden; background: #15141B; box-shadow: 0 12px 24px -14px rgba(${T.shadowBase},0.65); }
        .pp-db-v-ekran { position: relative; height: 116px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 40%, #2B3350, #15141B 75%); }
        .pp-db-v-mini { display: flex; align-items: center; gap: 8px; }
        .pp-db-v-ok { width: 20px; border-top: 2px dashed #7FA8FF; }
        .pp-db-play { position: absolute; left: 50%; top: 50%; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; background: rgba(255,255,255,0.94); animation: pp-play 1s ease-in .5s both; }
        .pp-db-play::after { content: ''; position: absolute; left: 18px; top: 14px; border-left: 15px solid #15141B; border-top: 9px solid transparent; border-bottom: 9px solid transparent; }
        @keyframes pp-play { 30% { transform: scale(.84); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }
        .pp-db-v-pan { display: flex; align-items: center; gap: 8px; padding: 7px 10px; }
        .pp-db-pauza { display: flex; gap: 3px; }
        .pp-db-pauza i { width: 3px; height: 10px; border-radius: 1px; background: #FFFFFF; }
        .pp-db-v-yol { flex: 1; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.22); overflow: hidden; }
        .pp-db-v-yol i { display: block; height: 100%; width: 0; background: #0061FF; animation: pp-videoyol 7s linear .6s infinite; }
        @keyframes pp-videoyol { to { width: 100%; } }
        .pp-db-video.kichik { width: 150px; }
        .pp-db-video.kichik .pp-db-v-ekran { height: 80px; }
        .pp-db-video.kichik .pp-db-oyna.kichik { width: 40px; height: 32px; }
        .pp-db-video.kichik .pp-db-play { display: none; }
        .pp-db-forma { width: 196px; display: flex; flex-direction: column; gap: 9px; padding: 12px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 12px 24px -14px rgba(${T.shadowBase},0.5), 0 0 0 1px ${T.line}; animation: ak-kir .45s ease-out .2s both; }
        .pp-db-forma b { font-size: 13.5px; font-weight: 800; color: ${T.ink}; }
        .pp-db-input { display: flex; align-items: center; gap: 6px; border: 1.5px solid ${T.line}; border-radius: 8px; padding: 6px 8px; }
        .pp-db-input i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .pp-db-input span { flex: 1; height: 6px; border-radius: 3px; background: ${T.line}; }
        .pp-db-tugma { text-align: center; font-size: 13px; font-weight: 800; color: #FFFFFF; background: #0061FF; border-radius: 8px; padding: 7px; }
        .pp-db-forma.royxat { width: 232px; gap: 8px; }
        .pp-db-forma-bosh { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .pp-db-qatorlar { height: 108px; overflow: hidden; border-radius: 8px; background: ${T.bg}; -webkit-mask-image: linear-gradient(transparent, #000 16%, #000 84%, transparent); mask-image: linear-gradient(transparent, #000 16%, #000 84%, transparent); }
        .pp-db-q-iz { display: flex; flex-direction: column; gap: 6px; padding: 6px 9px; animation: pp-oqish .8s linear infinite; }
        .pp-db-q-iz.sekin { animation-duration: 3.4s; }
        @keyframes pp-oqish { to { transform: translateY(calc(-50% - 3px)); } }
        .pp-db-q { display: flex; align-items: center; gap: 7px; height: 14px; color: ${T.ink2}; }
        .pp-db-q i { position: relative; display: block; width: 11px; height: 13px; flex-shrink: 0; }
        .pp-db-q i::before { content: ''; position: absolute; left: 3px; top: 0; width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
        .pp-db-q i::after { content: ''; position: absolute; left: 0; bottom: 0; width: 11px; height: 6px; border-radius: 6px 6px 1px 1px; background: currentColor; }
        .pp-db-q b { display: block; height: 5px; border-radius: 3px; background: #C9D7F5; }
        .pp-db-sahna.b4 { align-items: center; gap: 16px; }
        .pp-db-bir { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding-top: 34px; }
        .pp-db-fikr-b.kichik { position: absolute; top: 0; left: 50%; margin-left: -8px; width: 46px; height: 28px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .pp-db-fikr-b.kichik .pp-db-fleshka { position: relative; right: auto; bottom: auto; width: 18px; height: 8px; animation: none; }
        .pp-db-fikr-b.kichik .pp-db-fleshka::after { right: -5px; top: 1.5px; width: 5px; height: 5px; }
        .pp-db-bir-odam { position: relative; display: block; width: 26px; height: 34px; }
        .pp-db-bir-odam::before { content: ''; position: absolute; left: 7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: ${T.accent}; }
        .pp-db-bir-odam::after { content: ''; position: absolute; left: 1px; bottom: 0; width: 24px; height: 20px; border-radius: 12px 12px 3px 3px; background: ${T.accent}; }
        .pp-db-bir-t { font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .pp-db-strelka { position: relative; width: 46px; height: 0; border-top: 2px dashed ${T.ink2}; flex-shrink: 0; }
        .pp-db-strelka::after { content: ''; position: absolute; right: -2px; top: -6px; width: 9px; height: 9px; border-top: 2px solid ${T.ink2}; border-right: 2px solid ${T.ink2}; transform: rotate(45deg); }
        .pp-db-olomon { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .pp-db-olomon-i { display: grid; grid-template-columns: repeat(12, 12px); gap: 5px 6px; color: ${T.ink2}; }
        .pp-db-o { width: 12px; height: 14px; animation: pp-kel .4s ease-out both; animation-delay: calc(var(--k) * 26ms); }
        .pp-db-o:nth-child(3n) { color: #0061FF; }

        /* --- s8 forma --- */
        .pp-forma.nom-joriy > .ak-bosh { outline: 1.5px solid ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 6px 8px; }
        .pp-forma.nom-xato > .ak-bosh { outline: 1.5px solid ${T.err}; background: ${T.errFon}; border-radius: 10px; padding: 6px 8px; }
        .pp-forma .ak-nom .pp-kirit { font-weight: 700; }
        .q-mustaqil .pp-amal { margin-top: 2px; }

        /* --- s9 Mentor ro'yxati: ketma-ket katta karta (F-1005-83) --- */
        .pp-mro { display: flex; flex-direction: column; gap: 6px; }
        .pp-mro-bosh { display: flex; justify-content: space-between; align-items: baseline; }
        .pp-mro-l { font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .pp-mro-n { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px; color: ${T.accent}; }
        .pp-mro-n.kir { display: inline-block; animation: pp-pop .4s cubic-bezier(.2,.9,.3,1.3) both; }
        .pp-mro-q { display: flex; flex-direction: column; gap: 4px; }
        .pp-mro-q .ak-qator { padding: 4px 9px; min-height: 28px; }
        .pp-mro-q .ak-qator .ak-matn { font-size: 12.5px; line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
        .pp-mro-q .ak-qator.yangi { border-color: ${T.ok}; background: ${T.okFon}; animation: pp-qator-kir .55s cubic-bezier(.2,.9,.3,1.1) both; }
        @keyframes pp-qator-kir { from { opacity: 0; transform: translateX(-28px) scale(.95); } }
        .pp-s9-chap { display: flex; flex-direction: column; gap: 10px; }
        .pp-s9-karta { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; border-radius: 16px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 14px 28px -18px rgba(${T.shadowBase},0.5); animation: pp-s9-kir .4s cubic-bezier(.2,.9,.3,1.1) both; }
        .pp-s9-k-bosh { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .pp-s9-k-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        p.pp-s9-k-t { margin: 0; font-size: clamp(16px,1.8vw,18px); font-weight: 700; line-height: 1.4; color: ${T.ink}; }
        .pp-belgilar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .pp-belgi-l { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; margin-right: 2px; }
        .pp-belgi { font-size: 12px; font-weight: 600; padding: 3px 9px; border-radius: 999px; background: ${T.bg}; color: ${T.ink2}; border: 1px solid ${T.line}; }
        .pp-s9-karta.silk { border-color: ${T.err}; animation: q-silk .32s ease-in-out 2; }
        .pp-s9-karta.uch-royxat { animation: pp-uch-r .43s cubic-bezier(.5,0,.75,0) forwards; }
        .pp-s9-karta.uch-chiq { animation: pp-uch-c .43s ease-in forwards; }
        @keyframes pp-s9-kir { from { opacity: 0; transform: translateY(16px) scale(.97); } }
        @keyframes pp-uch-r { to { opacity: 0; transform: translate(72%, -8%) scale(.42); } }
        @keyframes pp-uch-r-mob { to { opacity: 0; transform: translate(0, 60%) scale(.5); } }
        @keyframes pp-uch-c { to { opacity: 0; transform: translate(-26%, 14px) rotate(-4deg) scale(.86); filter: grayscale(1); } }
        .pp-s9-yakun { display: flex; flex-direction: column; gap: 12px; }
        .pp-mro-qator { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; transform-origin: top; animation: pp-buklan .5s ease-in both; }
        .pp-mro-qator .pp-mro-s { font-size: 13px; color: ${T.ink2}; }
        .pp-mro-qator .pp-mro-n { margin-left: auto; color: ${T.ok}; }
        @keyframes pp-buklan { from { opacity: .4; transform: scaleY(3.2); } }
        .pp-ajral { animation: pp-ajral .6s cubic-bezier(.2,.9,.3,1.12) .45s both; }
        @keyframes pp-ajral { from { opacity: 0; transform: translateY(-18px) scale(.94); } }
        .pp-s9-yakun.qayt .pp-mro-qator, .pp-s9-yakun.qayt .pp-ajral { animation: none; }

        /* --- s10 juftlik --- */
        .pp-s10-bosh { display: flex; flex-direction: column; gap: 10px; max-width: 640px; width: 100%; }
        .lesson-root ol.pp-savollar, .lesson-root ol.pp-vazifa, .lesson-root ol.pp-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .pp-savollar li, .pp-vazifa li, .pp-hw-qadam li { display: flex; gap: 9px; align-items: flex-start; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .pp-savollar li i, .pp-vazifa li i, .pp-hw-qadam li i { flex: 0 0 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; background: ${T.accentSoft}; color: ${T.accent}; }
        .pp-bosq { display: flex; flex-wrap: wrap; gap: 8px; }
        .pp-qchip { display: inline-flex; align-items: center; gap: 4px; padding: 7px 12px; border-radius: 999px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .pp-qchip.on { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; }
        .pp-qchip.ok { border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; }
        .pp-taymer { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .pp-taymer-son { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 20px; color: ${T.ink}; min-width: 58px; }
        .pp-taymer.yur .pp-taymer-son { color: ${T.accent}; }
        .pp-taymer.tugadi .pp-taymer-son { color: ${T.ok}; }
        .pp-taymer-yol { flex: 1; min-width: 80px; height: 6px; border-radius: 3px; background: ${T.line}; overflow: hidden; }
        .pp-taymer-yol i { display: block; height: 100%; background: ${T.accent}; transition: width 1s linear; }
        .pp-taymer.tugadi .pp-taymer-yol i { background: ${T.ok}; }
        .pp-hisob-q { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .pp-nuqta10 { display: flex; gap: 5px; flex-wrap: wrap; }
        .pp-nuqta10 i { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid ${T.line}; background: ${T.paper}; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 10px; font-weight: 800; color: ${T.paper}; }
        .pp-nuqta10 i.ok { background: ${T.ok}; border-color: ${T.ok}; }
        .pp-nuqta10 i.cur { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pp-mlist { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; width: 100%; }
        .pp-mq { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 7px 10px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.paper}; min-width: 0; }
        .pp-mq.kir { animation: ak-kir .4s ease-out both; }
        .pp-mq.tahrir { grid-column: 1 / -1; flex-direction: column; align-items: stretch; }
        .pp-mq-n { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: ${T.ink2}; }
        .pp-mq-t { flex: 1; min-width: 0; font-size: 13px; line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; }
        .pp-manba { font-size: 10.5px; font-weight: 700; padding: 1px 7px; border-radius: 999px; background: ${T.bg}; color: ${T.ink2}; white-space: nowrap; }
        .pp-manba.sinfdosh { background: ${T.accentSoft}; color: ${T.accent}; }
        .pp-mq .q-btn { padding: 4px 10px; font-size: 12px; }

        /* --- s11 kod --- */
        .pp-darvoza { display: flex; flex-direction: column; gap: 8px; }
        .pp-darvoza-s { font-weight: 700; font-size: 14.5px; color: ${T.ink}; }
        .pp-yordam { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .pp-kodoyna { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pp-kod { margin: 0; background: ${CODE.bg}; color: ${CODE.text}; border-radius: 12px; padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere; user-select: none; -webkit-user-select: none; }
        .pp-kod-izoh { color: ${CODE.comment}; }
        .pp-tur { font-weight: 700; color: ${CODE.str}; border-radius: 4px; transition: background .4s, color .4s; }
        .pp-kod.ajrat .pp-tur.muammo { background: ${T.ok}; color: ${T.paper}; }
        .pp-kod.ajrat .pp-tur.yechim, .pp-kod.ajrat .pp-tur.fikr { background: ${T.ink2}; color: ${T.paper}; }

        /* --- s13 tanlov --- */
        .pp-qrows { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; }
        .pp-qrow { cursor: pointer; font-family: 'Manrope', sans-serif; width: 100%; }
        .pp-qrow:hover { border-color: ${T.accent}; }
        .pp-qrow .ak-matn { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; animation: none; }
        .ak .pp-amal .q-btn.pp-boshqa { padding: 6px 12px; font-size: 12.5px; }

        /* --- uyga vazifa (PM HwCard) --- */
        .pp-hw { display: flex; flex-direction: column; gap: 12px; }
        .pp-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .pp-hw-q { display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .pp-hw-k { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .pp-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; line-height: 1.35; }
        .pp-hw-keyingi { font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }

        @media (max-width: 1199px) { .pp-mro-bosh { padding-right: 40px; } }
        @media (max-width: 760px) {
          .pp-uch, .pp-juftlik, .pp-hw-karta, .pp-mlist, .pp-qrows, .pp-s9-yakun, .pp-dbx, .pp-s2-guruhlar { grid-template-columns: minmax(0,1fr); }
          .pp-s2-guruhlar { gap: 14px; }
          .pp-s2-bash { flex-direction: column; align-items: stretch; gap: 8px; }
          .pp-s2-bash > .q-bashorat { grid-template-columns: minmax(0,1fr); }
          .pp-tel.katta .pp-narx { font-size: 10.5px; padding: 3px 8px; }
          .pp-s9-karta.uch-royxat { animation-name: pp-uch-r-mob; }
          .pp-mk { height: 118px; }
          .pp-tel.katta { width: 140px; height: 244px; }
          .pp-tel.katta .pp-tel-ekran { padding: 20px 8px 8px; gap: 6px; }
          .pp-db-sahna { height: 176px; gap: 10px; padding: 12px 8px 14px; }
          .pp-db-qopqoq { width: 120px; height: 78px; padding: 5px; }
          .pp-db-asos { width: 148px; height: 9px; }
          .pp-db-mon .pp-db-qopqoq { width: 106px; height: 70px; }
          .pp-db-fikr { margin-left: 16px; }
          .pp-db-fikr-b { width: 132px; height: 92px; border-radius: 34px; }
          .pp-db-deraza { left: 16px; top: 12px; width: 28px; height: 24px; }
          .pp-db-stol { bottom: 26px; }
          .pp-db-sahna.b1 { padding-left: 12px; padding-right: 12px; }
          .pp-db-bulut { left: 26%; right: 26%; }
          .pp-db-video { width: 150px; }
          .pp-db-v-ekran { height: 84px; }
          .pp-db-oyna.kichik { width: 40px; height: 32px; }
          .pp-db-forma { width: 140px; padding: 9px; gap: 7px; }
          .pp-db-forma.royxat { width: 160px; }
          .pp-db-video.kichik { width: 112px; }
          .pp-db-video.kichik .pp-db-v-ekran { height: 64px; }
          .pp-db-video.kichik .pp-db-oyna.kichik { width: 30px; height: 24px; }
          .pp-db-qatorlar { height: 90px; }
          .pp-db-olomon-i { grid-template-columns: repeat(8, 12px); }
          .pp-db-tanish-t { min-width: 0; }
          .pp-strelka { flex-direction: row; gap: 8px; }
          .pp-strelka i { width: 0; height: 24px; border-top: none; border-left: 1.5px solid ${T.ink2}; }
          .pp-strelka i::before { left: -5px; top: -1px; transform: rotate(135deg); }
          .pp-reja-ro { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
          .ak-q { grid-template-columns: 68px minmax(0,1fr); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ak.kir, .ak-yorliq, .ak-matn, .ak-odam.kir .ak-sil i, .pp-nom.kir, .pp-voqea, .pp-mq.kir { animation: none !important; }
          .ak-odam.so { animation: none; opacity: 0; }
          .pp-tel, .pp-kun, .pp-kun-yol i, .pp-kun-yol b, .pp-odamcha, .pp-mk-ichi, .pp-mk-yoq, .pp-tel-tag, .pp-yg-mashina, .pp-narx, .pp-yg-yol i, .pp-odam-kut i, .pp-odam-yur, .pp-pm-tayyor, .pp-gt-q i, .pp-gt-tugma, .pp-lupa, .pp-soat i { animation: none !important; }
          .pp-db-tanish, .pp-db-sinx-yo::after, .pp-db-fayl, .pp-db-usb, .pp-db-fikr, .pp-db-fleshka, .pp-db-uchar, .pp-db-play, .pp-db-v-yol i, .pp-db-forma, .pp-db-q-iz, .pp-db-o { animation: none !important; }
          .pp-db-uchar, .pp-db-play, .pp-db-sinx-yo::after { display: none; }
          .pp-db-v-yol i { width: 40%; }
          .pp-s9-karta, .pp-mro-q .ak-qator.yangi, .pp-mro-n.kir, .pp-mro-qator, .pp-ajral { animation: none !important; }
          .pp-s2.f1 .loyiha .pp-mk-ichi { filter: grayscale(1); opacity: .42; }
          .pp-bos, .pp-bos-nav, .q-variant, .q-chip:not(.q-silk), .q-test-v, .pp-qrow, .pp-kirit, .ak-q.joriy, .pp-forma > .ak-bosh, .pp-s9-chap .q-btn, .pp-taxmin-q { animation: none !important; }
          .pp-s2.f1 .loyiha .pp-mk-yoq { opacity: 1; }
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
        .pp-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: pp-fc-halqa 1.6s ease-out 3; }
        @keyframes pp-fc-halqa { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        .pp-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .pp-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: pp-fc-nuqta 1.4s ease-in-out 3; }
        @keyframes pp-fc-nuqta { 50% { transform: scale(1.6); opacity: .4; } }
        @media (prefers-reduced-motion: reduce) { .pp-flash.yangi .fc-card:not(.flip) .fc-front, .pp-fc-ipucha i { animation: none; } }

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
