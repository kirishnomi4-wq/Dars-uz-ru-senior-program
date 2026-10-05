import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 9-Modul · 8-dars (PM + amaliyot) «Yaxshi interfeysdan nimani olasiz?» — kalit m7-08, lessonId m7-08-v1.
// Manba-haqiqat: feedback/F-1005-9modul/08-PmDesignMotion-v3.md (GATE M). Skeletdan (src/skelet/NamunaDars.jsx) — konveyer, pilot naqshi 7-dars.
// 12 ekran: s0 QKirish · s1 QReja · s2 QTushuncha (bezak va usul) · s3 test · s4 QVoqea (Tweetie) · s5 QTushuncha (animatsiya talabi) ·
//   a1/a2 amaliyot bloki (QBlok + ScreenBlok ulagichi, 5 qadam) · s8 yakuniy test · podium · QKartochka (alohida ekran, F-1005-88) · QYakun (+ PM HwCard, M-q9).
// Bitta vizual — «Ikki telefon» (KATAKLAR + DIZ_BOLAKLAR → DizaynerTel · MaydonTel). Motion platformada yo'q — maketda CSS bilan taqlid qilinadi.
// Saqlash: A1 5-qadam «Usul kartam» — answers[6].goya (ccProgress); kirish qatori — localStorage pm-m7d3-muammo (tayanch 6). Yangi kalit yo'q.
// JONLI: useLiveSession + INLINE_KEYS (s3 → 1, s8 → 0) + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QKarta, QChip, QBashorat, QTaxmin, QQadamlar, QXulosa, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QVoqea, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm7-08-v1', lessonTitle: { uz: 'Yaxshi interfeysdan nimani olasiz?', ru: 'Что взять из хорошего интерфейса?' } };
// 12 ekran (GATE M P-q0 + F-1005-88): PM qismi 0–5 → amaliyot bloki A1 · A2 → yakuniy savol → podium → kartochkalar (alohida ekran) → yakun.
const HW_TOKENS = [
  { t: { uz: 'usul', ru: 'приём' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'talab', ru: 'требование' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: '0,4 s', ru: '0,4 с' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'animatsiya', ru: 'анимация' }, l: 74, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0  · QKirish
  { id: 's1',  type: 'plan',        template: 'custom',   scored: false, scope: null },            // 1  · QReja
  { id: 's2',  type: 'concept',     template: 'custom',   scored: false, scope: null },            // 2  · QTushuncha: bezak va usul
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 3  · 1-savol (✔ B)
  { id: 's4',  type: 'keys',        template: 'custom',   scored: false, scope: null },            // 4  · QVoqea: Tweetie
  { id: 's5',  type: 'concept',     template: 'custom',   scored: false, scope: null },            // 5  · QTushuncha: animatsiya talabi
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 6  · QBlok: vaqtlar to'ri
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 7  · QBlok: ro'yxat va sahifa o'tishi
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 8  · 2-savol, yakuniy (✔ A)
  { id: 'podium', type: 'stats',      template: 'custom', scored: false, scope: null },            // 9  · podium
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },            // 10 · QKartochka (alohida ekran)
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: null }             // 11 · QYakun (+ PM HwCard)
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi) — MD: s3 = B (1), s8 = A (0).
const INLINE_KEYS = { s3: 1, s8: 0 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); PM darsi — emoji o'rniga raqam 1/2/3 (S-026)
const RECAPS = {
  3: {
    title: { uz: 'Usul va bezak', ru: 'Приём и украшение' },
    cards: [
      { ic: '1', h: { uz: 'Usul', ru: 'Приём' }, body: { uz: "Boshqa interfeysda ishlatilgan va foydalanuvchining vazifasini osonlashtiradigan ko'rinish yoki harakat.", ru: 'Вид или действие из другого интерфейса, которое облегчает задачу пользователя.' } },
      { ic: '2', h: { uz: 'Bezak', ru: 'Украшение' }, body: { uz: "Bu misolda vazifani o'zgartirmay, faqat ko'rinishni o'zgartiradigan detal.", ru: 'В этом примере деталь, которая меняет только вид, а не задачу.' } },
      { ic: '3', h: { uz: "Har bo'lakdan so'rang", ru: 'Спросите про каждую часть' }, body: { uz: "U foydalanuvchining qaysi savoliga javob beradi?", ru: 'На какой вопрос пользователя она отвечает?' }, ask: { uz: 'Kino chiptasi ilovasidan bitta narsa olasiz. Qaysi biri usul?', ru: 'Вы берёте одну вещь из приложения кинобилетов. Что из этого приём?' } }
    ]
  },
  8: {
    title: { uz: 'Animatsiya talabi', ru: 'Требование к анимации' },
    cards: [
      { ic: '1', h: { uz: 'Qayerda', ru: 'Где' }, body: { uz: "Harakat qaysi joyda bo'ladi.", ru: 'В каком месте будет движение.' } },
      { ic: '2', h: { uz: 'Nima qilsin', ru: 'Что сделать' }, body: { uz: 'Qanday harakat va necha soniya.', ru: 'Какое движение и сколько секунд.' } },
      { ic: '3', h: { uz: 'Nima buzilmasin', ru: 'Что не сломать' }, body: { uz: 'Qaysi eski animatsiya qolishi kerak.', ru: 'Какая старая анимация должна остаться.' }, ask: { uz: 'Agent ro\'yxat animatsiyasini 2 soniya qildi. Talabda nima aytilmagan?', ru: 'Агент сделал анимацию списка на 2 секунды. Что не сказано в требовании?' } }
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

// ===== DARSNING BITTA VIZUALI — «Ikki telefon» (163, 180): bitta manba KATAKLAR + DIZ_BOLAKLAR → DizaynerTel · MaydonTel · IkkiTelefon =====
// qolip-maket: dm-katak dm-strelka dm-bolak dm-tanla
// K1 (tayanch 5): 6 katak 16:00 … 21:00 · Shanba band — 17:00, 20:00 (18:00 bo'sh — 10-dars sinovi) · Yakshanba — hammasi bo'sh (repo dars-07-done).
// Dizayner ekrani — Dribbble'dagi ishlarga o'xshatib o'zimiz chizgan maket (real ish emas, logotip va muallif yo'q). Rang — maket bo'yog'i (token emas, brend kabi).
const cx = (...a) => a.filter(Boolean).join(' ');
const KATAKLAR = {
  soatlar: ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
  kunlar: [
    { nom: { uz: 'Shanba', ru: 'Суббота' }, band: ['17:00', '20:00'] },
    { nom: { uz: 'Yakshanba', ru: 'Воскресенье' }, band: [] }
  ]
};
const HOLAT_SOZ = { bosh: { uz: "bo'sh", ru: 'свободно' }, band: { uz: 'band', ru: 'занято' } };
const KUN_TASMA = [{ uz: 'Du', ru: 'Пн' }, { uz: 'Se', ru: 'Вт' }, { uz: 'Ch', ru: 'Ср' }, { uz: 'Pa', ru: 'Чт' }, { uz: 'Ju', ru: 'Пт' }, { uz: 'Sh', ru: 'Сб' }, { uz: 'Ya', ru: 'Вс' }];
const SH_IDX = 5;
const PUFAK = {
  savol: { uz: "Bugun qaysi vaqt bo'sh?", ru: 'Какое время сегодня свободно?' },
  ok: { uz: "✓ 18:00 bo'sh ekan", ru: '✓ 18:00 свободно' }
};
// Kam harakat rejimi (prefers-reduced-motion): kirish, uchish va puls yo'q — holat bir zumda
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Dizayner ekranidagi to'rt bo'lak (2-ekran) — tur: usul | bezak; natija — Maydon'ga qo'yilgandagi qator (MD 2-ekran)
const DIZ_BOLAKLAR = [
  { id: 'fon', tur: 'bezak', nom: { uz: 'Binafsha fon', ru: 'Фиолетовый фон' }, qator: { uz: "binafshadan ko'kka o'tadigan fon", ru: 'фон, переходящий из фиолетового в синий' }, natija: { uz: 'Savolga javob bermadi.', ru: 'На вопрос не ответил.' } },
  { id: 'rasm', tur: 'bezak', nom: { uz: "To'p rasmi", ru: 'Картинка мяча' }, qator: { uz: "tepada katta futbol to'pi", ru: 'большой футбольный мяч сверху' }, natija: { uz: 'Kataklar yana pastga tushdi.', ru: 'Ячейки опустились ещё ниже.' } },
  { id: 'tasma', tur: 'usul', nom: { uz: 'Kunlar tasmasi', ru: 'Лента дней' }, qator: { uz: 'yetti kun yonma-yon, tanlangani ajralgan', ru: 'семь дней в ряд, выбранный выделен' }, natija: { uz: '«Boshqa kun-chi?» savoliga javob', ru: 'ответ на вопрос «А другой день?»' } },
  { id: 'tor', tur: 'usul', nom: { uz: "Vaqtlar to'ri", ru: 'Сетка времени' }, qator: { uz: 'kataklar uch ustunda, butun kun bir ekranda', ru: 'ячейки в три столбца, весь день на одном экране' }, natija: { uz: "«Bugun qaysi vaqt bo'sh?» savoliga javob", ru: 'ответ на вопрос «Какое время сегодня свободно?»' } }
];
const TUR_SOZ = { usul: { uz: 'usul', ru: 'приём' }, bezak: { uz: 'bezak', ru: 'украшение' } };

// Futbol to'pi — chizilgan (SVG), rasm emas
const FutbolTop = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill={T.paper} stroke={T.ink} strokeWidth="3" />
    <polygon points="50,31 67,43 61,63 39,63 33,43" fill={T.ink} />
    <path d="M50 31 L50 6 M67 43 L91 36 M61 63 L76 86 M39 63 L24 86 M33 43 L9 36" stroke={T.ink} strokeWidth="3" fill="none" />
    <path d="M38 6 L50 6 L62 6 M84 26 L91 36 L92 52 M84 80 L76 86 L62 94 M38 94 L24 86 L16 80 M8 52 L9 36 L16 26" stroke={T.ink} strokeWidth="3" fill="none" strokeLinejoin="round" />
  </svg>
);
// Chap telefon — dizayner ekrani (0 va 2-ekran). ajrat — uzuq chiziq bilan ajraladigan qismlar · olingan — Maydon'ga olib o'tilgan bo'laklar (xiralashadi)
const DizaynerTel = ({ ajrat = [], olingan = [] }) => {
  const sh = KATAKLAR.kunlar[0];
  const q = (id) => cx('dm-dq', ajrat.includes(id) && 'aj', olingan.includes(id) && 'olindi');
  return (
    <div className="dm-tel dm-diz" role="img" aria-label={tr({ uz: 'Dizayner ekrani', ru: 'Экран дизайнера' })}>
      <div className={cx('dm-ekran', ajrat.includes('fon') && 'aj-fon', olingan.includes('fon') && 'olindi-fon')}>
        <span className="dm-notch" />
        <div className={q('rasm')}><FutbolTop className="dm-diz-top" /></div>
        <div className={q('shrift')}><b className="dm-diz-h">{tr(sh.nom)}</b></div>
        <div className={q('tasma')}><div className="dm-tasma diz">{KUN_TASMA.map((k, i) => <span key={i} className={i === SH_IDX ? 'on' : undefined}>{tr(k)}</span>)}</div></div>
        <div className={q('tor')}><div className="dm-diz-tor">{KATAKLAR.soatlar.map(s => <span key={s} className={sh.band.includes(s) ? 'band' : undefined}>{s}</span>)}</div></div>
      </div>
    </div>
  );
};
// Ro'yxat animatsiyasi rejimlari (5-ekran): har katakning kechikishi — jami vaqt rejimga qarab (aniq/mikroYoq 0,4 s · uzoq/motion 2 s)
const KIRISH_KECH = { aniq: 0.048, mikroYoq: 0.048, uzoq: 0.24, motion: 0.24, sakrash: 0.06 };
// O'ng telefon — Maydon. tor — vaqtlar to'ri (uch ustun), aks holda bitta ustun · fon / rasm / tasma — dizayner bo'laklari qatlami ·
// kun — 0 Shanba, 1 Yakshanba · yon — kun almashganda yangi kun qaysi tomondan kiradi ('ong' | 'chap') · kirish — ro'yxat animatsiyasi rejimi · kKey — qayta yurgizish ·
// joy — pufak uchun tepada joy (pufaksiz maketda false) · jonli — bo'sh katak bosilsa kichrayib qaytadi · avtoBos — kirishdan keyin barmoq 18:00 ni o'zi bosadi · pufak — 'savol' | 'ok' | {uz, ru} · yonadi — pastki chet bir lahza yonadi
const MaydonTel = ({ tor = false, fon = false, rasm = false, tasma = false, kun = 0, onKun, yon = null, kirish = null, kKey = 0, jonli = true, avtoBos = false, pufak = null, yonadi = false, katta = false, strelka = null, joy = true }) => {
  const k = KATAKLAR.kunlar[kun] || KATAKLAR.kunlar[0];
  const [bos, setBos] = useState(null);
  const [barmoq, setBarmoq] = useState(false);
  const tRef = useRef([]);
  const keyin = (fn, ms) => { tRef.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => tRef.current.forEach(clearTimeout), []);
  const mikro = jonli && kirish !== 'mikroYoq';
  const tap = (s) => { if (!jonli) return; if (mikro) { setBos(s); keyin(() => setBos(null), 220); } };
  useEffect(() => {
    if (!avtoBos || kamHarakat()) return;
    const jami = kirish ? (KIRISH_KECH[kirish] || 0.05) * 5 * 1000 + 900 : 500;
    keyin(() => { setBarmoq(true); if (mikro) setBos('18:00'); }, jami);
    keyin(() => setBos(null), jami + 240);
    keyin(() => setBarmoq(false), jami + 700);
  }, [kKey, kirish, avtoBos]); // eslint-disable-line
  const kech = (i) => (kirish && !kamHarakat() ? { animationDelay: `${(i * (KIRISH_KECH[kirish] || 0.05)).toFixed(3)}s` } : undefined);
  const pufakMatn = pufak === 'savol' ? tr(PUFAK.savol) : pufak === 'ok' ? tr(PUFAK.ok) : pufak ? tr(pufak) : null;
  return (
    <div className={cx('dm-tel-w', katta && 'katta')}>
      {joy && <div className="dm-pufak-joy">{pufakMatn && <span key={pufakMatn} className={cx('dm-pufak', pufak === 'ok' && 'ok')}><i className="dm-oyinchi" aria-hidden="true" />{pufakMatn}</span>}</div>}
      <div className="dm-tel dm-maydon">
        <div className={cx('dm-ekran', fon && 'fon', yonadi && 'yonadi')}>
          <span className="dm-notch" />
          <div key={`b${kKey}`} className={cx('dm-m-bosh', kirish === 'sakrash' && 'dm-sakra')}><b className="dm-m-nom">Maydon</b></div>
          <div key={`k${kKey}`} className={cx('dm-kun', kirish === 'sakrash' && 'dm-sakra')} style={kirish === 'sakrash' ? { animationDelay: '0.08s' } : undefined}>
            <button type="button" className={cx('dm-strelka', strelka === 'chap' && 'bos')} disabled={!onKun || kun <= 0} onClick={() => onKun && onKun(kun - 1, 'chap')} aria-label={tr({ uz: 'Oldingi kun', ru: 'Предыдущий день' })}>‹</button>
            <b key={kun} className={cx('dm-kun-n', yon && `yon-${yon}`)}>{tr(k.nom)}</b>
            <button type="button" className={cx('dm-strelka', strelka === 'ong' && 'bos')} disabled={!onKun || kun >= KATAKLAR.kunlar.length - 1} onClick={() => onKun && onKun(kun + 1, 'ong')} aria-label={tr({ uz: 'Keyingi kun', ru: 'Следующий день' })}>›</button>
          </div>
          {tasma && <div className="dm-tasma qatlam">{KUN_TASMA.map((d, i) => <span key={i} className={i === SH_IDX + kun ? 'on' : undefined}>{tr(d)}</span>)}</div>}
          {rasm && <FutbolTop className="dm-m-top qatlam" />}
          <div className="dm-kq">
            <div key={`${kun}-${kKey}`} className={cx('dm-kataklar', tor ? 'tor' : 'ustun', kirish && `k-${kirish}`, !kirish && yon && `yon-${yon}`)}>
              {KATAKLAR.soatlar.map((s, i) => {
                const b = k.band.includes(s);
                return (
                  <button type="button" key={s} className={cx('dm-katak', b && 'band', bos === s && 'bos')} style={kech(i)} disabled={b} onClick={() => tap(s)}>
                    <span className="dm-k-s">{s}</span><small>{tr(b ? HOLAT_SOZ.band : HOLAT_SOZ.bosh)}</small>
                    {barmoq && s === '18:00' && <i className="dm-barmoq" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// «Ikki telefon» — chapda dizayner ekrani (faqat 0 va 2-ekran), o'ngda Maydon (children)
const IkkiTelefon = ({ ajrat, olingan, children }) => (
  <div className="dm-ikki">
    <div className="dm-ustun"><div className="dm-brend-joy"><span className="dm-brend dribbble">Dribbble</span></div><DizaynerTel ajrat={ajrat} olingan={olingan} /></div>
    <div className="dm-ustun">{children}</div>
  </div>
);
// Mentorga eslatma (MD «O'qituvchi eslatmasi») — faqat mentor rejimida, bosilsa ochiladi (1-dars naqshi)
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
// SABOQ 11: bashorat tanlangach yopilmaydi — savol va tanlangan javob ixcham qator bo'lib natijagacha turadi
const TaxminIxcham = ({ savol, javob }) => (
  <div className="dm-taxmin">
    <span className="q-yorliq">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span>
    <span className="dm-taxmin-s">{savol}</span>
    <b className="dm-taxmin-j">{javob}</b>
  </div>
);
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
// DE-199: ish tugab natija fokusga chiqqach xulosa ham ko'rinsin — sahifa pastga silliq suriladi (oldin tugagan bo'lsa — surilmaydi)
const useXulosaSkroll = (tugadi, avval) => {
  useEffect(() => {
    if (!tugadi || avval) return;
    const t = setTimeout(() => { const sc = document.querySelector('.stage-content'); if (sc) sc.scrollTo({ top: sc.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 350);
    return () => clearTimeout(t);
  }, [tugadi]); // eslint-disable-line
};

// ===== SCREEN 0 — KIRISH (QKirish: «Ikki telefon» → variant → tanlangan qism uzuq chiziq bilan ajraladi, o'yinchi pufagi chiqadi, Maydon'ning pastki cheti yonadi; ballsiz, J-026) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Ko'rinishini — fon rangi, rasm va shrift", ru: 'Внешний вид — цвет фона, картинку и шрифт' }, ajrat: ['fon', 'rasm', 'shrift'] },
  { id: 'b', label: { uz: "Ishlashini — vaqtlar qanday ko'rsatilgani", ru: 'Как работает — как показано время' }, ajrat: ['tasma', 'tor'] }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const pick = (v) => { if (picked !== null) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const opt = HOOK_OPTS.find(o => o.id === picked);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · dizayner ekrani', ru: 'Введение · экран дизайнера' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Dizayner ekranidan Maydon'ga <A>nimani olasiz?</A></>, ru: <>Что взять с экрана дизайнера <A>в Maydon?</A></> })}
        mentor={<Mentor>{tr({ uz: "Chapdagi ekranni Dribbble'dagi ishlarga o'xshatib chizdik: Dribbble — dizaynerlar o'z ishini ko'rsatadigan sayt. O'ngda — o'tgan darsda qurilgan Maydon.", ru: 'Экран слева мы нарисовали похожим на работы с Dribbble: Dribbble — сайт, где дизайнеры показывают свои работы. Справа — Maydon, собранный на прошлом уроке.' })}</Mentor>}
        maket={<div className={cx('dm-hook', picked === null && 'tanla')}><IkkiTelefon ajrat={opt ? opt.ajrat : []}><MaydonTel pufak={picked !== null ? 'savol' : null} yonadi={picked !== null} /></IkkiTelefon></div>}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
        javob={picked !== null && <p className="hook-ack fade-step">{picked === 'b'
          ? tr({ uz: <><b>Aynan!</b> Bu misolda rang va rasm faqat ko'rinishni o'zgartiradi. O'yinchiga vaqtlar qanday ko'rsatilgani yordam beradi.</>, ru: <><b>Именно!</b> В этом примере цвет и картинка меняют только вид. А игроку помогает то, как показано время.</> })
          : tr({ uz: <><b>Qiziq fikr!</b> Rang yoqadi, lekin bu misolda u faqat ko'rinish. O'yinchiga vaqtlar qanday ko'rsatilgani yordam beradi.</>, ru: <><b>Интересная мысль!</b> Цвет нравится, но в этом примере это только вид. Игроку помогает то, как показано время.</> })}</p>}
      >
        <MentorNote>{tr({ uz: "Dribbble'ni hozir ochmang — uni o'quvchi mustaqil ishda o'z g'oyasi uchun ochadi.", ru: 'Не открывайте Dribbble сейчас — ученик откроет его в самостоятельной работе для своей идеи.' })}</MentorNote>
      </QKirish>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda Maydon jonli holatda bir marta o'zi yuradi — kataklar birin-ketin kiradi → › → Yakshanba o'ngdan; o'ngda 4 qadam, pastda repo teglari) =====
const REJA = [
  { t: { uz: 'Dizayner ekranidan nimani olish kerakligini ajratasiz', ru: 'Отличите, что брать с экрана дизайнера' }, teg: { uz: 'tanlash', ru: 'выбор' } },
  { t: { uz: "Bitta usul ilovadan ilovaga qanday o'tganini ko'rasiz", ru: 'Увидите, как один приём перешёл из приложения в приложение' }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: "O'z g'oyangiz uchun Dribbble'dan usul topasiz", ru: 'Найдёте на Dribbble приём для своей идеи' }, teg: { uz: 'izlash', ru: 'поиск' } },
  { t: { uz: "Maydon'ga usul va animatsiyalarni agent orqali qo'shasiz", ru: 'Добавите в Maydon приём и анимации через агента' }, teg: { uz: 'amaliyot', ru: 'практика' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [kun, setKun] = useState(0);
  const [yon, setYon] = useState(null);
  const [strelka, setStrelka] = useState(null);
  useEffect(() => { // DE-200: bir marta o'zi yuradi
    if (kamHarakat()) return;
    const a = setTimeout(() => setStrelka('ong'), 1700);
    const b = setTimeout(() => { setStrelka(null); setYon('ong'); setKun(1); }, 1950);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Dars oxirida Maydon <A>jonli ko'rinadi</A>.</>, ru: <>К концу урока Maydon <A>оживёт</A>.</> })}
        mentor={<Mentor>{tr({ uz: "Kodni agent — Antigravity — yozadi, siz unga talab berasiz. Talab o'tgan darsdagidek: qayerda, nima qilsin, nima buzilmasin.", ru: 'Код пишет агент — Antigravity, а вы даёте ему требование. Требование — как на прошлом уроке: где, что сделать, что не сломать.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="dm-reja-tel"><MaydonTel joy={false} tor kun={kun} yon={yon} strelka={strelka} kirish={kun === 0 ? 'aniq' : null} onKun={(n, y) => { setYon(y); setKun(n); }} /></div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <p className="dm-repo">{tr({ uz: 'repo maydon · boshlanish dars-07-done · tayyor dars-08-done', ru: 'репо maydon · начало dars-07-done · готово dars-08-done' })}</p>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · BEZAK VA USUL (QTushuncha: bashorat → bo'laklar bittadan katta karta → bosilsa Maydon'ga uchadi, Maydon o'zgaradi, karta ixcham natija qatoriga aylanadi →
//        4/4 da usul/bezak nomi va ta'rif → 2-bosqich: ikki karta, tanlangan usul Maydon'da qoladi; tugagach Maydon butun enga, DE-199) =====
// SABOQ 9/13: bo'laklar birdaniga to'kilmaydi — bittadan chiqadi (MD tartibi: fon · rasm · tasma · to'r). Sudrash yo'q — bosish (MD «yoki sudrash» ixtiyoriy).
const S2_SAVOL = { uz: "Bo'laklardan nechtasi o'yinchiga yordam beradi?", ru: 'Сколько частей помогут игроку?' };
const S2_TAXMIN = [{ k: '1', t: '1' }, { k: '2', t: '2' }, { k: '3', t: '3' }];
const USUL_IZOH = {
  tor: { uz: "Asosiy savol bo'sh vaqt haqida — to'r shunga javob beradi.", ru: 'Главный вопрос — о свободном времени, и сетка на него отвечает.' },
  tasma: { uz: "Kun tanlash qulay, lekin asosiy savol — bo'sh vaqt.", ru: 'Выбирать день удобно, но главный вопрос — свободное время.' }
};
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const HAMMA = DIZ_BOLAKLAR.map(b => b.id);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qoyilgan, setQoyilgan] = useState(avval ? HAMMA : []);
  const [uch, setUch] = useState(null); // { dx, dy } — bo'lak Maydon'ga uchmoqda
  const [tanlov, setTanlov] = useState(avval ? 'tor' : null);
  const [birinchi, setBirinchi] = useState(storedAnswer?.birinchi ?? null);
  const tm = useRef([]);
  const nomRef = useRef(null);
  const keyin = (fn, ms) => { tm.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const n = qoyilgan.length;
  const joriy = DIZ_BOLAKLAR[n];
  const hammasi = n >= HAMMA.length;
  const done = hammasi && tanlov === 'tor';
  const tugadi = useTugadi(done, 1300, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'concept', screenIdx: screen, correct: birinchi === 'tor', picked: true, taxmin, birinchi }); }, [done]); // eslint-disable-line
  const bor = (id) => qoyilgan.includes(id);
  const qoy = () => {
    if (!taxmin || !joriy || uch) return;
    const id = joriy.id;
    const tush = () => { setUch(null); setQoyilgan(q => (q.includes(id) ? q : [...q, id])); };
    const a = nomRef.current, b = document.querySelector('.q-tushuncha .dm-maydon .dm-ekran');
    if (!a || !b || kamHarakat()) { tush(); return; }
    // Uchish: bo'lak matni Maydon ekraniga boradi (--lz kattalashtirishi hisobga olinadi)
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lz')) || 1;
    setUch({ dx: (rb.left + rb.width / 2 - (ra.left + ra.width / 2)) / z, dy: (rb.top + rb.height / 3 - (ra.top + ra.height / 2)) / z });
    keyin(tush, 560);
  };
  const tanla = (v) => { if (!hammasi || tanlov === 'tor') return; setTanlov(v); if (!birinchi) setBirinchi(v); };
  // Maydon holati: 1-bosqichda qo'yilgan qatlamlar; 2-bosqichda faqat tanlangan usul (fon, rasm va ikkinchi usul o'chadi)
  const m = tanlov
    ? { tor: tanlov === 'tor', tasma: tanlov === 'tasma', fon: false, rasm: false }
    : { tor: bor('tor'), tasma: bor('tasma'), fon: bor('fon'), rasm: bor('rasm') };
  const pufak = m.tor ? 'ok' : 'savol';
  const maydon = <MaydonTel {...m} pufak={pufak} />;
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  // 4/4 dan keyin: atama (misoldan KEYIN, bir marta) va bashorat natijasi; tugagach — Maydon yonida, fokusda (DE-199)
  const natijaQ = hammasi && (
    <div className="dm-natija">
      <p className="dm-joriy fade-step">{tr({ uz: <>Boshqa interfeysda ishlatilgan va foydalanuvchining vazifasini osonlashtiradigan ko'rinish yoki harakat <b>interfeys usuli</b> deyiladi — «Arxitektura patternlari»dagi pattern kabi. Bu misolda fon va katta rasm faqat ko'rinishni o'zgartirdi — bu <b>bezak</b>.</>, ru: <>Вид или действие из другого интерфейса, которое облегчает задачу пользователя, называется <b>приёмом интерфейса</b> — как паттерн из урока «Архитектурные паттерны». В этом примере фон и большая картинка меняли только вид — это <b>украшение</b>.</> })}</p>
      {tx && <QTaxmin togri={taxmin === '2'}>{taxmin === '2'
        ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение верно' })
        : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tx.t} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>2</b></>}</QTaxmin>}
    </div>
  );
  const vizual = tugadi ? <div className="dm-fokus2">{maydon}<div className="q-col">{natijaQ}</div></div> : <IkkiTelefon ajrat={joriy && taxmin ? [joriy.id] : []} olingan={hammasi ? [] : qoyilgan}>{maydon}</IkkiTelefon>;
  const navLabel = !taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' })
    : !hammasi ? tr({ uz: `Bo'laklarni qo'ying (${n}/4)`, ru: `Поставьте части (${n}/4)` })
      : !done ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите одну' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · bezak va usul', ru: 'Понятие · украшение и приём' })} screen={screen} scrollSignal={n + (tanlov ? 10 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Qaysi bo'lak <A>o'yinchiga yordam beradi?</A></>, ru: <>Какая часть <A>поможет игроку?</A></> })}
        mentor={<Mentor>{tr({ uz: "Dizayner ekranidagi bo'laklarni birma-bir Maydon'ga qo'yib ko'ring va o'yinchining savoliga qarang.", ru: 'Поставьте части с экрана дизайнера в Maydon по одной и посмотрите на вопрос игрока.' })}</Mentor>}
        bashorat={!taxmin
          ? <div className="dm-navbat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !hammasi && <TaxminIxcham savol={tr(S2_SAVOL)} javob={tx ? tx.t : ''} />}
        harakat={taxmin && (
          <div className="q-col dm-s2">
            {n > 0 && (
              <ul className="dm-qoyilgan">
                {qoyilgan.map(id => {
                  const b = DIZ_BOLAKLAR.find(x => x.id === id);
                  return (
                    <li key={id} className={cx('dm-qq', b.tur === 'usul' ? 'ok' : 'kul', tanlov && tanlov !== id && 'xira')}>
                      <i aria-hidden="true">✓</i><b>{tr(b.nom)}</b><span className="dm-qq-n">{tr(b.natija)}</span>
                      {hammasi && <span className={cx('dm-tur', b.tur)}>{tr(TUR_SOZ[b.tur])}</span>}
                    </li>
                  );
                })}
              </ul>
            )}
            {joriy && (
              <div key={joriy.id} className="dm-bk-w">
                <QKarta yorliq={`${tr({ uz: "Bo'lak", ru: 'Часть' })} ${n + 1} / ${HAMMA.length}`} className="dm-bk">
                  <button type="button" className={cx('dm-bolak', !uch && 'dm-navbat')} disabled={!!uch} onClick={qoy}>
                    <span ref={nomRef} className={cx('dm-bolak-m', uch && 'uchdi')} style={uch ? { transform: `translate(${uch.dx}px, ${uch.dy}px) scale(.55)` } : undefined}><b>{tr(joriy.nom)}</b> — {tr(joriy.qator)}</span>
                    <i className="dm-bolak-ch" aria-hidden="true">›</i>
                  </button>
                </QKarta>
              </div>
            )}
            {hammasi && (
              <div className="dm-b2 fade-step">
                <p className="dm-savolq">{tr({ uz: <>Intervyuda 5 kishidan 4 tasi: «Oxirgi marta kelganimizda maydon band edi». <b>Maydon'ga qaysi usulni olasiz?</b></>, ru: <>В интервью 4 человека из 5: «В прошлый раз, когда мы пришли, поле было занято». <b>Какой приём вы возьмёте в Maydon?</b></> })}</p>
                <div className="dm-ikki-k">
                  {['tor', 'tasma'].map(id => {
                    const b = DIZ_BOLAKLAR.find(x => x.id === id);
                    const navbat = !tanlov || (tanlov === 'tasma' && id === 'tor');
                    return (
                      <div key={id} className="dm-tk-w">
                        <button type="button" className={cx('dm-tanla', tanlov === id && 'on', navbat && 'dm-navbat')} disabled={tanlov === 'tor' || tanlov === id} onClick={() => tanla(id)}>
                          <b>{tr(b.nom)}</b><span>{tr(b.qator)}</span>
                        </button>
                        {tanlov && <span className="dm-izoh fade-step">{tr(USUL_IZOH[id])}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        vizual={vizual}
        natija={!tugadi && natijaQ}
        xulosa={done && tr({ uz: 'Bu mashqda dizayner ekranidan avval bitta usul olamiz — eng muhim savolga javob beradiganini.', ru: 'В этом упражнении сначала берём с экрана дизайнера один приём — тот, что отвечает на самый важный вопрос.' })}
      >
        <MentorNote>{tr({ uz: "Kunlar tasmasi ham yaxshi usul — u «keyin» ro'yxatida qoladi. Bu mashqda nima o'zgarganini aniq ko'rish uchun avval bittasini tanlaymiz.", ru: 'Лента дней — тоже хороший приём, она остаётся в списке «потом». В этом упражнении сначала выбираем один, чтобы ясно видеть, что изменилось.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1 — B; «Band» A va B da, to'g'risi eng uzun emas) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · usul', ru: 'Проверка · приём' })}
    questionText="Kino chiptasi ilovasidan bitta narsa olasiz. Qaysi biri usul?"
    question={tr({ uz: <h2 className="title h-ask">Kino chiptasi ilovasidan bitta narsa olasiz. <A>Qaysi biri usul?</A></h2>, ru: <h2 className="title h-ask">Вы берёте одну вещь из приложения кинобилетов. <A>Что из этого приём?</A></h2> })}
    options={[
      { uz: 'Band qilish tugmasi oltin rangda, yumaloq', ru: 'Кнопка брони золотистая и круглая' },
      { uz: "Band o'rindiq xira, uni bosib bo'lmaydi", ru: 'Занятое место бледное, его не нажать' },
      { uz: 'Har film ustida katta, rangli afisha rasmi', ru: 'Над каждым фильмом большая цветная афиша' },
      { uz: 'Fon qora, sarlavhalar esa qalin shriftda', ru: 'Фон чёрный, а заголовки жирным шрифтом' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Xira o'rindiq «qaysi joy bo'sh?» savoliga javob beradi.", ru: 'Бледное место отвечает на вопрос «какое место свободно?».' }}
    explainWrong={{
      0: { uz: 'Tugma rangi — bezak: u qaysi savolga javob beradi?', ru: 'Цвет кнопки — украшение: на какой вопрос он отвечает?' },
      2: { uz: "Afisha chiroyli, lekin bo'sh joyni topishga yordam bermaydi.", ru: 'Афиша красивая, но не помогает найти свободное место.' },
      3: { uz: "Fon va shrift — bezak: joy topish o'zgarmaydi.", ru: 'Фон и шрифт — украшение: поиск места не меняется.' },
      default: { uz: 'Foydalanuvchining savoliga javob beradiganini toping.', ru: 'Найдите то, что отвечает на вопрос пользователя.' }
    }} />
);

// ===== SCREEN 4 — TWEETIE (QVoqea, PM-028: nuqtalar · bosqich nomi + TortishMaket · 2/5 va 4/5 da bashorat) =====
// Manba (o'quvchi ko'rmaydi): en.wikipedia.org/wiki/Pull-to-refresh, /wiki/Tweetie — Loren Brichter; Tweetie 2 — birinchi pull-to-refresh; 2010-yil 9-aprel Twitter Tweetie'ni sotib oldi;
//   Chrome uni 41-versiyada qo'shgan · jeremystanley.substack.com «Twitter for iPhone: A history» (Tweetie 2 — 2009-yil 9-oktabr).
// F-1005-81 (SABOQ 8): bosqich gapini Mentor aytadi (har bosqichda almashadi); sahnada bosqich nomi va jonli maket. Bashorat bosqichida Mentor oldingi gapda qoladi, savol kartada.
// SABOQ 2: brend birinchi ko'rinishda — nom o'z rangida + bir qatorlik izoh (MD Mentor gapi, ikki qatorga bo'lindi — matn aynan). Logotip yo'q; postlar — kulrang chiziqlar.
const TW_BOSQICH = [
  { h: { uz: 'Yangilash tugmasi tepada', ru: 'Кнопка обновления сверху' }, m: { uz: "O'sha paytdagi Twitter ilovalarida yangi postni ko'rish uchun ro'yxat tepasiga chiqib, yangilash tugmasini bosish kerak edi.", ru: 'В тогдашних приложениях Twitter, чтобы увидеть новый пост, нужно было подняться к началу списка и нажать кнопку обновления.' }, maket: 'tugma' },
  { bashorat: 'b1', maket: 'tugma-tinch' },
  { h: { uz: 'Pastga tortib yangilash', ru: 'Потянуть вниз, чтобы обновить' }, m: { uz: "2009-yil oktabrda chiqqan Tweetie 2 da ro'yxat tepasida barmoq bilan pastga tortib qo'yib yuborsangiz, yangi postlar chiqardi. Tortib turganingizda ilova yangilanish boshlanishini ko'rsatardi.", ru: 'В Tweetie 2, вышедшем в октябре 2009 года, если потянуть список сверху пальцем вниз и отпустить, появлялись новые посты. Пока вы тянули, приложение показывало, что обновление начинается.' }, maket: 'tortish' },
  { bashorat: 'b3', maket: 'tortish-tinch' },
  { h: { uz: 'Usul tarqaldi', ru: 'Приём распространился' }, m: { uz: "2010-yilda Twitter Tweetie'ni sotib oldi. Pastga tortib yangilash keyin ko'p ilovalarda paydo bo'ldi: bugun telefondagi Chrome brauzerida ham sahifani shunday yangilaysiz.", ru: 'В 2010 году Twitter купил Tweetie. Потом «потянуть, чтобы обновить» появилось во многих приложениях: сегодня так же обновляют страницу и в Chrome на телефоне.' }, maket: 'uch' }
];
const TW_BASHORAT = {
  b1: { savol: { uz: 'Brichter yangilash tugmasi o\'rniga nima qildi?', ru: 'Что Брихтер сделал вместо кнопки обновления?' }, togri: 'b', v: [
    { k: 'a', t: { uz: "Tugmani ekranning pastiga ko'chirdi", ru: 'Перенёс кнопку вниз экрана' } },
    { k: 'b', t: { uz: "Ro'yxatni tortib yangilashni topdi", ru: 'Придумал обновление потягиванием списка' } },
    { k: 'c', t: { uz: "Ro'yxatni har daqiqada o'zi yangiladi", ru: 'Сделал, чтобы список сам обновлялся каждую минуту' } }
  ] },
  b3: { savol: { uz: "Keyin ko'p ilovalarda nima paydo bo'ldi?", ru: 'Что потом появилось во многих приложениях?' }, togri: 'b', v: [
    { k: 'a', t: { uz: "Tweetie'ning ranglari va belgisi", ru: 'Цвета и значок Tweetie' } },
    { k: 'b', t: { uz: 'Pastga tortib yangilash usuli', ru: 'Приём «потянуть вниз, чтобы обновить»' } },
    { k: 'c', t: { uz: "Tweetie ekranining o'zi", ru: 'Сам экран Tweetie' } }
  ] }
};
const TwPost = ({ yangi }) => <span className={cx('dm-tw-post', yangi && 'yangi')}><i /><span><b /><b /></span></span>;
// rejim: 'tugma' — barmoq ro'yxatni tepaga suradi, tugma bosiladi, kutish belgisi · 'tortish' — ro'yxat pastga tortiladi, strelka buriladi, aylanuvchi belgi, yangi post · '-tinch' — oxirgi holat, harakatsiz
const TwTel = ({ rejim, nom, rang, brauzer }) => {
  const tortish = rejim.startsWith('tortish');
  const tinch = rejim.endsWith('tinch');
  return (
    <div className={cx('dm-tw', `r-${rejim}`, tinch && 'tinch', rang)}>
      <div className="dm-tel dm-tw-tel">
        <div className="dm-ekran">
          <span className="dm-notch" />
          {brauzer
            ? <div className="dm-tw-bosh brauzer"><span className="dm-tw-manzil" /></div>
            : <div className="dm-tw-bosh"><b className={cx('dm-brend', rang)}>{nom}</b>{!tortish && <span className="dm-tw-tugma" aria-hidden="true"><i /></span>}</div>}
          <div className="dm-tw-oyna">
            {tortish && <span className="dm-tw-strelka" aria-hidden="true"><i className="dm-tw-o" /><i className="dm-tw-aylana" /></span>}
            <div className="dm-tw-royxat">
              {tortish && <TwPost yangi />}
              {[0, 1, 2, 3, 4].map(i => <TwPost key={i} />)}
            </div>
          </div>
          <i className="dm-tw-barmoq" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
const TortishMaket = ({ rejim }) => (rejim === 'uch'
  ? (
    <div className="dm-tw-uch">
      <div className="dm-tw-u"><TwTel rejim="tortish" nom="Twitter" rang="twitter" /></div>
      <div className="dm-tw-u"><span className="dm-brend chrome">Chrome</span><TwTel rejim="tortish" rang="chrome" brauzer /></div>
      <div className="dm-tw-u"><TwTel rejim="tortish" rang="uchinchi" nom="" /></div>
    </div>
  )
  : <TwTel rejim={rejim} nom="Tweetie" rang="tweetie" />);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 4 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? {});
  const done = b >= 4;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bq = TW_BOSQICH[b];
  const bsh = bq.bashorat && TW_BASHORAT[bq.bashorat];
  const tanlangan = bq.bashorat ? taxmin[bq.bashorat] : null;
  const kutish = !!bsh && !tanlangan;
  // Bashorat bosqichida Mentor va bosqich nomi — oldingi bosqichniki (savol kartada)
  const gap = bq.m ? bq : TW_BOSQICH[b - 1];
  const yorliq = `Tweetie · ${b + 1}/5`;
  const keyingi = () => { if (b < 4) setB(b + 1); else onNext(); };
  const tv = bsh && bsh.v.find(x => x.k === tanlangan);
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} scrollSignal={b} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={b < 4 ? `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/5)` : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <>Ro'yxatni pastga tortib yangilash <A>qayerdan chiqqan?</A></>, ru: <>Откуда взялось <A>«потянуть вниз, чтобы обновить»?</A></> })}
        nuqtalar={<>
          <Mentor key={`m${gap === bq ? b : b - 1}`}>{tr(gap.m)}</Mentor>
          <div className="dm-nuqtalar"><span className="dm-nuq-l">{yorliq}</span>{TW_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : undefined} />)}</div>
        </>}
        karta={<div className="dm-voqea" key={b}>
          <div className="dm-voqea-g">
            <Zoomable>
              <div className="dm-tw-sahna"><TortishMaket rejim={bq.maket} /></div>
            </Zoomable>
            <div className="dm-voqea-o">
              <span className="dm-voqea-h">{tr(gap.h)}</span>
              {b === 0 && (
                <div className="dm-tanish">
                  <span><b className="dm-brend tweetie">Tweetie</b> — {tr({ uz: 'iPhone uchun Twitter ilovasi edi, uni dasturchi Loren Brichter yasagan.', ru: 'приложение Twitter для iPhone, его сделал разработчик Лорен Брихтер.' })}</span>
                  <span><b className="dm-brend twitter">Twitter</b> — {tr({ uz: "bugungi X ijtimoiy tarmog'i.", ru: 'сегодняшняя соцсеть X.' })}</span>
                </div>
              )}
              {bsh && <div className={kutish ? 'dm-navbat-k' : undefined}><QBashorat yorliq={yorliq} savol={tr(bsh.savol)}
                variantlar={bsh.v.map(x => ({ k: x.k, t: tanlangan === x.k ? `${x.k === bsh.togri ? '✓' : '✗'} ${tr(x.t)}` : tr(x.t) }))} tanlov={tanlangan || null} onTanla={(k) => setTaxmin(t => ({ ...t, [bq.bashorat]: k }))} /></div>}
              {bsh && tv && <QTaxmin togri={tv.k === bsh.togri}>{tv.k === bsh.togri
                ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение верно' })
                : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tv.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(bsh.v.find(x => x.k === bsh.togri).t)}</b></>}</QTaxmin>}
              {done && <QXulosa>{tr({ uz: "Bitta usul turli ko'rinishdagi ilovalarda ishladi: u «Yangi post bormi?» savoliga javob berardi.", ru: 'Один приём сработал в приложениях с разным видом: он отвечал на вопрос «Есть ли новый пост?».' })}</QXulosa>}
            </div>
          </div>
        </div>}
      >
        <MentorNote>{tr({ uz: "Tortib turgandagi belgi — animatsiya: u foydalanuvchiga nima bo'layotganini aytadi. Amaliyotda Maydon'ga ham animatsiyalarni shu maqsadda qo'shamiz.", ru: 'Значок, пока тянете, — это анимация: она говорит пользователю, что происходит. На практике мы добавим анимации в Maydon с той же целью.' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 5 — TUSHUNCHA · ANIMATSIYA TALABI (QTushuncha: uch qism ketma-ket — variant → Maydon shu talab bo'yicha harakatlanadi, pufak o'zgaradi, QXato; 3/3 → talab qutisi; tugagach butun enga) =====
// Variantlar MD tartibida (aniq varianti har qismda oxirida — MD matni o'zgartirilmadi). rejim — MaydonTel kirish rejimi.
const TALAB_QISM = [
  { id: 'qayerda', qism: { uz: 'Qayerda', ru: 'Где' }, v: [
    { id: 'sayt', t: { uz: 'Saytda', ru: 'На сайте' }, rejim: 'sakrash', pufak: { uz: 'Nega hamma narsa sakrayapti?', ru: 'Почему всё прыгает?' }, xato: { uz: "Joy aytilmasa, agent hamma joyga qo'shishi mumkin.", ru: 'Если место не названо, агент может добавить везде.' } },
    { id: 'tor', t: { uz: "Vaqt kataklari to'rida", ru: 'В сетке ячеек времени' }, aniq: true }
  ] },
  { id: 'nima', qism: { uz: 'Nima qilsin', ru: 'Что сделать' }, v: [
    { id: 'chiroyli', t: { uz: "Chiroyli harakat qo'shilsin", ru: 'Добавить красивое движение' }, rejim: 'uzoq', pufak: { uz: 'Qachon bosaman?', ru: 'Когда нажимать?' }, xato: { uz: 'Vaqt aytilmasa, agent uni boshqacha talqin qilishi mumkin.', ru: 'Если время не названо, агент может понять его по-своему.' } },
    { id: 'motion', t: { uz: 'Motion bilan animatsiya qilinsin', ru: 'Сделать анимацию с Motion' }, rejim: 'motion', pufak: { uz: 'Qachon bosaman?', ru: 'Когда нажимать?' }, xato: { uz: "Kutubxona repo'da bor — u harakatni aytmaydi.", ru: 'Библиотека уже в репо — она не описывает движение.' } },
    { id: 'aniq', t: { uz: 'Kataklar birin-ketin kirsin, hammasi 0,4 soniyada', ru: 'Ячейки входят по очереди, всё за 0,4 секунды' }, aniq: true }
  ] },
  { id: 'buzilmasin', qism: { uz: 'Nima buzilmasin', ru: 'Что не сломать' }, v: [
    { id: 'hech', t: { uz: 'Hech narsa yozilmagan', ru: 'Ничего не написано' }, rejim: 'mikroYoq', pufak: { uz: 'Bosdim — sezilmadi', ru: 'Нажал — не заметно' }, xato: { uz: "Aytilmasa, eski animatsiya yo'qolishi mumkin.", ru: 'Если не сказать, старая анимация может пропасть.' } },
    { id: 'mikro', t: { uz: 'Katak bosilgandagi mikro-harakat qolsin', ru: 'Микродвижение при нажатии ячейки остаётся' }, aniq: true }
  ] }
];
const TALAB_YIGILGAN = [
  { uz: "Vaqt kataklari to'rida: kataklar birin-ketin kirsin, hammasi 0,4 soniyada.", ru: 'В сетке ячеек времени: ячейки входят по очереди, всё за 0,4 секунды.' },
  { uz: 'Katak bosilgandagi mikro-harakat qolsin.', ru: 'Микродвижение при нажатии ячейки остаётся.' }
];
const TalabQuti = () => (
  <QKarta yorliq={tr({ uz: 'Talab', ru: 'Требование' })} className="dm-talab fade-step">
    {TALAB_YIGILGAN.map((s, i) => <span key={i} className="dm-talab-s">{tr(s)}</span>)}
  </QKarta>
);
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [joriy, setJoriy] = useState(avval ? 3 : 0);
  const [tanlov, setTanlov] = useState(avval ? { qayerda: 'tor', nima: 'aniq', buzilmasin: 'mikro' } : {});
  const [oxirgi, setOxirgi] = useState(null); // oxirgi tanlangan variant: maket rejimi, pufak va QXato
  const [kKey, setKKey] = useState(0);
  const [silk, setSilk] = useState(null);
  const done = joriy >= TALAB_QISM.length;
  const tugadi = useTugadi(done, 1500, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'concept', screenIdx: screen, correct: true, picked: true }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!done || avval) return; setKKey(k => k + 1); }, [done]); // eslint-disable-line
  const tanla = (qi, v) => {
    if (qi !== joriy || done) return;
    setOxirgi(v); setKKey(k => k + 1);
    if (v.aniq) { setTanlov(t => ({ ...t, [TALAB_QISM[qi].id]: v.id })); setJoriy(j => j + 1); }
    else { setSilk(v.id); setTimeout(() => setSilk(null), 400); }
  };
  const xatoV = oxirgi && !oxirgi.aniq ? oxirgi : null;
  const rejim = done ? 'aniq' : xatoV ? xatoV.rejim : null;
  const pufak = done ? 'ok' : xatoV ? xatoV.pufak : 'savol';
  const maydon = <MaydonTel tor kirish={rejim} kKey={kKey} avtoBos={!!rejim} pufak={pufak} />;
  const qaytaKor = <QTugma ikkinchi className="dm-qayta" onClick={() => setKKey(k => k + 1)}>{tr({ uz: "↻ Qayta ko'rish", ru: '↻ Посмотреть снова' })}</QTugma>;
  const qadamlar = TALAB_QISM.map((q, i) => {
    if (i < joriy) { const v = q.v.find(x => x.id === tanlov[q.id]); return <span className="dm-qism-b"><b>{tr(q.qism)}:</b> {v && tr(v.t)}</span>; }
    if (i > joriy) return <span className="dm-qism-b kut"><b>{tr(q.qism)}</b></span>;
    return (
      <span className="dm-qism-b cur">
        <b>{tr(q.qism)}</b>
        <span className="dm-qism-v">
          {q.v.map(v => <QChip key={v.id} silk={silk === v.id} holat={xatoV && xatoV.id === v.id ? 'err' : undefined} onClick={() => tanla(i, v)}>{tr(v.t)}</QChip>)}
        </span>
        {xatoV && q.v.includes(xatoV) && <span className="dm-xato fade-step" role="status">{tr(xatoV.xato)}</span>}
      </span>
    );
  });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · animatsiya talabi', ru: 'Понятие · требование к анимации' })} screen={screen} scrollSignal={joriy + (oxirgi ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Uch qismni tanlang (${joriy}/3)`, ru: `Выберите три части (${joriy}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Animatsiya talabida <A>nima aytiladi?</A></>, ru: <>Что говорится <A>в требовании к анимации?</A></> })}
        mentor={<Mentor>{tr({ uz: '5-darsda animatsiyani qo\'lda yozgansiz, bugun uni agent yozadi — har qismdan bittasini tanlang.', ru: 'На 5-м уроке вы писали анимацию вручную, сегодня её пишет агент — выберите по одному варианту в каждой части.' })}</Mentor>}
        harakat={!done && <QKarta yorliq={tr({ uz: 'Talab', ru: 'Требование' })} className="dm-s5-q"><QQadamlar qadamlar={qadamlar} joriy={joriy} /></QKarta>}
        vizual={tugadi
          ? <div className="dm-fokus2">{maydon}<div className="q-col"><TalabQuti />{qaytaKor}</div></div>
          : <div className="dm-s5-viz">{maydon}{qaytaKor}</div>}
        natija={done && (
          <div className="dm-natija">
            <p className="dm-joriy fade-step">{tr({ uz: <>Elementlarning birin-ketin kirishi <b>ro'yxat animatsiyasi</b> deyiladi.</>, ru: <>Когда элементы входят по очереди, это называется <b>анимацией списка</b>.</> })}</p>
            {!tugadi && <TalabQuti />}
          </div>
        )}
        xulosa={done && tr({ uz: 'Animatsiya talabi joyni, vaqtni va nima qolishini aytadi — noaniq joyni agent boshqacha talqin qilishi mumkin.', ru: 'Требование к анимации называет место, время и что остаётся — неясное агент может понять по-своему.' })}
      >
        <MentorNote>{tr({ uz: "Qisqa interfeys animatsiyalari ko'pincha bir necha yuz millisekund davom etadi; Maydon'da 0,3–0,4 soniya. Kutubxona nomini talabga yozish shart emas: Motion repo'da bor.", ru: 'Короткие анимации интерфейса обычно длятся несколько сотен миллисекунд; в Maydon — 0,3–0,4 секунды. Название библиотеки в требовании писать не обязательно: Motion уже в репо.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 8 — 2-SAVOL, YAKUNIY (QuestionScreen → QTest; INLINE_KEYS.s8 = 0 — A; «Harakat» A, B, C da; to'g'risi eng uzun emas) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Tekshiruv · animatsiya talabi', ru: 'Проверка · требование к анимации' })}
    questionText="Agent ro'yxat animatsiyasini 2 soniya qildi. Talabda nima aytilmagan?"
    question={tr({ uz: <h2 className="title h-ask">Agent ro'yxat animatsiyasini 2 soniya qildi. <A>Talabda nima aytilmagan?</A></h2>, ru: <h2 className="title h-ask">Агент сделал анимацию списка на 2 секунды. <A>Что не сказано в требовании?</A></h2> })}
    options={[
      { uz: 'Harakat jami qancha vaqt davom etishi', ru: 'Сколько всего длится движение' },
      { uz: "Harakat to'rning qaysi joyida bo'lishi", ru: 'В каком месте сетки движение' },
      { uz: "Harakatda kataklar qaysi rangda bo'lishi", ru: 'Какого цвета ячейки в движении' },
      { uz: 'Animatsiya qaysi kutubxonada yozilishi', ru: 'В какой библиотеке писать анимацию' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "2 soniya o'yinchini kuttiradi — vaqtni talabda o'zingiz yozasiz.", ru: '2 секунды заставляют игрока ждать — время в требовании пишете вы.' }}
    explainWrong={{
      1: { uz: "Joy aytilgan: kataklar to'ri. Yana nima yetishmaydi?", ru: 'Место названо: сетка ячеек. Чего ещё не хватает?' },
      2: { uz: "Rang harakat uzunligiga ta'sir qilmaydi.", ru: 'Цвет не влияет на длительность движения.' },
      3: { uz: "Kutubxona repo'da bor — harakatni u aytmaydi.", ru: 'Библиотека уже в репо — движение она не описывает.' },
      default: { uz: 'Agent nimani o\'zi tanlab oldi — shuni toping.', ru: 'Найдите, что агент выбрал сам.' }
    }} />
);

// ===== 🏅 BADGES (nishonlar, 4) — s2 2-bosqichda birinchi tanlov to'r · A1 5-qadam formasi 3/3 · s5 uchala aniq · A2 oxirgi «Bajardim» (bonus, birinchi urinish sharti yo'q) =====
const ACHIEVEMENTS = {
  patternPicker: { icon: '🎯', name: 'Pattern Picker', desc: { uz: "Maydon'ga eng muhim savolga javob beradigan usulni tanladingiz", ru: 'Вы выбрали для Maydon приём, который отвечает на самый важный вопрос' } },
  ideaHunter: { icon: '🔎', name: 'Idea Hunter', desc: { uz: "O'z g'oyangiz uchun usul kartasini yozdingiz", ru: 'Вы написали карточку приёма для своей идеи' } },
  motionWriter: { icon: '✍️', name: 'Motion Writer', desc: { uz: "Animatsiya talabini uch aniq qismdan yig'dingiz", ru: 'Вы собрали требование к анимации из трёх точных частей' } },
  liveMaydon: { icon: '⚡', name: 'Live Maydon', desc: { uz: 'Ikki amaliyot blokini oxirigacha bajardingiz', ru: 'Вы прошли оба блока практики до конца' } }
};
// Ekran id → nishon (recordAnswer: data.correct — s2 birinchi tanlov to'r, qolganlari ish tugaganda)
const ACH_TRIGGERS = { s2: 'patternPicker', s5: 'motionWriter', a1: 'ideaHunter', a2: 'liveMaydon' };

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


// Podium savol yorliqlari (q22: kalitlar = SCORED_IDX — 3 va 8)
const Q_LABELS = {
  3: { uz: '1 — Kinodagi usul', ru: '1 — Приём в кино' },
  8: { uz: '2 — Talabdagi vaqt', ru: '2 — Время в требовании' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi so'zlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; nom va kod-belgi o'zgarmaydi); emoji yo'q (topshiriq 2)
const QZ_BG_SHAPES = [
  { ch: { uz: 'usul', ru: 'приём' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'bezak', ru: 'украшение' }, l: 84, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'talab', ru: 'требование' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'animatsiya', ru: 'анимация' }, l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'katak', ru: 'ячейка' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: "to'r", ru: 'сетка' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: 'Dribbble', l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'Behance', l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: 'Motion', l: 56, t: 52, s: 22, d: 22, dl: 0.6 },
  { ch: { uz: '0,4 s', ru: '0,4 с' }, l: 90, t: 44, s: 22, d: 24, dl: 1.3 },
  { ch: 'Maydon', l: 36, t: 62, s: 22, d: 26, dl: 2.5 },
  { ch: { uz: 'agent', ru: 'агент' }, l: 12, t: 46, s: 22, d: 19, dl: 3.3 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, kalitlar A B C D B A D C A D C B (har harf 3 marta; MD jadvali)
const QUIZ_BANK = [
  { q: { uz: "Behance'da dizayner nimani ko'rsatadi?", ru: 'Что дизайнер показывает на Behance?' }, opts: [{ uz: 'Loyihasini rasmlar va izoh bilan', ru: 'Свой проект с картинками и описанием' }, { uz: "Faqat o'z rezyumesini matn bilan", ru: 'Только своё резюме текстом' }, { uz: 'Ilovasining tayyor kodini fayl bilan', ru: 'Готовый код приложения файлом' }, { uz: 'Ilovalarning yuklab olinish sonini', ru: 'Число скачиваний приложений' }], correct: 0 },
  { q: { uz: 'Musiqa ilovasida qaysi biri usul?', ru: 'Что в музыкальном приложении — приём?' }, opts: [{ uz: 'Ilova foni qora, harflari esa oppoq', ru: 'Фон приложения чёрный, а буквы белые' }, { uz: "Oxirgi tinglangan qo'shiq tepada turadi", ru: 'Последняя прослушанная песня стоит сверху' }, { uz: 'Albom rasmlari katta va yumaloq chizilgan', ru: 'Обложки альбомов большие и круглые' }, { uz: "Tugmalar och ko'k rangga bo'yalgan", ru: 'Кнопки окрашены в светло-голубой' }], correct: 1 },
  { q: { uz: 'Maydon misolida qaysi biri bezak?', ru: 'Что в примере Maydon — украшение?' }, opts: [{ uz: 'Band katakni bosib bo\'lmasligi', ru: 'Занятую ячейку нельзя нажать' }, { uz: 'Butun kun bitta ekranga sig\'ishi', ru: 'Весь день помещается на одном экране' }, { uz: 'Fon rangi va sarlavha shrifti', ru: 'Цвет фона и шрифт заголовка' }, { uz: "Kun almashganda yo'nalish ko'rinishi", ru: 'Видно направление при смене дня' }], correct: 2 },
  { q: { uz: "To'p rasmi Maydon'ga qo'yilganda nima bo'ldi?", ru: 'Что стало, когда в Maydon поставили картинку мяча?' }, opts: [{ uz: "O'yinchi bo'sh vaqtni tezroq topib oldi", ru: 'Игрок быстрее нашёл свободное время' }, { uz: "Kataklar uch ustunga yig'ildi", ru: 'Ячейки собрались в три столбца' }, { uz: "Kun almashtirgich yo'qolib qoldi", ru: 'Пропал переключатель дня' }, { uz: 'Kataklar yana pastga surilib ketdi', ru: 'Ячейки съехали ещё ниже' }], correct: 3 },
  { q: { uz: 'Kunlar tasmasi qaysi savolga javob beradi?', ru: 'На какой вопрос отвечает лента дней?' }, opts: [{ uz: "«Bugun qaysi vaqt bo'sh?»", ru: '«Какое время сегодня свободно?»' }, { uz: "«Boshqa kunda bo'sh vaqt bormi?»", ru: '«Есть ли свободное время в другой день?»' }, { uz: '«Maydon egasining telefoni qaysi?»', ru: '«Какой телефон у хозяина поля?»' }, { uz: '«Band qilish qancha pul turadi?»', ru: '«Сколько стоит бронь?»' }], correct: 1 },
  { q: { uz: 'Usulni qayerdan boshlab izlaysiz?', ru: 'С чего начинаете искать приём?' }, opts: [{ uz: 'Foydalanuvchining eng muhim savolidan', ru: 'С самого важного вопроса пользователя' }, { uz: "Dribbble'da eng ko'p yoqtirilgan ishdan", ru: 'С самой залайканной работы на Dribbble' }, { uz: "O'zingizga yoqqan rang va shrift turidan", ru: 'С понравившегося вам цвета и шрифта' }, { uz: "Do'stingiz ilovasining ekranidan", ru: 'С экрана приложения друга' }], correct: 0 },
  { q: { uz: "Tweetie'gacha yangi postni qanday ko'rardingiz?", ru: 'Как до Tweetie вы видели новый пост?' }, opts: [{ uz: 'Telefonni silkitib yangilardingiz', ru: 'Обновляли, встряхнув телефон' }, { uz: "Ilova har daqiqada o'zi yangilab turardi", ru: 'Приложение само обновлялось каждую минуту' }, { uz: 'Yangi post kelsa, xabar chiqardi', ru: 'Когда приходил пост, появлялось уведомление' }, { uz: 'Tepaga chiqib, tugmani bosardingiz', ru: 'Поднимались наверх и нажимали кнопку' }], correct: 3 },
  { q: { uz: 'Tortib turganingizda belgi nima qiladi?', ru: 'Что делает значок, пока вы тянете?' }, opts: [{ uz: "Ilovaning o'zini tezroq ishlatib yuboradi", ru: 'Заставляет само приложение работать быстрее' }, { uz: "Ekranni chiroyliroq qilib ko'rsatadi", ru: 'Делает экран красивее' }, { uz: "Yangilanish boshlanishini ko'rsatadi", ru: 'Показывает, что обновление начинается' }, { uz: "Yangi postlar sonini sanab ko'rsatadi", ru: 'Считает и показывает число новых постов' }], correct: 2 },
  { q: { uz: 'Talabdagi «qayerda» qismi nima uchun kerak?', ru: 'Зачем в требовании часть «где»?' }, opts: [{ uz: 'Agent boshqa joyga tegmasligi uchun', ru: 'Чтобы агент не трогал другие места' }, { uz: 'Agent kodni tezroq yozib berishi uchun', ru: 'Чтобы агент быстрее написал код' }, { uz: 'Kod chiroyliroq va qisqa yozilishi uchun', ru: 'Чтобы код был красивее и короче' }, { uz: "Talab uzunroq va jiddiyroq bo'lishi uchun", ru: 'Чтобы требование было длиннее и серьёзнее' }], correct: 0 },
  { q: { uz: "Maydon'dagi ro'yxat animatsiyasiga qaysi vaqt tanlandi?", ru: 'Какое время выбрали для анимации списка в Maydon?' }, opts: [{ uz: '2 soniyadan ham uzunroq', ru: 'Даже дольше 2 секунд' }, { uz: 'Roppa-rosa bir soniya', ru: 'Ровно одна секунда' }, { uz: "3–5 soniya oralig'ida", ru: 'От 3 до 5 секунд' }, { uz: 'Hammasi 0,4 soniyada', ru: 'Всё за 0,4 секунды' }], correct: 3 },
  { q: { uz: "O'yinchi › ni bosdi. Yangi kun qayerdan kiradi?", ru: 'Игрок нажал ›. Откуда входит новый день?' }, opts: [{ uz: 'Chap tomondan', ru: 'Слева' }, { uz: 'Tepadan pastga', ru: 'Сверху вниз' }, { uz: "O'ng tomondan", ru: 'Справа' }, { uz: 'Pastdan tepaga', ru: 'Снизу вверх' }], correct: 2 },
  { q: { uz: 'Talabga «nima buzilmasin» nega yoziladi?', ru: 'Зачем в требование пишут «что не сломать»?' }, opts: [{ uz: "Agent ko'proq kod yozib bersin deb", ru: 'Чтобы агент написал больше кода' }, { uz: 'Ishlab turgan narsa saqlansin deb', ru: 'Чтобы сохранилось то, что работает' }, { uz: "Talab rasmiyroq bo'lib ko'rinsin deb", ru: 'Чтобы требование выглядело официальнее' }, { uz: "Agent yangi paketlar o'rnatsin deb", ru: 'Чтобы агент установил новые пакеты' }], correct: 1 }
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
// Har blok — ScreenBlok'ga ma'lumot: steps [{ h, t, prompt?: [satr] | (goya) => [satr], kimga?, err?, forma?: true, karta?: true }] · natija · ortda (K10 buyruqlari).
// 9-Modul (qaror 8, GATE M M-q1): blok 5 qadam — 5-qadam «O'z g'oyangiz». A1 da uch savolli forma (UsulForma): javoblar promptning qavslariga o'zi tushadi,
//   qiymat answers[ekran].goya da (ccProgress, U-042 «Usul kartam») — A2 5-qadamida va yakundagi uyga vazifada o'qiladi. «Bajardim» 1-javob aniq bo'lguncha yopiq (JS + CSS :has).
// Kirish qatori — 3-dars natijasi localStorage `pm-m7d3-muammo` (tayanch 6, `{ nima }`); yo'q bo'lsa — qator chiqmaydi.
// «Ortda qoldingizmi» (K10): A1 — dars-08-start, A2 — dars-08-done. Signal 500+ zonasida — faqat mentor ko'radi (MentorPracticeStats).
const A1_IDX = 6;
const USUL_BOSH = { savol: '', usul: '', joy: '' };
const USUL_SAVOLLAR = [
  { id: 'savol', l: { uz: 'foydalanuvchingiz nimani tezroq topishi kerak?', ru: 'что ваш пользователь должен находить быстрее?' } },
  { id: 'usul', l: { uz: 'qaysi usul unga yordam beradi?', ru: 'какой приём ему поможет?' } },
  { id: 'joy', l: { uz: "uni qayerga qo'yasiz?", ru: 'куда вы его поставите?' } }
];
const BEZAK_SOZ = { uz: /(rang|shrift|fon\b|rasm|chiroyli|bezak|gradient)/i, ru: /(цвет|шрифт|фон|картинк|красив)/i };
const usulTola = (g) => String(g.savol || '').trim().length >= 8 && String(g.usul || '').trim().length > 0 && String(g.joy || '').trim().length > 0;
const usulBor = (g) => !!(g && usulTola(g));
const qavs = (v, ph) => (String(v || '').trim() || ph);
// A1 5-qadam prompti — uch javob qavslarga o'zi qo'yiladi; «nima buzilmasin» — o'quvchi Antigravity'da yozadi (MD)
const usulPrompt = (g) => [
  { uz: `Joy — ${qavs(g.joy, "{qayerga qo'yasiz}")}. Shu usulni qo'sh: ${qavs(g.usul, '{usul}')}. U «${qavs(g.savol, '{foydalanuvchi savoli}')}» savoliga javob bersin.`, ru: `Место — ${qavs(g.joy, '{куда поставите}')}. Добавь этот приём: ${qavs(g.usul, '{приём}')}. Пусть он отвечает на вопрос «${qavs(g.savol, '{вопрос пользователя}')}».` },
  { uz: "{nima buzilmasin} o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: '{что не сломать} не должно измениться. Больше ничего не трогай, назови изменённые файлы.' }
];
const muammo3 = () => { try { const o = JSON.parse(localStorage.getItem('pm-m7d3-muammo') || 'null'); return o && typeof o.nima === 'string' && o.nima.trim() ? o.nima.trim() : null; } catch { return null; } };
const UsulForma = ({ qiymat, onYoz }) => {
  const m3 = useMemo(muammo3, []);
  const s1 = String(qiymat.savol || '').trim();
  const birorta = USUL_SAVOLLAR.some(q => String(qiymat[q.id] || '').trim());
  return (
    <span className="dm-forma" data-tola={usulTola(qiymat) ? '1' : '0'}>
      {m3 && <span className="dm-forma-m3"><b>{tr({ uz: 'Muammongiz', ru: 'Ваша проблема' })}:</b> {m3}</span>}
      {USUL_SAVOLLAR.map((q, i) => (
        <label key={q.id} className="dm-forma-q">
          <span className="dm-forma-l">{i + 1} · {tr(q.l)}</span>
          <textarea rows={1} value={qiymat[q.id] || ''} placeholder="…" onChange={e => onYoz(q.id, e.target.value)} />
        </label>
      ))}
      {birorta && s1.length < 8 && <span className="dm-xato" role="status">{tr({ uz: 'Foydalanuvchining savoli yoki vazifasini aniq yozing.', ru: 'Точно напишите вопрос или задачу пользователя.' })}</span>}
      {(BEZAK_SOZ.uz.test(String(qiymat.usul || '')) || BEZAK_SOZ.ru.test(String(qiymat.usul || ''))) && <span className="dm-izoh">{tr({ uz: "Bu bezakka o'xshaydi — u qaysi savolga javob beradi?", ru: 'Похоже на украшение — на какой вопрос оно отвечает?' })}</span>}
      <span className="dm-forma-z">{tr({ uz: 'Sayt ochilmasa — dizayner ekranidagi ikki usuldan birini oling.', ru: 'Если сайт не открывается — возьмите один из двух приёмов с экрана дизайнера.' })}</span>
    </span>
  );
};
// «Usul kartam» — A1 5-qadamdagi uch javob, ixcham (A2 5-qadam va uyga vazifa)
const UsulKarta = ({ g }) => (usulBor(g)
  ? (
    <span className="dm-ukarta">
      <span className="q-yorliq">{tr({ uz: 'Usul kartam', ru: 'Моя карточка приёма' })}</span>
      <span className="dm-ukarta-s">{String(g.savol).trim()} · {String(g.usul).trim()} · {String(g.joy).trim()}</span>
    </span>
  ) : null);
function ScreenBlok({ screen, storedAnswer, answers, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda = [], doneText }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const [goya, setGoya] = useState(() => ({ ...USUL_BOSH, ...((storedAnswer && storedAnswer.goya) || {}) }));
  const formaN = steps.findIndex(c => c.forma);
  const tola = usulTola(goya);
  const done = stepN >= steps.length;
  const a1Goya = answers && answers[A1_IDX] && answers[A1_IDX].goya;
  const goyaYoz = (id, v) => { const g = { ...goya, [id]: v }; setGoya(g); if (!avval) onAnswer(screen, { ...(storedAnswer || {}), goya: g }); };
  const bajardim = () => {
    if (isMentorLive || done) return;
    if (stepN === formaN && !tola) return; // 5-qadam: 1-javob aniq va uchala qator yozilmaguncha «Bajardim» yopiq
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, ...(formaN >= 0 ? { goya } : {}) });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  // Yangi ochilgan qadam «Bajardim»i bilan birga ko'rinsin (kompyuterda ham; telefonda Stage o'zi suradi)
  const birinchiRef = useRef(true);
  useEffect(() => {
    if (birinchiRef.current) { birinchiRef.current = false; return; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => {
          const pr = typeof c.prompt === 'function' ? c.prompt(goya) : c.prompt;
          return {
            h: tr(c.h),
            t: c.forma ? <>{fmtCode(tr(c.t))}<UsulForma qiymat={goya} onYoz={goyaYoz} /></> : c.karta ? <>{fmtCode(tr(c.t))}<UsulKarta g={a1Goya} /></> : fmtCode(tr(c.t)),
            prompt: pr && pr.map(l => tr(l)),
            kimga: pr && tr(c.kimga || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }),
            xato: c.err && fmtCode(tr(c.err))
          };
        })}
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
const QADAM_TEKSHIR = { uz: 'Tekshirish', ru: 'Проверка' };
const QADAM_GOYA = { uz: "O'z g'oyangiz", ru: 'Ваша идея' };
// Brend nomi qadam matnida o'z rangida (S-018) — Dribbble, Behance
const Br = ({ id, children }) => <b className={cx('dm-brend', id)}>{children}</b>;

const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · usul', ru: 'Практика 1 · приём' }}
    title={{ uz: <>Maydon'ga <A>vaqtlar to'rini</A> qo'shing.</>, ru: <>Добавьте в Maydon <A>сетку времени</A>.</> }}
    mentor={{ uz: <>Talabni siz yozasiz, kodni Antigravity yozadi — <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Требование пишете вы, код пишет Antigravity — начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "Antigravity'da `maydon` papkasini oching. Birinchi terminalda `cd backend`, `npm run start:dev`; ikkinchisida `cd web`, `npm run dev`. Brauzerda `localhost:5173` ni oching, F12, keyin Ctrl+Shift+M (Mac: Cmd+Option+I, keyin Cmd+Shift+M) — telefon ko'rinishi.", ru: 'Откройте папку `maydon` в Antigravity. В первом терминале `cd backend`, `npm run start:dev`; во втором `cd web`, `npm run dev`. Откройте в браузере `localhost:5173`, F12, затем Ctrl+Shift+M (Mac: Cmd+Option+I, затем Cmd+Shift+M) — вид телефона.' } },
      { h: QADAM_PROMPT, t: { uz: "qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'заполните скобки, нажмите «Скопировать», отправьте в Antigravity:' }, prompt: [
        { uz: "Maydon sahifasida vaqt kataklarini {ustunlar soni} ustunli to'rga joyla: butun kun telefon ekraniga sig'sin.", ru: 'На странице Maydon расположи ячейки времени сеткой из {число столбцов} столбцов: весь день должен поместиться на экране телефона.' },
        { uz: "Har katakda soat va holat (bo'sh yoki band) qolsin.", ru: 'В каждой ячейке остаются час и состояние (свободно или занято).' },
        { uz: "Kun almashtirgich, GET /vaqtlar, vaqt-tanladi hodisasi va kataklardagi animatsiyalar o'zgarmasin.", ru: 'Переключатель дня, GET /vaqtlar, событие vaqt-tanladi и анимации в ячейках не меняются.' },
        { uz: "Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Больше ничего не трогай, назови изменённые файлы.' }
      ] },
      { h: QADAM_ISHGA, t: { uz: "sahifa o'zi yangilandi, terminallarda xato yo'q.", ru: 'страница обновилась сама, в терминалах нет ошибок.' }, err: XATO_YOLI },
      { h: QADAM_TEKSHIR, t: { uz: "telefon ko'rinishida butun kun pastga surmasdan ko'rinadi, 21:00 katagi ham. Bo'sh katakni bosing — u kichrayib qaytadi.", ru: 'в виде телефона весь день виден без прокрутки, и ячейка 21:00 тоже. Нажмите свободную ячейку — она сжимается и возвращается.' } },
      { h: QADAM_GOYA, t: { uz: <><Br id="dribbble">Dribbble</Br> yoki <Br id="behance">Behance</Br>'da g'oyangizga yaqin ishni oching (qidiruvga inglizcha: masalan, <code className="qcode">booking app</code>). Rangga emas, foydalanuvchingizning savoliga qarang. Uch savolga javob yozing — ular shu promptning qavslariga tushadi. «Nusxalash» — uyda o'z loyihangizda Antigravity'ga berasiz.</>, ru: <>Откройте на <Br id="dribbble">Dribbble</Br> или <Br id="behance">Behance</Br> работу, близкую к вашей идее (в поиске по-английски: например, <code className="qcode">booking app</code>). Смотрите не на цвет, а на вопрос вашего пользователя. Ответьте на три вопроса — ответы попадут в скобки промпта. «Скопировать» — дома отдадите Antigravity в своём проекте.</> }, forma: true, prompt: usulPrompt }
    ]}
    natija={<div className="dm-blok-tel"><MaydonTel joy={false} tor /></div>} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-08-start']}
    doneText={{ uz: "Butun kun bir qarashda — o'yinchi kechki bo'sh vaqtni pastga surmasdan topadi.", ru: 'Весь день одним взглядом — игрок находит вечернее свободное время без прокрутки.' }} />
);

// A2 o'ngi — Maydon o'zi aylanadi: Shanba kataklari birin-ketin kiradi → › Yakshanba o'ngdan → ‹ Shanba chapdan (DE-200; kam harakatda — tinch)
const MaydonAylanadi = () => {
  const [h, setH] = useState({ kun: 0, yon: null, kirish: 'aniq', k: 0, strelka: null });
  useEffect(() => {
    if (kamHarakat()) return;
    let i = 0; const tm = [];
    const qadam = () => {
      i += 1;
      const ong = i % 2 === 1;
      tm.push(setTimeout(() => setH(s => ({ ...s, strelka: ong ? 'ong' : 'chap' })), 0));
      tm.push(setTimeout(() => setH(s => ({ kun: ong ? 1 : 0, yon: ong ? 'ong' : 'chap', kirish: null, k: s.k + 1, strelka: null })), 260));
      tm.push(setTimeout(qadam, 2600));
    };
    tm.push(setTimeout(qadam, 2200));
    return () => tm.forEach(clearTimeout);
  }, []);
  return <MaydonTel joy={false} tor kun={h.kun} yon={h.yon} kirish={h.kirish} kKey={h.k} strelka={h.strelka} />;
};
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · animatsiya', ru: 'Практика 2 · анимация' }}
    title={{ uz: <>Ro'yxat va sahifa o'tishini <A>jonlantiring</A>.</>, ru: <>Оживите список и <A>переход страницы</A>.</> }}
    mentor={{ uz: <>Maydon'da bir kundan boshqasiga o'tganda sahifa almashadi. <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>В Maydon при переходе с одного дня на другой страница меняется. Начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM_OCHISH, t: { uz: 'ikkala terminal ishlayapti, brauzerda Maydon telefon ko\'rinishida ochiq.', ru: 'оба терминала работают, Maydon открыт в браузере в виде телефона.' } },
      { h: QADAM_PROMPT, t: { uz: "qavs ichini to'ldiring, «Nusxalash», Antigravity'ga:", ru: 'заполните скобки, «Скопировать», в Antigravity:' }, prompt: [
        { uz: "Maydon sahifasidagi vaqt kataklari to'rida: sahifa ochilganda kataklar birin-ketin kirsin, hammasi {soniya} soniyada.", ru: 'В сетке ячеек времени на странице Maydon: при открытии страницы ячейки входят по очереди, всё за {секунды} секунды.' },
        { uz: 'Kun almashganda eski kun chiqib ketsin, yangisi kirsin: › bosilsa o\'ngdan, ‹ bosilsa chapdan — 0,3 soniyada.', ru: 'При смене дня старый день уходит, новый входит: при › справа, при ‹ слева — за 0,3 секунды.' },
        { uz: "Katak bosilgandagi kichrayish, band rangining silliq o'zgarishi va «Band qilindi» belgisi o'zgarmasin; vaqt-tanladi hodisasi qolsin.", ru: 'Сжатие ячейки при нажатии, плавная смена цвета занятой ячейки и значок «Band qilindi» не меняются; событие vaqt-tanladi остаётся.' },
        { uz: "Yangi paket o'rnatma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Новый пакет не ставь. Больше ничего не трогай, назови изменённые файлы.' }
      ] },
      { h: QADAM_ISHGA, t: { uz: "sahifa o'zi yangilandi, terminalda xato yo'q.", ru: 'страница обновилась сама, в терминале нет ошибок.' }, err: XATO_YOLI },
      { h: QADAM_TEKSHIR, t: { uz: "sahifani yangilang: kataklar birin-ketin kiradi. › ni bosing — Yakshanba o'ngdan kiradi; ‹ ni bosing — Shanba chapdan qaytadi. Bo'sh katakni bosing — kichrayib qaytadi.", ru: 'обновите страницу: ячейки входят по очереди. Нажмите › — воскресенье входит справа; нажмите ‹ — суббота возвращается слева. Нажмите свободную ячейку — сжимается и возвращается.' } },
      { h: QADAM_GOYA, t: { uz: "shu promptni o'z g'oyangizdagi ro'yxatga yozing: qavslarga ro'yxatingiz joyini va nima buzilmasligini qo'ying. «Nusxalash» — uyda o'z loyihangizda Antigravity'ga berasiz.", ru: 'напишите этот промпт для списка в своей идее: в скобки поставьте место списка и то, что не должно сломаться. «Скопировать» — дома отдадите Antigravity в своём проекте.' }, karta: true, prompt: [
        { uz: "Joy — {ro'yxatingiz qayerda}. Sahifa ochilganda ro'yxat elementlari birin-ketin kirsin, hammasi 0,4 soniyada.", ru: 'Место — {где ваш список}. При открытии страницы элементы списка входят по очереди, всё за 0,4 секунды.' },
        { uz: "{nima buzilmasin} o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: '{что не сломать} не должно измениться. Больше ничего не трогай, назови изменённые файлы.' }
      ] }
    ]}
    natija={<div className="dm-blok-tel"><MaydonAylanadi /><QIzoh>{tr({ uz: "Yo'nalish vaqtni his qildiradi: keyingi kun o'ngdan kiradi, oldingisi chapdan qaytadi.", ru: 'Направление даёт почувствовать время: следующий день входит справа, предыдущий возвращается слева.' })}</QIzoh></div>} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-08-done']}
    doneText={{ uz: 'Maydon jonli: kataklar birin-ketin kiradi, kun silliq almashadi, bosish o\'zgarmadi.', ru: 'Maydon ожил: ячейки входят по очереди, день меняется плавно, нажатие не изменилось.' }} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran sflash (F-1005-88), qolipdagi QKartochka (DE-204). Old va izoh — fmtCode; orqa — oddiy matn.
const KARTALAR = [
  { front: { uz: 'Interfeys usuli nima?', ru: 'Что такое приём интерфейса?' }, back: { uz: "Boshqa interfeysda ishlatilgan va vazifani osonlashtiradigan ko'rinish yoki harakat", ru: 'Вид или действие из другого интерфейса, которое облегчает задачу' }, note: { uz: '«Arxitektura patternlari»dagi pattern kabi — tayyor rasm emas', ru: 'Как паттерн из «Архитектурных паттернов» — не готовая картинка' } },
  { front: { uz: 'Bezak nima?', ru: 'Что такое украшение?' }, back: { uz: "Bu misolda: vazifani o'zgartirmay, faqat ko'rinishni o'zgartiradigan detal", ru: 'В этом примере: деталь, которая меняет только вид, а не задачу' }, note: { uz: 'Rang holatni bildirsa — u bezak emas, axborot', ru: 'Если цвет показывает состояние — это не украшение, а информация' } },
  { front: { uz: "Dribbble'da nima ko'rasiz?", ru: 'Что вы видите на Dribbble?' }, back: { uz: 'Dizaynerlar ishidan ekranlar', ru: 'Экраны из работ дизайнеров' }, note: { uz: 'Qidiruvga inglizcha yozasiz: `booking app`', ru: 'В поиске пишете по-английски: `booking app`' } },
  { front: { uz: "Nega dizayner ekranini butunligicha ko'chirmaysiz?", ru: 'Почему не копируете экран дизайнера целиком?' }, back: { uz: 'U boshqa foydalanuvchi va boshqa savol uchun chizilgan', ru: 'Он нарисован для другого пользователя и другого вопроса' }, note: { uz: "Bu misolda rang va rasm faqat ko'rinish", ru: 'В этом примере цвет и картинка — только вид' } },
  { front: { uz: "Maydon'ga qaysi usul olindi?", ru: 'Какой приём взяли в Maydon?' }, back: { uz: "Vaqtlar to'ri", ru: 'Сетка времени' }, note: { uz: "Butun kun bir ekranda — «Bugun qaysi vaqt bo'sh?» savoliga javob", ru: 'Весь день на одном экране — ответ на вопрос «Какое время сегодня свободно?»' } },
  { front: { uz: 'Nega bu mashqda avval bitta usul olinadi?', ru: 'Почему в этом упражнении сначала берут один приём?' }, back: { uz: "Nima o'zgarganini aniq ko'rish uchun", ru: 'Чтобы ясно видеть, что изменилось' }, note: { uz: "Qolgani «keyin» ro'yxatida", ru: 'Остальное — в списке «потом»' } },
  { front: { uz: "Pastga tortib yangilash qaysi ilovada paydo bo'lgan?", ru: 'В каком приложении появилось «потянуть вниз, чтобы обновить»?' }, back: { uz: 'Tweetie 2 da, 2009-yilda', ru: 'В Tweetie 2, в 2009 году' }, note: { uz: 'Uni dasturchi Loren Brichter yasagan', ru: 'Его сделал разработчик Лорен Брихтер' } },
  { front: { uz: "Tweetie'dan keyin ko'p ilovalarda nima paydo bo'ldi?", ru: 'Что появилось во многих приложениях после Tweetie?' }, back: { uz: 'Pastga tortib yangilash usuli', ru: 'Приём «потянуть вниз, чтобы обновить»' }, note: { uz: "Bitta usul turli ko'rinishdagi ilovalarda ishlaydi", ru: 'Один приём работает в приложениях с разным видом' } },
  { front: { uz: 'Animatsiya talabi nimalarni aytadi?', ru: 'Что говорит требование к анимации?' }, back: { uz: 'Qayerda, nima qilsin, nima buzilmasin', ru: 'Где, что сделать, что не сломать' }, note: { uz: '«Nima qilsin»da — harakat va uning vaqti', ru: 'В «что сделать» — движение и его время' } },
  { front: { uz: "Ro'yxat animatsiyasi nima?", ru: 'Что такое анимация списка?' }, back: { uz: 'Elementlarning birin-ketin kirishi', ru: 'Элементы входят по очереди' }, note: { uz: "Maydon'da — kataklar, hammasi 0,4 soniyada", ru: 'В Maydon — ячейки, всё за 0,4 секунды' } },
  { front: { uz: "Maydon'da sahifa o'tishi qachon bo'ladi?", ru: 'Когда в Maydon бывает переход страницы?' }, back: { uz: 'Kun almashganda', ru: 'При смене дня' }, note: { uz: "› bosilsa yangi kun o'ngdan kiradi", ru: 'При › новый день входит справа' } },
  { front: { uz: 'Talabda «yangi paket o\'rnatma» nega bor?', ru: 'Зачем в требовании «новый пакет не ставь»?' }, back: { uz: "Motion repo'da allaqachon bor", ru: 'Motion уже есть в репо' }, note: { uz: 'Agent boshqa kutubxona qo\'shmaydi', ru: 'Агент не добавит другую библиотеку' } }
];

// ===== KARTOCHKALAR — alohida ekran (F-1005-88); Mentor yo'q (KORPUS §61, SABOQ 16): birinchi bosishgacha karta yuzi halqada va ostida yorliq =====
// Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi — root'dagi FLASH_IDX / flashHidden.
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        <div className={cx('dm-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: fmtCode(tr(c.front)), back: tr(c.back), note: c.note && fmtCode(tr(c.note)) }))} />
          {!bosildi && <p className="dm-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: karta «kim uchun · nechta · muddat» + raqamli qadamlar + usul kartasi; GATE M M-q9 — alohida .homework.jsx YO'Q) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z MVP ingiz", ru: 'ваш MVP' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: "usul va ro'yxat animatsiyasi", ru: 'приём и анимация списка' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Usul kartangizdagi talabni o'z loyihangizda Antigravity'ga bering.", ru: 'Отдайте требование из карточки приёма Antigravity в своём проекте.' },
  { uz: "Ro'yxat animatsiyasi talabini bering va telefon ko'rinishida tekshiring.", ru: 'Дайте требование к анимации списка и проверьте в виде телефона.' }
];
const HwCard = ({ keyingi, g }) => (
  <div className="card dm-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="dm-hw-karta">
      {HW_KARTA.map((r, i) => <div key={i} className="dm-hw-q"><span className="dm-hw-k">{tr(r.k)}</span><span className="dm-hw-v">{tr(r.v)}</span></div>)}
    </div>
    <ol className="dm-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
    <UsulKarta g={g} />
    {keyingi && <span className="dm-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + PM HwCard; kartochkalar alohida ekranda (F-1005-88). CODE STRIKE va arena — jonli o'yin qatlami, darsda =====
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
  const RECAP = [
    { uz: 'Yaxshi interfeysdan bezak emas, usul olinadi: u foydalanuvchining savoliga javob beradi.', ru: 'Из хорошего интерфейса берут не украшение, а приём: он отвечает на вопрос пользователя.' },
    { uz: 'Avval eng muhim savolga javob beradigan bitta usuldan boshlaysiz.', ru: 'Начинаете с одного приёма, который отвечает на самый важный вопрос.' },
    { uz: 'Animatsiya talabi joyni, harakat vaqtini va nima qolishini aytadi.', ru: 'Требование к анимации называет место, время движения и что остаётся.' },
    { uz: "Qisqa interfeys animatsiyalari ko'pincha bir necha yuz millisekund davom etadi — Maydon'da 0,3–0,4 soniya.", ru: 'Короткие анимации интерфейса обычно длятся несколько сотен миллисекунд — в Maydon 0,3–0,4 секунды.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: MVP tayyor»</b>. Bugun Maydon jonli ko'rindi; o'sha darsda band qilish ishlaydi, maydon egasi o'z sahifasini oladi va Maydon internetga chiqadi.</>, ru: <>Следующий урок — <b>«День проекта: MVP готов»</b>. Сегодня Maydon ожил; на том уроке заработает бронь, хозяин поля получит свою страницу, и Maydon выйдет в интернет.</> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const g = answers && answers[A1_IDX] && answers[A1_IDX].goya;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Vaqtlar to'ri va <A>animatsiyalar tayyor</A>.</>, ru: <>Сетка времени и <A>анимации готовы</A>.</> })}
        cta={<>
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={RECAP.map(tr)}
        uyga={<HwCard keyingi={keyingi} g={g} />}
        keyingi={keyingi}
        hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      />
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmDesignMotionLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI (.dm-) — «Ikki telefon», Tweetie maketi, amaliyot formasi. Faqat qolip tokenlari; maket bo'yog'i va brend ranglari — hex (token emas) === */
        .dm-ikki { display: flex; gap: clamp(10px,1.8vw,18px); justify-content: center; align-items: flex-start; width: 100%; }
        .dm-ustun { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; }
        .dm-brend-joy, .dm-pufak-joy { height: 36px; display: flex; align-items: flex-end; justify-content: center; width: 100%; }
        .dm-brend { font-family: 'Manrope', sans-serif; font-weight: 800; letter-spacing: -0.01em; }
        .dm-brend-joy .dm-brend { font-size: 15px; padding-bottom: 4px; }
        .dm-brend.dribbble { color: #EA4C89; } .dm-brend.behance { color: #1769FF; } .dm-brend.tweetie { color: #1D9BF0; }
        .dm-brend.twitter { color: #1DA1F2; } .dm-brend.chrome { color: #1A73E8; }
        .dm-tel { width: 196px; flex-shrink: 0; background: ${T.ink}; border-radius: 30px; padding: 7px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.45); }
        .dm-ekran { position: relative; height: 310px; border-radius: 23px; overflow: hidden; background: ${T.paper}; display: flex; flex-direction: column; gap: 6px; padding: 24px 10px 10px; transition: background 0.4s ease; }
        .dm-notch { position: absolute; top: 7px; left: 50%; margin-left: -28px; width: 56px; height: 11px; border-radius: 8px; background: ${T.ink}; z-index: 2; }
        /* dizayner ekrani */
        .dm-diz .dm-ekran { background: linear-gradient(160deg, #7B3FE4 0%, #5A55EA 55%, #2D7FF9 100%); gap: 9px; }
        .dm-diz .dm-ekran.olindi-fon { background: #A9A4C2; }
        .dm-dq { border-radius: 12px; outline: 2px dashed transparent; outline-offset: 3px; transition: opacity 0.35s ease, outline-color 0.3s ease; }
        .dm-dq.aj { outline-color: #FFFFFF; animation: dm-aj 1.4s ease-in-out infinite; }
        @keyframes dm-aj { 50% { outline-color: rgba(255,255,255,0.35); } }
        .dm-dq.olindi { opacity: 0.25; }
        .dm-ekran.aj-fon::before { content: ''; position: absolute; inset: 4px; border: 2px dashed #FFFFFF; border-radius: 19px; pointer-events: none; z-index: 1; animation: dm-aj-b 1.4s ease-in-out infinite; }
        @keyframes dm-aj-b { 50% { border-color: rgba(255,255,255,0.35); } }
        .dm-diz-top { display: block; width: 78px; height: 78px; margin: 2px auto 0; filter: drop-shadow(0 8px 10px rgba(0,0,0,0.25)); }
        .dm-diz-h { display: block; text-align: center; font-family: 'Fraunces', serif; font-style: italic; font-weight: 400; font-size: 27px; line-height: 1.1; color: #FFFFFF; }
        .dm-tasma { display: flex; justify-content: space-between; gap: 2px; flex-shrink: 0; }
        .dm-tasma span { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; font-size: 9.5px; font-weight: 800; }
        .dm-tasma.diz span { color: rgba(255,255,255,0.85); }
        .dm-tasma.diz span.on { background: #FFFFFF; color: #5B3DE6; }
        .dm-tasma.qatlam span { color: ${T.ink2}; background: ${T.bg}; }
        .dm-tasma.qatlam span.on { background: ${T.accent}; color: #FFFFFF; }
        .dm-diz-tor { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; }
        .dm-diz-tor span { padding: 9px 0; border-radius: 11px; background: rgba(255,255,255,0.2); text-align: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; font-weight: 700; color: #FFFFFF; }
        .dm-diz-tor span.band { opacity: 0.45; text-decoration: line-through; }
        /* Maydon telefoni */
        .dm-tel-w { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .dm-tel-w.katta { zoom: 1.1; }
        .dm-m-bosh { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dm-m-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px; color: ${T.accent}; }
        .dm-ekran.fon { background: linear-gradient(160deg, #7B3FE4 0%, #5A55EA 55%, #2D7FF9 100%); }
        .dm-ekran.fon .dm-m-nom, .dm-ekran.fon .dm-kun-n { color: #FFFFFF; }
        .dm-kun { display: flex; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0; }
        .dm-kun-n { display: inline-block; min-width: 84px; text-align: center; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .dm-strelka { width: 26px; height: 26px; padding: 0; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-size: 16px; line-height: 1; cursor: pointer; transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease; }
        .dm-strelka:disabled { opacity: 0.45; cursor: default; }
        .dm-strelka.bos { background: ${T.accentSoft}; border-color: ${T.accent}; transform: scale(0.88); opacity: 1; }
        .dm-m-top { display: block; width: 80px; height: 80px; margin: 0 auto; flex-shrink: 0; }
        .qatlam { animation: dm-qatlam 0.45s cubic-bezier(.3,1.4,.5,1) backwards; }
        @keyframes dm-qatlam { from { opacity: 0; transform: scale(0.7); } }
        .dm-kq { position: relative; flex: 1 1 auto; min-height: 0; overflow: hidden; }
        .dm-kataklar { display: flex; flex-direction: column; gap: 8px; }
        .dm-kataklar.tor { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 7px; }
        .dm-katak { position: relative; flex-shrink: 0; display: flex; align-items: center; gap: 2px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; transition: transform 0.16s ease, background 0.35s ease, border-color 0.35s ease; }
        .dm-kataklar.ustun .dm-katak { flex-direction: row; justify-content: space-between; height: 58px; padding: 0 14px; }
        .dm-kataklar.tor .dm-katak { flex-direction: column; justify-content: center; height: 46px; padding: 0; }
        .dm-k-s { font-weight: 700; font-size: 17px; }
        .dm-kataklar.tor .dm-k-s { font-size: 14px; }
        .dm-katak small { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; color: ${T.ok}; }
        .dm-kataklar.tor .dm-katak small { font-size: 10.5px; }
        .dm-katak.band { background: ${T.line}; border-color: ${T.line}; color: ${T.ink2}; cursor: not-allowed; }
        .dm-katak.band small { color: ${T.ink2}; }
        .dm-katak:hover:not(:disabled) { border-color: ${T.ink2}; }
        .dm-katak.bos { transform: scale(0.88); border-color: ${T.accent}; }
        .dm-kataklar.k-aniq .dm-katak, .dm-kataklar.k-mikroYoq .dm-katak { animation: dm-kir 0.16s ease-out backwards; }
        @keyframes dm-kir { from { opacity: 0; transform: translateY(10px); } }
        .dm-kataklar.k-uzoq .dm-katak { animation: dm-aylan 0.8s ease-out backwards; }
        @keyframes dm-aylan { from { opacity: 0; transform: rotate(-200deg) scale(0.3); } }
        .dm-kataklar.k-motion .dm-katak { animation: dm-sakrab 0.8s cubic-bezier(.3,1.8,.5,1) backwards; }
        .dm-kataklar.k-sakrash .dm-katak, .dm-sakra { animation: dm-sakrab 0.6s cubic-bezier(.3,1.8,.5,1) backwards; }
        @keyframes dm-sakrab { 0% { opacity: 0; transform: translateY(-36px) scale(0.6); } 60% { opacity: 1; transform: translateY(6px) scale(1.08); } }
        .dm-kataklar.yon-ong, .dm-kun-n.yon-ong { animation: dm-ong 0.3s ease-out backwards; }
        .dm-kataklar.yon-chap, .dm-kun-n.yon-chap { animation: dm-chap 0.3s ease-out backwards; }
        @keyframes dm-ong { from { opacity: 0; transform: translateX(70%); } }
        @keyframes dm-chap { from { opacity: 0; transform: translateX(-70%); } }
        .dm-barmoq { position: absolute; right: 6px; bottom: 4px; width: 22px; height: 22px; border-radius: 50%; background: ${fon(T.ink, 0.28)}; border: 2px solid ${T.paper}; pointer-events: none; animation: dm-tap 0.6s ease-out backwards; }
        @keyframes dm-tap { from { opacity: 0; transform: scale(1.8); } }
        .dm-ekran.yonadi::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 46px; background: linear-gradient(to top, ${fon(T.accent, 0.5)}, ${fon(T.accent, 0)}); pointer-events: none; opacity: 0; animation: dm-yon 1.1s ease-in-out 2 0.3s; }
        @keyframes dm-yon { 50% { opacity: 1; } }
        .dm-pufak { position: relative; display: inline-flex; align-items: center; gap: 6px; max-width: 220px; padding: 6px 11px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; line-height: 1.3; color: ${T.ink}; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.4); animation: dm-pufak 0.35s cubic-bezier(.3,1.5,.5,1) backwards; }
        .dm-pufak::after { content: ''; position: absolute; bottom: -6px; left: 50%; margin-left: -5px; width: 10px; height: 10px; background: inherit; border-right: 1.5px solid ${T.line}; border-bottom: 1.5px solid ${T.line}; transform: rotate(45deg); }
        .dm-pufak.ok { background: ${T.okFon}; border-color: ${T.ok}; color: ${T.ok}; }
        .dm-pufak.ok::after { border-color: ${T.ok}; }
        @keyframes dm-pufak { from { opacity: 0; transform: translateY(6px) scale(0.85); } }
        .dm-oyinchi { width: 14px; height: 14px; flex-shrink: 0; border-radius: 50%; background: ${T.accentSoft}; border: 2px solid ${T.accent}; }
        .dm-pufak.ok .dm-oyinchi { display: none; }
        .dm-hook { display: flex; justify-content: center; min-width: 0; }
        .q-kirish:has(.dm-hook.tanla) .q-variantlar-kol { border-radius: 14px; box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}; animation: dm-navbat-g 1.6s ease-out infinite; }
        @keyframes dm-navbat-g { 0% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 9px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 19px ${fon(T.accent, 0)}; } }
        .dm-navbat { box-shadow: 0 0 0 2px ${T.accent}; animation: dm-navbat 1.6s ease-out infinite; }
        @keyframes dm-navbat { 0% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 2px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 12px ${fon(T.accent, 0)}; } }
        .dm-navbat-k > .q-bashorat { box-shadow: 0 0 0 2px ${T.accent}; animation: dm-navbat 1.6s ease-out infinite; }
        .dm-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; animation: q-kir 0.3s ease-out; }
        .dm-taxmin .q-yorliq { margin: 0; }
        .dm-taxmin-s { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .dm-taxmin-j { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.accent}; background: ${T.accentSoft}; border: 1.5px solid ${T.accent}; border-radius: 9px; padding: 3px 11px; }
        p.dm-repo { margin: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; color: ${T.ink2}; }
        .dm-reja-tel { display: flex; justify-content: center; }
        /* 2-ekran */
        .dm-s2 { gap: 10px; }
        .lesson-root ul.dm-qoyilgan { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .dm-qq { display: flex; align-items: center; gap: 8px; padding: 8px 11px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.35; color: ${T.ink}; animation: q-kir 0.3s ease-out; transition: opacity 0.3s ease; }
        .dm-qq i { font-style: normal; font-weight: 800; color: ${T.ink2}; }
        .dm-qq.ok i, .dm-qq.ok .dm-qq-n { color: ${T.ok}; }
        .dm-qq b { font-weight: 800; white-space: nowrap; }
        .dm-qq-n { flex: 1; min-width: 0; color: ${T.ink2}; font-weight: 600; }
        .dm-qq.xira { opacity: 0.45; }
        .dm-tur { flex-shrink: 0; font-size: 11px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; padding: 3px 9px; border-radius: 999px; animation: dm-pufak 0.35s ease-out backwards; }
        .dm-tur.usul { background: ${T.okFon}; color: ${T.ok}; }
        .dm-tur.bezak { background: ${T.line}; color: ${T.ink2}; }
        .dm-bk-w { animation: q-kir 0.35s ease-out; }
        .dm-bolak { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; padding: 15px 16px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.45; }
        .dm-bolak:disabled { cursor: default; }
        .dm-bolak-m { flex: 1; display: inline-block; transition: transform 0.55s cubic-bezier(.5,0,.3,1), opacity 0.55s ease; }
        .dm-bolak-m.uchdi { opacity: 0.15; }
        .dm-bolak-ch { font-style: normal; font-size: 24px; font-weight: 700; color: ${T.accent}; }
        .dm-b2 { display: flex; flex-direction: column; gap: 10px; }
        p.dm-savolq { margin: 0; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.5; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 10px 14px; }
        .dm-ikki-k { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; align-items: stretch; }
        .dm-tk-w { display: flex; flex-direction: column; gap: 6px; }
        .dm-tanla { flex: 1; display: flex; flex-direction: column; gap: 4px; text-align: left; padding: 12px 14px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; font-family: 'Manrope', sans-serif; transition: background 0.2s ease, border-color 0.2s ease; }
        .dm-tanla b { font-size: 15px; font-weight: 800; }
        .dm-tanla span { font-size: 12.5px; line-height: 1.4; color: ${T.ink2}; }
        .dm-tanla.on { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .dm-tanla:disabled { cursor: default; }
        .dm-izoh { display: block; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; font-weight: 500; color: ${T.ink2}; }
        .dm-xato { display: block; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; font-weight: 600; color: ${T.err}; }
        .dm-natija { display: flex; flex-direction: column; gap: 8px; }
        p.dm-joriy { margin: 0; font-family: 'Manrope', sans-serif; font-size: 14.5px; line-height: 1.55; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 10px 14px; }
        /* 4-ekran: Tweetie */
        .dm-nuqtalar { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .dm-nuq-l { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; margin-right: 6px; }
        .dm-nuqtalar i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; transition: background 0.3s, transform 0.3s; }
        .dm-nuqtalar i.ok { background: ${T.ok}; }
        .dm-nuqtalar i.cur { background: ${T.accent}; transform: scale(1.25); }
        .dm-voqea { display: flex; flex-direction: column; gap: 8px; align-items: stretch; width: 100%; animation: q-kir 0.35s ease-out; }
        .dm-voqea-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,1.9vw,19px); color: ${T.ink}; }
        .dm-voqea-g { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,1fr); gap: clamp(14px,2.4vw,28px); align-items: center; }
        .dm-voqea-o { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .dm-voqea .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 8px 14px; }
        .dm-voqea .q-bashorat .q-yorliq { margin: 0; }
        .dm-voqea .q-bashorat .q-variantlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .dm-tw-sahna { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 4px 0; }
        .dm-tanish { display: flex; flex-direction: column; gap: 4px; font-family: 'Manrope', sans-serif; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        .dm-tw-tel { width: 176px; }
        .dm-tw-tel .dm-ekran { height: 300px; padding: 22px 0 0; gap: 0; }
        .dm-tw-bosh { position: relative; height: 32px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid ${T.line}; background: ${T.paper}; z-index: 1; }
        .dm-tw-bosh b { font-size: 14px; }
        .dm-tw-bosh.brauzer { padding: 0 10px; }
        .dm-tw-manzil { width: 100%; height: 16px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .dm-tw.uchinchi .dm-tw-bosh { background: #1E9E6A; border-bottom-color: #1E9E6A; }
        .dm-tw-tugma { position: absolute; right: 8px; top: 5px; width: 22px; height: 22px; border-radius: 7px; border: 1.5px solid ${T.line}; display: flex; align-items: center; justify-content: center; }
        .dm-tw-tugma i { width: 10px; height: 10px; border: 2px solid ${T.ink2}; border-top-color: transparent; border-radius: 50%; }
        .dm-tw-oyna { position: relative; flex: 1; overflow: hidden; }
        .dm-tw-royxat { display: flex; flex-direction: column; }
        .dm-tw-post { display: flex; gap: 8px; padding: 10px; border-bottom: 1px solid ${T.line}; background: ${T.paper}; overflow: hidden; }
        .dm-tw-post > i { width: 22px; height: 22px; flex-shrink: 0; border-radius: 50%; background: ${T.line}; }
        .dm-tw-post > span { flex: 1; display: flex; flex-direction: column; gap: 5px; padding-top: 2px; }
        .dm-tw-post b { display: block; height: 6px; border-radius: 3px; background: ${T.line}; width: 90%; }
        .dm-tw-post b:first-child { width: 55%; background: ${T.ink2}; opacity: 0.35; }
        .dm-tw-post.yangi { background: rgba(29,155,240,0.1); max-height: 0; padding-top: 0; padding-bottom: 0; opacity: 0; }
        .dm-tw.chrome .dm-tw-post.yangi { background: rgba(26,115,232,0.1); }
        .dm-tw.uchinchi .dm-tw-post.yangi { background: rgba(30,158,106,0.12); }
        .dm-tw-strelka { position: absolute; top: 8px; left: 50%; margin-left: -10px; width: 20px; height: 20px; }
        .dm-tw-o, .dm-tw-aylana { position: absolute; inset: 0; opacity: 0; }
        .dm-tw-o::before { content: '↓'; display: block; text-align: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 16px; line-height: 20px; color: ${T.ink2}; }
        .dm-tw-aylana { border-radius: 50%; border: 2.5px solid ${T.line}; border-top-color: #1D9BF0; }
        .dm-tw.chrome .dm-tw-aylana { border-top-color: #1A73E8; } .dm-tw.uchinchi .dm-tw-aylana { border-top-color: #1E9E6A; }
        .dm-tw-barmoq { position: absolute; left: 50%; top: 40%; margin-left: -13px; width: 26px; height: 26px; border-radius: 50%; background: ${fon(T.ink, 0.22)}; border: 2px solid ${T.paper}; box-shadow: 0 4px 10px -4px rgba(${T.shadowBase},0.5); opacity: 0; pointer-events: none; z-index: 3; }
        .dm-tw.r-tugma .dm-tw-royxat { animation: dm-tw-l-t 4.4s ease-in-out infinite; }
        @keyframes dm-tw-l-t { 0%, 10% { transform: translateY(-96px); } 34%, 100% { transform: translateY(0); } }
        .dm-tw.r-tugma .dm-tw-barmoq { animation: dm-tw-b-t 4.4s ease-in-out infinite; }
        @keyframes dm-tw-b-t { 0% { opacity: 0; top: 34%; left: 50%; transform: scale(1); } 8% { opacity: 1; top: 34%; left: 50%; } 32% { opacity: 1; top: 78%; left: 50%; } 38% { opacity: 0; top: 78%; left: 50%; } 46% { opacity: 0; top: 7px; left: calc(100% - 6px); transform: scale(1); } 52% { opacity: 1; top: 7px; left: calc(100% - 6px); transform: scale(1); } 57% { transform: scale(0.75); } 62% { opacity: 1; transform: scale(1); top: 7px; left: calc(100% - 6px); } 68%, 100% { opacity: 0; top: 7px; left: calc(100% - 6px); } }
        .dm-tw.r-tugma .dm-tw-tugma { animation: dm-tw-tb 4.4s ease-in-out infinite; }
        @keyframes dm-tw-tb { 0%, 54%, 66%, 100% { background: transparent; } 57%, 62% { background: rgba(29,155,240,0.22); } }
        .dm-tw.r-tugma .dm-tw-tugma i { animation: dm-tw-ti 4.4s linear infinite; }
        @keyframes dm-tw-ti { 0%, 62% { transform: rotate(0); border-color: ${T.ink2}; border-top-color: transparent; } 63% { border-color: #1D9BF0; border-top-color: transparent; } 92% { transform: rotate(1080deg); border-color: #1D9BF0; border-top-color: transparent; } 96%, 100% { transform: rotate(1080deg); border-color: ${T.ink2}; border-top-color: transparent; } }
        @keyframes dm-spin { to { transform: rotate(360deg); } }
        .dm-tw.r-tortish .dm-tw-royxat { animation: dm-tw-l-p 4.4s ease-in-out infinite; }
        @keyframes dm-tw-l-p { 0%, 10% { transform: translateY(0); } 35%, 45% { transform: translateY(54px); } 52%, 74% { transform: translateY(32px); } 84%, 100% { transform: translateY(0); } }
        .dm-tw.r-tortish .dm-tw-post.yangi { animation: dm-tw-yangi 4.4s ease-in-out infinite; }
        @keyframes dm-tw-yangi { 0%, 76% { max-height: 0; padding-top: 0; padding-bottom: 0; opacity: 0; } 86%, 100% { max-height: 46px; padding-top: 10px; padding-bottom: 10px; opacity: 1; } }
        .dm-tw.r-tortish .dm-tw-o { animation: dm-tw-o 4.4s ease-in-out infinite; }
        @keyframes dm-tw-o { 0%, 12% { opacity: 0; transform: rotate(0); } 18%, 30% { opacity: 1; transform: rotate(0); } 38%, 46% { opacity: 1; transform: rotate(180deg); } 50%, 100% { opacity: 0; transform: rotate(180deg); } }
        .dm-tw.r-tortish .dm-tw-aylana { animation: dm-tw-a 4.4s linear infinite, dm-spin 0.8s linear infinite; }
        @keyframes dm-tw-a { 0%, 48% { opacity: 0; } 52%, 76% { opacity: 1; } 80%, 100% { opacity: 0; } }
        .dm-tw.r-tortish .dm-tw-barmoq { animation: dm-tw-b-p 4.4s ease-in-out infinite; }
        @keyframes dm-tw-b-p { 0% { opacity: 0; top: 24%; } 8% { opacity: 1; top: 24%; } 35% { opacity: 1; top: 46%; } 44% { opacity: 1; top: 46%; } 50%, 100% { opacity: 0; top: 46%; } }
        .dm-tw.r-tortish-tinch .dm-tw-post.yangi { max-height: 46px; padding-top: 10px; padding-bottom: 10px; opacity: 1; }
        .dm-tw-uch { display: flex; gap: clamp(8px,1.4vw,14px); justify-content: center; align-items: flex-end; }
        .dm-tw-u { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .dm-tw-u > .dm-brend { font-size: 14px; }
        .dm-tw-uch .dm-tw-tel { width: 136px; }
        .dm-tw-uch .dm-tw-tel .dm-ekran { height: 236px; }
        /* 5-ekran */
        .dm-s5-q .q-qadamlar { gap: 10px; }
        .dm-qism-b { display: flex; flex-direction: column; gap: 6px; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .dm-qism-b.kut b { color: ${T.ink2}; font-weight: 700; }
        .dm-qism-v { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px; border-radius: 12px; box-shadow: 0 0 0 2px ${T.accent}; animation: dm-navbat 1.6s ease-out infinite; }
        .dm-s5-viz { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .dm-talab { gap: 4px; }
        .dm-talab-s { display: block; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; line-height: 1.55; color: ${T.ink}; }
        .dm-fokus2 { display: grid; grid-template-columns: auto minmax(0,1fr); gap: clamp(14px,2.4vw,28px); align-items: center; }
        .dm-fokus2 > .q-col { gap: 10px; align-items: flex-start; }
        /* amaliyot bloklari */
        .dm-blok-tel { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 6px 0; }
        .dm-blok-tel .q-izoh { text-align: center; }
        .dm-forma { display: flex; flex-direction: column; gap: 7px; margin-top: 8px; }
        .dm-forma-m3 { display: block; font-size: 13px; line-height: 1.45; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 9px; padding: 7px 10px; }
        .dm-forma-q { display: flex; flex-direction: column; gap: 3px; }
        .dm-forma-l { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; line-height: 1.35; color: ${T.ink2}; }
        .dm-forma textarea { display: block; width: 100%; min-height: 36px; resize: vertical; font-family: 'Manrope', sans-serif; font-size: 13.5px; line-height: 1.4; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 7px 10px; }
        .dm-forma textarea:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .dm-forma-z { display: block; font-size: 12.5px; line-height: 1.4; color: ${T.ink2}; }
        .q-blok-q.joriy:has(.dm-forma[data-tola="0"]) > .q-blok-tana > .q-btn { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
        .dm-ukarta { display: flex; flex-direction: column; gap: 3px; margin-top: 8px; padding: 8px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .dm-ukarta .q-yorliq { margin: 0; }
        .dm-ukarta-s { font-size: 13.5px; line-height: 1.4; font-weight: 600; color: ${T.ink}; }
        /* kartochkalar va uyga vazifa */
        .dm-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: dm-navbat-fc 1.6s ease-out infinite; }
        @keyframes dm-navbat-fc { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        p.dm-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .dm-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: dm-fc-nuqta 1.4s ease-in-out 3; }
        @keyframes dm-fc-nuqta { 50% { transform: scale(1.6); opacity: 0.4; } }
        .dm-hw { display: flex; flex-direction: column; gap: 12px; }
        .dm-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .dm-hw-q { display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .dm-hw-k { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .dm-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; line-height: 1.35; }
        .lesson-root ol.dm-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .dm-hw-qadam li { display: flex; gap: 9px; align-items: flex-start; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .dm-hw-qadam li i { flex: 0 0 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; background: ${T.accentSoft}; color: ${T.accent}; }
        .dm-hw-keyingi { font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .mnote-chip { align-self: flex-end; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; padding: 6px 12px; border-radius: 999px; border: 1px dashed ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; }
        .mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; }
        .mnote-lbl { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.accent}; }
        .mnote-body { font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        @media (max-width: 760px) { .dm-voqea-g { grid-template-columns: minmax(0,1fr); } .dm-fokus2 { grid-template-columns: minmax(0,1fr); justify-items: center; } .dm-hw-karta { grid-template-columns: minmax(0,1fr); } }
        @media (max-width: 640px) { .dm-ikki .dm-ustun { zoom: 0.8; } .dm-tw-uch { zoom: 0.78; } .dm-ikki-k { gap: 8px; } }
        @media (prefers-reduced-motion: reduce) {
          .dm-kataklar .dm-katak, .dm-sakra, .dm-kun-n, .dm-kataklar, .dm-pufak, .dm-tur, .qatlam, .dm-barmoq, .dm-qq, .dm-bk-w, .dm-voqea, .dm-taxmin { animation: none !important; }
          .dm-navbat, .dm-navbat-k > .q-bashorat, .dm-qism-v, .q-kirish:has(.dm-hook.tanla) .q-variantlar-kol, .dm-dq.aj, .dm-ekran.aj-fon::before, .dm-flash.yangi .fc-card:not(.flip) .fc-front, .dm-fc-ipucha i { animation: none !important; }
          .dm-ekran.yonadi::after { animation: none; opacity: 1; }
          .dm-tw *, .dm-tw-royxat { animation: none !important; }
          .dm-katak, .dm-bolak-m, .dm-strelka, .dm-ekran { transition: none; }
          .dm-katak.bos { transform: none; background: ${T.accentSoft}; }
          .dm-tw.r-tortish .dm-tw-post.yangi { max-height: 46px; padding-top: 10px; padding-bottom: 10px; opacity: 1; }
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
            <LiveGate live={live} title={tr({ uz: 'Tizim arxitekturasi darsi', ru: 'Урок об архитектуре системы' })} />
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
