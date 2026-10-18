import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// YANGI DARS SKELETI — «Namuna dars» (konveyer, 04.10.2026). App.jsx ga ULANMAGAN — faqat nusxa olish uchun.
// Yangi dars shu fayldan boshlanadi (pilotdan emas): `cp src/skelet/NamunaDars.jsx src/<N>-Modull/<Nom>Lesson.jsx` (importlar o'zgarmaydi),
// keyin konveyer/2-QURUVCHI.md bo'yicha MD v3 (GATE M o'tgan) matni bilan to'ldiriladi.
// TARKIB: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — TEGILMAYDI;
//   kontent — har qolip turidan bitta namuna: s0 QKirish · s1 QReja · s2 QTushuncha (bashorat → harakat → vizual → xulosa) ·
//   s3 test (QuestionScreen → QTest) · s4 final QTartib · a1 amaliyot bloki (QBlok + ScreenBlok ulagichi, 172/173) · podium · QKartochka · QYakun.
// ALMASHTIRILADI: LESSON_META · HW_TOKENS · SCREEN_META · INLINE_KEYS · RECAPS · ekranlar (s0…) · ACHIEVEMENTS/ACH_TRIGGERS ·
//   Q_LABELS (kalitlar = ballik ekran indekslari, q22) · QZ_BG_SHAPES ({uz,ru}, R-008) · QUIZ_BANK (12 savol, to'g'ri javob 3/3/3/3) ·
//   NAMUNA_FLASHCARDS (darsda 10–12) · SummaryScreen matnlari · screens massivi · export nomi · .nd- CSS bo'limi.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKartochka, QYakun, QMustaqil, QChip, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m12d13-v1', lessonTitle: { uz: "Demo Day'ga tayyormisiz?", ru: 'Готовы ли вы к Demo Day?' } }; // 14-Modul 13-dars (LMS), 2-to'lqin — MD feedback/F-1008-14modul/13-PmDressRehearsal-v3.md
// 12 ekran (MD v3) · ballik testlar 4, 8 (ketma-ket emas — P-012) · mustaqil ish 5, 6, 7 (signal PRACTICE_BASE + ekran)
const HW_TOKENS = [
  { t: { uz: 'chiqish', ru: 'выступление' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'taymer', ru: 'таймер' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'hakam savoli', ru: 'вопрос судьи' }, l: 30, tp: 70, s: 12, d: 8.5 }
];
const SCREEN_META = [
  { id: 's0',         type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',         type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'chiqish',    type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'varaq',      type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',         type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'tayyorlov',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'repetitsiya', type: 'practice',   template: 'custom',   scored: false, scope: null },
  { id: 'hakamVaraq', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',         type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',     type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash',     type: 'flashcards',  template: 'custom',   scored: false, scope: null },
  { id: 's11',        type: 'summary',     template: 'custom',   scored: false, scope: null }
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
const NavNext = ({ disabled, label, onClick, optionalLive, halqa }) => {
  const lbl = tr(label) || tr({ uz: 'Davom etish', ru: 'Продолжить' });
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className={`btn-white-accent${halqa && !disabled && !locked ? ' cs-halqa' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). -1 — sentinel (variant yo'q, ballsiz ekran).
// To'g'ri javob o'rinlari (MD): s4 C · s8 A. Ballsiz ekran sentinel'lari (chiqish, varaq) — jsx-lint «o'lik kalit», shuning uchun yo'q; practice — 5, 6, 7-ekran signali.
const INLINE_KEYS = { s4: 2, s8: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; PM: emoji o'rniga raqam — S-026)
const RECAPS = {
  4: {
    title: { uz: 'Demo ochilmasa', ru: 'Если демо не откроется' },
    cards: [
      { ic: '1', h: { uz: "To'liq repetitsiyada taymer to'xtamaydi.", ru: 'На полной репетиции таймер не останавливается.' } },
      { ic: '2', h: { uz: "Video tayyor bo'lsa — B reja gapi va video.", ru: 'Если видео готово — фраза плана Б и видео.' } },
      { ic: '3', h: { uz: "Mentor misolida: «Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.»", ru: 'В примере Ментора: «Интернет пропал — покажу 60-секундное видео этого демо».' }, ask: { uz: 'Sizning B reja gapingiz qanday?', ru: 'Какая у вас фраза плана Б?' } }
    ]
  },
  8: {
    title: { uz: 'Vaqt oshsa', ru: 'Если время превышено' },
    cards: [
      { ic: '1', h: { uz: "Varaqda «Oshdi» bo'lsa — pitch qisqartiriladi.", ru: 'Если в листе «Превысили» — питч сокращают.' } },
      { ic: '2', h: { uz: 'Takrorlangan yoki ortiqcha gap qisqartiriladi; demo va savol-javob joyida qoladi.', ru: 'Сокращают повторы или лишние фразы; демо и вопросы-ответы остаются на месте.' } },
      { ic: '3', h: { uz: "Qisqartirilgan pitch yana taymer bilan o'lchanadi.", ru: 'Сокращённый питч снова замеряют с таймером.' }, ask: { uz: 'Pitchingizdagi qaysi gap ortiqcha?', ru: 'Какая фраза в вашем питче лишняя?' } }
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
        {card.body && <p className="rc-body">{tr(card.body)}</p>}
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="cs-test-viz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — ChiqishSahna: telefon (chapda) · hakam kartasi · taymer chizig'i · laptop brauzeri · varaq =====
// Hakam — bitta urg'uli rol kartasi (14-Modul SABOQ P1): varaq belgisi, odam figurasi emas; ismsiz, gapi — kurs savollari (HAKAM_SAVOL).
// Bitta manba: CHIQISH_VAQT · BOLAK_NOM · MENTOR_SSENARIY · B_REJA_GAPI · HAKAM_SAVOL · TAYYORLOV · VARAQ_BELGI · VAZIYAT + o'quvchi natijasi (pm-m12d13-repetitsiya).
// 12-Modul TaymerChiziq / BeshDaqiqaSahna dan ko'chirilmagan — dars ichida yozildi (K-020). Rangli yon chiziq yo'q; reduced-motion — CSS da.
// qolip-maket: cs-tugma cs-belgi cs-savol
const cxx = (...a) => a.filter(Boolean).join(' ');
const NB = ' ';
const MJ_RANG = '#2E9E4F'; // «Maydon Jamoa» — 11-Modul 9.62 yashili (9–13-Modul darslari bilan bir), logotipsiz
const MJ = () => <span className="cs-mj">Maydon Jamoa</span>;
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;

// --- Saqlanadigan natija (tayanch 8) va o'qiladigan kalitlar (bo'lmasa ham ekran ishlaydi) ---
const REP_KEY = 'pm-m12d13-repetitsiya';
const FINAL_KEY = 'pm-m12d8-final';
const DEMO_KEY = 'pm-m12d6-demo';
const TEKSHIRUV_KEY = 'pm-m12d7-tekshiruv';
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const repOl = () => lsO(REP_KEY);
const repYoz = (patch) => {
  const r = lsO(REP_KEY) || {};
  const d = { tayyorlov: null, vaqt: null, demo: null, savollar: 0, savolJavobTugadi: false, varaq: [], tur: null, ...r, ...patch, savedAt: Date.now() };
  lsY(REP_KEY, d); return d;
};
const sonmi = (v) => typeof v === 'number' && Number.isFinite(v);
const finalOl = () => { const f = lsO(FINAL_KEY); return { vaqt: f && sonmi(f.vaqt) ? f.vaqt : null, ids: f && Array.isArray(f.savollar) ? f.savollar.map(s => s && s.id).filter(Boolean) : [] }; };
const demoOl = () => {
  const d = lsO(DEMO_KEY); if (!d) return null;
  return { bor: true, uygotish: d.uygotish, video: d.video, otishVaqt: sonmi(d.otishVaqt) ? d.otishVaqt : null, ssenariy: Array.isArray(d.ssenariy) ? d.ssenariy.map(s => String(s || '').trim()).filter(Boolean) : [] };
};
const USUL_NOM = { tarmoq: { uz: 'Tarmoq uzilishi', ru: 'Обрыв сети' }, bosh: { uz: "Bo'sh ma'lumot", ru: 'Пустые данные' }, ikki: { uz: 'Ikki marta bosish', ru: 'Двойное нажатие' } };
const ochiqUsullar = () => { const t = lsO(TEKSHIRUV_KEY); return t && Array.isArray(t.urinishlar) ? t.urinishlar.filter(u => u && u.buzildi === true && u.qayta !== 'takrorlanmadi' && USUL_NOM[u.usul]).map(u => u.usul) : []; };

// --- Pitch va chiqish (tayanch 9.1, 1.8): olti bo'lak 5:00 + savol-javob 3 × 1:00 ---
const BOLAK_ID = ['muammo', 'bozor', 'yechim', 'raqamlar', 'jamoa', 'keyingi'];
const BOLAK_NOM = {
  muammo: { uz: 'Muammo', ru: 'Проблема' }, bozor: { uz: 'Bozor', ru: 'Рынок' }, yechim: { uz: 'Yechim', ru: 'Решение' },
  raqamlar: { uz: 'Raqamlar', ru: 'Цифры' }, jamoa: { uz: 'Jamoa', ru: 'Команда' }, keyingi: { uz: 'Keyingi qadam', ru: 'Следующий шаг' }
};
const CHIQISH_VAQT = [40, 30, 90, 60, 30, 50]; // soniya — bu mashqda, jami 5:00
const PITCH_S = 300;
const SAVOL_S = 60;
const BOSH_S = CHIQISH_VAQT.map((_, i) => CHIQISH_VAQT.slice(0, i).reduce((a, b) => a + b, 0));
const mss = (s) => { const t = Math.max(0, Math.round(s)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
const bolakAt = (s) => { let i = 0; while (i < 5 && s >= BOSH_S[i + 1]) i += 1; return i; };
// Mentor demo ssenariysi (tayanch 1.6, 5 qadam) va B reja gapi (9.9 aynan)
const MENTOR_SSENARIY = [
  { uz: 'Kirish', ru: 'Вход' },
  { uz: "«O'yinlar»", ru: '«Игры»' },
  { uz: "O'yinga qo'shilish", ru: 'Присоединение к игре' },
  { uz: "Ikkinchi telefonda son o'zgaradi", ru: 'На втором телефоне меняется число' },
  { uz: "«Hozir ko'ryapti»", ru: '«Сейчас смотрят»' }
];
const B_REJA_GAPI = { uz: "Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.", ru: 'Интернет пропал — покажу 60-секундное видео этого демо.' };
// Hakam savollari — bitta manba (tayanch 9.3, 1-dars bilan so'zma-so'z + 1.8 dagi «hozir»). Kurs savollari, real hakam gapi emas.
const HAKAM_SAVOL = {
  muammo: { uz: 'Bu muammo borligini qayerdan bilasiz?', ru: 'Откуда вы знаете, что эта проблема есть?' },
  bozor: { uz: 'Bu mahsulot yana qancha odamga kerak?', ru: 'Скольким ещё людям нужен этот продукт?' },
  yechim: { uz: 'Mahsulot nima qiladi?', ru: 'Что делает продукт?' },
  raqamlar: { uz: 'Bu son qayerdan va nimani sanaydi?', ru: 'Откуда это число и что оно считает?' },
  jamoa: { uz: 'Buni kim qilyapti?', ru: 'Кто это делает?' },
  keyingi: { uz: 'Endi nima qilasiz?', ru: 'Что будете делать дальше?' },
  hozir: { uz: 'Odamlar hozir bu ishni nima bilan qiladi?', ru: 'С помощью чего люди делают это сейчас?' }
};
const SAVOL_ID = ['muammo', 'bozor', 'yechim', 'raqamlar', 'jamoa', 'keyingi', 'hozir'];
const savolMatn = (id) => (String(id).startsWith('boshqa') ? tr({ uz: "Hakamning o'z savoli", ru: 'Собственный вопрос судьи' }) : tr(HAKAM_SAVOL[id] || ''));
// Hakam varag'i belgilari — bitta manba (A-4). rang: ok · acc · err (A-13)
const VARAQ_BELGI = {
  vaqt: { sigdi: { uz: "Sig'di", ru: 'Уложились', rang: 'ok' }, oshdi: { uz: 'Oshdi', ru: 'Превысили', rang: 'err' } },
  demo: { ishladi: { uz: 'Ishladi', ru: 'Сработало', rang: 'ok' }, 'b-reja': { uz: 'B reja', ru: 'План Б', rang: 'acc' }, ishlamadi: { uz: 'Ishlamadi', ru: 'Не сработало', rang: 'err' } },
  savol: { fakt: { uz: 'Son yoki fakt bilan', ru: 'С числом или фактом', rang: 'ok' }, tekshiraman: { uz: 'Tekshirib aytaman', ru: 'Проверю и скажу', rang: 'acc' }, tegmadi: { uz: 'Javob savolga tegmadi', ru: 'Ответ не по вопросу', rang: 'err' } }
};
const bolimOf = (band) => (band === 'vaqt' ? 'vaqt' : band === 'demo' ? 'demo' : 'savol');
const belgiOb = (band, k) => (k ? VARAQ_BELGI[bolimOf(band)][k] : null);
// 3-ekran mashq vaziyatlari (A-6 aynan; Mentor chiqishining natijasi emas)
const VAZIYAT = [
  { bolim: 'demo', matn: { uz: "Yechimda laptop «Ulanmoqda…» ko'rsatdi. B reja gapi aytildi, video oxirigacha ko'rsatildi.", ru: 'В Решении ноутбук показал «Подключение…». Сказали фразу плана Б, видео показали до конца.' }, togri: 'b-reja',
    xato: { ishladi: { uz: "Jonli demo ochildimi yoki video ko'rsatildimi?", ru: 'Живое демо открылось или показали видео?' }, ishlamadi: { uz: "Hakam Yechimni videoda ko'rdimi yoki yo'qmi?", ru: 'Судья увидел Решение на видео или нет?' } } },
  { bolim: 'savol', savol: 'bozor', javob: { uz: 'Boshqa mahallalarni hali tekshirmaganmiz — tekshirib aytaman.', ru: 'Другие махалли мы ещё не проверяли — проверю и скажу.' }, togri: 'tekshiraman',
    xato: { fakt: { uz: 'Javobda son bormi? Yoki «tekshirib aytaman» deyildimi?', ru: 'В ответе есть число? Или сказали «проверю и скажу»?' }, tegmadi: { uz: "Javob aynan shu savol haqida — faqat son hali yo'q.", ru: 'Ответ именно об этом вопросе — только числа пока нет.' } } },
  { bolim: 'savol', savol: 'jamoa', javob: { uz: "Ilovada o'yin e'loni, qo'shilish va eslatma bor.", ru: 'В приложении есть объявление игры, присоединение и напоминание.' }, togri: 'tegmadi',
    xato: { fakt: { uz: 'Fakt bor — u mahsulotni kim qilayotganini aytdimi?', ru: 'Факт есть — но сказал ли он, кто делает продукт?' }, tekshiraman: { uz: 'Javobda «tekshirib aytaman» degan gap bormi?', ru: 'Есть ли в ответе фраза «проверю и скажу»?' } } }
];
// 5-ekran — chiqishdan oldin to'rt narsa (tayanch 1.13; tanlov — kuzatilgan holat, 13-FILTR 1)
const TAYYORLOV = [
  { id: 'backend', nom: { uz: 'Backend', ru: 'Backend' }, ish: { uz: "Laptopda demo yo'lingizni oching va ro'yxat chiqqanini ko'ring.", ru: 'Откройте на ноутбуке путь демо и убедитесь, что список появился.' },
    tanlovlar: [{ k: 'ochildi', t: { uz: "Ro'yxat ochildi", ru: 'Список открылся' }, tayyor: true }, { k: 'ochilmadi', t: { uz: 'Ochilmadi', ru: 'Не открылся' }, tayyor: false }],
    yol: { uz: "Birinchi ochilish cho'zilishi mumkin — kutib, sahifani yangilang.", ru: 'Первое открытие может затянуться — подождите и обновите страницу.' },
    yordam: { uz: "Backend — Render bepul xizmati: 15 daqiqa so'rovsiz qolsa uxlaydi, bitta so'rov bilan uyg'onadi", ru: 'Backend — бесплатный сервис Render: без запросов 15 минут засыпает, просыпается от одного запроса' } },
  { id: 'video', nom: { uz: 'B reja video', ru: 'Видео плана Б' }, ish: { uz: "Laptopda B reja videosini oching va boshini ko'ring.", ru: 'Откройте на ноутбуке видео плана Б и посмотрите начало.' },
    tanlovlar: [{ k: 'ochildi', t: { uz: 'Video ochildi', ru: 'Видео открылось' }, tayyor: true }, { k: 'yoq', t: { uz: "Video hali yo'q", ru: 'Видео пока нет' }, tayyor: false }],
    yol: { uz: "Video yo'q bo'lsa, demo ochilmaganda Yechimni og'zaki aytib berasiz.", ru: 'Если видео нет, при неоткрывшемся демо расскажете Решение устно.' },
    yol2: { uz: 'Varaqda bu — «Ishlamadi»: B reja faqat video uchun.', ru: 'В листе это — «Не сработало»: план Б — только для видео.' },
    yordam: { uz: 'B reja — 60 soniyalik ekran videosi, laptopda', ru: 'План Б — 60-секундное видео экрана, на ноутбуке' } },
  { id: 'namuna', nom: { uz: 'Namuna akkaunt', ru: 'Демо-аккаунт' }, ish: { uz: "Laptop va telefonda demo yo'liga qaysi hisob bilan kirgansiz?", ru: 'С каким аккаунтом вы вошли в путь демо на ноутбуке и телефоне?' },
    tanlovlar: [{ k: 'namuna', t: { uz: 'Ikkalasida namuna akkaunt', ru: 'На обоих — демо-аккаунт' }, tayyor: true }, { k: 'shaxsiy', t: { uz: 'Shaxsiy hisobim ochiq', ru: 'Открыт мой личный аккаунт' }, tayyor: false }],
    yol: { uz: "Shaxsiy ism va yozuvlar ekranda zalga ko'rinadi — namuna akkauntga o'ting.", ru: 'Личное имя и записи будут видны залу — перейдите на демо-аккаунт.' },
    yordam: { uz: 'laptopda ham, telefonda ham — namuna akkaunt', ru: 'и на ноутбуке, и на телефоне — демо-аккаунт' } },
  { id: 'qurilma', nom: { uz: 'Telefon', ru: 'Телефон' }, ish: { uz: "Telefonda demo yo'li brauzerda ochiqmi, zaryadi yetadimi?", ru: 'Открыт ли путь демо в браузере телефона, хватит ли заряда?' },
    tanlovlar: [{ k: 'telefon', t: { uz: 'Ochiq, zaryadi bor', ru: 'Открыт, заряд есть' }, tayyor: true }, { k: 'quvvat', t: { uz: 'Quvvatga uladim', ru: 'Подключил к зарядке' }, tayyor: true }, { k: 'boshqa-oyna', t: { uz: "Telefon yo'q", ru: 'Телефона нет' }, tayyor: false }],
    yol: { uz: 'Ikkinchi qurilma — laptopdagi boshqa brauzer oynasi, boshqa namuna akkaunt bilan.', ru: 'Второе устройство — другое окно браузера на ноутбуке, с другим демо-аккаунтом.' },
    yordam: { uz: "telefon — ikkinchi o'yinchi, brauzerda", ru: 'телефон — второй игрок, в браузере' } }
];
const tayyorSoni = (t) => (t ? TAYYORLOV.filter(c => { const v = c.tanlovlar.find(x => x.k === t[c.id]); return v && v.tayyor; }).length : 0);

// --- Ekran maqsadlari (PM: quruvchi + SCREEN_INTENTS; ekranga chiqmaydi) ---
const SCREEN_INTENTS = [
  'kirish: pitch, demo va savol-javob birga qanday chiqishini qayerdan bilasiz', 'reja: hakamlar oldidagidek to\'liq repetitsiya',
  'butun chiqish: pitch 5:00, demo Yechim ichida, savol-javob, B reja, taymer to\'xtamaydi', 'hakam varag\'i: uch mashq vaziyati',
  'test: kitob ilovasida demo ochilmadi, video tayyor', 'chiqishdan oldin to\'rt narsa (tayyorlov)', 'o\'z chiqishi: taymer, 3 savol, guruhda hakam bilan',
  'hakam varag\'i: vaqt, demo, savollar', 'yakuniy test: vaqt oshdi, endi nima', 'podium', 'kartochkalar', 'yakun: yetti holat'
];

// --- Yordamchi ilgaklar ---
const kamHarakat = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useIpucha = (faol, kalit) => {
  const [k, setK] = useState(false);
  useEffect(() => { setK(false); if (!faol) return undefined; const t = setTimeout(() => setK(true), 40000); return () => clearTimeout(t); }, [faol, kalit]);
  return faol && k;
};
// Bosqichdan keyin sahna qismlari navbat bilan yonadi (450 ms); reduced-motion — birdan
const useFaza = (kalit, oxir = 6, ms = 450, darhol = false) => {
  const [f, setF] = useState(darhol ? oxir : 0);
  useEffect(() => {
    if (darhol || kamHarakat()) { setF(oxir); return undefined; }
    setF(0); let i = 0;
    const t = setInterval(() => { i += 1; setF(i); if (i >= oxir) clearInterval(t); }, ms);
    return () => clearInterval(t);
  }, [kalit]); // eslint-disable-line
  return f;
};
// Belgi yoki savol — ko'rinib uchadi (o'lchab, position: fixed nusxa, ~0,6 s; SABOQ P3)
const useUchish = () => {
  const [uch, setUch] = useState(null);
  const uchir = (fromEl, toEl, data, onTush) => {
    if (kamHarakat() || !fromEl || !toEl) { if (onTush) onTush(); return; }
    const a = fromEl.getBoundingClientRect(), t = toEl.getBoundingClientRect();
    setUch({ ...data, x: a.left, y: a.top, h: a.height, dx: t.left - a.left, dy: t.top + t.height / 2 - (a.top + a.height / 2), bor: false });
    requestAnimationFrame(() => requestAnimationFrame(() => setUch(u => (u ? { ...u, bor: true } : u))));
    setTimeout(() => { setUch(null); if (onTush) onTush(); }, 640);
  };
  const el = uch && <div className={cxx('cs-uchar', uch.rang, uch.bor && 'bor')} aria-hidden="true"
    style={{ left: uch.x, top: uch.y, minHeight: uch.h, transform: uch.bor ? 'translate(' + uch.dx + 'px,' + uch.dy + 'px)' : 'none' }}>{uch.matn}</div>;
  return [uchir, el];
};
// Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42)
const XulosaQ = ({ taxmin, matn, izoh }) => (<>
  {taxmin}
  <span className="cs-xq-m">{matn}</span>
  {izoh && <span className="cs-xq-i">{izoh}</span>}
</>);
const TaxminQ = ({ togri, aslida }) => (togri
  ? <span className="cs-xq-t">{tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение верно ✓' })}</span>
  : <span className="cs-xq-t xato">{tr({ uz: 'Taxminingiz ✕ — aslida:', ru: 'Ваше предположение ✕ — на деле:' })} {aslida}</span>);
const IPUCHA = (t) => <p className="cs-ipucha fade-step">{t}</p>;
const ixchamBashorat = (taxmin, el) => <div className={cxx('cs-bash', taxmin && 'ix')}>{el}</div>;
const Qadamlar3 = ({ nomlar, q, faol, onBos }) => (
  <div className="cs-qadamlar">
    {nomlar.map((n, i) => (
      <QChip key={i} holat={i < q ? 'ok' : i === q && faol ? 'on' : undefined} className={cxx('cs-tugma', i === q && faol && 'cs-joriy')} disabled={!faol || i !== q} onClick={onBos}>
        <i>{i < q ? '✓' : i + 1}</i>{tr(n)}
      </QChip>
    ))}
  </div>
);

// --- Hakam: bitta urg'uli rol kartasi (F-1008-574, 576) — varaq belgisi + savollari («?» yoki ✓) ---
const Varaqcha = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 3h5a1 1 0 0 1 1 1v1.5h-7V4a1 1 0 0 1 1-1ZM8.5 4.8h-2a1 1 0 0 0-1 1v13.7a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V5.8a1 1 0 0 0-1-1h-2M8.6 11.6l1.6 1.6 3.3-3.4M8.6 16.6h6.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const HakamKarta = ({ savollar = [] }) => (
  <div className="cs-hk">
    <span className="cs-hk-ava"><Varaqcha /></span>
    <div className="cs-hk-o">
      <b className="cs-hk-nom">{tr({ uz: 'Hakam', ru: 'Судья' })}</b>
      <div className="cs-hk-sl">
        {savollar.map((q, i) => (
          <span key={q.k ?? i} className={cxx('cs-hk-s', q.ok && 'ok', !q.matn && 'kut')} style={{ animationDelay: (i * 0.12) + 's' }}>
            <i key={q.ok ? 'ok' : 'q'}>{q.ok ? '✓' : '?'}</i>{q.matn && <span>{q.matn}</span>}
          </span>
        ))}
      </div>
    </div>
  </div>
);
// --- Telefon: «Maydon Jamoa» — «O'yin» ekrani (≈170×272, o'lchami barqaror; 2-qurilma — telefon brauzeri) ---
const JamoaTelefon = ({ son = 8, kor = false }) => (
  <div className="cs-tel">
    <div className="cs-tel-ekran">
      <span className="cs-tel-nom"><MJ /></span>
      <span className="cs-tel-y">{tr({ uz: "O'yin", ru: 'Игра' })}</span>
      <b className="cs-tel-vaqt">{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
      <span className="cs-tel-joy">{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span>
      <b key={son} className={cxx('cs-tel-son', son > 8 && 'yangi')}>{son}{NB}/{NB}10</b>
      <span className="cs-tel-doira">{Array.from({ length: 10 }).map((_, i) => <i key={i} className={i < son ? 'bor' : ''} />)}</span>
      {kor && <span className="cs-tel-kor">{tr({ uz: "Hozir ko'ryapti", ru: 'Сейчас смотрят' })}</span>}
      <span className="cs-tel-tugma">{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
    </div>
  </div>
);
// --- Laptop brauzeri (proyektorga): «O'yinlar» → «Qo'shilaman»; ulanish belgisi; B reja kadri — video oynasi ---
const Laptop = ({ son = 8, bosildi = false, ulanish = false, video = false, qaytadan = false, pufak = null, nom = null, ixcham = false, yon = false, yonQosh = null }) => (
  <div className={cxx('cs-lap', ixcham && 'ixcham', yon && 'yon')}>
    {pufak && !yon && <div className="cs-pufak" key="pf">«{pufak}»</div>}
    <div className="cs-lap-ekran">
      <div className="cs-lap-bar"><i /><i /><i /><span className="cs-lap-url">{nom ? nom : 'maydon-jamoa-….netlify.app'}</span></div>
      <div className="cs-lap-ich">
        {video
          ? <div className="cs-video" key="v"><span className="cs-video-p">▶</span><span className="cs-video-ch"><i /></span>{!nom && <span className="cs-video-s">{tr({ uz: '60 soniya', ru: '60 секунд' })}</span>}</div>
          : ulanish
            ? <div className="cs-ulan" key="u"><span className="cs-spin" />{tr({ uz: 'Ulanmoqda…', ru: 'Подключение…' })}</div>
            : <div className="cs-lap-oyin" key="o">
              <span className="cs-lap-h"><MJ /> · {tr({ uz: "O'yinlar", ru: 'Игры' })}</span>
              <div className="cs-lap-k">
                <b>{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
                <span>{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span>
                <b key={son} className={cxx('cs-lap-son', son > 8 && 'yangi')}>{son}{NB}/{NB}10</b>
                <span className={cxx('cs-lap-tug', bosildi && 'on')}>{bosildi ? '✓ ' : ''}{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
              </div>
            </div>}
      </div>
    </div>
    {yon
      ? <div className="cs-lap-yon">
        {yonQosh}
        {pufak && <div className="cs-pufak" key="pf">«{pufak}»</div>}
        {qaytadan && <div className="cs-qayta"><em>{tr({ uz: 'bu mashqda', ru: 'в этом упражнении' })}</em><span className="cs-qayta-t">{tr({ uz: 'Qaytadan', ru: 'Заново' })}</span></div>}
        <span className="cs-qur-y">{tr({ uz: 'laptop · proyektorga', ru: 'ноутбук · на проектор' })}</span>
      </div>
      : <>
        {qaytadan && <div className="cs-qayta"><em>{tr({ uz: 'bu mashqda', ru: 'в этом упражнении' })}</em><span className="cs-qayta-t">{tr({ uz: 'Qaytadan', ru: 'Заново' })}</span></div>}
        {!ixcham && <span className="cs-qur-y">{tr({ uz: 'laptop · proyektorga', ru: 'ноутбук · на проектор' })}</span>}
      </>}
  </div>
);
// --- Taymer chizig'i: olti bo'lak 5:00 + savol-javob bo'lagi (3 katak, har biri 1:00 gacha) ---
// rejim: 'bosh' (bo'sh, uzuq) · 'yur' (o'zi yuradi, kechik/dav) · 'toliq' · 'jonli' (sek — taymerdan) · 'b' (Yechimgacha to'la, Yechim yuraveradi)
// sj: null | [{ holat: 'bosh' | 'anim' | 'yur' | 'tugadi' | 'osh', w, d, yozuv }]
const TaymerQator = ({ rejim = 'toliq', sek = 0, kechik = 0, dav = 2.4, nomlar = true, vaqtlar = false, sj = null, sjOk = false, sjRef, oxir, ostida, katta = false }) => {
  const oshdi = rejim === 'jonli' && sek > PITCH_S;
  const joriy = rejim === 'jonli' && sek > 0 && sek <= PITCH_S ? bolakAt(sek) : -1;
  return (
    <div className={cxx('cs-tm', rejim, oshdi && 'oshdi', katta && 'katta')}>
      <div className="cs-tm-q">
        <div className="cs-tm-ch">
          <div className="cs-tm-chiziq">
            {BOLAK_ID.map((id, i) => {
              const d = BOSH_S[i]; const v = CHIQISH_VAQT[i];
              const w = rejim === 'jonli' ? Math.max(0, Math.min(1, (sek - d) / v)) : rejim === 'b' ? (i < 2 ? 1 : null) : null;
              const st = rejim === 'yur' ? { animationDelay: (kechik + (d / PITCH_S) * dav) + 's', animationDuration: ((v / PITCH_S) * dav) + 's' }
                : w !== null ? { transform: 'scaleX(' + w + ')' } : undefined;
              return (
                <span key={id} className={cxx('cs-tm-bo', joriy === i && 'joriy', rejim === 'b' && i === 2 && 'yuradi')} style={{ flex: v }}>
                  <span className="cs-tm-t"><i style={st} /></span>
                  {nomlar && <em>{tr(BOLAK_NOM[id])}</em>}
                  {vaqtlar && <small>{mss(v)}</small>}
                </span>
              );
            })}
          </div>
          <div className="cs-tm-chet"><span>0:00</span>{oshdi ? <b className="cs-tm-osh">+{mss(sek - PITCH_S)}</b> : <span className="cs-tm-5">5:00</span>}</div>
        </div>
        {sj && <div className={cxx('cs-tm-sj', sjOk && 'ok')}>
          <div className="cs-tm-kat">
            {sj.map((k, i) => (
              <span key={i} ref={el => { if (sjRef) sjRef.current[i] = el; }} className={cxx('cs-kat', k.holat)} style={k.holat === 'anim' ? { animationDelay: (k.d || 0) + 's' } : undefined}>
                <i style={k.holat === 'yur' ? { transform: 'scaleX(' + Math.min(1, k.w || 0) + ')' } : k.holat === 'anim' ? { animationDelay: (k.d || 0) + 's' } : undefined} />
                {k.yozuv && <b>{k.yozuv}</b>}
              </span>
            ))}
          </div>
          <em>{tr({ uz: 'savol-javob', ru: 'вопросы-ответы' })}</em>
        </div>}
        {oxir && <span className="cs-tm-oxir">{oxir}</span>}
      </div>
      {ostida}
    </div>
  );
};
const YechimQadam = ({ qadamlar, n }) => (
  <div className="cs-yq">
    <span className="cs-yq-y">{tr(BOLAK_NOM.yechim)} · {tr({ uz: 'jonli demo', ru: 'живое демо' })}</span>
    {qadamlar.map((q, i) => <span key={i} className={cxx('cs-yq-q', i < n && 'on')}><i>{i + 1}</i>{q}</span>)}
  </div>
);
const ChiqishSahna = ({ yorliq, hakam, taymer, laptop, telefon = 8, telKor = false, telYoq = false, className }) => (
  <div className={cxx('cs-sahna', telYoq && 'tel-yoq', className)}>
    {!telYoq && <div className="cs-sahna-tel"><JamoaTelefon son={telefon} kor={telKor} /><span className="cs-qur-y">{tr({ uz: '2-qurilma · telefon brauzeri', ru: '2-е устройство · браузер телефона' })}</span></div>}
    <div className="cs-sahna-ong">
      {yorliq && !telYoq && <span className="cs-sahna-y">{yorliq}</span>}
      {hakam && <HakamKarta {...hakam} />}
      {taymer && <TaymerQator {...taymer} />}
      {laptop && <Laptop {...laptop} />}
    </div>
  </div>
);
// --- Hakam varag'i: uch bo'lim — Vaqt · Demo · Savol-javob; qatorlar VARAQ_BELGI dan (rang — A-13) ---
// qatorlar: [{ band, nom, belgi, kulrang, joriy, yangi, tugmalar, slotRef }]
const BelgiChip = ({ band, k }) => { const b = belgiOb(band, k); return b ? <span className={cxx('cs-belgi-c', b.rang)}>{tr(b)}</span> : null; };
const Varaq = ({ sarlavha, qatorlar, yonadi = false, className }) => {
  const bolimlar = [
    { id: 'vaqt', nom: { uz: 'Vaqt', ru: 'Время' } },
    { id: 'demo', nom: { uz: 'Demo', ru: 'Демо' } },
    { id: 'savol', nom: { uz: 'Savol-javob', ru: 'Вопросы-ответы' } }
  ];
  return (
    <div className={cxx('cs-varaq', yonadi && 'yonadi', className)}>
      {sarlavha && <div className="cs-varaq-h">{sarlavha}</div>}
      {bolimlar.map(b => {
        const q = qatorlar.filter(r => bolimOf(r.band) === b.id);
        if (!q.length) return null;
        return (
          <div key={b.id} className={cxx('cs-bolim', q.some(r => r.joriy) && 'joriy')}>
            <span className="cs-bolim-n">{tr(b.nom)}</span>
            {q.map(r => (
              <div key={r.band} className={cxx('cs-vq', r.yangi && 'yangi', r.joriy && 'joriy')}>
                {r.nom && <span className="cs-vq-n">{r.nom}</span>}
                {r.tugmalar
                  ? <span className="cs-vq-tug">{r.tugmalar}</span>
                  : r.belgi
                    ? <span className="cs-vq-b" ref={r.slotRef}><BelgiChip band={r.band} k={r.belgi} />{r.qosh}</span>
                    : r.kulrang ? <span className="cs-vq-k" ref={r.slotRef}>{r.kulrang}</span>
                      : <span className="cs-vq-bosh" ref={r.slotRef} />}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
// Harflar navbat bilan yoziladigan sarlavha
const Yoziladi = ({ matn }) => <span className="cs-yoz" aria-label={matn}>{Array.from(matn).map((h, i) => <span key={i} aria-hidden="true" style={{ animationDelay: (i * 0.05) + 's' }}>{h}</span>)}</span>;

// ===== SCREEN 0 — KIRISH (QKirish; sof so'rovnoma — J-026: correct false hammaga; javob «Aynan!» / «Qiziq fikr!» — T-028, T-067) =====
const HOOK_OPTS = [
  { id: 'qosh', t: { uz: "Mashqlardagi vaqtlarni qo'shib chiqaman", ru: 'Сложу время из упражнений' } },
  { id: 'birga', t: { uz: "Hammasini bir marta birga o'tib ko'raman", ru: 'Один раз пройду всё вместе' } },
  { id: 'kuni', t: { uz: 'Demo Day kunining o\'zida bilib olaman', ru: 'Узнаю в сам день Demo Day' } }
];
const HOOK_JAVOB = {
  birga: { uz: <><b>Aynan!</b> Qayerda qoqilishini faqat butun chiqishni bir marta to'xtamasdan o'tib bilasiz.</>, ru: <><b>Именно!</b> Где вы споткнётесь, узнаете, только пройдя всё выступление один раз без остановки.</> },
  qosh: { uz: <><b>Qiziq fikr!</b> Qo'shish taxmin beradi, lekin demoga o'tish va savollar ham vaqt oladi.</>, ru: <><b>Интересная мысль!</b> Сложение даёт оценку, но переход к демо и вопросы тоже занимают время.</> },
  kuni: { uz: <><b>Qiziq fikr!</b> O'sha kuni bilsangiz, nimanidir tuzatishga vaqt qolmaydi.</>, ru: <><b>Интересная мысль!</b> Если узнаете в тот день, исправить что-то уже не успеете.</> }
};
const KirishMaket = ({ yaqin }) => {
  const f = useMemo(() => finalOl(), []);
  const d = useMemo(() => demoOl(), []);
  const ot = d && d.otishVaqt;
  const mentor = f.vaqt === null && !ot;
  const kartalar = [
    { k: 'p', h: tr({ uz: 'Pitch', ru: 'Питч' }), v: '5:00', s: f.vaqt !== null ? tr({ uz: '8-darsda:', ru: 'На 8-м уроке:' }) + ' ' + mss(f.vaqt) : null },
    { k: 'd', h: tr({ uz: "Demo o'tishi", ru: 'Проход демо' }), v: ot ? null : tr({ uz: '60–90 soniya', ru: '60–90 секунд' }), s: ot ? tr({ uz: '6-darsda:', ru: 'На 6-м уроке:' }) + ' ' + ot + NB + tr({ uz: 'soniya', ru: 'секунд' }) : null },
    { k: 's', h: tr({ uz: 'Savol-javob', ru: 'Вопросы-ответы' }), v: tr({ uz: '3 savol', ru: '3 вопроса' }), s: null }
  ];
  return (
    <div className={cxx('cs-kir', yaqin && 'yaqin')}>
      {mentor && <span className="cs-sahna-y">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</span>}
      <HakamKarta savollar={[{ k: 1 }, { k: 2 }, { k: 3 }]} />
      <div className="cs-kir-k">
        {kartalar.map((k, i) => <div key={k.k} className="cs-kir-karta" style={{ animationDelay: (0.1 + i * 0.1) + 's' }}><b>{k.h}</b>{k.v && <strong>{k.v}</strong>}{k.s && <span>{k.s}</span>}</div>)}
      </div>
      <div className="cs-kir-chiziq"><span>?</span></div>
    </div>
  );
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive halqa={picked !== null} disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('cs-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Demo Day'ga <A>tayyormisiz?</A></>, ru: <>Готовы ли вы <A>к Demo Day?</A></> })}
          mentor={<Mentor>{tr({ uz: "Pitch, demo va savol-javobni oldingi darslarda mashq qildingiz. Hakamlar oldidagidek hammasi birga qanday chiqishini qayerdan bilasiz?", ru: 'Питч, демо и вопросы-ответы вы тренировали на прошлых уроках. Откуда вы узнаете, как всё это вместе выйдет перед судьями?' })}</Mentor>}
          maket={<KirishMaket yaqin={picked !== null} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual bir marta o'zi yuradi, tugagach «Boshlaymiz» halqada) =====
// MD «matnsiz skelet» → SABOQ A4/33: bo'sh chiziq o'rnida bo'lak va bo'lim nomlari (2, 3-ekran kashfiyoti ochilmaydi — belgilar yo'q).
const REJA = [
  { t: { uz: "Butun chiqish qaysi tartibda o'tishini bilib olasiz", ru: 'Узнаете, в каком порядке идёт всё выступление' }, teg: { uz: "to'liq repetitsiya", ru: 'полная репетиция' } },
  { t: { uz: "Hakam chiqishga qanday belgi qo'yishini bilasiz", ru: 'Узнаете, какие отметки судья ставит выступлению' }, teg: { uz: "hakam varag'i", ru: 'лист судьи' } },
  { t: { uz: 'Chiqishdan oldin demo qurilmalarini tekshirasiz', ru: 'Перед выступлением проверите устройства для демо' }, teg: { uz: 'B reja', ru: 'план Б' } },
  { t: { uz: "Chiqishingizni o'tasiz, hakam varaqni to'ldiradi", ru: 'Пройдёте своё выступление, судья заполнит лист' }, teg: { uz: 'savol-javob', ru: 'вопросы-ответы' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [tayyor, setTayyor] = useState(false);
  useEffect(() => { const t = setTimeout(() => setTayyor(true), kamHarakat() ? 0 : 6200); return () => clearTimeout(t); }, []);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={tayyor} label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun chiqishingizni <A>hakamlar oldidagidek o'tasiz.</A></>, ru: <>Сегодня пройдёте своё выступление <A>как перед судьями.</A></> })}
        mentor={<Mentor>{tr({ uz: "Guruhda bir-biringizga hakam bo'lasiz; Mentor va mehmon ham guruhlarga qo'shiladi.", ru: 'В группе вы будете судьями друг для друга; Ментор и гость тоже присоединятся к группам.' })}</Mentor>}
        chapYorliq={tr({ uz: "hakamlar oldidan to'liq repetitsiya", ru: 'полная репетиция перед судьями' })}
        chap={<div className="cs-reja">
          <TaymerQator rejim="yur" kechik={0.3} dav={3.6} nomlar={false} sj={[{ holat: 'anim', d: 4.1 }, { holat: 'anim', d: 4.4 }, { holat: 'anim', d: 4.7 }]} />
          <Varaq className="cs-reja-v" qatorlar={[{ band: 'vaqt' }, { band: 'demo' }, { band: 'savol:1' }]} />
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      />
    </Stage>
  );
};

// ===== SCREEN 2 — BUTUN CHIQISH (QTushuncha keng; bashorat → 3 tugma ketma-ket; markaziy) =====
const S2_TUGMA = [{ uz: 'Pitch va jonli demo', ru: 'Питч и живое демо' }, { uz: 'Savol-javob', ru: 'Вопросы-ответы' }, { uz: 'Demo ochilmasa', ru: 'Если демо не откроется' }];
const S2_IZOH = [
  { uz: "Mentor rejasida Yechim — 90 soniya, ichidagi demo — 60–90 soniya: demo cho'zilsa, pitch ham cho'ziladi.", ru: 'В плане Ментора Решение — 90 секунд, демо внутри — 60–90 секунд: затянется демо — затянется и питч.' },
  { uz: "Bu mashqda 3 savolni hakam tanlaydi — ular oldindan ma'lum emas; har javobga 1 daqiqagacha.", ru: 'В этом упражнении 3 вопроса выбирает судья — заранее они неизвестны; на каждый ответ — до 1 минуты.' },
  { uz: "Pitch, jonli demo va savol-javobni Demo Day'dagidek to'xtamasdan o'tish — to'liq repetitsiya deyiladi.", ru: 'Пройти питч, живое демо и вопросы-ответы без остановки, как на Demo Day, — это называется полной репетицией.' }
];
const S2_TAXMIN = [{ k: '5', t: { uz: '5 daqiqagacha', ru: 'До 5 минут' } }, { k: '8', t: { uz: '8 daqiqagacha', ru: 'До 8 минут' } }, { k: '12', t: { uz: '12 daqiqagacha', ru: 'До 12 минут' } }];
const S2_SAVOL = ['bozor', 'raqamlar', 'hozir'];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const done = q >= 3;
  const f = useFaza(q, 6, 450, !!storedAnswer);
  const tugadi = useTugadi(done && f >= 6, 900, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const demoN = q === 1 ? Math.min(5, f) : q >= 2 ? 5 : 0;
  const son = q >= 2 || (q === 1 && f >= 4) ? 9 : 8;
  const savollar = q < 2 ? [{ k: 'a' }, { k: 'b' }, { k: 'c' }]
    : S2_SAVOL.map((id, i) => ({ k: id, matn: q > 2 || f > i ? tr(HAKAM_SAVOL[id]) : null }));
  const taymer = q === 0 ? { rejim: 'bosh', vaqtlar: true }
    : {
      rejim: q === 1 ? 'yur' : q === 3 && f < 6 ? 'b' : 'toliq', dav: 2.4, vaqtlar: true,
      sj: q >= 2 ? [0, 1, 2].map(i => (q === 2 ? { holat: 'anim', d: 0.3 + i * 0.45 } : { holat: 'tugadi' })) : null,
      oxir: q >= 2 && (q > 2 || f >= 4) ? '8:00' : null,
      ostida: <YechimQadam qadamlar={MENTOR_SSENARIY.map(s => tr(s))} n={demoN} />
    };
  const yorliq = tr({ uz: 'Mentor misoli · reja', ru: 'Пример Ментора · план' });
  const laptop = q === 3
    ? { yon: true, ulanish: f < 2, video: f >= 2, qaytadan: f >= 1, pufak: f >= 2 ? tr(B_REJA_GAPI) : null, son: 9, bosildi: true, ixcham: tugadi, yonQosh: tugadi && <span className="cs-sahna-y">{yorliq}</span> }
    : { yon: true, son, bosildi: q >= 2 || (q === 1 && f >= 3) };
  const sahna = <ChiqishSahna telYoq={tugadi} className="katta" yorliq={yorliq} hakam={{ savollar }} taymer={taymer} laptop={laptop} telefon={son} telKor={q >= 2 || (q === 1 && f >= 5)} />;
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · butun chiqish', ru: 'Понятие · всё выступление' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Tugmalarni bosing (${q}/3)`, ru: `Нажмите кнопки (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Pitch, demo va savollar <A>birga qanday o'tadi?</A></>, ru: <>Как питч, демо и вопросы <A>проходят вместе?</A></> })}
        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va Mentor chiqishi chiziqda qanday yig'ilishiga qarang.", ru: 'Нажимайте кнопки по одной и смотрите, как выступление Ментора собирается на линии.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Mentor misolida butun chiqish necha daqiqagacha boradi?', ru: 'До скольких минут идёт всё выступление в примере Ментора?' })} variantlar={S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="cs-harakat">
          <Qadamlar3 nomlar={S2_TUGMA} q={q} faol={!!taxmin && (q === 0 || f >= 4)} onBos={() => setQ(n => Math.min(3, n + 1))} />
          {q > 0 && <QIzoh key={q}>{tr(S2_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — chiziqqa nima qo'shiladi?", ru: 'Нажмите активную кнопку — что добавится на линию?' }))}
        </div>}
        vizual={sahna}
        xulosa={done && f >= 6 && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === '8'} aslida={tr({ uz: '8 daqiqagacha', ru: 'до 8 минут' })} />}
          matn={tr({ uz: "Chiqish 8 daqiqagacha; demo ochilmasa taymer to'xtamaydi — video bo'lsa B reja, bo'lmasa og'zaki.", ru: 'Выступление — до 8 минут; если демо не откроется, таймер не останавливается: есть видео — план Б, нет — устно.' })}
          izoh={tr(S2_IZOH[2])} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — HAKAM VARAG'I (QTushuncha; 3 vaziyat ketma-ket — har birida o'z bo'limining 3 belgisi; to'g'ri belgi varaq qatoriga uchadi) =====
const S3_IZOH = { uz: "Butun chiqishga — vaqt, demo va savollarga javobga — belgi qo'yiladigan varaq hakam varag'i deyiladi.", ru: 'Лист, где ставят отметки всему выступлению — времени, демо и ответам на вопросы, — называется листом судьи.' };
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [n, setN] = useState(storedAnswer ? 3 : 0);
  const [xato, setXato] = useState(null); // { k, i }
  const [yangi, setYangi] = useState(null);
  const [band, setBand] = useState(false);
  const xatoBor = useRef(false);
  const kartaRef = useRef(null); const slotRef = useRef([]);
  const [uchir, uchEl] = useUchish();
  const done = n >= 3;
  const tugadi = useTugadi(done, 700, !!storedAnswer);
  const ipucha = useIpucha(!done, n);
  const v = VAZIYAT[Math.min(n, 2)];
  const bos = (k) => {
    if (done || band) return;
    if (k !== v.togri) {
      setXato({ k, i: n }); if (!xatoBor.current) { xatoBor.current = true; if (achMiss && achMiss.miss) achMiss.miss(screen); }
      return;
    }
    setXato(null); setBand(true);
    const b = belgiOb(v.bolim === 'demo' ? 'demo' : 'savol:x', k);
    const tush = () => { setN(n + 1); setYangi(n); setBand(false); setTimeout(() => setYangi(null), 1100); if (n + 1 >= 3 && storedAnswer === undefined) onAnswer(screen, { correct: !xatoBor.current, picked: true }); };
    uchir(kartaRef.current, slotRef.current[n], { matn: tr(b), rang: b.rang }, tush);
  };
  const belgiTug = (bolim) => (bolim === 'demo' ? ['ishladi', 'b-reja', 'ishlamadi'] : ['fakt', 'tekshiraman', 'tegmadi']).map(k => {
    const b = VARAQ_BELGI[bolim][k]; const xt = xato && xato.k === k && xato.i === n;
    return <QChip key={k + (xt ? 'x' : '')} holat={xt ? 'err' : undefined} silk={xt} className="cs-belgi" disabled={band} onClick={() => bos(k)}>{tr(b)}</QChip>;
  });
  const qator = (i, bandId, nom) => ({
    band: bandId, nom, slotRef: el => { slotRef.current[i] = el; }, yangi: yangi === i,
    belgi: i < n ? VAZIYAT[i].togri : null, joriy: i === n && !done,
    tugmalar: i === n && !done && !band ? belgiTug(VAZIYAT[i].bolim) : null
  });
  const qatorlar = [
    { band: 'vaqt', kulrang: tr({ uz: 'm:ss — taymer yozadi', ru: 'м:сс — пишет таймер' }) },
    qator(0, 'demo', null),
    qator(1, 'savol:bozor', n >= 1 ? tr(HAKAM_SAVOL.bozor) : tr({ uz: '1-savol', ru: '1-й вопрос' })),
    qator(2, 'savol:jamoa', n >= 2 ? tr(HAKAM_SAVOL.jamoa) : tr({ uz: '2-savol', ru: '2-й вопрос' }))
  ];
  const varaq = <Varaq qatorlar={qatorlar} yonadi={tugadi} sarlavha={tugadi && <Yoziladi matn={tr({ uz: "Hakam varag'i", ru: 'Лист судьи' })} />} className={tugadi ? 'toliq' : ''} />;
  const vaziyat = !done && <div className="cs-vz" ref={kartaRef} key={'v' + n}>
    <span className="cs-sahna-y">{tr({ uz: 'mashq vaziyati', ru: 'учебная ситуация' })}</span>
    <span className="cs-vz-n">{tr({ uz: 'Vaziyat', ru: 'Ситуация' })} {n + 1}{NB}/{NB}3</span>
    {v.bolim === 'demo'
      ? <><Laptop ixcham ulanish={false} video son={9} /><p className="cs-vz-m">{tr(v.matn)}</p></>
      : <div className="cs-vz-s">
        <div className="cs-vz-hk"><span className="cs-hk-ava kichik"><Varaqcha /></span><p><b>{tr({ uz: 'Hakam:', ru: 'Судья:' })}</b> «{tr(HAKAM_SAVOL[v.savol])}»</p></div>
        <p className="cs-vz-j"><b>{tr({ uz: 'Javob:', ru: 'Ответ:' })}</b> «{tr(v.javob)}»</p>
      </div>}
  </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · hakam belgilari', ru: 'Понятие · отметки судьи' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Belgilarni qo'ying (${n}/3)`, ru: `Поставьте отметки (${n}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Hakam butun chiqishga <A>qanday belgi qo'yadi?</A></>, ru: <>Какие отметки судья <A>ставит всему выступлению?</A></> })}
        mentor={<Mentor>{tr({ uz: "Har vaziyatni o'qing va varaqdagi mos belgini bosing.", ru: 'Прочитайте каждую ситуацию и нажмите подходящую отметку в листе.' })}</Mentor>}
        harakat={!done && <div className="cs-harakat">
          {vaziyat}
          {xato && xato.i === n && <QXato key={xato.k}>{tr(v.xato[xato.k])}</QXato>}
          {ipucha && IPUCHA(tr({ uz: "Vaziyatda nima bo'ldi — varaqdagi qaysi so'z shuni aytadi?", ru: 'Что произошло в ситуации — какое слово в листе это говорит?' }))}
        </div>}
        vizual={varaq}
        xulosa={tugadi && <XulosaQ matn={tr({ uz: "Bu mashqda hakam varag'ida uch narsa: vaqt, demo va har savolga javob.", ru: 'В этом упражнении в листе судьи три вещи: время, демо и ответ на каждый вопрос.' })} izoh={tr(S3_IZOH)} />}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s4 = 2; ikkinchi misol — kitob almashish ilovasi, P-002) =====
const KitobVideo = () => (
  <div className="cs-kitob">
    <TaymerQator rejim="b" nomlar={false} />
    <Laptop ixcham video nom={tr({ uz: 'Kitob almashish', ru: 'Обмен книгами' })} />
  </div>
);
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: '1-savol', ru: '1-й вопрос' })}
    questionText="Kitob ilovangiz chiqishida demo ochilmadi, video tayyor. Nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Kitob ilovangiz chiqishida demo ochilmadi, video tayyor. <A>Nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">На выступлении с вашим книжным приложением демо не открылось, видео готово. <A>Что сделаете?</A></h2> })}
    options={[
      { uz: 'Taymerni to\'xtatib, demoni boshidan boshlayman', ru: 'Остановлю таймер и начну демо сначала' },
      { uz: 'Internet qaytishini hakam bilan birga kutaman', ru: 'Подожду вместе с судьёй, пока вернётся интернет' },
      { uz: "B reja gapini aytib, videoni ko'rsataman", ru: 'Скажу фразу плана Б и покажу видео' },
      { uz: "Demoni tashlab, keyingi bo'lakka o'taman", ru: 'Брошу демо и перейду к следующей части' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "B reja Yechimni ko'rsatadi, taymer esa to'xtamaydi.", ru: 'План Б показывает Решение, а таймер не останавливается.' }}
    explainWrong={{
      0: { uz: "To'liq repetitsiyada taymer to'xtatiladimi?", ru: 'Останавливают ли таймер на полной репетиции?' },
      1: { uz: 'Kutganingizda taymer yuradi — vaqt qayerga ketadi?', ru: 'Пока вы ждёте, таймер идёт — куда уходит время?' },
      3: { uz: "Video tayyor — hakam Yechimni ko'rmay qoladimi?", ru: 'Видео готово — неужели судья не увидит Решение?' },
      default: { uz: "Demo ochilmasa, to'liq repetitsiyada nima qilinadi?", ru: 'Что делают на полной репетиции, если демо не открылось?' }
    }}
    vizual={<KitobVideo />} />
);

// ===== SCREEN 5 — CHIQISHDAN OLDIN (QMustaqil; ketma-ket karta, 4 qism; tanlov — kuzatilgan holat → pm-m12d13-repetitsiya.tayyorlov) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const demo = useMemo(() => demoOl(), []);
  const usullar = useMemo(() => ochiqUsullar(), []);
  const r0 = useMemo(() => repOl(), []);
  const [tanlov, setTanlov] = useState(() => (r0 && r0.tayyorlov && typeof r0.tayyorlov === 'object' ? { ...r0.tayyorlov } : {}));
  const [saqlandi, setSaqlandi] = useState(() => !!(r0 && r0.tayyorlov && TAYYORLOV.every(c => r0.tayyorlov[c.id])));
  const [joriy, setJoriy] = useState(() => (saqlandi ? null : 0));
  const [ochiq, setOchiq] = useState(() => (saqlandi ? 4 : 0)); // nechta karta ochilgan (ixcham qatorlar)
  const [xato, setXato] = useState(false);
  const [yordam, setYordam] = useState(false);
  const belgilangan = TAYYORLOV.filter(c => tanlov[c.id]).length;
  const k = tayyorSoni(tanlov);
  const c = joriy !== null ? TAYYORLOV[joriy] : null;
  const keyingi = () => {
    if (!c || !tanlov[c.id]) { setXato(true); return; }
    setXato(false); setYordam(false);
    if (joriy < 3) { const nx = joriy + 1; setJoriy(nx); setOchiq(o => Math.max(o, nx)); return; }
    // Saqlash
    if (!isMentor) repYoz({ tayyorlov: { backend: tanlov.backend, video: tanlov.video, namuna: tanlov.namuna, qurilma: tanlov.qurilma } });
    if (achMiss && achMiss.earn) achMiss.earn('fourChecks');
    if (storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'tayyorlov', solved: true, correct: true, picked: true });
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    setSaqlandi(true); setJoriy(null); setOchiq(4);
  };
  const tanla = (val) => { if (!c) return; setTanlov(t => ({ ...t, [c.id]: val })); setXato(false); };
  const doiralar = <div className="cs-doiralar">
    {TAYYORLOV.map((t, i) => {
      const v = t.tanlovlar.find(x => x.k === tanlov[t.id]);
      return <span key={t.id} className={cxx('cs-doira', joriy === i && 'on', v && (v.tayyor ? 'ok' : 'yol'))}><i>{v && v.tayyor ? '✓' : i + 1}</i>{tr(t.nom)}</span>;
    })}
  </div>;
  const ogoh = usullar.length > 0 && <p className="cs-kulrang">{tr({ uz: '7-darsda', ru: 'На 7-м уроке' })} {usullar.map(u => '«' + tr(USUL_NOM[u]) + '»').join(', ')} {tr({ uz: "hali ochiq qolgan — chiqishda buzilsa, B rejaga o'tasiz.", ru: 'пока остался открытым — если сломается на выступлении, перейдёте на план Б.' })}</p>;
  const ixchamlar = !saqlandi && joriy !== null && TAYYORLOV.some((t, i) => i !== joriy && i < ochiq && tanlov[t.id]) && <div className="cs-ix-ro">
    {TAYYORLOV.slice(0, ochiq).map((t, i) => i === joriy || !tanlov[t.id] ? null : (
      <div key={t.id} className="cs-ix"><b>{tr(t.nom)}</b><span>{tanlov[t.id] ? tr(t.tanlovlar.find(x => x.k === tanlov[t.id]).t) : ''}</span>
        <button type="button" className="cs-tahrir" onClick={() => { setJoriy(i); setXato(false); }} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button></div>
    ))}
  </div>;
  const kulrangYol = (t, val) => {
    const v = t.tanlovlar.find(x => x.k === val);
    const demoYoq = demo && ((t.id === 'backend' && demo.uygotish !== true) || (t.id === 'video' && demo.video !== true));
    if (!((v && !v.tayyor) || (!val && demoYoq))) return null;
    return <><p className="cs-kulrang">{tr(t.yol)}</p>{t.yol2 && <p className="cs-kulrang">{tr(t.yol2)}</p>}</>;
  };
  const yordamBlok = yordam && <div className="cs-yordam fade-step">
    <p>{tr({ uz: 'Mentor misolida:', ru: 'В примере Ментора:' })}</p>
    <ol>{TAYYORLOV.map((t, i) => <li key={t.id} className={i === joriy ? 'on' : ''}>{tr(t.yordam)}</li>)}</ol>
    <p>{tr({ uz: "Chiqishgacha navbat cho'zilsa — demo yo'lini yana bir marta oching.", ru: 'Если очередь до выступления затянется — откройте путь демо ещё раз.' })}</p>
  </div>;
  const karta = c && (
    <div key={c.id} className="cs-karta">
      <span className="q-yorliq">{joriy + 1} · {tr(c.nom)}</span>
      <p className="cs-karta-ish">{tr(c.ish)}</p>
      <div className="cs-tanlov">
        {c.tanlovlar.map(t => <QChip key={t.k} holat={tanlov[c.id] === t.k ? (t.tayyor ? 'ok' : 'on') : undefined} className="cs-tugma" onClick={() => tanla(t.k)}>{tr(t.t)}</QChip>)}
      </div>
      {kulrangYol(c, tanlov[c.id])}
      {xato && <QXato>{tr({ uz: 'Nima ko\'rganingizni belgilang.', ru: 'Отметьте, что вы увидели.' })}</QXato>}
      {yordamBlok}
      <div className="cs-karta-tug">
        <QTugma className={cxx(tanlov[c.id] && 'cs-halqa')} onClick={keyingi}>{joriy < 3 ? tr({ uz: 'Keyingi', ru: 'Далее' }) : tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
        <QTugma ikkinchi className="cs-o" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      </div>
    </div>
  );
  const yakun = saqlandi && <div className="cs-fokus">
    <div className="cs-ix cs-ix-bir"><b>{tr({ uz: 'Chiqishdan oldin', ru: 'Перед выступлением' })} · {k}{NB}✓</b>
      <button type="button" className="cs-tahrir" onClick={() => { setSaqlandi(false); setJoriy(0); setOchiq(4); }} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button></div>
    <QXulosa>{k === 4
      ? tr({ uz: "To'rttasi tayyor: demo yo'li ochiq, video bor, namuna akkaunt bilan kirgansiz.", ru: 'Все четыре готовы: путь демо открыт, видео есть, вы вошли с демо-аккаунтом.' })
      : tr({ uz: `${k} tasi tayyor; qolganining yo'li kartada yozildi.`, ru: `Готово: ${k}; путь для остальных записан в карточке.` })}</QXulosa>
  </div>;
  const mentorForma = <div className="cs-fokus">
    <span className="cs-sahna-y">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</span>
    <div className="cs-m4">{TAYYORLOV.map((t, i) => <div key={t.id} className="cs-m4-k"><b>{i + 1} · {tr(t.nom)}</b><span>{tr(t.yordam)}</span></div>)}</div>
    <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Chiqishga tayyorlanganlar', ru: 'Подготовились к выступлению' }} son />
  </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · chiqishdan oldin', ru: 'Самостоятельная работа · перед выступлением' })} screen={screen} scrollSignal={(joriy ?? 9) * 10 + belgilangan} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={saqlandi} disabled={!saqlandi && !isMentor} label={saqlandi || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Kartalarni belgilang (${belgilangan}/4)`, ru: `Отметьте карточки (${belgilangan}/4)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Chiqishdan oldin <A>to'rt narsani tekshiring.</A></>, ru: <>Перед выступлением <A>проверьте четыре вещи.</A></> })}
        mentor={<Mentor>{tr({ uz: "Har kartadagi ishni laptop va telefoningizda qiling, keyin nima ko'rganingizni belgilang.", ru: 'Сделайте дело из каждой карточки на ноутбуке и телефоне, потом отметьте, что увидели.' })}</Mentor>}
        qadamlar={!isMentor && <>{doiralar}{ogoh}</>}
        forma={isMentor ? mentorForma : saqlandi ? yakun : <>{ixchamlar}{karta}</>}
      />
    </Stage>
  );
};

// ===== SCREEN 6 — TO'LIQ REPETITSIYA (QMustaqil; hakam tanlovi → taymer 5:00 → savol-javob 3 savol; vaqt Date.now() farqidan) =====
const TUR_NOM = { hakam: { uz: 'Mentor yoki mehmon', ru: 'Ментор или гость' }, guruh: { uz: 'Guruhdagi tinglovchi', ru: 'Слушатель из группы' }, yakka: { uz: "O'zim — yakka", ru: 'Сам — один' } };
const aralash = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const studentLive = !!(_live && _live.mode === 'student');
  const r0 = useMemo(() => repOl(), []);
  const fin = useMemo(() => finalOl(), []);
  const demo = useMemo(() => demoOl(), []);
  const [tur, setTur] = useState(() => (r0 && r0.tur) || null);
  const [vaqt, setVaqt] = useState(() => (r0 && sonmi(r0.vaqt) ? r0.vaqt : null));
  const [savollar, setSavollar] = useState(() => (r0 && Array.isArray(r0.varaq) ? r0.varaq.filter(x => x && String(x.band).startsWith('savol:')).map(x => ({ id: String(x.band).slice(6), sek: null })) : []));
  const [tab, setTab] = useState(() => (r0 && sonmi(r0.vaqt) ? 1 : 0));
  const [bosh, setBosh] = useState(null); // pitch taymeri boshlangan payt (Date.now)
  const [qJoriy, setQJoriy] = useState(null); // { id, bosh }
  const [now, setNow] = useState(Date.now());
  const [xato, setXato] = useState(false);
  const [tugamadiB, setTugamadiB] = useState(() => !!(storedAnswer && storedAnswer.tugamadi));
  const [yakkaNavbat] = useState(() => { const yangi = SAVOL_ID.filter(id => !fin.ids.includes(id)); const eski = SAVOL_ID.filter(id => fin.ids.includes(id)); return [...aralash(yangi), ...aralash(eski)].slice(0, 3); });
  const sjRef = useRef([]); const tugRef = useRef({});
  const [uchir, uchEl] = useUchish();
  const yuradi = bosh !== null || qJoriy !== null;
  useEffect(() => { if (!yuradi) return undefined; const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t); }, [yuradi]);
  const sek = bosh !== null ? (now - bosh) / 1000 : (vaqt ?? 0);
  const n = savollar.length;
  const yakka = tur === 'yakka';
  const sigTur = { hakam: 100, guruh: 150, yakka: 200 };
  const boshla = () => { if (!tur) { setXato(true); return; } setXato(false); setNow(Date.now()); setBosh(Date.now()); };
  const bekor = () => { setBosh(null); };
  const toxtat = () => {
    if (bosh === null) return;
    const s = Math.round((Date.now() - bosh) / 1000);
    setVaqt(s); setBosh(null); setTab(1);
    if (!isMentor) repYoz({ vaqt: s, tur, savollar: 0, savolJavobTugadi: false, demo: null, varaq: [{ band: 'vaqt', belgi: s <= PITCH_S ? 'sigdi' : 'oshdi' }] });
    if (storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'repetitsiya', solved: true, correct: true, picked: true });
    if (studentLive) {
      _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
      if (s <= PITCH_S) _live.submitAnswer(PRACTICE_BASE + 50 + screen, 'practice', 0, true, 0);
      if (sigTur[tur]) _live.submitAnswer(PRACTICE_BASE + sigTur[tur] + screen, 'practice', 0, true, 0);
    }
  };
  const savolBer = (id) => {
    if (qJoriy || n >= 3 || vaqt === null) return;
    const bosla = () => { setNow(Date.now()); setQJoriy({ id, bosh: Date.now() }); };
    uchir(tugRef.current[id], sjRef.current[n], { matn: savolMatn(id), rang: 'acc' }, bosla);
  };
  const boshqaId = () => 'boshqa:' + (savollar.filter(s => s.id.startsWith('boshqa')).length + 1);
  const savolToxtat = () => {
    if (!qJoriy) return;
    const s = Math.round((Date.now() - qJoriy.bosh) / 1000);
    const yangi = [...savollar, { id: qJoriy.id, sek: s }];
    setSavollar(yangi); setQJoriy(null);
    if (!isMentor) { const r = repOl() || {}; const vq = Array.isArray(r.varaq) ? r.varaq.filter(x => x && !String(x.band).startsWith('savol:')) : []; repYoz({ savollar: yangi.length, savolJavobTugadi: yangi.length === 3, varaq: [...vq, ...yangi.map(q => ({ band: 'savol:' + q.id, belgi: null }))] }); }
  };
  // Yakka rejimda dars savollarni navbat bilan o'zi beradi
  useEffect(() => {
    if (!yakka || tab !== 1 || vaqt === null || qJoriy || n >= 3) return undefined;
    const t = setTimeout(() => { setNow(Date.now()); setQJoriy({ id: yakkaNavbat[n], bosh: Date.now() }); }, kamHarakat() ? 0 : 700);
    return () => clearTimeout(t);
  }, [yakka, tab, vaqt, qJoriy, n]); // eslint-disable-line
  const tugamadi = () => {
    if (!isMentor) repYoz({ savolJavobTugadi: false });
    setTugamadiB(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'repetitsiya', solved: true, correct: true, picked: true, tugamadi: true });
    onNext();
  };
  const qsek = qJoriy ? (now - qJoriy.bosh) / 1000 : 0;
  const sj = [0, 1, 2].map(i => {
    if (i < n) { const s = savollar[i].sek; return { holat: 'tugadi', yozuv: s === null ? '✓' : mss(s) }; }
    if (i === n && qJoriy) return qsek > SAVOL_S ? { holat: 'osh', yozuv: '+' + mss(qsek - SAVOL_S) } : { holat: 'yur', w: qsek / SAVOL_S, yozuv: mss(qsek) };
    return { holat: 'bosh' };
  });
  const qadamlar = demo && demo.ssenariy.length ? demo.ssenariy.slice(0, 5) : null;
  const videoBor = (() => { const r = repOl(); const t = r && r.tayyorlov; if (t && t.video) return t.video === 'ochildi'; return !!(demo && demo.video === true); })();
  const pitchTugadi = vaqt !== null;
  const navbatKelmadi = studentLive && typeof _live.mentorScreen === 'number' && _live.mentorScreen > screen && !pitchTugadi;
  const turTanlov = !pitchTugadi && <div className={cxx('cs-tur', !tur && 'kutish', xato && 'err')}>
    <span className="cs-tur-y">{tr({ uz: 'Hakam kim?', ru: 'Кто судья?' })}</span>
    {Object.keys(TUR_NOM).map(k => <QChip key={k} holat={tur === k ? 'on' : undefined} className="cs-tugma" disabled={bosh !== null} onClick={() => { setTur(k); setXato(false); }}>{tr(TUR_NOM[k])}</QChip>)}
  </div>;
  const tablar = <div className="cs-qadamlar">
    {[{ uz: 'Pitch', ru: 'Питч' }, { uz: 'Savol-javob', ru: 'Вопросы-ответы' }].map((t, i) => (
      <QChip key={i} holat={tab === i ? 'on' : (i === 0 && pitchTugadi) || (i === 1 && n >= 3) ? 'ok' : undefined} className={cxx('cs-tugma', i === 1 && pitchTugadi && n < 3 && tab !== 1 && 'cs-joriy')} disabled={i === 1 ? !pitchTugadi : bosh !== null || qJoriy !== null} onClick={() => setTab(i)}>
        <i>{(i === 0 && pitchTugadi) || (i === 1 && n >= 3) ? '✓' : i + 1}</i>{tr(t)}
      </QChip>
    ))}
  </div>;
  const taymer = <TaymerQator katta rejim={pitchTugadi || bosh !== null ? 'jonli' : 'bosh'} sek={sek} sj={sj} sjRef={sjRef} sjOk={n >= 3}
    ostida={<div className="cs-yq"><span className="cs-yq-y">{tr(BOLAK_NOM.yechim)}:</span>{qadamlar ? qadamlar.map((q, i) => <span key={i} className="cs-yq-q kul"><i>{i + 1}</i>{q}</span>) : <span className="cs-yq-q kul">{tr({ uz: 'jonli demo', ru: 'живое демо' })}</span>}</div>} />;
  const pitchPanel = <>
    {!pitchTugadi && bosh === null && <div className="cs-oldin">
      <b>{tr({ uz: 'Pitchdan oldin', ru: 'Перед питчем' })}</b>
      <p>{tr({ uz: 'Taymer va savollar — hakamning qurilmasida; demo — sizning laptopingizda.', ru: 'Таймер и вопросы — на устройстве судьи; демо — на вашем ноутбуке.' })}</p>
      <p>{tr({ uz: "Navbatingiz uzoq cho'zilsa — demo yo'lini yana ochib ko'ring.", ru: 'Если очередь затянется — откройте путь демо ещё раз.' })}</p>
      {demo && demo.otishVaqt !== null && <p>{tr({ uz: `6-darsda demo o'tishingiz ${demo.otishVaqt} soniya edi — bu mashqda Yechim 90 soniya.`, ru: `На 6-м уроке ваш проход демо занял ${demo.otishVaqt} секунд — в этом упражнении Решение 90 секунд.` })}</p>}
    </div>}
    <div className="cs-soat">
      <b className={cxx('cs-soat-v', sek > PITCH_S && 'osh')}>{pitchTugadi ? tr({ uz: 'Pitch:', ru: 'Питч:' }) + ' ' + mss(vaqt) : mss(sek)}</b>
      {!pitchTugadi && bosh === null && <QTugma className={cxx(tur && 'cs-halqa')} disabled={!tur} onClick={boshla}>{tr({ uz: '5 daqiqani boshlash', ru: 'Запустить 5 минут' })}</QTugma>}
      {bosh !== null && <QTugma className="cs-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
      {bosh !== null && sek < BOSH_S[1] && <QTugma ikkinchi onClick={bekor}>{tr({ uz: 'Bekor qilish', ru: 'Отменить' })}</QTugma>}
    </div>
    {!tur && !pitchTugadi && <p className="cs-kulrang">{tr({ uz: 'Avval hakam kimligini tanlang.', ru: 'Сначала выберите, кто судья.' })}</p>}
    {!pitchTugadi && <p className="cs-kulrang">{videoBor
      ? tr({ uz: "Demo ochilmasa — B reja gapini ayting va videoni oching; taymer yuraveradi.", ru: 'Если демо не откроется — скажите фразу плана Б и откройте видео; таймер идёт дальше.' })
      : tr({ uz: "Demo ochilmasa — Yechimni og'zaki aytib bering; taymer yuraveradi.", ru: 'Если демо не откроется — расскажите Решение устно; таймер идёт дальше.' })}</p>}
  </>;
  const savolPanel = n < 3 && <>
    {!yakka && <p className="cs-yoriq">{tr({ uz: "Hakam savolni ovoz chiqarib bersin va uning tugmasini bossin — javobga 1 daqiqa.", ru: 'Пусть судья задаст вопрос вслух и нажмёт его кнопку — на ответ 1 минута.' })}</p>}
    <p className="cs-kulrang">{tr({ uz: '1 daqiqa — mashq taymeri; varaqda javob vaqti belgilanmaydi.', ru: '1 минута — учебный таймер; время ответа в листе не отмечается.' })}</p>
    {qJoriy
      ? <div className="cs-sj-karta"><span className="q-yorliq">{n + 1}-{tr({ uz: 'savol', ru: 'й вопрос' })}</span><b>{savolMatn(qJoriy.id)}</b>
        <QTugma className="cs-halqa" onClick={savolToxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma></div>
      : !yakka && <div className="cs-savollar">
        {SAVOL_ID.map(id => { const berildi = savollar.some(s => s.id === id); return (
          <button key={id} type="button" ref={el => { tugRef.current[id] = el; }} className={cxx('cs-savol', berildi && 'berildi')} disabled={berildi} onClick={() => savolBer(id)}>
            <span>{tr(HAKAM_SAVOL[id])}</span>{fin.ids.includes(id) && <em>{tr({ uz: '8-darsda bo\'lgan', ru: 'был на 8-м уроке' })}</em>}
          </button>); })}
        <button type="button" ref={el => { tugRef.current.boshqa = el; }} className="cs-savol boshqa" onClick={() => { const id = boshqaId(); tugRef.current[id] = tugRef.current.boshqa; savolBer(id); }}><span>{tr({ uz: 'Boshqa savol', ru: 'Другой вопрос' })}</span></button>
      </div>}
  </>;
  const xulosa = pitchTugadi && (n >= 3 || (tugamadiB && !qJoriy));
  const xulosaMatn = !pitchTugadi ? null : yakka
    ? tr({ uz: `Chiqish o'tildi: pitch ${mss(vaqt)}, ${n} ta savol. Endi varaqni o'zingiz to'ldirasiz.`, ru: `Выступление пройдено: питч ${mss(vaqt)}, вопросов: ${n}. Теперь лист заполните сами.` })
    : n < 3 ? tr({ uz: `Pitch o'tildi, savol-javob ${n}/3 da qoldi — varaqni to'ldiring.`, ru: `Питч пройден, вопросы-ответы остановились на ${n}/3 — заполните лист.` })
    : n >= 3 ? tr({ uz: `Chiqish o'tildi: pitch ${mss(vaqt)}, 3 savol. Endi qurilmani hakamga bering.`, ru: `Выступление пройдено: питч ${mss(vaqt)}, 3 вопроса. Теперь отдайте устройство судье.` }) : null;
  return (
    <Stage eyebrow={tr({ uz: "Mustaqil ish · to'liq repetitsiya", ru: 'Самостоятельная работа · полная репетиция' })} screen={screen} scrollSignal={n * 10 + tab + (pitchTugadi ? 5 : 0)} navContent={<>
      <NavBack onPrev={onPrev} />
      {pitchTugadi && n < 3 && !qJoriy && <button type="button" className="btn-ghost cs-chet" onClick={tugamadi}>{tr({ uz: 'Savol-javob tugamadi', ru: 'Вопросы-ответы не закончились' })}</button>}
      {navbatKelmadi && <button type="button" className="btn-ghost cs-chet" onClick={onNext}>{tr({ uz: 'Navbatim kelmadi', ru: 'Моя очередь не дошла' })}</button>}
      <NavNext halqa={pitchTugadi && (n >= 3 || tugamadiB)} disabled={!(pitchTugadi && (n >= 3 || tugamadiB)) && !isMentor} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />
    </>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Chiqishingizni <A>boshidan oxirigacha o'ting.</A></>, ru: <>Пройдите своё выступление <A>от начала до конца.</A></> })}
        mentor={<Mentor>{yakka
          ? tr({ uz: "«5 daqiqani boshlash»ni bosing va butun chiqishni ovoz chiqarib o'ting.", ru: 'Нажмите «Запустить 5 минут» и пройдите всё выступление вслух.' })
          : tr({ uz: "Hakam kimligini tanlang, so'ng hakam «5 daqiqani boshlash»ni bossin.", ru: 'Выберите, кто судья, затем пусть судья нажмёт «Запустить 5 минут».' })}</Mentor>}
        qadamlar={<>{turTanlov}{tablar}</>}
        forma={<div className="cs-fokus">
          <Zoomable>{taymer}</Zoomable>
          {tab === 0 ? pitchPanel : savolPanel}
          {xulosa && <QXulosa>{xulosaMatn}</QXulosa>}
          {xulosa && <p className="cs-kulrang">{tr({ uz: 'Demo holatini boshiga qaytaring: keyingi chiqish ham o\'sha holatdan boshlansin.', ru: 'Верните демо в исходное состояние: следующее выступление пусть начнётся оттуда же.' })}</p>}
          {isMentor && <>
            <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: "Chiqishni o'tganlar", ru: 'Прошли выступление' }} son />
            <MentorPracticeStats live={_live} screen={screen} sig={PRACTICE_BASE + 50 + screen} yorliq={{ uz: "5 daqiqaga sig'ganlar", ru: 'Уложились в 5 минут' }} son />
            {Object.keys(TUR_NOM).map(k => <MentorPracticeStats key={k} live={_live} screen={screen} sig={PRACTICE_BASE + sigTur[k] + screen} yorliq={{ uz: 'Hakam: ' + TUR_NOM[k].uz, ru: 'Судья: ' + TUR_NOM[k].ru }} son />)}
          </>}
        </div>}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 7 — HAKAM VARAG'I (QMustaqil; ketma-ket karta — Vaqt (o'zi) · Demo · har savol; saqlash → demo, varaq[].belgi) =====
const TUR_VARAQ = { hakam: { uz: 'Mentor yoki mehmon', ru: 'Ментор или гость' }, guruh: { uz: 'tinglovchi', ru: 'слушатель' }, yakka: { uz: "o'zim", ru: 'сам' } };
const varaqHolat = (r) => {
  if (!r || !Array.isArray(r.varaq)) return { yashil: false, tekshir: 0, tuzat: [] };
  const v = r.varaq; const sv = v.filter(x => String(x.band).startsWith('savol:'));
  const vaqtB = (v.find(x => x.band === 'vaqt') || {}).belgi; const demoB = r.demo;
  const tegmadi = sv.filter(x => x.belgi === 'tegmadi').length; const tekshir = sv.filter(x => x.belgi === 'tekshiraman').length;
  const tuzat = [];
  if (vaqtB === 'oshdi') tuzat.push('vaqt');
  if (demoB && demoB !== 'ishladi') tuzat.push('demo');
  sv.forEach((x, i) => { if (x.belgi === 'tegmadi' || x.belgi === 'tekshiraman') tuzat.push('s' + (i + 1)); });
  return { yashil: vaqtB === 'sigdi' && demoB === 'ishladi' && tegmadi === 0, tekshir, tegmadi, tuzat, oshdi: vaqtB === 'oshdi', demoB };
};
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const r0 = useMemo(() => repOl(), []);
  const fin = useMemo(() => finalOl(), []);
  const vaqt = r0 && sonmi(r0.vaqt) ? r0.vaqt : null;
  const tur = (r0 && r0.tur) || 'guruh';
  const svq = r0 && Array.isArray(r0.varaq) ? r0.varaq.filter(x => x && String(x.band).startsWith('savol:')) : [];
  const kartalar = [{ band: 'vaqt' }, { band: 'demo' }, ...svq.map(x => ({ band: x.band }))];
  const N = kartalar.length;
  const [belgi, setBelgi] = useState(() => {
    const o = { vaqt: vaqt === null ? null : (vaqt <= PITCH_S ? 'sigdi' : 'oshdi'), demo: (r0 && r0.demo) || null };
    svq.forEach(x => { o[x.band] = x.belgi || null; }); return o;
  });
  const [saqlandi, setSaqlandi] = useState(() => !!(storedAnswer && storedAnswer.saqlandi) || !!(r0 && r0.demo && svq.every(x => x.belgi)));
  const [joriy, setJoriy] = useState(0);
  const [xato, setXato] = useState(false);
  const [yangi, setYangi] = useState(null);
  const tayyorN = kartalar.filter(k => belgi[k.band]).length;
  const k = kartalar[joriy];
  const savolNo = (band) => svq.findIndex(x => x.band === band) + 1;
  const nomi = (band) => (band === 'vaqt' ? tr({ uz: 'Vaqt', ru: 'Время' }) : band === 'demo' ? tr({ uz: 'Demo', ru: 'Демо' }) : savolNo(band) + '-' + tr({ uz: 'savol', ru: 'й вопрос' }));
  const keyingi = () => {
    if (!belgi[k.band]) { setXato(true); return; }
    setXato(false); setYangi(k.band); setTimeout(() => setYangi(null), 1100);
    if (joriy < N - 1) { setJoriy(joriy + 1); return; }
    if (!isMentor) {
      const r = repOl() || {};
      const varaq = [{ band: 'vaqt', belgi: belgi.vaqt }, ...svq.map(x => ({ band: x.band, belgi: belgi[x.band] }))];
      repYoz({ demo: belgi.demo, varaq: [{ band: 'vaqt', belgi: belgi.vaqt }, { band: 'demo', belgi: belgi.demo }, ...varaq.slice(1)], savolJavobTugadi: r.savolJavobTugadi === true });
    }
    if (achMiss && achMiss.earn) achMiss.earn('fullRehearsal');
    if (storedAnswer === undefined || !storedAnswer.saqlandi) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'varaq', solved: true, correct: true, picked: true, saqlandi: true });
    if (_live && _live.mode === 'student') {
      _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
      const dz = { ishladi: 50, 'b-reja': 100, ishlamadi: 150 }[belgi.demo];
      if (dz) _live.submitAnswer(PRACTICE_BASE + dz + screen, 'practice', 0, true, 0);
    }
    setSaqlandi(true);
  };
  const strip = <div className="cs-strip">
    <span className="cs-strip-y">{tr({ uz: "Hakam varag'i", ru: 'Лист судьи' })} · {tayyorN}{NB}/{NB}{N}</span>
    {kartalar.map((c, i) => { const b = belgiOb(c.band, belgi[c.band]); return (
      <button key={c.band} type="button" className={cxx('cs-strip-q', b && b.rang, i === joriy && 'on', yangi === c.band && 'yangi')} disabled={!belgi[c.band] && i !== joriy} onClick={() => { setJoriy(i); setXato(false); }}>
        <i>{belgi[c.band] ? '✓' : i + 1}</i>{nomi(c.band)}{b && <em>{tr(b)}</em>}{belgi[c.band] && i !== joriy && <span className="cs-strip-e" aria-hidden="true">✎</span>}
      </button>); })}
  </div>;
  const belgiTanlov = (band) => (band === 'demo' ? ['ishladi', 'b-reja', 'ishlamadi'] : ['fakt', 'tekshiraman', 'tegmadi']).map(b => {
    const ob = belgiOb(band, b);
    return <QChip key={b} holat={belgi[band] === b ? 'on' : undefined} className={cxx('cs-belgi', belgi[band] === b && ob.rang)} onClick={() => { setBelgi(o => ({ ...o, [band]: b })); setXato(false); }}>{tr(ob)}</QChip>;
  });
  const karta = k && <div key={k.band} className="cs-karta">
    <span className="q-yorliq">{nomi(k.band)}</span>
    {k.band === 'vaqt'
      ? <div className="cs-vaqt-k"><b>{tr({ uz: 'Pitch:', ru: 'Питч:' })} {mss(vaqt)}</b><BelgiChip band="vaqt" k={belgi.vaqt} />{belgi.vaqt === 'oshdi' && <span className="cs-osh">+{mss(vaqt - PITCH_S)}</span>}</div>
      : k.band === 'demo'
        ? <p className="cs-karta-ish">{tr({ uz: "Jonli demo qanday o'tdi?", ru: 'Как прошло живое демо?' })}</p>
        : <p className="cs-karta-ish">{savolMatn(k.band.slice(6))}</p>}
    {k.band === 'vaqt' && fin.vaqt !== null && <p className="cs-kulrang">{tr({ uz: '8-darsda:', ru: 'На 8-м уроке:' })} {mss(fin.vaqt)}</p>}
    {k.band !== 'vaqt' && <div className="cs-tanlov">{belgiTanlov(k.band)}</div>}
    {xato && <QXato>{tr({ uz: 'Bitta belgini tanlang.', ru: 'Выберите одну отметку.' })}</QXato>}
    <div className="cs-karta-tug"><QTugma className={cxx(belgi[k.band] && 'cs-halqa')} onClick={keyingi}>{joriy < N - 1 ? tr({ uz: 'Keyingi', ru: 'Далее' }) : tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>
  </div>;
  const r = saqlandi ? { ...(r0 || {}), demo: belgi.demo, varaq: [{ band: 'vaqt', belgi: belgi.vaqt }, ...svq.map(x => ({ band: x.band, belgi: belgi[x.band] }))] } : null;
  const h = varaqHolat(r);
  const tuzatNom = (t) => (t === 'vaqt' ? tr({ uz: 'vaqt', ru: 'время' }) : t === 'demo' ? tr({ uz: 'demo', ru: 'демо' }) : t.slice(1) + '-' + tr({ uz: 'savol', ru: 'й вопрос' }));
  const xulosa = saqlandi && (h.yashil && h.tekshir === 0
    ? tr({ uz: "Varaq saqlandi: vaqtga sig'dingiz, demo ishladi, savollarga javob bor.", ru: 'Лист сохранён: вы уложились во время, демо сработало, на вопросы есть ответы.' })
    : h.yashil && h.tekshir > 0
      ? tr({ uz: `Varaq saqlandi: hammasi joyida; ${h.tekshir} savolga javobni uyda tekshirasiz.`, ru: `Лист сохранён: всё на месте; ответ на вопросы (${h.tekshir}) проверите дома.` })
      : tr({ uz: `Varaq saqlandi. Tuzatiladigan joy: ${h.tuzat.map(tuzatNom).join(' · ')} — uyga vazifada.`, ru: `Лист сохранён. Что исправить: ${h.tuzat.map(tuzatNom).join(' · ')} — в домашнем задании.` }));
  const varaqKatta = saqlandi && <div className="cs-fokus">
    <Zoomable><Varaq yonadi sarlavha={tr({ uz: "Hakam varag'i", ru: 'Лист судьи' }) + ' · ' + tr(TUR_VARAQ[tur] || TUR_VARAQ.guruh)}
      qatorlar={[{ band: 'vaqt', nom: tr({ uz: 'Pitch:', ru: 'Питч:' }) + ' ' + mss(vaqt), belgi: belgi.vaqt }, { band: 'demo', belgi: belgi.demo }, ...svq.map(x => ({ band: x.band, nom: savolMatn(x.band.slice(6)), belgi: belgi[x.band] }))]} /></Zoomable>
    <QXulosa><XulosaQ matn={xulosa} izoh={h.oshdi ? tr({ uz: "Vaqt oshsa — takrorlangan yoki ortiqcha gapni qisqartirib, taymer bilan qayta o'lchang.", ru: 'Если время превышено — сократите повторы или лишние фразы и снова замерьте с таймером.' }) : null} /></QXulosa>
  </div>;
  const mentorForma = <div className="cs-fokus">
    <Zoomable><Varaq qatorlar={[{ band: 'vaqt', belgi: 'sigdi', qosh: <BelgiChip band="vaqt" k="oshdi" /> }, { band: 'demo', belgi: 'ishladi', qosh: <><BelgiChip band="demo" k="b-reja" /><BelgiChip band="demo" k="ishlamadi" /></> }, { band: 'savol:x', belgi: 'fakt', qosh: <><BelgiChip band="savol:x" k="tekshiraman" /><BelgiChip band="savol:x" k="tegmadi" /></> }]} /></Zoomable>
    <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Varaqni saqlaganlar', ru: 'Сохранили лист' }} son />
    <MentorPracticeStats live={_live} screen={screen} sig={PRACTICE_BASE + 50 + screen} yorliq={{ uz: 'Demo: ishladi', ru: 'Демо: сработало' }} son />
    <MentorPracticeStats live={_live} screen={screen} sig={PRACTICE_BASE + 100 + screen} yorliq={{ uz: 'Demo: B reja', ru: 'Демо: план Б' }} son />
    <MentorPracticeStats live={_live} screen={screen} sig={PRACTICE_BASE + 150 + screen} yorliq={{ uz: 'Demo: ishlamadi', ru: 'Демо: не сработало' }} son />
  </div>;
  const otilmagan = vaqt === null && !isMentor;
  return (
    <Stage eyebrow={tr({ uz: "Mustaqil ish · hakam varag'i", ru: 'Самостоятельная работа · лист судьи' })} screen={screen} scrollSignal={joriy * 10 + tayyorN + (saqlandi ? 100 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={saqlandi} disabled={!saqlandi && !isMentor && !otilmagan} label={saqlandi || isMentor || otilmagan ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Har kartaga belgi (${tayyorN}/${N})`, ru: `Отметка на каждую карточку (${tayyorN}/${N})` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tur === 'yakka'
          ? tr({ uz: <>Mashq varag'iga <A>qanday belgi qo'yasiz?</A></>, ru: <>Какие отметки <A>поставите в учебный лист?</A></> })
          : tr({ uz: <>Hakam chiqishingizga <A>qanday belgi qo'ydi?</A></>, ru: <>Какие отметки судья <A>поставил вашему выступлению?</A></> })}
        mentor={<Mentor>{tur === 'yakka'
          ? tr({ uz: "Har kartada bittasini o'zingiz tanlang — bu mashq varag'i.", ru: 'В каждой карточке выберите одно сами — это учебный лист.' })
          : tr({ uz: "Dars ochiq qurilmangizni hakamga bering: u har kartada bittasini tanlaydi.", ru: 'Отдайте судье устройство с открытым уроком: он выберет по одной отметке в каждой карточке.' })}</Mentor>}
        qadamlar={!isMentor && !saqlandi && !otilmagan && strip}
        forma={isMentor ? mentorForma : otilmagan ? <p className="cs-kulrang">{tr({ uz: "To'liq repetitsiya hali o'tilmagan — keyingi imkoniyatda.", ru: 'Полная репетиция ещё не пройдена — при следующей возможности.' })}</p> : saqlandi ? varaqKatta : karta}
      />
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s8 = 0; ikki qoida birga — hakam varag'i va pitch vaqti) =====
const VaqtQator = () => (
  <div className="cs-vqm">
    <span className="cs-vq-n">{tr({ uz: 'Vaqt', ru: 'Время' })}</span>
    <BelgiChip band="vaqt" k="oshdi" />
    <span className="cs-vqm-r">{tr({ uz: "qayta o'lchash", ru: 'замерить заново' })}</span>
  </div>
);
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy savol', ru: 'Итоговый вопрос' })}
    questionText="Varaqda: vaqt oshgan, demo ishlagan. Endi nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Varaqda: vaqt oshgan, demo ishlagan. <A>Endi nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">В листе: время превышено, демо сработало. <A>Что сделаете теперь?</A></h2> })}
    options={[
      { uz: "Ortiqcha gapni olib, taymer bilan qayta o'lchayman", ru: 'Уберу лишние фразы и снова замерю с таймером' },
      { uz: "Ishlagan demoni olib, o'rniga videoni qo'yaman", ru: 'Уберу сработавшее демо и поставлю вместо него видео' },
      { uz: 'Savol-javob vaqtidan olib, pitchni uzaytiraman', ru: 'Возьму время у вопросов-ответов и удлиню питч' },
      { uz: "Pitchni o'zgartirmay, keyingi safar tezroq aytaman", ru: 'Не меняя питч, в следующий раз скажу быстрее' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Qisqartirilgan pitch yana taymer bilan o'lchanadi.", ru: 'Сокращённый питч снова замеряют с таймером.' }}
    explainWrong={{
      1: { uz: 'Demo ishlagan — nega uni olib tashlaysiz?', ru: 'Демо сработало — зачем его убирать?' },
      2: { uz: "Bu mashqda pitchga 5 daqiqa; savol-javob vaqti alohida.", ru: 'В этом упражнении на питч 5 минут; время вопросов-ответов отдельно.' },
      3: { uz: "O'zgarmagan pitch yana o'sha vaqtni olmaydimi?", ru: 'Разве неизменённый питч не займёт столько же времени?' },
      default: { uz: 'Vaqt oshsa, pitchdan nimani olasiz?', ru: 'Если время превышено, что вы уберёте из питча?' }
    }}
    vizual={<VaqtQator />} />
);

// ===== 🏅 BADGES (nishonlar, 4 — PM: «!» bilan, 9.23) — ish qilingan ekranlarda; Full Rehearsal! — bitta tekin bonus (P-048) =====
const ACHIEVEMENTS = {
  rightMarks: { icon: '📋', name: 'Right Marks!', desc: { uz: "Uch vaziyatga to'g'ri belgi qo'ydingiz", ru: 'Вы поставили верные отметки трём ситуациям' } },
  keepGoing: { icon: '⏱️', name: 'Keep Going!', desc: { uz: 'Demo ochilmaganda B rejani tanladingiz', ru: 'Когда демо не открылось, вы выбрали план Б' } },
  fourChecks: { icon: '🔌', name: 'Four Checks!', desc: { uz: "Chiqishdan oldin to'rt narsani tekshirdingiz", ru: 'Перед выступлением вы проверили четыре вещи' } },
  fullRehearsal: { icon: '🎤', name: 'Full Rehearsal!', desc: { uz: "Chiqishni o'tib, hakam varag'ini saqladingiz", ru: 'Вы прошли выступление и сохранили лист судьи' } }
};
// Ekran id → nishon (birinchi urinish). 5, 7-ekran nishonlari — ekran ichida (saqlashda), AchMissCtx.earn orqali.
const ACH_TRIGGERS = { varaq: 'rightMarks', s4: 'keepGoing' };

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


// Podium savol yorliqlari (SCORED_IDX: 4, 8 — q22)
const Q_LABELS = {
  4: { uz: '1 — Demo ochilmasa', ru: '1 — Если демо не откроется' },
  8: { uz: 'Yakuniy — Vaqt oshsa', ru: 'Итог — Если время превышено' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (MD «Fon so'zlari», R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'chiqish', ru: 'выступление' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'pitch', ru: 'питч' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'demo', ru: 'демо' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'hakam', ru: 'судья' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'varaq', ru: 'лист' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'taymer', ru: 'таймер' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'B reja', ru: 'план Б' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'savol-javob', ru: 'вопросы-ответы' }, l: 20, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: { uz: 'Maydon Jamoa', ru: 'Maydon Jamoa' }, l: 56, t: 52, s: 20, d: 22, dl: 3.3 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD), to'g'ri javob o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: "To'liq repetitsiyada demo ochilmadi. Taymer nima bo'ladi?", ru: 'На полной репетиции демо не открылось. Что будет с таймером?' }, opts: [{ uz: "To'xtamaydi, chiqish davom etadi", ru: 'Не останавливается, выступление продолжается' }, { uz: 'Pauza qilinib, keyin davom etadi', ru: 'Ставится на паузу, потом продолжается' }, { uz: 'Nolga qaytib, boshidan boshlanadi', ru: 'Сбрасывается на ноль, начинается сначала' }, { uz: 'Demo ochilguncha kutib turadi', ru: 'Ждёт, пока откроется демо' }], correct: 0 },
  { q: { uz: 'Bu mashqda pitchdan keyin hakam nechta savol beradi?', ru: 'Сколько вопросов задаёт судья после питча в этом упражнении?' }, opts: [{ uz: 'Bitta savol', ru: 'Один вопрос' }, { uz: 'Uchta savol', ru: 'Три вопроса' }, { uz: 'Oltita savol', ru: 'Шесть вопросов' }, { uz: 'Beshta savol', ru: 'Пять вопросов' }], correct: 1 },
  { q: { uz: "Hakam varag'i nimaga belgi qo'yadi?", ru: 'Чему ставит отметки лист судьи?' }, opts: [{ uz: "Har bo'lakdagi gapga alohida-alohida", ru: 'Каждой фразе в каждой части отдельно' }, { uz: "Slaydlarning ko'rinishi va rangiga", ru: 'Виду и цвету слайдов' }, { uz: 'Vaqt, demo va savollarga javobga', ru: 'Времени, демо и ответам на вопросы' }, { uz: 'Ilova kodining hajmi va tezligiga', ru: 'Объёму и скорости кода приложения' }], correct: 2 },
  { q: { uz: 'Javob: «Bilmayman, bu sonni keyin aniqlab beraman». Varaqda qaysi belgi?', ru: 'Ответ: «Не знаю, это число уточню позже». Какая отметка в листе?' }, opts: [{ uz: 'Son yoki fakt bilan', ru: 'С числом или фактом' }, { uz: 'Javob savolga tegmadi', ru: 'Ответ не по вопросу' }, { uz: 'Belgisiz qoldiriladi', ru: 'Остаётся без отметки' }, { uz: '«Tekshirib aytaman»', ru: '«Проверю и скажу»' }], correct: 3 },
  { q: { uz: "Chiqishdan oldin Backend nega uyg'otiladi?", ru: 'Зачем перед выступлением будят Backend?' }, opts: [{ uz: 'Demo sekin ochilmasligi uchun', ru: 'Чтобы демо не открывалось медленно' }, { uz: "Hakam kodni ko'ra olishi uchun", ru: 'Чтобы судья мог увидеть код' }, { uz: 'Video tezroq ochilishi uchun', ru: 'Чтобы видео открылось быстрее' }, { uz: 'Telefon zaryadi tejalishi uchun', ru: 'Чтобы сэкономить заряд телефона' }], correct: 0 },
  { q: { uz: "Demo yo'liga qaysi hisob bilan kirasiz?", ru: 'С каким аккаунтом вы входите в путь демо?' }, opts: [{ uz: 'Shaxsiy hisobingiz bilan', ru: 'Со своим личным аккаунтом' }, { uz: 'Namuna akkauntingiz bilan', ru: 'С демо-аккаунтом' }, { uz: 'Sinfdoshning hisobi bilan', ru: 'С аккаунтом одноклассника' }, { uz: 'Hakam bergan hisob bilan', ru: 'С аккаунтом, который дал судья' }], correct: 1 },
  { q: { uz: 'Pitch 5:20 da tugadi. Varaqda vaqt qatori qanday?', ru: 'Питч закончился на 5:20. Что в строке времени в листе?' }, opts: [{ uz: "Sig'di — chunki to'xtatildi", ru: 'Уложились — ведь остановили' }, { uz: 'Belgisiz — hakam bilmaydi', ru: 'Без отметки — судья не знает' }, { uz: "Oshdi — taymer qizil bo'ldi", ru: 'Превысили — таймер стал красным' }, { uz: 'B reja — vaqt yetmay qoldi', ru: 'План Б — не хватило времени' }], correct: 2 },
  { q: { uz: 'Mentor misolida B reja video qayerda turadi?', ru: 'Где в примере Ментора хранится видео плана Б?' }, opts: [{ uz: 'Hakamning telefonida turadi', ru: 'На телефоне судьи' }, { uz: 'Sinf chatida, havola bilan', ru: 'В чате класса, ссылкой' }, { uz: 'Ochiq video saytida turadi', ru: 'На открытом видеосайте' }, { uz: 'Demo ochiq turgan laptopda', ru: 'На ноутбуке, где открыто демо' }], correct: 3 },
  { q: { uz: '«Odamlar hozir bu ishni nima bilan qiladi?» Javobda nima aytasiz?', ru: '«С помощью чего люди делают это сейчас?» Что скажете в ответе?' }, opts: [{ uz: "Ular hozir qaysi yo'l bilan qilishini", ru: 'Каким способом они делают это сейчас' }, { uz: 'Ilovangizdagi barcha imkoniyatlarni', ru: 'Все возможности вашего приложения' }, { uz: 'Kelgusi oyda chiqadigan yangiliklarni', ru: 'Новинки, которые выйдут в следующем месяце' }, { uz: 'Savolga emas, pitchdagi gapingizni', ru: 'Не ответ на вопрос, а фразу из питча' }], correct: 0 },
  { q: { uz: "Hakam varag'ida hakamning ismi qayerda turadi?", ru: 'Где в листе судьи стоит имя судьи?' }, opts: [{ uz: 'Varaq tepasida, sarlavhada', ru: 'Вверху листа, в заголовке' }, { uz: 'Hech qayerda, hakam ismsiz', ru: 'Нигде, судья без имени' }, { uz: 'Har belgining yonida yozilib', ru: 'Рядом с каждой отметкой' }, { uz: 'Mentor statistikasida, ochiq', ru: 'В статистике Ментора, открыто' }], correct: 1 },
  { q: { uz: 'Chiqishdan keyin demo holati nima qilinadi?', ru: 'Что делают с состоянием демо после выступления?' }, opts: [{ uz: "O'sha holatda qoldiriladi", ru: 'Оставляют как есть' }, { uz: 'Hakamga topshirib qo\'yiladi', ru: 'Передают судье' }, { uz: 'Boshiga qaytarib qo\'yiladi', ru: 'Возвращают в исходное состояние' }, { uz: "Hammasi o'chirib tashlanadi", ru: 'Всё удаляют' }], correct: 2 },
  { q: { uz: 'Guruhda taymerni kim boshqaradi?', ru: 'Кто в группе управляет таймером?' }, opts: [{ uz: "Gapirayotgan o'quvchining o'zi", ru: 'Сам выступающий ученик' }, { uz: 'Mentor, proyektordagi taymerda', ru: 'Ментор, на таймере проектора' }, { uz: 'Hech kim — chiqish taymersiz', ru: 'Никто — выступление без таймера' }, { uz: "Hakam bo'lib turgan tinglovchi", ru: 'Слушатель, который сейчас судья' }], correct: 3 }
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
const MentorPracticeStats = ({ live, screen, sig, yorliq, son = false }) => {
  const signal = sig ?? (PRACTICE_BASE + screen);
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        // Praktika signali 500+ zonasida (test <100, arena 100+ bilan to'qnashmaydi)
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, signal)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)) });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, screen, signal]);
  if (!live || live.mode !== 'mentor') return null;
  const players = data.players || [];
  const doers = players.filter(p => data.doneIds.has(p.id));
  const waiting = players.filter(p => !data.doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.accent }}>{tr(yorliq || { uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink2, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружается…' })}</p>
      ) : son ? null : players.length === 0 ? (
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

// 🃏 KARTOCHKALAR — 12 (MD 10-ekran; kartochka mexanikasi va ko'rinishi — qolipda: QKartochka, DE-204). Mentorsiz (SABOQ 16).
const FLASHCARDS = [
  { front: { uz: "To'liq repetitsiya nima?", ru: 'Что такое полная репетиция?' }, back: { uz: "Pitch, jonli demo va savol-javobni Demo Day'dagidek to'xtamasdan o'tish", ru: 'Пройти питч, живое демо и вопросы-ответы без остановки, как на Demo Day' }, note: { uz: 'Bu darsda — guruhda, hakam bilan', ru: 'На этом уроке — в группе, с судьёй' } },
  { front: { uz: 'Bu mashqda butun chiqish qancha vaqtgacha?', ru: 'Сколько длится всё выступление в этом упражнении?' }, back: { uz: '8 daqiqagacha: 5 daqiqa pitch va 3 ta savol', ru: 'До 8 минут: 5 минут питч и 3 вопроса' }, note: { uz: 'Har javobga 1 daqiqagacha', ru: 'На каждый ответ — до 1 минуты' } },
  { front: { uz: 'Jonli demo pitchning qayerida?', ru: 'Где в питче живое демо?' }, back: { uz: "Yechim bo'lagi ichida", ru: 'Внутри части «Решение»' }, note: { uz: 'Mentor rejasida — 60–90 soniya', ru: 'В плане Ментора — 60–90 секунд' } },
  { front: { uz: "To'liq repetitsiyada demo ochilmasa nima qilinadi?", ru: 'Что делают на полной репетиции, если демо не открылось?' }, back: { uz: "B reja gapi aytiladi va video ko'rsatiladi", ru: 'Говорят фразу плана Б и показывают видео' }, note: { uz: "Taymer to'xtamaydi", ru: 'Таймер не останавливается' } },
  { front: { uz: "Video yo'q bo'lsa, demo ochilmaganda nima qilasiz?", ru: 'Что делать, если видео нет, а демо не открылось?' }, back: { uz: "Yechimni og'zaki aytib berasiz", ru: 'Рассказать Решение устно' }, note: { uz: "Taymer yuraveradi; varaqda bu — «Ishlamadi» (B reja faqat video)", ru: 'Таймер идёт дальше; в листе это — «Не сработало» (план Б — только видео)' } },
  { front: { uz: "Hakam varag'i nima?", ru: 'Что такое лист судьи?' }, back: { uz: "Butun chiqishga — vaqt, demo va savollarga javobga — belgi qo'yiladigan varaq", ru: 'Лист, где ставят отметки всему выступлению — времени, демо и ответам на вопросы' }, note: { uz: "Baholash varag'i esa har bo'lakka", ru: 'А лист оценки — каждой части' } },
  { front: { uz: "Hakam varag'ida demoga qaysi belgilar bor?", ru: 'Какие отметки для демо есть в листе судьи?' }, back: { uz: '«Ishladi», «B reja» yoki «Ishlamadi»', ru: '«Сработало», «План Б» или «Не сработало»' }, note: { uz: "Belgini hakam qo'yadi", ru: 'Отметку ставит судья' } },
  { front: { uz: 'Savolga javob qanday belgilanadi?', ru: 'Как отмечается ответ на вопрос?' }, back: { uz: '«Son yoki fakt bilan», «Tekshirib aytaman» yoki «Javob savolga tegmadi»', ru: '«С числом или фактом», «Проверю и скажу» или «Ответ не по вопросу»' }, note: { uz: '«Tekshirib aytaman» — halol javob', ru: '«Проверю и скажу» — честный ответ' } },
  { front: { uz: "Chiqishdan oldin qaysi to'rt narsa tekshiriladi?", ru: 'Какие четыре вещи проверяют перед выступлением?' }, back: { uz: "Demo yo'li ochilgani, B reja video, namuna akkaunt va telefon zaryadi", ru: 'Что путь демо открылся, видео плана Б, демо-аккаунт и заряд телефона' }, note: { uz: "Bu darsdagi ro'yxat", ru: 'Список этого урока' } },
  { front: { uz: "Nega demo namuna akkaunt bilan ko'rsatiladi?", ru: 'Почему демо показывают с демо-аккаунтом?' }, back: { uz: "Shaxsiy ism va yozuvlar zalga ko'rinmasligi uchun", ru: 'Чтобы личное имя и записи не были видны залу' }, note: { uz: 'Namuna akkaunt sanoqqa kirmaydi', ru: 'Демо-аккаунт не входит в подсчёт' } },
  { front: { uz: 'Pitch vaqti oshsa nima qilasiz?', ru: 'Что делать, если питч превысил время?' }, back: { uz: "Takrorlangan yoki ortiqcha gapni qisqartirib, taymer bilan qayta o'lchaysiz", ru: 'Сократить повторы или лишние фразы и снова замерить с таймером' }, note: { uz: "Savol-javob vaqti pitchga o'tmaydi", ru: 'Время вопросов-ответов в питч не переходит' } },
  { front: { uz: "Hakamning ismi varaqda qayerda turadi?", ru: 'Где в листе стоит имя судьи?' }, back: { uz: 'Hech qayerda: varaqda faqat belgilar', ru: 'Нигде: в листе только отметки' }, note: { uz: 'Hakam — ismsiz', ru: 'Судья — без имени' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash', ru: 'Завершить' }) + ' →'} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('cs-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={FLASHCARDS.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="cs-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi.', ru: 'Нажмите на карточку — откроется ответ.' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + ①②; ① holatdan yig'iladi; alohida .homework.jsx yo'q) =====
const HW_RAQAM = ['①', '②'];
const HwCard = ({ birinchi = [], ikkinchi = false, qolgan = false, keyingi }) => {
  const karta = [
    { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: "xohlasangiz — oila a'zosi yoki do'stingiz", ru: 'если хотите — член семьи или друг' } },
    qolgan && { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: "1 to'liq repetitsiya", ru: '1 полная репетиция' } },
    { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
  ].filter(Boolean);
  const bandlar = [];
  if (birinchi.length) bandlar.push(birinchi);
  if (ikkinchi) bandlar.push([{ uz: "Xohlasangiz, tanish odam oldida butun chiqishingizni bir marta, taymer bilan ayting — u darsdagi hakam savollaridan uchtasini bersin; bo'lmasa taymer bilan yakka rejimda o'ting.", ru: 'Если хотите, расскажите всё выступление один раз при знакомом человеке, с таймером — пусть он задаст три вопроса судьи из урока; если нет — пройдите с таймером в одиночном режиме.' }]);
  return (
    <div className="card cs-hw fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      <div className="cs-hw-karta" style={{ gridTemplateColumns: 'repeat(' + karta.length + ', minmax(0, 1fr))' }}>{karta.map((r, i) => <div key={i} className="cs-hw-q"><span className="cs-hw-k">{tr(r.k)}</span><span className="cs-hw-v">{tr(r.v)}</span></div>)}</div>
      {bandlar.length > 0 && <ol className="cs-hw-qadam">{bandlar.map((b, i) => <li key={i}><i>{HW_RAQAM[i]}</i><span>{b.map((x, j) => <span key={j} className="cs-hw-b">{tr(x)}</span>)}</span></li>)}</ol>}
      <p className="cs-kulrang">{tr({ uz: "Uning ismi hech qayerga yozilmaydi; yozib olsangiz, video telefoningizda qoladi.", ru: 'Его имя нигде не записывается; если снимете видео, оно останется в вашем телефоне.' })}</p>
      {keyingi && <span className="cs-hw-keyingi">{keyingi}</span>}
    </div>
  );
};
const HW_BAND = {
  oshdi: { uz: "Takrorlangan yoki ortiqcha gapni qisqartiring va pitchni taymer bilan qayta o'lchang.", ru: 'Сократите повторы или лишние фразы и снова замерьте питч с таймером.' },
  demo: { uz: "Demo nega ochilmaganini 7-darsdagidek buzish yozuvi bilan yozing va Mentorga ko'rsating.", ru: 'Запишите, почему демо не открылось, записью поломки, как на 7-м уроке, и покажите Ментору.' },
  savol: { uz: 'Shu savolga son yoki fakt bilan javob tayyorlang.', ru: 'Подготовьте ответ на этот вопрос с числом или фактом.' },
  otilmagan: { uz: "Chiqishdan oldin to'rt narsani tekshirib, butun chiqishni taymer bilan o'ting (keyingi imkoniyatda; yakka rejim ham bo'ladi).", ru: 'Проверьте четыре вещи перед выступлением и пройдите всё выступление с таймером (при следующей возможности; можно и в одиночном режиме).' }
};

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (yetti holat, E 54; ustunlik tartibi — MD 11-ekran) =====
// «Bugungi asosiy fikr» qutisi va artefakt-strip — ko'rsatilmaydi (E 50). Belgi ✓ — faqat birinchi ikki holatda.
const SARLAVHA = {
  toliq: { uz: "To'liq repetitsiya o'tdi — varaqda ochiq savol qolmadi.", ru: 'Полная репетиция пройдена — в листе не осталось открытых вопросов.' },
  tekshir: { uz: "To'liq repetitsiya o'tdi — tekshiriladigan savol qoldi.", ru: 'Полная репетиция пройдена — остался вопрос для проверки.' },
  tuzat: { uz: "To'liq repetitsiya o'tdi — tuzatiladigan joy bor.", ru: 'Полная репетиция пройдена — есть что исправить.' },
  qoldi: (n) => ({ uz: `Pitch o'tdi — savol-javob ${n}/3 da qoldi.`, ru: `Питч пройден — вопросы-ответы остановились на ${n}/3.` }),
  yakka: { uz: "Chiqish yakka o'tildi — varaqni o'zingiz to'ldirdingiz.", ru: 'Выступление пройдено в одиночку — лист вы заполнили сами.' },
  toldirilmagan: { uz: "Chiqish o'tildi — hakam varag'i hali to'ldirilmagan.", ru: 'Выступление пройдено — лист судьи ещё не заполнен.' },
  otilmagan: { uz: "To'liq repetitsiya hali o'tilmagan — keyingi imkoniyatda.", ru: 'Полная репетиция ещё не пройдена — при следующей возможности.' }
};
const RECAP = [
  { uz: "Pitch, jonli demo va savol-javobni Demo Day'dagidek to'xtamasdan o'tish — to'liq repetitsiya.", ru: 'Пройти питч, живое демо и вопросы-ответы без остановки, как на Demo Day, — полная репетиция.' },
  { uz: 'Bu mashqda chiqish 8 daqiqagacha: 5 daqiqa pitch va 3 ta savol.', ru: 'В этом упражнении выступление — до 8 минут: 5 минут питч и 3 вопроса.' },
  { uz: "Demo ochilmasa — video bo'lsa B reja gapi va video; taymer to'xtamaydi.", ru: 'Если демо не открылось — при наличии видео фраза плана Б и видео; таймер не останавливается.' },
  { uz: "Hakam varag'ida uch narsa belgilanadi: vaqt, demo va har savolga javob.", ru: 'В листе судьи отмечают три вещи: время, демо и ответ на каждый вопрос.' },
  { uz: "Javobni bilmasangiz, «tekshirib aytaman» deysiz — son o'ylab topilmaydi.", ru: 'Если не знаете ответ, говорите «проверю и скажу» — число не выдумывают.' }
];
// Holat — pm-m12d13-repetitsiya (vaqt, demo, varaq[].belgi, tur, savolJavobTugadi) va 7-ekran «Saqlash» bayrog'idan (P-046)
const yakunHolat = (answers) => {
  const r = repOl();
  const vaqtBor = !!(r && sonmi(r.vaqt));
  const idx7 = SCREEN_META.findIndex(m => m.id === 'hakamVaraq');
  const sv = r && Array.isArray(r.varaq) ? r.varaq.filter(x => x && String(x.band).startsWith('savol:')) : [];
  const saqlandi = vaqtBor && (!!(answers && answers[idx7] && answers[idx7].saqlandi) || (!!r.demo && sv.every(x => x.belgi)));
  const h = varaqHolat(saqlandi ? r : null);
  const n = sv.length;
  const real = r && (r.tur === 'hakam' || r.tur === 'guruh');
  let holat;
  if (!vaqtBor) holat = 'otilmagan';
  else if (!saqlandi) holat = 'toldirilmagan';
  else if (real && r.savolJavobTugadi === true && h.yashil && h.tekshir === 0) holat = 'toliq';
  else if (real && r.savolJavobTugadi === true && h.yashil && h.tekshir > 0) holat = 'tekshir';
  else if (real && r.savolJavobTugadi === true) holat = 'tuzat';
  else if (r.savolJavobTugadi !== true) holat = 'qoldi';
  else holat = 'yakka';
  const bir = [];
  if (saqlandi && h.oshdi) bir.push(HW_BAND.oshdi);
  if (saqlandi && h.demoB && h.demoB !== 'ishladi') bir.push(HW_BAND.demo);
  if (saqlandi && sv.some(x => x.belgi === 'tegmadi' || x.belgi === 'tekshiraman')) bir.push(HW_BAND.savol);
  if (!vaqtBor) bir.push(HW_BAND.otilmagan);
  const ikki = holat === 'tuzat' || holat === 'qoldi' || holat === 'otilmagan' || holat === 'toldirilmagan' || (holat === 'yakka' && h.tuzat.length > 0);
  return { holat, n, bir, ikki, qolgan: bir.length > 0 || ikki };
};

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
  // Holat — o'quvchining pm-m12d13-repetitsiya kaliti va 7-ekran «Saqlash» bayrog'idan; Mentor proyektorida — dars nomi (holat da'vo qilinmaydi)
  const yh = yakunHolat(answers);
  const holat = isMentorL ? 'mentor' : yh.holat;
  const sarlavha = holat === 'mentor' ? tr(LESSON_META.lessonTitle) : holat === 'qoldi' ? tr(SARLAVHA.qoldi(yh.n)) : tr(SARLAVHA[holat]);
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Zaxira dars: zalni tayyorlash»</b></>, ru: <>Следующий урок — <b>«Резервный урок: подготовка зала»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('cs-yakun', !(holat === 'toliq' || holat === 'tekshir') && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={sarlavha}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard birinchi={yh.bir} ikkinchi={yh.ikki} qolgan={yh.qolgan} keyingi={keyingi} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmDressRehearsalLesson({ lang: langProp, onFinished, liveToken }) {
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
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice, earn }), [missed, missTry, fpPractice, earn]); // earn — 5, 7-ekran nishonlari (saqlashda)
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
        /* === 14-Modul 13-dars — darsning o'z vizuali (prefiks cs-): ChiqishSahna · taymer · laptop · telefon · hakam kartasi · varaq. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        .cs-mj { font-weight: 800; font-style: normal; color: ${MJ_RANG}; white-space: nowrap; }
        @keyframes cs-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes cs-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes cs-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: 0 0 0 7px ${fon(T.accent, 0)}; } }
        @keyframes cs-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes cs-yashil { 0% { background: ${T.okFon}; } 100% { background: transparent; } }
        @keyframes cs-pop { 0% { transform: scale(1.25); } 100% { transform: scale(1); } }
        @keyframes cs-tol { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes cs-aylan { to { transform: rotate(360deg); } }
        @keyframes cs-yoz { from { opacity: 0; } to { opacity: 1; } }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, scale yo'q (E 40) */
        .cs-halqa { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: cs-puls 2.2s ease-out .3s 3; }
        .btn-white-accent.cs-halqa { outline-offset: 3px; }
        .cs-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: cs-chorla-v 1.8s ease-out .5s 2; }
        .cs-k.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .cs-k.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: cs-chorla 1.8s ease-out .5s 2; }
        .q-bashorat .q-chip:nth-child(2) { animation-delay: .75s; } .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        .cs-bash.ix .q-bashorat { padding-top: 10px; padding-bottom: 10px; }
        @media (min-width: 761px) { .cs-k .q-split { grid-template-columns: minmax(0,1.25fr) minmax(0,1fr); gap: 28px; } }
        .cs-k { display: flex; flex-direction: column; flex: 1 0 auto; }
        .cs-harakat { display: flex; flex-direction: column; gap: 10px; }
        .cs-qadamlar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .cs-qadamlar .q-chip i { font-style: normal; font-weight: 800; color: ${T.accent}; margin-right: 7px; }
        .cs-qadamlar .q-chip.ok i { color: ${T.ok}; }
        .cs-qadamlar .q-chip.cs-joriy { animation: cs-puls 2.2s ease-out .3s 3; }
        p.cs-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.cs-kulrang { margin: 0; font-size: 13.5px; line-height: 1.45; color: ${T.ink2}; }
        .q-xulosa .cs-xq-t { display: block; font-size: 12.5px; font-weight: 700; color: ${T.ok}; margin-bottom: 5px; }
        .q-xulosa .cs-xq-t.xato { color: ${T.ink2}; }
        .q-xulosa .cs-xq-m { display: block; }
        .q-xulosa .cs-xq-i { display: block; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; margin-top: 8px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.25)}; }
        .cs-sahna-y { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; }
        .cs-qur-y { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; text-align: center; }
        /* ChiqishSahna: telefon chapda (≈170×272), o'ngda hakam · taymer · laptop */
        .cs-sahna { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 22px; align-items: start; }
        .cs-sahna-tel { display: flex; flex-direction: column; gap: 6px; align-items: center; }
        .cs-sahna-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .cs-sahna.tel-yoq { grid-template-columns: minmax(0,1fr); }
        .cs-lap.yon { flex-direction: row; align-items: flex-start; gap: 14px; }
        .cs-lap.yon > .cs-lap-ekran { flex: 1.35; min-width: 0; }
        .cs-lap-yon { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 8px; }
        .cs-lap.yon .cs-pufak { max-width: 100%; }
        .cs-lap.yon .cs-qayta { position: static; flex-direction: row; align-items: center; gap: 8px; }
        .cs-sahna.tel-yoq .cs-sahna-ong { gap: 6px; }
        /* Hakam — bitta urg'uli rol kartasi (P1): 2px accent, belgi, nom 16px, savollar 15px bir qatorda */
        .cs-hk { display: flex; align-items: center; gap: 12px; padding: 8px 14px; border-radius: 16px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 12px 28px -16px ${fon(T.accent, 0.6)}; animation: cs-kir .4s ease-out both; }
        .cs-hk-ava { width: 40px; height: 40px; border-radius: 50%; background: ${T.accent}; color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 0 0 5px ${T.accentSoft}; }
        .cs-hk-ava svg { width: 22px; height: 22px; }
        .cs-hk-ava.kichik { width: 30px; height: 30px; box-shadow: 0 0 0 3px ${T.accentSoft}; } .cs-hk-ava.kichik svg { width: 17px; height: 17px; }
        .cs-hk-o { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; min-width: 0; flex: 1; }
        .cs-hk-nom { font-size: 16px; font-weight: 800; color: ${T.ink}; }
        .cs-hk-sl { display: contents; }
        .cs-hk-s { display: inline-flex; align-items: center; gap: 7px; font-size: 15px; font-weight: 600; line-height: 1.35; color: ${T.ink}; animation: cs-kir .35s ease-out both; }
        .cs-hk-s > i { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 13px; background: ${T.accentSoft}; color: ${T.accent}; flex: none; animation: cs-pop .4s ease-out; }
        .cs-hk-s.ok > i { background: ${T.ok}; color: #fff; }
        .cs-hk-s.kut > i { background: ${T.bg}; color: ${T.ink2}; }
        /* Telefon — «Maydon Jamoa» */
        .cs-tel { width: 170px; height: 272px; border-radius: 26px; background: #1E1B26; padding: 9px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.5); display: flex; flex: none; }
        .cs-tel-ekran { flex: 1; min-width: 0; background: ${T.paper}; border-radius: 18px; padding: 13px 12px 12px; display: flex; flex-direction: column; gap: 3px; }
        .cs-tel-nom { font-size: 13px; }
        .cs-tel-y { margin-top: 6px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: ${T.ink2}; }
        .cs-tel-vaqt { font-size: 14.5px; color: ${T.ink}; }
        .cs-tel-joy { font-size: 12px; color: ${T.ink2}; }
        .cs-tel-son { margin-top: 8px; font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .cs-tel-son.yangi, .cs-lap-son.yangi { color: ${MJ_RANG}; animation: cs-pop .5s cubic-bezier(.3,1.5,.5,1); }
        .cs-tel-doira { display: flex; gap: 3px; flex-wrap: wrap; }
        .cs-tel-doira i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .cs-tel-doira i.bor { background: ${MJ_RANG}; }
        .cs-tel-kor { align-self: flex-start; margin-top: 4px; font-size: 11px; font-weight: 800; color: ${MJ_RANG}; background: ${fon(MJ_RANG, 0.12)}; border-radius: 999px; padding: 2px 8px; animation: cs-kir .35s ease-out both; }
        .cs-tel-tugma { margin-top: auto; text-align: center; font-size: 12px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border-radius: 10px; padding: 8px 6px; }
        /* Laptop brauzeri */
        .cs-lap { position: relative; display: flex; flex-direction: column; gap: 5px; }
        .cs-lap-ekran { border-radius: 12px; background: #1E1B26; padding: 7px; box-shadow: 0 12px 26px -16px rgba(${T.shadowBase},0.5); }
        .cs-lap-bar { display: flex; align-items: center; gap: 5px; padding: 0 4px 6px; }
        .cs-lap-bar > i { width: 7px; height: 7px; border-radius: 50%; background: #4A4558; }
        .cs-lap-url { margin-left: 6px; flex: 1; min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #CFCBDA; background: #2C2838; border-radius: 6px; padding: 3px 8px; white-space: nowrap; overflow: hidden; }
        .cs-lap-ich { background: ${T.paper}; border-radius: 8px; min-height: 104px; padding: 10px 12px; display: flex; }
        .cs-lap.ixcham .cs-lap-ich { min-height: 78px; }
        .cs-lap-oyin { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; animation: cs-kir .3s ease-out both; }
        .cs-lap-h { font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .cs-lap-k { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; border: 1px solid ${T.line}; border-radius: 10px; padding: 9px 12px; font-size: 14px; color: ${T.ink}; }
        .cs-lap-son { font-family: 'JetBrains Mono', monospace; font-size: 16px; white-space: nowrap; }
        .cs-lap-tug { margin-left: auto; font-size: 13px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border-radius: 9px; padding: 6px 12px; white-space: nowrap; transition: box-shadow .3s; }
        .cs-lap-tug.on { box-shadow: 0 0 0 3px ${fon(MJ_RANG, 0.3)}; }
        .cs-ulan { flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 15px; font-weight: 700; color: ${T.ink2}; animation: cs-kir .3s ease-out both; }
        .cs-spin { width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid ${T.line}; border-top-color: ${T.accent}; animation: cs-aylan .8s linear infinite; }
        .cs-video { flex: 1; display: flex; align-items: center; gap: 12px; background: #14121A; border-radius: 6px; padding: 10px 14px; color: #fff; animation: cs-kir .3s ease-out both; }
        .cs-video-p { width: 30px; height: 30px; border-radius: 50%; background: ${fon('#FFFFFF', 0.16)}; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; flex: none; }
        .cs-video-ch { flex: 1; height: 6px; border-radius: 99px; background: ${fon('#FFFFFF', 0.2)}; overflow: hidden; }
        .cs-video-ch > i { display: block; height: 100%; background: ${T.accent}; transform-origin: left; animation: cs-tol 6s linear both; }
        .cs-video-s { font-size: 13px; font-weight: 700; white-space: nowrap; }
        .cs-pufak { align-self: flex-start; max-width: 92%; font-size: 14px; font-weight: 600; line-height: 1.4; color: ${T.ink}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1px ${fon(T.accent, 0.35)}; border-radius: 12px 12px 12px 4px; padding: 7px 12px; animation: cs-kir .35s ease-out both; }
        .cs-qayta { position: absolute; right: 12px; bottom: 30px; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; animation: cs-kir .3s ease-out both; }
        .cs-qayta em { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .cs-qayta-t { position: relative; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 8px; padding: 4px 10px; opacity: .75; }
        .cs-qayta-t::after { content: ''; position: absolute; left: 4px; right: 4px; top: 50%; height: 2px; background: ${T.err}; transform-origin: left; animation: cs-tol .5s ease-out .4s both; }
        /* Taymer chizig'i */
        .cs-tm { display: flex; flex-direction: column; gap: 6px; }
        .cs-tm-q { display: flex; align-items: flex-start; gap: 8px; }
        .cs-tm-ch { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .cs-tm-chiziq { display: flex; gap: 3px; }
        .cs-tm-bo { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .cs-tm-t { display: block; height: 12px; border-radius: 4px; background: ${T.bg}; border: 1px solid ${T.line}; overflow: hidden; }
        .cs-tm.bosh .cs-tm-t { border-style: dashed; background: transparent; }
        .cs-tm-t > i { display: block; height: 100%; background: ${T.accent}; transform-origin: left; transform: scaleX(0); }
        .cs-tm.toliq .cs-tm-t > i { transform: scaleX(1); }
        .cs-tm.yur .cs-tm-t > i { animation: cs-tol linear both; }
        .cs-tm.jonli .cs-tm-t > i { transition: transform .25s linear; }
        .cs-tm.b .cs-tm-bo.yuradi .cs-tm-t > i { animation: cs-tol 6s linear both; }
        .cs-tm-bo.joriy .cs-tm-t { box-shadow: 0 0 0 2px ${fon(T.accent, 0.35)}; }
        .cs-tm-bo.joriy em { color: ${T.accent}; }
        .cs-tm.oshdi .cs-tm-t > i { background: ${T.err}; }
        .cs-tm-bo em { font-style: normal; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: clip; text-align: center; }
        .cs-tm-bo small { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; text-align: center; }
        .cs-tm-chet { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .cs-tm-chet .cs-tm-5 { color: ${T.ink}; font-weight: 700; }
        .cs-tm-osh { color: ${T.err}; font-weight: 800; }
        .cs-tm-sj { flex: 0 0 132px; display: flex; flex-direction: column; gap: 3px; align-items: stretch; animation: cs-kir .35s ease-out both; }
        .cs-tm-sj > em { font-style: normal; font-size: 12.5px; font-weight: 800; color: ${T.accent}; text-align: center; }
        .cs-tm-kat { display: flex; gap: 3px; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1px ${fon(T.accent, 0.35)}; border-radius: 6px; padding: 3px; }
        .cs-tm-sj.ok .cs-tm-kat { box-shadow: inset 0 0 0 1.5px ${T.ok}; background: ${T.okFon}; }
        .cs-kat { position: relative; flex: 1; height: 14px; border-radius: 4px; background: ${T.paper}; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .cs-kat.bosh { background: transparent; border: 1px dashed ${fon(T.accent, 0.5)}; }
        .cs-kat > i { position: absolute; inset: 0; background: ${T.accent}; transform-origin: left; transform: scaleX(0); }
        .cs-kat.tugadi > i { transform: scaleX(1); }
        .cs-kat.anim > i { animation: cs-tol .45s ease-out both; }
        .cs-kat.yur > i { transition: transform .25s linear; }
        .cs-kat.osh { background: ${T.errFon}; } .cs-kat.osh > i { transform: scaleX(1); background: ${fon(T.err, 0.3)}; }
        .cs-kat > b { position: relative; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; color: #fff; }
        .cs-kat.osh > b { color: ${T.err}; }
        .cs-tm-sj.ok .cs-kat > i { background: ${T.ok}; }
        .cs-tm-oxir { align-self: center; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: ${T.ink}; animation: cs-kir .35s ease-out both; }
        .cs-tm.katta { padding-right: 40px; }
        .cs-tm.katta .cs-tm-t { height: 18px; }
        .cs-tm.katta .cs-kat { height: 18px; }
        .cs-tm.katta .cs-kat > b { font-size: 11px; }
        .cs-tm.katta .cs-tm-sj { flex-basis: 168px; }
        .cs-yq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .cs-yq-y { font-size: 12.5px; font-weight: 800; color: ${T.ink}; margin-right: 2px; }
        .cs-yq-q { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 8px; padding: 3px 9px; transition: all .3s; }
        .cs-yq-q > i { font-style: normal; font-weight: 800; font-size: 11px; color: ${T.ink2}; }
        .cs-yq-q.on { color: ${T.ink}; border-color: ${T.accent}; background: ${T.accentSoft}; animation: cs-pop .35s ease-out; }
        .cs-yq-q.on > i { color: ${T.accent}; }
        .cs-yq-q.kul { background: ${T.bg}; }
        /* Kirish maketi: uch alohida karta + bo'sh uzuq chiziq («?») */
        .cs-kir { display: flex; flex-direction: column; gap: 14px; }
        .cs-kir-k { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; transition: transform .6s cubic-bezier(.3,1.2,.5,1); }
        .cs-kir.yaqin .cs-kir-k { transform: translateY(10px); }
        .cs-kir-karta { display: flex; flex-direction: column; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 12px 12px; animation: cs-kir .4s ease-out both; }
        .cs-kir-karta b { font-size: 15px; font-weight: 800; color: ${T.ink}; line-height: 1.3; }
        .cs-kir-karta span { font-size: 13px; color: ${T.ink2}; white-space: nowrap; }
        .cs-kir-karta strong { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: ${T.accent}; white-space: nowrap; }
        .cs-kir-chiziq { position: relative; height: 22px; border: 1.5px dashed ${T.line}; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .cs-kir-chiziq span { font-size: 15px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; padding: 0 10px; }
        /* Reja vizuali */
        .cs-reja { display: flex; flex-direction: column; gap: 14px; }
        .cs-reja .cs-tm-sj { animation-delay: 3.9s; }
        .cs-varaq.cs-reja-v { animation: cs-kir .4s ease-out 4.9s both; }
        .cs-reja-v .cs-bolim { animation: cs-kir .4s ease-out both; }
        .cs-reja-v .cs-bolim:nth-child(1) { animation-delay: 5s; } .cs-reja-v .cs-bolim:nth-child(2) { animation-delay: 5.3s; } .cs-reja-v .cs-bolim:nth-child(3) { animation-delay: 5.6s; }
        /* Varaq */
        .cs-varaq { display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; padding: 12px 14px; box-shadow: 0 10px 26px -16px rgba(${T.shadowBase},0.3); }
        .cs-varaq.yonadi { animation: cs-yashil 1.2s ease-out .2s both; }
        .cs-varaq-h { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 400; color: ${T.ink}; }
        .cs-yoz > span { animation: cs-yoz .01s linear both; }
        .cs-bolim { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; border-radius: 10px; border: 1.5px solid transparent; }
        .cs-bolim.joriy { border-color: ${T.accent}; background: ${fon(T.accent, 0.04)}; }
        .cs-bolim-n { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: ${T.ink2}; }
        .cs-vq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; border-radius: 8px; padding: 2px 0; }
        .cs-vq.yangi { animation: cs-yashil 1.1s ease-out both; }
        .cs-vq-n { font-size: 14.5px; font-weight: 600; color: ${T.ink}; line-height: 1.35; }
        .cs-vq-tug { display: flex; flex-wrap: wrap; gap: 6px; }
        .cs-vq-b { display: inline-flex; flex-wrap: wrap; gap: 6px; }
        .cs-vq-k { font-size: 13.5px; color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; }
        .cs-vq-bosh { display: inline-block; width: 120px; height: 24px; border-radius: 7px; border: 1.5px dashed ${T.line}; }
        .cs-belgi-c { display: inline-flex; align-items: center; font-size: 13.5px; font-weight: 800; border-radius: 999px; padding: 3px 11px; white-space: nowrap; animation: cs-pop .35s ease-out; }
        .cs-belgi-c.ok { color: ${T.ok}; background: ${T.okFon}; } .cs-belgi-c.acc { color: ${T.accent}; background: ${T.accentSoft}; } .cs-belgi-c.err { color: ${T.err}; background: ${T.errFon}; }
        .q-chip.cs-belgi:not(:disabled):not(.err) { border-color: ${fon(T.accent, 0.5)}; animation: cs-chorla 1.8s ease-out .4s 2; }
        .q-chip.cs-belgi:nth-child(2) { animation-delay: .65s; } .q-chip.cs-belgi:nth-child(3) { animation-delay: .9s; }
        .q-chip.cs-belgi.ok, .cs-tanlov .q-chip.ok { color: ${T.ok}; }
        .q-chip.cs-belgi.err { color: ${T.err}; }
        .q-chip.cs-belgi.acc { color: ${T.accent}; }
        .cs-uchar { position: fixed; z-index: 1300; pointer-events: none; display: inline-flex; align-items: center; font-size: 14px; font-weight: 800; padding: 6px 14px; border-radius: 999px; background: ${T.paper}; border: 2px solid ${T.accent}; color: ${T.ink}; box-shadow: 0 18px 36px -14px ${fon(T.ink, 0.35)}; transition: transform .6s cubic-bezier(.45,.05,.3,1); white-space: nowrap; }
        .cs-uchar.ok { border-color: ${T.ok}; color: ${T.ok}; } .cs-uchar.err { border-color: ${T.err}; color: ${T.err}; } .cs-uchar.acc { color: ${T.accent}; }
        /* 3-ekran — vaziyat kartasi */
        .cs-vz { display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.25); animation: cs-kir .4s ease-out both; }
        .cs-vz-n { font-size: 13px; font-weight: 800; color: ${T.accent}; }
        p.cs-vz-m { margin: 0; font-size: 15px; line-height: 1.5; color: ${T.ink}; }
        .cs-vz-s { display: flex; flex-direction: column; gap: 8px; }
        .cs-vz-hk { display: flex; align-items: flex-start; gap: 10px; }
        .cs-vz-hk p, p.cs-vz-j { margin: 0; font-size: 15px; line-height: 1.5; color: ${T.ink}; }
        p.cs-vz-j { background: ${T.bg}; border-radius: 10px; padding: 8px 12px; }
        .q-fokus .cs-varaq { max-width: none; }
        /* Test vizuallari */
        .cs-test-viz { margin-top: 2px; }
        .cs-kitob { display: flex; flex-direction: column; gap: 8px; max-width: 460px; }
        .cs-vqm { display: inline-flex; align-items: center; gap: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px 14px; }
        .cs-vqm-r { font-size: 13.5px; font-weight: 700; color: ${T.ink2}; border: 1.5px dashed ${T.accent}; border-radius: 8px; padding: 3px 10px; animation: cs-chorla 1.6s ease-out .4s 3; }
        /* Mustaqil ish — karta, doiralar, ixcham qatorlar */
        .q-mustaqil:has(.cs-karta), .q-mustaqil:has(.cs-fokus) { max-width: none; }
        .cs-fokus { display: flex; flex-direction: column; gap: 12px; }
        .cs-doiralar { display: flex; flex-wrap: wrap; gap: 8px; }
        .cs-doira { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 999px; padding: 4px 12px 4px 4px; }
        .cs-doira > i { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 12px; background: ${T.bg}; color: ${T.ink2}; }
        .cs-doira.on { border-color: ${T.accent}; color: ${T.ink}; } .cs-doira.on > i { background: ${T.accentSoft}; color: ${T.accent}; }
        .cs-doira.ok { color: ${T.ok}; } .cs-doira.ok > i { background: ${T.ok}; color: #fff; animation: cs-pop .35s ease-out; }
        .cs-doira.yol > i { background: ${T.paper}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .cs-ix-ro { display: flex; flex-direction: column; gap: 6px; }
        .cs-ix { display: flex; align-items: center; gap: 10px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 7px 12px; font-size: 14px; animation: cs-kir .35s ease-out both; }
        .cs-ix b { font-weight: 800; color: ${T.ink}; } .cs-ix span { color: ${T.ink2}; flex: 1; min-width: 0; }
        .cs-ix-bir { font-size: 15px; }
        .cs-tahrir { margin-left: auto; border: none; background: ${T.bg}; color: ${T.ink2}; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; font-size: 14px; }
        .cs-tahrir:hover { color: ${T.accent}; }
        .cs-karta { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 10px; animation: cs-kartakir .4s ease-out both; }
        @keyframes cs-kartakir { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        p.cs-karta-ish { margin: 0; font-size: 16px; font-weight: 600; line-height: 1.45; color: ${T.ink}; }
        .cs-tanlov { display: flex; flex-wrap: wrap; gap: 8px; }
        .cs-tanlov .q-chip:not(.on):not(.ok) { border-color: ${fon(T.accent, 0.5)}; }
        .cs-karta-tug { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .cs-karta-tug .cs-o { margin-left: auto; }
        .cs-yordam { background: ${T.bg}; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
        .cs-yordam p, .cs-yordam li { margin: 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .cs-yordam ol { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 2px; }
        .cs-yordam li.on { font-weight: 700; }
        .cs-m4 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
        .cs-m4-k { display: flex; flex-direction: column; gap: 4px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 12px 14px; }
        .cs-m4-k b { font-size: 14px; font-weight: 800; color: ${T.ink}; } .cs-m4-k span { font-size: 14px; color: ${T.ink}; line-height: 1.45; }
        /* 6-ekran — hakam tanlovi, taymer, savollar */
        .cs-tur { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 7px 10px; }
        .cs-tur.kutish { border-color: ${fon(T.accent, 0.55)}; }
        .cs-tur.kutish .q-chip { animation: cs-chorla 1.8s ease-out .5s 2; }
        .cs-tur.err { border-color: ${T.err}; }
        .cs-tur-y { font-size: 13px; font-weight: 700; color: ${T.ink2}; margin-right: 4px; }
        .cs-oldin { display: flex; flex-direction: column; gap: 4px; background: ${T.bg}; border-radius: 12px; padding: 10px 14px; }
        .cs-oldin b { font-size: 13px; font-weight: 800; color: ${T.ink2}; }
        .cs-oldin p { margin: 0; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .cs-soat { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
        .cs-soat-v { font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 800; color: ${T.ink}; min-width: 110px; }
        .cs-soat-v.osh { color: ${T.err}; }
        p.cs-yoriq { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.45; color: ${T.ink}; }
        .cs-savollar { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
        .cs-savol { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; text-align: left; font-family: inherit; font-size: 14.5px; font-weight: 600; line-height: 1.35; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.45)}; border-radius: 12px; padding: 9px 12px; cursor: pointer; transition: all .2s; }
        .cs-savol:hover:not(:disabled) { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .cs-savol:disabled, .cs-savol.berildi { opacity: .45; cursor: default; border-color: ${T.line}; }
        .q-chip.cs-tugma { white-space: normal; text-align: left; }
        .cs-savol em { font-style: normal; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 7px; }
        .cs-savol.boshqa { border-style: solid; color: ${T.accent}; }
        .cs-sj-karta { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; background: ${T.paper}; border-radius: 14px; padding: 12px 16px; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.25); animation: cs-kartakir .35s ease-out both; }
        .cs-sj-karta b { flex: 1 1 260px; font-size: 16px; font-weight: 700; color: ${T.ink}; line-height: 1.4; }
        .btn-ghost.cs-chet { padding: clamp(11px,1.6vw,13px) clamp(14px,2vw,18px); font-size: clamp(13px,1.5vw,15px); box-shadow: inset 0 0 0 1.5px ${T.line}; }
        /* 7-ekran — varaq chizig'i */
        .cs-strip { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .cs-strip-y { font-size: 12.5px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 5px 11px; margin-right: 4px; white-space: nowrap; }
        .cs-strip-q { display: inline-flex; align-items: center; gap: 6px; font-family: inherit; font-size: 13px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 999px; padding: 4px 11px; cursor: pointer; }
        .cs-strip-q:disabled { cursor: default; opacity: .7; }
        .cs-strip-q > i { font-style: normal; font-weight: 800; color: ${T.accent}; }
        .cs-strip-q em { font-style: normal; font-weight: 800; }
        .cs-strip-q.on { border-color: ${T.accent}; color: ${T.ink}; }
        .cs-strip-q.ok { color: ${T.ok}; } .cs-strip-q.ok > i { color: ${T.ok}; }
        .cs-strip-q.acc { color: ${T.accent}; } .cs-strip-q.err { color: ${T.err}; } .cs-strip-q.err > i { color: ${T.err}; }
        .cs-strip-q.yangi { animation: cs-pop .45s ease-out; }
        .cs-strip-e { font-size: 12px; color: ${T.ink2}; }
        .cs-vaqt-k { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        .cs-vaqt-k > b { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: ${T.ink}; }
        .cs-osh { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; color: ${T.err}; }
        /* Kartochka — neytral (P10) */
        .cs-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: cs-puls 1.8s ease-out .4s 3; }
        .cs-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .cs-flash .fc-front { box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        p.cs-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        p.cs-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* Yakun */
        .cs-yakun { display: flex; flex-direction: column; flex: 1 0 auto; }
        .cs-yakun.belgisiz .done-chip .tick { display: none; }
        .cs-hw { display: flex; flex-direction: column; gap: 12px; }
        .cs-hw-karta { display: grid; gap: 8px; }
        .cs-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .cs-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .cs-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.cs-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .cs-hw-qadam li { display: flex; gap: 8px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .cs-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .cs-hw-qadam li > span { display: flex; flex-direction: column; gap: 4px; }
        .cs-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .cs-hw-b { display: block; }
        @media (max-width: 640px) {
          .cs-sahna { grid-template-columns: minmax(0,1fr); } .cs-sahna-tel { order: 2; }
          .cs-tm-bo em, .cs-tm-bo small { display: none; } .cs-tm-q { flex-wrap: wrap; } .cs-tm-sj, .cs-tm.katta .cs-tm-sj { flex-basis: 100%; }
          .cs-kir-k { grid-template-columns: 1fr; } .cs-savollar, .cs-m4 { grid-template-columns: 1fr; } .cs-hw-karta { grid-template-columns: 1fr !important; }
          .cs-hk { padding: 8px 10px; gap: 10px; } .cs-hk-s { font-size: 14px; } .cs-qayta { position: static; align-items: flex-start; }
          .cs-lap.yon { flex-direction: column; } .cs-lap.yon > .cs-lap-ekran { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-halqa, .cs-k.kutish .q-variant, .q-bashorat .q-chip, .cs-qadamlar .q-chip, .cs-hk, .cs-hk-s, .cs-hk-s > i, .cs-tel-son, .cs-lap-son, .cs-tel-kor, .cs-lap-oyin, .cs-ulan, .cs-video, .cs-pufak, .cs-qayta,
          .cs-tm-sj, .cs-tm-oxir, .cs-yq-q, .cs-kir-karta, .cs-reja-v, .cs-reja-v .cs-bolim, .cs-varaq, .cs-yoz > span, .cs-vq, .cs-belgi-c, .q-chip.cs-belgi, .cs-vz, .cs-vqm-r, .cs-doira > i, .cs-ix, .cs-karta, .cs-tur .q-chip,
          .cs-sj-karta, .cs-strip-q, .cs-flash .fc-front, .cs-spin { animation: none !important; }
          .cs-kir-k, .cs-uchar, .cs-tm.jonli .cs-tm-t > i, .cs-kat > i { transition: none !important; }
          .cs-tm.yur .cs-tm-t > i, .cs-kat.anim > i, .cs-video-ch > i, .cs-tm.b .cs-tm-bo.yuradi .cs-tm-t > i { animation: none !important; transform: scaleX(1); }
          .cs-qayta-t::after { animation: none !important; }
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
        /* F-1008-583: ⛶ vizualning o'z burchagida (top 8, right 8) — kontentdan tashqarida emas;
           torroq ekranda ichkarida qoladi va o'ng ustunning birinchi yorlig'iga o'ngdan 40 px joy beriladi. */
        @media (min-width: 1200px) { .zoomable:not(.zoom-on) > .zoom-btn { top: 8px; right: 8px; } .zoomable.z-float:not(.zoom-on) > .zoom-btn { visibility: visible; } }
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
