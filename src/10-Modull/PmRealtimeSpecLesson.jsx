import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 12-Modul · 3-dars (PM + amaliyot) «Ekran o'zi yangilanishi uchun nimani yozasiz?» — kalit m10-03, 12 ekran.
// Manba-haqiqat: feedback/F-1006-12modul/03-PmRealtimeSpec-v3.md (GATE M 06.10.2026) + 03-FILTR.md; 07.10 pilot ko'rigi (QURUVCHI_SABOQ E 40–55). Kod — src/skelet/NamunaDars.jsx dan.
// Bitta vizual — TalabSahna (telefon + Backend [+ 2-telefon] + talab varag'i), bitta manba TALAB_SAHNA. O'qiydi: pm-m10d2-sxema, pm-m9d8-platforma (yo'q bo'lsa ham ishlaydi).
// Yozadi: pm-m10d3-talab (tayanch 8 shakli aynan; 4, 5-darslar o'qiydi). PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================
// RU-qoldiq istisnolari — Mentor repo'sidagi real qiymat (ekran va tugma nomi talabda, birinchi tilga olishda qavsda ruschasi) va nishon nomi:
// ru-qoldiq-istisno s2: o'yinlar o'yin
// ru-qoldiq-istisno s3: qo'shilaman
// ru-qoldiq-istisno s6: o'yinlar o'yin
// ru-qoldiq-istisno s7: qo'shilaman o'yinlar
// ru-qoldiq-istisno s11: gap

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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QKirish, QReja, QTushuncha, QTest, QTestJavob, QBlok, QKartochka, QYakun, QMustaqil, QQadamlar, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m10d3-v1', lessonTitle: { uz: "Ekran o'zi yangilanishi uchun nimani yozasiz?", ru: "Что написать, чтобы экран обновлялся сам?" } };
// 12 ekran (MD v3): kirish → reja → Mentor talabi → 1-savol → kam uchraydigan vaziyatlar → o'z talabingiz → amaliyot 1 → amaliyot 2 → yakuniy savol → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'talab', ru: 'требование' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'hodisalar', ru: 'события' }, l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'chekka holat', ru: 'крайний случай' }, l: 22, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'README', ru: 'README' }, l: 78, tp: 68, s: 13, d: 6.8 }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD ✔: s3 D · s8 B (yakuniy). `practice: -1` — sentinel (mustaqil ish, bloklar; signal PRACTICE_BASE + ekran).
const INLINE_KEYS = { s3: 3, s8: 1, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: "Talabning bo'limlari", ru: 'Разделы требования' },
    cards: [
      { ic: '1', h: { uz: "Hodisalar: kim nima qilganda qaysi hodisa kimga boradi, ekranda nima o'zgaradi.", ru: 'События: какое событие кому идёт, когда кто-то что-то делает, и что меняется на экране.' } },
      { ic: '2', h: { uz: "Ulanish holatlari: har holatda foydalanuvchi nimani ko'radi.", ru: 'Состояния соединения: что видит пользователь в каждом состоянии.' } },
      { ic: '3', h: { uz: 'Talabda yozilmagan joy agentning tanloviga qoladi.', ru: 'То, что не написано в требовании, остаётся на выбор агента.' }, ask: { uz: 'Internet uzilganda ekranda nima turishini kim hal qiladi — siz yoki agent?', ru: 'Кто решает, что будет на экране при обрыве интернета, — вы или агент?' } }
    ]
  },
  8: {
    title: { uz: 'Bugun nima tekshirildi', ru: 'Что проверили сегодня' },
    cards: [
      { ic: '1', h: { uz: "Tekshiruv so'rovidan keyin son pastga tortmasdan o'zgardi.", ru: 'После проверочного запроса число изменилось без потягивания вниз.' } },
      { ic: '2', h: { uz: 'Uchish rejimida belgi va ekran talabdagidek.', ru: 'В режиме полёта значок и экран — как в требовании.' } },
      { ic: '3', h: { uz: 'Chekka holatlar talabga yozildi — bugun tekshirilmadi.', ru: 'Крайние случаи записаны в требование — сегодня не проверялись.' }, ask: { uz: 'Agent «hammasi tayyor» desa, nimaga ishonasiz: uning so\'zigami yoki telefondagi songami?', ru: 'Если агент говорит «всё готово», чему вы верите: его словам или числу на телефоне?' } }
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

// ===== BITTA VIZUAL — «Talab va telefon» (163, 180): bitta manba TALAB_SAHNA; har ekran TalabSahna / Sahna / TalabVaraq ni ishlatadi (tayanch 9.16) =====
// qolip-maket: rt-samolyot rt-qoshil rt-bosh rt-ikon rt-tahrir rt-chek rt-ms-q rt-ed
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const halqa = (on) => (on ? 'rt-halqa' : undefined);
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* xotira yopiq — natija javobda qoladi */ } };
const TALAB_KEY = 'pm-m10d3-talab';
const SX_KEY = 'pm-m10d2-sxema';
const TREK_KEY = 'pm-m9d8-platforma';
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
// Bosish → narsa uchadi (SABOQ 19): portal — transformli ota-blokka bog'lanmasin
function useUchish() {
  const [uchlar, setUchlar] = useState([]);
  const kRef = useRef(0);
  const uch = useCallback((fromEl, toEl, matn) => {
    if (!fromEl || !toEl || kamHarakat() || typeof document === 'undefined') return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const k = ++kRef.current;
    setUchlar(u => [...u, { k, matn, x: a.left, y: a.top, dx: b.left - a.left, dy: b.top - a.top }]);
    setTimeout(() => setUchlar(u => u.filter(z => z.k !== k)), 820);
  }, []);
  const qatlam = typeof document !== 'undefined' && uchlar.length > 0
    ? createPortal(uchlar.map(z => <span key={z.k} className="rt-uch" style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
    : null;
  return [uch, qatlam];
}
// Navbatdagi tugma yoki natija ko'rinadigan joyga suriladi (desk ham): faqat dep o'zgarganda, block 'nearest'
function useKorin(dep, nishon) {
  const oldin = useRef(dep);
  useEffect(() => {
    if (oldin.current === dep) return undefined;
    oldin.current = dep;
    const t = setTimeout(() => {
      const el = typeof nishon === 'string' ? document.querySelector(nishon) : nishon && nishon.current;
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' });
    }, 260);
    return () => clearTimeout(t);
  }, [dep]); // eslint-disable-line
}
// Harfma-harf yozuv (0-ekran qutisi); reduced-motion yoki qayta kirishda — darhol to'liq
function useYozuv(matn, faol, darhol) {
  const [n, setN] = useState(darhol ? matn.length : 0);
  useEffect(() => {
    if (!faol) { setN(0); return undefined; }
    if (darhol || kamHarakat()) { setN(matn.length); return undefined; }
    let i = 0;
    setN(0);
    const id = setInterval(() => { i += 1; setN(i); if (i >= matn.length) clearInterval(id); }, 30);
    return () => clearInterval(id);
  }, [matn, faol, darhol]);
  return matn.slice(0, n);
}

// «Maydon Jamoa» nomi — 11-Modul tayanch 9.62 yashili (PM palitrasining ok yashilidan farqli; F-1006-389)
const MAYDON_RANG = '#2E9E4F';
const TALAB_SAHNA = {
  namunaOyin: { id: 1, vaqt: { uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' }, joy: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, bor: 8, kerak: 10 },
  nom: 'Maydon Jamoa',
  t1: { uz: '1-telefon · siz', ru: 'Телефон 1 · вы' },
  t2: { uz: "2-telefon · boshqa o'yinchi", ru: 'Телефон 2 · другой игрок' },
  y: {
    orqa: { uz: "‹ O'yinlar", ru: '‹ Игры' }, oyinlar: { uz: "O'yinlar", ru: 'Игры' }, kun: { uz: 'Shanba', ru: 'Суббота' },
    qoshil: { uz: "Qo'shilaman", ru: 'Присоединяюсь' }, qoshildi: { uz: "Qo'shildingiz", ru: 'Вы присоединились' },
    eski: { uz: 'eski', ru: 'старое' }, kelmadi: { uz: 'kelmadi', ru: 'не дошло' }, tiklangan: { uz: 'qayta tiklangan', ru: 'восстановлено' },
    ochiq: { uz: 'ochiq', ru: 'открыто' }, sorovN: { uz: "so'rov", ru: 'запрос' }, bosh: { uz: 'Bosh ekran', ru: 'Главный экран' }
  },
  kv: { sorov: { uz: "so'rov", ru: 'запрос' }, javob: { uz: 'javob', ru: 'ответ' }, hodisa: 'oyin-ozgardi' },
  // Uch ulanish holati — ranglar pilot 02 bilan bir: «Ulangan» ok · «Ulanmoqda…» accent · «Ulanmagan» ink2
  belgilar: {
    ulangan: { t: { uz: 'Ulangan', ru: 'Подключено' } },
    ulanmoqda: { t: { uz: 'Ulanmoqda…', ru: 'Подключается…' } },
    ulanmagan: { t: { uz: 'Ulanmagan', ru: 'Не подключено' } }
  },
  // Mentor talabi — tayanch 1.3 (so'zma-so'z), «Qayerda» — MD qarori (TAYANCHGA SAVOL 1); hodisalar — tayanch 1.2 jadvali (pilot 02 MENTOR_SXEMA bilan aynan; nusxa)
  mentor: {
    sarlavha: { uz: 'Mentor talabi · Maydon Jamoa', ru: 'Требование Ментора · Maydon Jamoa' },
    qayerda: { uz: "`backend/` — 2-darsdagi gateway va o'yin o'zgaradigan besh yo'l; `mobil/` — ulanish fayli, «O'yinlar» va «O'yin» ekranlari.", ru: "`backend/` — gateway из 2-го урока и пять путей, где меняется игра; `mobil/` — файл соединения, экраны «O'yinlar» («Игры») и «O'yin»." },
    hodisalar: [
      { id: 'q1', kimNima: { uz: "o'yinchi «Qo'shilaman» ni bosadi", ru: "игрок нажимает «Qo'shilaman» («Присоединяюсь»)" }, sabab: 'qoshildi', ekranda: { uz: "«8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi", ru: '«8 / 10» → «9 / 10», в списке новый игрок' } },
      { id: 'q2', kimNima: { uz: "o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa)", ru: 'игрок выходит из игры (если заходит следующий — то же событие)' }, sabab: 'chiqdi', ekranda: { uz: "son va ro'yxat yangilanadi", ru: 'число и список обновляются' } },
      { id: 'q3', kimNima: { uz: "o'yinchi «Kelaman» ni bosadi", ru: "игрок нажимает «Kelaman» («Приду»)" }, sabab: 'tasdiqladi', ekranda: { uz: '«Kelishini tasdiqladi: 7 / 9» → «8 / 9»', ru: '«Kelishini tasdiqladi: 7 / 9» → «8 / 9»' } },
      { id: 'q4', kimNima: { uz: "o'yinchi navbatga yoziladi", ru: 'игрок записывается в очередь' }, sabab: 'navbatga-yozildi', ekranda: { uz: '«Navbatda: 1»', ru: '«Navbatda: 1»' } },
      { id: 'q5', kimNima: { uz: "tashkilotchi o'yin e'lon qiladi", ru: 'организатор объявляет игру' }, sabab: 'elon-berildi', ekranda: { uz: "ro'yxatda yangi karta", ru: 'в списке новая карточка' } }
    ],
    kimOladi: { uz: 'hamma ulangan ilova', ru: 'все подключённые приложения' },
    holatlar: [
      { k: 'ulangan', t: { uz: "Ulangan — belgi «Ulangan», o'zgarishlar o'zi ko'rinadi.", ru: "Подключено — значок «Ulangan» («Подключено»), изменения видны сами." } },
      { k: 'ulanmoqda', t: { uz: "Ulanmoqda — belgi «Ulanmoqda…», ro'yxat ekranda qoladi (eskirgan bo'lishi mumkin).", ru: "Подключается — значок «Ulanmoqda…» («Подключается…»), список остаётся на экране (может быть устаревшим)." } },
      { k: 'ulanmagan', t: { uz: "Ulanmagan — belgi «Ulanmagan», pastga tortib yangilash ishlaydi.", ru: "Не подключено — значок «Ulanmagan» («Не подключено»), работает обновление потягиванием вниз." } }
    ],
    chekka: [
      { uz: "Internet uzilib qaytsa — ro'yxat yangi holatni ko'rsatsin.", ru: 'Если интернет пропал и вернулся — список показывает новое состояние.' },
      { uz: 'Bitta o\'zgarish ekranni bir marta yangilasin — ulanish qayta tiklangandan keyin ham.', ru: 'Одно изменение обновляет экран один раз — и после восстановления соединения тоже.' },
      { uz: "Ilova boshqa ekranda yoki fonda turganda o'zgarish bo'lsa — «O'yinlar»ga qaytganda yangi holat ko'rinsin.", ru: "Если изменение случилось, пока приложение на другом экране или в фоне, — при возврате в «O'yinlar» («Игры») видно новое состояние." }
    ],
    buzilmasin: { uz: "Kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin.", ru: 'Вход, объявление игры, присоединение, подтверждение, выход и очередь работают как раньше; обновление потягиванием вниз остаётся.' }
  },
  bolim: [{ uz: 'Hodisalar', ru: 'События' }, { uz: 'Ulanish holatlari', ru: 'Состояния соединения' }, { uz: 'Kam uchraydigan vaziyatlar', ru: 'Редкие ситуации' }],
  chekkaNom: { uz: 'Chekka holatlar', ru: 'Крайние случаи' },
  varaq: { qayerda: { uz: 'Qayerda', ru: 'Где' }, nima: { uz: 'Nima qilsin', ru: 'Что сделать' }, buz: { uz: 'Nima buzilmasin', ru: 'Что не сломать' } }
};
const TS = TALAB_SAHNA;
const MH = TS.mentor;
// Mentor talabining «Hodisalar» qatori 2-ekranda (MD so'zlari aynan)
const S2_QATOR = { uz: "o'yinchi «Qo'shilaman» ni bosadi · `oyin-ozgardi` · sabab `qoshildi` · hamma ulangan ilova · «8 / 10» → «9 / 10»", ru: "игрок нажимает «Qo'shilaman» («Присоединяюсь») · `oyin-ozgardi` · причина `qoshildi` · все подключённые приложения · «8 / 10» → «9 / 10»" };
const hodisaSatr = (r) => ({ uz: `${ou(r.kimNima)} | oyin-ozgardi · sabab ${r.sabab} | ${ou(MH.kimOladi)} | ${ou(r.ekranda)}`, ru: `${r.kimNima.ru} | oyin-ozgardi · причина ${r.sabab} | ${MH.kimOladi.ru} | ${r.ekranda.ru}` });

const UlanishBelgisi = ({ holat, className }) => {
  if (!holat) return null;
  const b = TS.belgilar[holat];
  return <span key={holat} className={cx('rt-belgi', holat, className)}><i className="rt-belgi-n" />{b && tr(b.t)}</span>;
};
const SamolyotIc = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5l8 2.5z" fill="currentColor" /></svg>
);
const Doiralar = ({ son, yangi }) => <span className="rt-doiralar" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} className={cx(son != null && i < son && 'bor', yangi && son != null && i === son - 1 && 'yangi')} />)}</span>;

// Telefon ichidagi ekranlar: oyin · oyinlar · bosh (bosh ekran — «Maydon Jamoa» belgisi: matnsiz yashil shakl + nom)
const TelEkran = ({ t }) => {
  const ekran = t.ekran || 'oyin';
  const o = TS.namunaOyin;
  const son = t.son ?? o.bor;
  if (ekran === 'bosh') return (
    <div className="rt-bosh-ekran">
      <button type="button" className={cx('rt-ikon', halqa(t.ikonHalqa))} disabled={!t.onIkon} onClick={t.onIkon}>
        <span className="rt-ikon-sh" aria-hidden="true" /><span className="rt-ikon-t">{TS.nom}</span>
      </button>
    </div>
  );
  if (ekran === 'oyinlar') return (
    <div className="rt-oyinlar">
      <div className="rt-ol-bosh"><b className="rt-ol-sar">{tr(TS.y.oyinlar)}</b><UlanishBelgisi holat={t.belgi} /></div>
      {t.tort && <span className="rt-tort fade-step" aria-hidden="true">↓</span>}
      <span className="rt-kun">{tr(TS.y.kun)}</span>
      <div className="rt-karta">
        <b>{tr(o.vaqt)}</b><span>{tr(o.joy)}</span>
        <span className="rt-karta-son"><b key={String(son) + (t.sonK || 0)} className={cx(t.sonYangi && 'rt-pop')}>{son}</b> / {o.kerak}{t.eski && <em className="rt-eski">{tr(TS.y.eski)}</em>}</span>
      </div>
    </div>
  );
  return (
    <div className="rt-oyin">
      <span className="rt-oyin-orqa">{tr(TS.y.orqa)}</span>
      <b className="rt-oyin-sar">{tr(o.vaqt)}</b>
      <span className="rt-oyin-joy">{tr(o.joy)}</span>
      <span className="rt-hisob"><b key={String(son) + (t.sonK || 0)} className={cx('rt-son', t.sonYangi && 'yangi')}>{son}</b> / {o.kerak}{t.eski && <em className="rt-eski">{tr(TS.y.eski)}</em>}</span>
      <Doiralar son={son} yangi={t.sonYangi} />
      {!t.qoshilYoq && <button type="button" className={cx('rt-qoshil', t.qoshildi && 'off', halqa(t.qoshilHalqa))} disabled={!t.onQoshil || t.qoshildi} onClick={t.onQoshil}>{tr(t.qoshildi ? TS.y.qoshildi : TS.y.qoshil)}</button>}
    </div>
  );
};
// Telefon — o'lchami barqaror 172×272 (SABOQ 22), yorliq ramka ustida (SABOQ 23), nom o'z rangida (logotip yo'q, D4); holat qatorida samolyot, pastda bosh ekran chizig'i
const Telefon = ({ no, t = {} }) => (
  <div className="rt-tel-ust">
    {t.tex ? <span className="rt-tel-yorliq tex">{t.tex}</span> : <span className={cx('rt-tel-yorliq', no === 1 ? 'b1' : 'b2')}>{tr(no === 1 ? TS.t1 : TS.t2)}</span>}
    <div className="rt-telefon">
      <div className="rt-tel-bar">
        <span className="rt-tel-nom">{TS.nom}</span>
        {t.samolyot !== undefined && (
          <button type="button" className={cx('rt-samolyot', t.samolyot && 'on', halqa(t.samolyotHalqa))} disabled={!t.onSamolyot} onClick={t.onSamolyot}
            aria-label={tr({ uz: 'Uchish rejimi', ru: 'Режим полёта' })} aria-pressed={!!t.samolyot}><SamolyotIc /></button>
        )}
      </div>
      <div className="rt-tel-ekran" key={t.ekran || 'oyin'}><TelEkran t={t} /></div>
      <button type="button" className={cx('rt-bosh', halqa(t.boshHalqa))} disabled={!t.onBosh} onClick={t.onBosh} aria-label={tr(TS.y.bosh)}><i /></button>
    </div>
    {t.osti}
  </div>
);
const BackendTugun = ({ b = {} }) => (
  <div className="rt-be-ust">
    <div className="rt-be-joy">
      <div className="rt-backend">
        <span className="rt-be-nom">Backend</span>
        <span className="rt-db">Database: <b key={b.db} className={cx(b.dbYangi && 'rt-pop')}>{b.db ?? 8}</b></span>
      </div>
    </div>
  </div>
);
// Konvert chiziq bo'ylab uchadi: yon 'be' — telefondan Backend'ga, 'tel' — Backend'dan telefonga; toxta 'sonadi' — uzilgan joyda so'nadi
const Konvert = ({ k, no, tik }) => {
  if (!k) return null;
  const telBosh = tik || no === 1;
  const ab = telBosh ? k.yon === 'be' : k.yon !== 'be';
  const anim = `rt-kv-${tik ? 'y' : 'x'}-${k.toxta || (ab ? 'ab' : 'ba')}`;
  const y = k.yorliq !== undefined ? k.yorliq : TS.kv[k.tur];
  return <span className={cx('rt-kv', k.tur, k.toxta)} style={{ animationName: anim }}><i className="rt-kv-i" />{y && <b className="rt-kv-y">{tr(y)}</b>}</span>;
};
// Chiziq holatlari: yoq · sorov · ochiq · uzilgan · uzildi · tiklan
const Chiziq = ({ holat = 'yoq', no, tik, k, yorliq, yorliqOk }) => (
  <div className={cx('rt-chiziq', tik ? 'tik' : 'yot', `n${no}`, `h-${holat}`)}>
    <span className="rt-chiziq-i" key={'i-' + holat} />
    {(holat === 'uzilgan' || holat === 'tiklan') && <b className={cx('rt-chiziq-r', holat === 'tiklan' && 'aylan')} aria-hidden="true">↻</b>}
    {yorliq && <b className={cx('rt-chiziq-y', yorliqOk ? 'ok ost' : 'past')}>{tr(yorliq)}</b>}
    <Konvert key={k ? 'kv-' + k.id : 'kv-yoq'} k={k} no={no} tik={tik} />
  </div>
);
// Sahna: chapda «1-telefon · siz», o'rtada Backend, o'ngda «2-telefon · boshqa o'yinchi» (bitta telefonli ekranda — telefon va Backend). ixcham (yoki telefon) — telefonlar tepada, Backend pastda
const Sahna = ({ t1, t2, be, c1, c2, k1, k2, y1, y1ok, ixcham }) => {
  const mob = useIsMobile(640);
  const tik = !!(ixcham || mob);
  const ikki = !!t2;
  return (
    <div className={cx('rt-sahna', tik ? 'tik' : 'yot', ikki ? 'ikki' : 'bir', !be && 'bes')}>
      <div className="rt-s-t1"><Telefon no={1} t={t1} /></div>
      {be && <div className="rt-s-c1"><Chiziq holat={c1} no={1} tik={tik} k={k1} yorliq={y1} yorliqOk={y1ok} /></div>}
      {be && <div className="rt-s-be"><BackendTugun b={be} /></div>}
      {ikki && be && <div className="rt-s-c2"><Chiziq holat={c2} no={2} tik={tik} k={k2} /></div>}
      {ikki && <div className="rt-s-t2"><Telefon no={2} t={t2} /></div>}
    </div>
  );
};
// Talab varag'idagi bitta bo'lim: holat 'joy' (uzuq chiziqli uya, raqam bilan) · 'bor' · 'yangi' (bir lahza yashil) · joriy — navbatdagi uya (accent)
const VBolim = ({ b }) => (
  <div className={cx('rt-vb', b.holat || 'bor', b.joriy && 'joriy')}>
    <span className="rt-vb-h"><i>{b.n}</i>{b.nom && <b key={String(b.nomK || 0)} className={cx(b.nomYangi && 'rt-yashil')}>{b.nom}</b>}{b.son && <em className="rt-vb-son">{b.son}</em>}{b.tahrir}</span>
    {(b.qatorlar || []).map((q, i) => <span key={i} className={cx('rt-vb-q', q.on && 'on', q.yangi && 'yangi')}>{q.t}</span>)}
    {Array.from({ length: b.bosh || 0 }, (_, i) => <span key={'b' + i} className="rt-vb-bosh">?</span>)}
    {b.izoh && <span className="rt-vb-iz">{b.izoh}</span>}
  </div>
);
// Talab varag'i: Qayerda · Nima qilsin (uch bo'lim) · Nima buzilmasin. kulrang — «Qayerda» va «Nima buzilmasin» xira (2-ekran boshi)
const TalabVaraq = ({ sarlavha, qayerda, bolimlar = [], buzilmasin, buzKulrang, tahrir = {}, kulrang, ixcham, className, children }) => (
  <div className={cx('rt-varaq', ixcham && 'ixcham', className)}>
    <span className="rt-v-sar">{sarlavha || tr(MH.sarlavha)}</span>
    {qayerda !== undefined && <div className={cx('rt-v-qator', kulrang && 'kul')}><b>{tr(TS.varaq.qayerda)}:</b> <span>{qayerda}</span>{tahrir.qayerda}</div>}
    <div className="rt-v-nima"><b className="rt-v-l">{tr(TS.varaq.nima)}:</b>{bolimlar.map(b => <VBolim key={b.n} b={b} />)}</div>
    {buzilmasin !== undefined && <div className={cx('rt-v-qator', kulrang && 'kul')}><b>{tr(TS.varaq.buz)}:</b> {buzilmasin ? <span>{buzilmasin}</span> : <em className="rt-v-kul">{buzKulrang}</em>}{tahrir.buzilmasin}</div>}
    {children}
  </div>
);
// Darsning bitta vizuali: chapda sahna (telefon + Backend [+ 2-telefon]), o'ngda talab varag'i; yorliq — sahna tepasida
const TalabSahna = ({ sahna, varaq, yorliq, className }) => (
  <div className={cx('rt-ts', !varaq && 'yolgiz', className)}>
    {sahna && <div className="rt-ts-s">{yorliq && <span className="rt-ts-y fade-step" key={String(yorliq.uz || yorliq)}>{tr(yorliq)}</span>}<Sahna {...sahna} /></div>}
    {varaq && <div className="rt-ts-v">{varaq}</div>}
  </div>
);

// Ballsiz bashorat: tanlangach ixcham qator bo'lib natijagacha turadi (SABOQ 11); har chipning o'z yengil chegarasi (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="rt-halqa-g"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="rt-bash-ix fade-step"><span>{tr(savol)}</span><span className="rt-bash-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></span></div>);
// Taxmin natijasi — yashil xulosaning birinchi, kichik qatori (E 42)
const Natija = ({ togri, haqiqat, haqYorliq }) => (togri
  ? <span className="rt-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="rt-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr(haqYorliq || { uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
// Bitta yashil quti: taxmin qatori · xulosa · izoh (E 42)
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="rt-x-m">{matn}</span>{izoh && <span className="rt-x-iz">{izoh}</span>}</>;
// O'qituvchi eslatmasi — faqat Mentor rejimida (MD aytgan joyda)
const Ustoz = ({ matn }) => {
  const { isMentor } = useJonli();
  if (!isMentor) return null;
  return <div className="rt-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{(Array.isArray(matn) ? matn : [matn]).map((m, i) => <span key={i}>{tx(m)}</span>)}</div>;
};

// ===== SCREEN 0 — KIRISH (QKirish: ikki telefon + agentga bo'sh quti; tanlangan gap qutiga harfma-harf yoziladi, ostida uch «?» uya; ballsiz — J-026) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "«Ro'yxat o'zi yangilansin» degan bitta gapni", ru: 'Одной фразой «Пусть список обновляется сам»' } },
  { id: 'b', label: { uz: 'Sxemadagi har hodisani alohida qator qilib', ru: 'Каждое событие из схемы отдельной строкой' } },
  { id: 'c', label: { uz: 'Hodisalarni va ulanish uzilgandagi ekranni', ru: 'События и экран при обрыве соединения' } }
];
const HOOK_JAVOB = {
  c: { uz: <><b>Aynan!</b> Hodisalar va uzilishdagi ekran — talabning ikki bo'limi. Yana bitta bo'lim bor, uni ham ochasiz.</>, ru: <><b>Именно!</b> События и экран при обрыве — два раздела требования. Есть ещё один раздел, его вы тоже откроете.</> },
  b: { uz: <><b>Qiziq fikr!</b> Hodisalar — talabning bir qismi. Ulanish uzilganda ekranda nima turishini ham agent bilishi kerak.</>, ru: <><b>Интересная мысль!</b> События — часть требования. Что будет на экране при обрыве соединения, агенту тоже нужно знать.</> },
  a: { uz: <><b>Qiziq fikr!</b> Bitta gapda qaysi o'zgarish va qaysi ekran ekani yozilmagan — bu agentning tanloviga qoladi.</>, ru: <><b>Интересная мысль!</b> В одной фразе не написано, какое изменение и какой экран, — это остаётся на выбор агента.</> }
};
const AgentQuti = ({ matn, darhol }) => {
  const yozuv = useYozuv(matn || '', !!matn, darhol);
  useKorin(matn, '.rt-agent');
  return (
    <div className="rt-agent">
      <div className="rt-agent-bar"><i /><i /><i /><span>{tr({ uz: 'Agentga talab', ru: 'Требование агенту' })}</span></div>
      <div className="rt-agent-tana">
        <span className="rt-agent-matn">{yozuv}<span className="rt-kursor" aria-hidden="true" /></span>
        {matn && yozuv.length >= matn.length && <span className="rt-agent-uyalar fade-step">{[0, 1, 2].map(i => <span key={i} className="rt-uya">?</span>)}</span>}
      </div>
    </div>
  );
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = storedAnswer?.picked != null;
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const op = HOOK_OPTS.find(o => o.id === picked);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('rt-k', picked === null && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Ekran o'zi yangilanishi uchun <A>nimani yozasiz?</A></>, ru: <>Что написать, чтобы <A>экран обновлялся сам?</A></> })}
          mentor={<Mentor>{tr({ uz: "2-darsda ilovangiz Backend'ga ulandi, sxemangiz ham tayyor — agentga nima yozishingizni tanlang.", ru: 'На 2-м уроке ваше приложение подключилось к Backend, схема тоже готова — выберите, что написать агенту.' })}</Mentor>}
          maket={<div className="rt-s0">
            <Sahna ixcham t1={{ ekran: 'oyin', son: 8, qoshilYoq: true }} t2={{ ekran: 'oyin', son: 8, qoshilYoq: true }} be={{ db: 8 }} c1="ochiq" c2="yoq" />
            <AgentQuti matn={op ? tr(op.label) : ''} darhol={avval} />
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        >
          <Ustoz matn={[{ uz: "Qo'l ko'tartirib so'rang: «2-darsda kimning ilovasida belgi «Ulangan» bo'ldi?» — bo'lmaganlar bugun 2-darsning birinchi amaliyotini tugatadi; ularda bu darsning ikki amaliyoti uyga qoladi — yakun shuni aytadi.", ru: 'Попросите поднять руку: «У кого на 2-м уроке значок стал «Ulangan»?» — у кого нет, сегодня доделывают первую практику 2-го урока; обе практики этого урока у них уходят домой — итог это скажет.' }, { uz: 'Uchala variant teng: hodisalar ham, uzilish ham — Mentor talabida bor.', ru: "Все три варианта равноценны: и события, и обрыв — есть в требовании Ментора." }]} />
        </QKirish>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda kulrang yorliq + vizual bir marta o'zi yuradi — varaqdagi uch bo'lim uyasi (raqam bilan, nomsiz — 2-ekran kashfiyoti), telefonda «8 / 10» → «9 / 10») =====
const REJA = [
  { t: { uz: "Mentor talabini bo'lim-bo'lim ko'rasiz", ru: "Разберёте требование Ментора по разделам" }, teg: { uz: 'talab', ru: 'требование' } },
  { t: { uz: "Kam uchraydigan vaziyatlarni ko'rasiz", ru: "Разберёте редкие ситуации" }, teg: { uz: 'chekka holatlar', ru: 'крайние случаи' } },
  { t: { uz: "O'z mahsulotingiz uchun talab yozasiz", ru: 'Напишете требование для своего продукта' }, teg: { uz: 'real vaqt talabi', ru: "требование к реальному времени" } },
  { t: { uz: 'Agent quradi, siz telefonda tekshirasiz', ru: 'Агент строит, вы проверяете на телефоне' }, teg: { uz: 'tekshirish', ru: 'проверка' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [f, setF] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[500, () => setF(1)], [500, () => setF(2)], [500, () => setF(3)], [900, () => setF(4)]]); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun agentga talab yozasiz va <A>natijani tekshirasiz.</A></>, ru: <>Сегодня — требование агенту и <A>проверка результата.</A></> })}
        mentor={<Mentor>{tr({ uz: "2-darsdagi sxemangiz bugun talabga aylanadi. Kodni agent yozadi, qaror va tekshiruv — sizdan.", ru: 'Ваша схема со 2-го урока сегодня станет требованием. Код пишет агент, решение и проверка — за вами.' })}</Mentor>}
        chapYorliq={tr({ uz: 'real vaqt talabi: hodisalar, ulanish holatlari, chekka holatlar', ru: "требование к реальному времени: события, состояния соединения, крайние случаи" })}
        chap={<div className="rt-reja">
          <Telefon no={1} t={{ ekran: 'oyinlar', belgi: 'ulangan', son: f >= 4 ? 9 : 8, sonYangi: f >= 4 }} />
          <TalabVaraq ixcham bolimlar={[1, 2, 3].map(n => ({ n, holat: f >= n ? 'joy' : 'yashirin' }))} />
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <p className="rt-reja-past">{tx({ uz: "repo `maydon-jamoa` · boshlang'ich holat `m12-dars-03-start` · namuna `m12-dars-03-done` — amaliyotlarni o'z mahsulotingizda bajarasiz.", ru: 'репозиторий `maydon-jamoa` · начальное состояние `m12-dars-03-start` · образец `m12-dars-03-done` — практики выполняете в своём продукте.' })}</p>
        <Ustoz matn={[{ uz: "Darsning og'ir qismi — Amaliyot 1 (Backend + ilova + Render). 2–4-ekranlarga ortiqcha vaqt bermang.", ru: 'Тяжёлая часть урока — Практика 1 (Backend + приложение + Render). Не тратьте лишнее время на экраны 2–4.' }, { uz: "2-darsdagi sxema saqlanmagan o'quvchi mustaqil ishda hodisa qatorlarini o'zi yozadi.", ru: 'Ученик, у которого не сохранилась схема 2-го урока, пишет строки событий сам в самостоятельной работе.' }]} />
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — MENTOR TALABI (QTushuncha markaziy: bashorat → «Keyingi bo'lim» ×3 → sahna va varaq o'zgaradi → nom → yashil xulosa; tugagach varaq fokusga, DE-199) =====
const S2_TAXMIN = [{ k: 'hech', t: { uz: 'Hech narsa', ru: 'Ничего' } }, { k: 'bir', t: { uz: 'Bir-ikkitasi', ru: "Одна-две вещи" } }, { k: 'kop', t: { uz: "Ko'p narsa", ru: 'Многое' } }];
const S2_SAVOL = { uz: "Agentga faqat «ro'yxat o'zi yangilansin» deb yozilsa, nechta narsa uning tanloviga qoladi?", ru: "Если агенту написать только «пусть список обновляется сам», сколько вещей останется на его выбор?" };
const navYorliq = (taxmin, q, jami, qadamY, done) => (done ? { uz: 'Davom etish', ru: 'Продолжить' }
  : !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' }
    : { uz: `${qadamY.uz} (${q}/${jami})`, ru: `${qadamY.ru} (${q}/${jami})` });
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [band, setBand] = useState(false);
  const [sh, setSh] = useState(() => ({ db: avval ? 9 : 8, son: avval ? 9 : 8, c1: 'ochiq', k1: null, belgi: 'ulangan', tort: false, hol: avval ? 3 : 0, holOn: -1, yangiB: -1 }));
  const up = (p) => setSh(s => ({ ...s, ...p }));
  const ketma = useKetma();
  const done = q >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useKorin(band ? -1 : q, '.rt-v-tug');
  useKorin(tugadi, '.q-xulosa');
  const keyingi = () => {
    if (!taxmin || band || done) return;
    setBand(true);
    if (q === 0) {
      up({ db: 9, dbYangi: true });
      ketma([[350, () => up({ k1: { id: 'h', tur: 'hodisa', yon: 'tel', yorliq: 'oyin-ozgardi · qoshildi' } })],
        [950, () => up({ k1: { id: 's', tur: 'sorov', yon: 'be' } })],
        [950, () => up({ k1: { id: 'j', tur: 'javob', yon: 'tel' } })],
        [950, () => { up({ k1: null, son: 9, yangiB: 0 }); setQ(1); setBand(false); }],
        [1100, () => up({ yangiB: -1 })]]);
    } else if (q === 1) {
      ketma([[150, () => up({ hol: 1, holOn: 0 })],
        [1200, () => up({ belgi: 'ulanmoqda', c1: 'uzilgan', hol: 2, holOn: 1 })],
        [1200, () => up({ belgi: 'ulanmagan', c1: 'yoq', tort: true, hol: 3, holOn: 2 })],
        [1400, () => up({ belgi: 'ulangan', c1: 'ochiq', tort: false, holOn: 0 })],
        [900, () => { up({ holOn: -1 }); setQ(2); setBand(false); }]]);
    } else {
      up({ yangiB: 2 }); setQ(3); setBand(false);
      ketma([[1100, () => up({ yangiB: -1 })]]);
    }
  };
  const bolimlar = [
    q >= 1 ? { n: 1, nom: tr(TS.bolim[0]), holat: sh.yangiB === 0 ? 'yangi' : 'bor', qatorlar: [{ t: tx(S2_QATOR) }], izoh: tr({ uz: '+ yana 4 qator — 2-darsdagi sxemadan', ru: '+ ещё 4 строки — из схемы 2-го урока' }) } : { n: 1, holat: 'joy', joriy: !!taxmin },
    q >= 2 || sh.hol > 0 ? { n: 2, nom: tr(TS.bolim[1]), qatorlar: MH.holatlar.slice(0, sh.hol).map((h, i) => ({ t: tr(h.t), on: sh.holOn === i })) } : { n: 2, holat: 'joy', joriy: q === 1 },
    q >= 3 ? { n: 3, nom: tr(TS.bolim[2]), holat: sh.yangiB === 2 ? 'yangi' : 'bor', bosh: 3 } : { n: 3, holat: 'joy', joriy: q === 2 }
  ];
  const varaq = (
    <TalabVaraq kulrang={!done} qayerda={tx(MH.qayerda)} buzilmasin={tr(MH.buzilmasin)} bolimlar={bolimlar}>
      {!tugadi && <div className="rt-v-tug"><QTugma className={halqa(taxmin && !band && !done)} disabled={!taxmin || band || done} onClick={keyingi}>{tr({ uz: "Keyingi bo'lim", ru: 'Следующий раздел' })} <span className="rt-nq">{Math.min(q + (done ? 0 : 1), 3)}/3</span></QTugma></div>}
    </TalabVaraq>
  );
  const mentor = !taxmin ? { uz: "Avval javobingizni belgilang, keyin Mentor talabini bo'lim-bo'lim oching.", ru: 'Сначала отметьте ответ, потом открывайте требование Ментора по разделам.' }
    : q < 2 ? { uz: "Varaqdagi «Keyingi bo'lim»ni bosing — telefon shu bo'limni ko'rsatadi.", ru: "Нажмите на листе «Следующий раздел» — телефон покажет, что в нём написано." }
      : q === 2 ? { uz: "Oxirgi bo'limni oching — uning qatorlari hozircha bo'sh.", ru: 'Откройте последний раздел — его строки пока пустые.' }
        : { uz: "11-Modulda PRD yozgansiz — u nima qurilishini aytadi; real vaqt talabi esa o'zgarish qanday ko'rinishini.", ru: "В 11-м модуле вы писали PRD — он говорит, что строится; а требование к реальному времени — как выглядит изменение." };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · talab', ru: 'Понятие · требование' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 3, { uz: "Keyingi bo'lim", ru: 'Следующий раздел' }, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mentor talabida real vaqt uchun <A>nima yozilgan?</A></>, ru: <>Что в требовании Ментора <A>для реального времени?</A></> })}
        mentor={<Mentor>{tr(mentor)}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={S2_SAVOL} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="rt-viz">
          {tugadi ? varaq : <TalabSahna sahna={{ t1: { ekran: 'oyinlar', belgi: sh.belgi, son: sh.son, sonYangi: sh.son === 9 && !avval, tort: sh.tort }, be: { db: sh.db, dbYangi: sh.dbYangi }, c1: sh.c1, k1: sh.k1 }} varaq={varaq} />}
          {done && <p className="rt-nom fade-step">{tr({ uz: <>Talabning real vaqt funksiyasi uchun uch bo'limi — <b>real vaqt talabi</b>.</>, ru: <>Три раздела требования для функции реального времени — <b>требование к реальному времени</b>.</> })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'kop'} haqiqat={{ uz: "Mentor talabida ko'p narsa yozilgan — yozilmasa, ular agentning tanloviga qolardi", ru: "в требовании Ментора написано многое — иначе всё это осталось бы на выбор агента" }} />} matn={tr({ uz: "Bu darsda real vaqt talabi uch bo'limdan iborat va «Nima qilsin» qatorini aniq qiladi.", ru: "В этом уроке требование к реальному времени состоит из трёх разделов и уточняет строку «Что сделать»." })} />}
      >
        <Ustoz matn={[{ uz: "«Hodisalar» bo'limi — 2-darsdagi sxemaning o'zi, yangi narsa yozilmaydi. Sinfga savol: «Ulanish holatlari bo'limi yozilmasa, internet uzilganda agent ekranga nima qo'yadi?» — mumkin javob: agentning tanloviga qoladi (bo'sh ro'yxat, xato oynasi yoki boshqa narsa).", ru: 'Раздел «События» — это сама схема 2-го урока, нового не пишем. Вопрос классу: «Если не написать раздел состояний соединения, что агент покажет при обрыве интернета?» — возможный ответ: это на выбор агента (пустой список, окно ошибки или что-то ещё).' }, { uz: "Uchinchi bo'limni bu yerda tushuntirmang — uning qatorlari 4-ekranda vaziyatlar bilan yoziladi.", ru: 'Третий раздел здесь не объясняйте — его строки пишутся на 4-м экране вместе с ситуациями.' }]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ D, INLINE_KEYS.s3 = 3; savol ustida kichik varaq — faqat 1-bo'lim; savol ustida yorliq yo'q — SABOQ 6) =====
const KATAK = [{ uz: 'Kim nima qiladi', ru: 'Кто что делает' }, { uz: 'Hodisa', ru: 'Событие' }, { uz: 'Kim oladi', ru: 'Кто получает' }, { uz: "Ekranda nima o'zgaradi", ru: 'Что меняется на экране' }];
const MiniVaraq = ({ children }) => <div className="rt-mini"><span className="rt-v-sar">{tr(MH.sarlavha)}</span>{children}</div>;
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Talabda faqat Hodisalar bo'limi yozilgan. Bu talab nimani aytmaydi?"
    question={<><MiniVaraq><b className="rt-v-l">{tr(TS.varaq.nima)}: 1 · {tr(TS.bolim[0])}</b>
      <div className="rt-mini-j"><div className="rt-mini-r bosh">{KATAK.map((k, i) => <span key={i}>{tr(k)}</span>)}</div><div className="rt-mini-r"><span>{tr(MH.hodisalar[0].kimNima)}</span><span><code>oyin-ozgardi</code> · {tr({ uz: 'sabab', ru: 'причина' })} <code>qoshildi</code></span><span>{tr(MH.kimOladi)}</span><span>«8 / 10» → «9 / 10»</span></div></div></MiniVaraq>
      <h2 className="title h-ask">{tr({ uz: <>Talabda faqat Hodisalar bo'limi yozilgan. Bu talab <A>nimani aytmaydi?</A></>, ru: <>В требовании написан только раздел «События». <A>Чего это требование не говорит?</A></> })}</h2></>}
    options={[
      { uz: 'Hodisa qachon yuborilishini', ru: 'Когда отправляется событие' },
      { uz: 'Hodisani qaysi ilovalar olishini', ru: 'Какие приложения получают событие' },
      { uz: "Ulanish bor paytdagi o'zgarishni", ru: 'Изменение, пока соединение есть' },
      { uz: "Ulanish yo'q paytdagi ekranni", ru: 'Экран, пока соединения нет' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Ulanish yo'q paytdagi ekranni Hodisalar bo'limi aytmaydi.", ru: 'Экран без соединения раздел «События» не описывает.' }}
    explainWrong={{
      0: { uz: 'Hodisalar qatorining birinchi katagiga qarang.', ru: 'Посмотрите на первую ячейку строки событий.' },
      1: { uz: 'Qatordagi «Kim oladi» katagi nimani aytadi?', ru: 'Что говорит ячейка «Кто получает» в строке?' },
      2: { uz: 'Bu qatorning oxirgi katagida yozilgan.', ru: 'Это написано в последней ячейке строки.' }
    }} />
);

// ===== SCREEN 4 — KAM UCHRAYDIGAN VAZIYATLAR (QTushuncha: bashorat → uch vaziyat sahnada, har biri varaqqa qator bo'lib tushadi → nom «chekka holat», sarlavha almashadi) =====
const S4_TAXMIN = [{ k: 'zahoti', t: { uz: "O'sha zahoti", ru: 'Сразу же' } }, { k: 'qaytganda', t: { uz: 'Ulanish qaytganda', ru: 'Когда соединение вернётся' } }, { k: 'tort', t: { uz: 'Pastga tortganda', ru: "Когда потянете вниз" } }];
const S4_SAVOL = { uz: 'Internet bir necha soniyaga uzilib qaytdi. Shu payt bo\'lgan qo\'shilish birinchi telefonda qachon ko\'rinadi?', ru: 'Интернет пропал на несколько секунд и вернулся. Когда присоединение в этот момент станет видно на первом телефоне?' };
const S4_BOSH = { c1: 'ochiq', c2: 'ochiq', k1: null, k2: null, y1: null, y1ok: false, belgi: 'ulangan', samolyot: false, db: 8, dbYangi: false, t1son: 8, t1sonK: 0, t1yangi: false, t1eski: false, t1ekran: 'oyinlar', t2son: 8, t2qoshildi: false, sorovN: 0, ikonHalqa: false, faol: false };
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [vq, setVq] = useState(avval ? 3 : 0);
  const [yangiQ, setYangiQ] = useState(-1);
  const [sh, setSh] = useState(S4_BOSH);
  const up = (p) => setSh(s => ({ ...s, ...p }));
  const ketma = useKetma();
  const done = vq >= 3;
  const tugadi = useTugadi(done, 1500, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useKorin(tugadi, '.q-xulosa');
  const yozildi = (i) => { setVq(i + 1); setYangiQ(i); ketma([[1200, () => setYangiQ(-1)]]); };
  const tayyor = taxmin && !sh.faol && !done;
  // 1-vaziyat: samolyot → uzilish → 2-telefonda qo'shilish → konvert uzilgan joyda so'nadi («kelmadi») → ~2 s → qayta ulanish → «8 / 10 · eski»
  const v1 = () => {
    if (!tayyor || vq !== 0) return;
    up({ faol: true, samolyot: true, c1: 'uzilgan', belgi: 'ulanmoqda' });
    ketma([[900, () => up({ t2qoshildi: true, c2: 'sorov', k2: { id: 's2a', tur: 'sorov', yon: 'be' } })],
      [950, () => up({ k2: null, c2: 'ochiq', db: 9, dbYangi: true, t2son: 9 })],
      [400, () => up({ k1: { id: 'h1', tur: 'hodisa', yon: 'tel', toxta: 'sonadi' } })],
      [1000, () => up({ k1: null, y1: TS.y.kelmadi, y1ok: false })],
      [2000, () => up({ samolyot: false, c1: 'tiklan', y1: null })],
      [2000, () => up({ c1: 'ochiq', belgi: 'ulangan', t1eski: true })],
      [500, () => yozildi(0)],
      // 2-vaziyat boshi: sahna yangidan, 1-telefon chizig'i bir lahza uzilib ↻ bilan tiklanadi — «qayta tiklangan»
      [1800, () => setSh({ ...S4_BOSH, faol: true, c1: 'uzildi' })],
      [500, () => up({ c1: 'tiklan', y1: TS.y.tiklangan, y1ok: true })],
      [1600, () => up({ c1: 'ochiq', faol: false })]]);
  };
  // 2-vaziyat: «Qo'shilaman» → bitta hodisa → 1-telefondan ikki so'rov, «9 / 10» ikki marta yonadi, «so'rov: 2»
  const v2 = () => {
    if (!tayyor || vq !== 1) return;
    up({ faol: true, t2qoshildi: true, c2: 'sorov', k2: { id: 's2b', tur: 'sorov', yon: 'be' } });
    ketma([[950, () => up({ k2: null, c2: 'ochiq', db: 9, dbYangi: true, t2son: 9 })],
      [400, () => up({ k1: { id: 'h2', tur: 'hodisa', yon: 'tel' } })],
      [950, () => up({ k1: { id: 'so1', tur: 'sorov', yon: 'be' } })],
      [950, () => up({ k1: { id: 'j1', tur: 'javob', yon: 'tel' } })],
      [950, () => up({ k1: null, t1son: 9, t1yangi: true, t1sonK: 1, sorovN: 1 })],
      [350, () => up({ k1: { id: 'so2', tur: 'sorov', yon: 'be' } })],
      [950, () => up({ k1: { id: 'j2', tur: 'javob', yon: 'tel' } })],
      [950, () => up({ k1: null, t1sonK: 2, sorovN: 2 })],
      [600, () => yozildi(1)],
      [1800, () => setSh({ ...S4_BOSH })]]);
  };
  // 3-vaziyat: bosh ekran → 2-telefonda qo'shilish (1-telefonga konvert chizilmaydi — 03-FILTR 5) → belgi halqada → ochiladi, «8 / 10 · eski»
  const v3 = () => {
    if (!tayyor || vq !== 2) return;
    up({ faol: true, t1ekran: 'bosh' });
    ketma([[900, () => up({ t2qoshildi: true, c2: 'sorov', k2: { id: 's2c', tur: 'sorov', yon: 'be' } })],
      [950, () => up({ k2: null, c2: 'ochiq', db: 9, dbYangi: true, t2son: 9 })],
      [700, () => up({ ikonHalqa: true })]]);
  };
  const ikon = () => {
    if (!sh.ikonHalqa) return;
    up({ ikonHalqa: false, t1ekran: 'oyinlar', t1eski: true });
    ketma([[700, () => { up({ faol: false }); yozildi(2); }]]);
  };
  const t1 = {
    ekran: sh.t1ekran, belgi: sh.belgi, son: sh.t1son, sonYangi: sh.t1yangi, sonK: sh.t1sonK, eski: sh.t1eski,
    samolyot: sh.samolyot, onSamolyot: tayyor && vq === 0 ? v1 : null, samolyotHalqa: tayyor && vq === 0,
    onBosh: tayyor && vq === 2 ? v3 : null, boshHalqa: tayyor && vq === 2,
    onIkon: sh.ikonHalqa ? ikon : null, ikonHalqa: sh.ikonHalqa,
    osti: sh.sorovN > 0 && <span className="rt-sanoq fade-step" key={sh.sorovN}>{tr(TS.y.sorovN)}: <b>{sh.sorovN}</b></span>
  };
  const t2 = { ekran: 'oyin', son: sh.t2son, sonYangi: sh.t2son === 9, qoshildi: sh.t2qoshildi, onQoshil: tayyor && vq === 1 ? v2 : null, qoshilHalqa: tayyor && vq === 1 };
  const bolim = { n: 3, nom: done ? tr(TS.chekkaNom) : tr(TS.bolim[2]), nomK: done ? 1 : 0, nomYangi: done && !avval, qatorlar: MH.chekka.slice(0, vq).map((c, i) => ({ t: tr(c), yangi: yangiQ === i })), bosh: 3 - vq };
  const vNo = Math.min(vq + 1, 3);
  const mentor = !taxmin ? { uz: "Avval javobingizni belgilang, keyin uch vaziyatni birma-bir ko'ring.", ru: 'Сначала отметьте ответ, потом посмотрите три ситуации по одной.' }
    : done ? { uz: "Talab har vaziyatda nima bo'lishi kerakligini aytadi — qanday qilish agentning tanloviga qoladi.", ru: 'Требование говорит, что должно быть в каждой ситуации, — как это сделать, остаётся на выбор агента.' }
      : vq === 0 ? { uz: 'Birinchi telefonda uchish rejimini yoqing — shu payt boshqa o\'yinchi qo\'shiladi.', ru: 'Включите режим полёта на первом телефоне — в это время присоединится другой игрок.' }
        : vq === 1 ? { uz: "Ulanish qayta tiklangan — ikkinchi telefonda «Qo'shilaman» ni bosing.", ru: "Соединение восстановлено — нажмите «Присоединяюсь» на втором телефоне." }
          : { uz: 'Birinchi telefonda ilovani fonga olib keting — pastdagi bosh ekran chizig\'ini bosing.', ru: "Сверните приложение на первом телефоне — нажмите полоску главного экрана внизу." };
  const bolimV = <div className="rt-varaq rt-s4-v"><span className="rt-v-sar">{tr(MH.sarlavha)}</span><VBolim b={bolim} /></div>;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · vaziyat', ru: 'Понятие · ситуация' })} screen={screen} scrollSignal={vq} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, vq, 3, { uz: "Vaziyatni ko'ring", ru: 'Посмотрите ситуацию' }, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ekran qachon kutilganidek <A>yangilanmaydi?</A></>, ru: <>Когда экран <A>не обновляется</A>, как ожидалось?</> })}
        mentor={<Mentor>{tr(mentor)}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={S4_SAVOL} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="rt-viz">
          {tugadi ? bolimV : <TalabSahna yorliq={{ uz: `Vaziyat ${vNo}/3 · shunday bo'lishi mumkin`, ru: `Ситуация ${vNo}/3 · так может быть` }} sahna={{ t1, t2, be: { db: sh.db, dbYangi: sh.dbYangi }, c1: sh.c1, c2: sh.c2, k1: sh.k1, k2: sh.k2, y1: sh.y1, y1ok: sh.y1ok }} varaq={bolimV} />}
          {done && <p className="rt-nom fade-step">{tr({ uz: <>Kam uchraydigan, lekin bo'ladigan vaziyat — <b>chekka holat</b>: talabda unda nima bo'lishi yoziladi.</>, ru: <>Редкая, но реальная ситуация — <b>крайний случай</b>: в требовании пишут, что в ней должно быть.</> })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'tort'} haqYorliq={{ uz: 'bu misolda', ru: 'в этом примере' }} haqiqat={{ uz: 'pastga tortganda — talabda bu vaziyat hali yozilmagan edi', ru: "когда потянете вниз — в требовании эта ситуация ещё не была записана" }} />}
          matn={tr({ uz: "Bu misolda uchta chekka holat yozildi: har qatorda vaziyat va unda nima bo'lishi kerakligi bor.", ru: 'В этом примере записаны три крайних случая: в каждой строке — ситуация и что в ней должно быть.' })}
          izoh={tr({ uz: 'Talabga yozilgan chekka holat — agentga topshiriq, bajarilgan ish emas.', ru: 'Крайний случай в требовании — задание агенту, а не сделанная работа.' })} />}
      >
        <Ustoz matn={[{ uz: "Sahna — uch vaziyatning mumkin bo'lgan ko'rinishi (yorliq «shunday bo'lishi mumkin»); har telefonda har safar shunday bo'lmaydi. Vaziyatlar sababini bu darsda aytmang — bugun ular faqat talabga yoziladi.", ru: 'Сцена — возможный вид трёх ситуаций (ярлык «так может быть»); не на каждом телефоне и не каждый раз так бывает. Причины ситуаций на этом уроке не называйте — сегодня их только пишут в требование.' }, { uz: "Birinchi vaziyat — 2-darsdagi «Ulanmoqda…» paytidagi hodisa (o'sha darsda: «keyin ham kelmaydi»). Sinfga savol: «Sizning ilovangizda qaysi vaziyat bo'lishi mumkin?» — javoblar 5-ekranning uchinchi bo'limiga.", ru: "Первая ситуация — событие во время «Подключается…» со 2-го урока (там: «и потом не придёт»). Вопрос классу: «Какая ситуация может быть в вашем приложении?» — ответы в третий раздел 5-го экрана." }]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 5 — O'Z TALABINGIZ (QMustaqil, ketma-ket karta — SABOQ 9, 13, 17, 29; E 53): bir vaqtda bitta katta karta, tayyori tepadagi ixcham qatorga uchadi. Saqlanadi: pm-m10d3-talab (tayanch 8) =====
const S5_YORIQ = [
  { uz: 'Bugun qaysi qatorlarni qurasiz? Belgilang.', ru: "Какие строки построите сегодня? Отметьте." },
  { uz: "Har holatda foydalanuvchi nimani ko'radi?", ru: 'Что видит пользователь в каждом состоянии?' },
  { uz: "Vaziyatni va unda nima bo'lishini yozing.", ru: 'Напишите ситуацию и что в ней должно быть.' }
];
const S5_BOLIM = [TS.bolim[0], TS.bolim[1], TS.chekkaNom];
const HOD_MAYDON = [
  { id: 'kimNima', s: { uz: 'Kim nima qiladi', ru: 'Кто что делает' } },
  { id: 'hodisa', s: { uz: 'Hodisa nomi va sababi', ru: 'Название и причина события' } },
  { id: 'kimOladi', s: { uz: 'Kim oladi', ru: 'Кто получает' } },
  { id: 'ekranda', s: { uz: "Ekranda nima o'zgaradi", ru: 'Что меняется на экране' } }
];
const HOL_K = ['ulangan', 'ulanmoqda', 'ulanmagan'];
const S5_XATO = {
  hodisa: { uz: 'Kamida bitta hodisa qatorini belgilang.', ru: 'Отметьте хотя бы одну строку событий.' },
  holat: { uz: "Bu holatda foydalanuvchi nimani ko'rishini yozing.", ru: 'Напишите, что видит пользователь в этом состоянии.' },
  chekka: { uz: 'Kamida ikkita chekka holat yozing.', ru: 'Напишите хотя бы два крайних случая.' },
  chiziq: { uz: "Vaziyatdan keyin unda nima bo'lishini yozing.", ru: 'После ситуации напишите, что в ней должно быть.' }
};
const hodBosh = () => ({ id: null, kimNima: '', hodisa: '', kimOladi: '', ekranda: '' });
const hodToliq = (r) => !!r && HOD_MAYDON.every(m => String(r[m.id] || '').trim());
const hodBoshmi = (r) => !r || HOD_MAYDON.every(m => !String(r[m.id] || '').trim());
const hodToza = (r) => ({ id: String(r.id), kimNima: String(r.kimNima || '').trim(), hodisa: String(r.hodisa || '').trim(), kimOladi: String(r.kimOladi || '').trim(), ekranda: String(r.ekranda || '').trim() });
const qisqa = (s, n = 24) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
const sxOl = () => { const k = lsO(SX_KEY); const r = k && Array.isArray(k.qatorlar) ? k.qatorlar.filter(x => x && x.id).slice(0, 5) : []; return r.length ? r : null; };
const chiziqBor = (s) => /[—–]|\s-\s/.test(String(s || ''));
// O'quvchi talabi varaqda (5-ekran yakuni, A1/A2 ostidagi talab): hodisa qatori ixcham
const hodQator = (r) => `${r.kimNima} · ${r.hodisa} · ${r.kimOladi} · ${r.ekranda}`;
const QAYERDA_OQ = { uz: "Backend — 2-darsdagi gateway va ma'lumot o'zgaradigan yo'llar; ilova — ulanish fayli va shu ma'lumotni ko'rsatadigan ekranlar.", ru: 'Backend — gateway из 2-го урока и пути, где меняются данные; приложение — файл соединения и экраны, которые показывают эти данные.' };
const S5_YORDAM = [...MH.holatlar.map(h => h.t), ...MH.chekka];
const YordamTugma = ({ ochiq, onClick }) => <QTugma ikkinchi className="rt-ms-yordam" aria-expanded={ochiq} onClick={onClick}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>;
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [sx] = useState(sxOl);
  const [t0] = useState(() => lsO(TALAB_KEY));
  const oldin = !!(storedAnswer && storedAnswer.saqlandi);
  const [bolak, setBolak] = useState(oldin ? 3 : 0);
  const [birSaqlandi, setBirSaqlandi] = useState(oldin);
  const [tanlangan, setTanlangan] = useState(() => {
    if (!sx) return [];
    const ids = ((t0 && t0.hodisalar) || []).map(h => h && h.id).filter(id => sx.some(r => r.id === id));
    return ids.length ? ids : sx.map(r => r.id);
  });
  const [qatorlar, setQatorlar] = useState(() => (!sx && t0 && Array.isArray(t0.hodisalar) ? t0.hodisalar.filter(h => h && h.id).slice(0, 5).map(hodToza) : []));
  const [karta, setKarta] = useState(() => (!sx && !(t0 && Array.isArray(t0.hodisalar) && t0.hodisalar.length) ? hodBosh() : null));
  const idRef = useRef(Math.max(0, ...qatorlar.map(r => Number(String(r.id).replace(/\D/g, '')) || 0)) + 1);
  const [holatlar, setHolatlar] = useState(() => ({ ulangan: (t0 && t0.holatlar && t0.holatlar.ulangan) || '', ulanmoqda: (t0 && t0.holatlar && t0.holatlar.ulanmoqda) || '', ulanmagan: (t0 && t0.holatlar && t0.holatlar.ulanmagan) || '' }));
  const [chekka, setChekka] = useState(() => { const c = ((t0 && t0.chekka) || []).map(x => (x && x.matn) || ''); return [c[0] || '', c[1] || '', c[2] || '']; });
  const [chekkaN, setChekkaN] = useState(() => (((t0 && t0.chekka) || []).length >= 3 ? 3 : 2));
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [yangiI, setYangiI] = useState(-1);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null);
  const chipRef = useRef([]);
  const ketma = useKetma();
  const saqlandi = bolak >= 3;
  const hodSoni = sx ? tanlangan.length : qatorlar.length;
  const chekkaSoni = chekka.slice(0, chekkaN).filter(c => c.trim()).length;
  const soni = [hodSoni, HOL_K.filter(k => holatlar[k].trim()).length, chekkaSoni];
  const bajarildi = saqlandi ? 3 : (birSaqlandi ? 3 : bolak);
  const och = (i) => { if (isMentor) return; setBolak(i); setXato(null); setYumshoq(null); setYordam(false); };
  // Karta qatorga aylanadi: yangi qatorga id — q1, q2… (qayta ishlatilmaydi), tartib o'zgarmaydi; id updater'dan TASHQARIDA beriladi (StrictMode updater'ni ikki marta chaqiradi — S7)
  const qatorTayyor = () => {
    if (!hodToliq(karta)) return;
    const c = karta.id ? { ...karta } : { ...karta, id: 'q' + idRef.current++ };
    setQatorlar(ro => (karta.id ? ro.map(r => (r.id === c.id ? c : r)) : [...ro, c]));
    setKarta(null); setXato(null);
  };
  const tekshir = (b) => {
    if (b === 0) return hodSoni >= 1 && !karta ? null : (karta && !hodBoshmi(karta) ? 'band' : (hodSoni >= 1 ? null : 'hodisa'));
    if (b === 1) return HOL_K.every(k => holatlar[k].trim()) ? null : 'holat';
    if (chekkaSoni < 2) return 'chekka';
    if (chekka.slice(0, chekkaN).some(c => c.trim() && !chiziqBor(c)) && yumshoq !== JSON.stringify(chekka)) return 'chiziq';
    return null;
  };
  const saqla = () => {
    const hodisalar = sx ? sx.filter(r => tanlangan.includes(r.id)).map(r => hodToza(r)) : qatorlar.map(hodToza);
    const eski = lsO(TALAB_KEY) || {};
    const data = {
      hodisalar,
      holatlar: { ulangan: holatlar.ulangan.trim(), ulanmoqda: holatlar.ulanmoqda.trim(), ulanmagan: holatlar.ulanmagan.trim() },
      chekka: chekka.slice(0, chekkaN).map((m, i) => ({ id: 'c' + (i + 1), matn: m.trim() })).filter(c => c.matn),
      buzilmasin: typeof eski.buzilmasin === 'string' && eski.buzilmasin.trim() ? eski.buzilmasin : null
    };
    lsY(TALAB_KEY, data);
    setBolak(3); setBirSaqlandi(true); setXato(null); setYumshoq(null); setYordam(false);
    if (!oldin) {
      onAnswer(screen, { stage: 'mustaqil', screenIdx: screen, practice: 'Real vaqt talabi', saqlandi: true, solved: true, correct: true, picked: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const oldinga = () => {
    const x = tekshir(bolak);
    if (x === 'band') return;
    if (x) { setXato(x); if (x === 'chiziq') setYumshoq(JSON.stringify(chekka)); return; }
    const i = bolak;
    uch(kartaRef.current, chipRef.current[i], `${i + 1} · ${tr(S5_BOLIM[i])}`);
    setYangiI(i); ketma([[900, () => setYangiI(-1)]]);
    if (i === 2 || birSaqlandi) { saqla(); return; }
    setBolak(i + 1); setXato(null); setYumshoq(null); setYordam(false);
  };
  const toggle = (id) => { setTanlangan(t => (t.includes(id) ? t.filter(x => x !== id) : [...t, id])); setXato(null); };
  const qadamlar = S5_BOLIM.map((b, i) => {
    const tayyor = i < bajarildi && !(i === bolak && !saqlandi);
    const matn = <>{tr(b)}{tayyor && <span className="rt-ms-son"> · {soni[i]} {tr({ uz: 'qator', ru: 'стр.' })}</span>}</>;
    return <span ref={el => { chipRef.current[i] = el; }} className={cx('rt-ms-chip', yangiI === i && 'yangi')}>{tayyor && !saqlandi && !isMentor ? <button type="button" className="rt-ms-q" onClick={() => och(i)}>{matn}</button> : matn}</span>;
  });
  const xatoMatn = xato && xato !== 'band' && <QXato>{tr(S5_XATO[xato])}</QXato>;
  const asosiyY = (bolak === 2 || birSaqlandi) ? { uz: 'Saqlash', ru: 'Сохранить' } : { uz: "Keyingi bo'lim", ru: 'Следующий раздел' };
  const tugmalar = (aktiv) => (
    <div className="rt-ms-tug">
      <QTugma className={halqa(aktiv)} onClick={oldinga}>{tr(asosiyY)}</QTugma>
      {bolak === 2 && chekkaN < 3 && <QTugma ikkinchi onClick={() => setChekkaN(3)}>{tr({ uz: 'Yana qator', ru: 'Ещё строка' })}</QTugma>}
      <YordamTugma ochiq={yordam} onClick={() => setYordam(o => !o)} />
    </div>
  );
  let kartaIchi = null;
  if (!saqlandi && bolak === 0) {
    kartaIchi = sx ? <>
      <div className="rt-ms-royxat">{sx.map(r => {
        const on = tanlangan.includes(r.id);
        return <button key={r.id} type="button" className={cx('rt-chek', on && 'on')} aria-pressed={on} onClick={() => toggle(r.id)}><i aria-hidden="true">{on ? '✓' : ''}</i><span>{qisqa(r.nuqta, 28)} · {qisqa(r.hodisa, 26)} · {qisqa(r.ekranda, 28)}</span></button>;
      })}</div>
      {xatoMatn}{tugmalar(tanlangan.length > 0)}
    </> : <>
      {qatorlar.length > 0 && <div className="rt-ms-oklar">{qatorlar.map((r, i) => {
        const joriy = karta && karta.id === r.id;
        return <button key={r.id} type="button" className={cx('rt-ms-q', 'qator', joriy && 'joriy')} onClick={() => { if (!karta || hodBoshmi(karta)) setKarta({ ...r }); }}><i>{joriy ? i + 1 : '✓'}</i><span>{qisqa(r.kimNima)} · {qisqa(r.hodisa, 20)} · {qisqa(r.ekranda)}</span></button>;
      })}</div>}
      {karta ? <div className="rt-ms-hod fade-step" key={karta.id || 'yangi-' + qatorlar.length}>
        {HOD_MAYDON.map((m, i) => (
          <label key={m.id} className="rt-ms-maydon"><i className="rt-ms-n" aria-hidden="true">{i + 1}</i>
            <input className="rt-ms-inp" value={karta[m.id]} maxLength={140} placeholder={tr(m.s)} aria-label={`${i + 1} · ${tr(m.s)}`} onChange={e => { const v = e.target.value; setKarta(c => ({ ...c, [m.id]: v })); setXato(null); }} />
          </label>
        ))}
        <div className="rt-ms-tug">
          <QTugma className={halqa(hodToliq(karta))} disabled={!hodToliq(karta)} onClick={qatorTayyor}>{tr({ uz: 'Qator tayyor', ru: 'Строка готова' })}</QTugma>
          {qatorlar.length > 0 && <QTugma ikkinchi onClick={() => setKarta(null)}>{tr({ uz: 'Bekor qilish', ru: 'Отмена' })}</QTugma>}
          <YordamTugma ochiq={yordam} onClick={() => setYordam(o => !o)} />
        </div>
      </div> : <>
        {xatoMatn}
        <div className="rt-ms-tug">
          <QTugma className={halqa(qatorlar.length > 0)} onClick={oldinga}>{tr(asosiyY)}</QTugma>
          {qatorlar.length < 5 && <QTugma ikkinchi onClick={() => setKarta(hodBosh())}>{tr({ uz: 'Qator qo\'shish', ru: 'Добавить строку' })}</QTugma>}
          <YordamTugma ochiq={yordam} onClick={() => setYordam(o => !o)} />
        </div>
      </>}
    </>;
  } else if (!saqlandi && bolak === 1) {
    kartaIchi = <>
      {HOL_K.map(k => (
        <label key={k} className="rt-ms-maydon belgili"><UlanishBelgisi holat={k} className="ichida" />
          <input className={cx('rt-ms-inp', xato === 'holat' && !holatlar[k].trim() && 'err')} value={holatlar[k]} maxLength={140} placeholder={tr({ uz: 'Belgi va ekranda nima turadi?', ru: "Какой значок и что на экране?" })} aria-label={tr(TS.belgilar[k].t)} onChange={e => { const v = e.target.value; setHolatlar(h => ({ ...h, [k]: v })); setXato(null); }} />
        </label>
      ))}
      {xatoMatn}{tugmalar(HOL_K.every(k => holatlar[k].trim()))}
    </>;
  } else if (!saqlandi && bolak === 2) {
    kartaIchi = <>
      {Array.from({ length: chekkaN }, (_, i) => (
        <label key={i} className="rt-ms-maydon"><i className="rt-ms-n" aria-hidden="true">{i + 1}</i>
          <input className={cx('rt-ms-inp', xato === 'chekka' && i < 2 && !chekka[i].trim() && 'err')} value={chekka[i]} maxLength={160} placeholder={tr({ uz: "Vaziyat — nima bo'lsin", ru: 'Ситуация — что должно быть' })} aria-label={`${tr(TS.chekkaNom)} ${i + 1}`} onChange={e => { const v = e.target.value; setChekka(c => c.map((x, j) => (j === i ? v : x))); setXato(null); }} />
        </label>
      ))}
      {xatoMatn}
      {xato === 'chiziq' && <span className="rt-kulrang">{tr({ uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставить так — снова нажмите «Сохранить».' })}</span>}
      {tugmalar(chekkaSoni >= 2)}
    </>;
  }
  const yordamQuti = !saqlandi && yordam && <div className="rt-yordam-q fade-step">
    <span className="rt-yordam-misol"><b>{tr({ uz: 'Mentor talabidan', ru: 'Из требования Ментора' })}</b>{S5_YORDAM.map((m, i) => <span key={i}>«{tr(m)}»</span>)}</span>
    <QIzoh>{tr({ uz: "Mentor misolidagi uch vaziyat — internet uzilib qaytishi, ulanish qayta tiklanishi, ilova fonda turishi — ulanishi bor ilovada bo'lishi mumkin: sizning ilovangizda har birida nima bo'lishi kerak?", ru: 'Три ситуации из примера Ментора — интернет пропал и вернулся, соединение восстановилось, приложение в фоне — могут быть в любом приложении с соединением: что должно быть в каждой из них в вашем приложении?' })}</QIzoh>
    <QIzoh>{tr({ uz: "Web-trekda: «fonda» o'rniga — sayt brauzerning boshqa oynasida turganda; «pastga tortib yangilash» o'rniga — «Yangilash» tugmasi.", ru: 'В веб-треке: вместо «в фоне» — когда сайт открыт в другой вкладке браузера; вместо «обновление потягиванием вниз» — кнопка «Yangilash».' })}</QIzoh>
  </div>;
  const tahrirB = (i) => <button type="button" className="rt-tahrir" onClick={() => och(i)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>;
  const oquvchiVaraq = () => {
    const t = lsO(TALAB_KEY) || {};
    return (
      <TalabVaraq sarlavha={tr({ uz: 'Mening talabim', ru: 'Моё требование' })} qayerda={tr(QAYERDA_OQ)} buzilmasin={t.buzilmasin || null} buzKulrang={tr({ uz: 'Amaliyot 2 da yozasiz', ru: 'Напишете в Практике 2' })}
        bolimlar={[
          { n: 1, nom: tr(TS.bolim[0]), son: `${(t.hodisalar || []).length} ${tr({ uz: 'qator', ru: 'стр.' })}`, tahrir: tahrirB(0), qatorlar: (t.hodisalar || []).map(r => ({ t: hodQator(r) })) },
          { n: 2, nom: tr(TS.bolim[1]), tahrir: tahrirB(1), qatorlar: HOL_K.map(k => ({ t: <><UlanishBelgisi holat={k} /> {(t.holatlar && t.holatlar[k]) || ''}</> })) },
          { n: 3, nom: tr(TS.chekkaNom), tahrir: tahrirB(2), qatorlar: (t.chekka || []).map(c => ({ t: c.matn })) }
        ]} />
    );
  };
  const mentorVaraq = (
    <TalabVaraq qayerda={tx(MH.qayerda)} buzilmasin={tr(MH.buzilmasin)} bolimlar={[
      { n: 1, nom: tr(TS.bolim[0]), qatorlar: MH.hodisalar.map(r => ({ t: tr(hodisaSatr(r)) })) },
      { n: 2, nom: tr(TS.bolim[1]), qatorlar: MH.holatlar.map(h => ({ t: tr(h.t) })) },
      { n: 3, nom: tr(TS.chekkaNom), qatorlar: MH.chekka.map(c => ({ t: tr(c) })) }
    ]} />
  );
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={bolak * 10 + qatorlar.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!saqlandi && !isMentor} label={saqlandi || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Bo'limlarni to'ldiring", ru: 'Заполните разделы' })} (${Math.min(bolak, 3)}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Mahsulotingiz uchun <A>real vaqt talabini</A> yozing.</>, ru: <>Напишите своё <A>требование к реальному времени.</A></> })}
        mentor={<Mentor>{sx || isMentor ? tr({ uz: "Bo'limlarni birma-bir to'ldiring — hodisalar 2-darsdagi sxemangizdan olindi.", ru: 'Заполните разделы по одному — события взяты из вашей схемы 2-го урока.' }) : tr({ uz: "Bo'limlarni birma-bir to'ldiring — sxemangiz saqlanmagan, hodisa qatorlarini o'zingiz yozasiz.", ru: 'Заполните разделы по одному — ваша схема не сохранилась, строки событий напишете сами.' })}</Mentor>}
        qadamlar={!isMentor && <QQadamlar qadamlar={qadamlar} joriy={saqlandi ? undefined : bolak} />}
        forma={isMentor ? mentorVaraq
          : saqlandi ? <div className="rt-fokus fade-step">{oquvchiVaraq()}<QXulosa>{tr({ uz: 'Real vaqt talabingiz saqlandi: hodisalar, ulanish holatlari va chekka holatlar bilan.', ru: "Ваше требование к реальному времени сохранено: с событиями, состояниями соединения и крайними случаями." })}</QXulosa></div>
            : <div className="rt-ms-karta" key={bolak} ref={kartaRef}>
              <span className="q-yorliq">{bolak + 1} · {tr(S5_BOLIM[bolak])} · {bolak + 1} / 3</span>
              <b className="rt-ms-yoriq">{tr(S5_YORIQ[bolak])}</b>
              {kartaIchi}
            </div>}
        yordam={yordamQuti}
      >
        <Ustoz matn={[{ uz: "Chekka holat — o'quvchi o'z ilovasida bo'lishi mumkin deb bilgan vaziyat; «to'g'ri» yoki «noto'g'ri» deb baholanmaydi, faqat «vaziyat — nima bo'lsin» shakli so'raladi. Mahsulotida boshqa odam o'zgartiradigan joy bo'lmagan o'quvchi — 2-darsdagi kabi o'zi ikkinchi qurilmada o'zgartiradigan ma'lumot.", ru: 'Крайний случай — ситуация, которая, по мнению ученика, может быть в его приложении; не оценивается как «верно/неверно», спрашивается только форма «ситуация — что должно быть». Если в продукте нет места, которое меняет другой человек, — данные, которые ученик сам меняет на втором устройстве, как на 2-м уроке.' }, { uz: "Holatlar maydoniga shaxsiy ma'lumot yozilmaydi — odamlar roli bilan (o'yinchi, tashkilotchi).", ru: 'В поле состояний не пишут личные данные — люди указываются ролью (игрок, организатор).' }]} />
        <MentorPracticeStats live={live} screen={screen} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen; ✔ B, INLINE_KEYS.s8 = 1; scope final; savol ustida kichik talab varag'i — uch bo'lim) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy savol', ru: 'Итоговый вопрос' })}
    questionText="Agent «talabdagi hammasi tayyor» dedi. Bugungi tekshiruvda nima ko'riladi?"
    question={<><MiniVaraq><span className="rt-mini-b">{[0, 1].map(i => <span key={i}><i>{i + 1}</i>{tr(TS.bolim[i])}</span>)}<span><i>3</i>{tr(TS.chekkaNom)} <em>{tr({ uz: '3 qator', ru: '3 строки' })}</em></span></span></MiniVaraq>
      <h2 className="title h-ask">{tr({ uz: <>Agent «talabdagi hammasi tayyor» dedi. Bugungi tekshiruvda <A>nima ko'riladi?</A></>, ru: <>Агент сказал: «всё из требования готово». <A>Что видно</A> на сегодняшней проверке?</> })}</h2></>}
    options={[
      { uz: 'Internet uzilib qaytgach son yangilanganini', ru: 'Что число обновилось после обрыва интернета' },
      { uz: "Tekshiruv so'rovidan keyin son o'zgarganini", ru: 'Что число изменилось после проверочного запроса' },
      { uz: 'Bitta o\'zgarish bir marta yangilanganini', ru: 'Что одно изменение обновило экран один раз' },
      { uz: 'Ilova fondan qaytganda yangi son turganini', ru: 'Что при возврате из фона стоит новое число' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Bu ko\'rildi; chekka holatlar esa bugun tekshirilmadi.', ru: 'Это видно; а крайние случаи сегодня не проверялись.' }}
    explainWrong={{
      0: { uz: 'Bu chekka holat — bugun u faqat talabga yozildi.', ru: 'Это крайний случай — сегодня его только записали в требование.' },
      2: { uz: "Bu ham chekka holat. Bugun uni telefonda ko'rdingizmi?", ru: 'Это тоже крайний случай. Вы видели его сегодня на телефоне?' },
      3: { uz: 'Fondan qaytish — chekka holat: bugun faqat yozildi.', ru: 'Возврат из фона — крайний случай: сегодня только записан.' }
    }} />
);

// ===== 🏅 NISHONLAR — faqat haqiqiy ish uchun (P-048): s3 birinchi urinish · s5 «Saqlash» · A1/A2 oxirgi «Bajardim» (bonus) =====
const ACHIEVEMENTS = {
  gapFinder: { icon: '🔍', name: 'Gap Finder!', desc: { uz: 'Talab nimani aytmasligini birinchi urinishda topdingiz', ru: 'С первой попытки нашли, чего не говорит требование' } },
  briefWriter: { icon: '📝', name: 'Brief Writer!', desc: { uz: "Mahsulotingiz uchun uch bo'limli real vaqt talabini yozdingiz", ru: "Написали требование к реальному времени из трёх разделов для своего продукта" } },
  liveList: { icon: '📲', name: 'Live List!', desc: { uz: "Ro'yxat pastga tortmasdan yangilanganini telefonda ko'rdingiz", ru: 'Увидели на телефоне, что список обновился без потягивания вниз' } },
  stateCheck: { icon: '📶', name: 'State Check!', desc: { uz: "Ulanish holatlarini telefonda tekshirib, talabni README'ga yozdirdingiz", ru: 'Проверили состояния соединения на телефоне и записали требование в README' } }
};
// Ekran id → nishon (recordAnswer dagi bitta earn() nuqtasi; data.correct — haqiqiy ish)
const ACH_TRIGGERS = { s3: 'gapFinder', s5: 'briefWriter', a1: 'liveList', a2: 'stateCheck' };

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


// Podium savol yorliqlari (kalitlar = SCORED_IDX: 3, 8)
const Q_LABELS = {
  3: { uz: '1 — Talab nimani aytmaydi', ru: '1 — Чего не говорит требование' },
  8: { uz: '2 — Bugun nima tekshirildi', ru: '2 — Что проверили сегодня' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning fon so'zlari (R-008: {uz, ru}; kod-belgi o'zgarmaydi; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'real vaqt talabi', ru: "требование к реальному времени" }, l: 4, t: 8, s: 20, d: 19, dl: 0 },
  { ch: { uz: 'hodisalar', ru: 'события' }, l: 80, t: 6, s: 24, d: 23, dl: 1.5 },
  { ch: { uz: 'ulanish holatlari', ru: 'состояния соединения' }, l: 6, t: 74, s: 20, d: 27, dl: 0.8 },
  { ch: { uz: 'chekka holat', ru: 'крайний случай' }, l: 74, t: 70, s: 22, d: 21, dl: 2.2 },
  { ch: 'oyin-ozgardi', l: 42, t: 88, s: 20, d: 25, dl: 1.1 },
  { ch: { uz: '«Ulangan»', ru: '«Подключено»' }, l: 66, t: 28, s: 20, d: 17, dl: 0.4 },
  { ch: { uz: '«Ulanmoqda…»', ru: '«Подключается…»' }, l: 22, t: 36, s: 20, d: 20, dl: 1.9 },
  { ch: { uz: '«Ulanmagan»', ru: '«Не подключено»' }, l: 18, t: 18, s: 18, d: 18, dl: 2.9 },
  { ch: { uz: 'talab', ru: 'требование' }, l: 56, t: 12, s: 24, d: 22, dl: 0.6 },
  { ch: { uz: 'nima buzilmasin', ru: 'что не сломать' }, l: 36, t: 58, s: 18, d: 24, dl: 1.4 },
  { ch: 'README', l: 86, t: 44, s: 20, d: 26, dl: 2.5 },
  { ch: 'Maydon Jamoa', l: 4, t: 46, s: 20, d: 21, dl: 3.1 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, ✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (MD aynan)
const QUIZ_BANK = [
  { q: { uz: 'Mentor misolida Backend hodisani qachon yuboradi?', ru: 'Когда в примере Ментора Backend отправляет событие?' }, opts: [{ uz: "Database'dagi o'zgarish tugagach", ru: 'Когда изменение в Database закончено' }, { uz: "Database'dagi o'zgarishdan oldin", ru: 'До изменения в Database' }, { uz: "Ilova ochilib, so'rov kelganda", ru: 'Когда приложение открылось и пришёл запрос' }, { uz: "O'yinchi ro'yxatni tortganda", ru: 'Когда игрок потянул список' }], correct: 0 },
  { q: { uz: "Mentor misolida «Ulanmoqda…» paytida ro'yxat nima bo'ladi?", ru: "Что происходит со списком в примере Ментора во время «Подключается…»?" }, opts: [{ uz: "Ekrandan o'chadi, bo'sh joy qoladi", ru: 'Исчезает с экрана, остаётся пустое место' }, { uz: 'Ekranda qoladi, eskirishi mumkin', ru: 'Остаётся на экране, может устареть' }, { uz: "O'zi har soniyada yangilanib turadi", ru: 'Сам обновляется каждую секунду' }, { uz: "O'rnida xato oynasi chiqib turadi", ru: 'Вместо него висит окно ошибки' }], correct: 1 },
  { q: { uz: "Belgi «Ulanmagan». Mentor misolida ro'yxatni qanday yangilaysiz?", ru: "Значок «Не подключено». Как обновить список в примере Ментора?" }, opts: [{ uz: "Ilovani o'chirib qayta o'rnatasiz", ru: 'Удалите и заново установите приложение' }, { uz: "Backend'ni qayta ishga tushirasiz", ru: 'Перезапустите Backend' }, { uz: 'Ekranni pastga tortib yangilaysiz', ru: 'Обновите, потянув экран вниз' }, { uz: "Database'da sonni o'zgartirasiz", ru: 'Измените число в Database' }], correct: 2 },
  { q: { uz: 'Qaysi biri chekka holat?', ru: 'Что из этого — крайний случай?' }, opts: [{ uz: "O'yinchi «Qo'shilaman» tugmasini bosdi", ru: "Игрок нажал кнопку «Присоединяюсь»" }, { uz: "Tashkilotchi yangi o'yin e'lon qildi", ru: 'Организатор объявил новую игру' }, { uz: "O'yinchi o'yin kuni «Kelaman» ni bosdi", ru: "Игрок в день игры нажал «Kelaman» («Приду»)" }, { uz: "Qo'shilish paytida internet uzildi", ru: 'Во время присоединения пропал интернет' }], correct: 3 },
  { q: { uz: 'Talabdagi chekka holat qatori nimani aytadi?', ru: 'Что говорит строка крайнего случая в требовании?' }, opts: [{ uz: "Vaziyatni va unda nima bo'lishini", ru: 'Ситуацию и что в ней должно быть' }, { uz: 'Vaziyatni va uni kim yaratganini', ru: 'Ситуацию и кто её создал' }, { uz: 'Vaziyatni va qaysi faylda turishini', ru: 'Ситуацию и в каком файле она' }, { uz: "Vaziyatni va necha marta bo'lganini", ru: 'Ситуацию и сколько раз она была' }], correct: 0 },
  { q: { uz: "Ulanish yo'q paytda o'yinchi qo'shildi. Bu misolda hodisa keyin keladimi?", ru: 'Игрок присоединился, когда соединения не было. В этом примере событие придёт потом?' }, opts: [{ uz: "Ha, ulanish qaytgach o'zi keladi", ru: 'Да, придёт само, когда соединение вернётся' }, { uz: "Yo'q, qayta ulanganda kelmaydi", ru: 'Нет, при переподключении не придёт' }, { uz: 'Ha, Backend uni saqlab turadi', ru: 'Да, Backend его хранит' }, { uz: "Yo'q, uni ikkinchi telefon oladi", ru: 'Нет, его получит второй телефон' }], correct: 1 },
  { q: { uz: "Mentor misolida ilova fondan qaytganda nima ko'rinishi kerak?", ru: 'Что должно быть видно в примере Ментора, когда приложение вернулось из фона?' }, opts: [{ uz: "Oxirgi ko'rilgan eski son", ru: 'Последнее увиденное старое число' }, { uz: "Bo'sh ro'yxat, kutish yozuvi", ru: 'Пустой список, надпись ожидания' }, { uz: "O'yinlarning yangi holati", ru: 'Новое состояние игр' }, { uz: "Ulanish belgisi, ro'yxatsiz", ru: 'Значок соединения, без списка' }], correct: 2 },
  { q: { uz: "Mobil trekda tekshiruv so'rovini kim yuboradi?", ru: 'Кто в мобильном треке отправляет проверочный запрос?' }, opts: [{ uz: "Notanish odam, o'z telefonidan", ru: 'Незнакомый человек, со своего телефона' }, { uz: "Tashkilotchi, o'z akkauntidan", ru: 'Организатор, со своего аккаунта' }, { uz: "Ilovaning o'zi, har daqiqada", ru: 'Само приложение, каждую минуту' }, { uz: 'Agent, tekshiruv akkauntidan', ru: 'Агент, с проверочного аккаунта' }], correct: 3 },
  { q: { uz: "Tekshiruvdan keyin agent yaratgan yozuvlar qanday o'chiriladi?", ru: 'Как после проверки удаляют записи, созданные агентом?' }, opts: [{ uz: "Faqat agent aytgan id lar bo'yicha", ru: 'Только по id, названным агентом' }, { uz: 'Jadvaldagi hamma yozuvlar bilan birga', ru: 'Вместе со всеми записями таблицы' }, { uz: "Ilova qayta ishga tushganda o'zi", ru: 'Сами, когда приложение перезапустится' }, { uz: 'Oxirgi o\'nta yozuv bilan birdaniga', ru: 'Сразу с последними десятью записями' }], correct: 0 },
  { q: { uz: "Real vaqt talabi PRD'dan farqli ravishda nimani aytadi?", ru: "Что, в отличие от PRD, говорит требование к реальному времени?" }, opts: [{ uz: 'Mahsulot aynan kim uchun qurilishini', ru: 'Для кого именно строится продукт' }, { uz: "O'zgarish ekranda qanday ko'rinishini", ru: 'Как изменение выглядит на экране' }, { uz: 'Bosh raqam qanday va qachon sanalishini', ru: 'Как и когда считается главное число' }, { uz: 'Mahsulot qaysi muammoni hal qilishini', ru: 'Какую проблему решает продукт' }], correct: 1 },
  { q: { uz: "Bitta qo'shilish ekranni ikki marta yangiladi. Talabning qaysi qismi bu haqda?", ru: 'Одно присоединение обновило экран дважды. Какая часть требования об этом?' }, opts: [{ uz: "Hodisalar bo'limidagi qator", ru: 'Строка в разделе «События»' }, { uz: 'Ulanish holatlari qatori', ru: 'Строка состояний соединения' }, { uz: 'Chekka holatlardagi qator', ru: 'Строка в крайних случаях' }, { uz: '«Nima buzilmasin» qatori', ru: 'Строка «Что не сломать»' }], correct: 2 },
  { q: { uz: 'Web-trekda belgi «Ulanmagan». Ro\'yxat nima bilan yangilanadi?', ru: "В веб-треке значок «Не подключено». Чем обновить список?" }, opts: [{ uz: 'Sahifani yopib qo\'yish bilan', ru: 'Закрыв страницу' }, { uz: 'Agentga talab yozish bilan', ru: 'Написав требование агенту' }, { uz: "Backend'ni o'chirish bilan", ru: 'Выключив Backend' }, { uz: '«Yangilash» tugmasi bilan', ru: 'Кнопкой «Yangilash»' }], correct: 3 },
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
// Har blok 4 bo'lak, hammasi o'quvchining o'z repo'sida (5-bo'lak yo'q). steps [{ h, t, bandlar?, oldin?, prompt?, namuna?, toldir?, tahrir?, onNusxa?, ichi?, yordam?, err? }].
// Qolipda yo'q (qolip taklifi): {…} yonida kulrang «masalan: …» va prompt tahriri (RtPrompt), bo'lak ichidagi «Yordam», qo'shimcha xabar qutilari, «Ulgurmasangiz» qatori, trek tugmalari — shu faylda.
// Blok bajarilgani — faqat oxirgi «Bajardim»dan (tayanch 9.36 h); «Ulgurmasangiz» yo'lida «Davom etish» 3-bo'lakdan keyin ochiladi, bayroq qo'yilmaydi.
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const trekOqi = () => { const o = lsO(TREK_KEY); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
const trekYoz = (t) => lsY(TREK_KEY, { ...(lsO(TREK_KEY) || {}), trek: t });
// Prompt qutisi: {…} joylari ajralib ko'rinadi, yonida kulrang namuna (joy bo'sh qolsa); ✎ — matnni tahrirlash; «Nusxalash» — butun matn (tahrirlangani)
const RtPrompt = ({ satrlar, namuna = [], toldir = {}, tahrir, onNusxa }) => {
  const [ok, setOk] = useState(false);
  const [ed, setEd] = useState(null);
  const [edOchiq, setEdOchiq] = useState(false);
  const asl = satrlar.map(l => { let s = tr(l); Object.entries(toldir).forEach(([j, v]) => { if (v) s = s.split(j).join(v); }); return s; });
  const matn = ed != null ? ed.split('\n') : asl;
  const nm = {};
  namuna.forEach(x => { nm[x.joy] = x.n; });
  const korildi = new Set();
  const joy = (t, li) => t.split(/(\{[^}]+\})/g).map((p, i) => {
    if (!/^\{.+\}$/.test(p)) return <React.Fragment key={li + '-' + i}>{fmtCode(p)}</React.Fragment>;
    const yangi = !!nm[p] && !korildi.has(p);
    if (yangi) korildi.add(p);
    return <React.Fragment key={li + '-' + i}><span className="q-joy">{p}</span>{yangi && <span className="rt-joy-n">{tx(nm[p])}</span>}</React.Fragment>;
  });
  const nusxa = async () => { if (onNusxa) onNusxa(); try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  return (
    <span className="q-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span>
        {tahrir && <button type="button" className="rt-ed" aria-pressed={edOchiq} onClick={() => { if (ed == null) setEd(asl.join('\n')); setEdOchiq(o => !o); }} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
        <button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {edOchiq
        ? <textarea className="rt-prompt-ta" value={ed ?? ''} rows={Math.min(14, Math.max(5, matn.length + 1))} onChange={e => setEd(e.target.value)} aria-label={tr({ uz: 'Prompt matni', ru: 'Текст промпта' })} />
        : matn.map((l, i) => <span key={i} className="rt-ps">{joy(l, i)}</span>)}
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <>
      <QTugma ikkinchi className="rt-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
      {ochiq && <span className="rt-yordam fade-step">{satrlar.map((l, i) => <span key={i} className={cx('rt-yordam-s', l.kulrang && 'kul')}>{tx(l.kulrang || l)}</span>)}</span>}
    </>
  );
};
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'cd maydon-jamoa', 'git checkout -f m12-dars-03-done'];
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, ulgur, ulgurQadam = 99, ustoz, ustida }) {
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
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, bo'laklar orasida keyingi bo'lak, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi bo'lak — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующая часть — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<><Mentor>{tr(mGap)}</Mentor>{ustida}</>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: <>{tx(c.t)}{c.bandlar && c.bandlar.map((b, i) => <span key={i} className="rt-band">{tx(b)}</span>)}{c.oldin}{c.prompt && <RtPrompt satrlar={c.prompt} namuna={c.namuna} toldir={c.toldir} tahrir={c.tahrir} onNusxa={c.onNusxa} />}{c.ichi}</>,
          xato: c.yordam ? <>{c.err && <span className="rt-band">{tx(c.err)}</span>}<Yordam satrlar={c.yordam} /></> : (c.err && tx(c.err))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
        pastki={<MentorPracticeStats live={_live} screen={screen} />}>
        {ortda && <p className="rt-ortda">{tr({ uz: 'Ortda qoldingizmi — Mentor misolini alohida papkada oching:', ru: 'Отстали — откройте пример Ментора в отдельной папке:' })} <code className="rt-buyruq">{ORTDA[0]}</code> · <code className="rt-buyruq">{ORTDA[1]}</code> · <code className="rt-buyruq">{ORTDA[2]}</code> {tx(ortda)}</p>}
        {ulgur && !done && <p className="rt-ulgur">{tx(ulgur)}</p>}
        {ustoz && <Ustoz matn={ustoz} />}
      </QBlok>
    </Stage>
  );
}
const TrekTanlov = ({ trek, onTanla }) => (trek ? null : <div className="rt-trek"><span>{tr({ uz: 'Trekingiz:', ru: 'Ваш трек:' })}</span><div className="rt-chorla"><QChip onClick={() => onTanla('mobil')}>{tr({ uz: 'Mobil trek', ru: 'Мобильный трек' })}</QChip><QChip onClick={() => onTanla('web')}>{tr({ uz: 'Web-trek', ru: 'Веб-трек' })}</QChip></div></div>);
// Kichik xabar qutisi (A1 4-bo'lak, A2 4-bo'lak): bir yoki bir necha satr + «Nusxalash»
const Xabar = ({ yorliq, satrlar, namuna, keyin }) => <span className="rt-xabar">{yorliq && <span className="rt-band">{tx(yorliq)}</span>}<RtPrompt satrlar={satrlar} namuna={namuna} />{keyin && <span className="rt-band">{tx(keyin)}</span>}</span>;

// ----- A1: kutilgan natija — «O'yin» telefoni uch kadr bir marta o'zi yuradi (8 → konvert → 9 → konvert → 8), agent javobi va fayllar kartasi -----
const NatijaA1 = () => {
  const [f, setF] = useState(kamHarakat() ? 4 : 0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1200, () => setF(1)], [900, () => setF(2)], [1500, () => setF(3)], [900, () => setF(4)]]); }, []); // eslint-disable-line
  const son = f >= 2 && f < 4 ? 9 : 8;
  return (
    <div className="rt-a1n">
      <div className="rt-a1n-tel">
        <Telefon no={1} t={{ tex: 'Expo Go', ekran: 'oyin', son, sonYangi: f === 2 || f === 4, qoshilYoq: true }} />
        {(f === 1 || f === 3) && <span className="rt-n-kv fade-step" key={f}><i className="rt-kv-i" /><b>oyin-ozgardi</b></span>}
      </div>
      <div className="rt-agent-j">
        <b>{tr({ uz: 'Agent javobi', ru: 'Ответ агента' })}</b>
        <span>{tx({ uz: 'Akkaunt: tekshiruv akkaunti (namuna) · O\'yin: `oyinId: 1` · akkaunt va yozuv `id` lari aytildi', ru: 'Аккаунт: проверочный аккаунт (образец) · Игра: `oyinId: 1` · id аккаунта и записей названы' })}</span>
        {f >= 4 && <span className="fade-step">{tx({ uz: 'Akkaunt va yozuvlar o\'chirildi: aytilgan `id` lar', ru: 'Аккаунт и записи удалены: по названным `id`' })}</span>}
      </div>
      <div className="rt-fayllar">
        {[['backend/', { uz: "gateway va besh yo'l", ru: 'gateway и пять путей' }], ['mobil/src/ulanish.ts', null], [null, { uz: "«O'yinlar», «O'yin» ekranlari", ru: 'экраны «O\'yinlar», «O\'yin»' }]].map(([n, h], i) => (
          <span key={i} className="rt-fayl">{n && <code>{n}</code>}{h && <span>{n ? ' — ' : ''}{tr(h)}</span>}<em>{tr({ uz: "o'zgardi", ru: 'изменён' })}</em></span>
        ))}
      </div>
    </div>
  );
};
const A1_PROMPT = [
  { uz: "Qayerda: Backend — 2-darsdagi gateway va ma'lumot o'zgaradigan yo'llar; ilova — ulanish fayli va shu ma'lumotni ko'rsatadigan ekranlar.", ru: 'Где: Backend — gateway из 2-го урока и пути, где меняются данные; приложение — файл соединения и экраны, которые показывают эти данные.' },
  { uz: "Nima qilsin: shu hodisalarni qur (har qator: kim nima qiladi | hodisa | kim oladi | ekranda nima o'zgaradi):", ru: 'Что сделать: построй эти события (каждая строка: кто что делает | событие | кто получает | что меняется на экране):' }
];
const A1_PROMPT_OXIR = [
  { uz: "Backend o'zgarishni Database'ga yozib tugatgandan keyin hodisani yuborsin; hodisada faqat o'zgargan yozuvning `id` si va sababi bo'lsin. Ilova hodisa kelganda shu qatorning «ekranda nima o'zgaradi» qismidagi ma'lumotni Backend'dan qayta so'rasin; bitta hodisa ochiq ekranni bir marta yangilasin.", ru: 'Пусть Backend отправляет событие после того, как закончит запись изменения в Database; в событии — только `id` изменённой записи и причина. Когда событие пришло, приложение заново запрашивает у Backend данные из части «что меняется на экране» этой строки; одно событие обновляет открытый экран один раз.' },
  { uz: "Nima buzilmasin: avvalgi ekranlar va yo'llar avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: прежние экраны и пути работают как раньше; обновление потягиванием вниз остаётся. `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_JOY = { uz: '{hodisalar}', ru: '{события}' };
const A1_JOY_NAMUNA = { uz: "masalan: o'yinchi «Qo'shilaman» ni bosadi | oyin-ozgardi · sabab qoshildi | hamma ulangan ilova | «8 / 10» o'rniga «9 / 10»", ru: "например: игрок нажимает «Qo'shilaman» («Присоединяюсь») | oyin-ozgardi · причина qoshildi | все подключённые приложения | «9 / 10» вместо «8 / 10»" };
const A1_YORDAM = [
  { uz: "Qayerda: `backend/` — 2-darsdagi gateway va o'yin o'zgaradigan besh yo'l: `POST /oyinlar`, `POST /oyinlar/:id/qoshilish`, `POST /oyinlar/:id/tasdiq`, `POST /oyinlar/:id/chiqish`, `POST /oyinlar/:id/navbat`; `mobil/` — `src/ulanish.ts`, «O'yinlar» va «O'yin» ekranlari.", ru: 'Где: `backend/` — gateway из 2-го урока и пять путей, где меняется игра: `POST /oyinlar`, `POST /oyinlar/:id/qoshilish`, `POST /oyinlar/:id/tasdiq`, `POST /oyinlar/:id/chiqish`, `POST /oyinlar/:id/navbat`; `mobil/` — `src/ulanish.ts`, экраны «O\'yinlar» и «O\'yin».' },
  A1_PROMPT[1],
  { uz: "o'yinchi «Qo'shilaman» ni bosadi | oyin-ozgardi · sabab qoshildi | hamma ulangan ilova | «8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi", ru: "игрок нажимает «Qo'shilaman» («Присоединяюсь») | oyin-ozgardi · причина qoshildi | все подключённые приложения | «8 / 10» → «9 / 10», в списке новый игрок" },
  ...MH.hodisalar.slice(1).map(hodisaSatr),
  { uz: "Backend o'zgarishni Database'ga yozib tugatgandan keyin `oyin-ozgardi` ni yuborsin — faqat `{ oyinId, sabab }`. Ilova hodisa kelganda `GET /oyinlar` ni qayta so'rasin va ochiq ekranni yangilasin; bitta hodisadan keyin `GET /oyinlar` bir marta so'ralsin — «O'yinlar» va «O'yin» shu javobdan o'qisin.", ru: 'Пусть Backend отправляет `oyin-ozgardi` после того, как закончит запись изменения в Database, — только `{ oyinId, sabab }`. Когда событие пришло, приложение заново запрашивает `GET /oyinlar` и обновляет открытый экран; после одного события `GET /oyinlar` запрашивается один раз — «O\'yinlar» и «O\'yin» читают из этого ответа.' },
  { uz: "Nima buzilmasin: Kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход, объявление игры, присоединение, подтверждение, выход и очередь работают как раньше; обновление потягиванием вниз остаётся. `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' },
  { kulrang: { uz: "Web-trek: «Qayerda» — `prototip/` — `src/ulanish.js` va ma'lumot ko'rsatadigan sahifalar; «Nima buzilmasin» — «… «Yangilash» tugmasi qolsin».", ru: 'Веб-трек: «Где» — `prototip/` — `src/ulanish.js` и страницы с данными; «Что не сломать» — «… кнопка «Yangilash» остаётся».' } }
];
// 3-bo'lak: Render kutilayotganda agentdan o'z kodidagi ikki joyni ko'rsatishni so'rash (E 52 — real prompt; kod o'zgarmaydi)
const A1_KOD_PROMPT = [
  { uz: "O'zgartirgan fayllaringda ikki joyni fayl nomi va qator raqami bilan ko'rsat: Backend `oyin-ozgardi` hodisasini yuboradigan qator va ilovadagi tinglovchi `ulanish.on(…)`.", ru: 'В изменённых файлах покажи два места с именем файла и номером строки: строку Backend, которая отправляет событие `oyin-ozgardi`, и слушатель в приложении `ulanish.on(…)`.' },
  { uz: "Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Объясни одной фразой, что делает каждая. Код не меняй.' }
];
const ScreenA1 = (props) => {
  const [trek, setTrek] = useState(trekOqi);
  const tanla = (t) => { trekYoz(t); setTrek(t); };
  const [hod] = useState(() => { const t = lsO(TALAB_KEY); return t && Array.isArray(t.hodisalar) ? t.hodisalar.filter(Boolean).map(r => [r.kimNima, r.hodisa, r.kimOladi, r.ekranda].map(x => String(x || '').trim()).join(' | ')) : []; });
  const prompt = [...A1_PROMPT, ...(hod.length ? hod : [A1_JOY]), ...A1_PROMPT_OXIR];
  const web = trek !== 'mobil', mobil = trek !== 'web';
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · hodisalar', ru: 'Практика 1 · события' }}
      title={{ uz: <>Ro'yxat pastga tortmasdan <A>o'zi yangilansin.</A></>, ru: <>Пусть список обновляется сам, <A>без потягивания вниз.</A></> }}
      mentor={{ uz: "Talab tayyor — Hodisalar qatorlari talabingizdan olindi, o'qib chiqing; «1 · Ochish»dan boshlang.", ru: "Требование готово — строки событий взяты из вашего требования, прочитайте их; начните с «1 · Открыть»." }}
      ustida={<TrekTanlov trek={trek} onTanla={tanla} />}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: o'zgargan fayl yo'q, `.env` ro'yxatda ko'rinmaydi (ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»).", ru: 'Откройте свой репозиторий в Antigravity. В терминале `git status`: изменённых файлов нет, `.env` в списке не видно (если видно, агенту: «Добавь файлы `.env` в `.gitignore`.»).' },
          bandlar: [{ uz: "Ilovangizni telefonda oching: belgi «Ulangan» bo'lishi kerak. Belgi yo'q bo'lsa — 2-darsdagi ulanish hali qurilmagan: avval o'sha darsning birinchi amaliyotini tugating.", ru: "Откройте приложение на телефоне: значок должен быть «Ulangan» («Подключено»). Если значка нет — соединение 2-го урока ещё не построено: сначала доделайте первую практику того урока." }] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Hodisalar» qatorlarini o'qib chiqing (tahrirlasa bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'Прочитайте строки «События» (можно править), нажмите «Скопировать» и отправьте в Antigravity:' },
          prompt, tahrir: true, namuna: hod.length ? [] : [{ joy: tr(A1_JOY), n: A1_JOY_NAMUNA }], yordam: A1_YORDAM },
        { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "`git status`: o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing → `git commit -m \"real vaqt: hodisalar\"` → `git push`.", ru: '`git status`: изменённые файлы совпадают с тем, что сказал агент, `.env` в списке нет; добавьте каждый файл через `git add <fayl>` → `git commit -m "real vaqt: hodisalar"` → `git push`.' },
          bandlar: [
            { uz: "Render Backend'ning yangi versiyasini chiqaradi — Render sahifasida tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Kutayotganda agent o'zgartirgan fayllardan ikki joyni toping: Backend hodisani yuboradigan qator va ilovadagi tinglovchi (`ulanish.on(…)`).", ru: 'Render выпускает новую версию Backend — дождитесь окончания на странице Render (может занять несколько минут). Пока ждёте, найдите в файлах, изменённых агентом, два места: строку Backend, которая отправляет событие, и слушатель в приложении (`ulanish.on(…)`).' }
          ],
          ichi: <>
            <Xabar satrlar={A1_KOD_PROMPT} />
            <span className="rt-band">{tx({ uz: "Yangi versiya chiqqanda ulanish uziladi: belgi bir lahza «Ulanmoqda…» bo'lib, odatda bir necha soniyada «Ulangan» ga qaytadi. Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda Netlify saytni odatda o'zi yangilaydi.", ru: "Когда выходит новая версия, соединение обрывается: значок на миг становится «Ulanmoqda…» («Подключается…») и обычно за несколько секунд возвращается к «Ulangan». В мобильном треке Expo Go обычно сам перезагружает приложение (если нет — `r` в терминале); в веб-треке Netlify обычно сам обновляет сайт." })}</span>
          </>,
          err: { uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если появилась ошибка — отправьте агенту строку ошибки (не значения `.env`, не токен и не ключи): «Вот такая ошибка: {ошибка}. Исправь.»' } },
        { h: { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }, t: { uz: "agent nima desa ham, o'zingiz ko'ring. Avval belgi «Ulangan» ekanini ko'ring (Mentor misolida — «O'yinlar» tepasida), keyin o'zgarish ko'rinadigan ekranni oching (Mentor misolida — «O'yin», «Shanba, 18:00»); ekranga tegmang.", ru: 'что бы ни сказал агент, посмотрите сами. Сначала убедитесь, что значок «Ulangan» (в примере Ментора — вверху «O\'yinlar»), затем откройте экран, где видно изменение (в примере Ментора — «O\'yin», «Shanba, 18:00»); экран не трогайте.' },
          ichi: <>
            <span className="rt-band">{tx({ uz: "O'zgarishni boshqa akkaunt qiladi.", ru: 'Изменение делает другой аккаунт.' })}</span>
            {web && <span className="rt-band">{tx({ uz: "Web-trekda — o'zingiz: kompyuterda saytingizni yashirin oynada oching, 11-Modulda yaratgan ikkinchi namuna akkauntingiz bilan kiring, o'zgarishni qiling, keyin qaytaring — telefon brauzerida son «Yangilash»ni bosmasdan o'zgarishi kerak.", ru: 'В веб-треке — сами: откройте сайт на компьютере в окне инкогнито, войдите вторым образцовым аккаунтом из 11-го модуля, сделайте изменение, потом верните — в браузере телефона число должно измениться без нажатия «Yangilash».' })}</span>}
            {mobil && <>
              <span className="rt-band">{tx({ uz: 'Mobil trekda — agent (uch xabar):', ru: 'В мобильном треке — агент (три сообщения):' })}</span>
              <Xabar yorliq={{ uz: '(1) Agentga («Nusxalash»):', ru: '(1) Агенту («Скопировать»):' }} satrlar={[{ uz: "Tekshiruv uchun ilovaning ro'yxatdan o'tish yo'li bilan yangi akkaunt och"
                + " — namuna ism va namuna raqam bilan, haqiqiy emas. Shu akkaunt nomidan Render'dagi Backend'ga so'rov yubor: {o'zgarish}. Akkaunt va yaratgan yozuvlaringning `id` larini ayt.", ru: 'Для проверки открой новый аккаунт через регистрацию в приложении — с образцовым именем и образцовым номером, не настоящими. От имени этого аккаунта отправь запрос Backend на Render: {изменение}. Назови `id` аккаунта и созданных записей.' }]}
                namuna={[{ joy: __lang === 'ru' ? '{изменение}' : "{o'zgarish}", n: { uz: "masalan: Shanba, 18:00 o'yiniga (`oyinId: 1`) qo'shilish.", ru: 'например: присоединение к игре «Shanba, 18:00» (`oyinId: 1`).' } }]}
                keyin={{ uz: "Telefonga qarang: son pastga tortmasdan o'zgarishi kerak — odatda bir necha soniyada.", ru: 'Смотрите на телефон: число должно измениться без потягивания вниз — обычно за несколько секунд.' }} />
              <Xabar yorliq={{ uz: "(2) Mahsulotingizda o'zgarishni qaytaradigan yo'l bo'lsa (Mentor misolida — o'yindan chiqish), agentga:", ru: '(2) Если в продукте есть путь, который отменяет изменение (в примере Ментора — выход из игры), агенту:' }} satrlar={[{ uz: "Endi o'sha akkaunt nomidan Render'dagi Backend'ga o'zgarishni qaytaradigan so'rovni yubor.", ru: 'Теперь от имени того же аккаунта отправь Backend на Render запрос, который отменяет изменение.' }]}
                keyin={{ uz: "— son yana o'zi o'zgarishi kerak.", ru: '— число снова должно измениться само.' }} />
              <Xabar yorliq={{ uz: '(3) Agentga:', ru: '(3) Агенту:' }} satrlar={[{ uz: "Faqat hozir yaratgan tekshiruv akkauntini va yozuvlarini — aytgan `id` laring bo'yicha — o'chir.", ru: 'Удали только что созданный проверочный аккаунт и записи — по названным тобой `id`.' }]} />
            </>}
            <span className="rt-band">{tx({ uz: "Son o'zgarmasa — belgi turgan ekranga qaytib, belgiga qarang. «Ulangan» bo'lsa, agentga: «Tekshiruv so'rovidan keyin telefonda son o'zgarmadi: {nima ko'rdim}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Если число не изменилось — вернитесь на экран со значком и посмотрите на него. Если «Ulangan», агенту: «После проверочного запроса число на телефоне не изменилось: {что я увидел}. Больше ничего не трогай, назови изменённые файлы.»' })}</span>
            {mobil && <span className="rt-band">{tx({ uz: "Agent Render'ga so'rov yubora olmasa yoki juftlikda ishlasangiz: sinfdoshingiz telefonida ilovangizni oching (Android'dagi Expo Go), o'zingiz 11-Modulda yaratgan ikkinchi namuna akkaunt bilan kiring va o'zgarishni sinfdoshingiz qilsin, keyin qaytarsin. Expo akkauntingiz ma'lumotini bermang.", ru: 'Если агент не может отправить запрос на Render или вы работаете в паре: откройте приложение на телефоне одноклассника (Expo Go на Android), войдите вторым образцовым аккаунтом из 11-го модуля, пусть одноклассник сделает изменение, потом вернёт. Данные своего аккаунта Expo не давайте.' })}</span>}
          </> }
      ]}
      natija={<NatijaA1 />}
      doneText={{ uz: "Ro'yxat pastga tortmasdan yangilandi — buni telefonda o'zingiz ko'rdingiz.", ru: 'Список обновился без потягивания вниз — вы сами видели это на телефоне.' }}
      ortda={{ uz: "(faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz, o'z repo'ngizdagi bo'limni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).", ru: '(только в этой новой папке — команда стирает изменения в папке) — увидите, как это работает, и по нему вернёте раздел в своём репозитории (в `backend/.env` и `mobil/.env` впишите свои значения).' }}
      ulgur={{ uz: "Ulgurmasangiz: `git push` qilib, «3 · Ishga tushirish»gacha yeting va davom eting — telefonda tekshirish uyga qoladi, yakun nima qolganini aytadi.", ru: 'Если не успеваете: сделайте `git push`, дойдите до «3 · Запуск» и продолжайте — проверка на телефоне останется на дом, итог скажет, что осталось.' }}
      ulgurQadam={3}
      ustoz={[{ uz: "Mobil trekda tekshiruv so'rovini agent o'zi ochgan tekshiruv akkauntidan yuboradi — o'quvchi telefonga qaraydi; web-trekda o'quvchi o'zgarishni kompyuterdagi yashirin oynadan o'zi qiladi. Agent Render'ga so'rov yubora olishi — «qur» pilotida tekshiriladi. Agent qaysi akkaunt va qaysi `id` larni aytganini o'quvchi yozib oladi; o'chirishni faqat shu `id` lar bilan so'raydi.", ru: 'В мобильном треке проверочный запрос агент отправляет из проверочного аккаунта, который сам открыл, — ученик смотрит на телефон; в веб-треке ученик сам делает изменение из окна инкогнито на компьютере. Может ли агент отправить запрос на Render — проверяется на пилоте «сборки». Ученик записывает, какой аккаунт и какие `id` назвал агент; удаление просит только по этим `id`.' }, { uz: "Telefon Render'dagi Backend'ga ulangan — tekshiruv so'rovi ham o'sha yerga borishi kerak (laptopdagi Backend yuborgan hodisa telefonga yetmaydi). Database bitta, shuning uchun tekshiruv yozuvlari qolmasin. Juftlik yo'lida iPhone'li sinfdosh Expo Go'da o'quvchining loyihasini ochmaydi (loyiha egasining Expo akkaunti kerak — 11-Modul) — web havola yoki Android.", ru: 'Телефон подключён к Backend на Render — проверочный запрос тоже должен идти туда (событие от Backend на ноутбуке до телефона не дойдёт). Database одна, поэтому проверочные записи не должны оставаться. В парном варианте одноклассник с iPhone не откроет проект ученика в Expo Go (нужен Expo-аккаунт владельца — 11-й модуль) — веб-ссылка или Android.' }]}
    />
  );
};

// ----- A2: kutilgan natija — telefon «O'yinlar» (Ulangan → samolyot «Ulanmoqda…», kartalar joyida → «Ulangan» → pastga tortish) va README ko'rinishi -----
const NatijaA2 = () => {
  const [f, setF] = useState(kamHarakat() ? 3 : 0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1300, () => setF(1)], [1800, () => setF(2)], [1300, () => setF(3)]]); }, []); // eslint-disable-line
  return (
    <div className="rt-a2n">
      <Telefon no={1} t={{ tex: 'Expo Go', ekran: 'oyinlar', belgi: f === 1 ? 'ulanmoqda' : 'ulangan', samolyot: f === 1, son: 8, tort: f === 3 }} />
      <div className="rt-rd">
        <span className="rt-rd-gh"><code>README.md</code></span>
        <b className="rt-rd-h">Real vaqt</b>
        <div className="rt-rd-j">{MH.hodisalar.map(r => <span key={r.id} className="rt-rd-r">{tr(r.kimNima)} · oyin-ozgardi · {r.sabab}</span>)}</div>
        <b className="rt-rd-h2">{tr(TS.bolim[1])}</b>
        {MH.holatlar.map(h => <span key={h.k} className="rt-rd-q">{tr(h.t)}</span>)}
        <b className="rt-rd-h2">{tr(TS.chekkaNom)}</b>
        {MH.chekka.map((c, i) => <span key={i} className="rt-rd-q">{tr(c)}</span>)}
      </div>
    </div>
  );
};
const A2_JOY = { uz: '{nima buzilmasin}', ru: '{что не сломать}' };
const A2_JOY_NAMUNA = { uz: "masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin.", ru: 'например: вход, объявление игры, присоединение, подтверждение, выход и очередь работают как раньше; обновление потягиванием вниз остаётся.' };
const A2_YORDAM = [
  { uz: "Qayerda: `mobil/` — «O'yinlar» ekrani (`src/app/index.tsx`), ulanish belgisi shu yerda; `README.md` — «Real vaqt» bo'limi.", ru: 'Где: `mobil/` — экран «O\'yinlar» (`src/app/index.tsx`), значок соединения здесь; `README.md` — раздел «Real vaqt».' },
  { uz: 'Nima qilsin: ulanish holatlari — har holatda foydalanuvchi shuni ko\'rsin:', ru: 'Что сделать: состояния соединения — в каждом состоянии пользователь видит вот это:' },
  ...MH.holatlar.map(h => h.t),
  { uz: "Chekka holatlar — har birida shunday bo'lsin:", ru: 'Крайние случаи — в каждом пусть будет так:' },
  ...MH.chekka.map((c, i) => ({ uz: `${i + 1}) ${c.uz}`, ru: `${i + 1}) ${c.ru}` })),
  { uz: "`README.md` «Real vaqt» bo'limiga, jadvaldan keyin, ikki bo'lim qo'sh: «Ulanish holatlari» va «Chekka holatlar» — so'zlarimni o'zgartirma.", ru: 'В раздел «Real vaqt» файла `README.md`, после таблицы, добавь два раздела: «Ulanish holatlari» и «Chekka holatlar» — мои слова не меняй.' },
  { uz: "Nima buzilmasin: Kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход, объявление игры, присоединение, подтверждение, выход и очередь работают как раньше; обновление потягиванием вниз остаётся. `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' },
  { kulrang: { uz: "Web-trek: «Qayerda» — `prototip/` dagi belgi turgan sahifa; «Ulanmagan» qatorida va «Nima buzilmasin» da — «Yangilash» tugmasi ishlaydi.", ru: 'Веб-трек: «Где» — страница со значком в `prototip/`; в строке «Ulanmagan» и в «Что не сломать» — работает кнопка «Yangilash».' } }
];
const ScreenA2 = (props) => {
  const [trek, setTrek] = useState(trekOqi);
  const tanla = (t) => { trekYoz(t); setTrek(t); };
  const [t0] = useState(() => lsO(TALAB_KEY) || {});
  const [buz, setBuz] = useState(() => (typeof t0.buzilmasin === 'string' ? t0.buzilmasin : ''));
  const h = t0.holatlar || {};
  const ch = Array.isArray(t0.chekka) ? t0.chekka.filter(c => c && c.matn) : [];
  const satrlar = [
    { uz: "Qayerda: ulanish belgisi turgan ekran (2-darsda qo'yilgan); `README.md` — «Real vaqt» bo'limi.", ru: 'Где: экран со значком соединения (поставлен на 2-м уроке); `README.md` — раздел «Real vaqt».' },
    { uz: "Nima qilsin: ulanish holatlari — har holatda foydalanuvchi shuni ko'rsin:", ru: 'Что сделать: состояния соединения — в каждом состоянии пользователь видит вот это:' },
    { uz: `Ulangan — ${h.ulangan || '{ulangan}'}`, ru: `Ulangan — ${h.ulangan || '{подключено}'}` },
    { uz: `Ulanmoqda — ${h.ulanmoqda || '{ulanmoqda}'}`, ru: `Ulanmoqda — ${h.ulanmoqda || '{подключается}'}` },
    { uz: `Ulanmagan — ${h.ulanmagan || '{ulanmagan}'}`, ru: `Ulanmagan — ${h.ulanmagan || '{не подключено}'}` },
    { uz: "Chekka holatlar — har birida shunday bo'lsin:", ru: 'Крайние случаи — в каждом пусть будет так:' },
    ...(ch.length ? ch.map((c, i) => `${i + 1}) ${c.matn}`) : [{ uz: '{chekka holatlar}', ru: "{крайние случаи}" }]),
    { uz: "`README.md` «Real vaqt» bo'limiga, jadvaldan keyin, ikki bo'lim qo'sh: «Ulanish holatlari» va «Chekka holatlar» — so'zlarimni o'zgartirma.", ru: 'В раздел «Real vaqt» файла `README.md`, после таблицы, добавь два раздела: «Ulanish holatlari» и «Chekka holatlar» — мои слова не меняй.' },
    { uz: `Nima buzilmasin: ${A2_JOY.uz} \`.env\` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.`, ru: `Что не сломать: ${A2_JOY.ru} \`.env\` не трогай. Больше ничего не трогай, назови изменённые файлы.` }
  ];
  const buzT = buz.trim();
  const saqlaBuz = () => { if (!buzT) return; const t = lsO(TALAB_KEY); if (t) lsY(TALAB_KEY, { ...t, buzilmasin: buzT }); };
  const web = trek !== 'mobil';
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · holatlar va README', ru: 'Практика 2 · состояния и README' }}
      title={{ uz: <>Ulanish holatlari ekranda, talab <A>README'da bo'lsin.</A></>, ru: <>Состояния соединения видны, <A>требование — в README.</A></> }}
      mentor={{ uz: "Endi «Nima buzilmasin» qatorini o'zingiz yozasiz — qolgani talabingizdan olindi; «1 · Ochish»dan boshlang.", ru: "Теперь строку «Что не сломать» пишете сами — остальное взято из вашего требования; начните с «1 · Открыть»." }}
      ustida={<TrekTanlov trek={trek} onTanla={tanla} />}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Amaliyot 1 `git push` qilingan, Render'da yangi versiya chiqqan. Ilovangizda belgi turgan ekranni oching. Pastdagi talabda ulanish holatlari va chekka holatlaringiz turibdi — o'qib chiqing.", ru: 'Практика 1 отправлена через `git push`, на Render вышла новая версия. Откройте в приложении экран со значком. В требовании ниже — ваши состояния соединения и крайние случаи — прочитайте их.' } },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Nima buzilmasin» qatorini o'zingiz yozing: qaysi ishlar avvalgidek qolishi kerak (kulrang namunaga qarang), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: "Строку «Что не сломать» напишите сами: что должно работать как раньше (смотрите серый образец), нажмите «Скопировать» и отправьте в Antigravity:" },
          oldin: <label className="rt-ms-maydon belgili rt-buz"><span className="rt-buz-l">{tr(TS.varaq.buz)}</span><input className="rt-ms-inp" value={buz} maxLength={220} aria-label={tr(TS.varaq.buz)} onChange={e => setBuz(e.target.value)} /></label>,
          prompt: satrlar, tahrir: true, toldir: buzT ? { [tr(A2_JOY)]: buzT } : {}, namuna: buzT ? [] : [{ joy: tr(A2_JOY), n: A2_JOY_NAMUNA }], onNusxa: saqlaBuz, yordam: A2_YORDAM },
        { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "`git diff` — o'zgarish agent aytgan fayllardami; keyin `git status` → har faylni `git add <fayl>` bilan → `git commit -m \"real vaqt: ulanish holatlari, README\"` → `git push`. Render'da yangi versiya chiqishini kuting (bir necha daqiqa cho'zilishi mumkin).", ru: '`git diff` — изменения в тех файлах, что назвал агент; затем `git status` → каждый файл через `git add <fayl>` → `git commit -m "real vaqt: ulanish holatlari, README"` → `git push`. Дождитесь новой версии на Render (может занять несколько минут).' },
          err: { uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если появилась ошибка — отправьте агенту строку ошибки (не значения `.env`, не токен и не ключи): «Вот такая ошибка: {ошибка}. Исправь.»' } },
        { h: { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }, t: { uz: "talabingizdagi har holatni ko'ring:", ru: 'посмотрите каждое состояние из требования:' },
          bandlar: [
            { uz: "(1) Belgi «Ulangan» — ekran talabingizdagidek bo'lishi kerak.", ru: "(1) Значок «Ulangan» («Подключено») — экран должен быть как в требовании." },
            { uz: "(2) Uchish rejimini yoqing: belgi «Ulanmoqda…» ga o'tishi kerak — darhol o'zgarmasligi mumkin: uzilishni aniqlash vaqt oladi (bir daqiqagacha). Ekranda talabingizda yozilgan narsa turishi kerak (Mentor misolida — ro'yxat joyida qoladi).", ru: "(2) Включите режим полёта: значок должен смениться на «Ulanmoqda…» («Подключается…») — может не сразу: обнаружение обрыва занимает время (до минуты). На экране должно быть то, что написано в требовании (в примере Ментора — список остаётся на месте)." },
            { uz: "(3) Uchish rejimini o'chiring: belgi «Ulangan» ga qaytishi kerak, odatda bir necha soniyada. Pastga torting — ro'yxat yangilanishi kerak.", ru: '(3) Выключите режим полёта: значок должен вернуться к «Ulangan», обычно за несколько секунд. Потяните вниз — список должен обновиться.' }
          ],
          ichi: <>
            <Xabar yorliq={{ uz: "(4) «Ulanmagan» ni telefonda chaqirish qiyin. Agentga yozing:", ru: "(4) «Ulanmagan» («Не подключено») на телефоне вызвать трудно. Напишите агенту:" }} satrlar={[{ uz: "Belgi qachon «Ulanmagan» bo'ladi va o'shanda ekranda nima turadi? Kodning qaysi fayli va qatori?", ru: 'Когда значок становится «Ulanmagan» и что тогда на экране? Какой файл и какая строка кода?' }]}
              keyin={{ uz: "— javobni talabingizdagi qator bilan solishtiring. Bu — agentning so'zi va kod qatori: telefonda bu holatni ko'rmadingiz.", ru: '— сравните ответ со строкой из требования. Это слова агента и строка кода: на телефоне это состояние вы не видели.' }} />
            <span className="rt-band">{tx({ uz: "(5) GitHub'da `README.md` ni oching: «Real vaqt» bo'limida ikki yangi bo'lim bor, so'zlaringiz o'zgarmagan.", ru: '(5) Откройте `README.md` на GitHub: в разделе «Real vaqt» два новых раздела, ваши слова не изменены.' })}</span>
            <span className="rt-band">{tx({ uz: "Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Несовпадение напишите агенту: «{что} не как в требовании: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»' })}</span>
            <span className="rt-band kul">{tx({ uz: "Agent chekka holatlarni «bajardim» desa — bu hali uning so'zi: bugun siz ulanish holatlarini va README'ni tekshirdingiz.", ru: 'Если агент говорит, что «сделал» крайние случаи, — это пока его слова: сегодня вы проверили состояния соединения и README.' })}</span>
            {web && <span className="rt-band">{tx({ uz: "Web-trekda: saytingizni telefon brauzerida oching va uchish rejimini telefonda yoqing — kompyuterda Wi-Fi'ni o'chirish dars sahifasini ham uzadi; «Ulanmagan» qatorida — «Yangilash» tugmasi.", ru: 'В веб-треке: откройте сайт в браузере телефона и включите режим полёта на телефоне — выключение Wi-Fi на компьютере отключит и страницу урока; в строке «Ulanmagan» — кнопка «Yangilash».' })}</span>}
          </> }
      ]}
      natija={<NatijaA2 />}
      doneText={{ uz: "Ulanish holatlari talabingizdagidek; talab README'da — chekka holatlar bilan birga.", ru: 'Состояния соединения — как в вашем требовании; требование в README — вместе с крайними случаями.' }}
      ulgur={{ uz: "Ulgurmasangiz: Prompt yuborilgan va `git push` qilingan bo'lsa — telefonda tekshirishni uyda qilasiz; yakun nima qolganini aytadi.", ru: 'Если не успеваете: если промпт отправлен и сделан `git push` — проверку на телефоне сделаете дома; итог скажет, что осталось.' }}
      ulgurQadam={3}
      ustoz={[{ uz: "Uchish rejimi paytida boshqa o'zgarish qilinmaydi — bu darsda faqat belgi va ekran ko'riladi. Agent chekka holatlar haqida «bajardim» desa — e'tiroz shart emas, faqat «bu uning so'zi» ekani aytiladi.", ru: 'Во время режима полёта других изменений не делают — на этом уроке смотрят только значок и экран. Если агент говорит, что «сделал» крайние случаи, — возражать не нужно, только сказать, что «это его слова».' }, { uz: "«Nima buzilmasin» — o'quvchining qarori: Mentor qatorini ko'chirgan o'quvchidan «Sizning ilovangizda bu ishlar bormi?» deb so'rang.", ru: '«Что не сломать» — решение ученика: у того, кто скопировал строку Ментора, спросите: «А в вашем приложении эти действия есть?»' }]}
    />
  );
};

// ===== 🃏 KARTOCHKALAR — alohida ekran (SABOQ 12, 16): Mentor yo'q, birinchi bosishgacha karta yuzi halqada va ostida ko'rsatma =====
const KARTALAR = [
  { front: { uz: 'Real vaqt talabi nima?', ru: "Что такое требование к реальному времени?" }, back: { uz: "Talabning real vaqt funksiyasi uchun uch bo'limi", ru: 'Три раздела требования для функции реального времени' }, note: { uz: 'Bu darsda: hodisalar, ulanish holatlari, chekka holatlar', ru: 'В этом уроке: события, состояния соединения, крайние случаи' } },
  { front: { uz: "Hodisalar bo'limining har qatorida nima bor?", ru: 'Что есть в каждой строке раздела «События»?' }, back: { uz: "Kim nima qiladi, qaysi hodisa, kim oladi, ekranda nima o'zgaradi", ru: 'Кто что делает, какое событие, кто получает, что меняется на экране' }, note: { uz: '2-darsdagi real vaqt oqimi sxemasidan', ru: 'Из схемы потока реального времени 2-го урока' } },
  { front: { uz: "Ulanish holatlari bo'limida nima yoziladi?", ru: 'Что пишут в разделе состояний соединения?' }, back: { uz: "Har holatda foydalanuvchi nimani ko'rishi", ru: 'Что видит пользователь в каждом состоянии' }, note: { uz: 'Uch holat: ulangan, ulanmoqda, ulanmagan', ru: 'Три состояния: подключено, подключается, не подключено' } },
  { front: { uz: 'Chekka holat nima?', ru: 'Что такое крайний случай?' }, back: { uz: "Kam uchraydigan, lekin bo'ladigan vaziyat", ru: 'Редкая, но реальная ситуация' }, note: { uz: "Talabda unda nima bo'lishi yoziladi", ru: 'В требовании пишут, что в ней должно быть' } },
  { front: { uz: 'Talabda yozilmagan joy kimning tanloviga qoladi?', ru: 'На чей выбор остаётся то, что не написано в требовании?' }, back: { uz: 'Agentning', ru: 'Агента' }, note: { uz: 'Shuning uchun ulanish holatlari ham yoziladi', ru: 'Поэтому пишут и состояния соединения' } },
  { front: { uz: 'Mentor misolida «Ulanmoqda…» paytida ekranda nima turadi?', ru: "Что на экране в примере Ментора во время «Подключается…»?" }, back: { uz: "Ro'yxat ekranda qoladi", ru: 'Список остаётся на экране' }, note: { uz: "Eskirgan bo'lishi mumkin", ru: 'Может быть устаревшим' } },
  { front: { uz: "Mentor misolida «Ulanmagan» bo'lsa, nima ishlaydi?", ru: "Что работает в примере Ментора при «Не подключено»?" }, back: { uz: 'Pastga tortib yangilash', ru: 'Обновление потягиванием вниз' }, note: { uz: 'Web-trekda — «Yangilash» tugmasi', ru: 'В веб-треке — кнопка «Yangilash»' } },
  { front: { uz: "Mentor talabida internet uzilib qaytsa, nima bo'lishi kerak?", ru: 'Что должно быть по требованию Ментора, если интернет пропал и вернулся?' }, back: { uz: "Ro'yxat yangi holatni ko'rsatishi kerak", ru: 'Список должен показать новое состояние' }, note: { uz: 'Bu misolda uzilish paytidagi hodisa keyin kelmaydi', ru: 'В этом примере событие во время обрыва потом не придёт' } },
  { front: { uz: 'PRD va real vaqt talabining farqi nimada?', ru: "Чем PRD отличается от требования к реальному времени?" }, back: { uz: "PRD nima qurilishini aytadi; real vaqt talabi — o'zgarish qanday ko'rinishini", ru: "PRD говорит, что строится; требование к реальному времени — как выглядит изменение" }, note: { uz: "Bu kursdagi bo'linish; PRD — 11-Modul 5-darsida", ru: 'Это деление в нашем курсе; PRD — 11-й модуль, 5-й урок' } },
  { front: { uz: 'Agent «chekka holatlarni bajardim» desa, bu nima?', ru: 'Что значит, если агент сказал «крайние случаи сделал»?' }, back: { uz: "Hali agentning so'zi", ru: 'Пока это слова агента' }, note: { uz: 'Talabda yozilgani — bajarilgani emas', ru: 'Написанное в требовании — ещё не сделанное' } },
  { front: { uz: "Bugun ro'yxat o'zi yangilanishi qanday tekshirildi?", ru: 'Как сегодня проверили, что список обновляется сам?' }, back: { uz: 'Boshqa akkaunt o\'zgarish qildi', ru: 'Изменение сделал другой аккаунт' }, note: { uz: "Mobil trekda — agent, web-trekda — o'zingiz; son pastga tortmasdan o'zgardi", ru: 'В мобильном треке — агент, в веб-треке — вы сами; число изменилось без потягивания вниз' } },
  { front: { uz: "Agent yaratgan tekshiruv yozuvlari qanday o'chiriladi?", ru: 'Как удаляют проверочные записи, созданные агентом?' }, back: { uz: 'Faqat u aytgan `id` lar bo\'yicha', ru: 'Только по названным им `id`' }, note: { uz: "Umumiy «hammasini o'chir» buyrug'i berilmaydi", ru: 'Общую команду «удали всё» не дают' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cx('rt-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tr(c.front), back: tr(c.back).split('`').join(''), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="rt-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025 karta shaklida; ① holatdan, ③ — talabda uchta chekka holat bo'lmasa; alohida .homework.jsx yo'q) =====
const HwCard = ({ keyingi, birinchi, uchinchi }) => {
  const bandlar = [
    birinchi && { uz: `Darsda qolgan qismni tugating: ${birinchi.uz}.`, ru: `Доделайте то, что осталось с урока: ${birinchi.ru}.` },
    { uz: "Uchish rejimini yana bir marta yoqib-o'chiring: belgi va ekran talabingizdagidek bo'ldimi? Farq bo'lsa — nima qildingiz va nima ko'rdingiz, bir qator yozib qo'ying.", ru: 'Ещё раз включите и выключите режим полёта: значок и экран были как в требовании? Если есть разница — запишите одной строкой, что сделали и что увидели.' },
    uchinchi && { uz: "Talabingizda ikkita chekka holat bo'lsa — ilovangiz uchun uchinchisini o'ylab, darsdagi talabingizga va README'dagi «Chekka holatlar» bo'limiga qo'shing — bu talab: kod hali o'zgarmaydi.", ru: 'Если в требовании два крайних случая — придумайте третий для своего приложения и добавьте в требование на уроке и в раздел «Chekka holatlar» в README — это требование: код пока не меняется.' }
  ].filter(Boolean);
  return (
    <div className="card rt-hw fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      <div className="rt-hw-karta"><span className="rt-hw-q"><em>{tr({ uz: 'Kim uchun:', ru: 'Для кого:' })}</em> <b>{tr({ uz: "o'z mahsulotingiz", ru: 'ваш продукт' })}</b></span><span className="rt-hw-q"><em>{tr({ uz: 'Muddat:', ru: 'Срок:' })}</em> <b>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</b></span></div>
      <ol className="rt-hw-qadam">{bandlar.map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{tx(q)}</span></li>)}</ol>
      {keyingi && <span className="rt-hw-keyingi">{keyingi}</span>}
    </div>
  );
};

// ===== YAKUN — QYakun (DE-204) + holatga qarab sarlavha (sinf 1, E 54 — har holatda rost). Standart: chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar (E 50) =====
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
  // «Endi siz bilasiz» — bugungi asosiy fikrni takrorlamaydi (T-048)
  const RECAP = [
    { uz: "Hodisalar bo'limida kim nima qilganda qaysi hodisa kimga borishi va ekranda nima o'zgarishi yoziladi.", ru: 'В разделе «События» пишут, какое событие кому идёт, когда кто-то что-то делает, и что меняется на экране.' },
    { uz: "Ulanish holatlari bo'limida har holatda foydalanuvchi nimani ko'rishi yoziladi.", ru: 'В разделе состояний соединения пишут, что видит пользователь в каждом состоянии.' },
    { uz: "Chekka holat — kam uchraydigan, lekin bo'ladigan vaziyat; talabda unda nima bo'lishi yoziladi.", ru: 'Крайний случай — редкая, но реальная ситуация; в требовании пишут, что в ней должно быть.' },
    { uz: 'Talabda yozilmagan joy agentning tanloviga qoladi.', ru: 'То, что не написано в требовании, остаётся на выбор агента.' },
    { uz: "Agent yaratgan tekshiruv yozuvlari faqat u aytgan `id` lar bo'yicha o'chiriladi.", ru: 'Проверочные записи, созданные агентом, удаляют только по названным им `id`.' }
  ];
  const t = lsO(TALAB_KEY);
  const talabBor = !!(t && Array.isArray(t.hodisalar) && t.hodisalar.length && t.holatlar);
  const chekkaN = t && Array.isArray(t.chekka) ? t.chekka.length : 0;
  const a1 = !!(answers[A1_IDX] && answers[A1_IDX].solved);
  const a2 = !!(answers[A2_IDX] && answers[A2_IDX].solved);
  const holat = isMentorL || (a1 && a2) ? 'toliq' : a1 ? 'a1' : a2 ? 'a2' : talabBor ? 'talab' : 'yoq';
  const SARLAVHA = {
    toliq: { uz: <>Talab yozildi, tekshiruvda <A>ro'yxat o'zi yangilandi.</A></>, ru: <>Требование написано, на проверке <A>список обновился сам.</A></> },
    a1: { uz: <>Ro'yxat o'zi yangilandi — <A>holatlar bo'limi qoldi.</A></>, ru: <>Список обновился сам — <A>остался раздел состояний.</A></> },
    a2: { uz: <>Holatlar tayyor — <A>ro'yxatni tekshirish qoldi.</A></>, ru: <>Состояния готовы — <A>осталось проверить список.</A></> },
    talab: { uz: <>Talab tayyor — <A>agentga berib, tekshirish qoldi.</A></>, ru: <>Требование готово — <A>осталось отдать агенту и проверить.</A></> },
    yoq: { uz: <>Talab hali yozilmagan — <A>uyda yozib chiqing.</A></>, ru: <>Требование ещё не написано — <A>напишите его дома.</A></> }
  };
  const toliq = holat === 'toliq';
  const qolgan = [!a1 && { uz: 'Amaliyot 1 ni telefonda tekshiring', ru: 'проверьте Практику 1 на телефоне' }, !a2 && { uz: 'Amaliyot 2 ni bajaring', ru: 'выполните Практику 2' }].filter(Boolean);
  const birinchi = !isMentorL && qolgan.length ? { uz: qolgan.map(q => q.uz).join(' · '), ru: qolgan.map(q => q.ru).join(' · ') } : null;
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: jonli xabar va eslatma»</b></>, ru: <>Следующий урок — <b>«День проекта: живое сообщение и напоминание»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cx('rt-yakun', !toliq && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={tr(SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tx)}
          uyga={<HwCard keyingi={keyingi} birinchi={birinchi} uchinchi={chekkaN < 3} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmRealtimeSpecLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — «Talab va telefon» (rt-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Telefon 172×272 hamma ekranda (SABOQ 22) === */
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .rt-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: rt-puls 2.2s ease-out .3s 3; }
        @keyframes rt-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        /* Variantlar va tanlov chiplari: guruh ramkasi yo'q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .rt-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: rt-chorla-v 1.8s ease-out .5s 2; }
        @keyframes rt-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .rt-halqa-g .q-chip:not(:disabled), .rt-chorla > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: rt-chorla-c 1.8s ease-out .5s 2; }
        @keyframes rt-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .rt-k.faol .q-variant:nth-child(2), .rt-halqa-g .q-chip:nth-child(2), .rt-chorla > .q-chip:nth-child(2) { animation-delay: .75s; }
        .rt-k.faol .q-variant:nth-child(3), .rt-halqa-g .q-chip:nth-child(3) { animation-delay: 1s; }
        .rt-k { display: contents; }
        /* ⛶ telefonda va torroq ekranda mazmunni yopmasin (SABOQ C — skelet tuzog'i): tugma o'z qatorida, vizual 36px pastdan boshlanadi (1-pilot yechimi) */
        @media (max-width: 1199px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .rt-pop { display: inline-block; animation: rt-pop 0.55s cubic-bezier(.3,1.5,.5,1); color: ${T.accent}; }
        @keyframes rt-pop { 0% { transform: scale(1.45); } 100% { transform: scale(1); } }
        .rt-viz { display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
        p.rt-nom { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        p.rt-nom b { color: ${T.accent}; }
        /* Yashil xulosa ichida: taxmin qatori (kichik) · asosiy gap · izoh (kichik, ingichka ajratgich) — E 42 */
        .q-xulosa .rt-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .rt-x-tx b { color: ${T.ink}; } .q-xulosa .rt-x-tx.ok, .q-xulosa .rt-x-tx.ok b { color: ${T.ok}; } .q-xulosa .rt-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .rt-x-m { display: block; }
        .q-xulosa .rt-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        .rt-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .rt-bash-t b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        .rt-ustoz { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; padding: 10px 12px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; font-size: 13px; line-height: 1.5; color: ${T.ink2}; }
        .rt-ustoz b { color: ${T.ink}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        /* Sahna joylashuvi: yot — bir qatorda; tik — telefonlar tepada, Backend pastda */
        .rt-sahna { user-select: none; -webkit-user-select: none; display: grid; gap: 0 10px; padding-top: 30px; justify-content: center; align-items: start; }
        .rt-sahna.yot.ikki { grid-template-columns: auto minmax(56px, 80px) auto minmax(56px, 80px) auto; grid-template-areas: "t1 c1 be c2 t2"; }
        .rt-sahna.yot.bir { grid-template-columns: auto minmax(56px, 100px) auto; grid-template-areas: "t1 c1 be"; }
        .rt-sahna.tik.ikki { grid-template-columns: 172px 172px; column-gap: 12px; grid-template-areas: "t1 t2" "c1 c2" "be be"; }
        .rt-sahna.tik.bir { grid-template-columns: auto; grid-template-areas: "t1" "c1" "be"; justify-items: center; }
        .rt-sahna.bes.tik.ikki { grid-template-areas: "t1 t2"; }
        .rt-s-t1 { grid-area: t1; } .rt-s-t2 { grid-area: t2; } .rt-s-c1 { grid-area: c1; } .rt-s-c2 { grid-area: c2; } .rt-s-be { grid-area: be; justify-self: center; }
        .rt-sahna.tik .rt-s-c1, .rt-sahna.tik .rt-s-c2 { justify-self: center; }
        /* Telefon */
        .rt-tel-ust { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; width: 172px; flex: none; }
        .rt-tel-yorliq { position: absolute; top: -28px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 999px; white-space: nowrap; }
        .rt-tel-yorliq.b1 { background: ${T.accentSoft}; color: ${T.accent}; } .rt-tel-yorliq.b2 { background: ${fon(T.ink, 0.08)}; color: ${T.ink}; }
        .rt-tel-yorliq.tex { position: static; transform: none; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink2}; }
        .rt-telefon { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 5px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px 8px 4px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .rt-tel-bar { position: relative; display: flex; align-items: center; justify-content: center; height: 18px; flex: none; }
        .rt-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: ${MAYDON_RANG}; letter-spacing: 0.01em; }
        .rt-samolyot { position: absolute; right: 0; top: -1px; width: 22px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid ${T.line}; border-radius: 7px; background: ${T.bg}; color: ${T.ink2}; cursor: pointer; padding: 0; transition: background 0.25s, color 0.25s; }
        .rt-samolyot.on { background: ${T.accent}; color: #fff; border-color: ${T.accent}; }
        .rt-samolyot:disabled { cursor: default; }
        .rt-tel-ekran { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; animation: rt-ekran 0.35s ease-out both; }
        @keyframes rt-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        .rt-bosh { flex: none; align-self: center; width: 70px; height: 14px; padding: 0; border: 0; border-radius: 999px; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .rt-bosh i { display: block; width: 52px; height: 4px; border-radius: 999px; background: ${fon(T.ink, 0.35)}; }
        .rt-bosh:disabled { cursor: default; }
        .rt-oyin { display: flex; flex-direction: column; gap: 3px; flex: 1; min-height: 0; }
        .rt-oyin-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .rt-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .rt-oyin-joy { font-size: 12px; color: ${T.ink2}; }
        .rt-hisob { display: inline-flex; align-items: baseline; gap: 6px; align-self: flex-start; margin-top: 4px; padding: 0 2px; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${T.ink2}; border-radius: 6px; }
        .rt-son { display: inline-block; font-size: 22px; font-weight: 800; color: ${T.ink}; }
        .rt-son.yangi { color: ${T.accent}; animation: rt-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .rt-eski { font-family: 'Manrope'; font-style: normal; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; background: ${fon(T.ink, 0.07)}; border-radius: 999px; padding: 1px 7px; animation: fade-in-up 0.4s ease-out both; }
        .rt-doiralar { display: grid; grid-template-columns: repeat(5, 14px); gap: 6px; margin: 3px 0 4px; }
        .rt-doiralar i { width: 14px; height: 14px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .rt-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.38)}; }
        .rt-doiralar i.yangi { background: ${T.accent}; animation: rt-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .rt-qoshil { margin-top: auto; flex: none; display: flex; align-items: center; justify-content: center; height: 30px; border: 0; border-radius: 10px; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-size: 12px; font-weight: 800; cursor: pointer; transition: background 0.3s, color 0.3s; }
        .rt-qoshil:disabled { cursor: default; }
        .rt-qoshil:disabled:not(.off) { background: ${fon(T.accent, 0.16)}; color: ${T.accent}; }
        .rt-qoshil.off { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .rt-oyinlar { position: relative; display: flex; flex-direction: column; gap: 5px; flex: 1; min-height: 0; }
        .rt-ol-bosh { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .rt-ol-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .rt-tort { align-self: center; font-size: 15px; font-weight: 800; line-height: 1; color: ${T.accent}; }
        .rt-kun { font-size: 11px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.04em; }
        .rt-karta { display: flex; flex-direction: column; gap: 1px; padding: 6px 8px; border-radius: 9px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11px; line-height: 1.3; color: ${T.ink2}; }
        .rt-karta b { font-size: 12px; color: ${T.ink}; }
        .rt-karta-son { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; display: flex; align-items: baseline; gap: 6px; }
        .rt-belgi { display: inline-flex; align-items: center; gap: 5px; height: 20px; padding: 0 8px; border-radius: 999px; font-size: 10.5px; font-weight: 800; white-space: nowrap; animation: fade-in-up 0.35s ease-out both; }
        .rt-belgi-n { width: 7px; height: 7px; border-radius: 50%; flex: none; }
        .rt-belgi.ulangan { background: ${fon(T.ok, 0.12)}; color: ${T.ok}; } .rt-belgi.ulangan .rt-belgi-n { background: ${T.ok}; }
        .rt-belgi.ulanmoqda { background: ${T.accentSoft}; color: ${T.accent}; } .rt-belgi.ulanmoqda .rt-belgi-n { background: ${T.accent}; animation: rt-miltil 1.6s ease-in-out infinite; }
        .rt-belgi.ulanmagan { background: ${fon(T.ink, 0.07)}; color: ${T.ink2}; } .rt-belgi.ulanmagan .rt-belgi-n { background: ${T.ink2}; }
        @keyframes rt-miltil { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .rt-bosh-ekran { flex: 1; display: flex; align-items: flex-start; justify-content: flex-start; padding: 14px 6px; }
        .rt-ikon { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 6px; border: 0; border-radius: 14px; background: transparent; cursor: pointer; }
        .rt-ikon:disabled { cursor: default; }
        .rt-ikon-sh { width: 46px; height: 46px; border-radius: 13px; background: ${T.ok}; box-shadow: inset 0 -6px 0 ${fon(T.ink, 0.15)}; }
        .rt-ikon-t { font-size: 10.5px; font-weight: 700; color: ${T.ink}; }
        .rt-sanoq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 2px 9px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink2}; }
        .rt-sanoq b { color: ${T.accent}; }
        /* Backend tuguni */
        .rt-be-ust { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .rt-sahna.yot .rt-be-joy { height: 272px; display: flex; align-items: center; justify-content: center; }
        .rt-backend { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 120px; padding: 12px 14px; border-radius: 16px; background: ${T.ink}; color: ${T.paper}; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.6); }
        .rt-be-nom { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
        .rt-db { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 2px 9px; border-radius: 7px; background: ${fon(T.paper, 0.12)}; }
        .rt-db b { color: ${T.paper}; }
        /* Chiziq va konvert */
        .rt-chiziq { position: relative; }
        .rt-chiziq.yot { height: 272px; min-width: 56px; }
        .rt-chiziq.tik { height: 46px; width: 30px; }
        .rt-chiziq-i { position: absolute; display: block; opacity: 0; transition: opacity 0.3s; }
        .rt-chiziq.yot .rt-chiziq-i { left: 0; right: 0; top: calc(50% - 1.5px); height: 3px; }
        .rt-chiziq.tik .rt-chiziq-i { top: 0; bottom: 0; left: calc(50% - 1.5px); width: 3px; }
        /* kesik-ok: shtrix = doimiy bo'lmagan yoki uzilgan ulanish (holat belgisi, bezak emas) */ .rt-chiziq.yot.h-uzilgan .rt-chiziq-i, .rt-chiziq.yot.h-tiklan .rt-chiziq-i { opacity: 1; background: repeating-linear-gradient(90deg, ${fon(T.ink, 0.28)} 0 7px, transparent 7px 13px); }
        /* kesik-ok: shtrix = doimiy bo'lmagan yoki uzilgan ulanish (holat belgisi, bezak emas) */ .rt-chiziq.tik.h-uzilgan .rt-chiziq-i, .rt-chiziq.tik.h-tiklan .rt-chiziq-i { opacity: 1; background: repeating-linear-gradient(180deg, ${fon(T.ink, 0.28)} 0 7px, transparent 7px 13px); }
        .rt-chiziq.h-sorov .rt-chiziq-i { opacity: 1; background: ${T.accent}; box-shadow: 0 0 10px ${fon(T.accent, 0.5)}; }
        .rt-chiziq.h-ochiq .rt-chiziq-i { opacity: 1; background: ${T.ok}; animation: rt-ochiq 2.6s ease-in-out infinite; }
        @keyframes rt-ochiq { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; } 50% { box-shadow: 0 0 9px 1px ${fon(T.ok, 0.45)}; } }
        .rt-chiziq.h-uzildi .rt-chiziq-i { opacity: 1; background: ${T.err}; animation: rt-uzildi 0.5s ease-in both; }
        @keyframes rt-uzildi { 0% { opacity: 1; } 100% { opacity: 0; } }
        .rt-chiziq.h-tiklan .rt-chiziq-i::after { content: ''; position: absolute; inset: 0; background: ${T.ok}; transform-origin: left center; animation: rt-chizx 1.6s linear both; }
        .rt-chiziq.tik.h-tiklan .rt-chiziq-i::after { transform-origin: center top; animation-name: rt-chizy; }
        @keyframes rt-chizx { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes rt-chizy { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .rt-chiziq-y { position: absolute; z-index: 2; left: 50%; top: calc(50% - 30px); transform: translateX(-50%); padding: 1px 8px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; font-family: 'Manrope'; font-size: 12px; font-weight: 800; color: ${T.ink2}; white-space: nowrap; animation: fade-in-up 0.4s ease-out both; }
        .rt-chiziq-y.ok { color: ${T.ok}; border-color: ${fon(T.ok, 0.5)}; }
        .rt-chiziq-y.past { top: calc(50% + 10px); color: ${T.err}; border-color: ${fon(T.err, 0.45)}; }
        .rt-chiziq-y.ost { top: calc(50% + 12px); z-index: 4; }
        .rt-chiziq.yot .rt-chiziq-y.ost { left: 2px; transform: none; white-space: normal; width: 70px; padding: 1px 4px; text-align: center; line-height: 1.2; border-radius: 8px; }
        .rt-chiziq.tik .rt-chiziq-y { top: 50%; left: calc(50% + 14px); transform: translateY(-50%); }
        .rt-chiziq.tik .rt-chiziq-y.past, .rt-chiziq.tik .rt-chiziq-y.ost { left: auto; right: calc(50% + 14px); top: 50%; }
        .rt-chiziq-r { position: absolute; z-index: 2; left: -4px; top: calc(50% - 12px); width: 22px; height: 22px; border-radius: 50%; background: ${T.paper}; border: 1px solid ${T.line}; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; color: ${T.accent}; }
        .rt-chiziq.tik .rt-chiziq-r { left: calc(50% - 11px); top: -4px; }
        .rt-chiziq-r.aylan { animation: rt-aylan 1s linear infinite; }
        @keyframes rt-aylan { to { transform: rotate(360deg); } }
        .rt-kv { position: absolute; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 2px; pointer-events: none; animation-duration: 0.9s; animation-timing-function: ease-in-out; animation-fill-mode: both; }
        .rt-kv.sonadi { animation-duration: 1s; }
        .rt-chiziq.yot .rt-kv { top: 50%; transform: translate(-50%, -28%); }
        .rt-chiziq.tik .rt-kv { left: 50%; transform: translate(-50%, -50%); }
        .rt-kv-i { position: relative; display: block; width: 26px; height: 18px; border-radius: 4px; background: ${T.paper}; border: 1.5px solid ${T.accent}; overflow: hidden; flex: none; }
        .rt-kv-i::before { content: ''; position: absolute; left: 50%; top: -9px; width: 15px; height: 15px; border: 1.5px solid ${T.accent}; transform: translateX(-50%) rotate(45deg); }
        .rt-kv.hodisa .rt-kv-i, .rt-n-kv .rt-kv-i { background: ${T.accent}; }
        .rt-kv.hodisa .rt-kv-i::before, .rt-n-kv .rt-kv-i::before { border-color: ${T.paper}; }
        .rt-kv-y { order: -1; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; padding: 1px 6px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; white-space: nowrap; }
        .rt-kv.hodisa .rt-kv-y { color: ${T.accent}; border-color: ${fon(T.accent, 0.45)}; }
        @keyframes rt-kv-x-ab { from { left: 0%; } to { left: 100%; } }
        @keyframes rt-kv-x-ba { from { left: 100%; } to { left: 0%; } }
        @keyframes rt-kv-y-ab { from { top: 0%; } to { top: 100%; } }
        @keyframes rt-kv-y-ba { from { top: 100%; } to { top: 0%; } }
        @keyframes rt-kv-x-sonadi { 0% { left: 100%; opacity: 1; } 60% { left: 50%; opacity: 1; } 100% { left: 50%; opacity: 0; } }
        @keyframes rt-kv-y-sonadi { 0% { top: 100%; opacity: 1; } 60% { top: 50%; opacity: 1; } 100% { top: 50%; opacity: 0; } }
        /* TalabSahna: chapda sahna, o'ngda talab varag'i (SABOQ 21: telefon chapda) */
        .rt-ts { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 18px; align-items: start; }
        .rt-ts.yolgiz { grid-template-columns: minmax(0, 1fr); justify-items: center; }
        .rt-ts-s { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 0; }
        .rt-ts-y { font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${fon(T.ink, 0.06)}; border-radius: 999px; padding: 2px 10px; }
        .rt-ts-v { min-width: 0; }
        /* Talab varag'i — hujjat ko'rinishi: oq varaq, ingichka chegara */
        .rt-varaq { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 10px 24px -18px rgba(${T.shadowBase},0.4); min-width: 0; }
        .rt-varaq.ixcham { padding: 10px 12px; gap: 6px; width: 190px; flex: none; }
        .rt-v-sar { font-size: 11.5px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink2}; padding-bottom: 6px; border-bottom: 1px solid ${T.line}; }
        .rt-v-qator { font-size: 13px; line-height: 1.5; color: ${T.ink}; transition: opacity 0.4s; }
        .rt-v-qator b, .rt-v-l { font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .rt-v-qator.kul { opacity: 0.55; }
        .rt-v-kul { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${fon(T.ink, 0.06)}; border-radius: 999px; padding: 1px 8px; }
        .rt-v-nima { display: flex; flex-direction: column; gap: 6px; }
        .rt-vb { display: flex; flex-direction: column; gap: 4px; padding: 7px 10px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.bg}; animation: rt-kirdi 0.45s ease-out both; }
        @keyframes rt-kirdi { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
        .rt-vb.yangi { animation: rt-kirdi 0.45s ease-out both, rt-yashil-fon 1.1s ease-out; }
        @keyframes rt-yashil-fon { 0%, 40% { background: ${fon(T.ok, 0.18)}; border-color: ${T.ok}; } 100% { background: ${T.bg}; } }
        .rt-vb.joy { min-height: 34px; border: 2px dashed ${fon(T.ink, 0.22)}; background: transparent; justify-content: center; animation: none; }
        .rt-vb.joy.joriy { border-color: ${fon(T.accent, 0.7)}; background: ${T.accentSoft}; }
        .rt-vb.yashirin { visibility: hidden; }
        .rt-vb-h { display: flex; align-items: center; gap: 7px; font-size: 13px; color: ${T.ink}; }
        .rt-vb-h i { flex: none; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink2}; }
        .rt-vb-h b { font-weight: 800; border-radius: 6px; padding: 0 2px; }
        .rt-vb-h b.rt-yashil { animation: rt-yashil-m 1.2s ease-out; }
        @keyframes rt-yashil-m { 0%, 50% { background: ${fon(T.ok, 0.22)}; color: ${T.ok}; } 100% { background: transparent; } }
        .rt-vb-son { font-style: normal; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .rt-vb-q { display: block; padding: 3px 6px 3px 27px; border-radius: 6px; font-size: 12.5px; line-height: 1.45; color: ${T.ink}; overflow-wrap: anywhere; transition: background 0.3s; }
        .rt-vb-q.on { background: ${fon(T.accent, 0.12)}; box-shadow: inset 0 0 0 1px ${fon(T.accent, 0.45)}; }
        .rt-vb-q.yangi { animation: rt-kirdi 0.45s ease-out both, rt-yashil-fon 1.1s ease-out; }
        .rt-vb-q code, .rt-mini code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        .rt-vb-bosh { display: flex; align-items: center; justify-content: center; height: 26px; margin-left: 27px; border: 1.5px dashed ${fon(T.ink, 0.25)}; border-radius: 7px; font-size: 12px; font-weight: 800; color: ${fon(T.ink, 0.4)}; }
        .rt-vb-iz { padding-left: 27px; font-size: 11.5px; color: ${T.ink2}; }
        .rt-v-tug { display: flex; justify-content: flex-start; margin-top: 2px; }
        .rt-nq { font-family: 'JetBrains Mono', monospace; font-size: 12px; opacity: 0.8; margin-left: 4px; }
        .rt-tahrir { flex: none; margin-left: auto; width: 26px; height: 24px; padding: 0; border: 1px solid ${T.line}; border-radius: 7px; background: ${T.paper}; color: ${T.ink2}; font-size: 13px; cursor: pointer; }
        .rt-tahrir:hover { color: ${T.accent}; border-color: ${T.accent}; }
        .rt-s4-v { align-self: stretch; }
        /* 0-ekran: ikki telefon + agentga bo'sh quti */
        .rt-s0 { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .rt-agent { width: 100%; max-width: 380px; border: 1.5px solid ${T.ink}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .rt-agent-bar { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .rt-agent-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; }
        .rt-agent-bar span { margin-left: 6px; }
        .rt-agent-tana { display: flex; flex-direction: column; gap: 6px; min-height: 52px; padding: 10px 12px; }
        .rt-agent-matn { font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        .rt-kursor { display: inline-block; width: 2px; height: 15px; margin-left: 2px; vertical-align: text-bottom; background: ${T.accent}; animation: rt-kursor 1s steps(1) infinite; }
        @keyframes rt-kursor { 50% { opacity: 0; } }
        .rt-agent-uyalar { display: flex; flex-direction: column; gap: 5px; }
        .rt-uya { display: flex; align-items: center; justify-content: center; height: 24px; border: 1.5px dashed ${fon(T.ink, 0.25)}; border-radius: 7px; font-size: 12px; font-weight: 800; color: ${fon(T.ink, 0.4)}; }
        /* 1-ekran */
        .rt-reja { display: flex; align-items: flex-start; justify-content: center; gap: 14px; padding-top: 30px; }
        p.rt-reja-past { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.5; color: ${T.ink2}; }
        p.rt-reja-past code { font-size: 11.5px; color: ${T.ink}; }
        /* 3, 8-ekran: savol ustida kichik varaq */
        .rt-mini { display: flex; flex-direction: column; gap: 6px; max-width: 640px; margin-bottom: 12px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; }
        .rt-mini-j { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 8px; overflow: hidden; }
        .rt-mini-r { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .rt-mini-r > span { padding: 5px 7px; font-size: 12px; line-height: 1.35; color: ${T.ink}; border-left: 1px solid ${T.line}; overflow-wrap: anywhere; }
        .rt-mini-r > span:first-child { border-left: 0; }
        .rt-mini-r.bosh > span { font-weight: 800; font-size: 11px; color: ${T.paper}; background: ${T.ink}; }
        .rt-mini-b { display: flex; flex-wrap: wrap; gap: 6px 14px; }
        .rt-mini-b > span { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .rt-mini-b i { width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink2}; }
        .rt-mini-b em { font-style: normal; font-size: 11.5px; color: ${T.ink2}; background: ${fon(T.ink, 0.06)}; border-radius: 999px; padding: 1px 8px; }
        /* 5-ekran: mustaqil ish — bitta katta karta */
        .lesson-root .q-ekran > ol.q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .lesson-root .q-mustaqil { max-width: none; }
        .rt-ms-chip { display: inline-flex; align-items: center; border-radius: 8px; }
        .rt-ms-chip.yangi { animation: rt-yashil-m 1s ease-out; }
        .rt-ms-son { color: ${T.ink2}; font-weight: 600; }
        .rt-ms-q { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 2px 8px; border-radius: 999px; border: 1px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope'; font-size: 13px; font-weight: 700; color: ${T.ink}; cursor: pointer; }
        .rt-ms-q:hover { border-color: ${T.accent}; }
        .rt-ms-q.qator { padding: 4px 10px 4px 4px; font-size: 12px; font-weight: 600; animation: rt-kirdi 0.35s ease-out both; }
        .rt-ms-q.qator span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rt-ms-q.qator i { flex: none; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.ok}; color: #fff; }
        .rt-ms-q.qator.joriy { border-color: ${T.accent}; } .rt-ms-q.qator.joriy i { background: ${T.accent}; }
        .rt-ms-oklar { display: flex; flex-wrap: wrap; gap: 6px; }
        .rt-ms-karta { display: flex; flex-direction: column; gap: 9px; max-width: 680px; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 12px 26px -18px rgba(${T.shadowBase},0.4); animation: rt-kirdi 0.4s ease-out both; }
        .rt-ms-yoriq { font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .rt-ms-royxat { display: flex; flex-direction: column; gap: 6px; }
        .rt-chek { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 10px; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.bg}; font-family: 'Manrope'; font-size: 13px; text-align: left; color: ${T.ink2}; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
        .rt-chek span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
        .rt-chek i { flex: none; width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid ${fon(T.ink, 0.3)}; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; color: #fff; }
        .rt-chek.on { border-color: ${fon(T.ok, 0.55)}; background: ${T.paper}; color: ${T.ink}; }
        .rt-chek.on i { background: ${T.ok}; border-color: ${T.ok}; }
        .rt-ms-hod { display: flex; flex-direction: column; gap: 8px; }
        .rt-ms-maydon { position: relative; display: block; }
        .rt-ms-n { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; pointer-events: none; }
        .rt-ms-maydon .rt-ms-inp { padding-left: 38px; }
        .rt-ms-maydon.belgili .rt-belgi.ichida { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); pointer-events: none; animation: none; }
        .rt-ms-maydon.belgili .rt-ms-inp { padding-left: 116px; }
        .rt-ms-inp { width: 100%; padding: 9px 10px; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.bg}; font-family: 'Manrope'; font-size: 14px; color: ${T.ink}; }
        .rt-ms-inp:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .rt-ms-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        .rt-ms-inp::placeholder { color: ${fon(T.ink, 0.42)}; }
        .rt-ms-tug { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 2px; }
        .rt-ms-yordam { margin-left: auto; }
        .rt-kulrang { font-size: 12.5px; color: ${T.ink2}; }
        .rt-yordam-q { display: flex; flex-direction: column; gap: 6px; max-width: 680px; }
        .rt-yordam-misol { display: flex; flex-direction: column; gap: 3px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px dashed ${fon(T.ink, 0.22)}; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .rt-yordam-misol > b { font-size: 11.5px; font-weight: 800; color: ${T.ink2}; margin-bottom: 2px; }
        .rt-fokus { display: flex; flex-direction: column; gap: 10px; max-width: 760px; animation: rt-fokus 0.6s cubic-bezier(.3,1.2,.5,1) both; }
        @keyframes rt-fokus { from { opacity: 0.4; transform: scale(0.97); } to { opacity: 1; transform: none; } }
        /* Uchish — tayyor karta ixcham qatorga uchadi (SABOQ 19) */
        .rt-uch { position: fixed; z-index: 3000; max-width: 260px; padding: 4px 10px; border-radius: 999px; background: ${T.ok}; color: #fff; font-family: 'Manrope'; font-size: 12px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; animation: rt-uch 0.8s cubic-bezier(.5,0,.3,1) forwards; }
        @keyframes rt-uch { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(0.7); opacity: 0.2; } }
        /* Amaliyot bloklari */
        .rt-trek { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 6px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .rt-chorla { display: inline-flex; gap: 6px; }
        .rt-band { display: block; margin-top: 6px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .rt-band.kul { font-size: 12.5px; color: ${T.ink2}; }
        .rt-ps { display: block; margin: 2px 0; font-size: 13px; line-height: 1.5; }
        .rt-joy-n { margin-left: 6px; font-size: 12px; color: ${fon(T.ink, 0.5)}; font-style: italic; }
        .rt-ed { margin-left: auto; margin-right: 6px; width: 28px; height: 24px; padding: 0; border: 1px solid ${T.line}; border-radius: 7px; background: ${T.paper}; color: ${T.ink2}; font-size: 13px; cursor: pointer; }
        .rt-ed[aria-pressed="true"] { color: ${T.accent}; border-color: ${T.accent}; }
        .rt-prompt-ta { width: 100%; margin-top: 4px; padding: 8px 10px; border: 1.5px solid ${T.accent}; border-radius: 8px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.5; color: ${T.ink}; resize: vertical; }
        .rt-xabar { display: block; margin-top: 6px; }
        .rt-buz { margin-top: 8px; }
        .rt-buz-l { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); font-size: 11.5px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 2px 8px; pointer-events: none; white-space: nowrap; }
        .rt-buz .rt-ms-inp { padding-left: 132px; }
        .rt-yordam-btn { margin-top: 6px; }
        .rt-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px dashed ${T.line}; }
        .rt-yordam-s { display: block; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; }
        .rt-yordam-s.kul { margin-top: 4px; color: ${T.ink2}; }
        p.rt-ortda, p.rt-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        p.rt-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.bg}; }
        .rt-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 1px 6px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; }
        .rt-a1n, .rt-a2n { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .rt-a1n-tel { position: relative; display: flex; justify-content: center; }
        .rt-n-kv { position: absolute; top: 120px; right: -64px; z-index: 4; display: inline-flex; flex-direction: column; align-items: center; gap: 2px; animation: rt-n-kv 0.7s ease-out both; }
        .rt-n-kv b { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.accent}; background: ${T.paper}; border: 1px solid ${fon(T.accent, 0.45)}; border-radius: 6px; padding: 1px 6px; }
        @keyframes rt-n-kv { from { opacity: 0; transform: translateX(26px); } to { opacity: 1; transform: none; } }
        .rt-agent-j, .rt-fayllar { display: flex; flex-direction: column; gap: 4px; width: 100%; max-width: 330px; padding: 8px 10px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; line-height: 1.45; color: ${T.ink}; }
        .rt-agent-j b { font-size: 11px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.04em; }
        .rt-agent-j code, .rt-fayl code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        .rt-fayl { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px; }
        .rt-fayl em { margin-left: auto; font-style: normal; color: ${T.ok}; font-weight: 700; white-space: nowrap; }
        .rt-rd { display: flex; flex-direction: column; gap: 4px; width: 100%; max-width: 360px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .rt-rd-gh code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .rt-rd-h { font-size: 15px; font-weight: 800; color: ${T.ink}; padding-bottom: 3px; border-bottom: 1px solid ${T.line}; }
        .rt-rd-h2 { margin-top: 4px; font-size: 13px; font-weight: 800; color: ${T.ink}; animation: rt-kirdi 0.45s ease-out 0.4s both; }
        .rt-rd-j { display: flex; flex-direction: column; gap: 1px; opacity: 0.5; }
        .rt-rd-r { font-size: 10.5px; line-height: 1.35; color: ${T.ink}; }
        .rt-rd-q { font-size: 11.5px; line-height: 1.4; color: ${T.ink}; animation: rt-kirdi 0.45s ease-out 0.5s both; }
        /* Kartochkalar va yakun */
        .rt-flash { display: flex; flex-direction: column; gap: 10px; }
        .rt-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: rt-puls 1.8s ease-out .4s 3; }
        p.rt-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.rt-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .rt-yakun { display: contents; }
        .rt-yakun.belgisiz .done-chip .tick { display: none; }
        .rt-hw { display: flex; flex-direction: column; gap: 10px; }
        .rt-hw-karta { display: flex; flex-wrap: wrap; gap: 8px 16px; }
        .rt-hw-q { display: inline-flex; gap: 6px; align-items: baseline; font-size: 13px; }
        .rt-hw-q em { font-style: normal; color: ${T.ink2}; } .rt-hw-q b { color: ${T.ink}; }
        .rt-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .rt-hw-qadam li { display: flex; gap: 8px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .rt-hw-qadam li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        .rt-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        @media (max-width: 900px) {
          .rt-ts { grid-template-columns: minmax(0, 1fr); justify-items: center; }
          .rt-ts-v { width: 100%; }
        }
        @media (max-width: 400px) {
          .rt-sahna.tik.ikki { grid-template-columns: 168px 168px; column-gap: 6px; }
          .rt-sahna.tik.ikki .rt-tel-ust, .rt-sahna.tik.ikki .rt-telefon { width: 168px; }
          .rt-reja { flex-direction: column; align-items: center; }
          .rt-mini-r { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rt-halqa, .rt-k.faol .q-variant, .rt-halqa-g .q-chip, .rt-chorla > .q-chip, .rt-flash.yangi .fc-card .fc-front { animation: none !important; }
          .rt-kv, .rt-uch, .rt-n-kv { display: none !important; }
          .rt-pop, .rt-son.yangi, .rt-doiralar i.yangi, .rt-chiziq-i, .rt-chiziq-i::after, .rt-chiziq-r.aylan, .rt-belgi, .rt-belgi-n, .rt-tel-ekran, .rt-vb, .rt-vb-q, .rt-vb-h b, .rt-ms-karta, .rt-ms-q, .rt-eski, .rt-chiziq-y, .rt-kursor, .rt-rd-h2, .rt-rd-q, .rt-fokus, .rt-ms-chip { animation: none !important; transition: none !important; }
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
