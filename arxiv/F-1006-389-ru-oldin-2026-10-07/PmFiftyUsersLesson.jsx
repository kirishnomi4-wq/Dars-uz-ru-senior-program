import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 12-Modul 7-dars «50 foydalanuvchiga qanday yetasiz?» (PM + amaliyot, m10-07) — skeletdan (konveyer, 04.10.2026); MD v3: feedback/F-1006-12modul/07-PmFiftyUsers-v3.md
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

const LESSON_META = { lessonId: 'pm-m10d7-v1', lessonTitle: { uz: "50 foydalanuvchiga qanday yetasiz?", ru: "Как дойти до 50 пользователей?" } };
// 12 ekran (MD v3, tayanch 4 «PM+PRAKT»): kirish → reja → Mentor rejasi → 1-savol → uch tekshiruv → o'z rejangiz → Amaliyot 1 → Amaliyot 2 → yakuniy savol → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'bosqich', ru: 'этап' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'kutilgan son', ru: 'ожидаемое число' }, l: 62, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'login', ru: 'логин' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'qurilma ID', ru: 'ID устройства' }, l: 74, tp: 68, s: 13, d: 6.8 }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Yangi dars — ✔ o'rni MD dagidek: s3 C · s8 A (yakuniy). Bloklar ballsiz — signal PRACTICE_BASE + ekran.
const INLINE_KEYS = { s3: 2, s8: 0 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: 'Kutilgan son', ru: 'Ожидаемое число' },
    cards: [
      { ic: '1', h: { uz: 'Bu darsda reja uch bosqichdan iborat: kanal, nima yuboriladi, kutilgan son, qachon.', ru: 'На этом уроке план состоит из трёх этапов: канал, что отправляется, ожидаемое число, когда.' } },
      { ic: '2', h: { uz: "Kutilgan son — taxmin: shuncha kishi yig'ilishi kutilyapti.", ru: 'Ожидаемое число — предположение: ожидается, что соберётся столько человек.' } },
      { ic: '3', h: { uz: "Haqiqiy son ishga tushirilgandan keyin Database'dan sanaladi.", ru: 'Настоящее число считают из Database после запуска.' }, ask: { uz: "Rejadagi son bilan sanalgan son farq qilsa, qaysi biri o'zgaradi?", ru: 'Если число в плане и посчитанное расходятся, какое из них меняется?' } }
    ]
  },
  8: {
    title: { uz: 'Halol sanoq', ru: 'Честный подсчёт' },
    cards: [
      { ic: '1', h: { uz: "Ikki son yonma-yon aytiladi: ro'yxatdan o'tgan va asosiy harakatni qilgan.", ru: 'Два числа называют рядом: зарегистрировавшиеся и сделавшие основное действие.' } },
      { ic: '2', h: { uz: 'Namuna va tekshiruv akkauntlari sanalmaydi.', ru: 'Тестовые и проверочные аккаунты не считаются.' } },
      { ic: '3', h: { uz: 'Sinfdoshlar sanaladi, lekin alohida aytiladi.', ru: 'Одноклассников считают, но называют отдельно.' }, ask: { uz: 'Nega sinfdoshlar alohida aytiladi?', ru: 'Почему одноклассников называют отдельно?' } }
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

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev, ustida }) => {
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
        savol={<>{ustida}{tr(question)}</>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — IshgaTushirish: chapda maket (chat · brauzer · telefon, o'lchami barqaror), o'ngda jadval yoki karta; bitta manba — ISHGA_TUSHIRISH =====
// qolip-maket: it-bosqich it-nuqta it-tugma fu-ok fu-tahrir fu-prompt-ed fu-yordam-b
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const REJA_KEY = 'pm-m10d7-reja';
const KANAL_KEY = 'pm-m10d6-kanallar';
const LEND_KEY = 'pm-m10d1-lending';
const TREK_KEY = 'pm-m9d8-platforma';
const trekOl = () => { const p = lsO(TREK_KEY); return p && (p.trek === 'web' || p.trek === 'mobil') ? p.trek : null; };
const trekYoz = (t) => lsY(TREK_KEY, { ...(lsO(TREK_KEY) || {}), trek: t });
const bugun = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
// pm-m10d7-reja — tayanch 8 shakli aynan (8, 10-darslar o'qiydi); sonlarni o'quvchi o'zi kiritadi, tekshiruv — ish fakti (bool)
const rejaBosh = () => ({ bosqichlar: [], tekshiruv: { malumot: false, olchov: false, havola: false }, yuborildi: false, royxat: null, sinfdosh: null, asosiy: null, sana: null });
const rejaOl = () => { const o = lsO(REJA_KEY); const b = rejaBosh(); return o ? { ...b, ...o, tekshiruv: { ...b.tekshiruv, ...(o.tekshiruv || {}) } } : b; };
const rejaYoz = (patch) => { const o = rejaOl(); const n = { ...o, ...patch, tekshiruv: { ...o.tekshiruv, ...(patch.tekshiruv || {}) } }; lsY(REJA_KEY, n); return n; };
const rejaSaqlangan = (r) => !!(r && Array.isArray(r.bosqichlar) && r.bosqichlar.length === 3);

// Mentor misoli — tayanch 1.7 aynan (reja, sanoq, ikkinchi post, siyosat, forma gapi); lending matnlari — 1.1 va 1.7
// «Maydon Jamoa» nomi — 11-Modul tayanch 9.62 yashili (PM palitrasining ok yashilidan farqli; F-1006-389)
const MAYDON_RANG = '#2E9E4F';
const ISHGA_TUSHIRISH = {
  nom: 'Maydon Jamoa',
  url: 'maydon-jamoa-….netlify.app',
  reja: [
    { id: 'b1', kanal: { uz: 'sinf chati va mahalla futbol guruhi', ru: 'чат класса и футбольная группа махалли' }, nima: { uz: "ikkinchi post («ilova chiqdi»)", ru: 'второй пост («приложение вышло»)' }, kutilgan: 20, qachon: { uz: 'ishga tushirish kuni', ru: 'день запуска' } },
    { id: 'b2', kanal: { uz: 'maktab chati (parallel sinflar; chat egasidan ruxsat)', ru: 'школьный чат (параллельные классы; разрешение владельца чата)' }, nima: { uz: 'post — birinchi qatori parallel sinflarga moslab', ru: 'пост — первая строка под параллельные классы' }, kutilgan: 35, qachon: { uz: 'birinchi hafta', ru: 'первая неделя' } },
    { id: 'b3', kanal: { uz: "har o'yin e'loni bilan birga havola: tashkilotchilar xohlasa o'z jamoasiga yuboradi", ru: 'ссылка вместе с каждым объявлением игры: организаторы по желанию отправляют своей команде' }, nima: { uz: 'lending havolasi', ru: 'ссылка на лендинг' }, kutilgan: 50, qachon: { uz: "har yangi e'londa", ru: 'при каждом новом объявлении' } }
  ],
  sanoq: { royxat: 20, sinfdosh: 11, guruh: 9, asosiy: 8 },
  yol: [{ uz: 'post', ru: 'пост' }, { uz: 'lending', ru: 'лендинг' }, { uz: 'havola', ru: 'ссылка' }, { uz: 'ilova', ru: 'приложение' }, { uz: "ro'yxatdan o'tdi", ru: 'зарегистрировался' }, { uz: "qo'shildi", ru: 'присоединился' }],
  lending: {
    sarlavha: { uz: "Mahalla futboliga jamoani bir joyda yig'ing", ru: 'Соберите команду для футбола в махалле в одном месте' },
    tugma: { uz: "Qo'shilmoqchiman", ru: 'Хочу присоединиться' },
    bolimH: { uz: "Qanday qo'shilaman", ru: 'Как присоединиться' },
    bolim: { uz: "Hozircha o'rnatish havolasi yo'q.", ru: 'Пока ссылки для установки нет.' },
    android: { uz: 'Android: ilovani o\'rnatish', ru: 'Android: установить приложение' },
    iphone: { uz: 'iPhone: brauzerda ochish', ru: 'iPhone: открыть в браузере' },
    ogoh: [{ uz: "Android o'rnatishda ogohlantirish ko'rsatadi — ilova do'kondan emas, to'g'ridan-to'g'ri o'rnatiladi.", ru: 'Android при установке показывает предупреждение — приложение ставится не из магазина, а напрямую.' }, { uz: "iPhone'da eslatma hozircha yo'q.", ru: 'На iPhone напоминаний пока нет.' }],
    siyosat: { uz: 'Maxfiylik siyosati', ru: 'Политика конфиденциальности' }
  },
  // 6-darsdagi birinchi post (tayanch 1.6, so'zma-so'z) — chatda eski post bo'lib turadi (SABOQ 33: bo'sh chat o'rnida haqiqiy mazmun)
  post1: { uz: "Mahalla futbolchilari, Shanba o'yiniga kim kelishini bitta joyda ko'rish uchun «Maydon Jamoa» ilovasini qurdim: o'yin e'lon qilinadi, «Qo'shilaman» bosiladi, nechta odam yig'ilgani ko'rinib turadi. Ilova ishlayapti, o'rnatish havolasi hozircha yo'q — sahifasini ko'ring: maydon-jamoa-….netlify.app", ru: 'Футболисты махалли, чтобы видеть в одном месте, кто придёт на субботнюю игру, я сделал приложение «Maydon Jamoa»: игру объявляют, нажимают «Присоединяюсь», видно, сколько людей собралось. Приложение работает, ссылки для установки пока нет — посмотрите страницу: maydon-jamoa-….netlify.app' },
  post2: { uz: "Maydon Jamoa chiqdi. Shanba, 18:00 o'yini ilovada turibdi — «Qo'shilaman» ni bosing, nechta odam yig'ilgani ko'rinadi. Android va iPhone uchun havola: {lending manzili}", ru: 'Maydon Jamoa вышел. Игра в субботу, 18:00, уже в приложении — нажмите «Присоединяюсь», видно, сколько людей собралось. Ссылка для Android и iPhone: {lending manzili}' },
  qadamlar: [{ nom: 'ochdi', y: { uz: 'ochdi', ru: 'открыл' } }, { nom: 'royxatdan-otdi', y: { uz: "ro'yxatdan o'tdi", ru: 'зарегистрировался' } }, { nom: 'qoshildi', y: { uz: "qo'shildi", ru: 'присоединился' } }, { nom: 'tasdiqladi', y: { uz: 'kelishini tasdiqladi', ru: 'подтвердил приход' } }],
  maxfiylik: {
    sarlavha: { uz: 'Maydon Jamoa · maxfiylik siyosati', ru: 'Maydon Jamoa · политика конфиденциальности' },
    qatorlar: [
      { s: { uz: "Qaysi ma'lumot?", ru: 'Какие данные?' }, j: { uz: "Ro'yxatdan o'tishda — ism, login va parol; parolning o'zi saqlanmaydi, o'rnida undan yasalgan satr (hash) turadi. Telefon raqami so'ralmaydi. Ilovada qadamlar sanaladi — ism va loginsiz, qurilma ID bilan. Lendingda Umami tashrif va tugma bosilishini sanaydi — unga ism va login yuborilmaydi.", ru: 'При регистрации — имя, логин и пароль; сам пароль не хранится, вместо него — строка, сделанная из него (hash). Номер телефона не спрашивается. В приложении считаются шаги — без имени и логина, с ID устройства. На лендинге Umami считает визиты и нажатия кнопки — имя и логин ему не отправляются.' } },
      { s: { uz: 'Nima uchun?', ru: 'Зачем?' }, j: { uz: "Ism — o'yindagi o'yinchilar bir-birini tanishi uchun. Login va parol — hisobga kirish uchun. Qadamlar sanog'i — ilovaning qaysi joyi tushunarsizligini bilish uchun.", ru: 'Имя — чтобы игроки в игре узнавали друг друга. Логин и пароль — чтобы входить в аккаунт. Подсчёт шагов — чтобы понять, какое место приложения непонятно.' } },
      { s: { uz: "Kim ko'radi?", ru: 'Кто видит?' }, j: { uz: "Ism — shu o'yindagi o'yinchilar. Loginni boshqa o'yinchilar ko'rmaydi. Database'ni faqat ilova egasi ko'radi.", ru: 'Имя — игроки этой игры. Логин другие игроки не видят. Database видит только владелец приложения.' } },
      { s: { uz: 'Qancha saqlanadi?', ru: 'Сколько хранится?' }, j: { uz: "Hisob — o'zingiz o'chirguningizcha: ilovada «Hisobni o'chirish» bor. Qadamlar yozuvi — 60 kun.", ru: 'Аккаунт — пока вы сами его не удалите: в приложении есть «Удалить аккаунт». Запись шагов — 60 дней.' } }
    ]
  },
  formaGapi: { uz: "Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.", ru: 'Имя — то, что видят игроки, фамилия не нужна. Логин другие игроки не видят.' },
  oyin: { kun: { uz: 'Shanba', ru: 'Суббота' }, soat: '18:00', joy: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, bor: 8, kerak: 10 }
};
const IT = ISHGA_TUSHIRISH;
const IL = (k) => tr(IT.lending[k]);
const postMatn = (manzil) => tr(IT.post2).split('{lending manzili}').join(manzil || IT.url);

// Son sanab o'sadi (reduced-motion va qayta kirishda — darhol)
const useSanash = (n, on, darhol) => {
  const [v, setV] = useState(on && (darhol || kamHarakat()) ? n : 0);
  useEffect(() => {
    if (!on) { setV(0); return undefined; }
    if (darhol || kamHarakat()) { setV(n); return undefined; }
    let i = 0; const q = Math.max(1, Math.round(n / 12));
    const t = setInterval(() => { i = Math.min(n, i + q); setV(i); if (i >= n) clearInterval(t); }, 60);
    return () => clearInterval(t);
  }, [n, on]); // eslint-disable-line
  return v;
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
    ? createPortal(uchlar.map(z => <span key={z.k} className="fu-uch" style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
    : null;
  return [uch, qatlam];
}
// Taxmin qatori — yashil xulosaning birinchi kichik qatori (E 42): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: …»
const TaxminQ = ({ togri, haqiqat }) => (
  <span className={cxx('fu-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>
);
// QIzoh — o'sha qutining oxirgi kichik qatori (E 42)
const IzohQ = ({ children }) => <span className="fu-izoh">{children}</span>;
// Bashorat tanlangach — ixcham qator natijagacha turadi (SABOQ 11)
const BashoratQ = ({ savol, javob }) => <div className="fu-bashq fade-step"><span>{savol}</span><span className="fu-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;

// --- Maket 1: chat oynasi (Telegram guruhi; chizilgan, logotipsiz)
const ItChat = ({ bosqich = 0 }) => {
  const maktab = bosqich === 2;
  return (
    <div className="it-chat">
      <div className="it-chat-bar">
        <span className={cxx('it-chat-ava', maktab && 'b')} aria-hidden="true">{maktab ? 'M' : 'MF'}</span>
        <span className="it-chat-t" key={maktab ? 'm' : 'g'}>
          <b>{maktab ? tr({ uz: 'Maktab chati', ru: 'Школьный чат' }) : tr({ uz: 'Mahalla futbol guruhi', ru: 'Футбольная группа махалли' })}</b>
          {!maktab && <span>{tr({ uz: "60 a'zo", ru: '60 участников' })}</span>}
        </span>
      </div>
      <div className="it-chat-ichi">
        {maktab && <span className="it-ruxsat fade-step">{tr({ uz: 'chat egasidan ruxsat ✓', ru: 'разрешение владельца чата ✓' })}</span>}
        {bosqich < 2 && <p className="it-puf eski" key="p0"><span>{tr(IT.post1)}</span></p>}
        {bosqich === 1 && <p className="it-puf" key="p1">{postMatn()}</p>}
        {maktab && <p className="it-puf kulrang" key="p2">{tr(IT.reja[1].nima)}</p>}
      </div>
    </div>
  );
};
// --- Maket 2: brauzer (lending yoki maxfiylik sahifasi). holat: 'yoq' | 'qizil' | 'havola'
const ItBrauzer = ({ sahifa = 'lending', holat = 'yoq', tugmaHalqa, onTugma, tugmaRef, bolimHalqa, uyalar, siyosatPast, surildi }) => {
  const ichRef = useRef(null), bolimRef = useRef(null);
  const [siljish, setSiljish] = useState(0);
  useLayoutEffect(() => {
    if (!surildi || !bolimRef.current) { setSiljish(0); return; }
    const kor = ichRef.current && ichRef.current.parentElement;
    const b = bolimRef.current;
    setSiljish(Math.max(0, b.offsetTop + b.offsetHeight + 14 - (kor ? kor.clientHeight : 0)));
  }, [surildi, holat]);
  const mx = sahifa === 'maxfiylik';
  return (
    <div className="it-oyna">
      <div className="it-bar"><i /><i /><i /><span className="it-url"><span key={sahifa} className="it-url-t">{mx ? '…/maxfiylik.html' : IT.url}</span></span></div>
      <div className="it-kor">
        {mx ? (
          <div className="it-ichi it-mx fade-step" key="mx">
            <b className="it-mx-sar">{tr(IT.maxfiylik.sarlavha)}</b>
            {IT.maxfiylik.qatorlar.map((q, i) => <p key={i} className="it-mx-q"><b>{tr(q.s)}</b> {tr(q.j)}</p>)}
          </div>
        ) : (
          <div className="it-ichi" ref={ichRef} key="ld" style={{ transform: siljish ? `translateY(-${siljish}px)` : undefined }}>
            <span className="it-nom">{IT.nom}</span>
            <h3 className="it-sar">{IL('sarlavha')}</h3>
            <button type="button" ref={tugmaRef} className={cxx('it-tugma', tugmaHalqa && 'fu-halqa')} disabled={!onTugma} onClick={onTugma}>{IL('tugma')}</button>
            <div className={cxx('it-bolim', bolimHalqa && 'halqa')} ref={bolimRef}>
              <b>{IL('bolimH')}</b>
              {holat === 'havola' ? (
                <span className="it-havolalar" key="h">
                  <span className="it-hv">{IL('android')}</span>
                  <span className="it-hv">{IL('iphone')}</span>
                  {IT.lending.ogoh.map((o, i) => <span key={i} className="it-ogoh">{tr(o)}</span>)}
                </span>
              ) : <span className={cxx('it-bolim-t', holat === 'qizil' && 'qizil')}>{IL('bolim')}</span>}
              {uyalar && <span className="it-uyalar fade-step" aria-hidden="true">{[0, 1, 2].map(i => <i key={i} style={{ '--d': (i * 0.12) + 's' }}>?</i>)}</span>}
            </div>
            {siyosatPast && <span className="it-siyosat-past">{IL('siyosat')}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
// --- Maket 3: telefon «Maydon Jamoa» (nom o'z rangida, logotipsiz; 170×272 barqaror)
// ekran: 'royxat' | 'oyinlar' | 'oyin' | 'elon' | 'hisob'
const ItTelefon = ({ ekran = 'oyinlar', login, telHalqa, onTel, silk, gap, siyosat, qoshildi, sorov, havolaUch, className }) => {
  const o = IT.oyin;
  return (
    <div className={cxx('it-tel', className)}>
      <span className="it-tel-bar"><b className="it-tel-nom">{IT.nom}</b></span>
      {ekran === 'royxat' && (
        <span className="it-ekran" key="r">
          <b className="it-tel-sar">{tr({ uz: "Ro'yxatdan o'tish", ru: 'Регистрация' })}</b>
          <span className="it-maydon">{tr({ uz: 'Ism', ru: 'Имя' })}</span>
          {login
            ? <span className="it-maydon yangi" key="l">{tr({ uz: 'Login', ru: 'Логин' })}</span>
            : <button type="button" key="t" className={cxx('it-nuqta', 'it-maydon', telHalqa && 'fu-halqa', silk && 'silk')} disabled={!onTel} onClick={onTel}>{tr({ uz: 'Telefon', ru: 'Телефон' })}</button>}
          <span className="it-maydon">{tr({ uz: 'Parol', ru: 'Пароль' })}</span>
          <span className="it-tel-btn">{tr({ uz: "Ro'yxatdan o'tish", ru: 'Регистрация' })}</span>
          {gap && <span className="it-gap fade-step">{tr(IT.formaGapi)}</span>}
          {siyosat && <span className="it-tel-hv fade-step">{IL('siyosat')}</span>}
        </span>
      )}
      {ekran === 'oyinlar' && (
        <span className="it-ekran" key="o">
          <b className="it-tel-sar">{tr({ uz: "O'yinlar", ru: 'Игры' })}</b>
          <span className="it-tel-kun">{tr(o.kun)}</span>
          <span className="it-karta"><b>{tr(o.kun)}, {o.soat}</b><span>{tr(o.joy)}</span><b className="it-son">{o.bor} / {o.kerak}</b></span>
        </span>
      )}
      {ekran === 'oyin' && (
        <span className="it-ekran" key="y">
          <span className="it-tel-orqa">‹ {tr({ uz: "O'yinlar", ru: 'Игры' })}</span>
          <b className="it-tel-sar">{tr(o.kun)}, {o.soat}</b>
          <span className="it-tel-joy">{tr(o.joy)}</span>
          <b className="it-son katta" key={qoshildi ? 'q' : 'n'}>{qoshildi ? o.bor + 1 : o.bor} / {o.kerak}</b>
          <span className={cxx('it-tel-btn', 'past', qoshildi && 'ok')}>{qoshildi ? tr({ uz: "Qo'shildingiz", ru: 'Вы присоединились' }) : tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
        </span>
      )}
      {ekran === 'elon' && (
        <span className="it-ekran" key="e">
          <b className="it-tel-sar">{tr({ uz: "E'lon berish", ru: 'Объявить игру' })}</b>
          <span className="it-karta"><b>{tr(o.kun)}, {o.soat}</b><span>{tr(o.joy)}</span><b className="it-son">0 / {o.kerak}</b></span>
          <span className={cxx('it-hv-chip', havolaUch && 'uch')}>{tr({ uz: 'havola', ru: 'ссылка' })} ›</span>
        </span>
      )}
      {ekran === 'hisob' && (
        <span className="it-ekran" key="h">
          <span className="it-tel-btn ikki">{tr({ uz: 'Hisobdan chiqish', ru: 'Выйти из аккаунта' })}</span>
          <span className="it-tel-btn qizil">{tr({ uz: "Hisobni o'chirish", ru: 'Удалить аккаунт' })}</span>
          {sorov && <span className="it-sorov fade-step"><b>{tr({ uz: "Rostdan o'chirasizmi?", ru: 'Точно удалить?' })}</b></span>}
        </span>
      )}
    </div>
  );
};
// Uch maket bitta komponentda (163/180): maket 'chat' | 'brauzer' | 'telefon' — o'lchami barqaror ramkada
const IshgaTushirish = ({ maket = 'brauzer', ostida, ...p }) => (
  <div className="it-maket">
    <div className="it-maket-r">
      {maket === 'chat' && <ItChat {...p} />}
      {maket === 'brauzer' && <ItBrauzer {...p} />}
      {maket === 'telefon' && <ItTelefon {...p} />}
    </div>
    {ostida}
  </div>
);
// 0…50 chizig'i: belgilar — kutilgan sonlar («Mentorning taxmini» / «taxminim»), haqiqiy — sanalgan son
const Chiziq = ({ max = 50, belgilar = [], yorliq, haqiqiy, yangi }) => {
  const pct = (v) => Math.max(0, Math.min(100, (v / (max || 1)) * 100)) + '%';
  const oxirgi = belgilar.length ? belgilar[belgilar.length - 1] : 0;
  return (
    <div className="it-chiziq">
      <div className="it-chiziq-t">
        <i className="it-chiziq-f" style={{ width: pct(oxirgi) }} />
        {belgilar.map((b, i) => <span key={i} className={cxx('it-chiziq-b', yangi === i && 'yangi')} style={{ left: pct(b) }}><b>{b}</b></span>)}
        {haqiqiy != null && <span className="it-chiziq-h fade-step" style={{ left: pct(haqiqiy) }}><b>{haqiqiy}</b></span>}
      </div>
      <div className="it-chiziq-s"><span>0</span>{yorliq && belgilar.length > 0 && <span className="it-chiziq-y">{yorliq}</span>}<span>{max}</span></div>
    </div>
  );
};
// Reja jadvali (E 45 — «ma'lumot»: to'q sarlavha qatori, katak chiziqlari, kulrang fon, soyasiz)
const REJA_USTUN = [{ uz: 'Bosqich', ru: 'Этап' }, { uz: 'Kanal', ru: 'Канал' }, { uz: 'Nima yuboriladi', ru: 'Что отправляется' }, { uz: 'Kutilgan son', ru: 'Ожидаемое число' }, { uz: 'Qachon', ru: 'Когда' }];
const RejaJadval = ({ qatorlar = [], yangi, kulrang = [], tahrir, ostida }) => (
  <div className="it-jadval">
    <div className="it-jq bosh">{REJA_USTUN.map((u, i) => <span key={i}>{tr(u)}</span>)}</div>
    {qatorlar.map((q, i) => (
      <div key={q.id || i} className={cxx('it-jq', yangi === i && 'yangi', kulrang.includes(i) && 'kulrang')}>
        <span className="it-jq-n">{i + 1}</span><span>{q.kanal}</span><span>{q.nima}</span><b className="it-jq-son">{q.kutilgan}</b>
        <span>{q.qachon}{kulrang.includes(i) && <em className="it-jq-em">{tr({ uz: 'hali boshlanmagan', ru: 'ещё не начат' })}</em>}</span>
        {tahrir && <button type="button" className="fu-tahrir" onClick={() => tahrir(i)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
      </div>
    ))}
    {ostida}
  </div>
);
// Ikki sanoq kartasi — yonma-yon (2-ekran, A2 o'ngi, 8-ekran kichik)
const SanoqKartalar = ({ royxat, asosiy, osti1, osti2, kichik, sanab = true, darhol }) => {
  const r = useSanash(typeof royxat === 'number' ? royxat : 0, sanab && typeof royxat === 'number', darhol);
  const a = useSanash(typeof asosiy === 'number' ? asosiy : 0, sanab && typeof asosiy === 'number', darhol);
  return (
    <div className={cxx('it-sanoq', kichik && 'kichik')}>
      <div className="it-sk"><span className="it-sk-l">{tr({ uz: "Ro'yxatdan o'tgan", ru: 'Зарегистрировались' })}:</span><b className="it-sk-s">{typeof royxat === 'number' ? r : '?'}</b>{osti1 && <span className="it-sk-o">{osti1}</span>}</div>
      <div className="it-sk"><span className="it-sk-l">{tr({ uz: 'Asosiy harakatni qilgan', ru: 'Сделали основное действие' })}:</span><b className="it-sk-s">{typeof asosiy === 'number' ? a : '?'}</b>{osti2 && <span className="it-sk-o">{osti2}</span>}</div>
    </div>
  );
};
// «Yuborishdan oldin» jadvali (4-ekran): uch tekshiruv — hozir ✗ → Amaliyot N
const YUBORISH = [
  { nom: { uz: "Ma'lumot", ru: 'Данные' }, savol: { uz: "faqat kerakli minimum so'raladimi?", ru: 'спрашивается только необходимый минимум?' }, hozir: { uz: "hozir: telefon so'raladi ✗", ru: 'сейчас: спрашивается телефон ✗' }, blok: { uz: 'Amaliyot 1', ru: 'Практика 1' } },
  { nom: { uz: "O'lchov", ru: 'Измерение' }, savol: { uz: 'qadamlar sanaladimi?', ru: 'считаются ли шаги?' }, hozir: { uz: 'hozir: sanalmaydi ✗', ru: 'сейчас: не считаются ✗' }, blok: { uz: 'Amaliyot 1', ru: 'Практика 1' } },
  { nom: { uz: 'Havola', ru: 'Ссылка' }, savol: { uz: 'odam ilovani qanday ochadi?', ru: 'как человек откроет приложение?' }, hozir: { uz: "hozir: havola yo'q ✗", ru: 'сейчас: ссылки нет ✗' }, blok: { uz: 'Amaliyot 2', ru: 'Практика 2' } }
];
const YuborishJadval = ({ n, yangi }) => (
  <div className="it-jadval it-yub">
    <div className="it-yub-h"><b>{tr({ uz: 'Yuborishdan oldin', ru: 'Перед отправкой' })}</b><span>{n} / 3</span></div>
    {YUBORISH.slice(0, n).map((q, i) => (
      <div key={i} className={cxx('it-yq', yangi === i && 'yangi')}>
        <b>{tr(q.nom)}</b><span>{tr(q.savol)}</span><span className="it-yq-x">{tr(q.hozir)}</span><span className="it-yq-a">{tr(q.blok)}</span>
      </div>
    ))}
  </div>
);

// ===== SCREEN 0 — KIRISH (QKirish; ballsiz — J-026; «Aynan!» / «Qiziq fikr!»; ikkala tanlovda vizual bir xil) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Havolani hoziroq hamma tanishlarimga yuboraman', ru: 'Прямо сейчас отправлю ссылку всем знакомым' } },
  { id: 'b', label: { uz: 'Avval reja tuzaman: kimga, nimani va qachon', ru: 'Сначала составлю план: кому, что и когда' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Reja kimga, nimani va qachon yuborishni aytadi. Yuborishdan oldin esa uch narsa tekshiriladi.</>, ru: <><b>Именно!</b> План говорит, кому, что и когда отправлять. А перед отправкой проверяют три вещи.</> },
  a: { uz: <><b>Qiziq fikr!</b> Tanishlardan boshlash mumkin — rejada ham shunday. Yuborishdan oldin esa uch narsa tekshiriladi.</>, ru: <><b>Интересная мысль!</b> Начать со знакомых можно — в плане тоже так. А перед отправкой проверяют три вещи.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('fu-s0', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>50 foydalanuvchiga <A>qanday yetasiz?</A></>, ru: <>Как дойти <A>до 50 пользователей?</A></> })}
          mentor={<Mentor>{tr({ uz: "Mentor misolida birinchi postdan keyin odamlar lendingga kirib tugmani bosdi, ilova esa hali ularga yuborilmagan. Ikki javobdan birini tanlang.", ru: 'В примере Ментора после первого поста люди зашли на лендинг и нажимали кнопку, а приложение им ещё не отправлено. Выберите один из двух ответов.' })}</Mentor>}
          maket={<IshgaTushirish maket="brauzer" bolimHalqa={picked !== null} uyalar={picked !== null}
            ostida={<code className="it-umami">{tr({ uz: "Umami (Mentor misolida · postdan keyingi kun): tashriflar 31 · «Qo'shilmoqchiman» 17", ru: 'Umami (в примере Ментора · день после поста): визиты 31 · «Хочу присоединиться» 17' })}</code>} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; chap — vizual bir marta o'zi yuradi: uch bosqich (sonsiz) → post → lending → «Ro'yxatdan o'tish» → «O'yinlar»; 2-ekran sonlari ochilmaydi) =====
const REJA = [
  { t: { uz: '50 foydalanuvchiga uch bosqichli reja tuzasiz', ru: 'Составите план из трёх этапов на 50 пользователей' }, teg: 'reja' },
  { t: { uz: "Ro'yxatdan o'tishda faqat keraklisini so'raysiz", ru: 'При регистрации будете спрашивать только нужное' }, teg: "ma'lumot" },
  { t: { uz: 'Ilovada qadamlar sanashini yoqasiz', ru: 'Включите подсчёт шагов в приложении' }, teg: "o'lchov" },
  { t: { uz: "Havolani lendingga qo'yib, post yuborasiz", ru: 'Поставите ссылку на лендинг и отправите пост' }, teg: 'havola' }
];
const RejaChizma = () => (
  <div className="fu-rj">
    <div className="fu-rj-ustun">{[1, 2, 3].map(i => <span key={i} className="fu-rj-b" style={{ '--d': (i - 1) * 0.25 + 's' }}>{i}-{tr({ uz: 'bosqich', ru: 'этап' })}</span>)}</div>
    <div className="fu-rj-yol">
      <i className="fu-rj-chiz" aria-hidden="true" />
      <span className="fu-rj-k chat" style={{ '--d': '0.9s' }}><b>{tr({ uz: 'Mahalla futbol guruhi', ru: 'Футбольная группа махалли' })}</b><i>{tr({ uz: 'post', ru: 'пост' })}</i></span>
      <span className="fu-rj-k br" style={{ '--d': '1.5s' }}><b>{tr({ uz: 'lending', ru: 'лендинг' })}</b><i>{IL('tugma')}</i></span>
      <span className="fu-rj-k tel" style={{ '--d': '2.1s' }}><b>{IT.nom}</b><i>{tr({ uz: "Ro'yxatdan o'tish", ru: 'Регистрация' })}</i></span>
      <span className="fu-rj-k tel" style={{ '--d': '2.7s' }}><b>{IT.nom}</b><i>{tr({ uz: "O'yinlar", ru: 'Игры' })}</i></span>
    </div>
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [trek] = useState(trekOl);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun reja tuzib, ilovangizni <A>yuborishga tayyorlaysiz.</A></>, ru: <>Сегодня составите план и <A>подготовите приложение к отправке.</A></> })}
        mentor={<Mentor>{tr({ uz: "6-darsda kanallarni tanlab birinchi postni yubordingiz — bugun o'sha kanallarga ilovaning o'zi boradi. Kodni agent yozadi, qaror va tekshiruv — sizdan.", ru: 'На 6-м уроке вы выбрали каналы и отправили первый пост — сегодня в эти каналы пойдёт само приложение. Код пишет агент, решения и проверка — за вами.' })}</Mentor>}
        chapYorliq={tr({ uz: "yig'ish rejasi va ishga tushirish", ru: 'план привлечения и запуск' })}
        chap={<RejaChizma />}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: r.teg }))}
      >
        <p className="fu-past mono">{fmtCode(tr({ uz: "repo `maydon-jamoa` · boshlang'ich holat `m12-dars-07-start` · namuna `m12-dars-07-done` — amaliyotlarni o'z mahsulotingizda bajarasiz.", ru: 'репозиторий `maydon-jamoa` · начальное состояние `m12-dars-07-start` · образец `m12-dars-07-done` — практики выполняете на своём продукте.' }))}</p>
        {trek !== 'web' && <p className="fu-past">{fmtCode(tr({ uz: "Uyda tayyorlagan o'rnatish faylingiz eski ro'yxatdan o'tish ekrani bilan — uni odamlarga yubormang: yangisi Amaliyot 1 oxirida tayyorlanadi. Hali sozlamagan bo'lsangiz — hozir terminalda: `npm install --global eas-cli` · `eas login` · `eas build:configure` (agentga: «`eas.json` ga `preview` profili: Android uchun `buildType` — `apk`; `env` da `EXPO_PUBLIC_API_URL` — Render manzili»), keyin reja bilan davom eting.", ru: 'Файл установки, подготовленный дома, — со старым экраном регистрации: не отправляйте его людям, новый готовится в конце Практики 1. Если ещё не настроили — сейчас в терминале: `npm install --global eas-cli` · `eas login` · `eas build:configure` (агенту: «в `eas.json` профиль `preview`: для Android `buildType` — `apk`; в `env` `EXPO_PUBLIC_API_URL` — адрес Render»), потом продолжайте с планом.' }))}</p>}
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — MENTOR REJASI (QTushuncha markaziy: bashorat → «Keyingi bosqich» ×3 → «Ishga tushirish kuni» → ikki sanoq; tugagach jadval va sanoq fokusga) =====
const S2_TAXMIN = [
  { k: '20', ok: true, t: { uz: '20 kishi', ru: '20 человек' } },
  { k: '35', t: { uz: '35 kishi', ru: '35 человек' } },
  { k: '50', t: { uz: '50 kishi', ru: '50 человек' } }
];
const S2_SAVOL = { uz: "«Ilova chiqdi» postidan keyin Mentor nechta kishi kutyapti?", ru: 'Сколько человек ждёт Ментор после поста «Приложение вышло»?' };
const mentorReja = () => IT.reja.map(q => ({ id: q.id, kanal: tr(q.kanal), nima: tr(q.nima), kutilgan: q.kutilgan, qachon: tr(q.qachon) }));
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = storedAnswer !== undefined;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [b, setB] = useState(avval ? 3 : 0);
  const [kun, setKun] = useState(avval);
  const [yangi, setYangi] = useState(-1);
  const [uchdi, setUchdi] = useState(false);
  const done = kun;
  const tugadi = useTugadi(done, 1800, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (yangi < 0) return undefined; const t = setTimeout(() => setYangi(-1), 1100); return () => clearTimeout(t); }, [yangi]);
  useEffect(() => { if (b < 3 || avval) return undefined; setUchdi(false); const t = setTimeout(() => setUchdi(true), 500); return () => clearTimeout(t); }, [b]); // eslint-disable-line
  const keyingi = () => { if (b >= 3) return; setYangi(b); setB(b + 1); };
  const tx = S2_TAXMIN.find(x => x.k === taxmin);
  const qatorlar = mentorReja().slice(0, b);
  const maket = b >= 3 ? <IshgaTushirish maket="telefon" ekran="elon" havolaUch={uchdi} /> : <IshgaTushirish maket="chat" bosqich={b} />;
  const chiziq = <Chiziq max={50} belgilar={qatorlar.map(q => q.kutilgan)} yangi={yangi} yorliq={tr({ uz: 'Mentorning taxmini', ru: 'Предположение Ментора' })} haqiqiy={kun ? IT.sanoq.royxat : null} />;
  const jadval = <RejaJadval qatorlar={qatorlar} yangi={yangi} kulrang={kun ? [1, 2] : []} ostida={chiziq} />;
  const sanoq = kun && <SanoqKartalar darhol={avval} royxat={IT.sanoq.royxat} asosiy={IT.sanoq.asosiy}
    osti1={tr({ uz: '11 tasi — sinfdosh, 9 tasi — mahalla futbol guruhidan · namuna va tekshiruv akkauntlarisiz', ru: '11 — одноклассники, 9 — из футбольной группы махалли · без тестовых и проверочных аккаунтов' })}
    osti2={tr({ uz: "hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan", ru: 'сейчас участвуют хотя бы в одной игре или объявили игру' })} />;
  const harakat = taxmin && !kun && (
    <div className="fu-harakat">
      {b < 3
        ? <QTugma className="it-bosqich fu-halqa" key={'b' + b} onClick={keyingi}>{tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} <span className="fu-n">{b + 1}/3</span></QTugma>
        : <QTugma className="it-bosqich fu-halqa" key="kun" onClick={() => setKun(true)}>{tr({ uz: 'Ishga tushirish kuni', ru: 'День запуска' })}</QTugma>}
    </div>
  );
  const joriy = b >= 3 && !tugadi && <p className="fu-joriy fade-step">{tr({ uz: "Bu darsda rejaning har bo'lagi bosqich deyiladi: unda kanal, nima yuborilishi, kutilgan son va qachon yoziladi.", ru: 'На этом уроке каждая часть плана называется этапом: в нём пишут канал, что отправляется, ожидаемое число и когда.' })}</p>;
  const mGap = !taxmin ? { uz: "Avval javobingizni belgilang, keyin Mentor rejasini bo'lakma-bo'lak oching.", ru: 'Сначала отметьте свой ответ, потом открывайте план Ментора по частям.' }
    : b < 3 ? { uz: "Keyingi bo'lakni ochish uchun «Keyingi bosqich»ni bosing.", ru: 'Чтобы открыть следующую часть, нажмите «Следующий этап».' }
    : { uz: "Rejadagi sonlar — kutilgan sonlar; haqiqiysini ko'rish uchun «Ishga tushirish kuni»ni bosing.", ru: 'Числа в плане — ожидаемые; чтобы увидеть настоящее, нажмите «День запуска».' };
  const navL = !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : b < 3 ? { uz: `Keyingi bosqich (${b + 1}/3)`, ru: `Следующий этап (${b + 1}/3)` } : !kun ? { uz: 'Ishga tushirish kuni', ru: 'День запуска' } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · reja', ru: 'Понятие · план' })} screen={screen} scrollSignal={b + (kun ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navL)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>50 kishi bitta <A>postdan keladimi?</A></>, ru: <>Придут ли 50 человек <A>с одного поста?</A></> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />
          : !done && <BashoratQ savol={tr(S2_SAVOL)} javob={tr(tx.t)} />}
        vizual={tugadi
          ? <div className="fu-fokus">{jadval}{sanoq}</div>
          : <div className="fu-split">{maket}<div className="fu-ong">{jadval}{joriy}{sanoq}{harakat}</div></div>}
        xulosa={done && <>{tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: '20 kishi — 35 va 50 keyingi bosqichlarda kutilyapti', ru: '20 человек — 35 и 50 ожидаются на следующих этапах' })} />}{tr({ uz: "Bu misolda 20 — taxmin; kunning oxirida ikki son sanaldi: ro'yxatdan o'tgan va asosiy harakatni qilgan.", ru: 'В этом примере 20 — предположение; в конце дня посчитали два числа: зарегистрировавшихся и сделавших основное действие.' })}<IzohQ>{tr({ uz: "Bu misolda taxmin va haqiqiy son teng chiqdi — sizda farq qilishi mumkin.", ru: 'В этом примере предположение и настоящее число совпали — у вас может быть иначе.' })}</IzohQ></>}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ C, INLINE_KEYS.s3 = 2; savol ustida yorliq yo'q — SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · kutilgan son', ru: 'Проверка · ожидаемое число' })}
    questionText="Rejada 2-bosqich yonida «35» turibdi. Bu son nimani bildiradi?"
    question={tr({ uz: <h2 className="title h-ask">Rejada 2-bosqich yonida «35» turibdi. Bu son <A>nimani bildiradi?</A></h2>, ru: <h2 className="title h-ask">В плане рядом с 2-м этапом стоит «35». Что <A>означает это число?</A></h2> })}
    options={[
      { uz: 'Maktab chatida shuncha kishi borligini', ru: 'Что в школьном чате столько человек' },
      { uz: "Shuncha kishi allaqachon ro'yxatdan o'tganini", ru: 'Что столько человек уже зарегистрировались' },
      { uz: "Shuncha kishi yig'ilishi kutilayotganini", ru: 'Что ожидается, что соберётся столько человек' },
      { uz: "Shuncha kishi postni o'qishi aniq bo'lganini", ru: 'Что точно известно: столько человек прочтут пост' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Rejadagi son — taxmin, haqiqiysi keyin sanaladi.', ru: 'Число в плане — предположение, настоящее считают потом.' }}
    explainWrong={{
      0: { uz: 'Chatdagi odamlar soni — boshqa son. Rejada nima yoziladi?', ru: 'Число людей в чате — другое число. Что пишут в плане?' },
      1: { uz: '2-bosqich hali boshlanmagan. Sanalgan son qayerda turadi?', ru: '2-й этап ещё не начат. Где стоит посчитанное число?' },
      3: { uz: 'Post nechta kishiga yetishi oldindan aniq emas.', ru: 'Скольким людям дойдёт пост, заранее неизвестно.' },
      default: { uz: 'Rejadagi son — taxmin, haqiqiysi keyin sanaladi.', ru: 'Число в плане — предположение, настоящее считают потом.' }
    }} />
);

// ===== SCREEN 4 — UCH TEKSHIRUV (QTushuncha: bashorat → uch nuqta tartibda — Telefon qatori → «Sanashni yoqish» → «Qo'shilmoqchiman»; o'ngda «Yuborishdan oldin» jadvali) =====
const S4_TAXMIN = [
  { k: 'hech', t: { uz: 'Hech narsa', ru: 'Ничего' } },
  { k: 'bitta', t: { uz: 'Bitta narsa', ru: 'Одна вещь' } },
  { k: 'uchta', ok: true, t: { uz: 'Uchta narsa', ru: 'Три вещи' } }
];
const S4_SAVOL = { uz: 'Mentor ilovasi hoziroq yuborilsa, nechta narsa yetmay qoladi?', ru: 'Если приложение Ментора отправить прямо сейчас, скольких вещей не хватит?' };
const S4_YOL = ['oyinlar', 'royxat', 'oyin'];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = storedAnswer !== undefined;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 3 : 0);
  const [silk, setSilk] = useState(false);
  const [yur, setYur] = useState(-1); // 2-nuqta: yangi o'yinchi yo'li o'zi o'ynaydi (0..2), -1 — yo'q
  const [yangi, setYangi] = useState(-1);
  const [bosildi, setBosildi] = useState(false);
  const done = n >= 3;
  const tugadi = useTugadi(done, 1800, avval);
  const tRef = useRef([]);
  useEffect(() => () => tRef.current.forEach(clearTimeout), []);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (yangi < 0) return undefined; const t = setTimeout(() => setYangi(-1), 1100); return () => clearTimeout(t); }, [yangi]);
  const kech = (ms, f) => { tRef.current.push(setTimeout(f, kamHarakat() ? 0 : ms)); };
  const telBos = () => { if (n !== 0 || silk) return; setSilk(true); kech(650, () => { setSilk(false); setYangi(0); setN(1); }); };
  const sanash = () => { if (n !== 1 || yur >= 0) return; setYur(0); kech(900, () => setYur(1)); kech(1800, () => setYur(2)); kech(2700, () => { setYangi(1); setN(2); }); };
  const lendBos = () => { if (n !== 2 || bosildi) return; setBosildi(true); kech(1100, () => { setYangi(2); setN(3); }); };
  const tx = S4_TAXMIN.find(x => x.k === taxmin);
  const sonlar = n >= 2 ? [1, 1, 1, 0] : yur >= 0 ? [1, yur >= 1 ? 1 : 0, yur >= 2 ? 1 : 0, 0] : null;
  let maket;
  if (n === 0) maket = <IshgaTushirish maket="telefon" ekran="royxat" telHalqa={!!taxmin && !silk} onTel={taxmin ? telBos : undefined} silk={silk}
    ostida={silk && <span className="fu-yorliq fade-step">{tr({ uz: 'SMS yuborilmaydi — raqam kerak emas', ru: 'SMS не отправляются — номер не нужен' })}</span>} />;
  else if (n === 1) maket = <IshgaTushirish maket="telefon" ekran={yur >= 0 ? S4_YOL[yur] : 'oyinlar'} login qoshildi={yur >= 2}
    ostida={<div className="it-qadamlar">
      <div className="it-qy">{IT.qadamlar.map((q, i) => <span key={q.nom} className={cxx('it-qy-b', sonlar && sonlar[i] && 'on')}><span>{tr(q.y)}</span><b key={sonlar ? sonlar[i] : 'x'}>{sonlar ? sonlar[i] : '?'}</b></span>)}</div>
      {yur < 0 ? <QTugma className="it-bosqich fu-halqa" onClick={sanash}>{tr({ uz: 'Sanashni yoqish', ru: 'Включить подсчёт' })}</QTugma> : <code className="it-qid fade-step">ochdi · k3f9…</code>}
    </div>} />;
  else maket = <IshgaTushirish maket="brauzer" tugmaHalqa={n === 2 && !bosildi} onTugma={n === 2 && !bosildi ? lendBos : undefined} surildi={bosildi || n >= 3} holat={n >= 3 ? 'havola' : bosildi ? 'qizil' : 'yoq'} />;
  const joriy = !tugadi && n >= 1 && (
    <div className="fu-joriy-q fade-step" key={'j' + n}>
      {n === 1 && <p className="fu-joriy">{tr({ uz: "Ro'yxatdan o'tishda o'zingiz tanlagan nom login deyiladi — loginni boshqa o'yinchilar ko'rmaydi.", ru: 'Имя, которое вы сами выбираете при регистрации, называется логином — другие игроки логин не видят.' })}</p>}
      {n === 2 && <><p className="fu-joriy">{tr({ uz: 'Qurilma ID — tasodifiy harf va raqamlar: bitta qurilmadagi ilovani ajratadi, odamning ismini ham, loginini ham bildirmaydi.', ru: 'ID устройства — случайные буквы и цифры: отличает приложение на одном устройстве, не выдаёт ни имени, ни логина человека.' })}</p><QIzoh>{tr({ uz: "10-Moduldagi brauzer ID ning ilovadagi ko'rinishi; har qadamda turli qurilmalar soni sanaladi.", ru: 'Вид браузерного ID из 10-го модуля в приложении; на каждом шаге считают число разных устройств.' })}</QIzoh></>}
      {n >= 3 && <p className="fu-joriy">{tr({ uz: "Mentor misolida Android'ga APK — o'rnatiladigan ilova fayli — boradi; iPhone'da ilovaning brauzer ko'rinishi ochiladi.", ru: 'В примере Ментора на Android идёт APK — файл приложения для установки; на iPhone открывается браузерная версия приложения.' })}</p>}
    </div>
  );
  const mGap = !taxmin ? { uz: "Avval javobingizni belgilang, keyin yangi o'yinchi yo'lini bosib chiqing.", ru: 'Сначала отметьте свой ответ, потом пройдите путь нового игрока.' }
    : n === 0 ? { uz: "Yangi o'yinchi ro'yxatdan o'tmoqchi — formadagi yonib turgan qatorni bosing.", ru: 'Новый игрок хочет зарегистрироваться — нажмите подсвеченную строку формы.' }
    : n === 1 ? { uz: "10-Modulda saytdagi qadamlarni sanagansiz, ilovada esa hali sanalmaydi — «Sanashni yoqish»ni bosing.", ru: 'В 10-м модуле вы считали шаги на сайте, а в приложении они пока не считаются — нажмите «Включить подсчёт».' }
    : { uz: "Oxirgisi — lendingdagi «Qo'shilmoqchiman»ni bosing: odam ilovaga qanday yetadi?", ru: 'Последнее — нажмите на лендинге «Хочу присоединиться»: как человек доберётся до приложения?' };
  const navL = !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : !done ? { uz: `Yo'lni bosib chiqing (${n}/3)`, ru: `Пройдите путь (${n}/3)` } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · yuborishdan oldin', ru: 'Понятие · перед отправкой' })} screen={screen} scrollSignal={n + (yur >= 0 ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navL)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Havolani yuborishdan oldin <A>nimani tekshirasiz?</A></>, ru: <>Что вы проверите <A>перед отправкой ссылки?</A></> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />
          : !done && <BashoratQ savol={tr(S4_SAVOL)} javob={tr(tx.t)} />}
        vizual={tugadi
          ? <div className="fu-fokus"><YuborishJadval n={3} /></div>
          : taxmin ? <div className="fu-split">{maket}<div className="fu-ong"><YuborishJadval n={n} yangi={yangi} />{joriy}</div></div> : <div className="fu-yakka">{maket}</div>}
        xulosa={done && <>{tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: "uchta narsa — ma'lumot, o'lchov, havola", ru: 'три вещи — данные, измерение, ссылка' })} />}{tr({ uz: "Bu misolda uchalasi ham tayyor emas edi: telefon so'ralardi, qadamlar sanalmasdi, havola yo'q edi.", ru: 'В этом примере все три не были готовы: спрашивали телефон, шаги не считались, ссылки не было.' })}</>}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — O'Z REJANGIZ (QMustaqil, ketma-ket karta — E 53, SABOQ 9/13/29): bir vaqtda bitta katta karta, «Qo'shish» → ixcham qatorga uchadi; 3/3 dan keyin «Saqlash» → pm-m10d7-reja =====
const QACHON = [{ k: 'bugun', t: { uz: 'Bugun', ru: 'Сегодня' } }, { k: 'hafta', t: { uz: 'Shu hafta', ru: 'На этой неделе' } }, { k: 'keyinroq', t: { uz: 'Keyinroq', ru: 'Позже' } }];
const qachonT = (k) => { const q = QACHON.find(x => x.k === k); if (!q) return ''; const s = tr(q.t); return s.charAt(0).toLowerCase() + s.slice(1); };
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normS = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const XAVF_RE = /(notanish|shaxsiy xabar|hamma guruh|reklama|sotib)/;
const S5_XATO = {
  kanal: { uz: 'Qayerga yuborasiz — shuni yozing.', ru: 'Куда отправите — напишите это.' },
  nima: { uz: 'Nima yuborasiz — shuni yozing.', ru: 'Что отправите — напишите это.' },
  son: { uz: 'Nechta kishi kutyapsiz — son yozing.', ru: 'Сколько человек ждёте — напишите число.' },
  kam: { uz: "Bu son — jami: oldingi bosqichdagidan kam bo'lmaydi.", ru: 'Это число — всего: оно не меньше, чем на предыдущем этапе.' },
  xavf: { uz: "Bu kanal xavfsizlik qoidalariga to'g'ri keladimi?", ru: 'Подходит ли этот канал под правила безопасности?' },
  ellik: { uz: 'Bu moduldagi mashq maqsadi — 50. Yana kanal bormi?', ru: 'Цель упражнения в этом модуле — 50. Есть ещё канал?' }
};
const kanallarOl = () => {
  const k = lsO(KANAL_KEY);
  const arr = k && Array.isArray(k.kanallar) ? k.kanallar.filter(x => x && String(x.nom || '').trim()) : [];
  return [...arr.filter(x => x.ruxsat === 'bor'), ...arr.filter(x => x.ruxsat !== 'bor')];
};
const s5Bosh = (r, kl) => {
  if (rejaSaqlangan(r)) return r.bosqichlar.map(b => ({ kanal: String(b.kanal || ''), nima: String(b.nima || ''), kutilgan: b.kutilgan == null ? '' : String(b.kutilgan), qachon: b.qachon || null }));
  const bor = kl.filter(x => x.ruxsat === 'bor');
  return [0, 1, 2].map(i => ({ kanal: bor[i] ? String(bor[i].nom) : '', nima: '', kutilgan: '', qachon: null }));
};
// Maslahat (bloklamaydi — qaror o'quvchida, S-008): son kamaysa · kanal xavfsizlikka zid bo'lishi mumkin · 3-bosqich 50 dan kam
const s5Maslahat = (i, k, kartalar) => {
  const n = Number(k.kutilgan);
  if (i > 0 && /^\d+$/.test(String(kartalar[i - 1].kutilgan)) && /^\d+$/.test(k.kutilgan) && n < Number(kartalar[i - 1].kutilgan)) return 'kam';
  if (XAVF_RE.test(normS(k.kanal))) return 'xavf';
  if (i === 2 && /^\d+$/.test(k.kutilgan) && n < 50) return 'ellik';
  return null;
};
const S5_YORDAM = { uz: "Mentor rejasi: 1-bosqich — sinf chati va mahalla futbol guruhi, ikkinchi post, jami 20 · 2-bosqich — maktab chati (chat egasidan ruxsat bilan), jami 35 · 3-bosqich — tashkilotchilar xohlasa o'z jamoasiga havola yuboradi, jami 50. Sonlar — Mentorning taxmini; sizning mahsulotingizda boshqa bo'ladi. Yangi kanal bo'lmasa — 3-bosqich oldingi kanallarda davom etishi mumkin.", ru: 'План Ментора: 1-й этап — чат класса и футбольная группа махалли, второй пост, всего 20 · 2-й этап — школьный чат (с разрешения владельца чата), всего 35 · 3-й этап — организаторы по желанию отправляют ссылку своей команде, всего 50. Числа — предположение Ментора; в вашем продукте будут другие. Если нового канала нет — 3-й этап может продолжиться в прежних каналах.' };
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [kl] = useState(kanallarOl);
  const [saqlandi, setSaqlandi] = useState(() => rejaSaqlangan(rejaOl()));
  const [kartalar, setKartalar] = useState(() => s5Bosh(rejaOl(), kl));
  const [tasdiq, setTasdiq] = useState(() => [0, 1, 2].map(() => rejaSaqlangan(rejaOl())));
  const [ochiqT, setOchiqT] = useState(null); // bosib qayta ochilgan karta
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [yangi, setYangi] = useState(-1);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null), qatorRef = useRef([]);
  const birinchiBosh = tasdiq.findIndex(t => !t);
  const ochiq = ochiqT != null ? ochiqT : (birinchiBosh >= 0 ? birinchiBosh : null);
  const n = tasdiq.filter(Boolean).length;
  const done = saqlandi;
  const tugadi = done && ochiqT == null;
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'Reja', solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  }, [done]); // eslint-disable-line
  useEffect(() => { if (yangi < 0) return undefined; const t = setTimeout(() => setYangi(-1), 1100); return () => clearTimeout(t); }, [yangi]);
  const setK = (i, patch) => { setKartalar(ks => ks.map((k, j) => (j === i ? { ...k, ...patch } : k))); setXato(null); };
  const saqla = (ks) => {
    rejaYoz({ bosqichlar: ks.map((k, i) => ({ id: 'b' + (i + 1), kanal: k.kanal.trim(), nima: k.nima.trim(), kutilgan: Number(k.kutilgan), qachon: k.qachon || null })), sana: bugun() });
    setSaqlandi(true); setOchiqT(null); setXato(null); setYordam(false);
  };
  const qosh = () => {
    if (ochiq == null) return;
    const k = kartalar[ochiq];
    if (!k.kanal.trim()) { setXato('kanal'); return; }
    if (!k.nima.trim()) { setXato('nima'); return; }
    if (!/^\d+$/.test(String(k.kutilgan))) { setXato('son'); return; }
    const t2 = tasdiq.map((t, j) => (j === ochiq ? true : t));
    uch(kartaRef.current, qatorRef.current[ochiq] || qatorRef.current[Math.max(0, ochiq - 1)] || kartaRef.current, `${ochiq + 1} · ${k.kanal.trim()}`.slice(0, 40));
    setTasdiq(t2); setYangi(ochiq); setXato(null); setYordam(false);
    if (saqlandi) { saqla(kartalar); return; }
    setOchiqT(null);
  };
  const tahrir = (i) => { setOchiqT(i); setXato(null); setYordam(false); };
  const sonlar = kartalar.map((k, i) => (tasdiq[i] && /^\d+$/.test(String(k.kutilgan)) ? Number(k.kutilgan) : null)).filter(v => v != null);
  const eng = Math.max(1, ...sonlar);
  const ixcham = (k, i) => [String(i + 1), k.kanal.trim(), k.nima.trim(), String(k.kutilgan), qachonT(k.qachon)].filter(Boolean).join(' · ');
  const kanalSoraladi = (v) => kl.some(x => x.ruxsat !== 'bor' && normS(x.nom) === normS(v));
  const k = ochiq != null ? kartalar[ochiq] : null;
  const toliq = k && k.kanal.trim() && k.nima.trim() && /^\d+$/.test(String(k.kutilgan));
  const karta = k && (
    <div key={'k' + ochiq} ref={kartaRef} className={cxx('fu-karta', 'fu-kirish', xato && 'err')}>
      <span className="q-yorliq">{ochiq + 1}-{tr({ uz: 'bosqich', ru: 'этап' })} · {ochiq + 1} / 3</span>
      {kl.length > 0 && <div className="fu-kanal-chip">{kl.map(x => <QChip key={x.id || x.nom} holat={normS(k.kanal) === normS(x.nom) ? 'on' : undefined} onClick={() => setK(ochiq, { kanal: String(x.nom) })}>{x.nom}</QChip>)}</div>}
      <label className={cxx('fu-mz', xato === 'kanal' && 'err', !k.kanal.trim() && 'fu-halqa-i')}>
        <span className="fu-mz-n">{tr({ uz: 'Kanal', ru: 'Канал' })}</span>
        <input className="fu-inp" value={k.kanal} maxLength={60} placeholder={tr({ uz: 'Qayerga yuborasiz?', ru: 'Куда отправите?' })} onChange={(e) => setK(ochiq, { kanal: e.target.value })} />
      </label>
      {kanalSoraladi(k.kanal) && <span className="fu-kulrang fade-step">{tr({ uz: "avval ruxsat so'rang", ru: 'сначала спросите разрешение' })}</span>}
      <label className={cxx('fu-mz', xato === 'nima' && 'err', k.kanal.trim() && !k.nima.trim() && 'fu-halqa-i')}>
        <span className="fu-mz-n">{tr({ uz: 'Nima yuboriladi', ru: 'Что отправляется' })}</span>
        <input className="fu-inp" value={k.nima} maxLength={60} placeholder={tr({ uz: 'Post, havola yoki boshqa narsa', ru: 'Пост, ссылка или что-то другое' })} onChange={(e) => setK(ochiq, { nima: e.target.value })} />
      </label>
      <label className={cxx('fu-mz', 'son', xato === 'son' && 'err', k.nima.trim() && !String(k.kutilgan) && 'fu-halqa-i')}>
        <span className="fu-mz-n">{tr({ uz: 'Kutilgan son — jami', ru: 'Ожидаемое число — всего' })}</span>
        <input className="fu-inp" value={k.kutilgan} inputMode="numeric" maxLength={5} onChange={(e) => setK(ochiq, { kutilgan: e.target.value.replace(/\D/g, '').slice(0, 5) })} onKeyDown={(e) => { if (e.key === 'Enter') qosh(); }} />
        <span className="fu-mz-y">{tr({ uz: 'taxminim', ru: 'моё предположение' })}</span>
      </label>
      <div className="fu-qachon">
        <span className="fu-mz-n">{tr({ uz: 'Qachon', ru: 'Когда' })}</span>
        {QACHON.map(q => <QChip key={q.k} holat={k.qachon === q.k ? 'on' : undefined} onClick={() => setK(ochiq, { qachon: q.k })}>{tr(q.t)}</QChip>)}
      </div>
      {xato && <QXato>{tr(S5_XATO[xato])}</QXato>}
      {yordam && <p className="fu-yordam fade-step">{tr(S5_YORDAM)}</p>}
      <div className="fu-karta-tug">
        <QTugma className={cxx(toliq && 'fu-halqa')} onClick={qosh}>{saqlandi ? tr({ uz: 'Saqlash', ru: 'Сохранить' }) : tr({ uz: "Qo'shish", ru: 'Добавить' })}</QTugma>
        <QTugma ikkinchi className="fu-yordam-btn" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      </div>
    </div>
  );
  const oklar = n > 0 && !tugadi && (
    <div className="fu-oklar">
      {kartalar.map((kk, i) => (tasdiq[i] && i !== ochiq ? (
        <div key={i} className="fu-ok-q">
          <button type="button" ref={el => { qatorRef.current[i] = el; }} className={cxx('fu-ok', yangi === i && 'yangi')} onClick={() => tahrir(i)} aria-label={`${i + 1}-${tr({ uz: 'bosqich', ru: 'этап' })} · ${tr({ uz: 'tahrirlash', ru: 'редактировать' })}`}><i>✓</i><span>{ixcham(kk, i)}</span></button>
          {s5Maslahat(i, kk, kartalar) && <QXato>{tr(S5_XATO[s5Maslahat(i, kk, kartalar)])}</QXato>}
        </div>
      ) : null))}
    </div>
  );
  const chiziq = sonlar.length > 0 && <Chiziq max={eng} belgilar={sonlar} yangi={yangi >= 0 ? sonlar.length - 1 : -1} yorliq={tr({ uz: 'taxminim', ru: 'моё предположение' })} />;
  const rejaKarta = (
    <RejaJadval qatorlar={kartalar.map((kk, i) => ({ id: 'b' + (i + 1), kanal: kk.kanal, nima: kk.nima, kutilgan: kk.kutilgan, qachon: qachonT(kk.qachon) }))} tahrir={tahrir}
      ostida={<Chiziq max={eng} belgilar={sonlar} yorliq={tr({ uz: 'taxminim', ru: 'моё предположение' })} />} />
  );
  const navL = done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Bosqichlarni yozing (${n}/3)`, ru: `Напишите этапы (${n}/3)` };
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={n + (saqlandi ? 4 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navL)} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Sizning rejangizda qaysi <A>uch bosqich bor?</A></>, ru: <>Какие <A>три этапа</A> в вашем плане?</> })}
        mentor={<Mentor>{kl.length > 0
          ? tr({ uz: "Har bosqichga kanal, nima yuborilishi, kutilgan son va vaqtni yozing — kanallar 6-darsdagi tanlovingizdan olindi.", ru: 'Для каждого этапа напишите канал, что отправляется, ожидаемое число и время — каналы взяты из вашего выбора на 6-м уроке.' })
          : tr({ uz: "Har bosqichga kanal, nima yuborilishi, kutilgan son va vaqtni yozing — kanalni o'zingiz yozasiz.", ru: 'Для каждого этапа напишите канал, что отправляется, ожидаемое число и время — канал напишете сами.' })}</Mentor>}
        qadamlar={!isMentor && !tugadi && <>
          <p className="fu-kirish-q">{tr({ uz: "Kanal — faqat o'zingiz a'zo bo'lgan joy yoki tanish doira; guruhga — egasidan ruxsat so'rab.", ru: 'Канал — только место, где вы участник, или знакомый круг; в группу — спросив разрешения у владельца.' })}</p>
          <QQadamlar qadamlar={[1, 2, 3].map(i => `${i}-${tr({ uz: 'bosqich', ru: 'этап' })}`)} joriy={ochiq != null ? ochiq : undefined} />
        </>}
        forma={isMentor
          ? <RejaJadval qatorlar={mentorReja()} ostida={<Chiziq max={50} belgilar={[20, 35, 50]} yorliq={tr({ uz: 'Mentorning taxmini', ru: 'Предположение Ментора' })} />} />
          : tugadi
            ? <div className="fu-fokus">{rejaKarta}<QXulosa>{tr({ uz: 'Rejangiz saqlandi: uch bosqich, kanal va kutilgan son bilan. Haqiqiy sonni dars oxirida sanaysiz.', ru: 'Ваш план сохранён: три этапа, с каналом и ожидаемым числом. Настоящее число посчитаете в конце урока.' })}</QXulosa></div>
            : <div className="fu-s5">
                {chiziq}
                {oklar}
                {karta}
                {ochiq == null && !saqlandi && n === 3 && <div className="fu-karta-tug"><QTugma className="fu-halqa" onClick={() => saqla(kartalar)}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>}
              </div>}
      >
        <MentorPracticeStats live={live} screen={screen} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen → QTest; ✔ A, INLINE_KEYS.s8 = 0; savol ustida kichik ikki sanoq kartasi — bo'sh) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    ustida={<SanoqKartalar kichik sanab={false} royxat={null} asosiy={null} />}
    questionText="Jadvalda 14 akkaunt: 3 tasi namuna va tekshiruv, 6 tasi sinfdosh. Qanday aytasiz?"
    question={tr({ uz: <h2 className="title h-ask">Jadvalda 14 akkaunt: 3 tasi namuna va tekshiruv, 6 tasi sinfdosh. <A>Qanday aytasiz?</A></h2>, ru: <h2 className="title h-ask">В таблице 14 аккаунтов: 3 — тестовые и проверочные, 6 — одноклассники. <A>Как скажете?</A></h2> })}
    options={[
      { uz: '11 kishi, shundan sinfdoshlar alohida aytiladi', ru: '11 человек, из них одноклассники называются отдельно' },
      { uz: '14 kishi, shundan sinfdoshlar alohida aytiladi', ru: '14 человек, из них одноклассники называются отдельно' },
      { uz: '5 kishi, chunki sinfdoshlar sanoqqa kirmaydi', ru: '5 человек, потому что одноклассники не считаются' },
      { uz: '11 kishi, sinfdoshlarni aytish shart emas', ru: '11 человек, одноклассников называть не обязательно' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Namuna va tekshiruv sanalmaydi; sinfdoshlar — alohida.', ru: 'Тестовые и проверочные не считаются; одноклассники — отдельно.' }}
    explainWrong={{
      1: { uz: 'Namuna va tekshiruv akkauntlari haqiqiy foydalanuvchimi?', ru: 'Тестовые и проверочные аккаунты — настоящие пользователи?' },
      2: { uz: "Sinfdoshlar ham ro'yxatdan o'tgan. Ular qanday aytiladi?", ru: 'Одноклассники тоже зарегистрировались. Как о них говорят?' },
      3: { uz: "Son to'g'ri. Nechtasi sinfdosh — eshitgan odam biladimi?", ru: 'Число верное. Сколько из них одноклассники — узнает ли слушатель?' },
      default: { uz: 'Namuna va tekshiruv sanalmaydi; sinfdoshlar — alohida.', ru: 'Тестовые и проверочные не считаются; одноклассники — отдельно.' }
    }} />
);

// ===== 🏅 BADGES (nishonlar) — qilingan ish uchun (§184); bonus ikkitasi — bloklar oxirgi «Bajardim»i (P-048) =====
const ACHIEVEMENTS = {
  estimateSpotter: { icon: '🎯', name: 'Estimate Spotter!', desc: { uz: 'Rejadagi son taxmin ekanini birinchi urinishda topdingiz', ru: 'С первой попытки поняли, что число в плане — предположение' } },
  stagePlanner: { icon: '🗺️', name: 'Stage Planner!', desc: { uz: '50 foydalanuvchiga uch bosqichli rejangizni yozdingiz', ru: 'Написали свой план из трёх этапов на 50 пользователей' } },
  dataMinimum: { icon: '🛡️', name: 'Data Minimum!', desc: { uz: "Ro'yxatdan o'tishda faqat keraklisini qoldirib, qadamlar sanog'ini yoqdingiz", ru: 'Оставили при регистрации только нужное и включили подсчёт шагов' } },
  launchReady: { icon: '🚀', name: 'Launch Ready!', desc: { uz: 'Maxfiylik siyosatini saytga chiqarib, ikki sonni sanadingiz', ru: 'Выложили политику конфиденциальности на сайт и посчитали два числа' } },
};
// Ekran id → nishon: s3 — birinchi urinishda to'g'ri · s5 — «Saqlash» · a1, a2 — oxirgi «Bajardim» (ish bajarilgan, tekin emas)
const ACH_TRIGGERS = { s3: 'estimateSpotter', s5: 'stagePlanner', a1: 'dataMinimum', a2: 'launchReady' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 8)
const Q_LABELS = {
  3: { uz: '1 — Kutilgan son', ru: '1 — Ожидаемое число' },
  8: { uz: '2 — Halol sanoq', ru: '2 — Честный подсчёт' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning o'z atamalari (MD «Fon so'zlari», R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'bosqich', ru: 'этап' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'kutilgan son', ru: 'ожидаемое число' }, l: 70, t: 8, s: 24, d: 23, dl: 1.5 },
  { ch: { uz: "ro'yxatdan o'tgan", ru: 'зарегистрировались' }, l: 6, t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: { uz: 'asosiy harakat', ru: 'основное действие' }, l: 66, t: 70, s: 22, d: 21, dl: 2.2 },
  { ch: { uz: 'login', ru: 'логин' }, l: 44, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'qurilma ID', ru: 'ID устройства' }, l: 58, t: 28, s: 22, d: 17, dl: 0.4 },
  { ch: 'APK', l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: "brauzer ko'rinishi", ru: 'браузерная версия' }, l: 18, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: { uz: 'lending', ru: 'лендинг' }, l: 84, t: 40, s: 22, d: 22, dl: 0.6 },
  { ch: { uz: 'post', ru: 'пост' }, l: 34, t: 58, s: 24, d: 24, dl: 1.4 },
  { ch: 'Maydon Jamoa', l: 76, t: 88, s: 20, d: 26, dl: 2.6 },
  { ch: '20', l: 90, t: 20, s: 26, d: 19, dl: 0.2 },
];
// ⚡ Mustahkamlash-jang — 12 savol, ✔ o'rni MD dagidek: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'Mentor rejasida 1-bosqich qayerdan boshlanadi?', ru: 'С чего начинается 1-й этап в плане Ментора?' }, opts: [{ uz: 'Sinf chati va mahalla futbol guruhidan', ru: 'С чата класса и футбольной группы махалли' }, { uz: "Shahar bo'yicha katta futbol kanalidan", ru: 'С большого городского футбольного канала' }, { uz: 'Notanish odamlarga shaxsiy xabardan', ru: 'С личных сообщений незнакомым' }, { uz: "Sotib olingan obunachilar ro'yxatidan", ru: 'Со списка купленных подписчиков' }], correct: 0 },
  { q: { uz: "Mentor misolida «asosiy harakatni qilgan» kim?", ru: 'Кто в примере Ментора «сделал основное действие»?' }, opts: [{ uz: 'Ilovani telefoniga o\'rnatib ochgan odam', ru: 'Тот, кто установил и открыл приложение' }, { uz: "O'yinga qo'shilgan yoki e'lon bergan odam", ru: 'Тот, кто присоединился к игре или объявил её' }, { uz: 'Lendingdagi tugmani bir marta bosgan odam', ru: 'Тот, кто один раз нажал кнопку на лендинге' }, { uz: "Postni o'qib, do'stiga yuborgan odam", ru: 'Тот, кто прочитал пост и переслал другу' }], correct: 1 },
  { q: { uz: "Mentor nega telefon raqamini so'ramaydigan qildi?", ru: 'Почему Ментор перестал спрашивать номер телефона?' }, opts: [{ uz: 'Raqamni yozish uzoq vaqt oladi', ru: 'Номер долго вводить' }, { uz: 'Raqamni hamma yoddan bilmaydi', ru: 'Не все помнят номер наизусть' }, { uz: 'Mahsulotga raqam kerak emas', ru: 'Продукту номер не нужен' }, { uz: "Raqam Database'ga sig'maydi", ru: 'Номер не помещается в Database' }], correct: 2 },
  { q: { uz: 'Bitta o\'yinchi ilovani ikki telefonda ochdi. `ochdi` da nechta qurilma?', ru: 'Один игрок открыл приложение на двух телефонах. Сколько устройств в `ochdi`?' }, opts: [{ uz: 'Bitta, chunki login bir xil', ru: 'Одно, потому что логин один' }, { uz: 'Bitta, chunki ism bir xil', ru: 'Одно, потому что имя одно' }, { uz: 'Uchta, chunki uch marta ochdi', ru: 'Три, потому что открыл три раза' }, { uz: 'Ikkita, chunki ikki qurilma', ru: 'Два, потому что два устройства' }], correct: 3 },
  { q: { uz: "Haqiqiy «ro'yxatdan o'tgan» soni qayerdan olinadi?", ru: 'Откуда берут настоящее число «зарегистрировавшихся»?' }, opts: [{ uz: "Database'dan, so'rov bilan", ru: 'Из Database, запросом' }, { uz: 'Rejada yozilgan kutilgan sondan', ru: 'Из ожидаемого числа в плане' }, { uz: 'Lendingdagi tashriflar sonidan', ru: 'Из числа визитов на лендинг' }, { uz: "Guruhdagi hamma a'zolar sonidan", ru: 'Из числа всех участников группы' }], correct: 0 },
  { q: { uz: "«Hisobni o'chirish» tasdiqlansa nima bo'ladi?", ru: 'Что произойдёт после подтверждения «Удалить аккаунт»?' }, opts: [{ uz: "Akkaunt qoladi, faqat parol o'chadi", ru: 'Аккаунт останется, удалится только пароль' }, { uz: "Akkaunt va qatnashuv yozuvlari o'chadi", ru: 'Удалятся аккаунт и записи об участии' }, { uz: "Ilova telefondan o'zi o'chib ketadi", ru: 'Приложение само удалится с телефона' }, { uz: "Hamma o'yinchilarning akkaunti o'chadi", ru: 'Удалятся аккаунты всех игроков' }], correct: 1 },
  { q: { uz: 'Maxfiylik sahifasidagi gapni nima bilan solishtirasiz?', ru: 'С чем сравниваете фразу на странице конфиденциальности?' }, opts: [{ uz: 'Agentning hisoboti bilan', ru: 'С отчётом агента' }, { uz: 'Boshqa ilova sahifasi bilan', ru: 'Со страницей другого приложения' }, { uz: 'Ilovangizning kodi bilan', ru: 'С кодом вашего приложения' }, { uz: 'Lending sarlavhasi bilan', ru: 'С заголовком лендинга' }], correct: 2 },
  { q: { uz: "Mentor misolida brauzer ko'rinishida hozircha nima yo'q?", ru: 'Чего пока нет в браузерной версии в примере Ментора?' }, opts: [{ uz: "O'yinlar ro'yxati", ru: 'Списка игр' }, { uz: "Qo'shilish tugmasi", ru: 'Кнопки присоединения' }, { uz: "Ro'yxatdan o'tish", ru: 'Регистрации' }, { uz: "O'yin eslatmasi", ru: 'Напоминания об игре' }], correct: 3 },
  { q: { uz: 'Agentga xato yuborganda nimani yuborasiz?', ru: 'Что отправляете агенту при ошибке?' }, opts: [{ uz: "Xato chiqqan qatorning o'zini", ru: 'Саму строку с ошибкой' }, { uz: '`.env` faylidagi hamma qiymatni', ru: 'Все значения из файла `.env`' }, { uz: 'Tokenni va xato chiqqan qatorni', ru: 'Токен и строку с ошибкой' }, { uz: 'Maxfiy kalitni va butun kodni', ru: 'Секретный ключ и весь код' }], correct: 0 },
  { q: { uz: 'Guruhga post yuborishdan oldin nima qilasiz?', ru: 'Что делаете перед отправкой поста в группу?' }, opts: [{ uz: 'Yangi akkaunt ochib olasiz', ru: 'Открываете новый аккаунт' }, { uz: "Guruh egasidan ruxsat so'raysiz", ru: 'Спрашиваете разрешения у владельца группы' }, { uz: "Postni o'nta guruhga tashlaysiz", ru: 'Кидаете пост в десять групп' }, { uz: "Postga telefon raqam qo'shasiz", ru: 'Добавляете в пост номер телефона' }], correct: 1 },
  { q: { uz: "`ochdi` hodisasi bilan Backend'ga nima boradi?", ru: 'Что уходит в Backend с событием `ochdi`?' }, opts: [{ uz: "Hodisa nomi va o'yinchi logini", ru: 'Имя события и логин игрока' }, { uz: "O'yinchi ismi va qurilma ID", ru: 'Имя игрока и ID устройства' }, { uz: 'Hodisa nomi va qurilma ID', ru: 'Имя события и ID устройства' }, { uz: "O'yinchi logini va parol hash", ru: 'Логин игрока и hash пароля' }], correct: 2 },
  { q: { uz: "Sinf chatidan keyin 12 kishi ro'yxatdan o'tdi, rejada 20 edi. Nima qilasiz?", ru: 'После чата класса зарегистрировались 12, в плане было 20. Что сделаете?' }, opts: [{ uz: 'Soxta akkaunt ochib, 20 ga yetkazasiz', ru: 'Откроете фейковые аккаунты и дотянете до 20' }, { uz: "O'zingiz yana sakkiz marta ro'yxatdan o'tasiz", ru: 'Сами зарегистрируетесь ещё восемь раз' }, { uz: 'Postni notanish guruhlarga tashlaysiz', ru: 'Кинете пост в незнакомые группы' }, { uz: "Sonni yozib, keyingi bosqichga o'tasiz", ru: 'Запишете число и перейдёте к следующему этапу' }], correct: 3 },
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
// Har blok 4 bo'lim, hammasi o'quvchining o'z repo'sida (5-bo'lim yo'q). steps [{ h, t (node), prompt?: { satrlar, namuna, toldir }, yordam?: [satr], qulf? }].
// Qolipda yo'q (qolip taklifi): {…} yonida kulrang «masalan: …», prompt ✎ tahriri, bo'lim ichidagi «Yordam», belgilar va tanlovlar, «Ulgurmasangiz» qatori, trek tanlovi — shu faylda (src/qolip ga tegilmaydi).
// Blok bayrog'i — faqat oxirgi (tekshiruv) «Bajardim»idan (tayanch 9.36 h); 3-bo'limdan keyin «Davom etish» ochiladi (E 55), bayroq qo'yilmaydi.
// Bo'lim ichida faqat <span> (QBlok matnni <p> ichida chizadi — <div>/<p> ichma-ich bo'lmasin).
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'cd maydon-jamoa', 'git checkout -f m12-dars-07-done'];
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
const Bq = ({ children, k }) => <span className={cxx('fu-band', k)}>{fmtCode(children)}</span>;
const FuPrompt = ({ satrlar, namuna = {}, toldir = {} }) => {
  const asl = satrlar.map(l => { let s = tr(l); Object.entries(toldir).forEach(([j, v]) => { if (v) s = s.split(j).join(v); }); return s; });
  const [tahrir, setTahrir] = useState(false);
  const [matn, setMatn] = useState(null);
  const [ok, setOk] = useState(false);
  const qator = matn != null ? matn.split('\n') : asl;
  const korildi = new Set();
  const joy = (t, li) => t.split(/(\{[^}]+\})/g).map((p, i) => {
    if (!/^\{.+\}$/.test(p)) return <React.Fragment key={li + '-' + i}>{fmtCode(p)}</React.Fragment>;
    const nm = namuna[p] && !korildi.has(p) ? namuna[p] : null;
    if (nm) korildi.add(p);
    return <React.Fragment key={li + '-' + i}><span className="q-joy">{p}</span>{nm && <span className="fu-joy-n">{fmtCode(tr(nm))}</span>}</React.Fragment>;
  });
  const nusxa = async () => { try { await navigator.clipboard.writeText(qator.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  return (
    <span className="q-prompt">
      <span className="q-prompt-h">
        <span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span>
        <span className="fu-prompt-tug">
          <button type="button" className="fu-prompt-ed" aria-expanded={tahrir} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })} onClick={() => { if (matn == null) setMatn(asl.join('\n')); setTahrir(x => !x); }}>✎</button>
          <button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button>
        </span>
      </span>
      {tahrir
        ? <textarea className="fu-prompt-ta" value={matn ?? ''} rows={10} aria-label={tr({ uz: 'Prompt matni', ru: 'Текст промпта' })} onChange={(e) => setMatn(e.target.value)} />
        : qator.map((l, i) => <span key={i} className="fu-ps">{joy(l, i)}</span>)}
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [o, setO] = useState(false);
  return (
    <>
      <QTugma ikkinchi className="fu-yordam-btn" aria-expanded={o} onClick={() => setO(x => !x)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      {o && <span className="fu-yordam-p fade-step"><span className="fu-yp-y">{tr({ uz: 'Mentor misoli', ru: 'пример Ментора' })}</span>{satrlar.map((l, i) => <span key={i} className="fu-yp">{fmtCode(tr(l))}</span>)}</span>}
    </>
  );
};
const TrekTanlov = ({ trek, onTanla }) => (trek ? null : (
  <div className="fu-trek fade-step"><span>{tr({ uz: 'Trekingiz:', ru: 'Ваш трек:' })}</span>
    <div className="fu-chorla">{[['mobil', { uz: 'Mobil trek', ru: 'Мобильный трек' }], ['web', { uz: 'Web-trek', ru: 'Веб-трек' }]].map(([k, t]) => <QChip key={k} onClick={() => onTanla(k)}>{tr(t)}</QChip>)}</div>
  </div>
));
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, eyebrow, title, mentor, steps, natija, doneText, ulgur, ulgurQadam = 3, ortda, ustida, pastQator }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam;
  const qulf = !done && !!(steps[stepN] && steps[stepN].qulf);
  const bajardim = () => {
    if (isMentorLive || done || qulf) return;
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
  // SABOQ 11: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, bo'limlar orasida keyingi bo'lim, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi bo'lim — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий раздел — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cxx('fu-blok', qulf && 'fu-qulf')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<><Mentor>{tr(mGap)}</Mentor>{ustida}</>} zoom={Zoomable}
          qadamlar={steps.map(c => ({
            h: tr(c.h),
            t: <>{c.t}{c.prompt && <FuPrompt satrlar={c.prompt.satrlar} namuna={c.prompt.namuna} toldir={c.prompt.toldir} />}</>,
            xato: c.yordam ? <Yordam satrlar={c.yordam} /> : null
          }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<MentorPracticeStats live={_live} screen={screen} />}>
          {pastQator}
          {ulgur && !done && <p className="fu-ulgur">{fmtCode(tr(ulgur))}</p>}
          {ortda && <p className="fu-ortda">{tr({ uz: 'Ortda qoldingizmi — Mentor misolini alohida papkada oching:', ru: 'Отстали — откройте пример Ментора в отдельной папке:' })} <code className="fu-buyruq">{ORTDA[0]}</code> · <code className="fu-buyruq">{ORTDA[1]}</code> · <code className="fu-buyruq">{ORTDA[2]}</code> {fmtCode(tr(ortda))}</p>}
        </QBlok>
      </div>
    </Stage>
  );
}
const WebQator = ({ children }) => <p className="fu-web"><b>{tr({ uz: 'Web-trek', ru: 'Веб-трек' })}:</b> {fmtCode(children)}</p>;

// ===== AMALIYOT 1 — ilova: ma'lumot va o'lchov (screens[6]; tayanch 1.7, 9.3) =====
const A1_PROMPT = [
  { uz: "Qayerda: ro'yxatdan o'tish va kirish — ilova ekranlari, Backend yo'llari va foydalanuvchilar jadvali; Backend'da yangi `hodisalar` jadvali va `POST /hodisalar`; ilovada yangi `hodisaYoz(nom)` funksiyasi.", ru: 'Где: регистрация и вход — экраны приложения, пути Backend и таблица пользователей; в Backend новая таблица `hodisalar` и `POST /hodisalar`; в приложении новая функция `hodisaYoz(nom)`.' },
  { uz: "Nima qilsin: 1) ro'yxatdan o'tishda mahsulotga kerak bo'lmagan shu ma'lumot so'ralmasin: {ortiqcha ma'lumot}. Kirish uchun alohida nom kerak bo'lsa — login: odam o'zi tanlagan nom (3–20 belgi, harf va raqam, takrorlanmaydi); login band bo'lsa — «Bu login band»; kirish — login va parol bilan.", ru: "Что сделать: 1) при регистрации пусть не спрашиваются эти ненужные продукту данные: {ortiqcha ma'lumot}. Если для входа нужно отдельное имя — логин: имя, которое человек выбирает сам (3–20 символов, буквы и цифры, не повторяется); если логин занят — «Bu login band»; вход — по логину и паролю." },
  { uz: "Forma ostiga gap: «Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.» va «Maxfiylik siyosati» havolasi — {lending manzili}/maxfiylik.html (sahifani keyin qo'shaman).", ru: "Под формой фраза: «Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.» и ссылка «Maxfiylik siyosati» — {lending manzili}/maxfiylik.html (страницу добавлю позже)." },
  { uz: "2) Foydalanuvchilar jadvaliga `namuna` (rost yoki yolg'on) va `yaratilgan` (ro'yxatdan o'tgan vaqt) ustunlarini qo'sh. Mavjud akkauntlar o'chmasin. Avval menga ro'yxat ko'rsat: har akkaunt, unga beriladigan login va olib tashlanadigan ustunlar — qaysilari namuna ekanini men aytaman va «Davom et» deyman; shundan keyingina namunalarga `namuna = true`, `yaratilgan` — hozirgi vaqt, keraksiz ustunni olib tashla; parollar o'zgarmasin. Forma orqali ro'yxatdan o'tgan har yangi akkaunt — `namuna = false`.", ru: '2) Добавь в таблицу пользователей столбцы `namuna` (истина или ложь) и `yaratilgan` (время регистрации). Существующие аккаунты не удалять. Сначала покажи мне список: каждый аккаунт, логин, который ему дадут, и удаляемые столбцы — какие из них тестовые, скажу я и напишу «Davom et»; только после этого тестовым `namuna = true`, `yaratilgan` — текущее время, ненужный столбец удали; пароли не менять. Каждый новый аккаунт через форму — `namuna = false`.' },
  { uz: "3) «Hisobdan chiqish» yoniga «Hisobni o'chirish»: avval «Rostdan o'chirasizmi?» deb so'rasin; tasdiqlansa shu akkaunt o'chsin — `DELETE` faqat `WHERE` bilan, shu akkaunt `id` si bo'yicha. Unga tegishli qaysi yozuvlar o'chishi va qaysilari qolishini avval menga ro'yxat qilib ko'rsat — men tasdiqlagach bajar.", ru: "3) Рядом с «Hisobdan chiqish» — «Hisobni o'chirish»: сначала спросить «Rostdan o'chirasizmi?»; при подтверждении удалить этот аккаунт — `DELETE` только с `WHERE`, по `id` этого аккаунта. Какие связанные записи удалятся, а какие останутся, сначала покажи мне списком — выполни после моего подтверждения." },
  { uz: "4) Qadamlar sanog'i: `hodisalar` jadvali (`id`, `nom`, `qurilma_id`, `yaratilgan`); `POST /hodisalar { nom, qurilma_id }` — `nom` faqat «Qadamlar» qatoridagi nomlardan biri, aks holda `400`. Ilovada `hodisaYoz(nom)`: qurilma ID — birinchi ochilishda yaratiladigan tasodifiy harf va raqamlar, qurilmada saqlanadi. Qadamlar: {qadamlar}. Har hodisa ish muvaffaqiyatli tugagandan keyin yozilsin; ilovaning bitta ochilishiga bitta hodisa. 60 kundan eski hodisalar o'chirilsin — Backend ishga tushganda va keyin har 24 soatda, `WHERE` bilan.", ru: '4) Подсчёт шагов: таблица `hodisalar` (`id`, `nom`, `qurilma_id`, `yaratilgan`); `POST /hodisalar { nom, qurilma_id }` — `nom` только одно из имён строки «Qadamlar», иначе `400`. В приложении `hodisaYoz(nom)`: ID устройства — случайные буквы и цифры, создаются при первом открытии, хранятся на устройстве. Qadamlar: {qadamlar}. Каждое событие пишется после успешного завершения действия; на одно открытие приложения — одно событие. События старше 60 дней удалять — при запуске Backend и потом каждые 24 часа, с `WHERE`.' },
  { uz: "Nima buzilmasin: hodisa bilan ism, login va token yuborilmasin — faqat qadam nomi va qurilma ID; so'rov o'tmasa ham ilova ishlayversin, foydalanuvchiga xato ko'rsatilmasin. Qolgan ekranlar va yo'llar avvalgidek ishlasin, boshqa odamlarning yozuvlari o'chmasin. `.env` ga tegma. Tekshiruv uchun akkaunt yaratsang — `namuna = true` bilan, `id` larini ayt va ishdan keyin faqat shularni o'chir. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не должно сломаться: с событием не отправлять имя, логин и токен — только имя шага и ID устройства; если запрос не прошёл, приложение работает дальше, пользователю ошибку не показывать. Остальные экраны и пути работают как раньше, записи других людей не удаляются. `.env` не трогай. Если создашь аккаунт для проверки — с `namuna = true`, назови их `id` и после работы удали только их. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_NAMUNA = {
  '{qadamlar}': { uz: "masalan: ilova ochilganda — `ochdi`; ro'yxatdan o'tganda — `royxatdan-otdi`; asosiy harakatdan keyin — … Bu kursda nomlar kichik harf va chiziqcha bilan, bo'lib o'tgan ish ma'nosida.", ru: 'например: при открытии приложения — `ochdi`; после регистрации — `royxatdan-otdi`; после основного действия — … В этом курсе имена строчными буквами и через дефис, в значении совершённого действия.' },
  "{ortiqcha ma'lumot}": { uz: "masalan: telefon raqami (SMS yuborilmaydi); hech biri ortiqcha bo'lmasa — «yo'q».", ru: 'например: номер телефона (SMS не отправляются); если лишнего нет — «нет».' }
};
const A1_YORDAM = [
  { uz: "Qayerda: `mobil/` — «Ro'yxatdan o'tish» va «Kirish» ekranlari, «Hisobdan chiqish» turgan joy; `backend/` — `POST /royxat`, `POST /kirish`, `oyinchilar` jadvali; yangi `hodisalar` jadvali va `POST /hodisalar`; `mobil/` da yangi `hodisaYoz(nom)`.", ru: "Где: `mobil/` — экраны «Ro'yxatdan o'tish» и «Kirish», место кнопки «Hisobdan chiqish»; `backend/` — `POST /royxat`, `POST /kirish`, таблица `oyinchilar`; новая таблица `hodisalar` и `POST /hodisalar`; в `mobil/` новая `hodisaYoz(nom)`." },
  { uz: "Nima qilsin: 1) telefon raqami so'ralmasin. `oyinchilar` da `telefon` o'rniga `login`: 3–20 belgi, harf va raqam, noyob. `POST /royxat { ism, login, parol }`, `POST /kirish { login, parol }`; login band bo'lsa — `409` «Bu login band».", ru: 'Что сделать: 1) номер телефона не спрашивать. В `oyinchilar` вместо `telefon` — `login`: 3–20 символов, буквы и цифры, уникальный. `POST /royxat { ism, login, parol }`, `POST /kirish { login, parol }`; если логин занят — `409` «Bu login band».' },
  { uz: "Forma ostiga: «Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.» va «Maxfiylik siyosati» havolasi — {lending manzili}/maxfiylik.html.", ru: "Под формой: «Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.» и ссылка «Maxfiylik siyosati» — {lending manzili}/maxfiylik.html." },
  { uz: "2) `oyinchilar` ga `namuna` (rost yoki yolg'on) va `yaratilgan` ustunlari. Mavjud akkauntlar o'chmasin. Avval ro'yxatni ko'rsat: har akkaunt va unga ismidan beriladigan login (`ali` kabi, kichik harf; takrorlansa oxiriga raqam); men «Davom et» deganimdan keyin hammasiga `namuna = true`, `yaratilgan` — hozirgi vaqt, `telefon` ustunini qiymatlari bilan olib tashla; parollar o'zgarmasin. `POST /royxat` har doim `namuna = false` yozsin.", ru: '2) В `oyinchilar` столбцы `namuna` (истина или ложь) и `yaratilgan`. Существующие аккаунты не удалять. Сначала покажи список: каждый аккаунт и логин из его имени (как `ali`, строчными; при повторе — цифра в конце); после моего «Davom et» всем `namuna = true`, `yaratilgan` — текущее время, столбец `telefon` удали вместе со значениями; пароли не менять. `POST /royxat` всегда пишет `namuna = false`.' },
  { uz: "3) «Hisobdan chiqish» yoniga «Hisobni o'chirish»: «Rostdan o'chirasizmi?» deb so'rasin; tasdiqlansa shu akkaunt va uning `ishtirokchilar` dagi yozuvlari o'chsin — `DELETE` faqat `WHERE oyinchi_id = …` bilan; o'yindan chiqqandagi kabi son yangilansin. U e'lon qilgan o'yinlar o'chmasin — tashkilotchisi bo'sh qolsin; bunday o'yinlar ro'yxatda va «O'yin» ekranida xatosiz ko'rinsin. «Hisobdan chiqish» va «Hisobni o'chirish» da shu telefondagi rejalashtirilgan eslatmalar bekor bo'lsin.", ru: "3) Рядом с «Hisobdan chiqish» — «Hisobni o'chirish»: спросить «Rostdan o'chirasizmi?»; при подтверждении удалить аккаунт и его записи в `ishtirokchilar` — `DELETE` только с `WHERE oyinchi_id = …`; число обновить, как при выходе из игры. Объявленные им игры не удалять — организатор остаётся пустым; такие игры показывать в списке и на экране «O'yin» без ошибок. При «Hisobdan chiqish» и «Hisobni o'chirish» отменить запланированные напоминания на этом телефоне." },
  { uz: "4) `hodisalar` jadvali — `id`, `nom` (matn), `qurilma_id` (matn), `yaratilgan`. `POST /hodisalar { nom, qurilma_id }`: `nom` faqat `ochdi`, `royxatdan-otdi`, `qoshildi` yoki `tasdiqladi`, aks holda `400`. Ilovada `hodisaYoz(nom)`: qurilma ID — birinchi ochilishda yaratiladigan tasodifiy harf va raqamlar, qurilmada saqlanadi.", ru: '4) Таблица `hodisalar` — `id`, `nom` (текст), `qurilma_id` (текст), `yaratilgan`. `POST /hodisalar { nom, qurilma_id }`: `nom` только `ochdi`, `royxatdan-otdi`, `qoshildi` или `tasdiqladi`, иначе `400`. В приложении `hodisaYoz(nom)`: ID устройства — случайные буквы и цифры, создаются при первом открытии, хранятся на устройстве.' },
  { uz: "To'rt joyda chaqirilsin: ilova ochilganda (bitta ochilishga bitta) — `ochdi`; ro'yxatdan o'tish muvaffaqiyatli bo'lganda — `royxatdan-otdi`; «Qo'shilaman» muvaffaqiyatli bo'lganda — `qoshildi`; «Kelaman» muvaffaqiyatli bo'lganda — `tasdiqladi`. 60 kundan eski hodisalar o'chirilsin — Backend ishga tushganda va keyin har 24 soatda, `WHERE` bilan.", ru: "Вызывать в четырёх местах: при открытии приложения (одно на открытие) — `ochdi`; при успешной регистрации — `royxatdan-otdi`; при успешном «Qo'shilaman» — `qoshildi`; при успешном «Kelaman» — `tasdiqladi`. События старше 60 дней удалять — при запуске Backend и потом каждые 24 часа, с `WHERE`." },
  { uz: "Nima buzilmasin: o'yinlar, qo'shilish, tasdiq, chiqish, navbat, real vaqt ulanishi va eslatma avvalgidek ishlasin; hodisa bilan ism, login va token yuborilmasin; so'rov o'tmasa ham ilova ishlayversin. `.env` ga tegma. Tekshiruv uchun akkaunt yaratsang — `namuna = true` bilan, `id` larini ayt va ishdan keyin faqat shularni o'chir. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не должно сломаться: игры, присоединение, подтверждение, выход, очередь, соединение в реальном времени и напоминание работают как раньше; с событием не отправлять имя, логин и токен; если запрос не прошёл, приложение работает дальше. `.env` не трогай. Если создашь аккаунт для проверки — с `namuna = true`, назови их `id` и после работы удали только их. Больше ничего не трогай, назови изменённые файлы.' },
  { uz: "Ilovangizda ro'yxatdan o'tish yo'q bo'lsa — 1, 2 va 3-bandni o'chiring, 4-band qoladi. Qaysi ma'lumot ortiqcha ekanini birinchi qavsga o'zingiz yozasiz — login ham faqat kerak bo'lsa.", ru: 'Если в вашем приложении нет регистрации — удалите пункты 1, 2 и 3, пункт 4 остаётся. Какие данные лишние, вы сами пишете в первые скобки — логин тоже только если нужен.' },
  { uz: "Web-trek: «qurilma ID» o'rnida brauzer ID — 10-Moduldagidek (`brauzer_id`, brauzer xotirasida); «Hisobni o'chirish» — saytdagi akkaunt bo'limida; qadamlar — saytingizdagi 3–5 qadam.", ru: 'Веб-трек: вместо «ID устройства» — браузерный ID, как в 10-м модуле (`brauzer_id`, в памяти браузера); «Hisobni o\'chirish» — в разделе аккаунта на сайте; шаги — 3–5 шагов на вашем сайте.' }
];
const NatijaA1 = ({ trek }) => {
  const [f, setF] = useState(() => (kamHarakat() ? 4 : 0));
  useEffect(() => {
    if (kamHarakat()) return undefined;
    const ts = [setTimeout(() => setF(1), 1400), setTimeout(() => setF(2), 3600), setTimeout(() => setF(3), 4600), setTimeout(() => setF(4), 6400)];
    return () => ts.forEach(clearTimeout);
  }, []);
  const tel = f === 2 || f === 3 ? <ItTelefon ekran="hisob" sorov={f === 3} /> : <ItTelefon ekran="royxat" login={f >= 1} gap={f >= 1} siyosat={f >= 1} />;
  return (
    <div className="fu-natija">
      <div className="fu-natija-q">
        {tel}
        <div className="fu-neon">
          <b className="fu-neon-h">Neon · SQL Editor</b>
          <code>SELECT login, namuna FROM oyinchilar;</code>
          <span className="fu-neon-r">ali · true</span>
          <span className="fu-neon-r">tekshiruv1 · false</span>
          <code>SELECT nom, COUNT(DISTINCT qurilma_id) …</code>
          <span className="fu-neon-r">ochdi 1 · royxatdan-otdi 1 · qoshildi 1</span>
        </div>
      </div>
      {trek !== 'web' && <div className="fu-term"><code>eas build -p android --profile preview</code><span className="fu-term-k">{tr({ uz: 'navbatda · sahifa havolasi', ru: 'в очереди · ссылка на страницу' })}</span></div>}
    </div>
  );
};
const ScreenA1 = (props) => {
  const [trek, setTrek] = useState(trekOl);
  const [tk, setTk] = useState(() => rejaOl().tekshiruv);
  const [lend] = useState(() => lsO(LEND_KEY));
  const manzil = lend && typeof lend.manzil === 'string' && lend.manzil.trim() ? lend.manzil.trim().replace(/\/+$/, '') : '';
  const tanla = (t) => { trekYoz(t); setTrek(t); };
  const bel = (k) => { const n = rejaYoz({ tekshiruv: { [k]: !tk[k] } }); setTk(n.tekshiruv); };
  const mobil = trek !== 'web', web = trek !== 'mobil';
  const steps = [
    { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>
      <Bq k="bir">{tr({ uz: "Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: o'zgargan fayl yo'q, `.env` ro'yxatda ko'rinmaydi.", ru: 'Откройте свой репозиторий в Antigravity. В терминале `git status`: изменённых файлов нет, `.env` в списке не виден.' })}</Bq>
      <Bq>{tr({ uz: "Ro'yxatdan o'tish formangizni oching va har qatorga savol bering: mahsulot shusiz ishlaydimi? Mentor misolida telefon raqami kerak emas — SMS yuborilmaydi; talab uni login bilan almashtiradi. Sizning mahsulotingizda nima ortiqcha ekanini o'zingiz hal qilasiz — uni promptdagi birinchi qavsga yozasiz.", ru: 'Откройте свою форму регистрации и задайте вопрос каждой строке: работает ли продукт без неё? В примере Ментора номер телефона не нужен — SMS не отправляются; требование заменяет его логином. Что лишнее в вашем продукте, решаете вы — это пишете в первые скобки промпта.' })}</Bq>
      <Bq>{tr({ uz: "Keyin mahsulotingizda odam ochgandan asosiy harakatgacha bosib o'tadigan qadamlarni yozib oling — uchtadan beshtagacha. Mentor misolida to'rtta: ochdi · ro'yxatdan o'tdi · qo'shildi · kelishini tasdiqladi.", ru: 'Потом запишите шаги, которые человек проходит в вашем продукте от открытия до основного действия, — от трёх до пяти. В примере Ментора четыре: открыл · зарегистрировался · присоединился · подтвердил приход.' })}</Bq>
      <Bq>{tr({ uz: "10-Moduldagi hodisalar tizimi — jadval, `POST /hodisalar`, `hodisaYoz` — bugun final mahsulotingizga ko'chadi.", ru: 'Система событий из 10-го модуля — таблица, `POST /hodisalar`, `hodisaYoz` — сегодня переезжает в ваш финальный продукт.' })}</Bq>
    </> },
    { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>
      <Bq k="bir">{tr({ uz: "`{qadamlar}` qavsini to'ldiring (kulrang namunaga qarang), «Nusxalash»ni bosing, Antigravity'ga yuboring. `{lending manzili}` 1-darsdagi yozuvingizdan o'zi qo'yiladi (yo'q bo'lsa — o'zingiz yozasiz):", ru: 'Заполните скобки `{qadamlar}` (смотрите серый пример), нажмите «Скопировать», отправьте в Antigravity. `{lending manzili}` подставляется сам из вашей записи на 1-м уроке (если её нет — пишете сами):' })}</Bq>
    </>, prompt: { satrlar: A1_PROMPT, namuna: A1_NAMUNA, toldir: manzil ? { '{lending manzili}': manzil } : {} }, yordam: A1_YORDAM },
    { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: <>
      <Bq k="bir">{tr({ uz: "agent avval ikki ro'yxatni ko'rsatadi: akkauntlar (beriladigan login, olib tashlanadigan ustun) va hisob o'chirilganda nima o'chishi. Tekshirib, qaysilari namuna ekanini ayting va «Davom et» deb yozing — agent taxmin qilmaydi.", ru: 'агент сначала покажет два списка: аккаунты (выдаваемый логин, удаляемый столбец) и что удалится при удалении аккаунта. Проверьте, скажите, какие из них тестовые, и напишите «Davom et» — агент не угадывает.' })}</Bq>
      <Bq>{tr({ uz: '`git diff`: o\'zgarish agent aytgan fayllardami. Keyin `git status` → har faylni `git add <fayl>` bilan → `git commit -m "7-dars: login, hisobni o\'chirish, qadamlar sanog\'i"` → `git push`;', ru: '`git diff`: изменения в файлах, которые назвал агент? Потом `git status` → каждый файл через `git add <fayl>` → `git commit -m "7-dars: login, hisobni o\'chirish, qadamlar sanog\'i"` → `git push`;' })}</Bq>
      <Bq>{tr({ uz: "Render sahifangizda yangi deploy tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Mobil trekda `npx expo start`, QR'ni Expo Go bilan oching (bitta Wi-Fi; bo'lmasa `--tunnel`); web-trekda `npm run dev`.", ru: 'На странице Render дождитесь окончания нового deploy (может занять несколько минут). В мобильном треке `npx expo start`, откройте QR в Expo Go (одна Wi-Fi; иначе `--tunnel`); в веб-треке `npm run dev`.' })}</Bq>
      <Bq>{tr({ uz: "Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Shu xato chiqdi: {xato}. Tuzat.»' })}</Bq>
    </> },
    { h: { uz: 'Tekshirish', ru: 'Проверка' }, qulf: !tk.malumot, t: <>
      <Bq k="bir">{tr({ uz: 'agent nima desa ham, o\'zingiz tekshiring:', ru: 'что бы ни сказал агент, проверьте сами:' })}</Bq>
      <Bq>{tr({ uz: "(1) «Hisobdan chiqish» → «Ro'yxatdan o'tish»: telefon so'ralmaydi, forma ostida gap va «Maxfiylik siyosati» havolasi bor (sahifaning o'zi Amaliyot 2 da qo'shiladi). Ism `tekshiruv`, login `tekshiruv1` bilan ro'yxatdan o'ting — bu tekshiruv akkaunti, haqiqiy odamniki emas.", ru: '(1) «Выйти из аккаунта» → «Регистрация»: телефон не спрашивается, под формой есть фраза и ссылка «Политика конфиденциальности» (сама страница добавится в Практике 2). Зарегистрируйтесь с именем `tekshiruv` и логином `tekshiruv1` — это проверочный аккаунт, не настоящего человека.' })}</Bq>
      <Bq k="ich">{tr({ uz: "O'sha login bilan yana urinib ko'ring: «Bu login band» chiqishi kerak. Keyin asosiy harakatni qiling (Mentor misolida — «Qo'shilaman»).", ru: 'Попробуйте ещё раз с тем же логином: должно появиться «Bu login band». Потом сделайте основное действие (в примере Ментора — «Присоединяюсь»).' })}</Bq>
      <Bq>{tr({ uz: "(2) Neon SQL Editor'da: `SELECT login, namuna FROM oyinchilar;` → «Run»: siz namuna degan akkauntlar yonida `true`, `tekshiruv1` yonida `false` bo'lishi kerak. So'ng `SELECT nom, COUNT(DISTINCT qurilma_id) FROM hodisalar GROUP BY nom;` — bosib o'tgan har qadam yonida 1.", ru: '(2) В Neon SQL Editor: `SELECT login, namuna FROM oyinchilar;` → «Run»: рядом с аккаунтами, которые вы назвали тестовыми, — `true`, рядом с `tekshiruv1` — `false`. Затем `SELECT nom, COUNT(DISTINCT qurilma_id) FROM hodisalar GROUP BY nom;` — рядом с каждым пройденным шагом 1.' })}</Bq>
      <Bq>{tr({ uz: "(3) «Hisobni o'chirish» → «Rostdan o'chirasizmi?» → tasdiqlang. `SELECT * FROM oyinchilar WHERE login = 'tekshiruv1';` — javob bo'sh bo'lishi kerak; tekshiruv akkaunti o'zini o'chirdi, qo'lda `DELETE` yozmaysiz.", ru: "(3) «Удалить аккаунт» → «Точно удалить?» → подтвердите. `SELECT * FROM oyinchilar WHERE login = 'tekshiruv1';` — ответ должен быть пустым; проверочный аккаунт удалил себя сам, `DELETE` вручную не пишете." })}</Bq>
      <Bq k="ich">{tr({ uz: "Tekshiruv hodisalari: `SELECT DISTINCT qurilma_id FROM hodisalar;` — hozircha faqat o'z qurilmangiz; uni nusxalab: `DELETE FROM hodisalar WHERE qurilma_id = '{qurilma ID}';` — jadval bo'sh, o'lchov odamlar uchun tayyor.", ru: "Проверочные события: `SELECT DISTINCT qurilma_id FROM hodisalar;` — пока только ваше устройство; скопируйте его: `DELETE FROM hodisalar WHERE qurilma_id = '{qurilma ID}';` — таблица пустая, измерение готово для людей." })}</Bq>
      <span className="fu-belgilar">
        <span className="fu-belgi-y">{tr({ uz: 'Belgilang (o\'zingiz):', ru: 'Отметьте (сами):' })}</span>
        <span className={cxx('fu-belgi-g', !tk.malumot && 'fu-chorla')}>
          <QChip holat={tk.malumot ? 'ok' : undefined} onClick={() => bel('malumot')}>{tk.malumot ? '✓ ' : ''}{tr({ uz: "Ma'lumot: (1) va (3) o'tdi", ru: 'Данные: (1) и (3) прошли' })}</QChip>
          <QChip holat={tk.olchov ? 'ok' : undefined} onClick={() => bel('olchov')}>{tk.olchov ? '✓ ' : ''}{tr({ uz: "O'lchov: (2) o'tdi", ru: 'Измерение: (2) прошло' })}</QChip>
        </span>
      </span>
      {mobil && <>
        <Bq>{tr({ uz: "Mobil trekda — o'rnatish faylini tayyorlash (oxirgi ish; faqat (1) o'tgandan keyin): `eas.json` dagi `preview` profilida `env` → `EXPO_PUBLIC_API_URL` bormi? Bo'lmasa agentga: «`eas.json` dagi `preview` profiliga `env` qo'sh: `EXPO_PUBLIC_API_URL` — qiymati `mobil/.env` dagidek (u maxfiy emas). Boshqa qiymat qo'shma.»", ru: 'В мобильном треке — подготовка файла установки (последнее дело; только после того, как (1) прошло): в профиле `preview` в `eas.json` есть `env` → `EXPO_PUBLIC_API_URL`? Если нет, агенту: «`eas.json` dagi `preview` profiliga `env` qo\'sh: `EXPO_PUBLIC_API_URL` — qiymati `mobil/.env` dagidek (u maxfiy emas). Boshqa qiymat qo\'shma.»' })}</Bq>
        <Bq>{tr({ uz: "Keyin `cd mobil` → `eas build -p android --profile preview`. Terminal fayl tayyor bo'lishini kutib turadi — kutish shart emas: u bergan sahifa havolasini saqlab qo'ying va Amaliyot 2 ga o'ting (Mentor misolida navbat ≈25 daqiqa bo'lgan; sizda boshqacha bo'lishi mumkin).", ru: 'Потом `cd mobil` → `eas build -p android --profile preview`. Терминал ждёт, пока файл будет готов, — ждать не обязательно: сохраните ссылку на страницу, которую он дал, и переходите к Практике 2 (в примере Ментора очередь ≈25 минут; у вас может быть иначе).' })}</Bq>
        <Bq>{tr({ uz: "Keyin ilovada xato topilib tuzatilsa — fayl qayta tayyorlanadi: tayyor fayl o'zi yangilanmaydi.", ru: 'Если потом в приложении найдут и исправят ошибку — файл готовят заново: готовый файл сам не обновляется.' })}</Bq>
      </>}
    </> }
  ];
  return (
    <ScreenBlok {...props} steps={steps}
      eyebrow={{ uz: "Amaliyot 1 · ma'lumot va o'lchov", ru: 'Практика 1 · данные и измерение' }}
      title={{ uz: <>Ilovangiz keraklisini so'rasin, <A>qadamlarni sanasin.</A></>, ru: <>Пусть приложение спрашивает нужное <A>и считает шаги.</A></> }}
      mentor={{ uz: "Talab tayyor — qavs ichiga mahsulotingiz qadamlarini yozasiz, oxirida o'rnatish fayli tayyorlana boshlaydi. «1 · Ochish»dan boshlang.", ru: 'Требование готово — в скобки впишете шаги своего продукта, в конце начнёт готовиться файл установки. Начните с «1 · Открыть».' }}
      ustida={<TrekTanlov trek={trek} onTanla={tanla} />}
      natija={<NatijaA1 trek={trek} />}
      doneText={trek === 'web' ? { uz: 'Saytingiz faqat keraklisini so\'raydi va qadamlarni sanaydi.', ru: 'Ваш сайт спрашивает только нужное и считает шаги.' } : { uz: "Ilovangiz faqat keraklisini so'raydi va qadamlarni sanaydi; o'rnatish fayli navbatda.", ru: 'Ваше приложение спрашивает только нужное и считает шаги; файл установки в очереди.' }}
      ulgur={{ uz: "Vaqt tugayaptimi — push'dan keyin avval (1) ni tekshiring (ro'yxatdan o'tish, «Bu login band», asosiy harakat); o'tsa — o'rnatish faylini boshlang, (2)–(3) — navbat paytida. Xato topilsa — fayl qayta tayyorlanadi. Agent ishi tugamagan bo'lsa — fayl, havola va post uyga qoladi (yakun shuni aytadi).", ru: 'Время кончается — после push сначала проверьте (1) (регистрация, «Bu login band», основное действие); если прошло — запускайте файл установки, (2)–(3) — во время очереди. Если найдётся ошибка — файл готовят заново. Если агент не закончил — файл, ссылка и пост остаются на дом (итог это скажет).' }}
      pastQator={web && <WebQator>{tr({ uz: "o'sha talab — «ilova» o'rnida saytingiz, qurilma ID o'rnida brauzer ID; ishga tushirish `npm run dev`, tekshirish — brauzerda; o'rnatish fayli yo'q — 4-bo'lim (3) dan keyin «Bajardim».", ru: 'то же требование — вместо «приложения» ваш сайт, вместо ID устройства браузерный ID; запуск `npm run dev`, проверка — в браузере; файла установки нет — после (3) раздела 4 «Готово».' })}</WebQator>}
      ortda={{ uz: "(faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz, o'z repo'ngizdagi bo'limni shunga qarab qaytarasiz (`mobil/.env` ga o'z Render manzilingizni yozasiz; o'rnatish faylini o'z Expo akkauntingizda tayyorlaysiz).", ru: '(только в этой новой папке — команда стирает изменения в папке) — увидите, как это работает, и повторите раздел в своём репозитории по образцу (в `mobil/.env` впишете свой адрес Render; файл установки готовите в своём аккаунте Expo).' }} />
  );
};

// ===== AMALIYOT 2 — siyosat va havola (screens[7]; o'rnatish fayli navbatda turgan paytda; tayanch 1.7, 9.3) =====
const A2_PROMPT = [
  { uz: "Qayerda: `lending/` — yangi `maxfiylik.html` va «Qanday qo'shilaman» bo'limi; ilovaning brauzer ko'rinishi; Backend — qaysi manzillardan so'rov qabul qilinishi.", ru: "Где: `lending/` — новый `maxfiylik.html` и раздел «Qanday qo'shilaman»; браузерная версия приложения; Backend — с каких адресов принимаются запросы." },
  { uz: "Nima qilsin: 1) `lending/maxfiylik.html` — maxfiylik siyosati, to'rt savol: qaysi ma'lumot · nima uchun · kim ko'radi · qancha saqlanadi. «Qaysi ma'lumot», «kim ko'radi» va «qancha saqlanadi» javoblarini koddan top va qaysi faylga qarab yozganingni ayt; kodda yo'q narsani yozma — koddan bilib bo'lmaydigan joyni (masalan, Database'ni kim ko'radi) «[savol]» deb qoldir, uni men yozaman.", ru: 'Что сделать: 1) `lending/maxfiylik.html` — политика конфиденциальности, четыре вопроса: какие данные · зачем · кто видит · сколько хранится. Ответы «какие данные», «кто видит» и «сколько хранится» найди в коде и скажи, по какому файлу писал; чего нет в коде, не пиши — место, которое из кода не узнать (например, кто видит Database), оставь как «[savol]», его напишу я.' },
  { uz: 'Nima uchun: {nima uchun}', ru: 'Nima uchun: {nima uchun}' },
  { uz: "2) Ilova brauzerda ham ochilsin (`npx expo export -p web`, natija `dist` papkasida): brauzerda token `localStorage` da saqlansin, eslatma brauzerda rejalashtirilmasin; `public/_redirects` fayliga `/*    /index.html   200`. Brauzer uchun paket yetishmasa — `npx expo install` bilan qo'sh va qaysi paket ekanini ayt.", ru: '2) Пусть приложение открывается и в браузере (`npx expo export -p web`, результат в папке `dist`): в браузере токен хранится в `localStorage`, напоминание в браузере не планируется; в файл `public/_redirects` — `/*    /index.html   200`. Если для браузера не хватает пакета — добавь через `npx expo install` и скажи, какой пакет.' },
  { uz: "3) «Qanday qo'shilaman» bo'limiga ikki havola tayyorla: «Android: ilovani o'rnatish» va «iPhone: brauzerda ochish» — manzillarni keyin aytaman. Ostiga ikki qator: «Android o'rnatishda ogohlantirish ko'rsatadi — ilova do'kondan emas, to'g'ridan-to'g'ri o'rnatiladi.» va «iPhone'da eslatma hozircha yo'q.» Manzili hali yo'q havola o'rnida eski qator qolsin.", ru: "3) В раздел «Qanday qo'shilaman» подготовь две ссылки: «Android: ilovani o'rnatish» и «iPhone: brauzerda ochish» — адреса скажу позже. Под ними две строки: «Android o'rnatishda ogohlantirish ko'rsatadi — ilova do'kondan emas, to'g'ridan-to'g'ri o'rnatiladi.» и «iPhone'da eslatma hozircha yo'q.» На месте ссылки без адреса пусть остаётся старая строка." },
  { uz: "Nima buzilmasin: telefondagi ilova avvalgidek ishlasin — token telefonda oldingi joyida, eslatma telefonda ishlayversin; lending sarlavhasi, foydalar, «Qo'shilmoqchiman» tugmasi va Umami o'zgarmasin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: "Что не должно сломаться: приложение на телефоне работает как раньше — токен на телефоне на прежнем месте, напоминание на телефоне работает; заголовок лендинга, пользы, кнопка «Qo'shilmoqchiman» и Umami не меняются. `.env` не трогай. Больше ничего не трогай, назови изменённые файлы." }
];
const A2_YORDAM = [
  { uz: "Nima uchun: Ism — o'yindagi o'yinchilar bir-birini tanishi uchun. Login va parol — hisobga kirish uchun. Qadamlar sanog'i — ilovaning qaysi joyi tushunarsizligini bilish uchun.", ru: "Nima uchun: Ism — o'yindagi o'yinchilar bir-birini tanishi uchun. Login va parol — hisobga kirish uchun. Qadamlar sanog'i — ilovaning qaysi joyi tushunarsizligini bilish uchun." },
  { uz: "Web-trek: 2 va 3-bandlarni o'chiring — lendingdagi asosiy tugma saytingizga olib boradi (1-darsdan shunday).", ru: 'Веб-трек: удалите пункты 2 и 3 — главная кнопка лендинга ведёт на ваш сайт (так с 1-го урока).' }
];
const A2_POST_YORDAM = [{ uz: "Maydon Jamoa chiqdi. Shanba, 18:00 o'yini ilovada turibdi — «Qo'shilaman» ni bosing, nechta odam yig'ilgani ko'rinadi. Android va iPhone uchun havola: {lending manzili}", ru: 'Maydon Jamoa вышел. Игра в субботу, 18:00, уже в приложении — нажмите «Присоединяюсь», видно, сколько людей собралось. Ссылка для Android и iPhone: {lending manzili}' }];
// Xavfsizlik ro'yxati — 6-dars bilan bitta matn (tayanch 1.6, 9.12 — so'zma-so'z)
const XAVFSIZLIK = [
  { uz: 'Faqat o\'zim a\'zo bo\'lgan joyga yuboraman.', ru: 'Отправляю только туда, где я участник.' },
  { uz: "Guruhga yuborishdan oldin egasidan ruxsat so'radim.", ru: 'Перед отправкой в группу спросил разрешения у владельца.' },
  { uz: "Postda familiya, maktab raqami, telefon va uy manzili yo'q.", ru: 'В посте нет фамилии, номера школы, телефона и домашнего адреса.' },
  { uz: "Postni yuborishdan oldin ota-onamga ko'rsatdim.", ru: 'Перед отправкой показал пост родителям.' },
  { uz: "Bitta xabarni ko'p guruhga tashlamayman, notanish odamga shaxsiy xabar yozmayman.", ru: 'Не рассылаю одно сообщение во много групп, не пишу личные сообщения незнакомым.' },
  { uz: 'Soxta akkaunt va sotib olingan obunachi ishlatmayman.', ru: 'Не использую фейковые аккаунты и купленных подписчиков.' }
];
const XAVF_OSTI = { uz: 'Uchrashuv taklifi kelsa — faqat kattalar bilan. Yangi akkaunt ochish shart emas.', ru: 'Если пригласят на встречу — только со взрослыми. Новый аккаунт открывать не нужно.' };
const postOl = () => { const k = lsO(KANAL_KEY); const p = k && k.post && typeof k.post === 'object' ? k.post : null; return p ? ['kim', 'foyda', 'harakat', 'holat'].map(x => String(p[x] || '').trim()).filter(Boolean).join('\n') : ''; };
const sonV = (v) => (/^\d+$/.test(String(v)) ? Number(v) : null);
const NatijaA2 = () => {
  const [f, setF] = useState(() => (kamHarakat() ? 1 : 0));
  const qRef = useRef(null);
  const [minH, setMinH] = useState(0);
  useLayoutEffect(() => { if (f === 0 && qRef.current) setMinH(qRef.current.offsetHeight); }, [f]);
  useEffect(() => { if (kamHarakat()) return undefined; const t = setTimeout(() => setF(1), 4200); return () => clearTimeout(t); }, []);
  return (
    <div className="fu-natija">
      <div className="fu-a2-oyna" ref={qRef} style={minH ? { minHeight: minH } : undefined}>
        <ItBrauzer sahifa={f === 0 ? 'maxfiylik' : 'lending'} holat="havola" siyosatPast />
      </div>
      <SanoqKartalar kichik royxat={IT.sanoq.royxat} asosiy={IT.sanoq.asosiy} osti1={tr({ uz: '11 tasi sinfdosh', ru: '11 — одноклассники' })} />
      <span className="fu-kulrang">{tr({ uz: "sonlar Mentor misolidan — sizda boshqacha bo'ladi.", ru: 'числа из примера Ментора — у вас будут другие.' })}</span>
    </div>
  );
};
const ScreenA2 = (props) => {
  const [trek, setTrek] = useState(trekOl);
  const [r0] = useState(rejaOl);
  const [tk, setTk] = useState(r0.tekshiruv);
  const [hv, setHv] = useState(r0.tekshiruv.havola ? 'bor' : null); // 'bor' | 'navbat' | null
  const [yub, setYub] = useState(r0.yuborildi ? 'ha' : null); // 'ha' | 'uy' | null
  const [post, setPost] = useState(postOl);
  const [xb, setXb] = useState(() => XAVFSIZLIK.map(() => false));
  const [son, setSon] = useState(() => ({ royxat: r0.royxat == null ? '' : String(r0.royxat), sinfdosh: r0.sinfdosh == null ? '' : String(r0.sinfdosh), asosiy: r0.asosiy == null ? '' : String(r0.asosiy) }));
  const [postOk, setPostOk] = useState(false);
  const tanla = (t) => { trekYoz(t); setTrek(t); };
  const mobil = trek !== 'web', web = trek !== 'mobil';
  const havolaTanla = (v) => {
    const bor = v === 'bor';
    if (bor && !tk.malumot) return;
    const n = rejaYoz(bor ? { tekshiruv: { havola: true } } : { tekshiruv: { havola: false }, yuborildi: false });
    setTk(n.tekshiruv); setHv(v); if (!bor) setYub(y => (y === 'ha' ? null : y));
  };
  const webHavola = () => { if (!tk.malumot) return; const v = !tk.havola; const n = rejaYoz(v ? { tekshiruv: { havola: true } } : { tekshiruv: { havola: false }, yuborildi: false }); setTk(n.tekshiruv); setHv(v ? 'bor' : null); if (!v) setYub(y => (y === 'ha' ? null : y)); };
  const yubTanla = (v) => { if (v === 'ha' && !tk.havola) return; rejaYoz({ yuborildi: v === 'ha' }); setYub(v); };
  const sonYoz = (k, v) => {
    const s = { ...son, [k]: v.replace(/\D/g, '').slice(0, 5) };
    setSon(s);
    rejaYoz({ royxat: sonV(s.royxat), sinfdosh: sonV(s.sinfdosh), asosiy: sonV(s.asosiy), sana: bugun() });
  };
  const postNusxa = async () => { try { await navigator.clipboard.writeText(post); setPostOk(true); setTimeout(() => setPostOk(false), 1600); } catch { /* clipboard yopiq */ } };
  const doneText = tk.havola && yub === 'ha'
    ? { uz: 'Siyosat saytda, havola lendingda, post yuborildi.', ru: 'Политика на сайте, ссылка на лендинге, пост отправлен.' }
    : tk.havola ? { uz: 'Siyosat saytda, havola lendingda. Postni ota-onangizga ko\'rsatib yuborasiz.', ru: 'Политика на сайте, ссылка на лендинге. Пост отправите, показав родителям.' }
    : { uz: "Siyosat saytda. Android havolasi va post — fayl tayyor bo'lgach, uyda.", ru: 'Политика на сайте. Ссылка для Android и пост — дома, когда файл будет готов.' };
  const steps = [
    { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>
      <Bq k="bir">{tr({ uz: "Amaliyot 1 push qilingan, mobil trekda o'rnatish fayli navbatda. Ilovangiz so'raydigan har ma'lumot uchun bitta gap tayyorlang: u nima uchun kerak. Siyosatning qolgan uch javobini agent koddan topadi, siz tekshirasiz.", ru: 'Практика 1 отправлена (push), в мобильном треке файл установки в очереди. Для каждого данного, которое спрашивает приложение, подготовьте одну фразу: зачем оно нужно. Остальные три ответа политики агент найдёт в коде, вы проверите.' })}</Bq>
    </> },
    { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>
      <Bq k="bir">{tr({ uz: "«Nima uchun» qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'Строку «Nima uchun» напишите сами, нажмите «Скопировать», отправьте в Antigravity:' })}</Bq>
    </>, prompt: { satrlar: A2_PROMPT }, yordam: A2_YORDAM },
    { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: <>
      {mobil && <>
        <Bq k="bir">{tr({ uz: "mobil trekda: `cd mobil` → `npx expo export -p web` → `dist` papkasini Netlify'ga yangi sayt qilib chiqaring (9-Modulda sayt chiqargansiz; buyruq bilan: `netlify deploy --prod --dir dist` — `--prod` siz sinov manzili chiqadi).", ru: 'в мобильном треке: `cd mobil` → `npx expo export -p web` → выложите папку `dist` на Netlify новым сайтом (в 9-м модуле вы выкладывали сайт; командой: `netlify deploy --prod --dir dist` — без `--prod` выйдет тестовый адрес).' })}</Bq>
        <Bq>{tr({ uz: "Manzil chiqqach, agentga: «Brauzer ko'rinishi manzili: {manzil}. Backend shu manzildan so'rovlarni qabul qilsin (`WEB_ORIGIN`); lendingdagi «iPhone: brauzerda ochish» — shu manzil.»", ru: "Когда появится адрес, агенту: «Brauzer ko'rinishi manzili: {manzil}. Backend shu manzildan so'rovlarni qabul qilsin (`WEB_ORIGIN`); lendingdagi «iPhone: brauzerda ochish» — shu manzil.»" })}</Bq>
      </>}
      <Bq k={mobil ? undefined : 'bir'}>{tr({ uz: 'Keyin `git status` → `git add <fayl>` → `git commit -m "7-dars: maxfiylik siyosati va brauzer ko\'rinishi"` → `git push` — Render va lending yangilanadi (bir necha daqiqa cho\'zilishi mumkin).', ru: 'Потом `git status` → `git add <fayl>` → `git commit -m "7-dars: maxfiylik siyosati va brauzer ko\'rinishi"` → `git push` — Render и лендинг обновятся (может занять несколько минут).' })}</Bq>
      <Bq>{tr({ uz: "Tekshiring: lendingdan «Maxfiylik siyosati»ni oching — to'rt savolga javob bormi; har gapni agent ko'rsatgan fayl bilan solishtiring. Kodga mos kelmagan gapni agentga yozing: «Shu gap kodga mos emas: {gap}. Tuzat.» Agent «[savol]» qoldirgan joylarni o'zingiz yozing (Mentor misolida: «Database'ni faqat ilova egasi ko'radi.» — buni Mentor biladi, kod aytmaydi).", ru: 'Проверьте: откройте на лендинге «Политика конфиденциальности» — есть ли ответы на четыре вопроса; сравните каждую фразу с файлом, который показал агент. Фразу, не совпадающую с кодом, напишите агенту: «Shu gap kodga mos emas: {gap}. Tuzat.» Места, где агент оставил «[savol]», напишите сами (в примере Ментора: «Database видит только владелец приложения.» — это знает Ментор, код не скажет).' })}</Bq>
      {mobil && <Bq>{tr({ uz: "Telefon brauzerida brauzer ko'rinishi manzilini oching: «Kirish» va «O'yinlar» ko'rinishi kerak. Ko'rinmasa — iPhone qatori eski matn bilan qoladi, Android yo'li ishlayveradi; xato qatorini agentga yuboring (`.env` qiymatlarini emas).", ru: 'В браузере телефона откройте адрес браузерной версии: должны появиться «Вход» и «Игры». Если нет — строка iPhone остаётся со старым текстом, путь Android работает; отправьте агенту строку ошибки (не значения `.env`).' })}</Bq>}
      <Bq k="kulrang">{tr({ uz: 'Bu sahifa yuridik hujjat emas — u ilovangiz haqiqatda nima qilishini aytadi.', ru: 'Эта страница — не юридический документ: она говорит, что ваше приложение делает на самом деле.' })}</Bq>
      <Bq>{tr({ uz: "Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Shu xato chiqdi: {xato}. Tuzat.»' })}</Bq>
    </> },
    { h: { uz: 'Havola va post', ru: 'Ссылка и пост' }, t: <>
      <Bq k="bir">{tr({ uz: "tartib bilan; ulgurmaganingiz uyga qoladi:", ru: 'по порядку; что не успеете — останется на дом:' })}</Bq>
      <span className="fu-qism">
        <b className="fu-qism-h">{tr({ uz: "(1) O'rnatish fayli", ru: '(1) Файл установки' })}</b>
        {mobil && <>
          <Bq>{tr({ uz: "terminal bergan sahifani oching. Fayl tayyor bo'lsa, havolasini agentga: «Android havolasi: {APK havolasi}. Lendingdagi «Android: ilovani o'rnatish» shu manzilga olib borsin.» → `git push`.", ru: "откройте страницу, которую дал терминал. Если файл готов, ссылку — агенту: «Android havolasi: {APK havolasi}. Lendingdagi «Android: ilovani o'rnatish» shu manzilga olib borsin.» → `git push`." })}</Bq>
          <Bq>{tr({ uz: "Telefonda lendingni oching: «Qo'shilmoqchiman» → «Android: ilovani o'rnatish» — fayl yuklanadi, o'rnatishda ogohlantirish chiqishi kerak. Havolani boshqa telefonda yoki brauzerning yashirin oynasida ham oching — fayl Expo akkauntisiz yuklanishi kerak; yuklanmasa, havolani lendingda qoldirmang va xato qatorini agentga yuboring.", ru: 'Откройте лендинг на телефоне: «Хочу присоединиться» → «Android: установить приложение» — файл скачивается, при установке должно появиться предупреждение. Откройте ссылку и на другом телефоне или в скрытом окне браузера — файл должен скачиваться без аккаунта Expo; если нет — не оставляйте ссылку на лендинге и отправьте агенту строку ошибки.' })}</Bq>
          <span className="fu-tanlov">
            <span className="fu-belgi-y">{tr({ uz: 'Tanlang:', ru: 'Выберите:' })}</span>
            <span className={cxx('fu-belgi-g', !hv && 'fu-chorla')}>
              <QChip holat={hv === 'bor' ? 'on' : undefined} disabled={!tk.malumot} onClick={() => havolaTanla('bor')}>{tr({ uz: 'Android havolasi lendingda', ru: 'Ссылка Android на лендинге' })}</QChip>
              <QChip holat={hv === 'navbat' ? 'on' : undefined} onClick={() => havolaTanla('navbat')}>{tr({ uz: 'Fayl hali navbatda', ru: 'Файл ещё в очереди' })}</QChip>
            </span>
            <Bq k="kulrang">{tr({ uz: "(ikkinchisida havola va post uyga qoladi). Havola faqat Amaliyot 1 dagi «Ma'lumot» belgisi qo'yilgan ilova uchun qo'yiladi.", ru: '(во втором случае ссылка и пост остаются на дом). Ссылку ставят только для приложения, у которого в Практике 1 отмечено «Данные».' })}</Bq>
          </span>
        </>}
        {!mobil && <span className="fu-tanlov">
          <Bq>{tr({ uz: "lendingdagi asosiy tugma saytingiz manziliga olib borishini tekshirib, «havola lendingda» deb belgilaysiz.", ru: 'проверив, что главная кнопка лендинга ведёт на адрес вашего сайта, отмечаете «ссылка на лендинге».' })}</Bq>
          <span className={cxx('fu-belgi-g', !tk.havola && 'fu-chorla')}><QChip holat={tk.havola ? 'ok' : undefined} disabled={!tk.malumot} onClick={webHavola}>{tk.havola ? '✓ ' : ''}{tr({ uz: 'Havola lendingda', ru: 'Ссылка на лендинге' })}</QChip></span>
        </span>}
      </span>
      <span className="fu-qism">
        <b className="fu-qism-h">{tr({ uz: '(2) Post', ru: '(2) Пост' })}</b>
        <Bq>{tr({ uz: "(havola lendingda bo'lsa) — 6-darsdagi postingiz shu yerda (to'rt qator: kim uchun · nima foyda · bitta harakat · halol holat); «bitta harakat» va «halol holat» qatorlarini bugungi holatga moslang: nima tayyor — shuni yozing. Havola oxiriga kanal belgisi (`?kanal=sinf`).", ru: '(если ссылка на лендинге) — ваш пост с 6-го урока здесь (четыре строки: для кого · какая польза · одно действие · честное состояние); строки «одно действие» и «честное состояние» подстройте под сегодняшнее: что готово — то и пишите. В конце ссылки — метка канала (`?kanal=sinf`).' })}</Bq>
        <span className="fu-post">
          <span className="fu-post-h"><span className="q-prompt-kim">{tr({ uz: 'post', ru: 'пост' })}</span><button type="button" className="q-prompt-nusxa" onClick={postNusxa}>{postOk ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
          <textarea className="fu-post-ta" value={post} rows={4} placeholder={tr({ uz: 'kim uchun · nima foyda · bitta harakat · halol holat', ru: 'для кого · какая польза · одно действие · честное состояние' })} aria-label={tr({ uz: 'Post', ru: 'Пост' })} onChange={(e) => setPost(e.target.value)} />
        </span>
        <Bq>{tr({ uz: "Xavfsizlik ro'yxati (6-darsdagi olti band, so'zma-so'z — belgilab chiqing):", ru: 'Список безопасности (шесть пунктов с 6-го урока, дословно — отметьте):' })}</Bq>
        <span className="fu-xavf">
          {XAVFSIZLIK.map((x, i) => (
            <label key={i} className={cxx('fu-xb', xb[i] && 'on')}>
              <input type="checkbox" checked={xb[i]} onChange={() => setXb(a => a.map((v, j) => (j === i ? !v : v)))} />
              <span>{i + 1}) «{tr(x)}»</span>
            </label>
          ))}
          <span className="fu-xavf-o">{tr(XAVF_OSTI)}</span>
        </span>
        <Bq>{tr({ uz: "Sinf chatiga: postni Mentorga ko'rsating, u aytsa yuboring (2-band shu bilan; ota-ona bandi — sinf chati uchun shart emas). Mahalla guruhi kabi boshqa kanalga — uyda, ota-onangizga ko'rsatib va guruh egasining ruxsati bilan.", ru: 'В чат класса: покажите пост Ментору, скажет — отправляйте (так закрывается 2-й пункт; пункт о родителях для чата класса не обязателен). В другой канал, например группу махалли, — дома, показав родителям и с разрешения владельца группы.' })}</Bq>
        <span className="fu-tanlov">
          <span className="fu-belgi-y">{tr({ uz: 'Tanlang:', ru: 'Выберите:' })}</span>
          <span className={cxx('fu-belgi-g', !yub && 'fu-chorla')}>
            <QChip holat={yub === 'ha' ? 'on' : undefined} disabled={!tk.havola} onClick={() => yubTanla('ha')}>{tr({ uz: 'Yuborildi', ru: 'Отправлен' })}</QChip>
            <QChip holat={yub === 'uy' ? 'on' : undefined} onClick={() => yubTanla('uy')}>{tr({ uz: 'Uyda yuboraman', ru: 'Отправлю дома' })}</QChip>
          </span>
        </span>
        <Yordam satrlar={A2_POST_YORDAM} />
      </span>
      <span className="fu-qism">
        <b className="fu-qism-h">{tr({ uz: '(3) Sanoq', ru: '(3) Подсчёт' })}</b>
        <Bq>{tr({ uz: "dars oxirida. Neon SQL Editor'da: `SELECT COUNT(*) FROM oyinchilar WHERE namuna = false;` → «Run» — ro'yxatdan o'tganlar (namuna va tekshiruv akkauntlarisiz).", ru: 'в конце урока. В Neon SQL Editor: `SELECT COUNT(*) FROM oyinchilar WHERE namuna = false;` → «Run» — зарегистрировавшиеся (без тестовых и проверочных аккаунтов).' })}</Bq>
        <Bq>{tr({ uz: "Asosiy harakat — agentga: «Neon SQL Editor uchun bitta `SELECT` yoz, o'zing ishga tushirma: `namuna = false` akkauntlardan nechtasi {asosiy harakat — masalan: hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan}. Jadvallarni o'zgartirma.» — SQL'ni o'qib, «Run».", ru: "Основное действие — агенту: «Neon SQL Editor uchun bitta `SELECT` yoz, o'zing ishga tushirma: `namuna = false` akkauntlardan nechtasi {asosiy harakat — masalan: hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan}. Jadvallarni o'zgartirma.» — прочитав SQL, «Run»." })}</Bq>
        <Bq>{tr({ uz: "`tekshiruv1` qolgan bo'lsa — avval «Hisobni o'chirish» bilan o'chiring. Sonlarni kiriting:", ru: 'Если `tekshiruv1` остался — сначала удалите его через «Удалить аккаунт». Введите числа:' })}</Bq>
        <span className="fu-sonlar">
          {[['royxat', { uz: "Hozirgacha ro'yxatdan o'tgan", ru: 'Зарегистрировались на сегодня' }], ['sinfdosh', { uz: 'shundan sinfdosh', ru: 'из них одноклассников' }], ['asosiy', { uz: 'Asosiy harakatni qilgan', ru: 'Сделали основное действие' }]].map(([k, l]) => (
            <label key={k} className="fu-mz son">
              <span className="fu-mz-n">{tr(l)}</span>
              <input className="fu-inp" value={son[k]} inputMode="numeric" maxLength={5} placeholder={k === 'sinfdosh' ? tr({ uz: 'bilsangiz — ixtiyoriy', ru: 'если знаете — по желанию' }) : ''} onChange={(e) => sonYoz(k, e.target.value)} />
            </label>
          ))}
          {(son.royxat || son.asosiy) && <span className="fu-kulrang fade-step">{tr({ uz: 'sana o\'zi yoziladi', ru: 'дата пишется сама' })}: {bugun()}</span>}
        </span>
      </span>
    </> }
  ];
  return (
    <ScreenBlok {...props} steps={steps}
      eyebrow={{ uz: 'Amaliyot 2 · siyosat va havola', ru: 'Практика 2 · политика и ссылка' }}
      title={{ uz: <>Siyosat saytda, <A>havola lendingda tursin.</A></>, ru: <>Политика — на сайте, <A>ссылка — на лендинге.</A></> }}
      mentor={{ uz: "Endi «Nima uchun» qatorini o'zingiz yozasiz — har ma'lumot nega kerakligini siz bilasiz; «1 · Ochish»dan boshlang.", ru: 'Теперь строку «Nima uchun» пишете сами — зачем нужно каждое данное, знаете вы; начните с «1 · Открыть».' }}
      ustida={<TrekTanlov trek={trek} onTanla={tanla} />}
      natija={<NatijaA2 />}
      doneText={doneText}
      ulgur={{ uz: "Siyosat sahifasi push qilinsa yetadi — brauzer ko'rinishi, havola va post uyga qoladi; yakun sarlavhasi nima qolganini aytadi.", ru: 'Достаточно отправить (push) страницу политики — браузерная версия, ссылка и пост остаются на дом; заголовок итога скажет, что осталось.' }}
      pastQator={web && <WebQator>{tr({ uz: "brauzer ko'rinishi va o'rnatish fayli yo'q — 3-bo'limda faqat siyosat; 4-bo'lim (1) da lendingdagi asosiy tugma saytingiz manziliga olib borishini tekshirib, «havola lendingda» deb belgilaysiz; `hodisaYoz` — Amaliyot 1 da.", ru: 'браузерной версии и файла установки нет — в разделе 3 только политика; в (1) раздела 4 проверяете, что главная кнопка лендинга ведёт на адрес сайта, и отмечаете «ссылка на лендинге»; `hodisaYoz` — в Практике 1.' })}</WebQator>} />
  );
};

// ===== KARTOCHKALAR — alohida ekran, Mentorsiz (SABOQ 12, 16); birinchi bosishgacha karta yuzi yengil halqada (E 49) =====
const KARTOCHKALAR = [
  { front: { uz: 'Bu darsda 50 foydalanuvchiga reja nechta bosqichdan iborat?', ru: 'Из скольких этапов на этом уроке состоит план на 50 пользователей?' }, back: { uz: 'Uchta: har bosqichda kanal, nima yuboriladi, kutilgan son va qachon', ru: 'Из трёх: в каждом этапе канал, что отправляется, ожидаемое число и когда' }, note: { uz: "Bu kurs qolipi; boshqa rejada bosqichlar soni boshqa bo'lishi mumkin", ru: 'Это шаблон курса; в другом плане этапов может быть другое число' } },
  { front: { uz: 'Rejadagi kutilgan son nima?', ru: 'Что такое ожидаемое число в плане?' }, back: { uz: "Taxmin: shuncha kishi yig'ilishi kutilyapti", ru: 'Предположение: ожидается, что соберётся столько человек' }, note: { uz: 'Haqiqiy son ishga tushirilgandan keyin sanaladi', ru: 'Настоящее число считают после запуска' } },
  { front: { uz: 'Qaysi ikki son yonma-yon aytiladi?', ru: 'Какие два числа называют рядом?' }, back: { uz: "Ro'yxatdan o'tgan va asosiy harakatni qilgan", ru: 'Зарегистрировавшиеся и сделавшие основное действие' }, note: { uz: 'Mentor misolida ishga tushirish kuni: 20 va 8', ru: 'В примере Ментора в день запуска: 20 и 8' } },
  { front: { uz: 'Sinfdoshlar sanoqqa kiradimi?', ru: 'Считаются ли одноклассники?' }, back: { uz: 'Ha, lekin alohida aytiladi', ru: 'Да, но называются отдельно' }, note: { uz: 'Mentor misolida: 20 kishi, 11 tasi — sinfdosh', ru: 'В примере Ментора: 20 человек, 11 из них — одноклассники' } },
  { front: { uz: 'Namuna va tekshiruv akkauntlari sanaladimi?', ru: 'Считаются ли тестовые и проверочные аккаунты?' }, back: { uz: "Yo'q", ru: 'Нет' }, note: { uz: "Mentor misolida ular `namuna` belgisi bilan ajratiladi; soxta akkaunt ham yo'q", ru: 'В примере Ментора их отделяет отметка `namuna`; фейковых аккаунтов тоже нет' } },
  { front: { uz: 'Havola yuborishdan oldin bu darsda qaysi uch narsa tekshiriladi?', ru: 'Какие три вещи на этом уроке проверяют перед отправкой ссылки?' }, back: { uz: "Ma'lumot, o'lchov va havola", ru: 'Данные, измерение и ссылка' }, note: { uz: "Faqat kerakli minimum so'raladimi, qadamlar sanaladimi, odam ilovani qanday ochadi", ru: 'Спрашивается ли только необходимый минимум, считаются ли шаги, как человек откроет приложение' } },
  { front: { uz: 'Login nima?', ru: 'Что такое логин?' }, back: { uz: "Ro'yxatdan o'tishda o'zingiz tanlagan nom", ru: 'Имя, которое вы сами выбираете при регистрации' }, note: { uz: "Mentor misolida telefon raqami so'ralmaydi — SMS yuborilmaydi", ru: 'В примере Ментора номер телефона не спрашивается — SMS не отправляются' } },
  { front: { uz: 'Qurilma ID nima?', ru: 'Что такое ID устройства?' }, back: { uz: 'Tasodifiy harf va raqamlar: bitta qurilmadagi ilovani ajratadi', ru: 'Случайные буквы и цифры: отличают приложение на одном устройстве' }, note: { uz: 'Odamning ismini ham, loginini ham bildirmaydi', ru: 'Не выдаёт ни имени, ни логина человека' } },
  { front: { uz: 'Mentor misolida ilova qaysi to\'rt qadamni sanaydi?', ru: 'Какие четыре шага считает приложение в примере Ментора?' }, back: { uz: "Ochdi, ro'yxatdan o'tdi, qo'shildi, kelishini tasdiqladi", ru: 'Открыл, зарегистрировался, присоединился, подтвердил приход' }, note: { uz: 'Har qadamda turli qurilmalar soni', ru: 'На каждом шаге — число разных устройств' } },
  { front: { uz: 'APK nima?', ru: 'Что такое APK?' }, back: { uz: "Android telefonga o'rnatiladigan ilova fayli", ru: 'Файл приложения для установки на Android-телефон' }, note: { uz: "O'rnatishda ogohlantirish chiqadi: ilova do'kondan emas", ru: 'При установке появляется предупреждение: приложение не из магазина' } },
  { front: { uz: "Brauzer ko'rinishi nima?", ru: 'Что такое браузерная версия?' }, back: { uz: "Mobil ilovaning brauzerda ochiladigan ko'rinishi", ru: 'Вид мобильного приложения, который открывается в браузере' }, note: { uz: "Mentor misolida iPhone'li foydalanuvchilar uchun; unda eslatma hozircha yo'q", ru: 'В примере Ментора — для пользователей iPhone; напоминаний в нём пока нет' } },
  { front: { uz: "«Hisobni o'chirish» bosilsa nima o'chadi?", ru: 'Что удаляется при нажатии «Удалить аккаунт»?' }, back: { uz: 'Akkaunt va uning qatnashuv yozuvlari', ru: 'Аккаунт и его записи об участии' }, note: { uz: "Siyosatdagi «o'chirish» gapi kodda bor", ru: 'Фраза политики об «удалении» есть в коде' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('fu-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: tr(c.note) }))} />
          {!bosildi && <p className="fu-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + raqamli bandlar; ③ — holatdan yig'iladi, hammasi tugagan bo'lsa ko'rinmaydi) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'ota-onangiz va 1-bosqichdagi kanallar', ru: 'ваши родители и каналы 1-го этапа' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: "1-bosqich to'liq", ru: '1-й этап полностью' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QOLGAN = {
  olchov: { uz: "qadamlar sanog'ini tekshiring", ru: 'проверьте подсчёт шагов' },
  siyosat: { uz: 'siyosat sahifasini kod bilan solishtiring', ru: 'сравните страницу политики с кодом' },
  brauzer: { uz: "brauzer ko'rinishini chiqaring", ru: 'выложите браузерную версию' },
  android: { uz: "o'rnatish fayli tayyor bo'lgach, Android havolasini lendingga qo'ying", ru: 'когда файл установки будет готов, поставьте ссылку Android на лендинг' }
};
const HwCard = ({ keyingi, qolgan }) => (
  <div className="card fu-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="fu-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="fu-hw-q"><span className="fu-hw-k">{tr(r.k)}</span><span className="fu-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="fu-hw-qadam">
      <li><i>①</i><span>{tr({ uz: "Havola lendingda bo'lgach, postni olti bandli ro'yxat bo'yicha tekshiring, ota-onangizga ko'rsating va 1-bosqichdagi kanallarga yuboring (guruhga — egasidan ruxsat so'rab). Uchrashuv taklifi kelsa — faqat kattalar bilan.", ru: 'Когда ссылка будет на лендинге, проверьте пост по списку из шести пунктов, покажите родителям и отправьте в каналы 1-го этапа (в группу — спросив разрешения владельца). Если пригласят на встречу — только со взрослыми.' })}</span></li>
      <li><i>②</i><span>{fmtCode(tr({ uz: "Kechqurun Neon'da ikki sonni qayta sanang — hozirgacha ro'yxatdan o'tgan (`namuna = false`; sinfdoshlarni bilsangiz — alohida) va asosiy harakatni qilgan — va sanasi bilan yozib oling.", ru: 'Вечером пересчитайте в Neon два числа — зарегистрировавшихся на сегодня (`namuna = false`; одноклассников, если знаете, — отдельно) и сделавших основное действие — и запишите с датой.' }))}</span></li>
      {qolgan.length > 0 && <li><i>③</i><span>{tr({ uz: 'Darsda qolgan qismni tugating', ru: 'Закончите то, что осталось с урока' })}: {qolgan.map(k => tr(HW_QOLGAN[k])).join(' · ')}.</span></li>}
    </ol>
    {keyingi && <span className="fu-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar. Sarlavha — besh holat, har biri rost (E 54) =====
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
    { uz: "Rejadagi kutilgan son — taxmin; haqiqiy son Database'dan sanaladi.", ru: 'Ожидаемое число в плане — предположение; настоящее число считают из Database.' },
    { uz: "Ikki son yonma-yon aytiladi: ro'yxatdan o'tgan va asosiy harakatni qilgan.", ru: 'Два числа называют рядом: зарегистрировавшиеся и сделавшие основное действие.' },
    { uz: 'Sinfdoshlar sanaladi, lekin alohida aytiladi; namuna va tekshiruv akkauntlari sanalmaydi.', ru: 'Одноклассников считают, но называют отдельно; тестовые и проверочные аккаунты не считают.' },
    { uz: "Login — ro'yxatdan o'tishda o'zingiz tanlagan nom; telefon raqami mahsulotga kerak bo'lmasa, so'ralmaydi.", ru: 'Логин — имя, которое вы сами выбираете при регистрации; номер телефона, если он не нужен продукту, не спрашивают.' },
    { uz: 'Qurilma ID bitta qurilmadagi ilovani ajratadi, odamning ismini ham, loginini ham bildirmaydi.', ru: 'ID устройства отличает приложение на одном устройстве, не выдаёт ни имени, ни логина человека.' }
  ];
  const r = rejaOl();
  const t = r.tekshiruv;
  const trek = trekOl();
  const a2 = !!(answers[7] && answers[7].solved);
  // Holat (P-046, tayanch 8): pm-m10d7-reja.tekshiruv, yuborildi, bosqichlar — hammasi o'quvchi qo'ygan belgilardan
  const holat = isMentorL || (t.malumot && t.olchov && t.havola && r.yuborildi) ? 'yuborildi'
    : (t.malumot && t.olchov && t.havola) ? 'uyda'
    : t.malumot ? 'ilova'
    : rejaSaqlangan(r) ? 'reja' : 'yoq';
  const SARLAVHA = {
    yuborildi: { uz: <>Ilovangiz <A>odamlarga yuborildi.</A></>, ru: <>Ваше приложение <A>отправлено людям.</A></> },
    uyda: { uz: <>Havola tayyor — <A>post yuborish qoldi.</A></>, ru: <>Ссылка готова — <A>осталось отправить пост.</A></> },
    ilova: { uz: <>Ilova tayyor — <A>havola va post qoldi.</A></>, ru: <>Приложение готово — <A>остались ссылка и пост.</A></> },
    reja: { uz: <>Reja tayyor — <A>uch tekshiruv qoldi.</A></>, ru: <>План готов — <A>остались три проверки.</A></> },
    yoq: { uz: <>Reja hali yozilmagan — <A>uch bosqichni yozing.</A></>, ru: <>План ещё не написан — <A>напишите три этапа.</A></> }
  };
  const toliq = holat === 'yuborildi';
  const qolgan = isMentorL ? [] : [
    !t.olchov && 'olchov',
    !t.havola && !a2 && 'siyosat',
    !t.havola && !a2 && trek !== 'web' && 'brauzer',
    trek !== 'web' && !t.havola && 'android'
  ].filter(Boolean);
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Foydalanuvchilar qaysi qadamda to'xtab qolyapti?»</b></>, ru: <>Следующий урок — <b>«На каком шаге пользователи застревают?»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('fu-yakun', !toliq && 'belgisiz')}>
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
          uyga={<HwCard keyingi={keyingi} qolgan={qolgan} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmFiftyUsersLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — IshgaTushirish (it-): chat · brauzer · telefon maketi, jadvallar, sanoq; dars elementlari (fu-). Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        @media (max-width: 1199px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .lesson-root .q-ekran > ol.q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .lesson-root .q-mustaqil { max-width: none; }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .fu-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: fu-puls 2.2s ease-out .3s 3; }
        @keyframes fu-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .fu-mz.fu-halqa-i { border-color: ${T.accent}; animation: fu-tolqin-i 2.4s ease-in-out .4s 3; }
        /* Variantlar va chiplar: guruh atrofida ramka yo'q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .fu-s0 { display: contents; }
        .fu-s0.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: fu-chorla-v 1.8s ease-out .5s 2; }
        .fu-s0.kutish .q-variant:nth-child(2) { animation-delay: .75s; }
        @keyframes fu-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled), .fu-chorla > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: fu-chorla-c 1.8s ease-out .5s 2; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:nth-child(2), .fu-chorla > .q-chip:nth-child(2) { animation-delay: .75s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:nth-child(3), .fu-chorla > .q-chip:nth-child(3) { animation-delay: 1s; }
        @keyframes fu-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes fu-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        /* Maket ramkasi — o'lchami barqaror (SABOQ 22): chat, brauzer, telefon bir joyda almashadi */
        .it-maket { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .it-maket-r { width: 100%; max-width: 300px; height: 300px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
        .it-chat { width: 100%; height: 100%; display: flex; flex-direction: column; border: 1.5px solid ${T.line}; border-radius: 14px; overflow: hidden; background: ${T.paper}; box-shadow: 0 12px 30px -16px rgba(${T.shadowBase},0.35); }
        .it-chat-bar { display: flex; align-items: center; gap: 9px; padding: 9px 12px; border-bottom: 1px solid ${T.line}; flex: none; }
        .it-chat-ava { width: 32px; height: 32px; border-radius: 50%; flex: none; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; color: #fff; background: ${T.ok}; }
        .it-chat-ava.b { background: ${T.accent}; }
        .it-chat-t { display: flex; flex-direction: column; min-width: 0; animation: fu-kir .35s ease-out both; }
        .it-chat-t b { font-size: 13px; color: ${T.ink}; } .it-chat-t span { font-size: 11px; color: ${T.ink2}; }
        .it-chat-ichi { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; gap: 8px; padding: 12px; background: ${T.bg}; }
        p.it-puf { margin: 0; max-width: 94%; padding: 9px 11px; border-radius: 12px 12px 12px 4px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; line-height: 1.45; color: ${T.ink}; overflow-wrap: anywhere; animation: fu-puf .45s cubic-bezier(.3,1.2,.5,1) both; }
        p.it-puf.kulrang { color: ${T.ink2}; font-style: italic; }
        p.it-puf.eski { color: ${T.ink2}; font-size: 11px; animation: none; }
        p.it-puf.eski > span { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .it-ruxsat { align-self: center; margin-bottom: auto; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 2px 10px; }
        .it-oyna { width: 100%; height: 100%; display: flex; flex-direction: column; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px -16px rgba(${T.shadowBase},0.35); }
        .it-bar { display: flex; align-items: center; gap: 6px; height: 30px; padding: 0 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; flex: none; }
        .it-bar > i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.16)}; flex: none; }
        .it-url { flex: 1; min-width: 0; height: 20px; margin-left: 6px; padding: 0 10px; border-radius: 999px; background: ${T.paper}; display: flex; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; }
        .it-url-t { overflow: hidden; text-overflow: ellipsis; animation: fu-kir .35s ease-out both; }
        .it-kor { position: relative; flex: 1; min-height: 0; overflow: hidden; }
        .it-ichi { padding: 14px 16px 18px; display: flex; flex-direction: column; gap: 8px; transition: transform .7s cubic-bezier(.4,0,.2,1); }
        .it-nom { font-weight: 800; font-size: 12.5px; color: ${MAYDON_RANG}; }
        h3.it-sar { margin: 0; font-size: 18px; line-height: 1.22; font-weight: 800; color: ${T.ink}; letter-spacing: -0.01em; }
        .it-tugma { align-self: flex-start; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: #fff; background: ${T.accent}; border: none; border-radius: 9px; padding: 8px 14px; cursor: default; }
        .it-tugma:not(:disabled) { cursor: pointer; }
        .it-bolim { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; transition: box-shadow .3s; }
        .it-bolim.halqa { box-shadow: 0 0 0 2px ${T.accent}; }
        .it-bolim > b { font-size: 13px; color: ${T.ink}; }
        .it-bolim-t { font-size: 12px; color: ${T.ink2}; border-radius: 6px; transition: background .3s, color .3s; }
        .it-bolim-t.qizil { background: ${T.errFon}; color: ${T.err}; padding: 2px 6px; }
        .it-havolalar { display: flex; flex-direction: column; gap: 5px; animation: fu-kir .45s ease-out both; }
        .it-hv { font-size: 12.5px; font-weight: 800; color: ${T.accent}; text-decoration: underline; text-underline-offset: 2px; }
        .it-ogoh { font-size: 11px; line-height: 1.4; color: ${T.ink2}; }
        .it-uyalar { display: flex; gap: 8px; margin-top: 4px; }
        .it-uyalar i { width: 30px; height: 30px; border-radius: 8px; border: 1.5px dashed ${fon(T.accent, 0.6)}; display: flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; color: ${T.accent}; animation: fu-tush .4s cubic-bezier(.3,1.4,.5,1) var(--d, 0s) both; }
        .it-siyosat-past { margin-top: 6px; font-size: 11.5px; color: ${T.ink2}; text-decoration: underline; }
        .it-mx { gap: 7px; }
        .it-mx-sar { font-size: 13.5px; color: ${T.ink}; }
        p.it-mx-q { margin: 0; font-size: 11.5px; line-height: 1.45; color: ${T.ink2}; }
        p.it-mx-q b { color: ${T.ink}; }
        code.it-umami { display: block; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.5; color: ${T.ink2}; text-align: center; }
        .it-tel { position: relative; width: 170px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 6px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px 9px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .it-tel-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; }
        .it-tel-nom { font-weight: 800; font-size: 12.5px; color: ${MAYDON_RANG}; letter-spacing: 0.01em; }
        .it-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 5px; animation: fu-ekran .35s ease-out both; }
        .it-tel-sar { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .it-maydon { display: flex; align-items: center; height: 26px; flex: none; padding: 0 9px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.bg}; font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 600; color: ${T.ink2}; text-align: left; }
        button.it-maydon:not(:disabled) { cursor: pointer; color: ${T.ink}; border-color: ${fon(T.accent, 0.6)}; }
        .it-maydon.silk { animation: fu-silk .45s ease-in-out, fu-ket .3s ease-in .4s forwards; }
        .it-maydon.yangi { border-color: ${T.ok}; color: ${T.ink}; animation: fu-yoz .45s ease-out both; }
        .it-tel-btn { display: flex; align-items: center; justify-content: center; height: 26px; flex: none; border-radius: 8px; background: ${T.accent}; color: #fff; font-size: 11.5px; font-weight: 800; }
        .it-tel-btn.past { margin-top: auto; } .it-tel-btn.ok { background: ${T.ok}; }
        .it-tel-btn.ikki { margin-top: auto; background: ${T.bg}; color: ${T.ink}; border: 1px solid ${T.line}; }
        .it-tel-btn.qizil { background: ${T.paper}; color: ${T.err}; border: 1px solid ${fon(T.err, 0.5)}; }
        .it-gap { font-size: 9.5px; line-height: 1.35; color: ${T.ink2}; }
        .it-tel-hv { font-size: 10.5px; font-weight: 700; color: ${T.accent}; text-decoration: underline; }
        .it-tel-kun { margin-top: 2px; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.05em; }
        .it-karta { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; color: ${T.ink2}; }
        .it-karta b { font-size: 12px; color: ${T.ink}; }
        .it-son { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: ${T.ink}; margin-top: 2px; }
        .it-son.katta { font-size: 22px; animation: fu-pop .4s cubic-bezier(.3,1.5,.5,1); }
        .it-tel-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; } .it-tel-joy { font-size: 12px; color: ${T.ink2}; }
        .it-hv-chip { align-self: flex-start; margin-top: 6px; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 10px; }
        .it-hv-chip.uch { animation: fu-hvuch 1.3s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fu-hvuch { 0% { transform: none; opacity: 1; } 55% { transform: translate(28px, -26px) scale(.92); opacity: 1; } 100% { transform: translate(28px, -26px) scale(.92); opacity: 0; } }
        .it-sorov { margin-top: 4px; padding: 8px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.ink}; font-size: 11.5px; text-align: center; box-shadow: 0 8px 18px -10px rgba(${T.shadowBase},0.4); }
        .it-qadamlar { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .it-qy { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 6px; }
        .it-qy-b { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 2px 8px; }
        .it-qy-b b { font-family: 'JetBrains Mono', monospace; color: ${T.ink2}; animation: fu-pop .35s ease-out; }
        .it-qy-b.on { border-color: ${T.ok}; color: ${T.ink}; } .it-qy-b.on b { color: ${T.ok}; }
        code.it-qid { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 3px 8px; }
        /* Jadval — «ma'lumot» (E 45): to'q sarlavha qatori, katak chiziqlari, kulrang fon, soyasiz */
        .it-jadval { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.bg}; min-width: 0; }
        .it-jq { display: grid; grid-template-columns: 58px minmax(0,1.35fr) minmax(0,1.2fr) 66px minmax(0,0.95fr) auto; gap: 8px; align-items: start; padding: 8px 10px; border-top: 1px solid ${T.line}; font-size: 12px; line-height: 1.38; color: ${T.ink}; overflow-wrap: anywhere; }
        .it-jq.bosh { overflow-wrap: normal; border-top: 0; background: ${T.ink}; color: ${T.paper}; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em; }
        .it-jq:not(.bosh) { animation: fu-sirg .45s ease-out both; }
        .it-jq.yangi { animation: fu-sirg .45s ease-out both, fu-yashil 1.1s ease-out both; }
        .it-jq.kulrang { color: ${T.ink2}; }
        .it-jq-n { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.accent}; }
        .it-jq-son { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; }
        .it-jq-em { display: block; font-style: normal; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; }
        .it-bosqich { white-space: nowrap; }
        button.it-nuqta { font-family: 'Manrope', sans-serif; }
        .it-jadval.it-yub { background: ${T.paper}; }
        .fu-tahrir { width: 26px; height: 26px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; font-size: 13px; }
        .it-chiziq { padding: 28px 16px 10px; border-top: 1px solid ${T.line}; }
        .it-chiziq-t { position: relative; height: 8px; border-radius: 999px; background: ${fon(T.ink, 0.1)}; }
        .it-chiziq-f { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 999px; background: ${T.accent}; transition: width .8s cubic-bezier(.4,0,.2,1); }
        .it-chiziq-b { position: absolute; top: -24px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; }
        .it-chiziq-b b { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; color: ${T.accent}; }
        .it-chiziq-b::after { content: ''; width: 2px; height: 14px; background: ${T.accent}; margin-top: 1px; }
        .it-chiziq-b.yangi b { animation: fu-pop .4s ease-out; }
        .it-chiziq-h { position: absolute; top: 10px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; }
        .it-chiziq-h::before { content: ''; width: 2px; height: 10px; background: ${T.ok}; }
        .it-chiziq-h b { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; color: ${T.ok}; }
        .it-chiziq-s { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 24px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; }
        .it-chiziq-y { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; color: ${T.accent}; }
        .it-sanoq { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
        .it-sk { display: flex; flex-direction: column; gap: 3px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; animation: fu-kir .45s ease-out both; min-width: 0; }
        .it-sk + .it-sk { animation-delay: .12s; }
        .it-sk-l { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .it-sk-s { font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 800; color: ${T.ink}; line-height: 1.1; }
        .it-sk-o { font-size: 11.5px; line-height: 1.4; color: ${T.ink2}; }
        .it-sanoq.kichik { margin-bottom: 12px; }
        .it-sanoq.kichik .it-sk { padding: 8px 12px; } .it-sanoq.kichik .it-sk-s { font-size: 20px; }
        .it-yub-h { display: flex; justify-content: space-between; align-items: center; padding: 9px 12px; background: ${T.ink}; color: ${T.paper}; font-size: 12.5px; }
        .it-yub-h span { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
        .it-yq { display: grid; grid-template-columns: 78px minmax(0,1.4fr) minmax(0,1.1fr) auto; gap: 8px; align-items: baseline; padding: 9px 12px; border-top: 1px solid ${T.line}; font-size: 12.5px; color: ${T.ink}; animation: fu-sirg .45s ease-out both; }
        .it-yq.yangi { animation: fu-sirg .45s ease-out both, fu-yashil 1.1s ease-out both; }
        .it-yq-x { color: ${T.err}; font-weight: 700; }
        .it-yq-a { font-size: 11.5px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 2px 9px; white-space: nowrap; }
        /* Ekran tuzilishi: maket chapda, jadval o'ngda (SABOQ 21/26); tugagach natija fokusda (DE-199) */
        .fu-split { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: clamp(16px,2.6vw,28px); align-items: start; }
        .fu-ong { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .fu-fokus { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 760px; margin: 0 auto; }
        .fu-harakat { display: flex; justify-content: flex-start; }
        .fu-yakka { display: flex; justify-content: center; }
        .fu-yakka > .it-maket { width: 300px; max-width: 100%; }
        .fu-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; opacity: 0.85; margin-left: 4px; }
        .fu-joriy-q { display: flex; flex-direction: column; gap: 6px; }
        p.fu-joriy { margin: 0; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; animation: fu-kir .45s ease-out both; }
        .fu-yorliq { align-self: center; font-size: 11.5px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 11px; }
        /* Taxmin va izoh yashil xulosa ichida (E 42): kichik qatorlar 12.5px */
        .fu-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .fu-tx b { color: ${T.ink}; } .fu-tx.ok, .fu-tx.ok b { color: ${T.ok}; } .fu-tx b.yoq { color: ${T.err}; }
        .fu-izoh { display: block; margin-top: 8px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.25)}; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .fu-bashq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 9px 14px; border-radius: 12px; background: ${T.accentSoft}; font-size: 13px; color: ${T.ink2}; }
        .fu-bashq-t b { color: ${T.accent}; }
        .fu-uch { position: fixed; z-index: 1200; pointer-events: none; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 8px; padding: 4px 10px; max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); animation: fu-uchish .8s cubic-bezier(.4,0,.2,1) forwards; }
        p.fu-past { margin: 0; font-size: 12px; line-height: 1.55; color: ${T.ink2}; }
        p.fu-past.mono { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        .fu-rj { display: flex; flex-direction: column; gap: 14px; padding: 14px; border: 1.5px solid ${T.line}; border-radius: 14px; background: ${T.paper}; }
        .fu-rj-ustun { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .fu-rj-b { padding: 10px 6px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; text-align: center; font-size: 12px; font-weight: 700; color: ${T.ink2}; animation: fu-kir .45s ease-out var(--d, 0s) both; }
        .fu-rj-yol { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
        .fu-rj-chiz { position: absolute; left: 12%; right: 12%; top: 50%; height: 2px; background: ${T.accent}; transform-origin: left; animation: fu-chiz 2.2s ease-out .8s both; }
        .fu-rj-k { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 4px; align-items: center; justify-content: center; min-height: 74px; padding: 6px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; text-align: center; animation: fu-kir .45s ease-out var(--d, 0s) both; }
        .fu-rj-k b { font-size: 10.5px; color: ${T.ink}; }
        .fu-rj-k i { font-style: normal; font-size: 10.5px; color: ${T.ink2}; }
        .fu-rj-k.tel { border-color: ${T.ink}; border-radius: 12px; } .fu-rj-k.tel b { color: ${T.ok}; }
        .fu-rj-k.chat i { background: ${T.bg}; border-radius: 8px 8px 8px 2px; padding: 2px 6px; }
        .fu-rj-k.br i { background: ${T.accent}; color: #fff; border-radius: 6px; padding: 2px 6px; font-weight: 800; }
        /* Mustaqil ish: bir vaqtda bitta katta karta (E 53), yorliq input ichida (E 43) */
        .fu-s5 { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 640px; }
        .fu-s5 > .it-chiziq { border-top: 0; padding: 26px 8px 2px; }
        p.fu-kirish-q { margin: 0; font-size: 13px; line-height: 1.5; color: ${T.ink2}; }
        .fu-karta { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 10px; transition: background .3s; min-width: 0; }
        .fu-karta.err { background: ${T.errFon}; }
        .fu-kirish { animation: fu-karta-k .45s cubic-bezier(.3,1.2,.5,1) both; }
        .fu-kanal-chip { display: flex; flex-wrap: wrap; gap: 6px; }
        .fu-mz { position: relative; display: flex; align-items: center; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.paper}; transition: border-color .2s, box-shadow .2s; min-width: 0; }
        .fu-mz:focus-within { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.15)}; }
        .fu-mz.err { border-color: ${T.err}; background: ${T.errFon}; }
        .fu-mz-n { flex: none; padding: 0 10px; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; border-right: 1px solid ${T.line}; white-space: nowrap; }
        .fu-inp { flex: 1; min-width: 0; border: 0; background: transparent; outline: none; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 500; color: ${T.ink}; padding: 10px 12px; }
        .fu-mz.son .fu-inp { font-family: 'JetBrains Mono', monospace; }
        .fu-mz-y { flex: none; padding: 0 10px; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .fu-qachon { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .fu-qachon .fu-mz-n { border-right: 0; padding-left: 0; }
        .fu-karta-tug { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .fu-karta-tug .fu-yordam-btn { margin-left: auto; }
        p.fu-yordam { margin: 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 10px 12px; }
        .fu-oklar { display: flex; flex-direction: column; gap: 6px; }
        .fu-ok-q { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .fu-ok { display: flex; align-items: baseline; gap: 8px; text-align: left; padding: 7px 10px; border-radius: 10px; border: 1px solid ${fon(T.ok, 0.35)}; background: ${fon(T.ok, 0.06)}; font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.ink}; cursor: pointer; min-width: 0; }
        .fu-ok:hover { border-color: ${T.ok}; }
        .fu-ok i { font-style: normal; font-weight: 800; color: ${T.ok}; }
        .fu-ok span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
        .fu-ok.yangi { animation: fu-yashil 1.1s ease-out both; }
        .fu-kulrang { display: block; font-size: 12px; color: ${T.ink2}; }
        /* Amaliyot bloki: bo'lim ichidagi elementlar <span> (QBlok matni <p> ichida) */
        .fu-blok { display: contents; }
        .fu-qulf .q-blok-q.joriy .q-btn:not(.q-2) { opacity: 0.45; pointer-events: none; }
        .fu-band { display: block; margin-top: 6px; }
        .q-blok-t > .fu-band.bir:first-of-type { display: inline; margin: 0; }
        .fu-band.ich { padding-left: 18px; margin-top: 2px; }
        .fu-band.kulrang { font-size: 12px; color: ${T.ink2}; }
        .fu-ps { display: block; }
        .fu-joy-n { margin-left: 6px; font-size: 11.5px; color: ${T.ink2}; }
        .fu-prompt-tug { display: inline-flex; align-items: center; gap: 6px; }
        .fu-prompt-ed { width: 26px; height: 26px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; }
        .fu-prompt-ta { display: block; width: 100%; margin-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.5; padding: 8px 10px; border-radius: 10px; border: 1.5px solid ${T.accent}; background: ${T.paper}; color: ${T.ink}; resize: vertical; }
        .fu-yordam-p { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .fu-yp-y { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .fu-yp { font-size: 12px; line-height: 1.5; color: ${T.ink}; overflow-wrap: anywhere; }
        .fu-belgilar, .fu-tanlov { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .fu-belgi-y { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .fu-belgi-g { display: flex; flex-wrap: wrap; gap: 6px; }
        .fu-qism { display: flex; flex-direction: column; gap: 2px; margin-top: 10px; padding-top: 8px; border-top: 1px solid ${T.line}; }
        .fu-qism-h { font-size: 13.5px; color: ${T.ink}; }
        .fu-post { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .fu-post-h { display: flex; justify-content: space-between; align-items: center; }
        .fu-post-ta { width: 100%; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.5; padding: 8px 10px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; resize: vertical; }
        .fu-post-ta:focus { outline: none; border-color: ${T.accent}; }
        .fu-xavf { display: flex; flex-direction: column; gap: 5px; margin-top: 4px; }
        .fu-xb { display: flex; gap: 8px; align-items: flex-start; padding: 5px 8px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; font-size: 12.5px; line-height: 1.45; color: ${T.ink}; cursor: pointer; }
        .fu-xb.on { border-color: ${fon(T.ok, 0.45)}; background: ${T.okFon}; }
        .fu-xb input { margin-top: 2px; flex: none; accent-color: ${T.ok}; }
        .fu-xavf-o { margin-top: 2px; font-size: 12px; color: ${T.ink2}; }
        .fu-sonlar { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; max-width: 460px; }
        .fu-trek { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .fu-chorla { display: flex; flex-wrap: wrap; gap: 6px; }
        p.fu-ulgur, p.fu-web { margin: 6px 0 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; }
        p.fu-web b { color: ${T.ink}; }
        p.fu-ortda { margin: 6px 0 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        code.fu-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; }
        .fu-natija { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .fu-natija-q { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
        .fu-neon { flex: 1; min-width: 180px; display: flex; flex-direction: column; gap: 3px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .fu-neon-h { font-size: 12px; color: ${T.ink}; }
        .fu-neon code { margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink}; overflow-wrap: anywhere; }
        .fu-neon-r { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ok}; }
        .fu-term { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 12px; background: ${CODE.bg}; }
        .fu-term code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${CODE.attr}; overflow-wrap: anywhere; }
        .fu-term-k { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${CODE.comment}; }
        .fu-a2-oyna .it-oyna { height: auto; }
        .fu-a2-oyna .it-kor { overflow: visible; }
        /* Kartochka halqasi yengil (E 49): ingichka chegara, puls 3 marta */
        .fu-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 1.5px ${T.accent}; animation: fu-halqa-k 2.4s ease-in-out .4s 3; }
        @keyframes fu-halqa-k { 0%, 100% { box-shadow: 0 0 0 1.5px ${T.accent}; } 50% { box-shadow: 0 0 0 1.5px ${T.accent}, 0 0 0 6px ${fon(T.accent, 0.22)}; } }
        p.fu-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.fu-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: fu-nuqta 2.4s ease-in-out 3; }
        .fu-hw { display: flex; flex-direction: column; gap: 12px; }
        .fu-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .fu-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .fu-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .fu-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.fu-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .fu-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .fu-hw-qadam li i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .fu-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .fu-yakun { display: contents; }
        .fu-yakun.belgisiz .done-chip .tick { display: none; }
        @keyframes fu-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes fu-yoz { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
        @keyframes fu-sirg { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
        @keyframes fu-yashil { 0%, 45% { background: ${T.okFon}; } 100% { background: transparent; } }
        @keyframes fu-tush { from { opacity: 0; transform: translateY(-14px) scale(0.6); } to { opacity: 1; transform: none; } }
        @keyframes fu-pop { from { transform: scale(1.3); } to { transform: none; } }
        @keyframes fu-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        @keyframes fu-puf { from { opacity: 0; transform: translateY(14px) scale(0.96); } to { opacity: 1; transform: none; } }
        @keyframes fu-silk { 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        @keyframes fu-ket { to { opacity: 0; transform: translateX(-20px); } }
        @keyframes fu-chiz { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes fu-karta-k { from { opacity: 0; transform: translateX(18px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes fu-uchish { to { transform: translate(var(--dx), var(--dy)) scale(0.92); opacity: 0.15; } }
        @keyframes fu-nuqta { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        @media (max-width: 760px) { .fu-split { grid-template-columns: minmax(0, 1fr); } }
        @media (max-width: 640px) {
          .it-maket-r { height: 290px; }
          .it-jq { grid-template-columns: 40px minmax(0,1.2fr) minmax(0,1.1fr) 46px minmax(0,0.9fr) auto; gap: 5px; padding: 7px 8px; font-size: 11px; }
          .it-jq.bosh { font-size: 8.5px; letter-spacing: 0; }
          .it-jq-son { font-size: 12px; }
          .it-yq { grid-template-columns: minmax(0, 1fr); gap: 2px; }
          .it-yq-a { justify-self: start; }
          .fu-hw-karta { grid-template-columns: minmax(0, 1fr); }
          .fu-rj-yol { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .fu-rj-chiz { display: none; }
          .fu-mz { flex-wrap: wrap; }
          .fu-mz-n { width: 100%; padding-top: 6px; border-right: 0; }
          .it-sk-s { font-size: 24px; }
          .fu-harakat { justify-content: flex-end; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fu-halqa, .fu-mz.fu-halqa-i, .fu-s0.kutish .q-variant, .q-bashorat .q-chip, .fu-chorla > .q-chip, .it-chat-t, p.it-puf, .it-url-t, .it-havolalar, .it-uyalar i,
          .it-ekran, .it-maydon.silk, .it-maydon.yangi, .it-son.katta, .it-hv-chip.uch, .it-qy-b b, .it-jq, .it-yq, .it-chiziq-b b, .it-sk, p.fu-joriy, .fu-rj-b, .fu-rj-chiz, .fu-rj-k,
          .fu-kirish, .fu-ok.yangi, .fu-uch, .fu-flash.yangi .fc-card:not(.flip) .fc-front, p.fu-fc-ipucha i { animation: none !important; }
          .it-ichi, .it-chiziq-f { transition: none !important; }
          .it-maydon.silk { opacity: 0; }
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
