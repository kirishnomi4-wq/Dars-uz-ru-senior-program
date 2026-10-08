import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 12-Modul · 4-dars «Loyiha kuni: jonli xabar va eslatma» (m10-04) — MD v3: feedback/F-1006-12modul/04-LiveNotifyDay-v3.md (GATE M ✓, 04-FILTR).
// Skeletdan (src/skelet/NamunaDars.jsx) qurildi, 07.10.2026. 12 ekran: QKirish · QReja · QTushuncha · Amaliyot 1 · QTest · QTushuncha · Amaliyot 2 · QTest · Amaliyot 3 · podium · QKartochka · QYakun.
// Bitta vizual — JonliSahna (ikki telefon, Backend tuguni, xona doirasi oyin-1). O'qiydi: pm-m10d3-talab.buzilmasin, pm-m9d8-platforma.trek; yangi kalit yozmaydi (tayanch 8).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================
// ru-qoldiq-istisno s3: o'yin

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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm10-04-v1', lessonTitle: { uz: "Loyiha kuni: jonli xabar va eslatma", ru: "День проекта: живое сообщение и напоминание" } };
// 12 ekran (MD v3, loyiha kuni): kirish → reja → tushuncha → Amaliyot 1 → test → tushuncha → Amaliyot 2 → test → Amaliyot 3 → podium → kartochkalar → yakun.
const HW_TOKENS = [
  { t: { uz: 'xona', ru: 'комната' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'jonli xabar', ru: 'живое сообщение' }, l: 64, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'eslatma', ru: 'напоминание' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'test holati', ru: 'тестовый режим' }, l: 74, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'a3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). s4 — B (1), s7 — D (3) (MD ✔, o'zgarmaydi). `practice: -1` — uch blok sentinel (variant yo'q).
const INLINE_KEYS = { s4: 1, s7: 3, practice: -1 };
const rcKod = (s) => <code className="qcode">{s}</code>;
const RcMatn = ({ t }) => <span className="jx-rc-t">{tr(t)}</span>;
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: koddan bitta qator)
const RECAPS = {
  4: {
    title: { uz: 'Ochiq ekranlar sanaladi', ru: 'Считаются открытые экраны' },
    cards: [
      { ic: null, h: { uz: "Ekran ochildi — ilova o'yin xonasiga kiradi.", ru: 'Экран открыт — приложение входит в комнату игры.' }, vis: rcKod('oyin-ochildi') },
      { ic: null, h: { uz: "Xonada — shu o'yin ekrani ochiq ulanishlar.", ru: 'В комнате — соединения, у которых открыт экран этой игры.' }, vis: rcKod('oyin-{id}') },
      { ic: null, h: { uz: "Backend xonadagi ulanishlarni sanab, sonni o'zi yuboradi.", ru: 'Backend считает соединения в комнате и сам отправляет число.' }, vis: rcKod('{ oyinId, soni }'), ask: { uz: "Telefoningiz va sinfdoshingiz telefonida bir xil o'yin ochiq. Son nechta bo'ladi va nega?", ru: 'На вашем телефоне и телефоне одноклассника открыта одна и та же игра. Какое будет число и почему?' } }
    ]
  },
  7: {
    title: { uz: 'Ochiq ilova — jonli xabar, yopiq — eslatma', ru: 'Открытое приложение — живое сообщение, закрытое — напоминание' },
    cards: [
      { ic: null, h: { uz: 'Ilova ochiq — hodisa keladi, tepada jonli xabar chiqadi.', ru: 'Приложение открыто — приходит событие, вверху появляется живое сообщение.' }, vis: rcKod('oyin-ozgardi') },
      { ic: null, h: { uz: "Boshqa odam qilgan o'zgarish jonli xabar bo'lib ko'rinmaydi.", ru: "Изменение, сделанное другим человеком, не появится живым сообщением." }, vis: <RcMatn t={{ uz: 'ilova yopiq', ru: 'приложение закрыто' }} /> },
      { ic: null, h: { uz: "Eslatmani ilova o'zi oldindan qo'yadi, Backend emas.", ru: 'Напоминание заранее ставит само приложение, а не Backend.' }, vis: rcKod('scheduleNotificationAsync'), ask: { uz: "Ilova yopiq paytda o'yinchi joy bo'shaganini qanday bilishi mumkin edi?", ru: 'Как игрок мог бы узнать, что освободилось место, пока приложение закрыто?' } }
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

// ===== BITTA VIZUAL — real vaqt sahnasi JonliSahna (163, 180; tayanch 9.16): bitta manba JONLI_SAHNA + NAMUNA_OYIN + JONLI_XABARLAR + ESLATMA =====
// 0, 1, 2, 5-ekranlar va uch blokning kutilgan natijasi shundan o'qiydi. 2-pilot (WebSocketBasics) sahnasi yo'li bilan — nusxa, import emas.
// qolip-maket: jx-karta jx-orqaga jx-qoshil jx-yopish jx-chiqish jx-soat
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const halqa = (on) => (on ? 'jx-halqa' : undefined);
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Ketma-ket sahna qadamlari: [[kechikish ms, fn], …]; ekran yopilsa taymerlar tozalanadi; reduced-motion — kechikishsiz (DE-200)
function useKetma() {
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  return useCallback((qadamlar) => {
    const kam = kamHarakat();
    let t = 0;
    qadamlar.forEach(([ms, fn]) => { t += kam ? 0 : ms; tm.current.push(setTimeout(fn, t)); });
  }, []);
}
const lsOqi = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };
// O'qituvchi eslatmasi — faqat Mentor rejimida (MD aytgan joyda)
const Ustoz = ({ satrlar }) => {
  const isMentor = useMentorLive();
  if (!isMentor) return null;
  return <div className="jx-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>;
};

const NAMUNA_OYIN = { id: 1, vaqt: { uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' }, joy: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, kerak: 10, xona: 'oyin-1' };
// Jonli xabarlarning besh matni (tayanch 1.4 — so'zma-so'z)
const JONLI_XABARLAR = {
  qoshildi: { uz: "Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10", ru: 'Суббота, 18:00 — присоединился ещё один игрок: 9 / 10' },
  chiqdi: { uz: "Shanba, 18:00 — joy bo'shadi: 8 / 10", ru: 'Суббота, 18:00 — освободилось место: 8 / 10' },
  toldi: { uz: "Shanba, 18:00 — o'yin to'ldi: 10 / 10", ru: 'Суббота, 18:00 — игра заполнена: 10 / 10' },
  tasdiqladi: { uz: 'Shanba, 18:00 — kelishini tasdiqladi: 8 / 9', ru: 'Суббота, 18:00 — подтвердили приход: 8 / 9' },
  navbatdan: { uz: "Navbatdan o'yinga o'tdingiz: Shanba, 18:00", ru: 'Вы перешли из очереди в игру: Суббота, 18:00' }
};
// Mentor eslatmasi: o'yindan bir soat oldin (oldin — daqiqa)
// «Maydon Jamoa» nomi — 11-Modul tayanch 9.62 yashili (PM palitrasining ok yashilidan farqli; F-1006-389)
const MAYDON_RANG = '#2E9E4F';
const ESLATMA = { sarlavha: 'Maydon Jamoa', matn: { uz: 'Bugun, 18:00 · Mahalla maydoni', ru: 'Сегодня, 18:00 · Поле махалли' }, oldin: 60 };
const JONLI_SAHNA = {
  t1: { uz: '1-telefon · siz', ru: 'Телефон 1 · вы' },
  t2: { uz: "2-telefon · boshqa o'yinchi", ru: 'Телефон 2 · другой игрок' },
  nom: 'Maydon Jamoa',
  backend: 'Backend',
  orqa: { uz: "‹ O'yinlar", ru: '‹ Игры' },
  oyinlar: { uz: "O'yinlar", ru: 'Игры' },
  kun: { uz: 'Shanba', ru: 'Суббота' },
  qoshil: { uz: "Qo'shilaman", ru: 'Присоединяюсь' },
  qoshildi: { uz: "Qo'shildingiz", ru: 'Вы присоединились' },
  chiqish: { uz: "O'yindan chiqish", ru: 'Выйти из игры' },
  korayapti: { uz: "Hozir ko'ryapti:", ru: 'Сейчас смотрят:' },
  kv: { sorov: { uz: "so'rov", ru: 'запрос' }, javob: { uz: 'javob', ru: 'ответ' } }
};

const Qadam = ({ q }) => (q ? <span className="jx-qadam fade-step"><i>{q.n}</i>{tr(q.t)}</span> : null);
const EslatmaKarta = ({ yorliq }) => (
  <div className="jx-eslatma">
    <b className="jx-es-nom">{ESLATMA.sarlavha}</b>
    <span className="jx-es-m">{tr(ESLATMA.matn)}</span>
    {yorliq && <em className="jx-es-y">{tr(yorliq)}</em>}
  </div>
);
// Telefon ichidagi ekranlar: oyin · oyinlar · yopiq (ilova yopiq — telefon ekrani, soat va ilova belgisi)
const TelEkran = ({ t }) => {
  const ekran = t.ekran || 'oyin';
  if (ekran === 'yopiq') return (
    <div className="jx-qulf">
      <span className="jx-qulf-soat"><b key={t.soat || '16:59'} className={cx(t.soatYangi && 'jx-pop')}>{t.soat || '16:59'}</b></span>
      <span className="jx-qulf-kun">{tr(JONLI_SAHNA.kun)}</span>
      {t.eslatma && <EslatmaKarta yorliq={t.eslatmaYorliq} />}
      <span className="jx-ilova"><span className="jx-ilova-sh" aria-hidden="true" /><span className="jx-ilova-t">{JONLI_SAHNA.nom}</span></span>
    </div>
  );
  if (ekran === 'oyinlar') return (
    <div className="jx-oyinlar">
      <b className="jx-ol-sar">{tr(JONLI_SAHNA.oyinlar)}</b>
      <span className="jx-kun">{tr(JONLI_SAHNA.kun)}</span>
      <button type="button" className={cx('jx-karta', halqa(t.kartaHalqa))} disabled={!t.onKarta} onClick={t.onKarta}>
        <b>{tr(NAMUNA_OYIN.vaqt)}</b><span>{tr(NAMUNA_OYIN.joy)}</span>
        <span className="jx-karta-son"><b key={t.son ?? 8} className={cx(t.sonYangi && 'jx-pop')}>{t.son ?? 8}</b> / 10</span>
      </button>
    </div>
  );
  return (
    <div className="jx-oyin">
      <button type="button" className={cx('jx-orqaga', halqa(t.orqaHalqa))} disabled={!t.onOrqa} onClick={t.onOrqa}>{tr(JONLI_SAHNA.orqa)}</button>
      <b className="jx-oyin-sar">{tr(NAMUNA_OYIN.vaqt)}</b>
      <span className="jx-oyin-joy">{tr(NAMUNA_OYIN.joy)}</span>
      <span className="jx-hisob"><b key={t.son ?? 8} className={cx('jx-son', t.sonYangi && 'jx-pop')}>{t.son ?? 8}</b> / 10</span>
      {t.korayapti != null && <span className="jx-kor fade-step">{tr(JONLI_SAHNA.korayapti)} <b key={t.korayapti} className={cx(t.korYangi && 'jx-pop')}>{t.korayapti}</b></span>}
      <span className="jx-oyin-past">
        {!t.qoshilYoq && <button type="button" className={cx('jx-qoshil', t.qoshildi && 'off', halqa(t.qoshilHalqa))} disabled={!t.onQoshil || t.qoshildi} onClick={t.onQoshil}>{tr(t.qoshildi ? JONLI_SAHNA.qoshildi : JONLI_SAHNA.qoshil)}</button>}
        {t.chiqish && <button type="button" className={cx('jx-chiqish', halqa(t.chiqishHalqa))} disabled={!t.onChiqish} onClick={t.onChiqish}>{tr(JONLI_SAHNA.chiqish)}</button>}
      </span>
    </div>
  );
};
// Telefon — o'lchami barqaror 172×272 (SABOQ 22), yorliq ramka ustida (SABOQ 23), nom o'z rangida (logotip yo'q, D4).
// Jonli xabar — ilova ichida, tepadan tushadi va bir necha soniyadan keyin ko'tariladi (jonli / jonliKet); eslatma — telefon ekranida qoladi.
const Telefon = ({ no = 1, t = {} }) => (
  <div className="jx-tel-ust">
    {t.tex ? <span className="jx-tel-yorliq tex">{t.tex}</span> : <span className={cx('jx-tel-yorliq', no === 1 ? 'b1' : 'b2')}>{tr(no === 1 ? JONLI_SAHNA.t1 : JONLI_SAHNA.t2)}</span>}
    <div className={cx('jx-telefon', t.ekran === 'yopiq' && 'yopiq')}>
      {t.ekran !== 'yopiq' && <div className="jx-tel-bar"><span className="jx-tel-nom">{JONLI_SAHNA.nom}</span></div>}
      <div className="jx-tel-ekran" key={t.ekran || 'oyin'}>
        <TelEkran t={t} />
        {t.ruxsat && <div className="jx-ruxsat fade-step" aria-hidden="true"><i className="jx-rx-q uzun" /><i className="jx-rx-q" /><i className="jx-rx-q qisqa" /><span className="jx-rx-t"><i /><i /></span></div>}
      </div>
      {t.jonli && t.ekran !== 'yopiq' && <div className={cx('jx-jonli', t.jonliKet && 'ket')} role="status"><b>{JONLI_SAHNA.nom}</b><span>{tr(t.jonli)}</span></div>}
    </div>
    {t.osti}
    <Qadam q={t.qadam} />
  </div>
);
// Xona doirasi Backend ichida: yorlig'i oyin-1, ichida ulanish nuqtalari (kirgan — accent bir lahza, chiqqan — so'nadi)
const XonaDoira = ({ nuqtalar }) => (
  <div className="jx-xona">
    <span className="jx-xona-y">{NAMUNA_OYIN.xona}</span>
    <span className="jx-xona-n">{nuqtalar.map(n => <i key={n.id} className={cx('jx-nuqta', n.h)} />)}</span>
  </div>
);
const BackendTugun = ({ b = {} }) => (
  <div className="jx-be-ust">
    <div className="jx-be-joy">
      {b.ustida && <div className="jx-be-yuqori">{b.ustida}</div>}
      <div className={cx('jx-backend', b.yon && 'yon')}>
        <span className="jx-be-nom">{JONLI_SAHNA.backend}</span>
        {b.db != null && <span className="jx-db">Database: <b key={b.db} className={cx(b.dbYangi && 'jx-pop')}>{b.db}</b></span>}
        {b.xona && <XonaDoira nuqtalar={b.xona} />}
      </div>
    </div>
    {b.osti}
  </div>
);
// Konvert chiziq bo'ylab uchadi: yon 'be' — telefondan Backend'ga, 'tel' — Backend'dan telefonga; yorlig'i — hodisa nomi va ma'lumoti
const Konvert = ({ k, no, tik }) => {
  if (!k) return null;
  const telBosh = tik || no === 1;
  const ab = telBosh ? k.yon === 'be' : k.yon !== 'be';
  const anim = `jx-kv-${tik ? 'y' : 'x'}-${ab ? 'ab' : 'ba'}`;
  return (
    <span className={cx('jx-kv', k.tur)} style={{ animationName: anim }}>
      <i className="jx-kv-i" />
      <b className="jx-kv-y">{k.nom ? <>{k.nom}{k.mal && <em>{k.mal}</em>}</> : tr(JONLI_SAHNA.kv[k.tur])}</b>
    </span>
  );
};
// Chiziq holatlari: yoq · ochiq (sekin yonib turadi) · xira (ilova yopiq — yorliqsiz, 04-FILTR 1); ikkinchi — nuqtali kulrang yo'l
const Chiziq = ({ holat = 'yoq', no, tik, k, yorliq, ikkinchi }) => (
  <div className={cx('jx-chiziq', tik ? 'tik' : 'yot', `n${no}`, `h-${holat}`)}>
    <span className="jx-chiziq-i" key={holat} />
    {yorliq && <b className="jx-chiziq-y fade-step">{tr(yorliq)}</b>}
    {ikkinchi && <span className="jx-ikkinchi fade-step"><i /><b>{tr(ikkinchi)}</b></span>}
    <Konvert key={k ? k.id : 'yoq'} k={k} no={no} tik={tik} />
  </div>
);
// JonliSahna: chapda «1-telefon · siz», o'rtada Backend (Database + xona doirasi), o'ngda «2-telefon · boshqa o'yinchi».
// Telefonda (yoki ixcham) — telefonlar tepada yonma-yon, Backend pastda, chiziqlar tik.
const JonliSahna = ({ t1, t2, be, c1, c2, k1, k2, y1, y2, i1, ixcham }) => {
  const mob = useIsMobile(640);
  const tik = !!(ixcham || mob);
  const ikki = !!t2;
  return (
    <div className={cx('jx-sahna', tik ? 'tik' : 'yot', ikki ? 'ikki' : 'bir', !be && 'bes')}>
      <div className={cx('jx-s-t1', be && `h-${c1 || 'yoq'}`)}><Telefon no={1} t={t1} /></div>
      {be && <div className="jx-s-c1"><Chiziq holat={c1} no={1} tik={tik} k={k1} yorliq={y1} ikkinchi={i1} /></div>}
      {be && <div className="jx-s-be"><BackendTugun b={be} /></div>}
      {ikki && be && <div className="jx-s-c2"><Chiziq holat={c2} no={2} tik={tik} k={k2} yorliq={y2} /></div>}
      {ikki && <div className={cx('jx-s-t2', be && `h-${c2 || 'yoq'}`)}><Telefon no={2} t={t2} /></div>}
    </div>
  );
};

// Ballsiz bashorat: tanlangach ixcham qator bo'lib natijagacha turadi (SABOQ 11); har chipning o'z yengil chegarasi (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="jx-halqa-g"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="jx-bash-ix fade-step"><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosaning birinchi kichik qatori (E 42): tanlangan javob qaytarilmaydi
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="jx-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="jx-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: "на самом деле" })}: <b>{tx(haqiqat)}</b></span>);
// Bitta yashil quti: taxmin qatori · xulosa · izoh (QIzoh — shu qutining oxirgi kichik qatori, E 42)
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="jx-x-m">{matn}</span>{izoh && <span className="jx-x-iz">{izoh}</span>}</>;
const QADAMLAR_Y = { uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' };
const navYorliq = (taxmin, q, jami, done) => (done ? { uz: 'Davom etish', ru: 'Продолжить' }
  : !taxmin ? BASH_YORLIQ
    : { uz: `${QADAMLAR_Y.uz} (${q}/${jami})`, ru: `${QADAMLAR_Y.ru} (${q}/${jami})` });

// ===== SCREEN 0 — KIRISH (QKirish: bitta telefon, ilova yopiq 16:59; javobdan keyin 17:00 → eslatma tushadi → «Qo'shildingiz» kartasiga uzuq chiziq) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Backend — o'yindan oldin telefonga yozadi", ru: 'Backend — пишет на телефон перед игрой' } },
  { id: 'b', label: { uz: "Ilova — qo'shilganda vaqtini oldindan qo'yadi", ru: 'Приложение — при присоединении заранее ставит время' } },
  { id: 'c', label: { uz: "Hech kim — ilovani o'zingiz ochib ko'rasiz", ru: 'Никто — вы сами откроете приложение и посмотрите' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Bu misolda ilova «Qo'shilaman» bosilganda eslatmani o'yindan bir soat oldinga qo'yib qo'yadi.</>, ru: <><b>Именно!</b> В этом примере приложение при нажатии «Присоединяюсь» ставит напоминание за час до игры.</> },
  a: { uz: <><b>Qiziq fikr!</b> Backend yuboradigan eslatma ham bor, u alohida sozlashni talab qiladi. Bu misolda vaqtni ilova qo'yadi.</>, ru: <><b>Интересная мысль!</b> Есть и напоминание, которое отправляет Backend, — оно требует отдельной настройки. В этом примере время ставит приложение.</> },
  c: { uz: <><b>Qiziq fikr!</b> 11-Modulda shunday edi: roadmap'da eslatma keyinroqqa qoldirilgan. Bugun u quriladi.</>, ru: <><b>Интересная мысль!</b> Так было в 11-м модуле: в roadmap напоминание отложили на потом. Сегодня мы его построим.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [soat, setSoat] = useState(avval ? '17:00' : '16:59');
  const [eslatma, setEslatma] = useState(avval);
  const [chiziq, setChiziq] = useState(avval);
  const [sc, setSc] = useState(0);
  const ketma = useKetma();
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); setSc(n => n + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    ketma([[500, () => setSoat('17:00')], [500, () => setEslatma(true)], [700, () => setChiziq(true)]]);
  };
  const javob = picked !== null;
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!javob} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('jx-k', !javob && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Ilovani yopgan bo'lsangiz, o'yinni sizga <span className="italic" style={{ color: T.accent }}>kim eslatadi</span>?</>, ru: <>Приложение закрыто — <span className="italic" style={{ color: T.accent }}>кто напомнит</span> вам об игре?</> })}
          mentor={<Mentor>{javob
            ? tr({ uz: "Telefon ekraniga qarang, keyin «Davom etish»ni bosing.", ru: 'Посмотрите на экран телефона, затем нажмите «Продолжить».' })
            : tr({ uz: "Mentor misolida siz Shanba 18:00 dagi o'yinga qo'shilgansiz, telefon esa cho'ntakda — avval javobni tanlang.", ru: 'В примере Ментора вы присоединились к игре в субботу в 18:00, а телефон в кармане — сначала выберите ответ.' })}</Mentor>}
          maket={<div className="jx-k0">
            <Telefon no={1} t={{ ekran: 'yopiq', soat, soatYangi: soat === '17:00' && !avval, eslatma,
              osti: <span className="jx-qk">{tr(NAMUNA_OYIN.vaqt)} · <b>{tr(JONLI_SAHNA.qoshildi)}</b></span> }} />
            {chiziq && <span className="jx-uzuq" aria-hidden="true"><b>{tr({ uz: "qo'shilganda qo'yilgan", ru: 'поставлено при присоединении' })}</b></span>}
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={javob && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda tayyor holat bir marta o'zi yuradi — «O'yin» → jonli xabar → ilova yopiladi → 17:00 eslatma; o'ngda 3 qadam, tegsiz) =====
const REJA = [
  { t: { uz: "O'yin ekrani: hozir u nechta qurilmada ochiq", ru: 'Экран игры: на скольких устройствах он сейчас открыт' } },
  { t: { uz: "Ilova ochiq: o'zgarish tepada qisqa xabar bo'lib chiqadi", ru: 'Приложение открыто: изменение появляется сверху коротким сообщением' } },
  { t: { uz: "Ilova yopiq: o'yindan bir soat oldin telefonga eslatma", ru: 'Приложение закрыто: напоминание на телефон за час до игры' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [f, setF] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1100, () => setF(1)], [2800, () => setF(2)], [400, () => setF(3)], [900, () => setF(4)], [900, () => setF(5)]]); }, []); // eslint-disable-line
  const yopiq = f >= 4;
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Dars oxirida ilovangiz <span className="italic" style={{ color: T.accent }}>foydalanuvchini xabardor qiladi</span>.</>, ru: <>К концу урока приложение <span className="italic" style={{ color: T.accent }}>известит пользователя</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingizda qurasiz. Talabni har blokda ko'proq o'zingiz yozasiz.", ru: "Каждый шаг вы сначала увидите на примере Maydon Jamoa, потом построите в своём продукте. С каждым блоком вы всё больше пишете требование сами." })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="jx-reja-chap"><JonliSahna t1={yopiq
          ? { ekran: 'yopiq', soat: f >= 5 ? '17:00' : '16:59', soatYangi: f >= 5, eslatma: f >= 5 }
          : { ekran: 'oyin', son: f >= 1 ? 9 : 8, sonYangi: f >= 1, korayapti: 2, qoshilYoq: true, jonli: f >= 1 && f < 3 ? JONLI_XABARLAR.qoshildi : null, jonliKet: f === 2 }} /></div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t) }))}
      >
        <p className="jx-reja-past">{tx({ uz: "repo `maydon-jamoa` · boshlang'ich holat `m12-dars-04-start` · namuna `m12-dars-04-done`", ru: 'репозиторий `maydon-jamoa` · начальное состояние `m12-dars-04-start` · образец `m12-dars-04-done`' })}</p>
        <p className="jx-reja-past2">{tr({ uz: "«Maydon Jamoa» — namuna; bloklarni o'z mahsulotingizda bajarasiz. Web-trekda 3-qadamda — saytdagi «Xabarlar» tasmasi.", ru: '«Maydon Jamoa» — образец; блоки вы выполняете в своём продукте. В веб-треке на 3-м шаге — лента «Xabarlar» на сайте.' })}</p>
        <Ustoz satrlar={[
          { uz: "Darsning og'ir qismi — Amaliyot 1 (Backend o'zgaradi, Render kutiladi) va Amaliyot 3 (telefon ruxsati). Telefonda eslatma ruxsat oynasi va Android'dagi ko'rinishi pilotda sinaladi — o'quvchida chiqmasa, bu uning xatosi emas.", ru: "Сложная часть урока — Практика 1 (меняется Backend, ждём Render) и Практика 3 (разрешение телефона). Окно разрешения напоминаний и вид на Android проверяются в пилоте — если у ученика не появится, это не его ошибка." },
          { uz: "Uchish rejimi va uzilish bu darsda tekshirilmaydi (5-darsning ishi; o'quvchiga aytilmaydi). Mentor repo'sidagi `m12-dars-04-done` qayta ulanishni maxsus boshqarmaydi.", ru: 'Режим полёта и обрыв на этом уроке не проверяются (задача 5-го урока; ученику не говорим). `m12-dars-04-done` в репозитории Ментора специально не управляет переподключением.' }
        ]} />
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · xona (bashorat + 2 qadam): 2-telefon o'yinni ochadi → oyin-ochildi → nuqta xonaga → ikkala son 2; «‹ O'yinlar» → nuqta chiqadi → faqat 1-telefon son 1 =====
const S2_TAXMIN = [{ k: 'ozgarmaydi', t: { uz: "O'zgarmaydi", ru: 'Не изменится' } }, { k: 'tortsa', t: { uz: "Pastga tortganda o'zgaradi", ru: "Изменится, если потянуть вниз" } }, { k: 'ozi', t: { uz: "O'zi 2 ga o'tadi", ru: 'Само станет 2' } }];
const NUQTA_A = { id: 'a', h: '' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [ekran2, setEkran2] = useState('oyinlar');
  const [xona, setXona] = useState([NUQTA_A]);
  const [kor1, setKor1] = useState(1);
  const [kor2, setKor2] = useState(null);
  const [yangi, setYangi] = useState(false);
  const [k1, setK1] = useState(null);
  const [k2, setK2] = useState(null);
  const [y2, setY2] = useState(avval ? { uz: 'xonada emas', ru: 'не в комнате' } : null);
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1100, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const och = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setEkran2('oyin'); setYangi(false);
    ketma([[350, () => setK2({ id: 'och', tur: 'hodisa', yon: 'be', nom: 'oyin-ochildi', mal: '{ oyinId: 1 }' })],
      [950, () => { setK2(null); setXona([NUQTA_A, { id: 'b', h: 'kirdi' }]); }],
      [600, () => { setK1({ id: 'k1', tur: 'hodisa', yon: 'tel', nom: 'korayotganlar-ozgardi', mal: '{ oyinId: 1, soni: 2 }' }); setK2({ id: 'k2', tur: 'hodisa', yon: 'tel', nom: 'korayotganlar-ozgardi', mal: '{ oyinId: 1, soni: 2 }' }); }],
      [950, () => { setK1(null); setK2(null); setKor1(2); setKor2(2); setYangi(true); }],
      [300, () => { setQ(1); setBand(false); }]]);
  };
  const orqaga = () => {
    if (q !== 1 || band) return;
    setBand(true); setEkran2('oyinlar'); setKor2(null); setYangi(false);
    ketma([[350, () => setK2({ id: 'yop', tur: 'hodisa', yon: 'be', nom: 'oyin-yopildi', mal: '{ oyinId: 1 }' })],
      [950, () => { setK2(null); setXona([NUQTA_A, { id: 'b', h: 'chiqdi' }]); }],
      [500, () => { setK1({ id: 'k3', tur: 'hodisa', yon: 'tel', nom: 'korayotganlar-ozgardi', mal: '{ oyinId: 1, soni: 1 }' }); setY2({ uz: 'xonada emas', ru: 'не в комнате' }); }],
      [950, () => { setK1(null); setKor1(1); setYangi(true); setXona([NUQTA_A]); }],
      [300, () => { setQ(2); setBand(false); }]]);
  };
  const mentor = !taxmin || q === 0 ? { uz: "Avval taxminingizni belgilang, keyin 2-telefonda Shanba 18:00 o'yinini oching.", ru: 'Сначала отметьте предположение, затем на телефоне 2 откройте игру в субботу в 18:00.' }
    : q === 1 ? { uz: "Endi 2-telefonda «‹ O'yinlar» ni bosib, ro'yxatga qayting.", ru: "Теперь на телефоне 2 нажмите «‹ Игры» и вернитесь к списку." }
      : { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · xona', ru: 'Понятие · комната' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>O'yin ekrani hozir <span className="italic" style={{ color: T.accent }}>nechta qurilmada</span> ochiq?</>, ru: <><span className="italic" style={{ color: T.accent }}>На скольких устройствах</span> сейчас открыт экран игры?</> })}
        mentor={<Mentor>{tr(mentor)}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "2-telefon o'yinni ochsa, 1-telefondagi son nima bo'ladi?", ru: 'Если телефон 2 откроет игру, что станет с числом на телефоне 1?' }} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="jx-viz">
          <JonliSahna
            t1={{ ekran: 'oyin', son: 8, korayapti: kor1, korYangi: yangi && !avval, qoshildi: true, onQoshil: null }}
            be={{ db: 8, xona }}
            t2={{ ekran: ekran2, son: 8, korayapti: ekran2 === 'oyin' ? kor2 : null, korYangi: yangi, qoshilYoq: true,
              onKarta: taxmin && q === 0 && !band ? och : null, kartaHalqa: taxmin && q === 0 && !band,
              onOrqa: q === 1 && !band ? orqaga : null, orqaHalqa: q === 1 && !band,
              qadam: tugadi ? null : (taxmin && q === 0 && !band ? { n: 1, t: { uz: "O'yinni oching", ru: 'Откройте игру' } } : q === 1 && !band ? { n: 2, t: { uz: "Ro'yxatga qayting", ru: 'Вернитесь к списку' } } : null) }}
            c1="ochiq" c2="ochiq" k1={k1} k2={k2} y2={y2} />
          {q >= 1 && <p className="jx-nom fade-step">{tr({ uz: <>Backend'dagi ulanishlar guruhi — <b>xona</b>: hodisa faqat shu guruhdagilarga boradi.</>, ru: <>Группа соединений в Backend — <b>комната</b>: событие идёт только тем, кто в этой группе.</> })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'ozi'} haqiqat={{ uz: "o'zi 2 ga o'tadi", ru: 'само становится 2' }} />}
          matn={tr({ uz: "Bu misolda son — o'yin ekranini hozir ochib turgan ulanishlar: odamlar emas, ochiq ekranlar sanaladi.", ru: 'В этом примере число — соединения, у которых сейчас открыт экран игры: считаются не люди, а открытые экраны.' })}
          izoh={tr({ uz: "Bu son Database'da yo'q — shuning uchun bu hodisa sonning o'zini olib keladi.", ru: 'Этого числа нет в Database — поэтому это событие приносит само число.' })} />}
      >
        <Ustoz satrlar={[{ uz: "Son — xonadagi ulanishlar; odatda har ochiq o'yin ekrani bittadan ulanish beradi.", ru: 'Число — соединения в комнате; обычно каждый открытый экран игры даёт одно соединение.' }]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s4 = 1, B) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Bitta o'yinchi o'yinni telefoni va planshetida ochdi. «Hozir ko'ryapti» qanchaga oshadi?"
    question={tr({ uz: <h2 className="title h-ask">Bitta o'yinchi o'yinni telefoni va planshetida ochdi. «Hozir ko'ryapti» <span className="italic" style={{ color: T.accent }}>qanchaga oshadi</span>?</h2>, ru: <h2 className="title h-ask">Один игрок открыл игру на телефоне и планшете. <span className="italic" style={{ color: T.accent }}>На сколько вырастет</span> «Сейчас смотрят»?</h2> })}
    options={[
      { uz: 'Bittaga — bitta odam bir marta sanaladi', ru: 'На одно — один человек считается один раз' },
      { uz: 'Ikkiga — har ochiq ekran alohida sanaladi', ru: 'На два — каждый открытый экран считается отдельно' },
      { uz: "Oshmaydi — bu son Database'dan keladi", ru: 'Не вырастет — это число приходит из Database' },
      { uz: "Ikkiga — ikkala qurilma o'yinga qo'shiladi", ru: 'На два — оба устройства присоединяются к игре' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Ochiq ekranlar sanaladi: ikki qurilma — ikki ulanish.', ru: 'Считаются открытые экраны: два устройства — два соединения.' }}
    explainWrong={{
      0: { uz: 'Son odamlarni sanaydimi yoki ochiq ekranlarni?', ru: 'Число считает людей или открытые экраны?' },
      2: { uz: "Bu son Database'da bormidi? Uni kim sanaydi?", ru: 'Было ли это число в Database? Кто его считает?' },
      3: { uz: "O'yinni ochish va «Qo'shilaman»ni bosish — bir ishmi?", ru: "Открыть игру и нажать «Присоединяюсь» — одно и то же?" },
      default: { uz: 'Son odamlarni sanaydimi yoki ochiq ekranlarni?', ru: 'Число считает людей или открытые экраны?' }
    }} />
);

// ===== SCREEN 5 — TUSHUNCHA · ochiq va yopiq (bashorat + 4 qadam, navbat bilan): jonli xabar → ilova yopiladi → «joy bo'shadi» ko'rinmaydi → 17:00 eslatma =====
const S5_TAXMIN = [{ k: 'ha', t: { uz: 'Ha, telefon ekranida chiqadi', ru: 'Да, появится на экране телефона' } }, { k: 'yoq', t: { uz: "Yo'q, ko'rinmaydi", ru: 'Нет, не будет видно' } }];
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 4 : 0);
  const [band, setBand] = useState(false);
  const [db, setDb] = useState(8);
  const [dbYangi, setDbYangi] = useState(false);
  const [son1, setSon1] = useState(avval ? 9 : 8);
  const [son2, setSon2] = useState(8);
  const [qoshildi2, setQoshildi2] = useState(false);
  const [ekran1, setEkran1] = useState(avval ? 'yopiq' : 'oyinlar');
  const [soat, setSoat] = useState(avval ? '17:00' : '16:59');
  const [k1, setK1] = useState(null);
  const [k2, setK2] = useState(null);
  const [jonli, setJonli] = useState(null);
  const [jonliKet, setJonliKet] = useState(false);
  const [korinmadi, setKorinmadi] = useState(avval);
  const [eslatma, setEslatma] = useState(avval);
  const ketma = useKetma();
  const done = q >= 4;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const qoshil = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setK2({ id: 's1', tur: 'sorov', yon: 'be' });
    ketma([[950, () => { setK2(null); setDb(9); setDbYangi(true); setSon2(9); setQoshildi2(true); }],
      [450, () => setK1({ id: 'h1', tur: 'hodisa', yon: 'tel', nom: 'oyin-ozgardi', mal: 'qoshildi' })],
      [950, () => setK1({ id: 's2', tur: 'sorov', yon: 'be' })],
      [900, () => setK1({ id: 'j2', tur: 'javob', yon: 'tel' })],
      [900, () => { setK1(null); setSon1(9); setJonli(JONLI_XABARLAR.qoshildi); setJonliKet(false); }],
      [2800, () => setJonliKet(true)],
      [450, () => { setJonli(null); setJonliKet(false); setQ(1); setBand(false); }]]);
  };
  const yop = () => {
    if (q !== 1 || band) return;
    setBand(true); setEkran1('yopiq');
    ketma([[600, () => { setQ(2); setBand(false); }]]);
  };
  const chiq = () => {
    if (q !== 2 || band) return;
    setBand(true); setK2({ id: 's3', tur: 'sorov', yon: 'be' });
    ketma([[950, () => { setK2(null); setDb(8); setDbYangi(true); setSon2(8); setQoshildi2(false); }],
      [500, () => setKorinmadi(true)],
      [400, () => { setQ(3); setBand(false); }]]);
  };
  const otkaz = () => {
    if (q !== 3 || band) return;
    setBand(true); setSoat('17:00');
    ketma([[550, () => setEslatma(true)], [700, () => { setQ(4); setBand(false); }]]);
  };
  const mentor = !taxmin || q === 0 ? { uz: "Avval taxminingizni belgilang, keyin 2-telefonda «Qo'shilaman»ni bosing.", ru: "Сначала отметьте предположение, затем на телефоне 2 нажмите «Присоединяюсь»." }
    : q === 1 ? { uz: "Endi 1-telefondagi «Ilovani yopish»ni bosing.", ru: 'Теперь нажмите «Закрыть приложение» у телефона 1.' }
      : q === 2 ? { uz: "2-telefonda «O'yindan chiqish»ni bosing va 1-telefonga qarang.", ru: "На телефоне 2 нажмите «Выйти из игры» и посмотрите на телефон 1." }
        : q === 3 ? { uz: "Endi «17:00 ga o'tkazish»ni bosing va 1-telefonga qarang.", ru: 'Теперь нажмите «Перевести на 17:00» и посмотрите на телефон 1.' }
          : { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' };
  const qadam = (n) => (!tugadi && taxmin && q === n - 1 && !band ? {
    1: { n: 1, t: { uz: "Qo'shiling", ru: 'Присоединитесь' } }, 2: { n: 2, t: { uz: 'Ilovani yoping', ru: 'Закройте приложение' } },
    3: { n: 3, t: { uz: "O'yindan chiqing", ru: 'Выйдите из игры' } }, 4: { n: 4, t: { uz: 'Soatni suring', ru: 'Переведите часы' } } }[n] : null);
  const t1osti = <>
    {!tugadi && <button type="button" className={cx('jx-yopish', q < 1 && 'xira', halqa(q === 1 && !band))} disabled={q !== 1 || band} onClick={yop}>{tr({ uz: 'Ilovani yopish', ru: 'Закрыть приложение' })}</button>}
    {korinmadi && <span className="jx-korinmadi fade-step">{tr({ uz: "jonli xabar ko'rinmadi", ru: "живое сообщение не появилось" })}</span>}
  </>;
  const beOsti = !tugadi && <div className="jx-soat-q">
    <Qadam q={qadam(4)} />
    <span className="jx-soat-k"><b key={soat} className={cx(soat === '17:00' && 'jx-pop')}>{soat}</b></span>
    <button type="button" className={cx('jx-soat', q < 3 && 'xira', halqa(q === 3 && !band))} disabled={q !== 3 || band} onClick={otkaz}>{tr({ uz: "17:00 ga o'tkazish", ru: 'Перевести на 17:00' })}</button>
  </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ochiq va yopiq', ru: 'Понятие · открыто и закрыто' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 4, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ilova ochiq va yopiq: o'zgarish sizga <span className="italic" style={{ color: T.accent }}>qanday yetadi</span>?</>, ru: <>Открыто и закрыто: как изменение <span className="italic" style={{ color: T.accent }}>дойдёт до вас</span>?</> })}
        mentor={<Mentor>{tr(mentor)}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "Ilova yopiq paytda joy bo'shasa, bu telefoningizda ko'rinadimi?", ru: 'Если место освободится, пока приложение закрыто, это будет видно на вашем телефоне?' }} variantlar={S5_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="jx-viz">
          <JonliSahna
            t1={{ ekran: ekran1, son: son1, sonYangi: son1 === 9 && !avval, soat, soatYangi: soat === '17:00' && !avval, eslatma, eslatmaYorliq: { uz: "qo'shilganda ilova qo'ygan", ru: 'поставило приложение при присоединении' },
              jonli, jonliKet, osti: t1osti, qadam: qadam(2) }}
            be={{ db, dbYangi, ustida: beOsti }}
            t2={tugadi ? null : { ekran: 'oyin', son: son2, sonYangi: dbYangi, qoshildi: qoshildi2, onQoshil: taxmin && q === 0 && !band ? qoshil : null, qoshilHalqa: taxmin && q === 0 && !band,
              chiqish: qoshildi2, onChiqish: q === 2 && !band ? chiq : null, chiqishHalqa: q === 2 && !band, qadam: qadam(1) || qadam(3) }}
            c1={ekran1 === 'yopiq' ? 'xira' : 'ochiq'} c2="ochiq" k1={k1} k2={k2}
            i1={tugadi ? { uz: 'Backend yuboradigan eslatma', ru: 'Напоминание, которое отправляет Backend' } : null} />
          {q >= 1 && !tugadi && <p className="jx-nom fade-step">{tr({ uz: <>Ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar — <b>jonli xabar</b>.</>, ru: <>Короткое сообщение на несколько секунд вверху экрана, пока приложение открыто, — <b>живое сообщение</b>.</> })}</p>}
          {q >= 4 && <p className="jx-nom fade-step">{tr({ uz: <>Telefon ekraniga ilova yopiq bo'lsa ham chiqadigan xabar — <b>eslatma</b>; ilova uni oldindan qo'ygan bo'lsa — <b>rejalashtirilgan eslatma</b>.</>, ru: <>Сообщение на экране телефона, которое появляется даже при закрытом приложении, — <b>напоминание</b>; если приложение поставило его заранее — <b>запланированное напоминание</b>.</> })}</p>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'yoq'} haqiqat={{ uz: "yo'q, joy bo'shagani yopiq ilovada ko'rinmadi", ru: 'нет, освободившееся место в закрытом приложении не было видно' }} />}
          matn={tr({ uz: "Ilova ochiq bo'lsa — jonli xabar; yopiq bo'lsa, bu misolda faqat ilova oldindan qo'ygan eslatma chiqadi.", ru: 'Приложение открыто — живое сообщение; закрыто — в этом примере появляется только напоминание, которое приложение поставило заранее.' })}
          izoh={tr({ uz: "Backend yuboradigan eslatma ham bor — u bu modulda qurilmaydi: Google yoki Apple xizmati va alohida sozlash kerak.", ru: 'Есть и напоминание, которое отправляет Backend, — в этом модуле его не строим: нужен сервис Google или Apple и отдельная настройка.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 3, D) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Mentor misolida ilova yopiq, o'yiningizga yangi o'yinchi qo'shildi. Nima bo'ladi?"
    question={tr({ uz: <h2 className="title h-ask">Mentor misolida ilova yopiq, o'yiningizga yangi o'yinchi qo'shildi. <span className="italic" style={{ color: T.accent }}>Nima bo'ladi</span>?</h2>, ru: <h2 className="title h-ask">В примере Ментора приложение закрыто, к вашей игре присоединился новый игрок. <span className="italic" style={{ color: T.accent }}>Что произойдёт</span>?</h2> })}
    options={[
      { uz: "Eslatma keladi, uni Backend o'zi yuboradi", ru: 'Придёт напоминание, его отправит сам Backend' },
      { uz: 'Jonli xabar keladi, ilova ochilganda', ru: 'Придёт живое сообщение, когда откроется приложение' },
      { uz: "Eslatma keladi, uni ilova qo'ygan", ru: 'Придёт напоминание, его поставило приложение' },
      { uz: "Hech narsa kelmaydi, ochganda ko'rasiz", ru: 'Ничего не придёт, увидите, когда откроете' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Yopiq ilovada boshqa odam qilgan o'zgarish ko'rinmaydi.", ru: 'В закрытом приложении изменение, сделанное другим человеком, не видно.' }}
    explainWrong={{
      0: { uz: 'Bu misolda Backend yuboradigan eslatma qurilganmi?', ru: 'В этом примере построено напоминание, которое отправляет Backend?' },
      1: { uz: 'Jonli xabar qaysi paytda chiqadi — ilova ochiq turgandami?', ru: 'Когда появляется живое сообщение — пока приложение открыто?' },
      2: { uz: "Ilova eslatmani qachon qo'yadi — kim qo'shilganda?", ru: "Когда приложение ставит напоминание — при чьём присоединении?" },
      default: { uz: 'Jonli xabar qaysi paytda chiqadi — ilova ochiq turgandami?', ru: 'Когда появляется живое сообщение — пока приложение открыто?' }
    }} />
);

// ===== 🏅 BADGES (nishonlar) — 4 ta: ikkitasi test (birinchi urinish), ikkitasi blokning oxirgi «Bajardim»i (Heads Up — bonus) =====
const ACHIEVEMENTS = {
  openScreens: { icon: '📱', name: 'Open Screens', desc: { uz: 'Ochiq ekranlar sanalishini birinchi urinishda topdingiz', ru: 'Вы с первой попытки поняли, что считаются открытые экраны' } },
  openClosed: { icon: '🔔', name: 'Open or Closed', desc: { uz: 'Yopiq ilovaga nima yetmasligini birinchi urinishda topdingiz', ru: 'Вы с первой попытки поняли, что не доходит до закрытого приложения' } },
  liveMessage: { icon: '💬', name: 'Live Message', desc: { uz: 'Jonli xabar talabini yozib, telefonda tekshirdingiz', ru: 'Вы написали требование к живому сообщению и проверили на телефоне' } },
  headsUp: { icon: '⏰', name: 'Heads Up', desc: { uz: 'Eslatmani (web-trekda — tasmani) telefonda tekshirdingiz', ru: 'Вы проверили напоминание (в веб-треке — ленту) на телефоне' } }
};
// Ekran id → nishon: s4, s7 — test (correct = birinchi urinish); a2, a3 — blokning oxirgi «Bajardim»i (ish bajarilgan, P-048; Heads Up — bonus, 152)
const ACH_TRIGGERS = { s4: 'openScreens', s7: 'openClosed', a2: 'liveMessage', a3: 'headsUp' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 7)
const Q_LABELS = {
  4: { uz: "1 — Ochiq ekranlar sanog'i", ru: '1 — Подсчёт открытых экранов' },
  7: { uz: '2 — Yopiq ilova', ru: '2 — Закрытое приложение' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (MD «Fon so'zlari»; kod so'zlari ru'da ham o'sha, R-008)
const QZ_BG_SHAPES = [
  { ch: { uz: 'xona', ru: 'комната' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: 'oyin-{id}', l: 80, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: "Hozir ko'ryapti", ru: 'Сейчас смотрят' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: 'korayotganlar-ozgardi', l: 60, t: 70, s: 22, d: 21, dl: 2.2 },
  { ch: { uz: 'jonli xabar', ru: 'живое сообщение' }, l: 38, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'eslatma', ru: 'напоминание' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: 'expo-notifications', l: 24, t: 36, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'test holati', ru: 'тестовый режим' }, l: 18, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: 'oyin-ozgardi', l: 84, t: 48, s: 22, d: 22, dl: 0.6 },
  { ch: { uz: 'ruxsat', ru: 'разрешение' }, l: 46, t: 12, s: 22, d: 24, dl: 2.5 },
  { ch: 'Xabarlar', l: 4, t: 46, s: 22, d: 26, dl: 1.3 },
  { ch: 'Maydon Jamoa', l: 70, t: 88, s: 22, d: 19, dl: 3.1 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (MD, aylanma; ekran savollarining nusxasi emas — §144)
const QUIZ_BANK = [
  { q: { uz: 'Mentor misolida `korayotganlar-ozgardi` kimlarga boradi?', ru: 'Кому в примере Ментора идёт `korayotganlar-ozgardi`?' }, opts: [{ uz: "Shu o'yin xonasidagi ulanishlarga", ru: 'Соединениям в комнате этой игры' }, { uz: 'Hamma ulangan ilovalarga birdaniga', ru: 'Всем подключённым приложениям сразу' }, { uz: "O'yinni e'lon qilgan tashkilotchiga", ru: 'Организатору, объявившему игру' }, { uz: "Database'dagi hamma o'yinchilarga", ru: 'Всем игрокам в Database' }], correct: 0 },
  { q: { uz: "Siz «O'yinlar» ekranidasiz, kimdir o'yinni ochdi. Sizga yangi son keladimi?", ru: "Вы на экране «Игры», кто-то открыл игру. Придёт ли вам новое число?" }, opts: [{ uz: 'Ha — hamma ulangan ilovaga boradi', ru: 'Да — идёт всем подключённым приложениям' }, { uz: "Yo'q — siz o'yin xonasida emassiz", ru: 'Нет — вы не в комнате игры' }, { uz: "Ha — ro'yxatdagi har kartaga boradi", ru: 'Да — идёт каждой карточке в списке' }, { uz: "Yo'q — son Database'dan olinadi", ru: 'Нет — число берётся из Database' }], correct: 1 },
  { q: { uz: "Boshqa telefonda o'yin ekrani yopildi. Sizdagi «Hozir ko'ryapti» nima bo'ladi?", ru: "На другом телефоне закрыли экран игры. Что будет с вашим «Сейчас смотрят»?" }, opts: [{ uz: "O'zgarmaydi, pastga tortish kerak", ru: 'Не изменится, нужно потянуть вниз' }, { uz: 'Nolga tushadi, xona yopilib qoladi', ru: 'Упадёт до нуля, комната закроется' }, { uz: 'Bittaga kamayadi, hodisa o\'zi keladi', ru: 'Уменьшится на одно, событие придёт само' }, { uz: 'Bittaga oshadi, yana bir ekran ochildi', ru: 'Вырастет на одно, открылся ещё экран' }], correct: 2 },
  { q: { uz: "Nega «Hozir ko'ryapti» sonini hodisaning o'zi olib keladi?", ru: "Почему число «Сейчас смотрят» приносит само событие?" }, opts: [{ uz: "Son juda tez o'zgarib turadi", ru: 'Число меняется очень быстро' }, { uz: "Ilova so'rov yubora olmaydi", ru: 'Приложение не может отправить запрос' }, { uz: 'Backend shunday tezroq ishlaydi', ru: 'Так Backend работает быстрее' }, { uz: "Bu son Database'da saqlanmaydi", ru: 'Это число не хранится в Database' }], correct: 3 },
  { q: { uz: "Ilova ochiq. O'yiningizda joy bo'shadi. Nima ko'rasiz?", ru: 'Приложение открыто. В вашей игре освободилось место. Что вы увидите?' }, opts: [{ uz: 'Ekran tepasida qisqa jonli xabar', ru: 'Короткое живое сообщение вверху экрана' }, { uz: 'Telefon ekranida eslatma kartasi', ru: 'Карточку напоминания на экране телефона' }, { uz: "Hech narsa, ro'yxatni yangilash kerak", ru: 'Ничего, нужно обновить список' }, { uz: 'Ilova o\'zi yopilib, qayta ochiladi', ru: 'Приложение само закроется и откроется' }], correct: 0 },
  { q: { uz: "O'zingiz «Qo'shilaman»ni bosdingiz. Mentor misolida jonli xabar chiqadimi?", ru: "Вы сами нажали «Присоединяюсь». Появится ли в примере Ментора живое сообщение?" }, opts: [{ uz: "Ha — har bir qo'shilish uchun chiqadi", ru: 'Да — появляется при каждом присоединении' }, { uz: "Yo'q — o'z harakatingiz uchun chiqmaydi", ru: 'Нет — для вашего действия не появляется' }, { uz: 'Ha — ismingiz bilan birga tepada chiqadi', ru: 'Да — появляется вверху с вашим именем' }, { uz: "Yo'q — jonli xabar tashkilotchiga chiqadi", ru: 'Нет — живое сообщение появляется организатору' }], correct: 1 },
  { q: { uz: "Rejalashtirilgan eslatmani kim qo'yadi?", ru: 'Кто ставит запланированное напоминание?' }, opts: [{ uz: "Backend, hodisa bo'lgan zahoti yuborib", ru: 'Backend, отправляя сразу при событии' }, { uz: "Tashkilotchi, o'yinni e'lon qilgan paytda", ru: 'Организатор, когда объявляет игру' }, { uz: "Ilovaning o'zi, vaqtini oldindan belgilab", ru: 'Само приложение, заранее назначив время' }, { uz: "Telefon, har kuni bir xil soatda o'zi", ru: 'Телефон, сам каждый день в одно время' }], correct: 2 },
  { q: { uz: 'Mentor misolida eslatma qachon chiqishi kerak?', ru: 'Когда в примере Ментора должно появиться напоминание?' }, opts: [{ uz: "O'yin boshlanadigan daqiqaning o'zida", ru: "Ровно в минуту начала игры" }, { uz: "Qo'shilgan zahoti, faqat bir marta", ru: 'Сразу при присоединении, один раз' }, { uz: "O'yindan bir kun oldin, kechqurun", ru: 'За день до игры, вечером' }, { uz: "O'yin boshlanishidan bir soat oldin", ru: 'За час до начала игры' }], correct: 3 },
  { q: { uz: "Mentor misolida «O'yindan chiqish» bosildi. Eslatma nima bo'ladi?", ru: "В примере Ментора нажали «Выйти из игры». Что будет с напоминанием?" }, opts: [{ uz: 'Bekor qilinadi, endi chiqmaydi', ru: 'Отменится, больше не появится' }, { uz: "Baribir o'z vaqtida chiqadi", ru: 'Всё равно появится вовремя' }, { uz: "Boshqa o'yinga ko'chib o'tadi", ru: 'Перейдёт на другую игру' }, { uz: 'Tashkilotchiga yuborib qo\'yiladi', ru: 'Будет отправлено организатору' }], correct: 0 },
  { q: { uz: 'Backend yuboradigan eslatma uchun nima kerak?', ru: 'Что нужно для напоминания, которое отправляет Backend?' }, opts: [{ uz: 'Expo Go va telefondagi eslatma ruxsati', ru: 'Expo Go и разрешение напоминаний на телефоне' }, { uz: 'Google yoki Apple xizmati va sozlash', ru: 'Сервис Google или Apple и настройка' }, { uz: "Ochiq ulanish va Backend'dagi xona", ru: 'Открытое соединение и комната в Backend' }, { uz: '`expo-notifications` paketining o\'zi', ru: 'Только пакет `expo-notifications`' }], correct: 1 },
  { q: { uz: "Mentor misolida eslatmaga ruxsat berilmadi. Nima bo'ladi?", ru: 'В примере Ментора не дали разрешение на напоминания. Что будет?' }, opts: [{ uz: 'Ilova ochilmaydi, eslatma chiqadi', ru: 'Приложение не откроется, напоминание появится' }, { uz: 'Ilova ishlaydi, eslatma ham chiqadi', ru: 'Приложение работает, напоминание тоже появится' }, { uz: 'Ilova ishlaydi, eslatma chiqmaydi', ru: 'Приложение работает, напоминание не появится' }, { uz: "Ilova yopiladi, ruxsat qayta so'raladi", ru: 'Приложение закроется, разрешение спросят снова' }], correct: 2 },
  { q: { uz: 'Web-trekda uchinchi amaliyotda nima quriladi?', ru: 'Что строится в веб-треке на третьей практике?' }, opts: [{ uz: 'Brauzer eslatmasi, alohida sozlab', ru: 'Напоминание браузера, с отдельной настройкой' }, { uz: 'Telefonga yuboriladigan SMS xabar', ru: 'SMS-сообщение на телефон' }, { uz: 'Har daqiqada sahifani yangilash', ru: 'Обновление страницы каждую минуту' }, { uz: "Sahifadagi «Xabarlar» tasmasi", ru: 'Лента «Xabarlar» на странице' }], correct: 3 },
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4; tayanch 4) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok 4 qadam (Ochish → Prompt → Ishga tushirish → Telefonda tekshirish), hammasi o'quvchining o'z repo'sida (5-qadam yo'q).
// steps [{ h, t, bandlar?, prompt?: { satrlar, joylar? }, yordam?, err? }]. Talab zinapoyasi: A1 — tayyor talab + bitta joy · A2 — bitta qator · A3 — uch qator.
// Qolipda yo'q (qolip taklifi): yoziladigan {…} joyi, yonidagi kulrang «masalan», ostidagi kulrang savol, qadam ichidagi «Yordam», «Ulgurmasangiz» qatori, trek tugmalari — shu faylda.
// Blok bajarilgani — faqat 4-qadam «Bajardim»idan (tayanch 9.36 h); «Ulgurmasangiz» yo'lida 3-qadamdan keyin «Davom etish» ochiladi, bayroq qo'yilmaydi.
// Holat shu darsning ccProgress javobida (qadam · joy — o'z nomi bilan, E 51); yangi saqlash kaliti yo'q (tayanch 8: 4-dars faqat o'qiydi).
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const TREK_KALIT = 'pm-m9d8-platforma';
const trekOqi = () => { const o = lsOqi(TREK_KALIT); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
const trekYoz = (t) => { try { const o = lsOqi(TREK_KALIT) || {}; localStorage.setItem(TREK_KALIT, JSON.stringify({ ...o, trek: t })); } catch { /* xotira yopiq */ } };
const talabBuzilmasin = () => { const o = lsOqi('pm-m10d3-talab'); return o && typeof o.buzilmasin === 'string' ? o.buzilmasin.trim() : ''; };
const useTrek = () => {
  const [trek, setTrek] = useState(trekOqi);
  const tanla = (t) => { trekYoz(t); setTrek(t); };
  const tugmalar = !trek && <div className="jx-trek"><span>{tr({ uz: 'Trekingiz:', ru: 'Ваш трек:' })}</span><div className="jx-chorla jx-trek-g"><QChip onClick={() => tanla('mobil')}>{tr({ uz: 'Mobil trek', ru: 'Мобильный трек' })}</QChip><QChip onClick={() => tanla('web')}>{tr({ uz: 'Web-trek', ru: 'Веб-трек' })}</QChip></div></div>;
  return [trek, tugmalar];
};
// Yoziladigan joy — avtomatik o'sadigan textarea; bo'sh joy uzuq chiziqli (U-041), navbatdagisi halqada
const JoyMaydon = ({ qiymat, joy, onYoz, blok, faol }) => (
  <textarea className={cx('jx-joy-i', blok && 'blok', !String(qiymat || '').trim() && 'bosh', faol && 'jx-halqa-i')} rows={1} value={qiymat || ''} placeholder={joy}
    onChange={(e) => onYoz(e.target.value)}
    ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }} />
);
// Prompt: satrlar [{ t } — tayyor qator ({joy} bo'lsa — birinchisi yoziladi, keyingilari qiymatni ko'rsatadi) | { l, joy } — yorliq + butun qator joyi]
// joylar [{ k, n?: kulrang «masalan», s?: ostidagi kulrang savol, blok? }] · qiymat / onYoz — ScreenBlok holatidan
const JxPrompt = ({ satrlar, joylar = [], qiymat = {}, onYoz }) => {
  const [ok, setOk] = useState(false);
  const jd = {}; joylar.forEach(j => { jd[tr(j.k)] = j; });
  const kalitlar = joylar.map(j => tr(j.k));
  const toliq = kalitlar.every(k => String(qiymat[k] || '').trim());
  const birinchiBosh = kalitlar.find(k => !String(qiymat[k] || '').trim());
  const qatorMatn = (s) => {
    if (s.l) return `${tr(s.l)} ${String(qiymat[tr(s.joy)] || '').trim()}`;
    let m = tr(s.t); kalitlar.forEach(k => { if (String(qiymat[k] || '').trim()) m = m.split(k).join(String(qiymat[k]).trim()); }); return m;
  };
  const nusxa = async () => { if (!toliq) return; try { await navigator.clipboard.writeText(satrlar.map(qatorMatn).join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  const korildi = new Set();
  const maydon = (k) => {
    const j = jd[k]; const bosh = !String(qiymat[k] || '').trim();
    return <><JoyMaydon qiymat={qiymat[k]} joy={k} blok={j.blok} faol={k === birinchiBosh} onYoz={(v) => onYoz(k, v)} />{bosh && j.n && <span className="jx-joy-n">{tx(j.n)}</span>}{j.s && <span className="jx-joy-s">{tr(j.s)}</span>}</>;
  };
  const qator = (s, i) => {
    if (s.l) return <span key={i} className="jx-ps jx-ps-l"><b className="jx-ps-y">{tr(s.l)}</b>{maydon(tr(s.joy))}</span>;
    return <span key={i} className="jx-ps">{tr(s.t).split(/(\{[^}]+\})/g).map((p, n) => {
      if (!jd[p]) return <React.Fragment key={n}>{fmtCode(p)}</React.Fragment>;
      if (!korildi.has(p)) { korildi.add(p); return <React.Fragment key={n}>{maydon(p)}</React.Fragment>; }
      const v = String(qiymat[p] || '').trim();
      return <span key={n} className={cx('jx-joy-tak', !v && 'bosh')}>{v || p}</span>;
    })}</span>;
  };
  return (
    <span className="q-prompt jx-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa" disabled={!toliq} onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {satrlar.map(qator)}
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <>
      <QTugma ikkinchi className="jx-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
      {ochiq && <span className="jx-yordam fade-step">{satrlar.map((l, i) => <span key={i} className={cx('jx-yordam-s', l.web && 'web')}>{tx(l)}</span>)}</span>}
    </>
  );
};
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'cd maydon-jamoa', 'git checkout -f m12-dars-04-done'];
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
const XATO_GAP = { uz: "Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: "Если есть ошибка — отправьте агенту строку ошибки (не значения `.env`, не токен и не ключи): «Вот такая ошибка: {ошибка}. Исправь.»" };
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, joyBosh = {}, ulgur, ulgurQadam = 3, ustoz, ustida }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : Math.min(Number(storedAnswer && storedAnswer.qadam) || 0, steps.length - 1)));
  const [joy, setJoy] = useState(() => ({ ...joyBosh, ...((storedAnswer && storedAnswer.joy) || {}) }));
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam;
  const yechim = (j) => ({ stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, joy: j });
  const saqla = (n, j) => { if (n >= steps.length) onAnswer(screen, yechim(j)); else onAnswer(screen, { qadam: n, joy: j }); };
  const bajardim = () => {
    if (isMentorLive || done) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, yechim(joy));
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    } else if (n < steps.length) saqla(n, joy);
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); saqla(i, joy); };
  const yoz = (k, v) => { const j = { ...joy, [k]: v }; setJoy(j); saqla(done ? steps.length : stepN, j); };
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish» (2-pilot naqshi)
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<><Mentor>{tr(mGap)}</Mentor>{ustida}</>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: <>{tx(c.t)}{c.bandlar && c.bandlar.map((b, i) => (b.prompt
            ? <JxPrompt key={i} satrlar={b.prompt} />
            : <span key={i} className="jx-band">{tx(b)}</span>))}{c.prompt && <JxPrompt satrlar={c.prompt.satrlar} joylar={c.prompt.joylar} qiymat={joy} onYoz={yoz} />}</>,
          xato: c.yordam ? <>{c.err && <span className="jx-band">{tx(c.err)}</span>}<Yordam satrlar={c.yordam} /></> : (c.err && tx(c.err))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
        pastki={<MentorPracticeStats live={_live} screen={screen} />}>
        {ulgur && !done && <p className="jx-ulgur">{tx(ulgur)}</p>}
        {ortda && <p className="jx-ortda">{tr({ uz: 'Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko\'ring:', ru: 'Отстали — откройте пример Ментора в отдельной папке:' })} <code className="jx-buyruq">{ORTDA[0]}</code> · <code className="jx-buyruq">{ORTDA[1]}</code> · <code className="jx-buyruq">{ORTDA[2]}</code> {tx(ortda)}</p>}
        {ustoz && <Ustoz satrlar={ustoz} />}
      </QBlok>
    </Stage>
  );
}
// Fayl kartasi — kutilgan natija ostida (agent o'zgartiradigan fayllar)
const Fayllar = ({ royxat }) => <div className="jx-fayllar">{royxat.map(([n, h]) => <span key={n} className="jx-fayl"><code>{n}</code><em>{tr(h)}</em></span>)}</div>;
const OZGARDI = { uz: "o'zgardi", ru: 'изменён' };
const Brauzer = ({ children }) => <div className="jx-brauzer"><span className="jx-br-bar"><i /><i /><i /><code>….netlify.app</code></span><div className="jx-br-tana"><span className="jx-tel-nom">{JONLI_SAHNA.nom}</span>{children}</div></div>;
// A1 kutilgan natija: «O'yin» ekrani, uch kadr bir marta o'zi yuradi — «Hozir ko'ryapti: 1» → 2 → 1
const NatijaA1 = ({ trek }) => {
  const [f, setF] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1300, () => setF(1)], [1800, () => setF(2)]]); }, []); // eslint-disable-line
  const kor = f === 1 ? 2 : 1;
  const web = trek === 'web';
  return (
    <div className="jx-natija">
      {web
        ? <Brauzer><b className="jx-br-sar">{tr(NAMUNA_OYIN.vaqt)}</b><span className="jx-br-q">{tr(NAMUNA_OYIN.joy)} · 8 / 10</span><span className="jx-kor">{tr(JONLI_SAHNA.korayapti)} <b key={kor} className={cx(f > 0 && 'jx-pop')}>{kor}</b></span></Brauzer>
        : <Telefon t={{ tex: 'Expo Go', ekran: 'oyin', son: 8, korayapti: kor, korYangi: f > 0, qoshilYoq: true }} />}
      <Fayllar royxat={web ? [['backend/src/…gateway.ts', OZGARDI], ['prototip/src/ulanish.js', OZGARDI]] : [['backend/src/…gateway.ts', OZGARDI], ['mobil/src/ulanish.ts', OZGARDI], ['mobil/src/app/oyin/[id].tsx', OZGARDI]]} />
    </div>
  );
};
// A2 kutilgan natija: «O'yinlar» → tepada jonli xabar → xabar yo'qoladi, kartada «9 / 10»
const NatijaA2 = ({ trek }) => {
  const [f, setF] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1300, () => setF(1)], [2600, () => setF(2)], [450, () => setF(3)]]); }, []); // eslint-disable-line
  const web = trek === 'web';
  const jonli = f >= 1 && f < 3 ? JONLI_XABARLAR.qoshildi : null;
  return (
    <div className="jx-natija">
      {web
        ? <Brauzer>{jonli && <span className={cx('jx-br-jonli', f === 2 && 'ket')}>{tr(jonli)}</span>}<b className="jx-br-sar">{tr(JONLI_SAHNA.oyinlar)}</b><span className="jx-br-q">{tr(NAMUNA_OYIN.vaqt)} · {tr(NAMUNA_OYIN.joy)} · <b key={f >= 1 ? 9 : 8} className={cx(f >= 1 && 'jx-pop')}>{f >= 1 ? 9 : 8}</b> / 10</span></Brauzer>
        : <Telefon t={{ tex: 'Expo Go', ekran: 'oyinlar', son: f >= 1 ? 9 : 8, sonYangi: f >= 1, jonli, jonliKet: f === 2 }} />}
      {!web && <Fayllar royxat={[['mobil/src/ulanish.ts', OZGARDI], ['mobil/src/app/_layout.tsx', OZGARDI]]} />}
    </div>
  );
};
// A3 kutilgan natija: mobil — «Qo'shilaman» → ruxsat oynasi (umumiy chizma, Shubhali 1) → «Qo'shildingiz» → ilova yopiq 17:00 eslatma; web — «Xabarlar» tasmasi, ikki qator
const NatijaA3 = ({ trek }) => {
  const [f, setF] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1300, () => setF(1)], [1500, () => setF(2)], [1400, () => setF(3)], [700, () => setF(4)]]); }, []); // eslint-disable-line
  if (trek === 'web') return (
    <div className="jx-natija">
      <Brauzer><b className="jx-br-sar">{tr({ uz: 'Xabarlar', ru: 'Xabarlar' })}</b>
        <span className="jx-tasma">
          {f >= 2 && <span className="jx-tasma-q yangi">{tr(JONLI_XABARLAR.chiqdi)}</span>}
          {f >= 1 && <span className={cx('jx-tasma-q', f < 2 && 'yangi')}>{tr(JONLI_XABARLAR.qoshildi)}</span>}
        </span>
      </Brauzer>
    </div>
  );
  return (
    <div className="jx-natija">
      <Telefon t={f >= 3
        ? { tex: 'Expo Go', ekran: 'yopiq', soat: '17:00', soatYangi: true, eslatma: f >= 4 }
        : { tex: 'Expo Go', ekran: 'oyin', son: f >= 2 ? 9 : 8, sonYangi: f >= 2, qoshildi: f >= 2, onQoshil: null, ruxsat: f === 1 }} />
      <Fayllar royxat={[['mobil/src/app/oyin/[id].tsx', OZGARDI], ['mobil/package.json', { uz: '+ expo-notifications', ru: '+ expo-notifications' }], ['README.md', { uz: '«Stek»: + expo-notifications', ru: '«Stek»: + expo-notifications' }]]} />
    </div>
  );
};

// ===== SCREEN 3 — AMALIYOT 1 · «Hozir ko'ryapti» (tayyor talab + bitta joy; {buzilmasin} ← pm-m10d3-talab.buzilmasin) =====
const A1_EKRAN = { uz: '{sanaladigan ekran}', ru: '{экран для подсчёта}' };
const A1_BUZ = { uz: '{buzilmasin}', ru: '{что не сломать}' };
const A1_PROMPT = [
  { t: { uz: "Qayerda: `backend/` — 2-darsdagi gateway; `mobil/` — `src/ulanish.ts` va {sanaladigan ekran}.", ru: 'Где: `backend/` — gateway из 2-го урока; `mobil/` — `src/ulanish.ts` и {экран для подсчёта}.' } },
  { t: { uz: "Nima qilsin: {sanaladigan ekran} ochilganda ilova Backend'ga hodisa yuborsin va Backend shu ulanishni xonaga qo'shsin; ekran yopilganda — xonadan chiqarsin. Ekran har yozuv uchun alohida ochilsa — har yozuvning o'z xonasi bo'lsin.", ru: 'Что сделать: когда открывается {экран для подсчёта}, приложение отправляет событие в Backend, и Backend добавляет это соединение в комнату; когда экран закрывается — убирает из комнаты. Если экран открывается отдельно для каждой записи — у каждой записи своя комната.' } },
  { t: { uz: "Xonadagi ulanishlar soni o'zgarsa, Backend shu xonaga yangi sonni yuborsin — ulanish uzilganda ham; ekranda «Hozir ko'ryapti: N» tursin, N ga o'zim ham kiraman. Ism ko'rsatilmasin — faqat son.", ru: "Если число соединений в комнате меняется, Backend отправляет в эту комнату новое число — и при обрыве соединения тоже; на экране пусть будет «Hozir ko'ryapti: N» («Сейчас смотрят: N»), в N вхожу и я сам. Имён не показывать — только число." } },
  { t: { uz: "Nima buzilmasin: {buzilmasin}; ro'yxat o'zi yangilanishi, ulanish belgisi va ekranni kim ko'ra olishi avvalgidek qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: {что не сломать}; самообновление списка, значок соединения и то, кто может видеть экран, остаются как раньше. Не трогай файлы `.env`. Больше ничего не трогай, назови изменённые файлы.' } }
];
const A1_JOYLAR = [
  { k: A1_EKRAN, n: { uz: "masalan: «O'yin» ekrani (`src/app/oyin/[id].tsx`)", ru: "например: экран «O'yin» (`src/app/oyin/[id].tsx`)" } },
  { k: A1_BUZ, blok: true, n: { uz: "masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin", ru: 'например: вход, объявление игры, присоединение, подтверждение, выход и очередь работают как раньше; обновление потягиванием вниз остаётся' } }
];
// 3-qadam: agent o'z kodidagi ikki qatorni ko'rsatadi (E 52 — real prompt; kod o'zgarmaydi)
const A1_KOD_PROMPT = [
  { t: { uz: "Yozgan fayllaringda ikki joyni fayl nomi va qator raqami bilan ko'rsat: Backend'da ulanishni xonaga qo'shadigan qator va xonaga yangi sonni yuboradigan qator.", ru: 'В написанных файлах покажи два места с именем файла и номером строки: строку в Backend, которая добавляет соединение в комнату, и строку, которая отправляет в комнату новое число.' } },
  { t: { uz: "Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Объясни одной фразой, что делает каждая. Код не меняй.' } }
];
const A1_YORDAM = [
  { uz: "Qayerda: `backend/` — 2-darsdagi gateway; `mobil/` — `src/ulanish.ts` va «O'yin» ekrani (`src/app/oyin/[id].tsx`).", ru: "Где: `backend/` — gateway из 2-го урока; `mobil/` — `src/ulanish.ts` и экран «O'yin» (`src/app/oyin/[id].tsx`)." },
  { uz: "Nima qilsin: har o'yinga alohida xona — `oyin-{id}`. «O'yin» ekrani ochilganda ilova `oyin-ochildi` (`{ oyinId }`) yuborsin va Backend shu ulanishni o'sha xonaga qo'shsin; ekran yopilganda — `oyin-yopildi`, xonadan chiqarsin.", ru: "Что сделать: у каждой игры своя комната — `oyin-{id}`. Когда открывается экран «O'yin», приложение отправляет `oyin-ochildi` (`{ oyinId }`), и Backend добавляет это соединение в ту комнату; когда экран закрывается — `oyin-yopildi`, убирает из комнаты." },
  { uz: "Xonadagi ulanishlar soni o'zgarsa, Backend shu xonaga `korayotganlar-ozgardi` (`{ oyinId, soni }`) yuborsin — ulanish uzilganda ham; «O'yin» ekranida «Hozir ko'ryapti: N» tursin, N ga o'zim ham kiraman. Ism ko'rsatilmasin — faqat son.", ru: "Если число соединений в комнате меняется, Backend отправляет в эту комнату `korayotganlar-ozgardi` (`{ oyinId, soni }`) — и при обрыве соединения тоже; на экране «O'yin» пусть будет «Hozir ko'ryapti: N» («Сейчас смотрят: N»), в N вхожу и я сам. Имён не показывать — только число." },
  { uz: "Nima buzilmasin: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash, ro'yxat o'zi yangilanishi va ulanish belgisi qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход, объявление игры, присоединение, подтверждение, выход и очередь работают как раньше; обновление потягиванием вниз, самообновление списка и значок соединения остаются. Не трогай файлы `.env`. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_YORDAM_WEB = { web: true, uz: "Web-trekda: «Qayerda» — `prototip/` dagi `src/ulanish.js` va sanaladigan sahifa; Backend qismi ikkala trekda bir xil, «Hozir ko'ryapti» sahifada turadi.", ru: "В веб-треке: «Где» — `src/ulanish.js` в `prototip/` и страница для подсчёта; часть Backend в обоих треках одинакова, «Hozir ko'ryapti» стоит на странице." };
const ScreenA1 = (props) => {
  const [trek, trekTugma] = useTrek();
  const joyBosh = useMemo(() => { const b = talabBuzilmasin(); return b ? { [tr(A1_BUZ)]: b } : {}; }, []);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · hozir ko'ryapti", ru: 'Практика 1 · сейчас смотрят' }}
      title={{ uz: <>Ilovangizda «Hozir ko'ryapti» <span className="italic" style={{ color: T.accent }}>soni ko'rinsin</span>.</>, ru: <>Пусть <span className="italic" style={{ color: T.accent }}>будет видно число</span> «Сейчас смотрят».</> }}
      mentor={{ uz: "Talab tayyor — bitta joyga qaysi ekran sanalishini yozasiz; «1 · Ochish»dan boshlang.", ru: "Требование готово — в одно место впишите, какой экран считается; начните с «1 · Открыть»." }}
      ustida={trekTugma} joyBosh={joyBosh}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da o'z repo'ngizni oching (3-darsdagi holat: ilova Backend'ga ulangan, ro'yxat o'zi yangilanadi). Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.", ru: 'Откройте свой репозиторий в Antigravity (состояние 3-го урока: приложение подключено к Backend, список обновляется сам). В терминале `git status`: файлов `.env` в списке быть не должно.' },
          bandlar: [
            { uz: "Mobil trekda `cd mobil`, `npx expo start` ishlab tursin va ilova telefoningizda ochiq bo'lsin; web-trekda saytingiz Netlify'da ochiq tursin.", ru: 'В мобильном треке `cd mobil`, пусть работает `npx expo start` и приложение открыто на телефоне; в веб-треке пусть сайт открыт на Netlify.' },
            { uz: "Sanaladigan ekranni tanlang: Mentor misolida — «O'yin» ekrani, har o'yinga alohida xona. Mahsulotingizda bitta yozuv uchun alohida ochiladigan ekran bo'lmasa — eng ko'p ochiladigan ekranni oling: unda bitta xona bo'ladi. Mahsulotingizni bir vaqtda bitta odam ishlatsa — son sizning ochiq qurilmalaringizni sanaydi (masalan, telefon va kompyuter).", ru: "Выберите экран для подсчёта: в примере Ментора — экран «O'yin» («Игра»), у каждой игры своя комната. Если в вашем продукте нет отдельного экрана для одной записи — возьмите экран, который открывают чаще всего: у него будет одна комната. Если продуктом одновременно пользуется один человек — число считает ваши открытые устройства (например, телефон и компьютер)." }
          ] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: "заполните пропуск в скобках (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:" },
          prompt: { satrlar: A1_PROMPT, joylar: A1_JOYLAR }, yordam: trek === 'mobil' ? A1_YORDAM : [...A1_YORDAM, A1_YORDAM_WEB] },
        { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"hozir ko'ryapti\"`, `git push`.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают с тем, что сказал агент, `.env` в списке нет; добавьте каждый файл через `git add <fayl>`, `git commit -m "hozir ko\'ryapti"`, `git push`.' },
          bandlar: [
            { uz: "Render Backend'ning yangi versiyasini chiqaradi — tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Kutayotganda agent yozgan fayllardan ikki joyni toping: Backend'da ulanishni xonaga qo'shadigan qator va yangi son yuboriladigan qator.", ru: 'Render выпускает новую версию Backend — дождитесь окончания (может занять несколько минут). Пока ждёте, найдите в файлах агента два места: строку в Backend, которая добавляет соединение в комнату, и строку, где отправляется новое число.' },
            { prompt: A1_KOD_PROMPT },
            { uz: "Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda `git push` dan keyin Netlify saytni odatda o'zi yangilaydi.", ru: 'В мобильном треке Expo Go обычно сам перезагружает приложение (если нет — `r` в терминале); в веб-треке после `git push` Netlify обычно сам обновляет сайт.' }
          ],
          err: { uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если появилась ошибка — отправьте агенту строку ошибки (не значения `.env`, не токен и не ключи): «Вот такая ошибка: {ошибка}. Исправь.»' } },
        { h: { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }, t: { uz: "talabingizning har gapini bajarib ko'ring. Mentor misolida:", ru: 'проверьте каждое предложение требования. В примере Ментора:' },
          bandlar: [
            { uz: "(1) Render tugagach, ilovada «O'yin» ekranini qaytadan oching (Shanba, 18:00): «Hozir ko'ryapti: 1» bo'lishi kerak — bu sizning ekraningiz.", ru: "(1) Когда Render закончит, заново откройте в приложении экран «O'yin» (Суббота, 18:00): должно быть «Hozir ko'ryapti: 1» — это ваш экран." },
            { uz: <>(2) Ikkinchi ulanish. <b>Web-trekda — o'zingiz:</b> shu sahifani kompyuterda ikkinchi oynada oching — telefonda son 2 ga o'tishi kerak; oynani yoping — yana 1. <b>Mobil trekda — sherik:</b> uning telefonidan shu o'yinni oching (Android'dagi Expo Go; Expo akkaunti ma'lumoti boshqaga berilmaydi), keyin yoping.</>, ru: <>(2) Второе соединение. <b>В веб-треке — сами:</b> откройте эту страницу на компьютере во втором окне — на телефоне число должно стать 2; закройте окно — снова 1. <b>В мобильном треке — партнёр:</b> откройте эту игру с его телефона (Expo Go на Android; данные аккаунта Expo другим не передаются), потом закройте.</> },
            { uz: "Sherik bo'lmasa — agentga yozing: «Tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas), shu akkaunt nomidan Backend'ga ikkinchi ulanish och, shu o'yin ekrani ochilgandek hodisa yubor va 30 soniyadan keyin ulanishni yop. Keyin akkauntni `id` si bo'yicha o'chir. Qaysi akkaunt va qaysi o'yin `id` sini ishlatganingni ayt. Boshqa yozuv yaratma.» — son odatda bir necha soniyada 2 ga, 30 soniyadan keyin yana 1 ga o'tishi kerak.", ru: 'Если партнёра нет — напишите агенту: «Открой новый аккаунт для проверки (с образцом имени и номера, не настоящими), от имени этого аккаунта открой второе соединение с Backend, отправь событие, как будто открыт экран этой игры, и через 30 секунд закрой соединение. Потом удали аккаунт по его `id`. Скажи, какой аккаунт и какой `id` игры использовал. Других записей не создавай.» — число обычно должно за несколько секунд стать 2, а через 30 секунд снова 1.' },
            { uz: "(3) Avvalgi ishlar: ro'yxatni pastga torting, ulanish belgisiga qarang — avvalgidek ishlasin.", ru: '(3) Прежние действия: потяните список вниз, посмотрите на значок соединения — всё должно работать как раньше.' },
            { uz: "Agentning «ulanish ochdim» degani — uning so'zi; son o'zgarganini esa o'zingiz ko'rdingiz. Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Слова агента «открыл соединение» — это его слова; а то, что число изменилось, вы видели сами. Несовпадение напишите агенту: «{что} не как в требовании: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»' },
            { uz: "Web-trekda: saytingizni telefon brauzerida oching; ikkinchi ulanish — kompyuterdagi ikkinchi oyna.", ru: 'В веб-треке: откройте сайт в браузере телефона; второе соединение — второе окно на компьютере.' }
          ] }
      ]}
      natija={<NatijaA1 trek={trek} />}
      doneText={{ uz: "«Hozir ko'ryapti» ishlaydi: ochiq ekranlar sanaladi, ism ko'rinmaydi.", ru: "«Сейчас смотрят» работает: считаются открытые экраны, имён не видно." }}
      ulgur={{ uz: "Ulgurmasangiz: Render kutishi cho'zilsa — 3-qadamdan keyin «Davom etish» ochiladi: Amaliyot 2 ga o'ting. 4-qadamni Amaliyot 2 tekshiruvi bilan birga qilib, shu yerga qaytib «Bajardim»ni bosasiz — blok shundan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: если ожидание Render затянулось — после шага 3 откроется «Продолжить»: переходите к Практике 2. Шаг 4 сделайте вместе с проверкой Практики 2, вернитесь сюда и нажмите «Готово» — блок засчитывается после этого.' }}
      ortda={{ uz: "(faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).", ru: '(только в этой новой папке — команда удаляет изменения в папке) — увидите, как это работает, и повторите шаг в своём репозитории по образцу (в `backend/.env` и `mobil/.env` впишете свои значения).' }}
      ustoz={[{ uz: "Render'da yangi versiya chiqqanda ulanish uziladi — belgi bir oz «Ulanmoqda…» bo'lib turishi mumkin; o'quvchi shundan keyin «O'yin» ekranini qaytadan ochsin. Uchish rejimi bu blokda yo'q.", ru: "Когда на Render выходит новая версия, соединение обрывается — значок может немного побыть «Подключается…»; после этого ученик пусть заново откроет экран «O'yin». Режима полёта в этом блоке нет." }]}
    />
  );
};

// ===== SCREEN 6 — AMALIYOT 2 · jonli xabar (bitta qator — «Nima qilsin»; «Yana» va «Nima buzilmasin» tayyor, tahrirlanadi) =====
const A2_NIMA = { uz: '{nima qilsin}', ru: '{что сделать}' };
const A2_YANA = { uz: '{yana}', ru: '{ещё}' };
const A2_BUZ = { uz: '{nima buzilmasin}', ru: '{что не сломать}' };
const A2_PROMPT = [
  { t: { uz: "Qayerda: `mobil/` — 3-darsdagi hodisa tinglovchisi (`src/ulanish.ts`) va hamma ekranlar tepasidagi umumiy joy.", ru: 'Где: `mobil/` — слушатель событий из 3-го урока (`src/ulanish.ts`) и общее место вверху всех экранов.' } },
  { l: { uz: 'Nima qilsin:', ru: 'Что сделать:' }, joy: A2_NIMA },
  { l: { uz: 'Yana:', ru: 'Ещё:' }, joy: A2_YANA },
  { l: { uz: 'Nima buzilmasin:', ru: 'Что не сломать:' }, joy: A2_BUZ }
];
const A2_JOYLAR = [
  { k: A2_NIMA, n: { uz: "masalan: menga tegishli o'yinga yana bir o'yinchi qo'shilsa — «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10»", ru: 'например: если к моей игре присоединится ещё один игрок — «Суббота, 18:00 — присоединился ещё один игрок: 9 / 10»' } },
  { k: A2_YANA }, { k: A2_BUZ }
];
const A2_BOSH = {
  yana: { uz: "jonli xabar ekran tepasida bir necha soniya tursin va o'zi yo'qolsin. Faqat menga tegishli yozuv uchun chiqsin; o'zim qilgan harakat uchun chiqmasin; xabarda ism bo'lmasin. Qaysi xabar chiqishini hodisadan keyin qayta so'ralgan javobni oldingisi bilan solishtirib tanla; o'z harakatimni javobdagi menga tegishli maydonlar o'zgarganidan bil, hodisaga yangi maydon qo'shma.", ru: 'живое сообщение держится вверху экрана несколько секунд и само исчезает. Появляется только для записи, которая касается меня; для моего собственного действия не появляется; в сообщении нет имени. Какое сообщение показать — выбирай, сравнивая ответ, заново запрошенный после события, с предыдущим; моё собственное действие узнавай по изменившимся полям, которые касаются меня; новых полей в событие не добавляй.' },
  buz: { uz: "«Hozir ko'ryapti», ro'yxat o'zi yangilanishi va ulanish belgisi avvalgidek ishlasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: '«Hozir ko\'ryapti», самообновление списка и значок соединения работают как раньше. Не трогай файлы `.env`. Больше ничего не трогай, назови изменённые файлы.' }
};
const A2_YORDAM = [
  { uz: "Nima qilsin: `oyin-ozgardi` kelib, ilova `GET /oyinlar` dan qayta so'ragach, yangi javobni oldingisi bilan solishtirsin. O'yin menga tegishli bo'lsa (qo'shilganman, navbatdaman yoki o'zim e'lon qilganman — buning uchun `GET /oyinlar` javobiga `menTashkilotchiman` qo'sh) — jonli xabar chiqsin:", ru: 'Что сделать: когда придёт `oyin-ozgardi` и приложение заново запросит `GET /oyinlar`, пусть сравнит новый ответ с предыдущим. Если игра касается меня (я присоединился, я в очереди или я сам объявил — для этого добавь в ответ `GET /oyinlar` поле `menTashkilotchiman`) — показать живое сообщение:' },
  { uz: "qo'shilganlar ko'paysa — «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10», o'yin to'lsa — «Shanba, 18:00 — o'yin to'ldi: 10 / 10» · kamaysa — «Shanba, 18:00 — joy bo'shadi: 8 / 10» ·", ru: 'если присоединившихся больше — «Суббота, 18:00 — присоединился ещё один игрок: 9 / 10», если игра заполнилась — «Суббота, 18:00 — игра заполнена: 10 / 10» · если меньше — «Суббота, 18:00 — освободилось место: 8 / 10» ·' },
  { uz: "tasdiqlaganlar ko'paysa (faqat tashkilotchiga) — «Shanba, 18:00 — kelishini tasdiqladi: 8 / 9» · men navbatdan o'yinga o'tsam — «Navbatdan o'yinga o'tdingiz: Shanba, 18:00». Kun, soat va sonlar — o'sha o'yindan.", ru: 'если подтвердивших больше (только организатору) — «Суббота, 18:00 — подтвердили приход: 8 / 9» · если я перешёл из очереди в игру — «Вы перешли из очереди в игру: Суббота, 18:00». День, время и числа — из той же игры.' },
  { uz: "Son o'zgarmasa (chiqqan o'rniga navbatdagi kirdi) — boshqalarga xabar chiqmasin. `menQoshilganman`, `menNavbatdaman` yoki `menTasdiqlaganman` o'zgargan bo'lsa — bu mening harakatim, xabar chiqmasin (navbatdan o'tish bundan mustasno). Hodisaga yangi maydon qo'shma.", ru: 'Если число не изменилось (вместо вышедшего зашёл следующий из очереди) — другим сообщение не показывать. Если изменилось `menQoshilganman`, `menNavbatdaman` или `menTasdiqlaganman` — это моё действие, сообщение не показывать (кроме перехода из очереди). Новых полей в событие не добавляй.' }
];
const A2_YORDAM_WEB = { web: true, uz: "Web-trekda: «Qayerda» — `prototip/` dagi tinglovchi (`src/ulanish.js`) va sahifa tepasi; jonli xabar sahifa tepasida chiqadi, qolgani bir xil.", ru: 'В веб-треке: «Где» — слушатель в `prototip/` (`src/ulanish.js`) и верх страницы; живое сообщение появляется вверху страницы, остальное так же.' };
const ScreenA2 = (props) => {
  const [trek, trekTugma] = useTrek();
  const joyBosh = useMemo(() => ({ [tr(A2_YANA)]: tr(A2_BOSH.yana), [tr(A2_BUZ)]: tr(A2_BOSH.buz) }), []);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · jonli xabar', ru: 'Практика 2 · живое сообщение' }}
      title={{ uz: <>Ochiq ilovada o'zgarish <span className="italic" style={{ color: T.accent }}>jonli xabar</span> bo'lib chiqsin.</>, ru: <>Пусть изменение приходит <span className="italic" style={{ color: T.accent }}>живым сообщением</span>.</> }}
      mentor={{ uz: "Endi «Nima qilsin» qatorini o'zingiz yozasiz — qaysi o'zgarishda qanday xabar chiqishini siz tanlaysiz; «1 · Ochish»dan boshlang.", ru: "Теперь строку «Что сделать» вы пишете сами — вы выбираете, при каком изменении какое сообщение появится; начните с «1 · Открыть»." }}
      ustida={trekTugma} joyBosh={joyBosh}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "`README.md` dagi «Real vaqt» bo'limini oching: har qatorda kim nima qiladi va ekranda nima o'zgaradi. Foydalanuvchining o'ziga tegishli o'zgarishlarni belgilang — ular jonli xabarga arziydi. Har o'zgarish jonli xabarga arzimaydi: foydalanuvchi darhol bilishi kerak bo'lganini tanlang — qolganlari ekranda jimgina yangilanadi.", ru: "Откройте раздел «Real vaqt» в `README.md`: в каждой строке — кто что делает и что меняется на экране. Отметьте изменения, которые касаются самого пользователя, — они заслуживают живого сообщения. Не каждое изменение его заслуживает: выберите то, что пользователь должен узнать сразу, — остальное тихо обновляется на экране." },
          bandlar: [
            { uz: "Mentor misolida — beshta: yana bir o'yinchi qo'shildi · joy bo'shadi · o'yin to'ldi · kelishini tasdiqladi (faqat tashkilotchiga) · navbatdan o'yinga o'tdingiz.", ru: 'В примере Ментора — пять: присоединился ещё один игрок · освободилось место · игра заполнена · подтвердили приход (только организатору) · вы перешли из очереди в игру.' },
            { uz: "Talabdagi «Yana» qatorida Mentor misolining uch qoidasi tayyor turibdi: faqat o'ziga tegishli yozuv uchun · o'z harakati uchun emas · ismsiz. Mahsulotingizga mos kelmasa, tahrirlang.", ru: 'В строке «Ещё» требования уже стоят три правила примера Ментора: только для записи, которая касается самого пользователя · не для его собственного действия · без имени. Если не подходит вашему продукту — отредактируйте.' }
          ] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Nima qilsin» qatorini o'zingiz yozing (yonida kulrang namuna), «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'Напишите строку «Что сделать» сами (рядом серый образец), нажмите «Скопировать», отправьте в Antigravity:' },
          prompt: { satrlar: A2_PROMPT, joylar: A2_JOYLAR }, yordam: trek === 'mobil' ? A2_YORDAM : [...A2_YORDAM, A2_YORDAM_WEB] },
        { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "`git status` → har faylni `git add <fayl>` bilan → `git commit -m \"jonli xabar\"` → `git push`. Agent Backend'ni ham o'zgartirgan bo'lsa — Render'da yangi versiya tugashini kuting.", ru: '`git status` → каждый файл через `git add <fayl>` → `git commit -m "jonli xabar"` → `git push`. Если агент изменил и Backend — дождитесь окончания новой версии на Render.' },
          bandlar: [{ uz: "Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — `r`); web-trekda — Netlify.", ru: 'В мобильном треке Expo Go обычно сам перезагружает приложение (если нет — `r`); в веб-треке — Netlify.' }],
          err: XATO_GAP },
        { h: { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }, t: { uz: "talabingizning har gapini bajarib ko'ring. Mentor misolida (siz Shanba 18:00 o'yiniga qo'shilgansiz; ilova «O'yinlar»da ochiq tursin):", ru: "проверьте каждое предложение требования. В примере Ментора (вы присоединились к игре в субботу в 18:00; приложение открыто на «O'yinlar» («Игры»)):" },
          bandlar: [
            { uz: "(1) Agentga: «Tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan Shanba 18:00 o'yiniga qo'shilish so'rovini yubor. Akkaunt va yangi yozuv `id` sini ayt.» → ekran tepasida «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10» bir necha soniya chiqishi kerak.", ru: '(1) Агенту: «Открой новый аккаунт для проверки (с образцом имени и номера, не настоящими) и от его имени отправь запрос на присоединение к игре в субботу в 18:00. Скажи `id` аккаунта и новой записи.» → вверху экрана на несколько секунд должно появиться «Суббота, 18:00 — присоединился ещё один игрок: 9 / 10».' },
            { uz: "(2) Agentga: «O'sha tekshiruv akkauntini men qo'shilmagan o'yinga ham qo'sh, `id` sini ayt.» → jonli xabar chiqmasligi kerak: o'yin sizga tegishli emas.", ru: '(2) Агенту: «Добавь тот же проверочный аккаунт и в игру, к которой я не присоединился, скажи `id`.» → живое сообщение не должно появиться: игра вас не касается.' },
            { uz: "(3) O'zingiz boshqa o'yinga qo'shiling → jonli xabar chiqmasligi kerak: bu sizning harakatingiz.", ru: '(3) Сами присоединитесь к другой игре → живое сообщение не должно появиться: это ваше действие.' },
            { uz: "Tozalash: agentga — «Tekshiruvda yaratgan akkaunt va yozuvlaringni aytgan `id` lari bo'yicha o'chir.» Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Очистка: агенту — «Удали аккаунт и записи, созданные при проверке, по названным `id`.» Несовпадение напишите агенту: «{что} не как в требовании: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»' },
            { uz: "Amaliyot 1 ning 4-qadamini qoldirgan bo'lsangiz — shu yerda tekshiring.", ru: 'Если вы пропустили шаг 4 Практики 1 — проверьте здесь.' }
          ] }
      ]}
      natija={<NatijaA2 trek={trek} />}
      doneText={{ uz: 'Jonli xabar ishlaydi: faqat sizga tegishli o\'zgarishda va ismsiz chiqadi.', ru: 'Живое сообщение работает: появляется только при изменении, которое касается вас, и без имени.' }}
      ulgur={{ uz: "Ulgurmasangiz: vaqt tugayaptimi — (1) ni tekshirib, `git push` qiling va Amaliyot 3 ga o'ting; (2) va (3) ni oxirida tekshirib, shu yerga qaytib «Bajardim»ni bosasiz — blok shundan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: время кончается — проверьте (1), сделайте `git push` и переходите к Практике 3; (2) и (3) проверите в конце, вернётесь сюда и нажмёте «Готово» — блок засчитывается после этого.' }}
      ustoz={[{ uz: "(2) va (3) — «chiqmasligi kerak» tekshiruvlari; o'quvchi xabar chiqmaganini ham natija deb yozsin. Agent «o'chirdim» desa — o'quvchi ro'yxatni pastga tortib, son qaytganini ko'rsin.", ru: '(2) и (3) — проверки «не должно появиться»; пусть ученик запишет и то, что сообщение не появилось, как результат. Если агент скажет «удалил» — пусть ученик потянет список вниз и увидит, что число вернулось.' }]}
    />
  );
};

// ===== SCREEN 8 — AMALIYOT 3 · eslatma (web-trekda — «Xabarlar» tasmasi): uch qatorni o'quvchi yozadi, har qator ostida kulrang savol =====
const A3_Q = { uz: '{qayerda}', ru: '{где}' };
const A3_N = { uz: '{nima qilsin}', ru: '{что сделать}' };
const A3_B = { uz: '{nima buzilmasin}', ru: '{что не сломать}' };
const A3_EXPO = { t: { uz: "Eslatma — `expo-notifications` bilan (`npx expo install expo-notifications`); `README.md` «Stek» qatoriga qo'sh. Ruxsatni birinchi marta so'ra (Android'da avval eslatma kanalini yarat); ruxsat berilmasa — ilova ishlayversin, eslatma qo'yilmasin.", ru: 'Напоминание — через `expo-notifications` (`npx expo install expo-notifications`); добавь в строку «Stek» в `README.md`. Разрешение спроси при первом запуске (на Android сначала создай канал напоминаний); если разрешение не дано — приложение работает дальше, напоминание не ставится.' } };
const A3_OXIR = { t: { uz: "Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Больше ничего не трогай, назови изменённые файлы.' } };
const A3_JOYLAR = [
  { k: A3_Q, s: { uz: "Qaysi ekranda, qaysi tugma bosilganda qo'yiladi va qachon bekor bo'ladi?", ru: 'На каком экране, при нажатии какой кнопки ставится и когда отменяется?' } },
  { k: A3_N, s: { uz: 'Qachon chiqsin va unda nima yozilsin? Qachon qo\'yilmasin?', ru: 'Когда появиться и что в нём написать? Когда не ставить?' } },
  { k: A3_B, s: { uz: 'Oldin ishlagan qaysi narsa joyida qolsin?', ru: 'Что из работавшего раньше должно остаться на месте?' } }
];
const A3_YORDAM_MOBIL = [
  { uz: "Qayerda: `mobil/` — «O'yin» ekranidagi «Qo'shilaman» va «O'yindan chiqish» (`src/app/oyin/[id].tsx`).", ru: "Где: `mobil/` — «Qo'shilaman» («Присоединяюсь») и «O'yindan chiqish» («Выйти из игры») на экране «O'yin» (`src/app/oyin/[id].tsx`)." },
  { uz: "Nima qilsin: «Qo'shilaman» muvaffaqiyatli bo'lganda ilova eslatmani o'yindan bir soat oldinga rejalashtirsin: sarlavha «Maydon Jamoa», matn «Bugun, 18:00 · Mahalla maydoni» (soat va maydon — o'sha o'yindan).", ru: "Что сделать: когда «Qo'shilaman» прошло успешно, приложение планирует напоминание за час до игры: заголовок «Maydon Jamoa», текст «Сегодня, 18:00 · Поле махалли» (время и поле — из той же игры)." },
  { uz: "O'yinga bir soatdan kam qolgan bo'lsa — rejalashtirmasin. «O'yindan chiqish» bosilganda shu o'yinning eslatmasi bekor bo'lsin. Bitta o'yinga bitta eslatma: qayta rejalashtirilsa — eskisi bekor bo'lsin. Ilova ochiq paytga to'g'ri kelsa ham, eslatma ko'rinsin.", ru: "Если до игры меньше часа — не планировать. При нажатии «O'yindan chiqish» напоминание этой игры отменяется. Одна игра — одно напоминание: при повторном планировании старое отменяется. Даже если время совпадёт с открытым приложением, напоминание должно быть видно." },
  { uz: "Nima buzilmasin: qo'shilish, chiqish, navbat, jonli xabar va «Hozir ko'ryapti» avvalgidek ishlasin.", ru: "Что не сломать: присоединение, выход, очередь, живое сообщение и «Hozir ko'ryapti» работают как раньше." },
  A3_EXPO.t, A3_OXIR.t
];
const A3_YORDAM_WEB = [
  { web: true, uz: "Qayerda: `prototip/` — sahifadagi yangi «Xabarlar» tasmasi.", ru: 'Где: `prototip/` — новая лента «Xabarlar» на странице.' },
  { web: true, uz: "Nima qilsin: sahifa ochiq paytda chiqqan har jonli xabar tasmaga ham yozilsin: oxirgi beshtasi, eng yangisi tepada. Sahifa yangilansa — tasma bo'sh boshlanadi.", ru: 'Что сделать: каждое живое сообщение, появившееся при открытой странице, записывается и в ленту: последние пять, самое новое сверху. Если страницу обновить — лента начинается пустой.' },
  { web: true, uz: "Nima buzilmasin: jonli xabar, «Hozir ko'ryapti» va «Yangilash» tugmasi avvalgidek ishlasin.", ru: "Что не сломать: живое сообщение, «Hozir ko'ryapti» и кнопка «Yangilash» работают как раньше." }
];
const ScreenA3 = (props) => {
  const [trek, trekTugma] = useTrek();
  const web = trek === 'web';
  const satrlar = [{ l: { uz: 'Qayerda:', ru: 'Где:' }, joy: A3_Q }, { l: { uz: 'Nima qilsin:', ru: 'Что сделать:' }, joy: A3_N }, { l: { uz: 'Nima buzilmasin:', ru: 'Что не сломать:' }, joy: A3_B }, ...(web ? [] : [A3_EXPO]), A3_OXIR];
  return (
    <ScreenBlok {...props} key={trek || 'yoq'} eyebrow={web ? { uz: 'Amaliyot 3 · xabarlar tasmasi', ru: 'Практика 3 · лента сообщений' } : { uz: 'Amaliyot 3 · eslatma', ru: 'Практика 3 · напоминание' }}
      title={web
        ? { uz: <>Sayt ochiq paytdagi xabarlar <span className="italic" style={{ color: T.accent }}>tasmada tursin</span>.</>, ru: <>Пока сайт открыт, сообщения <span className="italic" style={{ color: T.accent }}>остаются в ленте</span>.</> }
        : { uz: <>Ilova yopiq bo'lsa ham, kerakli payt <span className="italic" style={{ color: T.accent }}>eslatma chiqsin</span>.</>, ru: <>Даже закрытое приложение <span className="italic" style={{ color: T.accent }}>напомнит вовремя</span>.</> }}
      mentor={{ uz: "Oxirgi blokda uch qatorni o'zingiz yozasiz — har qator ostida kulrang savol, Mentor misoli «Yordam»da; «1 · Ochish»dan boshlang.", ru: "В последнем блоке три строки вы пишете сами — под каждой серый вопрос, пример Ментора — в «Подсказке»; начните с «1 · Открыть»." }}
      ustida={trekTugma}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "eslatma nima uchun kerakligini toping: foydalanuvchi o'z ishini qachon unutishi mumkin? Mentor misolida — o'yinga qo'shilgan o'yinchi o'yin vaqtini unutmasin: eslatma o'yindan bir soat oldin.", ru: 'найдите, зачем нужно напоминание: когда пользователь может забыть о своём деле? В примере Ментора — присоединившийся игрок не должен забыть время игры: напоминание за час до игры.' },
          bandlar: [
            { uz: "Ikki halol chegara: eslatma faqat shu telefonda qilingan ishdan qo'yiladi — boshqa telefondan kirilsa, u yerda eslatma yo'q. Telefonda eslatmalar o'chirilgan bo'lsa — chiqmaydi.", ru: 'Две честные границы: напоминание ставится только по действию на этом телефоне — если войти с другого телефона, там напоминания нет. Если на телефоне напоминания выключены — не появится.' },
            { uz: "Web-trekda bu blokda — «Xabarlar» tasmasi: sahifa ochiq paytda kelgan oxirgi beshta jonli xabar. Sayt yopiq bo'lsa, xabar kelmaydi — brauzer eslatmasi alohida sozlashni talab qiladi.", ru: 'В веб-треке в этом блоке — лента «Xabarlar»: последние пять живых сообщений, пришедших, пока страница открыта. Если сайт закрыт, сообщение не приходит — напоминание браузера требует отдельной настройки.' }
          ] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'напишите три строки сами, нажмите «Скопировать», отправьте в Antigravity:' },
          prompt: { satrlar, joylar: A3_JOYLAR }, yordam: web ? A3_YORDAM_WEB : trek === 'mobil' ? A3_YORDAM_MOBIL : [...A3_YORDAM_MOBIL, ...A3_YORDAM_WEB] },
        { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "bu blokda Backend o'zgarmaydi, Render kutilmaydi. Mobil trekda paket qo'shilgach terminalda `r` — Expo Go ilovani qayta yuklaydi (bo'lmasa — `npx expo start` ni qayta ishga tushiring); web-trekda — `git push`, Netlify saytni odatda o'zi yangilaydi.", ru: 'в этом блоке Backend не меняется, Render не ждём. В мобильном треке после добавления пакета `r` в терминале — Expo Go перезагрузит приложение (если нет — перезапустите `npx expo start`); в веб-треке — `git push`, Netlify обычно сам обновляет сайт.' },
          err: XATO_GAP },
        { h: { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }, t: { uz: 'Mentor misolida, test holati bilan:', ru: 'В примере Ментора, с тестовым режимом:' },
          bandlar: [
            { uz: "(1) Agentga: «Test holati: eslatma «Qo'shilaman» bosilgandan bir daqiqa keyin chiqsin — vaqtincha. Faqat shu vaqtni o'zgartir va qaysi qatorni o'zgartirganingni ayt.»", ru: "(1) Агенту: «Тестовый режим: пусть напоминание появится через минуту после нажатия «Qo'shilaman» — временно. Измени только это время и скажи, какую строку изменил.»" },
            { uz: "(2) Siz qo'shilmagan o'yinga qo'shiling. Birinchi marta ilova ruxsat so'raydi — ruxsat bering. Ilovani yoping va bir daqiqa kuting: telefon ekranida «Maydon Jamoa» eslatmasi chiqishi kerak, soati va maydoni — o'sha o'yinniki. Test holatida «Bugun» so'zi kunga mos kelmasligi mumkin — soat va maydonni tekshiring.", ru: '(2) Присоединитесь к игре, в которой вас нет. В первый раз приложение спросит разрешение — разрешите. Закройте приложение и подождите минуту: на экране телефона должно появиться напоминание «Maydon Jamoa», время и поле — той игры. В тестовом режиме слово «Сегодня» может не совпасть с днём — проверьте время и поле.' },
            { uz: "(3) Yana bir o'yinga qo'shiling, bir daqiqa o'tmasdan «O'yindan chiqish»ni bosing va ilovani yoping: bir daqiqadan keyin eslatma chiqmasligi kerak.", ru: "(3) Присоединитесь ещё к одной игре, не дожидаясь минуты нажмите «O'yindan chiqish» и закройте приложение: через минуту напоминание не должно появиться." },
            { uz: "(4) Agentga: «Test holatini qaytar: eslatma o'yindan bir soat oldin.» Agent aytgan qatorda vaqt qaytganini ko'ring.", ru: '(4) Агенту: «Верни тестовый режим: напоминание за час до игры.» Посмотрите, что в названной агентом строке время вернулось.' },
            { uz: "Eslatma chiqmasa — avval telefon sozlamasini tekshiring: ruxsat bermagan bo'lsangiz, u yerdan yoqiladi.", ru: 'Если напоминание не появилось — сначала проверьте настройки телефона: если вы не дали разрешение, его включают там.' },
            { uz: 'Oxirida: `git status` → `git add <fayl>` → `git commit -m "eslatma"` → `git push`.', ru: 'В конце: `git status` → `git add <fayl>` → `git commit -m "eslatma"` → `git push`.' },
            { uz: "Web-trekda: agentga — «Tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan menga tegishli yozuvda ikki o'zgarish qil, `id` larini ayt.» → tasmada ikki qator, eng yangisi tepada; sahifani yangilang — tasma bo'sh; keyin agent akkaunt va yozuvlarni aytgan `id` lari bo'yicha o'chiradi.", ru: 'В веб-треке: агенту — «Открой новый аккаунт для проверки (с образцом имени и номера, не настоящими) и от его имени сделай два изменения в записи, которая касается меня, скажи их `id`.» → в ленте две строки, самая новая сверху; обновите страницу — лента пустая; потом агент удалит аккаунт и записи по названным `id`.' }
          ] }
      ]}
      natija={<NatijaA3 trek={trek} />}
      doneText={web ? { uz: 'Tasma ishlaydi: sahifa ochiq paytdagi xabarlar turadi, talabni o\'zingiz yozdingiz.', ru: 'Лента работает: сообщения, пока страница открыта, остаются, требование вы написали сами.' } : { uz: "Eslatma test holatida chiqdi, chiqilganda bekor bo'ldi: talabni o'zingiz yozdingiz.", ru: 'Напоминание появилось в тестовом режиме и отменилось при выходе: требование вы написали сами.' }}
      ulgur={{ uz: "Ulgurmasangiz: vaqt tugasa — yakun ekrani nima qolganini aytadi; Amaliyot 1 dagi «Ortda qoldingizmi» qatori bilan Mentor misolini ochib, qolgan qadamni o'z repo'ngizda tugatasiz.", ru: 'Если не успеваете: если время кончится — итоговый экран скажет, что осталось; через строку «Отстали» в Практике 1 откройте пример Ментора и закончите оставшийся шаг в своём репозитории.' }}
      ustoz={[{ uz: "Expo Go'da ruxsat oynasi Expo Go nomidan chiqishi mumkin — pilotda ko'riladi. Telefonda «Bezovta qilmang» rejimi yoqilgan bo'lsa, eslatma ovozsiz kelishi mumkin. Android'da eslatma bir necha daqiqa kechikishi mumkin. Navbatdan o'yinga o'tgan o'yinchiga eslatma qo'yilmaydi — birinchi versiya cheklovi; o'quvchi so'rasa, shunday deng.", ru: 'В Expo Go окно разрешения может появиться от имени Expo Go — проверяется в пилоте. Если на телефоне включён режим «Не беспокоить», напоминание может прийти без звука. На Android напоминание может задержаться на несколько минут. Игроку, перешедшему из очереди в игру, напоминание не ставится — ограничение первой версии; если ученик спросит, так и скажите.' }]}
    />
  );
};

// 🃏 KARTOCHKALAR — alohida ekran, Mentorsiz (SABOQ 12, 16); karta yuzi ingichka halqada, puls 3 marta (E 49)
const KARTALAR = [
  { front: { uz: 'Xona nima?', ru: 'Что такое комната?' }, back: { uz: "Backend'dagi ulanishlar guruhi", ru: 'Группа соединений в Backend' }, note: { uz: "Hodisa faqat shu guruhdagilarga boradi; Mentor misolida har o'yinning xonasi — `oyin-{id}`", ru: 'Событие идёт только тем, кто в этой группе; в примере Ментора комната каждой игры — `oyin-{id}`' } },
  { front: { uz: "«Hozir ko'ryapti» nimani sanaydi?", ru: "Что считает «Сейчас смотрят»?" }, back: { uz: 'Ekranni hozir ochib turgan ulanishlarni', ru: 'Соединения, у которых сейчас открыт экран' }, note: { uz: "Bitta odam ikki qurilmada — ikkita; ism ko'rsatilmaydi", ru: 'Один человек на двух устройствах — два; имена не показываются' } },
  { front: { uz: 'Nega `korayotganlar-ozgardi` sonning o\'zini olib keladi?', ru: 'Почему `korayotganlar-ozgardi` приносит само число?' }, back: { uz: "Bu son Database'da yo'q", ru: 'Этого числа нет в Database' }, note: { uz: 'U faqat Backend xotirasidagi ulanishlardan sanaladi', ru: 'Оно считается только по соединениям в памяти Backend' } },
  { front: { uz: 'Jonli xabar nima?', ru: 'Что такое живое сообщение?' }, back: { uz: 'Ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar', ru: 'Короткое сообщение на несколько секунд вверху экрана, пока приложение открыто' }, note: { uz: "Mentor misolida: «Shanba, 18:00 — joy bo'shadi: 8 / 10»", ru: 'В примере Ментора: «Суббота, 18:00 — освободилось место: 8 / 10»' } },
  { front: { uz: 'Mentor misolida jonli xabar kimga chiqadi?', ru: 'Кому в примере Ментора появляется живое сообщение?' }, back: { uz: "O'yin o'ziga tegishli bo'lgan o'yinchiga: qo'shilgan, navbatda turgan yoki e'lon qilgan", ru: 'Игроку, которого игра касается: присоединился, стоит в очереди или объявил' }, note: { uz: "O'z harakati uchun chiqmaydi; ism yo'q", ru: 'Для собственного действия не появляется; имени нет' } },
  { front: { uz: 'Eslatma nima?', ru: 'Что такое напоминание?' }, back: { uz: 'Telefon ekraniga chiqadigan xabar', ru: 'Сообщение на экране телефона' }, note: { uz: "Ilova yopiq bo'lsa ham chiqadi", ru: 'Появляется, даже если приложение закрыто' } },
  { front: { uz: 'Rejalashtirilgan eslatma nima?', ru: 'Что такое запланированное напоминание?' }, back: { uz: "Ilova o'zi oldindan vaqtini belgilab qo'ygan eslatma", ru: 'Напоминание, время которого приложение само заранее назначило' }, note: { uz: "Mentor misolida — «Qo'shilaman» bosilganda, o'yindan bir soat oldinga", ru: "В примере Ментора — при нажатии «Присоединяюсь», за час до игры" } },
  { front: { uz: 'Backend yuboradigan eslatma nima?', ru: 'Что такое напоминание, которое отправляет Backend?' }, back: { uz: 'Hodisa bo\'lganda Backend telefonga yuboradigan eslatma', ru: 'Напоминание, которое Backend отправляет на телефон при событии' }, note: { uz: "Inglizchasi: push notification. Alohida sozlash kerak, Expo Go'da ishlamaydi; bu modulda qurilmaydi", ru: 'По-английски: push notification. Нужна отдельная настройка, в Expo Go не работает; в этом модуле не строим' } },
  { front: { uz: "Mentor misolida ilova yopiq paytda joy bo'shasa, nima bo'ladi?", ru: 'Что будет в примере Ментора, если место освободится, пока приложение закрыто?' }, back: { uz: 'Telefonga hech narsa kelmaydi', ru: 'На телефон ничего не придёт' }, note: { uz: "Ilova ochilganda yangi son Backend'dan so'raladi", ru: 'Когда приложение откроется, новое число запросят у Backend' } },
  { front: { uz: "Eslatmaga ruxsat berilmasa, nima bo'ladi?", ru: 'Что будет, если не дать разрешение на напоминания?' }, back: { uz: 'Ilova ishlayveradi, eslatma chiqmaydi', ru: 'Приложение работает, напоминание не появляется' }, note: { uz: 'Ruxsat telefon sozlamalaridan yoqiladi', ru: 'Разрешение включается в настройках телефона' } },
  { front: { uz: 'Bu darsda test holati nima?', ru: 'Что такое тестовый режим на этом уроке?' }, back: { uz: 'Eslatma vaqtini vaqtincha bir daqiqadan keyinga qo\'yish', ru: 'Временно поставить время напоминания на минуту позже' }, note: { uz: 'Tekshirgach, vaqt qaytariladi', ru: 'После проверки время возвращают' } },
  { front: { uz: '«Xabarlar» tasmasi nima?', ru: 'Что такое лента «Xabarlar»?' }, back: { uz: 'Web-trekda sahifa ochiq paytda kelgan oxirgi beshta jonli xabar', ru: 'В веб-треке последние пять живых сообщений, пришедших, пока страница открыта' }, note: { uz: "Sayt yopiq bo'lsa, xabar kelmaydi — brauzer eslatmasi alohida sozlashni talab qiladi", ru: 'Если сайт закрыт, сообщение не приходит — напоминание браузера требует отдельной настройки' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('jx-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tr(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="jx-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204) + «Keyingi dars» qatori; uyga vazifa yo'q (tayanch 4: loyiha kuni). Sarlavha bloklar holatidan (har biri rost — E 54); ✓ yorlig'i faqat uchala blokda =====
const YAKUN_SARLAVHA = {
  uchala: { uz: "Uch qism ishlayapti: oxirgi talabni o'zingiz yozdingiz.", ru: 'Три части работают: последнее требование — ваше.' },
  a12mobil: { uz: 'Jonli xabar ishlaydi — eslatma qoldi.', ru: 'Живое сообщение есть — осталось напоминание.' },
  a12web: { uz: "Jonli xabar ishlaydi — «Xabarlar» tasmasi qoldi.", ru: 'Живое сообщение есть — осталась лента «Xabarlar».' },
  a1: { uz: "«Hozir ko'ryapti» ishlaydi — jonli xabar qoldi.", ru: "«Сейчас смотрят» есть — осталось живое сообщение." },
  a1yoq: { uz: "«Hozir ko'ryapti»ni telefonda tekshirish qoldi.", ru: "Осталось проверить «Сейчас смотрят» на телефоне." },
  yoq: { uz: 'Loyiha kuni hali tugamagan — qolgan qadamni tugating.', ru: 'День проекта не завершён — доделайте оставшееся.' }
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
  const bajarildi = (id) => { const i = SCREEN_META.findIndex(m => m.id === id); return !!(answers[i] && answers[i].solved); };
  const a1 = bajarildi('a1'), a2 = bajarildi('a2'), a3 = bajarildi('a3');
  const web = trekOqi() === 'web';
  const holat = a1 && a2 && a3 ? 'uchala' : a1 && a2 ? (web ? 'a12web' : 'a12mobil') : a1 ? 'a1' : (a2 || a3) ? 'a1yoq' : 'yoq';
  const RECAP = [
    { uz: "Xona — Backend'dagi ulanishlar guruhi: hodisa faqat shu guruhdagilarga boradi.", ru: 'Комната — группа соединений в Backend: событие идёт только тем, кто в этой группе.' },
    { uz: "«Hozir ko'ryapti» ochiq ekranlarni sanaydi, odamlarni emas.", ru: "«Сейчас смотрят» считает открытые экраны, а не людей." },
    { uz: "Mentor misolida jonli xabar faqat o'yinchiga tegishli o'zgarishda va ismsiz chiqadi.", ru: 'В примере Ментора живое сообщение появляется только при изменении, которое касается игрока, и без имени.' },
    { uz: 'Eslatmani tekshirish uchun test holatida vaqt vaqtincha qisqartiriladi, keyin qaytariladi.', ru: 'Чтобы проверить напоминание, в тестовом режиме время временно сокращают, потом возвращают.' },
    { uz: "Agent «bajardim» desa ham, talabning har gapini telefonda o'zingiz tekshirasiz.", ru: 'Даже если агент говорит «сделал», каждое предложение требования вы проверяете на телефоне сами.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className={cx('jx-yakun', holat !== 'uchala' && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Uch qism ishlaydi', ru: 'Три части работают' })}
          togri={correct} jami={total}
          sarlavha={tr(YAKUN_SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}>
          <p className="jx-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Ulanish uzilsa: buzamiz va tuzatamiz»</b>.</>, ru: <>Следующий урок — <b>«Если соединение оборвётся: ломаем и чиним»</b>.</> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function LiveNotifyDayLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, ScreenA1, Screen4, Screen5, ScreenA2, Screen7, ScreenA3, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI — real vaqt sahnasi (jx-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Telefon 172×272 hamma ekranda (SABOQ 22) === */
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .jx-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: jx-puls 2.2s ease-out .3s 3; }
        @keyframes jx-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        /* Variantlar va tanlov chiplari: guruh ramkasi yo'q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .jx-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: jx-chorla-v 1.8s ease-out .5s 2; }
        @keyframes jx-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .jx-halqa-g .q-chip:not(:disabled), .jx-chorla > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: jx-chorla-c 1.8s ease-out .5s 2; }
        @keyframes jx-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .jx-k.faol .q-variant:nth-child(2), .jx-halqa-g .q-chip:nth-child(2), .jx-chorla > .q-chip:nth-child(2) { animation-delay: .75s; }
        .jx-k.faol .q-variant:nth-child(3), .jx-halqa-g .q-chip:nth-child(3), .jx-chorla > .q-chip:nth-child(3) { animation-delay: 1s; }
        .jx-k { display: contents; }
        .jx-pop { display: inline-block; animation: jx-pop 0.55s cubic-bezier(.3,1.5,.5,1); color: ${T.accent}; }
        @keyframes jx-pop { 0% { transform: scale(1.45); } 100% { transform: scale(1); } }
        .jx-viz { display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
        p.jx-nom { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        p.jx-nom b { color: ${T.accent}; }
        /* Yashil xulosa ichida: taxmin qatori (kichik) · asosiy gap · izoh (kichik, ingichka ajratgich) — E 42 */
        .q-xulosa .jx-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .jx-x-tx b { color: ${T.ink}; } .q-xulosa .jx-x-tx.ok, .q-xulosa .jx-x-tx.ok b { color: ${T.ok}; } .q-xulosa .jx-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .jx-x-m { display: block; }
        .q-xulosa .jx-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        .jx-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .jx-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        /* Sahna joylashuvi: yot — bir qatorda; tik — telefonlar tepada, Backend pastda */
        .jx-sahna { user-select: none; -webkit-user-select: none; display: grid; gap: 0 10px; padding-top: 30px; justify-content: center; align-items: start; }
        .jx-sahna.yot.ikki { grid-template-columns: auto minmax(64px, 130px) auto minmax(64px, 130px) auto; grid-template-areas: "t1 c1 be c2 t2"; }
        .jx-sahna.yot.bir { grid-template-columns: auto minmax(64px, 130px) auto; grid-template-areas: "t1 c1 be"; }
        .jx-sahna.bes.yot.bir, .jx-sahna.bes.tik.bir { grid-template-columns: auto; grid-template-areas: "t1"; }
        .jx-sahna.tik.ikki { grid-template-columns: 172px 172px; column-gap: 12px; grid-template-areas: "t1 t2" "c1 c2" "be be"; }
        .jx-sahna.tik.bir { grid-template-columns: auto; grid-template-areas: "t1" "c1" "be"; justify-items: center; }
        .jx-s-t1 { grid-area: t1; } .jx-s-t2 { grid-area: t2; } .jx-s-c1 { grid-area: c1; } .jx-s-c2 { grid-area: c2; } .jx-s-be { grid-area: be; justify-self: center; }
        .jx-sahna.tik .jx-s-c1, .jx-sahna.tik .jx-s-c2 { justify-self: center; }
        /* Tik sahnada ustunlar bo'yi har xil bo'lsa (telefon ostida sahna tugmasi), qisqa ustunda chiziq telefondan boshlanadi — chiziq havoda qolmaydi (E 46) */
        .jx-sahna.tik .jx-s-t1, .jx-sahna.tik .jx-s-t2 { align-self: stretch; display: flex; flex-direction: column; align-items: center; }
        .jx-sahna.tik .jx-s-t1:is(.h-ochiq, .h-xira)::after, .jx-sahna.tik .jx-s-t2:is(.h-ochiq, .h-xira)::after { content: ''; flex: 1; width: 3px; min-height: 0; }
        .jx-sahna.tik .h-ochiq::after { background: ${T.ok}; } .jx-sahna.tik .h-xira::after { background: ${T.ink2}; opacity: 0.25; }
        /* Telefon */
        .jx-tel-ust { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; width: 172px; }
        .jx-tel-yorliq { position: absolute; top: -28px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 999px; white-space: nowrap; }
        .jx-tel-yorliq.b1 { background: ${T.accentSoft}; color: ${T.accent}; } .jx-tel-yorliq.b2 { background: ${fon(T.ink, 0.08)}; color: ${T.ink}; }
        .jx-tel-yorliq.tex { position: static; transform: none; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink2}; }
        .jx-telefon { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 5px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .jx-telefon.yopiq { background: ${fon(T.ink, 0.86)}; transition: background 0.4s; }
        .jx-tel-bar { display: flex; align-items: center; justify-content: center; height: 18px; flex: none; }
        .jx-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: ${MAYDON_RANG}; letter-spacing: 0.01em; }
        .jx-tel-ekran { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; animation: jx-ekran 0.35s ease-out both; }
        @keyframes jx-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        .jx-oyin { display: flex; flex-direction: column; gap: 3px; flex: 1; min-height: 0; }
        .jx-orqaga { align-self: flex-start; padding: 1px 6px; margin-left: -4px; border: 0; border-radius: 7px; background: transparent; font-family: 'Manrope'; font-size: 11px; font-weight: 700; color: ${T.ink2}; cursor: pointer; }
        .jx-orqaga:disabled { cursor: default; }
        .jx-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .jx-oyin-joy { font-size: 12px; color: ${T.ink2}; }
        .jx-hisob { display: inline-flex; align-items: baseline; gap: 6px; align-self: flex-start; margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${T.ink2}; }
        .jx-son { display: inline-block; font-size: 22px; font-weight: 800; color: ${T.ink}; }
        .jx-son.jx-pop { color: ${T.accent}; }
        .jx-kor { align-self: flex-start; display: inline-flex; align-items: baseline; gap: 5px; padding: 2px 8px; border-radius: 999px; background: ${fon(T.ok, 0.1)}; font-size: 11.5px; font-weight: 700; color: ${T.ok}; }
        .jx-kor b { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${T.ink}; }
        .jx-oyin-past { margin-top: auto; display: flex; flex-direction: column; gap: 5px; }
        .jx-qoshil, .jx-chiqish { flex: none; display: flex; align-items: center; justify-content: center; height: 28px; border: 0; border-radius: 10px; font-family: 'Manrope'; font-size: 12px; font-weight: 800; cursor: pointer; transition: background 0.3s, color 0.3s; }
        .jx-qoshil { background: ${T.accent}; color: #fff; }
        .jx-qoshil:disabled { cursor: default; } .jx-qoshil:disabled:not(.off) { background: ${fon(T.accent, 0.16)}; color: ${T.accent}; }
        .jx-qoshil.off { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .jx-chiqish { background: ${T.paper}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.ink}; animation: fade-in-up 0.35s ease-out both; }
        .jx-chiqish:disabled { cursor: default; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .jx-oyinlar { display: flex; flex-direction: column; gap: 5px; flex: 1; min-height: 0; }
        .jx-ol-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .jx-kun { font-size: 11px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.04em; }
        .jx-karta { display: flex; flex-direction: column; align-items: flex-start; gap: 1px; padding: 6px 8px; border-radius: 9px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'Manrope'; font-size: 11px; line-height: 1.3; color: ${T.ink2}; text-align: left; cursor: pointer; }
        .jx-karta:disabled { cursor: default; }
        .jx-karta b { font-size: 12px; color: ${T.ink}; }
        .jx-karta-son { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; }
        /* Ilova yopiq — telefon ekrani: soat, kun, eslatma kartasi (telefonning kulrang kartasi), ilova belgisi */
        .jx-qulf { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; padding-top: 12px; color: ${T.paper}; }
        .jx-qulf-soat b { display: inline-block; font-family: 'Manrope'; font-size: 32px; font-weight: 300; letter-spacing: 0.02em; color: ${T.paper}; line-height: 1.1; }
        .jx-qulf-soat b.jx-pop { color: ${T.paper}; }
        .jx-qulf-kun { font-size: 12px; font-weight: 600; opacity: 0.8; margin-bottom: 8px; }
        .jx-eslatma { align-self: stretch; display: flex; flex-direction: column; gap: 1px; padding: 7px 9px; border-radius: 12px; background: ${fon(T.paper, 0.9)}; color: ${T.ink}; text-align: left; animation: jx-tush 0.5s cubic-bezier(.3,1.3,.5,1) both; }
        @keyframes jx-tush { from { opacity: 0; transform: translateY(-34px); } to { opacity: 1; transform: none; } }
        .jx-es-nom { font-size: 11px; font-weight: 800; color: ${MAYDON_RANG}; }
        .jx-es-m { font-size: 11.5px; line-height: 1.3; color: ${T.ink}; }
        .jx-es-y { font-style: normal; font-size: 10px; font-weight: 700; color: ${T.ink2}; margin-top: 2px; }
        .jx-ilova { margin-top: auto; align-self: flex-start; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 0 0 6px 6px; }
        .jx-ilova-sh { width: 40px; height: 40px; border-radius: 12px; background: ${MAYDON_RANG}; box-shadow: inset 0 -5px 0 ${fon(T.ink, 0.18)}; }
        .jx-ilova-t { font-size: 10px; font-weight: 700; color: ${T.paper}; }
        /* Jonli xabar — ilova ichida, ilova ranglarida: tepadan tushadi, bir necha soniyadan keyin ko'tarilib yo'qoladi */
        .jx-jonli { position: absolute; left: 6px; right: 6px; top: 6px; z-index: 3; display: flex; flex-direction: column; gap: 1px; padding: 7px 9px; border-radius: 12px; background: ${T.ink}; color: ${T.paper}; box-shadow: 0 10px 22px -10px rgba(${T.shadowBase},0.6); animation: jx-tush 0.45s cubic-bezier(.3,1.3,.5,1) both; }
        .jx-jonli b { font-size: 10.5px; font-weight: 800; color: ${fon(T.ok, 1)}; filter: brightness(1.6); }
        .jx-jonli span { font-size: 11.5px; line-height: 1.3; }
        .jx-jonli.ket { animation: jx-kot 0.4s ease-in both; }
        @keyframes jx-kot { to { opacity: 0; transform: translateY(-40px); } }
        /* Ruxsat oynasi — umumiy chizma (haqiqiy yozuv tekshirilmagan): matn chiziqlari va ikki tugma shakli */
        .jx-ruxsat { position: absolute; left: 4px; right: 4px; top: 50%; transform: translateY(-50%); z-index: 3; display: flex; flex-direction: column; gap: 6px; padding: 12px 10px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 12px 28px -8px rgba(${T.shadowBase},0.55), 0 0 0 1px ${T.line}; }
        .jx-rx-q { display: block; height: 6px; border-radius: 3px; background: ${fon(T.ink, 0.18)}; width: 70%; } .jx-rx-q.uzun { width: 92%; } .jx-rx-q.qisqa { width: 48%; }
        .jx-rx-t { display: flex; gap: 8px; margin-top: 4px; } .jx-rx-t i { flex: 1; height: 20px; border-radius: 8px; border: 1.5px solid ${fon(T.ink, 0.25)}; }
        .jx-qadam { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 4px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; font-weight: 700; color: ${T.ink}; white-space: nowrap; }
        .jx-qadam i { width: 20px; height: 20px; border-radius: 50%; background: ${T.accent}; color: #fff; font-style: normal; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; }
        /* Sahna tugmalari — haqiqiy ilovada yo'q: ramkadan tashqarida, chegarali (ilova tugmasidan ajralib turadi) */
        .jx-yopish, .jx-soat { padding: 7px 12px; border: 1.5px solid ${T.ink}; border-radius: 10px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-size: 12.5px; font-weight: 800; cursor: pointer; white-space: nowrap; }
        .jx-yopish:disabled, .jx-soat:disabled { cursor: default; }
        .jx-yopish.xira, .jx-soat.xira { opacity: 0.4; } .jx-yopish:disabled:not(.xira) { border-color: ${T.line}; color: ${T.ink2}; }
        .jx-korinmadi { padding: 3px 9px; border-radius: 999px; background: ${fon(T.ink, 0.07)}; color: ${T.ink2}; font-size: 11.5px; font-weight: 700; white-space: nowrap; }
        .jx-soat-q { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .jx-soat-k { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: ${T.ink2}; padding: 2px 9px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; }
        /* Backend tuguni va xona doirasi */
        .jx-be-ust { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .jx-sahna.yot .jx-be-joy { height: 272px; display: flex; align-items: center; justify-content: center; }
        /* Sahna tugmasi «17:00 ga o'tkazish» Backend ustida (yot) — Backend chiziq bilan bir balandlikda qoladi; tik sahnada Backend ostida */
        .jx-sahna.yot .jx-be-joy { position: relative; }
        .jx-sahna.yot .jx-be-yuqori { position: absolute; left: 50%; bottom: calc(50% + 48px); transform: translateX(-50%); }
        .jx-sahna.tik .jx-be-joy { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .jx-sahna.tik .jx-be-yuqori { order: 1; }
        .jx-backend { display: flex; flex-direction: column; align-items: center; gap: 7px; min-width: 132px; max-width: 200px; padding: 12px 14px; border-radius: 16px; background: ${T.ink}; color: ${T.paper}; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.6); }
        .jx-be-nom { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
        .jx-db { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 2px 9px; border-radius: 7px; background: ${fon(T.paper, 0.12)}; }
        .jx-db b { color: ${T.paper}; } .jx-db b.jx-pop { color: ${T.accent}; }
        .jx-xona { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 8px 12px 10px; border-radius: 999px; border: 1.5px dashed ${fon(T.paper, 0.5)}; min-width: 96px; }
        .jx-xona-y { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${fon(T.paper, 0.85)}; }
        .jx-xona-n { display: flex; gap: 8px; min-height: 14px; }
        .jx-nuqta { width: 14px; height: 14px; border-radius: 50%; background: ${T.paper}; }
        .jx-nuqta.kirdi { animation: jx-kirdi-n 1.1s ease-out both; }
        @keyframes jx-kirdi-n { 0% { opacity: 0; transform: scale(0.3); background: ${T.accent}; } 30% { opacity: 1; transform: scale(1.25); background: ${T.accent}; } 70% { background: ${T.accent}; } 100% { transform: scale(1); background: ${T.paper}; } }
        .jx-nuqta.chiqdi { animation: jx-sondi 0.7s ease-in both; }
        @keyframes jx-sondi { to { opacity: 0; transform: scale(0.4); } }
        /* Chiziq va konvert */
        .jx-chiziq { position: relative; }
        .jx-chiziq.yot { height: 272px; min-width: 64px; }
        .jx-chiziq.tik { height: 50px; width: 30px; }
        .jx-chiziq-i { position: absolute; display: block; opacity: 0; transition: opacity 0.4s, background 0.4s; }
        .jx-chiziq.yot .jx-chiziq-i { left: 0; right: 0; top: calc(50% - 1.5px); height: 3px; }
        .jx-chiziq.tik .jx-chiziq-i { top: 0; bottom: 0; left: calc(50% - 1.5px); width: 3px; }
        .jx-chiziq.h-ochiq .jx-chiziq-i { opacity: 1; background: ${T.ok}; animation: jx-ochiq 2.6s ease-in-out infinite; }
        @keyframes jx-ochiq { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; } 50% { box-shadow: 0 0 9px 1px ${fon(T.ok, 0.45)}; } }
        .jx-chiziq.h-xira .jx-chiziq-i { opacity: 0.25; background: ${T.ink2}; }
        .jx-chiziq-y { position: absolute; z-index: 2; left: 50%; top: calc(50% + 14px); transform: translateX(-50%); padding: 1px 8px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; font-family: 'Manrope'; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .jx-chiziq.tik .jx-chiziq-y { top: 50%; left: calc(50% + 14px); transform: translateY(-50%); }
        .jx-ikkinchi { position: absolute; left: 0; right: 0; top: calc(50% + 30px); display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .jx-ikkinchi i { display: block; width: 100%; height: 0; border-top: 2px dashed ${fon(T.ink, 0.35)}; transform-origin: right center; animation: jx-chizx 0.7s ease-out both; }
        .jx-ikkinchi b { font-size: 11px; font-weight: 700; line-height: 1.3; color: ${T.ink2}; text-align: center; max-width: 140px; }
        @keyframes jx-chizx { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .jx-chiziq.tik .jx-ikkinchi { top: 0; bottom: 0; left: calc(50% + 10px); right: auto; width: 150px; flex-direction: row; align-items: center; }
        .jx-chiziq.tik .jx-ikkinchi i { width: 0; height: 100%; border-top: 0; border-left: 2px dashed ${fon(T.ink, 0.35)}; }
        .jx-kv { position: absolute; z-index: 4; display: flex; flex-direction: column; align-items: center; gap: 2px; pointer-events: none; animation-duration: 0.9s; animation-timing-function: ease-in-out; animation-fill-mode: both; }
        .jx-chiziq.yot .jx-kv { top: 50%; transform: translate(-50%, -28%); }
        .jx-chiziq.tik .jx-kv { left: 50%; transform: translate(-50%, -50%); }
        .jx-kv-i { position: relative; display: block; width: 26px; height: 18px; border-radius: 4px; background: ${T.paper}; border: 1.5px solid ${T.accent}; overflow: hidden; flex: none; }
        .jx-kv-i::before { content: ''; position: absolute; left: 50%; top: -9px; width: 15px; height: 15px; border: 1.5px solid ${T.accent}; transform: translateX(-50%) rotate(45deg); }
        .jx-kv.hodisa .jx-kv-i { background: ${T.accent}; } .jx-kv.hodisa .jx-kv-i::before { border-color: ${T.paper}; }
        .jx-kv-y { order: -1; display: flex; flex-direction: column; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; padding: 1px 6px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; white-space: nowrap; }
        .jx-kv-y em { font-style: normal; font-weight: 500; font-size: 10px; color: ${T.ink2}; }
        .jx-kv.hodisa .jx-kv-y { color: ${T.accent}; border-color: ${fon(T.accent, 0.45)}; }
        @keyframes jx-kv-x-ab { from { left: 0%; } to { left: 100%; } }
        @keyframes jx-kv-x-ba { from { left: 100%; } to { left: 0%; } }
        @keyframes jx-kv-y-ab { from { top: 0%; } to { top: 100%; } }
        @keyframes jx-kv-y-ba { from { top: 100%; } to { top: 0%; } }
        /* 0-ekran: eslatmadan «Qo'shildingiz» kartasiga uzuq chiziq va yorliq (U-041: faqat bog'lanish) */
        .jx-k0 { position: relative; display: flex; justify-content: center; padding: 30px 150px 0 0; }
        .jx-qk { padding: 5px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; color: ${T.ink2}; white-space: nowrap; }
        .jx-qk b { color: ${T.ok}; }
        .jx-uzuq { position: absolute; top: calc(30px + 110px); height: 186px; left: calc(50% - 75px + 86px + 8px); width: 16px; border: 1.5px dashed ${T.accent}; border-left: 0; border-radius: 0 9px 9px 0; transform-origin: center top; animation: jx-chizy 0.6s ease-out both; }
        .jx-uzuq b { position: absolute; left: 24px; top: 50%; transform: translateY(-50%); font-size: 11.5px; font-weight: 700; color: ${T.accent}; white-space: nowrap; animation: fade-in-up 0.4s ease-out 0.4s both; }
        @keyframes jx-chizy { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .jx-reja-chap { display: flex; justify-content: center; }
        p.jx-reja-past { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        p.jx-reja-past2 { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .jx-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; font-size: 13px; color: ${T.ink2}; }
        .jx-ustoz b { color: ${T.ink}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        /* Amaliyot bloklari */
        .jx-trek { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .jx-trek-g { display: inline-flex; gap: 6px; padding: 3px; border-radius: 12px; }
        .jx-band { display: block; margin-top: 6px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .jx-prompt { margin-top: 8px; }
        .jx-ps { display: block; margin: 3px 0; font-size: 13px; line-height: 1.55; }
        .jx-ps-l { display: flex; flex-direction: column; gap: 3px; }
        .jx-ps-y { font-weight: 700; }
        .jx-joy-i { display: inline-block; vertical-align: baseline; width: 24ch; max-width: 100%; min-height: 26px; padding: 3px 8px; margin: 1px 2px; border: 1.5px solid ${fon(T.accent, 0.45)}; border-radius: 8px; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; resize: none; overflow: hidden; }
        .jx-joy-i.blok, .jx-ps-l .jx-joy-i { display: block; width: 100%; margin: 2px 0; }
        .jx-joy-i.bosh { border-style: dashed; background: ${T.bg}; }
        .jx-joy-i:focus { outline: 2px solid ${fon(T.accent, 0.5)}; outline-offset: 1px; border-style: solid; }
        .jx-halqa-i { animation: jx-puls 2.2s ease-out .3s 3; }
        .jx-joy-n { display: inline; margin-left: 6px; font-size: 12px; color: ${fon(T.ink, 0.5)}; font-style: italic; }
        .jx-ps-l .jx-joy-n { margin-left: 0; }
        .jx-joy-s { display: block; font-size: 12px; color: ${T.ink2}; }
        .jx-joy-tak { font-weight: 700; color: ${T.ink}; } .jx-joy-tak.bosh { color: ${T.accent}; font-weight: 600; }
        .jx-yordam-btn { margin-top: 6px; }
        .jx-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px dashed ${T.line}; }
        .jx-yordam-s { display: block; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; } .jx-yordam-s.web { color: ${T.ink2}; }
        p.jx-ortda, p.jx-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        p.jx-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.bg}; }
        .jx-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 1px 6px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; }
        .jx-natija { display: flex; flex-direction: column; align-items: center; gap: 10px; padding-top: 4px; }
        .jx-fayllar { display: flex; flex-direction: column; gap: 4px; width: 100%; max-width: 320px; padding: 8px 10px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .jx-fayl { display: flex; justify-content: space-between; gap: 10px; font-size: 12px; }
        .jx-fayl code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; overflow-wrap: anywhere; }
        .jx-fayl em { font-style: normal; color: ${T.ok}; font-weight: 700; white-space: nowrap; }
        .jx-brauzer { width: 100%; max-width: 320px; border: 1.5px solid ${T.ink}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .jx-br-bar { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .jx-br-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; }
        .jx-br-bar code { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .jx-br-tana { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 12px; min-height: 150px; }
        .jx-br-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .jx-br-q { font-size: 12px; color: ${T.ink2}; }
        .jx-br-jonli { align-self: stretch; padding: 7px 10px; border-radius: 10px; background: ${T.ink}; color: ${T.paper}; font-size: 12px; animation: jx-tush 0.45s cubic-bezier(.3,1.3,.5,1) both; }
        .jx-br-jonli.ket { animation: jx-kot 0.4s ease-in both; }
        .jx-tasma { align-self: stretch; display: flex; flex-direction: column; gap: 5px; }
        .jx-tasma-q { padding: 6px 9px; border-radius: 9px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; color: ${T.ink}; }
        .jx-tasma-q.yangi { animation: jx-tush 0.45s ease-out both; border-color: ${fon(T.ok, 0.5)}; }
        .jx-rc-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px, 2vw, 17px); color: ${T.ink}; padding: 6px 14px; border-radius: 10px; background: ${fon(T.ink, 0.06)}; }
        /* Kartochkalar va yakun */
        .jx-flash { display: flex; flex-direction: column; gap: 10px; }
        .jx-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: jx-puls 1.8s ease-out .4s 3; }
        p.jx-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.jx-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .jx-yakun { flex: 1 0 auto; display: flex; flex-direction: column; min-height: 0; }
        .jx-yakun.belgisiz .done-chip { display: none; }
        .jx-yakun .q-yakun > .ach-coll { order: 1; }
        p.jx-keyingi { margin: 0; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
        p.jx-keyingi b { color: ${T.ink}; }
        @media (max-width: 640px) {
          .jx-sahna { padding-top: 64px; }
          .jx-k0 { justify-content: flex-start; padding: 30px 0 0 8px; }
          .jx-uzuq { left: calc(8px + 172px + 8px); }
        }
        @media (max-width: 400px) {
          .jx-sahna.tik.ikki { grid-template-columns: 168px 168px; column-gap: 6px; }
          .jx-sahna.tik.ikki .jx-tel-ust, .jx-sahna.tik.ikki .jx-telefon { width: 168px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .jx-halqa, .jx-halqa-i, .jx-k.faol .q-variant, .jx-halqa-g .q-chip, .jx-chorla > .q-chip, .jx-flash.yangi .fc-card .fc-front { animation: none !important; }
          .jx-kv { display: none !important; }
          .jx-pop, .jx-chiziq-i, .jx-tel-ekran, .jx-eslatma, .jx-jonli, .jx-nuqta, .jx-uzuq, .jx-uzuq b, .jx-ikkinchi i, .jx-chiqish, .jx-br-jonli, .jx-tasma-q { animation: none !important; transition: none !important; }
          .jx-jonli.ket, .jx-br-jonli.ket, .jx-nuqta.chiqdi { opacity: 0; }
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
