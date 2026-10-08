import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul 4-dars «Narxni qanday belgilaysiz?» — PM+PRAKT, 12 ekran (08.10.2026, 2-to'lqin, skeletdan); MD: feedback/F-1007-13modul/04-PmPricing-v3.md (manba-haqiqat)
// Ekranlar: s0 QKirish · s1 QReja · s2 QTushuncha (narx varag'i) · s3 savol · s4 QTushuncha (to'lov taklifi ekrani) · s5 QMustaqil (5 karta) ·
//   a1, a2 QBlok + ScreenBlok · s8 yakuniy savol · podium · QKartochka · QYakun (besh holat).
// Bitta vizual — NarxSahna bo'laklari (Tel · TaklifEkran · ElonEkran · MashqSahifa · Varaq · BackendTugun · Yol), manba NARX.
// Kalitlar (tayanch 8): o'qiydi pm-m11d1-birlik, pm-m11d2-model, pm-m11d3-oqim, pm-m9d8-platforma · yozadi pm-m11d4-narx (6-dars TelefonEkran o'qiydi).
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun, QChip, QXato, QXulosa, QMustaqil, QQadamlar } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m11d4-v1', lessonTitle: { uz: 'Narxni qanday belgilaysiz?', ru: 'Как назначить цену?' } };
// 12 ekran (PM+PRAKT, tayanch 4): kirish → reja → tushuncha → savol → tushuncha → mustaqil ish → Amaliyot 1 → Amaliyot 2 → yakuniy savol → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'narx', ru: 'цена' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'xarajat', ru: 'расходы' }, l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'qiymat', ru: 'ценность' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'Pro', ru: 'Pro' }, l: 80, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `s15` — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi — shu map ular bilan sinxron bo'lsin.
// ⚡ To'g'ri javob pozitsiyalari ATAYIN har xil (3 · 0 · 2 · 3) — «doim A» naqshi yo'q, o'qimay bosgan ball to'plamaydi.
// s15 (yakuniy debug) — REAL kalit: picked=0 → 1-urinishda topdi (to'g'ri), picked=1 → 1-urinishda xato bosdi.
const INLINE_KEYS = { s3: 1, s8: 3, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: "Narx varag'i", ru: 'Лист цены' },
    cards: [
      { ic: '1', h: { uz: "Bu darsda narxga to'rt qator bilan qaraladi: xarajat, raqobat, qiymat va narx.", ru: 'На этом уроке на цену смотрят через четыре строки: расходы, конкуренция, ценность и цена.' } },
      { ic: '2', h: { uz: 'Raqobat — odam bugun shu ishni nima bilan qilishi.', ru: 'Конкуренция — то, чем человек сегодня делает это дело.' } },
      { ic: '3', h: { uz: 'Mentor misolida raqobat — bepul Telegram guruhi.', ru: 'В примере Ментора конкуренция — бесплатная Telegram-группа.' }, ask: { uz: 'Mahsulotingiz bajaradigan ishni odamlar hozir nima bilan qiladi?', ru: 'Чем люди сейчас делают то, что делает ваш продукт?' } }
    ]
  },
  8: {
    title: { uz: 'Pro holati', ru: 'Статус Pro' },
    cards: [
      { ic: '1', h: { uz: "Pro'ni Backend to'lov xabari kelgandan keyin yoqadi.", ru: 'Pro включает Backend после того, как пришло сообщение об оплате.' } },
      { ic: '2', h: { uz: "Ilova Pro holatini Backend'dan qayta so'rab biladi.", ru: 'Приложение узнаёт статус Pro, снова спросив Backend.' } },
      { ic: '3', h: { uz: 'Sahifadagi yozuv ham, telefondagi belgi ham — Pro holati emas.', ru: 'Ни надпись на странице, ни метка в телефоне — не статус Pro.' }, ask: { uz: "Ilova Pro'ni o'zi yoqsa, nima bo'lardi?", ru: 'Что было бы, если бы приложение включало Pro само?' } }
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
            {vizual && (isMentorLive ? mReveal : (solved && !waiting)) && <div className="pz-q-viz fade-step">{vizual}</div>}
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

// ===== DARSNING O'Z VIZUALI — «Narx va to'lov yo'li» sahnasi (NarxSahna, 163/180): bitta manba NARX; o'quvchi ma'lumoti — pm-m11d4-narx =====
// qolip-maket: ns-uxlaydi ns-bugun ns-belgi ns-tolovga ns-tolash pz-xr pz-muddat pz-v-tahrir pz-ms-tahrir pz-qq-t pz-ed
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const NB = String.fromCharCode(160);
const nbs = (s) => (typeof s === 'string' ? s.replace(/(\d) (?=\d{3}(?!\d))/g, '$1' + NB).replace(/ \/ /g, NB + '/' + NB) : s);
const tn = (o) => nbs(tr(o));
const sonFmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NB);
const halqa = (on) => (on ? 'pz-halqa' : undefined);
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor') }; };
// O'qituvchi eslatmasi — faqat Mentor jonli rejimida (03 `Ustoz` naqshi); matn MD dan, ekran raqami hisoblagich bo'yicha (SABOQ P8, P15)
const Ustoz = ({ satrlar }) => (useJonli().isMentor ? <div className="pz-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((q, i) => <span key={i}>{tx(q)}</span>)}</div> : null);
const USTOZ = {
  s0: [
    { uz: "Javoblarni muhokama qilmang — Mentor narx varag'i 3-ekranda. Sinfdan so'rang: «1-darsda narxni qanday topgan edingiz?» (son yig'ilmaydi, qo'l ko'tartirilmaydi). 1-darsda narx yozmagan o'quvchi Mentor taxminini ko'radi; o'z narxini 6-ekranda yozadi.", ru: 'Не обсуждайте ответы — лист цены Ментора на 3-м экране. Спросите класс: «Как вы нашли цену на 1-м уроке?» (числа не собираем, руки не поднимаем). Ученик, не записавший цену на 1-м уроке, видит предположение Ментора; свою цену запишет на 6-м экране.' }
  ],
  s1: [
    { uz: "3-darsdagi Amaliyot 1 va 2 (webhook, mashq sahifasi) tugamagan o'quvchi bugun avval o'shani tugatadi: bu darsning Amaliyot 2 si 3-darsdagi sahifaga tayanadi; ulgurmasa A2 uyga qoladi — yakun shuni aytadi.", ru: 'Ученик, не закончивший Практику 1 и 2 3-го урока (webhook, учебная страница), сегодня сначала заканчивает её: Практика 2 этого урока опирается на страницу из 3-го урока; если не успеет — A2 остаётся на дом, итог урока это скажет.' },
    { uz: "Modul boshidagi gapni eslating: bu modulda hech kim haqiqiy pul to'lamaydi — to'lovlar test rejimda, narxlar taxmin.", ru: 'Напомните сказанное в начале модуля: в этом модуле никто не платит настоящих денег — платежи в тестовом режиме, цены — предположения.' }
  ],
  s2: [
    { uz: "Render'ning pullik xizmati — narx hisobi uchun; hech kim pullik xizmatga o'tmaydi. «Hammasi olsa ham» — eng yaxshi holat: hamma tashkilotchi Pro olishi ma'lum emas. Uch qator — formula emas: raqobat va qiymat sonni hisoblamaydi, qarorga ta'sir qiladi; hisobda faqat taxminiy pullik Backend bor (komissiya, boshqa xizmatlar yo'q). Narx keyingi darslarda real odamlar bilan tekshiriladi — o'quvchiga buni va'da qilmang.", ru: 'Платный сервис Render — для расчёта цены; никто на платный сервис не переходит. «Даже если возьмут все» — лучший случай: неизвестно, возьмёт ли Pro каждый организатор. Три строки — не формула: конкуренция и ценность не считают число, а влияют на решение; в расчёте только примерный платный Backend (комиссий и других сервисов нет). Цену на следующих уроках проверят на реальных людях — ученикам этого не обещайте.' },
    { uz: "Sinfga savol: «Telegram guruhi bepul bo'lsa, tashkilotchi nega pul to'laydi?» — mumkin javob: guruh har hafta e'lonni o'zi yozmaydi, Pro esa yozadi. Model nomi (2-dars — bepul asos va pullik qo'shimcha) shu yerda eslatilishi mumkin.", ru: 'Вопрос классу: «Если Telegram-группа бесплатна, зачем организатору платить?» — возможный ответ: группа сама не пишет объявление каждую неделю, а Pro пишет. Здесь можно напомнить название модели (2-й урок — бесплатная основа и платное дополнение).' }
  ],
  s4: [
    { uz: "Do'kon qoidalari: Google Play'ning to'lov qoidasi — Play'dan tarqatiladigan ilovalar uchun, Apple 3.1.1 — App Store ilovalari uchun. Mentor ilovasi Android'da APK, iPhone'da brauzer ko'rinishi — shuning uchun to'lov brauzerdagi sahifada. Ilova keyinchalik do'konga chiqsa, do'konning ichki xarid qoidasi tegishi mumkin.", ru: 'Правила магазинов: платёжное правило Google Play — для приложений, распространяемых через Play, Apple 3.1.1 — для приложений App Store. Приложение Ментора на Android — APK, на iPhone — вид в браузере, поэтому оплата — на странице в браузере. Если приложение позже выйдет в магазин, может коснуться правило встроенных покупок магазина.' },
    { uz: "To'lov raqamini nega Backend beradi: 3-darsdagi sahifa ochiq manzilda edi — raqam Backend'dan kelsa, begona yoki o'ylab topilgan raqam bilan Pro yoqib bo'lmaydi. Raqam tasodifiy (`m-` + 12 belgi): manzilda turadi, ketma-ket bo'lsa keyingisini taxmin qilish oson bo'lardi. Haqiqiy xizmatlarda ham to'lov avval mahsulot tomonida yaratiladi (Payme hujjati).", ru: 'Почему номер платежа выдаёт Backend: страница из 3-го урока была по открытому адресу — если номер приходит от Backend, чужим или придуманным номером Pro не включить. Номер случайный (`m-` + 12 символов): он стоит в адресе, и при последовательных номерах следующий было бы легко угадать. В настоящих сервисах платёж тоже сначала создаётся на стороне продукта (документация Payme).' },
    { uz: "«Haqiqiy xizmatda sahifa va xabar boshqa kompaniya serveridan keladi» — 3-darsda aytilgan; bugun qaytarilmaydi.", ru: '«В настоящем сервисе страница и сообщение приходят с сервера другой компании» — сказано на 3-м уроке; сегодня не повторяем.' }
  ],
  s5: [
    { uz: "Narx — o'quvchining taxmini; «arzon» yoki «qimmat» deb baholanmaydi. Mahsulotida hali pullik qulaylik yo'q o'quvchi 2-darsdagi «nima uchun to'laydi» javobidan oladi (Qiymat kartasi). «Hammasi to'lasa» — eng yaxshi holat, va'da emas.", ru: 'Цена — предположение ученика; её не оценивают как «дешёвую» или «дорогую». Ученик, в продукте которого ещё нет платной функции, берёт её из ответа «за что платят» со 2-го урока (карточка «Ценность»). «Если заплатят все» — лучший случай, не обещание.' },
    { uz: "Hech kim pullik xizmatga o'tmaydi va hech kimdan pul so'ramaydi — xarajat qatori faqat hisob uchun.", ru: 'Никто не переходит на платный сервис и ни у кого не просит денег — строка расходов только для расчёта.' }
  ],
  a1: [
    { uz: "(3) dagi Pro — tekshiruv uchun, Neon orqali, faqat o'z hisobiga va (4) da o'chiriladi; Pro to'lov yo'li bilan Amaliyot 2 da yoqiladi. Tekshiruv o'yini haqiqiy foydalanuvchilar ro'yxatida bir necha daqiqa ko'rinishi mumkin — maydon nomi «tekshiruv», tekshiruvdan keyin o'chiriladi.", ru: 'Pro в (3) — для проверки, через Neon, только на своём аккаунте, и в (4) удаляется; через путь оплаты Pro включается в Практике 2. Проверочная игра может несколько минут быть видна в списке настоящих пользователей — название поля «tekshiruv», после проверки удаляется.' },
    { uz: "`DELETE` faqat `WHERE id IN (…)` bilan, agent aytgan yoki `SELECT` ko'rsatgan raqamlar bo'yicha. Pro muddati tugaganda «Doimiy o'yin» nima qilishi bu blokda yozilmaydi — 5-darsda qo'shiladi; kurs davomida Pro 30 kun, 5-darsgacha tugamaydi.", ru: '`DELETE` только с `WHERE id IN (…)`, по номерам, которые назвал агент или показал `SELECT`. Что делает «Постоянная игра», когда срок Pro закончится, в этом блоке не пишется — добавится на 5-м уроке; на курсе Pro — 30 дней, до 5-го урока не закончится.' },
    { uz: "Odatda `GET` yozuv yaratmaydi — keyingi o'yinni `GET /oyinlar` da yaratish Mentor loyihasining sodda yechimi (Backend uxlashi mumkin, taymer ishonchsiz); bir vaqtdagi ikki so'rov ikki o'yin yaratishi mumkin — 12-darsda topiladi.", ru: 'Обычно `GET` не создаёт записей — создавать следующую игру в `GET /oyinlar` — простое решение проекта Ментора (Backend может заснуть, таймер ненадёжен); два одновременных запроса могут создать две игры — это найдут на 12-м уроке.' }
  ],
  a2: [
    { uz: "Mashq sahifasi va tugmalari faqat o'quvchining o'z Backend'ini chaqiradi; boshqa odamning Backend'iga yoki haqiqiy to'lov xizmatiga hech narsa yuborilmaydi. Real ishga tushirish gapi — FK 27-modda (14–18 yoshlilar bitimni ota-onaning yozma roziligi bilan tuzadi; lex.uz).", ru: 'Учебная страница и её кнопки вызывают только собственный Backend ученика; в чужой Backend или настоящий платёжный сервис ничего не отправляется. Про реальный запуск — ГК, ст. 27 (лица 14–18 лет заключают сделки с письменного согласия родителей; lex.uz).' },
    { uz: "Ilovangizdagi haqiqiy foydalanuvchilar ham to'lov ekranini ko'radi va mashq to'lov bilan Pro yoqishi mumkin: pul yechilmaydi, ekranda va sahifada shu yozilgan. Bunday Pro — to'lov emas, sotuv deb sanalmaydi.", ru: 'Настоящие пользователи приложения тоже видят экран оплаты и могут включить Pro учебной оплатой: деньги не списываются, это написано на экране и на странице. Такой Pro — не оплата, продажей не считается.' },
    { uz: "Boshqa tugmalar («Rad etish (mashq)», «Ikki marta yuborish», «Imzosiz yuborish») bilan tekshirish bu blokda yo'q — o'quvchiga keyingi dars va'da qilinmaydi.", ru: 'Проверки другими кнопками («Отклонить (учебно)», «Отправить дважды», «Отправить без подписи») в этом блоке нет — следующий урок ученикам не обещаем.' },
    { uz: "Bitta raqam — bitta natija: rad etilgandan keyin qayta to'lash — ilovada yana «{tugma}» → yangi raqam.", ru: 'Один номер — один результат: чтобы оплатить заново после отказа — в приложении снова «{кнопка}» → новый номер.' }
  ]
};
// Jonli dars: sinf ovozlari chizig'i — har variant va ovozlar soni, ism yo'q (06 `OvozChizigi` naqshi; MD 0-ekran)
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
    <div className="pz-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={cx('pz-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="pz-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>)}
    </div>
  );
};
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* xotira yopiq — natija ekranda qoladi */ } };
const son = (v) => { const s = String(v ?? '').replace(/[\s.,]/g, ''); return /^\d+$/.test(s) ? Number(s) : null; };
// Saqlash kalitlari (tayanch 8 aynan): o'qiydi — 1, 2, 3-darslar va trek · yozadi — pm-m11d4-narx (5, 6, 7, 9-darslar o'qiydi)
const NARX_KEY = 'pm-m11d4-narx';
const BIRLIK_KEY = 'pm-m11d1-birlik';
const MODEL_KEY = 'pm-m11d2-model';
const OQIM_KEY = 'pm-m11d3-oqim';
const TREK_KEY = 'pm-m9d8-platforma';
const birlikTaxmin = () => { const b = lsO(BIRLIK_KEY); if (!b || b.tur !== 'real') return null; const n = son(b.narxTaxmin); return n && n > 0 ? n : null; };
const modelOl = () => lsO(MODEL_KEY) || {};
const trekOl = () => { const o = lsO(TREK_KEY); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
const BOSHQA_MODEL = ['reklama', 'b2b', 'tranzaksiya'];
const MAYDON_RANG = '#2E9E4F';
const PAYME_RANG = '#00B5B5';
const TG_RANG = '#2AABEE';
const MJ = () => <b className="pz-mj">Maydon Jamoa</b>;
const TAXMIN_Y = { uz: 'Mentorning taxmini', ru: 'Предположение Ментора' };
const TEST_REJIM = { uz: 'Test rejim: pul yechilmaydi', ru: 'Тестовый режим: деньги не списываются' };
const NARX = {
  xizmatlar: [
    { id: 'backend', nom: { uz: 'Backend', ru: 'Backend' }, xizmat: 'Render' },
    { id: 'db', nom: { uz: 'Database', ru: 'Database' }, xizmat: 'Neon' },
    { id: 'lending', nom: { uz: 'lending', ru: 'лендинг' }, xizmat: 'Netlify' },
    { id: 'apk', nom: { uz: "o'rnatish fayli", ru: 'установочный файл' }, xizmat: null }
  ],
  bepul: { uz: "0 so'm · bepul reja", ru: '0 сумов · бесплатный план' },
  uxlaydi: { uz: 'uxlaydi', ru: 'засыпает' },
  backendOld: { uz: "Bepul: 15 daqiqa so'rovsiz qolsa uxlaydi", ru: 'Бесплатно: засыпает, если 15 минут нет запросов' },
  backendOrqa: { uz: "Uxlamaydigan: oyiga 7 dollar · taxminan 83 000 so'm", ru: 'Без сна: 7 долларов в месяц · примерно 83 000 сумов' },
  backendManba: { uz: 'render.com · 7-oktabr kursi', ru: 'render.com · курс 7 октября' },
  bepulQoladi: { uz: 'Bu kursda Backend bepul qoladi — 83 000 faqat narx hisobi uchun.', ru: 'В этом курсе Backend остаётся бесплатным — 83 000 только для расчёта цены.' },
  varaq: [
    { id: 'xarajat', nom: { uz: 'Xarajat', ru: 'Расходы' }, qiymat: { uz: "bugun 0 so'm · uxlamasa — oyiga taxminan 83 000 so'm", ru: 'сегодня 0 сумов · без сна — примерно 83 000 сумов в месяц' },
      tarif: { uz: "Mahsulotni ushlab turish uchun sarflanadigan pul xarajat deyiladi. Mentor misolida bugun u 0 so'm.", ru: 'Деньги, которые тратятся на поддержку продукта, называются расходами. В примере Ментора сегодня это 0 сумов.' } },
    { id: 'raqobat', nom: { uz: 'Raqobat', ru: 'Конкуренция' }, qiymat: { uz: 'Telegram guruhi — bepul', ru: 'Telegram-группа — бесплатно' },
      tarif: { uz: 'Odam bugun shu ishni nima bilan qilishi raqobat deyiladi. Mentor misolida — bepul Telegram guruhi.', ru: 'То, чем человек сегодня делает это дело, называется конкуренцией. В примере Ментора — бесплатная Telegram-группа.' },
      izoh: { uz: "Mentor misolida guruh bepul qoladi — Pro faqat guruhda yo'q ishga pul so'raydi.", ru: 'В примере Ментора группа остаётся бесплатной — Pro берёт деньги только за то, чего в группе нет.' } },
    { id: 'qiymat', nom: { uz: 'Qiymat', ru: 'Ценность' }, qiymat: { uz: "har haftalik e'lon — o'zi", ru: 'еженедельное объявление — само' },
      tarif: { uz: 'Mahsulot odamga nima berishi qiymat deyiladi. Mentor misolida — tashkilotchining har haftalik ishi.', ru: 'То, что продукт даёт человеку, называется ценностью. В примере Ментора — еженедельная работа организатора.' } },
    { id: 'narx', nom: { uz: 'Narx', ru: 'Цена' }, qiymat: { uz: "30 kun — 15 000 so'm", ru: '30 дней — 15 000 сумов' } }
  ],
  hisob: [{ narx: 10000, jami: 60000, qoplaydi: false }, { narx: 15000, jami: 90000, qoplaydi: true }],
  tashkilotchi: 6,
  xarajat: 83000,
  hisobBosh: { uz: 'Agar 6 tashkilotchining hammasi olsa:', ru: 'Если все 6 организаторов возьмут:' },
  muhrYoq: { uz: 'Backend xarajatini qoplamaydi', ru: 'Не покрывает расходы на Backend' },
  muhrBor: { uz: "Backend xarajatini zo'rg'a qoplaydi", ru: 'Едва покрывает расходы на Backend' },
  ekran: {
    sarlavha: { uz: "Doimiy o'yin — Pro'da", ru: 'Постоянная игра — в Pro' },
    matn: { uz: "Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.", ru: 'Каждую неделю в тот же день и час игра объявляется сама.' },
    narx: { uz: "30 kun — 15 000 so'm", ru: '30 дней — 15 000 сумов' },
    tugma: { uz: "To'lovga o'tish", ru: 'Перейти к оплате' }
  },
  mashq: {
    sahifa: { uz: "Mashq to'lov", ru: 'Учебная оплата' },
    test: { uz: "Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.", ru: 'Это учебная страница. Карта не запрашивается, деньги не списываются.' },
    mahsulot: { uz: 'Pro, 30 kun', ru: 'Pro, 30 дней' },
    summa: { uz: "15 000 so'm", ru: '15 000 сумов' },
    tolash: { uz: "To'lash (mashq)", ru: 'Оплатить (учебно)' },
    rad: { uz: 'Rad etish (mashq)', ru: 'Отклонить (учебно)' },
    otdi: { uz: "To'lov o'tdi (mashq) — ilovaga qayting.", ru: 'Оплата прошла (учебно) — вернитесь в приложение.' },
    topilmadi: { uz: "To'lov topilmadi.", ru: 'Платёж не найден.' },
    manzil: 'maydon-jamoa-….onrender.com/tolov-mashq?raqam=m-7f3a…',
    manzilYoq: '…/tolov-mashq',
    raqam: 'm-7f3a…'
  },
  yol: {
    boshlash: { uz: "yangi to'lov raqami", ru: 'новый номер платежа' },
    xabar: { uz: "to'lov xabari", ru: 'сообщение об оплате' },
    men: { uz: 'GET /men', ru: 'GET /men' },
    pro: { uz: 'Pro', ru: 'Pro' }
  },
  tg: {
    nom: { uz: 'Mahalla futbol guruhi', ru: 'Футбольная группа махалли' },
    savol: { uz: 'Shanba, 18:00, Mahalla maydoni — kim keladi?', ru: 'Суббота, 18:00, поле махалли — кто придёт?' },
    javoblar: [{ uz: 'Men', ru: 'Я' }, { uz: 'Men ham', ru: 'И я' }, { uz: 'Kelaman', ru: 'Приду' }],
    bepul: { uz: 'bepul', ru: 'бесплатно' }
  },
  elon: {
    sarlavha: { uz: "E'lon berish", ru: 'Дать объявление' },
    oyin: { uz: 'Shanba · 18:00 · Mahalla maydoni · 10 kishi', ru: 'Суббота · 18:00 · Поле махалли · 10 человек' },
    belgi: { uz: 'Har hafta takrorlansin', ru: 'Повторять каждую неделю' },
    oyinlar: { uz: "O'yinlar", ru: 'Игры' },
    karta: { uz: 'Shanba, 18:00 · Mahalla maydoni · 0 / 10', ru: 'Суббота, 18:00 · Поле махалли · 0 / 10' },
    keyingi: { uz: 'keyingi hafta', ru: 'следующая неделя' },
    pro: { uz: 'Pro: 6-noyabrgacha', ru: 'Pro: до 6 ноября' }
  }
};

// --- Telefon (≈170×272, o'lchami barqaror; yorliq ramka ustida) ---
const Tel = ({ yorliq, children, className, ekranKey }) => (
  <div className={cx('pz-telj', className)}>
    {yorliq && <span className="pz-tel-yorliq">{yorliq}</span>}
    <div className="pz-tel"><div key={ekranKey} className="pz-tel-ekran">{children}</div></div>
  </div>
);
// To'lov taklifi ekrani (tayanch 1.4): sarlavha · matn · narx · tugma · pastda o'zgarmas «Test rejim». Karta maydoni hech qachon chizilmaydi.
const TaklifEkran = ({ sarlavha, matn, narx, tugma, taxmin, kul, onTugma, tugmaHalqa, sirgal, narxYon }) => (
  <div className={cx('pz-taklif', sirgal && 'sirgal')}>
    <span className="pz-app-bar"><i className="pz-orqaga" aria-hidden="true">‹</i><MJ /></span>
    <div className="pz-taklif-t">
      <b className="pz-tk-sar">{sarlavha}</b>
      {matn && <span className="pz-tk-matn">{matn}</span>}
      <span className={cx('pz-tk-narx', narxYon && 'yon')}>{narx}</span>
      {taxmin && <span className="pz-tk-tax">{tr(TAXMIN_Y)}</span>}
      <button type="button" className={cx('pz-tk-btn ns-tolovga', kul && 'kul', halqa(tugmaHalqa))} disabled={!onTugma} onClick={onTugma}>{tugma}</button>
      <span className="pz-tk-test">{tr(TEST_REJIM)}</span>
    </div>
  </div>
);
const MentorTaklif = (p) => <TaklifEkran sarlavha={tr(NARX.ekran.sarlavha)} matn={tr(NARX.ekran.matn)} narx={tn(NARX.ekran.narx)} tugma={tr(NARX.ekran.tugma)} taxmin {...p} />;
// «E'lon berish» ekrani: belgi «Har hafta takrorlansin» (Pro bo'lsa — ostida «Pro: …gacha»), «O'yinlar» ro'yxati
const ElonEkran = ({ belgiOn, onBelgi, belgiHalqa, oyinlar = 0, pro, oyinKarta }) => (
  <div className="pz-elon">
    <span className="pz-app-bar"><MJ /></span>
    <div className="pz-elon-t">
      <b className="pz-el-sar">{tr(NARX.elon.sarlavha)}</b>
      <span className="pz-el-oyin">{tn(NARX.elon.oyin)}</span>
      <button type="button" className={cx('pz-belgi ns-belgi', belgiOn && 'on', halqa(belgiHalqa))} disabled={!onBelgi} onClick={onBelgi} aria-pressed={!!belgiOn}><i className="pz-belgi-q" aria-hidden="true" /><span>{tr(NARX.elon.belgi)}</span></button>
      {pro && <span className="pz-el-pro">{tn(pro)}</span>}
      {oyinlar > 0 && <span className="pz-el-oy">{tr(NARX.elon.oyinlar)}</span>}
      {oyinlar > 0 && <span className="pz-el-k">{tn(oyinKarta || NARX.elon.karta)}</span>}
      {oyinlar > 1 && <span className="pz-el-k keyingi"><em>{tr(NARX.elon.keyingi)}</em>{tn(oyinKarta || NARX.elon.karta)}</span>}
    </div>
  </div>
);
// Brauzerdagi mashq to'lov sahifasi — tanish to'lov sahifasi ko'rinishida (SABOQ P6): brend sarlavha · savdogar · summa · katta tugma; karta maydoni yo'q
const MashqSahifa = ({ otdi, onTolash, tolashHalqa, topilmadi, summa }) => (
  <div className="pz-br">
    <div className="pz-br-bar"><code>{topilmadi ? NARX.mashq.manzilYoq : NARX.mashq.manzil}</code></div>
    {topilmadi ? <div className="pz-br-yoq"><b>{tr(NARX.mashq.topilmadi)}</b></div> : (
      <div className="pz-mashq">
        <div className="pz-pm-bosh"><b>Payme</b><span>{tr({ uz: 'mashq', ru: 'учебно' })}</span></div>
        <span className="pz-m-sar">{tr(NARX.mashq.sahifa)}</span>
        <span className="pz-m-nom"><MJ /> — {tr(NARX.mashq.mahsulot)}</span>
        <span className="pz-m-summa">{summa || <><b>{tn(NARX.mashq.summa)}</b><em>{tr(TAXMIN_Y)}</em></>}</span>
        {otdi
          ? <span className="pz-m-holat">{tr(NARX.mashq.otdi)}</span>
          : <><button type="button" className={cx('pz-tolash ns-tolash', halqa(tolashHalqa))} disabled={!onTolash} onClick={onTolash}>{tr(NARX.mashq.tolash)}</button><span className="pz-rad">{tr(NARX.mashq.rad)}</span></>}
        <span className="pz-m-test">{tr(NARX.mashq.test)}</span>
      </div>
    )}
  </div>
);
// Telegram guruhi (faqat 2-ekran 2-qadam): rol yorlig'i + pufak (odam chizilmaydi — SABOQ P1)
const TgEkran = ({ n, bepul, onBugun, bugunHalqa }) => (
  <div className="pz-tg">
    <span className="pz-tg-bosh"><b>{tr(NARX.tg.nom)}</b>{bepul && <em className="pz-tg-bepul">{tr(NARX.tg.bepul)}</em>}</span>
    <div className="pz-tg-chat">
      <span className="pz-tg-p bosh"><i>{tr({ uz: 'tashkilotchi', ru: 'организатор' })}</i>{tn(NARX.tg.savol)}</span>
      {NARX.tg.javoblar.slice(0, n).map((j, i) => <span key={i} className="pz-tg-p javob"><i>{tr({ uz: "o'yinchi", ru: 'игрок' })}</i>{tr(j)}</span>)}
    </div>
    {onBugun !== undefined && n === 0 && <button type="button" className={cx('pz-bugun ns-bugun', halqa(bugunHalqa))} disabled={!onBugun} onClick={onBugun}>{tr({ uz: 'Bugun qanday?', ru: 'Как сегодня?' })}</button>}
  </div>
);
// Xizmat kartalari (faqat 2-ekran 1-qadam): Backend kartasi ag'dariladi
const Xizmatlar = ({ ochiq, onUxla, uxlaHalqa, backRef }) => (
  <div className="pz-xz">
    {NARX.xizmatlar.map(x => (x.id === 'backend' ? (
      <div key={x.id} className={cx('pz-xk be', ochiq && 'ag')}>
        {!ochiq ? <>
          <span className="pz-xk-n"><b>{tr(x.nom)}</b><span className="pz-xk-x">{x.xizmat}</span></span>
          <span className="pz-xk-s">{tr(NARX.bepul)}</span>
          <button type="button" className={cx('pz-uxla ns-uxlaydi', halqa(uxlaHalqa))} disabled={!onUxla} onClick={onUxla}>{tr(NARX.uxlaydi)}</button>
        </> : <>
          <span className="pz-xk-n"><b>{tr(x.nom)}</b><span className="pz-xk-x">{x.xizmat}</span></span>
          <span className="pz-xk-a">{tr(NARX.backendOld)}</span>
          <b ref={backRef} className="pz-xk-b">{tn(NARX.backendOrqa)}</b>
          <span className="pz-xk-m">{tr(NARX.backendManba)}</span>
        </>}
      </div>
    ) : (
      <div key={x.id} className="pz-xk"><span className="pz-xk-n"><b>{tr(x.nom)}</b>{x.xizmat && <span className="pz-xk-x">{x.xizmat}</span>}</span><span className="pz-xk-s">{tr(NARX.bepul)}</span></div>
    )))}
    {ochiq && <p className="pz-xz-iz fade-step">{tr(NARX.bepulQoladi)}</p>}
  </div>
);
// «Narx varag'i» — to'rt qator (xarajat · raqobat · qiymat · narx) + hisob qatori va muhr. qator: { id, nom, qiymat, holat: kul|joriy|oq|ok, bosh, tarif, izoh, taxmin, tahrir }
const Varaq = ({ qatorlar, hisob, sarlavha, ixcham, refs = {}, onTahrir, className, children }) => (
  <div className={cx('pz-varaq', ixcham && 'ixcham', className)}>
    <span className="pz-v-sar">{sarlavha || tr({ uz: "Narx varag'i", ru: 'Лист цены' })}</span>
    {qatorlar.map(q => (
      <div key={q.id} className={cx('pz-v-r', q.holat, q.bosh && 'bosh', q.yangi && 'yangi', q.ulag && 'ulag')}>
        <span className="pz-v-nom">{q.nom}</span>
        {q.qiymat !== undefined && <span ref={refs[q.id]} className="pz-v-q">{q.qiymat}{q.taxmin && <em className="pz-v-tax">{tr(TAXMIN_Y)}</em>}</span>}
        {onTahrir && q.tahrir != null && <button type="button" className="pz-v-tahrir" onClick={() => onTahrir(q.tahrir)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
        {q.tarif && <span className="pz-v-ta">{q.tarif}</span>}
        {q.izoh && <span className="pz-v-iz">{q.izoh}</span>}
      </div>
    ))}
    {hisob && <div key={hisob.k} className={cx('pz-hisob', hisob.holat)}><span className="pz-h-m">{hisob.matn}</span>{hisob.muhr && <b className="pz-muhr">{hisob.muhr}</b>}</div>}
    {children}
  </div>
);
const mentorHisob = (i) => {
  const h = NARX.hisob[i];
  return { k: 'h' + i, holat: h.qoplaydi ? 'ok' : 'err', matn: nbs(tr(NARX.hisobBosh) + ' ' + NARX.tashkilotchi + ' × ' + sonFmt(h.narx) + ' = ' + sonFmt(h.jami) + ' ' + tr({ uz: "so'm", ru: 'сумов' })), muhr: tr(h.qoplaydi ? NARX.muhrBor : NARX.muhrYoq) };
};
// Backend tuguni: mini-jadval tolovlar (tolov_raqami · holat) va qator pro_gacha
const BackendTugun = ({ qatorlar = [], pro, kichik }) => (
  <div className={cx('pz-be', kichik && 'kichik')}>
    <span className="pz-be-sar">Backend</span>
    <div className="pz-jad">
      <span className="pz-jad-h"><code>tolovlar</code></span>
      <span className="pz-jad-r bosh"><code>tolov_raqami</code><code>holat</code></span>
      {qatorlar.map(r => <span key={r.raqam} className={cx('pz-jad-r', r.kul && 'kul', r.yangi && 'yangi')}><code>{r.raqam}</code><code>{r.holat}</code></span>)}
    </div>
    <span className={cx('pz-pro', pro && 'yangi')}><code>pro_gacha</code><b>{pro ? tr(pro) : tr({ uz: "bo'sh", ru: 'пусто' })}</b></span>
  </div>
);
// Konvert yo'li: konvert chiziq bo'ylab yorlig'i bilan uchadi (o — ilovadan Backend'ga, c — qaytib)
const Yol = ({ konv, iz }) => (
  <div className="pz-yol">
    <i className="pz-yol-ch" aria-hidden="true" />
    {konv && <span key={konv.k} className={cx('pz-konv', konv.dir)}><b>{tr(konv.t)}</b></span>}
    {iz && <span className="pz-yol-iz">{iz.map((t, i) => <em key={i}>{tr(t)}</em>)}</span>}
  </div>
);
// Son kartadan varaq qatoriga uchadi (SABOQ 19); harakatsiz rejimda — yo'q
const uchir = (fromEl, toEl, matn) => {
  if (!fromEl || !toEl || kamHarakat() || typeof document === 'undefined') return;
  const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
  const s = document.createElement('span');
  s.className = 'pz-uchar'; s.textContent = matn;
  s.style.left = a.left + 'px'; s.style.top = a.top + 'px';
  document.body.appendChild(s);
  if (!s.animate) { s.remove(); return; }
  const an = s.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(' + (b.left - a.left) + 'px,' + (b.top - a.top) + 'px)', opacity: 0.85 }], { duration: 650, easing: 'cubic-bezier(.3,.7,.3,1)' });
  an.onfinish = () => s.remove();
};
const BASH_Y = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="pz-bash fade-up"><QBashorat yorliq={tr(BASH_Y)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={null} onTanla={onTanla} /></div>
  : <p className="pz-bash-ix fade-step"><span>{tr({ uz: 'Taxminingiz:', ru: 'Ваше предположение:' })}</span> <b>{tr((variantlar.find(v => v.k === tanlov) || variantlar[0]).t)}</b></p>);
// Yashil xulosa qutisi (E 42): birinchi kichik qator — taxmin natijasi, keyin xulosa, oxirida QIzoh
const XulosaQ = ({ togri, natija, matn, izoh }) => <>{natija && <span className={cx('pz-x-n', togri && 'ok')}>{natija}</span>}<span className="pz-x-m">{matn}</span>{izoh && <span className="pz-x-iz">{izoh}</span>}</>;

// ===== SCREEN 0 — KIRISH (QKirish; sof so'rovnoma — J-026, ballsiz) =====
const HOOK_OPTS = [
  { id: 'xarajat', t: { uz: 'Menga ketadigan xarajatni qoplashiga qarab', ru: 'Чтобы покрыть мои расходы' } },
  { id: 'boshqalar', t: { uz: "Boshqalar shu ishga so'raydigan pulga qarab", ru: 'По тому, сколько за это просят другие' } },
  { id: 'kongil', t: { uz: "Taxminan — ko'nglimga yoqqan songa qarab", ru: 'Примерно — по числу, которое мне нравится' } }
];
const HOOK_AYNAN = { uz: <><b>Aynan!</b> Bu — narxga qaraladigan tomonlardan biri. Bugun qolganlarini ham ko'rasiz.</>, ru: <><b>Именно!</b> Это одна из сторон, на которые смотрят при выборе цены. Сегодня увидите и остальные.</> };
const HOOK_JAVOB = {
  xarajat: HOOK_AYNAN,
  boshqalar: HOOK_AYNAN,
  kongil: { uz: <><b>Qiziq fikr!</b> Birinchi taxmin shunday bo'lishi mumkin. Bugun unga bir necha tomondan qaraysiz.</>, ru: <><b>Интересная мысль!</b> Первая оценка может быть такой. Сегодня посмотрите на неё с нескольких сторон.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const taxmin1 = useMemo(birlikTaxmin, []);
  const { live } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', HOOK_OPTS.findIndex(o => o.id === v), false, 0);
  };
  const qoralama = (
    <TaklifEkran kul sarlavha={tr(NARX.ekran.sarlavha)} matn={tr(NARX.ekran.matn)} tugma={tr(NARX.ekran.tugma)}
      narx={<>{tr({ uz: '30 kun — ', ru: '30 дней — ' })}<b className={cx('pz-savol', picked && 'yon')}>?</b>{tr({ uz: " so'm", ru: ' сумов' })}</>} />
  );
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('pz-k', picked === null && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Narxni qanday <span className="italic" style={{ color: T.accent }}>belgilaysiz?</span></>, ru: <>Как <span className="italic" style={{ color: T.accent }}>назначить цену?</span></> })}
          mentor={<Mentor>{taxmin1
            ? tr({ uz: "1-darsda mahsulotingiz narxini taxmin qilib yozgansiz — o'sha kunni eslab, bittasini tanlang.", ru: 'На 1-м уроке вы записали предположение о цене продукта — вспомните тот день и выберите один вариант.' })
            : tr({ uz: "Mentor 1-darsda Pro narxini 10 000 so'm deb taxmin qilgan edi — o'z mahsulotingizni o'ylab, bittasini tanlang.", ru: 'На 1-м уроке Ментор предположил цену Pro в 10 000 сумов — подумайте о своём продукте и выберите один вариант.' })}</Mentor>}
          maket={<div className={cx('pz-s0-m', picked && 'ochiq')}>
            <div className="pz-s0-tel">
              <Tel yorliq={<>{tr({ uz: 'Mentorning rejasi', ru: 'План Ментора' })} · <MJ /></>}>{qoralama}</Tel>
              <p className="pz-tel-ost">{taxmin1
                ? nbs(tr({ uz: '1-darsdagi taxminingiz: ', ru: 'Ваше предположение с 1-го урока: ' }) + sonFmt(taxmin1) + tr({ uz: " so'm", ru: ' сумов' }))
                : tn({ uz: "1-darsdagi taxmin: 10 000 so'm · Mentorning taxmini", ru: 'Предположение с 1-го урока: 10 000 сумов · предположение Ментора' })}</p>
            </div>
            {picked && <Varaq className="pz-s0-v fade-step" qatorlar={[0, 1, 2].map(i => ({ id: 'b' + i, nom: '?', qiymat: '?', bosh: true })).concat([{ id: 'narx', nom: tr({ uz: 'Narx', ru: 'Цена' }), qiymat: '?', bosh: true, ulag: true }])} />}
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
          javob={<>
            {picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
            {isLive && (picked !== null || live.mode === 'mentor') && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        >
          <Ustoz satrlar={USTOZ.s0} />
        </QKirish>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; chap — natija, vizual bir marta o'zi yuradi) =====
const REJA = [
  { t: { uz: 'Narxga bir necha tomondan qarashni bilib olasiz', ru: 'Узнаете, как смотреть на цену с нескольких сторон' }, teg: { uz: "narx varag'i", ru: 'лист цены' } },
  { t: { uz: "O'z mahsulotingiz narxini asoslab yozasiz", ru: 'Обоснованно запишете цену своего продукта' }, teg: { uz: 'narx', ru: 'цена' } },
  { t: { uz: "Pullik qulaylik bosilganda to'lov ekrani chiqadi", ru: 'При нажатии на платную функцию появится экран оплаты' }, teg: { uz: 'Amaliyot 1', ru: 'Практика 1' } },
  { t: { uz: "Mashq to'lovdan keyin qulaylik ochilishini tekshirasiz", ru: 'Проверите, что после учебной оплаты функция открывается' }, teg: { uz: 'Amaliyot 2', ru: 'Практика 2' } }
];
const REJA_YOL = [{ uz: "E'lon berish", ru: 'Объявление' }, { uz: "to'lov ekrani", ru: 'экран оплаты' }, { uz: "Mashq to'lov", ru: 'Учебная оплата' }, { uz: 'ilova', ru: 'приложение' }];
const RejaYol = () => {
  const [k, setK] = useState(() => (kamHarakat() ? 4 : 0));
  useEffect(() => { if (k >= 4) return undefined; const t = setTimeout(() => setK(n => n + 1), k === 0 ? 600 : 1300); return () => clearTimeout(t); }, [k]);
  const ekran = k <= 1 ? 'elon' : k === 2 ? 'taklif' : k === 3 ? 'mashq' : 'ilova';
  return (
    <div className="pz-reja">
      <div className="pz-reja-r">
        <Tel ekranKey={ekran} yorliq={<MJ />}>
          {ekran === 'taklif' ? <TaklifEkran kul sirgal sarlavha={tr(NARX.ekran.sarlavha)} matn={tr(NARX.ekran.matn)} tugma={tr(NARX.ekran.tugma)} narx={<>{tr({ uz: '30 kun — ', ru: '30 дней — ' })}<b className="pz-savol">?</b>{tr({ uz: " so'm", ru: ' сумов' })}</>} />
            : ekran === 'mashq' ? <MashqSahifa summa={<b><span className="pz-savol">?</span>{tr({ uz: " so'm", ru: ' сумов' })}</b>} />
              : <ElonEkran belgiOn={ekran === 'ilova'} />}
        </Tel>
        <Varaq ixcham qatorlar={NARX.varaq.map(v => ({ id: v.id, nom: tr(v.nom), holat: 'oq' }))} />
      </div>
      <div className="pz-reja-yol">{REJA_YOL.map((y, i) => <span key={i} className={cx('pz-ry', i < k && 'on')}>{tr(y)}</span>)}</div>
    </div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun <span className="italic" style={{ color: T.accent }}>narx qo'yasiz</span> va mashq to'lovni ulaysiz.</>, ru: <>Сегодня <span className="italic" style={{ color: T.accent }}>назначите цену</span> и подключите учебную оплату.</> })}
      mentor={<Mentor>{tr({ uz: "3-darsda Backend'ingiz to'lov xabarini qabul qildi — bugun undan keyin mahsulotingizda bitta pullik qulaylik ochiladigan bo'ladi. Narxni siz qo'yasiz, kodni agent yozadi.", ru: 'На 3-м уроке ваш Backend принял сообщение об оплате — сегодня после него в продукте будет открываться одна платная функция. Цену ставите вы, код пишет агент.' })}</Mentor>}
      chapYorliq={<>{tr({ uz: 'Dars oxirida', ru: 'В конце урока' })} <span className="pz-sub">{tr({ uz: "xarajat, raqobat, qiymat → narx va to'lov taklifi ekrani", ru: 'расходы, конкуренция, ценность → цена и экран предложения оплаты' })}</span></>}
      chap={<RejaYol />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    >
      <p className="pz-reja-ost">{tx({ uz: "repo `maydon-jamoa` · boshlang'ich holat `m13-dars-04-start` · namuna `m13-dars-04-done` — amaliyotlarni o'z mahsulotingizda bajarasiz.", ru: 'репозиторий `maydon-jamoa` · начальное состояние `m13-dars-04-start` · образец `m13-dars-04-done` — практику выполняете в своём продукте.' })}</p>
      <Ustoz satrlar={USTOZ.s1} />
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — NARX VARAG'I (QTushuncha, markaziy; ketma-ket 3 qadam: xarajat → raqobat → qiymat, keyin narx o'zi) =====
const S2_TAXMIN = [{ k: 'kam', t: { uz: 'Kamaytiradi', ru: 'Уменьшит' } }, { k: 'teng', t: { uz: "O'zgartirmaydi", ru: 'Не изменит' } }, { k: 'oshir', t: { uz: 'Oshiradi', ru: 'Увеличит' } }];
const S2_SAVOL = { uz: 'Mentor 1-darsdagi 10 000 ni nima qiladi?', ru: 'Что Ментор сделает с 10 000 из 1-го урока?' };
const S2_MENTOR = [
  { uz: "Avval javobingizni belgilang, keyin narx varag'ini qatorma-qator oching.", ru: 'Сначала отметьте ответ, потом откройте лист цены строка за строкой.' },
  { uz: "Bepul Backend uxlaydi, to'lov xabari esa kechikmasin — Backend kartasidagi «uxlaydi» belgisini bosing.", ru: 'Бесплатный Backend засыпает, а сообщение об оплате не должно опаздывать — нажмите метку «засыпает» на карточке Backend.' },
  { uz: "Tashkilotchi o'yinni bugun nima bilan yig'ishini ko'ring — «Bugun qanday?» ni bosing.", ru: 'Посмотрите, чем организатор собирает игру сегодня — нажмите «Как сегодня?».' },
  { uz: "Pro tashkilotchiga nima berishini ko'ring — «Har hafta takrorlansin» belgisini bosing.", ru: 'Посмотрите, что Pro даёт организатору — нажмите метку «Повторять каждую неделю».' }
];
const s2Qatorlar = (q, faol) => NARX.varaq.map((v, i) => {
  const ochiq = i < 3 ? q > i : q >= 4;
  return {
    id: v.id, nom: ochiq ? tr(v.nom) : '?', qiymat: ochiq ? tn(v.qiymat) : '', bosh: !ochiq, yangi: ochiq,
    holat: ochiq ? (i === 3 ? 'ok' : 'oq') : (faol && q === i ? 'joriy' : 'kul'),
    tarif: ochiq && v.tarif ? tr(v.tarif) : null, izoh: ochiq && v.izoh ? tr(v.izoh) : null, taxmin: i === 3 && ochiq
  };
});
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 4 : 0);
  const [vid, setVid] = useState(avval ? 'qoralama' : 'xz');
  const [tgN, setTgN] = useState(avval ? 3 : 0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const keyin = (ms, f) => { if (kamHarakat()) { f(); return; } timers.current.push(setTimeout(f, ms)); };
  const backRef = useRef(null);
  const refs = { xarajat: useRef(null), raqobat: useRef(null), qiymat: useRef(null), narx: useRef(null) };
  const done = q >= 4;
  const tugadi = useTugadi(done, 1500, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const onUxla = () => {
    if (!taxmin || q !== 0) return;
    setQ(1);
    requestAnimationFrame(() => uchir(backRef.current, refs.xarajat.current, '83 000'));
    keyin(1700, () => setVid('tg'));
  };
  const onBugun = () => {
    if (q !== 1) return;
    [1, 2, 3].forEach((n, i) => keyin(250 + i * 380, () => setTgN(n)));
    keyin(1400, () => setQ(2));
    keyin(2900, () => setVid('elon'));
  };
  const onBelgi = () => {
    if (q !== 2) return;
    setQ(3);
    keyin(1500, () => setVid('qoralama'));
    keyin(2300, () => setQ(4));
  };
  const mIdx = !taxmin ? 0 : vid === 'xz' ? 1 : vid === 'tg' ? 2 : vid === 'elon' ? 3 : null;
  const chap = vid === 'xz' ? <Xizmatlar ochiq={q >= 1} onUxla={taxmin && q === 0 ? onUxla : null} uxlaHalqa={!!taxmin && q === 0} backRef={backRef} />
    : vid === 'tg' ? <Tel ekranKey="tg" yorliq="Telegram"><TgEkran n={tgN} bepul={tgN >= 3} onBugun={q === 1 && tgN === 0 ? onBugun : null} bugunHalqa={q === 1 && tgN === 0} /></Tel>
      : vid === 'elon' ? <Tel ekranKey="elon" yorliq={<>{tr({ uz: 'Pro bilan — Mentorning rejasi', ru: 'С Pro — план Ментора' })}</>}><ElonEkran belgiOn={q >= 3} onBelgi={q === 2 ? onBelgi : null} belgiHalqa={q === 2} oyinlar={q >= 3 ? 2 : 0} /></Tel>
        : <Tel ekranKey="qoralama" yorliq={<>{tr({ uz: 'Mentorning rejasi', ru: 'План Ментора' })} · <MJ /></>}><TaklifEkran kul sarlavha={tr(NARX.ekran.sarlavha)} matn={tr(NARX.ekran.matn)} tugma={tr(NARX.ekran.tugma)} taxmin={q >= 4} narxYon={q >= 4}
          narx={q >= 4 ? tn(NARX.ekran.narx) : <>{tr({ uz: '30 kun — ', ru: '30 дней — ' })}<b className="pz-savol">?</b>{tr({ uz: " so'm", ru: ' сумов' })}</>} /></Tel>;
  const hisob = q >= 4 ? mentorHisob(1) : q >= 1 ? mentorHisob(0) : { k: 'h-', holat: 'bosh', matn: '?' };
  const ok = taxmin === 'oshir';
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · narx', ru: 'Понятие · цена' })} screen={screen} scrollSignal={q}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Qatorni oching (${Math.min(q, 3)}/3)`, ru: `Откройте строку (${Math.min(q, 3)}/3)` })} onClick={onNext} /></>}>
      <div className="pz-s2">
        <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
          sarlavha={tr({ uz: <>Mentor Pro narxini <span className="italic" style={{ color: T.accent }}>nimaga qarab</span> qo'ydi?</>, ru: <>На что Ментор <span className="italic" style={{ color: T.accent }}>смотрел</span>, ставя цену Pro?</> })}
          mentor={mIdx !== null && <Mentor>{tr(S2_MENTOR[mIdx])}</Mentor>}
          bashorat={<Bashorat savol={S2_SAVOL} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
          harakat={<div className={cx('pz-s2-chap', !taxmin && 'xira')}>{chap}</div>}
          vizual={<Varaq refs={refs} qatorlar={s2Qatorlar(q, !!taxmin)} hisob={hisob} className={cx(tugadi && 'keng')} />}
          xulosa={done && tugadi && <XulosaQ togri={ok}
            natija={ok ? tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение подтвердилось ✓' }) : tn({ uz: 'Taxminingiz ✕ — aslida: oshirdi, 10 000 dan 15 000 ga', ru: 'Ваше предположение ✕ — на деле: повысил, с 10 000 до 15 000' })}
            matn={tn({ uz: 'Uch qator narxni formula bilan chiqarmaydi: Mentor ularga qarab 15 000 ni yangi taxmin qildi.', ru: 'Три строки не выводят цену по формуле: глядя на них, Ментор сделал новое предположение — 15 000.' })}
            izoh={tr({ uz: "Hisobda faqat taxminiy Backend xarajati: hammasi olsa ham, u zo'rg'a qoplanadi.", ru: 'В расчёте только примерные расходы на Backend: даже если возьмут все, они едва покрываются.' })} />}
        >
          <Ustoz satrlar={USTOZ.s2} />
        </QTushuncha>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1; ikkinchi misol — kitob almashish ilovasi) =====
const KitobVaraq = () => (
  <Varaq ixcham sarlavha={tr({ uz: "Kitob almashish ilovasi · narx varag'i", ru: 'Приложение обмена книгами · лист цены' })}
    qatorlar={[
      { id: 'x', nom: tr({ uz: 'Xarajat', ru: 'Расходы' }), holat: 'kul' },
      { id: 'r', nom: tr({ uz: 'Raqobat', ru: 'Конкуренция' }), qiymat: tr({ uz: 'sinf chati — tekin', ru: 'чат класса — бесплатно' }), holat: 'joriy' },
      { id: 'q', nom: tr({ uz: 'Qiymat', ru: 'Ценность' }), holat: 'kul' },
      { id: 'n', nom: tr({ uz: 'Narx', ru: 'Цена' }), holat: 'kul' }
    ]} />
);
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · narx varag'i", ru: 'Проверка · лист цены' })}
    questionText="«Kitobni hozir sinf chatida tekin so'rashadi.» Bu gap qaysi qatorga yoziladi?"
    question={tr({ uz: <><p className="pz-q-ost">Kitob almashish ilovasi · mashq misoli</p><h2 className="title h-ask">«Kitobni hozir sinf chatida tekin so'rashadi.» Bu gap <span className="italic" style={{ color: T.accent }}>qaysi qatorga</span> yoziladi?</h2></>, ru: <><p className="pz-q-ost">Приложение обмена книгами · учебный пример</p><h2 className="title h-ask">«Книгу сейчас бесплатно просят в чате класса.» В <span className="italic" style={{ color: T.accent }}>какую строку</span> записать эту фразу?</h2></> })}
    options={[
      { uz: 'Xarajat: ilovani ushlab turish uchun pul', ru: 'Расходы: деньги на поддержку приложения' },
      { uz: 'Raqobat: odamlar bugun nima ishlatadi', ru: 'Конкуренция: чем люди пользуются сегодня' },
      { uz: 'Qiymat: ilova odamga nima beradi', ru: 'Ценность: что приложение даёт человеку' },
      { uz: "Narx: odam to'laydigan pul miqdori", ru: 'Цена: сумма, которую платит человек' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Odamlar bu ishni bugun tekin chatda qiladi — bu raqobat.', ru: 'Сегодня люди делают это в бесплатном чате — это конкуренция.' }}
    explainWrong={{
      0: { uz: 'Xarajat — ilova egasining puli. Gapda kim nima qilyapti?', ru: 'Расходы — деньги владельца приложения. Кто что делает во фразе?' },
      2: { uz: 'Qiymat — ilova nima berishi. Bu gapda ilova bormi?', ru: 'Ценность — то, что даёт приложение. Есть ли во фразе приложение?' },
      3: { uz: "Narx — ilova so'raydigan pul. Gap kimning ishi haqida?", ru: 'Цена — деньги, которые просит приложение. О чьём деле фраза?' },
      default: { uz: 'Gapda kim nima qilyapti?', ru: 'Кто что делает во фразе?' }
    }}
    vizual={<KitobVaraq />} />
);

// ===== SCREEN 4 — TO'LOV TAKLIFI EKRANI (QTushuncha, ketma-ket 3 qadam: belgi → «To'lovga o'tish» → «To'lash (mashq)») =====
const S4_TAXMIN = [{ k: 'tugma', t: { uz: "Faqat «To'lovga o'tish» tugmasi", ru: 'Только кнопка «Перейти к оплате»' } }, { k: 'narx', t: { uz: "Narx va «To'lovga o'tish»", ru: 'Цена и «Перейти к оплате»' } }, { k: 'hammasi', t: { uz: 'Nima ochilishi, narx va tugma', ru: 'Что откроется, цена и кнопка' } }];
const S4_SAVOL = { uz: 'Ekranda Pro haqida nimalar turadi?', ru: 'Что на экране сказано о Pro?' };
const S4_MENTOR = [
  { uz: "Avval javobingizni belgilang, keyin Pro'si yo'q tashkilotchi bo'lib yo'lni bosib chiqing.", ru: 'Сначала отметьте ответ, потом пройдите путь за организатора без Pro.' },
  { uz: "Pro'si yo'q tashkilotchi pullik qulaylikni bosadi — yonib turgan belgini bosing.", ru: 'Организатор без Pro нажимает платную функцию — нажмите подсвеченную метку.' },
  { uz: "Endi to'lov taklifi ekranidagi «To'lovga o'tish» ni bosing.", ru: 'Теперь нажмите «Перейти к оплате» на экране предложения оплаты.' },
  { uz: "Mashq sahifasida «To'lash (mashq)» ni bosing va ilovada nima o'zgarishini kuzating.", ru: 'На учебной странице нажмите «Оплатить (учебно)» и следите, что изменится в приложении.' }
];
const S4_QATOR = [
  { uz: "Pullik qulaylik bosilganda chiqadigan bu ekran to'lov taklifi ekrani deyiladi.", ru: 'Этот экран, который появляется при нажатии платной функции, называется экраном предложения оплаты.' },
  { uz: "Mentor ilovasi do'kondan tarqatilmaydi; bu kursda mashq to'lov brauzerda ochiladi.", ru: 'Приложение Ментора не распространяется через магазин; в этом курсе учебная оплата открывается в браузере.' },
  { uz: "Pro'ni Backend to'lov xabari kelgach yoqadi; ilova buni Backend'dan qayta so'rab biladi.", ru: 'Pro включает Backend после сообщения об оплате; приложение узнаёт это, снова спросив Backend.' }
];
const S4_BELGI = [{ uz: 'nima ochiladi', ru: 'что откроется' }, { uz: 'narx', ru: 'цена' }, { uz: 'tugma', ru: 'кнопка' }, { uz: 'test rejim qatori', ru: 'строка тестового режима', kul: true }];
const S4_IZ = [NARX.yol.boshlash, NARX.yol.xabar, NARX.yol.men];
const S4_BOSH = { ekran: 'elon', belgilar: 0, konv: null, yangiQator: false, pro: null, otdi: false, belgiOn: false, proQator: false };
const S4_OXIR = { ekran: 'ilova', belgilar: 0, konv: null, yangiQator: true, pro: { uz: '+30 kun', ru: '+30 дней' }, otdi: true, belgiOn: true, proQator: true };
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [st, setSt] = useState(avval ? S4_OXIR : S4_BOSH);
  const [band, setBand] = useState(false);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const ketma = (qadamlar) => {
    if (kamHarakat()) { setSt(s => qadamlar.reduce((a, x) => ({ ...a, ...x[1] }), s)); return; }
    setBand(true);
    let t = 0;
    qadamlar.forEach((x, i) => { t += x[0]; timers.current.push(setTimeout(() => { setSt(s => ({ ...s, ...x[1] })); if (i === qadamlar.length - 1) setBand(false); }, t)); });
  };
  const done = q >= 3 && !band;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const onBelgi = () => { if (!taxmin || q !== 0 || band) return; setQ(1); ketma([[0, { ekran: 'taklif' }], [450, { belgilar: 1 }], [320, { belgilar: 2 }], [320, { belgilar: 3 }], [320, { belgilar: 4 }]]); };
  const onTolovga = () => { if (q !== 1 || band) return; setQ(2); ketma([[0, { belgilar: 0, konv: { k: 1, t: NARX.yol.boshlash, dir: 'o' } }], [900, { konv: { k: 2, t: { uz: NARX.mashq.raqam, ru: NARX.mashq.raqam }, dir: 'c' } }], [900, { konv: null, ekran: 'mashq' }]]); };
  const onTolash = () => {
    if (q !== 2 || band) return; setQ(3);
    ketma([[0, { konv: { k: 3, t: NARX.yol.xabar, dir: 'o' } }], [900, { konv: null, yangiQator: true, pro: { uz: '+30 kun', ru: '+30 дней' }, otdi: true }], [1500, { ekran: 'ilova', konv: { k: 4, t: NARX.yol.men, dir: 'o' } }], [900, { konv: { k: 5, t: NARX.yol.pro, dir: 'c' } }], [900, { konv: null, proQator: true, belgiOn: true }]]);
  };
  const mIdx = !taxmin ? 0 : done ? null : band ? q : q + 1;
  const ok = taxmin === 'hammasi';
  const ekran = st.ekran === 'taklif'
    ? <MentorTaklif sirgal onTugma={q === 1 && !band ? onTolovga : null} tugmaHalqa={q === 1 && !band} />
    : st.ekran === 'mashq' ? <MashqSahifa otdi={st.otdi} onTolash={q === 2 && !band ? onTolash : null} tolashHalqa={q === 2 && !band} />
      : <ElonEkran belgiOn={st.belgiOn} onBelgi={taxmin && q === 0 && !band ? onBelgi : null} belgiHalqa={!!taxmin && q === 0} pro={st.proQator ? NARX.elon.pro : null} />;
  const sahna = (
    <div className={cx('pz-s4-v', tugadi && 'keng')}>
      <div className="pz-sahna">
        <div className="pz-sahna-tel">
          <Tel ekranKey={st.ekran} yorliq={st.ekran === 'mashq' ? tr({ uz: 'brauzer', ru: 'браузер' }) : <MJ />}>{ekran}</Tel>
          {st.ekran === 'taklif' && st.belgilar > 0 && <ul className="pz-belgilar">{S4_BELGI.slice(0, st.belgilar).map((b, i) => <li key={i} className={cx('pz-bl', 'b' + i, b.kul && 'kul')}>{tr(b)}</li>)}</ul>}
        </div>
        <Yol konv={st.konv} iz={tugadi ? S4_IZ : null} />
        <BackendTugun qatorlar={[{ raqam: 'm-101', holat: 'tolandi', kul: true }].concat(st.yangiQator ? [{ raqam: NARX.mashq.raqam, holat: 'tolandi', yangi: true }] : [])} pro={st.pro} />
      </div>
      {q > 0 && <ul className="pz-qatorlar">{S4_QATOR.slice(0, q).map((l, i) => <li key={i} className="fade-step">{tr(l)}</li>)}</ul>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · pullik qulaylik', ru: 'Понятие · платная функция' })} screen={screen} scrollSignal={q}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Yo'lni bosib chiqing (${q}/3)`, ru: `Пройдите путь (${q}/3)` })} onClick={onNext} /></>}>
      <div className="pz-s4">
        <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
          sarlavha={tr({ uz: <>Pullik qulaylik bosilganda <span className="italic" style={{ color: T.accent }}>nima ochiladi?</span></>, ru: <>Что откроется при нажатии <span className="italic" style={{ color: T.accent }}>платной функции?</span></> })}
          mentor={mIdx !== null && <Mentor>{tr(S4_MENTOR[mIdx])}</Mentor>}
          bashorat={<Bashorat savol={S4_SAVOL} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
          vizual={sahna}
          xulosa={done && tugadi && <XulosaQ togri={ok}
            natija={ok ? tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение подтвердилось ✓' }) : tr({ uz: 'Taxminingiz ✕ — aslida: nima ochilishi, narx va tugma', ru: 'Ваше предположение ✕ — на деле: что откроется, цена и кнопка' })}
            matn={tr({ uz: "Bu misolda karta ilovaga ham, Backend'ga ham kirmaydi: Pro'ni to'lov xabaridan keyin Backend yoqadi.", ru: 'В этом примере карта не попадает ни в приложение, ни в Backend: Pro включает Backend после сообщения об оплате.' })} />}
        >
          <Ustoz satrlar={USTOZ.s4} />
        </QTushuncha>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — O'Z NARXINGIZ (QMustaqil: ketma-ket 5 karta, bittadan — E 43, E 53; chapda telefon — o'quvchining to'lov taklifi ekrani jonli) =====
const S5_KARTA = [
  { k: 'xarajat', nom: { uz: 'Xarajat', ru: 'Расходы' } },
  { k: 'raqobat', nom: { uz: 'Raqobat', ru: 'Конкуренция' } },
  { k: 'qiymat', nom: { uz: 'Qiymat', ru: 'Ценность' } },
  { k: 'narx', nom: { uz: 'Narx', ru: 'Цена' } },
  { k: 'ekran', nom: { uz: 'Ekran', ru: 'Экран' } }
];
const S5_XATO = {
  xarajat: { uz: 'Xarajatni tanlang yoki son bilan yozing.', ru: 'Выберите расходы или впишите числом.' },
  manba: { uz: 'Bu son qayerdan — sahifa va sanasini yozing.', ru: 'Откуда это число — напишите страницу и дату.' },
  raqobat: { uz: 'Odamlar hozir nima bilan qiladi — shuni yozing.', ru: 'Чем люди делают это сейчас — напишите это.' },
  qiymat: { uz: 'Qulaylik qaysi ishni oladi — shuni yozing.', ru: 'Какую работу берёт на себя функция — напишите это.' },
  narx: { uz: "Narxni so'mda, son bilan yozing.", ru: 'Напишите цену в сумах, числом.' },
  davr: { uz: 'Muddatni kunda, son bilan yozing.', ru: 'Напишите срок в днях, числом.' },
  sarlavha: { uz: 'Sarlavhaga nima ochilishini yozing.', ru: 'Напишите в заголовке, что откроется.' }
};
const S5_MASLAHAT = {
  qoplanmaydi: { uz: "Hammasi to'lasa ham xarajat qoplanmaydi. Qayta ko'rasizmi?", ru: 'Даже если заплатят все, расходы не покрываются. Пересмотрите?' },
  vada: { uz: "To'lov ekranida faqat hozir ishlaydigan narsa yoziladi.", ru: 'На экране оплаты пишут только то, что работает сейчас.' },
  karta: { uz: "To'lov ekranida karta so'ralmaydi.", ru: 'На экране оплаты карту не запрашивают.' }
};
const VADA_RE = /tez orada|yaqinda|chegirma|faqat bugun|скоро|скидк|только сегодня/i;
const KARTA_RE = /karta|карт/i;
const MENTOR_XARAJAT = { oylik: 83000, manba: 'render.com/pricing, 07.10.2026' };
const BEPUL_XARAJAT = { oylik: 0, manba: 'bepul rejalar' };
const s5Bosh = (s, model) => {
  if (s && typeof s === 'object') {
    const x = s.xarajat || {};
    const xT = x.oylik === 0 && x.manba === BEPUL_XARAJAT.manba ? 'bepul' : x.oylik === MENTOR_XARAJAT.oylik && x.manba === MENTOR_XARAJAT.manba ? 'mentor' : x.oylik != null ? 'ozim' : null;
    const dk = son(s.davrKun) || 30;
    const e = s.ekran && typeof s.ekran === 'object' ? s.ekran : {};
    return { xT, oylik: x.oylik != null ? String(x.oylik) : '', manba: xT === 'ozim' ? String(x.manba || '') : '', raqobat: String(s.raqobat || ''), qiymat: String(s.qiymat || ''), narx: s.narx != null ? String(s.narx) : '', davr: dk === 30 ? '30' : 'boshqa', davrKun: dk === 30 ? '' : String(dk), sarlavha: String(e.sarlavha || ''), matn: String(e.matn || ''), tugma: String(e.tugma || '') };
  }
  return { xT: null, oylik: '', manba: '', raqobat: '', qiymat: String(model.nima || ''), narx: '', davr: '30', davrKun: '', sarlavha: '', matn: '', tugma: tr(NARX.ekran.tugma) };
};
const s5Xarajat = (d) => (d.xT === 'bepul' ? BEPUL_XARAJAT : d.xT === 'mentor' ? MENTOR_XARAJAT : d.xT === 'ozim' ? { oylik: son(d.oylik), manba: d.manba.trim() } : null);
const s5Davr = (d) => (d.davr === 'boshqa' ? son(d.davrKun) : 30);
const s5Xato = (i, d) => {
  if (i === 0) {
    if (!d.xT || (d.xT === 'ozim' && son(d.oylik) == null)) return S5_XATO.xarajat;
    if (d.xT === 'ozim' && !d.manba.trim()) return S5_XATO.manba;
  }
  if (i === 1 && !d.raqobat.trim()) return S5_XATO.raqobat;
  if (i === 2 && !d.qiymat.trim()) return S5_XATO.qiymat;
  if (i === 3) { if (!son(d.narx)) return S5_XATO.narx; if (!s5Davr(d)) return S5_XATO.davr; }
  if (i === 4 && !d.sarlavha.trim()) return S5_XATO.sarlavha;
  return null;
};
const SOM = { uz: "so'm", ru: 'сумов' };
const s5Hisob = (d, model) => {
  const narx = son(d.narx);
  const x = s5Xarajat(d);
  if (!narx || !x) return null;
  const soni = Number.isFinite(model.soni) && model.soni > 0 ? model.soni : null;
  if (!soni) return { k: 'h0', holat: 'kul', matn: tr({ uz: "Xarajat bilan solishtirish uchun to'lovchilar soni kerak", ru: 'Чтобы сравнить с расходами, нужно число плательщиков' }) };
  if (!x.oylik) return { k: 'h1', holat: 'kul', matn: tr({ uz: "Bugungi xarajat — 0 so'm", ru: 'Сегодняшние расходы — 0 сумов' }) };
  const jami = soni * narx;
  const qop = jami >= x.oylik;
  const manba = model.soniManba === 'database' ? tr({ uz: 'Neon soni', ru: 'число из Neon' }) : tr({ uz: 'taxmin', ru: 'предположение' });
  return {
    k: 'h2' + qop, holat: qop ? 'ok' : 'kul', qop,
    matn: tr({ uz: "Hammasi to'lasa (", ru: 'Если заплатят все (' }) + manba + '): ' + soni + ' × ' + sonFmt(narx) + ' = ' + sonFmt(jami) + ' ' + tr(SOM) + ' · ' + tr({ uz: 'xarajat: ', ru: 'расходы: ' }) + sonFmt(x.oylik) + ' ' + tr(SOM),
    muhr: qop ? tr({ uz: 'yozgan xarajatingizni qoplaydi', ru: 'покрывает записанные расходы' }) : tr({ uz: 'qoplamaydi', ru: 'не покрывает' })
  };
};
const qisqa = (s, n = 34) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
const s5Ixcham = (i, d) => {
  if (i === 0) { const x = s5Xarajat(d); return x ? sonFmt(x.oylik) + ' ' + tr(SOM) + ' · ' + qisqa(x.manba, 26) : ''; }
  if (i === 1) return qisqa(d.raqobat);
  if (i === 2) return qisqa(d.qiymat);
  if (i === 3) return (s5Davr(d) || 30) + ' ' + tr({ uz: 'kun', ru: 'дн.' }) + ' — ' + sonFmt(son(d.narx) || 0) + ' ' + tr(SOM);
  return qisqa(d.sarlavha);
};
const S5_YORDAM = [
  { uz: "Xarajat — bugun 0 so'm; uxlamaydigan Backend bilan taxminan 83 000 so'm (Render, 7-oktabr kursi)", ru: 'Расходы — сегодня 0 сумов; с Backend без сна примерно 83 000 сумов (Render, курс 7 октября)' },
  { uz: 'Raqobat — Telegram guruhi, bepul', ru: 'Конкуренция — Telegram-группа, бесплатно' },
  { uz: "Qiymat — «Doimiy o'yin» har haftalik e'lonni o'zi qiladi", ru: 'Ценность — «Постоянная игра» сама делает еженедельное объявление' },
  { uz: "Narx — 30 kun, 15 000 so'm (Mentorning taxmini)", ru: 'Цена — 30 дней, 15 000 сумов (предположение Ментора)' },
  { uz: "Ekran — «Doimiy o'yin — Pro'da» · «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · «To'lovga o'tish». Sizning sonlaringiz boshqa bo'ladi.", ru: 'Экран — «Постоянная игра — в Pro» · «Каждую неделю в тот же день и час игра объявляется сама.» · «Перейти к оплате». Ваши числа будут другими.' }
];
const PzYordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <>
      <QTugma ikkinchi className="pz-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="pz-yordam fade-step">{satrlar.map((l, i) => <span key={i} className={cx('pz-yordam-s', l.kul && 'kul')}>{tx(l)}</span>)}</span>}
    </>
  );
};
const Kiritish = ({ n, value, onChange, placeholder, qator = 1, son: sonli, refEl }) => (
  <label className="pz-in-j">
    {n != null && <i className="pz-in-n">{n}</i>}
    {qator > 1
      ? <textarea ref={refEl} className="pz-in" rows={qator} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
      : <input ref={refEl} className="pz-in" inputMode={sonli ? 'numeric' : undefined} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />}
  </label>
);
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useJonli();
  const saqlangan = useMemo(() => lsO(NARX_KEY), []);
  const model = useMemo(modelOl, []);
  const taxmin1 = useMemo(birlikTaxmin, []);
  const [d, setD] = useState(() => s5Bosh(saqlangan, model));
  const [k, setK] = useState(saqlangan ? 5 : 0);
  const [saqlandi, setSaqlandi] = useState(!!saqlangan);
  const [bir, setBir] = useState(!!saqlangan || !!storedAnswer);
  const [tahrir, setTahrir] = useState(false);
  const [xato, setXato] = useState(null);
  const kartaRef = useRef(null);
  // Xato chiqqanda — u pastki panel ostida qolmasin: ko'rinadigan joyga suriladi (1280×773, 1366×768)
  useEffect(() => {
    if (!xato) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.pz-s5 .pz-xato-j'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 60);
    return () => clearTimeout(t);
  }, [xato]);
  const up = (p) => { setD(o => ({ ...o, ...p })); setXato(null); };
  const tayyor = () => {
    const x = s5Xato(k, d);
    if (x) { setXato(x); return; }
    const li = typeof document !== 'undefined' ? document.querySelectorAll('.pz-s5 .q-qadamlar li')[k] : null;
    uchir(kartaRef.current, li, s5Ixcham(k, d));
    setXato(null);
    setK(tahrir ? 5 : k + 1);
    setTahrir(false);
  };
  const saqla = () => {
    for (let i = 0; i < 5; i++) { const x = s5Xato(i, d); if (x) { setK(i); setXato(x); return; } }
    const eski = lsO(NARX_KEY);
    lsY(NARX_KEY, {
      xarajat: s5Xarajat(d), raqobat: d.raqobat.trim(), qiymat: d.qiymat.trim(), narx: son(d.narx), davrKun: s5Davr(d),
      ekran: { sarlavha: d.sarlavha.trim(), matn: d.matn.trim(), tugma: d.tugma.trim() || tr(NARX.ekran.tugma) },
      ishlaydi: eski && eski.ishlaydi !== undefined ? eski.ishlaydi : null, savedAt: Date.now()
    });
    setSaqlandi(true); setBir(true);
    if (!storedAnswer) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'narx', correct: true, picked: true, solved: true });
  };
  const tahrirla = (i) => { setK(i); setTahrir(true); setSaqlandi(false); setXato(null); };
  const hisob = s5Hisob(d, model);
  const narxN = son(d.narx);
  const telNarx = narxN ? tn({ uz: (s5Davr(d) || 30) + ' kun — ' + sonFmt(narxN) + " so'm", ru: (s5Davr(d) || 30) + ' дн. — ' + sonFmt(narxN) + ' сумов' }) : tr({ uz: "… so'm", ru: '… сумов' });
  const tel = (
    <div className="pz-ms-tel">
      <Tel yorliq={tr({ uz: "Sizning to'lov ekraningiz", ru: 'Ваш экран оплаты' })}>
        <TaklifEkran sarlavha={d.sarlavha.trim() || '…'} matn={d.matn.trim()} narx={telNarx} tugma={d.tugma.trim() || tr(NARX.ekran.tugma)} />
      </Tel>
      {saqlandi && <button type="button" className="pz-ms-tahrir" onClick={() => tahrirla(4)}>✎ {tr({ uz: 'Ekran', ru: 'Экран' })}</button>}
    </div>
  );
  let maslahat = null;
  if (k === 3 && hisob && hisob.qop === false) maslahat = S5_MASLAHAT.qoplanmaydi;
  if (k === 4) { const e = [d.sarlavha, d.matn, d.tugma].join(' '); if (VADA_RE.test(e)) maslahat = S5_MASLAHAT.vada; else if (KARTA_RE.test(e)) maslahat = S5_MASLAHAT.karta; }
  const karta = k < 5 && (
    <div key={'k' + k} ref={kartaRef} className="pz-karta fade-up">
      <span className="pz-karta-h">{k + 1} / 5 · {tr(S5_KARTA[k].nom)}</span>
      {k === 0 && <>
        <p className="pz-kq"><i className="pz-in-n">1</i>{tr({ uz: 'Mahsulotni ushlab turishga oyiga qancha ketadi?', ru: 'Сколько в месяц уходит на поддержку продукта?' })}</p>
        <div className={cx('pz-xr-g', !d.xT && 'faol')}>
          <button type="button" className={cx('pz-xr', d.xT === 'bepul' && 'on')} onClick={() => up({ xT: 'bepul' })}>{tr({ uz: "Bugun — 0 so'm (bepul rejalar)", ru: 'Сегодня — 0 сумов (бесплатные планы)' })}</button>
          <button type="button" className={cx('pz-xr', d.xT === 'ozim' && 'on')} onClick={() => up({ xT: 'ozim' })}>{tr({ uz: "O'zim yozaman", ru: 'Напишу сам' })}</button>
          <button type="button" className={cx('pz-xr kichik', d.xT === 'mentor' && 'on')} onClick={() => up({ xT: 'mentor' })}>{tn({ uz: "Mentor misoli: Render — taxminan 83 000 so'm", ru: 'Пример Ментора: Render — примерно 83 000 сумов' })}<em>{tr({ uz: 'Render, oyiga 7 dollar · 7-oktabr kursi', ru: 'Render, 7 долларов в месяц · курс 7 октября' })}</em></button>
        </div>
        {d.xT === 'ozim' && <div className="pz-ikki fade-step">
          <Kiritish son value={d.oylik} onChange={v => up({ oylik: v })} placeholder={tr({ uz: "Oyiga, so'mda", ru: 'В месяц, в сумах' })} />
          <Kiritish value={d.manba} onChange={v => up({ manba: v })} placeholder={tr({ uz: 'Qayerdan bildingiz? Sahifa va sana', ru: 'Откуда узнали? Страница и дата' })} />
        </div>}
      </>}
      {k === 1 && <Kiritish n={2} qator={2} value={d.raqobat} onChange={v => up({ raqobat: v })} placeholder={tr({ uz: 'Odamlar bu ishni hozir nima bilan qiladi?', ru: 'Чем люди делают это сейчас?' })} />}
      {k === 2 && <Kiritish n={3} qator={2} value={d.qiymat} onChange={v => up({ qiymat: v })} placeholder={tr({ uz: "Pullik qulaylik odamning qaysi ishini oladi?", ru: 'Какую работу человека берёт платная функция?' })} />}
      {k === 3 && <>
        <Kiritish n={4} son value={d.narx} onChange={v => up({ narx: v })} placeholder={tr({ uz: "Necha so'm?", ru: 'Сколько сумов?' })} />
        <div className={cx('pz-muddat-g')}>
          <button type="button" className={cx('pz-muddat', d.davr === '30' && 'on')} onClick={() => up({ davr: '30' })}>{tr({ uz: '30 kun', ru: '30 дней' })}</button>
          <button type="button" className={cx('pz-muddat', d.davr === 'boshqa' && 'on')} onClick={() => up({ davr: 'boshqa' })}>{tr({ uz: 'Boshqa muddat', ru: 'Другой срок' })}</button>
          {d.davr === 'boshqa' && <Kiritish son value={d.davrKun} onChange={v => up({ davrKun: v })} placeholder={tr({ uz: 'kun', ru: 'дней' })} />}
        </div>
        {taxmin1 && <p className="pz-kul">{nbs(tr({ uz: '1-darsdagi taxminingiz: ', ru: 'Ваше предположение с 1-го урока: ' }) + sonFmt(taxmin1) + ' ' + tr(SOM))}</p>}
        {hisob && <p key={hisob.k} className={cx('pz-hisob-q', hisob.holat)}><span>{nbs(hisob.matn)}</span>{hisob.muhr && <b className="pz-muhr">{hisob.muhr}</b>}</p>}
      </>}
      {k === 4 && <>
        <Kiritish n={5} value={d.sarlavha} onChange={v => up({ sarlavha: v })} placeholder={tr({ uz: 'Sarlavha: nima ochiladi?', ru: 'Заголовок: что откроется?' })} />
        <Kiritish qator={2} value={d.matn} onChange={v => up({ matn: v })} placeholder={tr({ uz: 'Bir gap: u nima qiladi?', ru: 'Одна фраза: что она делает?' })} />
        <Kiritish value={d.tugma} onChange={v => up({ tugma: v })} placeholder={tr({ uz: 'Tugma', ru: 'Кнопка' })} />
        <p className="pz-kul">{tr(TEST_REJIM)}</p>
      </>}
      <div className="pz-karta-tug">
        <QTugma className="pz-halqa" onClick={tayyor}>{tr({ uz: 'Qator tayyor', ru: 'Строка готова' })}</QTugma>
        <span className="pz-sp" />
        <PzYordam satrlar={S5_YORDAM} />
      </div>
      {xato && <div className="pz-xato-j"><QXato>{tr(xato)}</QXato></div>}
      {!xato && maslahat && <p className="pz-maslahat">{tr(maslahat)}</p>}
    </div>
  );
  const qadamlar = S5_KARTA.map((c, i) => (i < k
    ? <span className="pz-qq"><b>{tr(c.nom)}</b> · {s5Ixcham(i, d)}{!saqlandi && <button type="button" className="pz-qq-t" onClick={() => tahrirla(i)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}</span>
    : tr(c.nom)));
  const sQatorlar = [
    { id: 'xarajat', nom: tr(S5_KARTA[0].nom), qiymat: s5Ixcham(0, d), holat: 'oq', tahrir: 0 },
    { id: 'raqobat', nom: tr(S5_KARTA[1].nom), qiymat: d.raqobat.trim(), holat: 'oq', tahrir: 1 },
    { id: 'qiymat', nom: tr(S5_KARTA[2].nom), qiymat: d.qiymat.trim(), holat: 'oq', tahrir: 2 },
    { id: 'narx', nom: tr(S5_KARTA[3].nom), qiymat: s5Ixcham(3, d), holat: 'ok', tahrir: 3 }
  ];
  const forma = isMentor
    ? <div className="pz-ms saqlangan"><div className="pz-ms-tel"><Tel yorliq={<>{tr({ uz: 'Mentorning ekrani', ru: 'Экран Ментора' })} · <MJ /></>}><MentorTaklif /></Tel></div>
      <Varaq qatorlar={NARX.varaq.map(v => ({ id: v.id, nom: tr(v.nom), qiymat: tn(v.qiymat), holat: v.id === 'narx' ? 'ok' : 'oq', taxmin: v.id === 'narx' }))} hisob={mentorHisob(1)} /></div>
    : saqlandi
      ? <div className="pz-ms saqlangan fade-step">{tel}<Varaq qatorlar={sQatorlar} onTahrir={tahrirla} hisob={hisob && { ...hisob, matn: nbs(hisob.matn) }} /></div>
      : <div className="pz-ms">{tel}
        <div className="pz-ms-o">
          <p className="pz-ms-kirish">{tr({ uz: 'Xarajat — oyiga, xizmat sahifasidan, sanasi bilan; qolgani — sizning taxminingiz.', ru: 'Расходы — в месяц, со страницы сервиса, с датой; остальное — ваше предположение.' })}</p>
          <QQadamlar qadamlar={qadamlar} joriy={k < 5 ? k : undefined} />
          {karta}
          {k >= 5 && <div className="pz-karta-tug"><QTugma className="pz-halqa" onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>{xato && <div className="pz-xato-j"><QXato>{tr(xato)}</QXato></div>}</div>}
        </div>
      </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={k}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!bir && !isMentor} label={bir || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Kartalarni to'ldiring (${Math.min(k, 5)}/5)`, ru: `Заполните карточки (${Math.min(k, 5)}/5)` })} onClick={onNext} /></>}>
      <div className="pz-s5">
        <QMustaqil
          sarlavha={tr({ uz: <>Mahsulotingiz narxi <span className="italic" style={{ color: T.accent }}>nimaga qarab</span> chiqadi?</>, ru: <>От чего <span className="italic" style={{ color: T.accent }}>зависит цена</span> вашего продукта?</> })}
          mentor={!saqlandi && !isMentor && <Mentor>{tr({ uz: 'Kartalarni bittadan to\'ldiring — xarajatdan boshlang, ekran matnini oxirida yozasiz.', ru: 'Заполняйте карточки по одной — начните с расходов, текст экрана напишете в конце.' })}</Mentor>}
          forma={forma}
        >
          <Ustoz satrlar={USTOZ.s5} />
        </QMustaqil>
        {saqlandi && !isMentor && <QXulosa>{tr({ uz: "Narxingiz saqlandi: to'rt qatori va to'lov ekrani matni bilan. Hozircha u — taxmin.", ru: 'Ваша цена сохранена: с четырьмя строками и текстом экрана оплаты. Пока это предположение.' })}</QXulosa>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen → QTest; INLINE_KEYS.s8 = 3; ikki blok birga) =====
const ProMini = () => (
  <div className="pz-pmini">
    <span className="pz-pmini-il"><MJ /><em>{tr({ uz: 'ilova', ru: 'приложение' })}</em></span>
    <span className="pz-pmini-yol"><em className="o">GET /men</em><em className="c">Pro</em></span>
    <BackendTugun kichik qatorlar={[]} pro={{ uz: '+30 kun', ru: '+30 дней' }} />
  </div>
);
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Tashkilotchi mashq to'lovdan keyin ilovaga qaytdi. Pro yoqilganini ilova qayerdan biladi?"
    question={tr({ uz: <h2 className="title h-ask">Tashkilotchi mashq to'lovdan keyin ilovaga qaytdi. Pro yoqilganini ilova <span className="italic" style={{ color: T.accent }}>qayerdan biladi?</span></h2>, ru: <h2 className="title h-ask">Организатор вернулся в приложение после учебной оплаты. <span className="italic" style={{ color: T.accent }}>Откуда приложение знает</span>, что Pro включён?</h2> })}
    options={[
      { uz: "Sahifadagi «To'lov o'tdi» yozuvidan", ru: 'Из надписи «Оплата прошла» на странице' },
      { uz: "Telefonda saqlangan o'z belgisidan", ru: 'Из своей метки, сохранённой в телефоне' },
      { uz: "To'lov taklifi ekrani yopilganidan", ru: 'Из того, что экран оплаты закрылся' },
      { uz: "Qayta so'rab olingan Pro holatidan", ru: 'Из статуса Pro, запрошенного заново' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Pro'ni Backend yoqadi — ilova uni qayta so'rab biladi.", ru: 'Pro включает Backend — приложение узнаёт это, спросив заново.' }}
    explainWrong={{
      0: { uz: 'Sahifa brauzerda turadi. Pro qayerda yoziladi?', ru: 'Страница открыта в браузере. Где записывается Pro?' },
      1: { uz: "Telefondagi belgi o'zi o'zgarmaydi. Pro qayerda yoziladi?", ru: 'Метка в телефоне сама не меняется. Где записывается Pro?' },
      2: { uz: 'Ekranni to\'lamasdan ham yopsa bo\'ladi. Pro qayerda yoziladi?', ru: 'Экран можно закрыть и без оплаты. Где записывается Pro?' },
      default: { uz: 'Pro qayerda yoziladi?', ru: 'Где записывается Pro?' }
    }}
    vizual={<ProMini />} />
);

// ===== NISHONLAR (4) — qilingan ishni aytadi; medal belgisi — o'yin qatlami =====
const ACHIEVEMENTS = {
  rowFinder: { icon: '🔎', name: 'Row Finder!', desc: { uz: "Gap narx varag'ining qaysi qatoriga yozilishini birinchi urinishda topdingiz", ru: 'С первой попытки нашли, в какую строку листа цены записать фразу' } },
  priceReasoned: { icon: '🏷️', name: 'Price Reasoned!', desc: { uz: 'Narxingizni xarajat, raqobat va qiymat bilan yozib saqladingiz', ru: 'Записали и сохранили цену с расходами, конкуренцией и ценностью' } },
  proSwitch: { icon: '🔓', name: 'Pro Switch!', desc: { uz: "Pullik qulaylikni Pro holatiga bog'lab, to'lov taklifi ekranini qo'ydingiz", ru: 'Связали платную функцию со статусом Pro и поставили экран предложения оплаты' } },
  testPayment: { icon: '🧾', name: 'Test Payment!', desc: { uz: "Mashq to'lovdan keyin qulaylik ochilishini o'zingiz tekshirdingiz", ru: 'Сами проверили, что после учебной оплаты функция открывается' } }
};
// Ekran id → nishon: s3 — birinchi urinish (ballik) · s5 — «Saqlash» (tekin bonus, MD) · a1, a2 — 4-qadam «Bajardim» (a2 — tekshiruv kartasi tanlangan bo'lsa)
const ACH_TRIGGERS = { s3: 'rowFinder', s5: 'priceReasoned', a1: 'proSwitch', a2: 'testPayment' };


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


// Podium savol yorliqlari (SCORED_IDX: 3, 8)
const Q_LABELS = {
  3: { uz: "1 — Narx varag'i qatori", ru: '1 — Строка листа цены' },
  8: { uz: '2 — Pro holati qayerdan', ru: '2 — Откуда статус Pro' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning fon so'zlari (MD; R-008: {uz, ru}, emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'narx', ru: 'цена' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'xarajat', ru: 'расходы' }, l: 82, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'raqobat', ru: 'конкуренция' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'qiymat', ru: 'ценность' }, l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: 'Pro', l: 45, t: 86, s: 26, d: 25, dl: 1.1 },
  { ch: { uz: "to'lov taklifi ekrani", ru: 'экран предложения оплаты' }, l: 58, t: 24, s: 18, d: 17, dl: 0.4 },
  { ch: { uz: "mashq to'lov", ru: 'учебная оплата' }, l: 24, t: 36, s: 20, d: 20, dl: 1.9 },
  { ch: { uz: 'test rejim', ru: 'тестовый режим' }, l: 18, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: { uz: "to'lov raqami", ru: 'номер платежа' }, l: 64, t: 50, s: 18, d: 22, dl: 0.6 },
  { ch: 'Maydon Jamoa', l: 30, t: 58, s: 18, d: 24, dl: 2.4 },
  { ch: '15 000', l: 88, t: 40, s: 22, d: 19, dl: 1.3 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javoblar 4 pozitsiyaga TENG (A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12)
const QUIZ_BANK = [
  { q: { uz: "Mentor ilovasida to'lov sahifasi qayerda ochiladi?", ru: 'Где в приложении Ментора открывается страница оплаты?' }, opts: [{ uz: "Telefon brauzerida, sahifa bo'lib", ru: 'В браузере телефона, страницей' }, { uz: "Ilova ichida, alohida to'lov oynasida", ru: 'Внутри приложения, в отдельном окне оплаты' }, { uz: 'Telegram botida, chatning ichida', ru: 'В Telegram-боте, внутри чата' }, { uz: "Play do'konida, to'lov oynasida", ru: 'В Play-маркете, в окне оплаты' }], correct: 0 },
  { q: { uz: "Mentor misolida «Doimiy o'yin» tashkilotchiga nima beradi?", ru: 'Что «Постоянная игра» даёт организатору в примере Ментора?' }, opts: [{ uz: "O'yinni pullik maydonda o'tkazadi", ru: 'Проводит игру на платном поле' }, { uz: "Har haftalik e'lonni o'zi qiladi", ru: 'Сама делает еженедельное объявление' }, { uz: "O'yinchilarni pul evaziga chaqiradi", ru: 'Зовёт игроков за деньги' }, { uz: "Telegram guruhini o'chirib qo'yadi", ru: 'Удаляет Telegram-группу' }], correct: 1 },
  { q: { uz: 'Mentor misolida Pro muddatini qaysi qism uzaytiradi?', ru: 'Какая часть продлевает срок Pro в примере Ментора?' }, opts: [{ uz: 'Ilova, tugma bosilganda', ru: 'Приложение, при нажатии кнопки' }, { uz: 'Mashq sahifasi, brauzerda', ru: 'Учебная страница, в браузере' }, { uz: 'Backend, xabar kelgach', ru: 'Backend, когда пришло сообщение' }, { uz: 'Tashkilotchi, sozlamada', ru: 'Организатор, в настройках' }], correct: 2 },
  { q: { uz: "Mashq to'lov sahifasida karta raqami qayerga yoziladi?", ru: 'Куда на учебной странице оплаты пишут номер карты?' }, opts: [{ uz: "Sahifadagi maydonga, to'lashdan oldin", ru: 'В поле на странице, перед оплатой' }, { uz: "Ilovaga, to'lov taklifi ekranida", ru: 'В приложение, на экране предложения оплаты' }, { uz: "Backend'ga, `.env` fayli orqali", ru: 'В Backend, через файл `.env`' }, { uz: "Hech qayerga, karta so'ralmaydi", ru: 'Никуда, карта не запрашивается' }], correct: 3 },
  { q: { uz: 'Mashq sahifasi qaysi raqam bilan ochiladi?', ru: 'С каким номером открывается учебная страница?' }, opts: [{ uz: "Backend bergan to'lov raqami bilan", ru: 'С номером платежа от Backend' }, { uz: "Tashkilotchi o'zi yozgan raqam bilan", ru: 'С номером, который ввёл организатор' }, { uz: "Ilova o'ylab topgan raqam bilan", ru: 'С номером, придуманным приложением' }, { uz: "Hisobingizning o'z raqami bilan", ru: 'С номером вашего аккаунта' }], correct: 0 },
  { q: { uz: "Mentor tekshiruv o'yinini bir hafta orqaga surdi. Ro'yxat yangilansa nima bo'ladi?", ru: 'Ментор сдвинул проверочную игру на неделю назад. Что будет, если обновить список?' }, opts: [{ uz: "Ilova o'yinni bekor deb ko'rsatadi", ru: 'Приложение покажет игру отменённой' }, { uz: "Keyingi haftaga yangi o'yin chiqadi", ru: 'Появится новая игра на следующую неделю' }, { uz: "Ilova xato ko'rsatib, ishlamay qoladi", ru: 'Приложение покажет ошибку и перестанет работать' }, { uz: "Ikkita yangi o'yin birdan chiqadi", ru: 'Сразу появятся две новые игры' }], correct: 1 },
  { q: { uz: "Pro muddati tugasa, Mentor ilovasida nima bo'ladi?", ru: 'Что будет в приложении Ментора, когда закончится срок Pro?' }, opts: [{ uz: 'Kartadan pul o\'zi yechib olinadi', ru: 'С карты сами спишутся деньги' }, { uz: 'Pro yana 30 kunga uzayadi', ru: 'Pro снова продлится на 30 дней' }, { uz: "Pro to'xtaydi va pul yechilmaydi", ru: 'Pro выключится, деньги не спишутся' }, { uz: "Hisob butunlay o'chiriladi", ru: 'Аккаунт полностью удалится' }], correct: 2 },
  { q: { uz: 'Mentor misolida xarajat qatoriga nima yozildi?', ru: 'Что записано в строку расходов в примере Ментора?' }, opts: [{ uz: 'Telegram guruhi bepul ekani', ru: 'Что Telegram-группа бесплатна' }, { uz: "Har haftalik e'lon ishi", ru: 'Работа с еженедельным объявлением' }, { uz: "30 kun uchun 15 000 so'm", ru: '15 000 сумов за 30 дней' }, { uz: 'Uxlamaydigan Backend puli', ru: 'Деньги на Backend без сна' }], correct: 3 },
  { q: { uz: "Bu modulda har to'lov ekranida qaysi qator turadi?", ru: 'Какая строка есть на каждом экране оплаты в этом модуле?' }, opts: [{ uz: 'Test rejim: pul yechilmaydi', ru: 'Тестовый режим: деньги не списываются' }, { uz: 'Chegirma: faqat bugungacha', ru: 'Скидка: только до сегодня' }, { uz: 'Karta raqamingizni kiriting', ru: 'Введите номер карты' }, { uz: 'Narx tez orada qimmatlashadi', ru: 'Цена скоро вырастет' }], correct: 0 },
  { q: { uz: 'Mentor narxi yonida qaysi yorliq turadi?', ru: 'Какая метка стоит рядом с ценой Ментора?' }, opts: [{ uz: 'Render sahifasidan', ru: 'Со страницы Render' }, { uz: 'Mentorning taxmini', ru: 'Предположение Ментора' }, { uz: 'Tashkilotchilar aytgani', ru: 'Со слов организаторов' }, { uz: "Bozordagi o'rtacha narx", ru: 'Средняя цена на рынке' }], correct: 1 },
  { q: { uz: "Agent «Pro yoqiladi, tayyor» dedi. Keyin nima qilasiz?", ru: 'Агент сказал «Pro включается, готово». Что дальше?' }, opts: [{ uz: 'Yakunga o\'tib, darsni tugatib qo\'yaman', ru: 'Перейду к итогу и закончу урок' }, { uz: "Agentdan yana bir marta so'rayman", ru: 'Спрошу агента ещё раз' }, { uz: "Mashq to'lov bilan o'zim tekshiraman", ru: 'Сам проверю учебной оплатой' }, { uz: "Kodni o'qimasdan push qilib qo'yaman", ru: 'Сделаю push, не читая код' }], correct: 2 },
  { q: { uz: "Mentor misolida tashkilotchi bugun o'yinni nima bilan yig'adi?", ru: 'Чем организатор в примере Ментора собирает игру сегодня?' }, opts: [{ uz: "Pro'dagi «Doimiy o'yin» bilan", ru: '«Постоянной игрой» в Pro' }, { uz: 'Lendingdagi asosiy tugma bilan', ru: 'Главной кнопкой на лендинге' }, { uz: 'Maydon egasining ilovasi bilan', ru: 'Приложением владельца поля' }, { uz: 'Bepul Telegram guruhi bilan', ru: 'Бесплатной Telegram-группой' }], correct: 3 }
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

// ===== AMALIYOT BLOKLARI (QBlok + ScreenBlok; o'quvchining o'z repo'si, 4 qadam). «Davom etish»: A1 — 3-qadamdan, A2 — 2-qadamdan keyin (E 55); bayroq — faqat 4-qadam «Bajardim»idan =====
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
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
const BLOK_TUGADI = { uz: 'Blok tugadi — «Davom etish»ni bosing.', ru: 'Блок завершён — нажмите «Продолжить».' };
const probel = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// Prompt qutisi: {…} joylari ajralib ko'rinadi, bo'sh joy yonida kulrang namuna; ✎ — matnni tahrirlash; «Nusxalash» — butun matn
const PzPrompt = ({ satrlar, namuna = {}, toldir = {}, tahrir = true }) => {
  const [ok, setOk] = useState(false);
  const [ed, setEd] = useState(null);
  const [edOchiq, setEdOchiq] = useState(false);
  const asl = satrlar.map(l => { let s = tr(l); Object.entries(toldir).forEach(([j, v]) => { if (v) s = s.split(j).join(v); }); return s; });
  const matn = ed != null ? ed.split('\n') : asl;
  const korildi = new Set();
  const joy = (t, li) => t.split(/(\{[^}]+\})/g).map((p, i) => {
    if (!/^\{.+\}$/.test(p)) return <React.Fragment key={li + '-' + i}>{fmtCode(p)}</React.Fragment>;
    const n = namuna[p];
    const yangi = !!n && !korildi.has(p);
    if (yangi) korildi.add(p);
    return <React.Fragment key={li + '-' + i}><span className="q-joy">{p}</span>{yangi && <span className="pz-joy-n">{tr(n)}</span>}</React.Fragment>;
  });
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  return (
    <span className="q-prompt pz-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span>
        {tahrir && <button type="button" className="pz-ed" aria-pressed={edOchiq} onClick={() => { if (ed == null) setEd(asl.join('\n')); setEdOchiq(o => !o); }} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
        <button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {edOchiq
        ? <textarea className="pz-prompt-ta" value={ed ?? ''} rows={Math.min(14, Math.max(5, matn.length + 1))} onChange={e => setEd(e.target.value)} aria-label={tr({ uz: 'Prompt matni', ru: 'Текст промпта' })} />
        : matn.map((l, i) => <span key={i} className="pz-ps">{joy(l, i)}</span>)}
    </span>
  );
};
const Band = ({ children, accent, kul }) => <span className={cx('pz-band', accent && 'accent', kul && 'kul')}>{children}</span>;
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, doneIzoh, ulgur, ulgurQadam = 99, yakun, ustoz }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam || isMentorLive;
  const bajardim = () => {
    if (isMentorLive || done) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { ...(storedAnswer || {}), stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, ...(yakun ? yakun() : {}) });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const birinchi = useRef(stepN); // oldingi qadam: StrictMode ikkinchi chaqiruvida ham ochilishda surilmaydi
  const tor = useIsMobile(768);
  useEffect(() => {
    if (birinchi.current === stepN) { return undefined; }
    birinchi.current = stepN;
    const t = setTimeout(() => { if (tor) { telBlokSur(done); return; } const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, tor ? 420 : 120); // telefonda — Mentor yig'ilish o'tishidan (0,38 s) keyin
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  const dt = typeof doneText === 'function' ? doneText() : doneText;
  const di = typeof doneIzoh === 'function' ? doneIzoh() : doneIzoh;
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={tor ? 0 : stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <div className="pz-blok">
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={steps.map(c => ({
            h: tr(c.h),
            t: <>{tx(c.t)}{c.bandlar && c.bandlar.filter(Boolean).map((b, i) => (b && (b.accent !== undefined || b.kul) && b.t ? <Band key={i} accent={b.accent} kul={b.kul}>{tx(b.t)}</Band> : <Band key={i}>{tx(b)}</Band>))}{c.prompt && <PzPrompt satrlar={c.prompt} namuna={c.namuna} toldir={c.toldir} tahrir={c.tahrir !== false} />}{c.ichi}</>,
            xato: c.yordam ? <>{c.err && <span className="pz-band">{tx(c.err)}</span>}<PzYordam satrlar={c.yordam} /></> : (c.err && tx(c.err))
          }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={dt ? tr(dt) : null} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<>{done && di && <p className="pz-blok-iz">{tr(di)}</p>}<MentorPracticeStats live={_live} screen={screen} /></>}>
          {ortda && <p className="pz-ortda">{tx(ortda)}</p>}
          {ulgur && !done && <p className="pz-ulgur">{tx(ulgur)}</p>}
          {ustoz && isMentorLive && <Ustoz satrlar={ustoz} />}
        </QBlok>
      </div>
    </Stage>
  );
}
const trekGap = (trek, mobil, web, ikkala) => (trek === 'mobil' ? mobil : trek === 'web' ? web : ikkala);
// Prompt joylari (qavslar) — uz va ru nomi; toldir/namuna kaliti tr(J.x)
const J = {
  pq: { uz: '{pullik qulaylik}', ru: '{платная функция}' },
  joy: { uz: '{qulaylik joyi}', ru: '{место функции}' },
  sar: { uz: '{sarlavha}', ru: '{заголовок}' },
  matn: { uz: '{matn}', ru: '{текст}' },
  davr: { uz: '{davr}', ru: '{срок}' },
  narx: { uz: '{narx}', ru: '{цена}' },
  tugma: { uz: '{tugma}', ru: '{кнопка}' },
  proJoy: { uz: '{Pro qatori joyi}', ru: '{место строки Pro}' },
  holat: { uz: '{hozirgi holat}', ru: '{текущее состояние}' }
};
const narxToldir = (n) => {
  const e = (n && n.ekran) || {};
  return {
    [tr(J.sar)]: String(e.sarlavha || '').trim(), [tr(J.matn)]: String(e.matn || '').trim(),
    [tr(J.davr)]: n && son(n.davrKun) ? String(son(n.davrKun)) : '', [tr(J.narx)]: n && son(n.narx) ? probel(son(n.narx)) : '', [tr(J.tugma)]: String(e.tugma || '').trim()
  };
};
const NARX_NAMUNA = () => ({
  [tr(J.sar)]: { uz: "masalan: Doimiy o'yin — Pro'da", ru: 'например: Постоянная игра — в Pro' },
  [tr(J.matn)]: { uz: "masalan: Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.", ru: 'например: Каждую неделю в тот же день и час игра объявляется сама.' },
  [tr(J.davr)]: { uz: 'masalan: 30', ru: 'например: 30' },
  [tr(J.narx)]: { uz: 'masalan: 15 000', ru: 'например: 15 000' },
  [tr(J.tugma)]: { uz: "masalan: To'lovga o'tish", ru: 'например: Перейти к оплате' }
});
// --- Amaliyot 1: kutilgan natija (bir marta o'zi yuradi): telefon · Neon kartasi · fayl kartasi ---
const NatijaA1 = () => {
  const [k, setK] = useState(() => (kamHarakat() ? 4 : 0));
  useEffect(() => { if (k >= 4) return undefined; const t = setTimeout(() => setK(n => n + 1), k === 0 ? 700 : 1300); return () => clearTimeout(t); }, [k]);
  return (
    <div className="pz-nat">
      <Tel ekranKey={k >= 2 ? 'pro' : k === 1 ? 'taklif' : 'elon'} yorliq={<MJ />}>
        {k === 1 ? <MentorTaklif sirgal /> : <ElonEkran belgiOn={k >= 2} pro={k >= 2 ? { uz: 'Pro: 8-oktabrgacha', ru: 'Pro: до 8 октября' } : null} oyinlar={k >= 3 ? 2 : 0} oyinKarta={{ uz: 'Shanba, 18:00 · tekshiruv · 0 / 10', ru: 'Суббота, 18:00 · проверка · 0 / 10' }} />}
      </Tel>
      <div className="pz-nat-o">
        <div className={cx('pz-kk', k >= 3 && 'on')}>
          <span className="pz-kk-h">Neon · SQL Editor</span>
          <code>SELECT id, pro_gacha …</code><span className="pz-kk-n">{tr({ uz: "7 · bo'sh", ru: '7 · пусто' })}</span>
          <code>UPDATE … kun - 7</code><span className="pz-kk-n">{tn({ uz: "O'yinlar: «Shanba, 18:00 · tekshiruv · 0 / 10» va keyingi haftaning kartasi", ru: 'Игры: «Суббота, 18:00 · проверка · 0 / 10» и карточка следующей недели' })}</span>
        </div>
        <div className={cx('pz-kk', k >= 4 && 'on')}>
          <span className="pz-kk-h">{tr({ uz: 'fayllar', ru: 'файлы' })}</span>
          <code>backend/src/…</code><span className="pz-kk-n">{tx({ uz: '`GET /men`, `oyinlar` — `doimiy`', ru: '`GET /men`, `oyinlar` — `doimiy`' })}</span>
          <code>mobil/…</code><span className="pz-kk-n">{tr({ uz: "«E'lon berish», to'lov taklifi ekrani", ru: '«Дать объявление», экран предложения оплаты' })}</span>
        </div>
      </div>
    </div>
  );
};
const A1_PROMPT = [
  { uz: "Qayerda: Backend — foydalanuvchilar jadvali, yangi `GET /men` yo'li va {pullik qulaylik} ishlaydigan yo'l; ilova — {qulaylik joyi} va yangi to'lov taklifi ekrani.", ru: 'Где: Backend — таблица пользователей, новый путь `GET /men` и путь, где работает {платная функция}; приложение — {место функции} и новый экран предложения оплаты.' },
  { uz: "Nima qilsin: 1) Foydalanuvchilar jadvaliga `pro_gacha` ustunini qo'sh: Pro muddati — sana yoki bo'sh; mavjud foydalanuvchilarda bo'sh qolsin. `GET /men` (token bilan) kirgan foydalanuvchiga `pro` (`pro_gacha` hozirdan keyin bo'lsa — rost) va `proGacha` ni qaytarsin; tokensiz — `401`.", ru: 'Что сделать: 1) Добавь в таблицу пользователей столбец `pro_gacha`: срок Pro — дата или пусто; у существующих пользователей пусто. `GET /men` (с токеном) возвращает вошедшему `pro` (истина, если `pro_gacha` позже текущего момента) и `proGacha`; без токена — `401`.' },
  { uz: "2) {pullik qulaylik} faqat Pro'da ishlasin. Backend ham tekshirsin: Pro bo'lmasa — `403`, hech narsa o'zgarmasin.", ru: '2) {платная функция} работает только в Pro. Backend тоже проверяет: без Pro — `403`, ничего не меняется.' },
  { uz: "3) Pro bo'lmasa, qulaylik bosilganda to'lov taklifi ekrani ochilsin: sarlavha «{sarlavha}», matn «{matn}», narx «{davr} kun — {narx} so'm», tugma «{tugma}», eng pastda kulrang «Test rejim: pul yechilmaydi». Karta yoki boshqa to'lov ma'lumoti so'raladigan maydon bo'lmasin. Ekrandan orqaga qaytsa bo'lsin. «{tugma}» hozircha hech narsa qilmasin.", ru: '3) Без Pro при нажатии функции открывается экран предложения оплаты: заголовок «{заголовок}», текст «{текст}», цена «{срок} дней — {цена} сумов», кнопка «{кнопка}», внизу серым «Тестовый режим: деньги не списываются». Никаких полей для карты или других платёжных данных. С экрана можно вернуться назад. «{кнопка}» пока ничего не делает.' },
  { uz: "4) Pro bo'lsa, qulaylik yonida kulrang qator: «Pro: {sana}gacha». Pro holatini ilova `GET /men` dan olsin.", ru: '4) С Pro рядом с функцией серая строка: «Pro: до {дата}». Статус Pro приложение берёт из `GET /men`.' },
  { uz: "Nima buzilmasin: qolgan ekranlar va yo'llar avvalgidek ishlasin; mavjud yozuvlar o'zgarmasin. Pro muddati tugagach Pro o'zi to'xtasin (`GET /men` da `pro` yolg'on) — hech qanday avtomatik to'lov yo'q. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: остальные экраны и пути работают как раньше; существующие записи не меняются. Когда срок Pro закончится, Pro сам выключается (`pro` в `GET /men` ложь) — никакой автоматической оплаты. Не трогай `.env`. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_YORDAM = [
  { uz: "Qayerda: `backend/` — `oyinchilar` jadvali, yangi `GET /men`, `oyinlar` jadvali, `POST /oyinlar` va `GET /oyinlar`; `mobil/` — «E'lon berish» ekrani va yangi to'lov taklifi ekrani.", ru: 'Где: `backend/` — таблица `oyinchilar`, новый `GET /men`, таблица `oyinlar`, `POST /oyinlar` и `GET /oyinlar`; `mobil/` — экран «Дать объявление» и новый экран предложения оплаты.' },
  { uz: "Nima qilsin: 1) `oyinchilar` ga `pro_gacha` (sana yoki bo'sh; mavjudlarida bo'sh). `GET /men` (token bilan) — `pro` (`pro_gacha` hozirdan keyin bo'lsa — rost) va `proGacha`; tokensiz — `401`.", ru: 'Что сделать: 1) в `oyinchilar` — `pro_gacha` (дата или пусто; у существующих пусто). `GET /men` (с токеном) — `pro` (истина, если `pro_gacha` позже текущего момента) и `proGacha`; без токена — `401`.' },
  { uz: "2) `oyinlar` ga `doimiy` (rost yoki yolg'on, sukut — yolg'on). «E'lon berish» ekranida belgi «Har hafta takrorlansin». `POST /oyinlar` `doimiy: true` ni faqat Pro'dagi tashkilotchidan qabul qilsin, aks holda `403` va o'yin yaratilmasin.", ru: '2) в `oyinlar` — `doimiy` (истина или ложь, по умолчанию ложь). На экране «Дать объявление» метка «Повторять каждую неделю». `POST /oyinlar` принимает `doimiy: true` только от организатора с Pro, иначе `403` и игра не создаётся.' },
  { uz: "3) `GET /oyinlar` so'ralganda: `doimiy` o'yinning vaqti o'tgan bo'lsa (Toshkent vaqti) — bir haftadan keyingi kunga, xuddi shu soat, maydon, kerakli odamlar soni va tashkilotchi bilan yangi o'yin yaratilsin; `doimiy` belgisi yangisiga o'tsin, eskisida o'chsin — bitta o'yindan keyingisi bir marta yaratiladi. Vaqtga bog'langan ish (taymer) qo'shma: Backend uxlashi mumkin.", ru: '3) При запросе `GET /oyinlar`: если время игры `doimiy` прошло (время Ташкента) — создаётся новая игра через неделю, с тем же часом, полем, числом людей и организатором; метка `doimiy` переходит на новую, у старой снимается — следующая создаётся один раз. Не добавляй работу по таймеру: Backend может заснуть.' },
  { uz: "4) Pro bo'lmasa, belgi bosilganda to'lov taklifi ekrani: sarlavha «Doimiy o'yin — Pro'da», matn «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.», narx «30 kun — 15 000 so'm», tugma «To'lovga o'tish», eng pastda kulrang «Test rejim: pul yechilmaydi». Karta maydoni bo'lmasin. Orqaga qaytsa — belgi o'chiq qolsin. «To'lovga o'tish» hozircha hech narsa qilmasin.", ru: '4) Без Pro при нажатии метки — экран предложения оплаты: заголовок «Постоянная игра — в Pro», текст «Каждую неделю в тот же день и час игра объявляется сама.», цена «30 дней — 15 000 сумов», кнопка «Перейти к оплате», внизу серым «Тестовый режим: деньги не списываются». Без поля карты. При возврате назад метка остаётся выключенной. «Перейти к оплате» пока ничего не делает.' },
  { uz: "5) Pro bo'lsa, belgi ostida kulrang qator: «Pro: {sana}gacha». Pro holatini ilova `GET /men` dan olsin — ilova ochilganda va «E'lon berish» ekrani ochilganda.", ru: '5) С Pro под меткой серая строка: «Pro: до {дата}». Статус Pro приложение берёт из `GET /men` — при открытии приложения и экрана «Дать объявление».' },
  { uz: "Nima buzilmasin: e'lon berish, qo'shilish, tasdiq, navbat, real vaqt va eslatmalar avvalgidek ishlasin; mavjud o'yinlar o'zgarmasin. Pro muddati tugagach Pro o'zi to'xtasin (`GET /men` da `pro` yolg'on) — hech qanday avtomatik to'lov yo'q. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: объявление, присоединение, подтверждение, очередь, реальное время и напоминания работают как раньше; существующие игры не меняются. Когда срок Pro закончится, Pro сам выключается (`pro` в `GET /men` ложь) — никакой автоматической оплаты. Не трогай `.env`. Больше ничего не трогай, назови изменённые файлы.' },
  { kul: true, uz: "Web-trekda — o'sha talab saytingizda: «ilova» o'rnida sayt, Pro holati sahifa ochilganda `GET /men` dan.", ru: 'В веб-треке — то же требование на сайте: вместо «приложения» сайт, статус Pro из `GET /men` при открытии страницы.' }
];
const A1_KUT = [{ uz: "Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: Backend Pro'ni tekshiradigan qator va ilova to'lov taklifi ekranini ochadigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в своём коде два места с именем файла и номером строки: строку, где Backend проверяет Pro, и строку, где приложение открывает экран предложения оплаты. Скажи одной фразой, что делает каждая. Код не меняй.' }];
const XATO_GAP = { uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если появилась ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Появилась такая ошибка: {ошибка}. Исправь.»' };
const ScreenA1 = (props) => {
  const model = useMemo(modelOl, []);
  const narx = useMemo(() => lsO(NARX_KEY), []);
  const trek = useMemo(trekOl, []);
  const boshqa = BOSHQA_MODEL.includes(model.model);
  const toldir = { [tr(J.pq)]: String(model.nima || '').trim(), ...narxToldir(narx) };
  const namuna = {
    [tr(J.pq)]: { uz: "masalan: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi", ru: 'например: каждую неделю в тот же день и час игра объявляется сама' },
    [tr(J.joy)]: boshqa ? { uz: "masalan: alohida mashq ekrani, menyuda yo'q", ru: 'например: отдельный учебный экран, его нет в меню' } : { uz: "masalan: «E'lon berish» ekranidagi belgi", ru: 'например: метка на экране «Дать объявление»' },
    ...NARX_NAMUNA()
  };
  return (
    <ScreenBlok {...props} ustoz={USTOZ.a1} eyebrow={{ uz: "Amaliyot 1 · Pro holati va to'lov taklifi ekrani", ru: 'Практика 1 · статус Pro и экран предложения оплаты' }}
      title={{ uz: <>Pullik qulaylik bosilsa, <span className="italic" style={{ color: T.accent }}>to'lov taklifi ekrani</span> chiqsin.</>, ru: <>При нажатии платной функции пусть появится <span className="italic" style={{ color: T.accent }}>экран предложения оплаты</span>.</> }}
      mentor={{ uz: "Talab tayyor — qavslarga pullik qulayligingizni va uning joyini yozasiz; «1 · Ochish»dan boshlang.", ru: 'Требование готово — в скобки впишете свою платную функцию и её место; начните с «1 · Открыть».' }}
      ulgurQadam={3}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: o'zgargan fayl yo'q, `.env` ro'yxatda ko'rinmaydi.", ru: 'Откройте свой репозиторий в Antigravity. В терминале `git status`: изменённых файлов нет, `.env` в списке не видно.' },
          bandlar: [
            { uz: "Mahsulotingizda qaysi qulaylik pullik bo'lishini tanlang — 2-darsda «nima uchun to'laydi» deb yozgansiz (pastdagi qavsga oldindan qo'yilgan bo'lsa — tekshiring). Mentor misolida — «Doimiy o'yin».", ru: 'Выберите, какая функция в продукте будет платной — на 2-м уроке вы писали «за что платят» (если она уже стоит в скобках ниже — проверьте). В примере Ментора — «Постоянная игра».' },
            { accent: boshqa, t: { uz: "Modelingiz reklama, B2B (boshqa biznes to'laydi) yoki tranzaksiya (har to'lovdan ulush) bo'lsa — bu amaliyotni alohida mashq ekranida qiling: menyuda ko'rinmaydigan, faqat siz ochadigan ekranda bitta qulaylik va to'lov taklifi ekrani; mahsulotingizning asosiy ekranlari va modeli o'zgarmaydi.", ru: 'Если ваша модель — реклама, B2B (платит другой бизнес) или транзакция (доля с каждого платежа) — делайте эту практику на отдельном учебном экране: на экране, которого нет в меню и который открываете только вы, одна функция и экран предложения оплаты; основные экраны и модель продукта не меняются.' } },
            trekGap(trek, { uz: 'Mobil trek — qulaylik ilovada (talab bir xil).', ru: 'Мобильный трек — функция в приложении (требование то же).' }, { uz: 'Web-trek — qulaylik saytda (talab bir xil).', ru: 'Веб-трек — функция на сайте (требование то же).' }, { uz: 'Mobil trek — qulaylik ilovada · web-trek — qulaylik saytda (talab bir xil).', ru: 'Мобильный трек — функция в приложении · веб-трек — функция на сайте (требование то же).' })
          ] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'заполните скобки (рядом серый образец), нажмите «Скопировать», отправьте в Antigravity:' },
          prompt: A1_PROMPT, toldir, namuna, yordam: A1_YORDAM },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: { uz: "agent tugatgach: `git diff` — o'zgarish agent aytgan fayllardami; `git status` — `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan → `git commit -m \"4-dars: Pro holati va to'lov taklifi ekrani\"` → `git push`.", ru: 'когда агент закончит: `git diff` — изменения в тех файлах, что назвал агент; `git status` — `.env` нет в списке; каждый файл через `git add <файл>` → `git commit -m "4-dars: Pro holati va to\'lov taklifi ekrani"` → `git push`.' },
          bandlar: [
            { uz: "Render'da yangi versiya tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Mobil trekda `npx expo start`, QR'ni Expo Go bilan oching; web-trekda `npm run dev`.", ru: 'Дождитесь, пока в Render завершится новая версия (может занять несколько минут). В мобильном треке `npx expo start`, откройте QR в Expo Go; в веб-треке `npm run dev`.' },
            { uz: 'Kutayotganda agentga:', ru: 'Пока ждёте — агенту:' }
          ],
          ichi: <><PzPrompt satrlar={A1_KUT} tahrir={false} /><Band>{tx(XATO_GAP)}</Band></> },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: { uz: "agent nima desa ham, o'zingiz tekshiring:", ru: 'что бы ни сказал агент, проверьте сами:' },
          bandlar: [
            { uz: "(1) Pro'siz: pullik qulaylikni bosing — to'lov taklifi ekrani chiqishi kerak: so'zlar narx varag'ingizdagidek, eng pastda «Test rejim: pul yechilmaydi», karta maydoni yo'q. Orqaga qayting. «{tugma}» hozircha hech narsa qilmaydi — bu kutilgan holat.", ru: '(1) Без Pro: нажмите платную функцию — должен появиться экран предложения оплаты: слова как в листе цены, внизу «Тестовый режим: деньги не списываются», поля карты нет. Вернитесь назад. «{кнопка}» пока ничего не делает — так и должно быть.' },
            { uz: "(2) Hisobingiz: Neon SQL Editor'da `SELECT id, pro_gacha FROM oyinchilar WHERE login = '{loginingiz}';` → «Run»: `pro_gacha` bo'sh. `id` ni yozib oling — bu hisob raqamingiz (jadval va ustun nomi — mahsulotingizdagidek).", ru: '(2) Ваш аккаунт: в Neon SQL Editor `SELECT id, pro_gacha FROM oyinchilar WHERE login = \'{ваш логин}\';` → «Run»: `pro_gacha` пусто. Запишите `id` — это номер вашего аккаунта (имена таблицы и столбца — как в вашем продукте).' },
            { uz: "(3) Pro bilan (faqat tekshiruv uchun): `UPDATE oyinchilar SET pro_gacha = now() + interval '1 day' WHERE id = {hisob raqamingiz};` → ilovani qayta oching: qulaylik ochiladi, yonida «Pro: {sana}gacha».", ru: '(3) С Pro (только для проверки): `UPDATE oyinchilar SET pro_gacha = now() + interval \'1 day\' WHERE id = {номер аккаунта};` → откройте приложение заново: функция открывается, рядом «Pro: до {дата}».' },
            { uz: "Mentor misolida: «Har hafta takrorlansin» bilan tekshiruv o'yini e'lon qilinadi (maydon — «tekshiruv»); `SELECT id, kun, soat FROM oyinlar WHERE maydon = 'tekshiruv';` → `UPDATE oyinlar SET kun = kun - 7 WHERE id = {o'yin raqami};` — ro'yxatni yangilang: xuddi shu soatda, bir haftadan keyingi kunga yangi o'yin chiqishi kerak; yana yangilang — ikkinchi nusxa chiqmasligi kerak.", ru: 'В примере Ментора: с «Повторять каждую неделю» объявляется проверочная игра (поле — «tekshiruv»); `SELECT id, kun, soat FROM oyinlar WHERE maydon = \'tekshiruv\';` → `UPDATE oyinlar SET kun = kun - 7 WHERE id = {номер игры};` — обновите список: в тот же час через неделю должна появиться новая игра; обновите ещё раз — второй копии быть не должно.' },
            { uz: "(4) Tozalash: `UPDATE oyinchilar SET pro_gacha = NULL WHERE id = {hisob raqamingiz};` — Amaliyot 2 Pro'siz hisobdan boshlanadi. Mentor misolida tekshiruv o'yinlari: `DELETE FROM oyinlar WHERE id IN ({o'yin raqamlari});` — faqat tekshiruv o'yinlari, ularga hech kim qo'shilmagan.", ru: '(4) Очистка: `UPDATE oyinchilar SET pro_gacha = NULL WHERE id = {номер аккаунта};` — Практика 2 начинается с аккаунта без Pro. В примере Ментора проверочные игры: `DELETE FROM oyinlar WHERE id IN ({номера игр});` — только проверочные игры, к ним никто не присоединился.' },
            { uz: "Ustun nomlari boshqacha bo'lsa — agentga: «Neon SQL Editor uchun shu ishni qiladigan SQL yoz, o'zing ishga tushirma: {ish}. Jadvallarni o'zgartirma.» — SQL'ni o'qib, «Run».", ru: 'Если имена столбцов другие — агенту: «Напиши SQL для Neon SQL Editor, который делает это, сам не запускай: {задача}. Таблицы не меняй.» — прочитайте SQL и нажмите «Run».' },
            { uz: "Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Что не совпало — напишите агенту: «{что} не как в требовании: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»' }
          ] }
      ]}
      natija={<NatijaA1 />}
      ortda={{ uz: "Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-04-done` — oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` ga o'z qiymatlaringizni yozasiz (`TOLOV_KALITI` ham).", ru: 'Отстали — откройте пример Ментора вне своего репозитория, в новой папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-04-done` — последнюю команду запускайте только в этой новой папке: она стирает изменения в папке. В `backend/.env` впишете свои значения (и `TOLOV_KALITI`).' }}
      ulgur={{ uz: "Ulgurmasangiz: Render kutishi cho'zilsa — 4-qadamning (3) va (4) uyda; 3-qadamdan keyin «Davom etish» ochiladi — Amaliyot 2 ga o'ting (uning (1) qadami Pro'siz hisob bilan baribir ishlaydi). Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Не успеваете: если ожидание Render затянулось — (3) и (4) из 4-го шага дома; после 3-го шага откроется «Продолжить» — переходите к Практике 2 (её шаг (1) работает и с аккаунтом без Pro). Блок считается выполненным после «Готово» на 4-м шаге.' }}
      doneText={{ uz: "Pullik qulaylik Pro'ni so'raydi; Pro'siz to'lov taklifi ekrani chiqadi.", ru: 'Платная функция требует Pro; без Pro появляется экран предложения оплаты.' }}
      doneIzoh={{ uz: "«To'lovga o'tish» hali ulanmagan — uni keyingi amaliyotda ulaysiz.", ru: '«Перейти к оплате» пока не подключена — подключите её в следующей практике.' }} />
  );
};
// --- Amaliyot 2: kutilgan natija: telefon (taklif → mashq sahifasi → «To'lov o'tdi» → ilova Pro) · Backend kartasi · brauzer, ikkinchi kadr ---
const NatijaA2 = () => {
  const [k, setK] = useState(() => (kamHarakat() ? 4 : 0));
  useEffect(() => { if (k >= 4) return undefined; const t = setTimeout(() => setK(n => n + 1), k === 0 ? 700 : 1300); return () => clearTimeout(t); }, [k]);
  return (
    <div className="pz-nat">
      <div className="pz-nat-tel">
        <Tel ekranKey={'a2-' + Math.min(k, 3)} yorliq={k === 1 || k === 2 ? tr({ uz: 'brauzer', ru: 'браузер' }) : <MJ />}>
          {k === 0 ? <MentorTaklif /> : k <= 2 ? <MashqSahifa otdi={k === 2} /> : <ElonEkran belgiOn pro={NARX.elon.pro} />}
        </Tel>
        <p className="pz-nat-huquq">{tr({ uz: "Real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT (yakka tartibdagi tadbirkor) bilan; bu kursda emas.", ru: 'Реальный запуск — с письменного согласия родителей и через юрлицо или ИП (индивидуального предпринимателя); не в этом курсе.' })}</p>
      </div>
      <div className="pz-nat-o">
        <div className={cx('pz-kk', k >= 1 && 'on')}>
          <span className="pz-kk-h">Backend</span>
          <code>boshlangan_tolovlar</code><span className="pz-kk-n">{nbs('m-7f3a… · 7 · 15 000')}</span>
          {k >= 2 && <><code>tolovlar</code><span className="pz-kk-n ok">{nbs('m-7f3a… · tolandi · 15 000')}</span></>}
          {k >= 3 && <><code>oyinchilar</code><span className="pz-kk-n ok">{tr({ uz: '7 · pro_gacha: 6-noyabr', ru: '7 · pro_gacha: 6 ноября' })}</span></>}
        </div>
        {k >= 4 && <div className="pz-kk on fade-step"><span className="pz-kk-h">{tr({ uz: 'brauzer, ikkinchi kadr', ru: 'браузер, второй кадр' })}</span><MashqSahifa topilmadi /></div>}
      </div>
    </div>
  );
};
const A2_PROMPT = [
  { uz: "Qayerda: Backend — yangi `POST /tolov/boshlash`, 3-darsdagi mashq to'lov sahifasi va `POST /tolov/webhook`; ilova — to'lov taklifi ekranidagi «{tugma}» va {Pro qatori joyi}; `README.md` dagi «To'lov» bo'limi.", ru: 'Где: Backend — новый `POST /tolov/boshlash`, учебная страница оплаты из 3-го урока и `POST /tolov/webhook`; приложение — «{кнопка}» на экране предложения оплаты и {место строки Pro}; раздел «Оплата» в `README.md`.' },
  { uz: "Nima qilsin: 1) `POST /tolov/boshlash` (token bilan): taxmin qilib bo'lmaydigan yangi to'lov raqamini yaratsin (`m-` va tasodifiy harf-raqamlar, ketma-ket raqam emas) va uni kirgan foydalanuvchi hamda summa bilan alohida jadvalga yozsin. Narx va muddat Backend'da bitta joyda turadi ({narx} so'm, {davr} kun) — summa shu joydan olinsin. Javob — `{ tolovRaqami, havola }`; havola — mashq to'lov sahifasi shu raqam bilan.", ru: 'Что сделать: 1) `POST /tolov/boshlash` (с токеном): создаёт новый номер платежа, который нельзя угадать (`m-` и случайные буквы-цифры, не по порядку), и записывает его с вошедшим пользователем и суммой в отдельную таблицу. Цена и срок хранятся в Backend в одном месте ({цена} сумов, {срок} дней) — сумма берётся оттуда. Ответ — `{ tolovRaqami, havola }`; ссылка — учебная страница оплаты с этим номером.' },
  { uz: "2) Mashq to'lov sahifasi faqat shu raqam bilan ishlasin: raqam yo'q yoki jadvalda bo'lmasa — «To'lov topilmadi.» va tugmalar yo'q. Hisob va summa raqamdan olinsin; sahifadagi to'rt tugma yangi raqam yaratmasin — shu raqam bilan ishlasin. «To'lash (mashq)» javobi kelgach: to'lov o'tgan bo'lsa — «To'lov o'tdi (mashq) — ilovaga qayting.», rad etilgan bo'lsa — «To'lov o'tmadi.»", ru: '2) Учебная страница работает только с этим номером: нет номера или его нет в таблице — «To\'lov topilmadi.» и кнопок нет. Аккаунт и сумма берутся по номеру; четыре кнопки страницы не создают новый номер — работают с этим. После ответа на «To\'lash (mashq)»: если оплата прошла — «To\'lov o\'tdi (mashq) — ilovaga qayting.», если отклонена — «To\'lov o\'tmadi.»' },
  { uz: "3) `POST /tolov/webhook` dagi tartib o'zgarmasin: avval imzo, keyin takror, keyin yozuv. Hisob va summa xabardan emas, alohida jadvaldagi shu raqam yozuvidan olinsin; raqam u yerda bo'lmasa yoki xabardagi hisob va summa unga mos kelmasa — `400`, hech narsa yozilmasin. To'lov yangi yozilgan va holati `tolandi` bo'lsa — shu hisobning `pro_gacha` si {davr} kunga uzaysin: Pro bo'lmasa hozirdan, bo'lsa muddat oxiridan. To'lov yozuvi va Pro uzayishi bitta Database ishida bo'lsin: biri bajarilmasa, ikkinchisi ham bajarilmasin. Bitta raqam — bitta natija: shu raqam bilan keyingi xabar (rad etilgandan keyingi «To'lash» ham) takror deb olinsin.", ru: '3) Порядок в `POST /tolov/webhook` не меняется: сначала подпись, потом повтор, потом запись. Аккаунт и сумма берутся не из сообщения, а из записи этого номера в отдельной таблице; если номера там нет или аккаунт и сумма в сообщении не совпадают — `400`, ничего не записывается. Если платёж записан впервые и статус `tolandi` — `pro_gacha` этого аккаунта продлевается на {срок} дней: без Pro — от текущего момента, с Pro — от конца срока. Запись платежа и продление Pro — одна операция в Database: если одно не выполнится, не выполнится и другое. Один номер — один результат: следующее сообщение с этим номером (и «To\'lash» после отклонения) считается повтором.' },
  { uz: "4) Ilovada «{tugma}» bosilganda — `POST /tolov/boshlash`, keyin havolani telefon brauzerida ochsin. Ilovaga qaytganda `GET /men` ni qayta so'rab, {Pro qatori joyi} ni yangilasin.", ru: '4) При нажатии «{кнопка}» в приложении — `POST /tolov/boshlash`, затем ссылка открывается в браузере телефона. При возврате в приложение заново запрашивается `GET /men` и обновляется {место строки Pro}.' },
  { uz: "5) `README.md` dagi «To'lov» bo'limida «Hozircha» qatori o'rniga shuni yoz: {hozirgi holat}", ru: '5) В разделе «Оплата» в `README.md` вместо строки «Пока» напиши: {текущее состояние}' },
  { uz: "Nima buzilmasin: 3-darsdagi uch tekshiruv avvalgidek ishlasin (imzosiz — `401`, ikki marta — bitta qator, rad — «rad» qatori). Karta yoki boshqa to'lov ma'lumoti so'raladigan maydon bo'lmasin; Payme yoki Click nomi va ko'rinishi ishlatilmasin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: три проверки из 3-го урока работают как раньше (без подписи — `401`, дважды — одна строка, отклонение — строка «rad»). Никаких полей для карты или других платёжных данных; не использовать название и вид Payme или Click. Значение `TOLOV_KALITI` никуда не пиши. Не трогай файлы `.env`. Больше ничего не трогай, назови изменённые файлы.' }
];
const A2_YORDAM = [
  { uz: "Qayerda: `backend/` — yangi `POST /tolov/boshlash` va jadval `boshlangan_tolovlar`, `GET /tolov-mashq`, `POST /tolov/webhook`; `mobil/` — to'lov taklifi ekranidagi «To'lovga o'tish» va «E'lon berish» ekranidagi Pro qatori; `README.md` — «To'lov» bo'limi.", ru: 'Где: `backend/` — новый `POST /tolov/boshlash` и таблица `boshlangan_tolovlar`, `GET /tolov-mashq`, `POST /tolov/webhook`; `mobil/` — «Перейти к оплате» на экране предложения оплаты и строка Pro на экране «Дать объявление»; `README.md` — раздел «Оплата».' },
  { uz: "Nima qilsin: 1) `POST /tolov/boshlash` (token bilan): yangi to'lov raqami — `m-` va tasodifiy 12 ta harf-raqam (ketma-ket emas: raqam manzilda turadi); `boshlangan_tolovlar` ga yozsin — `tolov_raqami` (noyob), `oyinchi_id` (kirgan tashkilotchi), `summa`, `yaratilgan`. Narx va muddat Backend'da bitta joyda: `PRO_NARX = 15000`, `PRO_KUN = 30` — summa va Pro muddati shu joydan. Javob — `{ tolovRaqami, havola }`, havola — `{Backend manzili}/tolov-mashq?raqam={tolovRaqami}`.", ru: 'Что сделать: 1) `POST /tolov/boshlash` (с токеном): новый номер платежа — `m-` и 12 случайных букв-цифр (не по порядку: номер стоит в адресе); запись в `boshlangan_tolovlar` — `tolov_raqami` (уникальный), `oyinchi_id` (вошедший организатор), `summa`, `yaratilgan`. Цена и срок в Backend в одном месте: `PRO_NARX = 15000`, `PRO_KUN = 30` — сумма и срок Pro оттуда. Ответ — `{ tolovRaqami, havola }`, ссылка — `{адрес Backend}/tolov-mashq?raqam={tolovRaqami}`.' },
  { uz: "2) `GET /tolov-mashq` faqat `raqam` bilan ishlasin: raqam yo'q yoki `boshlangan_tolovlar` da bo'lmasa — «To'lov topilmadi.» va tugmalar yo'q. `oyinchi` va `summa` raqamdan olinsin (manzildagi `oyinchi` va `summa` endi ishlatilmasin); to'rt tugma shu raqam bilan ishlasin. «To'lash (mashq)» javobi kelgach: `200 { ok: true }` — «To'lov o'tdi (mashq) — ilovaga qayting.», rad — «To'lov o'tmadi.»", ru: '2) `GET /tolov-mashq` работает только с `raqam`: нет номера или его нет в `boshlangan_tolovlar` — «To\'lov topilmadi.» и кнопок нет. `oyinchi` и `summa` берутся по номеру (`oyinchi` и `summa` из адреса больше не используются); четыре кнопки работают с этим номером. После ответа на «To\'lash (mashq)»: `200 { ok: true }` — «To\'lov o\'tdi (mashq) — ilovaga qayting.», отклонение — «To\'lov o\'tmadi.»' },
  { uz: "3) `POST /tolov/webhook`: tartib o'zgarmasin — avval imzo, keyin takror, keyin yozuv. `oyinchi_id` va `summa` xabardan emas, `boshlangan_tolovlar` dagi shu raqam yozuvidan olinsin; raqam u yerda bo'lmasa yoki xabardagi qiymatlar mos kelmasa — `400`, hech narsa yozilmasin. To'lov yangi yozilgan va holati `tolandi` bo'lsa — `oyinchilar.pro_gacha` `PRO_KUN` kunga uzaysin: Pro bo'lmasa hozirdan, bo'lsa muddat oxiridan. To'lov yozuvi va Pro uzayishi bitta Database ishida: biri bajarilmasa, ikkinchisi ham bajarilmasin. Bitta raqam — bitta natija: shu raqam bilan keyingi xabar (rad etilgandan keyingi «To'lash» ham) takror.", ru: '3) `POST /tolov/webhook`: порядок не меняется — сначала подпись, потом повтор, потом запись. `oyinchi_id` и `summa` берутся не из сообщения, а из записи этого номера в `boshlangan_tolovlar`; если номера нет или значения не совпадают — `400`, ничего не записывается. Если платёж записан впервые и статус `tolandi` — `oyinchilar.pro_gacha` продлевается на `PRO_KUN` дней: без Pro — от текущего момента, с Pro — от конца срока. Запись платежа и продление Pro — одна операция в Database: если одно не выполнится, не выполнится и другое. Один номер — один результат: следующее сообщение с этим номером (и «To\'lash» после отклонения) — повтор.' },
  { uz: "4) «To'lovga o'tish» bosilganda — `POST /tolov/boshlash`, keyin `havola` ni telefon brauzerida ochsin. Ilovaga qaytganda `GET /men` ni qayta so'rab, «Pro: {sana}gacha» qatorini va belgini yangilasin.", ru: '4) При нажатии «Перейти к оплате» — `POST /tolov/boshlash`, затем `havola` открывается в браузере телефона. При возврате в приложение заново запрашивается `GET /men` и обновляются строка «Pro: до {дата}» и метка.' },
  { uz: "5) `README.md` «To'lov» bo'limida «Hozircha» qatori o'rniga: Hozircha: «To'lovga o'tish» Backend'dan to'lov raqamini oladi va mashq to'lov sahifasini ochadi; «To'lash (mashq)» dan keyin to'lov xabari Pro'ni 30 kunga uzaytiradi, ilova uni `GET /men` dan o'qiydi. Test rejim: pul yechilmaydi.", ru: '5) В разделе «Оплата» `README.md` вместо строки «Пока»: Пока: «Перейти к оплате» берёт номер платежа у Backend и открывает учебную страницу оплаты; после «To\'lash (mashq)» сообщение об оплате продлевает Pro на 30 дней, приложение читает это из `GET /men`. Тестовый режим: деньги не списываются.' },
  { uz: "Nima buzilmasin: 3-darsdagi uch tekshiruv avvalgidek ishlasin (imzosiz — `401`, ikki marta — bitta qator, rad — «rad» qatori). Karta maydoni bo'lmasin; Payme yoki Click nomi va ko'rinishi ishlatilmasin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: три проверки из 3-го урока работают как раньше (без подписи — `401`, дважды — одна строка, отклонение — строка «rad»). Без поля карты; не использовать название и вид Payme или Click. Значение `TOLOV_KALITI` никуда не пиши. Не трогай файлы `.env`. Больше ничего не трогай, назови изменённые файлы.' },
  { kul: true, uz: "Web-trek qatori: 4-bandda «telefon brauzerida» o'rniga — «yangi oynada»; saytga qaytganda (oyna yana ochilganda) `GET /men` qayta so'ralsin.", ru: 'Строка для веб-трека: в пункте 4 вместо «в браузере телефона» — «в новом окне»; при возврате на сайт (когда окно снова открыто) заново запрашивается `GET /men`.' }
];
const A2_KUT = [{ uz: "Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: to'lov raqami yaratiladigan qator, mashq sahifasi raqamni tekshiradigan qator va Pro muddati uzayadigan qator. Pro takror tekshiruvidan keyin uzayadimi — bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в своём коде три места с именем файла и номером строки: строку, где создаётся номер платежа, строку, где учебная страница проверяет номер, и строку, где продлевается срок Pro. Скажи одной фразой: продлевается ли Pro после проверки повтора. Код не меняй.' }];
const ScreenA2 = (props) => {
  const { storedAnswer, onAnswer, screen } = props;
  const narx = useMemo(() => lsO(NARX_KEY), []);
  const oqim = useMemo(() => lsO(OQIM_KEY), []);
  const trek = useMemo(trekOl, []);
  const [tanlov, setTanlov] = useState(() => (storedAnswer && typeof storedAnswer.tanlov === 'boolean' ? storedAnswer.tanlov : (narx && typeof narx.ishlaydi === 'boolean' ? narx.ishlaydi : null)));
  const tanla = (v) => {
    setTanlov(v);
    const n = lsO(NARX_KEY);
    if (n) lsY(NARX_KEY, { ...n, ishlaydi: v, savedAt: Date.now() });
    if (!(storedAnswer && storedAnswer.solved)) onAnswer(screen, { ...(storedAnswer || {}), tanlov: v, solved: false, correct: false });
  };
  const ochiqTest = oqim && oqim.test && typeof oqim.test === 'object' ? ['imzo', 'takror', 'rad'].filter(t => oqim.test[t] !== true) : [];
  const toldir = narxToldir(narx);
  const namuna = {
    [tr(J.proJoy)]: { uz: "masalan: «E'lon berish» ekranidagi «Pro: {sana}gacha» qatori", ru: 'например: строка «Pro: до {дата}» на экране «Дать объявление»' },
    [tr(J.holat)]: { uz: "masalan: Hozircha: to'lov tugmasi Backend'dan to'lov raqamini oladi va mashq sahifasini ochadi; mashq to'lovdan keyin Pro uzayadi. Test rejim: pul yechilmaydi.", ru: 'например: Пока: кнопка оплаты берёт номер платежа у Backend и открывает учебную страницу; после учебной оплаты Pro продлевается. Тестовый режим: деньги не списываются.' },
    ...NARX_NAMUNA()
  };
  const karta = (
    <span className="pz-tk-karta">
      <span className="pz-tk-q"><b>{tr({ uz: 'Nima bosiladi', ru: 'Что нажать' })}</b><span>{tr({ uz: "«To'lash (mashq)», keyin ilovaga qaytasiz", ru: '«Оплатить (учебно)», затем вернуться в приложение' })}</span></span>
      <span className="pz-tk-q"><b>{tr({ uz: 'Nima kutiladi', ru: 'Что ожидается' })}</b><span>{tr({ uz: "«Pro: {sana}gacha» chiqadi, qulaylik to'lov ekranini ochmaydi", ru: 'появится «Pro: до {дата}», функция не открывает экран оплаты' })}</span></span>
      <span className={cx('pz-tk-tug', tanlov === null && 'pz-chorla')}>
        <QChip holat={tanlov === true ? 'ok' : undefined} onClick={() => tanla(true)}>{tr({ uz: 'Pro yoqildi', ru: 'Pro включился' })}</QChip>
        <QChip holat={tanlov === false ? 'on' : undefined} onClick={() => tanla(false)}>{tr({ uz: 'Pro yoqilmadi', ru: 'Pro не включился' })}</QChip>
      </span>
    </span>
  );
  return (
    <ScreenBlok {...props} ustoz={USTOZ.a2} eyebrow={{ uz: "Amaliyot 2 · to'lov yo'li", ru: 'Практика 2 · путь оплаты' }}
      title={{ uz: <>Mashq to'lovdan keyin <span className="italic" style={{ color: T.accent }}>qulaylik ochilsin</span>.</>, ru: <>После учебной оплаты <span className="italic" style={{ color: T.accent }}>функция должна открыться</span>.</> }}
      mentor={{ uz: "To'lov raqamini Backend bersin — shunda begona raqam bilan Pro yoqib bo'lmaydi; «1 · Ochish»dan boshlang.", ru: 'Пусть номер платежа выдаёт Backend — тогда чужим номером Pro не включить; начните с «1 · Открыть».' }}
      ulgurQadam={2}
      yakun={() => ({ tanlov, correct: tanlov !== null })}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Amaliyot 1 push qilingan, hisobingizda Pro yo'q. 3-darsdagi mashq to'lov sahifasi va uch tekshiruv (imzo, takror, rad) Backend'ingizda bor bo'lishi kerak.", ru: 'Практика 1 отправлена (push), в вашем аккаунте нет Pro. В вашем Backend должны быть учебная страница оплаты и три проверки из 3-го урока (подпись, повтор, отклонение).' },
          bandlar: [
            ochiqTest.length > 0 && { kul: true, t: { uz: "3-darsdagi tekshiruv tugamagan: " + ochiqTest.join(' · ') + '. Avval o\'shani tugating — bu blok unga tayanadi.', ru: 'Проверка из 3-го урока не завершена: ' + ochiqTest.join(' · ') + '. Сначала завершите её — этот блок опирается на неё.' } },
            trekGap(trek, { uz: 'Mobil trek — mashq sahifasi telefon brauzerida ochiladi.', ru: 'Мобильный трек — учебная страница открывается в браузере телефона.' }, { uz: 'Web-trek — mashq sahifasi saytingizda yangi oynada ochiladi.', ru: 'Веб-трек — учебная страница открывается на сайте в новом окне.' }, { uz: 'Mobil trek — mashq sahifasi telefon brauzerida ochiladi · web-trek — saytingizda yangi oynada ochiladi.', ru: 'Мобильный трек — учебная страница открывается в браузере телефона · веб-трек — на сайте в новом окне.' })
          ] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "qavslarni tekshiring va to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'проверьте и заполните скобки, нажмите «Скопировать», отправьте в Antigravity:' },
          prompt: A2_PROMPT, toldir, namuna, yordam: A2_YORDAM },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: { uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; `git add <fayl>` → `git commit -m \"4-dars: to'lov yo'li va Pro\"` → `git push`. Render'da yangi versiya tugashini kuting.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают с названными агентом, `.env` нет в списке; `git add <файл>` → `git commit -m "4-dars: to\'lov yo\'li va Pro"` → `git push`. Дождитесь, пока в Render завершится новая версия.' },
          bandlar: [{ uz: 'Kutayotganda agentga:', ru: 'Пока ждёте — агенту:' }],
          ichi: <><PzPrompt satrlar={A2_KUT} tahrir={false} /><Band>{tx(XATO_GAP)}</Band></> },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: { uz: "bitta yo'l, o'zingiz:", ru: 'один путь, сами:' },
          bandlar: [
            { uz: "(1) Ilovada pullik qulaylikni bosing → to'lov taklifi ekrani → «{tugma}»: telefon brauzerida (web-trekda — yangi oynada) mashq to'lov sahifasi ochilishi kerak — manzilda to'lov raqami, sahifada «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» va narxingiz (narx varag'ingizdagi bilan bir xil).", ru: '(1) Нажмите платную функцию в приложении → экран предложения оплаты → «{кнопка}»: в браузере телефона (в веб-треке — в новом окне) должна открыться учебная страница оплаты — в адресе номер платежа, на странице «Это учебная страница. Карта не запрашивается, деньги не списываются.» и ваша цена (как в листе цены).' },
            { uz: "Sahifa birinchi ochilishda bir daqiqagacha kechikishi mumkin: bepul Backend uxlab qolgan bo'lsa, uyg'onadi.", ru: 'При первом открытии страница может задержаться до минуты: если бесплатный Backend заснул, он просыпается.' },
            { uz: "(2) «To'lash (mashq)» → «To'lov o'tdi (mashq) — ilovaga qayting.» → ilovaga qayting: «Pro: {sana}gacha» chiqishi va qulaylik endi to'lov ekranini ochmasligi kerak.", ru: '(2) «Оплатить (учебно)» → «Оплата прошла (учебно) — вернитесь в приложение.» → вернитесь: должна появиться «Pro: до {дата}», и функция больше не открывает экран оплаты.' },
            { uz: "(3) Neon SQL Editor'da: `SELECT pro_gacha FROM oyinchilar WHERE id = {hisob raqamingiz};` — bugundan {davr} kun keyin; `SELECT tolov_raqami, holat, summa FROM tolovlar ORDER BY yaratilgan DESC LIMIT 1;` — sahifadagi raqam, `tolandi`, narxingiz.", ru: '(3) В Neon SQL Editor: `SELECT pro_gacha FROM oyinchilar WHERE id = {номер аккаунта};` — через {срок} дней от сегодня; `SELECT tolov_raqami, holat, summa FROM tolovlar ORDER BY yaratilgan DESC LIMIT 1;` — номер со страницы, `tolandi`, ваша цена.' },
            { uz: "(4) Himoya: brauzerda sahifani raqamsiz va o'ylab topilgan raqam bilan oching — `{Backend manzili}/tolov-mashq` va `…/tolov-mashq?raqam=m-1`: ikkalasida «To'lov topilmadi.» chiqishi kerak.", ru: '(4) Защита: откройте страницу в браузере без номера и с выдуманным номером — `{адрес Backend}/tolov-mashq` и `…/tolov-mashq?raqam=m-1`: в обоих случаях должно быть «Платёж не найден.»' },
            { uz: "Tanlang: Pro yoqildi · Pro yoqilmadi. «Pro yoqilmadi» bo'lsa — agentga yozuv bilan: «Mashq to'lov: kutganim — Pro yoqiladi, bo'ldi — {nima bo'ldi}. Tuzat, o'zgargan fayllarni ayt.» → push → Render → ilovada «{tugma}» ni qayta bosib (yangi raqam keladi) tekshiring.", ru: 'Выберите: Pro включился · Pro не включился. Если «Pro не включился» — агенту с записью: «Учебная оплата: ожидал — Pro включится, вышло — {что вышло}. Исправь, назови изменённые файлы.» → push → Render → снова нажмите «{кнопка}» в приложении (придёт новый номер) и проверьте.' }
          ],
          ichi: <>{karta}<span className="pz-band kul">{tr({ uz: "Bugun bitta yo'l tekshirildi: «To'lash (mashq)» dan keyin Pro. Agent «to'lov ishlaydi» desa — bu hali uning so'zi.", ru: 'Сегодня проверен один путь: Pro после «Оплатить (учебно)». Если агент скажет «оплата работает» — это пока только его слова.' })}</span></> }
      ]}
      natija={<NatijaA2 />}
      ulgur={{ uz: "Ulgurmasangiz: Render kutishi cho'zilsa — 4-qadam uyga vazifaning ②-bandi; «Davom etish» 2-qadamdan keyin ochiladi. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Не успеваете: если ожидание Render затянулось — 4-й шаг станет пунктом ② домашнего задания; «Продолжить» откроется после 2-го шага. Блок считается выполненным после «Готово» на 4-м шаге.' }}
      doneText={() => (tanlov === true ? { uz: "Mashq to'lovdan keyin Pro yoqildi va qulaylik ochildi.", ru: 'После учебной оплаты Pro включился, и функция открылась.' } : tanlov === false ? { uz: "To'lov yo'li bor — Pro yoqilishini tuzatib, qayta tekshiring.", ru: 'Путь оплаты есть — исправьте включение Pro и проверьте снова.' } : null)}
      doneIzoh={() => (tanlov === true ? { uz: "Pro o'z hisobingizda 30 kun turadi — bu mashq: hech kim pul to'lamagan.", ru: 'Pro будет в вашем аккаунте 30 дней — это упражнение: никто не платил.' } : null)} />
  );
};

// ===== KARTOCHKALAR (12) — alohida ekran, Mentorsiz (SABOQ 12, 16); qolip QKartochka =====
const KARTALAR = [
  { front: { uz: 'Narx nima?', ru: 'Что такое цена?' }, back: { uz: "Odam to'laydigan pul", ru: 'Деньги, которые платит человек' }, note: { uz: "Mentor misolida: Pro, 30 kun — 15 000 so'm (Mentorning taxmini)", ru: 'В примере Ментора: Pro, 30 дней — 15 000 сумов (предположение Ментора)' } },
  { front: { uz: 'Xarajat nima?', ru: 'Что такое расходы?' }, back: { uz: 'Mahsulotni ushlab turish uchun sarflanadigan pul', ru: 'Деньги, которые тратятся на поддержку продукта' }, note: { uz: "Mentor misolida bugun 0 so'm; uxlamaydigan Backend bilan — oyiga taxminan 83 000 so'm", ru: 'В примере Ментора сегодня 0 сумов; с Backend без сна — примерно 83 000 сумов в месяц' } },
  { front: { uz: 'Raqobat nima?', ru: 'Что такое конкуренция?' }, back: { uz: 'Odam bugun shu ishni nima bilan qilishi', ru: 'То, чем человек сегодня делает это дело' }, note: { uz: 'Mentor misolida — bepul Telegram guruhi', ru: 'В примере Ментора — бесплатная Telegram-группа' } },
  { front: { uz: 'Qiymat nima?', ru: 'Что такое ценность?' }, back: { uz: 'Mahsulot odamga nima berishi', ru: 'То, что продукт даёт человеку' }, note: { uz: "Mentor misolida — «Doimiy o'yin» har haftalik e'lonni o'zi qiladi", ru: 'В примере Ментора — «Постоянная игра» сама делает еженедельное объявление' } },
  { front: { uz: "Mentor nega 10 000 ni 15 000 ga ko'tardi?", ru: 'Почему Ментор поднял 10 000 до 15 000?' }, back: { uz: '10 000 da taxminiy Backend xarajati qoplanmas edi', ru: 'При 10 000 примерные расходы на Backend не покрывались' }, note: { uz: "Agar 6 tashkilotchining hammasi olsa ham, 15 000 da u zo'rg'a qoplanadi; uch qator — formula emas", ru: 'Даже если возьмут все 6 организаторов, при 15 000 они едва покрываются; три строки — не формула' } },
  { front: { uz: "To'lov taklifi ekrani nima?", ru: 'Что такое экран предложения оплаты?' }, back: { uz: "Pullik qulaylik bosilganda chiqadigan ekran: nima ochiladi, narx, «To'lovga o'tish»", ru: 'Экран при нажатии платной функции: что откроется, цена, «Перейти к оплате»' }, note: { uz: 'Inglizchasi: paywall', ru: 'По-английски: paywall' } },
  { front: { uz: "To'lov taklifi ekranining pastida nima yoziladi?", ru: 'Что пишут внизу экрана предложения оплаты?' }, back: { uz: '«Test rejim: pul yechilmaydi»', ru: '«Тестовый режим: деньги не списываются»' }, note: { uz: "Bu modulda har to'lov ekranida", ru: 'В этом модуле — на каждом экране оплаты' } },
  { front: { uz: "Mentor ilovasida to'lov nega brauzerdagi sahifada?", ru: 'Почему в приложении Ментора оплата на странице в браузере?' }, back: { uz: "Bu kursda ilova do'kondan tarqatilmaydi: Android'da — APK, iPhone'da — brauzer ko'rinishi", ru: 'В этом курсе приложение не распространяется через магазин: на Android — APK, на iPhone — версия в браузере' }, note: { uz: "Do'kondan tarqatilsa, uning to'lov qoidalari tegishi mumkin", ru: 'Если распространять через магазин, могут действовать его правила оплаты' } },
  { front: { uz: "Mashq to'lovdan keyin Pro'ni kim yoqadi?", ru: 'Кто включает Pro после учебной оплаты?' }, back: { uz: "Backend — to'lov xabari kelgandan keyin", ru: 'Backend — после сообщения об оплате' }, note: { uz: 'Ilova Pro holatini `GET /men` dan o\'qiydi', ru: 'Приложение читает статус Pro из `GET /men`' } },
  { front: { uz: "To'lov raqamini kim beradi?", ru: 'Кто выдаёт номер платежа?' }, back: { uz: "Backend — «To'lovga o'tish» bosilganda", ru: 'Backend — при нажатии «Перейти к оплате»' }, note: { uz: 'Raqam tasodifiy; mashq sahifasi faqat shu raqam bilan ishlaydi', ru: 'Номер случайный; учебная страница работает только с этим номером' } },
  { front: { uz: "«Doimiy o'yin»da keyingi o'yin qachon paydo bo'ladi?", ru: 'Когда в «Постоянной игре» появляется следующая игра?' }, back: { uz: "Ro'yxat so'ralganda, oldingisining vaqti o'tgan bo'lsa", ru: 'Когда запрашивают список, если время предыдущей прошло' }, note: { uz: "Mentor misolida taymer yo'q: bepul Backend uxlashi mumkin. Odatda ro'yxatni so'rash yozuv yaratmaydi — bu kurs loyihasining sodda yechimi", ru: 'В примере Ментора таймера нет: бесплатный Backend может заснуть. Обычно запрос списка не создаёт запись — это простое решение учебного проекта' } },
  { front: { uz: "Pro o'zi yangilanib, pul yechiladimi?", ru: 'Продлевается ли Pro сам со списанием денег?' }, back: { uz: "Yo'q — muddat tugagach Pro o'zi to'xtaydi", ru: 'Нет — когда срок закончится, Pro сам выключается' }, note: { uz: 'Bu kursda pul umuman yechilmaydi — test rejim', ru: 'В этом курсе деньги не списываются вообще — тестовый режим' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('pz-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="pz-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (besh holat, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
const RECAP_YAKUN = [
  { uz: 'Narx — odam to\'laydigan pul; unga xarajat, raqobat va qiymat tomonidan qaraladi.', ru: 'Цена — деньги, которые платит человек; на неё смотрят со стороны расходов, конкуренции и ценности.' },
  { uz: 'Xarajat — mahsulotni ushlab turish uchun sarflanadigan pul.', ru: 'Расходы — деньги, которые тратятся на поддержку продукта.' },
  { uz: "To'lov taklifi ekranida nima ochilishi, narx va tugma turadi; pastida — «Test rejim: pul yechilmaydi».", ru: 'На экране предложения оплаты — что откроется, цена и кнопка; внизу — «Тестовый режим: деньги не списываются».' },
  { uz: "Pro'ni ilova emas, Backend yoqadi — to'lov xabari kelgandan keyin.", ru: 'Pro включает не приложение, а Backend — после сообщения об оплате.' },
  { uz: "To'lov raqamini Backend beradi: begona raqam bilan Pro yoqib bo'lmaydi.", ru: 'Номер платежа выдаёт Backend: чужим номером Pro не включить.' }
];
const SARLAVHA = {
  tolov: { uz: "Narxingiz bor — mashq to'lovdan keyin qulaylik ochildi.", ru: 'Цена есть — после учебной оплаты функция открылась.' },
  tekshir: { uz: "To'lov yo'li bor — Pro yoqilishini tekshirish qoldi.", ru: 'Путь оплаты есть — осталось проверить включение Pro.' },
  yol: { uz: "Narx va to'lov ekrani tayyor — to'lov yo'li qoldi.", ru: 'Цена и экран оплаты готовы — остался путь оплаты.' },
  ekran: { uz: "Narxingiz yozildi — to'lov ekranini qurish qoldi.", ru: 'Цена записана — осталось сделать экран оплаты.' },
  yoq: { uz: 'Narx hali yozilmagan — uyda yozing.', ru: 'Цена ещё не записана — запишите дома.' }
};
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'ota-ona yoki sinfdosh', ru: 'родители или одноклассник' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '2 ish', ru: '2 дела' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HwCard = ({ qolgan, keyingi }) => (
  <div className="card pz-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="pz-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="pz-hw-q"><span className="pz-hw-k">{tr(r.k)}</span><span className="pz-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="pz-hw-qadam">
      <li><i>①</i><span>{tr({ uz: "Narxingizni bir kishiga tushuntiring: qaysi xarajat, raqobat va qiymatga qarab qo'ydingiz. Pul so'ramaysiz — faqat tushuntirasiz.", ru: 'Объясните свою цену одному человеку: по каким расходам, конкуренции и ценности вы её поставили. Денег не просите — только объясняете.' })}</span></li>
      {qolgan.length > 0 && <li><i>②</i><span>{tr({ uz: 'Darsda qolgan qismni tugating:', ru: 'Закончите то, что осталось с урока:' })} {qolgan.map(tr).join(' · ')}.</span></li>}
    </ol>
    <p className="pz-hw-ost">{tr({ uz: "Hech kimdan pul so'ramang: bu darsdagi to'lov — mashq.", ru: 'Ни у кого не просите денег: оплата на этом уроке — упражнение.' })}</p>
    {keyingi && <span className="pz-hw-keyingi">{keyingi}</span>}
  </div>
);
// Erta tugatgan o'quvchi yo'li (PM-109, SABOQ P4): AI mahsulotdan foydalanadigan odam rolida savol beradi; o'quvchi o'z narx varag'ini o'zi qayta yozadi (sinfda gemini.google.com)
const aiSorov = () => {
  const n = lsO(NARX_KEY);
  const e = (n && n.ekran) || {};
  const varaq = n && son(n.narx)
    ? tr({ uz: 'Ekran: ', ru: 'Экран: ' }) + [e.sarlavha, e.matn, (son(n.davrKun) || 30) + tr({ uz: ' kun — ', ru: ' дней — ' }) + probel(son(n.narx)) + tr({ uz: " so'm", ru: ' сумов' }), e.tugma].filter(Boolean).join(' · ') + '\n'
      + tr({ uz: 'Xarajat: ', ru: 'Расходы: ' }) + probel((n.xarajat && n.xarajat.oylik) || 0) + tr({ uz: " so'm, ", ru: ' сумов, ' }) + ((n.xarajat && n.xarajat.manba) || '') + '\n'
      + tr({ uz: 'Raqobat: ', ru: 'Конкуренция: ' }) + (n.raqobat || '') + '\n' + tr({ uz: 'Qiymat: ', ru: 'Ценность: ' }) + (n.qiymat || '')
    : tr({ uz: "Ekran: Doimiy o'yin — Pro'da · Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi. · 30 kun — 15 000 so'm · To'lovga o'tish\nXarajat: 0 so'm, bepul rejalar\nRaqobat: Telegram guruhi, bepul\nQiymat: har haftalik e'lon o'zi qilinadi", ru: 'Экран: Постоянная игра — в Pro · Каждую неделю в тот же день и час игра объявляется сама. · 30 дней — 15 000 сумов · Перейти к оплате\nРасходы: 0 сумов, бесплатные планы\nКонкуренция: Telegram-группа, бесплатно\nЦенность: еженедельное объявление делается само' });
  return tr({ uz: "Sen mening mahsulotimdan foydalanishi mumkin bo'lgan odamsan. Pastda ilovamdagi to'lov taklifi ekrani va narx varag'im. Avval ekranni o'qib, pulga nima ochilishini o'z so'zing bilan ayt. Keyin har qatorga bitta savol ber: xarajat qayerdan olingan, raqobat to'g'ri yozilganmi, qiymat sening qaysi ishingni oladi, narx nimaga qarab qo'yilgan. Narxni o'zgartirishni buyurma va pul haqida kelishma — faqat savol ber.\n\n", ru: 'Ты человек, который может пользоваться моим продуктом. Ниже экран предложения оплаты из моего приложения и мой лист цены. Сначала прочитай экран и своими словами скажи, что откроется за деньги. Потом задай по одному вопросу к каждой строке: откуда взяты расходы, верно ли записана конкуренция, какую твою работу берёт ценность, на что опирается цена. Не приказывай менять цену и не договаривайся о деньгах — только спрашивай.\n\n' }) + varaq;
};
const AiDavomCard = () => {
  const [nusxa, setNusxa] = useState(false);
  const sorov = useMemo(aiSorov, []);
  const kochir = () => { try { navigator.clipboard.writeText(sorov); setNusxa(true); setTimeout(() => setNusxa(false), 1800); } catch { /* qo'lda belgilab oladi */ } };
  return (
    <div className="card pz-ai fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Erta tugatdingizmi? AI bilan davom eting', ru: 'Закончили раньше? Продолжите с AI' })}</div>
      <p className="pz-ai-m">{tr({ uz: "gemini.google.com'ni oching va pastdagi so'rovni yuboring — AI mahsulotingizdan foydalanadigan odam bo'lib, narx varag'ingizga savol beradi. Javob topolmagan qatoringizni «Orqaga» bilan qaytib, narx varag'ida qayta yozing.", ru: 'Откройте gemini.google.com и отправьте запрос ниже — AI в роли пользователя вашего продукта задаст вопросы к листу цены. Строку, на которую не нашли ответа, перепишите в листе цены, вернувшись «Назад».' })}</p>
      <pre className="pz-ai-sorov">{sorov}</pre>
      <button type="button" className="q-chip pz-ai-btn" onClick={kochir}>{nusxa ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: "So'rovni nusxalash", ru: 'Скопировать запрос' })}</button>
    </div>
  );
};
const A1_IDX = SCREEN_META.findIndex(m => m.id === 'a1');
const A2_IDX = SCREEN_META.findIndex(m => m.id === 'a2');
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
  const narx = lsO(NARX_KEY);
  const a1 = !!(answers[A1_IDX] && answers[A1_IDX].solved);
  const a2 = !!(answers[A2_IDX] && answers[A2_IDX].solved);
  const ishlaydi = narx && typeof narx.ishlaydi === 'boolean' ? narx.ishlaydi : (answers[A2_IDX] && typeof answers[A2_IDX].tanlov === 'boolean' ? answers[A2_IDX].tanlov : null);
  const holat = a2 ? (ishlaydi === true ? 'tolov' : 'tekshir') : a1 ? 'yol' : narx && narx.savedAt ? 'ekran' : 'yoq';
  const qolgan = [];
  if (!(narx && narx.savedAt)) qolgan.push({ uz: "narx varag'ini saqlang", ru: 'сохраните лист цены' });
  if (!a1) qolgan.push({ uz: 'Amaliyot 1 tekshiruvini tugating', ru: 'завершите проверку Практики 1' });
  if (!a2 || ishlaydi !== true) qolgan.push({ uz: "to'lov yo'lini ulang va tekshiring", ru: 'подключите и проверьте путь оплаты' });
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz»</b></>, ru: <>Следующий урок — <b>«Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(18px,2.6vw,26px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cx('pz-yakun', holat !== 'tolov' && 'tiksiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={tn(SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP_YAKUN.map(tr)}
          uyga={<HwCard qolgan={qolgan} keyingi={keyingi} />}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        >
          {!isMentorL && <AiDavomCard />}
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmPricingLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, ScreenA1, ScreenA2, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI — «Narx va to'lov yo'li» (pz-). Faqat qolip tokenlari (D3) + brend nomlari o'z rangida; emoji yo'q (D4). Telefon 170×272 hamma ekranda (SABOQ 22) === */
        /* ⛶ oynasi (SABOQ 38, E 48): ikki klassli selektor; ota-blok animatsiyasi fixed ni o'ziga bog'lamasin */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(980px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        /* 13-Modul sinf-supurish B: ⛶ oynasi faqat ko'rish uchun — maket ichidagi tugma (telefon tugmasi, jadval katagi, belgi) oynada bosilmaydi, harakat ⛶ dan tashqarida qoladi. Kirish ekrani variantlari va maket tugmasi qolipniki — tegilmaydi. */
        .zoom-on button:not(.zoom-btn) { pointer-events: none; cursor: default; }
        .q-kirish .zoom-on button { pointer-events: auto; cursor: pointer; }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .pz-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: pz-puls 2.2s ease-out .3s 3; }
        @keyframes pz-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        /* Variantlar va tanlov chiplari: har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .pz-k { display: contents; }
        .pz-ustoz { display: flex; flex-direction: column; gap: 4px; margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .pz-ustoz b { color: ${T.ink}; }
        .pz-xato-j { scroll-margin-bottom: 14px; }
        .pz-ovoz { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pz-ovoz-q { display: grid; grid-template-columns: minmax(0,1fr) 90px 26px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink}; }
        .pz-ovoz-q.men { font-weight: 800; color: ${T.accent}; }
        .pz-ovoz-y { height: 8px; border-radius: 999px; background: ${T.line}; overflow: hidden; }
        .pz-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width .6s ease; }
        @media (prefers-reduced-motion: reduce) { .pz-ovoz-y i { transition: none; } }
        @media (min-width: 761px) { .pz-k .q-split { grid-template-columns: max-content minmax(0, 1fr); gap: 28px; } }
        .pz-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: pz-chorla-v 1.8s ease-out .5s 2; }
        @keyframes pz-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .pz-bash .q-chip:not(:disabled), .pz-chorla > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: pz-chorla 1.8s ease-out .5s 2; }
        @keyframes pz-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .pz-k.faol .q-variant:nth-child(2), .pz-bash .q-chip:nth-child(2), .pz-chorla > .q-chip:nth-child(2) { animation-delay: .75s; }
        .pz-k.faol .q-variant:nth-child(3), .pz-bash .q-chip:nth-child(3) { animation-delay: 1s; }
        p.pz-bash-ix { margin: 0; font-size: 13px; color: ${T.ink2}; }
        p.pz-bash-ix b { color: ${T.ink}; }
        .pz-mj { color: ${MAYDON_RANG}; font-weight: 800; white-space: nowrap; }
        .pz-uchar { position: fixed; z-index: 1200; pointer-events: none; font: 800 13px 'JetBrains Mono', monospace; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 8px; padding: 2px 7px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.4); white-space: nowrap; }
        @keyframes pz-kir { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
        @keyframes pz-tush { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: none; } }
        /* Telefon */
        .pz-telj { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; }
        .pz-tel-yorliq { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; letter-spacing: .02em; text-align: center; }
        .pz-tel { width: 170px; height: 272px; border-radius: 24px; background: ${T.ink}; padding: 7px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.55); flex: none; }
        .pz-tel-ekran { position: relative; width: 100%; height: 100%; border-radius: 17px; background: ${T.paper}; overflow: hidden; display: flex; flex-direction: column; animation: fade-step .35s ease; }
        .pz-app-bar { flex: none; display: flex; align-items: center; gap: 6px; padding: 6px 9px; border-bottom: 1px solid ${T.line}; font-size: 12px; }
        .pz-orqaga { font-style: normal; color: ${T.ink2}; font-size: 15px; line-height: 1; }
        .pz-taklif { flex: 1; min-height: 0; display: flex; flex-direction: column; }
        .pz-taklif.sirgal .pz-taklif-t { animation: pz-sirgal .45s cubic-bezier(.2,.8,.2,1); }
        @keyframes pz-sirgal { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .pz-taklif-t { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 5px; padding: 9px 10px 8px; }
        .pz-tk-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
        .pz-tk-matn { font-size: 11.5px; line-height: 1.3; color: ${T.ink2}; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
        .pz-tk-narx { font-size: 13px; font-weight: 800; color: ${T.ink}; line-height: 1.25; overflow-wrap: anywhere; margin-top: 2px; }
        .pz-tk-narx.yon { animation: pz-tush .55s cubic-bezier(.3,1.5,.5,1); }
        .pz-tk-tax { align-self: flex-start; font-size: 10.5px; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 0 5px; }
        .pz-tk-btn { margin-top: auto; font: 700 12px 'Manrope', sans-serif; border: 0; border-radius: 10px; padding: 8px; background: ${T.accent}; color: #fff; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pz-tk-btn:disabled { cursor: default; }
        .pz-tk-btn.kul { background: ${T.line}; color: ${T.ink2}; }
        .pz-tk-test { font-size: 10px; color: ${T.ink2}; text-align: center; line-height: 1.2; }
        .pz-savol { color: ${T.accent}; border-radius: 4px; padding: 0 2px; }
        .pz-savol.yon { animation: pz-yon .9s ease 2; }
        @keyframes pz-yon { 50% { background: ${T.accentSoft}; } }
        p.pz-tel-ost { margin: 0; font-size: 12px; color: ${T.ink2}; text-align: center; max-width: 200px; }
        .pz-elon { flex: 1; display: flex; flex-direction: column; min-height: 0; }
        .pz-elon-t { flex: 1; display: flex; flex-direction: column; gap: 5px; padding: 8px 9px; min-height: 0; }
        .pz-el-sar { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .pz-el-oyin { font-size: 11px; color: ${T.ink2}; line-height: 1.3; }
        .pz-belgi { display: flex; align-items: center; gap: 7px; font: 700 11.5px 'Manrope', sans-serif; text-align: left; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; border-radius: 10px; padding: 6px 7px; cursor: pointer; }
        .pz-belgi:disabled { cursor: default; }
        .pz-belgi-q { flex: none; width: 24px; height: 14px; border-radius: 999px; background: ${T.line}; position: relative; transition: background .25s; }
        .pz-belgi-q::after { content: ''; position: absolute; top: 2px; left: 2px; width: 10px; height: 10px; border-radius: 50%; background: #fff; transition: left .25s; }
        .pz-belgi.on .pz-belgi-q { background: ${MAYDON_RANG}; }
        .pz-belgi.on .pz-belgi-q::after { left: 12px; }
        .pz-el-pro { font-size: 11px; color: ${T.ink2}; animation: pz-kir .4s ease; }
        .pz-el-oy { font: 800 10.5px 'Manrope', sans-serif; text-transform: uppercase; letter-spacing: .05em; color: ${T.ink2}; margin-top: 2px; }
        .pz-el-k { font-size: 11px; line-height: 1.3; padding: 5px 7px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; animation: pz-kir .45s ease; }
        .pz-el-k.keyingi em { display: block; font-style: normal; font-size: 9.5px; color: ${T.ink2}; }
        .pz-br { flex: 1; display: flex; flex-direction: column; min-height: 0; }
        .pz-br-bar { flex: none; padding: 4px 7px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .pz-br-bar code { display: block; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pz-mashq { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; padding: 0 0 6px; }
        .pz-mashq > :not(.pz-pm-bosh) { margin: 0 8px; }
        .pz-pm-bosh { display: flex; align-items: center; justify-content: space-between; padding: 5px 8px; background: ${PAYME_RANG}; color: #fff; font-size: 13px; font-weight: 900; }
        .pz-pm-bosh span { font-size: 9.5px; font-weight: 700; background: rgba(255,255,255,.28); border-radius: 6px; padding: 1px 5px; }
        .pz-m-sar { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pz-m-nom { font-size: 11px; line-height: 1.3; color: ${T.ink}; }
        .pz-m-summa { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 6px; }
        .pz-m-summa b { font-size: 17px; font-weight: 900; color: ${T.ink}; white-space: nowrap; }
        .pz-m-summa em { font-style: normal; font-size: 10px; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 0 5px; }
        .pz-tolash { font: 700 12px 'Manrope', sans-serif; border: 0; border-radius: 9px; padding: 7px 8px; background: ${PAYME_RANG}; color: #fff; cursor: pointer; }
        .pz-tolash:disabled { cursor: default; }
        .pz-rad { font: 700 11px 'Manrope', sans-serif; text-align: center; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 4px 8px; color: ${T.ink2}; }
        .pz-m-holat { font-size: 11.5px; font-weight: 700; color: ${T.ok}; background: ${T.okFon}; border-radius: 8px; padding: 6px 7px; animation: pz-kir .4s ease; }
        .pz-m-test { font-size: 10px; color: ${T.ink2}; line-height: 1.25; margin-top: auto; }
        .pz-br-yoq { flex: 1; display: flex; align-items: center; justify-content: center; padding: 10px; font-size: 13px; color: ${T.ink}; text-align: center; }
        .pz-tg { flex: 1; display: flex; flex-direction: column; min-height: 0; background: ${T.bg}; }
        .pz-tg-bosh { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 7px 9px; background: ${TG_RANG}; color: #fff; font-size: 11.5px; }
        .pz-tg-bepul { font-style: normal; font-size: 10px; font-weight: 700; background: rgba(255,255,255,.28); border-radius: 6px; padding: 1px 6px; animation: pz-tush .4s ease; }
        .pz-tg-chat { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 5px; padding: 8px; }
        .pz-tg-p { max-width: 88%; font-size: 11px; line-height: 1.3; padding: 5px 8px; border-radius: 10px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 2px 6px -3px rgba(${T.shadowBase},0.3); animation: pz-kir .35s ease; }
        .pz-tg-p i { display: block; font-style: normal; font-size: 9.5px; font-weight: 800; color: ${TG_RANG}; }
        .pz-bugun { flex: none; margin: 0 8px 8px; font: 700 12px 'Manrope', sans-serif; border: 0; border-radius: 10px; padding: 7px; background: ${TG_RANG}; color: #fff; cursor: pointer; }
        .pz-bugun:disabled { cursor: default; opacity: .7; }
        /* Xizmat kartalari */
        .pz-xz { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; width: 100%; max-width: 420px; }
        .pz-xk { display: flex; flex-direction: column; gap: 3px; padding: 9px 10px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; min-width: 0; }
        .pz-xk.be { grid-column: 1 / -1; }
        .pz-xk.ag { animation: pz-ag .5s ease; border-color: ${fon(T.accent, 0.45)}; }
        @keyframes pz-ag { from { transform: perspective(600px) rotateY(80deg); opacity: .4; } to { transform: none; opacity: 1; } }
        .pz-xk-n { display: flex; gap: 6px; align-items: baseline; flex-wrap: wrap; }
        .pz-xk-n b { font-size: 13px; color: ${T.ink}; }
        .pz-xk-x { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; }
        .pz-xk-s { font-size: 11.5px; color: ${T.ok}; font-weight: 700; }
        .pz-uxla { align-self: flex-start; font: 700 12px 'Manrope', sans-serif; border: 1.5px solid ${T.line}; background: ${T.bg}; color: ${T.ink2}; border-radius: 999px; padding: 3px 10px; cursor: pointer; }
        .pz-uxla:disabled { cursor: default; }
        .pz-xk-a { font-size: 12px; color: ${T.ink2}; }
        .pz-xk-b { font-size: 13.5px; color: ${T.ink}; }
        .pz-xk-m { font-size: 11px; color: ${T.ink2}; }
        p.pz-xz-iz { grid-column: 1 / -1; margin: 0; font-size: 12px; color: ${T.ink2}; }
        .pz-s2-chap { display: flex; justify-content: center; width: 100%; }
        .pz-s2-chap.xira { opacity: .55; }
        /* Narx varag'i */
        .pz-varaq { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; min-width: 0; width: 100%; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.35); }
        .pz-v-sar { font: 800 11.5px 'Manrope', sans-serif; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .pz-v-r { position: relative; display: grid; grid-template-columns: 88px minmax(0, 1fr) auto; column-gap: 10px; row-gap: 2px; align-items: baseline; padding: 7px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.bg}; transition: background .3s, border-color .3s; }
        .pz-v-r.kul { opacity: .6; }
        .pz-v-r.bosh .pz-v-q { border-bottom: 1.5px dashed ${T.line}; min-height: 18px; color: ${T.ink2}; }
        .pz-v-r.joriy { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pz-v-r.oq { background: ${T.paper}; }
        .pz-v-r.ok { background: ${T.okFon}; border-color: ${fon(T.ok, 0.4)}; }
        .pz-v-r.yangi { animation: pz-kir .5s ease; }
        .pz-v-r.ulag::before { content: ''; position: absolute; right: 100%; top: 50%; width: 18px; border-top: 1.5px dashed ${T.accent}; }
        .pz-v-nom { font: 800 13px 'Manrope', sans-serif; color: ${T.ink}; }
        .pz-v-q { font-size: 13px; color: ${T.ink}; line-height: 1.35; overflow-wrap: anywhere; }
        .pz-v-tax { display: inline-block; margin-left: 6px; font-style: normal; font-size: 10.5px; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 0 5px; white-space: nowrap; }
        .pz-v-tahrir { border: 0; background: none; color: ${T.accent}; cursor: pointer; font-size: 14px; padding: 0 2px; }
        .pz-v-ta { grid-column: 1 / -1; font-size: 12px; color: ${T.ink2}; line-height: 1.35; }
        .pz-v-iz { grid-column: 1 / -1; font-size: 12px; color: ${T.ink2}; font-style: italic; line-height: 1.35; }
        .pz-varaq.ixcham { padding: 10px 12px; gap: 5px; }
        .pz-varaq.ixcham .pz-v-r { padding: 5px 9px; grid-template-columns: 82px minmax(0, 1fr) auto; }
        .pz-hisob { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; padding: 8px 10px; border-radius: 10px; font: 600 12.5px 'JetBrains Mono', monospace; animation: pz-kir .45s ease; }
        .pz-hisob.err { background: ${T.errFon}; color: ${T.err}; }
        .pz-hisob.ok { background: ${T.okFon}; color: ${T.ok}; }
        .pz-hisob.bosh { border: 1.5px dashed ${T.line}; color: ${T.ink2}; animation: none; }
        .pz-hisob.kul { background: ${T.bg}; color: ${T.ink2}; }
        .pz-muhr { font: 800 11px 'Manrope', sans-serif; text-transform: uppercase; letter-spacing: .04em; border: 1.5px solid currentColor; border-radius: 6px; padding: 2px 6px; transform: rotate(-3deg); animation: pz-muhr .45s cubic-bezier(.3,1.5,.5,1); }
        @keyframes pz-muhr { from { opacity: 0; transform: rotate(-3deg) scale(1.4); } to { opacity: 1; transform: rotate(-3deg); } }
        /* Kirish va reja */
        .pz-s0-m { display: flex; align-items: flex-start; gap: 22px; flex-wrap: wrap; }
        .pz-s0-tel { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .pz-s0-v { width: 190px; margin-top: 22px; }
        .pz-reja { display: flex; flex-direction: column; gap: 12px; }
        .pz-reja-r { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
        .pz-reja-r .pz-varaq { flex: 1; min-width: 150px; width: auto; }
        .pz-reja-yol { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .pz-ry { font-size: 12px; font-weight: 700; color: ${T.ink2}; padding: 4px 9px; border-radius: 999px; border: 1.5px solid ${T.line}; transition: color .3s, border-color .3s, background .3s; }
        .pz-ry.on { color: ${T.accent}; border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pz-sub { font-weight: 600; color: ${T.ink2}; text-transform: none; letter-spacing: 0; }
        p.pz-reja-ost { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; line-height: 1.6; }
        /* 4-ekran sahnasi: telefon · konvert yo'li · Backend */
        .pz-s4-v { display: flex; flex-direction: column; gap: 6px; }
        .pz-sahna { display: flex; align-items: center; gap: 14px; max-width: 780px; }
        .pz-sahna-tel { position: relative; flex: none; }
        .pz-belgilar { position: absolute; left: calc(100% + 8px); top: 56px; width: 124px; height: 230px; margin: 0; padding: 0; list-style: none; z-index: 2; }
        .pz-bl { position: absolute; left: 0; font-size: 11px; font-weight: 700; color: ${T.accent}; white-space: nowrap; padding-left: 16px; background: ${T.paper}; border-radius: 6px; animation: pz-kir .35s ease; }
        .pz-bl::before { content: ''; position: absolute; left: 0; top: 50%; width: 12px; border-top: 1.5px solid currentColor; }
        .pz-bl.b0 { top: 10px; } .pz-bl.b1 { top: 102px; } .pz-bl.b2 { top: 180px; } .pz-bl.b3 { top: 208px; }
        .pz-bl.kul { color: ${T.ink2}; }
        .pz-yol { position: relative; flex: 1; min-width: 80px; align-self: center; height: 56px; }
        .pz-yol-ch { position: absolute; left: 0; right: 0; top: 50%; border-top: 2px dashed ${T.line}; }
        .pz-konv { position: absolute; top: calc(50% - 13px); left: 0; display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.accent}; font-size: 11px; white-space: nowrap; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.4); }
        .pz-konv.o { animation: pz-uch-o .85s cubic-bezier(.4,.1,.3,1) forwards; }
        .pz-konv.c { animation: pz-uch-c .85s cubic-bezier(.4,.1,.3,1) forwards; border-color: ${T.ok}; color: ${T.ok}; }
        @keyframes pz-uch-o { from { left: 0; transform: translateX(0); } to { left: 100%; transform: translateX(-100%); } }
        @keyframes pz-uch-c { from { left: 100%; transform: translateX(-100%); } to { left: 0; transform: translateX(0); } }
        .pz-yol-iz { position: absolute; left: 0; right: 0; top: calc(50% + 6px); display: flex; flex-wrap: wrap; justify-content: center; gap: 2px 8px; }
        .pz-yol-iz em { font-style: normal; font-size: 10.5px; color: ${T.ink2}; }
        .pz-be { flex: none; width: 200px; display: flex; flex-direction: column; gap: 7px; padding: 10px 11px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.35); }
        .pz-be.kichik { width: 170px; }
        .pz-be-sar { font: 800 13px 'Manrope', sans-serif; color: ${T.ink}; }
        .pz-jad { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 8px; overflow: hidden; background: ${T.bg}; }
        .pz-jad-h code { display: block; font: 700 11px 'JetBrains Mono', monospace; padding: 3px 7px; background: ${T.ink}; color: #fff; }
        .pz-jad-r { display: grid; grid-template-columns: 1fr auto; gap: 6px; padding: 3px 7px; border-top: 1px solid ${T.line}; }
        .pz-jad-r code { font-family: 'JetBrains Mono', monospace; font-size: 11px; white-space: nowrap; color: ${T.ink}; }
        .pz-jad-r.bosh code { color: ${T.ink2}; font-size: 10px; }
        .pz-jad-r.kul code { color: ${T.ink2}; }
        .pz-jad-r.yangi { background: ${T.okFon}; animation: pz-kir .5s ease; }
        .pz-jad-r.yangi code { color: ${T.ok}; font-weight: 700; }
        .pz-pro { display: flex; justify-content: space-between; gap: 6px; align-items: center; padding: 5px 7px; border-radius: 8px; border: 1px solid ${T.line}; }
        .pz-pro code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink}; }
        .pz-pro b { font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; }
        .pz-pro.yangi { background: ${T.okFon}; border-color: ${fon(T.ok, 0.4)}; }
        .pz-pro.yangi b { color: ${T.ok}; animation: pz-tush .5s ease; }
        .pz-qatorlar { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
        .pz-qatorlar li { position: relative; padding-left: 14px; font-size: 13px; line-height: 1.4; color: ${T.ink}; }
        .pz-qatorlar li::before { content: ''; position: absolute; left: 0; top: .55em; width: 6px; height: 6px; border-radius: 50%; background: ${T.accent}; }
        /* Yashil xulosa qutisi: taxmin natijasi — birinchi kichik qator, QIzoh — oxirgi (E 42) */
        .pz-x-n { display: block; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; margin-bottom: 4px; }
        .pz-x-n.ok { color: ${T.ok}; }
        .pz-x-m { display: block; }
        .pz-x-iz { display: block; margin-top: 6px; padding-top: 6px; border-top: 1px solid ${fon(T.ok, 0.25)}; font-size: 12.5px; color: ${T.ink2}; }
        p.pz-q-ost { margin: 0 0 6px; font-size: 12.5px; color: ${T.ink2}; }
        .pz-q-viz { margin-top: 10px; max-width: 440px; }
        /* 5-ekran: mustaqil ish */
        .pz-s5 .q-mustaqil { max-width: none; }
        .pz-ms { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 22px; align-items: start; }
        .pz-ms-tel { display: flex; flex-direction: column; align-items: center; gap: 8px; position: sticky; top: 12px; }
        .pz-ms-o { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        p.pz-ms-kirish { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .pz-qq b { color: ${T.ink}; }
        .pz-qq-t { border: 0; background: none; color: ${T.accent}; cursor: pointer; margin-left: 6px; font-size: 13px; }
        .pz-ms-tahrir { font: 700 12px 'Manrope', sans-serif; border: 1.5px solid ${T.line}; border-radius: 999px; padding: 4px 10px; background: ${T.paper}; color: ${T.accent}; cursor: pointer; }
        .pz-karta { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.45)}; box-shadow: 0 12px 28px -18px rgba(${T.shadowBase},0.45); }
        .pz-karta-h { font: 800 12px 'Manrope', sans-serif; text-transform: uppercase; letter-spacing: .06em; color: ${T.accent}; }
        p.pz-kq { margin: 0; display: flex; gap: 8px; align-items: center; font-size: 14px; font-weight: 600; color: ${T.ink}; }
        .pz-in-j { position: relative; display: flex; width: 100%; }
        .pz-in-n { position: absolute; left: 10px; top: 10px; width: 20px; height: 20px; border-radius: 50%; background: ${T.accent}; color: #fff; font: 800 11px 'JetBrains Mono', monospace; font-style: normal; display: inline-flex; align-items: center; justify-content: center; }
        p.pz-kq .pz-in-n { position: static; flex: none; }
        .pz-in { width: 100%; font: 500 14px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px 12px; resize: vertical; outline: none; }
        .pz-in-n + .pz-in { padding-left: 38px; }
        .pz-in:focus { border-color: ${T.accent}; background: ${T.paper}; }
        .pz-xr-g { display: flex; flex-direction: column; gap: 7px; }
        .pz-xr { text-align: left; font: 600 13.5px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 9px 12px; cursor: pointer; }
        .pz-xr.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pz-xr.kichik { font-size: 12.5px; color: ${T.ink2}; background: ${T.bg}; }
        .pz-xr em { display: block; font-style: normal; font-size: 11px; color: ${T.ink2}; margin-top: 2px; }
        .pz-xr-g.faol .pz-xr:not(.kichik) { border-color: ${fon(T.accent, 0.6)}; animation: pz-chorla 1.8s ease-out .5s 2; }
        .pz-xr-g.faol .pz-xr:nth-child(2) { animation-delay: .75s; }
        .pz-ikki { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 8px; }
        .pz-muddat-g { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .pz-muddat { font: 700 12.5px 'Manrope', sans-serif; border: 1.5px solid ${T.line}; border-radius: 999px; padding: 5px 12px; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .pz-muddat.on { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; }
        .pz-muddat-g .pz-in-j { width: 110px; }
        p.pz-kul { margin: 0; font-size: 12px; color: ${T.ink2}; }
        p.pz-hisob-q { margin: 0; display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: center; font: 600 12px 'JetBrains Mono', monospace; padding: 7px 10px; border-radius: 10px; background: ${T.bg}; color: ${T.ink2}; }
        p.pz-hisob-q.ok { background: ${T.okFon}; color: ${T.ok}; }
        .pz-karta-tug { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .pz-sp { flex: 1; }
        p.pz-maslahat { margin: 0; font-size: 12.5px; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 7px 10px; }
        .pz-yordam { display: flex; flex-direction: column; gap: 4px; flex-basis: 100%; margin-top: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; }
        .pz-yordam-s { font-size: 12.5px; color: ${T.ink}; line-height: 1.45; }
        .pz-yordam-s.kul { color: ${T.ink2}; }
        /* Amaliyot bloklari */
        .pz-blok { display: contents; }
        .pz-s2, .pz-s4 { display: contents; }
        .lesson-root .mono.small { white-space: nowrap; flex: none; }
        @media (max-width: 1199px) { .q-reja .q-split > .q-col:first-child > .q-yorliq { padding-right: 40px; } }
        .pz-h-m { overflow-wrap: anywhere; }
        .pz-yordam-btn { flex: none; }
        .pz-ms.saqlangan { align-items: start; }
        .pz-tg-p.javob { align-self: flex-start; }
        .pz-blok .qcode { white-space: normal; overflow-wrap: anywhere; }
        .pz-band { display: block; margin-top: 6px; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .pz-band.accent { color: ${T.accent}; font-weight: 600; }
        .pz-band.kul { color: ${T.ink2}; font-size: 12.5px; }
        .pz-prompt { display: block; margin-top: 8px; }
        .pz-ps { display: block; }
        .pz-joy-n { font-size: 11.5px; color: ${T.ink2}; margin: 0 4px; }
        .pz-ed { border: 0; background: none; color: ${T.accent}; cursor: pointer; font-size: 14px; }
        .pz-prompt-ta { width: 100%; font: 12.5px 'JetBrains Mono', monospace; color: ${T.ink}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px; }
        p.pz-ortda, p.pz-ulgur { margin: 10px 0 0; font-size: 12.5px; color: ${T.ink2}; line-height: 1.45; }
        p.pz-blok-iz { margin: 8px 0 0; font-size: 12.5px; color: ${T.ink2}; }
        .pz-tk-karta { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; padding: 10px 12px; border-radius: 12px; border: 1.5px solid ${fon(T.accent, 0.45)}; background: ${T.paper}; }
        .pz-tk-q { display: grid; grid-template-columns: 124px minmax(0, 1fr); column-gap: 10px; align-items: baseline; font-size: 12.5px; color: ${T.ink}; line-height: 1.4; }
        .pz-tk-q b { color: ${T.ink2}; font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; overflow-wrap: anywhere; }
        @media (max-width: 420px) { .pz-tk-q { grid-template-columns: 104px minmax(0, 1fr); } }
        .pz-tk-tug { display: flex; gap: 8px; flex-wrap: wrap; }
        .pz-nat { display: flex; gap: 14px; align-items: flex-start; flex-wrap: wrap; }
        .pz-nat > .pz-telj .pz-tel { height: 318px; } /* kutilgan natija: ikkala o'yin kartasi telefon ichida to'liq ko'rinsin */
        .pz-nat-tel { display: flex; flex-direction: column; align-items: center; gap: 6px; max-width: 200px; }
        p.pz-nat-huquq { margin: 0; font-size: 11px; color: ${T.ink2}; line-height: 1.35; text-align: center; }
        .pz-nat-o { flex: 1; min-width: 190px; display: flex; flex-direction: column; gap: 10px; }
        .pz-kk { display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 12px; background: ${T.bg}; border: 1px solid ${T.line}; opacity: .45; transition: opacity .4s; }
        .pz-kk.on { opacity: 1; background: ${T.paper}; }
        .pz-kk-h { font: 800 11px 'Manrope', sans-serif; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .05em; }
        .pz-kk > code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink}; overflow-wrap: anywhere; }
        .pz-kk-n { font-size: 11.5px; color: ${T.ink2}; padding-left: 8px; }
        .pz-kk-n.ok { color: ${T.ok}; font-weight: 700; }
        .pz-kk .pz-br { border: 1px solid ${T.line}; border-radius: 10px; overflow: hidden; background: ${T.paper}; min-height: 64px; }
        /* 8-ekran: Pro holati */
        .pz-pmini { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .pz-pmini-il { display: flex; flex-direction: column; padding: 8px 10px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .pz-pmini-il em { font-style: normal; font-size: 11px; color: ${T.ink2}; }
        .pz-pmini-yol { display: flex; flex-direction: column; gap: 4px; }
        .pz-pmini-yol em { font-style: normal; font: 700 11px 'JetBrains Mono', monospace; padding: 3px 8px; border-radius: 8px; border: 1.5px solid ${T.accent}; background: ${T.paper}; color: ${T.ink}; }
        .pz-pmini-yol em.o::after { content: ' →'; }
        .pz-pmini-yol em.c::before { content: '← '; }
        .pz-pmini-yol em.c { border-color: ${T.ok}; color: ${T.ok}; }
        /* Kartochkalar va yakun */
        .pz-flash { display: flex; flex-direction: column; gap: 10px; }
        .pz-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: pz-puls 1.8s ease-out .4s 3; }
        p.pz-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.pz-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .pz-yakun { display: contents; }
        .pz-yakun.tiksiz .done-chip .tick { display: none; }
        .pz-hw { display: flex; flex-direction: column; gap: 10px; }
        .pz-hw-karta { display: flex; flex-wrap: wrap; gap: 8px 16px; }
        .pz-hw-q { display: inline-flex; gap: 6px; align-items: baseline; font-size: 13px; }
        .pz-hw-k { color: ${T.ink2}; font-weight: 700; }
        .pz-hw-v { color: ${T.ink}; }
        .pz-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .pz-hw-qadam li { display: flex; gap: 8px; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .pz-hw-qadam i { font-style: normal; color: ${T.accent}; font-weight: 800; }
        p.pz-hw-ost { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .pz-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .pz-ai { display: flex; flex-direction: column; gap: 8px; }
        p.pz-ai-m { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .pz-ai-sorov { margin: 0; white-space: pre-wrap; font: 12px 'JetBrains Mono', monospace; color: ${T.ink}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 10px; padding: 10px 12px; }
        .pz-ai-btn { align-self: flex-start; }
        @media (max-width: 640px) {
          .pz-s0-m { justify-content: center; }
          .pz-s0-v { margin-top: 0; width: 100%; }
          .pz-v-r.ulag::before { display: none; }
          .pz-sahna { flex-direction: column; align-items: center; gap: 6px; }
          .pz-yol { width: 100%; flex: none; height: 62px; }
          .pz-yol-ch { left: 50%; right: auto; top: 0; bottom: 0; border-top: 0; border-left: 2px dashed ${T.line}; }
          .pz-konv { left: 50%; top: 0; }
          .pz-konv.o { animation-name: pz-uch-ov; }
          .pz-konv.c { animation-name: pz-uch-cv; }
          .pz-yol-iz { top: auto; bottom: 0; }
          .pz-ms { grid-template-columns: 1fr; }
          .pz-ms-tel { position: static; }
          .pz-ikki { grid-template-columns: 1fr; }
          .pz-v-r { grid-template-columns: 74px minmax(0, 1fr) auto; }
          .pz-xz { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @keyframes pz-uch-ov { from { top: 0; transform: translate(-50%, 0); } to { top: 100%; transform: translate(-50%, -100%); } }
        @keyframes pz-uch-cv { from { top: 100%; transform: translate(-50%, -100%); } to { top: 0; transform: translate(-50%, 0); } }
        @media (prefers-reduced-motion: reduce) {
          .pz-halqa, .pz-k.faol .q-variant, .pz-bash .q-chip, .pz-chorla > .q-chip, .pz-xr-g.faol .pz-xr, .pz-flash.yangi .fc-card .fc-front,
          .pz-tel-ekran, .pz-taklif.sirgal .pz-taklif-t, .pz-tk-narx.yon, .pz-savol.yon, .pz-el-pro, .pz-el-k, .pz-m-holat, .pz-tg-bepul, .pz-tg-p, .pz-xk.ag,
          .pz-v-r.yangi, .pz-hisob, .pz-muhr, .pz-bl, .pz-jad-r.yangi, .pz-pro.yangi b, .pz-konv { animation: none !important; }
          .pz-ry, .pz-v-r, .pz-kk, .pz-belgi-q, .pz-belgi-q::after { transition: none !important; }
        }
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
