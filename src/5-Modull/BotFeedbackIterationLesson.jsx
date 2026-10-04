import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 5-MODUL (Telegram bot + AI) · DARS 9 — «FIKR VA ITERATSIYA» — PLATFORM STANDARD v18 (AUDIOSIZ)
// v3 (F-1002-112, amaliyot-qolip: feedback/F-1002-mexanizm/09-BotFeedbackIteration-v2.md) — 8 ekran + 3 amaliyot bloki = 11.
// Natija: botning v2 si serverda — 8-dars suhbatidagi eng muhim fikr tuzatilgan, eskisi buzilmagan, o'sha odamdan qayta so'ralgan.
// EKRANLAR: s0 hook (4 xabar) · s1 bugun quramiz · s2 fikr turi va aniqligi · A1 FIKRLAR.md · s3 test (bug) · s4 nimani birinchi
//   (chastota × ta'sir) · A2 tuzatish laptopda · s5 test (narx 18 vs glutensiz 3) · A3 v2 serverga + qayta o'lchash · podium · s6 yakun.
// Blok = ScreenBlok (7-dars bilan bir xil; A1 o'ngda FIKRLAR.md fayl-kartasi, A3 o'ngda terminal).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  danger: '#C2362B', dangerSoft: '#FAE3E0', amber: '#B45309',
  line: '#E9E6DF',
  shadowBase: '58, 53, 48'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };

// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext } from '../live/index.js';







const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const AchMissCtx = createContext(null); // 🏅 151-qonun: { missed:Set<ekran id>, miss(idx, bosqich?), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
// Analitika-payload uchun UZ-etalon (4-Modul konvensiyasi): jonli/statistika doim UZ matn ko'radi.
const ou = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node.uz ?? node.ru ?? '';
};

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

const LESSON_META = { lessonId: 'bot-feedback-05-06-v18', lessonTitle: { uz: 'Foydalanuvchi fikri va iteratsiya', ru: 'Отзывы пользователей и итерация' } };
// 11 ekran: hook → bugun quramiz → fikr turi → A1 → test → nimani birinchi → A2 → test → A3 → podium → yakun (kartochkalar ichida)
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'a3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'summary',     template: 'custom',   scored: false, scope: null }
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
        {hasContent && <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={tr(big ? { uz: 'Kichraytirish', ru: 'Уменьшить' } : { uz: 'Kattalashtirish', ru: 'Увеличить' })} title={tr(big ? { uz: 'Kichraytirish', ru: 'Уменьшить' } : { uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>}
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
      <button className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Nishonlar" title="Nishonlar">
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && (
        <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">{tr({ uz: 'Nishonlar', ru: "Значки" })} — {count}/{total}</div>
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
              <div className="mono small" style={{ color: T.ink3, whiteSpace: 'nowrap' }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
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
const NavNext = ({ disabled, label = { uz: 'Davom etish', ru: 'Продолжить' }, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: "Подождите ментора" }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(label))}</button>;
};

const FeedbackBlock = ({ show, isCorrect, neutral, children }) => {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (show) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => { setVisible(true); setTimeout(() => { if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 350); })); }
    else { setVisible(false); const t = setTimeout(() => setMounted(false), 400); return () => clearTimeout(t); }
  }, [show]);
  if (!mounted) return null;
  return <div ref={ref} className={`feedback-block ${visible ? 'visible' : ''}`}><div className={neutral ? 'frame-wait' : isCorrect ? 'frame-success' : 'frame-soft'}>{children}</div></div>;
};

const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `s15` — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi — shu map ular bilan sinxron bo'lsin.
// ⚡ To'g'ri javob pozitsiyalari ATAYIN har xil (1 · 2 · 0 · 3) — «doim A» naqshi yo'q, o'qimay bosgan ball to'plamaydi.
// s15 (yakuniy) — REAL kalit: picked=0 → 1-urinishda topdi (to'g'ri), picked=1 → 1-urinishda xato bosdi.
const INLINE_KEYS = { s3: 1, s5: 2, practice: -1 }; // 2 test: s3 (B) · s5 (C); amaliyot bloklari ball bermaydi
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI). Matn 🎓 Metodist tomonidan sayqallanadi.
const RECAPS = {
  4: {
    title: { uz: 'Uch tur, ikki aniqlik', ru: "Три вида, две точности" },
    cards: [
      { ic: '1', h: { uz: 'Bug', ru: "Баг" }, body: { uz: "Bor narsa noto'g'ri ishlayapti. Tuzatiladi.", ru: "То, что есть, работает неправильно. Чинится." } },
      { ic: '2', h: { uz: 'Taklif', ru: "Предложение" }, body: { uz: "Yo'q narsa so'ralgan. O'ylab ko'riladi.", ru: "Просят то, чего нет. Обдумывается." } },
      { ic: '3', h: { uz: 'Maqtov', ru: "Похвала" }, body: { uz: 'Nima yaxshi ishlayotganini aytadi. Buzilmasin.', ru: "Говорит, что работает хорошо. Не сломать." }, ask: { uz: '«Manzilimni 2 marta so\'radi» — qaysi tur?', ru: "«Спросил адрес 2 раза» — какой вид?" } },
    ]
  },
  7: {
    title: { uz: "Chastota va ta'sir", ru: "Частота и влияние" },
    cards: [
      { ic: '18', h: { uz: 'Chastota', ru: "Частота" }, body: { uz: 'Nechta odam aytgan.', ru: "Сколько человек сказали." } },
      { ic: '2', h: { uz: "Ta'sir", ru: "Влияние" }, body: { uz: "Buyurtma to'xtaydimi yoki shunchaki noqulaymi.", ru: "Останавливается ли заказ или просто неудобно." } },
      { ic: '3', h: { uz: '«Hozir emas»', ru: "«Не сейчас»" }, body: { uz: 'Kam odamga kerak narsa navbatda turadi.', ru: "То, что нужно немногим, ждёт в очереди." }, ask: { uz: '18 kishi narx, 3 kishi glutensiz — birinchi nima?', ru: "18 человек — цена, 3 — без глютена: что первым?" } },
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
        <span className="rc-tag">{tr({ uz: 'Qayta tushuntirish', ru: "Объясняем заново" })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{tr(card.vis)}</div>}
        {card.ask && <div className="rc-ask">{tr({ uz: 'Sinfga savol:', ru: "Вопрос классу:" })} {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
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
        <span className="mstats-lbl">{tr({ uz: '📊 Jonli natija', ru: '📊 Живой результат' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri ✅", ru: 'верно ✅' })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'xato ❌', ru: 'неверно ❌' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ожидаем ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ожидаем ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и сколько ✅/❌ — пока скрыто. По кнопке «Открыть результат» всё откроется сразу и у вас, и на экранах учеников.' })}</p>
      )}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
          const n = data.rows.filter(a => a.picked === i).length;
          const pct = answered ? Math.round((n / answered) * 100) : 0;
          const isC = reveal && i === correctIdx;
          const col = isC ? T.success : MSTATS_COLORS[i % 4];
          return (
            <div key={i} className={`mstats-row ${reveal && !isC ? 'dimmed' : ''}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? '✓' : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round((n / maxN) * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? `${n} ${tr({ uz: "o'quvchi", ru: 'учеников' })} · ${pct}%` : '—'}</span>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тема классу не зашла. Перед продолжением стоит быстро её повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: 'Qayta tushuntirish —', ru: 'Объяснить заново —' })} {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 Верно <b>{pct}%</b> — неплохо. При желании повторите тему перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ Верно <b>{pct}%</b> — класс освоил тему. Спокойно продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: `Javob berganlar kam (${answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.`, ru: `Ответивших мало (${answered}) — по процентам судить трудно. Оцените сами.` })}</p>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr({ uz: '⏳ Kutilmoqda:', ru: '⏳ Ожидаем:' })}</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Объясните заново.' })}</p>}
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
    <Stage eyebrow={tr(eyebrow)} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : (oneShot ? { uz: 'Javob tanlang', ru: 'Выберите ответ' } : { uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: 'flex-start', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{tr(question)}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: "Живой урок — одна попытка, подумайте перед нажатием!" })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: picked !== null ? 8 : 11 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; } // reveal'gacha hammasi neytral
            } else if (solved) {
              if (waiting) { if (i === picked) cls += ' option-wait'; } // faqat neytral belgi — to'g'ri/xato hali sir
              else { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; if (wrongLocked && i === picked) cls += ' option-picked-wrong'; }
            }
            else if (i === picked) cls += ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(tr(opt))}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? <>{tr({ uz: "✓ To'g'ri javob:", ru: '✓ Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
              : waiting
                ? tr({ uz: 'Javobingiz qabul qilindi', ru: "Ваш ответ принят" })
                : wrongLocked
                  ? <>{tr({ uz: "To'g'ri javob:", ru: 'Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(tr(explainCorrect))
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
                : wrongLocked
                  ? fmtCode(tr(explainWrong[picked] ?? explainWrong.default))
                  : solved ? fmtCode(tr(explainCorrect)) : fmtCode(tr(explainWrong[picked] ?? explainWrong.default))}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi.
              Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — посмотреть тему ещё раз" })}</button>
          )}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.success : T.accent;
  const R = 50, ST = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState(C);
  useEffect(() => { const t = setTimeout(() => setOff(C * (1 - PCT)), 200); return () => clearTimeout(t); }, [C, PCT]);
  return (
    <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink3 + '40'} strokeWidth={ST} />
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue">{tr({ uz: " · ko'rsatmani ochish ▾", ru: ' · раскрыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

const Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;

// ===== MOCK TERMINAL =====
const Term = ({ title = 'Terminal', children, minH }) => (
  <div className="term"><div className="term-bar"><span className="bb-dots"><i /><i /><i /></span><span className="term-title">{title}</span></div><div className="term-body" style={{ minHeight: minH }}>{children}</div></div>
);
const TLine = ({ cmd, out, col }) => (
  <div className="el-in tline">{cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : <span style={{ color: col || CODE.comment }}>{out}</span>}</div>
);

// ===== TELEGRAM CHAT (jonli ko'rinish) =====
// F-1002-85 · 169-qonun: chat oynasi balandligi cheklangan (CSS .tg-body max-height), har yangi xabarda eng pastga tushadi
// 5-Modul yopish Q2 (169 davomi, 04.10): amaliyot chati ekranga sig'adi — balandlik pastki panelgacha qolgan joydan
// o'lchanadi, sig'magan xabarlar chat ichida skrol bo'ladi (oxirgi xabar ko'rinadi). Telefonda (≤768) va kattalashtirilgan oynada — CSS chegarasi.
const useChatFit = (ref, on) => {
  const [h, setH] = useState(null);
  useEffect(() => {
    if (!on || typeof window === 'undefined') return;
    const fit = () => {
      const el = ref.current;
      const box = el && el.closest('.stage-content');
      const tg = el && el.closest('.tg');
      const col = tg && tg.parentElement;
      if (!el || !box || !col || window.innerWidth <= 768) { setH(null); return; }
      const r = el.getBoundingClientRect();
      const k = el.offsetHeight / (r.height || 1);            // --lz masshtabi: CSS px / ekran px
      const b = box.getBoundingClientRect();
      const last = col.lastElementChild;
      const tail = last ? last.getBoundingClientRect().bottom - r.bottom : 0;   // chatdan keyingi qism (izoh qatori)
      const pad = parseFloat(getComputedStyle(box).paddingBottom) || 0;
      const joy = b.bottom - pad / k - (r.top + box.scrollTop / k) - Math.max(0, tail);
      setH(Math.max(180, Math.floor(joy * k)));
    };
    fit();
    const t = setTimeout(fit, 350);
    window.addEventListener('resize', fit);
    return () => { clearTimeout(t); window.removeEventListener('resize', fit); };
  }, [on]); // eslint-disable-line
  return h;
};
const TgBody = ({ minH, fit, children }) => {
  const ref = useRef(null);
  const fitH = useChatFit(ref, fit);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.scrollHeight <= el.clientHeight + 2) return;
    let kam = false; try { kam = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* eski brauzer */ }
    el.scrollTo({ top: el.scrollHeight, behavior: kam ? 'auto' : 'smooth' });
  });
  return <div className="tg-body" ref={ref} style={{ minHeight: minH, ...(fitH ? { maxHeight: fitH } : null) }}>{children}</div>;
};
const TgChat = ({ fit, title = 'AvtoPizza', children, minH }) => (
  <div className="tg">
    <div className="tg-head"><span className="tg-ava">{String(tr(title)).charAt(0)}</span><span className="tg-name">{tr(title)}<span className="tg-status">{tr({ uz: 'bot · onlayn', ru: 'бот · онлайн' })}</span></span></div>
    <TgBody minH={minH} fit={fit}>{children}</TgBody>
  </div>
);
const Bubble = ({ from = 'bot', children, muted }) => <div className={`tg-bubble ${from} el-in ${muted ? 'muted' : ''}`}>{children}</div>;
const TgBtns = ({ items }) => <div className="tg-btns el-in">{items.map((b, i) => <span key={i} className="tg-btn">{b}</span>)}</div>;
// ===== SCREEN 0 — HOOK: bir hafta o'tdi, 4 xabar keldi =====
// A6: kirganda — chat (birinchi xabar) va tugma; bosilgach uch xabar birin-ketin → savol va 3 variant → izoh.
const HOOK_MSGS = [
  { uz: "Narxni ko'rsatmaydi, noqulay", ru: 'Не показывает цену, неудобно' },
  { uz: "Manzilimni 2 marta so'radi", ru: "Спросил мой адрес 2 раза" },
  { uz: "Glutensiz pitsa qo'shing!", ru: "Добавьте безглютеновую пиццу!" },
  { uz: 'Tez va qulay, rahmat!', ru: "Быстро и удобно, спасибо!" }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [msgs, setMsgs] = useState(storedAnswer ? 3 : 0);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const tried = msgs > 0;
  const qOpen = msgs >= 3;
  const tRef = useRef([]);
  useEffect(() => () => tRef.current.forEach(clearTimeout), []);
  const poke = () => {
    if (tried) return;
    setMsgs(1); setSc(n => n + 1);
    tRef.current.push(setTimeout(() => { setMsgs(2); setSc(n => n + 1); }, 550));
    tRef.current.push(setTimeout(() => { setMsgs(3); setSc(n => n + 1); }, 1100));
  };
  const OPTS = [
    { id: 'a', label: { uz: "Hech narsa: bot ishlayapti, shikoyat bo'lib turadi", ru: "Ничего: бот работает, жалобы бывают всегда" } },
    { id: 'b', label: { uz: "Fikrlarni o'qib, eng ko'p takrorlanganini tuzataman", ru: "Прочитаю отзывы и починю то, что повторяется чаще всего" } },
    { id: 'c', label: { uz: "Botni noldan, butunlay qayta yozaman", ru: "Перепишу бота с нуля, полностью" } }
  ];
  const pick = (v) => { if (picked !== null || !qOpen) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: "Введение" })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr({ uz: <>Mijozlar yoza boshladi. <span className="italic" style={{ color: T.accent }}>Birinchi</span> nima qilasiz?</>, ru: <>Клиенты начали писать. Что вы сделаете <span className="italic" style={{ color: T.accent }}>первым</span>?</> })}</h1>
        <Mentor>{tr({ uz: <>Botingiz bir haftadan beri serverda, odamlar uni siz o'ylamagan tomondan ishlatdi — <b style={{ color: T.ink }}>«▶ Mijozlar nima dedi?»</b>ni bosing.</>, ru: <>Ваш бот неделю на сервере, люди пользовались им не так, как вы думали — нажмите <b style={{ color: T.ink }}>«▶ Что сказали клиенты?»</b>.</> })}</Mentor>
        <Zoomable><Split>
          <Col>
            <TgChat title="AvtoPizza" minH={140}>
              {HOOK_MSGS.map((m, i) => (i === 0 || msgs >= i) && <Bubble key={i} from="user">{tr(m)}</Bubble>)}
            </TgChat>
            <button className={`btn ${tried ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} onClick={poke} disabled={tried}>{tried ? tr({ uz: '✓ Fikrlar keldi', ru: '✓ Отзывы пришли' }) : tr({ uz: "▶ Mijozlar nima dedi?", ru: '▶ Что сказали клиенты?' })}</button>
          </Col>
          <Col>
            {qOpen && <>
              <p className="eyebrow fade-up" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Birinchi nima qilasiz?', ru: "Что вы сделаете первым?" })}</p>
              <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {OPTS.map(o => {
                  const on = picked === o.id;
                  return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>);
                })}
              </div>
            </>}
            {picked === 'b' && <p className="hook-ack fade-step">{tr({ uz: <><b>Aynan!</b> Tinglaysiz, eng muhimini tuzatasiz, yana tinglaysiz. Shu takror — iteratsiya.</>, ru: <><b>Именно!</b> Слушаете, чините самое важное, снова слушаете. Этот повтор — итерация.</> })}</p>}
            {picked !== null && picked !== 'b' && <p className="hook-ack fade-step">{tr({ uz: <><b>Qiziq fikr!</b> Shikoyat o'zi tuzalmaydi, noldan yozsangiz ishlayotgani ham ketadi. Eng muhimi tuzatiladi, yana tinglanadi.</>, ru: <><b>Интересная мысль!</b> Жалоба сама не исчезнет, а с нуля пропадёт и то, что работает. Чинят самое важное и снова слушают.</> })}</p>}
          </Col>
        </Split></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — BUGUN QURAMIZ: v2 serverda chati + 3 qadam + teglar =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { uz: 'Saralash — 8-dars javoblaridan FIKRLAR.md, bittasini tanlaysiz', ru: "Разбор — из ответов 8-го урока FIKRLAR.md, выбираете один" },
    { uz: 'Tuzatish — laptopda Antigravity bilan, eskisini buzmay', ru: "Исправление — на ноутбуке с Antigravity, не ломая старое" },
    { uz: "Yangi versiya — git push, Render, telefondan sinash, qayta so'rash", ru: "Новая версия — git push, Render, проверка с телефона, повторный вопрос" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Preview = (
    <Col>
      <p className="flow-label">{tr({ uz: 'dars oxirida — namuna: AvtoPizza · v2', ru: "в конце урока — пример: AvtoPizza · v2" })}</p>
      <TgChat title="AvtoPizza" minH={0} fit>
        <Bubble from="user">{tr({ uz: 'Margarita, Chilonzor 5', ru: 'Маргарита, Чиланзар 5' })}</Bubble>
        <Bubble from="bot">{tr({ uz: "Qabul qilindi: Margarita — 45 000 so'm. Manzil: Chilonzor 5.", ru: "Принято: Маргарита — 45 000 сумов. Адрес: Чиланзар 5." })}</Bubble>
      </TgChat>
      <p className="ab-tail">{tr({ uz: "v1 da narx yo'q edi — 18 kishi yozgan", ru: "в v1 цены не было — написали 18 человек" })}</p>
    </Col>
  );
  const StepsB = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 3 qadam', ru: '3 шага на сегодня' })}</p>
      <ol className="roadmap">{STEPS.map((t, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(t)}</span></span></li>))}</ol>
      <p className="ab-tail fade-up delay-2">repo <code className="qcode">TelegramBotNest</code> · <code className="qcode">dars-09-start</code> · {tr({ uz: 'namuna', ru: 'пример' })} <code className="qcode">dars-09-done</code></p>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Dars oxirida botingizning <span className="italic" style={{ color: T.accent }}>v2</span> si serverda.</>, ru: <>В конце урока <span className="italic" style={{ color: T.accent }}>v2</span> вашего бота на сервере.</> })}</h2></div>
        <Mentor>{tr({ uz: <>8-darsda yozib olgan <b style={{ color: T.ink }}>javoblaringiz</b> bugun ishga tushadi — ulardan bittasini tanlab, tuzatib, serverga chiqarasiz.</>, ru: <>Ответы, которые вы записали на 8-м уроке, сегодня <b style={{ color: T.ink }}>идут в дело</b> — выбираете один, чините и выпускаете на сервер.</> })}</Mentor>
        {!isNarrow ? (<Zoomable><Split>{Preview}{StepsB}</Split></Zoomable>)
          : !showSteps ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{Preview}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "3 qadamni ko'rish", ru: 'Посмотреть 3 шага' })}</button></div>
            : <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Natijani ko'rish", ru: '↩ Посмотреть результат' })}</button>{StepsB}</div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — FIKR TURI VA ANIQLIGI: hook xabarlari bosiladi → teg-karta (bug/taklif/maqtov · aniq/noaniq) =====
const FB_TYPES = [
  { id: 'narx', msg: HOOK_MSGS[0], kind: 'bug', clear: true, why: { uz: 'Joy bor (narx), muammo bor (ko\'rinmaydi). Tuzatiladi.', ru: "Есть место (цена), есть проблема (не видно). Чинится." } },
  { id: 'manzil', msg: HOOK_MSGS[1], kind: 'bug', clear: true, why: { uz: 'Bot kutilgan ishni qilmayapti. Tuzatiladi.', ru: "Бот не делает то, что от него ждут. Чинится." } },
  { id: 'gluten', msg: HOOK_MSGS[2], kind: 'taklif', clear: true, why: { uz: "Botda yo'q narsa. Hozir qo'shilmaydi — ko'pchilikka kerakmi, qaraladi.", ru: "Того, чего в боте нет. Сейчас не добавляется — смотрят, нужно ли многим." } },
  { id: 'rahmat', msg: HOOK_MSGS[3], kind: 'maqtov', clear: false, why: { uz: 'Nima yaxshi ekani aytilmagan; tuzatayotganda buzilmasin.', ru: "Не сказано, что именно хорошо; при починке не сломать." } }
];
const FB_KIND = { bug: { uz: 'Bug', ru: 'Баг' }, taklif: { uz: 'Taklif', ru: 'Предложение' }, maqtov: { uz: 'Maqtov', ru: 'Похвала' } };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(FB_TYPES.map(f => f.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= FB_TYPES.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = FB_TYPES.find(f => f.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · fikr turi', ru: "Понятие · вид отзыва" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `4 xabarni saralang (${seen.size}/4)`, ru: `Разберите 4 сообщения (${seen.size}/4)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har fikr bir xilmi? <span className="italic" style={{ color: T.accent }}>To'rttasini</span> saralang.</>, ru: <>Все отзывы одинаковы? Разберите <span className="italic" style={{ color: T.accent }}>четыре</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Fikr uch turga bo'linadi — bug, taklif, maqtov — va har biri aniq yoki noaniq bo'ladi; <b style={{ color: T.ink }}>chapdagi xabarlarni</b> bosib, har birining tegini ko'ring.</>, ru: <>Отзывы бывают трёх видов — баг, предложение, похвала — и каждый бывает конкретным или нет; нажимайте <b style={{ color: T.ink }}>сообщения слева</b> и смотрите тег каждого.</> })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="fb-list fade-up delay-1">
              {FB_TYPES.map(f => (
                <button key={f.id} className={`fb-msg ${active === f.id ? 'cur' : ''} ${seen.has(f.id) ? 'seen' : ''}`} onClick={() => tap(f.id)}>
                  <span className="fb-msg-t">{tr(f.msg)}</span>
                  <span className={`fb-mk ${seen.has(f.id) ? 'ok' : ''}`}>{seen.has(f.id) ? '✓' : '›'}</span>
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}>
                  <p className="note-h"><span className={`fb-tag ${cur.kind}`}>{tr(FB_KIND[cur.kind])}</span> <span className={`fb-tag ${cur.clear ? 'aniq' : 'noaniq'}`}>{cur.clear ? tr({ uz: 'aniq', ru: 'конкретный' }) : tr({ uz: 'noaniq', ru: 'неконкретный' })}</span></p>
                  <p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.why)}</p>
                </div>
              : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Aniq fikrda joy va muammo bor. Noaniqni avval aniqlashtirasiz: «aynan qayerda?»', ru: "В конкретном отзыве есть место и проблема. Неконкретный сначала уточняете: «где именно?»" })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== AMALIYOT BLOKI (A1 · A2 · A3) — 7-darsdagi ScreenBlok: ochish → prompt/shablon (Nusxalash, {…}) → ishga tushirish → tekshirish.
// O'ngda kutilgan natija: fayl-karta (A1 — FIKRLAR.md), chat (A2) yoki terminal (A3).
const AB_ERR = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: "Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»" };
const AB_TAIL = 'git checkout -f dars-09-start';
function PromptBox({ lines, who }) {
  const [copied, setCopied] = useState(false);
  const plain = lines.map(l => tr(l)).join('\n');
  const copy = async () => { try { await navigator.clipboard.writeText(plain); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  const slot = (t) => t.split(/(\{[^}]+\})/g).map((p, i) => (/^\{.+\}$/.test(p) ? <span key={i} className="ab-slot">{p}</span> : p));
  return (
    <div className="ab-prompt">
      <div className="ab-prompt-h"><span className="ab-who">{tr(who || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button className="ab-copy" onClick={copy}>{copied ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></div>
      {lines.map((l, i) => { const t = String(tr(l)); return <p key={i} className={`ab-line ${/^[|#]/.test(t) ? 'mono' : ''}`}>{slot(t)}</p>; })}
    </div>
  );
}
// Fayl-karta: FIKRLAR.md kabi matnli fayl (mono, satrlar; ★ accent)
const FileCard = ({ name, lines }) => (
  <div className="fcard"><div className="fcard-bar"><span className="bb-dots"><i /><i /><i /></span><span className="fcard-name">{name}</span></div><pre className="fcard-body">{lines.map((l, i) => { const t = String(tr(l)); return <span key={i} className={`fcard-l ${t.includes('★') ? 'star' : ''} ${t.startsWith('#') ? 'h' : ''}`}>{t}{'\n'}</span>; })}</pre></div>
);
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, chat, term, file, chatLabel, doneText, tail }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const [stepN, setStepN] = useState(() => (storedAnswer && storedAnswer.solved ? steps.length : 0));
  const complete = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(title), solved: true, correct: true, picked: true });
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); // 500+ zona — faqat mentor ko'radi
  };
  const markStep = () => { if (isMentorLive) return; const n = Math.min(stepN + 1, steps.length); setStepN(n); if (n >= steps.length) complete(); };
  const undo = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const visibleN = isMentorLive ? steps.length : Math.min(stepN + 1, steps.length);
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr(mentor)}</Mentor>
        <div className="split">
          <Col>
            <div className="lp-steps fade-up delay-1">
              {steps.slice(0, visibleN).map((c, i) => {
                const on = i < stepN && !isMentorLive;
                if (on) return (
                  <div key={i} className="lp-step on">
                    <span className="lp-check">✓</span>
                    <span className="lp-step-t one"><b>{tr(c.h)}</b></span>
                    {!done && <button className="lp-undo" onClick={() => undo(i)} title={tr({ uz: 'Qaytarish', ru: "Вернуть" })} aria-label={tr({ uz: 'Qaytarish', ru: "Вернуть" })}>↻</button>}
                  </div>
                );
                return (
                  <div key={i} className="lp-step cur el-in">
                    <span className="lp-check">{i + 1}</span>
                    <div className="lp-step-body">
                      <span className="lp-step-t"><b>{tr(c.h)}</b> — {fmtCode(tr(c.t))}</span>
                      {c.prompt && <PromptBox lines={c.prompt} who={c.who} />}
                      {c.code && <Term minH={0}>{c.code.map((l, k) => <TLine key={k} cmd={l} />)}</Term>}
                      {c.err && <p className="ab-err">{fmtCode(tr(c.err))}</p>}
                      {!isMentorLive && <button className="btn lp-step-btn" onClick={markStep}>{tr({ uz: 'Bajardim', ru: "Готово" })}</button>}
                    </div>
                  </div>
                );
              })}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{fmtCode(tr(doneText))}</p></div>}
            <MentorPracticeStats live={_live} screen={screen} />
          </Col>
          <Col>
            <p className="flow-label">{tr(chatLabel || { uz: 'kutilgan natija · namuna: AvtoPizza', ru: 'ожидаемый результат · пример: AvtoPizza' })}</p>
            {file ? <FileCard name={file.name} lines={file.lines} />
              : term ? <Term minH={0}>{term.map((l, i) => <TLine key={i} cmd={l.cmd} out={l.out} col={l.col} />)}</Term>
              : <TgChat title="AvtoPizza" minH={0} fit>{chat.map((m, i) => <React.Fragment key={i}><Bubble from={m.from} muted={m.muted}>{tr(m.t)}</Bubble>{m.btns && <TgBtns items={m.btns} />}</React.Fragment>)}</TgChat>}
            <p className="ab-tail">{tail ? tr(tail) : <>{tr({ uz: 'Ortda qoldingizmi — mentor bilan', ru: 'Отстали — вместе с ментором' })} <code className="qcode">{AB_TAIL}</code></>}</p>
          </Col>
        </div>
      </div>
    </Stage>
  );
}
const FIKRLAR_FILE = [
  { uz: '# FIKRLAR — AvtoPizza', ru: '# FIKRLAR — AvtoPizza' },
  { uz: '| № | Fikr                       | Tur    | Aniqmi | Nechta |', ru: '| № | Отзыв                      | Вид    | Точный | Сколько |' },
  { uz: "| 1 | Narxni ko'rsatmaydi        | bug    | aniq   | 18 ★   |", ru: '| 1 | Не показывает цену         | баг    | да     | 18 ★    |' },
  { uz: '| 2 | Tez va qulay, rahmat       | maqtov | noaniq | 6      |', ru: '| 2 | Быстро и удобно, спасибо   | похв.  | нет    | 6       |' },
  { uz: '| 3 | Bot sekin                  | bug    | noaniq | 5      |', ru: '| 3 | Бот медленный              | баг    | нет    | 5       |' },
  { uz: "| 4 | Glutensiz pitsa qo'shing   | taklif | aniq   | 3      |", ru: '| 4 | Добавьте без глютена       | предл. | да     | 3       |' },
  { uz: "| 5 | Manzilimni 2 marta so'radi | bug    | aniq   | 2      |", ru: '| 5 | Спросил адрес 2 раза       | баг    | да     | 2       |' },
  { uz: '', ru: '' },
  { uz: "## Aniq o'zgarish (v2)", ru: '## Конкретное изменение (v2)' },
  { uz: "Buyurtma tasdiq xabarida pitsa narxi ko'rsatilsin.", ru: 'В сообщении-подтверждении заказа показывать цену пиццы.' },
  { uz: "Manzil bir marta so'ralishi o'zgarmasin.", ru: 'Адрес по-прежнему спрашивать один раз.' }
];
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · FIKRLAR.md', ru: 'Практика 1 · FIKRLAR.md' }}
    title={{ uz: <>8-dars javoblaridan bitta <span className="italic" style={{ color: T.accent }}>aniq o'zgarish</span> chiqaring.</>, ru: <>Из ответов 8-го урока выведите одно <span className="italic" style={{ color: T.accent }}>конкретное изменение</span>.</> }}
    mentor={{ uz: <>Odam aytgan gap — shikoyat, Antigravity'ga esa vazifa kerak; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>То, что сказал человек, — жалоба, а Antigravity нужна задача; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da `TelegramBotNest`, yangi fayl `FIKRLAR.md` (repo ildizida). Shablonni «Nusxalash» bilan faylga qo'ying.", ru: "В Antigravity — `TelegramBotNest`, новый файл `FIKRLAR.md` (в корне репозитория). Шаблон — «Скопировать» и вставить в файл." }, who: { uz: 'Shablon → FIKRLAR.md', ru: 'Шаблон → FIKRLAR.md' }, prompt: [
        { uz: '# FIKRLAR — {bot nomi}', ru: '# FIKRLAR — {название бота}' },
        { uz: '| № | Fikr (odam aytgani) | Tur | Aniqmi | Nechta odam |', ru: '| № | Отзыв (что сказал человек) | Вид | Точный | Сколько человек |' },
        { uz: '|---|---|---|---|---|', ru: '|---|---|---|---|---|' },
        { uz: '| 1 | {…} | bug / taklif / maqtov | aniq / noaniq | {…} |', ru: '| 1 | {…} | баг / предложение / похвала | да / нет | {…} |' }
      ] },
      { h: { uz: 'Yozish', ru: 'Записать' }, t: { uz: "8-darsda yozib olgan javoblaringizdan kamida 5 fikr, har biriga tur va aniqmi. Javob yozmagan bo'lsangiz: qo'shningizga botni bering, «qayerda to'xtab qoldingiz?» deb so'rang va yozing.", ru: "Из ответов, записанных на 8-м уроке, минимум 5 отзывов, каждому — вид и точность. Если ответов нет: дайте бота соседу, спросите «где вы остановились?» и запишите." } },
      { h: { uz: 'Tanlash', ru: 'Выбрать' }, t: { uz: "nechta odam aytgan (chastota) va buyurtmani to'xtatadimi (ta'sir) — bittasini ★ bilan belgilang. Noaniq bo'lsa, avval odamdan aniqlashtiring: «aynan qayerda?».", ru: "сколько человек сказали (частота) и останавливает ли заказ (влияние) — один отметьте ★. Если неконкретный, сначала уточните у человека: «где именно?»." } },
      { h: { uz: "Aniq o'zgarish", ru: 'Конкретное изменение' }, t: { uz: "★ fikrni faylning oxiriga bitta gap qilib yozing va qo'shningizga o'qiting: u nima qilish kerakligini tushundimi?", ru: "★ отзыв запишите в конец файла одним предложением и дайте прочитать соседу: понял ли он, что нужно сделать?" }, who: { uz: 'Shablon → FIKRLAR.md', ru: 'Шаблон → FIKRLAR.md' }, prompt: [
        { uz: "## Aniq o'zgarish (v2)", ru: '## Конкретное изменение (v2)' },
        { uz: '{qayerda} da {nima o\'zgarsin}. {nima buzilmasin}.', ru: 'В {где} {что изменить}. {что не сломать}.' }
      ] }
    ]}
    chatLabel={{ uz: 'kutilgan natija · FIKRLAR.md (namuna: AvtoPizza)', ru: 'ожидаемый результат · FIKRLAR.md (пример: AvtoPizza)' }}
    file={{ name: 'FIKRLAR.md', lines: FIKRLAR_FILE }}
    doneText={{ uz: 'Shikoyat vazifaga aylandi. Endi uni Antigravity tushunadi.', ru: "Жалоба стала задачей. Теперь её поймёт Antigravity." }} />
);
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · v2', ru: 'Практика 2 · v2' }}
    title={{ uz: <>Tanlangan fikrni tuzating, <span className="italic" style={{ color: T.accent }}>eskisini</span> buzmang.</>, ru: <>Почините выбранный отзыв, не сломав <span className="italic" style={{ color: T.accent }}>старое</span>.</> }}
    mentor={{ uz: <>Tuzatish laptopda — serverdagi bot shu payt jim turadi, bu normal; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Чиним на ноутбуке — бот на сервере в это время молчит, это нормально; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da `telegram.service.ts`, terminalda `npm run start:dev` → «Telegram bot ulandi» (polling: serverdagi webhook o'chdi, A3 da qaytadi).", ru: "В Antigravity — `telegram.service.ts`, в терминале `npm run start:dev` → «Telegram bot ulandi» (polling: webhook на сервере отключился, вернётся в A3)." } },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "`FIKRLAR.md` dagi aniq o'zgarishni qavsga qo'ying, «Nusxalash», Antigravity'ga.", ru: "конкретное изменение из `FIKRLAR.md` подставьте в скобки, «Скопировать», в Antigravity." }, prompt: [
        { uz: "FIKRLAR.md dagi v2 o'zgarishi: {qayerda} da {nima o'zgarsin}. {nima buzilmasin}. Boshqa joyga tegma, o'zgargan qatorlarni ayt.", ru: "Изменение v2 из FIKRLAR.md: в {где} {что изменить}. {что не сломать}. Остальное не трогай, назови изменённые строки." }
      ] },
      { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: { uz: "terminal xatosiz. Antigravity aytgan qatorlarni o'qing: faqat kerakli joy o'zgarganmi (4 tekshiruv — 5-dars).", ru: "терминал без ошибок. Прочитайте названные строки: изменилось ли только нужное место (4 проверки — 5-й урок)." }, err: AB_ERR },
      { h: { uz: 'Telegramda tekshirish', ru: 'Проверить в Telegram' }, t: { uz: "avval tuzatilgan joy; keyin eski uch narsa: `/start`, menyu tugmalari, bitta buyurtma oxirigacha. Hammasi ishlasa — v2 tayyor.", ru: "сначала исправленное место; потом три старых: `/start`, кнопки меню, один заказ до конца. Всё работает — v2 готова." } }
    ]}
    chatLabel={{ uz: 'kutilgan natija · namuna: AvtoPizza v2', ru: 'ожидаемый результат · пример: AvtoPizza v2' }}
    chat={[
      { from: 'user', muted: true, t: { uz: '«Margarita» bosildi', ru: 'нажата «Margarita»' } },
      { from: 'bot', t: { uz: "Margarita — 45 000 so'm. Buyurtma qabul qilindi. Manzilingizni yozing.", ru: "Margarita — 45 000 сумов. Заказ принят. Напишите ваш адрес." } },
      { from: 'user', t: { uz: 'Chilonzor 5', ru: 'Чиланзар 5' } },
      { from: 'bot', t: { uz: "Buyurtma tasdiqlandi: Margarita — 45 000 so'm · Chilonzor 5", ru: "Заказ подтверждён: Margarita — 45 000 сумов · Чиланзар 5" } }
    ]}
    doneText={{ uz: 'v2 laptopda ishlaydi. Eski narsalar ham joyida.', ru: "v2 работает на ноутбуке. Старое тоже на месте." }} />
);
const ScreenA3 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 3 · Render', ru: 'Практика 3 · Render' }}
    title={{ uz: <>v2 ni serverga chiqaring va <span className="italic" style={{ color: T.accent }}>qayta so'rang</span>.</>, ru: <>Выпустите v2 на сервер и <span className="italic" style={{ color: T.accent }}>спросите снова</span>.</> }}
    mentor={{ uz: <>Tuzatish ishladimi — buni siz emas, o'sha odam aytadi; <b style={{ color: T.ink }}>«1 · Push»</b>dan boshlang.</>, ru: <>Сработало ли исправление — скажет не вы, а тот человек; начните с <b style={{ color: T.ink }}>«1 · Push»</b>.</> }}
    steps={[
      { h: { uz: 'Push', ru: 'Push' }, t: { uz: "laptopdagi botni to'xtating (Ctrl+C), keyin uch buyruq.", ru: "остановите бота на ноутбуке (Ctrl+C), потом три команды." }, code: ['git add -A', 'git commit -m "9-dars: v2 — {nima tuzatildi}"', 'git push'] },
      { h: { uz: 'Render', ru: 'Render' }, t: { uz: "render.com'da xizmatingiz o'zi qayta joylanadi (Auto-Deploy). Loglarda 2–4 daqiqada «Telegram bot ulandi (webhook)».", ru: "на render.com ваш сервис передеплоится сам (Auto-Deploy). В логах через 2–4 минуты «Telegram bot ulandi (webhook)»." }, err: { uz: "Xato bo'lsa, log matnini Antigravity'ga: «Render logida shu xato: {xato}. Sabab nima?»", ru: "Если ошибка — текст лога в Antigravity: «В логе Render такая ошибка: {ошибка}. В чём причина?»" } },
      { h: { uz: 'Telefondan tekshirish', ru: 'Проверить с телефона' }, t: { uz: 'tuzatilgan joy serverda ham ishlaydi (birinchi javob 30–60 s kechikishi mumkin).', ru: 'исправленное место работает и на сервере (первый ответ может задержаться на 30–60 с).' } },
      { h: { uz: "Qayta o'lchash", ru: 'Измерить снова' }, t: { uz: "8-darsdagi odamga yana bering va yana so'rang: «qayerda to'xtab qoldingiz?». Javobni `FIKRLAR.md` ga yozing.", ru: "снова дайте бота человеку с 8-го урока и снова спросите: «где вы остановились?». Ответ запишите в `FIKRLAR.md`." }, who: { uz: 'Shablon → FIKRLAR.md', ru: 'Шаблон → FIKRLAR.md' }, prompt: [
        { uz: '## v2 dan keyin', ru: '## После v2' },
        { uz: '{odam nima dedi} — {shikoyat qoldimi / yo\'qoldimi}. Keyingi: {ro\'yxatdagi navbatdagi fikr}.', ru: '{что сказал человек} — {жалоба осталась / исчезла}. Следующее: {следующий отзыв из списка}.' }
      ] }
    ]}
    chatLabel={{ uz: 'kutilgan natija · terminal + Render log', ru: 'ожидаемый результат · терминал + лог Render' }}
    term={[
      { cmd: 'git push' },
      { out: 'To https://github.com/{siz}/TelegramBotNest.git', col: CODE.str },
      { out: '…' },
      { out: 'Render ▸ Deploying commit 7c1e2b4 "9-dars: v2 — narx"' },
      { out: 'Render ▸ Telegram bot ulandi (webhook)', col: CODE.str }
    ]}
    tail={{ uz: "Bitta iteratsiya: tinglang → tanlang → tuzating → chiqaring → qayta o'lchang.", ru: "Одна итерация: слушайте → выбирайте → исправляйте → выпускайте → измеряйте снова." }}
    doneText={{ uz: 'v2 serverda. Keyingi iteratsiya `FIKRLAR.md` dagi navbatdagi qatordan boshlanadi.', ru: "v2 на сервере. Следующая итерация начнётся со следующей строки в `FIKRLAR.md`." }} />
);

// ===== SCREEN 3 — TEST 1 (fikr turi: bug, correctIdx 1) · badge signalFinder =====
const Screen3 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={{ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' }}
    questionText="Mijoz: «Bot manzilimni 2 marta so'radi». Bu qanday fikr?"
    question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Mijoz: «Bot manzilimni <span className="italic" style={{ color: T.accent }}>2 marta</span> so'radi». Bu qanday fikr?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Клиент: «Бот спросил мой адрес <span className="italic" style={{ color: T.accent }}>2 раза</span>». Какой это отзыв?</h2></> }}
    options={[
      { uz: "Taklif: botda hali yo'q narsa so'ralgan", ru: "Предложение: просят то, чего в боте ещё нет" },
      { uz: "Bug: bot yozilgan manzilni eslab qolmagan", ru: "Баг: бот не запомнил введённый адрес" },
      { uz: "Maqtov: mijoz botdan mamnun ekanini aytgan", ru: "Похвала: клиент говорит, что доволен ботом" },
      { uz: "Shovqin: bunga e'tibor berish shart emas", ru: "Шум: на это можно не обращать внимания" }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Bot kutilgan ishni bajarmayapti — bu bug.", ru: "Бот не делает то, что от него ждут, — это баг." }}
    explainWrong={{
      0: { uz: "Taklif — yo'q narsani so'rash; bu yerda bor narsa buzilgan.", ru: "Предложение — просьба о том, чего нет; здесь сломано то, что есть." },
      2: { uz: "Mijoz bir narsani ikki marta yozdi — bu norozilik.", ru: "Клиент писал одно и то же дважды — это недовольство." },
      3: { uz: "Aksincha, bu aniq fikr: nima buzilgani aytilgan.", ru: "Наоборот, это конкретный отзыв: сказано, что сломалось." },
      default: { uz: "Bu bug: bot kerakli ishni bajarmayapti.", ru: "Это баг: бот не делает нужную работу." }
    }} />
);

// ===== SCREEN 4 — NIMANI BIRINCHI: chastota chizig'i (bar = n/18) + ta'sir yozuvi =====
const FREQ = [
  { id: 'narx', t: { uz: "Narx ko'rinmaydi", ru: 'Не видно цену' }, n: 18, kind: 'bug', eff: { uz: "ta'sir: buyurtmadan oldin ketadi — birinchi", ru: 'влияние: уходят до заказа — первым' }, first: true },
  { id: 'rahmat', t: { uz: 'Tez va qulay', ru: 'Быстро и удобно' }, n: 6, kind: 'maqtov', eff: { uz: 'maqtov: tegilmaydi, buzilmasin', ru: 'похвала: не трогаем, не ломаем' } },
  { id: 'sekin', t: { uz: 'Bot sekin', ru: 'Бот медленный' }, n: 5, kind: 'bug', eff: { uz: 'noaniq: avval «qaysi javob?» deb so\'raladi', ru: 'неконкретно: сначала спросить «какой ответ?»' } },
  { id: 'gluten', t: { uz: 'Glutensiz', ru: 'Без глютена' }, n: 3, kind: 'taklif', eff: { uz: 'taklif: «hozir emas» — kam odam', ru: 'предложение: «не сейчас» — мало людей' } },
  { id: 'manzil', t: { uz: 'Manzil 2 marta', ru: 'Адрес 2 раза' }, n: 2, kind: 'bug', eff: { uz: 'bug: kichik, navbatda', ru: 'баг: небольшой, в очереди' } }
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(FREQ.map(f => f.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= FREQ.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const max = Math.max(...FREQ.map(f => f.n));
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · tanlov', ru: "Понятие · выбор" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `5 fikrni ko'ring (${seen.size}/5)`, ru: `Посмотрите 5 отзывов (${seen.size}/5)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Beshta fikr, bitta kun. Qaysi birini <span className="italic" style={{ color: T.accent }}>birinchi</span>?</>, ru: <>Пять отзывов, один день. Какой <span className="italic" style={{ color: T.accent }}>первым</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Hammasini bir kunda tuzatib bo'lmaydi — <b style={{ color: T.ink }}>har fikrni</b> bosib, nechta odam aytgani va botga qanchalik zarar qilganini ko'ring.</>, ru: <>Всё за один день не починить — нажимайте <b style={{ color: T.ink }}>каждый отзыв</b> и смотрите, сколько человек сказали и как сильно это вредит боту.</> })}</Mentor>
        <Zoomable><div className="freq fade-up delay-1">
          {FREQ.map(f => (
            <button key={f.id} className={`freq-row ${active === f.id ? 'cur' : ''} ${seen.has(f.id) ? 'seen' : ''} ${f.first && seen.has(f.id) ? 'first' : ''}`} onClick={() => tap(f.id)}>
              <span className="freq-t">{tr(f.t)}</span>
              <span className="freq-track"><span className={`freq-bar ${f.kind}`} style={{ width: `${(f.n / max) * 100}%` }} /></span>
              <span className="freq-n">{f.n}</span>
              <span className="freq-eff">{seen.has(f.id) ? tr(f.eff) : <span className="freq-mk">›</span>}</span>
            </button>
          ))}
        </div></Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Ko'p odam aytgan va qattiq qiynagan — birinchi. Qolganiga «hozir emas» deyish ham qaror.", ru: "Сказали многие и сильно мешает — первым. Остальному сказать «не сейчас» — тоже решение." })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — TEST 2 (narx 18 vs glutensiz 3, correctIdx 2) · badge rightFixFirst =====
const Screen5 = (props) => (
  <QuestionScreen {...props} idx={7} scope="module-mikro" eyebrow={{ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' }}
    questionText="Vaqt oz. 18 kishi: narx ko'rinmaydi, buyurtma bermay ketadi. 3 kishi: glutensiz pitsa yo'q. Birinchi nimani?"
    question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Vaqt oz. <span className="mono">18</span> kishi: narx ko'rinmaydi, buyurtma bermay ketadi. <span className="mono">3</span> kishi: glutensiz pitsa yo'q. <span className="italic" style={{ color: T.accent }}>Birinchi</span> nimani?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Времени мало. <span className="mono">18</span> человек: не видно цену, уходят без заказа. <span className="mono">3</span>: нет пиццы без глютена. Что <span className="italic" style={{ color: T.accent }}>первым</span>?</h2></> }}
    options={[
      { uz: "Glutensiz pitsani: yangi taom ko'proq mijoz olib keladi", ru: "Безглютеновую пиццу: новое блюдо приведёт больше клиентов" },
      { uz: "Ikkalasini birga: hech bir fikr kutib qolmasin", ru: "Оба сразу: ни один отзыв не должен ждать" },
      { uz: "Narxni: u ko'p odamni buyurtmadan to'xtatyapti", ru: "Цену: она останавливает многих перед заказом" },
      { uz: "Hech birini: bular oddiy shikoyat, jiddiy emas", ru: "Ничего: это обычные жалобы, несерьёзно" }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Narx muammosi ko'p odamda (18) buyurtmani to'xtatadi — chastota ham, ta'sir ham katta.", ru: "Проблема с ценой у многих (18) останавливает заказ — и частота, и влияние большие." }}
    explainWrong={{
      0: { uz: "Yangi taomni 3 kishi so'ragan, narxni 18 kishi.", ru: "Новое блюдо попросили 3 человека, цену — 18." },
      1: { uz: "Vaqt oz bo'lsa, ikkalasi ham chala chiqadi.", ru: "Если времени мало, оба выйдут недоделанными." },
      3: { uz: "18 kishi bir xil shikoyat qildi — bu jiddiy fikr.", ru: "18 человек жалуются на одно и то же — это серьёзно." },
      default: { uz: "Birinchi — eng ko'p odamni eng qattiq qiynayotgani: narx.", ru: "Первым — то, что сильнее всего мешает большинству: цена." }
    }} />
);

// ===== NISHONLAR — faqat REAL bosqichlar uchun (tekin emas). Kalitlar o'zgarmaydi (progress/server), nomi va tavsifi — MD v2 =====
const ACHIEVEMENTS = {
  signalFinder:  { icon: '📡', name: 'Feedback Sorter', desc: { uz: "Fikr turini to'g'ri aniqladingiz", ru: "Вы верно определили вид отзыва" } },
  rightFixFirst: { icon: '🎯', name: 'Right Fix First', desc: { uz: "Eng ta'sirli tuzatishni birinchi tanladingiz", ru: 'Вы первым выбрали самое влиятельное исправление' } },
  loopCloser:    { icon: '🔁', name: 'Full Iteration',  desc: { uz: "Bitta to'liq iteratsiyani o'zingiz bosib o'tdingiz", ru: "Вы сами прошли одну полную итерацию" } },
};
// Ekran id → nishon: s3/s5 — SCORED testlar (xato variantda correct:false); a3 — amaliyot bonusi (memory `nishon-bonus-qismaslik`:
// oxirgi «Bajardim» da, birinchi urinish sharti yo'q — tavsifi rost aytadi).
const ACH_TRIGGERS = { s3: 'signalFinder', s5: 'rightFixFirst', a3: 'loopCloser' };

function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr({ uz: `Yangi nishon: ${ach.name}`, ru: `Новый значок: ${ach.name}` })}>
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
          <span className="acu-name">{tr(ach.name)}</span>
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
  const COLORS = [T.accent, T.success, T.blue, '#FFD380', '#FF7755', '#7DD181'];
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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 8, 10, 14, 15)
// 172-qonun: ballik ekranlar 4 va 7 (SCORED_IDX) — podium nuqtasi yorlig'i shu kalitlarda (F-1004-60, eski 20 ekranli kalitlar olindi)
const Q_LABELS = {
  4: { uz: '1 — Fikr turi', ru: '1 — Тип отзыва' },
  7: { uz: '2 — Ustuvorlik', ru: '2 — Приоритет' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si (fikr va iteratsiya atamalari)
const QZ_BG_SHAPES = [
  { ch: { uz: 'iteratsiya', ru: 'итерация' },  l: 5,  t: 10, s: 26, d: 19, dl: 0 },
  { ch: 'v2',          l: 85, t: 8,  s: 26, d: 23, dl: 1.5 },
  { ch: 'bug',         l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'taklif', ru: 'предложение' },      l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'chastota', ru: 'частота' },    l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: "ta'sir", ru: 'влияние' },      l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: { uz: 'voronka', ru: 'воронка' },     l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: '↻',           l: 34, t: 62, s: 20, d: 29, dl: 3.4 },
  { ch: { uz: 'fikr', ru: 'отзыв' },        l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3, mexanik ketma-ketlik yo'q).
// 🎓 Metodist: savol matni va variant uzunliklari sayqallanadi · ⚡ Jonli: `correct` qiymatlari INLINE_KEYS bilan sinxron tekshiriladi.
const QUIZ_BANK = [
  { q: { uz: "Foydalanuvchi: «/start bosdim, menyu tugmasi chiqmadi». Bu qanday fikr?", ru: "Пользователь: «Нажал /start, кнопка меню не появилась». Что это за отзыв?" }, opts: [{ uz: "Maqtov: mijoz botdan mamnun", ru: "Похвала: клиент доволен ботом" }, { uz: "Bug: aniq joy va muammo bor", ru: "Баг: есть конкретное место и проблема" }, { uz: "Taklif: yangi narsa so'ralgan", ru: "Предложение: просят что-то новое" }, { uz: "Shovqin: e'tibor shart emas", ru: "Шум: внимание не нужно" }], correct: 1 },
  { q: { uz: "«Yaxshi bot» degan fikr nega kam foydali?", ru: "Почему отзыв «Хороший бот» мало полезен?" }, opts: [{ uz: "Chunki bu salbiy fikr", ru: "Потому что это негативный отзыв" }, { uz: "Chunki maqtov kam uchraydi", ru: "Потому что похвала встречается редко" }, { uz: "Chunki botni yomon ko'rsatadi", ru: 'Потому что он показывает бота плохим' }, { uz: "Chunki aniq joy aytilmagan", ru: "Потому что не названо конкретное место" }], correct: 3 },
  { q: { uz: "18 kishi bir xil shikoyat qildi, 1 kishi boshqa narsani aytdi. Qaysi birini birinchi ko'rib chiqasiz?", ru: "18 человек пожаловались на одно, 1 человек сказал другое. Что вы рассмотрите первым?" }, opts: [{ uz: "18 kishinikini: ko'pchilik aytgan", ru: "Жалобу 18 человек: так сказало большинство" }, { uz: "1 kishinikini: u eng birinchi yozgan", ru: "Отзыв 1 человека: он написал самым первым" }, { uz: "Ikkalasini ham bir vaqtning o'zida", ru: "Оба одновременно" }, { uz: "Hech birini: bular shunchaki hissiyot", ru: "Ничего: это просто эмоции" }], correct: 0 },
  { q: { uz: "Qaysi tuzatishni birinchi qilishni nimaga qarab tanlaysiz?", ru: "Как вы выбираете, какую правку сделать первой?" }, opts: [{ uz: "Eng jahl bilan yozilgan fikrga qarab", ru: "По отзыву, написанному злее всех" }, { uz: "Eng birinchi kelgan fikrga qarab", ru: "По отзыву, пришедшему самым первым" }, { uz: "Ko'p aytilgani va qattiq qiynaganiga", ru: "По тому, что чаще звучит и сильнее мешает" }, { uz: "O'zimga eng qiziq tuyulganiga qarab", ru: "По тому, что мне самому интереснее" }], correct: 2 },
  { q: { uz: "Voronkada eng katta yo'qotish qayerda ko'rinadi?", ru: "Где в воронке видна самая большая потеря?" }, opts: [{ uz: "Eng ko'p odam turgan birinchi qadamda", ru: "На первом шаге, где больше всего людей" }, { uz: "Odam soni eng ko'p kamaygan joyda", ru: "Там, где число людей упало сильнее всего" }, { uz: "Bot eng sekin javob bergan joyda", ru: "Там, где бот ответил медленнее всего" }, { uz: "Eng ko'p maqtov kelgan qadamda", ru: 'На шаге, где больше всего похвалы' }], correct: 1 },
  { q: { uz: "Menyu tugmasi tuzatilgach, menyuni ochmasdan ketganlar 60 dan 15 ga tushdi. Bu nimani bildiradi?", ru: "После правки кнопки меню ушедших, не открыв меню, стало не 60, а 15. О чём это говорит?" }, opts: [{ uz: "Tuzatish ishlamadi, hamma ketyapti", ru: "Правка не сработала, все уходят" }, { uz: "Sonlar tasodifiy, xulosa chiqmaydi", ru: "Числа случайные, вывода нет" }, { uz: "Botda yana yangi bug paydo bo'ldi", ru: "В боте снова появился новый баг" }, { uz: "Tuzatish ishladi, muammo kamaydi", ru: "Правка сработала, проблема уменьшилась" }], correct: 3 },
  { q: { uz: "«Bot ahmoq» sharhiga javob yozish nega eng ta'sirli tuzatish emas?", ru: "Почему ответ на отзыв «Бот тупой» — не самая влиятельная правка?" }, opts: [{ uz: "Unda nimani tuzatish kerakligi yo'q", ru: "В нём не сказано, что нужно чинить" }, { uz: "Bunday sharhga javob yozib bo'lmaydi", ru: "На такой отзыв нельзя ответить" }, { uz: "Uni yozgan odam botni ishlatmagan", ru: "Его автор не пользовался ботом" }, { uz: "Javob yozish juda ko'p vaqt oladi", ru: "Ответ займёт слишком много времени" }], correct: 0 },
  { q: { uz: "100 kishidan bittasi faqat o'ziga kerak narsani so'radi. Nima qilasiz?", ru: "Один из 100 попросил то, что нужно только ему. Что вы сделаете?" }, opts: [{ uz: "Darrov qo'shaman: har so'rov bajarilsin", ru: "Добавлю сразу: каждая просьба выполняется" }, { uz: "U foydalanuvchini botdan bloklayman", ru: "Заблокирую этого пользователя в боте" }, { uz: "Avval ko'pchilikka keraklisini qilaman", ru: "Сначала сделаю то, что нужно большинству" }, { uz: "Hamma so'rovni navbati bilan qo'shaman", ru: "Добавлю все просьбы по очереди" }], correct: 2 },
  { q: { uz: "Tuzatishdan keyin nima qilasiz?", ru: "Что вы делаете после правки?" }, opts: [{ uz: "Hech narsa: tuzatish albatta ishlaydi", ru: "Ничего: правка точно сработает" }, { uz: "Qayta o'lchayman: shikoyat kamaydimi", ru: "Измерю заново: стало ли меньше жалоб" }, { uz: "Darhol yana katta o'zgarish qilaman", ru: "Сразу сделаю ещё одно большое изменение" }, { uz: "Fikr yig'ishni butunlay to'xtataman", ru: "Совсем перестану собирать отзывы" }], correct: 1 },
  { q: { uz: "Botingizning birinchi versiyasi chiqdi. Ish tugadimi?", ru: "Вышла первая версия вашего бота. Работа закончена?" }, opts: [{ uz: "Yo'q: bot fikr bilan yaxshilanib boradi", ru: "Нет: бот улучшается благодаря отзывам" }, { uz: "Ha: birinchi versiya — tayyor mahsulot", ru: "Да: первая версия — готовый продукт" }, { uz: "Testlarning hammasi o'tib bo'lsa — tugadi", ru: "Если все тесты пройдены — закончена" }, { uz: "Bir hafta shikoyat kelmasa — tugadi", ru: "Если неделю нет жалоб — закончена" }], correct: 0 },
  { q: { uz: "Noaniq fikr («menyu chalkash») aniq o'zgarishdan nimasi bilan farq qiladi?", ru: "Чем неконкретный отзыв («меню запутанное») отличается от конкретного изменения?" }, opts: [{ uz: "Farqi yo'q, ikkalasi bir xil ishlatiladi", ru: "Ничем, оба применяются одинаково" }, { uz: "Noaniq fikr odatda yolg'on bo'ladi", ru: "Неконкретный отзыв обычно бывает ложью" }, { uz: "Aniq o'zgarishni faqat dasturchi tushunadi", ru: "Конкретное изменение понимает только программист" }, { uz: "Fikr shikoyat, aniq o'zgarish esa vazifa", ru: "Отзыв — это жалоба, а изменение — задача" }], correct: 3 },
  { q: { uz: "Aniq maqtovni («tez va qulay, rahmat!») nega e'tiborsiz qoldirmaysiz?", ru: "Почему вы не оставляете без внимания конкретную похвалу («быстро и удобно, спасибо!»)?" }, opts: [{ uz: "Chunki maqtovni ham tuzatish kerak", ru: "Потому что похвалу тоже нужно чинить" }, { uz: "Chunki maqtov yozganga chegirma beriladi", ru: "Потому что за похвалу дают скидку" }, { uz: "Chunki u nima yaxshi ishlashini aytadi", ru: "Потому что она говорит, что работает хорошо" }, { uz: "Chunki maqtovda eng ko'p bug bo'ladi", ru: "Потому что в похвале больше всего багов" }], correct: 2 },
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
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{hint}</span>}
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
    // Arena tokenlari — SHU darsning so'zlari (fikr va iteratsiya): dekorativ suzuvchi bo'laklar
    const TOK = [{ uz: 'iteratsiya', ru: 'итерация' }, { uz: 'chastota', ru: 'частота' }, { uz: "ta'sir", ru: 'влияние' }, { uz: 'voronka', ru: 'воронка' }, 'bug', { uz: 'taklif', ru: 'предложение' }, 'v2', { uz: 'fikr', ru: 'отзыв' }];
    const em = [], toks = [];
    for (let i = 0; i < 26; i++) em.push({ x: Math.random() * W, y: Math.random() * H, z: .3 + Math.random() * .7, ph: Math.random() * 6.28, sw: .3 + Math.random() * .6 });
    for (let i = 0; i < 9; i++) toks.push({ x: Math.random() * W, y: Math.random() * H, z: .4 + Math.random() * .9, vx: (Math.random() - .5) * .16, t: tr(TOK[i % TOK.length]), r: (Math.random() - .5) * .5 });
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
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Ответы подряд дают 🔥 бонус!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>{tr({ uz: '▶ Testni boshlash', ru: '▶ Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Дождитесь, пока ментор начнёт тест…' })}</p>}
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
                : <span className="qz-res-t">{my ? tr({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: 'Неверно — 0 баллов. В следующий раз получится! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Будьте быстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: '🏁 Natijani ko\'rish', ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Дальше →' })}</button>}
        </div>
      )}

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'самая длинная серия' })} 🔥x${soloScore.maxStreak}` : ''}</p>
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
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: <>Siz — <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</>, ru: <>Вы — <b>{myRank + 1}-е место</b> · {board[myRank].pts} баллов</> })}</p>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест заново — тренировка (в таблицу не идёт)' })}</button>}
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
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head head-c"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победил</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появляется рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Загружаем результаты…' })}</p>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верно)</> })}</p>}
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

// ===== JONLI PRAKTIKA — o'quvchi o'z kompyuterida bajaradi, Mentor kuzatadi =====
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
      <div className="card-lbl" style={{ color: T.blue }}>{tr({ uz: '👀 Kim bajardi —', ru: '👀 Кто выполнил —' })} {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружаем…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не присоединился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success }}>✓ {p.nickname}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ opacity: 0.6 }}>⏳ {p.nickname}</span>)}
        </div>
      )}
    </div>
  );
};
// F-0803-13/14: KARTA JAVOBI UZUNLIKKA MOSLASHADI.
// Muammo edi: `.fc-tag` hamma javobga bir xil katta monoshrift berardi — u bir so'zlik javob
// (`let`, `=`, `string`) uchun tanlangan o'lcham. Uzun javob 2-3 qatorga bo'linib, qat'iy
// balandlikdagi kartaga sig'masdi va izoh pastki chetga yopishib qolardi.
// Yechim: (1) uzunlik bo'yicha 4 pog'onali o'lcham · (2) bitta kod-tokeni — mono,
// gap — Manrope (o'qishga qulay, ~25% tor) · (3) gap ichidagi kod so'zlari mono qoladi.
const FC_CODE_WORDS = /\b(let|const|var|string|number|boolean|true|false|null|undefined|function|return|for|while|if|else)\b/g;
const FC_VOCAB = new Set(['let', 'const', 'var', 'string', 'number', 'boolean', 'true', 'false', 'null', 'undefined', 'function', 'return', 'for', 'while', 'if', 'else']);
// Kodmi yoki so'zmi? Monoshrift FAQAT kodga: lug'atdagi kalit so'z yoki kod-belgisi bo'lgan
// token. «o'zgaruvchi» kabi o'zbekcha atama — gap, u Manrope bilan chiroyliroq va tor chiqadi.
// F-0803-23: defis-li ODDIY so'z («Promo-landing», «follow-up», «AI-agent») kod EMAS — ilgari u
// dasturchi shriftida, `let`/`const` kabi kod-token bo'lib ko'rinardi. Haqiqiy defis-li kod
// tokeni (`background-color`, `runs-on`) FC_VOCAB oq ro'yxati orqali mono bo'lib qoladi.
const fcIsCode = (s) => {
  if (FC_VOCAB.has(s.toLowerCase())) return true;
  if (/^[\p{L}'\u02BB\u2019]+(-[\p{L}'\u02BB\u2019]+)+$/u.test(s)) return false;
  return /[=(){};.[\]<>+*/%!&|-]/.test(s);
};
const fcTier = (s) => (s.length <= 8 ? 't1' : s.length <= 16 ? 't2' : s.length <= 32 ? 't3' : 't4');
const fcAnswer = (raw) => {
  const s = String(raw ?? '');
  const oneToken = !/\s/.test(s) && fcIsCode(s);        // `let`, `const`, `=`, `string` — kod tokeni
  const cls = `fc-tag ${fcTier(s)} ${oneToken ? 'mono-all' : 'prose'}`;
  if (oneToken) return <span className={cls}>{s}</span>;
  const parts = s.split(FC_CODE_WORDS);                 // gap: kod so'zlari mono bo'lakda qoladi
  return (
    <span className={cls}>
      {parts.map((p, i) => (i % 2 === 1 ? <span key={i} className="fc-kw">{p}</span> : p))}
    </span>
  );
};

function Flashcards({ cards }) {
  const [queue, setQueue] = useState(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [exiting, setExiting] = useState(null); // 'knew' | 'again' — karta uchib chiqish animatsiyasi
  const swapRef = useRef(0);
  const total = cards.length;
  const cur = queue[0];
  const card = cur != null ? cards[cur] : null;
  const advance = (removed) => {
    if (exiting) return;
    setExiting(removed ? 'knew' : 'again');
    setTimeout(() => {
      setExiting(null); setFlipped(false); swapRef.current++;
      if (removed) setKnown(k => k + 1);
      setQueue(q => { const [first, ...rest] = q; return removed ? rest : [...rest, first]; });
    }, 420);
  };
  const knew = () => advance(true);
  const again = () => advance(false);
  const restart = () => { setQueue(cards.map((_, i) => i)); setKnown(0); setFlipped(false); };
  if (!card) return (
    <div className="fc-done fade-up"><span className="fc-done-emoji">✓</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda ·", ru: '↻ Учу ·' })} <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim ·', ru: '✓ Знаю ·' })} <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span></div>
          <div className="fc-face fc-back">{fcAnswer(tr(card.back))}{card.note && <span className="fc-note">{tr(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : (<p className="fc-hint" />)}
    </div>
  );
}

// PRAKTIKA — o'quvchi o'z boti uchun fikrlar ro'yxatini tuzadi (mentor-gate, kod kiritilmaydi)
const FEEDBACK_FLASHCARDS = [
  { front: { uz: "Fikr yig'ish → tuzatish → yangi versiya → yana fikr. Bu takror?", ru: "Сбор отзывов → исправление → новая версия → снова отзывы. Этот повтор?" }, back: { uz: 'Iteratsiya', ru: 'Итерация' }, note: { uz: 'Har iteratsiyada bot biroz yaxshilanadi', ru: "С каждой итерацией бот немного лучше" } },
  { front: { uz: 'Fikrlar qaysi uch turga ajratiladi?', ru: "На какие три вида делятся отзывы?" }, back: { uz: 'Bug, taklif, maqtov', ru: "Баг, предложение, похвала" }, note: { uz: "Tuzatish · o'ylab ko'rish · saqlash", ru: "Починить · обдумать · сохранить" } },
  { front: { uz: '«Bot manzilimni ikki marta so\'radi» — qanday fikr?', ru: "«Бот спросил адрес дважды» — какой отзыв?" }, back: { uz: 'Bug', ru: 'Баг' }, note: { uz: 'Bot kutilgan ishni bajarmayapti', ru: "Бот не делает ожидаемого" } },
  { front: { uz: "Mijoz botda yo'q narsani so'rasa?", ru: "Клиент просит то, чего в боте нет?" }, back: { uz: 'Taklif', ru: 'Предложение' }, note: { uz: "Hozir qo'shilmaydi — ko'pchilikka kerakmi", ru: "Сейчас не добавляется — нужно ли многим" } },
  { front: { uz: 'Aniq fikr noaniqdan nimasi bilan farq qiladi?', ru: "Чем конкретный отзыв отличается от неконкретного?" }, back: { uz: 'Unda joy va muammo bor', ru: "В нём есть место и проблема" }, note: { uz: 'Noaniqni avval aniqlashtirasiz: «aynan qayerda?»', ru: "Неконкретный сначала уточняете: «где именно?»" } },
  { front: { uz: 'Qaysi tuzatish birinchi — nimaga qarab?', ru: "Какое исправление первым — по чему?" }, back: { uz: "Chastota va ta'sir", ru: "Частота и влияние" }, note: { uz: "Nechta odam · buyurtmani to'xtatadimi", ru: "Сколько человек · останавливает ли заказ" } },
  { front: { uz: 'Kam odamga kerak taklifga nima deysiz?', ru: "Что вы говорите предложению, нужному немногим?" }, back: { uz: '«Hozir emas»', ru: "«Не сейчас»" }, note: { uz: 'Bu ham qaror — asosiy ish saqlanadi', ru: "Это тоже решение — главное сохраняется" } },
  { front: { uz: "Fikrlar ro'yxati qayerda turadi?", ru: "Где лежит список отзывов?" }, back: 'FIKRLAR.md', note: { uz: "Repo'da — keyingi iteratsiyalar ham shu yerda", ru: "В репозитории — следующие итерации тоже здесь" } },
  { front: { uz: "Antigravity'ga shikoyatni emas, nimani berasiz?", ru: "Что вы даёте Antigravity вместо жалобы?" }, back: { uz: "Aniq o'zgarishni", ru: "Конкретное изменение" }, note: { uz: "qayerda · nima o'zgarsin · nima buzilmasin", ru: "где · что изменить · что не сломать" } },
  { front: { uz: 'Tuzatgandan keyin eski narsani nega tekshirasiz?', ru: "Зачем после починки проверять старое?" }, back: { uz: 'Buzilmaganini bilish uchun', ru: "Чтобы знать, что не сломалось" }, note: { uz: '/start, menyu, buyurtma — uchalasi', ru: "/start, меню, заказ — все три" } },
  { front: { uz: "Ko'p odam suhbatning bir joyida ketib qolsa?", ru: "Многие уходят в одном месте диалога?" }, back: { uz: 'Ketib qolish (drop-off)', ru: "Отток (drop-off)" }, note: { uz: "O'sha qadamda nimadir xalaqit beradi", ru: "На этом шаге что-то мешает" } },
  { front: { uz: 'Tuzatishni chiqargandan keyin nima qilasiz?', ru: "Что вы делаете после выпуска исправления?" }, back: { uz: "Qayta o'lchaysiz", ru: "Измеряете снова" }, note: { uz: "O'sha odamdan yana so'raysiz; keyingi iteratsiya shundan", ru: "Снова спрашиваете того человека; с этого начинается следующая итерация" } },
];
// ===== YAKUN (4.2: ScoreRing + CodeStrike CTA + RECAP/Uyga vazifa + 🏅 kolleksiya) =====
const SummaryScreen = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  // F-0803-08: uyga vazifa kapsulasi — bosilganda topshiriq kartasi ochiladi
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
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><div className="hero-chips"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'v2 serverda', ru: "v2 на сервере" })}</span><span className="score-chip fade-up">{correct}/{total} {tr({ uz: "to'g'ri", ru: 'верно' })}</span></div><h2 className="title h-title fade-up d1">{tr({ uz: <>Bot fikr bilan o'sadi — siz buni <span className="italic" style={{ color: T.accent }}>bir marta</span> qildingiz.</>, ru: <>Теперь ваш бот растёт <span className="italic" style={{ color: T.accent }}>вместе с пользователем</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: "Подождите ментора" }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        {!(isStudentL && !classOver) && <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Takrorlash — kartochkalar', ru: 'Повторение — карточки' })}</div><div className="fc-wrap"><Flashcards cards={FEEDBACK_FLASHCARDS} /></div></div>}
        <p className="next-lesson fade-up d4">{tr({ uz: <>Keyingi dars — <b>«AI-agent yaratish»</b>. Botga maqsad berasiz — keyingi qadamni u o'zi tanlab, asbob chaqiradi: masalan, buyurtmani bazaga saqlaydi.</>, ru: <>Следующий урок — <b>«Создание ИИ-агента»</b>. Вы даёте боту цель — следующий шаг он выбирает сам и вызывает инструмент: например, сохраняет заказ в базу.</> })}</p>
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Nishonlaringiz —', ru: "Ваши значки —" })} {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
              <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={tr(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : '🔒'}</span>
                <span className="ach-badge-name">{tr(a.name)}</span>
                {got && <span className="ach-badge-desc">{tr(a.desc)}</span>}
              </div>
            ); })}
          </div>
        </div>}
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function BotIntroLesson({ lang: langProp, onFinished, liveToken }) {
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
  const missTry = useCallback((idx, part) => {
    const sid = SCREEN_META[idx] && (part ? SCREEN_META[idx].id + ':' + part : SCREEN_META[idx].id); // part — ko'p bosqichli ekranda bosqich (s7:sort)
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
  // 🃏 Kartochkalar yakun ekranida (SummaryScreen); jonli darsda mentor boshqaruvida o'quvchiga ko'rsatilmaydi — o'sha yerda tekshiriladi
  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));
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
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat REAL solve)
    // Yakuniy debug-gate (s15) — XATO javob ham serverga ketadi (aks holda xato qilgan o'quvchi podiumda umuman ko'rinmaydi).
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

  const screens = [Screen0, Screen1, Screen2, ScreenA1, Screen3, Screen4, ScreenA2, Screen5, ScreenA3, ScreenPodium, SummaryScreen];
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

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.accent}; color: #fff; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.ink}; border: 1px solid ${T.line}; border-radius: 10px; padding: 8px 14px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoomable.z-float > .zoom-btn { visibility: hidden; } /* ⛶ bo'sh joy ustida osilmasin (ZBTN, 159-qonun) */
        .flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band, F-0926-01) */
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI (radio) === */
        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .hook-option:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; } /* F-1002-92 · 170-qonun: tanlov rangi butun kursda bitta — accent (U1 «neytral qora» bekor) */
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.ink}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }


        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
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

        /* === FRAME === */
        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        /* frame-warn — FAQAT haqiqiy xato/yiqilish (401/400/500, noto'g'ri tanlov): dangerSoft, yo'lakdagi rz-crash bilan bir tilda */
        .frame-warn { background: ${T.dangerSoft}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(194,54,43,0.22); }

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
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); } /* F-1002-55: texnik dars kartasi — karta + raqam + teg; bosilmaydi (hover va kursor yo'q) */
        .step-num { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: none; border: 1px solid ${T.line}; animation: fade-step 0.3s; } /* U1: ma'lumot kartasi — belgisiz, soyasiz */
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; white-space: pre-wrap; } .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .hero-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .score-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; font-variant-numeric: tabular-nums; color: ${T.accent}; background: ${T.accentSoft}; padding: 5px 12px; border-radius: 999px; } /* F-1003-04/05: yakunda halqa o'rniga yorliq */
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; } .ring-wrap svg { width: 100%; height: 100%; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; background: none; padding: 0; }
        /* F-0803-08 — UYGA VAZIFA KAPSULASI (PmLesson2 etaloni): yakun sahifasida
           «Endi siz bilasiz» dan KEYIN turadi, bosilganda topshiriq kartasi ochiladi. */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.03); } 100% { filter: brightness(1); } }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent); transform: rotate(8deg); animation: hw-shine 4.6s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(120,60,220,.6), 0 0 40px rgba(124,58,237,.72), 0 0 96px rgba(124,58,237,.4), inset 0 0 60px rgba(124,58,237,.44); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none !important; } }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }

        /* === 4-MODUL: KOD QUTISI === */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        /* === JSON KO'RINISHI === */

        /* === MA'LUMOT JADVALI === */

        /* === SXEMA JADVAL-KARTOCHKASI === */

        /* === BOG'LANISH TUGMASI (s10) === */

        /* === TANLASH QATORI (s13) === */

        /* === YAKUNIY SXEMA KANVAS (s15) === */

        /* === Instagram POST KARTOCHKASI === */

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
        /* === 🛠️ JONLI PRAKTIKA (VS Code-uslub, self-report) === */
        .lp-task { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 9px; }
        .lp-task-h { display: flex; align-items: center; gap: 8px; }
        .lp-task-badge { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 10.5px; letter-spacing: 0.12em; color: #fff; background: ${T.accent}; padding: 3px 9px; border-radius: 6px; }
        .lp-steps { display: flex; flex-direction: column; gap: 8px; }
        .lp-step { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 11px; padding: 11px 13px; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; cursor: pointer; transition: all 0.16s; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .lp-step:hover:not(.on) { box-shadow: 0 8px 18px -7px rgba(${T.shadowBase},0.24); }
        .lp-step.on { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .lp-check { width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; background: ${T.bg}; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.ink3}55; transition: all 0.16s; }
        .lp-step.on .lp-check { background: ${T.success}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .lp-step-t { flex: 1; min-width: 0; overflow-wrap: break-word; }
        /* === AMALIYOT BLOKI (ScreenBlok, F-1002-112 — 5/7-dars bilan bir xil) === */
        .lp-step.cur { cursor: default; align-items: flex-start; justify-content: flex-start; box-shadow: inset 0 0 0 1.5px ${T.ink}22, 0 8px 18px -7px rgba(${T.shadowBase},0.2); } /* 5/7-dars bilan bir xil: raqam tepada, tugma chapda */
        .lp-step-body { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
        .ab-line.mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; }
        .lp-step.on { cursor: default; padding-top: 8px; padding-bottom: 8px; }
        .lp-step-t.one, .lp-step-t.one .qcode { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lp-step-t b { color: ${T.ink}; } .lp-step.on .lp-step-t b { color: ${T.success}; }
        .lp-undo { flex-shrink: 0; border: none; background: transparent; color: ${T.success}; font-size: 16px; font-weight: 700; cursor: pointer; padding: 2px 6px; border-radius: 8px; }
        .lp-undo:hover { background: ${T.paper}; }
        .lp-step-body .term { width: 100%; }
        .ab-prompt { width: 100%; background: ${T.bg}; border-radius: 11px; padding: 10px 12px; box-shadow: inset 0 0 0 1px ${T.line}; display: flex; flex-direction: column; gap: 4px; }
        .ab-prompt-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px; }
        .ab-who { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 10.5px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .ab-copy { font-family: 'Manrope'; font-weight: 700; font-size: 12px; padding: 5px 11px; border-radius: 8px; border: none; background: ${T.paper}; color: ${T.accent}; cursor: pointer; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.25); }
        .ab-copy:hover { background: ${T.accentSoft}; }
        .ab-line { margin: 0; font-size: clamp(12.5px,1.5vw,13.5px); line-height: 1.55; color: ${T.ink}; font-weight: 500; }
        .ab-slot { background: ${T.accentSoft}; color: ${T.accent}; border-radius: 6px; padding: 1px 6px; font-weight: 700; white-space: nowrap; }
        .ab-err { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .ab-tail { margin: 0; font-size: 12px; line-height: 1.5; color: ${T.ink3}; }
        .fc-wrap { display: flex; justify-content: center; padding: 6px 0 2px; }
        .next-lesson { margin: 0; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; } .next-lesson b { color: ${T.ink}; }
        /* fayl-karta (FIKRLAR.md) */
        .fcard { border-radius: 12px; overflow: hidden; background: ${T.paper}; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
        .fcard-bar { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .fcard-name { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .fcard-body { margin: 0; padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; line-height: 1.6; color: ${T.ink}; overflow-x: auto; }
        .fcard-l { display: block; white-space: pre; } .fcard-l.h { font-weight: 700; color: ${T.accent}; } .fcard-l.star { background: ${T.accentSoft}; border-radius: 4px; }
        /* 2-ekran: fikr xabarlari (bosiladi) + teglar */
        .fb-list { display: flex; flex-direction: column; gap: 8px; }
        .fb-msg { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: #E6F5D8; border: none; border-radius: 14px 14px 4px 14px; padding: 10px 14px; font-family: 'Manrope'; font-weight: 500; font-size: clamp(13px,1.6vw,14.5px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .fb-msg:hover { transform: translateY(-1px); } .fb-msg.cur { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2); }
        .fb-msg-t { flex: 1; min-width: 0; } .fb-mk { font-weight: 700; color: ${T.ink2}; } .fb-mk.ok { color: ${T.success}; }
        .fb-tag { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 99px; margin-right: 6px; }
        .fb-tag.bug { background: ${T.dangerSoft}; color: ${T.danger}; } .fb-tag.taklif { background: ${T.accentSoft}; color: ${T.accent}; } .fb-tag.maqtov { background: ${T.successSoft}; color: ${T.success}; }
        .fb-tag.aniq { background: ${T.bg}; color: ${T.ink}; box-shadow: inset 0 0 0 1px ${T.line}; } .fb-tag.noaniq { background: ${T.bg}; color: ${T.ink3}; border: 1px dashed ${T.ink3}; }
        /* 4-ekran: chastota chizig'i */
        .freq { display: flex; flex-direction: column; gap: 8px; }
        .freq-row { display: grid; grid-template-columns: minmax(110px, 0.9fr) 2fr 36px minmax(140px, 1.6fr); align-items: center; gap: 12px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 10px 14px; font-family: 'Manrope'; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .freq-row:hover { transform: translateY(-1px); } .freq-row.cur { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2); }
        .freq-row.first { background: ${T.accentSoft}; }
        .freq-t { font-weight: 700; } .freq-track { height: 10px; background: ${T.bg}; border-radius: 99px; overflow: hidden; }
        .freq-bar { display: block; height: 100%; border-radius: 99px; background: ${T.ink3}; transition: width 0.5s ease; }
        .freq-bar.bug { background: ${T.danger}; } .freq-bar.taklif { background: ${T.accent}; } .freq-bar.maqtov { background: ${T.success}; }
        .freq-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; text-align: right; }
        .freq-eff { font-size: 12.5px; color: ${T.ink2}; } .freq-row.first .freq-eff { color: ${T.accent}; font-weight: 700; } .freq-mk { color: ${T.ink3}; font-weight: 700; }
        @media (max-width: 640px) { .freq-row { grid-template-columns: 1fr 36px; } .freq-track { grid-column: 1 / -1; } .freq-eff { grid-column: 1 / -1; } }
        .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 13px; padding: 14px 20px; background: ${T.accent}; color: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; margin-top: 2px; }
        .lp-done-btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.5); }
        .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; animation: lp-done-pop 0.44s cubic-bezier(.3,1.35,.5,1); }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done { animation: none !important; } }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
        .fc-center { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding-top: 4px; }
        .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
        .fc-top { display: flex; justify-content: space-between; align-items: center; }
        .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
        .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
        .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
        .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
        @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
        .fc-bar { height: 7px; background: ${T.line}; border-radius: 99px; overflow: hidden; }
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #FF8A3D, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
        .fc-cardwrap { perspective: 1200px; position: relative; }
        .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid ${T.line}; z-index: -1; }
        .fc-cardwrap::before { transform: translateY(7px) scale(0.965); opacity: 0.7; }
        .fc-cardwrap::after { transform: translateY(15px) scale(0.93); opacity: 0.4; }
        .fc-fly { position: relative; animation: fc-in 0.3s ease; }
        @keyframes fc-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } }
        .fc-fly.out-knew { animation: fc-out-knew 0.42s ease forwards; }
        .fc-fly.out-again { animation: fc-out-again 0.42s ease forwards; }
        @keyframes fc-out-knew { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(70%) rotate(5deg); opacity: 0; } }
        @keyframes fc-out-again { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(-70%) rotate(-5deg); opacity: 0; } }
        .fc-fly.out-knew::after, .fc-fly.out-again::after { position: absolute; top: 50%; left: 50%; z-index: 6; width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; color: #fff; pointer-events: none; animation: fc-stamp 0.3s cubic-bezier(.34,1.6,.4,1); transform: translate(-50%, -50%); }
        .fc-fly.out-knew::after { content: '✓'; background: ${T.success}; box-shadow: 0 10px 26px -8px ${T.success}; }
        .fc-fly.out-again::after { content: '✗'; background: ${T.accent}; box-shadow: 0 10px 26px -8px ${T.accent}; }
        @keyframes fc-stamp { from { transform: translate(-50%, -50%) scale(0); } }
        .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, #FF8A3D, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(255,79,40,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
        .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
        .fc-tap { color: ${T.accent}; font-weight: 700; }
        /* F-0803-13/14: javob uzunlikka moslashadi — 4 pog'ona + kod/gap shrift ajrimi */
        .fc-tag { font-weight: 800; letter-spacing: -0.02em; line-height: 1.16; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
        .fc-tag.mono-all { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
        .fc-tag.prose { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
        .fc-tag .fc-kw { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; }
        .fc-tag.t1 { font-size: clamp(30px,6vw,46px); }
        .fc-tag.t2 { font-size: clamp(24px,4.4vw,34px); }
        .fc-tag.t3 { font-size: clamp(20px,3.4vw,26px); }
        .fc-tag.t4 { font-size: clamp(17px,2.6vw,22px); line-height: 1.3; }
        .fc-note { font-family: 'Manrope'; font-size: 14px; opacity: 0.92; }
        .fc-actions { display: flex; gap: 10px; min-height: 48px; }
        .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
        .fc-btn:hover { transform: translateY(-2px); }
        .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
        .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
        .fc-btn.again:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
        .fc-done-emoji { font-size: 40px; }
        .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
        .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

        /* === 🏅 ACHIEVEMENTS — hisoblagich + to'liq-ekran bayram === */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(255,79,40,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
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
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }
        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #FFF3EC); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
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
        .acu-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 900; font-size: clamp(12px,1.8vw,14px); letter-spacing: 0.2em; text-transform: uppercase; color: #FFD35A; text-shadow: 0 2px 12px rgba(0,0,0,0.5); animation: acu-rise 0.5s ease-out 0.35s both; }
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
        .pod-col { display: flex; flex-direction: column; align-items: center; gap: 5px; width: clamp(88px,22vw,150px); }
        .pod-medal { font-size: clamp(26px,4vw,38px); line-height: 1; }
        .pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: ${T.ink}; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-score { font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; }
        .pod-bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, ${T.accent}, ${T.accent}BB); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); }
        .pod-1 .pod-bar { height: clamp(74px,11vw,120px); }
        .pod-2 .pod-bar { height: clamp(52px,8vw,86px); background: linear-gradient(180deg, ${T.ink2}, ${T.ink3}); }
        .pod-3 .pod-bar { height: clamp(38px,6vw,62px); background: linear-gradient(180deg, #C98A3D, #DDA55C); }
        .pod-col.me .pod-name { color: ${T.success}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.success}; } /* 11.16: o'quvchining O'Z natijasi YASHIL (qizil faqat xato javob uchun) */
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: ${T.successSoft}; outline: 1.5px solid ${T.success}66; }
        .pod-rank { min-width: 22px; font-size: 12px; font-weight: 700; color: ${T.ink3}; }
        .pod-row-name { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-row-dots { display: flex; gap: 4px; }
        .pod-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(${T.shadowBase},0.15); }
        .pod-dot.ok { background: ${T.success}; }
        .pod-dot.bad { background: ${T.accent}; }
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink3}; }

        /* === ⚡ CODE STRIKE — CTA neon-kapsula (arena STRUKTURASI ⚡ Jonliniki) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
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
        .cs-clickable { cursor: pointer; user-select: none; transition: transform .18s cubic-bezier(.2,1,.3,1); outline: none; }
        .cs-clickable:hover { transform: scale(1.015); --spd: 2.2; }
        .cs-clickable:active { transform: scale(.99); }
        .cs-clickable:focus-visible { outline: 2px dashed rgba(186,140,255,.8); outline-offset: 6px; }
        .cs-off { filter: saturate(.45) brightness(.74); animation: cs-ignite 1.5s ease-out both, cs-breathe 6.5s ease-in-out 1.5s infinite; }
        .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
        .cs-live { animation: cs-ignite 1.2s ease-out both, cs-breathe 1.7s ease-in-out 1.2s infinite; }
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .cs-charging { animation: cs-charge .45s ease-in forwards !important; }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none; background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%); animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }
        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }
        /* ===== ⚡ JONLI QATLAM CSS (Kahoot-kutish · MentorTestStats · CodeStrike arena · qcode-chip) — L1 etalondan ===== */
        /* --- Kahoot-kutish holatlari (jonli test) --- */
        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === MENTOR STATISTIKASI (jonli test + yozma ish panellari) === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(255,79,40,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(255,79,40,0.55); } }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.blue}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.success}; }
        .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
        .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
        .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
        .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .mstats-chip.okc  { background: ${T.successSoft}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.success}; }
        .mstats-chip.badc { background: ${T.accentSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.accent}; }
        .mstats-chip.waitc { background: rgba(${T.shadowBase},0.06); } .mstats-chip.waitc .mstats-chip-n, .mstats-chip.waitc .mstats-chip-t { color: ${T.ink2}; }
        .mstats-chip.ansc { background: rgba(1,154,203,0.10); } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.blue}; }
        .mstats-hidden { margin: 0; font-family: 'Manrope'; font-size: 12.5px; font-style: italic; color: ${T.ink3}; }
        .mstats-bars { display: flex; flex-direction: column; gap: 8px; }
        .mstats-row { display: flex; align-items: center; gap: 10px; transition: opacity 0.4s; }
        .mstats-row.dimmed { opacity: 0.4; }
        .mstats-abc { width: 28px; height: 28px; border-radius: 9px; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); }
        .mstats-track { flex: 1; height: 16px; background: rgba(${T.shadowBase},0.07); border-radius: 99px; overflow: hidden; }
        .mstats-fill { display: block; height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1); opacity: 0.85; }
        .mstats-count { min-width: 108px; text-align: right; font-size: 12px; font-weight: 600; color: ${T.ink2}; white-space: nowrap; }
        .mstats-waitrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .mstats-wait-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; }
        .mstats-wait-chip { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.07); border-radius: 99px; padding: 3px 10px; }
        .mstats-wait-chip.more { color: ${T.ink3}; }
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); }
        .mstats-verdict.good { background: ${T.successSoft}; }
        .mstats-verdict.few { background: rgba(167,166,162,0.12); }
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
        .rc-dot.fill { background: ${T.ink3}; }
        .rc-dot.cur { background: ${T.accent}; width: 26px; }
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.accent}; color: #fff; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover:not(:disabled) { background: ${T.accent}; }
        .rc-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
        .rc-btn.ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
        .rc-btn.ghost:hover:not(:disabled) { background: ${T.paper}; color: ${T.ink}; }
        .rc-btn.done { background: ${T.success}; color: #fff; }
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
        .qz-pod-col { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; width: clamp(92px,24vw,170px); }
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

        /* Kahoot-kutish: tanlangan variant javob ochilguncha nafas oladi */
        .option-wait { animation: opt-wait-breathe 2s ease-in-out infinite; }
        @keyframes opt-wait-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.012); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }

        /* ============ 5-MODUL · 9-DARS CSS ============ */

        /* TERMINAL (retyped — reusable qatlamdan tashqarida, shu yerda kerak) */
        .term { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .term-bar { background: #2D2D2D; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .term-title { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: #C9D1D9; }
        .term-body { background: #1E1E1E; padding: 12px 13px; min-height: 60px; }
        .tline { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.8; color: ${CODE.text}; word-break: break-word; }

        /* ===== 📱 TELEGRAM CHAT ===== */
        .tg { border-radius: 14px; overflow: hidden; box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.26); border: 1px solid rgba(167,166,162,0.2); }
        .tg-head { background: linear-gradient(180deg,#5A9FD4,#4E8FC0); padding: 10px 14px; display: flex; align-items: center; gap: 10px; }
        .tg-ava { width: 30px; height: 30px; border-radius: 50%; background: #fff; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: #4E8FC0; flex-shrink: 0; }
        .tg-name { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: #fff; display: flex; flex-direction: column; line-height: 1.25; }
        .tg-status { font-weight: 500; font-size: 10.5px; color: #DCEBF7; }
        .tg-body { background: #CFD9E0; background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 18px 18px; padding: 13px 12px; display: flex; flex-direction: column; gap: 7px; }
        /* F-1002-83 · 168-qonun: bosib ochiladigan, hali ochilmagan element navbat bilan yengil pulslaydi (outline — halqa-soyani buzmaydi) */
        .tap-wave { animation: tap-wave 2.2s ease-out infinite; }
        .tap-wave:nth-child(2) { animation-delay: 0.35s; } .tap-wave:nth-child(3) { animation-delay: 0.7s; } .tap-wave:nth-child(4) { animation-delay: 1.05s; } .tap-wave:nth-child(5) { animation-delay: 1.4s; } .tap-wave:nth-child(6) { animation-delay: 1.75s; }
        @keyframes tap-wave { 0% { outline: 2px solid rgba(255,79,40,0.5); outline-offset: 0; } 70%, 100% { outline: 2px solid rgba(255,79,40,0); outline-offset: 6px; } }
        @media (prefers-reduced-motion: reduce) { .tap-wave { animation: none; outline: 1.5px solid rgba(255,79,40,0.35); outline-offset: 2px; } }
        .tg-body { max-height: clamp(260px, 48vh, 420px); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; } /* F-1002-85 · 169-qonun: chat cho'zilmaydi, ichki skrol */
        .tg-bubble { max-width: 82%; padding: 8px 12px; border-radius: 14px; font-family: 'Manrope'; font-weight: 500; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; box-shadow: 0 1px 2px rgba(0,0,0,0.12); word-break: break-word; }
        .tg-bubble.bot { align-self: flex-start; background: #fff; color: #0E0E10; border-bottom-left-radius: 5px; }
        .tg-bubble.user { align-self: flex-end; background: #EFFDDE; color: #0E0E10; border-bottom-right-radius: 5px; }
        .tg-bubble.muted { opacity: 0.55; }
        .tg-btns { align-self: flex-start; display: flex; flex-wrap: wrap; gap: 5px; max-width: 92%; }
        .tg-btn { font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: #2E6FA6; background: rgba(255,255,255,0.92); padding: 6px 11px; border-radius: 9px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .tg-typing { display: flex; gap: 4px; align-items: center; padding: 11px 13px; }
        .tg-typing span { width: 6px; height: 6px; border-radius: 50%; background: ${T.ink3}; animation: tg-typing-bounce 1s ease-in-out infinite; }
        .tg-typing span:nth-child(2) { animation-delay: 0.15s; } .tg-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes tg-typing-bounce { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-3px); opacity: 1; } }

        @keyframes think-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }


        /* ===== 🔑 XIZMAT OYNASI (s5) ===== */
        .sw-chain { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
        .sw-node { position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px; font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.ink}; background: ${T.paper}; border-radius: 12px; padding: 10px 12px; min-width: 78px; text-align: center; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .sw-arrow { color: ${T.ink3}; font-weight: 800; font-size: 16px; transition: opacity 0.25s; } .sw-arrow.off { opacity: 0.3; }
        .sw-socket.has-key { box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .sw-socket.empty { box-shadow: inset 0 0 0 1.5px ${T.danger}; background: ${T.dangerSoft}; }
        .sw-chip { font-size: 20px; cursor: grab; touch-action: none; user-select: none; margin-top: 4px; }
        .sw-chip:active { cursor: grabbing; }
        .sw-401 { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; color: ${T.danger}; margin-top: 4px; }
        .sw-outzone { display: flex; align-items: center; gap: 10px; background: ${T.paper}; border-radius: 12px; padding: 12px 14px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); min-height: 20px; }
        .sw-outzone-empty { border: 1.5px dashed ${T.ink3}55; box-shadow: none; background: transparent; }

        /* ===== 🔑 KALIT (s6) ===== */
        .bot-status { display: flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; background: ${T.paper}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .bot-status-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.ink3}; flex-shrink: 0; }
        .bot-status.on .bot-status-dot { background: ${T.success}; box-shadow: 0 0 8px rgba(31,122,77,0.55); }
        .bot-status.deaf .bot-status-dot { background: #E8A13A; }
        .bot-status.danger { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 1.5px ${T.danger}55; animation: bot-status-danger 1.4s ease-in-out infinite; }
        .bot-status.danger .bot-status-dot { background: ${T.danger}; box-shadow: 0 0 8px rgba(194,54,43,0.55); }
        @keyframes bot-status-danger { 0%,100% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 1.5px ${T.danger}55; } 50% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 5px ${T.danger}22; } }
        @media (prefers-reduced-motion: reduce) { .bot-status.danger { animation: none; } }

        /* ===== 📋 TUNGI SMENA (s7 markaziy) ===== */
        .ns-sheet { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 12px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ns-row { display: flex; align-items: center; gap: 8px; }
        .ns-rown { width: 20px; height: 20px; border-radius: 6px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ns-cell { flex: 1; min-height: 40px; border-radius: 10px; border: 1.5px dashed ${T.ink3}66; display: flex; align-items: center; padding: 4px 6px; }
        .ns-cell.filled { border-style: solid; border-color: ${T.line}; }
        .ns-eq { color: ${T.ink3}; font-weight: 800; }
        .ns-hint { color: ${T.ink3}; font-style: italic; font-size: 11.5px; margin: 0 auto; }
        .ns-chip { font-family: 'Manrope'; font-weight: 700; font-size: 12px; border: none; border-radius: 9px; padding: 7px 10px; cursor: grab; touch-action: none; user-select: none; width: 100%; text-align: left; }
        .ns-chip:active { cursor: grabbing; }
        .ns-chip.sig { background: linear-gradient(170deg, #FF8A3D, ${T.accent}); color: #fff; }
        .ns-chip.act { background: linear-gradient(170deg, #34B27A, ${T.success}); color: #fff; }
        .ns-chip.pool { width: auto; }
        .ns-pools { display: flex; flex-direction: column; gap: 8px; }
        .ns-pool-row { display: flex; flex-wrap: wrap; gap: 6px; min-height: 36px; padding: 8px; border-radius: 12px; background: ${T.bg}; }
        .ns-shift { display: flex; flex-direction: column; gap: 8px; }
        .ns-shift-cards { display: flex; flex-direction: column; gap: 7px; }
        .ns-cust { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: ${T.paper}; border-radius: 11px; padding: 10px 13px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.14); transition: all 0.4s ease; }
        .ns-cust-name { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink}; }
        .ns-cust-msg { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .ns-cust.ok { box-shadow: inset 0 0 0 1.5px ${T.success}; } .ns-cust.ok .ns-cust-msg { color: ${T.success}; }
        .ns-cust.wrong { box-shadow: inset 0 0 0 1.5px #E8A13A; } .ns-cust.wrong .ns-cust-msg { color: #B45309; }
        .ns-cust.silent { opacity: 0.45; transform: translateY(4px) grayscale(1); box-shadow: inset 0 0 0 1.5px ${T.ink3}; } .ns-cust.silent .ns-cust-msg { color: ${T.ink3}; }
        .ns-cust.wait { opacity: 0.55; }
        .ns-cust-dots { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; color: ${T.ink3}; animation: ns-dots-pulse 3s ease-in-out infinite; }
        @keyframes ns-dots-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .ns-cust-dots { animation: none; } }

        /* ===== 🔑 TOKEN ===== */
        .token-box { display: flex; align-items: center; gap: 10px; background: ${CODE.bg}; border-radius: 12px; padding: 13px 15px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .token-key { font-size: 18px; animation: token-key-glow 1.8s ease-in-out infinite; }
        @keyframes token-key-glow { 0%,100% { filter: drop-shadow(0 0 0 rgba(255,211,128,0)); } 50% { filter: drop-shadow(0 0 6px rgba(255,211,128,0.85)); } }
        @media (prefers-reduced-motion: reduce) { .token-key { animation: none; } }
        .token-val { font-size: clamp(12px,1.5vw,14px); color: ${CODE.str}; letter-spacing: 0.04em; }
        .token-mask { color: ${CODE.comment}; letter-spacing: 0.06em; }

        /* ===== KARTA-QATOR (kim javob beradi / rejimlar) ===== */
        .vcard { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover:not(:disabled) { transform: translateY(-1px); }
        .vlbl { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }
        /* ===== PICK ROWS (sxema ulash) ===== */
        .pick-row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 10px; padding: 11px 13px; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; }
        .pick-row:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.22); }
        .pick-row.sel, .pick-row.sel:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.ink}, 0 8px 18px -6px rgba(${T.shadowBase},0.22); background: ${T.bg}; }
        .pick-row.sel.wrong, .pick-row.sel.wrong:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.28); background: ${T.accentSoft}; }
        .pick-row.picked { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; cursor: default; }
        .pick-plus { margin-left: auto; font-weight: 700; color: ${T.ink3}; } .pick-row.picked .pick-plus { color: ${T.success}; } .pick-row.sel .pick-plus { color: ${T.ink}; } .pick-row.sel.wrong .pick-plus { color: ${T.accent}; }

        /* ===== WIRE (sxema natijasi) ===== */
        .wire { background: ${T.paper}; border-radius: 14px; padding: 13px 15px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 7px; }
        .wire-row { display: flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink}; }
        .wire-t { color: ${T.ink}; }
        .wire-arrow { color: ${T.accent}; font-weight: 800; }
        @keyframes rz-shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: rz-shake 0.4s ease; }

        .cj-items { display: flex; flex-wrap: wrap; gap: 9px; }
        .itm-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; width: clamp(84px,15vw,104px); background: ${T.paper}; border: none; border-radius: 13px; padding: 11px 7px 9px; cursor: pointer; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.2); transition: all 0.16s; }
        .itm-card:hover:not(:disabled) { transform: translateY(-2px); }
        .itm-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -8px rgba(255,79,40,0.3); }
        .itm-card:disabled { cursor: not-allowed; opacity: 0.75; }
        .itm-nm { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 10.5px; color: ${T.ink}; text-align: center; }
        .itm-check { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border-radius: 50%; background: ${T.accent}; color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px -2px rgba(255,79,40,0.5); }
        .itm-fix { margin-top: 4px; font-family: 'Manrope'; font-weight: 700; font-size: 10px; background: ${T.successSoft}; color: ${T.success}; border: none; border-radius: 8px; padding: 3px 7px; cursor: pointer; }

        /* Bo'shliqlarni to'ldirish (s13 builder) */
        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .blank-group { display: flex; flex-direction: column; gap: 6px; }
        .blank-group .bg-lbl { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .blank-row { display: flex; flex-wrap: wrap; gap: 7px; }

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi. Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        .gchip.tap-hint, .btn-soft.tap-hint, .itm-card.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }

        .dd { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,1fr); gap: 13px; align-items: start; } /* §34: keng ekranda uyalar chapda, hovuz o'ngda */
        @media (max-width: 760px) { .dd { grid-template-columns: 1fr; } }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; position: relative; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 58px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; box-shadow: 0 5px 14px -9px rgba(${T.shadowBase},0.2); transition: border-color .18s, background .18s, box-shadow .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; box-shadow: 0 8px 18px -10px rgba(${T.shadowBase},0.26); }
        /* to'g'ri terilganda — qadamlar KETMA-KET tasdiqlanadi (yuqoridan pastga to'lqin) */
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; animation: dd-ok-pop 0.42s cubic-bezier(.3,1.5,.5,1); }
        .dd-slot.ok:nth-child(2) { animation-delay: 0.07s; } .dd-slot.ok:nth-child(3) { animation-delay: 0.14s; }
        .dd-slot.ok:nth-child(4) { animation-delay: 0.21s; } .dd-slot.ok:nth-child(5) { animation-delay: 0.28s; }
        @keyframes dd-ok-pop { 0%,100% { transform: scale(1); } 45% { transform: scale(1.025); } }
        .dd-slot.bad { border-color: ${T.danger}; background: ${T.dangerSoft}; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        /* SNAP — bo'lak slotga tushganda "qulflandi" hissi (fill-mode YO'Q — sudrash transform'i erkin qolsin) */
        .dd-chip.in { animation: dd-snap 0.32s cubic-bezier(.3,1.6,.5,1); }
        @keyframes dd-snap { 0% { transform: scale(1.14) rotate(-2deg); } 55% { transform: scale(0.97) rotate(0.5deg); } 100% { transform: scale(1) rotate(0); } }
        .dd-slotn { min-width: 26px; padding: 0 8px; white-space: nowrap; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; box-shadow: none; }
        .dd-slot.bad .dd-slotn { background: ${T.danger}; color: #fff; box-shadow: none; }
        .dd-hint { flex: 1; min-width: 0; color: ${T.ink3}; font-style: italic; font-size: 13px; line-height: 1.35; }
        .dd-slot .dd-chip { min-width: 168px; text-align: left; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; position: relative; z-index: 1; }
        .dd-pool-empty { color: ${T.ink3}; font-size: 12.5px; font-style: italic; align-self: center; }
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip::before { content: '⠿'; margin-right: 7px; opacity: .75; font-weight: 400; } /* F-1002-59: to'ldirilgan gradient chip (6-Modul ko'rinishi, 26.09 oq+chegara varianti bekor), ⠿ ushlagich sudralishni aytadi */
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .dd-wrong { font-weight: 700; color: ${T.danger}; font-size: 13.5px; }
        /* s15 A7: 5-qadamdan 1-qadamga qaytuvchi strelka — faqat to'g'ri yig'ilgach chiziladi */
        .dd-slots.has-cycle { padding-right: 26px; }
        .dd-cycle { position: absolute; right: 4px; top: 29px; bottom: 29px; width: 18px; border: 2px solid ${T.success}; border-left: none; border-radius: 0 12px 12px 0; pointer-events: none; animation: dd-cycle 1s ease-out both; }
        .dd-cycle::before { content: ''; position: absolute; left: -7px; top: -6px; border-right: 8px solid ${T.success}; border-top: 5px solid transparent; border-bottom: 5px solid transparent; opacity: 0; animation: op-in 0.2s ease-out 0.95s forwards; }
        @keyframes dd-cycle { from { clip-path: inset(100% 0 0 -12px); } to { clip-path: inset(-8px 0 0 -12px); } }
        @keyframes op-in { to { opacity: 1; } }

        /* U2: kattalashtirish tugmasiga joy — matn ustiga tushmaydi */
        .zoomable:not(.z-empty):not(.zoom-on) { padding-top: 36px; }
        .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: 0; }

        /* U1: bosiladigan karta — doimiy belgi, bosilgach ✓ */
        .gchip-mk { margin-left: 7px; font-weight: 800; color: ${T.ink3}; }
        .gchip.seen { box-shadow: inset 0 0 0 1.5px ${T.success}; color: ${T.success}; }
        .gchip.seen .gchip-mk { color: ${T.success}; }
        .gchip.cur { box-shadow: inset 0 0 0 2px ${T.ink}; }
        .vcard.cur { box-shadow: inset 0 0 0 1.5px ${T.ink}, 0 8px 20px -6px rgba(${T.shadowBase},0.2); }
        .va-concrete { border-color: ${T.success}66; }

        /* s5 / s12: ustunlar (son ko'pligi) — noldan o'z soniga o'sadi */
        .fn-row { display: grid; grid-template-columns: minmax(0, 150px) minmax(0, 1fr); align-items: center; gap: 10px; }
        .fn-lbl { font-size: 13px; font-weight: 600; color: ${T.ink}; line-height: 1.3; }
        .fn-track { height: 26px; background: ${T.paper}; box-shadow: inset 0 0 0 1px rgba(${T.shadowBase},0.16); border-radius: 8px; overflow: hidden; display: flex; align-items: center; }
        .fn-fill { height: 100%; min-width: 0; background: ${T.ink3}; color: #fff; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: flex-end; padding: 0 8px; white-space: nowrap; transition: width 0.8s cubic-bezier(.4,0,.2,1), background 0.4s; }
        .fn-fill.top { background: ${T.accent}; }
        .fn-fill.fn-empty { padding: 0; }
        .fn-fill.fn-ok { background: ${T.success}; min-width: 26px; }
        .fn-fill.fn-measure { animation: fn-measure 0.9s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fn-measure { 0% { width: 0; background: ${T.ink3}; } 45% { width: 90%; background: ${T.ink3}; } 100% { width: 8%; background: ${T.success}; } }
        .fn-q { padding: 0 10px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${T.ink3}; }
        @media (max-width: 480px) { .fn-row { grid-template-columns: 1fr; gap: 4px; } }

        /* s7 voronka — pog'onalar yuqoridan pastga birin-ketin chiziladi, soniga qarab torayadi */
        .fn-funnel { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .fn-step { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 40px; padding: 8px 12px; border-radius: 10px; background: ${T.blueSoft}; box-shadow: inset 0 0 0 1.5px ${T.blue}55; transform-origin: center; animation: fn-draw 0.4s ease-out both; }
        .fn-step-n { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 15px; color: ${T.ink}; }
        .fn-step-l { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        @keyframes fn-draw { from { transform: scaleX(0.2); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }

        /* s7 saralash — dasta: bitta joriy karta, ikki savat (rang — CSS) */
        .fs { display: flex; flex-direction: column; gap: 12px; }
        .fs-preview { display: flex; flex-wrap: wrap; gap: 7px; }
        .fs-preview-chip { font-size: 13px; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 7px 11px; }
        .fs-deck { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
        .fs-hint { margin: 0; color: ${T.ink2}; }
        .fs-stack { position: relative; width: 100%; max-width: 460px; }
        .fs-card { position: relative; width: 100%; text-align: left; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(14px,1.7vw,16px); line-height: 1.4; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 12px; padding: 14px 16px; cursor: grab; touch-action: none; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.3), 4px 4px 0 -1px ${T.line}, 8px 8px 0 -2px ${T.bg}; }
        .fs-card:active { cursor: grabbing; }
        .fs-quick { display: flex; gap: 8px; flex-wrap: wrap; }
        .fs-quick-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; border: none; border-radius: 10px; padding: 9px 16px; cursor: pointer; transition: all 0.16s; }
        .fs-quick-btn.green { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
        .fs-quick-btn.gray { background: ${T.paper}; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.ink3}88; }
        .fs-quick-btn:hover { transform: translateY(-1px); }
        .fs-wrong-why.fs-wrong-why { margin: 0; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; background: ${T.dangerSoft}; border-radius: 10px; padding: 9px 12px; max-width: 460px; }
        .fs-done { margin: 0; font-weight: 700; color: ${T.success}; font-size: 14px; }
        .fs-baskets { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; }
        @media (max-width: 560px) { .fs-baskets { grid-template-columns: 1fr; } }
        .fs-basket { border-radius: 12px; padding: 10px 12px; min-height: 84px; display: flex; flex-direction: column; gap: 7px; border: 2px dashed; }
        .fs-basket.green { background: ${T.successSoft}; border-color: ${T.success}88; }
        .fs-basket.gray { background: ${T.bg}; border-color: ${T.ink3}88; }
        .fs-basket-h { font-size: 13px; color: ${T.ink}; line-height: 1.35; }
        .fs-basket.green .fs-basket-h b { color: ${T.success}; }
        .fs-basket.gray .fs-basket-h b { color: ${T.ink2}; }
        .fs-basket-body { display: flex; flex-wrap: wrap; gap: 5px; }
        .fs-placed { font-size: 12px; color: ${T.ink2}; background: ${T.paper}; border-radius: 8px; padding: 4px 8px; }

        /* s13 prompt yig'ish — qismlar bittadan, yig'ilgani bitta qatorda */
        .prompt-card { background: ${CODE.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.28); }
        .prompt-card.live { box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.blue}88; }
        .prompt-text { margin: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; line-height: 1.55; color: ${CODE.text}; overflow-wrap: anywhere; }
        .pb-gap { color: ${CODE.comment}; }
        .pb-why.pb-why { margin: 2px 0 0; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; background: ${T.dangerSoft}; border-radius: 10px; padding: 8px 12px; }
        .pb-done { display: flex; align-items: center; gap: 9px; background: ${T.successSoft}; border-radius: 10px; padding: 9px 12px; font-size: 13.5px; color: ${T.ink}; }
        .pb-done-ok { color: ${T.success}; font-weight: 800; }
        .pb-done-t { flex: 1; min-width: 0; }
        .pb-redo { border: none; background: ${T.paper}; color: ${T.ink2}; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 700; flex-shrink: 0; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.25); }
        .pb-redo:hover { color: ${T.ink}; }

        /* s16 A6: amaliyot qadamlari bittadan */
        .lp-step-cur { flex-wrap: wrap; cursor: default; }
        .lp-step-cur:hover { box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.14); }
        .lp-step-btn { margin-left: auto; padding: 8px 16px; font-size: 13px; }
        .lp-step-done { cursor: default; padding-top: 8px; padding-bottom: 8px; }

        @media (prefers-reduced-motion: reduce) { .dd-cycle, .fn-step, .fn-fill.fn-measure { animation: none !important; } .dd-cycle::before { animation: none; opacity: 1; } .fn-fill { transition: none; } }

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi (11.7). Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        /* 11.15 — jonli badge xira, hover'da tiniq (proyektorda xalaqit bermaydi) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* S21 — har og'ir animatsiyaga TINCH variant. */
        @media (prefers-reduced-motion: reduce) {
          .itm-card.tap-hint, .gchip.tap-hint, .btn-soft.tap-hint,
          .dd-chip.in, .dd-slot.ok, .dd-slot.bad, .shake, .tg-typing span { animation: none !important; }
        }

      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Foydalanuvchi fikri va iteratsiya', ru: 'Отзывы пользователей и итерация' }} />
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
