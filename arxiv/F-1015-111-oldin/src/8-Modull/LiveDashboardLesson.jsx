import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 10-Modul (kod: src/8-Modull) · 3-dars «Loyiha kuni: jonli dashboard» (kalit m8-03) — skeletdan (src/skelet/NamunaDars.jsx), MD v3:
//   feedback/F-1005-10modul/03-LiveDashboard-v3.md. 8 ekran + 3 amaliyot bloki + kartochkalar = 12 (SABOQ 12).
// Oqim: kirish → reja → tushuncha (sanoq) → A1 → 1-savol → tushuncha (yangilanish) → A2 → 2-savol → A3 → podium → kartochkalar → yakun.
// Bitta vizual — «Maydon» dashboard maketi (DASH_NAMUNA → DashMaket); yon elementlar (Telefon · HodisaJadval · BackendQuti) — bitta manbadan.
// Joylashuv (SABOQ 21–23): o'yinchi telefoni = sayt, doim CHAPDA, o'lchami barqaror 172×272; jadval, Backend va dashboard — O'NGDA.
// Harakat (SABOQ 19): konvert telefondan Backend'ga uchadi, taymer 5 → 0, raqam o'zgarsa bir lahza yashil; reduced-motion da yakuniy holat darhol.
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================

// D3: palitra umumiy qolipdan — neytral 5 · modul rangi 2 · holat 2 (shadowBase — soya, rang tokeni emas)
const T = { ...qolipRang('tex'), shadowBase: '58, 53, 48' };
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm8-03-v1', lessonTitle: { uz: 'Loyiha kuni: jonli dashboard', ru: 'День проекта: живой дашборд' } };
// 12 ekran (MD v3 · KOD 1): hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards · summary
const HW_TOKENS = [
  { t: 'dashboard', l: 8, tp: 22, s: 13, d: 6 },
  { t: 'GET /hodisalar/sanoq', l: 62, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'brauzer ID', ru: 'ID браузера' }, l: 20, tp: 70, s: 12, d: 8.5 },
  { t: 'token', l: 74, tp: 68, s: 13, d: 6.8 }
];
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
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's7',  type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD v3: 1-savol (s3) — B, 2-savol (s5) — D; `practice: -1` — amaliyot bloklari (variant yo'q).
const INLINE_KEYS = { s3: 1, s5: 3, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI: 4 — 1-savol, 7 — 2-savol). S-026: emoji o'rniga koddan bitta qator.
const RcKod = ({ t }) => <code className="ld-rc-kod">{tr(t)}</code>;
const RECAPS = {
  4: {
    title: { uz: 'Har qadamda — turli brauzerlar soni', ru: 'На каждом шаге — число разных браузеров' },
    cards: [
      { ic: <RcKod t="vaqt-tanladi · 3f2c… ×3" />, h: { uz: 'Uch qator', ru: 'Три строки' }, body: { uz: 'Bitta brauzer uch marta bosdi.', ru: 'Один браузер нажал три раза.' } },
      { ic: <RcKod t="brauzer_id" />, h: { uz: 'Brauzer ID', ru: 'ID браузера' }, body: { uz: 'Bitta brauzerni ajratadi, odamning ismini bildirmaydi.', ru: "Отмечает один браузер, имени человека не раскрывает." } },
      { ic: <RcKod t={{ uz: 'vaqtni tanladi 1', ru: 'выбрал время 1' }} />, h: { uz: 'Dashboard', ru: 'Дашборд' }, body: { uz: "Uch bosish ham bitta brauzer bo'lib sanaladi.", ru: "Все три нажатия считаются за один браузер." }, ask: { uz: 'Nega dashboard bosishlarni emas, brauzerlarni sanaydi?', ru: 'Почему дашборд считает браузеры, а не нажатия?' } }
    ]
  },
  7: {
    title: { uz: "Raqamlarni sayt o'zi so'raydi", ru: 'Числа сайт запрашивает сам' },
    cards: [
      { ic: <RcKod t="setInterval(sora, 5000)" />, h: { uz: 'Taymer', ru: 'Таймер' }, body: { uz: "Sayt har 5 soniyada so'rov yuboradi.", ru: 'Сайт отправляет запрос каждые 5 секунд.' } },
      { ic: <RcKod t="GET /hodisalar/sanoq?kun=" />, h: { uz: "So'rov", ru: 'Запрос' }, body: { uz: 'Token bilan ketadi, raqamlar qaytadi.', ru: 'Уходит с токеном, возвращаются числа.' } },
      { ic: <RcKod t="401" />, h: { uz: 'Token eskirdi', ru: 'Токен устарел' }, body: { uz: "So'rov to'xtaydi, parol formasi qaytadi.", ru: 'Запросы останавливаются, возвращается форма пароля.' }, ask: { uz: "Raqamlar o'zi yangilanmasa, agentga qaysi qatorni yozasiz?", ru: 'Если числа не обновляются сами, какую строку вы напишете агенту?' } }
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

// ===== BITTA VIZUAL — «Maydon» dashboard maketi (163/180): DASH_NAMUNA → DashMaket; yon elementlar Telefon · HodisaJadval · BackendQuti — bitta manbadan =====
// qolip-maket: ld-katak
const cxx = (...a) => a.filter(Boolean).join(' ');
const useKamHarakat = () => typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
// Taymerlar ekrandan chiqilganda tozalanadi
const useTaymer = () => {
  const ref = useRef([]);
  useEffect(() => () => { ref.current.forEach(clearTimeout); ref.current = []; }, []);
  return useCallback((fn, ms) => { ref.current.push(setTimeout(fn, ms)); }, []);
};
// Mentor misoli (tayanch 1, aynan): oxirgi 5 daqiqada 3 · bugun: ochdi 14 · vaqtni tanladi 9 · band qildi 3 (har qadamda turli brauzerlar soni)
const DASH_NAMUNA = { kun: '2026-10-05', hozir: 3, ochdi: 14, tanladi: 9, band: 3, yangilandi: '18:45:05' };
// 4-ekran va A2: shu holatga bitta yangi o'yinchi qo'shildi (hisob, yangi raqam emas — MD A-5)
const BIR_YANGI = { ...DASH_NAMUNA, hozir: 4, ochdi: 15, tanladi: 10 };
const SOATLAR = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const MANZIL = { net: 'maydon-….netlify.app/dashboard', lok: 'localhost:5173/dashboard' };
const UCH_QADAM = [
  { k: 'ochdi', t: { uz: 'ochdi', ru: 'открыл' } },
  { k: 'tanladi', t: { uz: 'vaqtni tanladi', ru: 'выбрал время' } },
  { k: 'band', t: { uz: 'band qildi', ru: 'заброни\u00ADровал' } }
];
const SORASH_S = 5; // sayt har 5 soniyada so'raydi (MVP tanlovi)

// Halqa-taymer (4-ekran, A2, A3): 5 → 0, 0 da so'rov ketadi
const Taymer = ({ qoldi }) => {
  const C = 2 * Math.PI * 10;
  return (
    <span className="ld-taymer">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <circle cx="13" cy="13" r="10" className="ld-t-iz" />
        <circle cx="13" cy="13" r="10" className={cxx('ld-t-yoy', qoldi === SORASH_S && 'qayt')} strokeDasharray={C} strokeDashoffset={C * (1 - qoldi / SORASH_S)} transform="rotate(-90 13 13)" />
      </svg>
      <b>{qoldi}</b>
    </span>
  );
};
// Har 5 soniyada onNol (so'rov) — taymer qiymati o'zi; ekrandan chiqilsa to'xtaydi
const useSorov = (yoq, onNol) => {
  const [qoldi, setQoldi] = useState(SORASH_S);
  const cb = useRef(onNol); cb.current = onNol;
  useEffect(() => {
    if (!yoq) return undefined;
    let q = SORASH_S; let qayt = 0;
    setQoldi(q);
    const t = setInterval(() => {
      q -= 1;
      if (q <= 0) { q = SORASH_S; setQoldi(0); if (cb.current) cb.current(); qayt = setTimeout(() => setQoldi(SORASH_S), 380); return; }
      setQoldi(q);
    }, 1000);
    return () => { clearInterval(t); clearTimeout(qayt); };
  }, [yoq]);
  return qoldi;
};
// Kirishda raqamlar 0 dan sanab o'sadi (SABOQ 19); reduced-motion da darhol
const useSanoqlar = (maqsad, faol) => {
  const kam = useKamHarakat();
  const [k, setK] = useState(faol && !kam ? 0 : 1);
  useEffect(() => {
    if (!faol || kam) return undefined;
    let raf = 0; let t0 = 0;
    const qadam = (t) => { if (!t0) t0 = t; const p = Math.min(1, (t - t0) / 800); setK(p); if (p < 1) raf = requestAnimationFrame(qadam); };
    const kech = setTimeout(() => { raf = requestAnimationFrame(qadam); }, 420);
    return () => { clearTimeout(kech); cancelAnimationFrame(raf); };
  }, [faol, kam]);
  const e = 1 - Math.pow(1 - k, 3);
  return Object.fromEntries(Object.entries(maqsad).map(([n, v]) => [n, typeof v === 'number' ? Math.round(v * e) : v]));
};

// Parol formasi (qulf holati): bosh → yozildi; keyin raqamlar ochiladi
const QulfForma = ({ yozildi }) => (
  <div className="ld-qulf-forma">
    <span className="ld-qulf-belgi"><i className="ld-qulf" aria-hidden="true" /></span>
    <span className="ld-qulf-n">{tr({ uz: 'Parol', ru: 'Пароль' })}</span>
    <span className={cxx('ld-parol', yozildi && 'tola')}>{yozildi ? '••••••••' : ''}</span>
    <span className={cxx('ld-kirish-t', yozildi && 'bos')}>{tr({ uz: 'Kirish', ru: 'Войти' })}</span>
  </div>
);
// «Maydon» dashboard maketi — dars bo'yi bitta vizual. son: raqamlar · yangi: shu lahzada o'zgargan raqamlar (bir lahza yashil) · izoh: 2-ekrandan keyin ·
// yangilandi: 1-ekran va A3 · taymer: 4-ekran, A2, A3 · qulf: parol formasi ('bosh' | 'yozildi') · kirish: elementlar navbat bilan chiqadi · lenta: 0-ekran
const DashMaket = ({ manzil = 'net', son = DASH_NAMUNA, yangi = [], izoh, yangilandi, taymer, soat, qulf, kirish, lenta, className, children }) => (
  <div className={cxx('ld-dash', kirish && 'ld-kirish', className)}>
    <div className="ld-bar" style={{ '--i': 0 }}><i /><i /><i /><span className="ld-manzil">{MANZIL[manzil]}</span>{taymer != null && <Taymer qoldi={taymer} />}</div>
    <div className="ld-sahifa">
      <div className="ld-dash-bosh" style={{ '--i': 1 }}><b>Maydon · dashboard</b>{soat && <span className="ld-soat">{soat}</span>}</div>
      {qulf ? <QulfForma yozildi={qulf === 'yozildi'} /> : <>
        <div className={cxx('ld-hozir', yangi.includes('hozir') && 'yangi')} style={{ '--i': 2 }}>
          <span className="ld-hozir-n"><i aria-hidden="true" />{tr({ uz: 'Oxirgi 5 daqiqada', ru: 'За последние 5 минут' })}</span>
          <b key={yangi.includes('hozir') ? 'y' + son.hozir : 'n'} className="ld-hozir-son">{son.hozir}</b>
          {yangi.includes('hozir') && <span className="ld-plus1" key={'p' + son.hozir}>+1</span>}
        </div>
        <div className="ld-bugun">
          <span className="ld-bugun-n" style={{ '--i': 3 }}>{tr({ uz: 'Bugun', ru: 'Сегодня' })}</span>
          <div className="ld-qadamlar">
            {UCH_QADAM.map((q, i) => (
              <React.Fragment key={q.k}>
                <div className={cxx('ld-qadam', yangi.includes(q.k) && 'yangi')} data-q={q.k} style={{ '--i': 4 + i }}>
                  <span>{tr(q.t)}</span>
                  <b key={yangi.includes(q.k) ? 'y' + son[q.k] : 'n'}>{son[q.k]}</b>
                  {yangi.includes(q.k) && <span className="ld-plus1" key={'p' + son[q.k]}>+1</span>}
                </div>
                {i < 2 && <i className="ld-strelka" aria-hidden="true" />}
              </React.Fragment>
            ))}
          </div>
          {izoh && <span className="ld-dash-izoh">{tr({ uz: 'har qadamda — turli brauzerlar soni', ru: 'на каждом шаге — число разных браузеров' })}</span>}
        </div>
        {lenta}
        {yangilandi && <span className="ld-yangilandi" style={{ '--i': 7 }} key={yangilandi}><i aria-hidden="true" />{tr({ uz: 'Yangilandi', ru: 'Обновлено' })}: {yangilandi}</span>}
      </>}
      {children}
    </div>
  </div>
);

// O'yinchi telefoni = «Maydon» sayti (SABOQ 22–23): o'lchami barqaror 172×272; ustida yorliq, ostida o'z tugmasi (children).
// ochiq=false — bosh ekran (ilova belgisi) · tanlangan — tanlangan katak · navbat — keyingi bosiladigan katak (halqa) · faqat — bosiladigan yagona katak · bos/bosN — kichrayib qaytish
const Telefon = ({ yorliq, manzil, ochiq = true, tanlangan, navbat, faqat, onKatak, bos, bosN, className, children }) => (
  <div className={cxx('ld-tel-ust', className)}>
    {yorliq && <span className="ld-tel-yorliq">{yorliq}</span>}
    <div className="ld-telefon">
      <div className="ld-tel-manzil">{manzil ? <span>{manzil}</span> : <i />}</div>
      {ochiq ? (
        <div className="ld-tel-sahifa" key="sahifa">
          <b className="ld-tel-sar">Maydon</b>
          <span className="ld-tel-kun"><i aria-hidden="true">‹</i>{tr({ uz: 'Bugun', ru: 'Сегодня' })}<i aria-hidden="true">›</i></span>
          <div className="ld-kataklar">
            {SOATLAR.map(s => (
              <button key={s + (bos === s ? '-' + bosN : '')} type="button" data-s={s}
                className={cxx('ld-katak', tanlangan === s && 'on', navbat === s && 'ld-navbat', bos === s && 'bos')}
                disabled={!onKatak || (faqat && s !== faqat)} onClick={() => onKatak && onKatak(s)}>{s}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="ld-tel-uy" key="uy"><span className="ld-ilova"><i aria-hidden="true" />Maydon</span></div>
      )}
    </div>
    {children}
  </div>
);
// `hodisalar` jadvali kartasi (nom · brauzer_id · yaratilgan): yangi qator sirg'alib kirib ~1 s yashil yonadi; bir xil brauzer ID — accent
const HodisaJadval = ({ qatorlar, yangiK }) => (
  <div className="ld-jadval">
    <span className="ld-jadval-n"><code>hodisalar</code></span>
    <table className="ld-jt">
      <thead><tr><th>nom</th><th>brauzer_id</th><th>yaratilgan</th></tr></thead>
      <tbody>{qatorlar.map(q => <tr key={q.k} data-k={q.k} className={yangiK === q.k ? 'kir' : undefined}><td>{q.nom}</td><td className="br">{q.id}</td><td>{q.vaqt}</td></tr>)}</tbody>
    </table>
    <i className="ld-jadval-oxir" aria-hidden="true" />
  </div>
);
// Backend qutisi: ikki yo'l; POST kelsa «+1 qator», GET token bilan kelsa qulf yashil
const BackendQuti = ({ qator, tok }) => (
  <div className={cxx('ld-be', tok && 'tok')}>
    <span className="ld-be-n">Backend</span>
    <code className="ld-be-y">POST /hodisalar</code>
    <code className="ld-be-y">GET /hodisalar/sanoq <i className={cxx('ld-qulf', tok && 'yashil')} aria-hidden="true" /></code>
    {qator > 0 && <span key={qator} className="ld-be-plus">{tr({ uz: '+1 qator', ru: '+1 строка' })}</span>}
  </div>
);

// Uchish (SABOQ 19): konvert yoki nuqta manbadan nishonga uchadi. Joylar DOM dan o'lchanadi (⛶ kattalashganda ham to'g'ri); reduced-motion da uchmaydi.
const UCH_MS = 850;
const useUchish = () => {
  const box = useRef(null);
  const kam = useKamHarakat();
  const taymer = useTaymer();
  const [uchlar, setUchlar] = useState([]);
  const uchir = useCallback((manba, nishon, t, tur, ms = UCH_MS) => {
    const b = box.current; if (kam || !b) return;
    const s = b.querySelector(manba), n = b.querySelector(nishon); if (!s || !n) return;
    const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
    const m = (el) => { const r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - br.left) / z, y: (r.top + r.height / 2 - br.top) / z }; };
    const u = { k: String(Math.random()).slice(2), t, tur, a: m(s), b: m(n), ms };
    setUchlar(x => [...x, u]);
    taymer(() => setUchlar(x => x.filter(y => y.k !== u.k)), ms + 60);
  }, [kam, taymer]);
  return { box, uchlar, uchir, kam };
};
const Konvert = ({ u }) => (
  <span className={cxx('ld-konvert', u.tur, !u.t && 'nuqta')} aria-hidden="true"
    style={{ left: u.a.x + 'px', top: u.a.y + 'px', '--dx': (u.b.x - u.a.x) + 'px', '--dy': (u.b.y - u.a.y) + 'px', animationDuration: u.ms + 'ms' }}>
    {u.t && <i className={u.tur === 'tok' ? 'ld-qulf yashil' : 'ld-xat'} />}{u.t}
  </span>
);

// Bashorat (181; SABOQ 11/19): karta yengil ko'tarilib kiradi, variantlar navbat bilan; tanlangach ixcham qatorga yig'iladi va natijagacha turadi
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="ld-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <div className="ld-taxmin"><span className="ld-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="ld-taxmin-s">{savol}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
const Joriy = ({ children }) => <p className="ld-joriy fade-step">{children}</p>;
// Natija bloki (SABOQ 25): bitta yashil blok — birinchi qator taxmin, so'ng joriy qator va xulosa
const NatijaBlok = ({ tanlov, togri, variantlar, haqiqat, izoh, xulosa }) => {
  const tx = variantlar.find(v => v.k === tanlov);
  const ok = tanlov === togri;
  return (
    <div className="q-xulosa ld-nb">
      {tx && <span className={cxx('ld-nb-t', ok && 'ok')}>{ok
        ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })}</>
        : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(haqiqat)}</b></>}</span>}
      {izoh && <span className="ld-nb-i">{izoh}</span>}
      <span>{xulosa}</span>
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish): «Oxirgi 5 daqiqada: 3» nimani sanaydi? Javobdan keyin «Oxirgi hodisalar» lentasi ochiladi =====
const LENTA = [
  { id: '3f2c…', vaqt: '18:44', nom: 'band-qildi', ichida: true },
  { id: 'a91e…', vaqt: '18:43', nom: 'vaqt-tanladi', ichida: true },
  { id: 'c07b…', vaqt: '18:41', nom: 'ochdi', ichida: true },
  { id: 'e58d…', vaqt: '18:36', nom: 'ochdi', ichida: false }
];
const Lenta = ({ ochiq }) => (
  <div className={cxx('ld-lenta', ochiq ? 'ochiq' : 'yopiq')}>
    <span className="ld-lenta-n">{tr({ uz: 'Oxirgi hodisalar', ru: 'Последние события' })}</span>
    {ochiq && LENTA.map((q, i) => (
      <div key={q.id} className={cxx('ld-lenta-q', q.ichida ? 'ichida' : 'tashqari')} style={{ '--d': (0.12 + i * 0.12) + 's' }}>
        <code>{q.id}</code><span>{q.vaqt}</span><code>{q.nom}</code>
        {!q.ichida && <em>{tr({ uz: '5 daqiqadan oldin — sanalmaydi', ru: "больше 5 минут назад — не считается" })}</em>}
      </div>
    ))}
  </div>
);
// «Oxirgi 5 daqiqada: 3» dan uchta yashil qatorga ingichka chiziq: qatorlar kirib bo'lgach o'lchanadi, ⛶ va o'lcham o'zgarsa qayta chiziladi
const useChiziq = (boxRef, faol, kam) => {
  const [yol, setYol] = useState(null);
  useEffect(() => {
    if (!faol) { setYol(null); return undefined; }
    const ol = () => {
      const b = boxRef.current; if (!b) return;
      const n = b.querySelector('.ld-hozir-son'), sah = b.querySelector('.ld-sahifa');
      const qs = [...b.querySelectorAll('.ld-lenta-q.ichida')];
      if (!n || !sah || !qs.length) return;
      const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
      const m = (el) => { const r = el.getBoundingClientRect(); return { l: (r.left - br.left) / z, t: (r.top - br.top) / z, h: r.height / z }; };
      const N = m(n), S = m(sah), Q = qs.map(m);
      const x = S.l + 7;
      const y = (q) => Math.round(q.t + q.h / 2);
      let d = `M ${Math.round(N.l - 3)} ${y(N)} H ${x} V ${y(Q[Q.length - 1])}`;
      Q.forEach(q => { d += ` M ${x} ${y(q)} H ${Math.round(q.l)}`; });
      setYol({ d, w: b.offsetWidth, h: b.offsetHeight });
    };
    let ro = null;
    const t = setTimeout(() => {
      ol();
      if (typeof ResizeObserver !== 'undefined' && boxRef.current) { ro = new ResizeObserver(ol); ro.observe(boxRef.current); }
    }, kam ? 0 : 820);
    return () => { clearTimeout(t); if (ro) ro.disconnect(); };
  }, [faol, kam]); // eslint-disable-line
  return yol;
};
const HOOK_OPTS = [
  { id: 'a', t: { uz: "Shu payt sahifani ochib o'tirgan uch kishi", ru: 'Три человека, у которых сейчас открыта страница' } },
  { id: 'b', t: { uz: 'Shu 5 daqiqada hodisa yuborgan uch brauzer', ru: 'Три браузера, отправившие событие за эти 5 минут' } },
  { id: 'c', t: { uz: "Shu 5 daqiqada band qilgan uch o'yinchi", ru: 'Три игрока, забронировавшие за эти 5 минут' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Bu raqam — oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar. Ochiq sahifani Backend ko'rmaydi.</>, ru: <><b>Именно!</b> Это число — разные браузеры, отправившие событие за последние 5 минут. Открытую страницу Backend не видит.</> },
  a: { uz: <><b>Qiziq fikr!</b> Ochiq sahifani Backend ko'rmaydi. Bu raqam — oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar.</>, ru: <><b>Интересная мысль!</b> Открытую страницу Backend не видит. Это число — разные браузеры, отправившие событие за последние 5 минут.</> },
  c: { uz: <><b>Qiziq fikr!</b> Band qilganlar «band qildi» qadamida. Bu raqam — 5 daqiqada hodisa yuborgan turli brauzerlar.</>, ru: <><b>Интересная мысль!</b> Забронировавшие — на шаге «забронировал». Это число — разные браузеры, отправившие событие за 5 минут.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const kam = useKamHarakat();
  const box = useRef(null);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const son = useSanoqlar(DASH_NAMUNA, !storedAnswer);
  const yol = useChiziq(box, picked !== null, kam);
  const pick = (v) => { if (picked !== null) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>«Oxirgi 5 daqiqada: 3» — bu raqam <span className="italic" style={{ color: T.accent }}>nimani sanaydi?</span></>, ru: <>«За последние 5 минут: 3» — что <span className="italic" style={{ color: T.accent }}>считает это число?</span></> })}
        mentor={<Mentor>{tr({ uz: "«Maydon» egasi saytdagi raqamlarni bitta sahifada ko'radi — bunday sahifa dashboard (holat paneli) deyiladi. Uch javobdan bittasini tanlang.", ru: 'Владелец «Maydon» видит числа сайта на одной странице — такая страница называется дашборд (панель состояния). Выберите один из трёх ответов.' })}</Mentor>}
        maket={<div className={cxx('ld-s0', yol && 'bog')} ref={box}>
          <DashMaket kirish={!storedAnswer} son={son} soat={tr({ uz: 'hozir 18:45', ru: 'сейчас 18:45' })} lenta={<Lenta ochiq={picked !== null} />} />
          {yol && <svg className="ld-chiziq" width={yol.w} height={yol.h} viewBox={`0 0 ${yol.w} ${yol.h}`} aria-hidden="true"><path key={yol.d} d={yol.d} pathLength="1" /></svg>}
        </div>}
        savol={tr({ uz: 'Sizningcha, qaysi biri?', ru: 'Как вы думаете, какой?' })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda dashboard tayyor holatda, bir marta o'zi yuradi (3 → 4, ochdi 14 → 15) =====
const REJA = [
  { t: { uz: 'Backend bugungi raqamlarni egaga token bilan beradi', ru: 'Backend отдаёт владельцу сегодняшние числа по токену' } },
  { t: { uz: "Dashboard raqamlari sahifani yangilamasdan o'zgaradi", ru: 'Числа дашборда меняются без обновления страницы' } },
  { t: { uz: 'Dashboard internetda: sinfdosh kirsa, raqam oshadi', ru: 'Дашборд в интернете: зайдёт одноклассник — число вырастет' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const kam = useKamHarakat();
  const [bosqich, setBosqich] = useState(kam ? 2 : 0); // 0 — namuna · 1 — raqam o'zgardi (yashil) · 2 — qotdi
  useEffect(() => {
    if (kam) return undefined;
    const a = setTimeout(() => setBosqich(1), 2100);
    const b = setTimeout(() => setBosqich(2), 3500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [kam]);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Dars oxirida «Maydon» dashboard'i <span className="italic" style={{ color: T.accent }}>jonli ishlaydi</span>.</>, ru: <>К концу урока дашборд «Maydon» <span className="italic" style={{ color: T.accent }}>заработает вживую</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Talabni siz yozasiz, agent dashboard'ni yig'adi. «Maydon» — namuna: har amaliyot oxirida shu talabni o'z MVP'ingiz uchun ham yozasiz.", ru: 'Требование пишете вы, агент собирает дашборд. «Maydon» — образец: в конце каждой практики вы напишете это требование и для своего MVP.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<DashMaket kirish son={bosqich === 0 ? DASH_NAMUNA : { ...DASH_NAMUNA, hozir: 4, ochdi: 15 }} yangi={bosqich === 1 ? ['hozir', 'ochdi'] : []} yangilandi={DASH_NAMUNA.yangilandi} />}
        ongYorliq={tr({ uz: 'Bugungi 3 qadam', ru: '3 шага на сегодня' })}
        qadamlar={REJA.map(r => ({ t: tr(r.t) }))}
      >
        <p className="ld-repo">{tr({ uz: 'repo', ru: 'репо' })} <code>maydon</code> · {tr({ uz: "boshlang'ich holat", ru: 'начальное состояние' })} <code>m10-dars-03-start</code> · {tr({ uz: 'namuna', ru: 'образец' })} <code>m10-dars-03-done</code></p>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA (sanoq): o'yinchi uch katakni bosadi → jadvalga qator, ikki sanoq yonma-yon. Telefon CHAPDA, jadval va sanoq O'NGDA =====
const S2_SAVOL = { uz: '«Vaqtni tanladi» nechta bo\'lsin?', ru: 'Сколько должно быть «выбрал время»?' };
const S2_TAXMIN = [{ k: '1', t: { uz: 'Bitta', ru: 'Один' } }, { k: '2', t: { uz: 'Ikkita', ru: 'Два' } }, { k: '3', t: { uz: 'Uchta', ru: 'Три' } }];
const S2_VAQT = ['18:40:15', '18:40:19', '18:40:24'];
const S2_TAVSIYA = ['17:00', '18:00', '19:00']; // halqa — navbatdagi katak (har qanday bo'sh katak ham bosiladi)
const SANOQ_QATOR = [
  { k: 'qator', t: { uz: 'Har qator sanalsa', ru: 'Если считать каждую строку' }, x: { uz: "Bosishlar sanaldi: vaqt tanlaganlar ochganlardan ko'p.", ru: 'Посчитаны нажатия: выбравших время больше, чем открывших.' } },
  { k: 'brauzer', t: { uz: 'Turli brauzerlar sanalsa', ru: 'Если считать разные браузеры' }, x: { uz: 'Turli brauzerlar sanaldi: har qadamda bitta.', ru: 'Посчитаны разные браузеры: на каждом шаге один.' } }
];
const SanoqKarta = ({ son, tugadi, joyida }) => (
  <div className="ld-sanoq">
    {SANOQ_QATOR.map(r => {
      const qiz = tugadi && r.k === 'qator';
      const yash = tugadi && r.k === 'brauzer';
      return (
        <div key={r.k} className={cxx('ld-sanoq-q', qiz && 'qiz', yash && 'yashil')}>
          <span className="ld-sanoq-n">{yash && <i aria-hidden="true">✓</i>}{tr(r.t)}</span>
          <div className="ld-sanoq-c">
            {UCH_QADAM.map((q, i) => {
              const jy = r.k === 'brauzer' && q.k === 'tanladi' && joyida;
              return (
                <React.Fragment key={q.k}>
                  <span data-s={`${r.k}-${q.k}`} className={cxx('ld-chip', qiz && i < 2 && 'qiz', jy && 'joyida')}><em>{tr(q.t)}</em><b key={son[r.k][q.k] + (jy ? '-' + joyida : '')}>{son[r.k][q.k]}</b></span>
                  {i < 2 && <i className={cxx('ld-ul', qiz && i === 0 && 'uzuq')} aria-hidden="true" />}
                </React.Fragment>
              );
            })}
          </div>
          {tugadi && <span className="ld-sanoq-x">{tr(r.x)}</span>}
        </div>
      );
    })}
  </div>
);
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, kam } = useUchish();
  const taymer = useTaymer();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [bosish, setBosish] = useState(avval ? S2_TAVSIYA : []);
  const [kelgan, setKelgan] = useState(avval ? 3 : 0); // jadvalga yetgan qatorlar
  const [sanaldi, setSanaldi] = useState(avval ? 3 : 0); // sanoqqa yetgan qatorlar
  const [yangiK, setYangiK] = useState(null);
  const [bosN, setBosN] = useState(0);
  const n = bosish.length;
  const yur = n > sanaldi;
  const done = sanaldi >= 3;
  const tugadi = useTugadi(done, 1500, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const d = kam ? 0 : UCH_MS;
  const bos = (s) => {
    if (!taxmin || done || yur) return;
    const i = n;
    setBosish(b => [...b, s]); setBosN(x => x + 1);
    uchir(`.ld-katak[data-s="${s}"]`, '.ld-jadval-oxir', 'vaqt-tanladi');
    taymer(() => { setKelgan(i + 1); setYangiK(i + 1); }, d);
    taymer(() => {
      uchir(`.ld-jt tr[data-k="${i + 1}"] td.br`, '[data-s="qator-tanladi"] b', '', 'nuqta', 520);
      if (i === 0) uchir(`.ld-jt tr[data-k="${i + 1}"] td.br`, '[data-s="brauzer-tanladi"] b', '', 'nuqta', 520);
    }, d + (kam ? 0 : 160));
    taymer(() => setSanaldi(i + 1), d + (kam ? 0 : 700));
  };
  const qatorlar = [{ k: 0, nom: 'ochdi', id: '3f2c…', vaqt: '18:40:02' }, ...S2_VAQT.slice(0, kelgan).map((v, i) => ({ k: i + 1, nom: 'vaqt-tanladi', id: '3f2c…', vaqt: v }))];
  const son = { qator: { ochdi: 1, tanladi: sanaldi, band: 0 }, brauzer: { ochdi: 1, tanladi: sanaldi > 0 ? 1 : 0, band: 0 } };
  const faol = !!taxmin && !done && !yur;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · sanoq', ru: 'Понятие · подсчёт' })} screen={screen} scrollSignal={sanaldi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Kataklarni bosing (${sanaldi}/3)`, ru: `Нажимайте на ячейки (${sanaldi}/3)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>O'yinchi uch katakni bosdi. Dashboard <span className="italic" style={{ color: T.accent }}>nechta desin?</span></>, ru: <>Игрок нажал три ячейки. Сколько <span className="italic" style={{ color: T.accent }}>покажет дашборд?</span></> })}
        mentor={<Mentor>{tr({ uz: <>Umami'da <code className="qcode">vaqt-tanladi</code> har bosishda oshardi; o'yinchi bo'lib bo'sh kataklarni bosing.</>, ru: <>В Umami <code className="qcode">vaqt-tanladi</code> рос с каждым нажатием; станьте игроком и нажмите свободные ячейки.</> })}</Mentor>}
        bashorat={<Bashorat savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="ld-s2" ref={box}>
          <Telefon yorliq={tr({ uz: "o'yinchi telefoni", ru: 'телефон игрока' })} tanlangan={bosish[n - 1]} navbat={faol ? S2_TAVSIYA[n] : null} onKatak={faol ? bos : undefined} bos={bosish[n - 1]} bosN={bosN} />
          <div className="ld-s2-ong">
            <HodisaJadval qatorlar={qatorlar} yangiK={yangiK} />
            <SanoqKarta son={son} tugadi={done} joyida={sanaldi >= 2 ? sanaldi : null} />
          </div>
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
        natija={done && <NatijaBlok tanlov={taxmin} togri="1" variantlar={S2_TAXMIN} haqiqat={{ uz: 'bitta — qator uchta, brauzer bitta', ru: 'один — строк три, браузер один' }}
          izoh={tr({ uz: 'Har qatorda brauzer ID bor: u bitta brauzerni ajratadi, odamning ismini bildirmaydi.', ru: "В каждой строке есть ID браузера: он отмечает один браузер, имени человека не раскрывает." })}
          xulosa={tr({ uz: "Bu dashboard'da har qadam — turli brauzerlar soni. Shunda qadamlarni foiz bilan mazmunliroq solishtira olamiz.", ru: "В этом дашборде каждый шаг — число разных браузеров. Тогда шаги можно осмысленно сравнивать в процентах." })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (INLINE_KEYS.s3 = 1, B) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Bugun hali kirmagan o'yinchi saytni telefon va laptopdan ochdi. «Ochdi» nechtaga oshadi?"
    question={tr({ uz: <h2 className="title h-ask">Bugun hali kirmagan o'yinchi saytni telefon va laptopdan ochdi. <span className="italic" style={{ color: T.accent }}>«Ochdi» nechtaga oshadi?</span></h2>, ru: <h2 className="title h-ask">Игрок, который сегодня ещё не заходил, открыл сайт с телефона и ноутбука. <span className="italic" style={{ color: T.accent }}>На сколько вырастет «открыл»?</span></h2> })}
    options={[
      { uz: 'Bittaga — brauzerlar bir odamniki', ru: 'На один — браузеры одного человека' },
      { uz: 'Ikkitaga — har brauzer alohida', ru: 'На два — каждый браузер отдельно' },
      { uz: 'Nolga — hali katak bosilmagan', ru: "На ноль — ячейка ещё не нажата" },
      { uz: "Bilib bo'lmaydi — ism yozilmagan", ru: 'Нельзя узнать — имя не записано' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Telefon va laptop — ikki brauzer, ikkalasining ID si boshqa.', ru: 'Телефон и ноутбук — два браузера, у каждого свой ID.' }}
    explainWrong={{
      0: { uz: 'Odam bitta — rost. Dashboard esa nimani ajratadi?', ru: 'Человек один — верно. А что различает дашборд?' },
      2: { uz: '«Ochdi» sahifa ochilganda yoziladi, bosishni kutmaydi.', ru: "«Открыл» записывается при открытии страницы, нажатия не ждёт." },
      3: { uz: 'Sanash uchun ism kerak emas — jadvalda nima turardi?', ru: 'Для подсчёта имя не нужно — что было в таблице?' },
      default: { uz: 'Odam bitta — rost. Dashboard esa nimani ajratadi?', ru: 'Человек один — верно. А что различает дашборд?' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA (yangilanish): telefon → Backend ← dashboard. Taymer birinchi harakatdan keyin chiqadi, har 5 soniyada so'rov borib-keladi =====
const S4_SAVOL = { uz: "O'yinchi saytni ochdi. Dashboard'dagi raqam qachon o'zgaradi?", ru: 'Игрок открыл сайт. Когда изменится число на дашборде?' };
const S4_TAXMIN = [{ k: 'shu', t: { uz: "Shu soniyaning o'zida", ru: 'В ту же секунду' } }, { k: 'besh', t: { uz: '5 soniya ichida', ru: 'В течение 5 секунд' } }, { k: 'ega', t: { uz: 'Ega sahifani yangilaganda', ru: 'Когда владелец обновит страницу' } }];
const SON_KALIT = ['hozir', 'ochdi', 'tanladi', 'band'];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, kam } = useUchish();
  const taymer = useTaymer();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [tel, setTel] = useState(avval ? 'tanladi' : 'yopiq'); // yopiq → ochiq → tanladi
  const [server, setServer] = useState(avval ? BIR_YANGI : DASH_NAMUNA); // Database'dagi holat
  const [korinadi, setKorinadi] = useState(avval ? BIR_YANGI : DASH_NAMUNA); // dashboard ko'rsatayotgani
  const serverRef = useRef(server); serverRef.current = server;
  const korRef = useRef(korinadi); korRef.current = korinadi;
  const [yangi, setYangi] = useState([]);
  const [beQator, setBeQator] = useState(0);
  const [tok, setTok] = useState(false);
  const [yolda, setYolda] = useState(false);
  const [taymerOn, setTaymerOn] = useState(avval);
  const d = kam ? 0 : UCH_MS;
  // taymer 0 da: dashboard'dan Backend'ga so'rov (token bilan) → javob qaytadi → o'zgargan raqam bir lahza yashil
  const sorov = () => {
    uchir('.ld-s4 .ld-manzil', '.ld-be', 'GET /hodisalar/sanoq', 'tok');
    taymer(() => { setTok(true); uchir('.ld-be', '.ld-s4 .ld-hozir', tr({ uz: 'javob', ru: 'ответ' }), 'javob'); }, d);
    taymer(() => {
      setTok(false);
      const s = serverRef.current, k = korRef.current;
      const ozg = SON_KALIT.filter(x => s[x] !== k[x]);
      if (!ozg.length) return;
      setKorinadi(s); setYangi(ozg);
      taymer(() => setYangi([]), 1300);
    }, 2 * d + (kam ? 0 : 60));
  };
  const qoldi = useSorov(taymerOn, sorov);
  const och = () => {
    if (!taxmin || tel !== 'yopiq' || yolda) return;
    setTel('ochiq'); setYolda(true);
    const t0 = kam ? 0 : 260;
    taymer(() => uchir('.ld-s4 .ld-telefon', '.ld-be', 'POST /hodisalar · ochdi'), t0);
    taymer(() => { setServer(s => ({ ...s, hozir: s.hozir + 1, ochdi: s.ochdi + 1 })); setBeQator(x => x + 1); setYolda(false); setTaymerOn(true); }, t0 + d);
  };
  const tanla = (s) => {
    if (s !== '18:00' || tel !== 'ochiq' || yolda || korRef.current.ochdi < BIR_YANGI.ochdi) return;
    setTel('tanladi'); setYolda(true);
    uchir('.ld-s4 .ld-katak[data-s="18:00"]', '.ld-be', 'POST /hodisalar · vaqt-tanladi');
    taymer(() => { setServer(x => ({ ...x, tanladi: x.tanladi + 1 })); setBeQator(x => x + 1); setYolda(false); }, d);
  };
  const harakat = tel === 'yopiq' ? 0 : tel === 'ochiq' ? 1 : 2;
  const done = korinadi.tanladi >= BIR_YANGI.tanladi;
  const birinchi = korinadi.ochdi >= BIR_YANGI.ochdi; // birinchi o'zgarish ko'rindi — endi 18:00
  const kutish = taxmin && !done && ((harakat === 1 && !birinchi) || harakat === 2);
  const tugadi = useTugadi(done, 1500, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const POLLING = { uz: "Sayt Backend'dan qayta-qayta so'raydi — botdagi polling kabi.", ru: 'Сайт снова и снова спрашивает Backend — как polling у бота.' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · yangilanish', ru: 'Понятие · обновление' })} screen={screen} scrollSignal={harakat + (done ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Telefonda bosing (${harakat}/2)`, ru: `Нажмите на телефоне (${harakat}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Yangi o'yinchi kirdi. Dashboard buni <span className="italic" style={{ color: T.accent }}>qachon ko'radi?</span></>, ru: <>Зашёл новый игрок. <span className="italic" style={{ color: T.accent }}>Когда это увидит</span> дашборд?</> })}
        mentor={<Mentor>{tr({ uz: "Telefonda o'yinchi bo'lib saytni oching va dashboard raqami qachon o'zgarishini kuzating.", ru: 'Станьте игроком: откройте сайт на телефоне и следите, когда изменится число на дашборде.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="ld-s4" ref={box}>
          <Telefon yorliq={tr({ uz: "o'yinchi telefoni", ru: 'телефон игрока' })} ochiq={tel !== 'yopiq'} tanlangan={tel === 'tanladi' ? '18:00' : null} faqat="18:00"
            navbat={taxmin && tel === 'ochiq' && !yolda && birinchi ? '18:00' : null} onKatak={taxmin && tel === 'ochiq' && !yolda && birinchi ? tanla : undefined} bos={tel === 'tanladi' ? '18:00' : null} bosN={0}>
            {taxmin && tel === 'yopiq' && <QTugma className="ld-navbat" onClick={och}>{tr({ uz: 'Saytni ochish', ru: 'Открыть сайт' })}</QTugma>}
          </Telefon>
          <BackendQuti qator={beQator} tok={tok} />
          <DashMaket className={kutish ? 'ld-kuz' : undefined} son={korinadi} yangi={yangi} izoh taymer={taymerOn ? qoldi : null} />
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
        natija={done
          ? <NatijaBlok tanlov={taxmin} togri="besh" variantlar={S4_TAXMIN} haqiqat={{ uz: "keyingi so'rovda — odatda 5 soniya ichida", ru: 'при следующем запросе — обычно в течение 5 секунд' }}
              izoh={tr(POLLING)}
              xulosa={tr({ uz: "Bu dashboard'da Backend o'zi yubormaydi: sayt har 5 soniyada so'raydi, raqam shuncha kechikishi mumkin.", ru: 'В этом дашборде Backend сам ничего не отправляет: сайт спрашивает каждые 5 секунд, и число может запоздать на столько же.' })} />
          : harakat === 2 && <Joriy>{tr(POLLING)}</Joriy>}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (INLINE_KEYS.s5 = 3, D) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Dashboard raqamlari sahifa yangilanmaguncha o'zgarmayapti. Agentga nima yozasiz?"
    question={tr({ uz: <h2 className="title h-ask">Dashboard raqamlari sahifa yangilanmaguncha o'zgarmayapti. <span className="italic" style={{ color: T.accent }}>Agentga nima yozasiz?</span></h2>, ru: <h2 className="title h-ask">Числа дашборда не меняются, пока страницу не обновят. <span className="italic" style={{ color: T.accent }}>Что вы напишете агенту?</span></h2> })}
    options={[
      { uz: "Dashboard'ni boshidan boshqacha qilib yoz", ru: 'Перепиши дашборд с нуля по-другому' },
      { uz: "Hodisalarni Database'ga tezroq yozadigan qil", ru: 'Сделай, чтобы события писались в Database быстрее' },
      { uz: "Dashboard'ni tokensiz ham ochiladigan qil", ru: 'Сделай, чтобы дашборд открывался и без токена' },
      { uz: "Raqamlarni har 5 soniyada qayta so'rab tur", ru: 'Запрашивай числа заново каждые 5 секунд' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Ish aniq: sayt raqamlarni o'zi qayta so'raydigan bo'ladi.", ru: "Задача ясна: сайт сам будет заново запрашивать числа." }}
    explainWrong={{
      0: { uz: "Talab juda keng: qaysi ish o'zgarishi aytilmagan.", ru: 'Требование слишком широкое: не сказано, что изменить.' },
      1: { uz: "Hodisa yozilgan — sahifa uni qayta so'ramayapti.", ru: 'Событие записано — страница его заново не запрашивает.' },
      2: { uz: 'Token yangilanishga xalaqit bermaydi — himoya qolsin.', ru: 'Токен не мешает обновлению — защита пусть остаётся.' },
      default: { uz: "Talab juda keng: qaysi ish o'zgarishi aytilmagan.", ru: 'Требование слишком широкое: не сказано, что изменить.' }
    }} />
);

// ===== 🏅 NISHONLAR — 2 ta ballik testga, 1 ta bonus (A3 oxirgi «Bajardim»; birinchi urinish sharti yo'q) =====
const ACHIEVEMENTS = {
  countRight: { icon: '🔢', name: 'Count Right', desc: { uz: "Har qadamda brauzerlarni to'g'ri sanadingiz", ru: 'Вы верно посчитали браузеры на каждом шаге' } },
  autoUpdate: { icon: '🔄', name: 'Auto Update', desc: { uz: "To'xtagan yangilanishga aniq talab tanladingiz", ru: "Вы выбрали точное требование для замершего обновления" } },
  liveBoard: { icon: '📈', name: 'Live Board', desc: { uz: 'Uch amaliyot blokini oxirigacha bajardingiz', ru: 'Вы прошли три блока практики до конца' } }
};
// Ekran id → nishon (s3, s5 — ballik test, birinchi urinish; a3 — bonus)
const ACH_TRIGGERS = { s3: 'countRight', s5: 'autoUpdate', a3: 'liveBoard' };

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


// Podium savol yorliqlari (kalit = ballik ekran indeksi, SCORED_IDX: 4 — 1-savol, 7 — 2-savol; q22)
const Q_LABELS = {
  4: { uz: '1 — Turli brauzerlar', ru: '1 — Разные браузеры' },
  7: { uz: '2 — Yangilanish talabi', ru: "2 — Требование к обновлению" }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning fon so'zlari (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: 'dashboard', l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'Oxirgi 5 daqiqada', ru: 'За последние 5 минут' }, l: 78, t: 8, s: 22, d: 23, dl: 1.5 },
  { ch: { uz: 'ochdi', ru: 'открыл' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: 'vaqt-tanladi', l: 74, t: 68, s: 22, d: 21, dl: 2.2 },
  { ch: 'band-qildi', l: 44, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'brauzer ID', ru: 'ID браузера' }, l: 64, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: 'GET /hodisalar/sanoq', l: 22, t: 34, s: 18, d: 20, dl: 1.9 },
  { ch: 'token', l: 18, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: '401', l: 88, t: 44, s: 24, d: 22, dl: 0.6 },
  { ch: { uz: '5 soniya', ru: '5 секунд' }, l: 36, t: 58, s: 20, d: 24, dl: 1.4 },
  { ch: { uz: 'inkognito', ru: 'инкогнито' }, l: 56, t: 12, s: 20, d: 26, dl: 2.5 },
  { ch: 'EgaGuard', l: 4, t: 46, s: 20, d: 28, dl: 3.1 },
  { ch: 'Netlify', l: 30, t: 80, s: 20, d: 22, dl: 2.0 },
  { ch: 'Maydon', l: 90, t: 82, s: 22, d: 19, dl: 0.9 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD v3, aynan), to'g'ri javob o'rni A·B·C·D ×3
const QUIZ_BANK = [
  { q: { uz: 'Dashboard (holat paneli) nima?', ru: 'Что такое дашборд (панель состояния)?' }, opts: [{ uz: "Kerakli raqamlarni bir sahifada ko'rsatadigan sahifa", ru: "Одна страница со всеми нужными числами" }, { uz: "O'yinchi bo'sh vaqtni ko'rib, band qiladigan sahifa", ru: 'Страница, где игрок видит свободное время и бронирует' }, { uz: "Har hodisa bitta qator bo'lib yoziladigan jadval", ru: 'Таблица, где каждое событие пишется одной строкой' }, { uz: "Backend'ni laptopda ishga tushiradigan buyruq", ru: 'Команда, которая запускает Backend на ноутбуке' }], correct: 0 },
  { q: { uz: 'Bu darsda «Oxirgi 5 daqiqada» raqami nimani sanaydi?', ru: 'Что на этом уроке считает число «За последние 5 минут»?' }, opts: [{ uz: "Bugun saytni bir marta bo'lsa ham ochgan brauzerlarni", ru: 'Браузеры, которые сегодня хоть раз открыли сайт' }, { uz: 'Oxirgi 5 daqiqada hodisa yuborgan turli brauzerlarni', ru: 'Разные браузеры, отправившие событие за последние 5 минут' }, { uz: 'Shu daqiqada sahifasi ochiq turgan hamma odamlarni', ru: 'Всех людей, у которых сейчас открыта страница' }, { uz: "Bugun maydonda vaqt band qilgan hamma o'yinchilarni", ru: 'Всех игроков, забронировавших сегодня время на поле' }], correct: 1 },
  { q: { uz: 'Bitta brauzer uch katakni bosdi. «Vaqtni tanladi» nechtaga oshadi?', ru: "Один браузер нажал три ячейки. На сколько вырастет «выбрал время»?" }, opts: [{ uz: 'Uchtaga — har bosish bittadan sanaladi', ru: "На три — считается каждое нажатие" }, { uz: "Nolga — u hali hech narsa band qilmadi", ru: 'На ноль — он ещё ничего не забронировал' }, { uz: 'Bittaga — uch bosish ham bitta brauzer', ru: "На один — все три нажатия от одного браузера" }, { uz: 'Ikkitaga — birinchi bosish sanalmaydi', ru: 'На два — первое нажатие не считается' }], correct: 2 },
  { q: { uz: 'Nega dashboard har qadamda turli brauzerlarni sanaydi?', ru: 'Почему дашборд на каждом шаге считает разные браузеры?' }, opts: [{ uz: "Shunda raqamlar kattaroq va ishonchli ko'rinadi", ru: 'Так числа выглядят больше и надёжнее' }, { uz: "Shunda Backend so'rovga tezroq javob beradi", ru: 'Так Backend быстрее отвечает на запрос' }, { uz: "Shunda Database'da kamroq joy egallanadi", ru: 'Так в Database занимается меньше места' }, { uz: 'Shunda qadamlar bir o\'lchovda solishtiriladi', ru: "Так шаги сравниваются одной меркой" }], correct: 3 },
  { q: { uz: 'Dashboard raqamlarni qanday yangilaydi?', ru: 'Как дашборд обновляет числа?' }, opts: [{ uz: "Sayt har 5 soniyada Backend'dan so'raydi", ru: 'Сайт каждые 5 секунд спрашивает Backend' }, { uz: 'Ega har safar F5 tugmasini bosib turadi', ru: 'Владелец каждый раз нажимает F5' }, { uz: "Database raqamlarni sahifaga o'zi yuboradi", ru: 'Database сама отправляет числа на страницу' }, { uz: "Umami raqamlarni dashboard'ga ko'chirib beradi", ru: 'Umami переносит числа в дашборд' }], correct: 0 },
  { q: { uz: '`GET /hodisalar/sanoq` ga tokensiz so\'rov kelsa-chi?', ru: 'А если на `GET /hodisalar/sanoq` придёт запрос без токена?' }, opts: [{ uz: "Bugungi raqamlarni to'liq qaytarib beradi", ru: 'Вернёт все сегодняшние числа' }, { uz: '401 qaytaradi va raqamlarni bermaydi', ru: 'Вернёт 401 и не отдаст числа' }, { uz: '«Oxirgi 5 daqiqada» raqamini qaytaradi, xolos', ru: 'Вернёт только число «За последние 5 минут»' }, { uz: "Parol so'raydigan sahifani o'zi ochadi", ru: 'Сам откроет страницу с паролем' }], correct: 1 },
  { q: { uz: 'Sinfdosh saytni yopdi. Backend uni qachondan sanamaydi?', ru: "Одноклассник закрыл сайт. С какого момента Backend перестанет его считать?" }, opts: [{ uz: "Sahifani yopgan soniyaning o'zidayoq", ru: 'В ту же секунду, как закрыл страницу' }, { uz: 'Ertaga, yangi kun boshlanganda', ru: 'Завтра, когда начнётся новый день' }, { uz: "Oxirgi hodisasidan 5 daqiqa o'tgach", ru: 'Через 5 минут после его последнего события' }, { uz: "Ega dashboard'ni yangilagan paytda", ru: 'Когда владелец обновит дашборд' }], correct: 2 },
  { q: { uz: "Ega dashboard'ni ochdi. «Oxirgi 5 daqiqada» oshadimi?", ru: 'Владелец открыл дашборд. Вырастет ли «За последние 5 минут»?' }, opts: [{ uz: 'Ha — har ochilgan sahifa sanaladi', ru: 'Да — считается каждая открытая страница' }, { uz: 'Ha — ega ham saytga kirgan odam', ru: 'Да — владелец тоже зашёл на сайт' }, { uz: "Yo'q — ega paroli sanoqni to'xtatadi", ru: 'Нет — пароль владельца останавливает подсчёт' }, { uz: "Yo'q — dashboard hodisa yozmaydi", ru: "Нет — дашборд событий не записывает" }], correct: 3 },
  { q: { uz: 'Brauzer ID nimani bildiradi?', ru: 'Что обозначает ID браузера?' }, opts: [{ uz: 'Bitta brauzerni, odamning ismini emas', ru: 'Один браузер, а не имя человека' }, { uz: "O'yinchining ismi va telefon raqamini", ru: 'Имя и номер телефона игрока' }, { uz: 'Saytga kirgan odamning yoshi va shahrini', ru: 'Возраст и город человека на сайте' }, { uz: 'Ega paroli bilan berilgan tokenni', ru: 'Токен, выданный по паролю владельца' }], correct: 0 },
  { q: { uz: "Dashboard'dagi «Yangilandi» vaqti har 5 soniyada o'zgaryapti. Bu nimani bildiradi?", ru: 'Время «Обновлено» на дашборде меняется каждые 5 секунд. Что это значит?' }, opts: [{ uz: "Saytga har 5 soniyada yangi o'yinchi kiryapti", ru: 'Каждые 5 секунд на сайт заходит новый игрок' }, { uz: 'Backend har so\'rovga javob berib turibdi', ru: 'Backend отвечает на каждый запрос' }, { uz: 'Token eskirdi, parolni yana kiritish kerak', ru: 'Токен устарел, нужно снова ввести пароль' }, { uz: 'Raqamlar har yangilanishda bittaga oshyapti', ru: 'Числа растут на один при каждом обновлении' }], correct: 1 },
  { q: { uz: 'Vaqtni tanladi 9, band qildi 3. Necha foizi band qildi?', ru: "Выбрали время — 9, забронировали — 3. Какой процент забронировал?" }, opts: [{ uz: 'Taxminan 3 foizi', ru: 'Примерно 3 процента' }, { uz: 'Taxminan 6 foizi', ru: 'Примерно 6 процентов' }, { uz: 'Taxminan 33 foizi', ru: 'Примерно 33 процента' }, { uz: 'Taxminan 300 foizi', ru: 'Примерно 300 процентов' }], correct: 2 },
  { q: { uz: 'Agent «Tayyor» dedi. Sanoq to\'g\'riligini qanday tekshirasiz?', ru: "Агент сказал «Готово». Как вы проверите, что подсчёт верный?" }, opts: [{ uz: "Agentdan «to'g'rimi?» deb yana bir so'raysiz", ru: 'Ещё раз спросите агента: «верно?»' }, { uz: "Raqamlar katta chiqsa, to'g'ri deb olasiz", ru: 'Если числа большие — считаете, что верно' }, { uz: "Kodni o'qimasdan keyingi talabga o'tasiz", ru: 'Не читая код, переходите к следующему требованию' }, { uz: 'Inkognito oynada bosib, raqamni kuzatasiz', ru: 'Нажимаете в окне инкогнито и следите за числом' }], correct: 3 }
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
    // Arena tokenlari — SHU darsning mavzusidan (dashboard): suzuvchi kod-bo'laklari, emoji yo'q
    const TOK = ['dashboard', 'GET /hodisalar/sanoq', 'token', '401', 'ochdi', 'vaqt-tanladi', 'band-qildi', 'brauzer_id', 'EgaGuard', 'setInterval'];
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
// steps [{ h, t (matn yoki satrlar ro'yxati), prompt?: [satr], err?, yordam?: [satr], forma?: true }] · natija · ortda (tayanch 3 buyruqlari).
// Blok 5 qadam (9-Modul naqshi): 5-qadam «O'z g'oyangiz» — uch qatorli forma (qolipda forma turi yo'q — shu ulagichda, GoyaForma):
//   qiymat answers[ekran].goya da (ccProgress), «Nusxalash» bor, «Bajardim» uchala qator yozilgach ochiladi (JS qulf + CSS :has).
// «Yordam» (A1 — namuna ibora, A2 — namuna qator, A3 — namuna talab) qolipdagi QPrompt'da yo'q — QBlok qadamining izoh-qatori joyida, bosilsa ochiladi.
const TALAB_QISMLAR = [
  { id: 'qayerda', qism: { uz: 'Qayerda', ru: 'Где' } },
  { id: 'nima', qism: { uz: 'Nima qilsin', ru: 'Что сделать' } },
  { id: 'buzilmasin', qism: { uz: 'Nima buzilmasin', ru: 'Что не сломать' } }
];
const GOYA_BOSH = { qayerda: '', nima: '', buzilmasin: '' };
const GoyaForma = ({ qiymat, onYoz, tola }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => {
    try { await navigator.clipboard.writeText(TALAB_QISMLAR.map(q => `${tr(q.qism)}: ${String(qiymat[q.id] || '').trim()}`).join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="ld-goya" data-tola={tola ? '1' : '0'}>
      {TALAB_QISMLAR.map(q => (
        <label key={q.id} className="ld-goya-q">
          <span className="ld-goya-l">{tr(q.qism)}:</span>
          <textarea rows={1} value={qiymat[q.id] || ''} placeholder="…" onChange={e => onYoz(q.id, e.target.value)} />
        </label>
      ))}
      <QTugma ikkinchi disabled={!tola} onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</QTugma>
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  useEffect(() => { // ochilgan namuna va «Bajardim» bir ko'rinishda qolsin
    if (!ochiq) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 80);
    return () => clearTimeout(t);
  }, [ochiq]);
  return (
    <>
      <QTugma ikkinchi className="ld-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="ld-yordam fade-step">{satrlar.map((l, i) => <span key={i} className="ld-yordam-s">{fmtCode(tr(l))}</span>)}</span>}
    </>
  );
};
const qadamMatn = (t) => (Array.isArray(t) ? t.map((l, i) => <span key={i} className="ld-satr">{fmtCode(tr(l))}</span>) : fmtCode(tr(t)));
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda = [], doneText, tugadiIzoh, children }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const [goya, setGoya] = useState(() => ({ ...GOYA_BOSH, ...((storedAnswer && storedAnswer.goya) || {}) }));
  const formaN = steps.findIndex(c => c.forma);
  const tola = TALAB_QISMLAR.every(q => String(goya[q.id] || '').trim());
  const done = stepN >= steps.length;
  const goyaYoz = (id, v) => { const g = { ...goya, [id]: v }; setGoya(g); if (!avval) onAnswer(screen, { ...(storedAnswer || {}), goya: g }); };
  const bajardim = () => {
    if (isMentorLive || done) return;
    if (stepN === formaN && !tola) return; // 5-qadam: uchala qator yozilmaguncha «Bajardim» yopiq
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, goya });
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
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: c.forma ? <>{qadamMatn(c.t)}<GoyaForma qiymat={goya} onYoz={goyaYoz} tola={tola} /></> : qadamMatn(c.t),
          prompt: c.prompt && c.prompt.map(l => tr(l)),
          kimga: c.prompt && tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }),
          xato: c.yordam ? <Yordam satrlar={c.yordam} /> : (c.err && fmtCode(tr(c.err)))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortda}
        pastki={<>{done && tugadiIzoh && <QIzoh>{tr(tugadiIzoh)}</QIzoh>}<MentorPracticeStats live={_live} screen={screen} /></>}>
        {children}
      </QBlok>
    </Stage>
  );
}

// Kutilgan natija maketlari — bitta manbadan (DashMaket, Telefon): chizilgan, logotipsiz
// A1: dashboard parol bilan ochiladi (qulf → raqamlar), ostida tokensiz so'rov — 401
const NatijaA1 = () => {
  const kam = useKamHarakat();
  const [q, setQ] = useState(kam ? 2 : 0); // 0 — parol formasi · 1 — parol yozildi · 2 — raqamlar
  useEffect(() => {
    if (kam) return undefined;
    const a = setTimeout(() => setQ(1), 1100);
    const b = setTimeout(() => setQ(2), 2100);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [kam]);
  const son = useSanoqlar(DASH_NAMUNA, q === 2 && !kam);
  return (
    <div className="ld-natija">
      <DashMaket className="ld-ixcham" manzil="lok" son={son} izoh qulf={q === 0 ? 'bosh' : q === 1 ? 'yozildi' : null}>
        {q === 2 && <p className="ld-natija-izoh">{tr({ uz: "Sizda raqamlar boshqacha — o'z bosishlaringiz sanaladi.", ru: 'У вас числа будут другими — считаются ваши собственные нажатия.' })}</p>}
      </DashMaket>
      <div className="ld-mini">
        <div className="ld-bar"><i /><i /><i /><span className="ld-manzil">localhost:3000/hodisalar/sanoq?kun={DASH_NAMUNA.kun}</span></div>
        <span className="ld-401"><i className="ld-qulf qizil" aria-hidden="true" />401 · Unauthorized</span>
      </div>
    </div>
  );
};
// A2: halqa-taymer aylanadi; birinchi so'rovda raqamlar 4 · 15 · 10 · 3 ga yangilanadi (bir lahza yashil)
const NatijaA2 = () => {
  const kam = useKamHarakat();
  const [son, setSon] = useState(kam ? BIR_YANGI : DASH_NAMUNA);
  const [yangi, setYangi] = useState([]);
  const sonRef = useRef(son); sonRef.current = son;
  const qoldi = useSorov(true, () => {
    if (sonRef.current.tanladi === BIR_YANGI.tanladi) return;
    setSon(BIR_YANGI); setYangi(['hozir', 'ochdi', 'tanladi']);
    setTimeout(() => setYangi([]), 1300);
  });
  return <div className="ld-natija"><DashMaket className="ld-ixcham" manzil="lok" son={son} yangi={yangi} izoh taymer={qoldi} /></div>;
};
// A3: chapda sinfdosh telefoni (18:00 tanlangan), o'ngda internetdagi dashboard; «Yangilandi» har javobda yangilanadi
const vaqtQosh = (hms, s) => { const [h, m, c] = hms.split(':').map(Number); const t = h * 3600 + m * 60 + c + s; return [Math.floor(t / 3600) % 24, Math.floor(t / 60) % 60, t % 60].map(x => String(x).padStart(2, '0')).join(':'); };
const NatijaA3 = () => {
  const [javob, setJavob] = useState(0);
  const qoldi = useSorov(true, () => setJavob(j => j + 1));
  return (
    <div className="ld-natija ld-a3">
      <Telefon yorliq={tr({ uz: 'sinfdosh telefoni', ru: 'телефон одноклассника' })} manzil="maydon-….netlify.app" tanlangan="18:00" />
      <DashMaket className="ld-ixcham" son={DASH_NAMUNA} izoh taymer={qoldi} yangilandi={vaqtQosh(DASH_NAMUNA.yangilandi, javob * SORASH_S)} />
    </div>
  );
};
const ORTDA_FETCH = 'git fetch https://github.com/Azizbekcrypto/maydon --tags';
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon', ru: 'ожидаемый результат · образец: Maydon' };
const XATO_YOLI = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
const QADAM_OCHISH = { uz: 'Ochish', ru: 'Открыть' };
const QADAM_PROMPT = { uz: 'Prompt', ru: 'Промпт' };
const QADAM_ISHGA = { uz: 'Ishga tushirish', ru: 'Запуск' };
const QADAM_BRAUZER = { uz: 'Brauzerda tekshirish', ru: 'Проверка в браузере' };
const QADAM_GOYA = { uz: "O'z g'oyangiz", ru: 'Ваша идея' };
const A3_JOY = TALAB_QISMLAR.map(q => ({ uz: `${q.qism.uz}: {${q.qism.uz.toLowerCase()}}`, ru: `${q.qism.ru}: {${q.qism.ru.toLowerCase()}}` }));

const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · Backend → dashboard', ru: 'Практика 1 · Backend → дашборд' }}
    title={{ uz: <>Dashboard bugungi raqamlarni <span className="italic" style={{ color: T.accent }}>parol bilan ko'rsatsin</span>.</>, ru: <>Пусть дашборд покажет числа дня <span className="italic" style={{ color: T.accent }}>по паролю</span>.</> }}
    mentor={{ uz: <>Talab tayyor — siz <code className="qcode">{'{qanday sanasin}'}</code> joyini yozasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Требование готово — вы заполняете место <code className="qcode">{'{как считать}'}</code>; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM_OCHISH, t: [
        { uz: "Antigravity'da `maydon` papkasini oching. Birinchi terminalda: `cd backend`, `npm run start:dev`. Ikkinchisida: `cd web`, `npm run dev`.", ru: 'Откройте папку `maydon` в Antigravity. В первом терминале: `cd backend`, `npm run start:dev`. Во втором: `cd web`, `npm run dev`.' },
        { uz: '`backend/.env` dagi `EGA_PAROLI` va `JWT_SECRET` ega sahifasi uchun yozilgan — dashboard o\'sha parol bilan ochiladi.', ru: '`EGA_PAROLI` и `JWT_SECRET` в `backend/.env` записаны для страницы владельца — дашборд откроется тем же паролем.' }
      ] },
      { h: QADAM_PROMPT, t: { uz: "`{qanday sanasin}` joyiga har hodisa qanday sanalishini yozing (uch katak bosilgan mashqni eslang), «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: "Вместо `{как считать}` напишите, как считать каждое событие (вспомните упражнение с тремя ячейками), нажмите «Скопировать», отправьте в Antigravity:" }, prompt: [
        { uz: "Qayerda: Backend'da yangi yo'l GET /hodisalar/sanoq?kun= (kun — sana, masalan 2026-10-05); saytda yangi /dashboard sahifasi (web/).", ru: 'Где: в Backend новый путь GET /hodisalar/sanoq?kun= (kun — дата, например 2026-10-05); на сайте новая страница /dashboard (web/).' },
        { uz: "Nima qilsin: Backend shu kun uchun hodisalar jadvalidagi ochdi, vaqt-tanladi, band-qildi hodisalarining har biri uchun {qanday sanasin}; hodisa bo'lmasa — 0. Kun Toshkent vaqti bilan.", ru: 'Что сделать: Backend для этого дня по каждому событию ochdi, vaqt-tanladi, band-qildi из таблицы hodisalar — {как считать}; если событий нет — 0. День — по ташкентскому времени.' },
        { uz: 'Yana hozir bersin: oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar soni.', ru: 'Ещё пусть отдаёт hozir: число разных браузеров, отправивших событие за последние 5 минут.' },
        { uz: 'Bu yo\'l tokensiz javob bermasin — GET /bandlar dagi himoya (EgaGuard) bilan.', ru: 'Без токена этот путь пусть не отвечает — с защитой как в GET /bandlar (EgaGuard).' },
        { uz: "/dashboard /ega dagidek parol so'rasin (POST /kirish → token), keyin bugungi raqamlarni ko'rsatsin: «Oxirgi 5 daqiqada» va uch qadam — ochdi → vaqtni tanladi → band qildi.", ru: '/dashboard пусть спрашивает пароль, как /ega (POST /kirish → токен), затем показывает сегодняшние числа: «Oxirgi 5 daqiqada» и три шага — ochdi → vaqtni tanladi → band qildi.' },
        { uz: 'Token /ega dagidek faqat ochiq sahifada tursin.', ru: 'Токен, как в /ega, пусть хранится только в открытой странице.' },
        { uz: "Nima buzilmasin: POST /hodisalar va hodisalar jadvalining ustunlari, /ega va o'yinchi sahifasi; /dashboard ochilganda hodisa yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: POST /hodisalar и столбцы таблицы hodisalar, /ega и страницу игрока; при открытии /dashboard события не пишутся. Больше ничего не трогай, скажи, какие файлы изменились.' }
      ], yordam: [
        { uz: '«turli brauzerlar sonini bersin (bir brauzer necha marta yozsa ham, bitta sanalsin)»', ru: '«пусть отдаёт число разных браузеров (сколько бы раз ни писал один браузер, считается один)»' }
      ] },
      { h: QADAM_ISHGA, t: { uz: "Backend terminali o'zi qayta yukladi, sayt o'zi yangilandi, xato yo'q.", ru: "Терминал Backend сам перезапустился, сайт сам обновился, ошибок нет." }, err: XATO_YOLI },
      { h: QADAM_BRAUZER, t: [
        { uz: 'talabning har qatorini tekshiring:', ru: 'проверьте каждую строку требования:' },
        { uz: "(1) `localhost:3000/hodisalar/sanoq?kun=` ga bugungi sanani qo'shib oching — raqamlar emas, `401` chiqsin: tokensiz yopiq.", ru: '(1) Откройте `localhost:3000/hodisalar/sanoq?kun=` с сегодняшней датой — должны быть не числа, а `401`: без токена закрыто.' },
        { uz: "(2) `localhost:5173/dashboard` — parol bilan kiring: «Oxirgi 5 daqiqada» va uch qadam ko'rinadi.", ru: '(2) `localhost:5173/dashboard` — войдите с паролем: видны «Oxirgi 5 daqiqada» и три шага.' },
        { uz: "(3) Inkognito oyna oching (Chrome va Edge'da Ctrl+Shift+N, Mac'da Cmd+Shift+N) — sayt uni yangi brauzer deb ko'radi. Unda `localhost:5173` ni oching va ikki xil bo'sh katakni bosing.", ru: "(3) Откройте окно инкогнито (в Chrome и Edge — Ctrl+Shift+N, на Mac — Cmd+Shift+N) — сайт видит его как новый браузер. Откройте в нём `localhost:5173` и нажмите две разные свободные ячейки." },
        { uz: "Dashboard'ni yangilang (parol so'ralsa — kiriting): «Oxirgi 5 daqiqada», «ochdi» va «vaqtni tanladi» bittadan oshgan — ikki bosish, bitta brauzer.", ru: 'Обновите дашборд (если спросит пароль — введите): «Oxirgi 5 daqiqada», «ochdi» и «vaqtni tanladi» выросли на один — два нажатия, один браузер.' },
        { uz: 'Mos kelmagan qatorni uch qism bilan agentga yozing.', ru: 'Несовпавшую строку напишите агенту тремя частями.' }
      ] },
      { h: QADAM_GOYA, t: { uz: "shu promptni o'z MVP'ingiz uchun yozing: dashboard qaysi uch qadamni sanasin va uni kim ko'rsin? Uch qatorni to'ldiring.", ru: "напишите этот промпт для своего MVP: какие три шага должен считать дашборд и кто должен его видеть? Заполните три строки." }, forma: true }
    ]}
    natija={<NatijaA1 />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-03-start']}
    doneText={{ uz: 'Dashboard bugungi raqamlarni ko\'rsatadi, Backend ularni token bilan beradi.', ru: 'Дашборд показывает сегодняшние числа, Backend отдаёт их по токену.' }} />
);

const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · har 5 soniyada so\'rov', ru: 'Практика 2 · запрос каждые 5 секунд' }}
    title={{ uz: <>Dashboard raqamlari sahifani <span className="italic" style={{ color: T.accent }}>yangilamasdan o'zgarsin</span>.</>, ru: <>Числа дашборда <span className="italic" style={{ color: T.accent }}>меняются без перезагрузки</span>.</> }}
    mentor={{ uz: <>Endi «Nima qilsin» qatorini o'zingiz yozasiz, namuna «Yordam»da; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Теперь строку «Что сделать» пишете сами, образец — в «Помощи»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "ikkala terminal ishlayapti. `localhost:5173/dashboard` ga parol bilan kiring: raqamlar hali sahifa yangilangandagina o'zgaradi.", ru: 'оба терминала работают. Войдите в `localhost:5173/dashboard` с паролем: числа пока меняются только при обновлении страницы.' } },
      { h: QADAM_PROMPT, t: { uz: "`{nima qilsin}` qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'строку `{что сделать}` напишите сами, нажмите «Скопировать», отправьте в Antigravity:' }, prompt: [
        { uz: 'Qayerda: /dashboard sahifasi (web/).', ru: 'Где: страница /dashboard (web/).' },
        { uz: 'Nima qilsin: {nima qilsin}', ru: 'Что сделать: {что сделать}' },
        { uz: "Nima buzilmasin: parol bilan kirish, «Oxirgi 5 daqiqada» va uch qadam, GET /hodisalar/sanoq dagi himoya; /ega va o'yinchi sahifasi. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход по паролю, «Oxirgi 5 daqiqada» и три шага, защиту GET /hodisalar/sanoq; /ega и страницу игрока. Больше ничего не трогай, скажи, какие файлы изменились.' }
      ], yordam: [
        { uz: "Nima qilsin: kirgan zahoti raqamlarni bir marta so'rasin, keyin har 5 soniyada `GET /hodisalar/sanoq` dan token bilan qayta so'rab yangilasin; oldingi so'rov hali tugamagan bo'lsa, yangisini ustma-ust yubormasin. Javob `401` bo'lsa (token eskirgan) — so'rov to'xtasin, parol formasi qaytsin.", ru: "Что сделать: сразу после входа пусть один раз запросит числа, потом каждые 5 секунд запрашивает их заново из `GET /hodisalar/sanoq` с токеном и обновляет; если прошлый запрос ещё не закончился, новый поверх не отправляет. Если ответ `401` (токен устарел) — пусть остановит запросы и вернёт форму пароля." }
      ] },
      { h: QADAM_ISHGA, t: { uz: "sayt o'zi yangilandi, terminalda xato yo'q.", ru: 'сайт обновился сам, в терминале нет ошибок.' }, err: XATO_YOLI },
      { h: QADAM_BRAUZER, t: [
        { uz: 'dashboard ochiq tursin, uni yangilamang. Hamma inkognito oynalarni yoping va yangisini oching — u yana yangi brauzer bo\'ladi.', ru: 'дашборд пусть остаётся открытым, не обновляйте его. Закройте все окна инкогнито и откройте новое — это снова новый браузер.' },
        { uz: "Unda `localhost:5173` ni oching va bo'sh katakni bosing. Dashboard'ga qayting: keyingi so'rovdan keyin «Oxirgi 5 daqiqada», «ochdi» va «vaqtni tanladi» o'zi oshadi (tarmoqqa qarab biroz kechroq bo'lishi mumkin).", ru: "Откройте в нём `localhost:5173` и нажмите свободную ячейку. Вернитесь к дашборду: после следующего запроса «Oxirgi 5 daqiqada», «ochdi» и «vaqtni tanladi» вырастут сами (в зависимости от сети — чуть позже)." },
        { uz: "Mos kelmasa — ko'rganingizni uch qism bilan agentga yozing.", ru: 'Если не совпало — напишите увиденное агенту тремя частями.' }
      ] },
      { h: QADAM_GOYA, t: { uz: "shu promptni o'z MVP'ingiz uchun yozing: dashboard raqamlari necha soniyada bir yangilansin? Uch qatorni to'ldiring.", ru: "напишите этот промпт для своего MVP: через сколько секунд обновлять числа дашборда? Заполните три строки." }, forma: true }
    ]}
    natija={<NatijaA2 />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-03-done']}
    doneText={{ uz: "Raqamlar har 5 soniyada o'zi yangilanadi — sahifani yangilash shart emas.", ru: 'Числа обновляются сами каждые 5 секунд — обновлять страницу не нужно.' }} />
);

const ScreenA3 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 3 · internetda tekshirish', ru: 'Практика 3 · проверка в интернете' }}
    title={{ uz: <>Dashboard internetda: sinfdosh kirsa, <span className="italic" style={{ color: T.accent }}>raqam oshsin</span>.</>, ru: <>Зайдёт одноклассник — <span className="italic" style={{ color: T.accent }}>число вырастет</span>.</> }}
    mentor={{ uz: <>Uch qatorning hammasi sizdan, namuna «Yordam»da; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Все три строки — ваши, образец — в «Помощи»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "ikkala terminal ishlayapti, dashboard raqamlari o'zi yangilanyapti.", ru: 'оба терминала работают, числа дашборда обновляются сами.' } },
      { h: QADAM_PROMPT, t: { uz: "vazifa: uch qadam ostida oxirgi javob kelgan vaqt chiqsin — «Yangilandi: 18:45:05». Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'задача: под тремя шагами пусть выводится время последнего ответа — «Yangilandi: 18:45:05». Напишите три строки сами, нажмите «Скопировать», отправьте в Antigravity:' }, prompt: A3_JOY, yordam: [
        { uz: 'Qayerda: `/dashboard` sahifasi, uch qadam ostida.', ru: 'Где: страница `/dashboard`, под тремя шагами.' },
        { uz: "Nima qilsin: Backend'dan oxirgi javob kelgan vaqtni «Yangilandi: 18:45:05» ko'rinishida yozsin; har yangi javobda vaqt yangilansin.", ru: "Что сделать: пусть пишет время последнего ответа от Backend в виде «Yangilandi: 18:45:05»; при каждом новом ответе время обновляется." },
        { uz: "Nima buzilmasin: har 5 soniyalik so'rov, parol bilan kirish, `/ega` va o'yinchi sahifasi. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: запрос каждые 5 секунд, вход по паролю, `/ega` и страницу игрока. Больше ничего не трогай, скажи, какие файлы изменились.' }
      ] },
      { h: QADAM_ISHGA, t: [
        { uz: "laptopda «Yangilandi» vaqti har 5 soniyada o'zgaradi.", ru: 'на ноутбуке время «Yangilandi» меняется каждые 5 секунд.' },
        { uz: "Keyin `git add .`, `git commit -m \"dashboard\"`, `git push` — Render va Netlify kodni GitHub'dan olib, o'zi yangilanadi (bir necha daqiqa).", ru: 'Затем `git add .`, `git commit -m "dashboard"`, `git push` — Render и Netlify возьмут код из GitHub и обновятся сами (несколько минут).' }
      ], err: XATO_YOLI },
      { h: { uz: 'Internetda tekshirish', ru: 'Проверка в интернете' }, t: [
        { uz: "Netlify manzilingizga `/dashboard` qo'shib oching (`….netlify.app/dashboard`) va ega paroli bilan kiring (Render'dagi `EGA_PAROLI`).", ru: 'Откройте свой адрес Netlify с `/dashboard` (`….netlify.app/dashboard`) и войдите паролем владельца (`EGA_PAROLI` в Render).' },
        { uz: "Sinfdoshingiz telefonida Netlify manzilingizni ochib, bo'sh katakni bossin: keyingi so'rovdan keyin «Oxirgi 5 daqiqada» oshadi, «Yangilandi» vaqti yangilanadi; sinfdosh saytingizni bugun birinchi marta ochgan bo'lsa — «ochdi» va «vaqtni tanladi» ham oshadi.", ru: "Пусть одноклассник откроет ваш адрес Netlify на телефоне и нажмёт свободную ячейку: после следующего запроса «Oxirgi 5 daqiqada» вырастет, время «Yangilandi» обновится; если одноклассник сегодня открыл ваш сайт впервые — вырастут и «ochdi», и «vaqtni tanladi»." },
        { uz: "Bepul Backend uxlab qolgan bo'lsa, birinchi javob kechikishi mumkin — taxminan bir daqiqagacha.", ru: 'Если бесплатный Backend уснул, первый ответ может задержаться — примерно до минуты.' },
        { uz: "Laptopdagi tekshiruvlaringiz ham shu Database'ga yozilgan — ular ham raqamlarda ko'rinadi. Netlify yoki Render yangilanmasa — tekshiruvni laptopda inkognito oyna bilan qiling, push'ni mentor bilan ko'rasiz.", ru: 'Ваши проверки на ноутбуке тоже записаны в эту Database — они тоже видны в числах. Если Netlify или Render не обновились — проверьте на ноутбуке в окне инкогнито, а push разберёте с ментором.' }
      ] },
      { h: QADAM_GOYA, t: { uz: "shu promptni o'z MVP'ingiz uchun yozing: egaga dashboard'da yana qaysi bitta qator kerak? Uch qatorni to'ldiring.", ru: 'напишите этот промпт для своего MVP: какая ещё одна строка нужна владельцу на дашборде? Заполните три строки.' }, forma: true }
    ]}
    natija={<NatijaA3 />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-03-done']}
    doneText={{ uz: 'Dashboard internetda ishlayapti: sinfdosh kirsa, raqam keyingi so\'rovda oshadi.', ru: 'Дашборд работает в интернете: зайдёт одноклассник — число вырастет при следующем запросе.' }}
    tugadiIzoh={{ uz: "«Yangilandi» — Backend'dan oxirgi javob kelgan vaqt. U so'rov javob olganini aytadi, raqam to'g'riligini emas.", ru: '«Обновлено» — время последнего ответа от Backend. Оно говорит, что запрос получил ответ, а не что число верное.' }}>
    <p className="ld-ortda-izoh">{tr({ uz: "Render va Netlify o'zingizniki — o'tgan moduldagi deploy'dan.", ru: 'Render и Netlify — ваши, с деплоя в прошлом модуле.' })}</p>
  </ScreenBlok>
);

// 🃏 KARTOCHKALAR (12, MD v3 aynan) — alohida ekran sflash (SABOQ 12), qolipdagi QKartochka (DE-204). Old va izoh — fmtCode; orqa — oddiy matn.
const KARTALAR = [
  { front: { uz: 'Dashboard (holat paneli) nima?', ru: 'Что такое дашборд (панель состояния)?' }, back: { uz: "Kerakli raqamlarni bir sahifada ko'rsatadigan sahifa", ru: "Одна страница со всеми нужными числами" }, note: { uz: '«Maydon» da — `/dashboard`, egaga parol bilan', ru: 'В «Maydon» — `/dashboard`, владельцу по паролю' } },
  { front: { uz: '«Oxirgi 5 daqiqada» raqami bu dashboard\'da nimani sanaydi?', ru: 'Что в этом дашборде считает число «За последние 5 минут»?' }, back: { uz: 'Oxirgi 5 daqiqada hodisa yuborgan turli brauzerlarni', ru: 'Разные браузеры, отправившие событие за последние 5 минут' }, note: { uz: "Ochiq sahifani Backend ko'rmaydi — kelgan hodisani ko'radi", ru: 'Открытую страницу Backend не видит — видит пришедшее событие' } },
  { front: { uz: "Saytni ochib, 6 daqiqa hech narsa bosmagan odam «Oxirgi 5 daqiqada» sanog'ida bormi?", ru: 'Человек открыл сайт и 6 минут ничего не нажимал. Он есть в счёте «За последние 5 минут»?' }, back: { uz: "Yo'q", ru: 'Нет' }, note: { uz: 'U 5 daqiqa ichida hodisa yubormagan', ru: 'За 5 минут он не отправил ни одного события' } },
  { front: { uz: 'Bitta brauzer uch katakni bossa, «vaqtni tanladi» nechtaga oshadi?', ru: "Если один браузер нажмёт три ячейки, на сколько вырастет «выбрал время»?" }, back: { uz: 'Bittaga', ru: 'На один' }, note: { uz: 'Har qadamda turli brauzerlar soni', ru: 'На каждом шаге — число разных браузеров' } },
  { front: { uz: 'Nega bosishlar emas, turli brauzerlar sanaladi?', ru: 'Почему считаются разные браузеры, а не нажатия?' }, back: { uz: 'Qadamlarni solishtirish uchun', ru: 'Чтобы сравнивать шаги' }, note: { uz: "Bosishlar sanalsa, keyingi qadam oldingisidan ko'p chiqishi mumkin", ru: 'Если считать нажатия, следующий шаг может оказаться больше предыдущего' } },
  { front: { uz: 'Telefon va laptopdan kirgan bitta o\'yinchi nechta brauzer?', ru: 'Один игрок зашёл с телефона и ноутбука. Сколько это браузеров?' }, back: { uz: 'Ikkita', ru: 'Два' }, note: { uz: 'Brauzer ID odamni emas, brauzerni ajratadi', ru: 'ID браузера различает браузер, а не человека' } },
  { front: { uz: 'Dashboard raqamlari qanday yangilanadi?', ru: 'Как обновляются числа дашборда?' }, back: { uz: "Sayt har 5 soniyada Backend'dan so'raydi", ru: 'Сайт каждые 5 секунд спрашивает Backend' }, note: { uz: "Botdagi polling kabi: qayta-qayta so'rash", ru: 'Как polling у бота: спрашивать снова и снова' } },
  { front: { uz: "Nega har soniyada emas, 5 soniyada so'raladi?", ru: 'Почему запрос раз в 5 секунд, а не каждую секунду?' }, back: { uz: "Bu MVP'da 5 soniya tanlandi", ru: 'В этом MVP выбрали 5 секунд' }, note: { uz: "Raqam tez yangilanadi, Backend'ga esa har soniyada so'rov ketmaydi", ru: 'Число обновляется быстро, а в Backend не уходит запрос каждую секунду' } },
  { front: { uz: "Backend sahifaga o'zi yuboradigan usul bormi?", ru: "Есть ли способ, чтобы Backend сам отправлял на страницу?" }, back: { uz: "Bor, lekin bu dashboard'da ishlatilmadi", ru: 'Есть, но в этом дашборде он не использован' }, note: { uz: "Har 5 soniyalik so'rov — sodda yo'l", ru: 'Запрос каждые 5 секунд — простой путь' } },
  { front: { uz: '`GET /hodisalar/sanoq` tokensiz nima qaytaradi?', ru: 'Что возвращает `GET /hodisalar/sanoq` без токена?' }, back: { uz: '401', ru: '401' }, note: { uz: 'Himoya `GET /bandlar` dagi bilan bir xil', ru: 'Защита такая же, как в `GET /bandlar`' } },
  { front: { uz: 'Token eskirsa, dashboard nima qiladi?', ru: 'Что делает дашборд, если токен устарел?' }, back: { uz: "So'rovni to'xtatib, parol so'raydi", ru: 'Останавливает запросы и спрашивает пароль' }, note: { uz: 'Ega tokeni 12 soat amal qiladi', ru: 'Токен владельца действует 12 часов' } },
  { front: { uz: 'Tekshiruvda inkognito oyna nima uchun kerak bo\'ldi?', ru: 'Зачем при проверке понадобилось окно инкогнито?' }, back: { uz: "Saytga yangi brauzer bo'lib kirish uchun", ru: 'Чтобы зайти на сайт новым браузером' }, note: { uz: 'Unda brauzer ID yangi — raqamlar bittaga oshadi', ru: 'В нём новый ID браузера — числа вырастают на один' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); ko'rsatma karta ostida, birinchi bosishgacha, karta yuzi halqada */}
        <div className={cxx('ld-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: fmtCode(tr(c.front)), back: tr(c.back), note: c.note && fmtCode(tr(c.note)) }))} />
          {!bosildi && <p className="ld-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — qolipdan: QYakun (DE-204). CODE STRIKE va arena — jonli o'yin qatlami; uyga vazifa yo'q (P-058: loyiha kuni, ish repo'da) =====
const YAKUN_RECAP = [
  { uz: "Bu darsda dashboard talabida uch qaror bor: nimani sanash, kim ko'rishi, qancha tez-tez yangilanishi.", ru: "На этом уроке в требовании к дашборду три решения: что считать, кто видит, как часто обновлять." },
  { uz: "Har qadamda turli brauzerlar sanalsa, qadamlarni bir-biri bilan solishtirsa bo'ladi.", ru: 'Если на каждом шаге считать разные браузеры, шаги можно сравнивать между собой.' },
  { uz: "«Oxirgi 5 daqiqada» — oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar; ochiq sahifani Backend ko'rmaydi.", ru: '«За последние 5 минут» — разные браузеры, отправившие событие за последние 5 минут; открытую страницу Backend не видит.' },
  { uz: "Sayt raqamlarni har 5 soniyada so'raydi, Backend ularni token bilan beradi.", ru: 'Сайт запрашивает числа каждые 5 секунд, Backend отдаёт их по токену.' }
];
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
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Loyiha kuni tugadi', ru: 'День проекта завершён' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Dashboard jonli: har raqamni <span className="italic" style={{ color: T.accent }}>tushunib o'qiysiz</span>.</>, ru: <>Дашборд живой: каждое число <span className="italic" style={{ color: T.accent }}>вам понятно</span>.</> })}
        cta={<>
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={YAKUN_RECAP.map(tr)}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      >
        <p className="ld-keyingi fade-up">{tr({ uz: <>Keyingi dars — <b>«Ikki variantdan qaysi biri yaxshiroq ishlaydi?»</b>: tugma matnining ikki variantini solishtirasiz, natijasi shu dashboard'da ko'rinadi.</>, ru: <>Следующий урок — <b>«Какой из двух вариантов работает лучше?»</b>: вы сравните два варианта текста кнопки, результат будет виден на этом дашборде.</> })}</p>
      </QYakun>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function LiveDashboardLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, ScreenA1, Screen3, Screen4, ScreenA2, Screen5, ScreenA3, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI — «Maydon» dashboard maketi va yon elementlar (ld-). Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .ld-navbat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: ld-puls 1.8s ease-out infinite; }
        @keyframes ld-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        @keyframes ld-kir { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes ld-pop { from { transform: scale(1.35); } to { transform: none; } }
        /* Dashboard maketi: brauzer ramkasi · katta raqam · uch qadam */
        .ld-dash { position: relative; display: flex; flex-direction: column; min-width: 0; border: 1.5px solid ${T.line}; border-radius: 14px; background: ${T.paper}; box-shadow: 0 14px 30px -20px rgba(${T.shadowBase},0.5); overflow: hidden; container-type: inline-size; }
        .ld-bar { display: flex; align-items: center; gap: 6px; min-height: 36px; padding: 4px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .ld-bar > i { flex: none; width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; }
        .ld-manzil { flex: 1; min-width: 0; margin-left: 6px; padding: 3px 10px; border-radius: 8px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ld-sahifa { display: flex; flex-direction: column; gap: 12px; padding: 14px 16px 16px; }
        .ld-dash-bosh { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
        .ld-dash-bosh b { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px; color: ${T.ink}; }
        .ld-soat { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; }
        .ld-hozir { position: relative; align-self: stretch; display: flex; flex-direction: column; gap: 0; padding: 10px 18px 8px; border-radius: 12px; background: ${T.bg}; transition: box-shadow 0.4s; }
        .ld-hozir-n { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ld-hozir-n i { width: 8px; height: 8px; border-radius: 50%; background: ${T.ok}; }
        .ld-hozir-son { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 46px; line-height: 1.05; color: ${T.ink}; font-variant-numeric: tabular-nums; }
        .ld-bugun { display: flex; flex-direction: column; gap: 6px; }
        .ld-bugun-n { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ld-qadamlar { display: flex; align-items: stretch; gap: 6px; }
        .ld-qadam { position: relative; flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; gap: 2px; padding: 8px 10px; border: 1px solid ${T.line}; border-radius: 10px; background: ${T.paper}; }
        .ld-qadam span { font-size: 12px; font-weight: 600; line-height: 1.25; color: ${T.ink2}; overflow-wrap: anywhere; }
        .ld-qadam b { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 27px; line-height: 1.1; color: ${T.ink}; font-variant-numeric: tabular-nums; }
        i.ld-strelka { position: relative; flex: none; align-self: center; width: 12px; height: 0; border-top: 2px solid ${T.accent}; }
        i.ld-strelka::after { content: ''; position: absolute; right: -3px; top: -6px; border: 5px solid transparent; border-left: 7px solid ${T.accent}; border-right-width: 0; }
        .ld-dash-izoh { font-size: 12px; color: ${T.ink2}; animation: fade-step 0.35s ease-out; }
        .ld-yangilandi { display: inline-flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; animation: fade-step 0.35s ease-out; }
        .ld-yangilandi i { width: 7px; height: 7px; border-radius: 50%; background: ${T.ok}; }
        /* Raqam o'zgardi: bir lahza yashil, ustida «+1» ko'tarilib so'nadi */
        .ld-hozir.yangi::after, .ld-qadam.yangi::after { content: ''; position: absolute; inset: -1px; border-radius: inherit; border: 1.5px solid ${T.ok}; background: ${fon(T.ok, 0.13)}; pointer-events: none; animation: ld-sondi 1.3s ease-out both; }
        .ld-hozir.yangi > b, .ld-qadam.yangi > b { animation: ld-yash 1.3s ease-out both; }
        .ld-plus1 { position: absolute; top: 4px; right: 8px; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 800; color: ${T.ok}; pointer-events: none; animation: ld-plus 1.3s ease-out both; }
        @keyframes ld-sondi { 0%, 55% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes ld-yash { 0% { transform: scale(1.3); color: ${T.ok}; } 25% { transform: none; } 70% { color: ${T.ok}; } 100% { color: ${T.ink}; } }
        @keyframes ld-plus { 0% { opacity: 0; transform: translateY(8px); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(-14px); } }
        /* Kirishda navbat bilan (SABOQ 19: 60–120 ms oraliq) */
        .ld-kirish .ld-bar, .ld-kirish .ld-dash-bosh, .ld-kirish .ld-hozir, .ld-kirish .ld-bugun-n, .ld-kirish .ld-qadam, .ld-kirish .ld-yangilandi { animation: ld-kir 0.45s cubic-bezier(.2,.9,.3,1.1) both; animation-delay: calc(var(--i, 0) * 90ms + 100ms); }
        /* Halqa-taymer: 5 dan 0 gacha */
        .ld-taymer { position: relative; flex: none; display: grid; place-items: center; width: 26px; height: 26px; }
        .ld-taymer svg { position: absolute; inset: 0; }
        .ld-t-iz { fill: none; stroke: ${T.line}; stroke-width: 3; }
        .ld-t-yoy { fill: none; stroke: ${T.accent}; stroke-width: 3; stroke-linecap: round; transition: stroke-dashoffset 1s linear; }
        .ld-t-yoy.qayt { transition: stroke-dashoffset 0.35s ease-out; }
        .ld-taymer b { position: relative; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.accent}; }
        /* Parol formasi (qulf) */
        .ld-qulf-forma { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: 8px 10px; padding: 14px; border: 1px dashed ${T.line}; border-radius: 12px; background: ${T.bg}; animation: fade-step 0.3s ease-out; }
        .ld-qulf-belgi { grid-row: span 2; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: ${T.paper}; }
        .ld-qulf-n { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ld-parol { min-height: 32px; display: flex; align-items: center; padding: 0 10px; border: 1.5px solid ${T.line}; border-radius: 8px; background: ${T.paper}; font-size: 15px; letter-spacing: 2px; color: ${T.ink}; }
        .ld-parol.tola { border-color: ${T.accent}; }
        .ld-kirish-t { grid-column: 2; justify-self: start; padding: 6px 16px; border-radius: 8px; background: ${T.accent}; color: ${T.paper}; font-size: 13px; font-weight: 700; }
        .ld-kirish-t.bos { animation: ld-bos 0.32s ease-out; }
        i.ld-qulf { position: relative; display: inline-block; flex: none; width: 11px; height: 8px; margin-top: 5px; border-radius: 2px; background: ${T.ink2}; vertical-align: middle; }
        i.ld-qulf::before { content: ''; position: absolute; left: 2px; top: -5px; width: 7px; height: 6px; box-sizing: border-box; border: 1.5px solid ${T.ink2}; border-bottom: 0; border-radius: 4px 4px 0 0; }
        i.ld-qulf.yashil { background: ${T.ok}; } i.ld-qulf.yashil::before { border-color: ${T.ok}; }
        i.ld-qulf.qizil { background: ${T.err}; } i.ld-qulf.qizil::before { border-color: ${T.err}; }
        .ld-qulf-belgi i.ld-qulf { transform: scale(1.6); }
        /* 0-ekran: «Oxirgi hodisalar» lentasi va chiziq */
        .ld-s0 { position: relative; }
        .ld-s0 .ld-sahifa { gap: 9px; padding-top: 12px; padding-bottom: 12px; }
        .ld-s0 .ld-hozir-son { font-size: 42px; }
        .ld-s0 .ld-qadam b { font-size: 25px; }
        .ld-s0 .ld-lenta { gap: 4px; padding: 7px 10px; }
        .ld-lenta { display: flex; flex-direction: column; gap: 5px; padding: 8px 10px; border-radius: 10px; }
        .ld-lenta.yopiq { border: 1.5px dashed ${T.line}; }
        .ld-lenta.ochiq { border: 1px solid ${T.line}; background: ${T.paper}; }
        .ld-lenta-n { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ld-lenta-q { display: flex; flex-wrap: wrap; align-items: center; gap: 3px 12px; padding: 4px 10px; border-radius: 8px; font-size: 12px; animation: ld-kir 0.4s cubic-bezier(.2,.9,.3,1.1) both; animation-delay: var(--d, 0s); }
        .ld-lenta-q code { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; }
        .ld-lenta-q.ichida { background: ${T.okFon}; color: ${T.ok}; }
        .ld-lenta-q.tashqari { background: ${T.bg}; color: ${T.ink2}; }
        .ld-lenta-q em { font-style: normal; font-size: 12px; font-weight: 600; }
        svg.ld-chiziq { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
        svg.ld-chiziq path { fill: none; stroke: ${T.ok}; stroke-width: 1.6; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: ld-chiz 0.9s ease-out 0.1s forwards; }
        @keyframes ld-chiz { to { stroke-dashoffset: 0; } }
        .ld-s0.bog .ld-hozir { box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        /* O'yinchi telefoni = sayt: o'lchami barqaror 172×272 (SABOQ 22) */
        .ld-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; }
        .ld-tel-yorliq { font-size: 12px; font-weight: 700; color: ${T.ink2}; padding: 2px 10px; border-radius: 999px; background: ${fon(T.ink, 0.06)}; white-space: nowrap; }
        .ld-telefon { position: relative; width: 172px; height: 272px; display: flex; flex-direction: column; border: 2px solid ${T.ink}; border-radius: 22px; padding: 8px 9px 10px; background: ${T.paper}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.35); overflow: hidden; }
        .ld-tel-manzil { display: flex; align-items: center; justify-content: center; height: 20px; padding: 0 8px; border-radius: 10px; background: ${T.bg}; margin-bottom: 8px; }
        .ld-tel-manzil i { flex: 1; height: 5px; border-radius: 3px; background: ${T.line}; }
        .ld-tel-manzil span { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ld-tel-sahifa { flex: 1; display: flex; flex-direction: column; gap: 7px; animation: fade-step 0.3s ease-out; }
        .ld-tel-sar { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px; color: ${T.ink}; }
        .ld-tel-kun { display: flex; align-items: center; justify-content: space-between; padding: 4px 6px; border-radius: 8px; background: ${T.bg}; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .ld-tel-kun i { font-style: normal; font-size: 13px; color: ${T.ink2}; }
        .ld-kataklar { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; }
        .ld-katak { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; padding: 9px 0; border: 1px solid ${T.line}; border-radius: 9px; background: ${T.bg}; color: ${T.ink}; cursor: pointer; }
        .ld-katak:disabled { cursor: default; }
        .ld-katak.on { background: ${T.accentSoft}; border-color: ${T.accent}; color: ${T.accent}; font-weight: 800; }
        .ld-katak.bos { animation: ld-bos 0.32s ease-out; }
        .ld-katak.ld-navbat { outline-offset: 1px; }
        @keyframes ld-bos { 40% { transform: scale(0.86); } 100% { transform: none; } }
        .ld-tel-uy { flex: 1; display: grid; place-items: center; }
        .ld-ilova { display: flex; flex-direction: column; align-items: center; gap: 6px; font-weight: 700; font-size: 12px; color: ${T.ink}; }
        .ld-ilova i { width: 46px; height: 46px; border-radius: 13px; background: ${T.accent}; }
        .ld-tel-ust > .q-btn { align-self: center; max-width: 200px; }
        /* hodisalar jadvali kartasi */
        .ld-jadval { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border: 1px solid ${T.line}; border-radius: 12px; background: ${T.paper}; min-width: 0; }
        .ld-jadval-n code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .ld-jt { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${T.ink}; }
        .ld-jt th { text-align: left; font-size: 11px; font-weight: 600; color: ${T.ink2}; padding: 3px 8px; border-bottom: 1px solid ${T.line}; white-space: nowrap; }
        .ld-jt td { padding: 6px 8px; border-bottom: 1px solid ${T.line}; white-space: nowrap; }
        .ld-jt td.br { color: ${T.accent}; font-weight: 700; }
        .ld-jt tr.kir td { animation: ld-qator 1.2s ease-out both; }
        @keyframes ld-qator { 0% { opacity: 0; transform: translateX(-10px); background: ${T.okFon}; } 20% { opacity: 1; transform: none; background: ${T.okFon}; } 70% { background: ${T.okFon}; } 100% { background: transparent; } }
        i.ld-jadval-oxir { display: block; height: 1px; }
        /* Ikki sanoq: «Har qator» va «Turli brauzerlar» */
        .ld-sanoq { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border: 1px solid ${T.line}; border-radius: 12px; background: ${T.paper}; }
        .ld-sanoq-q { display: grid; grid-template-columns: minmax(0,1fr); align-items: center; gap: 6px 12px; padding: 9px 12px; border-radius: 10px; background: ${T.bg}; transition: background 0.4s; }
        .ld-sanoq-q.qiz { background: ${T.errFon}; } .ld-sanoq-q.yashil { background: ${T.okFon}; }
        .ld-sanoq-n { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .ld-sanoq-n i { font-style: normal; color: ${T.ok}; margin-right: 6px; }
        .ld-sanoq-c { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .ld-chip { display: inline-flex; align-items: baseline; gap: 6px; padding: 4px 10px; border: 1px solid ${T.line}; border-radius: 8px; background: ${T.paper}; transition: border-color 0.4s; }
        .ld-chip em { font-style: normal; font-size: 12px; font-weight: 600; color: ${T.ink2}; }
        .ld-chip b { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 800; color: ${T.ink}; animation: ld-pop 0.35s cubic-bezier(.3,1.5,.5,1); }
        .ld-chip.qiz { border-color: ${T.err}; } .ld-chip.qiz b { color: ${T.err}; }
        .ld-sanoq-q.yashil .ld-chip { border-color: ${T.ok}; } .ld-sanoq-q.yashil .ld-chip b { color: ${T.ok}; }
        .ld-chip.joyida b { animation: ld-joyida 0.5s ease-out; }
        @keyframes ld-joyida { 0%, 100% { transform: none; } 25% { transform: translateX(-3px); } 50% { transform: translateX(3px); } 75% { transform: translateX(-2px); } }
        i.ld-ul { flex: none; width: 10px; height: 0; border-top: 1.5px solid ${T.ink2}; opacity: 0.55; }
        i.ld-ul.uzuq { width: 20px; border-top: 2px dashed ${T.err}; opacity: 1; }
        .ld-sanoq-x { grid-column: auto; font-size: 12.5px; font-weight: 700; animation: fade-step 0.35s ease-out; }
        .ld-sanoq-q.qiz .ld-sanoq-x { color: ${T.err}; } .ld-sanoq-q.yashil .ld-sanoq-x { color: ${T.ok}; }
        /* Backend qutisi */
        .ld-be { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border: 1.5px solid ${T.line}; border-radius: 12px; background: ${T.paper}; transition: border-color 0.3s; min-width: 0; }
        .ld-be.tok { border-color: ${T.ok}; }
        .ld-be-n { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; color: ${T.ink}; }
        code.ld-be-y { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; padding: 3px 8px; border-radius: 6px; background: ${T.bg}; overflow-wrap: anywhere; }
        .ld-be-plus { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; padding: 2px 9px; border-radius: 7px; background: ${fon(T.ok, 0.14)}; color: ${T.ok}; animation: ld-pop 0.4s cubic-bezier(.3,1.5,.5,1); }
        /* Uchuvchi konvert / nuqta */
        .ld-konvert { position: absolute; z-index: 6; pointer-events: none; transform: translate(-50%,-50%); display: inline-flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; white-space: nowrap; padding: 4px 10px 4px 8px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.accent}; color: ${T.ink}; box-shadow: 0 10px 20px -8px rgba(${T.shadowBase},0.45); animation: ld-uch 850ms cubic-bezier(.45,0,.25,1) both; }
        .ld-konvert.tok { border-color: ${T.ok}; }
        .ld-konvert.javob { border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; }
        .ld-konvert.nuqta { padding: 0; width: 11px; height: 11px; border: 0; border-radius: 50%; background: ${T.accent}; box-shadow: none; }
        i.ld-xat { position: relative; display: inline-block; flex: none; width: 12px; height: 9px; border: 1.5px solid currentColor; border-radius: 2px; color: ${T.accent}; }
        .ld-konvert.javob i.ld-xat { color: ${T.ok}; }
        i.ld-xat::after { content: ''; position: absolute; left: 2.5px; top: -1px; width: 4px; height: 4px; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: rotate(45deg); }
        .ld-konvert i.ld-qulf { margin-top: 4px; }
        @keyframes ld-uch { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.6); } 14% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 84% { opacity: 1; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.55); } }
        .ld-dash.ld-kuz { border-color: ${T.accent}; animation: ld-puls 1.8s ease-out infinite; }
        /* 2-ekran sahnasi: telefon | jadval + sanoq */
        .ld-s2 { position: relative; display: grid; grid-template-columns: 172px minmax(0,1fr); gap: 16px 28px; align-items: start; }
        .ld-s2-ong { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.12fr); gap: 14px; align-items: start; min-width: 0; padding-top: 32px; }
        @media (max-width: 1000px) { .ld-s2-ong { display: flex; flex-direction: column; align-items: stretch; gap: 12px; } }
        /* 4-ekran sahnasi: telefon → Backend ← dashboard */
        .ld-s4 { position: relative; display: grid; grid-template-columns: 172px minmax(150px,0.62fr) minmax(0,1.38fr); gap: 16px 26px; align-items: center; }
        .ld-s4 > .ld-tel-ust { align-self: start; }
        @media (min-width: 861px) { .q-kirish .q-split { grid-template-columns: minmax(0,1.4fr) minmax(0,1fr); } .q-reja .q-split { grid-template-columns: minmax(0,1.55fr) minmax(0,1fr); } }
        /* Amaliyot bloklari: kutilgan natija */
        .ld-ixcham .ld-sahifa { padding: 10px 14px 12px; gap: 9px; }
        .ld-ixcham .ld-hozir { flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; padding: 6px 14px; }
        .ld-ixcham .ld-hozir-son { font-size: 34px; }
        .ld-ixcham .ld-qadam { padding: 6px 9px; }
        .ld-ixcham .ld-qadam b { font-size: 22px; }
        .ld-natija { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .ld-natija.ld-a3 { display: grid; grid-template-columns: 172px minmax(0,1fr); align-items: center; gap: 14px; }
        .ld-mini { display: flex; flex-direction: column; border: 1.5px solid ${T.line}; border-radius: 12px; background: ${T.paper}; overflow: hidden; animation: ld-kir 0.45s ease-out 0.3s both; }
        .ld-401 { display: flex; align-items: center; gap: 9px; padding: 8px 14px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: ${T.err}; }
        p.ld-natija-izoh { margin: 0; font-size: 12px; color: ${T.ink2}; animation: fade-step 0.35s ease-out; }
        p.ld-ortda-izoh { margin: 0; align-self: flex-end; width: calc((100% - clamp(14px,2.4vw,24px)) / 2); font-size: 12.5px; color: ${T.ink2}; }
        .q-blok-t .qcode, .ld-yordam .qcode { white-space: normal; overflow-wrap: anywhere; }
        .ld-satr + .ld-satr { display: block; margin-top: 6px; }
        .ld-goya { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .ld-goya-q { display: grid; grid-template-columns: 124px minmax(0,1fr); align-items: start; gap: 8px; }
        .ld-goya-l { padding-top: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; line-height: 1.3; color: ${T.ink2}; }
        .ld-goya textarea { display: block; width: 100%; min-height: 36px; resize: vertical; font-family: 'Manrope', sans-serif; font-size: 13.5px; line-height: 1.4; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 7px 10px; }
        .ld-goya textarea:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .ld-goya > .q-btn { align-self: flex-start; padding: 6px 12px; font-size: 12.5px; }
        .q-blok-q.joriy:has(.ld-goya[data-tola="0"]) > .q-blok-tana > .q-btn { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
        .ld-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
        .ld-yordam-s { display: block; padding: 7px 10px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; font-size: 13px; line-height: 1.5; }
        .q-blok-xato .q-btn.ld-yordam-btn { padding: 5px 12px; font-size: 12.5px; }
        /* Bashorat: karta yengil ko'tarilib kiradi, variantlar navbat bilan; tanlangach ixcham qatorga yig'iladi */
        .ld-bash .q-bashorat { border-color: ${T.accent}; animation: ld-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both, ld-puls 1.8s ease-out 0.7s infinite; }
        .ld-bash .q-chip { animation: ld-kir 0.38s ease-out both; }
        .ld-bash .q-chip:nth-child(1) { animation-delay: 0.22s; } .ld-bash .q-chip:nth-child(2) { animation-delay: 0.32s; } .ld-bash .q-chip:nth-child(3) { animation-delay: 0.42s; }
        .ld-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; transform-origin: top center; animation: ld-yig 0.42s cubic-bezier(.2,.9,.3,1.1) both; }
        .ld-taxmin-y { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .ld-taxmin-s { font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .ld-taxmin b { font-size: 14px; color: ${T.ink}; }
        @keyframes ld-kot { from { opacity: 0; transform: translateY(14px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes ld-yig { from { opacity: 0.2; transform: scaleY(1.9); } to { opacity: 1; transform: none; } }
        p.ld-joriy { margin: 0; padding: 10px 14px; border-radius: 12px; background: ${T.accentSoft}; color: ${T.ink}; font-size: 14px; line-height: 1.5; }
        .q-xulosa.ld-nb { display: flex; flex-direction: column; gap: 3px; padding: 12px 18px; font-size: 14.5px; line-height: 1.45; }
        .ld-nb-t { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .ld-nb-t b { color: ${T.ink}; } .ld-nb-t.ok { color: ${T.ok}; font-weight: 700; }
        .ld-nb-i { font-weight: 700; color: ${T.ink}; }
        p.ld-repo { margin: 6px 0 0; font-size: 12px; color: ${T.ink2}; }
        p.ld-repo code { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        p.ld-keyingi { margin: 0; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
        p.ld-keyingi b { color: ${T.ink}; }
        .rc-ic .ld-rc-kod { display: inline-block; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(13px,2vw,18px); line-height: 1.4; color: ${CODE.text}; background: ${CODE.bg}; padding: 10px 16px; border-radius: 10px; overflow-wrap: anywhere; }
        /* Kartochkalar: birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma (SABOQ 16) */
        .ld-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: ld-puls 1.6s ease-out infinite; }
        p.ld-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.ld-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* Torroq ekran: sahnalar ustma-ust, telefon o'lchami o'zgarmaydi */
        @media (max-width: 900px) {
          .ld-s4 { grid-template-columns: 172px minmax(0,1fr); }
          .ld-s4 > .ld-dash { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .ld-s2 { grid-template-columns: minmax(0,1fr); }
          .ld-s2 > .ld-tel-ust { justify-self: center; }
          .ld-s2-ong { padding-top: 0; }
          .ld-sanoq-q { grid-template-columns: minmax(0,1fr); }
          .ld-sanoq-x { grid-column: auto; }
          .ld-sanoq-c > i.ld-ul:nth-of-type(2) { display: none; }
          .ld-natija.ld-a3 { grid-template-columns: minmax(0,1fr); }
          .ld-natija.ld-a3 > .ld-tel-ust { justify-self: center; }
          p.ld-ortda-izoh { width: auto; align-self: stretch; }
          .ld-goya-q { grid-template-columns: minmax(0,1fr); gap: 3px; }
          .ld-goya-l { padding-top: 0; }
        }
        @media (max-width: 400px) { .ld-s4 { gap: 14px 12px; } }
        /* Dashboard tor joyda (A3 o'ngi, telefon): raqamlar ixchamroq, matn chegaradan chiqmaydi */
        @container (max-width: 340px) {
          .ld-sahifa { padding: 12px; gap: 10px; }
          .ld-hozir-son { font-size: 38px; }
          .ld-qadamlar { gap: 4px; }
          .ld-qadam { padding: 6px 7px; }
          .ld-qadam span { font-size: 11px; }
          .ld-qadam b { font-size: 21px; }
          i.ld-strelka { width: 7px; }
          .ld-manzil { font-size: 11px; padding: 3px 7px; margin-left: 0; }
          .ld-bar > i { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ld-navbat, .ld-dash.ld-kuz, .ld-dash *, .ld-lenta-q, .ld-katak, .ld-jt td, .ld-chip b, .ld-be-plus, .ld-mini, .ld-bash .q-bashorat, .ld-bash .q-chip, .ld-taxmin, .ld-flash.yangi .fc-card .fc-front, .ld-tel-sahifa { animation: none !important; }
          .ld-dash *::after { animation: none !important; }
          .ld-t-yoy { transition: none; }
          svg.ld-chiziq path { animation: none; stroke-dashoffset: 0; }
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
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); } /* skeletda yo'q edi — ⛶ ishlamasdi (11-Modul seansi, F-1007-290; MEXANIZM-TAKLIF 10) */
        .q-fokus:has(.zoom-on) { animation: none; transform: none; } /* qolip .q-fokus (fill both) transform qoldiradi — yakuniy holatda ⛶ oynasi siljiydi (F-1007-290; MEXANIZM-TAKLIF 12) */
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
