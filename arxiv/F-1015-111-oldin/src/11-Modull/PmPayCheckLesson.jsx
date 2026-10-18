import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul (LMS) · 9-dars (PM) «Kim haqiqatan to'lashga tayyor?» — m11-09 · MD v3: feedback/F-1007-13modul/09-PmPayCheck-v3.md (manba-haqiqat)
// Skelet src/skelet/NamunaDars.jsx dan; 12 ekran (keyssiz PM): kirish · reja · kim narxini yozdi · 1-savol · Mentor tekshiruvi · 2-savol ·
//   yozma tasdiqlaringiz · tekshiruv va keyingi qadam · yakuniy savol · podium · kartochkalar · yakun. Kod ekrani yo'q, REPO yo'q.
// Bitta vizual — «Tasdiq varag'i» (telefon-chat · varaq · ixcham bo'lak). Real pul yo'q: yozma tasdiq — to'lov emas, havola va karta yo'q.
// Saqlaydi: pm-m11d9-tasdiq · pm-m11d6-suhbat ga uy suhbatlari · o'qiydi: pm-m11d6-suhbat, pm-m11d4-narx, pm-m11d2-model.kim. Mentor ekraniga son, rol, gap, narx uzatilmaydi.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QXato, QIzoh, QXulosa, QQadamlar, QMustaqil, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m11d9-v1', lessonTitle: { uz: 'Kim haqiqatan to\'lashga tayyor?', ru: 'Кто действительно готов платить?' } };
// 12 ekran (MD v3): kirish → reja → tushuncha → test → tushuncha → test → mustaqil → mustaqil → yakuniy test → podium → kartochkalar → yakun.
const HW_TOKENS = [
  { t: { uz: 'xabar', ru: 'сообщение' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'yozma tasdiq', ru: 'подтверждение' }, l: 62, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'halol natija', ru: 'честный результат' }, l: 30, tp: 70, s: 12, d: 8.5 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal, natijaSignal }) => {
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
  // SABOQ P11: tugagan holat — desktopda ham natija (yashil xulosa) pastki panel ustida ko'rinsin
  useEffect(() => {
    if (!natijaSignal) return undefined;
    const el = contentRef.current;
    if (!el) return undefined;
    const t = setTimeout(() => { if (el && el.scrollHeight > el.clientHeight + 4) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }, 520);
    return () => clearTimeout(t);
  }, [natijaSignal]);
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `s15` — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi — shu map ular bilan sinxron bo'lsin.
// ⚡ To'g'ri javob pozitsiyalari ATAYIN har xil (3 · 0 · 2 · 3) — «doim A» naqshi yo'q, o'qimay bosgan ball to'plamaydi.
// s15 (yakuniy debug) — REAL kalit: picked=0 → 1-urinishda topdi (to'g'ri), picked=1 → 1-urinishda xato bosdi.
const INLINE_KEYS = { s3: 1, s5: 3, s8: 0, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: 'Yozma tasdiq nima', ru: 'Что такое письменное подтверждение' },
    cards: [
      { ic: '1', h: { uz: "Odamning o'zi yozgan javobi — chat xabari yoki qog'oz.", ru: 'Ответ, который человек написал сам, — сообщение в чате или бумага.' } },
      { ic: '2', h: { uz: "Unda narx va nima uchun to'lashi bor.", ru: 'В нём есть цена и то, за что он заплатит.' } },
      { ic: '3', h: { uz: "U to'lov emas: pul olinmaydi.", ru: 'Это не оплата: денег не берут.' }, ask: { uz: 'Suhbat yozuvini kim yozadi, yozma tasdiqni-chi?', ru: 'Кто пишет запись разговора, а кто — письменное подтверждение?' } }
    ]
  },
  5: {
    title: { uz: "Tekshiruv nimani ko'radi", ru: 'На что смотрит проверка' },
    cards: [
      { ic: '1', h: { uz: "Kim tasdiqladi — u to'lovchimi.", ru: 'Кто подтвердил — плательщик ли он.' } },
      { ic: '2', h: { uz: 'Narx va nima uchun yozilganmi.', ru: 'Записаны ли цена и «за что».' } },
      { ic: '3', h: { uz: "So'zma-so'z va bosimsiz olinganmi; uchtaga yetmaslik — tuzatish emas.", ru: 'Получено ли дословно и без давления; меньше трёх — не исправление.' }, ask: { uz: 'Narxsiz «ha» nega hali yozma tasdiq emas?', ru: 'Почему «да» без цены — ещё не письменное подтверждение?' } }
    ]
  },
  8: {
    title: { uz: 'Uchtaga yetmasa', ru: 'Если не набралось трёх' },
    cards: [
      { ic: '1', h: { uz: 'Yozma tasdiqlar soni — baho emas.', ru: 'Число подтверждений — не оценка.' } },
      { ic: '2', h: { uz: "«Hozir yo'q» ham natija — qayta yozilmaydi.", ru: '«Сейчас нет» — тоже результат, повторно не пишут.' } },
      { ic: '3', h: { uz: 'Halol yozuv va bitta keyingi qadam qoladi.', ru: 'Остаются честная запись и один следующий шаг.' }, ask: { uz: "«Hozir yo'q» degan odamga nega qayta yozmaysiz?", ru: 'Почему не пишете повторно тому, кто сказал «сейчас нет»?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="tv-tviz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI — «Tasdiq varag'i» (telefon · varaq · ixcham bo'lak; MD A «Bitta vizual», KOD 3) =====
// qolip-maket: tv-katak tv-ustun tv-xabar tv-tugma tv-kichik tv-tanla
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
// Son va «8 / 10» qator oxirida bo'linmaydi (SABOQ P9)
const nb = (s) => (typeof s === 'string' ? s.replace(/(\d) (\d{3})(?!\d)/g, '$1 $2').replace(/(\d) \/ (\d)/g, '$1 / $2') : s);
// O'qituvchi eslatmasi — faqat Mentor jonli rejimida (MD «O'qituvchi eslatmasi»; o'quvchida ko'rinmaydi)
const Ustoz = ({ satrlar }) => {
  const { isMentor } = useJonli();
  if (!isMentor) return null;
  return <div className="tv-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((q, i) => <span key={i}>{tr(q)}</span>)}</div>;
};
const USTOZ = {
  s0: [{ uz: "Javoblarni muhokama qilmang — bugun Mentor bu gapni qanday tekshirganini ko'rasiz. 6-darsdan keyin uyda suhbat o'tkazganlar qog'ozini olib qo'ysin — 7-ekranda kerak bo'ladi.", ru: 'Не обсуждайте ответы — сегодня вы увидите, как Ментор проверил эти слова. Кто после 6-го урока провёл разговор дома, пусть приготовит бумагу — она понадобится на 7-м экране.' }],
  s1: [{ uz: "Menyu ostidagi «uchta yozma tasdiq» — dastur natijasi. Darsda — xabar va kelgan javoblar; ko'p o'quvchida darsda yozma tasdiq 0–1 bo'ladi, qolgani uyda. Uchtaga yetmaslik — baho emas. Darsda hech kim pul olmaydi va hech narsa sotmaydi.", ru: '«Три письменных подтверждения» под названием в меню — результат программы. На уроке — сообщение и пришедшие ответы; у многих на уроке будет 0–1 подтверждение, остальное — дома. Не набрать трёх — не оценка. На уроке никто не берёт денег и ничего не продаёт.' }],
  s2: [
    { uz: "Mentor misolida Pro — tashkilotchi uchun, o'yinchilar bepul: shuning uchun Mentor ilovadagi oltita tashkilotchiga yozdi — 6-darsdagi uchtasi ham. 4, 5, 6-tashkilotchi bilan 6-darsda suhbat bo'lmagan.", ru: 'В примере Ментора Pro — для организатора, игрокам бесплатно: поэтому Ментор написал шести организаторам в приложении — включая троих из 6-го урока. С 4-м, 5-м и 6-м организатором на 6-м уроке разговора не было.' },
    { uz: "3-tashkilotchining 10 000 i — uning yozma tasdig'i: Mentor narxni bu darsda o'zgartirmadi. Mentor xabarini ovoz chiqarib o'qing: narx bor, «Bu to'lov emas», «Yozmasangiz ham bo'ladi» — bosim yo'q.", ru: '10 000 у 3-го организатора — его письменное подтверждение: Ментор на этом уроке цену не менял. Прочитайте сообщение Ментора вслух: цена есть, «Это не оплата», «Можете не писать» — давления нет.' },
    { uz: "Sinfga savol: «Og'zaki «olaman» bilan o'zi yozib bergan javobning farqi nima?» (javoblar og'zaki, sanalmaydi).", ru: 'Вопрос классу: «Чем устное «возьму» отличается от ответа, который человек сам написал?» (ответы устные, не подсчитываются).' }
  ],
  s4: [
    { uz: "Tekshiruv yozuvning halolligini ko'radi: kim yozgan, narx va nima uchun bilan, o'z so'zi bilan, bosimsiz. 6 dan 3 — qabul; 6 dan 1 ham halol yozilgan bo'lsa — qabul: son tuzatish sababi emas, uchtaga yetmasa — keyingi qadam (8-ekran).", ru: 'Проверка смотрит на честность записи: кто написал, с ценой и «за что», своими словами, без давления. 3 из 6 — принято; и 1 из 6, если записано честно, — принято: число не причина для исправления, если не набралось трёх — следующий шаг (8-й экран).' },
    { uz: "Tuzatish — o'zi yozgan yoki to'lovchi bo'lmagan odamning «tasdig'i» (Mentor misolida — o'yinchi), narxsiz javob, bosim bilan olingan javob. 11-Modulda PRD ham, 12-Modulda hisobot ham uch savol bilan tekshirilgan — bugun savollar yangi.", ru: 'Исправление — «подтверждение», написанное самим учеником или человеком, который не платит (в примере Ментора — игроком), ответ без цены, ответ, полученный под давлением. В 11-м модуле PRD, а в 12-м отчёт тоже проверяли тремя вопросами — сегодня вопросы новые.' }
  ],
  s6: [
    { uz: "≈ 25 daqiqa. Darsda xabar — faqat 6-darsdagi suhbatdoshga (real suhbat; ota-onasi u haqida biladi) yoki to'lovchi bo'ladigan sinfdoshga; oldin yozmagan tanish to'lovchiga — uyda; yuborishdan oldin «ota-onam xabardor» belgisi. Javob kutib turmang: dars davom etadi, kelgani «Orqaga» bilan qo'shiladi.", ru: '≈ 25 минут. На уроке сообщение — только собеседнику с 6-го урока (реальный разговор; родители о нём знают) или однокласснику, который будет платить; знакомому плательщику, которому раньше не писали, — дома; перед отправкой — отметка «родители в курсе». Не ждите ответа: урок идёт дальше, пришедший ответ добавят через «Назад».' },
    { uz: "Kim nechta yozma tasdiq olganini so'ramang va sanamang. Narxni siz qo'ymaysiz. Sinfdoshi to'lovchi bo'lmagan o'quvchi darsda yubormasligi mumkin — bu ham to'g'ri yo'l.", ru: 'Не спрашивайте и не считайте, кто сколько подтверждений получил. Цену назначаете не вы. Ученик, чей одноклассник не плательщик, может не отправлять на уроке — это тоже правильный путь.' }
  ],
  s7: [
    { uz: "≈ 13 daqiqa: 4 daqiqadan so'ng «O'rin almashing» deng, keyin keyingi qadam. Sherik savolni o'quvchining ekranida beradi; sonni sinfga aytmaydi. «Tuzatish» — yaxshi natija: yozuv halol bo'ladi.", ru: '≈ 13 минут: через 4 минуты скажите «Поменяйтесь местами», затем следующий шаг. Партнёр задаёт вопросы на экране ученика; число классу не называет. «Исправление» — хороший результат: запись становится честной.' },
    { uz: "O'zi yozgan yoki sinfdoshi to'lovchi bo'lmagan holda yozdirgan «tasdiq», bosim bilan olingani — tuzatish. Yozma tasdiqni uchtaga yetkazganlarni alohida maqtamang, boshqalarni solishtirmang.", ru: '«Подтверждение», написанное самим учеником или одноклассником, который не платит, и полученное под давлением — исправление. Не хвалите отдельно тех, кто набрал три подтверждения, не сравнивайте с остальными.' }
  ]
};

// --- Saqlash kalitlari (tayanch 8): o'qiydi — 4-dars narxi, 2-dars modeli, 6-dars suhbatlari · yozadi — pm-m11d6-suhbat (uy suhbatlari), pm-m11d9-tasdiq ---
const NARX_KEY = 'pm-m11d4-narx';
const MODEL_KEY = 'pm-m11d2-model';
const SUHBAT_KEY = 'pm-m11d6-suhbat';
const TASDIQ_KEY = 'pm-m11d9-tasdiq';
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const bugun = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const sonFmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const narxSon = (v) => { const n = Number(String(v ?? '').replace(/[\s., ]/g, '')); return Number.isFinite(n) && n > 0 ? Math.round(n) : null; };
const narxOl = () => {
  const n = lsO(NARX_KEY);
  if (!n) return null;
  return { narx: narxSon(n.narx), davrKun: narxSon(n.davrKun), sarlavha: n.ekran && typeof n.ekran === 'object' ? String(n.ekran.sarlavha || '').trim() : '' };
};
const modelKim = () => { const m = lsO(MODEL_KEY); return m && typeof m.kim === 'string' && m.kim.trim() ? m.kim.trim() : null; };
const suhbatOl = () => {
  const s = lsO(SUHBAT_KEY) || {};
  return { ...s, skript: Array.isArray(s.skript) ? s.skript : [], suhbatlar: Array.isArray(s.suhbatlar) ? s.suhbatlar : [], xulosa: s.xulosa ?? null };
};
const tasdiqOl = () => lsO(TASDIQ_KEY);

// --- Mentor misoli (tayanch 1.0, 1.4, 1.6, 1.9 — aynan; bitta manba, KOD 4) ---
const TAXMIN_YORLIQ = { uz: 'Mentorning taxmini', ru: 'Предположение Ментора' };
const MAYDON_RANG = '#2E9E4F';
const MJ = () => <b className="tv-mj">Maydon Jamoa</b>;
const DOIMIY = { uz: "Doimiy o'yin", ru: 'Постоянная игра' };
const MENTOR_SUHBAT1 = { gap: { uz: "Har hafta guruhga o'zim yozaman. O'zi e'lon qilsa — 15 000 ga olaman.", ru: 'Каждую неделю пишу в группу сам. Если будет объявлять само — возьму за 15 000.' }, narx: 15000 };
const XABAR_QATOR = { uz: "Bu to'lov emas — pul so'ramayman. Yozmasangiz ham bo'ladi.", ru: 'Это не оплата — денег не прошу. Можете не писать.' };
const MENTOR_XABAR = { uz: "\"Doimiy o'yin\" 30 kunga 15 000 so'm bo'lsa, to'lashga tayyormisiz? Tayyor bo'lsangiz, bir gap yozib bering: qaysi narxda va nima uchun to'laysiz. Bu to'lov emas — pul so'ramayman. Yozmasangiz ham bo'ladi.", ru: '«Постоянная игра» на 30 дней за 15 000 сумов — готовы платить? Если готовы, напишите одну фразу: по какой цене и за что заплатите. Это не оплата — денег не прошу. Можете не писать.' };
const MENTOR_JAVOBLAR = [
  { gap: { uz: "15 000 so'm bo'lsa, \"Doimiy o'yin\" uchun to'layman.", ru: 'Если 15 000 сумов — заплачу за «Постоянную игру».' }, holat: 'tasdiq', narx: 15000, nima: DOIMIY },
  { gap: { uz: "Hozir yo'q. Telegram guruhi tekin.", ru: 'Сейчас нет. Telegram-группа бесплатная.' }, holat: 'hozir', narx: null, nima: null },
  { gap: { uz: "15 000 qimmat. 10 000 so'm bo'lsa, \"Doimiy o'yin\" uchun to'layman.", ru: '15 000 дорого. Если 10 000 сумов — заплачу за «Постоянную игру».' }, holat: 'tasdiq', narx: 10000, nima: DOIMIY },
  { gap: { uz: "Har shanba o'zim yozishdan charchadim. 15 000 so'm bo'lsa, \"Doimiy o'yin\" uchun to'layman.", ru: 'Устал каждую субботу писать сам. Если 15 000 сумов — заплачу за «Постоянную игру».' }, holat: 'tasdiq', narx: 15000, nima: DOIMIY },
  { gap: { uz: "Hozir yo'q.", ru: 'Сейчас нет.' }, holat: 'hozir', narx: null, nima: null },
  { gap: null, holat: 'javobsiz', narx: null, nima: null }
];
const tashkilotchi = (n) => tr({ uz: `${n}-tashkilotchi`, ru: `${n}-й организатор` });
const MENTOR_HALOL = { uz: "Uchta yozma tasdiq — ikkitasi 15 000 da, bittasi 10 000 da: narx haqida dalil, isbot emas.", ru: 'Три письменных подтверждения — два по 15 000, одно по 10 000: довод о цене, а не доказательство.' };
const PRO_QATOR = { uz: "Pro — tashkilotchi uchun · o'yinchilar bepul", ru: 'Pro — для организатора · игрокам бесплатно' };
const HOLAT_T = {
  tasdiq0: { uz: 'narx va nima uchun yozdi', ru: 'написал цену и за что' },
  tasdiq: { uz: 'yozma tasdiq', ru: 'письменное подтверждение' },
  aniq: { uz: 'aniqlashtirish kerak', ru: 'нужно уточнить' },
  hozir: { uz: "hozir yo'q", ru: 'сейчас нет' },
  javobsiz: { uz: "javob yo'q", ru: 'нет ответа' }
};
const TEKSHIRUV_SAVOLLAR = [
  { k: 'kim', savol: { uz: 'Kim tasdiqladi?', ru: 'Кто подтвердил?' },
    q4: { uz: "har yozma tasdiqda rol bormi — u to'lovchimi?", ru: 'в каждом подтверждении указана роль — это плательщик?' },
    q7: { uz: "har yozuvdagi rol mahsulotingizda to'lovchimi — o'zingiz yoki to'lamaydigan odam emasmi?", ru: 'роль в каждой записи — плательщик в вашем продукте, а не вы сами и не тот, кто не платит?' },
    qisqa: { uz: 'kim tasdiqladi', ru: 'кто подтвердил' } },
  { k: 'narx', savol: { uz: 'Narx va nima uchun yozilganmi?', ru: 'Записаны цена и «за что»?' },
    q4: { uz: "har yozma tasdiqda narx va nima uchun to'lashi turibdimi?", ru: 'в каждом подтверждении есть цена и за что он заплатит?' },
    q7: { uz: "har yozuvda narx va nima uchun to'lashi uning xabaridan yozilganmi?", ru: 'в каждой записи цена и «за что» взяты из его сообщения?' },
    qisqa: { uz: 'narx va nima uchun', ru: 'цена и «за что»' } },
  { k: 'gap', savol: { uz: "So'zma-so'z va bosimsiz olinganmi?", ru: 'Получено дословно и без давления?' },
    q4: { uz: "gap odam yozganidek qo'shtirnoqda turibdimi; Mentor xabarida bosim yo'qmi?", ru: 'слова стоят в кавычках так, как их написал человек; в сообщении Ментора нет давления?' },
    q7: { uz: "gap — uning o'z so'zimi; xabaringizda bosim yo'qmi, bir marta yozdingizmi?", ru: 'слова — его собственные; в вашем сообщении нет давления, вы написали один раз?' },
    qisqa: { uz: "so'zma-so'z va bosimsiz", ru: 'дословно и без давления' } }
];
const NIMAGA = { uz: 'Nimaga qarang:', ru: 'На что смотреть:' };
const USTUN_T = {
  kim: { uz: 'kim', ru: 'кто' }, holat: { uz: 'holat', ru: 'статус' }, narx: { uz: 'narx', ru: 'цена' },
  nima: { uz: 'nima uchun', ru: 'за что' }, gap: { uz: 'gap', ru: 'слова' }, qayer: { uz: 'qayerda', ru: 'где' }
};

// --- yordamchi hook'lar ---
function useUchish() {
  const [uchlar, setUchlar] = useState([]);
  const kRef = useRef(0);
  const uch = useCallback((fromEl, toEl, matn, kechik = 0) => {
    if (!fromEl || !toEl || kamHarakat() || typeof document === 'undefined') return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const k = ++kRef.current;
    const qosh = () => setUchlar(u => [...u, { k, matn, x: a.left + Math.min(20, a.width / 3), y: a.top + Math.min(8, a.height / 3), dx: b.left - a.left, dy: b.top - a.top }]);
    if (kechik) setTimeout(qosh, kechik); else qosh();
    setTimeout(() => setUchlar(u => u.filter(z => z.k !== k)), 1000 + kechik);
  }, []);
  const qatlam = typeof document !== 'undefined' && uchlar.length > 0
    ? createPortal(uchlar.map(z => <span key={z.k} className="tv-uch" style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
    : null;
  return [uch, qatlam];
}
const useIpucha = (faol, dep) => {
  const [ko, setKo] = useState(false);
  useEffect(() => { setKo(false); if (!faol) return undefined; const t = setTimeout(() => setKo(true), 40000); return () => clearTimeout(t); }, [faol, dep]);
  return ko && faol;
};
const useYangi = (ms = 1100) => {
  const [y, setY] = useState(null);
  useEffect(() => { if (y === null) return undefined; const t = setTimeout(() => setY(null), ms); return () => clearTimeout(t); }, [y, ms]);
  return [y, setY];
};
const useYurish = (vaqtlar) => {
  const [f, setF] = useState(() => (kamHarakat() ? vaqtlar.length : 0));
  useEffect(() => {
    if (kamHarakat()) return undefined;
    const ts = vaqtlar.map((ms, i) => setTimeout(() => setF(i + 1), ms));
    return () => ts.forEach(clearTimeout);
  }, []); // eslint-disable-line
  return f;
};
// Taxmin natijasi — yashil xulosa qutisining birinchi kichik qatori (E 42); QIzoh — oxirgi kichik qatori
const TaxminQ = ({ togri, haqiqat }) => (
  <span className={cxx('tv-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>
);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="tv-x-m">{matn}</span>{izoh && <span className="tv-x-iz">{izoh}</span>}</>;
const BashoratQ = ({ savol, javob }) => <div className="tv-bashq fade-step"><span>{savol}</span><span className="tv-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;

// --- Telefon: umumiy messenjer ko'rinishidagi chat (ilova nomi, rangi, logotipi yo'q — TAQIQLAR 8); ism, raqam, rasm yo'q ---
const Telefon = ({ sarlavha, xabar, javob, javobKey, javobErr, yuborildi, nuqta, jRef, xRef, ust }) => {
  const cRef = useRef(null);
  useEffect(() => { const el = cRef.current; if (el) el.scrollTop = el.scrollHeight; }, [xabar, javob, nuqta, yuborildi]);
  return (
    <div className="tv-telj">
      {ust}
      <div className="tv-tel">
        <div className="tv-tel-bar"><span className="tv-tel-orqa" aria-hidden="true">‹</span><b key={String(sarlavha)} className="tv-tel-sar">{sarlavha}</b></div>
        <div ref={cRef} className="tv-chat">
          {xabar && <div ref={xRef} className="tv-pf men">{nb(xabar)}{yuborildi && <span className="tv-pf-y">{tr({ uz: 'yuborildi ✓', ru: 'отправлено ✓' })}</span>}</div>}
          {javob && <div ref={jRef} key={javobKey} className={cxx('tv-pf', 'u', javobErr && 'err')}>{nb(javob)}</div>}
          {nuqta && <div className="tv-pf u nuqta">…</div>}
        </div>
      </div>
    </div>
  );
};

// --- Varaq: sarlavha · muhr joyi · kulrang qator · xabar qatori · jadval · hisoblagichlar ---
const Muhr = ({ muhr }) => (muhr
  ? <span key={muhr.k} className={cxx('tv-muhr', muhr.tur)}>{muhr.t}</span>
  : <span className="tv-muhr bosh">{tr({ uz: 'muhr', ru: 'печать' })}</span>);
const Hisob = ({ items }) => (
  <div className="tv-hisob">
    {items.map((h, i) => <span key={i} className={cxx('tv-h', h.ok && 'ok', h.yon && 'yon')}>{h.t} · <b key={h.n}>{h.n}</b></span>)}
  </div>
);
const Katak = ({ zona, z, children, className, kRef }) => (zona && zona.onBos
  ? <button type="button" ref={kRef} className={cxx('tv-katak', className, zona.yon.has(z) && 'yon', zona.chorla.has(z) && 'chorla', zona.silk === z && 'silk')} disabled={zona.yopiq} onClick={(e) => zona.onBos(z, e.currentTarget)}>{children}</button>
  : <span ref={kRef} className={cxx('tv-katak', className, zona && zona.yon.has(z) && 'yon', zona && zona.chorla.has(z) && 'chorla')}>{children}</span>);
const USTUN_KENG = { kim: 'minmax(132px,0.9fr)', holat: 'minmax(92px,1fr)', narx: '60px', nima: 'minmax(78px,0.9fr)', gap: 'minmax(110px,2.4fr)', qayer: '76px' };
const Jadval = ({ ustunlar, qatorlar, zona, rRef }) => (
  <div className="tv-jw">
    <div className="tv-jadval" style={{ '--cols': ustunlar.map(u => USTUN_KENG[u]).join(' ') }}>
      <div className="tv-jq sar">{ustunlar.map(u => <span key={u} className="tv-ustun">{tr(USTUN_T[u])}</span>)}</div>
      {qatorlar.map((q, i) => (
        <div key={q.k} ref={rRef ? (el) => { rRef.current[i] = el; } : undefined} className={cxx('tv-jq', q.yangi && 'yangi', q.joriy && 'joriy', q.kul && 'kul', q.err && 'err')} style={{ '--i': i }}>
          {ustunlar.map(u => {
            const v = q[u];
            const bosh = q.uzuq && u !== 'kim';
            if (u === 'holat') return <Katak key={u} zona={zona} z="holat" className="h">{bosh || !q.holat ? <i className="tv-uzuq" /> : <b key={q.holatT} className={cxx('tv-hb', q.holat === 'tasdiq' ? 'ok' : 'kul')}>{q.holatT}</b>}</Katak>;
            if (u === 'gap') return <Katak key={u} zona={zona} z="gap" className="g">{bosh ? <i className="tv-uzuq" /> : v ? <>«{nb(v)}»</> : '—'}</Katak>;
            return <Katak key={u} zona={zona} z={u} className={u === 'kim' ? cxx('k', String(v || '').length <= 16 && 'nw') : u === 'narx' ? 'n' : ''}>{bosh ? <i className="tv-uzuq" /> : (v === null || v === undefined || v === '' ? '—' : <span className="tv-kt">{nb(v)}</span>)}{u === 'kim' && q.tahrir}</Katak>;
          })}
        </div>
      ))}
    </div>
  </div>
);
const Varaq = ({ sarlavha, muhr, pro, xabarQ, children, hisob, ost, vRef, className, zona }) => (
  <div ref={vRef} className={cxx('tv-varaq', className)}>
    <div className="tv-varaq-h"><span className="tv-varaq-s">{sarlavha}</span>{muhr !== false && <Muhr muhr={muhr} />}</div>
    {pro && (zona ? <Katak zona={zona} z="pro" className="tv-pro">{pro}</Katak> : <span className="tv-pro">{pro}</span>)}
    {xabarQ && (zona ? <Katak zona={zona} z="xabar" className="tv-xabar">{tr({ uz: 'Xabar', ru: 'Сообщение' })}: «{nb(xabarQ)}»</Katak> : <span className="tv-xabar">{tr({ uz: 'Xabar', ru: 'Сообщение' })}: «{nb(xabarQ)}»</span>)}
    {children}
    {hisob && ost ? <div className="tv-hisob-q"><Hisob items={hisob} />{ost}</div> : <>{hisob && <Hisob items={hisob} />}{ost}</>}
  </div>
);
const mentorQatorlar = (yangiNom) => MENTOR_JAVOBLAR.map((j, i) => ({
  k: 'm' + i, kim: tashkilotchi(i + 1), holat: j.holat, holatT: tr(j.holat === 'tasdiq' ? HOLAT_T[yangiNom ? 'tasdiq' : 'tasdiq0'] : HOLAT_T[j.holat]),
  narx: j.narx ? sonFmt(j.narx) : null, nima: j.nima ? tr(j.nima) : null, gap: j.gap ? tr(j.gap) : null
}));
const mentorHisob = (yon) => [
  { t: tr({ uz: "so'ralgan", ru: 'спросили' }), n: 6 },
  { t: tr({ uz: 'yozma tasdiq', ru: 'письменных подтверждений' }), n: 3, ok: true },
  { t: tr(HOLAT_T.hozir), n: 2, yon },
  { t: tr(HOLAT_T.javobsiz), n: 1, yon }
];
// Test ostidagi kichik varaq bo'lagi (javob topilgach; SABOQ 4)
const ruKop = (n, f) => { const a = Math.abs(n) % 100, b = a % 10; return a > 10 && a < 20 ? f[2] : b === 1 ? f[0] : b >= 2 && b <= 4 ? f[1] : f[2]; };
const MiniVaraq = ({ children }) => <div className="tv-mini">{children}</div>;

// ===== SCREEN 0 — KIRISH (QKirish; sof so'rovnoma J-026: uchala variantga bitta javob, ballsiz) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Ishonaman — o'zi aytgan", ru: 'Верю — он сам сказал' } },
  { id: 'b', label: { uz: 'Ishonmayman — hali gap', ru: 'Не верю — пока лишь слова' } },
  { id: 'c', label: { uz: 'Bilmayman — hali erta', ru: 'Не знаю — пока рано' } }
];
const HOOK_JAVOB = { uz: "Uchala fikr ham bo'lishi mumkin — oldindan bilib bo'lmaydi. Bugun Mentor bu gapni qanday tekshirganini ko'rasiz.", ru: 'Возможно любое из трёх мнений — заранее не узнать. Сегодня вы увидите, как Ментор проверил эти слова.' };
// Jonli dars: sinf ovozlari chizig'i — faqat variantlar soni, ism yo'q (KOD 9)
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
    <div className="tv-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={cxx('tv-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="tv-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>)}
    </div>
  );
};
const IlovaEkran = () => (
  <div className="tv-tel">
    <div className="tv-tel-bar ilova"><MJ /></div>
    <div className="tv-ilova">
      <span className="tv-ilova-y">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span>
      <div className="tv-oyin">
        <b>{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
        <span>{tr({ uz: 'Mahalla maydoni', ru: 'Поле в махалле' })}</span>
        <span className="tv-oyin-s"><i style={{ width: '80%' }} />{nb('8 / 10')}</span>
      </div>
    </div>
  </div>
);
const HookMaket = ({ tanlov, darhol }) => (
  <div className="tv-hook">
    <div className="tv-telj">
      <span className="tv-rol">{tashkilotchi(1)}</span>
      {tanlov ? <Telefon sarlavha={tr({ uz: 'Mentor', ru: 'Ментор' })} nuqta /> : <IlovaEkran />}
    </div>
    <div className={cxx('tv-bolak', tanlov && !darhol && 'yon')}>
      <span className="tv-bolak-h">{tr({ uz: 'Mentor misoli · 6-darsdagi suhbat yozuvi', ru: 'Пример Ментора · запись разговора с 6-го урока' })}</span>
      <b className="tv-bolak-kim">{tashkilotchi(1)}</b>
      <span className="tv-bolak-gap">«{nb(tr(MENTOR_SUHBAT1.gap))}»</span>
      <span className="tv-bolak-q"><b className="tv-hb ok">{tr({ uz: 'ha', ru: 'да' })}</b><b className="tv-bolak-n">{sonFmt(MENTOR_SUHBAT1.narx)}</b></span>
    </div>
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [darhol] = useState(storedAnswer !== undefined);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', HOOK_OPTS.findIndex(o => o.id === v), false, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('tv-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Kim haqiqatan <A>to'lashga tayyor?</A></>, ru: <>Кто действительно <A>готов платить?</A></> })}
          mentor={<Mentor>{tr({ uz: '6-darsda Mentor shu gapni yozib olgan edi. Siz uning gapiga ishonasizmi?', ru: 'На 6-м уроке Ментор записал эти слова. Вы верите его словам?' })}</Mentor>}
          maket={<HookMaket tanlov={picked} darhol={darhol} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={<>
            {picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB)}</p>}
            {isLive && (picked !== null || live.mode === 'mentor') && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.label))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        >
          <Ustoz satrlar={USTOZ.s0} />
        </QKirish>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; chap: menyu osti + varaq o'zi yuradi — ustun va qator nomlari haqiqiy mazmun, javoblar va sonlar yo'q — P-036, SABOQ 33) =====
const REJA = [
  { t: { uz: "Odamning o'zi yozgan javobini suhbatdagi gapdan ajratasiz", ru: 'Отличите ответ, который человек написал сам, от слов в разговоре' }, teg: { uz: 'yozma tasdiq', ru: 'письменное подтверждение' } },
  { t: { uz: 'Yozuvlarni uch savol bilan tekshirasiz', ru: 'Проверите записи тремя вопросами' }, teg: { uz: 'Mentor tekshiruvi', ru: 'проверка Ментора' } },
  { t: { uz: 'Tanishlaringizga bosimsiz xabar yozasiz', ru: 'Напишете знакомым сообщение без давления' }, teg: { uz: 'xabar', ru: 'сообщение' } },
  { t: { uz: 'Sherigingiz bilan yozuvlaringizni tekshirasiz', ru: 'Проверите свои записи с партнёром' }, teg: { uz: 'qabul · tuzatish', ru: 'принято · исправление' } }
];
const RejaVaraq = () => {
  const f = useYurish([250, 500, 700, 900, 1100, 1300, 1500, 1700]);
  const ustunlar = ['kim', 'holat', 'narx', 'nima', 'gap'];
  return (
    <Varaq sarlavha={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>} className="tv-reja">
      {f >= 1 && <Jadval ustunlar={ustunlar} qatorlar={MENTOR_JAVOBLAR.slice(0, Math.max(0, f - 1)).map((_, i) => ({ k: 'r' + i, kim: tashkilotchi(i + 1), uzuq: true }))} />}
    </Varaq>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun «olaman» degan gapni <A>tekshirishni o'rganasiz.</A></>, ru: <>Сегодня научитесь <A>проверять слова «возьму».</A></> })}
      mentor={<Mentor>{tr({ uz: "6-darsda narx haqida gaplashdingiz. Endi tanishlaringizdan javobni yozib berishni so'raysiz va yozuvlarni tekshirasiz.", ru: 'На 6-м уроке вы говорили о цене. Теперь попросите знакомых написать ответ и проверите записи.' })}</Mentor>}
      chapYorliq={tr({ uz: 'Mentor tekshiruvi: uchta yozma tasdiq', ru: 'Проверка Ментора: три письменных подтверждения' })}
      chap={<><p className="tv-kulrang">{tr({ uz: "Darsda — xabar va kelgan javoblar; qolgani uyda. Uchtaga yetmasa ham — halol natija.", ru: 'На уроке — сообщение и пришедшие ответы; остальное — дома. Даже если не наберётся трёх — честный результат.' })}</p><RejaVaraq /></>}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    >
      <Ustoz satrlar={USTOZ.s1} />
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — TUSHUNCHA (QTushuncha, markaziy: bashorat → 6 javob ketma-ket, uch tugma → javob pufagi varaq qatoriga uchadi → atama «yozma tasdiq» tug'iladi) =====
const S2_KALIT = ['tasdiq', 'hozir', 'tasdiq', 'tasdiq', 'hozir', 'javobsiz'];
const S2_TUGMA = [
  { k: 'tasdiq', t: { uz: 'Narx va nima uchun yozdi', ru: 'Написал цену и за что' } },
  { k: 'hozir', t: { uz: "Hozir yo'q", ru: 'Сейчас нет' } },
  { k: 'javobsiz', t: { uz: "Javob yo'q", ru: 'Нет ответа' } }
];
const S2_XATO = {
  oxiri: { uz: "Xabarning oxirini o'qing: u nima qiladi?", ru: 'Прочитайте конец сообщения: что он сделает?' },
  ikkinchi: { uz: 'Xabarning ikkinchi gapiga qarang.', ru: 'Посмотрите на вторую фразу сообщения.' },
  narxBormi: { uz: 'Xabarida narx va nima uchun bormi?', ru: 'В его сообщении есть цена и за что?' },
  javobBerdi: { uz: "U javob berdi — xabari chatda turibdi.", ru: 'Он ответил — сообщение есть в чате.' },
  xabarBormi: { uz: 'Chatda uning xabari bormi?', ru: 'Есть ли в чате его сообщение?' }
};
const s2XatoK = (i, k) => {
  if (i === 5) return 'xabarBormi';
  if (k === 'javobsiz' && (i === 1 || i === 2 || i === 4)) return 'javobBerdi';
  if (i === 2 && k === 'hozir') return 'ikkinchi';
  if ((i === 1 || i === 4) && k === 'tasdiq') return 'narxBormi';
  return 'oxiri';
};
const S2_TAXMIN = [{ k: '1', t: '1' }, { k: '3', t: '3' }, { k: '5', t: '5' }];
const S2_SAVOL = { uz: 'Oltitadan nechtasi narx va nima uchunini yozadi?', ru: 'Сколько из шести напишут цену и за что?' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = storedAnswer !== undefined;
  const [boshAvval] = useState(storedAnswer !== undefined);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [i, setI] = useState(avval ? 6 : 0);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(0);
  const [izoh, setIzoh] = useState(null);
  const [yangiQ, setYangiQ] = useYangi(1100);
  const xatoRef = useRef(false);
  const [uch, qatlam] = useUchish();
  const jRef = useRef(null), xRef = useRef(null), rRef = useRef([]);
  const done = i >= 6;
  const tugadi = useTugadi(done, 1500, avval);
  const ipucha = useIpucha(!!taxmin && !done, i);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: !xatoRef.current, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!izoh) return undefined; const t = setTimeout(() => setIzoh(null), 3200); return () => clearTimeout(t); }, [izoh]);
  const bos = (k) => {
    if (!taxmin || done) return;
    if (k !== S2_KALIT[i]) { setXato({ i, k: s2XatoK(i, k) }); setSilk(s => s + 1); xatoRef.current = true; if (achMiss) achMiss.miss(screen); return; }
    setXato(null);
    const j = MENTOR_JAVOBLAR[i];
    const lbl = k === 'tasdiq' ? `${sonFmt(j.narx)} · ${tr(DOIMIY)}` : tr(HOLAT_T[k]);
    uch(jRef.current || xRef.current, rRef.current[i], lbl);
    setIzoh(i === 0 ? 'birinchi' : i === 2 ? 'qimmat' : null);
    setYangiQ(i); setI(i + 1);
  };
  const tx = S2_TAXMIN.find(x => x.k === taxmin);
  const sanoq = (h) => MENTOR_JAVOBLAR.slice(0, i).filter(j => j.holat === h).length;
  const qatorlar = mentorQatorlar(done).map((q, n) => (n < i ? { ...q, yangi: yangiQ === n } : { k: q.k, kim: q.kim, uzuq: true, joriy: n === i, err: xato && xato.i === n }));
  const varaq = (
    <Varaq sarlavha={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>} muhr={false} pro={tr(PRO_QATOR)}
      hisob={done ? mentorHisob(false) : [
        { t: tr(HOLAT_T.tasdiq0), n: sanoq('tasdiq'), ok: true },
        { t: tr(HOLAT_T.hozir), n: sanoq('hozir') },
        { t: tr(HOLAT_T.javobsiz), n: sanoq('javobsiz') }
      ]}
      ost={done && <p className="tv-kulrang tv-halol">{tr(MENTOR_HALOL)}</p>}>
      <Jadval ustunlar={['kim', 'holat', 'narx', 'nima', 'gap']} qatorlar={qatorlar} rRef={rRef} />
    </Varaq>
  );
  const j = MENTOR_JAVOBLAR[Math.min(i, 5)];
  const katak = (
    <div className="tv-katakcha" aria-hidden="true">
      <span>{tr({ uz: '6 javob', ru: '6 ответов' })}</span>
      {MENTOR_JAVOBLAR.map((_, n) => <i key={n} className={cxx(n < i && 'oldi', n === i && 'joriy')}>{n + 1}</i>)}
    </div>
  );
  const telKol = (
    <div className="tv-tkol">
      <Telefon sarlavha={tashkilotchi(Math.min(i, 5) + 1)} xabar={tr(MENTOR_XABAR)} javob={j.gap ? tr(j.gap) : null} javobKey={'j' + i} javobErr={xato && xato.i === i} jRef={jRef} xRef={xRef}
        ust={i === 0 && <p className="tv-kulrang tv-ust">{tr({ uz: "6-darsda Mentor yozib olgan: «O'zi e'lon qilsa — 15 000 ga olaman.»", ru: 'На 6-м уроке Ментор записал: «Если будет объявлять само — возьму за 15 000.»' })}</p>} />
    </div>
  );
  const tugmalar = (
    <div className="tv-harakat">
      <div key={silk} className={cxx('tv-tugmalar', taxmin && 'tv-chorla', silk > 0 && 'silk')}>
        {S2_TUGMA.map(b => <QChip key={b.k} className="tv-tugma" disabled={!taxmin} onClick={() => bos(b.k)}>{tr(b.t)}</QChip>)}
      </div>
      {xato && <QXato>{tr(S2_XATO[xato.k])}</QXato>}
      {izoh && !xato && <QIzoh>{izoh === 'birinchi'
        ? tr({ uz: "6-darsdagi gapni Mentor yozgan edi — bu xabarni tashkilotchining o'zi yozdi.", ru: 'Слова с 6-го урока записал Ментор — это сообщение организатор написал сам.' })
        : tr({ uz: "«Qimmat» dedi, lekin boshqa narxda to'lashini yozdi.", ru: 'Сказал «дорого», но написал, что заплатит по другой цене.' })}</QIzoh>}
      {ipucha && !xato && <p className="tv-ipucha fade-step">{tr({ uz: "Xabarda narx bormi, «hozir yo'q» bormi yoki xabar umuman yo'qmi — qarang.", ru: 'Посмотрите: есть в сообщении цена, есть «сейчас нет» или сообщения нет вовсе.' })}</p>}
    </div>
  );
  const navL = !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : !done ? { uz: `Javoblarni ajrating (${i}/6)`, ru: `Разберите ответы (${i}/6)` } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · yozma tasdiq', ru: 'Понятие · письменное подтверждение' })} screen={screen} scrollSignal={i + (taxmin ? 1 : 0)} natijaSignal={tugadi && !boshAvval ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navL)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Kim narxini va <A>nimaga to'lashini yozdi?</A></>, ru: <>Кто написал цену и <A>за что заплатит?</A></> })}
        mentor={<Mentor>{tr({ uz: 'Mentor tashkilotchilarga bir xil xabar yubordi — har javobga mos tugmani bosing.', ru: 'Ментор отправил организаторам одинаковое сообщение — нажимайте подходящую кнопку для каждого ответа.' })}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />
          : !done && <BashoratQ savol={tr(S2_SAVOL)} javob={tx ? tx.t : ''} />}
        vizual={tugadi ? <div className="tv-fokus">{varaq}</div> : <div className="tv-s2">{!done && <div className="tv-s2-ust">{katak}{tugmalar}</div>}<div className="tv-ikki">{telKol}<div className="tv-o">{varaq}</div></div></div>}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={taxmin === '3'} haqiqat="3" />}
          matn={tr({ uz: "Bu darsda yozma tasdiq — odamning o'zi yozgan javobi: narx va nima uchun to'lashi bilan.", ru: 'На этом уроке письменное подтверждение — ответ, который человек написал сам: с ценой и тем, за что он заплатит.' })}
          izoh={tr({ uz: "Yozma tasdiq — odamning hozirgi niyati, to'lov emas: Mentor hech kimdan pul so'ramadi.", ru: 'Письменное подтверждение — нынешнее намерение человека, а не оплата: Ментор ни у кого не просил денег.' })} />}
      >
        <Ustoz satrlar={USTOZ.s2} />
      </QTushuncha>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ B, INLINE_KEYS.s3 = 1; ikkinchi misol — kitob almashish ilovasi; savol ustida yorliq yo'q — SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · yozma tasdiq', ru: 'Проверка · письменное подтверждение' })}
    questionText="Kitob almashish ilovangiz uchun qaysi biri yozma tasdiq?"
    question={tr({ uz: <h2 className="title h-ask">Kitob almashish ilovangiz uchun <A>qaysi biri yozma tasdiq?</A></h2>, ru: <h2 className="title h-ask">Что из этого — <A>письменное подтверждение</A> для вашего приложения обмена книгами?</h2> })}
    options={[
      { uz: 'Tanishingiz chatda faqat «ha, kerak» deb yozdi', ru: 'Знакомый написал в чате только «да, нужно»' },
      { uz: "Tanishingiz narx va nima uchun to'lashini yozdi", ru: 'Знакомый написал цену и за что заплатит' },
      { uz: "Tanishingiz 5 000 so'mni oldindan o'tkazib berdi", ru: 'Знакомый заранее перевёл 5 000 сумов' },
      { uz: "Uning og'zaki gapini narxi bilan o'zingiz yozdingiz", ru: 'Вы сами записали его устные слова с ценой' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Narx va nima uchun — odamning o'zi yozgan.", ru: 'Цену и «за что» человек написал сам.' }}
    explainWrong={{
      0: { uz: 'Yozdi — lekin narx qani?', ru: 'Написал — но где цена?' },
      2: { uz: "Bu pul — yozma tasdiqda pul olinmaydi.", ru: 'Это деньги — при письменном подтверждении денег не берут.' },
      3: { uz: "Gapni kim yozdi — u odammi yoki sizmi?", ru: 'Кто написал слова — этот человек или вы?' },
      default: { uz: "Yozma tasdiqda nima bo'lishi kerak edi?", ru: 'Что должно быть в письменном подтверждении?' }
    }}
    vizual={<MiniVaraq>
      <span className="tv-mini-q"><b className="tv-mini-k ok">{tr(USTUN_T.narx)}</b><b className="tv-mini-k ok">{tr(USTUN_T.nima)}</b></span>
      <span className="tv-mini-y">{tr({ uz: "kim yozgan: o'zi", ru: 'кто написал: сам' })}</span>
    </MiniVaraq>} />
);

// ===== SCREEN 4 — MENTOR TEKSHIRUVI (QTushuncha; ketma-ket 3 savol, dalil varaqdan bosib topiladi — 12-Modul 10-dars 4-ekran shakli) =====
const S4_TAXMIN = [
  { k: 'tuz', t: { uz: 'Tuzatish: oltidan uchtasi kam', ru: 'Исправление: трёх из шести мало' } },
  { k: 'bir', t: { uz: 'Bitta tuzatishdan keyin qabul', ru: 'Принято после одного исправления' } },
  { k: 'qabul', t: { uz: 'Qabul', ru: 'Принято' } }
];
const S4_SAVOL = { uz: '6 dan 3 yozma tasdiq — Mentor tekshiruvi nima deydi?', ru: '3 подтверждения из 6 — что скажет проверка Ментора?' };
const S4_ZONA = [['kim', 'pro'], ['narx', 'nima'], ['gap', 'xabar']];
const S4_XATO = {
  kim: { uz: 'Bu katak kim yozganini aytadimi?', ru: 'Эта клетка говорит, кто написал?' },
  narx: { uz: 'Narx va nima uchun qaysi ustunda?', ru: 'В каком столбце цена и «за что»?' },
  gap: { uz: "Odamning o'z so'zi qayerda turibdi?", ru: 'Где стоят собственные слова человека?' },
  umumiy: { uz: "«Nimaga qarang» qatorini qayta o'qing.", ru: 'Перечитайте строку «На что смотреть».' }
};
const s4XatoK = (j, z) => (j === 0 ? 'kim' : j === 1 ? ((z === 'kim' || z === 'gap') ? 'narx' : 'umumiy') : ((z === 'narx' || z === 'nima') ? 'gap' : 'umumiy'));
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = storedAnswer !== undefined;
  const [boshAvval] = useState(storedAnswer !== undefined);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [j, setJ] = useState(avval ? 3 : 0);
  const [yon, setYon] = useState(() => new Set(avval ? ['kim', 'pro', 'narx', 'nima', 'gap', 'xabar'] : []));
  const [silk, setSilk] = useState(null);
  const [xato, setXato] = useState(null);
  const xatoRef = useRef(false);
  const kartaRef = useRef(null);
  const [uch, qatlam] = useUchish();
  const done = j >= 3;
  const tugadi = useTugadi(done, 1600, avval);
  const ipucha = useIpucha(!!taxmin && !done, j);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: !xatoRef.current, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!silk) return undefined; const t = setTimeout(() => setSilk(null), 500); return () => clearTimeout(t); }, [silk]);
  const bos = (z, el) => {
    if (!taxmin || done) return;
    if (!S4_ZONA[j].includes(z)) { setXato(s4XatoK(j, z)); setSilk(z); xatoRef.current = true; if (achMiss) achMiss.miss(screen); return; }
    setXato(null);
    setYon(s => new Set([...s, ...S4_ZONA[j]]));
    uch(el, kartaRef.current, '✓ ' + tr({ uz: 'Ha', ru: 'Да' }));
    setJ(j + 1);
  };
  const tx = S4_TAXMIN.find(x => x.k === taxmin);
  const zona = { onBos: bos, yon, chorla: new Set(taxmin && !done ? S4_ZONA[j] : []), silk, yopiq: !taxmin || done };
  const varaq = (
    <Varaq sarlavha={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>} zona={tugadi ? null : zona}
      muhr={done ? { k: 'q', tur: 'ok', t: tr({ uz: 'Qabul', ru: 'Принято' }) } : null}
      pro={tr(PRO_QATOR)} xabarQ={tr(MENTOR_XABAR)} hisob={mentorHisob(yon.has('gap'))}
      ost={done && <>
        <p className="tv-kulrang">{tr({ uz: 'Qabul — bugungi yozuvlar uchun.', ru: 'Принято — для сегодняшних записей.' })}</p>
        <span className="tv-tekyorliq fade-step">{tr({ uz: 'Mentor tekshiruvi', ru: 'Проверка Ментора' })}</span>
      </>}>
      <Jadval ustunlar={['kim', 'holat', 'narx', 'nima', 'gap']} qatorlar={mentorQatorlar(true)} zona={tugadi ? null : zona} />
    </Varaq>
  );
  const s = TEKSHIRUV_SAVOLLAR[Math.min(j, 2)];
  const karta = !done && (
    <div className="tv-skol">
      {TEKSHIRUV_SAVOLLAR.slice(0, j).map((q, n) => <div key={n} className="tv-sq-done fade-step"><b>✓</b><span>{tr(q.savol)}</span><em>{tr({ uz: 'Ha', ru: 'Да' })}</em></div>)}
      <div ref={kartaRef} key={j} className={cxx('tv-savol', !taxmin && 'yopiq')}>
        <span className="tv-savol-n">{j + 1} / 3</span>
        <b className="tv-savol-s">{tr(s.savol)}</b>
        <span className="tv-savol-q"><b>{tr(NIMAGA)}</b> {tr(s.q4)}</span>
        <span className="tv-kulrang">{tr({ uz: 'Varaqdan bosib toping', ru: 'Найдите и нажмите на листе' })}</span>
      </div>
      <p className="tv-kulrang">{tr({ uz: 'Uchtaga yetmaslik — tuzatish sababi emas.', ru: 'Не набралось трёх — не причина для исправления.' })}</p>
      {xato && <QXato>{tr(S4_XATO[xato])}</QXato>}
      {ipucha && !xato && <p className="tv-ipucha fade-step"><span className="tv-ip-d">{tr({ uz: "O'ngdagi savolni o'qing va javobini chapdagi varaqdan bosing.", ru: 'Прочитайте вопрос справа и нажмите ответ на листе слева.' })}</span><span className="tv-ip-m">{tr({ uz: "Pastdagi savolni o'qing va javobini yuqoridagi varaqdan bosing.", ru: 'Прочитайте вопрос ниже и нажмите ответ на листе выше.' })}</span></p>}
    </div>
  );
  const navL = !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : !done ? { uz: `Savollarni bering (${j}/3)`, ru: `Задайте вопросы (${j}/3)` } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Mentor tekshiruvi', ru: 'Понятие · проверка Ментора' })} screen={screen} scrollSignal={j + (taxmin ? 1 : 0)} natijaSignal={tugadi && !boshAvval ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navL)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Yozma tasdiqlarni <A>qaysi savollar bilan tekshirasiz?</A></>, ru: <>Какими вопросами <A>проверяют подтверждения?</A></> })}
        mentor={<Mentor>{tr({ uz: "Har savolning javobini Mentor varag'idan bosib toping.", ru: 'Найдите ответ на каждый вопрос на листе Ментора и нажмите его.' })}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />
          : <>{!done && <BashoratQ savol={tr(S4_SAVOL)} javob={tx ? tr(tx.t) : ''} />}{!done && <div className="tv-qism"><QQadamlar qadamlar={TEKSHIRUV_SAVOLLAR.map(q => tr(q.savol))} joriy={j} /></div>}</>}
        vizual={tugadi ? <div className="tv-fokus">{varaq}</div> : <div className="tv-ikki s4"><div className="tv-o">{varaq}</div>{karta}</div>}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={taxmin === 'qabul'} haqiqat={tr({ uz: 'qabul', ru: 'принято' })} />}
          matn={tr({ uz: "Bu misolda 6 dan 3 yozma tasdiq — qabul: tekshiruv halollikni ko'radi, sonni emas.", ru: 'В этом примере 3 подтверждения из 6 — принято: проверка смотрит на честность, а не на число.' })}
          izoh={tr({ uz: '12-Modulda hisobotni shunday tekshirgansiz — bugun uch savol yozma tasdiqlar uchun.', ru: 'В 12-м модуле вы так проверяли отчёт — сегодня три вопроса для письменных подтверждений.' })} />}
      >
        <Ustoz satrlar={USTOZ.s4} />
      </QTushuncha>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen → QTest; ✔ D, INLINE_KEYS.s5 = 3; ikkinchi misol — sherikning yozuvi) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · Mentor tekshiruvi', ru: 'Проверка · проверка Ментора' })}
    questionText="Sherigingiz «Ha, olaman» xabarini yozma tasdiq deb yozdi. Tekshiruv nima deydi?"
    question={tr({ uz: <h2 className="title h-ask">Sherigingiz «Ha, olaman» xabarini yozma tasdiq deb yozdi. <A>Tekshiruv nima deydi?</A></h2>, ru: <h2 className="title h-ask">Партнёр записал сообщение «Да, возьму» как письменное подтверждение. <A>Что скажет проверка?</A></h2> })}
    options={[
      { uz: "Qabul: odam «olaman» deb o'zi yozgan", ru: 'Принято: человек сам написал «возьму»' },
      { uz: 'Tuzatish: yozma tasdiq uchtaga yetmagan', ru: 'Исправление: подтверждений меньше трёх' },
      { uz: "Qabul: narxni sherik o'zi qo'shib qo'ysa", ru: 'Принято, если партнёр сам допишет цену' },
      { uz: "Tuzatish: narx ham, nima uchun ham yo'q", ru: 'Исправление: нет ни цены, ни «за что»' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Narxsiz «ha» hali yozma tasdiq emas.', ru: '«Да» без цены — ещё не письменное подтверждение.' }}
    explainWrong={{
      0: { uz: "O'zi yozgani to'g'ri — lekin unda narx bormi?", ru: 'Написал сам — верно, но есть ли там цена?' },
      1: { uz: 'Uchtaga yetmaslik tuzatish sababimi?', ru: 'Разве «меньше трёх» — причина для исправления?' },
      2: { uz: "Narxni kim yozishi kerak edi — sherikmi?", ru: 'Кто должен был написать цену — партнёр?' },
      default: { uz: 'Ikkinchi savolni eslang: yozuvda nima bo\'lishi kerak?', ru: 'Вспомните второй вопрос: что должно быть в записи?' }
    }}
    vizual={<MiniVaraq>
      <span className="tv-mini-muhr">{tr({ uz: 'Tuzatish: narx va nima uchun', ru: 'Исправление: цена и «за что»' })}</span>
      <span className="tv-mini-q"><b>{tr({ uz: 'sherik yozuvi', ru: 'запись партнёра' })}</b><span>«{tr({ uz: 'Ha, olaman', ru: 'Да, возьму' })}»</span><span>{tr(USTUN_T.narx)} —</span><span>{tr(USTUN_T.nima)} —</span></span>
    </MiniVaraq>} />
);

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen → QTest; ✔ A, INLINE_KEYS.s8 = 0; scope final) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Ikki tanishingiz yozma tasdiq berdi, biri «hozir yo'q» dedi. Endi nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Ikki tanishingiz yozma tasdiq berdi, biri «hozir yo'q» dedi. <A>Endi nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">Два знакомых дали письменное подтверждение, один сказал «сейчас нет». <A>Что вы сделаете теперь?</A></h2> })}
    options={[
      { uz: 'Uchalasini yozib, keyingi qadamni yozaman', ru: 'Запишу всех троих и напишу следующий шаг' },
      { uz: "«Hozir yo'q» deganga har kuni qayta yozaman", ru: 'Буду каждый день писать сказавшему «сейчас нет»' },
      { uz: 'Uchinchisini ham yozma tasdiq deb yozaman', ru: 'Третьего тоже запишу как подтверждение' },
      { uz: "Ikkalasiga «mashq to'lov» havolasini beraman", ru: 'Дам обоим ссылку на «учебную оплату»' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Yozuv halol qoladi; uchtaga yetmasa — keyingi qadam.', ru: 'Запись остаётся честной; не набралось трёх — следующий шаг.' }}
    explainWrong={{
      1: { uz: "Bu bosim emasmi? «Hozir yo'q» ham natija.", ru: 'Разве это не давление? «Сейчас нет» — тоже результат.' },
      2: { uz: 'U narx yozdimi? Uning xabari nima edi?', ru: 'Он написал цену? Каким было его сообщение?' },
      3: { uz: "Yozma tasdiq — to'lov emas: havola berilmaydi.", ru: 'Письменное подтверждение — не оплата: ссылку не дают.' },
      default: { uz: 'Uchtaga yetmasa nima yoziladi — eslang.', ru: 'Вспомните, что пишут, если не набралось трёх.' }
    }}
    vizual={<MiniVaraq>
      <span className="tv-mini-q"><span className="tv-h ok">{tr(HOLAT_T.tasdiq)} · <b>2</b></span><span className="tv-h">{tr(HOLAT_T.hozir)} · <b>1</b></span></span>
      <span className="tv-mini-kq">{tr({ uz: 'Keyingi qadam', ru: 'Следующий шаг' })}</span>
    </MiniVaraq>} />
);

// ===== 6–7-EKRAN TEKSHIRUVLARI (MD 6, 7-ekran jadvallari; PM-108 — node bilan sinaladi: scratchpad 09-qurish/t108.mjs) =====
// TEKSHIRUV-BOSHI
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normS = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const AKKAUNT_RE = /@|t\.me\/|\+\s*998/;
const TELEFON_RE = /(^|[^\d])\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}(?!\d)/;
const RAQAM7_RE = /\d{7,}/;
const HAVOLA_RE = /https?:|www\.|t\.me|\.uz(?![a-z])|\.com(?![a-z])|mashq to'lov|учебн\S* оплат/;
const XULOSA1_RE = /qiziqdi|qiziqmadi|yoqdi|yoqmadi|rozi bo'ldi|ko'ndi|заинтересовал|понравил|согласил|уговорил/;
const XULOSA3_RE = /rozi bo'ldi|qiziqdi|ko'ndi|yoqdi|согласил|заинтересовал|уговорил|понравил/;
const SOTISH_RE = /arzon|atigi|chegirma|tezroq|(^|[^a-z'])oling|olmasangiz|hamma oldi|o'ylab ko'ring|дешев|всего за|скидк|быстрее|берите|не возьмёте|все купили|подумайте/;
const BOSIM_RE = /har kuni|qayta-qayta|majbur|yozdiraman|каждый день|снова и снова|заставл/;
const rolBlok = (v) => AKKAUNT_RE.test(v) || TELEFON_RE.test(v) || RAQAM7_RE.test(String(v).replace(/[\s-]/g, ''));
const telBlok = (v) => AKKAUNT_RE.test(v) || TELEFON_RE.test(v);
const raqamlar = (s) => String(s || '').replace(/[\s .,]/g, '');
// 1-qism · uy suhbati: { kim, gap, javob }
function s6Q1(f) {
  const kim = String(f.kim || '').trim(), gap = String(f.gap || '').trim();
  if (!kim) return { blok: 'kimBosh' };
  if (rolBlok(kim)) return { blok: 'rol' };
  if (!gap && f.javob !== 'javobsiz') return { blok: 'gapBosh1' };
  if (!f.javob) return { blok: 'belgi' };
  if (XULOSA1_RE.test(normS(gap))) return { yumshoq: 'xulosa1' };
  return {};
}
// 2-qism · xabar: { nima, narx }
function s6Q2(f) {
  const nima = normS(f.nima);
  if (!nima) return { blok: 'nimaBosh' };
  if (!narxSon(f.narx)) return { blok: 'narxBosh' };
  if (HAVOLA_RE.test(nima)) return { blok: 'havola' };
  if (SOTISH_RE.test(nima)) return { yumshoq: 'sotish' };
  return {};
}
// 3-qism · javob: { holat, gap, narx, nima }
function s6Q3(f) {
  const gap = String(f.gap || '').trim();
  if (f.holat === 'aniq') {
    if (!gap) return { blok: 'gapBosh3' };
    if (telBlok(gap)) return { blok: 'tel3' };
    return {};
  }
  if (f.holat !== 'tasdiq') return {};
  if (!gap) return { blok: 'gapBosh3' };
  if (!narxSon(f.narx)) return { blok: 'narxBosh3' };
  if (!String(f.nima || '').trim()) return { blok: 'nimaBosh3' };
  if (telBlok(gap)) return { blok: 'tel3' };
  if (RAQAM7_RE.test(gap)) return { yumshoq: 'raqam7' };
  if (!raqamlar(gap).includes(String(narxSon(f.narx)))) return { yumshoq: 'narxYoq' };
  if (XULOSA3_RE.test(normS(gap))) return { yumshoq: 'xulosa3' };
  return {};
}
// 7-ekran 4-qism · keyingi qadam
function s7Kq(v) {
  if (!String(v || '').trim()) return { blok: 'kqBosh' };
  if (BOSIM_RE.test(normS(v))) return { yumshoq: 'bosim' };
  return {};
}
// TEKSHIRUV-OXIRI
const TX = {
  kimBosh: { uz: 'Kim edi — rolini yozing.', ru: 'Кто это был — напишите роль.' },
  rol: { uz: 'Rol yozing — ism, telefon va akkaunt nomi emas.', ru: 'Напишите роль — не имя, телефон или аккаунт.' },
  gapBosh1: { uz: "U nima dedi — qog'ozdagidek yozing.", ru: 'Что он сказал — напишите как на бумаге.' },
  belgi: { uz: "Belgini tanlang: ha, qimmat, yo'q yoki javob yo'q.", ru: 'Выберите отметку: да, дорого, нет или нет ответа.' },
  xulosa1: { uz: "Bu xulosaga o'xshaydi — gapini so'zma-so'z yozing.", ru: 'Похоже на вывод — запишите его слова дословно.' },
  nimaBosh: { uz: "Odam nima uchun to'lashini yozing.", ru: 'Напишите, за что человек заплатит.' },
  narxBosh: { uz: 'Narxni yozing — 4-darsdagi taxminingiz.', ru: 'Напишите цену — ваше предположение с 4-го урока.' },
  havola: { uz: "Xabarga havola qo'yilmaydi — pul so'ralmaydi.", ru: 'Ссылку в сообщение не ставят — денег не просят.' },
  sotish: { uz: "Bu sotish gapiga o'xshaydi — nima uchun ekanini yozing.", ru: 'Похоже на продающую фразу — напишите, за что именно.' },
  gapBosh3: { uz: "U nima deb yozdi — so'zma-so'z ko'chiring.", ru: 'Что он написал — перепишите дословно.' },
  narxBosh3: { uz: "Narx yozilmagan javob — hali yozma tasdiq emas.", ru: 'Ответ без цены — ещё не письменное подтверждение.' },
  nimaBosh3: { uz: "Nima uchun to'lashini uning xabaridan yozing.", ru: 'Напишите из его сообщения, за что он заплатит.' },
  tel3: { uz: 'Yozuvga telefon va akkaunt nomi yozilmaydi.', ru: 'Телефон и аккаунт в запись не пишут.' },
  raqam7: { uz: 'Bu telefon raqamimi yoki narxmi? Telefon yozilmaydi.', ru: 'Это номер телефона или цена? Телефон не пишут.' },
  narxYoq: { uz: "Bu narx uning xabarida yo'q — qayta qarang.", ru: 'Этой цены нет в его сообщении — посмотрите ещё раз.' },
  xulosa3: { uz: "Bu xulosaga o'xshaydi — xabarini so'zma-so'z ko'chiring.", ru: 'Похоже на вывод — перепишите сообщение дословно.' },
  kqBosh: { uz: 'Bitta ish yozing — nima qilasiz?', ru: 'Напишите одно дело — что сделаете?' },
  bosim: { uz: "Bosim va o'zingiz yozgan «tasdiq» — yo'q.", ru: 'Без давления и без «подтверждения», написанного вами.' }
};
const YUMSHOQ_YORLIQ = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — нажмите «Сохранить» ещё раз.' };

// --- Saqlash: pm-m11d9-tasdiq (MD A-11 shartnomasi; o'zgarmas shart: soralgan = tasdiqlar + aniqlashtirish + hozirYoq + javobsiz) ---
const tasdiqHisob = (st) => {
  const yub = (st.odamlar || []).filter(o => o.yub);
  const tasdiqlar = [];
  let aniq = 0, hozir = 0, javobsiz = 0;
  yub.forEach(o => {
    const v = (st.javob || {})[o.id];
    if (v && v.saqlandi && v.holat === 'tasdiq') tasdiqlar.push({ id: v.tid, kim: o.kim, narx: narxSon(v.narx), nima: String(v.nima || '').trim(), gap: String(v.gap || '').trim(), oldingiGap: v.oldingiGap || null, qachon: v.qachon || bugun(), manba: v.manba === 'qogoz' ? 'qogoz' : 'chat', hisobga: v.hisobga !== false });
    else if (v && v.saqlandi && v.holat === 'aniq') aniq += 1;
    else if (v && v.saqlandi && v.holat === 'hozir') hozir += 1;
    else javobsiz += 1;
  });
  return { soralgan: yub.length, tasdiqlar, aniqlashtirish: aniq, hozirYoq: hozir, javobsiz };
};
const xabarMatn = (x) => {
  const nima = String(x.nima || '').trim(), narx = narxSon(x.narx), davr = narxSon(x.davr);
  const bosh = davr
    ? tr({ uz: `"${nima}" ${davr} kunga ${sonFmt(narx)} so'm bo'lsa, to'lashga tayyormisiz?`, ru: `«${nima}» на ${davr} дн. за ${sonFmt(narx)} сумов — готовы платить?` })
    : tr({ uz: `"${nima}" ${sonFmt(narx)} so'm bo'lsa, to'lashga tayyormisiz?`, ru: `«${nima}» за ${sonFmt(narx)} сумов — готовы платить?` });
  return bosh + ' ' + tr({ uz: "Tayyor bo'lsangiz, bir gap yozib bering: qaysi narxda va nima uchun to'laysiz.", ru: 'Если готовы, напишите одну фразу: по какой цене и за что заплатите.' }) + ' ' + tr(XABAR_QATOR);
};
const tasdiqYoz = (st, qosh = {}) => {
  const old = tasdiqOl() || {};
  const h = tasdiqHisob(st);
  if (h.soralgan !== h.tasdiqlar.length + h.aniqlashtirish + h.hozirYoq + h.javobsiz) return null;
  const ozgardi = JSON.stringify(old.tasdiqlar || []) !== JSON.stringify(h.tasdiqlar);
  const d = { ...h, xabar: st.xabarSaqlandi ? xabarMatn(st.xabar || {}) : null, tekshiruv: ozgardi ? null : (old.tekshiruv ?? null), tuzatishSabab: ozgardi ? null : (old.tuzatishSabab ?? null), keyingiQadam: old.keyingiQadam ?? null, ...qosh, savedAt: Date.now() };
  lsY(TASDIQ_KEY, d);
  return d;
};
const birlashtir = (eski) => {
  const r = rolOdamlar();
  const ids = new Set(eski.map(o => o.id));
  return [...eski.map(o => { const y = r.find(x => x.id === o.id); return y ? { ...o, kim: y.kim } : o; }), ...r.filter(x => !ids.has(x.id))];
};
const realSuhbatlar = () => suhbatOl().suhbatlar.filter(s => s && s.tur === 'real');
// Kimga yubordingiz? — real suhbatlardagi rollar (bir xil rol bo'lsa «(1)», «(2)»)
const rolOdamlar = () => {
  const r = realSuhbatlar();
  const son = {};
  r.forEach(s => { const k = String(s.kim || '').trim(); son[k] = (son[k] || 0) + 1; });
  const sana = {};
  return r.filter(s => String(s.kim || '').trim()).map(s => {
    const k = String(s.kim).trim();
    sana[k] = (sana[k] || 0) + 1;
    return { id: 'o-' + s.id, kim: son[k] > 1 ? `${k} (${sana[k]})` : k, yub: false };
  });
};

// --- Forma bo'laklari: yorliq input ichida (E 43) ---
const Kirit = ({ n, value, onChange, ph, max, err, halqa, son, tur, kRef }) => (
  <label className={cxx('tv-kirit', err && 'err', halqa && 'halqa')}>
    {n && <i>{n}</i>}
    {tur === 'date' && <span className="tv-kirit-y">{ph}</span>}
    <input ref={kRef} type={tur || 'text'} inputMode={son ? 'numeric' : undefined} value={value ?? ''} maxLength={max} placeholder={ph} aria-label={ph} onChange={(e) => onChange(son ? e.target.value.replace(/[^\d\s]/g, '') : e.target.value)} />
  </label>
);
const Matn = ({ n, value, onChange, ph, max, err, halqa }) => (
  <label className={cxx('tv-kirit', 'matn', err && 'err', halqa && 'halqa')}>
    {n && <i>{n}</i>}
    <textarea rows={2} value={value ?? ''} maxLength={max} placeholder={ph} aria-label={ph} onChange={(e) => onChange(e.target.value)} />
  </label>
);
const YordamBtn = ({ ochiq, onClick }) => <QChip className="tv-yordam-b" holat={ochiq ? 'on' : undefined} onClick={onClick}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QChip>;
const Yordam = ({ satrlar }) => <div className="tv-yordam fade-step">{satrlar.map((s, i) => <p key={i}>{tr(s)}</p>)}</div>;
const XatoQ = ({ x }) => (x ? <>{<QXato>{tr(TX[x.k])}</QXato>}{x.yumshoq && <p className="tv-kulrang">{tr(YUMSHOQ_YORLIQ)}</p>}</> : null);
const BELGI1 = [
  { k: 'ha', t: { uz: 'ha', ru: 'да' } }, { k: 'qimmat', t: { uz: 'qimmat', ru: 'дорого' } },
  { k: 'yoq', t: { uz: "yo'q", ru: 'нет' } }, { k: 'javobsiz', t: { uz: "javob yo'q", ru: 'нет ответа' } }
];
const HOLAT3 = [
  { k: 'tasdiq', t: { uz: 'Yozma tasdiq', ru: 'Письменное подтверждение' } },
  { k: 'aniq', t: { uz: 'Aniqlashtirish kerak', ru: 'Нужно уточнить' } },
  { k: 'hozir', t: { uz: "Hozir yo'q", ru: 'Сейчас нет' } },
  { k: 'javobsiz', t: { uz: "Javob yo'q", ru: 'Нет ответа' } }
];
const S6_QISM = [{ uz: 'Suhbatlar', ru: 'Разговоры' }, { uz: 'Xabar', ru: 'Сообщение' }, { uz: 'Javoblar', ru: 'Ответы' }];
const S6_YORDAM1 = [
  { uz: "Rol — munosabati bilan: masalan, «tashkilotchi (mahalla guruhidagi tanish)». Gap — qog'ozda qanday yozgan bo'lsangiz, shunday; o'zgartirmang va qisqartirmang.", ru: 'Роль — с отношением к вам: например, «организатор (знакомый из группы махалли)». Слова — так, как записали на бумаге; не меняйте и не сокращайте.' },
  { uz: "6-darsdagi «to'laydigan odam» — bu darsda to'lovchi: mahsulotingizda pul to'laydigan foydalanuvchi.", ru: '«Тот, кто платит» с 6-го урока — на этом уроке плательщик: пользователь, который платит деньги в вашем продукте.' }
];
const S6_YORDAM2 = [
  { uz: "Mentor misolida xabar: «\"Doimiy o'yin\" 30 kunga 15 000 so'm bo'lsa, to'lashga tayyormisiz? Tayyor bo'lsangiz, bir gap yozib bering: qaysi narxda va nima uchun to'laysiz. Bu to'lov emas — pul so'ramayman. Yozmasangiz ham bo'ladi.»", ru: 'Сообщение в примере Ментора: «„Постоянная игра“ на 30 дней за 15 000 сумов — готовы платить? Если готовы, напишите одну фразу: по какой цене и за что заплатите. Это не оплата — денег не прошу. Можете не писать.»' },
  { uz: "Xabarni har odamga alohida, bir marta yuboring — guruhga tashlamang. Javob bermasa yoki «hozir yo'q» desa — qayta yozmang. Mahalla guruhi orqali yozsangiz — 12-Moduldagi olti bandli ro'yxat kuchda.", ru: 'Отправляйте сообщение каждому отдельно и один раз — не в группу. Не ответил или сказал «сейчас нет» — не пишите повторно. Если пишете через группу махалли — действует список из шести пунктов из 12-го модуля.' }
];
const S6_YORDAM3 = [
  { uz: "Mentor misolida: «15 000 qimmat. 10 000 so'm bo'lsa, \"Doimiy o'yin\" uchun to'layman.» — narx 10 000, nima uchun «Doimiy o'yin». Sabab («charchadim» kabi) — gapda qoladi, «nima uchun» ga emas.", ru: 'В примере Ментора: «15 000 дорого. Если 10 000 сумов — заплачу за „Постоянную игру“.» — цена 10 000, за что — «Постоянная игра». Причина (вроде «устал») остаётся в словах, а не в «за что».' },
  { uz: "Narx yoki nima uchun yozmagan bo'lsa — «Aniqlashtirish kerak»: faqat yetishmagan narsani bir marta so'rang; javobi kelsa — ✎ bilan «Yozma tasdiq» ga o'tkazing, birinchi gap ham saqlanadi. «Hozir yo'q» yoki javob bermagan odamga qayta yozmang.", ru: 'Если не написал цену или «за что» — «Нужно уточнить»: один раз спросите только то, чего не хватает; придёт ответ — через ✎ переведите в «Письменное подтверждение», первые слова тоже сохранятся. Сказавшему «сейчас нет» или не ответившему не пишите повторно.' },
  { uz: "So'zma-so'z — odam yozganidek; faqat ism, telefon va akkaunt nomini [ism], [telefon] bilan almashtiring, qolganini o'zgartirmang. Skrinshot olsangiz — ism va telefon ko'rinmasin.", ru: 'Дословно — как написал человек; только имя, телефон и аккаунт замените на [имя], [телефон], остальное не меняйте. Если делаете скриншот — имя и телефон не должны быть видны.' }
];
const MentorPracticeStats = ({ live, signal, yorliq }) => {
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return undefined;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, signal)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)) });
      } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, signal]); // eslint-disable-line
  if (!live || live.mode !== 'mentor') return null;
  const players = data.players || [];
  const doers = players.filter(p => data.doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.accent }}>{tr(yorliq)} — {doers.length}/{players.length}</div>
      {players.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {players.map(p => <span key={p.id} className="mstats-wait-chip" style={data.doneIds.has(p.id) ? { background: T.okFon, color: T.ok } : { opacity: 0.6 }}>{data.doneIds.has(p.id) ? '✓ ' : ''}{p.nickname}</span>)}
      </div>}
    </div>
  );
};
// Mentor rejimi (6, 7-ekran): forma o'rniga Mentor misoli — xabar va olti javob; son va matn o'quvchilardan uzatilmaydi (TAQIQLAR 3)
const MentorMisol = ({ muhr }) => (
  <div className="tv-ikki">
    <div className="tv-tkol"><Telefon sarlavha={tashkilotchi(3)} xabar={tr(MENTOR_XABAR)} javob={tr(MENTOR_JAVOBLAR[2].gap)} /></div>
    <div className="tv-o">
      <Varaq sarlavha={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>} muhr={muhr ? { k: 'q', tur: 'ok', t: tr({ uz: 'Qabul', ru: 'Принято' }) } : false} pro={tr(PRO_QATOR)} hisob={mentorHisob(false)}>
        <Jadval ustunlar={['kim', 'holat', 'narx', 'nima', 'gap']} qatorlar={mentorQatorlar(true)} />
      </Varaq>
    </div>
  </div>
);
const PRACTICE_BASE = 500; // signal zonasi: <100 test · 100+ arena · 500+ praktika
const S6_PRACTICE = { xabar: PRACTICE_BASE + 6, yozuv: PRACTICE_BASE + 16 };
const S7_PRACTICE = { tekshirildi: PRACTICE_BASE + 7, tuzatish: PRACTICE_BASE + 17 };

const MANBA_T = [{ k: 'chat', t: { uz: 'chat', ru: 'чат' } }, { k: 'qogoz', t: { uz: "qog'oz", ru: 'бумага' } }];
// ===== SCREEN 6 — YOZMA TASDIQLARINGIZ (QMustaqil; ketma-ket karta, 3 qism: Suhbatlar · Xabar · Javoblar — SABOQ 9, 13, 29, E 43, E 53) =====
const yangiQ1 = () => ({ id: null, kim: '', gap: '', javob: null, narx: '', hozir: '', qachon: bugun() });
const s6Boshla = () => {
  const realN = realSuhbatlar().length;
  return { qism: realN >= 3 ? 1 : 0, q1: yangiQ1(), q1Otdi: realN >= 3, qoshildi: [], xabar: (() => { const n = narxOl(); return { nima: '', narx: n && n.narx ? String(n.narx) : '', davr: n && n.davrKun ? String(n.davrKun) : '' }; })(), xabarSaqlandi: false, ota: false, odamlar: null, boshqa: '', yubormaydi: false, javob: {}, jn: 0, tidN: 0 };
};
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const [st, setSt] = useState(() => (storedAnswer && storedAnswer.st) || s6Boshla());
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [suhbatlar, setSuhbatlar] = useState(() => suhbatOl().suhbatlar);
  const [yangiR, setYangiR] = useYangi(1200);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null), royxatRef = useRef(null), telRef = useRef(null), varaqRef = useRef(null);
  const narxManba = useMemo(() => narxOl(), []);
  const skript3 = useMemo(() => { const s = suhbatOl().skript; return s && s[2] ? String(s[2]).trim() : ''; }, []);
  const yangila = (p) => setSt(s => { const n = typeof p === 'function' ? p(s) : { ...s, ...p }; onAnswer(screen, { stage: 'practice', screenIdx: screen, st: n }); return n; });
  const signal = (k) => { if (isStudent && live) live.submitAnswer(S6_PRACTICE[k], 'practice', 0, true, 0); };
  const realN = suhbatlar.filter(s => s && s.tur === 'real').length;
  const odamlar = st.odamlar || [];
  const yub = odamlar.filter(o => o.yub);
  const h = tasdiqHisob(st);
  const hN = h.tasdiqlar.filter(t => t.hisobga !== false).length;
  const p1 = st.qism > 0 || st.q1Otdi;
  const p2 = st.qism > 1;
  const p3 = st.qism > 2;
  const tayyorN = [p1, p2, p3].filter(Boolean).length;
  const done = p3;
  const tugadi = useTugadi(done, 1200, !!(storedAnswer && storedAnswer.st && storedAnswer.st.qism > 2));
  useEffect(() => { setXato(null); setYordam(false); }, [st.qism, st.jn]);
  // 1-qism · Uydagi suhbat
  const q1Saqla = (yana) => {
    const f = st.q1;
    const r = s6Q1(f);
    if (r.blok) { setXato({ k: r.blok }); return; }
    if (r.yumshoq && !(xato && xato.yumshoq && xato.k === r.yumshoq)) { setXato({ k: r.yumshoq, yumshoq: true }); return; }
    const d = suhbatOl();
    const maxN = d.suhbatlar.reduce((m, s) => Math.max(m, Number(String(s && s.id || '').replace(/\D/g, '')) || 0), 0);
    const yoz = { id: f.id || 's' + (maxN + 1), tur: 'real', kim: f.kim.trim(), hozir: String(f.hozir || '').trim() || null, gap: String(f.gap || '').trim(), javob: f.javob, narxi: f.javob === 'javobsiz' ? null : narxSon(f.narx), qachon: f.qachon || bugun() };
    const ro = f.id ? d.suhbatlar.map(s => (s.id === f.id ? yoz : s)) : [...d.suhbatlar, yoz];
    lsY(SUHBAT_KEY, { ...d, suhbatlar: ro, savedAt: Date.now() });
    setSuhbatlar(ro); setYangiR(yoz.id); setXato(null);
    uch(kartaRef.current, royxatRef.current, tr({ uz: 'real', ru: 'реальный' }));
    signal('yozuv');
    const nReal = ro.filter(s => s.tur === 'real').length;
    yangila(s => ({ ...s, q1: yangiQ1(), qoshildi: f.id ? s.qoshildi : [...s.qoshildi, yoz.id], qism: yana && nReal < 3 ? 0 : (s.xabarSaqlandi && s.qism > 1 ? s.qism : 1), q1Otdi: true, odamlar: s.odamlar ? birlashtir(s.odamlar) : null }));
  };
  const q1Tahrir = (s) => yangila(x => ({ ...x, qism: 0, q1: { id: s.id, kim: s.kim || '', gap: s.gap || '', javob: s.javob || null, narx: s.narxi ? String(s.narxi) : '', hozir: s.hozir || '', qachon: s.qachon || bugun() } }));
  // 2-qism · Xabar
  const odamlarTayyor = () => st.odamlar || rolOdamlar();
  const q2Saqla = () => {
    const r = s6Q2(st.xabar);
    if (r.blok) { setXato({ k: r.blok }); return; }
    if (r.yumshoq && !(xato && xato.yumshoq && xato.k === r.yumshoq)) { setXato({ k: r.yumshoq, yumshoq: true }); return; }
    setXato(null);
    uch(kartaRef.current, telRef.current, tr({ uz: 'xabar', ru: 'сообщение' }));
    const n = { ...st, xabarSaqlandi: true, odamlar: odamlarTayyor() };
    yangila(n); tasdiqYoz(n); signal('xabar');
  };
  const yubBos = (id) => {
    if (!st.ota) return;
    const n = { ...st, odamlar: odamlar.map(o => (o.id === id ? { ...o, yub: !o.yub } : o)), javob: { ...st.javob } };
    if (!n.odamlar.find(o => o.id === id).yub) delete n.javob[id];
    n.joriyOdam = id;
    yangila(n); tasdiqYoz(n);
  };
  const boshqaQosh = () => {
    const v = String(st.boshqa || '').trim();
    if (!v) return;
    if (rolBlok(v)) { setXato({ k: 'rol' }); return; }
    setXato(null);
    const id = 'b' + Date.now();
    const n = { ...st, boshqa: '', odamlar: [...odamlar, { id, kim: v, yub: !!st.ota }], joriyOdam: id };
    yangila(n); tasdiqYoz(n);
  };
  // 3-qism · Javoblar
  const odam = yub[Math.min(st.jn, Math.max(0, yub.length - 1))];
  const jv = odam ? (st.javob[odam.id] || { holat: 'javobsiz', gap: '', narx: '', nima: '', manba: 'chat', qachon: bugun() }) : null;
  const jvYangila = (p) => yangila(s => ({ ...s, javob: { ...s.javob, [odam.id]: { ...jv, ...p, saqlandi: false } } }));
  const q3Saqla = () => {
    const r = s6Q3(jv);
    if (r.blok) { setXato({ k: r.blok }); return; }
    if (r.yumshoq && !(xato && xato.yumshoq && xato.k === r.yumshoq)) { setXato({ k: r.yumshoq, yumshoq: true }); return; }
    setXato(null);
    let tidN = st.tidN;
    const v = { ...jv, saqlandi: true };
    if (v.holat === 'tasdiq' && !v.tid) { tidN += 1; v.tid = 't' + tidN; }
    if (v.holat === 'aniq') { v.oldingiGap = String(v.gap || '').trim(); }
    if (v.holat === 'tasdiq' && jv.oldingiHolat === 'aniq' && !v.oldingiGap) v.oldingiGap = null;
    if (v.holat === 'tasdiq') uch(kartaRef.current, varaqRef.current, `${sonFmt(narxSon(v.narx) || 0)} · ${String(v.nima || '').trim()}`);
    const javob = { ...st.javob, [odam.id]: v };
    const keyingi = st.jn + 1;
    const n = { ...st, javob, tidN, jn: keyingi, qism: keyingi >= yub.length || st.tahrirdan ? 3 : 2, tahrirdan: false };
    yangila(n); tasdiqYoz(n);
    if (v.holat === 'tasdiq') signal('yozuv');
  };
  const q3Tahrir = (oid) => {
    const i = yub.findIndex(o => o.id === oid);
    if (i < 0) return;
    const v = st.javob[oid];
    yangila(s => ({ ...s, qism: 2, jn: i, tahrirdan: true, javob: v ? { ...s.javob, [oid]: { ...v, oldingiHolat: v.holat, gap: v.holat === 'aniq' ? '' : v.gap, saqlandi: false } } : s.javob }));
  };
  const aniqGap = jv && jv.oldingiHolat === 'aniq' ? st.javob[odam.id]?.oldingiGap : null;
  // --- ko'rinish ---
  const ixcham = (
    <div className="tv-ixcham"><b>{tr({ uz: 'Yozma tasdiqlarim', ru: 'Мои письменные подтверждения' })}</b>
      <span>{tr({ uz: "so'ralgan", ru: 'спросили' })} · <b key={'s' + h.soralgan}>{h.soralgan}</b></span>
      <span className="ok">{tr({ uz: 'yozma tasdiq', ru: 'письменных подтверждений' })} · <b key={'t' + hN}>{hN}</b></span>
    </div>
  );
  const yozuvlarim = (
    <div ref={royxatRef} className="tv-yozuvlar">
      <div className="tv-yozuvlar-h"><b>{tr({ uz: 'Yozuvlarim', ru: 'Мои записи' })}</b><span>{tr({ uz: 'real', ru: 'реальн.' })} {realN} / 3</span></div>
      {suhbatlar.length === 0 && <p className="tv-kulrang">{tr({ uz: "6-darsdan yozuv yo'q", ru: 'С 6-го урока записей нет' })}</p>}
      {suhbatlar.map(s => {
        const b = BELGI1.find(x => x.k === s.javob);
        return (
          <div key={s.id} className={cxx('tv-yozuv', yangiR === s.id && 'yangi')}>
            <span className="tv-yozuv-m"><b>{String(s.kim || '')}</b>{s.gap ? <> · «{nb(String(s.gap))}»</> : null}{b ? <> · {tr(b.t)}</> : null}{s.narxi ? <> · {sonFmt(s.narxi)}</> : null}</span>
            <span className={cxx('tv-tur', s.tur === 'real' && 'ok')}>{s.tur === 'real' ? tr({ uz: 'real', ru: 'реальн.' }) : tr({ uz: 'mashq', ru: 'учебн.' })}</span>
            {st.qoshildi.includes(s.id) && <QChip className="tv-tahrir" onClick={() => q1Tahrir(s)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</QChip>}
          </div>
        );
      })}
    </div>
  );
  const xabarKorinish = st.xabarSaqlandi ? xabarMatn(st.xabar) : null;
  const joriy = st.qism === 2 && odam ? odam : odamlar.find(o => o.id === st.joriyOdam) || yub[yub.length - 1];
  const telefon = (
    <div ref={telRef} className="tv-tkol">
      <Telefon sarlavha={joriy ? joriy.kim : '…'} xabar={xabarKorinish} yuborildi={!!(joriy && joriy.yub)}
        javob={st.qism === 2 && jv && (jv.holat === 'tasdiq' || jv.holat === 'aniq') && String(jv.gap || '').trim() ? jv.gap : null} javobKey={odam ? odam.id : 'x'} />
    </div>
  );
  let karta = null;
  if (st.qism === 0) {
    const f = st.q1;
    const q1Y = (p) => yangila(s => ({ ...s, q1: { ...s.q1, ...p } }));
    const xk = xato && xato.k;
    karta = realN >= 3 && !f.id
      ? <div className="tv-karta"><p className="tv-kulrang katta">{tr({ uz: 'Real suhbatlar uchtagacha yoziladi.', ru: 'Реальных разговоров записывают до трёх.' })}</p></div>
      : (
        <div ref={kartaRef} key={'q1' + (f.id || st.qoshildi.length)} className="tv-karta">
          <span className="tv-karta-h">{tr({ uz: 'Uydagi suhbat', ru: 'Разговор дома' })}</span>
          <div className="tv-qator2 kb">
            <Kirit n="1" value={f.kim} max={40} ph={tr({ uz: 'Kim edi? Rolini yozing', ru: 'Кто это был? Напишите роль' })} err={xk === 'kimBosh' || xk === 'rol'} halqa={!f.kim} onChange={(v) => q1Y({ kim: v })} />
            <div className="tv-bk">
              <div className={cxx('tv-belgilar', xk === 'belgi' && 'err')}>{BELGI1.map(b => <QChip key={b.k} holat={f.javob === b.k ? 'on' : undefined} onClick={() => q1Y({ javob: b.k })}>{tr(b.t)}</QChip>)}</div>
              <p className="tv-kulrang">{tr({ uz: "Javob yo'q — odam javob bermasa.", ru: 'Нет ответа — если человек не ответил.' })}</p>
            </div>
          </div>
          <Matn n="2" value={f.gap} max={160} ph={tr({ uz: "U nima dedi? So'zma-so'z", ru: 'Что он сказал? Дословно' })} err={xk === 'gapBosh1' || xk === 'xulosa1'} halqa={!!f.kim && !f.gap} onChange={(v) => q1Y({ gap: v })} />
          <div className="tv-qator3">
            <Kirit n="3" son value={f.narx} max={9} ph={tr({ uz: "Narx, so'm — aytgan bo'lsa", ru: 'Цена, сумы — если назвал' })} onChange={(v) => q1Y({ narx: v })} />
            <Kirit n="4" value={f.hozir} max={80} ph={tr({ uz: "Hozir nima qiladi? Yozgan bo'lsangiz", ru: 'Что он делает сейчас? Если записали' })} onChange={(v) => q1Y({ hozir: v })} />
            <Kirit n="5" tur="date" value={f.qachon} ph={tr({ uz: 'Qachon gaplashdingiz?', ru: 'Когда говорили?' })} onChange={(v) => q1Y({ qachon: v })} />
          </div>
          <XatoQ x={xato} />
          <div className="tv-tugmaq">
            <QTugma onClick={() => q1Saqla(false)}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
            {realN < 2 && <QTugma ikkinchi onClick={() => q1Saqla(true)}>{tr({ uz: '+ Yana bitta', ru: '+ Ещё один' })}</QTugma>}
            <YordamBtn ochiq={yordam} onClick={() => setYordam(y => !y)} />
          </div>
          {yordam && <Yordam satrlar={S6_YORDAM1} />}
          {!f.id && <button type="button" className="tv-kichik" onClick={() => yangila(s => ({ ...s, qism: 1, q1Otdi: true, odamlar: null }))}>{tr({ uz: "Uyda suhbat bo'lmadi →", ru: 'Дома разговора не было →' })}</button>}
        </div>
      );
  } else if (st.qism === 1) {
    const x = st.xabar;
    const xY = (p) => yangila(s => ({ ...s, xabar: { ...s.xabar, ...p }, xabarSaqlandi: false }));
    const xk = xato && xato.k;
    karta = (
      <div ref={kartaRef} className="tv-karta">
        <span className="tv-karta-h">{tr({ uz: 'Xabar', ru: 'Сообщение' })}</span>
        {!st.xabarSaqlandi ? <>
          <div className="tv-qolip">
            <span>"</span><input className={cxx('tv-joy', 'keng', (xk === 'nimaBosh' || xk === 'havola' || xk === 'sotish') && 'err', !x.nima && 'halqa')} value={x.nima} maxLength={40} placeholder={tr({ uz: "Odam nima uchun to'laydi?", ru: 'За что человек заплатит?' })} aria-label={tr({ uz: "Odam nima uchun to'laydi?", ru: 'За что человек заплатит?' })} onChange={(e) => xY({ nima: e.target.value })} /><span>"</span>
            <input className="tv-joy qisqa" inputMode="numeric" value={x.davr} maxLength={3} placeholder={tr({ uz: 'davr', ru: 'срок' })} aria-label={tr({ uz: 'davr', ru: 'срок' })} onChange={(e) => xY({ davr: e.target.value.replace(/\D/g, '') })} /><span>{tr({ uz: 'kunga', ru: 'дн.' })}</span>
            <input className={cxx('tv-joy', 'orta', xk === 'narxBosh' && 'err')} inputMode="numeric" value={x.narx} maxLength={9} placeholder={tr({ uz: "Narx, so'm", ru: 'Цена, сумы' })} aria-label={tr({ uz: "Narx, so'm", ru: 'Цена, сумы' })} onChange={(e) => xY({ narx: e.target.value.replace(/[^\d\s]/g, '') })} />
            <span>{tr({ uz: "so'm bo'lsa, to'lashga tayyormisiz? Tayyor bo'lsangiz, bir gap yozib bering: qaysi narxda va nima uchun to'laysiz.", ru: 'сумов — готовы платить? Если готовы, напишите одну фразу: по какой цене и за что заплатите.' })}</span>
          </div>
          <p className="tv-ozgarmas"><span className="tv-oz-y">{tr({ uz: "o'zgarmaydi", ru: 'не меняется' })}</span>{tr(XABAR_QATOR)}</p>
          {narxManba && narxManba.narx && <p className="tv-kulrang">{tr({ uz: '4-darsdagi narxingiz', ru: 'Ваша цена с 4-го урока' })}: {sonFmt(narxManba.narx)}</p>}
          {narxManba && narxManba.sarlavha && <p className="tv-kulrang">{tr({ uz: '4-darsdagi ekraningiz', ru: 'Ваш экран с 4-го урока' })}: «{narxManba.sarlavha}»</p>}
          {skript3 && <p className="tv-kulrang">{tr({ uz: '6-darsdagi savolingiz', ru: 'Ваш вопрос с 6-го урока' })}: «{skript3}»</p>}
          <XatoQ x={xato} />
          <div className="tv-tugmaq">
            <QTugma onClick={q2Saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
            <YordamBtn ochiq={yordam} onClick={() => setYordam(y => !y)} />
          </div>
          {yordam && <Yordam satrlar={S6_YORDAM2} />}
        </> : <>
          <b className="tv-karta-s">{tr({ uz: 'Kimga yubordingiz?', ru: 'Кому отправили?' })}</b>
          <label className={cxx('tv-ota', !st.ota && 'halqa')}><input type="checkbox" checked={!!st.ota} onChange={(e) => yangila({ ota: e.target.checked })} /><span>{tr({ uz: 'Bu odamga yozishimdan ota-onam xabardor', ru: 'Родители знают, что я пишу этому человеку' })}</span></label>
          <div className={cxx('tv-rollar', st.ota && yub.length === 0 && 'tv-chorla')}>
            {odamlar.map(o => <QChip key={o.id} holat={o.yub ? 'on' : undefined} disabled={!st.ota} onClick={() => yubBos(o.id)}>{o.kim}{o.yub ? ' · ' + tr({ uz: 'yuborildi ✓', ru: 'отправлено ✓' }) : ''}</QChip>)}
          </div>
          <div className="tv-tugmaq">
            <Kirit value={st.boshqa} max={40} ph={tr({ uz: '+ Boshqa tanish', ru: '+ Другой знакомый' })} err={xato && xato.k === 'rol'} onChange={(v) => yangila({ boshqa: v })} />
            <QTugma ikkinchi disabled={!String(st.boshqa || '').trim()} onClick={boshqaQosh}>{tr({ uz: "Qo'shish", ru: 'Добавить' })}</QTugma>
          </div>
          <XatoQ x={xato} />
          <p className="tv-kulrang">{tr({ uz: "Darsda — faqat suhbatdoshingizga yoki to'lovchi sinfdoshingizga; boshqa tanishga — uyda, ota-onangizga aytib.", ru: 'На уроке — только вашему собеседнику или однокласснику-плательщику; другому знакомому — дома, сказав родителям.' })}</p>
          <div className="tv-tugmaq">
            <QTugma disabled={yub.length === 0} onClick={() => yangila({ qism: 2, jn: 0 })}>{tr({ uz: "Javoblarga o'tish", ru: 'К ответам' })}</QTugma>
            {yub.length === 0 && <button type="button" className="tv-kichik" onClick={() => { const n = { ...st, qism: 3, yubormaydi: true, odamlar: odamlar.map(o => ({ ...o, yub: false })), javob: {} }; yangila(n); tasdiqYoz(n); }}>{tr({ uz: 'Hozir yubora olmayman →', ru: 'Сейчас не могу отправить →' })}</button>}
          </div>
        </>}
      </div>
    );
  } else if (st.qism === 2 && odam) {
    const xk = xato && xato.k;
    karta = (
      <div ref={kartaRef} key={'q3' + odam.id} className="tv-karta">
        <span className="tv-karta-h">{odam.kim}<em>{Math.min(st.jn, yub.length - 1) + 1} / {yub.length}</em></span>
        <div className="tv-belgilar">{HOLAT3.map(b => <QChip key={b.k} holat={jv.holat === b.k ? 'on' : undefined} onClick={() => jvYangila({ holat: b.k })}>{tr(b.t)}</QChip>)}</div>
        <p className="tv-kulrang">{tr({ uz: "Javob hali kelmagan bo'lsa — shunday qoldiring.", ru: 'Если ответ ещё не пришёл — оставьте так.' })}</p>
        {aniqGap && <p className="tv-kulrang">{tr({ uz: 'Birinchi gapi', ru: 'Первые слова' })}: «{aniqGap}»</p>}
        {(jv.holat === 'tasdiq' || jv.holat === 'aniq') && <Matn n="1" value={jv.gap} max={160} ph={jv.holat === 'aniq' ? tr({ uz: 'U nima deb yozdi?', ru: 'Что он написал?' }) : tr({ uz: "U nima deb yozdi? So'zma-so'z", ru: 'Что он написал? Дословно' })} err={xk === 'gapBosh3' || xk === 'tel3' || xk === 'raqam7' || xk === 'xulosa3'} halqa={!jv.gap} onChange={(v) => jvYangila({ gap: v })} />}
        {jv.holat === 'tasdiq' && <>
          <div className="tv-qator2">
            <Kirit n="2" son value={jv.narx} max={9} ph={tr({ uz: "Narx, so'm", ru: 'Цена, сумы' })} err={xk === 'narxBosh3' || xk === 'narxYoq'} onChange={(v) => jvYangila({ narx: v })} />
            <Kirit n="3" value={jv.nima} max={40} ph={tr({ uz: "Nima uchun to'laydi?", ru: 'За что заплатит?' })} err={xk === 'nimaBosh3'} onChange={(v) => jvYangila({ nima: v })} />
          </div>
          <div className="tv-mq">
            <div className="tv-belgilar"><i className="tv-n">4</i><span className="tv-kirit-y">{tr({ uz: 'Qayerda:', ru: 'Где:' })}</span>{MANBA_T.map(m => <QChip key={m.k} holat={(jv.manba || 'chat') === m.k ? 'on' : undefined} onClick={() => jvYangila({ manba: m.k })}>{tr(m.t)}</QChip>)}</div>
            <Kirit n="5" tur="date" value={jv.qachon || bugun()} ph={tr({ uz: 'Qachon yozdi?', ru: 'Когда написал?' })} onChange={(v) => jvYangila({ qachon: v })} />
          </div>
        </>}
        <XatoQ x={xato} />
        <div className="tv-tugmaq">
          <QTugma onClick={q3Saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
          <YordamBtn ochiq={yordam} onClick={() => setYordam(y => !y)} />
        </div>
        {yordam && <Yordam satrlar={S6_YORDAM3} />}
      </div>
    );
  }
  const yigVaraq = (
    <Varaq vRef={varaqRef} sarlavha={tr({ uz: 'Yozma tasdiqlarim', ru: 'Мои письменные подтверждения' })} muhr={false} xabarQ={xabarKorinish}
      hisob={[
        { t: tr({ uz: "so'ralgan", ru: 'спросили' }), n: h.soralgan },
        { t: tr({ uz: 'yozma tasdiq', ru: 'письменных подтверждений' }), n: hN, ok: true },
        ...(h.aniqlashtirish ? [{ t: tr(HOLAT_T.aniq), n: h.aniqlashtirish }] : []),
        { t: tr(HOLAT_T.hozir), n: h.hozirYoq },
        { t: tr(HOLAT_T.javobsiz), n: h.javobsiz }
      ]}>
      {yub.length > 0 && <Jadval ustunlar={['kim', 'holat', 'narx', 'nima', 'gap', 'qayer']} qatorlar={yub.map(o => {
        const v = st.javob[o.id];
        const hl = v && v.saqlandi ? v.holat : 'javobsiz';
        return { k: o.id, kim: o.kim, holat: hl, holatT: tr(HOLAT_T[hl]), narx: hl === 'tasdiq' ? sonFmt(narxSon(v.narx) || 0) : null, nima: hl === 'tasdiq' ? v.nima : null, gap: v && v.gap && (hl === 'tasdiq' || hl === 'aniq') ? v.gap : null, qayer: hl === 'tasdiq' ? (v.manba === 'qogoz' ? tr({ uz: "qog'oz", ru: 'бумага' }) : tr({ uz: 'chat', ru: 'чат' })) : null,
          tahrir: <QChip className="tv-tahrir" onClick={() => q3Tahrir(o.id)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</QChip> };
      })} />}
    </Varaq>
  );
  const xulosa = done && (h.tasdiqlar.filter(t => t.hisobga !== false).length >= 1
    ? tr({ uz: 'Yozma tasdiq yozildi: har birida narx va nima uchun bor.', ru: 'Письменное подтверждение записано: в каждом есть цена и за что.' })
    : h.soralgan >= 1
      ? tr({ uz: "Xabar yuborildi — javob kelmasa ham, bu natija.", ru: 'Сообщение отправлено — даже если ответа нет, это результат.' })
      : st.xabarSaqlandi
        ? tr({ uz: 'Xabaringiz tayyor — uni uyda, ota-onangizga aytib yuborasiz.', ru: 'Ваше сообщение готово — отправите его дома, сказав родителям.' })
        : null);
  const mentorGap = st.qism === 0
    ? { uz: "Uyda gaplashgan bo'lsangiz — qog'ozdagi yozuvni shu yerga ko'chiring.", ru: 'Если говорили дома — перенесите запись с бумаги сюда.' }
    : st.qism === 1
      ? { uz: "Mentor xabaridagi bo'sh joylarni o'z mahsulotingiz bilan to'ldiring.", ru: 'Заполните пустые места в сообщении Ментора своим продуктом.' }
      : { uz: "Javob kelganlarini belgilang — yozma tasdiqni so'zma-so'z ko'chiring.", ru: 'Отметьте пришедшие ответы — перепишите подтверждение дословно.' };
  const navL = done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Qismlarni bajaring (${tayyorN}/3)`, ru: `Выполните части (${tayyorN}/3)` };
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · yozma tasdiq', ru: 'Самостоятельная работа · письменное подтверждение' })} screen={screen} scrollSignal={st.qism * 10 + st.jn} natijaSignal={tugadi ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={tr(isMentor ? { uz: 'Davom etish', ru: 'Продолжить' } : navL)} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Tanishlaringizdan <A>yozma tasdiq so'rang.</A></>, ru: <>Попросите знакомых <A>о письменном подтверждении.</A></> })}
        mentor={<Mentor>{tr(mentorGap)}</Mentor>}
        qadamlar={!isMentor && !done && <div className="tv-qism"><QQadamlar qadamlar={S6_QISM.map(tr)} joriy={st.qism} /></div>}
        forma={isMentor
          ? <><MentorMisol /><MentorPracticeStats live={live} signal={S6_PRACTICE.xabar} yorliq={{ uz: 'Xabar yozdi', ru: 'Написали сообщение' }} /><MentorPracticeStats live={live} signal={S6_PRACTICE.yozuv} yorliq={{ uz: 'Yozuv saqladi', ru: 'Сохранили запись' }} /></>
          : tugadi
            ? <div className="tv-fokus">{yigVaraq}{xulosa && <QXulosa>{xulosa}</QXulosa>}</div>
            : <><div className={cxx('tv-ish', st.qism === 0 ? 'bir' : 'tel')}>{st.qism === 0 ? yozuvlarim : telefon}{karta}</div>{ixcham}</>}
      >
        <Ustoz satrlar={USTOZ.s6} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 7 — TEKSHIRUV VA KEYINGI QADAM (QMustaqil; juftlik + yakka rejim; 3 savol, so'ng shartli keyingi qadam — P-008) =====
const KQ_YORDAM = [{ uz: "Masalan: «Uyda yana ikki tanishdan bir marta so'rayman» · «\"Qimmat\" deganlar bor — 4-darsdagi narx hisobimni qayta ko'raman». Qaysi ish — o'zingiz tanlaysiz.", ru: 'Например: «Дома ещё раз спрошу двух знакомых» · «Есть те, кто сказал „дорого“ — пересмотрю свой расчёт цены с 4-го урока». Какое дело — выбираете сами.' }];
// Savol → varaqdagi dalil joylari (1 — kim · 2 — narx va nima uchun · 3 — gap va xabar qatori)
const S7_ZONA = [['kim', 'pro'], ['narx', 'nima'], ['gap', 'xabar']];
const Screen7 = ({ screen, storedAnswer, answers, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const [key, setKey] = useState(() => tasdiqOl());
  const st6 = answers && answers[6] && answers[6].st;
  const [j, setJ] = useState(() => (key && key.tekshiruv ? 3 : (storedAnswer && storedAnswer.j) || 0));
  const [tuz, setTuz] = useState(() => (key && key.tekshiruv === 'tuzatish' ? key.tuzatishSabab : (storedAnswer && storedAnswer.tuz) || null));
  const [bj, setBj] = useState(() => (storedAnswer && storedAnswer.bj != null ? storedAnswer.bj : key && key.tekshiruv ? 3 : 0));
  const [tanla, setTanla] = useState(false);
  const [tahrir, setTahrir] = useState(null);
  const [kq, setKq] = useState(() => (key && key.keyingiQadam) || '');
  const [kqOk, setKqOk] = useState(() => !!(key && key.keyingiQadam));
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null), varaqRef = useRef(null);
  const tasdiqlar = (key && key.tasdiqlar) || [];
  const faol = tasdiqlar.filter(t => t.hisobga !== false);
  const n = faol.length;
  const bor = !!(key && key.xabar);
  const savolTugadi = n === 0 || j >= 3;
  const kqKerak = bor && tasdiqlar.filter(t => t.hisobga !== false).length < 3;
  const done = !bor || (savolTugadi && (!kqKerak || kqOk));
  const tugadi = useTugadi(done && bor, 1200, !!(key && key.tekshiruv && (!kqKerak || kqOk)));
  const yakka = !isStudent;
  const muhrTur = tuz ? 'tuzatish' : (yakka ? 'topilmadi' : 'qabul');
  useEffect(() => { setXato(null); setYordam(false); }, [j, tahrir, tanla]);
  const saqla7 = (p) => onAnswer(screen, { stage: 'practice', screenIdx: screen, j, tuz, correct: false, ...p });
  const faolSoni = (d) => ((d && d.tasdiqlar) || []).filter(t => t.hisobga !== false).length;
  const st6Yoz = (nst) => { onAnswer(6, { ...(answers[6] || {}), st: nst }); const d = tasdiqYoz(nst, { tekshiruv: null, tuzatishSabab: null }) || tasdiqOl(); setKey(d); return d; };
  // 6-ekran javobi yo'q bo'lsa (answers[6] yo'q) — tuzatish kalitning o'zida (pm-m11d9-tasdiq)
  const kalitYoz = (fn) => { const k0 = tasdiqOl() || {}; const d = { ...k0, ...fn(k0), tekshiruv: null, tuzatishSabab: null, savedAt: Date.now() }; lsY(TASDIQ_KEY, d); setKey(d); return d; };
  const st6Bor = () => !!(st6 && tahrir && tahrir.oid);
  // 3/3 — muhr tushadi, kalitga yoziladi
  const yakunla = (sabab, berildi = 3) => {
    const tekshiruv = sabab ? 'tuzatish' : (yakka ? 'topilmadi' : 'qabul');
    const d = { ...(tasdiqOl() || {}), tekshiruv, tuzatishSabab: sabab || null, savedAt: Date.now() };
    lsY(TASDIQ_KEY, d); setKey(d); setBj(berildi);
    if (isStudent && live) live.submitAnswer(sabab ? S7_PRACTICE.tuzatish : S7_PRACTICE.tekshirildi, 'practice', 0, true, 0);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, j: 3, bj: berildi, tuz: sabab || null, correct: faolSoni(d) >= 1 });
  };
  // Faol yozma tasdiq qolmadi — tekshiruv shu savolda tugaydi (muhr holatga mos, sabab saqlanadi)
  const tugatQolmasa = (d, sabab) => { if (faolSoni(d) > 0) return false; yakunla(sabab, Math.min(j + 1, 3)); return true; };
  const ha = (el) => {
    uch(el, varaqRef.current, '✓ ' + tr({ uz: 'Ha', ru: 'Да' }));
    const nj = j + 1;
    setJ(nj); setTanla(false);
    if (nj >= 3) yakunla(tuz); else saqla7({ j: nj });
  };
  const uyda = () => {
    const sabab = tuz || TEKSHIRUV_SAVOLLAR[j].k;
    setTuz(sabab); setTahrir(null); setTanla(false);
    const nj = j + 1;
    setJ(nj);
    if (nj >= 3) yakunla(sabab); else saqla7({ j: nj, tuz: sabab });
  };
  // Tuzatish kartasi — 6-ekran 3-qism maydonlari va tekshiruvlari bilan
  const tahrirOch = (t) => {
    if (!st6) { setTahrir({ t, f: { holat: 'tasdiq', gap: t.gap, narx: String(t.narx || ''), nima: t.nima, manba: t.manba, qachon: t.qachon }, oid: null }); setTanla(false); return; }
    const oid = Object.keys(st6.javob || {}).find(k => st6.javob[k] && st6.javob[k].tid === t.id);
    const v = oid ? st6.javob[oid] : {};
    setTahrir({ t, oid, f: { holat: 'tasdiq', gap: v.gap || t.gap, narx: String(v.narx || t.narx || ''), nima: v.nima || t.nima, manba: v.manba || t.manba, qachon: v.qachon || t.qachon } });
    setTanla(false);
  };
  const tahrirSaqla = () => {
    const r = s6Q3(tahrir.f);
    if (r.blok) { setXato({ k: r.blok }); return; }
    if (r.yumshoq && !(xato && xato.yumshoq && xato.k === r.yumshoq)) { setXato({ k: r.yumshoq, yumshoq: true }); return; }
    if (st6Bor()) {
      const v = { ...st6.javob[tahrir.oid], ...tahrir.f, saqlandi: true };
      st6Yoz({ ...st6, javob: { ...st6.javob, [tahrir.oid]: v } });
    } else {
      const f = tahrir.f;
      kalitYoz(k0 => ({ tasdiqlar: (k0.tasdiqlar || []).map(t => (t.id === tahrir.t.id ? { ...t, gap: String(f.gap || '').trim(), narx: narxSon(f.narx), nima: String(f.nima || '').trim(), manba: f.manba === 'qogoz' ? 'qogoz' : 'chat', qachon: f.qachon || bugun() } : t)) }));
    }
    uch(kartaRef.current, varaqRef.current, '✓');
    setTahrir(null); setXato(null);
  };
  const hisobgaOlma = () => {
    const tid = tahrir.t.id;
    const d = st6Bor()
      ? st6Yoz({ ...st6, javob: { ...st6.javob, [tahrir.oid]: { ...st6.javob[tahrir.oid], hisobga: false } } })
      : kalitYoz(k0 => ({ tasdiqlar: (k0.tasdiqlar || []).map(t => (t.id === tid ? { ...t, hisobga: false } : t)) }));
    setTahrir(null);
    tugatQolmasa(d, tuz);
  };
  const olibTashla = () => {
    const tid = tahrir.t.id;
    let d;
    if (st6Bor()) { const javob = { ...st6.javob }; delete javob[tahrir.oid]; d = st6Yoz({ ...st6, odamlar: (st6.odamlar || []).filter(o => o.id !== tahrir.oid), javob }); }
    else d = kalitYoz(k0 => ({ tasdiqlar: (k0.tasdiqlar || []).filter(t => t.id !== tid), soralgan: Math.max(0, (k0.soralgan || 0) - 1) }));
    setTahrir(null);
    tugatQolmasa(d, tuz);
  };
  const aniqlashtir = () => {
    const tid = tahrir.t.id;
    let d;
    if (st6Bor()) { const v = st6.javob[tahrir.oid]; d = st6Yoz({ ...st6, javob: { ...st6.javob, [tahrir.oid]: { ...v, holat: 'aniq', oldingiGap: v.gap, saqlandi: true } } }); }
    else d = kalitYoz(k0 => ({ tasdiqlar: (k0.tasdiqlar || []).filter(t => t.id !== tid), aniqlashtirish: (k0.aniqlashtirish || 0) + 1 }));
    if (faolSoni(d) > 0) { uyda(); return; }
    const sabab = tuz || TEKSHIRUV_SAVOLLAR[j].k;
    setTuz(sabab); setTahrir(null); setTanla(false);
    yakunla(sabab, Math.min(j + 1, 3));
  };
  const kqSaqla = () => {
    const r = s7Kq(kq);
    if (r.blok) { setXato({ k: r.blok }); return; }
    if (r.yumshoq && !(xato && xato.yumshoq && xato.k === r.yumshoq)) { setXato({ k: r.yumshoq, yumshoq: true }); return; }
    const d = { ...(tasdiqOl() || {}), keyingiQadam: kq.trim(), savedAt: Date.now() };
    lsY(TASDIQ_KEY, d); setKey(d); setKqOk(true); setXato(null);
    uch(kartaRef.current, varaqRef.current, tr({ uz: 'Keyingi qadam', ru: 'Следующий шаг' }));
    if (n === 0 && j < 3) onAnswer(screen, { stage: 'practice', screenIdx: screen, j, tuz, correct: false });
  };
  // --- ko'rinish ---
  const s = TEKSHIRUV_SAVOLLAR[Math.min(j, 2)];
  const chorla = !savolTugadi && !tahrir ? S7_ZONA[Math.min(j, 2)] : [];
  // «Ha» berilgan savollar joyi yashil ✓ (faol yozuv qolmaganda — shu tugagan savolgacha)
  const yonGacha = n === 0 ? Math.max(0, bj - 1) : Math.min(j, 3);
  const yonZ = TEKSHIRUV_SAVOLLAR.flatMap((q, i) => (i < yonGacha && q.k !== tuz ? S7_ZONA[i] : []));
  const zona = { yon: new Set(yonZ), chorla: new Set(chorla), silk: null, yopiq: true, onBos: null };
  const tolovchi = modelKim();
  const muhr = key && key.tekshiruv
    ? { k: key.tekshiruv, tur: key.tekshiruv === 'tuzatish' ? 'tuz' : 'ok', t: key.tekshiruv === 'tuzatish' ? `${tr({ uz: 'Tuzatish', ru: 'Исправление' })}: ${tr((TEKSHIRUV_SAVOLLAR.find(q => q.k === key.tuzatishSabab) || TEKSHIRUV_SAVOLLAR[0]).qisqa)}` : key.tekshiruv === 'topilmadi' ? tr({ uz: 'Tuzatish topilmadi', ru: 'Исправлений не найдено' }) : tr({ uz: 'Qabul', ru: 'Принято' }) }
    : null;
  const varaq = bor && (
    <Varaq vRef={varaqRef} sarlavha={tr({ uz: 'Yozma tasdiqlarim', ru: 'Мои письменные подтверждения' })} muhr={muhr}
      pro={tolovchi ? `${tr({ uz: "To'lovchi", ru: 'Плательщик' })}: ${tolovchi}` : null} xabarQ={key.xabar} zona={tolovchi ? zona : null}
      hisob={[
        { t: tr({ uz: "so'ralgan", ru: 'спросили' }), n: key.soralgan || 0 },
        { t: tr({ uz: 'yozma tasdiq', ru: 'письменных подтверждений' }), n, ok: true },
        ...(key.aniqlashtirish ? [{ t: tr(HOLAT_T.aniq), n: key.aniqlashtirish }] : []),
        { t: tr(HOLAT_T.hozir), n: key.hozirYoq || 0 },
        { t: tr(HOLAT_T.javobsiz), n: key.javobsiz || 0 }
      ]}
      ost={<>
        {key.tekshiruv === 'qabul' && <p className="tv-kulrang">{tr({ uz: 'Qabul — bugungi yozuvlar uchun.', ru: 'Принято — для сегодняшних записей.' })}</p>}
        {kqOk && key.keyingiQadam && <p className="tv-kq fade-step"><b>{tr({ uz: 'Keyingi qadam', ru: 'Следующий шаг' })}:</b> {key.keyingiQadam}</p>}
      </>}>
      {tasdiqlar.length > 0 && <Jadval ustunlar={['kim', 'narx', 'nima', 'gap', 'qayer']} zona={zona} qatorlar={tasdiqlar.map(t => ({ k: t.id, kim: t.kim, narx: sonFmt(t.narx || 0), nima: t.nima, gap: t.gap, qayer: t.manba === 'qogoz' ? tr({ uz: "qog'oz", ru: 'бумага' }) : tr({ uz: 'chat', ru: 'чат' }), kul: t.hisobga === false }))} />}
    </Varaq>
  );
  let karta = null;
  if (bor && !savolTugadi) {
    if (tahrir) {
      const f = tahrir.f, fY = (p) => setTahrir(x => ({ ...x, f: { ...x.f, ...p } }));
      const xk = xato && xato.k;
      karta = (
        <div ref={kartaRef} className="tv-karta">
          <span className="tv-karta-h">{tahrir.t.kim}</span>
          <Matn n="1" value={f.gap} max={160} ph={tr({ uz: "U nima deb yozdi? So'zma-so'z", ru: 'Что он написал? Дословно' })} err={xk === 'gapBosh3' || xk === 'tel3' || xk === 'raqam7' || xk === 'xulosa3'} onChange={(v) => fY({ gap: v })} />
          <div className="tv-qator2">
            <Kirit n="2" son value={f.narx} max={9} ph={tr({ uz: "Narx, so'm", ru: 'Цена, сумы' })} err={xk === 'narxBosh3' || xk === 'narxYoq'} onChange={(v) => fY({ narx: v })} />
            <Kirit n="3" value={f.nima} max={40} ph={tr({ uz: "Nima uchun to'laydi?", ru: 'За что заплатит?' })} err={xk === 'nimaBosh3'} onChange={(v) => fY({ nima: v })} />
          </div>
          <div className="tv-mq">
            <div className="tv-belgilar"><i className="tv-n">4</i><span className="tv-kirit-y">{tr({ uz: 'Qayerda:', ru: 'Где:' })}</span>{MANBA_T.map(m => <QChip key={m.k} holat={(f.manba || 'chat') === m.k ? 'on' : undefined} onClick={() => fY({ manba: m.k })}>{tr(m.t)}</QChip>)}</div>
            <Kirit n="5" tur="date" value={f.qachon || bugun()} ph={tr({ uz: 'Qachon yozdi?', ru: 'Когда написал?' })} onChange={(v) => fY({ qachon: v })} />
          </div>
          <XatoQ x={xato} />
          <div className="tv-tugmaq">
            <QTugma onClick={tahrirSaqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
            {(j === 0 || j === 2) && <QTugma ikkinchi onClick={hisobgaOlma}>{tr({ uz: 'Yozma tasdiq sifatida hisobga olmang', ru: 'Не считать письменным подтверждением' })}</QTugma>}
            {j === 1 && <QTugma ikkinchi onClick={aniqlashtir}>{tr(HOLAT_T.aniq).replace(/^./, c => c.toUpperCase())}</QTugma>}
          </div>
          <div className="tv-tugmaq">
            {j === 0 && <button type="button" className="tv-kichik" onClick={olibTashla}>{tr({ uz: 'Yozuvni olib tashlash', ru: 'Удалить запись' })}</button>}
            <button type="button" className="tv-kichik" onClick={uyda}>{tr({ uz: 'Uyda tuzataman', ru: 'Исправлю дома' })}</button>
          </div>
        </div>
      );
    } else if (tanla) {
      karta = (
        <div ref={kartaRef} className="tv-karta">
          <span className="tv-karta-h">{tr({ uz: 'Qaysi yozuv?', ru: 'Какая запись?' })}</span>
          {faol.map(t => <button key={t.id} type="button" className="tv-tanla" onClick={() => tahrirOch(t)}><b>{t.kim}</b><span>«{nb(t.gap)}»</span></button>)}
          <button type="button" className="tv-kichik" onClick={() => setTanla(false)}>← {tr({ uz: 'Orqaga', ru: 'Назад' })}</button>
        </div>
      );
    } else {
      karta = (
        <div className="tv-skol">
          <div ref={kartaRef} key={j} className="tv-savol">
            <span className="tv-savol-n">{j + 1} / 3</span>
            <b className="tv-savol-s">{tr(s.savol)}</b>
            <span className="tv-savol-q"><b>{tr(NIMAGA)}</b> {tr(s.q7)}</span>
            <div className="tv-tugmaq tv-chorla">
              <QChip className="tv-tugma" onClick={(e) => ha(e.currentTarget)}>{tr({ uz: 'Ha', ru: 'Да' })}</QChip>
              <QChip className="tv-tugma" onClick={() => (faol.length === 1 ? tahrirOch(faol[0]) : setTanla(true))}>{tr({ uz: "Yo'q — tuzataman", ru: 'Нет — исправлю' })}</QChip>
            </div>
          </div>
          <p className="tv-kulrang">{tr({ uz: 'Uchtaga yetmaslik — tuzatish sababi emas.', ru: 'Не набралось трёх — не причина для исправления.' })}</p>
          {!yakka && <p className="tv-kulrang">{tr({ uz: "Xabarning o'zini ko'rsatish shart emas; ko'rsatsangiz — ism va telefonni yoping.", ru: 'Показывать само сообщение не обязательно; если покажете — закройте имя и телефон.' })}</p>}
        </div>
      );
    }
  } else if (bor && kqKerak && !kqOk) {
    karta = (
      <div ref={kartaRef} className="tv-karta">
        {n === 0 && <><b className="tv-karta-s">{tr({ uz: "Tekshiradigan yozma tasdiq hali yo'q.", ru: 'Письменных подтверждений для проверки пока нет.' })}</b>
          <p className="tv-kulrang">{tr({ uz: 'Javob kelsa, shu uch savolni o\'zingizga berasiz.', ru: 'Когда придёт ответ, зададите себе эти три вопроса.' })}</p></>}
        <Kirit n="4" value={kq} max={80} halqa={!kq} err={xato && (xato.k === 'kqBosh' || xato.k === 'bosim')} ph={tr({ uz: 'Keyingi qadamingiz? Bitta ish yozing', ru: 'Ваш следующий шаг? Напишите одно дело' })} onChange={setKq} />
        <p className="tv-kulrang">{tr({ uz: "Bosim, o'zingiz yozgan «tasdiq» va pul — yo'q.", ru: 'Без давления, без «подтверждения» от себя и без денег.' })}</p>
        <XatoQ x={xato} />
        <div className="tv-tugmaq">
          <QTugma onClick={kqSaqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
          <YordamBtn ochiq={yordam} onClick={() => setYordam(y => !y)} />
        </div>
        {yordam && <Yordam satrlar={KQ_YORDAM} />}
      </div>
    );
  }
  const hl = key && key.tekshiruv;
  const xulosa = done && bor && (hl === 'tuzatish'
    ? tr({ uz: 'Bitta tuzatish qoldi — uni uyda tuzatasiz.', ru: 'Осталось одно исправление — сделаете его дома.' })
    : n === 0
      ? tr({ uz: "Yozma tasdiq hali yo'q — keyingi qadamingiz yozildi.", ru: 'Письменных подтверждений пока нет — ваш следующий шаг записан.' })
      : n >= 3
        ? tr({ uz: 'Yozuvlaringiz tekshirildi — yozma tasdiqlar uchtaga yetdi.', ru: 'Ваши записи проверены — подтверждений набралось три.' })
        : tr({ uz: 'Yozuvlaringiz tekshirildi, keyingi qadam yozildi.', ru: 'Ваши записи проверены, следующий шаг записан.' }));
  const mentorGap = savolTugadi && kqKerak && !kqOk
    ? { uz: "Yozma tasdiq uchtaga yetmagan bo'lsa — bitta keyingi qadamni yozing.", ru: 'Если подтверждений меньше трёх — напишите один следующий шаг.' }
    : yakka
      ? { uz: "Savollarni o'zingizga bering va javobini yozuvlaringizdan toping.", ru: 'Задайте вопросы себе и найдите ответ в своих записях.' }
      : { uz: 'Sherigingiz yozuvlaringizni o\'qib, savollarni birma-bir beradi — javobni birga belgilang.', ru: 'Партнёр читает ваши записи и задаёт вопросы по одному — отмечайте ответ вместе.' };
  // Faol yozma tasdiq yo'q — faqat berilgan savollar (bj) va «Keyingi qadam»: berilmagan savolga ✓ qo'yilmaydi
  const berilgan = n === 0 ? bj : 3;
  const qadamlar = [...TEKSHIRUV_SAVOLLAR.slice(0, berilgan).map(q => tr(q.savol)), ...(kqKerak ? [tr({ uz: 'Keyingi qadam', ru: 'Следующий шаг' })] : [])];
  const joriyQ = n === 0 ? berilgan : j < 3 ? j : (kqKerak && !kqOk ? 3 : undefined);
  const navL = done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Savollarni bering (${Math.min(j, 3)}/3)`, ru: `Задайте вопросы (${Math.min(j, 3)}/3)` };
  return (
    <Stage eyebrow={yakka ? tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' }) : tr({ uz: 'Juftlikda ish', ru: 'Работа в паре' })} screen={screen} scrollSignal={j * 10 + (tahrir ? 1 : 0) + (kqOk ? 5 : 0)} natijaSignal={tugadi ? 1 : 0}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor && !savolTugadi} label={tr(isMentor ? { uz: 'Davom etish', ru: 'Продолжить' } : savolTugadi && !done ? { uz: 'Davom etish', ru: 'Продолжить' } : navL)} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Yozuvlaringiz <A>tekshiruvdan o'tadimi?</A></>, ru: <>Пройдут ли ваши записи <A>проверку?</A></> })}
        mentor={<Mentor>{tr(mentorGap)}</Mentor>}
        qadamlar={!isMentor && bor && !done && <div className="tv-qism"><QQadamlar qadamlar={qadamlar} joriy={joriyQ} /></div>}
        forma={isMentor
          ? <><MentorMisol muhr /><MentorPracticeStats live={live} signal={S7_PRACTICE.tekshirildi} yorliq={{ uz: 'Tekshirildi', ru: 'Проверено' }} /><MentorPracticeStats live={live} signal={S7_PRACTICE.tuzatish} yorliq={{ uz: 'Tuzatish bor', ru: 'Есть исправление' }} /></>
          : !bor
            ? <div className="tv-karta"><p className="tv-kulrang katta">{tr({ uz: 'Avval 7-ekranda xabaringizni yozing', ru: 'Сначала напишите сообщение на 7-м экране' })}</p><QTugma ikkinchi onClick={onPrev}>← {tr({ uz: '7-ekranga qaytish', ru: 'Вернуться на 7-й экран' })}</QTugma></div>
            : tugadi
              ? <div className="tv-fokus">{varaq}{xulosa && <QXulosa>{xulosa}</QXulosa>}</div>
              : <div className="tv-ish s7"><div className="tv-o">{varaq}</div>{karta}</div>}
      >
        <Ustoz satrlar={USTOZ.s7} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  inWriting: { icon: '✍️', name: 'In Writing!', desc: { uz: 'Olti javobni birinchi urinishda ajratdingiz', ru: 'Вы разобрали шесть ответов с первой попытки' } },
  ownWords: { icon: '💬', name: 'Own Words!', desc: { uz: 'Yozma tasdiqni boshqa javoblardan ajratdingiz', ru: 'Вы отличили письменное подтверждение от других ответов' } },
  fairCheck: { icon: '🔍', name: 'Fair Check!', desc: { uz: 'Uch savolning dalilini varaqdan topdingiz', ru: 'Вы нашли на листе довод для трёх вопросов' } },
  checked: { icon: '✅', name: 'Checked!', desc: { uz: 'Yozuvlaringizni uch savol bilan tekshirdingiz', ru: 'Вы проверили свои записи тремя вопросами' } },
};
// Ekran id → nishon (MD «Nishonlar»): 2 va 4-ekran — birinchi urinish; 3 — 1-savol; 7 — bonus (yozma tasdiq bor va uch savol javoblanganda)
const ACH_TRIGGERS = { s2: 'inWriting', s3: 'ownWords', s4: 'fairCheck', s7: 'checked' };

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


// Podium savol yorliqlari (SCORED_IDX: 3, 5, 8)
const Q_LABELS = {
  3: { uz: '1 — Qaysi biri yozma tasdiq', ru: '1 — Что из этого подтверждение' },
  5: { uz: '2 — Narxsiz "ha"', ru: '2 — «Да» без цены' },
  8: { uz: 'Yakuniy — Uchtaga yetmasa', ru: 'Итог — Если не набралось трёх' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning fon so'zlari (MD; R-008: {uz, ru}, emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'yozma tasdiq', ru: 'подтверждение' }, l: 5, t: 10, s: 26, d: 19, dl: 0 },
  { ch: { uz: 'narx', ru: 'цена' }, l: 84, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'nima uchun', ru: 'за что' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'xabar', ru: 'сообщение' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'qabul', ru: 'принято' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'tuzatish', ru: 'исправление' }, l: 64, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: "hozir yo'q", ru: 'сейчас нет' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: "javob yo'q", ru: 'нет ответа' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'tanish', ru: 'знакомый' }, l: 52, t: 50, s: 20, d: 22, dl: 0.6 },
  { ch: { uz: "to'lovchi", ru: 'плательщик' }, l: 90, t: 44, s: 20, d: 24, dl: 1.4 },
  { ch: 'Maydon Jamoa', l: 36, t: 6, s: 20, d: 26, dl: 2.4 }
];
// ⚡ Mustahkamlash-jang — MD «Jonli viktorina» aynan; ✔ o'rni: A 5·9·12 · B 1·7·11 · C 3·6·10 · D 2·4·8 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'Bu darsda yozma tasdiq nima?', ru: 'Что на этом уроке письменное подтверждение?' }, opts: [{ uz: 'Siz yozib olgan suhbatdagi gapi', ru: 'Его слова из разговора, записанные вами' }, { uz: "Odamning o'zi yozgan narxli javobi", ru: 'Ответ с ценой, написанный им самим' }, { uz: "Oldindan berib qo'yilgan kichik pul", ru: 'Небольшие деньги, отданные заранее' }, { uz: "«Mashq to'lov»da bosilgan tugmasi", ru: 'Нажатая им кнопка «учебной оплаты»' }], correct: 1 },
  { q: { uz: "Mentor misolida nechta tashkilotchidan so'raldi?", ru: 'Скольких организаторов спросили в примере Ментора?' }, opts: [{ uz: 'Uchtadan — faqat 6-darsdagilardan', ru: 'Троих — только тех, кто был на 6-м уроке' }, { uz: 'Bittadan — faqat 1-tashkilotchidan', ru: 'Одного — только 1-го организатора' }, { uz: '44 tadan — hamma foydalanuvchidan', ru: '44 — всех пользователей' }, { uz: 'Oltitadan — 6-darsdagilar ham bor', ru: 'Шестерых — включая тех, кто с 6-го урока' }], correct: 3 },
  { q: { uz: 'Mentor misolida nechta yozma tasdiq bor?', ru: 'Сколько подтверждений в примере Ментора?' }, opts: [{ uz: 'Bitta — faqat 1-tashkilotchidan olindi', ru: 'Одно — получено только от 1-го организатора' }, { uz: 'Oltita — hamma tashkilotchi yozib berdi', ru: 'Шесть — написали все организаторы' }, { uz: 'Uchta — ikkitasi 15 000, biri 10 000', ru: 'Три — два по 15 000, одно по 10 000' }, { uz: "Ikkita — faqat 15 000 so'm yozganlari", ru: 'Два — только те, кто написал 15 000 сумов' }], correct: 2 },
  { q: { uz: "3-tashkilotchi «15 000 qimmat» deb, 10 000 so'mda to'lashini yozdi. Bu nima?", ru: '3-й организатор написал «15 000 дорого» и что заплатит 10 000 сумов. Что это?' }, opts: [{ uz: "Hozir yo'q — «qimmat» degani uchun", ru: 'Сейчас нет — раз сказал «дорого»' }, { uz: "Javob yo'q — narxi boshqacha chiqdi", ru: 'Нет ответа — цена получилась другой' }, { uz: 'Sotish gapi — narxni o\'zi tushirdi', ru: 'Продающая фраза — сам снизил цену' }, { uz: "Yozma tasdiq — 10 000 so'm narxda", ru: 'Письменное подтверждение — по цене 10 000 сумов' }], correct: 3 },
  { q: { uz: '«Kim tasdiqladi?» savoli bilan Mentor nimani ko\'radi?', ru: 'Что Ментор видит по вопросу «Кто подтвердил?»' }, opts: [{ uz: "Yozgan odam to'lovchi bo'lishini", ru: 'Что написавший — плательщик' }, { uz: 'Yozgan odamning ism-familiyasini', ru: 'Имя и фамилию написавшего' }, { uz: 'Yozgan odam necha yoshda ekanini', ru: 'Сколько лет написавшему' }, { uz: 'Yozgan odam pulni qachon berishini', ru: 'Когда написавший отдаст деньги' }], correct: 0 },
  { q: { uz: 'Mentor misolida tekshiruv javobi qanday?', ru: 'Каков ответ проверки в примере Ментора?' }, opts: [{ uz: 'Tuzatish: oltidan faqat uchtasi bor', ru: 'Исправление: из шести только три' }, { uz: "Tuzatish: bittasi 10 000 so'mda", ru: 'Исправление: одно — по 10 000 сумов' }, { uz: "Qabul: uch savolga ham «ha» bo'ldi", ru: 'Принято: на все три вопроса — «да»' }, { uz: 'Tekshirilmadi: sherik topilmadi', ru: 'Не проверено: партнёр не нашёлся' }], correct: 2 },
  { q: { uz: "O'zingiz yozib qo'ygan «tasdiq» tekshiruvda nima bo'ladi?", ru: 'Что будет на проверке с «подтверждением», которое вы написали сами?' }, opts: [{ uz: 'Qabul: unda narx yozilgan bo\'lsa', ru: 'Принято, если в нём есть цена' }, { uz: 'Tuzatish: uni odam o\'zi yozmagan', ru: 'Исправление: его не писал сам человек' }, { uz: 'Tuzatish: uchtaga yetmagani uchun', ru: 'Исправление: потому что меньше трёх' }, { uz: "Qabul: so'zma-so'z yozilgan bo'lsa", ru: 'Принято, если записано дословно' }], correct: 1 },
  { q: { uz: "Yozma tasdiq «hozir olmasangiz, qimmatlashadi» deb olindi. Nima bo'ladi?", ru: 'Подтверждение получено со словами «не купите сейчас — подорожает». Что будет?' }, opts: [{ uz: "Qabul: uni odamning o'zi yozgan", ru: 'Принято: его написал сам человек' }, { uz: 'Qabul: narx va nima uchun bor', ru: 'Принято: есть цена и «за что»' }, { uz: 'Tuzatish: narx juda qimmat chiqdi', ru: 'Исправление: цена получилась слишком высокой' }, { uz: 'Tuzatish: bosim bilan olingan', ru: 'Исправление: получено под давлением' }], correct: 3 },
  { q: { uz: "Mentor misolida yozma tasdiq kimlardan so'raldi?", ru: 'У кого просили подтверждение в примере Ментора?' }, opts: [{ uz: 'Tashkilotchilardan — Pro ular uchun', ru: 'У организаторов — Pro для них' }, { uz: "O'yinchilardan — ular ko'pchilik", ru: 'У игроков — их большинство' }, { uz: 'Sinfdoshlardan — ular hammasi tanish', ru: 'У одноклассников — все они знакомые' }, { uz: "Maydon egasidan — maydon o'ziniki", ru: 'У владельца поля — поле его' }], correct: 0 },
  { q: { uz: 'Yozma tasdiq bergan odamga nima yuboriladi?', ru: 'Что отправляют тому, кто дал подтверждение?' }, opts: [{ uz: "Havola — «mashq to'lov» sahifasiga", ru: 'Ссылку — на страницу «учебной оплаты»' }, { uz: "Iltimos — oldindan pulni o'tkazish", ru: 'Просьбу — заранее перевести деньги' }, { uz: "Hech narsa — pul ham, havola ham yo'q", ru: 'Ничего — ни денег, ни ссылки' }, { uz: 'Iltimos — do\'stlarini ham chaqirishni', ru: 'Просьбу — позвать и друзей' }], correct: 2 },
  { q: { uz: "Skrinshotni ko'rsatishdan oldin nimani yopasiz?", ru: 'Что закрываете перед тем, как показать скриншот?' }, opts: [{ uz: 'Odam yozib bergan narxni', ru: 'Цену, которую написал человек' }, { uz: 'Ism va telefon raqamini', ru: 'Имя и номер телефона' }, { uz: "Nima uchun to'layotganini", ru: 'За что он платит' }, { uz: 'Xabar kelgan kun va vaqtni', ru: 'День и время сообщения' }], correct: 1 },
  { q: { uz: 'Mentor xabarida qaysi gap bor?', ru: 'Какая фраза есть в сообщении Ментора?' }, opts: [{ uz: "«Bu to'lov emas — pul so'ramayman»", ru: '«Это не оплата — денег не прошу»' }, { uz: '«Hozir olmasangiz — qimmatlashadi»', ru: '«Не купите сейчас — подорожает»' }, { uz: '«Boshqa tashkilotchilar ham oldi»', ru: '«Другие организаторы уже взяли»' }, { uz: "«Do'stlaringizga ham yuborib qo'ying»", ru: '«Перешлите и друзьям»' }], correct: 0 },
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


// 🃏 KARTOCHKALAR (12) — MD «Kartochkalar (12)» jadvali aynan; alohida ekran, Mentorsiz (SABOQ 12, 16)
const KARTOCHKALAR = [
  { front: { uz: 'Bu darsda yozma tasdiq nima?', ru: 'Что на этом уроке письменное подтверждение?' }, back: { uz: "Odamning o'zi yozgan javobi: narx va nima uchun to'lashi bilan", ru: 'Ответ, который человек написал сам: с ценой и тем, за что заплатит' }, note: { uz: "Chat xabari yoki qog'oz", ru: 'Сообщение в чате или бумага' } },
  { front: { uz: 'Suhbat yozuvi bilan yozma tasdiqning farqi nima?', ru: 'Чем запись разговора отличается от письменного подтверждения?' }, back: { uz: "Suhbat yozuvini siz yozasiz, yozma tasdiqni — odamning o'zi", ru: 'Запись разговора пишете вы, подтверждение — сам человек' }, note: { uz: 'Mentor misolida: 6-darsdagi gapni Mentor yozgan edi', ru: 'В примере Ментора: слова с 6-го урока записал Ментор' } },
  { front: { uz: 'Yozma tasdiq bergan odamdan pul olinadimi?', ru: 'Берут ли деньги у того, кто дал письменное подтверждение?' }, back: { uz: "Yo'q — yozma tasdiq to'lov emas", ru: 'Нет — письменное подтверждение не оплата' }, note: { uz: "«Mashq to'lov» va to'lov sahifasi havolasi ham berilmaydi", ru: 'Ссылку на «учебную оплату» и страницу оплаты тоже не дают' } },
  { front: { uz: 'Yozma tasdiqdagi «nima uchun» nimani bildiradi?', ru: 'Что означает «за что» в письменном подтверждении?' }, back: { uz: "Odam nimaga pul to'lashini — Mentor misolida «Doimiy o'yin»", ru: 'За что человек заплатит — в примере Ментора «Постоянная игра»' }, note: { uz: "Sabab («charchadim» kabi) gapda qoladi", ru: 'Причина (вроде «устал») остаётся в словах' } },
  { front: { uz: 'Mentor nechta tashkilotchidan so\'radi va nechta yozma tasdiq oldi?', ru: 'Скольких организаторов спросил Ментор и сколько подтверждений получил?' }, back: { uz: '6 dan 3: ikkitasi 15 000 da, bittasi 10 000 da', ru: '3 из 6: два по 15 000, одно по 10 000' }, note: { uz: "2 — «hozir yo'q», 1 — javob bermadi", ru: '2 — «сейчас нет», 1 — не ответил' } },
  { front: { uz: 'Mentor tekshiruvi qaysi uch savolni beradi?', ru: 'Какие три вопроса задаёт проверка Ментора?' }, back: { uz: "Kim tasdiqladi? Narx va nima uchun yozilganmi? So'zma-so'z va bosimsiz olinganmi?", ru: 'Кто подтвердил? Записаны цена и «за что»? Получено дословно и без давления?' }, note: { uz: 'Javob — qabul yoki tuzatish', ru: 'Ответ — принято или исправление' } },
  { front: { uz: 'Uchtaga yetmagan yozma tasdiqlar tuzatishga qaytadimi?', ru: 'Возвращают ли на исправление, если подтверждений меньше трёх?' }, back: { uz: "Yo'q — halol natija va bitta keyingi qadam", ru: 'Нет — честный результат и один следующий шаг' }, note: { uz: "Tekshiruv halollikni ko'radi, sonni emas", ru: 'Проверка смотрит на честность, а не на число' } },
  { front: { uz: 'Qaysi «tasdiq» tuzatishga qaytadi?', ru: 'Какое «подтверждение» возвращают на исправление?' }, back: { uz: "O'zingiz yozgani, to'lovchi bo'lmagan odamniki yoki bosim bilan olingani", ru: 'Написанное вами, от того, кто не платит, или полученное под давлением' }, note: { uz: "Narxsiz javob ham — hali yozma tasdiq emas", ru: 'Ответ без цены — тоже ещё не подтверждение' } },
  { front: { uz: "«Hozir yo'q» degan odamga qayta yozasizmi?", ru: 'Пишете ли повторно тому, кто сказал «сейчас нет»?' }, back: { uz: "Yo'q — «hozir yo'q» ham natija", ru: 'Нет — «сейчас нет» тоже результат' }, note: { uz: 'Xabar bir marta yuboriladi', ru: 'Сообщение отправляют один раз' } },
  { front: { uz: 'Uchta yozma tasdiq nimani ko\'rsatadi?', ru: 'Что показывают три письменных подтверждения?' }, back: { uz: "Narx haqida dalil — lekin narx to'g'ri ekanining isboti emas", ru: 'Довод о цене — но не доказательство, что цена верна' }, note: { uz: 'Uch — kichik son', ru: 'Три — малое число' } },
  { front: { uz: "Yozma tasdiqni kimdan so'raysiz?", ru: 'У кого просите письменное подтверждение?' }, back: { uz: "Tanish to'lovchidan — ota-onangizga aytib", ru: 'У знакомого плательщика — сказав родителям' }, note: { uz: "Notanishga yozilmaydi; yozuvda ism yo'q", ru: 'Незнакомым не пишут; в записи нет имени' } },
  { front: { uz: "Skrinshot ko'rsatsangiz, nimani yopasiz?", ru: 'Что закрываете, если показываете скриншот?' }, back: { uz: 'Ism va telefon raqamini', ru: 'Имя и номер телефона' }, note: { uz: "Yozuvda ham — faqat rol", ru: 'В записи тоже — только роль' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('tv-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: tr(c.note) }))} />
          {!bosildi && <p className="tv-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + ①②③④; ④ holatdan; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: "tanish to'lovchilar", ru: 'знакомые плательщики' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: "uchtagacha yozma tasdiq — kam bo'lsa ham, halol natija", ru: 'до трёх подтверждений — даже если меньше, это честный результат' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_BANDLAR = [
  { uz: "Darsda yubormagan bo'lsangiz — xabaringizni tanish to'lovchilarga bir marta yuboring. Ota-onangizga ayting.", ru: 'Если не отправили на уроке — один раз отправьте сообщение знакомым плательщикам. Скажите родителям.' },
  { uz: "Javobni so'zma-so'z qog'ozga yozing: rol, narx, nima uchun, qachon — ismsiz. Skrinshot olsangiz — ism va telefon ko'rinmasin.", ru: 'Запишите ответ дословно на бумагу: роль, цена, за что, когда — без имени. Если делаете скриншот — имя и телефон не должны быть видны.' },
  { uz: "«Hozir yo'q» degan yoki javob bermagan odamga qayta yozmang — bu ham natija.", ru: 'Не пишите повторно тому, кто сказал «сейчас нет» или не ответил, — это тоже результат.' }
];
const HW_RAQAM = ['①', '②', '③', '④'];
const HW_TUZATISH = {
  kim: { uz: 'kim — boshqa haqiqiy to\'lovchini tanlang', ru: 'кто — выберите другого настоящего плательщика' },
  narx: { uz: "narx — aniqlashtirish kerak bo'lsa, faqat yetishmagan narsani bir marta so'rang", ru: 'цена — если нужно уточнить, один раз спросите только то, чего не хватает' },
  gap: { uz: "gap — xabardan aynan ko'chiring, bosim bilan olingan bo'lsa hisobga olmang va qayta yozmang", ru: 'слова — перепишите точно из сообщения; если получено под давлением — не считайте и не пишите повторно' }
};
// PM-109 (SABOQ P4): erta tugatgan o'quvchi — AI tanish to'lovchi rolida javob beradi, o'quvchi o'zi yozadi va uch savol bilan tekshiradi (sinfda gemini.google.com)
const AI_SOROV = { uz: "Sen «Maydon Jamoa»ga o'xshash ilovada har hafta o'yin e'lon qiladigan tashkilotchisan. Men senga bitta xabar yuboraman: narx va nima uchun to'lashing haqida so'rayman. Javobni o'zing tanla: narx va nima uchun bilan yozma javob, «hozir yo'q» yoki narxsiz qisqa javob. Pul o'tkazma, havola so'rama, mendan sotishni kutma. Mening xabarim: ",
  ru: 'Ты организатор, который каждую неделю объявляет игры в приложении вроде «Maydon Jamoa». Я пришлю тебе одно сообщение: спрошу о цене и за что ты заплатишь. Ответ выбери сам: письменный ответ с ценой и «за что», «сейчас нет» или короткий ответ без цены. Денег не переводи, ссылку не проси, продажи от меня не жди. Моё сообщение: ' };
const AiDavomCard = () => {
  const [nusxa, setNusxa] = useState(false);
  const kochir = () => { try { navigator.clipboard.writeText(tr(AI_SOROV)); setNusxa(true); setTimeout(() => setNusxa(false), 1800); } catch { /* qo'lda belgilab oladi */ } };
  return (
    <div className="card tv-ai fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Erta tugatdingizmi? AI bilan davom eting', ru: 'Закончили раньше? Продолжите с AI' })}</div>
      <p className="tv-ai-m">{tr({ uz: "gemini.google.com'ni oching, pastdagi so'rovni o'z xabaringiz bilan yuboring — AI tanish to'lovchi bo'lib javob beradi. Javobini so'zma-so'z yozib, uch savol bilan o'zingiz tekshiring; bu mashq — yozma tasdiqlaringiz soniga kirmaydi.", ru: 'Откройте gemini.google.com, отправьте запрос ниже со своим сообщением — AI ответит как знакомый плательщик. Запишите ответ дословно и сами проверьте его тремя вопросами; это упражнение — в число ваших подтверждений не входит.' })}</p>
      <pre className="tv-ai-sorov">{tr(AI_SOROV)}</pre>
      <button type="button" className="q-chip tv-ai-btn" onClick={kochir}>{nusxa ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: "So'rovni nusxalash", ru: 'Скопировать запрос' })}</button>
    </div>
  );
};
const HwCard = ({ qolgan, keyingi }) => (
  <div className="card tv-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="tv-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="tv-hw-q"><span className="tv-hw-k">{tr(r.k)}</span><span className="tv-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="tv-hw-qadam">
      {HW_BANDLAR.map((b, i) => <li key={i}><i>{HW_RAQAM[i]}</i><span>{tr(b)}</span></li>)}
      {qolgan && <li><i>{HW_RAQAM[3]}</i><span>{qolgan}</span></li>}
    </ol>
    <p className="tv-hw-ost">{tr({ uz: "Pul olmang va to'lov havolasini bermang — yozma tasdiq to'lov emas. Notanishga yozmang.", ru: 'Не берите денег и не давайте ссылку на оплату — письменное подтверждение не оплата. Не пишите незнакомым.' })}</p>
    {keyingi && <span className="tv-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (olti holat, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
// «Bugungi asosiy fikr» qutisi va artefakt-strip — ko'rsatilmaydi (E 50)
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
  // «Endi siz bilasiz» — MD 11-ekran aynan (asosiy fikr so'zma-so'z takrorlanmaydi — T-048)
  const RECAP = [
    { uz: "Bu darsda yozma tasdiq — odamning o'zi yozgan javobi: narx va nima uchun to'lashi bilan.", ru: 'На этом уроке письменное подтверждение — ответ, который человек написал сам: с ценой и тем, за что заплатит.' },
    { uz: "Yozma tasdiq — to'lov emas: pul olinmaydi, to'lov havolasi berilmaydi.", ru: 'Письменное подтверждение — не оплата: денег не берут, ссылку на оплату не дают.' },
    { uz: "Mentor tekshiruvi uch savol beradi: kim tasdiqladi, narx va nima uchun yozilganmi, so'zma-so'z va bosimsiz olinganmi.", ru: 'Проверка Ментора задаёт три вопроса: кто подтвердил, записаны ли цена и «за что», получено ли дословно и без давления.' },
    { uz: "Uchta yozma tasdiq — narx haqida dalil, lekin narx to'g'ri ekanining isboti emas.", ru: 'Три письменных подтверждения — довод о цене, но не доказательство, что цена верна.' },
    { uz: "Uchtaga yetmaslik — baho emas: halol natija va bitta keyingi qadam.", ru: 'Не набралось трёх — не оценка: честный результат и один следующий шаг.' }
  ];
  const k = tasdiqOl() || {};
  const tasdiqlar = Array.isArray(k.tasdiqlar) ? k.tasdiqlar : [];
  const tn = tasdiqlar.filter(t => t.hisobga !== false).length;
  const holat = isMentorL ? 'mentor'
    : k.tekshiruv === 'tuzatish' ? 'tuzatish'
      : tn > 0 && (k.tekshiruv === 'qabul' || k.tekshiruv === 'topilmadi') ? 'tekshirildi'
        : tn > 0 ? 'tekshiruvQoldi'
          : k.xabar && (k.soralgan || 0) > 0 ? 'yuborildi'
            : k.xabar ? 'tayyor' : 'yozilmagan';
  const SARLAVHA = {
    tekshirildi: { uz: <>{tn} ta yozma tasdiq <A>yozildi va tekshirildi.</A></>, ru: <>{tn} {ruKop(tn, ['письменное подтверждение', 'письменных подтверждения', 'письменных подтверждений'])} <A>{tn % 10 === 1 && tn % 100 !== 11 ? 'записано и проверено.' : 'записаны и проверены.'}</A></> },
    tuzatish: { uz: <>Yozuvlar tekshirildi — <A>bitta tuzatish qoldi.</A></>, ru: <>Записи проверены — <A>осталось одно исправление.</A></> },
    tekshiruvQoldi: { uz: <>Yozma tasdiqlar yozildi — <A>tekshiruv qoldi.</A></>, ru: <>Подтверждения записаны — <A>осталась проверка.</A></> },
    yuborildi: { uz: <>Xabar yuborildi — <A>yozma tasdiq hali yo'q.</A></>, ru: <>Сообщение отправлено — <A>подтверждений пока нет.</A></> },
    tayyor: { uz: <>Xabaringiz tayyor — <A>uni uyda yuborasiz.</A></>, ru: <>Ваше сообщение готово — <A>отправите его дома.</A></> },
    yozilmagan: { uz: <>Xabar hali yozilmagan — <A>uyda yozing.</A></>, ru: <>Сообщение ещё не написано — <A>напишите дома.</A></> },
    mentor: { uz: <>Kim haqiqatan <A>to'lashga tayyor?</A></>, ru: <>Кто действительно <A>готов платить?</A></> }
  };
  const faolN = tn;
  const qolganlar = isMentorL ? [] : [
    k.tekshiruv === 'tuzatish' && `${tr({ uz: 'Tuzatish qoldi', ru: 'Осталось исправление' })}: ${tr(HW_TUZATISH[k.tuzatishSabab] || HW_TUZATISH.kim)}`,
    tn > 0 && !k.tekshiruv && tr({ uz: "Tekshiruv qoldi: uch savolni o'zingizga bering", ru: 'Осталась проверка: задайте себе три вопроса' }),
    k.xabar && faolN < 3 && !k.keyingiQadam && tr({ uz: "Keyingi qadam qoldi: bitta ishni qog'ozga yozing", ru: 'Остался следующий шаг: запишите одно дело на бумаге' })
  ].filter(Boolean);
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: taklif havolasi va mukofot»</b></>, ru: <>Следующий урок — <b>«День проекта: ссылка-приглашение и награда»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('tv-yakun', holat !== 'tekshirildi' && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={tr(SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
            {!isMentorL && <AiDavomCard />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard qolgan={qolganlar.length ? qolganlar.join(' · ') : null} keyingi={keyingi} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(t => ({ ...t, t: tr(t.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmPayCheckLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === «TASDIQ VARAG'I» — darsning bitta vizuali (tv-): faqat qolip tokenlari (D3), emoji yo'q (D4), rangli yon chiziq yo'q === */
        .tv-mj { color: ${MAYDON_RANG}; font-weight: 800; white-space: nowrap; }
        p.tv-kulrang, span.tv-kulrang { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        p.tv-kulrang.katta { font-size: 15px; font-weight: 600; }
        .tv-mq { display: flex; flex-direction: column; gap: 9px; min-width: 0; }
        p.tv-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .tv-ip-m { display: none; }
        .tv-uch { position: fixed; z-index: 1200; pointer-events: none; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: ${T.ok}; background: ${T.paper}; border: 1.5px solid ${T.ok}; border-radius: 10px; padding: 4px 10px; white-space: nowrap; max-width: 240px; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); animation: tv-uch 0.95s cubic-bezier(.4,0,.2,1) forwards; }
        .tv-tx { display: block; margin-bottom: 5px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .tv-tx b { color: ${T.ink}; } .tv-tx.ok, .tv-tx.ok b { color: ${T.ok}; } .tv-tx b.yoq { color: ${T.err}; }
        .q-xulosa .tv-x-m { display: block; }
        .q-xulosa .tv-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.2)}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .tv-bashq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 8px 14px; border-radius: 12px; background: ${T.accentSoft}; font-size: 13px; color: ${T.ink2}; }
        .tv-bashq-t b { color: ${T.accent}; }
        .tv-ustoz { display: flex; flex-direction: column; gap: 4px; margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .tv-ustoz b { color: ${T.ink}; }
        /* telefon (SABOQ 22: ≈170×272, chapda, o'lchami barqaror) */
        .tv-telj { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; flex: none; }
        .tv-tel { width: 170px; height: 272px; flex: none; display: flex; flex-direction: column; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px 8px 10px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .tv-tel-bar { display: flex; align-items: center; gap: 6px; height: 24px; flex: none; padding: 0 4px 6px; border-bottom: 1px solid ${T.line}; font-size: 12px; }
        .tv-tel-bar.ilova { justify-content: center; font-size: 13px; }
        .tv-tel-orqa { font-size: 16px; line-height: 1; color: ${T.ink2}; }
        .tv-tel-sar { font-size: 12px; font-weight: 800; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: tv-kir .35s ease-out both; }
        .tv-chat { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 6px; padding-top: 7px; overflow-y: auto; scrollbar-width: none; }
        .tv-chat::-webkit-scrollbar { display: none; }
        .tv-pf { max-width: 92%; padding: 6px 8px; border-radius: 10px; font-size: 10.5px; line-height: 1.38; color: ${T.ink}; overflow-wrap: anywhere; }
        .tv-pf.men { align-self: flex-end; background: ${T.accentSoft}; border-bottom-right-radius: 3px; }
        .tv-pf.u { align-self: flex-start; background: ${T.bg}; border: 1px solid ${T.line}; border-bottom-left-radius: 3px; animation: tv-kir .4s ease-out both; }
        .tv-pf.u.err { background: ${T.errFon}; border-color: ${fon(T.err, 0.5)}; }
        .tv-pf.nuqta { font-size: 14px; letter-spacing: 2px; padding: 2px 10px; }
        .tv-pf-y { display: block; margin-top: 3px; font-size: 10px; font-weight: 800; color: ${T.ok}; text-align: right; }
        p.tv-ust { max-width: 200px; font-size: 11.5px; }
        .tv-ilova { flex: 1; display: flex; flex-direction: column; gap: 6px; padding-top: 8px; }
        .tv-ilova-y { font-size: 10.5px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .06em; }
        .tv-oyin { display: flex; flex-direction: column; gap: 3px; padding: 9px 10px; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.bg}; font-size: 11px; color: ${T.ink2}; }
        .tv-oyin b { font-size: 13px; color: ${T.ink}; }
        .tv-oyin-s { position: relative; display: flex; justify-content: flex-end; margin-top: 4px; padding-top: 8px; font-weight: 800; color: ${MAYDON_RANG}; white-space: nowrap; }
        .tv-oyin-s::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 5px; border-radius: 99px; background: ${T.line}; }
        .tv-oyin-s i { position: absolute; left: 0; top: 0; height: 5px; border-radius: 99px; background: ${MAYDON_RANG}; z-index: 1; }
        .tv-rol { font-size: 12px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 99px; padding: 3px 10px; }
        /* 0-ekran maketi */
        .tv-hook { display: flex; gap: 16px; align-items: flex-start; }
        .tv-bolak { width: 230px; display: flex; flex-direction: column; gap: 6px; margin-top: 30px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.3); }
        .tv-bolak-h { font-size: 11px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .04em; }
        .tv-bolak-kim { font-size: 13px; color: ${T.ink}; }
        .tv-bolak-gap { font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .tv-bolak-q { display: flex; gap: 8px; align-items: center; border-radius: 8px; padding: 3px 6px; margin: 0 -6px; }
        .tv-bolak.yon .tv-bolak-q { animation: tv-yon 1.4s ease-out 1; }
        .tv-bolak-n { font-size: 14px; color: ${T.ink}; white-space: nowrap; }
        @media (min-width: 761px) { .tv-k .q-split { grid-template-columns: 430px minmax(0, 1fr); gap: 28px; } }
        .tv-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: tv-chorla-v 1.8s ease-out .5s 2; }
        .tv-k.kutish .q-variant:nth-child(2) { animation-delay: .8s; } .tv-k.kutish .q-variant:nth-child(3) { animation-delay: 1.1s; }
        .tv-ovoz { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
        .tv-ovoz-q { display: grid; grid-template-columns: minmax(0,1fr) 90px 26px; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .tv-ovoz-q.men { color: ${T.ink}; font-weight: 700; }
        .tv-ovoz-y { height: 6px; border-radius: 99px; background: ${T.line}; overflow: hidden; } .tv-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width .5s; }
        /* varaq */
        .tv-varaq { display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.3); }
        .tv-varaq-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 30px; }
        .tv-varaq-s { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .tv-muhr { flex: none; display: inline-flex; align-items: center; justify-content: center; min-width: 74px; padding: 4px 12px; border-radius: 10px; border: 2px solid ${T.ok}; color: ${T.ok}; font-size: 13px; font-weight: 800; letter-spacing: .02em; transform: rotate(-4deg); animation: tv-muhr .55s cubic-bezier(.3,1.4,.5,1) both; white-space: nowrap; }
        .tv-muhr.tuz { border-color: ${T.accent}; color: ${T.accent}; }
        .tv-muhr.bosh { border: 1.5px dashed ${T.line}; color: ${fon(T.ink2, 0.7)}; font-weight: 600; font-size: 11px; transform: none; animation: none; }
        .tv-pro, .tv-xabar { display: block; text-align: left; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .tv-xabar { color: ${T.ink}; }
        .tv-jw { min-width: 0; }
        .tv-jadval { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 10px; overflow: hidden; background: ${T.bg}; }
        .tv-jq { display: grid; grid-template-columns: var(--cols); align-items: stretch; border-top: 1px solid ${T.line}; animation: tv-kir .35s ease-out both; animation-delay: calc(var(--i, 0) * 70ms); }
        .tv-jq.sar { border-top: none; background: ${T.ink}; animation: none; }
        .tv-jq.sar .tv-ustun { padding: 6px 8px; font-size: 11px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: .04em; }
        .tv-jq.yangi { animation: tv-yangi 1.1s ease-out 1; }
        .tv-jq.joriy { background: ${T.accentSoft}; }
        .tv-jq.err { animation: tv-silk .4s ease 1; }
        .tv-jq.kul > .tv-katak { opacity: .55; }
        .tv-katak { display: flex; align-items: center; gap: 4px; min-width: 0; padding: 5px 8px; font: inherit; font-size: 12px; line-height: 1.36; color: ${T.ink}; text-align: left; background: transparent; border: none; overflow-wrap: anywhere; }
        .tv-katak.k { font-weight: 700; overflow-wrap: normal; word-break: keep-all; } .tv-katak.nw { white-space: nowrap; } .tv-kt { min-width: 0; } .tv-katak.n { font-weight: 800; white-space: nowrap; } .tv-katak.g { font-size: 11.5px; }
        button.tv-katak { cursor: pointer; border-radius: 0; transition: background .2s; }
        button.tv-katak:disabled { cursor: default; }
        button.tv-katak:not(:disabled):hover { background: ${T.accentSoft}; }
        .tv-katak.chorla { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; }
        button.tv-katak.chorla { animation: tv-chorla-v 1.8s ease-out .4s 2; }
        .tv-katak.yon { background: ${T.okFon}; }
        span.tv-katak.yon { position: relative; }
        span.tv-katak.yon::after { content: '✓'; position: absolute; top: 2px; right: 2px; font-size: 10px; line-height: 1; font-weight: 800; color: ${T.ok}; }
        .tv-katak.silk { animation: tv-silk .4s ease 1; background: ${T.errFon}; }
        .tv-pro.tv-katak, .tv-xabar.tv-katak { display: block; padding: 6px 8px; border-radius: 8px; }
        .tv-uzuq { display: block; width: 100%; height: 14px; border-bottom: 1.5px dashed ${fon(T.ink2, 0.45)}; }
        .tv-hb { display: inline-block; padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight: 800; white-space: nowrap; animation: tv-kir .35s ease-out both; }
        .tv-hb.ok { background: ${T.okFon}; color: ${T.ok}; } .tv-hb.kul { background: ${fon(T.ink2, 0.12)}; color: ${T.ink2}; }
        .tv-hisob { display: flex; flex-wrap: wrap; gap: 6px; }
        .tv-h { font-size: 12px; color: ${T.ink2}; padding: 3px 9px; border-radius: 99px; background: ${T.bg}; border: 1px solid ${T.line}; white-space: nowrap; }
        .tv-h b { color: ${T.ink}; display: inline-block; animation: tv-son .4s cubic-bezier(.3,1.5,.5,1); }
        .tv-h.ok { color: ${T.ok}; border-color: ${fon(T.ok, 0.4)}; background: ${T.okFon}; } .tv-h.ok b { color: ${T.ok}; }
        .tv-h.yon { border-color: ${fon(T.ok, 0.6)}; background: ${T.okFon}; }
        p.tv-halol { font-weight: 600; }
        .tv-tekyorliq { align-self: flex-start; font-size: 11.5px; font-weight: 800; color: ${T.ok}; text-transform: uppercase; letter-spacing: .05em; }
        p.tv-kq { margin: 0; font-size: 13px; color: ${T.ink}; padding: 6px 10px; border-radius: 8px; background: ${T.accentSoft}; }
        .tv-kq b { color: ${T.accent}; }
        /* joylashuv */
        .tv-ikki { display: grid; grid-template-columns: 172px minmax(0, 1fr); gap: clamp(14px, 2vw, 22px); align-items: start; }
        .tv-ikki.s4 { grid-template-columns: minmax(0, 2.2fr) minmax(220px, 0.9fr); }
        .tv-fokus .tv-varaq { padding: 10px 14px; gap: 6px; }
        .tv-fokus .tv-katak { padding-top: 3px; padding-bottom: 3px; }
        .tv-fokus .tv-varaq-h { min-height: 24px; }
        .tv-hisob-q { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; }
        .tv-s2 { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .tv-s2-ust { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 8px 18px; }
        .tv-s2-ust > .tv-katakcha { padding-top: 8px; }
        .tv-s2-ust > .tv-harakat { flex: 1; min-width: 260px; }
        .tv-qism .q-qadamlar { display: flex; flex-direction: row; flex-wrap: wrap; gap: 6px 20px; }
        .tv-ish.bir { grid-template-columns: minmax(0, 1fr); }
        .tv-ish.tel { grid-template-columns: 172px minmax(0, 1fr); }
        .tv-qator2.kb { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); align-items: start; }
        .tv-bk { display: flex; flex-direction: column; gap: 4px; }
        .tv-qator3 { display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr) minmax(0, 1fr); gap: 8px; }
        .tv-karta > .q-tugma { align-self: flex-start; }
        .tv-o { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .tv-tkol { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .tv-fokus { display: flex; flex-direction: column; gap: 12px; min-width: 0; animation: tv-kir .5s ease-out both; }
        .q-mustaqil:has(.tv-ish), .q-mustaqil:has(.tv-fokus), .q-mustaqil:has(.tv-ikki) { max-width: none; }
        .tv-ish { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(14px, 2vw, 22px); align-items: start; }
        .tv-ish.s7 { grid-template-columns: minmax(0, 1.6fr) minmax(230px, 1fr); }
        .tv-katakcha { display: flex; align-items: center; gap: 5px; }
        .tv-katakcha span { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; margin-right: 2px; white-space: nowrap; }
        .tv-katakcha i { width: 20px; height: 20px; border-radius: 6px; border: 1.5px dashed ${fon(T.ink2, 0.45)}; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 10.5px; font-weight: 800; color: ${T.ink2}; }
        .tv-katakcha i.oldi { border-style: solid; border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; }
        .tv-katakcha i.joriy { border-style: solid; border-color: ${T.accent}; color: ${T.accent}; }
        .tv-harakat { display: flex; flex-direction: column; gap: 8px; }
        .tv-tugmalar { display: flex; flex-wrap: wrap; gap: 8px; }
        .tv-tugmalar.silk { animation: tv-silk .4s ease 1; }
        .tv-chorla > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: tv-chorla 1.8s ease-out .4s 2; }
        .tv-chorla > :nth-child(2) { animation-delay: .65s; } .tv-chorla > :nth-child(3) { animation-delay: .9s; } .tv-chorla > :nth-child(4) { animation-delay: 1.15s; }
        .tv-skol { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .tv-sq-done { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 10px; background: ${T.okFon}; font-size: 12.5px; color: ${T.ink}; }
        .tv-sq-done b { color: ${T.ok}; } .tv-sq-done em { margin-left: auto; font-style: normal; font-weight: 800; color: ${T.ok}; }
        .tv-savol { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.5)}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.35); animation: tv-kir .4s ease-out both; }
        .tv-savol.yopiq { opacity: .6; }
        .tv-savol-n { font-size: 11px; font-weight: 800; color: ${T.accent}; letter-spacing: .05em; }
        .tv-savol-s { font-size: 16px; line-height: 1.3; color: ${T.ink}; }
        .tv-savol-q { font-size: 13px; line-height: 1.45; color: ${T.ink2}; } .tv-savol-q b { color: ${T.ink}; }
        /* mustaqil ish: karta, maydonlar (E 43 — yorliq input ichida) */
        .tv-karta { display: flex; flex-direction: column; gap: 9px; min-width: 0; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.45)}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.35); animation: tv-kir .4s ease-out both; }
        .tv-karta-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .tv-karta-h em { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .tv-karta-s { font-size: 14px; color: ${T.ink}; }
        .tv-kirit { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 0 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.bg}; transition: border-color .2s; }
        .tv-kirit.matn { align-items: flex-start; padding-top: 8px; }
        .tv-kirit:focus-within { border-color: ${T.accent}; background: ${T.paper}; }
        .tv-kirit.halqa { border-color: ${fon(T.accent, 0.6)}; }
        .tv-kirit.err { border-color: ${T.err}; background: ${T.errFon}; }
        .tv-kirit > i, i.tv-n { flex: none; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; }
        .tv-kirit-y { flex: none; font-size: 12px; color: ${T.ink2}; white-space: nowrap; }
        .tv-kirit input, .tv-kirit textarea { flex: 1; min-width: 0; border: none; background: transparent; outline: none; padding: 9px 0; font-family: 'Manrope', sans-serif; font-size: 13.5px; color: ${T.ink}; resize: none; }
        .tv-kirit textarea { padding: 0 0 8px; line-height: 1.45; }
        .tv-qator2 { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 8px; }
        .tv-belgilar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .tv-belgilar.err { padding: 4px; border-radius: 10px; background: ${T.errFon}; }
        .tv-tugmaq { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .tv-tugmaq > .tv-kirit { flex: 1; min-width: 150px; }
        .tv-yordam-b { margin-left: auto; }
        .tv-yordam { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .tv-yordam p { margin: 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; }
        button.tv-kichik { align-self: flex-start; background: none; border: none; padding: 2px 0; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
        button.tv-kichik:hover { color: ${T.accent}; }
        .tv-qolip { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; font-size: 13.5px; line-height: 1.6; color: ${T.ink}; }
        .tv-joy { border: 1.5px dashed ${fon(T.ink2, 0.5)}; border-radius: 8px; background: ${T.bg}; padding: 4px 8px; font-family: 'Manrope', sans-serif; font-size: 13.5px; color: ${T.ink}; outline: none; }
        .tv-joy:focus { border-style: solid; border-color: ${T.accent}; background: ${T.paper}; }
        .tv-joy.keng { width: 210px; } .tv-joy.orta { width: 96px; } .tv-joy.qisqa { width: 54px; }
        .tv-joy.halqa { border-color: ${fon(T.accent, 0.6)}; } .tv-joy.err { border-color: ${T.err}; background: ${T.errFon}; }
        p.tv-ozgarmas { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 13.5px; color: ${T.ink}; }
        .tv-oz-y { font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: ${T.ink2}; background: ${fon(T.ink2, 0.12)}; padding: 2px 6px; border-radius: 6px; }
        .tv-ota { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; font-size: 13px; color: ${T.ink}; cursor: pointer; }
        .tv-ota.halqa { border-color: ${fon(T.accent, 0.6)}; }
        .tv-ota input { width: 16px; height: 16px; accent-color: ${T.accent}; }
        .tv-rollar { display: flex; flex-wrap: wrap; gap: 6px; }
        .tv-ixcham { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; color: ${T.ink2}; }
        .tv-ixcham > b { color: ${T.ink}; } .tv-ixcham span b { color: ${T.ink}; display: inline-block; animation: tv-son .4s cubic-bezier(.3,1.5,.5,1); } .tv-ixcham .ok, .tv-ixcham .ok b { color: ${T.ok}; }
        .tv-yozuvlar { display: flex; flex-direction: column; gap: 6px; min-width: 0; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .tv-yozuvlar-h { display: flex; justify-content: space-between; font-size: 13.5px; color: ${T.ink}; } .tv-yozuvlar-h span { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .tv-yozuv { display: flex; align-items: flex-start; gap: 6px; padding: 6px 8px; border-radius: 8px; background: ${T.bg}; font-size: 12px; line-height: 1.4; color: ${T.ink}; }
        .tv-yozuv.yangi { animation: tv-yangi 1.2s ease-out 1; }
        .tv-yozuv-m { flex: 1; min-width: 0; overflow-wrap: anywhere; }
        .tv-tur { flex: none; font-size: 10.5px; font-weight: 800; padding: 1px 6px; border-radius: 6px; color: ${T.ink2}; background: ${fon(T.ink2, 0.12)}; }
        .tv-tur.ok { color: ${T.ok}; background: ${T.okFon}; }
        .q-chip.tv-tahrir { flex: none; padding: 0 6px; min-height: 22px; font-size: 12px; margin-left: auto; }
        button.tv-tanla { display: flex; flex-direction: column; gap: 2px; text-align: left; padding: 8px 10px; border-radius: 10px; border: 1.5px solid ${fon(T.accent, 0.5)}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 12.5px; color: ${T.ink2}; cursor: pointer; }
        button.tv-tanla b { color: ${T.ink}; font-size: 13px; }
        /* test ostidagi kichik varaq bo'lagi */
        .tv-tviz { margin-top: 4px; }
        .tv-mini { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; color: ${T.ink2}; }
        .tv-mini-q { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; } .tv-mini-q b { color: ${T.ink}; }
        .tv-mini-k { padding: 3px 9px; border-radius: 6px; } .tv-mini-k.ok { background: ${T.okFon}; color: ${T.ok}; }
        .tv-mini-y { font-weight: 700; color: ${T.ok}; }
        .tv-mini-muhr { padding: 3px 10px; border-radius: 8px; border: 2px solid ${T.accent}; color: ${T.accent}; font-weight: 800; transform: rotate(-3deg); }
        .tv-mini-kq { padding: 3px 10px; border-radius: 8px; background: ${T.accentSoft}; color: ${T.accent}; font-weight: 800; }
        /* kartochka va yakun */
        .tv-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: tv-chorla 1.8s ease-out .4s 3; }
        p.tv-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.tv-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .card.tv-ai { display: block; }
        .tv-varaq.tv-reja { gap: 10px; }
        .q-chip.tv-tugma { font-weight: 700; }
        .tv-ai-m { margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .tv-ai-sorov { margin: 0 0 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; white-space: pre-wrap; }
        .tv-ai-btn { margin: 0; }
        .tv-hw { display: flex; flex-direction: column; gap: 12px; }
        .tv-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .tv-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .tv-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .tv-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.tv-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .tv-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .tv-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        p.tv-hw-ost { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .tv-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .tv-yakun { display: contents; }
        .tv-yakun.belgisiz .done-chip .tick { display: none; }
        @media (max-width: 760px) {
          .tv-ikki, .tv-ikki.s4, .tv-ish, .tv-ish.s7 { grid-template-columns: minmax(0, 1fr); }
          .tv-hook { flex-direction: column; align-items: center; } .tv-bolak { margin-top: 0; width: 100%; max-width: 320px; }
          .tv-tkol, .tv-telj { align-items: center; }
          .tv-jw { overflow-x: auto; } .tv-jadval { min-width: 548px; }
          .tv-ip-d { display: none; } .tv-ip-m { display: inline; }
          .tv-qator2, .tv-qator2.kb, .tv-qator3, .tv-ish.tel { grid-template-columns: minmax(0, 1fr); }
          .tv-hw-karta { grid-template-columns: minmax(0, 1fr); }
          .tv-joy.keng { width: 100%; }
        }
        @media (min-width: 761px) {
          .zoomable:not(.zoom-on) > .tv-fokus > .tv-varaq:first-child > .tv-varaq-h, .zoomable:not(.zoom-on) > .tv-ikki.s4 > .tv-o:first-child > .tv-varaq:first-child > .tv-varaq-h { padding-right: 36px; }
          .q-reja .zoomable:not(.zoom-on) .q-split > .q-col:first-child > .q-yorliq:first-child { display: flex; align-items: center; min-height: 36px; padding-right: 40px; }
        }
        @keyframes tv-uch { 0% { transform: none; opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(0.85); opacity: 0.15; } }
        @keyframes tv-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes tv-yangi { 0% { background: ${fon(T.ok, 0.28)}; } 100% { background: transparent; } }
        @keyframes tv-yon { 0%, 60% { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.6)}; } 100% { background: transparent; box-shadow: none; } }
        @keyframes tv-son { from { transform: translateY(-5px); opacity: .3; } to { transform: none; opacity: 1; } }
        @keyframes tv-silk { 0%, 100% { transform: none; } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        @keyframes tv-muhr { 0% { opacity: 0; transform: rotate(-4deg) scale(1.6); } 100% { opacity: 1; transform: rotate(-4deg) scale(1); } }
        @keyframes tv-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes tv-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        @media (prefers-reduced-motion: reduce) {
          .tv-uch { display: none; }
          .tv-tel-sar, .tv-pf.u, .tv-bolak.yon .tv-bolak-q, .tv-k.kutish .q-variant, .tv-muhr, .tv-jq, .tv-jq.yangi, .tv-jq.err, .tv-katak.silk, button.tv-katak.chorla, .tv-hb, .tv-h b, .tv-fokus, .tv-tugmalar.silk,
          .tv-chorla > .q-chip, .tv-savol, .tv-karta, .tv-yozuv.yangi, .tv-ixcham span b, .tv-flash .fc-front { animation: none !important; }
        }
        /* ⛶ oynasi (E 48): ikki klassli selektor — keyingi .zoomable { position: relative } uni bekor qilmaydi */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(980px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        /* 13-Modul sinf-supurish B: ⛶ oynasi faqat ko'rish uchun — maket ichidagi tugma (telefon tugmasi, jadval katagi, belgi) oynada bosilmaydi, harakat ⛶ dan tashqarida qoladi. Kirish ekrani variantlari va maket tugmasi qolipniki — tegilmaydi. */
        .zoom-on button:not(.zoom-btn) { pointer-events: none; cursor: default; }
        .q-kirish .zoom-on button { pointer-events: auto; cursor: pointer; }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
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
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(255,79,40,0.55), 0 0 3px rgba(255,79,40,0.4); }
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
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
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }

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
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(255,79,40,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink2}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(255,79,40,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
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
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(255,79,40,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(255,79,40,0.55); } }
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
        .mstats-chip.ansc { background: rgba(255,79,40,0.10); } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.accent}; }
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
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(255,79,40,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.55); }
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
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
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
        .qz-pchip.me { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border-color: transparent; box-shadow: 0 0 22px rgba(255,79,40,0.45); }
        @keyframes qz-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .qz-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 26px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 14px 26px -10px rgba(255,79,40,0.6), inset 0 2px 0 rgba(255,255,255,0.3); transition: transform 0.18s; }
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
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 0 rgba(255,79,40,0.4); } 70%,100% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 8px rgba(255,79,40,0); } }
        .bnode.on { opacity: 1; transform: scale(1); }
        .bnode.trig.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.3); }
        .bnode.sheet.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.3); }
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
        .itm-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -8px rgba(255,79,40,0.3); }

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
        .fl-node.on { opacity: 1; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 18px -4px rgba(255,79,40,0.45); transform: translateY(-3px); animation: fl-pulse 1.1s infinite ease-in-out; }
        @keyframes fl-pulse { 0%,100% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 16px -6px rgba(255,79,40,0.4); } 50% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 24px -2px rgba(255,79,40,0.65); } }
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
