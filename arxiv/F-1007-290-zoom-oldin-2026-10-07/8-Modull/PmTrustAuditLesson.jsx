import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 10-Modul · 6-dars «Foydalanuvchi sizga ma'lumotini ishonadimi?» (m8-06, PM + amaliyot) — skeletdan (konveyer, 06.10.2026).
// Manba-haqiqat: feedback/F-1005-10modul/06-PmTrustAudit-v3.md (GATE M). Saboq: feedback/F-1005-10modul/QURUVCHI_SABOQ.md (A, B, C 19–31).
// TARKIB: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletdan;
//   kontent: s0 QKirish · s1 QReja · s2/s4/s5 QTushuncha · s3/s8 test (QuestionScreen → QTest) · a1/a2 amaliyot bloki (QBlok + ScreenBlok) ·
//   podium · kartochkalar (alohida, QKartochka) · QYakun. Bitta vizual — «Maydon: ism va telefon yo'li» (ta- klasslari).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ru-qoldiq-istisno s2: ism
// ru-qoldiq-istisno s4: ism
// ru-qoldiq-istisno s6: ism
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm8-06-v1', lessonTitle: { uz: "Foydalanuvchi sizga ma'lumotini ishonadimi?", ru: 'Доверяет ли вам пользователь свои данные?' } };
// 12 ekran · PM + amaliyot · oqim: kirish → reja → ism va telefon yo'li → 1-savol → sizib chiqish → audit varag'i → Amaliyot 1 → Amaliyot 2 → 2-savol →
//   podium → kartochkalar (alohida, SABOQ 12) → yakun. Manba-haqiqat: feedback/F-1005-10modul/06-PmTrustAudit-v3.md (GATE M).
const HW_TOKENS = [
  { t: { uz: 'audit', ru: 'аудит' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'siyosat', ru: 'политика' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: 'AUDIT.md', l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: '30 kun', ru: '30 дней' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium', type: 'stats',      template: 'custom', scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). s3 = C (2), s8 = B (1) — MD da belgilangan, o'zgarmaydi. `practice: -1` — amaliyot bloklari signali (sentinel).
const INLINE_KEYS = { s3: 2, s8: 1, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); PM darsida belgi o'rniga raqam (S-026)
const RECAPS = {
  3: {
    title: { uz: "Shaxsiy ma'lumot", ru: 'Личные данные' },
    cards: [
      { ic: '1', h: { uz: "Shaxsiy ma'lumot", ru: 'Личные данные' }, body: { uz: <>Shaxsiy ma'lumot — odamni aniqlashga imkon beradigan ma'lumot: ism, telefon.</>, ru: <>Личные данные — сведения, по которым можно определить человека: имя, телефон.</> } },
      { ic: '2', h: { uz: 'Qayerda turadi', ru: 'Где хранятся' }, body: { uz: <>«Maydon»da ular <code className="qcode">bandlar</code> jadvalida turadi, ega sahifasida ko'rinadi.</>, ru: <>В «Maydon» они хранятся в таблице <code className="qcode">bandlar</code> и видны на странице владельца.</> } },
      { ic: '3', h: { uz: 'Maxfiy kod', ru: 'Секретный код' }, body: { uz: <>6 xonali kod maxfiy, lekin u odamni aniqlamaydi.</>, ru: <>6-значный код секретный, но человека он не определяет.</> }, ask: { uz: "«Maydon»dagi qaysi yozuv bilan o'yinchini aniqlash mumkin?", ru: 'По какой записи в «Maydon» можно определить игрока?' } }
    ]
  },
  8: {
    title: { uz: 'Siyosat va kod', ru: 'Политика и код' },
    cards: [
      { ic: '1', h: { uz: "To'rt savol", ru: 'Четыре вопроса' }, body: { uz: <>«Maydon»ning sodda maxfiylik siyosati to'rt savolga javob beradi.</>, ru: <>Простая политика конфиденциальности «Maydon» отвечает на четыре вопроса.</> } },
      { ic: '2', h: { uz: 'Audit nima qiladi', ru: 'Что делает аудит' }, body: { uz: <>Bu darsdagi audit siyosatdagi gapni kod bilan solishtiradi.</>, ru: <>Аудит на этом уроке сравнивает текст политики с кодом.</> } },
      { ic: '3', h: { uz: 'Mos kelmasa', ru: 'Если не совпадает' }, body: { uz: <>Siyosatda «30 kun» yozilgan, kod o'chirmasa — tuzatish kerak.</>, ru: <>В политике написано «30 дней», а код не удаляет — нужно исправить.</> }, ask: { uz: 'Siyosatdagi «30 kun»ni qanday tekshirasiz?', ru: 'Как вы проверите «30 дней» из политики?' } }
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

// ===== DARSNING BITTA VIZUALI — «Maydon: ism va telefon yo'li» (MalumotXarita, 163/180) =====
// Bitta manba: TUGUNLAR (xarita tugunlari) · NAMUNA_BANDLAR (kunlar 0…60) · AUDIT_SAVOLLAR (6 savol) →
//   Telefon (o'yinchi sayti) · Xarita · EgaBrauzer · KunChizigi · BandJadval · AuditFayl · SiyosatSahifa — har ekran shu manbadan o'qiydi.
// Joylashuv (SABOQ 21–23): telefon = sayt doim CHAPDA, o'lchami barqaror 170×272; xarita, jadval, AUDIT.md — O'NGDA.
// Ism va telefon maketlarda xira chiziq (MD A-11); «begona» belgisi chizilgan (SVG, emoji emas).
// qolip-maket: ta-tel-band ta-tugun ta-tugun-b ta-katak ta-oldin ta-surgich ta-kalit ta-au-chip ta-goya-n ta-goya-chip ta-goya-keyin ta-gp-nusxa
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const K = ({ children }) => <code className="qcode">{children}</code>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor') }; };
// Ekrandan chiqilganda kechiktirilgan hamma qadamlar bekor bo'ladi
const useTaymer = () => {
  const ref = useRef([]);
  useEffect(() => () => ref.current.forEach(clearTimeout), []);
  return useCallback((fn, ms) => { ref.current.push(setTimeout(fn, ms)); }, []);
};
// O'qituvchi eslatmasi (MD) — faqat mentor rejimida, bosilganda ochiladi; o'quvchi yuzasida yo'q
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="ta-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="ta-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="ta-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
};
// Ism va telefon o'rnida xira chiziq (haqiqiy yoki o'ylab topilgan ism va raqam yozilmaydi)
const Xira = ({ w = 34 }) => <i className="ta-xira" style={{ width: w }} aria-hidden="true" />;

// Uchish (SABOQ 19): konvert manbadan nishonga uchadi; joylar DOM dan o'lchanadi (⛶ va --lz zoom ichida ham). Kam harakat rejimida uchmaydi.
const UCH_MS = 760;
const useUch = () => {
  const box = useRef(null);
  const taymer = useTaymer();
  const [uchlar, setUchlar] = useState([]);
  const uchir = useCallback((dan, ga, matn) => {
    const b = box.current; if (!b || kamHarakat()) return;
    const s = b.querySelector(dan), n = b.querySelector(ga); if (!s || !n) return;
    const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
    const o = (el) => { const r = el.getBoundingClientRect(); return [(r.left + r.width / 2 - br.left) / z, (r.top + r.height / 2 - br.top) / z]; };
    const [x1, y1] = o(s), [x2, y2] = o(n);
    const k = Math.random().toString(36).slice(2);
    setUchlar(a => [...a, { k, matn, x1, y1, dx: x2 - x1, dy: y2 - y1 }]);
    taymer(() => setUchlar(a => a.filter(u => u.k !== k)), UCH_MS + 60);
  }, [taymer]);
  return { box, uchlar, uchir, taymer, d: kamHarakat() ? 0 : UCH_MS };
};
const Konvertlar = ({ uchlar }) => uchlar.map(u => (
  <span key={u.k} className={cxx('ta-konvert', !u.matn && 'nuqta')} aria-hidden="true" style={{ left: u.x1 + 'px', top: u.y1 + 'px', '--dx': u.dx + 'px', '--dy': u.dy + 'px' }}>{u.matn}</span>
));

// --- Manba ---
const MANZIL = 'maydon-….netlify.app';
const SOATLAR = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const BAND = { kun: '2026-10-10', soat: '18:00' };
const HODISA_2 = ['band-qildi', 'b41d…', 'A', '18:02'];
const HODISA_5 = ['band-qildi', '9e07…', 'B', '18:02'];
const HAFTA = [
  { uz: 'Dushanba', ru: 'Понедельник' }, { uz: 'Seshanba', ru: 'Вторник' }, { uz: 'Chorshanba', ru: 'Среда' }, { uz: 'Payshanba', ru: 'Четверг' },
  { uz: 'Juma', ru: 'Пятница' }, { uz: 'Shanba', ru: 'Суббота' }, { uz: 'Yakshanba', ru: 'Воскресенье' }
];
// Kunlar 0…60 (4-ekran maketi): har kunda 1–3 xira band — namuna, statistika emas (MD A-10, TAYANCHGA SAVOL 11)
const NAMUNA_BANDLAR = Array.from({ length: 61 }, (_, d) => {
  if (d === 0) return ['16:00', '19:00'];
  const n = 1 + ((d * 7) % 3), b = (d * 5) % 6;
  return [b, (b + 2) % 6, (b + 4) % 6].slice(0, n).sort((x, y) => x - y).map(i => SOATLAR[i]);
});
const kunNomi = (d) => (d === 0 ? { uz: 'Bugun', ru: 'Сегодня' } : HAFTA[(((5 - d) % 7) + 7) % 7]);
const ESKI_QATORLAR = [{ d: 0, kun: '2026-10-10', soat: '19:00' }, { d: 12, kun: '2026-09-28', soat: '17:00' }, { d: 35, kun: '2026-09-05', soat: '18:00' }, { d: 58, kun: '2026-08-13', soat: '20:00' }];
// Forma ostidagi gap — repo `web/src/BandForma.jsx` dan so'zma-so'z (olam ichidagi matn, T-008); bo'laklar 0-ekran savol-yorliqlari uchun
const FORMA_GAP = [
  { seg: 'kim', t: { uz: "Ismingiz va raqamingizni faqat maydon egasi ko'radi", ru: 'Ваше имя и номер видит только владелец поля' } },
  { t: { uz: ": kerak bo'lsa, shu raqamga ", ru: ': если нужно, он ' } },
  { seg: 'nima', t: { uz: "qo'ng'iroq qiladi", ru: 'позвонит на этот номер' } },
  { t: { uz: ". Boshqa o'yinchilar bu vaqtni «band» deb ko'radi.", ru: '. Другие игроки видят это время как «занято».' } }
];
const GAP_YANGI = { uz: "Ismingiz va raqamingizni maydon egasi ko'radi: kerak bo'lsa, shu raqamga qo'ng'iroq qiladi. Boshqa o'yinchilar bu vaqtni «band» deb ko'radi.", ru: 'Ваше имя и номер видит владелец поля: если нужно, он позвонит на этот номер. Другие игроки видят это время как «занято».' };
const GAP_30 = { uz: "Band o'yin kunidan keyin 30 kun saqlanadi, keyin o'chiriladi.", ru: 'Бронь хранится 30 дней после дня игры, затем удаляется.' };
const S0_SAVOLLAR = [
  { seg: 'kim', t: { uz: "Kim ko'radi?", ru: 'Кто видит?' }, ok: true },
  { seg: 'nima', t: { uz: 'Nima uchun?', ru: 'Зачем?' }, ok: true },
  { seg: 'qancha', t: { uz: 'Qancha saqlanadi?', ru: 'Сколько хранится?' }, ok: false }
];
// Xarita tugunlari (2-ekran): tur — tugun yorlig'i (06-FILTR 3: saqlash va ko'rsatish — har xil)
const TUGUNLAR = [
  { id: 'oyinchi', nom: { uz: "O'yinchi sahifasi", ru: 'Страница игрока' }, tur: 'yoq' },
  { id: 'bandlar', nom: 'bandlar', kod: true, tur: 'saqlanadi' },
  { id: 'ega', nom: { uz: 'Ega sahifasi', ru: 'Страница владельца' }, tur: 'korsatiladi', izoh: { uz: "alohida nusxa yo'q, `bandlar` dan o'qiydi (parol va 6 xonali kod bilan)", ru: 'отдельной копии нет, читает из `bandlar` (по паролю и 6-значному коду)' } },
  { id: 'hodisalar', nom: 'hodisalar', kod: true, tur: 'yoq' },
  { id: 'umami', nom: { uz: 'Umami — analitika', ru: 'Umami — аналитика' }, tur: 'yoq' }
];
const TG = Object.fromEntries(TUGUNLAR.map(t => [t.id, t]));
const YORLIQ = { saqlanadi: { uz: 'saqlanadi', ru: 'хранится' }, korsatiladi: { uz: "ko'rsatiladi", ru: 'показывается' }, yoq: { uz: "ism va telefon yo'q", ru: 'нет имени и телефона' } };
// Audit varag'i — bitta manba (5-ekran, A1 promptida, A1 5-qadamida, A1 natijasida, yakunda; 8-dars `pm-m8d6-audit` orqali o'qiydi)
const AUDIT_KEY = 'pm-m8d6-audit';
const AUDIT_SAVOLLAR = [
  { id: 1, vz: 'forma', togri: 'joyida',
    savol: { uz: "So'raladigan har shaxsiy ma'lumot kerakmi?", ru: 'Нужны ли все запрашиваемые личные данные?' },
    qisqa: { uz: "So'raladigan har shaxsiy ma'lumot kerakmi?", ru: 'Все ли запрошенные данные нужны?' },
    yorliq: { uz: 'kerakli minimum', ru: 'необходимый минимум' },
    dalil: { uz: "bu MVP'da ism — egaga kim kelishini, telefon — kerak bo'lsa bog'lanishni beradi; boshqa ma'lumot so'ralmaydi", ru: "в этом MVP имя говорит владельцу, кто придёт, телефон — даёт связь при необходимости; другие данные не запрашиваются" },
    xato: { uz: "Bu MVP'da ikkalasi ham ishlatiladi — dalilga qarang.", ru: 'В этом MVP используются оба — посмотрите на доказательство.' },
    namuna: { uz: 'ism va telefon (`BandForma.jsx`)', ru: 'имя и телефон (`BandForma.jsx`)' } },
  { id: 2, vz: 'qulf', togri: 'joyida',
    savol: { uz: "Shaxsiy ma'lumotni kim ko'radi?", ru: 'Кто видит личные данные?' },
    qisqa: { uz: "Kim ko'radi?", ru: 'Кто видит?' },
    yorliq: { uz: "kim ko'radi", ru: 'кто видит' },
    dalil: { uz: "o'yinchi sahifasiga `GET /vaqtlar` soat va «band» beradi; `GET /bandlar` — `EgaGuard`, ega kirishi — parol va 6 xonali kod", ru: 'на страницу игрока `GET /vaqtlar` отдаёт время и «занято»; `GET /bandlar` — `EgaGuard`, вход владельца — пароль и 6-значный код' },
    xato: { uz: "Ism va telefon ega sahifasida ko'rinadi — parol va kod ortida.", ru: 'Имя и телефон видны на странице владельца — за паролем и кодом.' },
    namuna: { uz: 'ega sahifasi, parol va 6 xonali kod (`ega.guard.ts`)', ru: 'страница владельца, пароль и 6-значный код (`ega.guard.ts`)' } },
  { id: 3, vz: 'hodisa', togri: 'joyida',
    savol: { uz: 'Analitikaga ism yoki telefon ketadimi?', ru: 'Уходят ли имя или телефон в аналитику?' },
    qisqa: { uz: 'Analitika', ru: 'Аналитика' },
    yorliq: { uz: 'analitika', ru: 'аналитика' },
    dalil: { uz: '`hodisalar` — `band-qildi · 9e07… · B · 18:02`; Umami — «band-qildi»', ru: '`hodisalar` — `band-qildi · 9e07… · B · 18:02`; Umami — «band-qildi»' },
    xato: { uz: "Hodisada nom, brauzer ID va vaqt bor — ism yo'q.", ru: 'В событии есть название, ID браузера и время — имени нет.' },
    namuna: { uz: "`hodisalar`, Umami — ism va telefon yo'q", ru: '`hodisalar`, Umami — имени и телефона нет' } },
  { id: 4, vz: 'zaiflik', togri: 'joyida',
    savol: { uz: 'SQL injection, XSS va kodda maxfiy kalit — yopiqmi?', ru: 'SQL injection, XSS и секретный ключ в коде — закрыты?' },
    qisqa: { uz: 'Uch zaiflik', ru: 'Три уязвимости' },
    yorliq: { uz: 'zaiflik', ru: 'уязвимость' },
    dalil: { uz: "telefon qidiruvi — parametrli so'rov · ism oddiy matn bo'lib chiqadi · `JWT_SECRET` bo'lmasa Backend ishga tushmaydi", ru: 'поиск по телефону — параметризованный запрос · имя выводится обычным текстом · без `JWT_SECRET` Backend не запускается' },
    xato: { uz: 'Uch zaiflik 5-darsda yopilgan — dalilga qarang.', ru: 'Три уязвимости закрыты на 5-м уроке — посмотрите на доказательство.' },
    namuna: { uz: 'yopiq (5-dars)', ru: 'закрыты (5-й урок)' } },
  { id: 5, vz: 'chiziq', togri: 'tuzatish kerak',
    savol: { uz: "Ma'lumot qancha saqlanadi?", ru: 'Сколько хранятся данные?' },
    qisqa: { uz: 'Qancha saqlanadi?', ru: 'Сколько хранится?' },
    yorliq: { uz: "maqsad tugasa o'chirish", ru: 'удалить, когда цель достигнута' },
    dalil: { uz: "`backend/` da o'chiradigan kod yo'q; `bandlar` da sayt ochilgandan beri hamma band, `hodisalar` da ham hamma qator", ru: 'в `backend/` нет кода удаления; в `bandlar` все брони с открытия сайта, в `hodisalar` тоже все строки' },
    xato: { uz: "O'chiradigan kod yo'q — eski bandlar turibdi.", ru: 'Кода удаления нет — старые брони на месте.' },
    namuna: { uz: "o'chirish kodi: band — o'yin kunidan 30 kun o'tgach, hodisalar — 60 kundan keyin", ru: 'код удаления: бронь — через 30 дней после дня игры, события — через 60 дней' } },
  { id: 6, vz: 'gap', togri: 'tuzatish kerak',
    savol: { uz: "Foydalanuvchi ma'lumoti bilan nima bo'lishini saytda bilib oladimi?", ru: 'Узнаёт ли пользователь на сайте, что будет с его данными?' },
    qisqa: { uz: 'Saytda bilib oladimi?', ru: 'Узнаёт ли на сайте?' },
    yorliq: { uz: 'ochiq aytish', ru: 'открыто сообщить' },
    dalil: { uz: "forma ostida bitta gap — kim ko'rishi va nima uchunligi bor, qancha saqlanishi yo'q; alohida sahifa yo'q", ru: "под формой одна фраза: кто видит и зачем — есть, сколько хранится — нет; отдельной страницы нет" },
    xato: { uz: 'Gapda qancha saqlanishi yozilmagan, sahifa ham yo\'q.', ru: 'Во фразе не написано, сколько хранится, и страницы нет.' },
    namuna: { uz: "sahifa yo'q", ru: 'страницы нет' } }
];
const HOLAT_M = { joyida: { uz: 'joyida', ru: "на месте" }, 'tuzatish kerak': { uz: 'tuzatish kerak', ru: 'нужно исправить' }, tuzatildi: { uz: 'tuzatildi', ru: 'исправлено' } };
const holatKl = (h) => (h === 'joyida' ? 'ok' : h === 'tuzatildi' ? 'ok tz' : 'err');

// --- Maketlar ---
// O'yinchi telefoni = «Maydon» sayti (191 ramka; SABOQ 22–23): ustida texnologiya yorlig'i, o'lchami barqaror 170×272.
// holat: 'forma' (bo'sh) · 'toldi' (ism va telefon — xira) · 'tayyor' (+ havola) · 'band' (katak «18:00 · band») · 'siyosat' (/maxfiylik sahifasi, matnsiz)
const Telefon = ({ holat = 'toldi', manzil = MANZIL, tex = 'BandForma.jsx', onBand, bandNavbat, havola, havolaYon, onKatak, katakNavbat, katakOk, className, children }) => {
  const band = holat === 'band';
  return (
    <div className={cxx('ta-tel-ust', className)}>
      {tex && <span className="ta-tel-tex"><b>{tr({ uz: 'Sayt · React', ru: 'Сайт · React' })}</b><code>{tex}</code></span>}
      <div className="ta-telefon" data-t="tel">
        <div className="ta-tel-manzil"><i />{manzil}</div>
        {holat === 'siyosat' ? (
          <div className="ta-tel-sahifa ta-siy-mini">
            <b className="ta-tel-nom">Maydon</b>
            {[0, 1, 2, 3].map(i => <span key={i} className="ta-siy-q" style={{ '--i': i }}><i className="h" /><i /><i className="q" /></span>)}
          </div>
        ) : (
          <div className="ta-tel-sahifa" key={band ? 'b' : 'f'}>
            <b className="ta-tel-nom">Maydon</b>
            <span className="ta-tel-kun">{band ? tr(HAFTA[5]) : tr({ uz: 'Shanba · 18:00–19:00', ru: 'Суббота · 18:00–19:00' })}</span>
            {band ? (<>
              <span className="ta-tel-toast">{tr({ uz: 'Band qilindi: 18:00', ru: 'Забронировано: 18:00' })}</span>
              <span className="ta-kataklar">{SOATLAR.map(s => (s === BAND.soat
                ? <button key={s} type="button" className={cxx('ta-katak', 'band', katakNavbat && 'q-halqa navbat', katakOk && 'ok')} disabled={!onKatak} onClick={onKatak}>{s}<small>{tr({ uz: 'band', ru: 'занято' })}</small>{onKatak && <em>›</em>}{katakOk && <em className="ok">✓</em>}</button>
                : <span key={s} className="ta-katak">{s}</span>))}</span>
            </>) : (<>
              <span className="ta-fq"><small>{tr({ uz: 'Ism', ru: 'Имя' })}</small><span className="ta-input">{holat === 'forma' ? '' : <Xira w={58} />}</span></span>
              <span className="ta-fq"><small>{tr({ uz: 'Telefon', ru: 'Телефон' })}</small><span className={cxx('ta-input', holat === 'forma' && 'ph')}>{holat === 'forma' ? tr({ uz: 'Masalan: +998 90 123 45 67', ru: 'Например: +998 90 123 45 67' }) : <Xira w={84} />}</span></span>
              <span className="ta-gap-ch"><i /><i /><i className="q" /></span>
              {havola && <span className={cxx('ta-havola', havolaYon && 'yon')}>{tr({ uz: 'Maxfiylik siyosati', ru: 'Конфиденциальность' })}</span>}
              <button type="button" className={cxx('ta-tel-band', bandNavbat && 'q-halqa navbat')} disabled={!onBand} onClick={onBand}>{tr({ uz: 'Band qilish', ru: 'Забронировать' })}</button>
            </>)}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
// 0-ekran: forma ostidagi gap kattalashtirilgan (telefondagi gap chiziqlarining yonida); javobdan keyin uch savol-yorliq navbat bilan chiqadi,
// gap bo'laklari chizilib boradigan chiziq bilan ulanadi (raqam — qaysi bo'lak), «Qancha saqlanadi?» — uzuq chiziqli bo'sh joy (U-041)
const GapLupa = ({ ochiq }) => {
  const [n, setN] = useState(() => (ochiq ? 3 : 0));
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; if (ochiq) return undefined; }
    if (!ochiq) { setN(0); return undefined; }
    if (kamHarakat()) { setN(3); return undefined; }
    const ts = [0, 1, 2].map(i => setTimeout(() => setN(i + 1), 260 + i * 560));
    return () => ts.forEach(clearTimeout);
  }, [ochiq]);
  const tartib = (seg) => S0_SAVOLLAR.findIndex(s => s.seg === seg);
  return (
    <div className={cxx('ta-lupa', ochiq && 'ochiq')}>
      <p className="ta-lupa-t">{FORMA_GAP.map((g, i) => (g.seg
        ? <span key={i} className={cxx('ta-seg', tartib(g.seg) < n && 'on')}>{tr(g.t)}{tartib(g.seg) < n && <sup>{tartib(g.seg) + 1}</sup>}</span>
        : <React.Fragment key={i}>{tr(g.t)}</React.Fragment>))}{' '}
        <span className={cxx('ta-slot', n >= 3 && 'on')}>?{n >= 3 && <sup>3</sup>}</span>
      </p>
      {n > 0 && <span className="ta-lupa-s">{S0_SAVOLLAR.slice(0, n).map((s, i) => (
        <span key={s.seg} className={cxx('ta-s0-tag', s.ok ? 'ok' : 'bosh')}><b>{i + 1}</b>{tr(s.t)}<em>{s.ok ? '✓' : '?'}</em></span>
      ))}</span>}
    </div>
  );
};

// Xarita tuguni: bosilgach ✓ va ostida bitta qator (U-013); navbatdagisi halqada
const Tugun = ({ t, kor, onJoy, navbat, xira, children }) => {
  const ochiq = !!onJoy && !kor;
  return (
    <div className={cxx('ta-tugun', `t-${t.id}`, kor && 'kor', kor && `y-${t.tur}`, ochiq && 'ochiq', navbat && 'q-halqa navbat', xira && 'xira')} data-t={t.id} onClick={ochiq ? () => onJoy(t.id) : undefined}>
      <span className="ta-tugun-h">
        <b>{t.kod ? <code>{t.nom}</code> : tr(t.nom)}</b>
        {(ochiq || kor) && <button type="button" className={cxx('ta-tugun-b', kor && 'ok')} disabled={!ochiq} onClick={(e) => { e.stopPropagation(); onJoy(t.id); }} aria-label={tr(t.nom)}>{kor ? '✓' : '›'}</button>}
      </span>
      {children}
      {kor && <span className="ta-tugun-y fade-step"><em className={`ta-pill ${t.tur}`}>{tr(YORLIQ[t.tur])}</em>{t.izoh && <span>{fmtCode(tr(t.izoh))}</span>}</span>}
    </div>
  );
};
const Jadval = ({ ustun, qator, yangi, bosh, ust }) => (
  <span className="ta-jd" style={{ '--n': ustun.length, ...(ust ? { '--ust': ust } : {}) }}>
    <span className="ta-jd-h">{ustun.map(u => <i key={u}>{u}</i>)}</span>
    {qator ? <span className={cxx('ta-jd-q', yangi && 'yangi')}>{qator.map((q, i) => <i key={i}>{q}</i>)}</span> : <span className="ta-jd-bosh">{bosh}</span>}
  </span>
);
// Ega sahifasi (xaritada kichik ko'rinish): brauzer ramkasi /ega — kun va bandlar ro'yxati
const EgaMini = ({ bor, yangi }) => (
  <span className="ta-ega-mini">
    <span className="ta-br-bar"><i /><i /><i /><span>{MANZIL}/ega</span></span>
    <span className="ta-ega-q"><b>Maydon · ega</b><span className="ta-ega-kun">‹ {tr(HAFTA[5])} ›</span></span>
    <span className="ta-ega-ro">{bor
      ? <span className={cxx('ta-ega-row', yangi && 'yangi')}><b>18:00</b> · <Xira w={30} /> · <Xira w={44} /></span>
      : <span className="ta-ega-yoq">{tr({ uz: "Bu kunda band yo'q.", ru: 'В этот день броней нет.' })}</span>}</span>
  </span>
);
const Xarita = ({ bor = {}, yangi = [], kor, onJoy, navbatId, fokus }) => {
  const tg = (id, body) => <Tugun t={TG[id]} kor={kor && kor.has(id)} onJoy={onJoy} navbat={navbatId === id} xira={fokus && !['bandlar', 'ega'].includes(id)}>{body}</Tugun>;
  const bandlar = tg('bandlar', <Jadval ust="1.45fr 0.9fr 0.8fr 1fr" ustun={['kun', 'soat', 'ism', 'telefon']} qator={bor.bandlar && [BAND.kun, BAND.soat, <Xira key="i" w={26} />, <Xira key="t" w={38} />]} yangi={yangi.includes('bandlar')} />);
  const ega = tg('ega', <EgaMini bor={bor.ega} yangi={yangi.includes('ega')} />);
  // tugadi (DE-199): telefon yopiladi, xarita butun enga — ikki accent tugun katta, «ism va telefon yo'q» joylari o'ngda ixcham ustun
  if (fokus) return (
    <div className="ta-xarita fokus">
      <div className="ta-xr-fokus">
        {bandlar}{ega}
        <div className="ta-xr-yon">
          {tg('oyinchi', <code className="ta-ix">18:00 · band</code>)}
          {tg('hodisalar', <code className="ta-ix">{HODISA_2.join(' · ')}</code>)}
          {tg('umami', <code className="ta-ix">band-qildi · 1</code>)}
        </div>
      </div>
    </div>
  );
  return (
    <div className="ta-xarita">
      <div className="ta-backend" data-t="backend"><b>Backend · NestJS</b><span><code>POST /bandlar</code><code>POST /hodisalar</code></span></div>
      <div className="ta-xr-grid">
        {bandlar}
        {tg('hodisalar', <Jadval ust="1.35fr 1.1fr 0.75fr 1fr" ustun={['nom', 'brauzer_id', 'variant', 'yaratilgan']} qator={bor.hodisalar && HODISA_2} yangi={yangi.includes('hodisalar')} />)}
        {ega}
        {tg('umami', <span className="ta-umami"><span>band-qildi</span><b key={bor.umami ? 1 : 0} className={cxx(bor.umami && 'osdi')}>{bor.umami ? 1 : 0}</b></span>)}
      </div>
    </div>
  );
};

// Ega sahifasi (4-ekran, katta): ega laptopida ochiq qolgan /ega; burchakda chizilgan «begona» belgisi
const BegonaBelgi = () => (
  <span className="ta-begona" title="begona">
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M2 12 C5 6.5 19 6.5 22 12 C19 17.5 5 17.5 2 12 Z" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3.2" fill="currentColor" /></svg>
    {tr({ uz: 'begona', ru: 'чужой' })}
  </span>
);
const EgaBrauzer = ({ kun = 0, ochirildi, onOldin, onKeyin, oldinNavbat }) => {
  const ro = ochirildi && kun > 30 ? [] : NAMUNA_BANDLAR[kun];
  return (
    <div className="ta-ega">
      <div className="ta-br-bar"><i /><i /><i /><span>{MANZIL}/ega</span></div>
      <div className="ta-ega-ichi">
        <div className="ta-ega-bosh"><b>Maydon · ega</b><BegonaBelgi /></div>
        <div className="ta-ega-nav">
          <button type="button" className={cxx('ta-oldin', oldinNavbat && 'q-halqa navbat')} disabled={!onOldin || kun >= 60} onClick={onOldin} aria-label={tr({ uz: 'Bir kun orqaga', ru: 'На день назад' })}>‹</button>
          <span className="ta-ega-kunN" key={kun}><b>{tr(kunNomi(kun))}</b>{kun > 0 && <small>{tr({ uz: `${kun} kun oldin`, ru: `${kun} дн. назад` })}</small>}</span>
          <button type="button" className="ta-oldin" disabled={!onKeyin || kun <= 0} onClick={onKeyin} aria-label={tr({ uz: 'Bir kun oldinga', ru: 'На день вперёд' })}>›</button>
        </div>
        <div className="ta-ega-list" key={`${kun}-${ochirildi ? 1 : 0}`}>
          {ro.length
            ? ro.map((s, i) => <span key={s} className="ta-ega-row" style={{ '--i': i }}><b>{s}</b> · <Xira w={44} /> · <Xira w={70} /></span>)
            : <span className="ta-ega-yoq">{tr({ uz: "Bu kunda band yo'q.", ru: 'В этот день броней нет.' })}</span>}
        </div>
      </div>
    </div>
  );
};
// Kunlar chizig'i = surgich (o'ng uchi «bugun», chap uchi «60 kun oldin»); o'tilgan qism accent, o'chirilgan qism kulrang
const KunChizigi = ({ kun, onKun, ochirildi, faol, navbat }) => (
  <div className={cxx('ta-kc', navbat && 'navbat')}>
    {faol && <span className="q-yorliq">{tr({ uz: 'Kunlarni orqaga suring', ru: 'Двигайте дни назад' })}</span>}
    <div className="ta-kc-yol">
      <i className="ta-kc-asos" />
      {ochirildi && <i className="ta-kc-ochdi"><span>{tr({ uz: "o'chirildi", ru: 'удалено' })}</span></i>}
      <i className="ta-kc-otdi" style={{ width: `${((ochirildi ? Math.min(kun, 30) : kun) / 60) * 100}%` }} />
      {ochirildi && <i className="ta-kc-30"><span>{tr({ uz: '30 kun', ru: '30 дней' })}</span></i>}
      <input className="ta-surgich" type="range" min="0" max="60" step="1" dir="rtl" value={kun} disabled={!faol} onChange={e => onKun(Number(e.target.value))} aria-label={tr({ uz: 'Kunlarni orqaga suring', ru: 'Двигайте дни назад' })} />
    </div>
    <div className="ta-kc-uch"><span>{tr({ uz: '60 kun oldin', ru: '60 дней назад' })}</span><span>{tr({ uz: 'bugun', ru: 'сегодня' })}</span></div>
  </div>
);
const BandJadval = ({ ochirildi }) => (
  <div className="ta-bj">
    <span className="ta-bj-h"><code>bandlar</code></span>
    <span className="ta-jd" style={{ '--n': 4 }}>
      <span className="ta-jd-h"><i>kun</i><i>soat</i><i>ism</i><i>telefon</i></span>
      {ESKI_QATORLAR.map((q, i) => (
        <span key={q.kun} className={cxx('ta-jd-q', ochirildi && q.d > 30 && 'ochdi')} style={{ '--i': i }}><i>{q.kun}</i><i>{q.soat}</i><i><Xira w={26} /></i><i><Xira w={38} /></i></span>
      ))}
    </span>
  </div>
);
// Dalil — xaritaning bo'lagi (5-ekran savol kartasida): kichik chizma + MD dalil matni; javobdan keyin ✓ / ✗ «tushadi»
const DalilChizma = ({ vz }) => {
  if (vz === 'forma') return <span className="ta-dv forma"><i /><i /></span>;
  if (vz === 'qulf') return <span className="ta-dv qulf"><b /><i /></span>;
  if (vz === 'hodisa') return <span className="ta-dv hodisa"><i /><i /><i /></span>;
  if (vz === 'zaiflik') return <span className="ta-dv zaiflik"><i>✓</i><i>✓</i><i>✓</i></span>;
  if (vz === 'chiziq') return <span className="ta-dv chiziq"><i /><b /><b /><b /><b /></span>;
  return <span className="ta-dv gap"><i /><i /><b>?</b></span>;
};
// AUDIT.md fayl kartasi: № · Savol · (Dalil) · Holat; holat bo'sh joyi — uzuq chiziq (U-041), javobdan keyin yozuv tushadi
const AuditFayl = ({ holatlar = [], dalilli, yangi, amaliyot, sizYozasiz, fokus = [], children }) => {
  // tugadi: fokusdan tashqari (joyida) qatorlar bitta ixcham qatorga yig'iladi (SABOQ 17, 25)
  const yig = fokus.length > 0 ? AUDIT_SAVOLLAR.map((_, i) => i).filter(i => !fokus.includes(i)) : [];
  return (
    <div className={cxx('ta-audit', dalilli && 'dalilli')}>
      <div className="ta-audit-h"><i className="ta-fayl-i" aria-hidden="true" /><b>AUDIT.md · Maydon</b></div>
      <div className="ta-au-jd">
        <span className="ta-au-q bosh"><span>№</span><span>{tr({ uz: 'Savol', ru: 'Вопрос' })}</span>{dalilli && <span>{tr({ uz: 'Dalil', ru: 'Доказательство' })}</span>}<span>{tr({ uz: 'Holat', ru: 'Статус' })}{sizYozasiz && <em className="ta-siz">{tr({ uz: 'siz yozasiz', ru: 'пишете вы' })}</em>}</span></span>
        {yig.length > 0 && (
          <span className="ta-au-q yig">
            <span className="ta-au-n">{yig[0] + 1}–{yig[yig.length - 1] + 1}</span>
            <span className="ta-au-s">{yig.map(i => tr(AUDIT_SAVOLLAR[i].yorliq)).join(' · ')}</span>
            <span className="ta-au-h"><em className="ta-holat ok">{tr(HOLAT_M.joyida)}</em></span>
          </span>
        )}
        {AUDIT_SAVOLLAR.map((s, i) => {
          if (yig.includes(i)) return null;
          const h = holatlar[i];
          return (
            <span key={s.id} className={cxx('ta-au-q', fokus.includes(i) && 'fokus')} style={{ '--i': i }}>
              <span className="ta-au-n">{s.id}</span>
              <span className="ta-au-s">{tr(dalilli ? s.qisqa : s.savol)}</span>
              {dalilli && <span className="ta-au-d">{fmtCode(tr(s.namuna))}</span>}
              <span className="ta-au-h" data-au={`h${i}`}>
                {h ? <em key={h} className={cxx('ta-holat', holatKl(h), yangi === i && 'yangi')}>{h === 'tuzatildi' ? '✓ ' : ''}{tr(HOLAT_M[h])}</em> : <i className="ta-bosh-h" />}
                {amaliyot && amaliyot[i] && <small className="ta-amal">{tr(amaliyot[i])}</small>}
              </span>
            </span>
          );
        })}
      </div>
      {children}
    </div>
  );
};
// Maxfiylik siyosati sahifasi (A2 natijasi) — to'rt savol, navbat bilan ochiladi; matn MD 7-ekrandan so'zma-so'z (REPO `Maxfiylik.jsx` ham shu)
const SIYOSAT = [
  { s: { uz: "Qaysi ma'lumot?", ru: 'Какие данные?' }, j: { uz: "Band qilganda — ism va telefon. Saytdagi harakatlar ham yoziladi: nima qilingani, qachon, qaysi tugma matni ko'rsatilgani va brauzer ID (tasodifiy harf va raqamlar). Ularda ism va telefon yo'q. Saytda Umami analitikasi ham ishlaydi — unga ham ism va telefon yuborilmaydi.", ru: 'При бронировании — имя и телефон. Записываются и действия на сайте: что сделано, когда, какой текст кнопки показан, и ID браузера (случайные буквы и цифры). В них нет имени и телефона. На сайте работает и аналитика Umami — туда имя и телефон тоже не отправляются.' } },
  { s: { uz: 'Nima uchun?', ru: 'Зачем?' }, j: { uz: 'Maydon egasi kim kelishini bilsin va kerak bo\'lsa qo\'ng\'iroq qilsin.', ru: 'Чтобы владелец поля знал, кто придёт, и при необходимости позвонил.' } },
  { s: { uz: "Kim ko'radi?", ru: 'Кто видит?' }, j: { uz: "Maydon egasi — parol va 6 xonali kod bilan. Boshqa o'yinchilar vaqtni «band» deb ko'radi, ism va telefonni ko'rmaydi. Database'ga sayt dasturchisi kira oladi.", ru: 'Владелец поля — по паролю и 6-значному коду. Другие игроки видят время как «занято», имя и телефон не видят. В Database может зайти разработчик сайта.' } },
  { s: { uz: 'Qancha saqlanadi?', ru: 'Сколько хранится?' }, j: { uz: "Band o'yin kunidan keyin 30 kun saqlanadi, keyin avtomatik o'chiriladi. Saytdagi harakatlar 60 kun saqlanadi.", ru: 'Бронь хранится 30 дней после дня игры, затем удаляется автоматически. Действия на сайте хранятся 60 дней.' } }
];
const SiyosatSahifa = ({ n = 4 }) => (
  <div className="ta-siy">
    <div className="ta-br-bar"><i /><i /><i /><span>{MANZIL}/maxfiylik</span></div>
    <div className="ta-siy-ichi">
      <b className="ta-siy-n">{tr({ uz: 'Maydon · maxfiylik siyosati', ru: 'Maydon · политика конфиденциальности' })}</b>
      {SIYOSAT.slice(0, n).map((q, i) => <span key={i} className="ta-siy-b"><b>{tr(q.s)}</b><span>{tr(q.j)}</span></span>)}
    </div>
  </div>
);
// Bashorat (SABOQ 11/19): karta yengil ko'tarilib kiradi, variantlar navbat bilan; tanlangach ixcham qatorga yig'iladi va natijagacha turadi
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="ta-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <div className="ta-taxmin"><span className="ta-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="ta-taxmin-s">{savol}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Natija bloki (SABOQ 25): bitta blok — birinchi qator taxmin, keyin joriy qator (atama), izoh, xulosa; xulosa kelguncha oq, keyin yashil
const NatijaBlok = ({ tanlov, togri, variantlar, haqiqat, joriy, izoh, xulosa, oxiri }) => {
  const tx = variantlar && variantlar.find(v => v.k === tanlov);
  const ok = tanlov === togri;
  return (
    <div className={cxx('ta-nb', xulosa ? 'q-xulosa' : 'oraliq')}>
      {tx && <span className={cxx('ta-nb-t', ok && 'ok')}>{ok
        ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })}</>
        : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>}
      {joriy && <span className="ta-nb-j">{joriy}</span>}
      {izoh && <span className="ta-nb-i">{izoh}</span>}
      {xulosa && <span className="ta-nb-x">{xulosa}</span>}
      {oxiri && <span className="ta-nb-i">{oxiri}</span>}
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish): o'yinchi formasi + forma ostidagi gap; javobdan keyin uch savol-yorliq (ikkala tanlovda vizual bir xil, J-026 — ballsiz) =====
const HOOK_OPTS = [
  { id: 'ha', t: { uz: "Ha — egasi qo'ng'iroq qilishi uchun kerak", ru: 'Да — нужен, чтобы владелец мог позвонить' } },
  { id: 'avval', t: { uz: 'Avval raqamim qayerga borishini bilaman', ru: 'Сначала узнаю, куда пойдёт мой номер' } }
];
const HOOK_JAVOB = {
  avval: { uz: <><b>Aynan!</b> Forma ostidagi gap kim ko'rishini va nima uchun kerakligini aytadi. Qancha saqlanishi esa yozilmagan.</>, ru: <><b>Именно!</b> Текст под формой говорит, кто видит и зачем это нужно. А сколько хранится — не написано.</> },
  ha: { uz: <><b>Qiziq fikr!</b> Raqam qo'ng'iroq uchun kerak — forma ostida shunday yozilgan. Qancha saqlanishi esa yozilmagan.</>, ru: <><b>Интересная мысль!</b> Номер нужен для звонка — так написано под формой. А сколько хранится — не написано.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { isMentor } = useJonli();
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · ishonch', ru: 'Введение · доверие' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Telefon raqamingizni <A>bu formaga yozasizmi</A>?</>, ru: <>Оставите ли вы свой номер <A>в этой форме</A>?</> })}
        mentor={<Mentor>{tr({ uz: "Siz shanba kuni o'ynamoqchisiz va «Maydon»da 18:00 ni tanladingiz. Ikki javobdan birini tanlang.", ru: 'Вы хотите поиграть в субботу и выбрали в «Maydon» 18:00. Выберите один из двух ответов.' })}</Mentor>}
        maket={<div className={cxx('ta-s0', picked !== null && 'ochiq')}>
          <Telefon holat="forma" />
          <GapLupa ochiq={picked !== null} />
        </div>}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
        javob={picked !== null && <p className="ta-javob fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
      <MentorNote>{tr({ uz: "Sinfdan so'rang: «Notanish saytga raqam yozishdan oldin nimaga qaraysiz?» Javoblarni taxtaga yozib qo'ying — ular keyin audit savollariga o'xshab chiqadi.", ru: 'Спросите класс: «На что вы смотрите, прежде чем написать номер на незнакомом сайте?» Запишите ответы на доске — потом они окажутся похожими на вопросы аудита.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda tayyor holat bir marta o'zi yuradi — havola bosiladi → /maxfiylik ochiladi → AUDIT.md tushadi; o'ngda «01 · matn · teg» =====
const REJA = [
  { t: { uz: 'Ism va telefon qayerga borishini topasiz', ru: 'Найдёте, куда уходят имя и телефон' }, teg: { uz: "shaxsiy ma'lumot", ru: 'личные данные' } },
  { t: { uz: "Begona qo'lga o'tsa, nima ko'rinishini ko'rasiz", ru: "Увидите, что станет видно, если данные попадут в чужие руки" }, teg: { uz: 'sizib chiqish', ru: 'утечка' } },
  { t: { uz: '«Maydon»ni olti savol bo\'yicha tekshirasiz', ru: 'Проверите «Maydon» по шести вопросам' }, teg: { uz: 'audit', ru: 'аудит' } },
  { t: { uz: "O'yinchi o'qiydigan sahifani saytga qo'shasiz", ru: 'Добавите на сайт страницу, которую прочитает игрок' }, teg: { uz: 'maxfiylik siyosati', ru: 'политика конфиденциальности' } }
];
const RejaSahna = () => {
  const [q, setQ] = useState(() => (kamHarakat() ? 3 : 0)); // 0 telefon · 1 havola bosildi · 2 sahifa ochildi · 3 AUDIT.md
  useEffect(() => {
    if (q >= 3) return undefined;
    const t = setTimeout(() => setQ(v => v + 1), [800, 700, 1500][q]);
    return () => clearTimeout(t);
  }, [q]);
  return (
    <div className="ta-reja">
      <div className="ta-reja-tel">
        <Telefon holat="tayyor" havola havolaYon={q === 1} />
        {q >= 2 && <Telefon holat="siyosat" manzil={`${MANZIL}/maxfiylik`} tex="/maxfiylik" className="ta-reja-yangi" />}
      </div>
      <span className={cxx('ta-fayl', q >= 3 && 'tushdi')}><i className="ta-fayl-i" aria-hidden="true" />AUDIT.md</span>
    </div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Dars oxirida «Maydon» nima saqlashini <A>ochiq aytadi</A>.</>, ru: <>К концу урока «Maydon» <A>открыто скажет</A>, что он хранит.</> })}
      mentor={<Mentor>{tr({ uz: "O'tgan darsda ega sahifasidagi uch zaiflik yopildi, bugun — o'yinchi ma'lumoti. «Maydon» — namuna: har amaliyot oxirida shu ishni o'z MVP'ingizda qilasiz.", ru: 'На прошлом уроке закрыли три уязвимости страницы владельца, сегодня — данные игрока. «Maydon» — образец: в конце каждой практики вы сделаете то же в своём MVP.' })}</Mentor>}
      chapYorliq={tr({ uz: "ma'lumot sizib chiqsa — audit va maxfiylik siyosati", ru: 'если данные утекут — аудит и политика конфиденциальности' })}
      chap={<RejaSahna />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    >
      <p className="ta-repo">repo <code>maydon</code> · {tr({ uz: "boshlang'ich holat", ru: 'начальное состояние' })} <code>m10-dars-06-start</code> · {tr({ uz: 'namuna', ru: 'образец' })} <code>m10-dars-06-done</code></p>
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — ISM VA TELEFON YO'LI (QTushuncha keng): bashorat → «Band qilish» → konvertlar → besh joy bittadan ochiladi (U-013) → atama, GDPR =====
const S2_SAVOL = { uz: 'Yuborilgan ism va telefon nechta joyda saqlanadi?', ru: 'В скольких местах хранятся отправленные имя и телефон?' };
const S2_TAXMIN = [{ k: '1', t: { uz: 'Bitta', ru: 'Одно' } }, { k: '2', t: { uz: 'Ikkita', ru: 'Два' } }, { k: '4', t: { uz: "To'rtta", ru: 'Четыре' } }];
const JOY_TARTIB = ['oyinchi', 'bandlar', 'ega', 'hodisalar', 'umami'];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useJonli();
  const avval = !!storedAnswer || isMentor;
  const { box, uchlar, uchir, taymer, d } = useUch();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qadam, setQadam] = useState(avval ? 2 : 0); // 0 forma · 1 yuborilmoqda · 2 joylar ochiladi
  const [bor, setBor] = useState(avval ? { bandlar: 1, ega: 1, hodisalar: 1, umami: 1 } : {});
  const [yangi, setYangi] = useState([]);
  const [kor, setKor] = useState(() => new Set(avval ? JOY_TARTIB : []));
  const done = kor.size >= JOY_TARTIB.length;
  const tugadi = useTugadi(done, 1100, avval);
  useEffect(() => { if (done && storedAnswer === undefined && !isMentor) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const yonsin = (id) => { setBor(b => ({ ...b, [id]: 1 })); setYangi(y => [...y, id]); taymer(() => setYangi(y => y.filter(v => v !== id)), 1200); };
  const band = () => {
    if (!taxmin || qadam !== 0) return;
    setQadam(1);
    uchir('[data-t="tel"]', '[data-t="backend"]', 'POST /bandlar');
    taymer(() => { uchir('[data-t="backend"]', '[data-t="bandlar"]', ''); uchir('[data-t="tel"]', '[data-t="umami"]', 'band-qildi'); }, d);
    taymer(() => { yonsin('bandlar'); yonsin('umami'); uchir('[data-t="bandlar"]', '[data-t="ega"]', ''); }, 2 * d);
    taymer(() => { yonsin('ega'); uchir('[data-t="tel"]', '[data-t="backend"]', 'POST /hodisalar'); }, 3 * d);
    taymer(() => uchir('[data-t="backend"]', '[data-t="hodisalar"]', ''), 4 * d);
    taymer(() => { yonsin('hodisalar'); setQadam(2); }, 5 * d);
  };
  const joylar = qadam >= 2 && !done && !isMentor;
  const joy = (id) => { if (joylar) setKor(k => new Set([...k, id])); };
  const navbatId = joylar ? JOY_TARTIB.find(id => !kor.has(id)) : null;
  const label = !taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })
    : qadam < 2 ? tr({ uz: 'Band qiling', ru: 'Забронируйте' })
    : !done ? `${tr({ uz: 'Joylarni oching', ru: 'Откройте места' })} (${kor.size}/5)` : tr({ uz: 'Davom etish', ru: 'Продолжить' });
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · ism va telefon yo'li", ru: 'Понятие · путь имени и телефона' })} screen={screen} scrollSignal={done ? 99 : qadam} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={label} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng tugadi={tugadi}
        sarlavha={tr({ uz: <>Ism va telefon «Maydon»da <A>qayerga boradi</A>?</>, ru: <>Куда в «Maydon» <A>уходят имя и телефон</A>?</> })}
        mentor={<Mentor>{tr({ uz: "O'yinchi bo'lib «Band qilish»ni bosing va ism bilan telefon qayerda paydo bo'lishini kuzating.", ru: 'Нажмите «Забронировать» как игрок и следите, где появятся имя и телефон.' })}</Mentor>}
        bashorat={!isMentor && <Bashorat savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className={cxx('ta-sahna', tugadi && 'tugadi')} ref={box}>
          {!tugadi && <Telefon holat={qadam >= 1 ? 'band' : 'toldi'} onBand={taxmin && qadam === 0 ? band : undefined} bandNavbat={!!taxmin && qadam === 0}
            onKatak={navbatId && !kor.has('oyinchi') ? () => joy('oyinchi') : undefined} katakNavbat={navbatId === 'oyinchi'} katakOk={kor.has('oyinchi')}>
            {kor.has('oyinchi') && <span className="ta-tugun-y ta-tel-y fade-step"><code>18:00 · band</code><em className="ta-pill yoq">{tr(YORLIQ.yoq)}</em></span>}
          </Telefon>}
          {!tugadi && <div className={cxx('ta-ulagich', qadam === 1 && 'yur')} aria-hidden="true"><code>POST /bandlar</code><i /></div>}
          <Xarita bor={bor} yangi={yangi} kor={kor} onJoy={joylar ? joy : undefined} navbatId={navbatId} fokus={tugadi} />
          <Konvertlar uchlar={uchlar} />
        </div>}
        natija={done && <NatijaBlok tanlov={taxmin} togri="1" variantlar={S2_TAXMIN}
          haqiqat={tr({ uz: <>bitta — <K>bandlar</K> jadvali; ega sahifasi uni ko'rsatadi, o'zida saqlamaydi</>, ru: <>одно — таблица <K>bandlar</K>; страница владельца её показывает, но у себя не хранит</> })}
          joriy={tr({ uz: <>Ism va telefon odamni aniqlashga imkon beradi: bunday ma'lumot <b>shaxsiy ma'lumot</b> deyiladi.</>, ru: <>Имя и телефон позволяют определить человека: такие сведения называются <b>личными данными</b>.</> })}
          izoh={tr({ uz: "GDPR (General Data Protection Regulation) — Yevropa Ittifoqi qoidasi, 2018-yil 25-maydan: unda telefon raqami ham shaxsiy ma'lumot.", ru: 'GDPR (General Data Protection Regulation) — правило Европейского союза, с 25 мая 2018 года: в нём номер телефона — тоже личные данные.' })}
          xulosa={tr({ uz: <>Bu misolda ism va telefon <K>bandlar</K> da saqlanadi, ega sahifasida ko'rinadi, analitikaga ketmaydi.</>, ru: <>В этом примере имя и телефон хранятся в <K>bandlar</K>, видны на странице владельца, в аналитику не уходят.</> })} />}
      />
      <MentorNote>{tr({ uz: "«Sinfdoshingiz sahifangizni ochsa, nimani ko'radi?» darsida yopiq ma'lumot o'tilgan: begona ko'rsa, egasi zarar ko'radigan ma'lumot. Telefon raqami — ham yopiq, ham shaxsiy ma'lumot. Brauzer ID haqida «shaxsiy ma'lumot emas» demang: u ism va telefonni bildirmaydi, lekin ba'zi qoidalarda brauzerni ajratadigan raqamlar ham shaxsiy ma'lumot bo'lishi mumkin — bu dars buni hal qilmaydi.", ru: "На уроке «Что увидит одноклассник, открыв вашу страницу?» проходили закрытые данные: если их увидит чужой, владельцу будет вред. Номер телефона — и закрытые, и личные данные. Не говорите, что ID браузера «не личные данные»: имени и телефона он не выдаёт, но по некоторым правилам и числа, различающие браузеры, могут быть личными данными — урок этот вопрос не решает." })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 2, ✔ C) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · shaxsiy ma'lumot", ru: 'Проверка · личные данные' })}
    questionText="«Maydon»dagi qaysi yozuv shaxsiy ma'lumot?"
    question={tr({ uz: <h2 className="title h-ask">«Maydon»dagi qaysi yozuv <A>shaxsiy ma'lumot</A>?</h2>, ru: <h2 className="title h-ask">Какая запись в «Maydon» — <A>личные данные</A>?</h2> })}
    options={[
      { uz: '`band-qildi` hodisasining nomi', ru: 'Название события `band-qildi`' },
      { uz: 'Ega telefonidagi 6 xonali kod', ru: '6-значный код в телефоне владельца' },
      { uz: 'Band qilganning telefon raqami', ru: 'Номер телефона того, кто забронировал' },
      { uz: 'Katakdagi «18:00 · band» yozuvi', ru: 'Надпись «18:00 · занято» в ячейке' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Raqam orqali odamni aniqlab, unga qo'ng'iroq qilsa bo'ladi.", ru: 'По номеру можно определить человека и позвонить ему.' }}
    explainWrong={{
      0: { uz: 'Hodisa nomi hamma o\'yinchida bir xil — kimligini aytmaydi.', ru: 'Название события у всех игроков одинаковое — кто это, не говорит.' },
      1: { uz: 'Kod maxfiy, lekin u odamni aniqlamaydi.', ru: 'Код секретный, но человека он не определяет.' },
      3: { uz: "«band» yozuvini hamma ko'radi — unda kim band qilgani yo'q.", ru: "Надпись «занято» видят все — в ней не сказано, кто бронировал." },
      default: { uz: 'Qaysi yozuv bilan odamni aniqlash mumkin?', ru: 'По какой записи можно определить человека?' }
    }} />
);

// ===== SCREEN 4 — SIZIB CHIQISH (QTushuncha keng): chapda ega sahifasi (laptop, «begona»), o'ngda kunlar chizig'i = surgich; 2-bosqich — o'chirish kaliti =====
const S4_SAVOL = { uz: "Begona odam qaysi bandlarni ko'ra oladi?", ru: 'Какие брони может увидеть чужой?' };
const S4_TAXMIN = [{ k: 'bugun', t: { uz: 'Bugungi bandlarni', ru: 'Сегодняшние' } }, { k: 'hafta', t: { uz: 'Oxirgi haftadagi bandlarni', ru: 'За последнюю неделю' } }, { k: 'hammasi', t: { uz: 'Sayt ochilgandan beri hammasini', ru: 'Все с открытия сайта' } }];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useJonli();
  const avval = !!storedAnswer || isMentor;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [kun, setKun] = useState(avval ? 60 : 0);
  const [bosqich, setBosqich] = useState(avval ? 2 : 0); // 0 surish · 1 kalit kutilmoqda · 2 o'chirildi
  const done = bosqich >= 2;
  const tugadi = useTugadi(done, 2600, avval);
  useEffect(() => { if (done && storedAnswer === undefined && !isMentor) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const sur = (v) => { if (!taxmin || isMentor) return; const n = Math.max(0, Math.min(60, v)); setKun(n); if (n >= 60 && bosqich === 0) setBosqich(1); };
  const label = !taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })
    : bosqich === 0 ? tr({ uz: 'Kunlarni suring', ru: 'Двигайте дни' })
    : bosqich === 1 ? tr({ uz: "O'chirishni yoqing", ru: 'Включите удаление' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · sizib chiqish', ru: 'Понятие · утечка' })} screen={screen} scrollSignal={bosqich} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={label} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng tugadi={tugadi}
        sarlavha={tr({ uz: <>Ega sahifasi ochiq qolsa, <A>begona nimani ko'radi</A>?</>, ru: <>Страница владельца открыта — <A>что видно чужому</A>?</> })}
        mentor={<Mentor>{tr({ uz: <>Ega laptopini yopmay ketdi, unda <K>/ega</K> ochiq — begona nimani ko'rishini bilish uchun kunlarni orqaga suring.</>, ru: <>Владелец ушёл, не закрыв ноутбук, на нём открыт <K>/ega</K> — чтобы узнать, что увидит чужой, двигайте дни назад.</> })}</Mentor>}
        bashorat={!isMentor && <Bashorat savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={bosqich >= 1} />}
        vizual={<div className={cxx('ta-sahna s4', tugadi && 'tugadi')}>
          <EgaBrauzer kun={kun} ochirildi={bosqich >= 2} onOldin={taxmin && !tugadi ? () => sur(kun + 1) : undefined} onKeyin={taxmin && !tugadi ? () => sur(kun - 1) : undefined} />
          <div className="ta-s4-ong">
            <KunChizigi kun={kun} onKun={sur} ochirildi={bosqich >= 2} faol={!!taxmin && !tugadi && !isMentor} navbat={!!taxmin && bosqich === 0} />
            {!tugadi && taxmin && <p className="ta-kc-izoh">{tr({ uz: "Sahifada ‹ har bosilganda bir kun orqaga — surgich shuni tezlashtiradi.", ru: 'На странице каждое нажатие ‹ — на день назад; ползунок это ускоряет.' })}</p>}
            {bosqich >= 1 && !tugadi && (
              <button type="button" role="switch" aria-checked={bosqich >= 2} className={cxx('ta-kalit', bosqich >= 2 && 'on', bosqich === 1 && 'q-halqa navbat')} disabled={bosqich >= 2 || isMentor} onClick={() => setBosqich(2)}>
                <i aria-hidden="true"><b /></i><span>{tr({ uz: "O'yin kunidan 30 kun o'tgan bandlar o'chirilsin", ru: 'Удалять брони, если после дня игры прошло 30 дней' })}</span>
              </button>
            )}
            <BandJadval ochirildi={bosqich >= 2} />
          </div>
        </div>}
        natija={bosqich >= 1 && <NatijaBlok tanlov={taxmin} togri="hammasi" variantlar={S4_TAXMIN}
          haqiqat={tr({ uz: "hammasini — eski bandlar o'chirilmaydi", ru: 'все — старые брони не удаляются' })}
          joriy={tr({ uz: <>Ma'lumot ruxsatsiz begona qo'lga o'tishi <b>sizib chiqish</b> deyiladi.</>, ru: <>Когда данные без разрешения попадают в чужие руки, это называется <b>утечкой</b>.</> })}
          izoh={done && tr({ uz: "O'zbekistonning «Shaxsga doir ma'lumotlar to'g'risida»gi Qonunida (17-modda): maqsadga erishilganda ma'lumot yo'q qilinadi.", ru: 'В Законе Узбекистана «О персональных данных» (статья 17): когда цель достигнута, данные уничтожаются.' })}
          xulosa={done && tr({ uz: "Bu misolda eski bandni saqlamaslik sizib chiqsa ko'rinadigan ma'lumotni kamaytiradi.", ru: 'В этом примере, если не хранить старые брони, при утечке видно меньше данных.' })}
          oxiri={done && tr({ uz: <><K>bandlar</K> dan o'chirilgan qator ega sahifasida endi ko'rinmaydi.</>, ru: <>Строка, удалённая из <K>bandlar</K>, на странице владельца больше не видна.</> })} />}
      />
      <MentorNote>{tr({ uz: "30 kun — bu kursda «Maydon» uchun tanlangan muddat, qonun talabi emas; real mahsulotda muddat aniq ehtiyoj bilan asoslanadi. Sinfdan so'rang: «Ma'lumot qachongacha kerak?» Mahsulot egasi muddatni maqsadga mos belgilaydi va siyosatda ochiq yozadi; bu dars yuridik maslahat bermaydi. Begona qo'lga o'tishning yana bir yo'li — parol: 5-darsdagi 6 xonali kod parolning o'zi yetmasligi uchun qo'yilgan. Ega token bilan 12 soat ishlaydi; «Chiqish» bosilsa, sahifa yana parol so'raydi. «Sinfdoshingiz sahifangizni ochsa, nimani ko'radi?» darsidagi qoida: yuborilmagan ma'lumot sizib ketmaydi — bugun unga saqlanmagan ma'lumot qo'shiladi.", ru: "30 дней — срок, выбранный на этом курсе для «Maydon», а не требование закона; в реальном продукте срок обосновывают конкретной потребностью. Спросите класс: «До какого времени нужны данные?» Владелец продукта задаёт срок под цель и открыто пишет его в политике; урок не даёт юридических советов. Ещё один путь в чужие руки — пароль: 6-значный код с 5-го урока нужен, потому что одного пароля мало. Владелец работает с токеном 12 часов; после «Выйти» страница снова спрашивает пароль. Правило урока «Что увидит одноклассник, открыв вашу страницу?»: неотправленные данные не утекут — сегодня к ним добавляются и несохранённые." })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 5 — AUDIT VARAG'I (QTushuncha, P-055): chapda bitta savol kartasi (tepada ixcham chiziq 1–6), o'ngda AUDIT.md; holat kartadan faylga uchadi =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useJonli();
  const achMiss = useContext(AchMissCtx);
  const avval = !!storedAnswer || isMentor;
  const { box, uchlar, uchir, taymer, d } = useUch();
  const [javob, setJavob] = useState(() => (avval ? AUDIT_SAVOLLAR.map(s => s.togri) : []));
  const [tanlov, setTanlov] = useState(null); // { k, i } — to'g'ri javob, keyingi karta kirguncha
  const [xato, setXato] = useState(null);
  const [yangi, setYangi] = useState(null);
  const xatoRef = useRef(false);
  const kartaI = tanlov ? tanlov.i : Math.min(javob.length, AUDIT_SAVOLLAR.length - 1);
  const done = javob.length >= AUDIT_SAVOLLAR.length && !tanlov;
  const tugadi = useTugadi(done, 1800, avval);
  useEffect(() => { if (done && storedAnswer === undefined && !isMentor) onAnswer(screen, { stage: 'audit', screenIdx: screen, correct: !xatoRef.current, picked: true, solved: true }); }, [done]); // eslint-disable-line
  const bos = (k) => {
    if (tanlov || isMentor || javob.length >= AUDIT_SAVOLLAR.length) return;
    const i = javob.length, q = AUDIT_SAVOLLAR[i];
    if (k !== q.togri) {
      setXato({ k, n: Date.now() });
      if (i >= 4) { xatoRef.current = true; if (achMiss) achMiss.miss(screen); } // nishon — 5 va 6-savolda birinchi urinish
      return;
    }
    setXato(null); setTanlov({ k, i });
    uchir(`[data-au="c-${k === 'joyida' ? 'j' : 't'}"]`, `[data-au="h${i}"]`, tr(HOLAT_M[k]));
    taymer(() => { setJavob(j => [...j, k]); setYangi(i); }, d);
    taymer(() => { setTanlov(null); setYangi(null); }, d + 900);
  };
  const s = AUDIT_SAVOLLAR[kartaI];
  const tk = tanlov && tanlov.k;
  const kartaOchiq = !done && !isMentor;
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · audit varag'i", ru: 'Понятие · лист аудита' })} screen={screen} scrollSignal={javob.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Savollarni belgilang', ru: 'Отметьте вопросы' })} (${javob.length}/6)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>«Maydon»ning qaysi joyini <A>tuzatish kerak</A>?</>, ru: <>Что в «Maydon» <A>нужно исправить</A>?</> })}
        mentor={<Mentor>{tr({ uz: "Har savolga «Maydon» kodidan dalil ochiladi — unga qarab «Joyida» yoki «Tuzatish kerak»ni bosing.", ru: "К каждому вопросу открывается доказательство из кода «Maydon» — по нему нажмите «На месте» или «Нужно исправить»." })}</Mentor>}
        harakat={kartaOchiq && <div className="ta-au-chap" ref={el => { box.current = el ? el.closest('.q-tushuncha') : null; }}>
          <span className="ta-strip" aria-label={`${javob.length}/6`}>{AUDIT_SAVOLLAR.map((q, i) => {
            const h = javob[i];
            return <span key={q.id} className={cxx('ta-ns', h ? (h === 'joyida' ? 'ok' : 'err') : i === kartaI && 'joriy')}>{h ? (h === 'joyida' ? '✓' : '✗') : q.id}</span>;
          })}</span>
          <div className="ta-au-karta" key={kartaI}>
            <span className="ta-au-k-n">{kartaI + 1} / 6 <em className="ta-pill kul">{tr(s.yorliq)}</em></span>
            <b className="ta-au-k-s">{tr(s.savol)}</b>
            <span className={cxx('ta-dalil', tk && 'belgi')}>
              <DalilChizma vz={s.vz} />
              <span className="ta-dalil-t"><small>{tr({ uz: 'dalil', ru: 'доказательство' })}</small><span>{fmtCode(tr(s.dalil))}</span></span>
              {tk && <span className={cxx('ta-stamp', tk === 'joyida' ? 'ok' : 'err')} aria-hidden="true">{tk === 'joyida' ? '✓' : '✗'}</span>}
            </span>
            <span className="ta-au-tanlov">
              <QChip data-au="c-j" className={cxx('ta-au-chip', !tanlov && 'q-halqa navbat')} holat={tk === 'joyida' ? 'ok' : xato && xato.k === 'joyida' ? 'err' : undefined} silk={!!(xato && xato.k === 'joyida')} key={`j${xato && xato.k === 'joyida' ? xato.n : 0}`} disabled={!!tanlov} onClick={() => bos('joyida')}>{tr({ uz: 'Joyida', ru: "На месте" })}</QChip>
              <QChip data-au="c-t" className={cxx('ta-au-chip', !tanlov && 'q-halqa navbat')} holat={tk === 'tuzatish kerak' ? 'err' : xato && xato.k === 'tuzatish kerak' ? 'err' : undefined} silk={!!(xato && xato.k === 'tuzatish kerak')} key={`t${xato && xato.k === 'tuzatish kerak' ? xato.n : 0}`} disabled={!!tanlov} onClick={() => bos('tuzatish kerak')}>{tr({ uz: 'Tuzatish kerak', ru: 'Нужно исправить' })}</QChip>
            </span>
            {xato && <QXato>{tr(s.xato)}</QXato>}
          </div>
          <Konvertlar uchlar={uchlar} />
        </div>}
        vizual={<AuditFayl holatlar={javob} yangi={yangi} fokus={tugadi ? [4, 5] : []}
          amaliyot={done ? { 4: { uz: 'Amaliyot 1', ru: 'Практика 1' }, 5: { uz: 'Amaliyot 2', ru: 'Практика 2' } } : null}>
          {javob.length >= 6 && <span className="ta-audit-siy fade-step">
            <span className="ta-siy-atama">{tr({ uz: <>Odamga ma'lumoti bilan nima bo'lishini aytadigan sahifa <b>maxfiylik siyosati</b> deyiladi. «Maydon»ning sodda siyosati to'rt savolga javob beradi.</>, ru: <>Страница, которая говорит человеку, что будет с его данными, называется <b>политикой конфиденциальности</b>. Простая политика «Maydon» отвечает на четыре вопроса.</> })}</span>
            <span className="ta-siy-izoh">{tr({ uz: "Ochiq aytish — rozilikning o'zi emas. Qonunda (18-modda) rozilik ishlov berish shartlaridan biri; u kerak bo'lgan joyda alohida olinadi.", ru: 'Открыто сообщить — это ещё не согласие. В законе (статья 18) согласие — одно из условий обработки; где оно нужно, его берут отдельно.' })}</span>
          </span>}
        </AuditFayl>}
        natija={done && <NatijaBlok
          joriy={tr({ uz: <>Ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi <b>audit</b> deyiladi.</>, ru: <>Проверка безопасности и конфиденциальности по списку называется <b>аудитом</b>.</> })}
          izoh={tr({ uz: 'Bu darsda audit siyosatdagi gapni kod bilan ham solishtiradi.', ru: 'На этом уроке аудит ещё и сравнивает текст политики с кодом.' })}
          xulosa={tr({ uz: "Bu misolda audit ikki savolda «tuzatish kerak» topdi: bandlar o'chirilmaydi, siyosat sahifasi yo'q.", ru: 'В этом примере аудит нашёл «нужно исправить» в двух вопросах: брони не удаляются, страницы политики нет.' })} />}
      />
      <MentorNote>{tr({ uz: "Audit savollarini o'quvchi har loyihada qayta ishlatadi — Amaliyot 1 da o'z MVP'i uchun belgilaydi. Yorliqlardagi uch fikr — ochiq aytish, kerakli minimum, maqsad tugasa o'chirish — siyosatda yoziladi. Olti savol — kurs varag'i, to'liq huquqiy audit emas. Sinfdan so'rang: «4-savol nega maxfiylik ro'yxatida turibdi?» (javob: zaiflik yopiq bo'lmasa, ism va telefon begona qo'lga o'tishi mumkin).", ru: 'Вопросы аудита ученик использует в каждом проекте — в Практике 1 отмечает их для своего MVP. Три мысли на ярлыках — открыто сообщить, необходимый минимум, удалить, когда цель достигнута, — пишутся в политике. Шесть вопросов — лист курса, а не полный юридический аудит. Спросите класс: «Почему вопрос 4 стоит в списке конфиденциальности?» (ответ: если уязвимость не закрыта, имя и телефон могут попасть в чужие руки).' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 8 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s8 = 1, ✔ B; yakuniy — siyosat va audit birga) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Tekshiruv · siyosat va kod', ru: 'Проверка · политика и код' })}
    questionText="Siyosatda «30 kun» yozilgan, kod esa bandni o'chirmaydi. Audit nima deydi?"
    question={tr({ uz: <h2 className="title h-ask">Siyosatda «30 kun» yozilgan, kod esa bandni o'chirmaydi. <A>Audit nima deydi</A>?</h2>, ru: <h2 className="title h-ask">В политике написано «30 дней», а код бронь не удаляет. <A>Что скажет аудит</A>?</h2> })}
    options={[
      { uz: 'Joyida — siyosat sahifasi saytda turibdi', ru: "На месте — страница политики есть на сайте" },
      { uz: 'Tuzatish kerak — kod siyosatga mos emas', ru: 'Нужно исправить — код не соответствует политике' },
      { uz: "Joyida — o'yinchilar kodni ochib ko'rmaydi", ru: "На месте — игроки код не открывают" },
      { uz: "Tuzatish kerak — 30 kun o'yinchiga juda kam", ru: 'Нужно исправить — 30 дней для игрока слишком мало' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Siyosatdagi gap kodda bajarilmayapti — buni tuzatish kerak.', ru: 'Текст политики в коде не выполняется — это нужно исправить.' }}
    explainWrong={{
      0: { uz: 'Sahifa bor — lekin undagi gap kodda bajarilyaptimi?', ru: 'Страница есть — но выполняется ли её текст в коде?' },
      2: { uz: "Ko'rmasa ham, uning raqami 30 kundan keyin ham turadi.", ru: "Пусть не видят — номер игрока всё равно лежит и после 30 дней." },
      3: { uz: 'Audit 30 kunni baholamaydi — siyosat va kodni solishtiradi.', ru: 'Аудит не оценивает 30 дней — он сравнивает политику и код.' },
      default: { uz: 'Siyosatdagi gap bilan kod bir xilmi — shuni toping.', ru: 'Совпадают ли текст политики и код — найдите это.' }
    }} />
);

// ===== 🏅 NISHONLAR (4) — inglizcha nom, o'zbekcha tavsif; bonus — bitta (Policy Live, A2 oxirgi «Bajardim») =====
const ACHIEVEMENTS = {
  dataDetective: { icon: '🔎', name: 'Data Detective!', desc: { uz: "Shaxsiy ma'lumotni birinchi urinishda topdingiz", ru: 'Вы нашли личные данные с первой попытки' } },
  auditor: { icon: '📋', name: 'Auditor!', desc: { uz: "Audit varag'ida ikki «tuzatish kerak»ni birinchi urinishda topdingiz", ru: 'Вы с первой попытки нашли в листе аудита два «нужно исправить»' } },
  selfAudit: { icon: '🛡️', name: 'Self Audit!', desc: { uz: "O'z MVP'ingiz uchun audit varag'ini belgiladingiz", ru: 'Вы отметили лист аудита для своего MVP' } },
  policyLive: { icon: '📄', name: 'Policy Live!', desc: { uz: 'Maxfiylik siyosati saytda: ikki amaliyotni oxirigacha bajardingiz', ru: 'Политика конфиденциальности на сайте: вы выполнили обе практики до конца' } }
};
// Ekran id → nishon. s3: to'g'ri javob birinchi urinishda · s5: 5 va 6-savol birinchi urinishda · a1: 5-qadam 6/6 · a2: oxirgi «Bajardim» (bonus)
const ACH_TRIGGERS = { s3: 'dataDetective', s5: 'auditor', a1: 'selfAudit', a2: 'policyLive' };

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


// Podium savol yorliqlari (SCORED_IDX: 3, 8)
const Q_LABELS = {
  3: { uz: "1 — Shaxsiy ma'lumot", ru: '1 — Личные данные' },
  8: { uz: '2 — Siyosat va kod', ru: '2 — Политика и код' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: { uz: "shaxsiy ma'lumot", ru: 'личные данные' }, l: 4, t: 10, s: 26, d: 19, dl: 0 },
  { ch: { uz: 'sizib chiqish', ru: 'утечка' }, l: 78, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'audit', ru: 'аудит' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'maxfiylik siyosati', ru: 'политика' }, l: 70, t: 68, s: 22, d: 21, dl: 2.2 },
  { ch: 'AUDIT.md', l: 44, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: '/maxfiylik', l: 62, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: '30 kun', ru: '30 дней' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: 'GDPR', l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'ochiq aytish', ru: "открыто сообщить" }, l: 86, t: 44, s: 20, d: 22, dl: 0.6 },
  { ch: '/ega', l: 36, t: 58, s: 20, d: 24, dl: 2.5 },
  { ch: 'Maydon', l: 54, t: 6, s: 20, d: 26, dl: 1.3 },
  { ch: '✅', l: 92, t: 82, s: 20, d: 20, dl: 3.1 },
  { ch: '🎯', l: 2, t: 44, s: 20, d: 22, dl: 0.2 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol; kalitlar A B C D B A D C A D C B (har harf 3 marta) — MD dan aynan
const QUIZ_BANK = [
  { q: { uz: "Shaxsiy ma'lumot nima?", ru: 'Что такое личные данные?' }, opts: [{ uz: "Odamni aniqlashga imkon beradigan ma'lumot", ru: 'Сведения, по которым можно определить человека' }, { uz: 'Parol bilan yopilgan sahifadagi hamma yozuv', ru: 'Все записи на странице под паролем' }, { uz: 'Database jadvaliga yozilgan har bir qator', ru: 'Каждая строка в таблице Database' }, { uz: 'Saytda eng ko\'p bosiladigan tugmaning nomi', ru: 'Название самой нажимаемой кнопки сайта' }], correct: 0 },
  { q: { uz: "O'yinchi sahifasida band haqida nima ko'rinadi?", ru: 'Что видно о брони на странице игрока?' }, opts: [{ uz: "Band qilgan o'yinchining ismi va soat", ru: 'Имя забронировавшего игрока и время' }, { uz: 'Soat va «band» degan bitta yozuv', ru: 'Время и одна надпись «занято»' }, { uz: "Band qilgan o'yinchining telefoni", ru: 'Телефон забронировавшего игрока' }, { uz: 'Ism, telefon va band qilingan kun', ru: 'Имя, телефон и день брони' }], correct: 1 },
  { q: { uz: 'GDPR qanday qoida?', ru: 'Что за правило GDPR?' }, opts: [{ uz: "O'zbekiston Respublikasi qonuni, 2019-yildan", ru: 'Закон Республики Узбекистан, с 2019 года' }, { uz: '«Maydon» saytining o\'z ichki qoidasi', ru: 'Внутреннее правило сайта «Maydon»' }, { uz: 'Yevropa Ittifoqi qoidasi, 2018-yildan', ru: 'Правило Европейского союза, с 2018 года' }, { uz: 'Umami analitikasining ichki qoidasi', ru: 'Внутреннее правило аналитики Umami' }], correct: 2 },
  { q: { uz: "«Shaxsga doir ma'lumotlar to'g'risida»gi Qonunning 17-moddasi nima haqida?", ru: 'О чём статья 17 Закона «О персональных данных»?' }, opts: [{ uz: 'Saytga 6 xonali kod bilan kirish tartibi haqida', ru: 'О порядке входа на сайт с 6-значным кодом' }, { uz: "Telefon raqamini to'g'ri yozish haqida", ru: 'О правильной записи номера телефона' }, { uz: 'Saytga analitika ulash tartibi haqida', ru: 'О порядке подключения аналитики к сайту' }, { uz: "Maqsadga erishilgach yo'q qilish haqida", ru: 'Об уничтожении, когда цель достигнута' }], correct: 3 },
  { q: { uz: 'Sizib chiqish nima?', ru: 'Что такое утечка?' }, opts: [{ uz: "Ma'lumot Database'dan o'chib ketishi", ru: 'Данные стираются из Database' }, { uz: "Ma'lumot ruxsatsiz begona qo'lga o'tishi", ru: 'Данные без разрешения попадают в чужие руки' }, { uz: "Sayt Backend'dan javob ololmay qolishi", ru: 'Сайт не может получить ответ от Backend' }, { uz: "Band qilgan o'yinchi maydonga kelmasligi", ru: 'Забронировавший игрок не приходит на поле' }], correct: 1 },
  { q: { uz: "Ega sahifasi begona qo'lida. Eski bandlar o'chirilmasa-chi?", ru: 'Страница владельца в чужих руках. А если старые брони не удаляются?' }, opts: [{ uz: "Begona eng eski bandlarni ham ko'radi", ru: 'Чужой видит даже самые старые брони' }, { uz: "Begona bugungi bandlarnigina ko'radi", ru: 'Чужой видит только сегодняшние брони' }, { uz: "Begona hech qanday bandni ko'rmaydi", ru: 'Чужой не видит ни одной брони' }, { uz: "Sahifa begonadan parolni qayta so'raydi", ru: 'Страница снова спрашивает у чужого пароль' }], correct: 0 },
  { q: { uz: "Amaliyotdan keyin «Maydon» bandni qancha saqlaydi?", ru: 'Сколько «Maydon» хранит бронь после практики?' }, opts: [{ uz: 'Sayt ishlab turgan butun vaqt davomida', ru: 'Всё время, пока работает сайт' }, { uz: 'Band qilingan kunning oxirigacha', ru: 'До конца дня бронирования' }, { uz: "O'yinchi saytni yopib chiqquncha", ru: 'Пока игрок не закроет сайт' }, { uz: "O'yin kunidan 30 kun o'tguncha", ru: 'Пока не пройдёт 30 дней после дня игры' }], correct: 3 },
  { q: { uz: 'Kerakli minimum nima degani?', ru: 'Что значит необходимый минимум?' }, opts: [{ uz: 'Formani iloji boricha qisqa bezash', ru: 'Оформить форму как можно короче' }, { uz: "Ma'lumotni imkon qadar qisqa saqlash", ru: "Хранить данные как можно меньше времени" }, { uz: "Ish uchun keraklisinigina so'rash", ru: 'Просить только то, что нужно для дела' }, { uz: 'Parolni eng kam belgidan tuzish', ru: 'Составить пароль из минимума символов' }], correct: 2 },
  { q: { uz: 'Audit nima?', ru: 'Что такое аудит?' }, opts: [{ uz: "Ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi", ru: 'Проверка безопасности и конфиденциальности по списку' }, { uz: "Saytga yangi sahifa qo'shish uchun agentga talab", ru: 'Требование агенту добавить страницу на сайт' }, { uz: "Database'dagi eski bandlarni o'chirib turadigan kod", ru: 'Код, который удаляет старые брони в Database' }, { uz: 'Saytga kirgan brauzerlarni sanab turadigan sahifa', ru: "Страница, которая считает браузеры, зашедшие на сайт" }], correct: 0 },
  { q: { uz: 'Qaysi biri maxfiylik siyosatidagi savol?', ru: 'Какой вопрос — из политики конфиденциальности?' }, opts: [{ uz: 'Sayt qaysi dasturlash tilida yozilgan?', ru: 'На каком языке написан сайт?' }, { uz: 'Band qilish tugmasi qaysi rangda?', ru: 'Какого цвета кнопка брони?' }, { uz: 'Futbol maydonchasi qayerda joylashgan?', ru: 'Где находится футбольная площадка?' }, { uz: "Ma'lumot qancha vaqt saqlanadi?", ru: 'Сколько времени хранятся данные?' }], correct: 3 },
  { q: { uz: 'Forma ostida siyosat havolasi turibdi. Bu qaysi fikr?', ru: 'Под формой есть ссылка на политику. Какая это мысль?' }, opts: [{ uz: "Kerakli minimum — kam narsa so'raladi", ru: 'Необходимый минимум — просят немного' }, { uz: "O'chirish — 30 kundan keyin yo'qoladi", ru: 'Удаление — исчезает через 30 дней' }, { uz: 'Ochiq aytish — nima bo\'lishi yozilgan', ru: 'Открыто сообщить — написано, что будет' }, { uz: "Audit — ro'yxat bo'yicha tekshiriladi", ru: 'Аудит — проверка по списку' }], correct: 2 },
  { q: { uz: 'Siyosatdagi «30 kun»ni qanday tekshirasiz?', ru: "Как вы проверите «30 дней» из политики?" }, opts: [{ uz: "Agentdan «o'chiryapsanmi?» deb yana so'raysiz", ru: 'Ещё раз спросите агента: «Удаляешь?»' }, { uz: "Neon'da eski bandning o'chganini ko'rasiz", ru: 'Увидите в Neon, что старая бронь удалилась' }, { uz: 'Siyosat matnini boshidan yana bir o\'qiysiz', ru: 'Ещё раз перечитаете текст политики' }, { uz: "Kodni ochmasdan keyingi ishga o'tib ketasiz", ru: 'Перейдёте к следующему делу, не открывая код' }], correct: 1 }
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
    // Arena tokenlari — SHU darsning mavzusidan (ishonch va audit): dekorativ suzuvchi so'zlar
    const TOK = ['audit', 'AUDIT.md', '/maxfiylik', tr({ uz: '30 kun', ru: '30 дней' }), 'GDPR', '/ega', 'Maydon', 'privacy', 'bandlar', 'hodisalar'];
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
// steps [{ h, t (matn | satrlar ro'yxati), prompt?: [satr], yordam?: [satr], err?, kichik?, forma?: 'audit' | 'siyosat' }] · natija · ortda (tayanch 3 buyruqlari).
// Blok 5 qadam: 5-qadam «O'z g'oyangiz» — forma qolipda yo'q, shu ulagichda (AuditForma, SiyosatForma); bir vaqtda bitta element (SABOQ 29),
//   qiymat answers[ekran].goya da (ccProgress), «Bajardim» forma to'lgach ochiladi. «Yordam» — namuna, bosilsa ochiladi (A1 ibora, A2 qator).
const ORTDA_FETCH = 'git fetch https://github.com/Azizbekcrypto/maydon --tags';
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon', ru: 'ожидаемый результат · образец: Maydon' };
const XATO_YOLI = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
const QD = {
  ochish: { uz: 'Ochish', ru: 'Открыть' }, prompt: { uz: 'Prompt', ru: 'Промпт' }, ishga: { uz: 'Ishga tushirish', ru: 'Запуск' },
  tekshirish: { uz: 'Tekshirish', ru: 'Проверка' }, internet: { uz: 'Internetda tekshirish', ru: 'Проверка в интернете' }, goya: { uz: "O'z g'oyangiz", ru: 'Ваша идея' }
};
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <>
      <QTugma ikkinchi className="ta-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="ta-yordam fade-step">{satrlar.map((l, i) => <span key={i} className="ta-yordam-s">{fmtCode(tr(l))}</span>)}</span>}
    </>
  );
};
const qadamMatn = (t) => (Array.isArray(t) ? t.map((l, i) => <span key={i} className="ta-satr">{fmtCode(tr(l))}</span>) : fmtCode(tr(t)));

// A1 5-qadam: o'z MVP'i uchun olti savol — bittadan; tepada ixcham chiziq (joriysi ajralgan, qolganlari holat belgisi)
const AuditForma = ({ qiymat = {}, onYoz }) => {
  const birinchi = AUDIT_SAVOLLAR.findIndex((_, i) => !qiymat[i]);
  const [j, setJ] = useState(birinchi < 0 ? 0 : birinchi);
  const taymer = useTaymer();
  const son = AUDIT_SAVOLLAR.filter((_, i) => qiymat[i]).length;
  const tanla = (h) => {
    const yangi = { ...qiymat, [j]: h };
    onYoz(yangi);
    const keyingi = AUDIT_SAVOLLAR.findIndex((_, i) => i > j && !yangi[i]);
    const bosh = AUDIT_SAVOLLAR.findIndex((_, i) => !yangi[i]);
    const n = keyingi >= 0 ? keyingi : bosh;
    if (n >= 0) taymer(() => setJ(n), 320);
  };
  const s = AUDIT_SAVOLLAR[j];
  return (
    <span className="ta-goya" data-tola={son === AUDIT_SAVOLLAR.length ? '1' : '0'}>
      <span className="ta-goya-strip">{AUDIT_SAVOLLAR.map((q, i) => {
        const h = qiymat[i];
        return <button key={q.id} type="button" className={cxx('ta-goya-n', i === j && 'joriy', h && (h === 'joyida' ? 'ok' : 'err'))} onClick={() => setJ(i)} aria-label={`${q.id}`}>{h ? (h === 'joyida' ? '✓' : '✗') : q.id}</button>;
      })}<em className="ta-goya-son">{son} / 6</em></span>
      <span className="ta-goya-karta" key={j}>
        <span className="ta-goya-s"><b>{s.id}.</b> {tr(s.savol)}</span>
        <span className="ta-goya-ch">
          {['joyida', 'tuzatish kerak'].map(h => (
            <button key={h} type="button" className={cxx('ta-goya-chip', qiymat[j] === h && (h === 'joyida' ? 'ok' : 'err'), !qiymat[j] && 'q-halqa navbat')} onClick={() => tanla(h)}>{tr(HOLAT_M[h])}</button>
          ))}
        </span>
      </span>
    </span>
  );
};
// A2 5-qadam: to'rt javob + «nima buzilmasin» — bittadan; javoblar pastdagi promptning qavslariga o'zi qo'yiladi
const SIY_MAYDON = [
  { id: 'qaysi', l: { uz: "qaysi ma'lumot", ru: 'какие данные' } },
  { id: 'nima', l: { uz: 'nima uchun', ru: 'зачем' } },
  { id: 'kim', l: { uz: "kim ko'radi", ru: 'кто видит' } },
  { id: 'qancha', l: { uz: 'qancha saqlanadi', ru: 'сколько хранится' } },
  { id: 'buzilmasin', l: { uz: 'nima buzilmasin', ru: 'что не сломать' } }
];
const MUDDAT_BOR = /\d|kun|hafta|oy\b|oyda|oydan|yil|soat|daqiqa/i; // ru rejimida ham raqam yetadi (maslahat, bloklamaydi)
const muddatYoq = (v) => { const t = String(v || '').trim(); return !!t && (/abadiy/i.test(t) || !MUDDAT_BOR.test(t)); };
const SIY_SATRLAR = [
  { uz: "Qayerda: saytda yangi «Maxfiylik siyosati» sahifasi va ma'lumot so'raladigan forma ostida havola.", ru: 'Где: на сайте новая страница «Политика конфиденциальности» и ссылка под формой, где спрашивают данные.' },
  { uz: "Nima qilsin: sahifa to'rt savolga javob bersin — qaysi ma'lumot: {qaysi}; nima uchun: {nima}; kim ko'radi: {kim}; qancha saqlanadi: {qancha}.", ru: "Что сделать: пусть страница отвечает на четыре вопроса — какие данные: {qaysi}; зачем: {nima}; кто видит: {kim}; сколько хранится: {qancha}." },
  { uz: "Forma ostiga shu sahifaga havola qo'y — bosilganda forma to'ldirilganicha qolsin.", ru: "Поставь под формой ссылку на эту страницу — пусть при нажатии форма остаётся заполненной." },
  { uz: "Nima buzilmasin: {buzilmasin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: {buzilmasin}. Больше ничего не трогай, скажи, какие файлы изменились.' }
];
const siyMatn = (q) => SIY_SATRLAR.map(l => tr(l).replace(/\{(\w+)\}/g, (_, k) => String(q[k] || '').trim() || `{${tr(SIY_MAYDON.find(m => m.id === k).l)}}`));
const SiyosatForma = ({ qiymat = {}, onYoz }) => {
  const birinchi = SIY_MAYDON.findIndex(m => !String(qiymat[m.id] || '').trim());
  const [j, setJ] = useState(birinchi < 0 ? 0 : birinchi);
  const [bosh, setBosh] = useState(false);
  const [ok, setOk] = useState(false);
  const m = SIY_MAYDON[j];
  const v = qiymat[m.id] || '';
  const keyingi = () => {
    if (!String(v).trim()) { setBosh(true); return; }
    setBosh(false);
    const n = SIY_MAYDON.findIndex((x, i) => i > j && !String(qiymat[x.id] || '').trim());
    const b = SIY_MAYDON.findIndex(x => !String(qiymat[x.id] || '').trim());
    setJ(n >= 0 ? n : b >= 0 ? b : Math.min(j + 1, SIY_MAYDON.length - 1));
  };
  const nusxa = async () => { try { await navigator.clipboard.writeText(siyMatn(qiymat).join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  const tola = SIY_MAYDON.every(x => String(qiymat[x.id] || '').trim());
  return (
    <span className="ta-goya" data-tola={tola ? '1' : '0'}>
      <span className="ta-goya-strip">{SIY_MAYDON.map((x, i) => {
        const bor = String(qiymat[x.id] || '').trim();
        return <button key={x.id} type="button" className={cxx('ta-goya-n', 'soz', i === j && 'joriy', bor && 'ok')} onClick={() => { setBosh(false); setJ(i); }}>{bor ? '✓ ' : ''}{tr(x.l)}</button>;
      })}</span>
      <span className="ta-goya-karta" key={m.id}>
        <label className="ta-goya-l"><b>{tr(m.l)}:</b>
          <textarea rows={2} value={v} placeholder="…" onChange={e => { setBosh(false); onYoz({ ...qiymat, [m.id]: e.target.value }); }} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); keyingi(); } }} />
        </label>
        {bosh && <span className="ta-goya-xato">{tr({ uz: 'Bu savolga javob yozing.', ru: 'Напишите ответ на этот вопрос.' })}</span>}
        {m.id === 'qancha' && muddatYoq(v) && <span className="ta-goya-mas">{tr({ uz: "Maqsad tugagach qachon o'chirilishini yozing.", ru: 'Напишите, когда удалять после достижения цели.' })}</span>}
        {!tola && <QTugma ikkinchi className="ta-goya-keyin" onClick={keyingi}>{tr({ uz: 'Keyingisi →', ru: 'Дальше →' })}</QTugma>}
      </span>
      <span className="ta-gp">
        <span className="ta-gp-h"><span>{tr({ uz: 'Siz → Antigravity (uyda)', ru: 'Вы → Antigravity (дома)' })}</span><button type="button" className="ta-gp-nusxa" disabled={!tola} onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
        {SIY_SATRLAR.map((l, i) => (
          <span key={i} className="ta-gp-s">{tr(l).split(/(\{\w+\})/g).map((p, k) => {
            const mm = /^\{(\w+)\}$/.exec(p);
            if (!mm) return <React.Fragment key={k}>{p}</React.Fragment>;
            const qv = String(qiymat[mm[1]] || '').trim();
            return <span key={k + (qv ? 'v' : 'b')} className={cxx('ta-gp-joy', qv && 'tola')}>{qv || `{${tr(SIY_MAYDON.find(x => x.id === mm[1]).l)}}`}</span>;
          })}</span>
        ))}
      </span>
    </span>
  );
};
const formaTola = (tur, g) => (tur === 'audit'
  ? AUDIT_SAVOLLAR.every((_, i) => g && g[i])
  : SIY_MAYDON.every(x => g && String(g[x.id] || '').trim()));

function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda = [], doneText, children }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const [goya, setGoya] = useState(() => (storedAnswer && storedAnswer.goya) || {});
  const formaN = steps.findIndex(c => c.forma);
  const formaTur = formaN >= 0 ? steps[formaN].forma : null;
  const tola = formaTur ? formaTola(formaTur, goya) : true;
  const done = stepN >= steps.length;
  const goyaYoz = (g) => {
    setGoya(g);
    if (!avval) onAnswer(screen, { ...(storedAnswer || {}), goya: g });
    if (formaTur === 'audit' && formaTola('audit', g)) lsSet(AUDIT_KEY, { savollar: AUDIT_SAVOLLAR.map((s, i) => ({ savol: ou(s.savol), holat: g[i] })) });
  };
  const bajardim = () => {
    if (isMentorLive || done) return;
    if (stepN === formaN && !tola) return; // 5-qadam: forma to'lmaguncha «Bajardim» yopiq
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, goya });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  // Yangi ochilgan qadam (uzun prompt, 5-qadam formasi) «Bajardim»i bilan birga ko'rinsin
  const birinchiRef = useRef(true);
  useEffect(() => {
    if (birinchiRef.current) { birinchiRef.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cxx('ta-blok', stepN === formaN && !tola && 'qulf')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
          qadamlar={steps.map(c => ({
            h: tr(c.h),
            t: c.forma
              ? <>{qadamMatn(c.t)}{c.forma === 'audit' ? <AuditForma qiymat={goya} onYoz={goyaYoz} /> : <SiyosatForma qiymat={goya} onYoz={goyaYoz} />}</>
              : qadamMatn(c.t),
            prompt: c.prompt && c.prompt.map(l => tr(l)),
            kimga: c.prompt && tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }),
            xato: c.yordam ? <Yordam satrlar={c.yordam} /> : c.kichik ? fmtCode(tr(c.kichik)) : (c.err && fmtCode(tr(c.err)))
          }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortda}
          pastki={<MentorPracticeStats live={_live} screen={screen} />}>
          {children}
        </QBlok>
      </div>
    </Stage>
  );
}

// Kutilgan natija maketlari — bitta manbadan (AuditFayl, Telefon, SiyosatSahifa)
// A1: AUDIT.md — holat ustuni «siz yozasiz»: holatlar navbat bilan tushadi (5 — tuzatildi, 6 — tuzatish kerak); ostida Neon tekshiruvi
const A1_HOLAT = ['joyida', 'joyida', 'joyida', 'joyida', 'tuzatildi', 'tuzatish kerak'];
const NatijaA1 = () => {
  const [n, setN] = useState(() => (kamHarakat() ? 7 : 0));
  useEffect(() => {
    if (n > 6) return undefined;
    const t = setTimeout(() => setN(v => v + 1), n === 0 ? 700 : 380);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <div className="ta-natija">
      <AuditFayl dalilli sizYozasiz holatlar={A1_HOLAT.slice(0, Math.min(n, 6))} yangi={n >= 1 && n <= 6 ? n - 1 : null} />
      <div className={cxx('ta-neon', n > 6 && 'javob')}>
        <span className="ta-neon-h">Neon · SQL Editor</span>
        <code className="ta-neon-q">SELECT * FROM bandlar WHERE ism = 'tekshiruv';</code>
        <span className="ta-neon-j">{n > 6 ? tr({ uz: "javob bo'sh — bitta ham qator yo'q", ru: 'ответ пустой — ни одной строки' }) : '…'}</span>
      </div>
      <p className="ta-natija-izoh">{tr({ uz: <><K>AUDIT.md</K> dagi fayl nomlari sizda boshqacha bo'lishi mumkin — dalil va holat muhim.</>, ru: <>Имена файлов в <K>AUDIT.md</K> у вас могут отличаться — важны доказательство и статус.</> })}</p>
    </div>
  );
};
// A2: o'yinchi telefoni — havola bosiladi → /maxfiylik yangi oynada ochiladi (to'rt savol navbat bilan); ostida yangi gap (30 kun qo'shildi, «faqat» olindi)
const NatijaA2 = () => {
  const [n, setN] = useState(() => (kamHarakat() ? 6 : 0)); // 0 telefon · 1 havola bosildi · 2 sahifa · 3–6 savollar
  useEffect(() => {
    if (n >= 6) return undefined;
    const t = setTimeout(() => setN(v => v + 1), [800, 600, 450, 420, 420, 420][n]);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <div className="ta-natija">
      <div className="ta-a2">
        <div className="ta-a2-chap">
          <Telefon holat="tayyor" havola havolaYon={n === 1} />
          <p className="ta-gap-yangi">{tr(GAP_YANGI)} <mark>{tr(GAP_30)}</mark></p>
        </div>
        {n >= 2 ? <div className="ta-a2-siy" key="s"><SiyosatSahifa n={Math.max(0, n - 2)} /></div> : <div className="ta-a2-siy bosh" key="b" aria-hidden="true" />}
      </div>
      <QIzoh>{tr({ uz: "Siyosatdagi har gap kodda bor: muddatlar — Amaliyot 1 dagi o'chirish, «kim ko'radi» — ega sahifasidagi himoya.", ru: 'Каждая фраза политики есть в коде: сроки — удаление из Практики 1, «кто видит» — защита страницы владельца.' })}</QIzoh>
      <p className="ta-natija-izoh">{tr({ uz: "Render va Netlify o'zingizniki — o'tgan moduldagi deploy'dan.", ru: 'Render и Netlify — ваши, с деплоя прошлого модуля.' })}</p>
    </div>
  );
};
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · audit va o'chirish", ru: 'Практика 1 · аудит и удаление' }}
    title={{ uz: <>Audit yozilsin, <A>eski bandlar o'chirilsin</A>.</>, ru: <>Пусть появится аудит, а <A>старые брони удалятся</A>.</> }}
    mentor={{ uz: <>Talab tayyor — siz qavs ichini to'ldirasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Требование готово — вы заполняете скобки; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QD.ochish, t: { uz: "Antigravity'da `maydon` papkasini oching. Birinchi terminalda `cd backend`, `npm run start:dev`; ikkinchisida `cd web`, `npm run dev`.", ru: 'Откройте папку `maydon` в Antigravity. В первом терминале `cd backend`, `npm run start:dev`; во втором `cd web`, `npm run dev`.' } },
      { h: QD.prompt, t: { uz: "qavs ichiga bandlar qachon o'chirilishini yozing (kunlarni orqaga surgan mashqni eslang), «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'впишите в скобки, когда удалять брони (вспомните упражнение, где двигали дни назад), нажмите «Скопировать», отправьте в Antigravity:' }, prompt: [
        { uz: "Qayerda: repo ildizida yangi AUDIT.md; Backend'da bandlar va hodisalar jadvallari (backend/).", ru: 'Где: в корне репо новый AUDIT.md; в Backend таблицы bandlar и hodisalar (backend/).' },
        { uz: "Nima qilsin: avval repo'ni olti savol bo'yicha tekshir va AUDIT.md ga jadval qilib yoz: savol · dalil («Maydon»da nima bor, fayl nomi bilan) · holat. Holat ustunini bo'sh qoldir — uni men yozaman.", ru: 'Что сделать: сначала проверь репо по шести вопросам и запиши в AUDIT.md таблицей: вопрос · доказательство (что есть в «Maydon», с именем файла) · статус. Столбец статуса оставь пустым — его пишу я.' },
        { uz: "Savollar: 1) so'raladigan har shaxsiy ma'lumot kerakmi; 2) shaxsiy ma'lumotni kim ko'radi; 3) analitikaga ism yoki telefon ketadimi; 4) SQL injection, XSS va kodda maxfiy kalit — yopiqmi; 5) ma'lumot qancha saqlanadi; 6) foydalanuvchi ma'lumoti bilan nima bo'lishini saytda bilib oladimi.", ru: 'Вопросы: 1) нужны ли все запрашиваемые личные данные; 2) кто видит личные данные; 3) уходят ли имя или телефон в аналитику; 4) SQL injection, XSS и секретный ключ в коде — закрыты ли; 5) сколько хранятся данные; 6) узнаёт ли пользователь на сайте, что будет с его данными.' },
        { uz: "Keyin o'chirishni qo'sh: {qachon o'chirilsin} bandlar va 60 kundan eski hodisalar o'chirilsin — Backend ishga tushganda va keyin har 24 soatda; o'chirish WHERE bilan; kun Toshkent vaqti bilan.", ru: 'Потом добавь удаление: пусть удаляются брони {когда удалять} и события старше 60 дней — при запуске Backend и затем каждые 24 часа; удаление через WHERE; день по ташкентскому времени.' },
        { uz: "5-savol dalili ostiga nima qo'shganingni yoz.", ru: 'Под доказательством к вопросу 5 напиши, что добавил.' },
        { uz: "Nima buzilmasin: POST /bandlar, GET /vaqtlar, /ega (parol va 6 xonali kod), namuna bandlar, hodisalar va /dashboard. Yangi paket o'rnatma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: POST /bandlar, GET /vaqtlar, /ega (пароль и 6-значный код), образцовые брони, события и /dashboard. Новых пакетов не ставь. Больше ничего не трогай, скажи, какие файлы изменились.' }
      ], yordam: [{ uz: "«o'yin kunidan 30 kun o'tgan»", ru: '«у которых после дня игры прошло 30 дней»' }] },
      { h: QD.ishga, t: { uz: "Backend terminali o'zi qayta yukladi, xato yo'q; repo ildizida `AUDIT.md` paydo bo'ldi.", ru: 'Терминал Backend перезагрузился сам, ошибок нет; в корне репо появился `AUDIT.md`.' }, err: XATO_YOLI },
      { h: QD.tekshirish, t: [
        { uz: 'agent nima desa ham, o\'zingiz tekshiring:', ru: 'что бы ни сказал агент, проверьте сами:' },
        { uz: '(1) 2-savol: brauzerda `localhost:3000/bandlar` ni oching — ism va telefon emas, `401` chiqsin.', ru: '(1) Вопрос 2: откройте в браузере `localhost:3000/bandlar` — должны быть не имя и телефон, а `401`.' },
        { uz: "(2) 5-savol: Neon'dagi SQL Editor'da eski band qo'shing — bu test ma'lumoti, haqiqiy odamniki emas: `INSERT INTO bandlar (kun, soat, ism, telefon) VALUES ('2026-08-01', '18:00', 'tekshiruv', '+998 00 000 00 00');`", ru: "(2) Вопрос 5: добавьте старую бронь в SQL Editor в Neon — это тестовые данные, не реального человека: `INSERT INTO bandlar (kun, soat, ism, telefon) VALUES ('2026-08-01', '18:00', 'tekshiruv', '+998 00 000 00 00');`" },
        { uz: "Backend terminalida Ctrl+C, keyin yana `npm run start:dev`. So'ng: `SELECT * FROM bandlar WHERE ism = 'tekshiruv';` — javob bo'sh, bitta ham qator yo'q.", ru: "В терминале Backend Ctrl+C, затем снова `npm run start:dev`. Потом: `SELECT * FROM bandlar WHERE ism = 'tekshiruv';` — ответ пустой, ни одной строки." },
        { uz: "O'yinchi sahifasida eng yaqin shanba 17:00 va 20:00 hali «band» — yangi bandlar joyida.", ru: 'На странице игрока в ближайшую субботу 17:00 и 20:00 всё ещё «занято» — новые брони на месте.' },
        { uz: "(3) `AUDIT.md` ni oching va Holat ustunini o'zingiz yozing: har dalilni o'qib — joyida, tuzatildi yoki tuzatish kerak. Dalilda fayl nomi bo'lmasa — agentdan qaysi faylga qarab yozganini so'rang.", ru: "(3) Откройте `AUDIT.md` и сами заполните столбец статуса: прочитав каждое доказательство — на месте, исправлено или нужно исправить. Если в доказательстве нет имени файла — спросите агента, по какому файлу он писал." },
        { uz: 'Mos kelmagan joyni uch qism bilan agentga yozing.', ru: "Опишите агенту несовпадение в трёх частях." }
      ], kichik: { uz: "Bu tekshiruvni faqat o'z saytingizda qilasiz. Boshqa saytni egasining ruxsatisiz tekshirmaysiz.", ru: 'Эту проверку вы делаете только на своём сайте. Чужой сайт без разрешения владельца не проверяете.' } },
      { h: QD.goya, t: { uz: "o'z MVP'ingiz uchun shu olti savolni belgilang: har biriga «joyida» yoki «tuzatish kerak». «Bajardim» oltitasi belgilangach ochiladi.", ru: "отметьте эти шесть вопросов для своего MVP: каждому — «на месте» или «нужно исправить». «Готово» откроется, когда отметите все шесть." }, forma: 'audit' }
    ]}
    natijaYorliq={NATIJA_YORLIQ}
    natija={<NatijaA1 />}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-06-start']}
    doneText={{ uz: "Dalillar yozildi, holatni siz qo'ydingiz; eski band o'chdi, yangilari joyida.", ru: 'Доказательства записаны, статус поставили вы; старая бронь удалилась, новые на месте.' }}>
    <MentorNote>{tr({ uz: "Holatni agent emas, o'quvchi qo'yadi — agent dalil topadi, qarorni odam qiladi. Backend uxlab qolsa (Render), o'chirish keyingi ishga tushishda bajariladi — shuning uchun siyosatda «30 kun saqlanadi, keyin o'chiriladi» deyiladi, aniq soat aytilmaydi.", ru: 'Статус ставит ученик, а не агент — агент находит доказательство, решение принимает человек. Если Backend уснул (Render), удаление выполнится при следующем запуске — поэтому в политике сказано «хранится 30 дней, затем удаляется», без точного часа.' })}</MentorNote>
  </ScreenBlok>
);
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · maxfiylik siyosati', ru: 'Практика 2 · политика конфиденциальности' }}
    title={{ uz: <>O'yinchi siyosatni <A>formadan ochib o'qisin</A>.</>, ru: <>Пусть игрок <A>откроет политику из формы</A> и прочитает.</> }}
    mentor={{ uz: <>Endi «Nima qilsin» qatorini o'zingiz yozasiz, namuna «Yordam»da; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Теперь строку «Что сделать» пишете сами, образец — в «Помощи»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QD.ochish, t: { uz: "ikkala terminal ishlayapti; `AUDIT.md` da 6-savol — tuzatish kerak.", ru: 'оба терминала работают; в `AUDIT.md` вопрос 6 — нужно исправить.' } },
      { h: QD.prompt, t: { uz: "«Nima qilsin» qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'напишите строку «Что сделать» сами, нажмите «Скопировать», отправьте в Antigravity:' }, prompt: [
        { uz: "Qayerda: saytda yangi /maxfiylik sahifasi va band qilish formasi ostidagi gap (web/); AUDIT.md dagi 6-savol.", ru: 'Где: на сайте новая страница /maxfiylik и текст под формой бронирования (web/); вопрос 6 в AUDIT.md.' },
        { uz: 'Nima qilsin: {nima qilsin}', ru: 'Что сделать: {что сделать}' },
        { uz: "Nima buzilmasin: forma va POST /bandlar, /ega, /dashboard, hodisalar; /maxfiylik ochilganda hodisa yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: "Что не сломать: форму и POST /bandlar, /ega, /dashboard, события; при открытии /maxfiylik событие не записывается. Больше ничего не трогай, скажи, какие файлы изменились." }
      ], yordam: [{ uz: "«Nima qilsin: `/maxfiylik` to'rt savolga javob bersin — qaysi ma'lumot (ism va telefon; saytdagi harakatlar — ism va telefonsiz, brauzer ID bilan; Umami'ga ham ism va telefon ketmaydi), nima uchun (ega kim kelishini bilsin va kerak bo'lsa qo'ng'iroq qilsin), kim ko'radi (maydon egasi — parol va 6 xonali kod bilan; Database'ga sayt dasturchisi kira oladi), qancha saqlanadi (band — o'yin kunidan keyin 30 kun, harakatlar — 60 kun). Forma ostidagi gapga 30 kunni qo'sh, «faqat» so'zini olib tashla, yoniga «Maxfiylik siyosati» havolasini qo'y: u yangi oynada ochilsin — forma to'ldirilganicha qolsin. `AUDIT.md` da 6-savol dalilini yangila.»", ru: "«Что сделать: пусть `/maxfiylik` отвечает на четыре вопроса — какие данные (имя и телефон; действия на сайте — без имени и телефона, с ID браузера; в Umami имя и телефон тоже не уходят), зачем (чтобы владелец знал, кто придёт, и при необходимости позвонил), кто видит (владелец поля — по паролю и 6-значному коду; в Database может зайти разработчик сайта), сколько хранится (бронь — 30 дней после дня игры, действия — 60 дней). Добавь к тексту под формой 30 дней, убери слово «только», рядом поставь ссылку «Конфиденциальность»: пусть открывается в новом окне — форма остаётся заполненной. Обнови доказательство к вопросу 6 в `AUDIT.md`.»" }] },
      { h: QD.ishga, t: { uz: "sayt o'zi yangilandi, xato yo'q. Keyin `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni `git add` bilan qo'shing, `git commit -m \"audit va maxfiylik\"`, `git push` — Render va Netlify kodni GitHub'dan olib, o'zi yangilanadi (bir necha daqiqa).", ru: "сайт обновился сам, ошибок нет. Потом `git status` — изменённые файлы должны совпасть со списком агента; добавьте их через `git add`, `git commit -m \"audit va maxfiylik\"`, `git push` — Render и Netlify возьмут код из GitHub и обновятся сами (несколько минут)." }, err: XATO_YOLI },
      { h: QD.internet, t: [
        { uz: "Netlify manzilingizni oching va bo'sh katakni bosing: forma ostidagi gapda 30 kun bor, «Maxfiylik siyosati» yangi oynada ochiladi, forma esa to'ldirilganicha qoladi.", ru: 'Откройте свой адрес Netlify и нажмите свободную ячейку: в тексте под формой есть 30 дней, ссылка «Конфиденциальность» открывается в новом окне, а форма остаётся заполненной.' },
        { uz: "Manzilga `/maxfiylik` qo'shib ham oching — sahifa to'g'ridan ochilsin. Sinfdoshingiz telefonida havolani ochib, «qancha saqlanadi?» javobini topsin.", ru: 'Откройте и адрес с `/maxfiylik` — страница должна открыться напрямую. Пусть одноклассник откроет ссылку на телефоне и найдёт ответ на «сколько хранится?».' },
        { uz: "Hammasi joyida bo'lsa — `AUDIT.md` da 6-savol holatini o'zingiz «tuzatildi» qiling.", ru: 'Если всё на месте — сами поставьте вопросу 6 в `AUDIT.md` статус «исправлено».' },
        { uz: "Netlify yangilanmasa — laptopda `localhost:5173` da tekshiring, push'ni mentor bilan ko'rasiz.", ru: 'Если Netlify не обновился — проверьте на ноутбуке в `localhost:5173`, push посмотрите с ментором.' }
      ] },
      { h: QD.goya, t: [
        { uz: "o'z MVP'ingiz uchun to'rt savolga javob yozing: qaysi ma'lumot, nima uchun, kim ko'radi, qancha saqlanadi; «nima buzilmasin»ni ham o'zingiz yozasiz.", ru: 'напишите для своего MVP ответы на четыре вопроса: какие данные, зачем, кто видит, сколько хранится; «что не сломать» тоже пишете сами.' },
        { uz: "Javoblar qavslarga o'zi qo'yiladi; «Nusxalash» — uyda o'z loyihangizda Antigravity'ga berasiz.", ru: 'Ответы сами встают в скобки; «Скопировать» — дома отдадите Antigravity в своём проекте.' }
      ], forma: 'siyosat' }
    ]}
    natijaYorliq={NATIJA_YORLIQ}
    natija={<NatijaA2 />}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-06-done']}
    doneText={{ uz: "Siyosat saytda: o'yinchi formadan ochib, to'rt savolga javob topadi.", ru: 'Политика на сайте: игрок открывает её из формы и находит ответы на четыре вопроса.' }} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran, Mentorsiz (SABOQ 12, 16); matn MD «Kartochkalar (12)» jadvalidan
const KARTOCHKALAR = [
  { front: { uz: "Shaxsiy ma'lumot nima?", ru: 'Что такое личные данные?' }, back: { uz: "Odamni aniqlashga imkon beradigan ma'lumot", ru: 'Сведения, по которым можно определить человека' }, note: { uz: '«Maydon»da — ism va telefon', ru: 'В «Maydon» — имя и телефон' } },
  { front: { uz: "«Maydon»da ism va telefon qayerda turadi?", ru: 'Где в «Maydon» лежат имя и телефон?' }, back: { uz: "bandlar jadvalida; ega sahifasida ko'rinadi", ru: 'В таблице bandlar; видны на странице владельца' }, note: { uz: "O'yinchi sahifasiga soat va «band» boradi", ru: 'На страницу игрока уходят время и «занято»' } },
  { front: { uz: 'Hodisalar va Umami\'ga ism yoki telefon ketadimi?', ru: 'Уходят ли имя или телефон в события и Umami?' }, back: { uz: "Yo'q", ru: 'Нет' }, note: { uz: 'Hodisada — nom, brauzer ID, variant va vaqt', ru: 'В событии — название, ID браузера, вариант и время' } },
  { front: { uz: 'Sizib chiqish nima?', ru: 'Что такое утечка?' }, back: { uz: "Ma'lumot ruxsatsiz begona qo'lga o'tishi", ru: 'Данные без разрешения попадают в чужие руки' }, note: { uz: 'Masalan, ochiq qolgan ega sahifasi', ru: 'Например, оставленная открытой страница владельца' } },
  { front: { uz: "Eski bandlar o'chirilmasa, begona nimani ko'radi?", ru: 'Что увидит чужой, если старые брони не удалять?' }, back: { uz: 'Sayt ochilgandan beri hamma bandni', ru: 'Все брони с открытия сайта' }, note: { uz: "O'chirilgan qator ega sahifasida endi ko'rinmaydi", ru: 'Удалённая строка на странице владельца больше не видна' } },
  { front: { uz: "«Maydon» bandni qachon o'chiradi?", ru: 'Когда «Maydon» удаляет бронь?' }, back: { uz: "O'yin kunidan 30 kun o'tgach — avtomatik", ru: 'Через 30 дней после дня игры — автоматически' }, note: { uz: 'Bu kursda tanlangan muddat; mahsulot egasi maqsadga mos belgilaydi', ru: 'Срок выбран на курсе; владелец продукта задаёт его под цель' } },
  { front: { uz: "O'zbekistonda shaxsiy ma'lumot haqidagi qonun qanday ataladi?", ru: 'Как называется закон Узбекистана о личных данных?' }, back: { uz: "«Shaxsga doir ma'lumotlar to'g'risida»gi Qonun", ru: 'Закон «О персональных данных»' }, note: { uz: "O'RQ-547, 2019-yil 1-oktabrdan kuchga kirgan", ru: 'ЗРУ-547, вступил в силу 1 октября 2019 года' } },
  { front: { uz: 'Qonunning 17 va 18-moddalarida nima bor?', ru: 'Что в статьях 17 и 18 закона?' }, back: { uz: "17 — maqsadga erishilganda yo'q qilish; 18 — ishlov berish shartlari, ular orasida rozilik", ru: '17 — уничтожение, когда цель достигнута; 18 — условия обработки, среди них согласие' }, note: { uz: 'Dars yuridik maslahat bermaydi', ru: 'Урок не даёт юридических советов' } },
  { front: { uz: 'GDPR nima?', ru: 'Что такое GDPR?' }, back: { uz: 'Yevropa Ittifoqi qoidasi, 2018-yil 25-maydan', ru: 'Правило Европейского союза, с 25 мая 2018 года' }, note: { uz: "Unda telefon raqami ham shaxsiy ma'lumot", ru: 'В нём номер телефона — тоже личные данные' } },
  { front: { uz: "Odam ma'lumotini ishonib berishi uchun qaysi uch fikr kerak?", ru: 'Какие три мысли нужны, чтобы человек доверил свои данные?' }, back: { uz: "Ochiq aytish, kerakli minimum, maqsad tugasa o'chirish", ru: 'Открыто сообщить, необходимый минимум, удалить, когда цель достигнута' }, note: { uz: "Ochiq aytish — rozilikning o'zi emas", ru: 'Открыто сообщить — это ещё не согласие' } },
  { front: { uz: 'Audit nima?', ru: 'Что такое аудит?' }, back: { uz: "Ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi", ru: 'Проверка безопасности и конфиденциальности по списку' }, note: { uz: '«Maydon»da — AUDIT.md, olti savol', ru: 'В «Maydon» — AUDIT.md, шесть вопросов' } },
  { front: { uz: 'Maxfiylik siyosati qaysi savollarga javob beradi?', ru: 'На какие вопросы отвечает политика конфиденциальности?' }, back: { uz: "Qaysi ma'lumot, nima uchun, kim ko'radi, qancha saqlanadi", ru: 'Какие данные, зачем, кто видит, сколько хранится' }, note: { uz: 'Inglizchasi — privacy policy', ru: 'По-английски — privacy policy' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); ko'rsatma karta ostida, birinchi bosishgacha, karta yuzi halqada */}
        <div className={cxx('ta-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="ta-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204). CODE STRIKE va arena — jonli o'yin qatlami; uyga vazifa — karta «kim uchun · nechta · muddat» + audit varag'i =====
const YAKUN_RECAP = [
  { uz: "Shaxsiy ma'lumot — odamni aniqlashga imkon beradigan ma'lumot: «Maydon»da ism va telefon.", ru: 'Личные данные — сведения, по которым можно определить человека: в «Maydon» это имя и телефон.' },
  { uz: "Eski bandni saqlamaslik sizib chiqsa ko'rinadigan ma'lumotni kamaytiradi.", ru: 'Если не хранить старые брони, при утечке видно меньше данных.' },
  { uz: "Odam ma'lumotini ishonib berishi uchun: ochiq aytish, kerakli minimum, maqsad tugasa o'chirish.", ru: 'Чтобы человек доверил свои данные: открыто сообщить, необходимый минимум, удалить, когда цель достигнута.' },
  { uz: "Audit — ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi; u siyosatda yozilganni kod bilan solishtiradi.", ru: 'Аудит — проверка безопасности и конфиденциальности по списку; он сравнивает написанное в политике с кодом.' },
  { uz: "«Maydon»ning sodda maxfiylik siyosati to'rt savolga javob beradi: qaysi ma'lumot, nima uchun, kim ko'radi, qancha saqlanadi.", ru: 'Простая политика конфиденциальности «Maydon» отвечает на четыре вопроса: какие данные, зачем, кто видит, сколько хранится.' }
];
const UYGA = [
  { uz: "Audit varag'ingizdagi «tuzatish kerak» savollarini agentga talab qilib bering va `AUDIT.md` yozdiring.", ru: "Передайте агенту вопросы «нужно исправить» из своего листа аудита как требование — пусть напишет `AUDIT.md`." },
  { uz: "Maxfiylik siyosati sahifasini qo'shing — to'rt javobingiz Amaliyot 2 dagi promptda.", ru: 'Добавьте страницу политики конфиденциальности — ваши четыре ответа в промпте из Практики 2.' },
  { uz: 'Bitta sinfdoshingiz siyosatingizni ochib, «qancha saqlanadi?» javobini topsin.', ru: 'Пусть один одноклассник откроет вашу политику и найдёт ответ на «сколько хранится?».' }
];
const HwKarta = () => {
  const audit = lsGet(AUDIT_KEY);
  const varaq = audit && Array.isArray(audit.savollar) && audit.savollar.length ? audit.savollar : null;
  return (
    <div className="card hw fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      <div className="ta-hw-meta">
        <span><small>{tr({ uz: 'kim uchun', ru: 'для кого' })}</small>{tr({ uz: "o'z MVP'ingiz", ru: 'ваш MVP' })}</span>
        <span><small>{tr({ uz: 'nechta', ru: 'сколько' })}</small>{tr({ uz: 'audit va siyosat sahifasi', ru: 'аудит и страница политики' })}</span>
        <span><small>{tr({ uz: 'muddat', ru: 'срок' })}</small>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</span>
      </div>
      <ol className="ta-hw-q">{UYGA.map((h, i) => <li key={i}><i>{i + 1}</i><span>{fmtCode(tr(h))}</span></li>)}</ol>
      {varaq && <div className="ta-hw-varaq">
        <span className="ta-hw-vl">{tr({ uz: "Audit varag'ingiz", ru: 'Ваш лист аудита' })}</span>
        <span className="ta-hw-vq">{varaq.map((v, i) => <span key={i} className={cxx('ta-hw-v', v.holat !== 'joyida' && 'acc')}><b>{i + 1}</b>{v.savol}<em>{tr(HOLAT_M[v.holat] || { uz: v.holat, ru: v.holat })}</em></span>)}</span>
      </div>}
      <p className="hw-note">{tr({ uz: <>Keyingi dars — <b>«Production deploy: domen, SSL, monitoring»</b>: sayt yiqilsa, ogohlantirish sizga keladi.</>, ru: <>Следующий урок — <b>«Production deploy: домен, SSL, мониторинг»</b>: если сайт упадёт, оповещение придёт вам.</> })}</p>
    </div>
  );
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
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Audit o'tdi, <A>maxfiylik siyosati saytda</A>.</>, ru: <>Аудит пройден, <A>политика уже на сайте</A>.</> })}
        cta={<>
          <p className="small ta-fikr fade-up d1">{tr({ uz: "Odam ma'lumotini ishonib berishi uchun kerakli minimumni yig'asiz, maqsad tugagach o'chirasiz va buni saytda ochiq aytasiz; audit siyosatda yozilganni kod bilan solishtiradi.", ru: 'Чтобы человек доверил свои данные, вы собираете необходимый минимум, удаляете, когда цель достигнута, и открыто говорите об этом на сайте; аудит сравнивает написанное в политике с кодом.' })}</p>
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={YAKUN_RECAP.map(r => tr(r))}
        uyga={<HwKarta />}
        hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      />
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmTrustAuditLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === 6-DARS (ishonch va audit) — darsning o'z vizuali «ta-»: faqat qolip tokenlari (D3), emoji yo'q (D4). Izohda teskari tirnoq yozilmaydi === */
        .q-tushuncha { position: relative; }
        .ta-xira { display: inline-block; height: 7px; border-radius: 4px; background: ${fon(T.ink2, 0.22)}; vertical-align: middle; flex: none; }
        .ta-mnote-c { align-self: flex-start; }
        .ta-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px dashed ${T.ink2}; font-size: 13px; line-height: 1.5; color: ${T.ink}; cursor: pointer; }
        .ta-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
        /* Konvert — bosilgan narsa joyidan joyiga uchadi (SABOQ 19) */
        .ta-konvert { position: absolute; z-index: 8; pointer-events: none; transform: translate(-50%,-50%); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; white-space: nowrap; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 8px; padding: 3px 8px; box-shadow: 0 8px 18px -6px ${fon(T.accent, 0.45)}; animation: ta-uch 0.76s cubic-bezier(.45,0,.2,1) forwards; }
        .ta-konvert.nuqta { width: 14px; height: 14px; padding: 0; border-radius: 50%; background: ${T.accent}; }
        @keyframes ta-uch { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.7); } 15% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.9); } }
        @keyframes ta-tush { from { opacity: 0; transform: translateY(-8px) scale(0.96); } }
        @keyframes ta-yangi { 0% { opacity: 0; transform: translateX(-12px); background: ${T.okFon}; } 25% { opacity: 1; transform: none; background: ${T.okFon}; } 100% { background: transparent; } }
        @keyframes ta-kot { from { opacity: 0; transform: translateY(12px); } }
        @keyframes ta-karta { from { opacity: 0; transform: translateX(24px); } }
        @keyframes ta-ochil { from { opacity: 0; transform: translateX(-36px) scale(0.92); } }
        @keyframes ta-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.5)}; } 70%, 100% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } }
        @keyframes ta-son { from { transform: scale(1.6); } }

        /* Telefon = sayt (SABOQ 22–23): 170×272 barqaror, ustida texnologiya yorlig'i */
        .ta-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; width: 172px; }
        .ta-tel-tex { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 99px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; color: ${T.ink}; white-space: nowrap; }
        .ta-tel-tex b { font-weight: 700; }
        .ta-tel-tex code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.accent}; }
        .ta-telefon { position: relative; width: 170px; height: 272px; flex: none; border: 2.5px solid ${T.ink}; border-radius: 24px; background: ${T.paper}; padding: 9px 9px 10px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 14px 28px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .ta-tel-manzil { display: flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 99px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: -0.45px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: none; }
        .ta-tel-manzil i { width: 6px; height: 6px; border-radius: 50%; background: ${T.line}; flex: none; }
        .ta-tel-sahifa { display: flex; flex-direction: column; gap: 6px; flex: 1; min-height: 0; animation: fade-step 0.35s ease both; }
        .ta-tel-nom { font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .ta-tel-kun { font-size: 12px; color: ${T.ink2}; font-weight: 600; margin-top: -4px; }
        .ta-fq { display: flex; flex-direction: column; gap: 2px; }
        .ta-fq small { font-size: 11px; color: ${T.ink2}; font-weight: 600; }
        .ta-input { height: 26px; border: 1px solid ${T.line}; border-radius: 7px; background: ${T.bg}; display: flex; align-items: center; padding: 0 8px; font-size: 11px; color: ${T.ink}; overflow: hidden; white-space: nowrap; }
        .ta-input.ph { color: ${T.ink2}; font-weight: 500; letter-spacing: -0.25px; padding: 0 6px; font-size: 9.5px; } /* namuna matni maket maydoniga sig'sin (modul:yopish C) */
        .ta-gap-ch { display: flex; flex-direction: column; gap: 4px; padding: 2px 0; }
        .ta-gap-ch i { height: 5px; border-radius: 3px; background: ${fon(T.ink2, 0.2)}; transition: background 0.4s; }
        .ta-gap-ch i.q { width: 62%; }
        .ta-havola { align-self: flex-start; font-size: 12px; font-weight: 700; color: ${T.accent}; text-decoration: underline; text-underline-offset: 2px; border-radius: 6px; padding: 1px 3px; margin: -2px -3px; transition: background 0.2s; }
        .ta-havola.yon { background: ${T.accentSoft}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.2)}; }
        .ta-tel-band { margin-top: auto; height: 32px; flex: none; border: none; border-radius: 9px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; }
        .ta-tel-band:disabled { cursor: default; }
        .ta-tel-toast { padding: 7px 9px; border-radius: 9px; background: ${T.okFon}; color: ${T.ok}; font-size: 12.5px; font-weight: 700; animation: ta-tush 0.45s cubic-bezier(.3,1.4,.5,1) both; }
        .ta-kataklar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; }
        .ta-katak { position: relative; height: 42px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.bg}; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink}; padding: 0; }
        .ta-katak.band { background: ${fon(T.ink2, 0.14)}; color: ${T.ink2}; cursor: default; }
        button.ta-katak.band:not(:disabled) { cursor: pointer; border-color: ${T.accent}; }
        .ta-katak small { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; }
        .ta-katak em { position: absolute; top: -7px; right: -7px; width: 18px; height: 18px; border-radius: 50%; background: ${T.accent}; color: #fff; font-style: normal; font-family: 'Manrope', sans-serif; font-size: 11px; display: grid; place-items: center; }
        .ta-katak em.ok { background: ${T.ok}; animation: ta-tush 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        .ta-siy-mini { gap: 9px; }
        .ta-siy-q { display: flex; flex-direction: column; gap: 4px; animation: fade-step 0.4s ease both; animation-delay: calc(var(--i) * 110ms + 150ms); }
        .ta-siy-q i { height: 5px; border-radius: 3px; background: ${fon(T.ink2, 0.18)}; }
        .ta-siy-q i.h { width: 55%; height: 7px; background: ${fon(T.accent, 0.45)}; }
        .ta-siy-q i.q { width: 70%; }

        /* 0-ekran: forma ostidagi gap kattalashtirilgan; bo'laklar chizilib boradigan chiziq bilan ulanadi */
        .ta-s0 { display: flex; gap: 16px; align-items: center; justify-content: center; }
        .ta-s0.ochiq .ta-gap-ch i { background: ${fon(T.accent, 0.4)}; }
        .ta-lupa { position: relative; flex: 1; min-width: 0; max-width: 300px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 14px 15px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.25); }
        .ta-lupa::before { content: ''; position: absolute; left: -8px; top: 50%; width: 14px; height: 14px; background: ${T.paper}; border-left: 1px solid ${T.line}; border-bottom: 1px solid ${T.line}; transform: translateY(-50%) rotate(45deg); }
        p.ta-lupa-t { margin: 0; font-size: 13.5px; line-height: 1.65; color: ${T.ink}; }
        .ta-seg { background-image: linear-gradient(${T.accent}, ${T.accent}); background-repeat: no-repeat; background-position: 0 100%; background-size: 0% 2px; transition: background-size 0.6s ease, color 0.3s; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
        .ta-seg.on { background-size: 100% 2px; color: ${T.accent}; font-weight: 700; }
        .ta-seg sup, .ta-slot sup { display: inline-grid; place-items: center; width: 16px; height: 16px; margin-left: 3px; border-radius: 50%; background: ${T.accent}; color: #fff; font-size: 11px; font-weight: 800; vertical-align: top; line-height: 1; animation: ta-tush 0.35s ease both; }
        .ta-slot { display: inline-flex; align-items: center; justify-content: center; min-width: 54px; height: 22px; padding: 0 6px; border: 1.5px dashed ${fon(T.ink2, 0.5)}; border-radius: 6px; color: ${T.ink2}; font-weight: 800; vertical-align: middle; transition: border-color 0.3s, color 0.3s; }
        .ta-slot.on { border-color: ${T.accent}; color: ${T.accent}; }
        .ta-lupa-s { display: flex; flex-direction: column; gap: 6px; }
        .ta-s0-tag { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 10px; background: ${T.bg}; font-size: 13px; font-weight: 700; color: ${T.ink}; animation: ta-tush 0.4s cubic-bezier(.3,1.4,.5,1) both; }
        .ta-s0-tag b { width: 20px; height: 20px; border-radius: 50%; background: ${T.accent}; color: #fff; font-size: 11px; display: grid; place-items: center; flex: none; }
        .ta-s0-tag em { margin-left: auto; font-style: normal; color: ${T.ok}; font-weight: 800; }
        .ta-s0-tag.bosh { border: 1.5px dashed ${fon(T.ink2, 0.5)}; background: ${T.paper}; }
        .ta-s0-tag.bosh em { color: ${T.ink2}; }
        p.ta-javob { margin: 0; font-size: clamp(14px,1.6vw,15.5px); line-height: 1.55; color: ${T.ink}; }
        @media (max-width: 640px) { .ta-s0 { flex-direction: column; } .ta-lupa { max-width: none; width: 100%; } .ta-lupa::before { left: 50%; top: -8px; transform: translateX(-50%) rotate(135deg); } }

        /* 1-ekran: tayyor holat o'zi yuradi */
        .ta-reja { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
        .ta-reja-tel { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
        .ta-reja-yangi { animation: ta-ochil 0.55s cubic-bezier(.2,.9,.3,1.1) both; }
        .ta-fayl { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: ${T.ink}; opacity: 0; transform: translateY(-14px); transition: opacity 0.4s, transform 0.45s cubic-bezier(.3,1.5,.5,1); }
        .ta-fayl.tushdi { opacity: 1; transform: none; }
        .ta-fayl-i { display: inline-block; width: 14px; height: 17px; border-radius: 2px 6px 2px 2px; background: ${T.accentSoft}; border: 1.5px solid ${T.accent}; flex: none; }
        p.ta-repo { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        p.ta-repo code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; }

        /* 2-ekran: telefon chapda, so'rov chizig'i, xarita o'ngda */
        .ta-sahna { position: relative; display: grid; grid-template-columns: 172px minmax(70px, 112px) minmax(0,1fr); gap: 0 12px; align-items: start; }
        .ta-ulagich { margin-top: 70px; display: flex; flex-direction: column; gap: 6px; align-items: stretch; }
        .ta-ulagich code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; text-align: center; white-space: nowrap; }
        .ta-ulagich i { position: relative; height: 0; border-top: 2px dashed ${T.line}; transition: border-color 0.3s; }
        .ta-ulagich i::after { content: ''; position: absolute; right: -2px; top: -6px; border-left: 8px solid var(--ta-uq, ${T.line}); border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
        .ta-ulagich.yur i { border-top-color: ${T.accent}; --ta-uq: ${T.accent}; } .ta-ulagich.yur code { color: ${T.accent}; }
        .ta-xarita { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .ta-backend { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; font-size: 13.5px; transition: opacity 0.3s; }
        .ta-backend span { display: flex; gap: 6px; flex-wrap: wrap; }
        .ta-backend code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 2px 7px; border-radius: 6px; }
        .ta-xr-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; align-items: start; }
        .ta-tugun { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; min-width: 0; transition: border-color 0.2s, opacity 0.3s; }
        .ta-tugun.ochiq { cursor: pointer; } .ta-tugun.ochiq:hover { border-color: ${T.accent}; }
        .ta-tugun.kor.y-saqlanadi { border-color: ${T.accent}; } .ta-tugun.kor.y-korsatiladi { border-color: ${fon(T.accent, 0.5)}; }
        .ta-tugun.xira, .ta-backend.xira { opacity: 0.45; }
        .ta-tugun-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 13px; min-height: 24px; }
        .ta-tugun-h code { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; }
        .ta-tugun-b { flex: none; width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid ${T.accent}; background: ${T.paper}; color: ${T.accent}; font-size: 14px; font-weight: 800; line-height: 1; cursor: pointer; display: grid; place-items: center; padding: 0; }
        .ta-tugun-b.ok { background: ${T.ok}; border-color: ${T.ok}; color: #fff; animation: ta-tush 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        .ta-tugun-b:disabled { cursor: default; }
        .ta-tugun-y { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12px; line-height: 1.45; color: ${T.ink2}; }
        .ta-tel-y { justify-content: center; text-align: center; max-width: 172px; }
        .ta-tel-y code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; }
        .ta-pill { font-style: normal; font-size: 11.5px; font-weight: 800; padding: 3px 9px; border-radius: 99px; white-space: nowrap; }
        .ta-pill.saqlanadi { background: ${T.accent}; color: #fff; }
        .ta-pill.korsatiladi { background: ${T.accentSoft}; color: ${T.accent}; }
        .ta-pill.yoq, .ta-pill.kul { background: ${fon(T.ink2, 0.12)}; color: ${T.ink2}; }
        .ta-jd { display: flex; flex-direction: column; gap: 3px; font-family: 'JetBrains Mono', monospace; font-size: 12px; min-width: 0; }
        .ta-jd-h { font-size: 11px; }
        .ta-jd-h, .ta-jd-q { display: grid; grid-template-columns: var(--ust, repeat(var(--n), minmax(0,1fr))); gap: 6px; align-items: center; padding: 4px 6px; border-radius: 6px; }
        .ta-jd-h { color: ${T.ink2}; border-bottom: 1px solid ${T.line}; border-radius: 0; }
        .ta-jd-h i, .ta-jd-q i { font-style: normal; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ta-jd-q { color: ${T.ink}; }
        .ta-jd-q.yangi { animation: ta-yangi 1.2s ease both; }
        .ta-jd-bosh { display: block; height: 22px; }
        .ta-ega-mini { display: flex; flex-direction: column; gap: 6px; border: 1px solid ${T.line}; border-radius: 9px; overflow: hidden; background: ${T.paper}; }
        .ta-br-bar { display: flex; align-items: center; gap: 4px; padding: 5px 8px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; flex: none; }
        .ta-br-bar i { width: 7px; height: 7px; border-radius: 50%; background: ${T.line}; flex: none; }
        .ta-br-bar span { margin-left: 6px; overflow: hidden; text-overflow: ellipsis; }
        .ta-ega-q { display: flex; justify-content: space-between; gap: 6px; padding: 0 9px; font-size: 12px; }
        .ta-ega-kun { font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .ta-ega-ro { display: block; padding: 0 9px 8px; font-size: 12px; min-height: 30px; }
        .ta-ega-row { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 4px 6px; border-radius: 6px; }
        .ta-ega-row.yangi { animation: ta-yangi 1.2s ease both; }
        .ta-ega-yoq { display: block; font-size: 12px; color: ${T.ink2}; font-style: italic; }
        .ta-umami { display: flex; align-items: center; justify-content: space-between; padding: 6px 9px; border-radius: 8px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
        .ta-umami b { font-size: 16px; } .ta-umami b.osdi { color: ${T.accent}; animation: ta-son 0.5s cubic-bezier(.3,1.5,.5,1); }
        /* Kirish: xarita bo'laklari navbat bilan chiqadi (SABOQ 19, 60–120 ms) */
        .ta-backend, .ta-xr-grid > .ta-tugun, .ta-xr-fokus > *, .ta-s4-ong > *, .ta-sahna.s4 > .ta-ega { animation: fade-step 0.4s ease both; }
        .ta-xr-grid > .ta-tugun:nth-child(1), .ta-xr-fokus > :nth-child(1), .ta-s4-ong > :nth-child(1) { animation-delay: 0.09s; }
        .ta-xr-grid > .ta-tugun:nth-child(2), .ta-xr-fokus > :nth-child(2), .ta-s4-ong > :nth-child(2) { animation-delay: 0.18s; }
        .ta-xr-grid > .ta-tugun:nth-child(3), .ta-xr-fokus > :nth-child(3), .ta-s4-ong > :nth-child(3) { animation-delay: 0.27s; }
        .ta-xr-grid > .ta-tugun:nth-child(4), .ta-s4-ong > :nth-child(4) { animation-delay: 0.36s; }
        .ta-sahna.tugadi { grid-template-columns: minmax(0,1fr); }
        .ta-xr-fokus { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,1.1fr) minmax(0,0.9fr); gap: 12px; align-items: start; }
        .ta-xr-yon { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .ta-xr-yon .ta-tugun { padding: 8px 11px; gap: 6px; }
        code.ta-ix { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; overflow-wrap: anywhere; }
        @media (max-width: 760px) { .ta-xr-fokus { grid-template-columns: minmax(0,1fr); } }

        /* Bashorat → ixcham qator → natija bloki (SABOQ 11, 25) */
        .ta-bash .q-bashorat { border-color: ${T.accent}; animation: ta-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both; }
        .ta-bash .q-chip { animation: ta-kot 0.38s ease-out both; }
        .ta-bash .q-chip:nth-child(1) { animation-delay: 0.2s; } .ta-bash .q-chip:nth-child(2) { animation-delay: 0.3s; } .ta-bash .q-chip:nth-child(3) { animation-delay: 0.4s; }
        .ta-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; transform-origin: top center; animation: ta-yig 0.42s cubic-bezier(.2,.9,.3,1.1) both; }
        @keyframes ta-yig { from { opacity: 0; transform: scaleY(1.6); } }
        .ta-taxmin-y { font-weight: 800; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .ta-taxmin-s { font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .ta-taxmin b { font-size: 13.5px; color: ${T.ink}; }
        .ta-nb { display: flex; flex-direction: column; gap: 5px; }
        .ta-nb.oraliq { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: clamp(12px,2vw,16px); animation: q-kir 0.3s ease-out; }
        .ta-nb-t { font-size: 13px; font-weight: 700; color: ${T.ink2}; } .ta-nb-t.ok { color: ${T.ok}; } .ta-nb-t b { color: ${T.ink}; }
        .ta-nb-j { font-size: clamp(14px,1.6vw,15.5px); color: ${T.ink}; line-height: 1.5; } .ta-nb-j b { color: ${T.accent}; }
        .ta-nb-i { font-size: 13px; color: ${T.ink2}; line-height: 1.45; }
        .ta-nb-x { font-weight: 700; color: ${T.ink}; }

        /* 4-ekran: ega sahifasi (laptop) chapda, kunlar chizig'i = surgich o'ngda */
        .ta-sahna.s4 { grid-template-columns: minmax(250px, 310px) minmax(0,1fr); gap: 18px; }
        .ta-ega { width: 100%; height: 238px; border: 2px solid ${T.ink}; border-radius: 14px; overflow: hidden; background: ${T.paper}; display: flex; flex-direction: column; box-shadow: 0 14px 28px -14px rgba(${T.shadowBase},0.4); }
        .ta-ega .ta-br-bar { font-size: 11.5px; padding: 7px 10px; }
        .ta-ega-ichi { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; flex: 1; min-height: 0; }
        .ta-ega-bosh { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 15px; }
        .ta-begona { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px 3px 6px; border-radius: 99px; background: ${T.errFon}; color: ${T.err}; font-size: 11.5px; font-weight: 800; }
        .ta-ega-nav { display: flex; align-items: center; gap: 8px; }
        .ta-oldin { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-size: 17px; font-weight: 800; cursor: pointer; padding: 0; line-height: 1; flex: none; }
        .ta-oldin:hover:not(:disabled) { border-color: ${T.accent}; color: ${T.accent}; } .ta-oldin:disabled { opacity: 0.35; cursor: default; }
        .ta-ega-kunN { flex: 1; display: flex; flex-direction: column; align-items: center; animation: fade-step 0.25s ease both; }
        .ta-ega-kunN b { font-size: 14px; } .ta-ega-kunN small { font-size: 11.5px; color: ${T.ink2}; }
        .ta-ega-list { display: flex; flex-direction: column; gap: 6px; }
        .ta-ega .ta-ega-row { background: ${T.bg}; padding: 7px 9px; animation: fade-step 0.3s ease both; animation-delay: calc(var(--i) * 70ms); }
        .ta-ega .ta-ega-yoq { padding: 8px 2px; font-size: 13px; animation: fade-step 0.3s ease both; }
        .ta-s4-ong { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .ta-kc { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; }
        .ta-kc.navbat { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.12)}; }
        .ta-kc-yol { position: relative; height: 34px; margin-top: 14px; }
        .ta-kc-asos, .ta-kc-otdi, .ta-kc-ochdi { position: absolute; top: 14px; height: 6px; border-radius: 3px; }
        .ta-kc-asos { left: 0; right: 0; background: ${T.line}; }
        .ta-kc-otdi { right: 0; background: ${T.accent}; }
        .ta-kc-ochdi { left: 0; width: 50%; background: ${fon(T.ink2, 0.38)}; z-index: 1; transform-origin: right center; animation: ta-chiz 0.7s ease both; }
        @keyframes ta-chiz { from { transform: scaleX(0); } }
        .ta-kc-ochdi span { position: absolute; left: 50%; bottom: 10px; transform: translateX(-50%); font-size: 11.5px; font-weight: 800; color: ${T.ink2}; white-space: nowrap; }
        .ta-kc-30 { position: absolute; left: 50%; top: 6px; width: 2px; height: 22px; background: ${T.ink2}; z-index: 2; }
        .ta-kc-30 span { position: absolute; top: 24px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        input.ta-surgich { position: absolute; inset: 0; width: 100%; height: 34px; margin: 0; background: transparent; -webkit-appearance: none; appearance: none; cursor: pointer; z-index: 3; }
        input.ta-surgich:disabled { cursor: default; }
        input.ta-surgich:focus { outline: none; }
        input.ta-surgich::-webkit-slider-runnable-track { height: 34px; background: transparent; }
        input.ta-surgich::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; margin-top: 5px; border-radius: 50%; background: ${T.paper}; border: 3px solid ${T.accent}; box-shadow: 0 4px 10px -2px ${fon(T.accent, 0.5)}; }
        input.ta-surgich:disabled::-webkit-slider-thumb { border-color: ${T.ink2}; box-shadow: none; }
        input.ta-surgich::-moz-range-track { height: 34px; background: transparent; }
        input.ta-surgich::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: ${T.paper}; border: 3px solid ${T.accent}; }
        .ta-kc.navbat input.ta-surgich::-webkit-slider-thumb { animation: ta-puls 1.6s ease-out infinite; }
        .ta-kc-uch { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        p.ta-kc-izoh { margin: -4px 0 0; font-size: 12px; color: ${T.ink2}; line-height: 1.45; }
        .ta-kalit { display: flex; align-items: center; gap: 10px; text-align: left; padding: 10px 12px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 700; color: ${T.ink}; cursor: pointer; animation: ta-kot 0.45s ease both; }
        .ta-kalit i { flex: none; position: relative; width: 38px; height: 22px; border-radius: 99px; background: ${T.line}; transition: background 0.25s; }
        .ta-kalit i b { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.25); transition: transform 0.25s; }
        .ta-kalit.on { border-color: ${T.ok}; background: ${T.okFon}; cursor: default; } .ta-kalit.on i { background: ${T.ok}; } .ta-kalit.on i b { transform: translateX(16px); }
        .ta-bj { display: flex; flex-direction: column; gap: 4px; padding: 9px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ta-bj-h code { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; }
        .ta-bj .ta-jd-q { padding-block: 3px; transition: opacity 0.6s, background 0.6s; transition-delay: calc(var(--i) * 120ms); }
        .ta-jd-q.ochdi { opacity: 0.38; background: ${fon(T.ink2, 0.08)}; } .ta-jd-q.ochdi i { text-decoration: line-through; }
        @media (max-width: 760px) {
          .ta-sahna, .ta-sahna.s4 { grid-template-columns: minmax(0,1fr); justify-items: center; gap: 14px; }
          .ta-sahna > .ta-xarita, .ta-sahna > .ta-s4-ong { width: 100%; }
          .ta-ulagich { display: none; }
          .ta-ega { max-width: 360px; }
        }
        @media (max-width: 560px) { .ta-xr-grid { grid-template-columns: minmax(0,1fr); } }

        /* 5-ekran: savol kartasi (tepada ixcham chiziq) · dalil · AUDIT.md */
        .ta-au-chap { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .ta-strip { display: flex; gap: 6px; flex-wrap: wrap; }
        .ta-ns { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font-size: 12.5px; font-weight: 800; background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink2}; transition: border-color 0.25s, box-shadow 0.25s; }
        .ta-ns.joriy { border-color: ${T.accent}; color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.15)}; }
        .ta-ns.ok { background: ${T.ok}; border-color: ${T.ok}; color: #fff; animation: ta-tush 0.35s ease both; }
        .ta-ns.err { background: ${T.errFon}; border-color: ${T.err}; color: ${T.err}; animation: ta-tush 0.35s ease both; }
        .ta-au-karta { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.ink2}; animation: ta-karta 0.42s cubic-bezier(.2,.9,.3,1.1) both; }
        .ta-au-k-n { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ta-au-k-n .ta-pill { font-family: 'Manrope', sans-serif; }
        .ta-au-k-s { font-size: clamp(15px,1.8vw,17px); line-height: 1.4; color: ${T.ink}; }
        .ta-dalil { position: relative; display: flex; gap: 12px; align-items: center; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px dashed ${fon(T.ink2, 0.4)}; transition: border-color 0.3s; }
        .ta-dalil.belgi { border-style: solid; }
        .ta-dalil-t { display: flex; flex-direction: column; gap: 2px; font-size: 13px; line-height: 1.5; color: ${T.ink}; min-width: 0; }
        .ta-dalil-t small { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .ta-stamp { position: absolute; right: -10px; top: -12px; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-size: 18px; font-weight: 900; color: #fff; animation: ta-stamp 0.45s cubic-bezier(.3,1.6,.5,1) both; }
        .ta-stamp.ok { background: ${T.ok}; } .ta-stamp.err { background: ${T.err}; }
        @keyframes ta-stamp { from { opacity: 0; transform: scale(2.2) rotate(-20deg); } }
        .ta-au-tanlov { display: flex; gap: 10px; flex-wrap: wrap; }
        .ta-au-chip { min-width: 132px; text-align: center; }
        .ta-dv { flex: none; width: 54px; height: 54px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; display: flex; flex-direction: column; justify-content: center; gap: 5px; padding: 7px; }
        .ta-dv i, .ta-dv b { display: block; }
        .ta-dv.forma i { height: 10px; border-radius: 3px; border: 1.5px solid ${T.ink2}; }
        .ta-dv.qulf { align-items: center; gap: 0; } .ta-dv.qulf b { width: 14px; height: 11px; border: 3px solid ${T.ink2}; border-bottom: none; border-radius: 8px 8px 0 0; } .ta-dv.qulf i { width: 24px; height: 17px; border-radius: 4px; background: ${T.ink2}; }
        .ta-dv.hodisa i { height: 7px; border-radius: 3px; background: ${fon(T.ink2, 0.3)}; } .ta-dv.hodisa i:first-child { background: ${fon(T.accent, 0.55)}; width: 70%; }
        .ta-dv.zaiflik { gap: 4px; } .ta-dv.zaiflik i { font-style: normal; font-size: 11px; font-weight: 900; color: ${T.ok}; line-height: 1; display: flex; align-items: center; gap: 4px; } .ta-dv.zaiflik i::after { content: ''; flex: 1; height: 5px; border-radius: 3px; background: ${fon(T.ink2, 0.25)}; }
        .ta-dv.chiziq { position: relative; flex-direction: row; align-items: center; justify-content: space-between; } .ta-dv.chiziq i { position: absolute; left: 4px; right: 4px; top: 50%; height: 2px; margin-top: -1px; background: ${T.ink2}; } .ta-dv.chiziq b { position: relative; width: 7px; height: 7px; border-radius: 50%; background: ${T.err}; }
        .ta-dv.gap i { height: 5px; border-radius: 3px; background: ${fon(T.ink2, 0.3)}; } .ta-dv.gap b { align-self: flex-start; font-size: 11px; font-weight: 900; color: ${T.ink2}; border: 1.5px dashed ${T.ink2}; border-radius: 4px; padding: 0 6px; line-height: 14px; }
        .ta-audit { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; min-width: 0; }
        .ta-audit-h { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 13px; padding-bottom: 8px; border-bottom: 1px solid ${T.line}; }
        .ta-au-jd { display: flex; flex-direction: column; }
        .ta-au-q { display: grid; grid-template-columns: 32px minmax(0,1fr) 128px; gap: 10px; align-items: center; padding: 7px 4px; border-bottom: 1px solid ${T.line}; font-size: 13px; line-height: 1.4; color: ${T.ink}; transition: opacity 0.3s, background 0.3s; animation: fade-step 0.35s ease both; animation-delay: calc(var(--i, 0) * 70ms); }
        .ta-audit.dalilli .ta-au-q { grid-template-columns: 16px minmax(0,1fr) minmax(0,1.15fr) 100px; gap: 8px; font-size: 12.5px; }
        .ta-au-q.bosh { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; animation: none; }
        .ta-au-q:last-child { border-bottom: none; }
        .ta-au-q.fokus { background: ${fon(T.accent, 0.06)}; border-radius: 8px; }
        .ta-au-q.yig { color: ${T.ink2}; font-size: 12.5px; animation: ta-yig 0.45s cubic-bezier(.2,.9,.3,1.1) both; }
        .ta-au-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink2}; }
        .ta-au-s { min-width: 0; overflow-wrap: anywhere; }
        .ta-au-d { color: ${T.ink2}; overflow-wrap: anywhere; }
        .ta-au-h { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; }
        .ta-bosh-h { display: block; width: 92px; height: 22px; border: 1.5px dashed ${fon(T.ink2, 0.45)}; border-radius: 6px; }
        .ta-audit.dalilli .ta-bosh-h { width: 80px; }
        .ta-holat { font-style: normal; font-size: 12px; font-weight: 800; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
        .ta-holat.ok { background: ${T.okFon}; color: ${T.ok}; } .ta-holat.err { background: ${T.errFon}; color: ${T.err}; } .ta-holat.tz { box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        .ta-holat.yangi { animation: ta-tush 0.45s cubic-bezier(.3,1.5,.5,1) both; }
        .ta-amal { font-size: 11px; font-weight: 800; color: ${T.accent}; animation: fade-step 0.4s ease both; }
        .ta-siz { display: block; width: fit-content; margin-top: 3px; font-style: normal; text-transform: none; letter-spacing: 0; color: ${T.accent}; background: ${T.accentSoft}; padding: 1px 6px; border-radius: 5px; font-size: 11px; }
        .ta-audit-siy { display: flex; flex-direction: column; gap: 5px; padding: 10px 12px; border-radius: 10px; background: ${T.accentSoft}; }
        .ta-siy-atama { font-size: 13.5px; line-height: 1.5; color: ${T.ink}; } .ta-siy-atama b { color: ${T.accent}; }
        .ta-siy-izoh { font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }

        /* Amaliyot bloklari: qadam matni, Yordam, 5-qadam formasi (bir vaqtda bitta element — SABOQ 29) */
        .ta-satr { display: block; } .ta-satr:first-child { display: inline; } .ta-satr + .ta-satr { margin-top: 5px; }
        .ta-blok .q-blok-t .qcode { white-space: normal; overflow-wrap: anywhere; }
        .q-blok-xato .ta-yordam-btn { padding: 6px 13px; font-size: 13px; }
        .ta-yordam { display: block; margin-top: 8px; padding: 9px 12px; border-radius: 10px; background: ${T.accentSoft}; color: ${T.ink}; font-size: 13px; line-height: 1.5; }
        .ta-yordam-s { display: block; }
        .q-blok-q.joriy:has(.ta-goya[data-tola="0"]) > .q-blok-tana > .q-btn { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
        .ta-goya { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
        .ta-goya-strip { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .ta-goya-n { min-width: 30px; height: 30px; padding: 0 9px; border-radius: 99px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 800; color: ${T.ink2}; cursor: pointer; }
        .ta-goya-n.soz { font-size: 12px; font-weight: 700; }
        .ta-goya-n.ok { background: ${T.okFon}; border-color: ${T.ok}; color: ${T.ok}; } .ta-goya-n.err { background: ${T.errFon}; border-color: ${T.err}; color: ${T.err}; }
        .ta-goya-n.joriy { border-color: ${T.accent}; color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.15)}; }
        .ta-goya-son { margin-left: auto; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ta-goya-karta { display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; animation: ta-karta 0.38s cubic-bezier(.2,.9,.3,1.1) both; }
        .ta-goya-s { font-size: 14.5px; font-weight: 700; line-height: 1.45; color: ${T.ink}; }
        .ta-goya-ch { display: flex; gap: 8px; flex-wrap: wrap; }
        .ta-goya-chip { position: relative; padding: 8px 14px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 700; color: ${T.ink}; cursor: pointer; }
        .ta-goya-chip:hover { border-color: ${T.accent}; }
        .ta-goya-chip.ok { background: ${T.okFon}; border-color: ${T.ok}; color: ${T.ok}; } .ta-goya-chip.err { background: ${T.errFon}; border-color: ${T.err}; color: ${T.err}; }
        .ta-goya-l { display: flex; flex-direction: column; gap: 6px; font-size: 13.5px; }
        .ta-goya-l b { color: ${T.accent}; }
        .ta-goya-l textarea { width: 100%; resize: vertical; min-height: 56px; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 10px; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.45; color: ${T.ink}; background: ${T.bg}; }
        .ta-goya-l textarea:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .ta-goya-keyin { align-self: flex-end; }
        .ta-goya-xato { font-size: 12.5px; font-weight: 700; color: ${T.err}; }
        .ta-goya-mas { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .ta-gp { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 11px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .ta-gp-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; color: ${T.ink2}; margin-bottom: 3px; }
        .ta-gp-nusxa { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; padding: 5px 11px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; letter-spacing: 0; }
        .ta-gp-nusxa:disabled { opacity: 0.45; cursor: not-allowed; }
        .ta-gp-s { display: block; font-size: 13px; line-height: 1.55; color: ${T.ink}; }
        .ta-gp-joy { background: ${T.accentSoft}; color: ${T.accent}; border-radius: 6px; padding: 1px 6px; font-weight: 700; }
        .ta-gp-joy.tola { background: ${T.okFon}; color: ${T.ok}; animation: ta-tush 0.35s ease both; }
        .ta-natija { display: flex; flex-direction: column; gap: 10px; }
        .ta-neon { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${CODE.bg}; color: ${CODE.text}; }
        .ta-neon-h { font-size: 11.5px; font-weight: 700; color: ${CODE.punct}; letter-spacing: 0.04em; }
        code.ta-neon-q { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${CODE.attr}; overflow-wrap: anywhere; }
        .ta-neon-j { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${CODE.punct}; }
        .ta-neon.javob .ta-neon-j { color: ${CODE.str}; animation: fade-step 0.35s ease both; }
        p.ta-natija-izoh { margin: 0; font-size: 12px; color: ${T.ink2}; line-height: 1.45; }
        .ta-a2 { display: grid; grid-template-columns: 172px minmax(0,1fr); gap: 12px; align-items: start; }
        .ta-a2-chap { display: flex; flex-direction: column; gap: 8px; }
        p.ta-gap-yangi { margin: 0; font-size: 12px; line-height: 1.5; color: ${T.ink}; padding: 9px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; }
        p.ta-gap-yangi mark { background: ${T.okFon}; color: ${T.ok}; font-weight: 700; border-radius: 4px; padding: 0 2px; }
        .ta-a2-siy { min-width: 0; animation: ta-ochil 0.5s cubic-bezier(.2,.9,.3,1.1) both; }
        .ta-a2-siy.bosh { animation: none; }
        .ta-siy { border: 2px solid ${T.ink}; border-radius: 14px; overflow: hidden; background: ${T.paper}; }
        .ta-siy-ichi { padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }
        .ta-siy-n { font-size: 14px; color: ${T.ink}; }
        .ta-siy-b { display: flex; flex-direction: column; gap: 2px; font-size: 12px; line-height: 1.5; color: ${T.ink}; animation: fade-step 0.35s ease both; }
        .ta-siy-b b { font-size: 12.5px; color: ${T.accent}; }
        @media (max-width: 560px) { .ta-a2 { grid-template-columns: minmax(0,1fr); justify-items: center; } .ta-a2-siy, .ta-a2-chap { width: 100%; align-items: center; } }

        /* Kartochkalar (SABOQ 16) va yakun */
        .ta-flash { display: flex; flex-direction: column; }
        .ta-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: ta-puls 1.6s ease-out 3; }
        p.ta-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .ta-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: ta-nuqta 1.4s ease-in-out 3; }
        @keyframes ta-nuqta { 50% { transform: scale(1.5); opacity: 0.5; } }
        p.ta-fikr { margin: 4px auto 0; max-width: 640px; text-align: center; color: ${T.ink2}; line-height: 1.5; }
        .ta-hw-meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 4px 0 10px; }
        .ta-hw-meta span { display: flex; flex-direction: column; padding: 6px 12px; border: 1px solid ${T.line}; border-radius: 10px; background: ${T.bg}; font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .ta-hw-meta small { font-size: 11px; font-weight: 600; color: ${T.ink2}; }
        ol.ta-hw-q { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .ta-hw-q li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .ta-hw-q li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 700; background: ${T.accentSoft}; color: ${T.accent}; }
        .ta-hw-varaq { display: flex; flex-direction: column; gap: 6px; margin: 0 0 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; }
        .ta-hw-vl { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .ta-hw-vq { display: flex; flex-direction: column; gap: 4px; }
        .ta-hw-v { display: flex; align-items: baseline; gap: 8px; font-size: 13px; color: ${T.ink2}; }
        .ta-hw-v b { width: 16px; flex: none; font-family: 'JetBrains Mono', monospace; }
        .ta-hw-v em { margin-left: auto; padding-left: 8px; font-style: normal; font-size: 12px; font-weight: 700; white-space: nowrap; }
        .ta-hw-v.acc { color: ${T.ink}; } .ta-hw-v.acc em { color: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) {
          .ta-backend, .ta-xr-grid > .ta-tugun, .ta-xr-fokus > *, .ta-s4-ong > *, .ta-sahna.s4 > .ta-ega, .ta-konvert, .ta-tel-sahifa, .ta-tel-toast, .ta-seg, .ta-slot, .ta-seg sup, .ta-slot sup, .ta-s0-tag, .ta-reja-yangi, .ta-siy-q, .ta-jd-q, .ta-ega-row, .ta-ega-yoq, .ta-ega-kunN, .ta-tugun-b, .ta-umami b, .ta-katak em, .ta-kc-ochdi, .ta-kalit, .ta-au-karta, .ta-ns, .ta-stamp, .ta-au-q, .ta-holat, .ta-amal, .ta-goya-karta, .ta-gp-joy, .ta-a2-siy, .ta-siy-b, .ta-bash .q-bashorat, .ta-bash .q-chip, .ta-taxmin, .ta-nb, .ta-flash .fc-front, .ta-fc-ipucha i, .ta-fayl, .ta-havola, .ta-gap-ch i { animation: none !important; transition: none !important; }
          input.ta-surgich::-webkit-slider-thumb { animation: none !important; }
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
        /* Telefonda (≤640) o'ngda joy yo'q — ⛶ mazmun ustida alohida qatorda turadi, matn va kartani yopmaydi (10-Modul pilot, F-1005-171) */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
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
