import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul 8-dars «Loyiha kuni: ketayotgan foydalanuvchini qaytarish» — skeletdan (08.10.2026, 2-to'lqin); MD: feedback/F-1007-13modul/08-WinBackDay-v3.md
// Qurilgan: 08.10.2026 (2-to'lqin, B) — 12 ekran: s0 QKirish · s1 QReja · s2 QTushuncha · a1 QBlok · s4 test · s5 QTushuncha · a2 QBlok · s7 test · a3 QBlok · podium · QKartochka · QYakun.
// Bitta vizual — TgSahna («telefon · Backend · Telegram»); bloklar — ScreenBlok + QBlok + tekshiruv kartasi «Kutilganidek»/«Boshqacha» (dars holatida). Yangi saqlash kaliti yo'q; o'qiydi: pm-m9d8-platforma.trek.
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

const LESSON_META = { lessonId: 'm11-08-v1', lessonTitle: { uz: 'Loyiha kuni: ketayotgan foydalanuvchini qaytarish', ru: 'День проекта: вернуть уходящего пользователя' } };
// 12 ekran · oqim: kirish → reja → tushuncha → amaliyot 1 → 1-savol → tushuncha → amaliyot 2 → 2-savol → amaliyot 3 → podium → kartochkalar → yakun (MD v3; final tartib-mashqi yo'q — loyiha kuni, 172)
const HW_TOKENS = [
  { t: { uz: 'Telegram xabari', ru: 'сообщение Telegram' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'bot', ru: 'бот' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'chat raqami', ru: 'номер чата' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'sanoq', ru: 'счёт' }, l: 78, tp: 68, s: 13, d: 6.8 }
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

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal, deskSignal }) => {
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
  // 199-qonun (SABOQ P11): kompyuterda ham tugash signalida natija pastki panel ostida qolmasin — faqat signal o'zgarganda, birinchi chizishda emas
  const deskOld = useRef(deskSignal);
  useEffect(() => {
    if (deskOld.current === deskSignal) return;
    deskOld.current = deskSignal;
    if (!deskSignal || isNarrow) return;
    const el = contentRef.current;
    if (!el) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => { if (el && el.scrollHeight > el.clientHeight + 1) el.scrollTo({ top: el.scrollHeight, behavior: kam ? 'auto' : 'smooth' }); }, 900);
    return () => clearTimeout(t);
  }, [deskSignal, isNarrow]);
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `s15` — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi — shu map ular bilan sinxron bo'lsin.
// ⚡ To'g'ri javob pozitsiyalari ATAYIN har xil (3 · 0 · 2 · 3) — «doim A» naqshi yo'q, o'qimay bosgan ball to'plamaydi.
// s15 (yakuniy debug) — REAL kalit: picked=0 → 1-urinishda topdi (to'g'ri), picked=1 → 1-urinishda xato bosdi.
const INLINE_KEYS = { s4: 2, s7: 1, practice: -1 };
// 📖 RECAPS — har ballik testga 3 karta (kalit = ekran INDEKSI; S-026: raqam)
const rcRaqam = (n) => <b className="wb-rc-n">{n}</b>;
const RECAPS = {
  4: {
    title: { uz: "Bot faqat «Start»ni bosgan odamga yozadi", ru: 'Бот пишет только тому, кто нажал «Start»' },
    cards: [
      { ic: null, h: { uz: "Ilovada «Telegram'da xabar olish» — havolada bir martalik kod.", ru: "В приложении «Telegram'da xabar olish» — в ссылке одноразовый код." }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: "Botda «Start» — Backend chat raqamini oladi.", ru: 'В боте «Start» — Backend получает номер чата.' }, body: { uz: rcRaqam(2), ru: rcRaqam(2) } },
      { ic: null, h: { uz: 'Shundan keyingina bot xabar yoza oladi.', ru: 'Только после этого бот может написать.' }, body: { uz: rcRaqam(3), ru: rcRaqam(3) }, ask: { uz: 'Bot odamni o\'zi qidirib topib, unga yoza oladimi?', ru: 'Может ли бот сам найти человека и написать ему?' } }
    ]
  },
  7: {
    title: { uz: 'Telegram xabari kimga ketadi', ru: 'Кому уходит сообщение Telegram' },
    cards: [
      { ic: null, h: { uz: "O'tgan hafta shu o'yinda qatnashgan.", ru: 'На прошлой неделе участвовал в этой игре.' }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: "Botni o'zi ulagan — ilova telefonda bo'lishi shart emas.", ru: 'Сам подключил бота — приложение на телефоне не обязательно.' }, body: { uz: rcRaqam(2), ru: rcRaqam(2) } },
      { ic: null, h: { uz: 'Bu hafta ikkitadan kam Telegram xabari olgan.', ru: 'На этой неделе получил меньше двух сообщений Telegram.' }, body: { uz: rcRaqam(3), ru: rcRaqam(3) }, ask: { uz: "Telegram xabarlarini o'chirgan odamga xabar ketadimi?", ru: 'Уйдёт ли сообщение человеку, отключившему сообщения Telegram?' } }
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

// ===== BITTA VIZUAL — «telefon · Backend · Telegram» sahnasi (163/180): bitta manba TG_SAHNA + QAYTISH_SONLAR + QAYTMAGAN_JAVOBLAR + TG_XABAR + BOT_JAVOBLARI + KIMGA_OYINCHILAR + KATAKLAR + TEKSHIRUV_OYINLARI + SIYOSAT_QATORI =====
// Telefon chapda (170×272, SABOQ 22), yorliq ramka ustida (SABOQ 23); o'ngda Backend (tepada) va Telegram tuguni (pastda). Chiziqlar: telefon ↔ Backend · Backend ↔ Telegram · Telegram ↔ telefon; konvert chiziq bo'ylab uchadi.
// Chat raqami, Telegram nomi, odam ismi hech bir holatda chizilmaydi; bot nomi — «…_bot»; odam chizilmaydi (SABOQ P1); logotip yo'q (D4). reduced-motion — konvert yurmaydi, holatlar kechikishsiz (DE-200).
// qolip-maket: tg-shanba tg-ulash tg-start tg-tekshir tg-ochir wb-sahna-btn wb-il-q wb-chat-start wb-trek wb-nusxa wb-tk-btn wb-yordam-btn wb-ai-btn wb-halqa on ok err
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Sahna qadamlari ketma-ket: [[kechikish ms, fn], …]; ekran yopilsa taymerlar tozalanadi
function useKetma() {
  const taymer = useRef([]);
  useEffect(() => () => taymer.current.forEach(clearTimeout), []);
  return useCallback((qadamlar) => {
    const tez = kamHarakat();
    let vaqt = 0;
    for (const [ms, fn] of qadamlar) { vaqt += tez ? 0 : ms; taymer.current.push(setTimeout(fn, vaqt)); }
  }, []);
}
const lsOqi = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsYoz = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* xotira yopiq */ } };
const nusxala = async (matn) => { try { await navigator.clipboard.writeText(matn); return true; } catch { return false; } };
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };

// «Maydon Jamoa» — 11-Modul 9.62 yashili (9–13-Modul darslaridagi rang bilan bir); Telegram — o'z rangida, logotipsiz
const MAYDON_RANG = '#2E9E4F';
const TG_RANG = '#229ED9';
const TG_SAHNA = {
  telefon: { uz: "1-telefon · o'yinchi", ru: '1-й телефон · игрок' },
  mentorTel: { uz: '1-telefon · Mentor', ru: '1-й телефон · Ментор' },
  bot: '…_bot',
  kodHavola: 't.me/…_bot?start=k7Q…',
  havola: '…netlify.app/?kanal=telegram',
  oyin: { uz: 'Shanba, 18:00 · Mahalla maydoni · doimiy', ru: 'Суббота, 18:00 · Mahalla maydoni · постоянная' },
  namunaOyin: { uz: 'Shanba, 18:00 · Mahalla maydoni · 8 / 10', ru: 'Суббота, 18:00 · Mahalla maydoni · 8 / 10' },
  keyingiOyin: { uz: "keyingi Shanba, 18:00 · 0 / 10 · yana e'lon qilindi", ru: 'следующая суббота, 18:00 · 0 / 10 · снова объявлена' },
  navbatOyin: { uz: "Shanba, 18:00 · 0 / 10 · yana e'lon qilindi", ru: 'Суббота, 18:00 · 0 / 10 · снова объявлена' },
  tgYoq: { uz: 'Telegram: ulanmagan', ru: 'Telegram: не подключён' },
  tgBor: { uz: 'Telegram: ulangan', ru: 'Telegram: подключён' },
  kalit: { uz: 'maxfiy kalit ✓', ru: 'секретный ключ ✓' },
  kalitK: { uz: 'maxfiy kalit', ru: 'секретный ключ' },
  botShu: { uz: 'bot shu yerda', ru: 'бот здесь' },
  olish: { uz: "Telegram'da xabar olish", ru: "Telegram'da xabar olish" },
  ulangan: { uz: 'Telegram ulangan', ru: 'Telegram ulangan' },
  ochirish: { uz: "Telegram xabarlarini o'chirish", ru: "Telegram xabarlarini o'chirish" },
  chiqish: { uz: 'Hisobdan chiqish', ru: 'Hisobdan chiqish' },
  osti: { uz: "Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa — Telegram'da xabar; haftasiga ko'pi bilan ikkita", ru: 'Если «Doimiy o\'yin», в которой вы участвовали, снова объявят — сообщение в Telegram; не больше двух в неделю' },
  yopiq: { uz: 'Maydon Jamoa ilovasi yopiq', ru: 'Приложение Maydon Jamoa закрыто' },
  hamYopiq: { uz: 'Maydon Jamoa ilovasi hali ham yopiq', ru: 'Приложение Maydon Jamoa всё ещё закрыто' },
  ochdi: { uz: "o'yinchi ilovani ochdi", ru: 'игрок открыл приложение' },
  kimdir: { uz: 'kimdir ilovani ochdi', ru: 'кто-то открыл приложение' },
  chatYoq: { uz: "chat raqami yo'q — bot birinchi yozolmaydi", ru: 'номера чата нет — бот не может написать первым' },
  bilmaydi: { uz: "ilova yopiq — yangi o'yinni bilmaydi", ru: 'приложение закрыто — о новой игре не знает' },
  sanoq: { uz: "Telegram'dan ochdi · +1", ru: 'Открыли из Telegram · +1' }
};
// 0-ekran: 12-Modul sanog'i (qurilma) va Mentorga yozilgan besh javob (odam) — ikki alohida yorliq, bir-biridan ayirilmaydi (tayanch 1.13)
const QAYTISH_SONLAR = {
  yorliq: { uz: "12-Modul sanog'i · qurilma, ismsiz", ru: 'Счёт 12-го модуля · устройства, без имён' },
  qatorlar: [
    { k: { uz: '1-hafta · ilovani ochgan', ru: '1-я неделя · открыли приложение' }, n: 61 },
    { k: { uz: '2-hafta · ulardan yana ochgan', ru: '2-я неделя · из них открыли снова' }, n: 26 },
    { k: { uz: 'yana ochmagan', ru: 'больше не открыли' }, n: 35 }
  ]
};
const QAYTMAGAN_JAVOBLAR = {
  yorliq: { uz: "Mentor so'ragan tanishlar · odam", ru: 'Знакомые, которых спросил Ментор · люди' },
  qatorlar: [
    { tur: 'bilmadi', t: { uz: "«Yangi o'yin chiqqanini bilmadim»", ru: '«Не знал, что вышла новая игра»' } },
    { tur: 'bilmadi', t: { uz: "«Yangi o'yin chiqqanini bilmadim»", ru: '«Не знал, что вышла новая игра»' } },
    { tur: 'bilmadi', t: { uz: "«Yangi o'yin chiqqanini bilmadim»", ru: '«Не знал, что вышла новая игра»' } },
    { tur: 'ochirdi', t: { uz: "«Telefonda joy qolmadi, ilovani o'chirdim»", ru: '«На телефоне не осталось места, удалил приложение»' } },
    { tur: 'javobsiz', t: { uz: 'javob bermadi', ru: 'не ответил' } }
  ],
  izoh: { uz: '5 kishi — kichik son: sabab haqida dalil, isbot emas.', ru: '5 человек — маленькое число: это довод о причине, а не доказательство.' }
};
// Telegram xabari — faqat o'zgarish (kun, soat, joy); son yozilmaydi — eskiradi, joriy son havolada (F-1007-466)
const TG_XABAR = {
  shablon: { uz: "{kun}, {soat} o'yini yana e'lon qilindi · {maydon}", ru: 'Игра {kun}, {soat} снова объявлена · {maydon}' },
  matn: (soat) => ({ uz: `Shanba, ${soat} o'yini yana e'lon qilindi · Mahalla maydoni`, ru: `Игра в субботу, ${soat} снова объявлена · Mahalla maydoni` })
};
const BOT_JAVOBLARI = {
  ulandi: { uz: "Ulandi. Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa, shu yerga yozaman. O'chirish — ilovada.", ru: "Подключено. Если «Doimiy o'yin», в которой вы участвовали, снова объявят, напишу сюда. Отключение — в приложении." },
  eskirgan: { uz: "Havola eskirgan. Ilovada «Telegram'da xabar olish»ni qayta bosing.", ru: "Ссылка устарела. В приложении снова нажмите «Telegram'da xabar olish»." },
  boshqa: { uz: "Bu bot ilovadan ulanadi: ilovada «Telegram'da xabar olish»ni bosing.", ru: "Этот бот подключается из приложения: нажмите в приложении «Telegram'da xabar olish»." }
};
// 5-ekran: to'rt o'yinchi kartasi (mashq kartasi, Mentor sanog'i emas — TAYANCHGA SAVOL 10) va uch katak
const KATAKLAR = [
  { uz: "O'tgan hafta shu o'yinda qatnashgan", ru: 'На прошлой неделе участвовал в этой игре' },
  { uz: 'Botni o\'zi ulagan', ru: 'Сам подключил бота' },
  { uz: 'Bu hafta ikkitadan kam xabar olgan', ru: 'На этой неделе получил меньше двух сообщений' }
];
const KIMGA_OYINCHILAR = [
  { n: 1, qatnashgan: true, ulangan: true, xabar: 0, k: [true, true, true] },
  { n: 2, qatnashgan: true, ulangan: false, xabar: 0, k: [true, false, true], xato: { uz: "Botni boshlamagan — bot unga birinchi yozolmaydi.", ru: 'Не запускал бота — бот не может написать ему первым.' } },
  { n: 3, qatnashgan: true, ulangan: true, xabar: 2, k: [true, true, false], xato: { uz: "Bu hafta ikkita xabar oldi — uchinchisi yo'q.", ru: 'На этой неделе получил два сообщения — третьего нет.' } },
  { n: 4, qatnashgan: false, ulangan: true, xabar: 0, k: [false, true, true], xato: { uz: "Shu o'yinda qatnashmagan — xabar unga tegishli emas.", ru: 'В этой игре не участвовал — сообщение его не касается.' } }
];
// 2-amaliyot kutilgan natijasi: uch tekshiruv o'yini — ikkitasi haqida xabar, uchinchisi chegarada to'xtaydi
const TEKSHIRUV_OYINLARI = [{ soat: '15:00', ketdi: true }, { soat: '16:00', ketdi: true }, { soat: '17:00', ketdi: false }];
const SIYOSAT_QATORI = { uz: "Telegram'da xabar olishni yoqsangiz — Telegram chat raqamingiz va qaysi o'yin haqida xabar yuborilgani saqlanadi: siz qatnashgan «Doimiy o'yin» yana e'lon qilinganini yozish va haftasiga ikkitadan oshirmaslik uchun. Ismingiz va Telegram nomingiz saqlanmaydi. «Telegram xabarlarini o'chirish»ni bossangiz, chat raqami o'chiriladi; qaysi o'yin haqida xabar yuborilgani yozuvi hisobingiz o'chirilguncha qoladi.", ru: "Если вы включите сообщения в Telegram — сохраняются номер вашего чата в Telegram и о какой игре отправлено сообщение: чтобы написать, что «Doimiy o'yin», в которой вы участвовали, снова объявлена, и не превышать двух в неделю. Ваше имя и имя в Telegram не сохраняются. Если нажмёте «Telegram xabarlarini o'chirish», номер чата удаляется; запись о том, о какой игре было сообщение, остаётся до удаления аккаунта." };

const QulfIc = () => <svg className="wb-qulf-ic" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><rect x="2" y="5.2" width="8" height="5.6" rx="1.3" fill="currentColor" /><path d="M3.9 5.4V3.9a2.1 2.1 0 0 1 4.2 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>;
// Telefon ekranlari: qulf (ilova yopiq) · ilova (sozlamalar qatori) · telegram (chat) · mentor (0-ekran javoblar ro'yxati)
const QulfEkran = () => (
  <div className="wb-qulf"><span className="wb-qulf-katta"><QulfIc /></span><span className="wb-qulf-ch" /></div>
);
const IlovaEkran = ({ t }) => (
  <div className="wb-ilova">
    <div className="wb-il-bosh"><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b></div>
    <div className="wb-il-oyin">{tr(TG_SAHNA.namunaOyin)}</div>
    <div className="wb-il-soz">
      <span className="wb-il-q kul">{tr(TG_SAHNA.chiqish)}</span>
      {t.tg === 'ulangan' ? <>
        <span className="wb-il-q ok fade-step">{tr(TG_SAHNA.ulangan)} ✓</span>
        <button type="button" className={cx('wb-il-q btn tg-ochir', t.joriy === 'ochir' && 'wb-halqa')} disabled={!t.on || !t.on.ochir} onClick={t.on && t.on.ochir}>{tr(TG_SAHNA.ochirish)}</button>
      </> : <>
        <button type="button" className={cx('wb-il-q btn tg-ulash', t.tg === 'yangi' && 'yangi', t.joriy === 'olish' && 'wb-halqa')} disabled={!t.on || !t.on.olish} onClick={t.on && t.on.olish}>{tr(TG_SAHNA.olish)}</button>
        <span className="wb-il-osti">{tr(TG_SAHNA.osti)}</span>
      </>}
    </div>
    {t.havola && <code className="wb-il-havola fade-step">{TG_SAHNA.kodHavola}</code>}
  </div>
);
const Pufak = ({ p }) => (
  <div className={cx('wb-puf', p.tur, p.yangi && 'yangi')}>
    <span>{tr(p.t)}</span>
    {p.havola && <code className="wb-puf-hav">{p.havola}</code>}
    {p.so && <em className="wb-puf-so">✓</em>}
  </div>
);
const TgChat = ({ t }) => (
  <div className="wb-chat">
    <div className="wb-chat-bosh"><b style={{ color: TG_RANG }}>Telegram</b><code>{TG_SAHNA.bot}</code></div>
    <div className="wb-chat-tana">{(t.puf || []).map(p => <Pufak key={p.id} p={p} />)}</div>
    {t.start && <button type="button" className={cx('wb-chat-start tg-start', t.joriy === 'start' && 'wb-halqa')} disabled={!t.on || !t.on.start} onClick={t.on && t.on.start}>Start</button>}
  </div>
);
const MentorEkran = ({ t }) => (
  <div className="wb-ment">
    {QAYTMAGAN_JAVOBLAR.qatorlar.map((q, i) => {
      const bor = (t.javoblar || 0) > i;
      return (
        <div key={i} className={cx('wb-ment-q', bor && 'bor', bor && t.ajrat && q.tur === 'bilmadi' && 'ajrat')}>
          <span className="wb-ment-n">{tr({ uz: `${i + 1}-o'yinchi`, ru: `${i + 1}-й игрок` })}</span>
          {bor ? <span className={cx('wb-ment-p fade-step', q.tur === 'javobsiz' && 'kul')}>{tr(q.t)}</span> : <span className="wb-ment-p bosh" />}
        </div>
      );
    })}
  </div>
);
const Telefon = ({ t = {} }) => (
  <div className="wb-tel-ust">
    <span className="wb-tel-yorliq">{tr(t.yorliq || TG_SAHNA.telefon)}</span>
    {t.ekran === 'mentor' && <span className="wb-tel-ust-y">{tr(QAYTMAGAN_JAVOBLAR.yorliq)}</span>}
    {t.ust && <span key={ou(t.ust)} className="wb-tel-ust-y fade-step">{tr(t.ust)}</span>}
    <div className="wb-telefon"><div className="wb-tel-ekran" key={t.ekran}>
      {t.ekran === 'qulf' ? <QulfEkran /> : t.ekran === 'telegram' ? <TgChat t={t} /> : t.ekran === 'mentor' ? <MentorEkran t={t} /> : <IlovaEkran t={t} />}
    </div></div>
    {t.osti}
  </div>
);
const BackendTugun = ({ b = {} }) => (
  <div className={cx('wb-backend', b.joriy && 'wb-joriy')}>
    <b className="wb-be-bosh">Backend</b>
    <span className="wb-be-q">{tr(TG_SAHNA.oyin)}</span>
    {b.yangi && <span key={b.yk || 0} className="wb-be-q ok yangi">{tr(b.yangi)}</span>}
    <span key={b.tg ? 'b' : 'y'} className={cx('wb-be-q', b.tg ? 'ok yangi' : 'kul')}>{tr(b.tg ? TG_SAHNA.tgBor : TG_SAHNA.tgYoq)}</span>
    {b.kalit && <span className="wb-be-q kalit fade-step"><QulfIc />{tr(TG_SAHNA.kalit)}</span>}
    {b.izoh && <span className="wb-be-iz fade-step">{tr(b.izoh)}</span>}
  </div>
);
const TelegramTugun = () => (
  <div className="wb-tgtugun"><b style={{ color: TG_RANG }}>Telegram</b><span>{tr(TG_SAHNA.botShu)}</span></div>
);
// Konvert: yol — tb/bt (telefon ↔ Backend) · gb/bg (Telegram ↔ Backend) · tg/gt (telefon ↔ Telegram) · tepa (Backend'ga tashqaridan)
const Konvert = ({ k, yol }) => (k && k.yol === yol ? <span key={k.id} className={cx('wb-kv', k.yol, k.tur)}><i className="wb-kv-i" />{k.yorliq && <b className="wb-kv-y"><span className="wb-kv-yn">{String(k.yorliq).split('/').map((b, j) => <React.Fragment key={j}>{j > 0 && <wbr />}{j > 0 ? '/' : ''}{b}</React.Fragment>)}</span>{k.iz && <span className="wb-kv-iz">{tr(k.iz)}</span>}{k.kalit && <span className="wb-kv-k"><QulfIc />{tr(TG_SAHNA.kalitK)}</span>}</b>}</span> : null);
const TgSahna = ({ tel, be, k, v = 'uzuq', beOsti, sinf }) => (
  <div className={cx('wb-sahna', sinf)}>
    <div className="wb-s-tel"><Telefon t={tel} /></div>
    <div className="wb-s-cha"><div className="wb-ch"><span className="wb-ch-i" /><Konvert k={k} yol="tb" /><Konvert k={k} yol="bt" /></div></div>
    <div className="wb-s-chb"><div className="wb-ch"><span className="wb-ch-i" /><Konvert k={k} yol="tg" /><Konvert k={k} yol="gt" /></div></div>
    <div className="wb-s-be">
      <div className="wb-be-ust"><Konvert k={k} yol="tepa" /><BackendTugun b={be} /></div>
      {beOsti}
    </div>
    <div className="wb-s-tg">
      <div className={cx('wb-chv', v)}><span className="wb-ch-i" /><Konvert k={k} yol="gb" /><Konvert k={k} yol="bg" /></div>
      <TelegramTugun />
    </div>
  </div>
);

// Umumiy kichik bo'laklar: bashorat (tanlangach ixcham qator), xulosa qutisi qatorlari (E 42), nom qatori, O'qituvchi eslatmasi
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="wb-chorla"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="wb-bash-ix fade-step"><span className="wb-bash-l">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="wb-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="wb-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="wb-x-m">{matn}</span>{izoh && <span className="wb-x-iz">{izoh}</span>}</>;
const NomQator = ({ matn, joriy }) => (matn ? <p className={cx('wb-nom fade-step', joriy && 'joriy')} key={ou(matn).slice(0, 18)}>{tx(matn)}</p> : null);
const Ustoz = ({ satrlar }) => (useMentorLive() ? <div className="wb-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div> : null);

// ===== SCREEN 0 — KIRISH (QKirish): Mentorning besh javobi va 12-Modul sanog'i; javobdan keyin javoblar navbat bilan tushadi (SABOQ 19) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Ilova ularga yoqmay qoldi', ru: 'Приложение им разонравилось' } },
  { id: 'b', label: { uz: "Yangi o'yin chiqqanini bilmadi", ru: 'Не знали, что вышла новая игра' } },
  { id: 'c', label: { uz: 'Telefonda joy qolmadi', ru: 'На телефоне не осталось места' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Beshtadan uchtasi shunday dedi: ilova yopiq turganda yangi o'yin haqida bilishmagan.</>, ru: <><b>Именно!</b> Трое из пяти так и сказали: пока приложение было закрыто, о новой игре не узнали.</> },
  a: { uz: <><b>Qiziq fikr!</b> Bu misolda hech kim bunday demadi. Lekin besh kishi kichik son — boshqalar aytishi mumkin.</>, ru: <><b>Интересная мысль!</b> В этом примере так никто не сказал. Но пять человек — маленькое число, другие могут сказать иначе.</> },
  c: { uz: <><b>Qiziq fikr!</b> Bittasi shunday dedi va ilovani o'chirgan. Ko'pi esa yangi o'yin chiqqanini bilmagan.</>, ru: <><b>Интересная мысль!</b> Один так и сказал и удалил приложение. А большинство не знали, что вышла новая игра.</> }
};
const Hisoblagich = () => (
  <div className="wb-hisob">
    <span className="wb-hisob-y">{tr(QAYTISH_SONLAR.yorliq)}</span>
    {QAYTISH_SONLAR.qatorlar.map((q, i) => (
      <div key={i} className="wb-hisob-q"><span className="wb-hisob-k">{tr(q.k)}</span><span className="wb-hisob-u"><i style={{ width: `${Math.round((q.n / 61) * 100)}%`, animationDelay: `${0.15 + i * 0.12}s` }} /></span><b>{q.n}</b></div>
    ))}
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [javoblar, setJavoblar] = useState(avval ? 5 : 0);
  const [ajrat, setAjrat] = useState(false);
  const [sc, setSc] = useState(0);
  const ketma = useKetma();
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); setSc(n => n + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    ketma([...[1, 2, 3, 4, 5].map(n => [n === 1 ? 250 : 110, () => { setJavoblar(n); if (n === 5) setSc(x => x + 1); }]), [350, () => setAjrat(true)], [1100, () => setAjrat(false)]]);
  };
  const javob = picked !== null;
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} deskSignal={javoblar >= 5 && javob ? 1 : 0} navContent={<NavNext optionalLive disabled={!javob} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('wb-k', !javob && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>O'yinchilar ilovani nega <span className="italic" style={{ color: T.accent }}>yana ochmay qo'ydi?</span></>, ru: <>Почему игроки <span className="italic" style={{ color: T.accent }}>перестали открывать</span> приложение?</> })}
          mentor={<Mentor>{tr(javob
            ? { uz: "Bugun eng ko'p aytilgan sababga bitta mexanika qurasiz — «Davom etish»ni bosing.", ru: 'Сегодня построите одну механику под самую частую причину — нажмите «Продолжить».' }
            : { uz: "Mentor ilovani ochmay qo'ygan beshta tanishidan sababini so'radi — avval o'zingiz javobni tanlang.", ru: 'Ментор спросил пятерых знакомых, переставших открывать приложение, о причине — сначала выберите ответ сами.' })}</Mentor>}
          maket={<div className="wb-k-maket">
            <Hisoblagich />
            <Telefon t={{ ekran: 'mentor', yorliq: TG_SAHNA.mentorTel, javoblar, ajrat, osti: javoblar >= 5 ? <p className="wb-tel-iz fade-step">{tr(QAYTMAGAN_JAVOBLAR.izoh)}</p> : null }} />
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={javob && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Dars oxirida» — TG_SAHNA tayyor holatda bir marta o'zi yuradi; o'ngda uch ish (172: teg yo'q) =====
const REJA = [
  { uz: "Ulanish: odam botni o'zi boshlaydi", ru: 'Подключение: человек сам запускает бота' },
  { uz: "Xabar: o'z o'yini yana e'lon qilinganda", ru: 'Сообщение: когда его игру снова объявили' },
  { uz: "O'chirish bir bosishda, ochilish sanaladi", ru: 'Отключение в одно нажатие, открытия считаются' }
];
const REJA_USTOZ = [
  { uz: "Eng og'ir qism — 1-amaliyot (yangi bot, ikki maxfiy qiymat `.env` va Render'da, Render kutishi). Uch blokda uch marta Render'da yangi versiya kutiladi — kutish paytida agentdan kodni ko'rsatishni so'rash ishi bor.", ru: 'Самая тяжёлая часть — практика 1 (новый бот, два секретных значения в `.env` и в Render, ожидание Render). В трёх блоках трижды ждём новую версию в Render — на время ожидания есть задание: попросить агента показать код.' },
  { uz: "Bugun o'quvchilar real odamlarga yozmaydi: Mentorning besh o'yinchisi — Mentor misoli (tanishlar, ruxsat bilan). Telegram yosh chegarasi haqida gapirilmaydi. Telegram akkaunti yo'q o'quvchi yangi akkaunt ochmaydi — sherigining Telegram'ida, faqat `namuna = true` tekshiruv hisobi orqali tekshiradi (sherik chati o'quvchining o'z hisobiga ulanmaydi).", ru: 'Сегодня ученики не пишут реальным людям: пять игроков Ментора — пример Ментора (знакомые, с разрешения). О возрастном ограничении Telegram не говорим. Ученик без аккаунта Telegram новый не открывает — проверяет в Telegram напарника, только через проверочный аккаунт `namuna = true` (чат напарника к собственному аккаунту ученика не подключается).' },
  { uz: "Halol chegara: bot odamga birinchi bo'lib yozolmaydi — ilovani allaqachon tashlab ketgan va botni ulamagan odamga bugungi mexanika yetmaydi; u keyin ketishi mumkin bo'lganlar uchun. Keyingi «Doimiy o'yin» kimdir «O'yinlar»ni ochganda yaratiladi (4-dars; bepul Backend uxlaydi — vaqt bo'yicha ish yo'q): butun hafta hech kim ochmasa, o'yin ham, xabar ham bo'lmaydi. «Telegram xabari» va «eslatma» — ikki narsa: birinchisini Backend yuboradi, ikkinchisini ilova qo'yadi.", ru: "Честная граница: бот не может написать человеку первым — тому, кто уже бросил приложение и не подключил бота, сегодняшняя механика не поможет; она для тех, кто может уйти позже. Следующая «Doimiy o'yin» создаётся, когда кто-то открывает «O'yinlar» (4-й урок; бесплатный Backend засыпает — работы по времени нет): если за неделю никто не откроет, не будет ни игры, ни сообщения. «Сообщение в Telegram» и «напоминание» — две вещи: первое отправляет Backend, второе ставит приложение." },
  { uz: "Sinfdagi tekshiruv o'yinlari, Telegram xabarlari yozuvlari va `telegramdan-ochdi` yozuvlari `id` bo'yicha o'chiriladi — aks holda o'quvchining haftalik chegarasi to'lib qoladi va sanoq buziladi. Uyga vazifa yo'q. Yangi o'rnatish fayli bu darsda tayyorlanmaydi — APK o'rnatganlarda Telegram tugmasi hozircha yo'q.", ru: 'Проверочные игры в классе, записи сообщений Telegram и записи `telegramdan-ochdi` удаляются по `id` — иначе недельный лимит ученика заполнится и счёт испортится. Домашнего задания нет. Новый установочный файл на этом уроке не готовится — у установивших APK кнопки Telegram пока нет.' }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [kadr, setKadr] = useState(0);
  const ketma = useKetma();
  useEffect(() => {
    ketma([[900, () => setKadr(1)], [1300, () => setKadr(2)], [900, () => setKadr(3)], [1300, () => setKadr(4)], [1000, () => setKadr(5)], [900, () => setKadr(6)], [1100, () => setKadr(7)], [1300, () => setKadr(8)]]);
  }, []); // eslint-disable-line
  const ulandi = { id: 'b', tur: 'bot', t: BOT_JAVOBLARI.ulandi };
  const st = { id: 's', tur: 'siz', t: { uz: '/start', ru: '/start' } };
  const tel = kadr === 0 ? { ekran: 'ilova', tg: 'olish', joriy: 'olish' }
    : kadr === 1 ? { ekran: 'telegram', start: true, joriy: 'start', puf: [] }
      : kadr === 2 ? { ekran: 'telegram', puf: [st] }
        : kadr < 6 ? { ekran: 'telegram', puf: [st, ulandi] }
          : kadr === 6 ? { ekran: 'telegram', puf: [ulandi] }
            : { ekran: 'telegram', puf: [ulandi, { id: 'x', tur: 'xabar', yangi: true, t: TG_XABAR.matn('18:00'), havola: TG_SAHNA.havola, so: kadr >= 8 }] };
  const be = { tg: kadr >= 4, yangi: kadr >= 5 ? TG_SAHNA.navbatOyin : null, yk: 1 };
  const k = kadr === 2 ? { id: 'w', yol: 'gb', yorliq: 'POST /telegram/webhook', kalit: true } : kadr === 6 ? { id: 'x', yol: 'gt', tur: 'xabar' } : kadr === 5 ? { id: 'x0', yol: 'bg', tur: 'xabar' } : null;
  const sanoq = kadr >= 8 ? <p className="wb-sanoq fade-step">{tr(TG_SAHNA.sanoq)}</p> : null;
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <div className="wb-reja">
        <QReja zoom={Zoomable}
          sarlavha={tr({ uz: <>Bugun mahsulotingiz <span className="italic" style={{ color: T.accent }}>Telegram orqali</span> xabar yuboradi.</>, ru: <>Сегодня ваш продукт отправит сообщение <span className="italic" style={{ color: T.accent }}>через Telegram</span>.</> })}
          mentor={<Mentor>{tr({ uz: "Besh javobda bitta sabab ko'proq uchradi — bugun shunga bitta mexanika qurasiz, namuna «Yordam»da turadi.", ru: 'В пяти ответах одна причина встретилась чаще — сегодня построите под неё одну механику, образец лежит в «Подсказке».' })}</Mentor>}
          chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
          chap={<TgSahna sinf="reja" tel={{ ...tel, osti: sanoq }} be={be} k={k} v={kadr >= 4 ? 'toliq' : 'uzuq'} />}
          qadamlar={REJA.map(r => ({ t: tr(r) }))}
        >
          <p className="wb-reja-past">{tx({ uz: "o'z repo'ngiz · Mentor misoli `maydon-jamoa` · boshlang'ich teg `m13-dars-08-start` · namuna `m13-dars-08-done`", ru: 'ваш репозиторий · пример Ментора `maydon-jamoa` · стартовый тег `m13-dars-08-start` · образец `m13-dars-08-done`' })}</p>
          <p className="wb-reja-past2">{tr({ uz: "«Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz. Bot mobil va web-trekda bir xil ishlaydi.", ru: '«Maydon Jamoa» — образец; практики выполняете в своём продукте. Бот работает одинаково в мобильном и веб-треке.' })}</p>
          <Ustoz satrlar={REJA_USTOZ} />
        </QReja>
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · bot kimga yoza oladi (bashorat + 4 harakat): «Shanba o'tdi» → «Telegram'da xabar olish» → «Start» → «Shanba o'tdi» =====
const S2_TAXMIN = [
  { k: 'ha', t: { uz: 'Ha — Backend bilsa, bot yozadi', ru: 'Да — если Backend знает, бот напишет' } },
  { k: 'yoq', t: { uz: "Yo'q — o'yinchi botni o'zi boshlashi kerak", ru: 'Нет — игрок должен сам запустить бота' } }
];
const S2_SAVOL = { uz: "Bot o'yinchiga birinchi bo'lib yoza oladimi?", ru: 'Может ли бот написать игроку первым?' };
const S2_MENTOR = [
  { uz: "Avval taxminingizni belgilang, keyin Backend ostidagi «Shanba o'tdi»ni bosing.", ru: 'Сначала отметьте предположение, потом нажмите «Shanba o\'tdi» под Backend.' },
  { uz: "Endi telefondagi ilovada «Telegram'da xabar olish»ni bosing.", ru: "Теперь в приложении на телефоне нажмите «Telegram'da xabar olish»." },
  { uz: "Telegram chatida «Start»ni bosing.", ru: 'В чате Telegram нажмите «Start».' },
  { uz: "Endi «Shanba o'tdi»ni yana bir marta bosing.", ru: 'Теперь нажмите «Shanba o\'tdi» ещё раз.' },
  { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' }
];
const S2_NOM_KOD = { uz: "Havoladagi qisqa qator — bir martalik kod: u Telegram chatini aynan shu hisob bilan bog'laydi.", ru: 'Короткая строка в ссылке — одноразовый код: он связывает чат Telegram именно с этим аккаунтом.' };
const S2_NOM_XABAR = { uz: "Backend bot orqali yuboradigan bu xabar — Telegram xabari.", ru: 'Это сообщение, которое Backend отправляет через бота, — сообщение в Telegram.' };
const S2_JORIY = { uz: "Yangi o'yin kimdir ilovani ochganda yaratiladi: hech kim ochmasa, xabar ham ketmaydi.", ru: 'Новая игра создаётся, когда кто-то открывает приложение: если никто не откроет, сообщение тоже не уйдёт.' };
const S2_SHANBA = { uz: "Shanba o'tdi", ru: "Shanba o'tdi" };
const S2_YAKUN = {
  tel: { ekran: 'telegram', ust: TG_SAHNA.hamYopiq, puf: [{ id: 'b', tur: 'bot', t: BOT_JAVOBLARI.ulandi }, { id: 'x', tur: 'xabar', t: TG_XABAR.matn('18:00'), havola: TG_SAHNA.havola }] },
  be: { tg: true, yangi: TG_SAHNA.navbatOyin, yk: 2, kalit: true }
};
const navYorliq = (taxmin, q, jami, done, qolgan) => (done ? { uz: 'Davom etish', ru: 'Продолжить' }
  : !taxmin ? { uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }
    : qolgan || { uz: `Harakatlarni navbat bilan bajaring (${q}/${jami})`, ru: `Выполняйте действия по очереди (${q}/${jami})` });
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 4 : 0);
  const [band, setBand] = useState(false);
  const [tel, setTel] = useState(avval ? S2_YAKUN.tel : { ekran: 'qulf', ust: TG_SAHNA.yopiq });
  const [be, setBe] = useState(avval ? S2_YAKUN.be : { tg: false });
  const [v, setV] = useState(avval ? 'toliq' : 'uzuq');
  const [k, setK] = useState(null);
  const [nom, setNom] = useState(avval ? S2_NOM_XABAR : null);
  const ketma = useKetma();
  const done = q >= 4;
  const tugadi = useTugadi(done, 900, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const upBe = (p) => setBe(o => ({ ...o, ...p }));
  const upTel = (p) => setTel(o => ({ ...o, ...p }));
  const shanba = () => {
    if (!taxmin || band || (q !== 0 && q !== 3)) return;
    setBand(true);
    setK({ id: 's' + q, yol: 'tepa', yorliq: 'GET /oyinlar', iz: TG_SAHNA.kimdir });
    if (q === 0) {
      ketma([[900, () => { setK(null); upBe({ yangi: TG_SAHNA.keyingiOyin, yk: 1 }); }], [700, () => { upBe({ izoh: TG_SAHNA.chatYoq }); upTel({ ust: TG_SAHNA.bilmadi }); }],
        [2200, () => { setTel({ ekran: 'ilova', tg: 'olish', joriy: 'olish', ust: TG_SAHNA.ochdi }); setQ(1); setBand(false); }]]);
    } else {
      ketma([[900, () => { setK(null); upBe({ yangi: TG_SAHNA.navbatOyin, yk: 2 }); }], [700, () => setK({ id: 'x1', yol: 'bg', tur: 'xabar' })], [900, () => setK({ id: 'x2', yol: 'gt', tur: 'xabar' })],
        [900, () => { setK(null); setTel(o => ({ ...o, ust: TG_SAHNA.hamYopiq, puf: [...(o.puf || []).filter(p => p.tur === 'bot'), { id: 'x', tur: 'xabar', yangi: true, t: TG_XABAR.matn('18:00'), havola: TG_SAHNA.havola }] })); setNom(S2_NOM_XABAR); }],
        [700, () => { setQ(4); setBand(false); }]]);
    }
  };
  const olish = () => {
    if (q !== 1 || band) return;
    setBand(true); upTel({ joriy: null, tg: 'yangi' });
    setK({ id: 'u1', yol: 'tb', yorliq: 'POST /telegram/kod' });
    ketma([[900, () => setK({ id: 'u2', yol: 'bt', tur: 'javob' })], [900, () => { setK(null); upTel({ havola: true }); }],
      [1400, () => { setTel({ ekran: 'telegram', start: true, joriy: 'start', puf: [] }); setNom(S2_NOM_KOD); setQ(2); setBand(false); }]]);
  };
  const start = () => {
    if (q !== 2 || band) return;
    setBand(true); upTel({ joriy: null, start: false, puf: [{ id: 's', tur: 'siz', t: { uz: '/start', ru: '/start' } }] });
    ketma([[500, () => setK({ id: 'w', yol: 'gb', yorliq: 'POST /telegram/webhook', kalit: true })], [1100, () => { setK(null); upBe({ kalit: true }); }],
      [600, () => upBe({ tg: true, izoh: null })], [500, () => { setV('toliq'); setK({ id: 'r1', yol: 'bg', tur: 'javob' }); }], [900, () => setK({ id: 'r2', yol: 'gt', tur: 'javob' })],
      [900, () => { setK(null); setTel(o => ({ ...o, puf: [...(o.puf || []), { id: 'b', tur: 'bot', yangi: true, t: BOT_JAVOBLARI.ulandi }] })); }], [500, () => { setQ(3); setBand(false); }]]);
  };
  const telOn = q === 1 ? { ...tel, on: band ? null : { olish } } : q === 2 ? { ...tel, on: band ? null : { start } } : tel;
  const shanbaFaol = !!taxmin && !band && (q === 0 || q === 3);
  const mGap = done ? S2_MENTOR[4] : !taxmin ? S2_MENTOR[0] : S2_MENTOR[Math.min(q, 3)];
  const togri = taxmin === 'yoq';
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Backend va bot', ru: 'Понятие · Backend и бот' })} screen={screen} scrollSignal={q + (tugadi ? 10 : 0)} deskSignal={tugadi ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 4, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ilova yopiq bo'lsa, yangi o'yin haqida <span className="italic" style={{ color: T.accent }}>kim yozadi?</span></>, ru: <>Если приложение закрыто, кто напишет <span className="italic" style={{ color: T.accent }}>о новой игре?</span></> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={<Bashorat savol={S2_SAVOL} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={tugadi
          ? <div className="wb-s2-tug"><TgSahna sinf="s2 tugadi" tel={telOn} be={be} k={k} v={v} /><div className="wb-s2-yon">{nom && <NomQator matn={nom} />}<NomQator matn={S2_JORIY} joriy /></div></div>
          : <TgSahna sinf="s2" tel={telOn} be={be} k={k} v={v}
            beOsti={<button type="button" className={cx('wb-sahna-btn tg-shanba', shanbaFaol && 'wb-halqa')} disabled={!shanbaFaol} onClick={shanba}>{tr(S2_SHANBA)}</button>} />}
        natija={!tugadi && <>{nom && <NomQator matn={nom} />}{done && <NomQator matn={S2_JORIY} joriy />}</>}
        xulosa={done && <XulosaQ natija={<Natija togri={togri} haqiqat={{ uz: "yo'q, o'yinchi botni o'zi boshlashi kerak", ru: 'нет, игрок должен сам запустить бота' }} />}
          matn={tr({ uz: "Bu misolda yangi o'yinni Backend biladi; bot esa faqat «Start»ni bosgan odamga yoza oladi.", ru: 'В этом примере о новой игре знает Backend; а бот может написать только тому, кто нажал «Start».' })}
          izoh={tr({ uz: "Ulanishda faqat chat raqami saqlanadi: ism ham, Telegram nomi ham saqlanmaydi.", ru: 'При подключении сохраняется только номер чата: ни имя, ни имя в Telegram не сохраняются.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen; INLINE_KEYS.s4 = 2, C) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Mentor misolida Backend o'yinchining Telegram chatini qachon biladi?"
    question={tr({ uz: <h2 className="title h-ask">Mentor misolida Backend o'yinchining Telegram chatini <span className="italic" style={{ color: T.accent }}>qachon biladi?</span></h2>, ru: <h2 className="title h-ask">В примере Ментора когда Backend <span className="italic" style={{ color: T.accent }}>узнаёт чат Telegram</span> игрока?</h2> })}
    options={[
      { uz: "O'yinchi «Ro'yxatdan o'tish»ni bosganda", ru: "Когда игрок нажал «Ro'yxatdan o'tish»" },
      { uz: 'Bot telefon raqami orqali uni o\'zi topganda', ru: 'Когда бот сам нашёл его по номеру телефона' },
      { uz: "O'yinchi kodli havolada «Start»ni bosganda", ru: 'Когда игрок нажал «Start» по ссылке с кодом' },
      { uz: "Tashkilotchi «E'lon berish»ni bosganda", ru: "Когда организатор нажал «E'lon berish»" }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Chat raqami faqat o\'yinchi botni o\'zi boshlaganda keladi.', ru: 'Номер чата приходит, только когда игрок сам запускает бота.' }}
    explainWrong={{
      0: { uz: "Ro'yxatda Telegram so'ralmaydi — chat qayerdan keladi?", ru: 'При регистрации Telegram не спрашивают — откуда взяться чату?' },
      1: { uz: 'Mentor ilovasi telefon so\'ramaydi, bot ham odam qidirmaydi.', ru: 'Приложение Ментора не спрашивает телефон, и бот людей не ищет.' },
      3: { uz: "E'lon — tashkilotchining ishi. O'yinchi botga yozdimi?", ru: 'Объявление — дело организатора. А игрок писал боту?' }
    }} />
);

// ===== SCREEN 5 — TUSHUNCHA · Backend kimga yozadi (bashorat + 4 karta bittadan + o'chirish) =====
const S5_TAXMIN = [
  { k: 'bitta', t: { uz: 'Bittasiga', ru: 'Одному' } },
  { k: 'ikki', t: { uz: 'Ikkitasiga', ru: 'Двоим' } },
  { k: 'uch', t: { uz: 'Uchtasiga', ru: 'Троим' } }
];
const S5_SAVOL = { uz: "To'rt o'yinchidan nechtasiga Telegram xabari ketadi?", ru: 'Скольким из четырёх игроков уйдёт сообщение в Telegram?' };
const S5_MENTOR = [
  { uz: "Mentor misolida to'rt o'yinchi bor — avval taxminingizni belgilang.", ru: 'В примере Ментора четыре игрока — сначала отметьте предположение.' },
  { uz: "Har kartada «Tekshirish»ni bosing va o'ngdagi uch katakni kuzating.", ru: 'На каждой карточке нажмите «Tekshirish» и следите за тремя клетками справа.' },
  { uz: "Endi 1-o'yinchi kartasida «Telegram xabarlarini o'chirish»ni bosing.", ru: "Теперь на карточке 1-го игрока нажмите «Telegram xabarlarini o'chirish»." },
  { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' }
];
const S5_JORIY = { uz: "O'chirish bir bosishda: chat raqami o'chadi va xabar ketmaydi.", ru: 'Отключение в одно нажатие: номер чата удаляется, и сообщение не уходит.' };
const S5_SARL = { uz: "Shanba, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni", ru: 'Игра в субботу, 18:00 снова объявлена · Mahalla maydoni' };
const S5_YUBOR = { uz: 'yuboriladi', ru: 'отправляется' };
const S5_YUBORMAS = { uz: 'yuborilmaydi', ru: 'не отправляется' };
const Katak = ({ v, i }) => <span className={cx('wb-katak', v === true && 'ok', v === false && 'err')} style={{ animationDelay: `${i * 0.09}s` }}>{v === true ? '✓' : v === false ? '✕' : ''}</span>;
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [i, setI] = useState(avval ? 4 : 0); // joriy karta (4 — hammasi tekshirildi)
  const [kat, setKat] = useState(0); // joriy kartada ochilgan katak soni
  const [ochirildi, setOchirildi] = useState(avval);
  const [band, setBand] = useState(false);
  const ketma = useKetma();
  const q = Math.min(i, 4) + (ochirildi ? 1 : 0);
  const done = q >= 5;
  const tugadi = useTugadi(done, 900, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tekshir = () => {
    if (!taxmin || band || i >= 4) return;
    setBand(true);
    ketma([[120, () => setKat(1)], [110, () => setKat(2)], [110, () => setKat(3)], [1500, () => { setI(n => n + 1); setKat(0); setBand(false); }]]);
  };
  const ochir = () => { if (i < 4 || ochirildi || band) return; setOchirildi(true); };
  const p1 = KIMGA_OYINCHILAR[0];
  const joriyO = i < 4 ? KIMGA_OYINCHILAR[i] : p1;
  const kVal = i < 4 ? joriyO.k.map((x, j) => (j < kat ? x : null)) : [true, !ochirildi, true];
  const xatoK = i < 4 && kat >= 3 ? joriyO.xato : null;
  const natijaOk = (o) => o.k.every(Boolean);
  const ixcham = KIMGA_OYINCHILAR.slice(0, Math.min(i, 4)).filter(o => !(o.n === 1 && i >= 4 && !tugadi)).map(o => {
    const ok = o.n === 1 ? !ochirildi && natijaOk(o) : natijaOk(o);
    return { o, ok };
  });
  const oyinchiKarta = (o, chiqdi, ochirRejim, ichi) => {
    const ulangan = o.n === 1 && ochirRejim ? !ochirildi : o.ulangan;
    return (
      <div className={cx('wb-oy', chiqdi && (o.n === 1 && ochirRejim ? (ochirildi ? 'kul' : 'ok') : natijaOk(o) ? 'ok' : 'err'))}>
        <span className="wb-oy-n">{ochirRejim ? tr({ uz: '1-o\'yinchi', ru: '1-й игрок' }) : tr({ uz: `O'yinchi ${o.n} / 4`, ru: `Игрок ${o.n} / 4` })}</span>
        <span className="wb-oy-q">{tr({ uz: "O'tgan Shanba o'yinida:", ru: 'В игре прошлой субботы:' })} <b>{tr(o.qatnashgan ? { uz: 'qatnashgan', ru: 'участвовал' } : { uz: 'qatnashmagan', ru: 'не участвовал' })}</b></span>
        <span key={String(ulangan)} className={cx('wb-oy-q', ochirRejim && ochirildi && 'yangi')}>Telegram: <b>{tr(ulangan ? { uz: 'ulangan', ru: 'подключён' } : { uz: 'ulanmagan', ru: 'не подключён' })}</b></span>
        <span className="wb-oy-q">{tr({ uz: 'Bu hafta Telegram xabari:', ru: 'Сообщений Telegram на этой неделе:' })} <b>{o.xabar}{' / '}2</b></span>
        {ichi}
      </div>
    );
  };
  const chiqdi = i < 4 && kat >= 3;
  const p1Puf = (ok) => <div className={cx('wb-puf xabar kichik', !ok && 'sondi')}><span>{tr(TG_XABAR.matn('18:00'))}</span></div>;
  const mGap = done ? S5_MENTOR[3] : !taxmin ? S5_MENTOR[0] : i < 4 ? S5_MENTOR[1] : S5_MENTOR[2];
  const navQ = i < 4 ? { uz: `Kartalarni tekshiring (${i}/4)`, ru: `Проверьте карточки (${i}/4)` } : { uz: "O'chirishni bosing", ru: 'Нажмите отключение' };
  const vizual = (
    <div className={cx('wb-s5', tugadi && 'tugadi')}>
      <div className="wb-s5-chap">
        <div className="wb-s5-be"><b>Backend</b><span>{tr(S5_SARL)}</span></div>
        {ixcham.length > 0 && <div className="wb-s5-ix">{ixcham.map(({ o, ok }) => (
          <div key={o.n} className={cx('wb-ix', ok ? 'ok' : o.n === 1 && ochirildi ? 'kul' : 'err')}><span>{tr({ uz: `${o.n}-o'yinchi`, ru: `${o.n}-й игрок` })}</span><b>{tr(ok ? S5_YUBOR : S5_YUBORMAS)}</b></div>
        ))}</div>}
        {!tugadi && (i < 4 ? <>
          <div key={'k' + i} className="wb-oy-ust fade-step">{oyinchiKarta(joriyO, chiqdi, false)}</div>
          {chiqdi && joriyO.n === 1 && p1Puf(true)}
          <button type="button" className={cx('wb-sahna-btn tg-tekshir', taxmin && !band && 'wb-halqa')} disabled={!taxmin || band} onClick={tekshir}>{tr({ uz: 'Tekshirish', ru: 'Tekshirish' })}</button>
        </> : <>
          <div className="wb-oy-ust fade-step">{oyinchiKarta(p1, true, true, !ochirildi && <button type="button" className="wb-sahna-btn tg-ochir wb-halqa" onClick={ochir}>{tr(TG_SAHNA.ochirish)}</button>)}</div>
          {p1Puf(!ochirildi)}
        </>)}
      </div>
      <div className="wb-s5-ong">
        <div className="wb-tk-k">
          <b className="wb-tk-k-s">{tr({ uz: 'Backend tekshiradi', ru: 'Backend проверяет' })}</b>
          <span className="wb-tk-k-y">{tr({ uz: 'bu kursda · Mentor misolida', ru: 'в этом курсе · в примере Ментора' })}</span>
          {KATAKLAR.map((kt, j) => (
            <div key={j + '-' + i + '-' + String(kVal[j])} className="wb-tk-q"><Katak v={kVal[j]} i={j} /><span>{tr(kt)}</span></div>
          ))}
          {xatoK && <p key={'x' + i + String(ochirildi)} className="q-xato wb-s5-xato fade-step">{tr(xatoK)}</p>}
          {i < 4 && chiqdi && natijaOk(joriyO) && <p className="wb-s5-ok fade-step">{tr(S5_YUBOR)}</p>}
        </div>
      </div>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · kimga xabar ketadi', ru: 'Понятие · кому уходит сообщение' })} screen={screen} scrollSignal={q + kat + (tugadi ? 10 : 0)} deskSignal={tugadi ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 5, done, navQ))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>O'yin yana e'lon qilindi — Backend <span className="italic" style={{ color: T.accent }}>kimga yozadi?</span></>, ru: <>Игру снова объявили — <span className="italic" style={{ color: T.accent }}>кому напишет</span> Backend?</> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={<Bashorat savol={S5_SAVOL} variantlar={S5_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={vizual}
        natija={ochirildi && <NomQator matn={S5_JORIY} joriy />}
        xulosa={done && <XulosaQ natija={<Natija togri={taxmin === 'bitta'} haqiqat={{ uz: 'bittasiga', ru: 'одному' }} />}
          matn={tr({ uz: "Bu kursda xabar o'z o'yini qayta e'lon qilingan, botni ulagan odamga ketadi — haftasiga ko'pi bilan ikkita.", ru: 'В этом курсе сообщение уходит тому, чью игру снова объявили и кто подключил бота, — не больше двух в неделю.' })}
          izoh={tr({ uz: "Bu kursda xabar matnida faqat o'zgarish bor: kun, soat, joy — bosim ham, to'lov taklifi ham yo'q.", ru: 'В этом курсе в тексте сообщения только изменение: день, время, место — ни давления, ни предложения оплаты.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 1, B) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Mentor misolida Telegram xabari kelishi uchun telefonda ilova turishi shartmi?"
    question={tr({ uz: <h2 className="title h-ask">Mentor misolida Telegram xabari kelishi uchun telefonda <span className="italic" style={{ color: T.accent }}>ilova turishi shartmi?</span></h2>, ru: <h2 className="title h-ask">В примере Ментора нужно ли, чтобы на телефоне <span className="italic" style={{ color: T.accent }}>было приложение</span>, чтобы пришло сообщение в Telegram?</h2> })}
    options={[
      { uz: 'Ha — Telegram xabari ilova orqali keladi', ru: 'Да — сообщение Telegram приходит через приложение' },
      { uz: "Yo'q — xabarni Telegram'dagi bot yozadi", ru: 'Нет — сообщение пишет бот в Telegram' },
      { uz: 'Ha — Backend avval ilovaga so\'rov yuboradi', ru: 'Да — Backend сначала шлёт запрос приложению' },
      { uz: "Yo'q — Backend uni SMS bo'lib yuboradi", ru: 'Нет — Backend отправляет его как SMS' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Telegram xabari ilovaga emas, Telegram chatiga keladi.', ru: 'Сообщение Telegram приходит не в приложение, а в чат Telegram.' }}
    explainWrong={{
      0: { uz: 'Xabar Telegram chatiga keladi — ilova bu yerda kerakmi?', ru: 'Сообщение приходит в чат Telegram — нужно ли тут приложение?' },
      2: { uz: "Backend Telegram'ga yozadi — ilovaga so'rov shart emas.", ru: 'Backend пишет в Telegram — запрос приложению не нужен.' },
      3: { uz: 'Mentor ilovasi telefon raqamini umuman so\'ramaydi.', ru: 'Приложение Ментора вообще не спрашивает номер телефона.' }
    }} />
);

// ===== 🏅 BADGES (nishonlar) — 4 ta: ikki ballik savol (birinchi urinish) + Weekly Two (2-amaliyot 4-qadam) + Easy Off (3-amaliyot 4-qadam) — bonus, ish uchun (M-q6 A) =====
const ACHIEVEMENTS = {
  startFirst: { icon: '🔑', name: 'Start First', desc: { uz: "Telegram chati faqat «Start»dan keyin kelishini topdingiz", ru: 'Вы нашли, что чат Telegram появляется только после «Start»' } },
  stillReaches: { icon: '📨', name: 'Still Reaches', desc: { uz: 'Ilovasiz ham Telegram xabari yetishini topdingiz', ru: 'Вы нашли, что сообщение Telegram доходит и без приложения' } },
  weeklyTwo: { icon: '📅', name: 'Weekly Two', desc: { uz: "Telegram xabarini va haftalik chegarani o'z Telegram'ingizda tekshirdingiz", ru: 'Вы проверили сообщение Telegram и недельный лимит в своём Telegram' } },
  easyOff: { icon: '🔕', name: 'Easy Off', desc: { uz: "O'chirish va sanoq qatorini o'zingiz tekshirdingiz", ru: 'Вы сами проверили отключение и строку счёта' } }
};
// Ekran id → nishon: ballik testlar (correct = birinchi urinish) va bloklarning 4-qadami («Bajardim» — ish fakti)
const ACH_TRIGGERS = { s4: 'startFirst', s7: 'stillReaches', a2: 'weeklyTwo', a3: 'easyOff' };

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
  4: { uz: '1 — Chat raqami qachon keladi', ru: '1 — Когда приходит номер чата' },
  7: { uz: '2 — Ilova shartmi', ru: '2 — Нужно ли приложение' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning fon so'zlari (MD; R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: { uz: 'Telegram xabari', ru: 'сообщение Telegram' }, l: 5, t: 10, s: 26, d: 19, dl: 0 },
  { ch: { uz: 'bot', ru: 'бот' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: '«Start»', l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'bir martalik kod', ru: 'одноразовый код' }, l: 74, t: 66, s: 22, d: 21, dl: 2.2 },
  { ch: { uz: 'chat raqami', ru: 'номер чата' }, l: 44, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'TELEGRAM_SIR', l: 64, t: 24, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: 'haftasiga ikkita', ru: 'два в неделю' }, l: 24, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'telegramdan-ochdi', l: 18, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: "«Doimiy o'yin»", l: 52, t: 48, s: 20, d: 22, dl: 3.3 },
  { ch: 'Maydon Jamoa', l: 88, t: 44, s: 20, d: 24, dl: 2.5 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (MD aylanma tartibi)
const QUIZ_BANK = [
  { q: { uz: "Mentor misolida yana ochmagan beshtadan ko'pi nima dedi?", ru: 'Что сказали большинство из пяти, не открывших снова, в примере Ментора?' }, opts: [{ uz: "«Yangi o'yin chiqqanini bilmadim»", ru: '«Не знал, что вышла новая игра»' }, { uz: '«Ilova menga umuman yoqmadi»', ru: '«Приложение мне совсем не понравилось»' }, { uz: '«Telefonimda joy qolmay qoldi»', ru: '«На телефоне закончилось место»' }, { uz: "«O'yinlar menga juda qimmat tuyuldi»", ru: '«Игры показались мне слишком дорогими»' }], correct: 0 },
  { q: { uz: "Bot odamga birinchi bo'lib yoza oladimi?", ru: 'Может ли бот написать человеку первым?' }, opts: [{ uz: "Ha — Backend chat raqamini o'zi topadi", ru: 'Да — Backend сам найдёт номер чата' }, { uz: "Yo'q — odam avval botni o'zi boshlaydi", ru: 'Нет — человек сначала сам запускает бота' }, { uz: 'Ha — bot istalgan odamga yoza oladi', ru: 'Да — бот может написать любому' }, { uz: "Yo'q — buning uchun telefon raqami kerak", ru: 'Нет — для этого нужен номер телефона' }], correct: 1 },
  { q: { uz: 'Ulanish havolasidagi bir martalik kod nima uchun kerak?', ru: 'Зачем нужен одноразовый код в ссылке подключения?' }, opts: [{ uz: 'Botni Telegram qidiruvida tezroq topish uchun', ru: 'Чтобы быстрее найти бота в поиске Telegram' }, { uz: 'Xabarni tezroq yetkazib berish uchun', ru: 'Чтобы быстрее доставить сообщение' }, { uz: "Chatni aynan shu hisob bilan bog'lash uchun", ru: 'Чтобы связать чат именно с этим аккаунтом' }, { uz: "Bot tokenini odamga ko'rsatish uchun", ru: 'Чтобы показать человеку токен бота' }], correct: 2 },
  { q: { uz: "Telegram so'rovi kelganda Mentor Backend'i avval nimani tekshiradi?", ru: 'Что Backend Ментора проверяет первым, когда приходит запрос Telegram?' }, opts: [{ uz: 'Odamning Telegram nomini', ru: 'Имя человека в Telegram' }, { uz: 'Xabardagi chat raqamini', ru: 'Номер чата в сообщении' }, { uz: 'Botning foydalanuvchi nomini', ru: 'Имя пользователя бота' }, { uz: 'Sarlavhadagi maxfiy kalitni', ru: 'Секретный ключ в заголовке' }], correct: 3 },
  { q: { uz: 'Bot tokeni qayerda turadi?', ru: 'Где хранится токен бота?' }, opts: [{ uz: '`backend/.env` da va Render sozlamasida', ru: 'В `backend/.env` и в настройках Render' }, { uz: 'Ilova kodida, tugma bosiladigan joy yonida', ru: 'В коде приложения, рядом с кнопкой' }, { uz: "`README.md` dagi ro'yxatda, qiymati bilan", ru: 'В списке в `README.md`, со значением' }, { uz: 'Bot javobi matnida, eng oxirgi qatorda', ru: 'В тексте ответа бота, в последней строке' }], correct: 0 },
  { q: { uz: "Ulanganda Backend Telegram'dan nimani saqlaydi?", ru: 'Что Backend сохраняет из Telegram при подключении?' }, opts: [{ uz: 'Odamning ismi va Telegram nomini', ru: 'Имя человека и имя в Telegram' }, { uz: 'Faqat chat raqamini, boshqasini emas', ru: 'Только номер чата, больше ничего' }, { uz: 'Telefon raqami va chat raqamini birga', ru: 'Номер телефона вместе с номером чата' }, { uz: 'Botga yozilgan hamma xabarlarni', ru: 'Все сообщения, написанные боту' }], correct: 1 },
  { q: { uz: "Shu hafta o'yinchiga ikkita Telegram xabari ketdi. Uchinchisi-chi?", ru: 'На этой неделе игроку ушло два сообщения Telegram. А третье?' }, opts: [{ uz: "Baribir yuboriladi — o'yin yangi", ru: 'Всё равно уйдёт — игра новая' }, { uz: "Ilovada eslatma bo'lib chiqadi", ru: 'Появится в приложении напоминанием' }, { uz: 'Bu hafta umuman yuborilmaydi', ru: 'На этой неделе вообще не уйдёт' }, { uz: 'Ertasiga ikki marta yuboriladi', ru: 'Назавтра уйдёт дважды' }], correct: 2 },
  { q: { uz: 'Qaysi Telegram xabari darsdagi qoidaga mos?', ru: 'Какое сообщение Telegram подходит под правило урока?' }, opts: [{ uz: "«Pro oling — aks holda o'yiningiz to'lmaydi»", ru: '«Возьмите Pro — иначе ваша игра не наберётся»' }, { uz: '«Hamma qaytdi, faqat siz yo\'qsiz!»', ru: '«Все вернулись, только вас нет!»' }, { uz: '«Yangi o\'yinlar bor, ilovani oching!»', ru: '«Есть новые игры, откройте приложение!»' }, { uz: "«Shanba, 18:00 o'yini yana e'lon qilindi»", ru: '«Игра в субботу, 18:00 снова объявлена»' }], correct: 3 },
  { q: { uz: "«Telegram xabarlarini o'chirish» bosilsa, nima bo'ladi?", ru: "Что будет, если нажать «Telegram xabarlarini o'chirish»?" }, opts: [{ uz: "Chat raqami o'chadi, xabar to'xtaydi", ru: 'Номер чата удаляется, сообщения прекращаются' }, { uz: "Hisob butunlay o'chib ketadi", ru: 'Аккаунт удаляется полностью' }, { uz: "Bot Telegram'dan butunlay o'chib ketadi", ru: 'Бот полностью удаляется из Telegram' }, { uz: 'Xabarlar faqat kechqurun keladi', ru: 'Сообщения приходят только вечером' }], correct: 0 },
  { q: { uz: 'Mentor misolida `telegramdan-ochdi` qachon yoziladi?', ru: 'Когда в примере Ментора пишется `telegramdan-ochdi`?' }, opts: [{ uz: 'Telegram xabari yuborilganda', ru: 'Когда отправлено сообщение Telegram' }, { uz: 'Xabardagi havola bilan ochilganda', ru: 'Когда открыли по ссылке из сообщения' }, { uz: "Bot «Start»ni qabul qilganda", ru: 'Когда бот принял «Start»' }, { uz: "Ilova telefonga yangidan o'rnatilganda", ru: 'Когда приложение заново установили на телефон' }], correct: 1 },
  { q: { uz: "Sinfdagi tekshiruv o'yinlari va yozuvlari nima bo'ladi?", ru: 'Что будет с проверочными играми и записями в классе?' }, opts: [{ uz: '`hodisalar` da shundayicha qoladi', ru: 'Остаются в `hodisalar` как есть' }, { uz: "Bir haftadan keyin o'zi o'chadi", ru: 'Сами удалятся через неделю' }, { uz: "Tekshirgach, `id` bo'yicha o'chiriladi", ru: 'После проверки удаляются по `id`' }, { uz: "Mentor misoliga namuna qilib ko'chiriladi", ru: 'Копируются в пример Ментора как образец' }], correct: 2 },
  { q: { uz: 'Mentor misolida Telegram xabari bilan eslatmaning farqi nima?', ru: 'Чем в примере Ментора сообщение Telegram отличается от напоминания?' }, opts: [{ uz: "Ikkalasini ham ilovaning o'zi oldindan qo'yadi", ru: 'Оба заранее ставит само приложение' }, { uz: "Ikkalasini ham Backend'ning o'zi yuborib turadi", ru: 'Оба отправляет сам Backend' }, { uz: "Eslatmani bot yozadi, Telegram xabarini ilova qo'yadi", ru: 'Напоминание пишет бот, сообщение Telegram ставит приложение' }, { uz: "Xabarni Backend yuboradi, eslatmani ilova qo'yadi", ru: 'Сообщение отправляет Backend, напоминание ставит приложение' }], correct: 3 },
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

// ===== AMALIYOT BLOKI (172/173) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). Qolipda yo'q (qolip taklifi): {…} joyi maydoni va kulrang «masalan» (WbPrompt), qadam ichidagi «Yordam»,
// «Nusxalash»li agent matni va Neon so'rovi (NusxaQator), tekshiruv kartasi «Kutilganidek» / «Boshqacha» (dars holatida — ccProgress, yangi pm- kaliti yo'q), «Ulgurmasangiz» qatori, O'qituvchi eslatmasi — shu faylda.
// Blok bajarilgani — faqat 4-qadam «Bajardim»idan (12-Modul 9.36 h); 4-qadam «Bajardim»i tekshiruv kartasi tanlanmaguncha qulf. Qadam matni QBlok'da <p> ichida — faqat span (div/pre yo'q).
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
// Telefonda blok qadami (13-Modul sinf-supurish A): Stage eng pastga surmaydi — natija maketi ostida joriy band va tugash xulosasi ekrandan tepada qolardi.
// Joriy band boshi kontent tepasiga (16 px), tugash xulosasi («Boshqacha» tanlanganda — uning izohi) markazga suriladi.
const telBlokSur = (tugadi) => {
  const bajarilgan = document.querySelectorAll('.q-blok-q.bajarildi');
  const el = tugadi ? document.querySelector('.q-blok-tugadi') || document.querySelector('p.wb-boshqa') || bajarilgan[bajarilgan.length - 1] : document.querySelector('.q-blok-q.joriy');
  const c = el && el.closest('.stage-content');
  if (!c) return;
  const cr = c.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const markaz = tugadi && r.height < cr.height - 32;
  const delta = markaz ? (r.top + r.bottom) / 2 - (cr.top + cr.bottom) / 2 : r.top - cr.top - 16;
  c.scrollTo({ top: c.scrollTop + delta, behavior: kamHarakat() ? 'auto' : 'smooth' });
};
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
const TK_BOSHQA = { uz: "Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring.", ru: 'Напишите агенту, что не совпало с требованием, и проверьте снова.' };
const XATO_YOLI = { uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если вышла ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Вышла такая ошибка: {ошибка}. Исправь.»' };
const MOS_KELMAGAN = { uz: "Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Несовпавшее напишите агенту: «{что} не как в требовании: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»' };
const PLATFORMA_KALIT = 'pm-m9d8-platforma';
const trekOqi = () => { const o = lsOqi(PLATFORMA_KALIT); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
// Trek kaliti yo'q bo'lsa — 1-amaliyot tepasida «Mobil trek» · «Web-trek», tanlov shu kalitga yoziladi (11-Modul 9.77; MD A-bo'lim 8)
function useTrek() {
  const [trek, setTrek] = useState(trekOqi);
  const [sora] = useState(() => trekOqi() === null);
  const tanla = (t) => { const o = lsOqi(PLATFORMA_KALIT); lsYoz(PLATFORMA_KALIT, { ...(o && typeof o === 'object' ? o : {}), trek: t, savedAt: Date.now() }); setTrek(t); };
  return { web: trek === 'web', trek, sora, tanla };
}
const TrekTanlov = ({ tk }) => (tk.sora ? <span className="wb-trek-q">{['mobil', 'web'].map(t => (
  <button key={t} type="button" className={cx('wb-trek', tk.trek === t && 'on')} onClick={() => tk.tanla(t)}>{tr(t === 'mobil' ? { uz: 'Mobil trek', ru: 'Мобильный трек' } : { uz: 'Web-trek', ru: 'Веб-трек' })}</button>))}</span> : null);
// «{avvalgidek …}» tekshiruvi (1-amaliyot, MD): kamida ikkita ish vergul bilan; «hammasi», «ilova» kabi bitta so'z emas (ikki tilli)
const BIR_SOZ = /^(hammasi|hamma|barchasi|barcha|ilova|loyiha|mahsulot|все|всё|приложение|проект|продукт)$/i;
const ikkiIsh = (s) => { const t = String(s || '').trim(); const b = t.split(/[,;]/).map(x => x.trim()).filter(x => x.length >= 2); return b.length >= 2 && !b.some(x => BIR_SOZ.test(x)); };
const IKKI_ISH_XATO = { uz: "Ikkita aniq ish yozing: masalan, kirish, e'lon berish.", ru: 'Напишите два конкретных дела: например, вход, объявление игры.' };
const joyli = (t, key) => String(t).split(/(\{[^}\s][^}]*\})/g).map((p, i) => (/^\{[^\s].*\}$/.test(p) ? <span key={key + '-' + i} className="q-joy">{p}</span> : <React.Fragment key={key + '-' + i}>{fmtCode(p)}</React.Fragment>));
// Prompt qutisi: {…} joylari maydonga yoziladi (yorliq — joy nomi, kulrang «masalan» — placeholder), «Nusxalash» to'ldirilgan matnni oladi
const WbPrompt = ({ satrlar, joylar = [], qiymat = {}, onYoz, tekshir, kimga }) => {
  const [ok, setOk] = useState(false);
  const [xato, setXato] = useState(null);
  const xatoRef = useRef(null);
  useEffect(() => {
    if (!xato) return undefined;
    const t = setTimeout(() => { const el = xatoRef.current; if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 60);
    return () => clearTimeout(t);
  }, [xato]);
  const almash = (s) => { let r = s; joylar.forEach(j => { const v = String(qiymat[j.id] || '').trim(); if (v) r = r.split(tr(j.joy)).join(v); }); return r; };
  const matn = satrlar.map(l => almash(tr(l)));
  const bos = async () => {
    const x = tekshir ? tekshir(qiymat) : null;
    if (x) { setXato(x); return; }
    setXato(null);
    if (await nusxala(matn.join('\n'))) { setOk(true); setTimeout(() => setOk(false), 1600); }
  };
  return (
    <span className="q-prompt wb-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr(kimga || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa wb-nusxa" onClick={bos}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="wb-ps">{joyli(l, i)}</span>)}
      {joylar.length > 0 && <span className="wb-joylar">{joylar.map(j => (
        <label key={j.id} className="wb-joy-m"><span className="wb-joy-n">{tr(j.joy)}</span>
          <input type="text" value={qiymat[j.id] || ''} maxLength={240} placeholder={tr(j.namuna).replace(/`/g, '')} onChange={e => { setXato(null); onYoz(j.id, e.target.value); }} /></label>))}</span>}
      {xato && <span ref={xatoRef} className="wb-xato" role="status">{tr(xato)}</span>}
    </span>
  );
};
const Yordam = ({ satrlar, sarlavha, ost }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <span className="wb-yordam-ust">
      <QTugma ikkinchi className="wb-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="wb-yordam fade-step">{sarlavha && <b>{tr(sarlavha)}</b>}{satrlar.map((l, i) => <span key={i} className="wb-yordam-s">{tx(l)}</span>)}{ost && <span className="wb-yordam-s wb-kulrang">{tx(ost)}</span>}</span>}
    </span>
  );
};
const Band = ({ children }) => <span className="wb-band">{children}</span>;
const Kulrang = ({ children }) => <span className="wb-kulrang">{children}</span>;
// Bitta qator «Nusxalash» bilan — Neon so'rovi (sql) yoki agentga matn (agent); {…} — o'quvchi o'zi qo'yadi, kalitga yozilmaydi
const NusxaQator = ({ yorliq, matn, sql }) => {
  const [ok, setOk] = useState(false);
  const m = tr(matn);
  const bos = async () => { if (await nusxala(m)) { setOk(true); setTimeout(() => setOk(false), 1500); } };
  return (
    <span className={cx('wb-nq', sql ? 'sql' : 'agent')}>{yorliq && <em>{tr(yorliq)}</em>}<span className="wb-nq-m">{sql ? <code>{m}</code> : joyli(m, 'nq')}</span><button type="button" className="wb-nusxa" onClick={bos}>{ok ? '✓' : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
  );
};
const AGENTGA = { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' };
// Tekshiruv kartasi (4-qadam oxirida, «Bajardim»dan oldin): «Kutilganidek» · «Boshqacha» (F-1007-466; 3, 10-darslar naqshi)
const TkKarta = ({ tk, onTanla, qulf }) => (
  <span className="wb-tk">
    <span className="wb-tk-s">{tr({ uz: "Natija talabdagidekmi?", ru: 'Результат как в требовании?' })}</span>
    <span className={cx('wb-tk-btnlar', tk == null && 'wb-chorla')}>
      <button type="button" className={cx('q-chip wb-tk-btn', tk === 'ok' && 'ok')} disabled={qulf} onClick={() => onTanla('ok')}>{tr({ uz: 'Kutilganidek', ru: 'Как ожидалось' })}</button>
      <button type="button" className={cx('q-chip wb-tk-btn', tk === 'boshqa' && 'err')} disabled={qulf} onClick={() => onTanla('boshqa')}>{tr({ uz: 'Boshqacha', ru: 'По-другому' })}</button>
    </span>
  </span>
);
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, izoh, ulgur, ulgurQadam = 99, ustoz }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const [tk, setTk] = useState(() => (storedAnswer && storedAnswer.tekshiruv) || null);
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam;
  const oxirgi = steps.length - 1;
  const qulfli = !done && stepN === oxirgi && tk == null;
  const bajardim = () => {
    if (isMentorLive || done || qulfli) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, tekshiruv: tk });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  // Blok bajarilgandan keyin karta o'zgarsa — dars holatidagi yozuv yangilanadi (yakun sarlavhasi shundan)
  const tanla = (v) => { setTk(v); if (storedAnswer && storedAnswer.solved) onAnswer(screen, { ...storedAnswer, tekshiruv: v }); };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const birinchi = useRef(stepN); // oldingi qadam: StrictMode ikkinchi chaqiruvida ham ochilishda surilmaydi
  const tor = useIsMobile(768);
  useEffect(() => {
    if (birinchi.current === stepN) { return undefined; }
    birinchi.current = stepN;
    // telefonda — Mentor yig'ilish o'tishidan (0,38 s) keyin: joriy band boshi yoki tugash xulosasi; kompyuterda — avvalgidek
    const t = setTimeout(() => { if (tor) { telBlokSur(done); return; } const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' }); }, tor ? 420 : 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : stepN === oxirgi && tk == null ? { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: tekshirib, «Kutilganidek» yoki «Boshqacha»ni tanlang.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: проверьте и выберите «Как ожидалось» или «По-другому».` }
      : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  const qadamlar = steps.map((c, i) => ({ h: tr(c.h), t: i === oxirgi ? <>{c.t}<TkKarta tk={tk} onTanla={tanla} qulf={isMentorLive} /></> : c.t, xato: c.xato }));
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={tor ? 0 : stepN} deskSignal={done ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cx('wb-blok', qulfli && 'qulf')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={qadamlar}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={done && tk === 'ok' && doneText ? tx(doneText) : null} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<>{done && tk === 'boshqa' && <p className="wb-boshqa fade-step">{tr(TK_BOSHQA)}</p>}{done && izoh && <QIzoh>{tx(izoh)}</QIzoh>}<MentorPracticeStats live={_live} screen={screen} /></>}>
          {ortda && <p className="wb-ortda">{tx(ortda)}</p>}
          {ulgur && !done && <p className="wb-ulgur">{tx(ulgur)}</p>}
          {ustoz && isMentorLive && <div className="wb-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{ustoz.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>}
        </QBlok>
      </div>
    </Stage>
  );
}
// Kutilgan natija: kadrlar bir marta o'zi yuradi (DE-200)
const useKadr = (soni, oraliq = 1600) => {
  const [kadr, setKadr] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma(Array.from({ length: soni - 1 }, (_, i) => [i === 0 ? 1200 : oraliq, () => setKadr(i + 1)])); }, []); // eslint-disable-line
  return kadr;
};
// Web-trekda telefon o'rnida brauzer oynasi (sayt sozlamalari)
const Brauzer = ({ manzil, children, sinf }) => (
  <div className={cx('wb-brauzer', sinf)}><span className="wb-brz-bar"><i /><i /><i /><code>{manzil}</code></span><div className="wb-brz-tana">{children}</div></div>
);
const SaytSozlama = ({ tg }) => (
  <div className="wb-sayt">
    <b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b>
    <span className="wb-il-q kul">{tr(TG_SAHNA.chiqish)}</span>
    {tg === 'ulangan' ? <><span className="wb-il-q ok">{tr(TG_SAHNA.ulangan)} ✓</span><span className="wb-il-q btn">{tr(TG_SAHNA.ochirish)}</span></>
      : <><span className="wb-il-q btn">{tr(TG_SAHNA.olish)}</span><span className="wb-il-osti">{tr(TG_SAHNA.osti)}</span></>}
  </div>
);
const telYorliq = (web) => (web ? { uz: 'sayt · ….netlify.app', ru: 'сайт · ….netlify.app' } : { uz: 'telefon · Expo Go', ru: 'телефон · Expo Go' });

// --- 1-amaliyot: bot va ulanish (tayyor talab + 3 joy)
const A1_PROMPT = [
  { uz: "Qayerda: `backend/` — yangi Telegram bo'limi va foydalanuvchilar jadvaliga yangi ustunlar; {tugma turadigan joy}.", ru: 'Где: `backend/` — новый раздел Telegram и новые столбцы в таблице пользователей; {где стоит кнопка}.' },
  { uz: "Nima qilsin: Telegram bot orqali foydalanuvchiga xabar yuborish uchun ulanishni qur. Bot tokeni — `.env` dagi `TELEGRAM_BOT_TOKEN`, maxfiy kalit — `.env` dagi `TELEGRAM_SIR`.", ru: 'Что сделать: построй подключение, чтобы отправлять пользователю сообщения через Telegram-бота. Токен бота — `TELEGRAM_BOT_TOKEN` в `.env`, секретный ключ — `TELEGRAM_SIR` в `.env`.' },
  { uz: "1) Foydalanuvchilar jadvaliga: `telegram_chat_id` (bo'sh bo'lishi mumkin; Telegram chat raqami katta son — uni to'liq saqlaydigan tur tanla) va bir martalik kod uchun ikki ustun — kodning o'zi va amal qilish muddati.", ru: '1) В таблицу пользователей: `telegram_chat_id` (может быть пустым; номер чата Telegram — большое число, выбери тип, который хранит его полностью) и два столбца для одноразового кода — сам код и срок действия.' },
  { uz: "2) Backend Render'da ishga tushganda (ochiq manzili bor bo'lsa) Telegram'ga webhook manzilini o'rnatsin: `{ochiq manzil}/telegram/webhook`, `secret_token` — `TELEGRAM_SIR`; laptopda — o'rnatmasin. Botning foydalanuvchi nomini `getMe` bilan olsin. O'rnatish xato bersa — Backend ishlashda davom etsin, xato logga yozilsin (token va kalitsiz).", ru: '2) Когда Backend запускается на Render (если есть открытый адрес), пусть установит в Telegram адрес webhook: `{ochiq manzil}/telegram/webhook`, `secret_token` — `TELEGRAM_SIR`; на ноутбуке — не устанавливать. Имя пользователя бота пусть берёт через `getMe`. Если установка выдаст ошибку — Backend продолжает работать, ошибка пишется в лог (без токена и ключа).' },
  { uz: "3) `POST /telegram/kod` — faqat hisobga kirgan foydalanuvchi uchun: yangi bir martalik kod (16 belgi, faqat harf va raqam, `crypto` bilan tasodifiy — `Math.random` emas), 10 daqiqa amal qiladi, logga yozilmaydi; javob — havola `https://t.me/{botning foydalanuvchi nomi}?start={kod}`.", ru: '3) `POST /telegram/kod` — только для вошедшего в аккаунт пользователя: новый одноразовый код (16 символов, только буквы и цифры, случайный через `crypto` — не `Math.random`), действует 10 минут, в лог не пишется; ответ — ссылка `https://t.me/{botning foydalanuvchi nomi}?start={kod}`.' },
  { uz: "4) `POST /telegram/webhook`: `X-Telegram-Bot-Api-Secret-Token` sarlavhasi `TELEGRAM_SIR` ga teng bo'lmasa — `401`, hech narsa qilma. Faqat shaxsiy chatdan kelgan `/start {kod}` ni ishla: kod topilsa va muddati o'tmagan bo'lsa — o'sha foydalanuvchiga chat raqamini yoz va kodni o'chir — uchalasi bitta Database ishida (bir vaqtdagi ikki so'rovdan faqat bittasi ulaydi); bot shu chatga javob yozsin: «Ulandi. {xabar sababi}, shu yerga yozaman. O'chirish — ilovada.»", ru: '4) `POST /telegram/webhook`: если заголовок `X-Telegram-Bot-Api-Secret-Token` не равен `TELEGRAM_SIR` — `401`, ничего не делай. Обрабатывай только `/start {kod}` из личного чата: если код найден и не истёк — запиши этому пользователю номер чата и удали код — все три в одной операции Database (из двух одновременных запросов подключает только один); бот пусть ответит в этот чат: «Ulandi. {xabar sababi}, shu yerga yozaman. O\'chirish — ilovada.»' },
  { uz: "Kod yo'q, eskirgan yoki ishlatilgan bo'lsa — bot javobi: «Havola eskirgan. Ilovada «Telegram'da xabar olish»ni qayta bosing.» Boshqa har qanday xabarga — «Bu bot ilovadan ulanadi: ilovada «Telegram'da xabar olish»ni bosing.»", ru: "Если кода нет, он истёк или использован — ответ бота: «Havola eskirgan. Ilovada «Telegram'da xabar olish»ni qayta bosing.» На любое другое сообщение — «Bu bot ilovadan ulanadi: ilovada «Telegram'da xabar olish»ni bosing.»" },
  { uz: "Telegram'ga javob — `200` (`401` holatidan tashqari). Telegram javob olmasa so'rovni qayta yuboradi: bir xil so'rov (`update_id`) ikkinchi marta kelsa — qayta ishlama; `update_id` ni Database'da noyob qilib eslab qol (Backend qayta ishga tushsa ham).", ru: 'Ответ Telegram — `200` (кроме случая `401`). Если Telegram не получит ответ, он повторит запрос: если тот же запрос (`update_id`) придёт второй раз — не обрабатывай; запоминай `update_id` в Database как уникальный (даже если Backend перезапустится).' },
  { uz: "5) Telegram so'rovidan faqat chat raqami saqlansin; ism, Telegram nomi va xabar matni saqlanmasin va logga yozilmasin. `GET /men` javobiga `telegram` (rost yoki yolg'on) qo'sh" + " — chat raqamining o'zi ilovaga yuborilmasin.", ru: '5) Из запроса Telegram сохраняется только номер чата; имя, имя в Telegram и текст сообщения не сохраняются и не пишутся в лог. В ответ `GET /men` добавь `telegram` (истина или ложь) — сам номер чата в приложение не отправляется.' },
  { uz: "6) {tugma turadigan joy}da tugma «Telegram'da xabar olish», ostida kichik matn: «{xabar sababi} — Telegram'da xabar; haftasiga ko'pi bilan ikkita». Bosilganda `POST /telegram/kod` dan havolani olib Telegram'da ochsin. Ulangan bo'lsa — tugma o'rnida «Telegram ulangan».", ru: "6) В {где стоит кнопка} кнопка «Telegram'da xabar olish», под ней мелкий текст: «{xabar sababi} — Telegram'da xabar; haftasiga ko'pi bilan ikkita». По нажатию берёт ссылку из `POST /telegram/kod` и открывает в Telegram. Если подключено — вместо кнопки «Telegram ulangan»." },
  { uz: "Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin. `TELEGRAM_BOT_TOKEN` va `TELEGRAM_SIR` qiymatini kodga, logga va README'ga yozma — faqat `.env` dan o'qi; `backend/.env.example` va README'dagi o'zgaruvchilar ro'yxatiga nomlarini qiymatsiz qo'sh. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: {что должно работать как раньше} работает как раньше. Значения `TELEGRAM_BOT_TOKEN` и `TELEGRAM_SIR` не пиши в код, лог и README — читай только из `.env`; в `backend/.env.example` и список переменных в README добавь имена без значений. `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_JOYLAR = [
  { id: 'joy', joy: { uz: '{tugma turadigan joy}', ru: '{где стоит кнопка}' }, namuna: { uz: "masalan: `mobil/` — «Hisobdan chiqish» yonidagi sozlamalar qatori", ru: 'например: `mobil/` — строка настроек рядом с «Hisobdan chiqish»' } },
  { id: 'sabab', joy: { uz: '{xabar sababi}', ru: '{xabar sababi}' }, namuna: { uz: "masalan: Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa", ru: "например: Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa" } },
  { id: 'avval', joy: { uz: "{avvalgidek ishlashi kerak bo'lgan ishlar}", ru: '{что должно работать как раньше}' }, namuna: { uz: "masalan: kirish, e'lon berish, qo'shilish, eslatmalar va to'lov xabari", ru: 'например: вход, объявление игры, присоединение, напоминания и сообщение об оплате' } }
];
const YORDAM_A1 = [
  { uz: "Qayerda: `backend/` — yangi Telegram bo'limi va `oyinchilar` jadvaliga yangi ustunlar; `mobil/` — «Hisobdan chiqish» yonidagi sozlamalar qatori.", ru: 'Где: `backend/` — новый раздел Telegram и новые столбцы в таблице `oyinchilar`; `mobil/` — строка настроек рядом с «Hisobdan chiqish».' },
  { uz: "Nima qilsin: Telegram bot orqali o'yinchiga xabar yuborish uchun ulanishni qur. Bot tokeni — `.env` dagi `TELEGRAM_BOT_TOKEN`, maxfiy kalit — `.env` dagi `TELEGRAM_SIR`.", ru: 'Что сделать: построй подключение, чтобы отправлять игроку сообщения через Telegram-бота. Токен бота — `TELEGRAM_BOT_TOKEN` в `.env`, секретный ключ — `TELEGRAM_SIR` в `.env`.' },
  { uz: "1) `oyinchilar` ga: `telegram_chat_id` (bo'sh bo'lishi mumkin; Telegram chat raqami katta son — uni to'liq saqlaydigan tur tanla), `telegram_kod` va `telegram_kod_gacha` (bir martalik kod va uning amal qilish muddati).", ru: '1) В `oyinchilar`: `telegram_chat_id` (может быть пустым; номер чата Telegram — большое число, выбери тип, который хранит его полностью), `telegram_kod` и `telegram_kod_gacha` (одноразовый код и срок его действия).' },
  A1_PROMPT[3],
  { uz: "3) `POST /telegram/kod` — faqat hisobga kirgan o'yinchi uchun: yangi bir martalik kod (16 belgi, faqat harf va raqam, `crypto` bilan tasodifiy — `Math.random` emas), 10 daqiqa amal qiladi, logga yozilmaydi; javob — havola `https://t.me/{botning foydalanuvchi nomi}?start={kod}`.", ru: '3) `POST /telegram/kod` — только для вошедшего игрока: новый одноразовый код (16 символов, только буквы и цифры, случайный через `crypto` — не `Math.random`), действует 10 минут, в лог не пишется; ответ — ссылка `https://t.me/{botning foydalanuvchi nomi}?start={kod}`.' },
  { uz: "4) `POST /telegram/webhook`: `X-Telegram-Bot-Api-Secret-Token` sarlavhasi `TELEGRAM_SIR` ga teng bo'lmasa — `401`, hech narsa qilma. Faqat shaxsiy chatdan kelgan `/start {kod}` ni ishla: kod topilsa va muddati o'tmagan bo'lsa — o'sha o'yinchiga chat raqamini yoz va kodni o'chir — uchalasi bitta Database ishida (bir vaqtdagi ikki so'rovdan faqat bittasi ulaydi); bot shu chatga javob yozsin: «Ulandi. Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa, shu yerga yozaman. O'chirish — ilovada.»", ru: "4) `POST /telegram/webhook`: если заголовок `X-Telegram-Bot-Api-Secret-Token` не равен `TELEGRAM_SIR` — `401`, ничего не делай. Обрабатывай только `/start {kod}` из личного чата: если код найден и не истёк — запиши этому игроку номер чата и удали код — все три в одной операции Database (из двух одновременных запросов подключает только один); бот пусть ответит в этот чат: «Ulandi. Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa, shu yerga yozaman. O'chirish — ilovada.»" },
  A1_PROMPT[6],
  A1_PROMPT[7],
  A1_PROMPT[8],
  { uz: "6) `mobil/` — «Hisobdan chiqish» yonidagi sozlamalar qatorida tugma «Telegram'da xabar olish», ostida kichik matn: «Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa — Telegram'da xabar; haftasiga ko'pi bilan ikkita». Bosilganda `POST /telegram/kod` dan havolani olib Telegram'da ochsin. Ulangan bo'lsa — tugma o'rnida «Telegram ulangan».", ru: "6) `mobil/` — в строке настроек рядом с «Hisobdan chiqish» кнопка «Telegram'da xabar olish», под ней мелкий текст: «Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa — Telegram'da xabar; haftasiga ko'pi bilan ikkita». По нажатию берёт ссылку из `POST /telegram/kod` и открывает в Telegram. Если подключено — вместо кнопки «Telegram ulangan»." },
  { uz: "Nima buzilmasin: kirish, e'lon berish, qo'shilish, eslatmalar va to'lov xabari avvalgidek ishlasin. `TELEGRAM_BOT_TOKEN` va `TELEGRAM_SIR` qiymatini kodga, logga va README'ga yozma — faqat `.env` dan o'qi; `backend/.env.example` va README'dagi o'zgaruvchilar ro'yxatiga nomlarini qiymatsiz qo'sh. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход, объявление игры, присоединение, напоминания и сообщение об оплате работают как раньше. Значения `TELEGRAM_BOT_TOKEN` и `TELEGRAM_SIR` не пиши в код, лог и README — читай только из `.env`; в `backend/.env.example` и список переменных в README добавь имена без значений. `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_WEB = { uz: "Web-trekda: «Qayerda» qatorida `mobil/` o'rnida sayt papkangiz (`prototip/`) va undagi sozlamalar joyi turadi; havola yangi oynada ochiladi, qolgani o'sha.", ru: 'В веб-треке: в строке «Где» вместо `mobil/` — папка сайта (`prototip/`) и место настроек в ней; ссылка открывается в новом окне, остальное то же.' };
const A1_KOD_PROMPT = { uz: "Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: maxfiy kalit tekshiriladigan qator, bir martalik kod tekshiriladigan qator va chat raqami yoziladigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в написанном коде три места с именем файла и номером строки: строку проверки секретного ключа, строку проверки одноразового кода и строку, где записывается номер чата. Объясни одной фразой, что делает каждая. Код не меняй.' };
const NEON = {
  topish: "SELECT id FROM oyinchilar WHERE login = '{loginingiz}';",
  ulangan: 'SELECT id, telegram_chat_id IS NOT NULL AS ulangan FROM oyinchilar WHERE id = {hisob raqamingiz};',
  sanoq: "SELECT id, yaratilgan FROM hodisalar WHERE nom = 'telegramdan-ochdi' ORDER BY yaratilgan;",
  kalitYarat: "node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
};
const A1_USTOZ = [
  { uz: "Maxfiy kalit sarlavhada — 3-darsdagi imzodan farqi: imzo kalitdan hisoblanardi, bu yerda Telegram kalitning o'zini yuboradi; Backend uni `.env` dagisi bilan solishtiradi. Telegram javob olmasa so'rovni qayta yuboradi — 3-darsdagi «takror xabar» shu yerda ham (talabning 4-bandi).", ru: 'Секретный ключ в заголовке — отличие от подписи 3-го урока: подпись вычислялась из ключа, здесь Telegram присылает сам ключ; Backend сравнивает его с тем, что в `.env`. Если Telegram не получит ответ, он повторит запрос — «повторное сообщение» из 3-го урока есть и здесь (пункт 4 требования).' },
  { uz: "Bir martalik kod 10 daqiqa va bir marta ishlaydi: havolani boshqa odamga yubormang — kim «Start»ni bossa, shu chat ulanadi; adashib ulansa — 3-amaliyotdagi «Telegram xabarlarini o'chirish». Tugma va bot nomlari Telegram til sozlamasiga qarab boshqacha yozilishi mumkin.", ru: "Одноразовый код работает 10 минут и один раз: ссылку другому человеку не отправлять — чей «Start», тот чат и подключится; если подключили по ошибке — «Telegram xabarlarini o'chirish» из практики 3. Названия кнопок и бота могут отличаться в зависимости от языка Telegram." }
];
const A1Natija = ({ web }) => {
  const kadr = useKadr(2, 1800);
  const chat = { ekran: 'telegram', puf: [{ id: 's', tur: 'siz', t: { uz: '/start', ru: '/start' } }, { id: 'b', tur: 'bot', yangi: true, t: BOT_JAVOBLARI.ulandi }] };
  return (
    <div className="wb-an">
      <div className="wb-an-tel">
        {web && kadr === 0 ? <Brauzer manzil="….netlify.app"><SaytSozlama tg="olish" /></Brauzer>
          : <Telefon t={kadr === 0 ? { ekran: 'ilova', tg: 'olish', yorliq: telYorliq(web) } : { ...chat, yorliq: { uz: 'Telegram · …_bot', ru: 'Telegram · …_bot' } }} />}
      </div>
      <div className="wb-an-ost">
        <div className="wb-neon"><span className="wb-neon-y">Neon · oyinchilar</span><span className="wb-neon-q"><code>id 7</code><code>ulangan <b>true</b></code></span></div>
        <div className="wb-term"><span className="buyruq">$ git grep -n "TELEGRAM_"</span><span>backend/.env.example:4:TELEGRAM_BOT_TOKEN=</span><span>backend/.env.example:5:TELEGRAM_SIR=</span><span>backend/src/telegram/…: process.env.TELEGRAM_SIR</span><span>README.md:…: TELEGRAM_BOT_TOKEN</span></div>
      </div>
    </div>
  );
};
const ScreenA1 = (props) => {
  const tk = useTrek();
  const [q, setQ] = useState({});
  const yoz = (k, v) => setQ(o => ({ ...o, [k]: v }));
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z repo'ngiz", ru: 'Практика 1 · ваш репозиторий' }}
      title={{ uz: <>Foydalanuvchi Telegram'ni <span className="italic" style={{ color: T.accent }}>kodli havola</span> bilan ulasin.</>, ru: <>Пусть пользователь подключит Telegram <span className="italic" style={{ color: T.accent }}>по ссылке с кодом</span>.</> }}
      mentor={{ uz: "Talab tayyor — uchta joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.", ru: 'Требование готово — три места заполните под свой продукт; начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <><TrekTanlov tk={tk} />{tx({ uz: "Antigravity'da o'z repo'ngizni oching — 7-darsda to'xtagan joyingizdan. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin; `git ls-files backend/.env` — natija bo'sh bo'lsin (chiqsa — o'qituvchiga ayting: kalitlar almashtiriladi).", ru: 'Откройте свой репозиторий в Antigravity — с места, где остановились на 7-м уроке. В терминале `git status`: файлов `.env` в списке быть не должно; `git ls-files backend/.env` — результат пустой (если что-то вывелось — скажите учителю: ключи заменят).' })}
          <Band>{tx({ uz: "Telegram'da @BotFather'da yangi bot oching — 7-Modulda o'rgangan yo'l: `/newbot`, nom, keyin foydalanuvchi nomi (oxiri «bot» bilan). 7-Moduldagi botingiz o'sha moduldagi Backend'ga ulangan bo'lishi mumkin: botning webhook manzili bitta — ikki Backend bitta botning so'rovlarini birga ololmaydi; shuning uchun yangi bot.", ru: 'В Telegram у @BotFather создайте нового бота — путь из 7-го модуля: `/newbot`, имя, затем имя пользователя (с «bot» в конце). Ваш бот из 7-го модуля может быть подключён к Backend того модуля: адрес webhook у бота один — два Backend не могут вместе получать запросы одного бота; поэтому новый бот.' })}</Band>
          <Band>{tx({ uz: "`backend/.env` ga ikki qator yozing: `TELEGRAM_BOT_TOKEN=` va @BotFather bergan token · `TELEGRAM_SIR=` va tasodifiy uzun kalit — terminalda yarating:", ru: 'Впишите в `backend/.env` две строки: `TELEGRAM_BOT_TOKEN=` и токен от @BotFather · `TELEGRAM_SIR=` и случайный длинный ключ — создайте его в терминале:' })}</Band>
          <NusxaQator sql matn={NEON.kalitYarat} />
          <Kulrang>{tr({ uz: "(64 belgili harf-raqam; Telegram talabiga mos); o'zingiz o'ylagan so'z yoki parolingiz emas.", ru: '(64 символа из букв и цифр; подходит под требование Telegram); не придуманное вами слово и не ваш пароль.' })}</Kulrang>
          <Band>{tr({ uz: "Ikkalasini Render'dagi xizmatingizning Environment bo'limiga ham qo'shib saqlang. ", ru: 'Добавьте оба и в раздел Environment вашего сервиса на Render и сохраните. ' })}<b>{tr({ uz: "Token va kalitni agentga, chatga, README'ga va skrinshotga yozmang", ru: 'Не пишите токен и ключ агенту, в чат, в README и на скриншот' })}</b>{tr({ uz: ' — agent faqat ularning nomini biladi.', ru: ' — агент знает только их имена.' })}</Band>
          <Band>{tr({ uz: "Tekshiruv uchun hisob raqamingizni toping — Neon SQL Editor'da (jadval va ustun nomi — mahsulotingizdagidek) → «Run»:", ru: 'Для проверки найдите номер своего аккаунта — в Neon SQL Editor (имена таблицы и столбца — как в вашем продукте) → «Run»:' })}</Band>
          <NusxaQator sql matn={NEON.topish} />
          <Band>{tr({ uz: "Ikki savolga javob toping: tugma ilovangizning qayerida turadi? Foydalanuvchiga nima haqida yozasiz — bir gapda? (Mentor misolida: «Hisobdan chiqish» yonida; ostida «Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa — Telegram'da xabar; haftasiga ko'pi bilan ikkita».)", ru: "Найдите ответы на два вопроса: где в вашем приложении стоит кнопка? О чём вы напишете пользователю — одной фразой? (В примере Ментора: рядом с «Hisobdan chiqish»; под ней «Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa — Telegram'da xabar; haftasiga ko'pi bilan ikkita».)" })}</Band>
          <Kulrang>{tx({ uz: "Telegram akkauntingiz bo'lmasa — yangisini ochmang: agentdan mahsulotingizda `namuna = true` tekshiruv hisobini ochishni so'rang, ilovaga shu hisob bilan kiring; «Start»ni sherigingiz o'z Telegram'ida bosadi. 3-amaliyot oxirida ulanish o'chiriladi, tekshiruv hisobi `id` bo'yicha o'chiriladi. Sherik Telegram'ini o'z hisobingizga ulamang. Mobil trekda `npx expo start` ishlab tursin; web-trekda tugma saytingizda bo'ladi — bot ikkala trekda bir xil.", ru: 'Если аккаунта Telegram нет — новый не открывайте: попросите агента открыть в вашем продукте проверочный аккаунт `namuna = true`, войдите в приложение под ним; «Start» нажмёт напарник в своём Telegram. В конце практики 3 подключение удаляется, проверочный аккаунт удаляется по `id`. Telegram напарника к своему аккаунту не подключайте. В мобильном треке пусть работает `npx expo start`; в веб-треке кнопка будет на сайте — бот в обоих треках одинаков.' })}</Kulrang></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' })}
          <Band><b>{tr({ uz: "Foydalanuvchi ilovada tugmani bosib, botda «Start»ni bosadi — Backend uning Telegram chat raqamini saqlaydi, boshqa hech narsani emas.", ru: 'Пользователь нажимает кнопку в приложении и «Start» в боте — Backend сохраняет номер его чата Telegram и больше ничего.' })}</b></Band>
          <WbPrompt satrlar={A1_PROMPT} joylar={A1_JOYLAR} qiymat={q} onYoz={yoz} tekshir={(v) => (ikkiIsh(v.avval) ? null : IKKI_ISH_XATO)} />
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq talab", ru: 'Полное требование из примера Ментора' }} satrlar={YORDAM_A1} ost={A1_WEB} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"telegram ulanish\"`, `git push`.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают со списком агента, `.env` в списке нет; каждый файл добавьте `git add <файл>`, `git commit -m "telegram ulanish"`, `git push`.' })}
          <Band>{tr({ uz: "Render Backend'ning yangi versiyasini chiqaradi — Render sahifasida tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Kutayotganda agentga:", ru: 'Render выпустит новую версию Backend — дождитесь окончания на странице Render (может занять несколько минут). Пока ждёте, агенту:' })}</Band>
          <NusxaQator yorliq={AGENTGA} matn={A1_KOD_PROMPT} />
          <Band>{tx({ uz: "Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.", ru: 'В мобильном треке Expo Go обычно сам перезагружает приложение (если нет — `r` в терминале); в веб-треке после push Netlify обычно сам обновляет сайт.' })}</Band></>,
          xato: tx(XATO_YOLI) },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "talabning har gapini o'zingiz ko'ring:", ru: 'проверьте сами каждую фразу требования:' })}
          <Band><b>(1)</b> {tr({ uz: "Ilovangizda «Telegram'da xabar olish» → Telegram ochiladi → botda «Start» (tugma nomi Telegram tilingizga qarab boshqacha bo'lishi mumkin). Bot javobi chiqishi kerak — bir daqiqagacha kechikishi mumkin: bepul Backend uxlab qolgan bo'lsa, uyg'onadi. Ilovani yangilang: tugma o'rnida «Telegram ulangan».", ru: "В приложении «Telegram'da xabar olish» → откроется Telegram → в боте «Start» (название кнопки может отличаться по языку Telegram). Должен прийти ответ бота — может задержаться до минуты: если бесплатный Backend уснул, он проснётся. Обновите приложение: вместо кнопки «Telegram ulangan»." })}</Band>
          <Band><b>(2)</b> {tx({ uz: "Neon SQL Editor'da → «Run» — `ulangan` ustunida `true`. So'rov ataylab shunday: chat raqamining o'zi ekranga chiqmaydi va hech qayerga yozilmaydi.", ru: 'В Neon SQL Editor → «Run» — в столбце `ulangan` значение `true`. Запрос нарочно такой: сам номер чата не выводится на экран и никуда не пишется.' })}</Band>
          <NusxaQator sql matn={NEON.ulangan} />
          <Band><b>(3)</b> {tr({ uz: "Botga oddiy xabar yozing (masalan, «salom») — bot «Bu bot ilovadan ulanadi: …» javobini yozishi kerak.", ru: 'Напишите боту обычное сообщение (например, «salom») — бот должен ответить «Bu bot ilovadan ulanadi: …».' })}</Band>
          <Band><b>(4)</b> {tx({ uz: "Terminalda `git grep -n \"TELEGRAM_\"`: natijada faqat nomlar (`process.env.…`, `.env.example`, README qatori). Qiymat chiqsa — agentga «Qiymatni koddan olib tashla, faqat `.env` dan o'qi.» deng, @BotFather'da yangi token oling (7-Modul) va `.env`, Render'da almashtiring.", ru: 'В терминале `git grep -n "TELEGRAM_"`: в результате только имена (`process.env.…`, `.env.example`, строка README). Если вывелось значение — скажите агенту «Убери значение из кода, читай только из `.env`.», получите новый токен у @BotFather (7-й модуль) и замените в `.env` и в Render.' })}</Band>
          <Band>{tr(MOS_KELMAGAN)}</Band></> }
      ]}
      natija={<A1Natija web={tk.web} />}
      ortda={{ uz: "Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-08-done` — oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` ga o'z qiymatlaringizni yozasiz (`TELEGRAM_BOT_TOKEN` — o'z botingizniki).", ru: 'Отстали? Откройте пример Ментора вне своего репозитория, в новой папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-08-done` — последнюю команду запускайте только в этой новой папке: она удаляет изменения в папке. В `backend/.env` впишите свои значения (`TELEGRAM_BOT_TOKEN` — вашего бота).' }}
      ulgur={{ uz: "Ulgurmasangiz: (4) `git grep` ni Render kutishi paytida bajaring. «Davom etish» faqat 4-qadam «Bajardim»idan keyin ochiladi: 2-amaliyot tekshiruvi shu ulanishga tayanadi — botni o'zingiz ko'rmasdan o'tmang.", ru: 'Если не успеваете: (4) `git grep` выполните, пока ждёте Render. «Продолжить» откроется только после «Готово» на шаге 4: проверка практики 2 опирается на это подключение — не идите дальше, не увидев бота сами.' }}
      doneText={{ uz: "Bot faqat «Start»ni bosgan foydalanuvchini taniydi; Backend'da faqat chat raqami turadi.", ru: 'Бот знает только пользователя, нажавшего «Start»; в Backend хранится только номер чата.' }}
      izoh={{ uz: "Kodni agent yozdi — Telegram xabari ishlashini 2-amaliyotdagi tekshiruv ko'rsatadi.", ru: 'Код написал агент — работает ли сообщение Telegram, покажет проверка в практике 2.' }}
      ustoz={A1_USTOZ} />
  );
};

// --- 2-amaliyot: Telegram xabari va haftalik chegara (tayyor talab + 4 joy)
const A2_PROMPT = [
  { uz: "Qayerda: `backend/` — Telegram bo'limi va {qaysi o'zgarishda} ro'y beradigan joy.", ru: 'Где: `backend/` — раздел Telegram и место, где происходит {qaysi o\'zgarishda}.' },
  { uz: "Nima qilsin: {qaysi o'zgarishda} — {kimga} bot orqali Telegram xabari yuborsin (faqat Telegram'ni ulaganlarga): «{xabar matni}», ostida havola `{mahsulot manzili}?kanal=telegram`.", ru: "Что сделать: {qaysi o'zgarishda} — {kimga} пусть отправит сообщение Telegram через бота (только подключившим Telegram): «{xabar matni}», под ним ссылка `{mahsulot manzili}?kanal=telegram`." },
  { uz: "Haftalik chegara: bir odamga haftasiga (dushanbadan yakshanbagacha, `Asia/Tashkent` vaqti) ko'pi bilan ikkita Telegram xabari; bitta narsa haqida bitta odamga bir marta. Buning uchun xabarlarni yangi jadvalga yoz: kimga, nima haqida, qachon — xabar matni va chat raqamisiz; «kimga + nima haqida» jufti noyob.", ru: 'Недельный лимит: одному человеку не больше двух сообщений Telegram в неделю (с понедельника по воскресенье, время `Asia/Tashkent`); об одном и том же одному человеку — один раз. Для этого записывай сообщения в новую таблицу: кому, о чём, когда — без текста сообщения и номера чата; пара «кому + о чём» уникальна.' },
  { uz: "Tartib: avval chegarani sanab, jadvalga yozuv qo'sh" + " — ikkalasi bitta Database ishida (bir vaqtdagi ikki so'rov ham chegaradan oshirmasin, bitta narsa haqida ikki marta yubormasin); faqat yozuv qo'shilgan bo'lsa — xabarni yubor. Telegram xabarni qabul qilmasa (masalan, odam botni to'xtatgan bo'lsa) — o'sha yozuvni o'chir, chat raqamiga tegma, keyingisiga o't. So'rov javobi xabarlar yuborilgach qaytsin. Bitta chatga sekundiga bittadan ko'p xabar yuborma.", ru: 'Порядок: сначала посчитай лимит и добавь запись в таблицу — оба в одной операции Database (и два одновременных запроса не превысят лимит и не отправят об одном дважды); отправляй сообщение, только если запись добавлена. Если Telegram не принял сообщение (например, человек остановил бота) — удали эту запись, номер чата не трогай, переходи к следующему. Ответ на запрос пусть возвращается после отправки сообщений. Не отправляй в один чат больше одного сообщения в секунду.' },
  { uz: "Nima buzilmasin: 1-amaliyotdagi ulanish avvalgidek; Telegram'ni ulamagan odamga hech narsa yuborilmasin; xabarda to'lov taklifi bo'lmasin; `TELEGRAM_BOT_TOKEN` qiymati logga yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: подключение из практики 1 — как раньше; не подключившему Telegram ничего не отправлять; в сообщении нет предложения оплаты; значение `TELEGRAM_BOT_TOKEN` в лог не пишется. Больше ничего не трогай, назови изменённые файлы.' }
];
const A2_JOYLAR = [
  { id: 'ozgarish', joy: { uz: "{qaysi o'zgarishda}", ru: "{qaysi o'zgarishda}" }, namuna: { uz: "masalan: «Doimiy o'yin»ning keyingi haftadagi o'yini yaratilganda", ru: "например: когда создаётся игра «Doimiy o'yin» на следующей неделе" } },
  { id: 'kimga', joy: { uz: '{kimga}', ru: '{kimga}' }, namuna: { uz: "masalan: o'tgan haftadagi o'yinida qatnashgan o'yinchilarga", ru: 'например: игрокам, участвовавшим в её игре на прошлой неделе' } },
  { id: 'matn', joy: { uz: '{xabar matni}', ru: '{xabar matni}' }, namuna: { uz: "masalan: {kun}, {soat} o'yini yana e'lon qilindi · {maydon}", ru: "например: {kun}, {soat} o'yini yana e'lon qilindi · {maydon}" } },
  { id: 'manzil', joy: { uz: '{mahsulot manzili}', ru: '{mahsulot manzili}' }, namuna: { uz: "masalan: brauzer ko'rinishi manzili (Netlify)", ru: 'например: адрес браузерной версии (Netlify)' } }
];
const YORDAM_A2 = [
  { uz: "Qayerda: `backend/` — Telegram bo'limi va «Doimiy o'yin»ning keyingi haftadagi o'yini yaratiladigan joy (`GET /oyinlar`, 4-dars).", ru: "Где: `backend/` — раздел Telegram и место, где создаётся игра «Doimiy o'yin» на следующей неделе (`GET /oyinlar`, 4-й урок)." },
  { uz: "Nima qilsin: «Doimiy o'yin»ning keyingi haftadagi o'yini yaratilganda — o'tgan haftadagi o'yinida qatnashgan (`qoshildi` yoki `keladi`) va Telegram'ni ulagan o'yinchilarga bot orqali Telegram xabari yuborsin: «{kun}, {soat} o'yini yana e'lon qilindi · {maydon}», ostida havola `{brauzer ko'rinishi manzili}?kanal=telegram`.", ru: "Что сделать: когда создаётся игра «Doimiy o'yin» на следующей неделе — игрокам, участвовавшим в её игре на прошлой неделе (`qoshildi` или `keladi`) и подключившим Telegram, отправить через бота сообщение: «{kun}, {soat} o'yini yana e'lon qilindi · {maydon}», под ним ссылка `{brauzer ko'rinishi manzili}?kanal=telegram`." },
  { uz: "Haftalik chegara: bir o'yinchiga haftasiga (dushanbadan yakshanbagacha, `Asia/Tashkent` vaqti) ko'pi bilan ikkita Telegram xabari; bitta o'yin haqida bitta o'yinchiga bir marta. Xabarlarni yangi jadvalga yoz: `telegram_xabarlar` — `id`, `oyinchi_id`, `oyin_id`, `yuborilgan`; `oyinchi_id` va `oyin_id` jufti noyob; xabar matni va chat raqami bu jadvalga yozilmasin.", ru: 'Недельный лимит: одному игроку не больше двух сообщений Telegram в неделю (с понедельника по воскресенье, время `Asia/Tashkent`); об одной игре одному игроку — один раз. Записывай сообщения в новую таблицу: `telegram_xabarlar` — `id`, `oyinchi_id`, `oyin_id`, `yuborilgan`; пара `oyinchi_id` и `oyin_id` уникальна; текст сообщения и номер чата в эту таблицу не пишутся.' },
  { uz: "Tartib: avval chegarani sanab, `telegram_xabarlar` ga yozuv qo'sh" + " — ikkalasi bitta Database ishida (bir vaqtdagi ikki `GET /oyinlar` ham chegaradan oshirmasin, bitta o'yin haqida ikki marta yubormasin); faqat yozuv qo'shilgan bo'lsa — xabarni yubor. Telegram xabarni qabul qilmasa (masalan, o'yinchi botni to'xtatgan bo'lsa) — o'sha yozuvni o'chir, chat raqamiga tegma, keyingisiga o't. `GET /oyinlar` javobi xabarlar yuborilgach qaytsin. Bitta chatga sekundiga bittadan ko'p xabar yuborma.", ru: 'Порядок: сначала посчитай лимит и добавь запись в `telegram_xabarlar` — оба в одной операции Database (и два одновременных `GET /oyinlar` не превысят лимит и не отправят об одной игре дважды); отправляй, только если запись добавлена. Если Telegram не принял сообщение (например, игрок остановил бота) — удали эту запись, номер чата не трогай, переходи к следующему. Ответ `GET /oyinlar` пусть возвращается после отправки сообщений. Не отправляй в один чат больше одного сообщения в секунду.' },
  { uz: "Nima buzilmasin: keyingi o'yinni yaratish tartibi (4-dars) va 1-amaliyotdagi ulanish avvalgidek; Telegram'ni ulamagan o'yinchiga hech narsa yuborilmasin; xabarda to'lov taklifi bo'lmasin; `TELEGRAM_BOT_TOKEN` qiymati logga yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: порядок создания следующей игры (4-й урок) и подключение из практики 1 — как раньше; не подключившему Telegram игроку ничего не отправлять; в сообщении нет предложения оплаты; значение `TELEGRAM_BOT_TOKEN` в лог не пишется. Больше ничего не трогай, назови изменённые файлы.' }
];
const A2_WEB = { uz: "Web-trekda: havola — saytingiz manzili `?kanal=telegram` bilan; qolgani o'sha (Backend ikkala trekda bir).", ru: 'В веб-треке: ссылка — адрес вашего сайта с `?kanal=telegram`; остальное то же (Backend в обоих треках один).' };
const A2_KOD_PROMPT = { uz: "Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: xabar kimga ketishi tanlanadigan qator, haftalik chegara tekshiriladigan qator va xabar matni yasaladigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в написанном коде три места с именем файла и номером строки: строку выбора, кому уходит сообщение, строку проверки недельного лимита и строку, где собирается текст сообщения. Объясни одной фразой, что делает каждая. Код не меняй.' };
const A2_TAYYORLA = { uz: "Tekshiruv uchun {qaysi o'zgarishda} uch marta ro'y beradigan holat tayyorla: yangi tekshiruv akkauntlari — namuna ism va login bilan, haqiqiy emas, `namuna = true`; menga (hisob {hisob raqamim}) tegishli bo'lsin. Hali hech narsa yuborma. Qaysi yozuvlar va qaysi `id` lar ekanini va o'zgarishni men qanday ishga tushirishimni ayt.", ru: "Подготовь для проверки ситуацию, где {qaysi o'zgarishda} происходит трижды: новые проверочные аккаунты — с образцовыми именем и логином, не настоящие, `namuna = true`; пусть это касается меня (аккаунт {мой номер аккаунта}). Пока ничего не отправляй. Скажи, какие это записи и какие `id`, и как мне запустить изменение." };
const A2_OCHIR = { uz: "Hozir yaratgan tekshiruv yozuvlarini — aytgan `id` laring bo'yicha — o'chirish ro'yxatini ko'rsat: tekshiruv akkauntlari, o'yinlar va ulardan yaratilgan yangi o'yinlar, qo'shilish yozuvlari va `telegram_xabarlar` dagi qatorlar. Men «Davom et» desam — o'chir.", ru: 'Покажи список на удаление только что созданных проверочных записей — по названным тобой `id`: проверочные аккаунты, игры и созданные из них новые игры, записи присоединения и строки в `telegram_xabarlar`. Когда я скажу «Davom et» — удали.' };
const A2_USTOZ = [
  { uz: "«Telegram xabari» haftalik sanog'ini Backend yuritadi; ilova eslatmalari telefonda, o'z chegarasi bilan (12-Modul) — ikkisi bitta sanoqqa qo'shilmaydi. Xabar matnida «Pro oling» kabi taklif bo'lmaydi: bu dars — o'yinchini o'yinga qaytarish, pul emas.", ru: 'Недельный счёт «сообщений Telegram» ведёт Backend; напоминания приложения — на телефоне, со своим лимитом (12-й модуль) — в один счёт они не складываются. В тексте сообщения нет предложений вроде «Возьмите Pro»: этот урок — вернуть игрока к игре, а не деньги.' }
];
const A2Natija = ({ web }) => (
  <div className="wb-an">
    <div className="wb-an-tel">
      <Telefon t={{ ekran: 'telegram', yorliq: web ? { uz: 'Telegram · sayt havolasi', ru: 'Telegram · ссылка на сайт' } : { uz: 'Telegram · …_bot', ru: 'Telegram · …_bot' }, puf: TEKSHIRUV_OYINLARI.filter(o => o.ketdi).map((o, i) => ({ id: o.soat, tur: 'xabar', yangi: true, t: TG_XABAR.matn(o.soat), havola: TG_SAHNA.havola, kech: i })) }} />
    </div>
    <div className="wb-an-ost">
      <p className="wb-an-kul err">{tr({ uz: "17:00 o'yini haqida xabar yuborilmadi — haftalik chegara", ru: 'О игре в 17:00 сообщение не отправлено — недельный лимит' })}</p>
      <p className="wb-an-kul">{tr({ uz: "tekshiruv o'yinlari; keyin o'chiriladi", ru: 'проверочные игры; потом удаляются' })}</p>
    </div>
  </div>
);
const ScreenA2 = (props) => {
  const tk = useTrek();
  const [q, setQ] = useState({});
  const yoz = (k, v) => setQ(o => ({ ...o, [k]: v }));
  const oz = String(q.ozgarish || '').trim();
  const tayyorla = oz ? { uz: A2_TAYYORLA.uz.split("{qaysi o'zgarishda}").join(oz), ru: A2_TAYYORLA.ru.split("{qaysi o'zgarishda}").join(oz) } : A2_TAYYORLA;
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z repo'ngiz", ru: 'Практика 2 · ваш репозиторий' }}
      title={{ uz: <>Haqiqiy o'zgarishda <span className="italic" style={{ color: T.accent }}>Telegram xabari</span> ketsin.</>, ru: <>Пусть при настоящем изменении уходит <span className="italic" style={{ color: T.accent }}>сообщение в Telegram</span>.</> }}
      mentor={{ uz: "Qaysi o'zgarish haqida kimga yozishni o'zingiz tanlaysiz, namuna «Yordam» ortida; «1 · Ochish»dan boshlang.", ru: 'О каком изменении и кому писать, выбираете сами, образец — за «Подсказкой»; начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tr({ uz: "o'z repo'ngiz, 1-amaliyotdan keyingi kod; botingiz ulangan. Savollarga javob toping: qaysi o'zgarishni bilmasa, foydalanuvchingiz ilovani qayta ochmay qo'yishi mumkin — va buni Backend biladimi? Bu o'zgarish kimga tegishli? U foydalanuvchidan biror harakat kutadimi (masalan, qo'shilish)? Harakat kutmasa — Telegram xabari shart emas.", ru: 'ваш репозиторий, код после практики 1; бот подключён. Найдите ответы: не зная о каком изменении, ваш пользователь может перестать открывать приложение — и знает ли об этом Backend? Кого касается это изменение? Ждёт ли оно от пользователя действия (например, присоединиться)? Если не ждёт — сообщение в Telegram не нужно.' })}
          <Kulrang>{tr({ uz: "(Mentor misolida: o'yinchi qatnashgan «Doimiy o'yin» keyingi haftaga yana e'lon qilinganda — o'sha o'yinda qatnashganlarga.) Foydalanuvchilaringizdan so'ramagan bo'lsangiz — bu sizning taxminingiz, shunday deb biling.", ru: "(В примере Ментора: когда «Doimiy o'yin», в которой игрок участвовал, снова объявлена на следующую неделю — участникам этой игры.) Если вы не спрашивали своих пользователей — это ваше предположение, так и считайте." })}</Kulrang>
          <Band>{tr({ uz: "Mahsulotingizda «Doimiy o'yin» yo'q — Backend biladigan va foydalanuvchiga tegishli bitta o'zgarishni tanlang; ilova o'zi oldindan biladigan narsa (vaqt, muddat) — 12-Modulda eslatma bilan qilingan, Telegram shart emas.", ru: "В вашем продукте нет «Doimiy o'yin» — выберите одно изменение, о котором знает Backend и которое касается пользователя; то, что приложение знает заранее (время, срок), сделано в 12-м модуле напоминанием, Telegram не нужен." })}</Band>
          <Band>{tx({ uz: "Xabar matni — bu kursda faqat o'zgarish: kun, soat, joy; tez o'zgaradigan son (masalan, qo'shilganlar) yozilmaydi — u havolada ko'rinadi; bosim, qo'rqitish va to'lov taklifi yo'q. Havola — mahsulotingiz manzili `?kanal=telegram` bilan: mobil trekda — ilovangizning brauzer ko'rinishi (telefonda havola brauzerda ochiladi), web-trekda — saytingiz.", ru: 'Текст сообщения в этом курсе — только изменение: день, время, место; быстро меняющееся число (например, присоединившихся) не пишется — оно видно по ссылке; без давления, запугивания и предложения оплаты. Ссылка — адрес вашего продукта с `?kanal=telegram`: в мобильном треке — браузерная версия приложения (на телефоне ссылка открывается в браузере), в веб-треке — ваш сайт.' })}</Band></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' })}
          <Band><b>{tr({ uz: "Backend biladigan haqiqiy o'zgarishda bot shu o'zgarish tegishli, botni ulagan odamga yozadi — haftasiga ko'pi bilan ikkita, bir narsa haqida bir marta.", ru: 'При настоящем изменении, о котором знает Backend, бот пишет тому, кого оно касается и кто подключил бота, — не больше двух в неделю, об одном и том же один раз.' })}</b></Band>
          <WbPrompt satrlar={A2_PROMPT} joylar={A2_JOYLAR} qiymat={q} onYoz={yoz} />
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq talab", ru: 'Полное требование из примера Ментора' }} satrlar={YORDAM_A2} ost={A2_WEB} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "`git status` → `git add <fayl>` → `git commit -m \"telegram xabari\"` → `git push`. Render'da yangi versiya tugashini kuting. Kutayotganda agentga:", ru: '`git status` → `git add <файл>` → `git commit -m "telegram xabari"` → `git push`. Дождитесь окончания новой версии на Render. Пока ждёте, агенту:' })}
          <NusxaQator yorliq={AGENTGA} matn={A2_KOD_PROMPT} /></>,
          xato: tx(XATO_YOLI) },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "o'zgarishni sun'iy chaqirasiz, natijani o'z Telegram'ingizda ko'rasiz:", ru: 'вызовете изменение искусственно, результат увидите в своём Telegram:' })}
          <Band><b>(1)</b> {tr({ uz: 'Agentga:', ru: 'Агенту:' })}</Band>
          <NusxaQator yorliq={AGENTGA} matn={tayyorla} />
          <Kulrang>{tr({ uz: "Mentor misolida: «… o'tgan haftadagi Shanba, soat 15:00, 16:00 va 17:00 dagi uchta «Doimiy o'yin» — tekshiruv tashkilotchisi nomidan, Mahalla maydoni, kerak 10; meni har biriga qo'shilgan qilib yoz …» — o'yin vaqti o'tishini bir hafta kutmaslik uchun bu holatni agent tayyorlaydi.", ru: "В примере Ментора: «… три «Doimiy o'yin» прошлой субботы в 15:00, 16:00 и 17:00 — от имени проверочного организатора, Mahalla maydoni, нужно 10; запиши меня присоединившимся к каждой …» — чтобы не ждать неделю, пока пройдёт время игры, эту ситуацию готовит агент." })}</Kulrang>
          <Band><b>(2)</b> {tx({ uz: "Agent aytgan ishni qiling — Mentor misolida ilovani ochasiz: ilova `GET /oyinlar` ni so'raydi va keyingi hafta o'yinlari shunda yaratiladi. Telegram'ingizga ", ru: 'Сделайте то, что сказал агент, — в примере Ментора открываете приложение: оно запрашивает `GET /oyinlar`, и тогда создаются игры следующей недели. В ваш Telegram должны прийти ' })}<b>{tr({ uz: 'ikkita', ru: 'два' })}</b>{tr({ uz: " Telegram xabari kelishi kerak, uchinchisi — yo'q: haftalik chegara. Matn va havolani o'qing — talabingizdagidek bo'lsin.", ru: ' сообщения Telegram, третьего — нет: недельный лимит. Прочитайте текст и ссылку — пусть будут как в вашем требовании.' })}</Band>
          <Kulrang>{tr({ uz: "Bu hafta boshqa Telegram xabari olgan bo'lsangiz — kamroq keladi: chegara hamma Telegram xabarini sanaydi.", ru: 'Если на этой неделе вы уже получали другие сообщения Telegram — придёт меньше: лимит считает все сообщения Telegram.' })}</Kulrang>
          <Band><b>(3)</b> {tr({ uz: "Xuddi shu ishni yana bir marta qiling (Mentor misolida — ilovani yana oching) — yangi xabar kelmasligi kerak: bitta narsa haqida bir marta.", ru: 'Сделайте то же самое ещё раз (в примере Ментора — снова откройте приложение) — нового сообщения быть не должно: об одном и том же один раз.' })}</Band>
          <Band><b>(4)</b> {tr({ uz: 'Agentga:', ru: 'Агенту:' })}</Band>
          <NusxaQator yorliq={AGENTGA} matn={A2_OCHIR} />
          <Band>{tr({ uz: "Ro'yxatni o'qing: faqat bugungi tekshiruv yozuvlari bo'lsa — «Davom et». Shunda haftalik chegarangiz tekshiruv xabarlari bilan to'lib qolmaydi. Telegram chatidagi xabarlar qoladi — 3-amaliyotda havolasi kerak.", ru: 'Прочитайте список: если там только сегодняшние проверочные записи — «Davom et». Тогда ваш недельный лимит не заполнится проверочными сообщениями. Сообщения в чате Telegram остаются — их ссылка нужна в практике 3.' })}</Band></> }
      ]}
      natija={<A2Natija web={tk.web} />}
      ulgur={{ uz: "Ulgurmasangiz: 4-qadamni dars oxirida bajaring — «Davom etish» 3-qadamdan keyin ochiladi; 3-amaliyotdagi sanoq tekshiruvini havolani brauzerda o'zingiz ochib qilasiz. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: шаг 4 выполните в конце урока — «Продолжить» откроется после шага 3; проверку счёта в практике 3 сделаете, открыв ссылку в браузере сами. Блок считается выполненным после «Готово» на шаге 4.' }}
      ulgurQadam={3}
      doneText={{ uz: "Telegram xabari faqat tegishli, botni ulagan odamga ketdi; uchinchisi yuborilmadi.", ru: 'Сообщение Telegram ушло только тому, кого касается и кто подключил бота; третье не отправлено.' }}
      izoh={{ uz: "Xabarni Backend yubordi: o'yinchining ilovasi yopiq bo'lsa ham, yangi o'yinni u biladi.", ru: 'Сообщение отправил Backend: даже если приложение игрока закрыто, о новой игре он знает.' }}
      ustoz={A2_USTOZ} />
  );
};

// --- 3-amaliyot: o'chirish, sanoq va siyosat (tayyor talab + 3 joy)
const A3_PROMPT = [
  { uz: "Qayerda: `backend/` — Telegram bo'limi, `POST /hodisalar` va `GET /hodisalar/sanoq`; {o'chirish tugmasi joyi}; {havolani ochadigan qism}; `lending/sanoq.html` va `lending/maxfiylik.html`.", ru: "Где: `backend/` — раздел Telegram, `POST /hodisalar` и `GET /hodisalar/sanoq`; {o'chirish tugmasi joyi}; {havolani ochadigan qism}; `lending/sanoq.html` и `lending/maxfiylik.html`." },
  { uz: "Nima qilsin: 1) «Telegram ulangan» yonida tugma «Telegram xabarlarini o'chirish» — so'rov oynasisiz, bir bosishda: Backend shu foydalanuvchining chat raqamini va kutayotgan bir martalik kodini o'chirsin, ilova yana «Telegram'da xabar olish»ni ko'rsatsin. Bu yo'l faqat hisobga kirgan foydalanuvchi uchun, faqat o'zining yozuviga.", ru: "Что сделать: 1) Рядом с «Telegram ulangan» кнопка «Telegram xabarlarini o'chirish» — без окна подтверждения, в одно нажатие: Backend удаляет номер чата этого пользователя и ожидающий одноразовый код, приложение снова показывает «Telegram'da xabar olish». Этот путь только для вошедшего пользователя и только к его записи." },
  { uz: "2) «Hisobni o'chirish»da chat raqami va Telegram xabarlari jadvalidagi yozuvlari ham o'chsin.", ru: "2) При «Hisobni o'chirish» удаляются и номер чата, и его записи в таблице сообщений Telegram." },
  { uz: "3) {havolani ochadigan qism} manzilida `kanal=telegram` bo'lsa — `hodisaYoz('telegramdan-ochdi')`, bitta ochilishga bitta yozuv — sahifa yuklanganda bir marta, qayta chizilganda emas. `POST /hodisalar` qabul qiladigan nomlarga `telegramdan-ochdi` qo'sh; `GET /hodisalar/sanoq` javobiga va sanoq sahifasiga qadamlar ostida yangi qator: «Telegram'dan ochdi» — turli qurilmalar soni.", ru: "3) Если в адресе {havolani ochadigan qism} есть `kanal=telegram` — `hodisaYoz('telegramdan-ochdi')`, одна запись на одно открытие — один раз при загрузке страницы, не при перерисовке. Добавь `telegramdan-ochdi` в имена, которые принимает `POST /hodisalar`; в ответ `GET /hodisalar/sanoq` и на страницу счёта под шагами новая строка: «Telegram'dan ochdi» — число разных устройств." },
  { uz: "4) `lending/maxfiylik.html` dagi «Qaysi ma'lumot?», «Nima uchun?» va «Qancha saqlanadi?» javoblariga qo'sh: «{siyosat qatori}» Gapni kod bilan solishtir: kodda shu ish uchun saqlanadigan, lekin gapda yo'q ma'lumot bo'lsa — uni ayt, o'zing qo'shma.", ru: "4) Добавь в ответы «Qaysi ma'lumot?», «Nima uchun?» и «Qancha saqlanadi?» в `lending/maxfiylik.html`: «{siyosat qatori}» Сверь фразу с кодом: если в коде для этого хранятся данные, которых нет во фразе, — скажи о них, сам не добавляй." },
  { uz: "Nima buzilmasin: sanoq sahifasi faqat kalit bilan ochilsin; sanoq yozuvida ism, login va chat raqami bo'lmasin; 1–2-amaliyotdagi ulanish va xabar avvalgidek. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: страница счёта открывается только с ключом; в записи счёта нет имени, логина и номера чата; подключение и сообщение из практик 1–2 — как раньше. Больше ничего не трогай, назови изменённые файлы.' }
];
const A3_JOYLAR = [
  { id: 'tugma', joy: { uz: "{o'chirish tugmasi joyi}", ru: "{o'chirish tugmasi joyi}" }, namuna: { uz: "masalan: `mobil/` — «Hisobdan chiqish» yonidagi sozlamalar qatori", ru: 'например: `mobil/` — строка настроек рядом с «Hisobdan chiqish»' } },
  { id: 'qism', joy: { uz: '{havolani ochadigan qism}', ru: '{havolani ochadigan qism}' }, namuna: { uz: "masalan: `mobil/` — ilovaning brauzer ko'rinishi", ru: 'например: `mobil/` — браузерная версия приложения' } },
  { id: 'siyosat', joy: { uz: '{siyosat qatori}', ru: '{siyosat qatori}' }, namuna: { uz: "masalan: Telegram'da xabar olishni yoqsangiz — Telegram chat raqamingiz …", ru: "например: Telegram'da xabar olishni yoqsangiz — Telegram chat raqamingiz …" } }
];
const YORDAM_A3 = [
  { uz: "Qayerda: `backend/` — Telegram bo'limi, `POST /hodisalar` va `GET /hodisalar/sanoq`; `mobil/` — «Hisobdan chiqish» yonidagi sozlamalar qatori va ilovaning brauzer ko'rinishi; `lending/sanoq.html` va `lending/maxfiylik.html`.", ru: 'Где: `backend/` — раздел Telegram, `POST /hodisalar` и `GET /hodisalar/sanoq`; `mobil/` — строка настроек рядом с «Hisobdan chiqish» и браузерная версия приложения; `lending/sanoq.html` и `lending/maxfiylik.html`.' },
  { uz: "Nima qilsin: 1) «Telegram ulangan» yonida tugma «Telegram xabarlarini o'chirish» — so'rov oynasisiz, bir bosishda: Backend shu o'yinchining `telegram_chat_id`, `telegram_kod` va `telegram_kod_gacha` ni bo'shatsin, ilova yana «Telegram'da xabar olish»ni ko'rsatsin. Bu yo'l faqat hisobga kirgan o'yinchi uchun, faqat o'zining yozuviga.", ru: "Что сделать: 1) Рядом с «Telegram ulangan» кнопка «Telegram xabarlarini o'chirish» — без окна подтверждения, в одно нажатие: Backend очищает у этого игрока `telegram_chat_id`, `telegram_kod` и `telegram_kod_gacha`, приложение снова показывает «Telegram'da xabar olish». Этот путь только для вошедшего игрока и только к его записи." },
  { uz: "2) «Hisobni o'chirish»da `telegram_chat_id` va `telegram_xabarlar` dagi yozuvlari ham o'chsin.", ru: "2) При «Hisobni o'chirish» удаляются и `telegram_chat_id`, и его записи в `telegram_xabarlar`." },
  { uz: "3) Ilovaning brauzer ko'rinishi manzilida `kanal=telegram` bo'lsa — `hodisaYoz('telegramdan-ochdi')`, bitta ochilishga bitta yozuv — sahifa yuklanganda bir marta, qayta chizilganda emas (`ochdi` avvalgidek yoziladi). `POST /hodisalar` qabul qiladigan nomlarga `telegramdan-ochdi` qo'sh; `GET /hodisalar/sanoq` javobiga va sanoq sahifasiga qadamlar ostida yangi qator: «Telegram'dan ochdi» — turli qurilmalar soni.", ru: "3) Если в адресе браузерной версии приложения есть `kanal=telegram` — `hodisaYoz('telegramdan-ochdi')`, одна запись на одно открытие — один раз при загрузке страницы, не при перерисовке (`ochdi` пишется как раньше). Добавь `telegramdan-ochdi` в имена, которые принимает `POST /hodisalar`; в ответ `GET /hodisalar/sanoq` и на страницу счёта под шагами новая строка: «Telegram'dan ochdi» — число разных устройств." },
  { uz: "4) `lending/maxfiylik.html` dagi «Qaysi ma'lumot?», «Nima uchun?» va «Qancha saqlanadi?» javoblariga qo'sh: «" + SIYOSAT_QATORI.uz + "» Gapni kod bilan solishtir: kodda shu ish uchun saqlanadigan, lekin gapda yo'q ma'lumot bo'lsa — uni ayt, o'zing qo'shma.", ru: "4) Добавь в ответы «Qaysi ma'lumot?», «Nima uchun?» и «Qancha saqlanadi?» в `lending/maxfiylik.html`: «" + SIYOSAT_QATORI.uz + "» Сверь фразу с кодом: если в коде для этого хранятся данные, которых нет во фразе, — скажи о них, сам не добавляй." },
  A3_PROMPT[5]
];
const A3_WEB = { uz: "Web-trekda: «Qayerda» qatorida `mobil/` o'rnida saytingiz (`prototip/`) — tugma va `kanal=telegram` o'qish o'sha yerda; qolgani o'sha.", ru: 'В веб-треке: в строке «Где» вместо `mobil/` — ваш сайт (`prototip/`): кнопка и чтение `kanal=telegram` там; остальное то же.' };
const A3_KOD_PROMPT = { uz: "Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: o'chirish tugmasi chat raqamini o'chiradigan qator va `kanal=telegram` o'qiladigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в написанном коде два места с именем файла и номером строки: строку, где кнопка отключения удаляет номер чата, и строку, где читается `kanal=telegram`. Объясни одной фразой, что делает каждая. Код не меняй.' };
const A3_HODISA_OCHIR = { uz: "`hodisalar` jadvalidan faqat shu `id` li tekshiruv yozuvlarini o'chir: {id lar}.", ru: 'Удали из таблицы `hodisalar` только проверочные записи с этими `id`: {id lar}.' };
const A3_USTOZ = [
  { uz: "Telefonda Telegram xabaridagi havola brauzerda ochiladi — o'rnatilgan APK'ni havoladan ochish uchun alohida sozlash kerak (Android App Links: ilova sozlamasi va saytdagi tasdiq fayli — Expo hujjati), bu darsda yo'q.", ru: 'На телефоне ссылка из сообщения Telegram открывается в браузере — чтобы ссылка открывала установленный APK, нужна отдельная настройка (Android App Links: настройка приложения и файл подтверждения на сайте — документация Expo), на этом уроке её нет.' },
  { uz: "Shuning uchun Mentor misolida havola brauzer ko'rinishiga olib boradi; u yerda hisobga kirmagan odam o'yinlarni mehmon sifatida ko'radi (12-Modul 8-darsi). Ilovani o'chirib yuborgan odam ham havola orqali o'yinni ko'ra oladi.", ru: 'Поэтому в примере Ментора ссылка ведёт в браузерную версию; там человек без входа видит игры как гость (12-й модуль, 8-й урок). Даже удаливший приложение может посмотреть игру по ссылке.' }
];
const A3Natija = ({ web }) => {
  const kadr = useKadr(3, 1500);
  const tg = kadr === 0 ? 'ulangan' : 'olish';
  return (
    <div className="wb-an">
      <div className="wb-an-yon">
        <div className="wb-an-tel">
          {web ? <Brauzer manzil="….netlify.app"><SaytSozlama tg={tg} /></Brauzer>
            : <Telefon t={{ ekran: 'ilova', tg, yorliq: telYorliq(false) }} />}
        </div>
        <Brauzer manzil="…/sanoq.html" sinf="sanoq">
          <span className="wb-sq kul">{tr({ uz: 'qadamlar', ru: 'шаги' })}</span>
          <span className="wb-sq kul">{tr({ uz: 'eslatmadan ochdi', ru: 'открыли из напоминания' })}</span>
          {kadr >= 2 && <span className="wb-sq ok yangi">{tr({ uz: "Telegram'dan ochdi · 1 qurilma", ru: 'Открыли из Telegram · 1 устройство' })}</span>}
          <em className="wb-sq-y">{tr({ uz: "Mentorning o'z telefoni — tekshiruv; keyin o'chiriladi", ru: 'Собственный телефон Ментора — проверка; потом удаляется' })}</em>
        </Brauzer>
      </div>
      <p className="wb-siyosat"><code>maxfiylik.html</code> {tr({ uz: "Telegram'da xabar olishni yoqsangiz — Telegram chat raqamingiz va qaysi o'yin haqida xabar yuborilgani saqlanadi…", ru: 'Если вы включите сообщения в Telegram — сохраняются номер вашего чата в Telegram и о какой игре отправлено сообщение…' })}</p>
    </div>
  );
};
const ScreenA3 = (props) => {
  const tk = useTrek();
  const [q, setQ] = useState({});
  const yoz = (k, v) => setQ(o => ({ ...o, [k]: v }));
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 3 · o'lchov va nazorat", ru: 'Практика 3 · измерение и контроль' }}
      title={{ uz: <>Xabar bir bosishda o'chsin, <span className="italic" style={{ color: T.accent }}>ochilishlar sanalsin</span>.</>, ru: <>Пусть сообщения отключаются в одно нажатие, <span className="italic" style={{ color: T.accent }}>открытия считаются</span>.</> }}
      mentor={{ uz: "Foydalanuvchi Telegram xabaridan bir bosishda chiqa olishi kerak; «1 · Ochish»dan boshlang.", ru: 'Пользователь должен отключить сообщения Telegram в одно нажатие; начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tr({ uz: "sanoq sahifangizni oching (12-Modul 8-darsi, kalit bilan): qadamlar va «eslatmadan ochdi» qatorlari turibdi. Bugun ularning ostiga yangi qator qo'shiladi — Telegram xabaridagi havola bilan ochilgan qurilmalar soni.", ru: 'откройте свою страницу счёта (12-й модуль, 8-й урок, с ключом): там строки шагов и «eslatmadan ochdi». Сегодня под ними добавится новая строка — число устройств, открывших по ссылке из сообщения Telegram.' })}
          <Kulrang>{tr({ uz: "Bu son havola bosilganini aytadi; xabar odamni qaytardimi — buni aytmaydi.", ru: 'Это число говорит, что ссылку нажали; вернуло ли сообщение человека — не говорит.' })}</Kulrang>
          <Band>{tr({ uz: "Ikki savolga javob toping: o'chirish tugmasi qayerda turadi? (Mentor misolida — «Telegram ulangan» yonida «Telegram xabarlarini o'chirish»; so'rov oynasisiz, bir bosishda.) Maxfiylik siyosatingizdagi to'rt savoldan qaysi biriga qator qo'shasiz? (10-Modul: qaysi ma'lumot · nima uchun · kim ko'radi · qancha saqlanadi.)", ru: "Найдите ответы на два вопроса: где стоит кнопка отключения? (В примере Ментора — рядом с «Telegram ulangan» кнопка «Telegram xabarlarini o'chirish»; без окна подтверждения, в одно нажатие.) К какому из четырёх вопросов вашей политики конфиденциальности добавите строку? (10-й модуль: какие данные · зачем · кто видит · сколько хранятся.)" })}</Band>
          <Kulrang>{tr({ uz: 'Web-trekda: havola saytingizni ochadi, sanoq yozuvi o\'sha nom bilan.', ru: 'В веб-треке: ссылка открывает ваш сайт, запись счёта с тем же именем.' })}</Kulrang></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' })}
          <Band><b>{tr({ uz: "Foydalanuvchi Telegram xabarlarini bir bosishda o'chiradi; xabardagi havola bilan ochilganlar sanaladi; maxfiylik siyosatida chat raqami haqida qator bor.", ru: 'Пользователь отключает сообщения Telegram в одно нажатие; открывшие по ссылке из сообщения считаются; в политике конфиденциальности есть строка о номере чата.' })}</b></Band>
          <WbPrompt satrlar={A3_PROMPT} joylar={A3_JOYLAR} qiymat={q} onYoz={yoz} />
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq talab", ru: 'Полное требование из примера Ментора' }} satrlar={YORDAM_A3} ost={A3_WEB} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "`git status` → `git add <fayl>` → `git commit -m \"telegram o'chirish va sanoq\"` → `git push`. Backend o'zgardi — Render'da yangi versiya tugashini kuting; lending sahifalari push'dan keyin odatda o'zi yangilanadi.", ru: '`git status` → `git add <файл>` → `git commit -m "telegram o\'chirish va sanoq"` → `git push`. Backend изменился — дождитесь новой версии на Render; страницы лендинга после push обычно обновляются сами.' })}
          <Band>{tx({ uz: "Mobil trekda brauzer ko'rinishini yangilang (12-Modul buyruqlari): `npx expo export -p web` → `netlify deploy --prod --dir dist`. Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.", ru: 'В мобильном треке обновите браузерную версию (команды 12-го модуля): `npx expo export -p web` → `netlify deploy --prod --dir dist`. В веб-треке после push Netlify обычно сам обновляет сайт.' })}</Band>
          <Band>{tr({ uz: 'Kutayotganda agentga:', ru: 'Пока ждёте, агенту:' })}</Band>
          <NusxaQator yorliq={AGENTGA} matn={A3_KOD_PROMPT} /></>,
          xato: tx(XATO_YOLI) },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "talabingizning har qatorini ko'ring:", ru: 'проверьте каждую строку своего требования:' })}
          <Band><b>(1)</b> {tx({ uz: "Ilovangizda «Telegram xabarlarini o'chirish» → tugma o'rnida yana «Telegram'da xabar olish». Neon SQL Editor'da → `ulangan` — `false`. Chat raqami yo'q — Backend'da xabar yuboradigan joy qolmadi.", ru: "В приложении «Telegram xabarlarini o'chirish» → вместо кнопки снова «Telegram'da xabar olish». В Neon SQL Editor → `ulangan` — `false`. Номера чата нет — Backend больше некуда отправлять сообщение." })}</Band>
          <NusxaQator sql matn={NEON.ulangan} />
          <Band><b>(2)</b> {tx({ uz: "Telegram'da 2-amaliyotdagi xabarning havolasini bosing (xabar bo'lmasa — brauzerda `{mahsulot manzili}?kanal=telegram` ni o'zingiz oching). Telefonda brauzer ko'rinishi ochiladi (web-trekda — saytingiz). Sanoq sahifangizda «Telegram'dan ochdi» qatorida 1 qurilma chiqishi kerak. Bitta ochilish ikki yozuv beradi: `ochdi` (har ochilishda) va `telegramdan-ochdi` (havola orqali) — bu xato emas.", ru: 'В Telegram нажмите ссылку из сообщения практики 2 (если сообщения нет — сами откройте в браузере `{mahsulot manzili}?kanal=telegram`). На телефоне откроется браузерная версия (в веб-треке — ваш сайт). На странице счёта в строке «Telegram\'dan ochdi» должно быть 1 устройство. Одно открытие даёт две записи: `ochdi` (при каждом открытии) и `telegramdan-ochdi` (по ссылке) — это не ошибка.' })}</Band>
          <Band><b>(3)</b> {tr({ uz: "Tekshiruv yozuvini haqiqiy sanoqdan chiqaring. Neon SQL Editor'da → «Run» — faqat bugun o'zingiz bosgan vaqtdagi qatorlar bo'lishi kerak; boshqa qator bo'lsa — unga tegmang.", ru: 'Уберите проверочную запись из настоящего счёта. В Neon SQL Editor → «Run» — должны быть только строки со временем, когда вы сегодня нажимали сами; если есть другие строки — не трогайте их.' })}</Band>
          <NusxaQator sql matn={NEON.sanoq} />
          <Band>{tr({ uz: 'Agentga:', ru: 'Агенту:' })}</Band>
          <NusxaQator yorliq={AGENTGA} matn={A3_HODISA_OCHIR} />
          <Kulrang>{tr({ uz: 'Sanoq sahifasida qator 0 ga qaytadi.', ru: 'На странице счёта строка вернётся к 0.' })}</Kulrang>
          <Band><b>(4)</b> {tx({ uz: "Telefoningizda `lending/maxfiylik.html` ni oching — yangi qatoringiz turibdi. Telegram xabarini o'zingiz olmoqchi bo'lsangiz — «Telegram'da xabar olish» bilan qayta ulang; bu majburiy emas.", ru: "Откройте на телефоне `lending/maxfiylik.html` — там ваша новая строка. Если хотите сами получать сообщения Telegram — подключитесь снова через «Telegram'da xabar olish»; это не обязательно." })}</Band></> }
      ]}
      natija={<A3Natija web={tk.web} />}
      ulgur={{ uz: "Ulgurmasangiz: o'chirish va sanoq qatori birinchi; siyosat qatorini dars oxirida bajaring. Tekshiruv yozuvlarini o'chirishni o'tkazib yubormang.", ru: 'Если не успеваете: сначала отключение и строка счёта; строку политики сделайте в конце урока. Не пропускайте удаление проверочных записей.' }}
      doneText={{ uz: "O'chirish bir bosishda ishlaydi; Telegram xabaridan ochilganlar sanaladi.", ru: 'Отключение работает в одно нажатие; открывшие из сообщения Telegram считаются.' }}
      izoh={tk.web ? null : { uz: "APK o'zi yangilanmaydi: o'rnatilgan faylda Telegram tugmasi yo'q — bugun Expo Go va brauzerda tekshirasiz.", ru: 'APK сам не обновляется: в установленном файле кнопки Telegram нет — сегодня проверяете в Expo Go и в браузере.' }}
      ustoz={A3_USTOZ} />
  );
};

// 🃏 KARTOCHKALAR (12) — alohida ekran, Mentorsiz (SABOQ 12, 16); qolipda: QKartochka (DE-204)
const KARTALAR = [
  { front: { uz: "Mentor misolida yana ochmagan besh o'yinchi nima dedi?", ru: 'Что сказали пять игроков, не открывших снова, в примере Ментора?' }, back: { uz: "Uchtasi — yangi o'yin chiqqanini bilmadim; bittasi — ilovani o'chirdim; bittasi javob bermadi", ru: 'Трое — не знал о новой игре; один — удалил приложение; один не ответил' }, note: { uz: '5 kishi — kichik son: sabab haqida dalil, isbot emas', ru: '5 человек — маленькое число: довод о причине, не доказательство' } },
  { front: { uz: "Ilova yopiq bo'lsa, yangi o'yin haqida kim biladi?", ru: 'Если приложение закрыто, кто знает о новой игре?' }, back: { uz: 'Backend', ru: 'Backend' }, note: { uz: "Yopiq ilova yangi e'lonni bilmaydi (12-Modul); o'yin kimdir ilovani ochganda yaratiladi", ru: 'Закрытое приложение не знает о новом объявлении (12-й модуль); игра создаётся, когда кто-то открывает приложение' } },
  { front: { uz: "Bot odamga birinchi bo'lib yoza oladimi?", ru: 'Может ли бот написать человеку первым?' }, back: { uz: "Yo'q", ru: 'Нет' }, note: { uz: "Odam botni o'zi boshlashi kerak; botni ulamagan odamga Telegram xabari yetmaydi", ru: 'Человек должен сам запустить бота; не подключившему бота сообщение Telegram не дойдёт' } },
  { front: { uz: 'Bir martalik kod nima uchun kerak?', ru: 'Зачем нужен одноразовый код?' }, back: { uz: "Telegram chatini aynan shu hisob bilan bog'lash uchun", ru: 'Чтобы связать чат Telegram именно с этим аккаунтом' }, note: { uz: 'Mentor misolida — 10 daqiqa va bir marta ishlaydi', ru: 'В примере Ментора — работает 10 минут и один раз' } },
  { front: { uz: "Telegram so'rovini Backend qanday taniydi?", ru: 'Как Backend узнаёт запрос Telegram?' }, back: { uz: 'Sarlavhadagi maxfiy kalit bilan', ru: 'По секретному ключу в заголовке' }, note: { uz: 'Kalit `.env` da: `TELEGRAM_SIR`', ru: 'Ключ в `.env`: `TELEGRAM_SIR`' } },
  { front: { uz: "Ulanishda Backend Telegram'dan nimani saqlaydi?", ru: 'Что Backend сохраняет из Telegram при подключении?' }, back: { uz: 'Faqat chat raqamini', ru: 'Только номер чата' }, note: { uz: 'Ism va Telegram nomi saqlanmaydi', ru: 'Имя и имя в Telegram не сохраняются' } },
  { front: { uz: 'Telegram xabari bilan eslatmaning farqi nima?', ru: 'Чем сообщение Telegram отличается от напоминания?' }, back: { uz: "Telegram xabarini Backend bot orqali yuboradi, eslatmani ilova qo'yadi", ru: 'Сообщение Telegram отправляет Backend через бота, напоминание ставит приложение' }, note: { uz: 'Ikkalasi aralashmaydi: biri Telegram chatida, biri telefon ekranida', ru: 'Они не смешиваются: одно в чате Telegram, другое на экране телефона' } },
  { front: { uz: 'Mentor misolida Telegram xabari kimga ketadi?', ru: 'Кому уходит сообщение Telegram в примере Ментора?' }, back: { uz: "O'tgan hafta shu o'yinda qatnashgan, botni ulagan o'yinchiga", ru: 'Игроку, участвовавшему в этой игре на прошлой неделе и подключившему бота' }, note: { uz: "Haftasiga ko'pi bilan ikkita", ru: 'Не больше двух в неделю' } },
  { front: { uz: "«Telegram xabarlarini o'chirish» nima qiladi?", ru: "Что делает «Telegram xabarlarini o'chirish»?" }, back: { uz: "Chat raqamini o'chiradi — xabar to'xtaydi", ru: 'Удаляет номер чата — сообщения прекращаются' }, note: { uz: "Bir bosishda, so'rov oynasisiz", ru: 'В одно нажатие, без окна подтверждения' } },
  { front: { uz: '`telegramdan-ochdi` nimani sanaydi?', ru: 'Что считает `telegramdan-ochdi`?' }, back: { uz: 'Xabardagi havola bilan ochilgan qurilmalarni', ru: 'Устройства, открывшие по ссылке из сообщения' }, note: { uz: 'Xabar odamni qaytardimi — buni aytmaydi', ru: 'Вернуло ли сообщение человека — не говорит' } },
  { front: { uz: 'Bot tokeni qayerda turadi?', ru: 'Где хранится токен бота?' }, back: { uz: '`backend/.env` da va Render sozlamasida', ru: 'В `backend/.env` и в настройках Render' }, note: { uz: 'Agentga, chatga, skrinshotga yozilmaydi', ru: 'Агенту, в чат, на скриншот не пишется' } },
  { front: { uz: "APK o'rnatganlar Telegram tugmasini qachon ko'radi?", ru: 'Когда установившие APK увидят кнопку Telegram?' }, back: { uz: "Yangi o'rnatish faylini o'rnatgach", ru: 'После установки нового установочного файла' }, note: { uz: "APK o'zi yangilanmaydi", ru: 'APK сам не обновляется' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('wb-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="wb-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204, texnik darslar standarti; E 50 — «Bugungi asosiy fikr» yo'q). Uyga vazifa yo'q (loyiha kuni). Sarlavha — besh holat, har biri rost (E 54) =====
// PM-109 (SABOQ P4): erta tugatgan o'quvchi yo'li — AI tekshiruvchi rolida tekshiruv holatlarini beradi, o'quvchi natijani o'zi yozadi (MD yakunida matn yo'q — «MD ga taklif»)
const AI_SOROV = { uz: "Sen tekshiruvchisan. Mahsulot: Maydon Jamoa — o'yinchi ilovada «Telegram'da xabar olish»ni bosib, botda «Start» orqali Telegram'ni ulaydi; «Doimiy o'yin» yana e'lon qilinganda Backend unga Telegram xabari yuboradi (haftasiga ko'pi bilan ikkita, bitta o'yin haqida bir marta); «Telegram xabarlarini o'chirish» bir bosishda chat raqamini o'chiradi. Menga navbat bilan 4 ta tekshiruv holatini ber: eskirgan havola, botga oddiy xabar, bir haftada uchinchi xabar, o'chirishdan keyin yangi o'yin. Har holat uchun men nima kutishimni va nima bo'lishi kerakligini yozaman. Sen javobim talabga mosligini bir gap bilan ayt. Token, maxfiy kalit, chat raqami va Telegram nomini so'rama. Birinchi holatni ber.",
  ru: "Ты проверяющий. Продукт: Maydon Jamoa — игрок нажимает в приложении «Telegram'da xabar olish» и подключает Telegram через «Start» в боте; когда «Doimiy o'yin» снова объявлена, Backend отправляет ему сообщение Telegram (не больше двух в неделю, об одной игре один раз); «Telegram xabarlarini o'chirish» в одно нажатие удаляет номер чата. Дай мне по очереди 4 случая проверки: устаревшая ссылка, обычное сообщение боту, третье сообщение за неделю, новая игра после отключения. Для каждого я напишу, что ожидаю и что должно произойти. Скажи одной фразой, соответствует ли мой ответ требованию. Не спрашивай токен, секретный ключ, номер чата и имя в Telegram. Дай первый случай." };
const AiDavomCard = () => {
  const [ok, setOk] = useState(false);
  const kochir = async () => { if (await nusxala(tr(AI_SOROV))) { setOk(true); setTimeout(() => setOk(false), 1800); } };
  return (
    <div className="card wb-ai fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Erta tugatdingizmi? AI bilan davom eting', ru: 'Закончили раньше? Продолжите с AI' })}</div>
      <p className="wb-ai-m">{tr({ uz: "gemini.google.com'ni oching, pastdagi so'rovni yuboring — AI tekshiruvchi bo'lib to'rt tekshiruv holatini beradi. Har biriga javobni o'zingiz yozing; adashgan joyingizni «Orqaga» bilan amaliyot ekranlarida qayta ko'ring.", ru: 'Откройте gemini.google.com, отправьте запрос ниже — AI как проверяющий даст четыре случая проверки. Ответ на каждый пишите сами; где ошиблись — посмотрите снова на экранах практик через «Назад».' })}</p>
      <pre className="wb-ai-sorov">{tr(AI_SOROV)}</pre>
      <button type="button" className="q-chip wb-ai-btn" onClick={kochir}>{ok ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: "So'rovni nusxalash", ru: 'Скопировать запрос' })}</button>
    </div>
  );
};
const YAKUN_SARLAVHA = {
  toliq: { uz: 'Telegram xabari ishlaydi, o\'chiriladi va sanaladi.', ru: 'Сообщение Telegram работает, отключается и считается.' },
  boshqacha: { uz: 'Telegram xabari qurildi — bitta joyni tuzatish qoldi.', ru: 'Сообщение Telegram построено — осталось исправить одно место.' },
  ikki: { uz: "Telegram xabari ishlaydi — o'chirish va sanoq qoldi.", ru: 'Сообщение Telegram работает — остались отключение и счёт.' },
  bir: { uz: "Bot ulandi — Telegram xabari va o'chirish qoldi.", ru: 'Бот подключён — остались сообщение Telegram и отключение.' },
  tugamagan: { uz: 'Telegram xabari hali tugamagan — bloklarni bajaring.', ru: 'Сообщение Telegram ещё не готово — выполните блоки.' }
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
  // Blok holati: bajarildi (4-qadam «Bajardim») va tekshiruv kartasi ('ok' | 'boshqa' | null)
  const blok = (id) => { const i = SCREEN_META.findIndex(m => m.id === id); const a = answers[i]; return { ok: !!(a && a.solved), tk: (a && a.tekshiruv) || null }; };
  const a1 = blok('a1'), a2 = blok('a2'), a3 = blok('a3');
  const boshqaBor = [a1, a2, a3].some(b => b.ok && b.tk === 'boshqa');
  const kut = (b) => b.ok && b.tk === 'ok';
  const holat = kut(a1) && kut(a2) && kut(a3) ? 'toliq'
    : boshqaBor ? 'boshqacha'
      : kut(a1) && kut(a2) && !a3.ok ? 'ikki'
        : kut(a1) && !a2.ok && !a3.ok ? 'bir' : 'tugamagan';
  const RECAP = [
    { uz: "O'yinchining ilovasi yopiq bo'lsa ham, yangi o'yin yaratilganini Backend biladi — Telegram xabarini u yuboradi.", ru: 'Даже если приложение игрока закрыто, Backend знает о создании новой игры — сообщение Telegram отправляет он.' },
    { uz: "Bot odamga birinchi bo'lib yozolmaydi: odam botni o'zi boshlashi kerak.", ru: 'Бот не может написать человеку первым: человек должен сам запустить бота.' },
    { uz: "Bir martalik kod Telegram chatini aynan shu hisob bilan bog'laydi; Backend faqat chat raqamini saqlaydi.", ru: 'Одноразовый код связывает чат Telegram именно с этим аккаунтом; Backend хранит только номер чата.' },
    { uz: "Bu kursda Telegram xabari faqat odamning o'z o'yini haqida va haftasiga ko'pi bilan ikkita.", ru: 'В этом курсе сообщение Telegram — только об игре самого человека и не больше двух в неделю.' },
    { uz: "O'chirish bir bosishda; sanoq havola bilan ochilganini ko'rsatadi, xabar qaytardimi — buni emas.", ru: 'Отключение в одно нажатие; счёт показывает, что открыли по ссылке, а не то, вернуло ли сообщение.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  // ✓ yorlig'i «Uch blok bajarildi» — uchala blok bajarilganda (MD: 3-amaliyot 4-qadami; «uch blok» gapi rost bo'lishi uchun — SABOQ P14)
  const uchala = a1.ok && a2.ok && a3.ok;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className={cx('wb-yakun', !uchala && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Uch blok bajarildi', ru: 'Три блока выполнены' })}
          togri={correct} jami={total}
          sarlavha={tr(YAKUN_SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
            {!isMentorL && <AiDavomCard />}
          </>}
          recap={RECAP.map(tr)}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}>
          <p className="wb-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Kim haqiqatan to'lashga tayyor?»</b>: Mentor tekshiruvi: uchta yozma tasdiq.</>, ru: <>Следующий урок — <b>«Кто действительно готов платить?»</b>: проверка Ментора: три письменных подтверждения.</> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function WinBackDayLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — «telefon · Backend · Telegram» sahnasi (wb-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Telefon 170×272 hamma ekranda (SABOQ 22) === */
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .wb-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: wb-puls 2.2s ease-out .3s 3; }
        @keyframes wb-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        /* Variantlar va bashorat chiplari: guruh ramkasi yo'q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .wb-k { display: contents; }
        .wb-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: wb-chorla-v 1.8s ease-out .5s 2; }
        @keyframes wb-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .wb-chorla .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: wb-chorla-c 1.8s ease-out .5s 2; }
        @keyframes wb-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .wb-k.faol .q-variant:nth-child(2), .wb-chorla .q-chip:nth-child(2) { animation-delay: .75s; }
        .wb-k.faol .q-variant:nth-child(3), .wb-chorla .q-chip:nth-child(3) { animation-delay: 1s; }
        /* SABOQ P2: kirish maketi ustunga sig'adi — maket o'z kengligida, variantlar yonida (zoom ishlatilmaydi — P5) */
        @media (min-width: 761px) { .wb-k .q-split { grid-template-columns: max-content minmax(0, 1fr); gap: 28px; } }
        @keyframes wb-kir { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        @keyframes wb-qator { 0% { opacity: 0; transform: translateY(-5px); } 25% { opacity: 1; transform: none; } }
        @keyframes wb-yon { 0%, 60% { box-shadow: 0 0 0 2px ${fon(T.ok, 0.55)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; } }
        /* Sahna: telefon (2 qator) · chiziqlar · Backend (tepada) · Telegram (pastda) */
        .wb-sahna { width: 100%; max-width: 620px; margin: 0 auto; display: grid; grid-template-columns: 170px minmax(40px, 1fr) minmax(180px, 228px); grid-template-rows: auto auto; row-gap: 30px; align-items: center; justify-content: center; padding-top: 30px; min-width: 0; }
        .wb-s-tel { grid-column: 1; grid-row: 1 / span 2; display: flex; justify-content: center; }
        .wb-s-cha { grid-column: 2; grid-row: 1; min-width: 0; }
        .wb-s-chb { grid-column: 2; grid-row: 2; min-width: 0; }
        .wb-s-be { grid-column: 3; grid-row: 1; display: flex; flex-direction: column; align-items: stretch; gap: 8px; min-width: 0; }
        .wb-s-tg { grid-column: 3; grid-row: 2; position: relative; min-width: 0; }
        .wb-be-ust { position: relative; }
        .wb-ch { position: relative; height: 34px; margin: 0 2px; }
        .wb-ch-i { position: absolute; left: 0; right: 0; top: 50%; border-top: 2px solid ${T.line}; }
        .wb-chv { position: absolute; left: 50%; top: -30px; height: 30px; width: 2px; }
        .wb-chv .wb-ch-i { left: 0; right: auto; top: 0; bottom: 0; border-top: 0; border-left: 2px solid ${T.ok}; transition: border-color .4s; }
        .wb-chv.uzuq .wb-ch-i { border-left: 2px dashed ${T.line}; }
        /* Konvert: so'rov (accent) · javob (ink2) · Telegram xabari (ok); chiziq bo'ylab uchadi, reduced-motion — ko'rinmaydi */
        .wb-kv { position: absolute; z-index: 3; top: 50%; left: 0; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 2px; animation: wb-kv-o .85s ease-in-out forwards; pointer-events: none; }
        .wb-kv.bt, .wb-kv.gt { animation-name: wb-kv-ch; }
        .wb-kv.bg, .wb-kv.gb { left: 50%; top: 0; }
        .wb-kv.bg { animation-name: wb-kv-past; } .wb-kv.gb { animation-name: wb-kv-tep; }
        .wb-kv.tepa { left: 50%; top: -24px; animation-name: wb-kv-tush; }
        @keyframes wb-kv-o { from { left: 0; } to { left: 100%; } }
        @keyframes wb-kv-ch { from { left: 100%; } to { left: 0; } }
        @keyframes wb-kv-past { from { top: 0; } to { top: 100%; } }
        @keyframes wb-kv-tep { from { top: 100%; } to { top: 0; } }
        @keyframes wb-kv-tush { 0% { top: -24px; opacity: 0; } 25% { opacity: 1; } 100% { top: 16px; opacity: 1; } }
        .wb-kv-i { width: 20px; height: 14px; border-radius: 3px; background: ${T.accent}; position: relative; box-shadow: 0 4px 10px -4px rgba(${T.shadowBase},0.5); }
        .wb-kv-i::before { content: ''; position: absolute; left: 3px; right: 3px; top: 2px; height: 6px; border-left: 1.5px solid #fff; border-bottom: 1.5px solid #fff; transform: skewY(-28deg) rotate(-45deg) scale(.55); transform-origin: center; opacity: .9; }
        .wb-kv.javob .wb-kv-i { background: ${T.ink2}; } .wb-kv.xabar .wb-kv-i { background: ${T.ok}; }
        .wb-kv-y { order: -1; display: inline-flex; flex-direction: column; align-items: center; gap: 1px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 5px; white-space: nowrap; }
        .wb-kv-iz, .wb-kv-k { display: inline-flex; align-items: center; gap: 3px; font-family: 'Manrope', sans-serif; font-size: 10px; font-weight: 600; color: ${T.ink2}; }
        .wb-kv-k { color: ${T.ink}; font-weight: 700; }
        .wb-kv { width: max-content; } .wb-kv-iz, .wb-kv-k { white-space: nowrap; }
        .wb-kv.bg, .wb-kv.gb { transform: translate(-50%, calc(-100% + 7px)); }
        .wb-qulf-ic { flex: none; vertical-align: -1px; }
        /* Telefon */
        .wb-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 5px; width: 170px; flex: none; }
        .wb-tel-yorliq { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .wb-tel-ust { position: relative; }
        .wb-k-maket .wb-tel-ust-y { white-space: nowrap; }
        .wb-tel-ust-y { font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 7px; padding: 1px 8px; text-align: center; }
        .wb-telefon { width: 170px; height: 272px; border-radius: 24px; background: ${T.ink}; padding: 7px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.55); flex: none; }
        .wb-tel-ekran { width: 100%; height: 100%; border-radius: 17px; background: ${T.paper}; overflow: hidden; display: flex; flex-direction: column; animation: fade-step .35s ease; }
        p.wb-tel-iz { margin: 0; max-width: 340px; font-size: 12px; line-height: 1.4; color: ${T.ink2}; text-align: center; }
        p.wb-sanoq { margin: 0; font-size: 12px; font-weight: 700; color: ${T.ok}; background: ${T.okFon}; border-radius: 8px; padding: 3px 10px; animation: wb-yon 1.4s ease; }
        .wb-qulf { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: ${CODE.bg}; color: ${fon(T.paper, 0.75)}; }
        .wb-qulf-katta { margin-top: auto; display: inline-flex; padding: 12px; border-radius: 50%; background: ${fon(T.paper, 0.08)}; }
        .wb-qulf-katta svg { width: 26px; height: 26px; }
        .wb-qulf-ch { margin-top: auto; margin-bottom: 8px; width: 46px; height: 4px; border-radius: 4px; background: ${fon(T.paper, 0.35)}; }
        .wb-ilova { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 6px; padding: 9px 9px 8px; }
        .wb-il-bosh { font-size: 12.5px; }
        .wb-il-oyin { font-size: 10.5px; line-height: 1.35; color: ${T.ink}; padding: 5px 7px; border-radius: 8px; border: 1px solid ${T.line}; }
        .wb-il-soz { display: flex; flex-direction: column; gap: 5px; margin-top: 2px; }
        .wb-il-q { display: block; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; line-height: 1.3; text-align: left; padding: 6px 8px; border-radius: 9px; background: ${T.bg}; color: ${T.ink}; border: 0; }
        .wb-il-q.kul { color: ${T.ink2}; font-weight: 600; }
        .wb-il-q.ok { color: ${T.ok}; background: ${T.okFon}; }
        .wb-il-q.btn { background: ${T.paper}; border: 1.5px solid ${T.line}; cursor: pointer; }
        .wb-il-q.btn:disabled { cursor: default; }
        .wb-il-q.btn.yangi { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .wb-il-osti { display: block; font-size: 10px; line-height: 1.3; color: ${T.ink2}; }
        .wb-il-havola { display: block; margin-top: auto; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 6px; padding: 3px 6px; overflow-wrap: anywhere; }
        .wb-chat { flex: 1; min-height: 0; display: flex; flex-direction: column; background: ${T.bg}; }
        .wb-chat-bosh { display: flex; align-items: baseline; justify-content: space-between; gap: 6px; padding: 7px 9px; background: ${T.paper}; border-bottom: 1px solid ${T.line}; font-size: 12px; }
        .wb-chat-bosh code { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${T.ink2}; }
        .wb-chat-tana { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: flex-end; gap: 5px; padding: 6px 7px; }
        .wb-puf { display: flex; flex-direction: column; gap: 3px; max-width: 94%; font-size: 10.5px; line-height: 1.3; color: ${T.ink}; padding: 5px 7px; border-radius: 10px; position: relative; }
        .wb-puf.siz { align-self: flex-end; background: ${T.accentSoft}; font-family: 'JetBrains Mono', monospace; }
        .wb-puf.bot { align-self: flex-start; background: ${T.paper}; border: 1px solid ${T.line}; }
        .wb-puf.xabar { align-self: flex-start; background: ${T.okFon}; border: 1px solid ${fon(T.ok, 0.35)}; }
        .wb-puf.yangi { animation: wb-kir .45s ease both, wb-yon 1.4s ease .2s; }
        .wb-puf-hav { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${T.ink2}; overflow-wrap: anywhere; }
        .wb-puf-so { position: absolute; right: 6px; bottom: 4px; font-style: normal; font-size: 11px; font-weight: 800; color: ${T.ok}; }
        .wb-puf.kichik { font-size: 12px; max-width: 100%; align-self: stretch; transition: opacity .5s; }
        .wb-puf.sondi { opacity: .35; }
        .wb-chat-start { margin: 0 8px 8px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; letter-spacing: .02em; padding: 7px 0; border-radius: 9px; border: 0; background: ${TG_RANG}; color: #fff; cursor: pointer; }
        .wb-chat-start:disabled { cursor: default; }
        .wb-ment { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 6px 8px; }
        .wb-ment-q { display: flex; flex-direction: column; gap: 1px; }
        .wb-ment-n { font-size: 10px; font-weight: 700; color: ${T.ink}; line-height: 1.2; }
        .wb-ment-p { display: block; font-size: 10px; line-height: 1.22; color: ${T.ink}; padding: 2px 6px; border-radius: 7px; background: ${T.bg}; transition: background .35s, box-shadow .35s; }
        .wb-ment-p.bosh { height: 15px; width: 72%; background: ${fon(T.ink2, 0.12)}; }
        .wb-ment-p.kul { color: ${T.ink2}; font-style: italic; }
        .wb-ment-q.ajrat .wb-ment-p { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        /* 0-ekran hisoblagichi: uch gorizontal ustun (qurilma) */
        .wb-k-maket { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .wb-hisob { width: 340px; display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .wb-hisob-y { font-size: 10.5px; font-weight: 700; color: ${T.ink2}; }
        .wb-hisob-q { display: grid; grid-template-columns: 176px minmax(0, 1fr) 24px; align-items: center; gap: 6px; font-size: 11px; color: ${T.ink}; }
        .wb-hisob-q b { font-family: 'JetBrains Mono', monospace; font-size: 12px; text-align: right; }
        .wb-hisob-u { height: 8px; border-radius: 5px; background: ${T.bg}; overflow: hidden; }
        .wb-hisob-u i { display: block; height: 100%; border-radius: 5px; background: ${T.ink2}; transform-origin: left; animation: wb-ustun .7s cubic-bezier(.3,.8,.4,1) both; }
        .wb-hisob-q:last-child .wb-hisob-u i { background: ${T.accent}; }
        @keyframes wb-ustun { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        /* Backend va Telegram tugunlari */
        .wb-backend { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-radius: 12px; background: ${CODE.bg}; color: ${CODE.text}; box-shadow: 0 12px 26px -16px rgba(${T.shadowBase},0.6); }
        .wb-be-bosh { font-size: 12.5px; color: #fff; }
        .wb-be-q { font-size: 11px; line-height: 1.35; color: ${CODE.text}; padding: 2px 6px; border-radius: 6px; }
        .wb-be-q.kul { color: ${CODE.punct}; }
        .wb-be-q.ok { color: ${CODE.str}; }
        .wb-be-q.yangi { animation: wb-qator 1.2s ease both; background: ${fon(T.ok, 0.18)}; }
        .wb-be-q.kalit { display: inline-flex; align-items: center; gap: 5px; color: ${CODE.attr}; }
        .wb-be-iz { font-size: 10.5px; line-height: 1.35; color: ${CODE.punct}; border-top: 1px dashed ${fon(T.paper, 0.18)}; padding-top: 4px; }
        .wb-tgtugun { display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 7px 10px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; font-size: 13px; }
        .wb-tgtugun span { font-size: 10.5px; color: ${T.ink2}; }
        .wb-sahna-btn { align-self: center; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; padding: 7px 14px; border-radius: 10px; border: 1.5px solid ${fon(T.accent, 0.6)}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .wb-sahna-btn:disabled { opacity: .45; cursor: not-allowed; }
        /* Bashorat ixcham qatori, xulosa qutisi qatorlari (E 42), nom/joriy qatori, O'qituvchi eslatmasi */
        .wb-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .wb-bash-l { font-size: 10.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.ink2}; }
        .wb-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        .q-xulosa .wb-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .wb-x-tx b { color: ${T.ink}; } .q-xulosa .wb-x-tx.ok, .q-xulosa .wb-x-tx.ok b { color: ${T.ok}; } .q-xulosa .wb-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .wb-x-m { display: block; }
        .q-xulosa .wb-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.wb-nom { margin: 0; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        p.wb-nom.joriy { border-color: ${fon(T.accent, 0.45)}; }
        .wb-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .wb-ustoz b { color: ${T.ink}; }
        /* Reja */
        p.wb-reja-past { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink2}; }
        p.wb-reja-past2 { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        .wb-sahna.reja { padding-top: 14px; }
        .wb-reja { display: contents; }
        .wb-hisob-k { overflow-wrap: anywhere; }
        .tg-ochir { white-space: normal; }
        /* 2-ekran tugagan holati: sahna va nom/joriy qatorlari yonma-yon — natija bitta ekranga sig'adi (SABOQ P11) */
        .wb-s2-tug { display: grid; grid-template-columns: minmax(0, 600px) minmax(220px, 1fr); gap: 18px; align-items: center; }
        .wb-s2-tug .wb-sahna { padding-top: 6px; margin: 0; }
        .wb-s2-yon { display: flex; flex-direction: column; gap: 10px; }
        @media (max-width: 900px) { .wb-s2-tug { grid-template-columns: 1fr; } .wb-s2-tug .wb-sahna { margin: 0 auto; } }
        /* 5-ekran: Backend kartasi, o'yinchi kartasi bittadan, tekshiruv kartasi */
        .wb-s5 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px; align-items: start; }
        .wb-s5-chap, .wb-s5-ong { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .wb-s5-be { display: flex; flex-direction: column; gap: 2px; padding: 8px 12px; border-radius: 12px; background: ${CODE.bg}; color: ${CODE.text}; font-size: 12.5px; line-height: 1.4; }
        .wb-s5-be b { color: #fff; font-size: 12px; }
        .wb-s5-ix { display: flex; flex-direction: column; gap: 4px; }
        .wb-ix { display: flex; justify-content: space-between; gap: 8px; padding: 5px 10px; border-radius: 9px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; animation: wb-kir .4s ease both; }
        .wb-ix b { font-weight: 700; } .wb-ix.ok b { color: ${T.ok}; } .wb-ix.err b { color: ${T.err}; } .wb-ix.kul b { color: ${T.ink2}; }
        .wb-oy-ust { display: flex; }
        .wb-oy { flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.45); transition: border-color .35s, opacity .45s, background .35s; }
        .wb-oy.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .wb-oy.err { border-color: ${fon(T.err, 0.7)}; opacity: .72; }
        .wb-oy.kul { border-color: ${T.line}; background: ${T.bg}; opacity: .72; }
        .wb-oy.kul .wb-oy-q.yangi b { color: ${T.ink2}; }
        .wb-oy .tg-ochir { margin-top: 4px; }
        .wb-oy-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .wb-oy-q { font-size: 12.5px; line-height: 1.4; color: ${T.ink2}; }
        .wb-oy-q b { color: ${T.ink}; }
        .wb-oy-q.yangi b { color: ${T.err}; animation: wb-kir .4s ease both; }
        .wb-tk-k { display: flex; flex-direction: column; gap: 7px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .wb-tk-k-s { font-size: 14px; color: ${T.ink}; }
        .wb-tk-k-y { margin-top: -5px; font-size: 11px; color: ${T.ink2}; }
        .wb-tk-q { display: flex; align-items: center; gap: 9px; font-size: 13px; line-height: 1.35; color: ${T.ink}; }
        .wb-katak { flex: none; width: 24px; height: 24px; border-radius: 7px; border: 1.5px solid ${T.line}; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; background: ${T.bg}; }
        .wb-katak.ok { border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; animation: wb-tush .35s cubic-bezier(.3,1.4,.5,1) both; }
        .wb-katak.err { border-color: ${T.err}; background: ${T.errFon}; color: ${T.err}; animation: wb-tush .35s cubic-bezier(.3,1.4,.5,1) both; }
        @keyframes wb-tush { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        p.wb-s5-xato { margin: 0; }
        p.wb-s5-ok { margin: 0; font-size: 13px; font-weight: 800; color: ${T.ok}; }
        .wb-s5.tugadi { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
        /* Amaliyot bloklari — qadam matni QBlok'da <p> ichida: faqat span (display: block bilan) */
        .wb-blok { display: contents; }
        .wb-blok.qulf .q-blok-q.joriy .q-blok-tana > .q-btn { opacity: .45; pointer-events: none; }
        .wb-band, .wb-kulrang, .wb-xato, .wb-ps, .wb-yordam, .wb-yordam-s, .wb-tk, .wb-tk-s { display: block; }
        .wb-band { margin-top: 6px; }
        .wb-kulrang { margin-top: 6px; font-size: 12.5px; color: ${T.ink2}; }
        .wb-xato { margin-top: 6px; font-size: 13px; font-weight: 700; color: ${T.err}; }
        .wb-yordam .qcode, .wb-ps .qcode, .wb-nq .qcode { white-space: normal; overflow-wrap: anywhere; }
        .wb-prompt { display: block; margin-top: 8px; }
        .wb-ps { margin: 0; padding: 0 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink}; overflow-wrap: anywhere; }
        .wb-ps + .wb-ps { margin-top: 4px; }
        .wb-ps .q-joy { display: inline; }
        .wb-joylar { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .wb-joy-m { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; padding: 0 0 0 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .wb-joy-m:focus-within { border-color: ${T.accent}; }
        .wb-joy-n { flex: none; max-width: 100%; padding-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.accent}; }
        .wb-joy-m input { flex: 1 1 220px; min-width: 0; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.4; padding: 8px 10px 8px 0; color: ${T.ink}; }
        .wb-yordam-ust { display: block; margin-top: 8px; }
        .wb-yordam-btn { margin: 0; }
        .wb-yordam { margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; }
        .wb-yordam b { display: block; margin-bottom: 4px; font-size: 12px; color: ${T.ink2}; }
        .wb-yordam-s + .wb-yordam-s { margin-top: 4px; }
        .wb-nq { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin-top: 6px; padding: 6px 8px; border-radius: 9px; }
        .wb-nq.sql { background: ${CODE.bg}; }
        .wb-nq.agent { background: ${T.paper}; border: 1px solid ${T.line}; }
        .wb-nq em { width: 100%; font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .wb-nq-m { flex: 1 1 200px; min-width: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink}; overflow-wrap: anywhere; }
        .wb-nq.sql code { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.45; color: ${CODE.attr}; overflow-wrap: anywhere; }
        .wb-nusxa { font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 700; border: 0; border-radius: 7px; padding: 4px 9px; cursor: pointer; }
        .wb-nq.sql .wb-nusxa { background: ${fon(T.paper, 0.16)}; color: #fff; }
        .wb-nq.agent .wb-nusxa { background: ${T.accentSoft}; color: ${T.accent}; }
        .wb-trek-q { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
        .wb-trek { font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 700; padding: 5px 12px; border-radius: 999px; border: 1.5px solid ${fon(T.accent, 0.6)}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .wb-trek.on { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .wb-tk { margin-top: 10px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .wb-tk-s { font-size: 12.5px; font-weight: 700; color: ${T.ink}; margin-bottom: 6px; }
        .wb-tk-btnlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .wb-tk-btn { font-size: 13px; padding: 6px 14px; }
        .wb-tk-btn.err { border-color: ${T.err}; background: ${T.errFon}; color: ${T.err}; }
        p.wb-ortda, p.wb-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        @media (max-width: 640px) { p.wb-ortda .qcode { white-space: normal; overflow-wrap: anywhere; } }
        p.wb-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.bg}; }
        p.wb-boshqa { margin: 0; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; font-size: 13.5px; line-height: 1.45; color: ${T.ink2}; }
        /* Kutilgan natija maketlari */
        .wb-an { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .wb-an-tel { display: flex; justify-content: center; }
        .wb-an-ost { align-self: stretch; display: flex; flex-direction: column; gap: 8px; }
        .wb-neon { display: flex; flex-direction: column; gap: 3px; padding: 6px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .wb-neon-y { font-size: 10.5px; font-weight: 700; color: ${T.ink2}; }
        .wb-neon-q { display: flex; gap: 14px; }
        .wb-neon-q code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; }
        .wb-neon-q b { color: ${T.ok}; }
        .wb-term { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${CODE.bg}; }
        .wb-term span { font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.45; color: ${CODE.text}; overflow-wrap: anywhere; }
        .wb-term .buyruq { color: ${CODE.attr}; }
        p.wb-an-kul { margin: 0; font-size: 12.5px; line-height: 1.4; color: ${T.ink2}; text-align: center; }
        p.wb-an-kul.err { color: ${T.err}; font-weight: 700; }
        .wb-an-yon { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; align-items: flex-start; }
        .wb-brauzer { width: 226px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.paper}; overflow: hidden; box-shadow: 0 10px 22px -16px rgba(${T.shadowBase},0.5); }
        .wb-brz-bar { display: flex; align-items: center; gap: 4px; padding: 5px 8px; background: ${T.bg}; }
        .wb-brz-bar i { width: 6px; height: 6px; border-radius: 50%; background: ${T.line}; }
        .wb-brz-bar code { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; }
        .wb-brz-tana { display: flex; flex-direction: column; gap: 5px; padding: 8px 10px; }
        .wb-sayt { display: flex; flex-direction: column; gap: 5px; font-size: 12px; }
        .wb-sq { display: block; font-size: 11.5px; padding: 4px 8px; border-radius: 7px; background: ${T.bg}; }
        .wb-sq.kul { color: ${T.ink2}; }
        .wb-sq.ok { color: ${T.ok}; background: ${T.okFon}; font-weight: 700; }
        .wb-sq.yangi { animation: wb-kir .45s ease both, wb-yon 1.4s ease .2s; }
        .wb-sq-y { font-style: normal; font-size: 10.5px; line-height: 1.35; color: ${T.ink2}; }
        p.wb-siyosat { margin: 0; align-self: stretch; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; font-size: 12px; line-height: 1.45; color: ${T.ink2}; }
        p.wb-siyosat code { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; }
        .wb-rc-n { font-family: 'JetBrains Mono', monospace; font-size: 34px; color: ${T.accent}; }
        /* Kartochkalar, AI kartasi, yakun */
        .wb-flash { display: flex; flex-direction: column; gap: 10px; }
        .wb-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: wb-puls 1.8s ease-out .4s 3; }
        p.wb-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.wb-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        p.wb-ai-m { margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .wb-ai-sorov { margin: 0 0 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; white-space: pre-wrap; }
        .wb-ai-btn { margin: 0; }
        .wb-ai { display: flex; flex-direction: column; }
        .wb-yakun { display: contents; }
        .wb-yakun.belgisiz .done-chip { display: none; }
        .wb-yakun .q-yakun > .ach-coll { order: 1; }
        p.wb-keyingi { margin: 0; font-size: 14.5px; line-height: 1.5; color: ${T.ink2}; }
        p.wb-keyingi b { color: ${T.ink}; }
        /* ⛶ kattalashtirish — skeletda yo'q qoida (SABOQ 38); ikki klassli selektor — keyingi «.zoomable position relative» oynani siljitmasin (E 48) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 96vw); max-height: 92vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        /* 13-Modul sinf-supurish B: ⛶ oynasi faqat ko'rish uchun — maket ichidagi tugma (telefon tugmasi, jadval katagi, belgi) oynada bosilmaydi, harakat ⛶ dan tashqarida qoladi. Kirish ekrani variantlari va maket tugmasi qolipniki — tegilmaydi. */
        .zoom-on button:not(.zoom-btn) { pointer-events: none; cursor: default; }
        .q-kirish .zoom-on button { pointer-events: auto; cursor: pointer; }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 760px) { .wb-s5, .wb-s5.tugadi { grid-template-columns: 1fr; } .zoomable:not(.zoom-on) .wb-s5-be { margin-right: 46px; } }
        @media (max-width: 640px) {
          .wb-sahna { grid-template-columns: 170px minmax(14px, 1fr) minmax(132px, 150px); row-gap: 34px; }
          .wb-backend { padding: 6px 7px; }
          .wb-be-q { font-size: 10px; padding: 2px 4px; }
          .wb-be-iz { font-size: 10px; }
          .wb-kv-y { font-size: 10px; white-space: normal; max-width: 120px; text-align: center; }
          .wb-hisob { width: 100%; max-width: 300px; }
          .wb-hisob-q { grid-template-columns: 112px minmax(0, 1fr) 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wb-halqa, .wb-k.faol .q-variant, .wb-chorla .q-chip, .wb-flash.yangi .fc-card .fc-front, .wb-tel-ekran, .wb-puf.yangi, .wb-be-q.yangi, .wb-ix, .wb-katak, .wb-sq.yangi, .wb-hisob-u i, p.wb-sanoq, .wb-oy-q.yangi b { animation: none !important; }
          .wb-kv { display: none !important; }
          .wb-oy, .wb-ment-p, .wb-puf.kichik, .wb-chv .wb-ch-i { transition: none !important; }
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
