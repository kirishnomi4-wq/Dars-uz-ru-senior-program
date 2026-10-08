import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 12-Modul · 10-dars (PM, 2-tur) «50 foydalanuvchiga yetdingizmi?» — kalit m10-10, 16 ekran.
// Manba-haqiqat: feedback/F-1006-12modul/10-PmUsersCheck-v3.md (GATE M 06.10.2026) + 10-FILTR.md. Kod — skelet yo'li (6-dars infrasi bilan bir), darslar mustaqil (nusxa, import emas).
// Bitta vizual — HisobotVaraq (qoralama · to'lib boradi · to'liq · tekshiruv · o'quvchi varag'i), bitta manba MENTOR_HISOBOT. Saqlaydi: pm-m10d10-hisobot (tayanch 8; 11, 12-darslar o'qiydi).
// O'qiydi: pm-m10d6-kanallar, pm-m10d7-reja, pm-m10d8-qadamlar, pm-m9d4-final, pm-m9d5-prd, pm-m9d8-platforma (yo'q bo'lsa ham ekran ishlaydi). PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QKartochka, QYakun, QVoqea, QMustaqil, QQadamlar, QXato, QIzoh, QXulosa, QPrompt } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m10d10-v1', lessonTitle: { uz: "50 foydalanuvchiga yetdingizmi?", ru: "Дошли до 50 пользователей?" } };
// 16 ekran (MD v3): kirish → reja → metrika hisoboti → 1-savol → Mentor tekshiruvi → 2-savol → Duolingo → 3-savol → zaxira reja → SQL → metrika hisobotingiz → tekshiruv va zaxira reja → yakuniy savol → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'hisobot', ru: "отчёт" }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: "bo'g'in", ru: "звено" }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'bitta ish', ru: "одно дело" }, l: 30, tp: 70, s: 12, d: 8.5 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Yangi dars — ✔ o'rni MD dagidek: s3 C · s5 A · s7 D · s12 B (yakuniy).
const INLINE_KEYS = { s3: 2, s5: 0, s7: 3, s12: 1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: "Har xil o'lchov", ru: "Разные измерения" },
    cards: [
      { ic: '1', h: { uz: 'Qadamlar har qadamda turli qurilmalarni sanaydi.', ru: "На каждом шаге считаются разные устройства." } },
      { ic: '2', h: { uz: "Asosiy harakat — hisoblarni: hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan.", ru: "Основное действие — аккаунты, которые сейчас участвуют хотя бы в одной игре или объявили игру." } },
      { ic: '3', h: { uz: 'Har xil birlikdagi sonlar bir-biridan ayirilmaydi.', ru: "Числа в разных единицах не вычитают друг из друга." }, ask: { uz: 'Bitta odam ilovani ikki telefonda ochsa, «ochdi» qadamida nechta sanaladi?', ru: "Если один человек откроет приложение на двух телефонах, сколько посчитается на шаге «открыл»?" } }
    ]
  },
  5: {
    title: { uz: "Tekshiruv halollikni ko'radi", ru: "Проверка смотрит на честность" },
    cards: [
      { ic: '1', h: { uz: 'Son qayerdan? — manba va sana bormi.', ru: "Откуда число? — есть ли источник и дата." } },
      { ic: '2', h: { uz: 'Kimlar sanalgan? — namunasiz, sinfdoshlar alohida.', ru: "Кого посчитали? — без аккаунтов-образцов, одноклассники отдельно." } },
      { ic: '3', h: { uz: 'Oldingi son bormi? — yonida, sanasi bilan.', ru: "Есть ли предыдущее число? — рядом, с датой." }, ask: { uz: '50 ga yetmagan, lekin halol hisobot qanday javob oladi?', ru: "Какой ответ получит честный отчёт, не дошедший до 50?" } }
    ]
  },
  7: {
    title: { uz: 'Qaytganlar foizi', ru: "Процент вернувшихся" },
    cards: [
      { ic: '1', h: { uz: 'Bir davrda ilovani ochganlar sanaladi.', ru: "Считают открывших приложение за период." } },
      { ic: '2', h: { uz: 'Ulardan keyingi davrda ham ochganlari sanaladi.', ru: "Из них считают открывших и в следующий период." } },
      { ic: '3', h: { uz: 'Ikkinchisi birinchisining necha foizi — shu qaytganlar foizi.', ru: "Сколько процентов второе число от первого — это и есть процент вернувшихся." }, ask: { uz: "Duolingo'dagi qo'rquv sizning mahsulotingizga kerakmi — yoki foydali eslatma?", ru: "Нужен ли вашему продукту страх, как в Duolingo, — или полезное напоминание?" } }
    ]
  },
  12: {
    title: { uz: 'Zaxira reja', ru: "Запасной план" },
    cards: [
      { ic: '1', h: { uz: "Sonlarga qarab — qaysi bo'g'inda odam kam.", ru: "По числам — в каком звене мало людей." } },
      { ic: '2', h: { uz: 'Bitta gipoteza: «Agar …, …, chunki …».', ru: "Одна гипотеза: «Если …, …, потому что …»." } },
      { ic: '3', h: { uz: 'Bir haftada bajariladigan bitta ish.', ru: "Одно дело на неделю." }, ask: { uz: 'Soxta akkaunt sonni oshirsa ham, nega yordam bermaydi?', ru: "Почему фейковый аккаунт не помогает, даже если увеличивает число?" } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="uc-tviz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — HisobotVaraq: metrika hisoboti varag'i (qoralama · to'lib boradi · to'liq · tekshiruv · o'quvchi varag'i); bitta manba MENTOR_HISOBOT + pm-m10d10-hisobot =====
// qolip-maket: hv-dalil hv-q hv-q-tah uc-manba uc-bogin uc-bogin-h uc-kam uc-javob uc-tanlov uc-bildirish uc-tahrir uc-chip uc-ochgich
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const HISOBOT_KEY = 'pm-m10d10-hisobot';
const KANAL_KEY = 'pm-m10d6-kanallar';
const REJA_KEY = 'pm-m10d7-reja';
const QADAM_KEY = 'pm-m10d8-qadamlar';
const TREK_KEY = 'pm-m9d8-platforma';
const FINAL_KEY = 'pm-m9d4-final';
const PRD_KEY = 'pm-m9d5-prd';
// «Maydon Jamoa» nomi rangi — 11-Modul tayanch 9.62 yashili (PM palitrasining ok yashilidan farqli; A to'lqindan saboq)
const MJ_RANG = '#2E9E4F';
// Duolingo nomi — o'z rangida, logotipsiz (7-Modul PmLesson21 sahnasi bilan bir rang)
const DUO_RANG = '#58CC02';
const MJ = () => <span className="uc-mj">Maydon Jamoa</span>;
const Duo = () => <span className="uc-duo">Duolingo</span>;
const bugun = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const sonmi = (s) => /^\d{1,7}$/.test(String(s == null ? '' : s).trim());
const trekOl = () => { const t = (lsO(TREK_KEY) || {}).trek; return t === 'web' || t === 'mobil' ? t : null; };
const goyaNomi = (g) => { if (!g) return ''; const v = g.goya; return typeof v === 'string' ? v.trim() : (v && typeof v === 'object' ? String(v.nom || v.t || v.uz || '').trim() : ''); };
const hisobotOl = () => lsO(HISOBOT_KEY) || {};
const hisobotYoz = (patch) => { const d = { ...hisobotOl(), ...patch, savedAt: Date.now() }; lsY(HISOBOT_KEY, d); return d; };

// --- Bitta manbalar (P-063; tayanch 1.10, 1.13 aynan) ---
const QATOR_IDLAR = ['royxat', 'asosiy', 'bosh', 'qaytgan'];
const QATOR_NOM = {
  royxat: { uz: "Ro'yxatdan o'tgan", ru: "Зарегистрировались" },
  asosiy: { uz: 'Asosiy harakatni qilgan', ru: "Сделали основное действие" },
  bosh: { uz: 'Bosh raqam', ru: "Главное число" },
  qaytgan: { uz: 'Qaytganlar foizi', ru: "Процент вернувшихся" }
};
const BIRINCHI_OLCHOV = { uz: "birinchi o'lchov", ru: "первое измерение" };
const MENTOR_HISOBOT = {
  nom: 'Maydon Jamoa',
  qatorlar: [
    { id: 'royxat', son: '38', maqsad: ' / 50', birlik: { uz: 'hisob', ru: "аккаунт" }, manba: 'Database', sana: { uz: '7 kun keyin', ru: "через 7 дней" }, izoh: { uz: '11 tasi — sinfdosh · namuna va tekshiruv akkauntlarisiz', ru: "11 из них — одноклассники · без аккаунтов-образцов и проверочных" }, oldin: { uz: 'oldin: 27 — 3 kun keyin', ru: "раньше: 27 — через 3 дня" } },
    { id: 'asosiy', son: '19', birlik: { uz: 'hisob', ru: "аккаунт" }, manba: 'Database', sana: { uz: '7 kun keyin', ru: "через 7 дней" }, izoh: { uz: "hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan", ru: "сейчас участвуют хотя бы в одной игре или объявили игру" }, oldin: { uz: 'oldin: 13 — 3 kun keyin', ru: "раньше: 13 — через 3 дня" } },
    { id: 'bosh', son: '1', birlik: { uz: "o'yin", ru: "игра" }, manba: 'Database', sana: { uz: '7 kun keyin', ru: "через 7 дней" }, izoh: { uz: "birinchi haftada to'lgan o'yinlar", ru: "заполненные игры за первую неделю" }, oldin: null },
    { id: 'qaytgan', son: '37%', birlik: { uz: 'qurilma', ru: "устройство" }, manba: 'Database', sana: { uz: '5 kun keyin', ru: "через 5 дней" }, izoh: { uz: 'birinchi 3 kunda ochgan 46 qurilmadan 17 tasi keyingi 2 kunda ham ochdi', ru: "из 46 устройств, открывших за первые 3 дня, 17 открыли и в следующие 2 дня" }, oldin: null }
  ],
  qadamlar: [
    { nom: { uz: 'ochdi', ru: "открыл" }, son: 61 },
    { nom: { uz: "ro'yxatdan o'tdi", ru: "зарегистрировался" }, son: 38 },
    { nom: { uz: "qo'shildi", ru: "присоединился" }, son: 18 },
    { nom: { uz: 'kelishini tasdiqladi', ru: "подтвердил приход" }, son: 14 }
  ],
  eslatmadanOchdi: 9,
  tuzatishdanKeyin: { ochdi: 15, royxat: 11 },
  lending: { tashrif: 74, bosish: 41 }
};
const MANBA_NOM = { Database: { uz: 'Database', ru: "Database" }, 'sanoq sahifasi': { uz: 'sanoq sahifasi', ru: "страница подсчёта" }, Umami: { uz: 'Umami', ru: "Umami" } };
const MANBALAR = ['Database', 'sanoq sahifasi', 'Umami'];
// Maydon yorlig'i «Sana» (ot — son qachon sanalgani); til-lint uni «sanamoq» buyrug'i deb o'qiydi — shuning uchun const orqali
const SANA_SOZ = 'Sana';
const SANA_Y = { uz: SANA_SOZ, ru: 'Дата' };
// Mentor tekshiruvi — uch savol (4 va 11-ekran — bitta manba, P-063)
const TEKSHIRUV_SAVOLLAR = [
  { savol: { uz: 'Son qayerdan?', ru: "Откуда число?" }, qarang: { uz: 'har son yonida manba va sana bormi?', ru: "есть ли рядом с каждым числом источник и дата?" }, qarang11: { uz: 'har son yonida manba va sana bormi?', ru: "есть ли рядом с каждым числом источник и дата?" }, dalil: ['manba', 'sana'] },
  { savol: { uz: 'Kimlar sanalgan?', ru: "Кого посчитали?" }, qarang: { uz: 'namuna va tekshiruv akkauntlari chiqarilganmi, sinfdoshlar alohida aytilganmi?', ru: "исключены ли аккаунты-образцы и проверочные, названы ли одноклассники отдельно?" }, qarang11: { uz: 'namuna va tekshiruv akkauntlari chiqarilganmi, sinfdoshlar alohida aytilganmi?', ru: "исключены ли аккаунты-образцы и проверочные, названы ли одноклассники отдельно?" }, dalil: ['izoh'] },
  { savol: { uz: 'Oldingi son bormi?', ru: "Есть ли предыдущее число?" }, qarang: { uz: "son yonida oldingi son va sanasi turibdimi — solishtirsa bo'ladimi?", ru: "стоит ли рядом с числом предыдущее число и его дата — можно ли сравнить?" }, qarang11: { uz: "1 va 2-qator yonida oldingi son va sanasi turibdimi (yoki «birinchi o'lchov» deb yozilganmi)?", ru: "стоит ли у 1-й и 2-й строки предыдущее число и его дата (или написано «первое измерение»)?" }, dalil: ['oldin'] }
];
// Bo'g'inlar (8 va 11-ekran — bitta manba)
const BOGINLAR = [
  { id: 'kanal', nom: { uz: 'Kanal', ru: "Канал" }, mentor: { matn: { uz: 'post 2 joyga yetdi: 60 kishilik guruh va sinf chati', ru: "пост дошёл до 2 мест: группа на 60 человек и чат класса" }, birlik: { uz: 'post joyi', ru: "место поста" }, sonlar: [] } },
  { id: 'lending', nom: { uz: 'Lending', ru: "Лендинг" }, mentor: { matn: { uz: "tashrif 74 · «Qo'shilmoqchiman» 41", ru: "посещения 74 · «Хочу присоединиться» 41" }, birlik: { uz: 'Umami', ru: "Umami" } } },
  { id: 'royxat', nom: { uz: "O'rnatish va ro'yxat", ru: "Установка и регистрация" }, mentor: { matn: { uz: "ochdi 61 · ro'yxatdan o'tdi 38", ru: "открыл 61 · зарегистрировался 38" }, birlik: { uz: 'qurilma', ru: "устройство" } } },
  { id: 'asosiy', nom: { uz: 'Asosiy harakat', ru: "Основное действие" }, mentor: { matn: { uz: "ro'yxatdan o'tgan 38 · asosiy harakatni qilgan 19", ru: "зарегистрировались 38 · сделали основное действие 19" }, birlik: { uz: 'hisob', ru: "аккаунт" } } }
];
const MENTOR_ZAXIRA = {
  boginda: 'kanal',
  sabab: { uz: 'Kanal: post faqat ikki joyga yetdi (60 kishilik guruh va sinf chati).', ru: "Канал: пост дошёл только до двух мест (группа на 60 человек и чат класса)." },
  gipoteza: { uz: "Agar har o'yin e'loni bilan birga havola yuborilsa, yangi odamlar keladi, chunki tashkilotchi o'z jamoasini o'zi chaqiradi.", ru: "Если с каждым объявлением об игре отправлять ссылку, придут новые люди, потому что организатор сам зовёт свою команду." },
  ish: { uz: "E'lon berilgach ilovada «Havolani ulashish» tugmasi — rejaning 3-bosqichi oldinga suriladi.", ru: "Кнопка «Поделиться ссылкой» в приложении после объявления — 3-й этап плана сдвигается вперёд." }
};
// 6-darsdagi olti bandli ro'yxat (tayanch 1.6, 9.42 f — so'zma-so'z; 6-dars bilan bir xil const)
const XAVFSIZLIK = {
  bandlar: [
    { uz: "Faqat o'zim a'zo bo'lgan joyga yuboraman.", ru: "Отправляю только туда, где состою сам." },
    { uz: "Guruhga yuborishdan oldin egasidan ruxsat so'radim.", ru: "Перед отправкой в группу спросил разрешения у владельца." },
    { uz: "Postda familiya, maktab raqami, telefon va uy manzili yo'q.", ru: "В посте нет фамилии, номера школы, телефона и домашнего адреса." },
    { uz: "Postni yuborishdan oldin ota-onamga ko'rsatdim.", ru: "Перед отправкой показал пост родителям." },
    { uz: "Bitta xabarni ko'p guruhga tashlamayman, notanish odamga shaxsiy xabar yozmayman.", ru: "Не рассылаю одно сообщение во много групп, не пишу личных сообщений незнакомым." },
    { uz: 'Soxta akkaunt va sotib olingan obunachi ishlatmayman.', ru: "Не использую фейковые аккаунты и купленных подписчиков." }
  ],
  ostQator: { uz: 'Uchrashuv taklifi kelsa — faqat kattalar bilan. Yangi akkaunt ochish shart emas.', ru: "Если предложат встретиться — только со взрослыми. Новый аккаунт открывать не нужно." }
};

// --- Varaq: qator ko'rinishi (Mentor misoli → ko'rinish modeli) ---
// q: { id, nom, son, maqsad?, birlik, manba, sana, izoh, oldin, holat: 'yalang'|'joriy'|'toliq'|'sanalmagan'|'tuzatish'|'xato', yangi }
const mentorQator = (q, holat = 'toliq', yangi) => ({
  id: q.id, nom: tr(QATOR_NOM[q.id]), son: q.son, maqsad: q.maqsad, birlik: tr(q.birlik), manba: tr(MANBA_NOM[q.manba]), sana: tr(q.sana), izoh: tr(q.izoh),
  oldin: q.oldin ? tr(q.oldin) : tr(BIRINCHI_OLCHOV), birinchi: !q.oldin, holat, yangi
});
// D — varaqdagi bosiladigan bo'lak (4-ekran dalillari); bosilmasa — oddiy span
const D = ({ qid, k, dalil, onDalil, className, children }) => {
  const h = dalil ? dalil(qid, k) : null;
  if (!onDalil) return <span className={cxx(className, h)}>{children}</span>;
  return <button type="button" className={cxx('hv-dalil', className, h)} onClick={(e) => onDalil(qid, k, e.currentTarget)}>{children}</button>;
};
const HvQator = ({ q, dalil, onDalil, onTahrir, qRef }) => {
  const Tag = q.onClick ? 'button' : 'div';
  const holatK = 'h-' + (q.holat || 'toliq');
  const kul = q.holat === 'sanalmagan';
  return (
  <Tag ref={qRef} type={q.onClick ? 'button' : undefined} onClick={q.onClick} className={cxx('hv-q', holatK, q.yangi && 'yangi', q.onClick && 'bos')}>
    <span className="hv-q-nom">{q.nom}</span>
    <span className="hv-q-son">
      {q.holat === 'sanalmagan'
        ? <i className="hv-sanalmagan">{tr({ uz: 'sanalmagan', ru: "не посчитано" })}</i>
        : <><D qid={q.id} k="son" dalil={dalil} onDalil={onDalil} className="hv-son">{q.son || '—'}</D>{q.maqsad && <D qid={q.id} k="maqsad" dalil={dalil} onDalil={onDalil} className="hv-maqsad">{q.maqsad}</D>}</>}
      {q.birlik && q.holat !== 'sanalmagan' && <i className="hv-birlik">{q.birlik}</i>}
    </span>
    <span className="hv-q-yor">
      {q.manba && q.holat !== 'yalang' ? <D qid={q.id} k="manba" dalil={dalil} onDalil={onDalil} className="hv-yor">{q.manba}</D> : <i className={cxx('hv-joy', kul && 'kul')} />}
      {q.sana && q.holat !== 'yalang' ? <D qid={q.id} k="sana" dalil={dalil} onDalil={onDalil} className="hv-yor">{q.sana}</D> : <i className={cxx('hv-joy', kul && 'kul')} />}
    </span>
    {q.holat !== 'yalang' && q.izoh && <D qid={q.id} k="izoh" dalil={dalil} onDalil={onDalil} className="hv-izoh">{q.izoh}</D>}
    {q.holat !== 'yalang' && q.oldin && <D qid={q.id} k="oldin" dalil={dalil} onDalil={onDalil} className="hv-oldin">{q.oldin}</D>}
    {q.tuzatish && <span className="hv-tuz"><i />{q.tuzatish}</span>}
    {onTahrir && <button type="button" className="hv-q-tah" onClick={onTahrir} aria-label={tr({ uz: 'Tahrirlash', ru: "Редактировать" })}>✎</button>}
  </Tag>
  );
};
// Pastki ingichka qator: { k, sar, matn, birlik, ajrat?, izoh?, yangi }
const HvPast = ({ p }) => (
  <div className={cxx('hv-past', p.yangi && 'yangi')}>
    <span className="hv-past-s">{p.sar}</span>
    <span className="hv-past-m">{p.matn}{p.birlik && <i className="hv-birlik">{p.birlik}</i>}</span>
    {p.ajrat && <span className="hv-past-a">{p.ajrat}</span>}
    {p.izoh && <span className="hv-past-iz">{p.izoh}</span>}
  </div>
);
const HisobotVaraq = ({ nom, nomKulrang, atama, qatorlar = [], pastki = [], muhr, muhrJoy, muhrOst, dalil, onDalil, onTahrir, qRefs, vRef, zaxira, ost, className }) => (
  <div ref={vRef} className={cxx('hv', className)}>
    <div className="hv-bosh">
      <span className="hv-bosh-l">
        <span className={cxx('hv-nom', nomKulrang && 'kul')}>{nom || <MJ />}</span>
        {atama && <span className="hv-atama">{atama}</span>}
      </span>
      {(muhr || muhrJoy) && <span key={muhr ? muhr.tur + muhr.matn : 'joy'} className={cxx('hv-muhr', muhr ? 'bor ' + muhr.tur : 'joy')}>{muhr ? muhr.matn : ''}</span>}
    </div>
    {muhr && muhrOst && <span className="hv-muhr-ost">{muhrOst}</span>}
    <div className="hv-qatorlar">
      {qatorlar.map((q, i) => <HvQator key={q.id} q={q} dalil={dalil} onDalil={onDalil} onTahrir={onTahrir ? () => onTahrir(q.id) : undefined} qRef={qRefs ? (el) => { qRefs[q.id] = el; } : undefined} />)}
    </div>
    {pastki.length > 0 && <div className="hv-pastki">{pastki.map(p => <HvPast key={p.k} p={p} />)}</div>}
    {zaxira}
    {ost}
  </div>
);
const mentorPastki = (n = 2) => [
  { k: 'qadam', sar: tr({ uz: 'Qadamlar · sanoq sahifasi · 7 kun keyin', ru: "Шаги · страница подсчёта · через 7 дней" }),
    matn: MENTOR_HISOBOT.qadamlar.map(q => `${tr(q.nom)} ${q.son}`).join(' · '), birlik: tr({ uz: 'qurilma', ru: "устройство" }),
    ajrat: tr({ uz: `eslatmadan ochdi ${MENTOR_HISOBOT.eslatmadanOchdi} — qadam emas: eslatma bosilib ilova ochilgan qurilmalar`, ru: `открыл из напоминания ${MENTOR_HISOBOT.eslatmadanOchdi} — не шаг: устройства, на которых приложение открыли нажатием на напоминание` }) },
  { k: 'lending', sar: tr({ uz: 'Lending · Umami · 7 kun keyin', ru: "Лендинг · Umami · через 7 дней" }),
    matn: tr({ uz: `tashriflar ${MENTOR_HISOBOT.lending.tashrif} · «Qo'shilmoqchiman» ${MENTOR_HISOBOT.lending.bosish}`, ru: `посещения ${MENTOR_HISOBOT.lending.tashrif} · «Хочу присоединиться» ${MENTOR_HISOBOT.lending.bosish}` }),
    birlik: tr({ uz: 'tashrif · bosish', ru: "посещение · нажатие" }), izoh: tr({ uz: 'ilova sonlaridan ayirilmaydi', ru: "не вычитается из чисел приложения" }) }
].slice(0, n);
// Mentor hisoboti to'liq (2-ekran oxiri; 3, 6-ekran, Mentor rejimi)
const MentorVaraq = ({ muhr, className, atama = true }) => (
  <HisobotVaraq className={className} atama={atama ? tr({ uz: 'metrika hisoboti', ru: "отчёт по метрикам" }) : null}
    qatorlar={MENTOR_HISOBOT.qatorlar.map(q => mentorQator(q))} pastki={mentorPastki()}
    muhr={muhr ? { tur: 'qabul', matn: tr({ uz: 'Qabul', ru: "Принять" }) } : null} />
);

// --- Telefon (11-Modul ko'rinishi, ≈170×272 — SABOQ 22): «Maydon Jamoa» o'z rangida, logotipsiz ---
const Doiralar = ({ bor, kerak }) => <span className="uc-doiralar" aria-hidden="true">{Array.from({ length: kerak }, (_, i) => <i key={i} className={cxx(i < bor && 'bor')} />)}</span>;
const JamoaTelefon = ({ ulashish, className }) => (
  <div className={cxx('uc-tel', className)} aria-hidden="true">
    <span className="uc-tel-bar"><b className="uc-mj">Maydon Jamoa</b></span>
    {ulashish ? (
      <span className="uc-tel-ekran">
        <span className="uc-tel-orqa">‹ {tr({ uz: "O'yin", ru: "Игра" })}</span>
        <span className="uc-tel-karta"><b>{tr({ uz: 'Shanba', ru: "Суббота" })}, 18:00</b><span>{tr({ uz: 'Mahalla maydoni', ru: "Поле махалли" })}</span><b className="uc-tel-son">8 / 10</b><Doiralar bor={8} kerak={10} /></span>
        <span className="uc-tel-tug">{tr({ uz: "Qo'shilaman", ru: "Присоединяюсь" })}</span>
        <span className="uc-tel-tug uc-ulash">{tr({ uz: 'Havolani ulashish', ru: "Поделиться ссылкой" })}</span>
      </span>
    ) : (
      <span className="uc-tel-ekran">
        <b className="uc-tel-sar">{tr({ uz: "O'yinlar", ru: "Игры" })}</b>
        <span className="uc-tel-kun">{tr({ uz: 'Shanba', ru: "Суббота" })}</span>
        <span className="uc-tel-karta"><b>{tr({ uz: 'Shanba', ru: "Суббота" })}, 18:00</b><span>{tr({ uz: 'Mahalla maydoni', ru: "Поле махалли" })}</span><b className="uc-tel-son">8 / 10</b><Doiralar bor={8} kerak={10} /></span>
      </span>
    )}
  </div>
);

// --- Umumiy yordamchilar (har dars mustaqil — nusxa) ---
const Sanagich = ({ dan = 0, gacha }) => {
  const [n, setN] = useState(kamHarakat() ? gacha : dan);
  useEffect(() => {
    if (kamHarakat() || dan === gacha) { setN(gacha); return undefined; }
    let raf = 0; const t0 = performance.now();
    const qadam = (t) => { const p = Math.min(1, (t - t0) / 1100); setN(Math.round(dan + (gacha - dan) * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(qadam); };
    raf = requestAnimationFrame(qadam);
    return () => cancelAnimationFrame(raf);
  }, [dan, gacha]);
  return <>{n}</>;
};
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
    ? createPortal(uchlar.map(z => <span key={z.k} className="uc-uch" style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
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
// Taxmin natijasi — yashil xulosaning birinchi kichik qatori (E 42): tanlangan javob qaytarilmaydi
const TaxminQ = ({ togri, haqiqat }) => (
  <span className={cxx('uc-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: "Ваше предположение оказалось верным" })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: "на деле" })}: <b>{haqiqat}</b></>}</span>
);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="uc-x-m">{matn}</span>{izoh && <span className="uc-x-iz">{izoh}</span>}</>;
const BashoratQ = ({ savol, javob }) => <div className="uc-bashq fade-step"><span>{savol}</span><span className="uc-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;
const Yorliq = ({ children }) => <span className="uc-atama-y fade-step">{children}</span>;

// ===== SCREEN 0 — KIRISH (QKirish; ballsiz — J-026: correct false hammaga; «Aynan!» / «Qiziq fikr!») =====
const HOOK_OPTS = [
  { id: 'kop', label: { uz: "«Ko'p — har kuni yangi odam qo'shilyapti»", ru: "«Много — каждый день добавляется новый человек»" } },
  { id: 'son', label: { uz: "«38 kishi — bugun Database'dan sanadim»", ru: "«38 человек — сегодня посчитал по Database»" } },
  { id: 'chat', label: { uz: "«Deyarli 50 — chatda hamma yozyapti»", ru: "«Почти 50 — в чате все пишут»" } }
];
const HOOK_JAVOB = {
  son: { uz: <><b>Aynan!</b> Bu javobda son bor — u qayerdan olingani va qachon sanalgani ham aytilgan.</>, ru: <><b>Именно!</b> В этом ответе есть число — и сказано, откуда оно взято и когда посчитано.</> },
  kop: { uz: <><b>Qiziq fikr!</b> Har kuni odam kelishi — yaxshi belgi. Lekin «ko'p» — nechta ekani bilinmaydi.</>, ru: <><b>Интересная мысль!</b> Что люди приходят каждый день — хороший знак. Но «много» — неизвестно, сколько.</> },
  chat: { uz: <><b>Qiziq fikr!</b> Chatda yozganlar ilovada ro'yxatdan o'tganmi — bu javobdan bilinmaydi.</>, ru: <><b>Интересная мысль!</b> Зарегистрировались ли в приложении те, кто пишет в чате, — из этого ответа не понять.</> }
};
// Kichik varaq (0-ekran): katta «38» va qator nomlari bilan uch qator — manba va sana yo'q (2-ekran kashfiyoti; SABOQ 33 — bo'sh chiziq o'rnida qator nomlari)
const MiniVaraq = () => (
  <div className="uc-mini fade-step">
    <span className="uc-mini-nom"><MJ /></span>
    <b className="uc-mini-38">38</b>
    {MENTOR_HISOBOT.qatorlar.slice(1).map((q, i) => <span key={q.id} className="uc-mini-q" style={{ '--i': i }}><span>{tr(QATOR_NOM[q.id])}</span><b>{q.son}</b></span>)}
  </div>
);
// Jonli dars: hook ovozlari chizig'i (sof so'rovnoma, J-026; MD 0-ekran «sinf ovozlari chizig'i», F-1006-389; 11-Modul naqshi)
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
    <div className="ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={`ovoz-q${mening === i ? ' men' : ''}`}><span>{v}</span><span className="ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>)}
    </div>
  );
};
const HookMaket = ({ tanlov }) => (
  <div className="uc-hook">
    <span className="uc-pufak uc-pufak-s">{tr({ uz: 'Nechta foydalanuvchi bor?', ru: "Сколько пользователей?" })}</span>
    {tanlov && <span key={tanlov} className="uc-pufak uc-pufak-j">{tr(HOOK_OPTS.find(o => o.id === tanlov).label)}</span>}
    <div className="uc-hook-q">
      <JamoaTelefon />
      {tanlov && <MiniVaraq />}
    </div>
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', HOOK_OPTS.findIndex(o => o.id === v), false, 0);
  };
  const qolgan = picked !== null ? HOOK_OPTS.filter(o => o.id !== picked) : [];
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: "Выберите один вариант" }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('uc-s0', picked === null ? 'kutish' : 'tanlangan')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>50 foydalanuvchiga <A>yetdingizmi?</A></>, ru: <>Дошли <A>до 50 пользователей?</A></> })}
          mentor={<Mentor>{tr({ uz: "Mentor misolida ilova odamlarga chiqqaniga bir hafta bo'ldi: «Nechta foydalanuvchi bor?» deb so'rashsa, qaysi javobga ishonasiz?", ru: "В примере Ментора приложение вышло к людям неделю назад: если спросят «Сколько пользователей?», какому ответу вы поверите?" })}</Mentor>}
          maket={<HookMaket tanlov={picked} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={<>
            {picked !== null && <span className="uc-qolgan fade-step">{qolgan.map(o => tr(o.label)).join(' · ')}</span>}
            {picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
            {isLive && (picked !== null || live.mode === 'mentor') && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.label))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual — varaq: to'rt qator nomi navbat bilan yoziladi, muhr joyi bo'sh; manba va sana ko'rsatilmaydi — 2-ekran bashorati, P-036/SABOQ 33) =====
const REJA = [
  { t: { uz: "Hisobotga sonni qanday yozishni bilib olasiz", ru: "Узнаете, как записывать число в отчёт" }, teg: { uz: 'hisobot', ru: "отчёт" } },
  { t: { uz: 'Sonlarni uch savol bilan tekshirasiz', ru: "Проверите числа тремя вопросами" }, teg: { uz: 'tekshiruv', ru: "проверка" } },
  { t: { uz: <><Duo /> odamlarni nima bilan qaytarishini ko'rasiz</>, ru: <>Увидите, чем <Duo /> возвращает людей</> }, teg: { uz: 'voqea', ru: "история" } },
  { t: { uz: "O'z sonlaringizni Database'dan olib, reja yozasiz", ru: "Возьмёте свои числа из Database и напишете план" }, teg: 'SQL' }
];
const RejaVaraq = () => (
  <div className="uc-reja">
    <div className="hv uc-reja-v">
      <div className="hv-bosh"><span className="hv-bosh-l"><span className="hv-nom"><MJ /></span></span><span className="hv-muhr joy uc-rj" style={{ '--d': '1.9s' }} /></div>
      <div className="hv-qatorlar">
        {QATOR_IDLAR.map((id, i) => <div key={id} className="uc-rj uc-reja-q" style={{ '--d': (i * 0.4) + 's' }}><span>{tr(QATOR_NOM[id])}</span></div>)}
      </div>
      <div className="uc-rj uc-reja-p" style={{ '--d': '1.6s' }}>{tr({ uz: 'Qadamlar · Lending', ru: "Шаги · Лендинг" })}</div>
    </div>
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: "Начинаем" })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun sonlaringizni hisobotga yig'ib, <A>tekshirasiz.</A></>, ru: <>Сегодня соберёте свои числа в отчёт и <A>проверите.</A></> })}
      mentor={<Mentor>{tr({ uz: "Ishga tushirish kunidan beri Database'da sonlar yig'ildi. Bugun ularni bitta sahifaga yozib, Mentor tekshiruvidan o'tkazasiz.", ru: "Со дня запуска в Database накопились числа. Сегодня запишете их на одну страницу и пройдёте проверку Ментора." })}</Mentor>}
      chapYorliq={<>{tr({ uz: 'Dars oxirida: metrika hisoboti va zaxira reja', ru: "В конце: отчёт по метрикам и запасной план" })} <code className="uc-teg">{tr({ uz: 'Mentor tekshiruvi', ru: "Проверка Ментора" })}</code></>}
      chap={<RejaVaraq />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — METRIKA HISOBOTI (QTushuncha markaziy: bashorat → 4 qator ketma-ket → pastki qatorlar o'zi; atama — misoldan keyin) =====
const S2_TAXMIN = [
  { k: 'son', t: { uz: "Faqat sonning o'zi", ru: "Только само число" } },
  { k: 'manba', t: { uz: 'Son va manbasi', ru: "Число и источник" } },
  { k: 'hammasi', ok: true, t: { uz: 'Son, manbasi va sanasi', ru: "Число, источник и дата" } }
];
const S2_SAVOL = { uz: 'Mentor «38» ni hisobotga qanday yozadi?', ru: "Как Ментор запишет «38» в отчёт?" };
// Uch manba maketi (chizilgan, logotipsiz): Neon · Database · sanoq sahifasi · Umami
const ManbaMaket = ({ id, yonik, mRef, children }) => (
  <div ref={mRef} className={cxx('uc-manba', yonik && 'yonik')}>{children}</div>
);
const ManbaMaketlar = ({ yonik, mRefs }) => (
  <div className="uc-manbalar">
    <ManbaMaket id="db" yonik={yonik === 'db'} mRef={(el) => { mRefs.db = el; }}>
      <span className="uc-manba-h"><b>Neon</b> · Database</span>
      <span className="uc-jadval" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span>
      <code className="uc-manba-k">oyinchilar</code>
    </ManbaMaket>
    <ManbaMaket id="sanoq" yonik={yonik === 'sanoq'} mRef={(el) => { mRefs.sanoq = el; }}>
      <span className="uc-brauzer"><i /><i /><i /><code>lending/sanoq.html</code></span>
      <span className="uc-manba-h">{tr({ uz: 'sanoq sahifasi', ru: "страница подсчёта" })}</span>
      <span className="uc-kulrang">{tr({ uz: 'kalit bilan', ru: "с ключом" })}</span>
    </ManbaMaket>
    <ManbaMaket id="umami" yonik={yonik === 'umami'} mRef={(el) => { mRefs.umami = el; }}>
      <span className="uc-manba-h"><b>Umami</b></span>
      <span className="uc-umami-r"><span>{tr({ uz: 'Tashriflar', ru: "Посещения" })}</span><b>{yonik === 'umami' || yonik === 'hammasi' ? <Sanagich gacha={MENTOR_HISOBOT.lending.tashrif} /> : '—'}</b></span>
      <span className="uc-umami-r"><span>{tr({ uz: "«Qo'shilmoqchiman»", ru: "«Хочу присоединиться»" })}</span><b>{yonik === 'umami' || yonik === 'hammasi' ? <Sanagich gacha={MENTOR_HISOBOT.lending.bosish} /> : '—'}</b></span>
    </ManbaMaket>
  </div>
);
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qi, setQi] = useState(avval ? 4 : 0);
  const [past, setPast] = useState(avval ? 2 : 0);
  const [yonik, setYonik] = useState(null);
  const [yangiQ, setYangiQ] = useYangi();
  const [uch, qatlam] = useUchish();
  const mRefs = useRef({}).current, qRefs = useRef({}).current;
  const done = qi >= 4 && past >= 2;
  const tugadi = useTugadi(done, 1300, avval);
  const ipucha = useIpucha(!!taxmin && qi < 4, qi);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  // 4/4 dan so'ng (o'zi, navbat bilan): sanoq sahifasi → qadamlar qatori · Umami → lending qatori
  useEffect(() => {
    if (qi < 4 || past >= 2) return undefined;
    const t1 = setTimeout(() => setYonik(past === 0 ? 'sanoq' : 'umami'), 500);
    const t2 = setTimeout(() => { setPast(p => p + 1); }, kamHarakat() ? 600 : 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [qi, past]);
  useEffect(() => { if (done) setYonik(null); }, [done]);
  const bos = (id) => {
    if (!taxmin || qi >= 4 || QATOR_IDLAR[qi] !== id) return;
    setYonik('db');
    uch(mRefs.db, qRefs[id], 'Database');
    setYangiQ(id);
    setQi(qi + 1);
  };
  const qatorlar = MENTOR_HISOBOT.qatorlar.map((q, i) => {
    if (i < qi) return mentorQator(q, 'toliq', yangiQ === q.id);
    const joriy = i === qi && !!taxmin;
    return { id: q.id, nom: tr(QATOR_NOM[q.id]), son: q.son, holat: joriy ? 'joriy' : 'yalang', onClick: joriy ? () => bos(q.id) : undefined };
  });
  const tx = S2_TAXMIN.find(x => x.k === taxmin);
  const varaq = (
    <div className="uc-v-bos">
      <HisobotVaraq qRefs={qRefs} atama={done ? tr({ uz: 'metrika hisoboti', ru: "отчёт по метрикам" }) : null}
        qatorlar={qatorlar}
        pastki={mentorPastki(past).map((p, i) => ({ ...p, yangi: !done && i === past - 1 }))} />
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · hisobot', ru: "Понятие · отчёт" })} screen={screen} scrollSignal={qi * 10 + past} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Qatorlarni bosing', ru: "Нажимайте строки" })} (${qi}/4)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Songa ishonish uchun yonida <A>nima turadi?</A></>, ru: <>Что стоит рядом с числом, <A>чтобы ему поверить?</A></> })}
        mentor={<Mentor>{tr({ uz: 'Mentor hisobotidagi qatorlarni tepadan pastga birma-bir bosing.', ru: "Нажимайте строки отчёта Ментора по одной сверху вниз." })}</Mentor>}
        bashorat={!taxmin
          ? <div className="uc-chorla-b"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !done && <BashoratQ savol={tr(S2_SAVOL)} javob={tr(tx.t)} />}
        harakat={!tugadi && taxmin && <>
          <QQadamlar qadamlar={QATOR_IDLAR.map(id => tr(QATOR_NOM[id]))} joriy={qi < 4 ? qi : undefined} />
          {ipucha && <p className="uc-ipucha fade-step">{tr({ uz: "Varaqdagi yoqilgan qatorni bosing — chap tomonda nima yonishini ko'ring.", ru: "Нажмите подсвеченную строку отчёта — посмотрите, что загорится слева." })}</p>}
        </>}
        harakatAvval
        vizual={tugadi
          ? <div className="uc-fokus">{varaq}</div>
          : <div className="uc-split"><ManbaMaketlar yonik={yonik} mRefs={mRefs} />{varaq}</div>}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: 'son, manbasi va sanasi', ru: "число, источник и дата" })} />}
          matn={tr({ uz: "Bu misolda har son yonida manba va sana bor: kim ko'rsa, qayerdan olinganini tekshira oladi.", ru: "В этом примере рядом с каждым числом есть источник и дата: любой может проверить, откуда оно взято." })}
          izoh={tr({ uz: "Bizda to'rt son, har birining manbasi va sanasi bilan — metrika hisoboti deyiladi.", ru: "У нас четыре числа, каждое с источником и датой, — это называется отчётом по метрикам." })} />}
      />
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ C, INLINE_KEYS.s3 = 2; savol ustida yorliq yo'q — SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · o'lchov", ru: "Проверка · измерение" })}
    questionText="Mentor hisobotida: qadam «qo'shildi» — 18, asosiy harakatni qilgan — 19. Qaysi gap to'g'ri?"
    question={tr({ uz: <h2 className="title h-ask">Mentor hisobotida: qadam «qo'shildi» — 18, asosiy harakatni qilgan — 19. <A>Qaysi gap to'g'ri?</A></h2>, ru: <h2 className="title h-ask">В отчёте Ментора: шаг «присоединился» — 18, сделали основное действие — 19. <A>Какое утверждение верно?</A></h2> })}
    options={[
      { uz: 'Bittasi xato: hisob va qadam teng chiqishi kerak', ru: "Одно число ошибочно: аккаунты и шаг должны совпасть" },
      { uz: '19 dan 18 ni ayirsak, bitta odam ortiqcha chiqadi', ru: "Если из 19 вычесть 18, выйдет один лишний человек" },
      { uz: 'Ikkalasi boshqa narsani sanaydi: qurilma va hisob', ru: "Они считают разное: устройства и аккаунты" },
      { uz: "18 to'g'riroq: qurilmalar sanog'i aniqroq bo'ladi", ru: "18 вернее: подсчёт устройств точнее" }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Qadamlar qurilmani, asosiy harakat esa hisobni sanaydi.', ru: "Шаги считают устройства, а основное действие — аккаунты." }}
    explainWrong={{
      0: { uz: 'Teng chiqishi mumkin, lekin shartmi? Birligiga qarang.', ru: "Могут совпасть, но обязаны ли? Посмотрите на единицу." },
      1: { uz: 'Ayirish uchun ikkalasi bir narsani sanaydimi?', ru: "Можно ли вычитать — считают ли оба одно и то же?" },
      3: { uz: "Ikkala son ham Database'dan — qaysi biri nimani sanaydi?", ru: "Оба числа из Database — какое что считает?" },
      default: { uz: 'Har son yonidagi birlik yorlig\'iga qarang.', ru: "Посмотрите на метку единицы рядом с каждым числом." }
    }}
    vizual={<div className="uc-tviz-q uc-birliklar">
      <span className="uc-birlik-q"><span>{tr({ uz: "qo'shildi", ru: "присоединился" })} <b>18</b></span><i className="hv-birlik ajrat">{tr({ uz: 'qurilma', ru: "устройство" })}</i></span>
      <span className="uc-birlik-q"><span>{tr({ uz: 'asosiy harakatni qilgan', ru: "сделали основное действие" })} <b>19</b></span><i className="hv-birlik ajrat">{tr({ uz: 'hisob', ru: "аккаунт" })}</i></span>
    </div>} />
);


// ===== SCREEN 4 — MENTOR TEKSHIRUVI (QTushuncha: bashorat → 3 savol ketma-ket, dalil varaqdan bosib topiladi; muhr «Qabul») · nishon evidenceFinder =====
const S4_TAXMIN = [
  { k: 'tuzatish', t: { uz: 'Tuzatish: 50 ga yetmagan', ru: "Исправить: не дошли до 50" } },
  { k: 'bitta', t: { uz: 'Bitta tuzatishdan keyin qabul', ru: "Принять после одного исправления" } },
  { k: 'qabul', ok: true, t: { uz: 'Qabul', ru: "Принять" } }
];
const S4_SAVOL = { uz: '38 / 50 — Mentor tekshiruvi javobi qanday bo\'ladi?', ru: "38 / 50 — каким будет ответ проверки Ментора?" };
const S4_XATO = {
  son: { uz: 'Bu sonning o\'zi — u qayerdan olingani qayerda yozilgan?', ru: "Это само число — где написано, откуда оно взято?" },
  maqsad: { uz: 'Bu maqsad — u kimlar sanalganini aytmaydi.', ru: "Это цель — она не говорит, кого посчитали." },
  oldin: { uz: 'Oldingi son qayerda? Kulrang qatorlarga qarang.', ru: "Где предыдущее число? Посмотрите на серые строки." },
  umumiy: { uz: 'Nimaga qarang qatorini qayta o\'qing.', ru: "Перечитайте строку «На что смотреть»." }
};
const s4Togri = (si, qid, k) => (si === 0 ? (k === 'manba' || k === 'sana') : si === 1 ? (qid === 'royxat' && k === 'izoh') : k === 'oldin');
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [si, setSi] = useState(avval ? 3 : 0);
  const [topildi, setTopildi] = useState(avval ? 3 : 0);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(null);
  const [xatoSoni, setXatoSoni] = useState(0);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null);
  useEffect(() => { if (!silk) return undefined; const t = setTimeout(() => setSilk(null), 480); return () => clearTimeout(t); }, [silk]);
  const done = si >= 3;
  const tugadi = useTugadi(done, 1500, avval);
  const ipucha = useIpucha(!!taxmin && !done, si);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: xatoSoni === 0, picked: true, taxmin, xatoSoni }); }, [done]); // eslint-disable-line
  // Topilgan dalil → ✓ «Ha», keyingi savol kartasi kiradi
  useEffect(() => {
    if (topildi <= si || done) return undefined;
    const t = setTimeout(() => setSi(topildi), kamHarakat() ? 200 : 900);
    return () => clearTimeout(t);
  }, [topildi, si, done]);
  const onDalil = (qid, k, el) => {
    if (!taxmin || done || topildi > si) return;
    if (s4Togri(si, qid, k)) {
      uch(el, kartaRef.current, '✓');
      setXato(null); setSilk(null); setTopildi(si + 1);
      return;
    }
    const x = si === 0 && k === 'son' ? 'son' : si === 1 && k === 'maqsad' ? 'maqsad' : si === 2 ? 'oldin' : 'umumiy';
    setXato(x); setSilk(qid + '|' + k + '|' + Date.now()); setXatoSoni(n => n + 1);
  };
  const dalil = (qid, k) => {
    const yashil = (topildi >= 1 && (k === 'manba' || k === 'sana')) || (topildi >= 2 && qid === 'royxat' && k === 'izoh') || (topildi >= 3 && k === 'oldin');
    if (yashil) return 'ok';
    if (silk && silk.startsWith(qid + '|' + k + '|')) return 'silk';
    if (taxmin && !done && topildi === si && TEKSHIRUV_SAVOLLAR[si].dalil.includes(k) && (si !== 1 || qid === 'royxat')) return 'halqa';
    return null;
  };
  const tx = S4_TAXMIN.find(x => x.k === taxmin);
  const varaq = (
    <div className="uc-v-ust">
      <HisobotVaraq atama={tr({ uz: 'metrika hisoboti', ru: "отчёт по метрикам" })}
        qatorlar={MENTOR_HISOBOT.qatorlar.map(q => mentorQator(q))} pastki={mentorPastki()}
        dalil={dalil} onDalil={taxmin && !done ? onDalil : undefined}
        muhrJoy muhr={done ? { tur: 'qabul', matn: tr({ uz: 'Qabul', ru: "Принять" }) } : null}
        muhrOst={tr({ uz: 'Qabul — bugungi tekshiruv natijasi: sonlar keyin yangilanadi.', ru: "Ответ «принять» — итог сегодняшней проверки: числа потом обновятся." })}
        ost={done && <Yorliq>{tr({ uz: 'Mentor tekshiruvi', ru: "Проверка Ментора" })}</Yorliq>} />
    </div>
  );
  const S = TEKSHIRUV_SAVOLLAR[Math.min(si, 2)];
  const karta = !done && taxmin && (
    <div key={si} ref={kartaRef} className={cxx('uc-karta', 'uc-kirish', xato && 'err')}>
      <span className="q-yorliq">{tr({ uz: 'Mentor tekshiruvi', ru: "Проверка Ментора" })} · {si + 1} / 3</span>
      <b className="uc-karta-nom">{tr(S.savol)}</b>
      <p className="uc-qarang"><span>{tr({ uz: 'Nimaga qarang', ru: "На что смотреть" })}:</span> {tr(S.qarang)}</p>
      {topildi > si
        ? <span className="uc-ha fade-step">✓ {tr({ uz: 'Ha', ru: "Да" })}</span>
        : <span className="uc-kulrang">{tr({ uz: 'Varaqdan bosib toping', ru: "Найдите на отчёте" })}</span>}
      {xato && <QXato>{tr(S4_XATO[xato])}</QXato>}
      {ipucha && <p className="uc-ipucha fade-step">{tr({ uz: "O'ngdagi savolni o'qing va javobini chapdagi varaqdan bosing.", ru: "Прочитайте вопрос справа и нажмите ответ на отчёте слева." })}</p>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Mentor tekshiruvi', ru: "Понятие · проверка Ментора" })} screen={screen} scrollSignal={si * 10 + topildi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Savollarni bering', ru: "Задайте вопросы" })} (${topildi}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Hisobotni qaysi savollar bilan <A>tekshirasiz?</A></>, ru: <>Какими вопросами <A>проверить отчёт?</A></> })}
        mentor={<Mentor>{tr({ uz: 'Har savolning javobini Mentor hisobotidan bosib toping.', ru: "Найдите ответ на каждый вопрос, нажав на отчёт Ментора." })}</Mentor>}
        bashorat={!taxmin
          ? <div className="uc-chorla-b"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !done && <BashoratQ savol={tr(S4_SAVOL)} javob={tr(tx.t)} />}
        harakat={!tugadi && taxmin && <QQadamlar qadamlar={TEKSHIRUV_SAVOLLAR.map(q => tr(q.savol))} joriy={done ? undefined : si} />}
        harakatAvval
        vizual={tugadi
          ? <div className="uc-fokus">{varaq}</div>
          : <div className="uc-split uc-split-v">{varaq}{karta || <span />}</div>}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: 'qabul', ru: "принять" })} />}
          matn={tr({ uz: 'Bu misolda 38 / 50 — qabul: tekshiruv sonning halolligini ko\'radi, kattaligini emas.', ru: "В этом примере 38 / 50 — «принять»: проверка смотрит на честность числа, а не на его величину." })}
          izoh={tr({ uz: '11-Modulda PRD ni shunday tekshirgansiz — bugungi uch savol sonlar uchun. Javob — qabul yoki tuzatish.', ru: "В 11-м модуле вы так проверяли PRD — сегодня три вопроса для чисел. Ответ — «принять» или «исправить»." })} />}
      />
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; ✔ A, INLINE_KEYS.s5 = 0; ikkinchi misol — boshqa hisobot, P-002) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · Mentor tekshiruvi', ru: "Проверка · проверка Ментора" })}
    questionText="Bir hisobotda 31 / 50, uch savolga ham «ha». Mentor tekshiruvi nima deydi?"
    question={tr({ uz: <h2 className="title h-ask">Bir hisobotda 31 / 50, uch savolga ham «ha». <A>Mentor tekshiruvi nima deydi?</A></h2>, ru: <h2 className="title h-ask">В одном отчёте 31 / 50, на все три вопроса «да». <A>Что скажет проверка Ментора?</A></h2> })}
    options={[
      { uz: 'Qabul, chunki son halol sanalgan', ru: "Принять, потому что число посчитано честно" },
      { uz: 'Tuzatish, chunki 50 ga yetmagan', ru: "Исправить, потому что не дошли до 50" },
      { uz: 'Qabul, chunki 50 ga yaqin qolgan', ru: "Принять, потому что близко к 50" },
      { uz: 'Tuzatish, chunki son juda kichik', ru: "Исправить, потому что число слишком маленькое" }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Uch savolga «ha» — son halol: 50 ga yetmagani tuzatish emas.', ru: "На три вопроса «да» — число честное: то, что не дошли до 50, — не повод исправлять." }}
    explainWrong={{
      1: { uz: 'Tekshiruv sonning kattaligiga qaraydimi?', ru: "Смотрит ли проверка на величину числа?" },
      2: { uz: '«Yaqinlik» uch savolning biri edimi?', ru: "«Близость» была одним из трёх вопросов?" },
      3: { uz: 'Kichik son ham halol bo\'lishi mumkin — savollarni eslang.', ru: "Маленькое число тоже может быть честным — вспомните вопросы." },
      default: { uz: 'Uch savol nimaga qaraydi — shuni eslang.', ru: "Вспомните, на что смотрят три вопроса." }
    }}
    vizual={<div className="uc-tviz-q"><div className="uc-kv"><b>31 / 50</b><span className="hv-muhr bor qabul mini">{tr({ uz: 'Qabul', ru: "Принять" })}</span></div></div>} />
);

// ===== SCREEN 6 — DUOLINGO (QVoqea, PM keys K5 — faqat bank matni; SABOQ 2, 3, 8, 26). Manba: PM_Prompt_v8.md K5 (193-qator) · tayanch 5 · src/5-Modull/PmLesson21.jsx (7-Modul shakli) =====
// Sahna: telefon, tepada «Duolingo» o'z rangida; olov belgisi raqamsiz; eslatma matni, son va «muzlatish» qanday ishlashi chizilmaydi (bankda yo'q).
const K5_KADR = [
  { h: { uz: 'Ketma-ket kunlar', ru: "Дни подряд" }, m: { uz: "7-Modulda ko'rgansiz: olov belgisi ketma-ket dars qilingan kunlarni sanaydi. Bu voqeada asosiy qaytarish mexanikasi — shu ketma-ket kunlar.", ru: "Вы видели это в 7-м модуле: иконка огня считает дни занятий подряд. В этой истории основная механика возвращения — эти дни подряд." } },
  { h: { uz: 'Seriya, eslatma, «muzlatish»', ru: "Серия, напоминание, «заморозка»" }, m: { uz: "Seriyani yo'qotib qo'yish qo'rquvi odamlarni har kuni qaytaradi. Uning atrofida — eslatmalar va «muzlatish».", ru: "Страх потерять серию возвращает людей каждый день. Вокруг неё — напоминания и «заморозка»." } },
  { h: { uz: "Son ko'rsatadi", ru: "Показывает число" }, m: { uz: "Qaytarish mexanikasi bor — lekin odam qaytdimi-yo'qmi, buni son ko'rsatadi: qaytganlar foizi.", ru: "Механика возвращения есть — но вернулся ли человек, показывает число: процент вернувшихся." } }
];
const K5_TAXMIN = [
  { k: 'hafta', t: { uz: 'Haftada bir marta', ru: "Раз в неделю" } },
  { k: 'ikki', t: { uz: 'Ikki kunda bir marta', ru: "Раз в два дня" } },
  { k: 'har', ok: true, t: { uz: 'Har kuni', ru: "Каждый день" } }
];
const K5_SAVOL = { uz: 'Ketma-ket kunlar odamni qanchalik tez-tez qaytaradi?', ru: "Как часто дни подряд возвращают человека?" };
const HAFTA = [{ uz: 'Du', ru: "Пн" }, { uz: 'Se', ru: "Вт" }, { uz: 'Ch', ru: "Ср" }, { uz: 'Pa', ru: "Чт" }, { uz: 'Ju', ru: "Пт" }, { uz: 'Sh', ru: "Сб" }, { uz: 'Ya', ru: "Вс" }];
const Olov = () => (
  <svg className="uc-olov" viewBox="0 0 32 40" aria-hidden="true">
    <path d="M16 2 C18 10, 27 14, 27 25 C27 33, 22 38, 16 38 C10 38, 5 33, 5 25 C5 18, 10 15, 12 9 C14 13, 15 15, 16 16 C17 11, 16 7, 16 2 Z" fill="#FF9600" />
    <path d="M16 18 C18 23, 22 25, 22 30 C22 34, 19 36, 16 36 C13 36, 10 34, 10 30 C10 26, 13 24, 16 18 Z" fill="#FFC800" />
  </svg>
);
const QorParcha = () => (
  <svg className="uc-qor" viewBox="0 0 24 24" aria-hidden="true">
    <g stroke="#1CB0F6" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" /><path d="M9 4l3 2 3-2M9 20l3-2 3 2" /></g>
  </svg>
);
const Kataklar = ({ toliq, halqa }) => (
  <span className="uc-kataklar">
    {HAFTA.map((d, i) => {
      const belgi = i < 6 || toliq;
      return <span key={i} className={cxx('uc-katak', belgi && 'bor', i === 6 && !toliq && halqa && 'halqa')} style={{ '--i': i }}><i>{belgi ? '✓' : ''}</i><em>{tr(d)}</em></span>;
    })}
  </span>
);
const DuoTelefon = ({ children, mini }) => (
  <div className={cxx('uc-tel', 'uc-duo-tel', mini && 'mini')} aria-hidden="true">
    <span className="uc-tel-bar"><Duo /></span>
    <span className="uc-tel-ekran">{children}</span>
  </div>
);
const DuolingoSahna = ({ b, ochildi, onEslatma }) => (
  <div className={cxx('uc-duo-sahna', b >= 2 && 'ikki')}>
    {b === 0 && <DuoTelefon><span className="uc-duo-markaz"><Olov /><Kataklar halqa /></span></DuoTelefon>}
    {b === 1 && (!ochildi
      ? <div className="uc-tel uc-qulf" key="q">
          <span className="uc-qulf-s" aria-hidden="true" />
          <button type="button" className="uc-bildirish uc-halqa" onClick={onEslatma} aria-label="Duolingo">
            <Duo /><i /><i />
          </button>
        </div>
      : <DuoTelefon key="o"><span className="uc-duo-markaz uc-ochildi"><Olov /><Kataklar toliq /><span className="uc-muz"><QorParcha /><em>{tr({ uz: 'muzlatish', ru: "заморозка" })}</em></span></span></DuoTelefon>)}
    {b >= 2 && <>
      <DuoTelefon mini><span className="uc-duo-markaz"><Olov /><Kataklar toliq /></span></DuoTelefon>
      <div className="uc-duo-ong">
        <HisobotVaraq className="uc-v-bitta" qatorlar={[{ ...mentorQator(MENTOR_HISOBOT.qatorlar[3]), izoh: null, oldin: null, holat: 'joriy' }]} />
        <span className="uc-kulrang">{tr({ uz: "Sizning eslatmangiz — o'tgan darsdagi qoida bilan: foyda aytadi, qo'rqitmaydi.", ru: "Ваше напоминание — по правилу прошлого урока: говорит о пользе, не пугает." })}</span>
      </div>
    </>}
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [ochildi, setOchildi] = useState(false);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  // 2/3: eslatma bosilmasa ham ilova bir lahzadan keyin ochiladi («muzlatish» ko'rinsin)
  useEffect(() => { if (b !== 1 || ochildi) return undefined; const t = setTimeout(() => setOchildi(true), kamHarakat() ? 300 : 2600); return () => clearTimeout(t); }, [b, ochildi]);
  const kadr = K5_KADR[b];
  const kutish = b === 0 && !taxmin;
  const tx = K5_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Duo /> · {b + 1}/3</>;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: "Из мира бизнеса" })} screen={screen} scrollSignal={b} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Voqea davomi', ru: "Продолжение истории" })} (${b + 1}/3)`} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Duo /> odamlarni <A>qanday qaytaradi?</A></>, ru: <>Как <Duo /> <A>возвращает людей?</A></> })}
        nuqtalar={<>
          <Mentor key={'m' + b}>{tr(kadr.m)}</Mentor>
          <div className="uc-nuq"><span className="uc-nuq-l">{yorliq}</span>{K5_KADR.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="uc-voqea">
          {b === 0 && <p className="uc-tanish"><Duo /> — {tr({ uz: "til o'rganish ilovasi.", ru: "приложение для изучения языков." })}</p>}
          <span className="uc-voqea-h" key={'h' + b}>{tr(kadr.h)}</span>
          {taxmin && !done && <BashoratQ savol={tr(K5_SAVOL)} javob={tr(tx.t)} />}
          <div className={cxx('uc-voqea-qator', (kutish || done) && 'ikki')}>
            <Zoomable><DuolingoSahna b={b} ochildi={ochildi} onEslatma={() => setOchildi(true)} /></Zoomable>
            {done && <QXulosa><XulosaQ natija={tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: 'har kuni', ru: "каждый день" })} />}
              matn={tr({ uz: "Bu voqeada odamlarni seriyani yo'qotish qo'rquvi qaytaradi. Qaytgan-qaytmaganini esa son ko'rsatadi.", ru: "В этой истории людей возвращает страх потерять серию. А вернулся ли человек, показывает число." })} /></QXulosa>}
            {kutish && <div className="uc-chorla-b"><QBashorat yorliq={yorliq} savol={tr(K5_SAVOL)} variantlar={K5_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>}
          </div>
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; ✔ D, INLINE_KEYS.s7 = 3; keys ko'prigi — ikkala trek) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · qaytganlar foizi', ru: "Проверка · процент вернувшихся" })}
    questionText="Ilovangizga odamlar qaytyaptimi — hisobotning qaysi qatori ko'rsatadi?"
    question={tr({ uz: <h2 className="title h-ask">Ilovangizga odamlar qaytyaptimi — <A>hisobotning qaysi qatori ko'rsatadi?</A></h2>, ru: <h2 className="title h-ask">Возвращаются ли люди в ваше приложение — <A>какая строка отчёта это покажет?</A></h2> })}
    options={[
      { uz: "Ro'yxatdan o'tganlar, sinfdoshlar bilan", ru: "Зарегистрировавшиеся, вместе с одноклассниками" },
      { uz: 'Asosiy harakatni qilganlar va sanasi', ru: "Сделавшие основное действие и дата" },
      { uz: 'Lendingda tugmani bosganlarning foizi', ru: "Процент нажавших кнопку на лендинге" },
      { uz: 'Keyingi davrda ham ochganlarning foizi', ru: "Процент открывших и в следующий период" }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Bu qator ikki davrni solishtiradi: kim keyin ham ochdi.', ru: "Эта строка сравнивает два периода: кто открыл и потом." }}
    explainWrong={{
      0: { uz: "Ro'yxatdan o'tgan odam keyin yana ochdimi — bu son aytadimi?", ru: "Открыл ли зарегистрировавшийся потом снова — говорит ли это число?" },
      1: { uz: 'Bu son hozirgi holatni aytadi — ikki davrni solishtiradimi?', ru: "Это число говорит о текущем состоянии — сравнивает ли оно два периода?" },
      2: { uz: 'Bu lendingga kelganlar — ilovani yana ochganini aytadimi?', ru: "Это пришедшие на лендинг — говорит ли это о повторном открытии приложения?" },
      default: { uz: 'Qaysi qator ikki davrni solishtiradi?', ru: "Какая строка сравнивает два периода?" }
    }}
    vizual={<div className="uc-tviz-q"><HisobotVaraq className="uc-v-bitta" qatorlar={[{ ...mentorQator(MENTOR_HISOBOT.qatorlar[3]), izoh: null, oldin: null, holat: 'joriy' }]} /></div>} />
);

// ===== SCREEN 8 — ZAXIRA REJA (QTushuncha ketma-ket: bo'g'inlar → tanlov → gipoteza → ish; atama «zaxira reja» — misoldan keyin) =====
// Matndagi sonlar sanab chiqadi (bo'g'in kartasi ochilganda)
const SonliMatn = ({ matn }) => <>{String(matn).split(/(\d+)/).map((p, i) => (/^\d+$/.test(p) ? <b key={i}><Sanagich gacha={Number(p)} /></b> : <React.Fragment key={i}>{p}</React.Fragment>))}</>;
const BoginKarta = ({ g, ochiq, joriy, onOch, tanlov, mentorTanlov, kamTug, onKam, ixcham, kRef, i }) => (
  <div ref={kRef} className={cxx('uc-bogin', ochiq && 'ochiq', joriy && 'joriy', tanlov && 'tanlov', mentorTanlov && 'mentor', ixcham && 'ixcham')} style={{ '--i': i }}>
    {!ochiq
      ? <button type="button" className={cxx('uc-bogin-h', joriy && 'uc-halqa')} onClick={onOch} disabled={!joriy}>{tr(g.nom)}</button>
      : <span className="uc-bogin-h">{tr(g.nom)}</span>}
    {ochiq && !ixcham && <span className="uc-bogin-m fade-step"><SonliMatn matn={tr(g.mentor.matn)} /><i className="hv-birlik">{tr(g.mentor.birlik)}</i></span>}
    {ochiq && !ixcham && g.id === 'royxat' && <span className="uc-bogin-2 fade-step">
      <SonliMatn matn={tr({ uz: "8-darsdagi tuzatishdan keyin birinchi marta ochgan qurilmalar — 15, ulardan ro'yxatdan o'tgani — 11 (73%; oldin 59%)", ru: "Устройств, впервые открывших приложение после исправления в 8-м уроке, — 15, из них зарегистрировались 11 (73%; раньше 59%)" })} />
      <em>{tr({ uz: '15 ta qurilma — kam: farq bor, lekin bu isbot emas.', ru: "15 устройств — мало: разница есть, но это не доказательство." })}</em>
    </span>}
    {kamTug && <button type="button" className="uc-kam" style={{ '--i': i }} onClick={onKam}>{tr({ uz: 'Shu yerda kam', ru: "Здесь мало" })}</button>}
  </div>
);
const RejaKarta = ({ n, yangi, rRef, atama, telefon, mini }) => {
  const QATOR = [
    { y: { uz: "qaysi bo'g'inda kam", ru: "в каком звене мало" }, m: MENTOR_ZAXIRA.sabab },
    { y: { uz: 'gipoteza', ru: "гипотеза" }, m: MENTOR_ZAXIRA.gipoteza },
    { y: { uz: 'bir haftalik ish', ru: "дело на неделю" }, m: MENTOR_ZAXIRA.ish }
  ];
  return (
    <div className={cxx('uc-reja-k', mini && 'mini')} ref={rRef}>
      {atama && <span className="hv-atama fade-step">{tr({ uz: 'zaxira reja', ru: "запасной план" })}</span>}
      <ol className="uc-reja-ro">
        {QATOR.map((q, i) => (i < n
          ? <li key={i} className={cxx('bor', yangi === i && 'yangi')}><em>{tr(q.y)}</em><span>{tr(q.m)}</span></li>
          : <li key={i} className="joy"><i>{i + 1}</i></li>))}
      </ol>
      {telefon && <div className="uc-reja-tel fade-step"><JamoaTelefon ulashish /></div>}
    </div>
  );
};
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [ochiq, setOchiq] = useState(avval ? 4 : 0);
  const [tanlov, setTanlov] = useState(storedAnswer?.tanlov ?? null);
  const [n, setN] = useState(avval ? 3 : 0);
  const [yangi, setYangi] = useYangi(1200);
  const [uch, qatlam] = useUchish();
  const kRefs = useRef({}).current, rejaRef = useRef(null), tugRef = useRef({}).current;
  const done = n >= 3;
  const tugadi = useTugadi(done, 1500, avval);
  const ipucha = useIpucha(ochiq < 4, ochiq);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, tanlov }); }, [done]); // eslint-disable-line
  const och = (i) => { if (i === ochiq) setOchiq(ochiq + 1); };
  const kam = (id) => {
    if (tanlov) return;
    setTanlov(id);
    uch(kRefs[id], rejaRef.current, tr(BOGINLAR.find(g => g.id === id).nom));
    setN(1); setYangi(0);
  };
  const qadam = (k) => { uch(tugRef[k], rejaRef.current, k === 'gip' ? tr({ uz: 'gipoteza', ru: "гипотеза" }) : tr({ uz: 'bir haftalik ish', ru: "дело на неделю" })); setN(k === 'gip' ? 2 : 3); setYangi(k === 'gip' ? 1 : 2); };
  const joriyQadam = ochiq < 4 ? 0 : !tanlov ? 1 : n < 2 ? 2 : n < 3 ? 3 : undefined;
  const tanlovNom = tanlov ? tr(BOGINLAR.find(g => g.id === tanlov).nom) : '';
  const natija = tanlov && (tanlov === 'kanal'
    ? <span className="uc-tx ok">{tr({ uz: 'Mentor ham kanalni tanladi', ru: "Ментор тоже выбрал канал" })} <b>✓</b></span>
    : <span className="uc-tx">{tr({ uz: 'Tanlovingiz', ru: "Ваш выбор" })}: <b>{tanlovNom}</b> · {tr({ uz: 'Mentor tanlovi', ru: "Выбор Ментора" })}: <b>{tr({ uz: 'kanal', ru: "канал" })}</b></span>);
  const kartalar = (
    <div className="uc-boginlar">
      <span className="uc-kulrang uc-bogin-iz">{tr({ uz: "Bu darsda bo'g'in — odam postdan asosiy harakatgacha o'tadigan yo'lning alohida joyi.", ru: "В этом уроке звено — отдельное место на пути человека от поста до основного действия." })}</span>
      {BOGINLAR.map((g, i) => (
        <BoginKarta key={g.id} g={g} i={i} kRef={(el) => { kRefs[g.id] = el; }} ochiq={i < ochiq} joriy={i === ochiq} onOch={() => och(i)}
          tanlov={tanlov === g.id} mentorTanlov={!!tanlov && g.id === 'kanal'} ixcham={tugadi}
          kamTug={ochiq >= 4 && !tanlov} onKam={() => kam(g.id)} />
      ))}
      {tugadi && <div className="uc-reja-tel"><JamoaTelefon ulashish /></div>}
    </div>
  );
  const reja = <RejaKarta n={n} yangi={yangi} rRef={rejaRef} atama={done} telefon={n >= 3 && !tugadi} />;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · zaxira reja', ru: "Понятие · запасной план" })} screen={screen} scrollSignal={ochiq * 10 + n + (tanlov ? 5 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Bo'g'inlarni oching", ru: "Откройте звенья" })} (${ochiq}/4)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>50 ga yetmasa, bir haftada <A>nima qilasiz?</A></>, ru: <>Если не дошли до 50, <A>что сделаете за неделю?</A></> })}
        mentor={<Mentor>{tr({ uz: "Mentor misolidagi bo'g'inlarni birma-bir oching va odam qayerda kam ekanini tanlang.", ru: "Откройте звенья в примере Ментора одно за другим и выберите, где людей мало." })}</Mentor>}
        bashorat={!tugadi && <QQadamlar qadamlar={[tr({ uz: "Bo'g'inlar", ru: "Звенья" }), tr({ uz: 'Tanlov', ru: "Выбор" }), tr({ uz: 'Gipoteza', ru: "Гипотеза" }), tr({ uz: 'Ish', ru: "Дело" })]} joriy={joriyQadam} />}
        harakat={!tugadi && <div className="uc-s8-harakat">
          {tanlov && !done && <div className="uc-s8-natija fade-step">{natija}
            <span className="uc-kulrang">{tr({ uz: "Boshqa bo'g'inlarda ham odam kamayadi — bir haftaga bittasi tanlanadi.", ru: "В других звеньях люди тоже теряются — на неделю выбирают одно." })}</span>
            <span className="uc-kulrang">{tr({ uz: "Bo'g'inlarning birligi har xil: sonlari solishtirilmaydi — har birining ichiga qaraladi.", ru: "У звеньев разные единицы: их числа не сравнивают — смотрят внутрь каждого." })}</span>
          </div>}
          {tanlov && n === 1 && <QTugma className="uc-halqa" ref={(el) => { tugRef.gip = el; }} onClick={() => qadam('gip')}>{tr({ uz: 'Gipoteza', ru: "Гипотеза" })}</QTugma>}
          {tanlov && n === 2 && <QTugma className="uc-halqa" ref={(el) => { tugRef.ish = el; }} onClick={() => qadam('ish')}>{tr({ uz: 'Ish', ru: "Дело" })}</QTugma>}
          {ipucha && <p className="uc-ipucha fade-step">{tr({ uz: "Chapdagi yoqilgan bo'g'inni bosing — Mentor sonlari ochiladi.", ru: "Нажмите подсвеченное звено слева — откроются числа Ментора." })}</p>}
        </div>}
        vizual={<div className={cxx('uc-split', 'uc-s8', tugadi && 'tugadi')}>{kartalar}{reja}</div>}
        xulosa={done && <XulosaQ natija={natija}
          matn={tr({ uz: "Bizda zaxira reja uch qator: qaysi bo'g'inda odam kam, bitta gipoteza va bir haftada bajariladigan bitta ish.", ru: "У нас запасной план — три строки: в каком звене мало людей, одна гипотеза и одно дело на неделю." })}
          izoh={tr({ uz: "Maqsadga yetilmaganda yoziladigan bu uch qator — zaxira reja deyiladi.", ru: "Эти три строки, которые пишут, когда цель не достигнута, называются запасным планом." })} />}
      />
      {qatlam}
    </Stage>
  );
};


// ===== SCREEN 9 — KOD YOZISH: SQL (QKod, Neon varianti — chapda vazifa, o'ngda Neon SQL Editor maketi; 10-Modul 1-dars naqshi) · yozadi pm-m10d10-hisobot.kunlar, royxat.soni, royxat.manba — faqat «Bajardim»da · nishon sqlCounter =====
const S9_DARVOZA = [
  { id: 'login', ok: false, x: { uz: '`login` — o\'zi tanlagan nom: namuna akkauntda ham bor.', ru: "`login` — имя, которое человек выбрал сам: оно есть и у аккаунта-образца." } },
  { id: 'yaratilgan', ok: false, x: { uz: '`yaratilgan` — qachon ro\'yxatdan o\'tgani: u kunni beradi.', ru: "`yaratilgan` — когда человек зарегистрировался: из него берётся день." } },
  { id: 'namuna', ok: true }
];
const S9_VAZIFA = [
  { uz: "Neon'da loyihangizni oching va SQL Editor'ga o'ting.", ru: "Откройте свой проект в Neon и перейдите в SQL Editor." },
  { uz: "Bo'sh joyni to'ldirib, SQL'ni o'zingiz yozing va «Run»ni bosing.", ru: "Заполните пропуск, напишите SQL сами и нажмите «Run»." },
  { uz: "Neon ko'rsatgan qatorlarni pastga yozing: kun va son.", ru: "Впишите ниже строки, которые показал Neon: день и число." }
];
const S9_XATO = {
  son: { uz: "Neon ko'rsatgan sonni shu yerga yozing.", ru: "Впишите сюда число, которое показал Neon." },
  kun: { uz: "Qaysi kun? Neon'dagi `kun` ustunidan oling.", ru: "Какой день? Возьмите из столбца `kun` в Neon." },
  takror: { uz: 'Bu kun yuqorida bor — sonini o\'sha qatorga yozing.', ru: "Этот день уже есть выше — впишите число в ту строку." }
};
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — o'quvchi matni emas, qolip API nomi (9-Modul 1-dars yechimi)
const QKOD_ONG = ['muh', 'arrir'].join('');
// Hisobot strip («Hisobot · n / 4») — qatorlar yozilgani (9–11-ekran; yakunda yo'q — E 50)
const qatorYozildimi = (h, id) => {
  if (id === 'qaytgan') return Object.prototype.hasOwnProperty.call(h, 'qaytgan') && (h.qaytgan === null || !!(h.qaytgan && h.qaytgan.sana));
  const q = h[id];
  return !!(q && (q.soni === null || q.sana));
};
const qatorSanalmagan = (h, id) => (id === 'qaytgan' ? h.qaytgan === null && Object.prototype.hasOwnProperty.call(h, 'qaytgan') : !!(h[id] && h[id].soni === null));
const HisobotStrip = ({ h, sRef, s9 }) => {
  const yoz = QATOR_IDLAR.map(id => qatorYozildimi(h, id) || (s9 && id === 'royxat' && h.royxat && h.royxat.soni != null));
  return (
    <div className="uc-strip" ref={sRef}>
      <b>{tr({ uz: 'Hisobot', ru: "Отчёт" })} · {yoz.filter(Boolean).length} / 4</b>
      {QATOR_IDLAR.map((id, i) => <span key={id} className={cxx(yoz[i] && 'ok')}>{yoz[i] ? '✓ ' : ''}{tr(QATOR_NOM[id])}</span>)}
    </div>
  );
};
const NeonMaket = ({ ustun, ajrat, qatorlar, yangi }) => (
  <div className="uc-neon">
    <div className="uc-neon-bar"><i /><i /><i /><span className="uc-neon-tab">SQL Editor</span><span className="uc-neon-run">▶ Run</span></div>
    <pre className="uc-neon-sql"><span className="kw">SELECT</span> date(yaratilgan) <span className="kw">AS</span> kun, COUNT(*){'\n'}<span className="kw">FROM</span> oyinchilar{'\n'}<span className="kw">WHERE</span> {ustun ? <b className={cxx('uc-neon-ustun', ajrat && 'ajrat')}>{ustun}</b> : <span className="uc-neon-joy">______</span>} = false{'\n'}<span className="kw">GROUP BY</span> kun{'\n'}<span className="kw">ORDER BY</span> kun;</pre>
    <div className="uc-neon-jadval">
      <span className="uc-neon-th">kun</span><span className="uc-neon-th">count</span>
      {(qatorlar.length ? qatorlar : [null, null, null]).map((q, i) => (q
        ? <React.Fragment key={q.sana}><span className={cxx('uc-neon-td', 'bor', yangi === q.sana && 'yangi')}>{q.sana}</span><span className={cxx('uc-neon-td', 'bor', yangi === q.sana && 'yangi')}>{q.soni}</span></React.Fragment>
        : <React.Fragment key={'q' + i}><span className="uc-neon-td">?</span><span className="uc-neon-td">?</span></React.Fragment>))}
    </div>
  </div>
);
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [h, setH] = useState(() => hisobotOl());
  const [trek] = useState(trekOl);
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'namuna' : null));
  const [miss, setMiss] = useState(null);
  const [birinchi, setBirinchi] = useState(() => (storedAnswer ? storedAnswer.darvoza !== false : true));
  const [ajrat, setAjrat] = useState(false);
  const [qatorlar, setQatorlar] = useState(() => (storedAnswer && Array.isArray(storedAnswer.kunlar) ? storedAnswer.kunlar : []));
  const [kun, setKun] = useState('');
  const [son, setSon] = useState('');
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [done, setDone] = useState(avval);
  const [yangi, setYangi] = useYangi(1100);
  const [uch, qatlam] = useUchish();
  const jamiRef = useRef(null), stripRef = useRef(null);
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 2400); return () => clearTimeout(t); }, [ajrat]);
  const jami = qatorlar.reduce((s, q) => s + Number(q.soni || 0), 0);
  const pickGate = (g) => {
    if (gpick || isMentor) return;
    if (g.ok) { setGpick(g.id); setMiss(null); setAjrat(true); }
    else { setMiss({ id: g.id, k: Date.now() }); setBirinchi(false); }
  };
  const qoshish = () => {
    if (done) return;
    if (!sonmi(son)) { setXato('son'); return; }
    if (!kun) { setXato('kun'); return; }
    if (qatorlar.some(q => q.sana === kun)) { setXato('takror'); return; }
    const ro = [...qatorlar, { sana: kun, soni: Number(String(son).trim()) }].sort((a, b) => (a.sana < b.sana ? -1 : 1));
    setQatorlar(ro); setYangi(kun); setXato(null); setKun(''); setSon('');
  };
  const olib = (sana) => { if (!done) setQatorlar(q => q.filter(x => x.sana !== sana)); };
  const bajardim = () => {
    if (done || !gpick || !qatorlar.length || isMentor) return;
    const eski = hisobotOl();
    const d = hisobotYoz({ kunlar: qatorlar, royxat: { ...(eski.royxat || {}), soni: jami, manba: 'Database' } });
    setH(d); setDone(true);
    uch(jamiRef.current, stripRef.current, tr({ uz: `Jami: ${jami}`, ru: `Итого: ${jami}` }));
    onAnswer(screen, { stage: 'koding', screenIdx: screen, practice: 'SQL', kunlar: qatorlar, jami, darvoza: birinchi, solved: true, picked: true, correct: birinchi && qatorlar.length >= 1 });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  const qulf = !gpick ? tr({ uz: 'Avval ustun savolini yeching', ru: "Сначала ответьте на вопрос о столбце" }) : !qatorlar.length ? tr({ uz: "Avval Neon ko'rsatgan qatorlarni yozing", ru: "Сначала впишите строки из Neon" }) : null;
  const webQator = trek !== 'mobil';
  const kunXato = xato === 'kun', sonXato = xato === 'son';
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · Neon', ru: "Пишем код · Neon" })} screen={screen} scrollSignal={qatorlar.length + (done ? 50 : 0) + (gpick ? 10 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Ro'yxatdan o'tganlarni sanaydigan <A>SQL yozamiz.</A></>, ru: <>Пишем SQL, который <A>считает зарегистрировавшихся.</A></> })}
        mentor={<Mentor>{tr({ uz: "Hisobotning birinchi qatori Database'dan olinadi — Neon'dagi SQL Editor'da uni kunlar bo'yicha o'zingiz sanang.", ru: "Первая строка отчёта берётся из Database — посчитайте её сами по дням в SQL Editor в Neon." })}</Mentor>}
        vazifa={<>
          <HisobotStrip h={h} sRef={stripRef} s9 />
          <div className={cxx('uc-darvoza', !gpick && !isMentor && 'uc-chorla')}>
            <span className="uc-darvoza-s">{tr({ uz: 'Namuna va tekshiruv akkauntlarini qaysi ustun ajratadi?', ru: "Какой столбец отделяет аккаунты-образцы и проверочные?" })}</span>
            <div className={cxx('uc-darvoza-t', !gpick && 'uc-chorla')}>
              {S9_DARVOZA.map(g => {
                const silk = miss && miss.id === g.id;
                return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} silk={silk} holat={gpick === g.id ? 'ok' : silk ? 'err' : undefined} disabled={!!gpick && gpick !== g.id} onClick={() => pickGate(g)}><span className="mono">{g.id}</span></QChip>;
              })}
            </div>
            {miss && !gpick && <QXato>{fmtCode(tr(S9_DARVOZA.find(g => g.id === miss.id).x))}</QXato>}
          </div>
          <ol className="uc-vazifa">{S9_VAZIFA.map((v, i) => <li key={i}><i>{i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>
          {webQator && <span className="uc-kulrang">{fmtCode(tr({ uz: "Web-trekda — saytingizning foydalanuvchilar jadvali; unda vaqt ustuni bo'lmasa, kunlarsiz jami: `SELECT COUNT(*) FROM {jadval} WHERE namuna = false;`", ru: "В веб-треке — таблица пользователей вашего сайта; если в ней нет столбца времени, итог без дней: `SELECT COUNT(*) FROM {jadval} WHERE namuna = false;`" }))}</span>}
          {qatorlar.length > 0 && <div className="uc-kunlar">{qatorlar.map(q => (
            <span key={q.sana} className={cxx('uc-kun-q', yangi === q.sana && 'yangi')}><i>✓</i><span>{q.sana}</span><b>{q.soni}</b>{!done && <button type="button" className="uc-tahrir" onClick={() => olib(q.sana)} aria-label={tr({ uz: "Qatorni o'chirish", ru: "Удалить строку" })}>✕</button>}</span>
          ))}</div>}
          {!done && !isMentor && <div className={cxx('uc-kun-forma', !gpick && 'yopiq')}>
            <label className={cxx('uc-inp-b', kunXato && 'err', gpick && !kun && 'uc-halqa-i')}><i>{tr({ uz: 'Kun', ru: "День" })}</i><input type="date" value={kun} disabled={!gpick} onChange={e => { setKun(e.target.value); setXato(null); }} aria-label={tr({ uz: 'Kun', ru: "День" })} /></label>
            <label className={cxx('uc-inp-b', 'son', sonXato && 'err')}><i>{tr({ uz: 'Son', ru: "Число" })}</i><input type="text" inputMode="numeric" value={son} disabled={!gpick} maxLength={7} onChange={e => { setSon(e.target.value); setXato(null); }} onKeyDown={e => { if (e.key === 'Enter') qoshish(); }} aria-label={tr({ uz: 'Son', ru: "Число" })} /></label>
            <QTugma ikkinchi className={cxx(gpick && kun && sonmi(son) && 'uc-halqa')} disabled={!gpick} onClick={qoshish}>{tr({ uz: '+ Qator', ru: "+ Строка" })}</QTugma>
            <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
          </div>}
          {xato && <QXato>{fmtCode(tr(S9_XATO[xato]))}</QXato>}
          {yordam && !done && <div className="uc-yordam fade-step">
            <QIzoh>{fmtCode(tr({ uz: 'Eslatma (SQL darslaridan): `date(…)` — vaqtdan faqat kunni oladi · `AS kun` — ustunga nom beradi · `COUNT(*)` — qatorlarni sanaydi · `WHERE` — qaysi qatorlar olinadi · `GROUP BY kun` — har kun uchun alohida sanaydi · `ORDER BY kun` — kunlar tartibida chiqaradi.', ru: "Напоминание (из уроков SQL): `date(…)` — берёт из времени только день · `AS kun` — даёт столбцу имя · `COUNT(*)` — считает строки · `WHERE` — какие строки берутся · `GROUP BY kun` — считает отдельно по каждому дню · `ORDER BY kun` — выводит по порядку дней." }))}</QIzoh>
            <QIzoh>{tr({ uz: 'Jadval nomini bilmasangiz — agentga yozing:', ru: "Если не знаете имя таблицы — напишите агенту:" })}</QIzoh>
            <QPrompt til={__lang} satrlar={[tr({ uz: "Ro'yxatdan o'tganlar qaysi jadvalda? Faqat nomini ayt, hech narsani o'zgartirma.", ru: "В какой таблице зарегистрировавшиеся? Скажи только название, ничего не меняй." })]} />
            <QIzoh>{fmtCode(tr({ uz: '`SELECT *` yozmang: jadvalda ism va login bor — hisobotga faqat son kerak.', ru: "Не пишите `SELECT *`: в таблице есть имя и логин — для отчёта нужно только число." }))}</QIzoh>
          </div>}
          {qatorlar.length > 0 && <span className="uc-jami" ref={jamiRef}>{tr({ uz: 'Jami', ru: "Итого" })}: <b key={jami}><Sanagich gacha={jami} /></b></span>}
          {qatorlar.length > 0 && !done && <span className="uc-kulrang">{tr({ uz: "Sanoq sahifasidagi «ro'yxatdan o'tgan» bilan solishtiring — odatda bir xil; farq bo'lsa, qaysi biri qachon sanalganini qarang.", ru: "Сравните с «зарегистрировался» на странице подсчёта — обычно совпадает; если есть разница, посмотрите, что и когда посчитано." })}</span>}
        </>}
        bajardim={done
          ? <QXulosa>{tr({ uz: "Birinchi qator Database'dan olindi — namuna va tekshiruv akkauntlarisiz.", ru: "Первая строка взята из Database — без аккаунтов-образцов и проверочных." })}</QXulosa>
          : <>
            <QTugma className={qulf ? undefined : 'uc-halqa'} disabled={!!qulf || isMentor} onClick={bajardim}>{qulf || tr({ uz: 'Bajardim — SQL ishladi, qatorlar yozildi', ru: "Готово — SQL сработал, строки записаны" })}</QTugma>
            <span className="uc-kulrang uc-kichik">{tr({ uz: "Vaqt tugasa — keyingi mashqda 1-qatorga sanoq sahifasidagi sonni yozing va manbani «sanoq sahifasi» deb belgilang; kunlar — uyda.", ru: "Если время вышло — в следующем упражнении впишите в 1-ю строку число со страницы подсчёта и отметьте источник «страница подсчёта»; дни — дома." })}</span>
          </>}
        {...{ [QKOD_ONG]: <div className="uc-kod-ong">
          <Zoomable><NeonMaket ustun={gpick} ajrat={ajrat} qatorlar={qatorlar} yangi={yangi} /></Zoomable>
          <span className="uc-kulrang">{fmtCode(tr({ uz: '`oyinchilar` — Mentor misolidagi jadval. Sizda — ishga tushirishdan oldin `namuna` ustuni qo\'shilgan jadval.', ru: "`oyinchilar` — таблица из примера Ментора. У вас — таблица, в которую до запуска добавили столбец `namuna`." }))}</span>
          <QIzoh>{tr({ uz: 'Sizning qatorlaringiz shu yerda chiqadi. Mentor misolida bir haftada jami — 38.', ru: "Здесь появятся ваши строки. В примере Ментора за неделю всего — 38." })}</QIzoh>
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      />
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 10 — METRIKA HISOBOTINGIZ (QMustaqil, USTAXONA — bittadan karta, 4 qator + pastki; SABOQ 9, 13, 17, 29; E 53) · yozadi pm-m10d10-hisobot · nishon reportReady =====
const S10_XATO = {
  son: { uz: 'Son yozing yoki «Hali sanalmagan»ni bosing.', ru: "Впишите число или нажмите «Ещё не посчитано»." },
  manba: { uz: 'Bu son qayerdan olindi? Manbani tanlang.', ru: "Откуда взято это число? Выберите источник." },
  sana: { uz: 'Qachon sanalgan? Sanani yozing.', ru: "Когда посчитано? Впишите дату." },
  sinfdosh: { uz: "Sinfdoshlar jami sondan ko'p bo'lolmaydi.", ru: "Одноклассников не может быть больше общего числа." },
  asosiy: { uz: "Asosiy harakatni qilganlar ro'yxatdan o'tganlar ichida.", ru: "Сделавшие основное действие — среди зарегистрировавшихся." },
  keyingi: { uz: "Yana ochganlar birinchi davrdagidan ko'p bo'lolmaydi.", ru: "Открывших снова не может быть больше, чем в первом периоде." },
  nima: { uz: 'Bosh raqam nimani sanaydi? Bir qatorda yozing.', ru: "Что считает главное число? Напишите в одной строке." },
  umami: { uz: 'Umami — lending sonlari; ilova sonini Database beradi.', ru: "Umami — числа лендинга; число приложения даёт Database." }
};
const S10_YORDAM = {
  royxat: [{ uz: 'Mentor misolida: «38 / 50 · 11 tasi — sinfdosh · Database · 7 kun keyin».', ru: "В примере Ментора: «38 / 50 · 11 из них — одноклассники · Database · через 7 дней»." }],
  asosiy: [{ uz: "Ishga tushirish kunida ishlatgan so'rovingizni Neon'da qayta «Run» qiling. Mentor misolidagi so'rov (9.23):", ru: "Снова нажмите «Run» в Neon для запроса, который использовали в день запуска. Запрос из примера Ментора (9.23):" },
    { kod: "SELECT COUNT(*) FROM oyinchilar o WHERE o.namuna = false AND (EXISTS (SELECT 1 FROM ishtirokchilar i WHERE i.oyinchi_id = o.id AND i.holat IN ('qoshildi', 'keladi')) OR EXISTS (SELECT 1 FROM oyinlar g WHERE g.tashkilotchi_id = o.id));" },
    { uz: '— natija: 19.', ru: "— результат: 19." }],
  bosh: [{ uz: "Mentor misolida: «birinchi haftada to'lgan o'yinlar: 1 · Database». So'rov kerak bo'lsa — agentga:", ru: "В примере Ментора: «заполненные игры за первую неделю: 1 · Database». Если нужен запрос — агенту:" },
    { prompt: [{ uz: 'Neon SQL Editor uchun bitta `SELECT` yoz, o\'zing ishga tushirma: {bosh raqam nimani sanaydi}.', ru: "Напиши один `SELECT` для Neon SQL Editor, сам не запускай: {что считает главное число}." },
      { uz: 'Faqat `namuna = false` akkauntlar, natijada faqat son.', ru: "Только аккаунты `namuna = false`, в результате только число." },
      { uz: "Jadvallarni o'zgartirma.", ru: "Таблицы не меняй." }] }],
  qaytgan: [{ uz: "Mentor misolida: «birinchi 3 kunda ochgan 46 qurilmadan 17 tasi keyingi 2 kunda ham ochdi — 37%». Sanash uchun agentga:", ru: "В примере Ментора: «из 46 устройств, открывших за первые 3 дня, 17 открыли и в следующие 2 дня — 37%». Для подсчёта — агенту:" },
    { prompt: [{ uz: 'Neon SQL Editor uchun bitta `SELECT` yoz, o\'zing ishga tushirma:', ru: "Напиши один `SELECT` для Neon SQL Editor, сам не запускай:" },
      { uz: '`hodisalar` dagi `ochdi` yozuvlaridan {1-davr} da ochgan turli qurilmalar soni va faqat shu qurilmalar ichidan {2-davr} da ham ochganlari soni — 2-davrda birinchi marta ochgan qurilmalar kirmasin.', ru: "по записям `ochdi` в `hodisalar` — число разных устройств, открывших в {1-й период}, и только среди этих устройств — число открывших и в {2-й период}; устройства, впервые открывшие во 2-м периоде, не включать." },
      { uz: "Natijada faqat ikki son. Jadvallarni o'zgartirma.", ru: "В результате только два числа. Таблицы не меняй." }] },
    { uz: 'Tekshiring: ikkinchi son birinchisidan katta bo\'lolmaydi.', ru: "Проверьте: второе число не может быть больше первого." },
    { uz: 'Ulgurmasangiz — «Hali sanalmagan»: halol qator ham hisobotning bir qismi.', ru: "Не успеваете — «Ещё не посчитано»: честная строка — тоже часть отчёта." }],
  pastki: [{ uz: "Sanoq sahifangizni kalit bilan oching va qadamlar sonini yozing; lending sonlari — Umami'da lending saytingiz sahifasida.", ru: "Откройте свою страницу подсчёта с ключом и впишите числа шагов; числа лендинга — в Umami, на странице вашего сайта-лендинга." }]
};
const YordamBlok = ({ satrlar }) => (
  <div className="uc-yordam fade-step">
    {satrlar.map((s, i) => (s.kod ? <code key={i} className="uc-kod-satr">{s.kod}</code>
      : s.prompt ? <QPrompt key={i} til={__lang} satrlar={s.prompt.map(p => tr(p))} />
        : <QIzoh key={i}>{fmtCode(tr(s))}</QIzoh>))}
  </div>
);
// Maydon: yorliq input ichida (E 43) — doimiy qisqa yorliq + placeholder savol
const Maydon = ({ y, value, onChange, ph, err, halqa, type = 'text', son, max = 80, disabled, onEnter, iRef, keng }) => (
  <label className={cxx('uc-inp-b', son && 'son', keng && 'keng', err && 'err', halqa && 'uc-halqa-i')}>
    <i>{y}</i>
    <input ref={iRef} type={type} inputMode={son ? 'numeric' : undefined} value={value == null ? '' : value} maxLength={type === 'date' ? undefined : max} placeholder={ph} aria-label={typeof y === 'string' ? y : undefined} disabled={disabled}
      onChange={e => onChange(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && onEnter) onEnter(); }} />
  </label>
);
const birlikQ = (trek) => (trek === 'web' ? { uz: 'brauzer', ru: "браузер" } : { uz: 'qurilma', ru: "устройство" });
const oldinMatn = (o) => (o === 'birinchi' ? tr(BIRINCHI_OLCHOV) : o && typeof o === 'object' ? tr({ uz: `oldin: ${o.soni} — ${o.sana}`, ru: `раньше: ${o.soni} — ${o.sana}` }) : null);
// O'quvchi varag'i qatorlari (10, 11-ekran): pm-m10d10-hisobot dan
const oquvchiQatorlar = (h, { joriy, yangi, trek, tuzatish } = {}) => QATOR_IDLAR.map(id => {
  const nom = tr(QATOR_NOM[id]);
  const yoz = qatorYozildimi(h, id);
  const tz = tuzatish && tuzatish.includes(id);
  if (!yoz) return { id, nom, son: id === 'royxat' && h.royxat && h.royxat.soni != null ? String(h.royxat.soni) : '—', maqsad: id === 'royxat' ? ' / 50' : null, holat: joriy === id ? 'joriy' : 'yalang' };
  if (qatorSanalmagan(h, id)) return { id, nom, holat: tz ? 'tuzatish' : 'sanalmagan', tuzatish: tz ? tr({ uz: 'tuzatish', ru: "исправить" }) : null, yangi: yangi === id };
  const q = h[id];
  const base = { id, nom, son: String(q.soni), manba: q.manba ? tr(MANBA_NOM[q.manba] || { uz: q.manba, ru: q.manba }) : null, sana: q.sana, holat: tz ? 'tuzatish' : joriy === id ? 'joriy' : 'toliq', yangi: yangi === id, tuzatish: tz ? tr({ uz: 'tuzatish', ru: "исправить" }) : null };
  if (id === 'royxat') return { ...base, maqsad: ' / 50', birlik: tr({ uz: 'hisob', ru: "аккаунт" }), izoh: q.sinfdosh != null ? tr({ uz: `${q.sinfdosh} tasi — sinfdosh`, ru: `${q.sinfdosh} из них — одноклассники` }) : null, oldin: oldinMatn(q.oldin) };
  if (id === 'asosiy') return { ...base, birlik: tr({ uz: 'hisob', ru: "аккаунт" }), oldin: oldinMatn(q.oldin) };
  if (id === 'bosh') return { ...base, izoh: q.nima || null };
  return { ...base, son: q.foiz + '%', birlik: tr(birlikQ(trek)), izoh: tr({ uz: `${q.birinchi} dan ${q.keyingi} tasi${q.davr ? ' · ' + q.davr : ''}`, ru: `из ${q.birinchi} — ${q.keyingi}${q.davr ? ' · ' + q.davr : ''}` }) };
});
const oquvchiPastki = (p, nomlar, trek) => {
  if (!p) return [];
  const r = [];
  const qs = (p.qadamlar || []).map((n, i) => (n !== '' && n != null ? `${nomlar[i] || '—'} ${n}` : null)).filter(Boolean);
  if (qs.length || (p.eslatmadanOchdi !== '' && p.eslatmadanOchdi != null)) r.push({ k: 'qadam', sar: tr({ uz: 'Qadamlar · sanoq sahifasi', ru: "Шаги · страница подсчёта" }), matn: qs.join(' · ') || '—', birlik: tr(birlikQ(trek)), ajrat: p.eslatmadanOchdi !== '' && p.eslatmadanOchdi != null ? tr(trek === 'web' ? { uz: `xabardan ochdi ${p.eslatmadanOchdi}`, ru: `открыл из сообщения ${p.eslatmadanOchdi}` } : { uz: `eslatmadan ochdi ${p.eslatmadanOchdi}`, ru: `открыл из напоминания ${p.eslatmadanOchdi}` }) : null });
  const l = p.lending || {};
  if ((l.tashrif !== '' && l.tashrif != null) || (l.bosish !== '' && l.bosish != null)) r.push({ k: 'lending', sar: tr({ uz: 'Lending · Umami', ru: "Лендинг · Umami" }), matn: tr({ uz: `tashriflar ${l.tashrif || '—'} · tugma ${l.bosish || '—'}`, ru: `посещения ${l.tashrif || '—'} · кнопка ${l.bosish || '—'}` }), birlik: tr({ uz: 'tashrif · bosish', ru: "посещение · нажатие" }) });
  return r;
};
// Qator kartasi (10-ekran; 11-ekranda «Yo'q — tuzataman» shu kartani ochadi) — har qator o'z qoralamasi bilan (E 51)
const qoralamaBosh = (id, h, reja, prd) => {
  const q = h[id] || {};
  const s = (v) => (v == null ? '' : String(v));
  const d = { soni: s(q.soni), manba: q.manba || null, sana: q.sana || bugun(), oldinSon: '', oldinSana: '', birinchiOlchov: false };
  if (id === 'royxat') {
    d.sinfdosh = q.sinfdosh != null ? s(q.sinfdosh) : (reja && reja.sinfdosh != null ? s(reja.sinfdosh) : '');
    if (!q.manba && q.soni == null) d.manba = null;
  }
  if (id === 'royxat' || id === 'asosiy') {
    if (q.oldin === 'birinchi') d.birinchiOlchov = true;
    else if (q.oldin && typeof q.oldin === 'object') { d.oldinSon = s(q.oldin.soni); d.oldinSana = s(q.oldin.sana); }
  }
  if (id === 'bosh') d.nima = q.nima != null ? s(q.nima) : (prd && prd.boshRaqam ? String(prd.boshRaqam) : '');
  if (id === 'qaytgan') { const g = h.qaytgan || {}; d.birinchi = s(g.birinchi); d.keyingi = s(g.keyingi); d.davr = s(g.davr); d.soni = ''; d.manba = g.manba || null; d.sana = g.sana || bugun(); }
  return d;
};
const rejaOldin = (id, reja) => (reja && reja.sana && reja[id] != null && Number.isFinite(Number(reja[id])) ? { soni: Number(reja[id]), sana: reja.sana } : null);
function s10Tekshir(id, d, h) {
  if (id === 'qaytgan') {
    if (!sonmi(d.birinchi) || !sonmi(d.keyingi)) return { x: 'son', blok: true, f: !sonmi(d.birinchi) ? 'birinchi' : 'keyingi' };
  } else if (!sonmi(d.soni)) return { x: 'son', blok: true, f: 'soni' };
  if (!d.manba) return { x: 'manba', blok: true, f: 'manba' };
  if (!d.sana) return { x: 'sana', blok: true, f: 'sana' };
  if (id === 'royxat' && d.sinfdosh !== '' && sonmi(d.sinfdosh) && Number(d.sinfdosh) > Number(d.soni)) return { x: 'sinfdosh', blok: true, f: 'sinfdosh' };
  if (id === 'asosiy' && h.royxat && h.royxat.soni != null && Number(d.soni) > Number(h.royxat.soni)) return { x: 'asosiy', blok: true, f: 'soni' };
  if (id === 'qaytgan' && Number(d.keyingi) > Number(d.birinchi)) return { x: 'keyingi', blok: true, f: 'keyingi' };
  if (id === 'bosh' && !String(d.nima || '').trim()) return { x: 'nima', blok: true, f: 'nima' };
  if (d.manba === 'Umami') return { x: 'umami', blok: false, f: 'manba' };
  return null;
}
const s10Qiymat = (id, d, reja) => {
  const n = (v) => Number(String(v).trim());
  if (id === 'qaytgan') return { birinchi: n(d.birinchi), keyingi: n(d.keyingi), foiz: n(d.birinchi) > 0 ? Math.round((n(d.keyingi) / n(d.birinchi)) * 100) : 0, davr: String(d.davr || '').trim(), manba: d.manba, sana: d.sana };
  const v = { soni: n(d.soni), manba: d.manba, sana: d.sana };
  if (id === 'royxat' || id === 'asosiy') {
    const avto = rejaOldin(id, reja);
    v.oldin = avto || (d.birinchiOlchov ? 'birinchi' : (sonmi(d.oldinSon) && d.oldinSana ? { soni: n(d.oldinSon), sana: d.oldinSana } : null));
  }
  if (id === 'royxat') v.sinfdosh = sonmi(d.sinfdosh) ? n(d.sinfdosh) : null;
  if (id === 'bosh') v.nima = String(d.nima || '').trim();
  return v;
};
const sanalmaganQiymat = (id, d) => (id === 'qaytgan' ? null : id === 'bosh' ? { nima: String(d.nima || '').trim(), soni: null, manba: null, sana: null }
  : id === 'royxat' ? { soni: null, sinfdosh: null, manba: null, sana: null, oldin: null } : { soni: null, manba: null, sana: null, oldin: null });
const QatorKarta = ({ id, h, reja, prd, trek, kRef, sarlavha, onSaqla, onSanalmagan, uyda, onUyda }) => {
  const [d, setD] = useState(() => qoralamaBosh(id, h, reja, prd));
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const iRef = useRef(null);
  const o = (k) => (v) => { setD(x => ({ ...x, [k]: k === 'soni' || k === 'sinfdosh' || k === 'birinchi' || k === 'keyingi' || k === 'oldinSon' ? v.replace(/[^\d]/g, '') : v })); setXato(null); };
  const avtoOldin = (id === 'royxat' || id === 'asosiy') && rejaOldin(id, reja);
  const saqla = () => {
    const t = s10Tekshir(id, d, h);
    const imzo = JSON.stringify(d);
    if (t && (t.blok || !(yumshoq && yumshoq === imzo))) { setXato(t); if (!t.blok) setYumshoq(imzo); return; }
    onSaqla(id, s10Qiymat(id, d, reja), iRef.current);
  };
  const foiz = id === 'qaytgan' && sonmi(d.birinchi) && sonmi(d.keyingi) && Number(d.birinchi) > 0 ? Math.round((Number(d.keyingi) / Number(d.birinchi)) * 100) : null;
  const ef = xato && xato.f;
  const tayyor = id === 'qaytgan' ? sonmi(d.birinchi) && sonmi(d.keyingi) && d.manba && d.sana : sonmi(d.soni) && d.manba && d.sana && (id !== 'bosh' || String(d.nima || '').trim());
  return (
    <div ref={kRef} className={cxx('uc-karta', 'uc-kirish', xato && 'err')}>
      <span className="q-yorliq">{sarlavha}</span>
      <b className="uc-karta-nom">{tr(QATOR_NOM[id])}</b>
      {id === 'bosh' && <Maydon y={tr({ uz: 'Nimani sanaydi', ru: "Что считает" })} keng value={d.nima} onChange={o('nima')} max={120} err={ef === 'nima'} halqa={!String(d.nima || '').trim()} ph={tr({ uz: "Qaysi bitta raqam mahsulot ishini ko'rsatadi?", ru: "Какое одно число показывает работу продукта?" })} />}
      {id !== 'qaytgan'
        ? <div className="uc-qator-m">
            <Maydon iRef={iRef} y={tr({ uz: 'Son', ru: "Число" })} son value={d.soni} onChange={o('soni')} max={7} err={ef === 'soni'} halqa={!d.soni && id !== 'bosh'} onEnter={saqla} />
            {id === 'royxat' && <span className="uc-50">/ 50</span>}
            {id === 'royxat' && <Maydon y={tr({ uz: 'shundan sinfdosh', ru: "из них одноклассники" })} son value={d.sinfdosh} onChange={o('sinfdosh')} max={5} err={ef === 'sinfdosh'} />}
          </div>
        : <div className="uc-qator-m">
            <Maydon iRef={iRef} y={tr({ uz: 'Birinchi davrda ochgan', ru: "Открыли в первый период" })} son value={d.birinchi} onChange={o('birinchi')} max={6} err={ef === 'birinchi'} halqa={!d.birinchi} />
            <Maydon y={tr({ uz: 'Keyingi davrda ham ochgan', ru: "Открыли и в следующий период" })} son value={d.keyingi} onChange={o('keyingi')} max={6} err={ef === 'keyingi'} />
            <span className="uc-foiz">{foiz != null ? <b key={foiz}>{foiz}%</b> : '— %'} <i className="hv-birlik">{tr(birlikQ(trek))}</i></span>
          </div>}
      {id === 'qaytgan' && <Maydon y={tr({ uz: 'Davrlar', ru: "Периоды" })} keng value={d.davr} onChange={o('davr')} max={40} ph={tr({ uz: 'Davrlar', ru: "Периоды" })} />}
      <div className={cxx('uc-manba-t', !d.manba && 'uc-chorla')}>
        <i className="uc-y">{tr({ uz: 'Manba', ru: "Источник" })}</i>
        {MANBALAR.map(m => <QChip key={m} className="uc-chip" holat={d.manba === m ? 'on' : ef === 'manba' && !d.manba ? 'err' : undefined} onClick={() => { setD(x => ({ ...x, manba: m })); setXato(null); }}>{tr(MANBA_NOM[m])}</QChip>)}
      </div>
      <Maydon y={tr(SANA_Y)} type="date" value={d.sana} onChange={o('sana')} err={ef === 'sana'} />
      {(id === 'royxat' || id === 'asosiy') && (avtoOldin
        ? <span className="uc-kulrang">{oldinMatn(avtoOldin)}</span>
        : <div className="uc-qator-m">
            {!d.birinchiOlchov && <Maydon y={tr({ uz: 'Oldingi son va sanasi', ru: "Предыдущее число и дата" })} son value={d.oldinSon} onChange={o('oldinSon')} max={6} />}
            {!d.birinchiOlchov && <Maydon y={tr(SANA_Y)} type="date" value={d.oldinSana} onChange={o('oldinSana')} />}
            <QChip className="uc-chip" holat={d.birinchiOlchov ? 'on' : undefined} onClick={() => setD(x => ({ ...x, birinchiOlchov: !x.birinchiOlchov }))}>{tr({ uz: "Birinchi o'lchov", ru: "Первое измерение" })}</QChip>
          </div>)}
      {id === 'royxat' && !(reja && reja.sinfdosh != null) ? null : id === 'royxat' && <span className="uc-kulrang">{tr({ uz: 'ishga tushirish kunidagi son — bilsangiz, yangilang (ixtiyoriy)', ru: "число из дня запуска — если знаете, обновите (по желанию)" })}</span>}
      {id === 'royxat' && <span className="uc-kulrang">{tr({ uz: 'Namuna va tekshiruv akkauntlari sanalmaydi; sinfdoshlar sanaladi, lekin alohida aytiladi.', ru: "Аккаунты-образцы и проверочные не считаются; одноклассники считаются, но называются отдельно." })}</span>}
      {id === 'asosiy' && <span className="uc-kulrang">{tr({ uz: "Mentor misolida — hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan; navbatda turgani — qo'shilgan emas.", ru: "В примере Ментора — сейчас участвуют хотя бы в одной игре или объявили игру; кто стоит в очереди — ещё не присоединился." })}</span>}
      {id === 'qaytgan' && <span className="uc-kulrang">{tr({ uz: 'Keyingi davrga faqat birinchi davrda ochgan qurilmalar kiradi — yangi kelganlar emas.', ru: "В следующий период входят только устройства, открывшие в первый, — не новые." })}</span>}
      {xato && <QXato>{tr(S10_XATO[xato.x])}</QXato>}
      {xato && !xato.blok && <span className="uc-kulrang">{tr({ uz: 'Shunday qoldirsangiz — yana «Saqlash»ni bosing.', ru: "Если оставить так — снова нажмите «Сохранить»." })}</span>}
      {yordam && <YordamBlok satrlar={S10_YORDAM[id]} />}
      <div className="uc-karta-tug">
        <QTugma className={cxx(tayyor && 'uc-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: "Сохранить" })}</QTugma>
        <QTugma ikkinchi onClick={() => onSanalmagan(id, sanalmaganQiymat(id, d), iRef.current)}>{tr({ uz: 'Hali sanalmagan', ru: "Ещё не посчитано" })}</QTugma>
        {uyda && <QTugma ikkinchi onClick={onUyda}>{tr({ uz: 'Uyda tuzataman', ru: "Исправлю дома" })}</QTugma>}
        <QTugma ikkinchi className="uc-yordam-t" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
      </div>
    </div>
  );
};
const MENTOR_QADAM_NOM = MENTOR_HISOBOT.qadamlar.map(q => q.nom);
const PastkiKarta = ({ p0, nomlar, trek, kRef, onSaqla }) => {
  const [p, setP] = useState(() => ({ qadamlar: nomlar.map((_, i) => (p0 && p0.qadamlar && p0.qadamlar[i] != null ? String(p0.qadamlar[i]) : '')), lending: { tashrif: p0?.lending?.tashrif ?? '', bosish: p0?.lending?.bosish ?? '' }, eslatmadanOchdi: p0?.eslatmadanOchdi ?? '' }));
  const [yordam, setYordam] = useState(false);
  const raq = (v) => String(v).replace(/[^\d]/g, '');
  return (
    <div ref={kRef} className="uc-karta uc-kirish">
      <span className="q-yorliq">{tr({ uz: 'Pastda: qadamlar va lending', ru: "Внизу: шаги и лендинг" })}</span>
      <div className="uc-qism">
        <i className="uc-y">{tr({ uz: 'Qadamlar', ru: "Шаги" })} · {tr(birlikQ(trek))}</i>
        <div className="uc-qator-m">{nomlar.map((n, i) => <Maydon key={i} y={n.yoz || tr(n.mentor)} son value={p.qadamlar[i]} onChange={(v) => setP(x => ({ ...x, qadamlar: x.qadamlar.map((q, j) => (j === i ? raq(v) : q)) }))} max={6} />)}</div>
      </div>
      <div className="uc-qism">
        <i className="uc-y">{tr({ uz: 'Lending', ru: "Лендинг" })} · {tr({ uz: 'tashrif · bosish', ru: "посещение · нажатие" })}</i>
        <div className="uc-qator-m">
          <Maydon y={tr({ uz: 'tashriflar', ru: "посещения" })} son value={p.lending.tashrif} onChange={(v) => setP(x => ({ ...x, lending: { ...x.lending, tashrif: raq(v) } }))} max={6} />
          <Maydon y={tr({ uz: 'tugma bosilishi', ru: "нажатия кнопки" })} son value={p.lending.bosish} onChange={(v) => setP(x => ({ ...x, lending: { ...x.lending, bosish: raq(v) } }))} max={6} />
        </div>
      </div>
      <span className="uc-kulrang">{tr({ uz: 'Bo\'sh qoldirsangiz bo\'ladi — zaxira rejada qayerda kamligini shu sonlar ko\'rsatadi.', ru: "Можно оставить пустым — в запасном плане эти числа покажут, где мало." })}</span>
      <Maydon y={trek === 'web' ? tr({ uz: 'xabardan ochdi', ru: "открыл из сообщения" }) : tr({ uz: 'eslatmadan ochdi', ru: "открыл из напоминания" })} son value={p.eslatmadanOchdi} onChange={(v) => setP(x => ({ ...x, eslatmadanOchdi: raq(v) }))} max={6} />
      <span className="uc-kulrang">{tr({ uz: "9-darsdagi tekshiruv yozuvlarini o'chirmagan bo'lsangiz — yoniga «o'z qurilmam ham bor» deb yozing.", ru: "Если не удалили проверочные записи 9-го урока — допишите рядом «есть и моё устройство»." })}</span>
      {yordam && <YordamBlok satrlar={S10_YORDAM.pastki} />}
      <div className="uc-karta-tug">
        <QTugma className="uc-halqa" onClick={() => onSaqla(p)}>{tr({ uz: 'Saqlash', ru: "Сохранить" })}</QTugma>
        <QTugma ikkinchi className="uc-yordam-t" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
      </div>
    </div>
  );
};
const qadamNomlari = (qd) => {
  const ro = qd && Array.isArray(qd.qadamlar) ? qd.qadamlar.map(q => String((q && q.nom) || '').trim()).filter(Boolean) : [];
  return ro.length ? ro.map(n => ({ yoz: n })) : MENTOR_QADAM_NOM.map(m => ({ mentor: m }));
};
const reportTayyor = (h) => ['royxat', 'asosiy', 'bosh'].every(id => h[id] && h[id].soni != null && h[id].manba && h[id].sana) && qatorYozildimi(h, 'qaytgan');
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [h, setH] = useState(() => hisobotOl());
  const [ctx] = useState(() => ({ reja: lsO(REJA_KEY), prd: lsO(PRD_KEY), trek: trekOl(), nom: goyaNomi(lsO(FINAL_KEY)), qd: lsO(QADAM_KEY) }));
  const nomlar = useMemo(() => qadamNomlari(ctx.qd), [ctx.qd]);
  const [pastki, setPastki] = useState(() => (storedAnswer && storedAnswer.pastki) || null);
  const [pastkiOk, setPastkiOk] = useState(() => !!(storedAnswer && storedAnswer.pastkiOk));
  const [tahrirK, setTahrirK] = useState(null);
  const [yangi, setYangi] = useYangi(1200);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null), stripRef = useRef(null), qRefs = useRef({}).current;
  const tayyorRef = useRef(!!(storedAnswer && storedAnswer.correct));
  const yozildi = QATOR_IDLAR.filter(id => qatorYozildimi(h, id));
  const n = yozildi.length;
  const birinchiBosh = QATOR_IDLAR.find(id => !qatorYozildimi(h, id));
  const joriyK = tahrirK || birinchiBosh || (!pastkiOk ? 'pastki' : null);
  const sanalmaganSoni = QATOR_IDLAR.filter(id => qatorSanalmagan(h, id)).length;
  const javobYoz = (patch = {}) => onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'Metrika hisoboti', pastki, pastkiOk, n, solved: n >= 4, picked: true, correct: tayyorRef.current, ...patch });
  const yoz = (id, qiymat, el) => {
    const d = hisobotYoz({ [id]: qiymat });
    setH(d); setYangi(id);
    uch(el || kartaRef.current, qRefs[id], tr(QATOR_NOM[id]));
    if (tahrirK) setTahrirK(null);
    const nn = QATOR_IDLAR.filter(x => qatorYozildimi(d, x)).length;
    const tayyor = reportTayyor(d);
    const yangiTayyor = tayyor && !tayyorRef.current;
    if (yangiTayyor) tayyorRef.current = true;
    javobYoz({ n: nn, solved: nn >= 4, correct: tayyorRef.current });
    if (nn >= 4 && live && live.mode === 'student' && !(storedAnswer && storedAnswer.solved)) live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    if (nn >= 4 && QATOR_IDLAR.some(x => qatorSanalmagan(d, x))) jonliBelgi(live, ZONA_2, screen);
  };
  const pastkiSaqla = (p) => { setPastki(p); setPastkiOk(true); setYangi('pastki'); if (tahrirK) setTahrirK(null); javobYoz({ pastki: p, pastkiOk: true }); };
  const varaq = isMentor
    ? <MentorVaraq />
    : <HisobotVaraq nom={ctx.nom || tr({ uz: 'mahsulot nomi', ru: "название продукта" })} nomKulrang={!ctx.nom} qRefs={qRefs}
        atama={tr({ uz: 'metrika hisoboti', ru: "отчёт по метрикам" })}
        qatorlar={oquvchiQatorlar(h, { joriy: joriyK, yangi, trek: ctx.trek })} pastki={oquvchiPastki(pastki, nomlar.map(x => x.yoz || tr(x.mentor)), ctx.trek)}
        onTahrir={!joriyK ? (id) => setTahrirK(id) : undefined} />;
  const sarlavhaK = (id) => (tahrirK ? tr({ uz: 'Tahrirlash', ru: "Редактирование" }) : `${QATOR_IDLAR.indexOf(id) + 1} / 4`);
  const karta = !isMentor && joriyK && (joriyK === 'pastki'
    ? <PastkiKarta key={'pastki' + (tahrirK ? 't' : '')} p0={pastki} nomlar={nomlar} trek={ctx.trek} kRef={kartaRef} onSaqla={pastkiSaqla} />
    : <QatorKarta key={joriyK + (tahrirK ? '-t' : '')} id={joriyK} h={h} reja={ctx.reja} prd={ctx.prd} trek={ctx.trek} kRef={kartaRef} sarlavha={sarlavhaK(joriyK)}
        onSaqla={yoz} onSanalmagan={yoz} />);
  const xulosa = !joriyK && n >= 4 && (sanalmaganSoni === 0
    ? tr({ uz: 'Hisobotingiz tayyor: har son yonida manba va sana bor.', ru: "Ваш отчёт готов: рядом с каждым числом есть источник и дата." })
    : tr({ uz: `Hisobot yozildi: ${sanalmaganSoni} ta qator hali sanalmagan — halol belgilandi, uyda sanaysiz.`, ru: `Отчёт написан: не посчитано строк — ${sanalmaganSoni}. Это честно отмечено, посчитаете дома.` }));
  const s9Bajarildi = !!(h.royxat && h.royxat.manba === 'Database' && Array.isArray(h.kunlar) && h.kunlar.length);
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · metrika hisoboti', ru: "Самостоятельная работа · отчёт по метрикам" })} screen={screen} scrollSignal={n * 10 + (joriyK ? QATOR_IDLAR.indexOf(joriyK) + 2 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={n < 4 && !isMentor} label={n >= 4 || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${4 - n} ta qator yozing`, ru: `Осталось написать строк: ${4 - n}` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Metrika hisobotingizni <A>qatorma-qator yozing.</A></>, ru: <>Напишите свой отчёт по метрикам <A>строка за строкой.</A></> })}
        mentor={<Mentor>{s9Bajarildi || isMentor
          ? tr({ uz: "Birinchi qator SQL'dan keldi — qolganini sanoq sahifasi, Database va Umami'dan bittalab yozing.", ru: "Первая строка пришла из SQL — остальные впишите по одной со страницы подсчёта, из Database и Umami." })
          : tr({ uz: 'Birinchi qatordan boshlang: sonni sanoq sahifasidan yozing.', ru: "Начните с первой строки: впишите число со страницы подсчёта." })}</Mentor>}
        qadamlar={!isMentor && <HisobotStrip h={h} sRef={stripRef} />}
        forma={isMentor
          ? <div className="uc-fokus">{varaq}</div>
          : !joriyK
            ? <div className="uc-fokus">{varaq}{xulosa && <QXulosa>{xulosa}</QXulosa>}</div>
            : <div className="uc-split uc-split-v">{varaq}{karta}</div>}
      >
        <MentorPracticeStats live={live} screen={screen} sanoq={[{ y: { uz: "To'rt qatorni yozganlar", ru: "Написали четыре строки" }, zona: PRACTICE_BASE }, { y: { uz: 'Sanalmagan qatori borlar', ru: "Есть непосчитанная строка" }, zona: ZONA_2 }]} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};


// ===== SCREEN 11 — TEKSHIRUV VA ZAXIRA REJA (QMustaqil, juftlik + yakka rejim — LiveGate; 3 savol, so'ng shartli zaxira reja — P-008) · yozadi tekshiruv, tuzatishQator, zaxira · nishon reportChecked =====
const S11_XATO = {
  bogin: { uz: "Bitta bo'g'inni tanlang — sonlarga qarab.", ru: "Выберите одно звено — по числам." },
  dalil: { uz: 'Qaysi son yoki fakt buni ko\'rsatadi? Bir qatorda yozing.', ru: "Какое число или факт это показывает? Напишите в одной строке." },
  shakl: { uz: 'Gipoteza shakli: «Agar …, …, chunki …».', ru: "Форма гипотезы: «Если …, …, потому что …»." },
  ish: { uz: 'Bir haftada nima qilasiz? Bitta ish yozing.', ru: "Что сделаете за неделю? Напишите одно дело." },
  sovga: { uz: "Sovg'a va soxta akkaunt bilan odam yig'ilmaydi.", ru: "Подарками и фейковыми аккаунтами людей не собирают." }
};
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normS = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const SOVGA_RE = /sovg'a|soxta|sotib ol/;
const s11Qator = (si, h) => {
  const yoz = (id) => qatorYozildimi(h, id) && !qatorSanalmagan(h, id);
  if (si === 1) return 'royxat';
  if (si === 0) return QATOR_IDLAR.find(id => yoz(id) && (id === 'qaytgan' ? !(h.qaytgan.manba && h.qaytgan.sana) : !(h[id].manba && h[id].sana))) || QATOR_IDLAR.find(id => !qatorYozildimi(h, id)) || 'royxat';
  return ['royxat', 'asosiy'].find(id => yoz(id) && h[id].oldin == null) || 'royxat';
};
const ZaxiraBlok = ({ z, n, yangi, zRef }) => {
  const g = z && BOGINLAR.find(b => b.id === z.boginda);
  const qator = [
    g && { y: { uz: "qaysi bo'g'inda kam", ru: "в каком звене мало" }, m: `${tr(g.nom)}: ${z.dalil}` },
    { y: { uz: 'gipoteza', ru: "гипотеза" }, m: z && z.gipoteza },
    { y: { uz: 'bir haftalik ish', ru: "дело на неделю" }, m: z && z.ish }
  ];
  return (
    <div className="uc-zaxira" ref={zRef}>
      <span className="uc-zaxira-h">{tr({ uz: 'Zaxira reja', ru: "Запасной план" })}</span>
      <ol className="uc-reja-ro">{qator.map((q, i) => (i < n && q && q.m
        ? <li key={i} className={cxx('bor', yangi === i && 'yangi')}><em>{tr(q.y)}</em><span>{q.m}</span></li>
        : <li key={i} className="joy"><i>{i + 1}</i></li>))}</ol>
    </div>
  );
};
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, answers }) => {
  const { live, isStudent, isMentor } = useJonli();
  const juft = isStudent;
  const s = storedAnswer || {};
  const [h, setH] = useState(() => hisobotOl());
  const [ctx] = useState(() => ({ reja: lsO(REJA_KEY), prd: lsO(PRD_KEY), trek: trekOl(), nom: goyaNomi(lsO(FINAL_KEY)), qd: lsO(QADAM_KEY), kanal: lsO(KANAL_KEY) }));
  const pastki = (answers && answers[10] && answers[10].pastki) || null;
  const nomlar = useMemo(() => qadamNomlari(ctx.qd).map(x => x.yoz || tr(x.mentor)), [ctx.qd]);
  const [jav, setJav] = useState(() => (Array.isArray(s.jav) ? s.jav : [null, null, null]));
  const [tuzQ, setTuzQ] = useState(s.tuzQ || null);
  const [tuzK, setTuzK] = useState(null);
  const [natijaT, setNatijaT] = useState(s.natijaT || null);
  const [zaxiraOch, setZaxiraOch] = useState(!!s.zaxiraOch);
  const [zi, setZi] = useState(() => (h.zaxira ? 3 : (s.zi || 0)));
  const [z, setZ] = useState(() => h.zaxira || { boginda: null, dalil: '', gipoteza: '', ish: '' });
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [xavf, setXavf] = useState(false);
  const [yangiZ, setYangiZ] = useYangi(1200);
  const [yangiQ, setYangiQ] = useYangi(1200);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null), zRef = useRef(null), qRefs = useRef({}).current;
  const si = jav.findIndex(x => x === null);
  const savolDone = si === -1;
  const kerak = !(h.royxat && h.royxat.soni != null) || Number(h.royxat.soni) < 50;
  const zaxiraFaol = savolDone && (kerak || zaxiraOch);
  const zaxiraDone = zi >= 3;
  const hammasi = savolDone && (zaxiraDone || (!kerak && !zaxiraOch));
  const javobYoz = (patch = {}) => onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'Tekshiruv va zaxira reja', jav, tuzQ, natijaT, zaxiraOch, zi, solved: savolDone, picked: true, correct: savolDone, ...patch });
  // 3/3 → muhr; natija kalitga (tayanch 8): tekshiruv · tuzatishQator; zaxira hali yozilmagan bo'lsa — null
  const yakunla = (j, tq) => {
    const t = j.includes('uyda') ? 'tuzatish' : juft ? 'qabul' : 'topilmadi';
    setNatijaT(t);
    const d = hisobotYoz({ tekshiruv: t, tuzatishQator: t === 'tuzatish' ? tq : null, zaxira: hisobotOl().zaxira || null });
    setH(d);
    javobYoz({ jav: j, tuzQ: tq, natijaT: t, solved: true, correct: true });
    if (live && live.mode === 'student' && !(storedAnswer && storedAnswer.solved)) live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    jonliBelgi(live, ZONA_2, screen, t === 'qabul' ? 0 : t === 'tuzatish' ? 1 + Math.max(0, QATOR_IDLAR.indexOf(tq)) : 9); // 0 qabul · 1–4 tuzatish qatori · 9 topilmadi
  };
  const javob = (v, tq) => {
    if (savolDone) return;
    const j = jav.map((x, i) => (i === si ? v : x));
    const q = tq !== undefined ? tq : tuzQ;
    setJav(j); setTuzK(null);
    if (tq !== undefined) setTuzQ(tq);
    if (j.every(x => x !== null)) yakunla(j, q); else javobYoz({ jav: j, tuzQ: q });
  };
  const tuzatSaqla = (id, qiymat, el) => {
    const d = hisobotYoz({ [id]: qiymat });
    setH(d); setYangiQ(id); setTuzK(null);
    uch(el || kartaRef.current, qRefs[id], tr(QATOR_NOM[id]));
  };
  const dalilK = (qid, k) => {
    const ok = (n) => jav[n] === 'ha';
    if ((ok(0) && (k === 'manba' || k === 'sana')) || (ok(1) && qid === 'royxat' && k === 'izoh') || (ok(2) && k === 'oldin')) return 'ok';
    if (!savolDone && !tuzK && TEKSHIRUV_SAVOLLAR[si].dalil.includes(k) && (si !== 1 || qid === 'royxat')) return 'halqa';
    return null;
  };
  // Zaxira kartalari (bittadan; SABOQ 29)
  const zSaqla = () => {
    if (zi === 0) {
      if (!z.boginda) { setXato('bogin'); return; }
      if (!String(z.dalil).trim()) { setXato('dalil'); return; }
    }
    if (zi === 1) {
      const g = normS(z.gipoteza);
      const imzo = 'g|' + g;
      if (!(/(^|[^a-z'])agar(?![a-z'])/.test(g) && /(^|[^a-z'])chunki(?![a-z'])/.test(g)) && yumshoq !== imzo) { setXato('shakl'); setYumshoq(imzo); return; }
    }
    if (zi === 2) {
      const t = normS(z.ish);
      if (!t) { setXato('ish'); return; }
      const imzo = 'i|' + t;
      if (SOVGA_RE.test(t) && yumshoq !== imzo) { setXato('sovga'); setYumshoq(imzo); return; }
    }
    const matn = zi === 0 ? tr(BOGINLAR.find(b => b.id === z.boginda).nom) : zi === 1 ? tr({ uz: 'gipoteza', ru: "гипотеза" }) : tr({ uz: 'bir haftalik ish', ru: "дело на неделю" });
    uch(kartaRef.current, zRef.current, matn);
    setXato(null); setYumshoq(null); setYordam(false); setYangiZ(zi);
    const n = zi + 1;
    setZi(n);
    if (n >= 3) {
      const zx = { boginda: z.boginda, dalil: String(z.dalil).trim(), gipoteza: String(z.gipoteza).trim(), ish: String(z.ish).trim() };
      setH(hisobotYoz({ zaxira: zx }));
      jonliBelgi(live, ZONA_3, screen, Math.max(0, BOGINLAR.findIndex(b => b.id === z.boginda)));
    }
    javobYoz({ zi: n });
  };
  const muhr = natijaT && { tur: natijaT, matn: natijaT === 'qabul' ? tr({ uz: 'Qabul', ru: "Принять" }) : natijaT === 'topilmadi' ? tr({ uz: 'Tuzatish topilmadi', ru: "Исправлять нечего" }) : tr({ uz: `Tuzatish: ${tr(QATOR_NOM[tuzQ] || QATOR_NOM.royxat)}`, ru: `Исправить: ${tr(QATOR_NOM[tuzQ] || QATOR_NOM.royxat)}` }) };
  const varaq = isMentor
    ? <MentorVaraq muhr />
    : <HisobotVaraq nom={ctx.nom || tr({ uz: 'mahsulot nomi', ru: "название продукта" })} nomKulrang={!ctx.nom} qRefs={qRefs}
        atama={tr({ uz: 'metrika hisoboti', ru: "отчёт по метрикам" })}
        qatorlar={oquvchiQatorlar(h, { trek: ctx.trek, yangi: yangiQ, tuzatish: tuzQ ? [tuzQ] : [] })} pastki={oquvchiPastki(pastki, nomlar, ctx.trek)}
        dalil={dalilK} muhrJoy muhr={muhr}
        muhrOst={natijaT !== 'tuzatish' ? tr({ uz: 'Qabul — bugungi tekshiruv natijasi: sonlar keyin yangilanadi.', ru: "Ответ «принять» — итог сегодняшней проверки: числа потом обновятся." }) : null}
        zaxira={zaxiraFaol && <ZaxiraBlok z={z} n={Math.min(zi, 3)} yangi={yangiZ} zRef={zRef} />} />;
  // Bo'g'in yorliqlari ostida o'quvchining sonlari (birligi bilan)
  const kanallar = ctx.kanal && Array.isArray(ctx.kanal.kanallar) ? ctx.kanal.kanallar.map(k => String((k && k.nom) || '').trim()).filter(Boolean) : [];
  const bSon = {
    kanal: kanallar.length ? kanallar.join(', ') + (ctx.kanal.yuborildi ? ' · ' + tr({ uz: 'yuborildi', ru: "отправлено" }) : '') : '—',
    lending: pastki && pastki.lending && (pastki.lending.tashrif || pastki.lending.bosish) ? tr({ uz: `tashrif ${pastki.lending.tashrif || '—'} · tugma ${pastki.lending.bosish || '—'}`, ru: `посещения ${pastki.lending.tashrif || '—'} · кнопка ${pastki.lending.bosish || '—'}` }) : '—',
    royxat: pastki && pastki.qadamlar && (pastki.qadamlar[0] || pastki.qadamlar[1]) ? `${nomlar[0]} ${pastki.qadamlar[0] || '—'} · ${nomlar[1] || ''} ${pastki.qadamlar[1] || '—'} · ${tr(birlikQ(ctx.trek))}` : '—',
    asosiy: h.royxat && h.royxat.soni != null ? tr({ uz: `ro'yxatdan o'tgan ${h.royxat.soni} · asosiy harakatni qilgan ${h.asosiy && h.asosiy.soni != null ? h.asosiy.soni : '—'} · hisob`, ru: `зарегистрировались ${h.royxat.soni} · сделали основное действие ${h.asosiy && h.asosiy.soni != null ? h.asosiy.soni : '—'} · аккаунт` }) : '—'
  };
  const chiqarildi = !!(ctx.qd && ctx.qd.chiqarildi);
  const vaqt = ctx.qd && ctx.qd.chiqarildiVaqt ? String(ctx.qd.chiqarildiVaqt) : null;
  const savolKarta = !savolDone && !tuzK && (
    <div key={'s' + si} ref={kartaRef} className="uc-karta uc-kirish">
      <span className="q-yorliq">{tr({ uz: 'Mentor tekshiruvi', ru: "Проверка Ментора" })} · {si + 1} / 3</span>
      <b className="uc-karta-nom">{tr(TEKSHIRUV_SAVOLLAR[si].savol)}</b>
      <p className="uc-qarang"><span>{tr({ uz: 'Nimaga qarang', ru: "На что смотреть" })}:</span> {tr(TEKSHIRUV_SAVOLLAR[si].qarang11)}</p>
      <div className="uc-javoblar uc-chorla">
        <button type="button" className="uc-javob" onClick={() => javob('ha')}>{tr({ uz: 'Ha', ru: "Да" })}</button>
        <button type="button" className="uc-javob" onClick={() => { setTuzK(s11Qator(si, h)); }}>{tr({ uz: "Yo'q — tuzataman", ru: "Нет — исправлю" })}</button>
      </div>
      <span className="uc-kulrang">{tr({ uz: '50 ga yetmaslik — tuzatish sababi emas.', ru: "Не дойти до 50 — не повод исправлять." })}</span>
    </div>
  );
  const tuzKarta = !savolDone && tuzK && (
    <QatorKarta key={'t' + tuzK + si} id={tuzK} h={h} reja={ctx.reja} prd={ctx.prd} trek={ctx.trek} kRef={kartaRef}
      sarlavha={`${tr(TEKSHIRUV_SAVOLLAR[si].savol)} · ${tr({ uz: 'tuzatish', ru: "исправление" })}`}
      onSaqla={tuzatSaqla} onSanalmagan={tuzatSaqla} uyda onUyda={() => javob('uyda', tuzK)} />
  );
  const B = BOGINLAR.find(b => b.id === z.boginda);
  const zKarta = zaxiraFaol && !zaxiraDone && (
    <div key={'z' + zi} ref={kartaRef} className={cxx('uc-karta', 'uc-kirish', xato && 'err')}>
      <span className="q-yorliq">{tr({ uz: 'Zaxira reja', ru: "Запасной план" })} · {zi + 1} / 3</span>
      {zi === 0 && <>
        <b className="uc-karta-nom">{tr({ uz: "Qaysi bo'g'inda odam kam?", ru: "В каком звене мало людей?" })}</b>
        <div className={cxx('uc-boginlar-t', !z.boginda && 'uc-chorla')}>
          {BOGINLAR.map(g => (
            <button key={g.id} type="button" className={cxx('uc-tanlov', z.boginda === g.id && 'on')} onClick={() => { setZ(x => ({ ...x, boginda: g.id })); setXato(null); }}>
              <b>{tr(g.nom)}</b><span>{bSon[g.id]}</span>
              {g.id === 'royxat' && ctx.trek === 'web' && <em>{tr({ uz: "web-trekda — saytni ochib ro'yxatdan o'tish", ru: "в веб-треке — открыть сайт и зарегистрироваться" })}</em>}
              {g.id === 'royxat' && chiqarildi && <em>{tr({ uz: "8-darsda tuzatish chiqargansiz — undan keyin kelgan qurilmalarni alohida sanash mumkin (Yordam).", ru: "В 8-м уроке вы выпустили исправление — устройства, пришедшие после него, можно посчитать отдельно (Подсказка)." })}</em>}
            </button>
          ))}
        </div>
        <span className="uc-kulrang">{tr({ uz: "Bo'g'inlarning birligi har xil: sonlari solishtirilmaydi — har birining ichiga qaraladi.", ru: "У звеньев разные единицы: их числа не сравнивают — смотрят внутрь каждого." })}</span>
        <Maydon y="1" keng value={z.dalil} max={120} err={xato === 'dalil'} halqa={!!z.boginda && !String(z.dalil).trim()} onChange={(v) => { setZ(x => ({ ...x, dalil: v })); setXato(null); }} onEnter={zSaqla} ph={tr({ uz: 'Qaysi son yoki fakt buni ko\'rsatadi?', ru: "Какое число или факт это показывает?" })} />
      </>}
      {zi === 1 && <>
        <b className="uc-karta-nom">{tr({ uz: 'Gipoteza', ru: "Гипотеза" })}</b>
        {B && <span className="uc-kulrang">{tr(B.nom)}: {z.dalil}</span>}
        <Maydon y="2" keng value={z.gipoteza} max={200} err={xato === 'shakl'} halqa={!String(z.gipoteza).trim()} onChange={(v) => { setZ(x => ({ ...x, gipoteza: v })); setXato(null); }} onEnter={zSaqla} ph={tr({ uz: 'Agar …, …, chunki …', ru: 'Если …, …, потому что …' })} />
      </>}
      {zi === 2 && <>
        <b className="uc-karta-nom">{tr({ uz: 'Bir haftada bajariladigan bitta ish', ru: "Одно дело на неделю" })}</b>
        <Maydon y="3" keng value={z.ish} max={160} err={xato === 'ish' || xato === 'sovga'} halqa={!String(z.ish).trim()} onChange={(v) => { setZ(x => ({ ...x, ish: v })); setXato(null); }} onEnter={zSaqla} ph={tr({ uz: 'Nima qilasiz?', ru: "Что сделаете?" })} />
        {z.boginda === 'kanal' && <button type="button" className="uc-ochgich" aria-expanded={xavf} onClick={() => setXavf(o => !o)}>{xavf ? '▾' : '▸'} {tr({ uz: 'Post yozsangiz — 6-darsdagi xavfsizlik ro\'yxati', ru: "Если напишете пост — список безопасности из 6-го урока" })}</button>}
        {z.boginda === 'kanal' && xavf && <ol className="uc-xavf fade-step">{XAVFSIZLIK.bandlar.map((b, i) => <li key={i}><i>{i + 1}</i><span>{tr(b)}</span></li>)}<li className="ost"><span>{tr(XAVFSIZLIK.ostQator)}</span></li></ol>}
      </>}
      {xato && <QXato>{tr(S11_XATO[xato])}</QXato>}
      {xato && (xato === 'shakl' || xato === 'sovga') && <span className="uc-kulrang">{tr({ uz: 'Shunday qoldirsangiz — yana «Saqlash»ni bosing.', ru: "Если оставить так — снова нажмите «Сохранить»." })}</span>}
      {yordam && <div className="uc-yordam fade-step">
        <QIzoh>{tr(MENTOR_ZAXIRA.sabab)}</QIzoh>
        <QIzoh>{tr(MENTOR_ZAXIRA.gipoteza)}</QIzoh>
        <QIzoh>{tr({ uz: "E'lon berilgach ilovada «Havolani ulashish» tugmasi.", ru: "Кнопка «Поделиться ссылкой» в приложении после объявления." })}</QIzoh>
        {z.boginda === 'royxat' && chiqarildi && <>
          <QIzoh>{tr({ uz: 'Agentga:', ru: "Агенту:" })}</QIzoh>
          <QPrompt til={__lang} satrlar={[
            tr({ uz: 'Neon SQL Editor uchun bitta `SELECT` yoz, o\'zing ishga tushirma:', ru: "Напиши один `SELECT` для Neon SQL Editor, сам не запускай:" }),
            tr({ uz: `\`hodisalar\` da birinchi \`ochdi\` yozuvi ${vaqt || '{tuzatish chiqqan vaqt}'} dan keyin bo'lgan turli qurilmalar soni va ulardan ro'yxatdan o'tgan qadami borlari soni.`, ru: `число разных устройств, у которых первая запись \`ochdi\` в \`hodisalar\` — после ${vaqt || '{время выхода исправления}'}, и сколько из них имеют шаг регистрации.` }),
            tr({ uz: "Natijada faqat ikki son. Jadvallarni o'zgartirma.", ru: "В результате только два числа. Таблицы не меняй." })
          ]} />
          <QIzoh>{tr({ uz: 'Mentor misolida: 15 qurilmadan 11 tasi — kam son: farq bor, lekin bu isbot emas.', ru: "В примере Ментора: 11 из 15 устройств — мало: разница есть, но это не доказательство." })}</QIzoh>
        </>}
      </div>}
      <div className="uc-karta-tug">
        <QTugma className={cxx(((zi === 0 && z.boginda && String(z.dalil).trim()) || (zi === 1 && String(z.gipoteza).trim()) || (zi === 2 && String(z.ish).trim())) && 'uc-halqa')} onClick={zSaqla}>{tr({ uz: 'Saqlash', ru: "Сохранить" })}</QTugma>
        <QTugma ikkinchi className="uc-yordam-t" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
      </div>
      <span className="uc-kulrang">{tr({ uz: "Soxta akkaunt, o'zingiz qayta ro'yxatdan o'tish va sovg'a va'dasi — yo'q.", ru: "Фейковые аккаунты, своя повторная регистрация и обещание подарков — нет." })}</span>
    </div>
  );
  const yetdiKarta = savolDone && !kerak && !zaxiraOch && !isMentor && (
    <div className="uc-karta uc-kirish">
      <b className="uc-karta-nom">{tr({ uz: '50 ga yetdingiz — zaxira reja shart emas.', ru: "Вы дошли до 50 — запасной план не обязателен." })}</b>
      <div className="uc-karta-tug chap"><QTugma ikkinchi onClick={() => { setZaxiraOch(true); javobYoz({ zaxiraOch: true }); }}>{tr({ uz: 'Baribir bitta ish yozaman', ru: "Всё равно напишу одно дело" })}</QTugma></div>
    </div>
  );
  const ongKarta = savolKarta || tuzKarta || zKarta;
  const xulosa = savolDone && (natijaT === 'tuzatish'
    ? tr({ uz: `Tuzatish: ${tr(QATOR_NOM[tuzQ] || QATOR_NOM.royxat)} qatori. Uni uyda tuzatasiz.`, ru: `Исправить: строка «${tr(QATOR_NOM[tuzQ] || QATOR_NOM.royxat)}». Исправите её дома.` })
    : zaxiraDone ? tr({ uz: 'Hisobotingiz tekshirildi, zaxira reja yozildi: bir haftada — bitta ish.', ru: "Ваш отчёт проверен, запасной план написан: на неделю — одно дело." })
      : !kerak ? tr({ uz: "Hisobotingiz tekshirildi: ro'yxatdan o'tganlar 50 ga yetdi.", ru: "Ваш отчёт проверен: зарегистрировавшихся уже 50." }) : null);
  const joriyQ = savolDone ? (zaxiraFaol && !zaxiraDone ? 3 : undefined) : si;
  const qadamlar = [...TEKSHIRUV_SAVOLLAR.map(q => tr(q.savol)), ...(kerak || zaxiraOch ? [tr({ uz: 'Zaxira reja', ru: "Запасной план" })] : [])];
  const javobSoni = jav.filter(x => x !== null).length;
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish', ru: "Работа в паре" }) : tr({ uz: 'Mustaqil ish', ru: "Самостоятельная работа" })} screen={screen} scrollSignal={javobSoni * 10 + zi + (tuzK ? 5 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!savolDone && !isMentor} label={savolDone || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Savollarni bering', ru: "Задайте вопросы" })} (${javobSoni}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Hisobotingiz tekshiruvdan <A>o'tadimi?</A></>, ru: <>Пройдёт ли ваш отчёт <A>проверку?</A></> })}
        mentor={<Mentor>{zaxiraFaol && !zaxiraDone
          ? tr({ uz: 'Endi zaxira reja: avval sonlaringizga qarab, odam qayerda kam ekanini tanlang.', ru: "Теперь запасной план: сначала по своим числам выберите, где людей мало." })
          : juft ? tr({ uz: 'Sherigingiz hisobotingizni o\'qib, savollarni birma-bir beradi — javobni birga belgilang.', ru: "Партнёр читает ваш отчёт и задаёт вопросы по одному — отмечайте ответ вместе." })
            : tr({ uz: 'Savollarni o\'zingizga bering va javobini hisobotdan toping.', ru: "Задайте вопросы себе и найдите ответ в отчёте." })}</Mentor>}
        qadamlar={!isMentor && !hammasi && <QQadamlar qadamlar={qadamlar} joriy={joriyQ} />}
        forma={isMentor
          ? <div className="uc-fokus">{varaq}</div>
          : (savolDone && zaxiraDone) || (!ongKarta && !yetdiKarta)
            ? <div className="uc-fokus">{varaq}{xulosa && <QXulosa>{xulosa}</QXulosa>}</div>
            : <div className="uc-split uc-split-v">{varaq}<div className="uc-ong">{yetdiKarta && xulosa && <QXulosa>{xulosa}</QXulosa>}{ongKarta || yetdiKarta}</div></div>}
      >
        <MentorPracticeStats live={live} screen={screen} sanoq={[{ y: { uz: 'Qabul', ru: "Принять" }, zona: ZONA_2, shart: r => r.picked === 0 }, { y: { uz: 'Tuzatish', ru: "Исправить" }, zona: ZONA_2, qiymat: (rows) => { const t = rows.filter(r => r.picked >= 1 && r.picked <= 4); const q = QATOR_IDLAR.map((id, i) => [id, t.filter(r => r.picked === i + 1).length]).filter(x => x[1]); return `${t.length}${q.length ? ` (${q.map(x => `${tr(QATOR_NOM[x[0]])} ${x[1]}`).join(' · ')})` : ''}`; } }, { y: { uz: 'Zaxira reja yozganlar', ru: "Написали запасной план" }, zona: ZONA_3 }, { y: { uz: "bo'g'inlar bo'yicha", ru: "по звеньям" }, zona: ZONA_3, qiymat: (rows) => BOGINLAR.map((b, i) => `${tr(b.nom)} ${rows.filter(r => r.picked === i).length}`).join(' · ') }]} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; ✔ B, INLINE_KEYS.s12 = 1; scope final; ikkala trekka to'g'ri) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: "Итоговая проверка" })}
    questionText="Sonlaringiz 50 ga yetmadi. Bugun nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Sonlaringiz 50 ga yetmadi. <A>Bugun nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">Ваши числа не дошли до 50. <A>Что сделаете сегодня?</A></h2> })}
    options={[
      { uz: 'Sinfdoshlardan ikkinchi akkaunt so\'rayman', ru: "Попрошу у одноклассников второй аккаунт" },
      { uz: 'Bitta bo\'g\'inni tanlab, bitta ish yozaman', ru: "Выберу одно звено и напишу одно дело" },
      { uz: 'Namuna akkauntlarni ham sanoqqa qo\'shaman', ru: "Добавлю в подсчёт и аккаунты-образцы" },
      { uz: 'Hamma bo\'g\'inni bir haftada birdan tuzataman', ru: "Исправлю все звенья сразу за неделю" }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Son halol qoladi, bir hafta esa bitta bo\'g\'inga ketadi.', ru: "Число остаётся честным, а неделя уходит на одно звено." }}
    explainWrong={{
      0: { uz: 'Ikkinchi akkaunt — bitta odam ikki marta sanaladi.', ru: "Второй аккаунт — один человек посчитан дважды." },
      2: { uz: 'Namuna akkaunt — haqiqiy odammi? Kim sanaladi?', ru: "Аккаунт-образец — настоящий человек? Кого считают?" },
      3: { uz: 'Bir haftaga hammasi sig\'adimi? Rejada nechta ish bor edi?', ru: "Поместится ли всё в неделю? Сколько дел было в плане?" },
      default: { uz: 'Son halol qolsin — keyin qayerda kamligini qidiring.', ru: "Пусть число останется честным — потом ищите, где мало." }
    }}
    vizual={<div className="uc-tviz-q"><RejaKarta n={3} mini /></div>} />
);


// ===== 🏅 BADGES (nishonlar) — to'rttasi ham ish qilingan ekranda (S-034, tekin bonus yo'q; zaxira reja uchun nishon yo'q — u shartli) =====
const ACHIEVEMENTS = {
  evidenceFinder: { icon: '🔎', name: 'Evidence Finder!', desc: { uz: 'Mentor hisobotida uch savolning dalilini birinchi urinishda topdingiz', ru: "С первой попытки нашли в отчёте Ментора доводы для трёх вопросов" } },
  sqlCounter: { icon: '🧮', name: 'SQL Counter!', desc: { uz: "Ro'yxatdan o'tganlarni Database'dan o'zingiz sanadingiz", ru: "Сами посчитали зарегистрировавшихся по Database" } },
  reportReady: { icon: '📋', name: 'Report Ready!', desc: { uz: 'Metrika hisobotingizni yozdingiz: har son yonida manba va sana bor', ru: "Написали свой отчёт по метрикам: рядом с каждым числом источник и дата" } },
  reportChecked: { icon: '✅', name: 'Report Checked!', desc: { uz: 'Hisobotingizni uch savol bilan tekshirdingiz', ru: "Проверили свой отчёт тремя вопросами" } },
};
// Ekran id → nishon: s4 — uch dalil birinchi urinishda (xato bosish bor) · s9 — darvoza birinchi urinishda va kamida bitta qator · s10, s11 — qilingan ish
const ACH_TRIGGERS = { s4: 'evidenceFinder', s9: 'sqlCounter', s10: 'reportReady', s11: 'reportChecked' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 7, 12)
const Q_LABELS = {
  3: { uz: "1 — Har xil o'lchov", ru: "1 — Разные измерения" },
  5: { uz: '2 — Mentor tekshiruvi', ru: "2 — Проверка Ментора" },
  7: { uz: '3 — Qaytganlar foizi', ru: "3 — Процент вернувшихся" },
  12: { uz: '4 — Zaxira reja', ru: "4 — Запасной план" }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning o'z atamalari (MD «Fon so'zlari», R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'hisobot', ru: "отчёт" }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'manba', ru: "источник" }, l: 82, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'qabul', ru: "принять" }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'tuzatish', ru: "исправить" }, l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: "bo'g'in", ru: "звено" }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'gipoteza', ru: "гипотеза" }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: 'SQL', l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
];
// ⚡ Mustahkamlash-jang — 12 savol, ✔ o'rni MD dagidek: A 2·7·9 · B 1·5·12 · C 4·8·11 · D 3·6·10 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: "Mentor hisobotida «ro'yxatdan o'tgan» soni qayerdan olingan?", ru: "Откуда в отчёте Ментора взято число «зарегистрировались»?" }, opts: [{ uz: "Umami'dagi lending tashriflaridan", ru: "Из посещений лендинга в Umami" }, { uz: "Database'dan, namuna akkauntsiz", ru: "Из Database, без аккаунтов-образцов" }, { uz: 'Sinf chatidagi javoblar sonidan', ru: "Из числа ответов в чате класса" }, { uz: 'Lendingdagi tugma bosilishlaridan', ru: "Из нажатий кнопки на лендинге" }], correct: 1 },
  { q: { uz: 'Sanoq sahifasidagi qadamlar nimani sanaydi?', ru: "Что считают шаги на странице подсчёта?" }, opts: [{ uz: 'Har qadamda turli qurilmalarni', ru: "На каждом шаге — разные устройства" }, { uz: 'Har qadamda turli akkauntlarni', ru: "На каждом шаге — разные аккаунты" }, { uz: 'Har qadamda lending tashriflarini', ru: "На каждом шаге — посещения лендинга" }, { uz: 'Har qadamda tugma bosilishlarini', ru: "На каждом шаге — нажатия кнопки" }], correct: 0 },
  { q: { uz: 'Hisobotda sinfdoshlar qanday aytiladi?', ru: "Как в отчёте называют одноклассников?" }, opts: [{ uz: 'Sanalmaydi, chiqarib tashlanadi', ru: "Не считаются, исключаются" }, { uz: 'Birga sanaladi, alohida aytilmaydi', ru: "Считаются вместе, отдельно не называются" }, { uz: 'Faqat sinfdoshlar soni yoziladi', ru: "Пишется только число одноклассников" }, { uz: 'Sanaladi, lekin alohida aytiladi', ru: "Считаются, но называются отдельно" }], correct: 3 },
  { q: { uz: "SQL'dagi `WHERE namuna = false` qatori nima qiladi?", ru: "Что делает строка `WHERE namuna = false` в SQL?" }, opts: [{ uz: 'Faqat sinfdoshlarni qoldiradi', ru: "Оставляет только одноклассников" }, { uz: 'Kunlarni tartib bilan chiqaradi', ru: "Выводит дни по порядку" }, { uz: 'Namuna akkauntlarni sanamaydi', ru: "Не считает аккаунты-образцы" }, { uz: "Ism va loginni yashirib qo'yadi", ru: "Скрывает имя и логин" }], correct: 2 },
  { q: { uz: "SQL'ga `GROUP BY kun` qo'shilsa, Neon nima ko'rsatadi?", ru: "Если добавить в SQL `GROUP BY kun`, что покажет Neon?" }, opts: [{ uz: 'Hamma kunlar uchun bitta son', ru: "Одно число за все дни" }, { uz: 'Har kun uchun alohida son', ru: "Отдельное число за каждый день" }, { uz: 'Faqat bugungi kunning soni', ru: "Только число за сегодня" }, { uz: "Eng ko'p ro'yxat bo'lgan kun", ru: "День с наибольшим числом регистраций" }], correct: 1 },
  { q: { uz: 'Mentor tekshiruvining uchinchi savoli nimaga qaraydi?', ru: "На что смотрит третий вопрос проверки Ментора?" }, opts: [{ uz: '50 maqsadiga qancha qolganiga', ru: "На остаток до цели 50" }, { uz: "Sinfdoshlar soni qancha o'sganiga", ru: "На рост числа одноклассников" }, { uz: 'Lendingdagi tashriflar soniga', ru: "На число посещений лендинга" }, { uz: 'Oldingi son yonida turganiga', ru: "На предыдущее число рядом" }], correct: 3 },
  { q: { uz: 'Hisobotda foydalanuvchilar haqida nima yoziladi?', ru: "Что пишут в отчёте о пользователях?" }, opts: [{ uz: 'Faqat sonlar, ism va loginsiz', ru: "Только числа, без имён и логинов" }, { uz: 'Har bir odamning ismi va sanasi', ru: "Имя и дата каждого человека" }, { uz: 'Sinfdoshlarning ismlari alohida', ru: "Имена одноклассников отдельно" }, { uz: 'Har birining logini va sanasi', ru: "Логин и дата каждого" }], correct: 0 },
  { q: { uz: "Bu voqeada Duolingo'ning asosiy qaytarish mexanikasi qaysi?", ru: "Какая в этой истории основная механика возвращения Duolingo?" }, opts: [{ uz: 'Seriya atrofidagi eslatmalar', ru: "Напоминания вокруг серии" }, { uz: 'Seriya yonidagi «muzlatish»', ru: "«Заморозка» рядом с серией" }, { uz: 'Ketma-ket kunlarning seriyasi', ru: "Серия дней подряд" }, { uz: "Har kuni yangi so'z o'rganish", ru: "Каждый день учить новое слово" }], correct: 2 },
  { q: { uz: "Qaytganlar foizi nimani ko'rsatadi?", ru: "Что показывает процент вернувшихся?" }, opts: [{ uz: 'Bir davrda ochganlardan nechtasi yana ochdi', ru: "Сколько из открывших за период открыли снова" }, { uz: "Haftada nechta yangi odam ro'yxatdan o'tdi", ru: "Сколько новых людей зарегистрировалось за неделю" }, { uz: 'Lendingga kelganlardan nechtasi tugmani bosdi', ru: "Сколько из пришедших на лендинг нажали кнопку" }, { uz: "Ro'yxatdan o'tganlardan nechtasi qo'shildi", ru: "Сколько из зарегистрировавшихся присоединились" }], correct: 0 },
  { q: { uz: 'Zaxira rejada bir haftaga nechta ish yoziladi?', ru: "Сколько дел на неделю пишут в запасном плане?" }, opts: [{ uz: "Har bo'g'inga bittadan ish", ru: "По одному делу на каждое звено" }, { uz: 'Iloji boricha ko\'proq ishlar', ru: "Как можно больше дел" }, { uz: "Ish yo'q, gipotezaning o'zi", ru: "Дел нет, только гипотеза" }, { uz: "Bitta bo'g'inga bitta ish", ru: "Одно дело на одно звено" }], correct: 3 },
  { q: { uz: "Mentor zaxira reja uchun qaysi bo'g'inni tanladi?", ru: "Какое звено Ментор выбрал для запасного плана?" }, opts: [{ uz: 'Lending: tugmani kam bosishgan', ru: "Лендинг: кнопку нажимали мало" }, { uz: "Ro'yxat: ochganlar o'tmagan", ru: "Регистрация: открывшие не прошли" }, { uz: 'Kanal: post ikki joyga yetgan', ru: "Канал: пост дошёл до двух мест" }, { uz: "Asosiy harakat: qo'shilish kam", ru: "Основное действие: мало присоединений" }], correct: 2 },
  { q: { uz: "Lendingga 90 tashrif, tugma 6 marta bosildi. Qaysi bo'g'inda kam?", ru: "На лендинге 90 посещений, кнопку нажали 6 раз. В каком звене мало?" }, opts: [{ uz: 'Kanal: post odamlarga yetib bormagan', ru: "Канал: пост не дошёл до людей" }, { uz: 'Lending: kirganlar tugmani bosmadi', ru: "Лендинг: зашедшие не нажали кнопку" }, { uz: "Ro'yxat: ilovani ochganlar o'tmagan", ru: "Регистрация: открывшие приложение не прошли" }, { uz: "Asosiy harakat: o'yinga qo'shilmagan", ru: "Основное действие: не присоединились к игре" }], correct: 1 },
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
// Qo'shimcha Mentor statistikasi (MD «Mentor statistikasi», F-1006-389; 11-Modul MentorSanoq naqshi).
// Server har zonada o'quvchining BIRINCHI signalini saqlaydi — shuning uchun har holat o'z zonasida: 500 — bajardi (yuqorida), 600 va 700 — ekranga xos holatlar.
const ZONA_2 = 600;
const ZONA_3 = 700;
const _belgilar = new Set();
const jonliBelgi = (live, zona, screen, picked = 0) => {
  if (!live || live.mode !== 'student') return;
  const k = zona + screen;
  if (_belgilar.has(k)) return;
  _belgilar.add(k);
  live.submitAnswer(k, 'mstat', picked, true, 0);
};
// Mentor ko'rinishi sloti — "kim bajardi" jonli chiplar paneli. JONLI roli to'ldiradi.
// sanoq — [{ y: { uz, ru }, zona, shart?, qiymat? }] yorliqli sonlar · chip — { zona, t: (qator) => matn, toliq?: (qator) => bool } o'quvchi yonidagi qisqa son
const MentorPracticeStats = ({ live, screen, sanoq, chip }) => {
  const zonalar = [...new Set([...(sanoq || []).map(s => s.zona), ...(chip ? [chip.zona] : [])].filter(z => z !== PRACTICE_BASE))];
  const [data, setData] = useState({ players: null, rows: [], z: {} });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        // Praktika signali 500+ zonasida (test <100, arena 100+ bilan to'qnashmaydi)
        const [players, rows, ...qolgan] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen), ...zonalar.map(z => liveAnswers(live.pin, z + screen))]);
        if (on) setData({ players, rows, z: Object.fromEntries(zonalar.map((z, i) => [z, qolgan[i]])) });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, screen]); // eslint-disable-line
  if (!live || live.mode !== 'mentor') return null;
  const players = data.players || [];
  const qatorlar = (z) => (z === PRACTICE_BASE ? data.rows : data.z[z] || []);
  const doneIds = new Set(data.rows.map(r => r.player_id));
  const sonOl = (s) => new Set(qatorlar(s.zona).filter(r => !s.shart || s.shart(r)).map(r => r.player_id)).size;
  const chipM = chip ? new Map(qatorlar(chip.zona).map(r => [r.player_id, r])) : null;
  const chipT = (p) => { const r = chipM && chipM.get(p.id); return r ? ` · ${chip.t(r)}` : ''; };
  const toliq = (p) => { const r = chipM && chipM.get(p.id); return !!(r && chip.toliq && chip.toliq(r)); };
  const doers = players.filter(p => doneIds.has(p.id));
  const waiting = players.filter(p => !doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      {sanoq && sanoq.length > 0 && <div className="lp-msanoq">{sanoq.map((s, i) => <div key={i} className="lp-msanoq-q"><b>{data.players === null ? '—' : s.qiymat ? s.qiymat(qatorlar(s.zona)) : `${sonOl(s)} / ${players.length}`}</b><span>{tr(s.y)}</span></div>)}</div>}
      <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink2, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружается…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink2, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не присоединился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className={`mstats-wait-chip${toliq(p) ? ' toliq' : ''}`} style={{ background: T.okFon, color: T.ok }}>✓ {p.nickname}{chipT(p)}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ opacity: 0.6 }}>{p.nickname}{chipT(p)}</span>)}
        </div>
      )}
    </div>
  );
};

// ===== KARTOCHKALAR — alohida ekran, Mentorsiz (SABOQ 12, 16); birinchi bosishgacha karta yuzi halqada (E 49) =====
const KARTOCHKALAR = [
  { front: { uz: 'Bizda metrika hisobotida qaysi to\'rt qator bor?', ru: "Какие четыре строки у нас в отчёте по метрикам?" }, back: { uz: "Ro'yxatdan o'tgan, asosiy harakatni qilgan, bosh raqam va qaytganlar foizi", ru: "Зарегистрировались, сделали основное действие, главное число и процент вернувшихся" } },
  { front: { uz: 'Hisobotdagi har son yonida nima turadi?', ru: "Что стоит рядом с каждым числом в отчёте?" }, back: { uz: 'Manbasi va sanasi', ru: "Источник и дата" } },
  { front: { uz: 'Mentor tekshiruvi qaysi uch savolni beradi?', ru: "Какие три вопроса задаёт проверка Ментора?" }, back: { uz: 'Son qayerdan? Kimlar sanalgan? Oldingi son bormi?', ru: "Откуда число? Кого посчитали? Есть ли предыдущее число?" } },
  { front: { uz: '50 ga yetmagan hisobot tuzatishga qaytadimi?', ru: "Отправляют ли на исправление отчёт, не дошедший до 50?" }, back: { uz: "Yo'q: tekshiruv sonning halolligini ko'radi, kattaligini emas", ru: "Нет: проверка смотрит на честность числа, а не на его величину" } },
  { front: { uz: 'Namuna va tekshiruv akkauntlari sanaladimi?', ru: "Считаются ли аккаунты-образцы и проверочные?" }, back: { uz: "Yo'q — SQL'dagi `namuna = false` ularni chiqarib qo'yadi", ru: "Нет — `namuna = false` в SQL их исключает" } },
  { front: { uz: 'Sinfdoshlar sanaladimi?', ru: "Считаются ли одноклассники?" }, back: { uz: 'Ha, lekin alohida aytiladi', ru: "Да, но называются отдельно" } },
  { front: { uz: "Qadamdagi «qo'shildi» va «asosiy harakatni qilgan» nimasi bilan farq qiladi?", ru: "Чем отличаются шаг «присоединился» и «сделали основное действие»?" }, back: { uz: 'Biri turli qurilmalarni, biri hisoblarni sanaydi — ular ayirilmaydi', ru: "Одно считает разные устройства, другое — аккаунты; их не вычитают" } },
  { front: { uz: "SQL'dagi `GROUP BY kun` nima beradi?", ru: "Что даёт `GROUP BY kun` в SQL?" }, back: { uz: 'Har kun uchun alohida son', ru: "Отдельное число за каждый день" } },
  { front: { uz: "Qaytganlar foizi nimani ko'rsatadi?", ru: "Что показывает процент вернувшихся?" }, back: { uz: 'Bir davrda ochganlardan keyingi davrda ham ochganlari foizini', ru: "Процент открывших и в следующий период среди открывших в первый" } },
  { front: { uz: "Duolingo'da odamlarni har kuni nima qaytaradi?", ru: "Что каждый день возвращает людей в Duolingo?" }, back: { uz: "Seriyani yo'qotib qo'yish qo'rquvi", ru: "Страх потерять серию" } },
  { front: { uz: 'Bizda zaxira reja qaysi uch qatordan iborat?', ru: "Из каких трёх строк у нас состоит запасной план?" }, back: { uz: "Qaysi bo'g'inda odam kam, bitta gipoteza va bir haftada bajariladigan bitta ish", ru: "В каком звене мало людей, одна гипотеза и одно дело на неделю" } },
  { front: { uz: "Mentor qaysi bo'g'inni tanladi va nega?", ru: "Какое звено выбрал Ментор и почему?" }, back: { uz: 'Kanal: post faqat ikki joyga yetdi', ru: "Канал: пост дошёл только до двух мест" } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('uc-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: fmtCode(tr(c.front)), back: fmtCode(tr(c.back)) }))} />
          {!bosildi && <p className="uc-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: "Нажмите на карточку — откроется ответ" })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim uchun · Nechta · Muddat» + ①②③; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: "Для кого" }, v: { uz: 'foydalanuvchilaringiz', ru: "ваши пользователи" } },
  { k: { uz: 'Nechta', ru: "Сколько" }, v: { uz: 'bitta ish', ru: "одно дело" } },
  { k: { uz: 'Muddat', ru: "Срок" }, v: { uz: 'keyingi darsgacha', ru: "до следующего урока" } }
];
const HwCard = ({ keyingi }) => (
  <div className="card uc-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: "Что сделаете дома?" })}</div>
    <div className="uc-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="uc-hw-q"><span className="uc-hw-k">{tr(r.k)}</span><span className="uc-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="uc-hw-qadam">
      <li><i>①</i><div>
        <p>{tr({ uz: "Zaxira rejangizdagi ishni bajaring. Ilovada o'zgarish bo'lsa — agentga talab yozing (qayerda · nima qilsin · nima buzilmasin): nima o'zgarishi va foydalanuvchini qayerga olib borishini o'zingiz yozing — agent o'zi tanlamasin. Keyin push qiling; mobil trekda APK o'zi yangilanmaydi — yangi o'rnatish fayli tayyorlanadi va lendingdagi havola almashtiriladi.", ru: "Выполните дело из своего запасного плана. Если меняется приложение — напишите агенту требование (где · что сделать · что не сломать): что изменится и куда это приведёт пользователя — напишите сами, чтобы агент не выбирал. Потом сделайте push; в мобильном треке APK сам не обновится — готовится новый установочный файл, и ссылка на лендинге заменяется." })}</p>
        <p>{tr({ uz: "50 ga yetgan va zaxira reja yozmagan bo'lsangiz — bu band ixtiyoriy: xohlasangiz, hisobotdan yaxshilamoqchi bo'lgan bitta bo'g'inni tanlab, unga bitta ish qiling.", ru: "Если вы дошли до 50 и не писали запасной план — этот пункт по желанию: если хотите, выберите по отчёту одно звено, которое хотите улучшить, и сделайте для него одно дело." })}</p>
        <p className="uc-hw-iz">{fmtCode(tr({ uz: "Mentor misolini ko'rmoqchi bo'lsangiz (majburiy emas): «Havolani ulashish» tugmasi — `git checkout -f m12-dars-10-done` (Mentor repo'si, alohida yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi).", ru: "Если хотите посмотреть пример Ментора (не обязательно): кнопка «Поделиться ссылкой» — `git checkout -f m12-dars-10-done` (репозиторий Ментора, в отдельной новой папке — команда удаляет изменения в папке)." }))}</p>
      </div></li>
      <li><i>②</i><div>
        <p>{tr({ uz: "Ish post yoki xabar bo'lsa — 6-darsdagi olti bandli ro'yxat bilan tekshiring: guruhga — egasidan ruxsat so'rab, ota-onangizga ko'rsatib.", ru: "Если дело — пост или сообщение, проверьте по списку из шести пунктов из 6-го урока: в группу — спросив разрешения владельца, показав родителям." })}</p>
      </div></li>
      <li><i>③</i><div>
        <p>{tr({ uz: "Neon'da sonlarni qayta sanang va hisobotdagi «sanalmagan» qatorlarni sanasi bilan to'ldiring. Bir hafta — kam vaqt: o'sish bo'lmasa ham halol yozing.", ru: "Пересчитайте числа в Neon и заполните в отчёте строки «не посчитано» с датой. Неделя — мало времени: даже без роста пишите честно." })}</p>
      </div></li>
    </ol>
    {keyingi && <span className="uc-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + holatga qarab sarlavha (sinf 1, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
// «Bugungi asosiy fikr», «Sanalmagan qator» yorlig'i va artefakt-strip — ko'rsatilmaydi (E 50)
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
  // «Endi siz bilasiz» — bugungi asosiy fikrni takrorlamaydi (T-048); 1 va 5 — 2 va 8-ekran ta'rifi bilan so'zma-so'z
  const RECAP = [
    { uz: "Bizda metrika hisoboti — to'rt son, har birining manbasi va sanasi bilan.", ru: "У нас отчёт по метрикам — четыре числа, каждое с источником и датой." },
    { uz: 'Mentor tekshiruvi uch savol beradi: son qayerdan, kimlar sanalgan, oldingi son bormi.', ru: "Проверка Ментора задаёт три вопроса: откуда число, кого посчитали, есть ли предыдущее число." },
    { uz: "Qurilma, hisob va tashrif — har xil o'lchov: ular bir-biridan ayirilmaydi.", ru: "Устройство, аккаунт и посещение — разные измерения: их не вычитают друг из друга." },
    { uz: "Odam qaytdimi-yo'qmi — buni qaytganlar foizi ko'rsatadi.", ru: "Вернулся ли человек — показывает процент вернувшихся." },
    { uz: "Bizda zaxira reja uch qator: qaysi bo'g'inda odam kam, bitta gipoteza va bir haftada bajariladigan bitta ish.", ru: "У нас запасной план — три строки: в каком звене мало людей, одна гипотеза и одно дело на неделю." }
  ];
  const h = hisobotOl();
  const yozSoni = QATOR_IDLAR.filter(id => qatorYozildimi(h, id)).length;
  const kerak = !(h.royxat && h.royxat.soni != null) || Number(h.royxat.soni) < 50;
  // Sarlavha holatga qarab va rost (E 54): MD dagi besh holat + hech narsa yozilmagan (MD ga taklif)
  const holat = isMentorL ? 'hammasi'
    : yozSoni === 0 ? 'yoq'
      : yozSoni < 4 ? 'boshlandi'
        : !h.tekshiruv ? 'tekshiruv'
          : h.tekshiruv === 'tuzatish' ? 'tuzatish'
            : (h.zaxira || !kerak) ? 'hammasi' : 'zaxira';
  const SARLAVHA = {
    hammasi: { uz: <>Hisobotingizni yozdingiz va <A>tekshiruvdan o'tkazdingiz.</A></>, ru: <>Вы написали отчёт и <A>прошли проверку.</A></> },
    tuzatish: { uz: <>Hisobot tayyor — <A>bitta tuzatish qoldi.</A></>, ru: <>Отчёт готов — <A>осталось одно исправление.</A></> },
    zaxira: { uz: <>Hisobot tekshirildi — <A>zaxira reja qoldi.</A></>, ru: <>Отчёт проверен — <A>остался запасной план.</A></> },
    tekshiruv: { uz: <>Hisobot tayyor — <A>tekshiruv qoldi.</A></>, ru: <>Отчёт готов — <A>осталась проверка.</A></> },
    boshlandi: { uz: <>Hisobot boshlandi — <A>qolgan qatorlarni yozing.</A></>, ru: <>Отчёт начат — <A>впишите остальные строки.</A></> },
    yoq: { uz: <>Hisobot hali yozilmagan — <A>to'rt qatorni yozing.</A></>, ru: <>Отчёт ещё не написан — <A>впишите четыре строки.</A></> }
  };
  const toliq = holat === 'hammasi';
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Raqamlaringiz pitchni qanday o'zgartiradi?»</b></>, ru: <>Следующий урок — <b>«Как ваши цифры меняют питч?»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: "Итог урока" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('uc-yakun', !toliq && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: "Урок окончен" })}
          togri={correct} jami={total}
          sarlavha={tr(SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard keyingi={keyingi} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(t => ({ ...t, t: tr(t.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};
// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmUsersCheckLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* ikki klassli selektor: keyingi «.zoomable position relative» qoidasi oynani joyidan siljitib, ekran chetidan kesardi (F-1006-386) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        /* ⛶ oynasi ekran markazida: ota-blokdagi animatsiya/transform «position: fixed»ni o'ziga bog'lab, oynani siljitib kesardi (A2 natijasi — F-1006-386) */
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 1199px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .lesson-root .q-ekran > ol.q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .lesson-root .q-mustaqil { max-width: none; }
        /* === DARSNING O'Z VIZUALI — HisobotVaraq (hv-), telefon va dars elementlari (uc-). Faqat qolip tokenlari (D3); brend rangi — faqat nom yorlig'ida === */
        .uc-tviz { margin-top: 4px; }
        .uc-mj { font-weight: 800; font-style: normal; color: ${MJ_RANG}; }
        .uc-duo { font-weight: 800; font-style: normal; color: ${DUO_RANG}; letter-spacing: 0.01em; }
        .uc-teg { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; text-transform: none; letter-spacing: 0; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .uc-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: uc-puls 2.2s ease-out .3s 3; }
        @keyframes uc-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .uc-halqa-i { border-color: ${T.accent} !important; animation: uc-tolqin-i 2.4s ease-in-out 0.4s 3; }
        @keyframes uc-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        /* Variantlar va tanlov chiplari: guruh atrofida ramka yo'q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .uc-s0 { display: contents; }
        .uc-s0.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: uc-chorla-v 1.8s ease-out .5s 2; }
        @keyframes uc-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .uc-s0.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .uc-s0.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .uc-s0.tanlangan .q-variant:not(.on) { display: none; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled), .uc-chorla > .q-chip:not(:disabled), .uc-chorla > .uc-javob, .uc-chorla > .uc-tanlov, .uc-kam { border-color: ${fon(T.accent, 0.6)}; animation: uc-chorla-c 1.8s ease-out .5s 2; }
        @keyframes uc-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .q-bashorat .q-chip:nth-child(2), .uc-chorla > :nth-child(2) { animation-delay: .75s; }
        .q-bashorat .q-chip:nth-child(3), .uc-chorla > :nth-child(3) { animation-delay: 1s; }
        .uc-chorla > :nth-child(4) { animation-delay: 1.25s; } .uc-chorla > :nth-child(5) { animation-delay: 1.5s; }
        .uc-chorla-b { min-width: 0; }
        /* --- Joylashuv --- */
        .lesson-root ol.q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .uc-split { display: grid; grid-template-columns: minmax(180px, 0.62fr) minmax(0, 1.38fr); gap: clamp(16px,2.6vw,28px); align-items: start; }
        .uc-split.uc-split-v { grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); }
        .uc-ong { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .uc-fokus { display: flex; flex-direction: column; align-items: stretch; gap: 12px; width: 100%; max-width: 720px; margin: 0 auto; }
        .uc-tviz-q { display: flex; }
        .uc-uch { position: fixed; z-index: 1200; pointer-events: none; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 4px 10px; white-space: nowrap; max-width: 260px; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); animation: uc-uch .8s cubic-bezier(.4,0,.2,1) forwards; }
        .uc-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .uc-tx b { color: ${T.ink}; } .uc-tx.ok, .uc-tx.ok b { color: ${T.ok}; } .uc-tx b.yoq { color: ${T.err}; }
        .q-xulosa .uc-x-m { display: block; }
        .q-xulosa .uc-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .uc-bashq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 9px 14px; border-radius: 12px; background: ${T.accentSoft}; font-size: 13px; color: ${T.ink2}; }
        .uc-bashq-t b { color: ${T.accent}; }
        .uc-atama-y, .hv-atama { display: inline-block; font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 11px; }
        p.uc-ipucha { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .uc-kulrang { display: block; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .uc-kulrang.uc-kichik { font-size: 12px; }
        .uc-kulrang .qcode, .uc-kulrang code { white-space: normal; overflow-wrap: anywhere; }
        /* --- HisobotVaraq: oq varaq, bitta ustun; rangli yon chiziq yo'q --- */
        .hv { position: relative; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 14px 16px 12px; box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 8px; min-width: 0; width: 100%; animation: uc-kir .45s ease-out both; }
        .hv-bosh { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; min-height: 30px; }
        .hv-bosh-l { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; min-width: 0; }
        .hv-nom { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .hv-nom.kul { color: ${T.ink2}; font-weight: 600; font-style: italic; }
        .hv-atama { animation: uc-kir .5s ease-out both; }
        .hv-muhr { flex: none; display: inline-flex; align-items: center; justify-content: center; text-align: center; min-width: 64px; height: 64px; padding: 0 8px; border-radius: 50%; font-size: 11.5px; font-weight: 800; line-height: 1.15; }
        .hv-muhr.joy { width: 54px; min-width: 54px; height: 54px; border: 1.5px dashed ${fon(T.ink, 0.25)}; }
        .hv-muhr.bor { border: 2.5px solid currentColor; transform: rotate(-8deg); animation: uc-muhr .6s cubic-bezier(.3,1.5,.5,1) both; }
        .hv-muhr.qabul, .hv-muhr.topilmadi { color: ${T.ok}; background: ${T.okFon}; }
        .hv-muhr.tuzatish { color: ${T.accent}; background: ${T.accentSoft}; }
        .hv-muhr.tuzatish, .hv-muhr.topilmadi { height: auto; min-height: 40px; max-width: 170px; border-radius: 14px; padding: 6px 12px; }
        .hv-muhr.mini { min-width: 0; height: auto; padding: 4px 10px; border-radius: 10px; font-size: 12px; }
        .hv-muhr-ost { font-size: 12px; color: ${T.ink2}; }
        .hv-qatorlar { display: flex; flex-direction: column; gap: 6px; }
        .hv-q { display: grid; grid-template-columns: minmax(0, 1.1fr) auto minmax(0, auto); grid-template-areas: "nom son yor" "izoh izoh izoh" "oldin oldin oldin" "tuz tuz tuz"; gap: 2px 12px; align-items: center; padding: 8px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; text-align: left; font-family: 'Manrope', sans-serif; width: 100%; position: relative; transition: border-color .3s, background .3s; }
        button.hv-q { color: inherit; font: inherit; }
        .hv-q.bos { cursor: pointer; }
        .hv-q.h-yalang { border-style: solid; background: ${T.bg}; }
        .hv-q.h-joriy { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.12)}; animation: uc-tolqin-i 2.4s ease-in-out .3s 3; }
        .hv-q.h-sanalmagan { background: ${T.bg}; }
        .hv-q.h-tuzatish { border-color: ${fon(T.accent, 0.6)}; }
        .hv-q.yangi { animation: uc-yashil 1.1s ease-out both; }
        .hv-q-nom { grid-area: nom; font-size: 13px; font-weight: 700; color: ${T.ink}; min-width: 0; }
        .hv-q-son { grid-area: son; display: inline-flex; align-items: baseline; gap: 4px; white-space: nowrap; }
        .hv-son, .hv-maqsad { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: ${T.ink}; border-radius: 6px; padding: 0 2px; }
        .hv-maqsad { font-size: 13px; color: ${T.ink2}; }
        .hv-birlik { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 6px; margin-left: 4px; }
        .hv-birlik.ajrat { color: ${T.accent}; background: ${T.accentSoft}; animation: uc-kir .5s ease-out .2s both; }
        .hv-sanalmagan { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .hv-q-yor { grid-area: yor; display: inline-flex; flex-wrap: wrap; justify-content: flex-end; gap: 4px; }
        .hv-yor { font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 999px; padding: 2px 8px; white-space: nowrap; }
        .hv-joy { display: inline-block; width: 46px; height: 18px; border-radius: 999px; border: 1.5px dashed ${fon(T.ink, 0.25)}; }
        .hv-joy.kul { border-style: solid; border-color: ${T.line}; background: ${T.bg}; }
        .hv-izoh { grid-area: izoh; font-size: 12px; line-height: 1.4; color: ${T.ink2}; border-radius: 6px; }
        .hv-oldin { grid-area: oldin; font-size: 11.5px; font-weight: 700; color: ${fon(T.ink, 0.55)}; border-radius: 6px; }
        .hv-tuz { grid-area: tuz; display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 700; color: ${T.accent}; }
        .hv-tuz i { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; }
        .hv-q-tah { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; font-size: 12px; line-height: 1; padding: 0; }
        .hv-q:has(.hv-q-tah) { padding-right: 36px; }
        /* Dalil (4, 11-ekran): bosiladigan bo'lak · joriy savolga tegishlisi yumshoq halqada · topilgani yashil · xato — silkinish */
        button.hv-dalil { font-family: 'Manrope', sans-serif; color: inherit; background: none; border: 0; padding: 1px 4px; margin: 0; cursor: pointer; text-align: left; border-radius: 6px; line-height: 1.4; }
        button.hv-dalil.hv-son, button.hv-dalil.hv-maqsad { font-family: 'JetBrains Mono', monospace; }
        button.hv-dalil:hover { background: ${T.accentSoft}; }
        button.hv-yor.hv-dalil { background: ${T.bg}; border: 1px solid ${T.line}; padding: 2px 8px; border-radius: 999px; }
        .hv .halqa { box-shadow: 0 0 0 1.5px ${fon(T.accent, 0.6)}; animation: uc-chorla-c 1.8s ease-out .4s 2; }
        .hv-q .ok, .hv-q button.ok { background: ${T.okFon} !important; color: ${T.ok} !important; border-color: ${fon(T.ok, 0.4)} !important; transition: background .4s; }
        .hv-q .silk { animation: uc-silk .4s ease-in-out; background: ${T.errFon} !important; }
        .hv-pastki { display: flex; flex-direction: column; gap: 4px; padding-top: 6px; border-top: 1px dashed ${T.line}; }
        .hv-past { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; font-size: 12px; color: ${T.ink2}; }
        .hv-past.yangi { animation: uc-sirg .5s ease-out both; }
        .hv-past-s { font-weight: 800; color: ${T.ink}; }
        .hv-past-m { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; }
        .hv-past-a { flex-basis: 100%; font-size: 11.5px; color: ${T.ink2}; padding-left: 10px; border-left: 2px solid ${T.line}; }
        .hv-past-iz { font-size: 11.5px; font-style: italic; }
        .uc-v-bitta { padding: 10px 12px; }
        .uc-v-bitta .hv-bosh { display: none; }
        .uc-v-bitta .hv-q { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "nom son" "yor yor"; }
        .uc-v-bitta .hv-q-yor { justify-content: flex-start; }
        /* --- Telefon (11-Modul ko'rinishi, 170×272 — SABOQ 22) --- */
        .uc-tel { position: relative; width: 170px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 6px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .uc-tel-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; font-size: 12.5px; }
        .uc-tel-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; }
        .uc-tel-sar { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .uc-tel-orqa { font-size: 12px; font-weight: 800; color: ${T.ink}; }
        .uc-tel-kun { margin-top: 4px; font-size: 11px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.05em; }
        .uc-tel-karta { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; color: ${T.ink2}; }
        .uc-tel-karta b { font-size: 12.5px; color: ${T.ink}; }
        .uc-tel-son { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; margin-top: 4px; }
        .uc-doiralar { display: grid; grid-template-columns: repeat(5, 12px); gap: 5px; margin: 4px 0; }
        .uc-doiralar i { width: 12px; height: 12px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .uc-doiralar i.bor { border: 0; background: ${fon(MJ_RANG, 0.75)}; }
        .uc-tel-tug { display: block; text-align: center; font-size: 11.5px; font-weight: 800; padding: 6px 8px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; }
        .uc-tel-tug.uc-ulash { background: ${T.accent}; border-color: ${T.accent}; color: #fff; animation: uc-pop .6s cubic-bezier(.3,1.5,.5,1) .4s both; }
        /* --- 0-ekran: chat pufaklari, kichik varaq --- */
        .uc-hook { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
        .uc-pufak { display: inline-block; max-width: 300px; padding: 8px 12px; border-radius: 14px; font-size: 13px; line-height: 1.35; }
        .uc-pufak-s { background: ${T.bg}; color: ${T.ink2}; border: 1px solid ${T.line}; border-bottom-left-radius: 4px; }
        .uc-pufak-j { align-self: flex-end; background: ${T.accentSoft}; color: ${T.ink}; border-bottom-right-radius: 4px; animation: uc-tush .5s cubic-bezier(.3,1.3,.5,1) both; }
        .uc-hook-q { display: flex; align-items: flex-start; gap: 14px; flex-wrap: wrap; }
        .uc-mini { display: flex; flex-direction: column; gap: 4px; width: 170px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.4); }
        .uc-mini-nom { font-size: 12px; }
        .uc-mini-38 { font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 800; color: ${T.ink}; line-height: 1.1; animation: uc-pop .5s cubic-bezier(.3,1.5,.5,1) .2s both; }
        .uc-mini-q { display: flex; justify-content: space-between; gap: 6px; font-size: 11px; color: ${T.ink2}; animation: uc-kir .4s ease-out both; animation-delay: calc(.4s + var(--i) * .12s); }
        .uc-mini-q b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        .uc-qolgan { display: block; font-size: 12.5px; color: ${fon(T.ink, 0.5)}; margin-top: 2px; }
        /* --- 1-ekran: varaq navbat bilan yoziladi --- */
        .uc-reja { display: flex; }
        .uc-reja-v { max-width: 360px; }
        .uc-rj { animation: uc-kir .45s ease-out both; animation-delay: var(--d, 0s); }
        .uc-reja-q { padding: 9px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .uc-reja-p { font-size: 12px; color: ${T.ink2}; padding-top: 6px; border-top: 1px dashed ${T.line}; }
        /* --- 2-ekran: uch manba maketi --- */
        .uc-manbalar { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .uc-manba { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: border-color .3s, box-shadow .3s; }
        .uc-manba.yonik { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.14)}; }
        .uc-manba-h { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .uc-manba-k { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .uc-jadval { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; width: 72px; }
        .uc-jadval i { height: 9px; border-radius: 2px; background: ${fon(T.ink, 0.12)}; }
        .uc-jadval i:nth-child(-n+3) { background: ${fon(T.ink, 0.28)}; }
        .uc-brauzer { display: flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; min-width: 0; }
        .uc-brauzer > i { width: 7px; height: 7px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; flex: none; }
        .uc-brauzer code { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .uc-umami-r { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: ${T.ink2}; }
        .uc-umami-r b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        .uc-v-bos, .uc-v-ust { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
        /* --- Karta (bittadan; E 53) --- */
        .uc-karta { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 10px; min-width: 0; animation: uc-karta .4s ease-out both; transition: background .3s; }
        .uc-karta.err { background: ${T.errFon}; }
        .uc-kirish { animation: uc-juft-kir .45s cubic-bezier(.3,1.2,.5,1) both; }
        .uc-karta-nom { font-size: clamp(16px,1.9vw,19px); font-weight: 800; color: ${T.ink}; line-height: 1.3; }
        p.uc-qarang { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 8px 12px; }
        p.uc-qarang span { font-weight: 700; color: ${T.ink}; }
        .uc-ha { font-weight: 800; font-size: 14px; color: ${T.ok}; }
        .uc-javoblar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .uc-javob { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; padding: 10px 20px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: background .2s, border-color .2s; }
        .uc-javob:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .uc-karta-tug { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .uc-karta-tug.chap { justify-content: flex-start; }
        .uc-karta-tug .uc-yordam-t { margin-left: auto; }
        .uc-tahrir { width: 22px; height: 22px; flex: none; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; font-size: 11px; line-height: 1; padding: 0; }
        .uc-yordam { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; }
        code.uc-kod-satr { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.5; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 8px; padding: 6px 8px; overflow-wrap: anywhere; }
        /* --- Maydonlar: yorliq input ichida (E 43) --- */
        .uc-qator-m { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .uc-inp-b { display: inline-flex; align-items: center; gap: 0; min-width: 0; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.paper}; overflow: hidden; transition: border-color .2s; }
        .uc-inp-b:focus-within { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.15)}; }
        .uc-inp-b > i { flex: none; font-style: normal; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; padding: 10px 9px; border-right: 1px solid ${T.line}; white-space: nowrap; }
        .uc-inp-b input { flex: 1; min-width: 0; width: 100%; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 600; color: ${T.ink}; padding: 9px 10px; border: 0; outline: none; background: transparent; }
        .uc-inp-b input::placeholder { color: ${fon(T.ink, 0.42)}; font-weight: 500; }
        .uc-inp-b.son input { width: 86px; flex: none; font-family: 'JetBrains Mono', monospace; }
        .uc-inp-b.keng { display: flex; width: 100%; }
        .uc-inp-b.err { border-color: ${T.err}; background: ${T.errFon}; }
        .uc-inp-b input:disabled { opacity: .5; }
        .uc-50, .uc-foiz { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: ${T.ink2}; }
        .uc-foiz b { color: ${T.ink}; animation: uc-pop .4s cubic-bezier(.3,1.5,.5,1) both; }
        .uc-manba-t { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .uc-y { font-style: normal; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; margin-right: 2px; }
        .uc-qism { display: flex; flex-direction: column; gap: 6px; }
        /* --- Strip «Hisobot · n / 4» (9–11-ekran) --- */
        .uc-strip { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; align-self: flex-start; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 99px; padding: 5px 12px; font-size: 12px; color: ${T.ink2}; max-width: 100%; }
        .uc-strip b { color: ${T.ink}; font-weight: 800; }
        .uc-strip span.ok { color: ${T.ok}; font-weight: 700; }
        /* --- 6-ekran: Duolingo sahnasi (chizilgan; son, eslatma matni yo'q) --- */
        .uc-voqea { display: flex; flex-direction: column; gap: 12px; }
        p.uc-tanish { margin: 0; font-size: 14px; color: ${T.ink2}; }
        .uc-voqea-h { font-weight: 800; font-size: 15px; color: ${T.ink}; animation: uc-kir .4s ease-out both; }
        .uc-nuq { display: flex; align-items: center; gap: 8px; margin: 2px 0; }
        .uc-nuq-l { font-weight: 800; font-size: 12px; color: ${T.ink2}; margin-right: 4px; }
        .uc-nuq > i { width: 26px; height: 6px; border-radius: 99px; background: ${T.line}; }
        .uc-nuq > i.ok { background: ${T.ok}; } .uc-nuq > i.cur { background: ${T.accent}; }
        .uc-voqea-qator { display: flex; justify-content: center; }
        .uc-voqea-qator.ikki { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 18px; align-items: center; }
        .uc-duo-sahna { display: flex; justify-content: center; align-items: center; gap: 18px; padding: 10px; min-height: 290px; }
        .uc-duo-sahna.ikki { justify-content: flex-start; }
        .uc-duo-tel { animation: uc-kir .45s ease-out both; }
        .uc-duo-tel.mini { width: 120px; height: 192px; border-radius: 18px; transition: width .4s, height .4s; }
        .uc-duo-markaz { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
        .uc-duo-tel.mini .uc-duo-markaz { gap: 6px; transform: scale(.72); }
        .uc-olov { width: 44px; height: 54px; }
        .uc-kataklar { display: grid; grid-template-columns: repeat(7, 18px); gap: 2px; }
        .uc-katak { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .uc-katak i { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid ${fon(T.ink, 0.22)}; font-style: normal; font-size: 9px; font-weight: 800; color: #fff; }
        .uc-katak.bor i { background: #FF9600; border-color: #FF9600; animation: uc-pop .4s cubic-bezier(.3,1.5,.5,1) both; animation-delay: calc(var(--i) * .18s); }
        .uc-katak.halqa i { box-shadow: 0 0 0 2px ${fon(T.accent, 0.5)}; animation: uc-chorla-c 1.8s ease-out 1.4s 3; }
        .uc-katak em { font-style: normal; font-size: 8.5px; font-weight: 700; color: ${T.ink2}; }
        .uc-qulf { background: #2A2F3A; border-color: #2A2F3A; justify-content: center; align-items: center; animation: uc-kir .45s ease-out both; }
        .uc-qulf-s { position: absolute; top: 40px; left: 50%; width: 56px; height: 8px; margin-left: -28px; border-radius: 99px; background: rgba(255,255,255,0.25); }
        .uc-bildirish { display: flex; flex-direction: column; align-items: flex-start; gap: 5px; width: 100%; padding: 10px; border-radius: 12px; border: 0; background: rgba(255,255,255,0.92); cursor: pointer; font-family: 'Manrope', sans-serif; font-size: 12.5px; animation: uc-tush .5s cubic-bezier(.3,1.3,.5,1) .3s both; }
        .uc-bildirish i { display: block; height: 6px; border-radius: 99px; background: ${fon(T.ink, 0.18)}; width: 90%; }
        .uc-bildirish i + i { width: 62%; }
        .uc-ochildi { animation: uc-kir .45s ease-out both; }
        .uc-muz { display: inline-flex; align-items: center; gap: 4px; }
        .uc-qor { width: 18px; height: 18px; }
        .uc-muz em { font-style: normal; font-size: 11px; font-weight: 700; color: #1CB0F6; }
        .uc-duo-ong { display: flex; flex-direction: column; gap: 8px; min-width: 0; flex: 1; max-width: 340px; animation: uc-kir .5s ease-out .2s both; }
        /* --- 3, 5-ekran kichik vizuallari --- */
        .uc-birliklar { flex-direction: column; gap: 6px; }
        .uc-birlik-q { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: ${T.ink2}; }
        .uc-birlik-q b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        .uc-kv { display: inline-flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .uc-kv b { font-family: 'JetBrains Mono', monospace; font-size: 20px; color: ${T.ink}; }
        /* --- 8-ekran: bo'g'in kartalari va reja kartasi --- */
        .uc-boginlar { display: flex; flex-direction: column; gap: 0; min-width: 0; }
        .uc-bogin-iz { margin-bottom: 8px; }
        .uc-bogin { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; transition: border-color .3s, box-shadow .3s; }
        .uc-bogin + .uc-bogin { margin-top: 14px; }
        .uc-bogin + .uc-bogin::before { content: ''; position: absolute; top: -15px; left: 22px; width: 0; height: 13px; border-left: 2px solid ${T.line}; }
        .uc-bogin.tanlov { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.12)}; }
        .uc-bogin.mentor { border-color: ${T.ok}; }
        .uc-bogin.ixcham { padding: 7px 12px; }
        .uc-bogin.ochiq { box-shadow: 0 8px 18px -14px rgba(${T.shadowBase},0.35); }
        .uc-chip { font-size: 12.5px; }
        .uc-bogin-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; color: ${T.ink}; text-align: left; background: none; border: 0; padding: 0; }
        button.uc-bogin-h { cursor: pointer; padding: 4px 8px; border-radius: 8px; margin: -4px -8px; }
        button.uc-bogin-h:disabled { cursor: default; color: ${T.ink2}; outline: 0; animation: none; }
        .uc-bogin-m { font-size: 13px; color: ${T.ink}; }
        .uc-bogin-m b { font-family: 'JetBrains Mono', monospace; }
        .uc-bogin-2 { display: block; font-size: 12.5px; color: ${T.ink}; padding: 6px 8px; border-radius: 8px; background: ${T.bg}; animation: uc-sirg .5s ease-out .5s both; }
        .uc-bogin-2 em { display: block; margin-top: 3px; font-style: normal; font-size: 12px; color: ${T.ink2}; }
        .uc-kam { align-self: flex-start; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; padding: 6px 12px; border-radius: 8px; border: 1.5px solid; background: ${T.paper}; color: ${T.ink}; cursor: pointer; animation-delay: calc(.5s + var(--i) * .25s); }
        .uc-kam:hover { background: ${T.accentSoft}; }
        .uc-reja-k { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 26px -14px rgba(${T.shadowBase},0.3); min-width: 0; align-self: start; }
        ol.uc-reja-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .uc-reja-ro li { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; font-size: 13px; line-height: 1.4; color: ${T.ink}; }
        .uc-reja-ro li.bor { background: ${T.bg}; }
        .uc-reja-ro li.bor.yangi { animation: uc-yashil 1.2s ease-out both; }
        .uc-reja-ro li.bor em { font-style: normal; font-size: 11px; font-weight: 800; color: ${T.accent}; }
        .uc-reja-ro li.joy { flex-direction: row; align-items: center; height: 34px; border: 1.5px dashed ${fon(T.ink, 0.2)}; }
        .uc-reja-ro li.joy i { font-style: normal; font-size: 11px; font-weight: 800; color: ${fon(T.ink, 0.35)}; }
        .uc-reja-k.mini { padding: 10px 12px; max-width: 420px; }
        .uc-reja-k.mini li.bor:first-child { background: ${T.okFon}; }
        .uc-reja-tel { display: flex; justify-content: center; padding-top: 10px; }
        .uc-reja-k > .hv-atama { align-self: flex-start; }
        .uc-s8-harakat { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
        .uc-s8-natija { display: flex; flex-direction: column; gap: 3px; }
        .uc-s8.tugadi { grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); }
        /* --- 9-ekran: darvoza, vazifa, kunlar formasi, Neon maketi --- */
        .uc-darvoza { display: flex; flex-direction: column; gap: 8px; }
        .uc-darvoza.uc-chorla { animation: none; }
        .uc-darvoza-s { font-size: 14px; font-weight: 700; color: ${T.ink}; }
        .uc-darvoza-t { display: flex; flex-wrap: wrap; gap: 6px; }
        ol.uc-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        ol.uc-vazifa li { display: flex; align-items: flex-start; gap: 9px; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        ol.uc-vazifa li i, ol.uc-xavf li i { font-style: normal; flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; }
        .uc-kunlar { display: flex; flex-direction: column; gap: 4px; }
        .uc-kun-q { display: grid; grid-template-columns: auto 1fr auto auto; gap: 8px; align-items: center; padding: 6px 10px; border-radius: 10px; border: 1px solid ${T.line}; font-size: 12.5px; }
        .uc-kun-q.yangi { animation: uc-yashil 1.1s ease-out both; }
        .uc-kun-q i { font-style: normal; font-weight: 800; color: ${T.ok}; }
        .uc-kun-q b { font-family: 'JetBrains Mono', monospace; }
        .uc-kun-forma { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .uc-kun-forma.yopiq { opacity: .55; }
        .uc-kun-forma .uc-inp-b input[type="date"] { width: 136px; }
        .uc-kun-forma .uc-inp-b.son input { width: 64px; }
        .uc-jami { font-size: 14px; font-weight: 700; color: ${T.ink}; }
        .uc-jami b { font-family: 'JetBrains Mono', monospace; font-size: 18px; }
        .uc-kod-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .uc-neon { border-radius: 14px; overflow: hidden; border: 1px solid ${T.line}; background: ${CODE.bg}; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.5); }
        .uc-neon-bar { display: flex; align-items: center; gap: 6px; padding: 8px 10px; background: rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .uc-neon-bar > i { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.22); }
        .uc-neon-tab { margin-left: 6px; font-size: 12px; font-weight: 700; color: ${CODE.text}; background: rgba(255,255,255,0.08); border-radius: 6px; padding: 3px 9px; }
        .uc-neon-run { margin-left: auto; font-size: 12px; font-weight: 800; color: ${CODE.bg}; background: ${CODE.str}; border-radius: 6px; padding: 4px 10px; }
        pre.uc-neon-sql { margin: 0; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-variant-ligatures: none; font-size: 13px; line-height: 1.65; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; }
        .uc-neon-sql .kw { color: ${CODE.punct}; font-weight: 700; }
        .uc-neon-joy { color: ${CODE.attr}; letter-spacing: 1px; }
        .uc-neon-ustun { color: ${CODE.attr}; font-weight: 800; border-radius: 4px; padding: 0 2px; }
        .uc-neon-ustun.ajrat { animation: uc-ajrat 2.4s ease-out both; }
        .uc-neon-jadval { display: grid; grid-template-columns: max-content max-content; margin: 0 16px 16px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.14); max-width: calc(100% - 32px); }
        .uc-neon-th, .uc-neon-td { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; padding: 5px 18px; text-align: center; }
        .uc-neon-th { color: ${CODE.comment}; background: rgba(255,255,255,0.06); font-weight: 700; }
        .uc-neon-td { color: ${CODE.comment}; font-weight: 800; }
        .uc-neon-td.bor { color: ${CODE.str}; }
        .uc-neon-td.yangi { animation: uc-yashil-q 1.1s ease-out both; }
        /* --- 11-ekran: zaxira bloki, bo'g'in tanlovi, xavfsizlik ro'yxati --- */
        .uc-zaxira { display: flex; flex-direction: column; gap: 6px; padding-top: 8px; border-top: 1px dashed ${T.line}; }
        .uc-zaxira-h { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: ${T.ink2}; }
        .uc-boginlar-t { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        .uc-tanlov { display: flex; flex-direction: column; gap: 3px; text-align: left; padding: 9px 11px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.3); transition: border-color .2s, background .2s; }
        .uc-tanlov b { font-size: 13.5px; color: ${T.ink}; }
        .uc-tanlov span { font-size: 12px; color: ${T.ink2}; }
        .uc-tanlov em { font-style: normal; font-size: 11.5px; color: ${T.ink2}; }
        .uc-tanlov.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .uc-ochgich { align-self: flex-start; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 700; color: ${T.accent}; background: none; border: 0; padding: 2px 0; cursor: pointer; }
        ol.uc-xavf { list-style: none; margin: 0; padding: 8px 10px; display: flex; flex-direction: column; gap: 6px; border-radius: 10px; background: ${T.bg}; }
        ol.uc-xavf li { display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px; line-height: 1.4; color: ${T.ink}; }
        ol.uc-xavf li.ost { color: ${T.ink2}; padding-left: 30px; }
        /* --- Kartochkalar, uyga vazifa, yakun --- */
        .uc-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: uc-puls 1.8s ease-out .4s 3; }
        p.uc-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.uc-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: uc-nuqta 2.4s ease-in-out 3; }
        .uc-hw { display: flex; flex-direction: column; gap: 12px; }
        .uc-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .uc-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .uc-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .uc-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.uc-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .uc-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .uc-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .uc-hw-qadam li > div { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
        .uc-hw-qadam p { margin: 0; }
        p.uc-hw-iz { font-size: 12.5px; color: ${T.ink2}; }
        .uc-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .uc-yakun { display: contents; }
        .uc-yakun.belgisiz .done-chip .tick { display: none; }
        @keyframes uc-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes uc-yashil { 0%, 45% { background-color: ${T.okFon}; } 100% { background-color: ${T.paper}; } }
        @keyframes uc-yashil-q { 0%, 45% { background-color: ${fon(T.ok, 0.35)}; } 100% { background-color: transparent; } }
        @keyframes uc-tush { from { opacity: 0; transform: translateY(-12px) scale(0.92); } to { opacity: 1; transform: none; } }
        @keyframes uc-muhr { from { opacity: 0; transform: rotate(-8deg) scale(1.6); } to { opacity: 1; transform: rotate(-8deg) scale(1); } }
        @keyframes uc-pop { from { transform: scale(1.35); } to { transform: none; } }
        @keyframes uc-karta { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes uc-juft-kir { from { opacity: 0; transform: translateX(18px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes uc-sirg { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        @keyframes uc-silk { 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        @keyframes uc-uch { to { transform: translate(var(--dx), var(--dy)) scale(0.92); opacity: 0.15; } }
        @keyframes uc-ajrat { 0%, 50% { background: ${fon(CODE.attr, 0.3)}; } 100% { background: transparent; } }
        @keyframes uc-nuqta { 0%, 100% { opacity: 1; } 50% { opacity: 0.65; } }
        @media (max-width: 760px) {
          .uc-split, .uc-split.uc-split-v, .uc-s8.tugadi { grid-template-columns: 1fr; }
          .uc-voqea-qator.ikki { grid-template-columns: 1fr; }
          .uc-boginlar-t { grid-template-columns: 1fr; }
          .hv-q { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "nom son" "yor yor" "izoh izoh" "oldin oldin" "tuz tuz"; }
          .hv-q-yor { justify-content: flex-start; }
        }
        @media (max-width: 640px) {
          .uc-hw-karta { grid-template-columns: 1fr; }
          .uc-duo-sahna.ikki { flex-direction: column; align-items: center; }
          .uc-hook-q { flex-direction: column; }
          .uc-inp-b.son input { width: 72px; }
          .lesson-root .q-ekran { padding-bottom: 64px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .uc-halqa, .uc-halqa-i, .uc-s0.kutish .q-variant, .q-bashorat .q-chip, .uc-chorla > *, .uc-kam, .hv .halqa, .uc-uch, .uc-karta, .uc-kirish, .hv, .hv-atama, .hv-muhr.bor, .hv-q.h-joriy, .hv-q.yangi, .hv-q .silk,
          .hv-past.yangi, .uc-pufak-j, .uc-mini-38, .uc-mini-q, .uc-rj, .uc-voqea-h, .uc-duo-tel, .uc-katak.bor i, .uc-katak.halqa i, .uc-qulf, .uc-bildirish, .uc-ochildi, .uc-duo-ong, .uc-bogin-2,
          .uc-reja-ro li.bor.yangi, .uc-kun-q.yangi, .uc-neon-ustun.ajrat, .uc-neon-td.yangi, .uc-tel-tug.uc-ulash, .uc-foiz b, .hv-birlik.ajrat, .uc-flash.yangi .fc-card .fc-front, p.uc-fc-ipucha i { animation: none !important; }
          .hv-muhr.bor { transform: rotate(-8deg); }
          .uc-karta, .hv-q, .uc-manba, .uc-bogin, .uc-duo-tel.mini { transition: none !important; }
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
        .ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ovoz-q { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) 28px; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .ovoz-q b { text-align: right; color: ${T.ink}; font-variant-numeric: tabular-nums; }
        .ovoz-y { height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.6s ease-out; }
        .lp-msanoq { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
        .lp-msanoq-q { display: flex; align-items: baseline; gap: 6px; padding: 6px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; color: ${T.ink2}; }
        .lp-msanoq-q b { font-size: 15px; font-weight: 800; color: ${T.ink}; font-variant-numeric: tabular-nums; }
        .mstats-wait-chip.toliq { box-shadow: inset 0 0 0 1.5px ${T.ok}; font-weight: 800; }

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
