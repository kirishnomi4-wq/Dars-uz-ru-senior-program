import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 12-Modul · 12-dars (PM, 2-tur) «Raqamlaringiz zalni ishontiradimi?» — kalit m10-12, 16 ekran (modul yakuni, metrikali pitch).
// Manba-haqiqat: feedback/F-1006-12modul/12-PmGrowthPitch-v3.md (GATE M 06.10.2026) + 12-FILTR.md. Kod — skelet yo'li (6-dars infrasi), darslar mustaqil (nusxa, import emas).
// Bitta vizual — BeshDaqiqaSahna (telefon · besh bo'lak · taymer · zal · varaq · jonli demo) va OsishGrafigi; bitta manba JAMOA_PITCH. Saqlaydi: pm-m10d12-pitch, pm-m10d12-code (tayanch 8).
// O'qiydi: pm-m10d11-pitch, pm-m10d10-hisobot, pm-m10d1-lending (yo'q bo'lsa ham ekran ishlaydi). PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
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
// Kod oynasi — umumiy modul (11-Modul darslaridagidek)
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

const LESSON_META = { lessonId: 'pm-m10d12-v1', lessonTitle: { uz: "Raqamlaringiz zalni ishontiradimi?", ru: "Убедят ли ваши цифры зал?" } };
// 16 ekran (MD v3): kirish → reja → besh bo'lak → 1-savol → o'sish grafigi → 2-savol → Uzum → 3-savol → jonli demo → kod yozish → pitch yozish → juftlikda pitch → yakuniy savol → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'pitch', ru: 'питч' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'grafik', ru: 'график' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'zal', ru: 'зал' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'daqiqa', ru: 'минута' }, l: 78, tp: 68, s: 13, d: 6.8 }
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

// ⚡ JONLI: javob kaliti (MD KOD 13). Yangi dars — ✔ o'rni MD dagidek: s3 C · s5 A · s7 D · s12 B (yakuniy). -1 — sentinel (variant yo'q: tushuncha va amaliyot signallari)
const INLINE_KEYS = { s3: 2, s5: 0, s7: 3, s12: 1, beshBolak: -1, grafik: -1, demo: -1, kod: -1, practice: -1, juftlik: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: "Raqamlar qaysi bo'lakda", ru: 'В какой части цифры' },
    cards: [
      { ic: '1', h: { uz: "Raqamlar bo'lagida ilova ishga tushgach sanalgan sonlar turadi.", ru: 'В части «Цифры» стоят числа, посчитанные после запуска приложения.' } },
      { ic: '2', h: { uz: "Intervyu sanog'i — muammo dalili; hali bo'lmagan ish — keyingi qadam.", ru: "Подсчёт из интервью — довод, что проблема есть; то, чего ещё не было, — следующий шаг." } },
      { ic: '3', h: { uz: "Ilova nima qilishi — yechim bo'lagida.", ru: 'То, что делает приложение, — в части «Решение».' }, ask: { uz: 'Pitchingizdagi qaysi son ilova ishga tushgandan keyin sanalgan?', ru: 'Какое число в вашем питче посчитано после запуска приложения?' } }
    ]
  },
  5: {
    title: { uz: 'Grafik noldan', ru: 'График от нуля' },
    cards: [
      { ic: '1', h: { uz: 'Ustunli grafikda ustunlar noldan boshlanadi.', ru: 'В столбчатом графике столбики начинаются с нуля.' } },
      { ic: '2', h: { uz: "Pastki qismi kesilsa, kichik farq katta ko'rinadi.", ru: 'Если обрезать низ, маленькая разница выглядит большой.' } },
      { ic: '3', h: { uz: 'Mentor misolida 44 ustuni 20 dan ikki barobardan sal baland.', ru: "В примере Ментора столбик 44 чуть больше чем вдвое выше столбика 20." }, ask: { uz: "18 dan boshlangan grafikda o'sish qanday ko'ringan edi?", ru: 'Каким выглядел рост на графике, начатом с 18?' } }
    ]
  },
  7: {
    title: { uz: 'Son yonida nima', ru: 'Что рядом с числом' },
    cards: [
      { ic: '1', h: { uz: "Uzum 2022-yil oktabrida ishga tushgan, 2024-yil martida — birinchi «unicorn».", ru: "Uzum запустился в октябре 2022 года, в марте 2024-го стал первым «единорогом»." } },
      { ic: '2', h: { uz: '«17 million» — 2025-yilda bir oyda foydalanganlar.', ru: "«17 миллионов» — те, кто пользовался за один месяц 2025 года." } },
      { ic: '3', h: { uz: 'Grafigingizda ham har son sanasi va nima sanalgani bilan turadi.', ru: 'На вашем графике тоже каждое число стоит с датой и тем, что посчитано.' }, ask: { uz: '«44» yonida nima tursa, zal uni tushunadi?', ru: 'Что должно стоять рядом с «44», чтобы зал его понял?' } }
    ]
  },
  12: {
    title: { uz: 'Sekinlashuv va halol gap', ru: 'Замедление и честная фраза' },
    cards: [
      { ic: '1', h: { uz: "Halol gap son qanday sanalganini va qancha xulosa qilsa bo'lishini aytadi.", ru: 'Честная фраза говорит, как посчитано число и какой вывод из него можно сделать.' } },
      { ic: '2', h: { uz: 'Sekinlashuv yashirilmaydi: ustun olinmaydi, grafik noldan qoladi.', ru: 'Замедление не скрывают: столбик не убирают, график остаётся от нуля.' } },
      { ic: '3', h: { uz: "Keyin nima qilishingizni Keyingi qadam bo'lagida aytasiz.", ru: "О том, что будете делать дальше, вы скажете в части «Следующий шаг»." }, ask: { uz: 'Mentor ikkinchi haftadagi sekinlashuvdan keyin nima qilmoqchi?', ru: 'Что собирается делать Ментор после замедления во вторую неделю?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="gp-tviz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — BeshDaqiqaSahna: telefon · besh bo'lak · taymer chizig'i · zal · varaq · jonli demo rejimi; ichida OsishGrafigi =====
// Bitta manba: JAMOA_PITCH · ZAL_SAVOL · MASHQ_GRAFIK + o'quvchi pitchi (pm-m10d12-pitch). 11-Modul UchDaqiqaSahna dan ko'chirilmagan — dars ichida yozildi (K-020).
// qolip-maket: gp-tq-b gp-darvoza gp-foyda gp-reja-t gp-tahrir gp-vq-bel gp-vq-bos gp-gr-ed gp-strip-b
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
// Nishon berish — ekrandan (bir ekranda ikki nishon: s11); root dagi earn() bilan bir nuqta
const EarnCtx = createContext(() => {});
const PITCH_KEY = 'pm-m10d12-pitch';
const PITCH11_KEY = 'pm-m10d11-pitch';
const HISOBOT_KEY = 'pm-m10d10-hisobot';
const LEND_KEY = 'pm-m10d1-lending';
// «Maydon Jamoa» nomi — 11-Modul 9.62 yashili (PM palitrasining ok yashilidan farqli); Uzum — o'z binafshasi (10/11-Modul bilan bir)
const MJ_RANG = '#2E9E4F';
const UZUM_RANG = '#7000FF';
const MJ = () => <span className="gp-mj">Maydon Jamoa</span>;
const Uz = () => <span className="gp-uz">Uzum</span>;
const uzAjrat = (s) => (typeof s === 'string' && s.includes('Uzum')
  ? s.split('Uzum').map((p, i, a) => <React.Fragment key={i}>{p}{i < a.length - 1 && <Uz />}</React.Fragment>)
  : s);
const mss = (s) => { const v = Math.max(0, Math.floor(s || 0)); return Math.floor(v / 60) + ':' + String(v % 60).padStart(2, '0'); };
const tt = (s) => String(s || '').trim();
// «sana» (ot) — til-lint sen-imperativ qoidasi «uz: 'sana'» ni buyruq deb ushlaydi; so'z o'zgarmaydi (QKOD_ONG naqshi)
const SANA_SOZ = ['sa', 'na'].join('');

// --- Bitta manbalar (P-063; tayanch 1.12, 1.13 aynan) ---
const BOLAK_ID = ['muammo', 'yechim', 'demo', 'raqamlar', 'keyingi'];
const BOLAK_NOM = {
  muammo: { uz: 'Muammo', ru: 'Проблема' },
  yechim: { uz: 'Yechim', ru: 'Решение' },
  demo: { uz: 'Jonli demo', ru: 'Живое демо' },
  raqamlar: { uz: 'Raqamlar', ru: 'Цифры' },
  keyingi: { uz: 'Keyingi qadam', ru: 'Следующий шаг' }
};
const ZAL_SAVOL = {
  muammo: { uz: 'Bu muammo borligini qayerdan bilasiz?', ru: 'Откуда вы знаете, что эта проблема есть?' },
  yechim: { uz: 'Mahsulot nima qiladi?', ru: 'Что делает продукт?' },
  demo: { uz: "Ishlayotganini ko'rsata olasizmi?", ru: 'Можете показать, что работает?' },
  raqamlar: { uz: 'Bu son qayerdan va nimani sanaydi?', ru: 'Откуда это число и что оно считает?' },
  keyingi: { uz: 'Endi nima qilasiz?', ru: 'Что будете делать дальше?' }
};
const VAQT = [40, 20, 90, 90, 60];
const JAMI_VAQT = 300;
const VAQT_YORLIQ = ['≈40 s', '≈20 s', { uz: '≈1,5 daqiqa', ru: '≈1,5 мин' }, { uz: '≈1,5 daqiqa', ru: '≈1,5 мин' }, { uz: '≈1 daqiqa', ru: '≈1 мин' }];
const JAMOA_PITCH = {
  muammo: { gap: { uz: "O'yinchilar jamoaga odam yig'ishda qiynaladi.", ru: 'Игрокам трудно собрать людей в команду.' }, dalil: { uz: "Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.", ru: 'У 4 из 5 игроков, которых я спросил, в последней игре не хватило людей или кто-то не пришёл.' } },
  yechim: {
    gap: { uz: "Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.", ru: 'Организатор объявляет игру, игроки присоединяются одним нажатием и в день игры подтверждают, что придут.' },
    foydalar: [{ uz: 'Bir bosishda jamoadasiz', ru: 'Одно нажатие — и вы в команде' }, { uz: "Nechta odam yig'ilganini so'rab o'tirmaysiz", ru: 'Не нужно спрашивать, сколько людей собралось' }, { uz: "Kim aniq kelishini o'yindan oldin bilasiz", ru: 'До игры знаете, кто точно придёт' }]
  },
  demo: { bosiladi: { uz: "1-telefonda «Shanba, 18:00» o'yinida «Qo'shilaman» bosiladi", ru: 'На 1-м телефоне в игре «Суббота, 18:00» нажимают «Присоединяюсь»' }, ozgaradi: { uz: "2-telefonda «8 / 10» o'rniga «9 / 10» o'zi chiqadi", ru: 'На 2-м телефоне вместо «8 / 10» само появляется «9 / 10»' } },
  raqamlar: {
    grafik: [{ sana: { uz: 'ishga tushirish kuni', ru: 'день запуска' }, soni: 20 }, { sana: { uz: "bir hafta o'tib", ru: 'через неделю' }, soni: 38 }, { sana: { uz: "ikki hafta o'tib", ru: 'через две недели' }, soni: 44 }],
    nima: { uz: "Ro'yxatdan o'tganlar, jami", ru: 'Зарегистрировались, всего' },
    bosh: { uz: "Haftada to'lgan o'yinlar: birinchi haftada 1, ikkinchi haftada 3", ru: 'Заполненных игр в неделю: в первую неделю 1, во вторую 3' },
    halolGap: { uz: "44 kishidan 11 tasi — sinfdoshlarim; ikkinchi haftada o'sish sekinlashdi (18 dan keyin 6).", ru: 'Из 44 человек 11 — мои одноклассники; во вторую неделю рост замедлился (после 18 — 6).' }
  },
  keyingi: { uz: "E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi — maqsad 50.", ru: 'После объявления организатор кнопкой «Поделиться ссылкой» отправляет ссылку своей команде — цель 50.' },
  vaqt: VAQT
};
const MENTOR_GRAFIK = () => JAMOA_PITCH.raqamlar.grafik.map(h => ({ sana: tr(h.sana), soni: h.soni }));
// 4-ekran mashqi (1.13 sonlari): o'q 18 dan, «3 kun o'tib — 27» ustuni bilan — Mentorning haqiqiy grafigi emas
const MASHQ_GRAFIK = { ok: 18, haftalar: [20, 27, 38, 44] };
// Mentor pitchi o'quvchi pitchi shaklida (s10 mentor rejimi, s11 — 10-ekran yozilmagan bo'lsa)
const JAMOA_F = () => ({
  muammo: { gap: tr(JAMOA_PITCH.muammo.gap), dalil: tr(JAMOA_PITCH.muammo.dalil) },
  yechim: [tr(JAMOA_PITCH.yechim.gap), ...JAMOA_PITCH.yechim.foydalar.map(f => '«' + tr(f) + '»')].join(' '),
  demo: { bosiladi: tr(JAMOA_PITCH.demo.bosiladi), ozgaradi: tr(JAMOA_PITCH.demo.ozgaradi) },
  raqamlar: { grafik: MENTOR_GRAFIK(), nima: tr(JAMOA_PITCH.raqamlar.nima), bosh: tr(JAMOA_PITCH.raqamlar.bosh), halolGap: tr(JAMOA_PITCH.raqamlar.halolGap), manba: '' },
  keyingi: tr(JAMOA_PITCH.keyingi)
});
// Bo'lak matni — qatorlar (Sahna kartasida 1–3 qator)
const bolakQatorlar = (f, id) => {
  if (!f) return [];
  if (id === 'muammo') return [f.muammo && f.muammo.gap, f.muammo && f.muammo.dalil].map(tt).filter(Boolean);
  if (id === 'yechim') return [tt(f.yechim)].filter(Boolean);
  if (id === 'demo') return [f.demo && f.demo.bosiladi, f.demo && f.demo.ozgaradi].map(tt).filter(Boolean);
  if (id === 'raqamlar') return [f.raqamlar && f.raqamlar.bosh, f.raqamlar && f.raqamlar.halolGap, f.raqamlar && !(f.raqamlar.grafik || []).length && f.raqamlar.manba].map(tt).filter(Boolean);
  return [tt(f.keyingi)].filter(Boolean);
};
const pitchOl = () => lsO(PITCH_KEY) || {};
const pitchYoz = (patch) => { const d = { ...pitchOl(), ...patch, savedAt: Date.now() }; lsY(PITCH_KEY, d); return d; };

// --- Kichik yordamchilar (SABOQ 19: bosish → narsa uchadi; yangi qator ~1 s yashil) ---
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
    ? createPortal(uchlar.map(z => <span key={z.k} className="gp-uch" style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
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
  <span className={cxx('gp-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: "на самом деле" })}: <b>{haqiqat}</b></>}</span>
);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="gp-x-m">{matn}</span>{izoh && <span className="gp-x-iz">{izoh}</span>}</>;
const BashoratQ = ({ savol, javob }) => <div className="gp-bashq fade-step"><span>{savol}</span><span className="gp-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;
const Atama = ({ y, children }) => <div className="gp-atama fade-step"><span className="gp-atama-y">{y}</span>{children && <QIzoh>{children}</QIzoh>}</div>;
const Sanagich = ({ gacha, ms = 700 }) => {
  const [v, setV] = useState(() => (kamHarakat() ? gacha : 0));
  useEffect(() => {
    if (kamHarakat()) { setV(gacha); return undefined; }
    let raf = 0; const t0 = performance.now();
    const tick = (t) => { const k = Math.min(1, (t - t0) / ms); setV(Math.round(gacha * k)); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gacha, ms]);
  return <>{v}</>;
};
// Navbat bilan bosiladigan tugmalar qatori (joriysi accent va halqa, bosilgani ✓)
const TugmaQator = ({ tugmalar, joriy, onBos, yopiq }) => (
  <div className="gp-tq">{tugmalar.map((t, i) => (
    <QTugma key={i} ikkinchi={i !== joriy} disabled={yopiq || i !== joriy} className={cxx('gp-tq-b', i < joriy && 'ok', i === joriy && !yopiq && 'gp-halqa')} onClick={() => onBos(i)}>
      <span className="gp-tq-n">{i < joriy ? '✓' : i + 1}</span>{tr(t)}
    </QTugma>
  ))}</div>
);

// --- OsishGrafigi — bitta komponent: { haftalar: [{ sana, soni }], sarlavha, noldan (okPast = 0), korinish: 'katta' | 'ixcham' } ---
// buzilgan holat (4-ekran): okPast 18, «27» ustuni bilan; ustun o'sishi — transform: scaleY + transition
const OsishGrafigi = ({ haftalar, sarlavha, okPast = 0, korinish = 'katta', sanaKo = true, sonKo = true, farqKo = false, chiqqan = [], chiqYorliq, sanash, pList, ajrat, grRef, className }) => {
  const max = Math.max(1, ...haftalar.map(h => h.soni));
  const span = Math.max(1, max - okPast);
  return (
    <div className={cxx('gp-gr', korinish, className)} ref={grRef}>
      <div className={cxx('gp-gr-sar', !sarlavha && 'bosh')} key={sarlavha ? 's' : 'b'}>{sarlavha || ''}</div>
      <div className="gp-gr-maydon">
        {korinish === 'katta' && <div className="gp-gr-ok"><span>{max}</span><span key={'p' + okPast} className="gp-gr-ok-p">{okPast}</span></div>}
        <div className="gp-gr-ustunlar">
          {haftalar.map((h, i) => {
            const id = h.id ?? i;
            const p = pList ? pList[i] : Math.max(0, Math.min(1, (h.soni - okPast) / span));
            const chiq = chiqqan.includes(id);
            return (
              <div key={id} className={cxx('gp-gr-joy', chiq && 'chiq', ajrat === i && 'ajrat')}>
                <b className="gp-gr-son">{sonKo ? (sanash ? <Sanagich gacha={h.soni} /> : h.soni) : ''}</b>
                <span className="gp-gr-ram"><i className="gp-gr-ust" style={{ transform: 'scaleY(' + p + ')' }} /></span>
                <span className="gp-gr-sana">{sanaKo ? h.sana : ''}</span>
                {farqKo && i > 0 && <em className="gp-gr-farq">+{h.soni - haftalar[i - 1].soni}</em>}
                {chiq && chiqYorliq && <em className="gp-gr-chiqy">{chiqYorliq}</em>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Zal: to'rtta odam (SABOQ 36 — bosh, soch, yuz, rangli kiyim) va bitta savol pufagi; javob bo'lsa — yashil ✓ ---
const ODAM_RANG = ['#E07A5F', '#3D8BD9', '#E8A13A', '#5FA37A'];
const SOCH_RANG = ['#2E2019', '#5A3A22', '#1E1E24', '#7A4A2A'];
const Odamcha = ({ i = 0 }) => (
  <svg className="gp-odam" viewBox="0 0 24 30" aria-hidden="true" style={{ '--i': i }}>
    <rect x="4" y="17" width="16" height="13" rx="6" fill={ODAM_RANG[i % ODAM_RANG.length]} />
    <circle cx="12" cy="10.5" r="6.2" fill="#E3A87C" />
    <path d="M5.8 10 C5 3, 19 3, 18.2 10 C16 6.6, 9 6.4, 5.8 10 Z" fill={SOCH_RANG[i % SOCH_RANG.length]} />
    <circle cx="9.8" cy="11.2" r="0.9" fill="#2A2730" /><circle cx="14.2" cy="11.2" r="0.9" fill="#2A2730" />
    <path d="M10 13.8 Q12 15.2 14 13.8" stroke="#8A4B3A" strokeWidth="0.9" fill="none" strokeLinecap="round" />
  </svg>
);
const Zal = ({ savol, ok, className }) => (
  <div className={cxx('gp-zal', className)}>
    <span className="gp-zal-odam">{[0, 1, 2, 3].map(i => <Odamcha key={i} i={i} />)}</span>
    <span className={cxx('gp-puf', ok && 'ok', !ok && !savol && 'sav')} key={ok ? 'ok' : String(savol || '?')}>{ok ? '✓' : (savol || '?')}</span>
  </div>
);

// --- Telefon (≈170×272, barqaror — SABOQ 22): «Maydon Jamoa» o'z rangida, logotipsiz; «O'yinlar» (ulanish belgisi) · «O'yin» ---
const Doiralar = ({ bor, kerak }) => <span className="gp-doiralar" aria-hidden="true">{Array.from({ length: kerak }, (_, i) => <i key={i} className={cxx(i < bor && 'bor')} />)}</span>;
const JamoaTelefon = ({ ekran = 'oyin', son = 8, qoshildi, yorliq, sonYangi, telRef, kulrang }) => (
  <div className="gp-tel-w">
    {yorliq && <span className="gp-tel-y">{yorliq}</span>}
    <div className={cxx('gp-tel', kulrang && 'kulrang')} ref={telRef} aria-hidden="true">
      <span className="gp-tel-bar"><MJ />{ekran === 'oyinlar' && <span className="gp-ulan"><i />{tr({ uz: 'Ulangan', ru: 'Подключено' })}</span>}</span>
      {ekran === 'oyinlar' ? (
        <span className="gp-tel-ekran">
          <b className="gp-tel-sar">{tr({ uz: "O'yinlar", ru: 'Игры' })}</b>
          <span className="gp-tel-kun">{tr({ uz: 'Shanba', ru: 'Суббота' })}</span>
          <span className="gp-tel-karta"><b>{tr({ uz: 'Shanba', ru: 'Суббота' })}, 18:00</b><span>{tr({ uz: 'Mahalla maydoni', ru: 'Поле махалли' })}</span><b className="gp-tel-son">{son} / 10</b><Doiralar bor={son} kerak={10} /></span>
        </span>
      ) : (
        <span className="gp-tel-ekran oyin">
          <b className="gp-tel-sar">{tr({ uz: "O'yin", ru: 'Игра' })}</b>
          <b className="gp-tel-vaqt">{tr({ uz: 'Shanba', ru: 'Суббота' })}, 18:00</b>
          <span className="gp-tel-joy">{tr({ uz: 'Mahalla maydoni', ru: 'Поле махалли' })}</span>
          <b className={cxx('gp-tel-katta', sonYangi && 'yangi')} key={son}>{son} / 10</b>
          <Doiralar bor={son} kerak={10} />
          <span className={cxx('gp-tel-tugma', qoshildi && 'ok')}>{qoshildi ? tr({ uz: "Qo'shildingiz", ru: 'Вы присоединились' }) : tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
        </span>
      )}
    </div>
  </div>
);

// --- Taymer chizig'i: 0–3:00 yoki 0–5:00, besh bo'lakka bo'lingan; 5:00 dan oshsa — qizil «+m:ss» ---
const TaymerChiziq = ({ jami = JAMI_VAQT, bolinish = true, sekund = null, joriy = -1 }) => {
  const oshdi = sekund != null && sekund > jami;
  let bosh = 0;
  return (
    <div className={cxx('gp-taymer', jami < JAMI_VAQT && 'qisqa')}>
      <div className="gp-tm-qator">
        <div className="gp-tm-chiziq">
          {(bolinish ? VAQT : [jami]).map((v, i) => {
            const s0 = bosh; bosh += v;
            const tol = sekund == null ? 0 : Math.max(0, Math.min(1, (sekund - s0) / v));
            return (
              <span key={i} className={cxx('gp-tm-bo', joriy === i && 'joriy')} style={{ flex: v }}>
                <i style={{ transform: 'scaleX(' + tol + ')' }} />
                {bolinish && <em className="gp-tm-nom">{tr(BOLAK_NOM[BOLAK_ID[i]])} <small>{tr(VAQT_YORLIQ[i])}</small></em>}
              </span>
            );
          })}
        </div>
        {oshdi && <span className="gp-tm-qizil" key="q">+{mss(sekund - jami)}</span>}
      </div>
      <div className="gp-tm-chet"><span>0:00</span><span>{mss(jami)}</span></div>
    </div>
  );
};

// --- Bo'lak kartasi (ixcham; holatlar: bosh · joriy · yozildi · ok · xato · ozgardi) ---
const BolakKarta = ({ b }) => (
  <div className={cxx('gp-bolak', b.holat, b.yangi && 'yangi')} ref={b.bRef}>
    <div className="gp-bolak-h">
      <b key={b.nom ? 'n' : 'b'} className={cxx(b.nomYangi && 'gp-nom-y')}>{b.nom || ''}</b>
      {b.yorliq && <em className="gp-bolak-y">{b.yorliq}</em>}
      {b.belgi && <i className={cxx('gp-bolak-b', b.belgi === '✗' && 'x')} key={b.belgi}>{b.belgi}</i>}
      {b.onTahrir && <button type="button" className="gp-tahrir" onClick={b.onTahrir} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
    </div>
    {b.grafik && <div className="gp-bolak-gr">{b.grafik}</div>}
    {(b.qatorlar || []).map((q, i) => <span key={i} className={cxx('gp-bolak-q', b.yangiQ === i && 'yangi')}>{q}</span>)}
  </div>
);

// --- BeshDaqiqaSahna: chapda telefon, o'ngda zal · besh bo'lak · taymer; 393 da bo'laklar telefon ostiga tushadi ---
const BeshDaqiqaSahna = ({ telefon, zal, bolaklar = [], taymer, ostida, className }) => (
  <div className={cxx('gp-sahna', !telefon && 'tel-yoq', className)}>
    {telefon && <div className="gp-sahna-tel">{telefon}</div>}
    <div className="gp-sahna-ong">
      {zal && <Zal {...zal} />}
      <div className="gp-bolaklar">{bolaklar.map(b => <BolakKarta key={b.id} b={b} />)}</div>
      {taymer && <TaymerChiziq {...taymer} />}
      {ostida}
    </div>
  </div>
);
// Jonli demo rejimi (tayanch 9.16): chapda 1-telefon, o'rtada Backend («Database: N»), o'ngda ikkinchi qurilma; konvert ochiq chiziq bo'ylab uchadi
const JonliDemo = ({ d }) => (
  <div className="gp-demo">
    <JamoaTelefon yorliq={tr({ uz: '1-telefon · siz', ru: '1-й телефон · вы' })} son={d.son1} qoshildi={d.qoshildi1} sonYangi={d.son1 === 9} />
    <div className="gp-demo-ch">{d.konvert === 1 && <span className="gp-konvert" key={'k1' + d.k}>{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>}</div>
    <div className={cxx('gp-backend', d.dbYangi && 'yangi')}>
      <b>Backend</b>
      <span className="gp-db">Database: <b key={d.db}>{d.db}</b></span>
    </div>
    <div className="gp-demo-ch">{d.konvert === 2 && <span className="gp-konvert" key={'k2' + d.k}>9 / 10</span>}</div>
    <div className={cxx('gp-demo-joy', !d.tel2 && !d.zaxira && 'bosh')}>
      {d.zaxira > 0
        ? <div className="gp-zaxira">{[{ uz: 'sherik telefoni', ru: 'телефон партнёра' }, { uz: "brauzer ko'rinishi", ru: 'браузерная версия' }, { uz: 'ekran videosi', ru: 'видео с экрана' }].slice(0, d.zaxira).map((z, i) => <span key={i} className="gp-zaxira-k">{tr(z)}</span>)}</div>
        : d.tel2 ? <JamoaTelefon yorliq={tr({ uz: "2-telefon · boshqa o'yinchi", ru: '2-й телефон · другой игрок' })} son={d.son2} sonYangi={d.son2 === 9} /> : null}
    </div>
  </div>
);


// ===== SCREEN 0 — KIRISH (QKirish; ballsiz — J-026: correct false hammaga; «Aynan!» / «Qiziq fikr!») =====
const HOOK_OPTS = [
  { id: 'qayerdan', label: { uz: 'Bu son qayerdan va nimani sanaydi', ru: 'Откуда это число и что оно считает' } },
  { id: 'kattami', label: { uz: 'Bu son boshqalarnikidan kattami', ru: 'Больше ли это число, чем у других' } },
  { id: 'oshirgan', label: { uz: 'Bu sonni qanday qilib oshirgansiz', ru: 'Как вы увеличили это число' } }
];
const HOOK_JAVOB = {
  qayerdan: { uz: <><b>Aynan!</b> «44» yolg'iz turibdi: nimani sanagani ham, qachon sanalgani ham ko'rinmaydi.</>, ru: <><b>Именно!</b> «44» стоит одно: не видно ни что оно считает, ни когда посчитано.</> },
  kattami: { uz: <><b>Qiziq fikr!</b> Solishtirish keyin bo'ladi — avval zal «44» nimani sanashini bilmoqchi.</>, ru: <><b>Интересная мысль!</b> Сравнение будет потом — сначала зал хочет знать, что считает «44».</> },
  oshirgan: { uz: <><b>Qiziq fikr!</b> Buni ham so'rashadi, lekin «44» ning o'zi hali nimani sanashi noma'lum.</>, ru: <><b>Интересная мысль!</b> Об этом тоже спросят, но что считает само «44», пока неизвестно.</> }
};
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
  <div className="gp-hook">
    <Zal savol={null} />
    <div className="gp-hook-k">
      <span className="gp-hook-y">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</span>
      {tanlov && <span className="gp-hook-bosh gp-halqa-b" aria-hidden="true" />}
      <b className="gp-hook-son">44</b>
      {tanlov && <span className="gp-hook-bosh gp-halqa-b" aria-hidden="true" />}
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
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · «Maydon Jamoa» pitchi', ru: 'Введение · питч «Maydon Jamoa»' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('gp-s0', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Raqamlaringiz zalni <A>ishontiradimi?</A></>, ru: <>Убедят ли ваши цифры <A>зал?</A></> })}
          mentor={<Mentor>{tr({ uz: "Mentor misolida zal ekranda faqat «44» ni ko'rdi: sizningcha, u birinchi nimani so'raydi?", ru: 'В примере Ментора зал увидел на экране только «44»: как вы думаете, о чём он спросит первым?' })}</Mentor>}
          maket={<HookMaket tanlov={picked} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={<>
            {picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
            {isLive && (picked !== null || live.mode === 'mentor') && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.label))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual — Sahna skeleti: telefon va besh bo'lak navbat bilan to'ladi, taymer 5:00 gacha, zal ustida ✓; bo'lak nomlari va grafik ochilmaydi — 2, 4-ekran kashfiyoti) =====
const REJA = [
  { t: { uz: "Pitchga sonlar qayerda qo'shilishini bilib olasiz", ru: 'Узнаете, где в питч добавляются числа' }, teg: { uz: "besh bo'lak", ru: 'пять частей' } },
  { t: { uz: "Sonlarni ustunlarda halol ko'rsatishni o'rganasiz", ru: 'Научитесь честно показывать числа столбиками' }, teg: { uz: 'grafik', ru: 'график' } },
  { t: { uz: <><Uz /> qanday o'sganini ko'rasiz</>, ru: <>Увидите, как рос <Uz /></> }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: 'Pitchni sherigingizga jonli demo bilan aytasiz', ru: 'Расскажете питч партнёру с живым демо' }, teg: { uz: 'jonli demo', ru: 'живое демо' } }
];
const RejaSahna = () => {
  const [n, setN] = useState(() => (kamHarakat() ? 5 : 0));
  const [sek, setSek] = useState(() => (kamHarakat() ? JAMI_VAQT : 0));
  useEffect(() => {
    if (kamHarakat()) return undefined;
    if (n < 5) { const t = setTimeout(() => setN(n + 1), 600); return () => clearTimeout(t); }
    if (sek < JAMI_VAQT) { const t = setTimeout(() => setSek(s => Math.min(JAMI_VAQT, s + 30)), 80); return () => clearTimeout(t); }
    return undefined;
  }, [n, sek]);
  const bolaklar = [0, 1, 2, 3, 4].map(i => ({ id: 'r' + i, nom: tr({ uz: `${i + 1}-bo'lak`, ru: `Часть ${i + 1}` }), holat: i < n ? 'tayyor' : 'bosh' }));
  return (
    <div className="gp-reja">
      <BeshDaqiqaSahna className="ixcham" telefon={<JamoaTelefon ekran="oyinlar" />} zal={{ ok: sek >= JAMI_VAQT }} bolaklar={bolaklar} taymer={{ jami: JAMI_VAQT, bolinish: false, sekund: sek }} />
    </div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun 5 daqiqalik pitchni <A>sonlaringiz bilan aytasiz.</A></>, ru: <>Сегодня — 5-минутный питч <A>с вашими числами.</A></> })}
      mentor={<Mentor>{tr({ uz: "Metrika hisobotingiz va tuzatilgan pitchingiz bugun kerak bo'ladi — ilovangiz telefonda ochilib tursin.", ru: 'Сегодня понадобятся ваш отчёт по метрикам и исправленный питч — держите приложение открытым на телефоне.' })}</Mentor>}
      chapYorliq={<>{tr({ uz: 'Dars oxirida', ru: 'В конце урока' })} <code className="gp-teg">{tr({ uz: "metrikali pitch: o'sish grafigi — dalil", ru: "питч с метриками: график роста — довод" })}</code></>}
      chap={<RejaSahna />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — BESH BO'LAK (QTushuncha markaziy: bashorat → 3 tugma → yangi bo'lak, halol gap, besh daqiqa; atama «Raqamlar bo'lagi» — misoldan keyin) =====
const S2_TAXMIN = [
  { k: 'oldin', t: { uz: 'Muammodan oldin', ru: 'Перед проблемой' } },
  { k: 'demo', ok: true, t: { uz: 'Jonli demodan keyin', ru: 'После живого демо' } },
  { k: 'oxir', t: { uz: 'Keyingi qadamdan keyin', ru: 'После следующего шага' } }
];
const S2_SAVOL = { uz: "Sonlar pitchning qayeriga qo'shiladi?", ru: 'Куда в питче добавляются числа?' };
const S2_TUGMA = [{ uz: "Yangi bo'lak", ru: 'Новая часть' }, { uz: 'Halol gap', ru: 'Честная фраза' }, { uz: 'Besh daqiqa', ru: 'Пять минут' }];
const MentorGrafikIxcham = ({ sarlavha = true, ajrat }) => <OsishGrafigi korinish="ixcham" haftalar={MENTOR_GRAFIK()} sarlavha={sarlavha ? tr(JAMOA_PITCH.raqamlar.nima) : null} ajrat={ajrat} />;
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live } = useJonli();
  const avval = storedAnswer !== undefined;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [nom, setNom] = useState(avval);
  const [zalI, setZalI] = useState(avval ? 5 : -1);
  const done = q >= 3 && zalI >= 5;
  const tugadi = useTugadi(done, 1300, avval);
  const ipucha = useIpucha(!!taxmin && q < 3, q);
  useEffect(() => { if (done && !avval) { onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'beshBolak', 0, true, 0); } }, [done]); // eslint-disable-line
  useEffect(() => { if (q < 1 || nom) return undefined; const t = setTimeout(() => setNom(true), kamHarakat() ? 0 : 1200); return () => clearTimeout(t); }, [q]); // eslint-disable-line
  // «Besh daqiqa»: zal pufagi besh bo'lak ustidan birma-bir o'tadi, oxirida ✓
  useEffect(() => {
    if (q < 3 || zalI >= 5) return undefined;
    const t = setTimeout(() => setZalI(i => i + 1), kamHarakat() ? 0 : (zalI < 0 ? 500 : 420));
    return () => clearTimeout(t);
  }, [q, zalI]);
  const bos = (i) => { if (i !== q) return; setQ(q + 1); };
  const tx = S2_TAXMIN.find(x => x.k === taxmin);
  const ids = q >= 1 ? BOLAK_ID : BOLAK_ID.filter(id => id !== 'raqamlar');
  const bolaklar = ids.map(id => {
    if (id === 'raqamlar') return {
      id, nom: nom ? tr(BOLAK_NOM.raqamlar) : '', nomYangi: nom && !avval, yangi: !avval, holat: q >= 2 ? 'ok' : 'joriy', belgi: q >= 2 ? '✓' : null,
      grafik: <MentorGrafikIxcham />, qatorlar: [tr(JAMOA_PITCH.raqamlar.bosh), q >= 2 && tr(JAMOA_PITCH.raqamlar.halolGap)].filter(Boolean), yangiQ: q === 2 && !avval ? 1 : undefined
    };
    const m = JAMOA_PITCH[id];
    const qator = id === 'muammo' ? tr(m.gap) : id === 'yechim' ? tr(m.gap) : id === 'demo' ? tr(m.ozgaradi) : tr(m);
    const joriy = q >= 3 && zalI >= 0 && zalI < 5 && BOLAK_ID[zalI] === id;
    return { id, nom: tr(BOLAK_NOM[id]), holat: joriy ? 'joriy' : 'ok', belgi: '✓', qatorlar: [qator] };
  });
  const zal = q >= 3
    ? (zalI >= 5 ? { ok: true } : { savol: tr(ZAL_SAVOL[BOLAK_ID[Math.max(0, zalI)]]) })
    : q === 2 ? { ok: true } : q === 1 ? { savol: tr(ZAL_SAVOL.raqamlar) } : { savol: null };
  const sahna = (
    <BeshDaqiqaSahna className="ixcham" telefon={<JamoaTelefon ekran="oyinlar" />} zal={zal} bolaklar={bolaklar}
      taymer={{ jami: q >= 3 ? JAMI_VAQT : 180, bolinish: q >= 3 }} />
  );
  const izohlar = (
    <div className="gp-izohlar">
      {nom && <Atama y={tr({ uz: "Raqamlar bo'lagi", ru: 'Часть «Цифры»' })}>{tr({ uz: "Raqamlar bo'lagida ilova ishga tushgach sanalgan sonlar ko'rsatiladi.", ru: 'В части «Цифры» показывают числа, посчитанные после запуска приложения.' })}</Atama>}
      {q >= 3 && <QIzoh>{tr({ uz: "Bu mashqdagi taqsimot: o'z pitchingizda bo'lak qisqaroq yoki uzunroq bo'lishi mumkin, jami 5 daqiqa.", ru: 'Это распределение для упражнения: в вашем питче часть может быть короче или длиннее, всего 5 минут.' })}</QIzoh>}
    </div>
  );
  const harakat = taxmin && !tugadi && <TugmaQator tugmalar={S2_TUGMA} joriy={q} onBos={bos} yopiq={q >= 3} />;
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · besh bo'lak", ru: 'Понятие · пять частей' })} screen={screen} scrollSignal={q + (taxmin ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Tugmalarni bosing', ru: 'Нажмите кнопки' })} (${Math.min(q, 3)}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Besh daqiqalik pitchda <A>sonlar qayerda turadi?</A></>, ru: <>Где в пятиминутном питче <A>стоят числа?</A></> })}
        mentor={<Mentor>{tr({ uz: "O'tgan modulda pitch 3 daqiqa va to'rt bo'lak edi: tugmalarni birma-bir bosib, taymerga qarang.", ru: "В прошлом модуле питч длился 3 минуты и состоял из четырёх частей: нажимайте кнопки по очереди и смотрите на таймер." })}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />
          : !done && <BashoratQ savol={tr(S2_SAVOL)} javob={tr(tx.t)} />}
        harakat={harakat}
        vizual={<div className="gp-s2">{sahna}{izohlar}{ipucha && <p className="gp-ipucha fade-step">{tr({ uz: "Yoqilgan tugmani bosing — pitch va taymer qanday o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как меняются питч и таймер.' })}</p>}</div>}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: 'jonli demodan keyin', ru: 'после живого демо' })} />}
          matn={tr({ uz: "Bizda 5 daqiqalik pitch besh bo'lakdan iborat: muammo, yechim, jonli demo, raqamlar va keyingi qadam.", ru: 'У нас 5-минутный питч состоит из пяти частей: проблема, решение, живое демо, цифры и следующий шаг.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ C, INLINE_KEYS.s3 = 2; ikkinchi misol — uy vazifalari ilovasi, P-002) =====
const S3Vizual = () => (
  <div className="gp-tviz-q gp-mini-b">
    {BOLAK_ID.map(id => <span key={id} className={cxx('gp-mini-bo', id === 'raqamlar' && 'on')}><b>{tr(BOLAK_NOM[id])}</b>{id === 'raqamlar' && <em className="gp-tush">«{tr({ uz: "Ishga tushgach 2 haftada 23 kishi ro'yxatdan o'tdi", ru: 'После запуска за 2 недели зарегистрировались 23 человека' })}»</em>}</span>)}
  </div>
);
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · besh bo'lak", ru: 'Проверка · пять частей' })}
    questionText="Uy vazifalari ilovasi pitchi. Qaysi gap Raqamlar bo'lagiga chiqadi?"
    question={tr({ uz: <h2 className="title h-ask">Uy vazifalari ilovasi pitchi. Qaysi gap <A>Raqamlar bo'lagiga</A> chiqadi?</h2>, ru: <h2 className="title h-ask">Питч приложения для домашних заданий. Какая фраза идёт <A>в часть «Цифры»?</A></h2> })}
    options={[
      { uz: "«5 sinfdoshdan 4 tasi vazifani chatda yo'qotgan»", ru: '«У 4 из 5 одноклассников задание потерялось в чате»' },
      { uz: '«Keyingi haftada 2 ta sinf chatiga havola yuboramiz»', ru: '«На следующей неделе отправим ссылку в 2 чата классов»' },
      { uz: "«Ishga tushgach 2 haftada 23 kishi ro'yxatdan o'tdi»", ru: '«После запуска за 2 недели зарегистрировались 23 человека»' },
      { uz: "«Ilova 6 ta fanning vazifasini bir joyda ko'rsatadi»", ru: '«Приложение показывает задания 6 предметов в одном месте»' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Bu son ilova ishga tushgach sanalgan — u Raqamlar bo'lagida.", ru: 'Это число посчитано после запуска приложения — оно в части «Цифры».' }}
    explainWrong={{
      0: { uz: "Bu intervyu sanog'i: u muammo borligini ko'rsatadi.", ru: 'Это подсчёт из интервью: он показывает, что проблема есть.' },
      1: { uz: "Bu hali bo'lmagan ish — u keyingi qadam.", ru: 'Это то, чего ещё не было, — это следующий шаг.' },
      3: { uz: "Bu ilova nima qilishi — u yechim bo'lagida.", ru: 'Это то, что делает приложение, — это часть «Решение».' },
      default: { uz: 'Qaysi son ilova ishga tushgandan keyin sanalgan?', ru: 'Какое число посчитано после запуска приложения?' }
    }}
    vizual={<S3Vizual />} />
);

// ===== SCREEN 4 — O'SISH GRAFIGI (QTushuncha ketma-ket, 4 tugma; OsishGrafigi katta, buzilgan → to'liq; telefon yo'q — SABOQ 24) =====
const S4_TAXMIN = [
  { k: 'ikki', ok: true, t: { uz: 'Ikki barobarga yaqin', ru: 'Почти вдвое' } },
  { k: 'besh', t: { uz: 'Besh barobarga yaqin', ru: 'Почти впятеро' } },
  { k: 'on', t: { uz: "O'n barobarga yaqin", ru: 'Почти вдесятеро' } }
];
const S4_SAVOL = { uz: "Noldan chizilsa, «44» ustuni «20» dan necha barobar baland bo'ladi?", ru: 'Если чертить от нуля, во сколько раз столбик «44» будет выше «20»?' };
const S4_TUGMA = [{ uz: 'Noldan boshlang', ru: 'Начните с нуля' }, { uz: 'Oraliqni teng qiling', ru: 'Сделайте шаг равным' }, { uz: "Sana va sonni qo'ying", ru: 'Поставьте дату и число' }, { uz: 'Nima sanalganini yozing', ru: 'Напишите, что посчитано' }];
const S4_YORLIQ = [{ uz: 'noldan', ru: 'от нуля' }, { uz: 'teng oraliq', ru: 'равный шаг' }, { uz: 'sana va son', ru: 'дата и число' }, { uz: 'nima sanalgani', ru: 'что посчитано' }];
const S4_SANA = [{ uz: 'ishga tushirish kuni', ru: 'день запуска' }, { uz: "3 kun o'tib", ru: 'через 3 дня' }, { uz: "bir hafta o'tib", ru: 'через неделю' }, { uz: "ikki hafta o'tib", ru: 'через две недели' }];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live } = useJonli();
  const avval = storedAnswer !== undefined;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 4 : 0);
  const [chiqdi, setChiqdi] = useState(avval);
  const done = q >= 4;
  const tugadi = useTugadi(done, 1400, avval);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && !avval) { onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'grafik', 0, true, 0); } }, [done]); // eslint-disable-line
  useEffect(() => { if (q !== 2 || chiqdi) return undefined; const t = setTimeout(() => setChiqdi(true), kamHarakat() ? 0 : 1600); return () => clearTimeout(t); }, [q]); // eslint-disable-line
  const bos = (i) => { if (i !== q) return; setQ(q + 1); };
  const tx = S4_TAXMIN.find(x => x.k === taxmin);
  const haftalar = MASHQ_GRAFIK.haftalar.map((soni, i) => ({ id: i, soni, sana: tr(S4_SANA[i]) })).filter(h => !(chiqdi && h.id === 1));
  const grafik = (
    <OsishGrafigi korinish="katta" haftalar={haftalar} okPast={q >= 1 ? 0 : MASHQ_GRAFIK.ok}
      sarlavha={q >= 4 ? tr(JAMOA_PITCH.raqamlar.nima) : null} sanaKo={q >= 3} sonKo={q >= 3} sanash={q === 3 && !avval} farqKo={q >= 4}
      chiqqan={q >= 2 && !chiqdi ? [1] : []} chiqYorliq={tr({ uz: "3 kun o'tib — hafta emas", ru: 'через 3 дня — не неделя' })} />
  );
  const yorliqlar = q > 0 && <div className="gp-yorliqlar">{S4_YORLIQ.slice(0, q).map((y, i) => <span key={i} className="gp-yorl fade-step">{tr(y)}</span>)}{done && <span className="gp-yorl atama fade-step">{tr({ uz: "o'sish grafigi", ru: 'график роста' })}</span>}</div>;
  const vizual = (
    <div className="gp-s4">
      {!tugadi && <span className="gp-kulrang-y">{tr({ uz: 'Mentor misoli sonlari · mashq: ataylab buzilgan', ru: 'Числа из примера Ментора · упражнение: испорчено нарочно' })}</span>}
      <div className="gp-s4-gr">
        <Zal savol={q >= 4 ? null : tr(ZAL_SAVOL.raqamlar)} ok={q >= 4} className="ixcham" />
        {grafik}
      </div>
      {yorliqlar}
      {q >= 3 && <span className="gp-kulrang fade-step">{tr({ uz: "Mentor misolida aniq kun o'rnida — necha hafta o'tgani; sizning grafigingizda — sana.", ru: 'В примере Ментора вместо точного дня — сколько прошло недель; в вашем графике — дата.' })}</span>}
      {q >= 4 && <span className="gp-kulrang fade-step">{tr({ uz: "Ustun — shu kungacha jami; ustunlar farqi — o'sha haftadagi qo'shimcha: 18, keyin 6.", ru: 'Столбик — всего к этому дню; разница столбиков — прибавка за ту неделю: 18, потом 6.' })}</span>}
      {done && <QIzoh>{tr({ uz: "Bir xil oraliqdagi sonlar ustunlari o'sish grafigi deyiladi; nima sanalgani sarlavhada yoziladi.", ru: 'Столбики чисел с одинаковым шагом называются графиком роста; что посчитано, пишут в заголовке.' })}</QIzoh>}
      {ipucha && <p className="gp-ipucha fade-step">{tr({ uz: "Yoqilgan tugmani bosing — ustunlar qanday o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как меняются столбики.' })}</p>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · grafik', ru: 'Понятие · график' })} screen={screen} scrollSignal={q + (taxmin ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Tugmalarni bosing', ru: 'Нажмите кнопки' })} (${q}/4)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Ustunlar sonni qachon <A>halol ko'rsatadi?</A></>, ru: <>Когда столбики <A>честно показывают</A> число?</> })}
        mentor={<Mentor>{tr({ uz: 'Mentor misolining sonlaridan chizilgan grafikda kamchiliklar bor: tugmalarni birma-bir bosib, ustunlarga qarang.', ru: 'В графике по числам из примера Ментора есть недочёты: нажимайте кнопки по очереди и смотрите на столбики.' })}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />
          : !done && <BashoratQ savol={tr(S4_SAVOL)} javob={tr(tx.t)} />}
        harakat={taxmin && !tugadi && <TugmaQator tugmalar={S4_TUGMA} joriy={q} onBos={bos} yopiq={done} />}
        vizual={vizual}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: 'ikki barobarga yaqin', ru: 'почти вдвое' })} />}
          matn={tr({ uz: "Bu misolda grafik noldan va haftama-hafta chizildi: 20 dan 44 gacha o'sish ikki barobardan sal ko'p.", ru: 'В этом примере график начерчен от нуля и по неделям: рост с 20 до 44 — чуть больше чем вдвое.' })} />}
      />
    </Stage>
  );
};


// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; ✔ A, INLINE_KEYS.s5 = 0; ikkinchi misol — to'garaklar sayti, P-002) =====
const S5Vizual = () => (
  <div className="gp-tviz-q gp-ikki-gr">
    {[{ y: { uz: '30 dan', ru: 'от 30' }, ok: 30 }, { y: { uz: 'noldan', ru: 'от нуля' }, ok: 0 }].map((g, i) => (
      <div key={i} className="gp-ikki-g">
        <span className="gp-yorl">{tr(g.y)}</span>
        <OsishGrafigi korinish="ixcham" haftalar={[{ sana: '', soni: 34 }, { sana: '', soni: 46 }]} okPast={g.ok} sonKo={false} sanaKo={false} className="sonsiz" />
      </div>
    ))}
    <span className="gp-yorl atama">{tr({ uz: 'noldan', ru: 'от нуля' })}</span>
  </div>
);
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · grafik', ru: 'Проверка · график' })}
    questionText="To'garaklar sayti grafigida ustunlar 30 dan boshlangan. Zal o'sishni qanday ko'radi?"
    question={tr({ uz: <h2 className="title h-ask">To'garaklar sayti grafigida ustunlar 30 dan boshlangan. <A>Zal o'sishni qanday ko'radi?</A></h2>, ru: <h2 className="title h-ask">На графике сайта кружков столбики начинаются с 30. <A>Каким зал увидит рост?</A></h2> })}
    options={[
      { uz: 'Haqiqatdagidan ancha katta', ru: 'Гораздо больше, чем на деле' },
      { uz: "Haqiqatdagidek, o'zgarishsiz", ru: 'Как на деле, без изменений' },
      { uz: 'Haqiqatdagidan ancha kichik', ru: 'Гораздо меньше, чем на деле' },
      { uz: "Ustunlar tengdek, o'sishsiz", ru: 'Столбики почти равны, без роста' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Pastki qismi kesilgan ustunlarda farq kattalashib ko'rinadi.", ru: 'У столбиков с обрезанным низом разница выглядит больше.' }}
    explainWrong={{
      1: { uz: "Pastki qismi kesilsa, ustunlar nisbati o'zgaradi.", ru: 'Если обрезать низ, соотношение столбиков меняется.' },
      2: { uz: "Kesilganda kichik ustun ko'proq qisqaradimi?", ru: "При обрезке маленький столбик укорачивается сильнее?" },
      3: { uz: "Ustunlar hali ham sonlarga qarab har xil.", ru: 'Столбики всё ещё разные — по числам.' },
      default: { uz: "Grafik noldan boshlanmasa, ustunlar nisbati nima bo'ladi?", ru: 'Что будет с соотношением столбиков, если график не от нуля?' }
    }}
    vizual={<S5Vizual />} />
);

// ===== SCREEN 6 — UZUM (QVoqea, PM keys K1 — faqat bank matni; SABOQ 2, 3, 8, 26). Manba: PM_Prompt_v8.md K1 (171–174) · tayanch 5 =====
// Sahna: chapda «Uzum» ilovasi ekrani (narsa kartalari chizmasi), o'ngda vaqt chizig'i uch nuqta bilan. Boshqa son, asoschi, narx chizilmaydi (bankda yo'q).
const UZUM_KADR = [
  { h: { uz: '2022-yil oktabr · ishga tushdi', ru: 'Октябрь 2022 · запуск' }, m: { uz: "Uzum — internet-magazin, u 2022-yil oktabrida ishga tushgan. Saytdan emas, yetkazib berishdan boshlagan: o'z avtoparki, topshirish punktlari, ertasi kuni yetkazish.", ru: 'Uzum — интернет-магазин, он запустился в октябре 2022 года. Начал не с сайта, а с доставки: свой автопарк, пункты выдачи, доставка на следующий день.' } },
  { h: { uz: '2024-yil mart · birinchi «unicorn»', ru: 'Март 2024 · первый «единорог»' }, m: { uz: "Bahosi 1 milliard dollardan oshgan kompaniya «unicorn» deyiladi. 2024-yil martida Uzum mamlakatning birinchi «unicorn»i bo'lgan.", ru: "Компанию, которую оценили дороже 1 миллиарда долларов, называют «единорогом». В марте 2024 года Uzum стал первым «единорогом» страны." } },
  { h: { uz: '2025 · oyiga ≈17 million', ru: '2025 · ≈17 миллионов в месяц' }, m: { uz: "2025-yilda Uzum'ning oyiga taxminan 17 million foydalanuvchisi bo'lgan. Bu son bir oyni sanaydi va yili bilan aytilgan.", ru: 'В 2025 году у Uzum было около 17 миллионов пользователей в месяц. Это число считает один месяц и названо с годом.' } }
];
const UZ_TAXMIN = [
  { k: 'kun', t: { uz: 'Bir kunda foydalanganlarni', ru: 'Пользовавшихся за день' } },
  { k: 'oy', ok: true, t: { uz: 'Bir oyda foydalanganlarni', ru: 'Пользовавшихся за месяц' } },
  { k: 'hamma', t: { uz: 'Hamma yillarda foydalanganlarni', ru: 'Пользовавшихся за все годы' } }
];
const UZ_SAVOL = { uz: "Uzum'ning 2025-yildagi «17 million» soni nimani sanaydi?", ru: 'Что считает число «17 миллионов» у Uzum в 2025 году?' };
const NARSA = [
  <path key="0" d="M7 6 L10 4 H14 L17 6 L20 9 L17 11 V20 H7 V11 L4 9 Z" />,
  <rect key="1" x="8" y="3" width="8" height="18" rx="2" />,
  <circle key="2" cx="12" cy="12" r="8" />,
  <path key="3" d="M6 9 H18 L17 21 H7 Z M9 9 V6 a3 3 0 0 1 6 0 V9" />,
  <path key="4" d="M4 14 a8 6 0 0 1 16 0 V17 H4 Z" />,
  <rect key="5" x="5" y="6" width="14" height="12" rx="3" />
];
const NARSA_RANG = ['#E8A13A', '#3D8BD9', '#5FA37A', '#E07A5F', '#B5679E', '#4A90A4'];
const UzumSahna = ({ b }) => (
  <div className="gp-uzs">
    <div className="gp-uz-tel" aria-hidden="true">
      <span className="gp-uz-bar"><Uz /></span>
      <span className="gp-uz-ekran">{NARSA.map((n, i) => <span key={i} className="gp-uz-narsa" style={{ '--i': i }}><svg viewBox="0 0 24 24" fill={NARSA_RANG[i]}>{n}</svg></span>)}</span>
    </div>
    <div className="gp-uz-vaqt">
      <div className={cxx('gp-uz-nuqta', 'on')}>
        <i /><b>{tr({ uz: '2022 · oktabr', ru: '2022 · октябрь' })}</b>
        <span className="gp-uz-yetk" aria-hidden="true">
          <svg viewBox="0 0 40 20"><rect x="1" y="5" width="22" height="10" rx="2" fill={UZUM_RANG} /><path d="M23 8 H31 L36 12 V15 H23 Z" fill={UZUM_RANG} opacity="0.75" /><circle cx="8" cy="16" r="2.6" fill="#2A2730" /><circle cx="30" cy="16" r="2.6" fill="#2A2730" /></svg>
          <svg viewBox="0 0 24 20"><path d="M2 9 L12 2 L22 9 V19 H2 Z" fill="#E7E3F4" stroke={UZUM_RANG} strokeWidth="1.4" /><rect x="9" y="12" width="6" height="7" fill={UZUM_RANG} /></svg>
        </span>
      </div>
      {b >= 1 && <div className="gp-uz-nuqta on">
        <i /><b>{tr({ uz: '2024 · mart', ru: '2024 · март' })}</b>
        <span className="gp-uz-yorl" key="u">unicorn</span>
      </div>}
      {b >= 1 && <div className={cxx('gp-uz-nuqta', b >= 2 ? 'on' : 'sav')}>
        <i>{b === 1 ? '?' : ''}</i>{b >= 2 && <b>2025</b>}
        {b >= 2 && <span className="gp-uz-yorl" key="o">{tr({ uz: 'oyiga ≈17 million foydalanuvchi', ru: '≈17 миллионов пользователей в месяц' })}</span>}
      </div>}
      {b >= 2 && <span className="gp-kulrang fade-step">{tr({ uz: "Shu voqeaning soni — sizga me'yor emas.", ru: "Число из этой истории — не норма для вас." })}</span>}
    </div>
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const kadr = UZUM_KADR[b];
  const kutish = b === 1 && !taxmin;
  const tx = UZ_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Uz /> · {b + 1}/3</>;
  const tanla = (k) => { setTaxmin(k); setB(2); };
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} scrollSignal={b} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Voqea davomi', ru: 'Продолжение истории' })} (${b + 1}/3)`} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Uz />'ning sonlari yonida <A>nima turadi?</A></>, ru: <>Что стоит <A>рядом с числами</A> <Uz />?</> })}
        nuqtalar={<>
          <Mentor key={'m' + b}>{uzAjrat(tr(kadr.m))}</Mentor>
          <div className="gp-nuq"><span className="gp-nuq-l">{yorliq}</span>{UZUM_KADR.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="gp-voqea">
          <span className="gp-voqea-h" key={'h' + b}>{tr(kadr.h)}</span>
          {taxmin && !done && <BashoratQ savol={uzAjrat(tr(UZ_SAVOL))} javob={tr(tx.t)} />}
          <div className={cxx('gp-voqea-qator', (kutish || done) && 'ikki')}>
            <Zoomable><UzumSahna b={b} /></Zoomable>
            {done && <QXulosa><XulosaQ natija={tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: 'bir oyda foydalanganlarni', ru: 'пользовавшихся за месяц' })} />}
              matn={tr({ uz: "Bu voqeada har son yili bilan aytilgan, «17 million» esa nimani sanashi bilan — bir oyda.", ru: 'В этой истории каждое число названо с годом, а «17 миллионов» — с тем, что оно считает: за месяц.' })} /></QXulosa>}
            {kutish && <div className="gp-chorla-b"><QBashorat yorliq={yorliq} savol={uzAjrat(tr(UZ_SAVOL))} variantlar={UZ_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={tanla} /></div>}
          </div>
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; ✔ D, INLINE_KEYS.s7 = 3; Uzum qoidasi — Mentor misolida) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Uzum'dagidek", ru: 'Проверка · как у Uzum' })}
    questionText="Uzum voqeasidagidek, Mentor «44» sonini pitchda qanday aytadi?"
    question={tr({ uz: <h2 className="title h-ask"><Uz /> voqeasidagidek, Mentor «44» sonini <A>pitchda qanday aytadi?</A></h2>, ru: <h2 className="title h-ask">По примеру истории <Uz />: <A>как Ментор назовёт число «44» в питче?</A></h2> })}
    options={[
      { uz: "Uzum'ning soni bilan solishtirib", ru: 'Сравнив с числом Uzum' },
      { uz: "Ro'yxatdagi ismlarni o'qib berib", ru: 'Зачитав имена из списка' },
      { uz: "Sonni katta shriftda ko'rsatib", ru: 'Показав число крупным шрифтом' },
      { uz: 'Qachon va nimani sanashini aytib', ru: 'Сказав, когда и что оно считает' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Uzum'ning sonlari ham yili va nimani sanashi bilan aytilgan.", ru: 'Числа Uzum тоже названы с годом и с тем, что они считают.' }}
    explainWrong={{
      0: { uz: "Uzum'ning soni — shu voqeaniki, sizga me'yor emas.", ru: 'Число Uzum — из этой истории, для вас не норма.' },
      1: { uz: 'Pitchda ism aytilmaydi — zal sonni tushunishi kerak.', ru: 'В питче имена не называют — зал должен понять число.' },
      2: { uz: 'Katta shrift sonni tushuntirmaydi.', ru: 'Крупный шрифт не объясняет число.' },
      default: { uz: "Uzum'ning sonlari yonida nima turgan edi?", ru: 'Что стояло рядом с числами Uzum?' }
    }}
    vizual={<div className="gp-tviz-q"><MentorGrafikIxcham ajrat={2} /></div>} />
);

// ===== SCREEN 8 — JONLI DEMO (QTushuncha ketma-ket, 3 tugma; jonli demo rejimi — tayanch 9.16; taymer va bo'laklar yo'q — P-008) =====
const S8_TAXMIN = [
  { k: 'bir', t: { uz: 'Bitta', ru: 'Одно' } },
  { k: 'ikki', ok: true, t: { uz: 'Ikkita', ru: 'Два' } },
  { k: 'uch', t: { uz: 'Uchta', ru: 'Три' } }
];
const S8_SAVOL = { uz: "Ekran o'zi yangilanishini ko'rsatish uchun nechta qurilma kerak?", ru: 'Сколько устройств нужно, чтобы показать, что экран обновляется сам?' };
const S8_TUGMA = [{ uz: 'Bitta telefonda', ru: 'На одном телефоне' }, { uz: 'Ikkinchi qurilma', ru: 'Второе устройство' }, { uz: "Zaxira yo'li", ru: 'Запасной путь' }];
const DEMO_BOSH = { son1: 8, qoshildi1: false, db: 8, tel2: false, son2: 8, konvert: 0, k: 0, zaxira: 0, dbYangi: false };
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live } = useJonli();
  const avval = storedAnswer !== undefined;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [d, setD] = useState(() => (avval ? { ...DEMO_BOSH, son1: 9, qoshildi1: true, db: 9, tel2: true, son2: 9 } : DEMO_BOSH));
  const [band, setBand] = useState(false);
  const [zal, setZal] = useState(() => (avval ? { ok: true } : { savol: null }));
  const done = q >= 3 && !band;
  const tugadi = useTugadi(done, 1300, avval);
  const ipucha = useIpucha(!!taxmin && q < 3 && !band, q);
  const tRef = useRef([]);
  useEffect(() => () => tRef.current.forEach(clearTimeout), []);
  useEffect(() => { if (done && !avval) { onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'demo', 0, true, 0); } }, [done]); // eslint-disable-line
  const keyin = (ms, fn) => { tRef.current.push(setTimeout(fn, kamHarakat() ? 0 : ms)); };
  const bos = (i) => {
    if (i !== q || band) return;
    setBand(true);
    if (i === 0) {
      setD(x => ({ ...x, son1: 9, qoshildi1: true, konvert: 1, k: x.k + 1 }));
      keyin(900, () => setD(x => ({ ...x, konvert: 0, db: 9, dbYangi: true })));
      keyin(1300, () => { setZal({ savol: tr({ uz: "Boshqalarda ham o'zgardimi?", ru: 'У других тоже изменилось?' }) }); setD(x => ({ ...x, dbYangi: false })); setBand(false); setQ(1); });
    } else if (i === 1) {
      setD(x => ({ ...x, son1: 8, qoshildi1: false, db: 8, tel2: true, son2: 8 }));
      keyin(900, () => setD(x => ({ ...x, son1: 9, qoshildi1: true, konvert: 1, k: x.k + 1 })));
      keyin(1800, () => setD(x => ({ ...x, konvert: 2, db: 9, dbYangi: true, k: x.k + 1 })));
      keyin(2700, () => { setD(x => ({ ...x, konvert: 0, son2: 9, dbYangi: false })); setZal({ ok: true }); setBand(false); setQ(2); });
    } else {
      setD(x => ({ ...x, zaxira: 1 }));
      keyin(500, () => setD(x => ({ ...x, zaxira: 2 })));
      keyin(1000, () => { setD(x => ({ ...x, zaxira: 3 })); setBand(false); setQ(3); });
    }
  };
  const tx = S8_TAXMIN.find(x => x.k === taxmin);
  const korinish = tugadi ? { ...d, zaxira: 0, tel2: true, son2: 9 } : d;
  const vizual = (
    <div className="gp-s8">
      <Zal {...zal} className="ixcham" />
      <JonliDemo d={korinish} />
      {tugadi && <div className="gp-zaxira past">{[{ uz: 'sherik telefoni', ru: 'телефон партнёра' }, { uz: "brauzer ko'rinishi", ru: 'браузерная версия' }, { uz: 'ekran videosi', ru: 'видео с экрана' }].map((z, i) => <span key={i} className="gp-zaxira-k">{tr(z)}</span>)}</div>}
      <div className="gp-izohlar">
        {q >= 1 && <QIzoh>{tr({ uz: "Bitta telefonda zal siz bosgan tugmani ko'radi — ekran o'zi yangilanganini emas.", ru: 'На одном телефоне зал видит кнопку, которую вы нажали, — а не то, что экран обновился сам.' })}</QIzoh>}
        {q >= 2 && <QIzoh>{tr({ uz: "2-telefonda son pastga tortmasdan, odatda bir necha soniyada o'zgaradi — zal real vaqtni shunda ko'radi.", ru: "На 2-м телефоне число меняется без потягивания вниз — обычно за несколько секунд. Так зал и видит реальное время." })}</QIzoh>}
        {q >= 3 && <span className="gp-kulrang fade-step">{tr({ uz: "Ilova ochilmasa — ekran videosini ko'rsating yoki jonli demoni og'zaki aytib bering.", ru: 'Если приложение не откроется — покажите видео с экрана или расскажите живое демо устно.' })}</span>}
      </div>
      {ipucha && <p className="gp-ipucha fade-step">{tr({ uz: "Yoqilgan tugmani bosing — qaysi qurilmada nima o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, что меняется на каком устройстве.' })}</p>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · jonli demo', ru: 'Понятие · живое демо' })} screen={screen} scrollSignal={q + (taxmin ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Tugmalarni bosing', ru: 'Нажмите кнопки' })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Ekran o'zi yangilanishini <A>zal qanday ko'radi?</A></>, ru: <>Как зал увидит, <A>что экран обновляется сам?</A></> })}
        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va zal nimani ko'rishiga qarang.", ru: 'Нажимайте кнопки по очереди и смотрите, что видит зал.' })}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S8_SAVOL)} variantlar={S8_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />
          : !done && <BashoratQ savol={tr(S8_SAVOL)} javob={tr(tx.t)} />}
        harakat={taxmin && !tugadi && <TugmaQator tugmalar={S8_TUGMA} joriy={q} onBos={bos} yopiq={q >= 3 || band} />}
        vizual={vizual}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: 'ikkita', ru: 'два' })} />}
          matn={tr({ uz: "Bu misolda jonli demo ikki qurilmada: birida bosiladi, ikkinchisida son o'zi o'zgaradi.", ru: 'В этом примере живое демо на двух устройствах: на одном нажимают, на другом число меняется само.' })} />}
      />
    </Stage>
  );
};


// ===== SCREEN 9 — KOD YOZISH: O'SISH GRAFIGI (QKod + HtmlCompiler; tayanch 4, Qaror-0 20, PM-082) =====
// Starter oddiy satrlardan yig'iladi (backtick yo'q), qatorlar ≤ 70 belgi (SABOQ 37). Faqat bitta JS fayl (app.js) — kompilyator birinchi JS faylni ulaydi.
// Tekshiruv natija DOM idan (iframe ichida, sinxron): #sarlavha · har .ustun balandligi / soni · .joy dagi b va span.
// «Bajardim»: kompilyator natija oynasi iframe — dars uning DOM ini o'qiy olmaydi; nuqtalar shu kodning haftalar ro'yxatidan o'qiladi (uchala shart aynan shu ro'yxatni tekshirgan).
const kunRaqam = (s) => Date.UTC(Number(s.slice(0, 4)), Number(s.slice(5, 7)) - 1, Number(s.slice(8, 10))) / 86400000;
// pm-m10d10-hisobot.kunlar (kunlik yangi ro'yxatdan o'tganlar) → har 7 kunda jami (0-kun — birinchi sana; 7 kun to'lmagan oxirgi bo'lak tashlanadi)
const haftalikJami = (kunlar) => {
  const k = (Array.isArray(kunlar) ? kunlar : [])
    .filter(x => x && /^\d{4}-\d{2}-\d{2}$/.test(String(x.sana)) && Number.isFinite(Number(x.soni)))
    .map(x => ({ sana: String(x.sana), soni: Number(x.soni) }))
    .sort((a, b) => (a.sana < b.sana ? -1 : a.sana > b.sana ? 1 : 0));
  if (!k.length) return [];
  const d0 = kunRaqam(k[0].sana), dN = kunRaqam(k[k.length - 1].sana);
  const out = [];
  for (let d = d0; d <= dN; d += 7) {
    const jami = k.filter(x => kunRaqam(x.sana) <= d).reduce((s, x) => s + x.soni, 0);
    out.push({ sana: new Date(d * 86400000).toISOString().slice(0, 10), soni: jami });
  }
  return out;
};
const KOD_IZ = {
  bosh: { uz: "// Grafik ma'lumoti: har hafta — shu kungacha jami (Mentor misoli)", ru: '// Данные графика: каждая неделя — всего к этому дню (пример Ментора)' },
  boshSiz1: { uz: "// sizning sonlaringiz: metrika hisobotidagi kunlar bo'yicha", ru: '// ваши числа: из подсчёта по дням в отчёте по метрикам,' },
  boshSiz2: { uz: '// sanoqdan, har 7 kunda jami', ru: '// всего за каждые 7 дней' },
  sar: { uz: ' // shu joyni siz yozasiz: nima sanalgani', ru: ' // это место пишете вы: что посчитано' },
  bal: { uz: ' // eng baland ustun, piksel', ru: ' // самый высокий столбик, пиксели' },
  katta: { uz: '// eng katta son — noldan boshlab qidiramiz (bu qism tayyor)', ru: '// самое большое число — ищем, начиная с нуля (эта часть готова)' },
  har: { uz: '// har hafta — bitta ustun', ru: '// каждая неделя — один столбик' },
  noldan: { uz: ' // shu joyni siz yozasiz: noldan', ru: ' // это место пишете вы: от нуля' },
  son: { uz: ' // shu joyni siz yozasiz: ustida — son', ru: ' // это место пишете вы: сверху — число' },
  sana: { uz: ' // shu joyni siz yozasiz: ostida — sana', ru: ' // это место пишете вы: снизу — дата' }
};
const JS_Q = (s) => '"' + String(s).replace(/\\/g, '').replace(/"/g, "'") + '"';
const kodStarter = (haftalar, sizniki, t) => [
  ...(sizniki ? [KOD_IZ.boshSiz1[t], KOD_IZ.boshSiz2[t]] : [KOD_IZ.bosh[t]]),
  'const haftalar = [',
  ...haftalar.map((h, i) => '  { sana: ' + JS_Q(h.sana) + ', soni: ' + h.soni + ' }' + (i < haftalar.length - 1 ? ',' : '')),
  '];',
  'const sarlavha = "";' + KOD_IZ.sar[t],
  'const BALANDLIK = 160;' + KOD_IZ.bal[t],
  '',
  KOD_IZ.katta[t],
  'let engKatta = 0;',
  'haftalar.forEach(function (h) {',
  '  if (h.soni > engKatta) engKatta = h.soni;',
  '});',
  '',
  'document.getElementById("sarlavha").textContent = sarlavha;',
  '',
  KOD_IZ.har[t],
  'haftalar.forEach(function (h) {',
  '  const ustun = document.createElement("div");',
  '  ustun.className = "ustun";',
  '  ustun.style.height = 0 + "px";' + KOD_IZ.noldan[t],
  '',
  '  const son = document.createElement("b");',
  '  son.textContent = "";' + KOD_IZ.son[t],
  '',
  '  const sana = document.createElement("span");',
  '  sana.textContent = "";' + KOD_IZ.sana[t],
  '',
  '  const joy = document.createElement("div");',
  '  joy.className = "joy";',
  '  joy.appendChild(son);',
  '  joy.appendChild(ustun);',
  '  joy.appendChild(sana);',
  '  document.getElementById("grafik").appendChild(joy);',
  '});',
  ''
].join('\n');
const KOD_INDEX = '<h3 id="sarlavha"></h3>\n<div id="grafik"></div>\n';
const KOD_SHART_IFODA = [
  '(function(){var s=document.getElementById("sarlavha");return s&&s.textContent.trim().length>=5?"ha":"yoq";})()',
  '(function(){if(typeof haftalar==="undefined"||typeof BALANDLIK==="undefined")return "yoq";var u=document.querySelectorAll("#grafik .ustun");if(u.length<1||u.length!==haftalar.length)return "yoq";var mx=0,i;for(i=0;i<haftalar.length;i++){if(haftalar[i].soni>mx)mx=haftalar[i].soni;}if(mx<=0)return "yoq";var top=0;for(i=0;i<u.length;i++){var h=parseFloat(u[i].style.height)||0;if(Math.abs(h-haftalar[i].soni/mx*BALANDLIK)>2)return "yoq";if(h>top)top=h;}return Math.abs(top-BALANDLIK)<=2?"ha":"yoq";})()',
  '(function(){if(typeof haftalar==="undefined")return "yoq";var j=document.querySelectorAll("#grafik .joy");if(j.length<2||j.length!==haftalar.length)return "yoq";for(var i=0;i<j.length;i++){var b=j[i].querySelector("b"),s=j[i].querySelector("span");if(!b||!s)return "yoq";if(b.textContent.trim()!==String(haftalar[i].soni))return "yoq";if(s.textContent.trim()!==String(haftalar[i].sana).trim())return "yoq";}return "ha";})()'
];
const KOD_SHART = [
  { uz: '1 — Sarlavhaga grafikda nima sanalganini yozing.', ru: '1 — Напишите в заголовке, что посчитано на графике.' },
  { uz: "2 — Ustun balandligi songa mos bo'lsin: noldan.", ru: '2 — Высота столбика по числу: от нуля.' },
  { uz: '3 — Har ustun ustida son, ostida sana tursin.', ru: '3 — Над каждым столбиком число, под ним дата.' }
];
const KOD_VAZIFA = [
  { uz: 'Sarlavhaga nima sanalganini yozing.', ru: 'Напишите в заголовке, что посчитано.' },
  { uz: 'Ustun balandligini noldan hisoblang.', ru: 'Посчитайте высоту столбика от нуля.' },
  { uz: "Har ustun ustiga sonini, ostiga sanasini qo'ying.", ru: 'Поставьте над каждым столбиком число, под ним дату.' }
];
const kodPreviewCss = () => '#grafik{display:flex;align-items:flex-end;gap:18px;min-height:210px;padding:8px 6px 0;border-bottom:2px solid ' + T.ink + '}'
  + '.joy{flex:1;max-width:96px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px}'
  + '.joy b{font:700 14px Manrope,system-ui,sans-serif;color:' + T.ink + '}'
  + '.ustun{width:100%;background:' + T.accent + ';border-radius:6px 6px 0 0}'
  + '.joy span{font:500 12px Manrope,system-ui,sans-serif;color:' + T.ink2 + ';text-align:center;line-height:1.25}'
  + '#sarlavha{font:700 16px Manrope,system-ui,sans-serif;margin:0 0 10px;min-height:20px}';
const kodTask = (starter) => ({
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: "app.js — o'sish grafigini yakunlang", ru: 'app.js — допишите график роста' },
  files: [
    { name: 'app.js', lang: 'js', starter, placeholder: { uz: "// bo'sh joylar: sarlavha, balandlik, son, sana", ru: '// пустые места: заголовок, высота, число, дата' } },
    { name: 'index.html', lang: 'html', starter: { uz: KOD_INDEX, ru: KOD_INDEX } }
  ],
  previewCss: kodPreviewCss(),
  requirements: KOD_SHART.map((s, i) => ({ id: 'sh' + (i + 1), label: KOD_VAZIFA[i], check: C.evalEquals(KOD_SHART_IFODA[i], 'ha', s) }))
});
// Darvoza-mashq (PM-082 c/e): to'g'ri — h.soni / engKatta * BALANDLIK
const KOD_DARVOZA = [
  { id: 'kichik', kod: '(h.soni - engKichik) * 10', x: { uz: "Eng kichik ustun nolga tushib qoladi — bu noldan emas.", ru: 'Самый маленький столбик падает до нуля — это не от нуля.' } },
  { id: 'togri', kod: 'h.soni / engKatta * BALANDLIK', ok: true },
  { id: 'length', kod: 'BALANDLIK / haftalar.length', x: { uz: "Hamma ustun bir xil bo'ladi — son ko'rinmaydi.", ru: 'Все столбики одинаковые — числа не видно.' } }
];
const darvozaP = (id, haftalar) => {
  const s = haftalar.map(h => h.soni);
  if (id === 'togri') { const mx = Math.max(1, ...s); return s.map(v => v / mx); }
  if (id === 'kichik') { const mn = Math.min(...s); const h = s.map(v => (v - mn) * 10); const mx = Math.max(1, ...h); return h.map(v => v / mx); }
  if (id === 'length') return s.map(() => 1);
  return s.map(() => 0);
};
const kodOqi = (code) => {
  const s = String(code || '');
  const m = s.match(/const\s+haftalar\s*=\s*\[([\s\S]*?)\];/);
  const haftalar = [];
  if (m) { const re = /sana\s*:\s*(["'])(.*?)\1\s*,\s*soni\s*:\s*(\d+)/g; let r = re.exec(m[1]); while (r) { haftalar.push({ sana: r[2], soni: Number(r[3]) }); r = re.exec(m[1]); } }
  const sm = s.match(/const\s+sarlavha\s*=\s*(["'])(.*?)\1/);
  return { haftalar, sarlavha: sm ? sm[2] : '' };
};
const mentorSonlarimi = (g) => g.length === 3 && g.every((h, i) => h.soni === JAMOA_PITCH.raqamlar.grafik[i].soni);
// Kod namunasi (o'qish uchun; nusxalanmaydi — PM-082 d): bo'sh joylar ajratilgan
const KodNamuna = ({ kod }) => {
  const L = kod.split('\n');
  const i0 = L.findIndex(l => l.startsWith('const sarlavha'));
  const i1 = L.findIndex(l => l.includes('ustun.style.height'));
  const qism = [L[i0], '…', ...L.slice(i1 - 2, i1 + 8)];
  return (
    <pre className="gp-kod" onCopy={(e) => e.preventDefault()} aria-label="app.js">
      {qism.map((l, i) => {
        const izI = l.indexOf('//');
        if (izI < 0) return <span key={i}>{l}{'\n'}</span>;
        return <span key={i}>{l.slice(0, izI)}<b className="gp-kod-iz">{l.slice(izI)}</b>{'\n'}</span>;
      })}
    </pre>
  );
};
const QKOD_ONG = ['muh', 'arrir'].join('');
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const st = storedAnswer || {};
  const [manba] = useState(() => { const h = lsO(HISOBOT_KEY) || {}; const w = haftalikJami(h.kunlar); return w.length >= 2 ? { haftalar: w, sizniki: true } : { haftalar: MENTOR_GRAFIK(), sizniki: false }; });
  const starter = useMemo(() => ({ uz: kodStarter(manba.haftalar, manba.sizniki, 'uz'), ru: kodStarter(manba.haftalar, manba.sizniki, 'ru') }), [manba]);
  const task = useMemo(() => kodTask(starter), [starter]);
  const [gpick, setGpick] = useState(st.gpick || null);
  const [miss, setMiss] = useState(null);
  const missRef = useRef(!!st.gateMiss);
  const [yordam, setYordam] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(typeof st.code === 'string' ? st.code : null);
  const [kodOk, setKodOk] = useState(!!st.kodOk);
  const [done, setDone] = useState(!!st.done);
  const [yetmaydi, setYetmaydi] = useState(!!st.yetmaydi);
  const [qulf, setQulf] = useState(null);
  const [uch, qatlam] = useUchish();
  const grRef = useRef(null), bolakRef = useRef(null);
  const stage2 = gpick === 'togri' || isMentor || done;
  const natija = useMemo(() => (code ? kodOqi(code) : { haftalar: [], sarlavha: '' }), [code]);
  const grafik = natija.haftalar.length >= 2 ? natija.haftalar : manba.haftalar;
  const pickGate = (g) => {
    if (gpick === 'togri') return;
    setGpick(g.id);
    if (g.ok) setMiss(null); else { missRef.current = true; setMiss({ id: g.id, k: Date.now() }); }
  };
  const javob = (patch) => onAnswer(screen, { stage: 'koding', screenIdx: screen, gpick, gateMiss: missRef.current, code, kodOk, done, yetmaydi, solved: true, picked: true, correct: false, ...patch });
  const finish = ({ codes, code: htmlCode }) => {
    const yangi = (codes && codes['app.js']) || htmlCode || code || tr(starter);
    setOpen(false); setCode(yangi); setKodOk(true); setQulf(null);
    if (!done) javob({ code: yangi, kodOk: true });
  };
  const bajardim = () => {
    if (gpick !== 'togri') { setQulf('darvoza'); return; }
    if (!kodOk) { setQulf('shart'); return; }
    if (done) return;
    const g = grafik.map(h => ({ sana: h.sana, soni: h.soni }));
    const sar = tt(natija.sarlavha);
    const p = pitchOl();
    const b = p.bolaklar || {};
    pitchYoz({ bolaklar: { ...b, raqamlar: { ...(b.raqamlar || {}), grafik: g, nima: sar, manba: manba.sizniki ? tr({ uz: "metrika hisoboti (kunlar bo'yicha sanoq)", ru: 'отчёт по метрикам (подсчёт по дням)' }) : '' } } });
    const nishon = !missRef.current && !mentorSonlarimi(g);
    setDone(true); setYetmaydi(false); setQulf(null);
    setTimeout(() => uch(grRef.current, bolakRef.current, tr(BOLAK_NOM.raqamlar)), 60);
    javob({ done: true, yetmaydi: false, correct: nishon, grafik: g });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'kod', 0, true, 0);
  };
  const nuqtaYetmaydi = () => {
    if (done) return;
    const p = pitchOl(); const b = p.bolaklar || {};
    pitchYoz({ bolaklar: { ...b, raqamlar: { ...(b.raqamlar || {}), grafik: [] } } });
    setYetmaydi(true); setQulf(null);
    javob({ yetmaydi: true, done: false, correct: false });
  };
  const bajLabel = gpick !== 'togri' ? { uz: 'Avval ustun savolini yeching', ru: 'Сначала решите вопрос о столбике' } : !kodOk ? { uz: 'Avval uchala shartni bajaring', ru: 'Сначала выполните три условия' } : { uz: 'Bajardim — grafik chizildi', ru: 'Готово — график начерчен' };
  const mGap = manba.sizniki
    ? { uz: "Kod tepasidagi ro'yxatda haftalik sonlaringiz turibdi: bo'sh joylarni to'ldiring, ustunlar shu sonlardan chiziladi.", ru: 'В списке вверху кода ваши недельные числа: заполните пустые места — столбики начертятся по этим числам.' }
    : { uz: "Kod tepasidagi ro'yxatda Mentor misolining sonlari turibdi: bo'sh joylarni to'ldiring, keyin ularni o'z haftalik sonlaringizga almashtiring.", ru: 'В списке вверху кода числа из примера Ментора: заполните пустые места, потом замените их своими недельными числами.' };
  const tayyor = done || yetmaydi || isMentor;
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · grafik', ru: 'Пишем код · график' })} screen={screen} scrollSignal={(gpick ? 1 : 0) + (kodOk ? 2 : 0) + (done ? 4 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tayyor} label={tayyor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Avval ustun savolini yeching', ru: 'Сначала решите вопрос о столбике' }) : tr({ uz: 'Grafikni chizing', ru: 'Начертите график' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Sonlardan o'sish grafigini chizadigan <A>kod yozamiz.</A></>, ru: <>Пишем <A>код,</A> который чертит график роста по числам.</> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        vazifa={<>
          {!stage2 ? (
            <div className="gp-darvoza-q">
              <span className="gp-darvoza-s">{tr({ uz: 'Qaysi qator ustunni noldan chizadi?', ru: 'Какая строка чертит столбик от нуля?' })}</span>
              <div className="gp-darvoza-ro gp-chorla">
                {KOD_DARVOZA.map(g => {
                  const silk = miss && miss.id === g.id;
                  return <QChip key={silk ? g.id + '-' + miss.k : g.id} className="gp-darvoza" silk={silk} holat={silk ? 'err' : gpick === g.id ? 'on' : undefined} onClick={() => pickGate(g)}><code>{g.kod}</code></QChip>;
                })}
              </div>
              {miss && <QXato>{tr(KOD_DARVOZA.find(g => g.id === miss.id).x)}</QXato>}
            </div>
          ) : <QIzoh>{fmtCode(tr({ uz: "Ustun balandligi — `h.soni / engKatta * BALANDLIK`: eng katta son eng baland ustun bo'ladi.", ru: 'Высота столбика — `h.soni / engKatta * BALANDLIK`: самое большое число — самый высокий столбик.' }))}</QIzoh>}
          <ol className={cxx('gp-vazifa', !stage2 && 'xira')}>{KOD_VAZIFA.map((v, i) => <li key={i} className={cxx(kodOk && 'ok')}><i>{kodOk ? '✓' : i + 1}</i><span>{tr(v)}</span></li>)}</ol>
          {done && <QXulosa>{tr({ uz: "Grafik tayyor — u Raqamlar bo'lagiga qo'yildi.", ru: 'График готов — он поставлен в часть «Цифры».' })}</QXulosa>}
          {yetmaydi && !done && <span className="gp-kulrang fade-step">{tr({ uz: "Bitta son ham yetadi: uni Raqamlar bo'lagida sanasi va manbasi bilan aytasiz.", ru: 'Хватит и одного числа: назовёте его в части «Цифры» с датой и источником.' })}</span>}
        </>}
        yordam={stage2 && !done && <div className="gp-kyordam">
          <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
          {yordam && <div className="gp-yordam fade-step">
            <span>{fmtCode(tr({ uz: "Ustun balandligi — son eng katta songa bo'linib, `BALANDLIK` ga ko'paytiriladi: eng katta son eng baland ustun bo'ladi. Son va sana `h` ichida: `h.soni`, `h.sana`.", ru: 'Высота столбика — число делят на самое большое и умножают на `BALANDLIK`: самое большое число — самый высокий столбик. Число и дата внутри `h`: `h.soni`, `h.sana`.' }))}</span>
            <span>{fmtCode(tr({ uz: "Eslatma (oldingi kod oynalaridan): `forEach` — ro'yxatdagi har element uchun bir marta ishlaydi · `textContent` — elementga matn yozadi · `style.height` — element balandligi.", ru: 'Напоминание (из прошлых окон кода): `forEach` — срабатывает один раз для каждого элемента списка · `textContent` — пишет текст в элемент · `style.height` — высота элемента.' }))}</span>
            <span>{tr({ uz: "O'z sonlaringiz qayerdan: metrika hisobotidagi kunlar bo'yicha sanoq (dars uni haftalik jamiga aylantirib qo'ygan); yangi hafta o'tgan bo'lsa — o'sha so'rovni Neon'da qayta «Run» qiling yoki sanoq sahifasidagi ro'yxatdan o'tganlar sonini oling.", ru: 'Откуда ваши числа: подсчёт по дням в отчёте по метрикам (урок превратил его в недельные итоги); если прошла новая неделя — снова нажмите «Run» для того запроса в Neon или возьмите число зарегистрировавшихся со страницы подсчёта.' })}</span>
            <span>{tr({ uz: "Ikki hafta nuqtasi hali yo'q bo'lsa — sonlarni o'ylab topmang va oraliqni sun'iy tenglashtirmang: Mentor sonlari bilan chizing va pastdagi «Grafikka nuqta yetmaydi»ni bosing.", ru: 'Если точек за две недели ещё нет — не придумывайте числа и не выравнивайте шаг искусственно: чертите по числам Ментора и нажмите внизу «Для графика не хватает точек».' })}</span>
          </div>}
        </div>}
        bajardim={stage2 && !isMentor && <div className="gp-baj">
          {!done && <div className="gp-baj-q">
            <QTugma className={cxx(kodOk && !done && 'gp-halqa')} disabled={gpick !== 'togri' || !kodOk} onClick={bajardim}>{tr(bajLabel)}</QTugma>
            {!yetmaydi && <QTugma ikkinchi onClick={nuqtaYetmaydi}>{tr({ uz: 'Grafikka nuqta yetmaydi', ru: 'Для графика не хватает точек' })}</QTugma>}
          </div>}
        </div>}
        {...{ [QKOD_ONG]: <div className="gp-kodoyna">
          {!stage2 && <div className="gp-dv-gr"><OsishGrafigi korinish="katta" className="sarsiz" haftalar={manba.haftalar} pList={darvozaP(gpick, manba.haftalar)} sonKo={!!gpick} sanaKo sarlavha={null} /></div>}
          {stage2 && !done && <div className="gp-mgap fade-step"><img src={MENTOR_IMG} alt="" aria-hidden="true" /><span>{tr({ uz: "Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijani shu yerda ko'rasiz.", ru: 'Нажмите кнопку — откроется окно кода: вы пишете код и сразу видите результат.' })}</span></div>}
          {stage2 && !isMentor && <div className="gp-amal"><QTugma className={cxx(!kodOk && 'gp-halqa')} ikkinchi={kodOk} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma></div>}
          {stage2 && (kodOk
            ? <OsishGrafigi grRef={grRef} korinish="katta" haftalar={grafik} sarlavha={tt(natija.sarlavha) || null} sanash={!done} className="gp-natija-gr" />
            : <KodNamuna kod={code || tr(starter)} />)}
          {done && <div className="gp-tush-b" ref={bolakRef}><BolakKarta b={{ id: 'raqamlar', nom: tr(BOLAK_NOM.raqamlar), holat: 'yozildi', grafik: <OsishGrafigi korinish="ixcham" haftalar={grafik} sarlavha={tt(natija.sarlavha) || null} /> }} /></div>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      />
      {qatlam}
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), kod oynasi qobig'i tashqi zoomni bekor qiladi */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={task} starterCode={code || tr(starter)} storageKey="pm-m10d12-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};


// ===== SCREEN 10 — PITCH YOZISH (QMustaqil, USTAXONA — bittadan karta, besh bo'lak; SABOQ 9, 13, 17, 29; E 43, E 53) · yozadi pm-m10d12-pitch.bolaklar · nishon fiveParts =====
// Kirish (P-046): pm-m10d11-pitch (bolaklar, davolar) · pm-m10d10-hisobot (bosh, royxat, zaxira.ish, tuzatishQator) · pm-m10d1-lending (foydalar) · 9-ekran grafigi. Yo'q bo'lsa — bo'sh maydon.
const MAYDON = {
  muammo: [{ k: 'gap', n: { uz: 'Muammo gapi', ru: 'Фраза о проблеме' }, ph: { uz: 'Kim nimadan qiynaladi?', ru: 'Кто и от чего страдает?' } }, { k: 'dalil', n: { uz: 'Dalil', ru: "Довод" }, ph: { uz: 'Son yoki kuzatuv — qayerdan?', ru: 'Число или наблюдение — откуда?' } }],
  yechim: [{ k: 'yechim', n: { uz: 'Yechim', ru: 'Решение' }, ph: { uz: 'Mahsulot nima qiladi va odamga nima beradi?', ru: 'Что делает продукт и что даёт человеку?' }, katta: true }],
  demo: [{ k: 'bosiladi', n: { uz: '1-qurilmada', ru: 'На 1-м устройстве' }, ph: { uz: 'Qaysi tugmani bosasiz?', ru: 'Какую кнопку нажмёте?' } }, { k: 'ozgaradi', n: { uz: '2-qurilmada', ru: 'На 2-м устройстве' }, ph: { uz: "Nima o'zi o'zgaradi?", ru: 'Что изменится само?' } }],
  raqamlar: [{ k: 'bosh', n: { uz: 'Bosh raqam', ru: "Главное число" }, ph: { uz: 'Nima sanaladi va qancha?', ru: 'Что считается и сколько?' } }, { k: 'halolGap', n: { uz: 'Halol gap', ru: 'Честная фраза' }, ph: { uz: 'Qanday sanaldi, xulosaga yetadimi?', ru: 'Как посчитано, хватает ли для вывода?' }, katta: true }],
  keyingi: [{ k: 'keyingi', n: { uz: 'Keyingi qadam', ru: 'Следующий шаг' }, ph: { uz: 'Keyingi haftada nima qilasiz?', ru: 'Что сделаете на следующей неделе?' } }]
};
const BOR_MAYDON = { k: 'manba', n: { uz: 'Bor soningiz', ru: 'Ваше число' }, ph: { uz: 'Nima sanaldi va qancha?', ru: 'Что посчитано и сколько?' } };
const fOl = (f, id, k) => (id === 'yechim' ? f.yechim : id === 'keyingi' ? f.keyingi : (f[id] || {})[k]) || '';
const fYoz = (f, id, k, v) => (id === 'yechim' ? { ...f, yechim: v } : id === 'keyingi' ? { ...f, keyingi: v } : { ...f, [id]: { ...(f[id] || {}), [k]: v } });
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normT = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const TEXNO_RE = /(^|[^a-z])(react|expo|nestjs|neon|render|netlify|socket\.io)(?![a-z])/;
const VADA_RE = /(^|[^a-z'])(tez orada|albatta|yetamiz|aniq bo'ladi)(?![a-z'])/;
const BAHO_RE = /(^|[^a-z'])(yomon|zerikarli|yoqmadi)(?![a-z'])/;
const PX = {
  dalil: { blok: false, t: { uz: "Muammo borligini nima ko'rsatadi? Son yoki kuzatuv yozing.", ru: 'Что показывает, что проблема есть? Напишите число или наблюдение.' } },
  texno: { blok: false, t: { uz: 'Bu texnologiya — mahsulot odamga nima beradi?', ru: "Это про технологию — а что продукт даёт человеку?" } },
  qurilma2: { blok: true, t: { uz: "Ikkinchi qurilmada nima o'zgarishini yozing.", ru: 'Напишите, что изменится на втором устройстве.' } },
  halol: { blok: true, t: { uz: 'Halol gap: son qanday sanaldi, xulosaga yetadimi?', ru: 'Честная фраза: как посчитано число, хватает ли для вывода?' } },
  sinfdosh: { blok: false, t: { uz: 'Sinfdoshlar ham sanalgan — buni halol gapda ayting.', ru: 'Одноклассников тоже посчитали — скажите это в честной фразе.' } },
  vada: { blok: false, t: { uz: "Bu va'da — keyingi haftada aynan nima qilasiz?", ru: 'Это обещание — что именно сделаете на следующей неделе?' } },
  keyingi: { blok: true, t: { uz: 'Keyingi haftadagi bitta ishni yozing.', ru: 'Напишите одно дело на следующую неделю.' } },
  ozgarmadi: { blok: true, t: { uz: "Matn o'zgarmadi — varaqdagi izohni qayta o'qing.", ru: "Текст не изменился — перечитайте комментарий на листе." } }
};
// Tekshiruv (PM-108): birinchi topilgan xato; blok — o'tkazmaydi, yo'naltiruvchisi ikkinchi «Saqlash» bilan o'tadi
function bolakTekshir(id, f, sinfdoshBor) {
  if (id === 'muammo' && !tt(f.muammo && f.muammo.dalil)) return { x: 'dalil', joy: 'dalil' };
  if (id === 'yechim' && TEXNO_RE.test(normT(f.yechim))) return { x: 'texno', joy: 'yechim' };
  if (id === 'demo' && !tt(f.demo && f.demo.ozgaradi)) return { x: 'qurilma2', joy: 'ozgaradi' };
  if (id === 'raqamlar') {
    const h = normT(f.raqamlar && f.raqamlar.halolGap);
    if (!h) return { x: 'halol', joy: 'halolGap' };
    if (sinfdoshBor && !h.includes('sinfdosh')) return { x: 'sinfdosh', joy: 'halolGap' };
    if (VADA_RE.test(h)) return { x: 'vada', joy: 'halolGap' };
  }
  if (id === 'keyingi') {
    const k = normT(f.keyingi);
    if (!k) return { x: 'keyingi', joy: 'keyingi' };
    if (VADA_RE.test(k)) return { x: 'vada', joy: 'keyingi' };
  }
  return null;
}
const bolakTayyormi = (id, f) => (id === 'keyingi' ? true : id === 'raqamlar' ? !!(tt(f.raqamlar && f.raqamlar.bosh) || tt(f.raqamlar && f.raqamlar.halolGap) || tt(f.raqamlar && f.raqamlar.manba)) : !!tt(fOl(f, id, MAYDON[id][0].k)));
const dalilMatn = (d) => (d ? [tt(d.son) || tt(d.yozuv), tt(d.manba), tt(d.qachon)].filter(Boolean).join(' · ') : '');
// Kirish ma'lumoti — bir marta o'qiladi (P-046)
const kirishOl = () => {
  const p11 = lsO(PITCH11_KEY) || {};
  const h = lsO(HISOBOT_KEY) || {};
  const l = lsO(LEND_KEY) || {};
  const davolar = Array.isArray(p11.davolar) ? p11.davolar : [];
  const bl = p11.bolaklar || {};
  const md = davolar.find(d => d && d.bolak === 'muammo' && d.dalil && d.qaror !== 'olib-tashlandi');
  const zaxiraJ = davolar.filter(d => d && d.bolak === 'demo' && d.dalil && (d.qaror === 'qoldi' || d.qaror === 'qayta-yozildi') && /\d/.test(String(tt(d.yangiGap) || tt(d.gap)) + ' ' + dalilMatn(d.dalil)))
    .map(d => ({ gap: tt(d.yangiGap) || tt(d.gap), dalil: dalilMatn(d.dalil) }));
  const kd = davolar.find(d => d && d.bolak === 'keyingi' && d.qaror !== 'olib-tashlandi');
  const tq = h.tuzatishQator;
  const bosh = h.bosh && tq !== 'bosh' && tt(h.bosh.nima) ? tt(h.bosh.nima) + ': ' + (h.bosh.soni ?? '') + (h.bosh.sana ? ' (' + h.bosh.sana + ')' : '') : '';
  const royxat = h.royxat && Number.isFinite(Number(h.royxat.soni)) && tq !== 'royxat' ? { soni: Number(h.royxat.soni), sinfdosh: Number(h.royxat.sinfdosh) || 0 } : null;
  return {
    f: {
      muammo: { gap: tt(bl.muammo), dalil: md ? dalilMatn(md.dalil) : '' },
      yechim: tt(bl.yechim),
      demo: { bosiladi: tt(bl.demo), ozgaradi: '' },
      raqamlar: { grafik: [], nima: '', bosh, halolGap: '', manba: '' },
      keyingi: tt(bl.keyingi)
    },
    foydalar: (Array.isArray(l.foydalar) ? l.foydalar : []).map(x => tt(typeof x === 'string' ? x : x && x.foyda)).filter(Boolean).slice(0, 3),
    zaxiraJ, royxat, tuzatish: tq === 'bosh' || tq === 'royxat' ? tq : null,
    sinfdoshBor: !!(h.royxat && Number(h.royxat.sinfdosh) > 0),
    rejalar: [h.zaxira && tt(h.zaxira.ish), kd && (tt(kd.yangiGap) || tt(kd.gap))].filter(Boolean)
  };
};
const YORDAM10 = {
  muammo: { uz: "Mentor misolida: «O'yinchilar jamoaga odam yig'ishda qiynaladi.» Dalil: «Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.» (intervyu yozuvlari).", ru: "В примере Ментора: «Игрокам трудно собрать людей в команду». Довод: «У 4 из 5 игроков, которых я спросил, в последней игре не хватило людей или кто-то не пришёл» (записи интервью)." },
  yechim: { uz: "Mentor misolida: «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» va lendingdagi foydalar: «Bir bosishda jamoadasiz», «Nechta odam yig'ilganini so'rab o'tirmaysiz», «Kim aniq kelishini o'yindan oldin bilasiz».", ru: "В примере Ментора: «Организатор объявляет игру, игроки присоединяются одним нажатием и в день игры подтверждают, что придут», а польза на лендинге: «Одно нажатие — и вы в команде», «Не нужно спрашивать, сколько людей собралось», «До игры знаете, кто точно придёт»." },
  demo: { uz: "Mentor misolida: 1-telefonda «Shanba, 18:00» o'yinida «Qo'shilaman» bosiladi, 2-telefonda «8 / 10» o'rniga «9 / 10» o'zi chiqadi.", ru: 'В примере Ментора: на 1-м телефоне в игре «Суббота, 18:00» нажимают «Присоединяюсь», на 2-м вместо «8 / 10» само появляется «9 / 10».' },
  raqamlar: { uz: "Mentor misolida: grafik «Ro'yxatdan o'tganlar, jami» — 20, 38, 44; bosh raqam — haftada to'lgan o'yinlar: birinchi haftada 1, ikkinchi haftada 3; halol gap — «44 kishidan 11 tasi — sinfdoshlarim; ikkinchi haftada o'sish sekinlashdi (18 dan keyin 6).» Sonlarni o'zini ayting: «uch barobar oshdi» emas — «1 ta edi, 3 ta bo'ldi».", ru: "В примере Ментора: график «Зарегистрировались, всего» — 20, 38, 44; главное число — заполненные игры в неделю: в первую неделю 1, во вторую 3; честная фраза — «Из 44 человек 11 — мои одноклассники; во вторую неделю рост замедлился (после 18 — 6)». Называйте сами числа: не «выросло втрое», а «было 1, стало 3»." },
  keyingi: { uz: "Mentor misolida: «E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi — maqsad 50.»", ru: 'В примере Ментора: «После объявления организатор кнопкой «Поделиться ссылкой» отправляет ссылку своей команде — цель 50».' }
};
const YORDAM_UMUMIY = { uz: "Sonlaringiz kichik bo'lsa ham — o'zingizniki: o'ylab topilmaydi. 50 — baho emas. Web-trekda ham shunday: ikkinchi qurilma — boshqa brauzer oynasi.", ru: 'Даже если числа маленькие — они ваши: их не придумывают. 50 — не оценка. В веб-треке так же: второе устройство — другое окно браузера.' };
// Bo'lak kartasi (bitta katta karta; s10 va s11 tuzatishida bir xil): yorliq input ichida (E 43), tugmalar bir qatorda — asosiy · o'ngda «Yordam»
const BolakForma = ({ id, f, setF, xato, kirish, yordam, setYordam, onSaqla, inpRef, n, grafikTahrir, setGrafikTahrir, uch }) => {
  const grafik = (f.raqamlar && f.raqamlar.grafik) || [];
  const maydonlar = id === 'raqamlar' && !grafik.length ? [BOR_MAYDON, ...MAYDON.raqamlar] : MAYDON[id];
  const joriyK = maydonlar.find(m => !tt(fOl(f, id, m.k)))?.k;
  const tugRef = useRef({});
  const qosh = (matn, el, almashtir) => {
    const k = MAYDON[id][0].k; const eski = tt(fOl(f, id, k));
    if (!almashtir && eski.includes(matn)) return;
    setF(fYoz(f, id, k, almashtir ? matn : (eski ? eski + ' ' : '') + '«' + matn + '»'));
    if (uch && el && inpRef && inpRef.current) uch(el, inpRef.current, matn.slice(0, 32));
  };
  return (
    <div className={cxx('gp-karta', 'gp-kirish', xato && 'err')} key={id}>
      <span className="q-yorliq">{tr(BOLAK_NOM[id])}{n ? ' · ' + n + ' / 5' : ''}</span>
      {id === 'yechim' && kirish.foydalar.length > 0 && <div className="gp-tug-q gp-chorla">{kirish.foydalar.map((t, i) => <button key={i} type="button" ref={el => { tugRef.current['f' + i] = el; }} className="gp-foyda" onClick={() => qosh(t, tugRef.current['f' + i])}>{t}</button>)}</div>}
      {id === 'keyingi' && kirish.rejalar.length > 0 && <div className="gp-tug-q gp-chorla">{kirish.rejalar.map((t, i) => <button key={i} type="button" ref={el => { tugRef.current['r' + i] = el; }} className="gp-reja-t" onClick={() => qosh(t, tugRef.current['r' + i], true)}>{t}</button>)}</div>}
      {id === 'raqamlar' && grafik.length > 0 && (
        <div className="gp-f-gr">
          <OsishGrafigi korinish="ixcham" haftalar={grafik} sarlavha={tt(f.raqamlar.nima) || null} />
          <button type="button" className="gp-gr-ed gp-tahrir" onClick={() => setGrafikTahrir(!grafikTahrir)} aria-expanded={grafikTahrir} aria-label={tr({ uz: 'Grafikni tahrirlash', ru: 'Редактировать график' })}>✎</button>
          {grafikTahrir && <div className="gp-gr-jadval">{grafik.map((h, i) => (
            <span key={i} className="gp-gr-q">
              <input className="gp-inp kichik" value={h.sana} aria-label={tr({ uz: SANA_SOZ, ru: 'дата' })} onChange={(e) => setF(fYoz(f, 'raqamlar', 'grafik', grafik.map((x, j) => (j === i ? { ...x, sana: e.target.value } : x))))} />
              <input className="gp-inp kichik son" inputMode="numeric" value={String(h.soni)} aria-label={tr({ uz: 'son', ru: 'число' })} onChange={(e) => { const v = Number(String(e.target.value).replace(/\D/g, '')) || 0; setF(fYoz(f, 'raqamlar', 'grafik', grafik.map((x, j) => (j === i ? { ...x, soni: v } : x)))); }} />
            </span>
          ))}</div>}
        </div>
      )}
      {id === 'raqamlar' && !grafik.length && <span className="gp-kulrang">{tr({ uz: "Grafik yo'q — bor soningizni, sanasini va u qayerdan olinganini yozing.", ru: 'Графика нет — напишите своё число, дату и откуда оно взято.' })}</span>}
      {id === 'raqamlar' && kirish.tuzatish && <span className="gp-kulrang">{tr({ uz: "Metrika hisobotida bu son «tuzatish» olgan — tuzatilgan sonni yozing.", ru: 'В отчёте по метрикам это число получило «исправление» — напишите исправленное число.' })}</span>}
      {maydonlar.map(m => (
        <React.Fragment key={m.k}>
          {id === 'raqamlar' && m.k === 'halolGap' && kirish.royxat && <span className="gp-kulrang">{tr({ uz: `Hisobotingizda: ${kirish.royxat.soni} kishidan ${kirish.royxat.sinfdosh} tasi — sinfdosh.`, ru: `В вашем отчёте: из ${kirish.royxat.soni} человек ${kirish.royxat.sinfdosh} — одноклассники.` })}</span>}
          <label className={cxx('gp-maydon', m.katta && 'katta', xato && xato.joy === m.k && 'err')}>
            <span className="gp-mn">{tr(m.n)}</span>
            {m.katta
              ? <textarea ref={m.k === joriyK ? inpRef : undefined} rows={2} className={cxx('gp-inp', m.k === joriyK && 'gp-halqa-i')} value={fOl(f, id, m.k)} placeholder={tr(m.ph)} onChange={(e) => setF(fYoz(f, id, m.k, e.target.value))} />
              : <input ref={m.k === joriyK || (!joriyK && m === maydonlar[0]) ? inpRef : undefined} className={cxx('gp-inp', m.k === joriyK && 'gp-halqa-i')} value={fOl(f, id, m.k)} placeholder={tr(m.ph)} onChange={(e) => setF(fYoz(f, id, m.k, e.target.value))} onKeyDown={(e) => { if (e.key === 'Enter') onSaqla(); }} />}
          </label>
        </React.Fragment>
      ))}
      {id === 'raqamlar' && kirish.zaxiraJ.length > 0 && <div className="gp-zaxira-j">{kirish.zaxiraJ.map((z, i) => <span key={i} className="gp-kulrang">{tr({ uz: "Zal so'rasa — javobingiz tayyor:", ru: 'Если зал спросит — ответ готов:' })} {z.gap}{z.dalil ? ' · ' + z.dalil : ''}</span>)}</div>}
      {xato && <QXato>{tr(PX[xato.x].t)}</QXato>}
      {xato && !PX[xato.x].blok && <span className="gp-kulrang">{tr({ uz: 'Shunday qoldirsangiz — yana «Saqlash»ni bosing.', ru: "Если оставляете так — снова нажмите «Сохранить»." })}</span>}
      {yordam && <div className="gp-yordam fade-step"><span>{tr(YORDAM10[id])}</span><span>{tr(YORDAM_UMUMIY)}</span></div>}
      <div className="gp-karta-tug">
        <QTugma className={cxx(bolakTayyormi(id, f) && !joriyK && 'gp-halqa')} disabled={!bolakTayyormi(id, f)} onClick={onSaqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
        <QTugma ikkinchi className="gp-yordam-t" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
      </div>
    </div>
  );
};
// Sahnadagi bo'laklar (o'quvchi matni; uzun matn «…» bilan qisqaradi — SABOQ 29)
const pitchBolaklar = (f, opt = {}) => BOLAK_ID.map(id => ({
  id, nom: tr(BOLAK_NOM[id]), qatorlar: bolakQatorlar(f, id),
  grafik: id === 'raqamlar' && ((f.raqamlar && f.raqamlar.grafik) || []).length ? <OsishGrafigi korinish={opt.katta === 'raqamlar' ? 'katta' : 'ixcham'} haftalar={f.raqamlar.grafik} sarlavha={tt(f.raqamlar.nima) || null} /> : null,
  ...(opt.holat ? opt.holat(id) : { holat: 'yozildi' })
}));
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const st = storedAnswer || {};
  const [kirish] = useState(kirishOl);
  const [f, setF] = useState(() => {
    const p = pitchOl(); const b = p.bolaklar || {};
    const k = kirish.f;
    return {
      muammo: { ...k.muammo, ...(b.muammo || {}) },
      yechim: tt(b.yechim) || k.yechim,
      demo: { ...k.demo, ...(b.demo || {}) },
      raqamlar: { ...k.raqamlar, ...(b.raqamlar || {}), grafik: Array.isArray(b.raqamlar && b.raqamlar.grafik) ? b.raqamlar.grafik : [] },
      keyingi: tt(b.keyingi) || k.keyingi
    };
  });
  const [saq, setSaq] = useState(() => st.saqlangan || []);
  const [tahrir, setTahrir] = useState(null);
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [grT, setGrT] = useState(false);
  const [yangiK, setYangiK] = useYangi(1200);
  const [uch, qatlam] = useUchish();
  const inpRef = useRef(null), stripRef = useRef({});
  const done = BOLAK_ID.every(id => saq.includes(id));
  const joriy = tahrir || (done ? null : BOLAK_ID.find(id => !saq.includes(id)));
  const tugadi = useTugadi(done && !tahrir, 900, !!st.toliq);
  const nishonRef = useRef(!!st.toliq);
  useEffect(() => { setXato(null); setYumshoq(null); setYordam(false); setGrT(false); }, [joriy]);
  const grafikBor = ((f.raqamlar && f.raqamlar.grafik) || []).length > 0;
  const saqla = () => {
    if (!joriy) return;
    const t = bolakTekshir(joriy, f, kirish.sinfdoshBor);
    const imzo = joriy + '|' + JSON.stringify(f[joriy] ?? fOl(f, joriy, ''));
    if (t && (PX[t.x].blok || !(yumshoq && yumshoq.imzo === imzo && yumshoq.x === t.x))) { setXato(t); if (!PX[t.x].blok) setYumshoq({ x: t.x, imzo }); return; }
    uch(inpRef.current, stripRef.current[joriy], tr(BOLAK_NOM[joriy]));
    const yangiSaq = saq.includes(joriy) ? saq : [...saq, joriy];
    const p = pitchOl();
    const b = { ...(p.bolaklar || {}) };
    b.muammo = { gap: tt(f.muammo.gap), dalil: tt(f.muammo.dalil) };
    b.yechim = tt(f.yechim);
    b.demo = { bosiladi: tt(f.demo.bosiladi), ozgaradi: tt(f.demo.ozgaradi) };
    b.raqamlar = { grafik: (f.raqamlar.grafik || []).map(h => ({ sana: String(h.sana), soni: Number(h.soni) || 0 })), nima: tt(f.raqamlar.nima), bosh: tt(f.raqamlar.bosh), halolGap: tt(f.raqamlar.halolGap), manba: tt(f.raqamlar.manba) };
    b.keyingi = tt(f.keyingi);
    const tayyorBolaklar = Object.fromEntries(BOLAK_ID.map(id => [id, yangiSaq.includes(id) ? b[id] : (p.bolaklar || {})[id]]).filter(([, v]) => v !== undefined));
    pitchYoz({ bolaklar: { ...(p.bolaklar || {}), ...tayyorBolaklar } });
    setSaq(yangiSaq); setYangiK(joriy); setXato(null); setYumshoq(null); setTahrir(null);
    const toliq = BOLAK_ID.every(id => yangiSaq.includes(id));
    const birinchi = toliq && !nishonRef.current;
    if (birinchi) nishonRef.current = true;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: "Besh bo'lak", saqlangan: yangiSaq, toliq, solved: true, picked: true, correct: toliq });
    if (birinchi && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    if (tt((tayyorBolaklar.raqamlar || {}).halolGap)) jonliBelgi(live, ZONA_2, screen); // Mentor statistikasi: «Halol gapi borlar»
  };
  const strip = !isMentor && (
    <div className="gp-strip">
      <span className="gp-strip-l">{tr({ uz: 'Pitchim', ru: 'Мой питч' })} · {saq.length}/5</span>
      {BOLAK_ID.map(id => <button key={id} type="button" ref={el => { stripRef.current[id] = el; }} disabled={!saq.includes(id) || joriy === id} className={cxx('gp-strip-b', saq.includes(id) && 'ok', joriy === id && 'cur', yangiK === id && 'yangi')} onClick={() => setTahrir(id)}>{saq.includes(id) && <i>✓</i>}{tr(BOLAK_NOM[id])}</button>)}
    </div>
  );
  const forma = !isMentor && joriy && (
    <BolakForma id={joriy} f={f} setF={setF} xato={xato} kirish={kirish} yordam={yordam} setYordam={setYordam} onSaqla={saqla} inpRef={inpRef}
      n={BOLAK_ID.indexOf(joriy) + 1} grafikTahrir={grT} setGrafikTahrir={setGrT} uch={uch} />
  );
  const sahna = (isMentor || (done && !tahrir)) && (
    <Zoomable><BeshDaqiqaSahna className="keng" bolaklar={pitchBolaklar(isMentor ? JAMOA_F() : f, { holat: (id) => ({ holat: 'yozildi', onTahrir: isMentor ? undefined : () => setTahrir(id) }) })} taymer={{ jami: JAMI_VAQT, bolinish: true }} /></Zoomable>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={saq.length * 10 + (tahrir ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Besh bo'lakni yozing", ru: 'Напишите пять частей' })} (${saq.length}/5)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Pitchingizni <A>besh bo'lakka yozing.</A></>, ru: <>Напишите питч <A>из пяти частей.</A></> })}
        mentor={<Mentor>{tr({ uz: "Tuzatilgan pitchingiz va grafigingiz shu yerda: har bo'lakni tekshirib, «Saqlash»ni bosing.", ru: 'Ваш исправленный питч и график здесь: проверьте каждую часть и нажмите «Сохранить».' })}</Mentor>}
        qadamlar={strip}
        forma={<>{forma}{sahna}
          {done && !tahrir && !isMentor && <QXulosa>{grafikBor
            ? tr({ uz: "Besh bo'lak tayyor: Raqamlar bo'lagida grafik va halol gap bor.", ru: 'Пять частей готовы: в части «Цифры» есть график и честная фраза.' })
            : tr({ uz: "Besh bo'lak tayyor — Raqamlar bo'lagida bor soningiz va halol gap.", ru: 'Пять частей готовы — в части «Цифры» ваше число и честная фраза.' })}</QXulosa>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} sanoq={[{ y: { uz: "Besh bo'lakni yozganlar", ru: 'Написали пять частей' }, zona: PRACTICE_BASE }, { y: { uz: 'Halol gapi borlar', ru: "С честной фразой" }, zona: ZONA_2 }]} />}
        </>}
      />
      {qatlam}
    </Stage>
  );
};


// ===== SCREEN 11 — JUFTLIKDA PITCH (QMustaqil, juftlik + yakka rejim; 3 tugma: Ayting · Baholang · Tuzating) · yozadi pm-m10d12-pitch (vaqt, varaq, tuzatildi, varaqTur) · nishonlar livePitch, partFixed =====
const PITCHDAN_OLDIN = [
  { uz: "Ikki qurilmada ilova ochiq, ikkinchisida — boshqa akkaunt; «O'yinlar» ekranida belgi «Ulangan».", ru: "Приложение открыто на двух устройствах, на втором — другой аккаунт; на экране «Игры» значок «Подключено»." },
  { uz: "Demo uchun real odamlar qo'shilmagan o'yinni tanlang; demodan keyin «O'yindan chiqish».", ru: "Для демо выберите игру, к которой не присоединились реальные люди; после демо — «Выйти из игры»." },
  { uz: 'Web-trekda: ikkinchi oyna — boshqa brauzer yoki telefon brauzeri.', ru: 'В веб-треке: второе окно — другой браузер или браузер телефона.' },
  { uz: "Laptopda Neon, sanoq sahifasi va .env yopiq — ekran zalga ko'rinadi.", ru: 'На ноутбуке Neon, страница подсчёта и .env закрыты — экран виден залу.' }
];
const BOSH_VARAQ = () => BOLAK_ID.map(id => ({ bolak: id, belgi: null, izoh: '', tuzatildi: false }));
const varaqTayyormi = (v) => Array.isArray(v) && v.length === 5 && v.every(r => r.belgi);
const joriyBolakI = (s) => { let a = 0; for (let i = 0; i < VAQT.length; i++) { a += VAQT[i]; if (s < a) return i; } return VAQT.length - 1; };
const BaholashVaragi = ({ varaq, vaqt, faol, setQ, onBos, tanlov }) => (
  <div className="gp-varaq">
    <span className="q-yorliq">{tr({ uz: "Baholash varag'i", ru: 'Лист оценки' })}</span>
    {varaq.map((r, i) => {
      const ichi = <>
        <span className="gp-vq-n"><b>{tr(BOLAK_NOM[r.bolak])}</b><span>{tr(ZAL_SAVOL[r.bolak])}</span></span>
        {faol
          ? <span className="gp-vq-b gp-chorla">{['✓', '✗'].map(b => <button key={b} type="button" className={cxx('gp-vq-bel', r.belgi === b && (b === '✓' ? 'ok' : 'err'))} onClick={() => setQ(i, { belgi: b })} aria-label={b}>{b}</button>)}</span>
          : <span key={r.belgi || 'b'} className={cxx('gp-vq-bb', r.belgi === '✓' && 'ok', r.belgi === '✗' && 'err')}>{r.belgi || ''}</span>}
        <span className="gp-vq-iz">
          {faol ? <input className="gp-inp kichik" value={r.izoh} placeholder={tr({ uz: 'Nima yetishmadi?', ru: 'Чего не хватило?' })} aria-label={tr({ uz: 'izoh', ru: 'комментарий' })} onChange={(e) => setQ(i, { izoh: e.target.value })} />
            : (r.izoh ? <span className="gp-vq-izt">{r.izoh}</span> : <span className="gp-vq-bosh">—</span>)}
          {r.tuzatildi && <em className="gp-tuz">{tr({ uz: "o'zgartirildi", ru: 'изменено' })}</em>}
        </span>
      </>;
      return onBos && onBos(i)
        ? <button key={i} type="button" className={cxx('gp-vq-q', 'gp-vq-bos', tanlov === i && 'on', tanlov === null && 'gp-halqa-q')} onClick={() => onBos(i)(i)}>{ichi}</button>
        : <div key={i} className={cxx('gp-vq-q', r.belgi === '✗' && !r.tuzatildi && 'x')}>{ichi}</div>;
    })}
    <div className={cxx('gp-vq-vaqt', vaqt > JAMI_VAQT && 'oshdi')}><span>{tr({ uz: 'Vaqt', ru: 'Время' })}:</span> <b>{mss(vaqt)}</b></div>
  </div>
);
const VX = {
  belgisiz: { blok: true, t: { uz: "Har bo'lakka ✓ yoki ✗ qo'ying.", ru: 'Поставьте каждой части ✓ или ✗.' } },
  izohQisqa: { blok: true, t: { uz: "✗ qo'ydingiz — nima yetishmaganini bir qatorda yozing.", ru: 'Вы поставили ✗ — напишите в одну строку, чего не хватило.' } },
  hammaOk: { blok: false, t: { uz: "Hammasi ✓ — qaysi bo'lak yanada aniqroq bo'lishi mumkin?", ru: 'Всё ✓ — какая часть может быть ещё точнее?' } },
  baho: { blok: false, t: { uz: "Odam haqida emas — bo'lakda nima yetishmadi?", ru: 'Не о человеке — чего не хватило в части?' } }
};
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const earn = useContext(EarnCtx);
  const juft = isStudent;
  const st = storedAnswer || {};
  const [kirish] = useState(kirishOl);
  const [f, setF] = useState(() => {
    const p = pitchOl(); const b = p.bolaklar || {};
    const yozilgan = BOLAK_ID.filter(id => bolakQatorlar({ ...b, yechim: b.yechim, keyingi: b.keyingi }, id).length > 0).length;
    if (isMentor || yozilgan < 5) return JAMOA_F();
    return { muammo: { gap: '', dalil: '', ...(b.muammo || {}) }, yechim: tt(b.yechim), demo: { bosiladi: '', ozgaradi: '', ...(b.demo || {}) }, raqamlar: { grafik: [], nima: '', bosh: '', halolGap: '', manba: '', ...(b.raqamlar || {}) }, keyingi: tt(b.keyingi) };
  });
  const ozPitch = useMemo(() => { const b = pitchOl().bolaklar || {}; return !isMentor && BOLAK_ID.every(id => bolakQatorlar(b, id).length > 0); }, []); // eslint-disable-line
  const [qadam, setQadam] = useState(st.qadam ?? 0);
  const [vaqt, setVaqt] = useState(st.vaqt ?? 0);
  const [yur, setYur] = useState(false);
  const [toxtadi, setToxtadi] = useState(!!st.vaqt);
  const [varaq, setVaraq] = useState(st.varaq || BOSH_VARAQ());
  const [xato, setXato] = useState(null);
  const [otdi, setOtdi] = useState({});
  const [ochiq, setOchiq] = useState(null);
  const [tahrir, setTahrir] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [uch, qatlam] = useUchish();
  const inpRef = useRef(null);
  useEffect(() => { if (!yur) return undefined; const t = setInterval(() => setVaqt(v => v + 1), 1000); return () => clearInterval(t); }, [yur]);
  const tuzSoni = varaq.filter(r => r.tuzatildi).length;
  const done = tuzSoni > 0;
  const hammaOk = varaq.every(r => r.belgi === '✓');
  const saqlaKalit = (patch) => { if (isMentor || !ozPitch) return; pitchYoz(patch); };
  const boshla = () => { setVaqt(0); setYur(true); setToxtadi(false); };
  const toxtat = () => { setYur(false); setToxtadi(true); if (qadam === 0) setQadam(1); jonliBelgi(live, ZONA_2, screen, vaqt <= JAMI_VAQT ? 1 : 0); };
  const qayta = () => { setYur(false); setVaqt(0); setToxtadi(false); };
  const setQ = (i, d) => { setVaraq(v => v.map((r, k) => (k === i ? { ...r, ...d } : r))); setXato(null); };
  const saqlaVaraq = () => {
    if (varaq.some(r => !r.belgi)) { setXato({ k: 'belgisiz' }); return; }
    if (varaq.some(r => r.belgi === '✗' && tt(r.izoh).length < 8)) { setXato({ k: 'izohQisqa' }); return; }
    const ogoh = [varaq.every(r => r.belgi === '✓') && 'hammaOk', varaq.some(r => BAHO_RE.test(normT(r.izoh))) && 'baho'].filter(Boolean).find(k => !otdi[k]);
    if (ogoh) { setXato({ k: ogoh }); setOtdi(o => ({ ...o, [ogoh]: true })); return; }
    setXato(null); setQadam(2);
    if (isMentor) return;
    saqlaKalit({ vaqt, varaq: varaq.map(r => ({ bolak: r.bolak, belgi: r.belgi, izoh: tt(r.izoh) })), tuzatildi: [], varaqTur: juft ? 'sherik' : 'ozi' });
    if (toxtadi) earn('livePitch');
    onAnswer(screen, { stage: 'juftlik', screenIdx: screen, qadam: 2, vaqt, varaq, solved: false, picked: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'juftlik', 0, true, 0);
  };
  const ochiladi = (i) => (qadam === 2 && ochiq === null && !isMentor && (varaq[i].belgi === '✗' ? !varaq[i].tuzatildi : (hammaOk && !varaq[i].tuzatildi && (varaq.some(r => tt(r.izoh)) ? !!tt(varaq[i].izoh) : true))));
  const och = (i) => { setOchiq(i); setTahrir(JSON.parse(JSON.stringify(f))); setXato(null); setYordam(false); };
  const saqlaTuz = () => {
    const id = BOLAK_ID[ochiq];
    if (bolakQatorlar(f, id).join(' ') === bolakQatorlar(tahrir, id).join(' ') && JSON.stringify(f.raqamlar.grafik) === JSON.stringify(tahrir.raqamlar.grafik)) { setXato({ x: 'ozgarmadi', joy: MAYDON[id][0].k }); return; }
    const t = bolakTekshir(id, tahrir, kirish.sinfdoshBor);
    if (t && PX[t.x].blok) { setXato(t); return; }
    const nv = varaq.map((r, k) => (k === ochiq ? { ...r, tuzatildi: true } : r));
    setF(tahrir); setVaraq(nv); setOchiq(null); setTahrir(null); setXato(null);
    const tz = BOLAK_ID.filter((b, k) => nv[k].tuzatildi);
    const p = pitchOl(); const b = p.bolaklar || {};
    saqlaKalit({ bolaklar: { ...b, [id]: id === 'yechim' || id === 'keyingi' ? tt(tahrir[id]) : tahrir[id] }, varaq: nv.map(r => ({ bolak: r.bolak, belgi: r.belgi, izoh: tt(r.izoh) })), tuzatildi: tz });
    earn('partFixed');
    jonliBelgi(live, ZONA_3, screen);
    onAnswer(screen, { stage: 'juftlik', screenIdx: screen, qadam: 2, vaqt, varaq: nv, solved: true, picked: true, correct: true });
  };
  // Sahna: o'quvchining besh bo'lagi va taymer chizig'i; taymer yurganda joriy bo'lak ochiq (Raqamlar — grafik kattalashadi)
  const jb = yur ? joriyBolakI(vaqt) : -1;
  const sahna = (
    <BeshDaqiqaSahna className="ixcham" bolaklar={pitchBolaklar(f, {
      katta: jb === 3 ? 'raqamlar' : null,
      holat: (id) => {
        const r = varaq[BOLAK_ID.indexOf(id)];
        if (jb >= 0) return { holat: BOLAK_ID[jb] === id ? 'joriy' : 'yozildi' };
        if (qadam >= 2 && r.tuzatildi) return { holat: 'ozgardi', yorliq: tr({ uz: "o'zgartirildi", ru: 'изменено' }), belgi: r.belgi };
        if (qadam >= 2 && r.belgi) return { holat: r.belgi === '✓' ? 'ok' : 'xato', belgi: r.belgi };
        return { holat: 'yozildi' };
      }
    })} taymer={{ jami: JAMI_VAQT, bolinish: true, sekund: toxtadi || yur ? vaqt : null, joriy: jb }} />
  );
  const tugmalar = [
    { uz: 'Ayting', ru: 'Расскажите' }, { uz: 'Baholang', ru: 'Оцените' },
    qadam >= 2 && hammaOk ? { uz: 'Aniqlashtiring', ru: 'Уточните' } : { uz: 'Tuzating', ru: 'Исправьте' }
  ];
  const yetgan = [true, toxtadi, qadam >= 2];
  const [korQ, setKorQ] = useState(st.qadam ?? 0);
  useEffect(() => { setKorQ(qadam); }, [qadam]);
  const tabs = (
    <div className="gp-tq gp-tabs">{tugmalar.map((t, i) => (
      <QTugma key={i} ikkinchi={korQ !== i} disabled={!yetgan[i]} className={cxx('gp-tq-b', i < qadam && 'ok', i === qadam && korQ !== i && 'gp-halqa')} onClick={() => setKorQ(i)}>
        <span className="gp-tq-n">{i < qadam ? '✓' : i + 1}</span>{tr(t)}
      </QTugma>
    ))}</div>
  );
  const taymerTug = (
    <div className="gp-taymer-tug">
      {isMentor && <span className={cxx('gp-katta-soat', vaqt > JAMI_VAQT && 'oshdi')} aria-live="off">{mss(vaqt)}<small> / {mss(JAMI_VAQT)}</small></span>}
      {!yur && !toxtadi && <QTugma className="gp-halqa" onClick={boshla}>{tr({ uz: '5 daqiqani boshlash', ru: 'Запустить 5 минут' })}</QTugma>}
      {yur && <><span className="gp-gapir"><i />{tr({ uz: 'Hozir siz gapirasiz', ru: 'Сейчас говорите вы' })} · <b>{mss(vaqt)}</b></span><QTugma className="gp-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma></>}
      {!yur && toxtadi && <><span className="gp-gapir tox">{tr({ uz: 'Vaqt', ru: 'Время' })}: <b>{mss(vaqt)}</b></span><QTugma ikkinchi onClick={qayta}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma></>}
    </div>
  );
  const ayting = korQ === 0 && (
    <div className="gp-s11-a">
      <div className="gp-oldin"><span className="q-yorliq">{tr({ uz: 'Pitchdan oldin', ru: 'Перед питчем' })}</span>{PITCHDAN_OLDIN.map((q, i) => <span key={i} className="gp-oldin-q">{tr(q)}</span>)}</div>
      {taymerTug}
      {juft && <span className="gp-kulrang">{tr({ uz: 'Avval A gapiradi, B tinglaydi; keyin almashasiz.', ru: 'Сначала говорит A, B слушает; потом меняетесь.' })}</span>}
      <span className="gp-kulrang">{tr({ uz: "Ilova ochilmasa — ekran videosini ko'rsating yoki jonli demoni og'zaki aytib bering.", ru: 'Если приложение не откроется — покажите видео с экрана или расскажите живое демо устно.' })}</span>
    </div>
  );
  const varaqBlok = korQ >= 1 && (
    <div className="gp-s11-v">
      <BaholashVaragi varaq={varaq} vaqt={vaqt} faol={qadam === 1 && korQ === 1} setQ={setQ} onBos={korQ === 2 ? (i) => (ochiladi(i) ? och : null) : null} tanlov={ochiq} />
      {qadam === 1 && korQ === 1 && <div className="gp-karta-tug"><QTugma className={cxx(varaqTayyormi(varaq) && 'gp-halqa')} onClick={saqlaVaraq}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>}
      {xato && xato.k && <QXato>{tr(VX[xato.k].t)}</QXato>}
      {xato && xato.k && !VX[xato.k].blok && <span className="gp-kulrang">{tr({ uz: 'Shunday qoldirsangiz — yana «Saqlash»ni bosing.', ru: "Если оставляете так — снова нажмите «Сохранить»." })}</span>}
      {qadam >= 2 && vaqt > JAMI_VAQT && <QIzoh>{tr({ uz: "Vaqt 5 daqiqadan oshdi — har bo'lakdan bitta ortiqcha gapni oling.", ru: 'Время больше 5 минут — уберите из каждой части по одной лишней фразе.' })}</QIzoh>}
    </div>
  );
  const tuzKarta = korQ === 2 && ochiq !== null && tahrir && (
    <BolakForma id={BOLAK_ID[ochiq]} f={tahrir} setF={setTahrir} xato={xato && xato.x ? xato : null} kirish={kirish} yordam={yordam} setYordam={setYordam} onSaqla={saqlaTuz} inpRef={inpRef} grafikTahrir={false} setGrafikTahrir={() => {}} uch={uch} />
  );
  const mGap = isMentor ? { uz: "Ikki qurilmada ilovani ochib qo'ying, keyin «5 daqiqani boshlash»ni bosib, pitchni ovoz chiqarib ayting.", ru: 'Откройте приложение на двух устройствах, затем нажмите «Запустить 5 минут» и расскажите питч вслух.' }
    : korQ === 1 ? { uz: "Gap tugagach, dars ochiq turgan qurilmangizni sherigingizga bering — u har bo'lakka ✓ yoki ✗ qo'yadi.", ru: 'Когда закончите, дайте партнёру устройство с открытым уроком — он поставит каждой части ✓ или ✗.' }
      : korQ === 2 ? (hammaOk ? { uz: "Sherigingiz tanlagan bo'lakni yanada aniqroq qilib yozing.", ru: 'Напишите часть, которую выбрал партнёр, ещё точнее.' } : { uz: "✗ olgan bo'lakni varaqdagi izohga qarab qayta yozing.", ru: "Перепишите часть с ✗ по комментарию на листе." })
        : juft ? { uz: "Ikki qurilmada ilovani ochib qo'ying, keyin «5 daqiqani boshlash»ni bosib, sherigingizga ayting.", ru: 'Откройте приложение на двух устройствах, затем нажмите «Запустить 5 минут» и расскажите партнёру.' }
          : { uz: "Ikki qurilmada ilovani ochib qo'ying, keyin «5 daqiqani boshlash»ni bosib, pitchni ovoz chiqarib ayting.", ru: 'Откройте приложение на двух устройствах, затем нажмите «Запустить 5 минут» и расскажите питч вслух.' };
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish', ru: 'Работа в паре' }) : tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={korQ * 10 + (ochiq ?? 0) + (toxtadi ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Bitta bo'lakni o'zgartiring", ru: 'Измените одну часть' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={juft ? tr({ uz: <>Pitchingizni sherigingizga <A>5 daqiqada ayta olasizmi?</A></>, ru: <>Сможете рассказать питч партнёру <A>за 5 минут?</A></> }) : tr({ uz: <>Pitchingizni <A>5 daqiqada ayta olasizmi?</A></>, ru: <>Сможете рассказать питч <A>за 5 минут?</A></> })}
        mentor={<Mentor key={'m' + korQ}>{tr(mGap)}</Mentor>}
        qadamlar={tabs}
        forma={<>
          <div className={cxx('gp-s11', korQ >= 1 && 'ikki')}>
            <div className="gp-s11-chap">{ayting}{tuzKarta || <Zoomable>{sahna}</Zoomable>}</div>
            {varaqBlok}
          </div>
          {isMentor && <MentorPracticeStats live={live} screen={screen} sanoq={[{ y: { uz: 'Pitchni aytganlar', ru: 'Рассказали питч' }, zona: ZONA_2 }, { y: { uz: "5 daqiqaga sig'ganlar", ru: 'Уложились в 5 минут' }, zona: ZONA_2, shart: r => r.picked === 1 }, { y: { uz: "Bo'lak tuzatganlar", ru: 'Исправили часть' }, zona: ZONA_3 }]} />}
          {done && !isMentor && <QXulosa>{tr({ uz: "Varaq to'ldi va bitta bo'lak o'zgartirildi. Qolgan ✗ bo'laklar — uyga vazifada.", ru: 'Лист заполнен, и одна часть изменена. Остальные части с ✗ — в домашнем задании.' })}</QXulosa>}
        </>}
      />
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; ✔ B, INLINE_KEYS.s12 = 1; scope final; ikki qoida birga — grafik va halol gap) =====
const S12Vizual = () => (
  <div className="gp-tviz-q gp-s12v">
    <MentorGrafikIxcham />
    <span className="gp-kulrang">«…{tr({ uz: "ikkinchi haftada o'sish sekinlashdi (18 dan keyin 6).", ru: 'во вторую неделю рост замедлился (после 18 — 6).' })}»</span>
  </div>
);
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Grafigingizda ikkinchi hafta o'sish sekinlashdi. Pitchda nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Grafigingizda ikkinchi hafta o'sish sekinlashdi. <A>Pitchda nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">На вашем графике во вторую неделю рост замедлился. <A>Что сделаете в питче?</A></h2> })}
    options={[
      { uz: 'Ikkinchi hafta ustunini grafikdan olib tashlaysiz', ru: 'Уберёте столбик второй недели с графика' },
      { uz: "Sekinlashganini aytib, keyingi qadamga o'tasiz", ru: 'Скажете, что рост замедлился, и перейдёте к следующему шагу' },
      { uz: 'Ustunlarni birinchi haftadagi sondan boshlaysiz', ru: 'Начнёте столбики с числа первой недели' },
      { uz: "Sekinlashuvni aytmay, eng baland ustunni ko'rsatasiz", ru: 'Не скажете о замедлении и покажете самый высокий столбик' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Sekinlashuv yashirilmaydi — keyingi ishingizni aytasiz.', ru: "Замедление не скрывают — вы говорите, что будете делать дальше." }}
    explainWrong={{
      0: { uz: "Ustun olinsa, oraliqlar teng bo'lmay qoladi.", ru: 'Если убрать столбик, шаг станет неравным.' },
      2: { uz: "Noldan boshlanmasa, o'sish katta ko'rinadi.", ru: 'Если не от нуля, рост выглядит большим.' },
      3: { uz: "Grafik to'g'ri qoladi — halol gap nima deyishi kerak edi?", ru: 'График остаётся верным — что должна была сказать честная фраза?' },
      default: { uz: 'Grafik qoidalari va halol gapni eslang.', ru: 'Вспомните правила графика и честную фразу.' }
    }}
    vizual={<S12Vizual />} />
);


// ===== 🏅 BADGES (nishonlar) — to'rttasi ham ish qilingan ekranda (S-034, tekin bonus yo'q; 2, 4, 8-ekranlar nishonsiz) =====
const ACHIEVEMENTS = {
  growthChart: { icon: '📈', name: 'Growth Chart!', desc: { uz: "O'z sonlaringizdan noldan boshlangan o'sish grafigini chizdingiz", ru: 'Вы начертили по своим числам график роста от нуля' } },
  fiveParts: { icon: '🖐️', name: 'Five Parts!', desc: { uz: "Pitchingizni besh bo'lakka, Raqamlar bo'lagi bilan yozdingiz", ru: 'Вы написали питч из пяти частей, с частью «Цифры»' } },
  livePitch: { icon: '🎤', name: 'Live Pitch!', desc: { uz: 'Pitchingizni 5 daqiqada aytib, baholatdingiz', ru: 'Вы рассказали питч за 5 минут и получили оценку' } },
  partFixed: { icon: '🔧', name: 'Part Fixed!', desc: { uz: "Varaqdagi izohdan keyin bo'lakni qayta yozdingiz", ru: "Вы переписали часть по комментарию на листе" } }
};
// Ekran id → nishon: s9 — darvoza birinchi urinishda + «Bajardim» + o'z sonlari (correct shu) · s10 — 5/5 saqlanganda. s11 ning ikki nishoni — ekrandan (EarnCtx)
const ACH_TRIGGERS = { s9: 'growthChart', s10: 'fiveParts' };

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
  3: { uz: "1 — Raqamlar qaysi bo'lakda", ru: '1 — В какой части цифры' },
  5: { uz: '2 — Grafik noldan', ru: '2 — График от нуля' },
  7: { uz: '3 — Son yonida nima', ru: '3 — Что рядом с числом' },
  12: { uz: '4 — Sekinlashuv va halol gap', ru: '4 — Замедление и честная фраза' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning o'z atamalari (MD «Fon so'zlari», R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'pitch', ru: 'питч' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'zal', ru: 'зал' }, l: 82, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: "bo'lak", ru: 'часть' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'grafik', ru: 'график' }, l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'ustun', ru: 'столбик' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'son', ru: 'число' }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: SANA_SOZ, ru: 'дата' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'halol gap', ru: 'честная фраза' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'telefon', ru: 'телефон' }, l: 88, t: 44, s: 22, d: 22, dl: 1.3 },
  { ch: { uz: 'taymer', ru: 'таймер' }, l: 36, t: 58, s: 22, d: 24, dl: 2.5 }
];
// ⚡ Mustahkamlash-jang — 12 savol, ✔ o'rni MD dagidek: A 1·6·11 · B 2·7·10 · C 3·8·12 · D 4·5·9 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: "Mentor misolida Muammo bo'lagiga qancha vaqt ajratilgan?", ru: 'Сколько времени в примере Ментора отведено на часть «Проблема»?' }, opts: [{ uz: 'Taxminan 40 soniya', ru: 'Около 40 секунд' }, { uz: 'Taxminan 2 daqiqa', ru: 'Около 2 минут' }, { uz: 'Taxminan 3 daqiqa', ru: 'Около 3 минут' }, { uz: 'Taxminan 10 soniya', ru: 'Около 10 секунд' }], correct: 0 },
  { q: { uz: "Raqamlar bo'lagida grafik va bosh raqam yonida yana nima turadi?", ru: "Что ещё стоит в части «Цифры» рядом с графиком и главным числом?" }, opts: [{ uz: 'Uzum sonlari bilan solishtiruv', ru: 'Сравнение с числами Uzum' }, { uz: 'Sonlar haqida bitta halol gap', ru: 'Одна честная фраза о числах' }, { uz: "Hamma kunlarning to'liq jadvali", ru: 'Полная таблица за все дни' }, { uz: "Sinfdoshlarning ismlari ro'yxati", ru: 'Список имён одноклассников' }], correct: 1 },
  { q: { uz: 'Grafikda «ishga tushirish kuni» yozuvi qayerda turadi?', ru: 'Где на графике стоит надпись «день запуска»?' }, opts: [{ uz: 'Birinchi ustunning ustida', ru: 'Над первым столбиком' }, { uz: "Grafik sarlavhasi o'rnida", ru: 'На месте заголовка графика' }, { uz: 'Birinchi ustunning ostida', ru: 'Под первым столбиком' }, { uz: 'Eng baland ustun ichida', ru: 'Внутри самого высокого столбика' }], correct: 2 },
  { q: { uz: "O'sish grafigining sarlavhasiga nima yoziladi?", ru: 'Что пишут в заголовке графика роста?' }, opts: [{ uz: 'Mahsulot nomi va logotipi', ru: 'Название и логотип продукта' }, { uz: 'Pitch aytiladigan sana', ru: 'Дату, когда расскажут питч' }, { uz: 'Grafikdagi eng katta son', ru: 'Самое большое число на графике' }, { uz: 'Grafikda nima sanalgani', ru: 'Что посчитано на графике' }], correct: 3 },
  { q: { uz: 'Grafikdan bir hafta tushib qolsa, nima buziladi?', ru: 'Что сломается, если из графика выпадет неделя?' }, opts: [{ uz: 'Ustunlar noldan boshlanmay qoladi', ru: 'Столбики перестанут начинаться с нуля' }, { uz: "Sarlavha o'chib, ko'rinmay qoladi", ru: 'Заголовок исчезнет и не будет виден' }, { uz: "Sonlar o'zi kattaroq bo'lib qoladi", ru: 'Числа сами станут больше' }, { uz: "Oraliqlar endi teng bo'lmay qoladi", ru: 'Шаг станет неравным' }], correct: 3 },
  { q: { uz: 'Uzum qachon ishga tushgan?', ru: 'Когда запустился Uzum?' }, opts: [{ uz: '2022-yil oktabrida', ru: 'В октябре 2022 года' }, { uz: '2024-yil martida', ru: 'В марте 2024 года' }, { uz: '2020-yil oktabrida', ru: 'В октябре 2020 года' }, { uz: '2025-yil martida', ru: 'В марте 2025 года' }], correct: 0 },
  { q: { uz: '«Unicorn» deb qanday kompaniyaga aytiladi?', ru: "Какую компанию называют «единорогом»?" }, opts: [{ uz: "Oyiga million foydalanuvchisi bo'lgan", ru: 'С миллионом пользователей в месяц' }, { uz: 'Bahosi 1 milliard dollardan oshgan', ru: 'Оценённую дороже 1 миллиарда долларов' }, { uz: "Bir yilda o'nta shaharda ochilgan", ru: 'Открывшуюся за год в десяти городах' }, { uz: "O'z avtoparki va punktlari bo'lgan", ru: 'Со своим автопарком и пунктами' }], correct: 1 },
  { q: { uz: "Jonli demoda ikkinchi telefonda zal nimani ko'radi?", ru: 'Что видит зал на втором телефоне в живом демо?' }, opts: [{ uz: "Siz bosgan tugma o'chib qolganini", ru: 'Что нажатая вами кнопка погасла' }, { uz: 'Ilova qaytadan ochilib yuklanganini', ru: 'Что приложение заново открылось и загрузилось' }, { uz: "Son pastga tortmasdan o'zgarganini", ru: "Что число изменилось без потягивания вниз" }, { uz: "Ulanish belgisi o'chib qolganini", ru: "Что значок соединения погас" }], correct: 2 },
  { q: { uz: 'Pitchdan oldin ikkala qurilmada nimani tekshirasiz?', ru: 'Что проверите на обоих устройствах перед питчем?' }, opts: [{ uz: 'Ikkalasida bitta akkaunt borligini', ru: 'Что на обоих один аккаунт' }, { uz: 'Ilova hali ochilmay yopiq turganini', ru: 'Что приложение ещё закрыто' }, { uz: "Ro'yxat pastga tortib yangilanganini", ru: "Что список обновили потягиванием вниз" }, { uz: "Belgi «Ulangan» bo'lib turganini", ru: "Что значок — «Подключено»" }], correct: 3 },
  { q: { uz: 'Hisobotingizda sinfdoshlar ham bor. Halol gapda nima deysiz?', ru: 'В вашем отчёте есть и одноклассники. Что скажете в честной фразе?' }, opts: [{ uz: 'Sinfdoshlarni sanoqdan butunlay chiqaraman', ru: 'Полностью уберу одноклассников из подсчёта' }, { uz: 'Ulardan nechtasi sinfdosh ekanini aytaman', ru: 'Скажу, сколько из них одноклассники' }, { uz: 'Hammasini «foydalanuvchi» deb aytaman', ru: 'Назову всех «пользователями»' }, { uz: 'Sinfdoshlar haqida umuman gapirmayman', ru: 'Вообще не буду говорить об одноклассниках' }], correct: 1 },
  { q: { uz: 'Grafikdagi sonlarni qayerdan olasiz?', ru: 'Откуда берёте числа для графика?' }, opts: [{ uz: "O'z Database'ingizdan, SQL bilan", ru: 'Из своей Database, с помощью SQL' }, { uz: 'Sinfdoshlar aytgan taxminiy sondan', ru: 'Из примерного числа от одноклассников' }, { uz: 'Mentor misolidagi tayyor sonlardan', ru: 'Из готовых чисел примера Ментора' }, { uz: "Umami'dagi URL tashriflaridan", ru: 'Из посещений URL в Umami' }], correct: 0 },
  { q: { uz: 'Sherik Raqamlar qatoriga ✗ va «nima sanalgan?» deb yozdi. Nima qilasiz?', ru: 'Партнёр поставил строке «Цифры» ✗ и написал «что посчитано?». Что сделаете?' }, opts: [{ uz: "Raqamlar bo'lagini pitchdan olasiz", ru: 'Уберёте часть «Цифры» из питча' }, { uz: "Sonlarni kattaroq qilib ko'rsatasiz", ru: 'Покажете числа крупнее' }, { uz: 'Sarlavhaga nima sanalganini yozasiz', ru: 'Напишете в заголовке, что посчитано' }, { uz: "Sherigingizdan ✓ qo'yishini so'raysiz", ru: 'Попросите партнёра поставить ✓' }], correct: 2 }
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
  { front: { uz: "Bizda 5 daqiqalik pitch qaysi besh bo'lakdan iborat?", ru: 'Из каких пяти частей у нас состоит 5-минутный питч?' }, back: { uz: 'Muammo, yechim, jonli demo, raqamlar va keyingi qadam', ru: 'Проблема, решение, живое демо, цифры и следующий шаг' } },
  { front: { uz: "Raqamlar bo'lagi pitchning qayerida turadi?", ru: 'Где в питче стоит часть «Цифры»?' }, back: { uz: 'Jonli demodan keyin, keyingi qadamdan oldin', ru: 'После живого демо, перед следующим шагом' } },
  { front: { uz: "Raqamlar bo'lagida zal qaysi savolni beradi?", ru: 'Какой вопрос задаёт зал в части «Цифры»?' }, back: { uz: '«Bu son qayerdan va nimani sanaydi?»', ru: '«Откуда это число и что оно считает?»' } },
  { front: { uz: "O'sish grafigi nima?", ru: 'Что такое график роста?' }, back: { uz: 'Bir xil oraliqdagi sonlar ustunlari; nima sanalgani sarlavhada yoziladi', ru: 'Столбики чисел с одинаковым шагом; что посчитано, пишут в заголовке' } },
  { front: { uz: 'Nega ustunli grafik noldan boshlanadi?', ru: 'Почему столбчатый график начинается с нуля?' }, back: { uz: "Shunda o'sish haqiqatdagidek ko'rinadi: Mentor misolida 44 ustuni 20 dan ikki barobardan sal baland", ru: "Тогда рост выглядит как на самом деле: в примере Ментора столбик 44 чуть больше чем вдвое выше столбика 20" } },
  { front: { uz: "Mentor grafigidan «3 kun o'tib» ustuni nega olindi?", ru: 'Почему из графика Ментора убрали столбик «через 3 дня»?' }, back: { uz: "Oraliqlar teng bo'lishi uchun: har ustun — bir hafta", ru: 'Чтобы шаг был равным: каждый столбик — одна неделя' } },
  { front: { uz: 'Grafik ustunining ustida va ostida nima turadi?', ru: 'Что стоит над и под столбиком графика?' }, back: { uz: 'Ustida — son, ostida — sana', ru: 'Над ним — число, под ним — дата' } },
  { front: { uz: 'Mentor misolida halol gap nima deydi?', ru: 'Что говорит честная фраза в примере Ментора?' }, back: { uz: "«44 kishidan 11 tasi — sinfdoshlarim; ikkinchi haftada o'sish sekinlashdi»", ru: '«Из 44 человек 11 — мои одноклассники; во вторую неделю рост замедлился»' } },
  { front: { uz: "Uzum'ning «17 million» soni nimani sanaydi?", ru: 'Что считает число Uzum «17 миллионов»?' }, back: { uz: "2025-yilda bir oyda foydalanganlarni; bu son sizga me'yor emas", ru: 'Пользовавшихся за месяц в 2025 году; это число для вас не норма' } },
  { front: { uz: "Uzum qachon mamlakatning birinchi «unicorn»i bo'lgan?", ru: "Когда Uzum стал первым «единорогом» страны?" }, back: { uz: '2024-yil martida', ru: 'В марте 2024 года' } },
  { front: { uz: 'Jonli demoda nega ikkita qurilma kerak?', ru: 'Зачем в живом демо два устройства?' }, back: { uz: "Birida bosiladi, ikkinchisida son o'zi o'zgaradi — zal real vaqtni shunda ko'radi", ru: 'На одном нажимают, на другом число меняется само — так зал видит реальное время' } },
  { front: { uz: "Ilova ochilmasa, jonli demoni qanday ko'rsatasiz?", ru: 'Если приложение не откроется, как покажете живое демо?' }, back: { uz: "Ekran videosini ko'rsatasiz yoki og'zaki aytib berasiz", ru: 'Покажете видео с экрана или расскажете устно' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('gp-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="gp-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + ①②③; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: "oila a'zosi yoki do'stingiz", ru: 'член семьи или друг' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '1 repetitsiya', ru: '1 репетиция' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Pitchni bir kishiga 5 daqiqada, taymer bilan ayting. Jonli demoni ikki qurilmada ko'rsating; ikkinchisi bo'lmasa — ekran videosini.", ru: 'Расскажите питч одному человеку за 5 минут, с таймером. Покажите живое демо на двух устройствах; если второго нет — видео с экрана.' },
  { uz: "Undan varaqdagi besh savolni so'rang va qolgan ✗ bo'laklarni tuzating.", ru: 'Задайте ему пять вопросов из листа и исправьте оставшиеся части с ✗.' },
  { uz: "Oxirgi ustundan 7 kun o'tgan bo'lsa — grafikka yangi haftaning jami sonini qo'shing va halol gapni yangilang. Sonni metrika hisobotidagi yo'l bilan oling: o'sha so'rov yoki sanoq sahifasi.", ru: 'Если с последнего столбика прошло 7 дней — добавьте на график итог новой недели и обновите честную фразу. Число возьмите так же, как в отчёте по метрикам: тот же запрос или страница подсчёта.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card gp-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="gp-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="gp-hw-q"><span className="gp-hw-k">{tr(r.k)}</span><span className="gp-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="gp-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{tr(q)}</span></li>)}</ol>
    <span className="gp-kulrang">{tr({ uz: "Tinglovchi topilmasa — pitchni telefonga yozib oling va varaqni o'zingiz to'ldiring. Tinglovchini ilovada ro'yxatdan o'tishga undamang.", ru: 'Если слушателя нет — запишите питч на телефон и заполните лист сами. Не уговаривайте слушателя регистрироваться в приложении.' })}</span>
    {keyingi && <span className="gp-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + holatga qarab sarlavha (sinf 1, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
// «Bugungi asosiy fikr», varaq chipi va artefakt-strip — ko'rsatilmaydi (E 50)
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
    { uz: "Bizda 5 daqiqalik pitch besh bo'lakdan iborat: raqamlar jonli demodan keyin turadi.", ru: 'У нас 5-минутный питч состоит из пяти частей: цифры стоят после живого демо.' },
    { uz: "O'sish grafigida ustun ostida sana, ustida son, sarlavhada esa nima sanalgani turadi.", ru: 'На графике роста под столбиком дата, над ним число, а в заголовке — что посчитано.' },
    { uz: 'Halol gap sinfdoshlarni va sekinlashuvni ochiq aytadi.', ru: 'Честная фраза открыто говорит об одноклассниках и замедлении.' },
    { uz: "Jonli demo ikki qurilmada: birida bosiladi, ikkinchisida son o'zi o'zgaradi.", ru: 'Живое демо на двух устройствах: на одном нажимают, на другом число меняется само.' }
  ];
  const p = pitchOl();
  const b = p.bolaklar || {};
  const grafikBor = Array.isArray(b.raqamlar && b.raqamlar.grafik) && b.raqamlar.grafik.length > 0;
  const s10 = answers[10];
  const saqSoni = s10 && Array.isArray(s10.saqlangan) ? s10.saqlangan.length : 0;
  const s9 = answers[9];
  const varaqBor = varaqTayyormi(p.varaq);
  const tuzBor = Array.isArray(p.tuzatildi) && p.tuzatildi.length > 0;
  // Sarlavha holatga qarab va rost (E 54): MD dagi to'rt holat + «varaq to'ldi, o'zgartirish qoldi» va «hech narsa qilinmagan» (MD ga taklif)
  const holat = isMentorL || (varaqBor && tuzBor) ? 'aytildi' : varaqBor && saqSoni >= 5 ? 'baholandi' : saqSoni >= 5 ? 'yozildi'
    : grafikBor ? 'grafik' : (saqSoni > 0 || (s9 && s9.yetmaydi)) ? 'boshlandi' : 'yoq';
  const SARLAVHA = {
    aytildi: grafikBor || isMentorL ? { uz: <>Pitchingiz grafik bilan <A>aytildi va baholandi.</A></>, ru: <>Ваш питч с графиком <A>рассказан и оценён.</A></> } : { uz: <>Pitchingiz sonlaringiz bilan <A>aytildi va baholandi.</A></>, ru: <>Ваш питч с вашими числами <A>рассказан и оценён.</A></> },
    baholandi: { uz: <>Pitchingiz aytildi va baholandi — <A>bitta bo'lakni o'zgartirish qoldi.</A></>, ru: <>Питч рассказан и оценён — <A>осталось изменить одну часть.</A></> },
    yozildi: { uz: <>Pitchingiz besh bo'lakka yozildi — <A>aytish qoldi.</A></>, ru: <>Питч записан из пяти частей — <A>осталось рассказать.</A></> },
    grafik: { uz: <>Grafik tayyor — <A>pitchning qolgan bo'laklari qoldi.</A></>, ru: <>График готов — <A>остались другие части питча.</A></> },
    boshlandi: { uz: <>Pitch boshlandi — <A>qolgan bo'laklarni tugating.</A></>, ru: <>Питч начат — <A>допишите остальные части.</A></> },
    yoq: { uz: <>Pitchingiz hali yozilmagan — <A>besh bo'lakni yozib chiqing.</A></>, ru: <>Питч ещё не написан — <A>напишите пять частей.</A></> }
  };
  const toliq = holat === 'aytildi';
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Zaxira dars»</b></>, ru: <>Следующий урок — <b>«Резервный урок»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('gp-yakun', !toliq && 'belgisiz')}>
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
export default function PmGrowthPitchLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — BeshDaqiqaSahna, OsishGrafigi, jonli demo, Uzum sahnasi (prefiks gp-). Faqat qolip tokenlari (D3); brend rangi — faqat nom yorlig'ida === */
        .gp-mj { font-weight: 800; font-style: normal; color: ${MJ_RANG}; }
        .gp-uz { font-weight: 800; font-style: normal; color: ${UZUM_RANG}; }
        .gp-teg { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; text-transform: none; letter-spacing: 0; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .gp-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: gp-puls 2.2s ease-out .3s 3; }
        @keyframes gp-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .gp-halqa-i { border-color: ${T.accent} !important; animation: gp-tolqin-i 2.4s ease-in-out 0.4s 3; }
        @keyframes gp-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        /* Variantlar, bashorat va tanlov chiplari: guruh atrofida ramka yo'q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .gp-s0 { display: contents; }
        .gp-s0.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: gp-chorla-v 1.8s ease-out .5s 2; }
        @keyframes gp-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .gp-s0.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .gp-s0.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled), .gp-chorla > .q-chip:not(:disabled), .gp-chorla > button:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: gp-chorla-c 1.8s ease-out .5s 2; }
        @keyframes gp-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .q-bashorat .q-chip:nth-child(2), .gp-chorla > :nth-child(2) { animation-delay: .75s; }
        .q-bashorat .q-chip:nth-child(3), .gp-chorla > :nth-child(3) { animation-delay: 1s; }
        .gp-chorla-b { min-width: 0; }
        /* --- Umumiy kichik bloklar --- */
        .gp-izohlar { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .gp-atama { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; animation: gp-kir .5s ease-out both; }
        .gp-atama-y, .gp-yorl.atama { font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 11px; }
        .gp-tviz { margin-top: 4px; }
        .gp-tviz-q { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; }
        .gp-uch { position: fixed; z-index: 1200; pointer-events: none; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 4px 10px; white-space: nowrap; max-width: 260px; overflow: hidden; text-overflow: ellipsis; animation: gp-uch .8s cubic-bezier(.5,0,.3,1) forwards; }
        .gp-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .gp-tx b { color: ${T.ink}; } .gp-tx.ok, .gp-tx.ok b { color: ${T.ok}; } .gp-tx b.yoq { color: ${T.err}; }
        .q-xulosa .gp-x-m { display: block; }
        .q-xulosa .gp-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .gp-bashq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 9px 14px; border-radius: 12px; background: ${T.accentSoft}; font-size: 13px; color: ${T.ink2}; }
        .gp-bashq-t b { color: ${T.accent}; }
        p.gp-ipucha { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .gp-kulrang { display: block; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .gp-kulrang-y { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 999px; padding: 2px 10px; }
        .gp-yorliqlar { display: flex; flex-wrap: wrap; gap: 6px; }
        .gp-yorl { font-size: 12px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 3px 10px; }
        /* --- Tugmalar qatori (1 · 2 · 3; joriysi accent, bosilgani ✓) --- */
        .gp-tq { display: flex; flex-wrap: wrap; gap: 8px; }
        .lesson-root .gp-tq-b { display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px; font-size: 13.5px; }
        .gp-tq-n { width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; background: ${fon(T.ink, 0.08)}; }
        .gp-tq-b.ok .gp-tq-n { background: ${T.ok}; color: #fff; }
        .gp-tq-b.ok { opacity: 1; }
        /* --- Zal --- */
        .gp-zal { display: flex; align-items: flex-end; gap: 10px; min-height: 46px; }
        .gp-zal-odam { display: flex; gap: 2px; flex: none; }
        .gp-odam { width: 26px; height: 32px; }
        .gp-puf { position: relative; font-size: 12.5px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 6px 11px; line-height: 1.35; max-width: 340px; animation: gp-kir .4s ease-out both; }
        .gp-puf::before { content: ''; position: absolute; left: -6px; bottom: 9px; width: 10px; height: 10px; background: inherit; border-left: 1.5px solid ${T.line}; border-bottom: 1.5px solid ${T.line}; transform: rotate(45deg); }
        .gp-puf.sav { font-size: 16px; font-weight: 800; color: ${T.accent}; padding: 3px 12px; }
        .gp-puf.ok { color: #fff; background: ${T.ok}; border-color: ${T.ok}; font-size: 15px; padding: 3px 12px; }
        .gp-puf.ok::before { border-color: ${T.ok}; }
        .gp-zal.ixcham .gp-odam { width: 22px; height: 27px; }
        /* --- Telefon (≈170×272 barqaror) --- */
        .gp-tel-w { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; }
        .gp-tel-y { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .gp-tel { width: 170px; height: 272px; flex: none; border-radius: 26px; background: #1E1B26; padding: 9px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.5); display: flex; flex-direction: column; }
        .gp-tel > * { background: ${T.paper}; }
        .gp-tel-bar { display: flex; align-items: center; justify-content: space-between; gap: 4px; padding: 10px 10px 6px; border-radius: 18px 18px 0 0; font-size: 11.5px; }
        .gp-ulan { display: inline-flex; align-items: center; gap: 4px; font-size: 9.5px; font-weight: 700; color: ${T.ok}; }
        .gp-ulan i { width: 6px; height: 6px; border-radius: 50%; background: ${T.ok}; }
        .gp-tel-ekran { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 4px 10px 12px; border-radius: 0 0 18px 18px; min-height: 0; }
        .gp-tel-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .gp-tel-kun { font-size: 10.5px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.04em; }
        .gp-tel-karta { display: flex; flex-direction: column; gap: 2px; padding: 8px 9px; border-radius: 10px; background: ${T.bg}; font-size: 11px; color: ${T.ink2}; }
        .gp-tel-karta b { color: ${T.ink}; font-size: 12px; }
        .gp-tel-son { font-family: 'JetBrains Mono', monospace; }
        .gp-doiralar { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 2px; }
        .gp-doiralar i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.12)}; transition: background .3s; }
        .gp-doiralar i.bor { background: ${MJ_RANG}; }
        .gp-tel-ekran.oyin { align-items: flex-start; gap: 5px; }
        .gp-tel-vaqt { font-size: 13px; color: ${T.ink}; }
        .gp-tel-joy { font-size: 11px; color: ${T.ink2}; }
        .gp-tel-katta { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; margin-top: 6px; }
        .gp-tel-katta.yangi { color: ${MJ_RANG}; animation: gp-pop .5s cubic-bezier(.3,1.5,.5,1); }
        .gp-tel-tugma { margin-top: auto; align-self: stretch; text-align: center; font-size: 12px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border-radius: 10px; padding: 8px 6px; transition: background .3s; }
        .gp-tel-tugma.ok { background: ${fon(T.ink, 0.1)}; color: ${T.ink}; }
        .gp-tel.kulrang .gp-tel-ekran > *, .gp-tel.kulrang .gp-tel-bar > * { opacity: 0.55; }
        /* --- Sahna --- */
        .gp-sahna { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: clamp(14px,2.4vw,26px); align-items: start; width: 100%; }
        .gp-sahna.tel-yoq { grid-template-columns: minmax(0, 1fr); }
        .gp-sahna-tel { display: flex; justify-content: center; }
        .gp-tabs { margin-bottom: 2px; }
        .gp-sahna-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .gp-bolaklar { display: flex; flex-direction: column; gap: 6px; }
        .gp-bolak { background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 7px 11px; display: flex; flex-direction: column; gap: 3px; min-width: 0; transition: border-color .3s, background .3s; }
        .gp-bolak.bosh { border-style: dashed; background: transparent; color: ${T.ink2}; }
        .gp-bolak.tayyor { border-color: ${fon(T.ink, 0.35)}; animation: gp-kir .4s ease-out both; }
        .gp-bolak.joriy { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.12)}; }
        .gp-bolak.yozildi { animation: gp-yashil 1.2s ease-out; }
        .gp-bolak.ok { border-color: ${fon(T.ok, 0.45)}; }
        .gp-bolak.xato { border-color: ${T.err}; }
        .gp-bolak.ozgardi { border-color: ${fon(T.ink, 0.35)}; }
        .gp-bolak.yangi { animation: gp-sirg .55s cubic-bezier(.3,1.2,.5,1) both; }
        .gp-bolak-h { display: flex; align-items: center; gap: 8px; min-height: 18px; }
        .gp-bolak-h > b { font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .gp-bolak.bosh .gp-bolak-h > b { color: ${T.ink2}; }
        .gp-nom-y { animation: gp-kir .5s ease-out both; color: ${T.accent} !important; }
        .gp-bolak-y { font-style: normal; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 999px; padding: 1px 8px; }
        .gp-bolak-b { margin-left: auto; font-style: normal; font-weight: 800; font-size: 12px; color: ${T.ok}; animation: gp-tush .4s ease-out both; }
        .gp-bolak-b.x { color: ${T.err}; }
        .gp-bolak-q { font-size: 12px; line-height: 1.4; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .gp-bolak-q.yangi { animation: gp-yashil 1.2s ease-out, gp-kir .45s ease-out both; border-radius: 6px; }
        .gp-bolak-gr { padding: 2px 0; }
        .gp-tahrir { margin-left: auto; width: 24px; height: 24px; flex: none; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; font-size: 12px; line-height: 1; padding: 0; }
        .gp-bolak-b + .gp-tahrir { margin-left: 4px; }
        .gp-sahna.keng .gp-bolak-q { white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        /* --- Taymer chizig'i --- */
        .gp-taymer { display: flex; flex-direction: column; gap: 3px; }
        .gp-tm-qator { display: flex; align-items: flex-start; gap: 6px; }
        .gp-tm-chiziq { flex: 1; display: flex; gap: 3px; transition: max-width .8s cubic-bezier(.4,0,.2,1); max-width: 100%; }
        .gp-taymer.qisqa .gp-tm-chiziq { max-width: 60%; }
        .gp-tm-bo { position: relative; height: 10px; border-radius: 99px; background: ${fon(T.ink, 0.1)}; overflow: visible; min-width: 0; }
        .gp-tm-bo > i { position: absolute; inset: 0; border-radius: inherit; background: ${T.accent}; transform-origin: left center; transition: transform .9s linear; }
        .gp-tm-bo.joriy { box-shadow: 0 0 0 2px ${fon(T.accent, 0.25)}; }
        .gp-tm-nom { position: absolute; top: 13px; left: 0; right: 0; font-style: normal; font-size: 10px; font-weight: 700; color: ${T.ink2}; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; animation: gp-kir .4s ease-out both; }
        .gp-tm-nom small { display: block; font-weight: 600; font-size: 9.5px; }
        .gp-tm-qizil { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; color: #fff; background: ${T.err}; border-radius: 99px; padding: 0 8px; line-height: 16px; margin-top: -3px; }
        .gp-tm-chet { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; }
        .gp-taymer:has(.gp-tm-nom) .gp-tm-chet { margin-top: 26px; }
        .gp-taymer.qisqa .gp-tm-chet { max-width: 60%; }
        /* --- O'sish grafigi --- */
        .gp-gr { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .gp-gr-sar { font-size: 13.5px; font-weight: 800; color: ${T.ink}; min-height: 20px; animation: gp-kir .5s ease-out both; }
        .gp-gr-sar.bosh { border: 1.5px dashed ${fon(T.ink, 0.25)}; border-radius: 8px; min-height: 22px; max-width: 220px; animation: none; }
        .gp-gr-maydon { display: flex; gap: 8px; align-items: stretch; }
        .gp-gr-ok { display: flex; flex-direction: column; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; padding: 18px 0 22px; border-right: 1.5px solid ${fon(T.ink, 0.3)}; padding-right: 6px; }
        .gp-gr-ok-p { animation: gp-tush .5s ease-out both; }
        .gp-gr-ustunlar { flex: 1; display: flex; gap: clamp(10px,2vw,22px); align-items: stretch; min-width: 0; }
        .gp-gr.katta .gp-gr-ustunlar { justify-content: space-evenly; }
        .gp-gr.katta .gp-gr-joy { max-width: 120px; }
        .gp-gr-joy { position: relative; flex: 1; max-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 3px; min-width: 0; transition: flex .6s, max-width .6s, opacity .6s; }
        .gp-gr-joy.chiq { flex: 0.0001; max-width: 0; opacity: 0.6; }
        .gp-gr-joy.chiq .gp-gr-ust { background: ${fon(T.ink, 0.3)}; }
        .gp-gr-son { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: ${T.ink}; min-height: 18px; }
        .gp-gr-ram { position: relative; width: 100%; height: 150px; border-bottom: 2px solid ${T.ink}; }
        .gp-gr-ust { position: absolute; left: 0; right: 0; bottom: 0; height: 100%; border-radius: 6px 6px 0 0; background: ${T.accent}; transform-origin: bottom center; transition: transform .7s cubic-bezier(.3,1.1,.5,1); animation: gp-osib .8s cubic-bezier(.3,1.1,.5,1) both; }
        .gp-gr-sana { font-size: 11px; color: ${T.ink2}; text-align: center; line-height: 1.25; min-height: 28px; }
        .gp-gr-farq { position: absolute; left: calc(-1 * clamp(10px,2vw,22px) / 2); top: 50%; transform: translate(-50%, -50%); font-style: normal; font-size: 11px; font-weight: 800; color: ${T.ok}; background: ${T.okFon}; border-radius: 999px; padding: 1px 6px; animation: gp-tush .4s ease-out both; z-index: 1; }
        .gp-gr-chiqy { position: absolute; top: 30%; left: 50%; transform: translateX(-50%); white-space: nowrap; font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 8px; padding: 2px 8px; z-index: 2; }
        .gp-gr-joy.ajrat .gp-gr-ust { background: ${T.ok}; }
        .gp-gr.ixcham { gap: 3px; }
        .gp-gr.ixcham .gp-gr-sar { font-size: 11.5px; min-height: 0; }
        .gp-gr.ixcham .gp-gr-sar.bosh { display: none; }
        .gp-gr.ixcham .gp-gr-ram { height: 44px; border-bottom-width: 1.5px; }
        .gp-gr.ixcham .gp-gr-ustunlar { gap: 8px; }
        .gp-gr.ixcham .gp-gr-joy { max-width: 54px; gap: 1px; }
        .gp-gr.ixcham .gp-gr-son { font-size: 10.5px; min-height: 0; }
        .gp-gr.ixcham .gp-gr-sana { font-size: 9.5px; min-height: 0; }
        .gp-gr.ixcham .gp-gr-ust { border-radius: 3px 3px 0 0; }
        .gp-gr.sarsiz .gp-gr-sar { display: none; }
        .gp-gr.sonsiz .gp-gr-son, .gp-gr.sonsiz .gp-gr-sana { display: none; }
        /* --- Ekranlarga xos joylashuv --- */
        .gp-hook { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 8px 0; }
        .gp-hook-k { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; background: ${T.paper}; border-radius: 18px; padding: 16px 40px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.35); }
        .gp-hook-y { font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 999px; padding: 2px 10px; }
        .gp-hook-son { font-family: 'JetBrains Mono', monospace; font-size: clamp(48px,7vw,68px); font-weight: 800; color: ${T.ink}; line-height: 1; }
        .gp-hook-bosh { width: 140px; height: 16px; border: 1.5px dashed ${fon(T.ink, 0.3)}; border-radius: 6px; }
        .gp-halqa-b { border-color: ${T.accent}; animation: gp-tolqin-i 2.4s ease-in-out .3s 3; }
        .gp-reja { width: 100%; }
        .gp-sahna.ixcham .gp-bolak { padding: 4px 10px; gap: 1px; }
        .gp-sahna.ixcham .gp-bolaklar { gap: 5px; }
        .gp-s2, .gp-s4, .gp-s8 { display: flex; flex-direction: column; gap: 10px; width: 100%; min-width: 0; }
        .gp-s4-gr { position: relative; display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 26px -14px rgba(${T.shadowBase},0.25); width: 100%; max-width: 760px; align-self: center; }
        .gp-s4-gr > .gp-zal { position: absolute; top: 10px; right: 14px; }
        .gp-s4-gr .gp-gr-ram { height: 130px; }
        .gp-s4-gr .gp-gr-maydon { margin-top: 26px; }
        .gp-s4-gr .gp-gr-sar { max-width: calc(100% - 210px); }
        .gp-mini-b { flex-direction: column; align-items: stretch; gap: 4px; max-width: 420px; }
        .gp-mini-bo { display: flex; flex-direction: column; gap: 2px; font-size: 12px; padding: 5px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .gp-mini-bo.on { border-color: ${T.ok}; }
        .gp-tush { font-style: normal; color: ${T.ink2}; animation: gp-tush .5s ease-out .2s both; }
        .gp-ikki-gr { align-items: center; gap: 14px; }
        .gp-ikki-g { display: flex; flex-direction: column; gap: 4px; width: 120px; }
        .gp-s12v { flex-direction: column; align-items: flex-start; gap: 6px; max-width: 420px; }
        /* --- Jonli demo --- */
        .gp-demo { display: flex; align-items: center; justify-content: center; gap: 0; width: 100%; }
        .gp-demo-ch { position: relative; flex: 1; min-width: 34px; max-width: 110px; height: 2px; background: ${fon(T.ink, 0.25)}; }
        .gp-konvert { position: absolute; top: -12px; left: 0; white-space: nowrap; font-size: 10.5px; font-weight: 800; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 8px; padding: 2px 7px; animation: gp-konvert .85s ease-in-out forwards; }
        .gp-backend { flex: none; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.3); transition: border-color .3s; }
        .gp-backend > b { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .gp-db { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 4px 8px; }
        .gp-db b { color: ${T.ink}; display: inline-block; animation: gp-pop .45s ease-out; }
        .gp-backend.yangi { border-color: ${T.ok}; }
        .gp-demo-joy { flex: none; width: 170px; min-height: 290px; display: flex; align-items: center; justify-content: center; }
        .gp-demo-joy.bosh { border: 1.5px dashed ${fon(T.ink, 0.28)}; border-radius: 26px; height: 272px; min-height: 0; }
        .gp-zaxira { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .gp-zaxira.past { flex-direction: row; flex-wrap: wrap; justify-content: center; }
        .gp-zaxira-k { font-size: 12.5px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 9px 12px; text-align: center; animation: gp-kir .4s ease-out both; }
        /* --- Uzum sahnasi (chizilgan; boshqa son, asoschi, narx yo'q) --- */
        .gp-uzs { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 18px; align-items: center; }
        .gp-uz-tel { width: 150px; height: 240px; border-radius: 24px; background: #1E1B26; padding: 8px; display: flex; flex-direction: column; }
        .gp-uz-bar { background: ${T.paper}; border-radius: 16px 16px 0 0; padding: 9px 10px 5px; font-size: 14px; }
        .gp-uz-ekran { flex: 1; background: ${T.paper}; border-radius: 0 0 16px 16px; padding: 6px 9px 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; align-content: start; }
        .gp-uz-narsa { aspect-ratio: 1; border-radius: 10px; background: ${T.bg}; display: flex; align-items: center; justify-content: center; animation: gp-kir .4s ease-out both; animation-delay: calc(var(--i) * 0.08s); }
        .gp-uz-narsa svg { width: 60%; height: 60%; }
        .gp-uz-vaqt { position: relative; display: flex; flex-direction: column; gap: 16px; padding-left: 18px; border-left: 2px solid ${fon(UZUM_RANG, 0.25)}; }
        .gp-uz-nuqta { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; min-height: 26px; }
        .gp-uz-nuqta > i { position: absolute; left: -27px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: ${T.paper}; border: 2px solid ${fon(T.ink, 0.25)}; font-style: normal; font-size: 10px; font-weight: 800; color: ${T.ink2}; display: flex; align-items: center; justify-content: center; }
        .gp-uz-nuqta.on > i { background: ${UZUM_RANG}; border-color: ${UZUM_RANG}; animation: gp-pop .45s ease-out; }
        .gp-uz-nuqta > b { font-size: 13.5px; font-weight: 800; color: ${T.ink}; }
        .gp-uz-yorl { font-size: 12px; font-weight: 700; color: ${UZUM_RANG}; background: ${fon(UZUM_RANG, 0.08)}; border-radius: 999px; padding: 2px 10px; animation: gp-sirg .5s ease-out both; }
        .gp-uz-yetk { display: flex; gap: 6px; }
        .gp-uz-yetk svg { height: 20px; width: auto; }
        .gp-voqea { display: flex; flex-direction: column; gap: 10px; }
        .gp-voqea-h { font-size: 15px; font-weight: 800; color: ${T.ink}; animation: gp-kir .4s ease-out both; }
        .gp-voqea-qator { display: grid; grid-template-columns: minmax(0, 1fr); gap: 14px; align-items: center; }
        .gp-voqea-qator.ikki { grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); }
        .gp-nuq { display: flex; align-items: center; gap: 8px; }
        .gp-nuq-l { font-size: 12px; font-weight: 800; color: ${T.ink2}; margin-right: 4px; }
        .gp-nuq i { width: 9px; height: 9px; border-radius: 50%; background: ${fon(T.ink, 0.15)}; }
        .gp-nuq i.cur { background: ${T.accent}; } .gp-nuq i.ok { background: ${T.ok}; }
        /* --- Kod ekrani --- */
        .gp-darvoza-q { display: flex; flex-direction: column; gap: 8px; }
        .gp-darvoza-s { font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .gp-darvoza-ro { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .gp-darvoza code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
        ol.gp-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .gp-vazifa li { display: flex; gap: 8px; align-items: flex-start; font-size: 13.5px; color: ${T.ink}; }
        .gp-vazifa li i { flex: none; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.bg}; color: ${T.ink2}; }
        .gp-vazifa li.ok i { background: ${T.ok}; color: #fff; }
        .gp-vazifa.xira { opacity: 0.5; }
        .gp-kyordam { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
        .gp-yordam { display: flex; flex-direction: column; gap: 6px; font-size: 13px; line-height: 1.45; color: ${T.ink}; background: ${T.bg}; border-radius: 10px; padding: 8px 12px; }
        .gp-baj { display: flex; flex-direction: column; gap: 8px; }
        .gp-baj-q { display: flex; flex-wrap: wrap; gap: 8px; }
        .gp-kodoyna { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .gp-mgap { display: flex; align-items: center; gap: 8px; font-size: 13px; color: ${T.ink}; }
        .gp-mgap img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
        .gp-amal { display: flex; }
        pre.gp-kod { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${CODE.text}; background: ${CODE.bg}; border-radius: 12px; padding: 12px 14px; overflow-x: auto; user-select: none; white-space: pre; }
        .gp-kod-iz { font-weight: 400; color: ${CODE.attr}; }
        .gp-dv-gr, .gp-natija-gr { background: ${T.paper}; border-radius: 14px; padding: 12px 14px; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.3); }
        .gp-tush-b { animation: gp-tush .5s ease-out both; }
        /* --- Mustaqil ish: strip, karta, maydon (yorliq input ichida — E 43) --- */
        .gp-strip { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .gp-strip-l { font-size: 12.5px; font-weight: 800; color: ${T.ink}; margin-right: 4px; }
        .gp-strip-b { display: inline-flex; align-items: center; gap: 4px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 999px; padding: 3px 10px; cursor: default; }
        .gp-strip-b.ok { color: ${T.ink}; cursor: pointer; } .gp-strip-b.ok i { font-style: normal; color: ${T.ok}; font-weight: 800; }
        .gp-strip-b.cur { border-color: ${T.accent}; color: ${T.accent}; }
        .gp-strip-b.yangi { animation: gp-yashil 1.2s ease-out; }
        .gp-strip-b:disabled { opacity: 1; }
        .gp-karta { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 10px; min-width: 0; transition: background .3s; }
        .gp-karta.err { background: ${T.errFon}; }
        .gp-kirish { animation: gp-juft-kir .45s cubic-bezier(.3,1.2,.5,1) both; }
        .gp-maydon { display: flex; align-items: center; gap: 0; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.paper}; overflow: hidden; }
        .gp-maydon.katta { align-items: flex-start; }
        .gp-maydon.err { border-color: ${T.err}; }
        .gp-mn { flex: none; align-self: stretch; display: flex; align-items: center; font-size: 11.5px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; padding: 0 10px; max-width: 120px; line-height: 1.2; }
        .gp-maydon.katta .gp-mn { padding-top: 10px; align-items: flex-start; }
        .gp-inp { flex: 1; min-width: 0; font-family: 'Manrope', sans-serif; font-size: 14px; color: ${T.ink}; border: 1.5px solid transparent; outline: none; background: transparent; padding: 10px 12px; resize: vertical; border-radius: 0 9px 9px 0; }
        textarea.gp-inp { min-height: 64px; line-height: 1.45; }
        .gp-inp:focus { border-color: ${fon(T.accent, 0.5)}; }
        .gp-inp.kichik { font-size: 12.5px; padding: 6px 8px; border: 1.5px solid ${T.line}; border-radius: 8px; background: ${T.paper}; }
        .gp-inp.son { max-width: 70px; }
        .gp-tug-q { display: flex; flex-wrap: wrap; gap: 6px; }
        .gp-foyda, .gp-reja-t { font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 999px; padding: 5px 12px; cursor: pointer; text-align: left; }
        .gp-foyda:hover, .gp-reja-t:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .gp-karta-tug { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .lesson-root .gp-yordam-t { margin-left: auto; }
        .gp-f-gr { position: relative; display: flex; flex-direction: column; gap: 6px; background: ${T.bg}; border-radius: 12px; padding: 8px 40px 8px 10px; }
        .gp-gr-ed { position: absolute; top: 8px; right: 8px; }
        .gp-gr-jadval { display: flex; flex-direction: column; gap: 4px; }
        .gp-gr-q { display: flex; gap: 6px; }
        .gp-zaxira-j { display: flex; flex-direction: column; gap: 3px; }
        /* --- Juftlikda pitch: varaq, taymer --- */
        .gp-s11 { display: grid; grid-template-columns: minmax(0, 1fr); gap: 14px; align-items: start; }
        .gp-s11.ikki { grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); }
        .gp-s11.ikki .zoomable:not(.zoom-on):not(.z-float) { padding-top: 36px; } .gp-s11.ikki .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: 0; } /* ikki ustunda ⛶ o'ng ustundagi yorliq ustiga tushmasin (layout D) */
        .gp-s11-chap, .gp-s11-v, .gp-s11-a { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .gp-oldin { display: flex; flex-direction: column; gap: 4px; background: ${fon(T.ink, 0.045)}; border-radius: 12px; padding: 10px 14px; }
        .gp-oldin-q { font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .gp-taymer-tug { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        .gp-gapir { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        .gp-gapir i { width: 9px; height: 9px; border-radius: 50%; background: ${T.err}; }
        .gp-gapir.tox i { display: none; }
        .gp-gapir b { font-family: 'JetBrains Mono', monospace; }
        .gp-varaq { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 16px; padding: 12px 14px; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.22); }
        .gp-vq-q { display: grid; grid-template-columns: minmax(0, 1.2fr) auto minmax(0, 1fr); gap: 8px; align-items: center; padding: 6px 8px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; text-align: left; }
        .gp-vq-q.x { border-color: ${fon(T.err, 0.5)}; }
        .gp-vq-bos { cursor: pointer; border-color: ${T.accent}; }
        .gp-vq-bos.on { background: ${T.accentSoft}; }
        .gp-halqa-q { animation: gp-chorla-c 1.8s ease-out .4s 2; }
        .gp-vq-n { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .gp-vq-n b { font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .gp-vq-n span { font-size: 11px; color: ${T.ink2}; line-height: 1.3; }
        .gp-vq-b { display: flex; gap: 4px; }
        .gp-vq-bel { width: 30px; height: 30px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-weight: 800; font-size: 14px; cursor: pointer; color: ${T.ink2}; }
        .gp-vq-bel.ok { background: ${T.ok}; border-color: ${T.ok}; color: #fff; }
        .gp-vq-bel.err { background: ${T.err}; border-color: ${T.err}; color: #fff; }
        .gp-vq-bb { width: 26px; text-align: center; font-weight: 800; font-size: 14px; }
        .gp-vq-bb.ok { color: ${T.ok}; } .gp-vq-bb.err { color: ${T.err}; }
        .gp-vq-iz { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .gp-vq-izt { font-size: 12px; color: ${T.ink}; overflow-wrap: anywhere; }
        .gp-vq-bosh { font-size: 12px; color: ${T.ink2}; }
        .gp-tuz { font-style: normal; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; }
        .gp-vq-vaqt { display: flex; gap: 6px; font-size: 13px; color: ${T.ink2}; }
        .gp-vq-vaqt b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        .gp-vq-vaqt.oshdi b { color: ${T.err}; }
        /* --- Kartochkalar, uyga vazifa, yakun --- */
        .gp-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: gp-puls 1.8s ease-out .4s 3; }
        p.gp-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.gp-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: gp-nuqta 2.4s ease-in-out 3; }
        .gp-hw { display: flex; flex-direction: column; gap: 12px; }
        .gp-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .gp-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .gp-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .gp-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.gp-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .gp-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .gp-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .gp-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .gp-yakun { display: contents; }
        .gp-yakun.belgisiz .done-chip .tick { display: none; }
        @keyframes gp-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes gp-sirg { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
        @keyframes gp-yashil { 0%, 45% { background-color: ${T.okFon}; } 100% { background-color: transparent; } }
        @keyframes gp-tush { from { opacity: 0; transform: translateY(-12px) scale(0.6); } to { opacity: 1; transform: none; } }
        @keyframes gp-pop { from { transform: scale(1.35); } to { transform: none; } }
        @keyframes gp-osib { from { transform: scaleY(0); } }
        @keyframes gp-juft-kir { from { opacity: 0; transform: translateX(18px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes gp-uch { to { transform: translate(var(--dx), var(--dy)) scale(0.92); opacity: 0.15; } }
        @keyframes gp-konvert { from { left: 0; transform: translateX(-30%); } to { left: 100%; transform: translateX(-70%); } }
        @keyframes gp-nuqta { 0%, 100% { opacity: 1; } 50% { opacity: 0.65; } }
        @media (max-width: 760px) {
          .gp-s11.ikki, .gp-voqea-qator.ikki { grid-template-columns: 1fr; }
          .gp-vq-q { grid-template-columns: minmax(0, 1fr) auto; }
          .gp-vq-iz { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .gp-sahna { grid-template-columns: 1fr; justify-items: center; }
          .gp-sahna-ong { width: 100%; }
          .gp-demo { flex-direction: column; }
          .gp-demo-ch { width: 2px; height: 34px; min-width: 0; flex: none; }
          .gp-konvert { animation-name: gp-konvert-t; top: 0; left: 6px; }
          .gp-uzs { grid-template-columns: 1fr; justify-items: center; }
          .gp-uz-vaqt { width: 100%; }
          .gp-hw-karta { grid-template-columns: 1fr; }
          .gp-gr-ram { height: 120px; }
          .gp-mn { max-width: 92px; }
        }
        @keyframes gp-konvert-t { from { top: 0; } to { top: 100%; } }
        @media (prefers-reduced-motion: reduce) {
          .gp-halqa, .gp-halqa-i, .gp-halqa-b, .gp-halqa-q, .gp-s0.kutish .q-variant, .q-bashorat .q-chip, .gp-chorla > *, .gp-atama, .gp-uch, .gp-puf, .gp-bolak, .gp-bolak-q, .gp-bolak-b, .gp-nom-y,
          .gp-tm-nom, .gp-gr-sar, .gp-gr-ok-p, .gp-gr-ust, .gp-gr-farq, .gp-tel-katta, .gp-db b, .gp-konvert, .gp-zaxira-k, .gp-uz-narsa, .gp-uz-nuqta > i, .gp-uz-yorl, .gp-voqea-h, .gp-tush, .gp-tush-b,
          .gp-strip-b, .gp-kirish, .gp-gapir i, .gp-flash.yangi .fc-card .fc-front, p.gp-fc-ipucha i { animation: none !important; }
          .gp-tm-chiziq, .gp-tm-bo > i, .gp-gr-ust, .gp-gr-joy, .gp-doiralar i, .gp-bolak { transition: none !important; }
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
        .gp-katta-soat { flex-basis: 100%; font-family: 'JetBrains Mono', monospace; font-size: clamp(44px, 6vw, 76px); font-weight: 800; line-height: 1; color: ${T.ink}; font-variant-numeric: tabular-nums; }
        .gp-katta-soat small { font-size: 0.32em; font-weight: 700; color: ${T.ink2}; }
        .gp-katta-soat.oshdi { color: ${T.err}; }
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
      <EarnCtx.Provider value={earn}>
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
      </EarnCtx.Provider>
    </LangContext.Provider>
  );
}
