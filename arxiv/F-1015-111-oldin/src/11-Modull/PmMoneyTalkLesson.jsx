import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul (LMS) · 6-dars (PM) «Pul haqida qanday gaplashasiz?» — m11-06 · MD v3: feedback/F-1007-13modul/06-PmMoneyTalk-v3.md (manba-haqiqat)
// Skelet src/skelet/NamunaDars.jsx dan; 12 ekran (keyssiz PM): kirish · reja · savol yoki sotish gapi · 1-savol · uch suhbat · 2-savol ·
//   suhbat savollaringiz · rol o'yini · yakuniy savol · podium · kartochkalar · yakun. Kod ekrani yo'q, REPO yo'q.
// Bitta vizual — «Suhbat varag'i» (telefon · sahna · varaq). Real pul yo'q: to'lov taklifi ekranida «Test rejim: pul yechilmaydi», karta formasi yo'q.
// Saqlaydi: pm-m11d6-suhbat (skript · suhbatlar) · o'qiydi: pm-m11d4-narx, pm-m11d2-model, pm-m9d3-intervyu. Mentor ekraniga gap, belgi, narx uzatilmaydi.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QChip, QXato, QIzoh, QXulosa, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m11d6-v1', lessonTitle: { uz: "Pul haqida qanday gaplashasiz?", ru: "Как говорить о деньгах?" } };
// 12 ekran (MD KOD 2): hook · reja · tushuncha · test · tushuncha · test · amaliyot · amaliyot · yakuniy test · podium · kartochkalar · yakun
const HW_TOKENS = [
  { t: { uz: 'suhbat', ru: 'разговор' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'narx', ru: 'цена' }, l: 70, tp: 18, s: 12, d: 7.5 },
  { t: { uz: 'yozuv', ru: 'запись' }, l: 40, tp: 70, s: 12, d: 8.5 }
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi) — MD: 3-ekran C, 5-ekran B, 8-ekran D (yangi dars, o'rni shu holicha qoladi)
const INLINE_KEYS = { s3: 2, s5: 1, s8: 3 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: 'Suhbat nimadan boshlanadi', ru: 'С чего начинается разговор' },
    cards: [
      { ic: '1', h: { uz: 'Bu darsda suhbat — sotish emas, savol.', ru: 'На этом уроке разговор — не продажа, а вопрос.' } },
      { ic: '2', h: { uz: "Avval odamning hozirgi ishi so'raladi: qanday qiladi, vaqt va pul sarflaydimi.", ru: 'Сначала спрашивают о текущем деле человека: как делает, тратит ли время и деньги.' } },
      { ic: '3', h: { uz: 'Narx keyin aytiladi — Mentor misolida uchinchi savolda.', ru: 'Цену называют потом — в примере Ментора в третьем вопросе.' }, ask: { uz: 'Birinchi savolingiz nima haqida?', ru: 'О чём ваш первый вопрос?' } }
    ]
  },
  5: {
    title: { uz: 'Javob qanday yoziladi', ru: 'Как записывают ответ' },
    cards: [
      { ic: '1', h: { uz: "Javob so'zma-so'z yoziladi — o'z xulosangiz emas.", ru: 'Ответ записывают дословно — не свой вывод.' } },
      { ic: '2', h: { uz: "Belgi odamning gapidan: ha, qimmat, yo'q yoki javob yo'q.", ru: 'Отметка — из слов человека: да, дорого, нет или нет ответа.' } },
      { ic: '3', h: { uz: "«Yo'q» ham natija — u ham yozuvda qoladi.", ru: '«Нет» — тоже результат, он тоже остаётся в записи.' }, ask: { uz: '«Qiziqmadi» deb yozsangiz, nima yo\'qoladi?', ru: 'Если написать «не заинтересовался», что потеряется?' } }
    ]
  },
  8: {
    title: { uz: '«Olaman» nimani ko\'rsatadi', ru: 'Что показывает «возьму»' },
    cards: [
      { ic: '1', h: { uz: "«Olaman» — odamning so'zi: u hali to'lamagan.", ru: '«Возьму» — слова человека: он ещё не заплатил.' } },
      { ic: '2', h: { uz: 'Uch suhbat — kichik son: narx haqida dalil, isbot emas.', ru: 'Три разговора — малое число: довод о цене, не доказательство.' } },
      { ic: '3', h: { uz: "Suhbatda pul olinmaydi — odam «ha» desa ham.", ru: 'В разговоре денег не берут — даже если человек сказал «да».' }, ask: { uz: '«Ha» degan odamga keyin nima deysiz?', ru: 'Что вы потом скажете человеку, который ответил «да»?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="mt-tviz fade-step">{vizual}</div>}
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

// ===== DARS VIZUALI — «Suhbat varag'i» (SuhbatVaraq: telefon · sahna · varaq) — bitta manba: MENTOR_EKRAN · MENTOR_SKRIPT · MENTOR_SUHBAT (MD A-6, 163/180) =====
// qolip-maket: mt-uya mt-belgi mt-qator mt-javob mt-tahrir
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
// O'qituvchi eslatmasi — faqat Mentor jonli rejimida (MD «O'qituvchi eslatmasi»; o'quvchida ko'rinmaydi)
const Ustoz = ({ satrlar }) => {
  const { isMentor } = useJonli();
  if (!isMentor) return null;
  return <div className="mt-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((q, i) => <span key={i}>{tr(q)}</span>)}</div>;
};
const USTOZ = {
  s0: [
    { uz: "Javoblarni muhokama qilmang — bugun ularni odamning o'zidan eshitish yo'lini ko'rasiz. 4-darsda narxi saqlanmagan o'quvchi Mentor misolini ko'radi; narxini 7-ekranda o'zi yozadi.", ru: 'Не обсуждайте ответы — сегодня увидите, как услышать их от самого человека. Ученик без сохранённой цены с 4-го урока видит пример Ментора; свою цену он напишет на 7-м экране.' }
  ],
  s1: [
    { uz: "Menyu ostidagi «uchta real suhbat» — dastur natijasi: darsda — suhbat savollari, rol o'yini va imkon bo'lsa bitta real suhbat; qolgani uyda. Darsda hech kim pul olmaydi va hech narsa sotmaydi.", ru: '«Три реальных разговора» под меню — результат программы: на уроке — вопросы разговора, ролевая игра и, если получится, один реальный разговор; остальное дома. На уроке никто не берёт деньги и ничего не продаёт.' }
  ],
  s2: [
    { uz: "Mentor misolida Pro — tashkilotchi uchun, o'yinchilar bepul: shuning uchun suhbat tashkilotchilar bilan. 4-gapda narx aytiladi, lekin u ham savol — oxirida «Nega?», keyin odam o'zi gapiradi.", ru: 'В примере Ментора Pro — для организатора, игроки бесплатно: поэтому разговор с организаторами. В 4-й фразе называется цена, но это тоже вопрос — в конце «Почему?», потом человек говорит сам.' },
    { uz: "9-Modulda intervyu — bitta odam bilan suhbat edi; 11-Modulda g'oyani faqat oxirgi savolda aytgansiz. Narx haqidagi suhbat ham shunday: avval odamning hozirgi ishi, narx keyin.", ru: 'В 9-м модуле интервью было разговором с одним человеком; в 11-м модуле идею называли только в последнем вопросе. Разговор о цене такой же: сначала текущее дело человека, цена потом.' },
    { uz: "Sotish gaplari — Mentor aytmaydigan gaplar: «hozir olmasangiz…» — soxta shoshilinch, «boshqalar ham oldi» — Mentor misolida hech kim olmagan. Sinfga savol: «Sizga kimdir biror narsani «hozir olmasangiz, qimmatlashadi» deb sotishga uringanmi?»", ru: 'Продающие фразы — то, чего Ментор не говорит: «если не возьмёте сейчас…» — ложная срочность, «другие уже взяли» — в примере Ментора никто не брал. Вопрос классу: «Вам пытались что-то продать словами «не возьмёте сейчас — подорожает»?»' },
    { uz: "Mahsulotni tushuntirish yomon emas: bu suhbatda avval odamning narx haqidagi fikri eshitiladi, shuning uchun ko'ndirilmaydi.", ru: 'Объяснять продукт — не плохо: в этом разговоре сначала слушают мнение человека о цене, поэтому его не уговаривают.' }
  ],
  s4: [
    { uz: "Mentor ko'ndirmadi va «o'ylab ko'ring» demadi — 2-tashkilotchining «yo'q»i ham yozildi. Uning gapi — 4-darsdagi raqobat: tashkilotchi o'yinni Telegram guruhida bepul yig'adi.", ru: 'Ментор не уговаривал и не говорил «подумайте» — «нет» организатора 2 тоже записано. Его слова — конкуренция из 4-го урока: организатор бесплатно собирает игру в Telegram-группе.' },
    { uz: "«Ha» — odamning so'zi: u hali to'lamagan va Mentor pul olmagan. 3-tashkilotchining «10 000»i — uning gapi, yangi narx emas: Mentor narxni hozircha o'zgartirmadi.", ru: '«Да» — слово человека: он ещё не платил, и Ментор денег не брал. «10 000» организатора 3 — его слова, а не новая цена: Ментор цену пока не менял.' },
    { uz: "«Kichik son: isbot emas» — uch kishining gapi narx hamma tashkilotchiga to'g'ri ekanini isbotlamaydi. «Javob yo'q» Mentor misolida bo'lmagan — xabar yozib so'ralganda bo'lishi mumkin.", ru: '«Малое число: не доказательство» — слова трёх человек не доказывают, что цена подходит всем организаторам. «Нет ответа» в примере Ментора не было — так бывает, когда спрашивают сообщением.' }
  ],
  s6: [
    { uz: "12 daqiqa. Eng ko'p xato — birinchi savolda mahsulotni yoki narxni aytish: «Odam bu ishni hozir qanday qiladi?» deb so'rang. Kim to'lashini o'quvchi 2-darsda tanlagan — maydon shundan oldindan yozilgan bo'ladi, o'quvchi tasdiqlaydi yoki o'zgartiradi; siz aytmaysiz.", ru: '12 минут. Частая ошибка — назвать продукт или цену в первом вопросе: спросите «Как человек делает это сейчас?». Кто платит, ученик выбрал на 2-м уроке — поле заполнено заранее, ученик подтверждает или меняет; вы не подсказываете.' },
    { uz: "Narxni siz qo'ymaysiz; 4-darsda narxi saqlanmagan o'quvchi bugungi taxminini yozadi.", ru: 'Цену ставите не вы; ученик без сохранённой цены с 4-го урока пишет сегодняшнее предположение.' }
  ],
  s7: [
    { uz: "Juftliklardan oldin ≈ 3 daqiqa — Mentor bilan rol o'yini: bitta o'quvchi suhbat savollarini o'qiydi, siz Mentor misolidagi tashkilotchi rolida javob berasiz — Mentor misolidagi uch tashkilotchi gapidan birini aynan ayting; sinf javobni so'zma-so'z yozishni ko'radi.", ru: 'До работы в парах ≈ 3 минуты — ролевая игра с Ментором: один ученик читает вопросы разговора, вы отвечаете в роли организатора из примера Ментора — скажите дословно одну из трёх фраз A-6; класс видит, как ответ записывают слово в слово.' },
    { uz: "Keyin juftlikda: ≈ 6 daqiqa birinchisi so'raydi, ≈ 6 daqiqa ikkinchisi. Sherik haqiqatan o'quvchi mahsulotida to'laydigan rolda bo'lsa va o'zi xohlasa — o'z nomidan javob beradi (real suhbat; «Roziman» ni sherikning o'zi bosadi); o'xshasa-yu shu rol bo'lmasa yoki xohlamasa — rol o'ynaydi. Real suhbat ixtiyoriy. Kim «ha» eshitganini sinfda so'ramang va sanamang.", ru: 'Потом в парах: ≈ 6 минут спрашивает первый, ≈ 6 минут второй. Если партнёр действительно в роли плательщика в продукте ученика и сам хочет — отвечает от своего имени (реальный разговор; «Согласен» нажимает сам партнёр); если похож, но не в этой роли или не хочет — играет роль. Реальный разговор — по желанию. Не спрашивайте и не считайте в классе, кто услышал «да».' },
    { uz: "Sherik «ha» desa ham pul olinmaydi, to'lov sahifasi yoki «mashq to'lov» havolasi berilmaydi.", ru: 'Даже если партнёр скажет «да», денег не берут, страницу оплаты или ссылку «тренировочная оплата» не дают.' }
  ]
};
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const bugun = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const sonFmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const MAYDON_RANG = '#2E9E4F';
const MJ = () => <b className="mt-mj">Maydon Jamoa</b>;

// Saqlash kalitlari (tayanch 8 aynan): o'qiydi — 4-dars narxi, 2-dars modeli, 11-Modul intervyusi · yozadi — pm-m11d6-suhbat
const NARX_KEY = 'pm-m11d4-narx';
const MODEL_KEY = 'pm-m11d2-model';
const INTERVYU_KEY = 'pm-m9d3-intervyu';
const SUHBAT_KEY = 'pm-m11d6-suhbat';
const narxSon = (v) => { const n = Number(String(v ?? '').replace(/[\s.,]/g, '')); return Number.isFinite(n) && n > 0 ? n : null; };
const narxOl = () => {
  const n = lsO(NARX_KEY); const narx = n && narxSon(n.narx);
  if (!narx) return null;
  return { narx, davrKun: narxSon(n.davrKun), ekran: n.ekran && typeof n.ekran === 'object' ? n.ekran : {} };
};
const suhbatOl = () => {
  const s = lsO(SUHBAT_KEY) || {};
  return { skript: Array.isArray(s.skript) ? s.skript : [], suhbatlar: Array.isArray(s.suhbatlar) ? s.suhbatlar : [], xulosa: s.xulosa ?? null, savedAt: s.savedAt ?? null };
};
// xulosa — bu darsda null (MD A-11); savedAt har saqlashda yangilanadi
const suhbatYoz = (patch) => { const d = { ...suhbatOl(), ...patch, savedAt: Date.now() }; lsY(SUHBAT_KEY, d); return d; };
const skriptToliq = (sk) => Array.isArray(sk) && sk.length === 4 && sk.every(q => String(q || '').trim());
const intervyuKimlar = () => {
  const iv = lsO(INTERVYU_KEY); if (!iv) return [];
  const r = [...(Array.isArray(iv.yozuvlar) ? iv.yozuvlar : []), ...(Array.isArray(iv.goyalar) ? iv.goyalar : [])]
    .map(x => String((x && x.kim) || '').trim()).filter(Boolean);
  return [...new Set(r)].slice(0, 5);
};

// Mentor misoli (tayanch 1.0, 1.4, 1.6 — so'zma-so'z)
const MENTOR_EKRAN = {
  sarlavha: { uz: "Doimiy o'yin — Pro'da", ru: 'Постоянная игра — в Pro' },
  matn: { uz: "Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.", ru: 'Каждую неделю в тот же день и час игра объявляется сама.' },
  narx: { uz: "30 kun — 15 000 so'm", ru: '30 дней — 15 000 сумов' },
  tugma: { uz: "To'lovga o'tish", ru: 'Перейти к оплате' }
};
const TEST_REJIM = { uz: 'Test rejim: pul yechilmaydi', ru: 'Тестовый режим: деньги не списываются' };
const TAXMIN_YORLIQ = { uz: 'Mentorning taxmini', ru: 'Предположение Ментора' };
const MENTOR_SKRIPT = [
  { uz: "Hozir o'yinni qanday yig'asiz va bunga haftada qancha vaqt ketadi?", ru: 'Как вы сейчас собираете игру и сколько времени на это уходит в неделю?' },
  { uz: "Bunga hozir pul sarflaysizmi — nimaga?", ru: 'Тратите ли вы на это деньги сейчас — на что?' },
  { uz: "\"Doimiy o'yin\" 30 kunga 15 000 so'm bo'lsa — olarmidingiz? Nega?", ru: '«Постоянная игра» за 15 000 сумов на 30 дней — взяли бы? Почему?' },
  { uz: "Qancha bo'lsa olardingiz?", ru: 'За сколько бы взяли?' }
];
const SHART4 = { uz: "javob «yo'q» yoki «qimmat» bo'lsa", ru: 'если ответ «нет» или «дорого»' };
const MENTOR_SUHBAT = [
  { kim: { uz: '1-tashkilotchi', ru: 'Организатор 1' }, gap: { uz: "«Har hafta guruhga o'zim yozaman. O'zi e'lon qilsa — 15 000 ga olaman.»", ru: '«Каждую неделю пишу в группу сам. Если будет объявлять сама — возьму за 15 000.»' }, javob: 'ha', narxi: 15000 },
  { kim: { uz: '2-tashkilotchi', ru: 'Организатор 2' }, gap: { uz: "«Telegram guruhi tekin-ku, pul to'lamayman.»", ru: '«Telegram-группа же бесплатная, платить не буду.»' }, javob: 'yoq', narxi: null },
  { kim: { uz: '3-tashkilotchi', ru: 'Организатор 3' }, gap: { uz: "«15 000 qimmat. 10 000 bo'lsa olardim.»", ru: '«15 000 — дорого. За 10 000 взял бы.»' }, javob: 'qimmat', narxi: 10000 }
];
const MENTOR_XULOSA = [
  { uz: "Mentor xulosasi: uch suhbat — kichik son: narx haqida dalil, isbot emas.", ru: 'Вывод Ментора: три разговора — малое число: довод о цене, но не доказательство.' },
  { uz: "Narx hozircha qoladi, «qimmat» javobi yozib qo'yildi.", ru: 'Цена пока остаётся, ответ «дорого» записан.' }
];
const SOTISH_GAPLAR = [
  { uz: "\"Doimiy o'yin\" juda qulay — hozir olmasangiz, keyin qimmatlashadi.", ru: '«Постоянная игра» очень удобна — не возьмёте сейчас, потом подорожает.' },
  { uz: "Boshqa tashkilotchilar ham oldi — siz ham yaxshilab o'ylab ko'ring.", ru: 'Другие организаторы тоже взяли — подумайте и вы хорошенько.' }
];
// Javob belgilari (tayanch 1.6; tartib o'zgarmaydi; qizil yo'q — «yo'q» xato emas)
const BELGILAR = [
  { k: 'ha', t: { uz: 'ha', ru: 'да' }, rang: 'b-ok' },
  { k: 'qimmat', t: { uz: 'qimmat', ru: 'дорого' }, rang: 'b-acc' },
  { k: 'yoq', t: { uz: "yo'q", ru: 'нет' }, rang: 'b-kul' },
  { k: 'javobsiz', t: { uz: "javob yo'q", ru: 'нет ответа' }, rang: 'b-kul' }
];
const BELGI = Object.fromEntries(BELGILAR.map(b => [b.k, b]));
const JAVOBSIZ_QATOR = { uz: "Javob yo'q — odam javob bermasa.", ru: 'Нет ответа — если человек не ответил.' };
const USTUN = [{ uz: 'kim', ru: 'кто' }, { uz: 'gap', ru: 'слова' }, { uz: 'belgi', ru: 'отметка' }, { uz: 'narx', ru: 'цена' }];

// --- yordamchi hook'lar ---
function useUchish() {
  const [uchlar, setUchlar] = useState([]);
  const kRef = useRef(0);
  const uch = useCallback((fromEl, toEl, matn, kechik = 0) => {
    if (!fromEl || !toEl || kamHarakat() || typeof document === 'undefined') return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const k = ++kRef.current;
    const qosh = () => setUchlar(u => [...u, { k, matn, x: a.left + Math.min(24, a.width / 3), y: a.top + Math.min(10, a.height / 3), dx: b.left - a.left, dy: b.top - a.top }]);
    if (kechik) setTimeout(qosh, kechik); else qosh();
    setTimeout(() => setUchlar(u => u.filter(z => z.k !== k)), 900 + kechik);
  }, []);
  const qatlam = typeof document !== 'undefined' && uchlar.length > 0
    ? createPortal(uchlar.map(z => <span key={z.k} className="mt-uch" style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
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
  <span className={cxx('mt-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>
);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="mt-x-m">{matn}</span>{izoh && <span className="mt-x-iz">{izoh}</span>}</>;
const BashoratQ = ({ savol, javob }) => <div className="mt-bashq fade-step"><span>{savol}</span><span className="mt-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;

// --- Odam (SABOQ 36: bosh, soch, yuz, rangli kiyim, qo'lida telefon; iliq ranglar) ---
const ODAM = [
  { kiyim: '#3D8BD9', soch: '#2E2019', teri: '#E3A87C' },
  { kiyim: '#E07A5F', soch: '#5A3A22', teri: '#D9966B' }
];
const Odam = ({ i = 0, oyna }) => {
  const o = ODAM[i % ODAM.length];
  return (
    <svg className={cxx('mt-odam', oyna && 'oyna')} viewBox="0 0 60 84" aria-hidden="true">
      <path d="M8 84 C8 63, 17 53, 30 53 C43 53, 52 63, 52 84 Z" fill={o.kiyim} />
      <rect x="25" y="43" width="10" height="11" rx="3" fill={o.teri} />
      <circle cx="30" cy="29" r="15" fill={o.teri} />
      <path d="M14.5 28 C12 10, 48 10, 45.5 28 C41 19.5, 22 19, 14.5 28 Z" fill={o.soch} />
      <circle cx="24.5" cy="30.5" r="1.7" fill="#2A2730" /><circle cx="35.5" cy="30.5" r="1.7" fill="#2A2730" />
      <path d="M25 36.5 Q30 40.5 35 36.5" stroke="#8A4B3A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="37" y="58" width="10" height="16" rx="2.4" fill="#2A2730" />
      <rect x="38.6" y="60" width="6.8" height="11" rx="1.2" fill="#9CCBF2" />
      <circle cx="42" cy="76" r="4.4" fill={o.teri} />
    </svg>
  );
};

// --- Telefon: to'lov taklifi ekrani (o'quvchiniki — pm-m11d4-narx, yo'q bo'lsa Mentorniki; «Test rejim» doim) ---
const TelefonEkran = ({ narx, yon, ulandi, nRef }) => {
  const m = !narx;
  const e = m ? null : narx.ekran || {};
  const sar = m ? tr(MENTOR_EKRAN.sarlavha) : (String(e.sarlavha || '').trim() || '…');
  const matn = m ? tr(MENTOR_EKRAN.matn) : String(e.matn || '').trim();
  const tugma = m ? tr(MENTOR_EKRAN.tugma) : (String(e.tugma || '').trim() || tr(MENTOR_EKRAN.tugma));
  const som = tr({ uz: "so'm", ru: 'сум' });
  const narxQ = m ? tr(MENTOR_EKRAN.narx) : (narx.davrKun ? `${narx.davrKun} ${tr({ uz: 'kun', ru: 'дн.' })} — ${sonFmt(narx.narx)} ${som}` : `${sonFmt(narx.narx)} ${som}`);
  return (
    <div className="mt-telj">
      <span className="mt-tel-yorliq">{m ? <>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></> : tr({ uz: '4-darsdagi ekraningiz', ru: 'Ваш экран из 4-го урока' })}</span>
      <div className="mt-tel">
        <span className="mt-tel-bar">{m ? <MJ /> : <i className="mt-tel-nuqta" />}</span>
        <div className="mt-tel-ekran">
          <b className="mt-tel-sar">{sar}</b>
          {matn && <span className="mt-tel-matn">{matn}</span>}
          <span ref={nRef} key={yon ? 'y' : 'n'} className={cxx('mt-tel-narx', yon && 'yon', ulandi && 'ulandi')}>{narxQ}</span>
          {m && <span className="mt-tel-tax">{tr(TAXMIN_YORLIQ)}</span>}
          <span className="mt-tel-btn">{tugma}</span>
          <span className="mt-tel-test">{tr(TEST_REJIM)}</span>
        </div>
      </div>
    </div>
  );
};

// --- Sahna: ikki odam yuzma-yuz, pufaklar tepada (chapdagisi so'raydi, o'ngdagisi javob beradi); joy chizilmaydi ---
const Sahna = ({ chap, ong, ongYorliq, chapGap, ongGap, chapKey, ongKey, ortada, ongRef, ixcham }) => (
  <div className={cxx('mt-sahna', ixcham && 'ixcham')}>
    <div className="mt-pufaklar">
      <div className="mt-pj chap">{chapGap && <span key={chapKey} className="mt-pufak chap">{chapGap}</span>}</div>
      <div className="mt-pj ong">{ongGap && <span key={ongKey} ref={ongRef} className="mt-pufak ong">{ongGap}</span>}</div>
    </div>
    <div className="mt-sq">
      <div className="mt-shaxs"><Odam i={0} /><b className="mt-shaxs-n">{chap}</b></div>
      <div className="mt-ortada">{ortada}</div>
      <div className="mt-shaxs"><Odam i={1} oyna /><b className="mt-shaxs-n">{ong}</b>{ongYorliq && <span key={ongYorliq} className="mt-rol">{ongYorliq}</span>}</div>
    </div>
  </div>
);

// --- Varaq: sarlavha + bo'limlar (Savollar · Suhbatlar/Yozuvlarim) ---
const Varaq = ({ sarlavha, sKey, children, className, vRef }) => (
  <div ref={vRef} className={cxx('mt-varaq', className)}>
    {sarlavha && <div key={sKey} className="mt-varaq-h">{sarlavha}</div>}
    {children}
  </div>
);
const Bolim = ({ nom, children }) => <div className="mt-bolim"><span className="mt-bolim-n">{nom}</span>{children}</div>;
const Uya = ({ n, matn, bosh, yorliq, yangi, faol, ixcham, uRef, onTahrir, style }) => (
  <div ref={uRef} className={cxx('mt-uya', bosh && 'bosh', yangi && 'yangi', faol && 'faol', ixcham && 'ixcham')} style={style}>
    <i>{n}</i>
    <span className="mt-uya-m">{bosh ? null : matn}{!bosh && yorliq && <em>{yorliq}</em>}</span>
    {onTahrir && <QChip className="mt-tahrir" onClick={onTahrir} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</QChip>}
  </div>
);
const Belgi = ({ k }) => { const b = BELGI[k]; return b ? <b className={cxx('mt-bk-b', b.rang)}>{tr(b.t)}</b> : null; };
const Jadval = ({ qatorlar, bRef, nRef }) => (
  <div className="mt-jadval">
    <div className="mt-jq sar">{USTUN.map((u, i) => <span key={i}>{tr(u)}</span>)}</div>
    {qatorlar.map((q, i) => (
      <div key={q.k} className={cxx('mt-jq', q.yangi && 'yangi', q.joriy && 'joriy', q.uzuq && 'uzuq', q.err && 'err')} style={{ '--i': i }}>
        <span className="mt-kim">{q.kim}</span>
        <span className="mt-gap">{q.gap}</span>
        <span ref={bRef ? (el) => { bRef.current[i] = el; } : undefined} className="mt-bk">{q.javob ? <Belgi k={q.javob} /> : null}</span>
        <span ref={nRef ? (el) => { nRef.current[i] = el; } : undefined} className="mt-nk">{q.narx}</span>
        {q.hozir && <span className="mt-hozir">{tr({ uz: 'Hozir', ru: 'Сейчас' })}: {q.hozir}</span>}
        {q.onTahrir && <QChip className="mt-tahrir" onClick={q.onTahrir} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</QChip>}
      </div>
    ))}
  </div>
);
const narxKatak = (n) => (n ? sonFmt(n) : '—');

// ===== SCREEN 0 — KIRISH (QKirish; sof so'rovnoma — J-026: correct false hammaga, maqtovsiz bitta javob) =====
const HOOK_OPTS = [
  { id: 'ha', label: { uz: '«Ha, olaman» deydi', ru: 'Скажет «Да, возьму»' }, gap: { uz: 'Ha, olaman', ru: 'Да, возьму' } },
  { id: 'qimmat', label: { uz: '«Qimmat ekan» deydi', ru: 'Скажет «Дороговато»' }, gap: { uz: 'Qimmat ekan', ru: 'Дороговато' } },
  { id: 'kerak', label: { uz: '«Kerak emas» deydi', ru: 'Скажет «Не нужно»' }, gap: { uz: 'Kerak emas', ru: 'Не нужно' } }
];
const HOOK_JAVOB = { uz: "Uchalasi ham bo'lishi mumkin — oldindan bilib bo'lmaydi. Buni odamning o'zidan so'raysiz va gapini yozib olasiz.", ru: 'Возможен любой из трёх ответов — заранее не узнать. Вы спросите самого человека и запишете его слова.' };
// Jonli dars: sinf ovozlari chizig'i — faqat variantlar soni, ism yo'q (MD KOD 9)
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
    <div className="mt-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={cxx('mt-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="mt-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>)}
    </div>
  );
};
const HookMaket = ({ narx, tanlov, darhol }) => {
  const [f, setF] = useState(tanlov ? 4 : 0); // 0 «…» · 1–3 uch javob bir lahzadan · 4 «?» (qaysi biri — ochilmaydi, P-036)
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; if (darhol || !tanlov) return undefined; }
    if (!tanlov) return undefined;
    if (kamHarakat()) { setF(4); return undefined; }
    setF(1);
    const ts = [setTimeout(() => setF(2), 480), setTimeout(() => setF(3), 960), setTimeout(() => setF(4), 1440)];
    return () => ts.forEach(clearTimeout);
  }, [tanlov]); // eslint-disable-line
  const gap = f === 0 ? '…' : f === 4 ? '?' : tr(HOOK_OPTS[f - 1].gap);
  return (
    <div className="mt-hook">
      <TelefonEkran narx={narx} yon={!!tanlov && !darhol} />
      <div className="mt-hook-javob">
        <b className="mt-shaxs-n">{tr({ uz: 'tashkilotchi', ru: 'организатор' })}</b>
        <span key={f} className={cxx('mt-pufak', 'ong', 'yakka', f === 4 && 'savol')}>{gap}</span>
      </div>
    </div>
  );
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [narx] = useState(narxOl);
  const [darhol] = useState(storedAnswer !== undefined);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', HOOK_OPTS.findIndex(o => o.id === v), false, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('mt-s0', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Pul haqida <A>qanday gaplashasiz?</A></>, ru: <>Как говорить <A>о деньгах?</A></> })}
          mentor={<Mentor>{narx
            ? tr({ uz: "Narxni 4-darsda o'zingiz belgiladingiz. To'laydigan odamga aytsangiz, u nima deydi?", ru: 'Цену вы сами назначили на 4-м уроке. Если сказать её тому, кто платит, — что он ответит?' })
            : tr({ uz: "Mentorning taxmini: Pro 30 kunga 15 000 so'm. Buni tashkilotchiga aytsangiz, u nima deydi?", ru: 'Предположение Ментора: Pro — 15 000 сумов на 30 дней. Если сказать это организатору, что он ответит?' })}</Mentor>}
          maket={<HookMaket narx={narx} tanlov={picked} darhol={darhol} />}
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

// ===== SCREEN 1 — REJA (QReja; chap: menyu osti + varaq o'zi yuradi — uzuq joylar o'quvchi to'ldiradigan maydon (U-041), ustun nomlari — haqiqiy mazmun, savol matni yo'q — P-036) =====
const REJA = [
  { t: { uz: "Narxni suhbatning qayerida aytishni bilasiz", ru: 'Узнаете, в какой момент разговора называть цену' }, teg: { uz: 'suhbat', ru: 'разговор' } },
  { t: { uz: "Odamning javobini so'zma-so'z yozasiz", ru: 'Запишете ответ человека слово в слово' }, teg: { uz: "ha · qimmat · yo'q", ru: 'да · дорого · нет' } },
  { t: { uz: "O'z narxingiz uchun savollar yozasiz", ru: 'Напишете вопросы для своей цены' }, teg: { uz: 'suhbat savollari', ru: 'вопросы разговора' } },
  { t: { uz: "Sherigingiz bilan rol o'yinida mashq qilasiz", ru: 'Потренируетесь с партнёром в ролевой игре' }, teg: { uz: "rol o'yini", ru: 'ролевая игра' } }
];
const RejaVaraq = () => {
  const f = useYurish([150, 300, 450, 600, 850, 1050, 1250, 1450]);
  return (
    <Varaq className="mt-reja-v">
      <Bolim nom={tr({ uz: 'Savollar', ru: 'Вопросы' })}>
        <div className="mt-uyalar">{[0, 1, 2, 3].map(i => f > i && <Uya key={i} n={i + 1} bosh ixcham />)}</div>
      </Bolim>
      <Bolim nom={<>{tr({ uz: 'Yozuvlarim', ru: 'Мои записи' })} · {tr({ uz: 'real', ru: 'реальных' })} 0 / 3</>}>
        {f > 4 && <Jadval qatorlar={[0, 1, 2].filter(i => f > 5 + i).map(i => ({ k: 'r' + i, uzuq: true }))} />}
      </Bolim>
    </Varaq>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun narx haqida <A>savol berishni o'rganasiz.</A></>, ru: <>Сегодня вы научитесь <A>задавать вопросы о цене.</A></> })}
      mentor={<Mentor>{tr({ uz: "Narxingiz hozircha taxmin — uni odamlarning o'z gapi bilan tekshirasiz. Avval sherigingiz bilan mashq qilasiz.", ru: 'Ваша цена пока предположение — вы проверите её словами самих людей. Сначала потренируетесь с партнёром.' })}</Mentor>}
      chapYorliq={tr({ uz: "Narx bo'yicha uchta real suhbat", ru: 'Три реальных разговора о цене' })}
      chap={<><p className="mt-kulrang">{tr({ uz: "Darsda — suhbat savollari va mashq; suhbatlar — darsda va uyda, uchtagacha.", ru: 'На уроке — вопросы разговора и тренировка; разговоры — на уроке и дома, до трёх.' })}</p><RejaVaraq /></>}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    >
      <Ustoz satrlar={USTOZ.s1} />
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — SAVOL YOKI SOTISH GAPI (QTushuncha; bashorat → 6 gap bittadan → natija bitta yashil blok, E 42/E 53) =====
const S2_GAPLAR = [
  { g: MENTOR_SKRIPT[0], k: 'savol', uya: 0 },
  { g: SOTISH_GAPLAR[0], k: 'sotish' },
  { g: MENTOR_SKRIPT[1], k: 'savol', uya: 1 },
  { g: MENTOR_SKRIPT[2], k: 'savol', uya: 2 },
  { g: SOTISH_GAPLAR[1], k: 'sotish' },
  { g: MENTOR_SKRIPT[3], k: 'savol', uya: 3 }
];
const S2_XATO = [
  { uz: "Bu gap tashkilotchidan nimani so'rayapti — qarang.", ru: 'Посмотрите: о чём эта фраза спрашивает организатора?' },
  { uz: "Bu gap odamdan biror narsa so'rayaptimi?", ru: 'Эта фраза о чём-то спрашивает человека?' },
  { uz: "Bu gap odamni olishga undayaptimi?", ru: 'Эта фраза подталкивает человека купить?' },
  { uz: "Gap oxiriga qarang: endi kim gapiradi?", ru: 'Посмотрите на конец фразы: кто теперь говорит?' },
  { uz: "Bu gap odamdan so'rayaptimi yoki undayaptimi?", ru: 'Эта фраза спрашивает человека или подталкивает?' },
  { uz: "Bu gapga kim javob beradi — qarang.", ru: 'Посмотрите: кто отвечает на эту фразу?' }
];
const S2_TAXMIN = [{ k: '2', t: '2' }, { k: '3', t: '3' }, { k: '4', t: '4' }];
const S2_SAVOL = { uz: 'Mentor hozir 6 gap aytadi — nechtasi savol bo\'ladi?', ru: 'Ментор сейчас скажет 6 фраз — сколько из них вопросы?' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = storedAnswer !== undefined;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [i, setI] = useState(avval ? 6 : 0);
  const [chiz, setChiz] = useState(false);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(0);
  const [mGap, setMGap] = useState(avval ? 5 : null);
  const [izoh4, setIzoh4] = useState(false);
  const [yangiU, setYangiU] = useYangi(1100);
  const xatoRef = useRef(false);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null), uyaRef = useRef([]);
  const done = i >= 6;
  const tugadi = useTugadi(done, 1500, avval);
  const ipucha = useIpucha(!!taxmin && !done, i);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: !xatoRef.current, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!izoh4) return undefined; const t = setTimeout(() => setIzoh4(false), 4200); return () => clearTimeout(t); }, [izoh4]);
  const bos = (k) => {
    if (!taxmin || done || chiz) return;
    const g = S2_GAPLAR[i];
    if (k !== g.k) { setXato(i); setSilk(s => s + 1); xatoRef.current = true; if (achMiss) achMiss.miss(screen); return; }
    setXato(null);
    if (k === 'savol') {
      uch(kartaRef.current, uyaRef.current[g.uya], `${g.uya + 1} · ${tr({ uz: 'savol', ru: 'вопрос' })}`);
      setMGap(i); setYangiU(g.uya); setIzoh4(i === 3); setI(i + 1);
    } else {
      setChiz(true); setIzoh4(false);
      setTimeout(() => { setChiz(false); setI(n => n + 1); }, kamHarakat() ? 0 : 700);
    }
  };
  const tolgan = (u) => S2_GAPLAR.findIndex(g => g.uya === u) < i;
  const sotishN = S2_GAPLAR.slice(0, i).filter(g => g.k === 'sotish').length;
  const tx = S2_TAXMIN.find(x => x.k === taxmin);
  const varaq = (
    <Varaq sKey={done ? 'm' : 'v'} sarlavha={done ? tr({ uz: 'Mentorning suhbat savollari', ru: 'Вопросы разговора Ментора' }) : <>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>}>
      <Bolim nom={tr({ uz: 'Savollar', ru: 'Вопросы' })}>
        <div className="mt-uyalar">
          {[0, 1, 2, 3].map(u => <Uya key={u} n={u + 1} uRef={(el) => { uyaRef.current[u] = el; }} bosh={!tolgan(u)} yangi={yangiU === u} matn={tr(MENTOR_SKRIPT[u])}
            yorliq={u === 2 ? tr({ uz: 'narx — Mentorning taxmini', ru: 'цена — предположение Ментора' }) : u === 3 ? tr(SHART4) : null} />)}
        </div>
      </Bolim>
      <p key={sotishN} className={cxx('mt-demaydi', sotishN > 0 && 'bor')}>{tr({ uz: 'Mentor bunday demaydi', ru: 'Ментор так не говорит' })} · <b>{sotishN}</b></p>
    </Varaq>
  );
  const karta = !done && (
    <div ref={kartaRef} key={i} className={cxx('mt-gk', chiz && 'chiz', xato === i && 'err')}>
      <span className="mt-gk-n">{tr({ uz: 'Gap', ru: 'Фраза' })} {i + 1} / 6</span>
      <span className="mt-gk-t">{tr(S2_GAPLAR[i].g)}</span>
    </div>
  );
  // F-1007-474: 6 gap katakchasi — qaysi gap kelgani, nechtasi qolgani ko'rinib turadi
  const katak = !done && (
    <div className="mt-katak fade-step" aria-hidden="true">
      <span className="mt-katak-y">{tr({ uz: '6 gap', ru: '6 фраз' })}</span>
      {S2_GAPLAR.map((_, j) => <i key={j} className={cxx(j < i && 'oldi', j === i && 'joriy')}>{j + 1}</i>)}
    </div>
  );
  const sahna = <div className="mt-sahna-k">{katak}<Sahna chap={tr({ uz: 'Mentor', ru: 'Ментор' })} ong={tr({ uz: 'tashkilotchi', ru: 'организатор' })}
    chapGap={mGap !== null && tr(S2_GAPLAR[mGap].g)} chapKey={mGap} ongGap={mGap !== null && '…'} ongKey={mGap} ortada={karta} /></div>;
  const tugmalar = !done && taxmin && (
    <div className="mt-harakat">
      <div key={silk} className={cxx('mt-tugmalar', taxmin && !chiz && 'mt-chorla', silk > 0 && 'silk')}>
        <QChip className="mt-javob" disabled={!taxmin || chiz} onClick={() => bos('savol')}>{tr({ uz: 'Savol', ru: 'Вопрос' })}</QChip>
        <QChip className="mt-javob" disabled={!taxmin || chiz} onClick={() => bos('sotish')}>{tr({ uz: 'Sotish gapi', ru: 'Продающая фраза' })}</QChip>
      </div>
      {xato !== null && <QXato>{tr(S2_XATO[xato])}</QXato>}
      {izoh4 && xato === null && <QIzoh>{tr({ uz: "Narx aytildi, lekin bu ham savol: oxirida «Nega?». Javobi — so'z, hali to'lov emas.", ru: 'Цена названа, но это тоже вопрос: в конце «Почему?». Ответ — слова, ещё не оплата.' })}</QIzoh>}
      {ipucha && xato === null && <p className="mt-ipucha fade-step">{tr({ uz: "Gap odamdan nimadir so'rayaptimi yoki uni olishga undayaptimi?", ru: 'Фраза что-то спрашивает у человека или подталкивает его купить?' })}</p>}
    </div>
  );
  const navL = !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : !done ? { uz: `Gaplarni ajrating (${i}/6)`, ru: `Разделите фразы (${i}/6)` } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · suhbat', ru: 'Понятие · разговор' })} screen={screen} scrollSignal={i + (taxmin ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navL)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mentor tashkilotchiga <A>qaysi gaplarni aytadi?</A></>, ru: <>Какие фразы Ментор <A>говорит организатору?</A></> })}
        mentor={<Mentor>{tr({ uz: "Mentor misolida Pro tashkilotchi uchun, o'yinchilar bepul — har gapga mos tugmani bosing.", ru: 'В примере Ментора Pro — для организатора, игрокам бесплатно: нажимайте подходящую кнопку для каждой фразы.' })}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />
          : !done && <BashoratQ savol={tr(S2_SAVOL)} javob={tx ? tx.t : ''} />}
        vizual={tugadi ? <div className="mt-fokus">{varaq}</div> : <div className="mt-ikki">{sahna}<div className="mt-o">{varaq}{tugmalar}</div></div>}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={taxmin === '4'} haqiqat="4" />}
          matn={tr({ uz: "Bu darsda suhbat — sotish emas, savol: avval odamning hozirgi ishi so'raladi, keyin narx.", ru: 'На этом уроке разговор — не продажа, а вопрос: сначала спрашивают о том, что человек делает сейчас, потом — цена.' })}
          izoh={tr({ uz: "Suhbat savollari — har odamga bir xil tartibda beriladigan asosiy savollar.", ru: 'Вопросы разговора — основные вопросы, которые задают каждому в одном порядке.' })} />}
      >
        <Ustoz satrlar={USTOZ.s2} />
      </QTushuncha>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ C, INLINE_KEYS.s3 = 2; savol ustida yorliq yo'q — SABOQ 6) =====
const MiniVaraq = ({ children }) => <div className="mt-mini">{children}</div>;
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · suhbat', ru: 'Проверка · разговор' })}
    questionText="Kitob almashish ilovangiz haqida sinfdoshingiz bilan gaplashasiz. Avval nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Kitob almashish ilovangiz haqida sinfdoshingiz bilan gaplashasiz. <A>Avval nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">Вы говорите с одноклассником о своём приложении для обмена книгами. <A>Что сделаете сначала?</A></h2> })}
    options={[
      { uz: 'Ilovaning narxini birinchi bo\'lib aytaman', ru: 'Первым делом назову цену приложения' },
      { uz: "Ilovaning hamma imkoniyatini ko'rsataman", ru: 'Покажу все возможности приложения' },
      { uz: "Hozir kitobni qanday topishini so'rayman", ru: 'Спрошу, как он сейчас находит книги' },
      { uz: 'Sinfdoshlar ham olganini aytib beraman', ru: 'Расскажу, что одноклассники уже взяли' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Avval odamning hozirgi ishi so'raladi, narx keyin.", ru: 'Сначала спрашивают о том, что человек делает сейчас, цена — потом.' }}
    explainWrong={{
      0: { uz: 'Mentor narxni nechanchi savolda aytgan edi?', ru: 'В каком по счёту вопросе Ментор назвал цену?' },
      1: { uz: "Bu ko'rsatish — odamdan hech narsa so'ralmadi.", ru: 'Это показ — у человека ничего не спросили.' },
      3: { uz: 'Bu sotish gapi — suhbatda odam o\'zi gapiradi.', ru: 'Это продающая фраза — в разговоре говорит сам человек.' },
      default: { uz: 'Mentorning birinchi savoli nima haqida edi?', ru: 'О чём был первый вопрос Ментора?' }
    }}
    vizual={<MiniVaraq><Uya n="1" matn={tr({ uz: 'hozirgi ish', ru: 'текущее дело' })} faol ixcham /><Uya n="3" matn={tr({ uz: 'narx', ru: 'цена' })} ixcham /></MiniVaraq>} />
);

// ===== SCREEN 4 — UCH SUHBAT (QTushuncha; bashorat → 3 yozuv bittadan, to'rt belgi tugmasi; natija — bitta yashil blok) =====
const S4_TAXMIN = [{ k: '0', t: '0' }, { k: '1', t: '1' }, { k: '2', t: '2' }];
const S4_SAVOL = { uz: 'Uch tashkilotchidan nechtasi «ha» dedi?', ru: 'Сколько из трёх организаторов сказали «да»?' };
const S4_XATO = {
  oxiri: { uz: "Gapning oxirini qayta o'qing: u nima qiladi?", ru: 'Перечитайте конец фразы: что он сделает?' },
  qimmatmi: { uz: 'U narxni qimmat dedimi?', ru: 'Он сказал, что цена дорогая?' },
  shuNarx: { uz: 'U shu narxda olishini aytdimi?', ru: 'Он сказал, что возьмёт по этой цене?' },
  boshqaNarx: { uz: "U boshqa narxda nima qilishini aytdi — qarang.", ru: 'Посмотрите: он сказал, что сделает при другой цене.' },
  javobBerdi: { uz: 'U javob berdi — gapi yozilgan.', ru: 'Он ответил — его слова записаны.' }
};
const s4XatoK = (j, k) => (k === 'javobsiz' ? 'javobBerdi' : j === 0 ? 'oxiri' : j === 1 ? (k === 'ha' ? 'oxiri' : 'qimmatmi') : (k === 'ha' ? 'shuNarx' : 'boshqaNarx'));
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = storedAnswer !== undefined;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [j, setJ] = useState(avval ? 3 : 0);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(0);
  const [izoh2, setIzoh2] = useState(false);
  const [yangiQ, setYangiQ] = useYangi(1200);
  const xatoRef = useRef(false);
  const [uch, qatlam] = useUchish();
  const tugRef = useRef(null), ongRef = useRef(null), bRef = useRef([]), nRef = useRef([]);
  const done = j >= 3;
  const tugadi = useTugadi(done, 1500, avval);
  const ipucha = useIpucha(!!taxmin && !done, j);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: !xatoRef.current, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!izoh2) return undefined; const t = setTimeout(() => setIzoh2(false), 3400); return () => clearTimeout(t); }, [izoh2]);
  const bos = (k) => {
    if (!taxmin || done) return;
    const s = MENTOR_SUHBAT[j];
    if (k !== s.javob) { setXato({ j, k: s4XatoK(j, k) }); setSilk(x => x + 1); xatoRef.current = true; if (achMiss) achMiss.miss(screen); return; }
    setXato(null);
    const btn = tugRef.current && tugRef.current.querySelector(`[data-b="${k}"]`);
    uch(btn, bRef.current[j], tr(BELGI[k].t));
    if (s.narxi) uch(ongRef.current, nRef.current[j], sonFmt(s.narxi), 160);
    setYangiQ(j); setIzoh2(j === 1); setJ(j + 1);
  };
  const tx = S4_TAXMIN.find(x => x.k === taxmin);
  const qatorlar = MENTOR_SUHBAT.map((s, n) => (n < j
    ? { k: 's' + n, kim: tr(s.kim), gap: tr(s.gap), javob: s.javob, narx: narxKatak(s.narxi), yangi: yangiQ === n }
    : n === j ? { k: 's' + n, kim: tr(s.kim), joriy: true, err: xato && xato.j === n } : { k: 's' + n, uzuq: true }));
  const varaq = (
    <Varaq sarlavha={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>}>
      <Bolim nom={<>{tr({ uz: 'Suhbatlar', ru: 'Разговоры' })} · {Math.min(j, 3)} / 3</>}>
        <Jadval qatorlar={qatorlar} bRef={bRef} nRef={nRef} />
      </Bolim>
      {done && <p className="mt-mentor-yozuv fade-step">{tr(MENTOR_XULOSA[1])}</p>}
    </Varaq>
  );
  const s = MENTOR_SUHBAT[Math.min(j, 2)];
  const sahna = <Sahna chap={tr({ uz: 'Mentor', ru: 'Ментор' })} ong={tr(s.kim)} chapGap={tr(MENTOR_SKRIPT[2])} chapKey="q3" ongGap={tr(s.gap)} ongKey={j} ongRef={ongRef} />;
  const tugmalar = !done && taxmin && (
    <div className="mt-harakat" ref={tugRef}>
      <div key={silk} className={cxx('mt-tugmalar', 'mt-belgilar', taxmin && 'mt-chorla', silk > 0 && 'silk')}>
        {BELGILAR.map(b => <QChip key={b.k} data-b={b.k} className={cxx('mt-belgi', b.rang)} disabled={!taxmin} onClick={() => bos(b.k)}>{tr(b.t)}</QChip>)}
      </div>
      <p className="mt-kulrang">{tr(JAVOBSIZ_QATOR)}</p>
      {xato && <QXato>{tr(S4_XATO[xato.k])}</QXato>}
      {izoh2 && !xato && <QIzoh>{tr({ uz: "«Yo'q» ham natija — u ham yozuvda qoladi.", ru: '«Нет» — тоже результат: он тоже остаётся в записи.' })}</QIzoh>}
      {ipucha && !xato && <p className="mt-ipucha fade-step">{tr({ uz: 'Odam shu narxda oladimi, qimmat dedimi yoki olmaydimi?', ru: 'Человек возьмёт по этой цене, сказал «дорого» или не возьмёт?' })}</p>}
    </div>
  );
  const navL = !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : !done ? { uz: `Belgi qo'ying (${j}/3)`, ru: `Поставьте отметку (${j}/3)` } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · javob', ru: 'Понятие · ответ' })} screen={screen} scrollSignal={j + (taxmin ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navL)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Uch tashkilotchi <A>narx haqida nima dedi?</A></>, ru: <>Что три организатора <A>сказали о цене?</A></> })}
        mentor={<Mentor>{tr({ uz: "Mentor javoblarni intervyudagidek so'zma-so'z yozgan — har yozuvga mos belgini bosing.", ru: 'Ментор записал ответы слово в слово, как на интервью, — нажмите подходящую отметку для каждой записи.' })}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />
          : !done && <BashoratQ savol={tr(S4_SAVOL)} javob={tx ? tx.t : ''} />}
        vizual={tugadi ? <div className="mt-fokus">{varaq}</div> : <div className="mt-ikki">{sahna}<div className="mt-o">{varaq}{tugmalar}</div></div>}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={taxmin === '1'} haqiqat="1" />}
          matn={tr({ uz: "Bu darsda javob so'zma-so'z yoziladi va belgi oladi: ha, qimmat, yo'q yoki javob yo'q.", ru: 'На этом уроке ответ записывают слово в слово и ставят отметку: да, дорого, нет или нет ответа.' })}
          izoh={tr(MENTOR_XULOSA[0])} />}
      >
        <Ustoz satrlar={USTOZ.s4} />
      </QTushuncha>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen → QTest; ✔ B, INLINE_KEYS.s5 = 1) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · yozuv', ru: 'Проверка · запись' })}
    questionText="Tanishingiz: «Kitobni do'stimdan so'rab olaman, pul bermayman». Yozuvga nima yozasiz?"
    question={tr({ uz: <h2 className="title h-ask">Tanishingiz: «Kitobni do'stimdan so'rab olaman, pul bermayman». <A>Yozuvga nima yozasiz?</A></h2>, ru: <h2 className="title h-ask">Знакомый: «Возьму книгу у друга, платить не буду». <A>Что вы запишете?</A></h2> })}
    options={[
      { uz: "«Qiziqmadi» degan xulosa va «yo'q» belgisi", ru: 'Вывод «не заинтересовался» и отметку «нет»' },
      { uz: "Uning gapi so'zma-so'z va «yo'q» belgisi", ru: 'Его слова дословно и отметку «нет»' },
      { uz: "Uning gapi so'zma-so'z va «qimmat» belgisi", ru: 'Его слова дословно и отметку «дорого»' },
      { uz: "Hech narsa: «yo'q» javobi yozuvga kirmaydi", ru: 'Ничего: ответ «нет» в запись не идёт' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Odamning o'z gapi va belgisi — «yo'q» ham natija.", ru: 'Собственные слова человека и отметка — «нет» тоже результат.' }}
    explainWrong={{
      0: { uz: 'Xulosa sizniki — yozuvga odamning gapi tushadi.', ru: 'Вывод — ваш, а в запись идут слова человека.' },
      2: { uz: 'U narxni qimmat dedimi? Gapini qayta o\'qing.', ru: 'Он сказал, что цена дорогая? Перечитайте его слова.' },
      3: { uz: "Mentor misolida «yo'q» javobi yozilmay qolganmidi?", ru: 'В примере Ментора ответ «нет» остался незаписанным?' },
      default: { uz: 'Mentor 2-tashkilotchining gapini qanday yozgan edi?', ru: 'Как Ментор записал слова организатора 2?' }
    }}
    vizual={<MiniVaraq><Jadval qatorlar={[{ k: 't', kim: tr({ uz: 'tanish', ru: 'знакомый' }), gap: tr({ uz: "«Kitobni do'stimdan so'rab olaman, pul bermayman»", ru: '«Возьму книгу у друга, платить не буду»' }), javob: 'yoq', narx: '—' }]} /></MiniVaraq>} />
);

// ===== 6, 7-EKRAN TEKSHIRUVLARI — sof funksiyalar (React va tr siz; PM-108 — node da namunalar bilan sinaladi) =====
// TEKSHIRUV-BOSHI
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normS = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const AKKAUNT_RE = /@|t\.me\/|\+\s*998/;
const TELEFON_RE = /(^|[^\d])\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}(?![\d])/;
const RAQAM7_RE = /\d{7,}/;
const sonlar = (s) => (String(s || '').match(/\d{1,3}(?:[ .,]\d{3})+|\d+/g) || []).map(x => Number(x.replace(/[ .,]/g, '')));
// So'z ro'yxatlari ikki tilda (o'quvchi javobi uz yoki ru bo'lishi mumkin — 11-Modul sinfi)
const KIR = '\u0430-\u044f\u0451';
const SOZ = {
  sotish: { uz: "arzon|atigi|chegirma|tezroq|oling|olmasangiz|hamma oldi|o'ylab ko'ring", ru: 'дешев|всего за|скидк|быстрее|купите|все купили|подумайте' },
  kelajak: { uz: "armidingiz|arsiz(?![a-z'])|bo'lsa", ru: 'купили бы|взяли бы|будете|если бы' },
  xulosa: { uz: "qiziqdi|qiziqmadi|yoqdi|yoqmadi|rozi bo'ldi|ko'ndi", ru: 'заинтересовал|понравил|согласил|уговорил' },
  qimmat: { uz: 'qimmat', ru: 'дорог' }
};
const RX = Object.fromEntries(Object.entries(SOZ).map(([k, v]) => [k, {
  uz: new RegExp(k === 'kelajak' || k === 'qimmat' ? '(' + v.uz + ')' : "(^|[^a-z'])(" + v.uz + ')'),
  ru: new RegExp(k === 'kelajak' || k === 'qimmat' ? '(' + v.ru + ')' : '(^|[^' + KIR + '])(' + v.ru + ')')
}]));
const bor = (k, v) => RX[k].uz.test(v) || RX[k].ru.test(v);
const SIZ_SOZ = { uz: 'siz', ru: 'вы|вас|вам' };
const SIZ_QOSH = { uz: '', ru: 'ете|ите|етесь|итесь' };
const SIZ_RE = { uz: /siz/, ru: new RegExp('(^|[^' + KIR + '])(' + SIZ_SOZ.ru + ')(?![' + KIR + '])|(' + SIZ_QOSH.ru + ')(?![' + KIR + '])') };
const telBormi = (v) => AKKAUNT_RE.test(v) || TELEFON_RE.test(v);
// 6-ekran: maydon (kim · hozir · nima · narx · savol) → null | { k, yumshoq }
function s6Tekshir(maydon, qiymat) {
  const v = normS(qiymat);
  if (maydon === 'narx') return narxSonT(qiymat) ? null : { k: 'narx' };
  if (!v) return { k: 'bosh' };
  if (maydon === 'kim') return (telBormi(v) || /\d{7,}/.test(v.replace(/[\s-]/g, ''))) ? { k: 'rol' } : null;
  if (telBormi(v)) return { k: 'telSavol' };
  if (maydon === 'hozir') {
    if (/so'm|сум/.test(v) || sonlar(v).some(n => n >= 1000)) return { k: 'narxQator' };
    if (bor('sotish', v)) return { k: 'sotish', yumshoq: true };
    if (bor('kelajak', v)) return { k: 'kelajak', yumshoq: true };
    if (!SIZ_RE.uz.test(v) && !SIZ_RE.ru.test(v)) return { k: 'siz', yumshoq: true };
    return null;
  }
  if (bor('sotish', v)) return { k: 'sotish', yumshoq: true };
  return null;
}
function narxSonT(v) { const n = Number(String(v ?? '').replace(/[\s.,]/g, '')); return Number.isFinite(n) && n > 0 ? n : null; }
// 7-ekran yozuvi: { gap, javob } → null | { k, yumshoq } (hozir — alohida: s7Hozir)
function s7Tekshir(gap, javob) {
  const v = normS(gap);
  if (!javob) return { k: 'belgi' };
  if (!v && javob !== 'javobsiz') return { k: 'gapBosh' };
  if (telBormi(v)) return { k: 'tel' };
  if (RAQAM7_RE.test(v)) return { k: 'raqam', yumshoq: true };
  if (bor('xulosa', v)) return { k: 'xulosa', yumshoq: true };
  if (javob === 'ha' && bor('qimmat', v)) return { k: 'haQimmat', yumshoq: true };
  return null;
}
function s7Hozir(hozir) {
  const v = normS(hozir);
  if (!v) return { k: 'hozirBosh', yumshoq: true };
  if (telBormi(v)) return { k: 'tel' };
  if (RAQAM7_RE.test(v)) return { k: 'raqam', yumshoq: true };
  return null;
}
// TEKSHIRUV-OXIRI
const TX = {
  bosh: { uz: "Bu joy bo'sh — savol to'liq chiqmaydi.", ru: 'Это поле пустое — вопрос получится неполным.' },
  rol: { uz: 'Rol yozing — ism, telefon va akkaunt nomi emas.', ru: 'Напишите роль — не имя, телефон или имя аккаунта.' },
  narxQator: { uz: "Narx uchinchi savolda — bu yerda hozirgi ishni so'rang.", ru: 'Цена — в третьем вопросе, здесь спросите о текущем деле.' },
  siz: { uz: "Bo'lakni odamga savol qilib yozing: «…siz» bilan.", ru: 'Напишите фрагмент как вопрос человеку: на «вы».' },
  sotish: { uz: "Bu sotish gapiga o'xshaydi — odamdan so'rang.", ru: 'Похоже на продающую фразу — спросите человека.' },
  kelajak: { uz: "Hozirgi ishni so'rang — bo'lmagan ishni emas.", ru: 'Спрашивайте о том, что есть сейчас, а не о том, чего нет.' },
  narx: { uz: 'Narxni yozing — 4-darsdagi taxminingiz.', ru: 'Напишите цену — ваше предположение с 4-го урока.' },
  tel: { uz: 'Yozuvga telefon va akkaunt nomi yozilmaydi.', ru: 'В запись не пишут телефон и имя аккаунта.' },
  telSavol: { uz: 'Savolga telefon va akkaunt nomi yozilmaydi.', ru: 'В вопрос не пишут телефон и имя аккаунта.' },
  gapBosh: { uz: 'Sherigingiz nima dedi — shuni yozing.', ru: 'Что сказал партнёр — это и запишите.' },
  raqam: { uz: 'Bu telefon raqamimi yoki narxmi? Telefon yozilmaydi.', ru: 'Это номер телефона или цена? Телефон не записывают.' },
  belgi: { uz: "Belgini tanlang: ha, qimmat, yo'q yoki javob yo'q.", ru: 'Выберите отметку: да, дорого, нет или нет ответа.' },
  hozirBosh: { uz: 'Hozir nima qilishini qisqa yozing.', ru: 'Коротко напишите, что он делает сейчас.' },
  xulosa: { uz: "Bu xulosaga o'xshaydi — gapini so'zma-so'z yozing.", ru: 'Похоже на вывод — запишите его слова дословно.' },
  haQimmat: { uz: "Gapida «qimmat» bor — belgini qayta qarang.", ru: 'В его словах есть «дорого» — проверьте отметку.' }
};
const YUMSHOQ_YORLIQ = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — нажмите «Сохранить» ещё раз.' };

// ===== SCREEN 6 — SUHBAT SAVOLLARINGIZ (QMustaqil; 3 qism ketma-ket, bittadan katta karta — E 53; yozadi pm-m11d6-suhbat.skript) =====
const S6_QISM = [
  { id: 'kim', h: { uz: "Kim to'laydi", ru: 'Кто платит' } },
  { id: 'hozir', h: { uz: 'Hozirgi ish', ru: 'Текущее дело' } },
  { id: 'narx', h: { uz: 'Narx', ru: 'Цена' } }
];
const S6_YORDAM = [
  { uz: "Mentor misolida: tashkilotchi · «o'yinni qanday yig'asiz» · «Doimiy o'yin» · 30 kun · 15 000 so'm. Bo'lakni odamga savol qilib yozing; narx faqat uchinchi savolda.", ru: 'В примере Ментора: организатор · «как вы собираете игру» · «Постоянная игра» · 30 дней · 15 000 сумов. Пишите фрагмент как вопрос человеку; цена — только в третьем вопросе.' },
  { uz: "Savolni ✎ bilan o'zingizga moslasangiz ham, u odamdan so'rasin — olishga undamasin. 4-darsda narx yozmagan bo'lsangiz, bugungi taxminingizni yozing — u ham taxmin.", ru: 'Даже если вы измените вопрос через ✎, пусть он спрашивает человека, а не подталкивает купить. Если на 4-м уроке цену не записали, напишите сегодняшнее предположение — это тоже предположение.' }
];
const q1Yasa = (hozir) => tr({ uz: `Hozir ${hozir} va bunga qancha vaqt ketadi?`, ru: `Сейчас ${hozir} — и сколько времени на это уходит?` });
const q3Yasa = (nima, davr, narx) => {
  const n = sonFmt(narxSonT(narx) || narx);
  return davr
    ? tr({ uz: `"${nima}" ${davr} kunga ${n} so'm bo'lsa — olarmidingiz? Nega?`, ru: `«${nima}» за ${n} сумов на ${davr} дн. — взяли бы? Почему?` })
    : tr({ uz: `"${nima}" ${n} so'm bo'lsa — olarmidingiz? Nega?`, ru: `«${nima}» за ${n} сумов — взяли бы? Почему?` });
};
const s6Savollar = (d) => [
  d.ozgar && d.ozgar[0] ? d.ozgar[0] : q1Yasa(String(d.hozir || '').trim()),
  d.ozgar && d.ozgar[1] ? d.ozgar[1] : tr(MENTOR_SKRIPT[1]),
  d.ozgar && d.ozgar[2] ? d.ozgar[2] : q3Yasa(String(d.nima || '').trim(), String(d.davr || '').trim(), d.narx),
  d.ozgar && d.ozgar[3] ? d.ozgar[3] : tr(MENTOR_SKRIPT[3])
];
const Kirit = ({ n, value, onChange, ph, max, err, halqa, kichik, iRef, son, aria, en }) => (
  <span className={cxx('mt-inp-w', kichik && 'kichik')} style={en ? { width: en } : undefined}>
    {n && <i className="mt-inp-n">{n}</i>}
    <input ref={iRef} className={cxx('mt-inp', n && 'raqamli', err && 'err', halqa && 'mt-halqa-i')} value={value} maxLength={max} placeholder={ph} aria-label={aria || ph} inputMode={son ? 'numeric' : undefined}
      onChange={(e) => onChange(son ? e.target.value.replace(/[^\d\s]/g, '') : e.target.value)} />
  </span>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [narx] = useState(narxOl);
  const [kimlar] = useState(intervyuKimlar);
  const [d0] = useState(() => {
    const m = lsO(MODEL_KEY) || {};
    const s = storedAnswer || {};
    const kim = String(m.kim || '').trim().slice(0, 30), nima = String(m.nima || '').trim();
    const skript = suhbatOl().skript;
    const toliq = skriptToliq(skript);
    const saqlandi = Array.isArray(s.saqlandi) ? s.saqlandi : toliq ? ['kim', 'hozir', 'narx'] : [];
    const d = s.d || { kim, hozir: '', nima: nima.length <= 40 ? nima : '', narx: narx ? String(narx.narx) : '', davr: narx && narx.davrKun ? String(narx.davrKun) : '', ozgar: toliq && !s.d ? skript : [null, null, null, null] };
    return { d, saqlandi, oldin: { kim: !!kim, nima: !!(nima && nima.length <= 40), narx: !!narx } };
  });
  const [d, setD] = useState(d0.d);
  const [saqlandi, setSaqlandi] = useState(d0.saqlandi);
  const [tahrir, setTahrir] = useState(null); // 'kim' | 0–3 (savol ✎)
  const [tahrirMatn, setTahrirMatn] = useState('');
  const [xato, setXato] = useState(null); // { k, yumshoq, maydon }
  const [yordam, setYordam] = useState(false);
  const [yangi, setYangi] = useYangi(1300);
  const [ulandi, setUlandi] = useYangi(1500);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null), telNRef = useRef(null), uyaRef = useRef({}), ishRef = useRef(null), uchNav = useRef(null);
  const [ulash, setUlash] = useState(null);
  const toliq = saqlandi.length >= 3;
  const tugadi = useTugadi(toliq, 1500, d0.saqlandi.length >= 3);
  const yakuniy = toliq && tahrir === null && tugadi;
  // Uchish nishoni — yangi chizilgan varaqdan olinadi (karta yopilgach qatorlar siljiydi)
  useLayoutEffect(() => {
    const u = uchNav.current; if (!u) return;
    uchNav.current = null;
    uch(u.k, uyaRef.current[u.maqsad], u.qiy);
    if (u.t) uch(u.t, uyaRef.current.q2, u.n, 200);
  });
  // Telefondagi narx qatori → varaqdagi 3-savol: bog'lovchi chiziq (SABOQ 35; tor ekranda CSS yashiradi)
  useLayoutEffect(() => {
    const box = ishRef.current, a = telNRef.current, b = uyaRef.current.q2;
    if (!ulandi || !box || !a || !b) { if (ulash) setUlash(null); return; }
    const o = box.getBoundingClientRect(), ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const yangiU = { x1: Math.round(ra.right - o.left), y1: Math.round(ra.top + ra.height / 2 - o.top), x2: Math.round(rb.left - o.left), y2: Math.round(rb.top + rb.height / 2 - o.top), w: Math.round(o.width), h: Math.round(o.height) };
    if (!ulash || Object.keys(yangiU).some(k => yangiU[k] !== ulash[k])) setUlash(yangiU);
  });
  const joriy = tahrir !== null ? tahrir : S6_QISM.find(q => !saqlandi.includes(q.id))?.id || null;
  const qismI = S6_QISM.findIndex(q => q.id === joriy);
  const savollar = s6Savollar(d);
  const set = (k, v) => { setD(x => ({ ...x, [k]: v })); if (xato && xato.maydon === k) setXato(null); };
  const yozJavob = (nd, ns) => {
    const t = ns.length >= 3;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'Suhbat savollari', d: nd, saqlandi: ns, solved: t, correct: t, picked: true });
  };
  const tekshir = (maydonlar) => {
    for (const [m, v] of maydonlar) {
      const x = s6Tekshir(m, v);
      if (!x) continue;
      if (x.yumshoq && xato && xato.yumshoq && xato.k === x.k && xato.maydon === m) continue;
      setXato({ ...x, maydon: m }); return false;
    }
    return true;
  };
  const saqla = () => {
    if (joriy === null) return;
    let nd = d;
    if (typeof joriy === 'number') {
      if (!tekshir([[joriy === 0 ? 'hozir' : 'savol', tahrirMatn]])) return;
      const oz = [...(d.ozgar || [null, null, null, null])]; oz[joriy] = String(tahrirMatn).trim(); nd = { ...d, ozgar: oz };
    } else if (joriy === 'kim') { if (!tekshir([['kim', d.kim]])) return; }
    else if (joriy === 'hozir') { if (!tekshir([['hozir', d.hozir]])) return; nd = { ...d, ozgar: [null, ...(d.ozgar || []).slice(1)] }; }
    else if (!tekshir([['nima', d.nima], ['narx', d.narx]])) return;
    else { const oz = [...(d.ozgar || [null, null, null, null])]; oz[2] = null; nd = { ...d, ozgar: oz }; }
    setXato(null); setYordam(false);
    const maqsad = typeof joriy === 'number' ? 'q' + joriy : joriy === 'kim' ? 'kim' : joriy === 'hozir' ? 'q0' : 'q2';
    const qiy = joriy === 'kim' ? d.kim : joriy === 'hozir' ? d.hozir : joriy === 'narx' ? sonFmt(narxSonT(d.narx)) + ' ' + tr({ uz: "so'm", ru: 'сум' }) : '✎';
    const qutiR = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { getBoundingClientRect: () => r }; };
    uchNav.current = { maqsad, qiy: String(qiy).slice(0, 34), k: qutiR(kartaRef.current), t: joriy === 'narx' && narx ? qutiR(telNRef.current) : null, n: sonFmt(narxSonT(d.narx)) };
    if (joriy === 'narx' && narx) setUlandi(1);
    setYangi(maqsad);
    const ns = typeof joriy === 'number' || saqlandi.includes(joriy) ? saqlandi : [...saqlandi, joriy];
    setD(nd); setSaqlandi(ns); setTahrir(null);
    yozJavob(nd, ns);
    if (ns.length >= 3) {
      suhbatYoz({ skript: s6Savollar(nd) });
      if (!(storedAnswer && storedAnswer.solved) && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const ochTahrir = (k) => { setTahrir(k); setXato(null); if (typeof k === 'number') setTahrirMatn(savollar[k]); };
  const xErr = (m) => !!(xato && xato.maydon === m);
  const xatoEl = xato && <>{<QXato>{tr(TX[xato.k])}</QXato>}{xato.yumshoq && <p className="mt-kulrang">{tr(YUMSHOQ_YORLIQ)}</p>}</>;
  // Joriy qism — bitta katta karta (E 53)
  const kartaIchi = joriy === 'kim' ? (
    <>
      <Kirit n="1" value={d.kim} onChange={(v) => set('kim', v)} max={30} err={xErr('kim')} halqa={!String(d.kim).trim()} ph={tr({ uz: "Mahsulotingizda kim to'laydi? Rolini yozing", ru: 'Кто платит в вашем продукте? Напишите роль' })} />
      {d0.oldin.kim && <span className="mt-teg">{tr({ uz: '2-darsdagi tanlovingiz', ru: 'Ваш выбор на 2-м уроке' })}</span>}
    </>
  ) : joriy === 'hozir' ? (
    <>
      <p className="mt-qolip"><i className="mt-qn">1</i><span>{tr({ uz: 'Hozir', ru: 'Сейчас' })}</span>
        <Kirit value={d.hozir} onChange={(v) => set('hozir', v)} max={50} err={xErr('hozir')} halqa={!String(d.hozir).trim()} ph={tr({ uz: "masalan: o'yinni qanday yig'asiz", ru: 'например: как вы собираете игру' })} />
        <span>{tr({ uz: 'va bunga qancha vaqt ketadi?', ru: '— и сколько времени на это уходит?' })}</span></p>
    </>
  ) : joriy === 'narx' ? (
    <>
      <p className="mt-qolip"><i className="mt-qn">3</i><span>"</span>
        <Kirit value={d.nima} onChange={(v) => set('nima', v)} max={40} err={xErr('nima')} halqa={!String(d.nima).trim()} ph={tr({ uz: "Qulaylik nomi — masalan: Doimiy o'yin", ru: 'Название удобства — например: Постоянная игра' })} />
        <span>"</span>
        <Kirit kichik en={74} son value={d.davr} onChange={(v) => set('davr', v)} max={3} ph={tr({ uz: 'kun', ru: 'дн.' })} aria={tr({ uz: 'Davr, kun — ixtiyoriy', ru: 'Срок, дней — необязательно' })} />
        <span>{tr({ uz: 'kunga', ru: 'дн. за' })}</span>
        <Kirit kichik en={164} son value={d.narx} onChange={(v) => set('narx', v)} max={9} err={xErr('narx')} halqa={!narxSonT(d.narx)} ph={tr({ uz: "Narx, so'm — taxmin", ru: 'Цена, сум — предположение' })} />
        <span>{tr({ uz: "so'm bo'lsa — olarmidingiz? Nega?", ru: 'сумов — взяли бы? Почему?' })}</span></p>
      <div className="mt-teglar">
        {narx && narx.ekran && String(narx.ekran.sarlavha || '').trim() && <span className="mt-kulrang">{tr({ uz: '4-darsdagi ekraningiz:', ru: 'Ваш экран с 4-го урока:' })} «{String(narx.ekran.sarlavha).trim()}»</span>}
        {d0.oldin.narx && <span className="mt-teg">{tr({ uz: '4-darsdagi narxingiz · taxmin', ru: 'Ваша цена с 4-го урока · предположение' })}</span>}
      </div>
    </>
  ) : typeof joriy === 'number' ? (
    <textarea className={cxx('mt-inp', 'mt-ta', xato && 'err')} value={tahrirMatn} maxLength={160} rows={3} aria-label={tr({ uz: 'Savol matni', ru: 'Текст вопроса' })} onChange={(e) => { setTahrirMatn(e.target.value); setXato(null); }} />
  ) : null;
  const kartaPast = joriy === 'kim' ? (kimlar.length > 0 && <p className="mt-kulrang">{tr({ uz: '11-Modulda intervyu berganlar:', ru: 'Давали интервью в 11-м модуле:' })} {kimlar.map(k => `«${k}»`).join(' · ')}</p>)
    : joriy === 'hozir' ? <p className="mt-ozgarmas"><i className="mt-qn">2</i><span>{tr(MENTOR_SKRIPT[1])}</span><em>{tr({ uz: "o'zgarmaydi", ru: 'не меняется' })}</em></p>
    : joriy === 'narx' ? <p className="mt-ozgarmas"><i className="mt-qn">4</i><span>{tr(MENTOR_SKRIPT[3])}</span><em>{tr(SHART4)}</em></p>
    : null;
  const sarlavhaK = typeof joriy === 'number' ? `${joriy + 1} · ${tr({ uz: 'savol', ru: 'вопрос' })}` : joriy && `${qismI + 1} / 3 · ${tr(S6_QISM[qismI].h)}`;
  const karta = joriy !== null && (
    <div ref={kartaRef} key={String(joriy)} className={cxx('mt-karta', xato && !xato.yumshoq && 'err')}>
      <span className="q-yorliq">{sarlavhaK}</span>
      {kartaIchi}
      {xatoEl}
      {yordam && <div className="mt-yordam fade-step">{S6_YORDAM.map((y, i) => <p key={i}>{tr(y)}</p>)}</div>}
      <div className="mt-karta-past">
        {kartaPast}
        <div className="mt-karta-tug">
          <QTugma className="mt-halqa" onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
          <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
        </div>
      </div>
    </div>
  );
  const bo = (s, ph) => (String(s || '').trim() ? <b className="mt-toldi">{String(s).trim()}</b> : <span className="mt-bosh">{ph}</span>);
  const qSaq = (id) => saqlandi.includes(id) && !(tahrir === id);
  const mening = (
    <Varaq className={cxx('mt-mening', toliq && tahrir === null ? 'toliq' : 'zich')} sarlavha={tr({ uz: 'Suhbat savollarim', ru: 'Мои вопросы разговора' })}>
      <div className="mt-uyalar">
        {(toliq && tahrir === null || joriy === 'kim' || saqlandi.includes('kim')) && <Uya n={!toliq && qSaq('kim') ? '✓' : '·'} uRef={(el) => { uyaRef.current.kim = el; }} yangi={yangi === 'kim'} ixcham
          matn={<>{tr({ uz: "Kim to'laydi", ru: 'Кто платит' })}: {qSaq('kim') ? bo(d.kim, '…') : <span className="mt-bosh">…</span>}</>}
          onTahrir={toliq && tahrir === null ? () => ochTahrir('kim') : undefined} />}
        {[0, 1, 2, 3].map(n => {
          const qism = n === 0 ? 'hozir' : n === 2 ? 'narx' : null;
          const tayyor = qism ? qSaq(qism) : true;
          const matn = toliq || (tayyor && qism) ? savollar[n]
            : n === 0 ? <>{tr({ uz: 'Hozir', ru: 'Сейчас' })} <span className="mt-bosh">…</span> {tr({ uz: 'va bunga qancha vaqt ketadi?', ru: '— и сколько времени на это уходит?' })}</>
            : n === 2 ? <>"<span className="mt-bosh">…</span>" <span className="mt-bosh">…</span> {tr({ uz: "so'm bo'lsa — olarmidingiz? Nega?", ru: 'сумов — взяли бы? Почему?' })}</>
            : savollar[n];
          return <Uya key={n} n={n + 1} uRef={(el) => { uyaRef.current['q' + n] = el; }} yangi={yangi === 'q' + n || (n === 2 && ulandi)} ixcham={!toliq} matn={matn}
            yorliq={n === 3 ? tr(SHART4) : n === 1 && !toliq ? tr({ uz: "o'zgarmaydi", ru: 'не меняется' }) : null}
            onTahrir={toliq && tahrir === null ? () => ochTahrir(n) : undefined} />;
        })}
      </div>
    </Varaq>
  );
  const qismlar = !toliq && (
    <div className="mt-qismlar">{S6_QISM.map((q, i) => <span key={q.id} className={cxx('mt-qism', saqlandi.includes(q.id) && 'ok', joriy === q.id && 'cur')}><i>{saqlandi.includes(q.id) ? '✓' : i + 1}</i>{tr(q.h)}</span>)}</div>
  );
  const n = saqlandi.length;
  const tel = narx && <TelefonEkran narx={narx} nRef={telNRef} ulandi={!!ulandi} />;
  const forma = isMentor
    ? <div className="mt-fokus"><Varaq sarlavha={tr({ uz: 'Mentorning suhbat savollari', ru: 'Вопросы разговора Ментора' })}><div className="mt-uyalar">{MENTOR_SKRIPT.map((q, u) => <Uya key={u} n={u + 1} matn={tr(q)} yorliq={u === 3 ? tr(SHART4) : null} />)}</div></Varaq></div>
    : yakuniy
      ? <div className="mt-fokus">{mening}<span className="mt-strip">{tr({ uz: 'Suhbat savollarim', ru: 'Мои вопросы разговора' })} · 4 {tr({ uz: 'ta', ru: 'шт.' })}</span><QXulosa>{tr({ uz: "Suhbat savollaringiz tayyor: avval hozirgi ish so'raladi, narx — uchinchi savolda.", ru: 'Ваши вопросы разговора готовы: сначала спрашивают о текущем деле, цена — в третьем вопросе.' })}</QXulosa></div>
      : <div ref={ishRef} className={cxx('mt-ish', !tel && 'yakka')}>{tel}<div className="mt-o">{karta}{mening}</div>
        {ulash && <svg className="mt-ulash" width={ulash.w} height={ulash.h} aria-hidden="true"><line x1={ulash.x1} y1={ulash.y1} x2={ulash.x2} y2={ulash.y2} stroke={T.accent} strokeWidth="2" strokeDasharray="5 4" /><circle cx={ulash.x1} cy={ulash.y1} r="3.5" fill={T.accent} /><circle cx={ulash.x2} cy={ulash.y2} r="3.5" fill={T.accent} /></svg>}
      </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · suhbat savollari', ru: 'Самостоятельная работа · вопросы разговора' })} screen={screen} scrollSignal={n * 10 + (tahrir === null ? 0 : 1)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!toliq && !isMentor} label={toliq || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Savollarni to'ldiring (${n}/3)`, ru: `Заполните вопросы (${n}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Narxingiz uchun <A>suhbat savollarini yozing.</A></>, ru: <>Напишите <A>вопросы разговора</A> для своей цены.</> })}
        mentor={<Mentor>{tr({ uz: "Mentorning savollarini o'z mahsulotingizga moslang — bo'sh joylarni to'ldiring.", ru: 'Подстройте вопросы Ментора под свой продукт — заполните пустые места.' })}</Mentor>}
        qadamlar={!isMentor && qismlar}
        forma={forma}
      >
        <MentorPracticeStats live={live} screen={screen} yorliq={{ uz: 'Savollarni yozdi', ru: 'Написали вопросы' }} />
        <Ustoz satrlar={USTOZ.s6} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 7 — ROL O'YINI (QMustaqil; juftlik + yakka rejim; 3 qism ketma-ket: Kim · Savollar · Yozuv; yozadi pm-m11d6-suhbat.suhbatlar) =====
// Real suhbat — faqat sherikning o'z «Roziman» tugmasi bilan (06-FILTR 4). Mentor ekraniga gap, belgi, narx, tur uzatilmaydi — faqat saqlash signali (TAQIQLAR 3).
const S7_QISM = [{ uz: 'Kim', ru: 'Кто' }, { uz: 'Savollar', ru: 'Вопросы' }, { uz: 'Yozuv', ru: 'Запись' }];
const S7_YORDAM = [
  { uz: "Javobni yaxshilamang va qisqartirmang — odam qanday aytgan bo'lsa, shunday yozing. Mentor misolida: «15 000 qimmat. 10 000 bo'lsa olardim.» — belgi «qimmat», narx 10 000.", ru: 'Не улучшайте и не сокращайте ответ — пишите так, как сказал человек. В примере Ментора: «15 000 — дорого. За 10 000 взял бы.» — отметка «дорого», цена 10 000.' },
  { uz: "«Ha» desa ham pul so'ramang; «yo'q» desa — ko'ndirmang, yozib qo'ying. Uyda mahalla guruhi orqali yozsangiz — 12-Moduldagi olti bandli ro'yxat kuchda.", ru: 'Даже если скажет «да» — денег не просите; скажет «нет» — не уговаривайте, запишите. Если пишете дома через группу махалли — действует список из шести пунктов 12-го модуля.' },
  { uz: "Ism, telefon yoki akkaunt nomini aytsa — [ism], [telefon] bilan almashtiring, qolganini o'zgartirmang.", ru: 'Если назовёт имя, телефон или аккаунт — замените на [имя], [телефон], остальное не меняйте.' },
  { uz: "Savolni tushunmasa — boshqa so'z bilan bir marta aniqlashtiring, narxni o'zgartirmang. «Yo'q» sababi narx bo'lmasa, to'rtinchi savolni bermang — ko'ndirishga o'xshab qoladi.", ru: 'Если не понял вопрос — один раз уточните другими словами, цену не меняйте. Если причина «нет» не в цене, четвёртый вопрос не задавайте — это похоже на уговоры.' }
];
const yangiYozuv = () => ({ id: null, tur: null, bosqich: 'kim', hozir: '', gap: '', gap4: '', narx4: '', javob: null });
const bosqichQism = (b) => (b === 'kim' || b === 'sherik' ? 0 : b === 'yozuv' ? 2 : 1);
const Screen7 = ({ screen, storedAnswer, answers, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const juft = isStudent;
  const [skript] = useState(() => suhbatOl().skript);
  const skriptBor = skriptToliq(skript);
  const s6 = (answers && answers[6]) || {};
  const kim = String((s6.d && s6.d.kim) || (lsO(MODEL_KEY) || {}).kim || '').trim() || tr({ uz: "to'laydigan odam", ru: 'тот, кто платит' });
  const skriptNarx = narxSonT(s6.d && s6.d.narx) || (narxOl() || {}).narx || null;
  const [yozuvlar, setYozuvlar] = useState(() => suhbatOl().suhbatlar);
  const [karta, setKarta] = useState(() => (storedAnswer && storedAnswer.karta) || (suhbatOl().suhbatlar.length ? null : yangiYozuv()));
  const [oqildi, setOqildi] = useState(!!(storedAnswer && storedAnswer.oqildi));
  const [xato, setXato] = useState(null);
  const [izohTur, setIzohTur] = useState(null);
  const [almash, setAlmash] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [yangiId, setYangiId] = useYangi(1400);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null), chiziqRef = useRef(null);
  const realN = yozuvlar.filter(y => y.tur === 'real').length;
  const mashqN = yozuvlar.filter(y => y.tur === 'mashq').length;
  const realBor = realN > 0, mashqBor = mashqN > 0;
  const yangiMumkin = !realBor || !mashqBor;
  const done = yozuvlar.length > 0 || oqildi || !skriptBor;
  const setK = (patch) => { const n = { ...karta, ...patch }; setKarta(n); setXato(null); onAnswer(screen, { ...(storedAnswer || {}), stage: 'practice', screenIdx: screen, practice: "Rol o'yini", karta: n, correct: yozuvlar.length > 0, solved: yozuvlar.length > 0 || oqildi, picked: true }); };
  const turTanla = (tur) => { setK({ tur, bosqich: 'q1' }); setIzohTur(tur); };
  const kimYoz = (y) => (y.tur === 'real' ? `${kim} (${tr({ uz: 'sinfdosh', ru: 'одноклассник' })})` : kim);
  const gapYig = (k) => (k.javob === 'javobsiz' ? '' : [String(k.gap || '').trim(), String(k.gap4 || '').trim()].filter(Boolean).join(' '));
  const narxiOl = (k) => (k.javob === 'ha' ? skriptNarx : k.javob === 'qimmat' || k.javob === 'yoq' ? narxSonT(k.narx4) : null);
  const hozirKeyingi = () => {
    const x = s7Hozir(karta.hozir);
    if (x && !(x.yumshoq && xato && xato.k === x.k)) { setXato(x); return; }
    setK({ bosqich: 'q3' });
  };
  const belgiBos = (b) => {
    const x = s7Tekshir(karta.gap, b);
    if (x && !x.yumshoq) { setXato(x); return; }
    setK({ javob: b, bosqich: b === 'yoq' || b === 'qimmat' ? 'q4' : 'yozuv', ...(b === 'javobsiz' ? { gap: '', gap4: '', narx4: '' } : {}) });
  };
  const q4Keyingi = (otkaz) => {
    if (otkaz) { setK({ gap4: '', narx4: '', bosqich: 'yozuv' }); return; }
    if (telBormi(normS(karta.gap4))) { setXato({ k: 'tel' }); return; }
    setK({ bosqich: 'yozuv' });
  };
  const saqla = () => {
    const gap = gapYig(karta);
    const x = s7Tekshir(gap, karta.javob) || (karta.hozir ? (s7Hozir(karta.hozir) || {}).k === 'tel' ? { k: 'tel' } : null : null);
    if (x && !(x.yumshoq && xato && xato.k === x.k)) { setXato(x); return; }
    const maxN = yozuvlar.reduce((m, y) => Math.max(m, Number(String(y.id || '').slice(1)) || 0), 0);
    const yoz = { id: karta.id || 's' + (maxN + 1), tur: karta.tur, kim: kimYoz(karta), hozir: String(karta.hozir || '').trim() || null, gap, javob: karta.javob, narxi: narxiOl(karta), qachon: karta.qachon || bugun() };
    const ro = karta.id ? yozuvlar.map(y => (y.id === karta.id ? yoz : y)) : [...yozuvlar, yoz];
    uch(kartaRef.current, chiziqRef.current, `${yoz.kim} · ${tr(BELGI[yoz.javob].t)}`);
    suhbatYoz({ suhbatlar: ro });
    setYozuvlar(ro); setYangiId(yoz.id); setKarta(null); setXato(null); setYordam(false); setIzohTur(null); setAlmash(!karta.id);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: "Rol o'yini", karta: null, oqildi, yozuvN: ro.length, correct: true, solved: true, picked: true });
    if (!karta.id && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const tahrirla = (y) => { setKarta({ id: y.id, tur: y.tur, bosqich: 'q3', hozir: y.hozir || '', gap: y.gap || '', gap4: '', narx4: y.narxi && y.javob !== 'ha' ? String(y.narxi) : '', javob: y.javob, qachon: y.qachon }); setAlmash(false); setXato(null); };
  const oqidim = () => { setOqildi(true); onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: "Rol o'yini", oqildi: true, karta: null, correct: false, solved: true, picked: true }); };
  const xatoEl = xato && <>{<QXato>{tr(TX[xato.k])}</QXato>}{xato.yumshoq && <p className="mt-kulrang">{tr(xato.k === 'hozirBosh' ? { uz: "Shunday qoldirsangiz — yana «Keyingi savol»ni bosing.", ru: 'Если оставите так — нажмите «Следующий вопрос» ещё раз.' } : YUMSHOQ_YORLIQ)}</p>}</>;
  const turYorliq = karta && karta.tur && <span className={cxx('mt-tur', karta.tur)}>{karta.tur === 'real' ? tr({ uz: 'real suhbat', ru: 'реальный разговор' }) : tr({ uz: 'mashq', ru: 'тренировка' })}</span>;
  const kulrangRozi = <p className="mt-kulrang">{tr({ uz: 'Real suhbat ixtiyoriy. Sherigingiz ismini hech qayerga yozmang.', ru: 'Реальный разговор — по желанию. Имя партнёра нигде не пишите.' })}</p>;
  const b = karta ? karta.bosqich : null;
  const savolN = b === 'q1' ? 0 : b === 'q2' || b === 'hozir' ? 1 : b === 'q3' ? 2 : b === 'q4' ? 3 : -1;
  const yordamBtn = <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>;
  let ichi = null;
  if (karta && b === 'kim') ichi = (
    <>
      <p className="mt-katta">{tr({ uz: 'Sherigingiz qanday javob beradi?', ru: 'Как ответит ваш партнёр?' })}</p>
      <p className="mt-kulrang">{tr({ uz: `Haqiqatan «${kim}» bo'lsa va o'zi xohlasa — o'zi uchun javob beradi; bo'lmasa — rol o'ynaydi.`, ru: `Если он действительно «${kim}» и сам хочет — отвечает за себя; если нет — играет роль.` })}</p>
      <div className="mt-tugmalar mt-chorla">
        {!mashqBor && <QChip className="mt-javob" onClick={() => turTanla('mashq')}>{tr({ uz: "Rol o'ynab javob beradi", ru: 'Ответит, играя роль' })}</QChip>}
        {!realBor && <QChip className="mt-javob" onClick={() => setK({ bosqich: 'sherik' })}>{tr({ uz: "O'zi javob beradi", ru: 'Ответит за себя' })}</QChip>}
      </div>
      {kulrangRozi}
      <div className="mt-karta-tug">{yordamBtn}</div>
    </>
  );
  else if (karta && b === 'sherik') ichi = (
    <>
      <p className="mt-katta">{tr({ uz: "Sherigingiz o'zi bossin", ru: 'Пусть партнёр нажмёт сам' })}</p>
      {kulrangRozi}
      <div className="mt-karta-tug">
        <QTugma className="mt-halqa" onClick={() => turTanla('real')}>{tr({ uz: "Roziman — o'zim uchun javob beraman", ru: 'Согласен — отвечаю за себя' })}</QTugma>
        {!mashqBor && <QTugma ikkinchi onClick={() => turTanla('mashq')}>{tr({ uz: "Rol o'ynayman", ru: 'Сыграю роль' })}</QTugma>}
        {yordamBtn}
      </div>
    </>
  );
  else if (karta && (b === 'q1' || b === 'q2')) ichi = (
    <>
      {izohTur && <QIzoh>{izohTur === 'real' ? tr({ uz: "Sherigingiz o'zi uchun javob beradi — bu real suhbat.", ru: 'Партнёр отвечает за себя — это реальный разговор.' }) : tr({ uz: "Rol o'yini — mashq: bu yozuv uchta real suhbatga kirmaydi.", ru: 'Ролевая игра — тренировка: эта запись не входит в три реальных разговора.' })}</QIzoh>}
      <p className="mt-katta"><i className="mt-qn">{savolN + 1}</i>{skript[savolN]}</p>
      <div className="mt-karta-tug"><QTugma className="mt-halqa" onClick={() => { setIzohTur(null); setK({ bosqich: b === 'q1' ? 'q2' : 'hozir' }); }}>{tr({ uz: 'Keyingi savol', ru: 'Следующий вопрос' })}</QTugma>{yordamBtn}</div>
    </>
  );
  else if (karta && b === 'hozir') ichi = (
    <>
      <p className="mt-katta">{tr({ uz: 'Hozir nima qiladi?', ru: 'Что он делает сейчас?' })}</p>
      <Kirit value={karta.hozir} onChange={(v) => setK({ hozir: v })} max={80} err={!!xato && !xato.yumshoq} halqa={!String(karta.hozir).trim()} ph={tr({ uz: "masalan: Har hafta guruhga o'zim yozaman, pul sarflamayman", ru: 'например: Каждую неделю пишу в группу сам, денег не трачу' })} aria={tr({ uz: 'Hozir nima qiladi?', ru: 'Что он делает сейчас?' })} />
      {xatoEl}
      <div className="mt-karta-tug"><QTugma className="mt-halqa" onClick={hozirKeyingi}>{tr({ uz: 'Keyingi savol', ru: 'Следующий вопрос' })}</QTugma>{yordamBtn}</div>
    </>
  );
  else if (karta && b === 'q3') ichi = (
    <>
      <p className="mt-katta"><i className="mt-qn">3</i>{skript[2]}</p>
      <textarea className={cxx('mt-inp', 'mt-ta', xato && !xato.yumshoq && 'err', !String(karta.gap).trim() && 'mt-halqa-i')} value={karta.gap} maxLength={160} rows={2} placeholder={tr({ uz: 'U nima dedi?', ru: 'Что он сказал?' })} aria-label={tr({ uz: 'U nima dedi?', ru: 'Что он сказал?' })} onChange={(e) => setK({ gap: e.target.value })} />
      <div className={cxx('mt-tugmalar', 'mt-belgilar', String(karta.gap).trim() && 'mt-chorla')}>
        {BELGILAR.map(x => <QChip key={x.k} className={cxx('mt-belgi', x.rang)} holat={karta.javob === x.k ? 'on' : undefined} onClick={() => belgiBos(x.k)}>{tr(x.t)}</QChip>)}
      </div>
      <p className="mt-kulrang">{tr(JAVOBSIZ_QATOR)}</p>
      {xatoEl}
      <div className="mt-karta-tug">{yordamBtn}</div>
    </>
  );
  else if (karta && b === 'q4') ichi = (
    <>
      <p className="mt-katta"><i className="mt-qn">4</i>{skript[3]}</p>
      <p className="mt-kulrang">{tr({ uz: 'belgi', ru: 'отметка' })}: <Belgi k={karta.javob} /></p>
      <textarea className={cxx('mt-inp', 'mt-ta', xato && 'err')} value={karta.gap4} maxLength={160} rows={2} placeholder={tr({ uz: 'U nima dedi?', ru: 'Что он сказал?' })} aria-label={tr({ uz: 'U nima dedi?', ru: 'Что он сказал?' })} onChange={(e) => setK({ gap4: e.target.value })} />
      <Kirit son value={karta.narx4} onChange={(v) => setK({ narx4: v })} max={9} ph={tr({ uz: "Narx, so'm — aytgan bo'lsa", ru: 'Цена, сум — если назвал' })} />
      {karta.javob === 'yoq' && <p className="mt-kulrang">{tr({ uz: "Sababi narx bo'lmasa (masalan, «kerak emas») — bu savolni bermang.", ru: 'Если причина не в цене (например, «не нужно») — этот вопрос не задавайте.' })}</p>}
      {xatoEl}
      <div className="mt-karta-tug">
        {karta.javob === 'yoq' && <QTugma ikkinchi onClick={() => q4Keyingi(true)}>{tr({ uz: "O'tkazish", ru: 'Пропустить' })}</QTugma>}
        <QTugma className="mt-halqa" onClick={() => q4Keyingi(false)}>{tr({ uz: '3 · Yozuv', ru: '3 · Запись' })}</QTugma>
        {yordamBtn}
      </div>
    </>
  );
  else if (karta && b === 'yozuv') {
    const gap = gapYig(karta); const nx = narxiOl(karta);
    ichi = (
      <>
        <div className="mt-yq">
          <span className="mt-kim">{kimYoz(karta)}</span>
          <span className="mt-gap">{gap ? `«${gap}»` : '—'}</span>
          <Belgi k={karta.javob} />
          <span className="mt-nk">{narxKatak(nx)}</span>
        </div>
        {String(karta.hozir || '').trim() && <p className="mt-kulrang">{tr({ uz: 'Hozir', ru: 'Сейчас' })}: {String(karta.hozir).trim()}</p>}
        {xatoEl}
        <div className="mt-karta-tug">
          <QChip className="mt-tahrir keng" onClick={() => setK({ bosqich: 'q3' })}>✎ {tr({ uz: '2 · Savollar', ru: '2 · Вопросы' })}</QChip>
          <QTugma className="mt-halqa" onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
          {yordamBtn}
        </div>
      </>
    );
  }
  const qismN = karta ? bosqichQism(b) : 3;
  const kartaEl = karta && (
    <div ref={kartaRef} key={(karta.id || 'y') + b} className={cxx('mt-karta', xato && !xato.yumshoq && 'err')}>
      <div className="mt-karta-bosh">
        <span className="q-yorliq">{S7_QISM.map((q, i) => <span key={i} className={cxx('mt-qy', i === qismN && 'cur', i < qismN && 'ok')}>{i + 1} {tr(q)}</span>)}</span>
        {turYorliq}
      </div>
      {ichi}
      {yordam && <div className="mt-yordam fade-step">{S7_YORDAM.map((y, i) => <p key={i}>{tr(y)}</p>)}</div>}
    </div>
  );
  const chiziq = <p ref={chiziqRef} key={yozuvlar.length} className={cxx('mt-chiziq', yozuvlar.length > 0 && 'bor')}>{tr({ uz: 'Yozuvlarim', ru: 'Мои записи' })} · {tr({ uz: 'real', ru: 'реальных' })} <b>{realN} / 3</b> · {tr({ uz: 'mashq', ru: 'тренировка' })} <b>{mashqN}</b></p>;
  const strip = <span className="mt-strip">{tr({ uz: 'Suhbat savollarim', ru: 'Мои вопросы разговора' })} · 4 {tr({ uz: 'ta', ru: 'шт.' })}</span>;
  const stripChiziq = <div className="mt-strip-q">{strip}{chiziq}</div>;
  const sherikYorliq = karta && karta.tur ? (karta.tur === 'mashq' ? tr({ uz: `«${kim}» rolida`, ru: `в роли «${kim}»` }) : kim) : null;
  const sahnaGap = karta && savolN >= 0 && skript[savolN];
  const sherikGap = karta && (b === 'yozuv' || b === 'q4') && String(karta.gap || '').trim() ? `«${String(karta.gap).trim()}»` : karta && savolN >= 0 ? '…' : null;
  const sahna = <Sahna ixcham chap={tr({ uz: 'Siz', ru: 'Вы' })} ong={tr({ uz: 'Sherigingiz', ru: 'Партнёр' })} ongYorliq={sherikYorliq} chapGap={sahnaGap} chapKey={b} ongGap={sherikGap} ongKey={b + (karta && karta.javob)} />;
  const varaqToliq = (
    <Varaq sarlavha={tr({ uz: 'Yozuvlarim', ru: 'Мои записи' })}>
      <Jadval qatorlar={yozuvlar.map(y => ({ k: y.id, kim: y.kim, gap: y.gap ? `«${y.gap}»` : '—', javob: y.javob, narx: narxKatak(y.narxi), hozir: y.hozir, yangi: yangiId === y.id, onTahrir: () => tahrirla(y) }))} />
      {stripChiziq}
    </Varaq>
  );
  const xulosaM = realBor ? { uz: "Birinchi real suhbat yozildi: gap so'zma-so'z, belgisi bilan.", ru: 'Первый реальный разговор записан: слова дословно, с отметкой.' }
    : mashqBor ? { uz: "Mashq yozuvi tayyor — real suhbatlar uyda, tanish odamlar bilan.", ru: 'Тренировочная запись готова — реальные разговоры дома, со знакомыми.' }
    : { uz: "Savollaringiz o'qildi — rol o'yini va suhbatlar uyda.", ru: 'Ваши вопросы прочитаны — ролевая игра и разговоры дома.' };
  let forma;
  if (isMentor) forma = <div className="mt-fokus"><Varaq sarlavha={tr({ uz: 'Mentorning suhbat savollari', ru: 'Вопросы разговора Ментора' })}><div className="mt-uyalar">{MENTOR_SKRIPT.map((q, u) => <Uya key={u} n={u + 1} matn={tr(q)} yorliq={u === 3 ? tr(SHART4) : null} />)}</div></Varaq></div>;
  else if (!skriptBor) forma = (
    <div className="mt-fokus">
      <p className="mt-kulrang katta">{tr({ uz: 'Avval suhbat savollaringizni yozing', ru: 'Сначала напишите свои вопросы разговора' })}</p>
      <div className="mt-karta-tug chap"><QTugma ikkinchi onClick={onPrev}>← {tr({ uz: 'Suhbat savollari', ru: 'Вопросы разговора' })}</QTugma></div>
    </div>
  );
  else if (!juft && yozuvlar.length === 0) forma = (
    <div className="mt-fokus">
      {strip}
      <Varaq sarlavha={tr({ uz: 'Suhbat savollarim', ru: 'Мои вопросы разговора' })}><div className="mt-uyalar">{skript.map((q, u) => <Uya key={u} n={u + 1} matn={q} yorliq={u === 3 ? tr(SHART4) : null} />)}</div></Varaq>
      {!oqildi ? <div className="mt-karta-tug chap"><QTugma className="mt-halqa" onClick={oqidim}>{tr({ uz: "Ovoz chiqarib o'qidim", ru: 'Прочитал вслух' })}</QTugma></div>
        : <QXulosa>{tr(xulosaM)}</QXulosa>}
    </div>
  );
  else if (!karta) forma = (
    <div className="mt-fokus">
      {varaqToliq}
      {almash && <QIzoh>{tr({ uz: "Endi almashing: sherigingiz o'z ekranida so'raydi, siz javob berasiz.", ru: 'Теперь поменяйтесь: партнёр спрашивает на своём экране, вы отвечаете.' })}</QIzoh>}
      {juft && yangiMumkin && <div className="mt-karta-tug chap"><QTugma ikkinchi onClick={() => { setKarta(yangiYozuv()); setAlmash(false); }}>+ {tr({ uz: 'Yana bitta suhbat', ru: 'Ещё один разговор' })}</QTugma></div>}
      <QXulosa>{tr(xulosaM)}</QXulosa>
    </div>
  );
  else forma = <div className="mt-ish">{sahna}<div className="mt-o">{kartaEl}{stripChiziq}</div></div>;
  const navN = karta ? bosqichQism(b) : done ? 3 : 0;
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish', ru: 'Работа в паре' }) : tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={(karta ? bosqichQism(b) * 10 + savolN : 50) + yozuvlar.length * 100} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Uch qismni bajaring (${navN}/3)`, ru: `Выполните три части (${navN}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Sherigingiz bilan <A>rol o'yinini o'tkazing.</A></>, ru: <>Проведите <A>ролевую игру</A> с партнёром.</> })}
        mentor={<Mentor>{juft || isMentor
          ? tr({ uz: "Siz so'raysiz, sherigingiz javob beradi: gapini so'zma-so'z yozing, keyin almashasiz.", ru: 'Вы спрашиваете, партнёр отвечает: запишите его слова дословно, потом поменяйтесь.' })
          : tr({ uz: "Sherik bo'lmasa, savollaringizni ovoz chiqarib o'qing — mashqni uyda qilasiz.", ru: 'Если партнёра нет, прочитайте свои вопросы вслух — тренировку сделаете дома.' })}</Mentor>}
        forma={forma}
      >
        <MentorPracticeStats live={live} screen={screen} yorliq={{ uz: 'Yozuv saqladi', ru: 'Сохранили запись' }} />
        <Ustoz satrlar={USTOZ.s7} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen → QTest; ✔ D, INLINE_KEYS.s8 = 3; scope final) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Auditoriyangizdagi uch tanish narxingizni eshitib «olaman» dedi. Bu nimani ko'rsatadi?"
    question={tr({ uz: <h2 className="title h-ask">Auditoriyangizdagi uch tanish narxingizni eshitib «olaman» dedi. <A>Bu nimani ko'rsatadi?</A></h2>, ru: <h2 className="title h-ask">Трое знакомых из вашей аудитории услышали цену и сказали «возьму». <A>Что это показывает?</A></h2> })}
    options={[
      { uz: "Narx to'g'ri ekanining aniq isbotini", ru: 'Точное доказательство, что цена верна' },
      { uz: 'Narx oshsa ham olishlari aniqligini', ru: 'Что они точно возьмут и при росте цены' },
      { uz: "Ulardan pulni hozir olsa bo'lishini", ru: 'Что деньги можно взять у них сейчас' },
      { uz: "Ularning so'zini, hali to'lovni emas", ru: 'Их слова, а ещё не оплату' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "«Olaman» — so'z: odam hali to'lamagan.", ru: '«Возьму» — это слова: человек ещё не заплатил.' }}
    explainWrong={{
      0: { uz: "Uch kishi — kichik son: bu isbot bo'ladimi?", ru: 'Три человека — малое число: разве это доказательство?' },
      1: { uz: "Ular boshqa narxni eshitmagan — buni bilmaysiz.", ru: 'Другую цену они не слышали — этого вы не знаете.' },
      2: { uz: "Suhbatda pul olinmaydi — odam «ha» desa ham.", ru: 'В разговоре денег не берут — даже если человек сказал «да».' },
      default: { uz: 'Mentor uch suhbatdan keyin qanday xulosa qildi?', ru: 'Какой вывод сделал Ментор после трёх разговоров?' }
    }}
    vizual={<MiniVaraq><Jadval qatorlar={[0, 1, 2].map(i => ({ k: 'h' + i, kim: tr({ uz: 'tanish', ru: 'знакомый' }), gap: '', javob: 'ha', narx: '' }))} /><p className="mt-kulrang">{tr({ uz: "so'z — hali to'lov emas", ru: 'слова — ещё не оплата' })}</p></MiniVaraq>} />
);

// ===== NISHONLAR (4) — faqat qilingan ish uchun; Recorded! — tekin bonus, ish qilingan ekranda (P-048) =====
const ACHIEVEMENTS = {
  justAsk: { icon: '🗣️', name: 'Just Ask!', desc: { uz: 'Savol va sotish gapini ajratdingiz', ru: 'Вы отличили вопрос от продающей фразы' } },
  askFirst: { icon: '🎯', name: 'Ask First!', desc: { uz: 'Suhbat nimadan boshlanishini topdingiz', ru: 'Вы нашли, с чего начинается разговор' } },
  wordForWord: { icon: '📝', name: 'Word for Word!', desc: { uz: "Uch javobga mos belgi qo'ydingiz", ru: 'Вы поставили верные отметки трём ответам' } },
  recorded: { icon: '🎙️', name: 'Recorded!', desc: { uz: "Rol o'yini yoki suhbat yozuvini saqladingiz", ru: 'Вы сохранили запись ролевой игры или разговора' } }
};
// Ekran id → nishon: s2, s4 — olti gap / uch yozuv birinchi urinishda (xato bo'lsa — miss); s3 — test; s7 — birinchi «Saqlash»
const ACH_TRIGGERS = { s2: 'justAsk', s3: 'askFirst', s4: 'wordForWord', s7: 'recorded' };

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


// Podium savol yorliqlari (kalit = ballik ekran indekslari: 3, 5, 8 — q22)
const Q_LABELS = {
  3: { uz: '1 — Suhbat nimadan boshlanadi', ru: '1 — С чего начинается разговор' },
  5: { uz: '2 — "Yo\'q" qanday yoziladi', ru: '2 — Как записать «нет»' },
  8: { uz: 'Yakuniy — "Olaman" nimani ko\'rsatadi', ru: 'Итог — что показывает «возьму»' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi so'zlar — darsning o'z atamalari (MD «Fon so'zlari», R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'suhbat', ru: 'разговор' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'savol', ru: 'вопрос' }, l: 84, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'narx', ru: 'цена' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'suhbat savollari', ru: 'вопросы разговора' }, l: 70, t: 70, s: 20, d: 21, dl: 2.2 },
  { ch: { uz: 'belgi', ru: 'отметка' }, l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'ha', ru: 'да' }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'qimmat', ru: 'дорого' }, l: 26, t: 36, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: "yo'q", ru: 'нет' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'yozuv', ru: 'запись' }, l: 88, t: 46, s: 22, d: 24, dl: 0.6 },
  { ch: { uz: 'tanish', ru: 'знакомый' }, l: 4, t: 46, s: 20, d: 22, dl: 1.3 },
  { ch: { uz: 'Maydon Jamoa', ru: 'Maydon Jamoa' }, l: 40, t: 4, s: 20, d: 26, dl: 2.5 }
];
// ⚡ Jonli viktorina — 12 savol (MD jadvali aynan; ✔ o'rni: A 1·5·9 · B 3·6·10 · C 2·7·11 · D 4·8·12 — 3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'Bu darsda suhbat nima?', ru: 'Что такое разговор на этом уроке?' }, opts: [{ uz: 'Narx haqida real odamga savol berish', ru: 'Вопрос реальному человеку о цене' }, { uz: 'Mahsulotni tanishlarga sotish usuli', ru: 'Способ продать продукт знакомым' }, { uz: "Ilovani do'stlarga ko'rsatib chiqish", ru: 'Показать приложение друзьям' }, { uz: 'Narxni Mentor bilan kelishib olish', ru: 'Договориться о цене с Ментором' }], correct: 0 },
  { q: { uz: 'Mentor misolida narx qaysi savolda aytiladi?', ru: 'В каком вопросе в примере Ментора называют цену?' }, opts: [{ uz: 'Birinchi savolda, hammasidan oldin', ru: 'В первом, раньше всего' }, { uz: "Ikkinchi savolda, pul haqida so'rab", ru: 'Во втором, спросив о деньгах' }, { uz: "Uchinchi savolda, ishni so'ragach", ru: 'В третьем, после вопроса о деле' }, { uz: "To'rtinchi savolda, eng oxirida", ru: 'В четвёртом, в самом конце' }], correct: 2 },
  { q: { uz: "Mentor to'rtinchi savolni qachon beradi?", ru: 'Когда Ментор задаёт четвёртый вопрос?' }, opts: [{ uz: 'Suhbat boshida, birinchi bo\'lib', ru: 'В начале разговора, первым' }, { uz: "Javob «yo'q» yoki «qimmat» bo'lsa", ru: 'Если ответ «нет» или «дорого»' }, { uz: "Tashkilotchi «ha» deb javob bersa", ru: 'Если организатор ответил «да»' }, { uz: 'Tashkilotchi umuman javob bermasa', ru: 'Если организатор совсем не ответил' }], correct: 1 },
  { q: { uz: 'Qaysi gap sotish gapi?', ru: 'Какая фраза — продающая?' }, opts: [{ uz: 'Hozir buni qanday qilyapsiz?', ru: 'Как вы сейчас это делаете?' }, { uz: 'Bunga hozir pul sarflaysizmi?', ru: 'Тратите ли на это деньги сейчас?' }, { uz: 'Vaqt ajratganingiz uchun rahmat!', ru: 'Спасибо, что уделили время!' }, { uz: 'Hamma oldi, siz ham olasizmi?', ru: 'Все взяли, и вы возьмёте?' }], correct: 3 },
  { q: { uz: 'Odam: «Qimmat, yarim narxda olardim». Yozuvingizda nima turadi?', ru: 'Человек: «Дорого, за полцены взял бы». Что будет в записи?' }, opts: [{ uz: '«Qimmat» belgisi va uning narxi', ru: 'Отметка «дорого» и его цена' }, { uz: '«Ha» belgisi va savoldagi narx', ru: 'Отметка «да» и цена из вопроса' }, { uz: "«Yo'q» belgisi, narx yozilmaydi", ru: 'Отметка «нет», цена не пишется' }, { uz: "«Javob yo'q» belgisi, gap yo'q", ru: 'Отметка «нет ответа», слов нет' }], correct: 0 },
  { q: { uz: 'Mentor misolida uch tashkilotchidan nechtasi «ha» dedi?', ru: 'Сколько из трёх организаторов в примере Ментора сказали «да»?' }, opts: [{ uz: 'Uchalasi — hammasi «ha» dedi', ru: 'Все трое — все сказали «да»' }, { uz: 'Bittasi — faqat 1-tashkilotchi', ru: 'Один — только организатор 1' }, { uz: 'Ikkitasi — 1 va 3-tashkilotchi', ru: 'Двое — организаторы 1 и 3' }, { uz: 'Hech biri — hammasi rad etdi', ru: 'Ни один — все отказались' }], correct: 1 },
  { q: { uz: 'Odam xabaringizga javob bermadi. Qaysi belgi qo\'yiladi?', ru: 'Человек не ответил на сообщение. Какую отметку ставят?' }, opts: [{ uz: "«Yo'q» — demak, u olmaydi ekan", ru: '«Нет» — значит, не возьмёт' }, { uz: '«Qimmat» — narx unga yoqmadi', ru: '«Дорого» — цена не понравилась' }, { uz: "«Javob yo'q» — gapi yozilmagan", ru: '«Нет ответа» — слов не записано' }, { uz: 'Hech narsa — yozuv qilinmaydi', ru: 'Ничего — запись не делают' }], correct: 2 },
  { q: { uz: 'Tanishingiz «ha, olaman» dedi. Endi nima qilasiz?', ru: 'Знакомый сказал «да, возьму». Что теперь сделаете?' }, opts: [{ uz: 'Pulni hozir naqd olib qo\'yaman', ru: 'Сразу возьму деньги наличными' }, { uz: 'Narxni ikki baravar oshiraman', ru: 'Повышу цену вдвое' }, { uz: 'Do\'stlarini ham olishga undayman', ru: 'Подтолкну купить и его друзей' }, { uz: 'Gapini yozaman, pul olmayman', ru: 'Запишу слова, денег не возьму' }], correct: 3 },
  { q: { uz: 'Narx haqidagi suhbat uchun kimni tanlaysiz?', ru: 'Кого выберете для разговора о цене?' }, opts: [{ uz: 'Auditoriyamdagi tanish odamni', ru: 'Знакомого из своей аудитории' }, { uz: 'Internetdagi notanish odamni', ru: 'Незнакомца из интернета' }, { uz: "Mahsulot kerak bo'lmagan odamni", ru: 'Того, кому продукт не нужен' }, { uz: "O'zimni — javobni o'zim yozaman", ru: 'Себя — ответ напишу сам' }], correct: 0 },
  { q: { uz: 'Mahalla guruhidagi tanishga yozishdan oldin nima qilasiz?', ru: 'Что сделаете, прежде чем написать знакомому из группы махалли?' }, opts: [{ uz: "Ko'p guruhga xabar tashlayman", ru: 'Разошлю сообщение во много групп' }, { uz: "Guruh egasidan ruxsat so'rayman", ru: 'Спрошу разрешения у владельца группы' }, { uz: 'Uning telefon raqamini topaman', ru: 'Найду его номер телефона' }, { uz: 'Hech narsa qilmayman — u tanish', ru: 'Ничего — он же знакомый' }], correct: 1 },
  { q: { uz: 'Suhbat yozuvida odam qanday ataladi?', ru: 'Как называют человека в записи разговора?' }, opts: [{ uz: 'Ismi va familiyasi bilan', ru: 'По имени и фамилии' }, { uz: "Telegram'dagi nomi bilan", ru: 'По имени в Telegram' }, { uz: 'Roli bilan: «tashkilotchi»', ru: 'По роли: «организатор»' }, { uz: 'Kim ekani umuman yozilmaydi', ru: 'Кто он — не пишут вовсе' }], correct: 2 },
  { q: { uz: "Rol o'yinidagi yozuv nega real suhbatga kirmaydi?", ru: 'Почему запись ролевой игры не считается реальным разговором?' }, opts: [{ uz: 'Unda narx umuman aytilmagan edi', ru: 'В ней цену вообще не называли' }, { uz: 'Uni Mentor o\'zi tekshirmagan edi', ru: 'Её не проверил сам Ментор' }, { uz: "Sherik «yo'q» deb javob bergan", ru: 'Партнёр ответил «нет»' }, { uz: "Sherik rolni o'ynab javob bergan", ru: 'Партнёр отвечал, играя роль' }], correct: 3 }
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
const MentorPracticeStats = ({ live, screen, yorliq }) => {
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
      <div className="card-lbl" style={{ color: T.accent }}>{tr(yorliq || { uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
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

// ===== 🃏 KARTOCHKALAR (12) — alohida ekran, Mentorsiz (SABOQ 12, 16); qolip QKartochka =====
const KARTOCHKALAR = [
  { front: { uz: 'Bu darsda suhbat nima?', ru: 'Что такое разговор на этом уроке?' }, back: { uz: "Sotish emas, savol: avval odamning hozirgi ishi so'raladi, keyin narx", ru: 'Не продажа, а вопрос: сначала о текущем деле человека, потом цена' }, note: { uz: 'Narx haqida real odam bilan; 11-Moduldagi intervyu kabi', ru: 'О цене с реальным человеком; как интервью в 11-м модуле' } },
  { front: { uz: 'Suhbatda narx qachon aytiladi?', ru: 'Когда в разговоре называют цену?' }, back: { uz: "Odamning hozirgi ishi so'ralgandan keyin", ru: 'После вопроса о текущем деле человека' }, note: { uz: 'Mentor misolida — uchinchi savolda', ru: 'В примере Ментора — в третьем вопросе' } },
  { front: { uz: 'Suhbat savollari qanday beriladi?', ru: 'Как задают вопросы разговора?' }, back: { uz: 'Har odamga bir xil tartibda', ru: 'Каждому в одном порядке' }, note: { uz: "Tushunmasa — bir marta aniqlashtiriladi; narx o'zgarmaydi", ru: 'Если не понял — уточняют один раз; цена не меняется' } },
  { front: { uz: "Mentor to'rtinchi savolni qachon beradi?", ru: 'Когда Ментор задаёт четвёртый вопрос?' }, back: { uz: "Javob «yo'q» yoki «qimmat» bo'lsa", ru: 'Если ответ «нет» или «дорого»' }, note: { uz: "Savol: «Qancha bo'lsa olardingiz?»", ru: 'Вопрос: «За сколько бы взяли?»' } },
  { front: { uz: '«Hozir olmasangiz, keyin qimmatlashadi» — bu savolmi?', ru: '«Не возьмёте сейчас — потом подорожает» — это вопрос?' }, back: { uz: "Yo'q, bu sotish gapi", ru: 'Нет, это продающая фраза' }, note: { uz: 'Mentor bunday demaydi', ru: 'Ментор так не говорит' } },
  { front: { uz: 'Javob qanday yoziladi?', ru: 'Как записывают ответ?' }, back: { uz: "So'zma-so'z — odam qanday aytgan bo'lsa, shunday", ru: 'Дословно — так, как сказал человек' }, note: { uz: "9 va 11-Moduldagi intervyudagidek: u aytganidek, o'sha zahoti", ru: 'Как на интервью в 9-м и 11-м модулях: как сказал, сразу же' } },
  { front: { uz: 'Javobga qanday belgilar qo\'yiladi?', ru: 'Какие отметки ставят ответу?' }, back: { uz: "Ha, qimmat, yo'q yoki javob yo'q", ru: 'Да, дорого, нет или нет ответа' }, note: { uz: "Belgi odamning o'z gapidan", ru: 'Отметка — из собственных слов человека' } },
  { front: { uz: '«Qimmat» belgisi qachon qo\'yiladi?', ru: 'Когда ставят отметку «дорого»?' }, back: { uz: 'Odam narxni qimmat desa', ru: 'Если человек назвал цену дорогой' }, note: { uz: "Boshqa narx aytsa — narx katagiga; aytmasa — bo'sh", ru: 'Назвал другую цену — в графу цены; не назвал — пусто' } },
  { front: { uz: "«Yo'q» javobi ham yozib qo'yiladimi?", ru: 'Ответ «нет» тоже записывают?' }, back: { uz: "Ha — «yo'q» ham natija", ru: 'Да — «нет» тоже результат' }, note: { uz: "Mentor misolida 2-tashkilotchi: «pul to'lamayman»", ru: 'В примере Ментора организатор 2: «платить не буду»' } },
  { front: { uz: 'Uch suhbat narx haqida nima beradi?', ru: 'Что дают три разговора о цене?' }, back: { uz: "Dalil — lekin narx to'g'ri ekanining isboti emas", ru: 'Довод — но не доказательство, что цена верна' }, note: { uz: 'Uch — kichik son', ru: 'Три — малое число' } },
  { front: { uz: "Rol o'yinidagi yozuv real suhbatmi?", ru: 'Запись ролевой игры — реальный разговор?' }, back: { uz: "Yo'q — bu mashq", ru: 'Нет — это тренировка' }, note: { uz: "Real suhbat — odam o'zi uchun javob bersa", ru: 'Реальный разговор — если человек отвечает за себя' } },
  { front: { uz: 'Narx haqida kim bilan gaplashasiz?', ru: 'С кем вы говорите о цене?' }, back: { uz: 'Tanish odam bilan — ota-onangizga aytib', ru: 'Со знакомым — предупредив родителей' }, note: { uz: "Notanishga yozilmaydi; yozuvda ism yo'q", ru: 'Незнакомым не пишут; в записи нет имени' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('mt-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: tr(c.note) }))} />
          {!bosildi && <p className="mt-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + ①②③④; ④ holatdan; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'auditoriyangizdagi tanish odamlar', ru: 'знакомые из вашей аудитории' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: 'uchtagacha real suhbat — darsdagi real suhbat ham kiradi', ru: 'до трёх реальных разговоров — разговор на уроке тоже входит' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_BANDLAR = [
  { uz: "Tanish odamni tanlang: 11-Modulda intervyu bergan odam, sinfdosh, ota-ona yoki mahalla guruhidagi tanish — guruh egasining ruxsati bilan. U mahsulotingizda to'laydigan rolda bo'lsin; bunday tanish bo'lmasa — 0 ham halol natija. Ota-onangizga ayting.", ru: 'Выберите знакомого: того, кто давал интервью в 11-м модуле, одноклассника, родителя или знакомого из группы махалли — с разрешения владельца группы. Пусть он будет в роли того, кто платит в вашем продукте; если такого знакомого нет — 0 тоже честный результат. Скажите родителям.' },
  { uz: "Suhbat savollarini tartib bilan bering: narx — uchinchi savolda; «yo'q» desa, ko'ndirmang.", ru: 'Задавайте вопросы разговора по порядку: цена — в третьем вопросе; скажет «нет» — не уговаривайте.' },
  { uz: "Javobni o'sha zahoti qog'ozga yozing, ismsiz: rol · hozir nima qiladi (qisqa) · narx haqidagi gapi (so'zma-so'z) · belgi · aytgan narxi.", ru: 'Сразу запишите ответ на бумаге, без имени: роль · что делает сейчас (коротко) · его слова о цене (дословно) · отметка · названная цена.' }
];
const HW_RAQAM = ['①', '②', '③', '④'];
// F-1007-475: erta tugatgan o'quvchi yo'li — AI tashkilotchi rolida, o'quvchi o'z suhbat savollarini beradi (sinfda gemini.google.com)
const AI_SOROV = { uz: "Sen «Maydon Jamoa»ga o'xshash ilovada har hafta o'yin tashkil qiladigan tashkilotchisan: o'yinchilarni qo'lda yig'asan, bunga vaqt ketadi. Men senga narx haqida 4 ta savol beraman. Har biriga qisqa, hayotiy javob ber; narx aytilganda avval ikkilan, keyin o'z fikringni ayt. O'zing savol berma, sotishga undama. Birinchi savolim: ",
  ru: 'Ты организатор еженедельных игр в приложении вроде «Maydon Jamoa»: собираешь игроков вручную, на это уходит время. Я задам тебе 4 вопроса о цене. Отвечай коротко и жизненно; когда назову цену, сначала засомневайся, потом скажи своё мнение. Сам вопросы не задавай, покупать не уговаривай. Мой первый вопрос: ' };
const AiDavomCard = () => {
  const [nusxa, setNusxa] = useState(false);
  const kochir = () => { try { navigator.clipboard.writeText(tr(AI_SOROV)); setNusxa(true); setTimeout(() => setNusxa(false), 1800); } catch { /* qo'lda belgilab oladi */ } };
  return (
    <div className="card mt-ai fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Erta tugatdingizmi? AI bilan davom eting', ru: 'Закончили раньше? Продолжите с AI' })}</div>
      <p className="mt-ai-m">{tr({ uz: "gemini.google.com'ni oching, pastdagi so'rovni yuboring va suhbat savollaringizni bittadan bering — AI tashkilotchi bo'lib javob beradi. Javoblarini «Orqaga» bilan qaytib, rol o'yini yozuviga kiriting.", ru: 'Откройте gemini.google.com, отправьте запрос ниже и задавайте свои вопросы разговора по одному — AI ответит как организатор. Ответы впишите в запись ролевой игры, вернувшись через «Orqaga».' })}</p>
      <pre className="mt-ai-sorov">{tr(AI_SOROV)}</pre>
      <button type="button" className="q-chip mt-ai-btn" onClick={kochir}>{nusxa ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: "So'rovni nusxalash", ru: 'Скопировать запрос' })}</button>
    </div>
  );
};
const HwCard = ({ qolgan, keyingi }) => (
  <div className="card mt-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="mt-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="mt-hw-q"><span className="mt-hw-k">{tr(r.k)}</span><span className="mt-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="mt-hw-qadam">
      {HW_BANDLAR.map((b, i) => <li key={i}><i>{HW_RAQAM[i]}</i><span>{tr(b)}</span></li>)}
      {qolgan.length > 0 && <li><i>{HW_RAQAM[3]}</i><span>{tr({ uz: 'Darsda qolgan qismni tugating:', ru: 'Закончите то, что осталось с урока:' })} {qolgan.map(tr).join(' · ')}.</span></li>}
    </ol>
    <p className="mt-hw-ost">{tr({ uz: "Notanishga yozmang; uchrashuv taklifi kelsa — faqat kattalar bilan. «Ha» desa ham, pul olmang.", ru: 'Не пишите незнакомым; если предложат встретиться — только со взрослыми. Даже если скажут «да», денег не берите.' })}</p>
    {keyingi && <span className="mt-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (besh holat, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
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
  // «Endi siz bilasiz» — asosiy fikr so'zma-so'z takrorlanmaydi (T-048)
  const RECAP = [
    { uz: "Bu darsda suhbat — sotish emas, savol: avval odamning hozirgi ishi so'raladi, keyin narx.", ru: 'На этом уроке разговор — не продажа, а вопрос: сначала о текущем деле человека, потом цена.' },
    { uz: 'Suhbat savollari — har odamga bir xil tartibda beriladigan asosiy savollar.', ru: 'Вопросы разговора — основные вопросы, которые задают каждому в одном порядке.' },
    { uz: "Javob so'zma-so'z yoziladi va belgi oladi; «yo'q» ham natija.", ru: 'Ответ записывают дословно и ставят отметку; «нет» — тоже результат.' },
    { uz: "Uch suhbat — kichik son: narx haqida dalil, lekin narx to'g'ri ekanining isboti emas.", ru: 'Три разговора — малое число: довод о цене, но не доказательство, что цена верна.' },
    { uz: "Suhbat faqat tanish odam bilan; «ha» desa ham pul olinmaydi.", ru: 'Разговор — только со знакомым; даже если скажет «да», денег не берут.' }
  ];
  const k = suhbatOl();
  const s6 = answers[6] || {};
  const toliq = skriptToliq(k.skript);
  const qisman = !toliq && Array.isArray(s6.saqlandi) && s6.saqlandi.length > 0;
  const realBor = k.suhbatlar.some(y => y.tur === 'real');
  const mashqBor = k.suhbatlar.some(y => y.tur === 'mashq');
  // Sarlavha holatga qarab va rost (E 54) — MD dagi besh holat; ✓ faqat birinchi ikkitasida
  const holat = isMentorL ? 'mentor' : toliq ? (realBor ? 'real' : mashqBor ? 'mashq' : 'yozuvsiz') : qisman ? 'qisman' : 'yoq';
  const SARLAVHA = {
    real: { uz: <>Suhbat savollari tayyor, <A>birinchi real suhbat yozildi.</A></>, ru: <>Вопросы разговора готовы, <A>первый реальный разговор записан.</A></> },
    mashq: { uz: <>Suhbat savollari tayyor, <A>rol o'yini yozildi.</A></>, ru: <>Вопросы разговора готовы, <A>ролевая игра записана.</A></> },
    yozuvsiz: { uz: <>Suhbat savollari tayyor, <A>rol o'yini va suhbatlar qoldi.</A></>, ru: <>Вопросы разговора готовы, <A>остались ролевая игра и разговоры.</A></> },
    qisman: { uz: <>Suhbat savollari hali tugamagan — <A>uyda tugating.</A></>, ru: <>Вопросы разговора ещё не закончены — <A>закончите дома.</A></> },
    yoq: { uz: <>Suhbat savollari hali yozilmagan — <A>uyda yozing.</A></>, ru: <>Вопросы разговора ещё не написаны — <A>напишите дома.</A></> },
    mentor: { uz: <>Pul haqida <A>qanday gaplashasiz?</A></>, ru: <>Как говорить <A>о деньгах?</A></> }
  };
  const tolaHolat = holat === 'real' || holat === 'mashq';
  const qolgan = isMentorL ? [] : [
    !toliq && { uz: 'suhbat savollarini yozing', ru: 'напишите вопросы разговора' },
    !realBor && !mashqBor && { uz: "rol o'yinini oilangizdan biri bilan o'tkazing", ru: 'проведите ролевую игру с кем-то из семьи' }
  ].filter(Boolean);
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Foydalanuvchiga shartlarni qanday ochiq aytasiz?»</b></>, ru: <>Следующий урок — <b>«Как честно сказать пользователю об условиях?»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('mt-yakun', !tolaHolat && 'belgisiz')}>
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
          uyga={<HwCard qolgan={qolgan} keyingi={keyingi} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(t => ({ ...t, t: tr(t.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmMoneyTalkLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === NAMUNA (skelet) — darsning o'z vizuali: almashtiriladi. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        /* === 6-DARS «Suhbat varag'i» (.mt- prefiksi — global .mentor bilan to'qnashmaydi) === */
        .mt-mj { font-weight: 800; color: ${MAYDON_RANG}; letter-spacing: 0.01em; }
        p.mt-kulrang, span.mt-kulrang { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        p.mt-kulrang.katta { font-size: 15px; font-weight: 600; }
        p.mt-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .mt-uch { position: fixed; z-index: 1200; pointer-events: none; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 4px 10px; white-space: nowrap; max-width: 240px; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); animation: mt-uch .85s cubic-bezier(.4,0,.2,1) forwards; }
        .mt-tx { display: block; margin-bottom: 5px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .mt-tx b { color: ${T.ink}; } .mt-tx.ok, .mt-tx.ok b { color: ${T.ok}; } .mt-tx b.yoq { color: ${T.err}; }
        .q-xulosa .mt-x-m { display: block; }
        .q-xulosa .mt-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.2)}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .mt-bashq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 8px 14px; border-radius: 12px; background: ${T.accentSoft}; font-size: 13px; color: ${T.ink2}; }
        .mt-bashq-t b { color: ${T.accent}; }
        /* Odam */
        .mt-odam { display: block; width: 56px; height: 78px; flex: none; }
        .mt-odam.oyna { transform: scaleX(-1); }
        /* Telefon — 170x272 barqaror (SABOQ 22), ichida hech narsa kesilmaydi (E 41) */
        .mt-telj { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; flex: none; }
        .mt-tel-yorliq { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .mt-tel { width: 170px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 6px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 9px 10px 10px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .mt-tel-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; font-size: 12px; }
        .mt-tel-nuqta { display: block; width: 46px; height: 5px; border-radius: 999px; background: ${T.line}; }
        .mt-tel-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 6px; }
        .mt-tel-sar { font-size: 13.5px; font-weight: 800; line-height: 1.25; color: ${T.ink}; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .mt-tel-matn { font-size: 11px; line-height: 1.4; color: ${T.ink2}; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .mt-tel-narx { font-size: 12.5px; font-weight: 800; color: ${T.ink}; border-radius: 6px; padding: 2px 4px; margin: 0 -4px; }
        .mt-tel-narx.yon { animation: mt-yon 1.4s ease-out 2; }
        .mt-tel-narx.ulandi { background: ${T.accentSoft}; color: ${T.accent}; }
        .mt-tel-tax { margin-top: -4px; font-size: 10px; color: ${T.ink2}; }
        .mt-tel-btn { margin-top: auto; display: flex; align-items: center; justify-content: center; height: 27px; flex: none; border-radius: 8px; background: ${T.accent}; color: #fff; font-size: 11.5px; font-weight: 800; }
        .mt-tel-test { text-align: center; font-size: 9.5px; line-height: 1.3; color: ${T.ink2}; }
        /* Kirish maketi: telefon + odam (pufagi bilan) */
        .mt-hook { display: flex; flex-direction: column; align-items: stretch; gap: 10px; width: max-content; max-width: 100%; }
        .mt-hook-javob { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
        .mt-hook-javob .mt-pufak { min-width: 64px; }
        .mt-s0 { display: contents; }
        /* F-1007-473: maket ustuni o'z kengligida — variantlar uning yonida, orada bo'shliq yo'q */
        @media (min-width: 761px) { .mt-s0 .q-split { grid-template-columns: max-content minmax(0, 1fr); gap: 28px; } }
        .mt-s0.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: mt-chorla-v 1.8s ease-out .5s 2; }
        .mt-s0.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .mt-s0.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: mt-chorla 1.8s ease-out .5s 2; }
        .q-bashorat .q-chip:nth-child(2) { animation-delay: .75s; } .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        .mt-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .mt-ovoz-q { display: grid; grid-template-columns: minmax(0,1fr) 110px 26px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink}; }
        .mt-ovoz-q.men { font-weight: 800; color: ${T.accent}; }
        .mt-ovoz-y { height: 8px; border-radius: 999px; background: ${T.line}; overflow: hidden; }
        .mt-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width .6s ease; }
        /* Sahna — ikki odam yuzma-yuz, pufaklar tepada */
        .mt-sahna { display: flex; flex-direction: column; justify-content: flex-end; gap: 10px; min-width: 0; padding: 14px 14px 10px; border-radius: 16px; background: linear-gradient(180deg, ${T.paper} 0%, ${T.bg} 100%); border: 1px solid ${T.line}; min-height: 214px; }
        .mt-sahna.ixcham { min-height: 200px; }
        .mt-ai-m { margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .mt-ai-sorov { margin: 0 0 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; white-space: pre-wrap; }
        .mt-ai-btn { margin: 0; }
        .mt-sahna-k { display: flex; flex-direction: column; min-width: 0; }
        .mt-katak { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .mt-katak-y { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; margin-right: 4px; letter-spacing: .02em; }
        .mt-katak i { width: 22px; height: 22px; border-radius: 7px; border: 1.5px dashed ${fon(T.ink2, 0.45)}; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; color: ${T.ink2}; }
        .mt-katak i.oldi { border-style: solid; border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; }
        .mt-katak i.joriy { border-style: solid; border-color: ${T.accent}; color: ${T.accent}; }
        .mt-pufaklar { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; align-items: end; min-height: 84px; }
        .mt-pj { display: flex; min-width: 0; } .mt-pj.ong { justify-content: flex-end; }
        .mt-pufak { position: relative; display: inline-block; max-width: 100%; padding: 8px 11px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; font-size: 12.5px; line-height: 1.4; color: ${T.ink}; box-shadow: 0 6px 14px -10px rgba(${T.shadowBase},0.4); animation: mt-pufak .35s ease-out both; overflow-wrap: anywhere; }
        .mt-pufak.chap { border-bottom-left-radius: 4px; }
        .mt-pufak.ong { border-bottom-right-radius: 4px; border-color: ${fon(T.accent, 0.35)}; }
        .mt-pufak.yakka { min-width: 52px; text-align: center; font-weight: 700; }
        .mt-pufak.savol { font-size: 18px; color: ${T.accent}; border-color: ${T.accent}; }
        .mt-sq { display: grid; grid-template-columns: 88px minmax(0,1fr) 88px; gap: 8px; align-items: end; }
        .mt-shaxs { display: flex; flex-direction: column; align-items: center; gap: 3px; min-width: 0; }
        .mt-shaxs-n { font-size: 11.5px; font-weight: 800; color: ${T.ink}; text-align: center; white-space: nowrap; }
        .mt-rol { font-size: 10.5px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 6px; padding: 1px 6px; text-align: center; overflow-wrap: anywhere; animation: mt-pop .4s ease-out; }
        .mt-ortada { min-width: 0; display: flex; justify-content: center; align-self: center; }
        .mt-gk { width: 100%; display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; animation: mt-karta .35s ease-out both; }
        .mt-gk-n { font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${T.ink2}; }
        .mt-gk-t { font-size: 13px; line-height: 1.4; color: ${T.ink2}; transition: opacity .5s; }
        .mt-gk.chiz .mt-gk-t { text-decoration: line-through; text-decoration-color: ${T.ink2}; opacity: .45; }
        .mt-gk.err { animation: mt-err .6s ease-out; }
        /* Varaq */
        .mt-varaq { display: flex; flex-direction: column; gap: 10px; min-width: 0; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); }
        .mt-varaq-h { font-size: 13.5px; font-weight: 800; color: ${T.ink}; padding-bottom: 7px; border-bottom: 1px solid ${T.line}; animation: mt-harf .45s ease-out both; }
        .mt-bolim { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .mt-bolim-n { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .mt-uyalar { display: flex; flex-direction: column; gap: 5px; }
        .mt-uya { position: relative; display: grid; grid-template-columns: 22px minmax(0,1fr) auto; gap: 8px; align-items: start; padding: 7px 9px; border-radius: 9px; background: ${T.bg}; border: 1.5px solid transparent; font-size: 13px; line-height: 1.4; color: ${T.ink}; animation: mt-kir .35s ease-out both; }
        .mt-uya > i { width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.paper}; color: ${T.ink2}; border: 1px solid ${T.line}; }
        .mt-uya.bosh { background: transparent; border: 1.5px dashed ${T.line}; min-height: 28px; padding: 4px 8px; }
        .mt-uya.ixcham { padding: 5px 8px; font-size: 12.5px; }
        .mt-uya.faol { background: ${T.accentSoft}; color: ${T.accent}; font-weight: 700; }
        .mt-uya.faol > i { background: ${T.accent}; color: #fff; border-color: ${T.accent}; }
        .mt-uya.yangi { animation: mt-yashil 1.2s ease-out; }
        .mt-uya-m { min-width: 0; overflow-wrap: anywhere; }
        .mt-uya-m em { display: block; margin-top: 2px; font-style: normal; font-size: 11.5px; font-weight: 600; color: ${T.ink2}; }
        .mt-uyalar.ixcham .mt-uya-m { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mt-uyalar.ixcham .mt-uya.faol .mt-uya-m { white-space: normal; }
        .q-chip.mt-tahrir { padding: 2px 8px; font-size: 13px; line-height: 1.3; border-radius: 8px; }
        .q-chip.mt-tahrir.keng { padding: 8px 12px; font-size: 13.5px; }
        p.mt-demaydi { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        p.mt-demaydi b { color: ${T.ink}; display: inline-block; }
        p.mt-demaydi.bor b { animation: mt-pop .45s ease-out; }
        p.mt-mentor-yozuv { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        /* Jadval — ma'lumot ko'rinishi (E 45): to'q sarlavha, katak chiziqlari, soyasiz */
        .mt-jadval { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 10px; overflow: hidden; background: ${T.bg}; }
        .mt-jq { position: relative; display: grid; grid-template-columns: minmax(64px,0.9fr) minmax(0,2.2fr) 66px 56px; gap: 8px; align-items: center; padding: 7px 10px; font-size: 12.5px; line-height: 1.35; color: ${T.ink}; border-top: 1px solid ${T.line}; animation: mt-kir .35s ease-out both; animation-delay: calc(var(--i, 0) * 0.08s); }
        .mt-jq.sar { border-top: 0; background: ${T.ink}; color: ${T.paper}; font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; padding: 6px 10px; animation: none; }
        .mt-jq.uzuq { min-height: 34px; background: transparent; border-top: 1px dashed ${T.line}; }
        .mt-jq.joriy { background: ${T.accentSoft}; }
        .mt-jq.yangi { animation: mt-yashil 1.2s ease-out; }
        .mt-jq.err { animation: mt-err .6s ease-out; }
        .mt-jq:has(.mt-tahrir) { padding-right: 44px; }
        .mt-jq .mt-tahrir { position: absolute; right: 8px; top: 6px; }
        .mt-kim { font-weight: 700; overflow-wrap: break-word; }
        .mt-gap { min-width: 0; overflow-wrap: anywhere; }
        .mt-bk { display: flex; align-items: center; min-height: 20px; }
        .mt-nk { font-weight: 800; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
        .mt-hozir { grid-column: 1 / -1; font-size: 12px; color: ${T.ink2}; }
        .mt-bk-b { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 800; animation: mt-pop .4s ease-out; }
        .mt-bk-b.b-ok { background: ${T.okFon}; color: ${T.ok}; } .mt-bk-b.b-acc { background: ${T.accentSoft}; color: ${T.accent}; } .mt-bk-b.b-kul { background: ${T.line}; color: ${T.ink2}; }
        /* Joylashuv: chapda sahna yoki telefon, o'ngda varaq/karta (SABOQ 21) */
        .mt-ikki { display: grid; grid-template-columns: minmax(0,0.95fr) minmax(0,1.05fr); gap: clamp(12px,2vw,20px); align-items: start; }
        .mt-ish { display: grid; grid-template-columns: auto minmax(0,1fr); gap: clamp(12px,2vw,22px); align-items: start; }
        .mt-ish.yakka { grid-template-columns: minmax(0,1fr); }
        .mt-ish > .mt-sahna { width: clamp(260px, 30vw, 360px); }
        .q-mustaqil:has(.mt-ish), .q-mustaqil:has(.mt-fokus) { max-width: none; }
        .mt-o { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .mt-fokus { display: flex; flex-direction: column; gap: 12px; min-width: 0; animation: mt-kir .5s ease-out both; }
        .mt-tviz { margin-top: 4px; }
        .mt-mini { display: flex; flex-direction: column; gap: 6px; max-width: 560px; }
        .mt-mini .mt-uya:not(.faol) { color: ${T.ink2}; }
        .mt-harakat { display: flex; flex-direction: column; gap: 8px; }
        .mt-tugmalar { display: flex; flex-wrap: wrap; gap: 8px; }
        .mt-belgilar { gap: 6px; }
        .mt-tugmalar.silk { animation: mt-silk .4s ease-in-out; }
        .mt-tugmalar .q-chip { font-weight: 700; }
        .q-chip.mt-javob { padding: 10px 16px; }
        .q-chip.mt-belgi.b-ok { color: ${T.ok}; } .q-chip.mt-belgi.b-acc { color: ${T.accent}; } .q-chip.mt-belgi.b-kul { color: ${T.ink2}; }
        /* Keyingi bosiladigan joy (E 40): har variantning o'z yengil chegarasi, puls navbatma-navbat 2 marta, kattalashishsiz */
        .mt-chorla > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: mt-chorla 1.8s ease-out .4s 2; }
        .mt-chorla > :nth-child(2) { animation-delay: .65s; } .mt-chorla > :nth-child(3) { animation-delay: .9s; } .mt-chorla > :nth-child(4) { animation-delay: 1.15s; }
        /* Bitta navbatdagi tugma — halqa, puls 3 marta, scale yo'q (E 40) */
        .mt-halqa { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: mt-puls 2.2s ease-out .3s 3; }
        .mt-halqa-i { border-color: ${T.accent} !important; animation: mt-halqa-i 2.4s ease-in-out .4s 3; }
        /* Kiritish — yorliq input ichida (E 43) */
        .mt-inp-w { position: relative; display: flex; flex: none; min-width: 0; }
        p.mt-qolip .mt-inp-w:not(.kichik) { flex: 1 1 180px; }
        .mt-inp-w.kichik { flex: 0 0 auto; width: 92px; }
        .mt-inp-n { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); width: 21px; height: 21px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; pointer-events: none; }
        .mt-inp { width: 100%; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 500; color: ${T.ink}; padding: 9px 11px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; outline: none; }
        .mt-inp.raqamli { padding-left: 38px; }
        .mt-inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.15)}; }
        .mt-inp::placeholder { color: ${fon(T.ink, 0.42)}; }
        .mt-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        textarea.mt-ta { resize: vertical; min-height: 58px; line-height: 1.45; }
        .mt-teg { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 6px; padding: 2px 7px; }
        .mt-teglar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; }
        p.mt-qolip { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 14.5px; font-weight: 600; line-height: 1.5; color: ${T.ink}; }
        .mt-qn { width: 22px; height: 22px; flex: none; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11.5px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; margin-right: 6px; }
        p.mt-ozgarmas { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 13.5px; line-height: 1.45; color: ${T.ink2}; }
        p.mt-ozgarmas em { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 7px; }
        /* Karta — bosiladigan ko'rinish (oq, accent chegara, soya — E 45) */
        .mt-karta { display: flex; flex-direction: column; gap: 7px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.45)}; box-shadow: 0 12px 26px -16px rgba(${T.shadowBase},0.45); animation: mt-karta .4s ease-out both; }
        .mt-karta.err { border-color: ${T.err}; }
        .mt-karta-bosh { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
        .mt-qy { margin-right: 10px; } .mt-qy.cur { color: ${T.accent}; } .mt-qy.ok { color: ${T.ok}; }
        .mt-karta-tug { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
        .mt-karta-tug.chap { justify-content: flex-start; }
        .mt-yordam { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; }
        .mt-yordam p { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.mt-katta { margin: 0; display: flex; align-items: baseline; gap: 4px; font-size: 16px; font-weight: 700; line-height: 1.4; color: ${T.ink}; }
        .mt-tur { font-size: 11.5px; font-weight: 800; border-radius: 999px; padding: 3px 10px; animation: mt-pop .4s ease-out; }
        .mt-tur.mashq { background: ${T.line}; color: ${T.ink2}; } .mt-tur.real { background: ${T.okFon}; color: ${T.ok}; }
        .mt-yq { display: grid; grid-template-columns: auto minmax(0,1fr) auto auto; gap: 8px; align-items: center; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 13px; color: ${T.ink}; }
        .mt-toldi { font-weight: 700; color: ${T.ink}; background: ${T.okFon}; border-radius: 5px; padding: 0 4px; }
        .mt-bosh { display: inline-block; min-width: 38px; padding: 0 8px; border: 1.5px dashed ${T.line}; border-radius: 6px; color: ${T.ink2}; text-align: center; }
        .mt-mening .mt-uya-m { white-space: normal; }
        .mt-varaq.zich { padding: 8px 12px; gap: 6px; }
        .mt-varaq.zich .mt-varaq-h { font-size: 12.5px; padding-bottom: 4px; }
        .mt-varaq.zich .mt-uyalar { gap: 3px; }
        .mt-varaq.zich .mt-uya { padding: 3px 8px; font-size: 12px; }
        .mt-varaq.zich .mt-uya > i { width: 18px; height: 18px; font-size: 10.5px; }
        .mt-varaq.zich .mt-uya:not(.bosh) { padding-top: 2px; padding-bottom: 2px; }
        .mt-varaq.zich .mt-uya-m { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mt-varaq.zich .mt-uya-m em { display: none; }
        .mt-fokus .mt-uya { padding: 5px 9px; }
        .mt-mening.toliq .mt-uya { padding: 8px 10px; font-size: 13.5px; }
        .mt-qismlar { display: flex; flex-wrap: wrap; gap: 6px; }
        .mt-qism { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px 4px 5px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .mt-qism i { width: 19px; height: 19px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 10.5px; font-weight: 800; background: ${T.bg}; }
        .mt-qism.ok { color: ${T.ok}; } .mt-qism.ok i { background: ${T.ok}; color: #fff; }
        .mt-qism.cur { color: ${T.accent}; border-color: ${T.accent}; } .mt-qism.cur i { background: ${T.accentSoft}; color: ${T.accent}; }
        .mt-strip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; background: ${T.ink}; color: ${T.paper}; font-size: 12.5px; font-weight: 700; }
        p.mt-chiziq { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; color: ${T.ink2}; }
        p.mt-chiziq b { color: ${T.ink}; display: inline-block; } p.mt-chiziq.bor b { animation: mt-pop .45s ease-out; }
        /* Kartochkalar */
        .mt-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: mt-puls 1.8s ease-out .4s 3; }
        p.mt-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.mt-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: mt-nuqta 2.4s ease-in-out 3; }
        /* Uyga vazifa */
        .mt-hw { display: flex; flex-direction: column; gap: 12px; }
        .mt-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .mt-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .mt-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .mt-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.mt-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .mt-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .mt-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        p.mt-hw-ost { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .mt-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .mt-yakun { display: contents; }
        .mt-yakun.belgisiz .done-chip .tick { display: none; }
        .mt-reja-v { margin-top: 8px; }
        .mt-ustoz { display: flex; flex-direction: column; gap: 4px; margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .mt-ustoz b { color: ${T.ink}; }
        .mt-karta-past { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 12px; }
        .mt-karta-past > p { flex: 1 1 260px; min-width: 0; }
        .mt-karta-past > .mt-karta-tug { margin-left: auto; }
        .mt-ish { position: relative; }
        .mt-ulash { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; z-index: 3; }
        .mt-strip-q { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .mt-strip-q > p.mt-chiziq { flex: 1 1 220px; min-width: 0; }
        @media (max-width: 760px) {
          .mt-ikki, .mt-ish { grid-template-columns: minmax(0,1fr); }
          .mt-ish > .mt-sahna { width: 100%; }
          .mt-sahna, .mt-sahna.ixcham { min-height: 0; } .mt-pufaklar { min-height: 0; }
          .mt-ish > .mt-telj { align-self: center; align-items: center; }
          .mt-jq { grid-template-columns: minmax(0,1fr) 60px 50px; grid-template-areas: "k b n" "g b n"; gap: 2px 6px; padding: 7px 8px; font-size: 12px; }
          .mt-jq > :nth-child(1) { grid-area: k; } .mt-jq > :nth-child(2) { grid-area: g; } .mt-jq > :nth-child(3) { grid-area: b; } .mt-jq > :nth-child(4) { grid-area: n; }
          .mt-varaq.zich .mt-uya-m, .mt-uyalar.ixcham .mt-uya-m { white-space: normal; overflow: visible; text-overflow: clip; }
          .mt-ulash { display: none; }
          .zoomable:not(.zoom-on) > .mt-ikki > .mt-sahna:first-child { padding-top: 44px; }
          .zoomable:not(.zoom-on) > .mt-fokus > .mt-varaq:first-child > .mt-varaq-h { padding-right: 36px; }
          .q-reja .zoomable:not(.zoom-on) .q-split > .q-col:first-child > .q-yorliq:first-child { display: flex; align-items: center; min-height: 36px; padding-right: 40px; }
          .mt-hw-karta { grid-template-columns: minmax(0,1fr); }
          .mt-yq { grid-template-columns: minmax(0,1fr) auto auto; } .mt-yq .mt-kim { grid-column: 1 / -1; }
        }
        @keyframes mt-uch { 0% { transform: none; opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(0.85); opacity: 0.15; } }
        @keyframes mt-yashil { 0%, 45% { background-color: ${T.okFon}; } 100% { background-color: ${T.bg}; } }
        @keyframes mt-err { 0%, 40% { background-color: ${T.errFon}; } 100% { background-color: ${T.paper}; } }
        @keyframes mt-pop { from { transform: scale(1.3); } to { transform: none; } }
        @keyframes mt-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes mt-karta { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes mt-pufak { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes mt-harf { from { opacity: 0; letter-spacing: 0.08em; } to { opacity: 1; letter-spacing: normal; } }
        @keyframes mt-silk { 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
        @keyframes mt-yon { 0%, 100% { background: transparent; color: ${T.ink}; } 35% { background: ${T.accentSoft}; color: ${T.accent}; } }
        @keyframes mt-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes mt-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes mt-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes mt-halqa-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.28)}; } }
        @keyframes mt-nuqta { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @media (prefers-reduced-motion: reduce) {
          .mt-uch { display: none; }
          .mt-tel-narx.yon, .mt-pufak, .mt-rol, .mt-gk, .mt-gk.err, .mt-varaq-h, .mt-uya, .mt-uya.yangi, .mt-jq, .mt-jq.yangi, .mt-jq.err, .mt-bk-b, .mt-fokus, .mt-tugmalar.silk,
          .mt-chorla > .q-chip, .mt-s0.kutish .q-variant, .q-bashorat .q-chip, .mt-halqa, .mt-halqa-i, .mt-karta, .mt-tur, p.mt-chiziq b, p.mt-demaydi b, .mt-flash .fc-front, p.mt-fc-ipucha i { animation: none !important; }
          .mt-gk-t { transition: none; }
        }
        /* ⛶ oynasi (SABOQ 38, E 48): ikki klassli selektor — keyingi «.zoomable position relative» qoidasi uni bekor qilmasin; ota-blok animatsiyasi «fixed» ni o'ziga bog'lamasin */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(980px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        /* 13-Modul sinf-supurish B: ⛶ oynasi faqat ko'rish uchun — maket ichidagi tugma (telefon tugmasi, jadval katagi, belgi) oynada bosilmaydi, harakat ⛶ dan tashqarida qoladi. Kirish ekrani variantlari va maket tugmasi qolipniki — tegilmaydi. */
        .zoom-on button:not(.zoom-btn) { pointer-events: none; cursor: default; }
        .q-kirish .zoom-on button { pointer-events: auto; cursor: pointer; }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
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
        .chrome-left { display: flex; align-items: center; gap: 10px; min-width: 0; color: ${T.ink2}; }
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
