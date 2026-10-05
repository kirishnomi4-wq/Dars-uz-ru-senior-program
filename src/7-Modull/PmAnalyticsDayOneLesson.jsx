import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 9-Modul · 6-dars (PM + amaliyot) «Birinchi odam kirganda nimani ko'rasiz?» — kalit m7-06. Manba-haqiqat: feedback/F-1005-9modul/06-PmAnalyticsDayOne-v3.md (GATE M ✓).
// Skeletdan (src/skelet/NamunaDars.jsx, konveyer) — infra tegilmagan. 12 ekran (F-1005-88): s0 QKirish · s1 QReja · s2/s3/s5 QTushuncha · s4/s8 QTest (QuestionScreen) ·
//   a1/a2 amaliyot bloki (QBlok + ScreenBlok ulagichi, 5 qadam) · podium · sflash QKartochka (alohida ekran) · s11 QYakun (+ PM HwCard, M-q9).
// Bitta vizual — MaydonPanel (QADAMLAR · KUNLAR · KATAKLAR); bloklarda va 8-ekranda UmamiMock (sonlari panelning 1–2-ustuni bilan bitta manba).
// SABOQ 11 (F-1005-85/87): navbatdagi bosiladigan element .ad-navbat (halqa + yengil puls); bashorat tanlangach yopilmaydi — ixcham qator (TaxminIxcham).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================

// D3: palitra umumiy qolipdan (PM) — neytral 5 · modul rangi 2 · holat 2 (shadowBase — soya, rang tokeni emas)
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm7-06-v1', lessonTitle: { uz: "Birinchi odam kirganda nimani ko'rasiz?", ru: 'Что вы увидите, когда придёт первый человек?' } };
// 12 ekran (GATE M P-q0 + F-1005-88): PM qismi 0–5 → A1 · A2 → yakuniy savol · podium · kartochkalar (alohida ekran) · yakun
const HW_TOKENS = [
  { t: 'Umami', l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'hodisa', ru: 'событие' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: 'vaqt-tanladi', l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'uch qadam', ru: 'три шага' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `practice: -1` — sentinel (amaliyot bloki, variant yo'q).
// Yangi dars (MD v3): 4-ekran — C (2) · 8-ekran — B (1); arena 12 savol — A·B·C·D ×3.
const INLINE_KEYS = { s4: 2, s8: 1, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI: 4 — 1-savol, 8 — 2-savol). S-026: PM darsida raqam 1/2/3, kodli kartada koddan qator.
const RcKod = ({ t }) => <code className="ad-rc-kod">{t}</code>;
const RECAPS = {
  4: {
    title: { uz: 'Qachon ulanadi', ru: 'Когда подключать' },
    cards: [
      { ic: '1', h: { uz: 'Analitika ulangan kundan boshlab yozadi.', ru: 'Аналитика пишет с того дня, когда её подключили.' } },
      { ic: '2', h: { uz: "Undan oldingi kunlar bo'sh qoladi: ochib ketganlarning izi yo'q.", ru: 'Дни до этого остаются пустыми: от тех, кто открыл и ушёл, следа нет.' } },
      { ic: '3', h: { uz: "Band qilganlar Database'da qoladi, to'xtaganlar esa faqat analitikada ko'rinadi.", ru: 'Брони остаются в Database, а тех, кто остановился, видно только в аналитике.' }, ask: { uz: "Sayt bir hafta Umami'siz ishladi. O'sha haftadan nimani bilamiz?", ru: 'Сайт неделю работал без Umami. Что мы знаем об этой неделе?' } }
    ]
  },
  8: {
    title: { uz: 'Hodisa yozilmadi', ru: 'Событие не записалось' },
    cards: [
      { ic: <RcKod t={'<script defer src="…" data-website-id="…">'} />, h: { uz: 'Skript sahifa ochilishini avtomatik yozadi.', ru: 'Скрипт сам записывает открытие страницы.' } },
      { ic: <RcKod t={'data-umami-event="vaqt-tanladi"'} />, h: { uz: 'Katak bosilishini shu nom yozadi.', ru: 'Нажатие на ячейку записывает это имя.' } },
      { ic: '3', h: { uz: "Ochilish bor, hodisa yo'q", ru: 'Открытие есть, события нет' }, body: { uz: 'Skript ishlayapti — katakdagi nomni tekshiring.', ru: 'Скрипт работает — проверьте имя на ячейке.' }, ask: { uz: "Umami'da ochilish ham, hodisa ham 0. Avval nimani tekshirasiz?", ru: 'В Umami и открытий, и событий 0. Что проверите сначала?' } }
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

// ===== DARSNING BITTA VIZUALI — Maydon paneli (163, 180): bitta manba QADAMLAR · KUNLAR · KATAKLAR → MaydonPanel; bloklarda UmamiMock (UMAMI) =====
// qolip-maket: ad-katak ad-chiq ad-oraliq ad-tomon
const kl = (...a) => a.filter(Boolean).join(' ');
// Uch qadam (GATE M M-q3, P-063): ustun nomi · hodisa nomi · kim yozadi (umami — avtomatik, siz — nom berasiz)
const QADAMLAR = [
  { id: 'ochdi', nom: { uz: 'Saytni ochdi', ru: 'Открыл сайт' }, hodisa: null, kim: 'umami' },
  { id: 'tanladi', nom: { uz: 'Vaqtni tanladi', ru: 'Выбрал время' }, hodisa: 'vaqt-tanladi', kim: 'siz' },
  { id: 'band', nom: { uz: 'Band qildi', ru: 'Забронировал' }, hodisa: 'band-qildi', kim: 'siz' }
];
// Mashq raqamlari — «bu misolda», real statistika emas (MD A-5, tayanch K6). Har kun: [Saytni ochdi, Vaqtni tanladi, Band qildi]
const KUNLAR = [[12, 9, 2], [10, 8, 2], [8, 6, 1], [9, 7, 2], [11, 8, 3]];
// K1: 6 katak 16:00 … 21:00; Shanba namuna bandlari 17:00 va 20:00 (18:00 bo'sh — 10-dars sinovi)
const KATAKLAR = { soatlar: ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'], band: ['17:00', '20:00'] };
const BOSH_KATAK = KATAKLAR.soatlar.filter(s => !KATAKLAR.band.includes(s));
// Umami maketi sonlari — panelning 1–2-ustuni bilan bitta manba (Views → Saytni ochdi · vaqt-tanladi → Vaqtni tanladi)
const UMAMI_A1_METRIK = [['Visitors', 1], ['Visits', 1], ['Views', 1]];
const UMAMI = {
  a1: { metrik: UMAMI_A1_METRIK, events: [] },
  a2: { metrik: UMAMI_A1_METRIK, events: [['vaqt-tanladi', 1]] },
  s8: { metrik: [['Visitors', 6]], events: [['vaqt-tanladi', 0]] }
};
const umamiUstun = (u) => {
  const v = u.metrik.find(m => m[0] === 'Views');
  const e = u.events.find(x => x[0] === 'vaqt-tanladi');
  return [v ? v[1] : null, e ? e[1] : null, null];
};
// 2-ekran: har odam qaysi qadamgacha boradi (0 — ochdi · 1 — tanladi · 2 — band qildi), KUNLAR[0] dan; aralash tartib ((i·5) mod 12 — o'rin almashtirish)
const odamlar = (k) => {
  const arr = [...Array(k[2]).fill(2), ...Array(k[1] - k[2]).fill(1), ...Array(k[0] - k[1]).fill(0)];
  return arr.map((v, i) => ({ v, o: (i * 5) % arr.length })).sort((a, b) => a.o - b.o).map(x => x.v);
};
const ODAMLAR = odamlar(KUNLAR[0]);
const sanoqN = (n) => { const s = ODAMLAR.slice(0, n); return [s.length, s.filter(v => v >= 1).length, s.filter(v => v >= 2).length]; };
// Kam harakat rejimi (prefers-reduced-motion): belgilar yurmaydi — sonlar birdan qo'yiladi
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Telefon maketi (191): «Maydon · Shanba», 6 katak; bo'sh katak bosilsa kichrayib qaytadi (5-dars animatsiyasi) va tanlanadi; ostida «×» — saytdan chiqish
const Telefon = ({ tanlangan = null, bosilgan = null, onKatak, faol = false, navbat = null, chiqdi = false, onChiq, chiqTugma = false, nomYorliq = false, bandTugma = false, odam = 0 }) => (
  <div className={kl('ad-tel', chiqdi && 'chiqdi')}>
    <div className="ad-tel-ekran">
      <div className="ad-tel-bosh"><b>Maydon</b><span>· {tr({ uz: 'Shanba', ru: 'Суббота' })}</span>{odam > 0 && <i key={odam} className="ad-tel-odam" aria-hidden="true" />}</div>
      {nomYorliq && <code className="ad-tel-nom fade-step">data-umami-event="vaqt-tanladi"</code>}
      <div className="ad-tel-kataklar">
        {KATAKLAR.soatlar.map(s => {
          const b = KATAKLAR.band.includes(s);
          return (
            <button type="button" key={s} disabled={b || !faol} onClick={() => onKatak && onKatak(s)}
              className={kl('ad-katak', b && 'band', !b && tanlangan === s && 'tanlangan', !b && bosilgan === s && 'bos', !b && nomYorliq && 'nomli', !b && navbat === 'katak' && 'ad-navbat')}>
              <span>{s}</span>{b && <small>{tr({ uz: 'band', ru: 'занято' })}</small>}
            </button>
          );
        })}
      </div>
      {bandTugma && <span className="ad-tel-band fade-step">{tr({ uz: 'Band qilish', ru: 'Забронировать' })}</span>}
    </div>
    {chiqTugma && <button type="button" className={kl('ad-chiq', navbat === 'chiq' && 'ad-navbat')} disabled={!onChiq || chiqdi} onClick={onChiq || undefined} aria-label={tr({ uz: 'Saytdan chiqish', ru: 'Выйти с сайта' })}>×</button>}
  </div>
);
// Kun tasmasi (3-ekran): yozilgan kun — uch son; yozilmagan — uzuq chiziqli bo'sh katak (U-041); 1-kun — panelda ko'rinayotgan kun
const KunTasma = ({ yozilgan }) => (
  <div className="ad-tasma">
    {KUNLAR.map((k, d) => (
      <div key={d} className={kl('ad-kun', yozilgan[d] ? 'yoz' : 'bosh', d === 0 && 'joriy')}>
        <span className="ad-kun-n">{tr({ uz: `${d + 1}-kun`, ru: `${d + 1}-й день` })}</span>
        {yozilgan[d] && <span key={`y${d}`} className="ad-kun-s fade-step">{k.join(' · ')}</span>}
      </div>
    ))}
  </div>
);
// Ustunlar orasidagi oraliq: tanlansa qizil chiziq va «N to'xtadi» (2-ekran)
const Oraliq = ({ i, sonlar, oraliq }) => {
  const o = oraliq || {};
  const korildi = (o.korilgan || []).includes(i);
  const qizil = korildi && o.togri === i;
  const farq = sonlar[i] != null && sonlar[i + 1] != null ? sonlar[i] - sonlar[i + 1] : null;
  return (
    <button type="button" key={o.silkI === i ? `s${o.silk}` : 'o'} style={{ gridColumn: 2 + i * 2, gridRow: 1 }} disabled={!o.faol} onClick={() => o.onTanla && o.onTanla(i)}
      className={kl('ad-oraliq', o.faol && 'ad-navbat', qizil && 'qizil', korildi && !qizil && 'korildi', o.silkI === i && o.silk > 0 && 'silk')}
      aria-label={tr({ uz: `${QADAMLAR[i].nom.uz} → ${QADAMLAR[i + 1].nom.uz}`, ru: `${QADAMLAR[i].nom.ru} → ${QADAMLAR[i + 1].nom.ru}` })}>
      <span className="ad-oraliq-o" aria-hidden="true">→</span>
      {korildi && farq != null && <span className="ad-oraliq-l fade-step">{tr({ uz: `${farq} to'xtadi`, ru: `${farq} ушли` })}</span>}
    </button>
  );
};
// sonlar: [ochdi, tanladi, band] — null = «?» (yozilmagan) · toxtagan: keyingi qadamga o'tmaganlar o'z ustunida kulrang · iz: [n0, n1] — o'chib ketadigan izlar (3-ekran)
// oraliq: { faol, korilgan, togri, onTanla, silk, silkI } · ostki: [node×3] · ramka — 1–2-ustun atrofida uzuq ramka · miltilla — ustunlar bir lahza miltillaydi (son-kalit)
// yonadi — 2-ustundagi to'xtaganlar bir lahza yonadi · ok: [i] — yashil ustun · telefon: Telefon xossalari yoki null · tasma: [bool×5] · ustunSoni: 1–3 (blok o'ngida)
const MaydonPanel = ({ sonlar = [null, null, null], toxtagan = true, iz = null, oraliq = null, ostki = [], ramka = false, miltilla = 0, yonadi = false, ok = [], telefon = null, tasma = null, ustunSoni = 3, kichik = false }) => {
  const cols = QADAMLAR.slice(0, ustunSoni);
  const shablon = cols.map((_, i) => (i ? 'var(--ad-or) minmax(0,1fr)' : 'minmax(0,1fr)')).join(' ');
  return (
    <div className={kl('ad-panel', kichik && 'kichik')}>
      {tasma && <KunTasma yozilgan={tasma} />}
      <div className="ad-panel-q">
        {telefon && <Telefon {...telefon} />}
        <div className="ad-ustunlar" style={{ gridTemplateColumns: shablon }}>
          {ramka && <span className="ad-ramka fade-step" style={{ gridColumn: '1 / 4', gridRow: 1 }} aria-hidden="true" />}
          {cols.map((q, i) => {
            const son = sonlar[i];
            const keyin = i < 2 ? sonlar[i + 1] : null;
            const qoldi = toxtagan && son != null && keyin != null ? Math.max(0, son - keyin) : 0;
            const otdi = son == null ? 0 : son - qoldi;
            const izN = son == null && iz ? (iz[i] || 0) : 0;
            const col = 1 + i * 2;
            return (
              <React.Fragment key={q.id}>
                {i > 0 && <Oraliq i={i - 1} sonlar={sonlar} oraliq={oraliq} />}
                <div key={`${q.id}-${i < 2 ? miltilla : 0}`} className={kl('ad-ustun', son == null && 'yoq', ok.includes(i) && 'ok', miltilla > 0 && i < 2 && 'milt')} style={{ gridColumn: col, gridRow: 1 }}>
                  <span className="ad-ustun-n">{tr(q.nom)}</span>
                  <b key={son == null ? 'x' : son} className={kl('ad-son', son != null && son > 0 && 'yangi')}>{son == null ? '?' : son}</b>
                  {otdi + qoldi + izN > 0 && (
                    <span className="ad-belgilar">
                      {Array.from({ length: otdi }).map((_, j) => <i key={`o${j}`} className="ad-odam" />)}
                      {Array.from({ length: qoldi }).map((_, j) => <i key={`q${j}`} className={kl('ad-odam', 'qoldi', yonadi && i === 1 && 'yon')} />)}
                      {Array.from({ length: izN }).map((_, j) => <i key={`z${j}`} className="ad-odam qoldi ochadi" style={{ animationDelay: `${0.5 + j * 0.06}s` }} />)}
                    </span>
                  )}
                </div>
                <div className="ad-ostki" style={{ gridColumn: col, gridRow: 2 }}>
                  {i === 2 && <span className="ad-db">{tr({ uz: "Database'dan", ru: 'из Database' })}</span>}
                  {ostki[i]}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
// Umami ko'rinishining chizilgan maketi (logotipsiz, D4): brauzer oynasi cloud.umami.is · «Maydon · localhost» · sonlar · «Events»
const UmamiMock = ({ m, kichik = false }) => (
  <div className={kl('ad-um', kichik && 'kichik')}>
    <div className="ad-um-bar"><i /><i /><i /><span>cloud.umami.is</span></div>
    <div className="ad-um-tana">
      <b className="ad-um-sayt">Maydon · localhost</b>
      {m.metrik.length > 0 && <div className="ad-um-metrik">{m.metrik.map(([k, v]) => <div key={k} className="ad-um-m"><span className="ad-um-k">{k}</span><b className="ad-um-v">{v}</b></div>)}</div>}
      {m.events.length > 0 && <div className="ad-um-ev"><span className="ad-um-k">Events</span>{m.events.map(([k, v]) => <div key={k} className="ad-um-er"><code>{k}</code><b>{v}</b></div>)}</div>}
    </div>
  </div>
);
// Ballsiz bashorat (181): tanlangach yopilmaydi — ixcham qator bo'lib natija (QTaxmin) chiqquncha turadi (SABOQ 11, F-1005-85/87)
const TaxminIxcham = ({ savol, variantlar, taxmin }) => {
  const tx = variantlar.find(v => v.k === taxmin);
  if (!tx) return null;
  return (
    <div className="ad-taxmin">
      <span className="q-yorliq">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span>
      <span className="ad-taxmin-s">{tr(savol)}</span>
      <b className="ad-taxmin-j">{tr(tx.t)}</b>
    </div>
  );
};
const Bashorat = ({ savol, variantlar, taxmin, onTanla, done }) => (!taxmin
  ? <div className="ad-navbat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={onTanla} /></div>
  : (done ? null : <TaxminIxcham savol={savol} variantlar={variantlar} taxmin={taxmin} />));
const TaxminNatija = ({ variantlar, taxmin, togriK, haqiqat }) => {
  const tx = variantlar.find(v => v.k === taxmin);
  if (!tx) return null;
  return (
    <QTaxmin togri={taxmin === togriK}>{taxmin === togriK
      ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение верно' })
      : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(haqiqat)}</b></>}</QTaxmin>
  );
};
const NAV_TAXMIN = { uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' };
const NAV_DAVOM = { uz: 'Davom etish', ru: 'Продолжить' };

// ===== SCREEN 0 — KIRISH (QKirish: bo'sh katakni tanlash → «×» saytdan chiqish → panel bo'sh qoladi → variantlar; ballsiz, J-026 — javob ikkalasida bir xil, maqtovsiz) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Qaysi qadamda chiqib ketganini', ru: 'На каком шаге он ушёл' } },
  { id: 'b', label: { uz: 'Hech narsani — u band qilmadi', ru: 'Ничего — он не забронировал' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [tanlangan, setTanlangan] = useState(avval ? '18:00' : null);
  const [bos, setBos] = useState(null);
  const [chiqdi, setChiqdi] = useState(avval);
  const [milt, setMilt] = useState(0);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const katak = (s) => {
    if (chiqdi) return;
    setTanlangan(s); setBos(s); setSc(n => n + 1);
    tm.current.push(setTimeout(() => setBos(null), kamHarakat() ? 0 : 260));
  };
  const chiq = () => { if (!tanlangan || chiqdi) return; setChiqdi(true); setMilt(n => n + 1); setSc(n => n + 1); };
  const pick = (v) => { if (picked !== null || !chiqdi) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const navbat = !tanlangan ? 'katak' : !chiqdi ? 'chiq' : null;
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · «Maydon» ishga tushdi', ru: 'Введение · «Maydon» запущен' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr(NAV_DAVOM)} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Birinchi odam kirganda <span className="italic" style={{ color: T.accent }}>nimani ko'rasiz?</span></>, ru: <>Что вы увидите, <span className="italic" style={{ color: T.accent }}>когда придёт первый человек?</span></> })}
        mentor={<Mentor>{tr({ uz: "«Maydon» ishga tushgan kunni tasavvur qiling. Maketda bitta bo'sh vaqtni tanlang va saytdan chiqing.", ru: 'Представьте день, когда «Maydon» запустился. Выберите на макете одно свободное время и выйдите с сайта.' })}</Mentor>}
        maket={(
          <div className={kl('ad-hook', chiqdi && picked === null && 'tanla')}>
            <MaydonPanel sonlar={[null, null, 0]} miltilla={milt} ramka={picked !== null}
              telefon={{ tanlangan, bosilgan: bos, onKatak: katak, faol: !chiqdi, navbat, chiqdi, chiqTugma: true, onChiq: tanlangan && !chiqdi ? chiq : null }} />
          </div>
        )}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={!chiqdi}
        javob={picked !== null && <p className="hook-ack fade-step">{tr({ uz: "Ikkalasi ham bo'lishi mumkin. Sayt uning qadamlarini yozib borsa — birinchisi, yozmasa — ikkinchisi.", ru: 'Возможно и то, и другое. Если сайт записывает его шаги — первое, если нет — второе.' })}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda panel bir marta o'zi o'ynaydi — odam saytni ochadi, 18:00 ni tanlaydi; o'ngda 4 qadam «01 · matn · teg»; pastda repo teglari) =====
const REJA = [
  { t: { uz: 'Qaysi qadamdan keyin son keskin kamayishini topasiz', ru: 'Найдёте, после какого шага число резко падает' }, teg: { uz: 'uch qadam', ru: 'три шага' } },
  { t: { uz: "Kech ulansa nima yo'qolishini ko'rasiz", ru: 'Увидите, что теряется при позднем подключении' }, teg: { uz: 'birinchi kun', ru: 'первый день' } },
  { t: { uz: "«Maydon»ga Umami'ni ulaysiz", ru: 'Подключите Umami к «Maydon»' }, teg: 'Umami' },
  { t: { uz: 'Vaqt tanlashni ham yozdirasiz', ru: 'Запишете и выбор времени' }, teg: { uz: 'hodisa', ru: 'событие' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [bosq, setBosq] = useState(0); // 0 — hali hech kim · 1 — odam saytni ochdi · 2 — 18:00 tanlandi
  const [bos, setBos] = useState(null);
  useEffect(() => { // DE-200: bir marta o'zi o'ynaydi
    if (kamHarakat()) { setBosq(2); return undefined; }
    const a = setTimeout(() => setBosq(1), 1100);
    const b = setTimeout(() => { setBosq(2); setBos('18:00'); }, 2400);
    const c = setTimeout(() => setBos(null), 2660);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, []);
  return (
    <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun «Maydon» <span className="italic" style={{ color: T.accent }}>har odamning qadamlarini</span> yozib boradi.</>, ru: <>Сегодня «Maydon» будет записывать <span className="italic" style={{ color: T.accent }}>шаги каждого человека</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Umami — saytda odamlar nima qilganini yozib boradigan xizmat. Kodni Antigravity yozadi, siz har qadamni Umami'da tekshirasiz.", ru: 'Umami — сервис, который записывает, что люди делали на сайте. Код пишет Antigravity, а каждый шаг вы проверяете в Umami.' })}</Mentor>}
        chapYorliq={tr({ uz: "Dars oxirida — o'z kompyuteringizda shunday", ru: 'В конце урока — так на вашем компьютере' })}
        chap={<MaydonPanel toxtagan={false} sonlar={[bosq >= 1 ? 1 : 0, bosq >= 2 ? 1 : 0, null]} telefon={{ tanlangan: bosq >= 2 ? '18:00' : null, bosilgan: bos, odam: bosq >= 1 ? 1 : 0 }} />}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <p className="ad-repo fade-up delay-3">{tr({ uz: "repo maydon · boshlang'ich holat dars-05-done · tayyor namuna dars-06-done", ru: 'репо maydon · начальное состояние dars-05-done · готовый образец dars-06-done' })}</p>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · UCH QADAM (QTushuncha: bashorat → «Kunni boshlang» — 12 odam birin-ketin o'tadi → oraliqni bosish → ta'rif «analitika» → taxmin natijasi → xulosa) =====
const S2_SAVOL = { uz: "Ko'pchilik qaysi qadamdan keyin to'xtagan?", ru: 'После какого шага остановилось большинство?' };
const S2_TAXMIN = [
  { k: '0', t: { uz: 'Saytni ochgandan keyin', ru: 'После открытия сайта' } },
  { k: '1', t: { uz: 'Vaqtni tanlagandan keyin', ru: 'После выбора времени' } }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const achMiss = useContext(AchMissCtx);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [boshlandi, setBoshlandi] = useState(avval);
  const [n, setN] = useState(avval ? ODAMLAR.length : 0);
  const [korilgan, setKorilgan] = useState(avval ? [1] : []);
  const [topildi, setTopildi] = useState(avval);
  const [xato, setXato] = useState(false);
  const [silk, setSilk] = useState(0);
  const [yon, setYon] = useState(false);
  const xatoBoldi = useRef(false);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const oqdi = n >= ODAMLAR.length;
  const done = topildi;
  const tugadi = useTugadi(done, 1600, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin, birinchi: !xatoBoldi.current }); }, [done]); // eslint-disable-line
  const boshla = () => {
    if (boshlandi || !taxmin) return;
    setBoshlandi(true);
    if (kamHarakat()) { setN(ODAMLAR.length); return; }
    ODAMLAR.forEach((_, i) => tm.current.push(setTimeout(() => setN(i + 1), 300 + i * 240)));
  };
  const oraliqTanla = (i) => {
    if (!oqdi || topildi) return;
    setKorilgan(k => (k.includes(i) ? k : [...k, i]));
    if (i === 1) { setXato(false); setTopildi(true); setYon(true); tm.current.push(setTimeout(() => setYon(false), 1500)); return; }
    if (!xatoBoldi.current) { xatoBoldi.current = true; if (achMiss) achMiss.miss(screen); } // Drop Spotter — faqat birinchi tanlov to'g'ri bo'lsa
    setXato(true); setSilk(s => s + 1);
  };
  const oxirgi = n > 0 ? ODAMLAR[n - 1] : -1;
  const panel = (
    <MaydonPanel sonlar={sanoqN(n)} yonadi={yon}
      oraliq={{ faol: oqdi && !topildi, korilgan, togri: 1, onTanla: oraliqTanla, silk, silkI: 0 }}
      telefon={{ odam: boshlandi && !oqdi ? n : 0, tanlangan: boshlandi && !oqdi && oxirgi >= 1 ? BOSH_KATAK[(n - 1) % BOSH_KATAK.length] : null }} />
  );
  const navLabel = done ? NAV_DAVOM : !taxmin ? NAV_TAXMIN : !boshlandi ? { uz: 'Kunni boshlang', ru: 'Начните день' } : { uz: 'Oraliqni tanlang', ru: 'Выберите промежуток' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · uch qadam', ru: 'Понятие · три шага' })} screen={screen} scrollSignal={n + korilgan.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navLabel)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval vizualAvval={false}
        sarlavha={tr({ uz: <>Birinchi kuni odamlar <span className="italic" style={{ color: T.accent }}>qaysi qadamda to'xtadi?</span></>, ru: <>На каком шаге люди <span className="italic" style={{ color: T.accent }}>остановились в первый день?</span></> })}
        mentor={<Mentor>{tr({ uz: "Ochish — foydalanish boshlangani, band qilish — ish oxirigacha yetgani. Kunni boshlang va o'rtada nima bo'lganini ko'ring.", ru: 'Открытие — начало использования, бронь — дело доведено до конца. Начните день и посмотрите, что было посередине.' })}</Mentor>}
        bashorat={<Bashorat savol={S2_SAVOL} variantlar={S2_TAXMIN} taxmin={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={taxmin && (
          <div className="ad-harakat">
            {!boshlandi && <QTugma className="ad-navbat" onClick={boshla}>{tr({ uz: 'Kunni boshlang', ru: 'Начните день' })}</QTugma>}
            {oqdi && <QIzoh>{tr({ uz: "Bu mashqda har odam har qadamda bir marta sanaladi: ikki ustun farqi — o'sha qadamda to'xtaganlar.", ru: 'В этом упражнении каждый человек считается на каждом шаге один раз: разница двух столбцов — те, кто остановился на этом шаге.' })}</QIzoh>}
            {oqdi && !topildi && xato && <QXato key={silk}>{tr({ uz: "Bu yerda 3 odam to'xtadi — ko'prog'i qayerda?", ru: 'Здесь остановились 3 человека — где больше?' })}</QXato>}
          </div>
        )}
        vizual={panel}
        natija={done && (
          <div className="ad-natija">
            <p className="ad-joriy fade-step">{tr({ uz: <>Odamlar saytda nima qilganini yozib, sanab beradigan asbob <b>analitika</b> deyiladi.</>, ru: <>Инструмент, который записывает и считает, что люди делали на сайте, называется <b>аналитикой</b>.</> })}</p>
            <TaxminNatija variantlar={S2_TAXMIN} taxmin={taxmin} togriK="1" haqiqat={{ uz: 'vaqtni tanlagandan keyin', ru: 'после выбора времени' }} />
          </div>
        )}
        xulosa={done && tr({ uz: 'Bu misolda eng katta pasayish — vaqt tanlashdan keyin. Analitika muammo qayerdaligini aytadi, sababini emas.', ru: 'В этом примере самое большое падение — после выбора времени. Аналитика говорит, где проблема, но не почему.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — TUSHUNCHA · KECH ULASH (QTushuncha: bashorat → ulash kuni «4-kuni» / «1-kundan oldin» → kun tasmasi va 1-kun paneli o'zgaradi → taxmin natijasi → xulosa) =====
const S3_SAVOL = { uz: 'Umami 4-kuni ulansa, besh kundan nechtasi yoziladi?', ru: 'Если подключить Umami на 4-й день, сколько из пяти дней запишется?' };
const S3_TAXMIN = [
  { k: '1', t: { uz: 'Bittasi', ru: 'Один' } },
  { k: '2', t: { uz: 'Ikkitasi', ru: 'Два' } },
  { k: '5', t: { uz: 'Beshtasi', ru: 'Все пять' } }
];
const ULASH = [
  { id: 'kech', t: { uz: '4-kuni', ru: 'На 4-й день' }, tasma: [false, false, false, true, true] },
  { id: 'erta', t: { uz: '1-kundan oldin', ru: 'До 1-го дня' }, tasma: [true, true, true, true, true] }
];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [ulash, setUlash] = useState(avval ? 'erta' : null);
  const [korildi, setKorildi] = useState(avval ? ['kech', 'erta'] : []);
  const done = korildi.length >= ULASH.length;
  const tugadi = useTugadi(done, 1600, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (tugadi) setUlash('erta'); }, [tugadi]); // DE-199: fokus «1-kundan oldin» holatida
  const tanla = (id) => { if (!taxmin) return; setUlash(id); setKorildi(k => (k.includes(id) ? k : [...k, id])); };
  const u = ULASH.find(x => x.id === ulash);
  const erta = ulash === 'erta';
  const panel = (
    <MaydonPanel key={ulash || 'bosh'} tasma={u ? u.tasma : [false, false, false, false, false]}
      sonlar={erta ? KUNLAR[0] : [null, null, KUNLAR[0][2]]}
      iz={ulash === 'kech' ? [KUNLAR[0][0] - KUNLAR[0][1], KUNLAR[0][1] - KUNLAR[0][2]] : null}
      telefon={{}} />
  );
  const navLabel = done ? NAV_DAVOM : !taxmin ? NAV_TAXMIN : { uz: `Ikkala kunni tanlang (${korildi.length}/2)`, ru: `Выберите оба дня (${korildi.length}/2)` };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · birinchi kun', ru: 'Понятие · первый день' })} screen={screen} scrollSignal={korildi.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navLabel)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval vizualAvval={false}
        sarlavha={tr({ uz: <>Analitikani kech ulasangiz, <span className="italic" style={{ color: T.accent }}>kimning izi yo'qoladi?</span></>, ru: <>Если подключить аналитику поздно, <span className="italic" style={{ color: T.accent }}>чей след пропадёт?</span></> })}
        mentor={<Mentor>{tr({ uz: "Hisobda yozilmagan kun bo'sh qoladi — buni «Kecha kelgan odam bugun ham keldimi?» darsida ko'rgansiz. Umami'ni qaysi kuni ulashni o'zingiz tanlang.", ru: 'Незаписанный в отчёте день остаётся пустым — вы видели это на уроке «Пришёл ли сегодня тот, кто был вчера?». Выберите сами, в какой день подключить Umami.' })}</Mentor>}
        bashorat={<Bashorat savol={S3_SAVOL} variantlar={S3_TAXMIN} taxmin={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={taxmin && (
          <div className="ad-harakat ad-ulash">
            {ULASH.map(x => (
              <QTugma key={x.id} ikkinchi className={kl(ulash === x.id && 'ad-on', !korildi.includes(x.id) && 'ad-navbat')} onClick={() => tanla(x.id)}>{tr(x.t)}</QTugma>
            ))}
          </div>
        )}
        vizual={panel}
        natija={done && <TaxminNatija variantlar={S3_TAXMIN} taxmin={taxmin} togriK="2" haqiqat={{ uz: 'ikkitasi', ru: 'два' }} />}
        xulosa={done && tr({ uz: "Analitika ulangan kundan boshlab yozadi. Birinchi kunlarda to'xtaganlarning izi qolmaydi.", ru: 'Аналитика пишет с того дня, когда её подключили. От тех, кто ушёл в первые дни, следа не остаётся.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s4 = 2 — C; to'g'risi eng uzun emas) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · qachon ulanadi', ru: 'Проверка · когда подключать' })}
    questionText="«Maydon»ga hali hech kim kirmagan. Umami'ni qachon ulaysiz?"
    question={tr({ uz: <h2 className="title h-ask">«Maydon»ga hali hech kim kirmagan. <span className="italic" style={{ color: T.accent }}>Umami'ni qachon ulaysiz?</span></h2>, ru: <h2 className="title h-ask">На «Maydon» ещё никто не заходил. <span className="italic" style={{ color: T.accent }}>Когда подключите Umami?</span></h2> })}
    options={[
      { uz: "Band qilish to'liq ishlagandan keyin", ru: 'Когда бронь заработает полностью' },
      { uz: 'Saytga yuzta odam kirgandan keyin', ru: 'Когда на сайт зайдут сто человек' },
      { uz: 'Hozir, birinchi odam kelmasdan oldin', ru: 'Сейчас, до первого человека' },
      { uz: 'Birinchi shikoyat kelgandan keyin', ru: 'Когда придёт первая жалоба' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Ulangan kundan oldingi odamlar yozilmaydi — birinchilari ham.', ru: 'Люди до дня подключения не записываются — и самые первые тоже.' }}
    explainWrong={{
      0: { uz: 'Band qilish qurilguncha ochganlar yozilmay qoladi.', ru: 'Те, кто открыл сайт до появления брони, не запишутся.' },
      1: { uz: 'Birinchi yuzta odamning izi qolmaydi.', ru: 'От первых ста человек не останется следа.' },
      3: { uz: 'Shikoyat qilmay ketganlar hech qayerda yozilmaydi.', ru: 'Те, кто ушёл без жалобы, нигде не записаны.' },
      default: { uz: 'Analitika faqat ulangan kundan boshlab yozadi.', ru: 'Аналитика пишет только с дня подключения.' }
    }} />
);

// ===== SCREEN 5 — TUSHUNCHA · HODISA (QTushuncha, saralash: qadam-karta bittadan (SABOQ 9/13) → tomonni bosish yoki sudrash → maket o'zgaradi → ta'rif «hodisa») =====
const S5_TARTIB = ['tanladi', 'ochdi', 'band']; // aralash tartib
const TOMONLAR = [
  { id: 'umami', t: { uz: 'Avtomatik yoziladi', ru: 'Записывается автоматически' } },
  { id: 'siz', t: { uz: 'Nom berasiz', ru: 'Имя даёте вы' } }
];
const S5_XATO = {
  ochdi: { uz: 'Sahifa ochilishini Umami avtomatik yozadi — nom kerak emas.', ru: 'Открытие страницы Umami пишет автоматически — имя не нужно.' },
  boshqa: { uz: 'Umami katakni tanimaydi — unga nom kerak.', ru: 'Umami не знает ячейку — ей нужно имя.' }
};
const qadamTop = (id) => QADAMLAR.find(q => q.id === id);
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [joylangan, setJoylangan] = useState(avval ? S5_TARTIB : []);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(0);
  const [sanoq, setSanoq] = useState(avval ? [1, 0] : [0, 0]);
  const [bos, setBos] = useState(null);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const joriy = S5_TARTIB[joylangan.length];
  const bor = (id) => joylangan.includes(id);
  const done = joylangan.length >= S5_TARTIB.length;
  const tugadi = useTugadi(done, 1600, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const qoy = (tomon) => {
    if (!joriy) return;
    if (qadamTop(joriy).kim !== tomon) { setXato(joriy === 'ochdi' ? S5_XATO.ochdi : S5_XATO.boshqa); setSilk(s => s + 1); return; }
    setXato(null);
    const id = joriy;
    setJoylangan(j => [...j, id]);
    if (id === 'ochdi') tm.current.push(setTimeout(() => setSanoq(s => [s[0] + 1, s[1]]), kamHarakat() ? 0 : 600)); // telefon ochildi — 1-ustunga +1 o'zi
  };
  const katak = (s) => {
    if (!bor('tanladi')) return;
    setBos(s); tm.current.push(setTimeout(() => setBos(null), kamHarakat() ? 0 : 260));
    setSanoq(c => [c[0], c[1] + 1]);
  };
  const ostki = [
    bor('ochdi') && <span key="u" className="ad-ost ok fade-step">{tr(TOMONLAR[0].t)}</span>,
    bor('tanladi') && <code key="t" className="ad-ost kod fade-step">vaqt-tanladi</code>,
    bor('band') && <span key="b" className="ad-ost-g fade-step"><code className="ad-ost kod">band-qildi</code><span className="ad-ost qulf">{tr({ uz: 'band qilish qurilgach', ru: 'когда появится бронь' })}</span></span>
  ];
  const panel = (
    <MaydonPanel toxtagan={false} ok={bor('ochdi') ? [0] : []} ostki={ostki}
      sonlar={[bor('ochdi') ? sanoq[0] : null, bor('tanladi') ? sanoq[1] : null, null]}
      telefon={{ faol: bor('tanladi'), onKatak: katak, bosilgan: bos, nomYorliq: bor('tanladi'), bandTugma: bor('band'), odam: sanoq[0] }} />
  );
  const jq = joriy && qadamTop(joriy);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · hodisa', ru: 'Понятие · событие' })} screen={screen} scrollSignal={joylangan.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr(NAV_DAVOM) : tr({ uz: `Uch qadamni joylang (${joylangan.length}/3)`, ru: `Разложите три шага (${joylangan.length}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval vizualAvval={false}
        sarlavha={tr({ uz: <>Umami qaysi qadamni <span className="italic" style={{ color: T.accent }}>o'zi yozadi?</span></>, ru: <>Какой шаг Umami <span className="italic" style={{ color: T.accent }}>записывает сам?</span></> })}
        mentor={<Mentor>{tr({ uz: "Sahifa ochilishi hamma saytda bir xil, vaqt katagi esa faqat «Maydon»da bor. Har qadamni o'z tomoniga qo'ying.", ru: 'Открытие страницы одинаково на любом сайте, а ячейка времени есть только в «Maydon». Положите каждый шаг на свою сторону.' })}</Mentor>}
        harakat={(
          <div className="ad-saralash">
            <div className="ad-sar-q">
              {TOMONLAR.map((t, ti) => (
                <button key={t.id} type="button" style={{ order: ti === 0 ? 0 : 2 }} className={kl('ad-tomon', joriy && 'ad-navbat')} disabled={!joriy}
                  onClick={() => qoy(t.id)} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); qoy(t.id); }}>
                  <span className="ad-tomon-l">{tr(t.t)}</span>
                  <span className="ad-tomon-k">{joylangan.filter(id => qadamTop(id).kim === t.id).map(id => <span key={id} className="ad-tomon-chip fade-step">{tr(qadamTop(id).nom)}</span>)}</span>
                </button>
              ))}
              {jq && (
                <div key={`${joriy}-${silk}`} className={kl('ad-kq', silk > 0 && xato && 'silk')} style={{ order: 1 }} draggable onDragStart={e => { try { e.dataTransfer.setData('text/plain', joriy); } catch { /* sudrash yopiq */ } }}>
                  <span className="q-yorliq">{joylangan.length + 1} / {S5_TARTIB.length}</span>
                  <b className="ad-kq-t">{tr(jq.nom)}</b>
                </div>
              )}
            </div>
            {xato && <QXato key={silk}>{tr(xato)}</QXato>}
          </div>
        )}
        vizual={panel}
        natija={done && <p className="ad-joriy fade-step">{tr({ uz: <>Analitikaga yoziladigan bitta harakat <b>hodisa</b> deyiladi.</>, ru: <>Одно действие, которое записывается в аналитику, называется <b>событием</b>.</> })}</p>}
        xulosa={done && tr({ uz: 'Sahifa ochilishini Umami avtomatik yozadi. Vaqt tanlash hodisasiga esa nomni siz berasiz.', ru: 'Открытие страницы Umami пишет автоматически. А событию выбора времени имя даёте вы.' })}
      />
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar, 4) — ikki tushuncha/test + ikki amaliyot-bonus (P-048: ish bajarilgan) =====
const ACHIEVEMENTS = {
  dropSpotter: { icon: '📉', name: 'Drop Spotter!', desc: { uz: "Ko'p odam to'xtagan qadamni birinchi urinishda topdingiz", ru: 'Вы с первой попытки нашли шаг, где ушло больше всего людей' } },
  dayOne: { icon: '📅', name: 'Day One!', desc: { uz: 'Umami qachon ulanishini birinchi urinishda topdingiz', ru: 'Вы с первой попытки нашли, когда подключать Umami' } },
  trackerOn: { icon: '📡', name: 'Tracker On!', desc: { uz: "«Maydon»ga Umami'ni uladingiz", ru: 'Вы подключили Umami к «Maydon»' } },
  firstEvent: { icon: '🎯', name: 'First Event!', desc: { uz: "Birinchi hodisangiz Umami'ga yozildi", ru: 'Ваше первое событие записалось в Umami' } }
};
// Ekran id → nishon: s2 — birinchi tanlangan oraliq to'g'ri (xatoda AchMissCtx.miss) · s4 — birinchi urinish · a1/a2 — oxirgi «Bajardim» (bonus)
const ACH_TRIGGERS = { s2: 'dropSpotter', s4: 'dayOne', a1: 'trackerOn', a2: 'firstEvent' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 8)
const Q_LABELS = {
  4: { uz: 'Umami qachon ulanadi', ru: 'Когда подключать Umami' },
  8: { uz: 'Hodisa yozilmadi', ru: 'Событие не записалось' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod-belgi va nom o'zgarmaydi; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: 'Umami', l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'analitika', ru: 'аналитика' }, l: 82, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'hodisa', ru: 'событие' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'qadam', ru: 'шаг' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: 'vaqt-tanladi', l: 42, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'data-umami-event', l: 60, t: 24, s: 20, d: 17, dl: 0.4 },
  { ch: 'Visitors', l: 24, t: 36, s: 22, d: 20, dl: 1.9 },
  { ch: 'Events', l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: 'localhost:5173', l: 64, t: 46, s: 18, d: 22, dl: 0.6 },
  { ch: { uz: 'band', ru: 'бронь' }, l: 88, t: 40, s: 22, d: 24, dl: 1.3 },
  { ch: 'Maydon', l: 34, t: 58, s: 24, d: 26, dl: 2.5 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (1A 2B 3C 4D 5A 6B 7C 8D 9A 10B 11C 12D)
const QUIZ_BANK = [
  { q: { uz: 'Analitika saytda nimani yozib boradi?', ru: 'Что записывает аналитика на сайте?' }, opts: [{ uz: 'Odamlar saytda nima qilganini', ru: 'Что люди делали на сайте' }, { uz: 'Sayt necha soniyada ochilishini', ru: 'За сколько секунд открывается сайт' }, { uz: 'Kodda qancha xato qolganini', ru: 'Сколько ошибок осталось в коде' }, { uz: 'Saytni kim va qachon qurganini', ru: 'Кто и когда сделал сайт' }], correct: 0 },
  { q: { uz: 'Umami 4-kuni ulandi. 1-kundan nima ma\'lum?', ru: 'Umami подключили на 4-й день. Что известно о 1-м дне?' }, opts: [{ uz: 'Hamma qadam, faqat kechikib keladi', ru: 'Все шаги, просто придут позже' }, { uz: "Faqat Database'dagi bandlar", ru: 'Только брони в Database' }, { uz: 'Faqat saytni ochganlar soni', ru: 'Только число открывших сайт' }, { uz: "Hech narsa — bandlar ham o'chgan", ru: 'Ничего — брони тоже стёрлись' }], correct: 1 },
  { q: { uz: '«Maydon»ning uch qadami qaysi tartibda?', ru: 'В каком порядке три шага «Maydon»?' }, opts: [{ uz: 'Band qildi → Vaqtni tanladi → Saytni ochdi', ru: 'Забронировал → Выбрал время → Открыл сайт' }, { uz: 'Vaqtni tanladi → Saytni ochdi → Band qildi', ru: 'Выбрал время → Открыл сайт → Забронировал' }, { uz: 'Saytni ochdi → Vaqtni tanladi → Band qildi', ru: 'Открыл сайт → Выбрал время → Забронировал' }, { uz: 'Saytni ochdi → Band qildi → Vaqtni tanladi', ru: 'Открыл сайт → Забронировал → Выбрал время' }], correct: 2 },
  { q: { uz: '10 odam ochdi, 8 tasi vaqt tanladi, 1 tasi band qildi. Son qayerda keskin kamaydi?', ru: '10 открыли, 8 выбрали время, 1 забронировал. Где число резко упало?' }, opts: [{ uz: 'Sahifa ochilgandan keyin', ru: 'После открытия страницы' }, { uz: "Band qilib bo'lgandan keyin", ru: 'После того как забронировали' }, { uz: 'Saytni ochishdan ham oldin', ru: 'Ещё до открытия сайта' }, { uz: 'Vaqtni tanlagandan keyin', ru: 'После выбора времени' }], correct: 3 },
  { q: { uz: 'Analitikaga yoziladigan bitta harakat nima deyiladi?', ru: 'Как называется одно действие, записанное в аналитику?' }, opts: [{ uz: 'Hodisa', ru: 'Событие' }, { uz: 'Metrika', ru: 'Метрика' }, { uz: 'Bosh raqam', ru: 'Главное число' }, { uz: 'Sinov', ru: 'Испытание' }], correct: 0 },
  { q: { uz: 'Saytning ochilishini Umami qanday yozadi?', ru: 'Как Umami записывает открытие сайта?' }, opts: [{ uz: "Har sahifaga hodisa nomi qo'shiladi", ru: 'На каждую страницу добавляют имя события' }, { uz: "Skript ulangach, o'zi yozib boradi", ru: 'После подключения скрипт пишет сам' }, { uz: "Maydon egasi qo'lda kiritib boradi", ru: 'Владелец поля вносит вручную' }, { uz: "Faqat band qilinganda yozib qo'yadi", ru: 'Пишет только при брони' }], correct: 1 },
  { q: { uz: "Bugun nega faqat bitta hodisa qo'shildi?", ru: 'Почему сегодня добавили только одно событие?' }, opts: [{ uz: "Umami bittadan ortig'ini olmaydi", ru: 'Umami не принимает больше одного' }, { uz: 'Ochilish ham nom kutib turadi', ru: 'Открытию тоже нужно имя' }, { uz: 'Band qilish hali qurilmagan', ru: 'Бронь ещё не сделана' }, { uz: 'Bitta hodisa hamma qadamni yozadi', ru: 'Одно событие пишет все шаги' }], correct: 2 },
  { q: { uz: '«Kun almashtirish» hodisasiga qaysi nom darsdagidek?', ru: 'Какое имя для события «смена дня» — как на уроке?' }, opts: ['Kun Almashtirdi', 'kun almashtirdi', 'KUN_ALMASHTIRDI', 'kun-almashtirdi'], correct: 3 },
  { q: { uz: "Katak bosilishini Umami'ga qaysi yozuv aytadi?", ru: 'Какая запись сообщает Umami о нажатии ячейки?' }, opts: ['data-umami-event', 'data-website-id', 'VITE_UMAMI_ID', 'cloud.umami.is/script.js'], correct: 0 },
  { q: { uz: 'Website ID nega web/.env faylida turadi?', ru: 'Почему Website ID лежит в файле web/.env?' }, opts: [{ uz: "Uni boshqa odam ko'rib qolmasligi uchun", ru: 'Чтобы его не увидел другой человек' }, { uz: "Har o'quvchining Umami sayti boshqa", ru: 'У каждого ученика свой сайт в Umami' }, { uz: "Umami uni faqat .env fayldan o'qiydi", ru: 'Umami читает его только из .env' }, { uz: "index.html uni o'zi o'qiy olmagani uchun", ru: 'Потому что index.html не может его прочитать' }], correct: 1 },
  { q: { uz: "Sayt ochildi, Umami'da esa 0. Sabab nima bo'lishi mumkin?", ru: 'Сайт открыли, а в Umami 0. В чём может быть причина?' }, opts: [{ uz: "Katakka hodisa nomi qo'shilmagan", ru: 'На ячейку не добавили имя события' }, { uz: 'Band qilish tugmasi hali qurilmagan', ru: 'Кнопку брони ещё не сделали' }, { uz: 'Reklama to\'sgichi skriptni yopgan', ru: 'Блокировщик рекламы закрыл скрипт' }, { uz: "Database'ga ulanish uzilib qolgani", ru: 'Оборвалась связь с Database' }], correct: 2 },
  { q: { uz: '«Maydon»ning bosh raqami nimani sanaydi?', ru: 'Что считает главное число «Maydon»?' }, opts: [{ uz: 'Saytni ochgan odamlarni', ru: 'Людей, открывших сайт' }, { uz: 'Vaqtni tanlagan odamlarni', ru: 'Людей, выбравших время' }, { uz: 'Kunni almashtirgan odamlarni', ru: 'Людей, сменивших день' }, { uz: 'Band qilgan odamlarni', ru: 'Людей, которые забронировали' }], correct: 3 }
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
// Har blok — ScreenBlok'ga ma'lumot: steps [{ h, t, prompt?: [satr], kimga?, err?, forma?: true }] · natija · ortda (K10 buyruqlari).
// 9-Modul (qaror 8, GATE M M-q1): blok 5 qadam — 5-qadam «O'z g'oyangiz». A2 5-qadami — uch qadam formasi (QadamForma): qiymat answers[ekran].qadamlar da (ccProgress)
//   va localStorage «pm-m7d6-qadamlar» { asosiy, oldingi, hodisa } (tayanch 6) → shu qadam prompti va yakundagi uyga vazifa. «Bajardim» forma to'g'ri bo'lgach ochiladi (JS qulf + CSS :has).
// «Ortda qoldingizmi» (K10): A1 — dars-06-start, A2 — dars-06-done. Signal 500+ zonasida — faqat mentor ko'radi (MentorPracticeStats).
const QADAM_KALIT = 'pm-m7d6-qadamlar';
const QADAM_BOSH = { asosiy: '', oldingi: '', hodisa: '' };
const qadamOqi = () => { try { const v = JSON.parse(localStorage.getItem(QADAM_KALIT) || 'null'); return v && typeof v === 'object' ? { ...QADAM_BOSH, ...v } : null; } catch { return null; } };
const qadamYoz = (v) => { try { localStorage.setItem(QADAM_KALIT, JSON.stringify(v)); } catch { /* saqlash yopiq — forma ekranda qoladi */ } };
// 3-darsda saqlangan muammo (tayanch 6, `pm-m7d3-muammo` = { shikoyatlar, kim, nima, n }) — bo'lsa A2 5-qadam tepasida bir qator
const muammoOqi = () => { try { const v = JSON.parse(localStorage.getItem('pm-m7d3-muammo') || 'null'); return v && (v.kim || v.nima) ? v : null; } catch { return null; } };
// Hodisa nomi qoidasi (tayanch): kichik harf, so'zlar chiziqcha bilan; o'zbek apostrofi ruxsat; 50 belgigacha (Umami)
const NOM_RE = /^[a-z0-9'\u02BB\u2019]+(-[a-z0-9'\u02BB\u2019]+)*$/;
const qadamTekshir = (q) => {
  const h = String(q.hodisa || '').trim();
  const bor = String(q.asosiy || '').trim() && String(q.oldingi || '').trim() && h;
  if (/ochdi/i.test(h) || /ochdi/i.test(String(q.oldingi || ''))) return { ok: false, xato: { uz: 'Sahifa ochilishi avtomatik yoziladi — boshqa qadamni yozing.', ru: 'Открытие страницы пишется автоматически — напишите другой шаг.' } };
  if (h && (!NOM_RE.test(h) || h.length > 50)) return { ok: false, xato: { uz: 'Nomni kichik harf va chiziqcha bilan yozing.', ru: 'Пишите имя маленькими буквами через дефис.' } };
  return { ok: !!bor, xato: null };
};
const QADAM_MAYDON = [
  { id: 'asosiy', l: { uz: 'Bosh raqam', ru: 'Главное число' }, max: 80 },
  { id: 'oldingi', l: { uz: "O'rtadagi qadam", ru: 'Средний шаг' }, max: 80 },
  { id: 'hodisa', l: { uz: 'Hodisa nomi', ru: 'Имя события' }, max: 50, mono: true }
];
const QadamForma = ({ qiymat, onYoz, tola }) => {
  const m = muammoOqi();
  return (
    <span className="ad-qf" data-tola={tola ? '1' : '0'}>
      {m && <span className="ad-qf-kirish">{tr({ uz: 'Muammoingiz', ru: 'Ваша проблема' })}: {[m.kim, m.nima].filter(Boolean).join(' — ')}</span>}
      {QADAM_MAYDON.map(f => (
        <label key={f.id} className="ad-qf-q">
          <span className="ad-qf-l">{tr(f.l)}:</span>
          <input type="text" maxLength={f.max} className={f.mono ? 'mono' : undefined} value={qiymat[f.id] || ''} placeholder="…" onChange={e => onYoz(f.id, e.target.value)} />
        </label>
      ))}
    </span>
  );
};
// O'z g'oyasi prompti — qavslar forma qiymati bilan to'ladi (bo'sh bo'lsa {…} qoladi)
const goyaPrompt = (q) => {
  const o = String(q.oldingi || '').trim(); const h = String(q.hodisa || '').trim();
  return [
    { uz: `Saytda ${o || "{o'rtadagi qadam}"} tugmasi bosilganda Umami'ga ${h || '{hodisa nomi}'} hodisasi yozilsin.`, ru: `Когда на сайте нажимают кнопку ${o || '{средний шаг}'}, пусть в Umami записывается событие ${h || '{имя события}'}.` },
    { uz: 'Umami yuklanmasa ham tugma ishlayversin; boshqa tugmalar o\'zgarmasin.', ru: 'Даже если Umami не загрузился, кнопка пусть работает; другие кнопки не меняй.' }
  ];
};
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda = [], doneText }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const formaN = steps.findIndex(c => c.forma);
  const [qadam, setQadam] = useState(() => ({ ...QADAM_BOSH, ...(qadamOqi() || {}), ...((storedAnswer && storedAnswer.qadamlar) || {}) }));
  const tek = qadamTekshir(qadam);
  const done = stepN >= steps.length;
  const qadamYoz1 = (id, v) => {
    const q = { ...qadam, [id]: v }; setQadam(q);
    if (qadamTekshir(q).ok) qadamYoz(q);
    if (!avval) onAnswer(screen, { ...(storedAnswer || {}), qadamlar: q });
  };
  const bajardim = () => {
    if (isMentorLive || done) return;
    if (stepN === formaN && !tek.ok) return; // 5-qadam: forma to'g'ri to'lmaguncha «Bajardim» yopiq
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      if (formaN >= 0) qadamYoz(qadam);
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, ...(formaN >= 0 ? { qadamlar: qadam } : {}) });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  // Yangi ochilgan qadam (uzun prompt, 5-qadam formasi) «Bajardim»i bilan birga ko'rinsin — kompyuterda ham (telefonda Stage o'zi suradi)
  const birinchiRef = useRef(true);
  useEffect(() => {
    if (birinchiRef.current) { birinchiRef.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? NAV_DAVOM : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: c.forma ? <>{fmtCode(tr(c.t))}<QadamForma qiymat={qadam} onYoz={qadamYoz1} tola={tek.ok} /></> : fmtCode(tr(c.t)),
          prompt: c.forma ? goyaPrompt(qadam).map(l => tr(l)) : (c.prompt && c.prompt.map(l => tr(l))),
          kimga: (c.prompt || c.forma) && tr(c.kimga || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }),
          xato: c.forma ? (tek.xato && <span className="ad-qf-xato" role="status">{tr(tek.xato)}</span>) : (c.err && fmtCode(tr(c.err)))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortda}
        pastki={<MentorPracticeStats live={_live} screen={screen} />} />
    </Stage>
  );
}
const ORTDA_FETCH = 'git fetch https://github.com/Azizbekcrypto/maydon --tags';
const XATO_YOLI = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon', ru: 'ожидаемый результат · образец: Maydon' };
const QADAM_OCHISH = { uz: 'Ochish', ru: 'Открыть' };
const QADAM_PROMPT = { uz: 'Prompt', ru: 'Промпт' };
const QADAM_ISHGA = { uz: 'Ishga tushirish', ru: 'Запуск' };
const QADAM_GOYA = { uz: "O'z g'oyangiz", ru: 'Ваша идея' };
// A1 prompti — 2 va 5-qadamda bitta manba
const A1_PROMPT = [
  { uz: "web/index.html ning <head> qismiga Umami skriptini qo'sh: {Umami bergan skript}.", ru: 'Добавь скрипт Umami в <head> файла web/index.html: {скрипт от Umami}.' },
  { uz: "Skriptda data-website-id=\"%VITE_UMAMI_ID%\" bo'lsin — qiymat web/.env dagi VITE_UMAMI_ID dan keladi; web/.env.example ga bo'sh VITE_UMAMI_ID= qatorini qo'sh.", ru: 'В скрипте должно быть data-website-id="%VITE_UMAMI_ID%" — значение берётся из VITE_UMAMI_ID в web/.env; в web/.env.example добавь пустую строку VITE_UMAMI_ID=.' },
  { uz: "Kataklar va animatsiyalar o'zgarmasin.", ru: 'Ячейки и анимации не меняй.' }
];
// Blok o'ngi: Umami maketi + ostida panelning 1 (A1) yoki 1–2 (A2) ustuni — bitta manba (UMAMI → umamiUstun)
const BlokNatija = ({ m, ustun, children }) => (
  <div className="ad-blok-n">
    <UmamiMock m={m} />
    <MaydonPanel kichik toxtagan={false} ustunSoni={ustun} sonlar={umamiUstun(m)} />
    {children}
  </div>
);

const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · Umami', ru: 'Практика 1 · Umami' }}
    title={{ uz: <>«Maydon» har ochilishni <span className="italic" style={{ color: T.accent }}>Umami'ga yozsin</span>.</>, ru: <>Пусть «Maydon» <span className="italic" style={{ color: T.accent }}>записывает в Umami</span> каждое открытие.</> }}
    mentor={{ uz: <>Birinchi odam kelishidan oldin ulaymiz, uning izi ham qolsin; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Подключаем до прихода первого человека, чтобы и его след остался; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "`cloud.umami.is` da ro'yxatdan o'ting (ism, email, parol). «Websites» → «Add website»: Name — `Maydon`, Domain — `localhost` → «Save». «Maydon» yonidagi «Edit» → «Tracking code»: Umami bergan bir qator kodni — skriptni — nusxalang.", ru: 'Зарегистрируйтесь на `cloud.umami.is` (имя, email, пароль). «Websites» → «Add website»: Name — `Maydon`, Domain — `localhost` → «Save». Рядом с «Maydon» — «Edit» → «Tracking code»: скопируйте одну строку кода от Umami — скрипт.' } },
      { h: QADAM_PROMPT, t: { uz: "Antigravity'da `maydon` papkasini oching. Qavs ichiga skriptni qo'ying, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'Откройте папку `maydon` в Antigravity. Вставьте скрипт в скобки, нажмите «Скопировать», отправьте в Antigravity:' }, prompt: A1_PROMPT },
      { h: QADAM_ISHGA, t: { uz: "`web/.env` da `VITE_UMAMI_ID=` dan keyin qiymat turibdi. Bu ID maxfiy emas — `.env` da turishining sababi: u har o'quvchida boshqa. Terminalda `cd web`, keyin `npm run dev`.", ru: 'В `web/.env` после `VITE_UMAMI_ID=` стоит значение. Этот ID не секретный — он лежит в `.env`, потому что у каждого ученика свой. В терминале `cd web`, потом `npm run dev`.' }, err: XATO_YOLI },
      { h: { uz: "Umami'da tekshirish", ru: 'Проверка в Umami' }, t: { uz: "brauzerda `localhost:5173` ni oching. Umami'da «Maydon» sahifasida «Views» (sahifa ochilishlari) soni oshdi.", ru: 'откройте в браузере `localhost:5173`. В Umami на странице «Maydon» число «Views» (открытия страницы) выросло.' }, err: { uz: "0 qolsa — brauzerdagi reklama to'sgich (AdBlock kabi) skriptni to'smaganini tekshiring: shu sahifa uchun o'chirib, sahifani yangilang.", ru: 'Если осталось 0 — проверьте, не закрыл ли скрипт блокировщик рекламы (вроде AdBlock): отключите его для этой страницы и обновите её.' } },
      { h: QADAM_GOYA, t: { uz: "Umami'da «Add website» bilan loyihangiz uchun yana bitta sayt qo'shing. Uning skriptini shu promptning qavsiga qo'yib, «Nusxalash» — promptni saqlab qo'ying, uyda o'z loyihangizga yuborasiz.", ru: 'В Umami через «Add website» добавьте ещё один сайт — для вашего проекта. Вставьте его скрипт в скобки этого промпта, «Скопировать» — сохраните промпт, дома отправите для своего проекта.' }, prompt: A1_PROMPT }
    ]}
    natija={<BlokNatija m={UMAMI.a1} ustun={1} />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-06-start']}
    doneText={{ uz: "«Maydon» ochilishi Umami'ga yozildi — birinchi odam kelsa, u ham yoziladi.", ru: 'Открытие «Maydon» записалось в Umami — придёт первый человек, запишется и он.' }} />
);

const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · hodisa', ru: 'Практика 2 · событие' }}
    title={{ uz: <>Vaqt tanlash ham <span className="italic" style={{ color: T.accent }}>Umami'ga yozilsin</span>.</>, ru: <>Пусть выбор времени тоже <span className="italic" style={{ color: T.accent }}>записывается в Umami</span>.</> }}
    mentor={{ uz: <>Vaqt katagiga nom beramiz — shunda har tanlov sanaladi; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Дадим ячейке времени имя — тогда каждый выбор будет посчитан; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "terminalda `npm run dev` ishlayapti, Umami'da «Maydon» ochiq.", ru: 'в терминале работает `npm run dev`, в Umami открыт «Maydon».' } },
      { h: QADAM_PROMPT, t: { uz: "«Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'нажмите «Скопировать» и отправьте в Antigravity:' }, prompt: [
        { uz: "web/ dagi vaqt katagi: bo'sh katak bosilganda Umami'ga vaqt-tanladi hodisasi yozilsin.", ru: 'Ячейка времени в web/: при нажатии свободной ячейки пусть в Umami записывается событие vaqt-tanladi.' },
        { uz: 'Band katak bosilganda hodisa yozilmasin.', ru: 'При нажатии занятой ячейки событие не записывай.' },
        { uz: "Umami yuklanmasa ham katak ishlayversin; animatsiyalar o'zgarmasin.", ru: 'Даже если Umami не загрузился, ячейка пусть работает; анимации не меняй.' }
      ] },
      { h: QADAM_ISHGA, t: { uz: "sayt o'zi yangilandi, terminalda xato yo'q.", ru: 'сайт обновился сам, в терминале нет ошибок.' }, err: XATO_YOLI },
      { h: { uz: 'Sherigingiz bilan tekshirish', ru: 'Проверка с напарником' }, t: { uz: "sherigingiz kompyuteringizda «Maydon»ni ochib, bitta bo'sh vaqtni tanlasin. Umami'da «Events» (hodisalar) bo'limida `vaqt-tanladi` — 1. Band katakni bosing — son o'zgarmaydi.", ru: 'пусть напарник откроет «Maydon» на вашем компьютере и выберет одно свободное время. В Umami в разделе «Events» (события) `vaqt-tanladi` — 1. Нажмите занятую ячейку — число не меняется.' } },
      { h: QADAM_GOYA, t: { uz: "loyihangizda odam qaysi uch qadamni bosib o'tadi? Oxiridan boshlang: odam nima qilsa, loyihangiz o'z ishini bajargan bo'ladi — bu darsda shuni bosh raqam deb olamiz. O'rtadagi qadamni va uning hodisa nomini (kichik harf, so'zlar chiziqcha bilan, 50 belgigacha) qavslarga yozing, «Nusxalash» — uyda yuborasiz.", ru: 'какие три шага проходит человек в вашем проекте? Начните с конца: что человек делает, когда ваш проект выполнил свою работу — на этом уроке это главное число. Средний шаг и имя его события (маленькие буквы, слова через дефис, до 50 символов) впишите в скобки, «Скопировать» — отправите дома.' }, forma: true }
    ]}
    natija={(
      <BlokNatija m={UMAMI.a2} ustun={2}>
        <QIzoh>{tr({ uz: "Real Umami'da sonlar har xil sanaladi: ochilish, bosish, Database'dagi band. Ularni ayirmang — pasayishni ko'ring.", ru: 'В настоящем Umami числа считаются по-разному: открытие, нажатие, бронь в Database. Не вычитайте их — смотрите на падение.' })}</QIzoh>
      </BlokNatija>
    )} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-06-done', <span key="env" className="ad-ortda-iz">— <code>web/.env</code> {tr({ uz: "o'zgarmaydi", ru: 'не меняется' })}</span>]}
    doneText={{ uz: "Endi birinchi odamning ikki qadami ko'rinadi: saytni ochdi va vaqtni tanladi.", ru: 'Теперь видны два шага первого человека: открыл сайт и выбрал время.' }} />
);

// ===== SCREEN 8 — 2-SAVOL, yakuniy (QuestionScreen → QTest; INLINE_KEYS.s8 = 1 — B; savol ustida kichik UmamiMock — UMAMI.s8) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Ochilish yozilyapti, vaqt tanlash — yo'q. Nimani tekshirasiz?"
    question={tr({ uz: <><UmamiMock m={UMAMI.s8} kichik /><h2 className="title h-ask" style={{ marginTop: 12 }}>Ochilish yozilyapti, vaqt tanlash — yo'q. <span className="italic" style={{ color: T.accent }}>Nimani tekshirasiz?</span></h2></>, ru: <><UmamiMock m={UMAMI.s8} kichik /><h2 className="title h-ask" style={{ marginTop: 12 }}>Открытия пишутся, выбор времени — нет. <span className="italic" style={{ color: T.accent }}>Что проверите?</span></h2></> })}
    options={[
      { uz: 'Umami skripti `<head>` da turganini', ru: 'Что скрипт Umami стоит в `<head>`' },
      { uz: 'Katakda hodisa nomi borligini', ru: 'Что на ячейке есть имя события' },
      { uz: "Reklama to'sgichi o'chiqligini", ru: 'Что блокировщик рекламы выключен' },
      { uz: 'Band qilish tugmasi borligini', ru: 'Что есть кнопка брони' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Ochilish yozilyapti — skript ishlayapti; demak hodisa nomi yetmaydi.', ru: 'Открытия пишутся — скрипт работает; значит, не хватает имени события.' }}
    explainWrong={{
      0: { uz: 'Skript bo\'lmasa, ochilish ham yozilmasdi.', ru: 'Без скрипта не писались бы и открытия.' },
      2: { uz: "To'sgich ishlasa, ochilish ham yozilmasdi.", ru: 'Если бы блокировщик работал, не писались бы и открытия.' },
      3: { uz: 'Vaqt tanlash band qilishdan oldin — tugma bu yerda emas.', ru: 'Выбор времени идёт до брони — дело не в кнопке.' },
      default: { uz: "Nima yozilyapti, nima yo'q — shuni solishtiring.", ru: 'Сравните, что пишется, а что нет.' }
    }} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran sflash (F-1005-88), qolipdagi QKartochka (DE-204). Orqa — oddiy matn; old va izoh — fmtCode.
const KARTALAR = [
  { front: { uz: 'Analitika nima?', ru: 'Что такое аналитика?' }, back: { uz: 'Odamlar saytda nima qilganini yozib, sanab beradigan asbob', ru: 'Инструмент, который записывает и считает, что люди делали на сайте' }, note: { uz: 'Masalan, Umami', ru: 'Например, Umami' } },
  { front: { uz: 'Hodisa nima?', ru: 'Что такое событие?' }, back: { uz: 'Analitikaga yoziladigan bitta harakat', ru: 'Одно действие, которое записывается в аналитику' }, note: { uz: 'Masalan, `vaqt-tanladi`', ru: 'Например, `vaqt-tanladi`' } },
  { front: { uz: '«Maydon»ning uch qadami qaysi?', ru: 'Какие три шага у «Maydon»?' }, back: { uz: 'Saytni ochdi → Vaqtni tanladi → Band qildi', ru: 'Открыл сайт → Выбрал время → Забронировал' }, note: { uz: 'Bu darsda oxirgisi — bosh raqam', ru: 'На этом уроке последний — главное число' } },
  { front: { uz: 'Qadamlar sonidan nimani bilasiz?', ru: 'Что вы узнаёте из числа на шагах?' }, back: { uz: 'Qayerda katta pasayish borligini', ru: 'Где большое падение' }, note: { uz: 'Bu — belgi, sabab emas (real sonlar har xil sanaladi)', ru: 'Это признак, а не причина (настоящие числа считаются по-разному)' } },
  { front: { uz: 'Bizning MVP da analitika nega birinchi odamdan oldin ulanadi?', ru: 'Почему в нашем MVP аналитику подключают до первого человека?' }, back: { uz: 'U ulangan kundan boshlab yozadi', ru: 'Она пишет с дня подключения' }, note: { uz: 'Oldingi odamlarning izi qolmaydi', ru: 'От людей до этого следа не останется' } },
  { front: { uz: "Analitikasiz kunda nima ma'lum?", ru: 'Что известно о дне без аналитики?' }, back: { uz: "Faqat Database'dagi bandlar", ru: 'Только брони в Database' }, note: { uz: "To'xtab ketganlar hech qayerda yo'q", ru: 'Тех, кто остановился и ушёл, нигде нет' } },
  { front: { uz: 'Sayt ochilishini kim yozadi?', ru: 'Кто записывает открытие сайта?' }, back: { uz: "Umami skripti o'zi", ru: 'Сам скрипт Umami' }, note: { uz: 'Nom berish shart emas', ru: 'Имя давать не нужно' } },
  { front: { uz: 'Vaqt tanlashni Umami qanday biladi?', ru: 'Как Umami узнаёт о выборе времени?' }, back: { uz: 'Katakdagi hodisa nomidan', ru: 'По имени события на ячейке' }, note: { uz: '`data-umami-event="vaqt-tanladi"`', ru: '`data-umami-event="vaqt-tanladi"`' } },
  { front: { uz: 'Website ID maxfiymi?', ru: 'Website ID — секрет?' }, back: { uz: "Yo'q — u sahifa kodida ochiq turadi", ru: 'Нет — он открыто стоит в коде страницы' }, note: { uz: '`web/.env` da turadi, chunki har kimniki boshqa', ru: 'Лежит в `web/.env`, потому что у каждого свой' } },
  { front: { uz: "O'lchagich va analitika — farqi nima?", ru: 'Чем отличаются измеритель и аналитика?' }, back: { uz: "O'lchagich sayt ochilyaptimi, shuni o'lchaydi; analitika odam nima qilganini yozadi", ru: 'Измеритель меряет, открывается ли сайт; аналитика пишет, что сделал человек' }, note: { uz: 'Ikkalasi ham sizsiz ishlaydi', ru: 'Оба работают без вас' } },
  { front: { uz: "Umami'da hech narsa chiqmasa, avval nima qilasiz?", ru: 'Если в Umami ничего нет, что сделаете сначала?' }, back: { uz: "Reklama to'sgichini shu sahifa uchun o'chirasiz", ru: 'Отключите блокировщик рекламы для этой страницы' }, note: { uz: "Reklama to'sgich skriptni to'sishi mumkin", ru: 'Блокировщик рекламы может закрыть скрипт' } },
  { front: { uz: "Analitika odam nega to'xtaganini aytadimi?", ru: 'Говорит ли аналитика, почему человек остановился?' }, back: { uz: "Yo'q — qaysi qadamda to'xtaganini aytadi", ru: 'Нет — она говорит, на каком шаге он остановился' }, note: { uz: "Sababni odamning o'zini ko'rib topasiz", ru: 'Причину находите, глядя на самого человека' } }
];

// ===== KARTOCHKALAR — alohida ekran (F-1005-88, SABOQ 12); Mentor yo'q (KORPUS §61, SABOQ 16); birinchi bosishgacha karta yuzi halqada + yorliq =====
// Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi — root'dagi FLASH_IDX / flashHidden.
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={kl('ad-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: fmtCode(tr(c.front)), back: tr(c.back), note: c.note && fmtCode(tr(c.note)) }))} />
          {!bosildi && <p className="ad-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «kim uchun · nechta · muddat» + raqamli qadamlar; GATE M M-q9 — alohida .homework.jsx YO'Q) =====
// A2 5-qadamida saqlangan qadam bo'lsa (pm-m7d6-qadamlar) — kartada o'sha prompt qatori (banner)
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z loyihangiz", ru: 'ваш проект' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '1 hodisa', ru: '1 событие' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: 'Loyihangiz sahifasiga Umami skriptini ulang — Amaliyot 1 da saqlagan prompt bilan.', ru: 'Подключите скрипт Umami к странице вашего проекта — промптом, сохранённым в Практике 1.' },
  { uz: "Uch qadamingizdagi o'rtadagi qadamga hodisa qo'shing — Amaliyot 2 da saqlagan prompt bilan.", ru: 'Добавьте событие на средний из ваших трёх шагов — промптом, сохранённым в Практике 2.' },
  { uz: "Uydagi bir odam saytingizda o'sha tugmani bossin — «Events»da hodisa paydo bo'lsin.", ru: 'Пусть кто-то дома нажмёт эту кнопку на вашем сайте — в «Events» появится событие.' }
];
const HwCard = ({ keyingi }) => {
  const q = qadamOqi();
  const banner = q && qadamTekshir(q).ok ? tr(goyaPrompt(q)[0]) : null;
  return (
    <div className="card ad-hw fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      <div className="ad-hw-karta">
        {HW_KARTA.map((r, i) => <div key={i} className="ad-hw-q"><span className="ad-hw-k">{tr(r.k)}</span><span className="ad-hw-v">{tr(r.v)}</span></div>)}
      </div>
      {banner && <p className="ad-hw-banner">{banner}</p>}
      <ol className="ad-hw-qadam">{HW_QADAM.map((h, i) => <li key={i}><i>{i + 1}</i><span>{tr(h)}</span></li>)}</ol>
      {keyingi && <span className="ad-hw-keyingi">{keyingi}</span>}
    </div>
  );
};

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Bugungi asosiy fikr» (P-013, kartochkaga qo'shilmaydi) + PM HwCard; kartochkalar alohida ekranda (F-1005-88). CODE STRIKE va arena — darsda =====
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
  // «Endi siz bilasiz» — A-3 ta'riflari so'zma-so'z (T-042)
  const RECAP = [
    { uz: 'Analitika odamlar saytda nima qilganini yozib, sanab beradi.', ru: 'Аналитика записывает и считает, что люди делали на сайте.' },
    { uz: 'Analitika ulangan kundan boshlab yozadi — bizning MVP da u birinchi odamdan oldin ulanadi.', ru: 'Аналитика пишет с дня подключения — в нашем MVP её подключают до первого человека.' },
    { uz: "Qadamlar sonini solishtirib, qayerda katta pasayish borligini ko'rasiz — bu belgi, sabab emas.", ru: 'Сравнивая числа на шагах, вы видите, где большое падение, — это признак, а не причина.' },
    { uz: "Sahifa ochilishini Umami avtomatik yozadi; boshqa harakat — siz nom bergan hodisa.", ru: 'Открытие страницы Umami пишет автоматически; другое действие — событие, которому имя даёте вы.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: MVP — birinchi ekran»</b>. Talabni siz yozasiz, agent birinchi ekranni quradi. Umami bugundan uning har ochilishini yozadi.</>, ru: <>Следующий урок — <b>«День проекта: MVP — первый экран»</b>. Требование пишете вы, агент строит первый экран. С сегодняшнего дня Umami записывает каждое его открытие.</> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Analitika tayyor: <span className="italic" style={{ color: T.accent }}>birinchi foydalanish ham yoziladi</span>.</>, ru: <>Аналитика готова: <span className="italic" style={{ color: T.accent }}>первое использование тоже запишется</span>.</> })}
        cta={<>
          <div className="ad-fikr fade-up d1"><span className="ad-fikr-l">{tr({ uz: 'Bugungi asosiy fikr —', ru: 'Главная мысль дня —' })}</span><p className="ad-fikr-t small">{tr({ uz: 'Bizning MVP da analitika birinchi odamdan oldin ulanadi — shunda qaysi qadamdan keyin son keskin kamayganini ko\'rasiz.', ru: 'В нашем MVP аналитику подключают до первого человека — тогда вы видите, после какого шага число резко упало.' })}</p></div>
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
export default function PmAnalyticsDayOneLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — Maydon paneli, telefon, Umami maketi (.ad-). Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .ad-panel { --ad-or: 52px; container-type: inline-size; display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px; padding: 14px; min-width: 0; box-shadow: 0 10px 26px -18px rgba(${T.shadowBase},0.35); }
        .ad-panel.kichik { --ad-or: 34px; padding: 10px 12px; box-shadow: none; }
        .ad-panel-q { display: flex; gap: 14px; align-items: stretch; min-width: 0; }
        .ad-tel { flex: 0 0 172px; display: flex; flex-direction: column; align-items: center; gap: 6px; transition: opacity .35s, filter .35s; }
        .ad-tel.chiqdi { opacity: 0.38; filter: grayscale(1); }
        .ad-tel-ekran { width: 100%; display: flex; flex-direction: column; gap: 8px; background: ${T.bg}; border: 2px solid ${T.ink}; border-radius: 22px; padding: 12px 10px 14px; position: relative; overflow: hidden; }
        .ad-tel-ekran::before { content: ''; align-self: center; width: 46px; height: 5px; border-radius: 99px; background: ${T.line}; }
        .ad-tel-bosh { display: flex; align-items: baseline; gap: 5px; font-size: 13px; color: ${T.ink2}; position: relative; }
        .ad-tel-bosh b { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; color: ${T.accent}; }
        .ad-tel-odam { position: absolute; right: 0; top: -17px; width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; animation: ad-odam-kir .5s ease-out both; }
        @keyframes ad-odam-kir { from { opacity: 0; transform: translateX(-60px) scale(.6); } 70% { opacity: 1; } to { opacity: 1; transform: none; } }
        .ad-tel-nom { display: block; font-family: 'JetBrains Mono', monospace; font-size: 10px; line-height: 1.35; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 6px; padding: 4px 6px; overflow-wrap: anywhere; }
        .ad-tel-kataklar { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; }
        .ad-katak { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; min-height: 36px; padding: 5px 4px; border-radius: 9px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12.5px; cursor: pointer; transition: transform .16s ease, background .3s, border-color .3s, color .3s; }
        .ad-katak:disabled { cursor: default; }
        .ad-katak small { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 9.5px; line-height: 1; }
        .ad-katak.band { background: ${T.ink}; border-color: ${T.ink}; color: ${T.paper}; }
        .ad-katak.tanlangan { background: ${T.accent}; border-color: ${T.accent}; color: ${T.paper}; }
        .ad-katak.bos { transform: scale(.88); }
        .ad-katak.nomli { border-style: dashed; border-color: ${T.accent}; }
        .ad-tel-band { align-self: stretch; text-align: center; font-weight: 700; font-size: 12px; color: ${T.ink2}; border: 1.5px dashed ${T.line}; border-radius: 9px; padding: 6px; }
        .ad-chiq { width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 17px; line-height: 1; cursor: pointer; }
        .ad-chiq:disabled { cursor: default; opacity: .55; }
        .ad-ustunlar { flex: 1; min-width: 0; display: grid; grid-template-rows: minmax(0,1fr) auto; column-gap: 4px; row-gap: 6px; position: relative; }
        .ad-ustun { display: flex; flex-direction: column; gap: 6px; min-width: 0; padding: 10px 10px 12px; border-radius: 12px; background: ${T.bg}; border: 1.5px solid ${T.line}; transition: border-color .3s, background .3s; }
        .ad-ustun.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .ad-ustun.milt { animation: ad-milt .9s ease-out 1; }
        @keyframes ad-milt { 30% { background: ${T.paper}; border-color: ${T.ink2}; } 60% { background: ${T.bg}; } }
        .ad-ustun-n { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; line-height: 1.25; letter-spacing: .04em; text-transform: uppercase; color: ${T.ink2}; }
        .ad-son { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px,3.2vw,34px); line-height: 1; color: ${T.ink}; }
        .ad-ustun.yoq .ad-son { color: ${T.ink2}; opacity: .55; }
        .ad-son.yangi { animation: ad-son .34s cubic-bezier(.3,1.5,.5,1); }
        @keyframes ad-son { from { transform: scale(1.3); color: ${T.accent}; } }
        .ad-belgilar { display: flex; flex-wrap: wrap; gap: 4px; }
        .ad-odam { display: block; width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; animation: ad-odam .35s ease-out both; }
        .ad-odam.qoldi { background: ${T.line}; box-shadow: inset 0 0 0 1.5px ${T.ink2}; opacity: .7; }
        .ad-odam.yon { animation: ad-yon .5s ease-in-out 3; }
        .ad-odam.ochadi { animation: ad-ochadi .9s ease-in forwards; }
        @keyframes ad-odam { from { opacity: 0; transform: translateX(-14px) scale(.5); } }
        @keyframes ad-yon { 50% { background: ${T.err}; box-shadow: 0 0 0 3px ${fon(T.err, 0.25)}; opacity: 1; } }
        @keyframes ad-ochadi { 0% { opacity: .8; } 100% { opacity: 0; transform: scale(.3); } }
        .ad-ostki { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; min-width: 0; }
        .ad-db { font-size: 11px; font-weight: 600; color: ${T.ink2}; }
        .ad-ost { font-size: 11.5px; font-weight: 700; line-height: 1.3; }
        .ad-ost.ok { color: ${T.ok}; }
        .ad-ost.kod { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 11px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 6px; padding: 2px 6px; }
        .ad-ost.qulf { font-weight: 600; color: ${T.ink2}; border: 1px dashed ${T.line}; border-radius: 6px; padding: 2px 6px; }
        .ad-ost-g { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
        .ad-ramka { border: 2px dashed ${T.accent}; border-radius: 14px; margin: -5px; pointer-events: none; z-index: 1; }
        .ad-oraliq { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; min-width: 0; padding: 4px 2px; border: none; border-radius: 10px; background: transparent; color: ${T.ink2}; font-family: 'Manrope', sans-serif; cursor: pointer; }
        .ad-oraliq:disabled { cursor: default; }
        .ad-oraliq-o { font-size: 18px; font-weight: 700; line-height: 1; }
        .ad-oraliq.qizil { background: ${T.errFon}; color: ${T.err}; box-shadow: inset 0 0 0 2px ${T.err}; }
        .ad-oraliq.korildi { background: ${T.bg}; }
        .ad-oraliq.silk { animation: ad-silk .38s ease-in-out; }
        @keyframes ad-silk { 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        .ad-oraliq-l { font-size: 11px; font-weight: 800; line-height: 1.2; text-align: center; }
        .ad-tasma { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 6px; }
        .ad-kun { display: flex; flex-direction: column; gap: 2px; min-height: 46px; padding: 6px 8px; border-radius: 10px; }
        .ad-kun.yoz { background: ${T.bg}; border: 1.5px solid ${T.line}; }
        .ad-kun.bosh { border: 1.5px dashed ${T.line}; }
        .ad-kun.joriy { border-color: ${T.accent}; }
        .ad-kun-n { font-size: 11.5px; font-weight: 800; color: ${T.ink}; }
        .ad-kun-s { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: ${T.ink2}; }
        .ad-um { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .ad-um-bar { display: flex; align-items: center; gap: 5px; padding: 7px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .ad-um-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; }
        .ad-um-bar span { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .ad-um-tana { display: flex; flex-direction: column; gap: 10px; padding: 12px; }
        .ad-um-sayt { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .ad-um-metrik { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .ad-um-m { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 9px; background: ${T.bg}; }
        .ad-um-k { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .ad-um-v { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; color: ${T.ink}; }
        .ad-um-ev { display: flex; flex-direction: column; gap: 6px; }
        .ad-um-er { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 7px 10px; border-radius: 9px; background: ${T.bg}; }
        .ad-um-er code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${T.accent}; }
        .ad-um-er b { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: ${T.ink}; }
        .ad-um.kichik { max-width: 360px; }
        .ad-um.kichik .ad-um-tana { flex-direction: row; flex-wrap: wrap; align-items: stretch; gap: 8px; padding: 10px; }
        .ad-um.kichik .ad-um-sayt { flex-basis: 100%; font-size: 13px; }
        .ad-um.kichik .ad-um-metrik { grid-template-columns: minmax(0,1fr); flex: 0 0 auto; }
        .ad-um.kichik .ad-um-ev { flex: 1; min-width: 160px; }
        .ad-blok-n { display: flex; flex-direction: column; gap: 10px; }
        .ad-hook { display: flex; flex-direction: column; min-width: 0; }
        p.ad-repo { margin: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; color: ${T.ink2}; }
        .ad-harakat { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
        .ad-harakat.ad-ulash { flex-direction: row; flex-wrap: wrap; }
        .q-btn.ad-on { background: ${T.accentSoft}; border-color: ${T.accent}; color: ${T.accent}; }
        .ad-natija { display: flex; flex-direction: column; gap: 8px; }
        p.ad-joriy { margin: 0; font-size: clamp(14px,1.6vw,15.5px); line-height: 1.5; color: ${T.ink}; padding: 10px 14px; border-radius: 12px; background: ${T.accentSoft}; }
        .ad-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; animation: fade-step 0.3s ease-out; }
        .ad-taxmin-s { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .ad-taxmin-j { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.accent}; background: ${T.accentSoft}; border: 1.5px solid ${T.accent}; border-radius: 9px; padding: 3px 11px; }
        /* SABOQ 11 (F-1005-85/87): navbatdagi bosiladigan element — halqa + yengil puls */
        .ad-navbat { box-shadow: 0 0 0 2px ${T.accent}; animation: ad-navbat 1.6s ease-out infinite; }
        @keyframes ad-navbat { 0% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 2px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 12px ${fon(T.accent, 0)}; } }
        .ad-navbat-k > .q-bashorat { box-shadow: 0 0 0 2px ${T.accent}; animation: ad-navbat 1.6s ease-out infinite; }
        .q-kirish:has(.ad-hook.tanla) .q-variantlar-kol { border-radius: 14px; box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}; animation: ad-navbat-g 1.6s ease-out infinite; }
        @keyframes ad-navbat-g { 0% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 9px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 19px ${fon(T.accent, 0)}; } }
        .ad-saralash { display: flex; flex-direction: column; gap: 8px; }
        .ad-sar-q { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.1fr) minmax(0,1fr); gap: 12px; align-items: stretch; }
        .ad-tomon { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; min-height: 92px; padding: 12px 14px; border-radius: 14px; border: 1.5px dashed ${T.ink2}; background: ${T.bg}; color: ${T.ink}; font-family: 'Manrope', sans-serif; text-align: left; cursor: pointer; }
        .ad-tomon:disabled { cursor: default; border-style: solid; border-color: ${T.line}; }
        .ad-tomon-l { font-weight: 800; font-size: 14px; }
        .ad-tomon-k { display: flex; flex-wrap: wrap; gap: 6px; }
        .ad-tomon-chip { font-weight: 700; font-size: 12.5px; color: ${T.ok}; background: ${T.okFon}; border-radius: 8px; padding: 4px 9px; }
        .ad-kq { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 14px; border-radius: 16px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 12px 26px -16px rgba(${T.shadowBase},0.45); cursor: grab; animation: fade-step .3s ease-out; }
        .ad-kq.silk { animation: ad-silk .38s ease-in-out; }
        .ad-kq-t { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(18px,2.2vw,22px); color: ${T.ink}; text-align: center; }
        .ad-qf { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .ad-qf-xato { color: ${T.err}; font-weight: 700; }
        .ad-qf-kirish { display: block; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 6px 10px; }
        .ad-qf-q { display: grid; grid-template-columns: 132px minmax(0,1fr); align-items: center; gap: 8px; }
        .ad-qf-l { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; line-height: 1.3; color: ${T.ink2}; }
        .ad-qf input { display: block; width: 100%; font-family: 'Manrope', sans-serif; font-size: 13.5px; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 7px 10px; }
        .ad-qf input.mono { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
        .ad-qf input:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .q-blok-q.joriy:has(.ad-qf[data-tola="0"]) > .q-blok-tana > .q-btn { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
        .q-blok-buyruq:has(.ad-ortda-iz) { background: transparent; border: none; box-shadow: none; padding: 0; }
        .ad-ortda-iz { font-family: 'Manrope', sans-serif; font-size: 12px; color: ${T.ink2}; }
        .ad-ortda-iz code { font-family: 'JetBrains Mono', monospace; }
        .ad-rc-kod { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.4; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 8px; padding: 6px 10px; overflow-wrap: anywhere; }
        p.rc-body:empty { display: none; }
        .ad-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: ad-navbat-fc 1.6s ease-out infinite; }
        @keyframes ad-navbat-fc { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        p.ad-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .ad-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: ad-fc-nuqta 1.4s ease-in-out 3; }
        @keyframes ad-fc-nuqta { 50% { transform: scale(1.6); opacity: .4; } }
        .ad-hw { display: flex; flex-direction: column; gap: 12px; }
        .ad-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .ad-hw-q { display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .ad-hw-k { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .ad-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; line-height: 1.35; }
        p.ad-hw-banner { margin: 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 10px; padding: 8px 12px; }
        .ad-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .ad-hw-qadam li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .ad-hw-qadam li i { flex: 0 0 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; }
        .ad-hw-keyingi { font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .ad-fikr { display: flex; flex-direction: column; gap: 3px; align-items: center; text-align: center; background: ${T.paper}; border-radius: 16px; padding: 10px 20px 14px; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .ad-fikr-l { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; line-height: 1.2; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.ad-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        /* Tor panel (yarim ustun — Kirish, Reja; telefon): telefon kichrayadi, juda torida ustunlar ostiga tushadi */
        @container (max-width: 600px) {
          .ad-tel { flex-basis: 136px; }
          .ad-tel-ekran { padding: 10px 8px 12px; border-radius: 18px; }
          .ad-katak { min-height: 32px; font-size: 11.5px; }
          .ad-ustunlar { --ad-or: 26px; }
          .ad-ustun { padding: 8px 6px 10px; }
          .ad-ustun-n { font-size: 9.5px; letter-spacing: 0; }
          .ad-son { font-size: 24px; }
          .ad-odam { width: 8px; height: 8px; }
          .ad-db, .ad-ost { font-size: 10px; }
          .ad-ostki:last-child { align-items: flex-end; text-align: right; }
          .ad-oraliq-l { position: absolute; top: calc(100% + 4px); left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 10px; padding: 2px 6px; border-radius: 6px; background: ${T.paper}; box-shadow: 0 0 0 1px ${T.line}; z-index: 2; }
          .ad-oraliq.qizil .ad-oraliq-l { background: ${T.errFon}; box-shadow: 0 0 0 1px ${T.err}; }
        }
        @container (max-width: 440px) {
          .ad-panel-q { flex-direction: column; align-items: stretch; }
          .ad-tel { flex-basis: auto; width: 100%; max-width: 220px; align-self: center; }
          .ad-kun { padding: 5px 4px; }
          .ad-kun-s { font-size: 8.5px; white-space: nowrap; letter-spacing: -0.02em; }
        }
        @media (max-width: 1199px) { .ad-panel > .ad-tasma:first-child { padding-right: 34px; } }
        @media (max-width: 760px) {
          .ad-panel { padding: 10px; }
          .ad-tasma { gap: 4px; }
          .ad-kun { padding: 5px; min-height: 40px; }
          .ad-kun-s { font-size: 9.5px; }
          .ad-sar-q { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
          .ad-sar-q > .ad-kq { grid-column: 1 / -1; order: -1 !important; }
          .ad-hw-karta, .ad-um-metrik { grid-template-columns: minmax(0,1fr); }
          .ad-qf-q { grid-template-columns: minmax(0,1fr); gap: 3px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ad-navbat, .ad-navbat-k > .q-bashorat, .q-kirish:has(.ad-hook.tanla) .q-variantlar-kol, .ad-flash.yangi .fc-card:not(.flip) .fc-front, .ad-fc-ipucha i { animation: none; }
          .ad-odam, .ad-odam.yon, .ad-tel-odam, .ad-son.yangi, .ad-ustun.milt, .ad-oraliq.silk, .ad-kq, .ad-kq.silk, .ad-taxmin { animation: none !important; }
          .ad-odam.ochadi { animation: none !important; opacity: 0; }
          .ad-katak, .ad-tel { transition: none; }
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
