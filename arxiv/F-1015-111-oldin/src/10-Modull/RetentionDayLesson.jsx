import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 12-Modul · 9-dars «Loyiha kuni: foydalanuvchini qaytaradigan eslatma» (m10-09) — MD v3: feedback/F-1006-12modul/09-RetentionDay-v3.md (GATE M ✓, 09-FILTR).
// 4-dars (LiveNotifyDayLesson) infrasi nusxasidan qurildi (u skeletdan — src/skelet/NamunaDars.jsx), 07.10.2026. 12 ekran: QKirish · QReja · QTushuncha · Amaliyot 1 · QTest · QTushuncha · Amaliyot 2 · QTest · Amaliyot 3 · podium · QKartochka · QYakun.
// Bitta vizual — QaytishSahna (ikki telefon, Backend tuguni; 1-telefon ko'rinishlari ilova / qulf). O'qiydi: pm-m10d8-qadamlar, pm-m9d8-platforma.trek; yangi kalit yozmaydi (tayanch 4, 8).
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm10-09-v1', lessonTitle: { uz: "Loyiha kuni: foydalanuvchini qaytaradigan eslatma", ru: "День проекта: напоминание, которое возвращает пользователя" } };
// 12 ekran (MD v3, loyiha kuni): kirish → reja → tushuncha → Amaliyot 1 → test → tushuncha → Amaliyot 2 → test → Amaliyot 3 → podium → kartochkalar → yakun.
const HW_TOKENS = [
  { t: { uz: 'eslatma', ru: 'напоминание' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'jonli xabar', ru: 'живое сообщение' }, l: 64, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'sanoq', ru: 'подсчёт' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'test holati', ru: 'тестовый режим' }, l: 74, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'a3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). s4 — B (1), s7 — C (2) (MD ✔, o'zgarmaydi). `practice: -1` — uch blok sentinel (variant yo'q).
const INLINE_KEYS = { s4: 1, s7: 2, practice: -1 };
const rcKod = (s) => <code className="qcode">{s}</code>;
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: raqam — 1-pilot naqshi)
const RECAPS = {
  4: {
    title: { uz: "Jonli xabar faqat ochiq ilovada ko'rinadi", ru: 'Живое сообщение видно только в открытом приложении' },
    cards: [
      { ic: '1', h: { uz: 'Ilova ochiq: hodisa keladi, jonli xabar chiqadi.', ru: 'Приложение открыто: приходит событие, появляется живое сообщение.' } },
      { ic: '2', h: { uz: "Ilova yopiq: jonli xabar ko'rinmaydi.", ru: 'Приложение закрыто: живого сообщения не видно.' } },
      { ic: '3', h: { uz: "Ilova ochilganda — yangi sonni ro'yxatda ko'radi.", ru: 'Когда приложение откроют — новое число видно в списке.' }, ask: { uz: 'Yopiq ilovaning telefon ekraniga nima chiqa oladi?', ru: 'Что может появиться на экране телефона, когда приложение закрыто?' } }
    ]
  },
  7: {
    title: { uz: 'Foydali eslatmaning uch katagi', ru: 'Три клетки полезного напоминания' },
    cards: [
      { ic: '1', h: { uz: "O'z ishiga tegishli, foydasi aniq.", ru: 'Касается его собственного дела, польза понятна.' } },
      { ic: '2', h: { uz: 'Rost: ilova buni oldindan biladi.', ru: 'Правда: приложение знает это заранее.' } },
      { ic: '3', h: { uz: "Bosim, qo'rqitish, uyaltirish yo'q.", ru: 'Нет давления, запугивания, стыда.' }, ask: { uz: "«Sizni sog'indik!» qaysi katakdan o'tmaydi?", ru: '«Мы скучаем!» — какую клетку не проходит?' } }
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

// ===== BITTA VIZUAL — «ikki telefon va Backend» sahnasi QaytishSahna (163, 180; tayanch 9.16): bitta manba QAYTISH_SAHNA + NAMUNA_OYIN + YANGI_ELON + MATNLAR + KATAKLAR + QAYTISH_SONLAR =====
// 0, 1, 2, 5-ekranlar, uch blokning kutilgan natijasi va kartochka shundan o'qiydi. 2-pilot / 4-dars sahnasi yo'li bilan — nusxa, import emas (darslar mustaqil).
// Sudraladigan konteyner yo'q — pointer capture ishlatilmaydi (E 47); har sahna tugmasi oddiy <button>.
// qolip-maket: qs-qoshil qs-yop qs-och qs-elon qs-qoida qs-ochirgich
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const halqa = (on) => (on ? 'qs-halqa' : undefined);
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Ketma-ket sahna qadamlari: [[kechikish ms, fn], …]; ekran yopilsa taymerlar tozalanadi; reduced-motion — kechikishsiz (DE-200)
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
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };
// O'qituvchi eslatmasi — faqat Mentor rejimida (MD aytgan joyda: 1-ekran)
const Ustoz = ({ satrlar }) => {
  const isMentor = useMentorLive();
  if (!isMentor) return null;
  return <div className="qs-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>;
};

// «Maydon Jamoa» nomi rangi — 11-Modul tayanch 9.62 (PM palitrasining ok yashilidan farqli; A to'lqindan saboq)
const MAYDON_RANG = '#2E9E4F';
const NAMUNA_OYIN = { id: 1, vaqt: { uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' }, joy: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, kerak: 10 };
const YANGI_ELON = { vaqt: { uz: 'Yakshanba, 18:00', ru: 'Воскресенье, 18:00' }, joy: { uz: 'Maktab maydoni', ru: 'Школьное поле' }, son: 0, kerak: 10 };
// Mentor misolining sonlari (tayanch 1.9, 9.41 a): birinchi uch kunda ochgan 46 qurilma, keyingi ikki kunda yana ochgani 17 (taxminan 37%)
const QAYTISH_SONLAR = { ochgan: 46, yana: 17, foiz: 37 };
const JOY_XABAR = { uz: 'Shanba, 18:00 — 2 joy qoldi', ru: 'Суббота, 18:00 — осталось 2 места' };
const UCH_KUNLIK = { uz: "Hafta oxiriga o'yin bormi? E'lonlarni ko'ring", ru: 'Есть игра на выходных? Посмотрите объявления' };
// Foydali eslatmaning uch katagi (5-ekran va recap 2)
const KATAKLAR = [
  { uz: "O'z ishiga tegishli, foydasi aniq", ru: 'Касается его дела, польза понятна' },
  { uz: 'Rost: ilova buni oldindan biladi', ru: 'Правда: приложение знает это заранее' },
  { uz: "Bosim, qo'rqitish, uyaltirish yo'q", ru: 'Нет давления, запугивания, стыда' }
];
// 5-ekran: to'rt eslatma matni (2-si — 4-darsdagi o'yin eslatmasi, 4-si — uch kunlik eslatma); kat — uch katak natijasi; xato — qizil qator
const MATNLAR = [
  { matn: { uz: "Sizni sog'indik! Maydon Jamoa'ga qayting", ru: 'Мы скучаем! Возвращайтесь в Maydon Jamoa' }, kat: [false, true, false], xato: { uz: 'Foyda aytilmagan — faqat bosim.', ru: 'Пользы не названо — только давление.' } },
  { matn: { uz: 'Bugun, 18:00 · Mahalla maydoni', ru: 'Сегодня, 18:00 · Поле махалли' }, kat: [true, true, true], yorliq: { uz: "4-darsdagi o'yin eslatmasi", ru: 'напоминание об игре из 4-го урока' } },
  { matn: { uz: "Yangi o'yin e'lon qilindi: qo'shiling", ru: 'Объявлена новая игра: присоединяйтесь' }, kat: [true, false, true], xato: { uz: "Yopiq ilova yangi e'lonni bilmaydi.", ru: 'Закрытое приложение не знает о новом объявлении.' } },
  { matn: UCH_KUNLIK, kat: [true, true, true] }
];
const QAYTISH_SAHNA = {
  t1: { uz: '1-telefon · siz', ru: 'Телефон 1 · вы' },
  t2: { uz: "2-telefon · boshqa o'yinchi", ru: 'Телефон 2 · другой игрок' },
  yopiqYorliq: { uz: "o'yinchi · ilova yopiq", ru: 'игрок · приложение закрыто' },
  nom: 'Maydon Jamoa',
  backend: 'Backend',
  oyinlar: { uz: "O'yinlar", ru: 'Игры' },
  qoshil: { uz: "Qo'shilaman", ru: 'Присоединяюсь' },
  qoshildi: { uz: "Qo'shildingiz", ru: 'Вы присоединились' },
  belgi: { ulangan: { uz: 'Ulangan', ru: 'Подключено' }, ulanmoqda: { uz: 'Ulanmoqda…', ru: 'Подключается…' } },
  hisobdan: { uz: 'Hisobdan chiqish', ru: 'Выйти из аккаунта' },
  eslatmalar: { uz: 'Eslatmalar', ru: "Напоминания" },
  kv: { sorov: { uz: "so'rov", ru: 'запрос' }, javob: { uz: 'javob', ru: 'ответ' } }
};

// Eslatma kartasi qulf ekranida: «Maydon Jamoa» o'z rangida + matn; holat: ok (yashil chegara) · xato (qizil, so'nadi) · sondi (o'chirgichdan keyin) · ixcham (o'tgan matn)
const EslatmaKarta = ({ matn, yorliq, holat, ixcham, bosildi }) => (
  <div className={cx('qs-eslatma', holat && `h-${holat}`, ixcham && 'ixcham', bosildi && 'bosildi')}>
    {yorliq && <em className="qs-es-y">{tr(yorliq)}</em>}
    <b className="qs-es-nom">{QAYTISH_SAHNA.nom}</b>
    <span className="qs-es-m">{tr(matn)}</span>
  </div>
);
// O'yin kartasi «O'yinlar» ro'yxatida
const OyinKarta = ({ o, son, sonYangi, yangi }) => (
  <span className={cx('qs-karta', yangi && 'yangi')}>
    <b>{tr(o.vaqt)}</b><span>{tr(o.joy)}</span>
    <span className="qs-karta-son"><b key={son} className={cx(sonYangi && 'qs-pop')}>{son}</b> / {o.kerak}</span>
  </span>
);
// Telefon ichidagi ekranlar: qulf (umumiy qulf ekrani — sana-soat va ilova belgisi yo'q) · oyinlar (1-telefon, ilova ochiq) · oyin (2-telefon)
const TelEkran = ({ t }) => {
  const kor = t.kor || 'oyin';
  if (kor === 'qulf') return (
    <div className="qs-qulf">
      <span className="qs-qulf-qulf" aria-hidden="true"><i /></span>
      <span className="qs-qulf-kartalar">{(t.kartalar || []).map(k => <EslatmaKarta key={k.id} {...k} />)}</span>
      <span className="qs-qulf-past" aria-hidden="true" />
    </div>
  );
  if (kor === 'oyinlar') return (
    <div className="qs-oyinlar">
      <span className="qs-ol-bosh"><b className="qs-ol-sar">{tr(QAYTISH_SAHNA.oyinlar)}</b>
        {t.belgi && <span className={cx('qs-belgi', t.belgi)} key={t.belgi}><i />{tr(QAYTISH_SAHNA.belgi[t.belgi])}</span>}</span>
      {t.yangiElon && <OyinKarta o={YANGI_ELON} son={YANGI_ELON.son} yangi />}
      <OyinKarta o={NAMUNA_OYIN} son={t.son ?? 7} sonYangi={t.sonYangi} />
      {t.sozlama && <span className="qs-sozlama fade-step">
        <span className="qs-soz-q"><span>{tr(QAYTISH_SAHNA.eslatmalar)}</span><i className="qs-soz-sw on" aria-hidden="true" /></span>
        <span className="qs-soz-chiq">{tr(QAYTISH_SAHNA.hisobdan)}</span>
      </span>}
    </div>
  );
  return (
    <div className="qs-oyin">
      <b className="qs-oyin-sar">{tr(NAMUNA_OYIN.vaqt)}</b>
      <span className="qs-oyin-joy">{tr(NAMUNA_OYIN.joy)}</span>
      <span className="qs-hisob"><b key={t.son ?? 7} className={cx('qs-son', t.sonYangi && 'qs-pop')}>{t.son ?? 7}</b> / {NAMUNA_OYIN.kerak}</span>
      <span className="qs-oyin-past">
        <button type="button" className={cx('qs-qoshil', t.qoshildi && 'off', halqa(t.qoshilHalqa))} disabled={!t.onQoshil || t.qoshildi} onClick={t.onQoshil}>{tr(t.qoshildi ? QAYTISH_SAHNA.qoshildi : QAYTISH_SAHNA.qoshil)}</button>
      </span>
    </div>
  );
};
// Telefon — o'lchami barqaror 172×272 (SABOQ 22), yorliq ramka ustida (SABOQ 23), «Maydon Jamoa» o'z rangida (logotip yo'q, D4).
// Jonli xabar — ilova ichida, ekran tepasida (oqimda, ro'yxatni yopmaydi), tepadan tushadi va bir necha soniyadan keyin yig'iladi (jonli / jonliKet); qulf ekranida jonli xabar yo'q.
const Telefon = ({ no = 1, t = {} }) => (
  <div className="qs-tel-ust">
    {t.tex ? <span className="qs-tel-yorliq tex">{t.tex}</span> : <span className={cx('qs-tel-yorliq', no === 1 ? 'b1' : 'b2')}>{tr(t.yorliq || (no === 1 ? QAYTISH_SAHNA.t1 : QAYTISH_SAHNA.t2))}</span>}
    {t.ustki}
    <div className={cx('qs-telefon', t.kor === 'qulf' && 'qulf')}>
      {t.kor !== 'qulf' && <div className="qs-tel-bar"><span className="qs-tel-nom">{QAYTISH_SAHNA.nom}</span></div>}
      {t.jonli && t.kor !== 'qulf' && <div className={cx('qs-jonli', t.jonliKet && 'ket')} role="status"><b>{QAYTISH_SAHNA.nom}</b><span>{tr(t.jonli)}</span></div>}
      <div className="qs-tel-ekran" key={t.kor || 'oyin'}>
        <TelEkran t={t} />
      </div>
    </div>
    {t.osti}
  </div>
);
const BackendTugun = ({ b = {} }) => (
  <div className="qs-be-ust">
    <div className="qs-be-joy">
      <div className="qs-backend">
        <span className="qs-be-nom">{QAYTISH_SAHNA.backend}</span>
        {b.db != null && <span className="qs-db">Database: <b key={b.db} className={cx(b.dbYangi && 'qs-pop')}>{b.db}</b></span>}
        {b.qator && <span className="qs-be-qator fade-step">{tr(b.qator)}</span>}
      </div>
    </div>
  </div>
);
// Konvert chiziq bo'ylab uchadi: yon 'be' — telefondan Backend'ga, 'tel' — Backend'dan telefonga; yorlig'i — hodisa nomi yoki «so'rov» / «javob»
const Konvert = ({ k, no, tik }) => {
  if (!k) return null;
  const telBosh = tik || no === 1;
  const ab = telBosh ? k.yon === 'be' : k.yon !== 'be';
  const anim = `qs-kv-${tik ? 'y' : 'x'}-${ab ? 'ab' : 'ba'}`;
  return (
    <span className={cx('qs-kv', k.tur)} style={{ animationName: anim }}>
      <i className="qs-kv-i" />
      <b className="qs-kv-y">{k.nom ? <>{k.nom}{k.mal && <em>{k.mal}</em>}</> : tr(QAYTISH_SAHNA.kv[k.tur])}</b>
    </span>
  );
};
// Chiziq holatlari: yoq · ochiq (sekin yonib turadi) · xira (ilova yopiq — yorliqsiz; ulanish qachon uzilishi ko'rsatilmaydi, 04-FILTR 1)
const Chiziq = ({ holat = 'yoq', no, tik, k }) => (
  <div className={cx('qs-chiziq', tik ? 'tik' : 'yot', `n${no}`, `h-${holat}`)}>
    <span className="qs-chiziq-i" key={holat} />
    <Konvert key={k ? k.id : 'yoq'} k={k} no={no} tik={tik} />
  </div>
);
// QaytishSahna: chapda «1-telefon · siz» (ko'rinish ilova / qulf), o'rtada Backend (Database: N), o'ngda «2-telefon · boshqa o'yinchi».
// be bo'lmasa — faqat 1-telefon (0, 1, 5-ekranlar). Telefonda (yoki ixcham) — telefonlar tepada yonma-yon, Backend pastda, chiziqlar tik.
const QaytishSahna = ({ t1, t2, be, c1, c2, k1, k2, ixcham }) => {
  const mob = useIsMobile(640);
  const tik = !!(ixcham || mob);
  const ikki = !!t2;
  return (
    <div className={cx('qs-sahna', tik ? 'tik' : 'yot', ikki ? 'ikki' : 'bir', !be && 'bes')}>
      <div className={cx('qs-s-t1', be && `h-${c1 || 'yoq'}`)}><Telefon no={1} t={t1} /></div>
      {be && <div className="qs-s-c1"><Chiziq holat={c1} no={1} tik={tik} k={k1} /></div>}
      {be && <div className="qs-s-be"><BackendTugun b={be} /></div>}
      {ikki && be && <div className="qs-s-c2"><Chiziq holat={c2} no={2} tik={tik} k={k2} /></div>}
      {ikki && <div className={cx('qs-s-t2', be && `h-${c2 || 'yoq'}`)}><Telefon no={2} t={t2} /></div>}
    </div>
  );
};
// Hisoblagich (0-ekran): ikki gorizontal ustun — 46 to'liq, 17 qisqa; ustida «Mentor misolida»
const Hisoblagich = ({ foiz }) => (
  <div className="qs-hisoblagich">
    <span className="qs-hs-y">{tr({ uz: 'Mentor misolida', ru: 'В примере Ментора' })}</span>
    <span className="qs-hs-q"><span className="qs-hs-t">{tr({ uz: '1–3-kun · ilovani ochgan qurilmalar', ru: "Дни 1–3 · устройства, открывшие приложение" })} — <b>{QAYTISH_SONLAR.ochgan}</b></span><i className="qs-hs-b" style={{ width: '100%' }} /></span>
    <span className="qs-hs-q"><span className="qs-hs-t">{tr({ uz: '4–5-kun · ulardan yana ochgani', ru: "Дни 4–5 · из них открыли снова" })} — <b>{QAYTISH_SONLAR.yana}</b></span><i className="qs-hs-b qisqa" style={{ width: `${Math.round(QAYTISH_SONLAR.yana / QAYTISH_SONLAR.ochgan * 100)}%` }} /></span>
    {foiz && <span className="qs-hs-foiz fade-step">{tr({ uz: <>qaytganlar foizi — <b>taxminan {QAYTISH_SONLAR.foiz}%</b> · shu {QAYTISH_SONLAR.ochgan} qurilma bo'yicha sanalgan</>, ru: <>процент вернувшихся — <b>примерно {QAYTISH_SONLAR.foiz}%</b> · посчитано по этим {QAYTISH_SONLAR.ochgan} устройствам</> })}</span>}
  </div>
);

// Ballsiz bashorat: tanlangach ixcham qator bo'lib natijagacha turadi (SABOQ 11); har chipning o'z yengil chegarasi (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="qs-halqa-g"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="qs-bash-ix fade-step"><em>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</em><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosaning birinchi kichik qatori (E 42): tanlangan javob qaytarilmaydi
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="qs-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="qs-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: "на самом деле" })}: <b>{tx(haqiqat)}</b></span>);
// Bitta yashil quti: taxmin qatori · xulosa · izoh (QIzoh — shu qutining oxirgi kichik qatori, E 42)
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="qs-x-m">{matn}</span>{izoh && <span className="qs-x-iz">{izoh}</span>}</>;
const AVVAL_TAXMIN = { uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' };
const DAVOM = { uz: 'Davom etish', ru: 'Продолжить' };

// ===== SCREEN 0 — KIRISH (QKirish: 1-telefon qulf ekrani + hisoblagich 46 · 17; javobdan keyin eslatma kartasi tushadi, ostida qaytganlar foizi) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Ilova ichidagi jonli xabar', ru: 'Живое сообщение внутри приложения' } },
  { id: 'b', label: { uz: 'Telefon ekraniga chiqqan eslatma', ru: 'Напоминание на экране телефона' } },
  { id: 'c', label: { uz: "O'zi yangilangan o'yinlar ro'yxati", ru: 'Список игр, обновившийся сам' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Ilova yopiq bo'lsa, ichidagi narsa ko'rinmaydi. Telefon ekraniga esa eslatma chiqa oladi.</>, ru: <><b>Именно!</b> Если приложение закрыто, того, что внутри, не видно. А вот напоминание на экране телефона появиться может.</> },
  a: { uz: <><b>Qiziq fikr!</b> Jonli xabar ilova ochiq paytda chiqadi. Ilova yopiq bo'lsa, uni hech kim ko'rmaydi.</>, ru: <><b>Интересная мысль!</b> Живое сообщение появляется, когда приложение открыто. Если оно закрыто, его никто не увидит.</> },
  c: { uz: <><b>Qiziq fikr!</b> Ro'yxat ilova ochiq turganda yangilanadi. Ilovani ochmagan odam uni ko'rmaydi.</>, ru: <><b>Интересная мысль!</b> Список обновляется, пока приложение открыто. Тот, кто не открывает приложение, его не видит.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [eslatma, setEslatma] = useState(avval);
  const [foiz, setFoiz] = useState(avval);
  const [sc, setSc] = useState(0);
  const ketma = useKetma();
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); setSc(n => n + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    ketma([[450, () => setEslatma(true)], [800, () => setFoiz(true)]]);
  };
  const javob = picked !== null;
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!javob} label={tr(DAVOM)} onClick={onNext} />}>
      <div className={cx('qs-k', !javob && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Ilovani ochmay qo'ygan o'yinchiga <span className="italic" style={{ color: T.accent }}>nima ko'rinadi</span>?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>видит игрок</span>, забросивший приложение?</> })}
          mentor={<Mentor>{javob
            ? tr({ uz: "7-Modulda bot uchun sanagan qaytganlar foizini bu yerda qurilmalar bo'yicha ko'rasiz; «Davom etish»ni bosing.", ru: "Процент вернувшихся, который в 7-м модуле вы считали для бота, здесь вы увидите по устройствам; нажмите «Продолжить»." })
            : tr({ uz: 'Mentor misolida ilovani ochgan qurilmalarning ko\'pi keyingi ikki kunda uni yana ochmadi — avval javobni tanlang.', ru: 'В примере Ментора большинство устройств, открывших приложение, в следующие два дня его больше не открыли — сначала выберите ответ.' })}</Mentor>}
          maket={<div className="qs-k0">
            <Telefon no={1} t={{ yorliq: QAYTISH_SAHNA.yopiqYorliq, kor: 'qulf', kartalar: eslatma ? [{ id: 'u', matn: UCH_KUNLIK }] : [] }} />
            <Hisoblagich foiz={foiz} />
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={javob && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda tayyor holat bir marta o'zi yuradi — jonli xabar → qulf ekrani → eslatma → bosiladi → ilova ochiladi → «eslatmadan ochdi · +1»; o'ngda 3 qator, tegsiz) =====
const REJA = [
  { t: { uz: 'Ilova ochiq: foydali jonli xabar', ru: 'Приложение открыто: полезное живое сообщение' } },
  { t: { uz: "Ilova yopiq: oldindan qo'yilgan eslatma", ru: 'Приложение закрыто: заранее поставленное напоминание' } },
  { t: { uz: 'Eslatmadan ochilganlar sanaladi', ru: 'Открытия из напоминания считаются' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [f, setF] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[900, () => setF(1)], [2600, () => setF(2)], [450, () => setF(3)], [900, () => setF(4)], [1500, () => setF(5)], [600, () => setF(6)], [700, () => setF(7)]]); }, []); // eslint-disable-line
  const qulf = f >= 3 && f < 6;
  const t1 = qulf
    ? { kor: 'qulf', kartalar: f >= 4 ? [{ id: 'u', matn: UCH_KUNLIK, bosildi: f >= 5 }] : [] }
    : { kor: 'oyinlar', belgi: 'ulangan', son: f >= 1 ? 8 : 7, sonYangi: f === 1, jonli: f >= 1 && f < 3 ? JOY_XABAR : null, jonliKet: f === 2,
      osti: f >= 7 && <span className="qs-sanoq-q fade-step">{tr({ uz: 'eslatmadan ochdi', ru: 'открыл из напоминания' })} · <b>+1</b></span> };
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun ilovangizga <span className="italic" style={{ color: T.accent }}>qaytaradigan eslatma</span> qo'shasiz.</>, ru: <>Сегодня вы добавите <span className="italic" style={{ color: T.accent }}>возвращающее напоминание</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Hodisadan eslatmagacha bo'lgan yo'lni uch blokda qurasiz — talabni siz yozasiz, namuna «Yordam»da turadi.", ru: "Путь от события до напоминания вы построите в трёх блоках — требование пишете вы, образец — в «Подсказке»." })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="qs-reja-chap"><QaytishSahna t1={t1} /></div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t) }))}
      >
        <p className="qs-reja-past">{tx({ uz: "o'z repo'ngiz · Mentor misoli `maydon-jamoa` · boshlang'ich teg `m12-dars-09-start` · namuna `m12-dars-09-done`", ru: 'ваш репозиторий · пример Ментора `maydon-jamoa` · начальный тег `m12-dars-09-start` · образец `m12-dars-09-done`' })}</p>
        <p className="qs-reja-past2">{tr({ uz: "«Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz. Web-trekda 2-amaliyotda «Siz yo'q paytingizda» qatori quriladi.", ru: "«Maydon Jamoa» — образец; практики вы выполняете в своём продукте. В веб-треке на 2-й практике строится строка «Пока вас не было»." })}</p>
        <Ustoz satrlar={[
          { uz: "Eng og'ir qism — 2 va 3-amaliyot (ruxsat, test holati, eslatmani bosib ochish). Test holati har blok oxirida qaytarilganini kuzating: aks holda o'rnatish faylida eslatma bir daqiqada chiqib qoladi.", ru: 'Самая тяжёлая часть — 2-я и 3-я практики (разрешение, тестовый режим, открытие по напоминанию). Следите, чтобы тестовый режим возвращали в конце каждого блока: иначе в установочном файле напоминание будет появляться через минуту.' },
          { uz: "Uyga vazifa yo'q: o'rnatish fayli navbatda qolsa, havola keyingi dars boshida almashtiriladi. Sinfdagi tekshiruv yozuvlari (`eslatmadan-ochdi`) 3-amaliyot oxirida `id` bo'yicha o'chiriladi — haqiqiy sanoqqa qo'shilmasin.", ru: 'Домашнего задания нет: если установочный файл остался в очереди, ссылку заменяют в начале следующего урока. Проверочные записи в классе (`eslatmadan-ochdi`) в конце 3-й практики удаляют по `id` — чтобы не попали в настоящий подсчёт.' },
          { uz: "`eslatmadan-ochdi` ilovaning istalgan eslatmasi bosilganini sanaydi: «uch kunlik eslatma shuncha odamni qaytardi» deyilmaydi. Haftalik chegara bugun telefonda tekshirilmaydi (bir hafta kerak) — «kodda bor, telefonda tekshirilmagan».", ru: '`eslatmadan-ochdi` считает нажатие на любое напоминание приложения: не говорим «трёхдневное напоминание вернуло столько-то людей». Недельный предел сегодня на телефоне не проверяется (нужна неделя) — «в коде есть, на телефоне не проверено».' },
          { uz: "13-Modulda qaytarish mexanikalari yana bor — o'quvchiga aytmang, bugun bitta mexanika.", ru: 'В 13-м модуле механики возврата будут ещё — ученикам не говорите, сегодня одна механика.' }
        ]} />
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · ochiq va yopiq ilova (bashorat + 3 harakat navbat bilan): qo'shilish → «2 joy qoldi» · yopish + e'lon → jonli xabar ko'rinmadi · ochish → yangi karta =====
const S2_TAXMIN = [{ k: 'zahoti', t: { uz: 'Shu zahoti — telefon ekranida', ru: 'Сразу — на экране телефона' } }, { k: 'ochganda', t: { uz: 'Ilovani o\'zingiz ochganingizda', ru: 'Когда сами откроете приложение' } }];
const S2_NAV = { uz: 'Harakatlarni navbat bilan bajaring', ru: 'Выполните действия по очереди' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [band, setBand] = useState(false);
  const [db, setDb] = useState(avval ? 8 : 7);
  const [dbYangi, setDbYangi] = useState(false);
  const [son1, setSon1] = useState(avval ? 8 : 7);
  const [son2, setSon2] = useState(avval ? 8 : 7);
  const [qoshildi2, setQoshildi2] = useState(avval);
  const [kor1, setKor1] = useState('oyinlar');
  const [belgi, setBelgi] = useState('ulangan');
  const [c1, setC1] = useState('ochiq');
  const [k1, setK1] = useState(null);
  const [k2, setK2] = useState(null);
  const [jonli, setJonli] = useState(null);
  const [jonliKet, setJonliKet] = useState(false);
  const [yopildi, setYopildi] = useState(false);
  const [beQator, setBeQator] = useState(avval);
  const [korinmadi, setKorinmadi] = useState(false);
  const [yangiElon, setYangiElon] = useState(avval);
  const ketma = useKetma();
  const done = q >= 3;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const qoshil = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setK2({ id: 's1', tur: 'sorov', yon: 'be' });
    ketma([[950, () => { setK2(null); setDb(8); setDbYangi(true); setSon2(8); setQoshildi2(true); }],
      [450, () => setK1({ id: 'h1', tur: 'hodisa', yon: 'tel', nom: 'oyin-ozgardi' })],
      [950, () => setK1({ id: 's2', tur: 'sorov', yon: 'be', nom: 'GET /oyinlar' })],
      [900, () => setK1({ id: 'j2', tur: 'javob', yon: 'tel' })],
      [900, () => { setK1(null); setSon1(8); setJonli(JOY_XABAR); setJonliKet(false); }],
      [2800, () => setJonliKet(true)],
      [450, () => { setJonli(null); setJonliKet(false); setQ(1); setBand(false); }]]);
  };
  const yop = () => {
    if (q !== 1 || yopildi || band) return;
    setBand(true); setKor1('qulf'); setC1('xira'); setYopildi(true);
    ketma([[500, () => setBand(false)]]);
  };
  const elon = () => {
    if (q !== 1 || !yopildi || band) return;
    setBand(true); setK2({ id: 's3', tur: 'sorov', yon: 'be' });
    ketma([[950, () => { setK2(null); setBeQator(true); }],
      [500, () => setKorinmadi(true)],
      [400, () => { setQ(2); setBand(false); }]]);
  };
  const och = () => {
    if (q !== 2 || band) return;
    setBand(true); setKor1('oyinlar'); setBelgi('ulanmoqda'); setKorinmadi(false);
    ketma([[900, () => { setBelgi('ulangan'); setC1('ochiq'); }],
      [350, () => setK1({ id: 's4', tur: 'sorov', yon: 'be', nom: 'GET /oyinlar' })],
      [900, () => setK1({ id: 'j4', tur: 'javob', yon: 'tel' })],
      [900, () => { setK1(null); setYangiElon(true); }],
      [700, () => { setQ(3); setBand(false); }]]);
  };
  const mentor = !taxmin || q === 0 ? { uz: "Avval taxminingizni belgilang, keyin ikkinchi telefonda «Qo'shilaman»ni bosing.", ru: "Сначала отметьте предположение, затем на втором телефоне нажмите «Присоединяюсь»." }
    : q === 1 ? { uz: "Xabar uchun yangi hodisa kerak bo'lmadi — endi birinchi telefonda «Ilovani yopish»ni, keyin ikkinchisida «E'lon berish»ni bosing.", ru: 'Для сообщения новое событие не понадобилось — теперь на первом телефоне нажмите «Закрыть приложение», затем на втором «Объявить игру».' }
      : q === 2 ? { uz: "Endi birinchi telefonda «Ilovani ochish»ni bosing.", ru: 'Теперь на первом телефоне нажмите «Открыть приложение».' }
        : { uz: 'Uchala harakat tugadi — natijani taxminingiz bilan solishtiring.', ru: 'Все три действия выполнены — сравните результат со своим предположением.' };
  const yopFaol = !!taxmin && q === 1 && !yopildi && !band;
  const ochFaol = q === 2 && !band;
  const elonFaol = q === 1 && yopildi && !band;
  const t1osti = !tugadi && <span className="qs-s-tugmalar">
    {kor1 === 'qulf'
      ? <button type="button" className={cx('qs-och qs-st', !ochFaol && 'xira', halqa(ochFaol))} disabled={!ochFaol} onClick={och}>{tr({ uz: 'Ilovani ochish', ru: 'Открыть приложение' })}</button>
      : <button type="button" className={cx('qs-yop qs-st', !yopFaol && 'xira', halqa(yopFaol))} disabled={!yopFaol} onClick={yop}>{tr({ uz: 'Ilovani yopish', ru: 'Закрыть приложение' })}</button>}
    {korinmadi && <span className="qs-korinmadi fade-step">{tr({ uz: "jonli xabar ko'rinmadi", ru: "живого сообщения не видно" })}</span>}
  </span>;
  const t2osti = !tugadi && <span className="qs-s-tugmalar"><button type="button" className={cx('qs-elon qs-st', !elonFaol && 'xira', halqa(elonFaol))} disabled={!elonFaol} onClick={elon}>{tr({ uz: "E'lon berish", ru: 'Объявить игру' })}</button></span>;
  const nav = done ? DAVOM : !taxmin ? AVVAL_TAXMIN : { uz: `${S2_NAV.uz} (${q}/3)`, ru: `${S2_NAV.ru} (${q}/3)` };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ochiq va yopiq ilova', ru: 'Понятие · открытое и закрытое приложение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(nav)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Yopiq ilova boshqa odamning <span className="italic" style={{ color: T.accent }}>o'zgarishini biladimi</span>?</>, ru: <>Знает ли закрытое приложение <span className="italic" style={{ color: T.accent }}>о чужих изменениях</span>?</> })}
        mentor={<Mentor>{tr(mentor)}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "Ilova yopiq paytda yangi o'yin e'lon qilindi. Siz buni qachon bilasiz?", ru: 'Пока приложение закрыто, объявили новую игру. Когда вы об этом узнаете?' }} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="qs-viz">
          <QaytishSahna
            t1={{ kor: kor1, belgi, son: son1, sonYangi: son1 === 8 && !avval, yangiElon, jonli, jonliKet, kartalar: [], osti: t1osti }}
            be={{ db, dbYangi, qator: beQator ? { uz: "+1 o'yin", ru: '+1 игра' } : null }}
            t2={{ kor: 'oyin', son: son2, sonYangi: dbYangi, qoshildi: qoshildi2, onQoshil: taxmin && q === 0 && !band ? qoshil : null, qoshilHalqa: !!taxmin && q === 0 && !band, osti: t2osti }}
            c1={c1} c2="ochiq" k1={k1} k2={k2} />
          {done && <p className="qs-joriy fade-step">{tr({ uz: "Bu ilovada yopiq telefonga faqat ilova oldindan qo'ygan eslatma chiqadi.", ru: "В этом приложении, пока оно закрыто, на телефон приходит только напоминание, заранее поставленное самим приложением." })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'ochganda'} haqiqat={{ uz: "ilovani o'zingiz ochganingizda", ru: 'когда сами откроете приложение' }} />}
          matn={tr({ uz: "Bu misolda jonli xabar faqat ochiq ilovada ko'rinadi: yopiq ilova o'zgarishni ochilgandagina ko'radi.", ru: 'В этом примере живое сообщение видно только в открытом приложении: закрытое видит изменение, только когда его откроют.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s4 = 1, B) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Mentor ilovasi yopiq. «2 joy qoldi» xabari o'yinchiga chiqadimi?"
    question={tr({ uz: <h2 className="title h-ask">Mentor ilovasi yopiq. «2 joy qoldi» xabari o'yinchiga <span className="italic" style={{ color: T.accent }}>chiqadimi</span>?</h2>, ru: <h2 className="title h-ask">Приложение Ментора закрыто. <span className="italic" style={{ color: T.accent }}>Появится ли</span> у игрока сообщение «осталось 2 места»?</h2> })}
    options={[
      { uz: 'Chiqadi — jonli xabar telefon ekranida ko\'rinadi', ru: 'Появится — живое сообщение видно на экране телефона' },
      { uz: 'Chiqmaydi — jonli xabar ochiq ilovada chiqadi', ru: 'Не появится — живое сообщение появляется в открытом приложении' },
      { uz: 'Chiqadi — ilova uni yopiq paytda ham oladi', ru: "Появится — приложение получает его и когда закрыто" },
      { uz: 'Chiqmaydi — bu xabar faqat tashkilotchiga chiqadi', ru: 'Не появится — это сообщение видит только организатор' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Jonli xabar faqat ochiq ilovada ko'rinadi.", ru: 'Живое сообщение видно только в открытом приложении.' }}
    explainWrong={{
      0: { uz: "Jonli xabar ilova ichida chiqadi. Ilova yopiq bo'lsa-chi?", ru: 'Живое сообщение появляется внутри приложения. А если оно закрыто?' },
      2: { uz: "Ilova yopiq bo'lsa, jonli xabarni kim ko'radi?", ru: 'Если приложение закрыто, кто увидит живое сообщение?' },
      3: { uz: "Mentor misolida bu xabar o'yinga qo'shilmaganlarga chiqadi.", ru: 'В примере Ментора это сообщение видят те, кто не присоединился к игре.' },
      default: { uz: "Ilova yopiq bo'lsa, jonli xabarni kim ko'radi?", ru: 'Если приложение закрыто, кто увидит живое сообщение?' }
    }} />
);

// ===== SCREEN 5 — TUSHUNCHA · foydali eslatma (bashorat + 4 matn bittadan + o'chirgich): «Qoidadan o'tkazish» → uch katakka ✓/✗ navbat bilan; hisoblagich «Bu hafta: N / 2» =====
const S5_TAXMIN = [{ k: '1', t: { uz: 'Bittasi', ru: "Один" } }, { k: '2', t: { uz: 'Ikkitasi', ru: "Два" } }, { k: '3', t: { uz: 'Uchtasi', ru: "Три" } }];
const S5_TEKSHIR = { uz: 'Matnni tekshiring', ru: 'Проверьте текст' };
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [mi, setMi] = useState(avval ? 4 : 0);            // joriy matn indeksi (4 — to'rttasi o'tdi)
  const [kat, setKat] = useState([null, null, null]);   // joriy matn kataklari: null · true · false
  const [natijaK, setNatijaK] = useState(null);         // joriy karta holati: null · 'ok' · 'xato'
  const [otgan, setOtgan] = useState(avval ? [1, 3] : []); // qulf ekranida qolgan matnlar (indeks)
  const [hafta, setHafta] = useState(avval ? 0 : 0);
  const [sw, setSw] = useState(!avval);                // «Eslatmalar» o'chirgichi
  const [band, setBand] = useState(false);
  const ketma = useKetma();
  const done = !sw;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const m = MATNLAR[mi];
  const qoida = () => {
    if (!taxmin || mi > 3 || band) return;
    setBand(true);
    const kk = m.kat;
    const otdi = kk.every(Boolean);
    ketma([[120, () => setKat([kk[0], null, null])], [260, () => setKat([kk[0], kk[1], null])], [260, () => setKat([kk[0], kk[1], kk[2]])],
      [300, () => { setNatijaK(otdi ? 'ok' : 'xato'); if (otdi) setHafta(h => h + 1); }],
      [1700, () => { if (otdi) setOtgan(o => [...o, mi]); setNatijaK(null); setKat([null, null, null]); setMi(mi + 1); setBand(false); }]]);
  };
  const ochir = () => {
    if (mi < 4 || !sw || band) return;
    setSw(false); setHafta(0);
  };
  const mentor = !taxmin ? { uz: "Mentor misolida eslatmaning to'rtta matni bor — avval taxminingizni belgilang.", ru: 'В примере Ментора у напоминания четыре текста — сначала отметьте предположение.' }
    : mi < 4 ? { uz: "Matnni «Qoidadan o'tkazish» bilan tekshiring va o'ngdagi uch katakni kuzating.", ru: "Проверьте текст кнопкой «Проверить по правилу» и следите за тремя клетками справа." }
      : sw ? { uz: "Endi telefon ostidagi «Eslatmalar» o'chirgichini bosing.", ru: "Теперь нажмите переключатель «Напоминания» под телефоном." }
        : { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' };
  const qoidaFaol = !!taxmin && mi < 4 && !band;
  const swFaol = mi >= 4 && sw && !band;
  const kartalar = [
    ...otgan.map(i => ({ id: `o${i}`, matn: MATNLAR[i].matn, ixcham: true, holat: sw ? 'ok' : 'sondi' })),
    ...(mi < 4 ? [{ id: `j${mi}`, matn: m.matn, holat: natijaK, yorliq: { uz: `Matn ${mi + 1} / 4${m.yorliq ? ` · ${m.yorliq.uz}` : ''}`, ru: `Текст ${mi + 1} / 4${m.yorliq ? ` · ${m.yorliq.ru}` : ''}` } }] : [])
  ];
  const ustki = <span className="qs-hafta-q">
    <span className="qs-hafta">{tr({ uz: 'Bu hafta:', ru: 'За неделю:' })} <b key={hafta} className={cx(hafta > 0 && !avval && 'qs-pop')}>{hafta}</b> / 2</span>
    {sw && mi >= 4 && <span className="qs-hafta-t fade-step">{tr({ uz: "Hafta to'ldi: ilova bu hafta o'zidan yangi eslatma qo'shmaydi.", ru: 'Неделя заполнена: на этой неделе приложение само новое напоминание не добавит.' })}</span>}
  </span>;
  const osti = <span className="qs-s-tugmalar">
    {!tugadi && mi < 4 && <button type="button" className={cx('qs-qoida qs-st', !qoidaFaol && 'xira', halqa(qoidaFaol))} disabled={!qoidaFaol} onClick={qoida}>{tr({ uz: "Qoidadan o'tkazish", ru: "Проверить по правилу" })}</button>}
    <button type="button" role="switch" aria-checked={sw} className={cx('qs-ochirgich', sw && 'on', mi < 4 && 'xira', halqa(swFaol))} disabled={!swFaol} onClick={ochir}>
      <span>{tr(QAYTISH_SAHNA.eslatmalar)}</span><i aria-hidden="true" />
    </button>
  </span>;
  const nav = done ? DAVOM : !taxmin ? AVVAL_TAXMIN : mi < 4 ? { uz: `${S5_TEKSHIR.uz} (${mi}/4)`, ru: `${S5_TEKSHIR.ru} (${mi}/4)` } : { uz: "O'chirgichni bosing", ru: 'Нажмите переключатель' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · foydali eslatma', ru: 'Понятие · полезное напоминание' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(nav)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Telefon ekraniga <span className="italic" style={{ color: T.accent }}>qanday eslatma</span> chiqsin?</>, ru: <><span className="italic" style={{ color: T.accent }}>Какое напоминание</span> показать на телефоне?</> })}
        mentor={<Mentor>{tr(mentor)}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "To'rt matndan nechtasi qoidadan o'tadi?", ru: "Сколько из четырёх текстов проходит правило?" }} variantlar={S5_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="qs-viz">
          <div className="qs-s5">
            <div className="qs-s5-tel"><QaytishSahna t1={{ yorliq: QAYTISH_SAHNA.yopiqYorliq, kor: 'qulf', kartalar, ustki }} /></div>
            <div className="qs-s5-btn">{osti}</div>
            <div className={cx('qs-tk', natijaK && `h-${natijaK}`)}>
              <b className="qs-tk-sar">{tr({ uz: 'Foydali eslatma', ru: 'Полезное напоминание' })}</b>
              <span className="qs-tk-y">{tr({ uz: 'bu kursda · rejalashtirilgan eslatma uchun', ru: 'в этом курсе · для запланированного напоминания' })}</span>
              {KATAKLAR.map((k, i) => (
                <span key={i} className={cx('qs-katak', kat[i] === true && 'ok', kat[i] === false && 'xato')}>
                  <i key={`${mi}-${String(kat[i])}`}>{kat[i] === true ? '✓' : kat[i] === false ? '✕' : ''}</i><span>{tr(k)}</span>
                </span>
              ))}
              {natijaK === 'xato' && m && m.xato && <span className="qs-tk-xato fade-step">{tr(m.xato)}</span>}
            </div>
          </div>
          {done && <p className="qs-joriy fade-step">{tr({ uz: "O'chirgich foydalanuvchida: o'chirsa, rejalashtirilgan eslatmalar bekor bo'ladi.", ru: "Переключатель — у пользователя: если выключит, запланированные напоминания отменятся." })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === '2'} haqiqat={{ uz: 'ikkitasi', ru: 'два' }} />}
          matn={tr({ uz: "Bu kursda eslatma o'z ishiga tegishli, rost va bosimsiz; hafta ikkitaga to'lsa, ilova o'zidan qo'shmaydi.", ru: 'В этом курсе напоминание касается дела пользователя, правдиво и без давления; если на неделе уже два, приложение само не добавит.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 2, C) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Qaysi eslatma darsdagi uch katakdan o'tadi?"
    question={tr({ uz: <h2 className="title h-ask">Qaysi eslatma darsdagi <span className="italic" style={{ color: T.accent }}>uch katakdan</span> o'tadi?</h2>, ru: <h2 className="title h-ask">Какое напоминание проходит <span className="italic" style={{ color: T.accent }}>три клетки</span> урока?</h2> })}
    options={[
      { uz: "«Hamma o'ynayapti, faqat siz yo'qsiz!»", ru: '«Все играют, только вас нет!»' },
      { uz: "«Kecha beshta yangi o'yin e'lon qilindi»", ru: '«Вчера объявили пять новых игр»' },
      { uz: "«Ertaga o'yiningiz bor: Shanba, 18:00»", ru: '«Завтра у вас игра: суббота, 18:00»' },
      { uz: '«Bugun ochmasangiz, o\'yinsiz qolasiz»', ru: '«Не откроете сегодня — останетесь без игры»' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "O'z o'yini, aniq vaqt — ilova buni oldindan biladi.", ru: 'Своя игра, точное время — приложение знает это заранее.' }}
    explainWrong={{
      0: { uz: "Bu gap uyaltiradi. O'yinchiga qanday foyda bor?", ru: 'Эта фраза стыдит. Какая польза игроку?' },
      1: { uz: "Yopiq ilova kechagi e'lonlarni qayerdan biladi?", ru: 'Откуда закрытое приложение знает о вчерашних объявлениях?' },
      3: { uz: "Bu gap qo'rqitadi. Foyda qayerda?", ru: 'Эта фраза пугает. Где польза?' },
      default: { uz: "Yopiq ilova kechagi e'lonlarni qayerdan biladi?", ru: 'Откуда закрытое приложение знает о вчерашних объявлениях?' }
    }} />
);

// ===== 🏅 BADGES (nishonlar) — 4 ta: ikkitasi test (birinchi urinish), ikkitasi blokning oxirgi «Bajardim»i (bonus, birinchi urinish sharti yo'q) =====
const ACHIEVEMENTS = {
  openLine: { icon: '💬', name: 'Open Line', desc: { uz: 'Jonli xabar faqat ochiq ilovada chiqishini topdingiz', ru: 'Вы поняли, что живое сообщение появляется только в открытом приложении' } },
  fairReminder: { icon: '✅', name: 'Fair Reminder', desc: { uz: "Uch katakdan o'tadigan eslatmani tanladingiz", ru: 'Вы выбрали напоминание, которое проходит три клетки' } },
  reminderSet: { icon: '⏰', name: 'Reminder Set', desc: { uz: 'Ilova yopiq paytdagi eslatmani qurib, tekshirdingiz', ru: 'Вы построили и проверили напоминание для закрытого приложения' } },
  comeBack: { icon: '📊', name: 'Come Back', desc: { uz: "Eslatmadan ochilishni sanab, o'chirgichni tekshirdingiz", ru: 'Вы посчитали открытия из напоминания и проверили переключатель' } }
};
// Ekran id → nishon: s4, s7 — test (correct = birinchi urinish); a2, a3 — blokning oxirgi «Bajardim»i (ish bajarilgan, P-048)
const ACH_TRIGGERS = { s4: 'openLine', s7: 'fairReminder', a2: 'reminderSet', a3: 'comeBack' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 7)
const Q_LABELS = {
  4: { uz: '1 — Yopiq ilovaga xabar', ru: '1 — Сообщение закрытому приложению' },
  7: { uz: '2 — Foydali eslatma', ru: '2 — Полезное напоминание' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (MD «Fon so'zlari»; kod so'zlari ru'da ham o'sha, R-008)
const QZ_BG_SHAPES = [
  { ch: { uz: 'qaytganlar foizi', ru: "процент вернувшихся" }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'jonli xabar', ru: 'живое сообщение' }, l: 38, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'eslatma', ru: 'напоминание' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: '«2 joy qoldi»', ru: "«осталось 2 места»" }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: 'oyin-ozgardi', l: 84, t: 48, s: 22, d: 22, dl: 0.6 },
  { ch: 'eslatmadan-ochdi', l: 60, t: 70, s: 22, d: 21, dl: 2.2 },
  { ch: { uz: 'test holati', ru: 'тестовый режим' }, l: 18, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: '«Eslatmalar»', ru: "«Напоминания»" }, l: 24, t: 36, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'sanoq', ru: 'подсчёт' }, l: 46, t: 12, s: 22, d: 24, dl: 2.5 },
  { ch: { uz: 'qurilma', ru: 'устройство' }, l: 4, t: 46, s: 22, d: 26, dl: 1.3 },
  { ch: 'Maydon Jamoa', l: 70, t: 88, s: 22, d: 19, dl: 3.1 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (MD, aylanma; ekran savollarining nusxasi emas — §144)
const QUIZ_BANK = [
  { q: { uz: 'Mentor misolida 46 qurilmadan 17 tasi yana ochdi. Bu nima?', ru: 'В примере Ментора из 46 устройств 17 открыли снова. Что это?' }, opts: [{ uz: 'Qaytganlar foizini beradigan son', ru: "Число, из которого получается процент вернувшихся" }, { uz: "Ro'yxatdan o'tgan odamlarning soni", ru: 'Число зарегистрировавшихся людей' }, { uz: 'Eslatmani bosib ochganlar soni', ru: 'Число открывших по напоминанию' }, { uz: "O'yinga qo'shilgan o'yinchilar soni", ru: 'Число игроков, присоединившихся к игре' }], correct: 0 },
  { q: { uz: "Web-trekda sayt yopiq. O'yinchiga xabar yetadimi?", ru: 'В веб-треке сайт закрыт. Дойдёт ли сообщение до игрока?' }, opts: [{ uz: "Yetadi — brauzer xabarni o'zi ko'rsatadi", ru: 'Дойдёт — браузер сам покажет сообщение' }, { uz: "Yetmaydi — u qaytganda o'zgarishni ko'radi", ru: 'Не дойдёт — он увидит изменение, когда вернётся' }, { uz: "Yetadi — Backend saytni o'zi ochib beradi", ru: 'Дойдёт — Backend сам откроет сайт' }, { uz: "Yetmaydi — sayt xabarni umuman ko'rsatmaydi", ru: 'Не дойдёт — сайт вообще не показывает сообщений' }], correct: 1 },
  { q: { uz: "«2 joy qoldi» uchun Mentor Backend'i qaysi hodisani yuboradi?", ru: "Какое событие отправляет Backend Ментора для сообщения «осталось 2 места»?" }, opts: [{ uz: 'Yangi `joy-qoldi` degan hodisani', ru: 'Новое событие `joy-qoldi`' }, { uz: "Joy sonining o'zini alohida hodisada", ru: 'Само число мест отдельным событием' }, { uz: 'Odatdagi `oyin-ozgardi` hodisasini', ru: 'Обычное событие `oyin-ozgardi`' }, { uz: 'Har soniyada yangilangan sonni', ru: 'Число, обновляемое каждую секунду' }], correct: 2 },
  { q: { uz: '«2 joy qoldi» xabari Mentor misolida kimga chiqadi?', ru: "Кому в примере Ментора появляется сообщение «осталось 2 места»?" }, opts: [{ uz: "Shu o'yinga qo'shilgan hammaga", ru: 'Всем, кто присоединился к этой игре' }, { uz: "O'yinni e'lon qilgan tashkilotchiga", ru: 'Организатору, объявившему игру' }, { uz: "«Qo'shilaman»ni bosgan o'yinchiga", ru: "Игроку, нажавшему «Присоединяюсь»" }, { uz: "Shu o'yinga qo'shilmagan o'yinchiga", ru: 'Игроку, не присоединившемуся к этой игре' }], correct: 3 },
  { q: { uz: "Rejalashtirilgan eslatmani kim qo'yadi?", ru: 'Кто ставит запланированное напоминание?' }, opts: [{ uz: "Ilovaning o'zi — oldindan, telefonda", ru: 'Само приложение — заранее, на телефоне' }, { uz: "Backend — boshqa o'yinchi qo'shilganda", ru: 'Backend — когда присоединится другой игрок' }, { uz: "Tashkilotchi — o'yin e'lon qilganda", ru: 'Организатор — когда объявляет игру' }, { uz: "Telefon — har kuni ertalab o'zicha", ru: 'Телефон — сам каждое утро' }], correct: 0 },
  { q: { uz: "Nega uch kunlik eslatma «Yangi o'yin chiqdi» demaydi?", ru: 'Почему трёхдневное напоминание не говорит «Вышла новая игра»?' }, opts: [{ uz: "Matn juda uzun bo'lib qoladi", ru: 'Текст станет слишком длинным' }, { uz: "Yopiq ilova yangi e'lonni bilmaydi", ru: 'Закрытое приложение не знает о новом объявлении' }, { uz: "Yangi o'yinlar juda kam bo'ladi", ru: 'Новых игр бывает очень мало' }, { uz: "Bunday matnni telefon ko'rsatmaydi", ru: 'Телефон такой текст не покажет' }], correct: 1 },
  { q: { uz: "Mentor misolida shu hafta ikkita o'yin eslatmasi bor. Uch kunlik eslatma-chi?", ru: 'В примере Ментора на этой неделе два напоминания об игре. А трёхдневное?' }, opts: [{ uz: "Baribir qo'yiladi — uchinchi bo'lib", ru: 'Всё равно ставится — третьим' }, { uz: "O'yin eslatmasining o'rniga qo'yiladi", ru: 'Ставится вместо напоминания об игре' }, { uz: "Bu hafta u umuman qo'yilmaydi", ru: 'На этой неделе оно вообще не ставится' }, { uz: "Ikki marta qo'yiladi — har o'yinga", ru: 'Ставится дважды — к каждой игре' }], correct: 2 },
  { q: { uz: "Foydalanuvchi «Eslatmalar»ni o'chirsa, nima bo'ladi?", ru: "Что будет, если пользователь выключит «Напоминания»?" }, opts: [{ uz: "Ilova telefondan ruxsatni qayta so'raydi", ru: 'Приложение снова попросит разрешение у телефона' }, { uz: "Faqat ertangi kungi eslatma o'z joyida qoladi", ru: 'Останется только напоминание на завтра' }, { uz: "Ilova hisobdan o'zi chiqib, yopiladi", ru: 'Приложение само выйдет из аккаунта и закроется' }, { uz: "Rejalashtirilgan eslatmalar bekor bo'ladi", ru: 'Запланированные напоминания отменятся' }], correct: 3 },
  { q: { uz: 'Test holati nima uchun kerak?', ru: 'Зачем нужен тестовый режим?' }, opts: [{ uz: "Eslatmani bir daqiqada ko'rib tekshirish uchun", ru: 'Чтобы увидеть и проверить напоминание через минуту' }, { uz: 'Eslatmani foydalanuvchilarga tezroq yuborish uchun', ru: 'Чтобы быстрее отправить напоминание пользователям' }, { uz: 'Haftalik chegarani butunlay olib tashlash uchun', ru: 'Чтобы совсем убрать недельный предел' }, { uz: "Ruxsat so'raydigan oynani o'chirib qo'yish uchun", ru: 'Чтобы отключить окно запроса разрешения' }], correct: 0 },
  { q: { uz: 'Mentor misolida `eslatmadan-ochdi` qachon yoziladi?', ru: 'Когда в примере Ментора записывается `eslatmadan-ochdi`?' }, opts: [{ uz: 'Eslatma telefon ekraniga chiqqanda', ru: 'Когда напоминание появилось на экране телефона' }, { uz: 'Eslatma bosilib ilova ochilganda', ru: 'Когда по напоминанию нажали и приложение открылось' }, { uz: 'Ilova eslatmani rejalashtirganda', ru: 'Когда приложение запланировало напоминание' }, { uz: "Eslatma o'yindan oldin bekor bo'lganda", ru: 'Когда напоминание отменилось до игры' }], correct: 1 },
  { q: { uz: "Sinfda eslatmani o'zingiz bosib tekshirdingiz. Bu yozuv nima bo'ladi?", ru: 'В классе вы сами нажали на напоминание для проверки. Что будет с этой записью?' }, opts: [{ uz: "Haqiqiy foydalanuvchi bo'lib sanaladi", ru: 'Посчитается как настоящий пользователь' }, { uz: "Tekshiruv bo'lgani uchun yozilmaydi", ru: 'Не запишется, потому что это проверка' }, { uz: "Tekshirgach, sanoqdan o'chiriladi", ru: 'После проверки удаляется из подсчёта' }, { uz: "Ikki qurilma bo'lib sanoqda qoladi", ru: 'Останется в подсчёте как два устройства' }], correct: 2 },
  { q: { uz: "Ilova o'zgardi. Eski APK o'rnatganlarda bugungi eslatma bormi?", ru: "Приложение изменилось. Есть ли сегодняшнее напоминание у тех, кто установил старый APK?" }, opts: [{ uz: "Bor — APK o'zi yangilanib qoladi", ru: 'Есть — APK обновится сам' }, { uz: "Yo'q — eslatma faqat iPhone'da ishlaydi", ru: 'Нет — напоминание работает только на iPhone' }, { uz: 'Bor — Render yangi versiyani yuboradi', ru: 'Есть — Render отправит новую версию' }, { uz: "Yo'q — yangi faylni o'rnatishlari kerak", ru: 'Нет — нужно установить новый файл' }], correct: 3 },
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4; tayanch 4) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok 4 band (1 · Ochish → 2 · Prompt → 3 · Ishga tushirish → 4 · Tekshirish), hammasi o'quvchining o'z repo'sida (5-band yo'q).
// steps [{ h, t, bandlar?, vazifa?, prompt?: { satrlar, joylar? }, yordam?, err? }]. Talab zinapoyasi (9-dars): uchala blokda uch qatorni o'quvchi yozadi, namuna «Yordam» ortida.
// Qolipda yo'q (qolip taklifi): yoziladigan {…} joyi, «Vazifa:» qatori, band ichidagi «Yordam», «Ulgurmasangiz» qatori, trek tugmalari, blok ostidagi tanlov — shu faylda.
// Blok bajarilgani — faqat 4-band «Bajardim»idan (tayanch 9.36 h); «Davom etish» 3-band «Bajardim»idan keyin ochiladi (E 55), bayroq qo'yilmaydi.
// Holat shu darsning ccProgress javobida (band · joy — o'z nomi bilan, E 51); yangi saqlash kaliti yo'q (tayanch 4, 8: 9-dars faqat o'qiydi).
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const TREK_KALIT = 'pm-m9d8-platforma';
const trekOqi = () => { const o = lsOqi(TREK_KALIT); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
const trekYoz = (t) => { try { const o = lsOqi(TREK_KALIT) || {}; localStorage.setItem(TREK_KALIT, JSON.stringify({ ...o, trek: t })); } catch { /* xotira yopiq */ } };
const useTrek = (tugmali) => {
  const [trek, setTrek] = useState(trekOqi);
  const tanla = (t) => { trekYoz(t); setTrek(t); };
  const tugmalar = tugmali && !trek && <div className="qs-trek"><span>{tr({ uz: 'Trekingiz:', ru: 'Ваш трек:' })}</span><div className="qs-chorla qs-trek-g"><QChip onClick={() => tanla('mobil')}>{tr({ uz: 'Mobil trek', ru: 'Мобильный трек' })}</QChip><QChip onClick={() => tanla('web')}>{tr({ uz: 'Web-trek', ru: 'Веб-трек' })}</QChip></div></div>;
  return [trek, tugmalar];
};
// 8-darsdagi qadamlar (pm-m10d8-qadamlar — tayanch 8: { tur, qadamlar: [{ id, nom, soni }], sana }); kalit yozilmaydi
const QADAM_KALIT = 'pm-m10d8-qadamlar';
const qadamlarOqi = () => {
  const o = lsOqi(QADAM_KALIT);
  if (!o || !Array.isArray(o.qadamlar)) return null;
  const q = o.qadamlar.filter(x => x && String(x.nom || '').trim()).map(x => ({ nom: String(x.nom).trim(), soni: x.soni }));
  if (!q.length) return null;
  const sana = typeof o.sana === 'string' ? o.sana.slice(0, 10) : '';
  return { tur: o.tur === 'mashq' ? 'mashq' : 'real', qadamlar: q, sana };
};
// Yoziladigan joy — avtomatik o'sadigan textarea; bo'sh joy uzuq chiziqli (U-041), navbatdagisi halqada
const JoyMaydon = ({ qiymat, joy, onYoz, blok, faol }) => (
  <textarea className={cx('qs-joy-i', blok && 'blok', !String(qiymat || '').trim() && 'bosh', faol && 'qs-halqa-i')} rows={1} value={qiymat || ''} placeholder={joy}
    onChange={(e) => onYoz(e.target.value)}
    ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }} />
);
// Prompt: satrlar [{ t } — tayyor qator | { l, joy } — yorliq + butun qator joyi]; joylar [{ k }] · qiymat / onYoz — ScreenBlok holatidan.
// QBlok band matni <p> ichida chiziladi — shu sabab o'rovchi faqat span / textarea (A to'lqindan saboq).
const QsPrompt = ({ satrlar, joylar = [], qiymat = {}, onYoz }) => {
  const [ok, setOk] = useState(false);
  const jd = {}; joylar.forEach(j => { jd[tr(j.k)] = j; });
  const kalitlar = joylar.map(j => tr(j.k));
  const toliq = kalitlar.every(k => String(qiymat[k] || '').trim());
  const birinchiBosh = kalitlar.find(k => !String(qiymat[k] || '').trim());
  const qatorMatn = (s) => (s.l ? `${tr(s.l)} ${String(qiymat[tr(s.joy)] || '').trim()}` : tr(s.t));
  const nusxa = async () => { if (!toliq) return; try { await navigator.clipboard.writeText(satrlar.map(qatorMatn).join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  const qator = (s, i) => {
    if (s.l) { const k = tr(s.joy); return <span key={i} className="qs-ps qs-ps-l"><b className="qs-ps-y">{tr(s.l)}</b><JoyMaydon qiymat={qiymat[k]} joy={k} blok faol={k === birinchiBosh} onYoz={(v) => onYoz(k, v)} /></span>; }
    return <span key={i} className="qs-ps">{tx(s.t)}</span>;
  };
  return (
    <span className="q-prompt qs-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa" disabled={!toliq} onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {satrlar.map(qator)}
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <>
      <QTugma ikkinchi className="qs-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
      {ochiq && <span className="qs-yordam fade-step">{satrlar.map((l, i) => <span key={i} className={cx('qs-yordam-s', l.web && 'web')}>{tx(l)}</span>)}</span>}
    </>
  );
};
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'cd maydon-jamoa', 'git checkout -f m12-dars-09-done'];
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
const XATO_GAP = { uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: "Если появилась ошибка — отправьте агенту строку ошибки (не значения `.env`, не токен и не ключи): «Вышла такая ошибка: {ошибка}. Исправь.»" };
const P_Q = { uz: '{qayerda}', ru: '{где}' };
const P_N = { uz: '{nima qilsin}', ru: '{что сделать}' };
const P_B = { uz: '{nima buzilmasin}', ru: '{что не сломать}' };
const P_JOYLAR = [{ k: P_Q }, { k: P_N }, { k: P_B }];
const P_SATRLAR = [
  { l: { uz: 'Qayerda:', ru: 'Где:' }, joy: P_Q },
  { l: { uz: 'Nima qilsin:', ru: 'Что сделать:' }, joy: P_N },
  { l: { uz: 'Nima buzilmasin:', ru: 'Что не сломать:' }, joy: P_B },
  { t: { uz: "Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Больше ничего не трогай, назови изменённые файлы.' } }
];
const P_BAND = { uz: "uch qatorni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'напишите три строки сами, нажмите «Скопировать» и отправьте в Antigravity:' };
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, ulgur, ulgurQadam = 3, ustida, osti }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : Math.min(Number(storedAnswer && storedAnswer.qadam) || 0, steps.length - 1)));
  const [joy, setJoy] = useState(() => ({ ...((storedAnswer && storedAnswer.joy) || {}) }));
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam;
  const yechim = (j) => ({ ...(storedAnswer || {}), stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, joy: j });
  const saqla = (n, j) => { if (n >= steps.length) onAnswer(screen, yechim(j)); else onAnswer(screen, { qadam: n, joy: j }); };
  const bajardim = () => {
    if (isMentorLive || done) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, yechim(joy));
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    } else if (n < steps.length) saqla(n, joy);
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); saqla(i, joy); };
  const yoz = (k, v) => { const j = { ...joy, [k]: v }; setJoy(j); saqla(done ? steps.length : stepN, j); };
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, bandlar orasida keyingi band, blok tugagach «Davom etish» («qadam» so'zi — faqat foydalanuvchi yo'li, A-bo'lim 5)
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi bo'lim — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий раздел — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? DAVOM : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<><Mentor>{tr(mGap)}</Mentor>{ustida}</>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: <>{tx(c.t)}{c.bandlar && c.bandlar.map((b, i) => (b.prompt
            ? <QsPrompt key={i} satrlar={b.prompt} />
            : <span key={i} className="qs-band">{tx(b)}</span>))}{c.vazifa && <span className="qs-vazifa"><b>{tr({ uz: 'Vazifa:', ru: 'Задача:' })}</b> {tx(c.vazifa)}</span>}{c.prompt && <QsPrompt satrlar={c.prompt.satrlar} joylar={c.prompt.joylar} qiymat={joy} onYoz={yoz} />}</>,
          xato: c.yordam ? <>{c.err && <span className="qs-band">{tx(c.err)}</span>}<Yordam satrlar={c.yordam} /></> : (c.err && tx(c.err))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
        pastki={<MentorPracticeStats live={_live} screen={screen} />}>
        {done && osti}
        {ulgur && !done && <p className="qs-ulgur">{tx(ulgur)}</p>}
        {ortda && <p className="qs-ortda">{tr({ uz: "Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring:", ru: "Отстали? Откройте пример Ментора в отдельной папке:" })} <code className="qs-buyruq">{ORTDA[0]}</code> · <code className="qs-buyruq">{ORTDA[1]}</code> · <code className="qs-buyruq">{ORTDA[2]}</code> {tx(ortda)}</p>}
      </QBlok>
    </Stage>
  );
}
// Brauzer oynasi — web-trek va sanoq sahifasi maketi
const Brauzer = ({ manzil = '….netlify.app', children, nomsiz }) => <div className="qs-brauzer"><span className="qs-br-bar"><i /><i /><i /><code>{manzil}</code></span><div className="qs-br-tana">{!nomsiz && <span className="qs-tel-nom">{QAYTISH_SAHNA.nom}</span>}{children}</div></div>;
const SIZ_YOQ = { uz: "Siz yo'q paytingizda: 2 ta o'yiningizda o'zgarish bo'ldi", ru: 'Пока вас не было: в 2 ваших играх были изменения' };
const QADAM_NOMLARI = [{ uz: 'ochdi', ru: 'открыл' }, { uz: "ro'yxatdan o'tdi", ru: 'зарегистрировался' }, { uz: "qo'shildi", ru: 'присоединился' }, { uz: 'kelishini tasdiqladi', ru: 'подтвердил приход' }];
// A1 kutilgan natija: «O'yinlar» — kadr 1: 7 / 10 · kadr 2: 8 / 10 va tepada «Shanba, 18:00 — 2 joy qoldi» (bir marta o'zi yuradi)
const NatijaA1 = ({ trek }) => {
  const [f, setF] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1400, () => setF(1)]]); }, []); // eslint-disable-line
  if (trek === 'web') return (
    <div className="qs-natija">
      <Brauzer>{f >= 1 && <span className="qs-br-jonli">{tr(JOY_XABAR)}</span>}
        <b className="qs-br-sar">{tr(QAYTISH_SAHNA.oyinlar)}</b>
        <span className="qs-br-q">{tr(NAMUNA_OYIN.vaqt)} · {tr(NAMUNA_OYIN.joy)} · <b key={f} className={cx(f >= 1 && 'qs-pop')}>{f >= 1 ? 8 : 7}</b> / 10</span>
        <b className="qs-br-sar kichik">{tr({ uz: 'Xabarlar', ru: 'Xabarlar' })}</b>
        <span className="qs-tasma">{f >= 1 && <span className="qs-tasma-q yangi">{tr(JOY_XABAR)}</span>}</span>
      </Brauzer>
    </div>
  );
  return <div className="qs-natija"><Telefon t={{ tex: 'Expo Go', kor: 'oyinlar', belgi: 'ulangan', son: f >= 1 ? 8 : 7, sonYangi: f >= 1, jonli: f >= 1 ? JOY_XABAR : null }} /></div>;
};
// A2 kutilgan natija: qulf ekrani, «test holati: bir daqiqa» — uch kunlik eslatma tushadi; web — «Siz yo'q paytingizda» qatori
const NatijaA2 = ({ trek }) => {
  const [f, setF] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1300, () => setF(1)]]); }, []); // eslint-disable-line
  if (trek === 'web') return (
    <div className="qs-natija">
      <Brauzer><b className="qs-br-sar">{tr({ uz: 'Xabarlar', ru: 'Xabarlar' })}</b>
        {f >= 1 && <span className="qs-siz-yoq">{tr(SIZ_YOQ)}</span>}
        <span className="qs-tasma"><span className="qs-tasma-q">{tr(NAMUNA_OYIN.vaqt)} · {tr(NAMUNA_OYIN.joy)}</span></span>
      </Brauzer>
    </div>
  );
  return <div className="qs-natija"><Telefon t={{ tex: tr({ uz: 'test holati: bir daqiqa', ru: 'тестовый режим: одна минута' }), kor: 'qulf', kartalar: f >= 1 ? [{ id: 'u', matn: UCH_KUNLIK }] : [] }} /></div>;
};
// A3 kutilgan natija: telefon — eslatma bosiladi → «O'yinlar», «Hisobdan chiqish» yonida «Eslatmalar» sozlamasi; sanoq sahifasi — yangi qator yashil yonadi
const NatijaA3 = ({ trek }) => {
  const [f, setF] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1200, () => setF(1)], [600, () => setF(2)], [900, () => setF(3)]]); }, []); // eslint-disable-line
  const web = trek === 'web';
  const sanoq = (
    <Brauzer manzil="…/sanoq.html" nomsiz>
      <span className="qs-sanoq">
        {QADAM_NOMLARI.map((q, i) => <span key={i} className="qs-sanoq-r"><span>{tr(q)}</span><i /></span>)}
        {f >= 3 && <span className="qs-sanoq-r yangi"><span>{web ? tr({ uz: 'xabardan ochdi', ru: "открыл из сообщения" }) : tr({ uz: 'eslatmadan ochdi', ru: 'открыл из напоминания' })}</span><b>{tr({ uz: '1 qurilma', ru: '1 устройство' })}</b></span>}
      </span>
      {f >= 3 && !web && <em className="qs-sanoq-y fade-step">{tr({ uz: "Mentorning o'z telefoni — tekshiruv; keyin o'chiriladi", ru: "Телефон самого Ментора — проверка; потом удаляется" })}</em>}
    </Brauzer>
  );
  return (
    <div className="qs-natija">
      {web
        ? <Brauzer><span className={cx('qs-siz-yoq', f >= 1 && 'bosildi')}>{tr(SIZ_YOQ)}</span><span className="qs-soz-q web"><span>{tr({ uz: 'Xabarlar', ru: 'Xabarlar' })}</span><i className="qs-soz-sw on" aria-hidden="true" /></span></Brauzer>
        : <Telefon t={f >= 2 ? { tex: 'Expo Go', kor: 'oyinlar', belgi: 'ulangan', son: 8, sozlama: true } : { tex: 'Expo Go', kor: 'qulf', kartalar: [{ id: 'u', matn: UCH_KUNLIK, bosildi: f >= 1 }] }} />}
      {sanoq}
    </div>
  );
};

// ===== SCREEN 3 — AMALIYOT 1 · jonli xabar (ilova ochiq): uch qatorni o'quvchi yozadi, Mentor namunasi «Yordam» ortida =====
const A1_YORDAM = [
  { uz: "Qayerda: `mobil/` — jonli xabarlar (4-darsda qurilgan joy) va «O'yinlar» ekrani.", ru: "Где: `mobil/` — живые сообщения (место, построенное на 4-м уроке) и экран «O'yinlar» («Игры»)." },
  { uz: "Nima qilsin: `oyin-ozgardi` kelib, ilova `GET /oyinlar` ni qayta so'ragach, o'yinchi qo'shilmagan o'yinda bir yoki ikki joy qolgan bo'lsa, jonli xabar chiqsin: «{kun}, {soat} — {N} joy qoldi» (masalan, «Shanba, 18:00 — 2 joy qoldi»).", ru: "Что сделать: когда придёт `oyin-ozgardi` и приложение заново запросит `GET /oyinlar`, если в игре, к которой игрок не присоединился, осталось одно или два места, — покажи живое сообщение: «{день}, {время} — осталось {N} места» (например, «Суббота, 18:00 — осталось 2 места»)." },
  { uz: "Joy soni — kerak bo'lganlar minus qo'shilganlar. Yangi hodisa qo'shma: son qayta so'ralgan javobdan olinsin. Ilova ochiq turgan davrda bir o'yinda bir xil son uchun xabar bir marta chiqsin.", ru: "Число мест — сколько нужно минус сколько присоединилось. Новое событие не добавляй: число бери из заново запрошенного ответа. Пока приложение открыто, для одной игры и одного числа сообщение появляется один раз." },
  { uz: "Nima buzilmasin: 4-darsdagi jonli xabarlar (ular faqat menga tegishli o'yin uchun) va «Hozir ko'ryapti» avvalgidek; xabarda ism yo'q; o'yinchining o'z harakati uchun xabar chiqmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: "Что не сломать: живые сообщения 4-го урока (они только для игр, которые касаются меня) и «Hozir ko'ryapti» («Сейчас смотрят») — как раньше; в сообщении нет имени; на собственное действие игрока сообщение не появляется. Больше ничего не трогай, назови изменённые файлы." },
  { web: true, uz: "Web-trekda: «Qayerda» qatorida ilova o'rniga sayt papkangizdagi jonli xabarlar va o'yinlar sahifasi turadi; xabar «Xabarlar» tasmasiga ham tushadi (4-darsdagidek), qolgani o'sha.", ru: 'В веб-треке: в строке «Где» вместо приложения — живые сообщения и страница игр в папке сайта; сообщение попадает и в ленту «Xabarlar» (как на 4-м уроке), остальное то же.' }
];
const ScreenA1 = (props) => {
  const [trek, trekTugma] = useTrek(true);
  // 1-blok: «Davom etish» faqat 4-band «Bajardim»idan keyin — 09-FILTR 39 (ikkala blok bitta kodga tegadi); SABOQ E 55 faqat MD jim bo'lganda
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · ilova ochiq', ru: 'Практика 1 · приложение открыто' }}
      title={{ uz: <>Ilova ochiq paytda <span className="italic" style={{ color: T.accent }}>foydali jonli xabar</span> chiqsin.</>, ru: <>Пусть появится <span className="italic" style={{ color: T.accent }}>полезное живое сообщение</span>.</> }}
      mentor={{ uz: "Talabni uch qatorda o'zingiz yozasiz, Mentor namunasi «Yordam» ortida; «1 · Ochish»dan boshlang.", ru: "Требование вы пишете сами в три строки, образец Ментора — в «Подсказке»; начните с «1 · Открыть»." }}
      ustida={trekTugma}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da o'z repo'ngizni oching — 8-darsda to'xtagan joyingizdan. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin. Mobil trekda `npx expo start` ishlab tursin, ilova telefoningizda ochiq bo'lsin; web-trekda saytingiz ochiq tursin.", ru: 'Откройте свой репозиторий в Antigravity — с места, где остановились на 8-м уроке. В терминале `git status`: файлов `.env` в списке быть не должно. В мобильном треке пусть работает `npx expo start` и приложение открыто на телефоне; в веб-треке пусть открыт сайт.' },
          bandlar: [
            { uz: "Ikki savolga javob toping: ilova ochiq turganda foydalanuvchi qaysi o'zgarishni bilsa, biror ish qiladi? Xabarda nima yoziladi? (Mentor misolida: o'zi qo'shilmagan o'yinda bir yoki ikki joy qolsa — «Shanba, 18:00 — 2 joy qoldi».)", ru: "Найдите ответы на два вопроса: о каком изменении пользователю важно узнать при открытом приложении, чтобы он что-то сделал? Что написать в сообщении? (В примере Ментора: если в игре, к которой он не присоединился, осталось одно или два места, — «Суббота, 18:00 — осталось 2 места».)" },
            { uz: "Mahsulotingizda shunday o'zgarish bo'lmasa — 4-darsdagi jonli xabarlaringizdan birini foydaliroq qiling: matni foydalanuvchiga keyin nima qilishini aytsin.", ru: 'Если в вашем продукте такого изменения нет — сделайте полезнее одно из живых сообщений 4-го урока: пусть текст говорит пользователю, что делать дальше.' }
          ] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: P_BAND,
          vazifa: { uz: "Ilova ochiq turganda foydalanuvchi o'zi uchun foydali o'zgarishni jonli xabarda ko'radi — ism yo'q, o'z harakati uchun emas.", ru: 'При открытом приложении пользователь видит в живом сообщении полезное для себя изменение — без имени, не на своё действие.' },
          prompt: { satrlar: P_SATRLAR, joylar: P_JOYLAR }, yordam: trek === 'mobil' ? A1_YORDAM.filter(l => !l.web) : A1_YORDAM },
        { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"jonli xabar: joy qoldi\"`, `git push`.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают с тем, что сказал агент, `.env` нет; добавьте каждый файл через `git add <fayl>`, `git commit -m "jonli xabar: joy qoldi"`, `git push`.' },
          bandlar: [{ uz: "Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`). Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.", ru: 'В мобильном треке Expo Go обычно сам перезагружает приложение (если нет — `r` в терминале). В веб-треке после push Netlify обычно сам обновляет сайт.' }],
          err: XATO_GAP },
        { h: { uz: 'Tekshirish', ru: 'Проверка' }, t: { uz: "talabingizning har qatorini ko'ring:", ru: 'проверьте каждую строку требования:' },
          bandlar: [
            { uz: "(1) Ilovangiz ochiq tursin. O'zgarishni boshqa akkaunt qilsin: sherigingiz o'z akkauntidan — ilovangiz o'rnatilgan telefonida yoki brauzer ko'rinishida (web-trekda — kompyuterdagi ikkinchi oynada, ikkinchi akkaunt bilan).", ru: "(1) Пусть ваше приложение будет открыто. Изменение пусть сделает другой аккаунт: партнёр со своего аккаунта — на своём телефоне с вашим приложением или в браузерной версии (в веб-треке — во втором окне на компьютере, со вторым аккаунтом)." },
            { uz: "Sherik bo'lmasa — agent: tekshiruv akkauntlari ochadi (namuna ma'lumot bilan, `namuna = true`), ular nomidan so'rov yuboradi va qaysi akkaunt, qaysi `id` ekanini aytadi.", ru: "Если партнёра нет — агент: открывает проверочные аккаунты (с данными-образцами, `namuna = true`), отправляет запросы от их имени и говорит, какой аккаунт и какой `id`." },
            { uz: "Mentor misolida: siz qo'shilmagan, uch joy qolgan o'yin kerak — sherik unga qo'shiladi. Bunday o'yin bo'lmasa, agentga: «Men qo'shilmagan bitta o'yinni tanla. Tekshiruv uchun yangi akkauntlar och (namuna ism va login bilan, haqiqiy emas, `namuna = true`) va ular nomidan qo'shilish so'rovlarini bittadan yubor, uch joy qolganda to'xta. Qaysi akkauntlar va qaysi o'yin `id` si ekanini ayt.» Sherik bo'lmasa — «ikki joy qolganda to'xta».", ru: "В примере Ментора: нужна игра, к которой вы не присоединились и где осталось три места, — партнёр присоединяется к ней. Если такой игры нет, агенту: «Выбери одну игру, к которой я не присоединился. Открой для проверки новые аккаунты (с именем и логином-образцом, не настоящими, `namuna = true`) и по одному отправь от их имени запросы на присоединение, остановись, когда останется три места. Скажи, какие аккаунты и какой `id` игры.» Если партнёра нет — «остановись, когда останется два места»." },
            { uz: "Telefoningizda son o'zgarishi va jonli xabar chiqishi kerak. Chiqmasa — nima kutganingiz va nima ko'rganingizni agentga yozing.", ru: 'На вашем телефоне должно измениться число и появиться живое сообщение. Если нет — напишите агенту, что вы ожидали и что увидели.' },
            { uz: "(2) «Nima buzilmasin» qatoringizni tekshiring (Mentor misolida: shu o'yinga o'zingiz qo'shiling — sizga xabar chiqmasligi kerak).", ru: '(2) Проверьте свою строку «Что не сломать» (в примере Ментора: сами присоединитесь к этой игре — вам сообщение появиться не должно).' },
            { uz: "(3) Agent tekshiruv akkauntlari ochgan bo'lsa — agentga: «Faqat hozir yaratgan tekshiruv akkauntlari va yozuvlarini — aytgan `id` laring bo'yicha — o'chir.» Agentning «bajardim» degani — uning so'zi; xabarni esa o'zingiz ko'rdingiz.", ru: "(3) Если агент открывал проверочные аккаунты — агенту: «Удали только что созданные проверочные аккаунты и записи — по названным тобой `id`.» Агент пишет «сделал» — это его слова; а сообщение вы видели сами." }
          ] }
      ]}
      natija={<NatijaA1 trek={trek} />}
      doneText={{ uz: "Ilova ochiq turganda foydalanuvchi o'zi uchun foydali o'zgarishni ko'radi.", ru: 'При открытом приложении пользователь видит полезное для себя изменение.' }}
      ulgurQadam={4}
      ulgur={{ uz: "Ulgurmasangiz: tekshiruv akkauntlarini o'chirishni dars oxiriga qoldiring. Xabar chiqishini o'zingiz ko'rmasdan 2-amaliyotga o'tmang — keyin qaysi o'zgarish buzganini ajratish qiyin bo'ladi.", ru: 'Если не успеваете: удаление проверочных аккаунтов оставьте на конец урока. Не переходите ко 2-й практике, пока сами не увидели сообщение, — потом трудно понять, какое изменение сломало.' }}
      ortda={{ uz: "(faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz, o'z repo'ngizdagi ishni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).", ru: '(только в этой новой папке — команда удаляет изменения в папке) — увидите, как это работает, и по образцу повторите работу в своём репозитории (в `backend/.env` и `mobil/.env` впишете свои значения).' }}
    />
  );
};

// ===== SCREEN 6 — AMALIYOT 2 · ilova yopiq paytdagi eslatma (web-trekda — «Siz yo'q paytingizda» qatori) =====
const A2_YORDAM = [
  { uz: "Qayerda: `mobil/` — eslatmalar (4-darsda `expo-notifications` qo'shilgan joy) va ilova ochiladigan joy.", ru: 'Где: `mobil/` — напоминания (место, где на 4-м уроке добавили `expo-notifications`) и место, где открывается приложение.' },
  { uz: "Nima qilsin: ilova har ochilganda oldingi uch kunlik eslatma bekor qilinsin va yangisi uch kundan keyin soat 17:00 ga qo'yilsin: sarlavha «Maydon Jamoa», matn «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring». Faqat hisobga kirgan foydalanuvchiga qo'yilsin.", ru: "Что сделать: при каждом открытии приложения прежнее трёхдневное напоминание отменяется, а новое ставится через три дня на 17:00: заголовок «Maydon Jamoa», текст «Есть игра на выходных? Посмотрите объявления». Ставить только пользователю, вошедшему в аккаунт." },
  { uz: "Haftalik chegara: o'sha haftada (dushanbadan yakshanbagacha) ilovaning ikkita eslatmasi bo'lsa — o'yin eslatmasi ham sanalsin — uch kunlik eslatma qo'yilmasin. O'yinga qo'shilgan yoki o'yindan chiqqandan keyin ham shuni qayta hisobla.", ru: 'Недельный предел: если на той неделе (с понедельника по воскресенье) у приложения уже два напоминания — считается и напоминание об игре, — трёхдневное не ставить. После присоединения к игре или выхода из неё тоже пересчитай.' },
  { uz: "Qo'yilgan eslatmalarning vaqti telefonda saqlansin — hisob shundan olinsin.", ru: 'Время поставленных напоминаний хранится на телефоне — подсчёт берётся оттуда.' },
  { uz: "Nima buzilmasin: 4-darsdagi o'yin eslatmasi va ruxsat so'rash avvalgidek; hisobdan chiqilganda bu eslatma ham bekor bo'lsin; brauzer ko'rinishida eslatma qo'yilmasin, u yerda ilova ishlayversin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: "Что не сломать: напоминание об игре из 4-го урока и запрос разрешения — как раньше; при выходе из аккаунта это напоминание тоже отменяется; в браузерной версии напоминание не ставится, приложение там работает дальше. Больше ничего не трогай, назови изменённые файлы." },
  { web: true, uz: "Web-trekda: «Qayerda» — sayt papkangizdagi «Xabarlar» tasmasi va o'yinlar sahifasi (Backend o'zgarmaydi); «Nima qilsin» — sayt o'zingizga tegishli o'yinlarning oxirgi ko'rsatilgan holatini (qo'shilganlar soni va sizning holatingiz) brauzerda saqlasin; keyingi ochilishda yangi javobni saqlangani bilan solishtirsin va tasma tepasida bitta qator ko'rsatsin: «Siz yo'q paytingizda: {N} ta o'yiningizda o'zgarish bo'ldi»; farq bo'lmasa — qator chiqmasin.", ru: "В веб-треке: «Где» — лента «Xabarlar» и страница игр в папке сайта (Backend не меняется); «Что сделать» — сайт сохраняет в браузере последнее показанное состояние ваших игр (число присоединившихся и ваш статус); при следующем открытии сравнивает новый ответ с сохранённым и показывает над лентой одну строку: «Пока вас не было: в {N} ваших играх были изменения»; если разницы нет — строки нет." }
];
// 3-band (3): agent haftalik chegara qatorini ko'rsatadi (E 52 — real prompt; kod o'zgarmaydi)
const A2_KOD_PROMPT = [
  { t: { uz: "Yozgan fayllaringda haftalik chegarani tekshiradigan qatorni fayl nomi va qator raqami bilan ko'rsat.", ru: 'В написанных файлах покажи строку, которая проверяет недельный предел, с именем файла и номером строки.' } },
  { t: { uz: "Kodni o'zgartirma.", ru: 'Код не меняй.' } }
];
const ScreenA2 = (props) => {
  const [trek] = useTrek(false);
  const web = trek === 'web';
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · ilova yopiq', ru: 'Практика 2 · приложение закрыто' }}
      title={{ uz: <>Ilova yopiq bo'lsa ham <span className="italic" style={{ color: T.accent }}>foydali eslatma</span> chiqsin.</>, ru: <>Пусть придёт <span className="italic" style={{ color: T.accent }}>полезное напоминание</span>.</> }}
      mentor={{ uz: "Eslatma matnini uch katak bilan o'zingiz tekshirib yozing; «1 · Ochish»dan boshlang.", ru: "Текст напоминания напишите сами, проверив тремя клетками; начните с «1 · Открыть»." }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "o'z repo'ngiz, 1-amaliyotdan keyingi kod. 4-darsdagi eslatma qayerda qo'yilganini agentdan so'rang yoki faylni oching. Ikki savolga javob toping: ilovani bir necha kun ochmagan foydalanuvchiga nima foydali? Ilova buni oldindan biladimi?", ru: 'ваш репозиторий, код после 1-й практики. Спросите у агента, где ставится напоминание 4-го урока, или откройте файл. Найдите ответы на два вопроса: что полезно пользователю, который несколько дней не открывал приложение? Знает ли это приложение заранее?' },
          bandlar: [
            { uz: "Matningizni oldingi mashqdagi uch katak bilan tekshiring. Mentor misolida bitta eslatma: ilova oxirgi ochilgandan uch kun o'tib, soat 17:00 da — «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring».", ru: "Проверьте свой текст тремя клетками из прошлого упражнения. В примере Ментора одно напоминание: через три дня после последнего открытия приложения, в 17:00, — «Есть игра на выходных? Посмотрите объявления»." },
            { uz: "U ilovani uch kun ochmagan odamga chiqadi: har kuni ochadigan odamga umuman chiqmaydi.", ru: 'Оно приходит тому, кто три дня не открывал приложение: тому, кто открывает каждый день, не приходит вовсе.' },
            { uz: "Haftalik chegara: shu haftada (dushanbadan yakshanbagacha) ilovaning ikkita eslatmasi bo'lsa — 4-darsdagi o'yin eslatmasi ham sanaladi — bu eslatma qo'yilmaydi.", ru: 'Недельный предел: если на этой неделе (с понедельника по воскресенье) у приложения два напоминания — считается и напоминание об игре из 4-го урока, — это напоминание не ставится.' },
            { uz: "Mahsulotingizda foydalanuvchining vaqti ma'lum ishi bo'lsa (masalan, topshirish muddati) — eslatmani shunga bog'lash mumkin; bo'lmasa — Mentor misolidagidek: bir necha kun ochilmaganda, taklif shaklida.", ru: 'Если в вашем продукте у пользователя есть дело с известным временем (например, срок сдачи) — напоминание можно привязать к нему; если нет — как в примере Ментора: когда несколько дней не открывали, в виде предложения.' },
            { uz: "Web-trekda: sayt yopiq bo'lsa, xabar kelmaydi — brauzer eslatmasi alohida sozlashni talab qiladi. Bugun sahifa ochilganda «Xabarlar» tasmasi tepasida «Siz yo'q paytingizda: …» qatori quriladi.", ru: "В веб-треке: если сайт закрыт, сообщение не приходит — напоминанию браузера нужна отдельная настройка. Сегодня при открытии страницы над лентой «Xabarlar» строится строка «Пока вас не было: …»." }
          ] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: P_BAND,
          vazifa: { uz: "Ilova o'zi oldindan bitta eslatma qo'yadi — ilovani bir necha kun ochmagan foydalanuvchiga; u ilova bilgan narsani aytadi va hafta ikkitaga to'lgan bo'lsa qo'yilmaydi.", ru: 'Приложение само заранее ставит одно напоминание — пользователю, который несколько дней не открывал приложение; оно говорит то, что приложение знает, и не ставится, если на неделе уже два.' },
          prompt: { satrlar: P_SATRLAR, joylar: P_JOYLAR }, yordam: trek === 'mobil' ? A2_YORDAM.filter(l => !l.web) : A2_YORDAM },
        { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "`git status` → `git add <fayl>` → `git commit -m \"qaytaradigan eslatma\"` → `git push`. Mobil trekda Expo Go'da tekshirasiz — rejalashtirilgan eslatma Expo Go'da ham ishlaydi.", ru: '`git status` → `git add <fayl>` → `git commit -m "qaytaradigan eslatma"` → `git push`. В мобильном треке проверяете в Expo Go — запланированное напоминание работает и в Expo Go.' },
          bandlar: [{ uz: "Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi; Backend o'zgarmagan — Render kutilmaydi.", ru: "В веб-треке после push Netlify обычно сам обновляет сайт; Backend не менялся — Render ждать не нужно." }],
          err: XATO_GAP },
        { h: web ? { uz: 'Tekshirish', ru: 'Проверка' } : { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }, t: { uz: 'test holatida tekshirasiz:', ru: 'проверяете в тестовом режиме:' },
          bandlar: [
            { uz: "(1) Agentga: «Test holati: uch kunlik eslatmani bir daqiqadan keyinga qo'y, haftalik chegarani vaqtincha o'chir. Qaysi qatorlarni o'zgartirganingni ayt.» Ilovani oching va yoping — bugun yopiq holatni tekshirasiz.", ru: '(1) Агенту: «Тестовый режим: поставь трёхдневное напоминание через минуту, временно отключи недельный предел. Скажи, какие строки изменил.» Откройте и закройте приложение — сегодня проверяете закрытое состояние.' },
            { uz: "Bir daqiqadan keyin qulf ekranida eslatma chiqishi kerak. Chiqmasa — ruxsatni tekshiring: ruxsat bermagan bo'lsangiz — telefon sozlamalaridan yoqiladi.", ru: 'Через минуту на экране блокировки должно появиться напоминание. Если нет — проверьте разрешение: если не давали, его включают в настройках телефона.' },
            { uz: "(2) Ilovani ochib yoping va bir daqiqa o'tmasdan yana ochib yoping — eslatma bitta chiqishi kerak, ikkita emas: oldingisi bekor bo'ladi.", ru: "(2) Откройте и закройте приложение, затем, не дожидаясь минуты, снова откройте и закройте — напоминание должно прийти одно, а не два: прежнее отменяется." },
            { uz: "(3) Haftalik chegara bugun telefonda tekshirilmaydi — buning uchun bir hafta kerak. Agentdan qaysi qator buni tekshirishini so'rang va o'sha qatorni o'zingiz o'qing: bu — kodni o'qish, telefondagi tekshiruv emas.", ru: '(3) Недельный предел сегодня на телефоне не проверяется — для этого нужна неделя. Спросите агента, какая строка это проверяет, и прочитайте её сами: это чтение кода, а не проверка на телефоне.' },
            { prompt: A2_KOD_PROMPT },
            { uz: "(4) Agentga: «Test holatini olib tashla: vaqt va haftalik chegara avvalgidek bo'lsin.» `git status` va `git diff` da test holatidan o'zgarish qolmaganini ko'ring; tekshiruvda tuzatilgan joy bo'lsa — `git add <fayl>` → commit → `git push`.", ru: '(4) Агенту: «Убери тестовый режим: время и недельный предел — как раньше.» Посмотрите в `git status` и `git diff`, что от тестового режима изменений не осталось; если при проверке что-то исправляли — `git add <fayl>` → commit → `git push`.' },
            { uz: "Web-trekda: saytingizni yoping; sherigingiz o'z akkauntidan (yoki agent) sizning o'yiningizda o'zgarish qilsin; saytni qayta oching — «Siz yo'q paytingizda» qatorida son bo'lishi kerak. Hech narsa o'zgarmagan bo'lsa — qator chiqmasligi kerak.", ru: "В веб-треке: закройте сайт; партнёр со своего аккаунта (или агент) пусть сделает изменение в вашей игре; откройте сайт снова — в строке «Пока вас не было» должно быть число. Если ничего не менялось — строки быть не должно." }
          ] }
      ]}
      natija={<NatijaA2 trek={trek} />}
      doneText={web
        ? { uz: <>Sayt qayta ochilganda o'zgargan o'yinlaringiz soni ko'rindi.<span className="qs-blok-iz">Qator hozirgi holati oxirgi ko'rganingizdan farq qiladigan o'yinlarni sanaydi — oradagi har o'zgarishni emas.</span></>, ru: <>При повторном открытии сайта было видно число изменившихся игр.<span className="qs-blok-iz">Строка считает игры, чьё текущее состояние отличается от того, что вы видели последним, — а не каждое изменение между ними.</span></> }
        : { uz: <>Ilova yopiq paytda eslatma chiqdi; qayta ochilganda oldingisi bekor bo'ldi.<span className="qs-blok-kul">Haftalik chegara — kodda bor, telefonda tekshirilmagan.</span><span className="qs-blok-iz">Eslatmani ilovaning o'zi qo'ygan: u faqat ilova oxirgi ochilganda bilgan narsani aytadi.</span></>, ru: <>При закрытом приложении напоминание появилось; при повторном открытии прежнее отменилось.<span className="qs-blok-kul">Недельный предел — в коде есть, на телефоне не проверен.</span><span className="qs-blok-iz">Напоминание поставило само приложение: оно говорит только то, что приложение знало при последнем открытии.</span></> }}
      ulgur={{ uz: "Ulgurmasangiz: haftalik chegarani 3-amaliyotdan keyin qo'shing; test holatini olib tashlashni o'tkazib yubormang.", ru: 'Если не успеваете: недельный предел добавьте после 3-й практики; не пропустите удаление тестового режима.' }}
    />
  );
};

// ===== SCREEN 8 — AMALIYOT 3 · sanoq va o'chirgich (tepada pm-m10d8-qadamlar qatori; mobil trekda blok ostida o'rnatish fayli tanlovi) =====
const A3_YORDAM = [
  { uz: "Qayerda: `mobil/` — ilova ochiladigan joy, eslatmalar va «Hisobdan chiqish» turgan joy; `backend/` — `POST /hodisalar` va `GET /hodisalar/sanoq`; `lending/sanoq.html`, `lending/maxfiylik.html`.", ru: "Где: `mobil/` — место, где открывается приложение, напоминания и место с «Hisobdan chiqish» («Выйти из аккаунта»); `backend/` — `POST /hodisalar` и `GET /hodisalar/sanoq`; `lending/sanoq.html`, `lending/maxfiylik.html`." },
  { uz: "Nima qilsin: ilovaning istalgan eslatmasi (o'yin eslatmasi ham, uch kunlik ham) bosilib ilova ochilganda `hodisaYoz('eslatmadan-ochdi')` chaqirilsin — ilova fonda bo'lsa ham, butunlay yopiq bo'lsa ham; bitta bosishga bitta yozuv.", ru: "Что сделать: когда по любому напоминанию приложения (и об игре, и трёхдневному) нажали и приложение открылось, вызывается `hodisaYoz('eslatmadan-ochdi')` — и если приложение было в фоне, и если полностью закрыто; одно нажатие — одна запись." },
  { uz: "`POST /hodisalar` qabul qiladigan nomlarga `eslatmadan-ochdi` qo'shilsin. `GET /hodisalar/sanoq` javobiga va sanoq sahifasiga qadamlar ostida yangi qator: «eslatmadan ochdi» — turli qurilmalar soni.", ru: "В имена, которые принимает `POST /hodisalar`, добавь `eslatmadan-ochdi`. В ответ `GET /hodisalar/sanoq` и на страницу подсчёта под шагами — новая строка: «eslatmadan ochdi» («открыл из напоминания») — число разных устройств." },
  { uz: "«Hisobdan chiqish» yonida «Eslatmalar» o'chirgichi bo'lsin — sozlama ko'rinishida, chiqish tugmasidan ajralib tursin; sukutda yoqiq, tanlov telefonda saqlansin. O'chirilsa — rejalashtirilgan hamma eslatma bekor qilinsin va yangisi qo'yilmasin.", ru: "Рядом с «Hisobdan chiqish» — переключатель «Eslatmalar» («Напоминания») в виде настройки, отдельно от кнопки выхода; по умолчанию включён, выбор хранится на телефоне. Если выключить — все запланированные напоминания отменяются и новые не ставятся." },
  { uz: "Yoqilsa — hozirgi ma'lumotdan kerakli eslatmalar qaytadan qo'yilsin: men qo'shilgan, hali boshlanmagan o'yinlar uchun o'yin eslatmasi (bir soatdan kam qolgan bo'lsa — yo'q) va uch kunlik eslatma; o'tib ketgan o'yin uchun qo'yilmasin.", ru: 'Если включить — нужные напоминания заново ставятся по текущим данным: напоминание об игре для ещё не начавшихся игр, к которым я присоединился (если осталось меньше часа — нет), и трёхдневное; для прошедшей игры не ставить.' },
  { uz: "Telefonda eslatmalarga ruxsat berilmagan bo'lsa, o'chirgich ostida qator chiqsin: «Telefon sozlamalarida eslatmalarga ruxsat berilmagan».", ru: "Если на телефоне не дано разрешение на напоминания, под переключателем появляется строка: «В настройках телефона нет разрешения на напоминания»." },
  { uz: "`lending/maxfiylik.html` dagi «qaysi ma'lumot» javobiga bitta gap qo'sh: «Ilova eslatmadan ochilgani ham qurilma ID bilan sanaladi.»", ru: 'В ответ «какие данные» в `lending/maxfiylik.html` добавь одну фразу: «Открытие приложения из напоминания тоже считается по ID устройства.»' },
  { uz: "Nima buzilmasin: to'rt qadam sanog'i avvalgidek; sanoq sahifasi faqat kalit bilan ochilsin; sanoq yozuvida ism, login va token bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: подсчёт четырёх шагов — как раньше; страница подсчёта открывается только с ключом; в записи подсчёта нет имени, логина и токена. Больше ничего не трогай, назови изменённые файлы.' },
  { web: true, uz: "Web-trekda: nom `xabardan-ochdi` — faqat «Siz yo'q paytingizda» qatori bosilib o'yin ochilganda; o'chirgich «Xabarlar» — o'chirilsa qator chiqmaydi, tanlov brauzerda saqlanadi; qolgani o'sha.", ru: "В веб-треке: имя `xabardan-ochdi` — только когда нажали строку «Пока вас не было» и открылась игра; переключатель «Xabarlar» — если выключить, строки нет, выбор хранится в браузере; остальное то же." }
];
// 3-band: agent o'chirgich qatorini ko'rsatadi (E 52 — real prompt; kod o'zgarmaydi)
const A3_KOD_PROMPT = [
  { t: { uz: "Yozgan fayllaringda o'chirgich eslatmalarni bekor qiladigan qatorni fayl nomi va qator raqami bilan ko'rsat.", ru: 'В написанных файлах покажи строку, где переключатель отменяет напоминания, с именем файла и номером строки.' } },
  { t: { uz: "Kodni o'zgartirma.", ru: 'Код не меняй.' } }
];
const QadamlarQatori = () => {
  const d = useMemo(qadamlarOqi, []);
  if (!d) return <p className="qs-qadamlar">{tr({ uz: "8-darsdagi sanoq sahifangizni oching.", ru: 'Откройте свою страницу подсчёта с 8-го урока.' })}</p>;
  return (
    <p className="qs-qadamlar">{tr({ uz: '8-darsdagi qadamlaringiz:', ru: 'Ваши шаги с 8-го урока:' })} <b>{d.qadamlar.map(q => `${q.nom} ${q.soni ?? '—'}`).join(' · ')}</b>
      {d.sana && <span> ({d.sana})</span>}{d.tur === 'mashq' && <span className="qs-qd-mashq">{tr({ uz: 'mashq sonlari', ru: 'учебные числа' })}</span>}</p>
  );
};
const ScreenA3 = (props) => {
  const [trek] = useTrek(false);
  const web = trek === 'web';
  const apk = props.storedAnswer && props.storedAnswer.apk;
  const apkTanla = (v) => { if (props.storedAnswer && props.storedAnswer.solved) props.onAnswer(props.screen, { ...props.storedAnswer, apk: v }); };
  const osti = !web && <div className="qs-apk">
    <div className={cx(!apk && 'qs-chorla', 'qs-apk-g')}>
      <QChip holat={apk === 'almashtirildi' ? 'on' : undefined} onClick={() => apkTanla('almashtirildi')}>{tr({ uz: 'Havola almashtirildi', ru: 'Ссылка заменена' })}</QChip>
      <QChip holat={apk === 'navbatda' ? 'on' : undefined} onClick={() => apkTanla('navbatda')}>{tr({ uz: 'Fayl navbatda', ru: 'Файл в очереди' })}</QChip>
    </div>
  </div>;
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 3 · o'lchov va nazorat", ru: 'Практика 3 · измерение и контроль' }}
      title={{ uz: <>Eslatmadan ochilganlar sanalsin, <span className="italic" style={{ color: T.accent }}>o'chirgich bo'lsin</span>.</>, ru: <>Считаем открытия <span className="italic" style={{ color: T.accent }}>и ставим переключатель</span>.</> }}
      mentor={{ uz: "Eslatma bosilib nechta qurilmada ilova ochilganini sanoq ko'rsatadi; «1 · Ochish»dan boshlang.", ru: "Подсчёт покажет, на скольких устройствах приложение открыли по напоминанию; начните с «1 · Открыть»." }}
      ustida={<QadamlarQatori />} osti={osti}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "sanoq sahifangizni oching (8-dars, kalit bilan): qadamlar qatorlari turibdi. Bugun ularning ostiga yangi qator qo'shiladi — eslatma bosilib ilova ochilgan qurilmalar soni.", ru: 'откройте свою страницу подсчёта (8-й урок, с ключом): там строки шагов. Сегодня под ними добавится новая строка — число устройств, где приложение открыли по напоминанию.' },
          bandlar: [
            { uz: "Bu son eslatma bosilganini aytadi; eslatma bo'lmasa ham ochgan bo'larmidi — buni aytmaydi.", ru: 'Это число говорит, что на напоминание нажали; открыл бы человек и без напоминания — этого оно не говорит.' },
            { uz: "O'chirgich qayerda turishini o'ylang (Mentor misolida — «Hisobdan chiqish» yonida, nomi «Eslatmalar»; sozlama ekani ko'rinib tursin — chiqish tugmasiga o'xshamasin).", ru: "Подумайте, где будет переключатель (в примере Ментора — рядом с «Hisobdan chiqish» («Выйти из аккаунта»), название «Eslatmalar» («Напоминания»); пусть видно, что это настройка, — не похоже на кнопку выхода)." },
            { uz: "Web-trekda: sanoq yozuvi `xabardan-ochdi` — «Siz yo'q paytingizda» qatori bosilib o'yin ochilganda (sahifa ochilishining o'zi emas); o'chirgich nomi «Xabarlar».", ru: "В веб-треке: запись подсчёта `xabardan-ochdi` — когда нажали строку «Пока вас не было» и открылась игра (а не само открытие страницы); название переключателя «Xabarlar»." }
          ] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: P_BAND,
          vazifa: { uz: "Eslatma bosilib ilova ochilganda sanoq yozuvi qo'shiladi; foydalanuvchi eslatmalarni o'zi o'chira oladi.", ru: 'Когда по напоминанию нажали и приложение открылось, добавляется запись подсчёта; пользователь может сам выключить напоминания.' },
          prompt: { satrlar: P_SATRLAR, joylar: P_JOYLAR }, yordam: trek === 'mobil' ? A3_YORDAM.filter(l => !l.web) : A3_YORDAM },
        { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "`git status` → `git add <fayl>` → `git commit -m \"eslatma sanog'i va o'chirgich\"` → `git push`. Backend o'zgardi — Render sahifangizda yangi deploy tugashini kuting (bir necha daqiqa cho'zilishi mumkin); kutayotganda agent yozgan fayldan o'chirgich eslatmalarni bekor qiladigan qatorni toping.", ru: "`git status` → `git add <fayl>` → `git commit -m \"eslatma sanog'i va o'chirgich\"` → `git push`. Backend изменился — дождитесь на своей странице Render окончания нового деплоя (может занять несколько минут); пока ждёте, найдите в файле агента строку, где переключатель отменяет напоминания." },
          bandlar: [
            { prompt: A3_KOD_PROMPT },
            { uz: "Lending sahifalari ham o'zgardi — Netlify'dagi lending saytingiz yangilanganini 1-darsdagi yo'l bilan tekshiring.", ru: 'Страницы лендинга тоже изменились — проверьте способом из 1-го урока, что ваш лендинг на Netlify обновился.' }
          ],
          err: XATO_GAP },
        { h: { uz: 'Tekshirish', ru: 'Проверка' }, t: { uz: "talabingizning har qatorini ko'ring:", ru: 'проверьте каждую строку требования:' },
          bandlar: [
            { uz: "(1) Agentga: «Test holati: uch kunlik eslatmani bir daqiqadan keyinga qo'y, haftalik chegarani vaqtincha o'chir.» Ilovani oching va butunlay yoping (oxirgi ilovalar ro'yxatidan ham). Eslatma chiqqach uni bosing — ilova ochilishi kerak.", ru: '(1) Агенту: «Тестовый режим: поставь трёхдневное напоминание через минуту, временно отключи недельный предел.» Откройте приложение и полностью закройте (и из списка недавних приложений). Когда появится напоминание, нажмите на него — приложение должно открыться.' },
            { uz: "Eslatma chiqmasa — ilovani yopmasdan telefonni qulflab, qayta urinib ko'ring va qaysi holatda ishlaganini yozib qo'ying.", ru: 'Если напоминание не появилось — не закрывая приложение, заблокируйте телефон, попробуйте снова и запишите, в каком случае сработало.' },
            { uz: "(2) Sanoq sahifangizga qarang — «eslatmadan ochdi» qatorida 1 qurilma chiqishi kerak. Bitta ochilish ikki yozuv beradi: `ochdi` (har ochilishda) va `eslatmadan-ochdi` (eslatma orqali ochilgani) — bu xato emas.", ru: '(2) Посмотрите на страницу подсчёта — в строке «eslatmadan ochdi» должно быть 1 устройство. Одно открытие даёт две записи: `ochdi` (при каждом открытии) и `eslatmadan-ochdi` (открыто через напоминание) — это не ошибка.' },
            { uz: "Sanoq sahifasi hali yo'q bo'lsa — Neon SQL Editor'da: `SELECT COUNT(DISTINCT qurilma_id) FROM hodisalar WHERE nom = 'eslatmadan-ochdi';` → «Run».", ru: "Если страницы подсчёта ещё нет — в Neon SQL Editor: `SELECT COUNT(DISTINCT qurilma_id) FROM hodisalar WHERE nom = 'eslatmadan-ochdi';` → «Run»." },
            { uz: "(3) «Eslatmalar»ni o'chiring va ilovani yoping — bir daqiqadan keyin eslatma chiqmasligi kerak. Ilovani ochib, o'chirgichni yoqing va yana yoping — eslatma chiqishi kerak; bu safar uni bosmang, surib tashlang.", ru: '(3) Выключите «Eslatmalar» и закройте приложение — через минуту напоминание появиться не должно. Откройте приложение, включите переключатель и снова закройте — напоминание должно появиться; в этот раз не нажимайте на него, смахните.' },
            { uz: "(4) Tekshiruv yozuvlarini haqiqiy sanoqdan chiqaring. Neon SQL Editor'da: `SELECT id, yaratilgan FROM hodisalar WHERE nom = 'eslatmadan-ochdi' ORDER BY yaratilgan;` → «Run» — har bosishingizga bitta qator bo'lishi kerak, ikkita emas.", ru: "(4) Уберите проверочные записи из настоящего подсчёта. В Neon SQL Editor: `SELECT id, yaratilgan FROM hodisalar WHERE nom = 'eslatmadan-ochdi' ORDER BY yaratilgan;` → «Run» — на каждое ваше нажатие должна быть одна строка, не две." },
            { uz: "Ro'yxatda faqat bugun o'zingiz bosgan vaqtdagi qatorlar bo'lishi kerak; boshqa qator bo'lsa — unga tegmang. Agentga: «`hodisalar` jadvalidan faqat shu `id` li tekshiruv yozuvlarini o'chir: {id lar}.» Sanoq sahifasida qator 0 ga qaytadi.", ru: 'В списке должны быть только строки со временем ваших сегодняшних нажатий; если есть другая строка — не трогайте её. Агенту: «Удали из таблицы `hodisalar` только проверочные записи с этими `id`: {id}.» На странице подсчёта строка вернётся к 0.' },
            { uz: "(5) Agentga: «Test holatini olib tashla: vaqt va haftalik chegara avvalgidek bo'lsin.» `git status` va `git diff` da test holatidan o'zgarish qolmaganini ko'ring; tekshiruvda tuzatilgan joy bo'lsa — `git add <fayl>` → commit → `git push`.", ru: '(5) Агенту: «Убери тестовый режим: время и недельный предел — как раньше.» Посмотрите в `git status` и `git diff`, что от тестового режима изменений не осталось; если при проверке что-то исправляли — `git add <fayl>` → commit → `git push`.' },
            { uz: "Web-trekda: «Siz yo'q paytingizda» qatorini bosing — sanoq sahifasida «xabardan ochdi» qatorida 1 qurilma chiqishi kerak; «Xabarlar»ni o'chirib, saytni qayta oching — qator chiqmasligi kerak; tekshiruv yozuvlarini xuddi shunday o'chiring (nom — `xabardan-ochdi`).", ru: "В веб-треке: нажмите строку «Пока вас не было» — на странице подсчёта в строке «xabardan ochdi» должно быть 1 устройство; выключите «Xabarlar» и откройте сайт снова — строки быть не должно; проверочные записи удалите так же (имя — `xabardan-ochdi`)." },
            { uz: "Oxirida (mobil trek): odamlardagi ilova uchun yangi o'rnatish fayli kerak — `eas build -p android --profile preview`. Navbatni kutmang: «Bajardim»ni bosing va davom eting.", ru: 'В конце (мобильный трек): для приложения у людей нужен новый установочный файл — `eas build -p android --profile preview`. Очередь не ждите: нажмите «Готово» и продолжайте.' },
            { uz: "Fayl dars oxirigacha tayyor bo'lsa — lendingdagi «Android: ilovani o'rnatish» havolasini almashtiring; bo'lmasa — keyingi dars boshida.", ru: "Если файл будет готов до конца урока — замените на лендинге ссылку «Android: ilovani o'rnatish» («Android: установить приложение»); если нет — в начале следующего урока." }
          ] }
      ]}
      natija={<NatijaA3 trek={trek} />}
      doneText={web
        ? { uz: "Eslatmadan ochilganlar sanaladi; foydalanuvchi eslatmalarni o'zi o'chira oladi.", ru: 'Открытия из напоминания считаются; пользователь может сам выключить напоминания.' }
        : { uz: <>Eslatmadan ochilganlar sanaladi; foydalanuvchi eslatmalarni o'zi o'chira oladi.<span className="qs-blok-iz">APK o'zi yangilanmaydi: eski faylni o'rnatganlarda bugungi eslatma yangisini o'rnatgandan keyin paydo bo'ladi.</span></>, ru: <>Открытия из напоминания считаются; пользователь может сам выключить напоминания.<span className="qs-blok-iz">APK сам не обновляется: у тех, кто установил старый файл, сегодняшнее напоминание появится после установки нового.</span></> }}
      ulgur={{ uz: "Ulgurmasangiz: sanoq qatori va o'chirgich birinchi; maxfiylik gapini dars oxirida, o'rnatish faylini keyingi dars boshida bajaring. Tekshiruv yozuvlarini o'chirishni o'tkazib yubormang.", ru: 'Если не успеваете: сначала строка подсчёта и переключатель; фразу о конфиденциальности — в конце урока, установочный файл — в начале следующего. Не пропустите удаление проверочных записей.' }}
    />
  );
};

// 🃏 KARTOCHKALAR — alohida ekran, Mentorsiz (SABOQ 12, 16); karta yuzi ingichka halqada, puls 3 marta (E 49)
const KARTALAR = [
  { front: { uz: 'Qaytganlar foizi nima?', ru: "Что такое процент вернувшихся?" }, back: { uz: 'Bir davrda ochganlardan keyingi davrda ham ochganlari foizi', ru: 'Процент тех, кто открыл в один период и открыл снова в следующий' }, note: { uz: 'Inglizchasi: retention. 7-Modulda bot uchun sanagansiz', ru: "По-английски: retention. В 7-м модуле вы считали его для бота" } },
  { front: { uz: 'Mentor misolida qaytganlar foizi qancha chiqdi?', ru: "Каким получился процент вернувшихся в примере Ментора?" }, back: { uz: '46 qurilmadan 17 tasi yana ochdi — taxminan 37%', ru: 'Из 46 устройств 17 открыли снова — примерно 37%' }, note: { uz: "Shu 46 qurilmaning sanalgan soni; nega qaytmagani bundan bilinmaydi", ru: "Подсчёт по этим 46 устройствам; почему не вернулись — из него не видно" } },
  { front: { uz: "Ilova ochiq bo'lsa, boshqa odamning o'zgarishi qanday ko'rinadi?", ru: 'Если приложение открыто, как видно изменение другого человека?' }, back: { uz: "Son o'zi yangilanadi; foydali joyda jonli xabar chiqadi", ru: 'Число обновляется само; в полезном месте появляется живое сообщение' }, note: { uz: 'Hodisa ulanish orqali keladi', ru: 'Событие приходит через соединение' } },
  { front: { uz: "Ilova yopiq bo'lsa, boshqa odamning o'zgarishi jonli xabar bo'lib ko'rinadimi?", ru: 'Если приложение закрыто, видно ли изменение другого человека как живое сообщение?' }, back: { uz: "Yo'q", ru: 'Нет' }, note: { uz: "Ilova ochilganda yangi sonni ro'yxatda ko'radi", ru: 'Когда приложение откроют, новое число видно в списке' } },
  { front: { uz: '«2 joy qoldi» xabari uchun yangi hodisa kerakmi?', ru: "Нужно ли новое событие для сообщения «осталось 2 места»?" }, back: { uz: "Yo'q — ilova qayta so'ragan sondan o'zi hisoblaydi", ru: 'Нет — приложение само считает по заново запрошенному числу' }, note: { uz: "Mentor misolida; o'yinga qo'shilmaganlarga chiqadi", ru: 'В примере Ментора; появляется у тех, кто не присоединился к игре' } },
  { front: { uz: "Rejalashtirilgan eslatmani kim qo'yadi?", ru: 'Кто ставит запланированное напоминание?' }, back: { uz: "Ilovaning o'zi, oldindan", ru: 'Само приложение, заранее' }, note: { uz: 'Shuning uchun u ilova bilgan narsani aytadi', ru: 'Поэтому оно говорит то, что знает приложение' } },
  { front: { uz: "Nega uch kunlik eslatma «yangi o'yin chiqdi» demaydi?", ru: 'Почему трёхдневное напоминание не говорит «вышла новая игра»?' }, back: { uz: "Yopiq ilova yangi e'lonni bilmaydi", ru: 'Закрытое приложение не знает о новом объявлении' }, note: { uz: "Shuning uchun taklif qiladi: «Hafta oxiriga o'yin bormi?»", ru: "Поэтому предлагает: «Есть игра на выходных?»" } },
  { front: { uz: 'Bu kursda foydali eslatma qanday bo\'ladi?', ru: 'Каким бывает полезное напоминание в этом курсе?' }, back: { uz: "O'z ishiga tegishli, rost va bosimsiz", ru: 'Касается его дела, правдивое и без давления' }, note: { uz: "Hafta ikkitaga to'lsa, ilova o'zidan qo'shmaydi; o'chirgich bor", ru: 'Если на неделе уже два, приложение само не добавит; есть переключатель' } },
  { front: { uz: "«Eslatmalar» o'chirilsa, nima bo'ladi?", ru: "Что будет, если выключить «Напоминания»?" }, back: { uz: "Rejalashtirilgan eslatmalar bekor bo'ladi", ru: 'Запланированные напоминания отменятся' }, note: { uz: 'Tanlov foydalanuvchida', ru: 'Выбор — за пользователем' } },
  { front: { uz: 'Mentor misolida uch kunlik eslatma kimga chiqadi?', ru: 'Кому в примере Ментора приходит трёхдневное напоминание?' }, back: { uz: 'Ilovani uch kun ochmagan odamga', ru: 'Тому, кто три дня не открывал приложение' }, note: { uz: 'Har kuni ochadigan odamga umuman chiqmaydi', ru: 'Тому, кто открывает каждый день, не приходит вовсе' } },
  { front: { uz: 'Mentor misolida `eslatmadan-ochdi` nimani sanaydi?', ru: 'Что считает `eslatmadan-ochdi` в примере Ментора?' }, back: { uz: 'Eslatma bosilib ilova ochilgan qurilmalarni', ru: 'Устройства, где по напоминанию нажали и открыли приложение' }, note: { uz: 'Istalgan eslatma; eslatmasiz ham ocharmidi — buni aytmaydi', ru: 'Любое напоминание; открыл бы и без напоминания — этого не говорит' } },
  { front: { uz: "Ilova o'zgarsa, APK o'rnatganlarga yangi eslatma qanday yetadi?", ru: "Если приложение изменилось, как новое напоминание дойдёт до тех, кто установил APK?" }, back: { uz: "Yangi o'rnatish fayli orqali", ru: 'Через новый установочный файл' }, note: { uz: "APK o'zi yangilanmaydi", ru: 'APK сам не обновляется' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('qs-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tr(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="qs-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204) + «Keyingi dars» qatori; uyga vazifa yo'q (tayanch 4: loyiha kuni). Sarlavha bloklar holati va trekdan (har biri rost — E 54); ✓ yorlig'i faqat uchala blok bajarilganda =====
const YAKUN_SARLAVHA = {
  uchalaMobil: { uz: 'Eslatmangiz tekshirildi va endi sanaladi.', ru: 'Ваше напоминание проверено и теперь считается.' },
  uchalaWeb: { uz: "«Siz yo'q paytingizda» qatori tayyor va sanaladi.", ru: "Строка «Пока вас не было» готова и считается." },
  a12: { uz: "Ikki blok tayyor — sanoq va o'chirgich qoldi.", ru: "Два блока готовы — дальше подсчёт и переключатель." },
  a1: { uz: "Jonli xabar ishlaydi — yopiq paytdagi qism qoldi.", ru: "Живое сообщение работает — осталось напоминание." },
  qisman: { uz: 'Qaytarish ishi hali tugamagan — qolgan bloklarni tugating.', ru: "Возврат не доделан — завершите остальные блоки." },
  yoq: { uz: 'Qaytarish ishi hali yozilmagan — uch blokni bajaring.', ru: "Возврат ещё не написан — выполните три блока." }
};
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
  const javob = (id) => answers[SCREEN_META.findIndex(m => m.id === id)];
  const bajarildi = (id) => !!(javob(id) && javob(id).solved);
  const boshlangan = (id) => { const a = javob(id); return !!(a && (a.solved || Number(a.qadam) > 0 || Object.values(a.joy || {}).some(v => String(v || '').trim()))); };
  const a1 = bajarildi('a1'), a2 = bajarildi('a2'), a3 = bajarildi('a3');
  const web = trekOqi() === 'web';
  const uchala = a1 && a2 && a3;
  const holat = uchala ? (web ? 'uchalaWeb' : 'uchalaMobil') : a1 && a2 ? 'a12' : a1 ? 'a1' : (boshlangan('a1') || boshlangan('a2') || boshlangan('a3')) ? 'qisman' : 'yoq';
  const navbatda = !web && a3 && javob('a3').apk === 'navbatda';
  const RECAP = [
    { uz: 'Qaytganlar foizi — bir davrda ilovani ochganlardan keyingi davrda ham ochganlari foizi.', ru: "Процент вернувшихся — сколько процентов из открывших приложение в один период открыли его и в следующем." },
    { uz: "Jonli xabar ilova ochiq paytda chiqadi; yopiq ilovada u ko'rinmaydi.", ru: 'Живое сообщение появляется при открытом приложении; в закрытом его не видно.' },
    { uz: "Rejalashtirilgan eslatmani ilovaning o'zi qo'yadi — u faqat oldindan bilgan narsani aytadi.", ru: 'Запланированное напоминание ставит само приложение — оно говорит только то, что знало заранее.' },
    { uz: "Bu kursda eslatma o'z ishiga tegishli, rost va bosimsiz; hafta ikkitaga to'lsa, ilova o'zidan yangisini qo'shmaydi; o'chirgich foydalanuvchida.", ru: 'В этом курсе напоминание касается дела пользователя, правдиво и без давления; если на неделе уже два, приложение само новое не добавит; переключатель — у пользователя.' },
    { uz: "Sanoq eslatma bosilib ilova ochilganini ko'rsatadi; eslatma bo'lmasa ham ochgan bo'larmidi — buni aytmaydi.", ru: 'Подсчёт показывает, что по напоминанию нажали и приложение открылось; открыл бы и без напоминания — этого он не говорит.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className={cx('qs-yakun', !uchala && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Uch blok bajarildi', ru: 'Три блока выполнены' })}
          togri={correct} jami={total}
          sarlavha={tr(YAKUN_SARLAVHA[holat])}
          cta={<>
            {navbatda && <p className="qs-apk-y fade-up"><span className="qs-apk-chip">{tr({ uz: "O'rnatish fayli navbatda", ru: 'Установочный файл в очереди' })}</span><span>{tr({ uz: "Fayl tayyor bo'lgach, lendingdagi havolani keyingi dars boshida almashtirasiz.", ru: 'Когда файл будет готов, замените ссылку на лендинге в начале следующего урока.' })}</span></p>}
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}>
          <p className="qs-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«50 foydalanuvchiga yetdingizmi?»</b>: Mentor tekshiruvi: metrika hisoboti va zaxira reja.</>, ru: <>Следующий урок — <b>«Дошли до 50 пользователей?»</b>: проверка Ментора: отчёт по метрикам и запасной план.</> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function RetentionDayLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, ScreenA1, Screen4, Screen5, ScreenA2, Screen7, ScreenA3, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI — «ikki telefon va Backend» sahnasi (qs-). Faqat qolip tokenlari (D3) + «Maydon Jamoa» nomi rangi (MAYDON_RANG, 9.62); emoji yo'q (D4). Telefon 172×272 hamma ekranda (SABOQ 22) === */
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .qs-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: qs-puls 2.2s ease-out .3s 3; }
        @keyframes qs-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        /* Har variant va chipning o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .qs-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: qs-chorla-v 1.8s ease-out .5s 2; }
        @keyframes qs-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 8px ${fon(T.accent, 0)}; } }
        .qs-halqa-g .q-chip:not(:disabled), .qs-chorla > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: qs-chorla-c 1.8s ease-out .5s 2; }
        @keyframes qs-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .qs-k.faol .q-variant:nth-child(2), .qs-halqa-g .q-chip:nth-child(2), .qs-chorla > .q-chip:nth-child(2) { animation-delay: .75s; }
        .qs-k.faol .q-variant:nth-child(3), .qs-halqa-g .q-chip:nth-child(3), .qs-chorla > .q-chip:nth-child(3) { animation-delay: 1s; }
        .qs-k { display: contents; }
        .qs-pop { display: inline-block; animation: qs-pop 0.55s cubic-bezier(.3,1.5,.5,1); color: ${T.accent}; }
        @keyframes qs-pop { 0% { transform: scale(1.45); } 100% { transform: scale(1); } }
        .qs-viz { display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
        p.qs-joriy { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        /* Yashil xulosa ichida: taxmin qatori (kichik) · xulosa · izoh (ingichka ajratgich) — E 42 */
        .q-xulosa .qs-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .qs-x-tx b { color: ${T.ink}; } .q-xulosa .qs-x-tx.ok, .q-xulosa .qs-x-tx.ok b { color: ${T.ok}; } .q-xulosa .qs-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .qs-x-m { display: block; }
        .q-xulosa .qs-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        .qs-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .qs-bash-ix em { font-style: normal; font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .qs-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        /* Sahna joylashuvi: yot — bir qatorda, tik — telefonlar tepada, Backend pastda */
        .qs-sahna { user-select: none; -webkit-user-select: none; display: grid; gap: 0 10px; padding-top: 30px; justify-content: center; align-items: start; }
        .qs-sahna.yot.ikki { grid-template-columns: auto minmax(64px, 130px) auto minmax(64px, 130px) auto; grid-template-areas: "t1 c1 be c2 t2"; }
        .qs-sahna.yot.bir { grid-template-columns: auto minmax(64px, 130px) auto; grid-template-areas: "t1 c1 be"; }
        .qs-sahna.bes.yot.bir, .qs-sahna.bes.tik.bir { grid-template-columns: auto; grid-template-areas: "t1"; }
        .qs-sahna.tik.ikki { grid-template-columns: 172px 172px; column-gap: 12px; grid-template-areas: "t1 t2" "c1 c2" "be be"; }
        .qs-sahna.tik.bir { grid-template-columns: auto; grid-template-areas: "t1" "c1" "be"; justify-items: center; }
        .qs-s-t1 { grid-area: t1; } .qs-s-t2 { grid-area: t2; } .qs-s-c1 { grid-area: c1; } .qs-s-c2 { grid-area: c2; } .qs-s-be { grid-area: be; justify-self: center; }
        .qs-sahna.tik .qs-s-c1, .qs-sahna.tik .qs-s-c2 { justify-self: center; }
        .qs-sahna.tik .qs-s-t1, .qs-sahna.tik .qs-s-t2 { align-self: stretch; display: flex; flex-direction: column; align-items: center; }
        .qs-sahna.tik .qs-s-t1:is(.h-ochiq, .h-xira)::after, .qs-sahna.tik .qs-s-t2:is(.h-ochiq, .h-xira)::after { content: ''; flex: 1; width: 3px; min-height: 0; }
        .qs-sahna.tik .h-ochiq::after { background: ${T.ok}; } .qs-sahna.tik .h-xira::after { background: ${T.ink2}; opacity: 0.25; }
        /* Telefon: ramka 172×272, yorliq ramka ustida */
        .qs-tel-ust { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; width: 172px; }
        .qs-tel-yorliq { position: absolute; top: -28px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 999px; white-space: nowrap; }
        .qs-tel-yorliq.b1 { background: ${T.accentSoft}; color: ${T.accent}; } .qs-tel-yorliq.b2 { background: ${fon(T.ink, 0.08)}; color: ${T.ink}; }
        .qs-tel-yorliq.tex { position: static; transform: none; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink2}; }
        .qs-telefon { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 5px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px; background: ${T.paper}; overflow: hidden; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.5); }
        .qs-telefon.qulf { background: ${fon(T.ink, 0.88)}; transition: background 0.4s; }
        .qs-tel-bar { display: flex; align-items: center; justify-content: center; height: 18px; flex: none; }
        .qs-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: ${MAYDON_RANG}; letter-spacing: 0.01em; }
        .qs-tel-ekran { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; animation: qs-ekran 0.35s ease-out both; }
        @keyframes qs-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        /* 2-telefon «O'yin» ekrani */
        .qs-oyin { display: flex; flex-direction: column; gap: 3px; flex: 1; min-height: 0; padding-top: 4px; }
        .qs-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .qs-oyin-joy { font-size: 12px; color: ${T.ink2}; }
        .qs-hisob { display: inline-flex; align-items: baseline; gap: 6px; align-self: flex-start; margin-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${T.ink2}; }
        .qs-son { display: inline-block; font-size: 22px; font-weight: 800; color: ${T.ink}; }
        .qs-son.qs-pop { color: ${T.accent}; }
        .qs-oyin-past { margin-top: auto; display: flex; flex-direction: column; gap: 5px; }
        .qs-qoshil { flex: none; display: flex; align-items: center; justify-content: center; height: 28px; border: 0; border-radius: 10px; font-family: 'Manrope'; font-size: 12px; font-weight: 800; cursor: pointer; background: ${T.accent}; color: #fff; }
        .qs-qoshil:disabled { cursor: default; } .qs-qoshil:disabled:not(.off) { background: ${fon(T.accent, 0.16)}; color: ${T.accent}; }
        .qs-qoshil.off { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        /* 1-telefon «O'yinlar» ekrani: ulanish belgisi, o'yin kartalari, sozlama qatori */
        .qs-oyinlar { display: flex; flex-direction: column; gap: 5px; flex: 1; min-height: 0; }
        .qs-ol-bosh { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .qs-ol-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .qs-belgi { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; color: ${T.ok}; animation: fade-in-up 0.3s ease-out both; }
        .qs-belgi i { width: 7px; height: 7px; border-radius: 50%; background: ${T.ok}; }
        .qs-belgi.ulanmoqda { color: ${T.ink2}; } .qs-belgi.ulanmoqda i { background: ${T.ink2}; animation: qs-miltil 0.8s ease-in-out infinite alternate; }
        @keyframes qs-miltil { from { opacity: 0.3; } to { opacity: 1; } }
        .qs-karta { display: flex; flex-direction: column; align-items: flex-start; gap: 1px; padding: 6px 8px; border-radius: 9px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11px; line-height: 1.3; color: ${T.ink2}; }
        .qs-karta b { font-size: 12px; color: ${T.ink}; }
        .qs-karta-son { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; }
        .qs-karta.yangi { animation: qs-kirdi 0.5s ease-out both, qs-yashil 1.6s ease-out 0.5s both; }
        @keyframes qs-kirdi { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
        @keyframes qs-yashil { 0%, 60% { background: ${T.okFon}; border-color: ${T.ok}; } 100% { background: ${T.bg}; border-color: ${T.line}; } }
        .qs-sozlama { margin-top: auto; display: flex; flex-direction: column; gap: 4px; padding-top: 6px; border-top: 1px solid ${T.line}; }
        .qs-soz-q { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 4px 6px; border-radius: 8px; background: ${T.bg}; font-size: 11px; font-weight: 700; color: ${T.ink}; }
        .qs-soz-q.web { align-self: stretch; padding: 7px 10px; font-size: 12px; }
        .qs-soz-sw { position: relative; flex: none; width: 26px; height: 15px; border-radius: 999px; background: ${fon(T.ink, 0.2)}; }
        .qs-soz-sw::after { content: ''; position: absolute; top: 2px; left: 2px; width: 11px; height: 11px; border-radius: 50%; background: ${T.paper}; transition: left 0.25s; }
        .qs-soz-sw.on { background: ${T.ok}; } .qs-soz-sw.on::after { left: 13px; }
        .qs-soz-chiq { align-self: flex-start; font-size: 11px; font-weight: 700; color: ${T.err}; padding: 2px 6px; }
        /* Qulf ekrani — umumiy chizma: qulf belgisi, eslatma kartalari, pastki chiziq (sana-soat va ilova belgisi yo'q) */
        .qs-qulf { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 10px; }
        .qs-qulf-qulf { position: relative; flex: none; width: 18px; height: 22px; margin-bottom: 4px; }
        .qs-qulf-qulf::before { content: ''; position: absolute; left: 3px; top: 0; width: 8px; height: 9px; border: 2px solid ${fon(T.paper, 0.75)}; border-bottom: 0; border-radius: 7px 7px 0 0; }
        .qs-qulf-qulf i { position: absolute; left: 0; bottom: 0; width: 18px; height: 12px; border-radius: 3px; background: ${fon(T.paper, 0.75)}; }
        .qs-qulf-kartalar { align-self: stretch; display: flex; flex-direction: column; gap: 5px; min-height: 0; }
        .qs-qulf-past { margin-top: auto; flex: none; width: 54px; height: 4px; border-radius: 3px; background: ${fon(T.paper, 0.55)}; }
        .qs-eslatma { position: relative; display: flex; flex-direction: column; gap: 1px; padding: 7px 9px; border-radius: 12px; background: ${fon(T.paper, 0.92)}; border: 2px solid transparent; color: ${T.ink}; text-align: left; animation: qs-tush 0.5s cubic-bezier(.3,1.3,.5,1) both; transition: border-color 0.3s, opacity 0.5s; }
        @keyframes qs-tush { from { opacity: 0; transform: translateY(-34px); } to { opacity: 1; transform: none; } }
        .qs-es-nom { font-size: 11px; font-weight: 800; color: ${MAYDON_RANG}; }
        .qs-es-m { font-size: 11.5px; line-height: 1.3; color: ${T.ink}; }
        .qs-es-y { font-style: normal; font-size: 9.5px; font-weight: 700; color: ${T.ink2}; }
        .qs-eslatma.h-ok { border-color: ${T.ok}; }
        .qs-eslatma.h-xato { border-color: ${T.err}; animation: qs-sondir 1.6s ease-in 0.3s both; }
        @keyframes qs-sondir { to { opacity: 0.35; } }
        .qs-eslatma.h-sondi { opacity: 0.25; border-color: transparent; }
        .qs-eslatma.ixcham { padding: 4px 8px; border-radius: 9px; animation: none; }
        .qs-eslatma.ixcham .qs-es-nom { font-size: 9.5px; } .qs-eslatma.ixcham .qs-es-m { font-size: 10px; }
        .qs-eslatma.bosildi { animation: qs-bos 0.5s ease-out both; }
        @keyframes qs-bos { 50% { transform: scale(0.95); background: ${T.paper}; } 100% { transform: none; } }
        /* Jonli xabar — ilova ichida, ekran tepasida (oqimda: matnni yopmaydi — lint:layout D), tepadan tushadi, bir necha soniyadan keyin yig'iladi */
        .qs-jonli { position: relative; z-index: 3; flex: none; display: flex; flex-direction: column; gap: 1px; padding: 7px 9px; border-radius: 12px; background: ${T.ink}; color: ${T.paper}; box-shadow: 0 10px 22px -10px rgba(${T.shadowBase},0.6); animation: qs-tush 0.45s cubic-bezier(.3,1.3,.5,1) both; }
        .qs-jonli b { font-size: 10.5px; font-weight: 800; color: ${MAYDON_RANG}; filter: brightness(1.5); }
        .qs-jonli span { font-size: 11.5px; line-height: 1.3; }
        .qs-jonli.ket { animation: qs-kot 0.4s ease-in both; }
        @keyframes qs-kot { to { opacity: 0; transform: translateY(-40px); } }
        /* Sahna tugmalari — haqiqiy ilovada yo'q: ramkadan tashqarida, chegarali */
        .qs-s-tugmalar { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .qs-st { padding: 7px 12px; border: 1.5px solid ${T.ink}; border-radius: 10px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-size: 12.5px; font-weight: 800; cursor: pointer; white-space: nowrap; }
        .qs-st:disabled { cursor: default; } .qs-st.xira { opacity: 0.4; }
        .qs-korinmadi { padding: 3px 9px; border-radius: 999px; background: ${fon(T.ink, 0.07)}; color: ${T.ink2}; font-size: 11.5px; font-weight: 700; white-space: nowrap; }
        .qs-sanoq-q { padding: 4px 10px; border-radius: 999px; background: ${T.okFon}; color: ${T.ok}; font-size: 12px; font-weight: 700; border: 1px solid ${fon(T.ok, 0.4)}; }
        .qs-sanoq-q b { font-family: 'JetBrains Mono', monospace; }
        /* Backend tuguni */
        .qs-be-ust { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .qs-sahna.yot .qs-be-joy { height: 272px; display: flex; align-items: center; justify-content: center; }
        .qs-backend { display: flex; flex-direction: column; align-items: center; gap: 7px; min-width: 132px; max-width: 200px; padding: 12px 14px; border-radius: 16px; background: ${T.ink}; color: ${T.paper}; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.7); }
        .qs-be-nom { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
        .qs-db { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 2px 9px; border-radius: 7px; background: ${fon(T.paper, 0.12)}; }
        .qs-db b { color: ${T.paper}; } .qs-db b.qs-pop { color: ${T.accent}; }
        .qs-be-qator { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 2px 9px; border-radius: 7px; background: ${fon(T.ok, 0.25)}; color: ${T.paper}; }
        /* Chiziq va konvert */
        .qs-chiziq { position: relative; }
        .qs-chiziq.yot { height: 272px; min-width: 64px; }
        .qs-chiziq.tik { height: 50px; width: 30px; }
        .qs-chiziq-i { position: absolute; display: block; opacity: 0; transition: opacity 0.4s, background 0.4s; }
        .qs-chiziq.yot .qs-chiziq-i { left: 0; right: 0; top: calc(50% - 1.5px); height: 3px; }
        .qs-chiziq.tik .qs-chiziq-i { top: 0; bottom: 0; left: calc(50% - 1.5px); width: 3px; }
        .qs-chiziq.h-ochiq .qs-chiziq-i { opacity: 1; background: ${T.ok}; animation: qs-ochiq 2.6s ease-in-out infinite; }
        @keyframes qs-ochiq { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; } 50% { box-shadow: 0 0 9px 1px ${fon(T.ok, 0.45)}; } }
        .qs-chiziq.h-xira .qs-chiziq-i { opacity: 0.25; background: ${T.ink2}; }
        .qs-kv { position: absolute; z-index: 4; display: flex; flex-direction: column; align-items: center; gap: 2px; pointer-events: none; animation-duration: 0.9s; animation-timing-function: ease-in-out; animation-fill-mode: both; }
        .qs-chiziq.yot .qs-kv { top: 50%; transform: translate(-50%, -28%); }
        .qs-chiziq.tik .qs-kv { left: 50%; transform: translate(-50%, -50%); }
        .qs-kv-i { position: relative; display: block; width: 26px; height: 18px; border-radius: 4px; background: ${T.paper}; border: 1.5px solid ${T.accent}; overflow: hidden; flex: none; }
        .qs-kv-i::before { content: ''; position: absolute; left: 50%; top: -9px; width: 15px; height: 15px; border: 1.5px solid ${T.accent}; transform: translateX(-50%) rotate(45deg); }
        .qs-kv.hodisa .qs-kv-i { background: ${T.accent}; } .qs-kv.hodisa .qs-kv-i::before { border-color: ${T.paper}; }
        .qs-kv-y { order: -1; display: flex; flex-direction: column; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; padding: 1px 6px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; white-space: nowrap; }
        .qs-kv-y em { font-style: normal; font-weight: 500; font-size: 10px; color: ${T.ink2}; }
        .qs-kv.hodisa .qs-kv-y { color: ${T.accent}; border-color: ${fon(T.accent, 0.45)}; }
        @keyframes qs-kv-x-ab { from { left: 0%; } to { left: 100%; } }
        @keyframes qs-kv-x-ba { from { left: 100%; } to { left: 0%; } }
        @keyframes qs-kv-y-ab { from { top: 24%; } to { top: 100%; } }
        @keyframes qs-kv-y-ba { from { top: 100%; } to { top: 24%; } }
        /* 0-ekran: telefon va hisoblagich */
        .qs-k0 { display: flex; flex-direction: column; align-items: center; gap: 12px; padding-top: 30px; }
        .qs-hisoblagich { width: 100%; max-width: 300px; display: flex; flex-direction: column; gap: 7px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .qs-hs-y { font-size: 11px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink2}; }
        .qs-hs-q { display: flex; flex-direction: column; gap: 3px; }
        .qs-hs-t { font-size: 12.5px; color: ${T.ink}; } .qs-hs-t b { font-family: 'JetBrains Mono', monospace; }
        .qs-hs-b { display: block; height: 8px; border-radius: 4px; background: ${T.accent}; }
        .qs-hs-b.qisqa { background: ${fon(T.accent, 0.45)}; }
        .qs-hs-foiz { padding-top: 6px; border-top: 1px solid ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; } .qs-hs-foiz b { color: ${T.ink}; }
        /* 5-ekran: telefon (hisoblagich, matn, o'chirgich) va tekshiruv kartasi */
        .qs-s5 { display: grid; grid-template-columns: auto minmax(240px, 340px); grid-template-areas: "tel tk" "btn tk"; justify-content: center; align-items: start; gap: 10px 28px; }
        .qs-s5-tel { grid-area: tel; } .qs-s5-btn { grid-area: btn; justify-self: center; } .qs-s5 .qs-tk { grid-area: tk; align-self: start; margin-top: 30px; }
        .qs-hafta-q { display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 220px; text-align: center; }
        .qs-hafta { padding: 2px 10px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .qs-hafta-t { font-size: 11.5px; line-height: 1.35; color: ${T.ink2}; }
        .qs-ochirgich { display: inline-flex; align-items: center; gap: 10px; padding: 6px 10px 6px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope'; font-size: 12.5px; font-weight: 800; color: ${T.ink}; cursor: pointer; }
        .qs-ochirgich:disabled { cursor: default; } .qs-ochirgich.xira { opacity: 0.45; }
        .qs-ochirgich i { position: relative; width: 32px; height: 18px; border-radius: 999px; background: ${fon(T.ink, 0.22)}; transition: background 0.25s; }
        .qs-ochirgich i::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: ${T.paper}; transition: left 0.25s; }
        .qs-ochirgich.on i { background: ${T.ok}; } .qs-ochirgich.on i::after { left: 16px; }
        .qs-tk { display: flex; flex-direction: column; gap: 7px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: border-color 0.3s; }
        .qs-tk.h-ok { border-color: ${T.ok}; } .qs-tk.h-xato { border-color: ${T.err}; }
        .qs-tk-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .qs-tk-y { margin-top: -5px; font-size: 11.5px; color: ${T.ink2}; }
        .qs-katak { display: flex; align-items: center; gap: 9px; font-size: 13px; line-height: 1.35; color: ${T.ink}; }
        .qs-katak i { flex: none; width: 24px; height: 24px; border-radius: 7px; border: 1.5px dashed ${T.line}; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 14px; }
        .qs-katak.ok i { border: 1.5px solid ${T.ok}; background: ${T.okFon}; color: ${T.ok}; animation: qs-tushk 0.3s ease-out both; }
        .qs-katak.xato i { border: 1.5px solid ${T.err}; background: ${T.errFon}; color: ${T.err}; animation: qs-tushk 0.3s ease-out both; }
        @keyframes qs-tushk { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
        .qs-tk-xato { font-size: 12.5px; font-weight: 700; color: ${T.err}; }
        /* Reja, O'qituvchi eslatmasi */
        .qs-reja-chap { display: flex; justify-content: center; }
        p.qs-reja-past { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        p.qs-reja-past2 { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .qs-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; font-size: 13px; color: ${T.ink2}; }
        .qs-ustoz b { color: ${T.ink}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        /* Amaliyot bloklari */
        .qs-trek { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .qs-trek-g { display: inline-flex; gap: 6px; padding: 3px; border-radius: 12px; }
        p.qs-qadamlar { margin: 0; font-size: 13px; line-height: 1.5; color: ${T.ink2}; }
        p.qs-qadamlar b { color: ${T.ink}; font-weight: 700; }
        .qs-qd-mashq { margin-left: 8px; padding: 1px 8px; border-radius: 999px; background: ${fon(T.ink, 0.07)}; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .qs-band { display: block; margin-top: 6px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .qs-vazifa { display: block; margin-top: 8px; padding: 6px 10px; border-radius: 9px; background: ${T.accentSoft}; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .qs-vazifa b { color: ${T.accent}; }
        .qs-prompt { margin-top: 8px; }
        .qs-ps { display: block; margin: 3px 0; font-size: 13px; line-height: 1.55; }
        .qs-ps-l { display: flex; flex-direction: column; gap: 3px; }
        .qs-ps-y { font-weight: 700; }
        .qs-joy-i { display: block; width: 100%; max-width: 100%; min-height: 26px; padding: 3px 8px; margin: 2px 0; border: 1.5px solid ${fon(T.accent, 0.45)}; border-radius: 8px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.45; color: ${T.ink}; resize: none; overflow: hidden; box-sizing: border-box; }
        .qs-joy-i.bosh { border-style: dashed; background: ${T.bg}; }
        .qs-joy-i:focus { outline: 2px solid ${fon(T.accent, 0.5)}; outline-offset: 1px; border-style: solid; }
        .qs-halqa-i { animation: qs-puls 2.2s ease-out .3s 3; }
        .qs-yordam-btn { margin-top: 6px; }
        .qs-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px dashed ${T.line}; }
        .qs-yordam-s { display: block; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; } .qs-yordam-s.web { color: ${T.ink2}; }
        .q-blok-tugadi .qs-blok-kul { display: block; margin-top: 4px; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .q-blok-tugadi .qs-blok-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; font-weight: 500; line-height: 1.45; color: ${T.ink2}; }
        .qs-apk { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .qs-apk-g { display: inline-flex; flex-wrap: wrap; gap: 6px; padding: 3px; border-radius: 12px; }
        p.qs-ortda, p.qs-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        p.qs-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.bg}; }
        .qs-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 1px 6px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; }
        .qs-natija { display: flex; flex-direction: column; align-items: center; gap: 10px; padding-top: 4px; }
        .qs-brauzer { width: 100%; max-width: 320px; border: 1.5px solid ${T.ink}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .qs-br-bar { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .qs-br-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; }
        .qs-br-bar code { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .qs-br-tana { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 12px; }
        .qs-br-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; } .qs-br-sar.kichik { font-size: 12.5px; margin-top: 4px; }
        .qs-br-q { font-size: 12px; color: ${T.ink2}; }
        .qs-br-jonli { align-self: stretch; padding: 7px 10px; border-radius: 10px; background: ${T.ink}; color: ${T.paper}; font-size: 12px; animation: qs-tush 0.45s cubic-bezier(.3,1.3,.5,1) both; }
        .qs-tasma { align-self: stretch; display: flex; flex-direction: column; gap: 5px; }
        .qs-tasma-q { padding: 6px 9px; border-radius: 9px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; color: ${T.ink}; }
        .qs-tasma-q.yangi { animation: qs-tush 0.45s ease-out both; border-color: ${fon(T.ok, 0.5)}; }
        .qs-siz-yoq { align-self: stretch; padding: 7px 10px; border-radius: 9px; background: ${T.accentSoft}; border: 1px solid ${fon(T.accent, 0.4)}; font-size: 12px; font-weight: 700; color: ${T.ink}; animation: qs-tush 0.45s ease-out both; }
        .qs-siz-yoq.bosildi { animation: qs-bos 0.5s ease-out both; }
        .qs-sanoq { align-self: stretch; display: flex; flex-direction: column; gap: 4px; }
        .qs-sanoq-r { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 5px 9px; border-radius: 8px; background: ${T.bg}; font-size: 12px; color: ${T.ink2}; }
        .qs-sanoq-r i { width: 34px; height: 6px; border-radius: 3px; background: ${fon(T.ink, 0.12)}; }
        .qs-sanoq-r.yangi { color: ${T.ink}; font-weight: 700; animation: qs-kirdi 0.45s ease-out both, qs-yashil 2.4s ease-out 0.45s both; border: 1px solid ${T.line}; }
        .qs-sanoq-r.yangi b { font-family: 'JetBrains Mono', monospace; color: ${T.ok}; }
        .qs-sanoq-y { font-style: normal; font-size: 11px; color: ${T.ink2}; }
        /* Kartochkalar va yakun */
        .qs-flash { display: flex; flex-direction: column; gap: 10px; }
        .qs-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: qs-puls 1.8s ease-out .4s 3; }
        p.qs-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.qs-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .qs-yakun { flex: 1 0 auto; display: flex; flex-direction: column; min-height: 0; }
        .qs-yakun.belgisiz .done-chip { display: none; }
        .qs-yakun .q-yakun > .ach-coll { order: 1; }
        p.qs-apk-y { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; font-size: 13px; color: ${T.ink2}; }
        .qs-apk-chip { padding: 3px 10px; border-radius: 999px; background: ${fon(T.ink, 0.07)}; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        p.qs-keyingi { margin: 0; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
        p.qs-keyingi b { color: ${T.ink}; }
        @media (max-width: 640px) {
          .qs-sahna { padding-top: 64px; }
          .qs-sahna.bes { padding-top: 30px; }
          .qs-s5 { grid-template-columns: minmax(0, 340px); grid-template-areas: "tel" "tk" "btn"; justify-items: center; } .qs-s5 .qs-tk { margin-top: 0; width: 100%; }
        }
        @media (max-width: 400px) {
          .qs-sahna.tik.ikki { grid-template-columns: 168px 168px; column-gap: 6px; }
          .qs-sahna.tik.ikki .qs-tel-ust, .qs-sahna.tik.ikki .qs-telefon { width: 168px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .qs-halqa, .qs-halqa-i, .qs-k.faol .q-variant, .qs-halqa-g .q-chip, .qs-chorla > .q-chip, .qs-flash.yangi .fc-card .fc-front { animation: none !important; }
          .qs-kv { display: none !important; }
          .qs-pop, .qs-chiziq-i, .qs-tel-ekran, .qs-eslatma, .qs-jonli, .qs-karta, .qs-belgi, .qs-belgi i, .qs-katak i, .qs-br-jonli, .qs-tasma-q, .qs-siz-yoq, .qs-sanoq-r { animation: none !important; transition: none !important; }
          .qs-jonli.ket { opacity: 0; } .qs-eslatma.h-xato { opacity: 0.35; }
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
        /* ⛶ kattalashtirish — skeletda tushib qolgan qoida (SABOQ 38); ikki klassli selektor: keyingi «.zoomable position relative» qoidasi uni bekor qilmasin (SABOQ 48, F-1006-386) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(920px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        /* ⛶ oynasi ekran markazida: ota-blokdagi animatsiya/transform «position: fixed» ni o'ziga bog'lamasin (F-1006-386) */
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
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
