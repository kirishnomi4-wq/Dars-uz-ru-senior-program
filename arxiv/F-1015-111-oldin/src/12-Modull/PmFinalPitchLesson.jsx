import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 14-Modul (LMS) · 8-dars (PM) «Final pitchingiz 5 daqiqaga tayyormi?» — kalit m12-08, MD feedback/F-1008-14modul/08-PmFinalPitch-v3.md (manba-haqiqat).
// Skeletdan (src/skelet/NamunaDars.jsx) qurildi; infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletdagidek.
// Ekranlar: s0 QKirish · s1 QReja · s2/s3 QTushuncha · s4/s8 test (QuestionScreen → QTest) · s5/s6/s7 QMustaqil · podium · QKartochka · QYakun.
// Saqlanadi: pm-m12d8-final (tayanch 8); o'qiydi: pm-m12d1-pitch, pm-m12d5-varaq, pm-m12d6-demo (bo'lmasa ham ekran ishlaydi).
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKartochka, QYakun, QMustaqil, QChip, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m12d8-v1', lessonTitle: { uz: "Final pitchingiz 5 daqiqaga tayyormi?", ru: 'Готов ли ваш финальный питч на 5 минут?' } }; // 14-Modul 8-dars (LMS), 2-to'lqin — MD feedback/F-1008-14modul/08-PmFinalPitch-v3.md
// 12 ekran (keyssiz PM — tayanch 4): kirish → reja → 2 tushuncha → test → 3 mustaqil ish → yakuniy test → podium → kartochkalar → yakun.
const HW_TOKENS = [
  { t: { uz: 'pitch', ru: 'питч' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'taymer', ru: 'таймер' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'savol', ru: 'вопрос' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'javob', ru: 'ответ' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
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
const NavNext = ({ disabled, label, onClick, optionalLive, halqa }) => {
  const lbl = tr(label) || tr({ uz: 'Davom etish', ru: 'Продолжить' });
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className={`btn-white-accent${halqa && !disabled && !locked ? ' fp-halqa' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). -1 — sentinel (variant yo'q, ballsiz ekran).
// To'g'ri javob o'rinlari (MD): s4 C · s8 A.
// MD KOD 13 dagi ballsiz sentinel'lar (savolJavob, tuzatishTaymer) — jsx-lint «o'lik kalit» (submitAnswer ga uzatilmaydi), shuning uchun yo'q; practice — 5, 6, 7-ekran signali.
const INLINE_KEYS = { s4: 2, s8: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; PM: emoji o'rniga raqam — S-026)
const RECAPS = {
  4: {
    title: { uz: 'Tuzatish qayerga', ru: 'Куда записать исправление' },
    cards: [
      { ic: '1', h: { uz: "Varaqdagi ✗ izohi tuzatishlar ro'yxatiga, undan pitchga o'tadi.", ru: 'Комментарий с ✗ из листа переходит в список исправлений, а из него — в питч.' } },
      { ic: '2', h: { uz: "Bu mashqda tuzatish eski gap o'rniga yoziladi; keyin vaqt taymer bilan tekshiriladi.", ru: 'В этом упражнении исправление пишут вместо старой фразы; потом время проверяют таймером.' } },
      { ic: '3', h: { uz: "Mentor misolida Bozor, Raqamlar va Keyingi qadam shunday tuzatildi; reja 5 daqiqa, haqiqiy vaqt — aytilganda.", ru: 'В примере Ментора так исправлены Рынок, Цифры и Следующий шаг; план — 5 минут, настоящее время — когда рассказываешь.' }, ask: { uz: "Tuzatishlaringizdan qaysi biri bo'lakni uzaytirdi?", ru: 'Какое из ваших исправлений удлинило часть?' } }
    ]
  },
  8: {
    title: { uz: 'Bilgan faktni aytish', ru: 'Назвать известный факт' },
    cards: [
      { ic: '1', h: { uz: 'Javobda son yoki fakt va uni qayerdan bilganingiz aytiladi.', ru: 'В ответе называют число или факт и откуда вы это знаете.' } },
      { ic: '2', h: { uz: '«Tekshirib aytaman» — faqat javobni bilmaganda.', ru: '«Проверю и скажу» — только когда ответа не знаете.' } },
      { ic: '3', h: { uz: "Mentor misolida: o'yinchilar Telegram guruhida «kim keladi?» deb yozishadi — ular shunday degan.", ru: 'В примере Ментора: игроки пишут в Telegram-группе «кто придёт?» — так они сказали.' }, ask: { uz: 'Hakam «Odamlar hozir bu ishni nima bilan qiladi?» desa, nima deysiz?', ru: 'Если судья спросит «Чем люди сейчас решают эту задачу?», что скажете?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="fp-test-viz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — FinalSahna: telefon (faqat 3-ekran) · Hakam kartasi · olti bo'lak · taymer chizig'i + savol-javob bo'lagi =====
// Hakam — bitta urg'uli rol kartasi (14-Modul SABOQ P1; 1-darsdagi Investor kartasi naqshi): baholash varag'i belgisi, odam figurasi emas; uch hakam — kichik doirachalar qatori.
// Bitta manba: JAMOA_PITCH · JAMOA_VARAQ · HAKAM_SAVOL · SAVOL_BANK · MENTOR_JAVOB + o'quvchi ma'lumoti (pm-m12d1-pitch, pm-m12d5-varaq, pm-m12d6-demo, pm-m12d8-final).
// 12-Modul TaymerChiziq va 1-darsdagi OltiBolakSahna dan ko'chirilmagan — dars ichida yozildi (K-020). Rangli yon chiziq yo'q; reduced-motion — CSS da.
// qolip-maket: fp-jk fp-tab fp-tg
const cxx = (...a) => a.filter(Boolean).join(' ');
const NB = ' ';
const MJ_RANG = '#2E9E4F'; // «Maydon Jamoa» — 11-Modul 9.62 yashili (9–13-Modul darslari bilan bir), logotipsiz
const MJ = () => <span className="fp-mj">Maydon Jamoa</span>;
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;

// --- Saqlanadigan natija (tayanch 8) va o'qiladigan kalitlar ---
const PITCH_KEY = 'pm-m12d1-pitch';
const VARAQ_KEY = 'pm-m12d5-varaq';
const DEMO_KEY = 'pm-m12d6-demo';
const FINAL_KEY = 'pm-m12d8-final';
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };

const BOLAK_ID = ['muammo', 'bozor', 'yechim', 'raqamlar', 'jamoa', 'keyingi'];
const BOLAK_NOM = {
  muammo: { uz: 'Muammo', ru: 'Проблема' }, bozor: { uz: 'Bozor', ru: 'Рынок' }, yechim: { uz: 'Yechim', ru: 'Решение' },
  raqamlar: { uz: 'Raqamlar', ru: 'Цифры' }, jamoa: { uz: 'Jamoa', ru: 'Команда' }, keyingi: { uz: 'Keyingi qadam', ru: 'Следующий шаг' }
};
const VAQT = [40, 30, 90, 60, 30, 50]; // tayanch 9.1 — bu mashqda, jami 5:00
const JAMI_VAQT = 300;
const JAVOB_VAQT = 60;
const fmtV = (s) => { const v = Math.max(0, Math.round(Number(s) || 0)); return Math.floor(v / 60) + ':' + String(v % 60).padStart(2, '0'); };
const joriyBolak = (sek) => { let acc = 0; for (let i = 0; i < VAQT.length; i++) { acc += VAQT[i]; if (sek < acc) return i; } return null; };

// Mentor misoli — «Maydon Jamoa» final pitchi (tayanch 1.1 AYNAN + 5-darsdagi uch tuzatish — 9.2, 9.16; sonlar 1.14)
const JAMOA_PITCH = {
  muammo: { eski: { uz: "O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.", ru: 'Игрокам трудно собрать людей в команду. У 4 из 5 игроков, которых я спросил, в последней игре не хватило людей или кто-то не пришёл.' } },
  bozor: {
    eski: { uz: "Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.", ru: 'В футбольной группе махалли — 60 человек; в приложении — 6 организаторов. Другие махалли мы ещё не проверяли.' },
    yangi: { uz: "Mahalla futbolining Telegram guruhida — 60 a'zo; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.", ru: 'В Telegram-группе футбола махалли — 60 участников; в приложении — 6 организаторов. Другие махалли мы ещё не проверяли.' }
  },
  yechim: { eski: { uz: "Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.", ru: 'Организатор объявляет игру, игроки присоединяются одним нажатием и в день игры подтверждают, что придут.' } },
  raqamlar: {
    eski: { uz: "51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro'ga yozma tasdiq berdi — bu hali to'lov emas.", ru: '51 пользователь; 11 из них — мои одноклассники, 7 пришли по ссылке-приглашению. 3 организатора дали письменное подтверждение на Pro — это ещё не оплата.' },
    yangi: { uz: "51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro uchun to'lashga tayyorligini yozdi — real to'lov hali yo'q.", ru: '51 пользователь; 11 из них — мои одноклассники, 7 пришли по ссылке-приглашению. 3 организатора написали, что готовы платить за Pro, — реальной оплаты ещё нет.' }
  },
  jamoa: { eski: { uz: "Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.", ru: 'Я — идея, продукт и код (с агентом). Пробовали — 6 организаторов и игроки.' } },
  keyingi: {
    eski: { uz: "Uch tashkilotchi bilan \"Doimiy o'yin\"ni test rejimda sinayman. Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.", ru: 'С тремя организаторами проверю «Постоянную игру» в тестовом режиме. Одна просьба к вам: познакомьте с владельцами площадок в махалле.' },
    yangi: { uz: "Uch tashkilotchi bilan \"Doimiy o'yin\"ni test rejimda sinayman. Ilova hozir maydon egalariga xizmat qilmaydi — sizdan bitta so'rov: ular bilan tanishtiring.", ru: 'С тремя организаторами проверю «Постоянную игру» в тестовом режиме. Приложение сейчас не обслуживает владельцев площадок — одна просьба к вам: познакомьте с ними.' }
  }
};
const TUZATILGAN = ['bozor', 'raqamlar', 'keyingi'];
const mentorMatn = (id, yangi) => tr((yangi && JAMOA_PITCH[id].yangi) || JAMOA_PITCH[id].eski);
// Mentor varag'i (5-dars, tayanch 1.5 AYNAN)
const JAMOA_VARAQ = {
  xato: { bozor: { uz: "60 kishi kim — o'yinchimi, guruhmi?", ru: '60 человек — это кто: игроки или группа?' }, raqamlar: { uz: "Tasdiq — to'lovmi?", ru: 'Подтверждение — это оплата?' } },
  hakamSavoli: { uz: "Nega maydon egalari bunga pul to'lamaydi?", ru: 'Почему владельцы площадок за это не платят?' }
};
// Hakam savollari — bitta manba (tayanch 9.3; 1-dars bilan bir). Kurs savollari, real hakam gapi emas.
const HAKAM_SAVOL = {
  muammo: { uz: 'Bu muammo borligini qayerdan bilasiz?', ru: 'Откуда вы знаете, что эта проблема есть?' },
  bozor: { uz: 'Bu mahsulot yana qancha odamga kerak?', ru: 'Скольким ещё людям нужен этот продукт?' },
  yechim: { uz: 'Mahsulot nima qiladi?', ru: 'Что делает продукт?' },
  raqamlar: { uz: 'Bu son qayerdan va nimani sanaydi?', ru: 'Откуда это число и что оно считает?' },
  jamoa: { uz: 'Buni kim qilyapti?', ru: 'Кто это делает?' },
  keyingi: { uz: 'Endi nima qilasiz?', ru: 'Что будете делать дальше?' }
};
const HOZIR_SAVOL = { uz: 'Odamlar hozir bu ishni nima bilan qiladi?', ru: 'Чем люди сейчас решают эту задачу?' };
// Savol-javob mashqi banki (9.3 + tayanch 1.8) — 7 savol
const SAVOL_BANK = [...BOLAK_ID.map(id => ({ id, t: HAKAM_SAVOL[id] })), { id: 'hozir', t: HOZIR_SAVOL }];
// 2-ekran: Mentorning uch savoli va javobi (olam matni — T-008; ✔ o'rni: 1 — ikkinchi · 2 — birinchi · 3 — ikkinchi)
const MENTOR_JAVOB = [
  { savol: HAKAM_SAVOL.raqamlar, yorliq: { uz: 'Raqamlar: 51 foydalanuvchi', ru: 'Цифры: 51 пользователь' }, togriBirinchi: false,
    togri: { uz: "51 — ilovada ro'yxatdan o'tgan hisoblar, namuna akkauntlarsiz, Database'dan; 11 tasi — sinfdoshlarim.", ru: '51 — зарегистрированные в приложении аккаунты, без тестовых, из Database; 11 из них — мои одноклассники.' },
    notogri: { uz: "Juda ko'p odam ishlatyapti — o'yinchilarga ilova yoqdi, ular uni hammaga maqtab, do'stlariga aytyapti.", ru: 'Пользуются очень многие — игрокам приложение понравилось, они всем его хвалят и рассказывают друзьям.' },
    teg: { uz: 'son · manba', ru: 'число · источник' }, xato: { uz: "Hakam manbani so'radi — bu son qayerdan sanalgan?", ru: 'Судья спросил об источнике — откуда посчитано это число?' } },
  { savol: HOZIR_SAVOL, yorliq: null, togriBirinchi: true,
    togri: { uz: "Telegram guruhida «kim keladi?» deb yozishadi, javoblar xabarlar orasida yo'qoladi — o'yinchilar shunday degan.", ru: 'Пишут в Telegram-группе «кто придёт?», ответы теряются среди сообщений — так сказали игроки.' },
    notogri: { uz: "Hech narsa bilan — bunday ilova hali hech qayerda yo'q, shuning uchun o'yinchilar o'yinni yig'a olmaydi.", ru: 'Ничем — такого приложения ещё нигде нет, поэтому игроки не могут собрать игру.' },
    teg: { uz: 'fakt · kim aytgan', ru: 'факт · кто сказал' }, xato: { uz: "Ilova yo'q bo'lsa ham, o'yin hozir qanday yig'iladi?", ru: 'Даже без приложения — как игру собирают сейчас?' } },
  { savol: HAKAM_SAVOL.bozor, yorliq: { uz: "Bozor: 60 a'zo", ru: 'Рынок: 60 участников' }, togriBirinchi: false,
    togri: { uz: "Guruhda 60 a'zo bor; nechtasiga kerakligi va boshqa mahallalar hali tekshirilmagan — tekshirib aytaman.", ru: 'В группе 60 участников; скольким это нужно и другие махалли ещё не проверены — проверю и скажу.' },
    notogri: { uz: "Butun shahar futbolchilariga kerak — ular minglab, hammasi xuddi shunday qiynaladi, men bilaman.", ru: 'Нужно футболистам всего города — их тысячи, все так же мучаются, я знаю.' },
    teg: { uz: 'bor son · tekshirib aytaman', ru: 'есть число · проверю и скажу' }, xato: { uz: "Boshqa mahallalar soni qayerdan? Tekshirilganmi?", ru: 'Откуда число по другим махаллям? Это проверено?' } }
];

// --- Ekran maqsadlari (PM: quruvchi + SCREEN_INTENTS; ekranga chiqmaydi) ---
const SCREEN_INTENTS = [
  'kirish: hakam sonning manbasini so\'radi — bilmasangiz nima deysiz', 'reja: taymer 5:00 va savol-javob', 'savol-javob: son va manba · fakt · «tekshirib aytaman»',
  'tuzatish va taymer: uch tuzatish eski gap o\'rniga, reja 5:00, haqiqiy vaqt — taymer bilan', 'test: tuzatish qayerga yoziladi', 'o\'z tuzatishlarini qo\'llash (pm-m12d8-final)',
  'pitch 5 daqiqada, sherik yoki yakka', 'uch savolga bir daqiqadan javob', 'yakuniy test: bilgan faktni aytish', 'podium', 'kartochkalar', 'yakun: 6 holat'
];

// --- Matn tekshiruvi (5, 7-ekranlar): ikki tilli; apostrof shakllari normT bilan bir xil ---
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normT = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const normS = (s) => normT(s).replace(/[.,!?;:«»"()—–-]/g, '').replace(/\s+/g, ' ').trim(); // savol solishtirish: kichik harf, bo'shliq, tinish
const PII_RE = /@|t\.me\/|\+998|\d{7,}|(?:\d[\s-]?){9,}|https?:|www\.|\.uz\b|\.com\b/;
const PUL_RE = /(^|[^a-z'а-яё])(investitsiya\S*|pul|pulga|puli|pulni|puldan|so'm\S*|dollar\S*|ulush\S*|summa\S*|million\S*|mln|инвестиц\S*|деньг\S*|денег|сум|сумм\S*|доллар\S*|дол[яюи]|миллион\S*|млн)(?![a-z'а-яё])/;
const VADA_RE = /(^|[^a-z'а-яё])(tez orada|albatta|yetamiz|aniq bo'ladi|скоро|обязательно|достигнем|точно будет)(?![a-z'а-яё])/;
const TAXMIN_RE = /(^|[^a-z'а-яё])(menimcha|taxminan|ko'p odam\S*|hamma\S*|hech kim|по-моему|примерно|много людей|все|всем|никто)(?![a-z'а-яё])/;
// 5-ekran: bloklaydi — bo'sh · o'zgarmagan · PII · 160; yo'naltiradi (ikkinchi «Saqlash» bilan o'tadi) — qolganlari
const tekshir5 = (id, matn, oldin) => {
  const s = String(matn || '').trim(); const n = normT(s); const o = String(oldin || '').trim();
  if (!n) return { x: 'bosh', blok: true };
  if (o && n === normT(o)) return { x: 'ozgarmadi', blok: true };
  if (PII_RE.test(n)) return { x: 'pii', blok: true };
  if (s.length > 160) return { x: 'uzun', blok: true };
  if (o && s.length - o.length > 40) return { x: 'uzaydi' };
  if (id === 'keyingi' && PUL_RE.test(n)) return { x: 'pul' };
  if (VADA_RE.test(n)) return { x: 'vada' };
  if (id === 'raqamlar' && /tasdiq|подтвержд/.test(n) && !/to'lov|оплат/.test(n)) return { x: 'tasdiq' };
  return null;
};
// 7-ekran: bloklaydi — bo'sh javob · bo'sh «Nimani tekshirasiz?» · PII; yo'naltiradi — taxmin · va'da · pul
const tekshir7 = (savolId, javob, tekOchiq, tekshiradi) => {
  const n = normT(javob); const tk = normT(tekshiradi);
  if (!n) return { x: 'bosh', blok: true };
  if (tekOchiq && !tk) return { x: 'tekbosh', blok: true };
  if (PII_RE.test(n) || PII_RE.test(tk)) return { x: 'pii', blok: true };
  if (TAXMIN_RE.test(n) && !/\d/.test(n) && !tekOchiq) return { x: 'taxmin' };
  if (VADA_RE.test(n)) return { x: 'vada' };
  if (savolId === 'keyingi' && PUL_RE.test(n)) return { x: 'pul' };
  return null;
};

// --- O'quvchining oldingi natijalari (bo'lmasa ham ekran ishlaydi; null-xavfsiz — E 51) ---
const matnOl = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const pitchOl = () => { const p = lsO(PITCH_KEY); const b = p && p.bolaklar; return b && typeof b === 'object' ? Object.fromEntries(BOLAK_ID.map(id => [id, matnOl(b[id])])) : null; };
const varaqOl = () => {
  const v = lsO(VARAQ_KEY); if (!v) return null;
  const tuz = Array.isArray(v.tuzatishlar) ? v.tuzatishlar.filter(t => t && BOLAK_ID.includes(t.bolak)).slice(0, 3).map(t => ({ bolak: t.bolak, nima: matnOl(t.nima) })) : [];
  const varaq = Array.isArray(v.varaq) ? v.varaq.filter(x => x && BOLAK_ID.includes(x.bolak)) : [];
  return { tur: v.tur === 'yakka' ? 'yakka' : 'guruh', tuzatishlar: tuz, varaq, hakamSavoli: matnOl(v.hakamSavoli) };
};
const ssenariyOl = () => { const d = lsO(DEMO_KEY); return d && Array.isArray(d.ssenariy) ? d.ssenariy.map(matnOl).filter(Boolean) : []; };
const finalOl = () => {
  const f = lsO(FINAL_KEY) || {};
  return {
    tur: f.tur === 'sherik' || f.tur === 'yakka' ? f.tur : null,
    bolaklar: f.bolaklar && typeof f.bolaklar === 'object' ? Object.fromEntries(BOLAK_ID.map(id => [id, matnOl(f.bolaklar[id])])) : null,
    tuzatishlar: Array.isArray(f.tuzatishlar) ? f.tuzatishlar.filter(t => t && BOLAK_ID.includes(t.bolak) && (t.holat === 'qollandi' || t.holat === 'keyinroq')) : [],
    vaqt: Number.isFinite(f.vaqt) ? f.vaqt : null,
    savollar: Array.isArray(f.savollar) ? f.savollar.filter(s => s && s.id && s.savol).slice(0, 3).map(s => ({ id: s.id, savol: s.savol, javob: matnOl(s.javob), vaqt: Number.isFinite(s.vaqt) ? s.vaqt : null, tekshiradi: matnOl(s.tekshiradi) })) : []
  };
};
const finalYoz = (patch) => { const f = finalOl(); const d = { ...f, ...patch, savedAt: Date.now() }; lsY(FINAL_KEY, d); return d; };
const pitchMatn = (id) => { const f = finalOl(); const p = pitchOl(); return (f.bolaklar && f.bolaklar[id]) || (p && p[id]) || null; };
const qollandiSoni = () => finalOl().tuzatishlar.filter(t => t.holat === 'qollandi').length;
const birinchiGap = (s) => { const t = String(s || '').trim(); const m = t.match(/^.+?[.!?](\s|$)/); return m ? m[0].trim() : t; };

// --- Yordamchi ilgaklar ---
const kamHarakat = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useIpucha = (faol, kalit) => {
  const [k, setK] = useState(false);
  useEffect(() => { setK(false); if (!faol) return undefined; const t = setTimeout(() => setK(true), 40000); return () => clearTimeout(t); }, [faol, kalit]);
  return faol && k;
};
// Reja chizig'i tezlashtirilgan yurishi (0 → 300 «reja» soniyasi, ms ichida); reduced-motion — darhol oxiri
const useYurish = (faol, ms = 6000, kechik = 0) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!faol) return undefined;
    if (kamHarakat()) { setV(JAMI_VAQT); return undefined; }
    let t0 = null; let raf = 0;
    const qadam = (ts) => { if (t0 === null) t0 = ts; const p = Math.min(1, (ts - t0) / ms); setV(Math.round(p * JAMI_VAQT)); if (p < 1) raf = requestAnimationFrame(qadam); };
    const id = setTimeout(() => { raf = requestAnimationFrame(qadam); }, kechik);
    return () => { clearTimeout(id); cancelAnimationFrame(raf); };
  }, [faol]); // eslint-disable-line
  return v;
};
// Haqiqiy taymer (soniya): ishlayotganda Date.now() bilan sanaydi
const useTaymer = (ishla) => {
  const [sek, setSek] = useState(0);
  const t0 = useRef(0);
  useEffect(() => {
    if (!ishla) return undefined;
    t0.current = Date.now() - sek * 1000;
    const id = setInterval(() => setSek(Math.floor((Date.now() - t0.current) / 1000)), 250);
    return () => clearInterval(id);
  }, [ishla]); // eslint-disable-line
  return [sek, setSek];
};
// «Uchadi» (SABOQ P3): karta o'lchanib, position: fixed nusxa nishonga ~0,6 s da uchib boradi; keyin holat yangilanadi
const useUchar = () => {
  const [u, setU] = useState(null);
  const uchir = (from, to, mazmun, keyin, tur) => {
    if (kamHarakat() || !from || !to) { keyin(); return; }
    const a = from.getBoundingClientRect(); const t = to.getBoundingClientRect();
    const s = Math.max(0.35, Math.min(1, t.width / Math.max(1, a.width)));
    setU({ x: a.left, y: a.top, w: a.width, h: a.height, dx: t.left + t.width / 2 - (a.left + a.width / 2), dy: t.top + t.height / 2 - (a.top + a.height / 2), s, bor: false, mazmun, tur });
    requestAnimationFrame(() => requestAnimationFrame(() => setU(v => (v ? { ...v, bor: true } : v))));
    setTimeout(() => { setU(null); keyin(); }, 640);
  };
  const el = u && <div className={cxx('fp-uchar', u.bor && 'bor', u.tur)} aria-hidden="true"
    style={{ left: u.x, top: u.y, width: u.w, minHeight: u.h, transform: u.bor ? 'translate(' + u.dx + 'px,' + u.dy + 'px) scale(' + u.s + ')' : 'none' }}>{u.mazmun}</div>;
  return [el, uchir, !!u];
};
// Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42)
const XulosaQ = ({ taxmin, matn, izoh }) => (<>
  {taxmin}
  <span className="fp-xq-m">{matn}</span>
  {izoh && <span className="fp-xq-i">{izoh}</span>}
</>);
const TaxminQ = ({ togri, aslida }) => (togri
  ? <span className="fp-xq-t">{tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение верно ✓' })}</span>
  : <span className="fp-xq-t xato">{tr({ uz: 'Taxminingiz ✕ — aslida:', ru: 'Ваше предположение ✕ — на деле:' })} {aslida}</span>);
const IPUCHA = (t) => <p className="fp-ipucha fade-step">{t}</p>;
const ixchamBashorat = (taxmin, el) => <div className={cxx('fp-bash', taxmin && 'ix')}>{el}</div>;
// Bosqich tugmalari (ixcham, bir qatorda; joriysi accent halqada, bosilgani ✓)
const Qadamlar3 = ({ nomlar, q, faol, onBos }) => (
  <div className="fp-qadamlar">
    {nomlar.map((n, i) => (
      <QChip key={i} holat={i < q ? 'ok' : i === q && faol ? 'on' : undefined} className={cxx(i === q && faol && 'fp-joriy')} disabled={!faol || i !== q} onClick={onBos}>
        <i>{i < q ? '✓' : i + 1}</i>{tr(n)}
      </QChip>
    ))}
  </div>
);

// --- Telefon: «Maydon Jamoa» — «O'yin» ekrani (≈170×272, o'lchami barqaror; faqat 3-ekranda) ---
const JamoaTelefon = ({ son = 8 }) => (
  <div className="fp-tel">
    <div className="fp-tel-ekran">
      <span className="fp-tel-nom"><MJ /></span>
      <span className="fp-tel-y">{tr({ uz: "O'yin", ru: 'Игра' })}</span>
      <b className="fp-tel-vaqt">{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
      <span className="fp-tel-joy">{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span>
      <b key={son} className={cxx('fp-tel-son', son > 8 && 'yangi')}>{son}{NB}/{NB}10</b>
      <span className="fp-tel-doira">{Array.from({ length: 10 }).map((_, i) => <i key={i} className={i < son ? 'bor' : ''} />)}</span>
      <span className="fp-tel-tugma">{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
    </div>
  </div>
);
// --- Hakam: bitta urg'uli rol kartasi (SABOQ P1) — baholash varag'i belgisi; uch hakam — doirachalar; savol pufagi yoki ✓ ---
const VaraqBelgi = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 4.5h7a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19V6a1.5 1.5 0 0 1 1.5-1.5Zm1.5-1.5h4v3h-4zM9.8 11.2l1.4 1.4 2.8-2.8M9.8 16h4.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Hakam = ({ savol, ok, yorliq, javob, sj, k }) => (
  <div className={cxx('fp-hk', sj && 'sj')}>
    <span className="fp-hk-ava"><VaraqBelgi /></span>
    <div className="fp-hk-o">
      <span className="fp-hk-bosh"><b className="fp-hk-nom">{tr({ uz: 'Hakam', ru: 'Судья' })}</b><span className="fp-hk-doira" aria-hidden="true"><i /><i /><i /></span></span>
      {savol && <span key={k ?? savol} className={cxx('fp-hk-s', ok && 'ok')}><i key={ok ? 'ok' : 'q'}>{ok ? '✓' : '?'}</i><span>{savol}</span>{yorliq && <em className="fp-hk-y">{yorliq}</em>}</span>}
      {javob}
      {sj && <em className="fp-hk-sj">{tr({ uz: 'savol-javob', ru: 'вопросы-ответы' })}</em>}
    </div>
  </div>
);
// --- Bo'lak qatori: holat — oddiy · joriy · xato (izoh pufagi) · qollandi (eski gap chizilib xiralashadi, yangi sirg'alib kiradi) · bosh ---
const BolakQator = ({ b }) => (
  <div className={cxx('fp-bo', b.holat)}>
    <div className="fp-bo-h">
      <b>{b.nom}</b>
      {b.yorliq && <em className={cxx('fp-bo-y', b.yorliqTur)}>{b.yorliq}</em>}
      {b.belgi && <i className="fp-bo-b" key={b.belgi}>{b.belgi}</i>}
    </div>
    {(b.matn || b.eski || b.izoh) && <div className="fp-bo-m">
      {b.eski && <span className="fp-bo-eski">{b.eski}</span>}
      {b.matn && <span className={cxx('fp-bo-t', b.eski && 'yangi')}>{b.matn}{b.uzunroq && <small className="fp-bo-uz">{tr({ uz: 'uzunroq', ru: 'длиннее' })}</small>}</span>}
      {b.izoh && <span className={cxx('fp-pufak', b.izohTur)}>{b.izoh}</span>}
    </div>}
  </div>
);
// --- Savol-javob bo'lagi: uch katak «1:00» — bo'sh (uzuq — U-041) · joriy (accent, to'ladi) · ok (✓ + teg) · oshgan (neytral, +m:ss) ---
const SavolJavobBo = ({ kataklar, katta, refs, hakamBelgi, yonadi = 3 }) => (
  <div className={cxx('fp-sj', katta && 'katta')}>
    <span className="fp-sj-y">{hakamBelgi && <span className="fp-sj-hk"><VaraqBelgi />{tr({ uz: 'Hakam', ru: 'Судья' })}</span>}{tr({ uz: 'savol-javob', ru: 'вопросы-ответы' })}</span>
    <div className="fp-sj-kat">
      {kataklar.map((c, i) => (
        <span key={i} ref={refs ? (el => { refs.current[i] = el; }) : undefined} className={cxx('fp-kat', i < yonadi ? (c.holat || 'bosh') : 'bosh', c.yangi && 'yangi')}>
          <span className="fp-kat-t"><i style={{ transform: 'scaleX(' + (c.holat === 'joriy' ? Math.min(1, c.tol || 0) : (c.holat === 'ok' || c.holat === 'oshgan' ? 1 : 0)) + ')' }} /></span>
          <b>{c.holat === 'ok' ? '✓' : c.holat === 'oshgan' ? '+' + fmtV((c.vaqt || 0) - JAVOB_VAQT) : '1:00'}{c.soat && <i className="fp-soat" aria-hidden="true" />}</b>
          {c.teg && <em>{c.teg}</em>}
          {c.matn && <span className="fp-kat-m">{c.matn}</span>}
        </span>
      ))}
    </div>
  </div>
);
const sjBosh = () => [{ holat: 'bosh' }, { holat: 'bosh' }, { holat: 'bosh' }];
// --- Taymer chizig'i 0–5:00 (reja): olti bo'lak, har biri ostida nomi va «≈40 s»; > 5:00 — qizil davomi «+m:ss»; yonida savol-javob bo'lagi ---
const TaymerChiziq = ({ sek = 0, sj, sjKatta, sjRefs, hakamBelgi, yonadi, joriyKor = true, nomlar = true }) => {
  let acc = 0; const s = Math.max(0, sek);
  const jor = joriyKor && s > 0 && s < JAMI_VAQT ? joriyBolak(s) : null;
  return (
    <div className="fp-tm">
      <div className="fp-tm-ch">
        <div className="fp-tm-chiziq">
          <span className="fp-tm-reja">{tr({ uz: 'reja', ru: 'план' })}</span>
          {BOLAK_ID.map((id, i) => {
            const d = acc; acc += VAQT[i]; const f = Math.min(1, Math.max(0, (s - d) / VAQT[i]));
            return (
              <span key={id} className={cxx('fp-tm-bo', jor === i && 'jor')} style={{ flex: VAQT[i] }}>
                <span className="fp-tm-t"><i style={{ transform: 'scaleX(' + f + ')' }} /></span>
                {nomlar && <em>{tr(BOLAK_NOM[id])}<small>≈{VAQT[i]}{NB}s</small></em>}
              </span>
            );
          })}
          {s > JAMI_VAQT && <span className="fp-tm-ortiq" style={{ flex: Math.min(s - JAMI_VAQT, 90) + 10 }}><span className="fp-tm-t"><i /></span><em>+{fmtV(s - JAMI_VAQT)}</em></span>}
        </div>
        <div className="fp-tm-chet"><span>0:00</span><b>{fmtV(Math.min(s, 5999))}</b><span>5:00</span></div>
      </div>
      {sj && <SavolJavobBo kataklar={sj} katta={sjKatta} refs={sjRefs} hakamBelgi={hakamBelgi} yonadi={yonadi} />}
    </div>
  );
};
const FinalSahna = ({ telefon = false, telSon = 8, hakam, bolaklar = [], taymer, yorliq, ostida, className, children }) => (
  <div className={cxx('fp-sahna', !telefon && 'tel-yoq', className)}>
    {telefon && <div className="fp-sahna-tel"><JamoaTelefon son={telSon} /></div>}
    <div className="fp-sahna-ong">
      {yorliq && <span className="fp-sahna-y">{yorliq}</span>}
      {hakam && <Hakam {...hakam} />}
      {bolaklar.length > 0 && <div className="fp-bolaklar">{bolaklar.map(b => <BolakQator key={b.id} b={b} />)}</div>}
      {children}
      {taymer && <TaymerChiziq {...taymer} />}
      {ostida}
    </div>
  </div>
);
// O'quvchi bo'laklari (yoki Mentor misoli) — sahna qatorlari
const ozBolaklar = (manba, holatFn) => BOLAK_ID.map(id => ({ id, nom: tr(BOLAK_NOM[id]), matn: manba[id] || null, holat: holatFn ? holatFn(id) : 'oddiy' }));

// ===== SCREEN 0 — KIRISH (QKirish; sof so'rovnoma — J-026: correct false hammaga; javob «Aynan!» / «Qiziq fikr!» — T-028, T-067) =====
const HOOK_OPTS = [
  { id: 'taxmin', t: { uz: "«Taxminan shuncha» deb yaqin sonni aytaman", ru: 'Скажу «примерно столько» и назову близкое число' } },
  { id: 'qayta', t: { uz: "Raqamlar bo'lagini boshidan qayta aytaman", ru: 'Повторю часть «Цифры» с начала' } },
  { id: 'tekshir', t: { uz: "«Tekshirib aytaman» deb javob beraman", ru: 'Отвечу: «Проверю и скажу»' } }
];
const HOOK_JAVOB = {
  tekshir: { uz: <><b>Aynan!</b> Bilmagan son o'ylab topilmaydi: «tekshirib aytaman» deysiz, keyin aniq sonni manbasi bilan aytasiz.</>, ru: <><b>Именно!</b> Неизвестное число не выдумывают: говорите «проверю и скажу», а потом называете точное число с источником.</> },
  taxmin: { uz: <><b>Qiziq fikr!</b> Taxmin tez aytiladi. Lekin hakam sonning manbasini so'radi — taxminda manba yo'q.</>, ru: <><b>Интересная мысль!</b> Догадку сказать быстро. Но судья спросил источник числа — у догадки источника нет.</> },
  qayta: { uz: <><b>Qiziq fikr!</b> Son pitchda bor edi. Hakam esa uning manbasini so'radi — qayta aytish bunga javob bermaydi.</>, ru: <><b>Интересная мысль!</b> Число в питче уже было. А судья спросил его источник — повтор на это не отвечает.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const oz = useMemo(() => pitchOl(), []);
  const bor = !!(oz && BOLAK_ID.some(id => oz[id]));
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const bolaklar = BOLAK_ID.map(id => ({ id, nom: tr(BOLAK_NOM[id]), matn: bor ? (oz[id] ? birinchiGap(oz[id]) : null) : birinchiGap(mentorMatn(id, false)), holat: id === 'raqamlar' ? 'joriy' : 'oddiy' }));
  const javob = picked && <span className="fp-hk-javob fade-step">{tr(HOOK_OPTS.find(o => o.id === picked).t)}</span>;
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive halqa={picked !== null} disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('fp-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Final pitchingiz <A>5 daqiqaga tayyormi?</A></>, ru: <>Готов ли ваш финальный питч <A>на 5 минут?</A></> })}
          mentor={<Mentor>{tr({ uz: "Bu mashqda pitch uchun 5 daqiqa bor, keyin hakam savol beradi. Javobni aniq bilmasangiz, nima deysiz?", ru: 'В этом упражнении на питч есть 5 минут, потом судья задаёт вопрос. Если вы точно не знаете ответа, что скажете?' })}</Mentor>}
          maket={<FinalSahna yorliq={!bor ? tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' }) : null}
            hakam={{ savol: tr(HAKAM_SAVOL.raqamlar), javob }}
            bolaklar={bolaklar}
            taymer={{ sek: JAMI_VAQT, joriyKor: false, nomlar: false, sj: [{ holat: 'joriy', tol: 0, soat: picked !== null }, { holat: 'bosh' }, { holat: 'bosh' }] }} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual o'zi yuradi: chiziq 5:00 gacha, so'ng uch «1:00» katak birma-bir yonadi; tugagach «Boshlaymiz» halqada) =====
// MD «matnsiz skelet» → SABOQ A4 / 13-Modul P3: matnsiz bo'sh chiziq yo'q — bo'lak nomlari turadi (1-darsda o'tilgan; 2, 3-ekran kashfiyoti ochilmaydi).
const REJA = [
  { t: { uz: 'Hakam savoliga qanday javob berishni bilib olasiz', ru: 'Узнаете, как отвечать на вопрос судьи' }, teg: { uz: 'savol-javob', ru: 'вопросы-ответы' } },
  { t: { uz: "Tuzatishlar ro'yxatingizni pitchga qo'llaysiz", ru: 'Примените список исправлений к питчу' }, teg: { uz: 'tuzatish', ru: 'исправление' } },
  { t: { uz: 'Pitchingizni taymer bilan 5 daqiqada aytasiz', ru: 'Расскажете питч за 5 минут с таймером' }, teg: { uz: 'taymer', ru: 'таймер' } },
  { t: { uz: 'Uch savolga bir daqiqadan javob berasiz', ru: 'Ответите на три вопроса по минуте' }, teg: { uz: 'hakam savoli', ru: 'вопрос судьи' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const sek = useYurish(true, 4200, 3000);
  const [yondi, setYondi] = useState(kamHarakat() ? 3 : 0);
  useEffect(() => {
    if (sek < JAMI_VAQT || yondi >= 3) return undefined;
    const t = setTimeout(() => setYondi(n => n + 1), 550);
    return () => clearTimeout(t);
  }, [sek, yondi]);
  const tayyor = yondi >= 3;
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={tayyor} label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun pitchingizni <A>5 daqiqada aytasiz.</A></>, ru: <>Сегодня расскажете свой питч <A>за 5 минут.</A></> })}
        mentor={<Mentor>{tr({ uz: "Pitch qoralamangiz va tuzatishlar ro'yxatingiz saqlangan bo'lsa, bugun ular o'zi ochiladi.", ru: 'Если ваш черновик питча и список исправлений сохранены, сегодня они откроются сами.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="fp-reja">
          <span className="fp-reja-teg">{tr({ uz: 'pitch mashqi 2: taymer va savol-javob', ru: 'тренировка питча 2: таймер и вопросы-ответы' })}</span>
          <div className="fp-skelet">{BOLAK_ID.map((id, i) => <span key={id} className="fp-skelet-b" style={{ animationDelay: (i * 0.45) + 's' }}>{tr(BOLAK_NOM[id])}</span>)}</div>
          <TaymerChiziq sek={sek} nomlar={false} joriyKor={false} sj={[{ holat: 'joriy', tol: 1 }, { holat: 'joriy', tol: 1 }, { holat: 'joriy', tol: 1 }]} yonadi={yondi} />
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      />
    </Stage>
  );
};

// ===== SCREEN 2 — SAVOL-JAVOB (QTushuncha keng; bashorat → 3 juft karta ketma-ket: to'g'ri — katakka uchadi, xato — silkinadi; markaziy) =====
const S2_TAXMIN = [{ k: '0', t: { uz: 'Hech biriga', ru: 'Ни на один' } }, { k: '1', t: { uz: 'Bittasiga', ru: 'На один' } }, { k: '2', t: { uz: 'Ikkitasiga', ru: 'На два' } }];
const S2_IZOH = [
  { uz: 'Bu mashqda har javobga bir daqiqagacha vaqt bor: bir-ikki gap yetadi.', ru: 'В этом упражнении на каждый ответ — до минуты: хватит одной-двух фраз.' },
  { uz: "Javobni bilmasangiz, «tekshirib aytaman» deyiladi: son va fakt o'ylab topilmaydi.", ru: 'Если не знаете ответа, говорят «проверю и скажу»: числа и факты не выдумывают.' }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [k, setK] = useState(storedAnswer ? 3 : 0);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(null);
  const [okBelgi, setOkBelgi] = useState(false);
  const xatoBor = useRef(storedAnswer ? !storedAnswer.birinchi : false);
  const kartaRef = useRef([]); const katakRef = useRef([]);
  const [uchEl, uchir, uchmoqda] = useUchar();
  const done = k >= 3;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, k);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { correct: true, picked: true, taxmin, birinchi: !xatoBor.current });
    if (!xatoBor.current && achMiss && achMiss.earn) achMiss.earn('sharpAnswer');
  }, [done]); // eslint-disable-line
  const mj = MENTOR_JAVOB[Math.min(k, 2)];
  const juft = mj.togriBirinchi ? [mj.togri, mj.notogri] : [mj.notogri, mj.togri];
  const togriIdx = mj.togriBirinchi ? 0 : 1;
  const bos = (i) => {
    if (!taxmin || done || uchmoqda) return;
    if (i === togriIdx) {
      setXato(null); setOkBelgi(true);
      uchir(kartaRef.current[i], katakRef.current[k], <span>{tr(mj.togri)}</span>, () => { setK(n => n + 1); setOkBelgi(false); }, 'ok');
    } else {
      xatoBor.current = true; setXato(mj.xato); setSilk(i);
      setTimeout(() => setSilk(null), 700);
    }
  };
  const kataklar = MENTOR_JAVOB.map((m, i) => (i < k ? { holat: 'ok', teg: tr(m.teg), yangi: i === k - 1 } : i === k ? { holat: 'joriy', tol: 0 } : { holat: 'bosh' }));
  const sahna = <div className="fp-sahna fp-sjr">
    <Hakam savol={done ? null : tr(mj.savol)} ok={okBelgi} yorliq={!done && mj.yorliq ? tr(mj.yorliq) : null} k={'s' + k} sj={done} />
    <SavolJavobBo kataklar={kataklar} katta refs={katakRef} />
  </div>;
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · savol-javob', ru: 'Понятие · вопросы-ответы' })} screen={screen} scrollSignal={k} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Javoblarni tanlang (${k}/3)`, ru: `Выберите ответы (${k}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Hakam savoliga <A>qanday javob berasiz?</A></>, ru: <>Как вы <A>ответите на вопрос судьи?</A></> })}
        mentor={<Mentor>{tr({ uz: "Hakam javobni bir daqiqada eshitadi — har savol ostidagi ikki javobdan mosini bosing.", ru: 'Судья слушает ответ минуту — под каждым вопросом нажмите подходящий из двух ответов.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Mentor nechta savolga «tekshirib aytaman» deydi?", ru: 'На сколько вопросов Ментор скажет «проверю и скажу»?' })} variantlar={S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="fp-harakat">
          <span className="fp-kulyor">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</span>
          <div className="fp-juft">
            {juft.map((j, i) => (
              <button key={k + '-' + i} ref={el => { kartaRef.current[i] = el; }} type="button" className={cxx('fp-jk', taxmin && !uchmoqda && 'cur', silk === i && 'silk', uchmoqda && i === togriIdx && 'jo')} disabled={!taxmin || uchmoqda} onClick={() => bos(i)}>
                {tr(j)}
              </button>
            ))}
          </div>
          {xato && <QXato key={'x' + k + xato.uz}>{tr(xato)}</QXato>}
          {k >= 1 && <QIzoh>{tr(S2_IZOH[0])}</QIzoh>}
          <p className="fp-nishon-q">{xatoBor.current ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</p>
          {ipucha && IPUCHA(tr({ uz: "Hakam nimani so'radi — javob aynan shunga javob beradimi?", ru: 'О чём спросил судья — отвечает ли ответ именно на это?' }))}
        </div>}
        vizual={sahna}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === '1'} aslida={tr({ uz: 'bittasiga', ru: 'на один' })} />}
          matn={tr({ uz: "Bu misolda Mentor bilganini son va fakt bilan aytdi, bilmaganiga — «tekshirib aytaman».", ru: 'В этом примере Ментор то, что знал, сказал числом и фактом, а на то, чего не знал, — «проверю и скажу».' })}
          izoh={tr(S2_IZOH[1])} />}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 3 — TUZATISH VA TAYMER (QTushuncha; bashorat → 3 tugma: varaq · tuzatishlar · taymer; telefon faqat shu ekranda) =====
const S3_TUGMA = [{ uz: 'Varaq', ru: 'Лист' }, { uz: 'Tuzatishlar', ru: 'Исправления' }, { uz: 'Taymer', ru: 'Таймер' }];
const S3_TAXMIN = [{ k: 'qisqa', t: { uz: 'Qisqaroq', ru: 'Короче' } }, { k: 'teng', t: { uz: 'Taxminan teng', ru: 'Примерно равны' } }, { k: 'uzun', t: { uz: 'Uzunroq', ru: 'Длиннее' } }];
const S3_IZOH = [
  { uz: "Gap almashtirilgani reja vaqtini o'zgartirmaydi. Haqiqiy vaqtni pitchni aytib, taymer bilan bilasiz.", ru: 'Замена фразы не меняет время по плану. Настоящее время узнаете, рассказав питч с таймером.' },
  { uz: 'Bu darsda tayyorlangan oxirgi pitch versiyangiz — final pitch. Sig\'ishini taymer bilan tekshirasiz.', ru: 'Последняя версия питча, подготовленная на этом уроке, — финальный питч. Укладывается ли он, проверите таймером.' }
];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const yur = useYurish(q >= 3 && !storedAnswer, 6000, 200);
  const sek = storedAnswer ? JAMI_VAQT : yur;
  const done = q >= 3 && sek >= JAMI_VAQT;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && q < 3, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  // «Taymer» bosilganda chiziq ko'rinadigan joyga suriladi — yurish ekranda ko'rinib sodir bo'ladi (SABOQ P3)
  useEffect(() => {
    if (q !== 3 || storedAnswer) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.q-tushuncha .fp-tm'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'center' }); }, 120);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line
  const bolaklar = BOLAK_ID.map(id => {
    const b = { id, nom: tr(BOLAK_NOM[id]), matn: mentorMatn(id, false), holat: 'oddiy' };
    if (q === 1) {
      if (JAMOA_VARAQ.xato[id]) return { ...b, holat: 'xato', belgi: '✗', izoh: tr(JAMOA_VARAQ.xato[id]), izohTur: 'xato' };
      if (id === 'keyingi') return { ...b, izoh: tr(JAMOA_VARAQ.hakamSavoli), izohTur: 'hakam' };
      return { ...b, belgi: '✓' };
    }
    if (q >= 2 && TUZATILGAN.includes(id)) return { ...b, eski: tugadi ? null : mentorMatn(id, false), matn: mentorMatn(id, true), holat: 'qollandi', yorliq: tr({ uz: "qo'llandi", ru: 'применено' }), uzunroq: true };
    return b;
  }).map(b => (tugadi && !TUZATILGAN.includes(b.id) ? { id: b.id, nom: b.nom, holat: 'nomi' } : b)).map(b => (q >= 3 && sek > 0 && sek < JAMI_VAQT && joriyBolak(sek) === BOLAK_ID.indexOf(b.id) ? { ...b, holat: cxx(b.holat, 'joriy') } : b));
  const sjBor = q >= 3 && sek >= JAMI_VAQT;
  const sahna = <FinalSahna telefon telSon={q >= 3 && sek >= 115 ? 9 : 8} className="katta"
    yorliq={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>}
    bolaklar={bolaklar}
    taymer={{ sek: q >= 3 ? sek : 0, sj: sjBor ? [{ holat: 'joriy', tol: 0 }, { holat: 'bosh' }, { holat: 'bosh' }] : null, hakamBelgi: sjBor }}
    ostida={q === 1 && <span className="fp-kulq">{tr({ uz: "Mentor misoli · 5-darsdagi baholash varag'i", ru: 'Пример Ментора · лист оценки из 5-го урока' })}</span>} />;
  const tx = S3_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · tuzatish va taymer', ru: 'Понятие · исправление и таймер' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Tugmalarni bosing (${q}/3)`, ru: `Нажмите кнопки (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Tuzatishlar qo'shilsa, pitch <A>5 daqiqaga sig'adimi?</A></>, ru: <>Если добавить исправления, <A>уложится ли питч в 5 минут?</A></> })}
        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va Mentor pitchi qanday o'zgarishiga qarang.", ru: 'Нажимайте кнопки по одной и смотрите, как меняется питч Ментора.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Yangi gaplar eskisidan qanday?', ru: 'Какие новые фразы по сравнению со старыми?' })} variantlar={S3_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="fp-harakat">
          <Qadamlar3 nomlar={S3_TUGMA} q={q} faol={!!taxmin && q < 3} onBos={() => setQ(n => Math.min(3, n + 1))} />
          {q === 2 && <QIzoh>{tr(S3_IZOH[0])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — Mentor pitchi qanday o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как меняется питч Ментора.' }))}
        </div>}
        vizual={sahna}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === 'uzun'} aslida={tr({ uz: 'uzunroq — uchala yangi gap eskisidan uzun', ru: 'длиннее — все три новые фразы длиннее старых' })} />}
          matn={tr({ uz: "Bu misolda uch gap almashdi, reja 5 daqiqaligicha qoldi; haqiqiy vaqt — faqat taymer bilan aytganda.", ru: 'В этом примере сменились три фразы, план остался на 5 минут; настоящее время — только когда рассказываете с таймером.' })}
          izoh={tr(S3_IZOH[1])} />}
      />
    </Stage>
  );
};

// ===== SCREEN 4 — TEKSHIRUV (QuestionScreen → QTest; INLINE_KEYS.s4 = 2; ikkinchi misol — kitob almashish ilovasi, P-002) =====
const KitobBozor = () => (
  <div className="fp-mini">
    <span className="fp-mini-h"><b>{tr({ uz: 'Kitob ilovasi', ru: 'Приложение для книг' })}</b> · {tr(BOLAK_NOM.bozor)}</span>
    <span className="fp-bo-eski kor">{tr({ uz: 'Chatda 120 kishi …', ru: 'В чате 120 человек …' })}</span>
    <span className="fp-mini-yangi">{tr({ uz: "Maktab chatida — 120 a'zo …", ru: 'В школьном чате — 120 участников …' })}</span>
    <span className="fp-mini-tm"><span className="fp-mini-ulush"><i /></span><em>{tr({ uz: 'vaqt — taymer bilan', ru: 'время — по таймеру' })}</em></span>
  </div>
);
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · tuzatish', ru: 'Проверка · исправление' })}
    questionText="Kitob ilovangiz pitchi: guruh Bozorga ✗ qo'ydi — «120 kishi kim?». Qanday tuzatasiz?"
    question={tr({ uz: <h2 className="title h-ask">Kitob ilovangiz pitchi: guruh Bozorga ✗ qo'ydi — «120 kishi kim?». <A>Qanday tuzatasiz?</A></h2>, ru: <h2 className="title h-ask">Питч вашего приложения для книг: группа поставила Рынку ✗ — «120 человек — это кто?». <A>Как исправите?</A></h2> })}
    options={[
      { uz: "Bozor bo'lagini pitchdan butunlay olib tashlayman", ru: 'Полностью уберу часть «Рынок» из питча' },
      { uz: 'Eski gapga yana uch gap qo\'shib, batafsil yozaman', ru: 'Добавлю к старой фразе ещё три и распишу подробно' },
      { uz: 'Eski gap o\'rniga ularning kimligini aniq yozaman', ru: 'Вместо старой фразы точно напишу, кто они' },
      { uz: 'Gapni qoldirib, savol-javobda tushuntirib beraman', ru: 'Оставлю фразу и объясню в вопросах-ответах' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Tuzatish eski gap o'rniga; vaqtini keyin taymer ko'rsatadi.", ru: 'Исправление — вместо старой фразы; время потом покажет таймер.' }}
    explainWrong={{
      0: { uz: "Bozor kerak: hakam «qancha odamga kerak?» deb so'raydi.", ru: 'Рынок нужен: судья спросит «скольким людям это нужно?».' },
      1: { uz: "Uch gap qo'shilsa, bo'lak o'z vaqtiga sig'adimi?", ru: 'Если добавить три фразы, уложится ли часть в своё время?' },
      3: { uz: "Varaqdagi ✗ pitchning o'zida tuzatiladi.", ru: '✗ из листа исправляют в самом питче.' },
      default: { uz: "Mentor Bozor bo'lagini qanday tuzatgan edi?", ru: 'Как Ментор исправил часть «Рынок»?' }
    }}
    vizual={<KitobBozor />} />
);

// ===== SCREEN 5 — TUZATISHLARINGIZ (QMustaqil; bittadan karta — E 53; pm-m12d5-varaq → pm-m12d8-final) =====
const S5_XATO = {
  ozgarmadi: { uz: "Matn o'zgarmadi — tuzatishni qayta o'qing.", ru: 'Текст не изменился — перечитайте исправление.' },
  bosh: { uz: "Bo'lakka bitta-ikkita gap yozing.", ru: 'Напишите в часть одну-две фразы.' },
  pii: { uz: 'Pitchga telefon, akkaunt va havola yozilmaydi.', ru: 'В питч не пишут телефон, аккаунт и ссылку.' },
  uzun: { uz: "160 belgidan oshdi — bitta gapni qisqartiring.", ru: 'Больше 160 знаков — сократите одну фразу.' },
  uzaydi: { uz: 'Gap ancha uzaydi — vaqtini taymer bilan tekshiring.', ru: 'Фраза заметно удлинилась — проверьте время таймером.' },
  pul: { uz: "Bu kursda pul so'ralmaydi — bitta aniq so'rov yozing.", ru: 'На этом курсе деньги не просят — напишите одну точную просьбу.' },
  vada: { uz: "Bu va'da — keyingi haftada aynan nima qilasiz?", ru: 'Это обещание — что именно сделаете на следующей неделе?' },
  tasdiq: { uz: "Tasdiq hali to'lov emas — buni gapda ayting.", ru: 'Подтверждение — ещё не оплата: скажите это во фразе.' }
};
const S5_YORDAM = {
  bozor: { uz: "Mentor misolida: «Mahalla futbol guruhida — 60 kishi» o'rniga «Mahalla futbolining Telegram guruhida — 60 a'zo».", ru: 'В примере Ментора: вместо «В футбольной группе махалли — 60 человек» — «В Telegram-группе футбола махалли — 60 участников».' },
  raqamlar: { uz: "Mentor misolida: «Pro'ga yozma tasdiq berdi — bu hali to'lov emas» o'rniga «Pro uchun to'lashga tayyorligini yozdi — real to'lov hali yo'q».", ru: 'В примере Ментора: вместо «дали письменное подтверждение на Pro — это ещё не оплата» — «написали, что готовы платить за Pro, — реальной оплаты ещё нет».' },
  keyingi: { uz: "Mentor misolida: «Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring» o'rniga «Ilova hozir maydon egalariga xizmat qilmaydi — sizdan bitta so'rov: ular bilan tanishtiring».", ru: 'В примере Ментора: вместо «Одна просьба к вам: познакомьте с владельцами площадок в махалле» — «Приложение сейчас не обслуживает владельцев площадок — одна просьба к вам: познакомьте с ними».' },
  boshqa: { uz: "Varaqdagi izoh nimani so'ragan bo'lsa, shuni eski gap o'rniga aniq yozing.", ru: 'Что бы ни спрашивал комментарий в листе — напишите это точно вместо старой фразы.' }
};
const S5_OXIR = { uz: "Sonlaringiz o'zingizniki — yangi son o'ylab topilmaydi.", ru: 'Ваши числа — ваши: новое число не выдумывают.' };
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const varaq = useMemo(() => varaqOl(), []);
  const pitch = useMemo(() => pitchOl() || {}, []);
  const boshF = useMemo(() => finalOl(), []);
  const varaqRejim = !!(varaq && varaq.tuzatishlar.length);
  const [tanlangan, setTanlangan] = useState(() => (varaqRejim ? varaq.tuzatishlar.map(t => t.bolak) : boshF.tuzatishlar.map(t => t.bolak).slice(0, 3)));
  const kartalar = varaqRejim ? varaq.tuzatishlar : tanlangan.map(b => ({ bolak: b, nima: null }));
  const [holat, setHolat] = useState(() => Object.fromEntries(boshF.tuzatishlar.map(t => [t.bolak, t.holat])));
  const [matn, setMatn] = useState(() => Object.fromEntries(BOLAK_ID.map(id => [id, (holat[id] === 'qollandi' && boshF.bolaklar && boshF.bolaklar[id]) || pitch[id] || ''])));
  const [joriy, setJoriy] = useState(() => { const k = kartalar.find(c => !holat[c.bolak]); return k ? k.bolak : null; });
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [uchish, setUchish] = useState(false);
  const [uchdi, setUchdi] = useState(null);
  const signalRef = useRef(false);
  const N = kartalar.length;
  const n = kartalar.filter(c => holat[c.bolak]).length;
  const done = N > 0 && n === N;
  const qSoni = kartalar.filter(c => holat[c.bolak] === 'qollandi').length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'tuzatishlar', solved: true, correct: true, picked: true }); }, [done]); // eslint-disable-line
  const yozKalit = (h, m) => {
    if (isMentor) return;
    const bolaklar = Object.fromEntries(BOLAK_ID.map(id => [id, h[id] === 'qollandi' ? (String(m[id] || '').trim() || null) : (pitch[id] || null)]));
    const tuzatishlar = kartalar.filter(c => h[c.bolak]).map(c => ({ bolak: c.bolak, holat: h[c.bolak] }));
    finalYoz({ bolaklar, tuzatishlar });
  };
  const keyingiga = (h, id) => {
    const qolgan = kartalar.filter(c => !h[c.bolak]).map(c => c.bolak);
    const idx = kartalar.findIndex(c => c.bolak === id);
    return kartalar.slice(idx + 1).map(c => c.bolak).find(b => qolgan.includes(b)) || qolgan[0] || null;
  };
  const otkaz = (id, yangiH) => {
    setXato(null); setYumshoq(null); setYordam(false); setUchish(true);
    setTimeout(() => { setHolat(yangiH); setUchdi(id); setJoriy(keyingiga(yangiH, id)); setUchish(false); setTimeout(() => setUchdi(null), 1100); }, kamHarakat() ? 0 : 380);
  };
  const saqla = () => {
    if (!joriy || uchish) return;
    const id = joriy; const m = String(matn[id] || '').trim(); const t = tekshir5(id, m, pitch[id]);
    if (t && (t.blok || !(yumshoq && yumshoq.id === id && yumshoq.x === t.x && yumshoq.matn === m))) { setXato(t); if (!t.blok) setYumshoq({ id, x: t.x, matn: m }); return; }
    const yangiH = { ...holat, [id]: 'qollandi' };
    yozKalit(yangiH, matn);
    if (achMiss && achMiss.earn) achMiss.earn('fixApplied');
    if (!signalRef.current && _live && _live.mode === 'student') { signalRef.current = true; _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
    otkaz(id, yangiH);
  };
  const keyinroq = () => {
    if (!joriy || uchish) return;
    const id = joriy; const yangiH = { ...holat, [id]: 'keyinroq' };
    yozKalit(yangiH, { ...matn, [id]: pitch[id] || '' });
    setMatn(d => ({ ...d, [id]: pitch[id] || '' }));
    otkaz(id, yangiH);
  };
  const och = (id) => { if (uchish) return; setJoriy(id); setXato(null); setYumshoq(null); setYordam(false); };
  const tanla = (id) => {
    if (tanlangan.includes(id) || tanlangan.length >= 3 || uchish) return;
    setTanlangan(l => [...l, id]); setJoriy(j => j || id);
  };
  const keyinSet = new Set(Object.keys(holat).filter(b => holat[b] === 'keyinroq'));
  const strip = <div className="fp-strip">
    <span className="fp-strip-y">{tr({ uz: 'Tuzatishlar', ru: 'Исправления' })} · {n}{NB}/{NB}{N}</span>
    {kartalar.map((c, i) => <QChip key={c.bolak} holat={joriy === c.bolak ? 'on' : holat[c.bolak] === 'qollandi' ? 'ok' : undefined} className={cxx('fp-tab', uchdi === c.bolak && 'yangi', keyinSet.has(c.bolak) && 'keyin')} onClick={() => och(c.bolak)}>
      <i>{holat[c.bolak] === 'qollandi' ? '✓' : i + 1}</i>{tr(BOLAK_NOM[c.bolak])}{holat[c.bolak] && <small>{holat[c.bolak] === 'qollandi' ? tr({ uz: "qo'llandi", ru: 'применено' }) : tr({ uz: 'keyinroq', ru: 'позже' })}</small>}
    </QChip>)}
  </div>;
  const tanlovQator = !varaqRejim && <div className="fp-tanlov">
    <p className="fp-kulrang">{tr({ uz: "Tuzatishlar ro'yxatingiz topilmadi — tuzatmoqchi bo'lgan bo'lakni tanlang.", ru: 'Список исправлений не найден — выберите часть, которую хотите исправить.' })}</p>
    <div className="fp-tanlov-c">{BOLAK_ID.map(id => <QChip key={id} holat={tanlangan.includes(id) ? 'ok' : undefined} className={cxx('fp-tg', !tanlangan.length && 'chorla')} disabled={tanlangan.includes(id) || tanlangan.length >= 3} onClick={() => tanla(id)}>{tanlangan.includes(id) ? '✓ ' : ''}{tr(BOLAK_NOM[id])}</QChip>)}</div>
  </div>;
  const karta = joriy && (() => {
    const c = kartalar.find(x => x.bolak === joriy) || { bolak: joriy };
    const izoh = varaq && varaq.varaq.find(v => v.bolak === joriy && v.belgi === '✗' && matnOl(v.izoh));
    const m = String(matn[joriy] || ''); const uz = m.trim().length; const oldinUz = (pitch[joriy] || '').length;
    const ozgardi = normT(m) !== normT(pitch[joriy] || '');
    return (
      <div key={joriy} className={cxx('fp-karta', xato && xato.blok && 'err', uchish && 'uch')}>
        <div className="fp-karta-bosh">
          <span className="q-yorliq">{tr({ uz: 'Tuzatish', ru: 'Исправление' })} {kartalar.findIndex(x => x.bolak === joriy) + 1}{NB}/{NB}{N}</span>
          {varaqRejim && <span className="fp-kulyor">{varaq.tur === 'yakka' ? tr({ uz: '5-darsda o\'zingiz to\'ldirgan varaq', ru: 'Лист, который вы заполнили на 5-м уроке' }) : tr({ uz: "5-darsdagi guruh varag'i", ru: 'Лист группы из 5-го урока' })}</span>}
        </div>
        <b className="fp-karta-h">{tr(BOLAK_NOM[joriy])}</b>
        {c.nima ? <p className="fp-kulrang">{c.nima}</p> : !varaqRejim && <p className="fp-kulrang">{tr({ uz: 'Bu bo\'lakda nimani aniqroq aytish mumkin?', ru: 'Что в этой части можно сказать точнее?' })}</p>}
        {izoh && <p className="fp-kulrang">{tr({ uz: 'Varaqda:', ru: 'В листе:' })} {izoh.izoh}</p>}
        <div className={cxx('fp-maydon', !uz && 'chorla')}>
          <i className="fp-maydon-n">{tr(BOLAK_NOM[joriy])}</i>
          <textarea className={cxx('fp-inp', xato && xato.blok && 'err')} rows={3} maxLength={400} value={m} placeholder={tr(HAKAM_SAVOL[joriy])} aria-label={tr(BOLAK_NOM[joriy])}
            onChange={(e) => { const v = e.target.value; setMatn(d => ({ ...d, [joriy]: v })); setXato(null); }} />
          <span className={cxx('fp-sanoq-b', uz > 160 && 'oshdi', oldinUz > 0 && uz > oldinUz && uz <= 160 && 'uzaydi')}>{uz}{NB}/{NB}160{oldinUz > 0 && <em>{tr({ uz: 'oldin:', ru: 'было:' })}{NB}{oldinUz}</em>}</span>
        </div>
        {xato && <QXato key={xato.x}>{tr(S5_XATO[xato.x])}</QXato>}
        {xato && !xato.blok && <p className="fp-yana">{tr({ uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — нажмите «Сохранить» ещё раз.' })}</p>}
        {yordam && <div className="fp-yordam fade-step">
          <p>{tr(S5_YORDAM[joriy] || S5_YORDAM.boshqa)}</p>
          <p>{tr(S5_OXIR)}</p>
        </div>}
        <div className="fp-karta-tug">
          <QTugma className={cxx(uz > 0 && ozgardi && 'fp-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
          <QTugma ikkinchi onClick={keyinroq}>{tr({ uz: 'Keyinroq', ru: 'Позже' })}</QTugma>
          <QTugma ikkinchi className="fp-o" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
        </div>
      </div>
    );
  })();
  const yakuniy = done && !joriy;
  const forma = isMentor
    ? <div className="fp-fokus">
      <div className="fp-mt">{TUZATILGAN.map(id => <div key={id} className="fp-mt-q"><b>{tr(BOLAK_NOM[id])}</b><span className="fp-bo-eski kor">{mentorMatn(id, false)}</span><span className="fp-mt-yangi">{mentorMatn(id, true)}</span></div>)}</div>
      <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: "Tuzatish qo'llaganlar", ru: 'Применили исправление' }} />
    </div>
    : yakuniy
      ? <div className="fp-fokus"><Zoomable><FinalSahna yorliq={tr({ uz: "Final pitch · qo'llandi", ru: 'Финальный питч · применено' }) + ' ' + qSoni}
        bolaklar={BOLAK_ID.map(id => ({ id, nom: tr(BOLAK_NOM[id]), matn: holat[id] === 'qollandi' ? String(matn[id] || '').trim() : (pitch[id] || null), holat: uchdi === id ? 'qollandi yangi' : (holat[id] === 'qollandi' ? 'qollandi' : 'oddiy'), yorliq: holat[id] === 'qollandi' ? tr({ uz: "qo'llandi", ru: 'применено' }) : null }))}
        taymer={{ sek: 0 }} /></Zoomable>
        <QXulosa>{qSoni > 0 ? tr({ uz: `${qSoni} ta tuzatish pitchingizga qo'llandi.`, ru: `${qSoni} ${qSoni === 1 ? 'исправление применено' : 'исправления применены'} к вашему питчу.` }) : tr({ uz: "Tuzatishlar hali qo'llanmadi — uyga vazifada qoladi.", ru: 'Исправления ещё не применены — останутся в домашнем задании.' })}</QXulosa></div>
      : karta;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · tuzatishlar', ru: 'Самостоятельная работа · исправления' })} screen={screen} scrollSignal={n * 10 + (joriy ? BOLAK_ID.indexOf(joriy) : 9)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={yakuniy} disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : N === 0 ? tr({ uz: "Bo'lakni tanlang", ru: 'Выберите часть' }) : tr({ uz: `Kartalarni ko'ring (${n}/${N})`, ru: `Просмотрите карточки (${n}/${N})` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Tuzatishlar ro'yxatingizni <A>pitchga qo'llang.</A></>, ru: <>Примените список исправлений <A>к питчу.</A></> })}
        mentor={<Mentor>{varaqRejim || isMentor
          ? tr({ uz: "Har kartadagi tuzatishni o'qing va bo'lak gapini eski gap o'rniga qayta yozing.", ru: 'Прочитайте исправление на каждой карточке и перепишите фразу части вместо старой.' })
          : tr({ uz: "Tuzatmoqchi bo'lgan bo'lakni tanlang va gapini eski gap o'rniga qayta yozing.", ru: 'Выберите часть, которую хотите исправить, и перепишите её фразу вместо старой.' })}</Mentor>}
        qadamlar={!isMentor && !yakuniy && <>{tanlovQator}{N > 0 && strip}</>}
        forma={forma}
      />
    </Stage>
  );
};

// ===== SCREEN 6 — 5 DAQIQA (QMustaqil; juftlik yoki yakka; taymer 5:00 — «Keyingi bo'lak» yo'q; markaziy natija — optionalLive yo'q) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const boshF = useMemo(() => finalOl(), []);
  const ssenariy = useMemo(() => ssenariyOl(), []);
  const [tur, setTur] = useState(boshF.tur);
  const [ish, setIsh] = useState('kutish'); // kutish · yur · toxta
  const [sek, setSek] = useTaymer(ish === 'yur');
  const [vaqt, setVaqt] = useState(boshF.vaqt);
  const [oldingi, setOldingi] = useState(null);
  const signalRef = useRef(false);
  const yakka = tur === 'yakka';
  const bolMatn = useMemo(() => (isMentor ? Object.fromEntries(BOLAK_ID.map(id => [id, mentorMatn(id, true)])) : Object.fromEntries(BOLAK_ID.map(id => [id, pitchMatn(id)]))), [isMentor]);
  const qollandi = useMemo(() => new Set(finalOl().tuzatishlar.filter(t => t.holat === 'qollandi').map(t => t.bolak)), []);
  const turTanla = (t) => { if (ish === 'yur') return; setTur(t); if (!isMentor) finalYoz({ tur: t }); };
  const boshla = () => { if (!tur && !isMentor) return; setSek(0); setOldingi(o => (ish === 'toxta' && vaqt !== null ? vaqt : o)); setIsh('yur'); };
  const toxtat = () => {
    if (ish !== 'yur') return;
    const v = sek; setIsh('toxta'); setVaqt(v);
    if (isMentor) return;
    finalYoz({ vaqt: v, tur });
    if (v <= JAMI_VAQT && achMiss && achMiss.earn) achMiss.earn('fiveMinutes');
    if (_live && _live.mode === 'student') {
      if (!signalRef.current) { signalRef.current = true; _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
      if (v <= JAMI_VAQT) _live.submitAnswer(PRACTICE_BASE + 50 + screen, 'practice', 0, true, 0);
    }
    if (storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'pitch 5:00', solved: true, correct: true, picked: true });
  };
  const qaytadan = () => { if (ish === 'toxta' && vaqt !== null) setOldingi(vaqt); setIsh('kutish'); setSek(0); };
  const aytildi = vaqt !== null;
  const korSek = ish === 'kutish' ? 0 : sek;
  const sahna = <FinalSahna
    yorliq={isMentor ? tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' }) : null}
    bolaklar={BOLAK_ID.map((id, i) => ({ id, nom: tr(BOLAK_NOM[id]), matn: bolMatn[id], holat: ish === 'yur' && korSek < JAMI_VAQT && joriyBolak(korSek) === i ? 'joriy' : 'oddiy', yorliq: !isMentor && qollandi.has(id) ? tr({ uz: "qo'llandi", ru: 'применено' }) : null }))}
    taymer={{ sek: korSek, joriyKor: false }} />;
  const tugmalar = <div className="fp-tg-q">
    {ish !== 'yur' && <QTugma className={cxx((tur || isMentor) && ish === 'kutish' && !aytildi && 'fp-halqa')} disabled={!tur && !isMentor} onClick={boshla}>{tr({ uz: '5 daqiqani boshlash', ru: 'Запустить 5 минут' })}</QTugma>}
    {ish === 'yur' && <QTugma className="fp-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
    <QTugma ikkinchi disabled={ish === 'kutish'} onClick={qaytadan}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma>
    {ish === 'toxta' && <span className="fp-vaqt">{tr({ uz: 'Vaqt:', ru: 'Время:' })} <b className={cxx(sek > JAMI_VAQT && 'oshdi')}>{fmtV(sek)}</b></span>}
    {oldingi !== null && <span className="fp-oldingi">{tr({ uz: 'Oldingi urinish:', ru: 'Прошлая попытка:' })} {fmtV(oldingi)}</span>}
  </div>;
  const ssMatn = ssenariy.length
    ? tr({ uz: `Demo — 6-darsdagi demo ssenariyingiz bo'yicha (${ssenariy.join(' · ')}): laptop brauzerida, ikkinchi qurilma — telefon brauzerida.`, ru: `Демо — по вашему сценарию демо из 6-го урока (${ssenariy.join(' · ')}): в браузере ноутбука, второе устройство — браузер телефона.` })
    : tr({ uz: "Demo — 6-darsdagi demo ssenariysi bo'yicha: laptop brauzerida, ikkinchi qurilma — telefon brauzerida.", ru: 'Демо — по сценарию демо из 6-го урока: в браузере ноутбука, второе устройство — браузер телефона.' });
  const oldin = ish === 'kutish' && <div className="fp-oldin">
    <span className="fp-oldin-y">{tr({ uz: 'Pitchdan oldin', ru: 'Перед питчем' })}</span>
    <p>{ssMatn}</p>
    <p>{tr({ uz: "Demo yo'lini bir marta oching va ro'yxat chiqqanini ko'ring.", ru: 'Один раз откройте путь демо и убедитесь, что список появился.' })}</p>
    <p>{tr({ uz: "Demo — real odamlar qo'shilmagan o'yinda; demodan keyin holat boshiga qaytariladi.", ru: 'Демо — в игре без реальных людей; после демо состояние возвращают к началу.' })}</p>
    <p>{fmtCode(tr({ uz: "Laptopda Database va `.env` yopiq — ekranni hakam ko'radi.", ru: 'На ноутбуке Database и `.env` закрыты — экран видит судья.' }))}</p>
  </div>;
  const rejim = !isMentor && <div className="fp-rejim">
    {[['sherik', { uz: 'Sherik bilan', ru: 'С напарником' }], ['yakka', { uz: 'Yakka', ru: 'Один' }]].map(([k, t]) => <QChip key={k} holat={tur === k ? 'on' : undefined} className={cxx('fp-tg', !tur && 'chorla')} disabled={ish === 'yur'} onClick={() => turTanla(k)}>{tr(t)}</QChip>)}
    <span className="fp-art">{tr({ uz: "Final pitch · qo'llandi", ru: 'Финальный питч · применено' })} {qollandi.size}</span>
  </div>;
  const oshdi = ish === 'toxta' && sek > JAMI_VAQT;
  return (
    <Stage eyebrow={yakka ? tr({ uz: 'Mustaqil ish · taymer', ru: 'Самостоятельная работа · таймер' }) : tr({ uz: 'Juftlikda ish · taymer', ru: 'Работа в паре · таймер' })} screen={screen} scrollSignal={ish} navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={aytildi && ish === 'toxta'} disabled={!aytildi && !isMentor} label={aytildi || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: '5 daqiqani boshlang', ru: 'Запустите 5 минут' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={yakka ? tr({ uz: <>Final pitchingizni taymer bilan <A>5 daqiqada ayting.</A></>, ru: <>Расскажите финальный питч с таймером <A>за 5 минут.</A></> }) : tr({ uz: <>Final pitchingizni sherigingizga <A>5 daqiqada ayting.</A></>, ru: <>Расскажите финальный питч напарнику <A>за 5 минут.</A></> })}
        mentor={<Mentor>{yakka ? tr({ uz: "Ikki qurilmada demo yo'lini ochib qo'ying, keyin «5 daqiqani boshlash»ni bosib, pitchni ovoz chiqarib ayting.", ru: 'Откройте путь демо на двух устройствах, затем нажмите «Запустить 5 минут» и расскажите питч вслух.' }) : tr({ uz: "Ikki qurilmada demo yo'lini ochib qo'ying, keyin «5 daqiqani boshlash»ni bosib, sherigingizga ayting.", ru: 'Откройте путь демо на двух устройствах, затем нажмите «Запустить 5 минут» и расскажите напарнику.' })}</Mentor>}
        qadamlar={rejim}
        forma={<div className="fp-fokus">
          {oldin}
          {tugmalar}
          <Zoomable>{sahna}</Zoomable>
          {ish !== 'toxta' && !yakka && !isMentor && <p className="fp-kulrang">{tr({ uz: 'Avval A gapiradi, B taymerni boshlab tinglaydi; keyin almashasiz.', ru: 'Сначала говорит A, B запускает таймер и слушает; потом меняетесь.' })}</p>}
          {ish !== 'toxta' && <p className="fp-kulrang">{tr({ uz: 'Demo ochilmasa — B reja videosini ko\'rsating.', ru: 'Если демо не откроется — покажите видео плана Б.' })}</p>}
          {ish === 'toxta' && !isMentor && <QXulosa>
            <span className="fp-xq-m">{oshdi ? tr({ uz: `Pitch ${fmtV(sek)} da aytildi — 5 daqiqadan +${fmtV(sek - JAMI_VAQT)} oshdi.`, ru: `Питч рассказан за ${fmtV(sek)} — на +${fmtV(sek - JAMI_VAQT)} больше 5 минут.` }) : tr({ uz: `Pitch ${fmtV(sek)} da aytildi — 5 daqiqaga sig'di.`, ru: `Питч рассказан за ${fmtV(sek)} — уложился в 5 минут.` })}</span>
            {oshdi && <span className="fp-xq-i">{tr({ uz: 'Vaqt 5 daqiqadan oshdi — takrorlangan yoki ortiqcha gapni toping va qisqartiring.', ru: 'Время больше 5 минут — найдите повторы или лишние фразы и сократите.' })}</span>}
          </QXulosa>}
          {isMentor && <><MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Pitchni aytganlar', ru: 'Рассказали питч' }} />
            <MentorPracticeStats live={_live} screen={screen} sig={PRACTICE_BASE + 50 + screen} yorliq={{ uz: "5 daqiqaga sig'ganlar", ru: 'Уложились в 5 минут' }} /></>}
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — SAVOL-JAVOB MASHQI (QMustaqil; bittadan karta; sherik — bank chiplari, yakka — «Savolni ochish») =====
const S7_XATO = {
  bosh: { uz: 'Javobingizni bir qatorda yozing.', ru: 'Напишите ответ одной строкой.' },
  tekbosh: { uz: 'Nimani tekshirishingizni bir qatorda yozing.', ru: 'Одной строкой напишите, что будете проверять.' },
  pii: { uz: 'Pitchga telefon, akkaunt va havola yozilmaydi.', ru: 'В питч не пишут телефон, аккаунт и ссылку.' },
  taxmin: { uz: "Bu taxmin — bilmasangiz, «Tekshirib aytaman»ni bosing.", ru: 'Это догадка — если не знаете, нажмите «Проверю и скажу».' },
  vada: { uz: "Bu va'da — bugun nimani aniq bilasiz?", ru: 'Это обещание — что вы точно знаете сегодня?' },
  pul: { uz: "Bu kursda pul so'ralmaydi — bitta aniq so'rov ayting.", ru: 'На этом курсе деньги не просят — назовите одну точную просьбу.' }
};
const savolMatn = (s) => { const b = SAVOL_BANK.find(x => x.id === s.id); return b ? tr(b.t) : s.savol; };
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const varaq = useMemo(() => varaqOl(), []);
  const tur = useMemo(() => finalOl().tur || 'sherik', []);
  const yakka = tur === 'yakka';
  const [savollar, setSavollar] = useState(() => finalOl().savollar);
  const [ish, setIsh] = useState('kutish');
  const [sek, setSek] = useTaymer(ish === 'yur');
  const [javob, setJavob] = useState('');
  const [tekOchiq, setTekOchiq] = useState(false);
  const [tek, setTek] = useState('');
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [uchEl, uchir, uchmoqda] = useUchar();
  const kartaRef = useRef(null); const katakRef = useRef([]);
  const signalRef = useRef(false);
  const hakamS = varaq && varaq.hakamSavoli;
  const hakamId = hakamS ? ((SAVOL_BANK.find(b => normS(ou(b.t)) === normS(hakamS)) || {}).id || 'boshqa') : null;
  const saqlangan = savollar.filter(s => s.javob).length;
  const cur = savollar.findIndex(s => !s.javob);
  const joriy = cur >= 0 ? savollar[cur] : null;
  const done = saqlangan >= 3;
  const ishlatilgan = new Set(savollar.map(s => s.id));
  const bank = SAVOL_BANK.filter(b => !ishlatilgan.has(b.id) && !(hakamS && normS(ou(b.t)) === normS(hakamS)));
  const yozS = (l) => { setSavollar(l); if (!isMentor) finalYoz({ savollar: l }); };
  // 1-savol — o'quvchining 5-darsdagi hakam savoli (bo'lsa); ochilganda kalitga yoziladi (E 51)
  useEffect(() => {
    if (isMentor || savollar.length || !hakamS) return;
    yozS([{ id: hakamId, savol: hakamS, javob: null, vaqt: null, tekshiradi: null }]);
  }, []); // eslint-disable-line
  useEffect(() => {
    if (isMentor) return;
    const tayyor = savollar.filter(s => s.javob);
    if (tayyor.length >= 3 && tayyor.every(s => Number.isFinite(s.vaqt) && s.vaqt <= JAVOB_VAQT) && achMiss && achMiss.earn) achMiss.earn('threeAnswers');
  }, [savollar]); // eslint-disable-line
  const och = (id) => {
    if (joriy || done || uchmoqda) return;
    const b = id ? SAVOL_BANK.find(x => x.id === id) : bank[Math.floor(Math.random() * bank.length)];
    if (!b) return;
    yozS([...savollar, { id: b.id, savol: ou(b.t), javob: null, vaqt: null, tekshiradi: null }]);
    setIsh('kutish'); setSek(0); setJavob(''); setTek(''); setTekOchiq(false); setXato(null); setYumshoq(null); setYordam(false);
  };
  const saqla = () => {
    if (!joriy || ish !== 'toxta' || uchmoqda) return;
    const j = javob.trim(); const tk = tek.trim();
    const t = tekshir7(joriy.id, j, tekOchiq, tk);
    if (t && (t.blok || !(yumshoq && yumshoq.x === t.x && yumshoq.matn === j))) { setXato(t); if (!t.blok) setYumshoq({ x: t.x, matn: j }); return; }
    const v = sek; const i = cur;
    const yangi = savollar.map((s, k) => (k === i ? { ...s, javob: j, vaqt: v, tekshiradi: tekOchiq ? tk : null } : s));
    if (!isMentor) finalYoz({ savollar: yangi });
    if (!signalRef.current && _live && _live.mode === 'student') { signalRef.current = true; _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
    if (storedAnswer === undefined && i === 0) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'savol-javob', solved: true, correct: true, picked: true });
    setXato(null); setYumshoq(null); setYordam(false);
    uchir(kartaRef.current, katakRef.current[i], <span>{j}</span>, () => { setSavollar(yangi); setIsh('kutish'); setSek(0); setJavob(''); setTek(''); setTekOchiq(false); }, v <= JAVOB_VAQT ? 'ok' : '');
  };
  const qolgan = JAVOB_VAQT - sek;
  const tekXato = !!(xato && xato.x === 'tekbosh');
  const kataklar = [0, 1, 2].map(i => {
    const s = savollar[i];
    if (s && s.javob) return { holat: s.vaqt <= JAVOB_VAQT ? 'ok' : 'oshgan', vaqt: s.vaqt, teg: fmtV(s.vaqt), matn: done ? s.javob : null };
    if (i === (cur >= 0 ? cur : savollar.length)) return { holat: 'joriy', tol: ish === 'kutish' ? 0 : sek / JAVOB_VAQT };
    return { holat: 'bosh' };
  });
  const sahna = <div className="fp-sahna fp-sjr">
    <Hakam savol={joriy ? savolMatn(joriy) : null} k={'q' + cur} sj={!joriy} />
    <SavolJavobBo kataklar={kataklar} refs={katakRef} katta />
  </div>;
  const tanlov = !joriy && !done && !isMentor && (yakka || (!bank.length)
    ? <div className="fp-ochish"><span className="q-yorliq">{tr({ uz: 'Savol', ru: 'Вопрос' })} {savollar.length + 1}{NB}/{NB}3</span><QTugma className="fp-halqa" disabled={!bank.length} onClick={() => och(null)}>{tr({ uz: 'Savolni ochish', ru: 'Открыть вопрос' })}</QTugma></div>
    : <div className="fp-ochish"><span className="q-yorliq">{tr({ uz: 'Savol', ru: 'Вопрос' })} {savollar.length + 1}{NB}/{NB}3 · {tr({ uz: 'sherigingiz tanlaydi', ru: 'выбирает напарник' })}</span>
      <div className="fp-bank">{bank.map(b => <QChip key={b.id} className="fp-tg chorla" onClick={() => och(b.id)}>{tr(b.t)}</QChip>)}</div></div>);
  const karta = joriy && (
    <div ref={kartaRef} key={'k' + cur} className={cxx('fp-karta', xato && xato.blok && 'err')}>
      <div className="fp-karta-bosh">
        <span className="q-yorliq">{tr({ uz: 'Savol', ru: 'Вопрос' })} {cur + 1}{NB}/{NB}3</span>
        {cur === 0 && hakamS && joriy.savol === hakamS && <span className="fp-kulyor">{varaq.tur === 'yakka' ? tr({ uz: '5-darsda o\'zingiz yozgan savol', ru: 'Вопрос, который вы написали на 5-м уроке' }) : tr({ uz: "5-darsdagi guruh varag'idan", ru: 'Из листа группы 5-го урока' })}</span>}
      </div>
      <b className="fp-savol">{savolMatn(joriy)}</b>
      {joriy.id === 'hozir' && <p className="fp-kulrang">{tr({ uz: "«bu ish» — pitchingizdagi Muammo", ru: '«эта задача» — Проблема из вашего питча' })}</p>}
      <div className="fp-tg-q">
        <span className={cxx('fp-1d', ish === 'yur' && 'yur', qolgan < 0 && 'oshdi')}>{qolgan >= 0 ? fmtV(ish === 'kutish' ? JAVOB_VAQT : qolgan) : '+' + fmtV(-qolgan)}</span>
        {ish === 'kutish' && <QTugma className="fp-halqa" onClick={() => { setSek(0); setIsh('yur'); }}>{tr({ uz: '1 daqiqani boshlash', ru: 'Запустить 1 минуту' })}</QTugma>}
        {ish === 'yur' && <QTugma className="fp-halqa" onClick={() => setIsh('toxta')}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
      </div>
      {ish !== 'kutish' && qolgan < 0 && <QIzoh>{tr({ uz: 'Javob bir daqiqadan oshdi — bitta son yoki faktda to\'xtang.', ru: 'Ответ дольше минуты — остановитесь на одном числе или факте.' })}</QIzoh>}
      {ish === 'toxta' && <>
        <div className={cxx('fp-maydon', !javob.trim() && 'chorla')}>
          <i className="fp-maydon-n">{tr({ uz: 'Javobingiz qisqasi', ru: 'Кратко ваш ответ' })}</i>
          <textarea className={cxx('fp-inp', xato && xato.blok && !tekXato && 'err')} rows={2} maxLength={160} value={javob} placeholder={tr({ uz: 'Son yoki fakt — qayerdan bilasiz?', ru: 'Число или факт — откуда вы знаете?' })} aria-label={tr({ uz: 'Javobingiz qisqasi', ru: 'Кратко ваш ответ' })}
            onChange={(e) => { setJavob(e.target.value); setXato(null); }} />
          <span className="fp-sanoq-b">{javob.trim().length}{NB}/{NB}160</span>
        </div>
        {tekOchiq && <div className="fp-maydon kichik">
          <i className="fp-maydon-n">{tr({ uz: 'Nimani tekshirasiz?', ru: 'Что проверите?' })}</i>
          <input className={cxx('fp-inp', tekXato && 'err')} maxLength={160} value={tek} aria-label={tr({ uz: 'Nimani tekshirasiz?', ru: 'Что проверите?' })} onChange={(e) => { setTek(e.target.value); setXato(null); }} />
        </div>}
        {xato && <QXato key={xato.x}>{tr(S7_XATO[xato.x])}</QXato>}
        {xato && !xato.blok && <p className="fp-yana">{tr({ uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — нажмите «Сохранить» ещё раз.' })}</p>}
        {yordam && <div className="fp-yordam fade-step">
          <p>{tr({ uz: "Javob — bir-ikki gap: son yoki fakt va uni qayerdan bilganingiz. Bilmasangiz — «Tekshirib aytaman» va nimani tekshirishingiz.", ru: 'Ответ — одна-две фразы: число или факт и откуда вы это знаете. Не знаете — «Проверю и скажу» и что будете проверять.' })}</p>
          <p>{tr({ uz: 'Mentor misolida: «Bu son qayerdan va nimani sanaydi?» — «51 — ilovada ro\'yxatdan o\'tgan hisoblar, namuna akkauntlarsiz, Database\'dan; 11 tasi — sinfdoshlarim.»', ru: 'В примере Ментора: «Откуда это число и что оно считает?» — «51 — зарегистрированные в приложении аккаунты, без тестовых, из Database; 11 из них — мои одноклассники.»' })}</p>
          <p>{tr({ uz: "«Endi nima qilasiz?» savoliga javob — Keyingi qadam bo'lagingiz: keyingi ish va bitta aniq so'rov.", ru: 'Ответ на «Что будете делать дальше?» — ваша часть «Следующий шаг»: следующее дело и одна точная просьба.' })}</p>
        </div>}
        <div className="fp-karta-tug">
          <QTugma className={cxx(javob.trim() && 'fp-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
          <QTugma ikkinchi aria-pressed={tekOchiq} onClick={() => { setTekOchiq(o => !o); setXato(null); }}>{tr({ uz: 'Tekshirib aytaman', ru: 'Проверю и скажу' })}</QTugma>
          <QTugma ikkinchi className="fp-o" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
        </div>
      </>}
    </div>
  );
  const strip = !isMentor && !done && <div className="fp-strip">
    <span className="fp-strip-y">{tr({ uz: 'Savol-javob', ru: 'Вопросы-ответы' })} · {saqlangan}{NB}/{NB}3</span>
    {savollar.map((s, i) => <span key={i} className={cxx('fp-strip-s', s.javob && 'ok')}><i>{s.javob ? '✓' : i + 1}</i>{savolMatn(s)}</span>)}
    <span className="fp-art">{tr({ uz: "Final pitch · qo'llandi", ru: 'Финальный питч · применено' })} {qollandiSoni()}</span>
  </div>;
  const sigdi = savollar.filter(s => s.javob && s.vaqt <= JAVOB_VAQT).length;
  const forma = isMentor
    ? <div className="fp-fokus"><div className="fp-bank mentor">{SAVOL_BANK.map(b => <span key={b.id} className="fp-bank-s">{tr(b.t)}</span>)}</div>
      <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Uch savolga javob berganlar', ru: 'Ответили на три вопроса' }} /></div>
    : done
      ? <div className="fp-fokus"><Zoomable><FinalSahna className="katta" bolaklar={BOLAK_ID.map(id => ({ id, nom: tr(BOLAK_NOM[id]), holat: 'nomi' }))}>
        <div className="fp-javoblar">{savollar.map((s, i) => <div key={i} className={cxx('fp-jv', s.vaqt <= JAVOB_VAQT ? 'ok' : 'oshgan')}><b>{savolMatn(s)}</b><span>{s.javob}{s.tekshiradi && <small className="fp-jv-tk">{tr({ uz: 'Nimani tekshirasiz?', ru: 'Что проверите?' })} {s.tekshiradi}</small>}</span><em>{fmtV(s.vaqt)}</em></div>)}</div>
      </FinalSahna></Zoomable>
        <QXulosa>{tr({ uz: `Uch savolga javob berdingiz: ${sigdi} tasi bir daqiqaga sig'di.`, ru: `Вы ответили на три вопроса: ${sigdi} из них уложились в минуту.` })}</QXulosa></div>
      : <div className="fp-s7">
        <div className="fp-s7-ch">{tanlov}{karta}</div>
        <Zoomable>{sahna}</Zoomable>
      </div>;
  return (
    <Stage eyebrow={yakka ? tr({ uz: 'Mustaqil ish · savol-javob', ru: 'Самостоятельная работа · вопросы-ответы' }) : tr({ uz: 'Juftlikda ish · savol-javob', ru: 'Работа в паре · вопросы-ответы' })} screen={screen} scrollSignal={saqlangan * 10 + (ish === 'toxta' ? 2 : ish === 'yur' ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={done} disabled={!saqlangan && !isMentor} label={saqlangan || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Savollarga javob bering (${saqlangan}/3)`, ru: `Ответьте на вопросы (${saqlangan}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Uch hakam savoliga <A>bir daqiqadan javob bering.</A></>, ru: <>Ответьте на три вопроса судьи <A>по минуте.</A></> })}
        mentor={<Mentor>{yakka ? tr({ uz: "Savolni oching, «1 daqiqani boshlash»ni bosing va ovoz chiqarib javob bering.", ru: 'Откройте вопрос, нажмите «Запустить 1 минуту» и ответьте вслух.' }) : tr({ uz: "Sherigingiz savolni o'qib, «1 daqiqani boshlash»ni bosadi — siz ovoz chiqarib javob berasiz.", ru: 'Напарник читает вопрос и нажимает «Запустить 1 минуту» — вы отвечаете вслух.' })}</Mentor>}
        qadamlar={strip}
        forma={forma}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s8 = 0; lead qatori bilan) =====
const MiniJavob = () => (
  <div className="fp-mini">
    <span className="fp-mini-h"><b>{tr({ uz: 'Mentorning shu savolga javobi', ru: 'Ответ Ментора на этот вопрос' })}</b></span>
    <span className="fp-mini-yangi">{tr({ uz: "«Telegram guruhida «kim keladi?» deb yozishadi … — o'yinchilar shunday degan.»", ru: '«Пишут в Telegram-группе «кто придёт?» … — так сказали игроки.»' })}</span>
  </div>
);
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Hakam «Odamlar hozir bu ishni nima bilan qiladi?» desa, nima deysiz?"
    question={tr({ uz: <><p className="fp-lead">Kitob almashish ilovangiz haqida sinfdoshlardan so'ragansiz.</p><h2 className="title h-ask">Hakam «Odamlar hozir bu ishni nima bilan qiladi?» desa, <A>nima deysiz?</A></h2></>, ru: <><p className="fp-lead">Вы расспрашивали одноклассников о своём приложении для обмена книгами.</p><h2 className="title h-ask">Если судья спросит «Чем люди сейчас решают эту задачу?», <A>что скажете?</A></h2></> })}
    options={[
      { uz: "«Chatda so'rab topishadi, sinfdoshlar aytgan» deyman", ru: 'Скажу: «Находят, спрашивая в чате, — так сказали одноклассники»' },
      { uz: "«Tekshirib aytaman, hozircha buni bilmayman» deyman", ru: 'Скажу: «Проверю и скажу, пока этого не знаю»' },
      { uz: "«Hech narsa bilan, bunday ilova hali yo'q» deyman", ru: 'Скажу: «Ничем, такого приложения ещё нет»' },
      { uz: "«Ilovamiz hammasidan qulay, sinfdoshlar aytgan» deyman", ru: 'Скажу: «Наше приложение удобнее всех, так сказали одноклассники»' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Bilgan faktingiz va uni kimdan bilganingiz aytiladi.', ru: 'Называют известный вам факт и от кого вы его знаете.' }}
    explainWrong={{
      1: { uz: "Siz sinfdoshlardan so'ragansiz — javobni bilasiz.", ru: 'Вы спрашивали одноклассников — ответ вы знаете.' },
      2: { uz: "Ilova yo'q — lekin kitobni hozir qanday topishadi?", ru: 'Приложения нет — но как книги находят сейчас?' },
      3: { uz: "Bu maqtov — hakam hozirgi yo'lni so'radi.", ru: 'Это похвала — судья спросил о нынешнем способе.' },
      default: { uz: "Bilgan narsangiz bo'lsa — fakt va manbasi bilan.", ru: 'Если вы это знаете — фактом и с источником.' }
    }}
    vizual={<MiniJavob />} />
);

// ===== 🏅 BADGES (nishonlar, 4 — PM: «!» bilan, 9.23) — faqat ish qilingan ekranlarda (S-034); hammasi ekran ichida AchMissCtx.earn orqali =====
const ACHIEVEMENTS = {
  sharpAnswer: { icon: '🎯', name: 'Sharp Answer!', desc: { uz: 'Uch javobni birinchi urinishda tanladingiz', ru: 'Вы выбрали три ответа с первой попытки' } },
  fixApplied: { icon: '🛠️', name: 'Fix Applied!', desc: { uz: "Tuzatishni eski gap o'rniga qo'lladingiz", ru: 'Вы применили исправление вместо старой фразы' } },
  fiveMinutes: { icon: '⏱️', name: 'Five Minutes!', desc: { uz: "Pitchingizni 5 daqiqaga sig'dirib aytdingiz", ru: 'Вы уложили свой питч в 5 минут' } },
  threeAnswers: { icon: '💬', name: 'Three Answers!', desc: { uz: 'Uch savolga bir daqiqadan javob berdingiz', ru: 'Вы ответили на три вопроса по минуте' } }
};
// Ekran id → nishon: ballik testlarda nishon yo'q (MD); 2, 5, 6, 7-ekran nishonlari — ekran ichida (birinchi urinish / saqlashga qarab).
const ACH_TRIGGERS = {};

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
  4: { uz: '1 — Tuzatish qayerga', ru: '1 — Куда исправление' },
  8: { uz: 'Yakuniy — Bilgan faktni aytish', ru: 'Итог — Назвать известный факт' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; emojisiz)
const QZ_BG_SHAPES = [
  { ch: { uz: 'pitch', ru: 'питч' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: "bo'lak", ru: 'часть' }, l: 84, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'taymer', ru: 'таймер' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'hakam', ru: 'судья' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'savol', ru: 'вопрос' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'javob', ru: 'ответ' }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'tuzatish', ru: 'исправление' }, l: 24, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'sherik', ru: 'напарник' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'demo', ru: 'демо' }, l: 56, t: 52, s: 20, d: 22, dl: 3.3 },
  { ch: { uz: "so'rov", ru: 'просьба' }, l: 36, t: 62, s: 20, d: 24, dl: 2.5 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD), to'g'ri javob: A 1·6·11 · B 2·7·9 · C 3·8·10 · D 4·5·12 — har biri 3 marta.
const QUIZ_BANK = [
  { q: { uz: 'Bu mashqda Raqamlar bo\'lagiga qancha vaqt ajratilgan?', ru: 'Сколько времени в этом упражнении отведено на часть «Цифры»?' }, opts: [{ uz: 'Taxminan bir daqiqa', ru: 'Примерно минута' }, { uz: 'Taxminan yarim daqiqa', ru: 'Примерно полминуты' }, { uz: 'Taxminan ikki daqiqa', ru: 'Примерно две минуты' }, { uz: 'Taxminan uch daqiqa', ru: 'Примерно три минуты' }], correct: 0 },
  { q: { uz: 'Mentor Bozordagi «60 kishi»ni qanday aniqlashtirdi?', ru: 'Как Ментор уточнил «60 человек» в Рынке?' }, opts: [{ uz: 'Ularni ilovadagi o\'yinchilar deb yozdi', ru: 'Написал, что это игроки в приложении' }, { uz: 'Ularni Telegram guruhi a\'zolari deb yozdi', ru: 'Написал, что это участники Telegram-группы' }, { uz: 'Ularni Toshkentdagi futbolchilar deb yozdi', ru: 'Написал, что это футболисты Ташкента' }, { uz: 'Ularni o\'zining sinfdoshlari deb yozdi', ru: 'Написал, что это его одноклассники' }], correct: 1 },
  { q: { uz: 'Tuzatish bo\'lakni uzaytirsa, nima qilasiz?', ru: 'Если исправление удлинило часть, что сделаете?' }, opts: [{ uz: 'Pitch vaqtini olti daqiqaga uzaytirasiz', ru: 'Увеличите время питча до шести минут' }, { uz: 'Tuzatishni pitchga umuman kiritmaysiz', ru: 'Вообще не внесёте исправление в питч' }, { uz: 'Eski gapning bir qismini olib tashlaysiz', ru: 'Уберёте часть старой фразы' }, { uz: 'Boshqa bo\'lakni pitchdan olib tashlaysiz', ru: 'Уберёте из питча другую часть' }], correct: 2 },
  { q: { uz: 'Mentor boshqa mahallalar haqida hakamga nima dedi?', ru: 'Что Ментор сказал судье о других махаллях?' }, opts: [{ uz: '«U yerda ham 60 kishidan bor — biz bilamiz»', ru: '«Там тоже по 60 человек — мы знаем»' }, { uz: '«Ularga ilova kerak emas — o\'yin kam bo\'ladi»', ru: '«Им приложение не нужно — игр мало»' }, { uz: '«Hamma mahallada ham bor — muammo bir xil»', ru: '«Во всех махаллях так — проблема одна»' }, { uz: '«Hali tekshirmaganmiz — tekshirib aytaman»', ru: '«Ещё не проверяли — проверю и скажу»' }], correct: 3 },
  { q: { uz: 'Pitch 5 daqiqadan oshdi. Nima qilasiz?', ru: 'Питч длится больше 5 минут. Что сделаете?' }, opts: [{ uz: 'Savol-javob vaqtidan qo\'shib olasiz', ru: 'Добавите время из вопросов-ответов' }, { uz: 'Jonli demoni pitchdan olib tashlaysiz', ru: 'Уберёте живое демо из питча' }, { uz: 'Tezroq gapirib, hammasini aytib chiqasiz', ru: 'Будете говорить быстрее и скажете всё' }, { uz: 'Takrorlangan yoki ortiqcha gapni olasiz', ru: 'Уберёте повторы или лишние фразы' }], correct: 3 },
  { q: { uz: 'Bu mashqda hakam savoliga javob qancha davom etadi?', ru: 'Сколько в этом упражнении длится ответ на вопрос судьи?' }, opts: [{ uz: 'Bir daqiqagacha', ru: 'До одной минуты' }, { uz: 'Uch daqiqagacha', ru: 'До трёх минут' }, { uz: 'Besh daqiqagacha', ru: 'До пяти минут' }, { uz: 'Ikki daqiqagacha', ru: 'До двух минут' }], correct: 0 },
  { q: { uz: 'Siz sanamagan son so\'raldi. Hakamga nima deysiz?', ru: 'Спросили число, которое вы не считали. Что скажете судье?' }, opts: [{ uz: 'Yaqin sonni taxmin qilib aytib berasiz', ru: 'Назовёте близкое число наугад' }, { uz: '«Tekshirib aytaman» deb javob berasiz', ru: 'Ответите: «Проверю и скажу»' }, { uz: 'Savolni eshitmagandek davom etasiz', ru: 'Продолжите, будто не слышали вопроса' }, { uz: 'Pitchni boshidan qayta aytib berasiz', ru: 'Расскажете питч заново с начала' }], correct: 1 },
  { q: { uz: 'Mentor javobi: odamlar hozir o\'yinni nima bilan yig\'adi?', ru: 'Ответ Ментора: чем люди сейчас собирают игру?' }, opts: [{ uz: 'Maxsus sport ilovasida jadval tuzib yig\'adi', ru: 'Составляют расписание в спортивном приложении' }, { uz: 'Maktabda tanaffus paytida kelishib yig\'adi', ru: 'Договариваются в школе на перемене' }, { uz: 'Telegram guruhida «kim keladi?» deb yig\'adi', ru: 'Пишут в Telegram-группе «кто придёт?»' }, { uz: 'Ota-onalar orqali telefonda kelishib yig\'adi', ru: 'Договариваются по телефону через родителей' }], correct: 2 },
  { q: { uz: 'Mentor varag\'ida qaysi ikki bo\'lak ✗ olgan edi?', ru: 'Какие две части получили ✗ в листе Ментора?' }, opts: [{ uz: 'Muammo va Yechim', ru: 'Проблема и Решение' }, { uz: 'Bozor va Raqamlar', ru: 'Рынок и Цифры' }, { uz: 'Jamoa va Raqamlar', ru: 'Команда и Цифры' }, { uz: 'Yechim va Bozor', ru: 'Решение и Рынок' }], correct: 1 },
  { q: { uz: 'Pitchdan oldin demo uchun nima qilinadi?', ru: 'Что делают для демо перед питчем?' }, opts: [{ uz: 'Ilovaga yangi funksiya qo\'shib qo\'yiladi', ru: 'В приложение добавляют новую функцию' }, { uz: 'Database oynasi ekranda ochiq qoldiriladi', ru: 'Окно Database оставляют открытым' }, { uz: 'Demo yo\'li ochilib, ro\'yxat chiqqani ko\'riladi', ru: 'Открывают путь демо и смотрят, что список появился' }, { uz: 'Ikkinchi telefon butunlay o\'chirib qo\'yiladi', ru: 'Второй телефон полностью выключают' }], correct: 2 },
  { q: { uz: 'Pitch paytida sherigingiz nima qiladi?', ru: 'Что делает напарник во время питча?' }, opts: [{ uz: 'Taymerni boshlab, pitchni oxirigacha tinglaydi', ru: 'Запускает таймер и слушает питч до конца' }, { uz: 'Har bo\'lakka ✓ yoki ✗ qo\'yib baholaydi', ru: 'Оценивает каждую часть ✓ или ✗' }, { uz: 'Pitchni siz bilan birga ovoz chiqarib aytadi', ru: 'Рассказывает питч вслух вместе с вами' }, { uz: 'Sizning o\'rningizga jonli demoni ko\'rsatadi', ru: 'Показывает живое демо вместо вас' }], correct: 0 },
  { q: { uz: 'Hakam «Endi nima qilasiz?» desa, nimani aytasiz?', ru: 'Если судья спросит «Что будете делать дальше?», что скажете?' }, opts: [{ uz: 'Mahsulot uchun kerakli pul summasini', ru: 'Нужную продукту сумму денег' }, { uz: 'Tez orada hamma ishlatib qolishini', ru: 'Что скоро им будут пользоваться все' }, { uz: 'Pitchning hamma bo\'laklarini qaytadan', ru: 'Все части питча заново' }, { uz: 'Keyingi ishni va bitta aniq so\'rovni', ru: 'Следующее дело и одну точную просьбу' }], correct: 3 }
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

// ===== 🛠️ JONLI PRAKTIKA — o'quvchi o'zi bajaradi, ustoz kuzatadi =====
// signal zonasi: <100 test · 100+ arena · 500+ praktika (to'qnashmaydi). 550+ — ikkinchi signal (6-ekran: 5 daqiqaga sig'ganlar).
const PRACTICE_BASE = 500;
// Mentor ko'rinishi — "kim bajardi" jonli chiplar paneli
const MentorPracticeStats = ({ live, screen, sig, yorliq }) => {
  const signal = sig ?? (PRACTICE_BASE + screen);
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
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

// 🃏 KARTOCHKALAR — 12 (MD 10-ekran; mexanika va ko'rinish — qolipda: QKartochka, DE-204). Mentorsiz (SABOQ 16).
const FLASHCARDS = [
  { front: { uz: 'Bu darsda final pitch qanday pitch?', ru: 'Какой питч на этом уроке называют финальным?' }, back: { uz: 'Tayyorlangan oxirgi pitch versiyasi; sig\'ishi taymer bilan tekshiriladi', ru: 'Последняя подготовленная версия питча; укладывается ли он — проверяют таймером' } },
  { front: { uz: 'Final pitchdan keyin nima bo\'ladi?', ru: 'Что бывает после финального питча?' }, back: { uz: 'Savol-javob: hakam savol beradi, siz javob berasiz', ru: 'Вопросы-ответы: судья спрашивает, вы отвечаете' } },
  { front: { uz: 'Bu mashqda Yechim bo\'lagiga qancha vaqt ajratilgan?', ru: 'Сколько времени в этом упражнении отведено на Решение?' }, back: { uz: 'Taxminan bir yarim daqiqa — jonli demo bilan', ru: 'Примерно полторы минуты — с живым демо' } },
  { front: { uz: 'Tuzatish pitchga qanday yoziladi?', ru: 'Как исправление записывают в питч?' }, back: { uz: 'Eski gap o\'rniga; keyin vaqt taymer bilan tekshiriladi', ru: 'Вместо старой фразы; потом время проверяют таймером' } },
  { front: { uz: 'Mentor varag\'ida Bozor bo\'lagiga qanday izoh yozilgan edi?', ru: 'Какой комментарий был в листе Ментора к Рынку?' }, back: { uz: '«60 kishi kim — o\'yinchimi, guruhmi?»', ru: '«60 человек — это кто: игроки или группа?»' } },
  { front: { uz: 'Mentor Raqamlar bo\'lagida tasdiqni qanday aniqlashtirdi?', ru: 'Как Ментор уточнил подтверждение в Цифрах?' }, back: { uz: '«3 tashkilotchi Pro uchun to\'lashga tayyorligini yozdi — real to\'lov hali yo\'q»', ru: '«3 организатора написали, что готовы платить за Pro, — реальной оплаты ещё нет»' } },
  { front: { uz: 'Sahnadagi taymer chizig\'i nimani ko\'rsatadi?', ru: 'Что показывает полоса таймера на сцене?' }, back: { uz: 'Rejani — haqiqiy vaqt faqat aytganda o\'lchanadi', ru: 'План — настоящее время измеряют, только когда рассказываешь' } },
  { front: { uz: 'Javob bir daqiqadan oshsa nima qilasiz?', ru: 'Что делать, если ответ дольше минуты?' }, back: { uz: 'Bitta son yoki faktda to\'xtaysiz', ru: 'Остановиться на одном числе или факте' } },
  { front: { uz: 'Hakam savoliga yaxshi javobda nima bo\'ladi?', ru: 'Что есть в хорошем ответе на вопрос судьи?' }, back: { uz: 'Son yoki fakt va uni qayerdan bilganingiz', ru: 'Число или факт и откуда вы это знаете' } },
  { front: { uz: 'Qachon «tekshirib aytaman» deyiladi?', ru: 'Когда говорят «проверю и скажу»?' }, back: { uz: 'Javobni bilmaganda — son va fakt o\'ylab topilmaydi', ru: 'Когда не знаешь ответа — числа и факты не выдумывают' } },
  { front: { uz: 'Mentor «Bu son qayerdan va nimani sanaydi?» savoliga nima dedi?', ru: 'Что Ментор ответил на «Откуда это число и что оно считает?»' }, back: { uz: '51 — ilovada ro\'yxatdan o\'tgan hisoblar, Database\'dan; 11 tasi — sinfdoshlar', ru: '51 — зарегистрированные в приложении аккаунты, из Database; 11 из них — одноклассники' } },
  { front: { uz: 'Mentor qaysi savolga «tekshirib aytaman» dedi?', ru: 'На какой вопрос Ментор сказал «проверю и скажу»?' }, back: { uz: '«Bu mahsulot yana qancha odamga kerak?» — 60 a\'zodan nechtasiga kerakligi hali o\'lchanmagan', ru: '«Скольким ещё людям нужен этот продукт?» — скольким из 60 участников он нужен, ещё не измерено' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('fp-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={FLASHCARDS.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="fp-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + ①②③; ① va ③ — kalitdan shartli; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: "xohlasangiz — oila a'zosi yoki do'stingiz", ru: 'по желанию — член семьи или друг' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '1 pitch, 3 savol', ru: '1 питч, 3 вопроса' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_BANDLAR = [
  { r: '①', t: { uz: "«Keyinroq» qoldirgan tuzatishlaringiz bo'lsa — ularni eski gap o'rniga pitchga qo'llang.", ru: 'Если есть исправления, отложенные кнопкой «Позже», — примените их к питчу вместо старых фраз.' } },
  { r: '②', t: { uz: "Xohlasangiz, pitchni tanish odamga taymer bilan ayting va undan uchta savol berishini so'rang; bo'lmasa taymer bilan o'zingiz ovoz chiqarib ayting va bankdagi uch savolga javob bering.", ru: 'По желанию расскажите питч знакомому с таймером и попросите задать три вопроса; если не получится — расскажите вслух сами с таймером и ответьте на три вопроса из банка.' } },
  { r: '③', t: { uz: "«Tekshirib aytaman» degan savolingiz bo'lsa — javobini toping va manbasi bilan yozib qo'ying.", ru: 'Если на какой-то вопрос вы сказали «проверю и скажу» — найдите ответ и запишите его с источником.' } }
];
const HwCard = ({ keyingi, birinchi, uchinchi }) => (
  <div className="card fp-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="fp-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="fp-hw-q"><span className="fp-hw-k">{tr(r.k)}</span><span className="fp-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="fp-hw-qadam">{HW_BANDLAR.filter((b, i) => (i === 0 ? birinchi : i === 2 ? uchinchi : true)).map(b => <li key={b.r}><i>{b.r}</i><span>{tr(b.t)}</span></li>)}</ol>
    <p className="fp-kulrang">{tr({ uz: 'Tinglovchining ismi hech qayerga yozilmaydi; javoblar bir daqiqadan.', ru: 'Имя слушателя нигде не записывают; ответы — по минуте.' })}</p>
    {keyingi && <span className="fp-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (6 holat, E 54; tartib — 08-FILTR 27). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
// «Bugungi asosiy fikr» qutisi va artefakt-strip — ko'rsatilmaydi (E 50). Belgi ✓ — faqat to'liq holatda.
const SARLAVHA = {
  toliq: { uz: "Final pitch 5 daqiqaga sig'di, savollarga javob bor.", ru: 'Финальный питч уложился в 5 минут, на вопросы есть ответы.' },
  qoldi: (n) => ({ uz: `Pitch aytildi — ${n} ta tuzatish hali qoldi.`, ru: `Питч рассказан — ${n === 1 ? 'осталось ещё 1 исправление' : `осталось ещё ${n} исправления`}.` }),
  oshdi: { uz: "Pitch aytildi — 5 daqiqaga sig'dirish qoldi.", ru: 'Питч рассказан — осталось уложить его в 5 минут.' },
  sj: { uz: "Pitch 5 daqiqaga sig'di — savol-javob qoldi.", ru: 'Питч уложился в 5 минут — остались вопросы-ответы.' },
  taymer: { uz: 'Pitchni taymer bilan aytish hali qoldi.', ru: 'Ещё осталось рассказать питч с таймером.' },
  bosh: { uz: 'Final pitch hali aytilmagan.', ru: 'Финальный питч ещё не рассказан.' }
};
const RECAP = [
  { uz: "Bu darsda final pitch — tuzatishlar qo'llangan oxirgi pitch versiyangiz; sig'ishi taymer bilan tekshiriladi.", ru: 'На этом уроке финальный питч — последняя версия вашего питча с применёнными исправлениями; укладывается ли он, проверяют таймером.' },
  { uz: "Tuzatish eski gap o'rniga yoziladi; keyin pitchning vaqti taymer bilan qayta tekshiriladi.", ru: 'Исправление пишут вместо старой фразы; потом время питча заново проверяют таймером.' },
  { uz: 'Hakam savoliga javob — bir daqiqagacha: son yoki fakt va uni qayerdan bilganingiz.', ru: 'Ответ на вопрос судьи — до минуты: число или факт и откуда вы это знаете.' },
  { uz: "Javobni bilmasangiz, «tekshirib aytaman» deysiz — son o'ylab topilmaydi.", ru: 'Если не знаете ответа, говорите «проверю и скажу» — число не выдумывают.' }
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
  // Holat — o'quvchining saqlangan natijasidan (pm-m12d8-final); tekshirish tartibi yuqoridan pastga; mentor proyektorida — to'liq sarlavha
  const f = finalOl();
  const kRem = f.tuzatishlar.filter(t => t.holat === 'keyinroq').length;
  const sv = f.savollar.filter(s => s.javob).length;
  const v = f.vaqt;
  const holat = isMentorL ? 'toliq'
    : v !== null && v <= JAMI_VAQT && sv >= 3 && kRem === 0 ? 'toliq'
      : v !== null && kRem > 0 ? 'qoldi'
        : v !== null && v > JAMI_VAQT ? 'oshdi'
          : v !== null ? 'sj'
            : (f.tuzatishlar.length || f.savollar.length) ? 'taymer' : 'bosh';
  const sarlavha = holat === 'qoldi' ? SARLAVHA.qoldi(kRem) : SARLAVHA[holat];
  const belgisiz = holat !== 'toliq';
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Video-portfolio: 3 daqiqada o'zingiz va mahsulot»</b></>, ru: <>Следующий урок — <b>«Видео-портфолио: за 3 минуты о себе и продукте»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('fp-yakun', belgisiz && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={tr(sarlavha)}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard keyingi={keyingi} birinchi={kRem > 0} uchinchi={f.savollar.some(s => s.tekshiradi)} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmFinalPitchLesson({ lang: langProp, onFinished, liveToken }) {
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
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice, earn }), [missed, missTry, fpPractice, earn]); // earn — 2, 5, 6, 7-ekran nishonlari (ekran ichida)
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
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        /* === 14-Modul 8-dars — darsning o'z vizuali (prefiks fp-): FinalSahna · Hakam · taymer chizig'i · savol-javob bo'lagi · tuzatish va javob kartalari. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .fp-mj { font-weight: 800; font-style: normal; color: ${MJ_RANG}; white-space: nowrap; }
        @keyframes fp-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes fp-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes fp-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: 0 0 0 7px ${fon(T.accent, 0)}; } }
        @keyframes fp-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes fp-yashil { 0% { background: ${T.okFon}; } 100% { background: transparent; } }
        @keyframes fp-pop { 0% { transform: scale(1.25); } 100% { transform: scale(1); } }
        @keyframes fp-sirg { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: none; } }
        @keyframes fp-eski { 0%, 55% { opacity: .7; max-height: 60px; } 100% { opacity: 0; max-height: 0; margin: 0; } }
        @keyframes fp-chiz { from { background-size: 0% 2px; } to { background-size: 100% 2px; } }
        @keyframes fp-soat { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fp-toq { from { color: ${fon(T.ink, 0.18)}; border-color: ${T.line}; } to { color: ${T.ink}; border-color: ${fon(T.accent, 0.45)}; } }
        @keyframes fp-kartakir { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes fp-uch { to { opacity: 0; transform: translateY(-46px) scale(.6); } }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, scale yo'q (E 40) */
        .fp-halqa { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: fp-puls 2.2s ease-out .3s 3; }
        .btn-white-accent.fp-halqa { outline-offset: 3px; }
        /* Tanlov guruhi — har variantning o'z yengil chegarasi, navbatma-navbat 2 marta (E 40) */
        .fp-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: fp-chorla-v 1.8s ease-out .5s 2; }
        .fp-k.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .fp-k.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: fp-chorla 1.8s ease-out .5s 2; }
        .q-bashorat .q-chip:nth-child(2) { animation-delay: .75s; } .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        .q-chip.chorla:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: fp-chorla 1.8s ease-out .5s 2; }
        .fp-bash .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 14px; row-gap: 6px; padding: 10px 14px; }
        .fp-bash .q-bashorat > .q-yorliq { flex-basis: 100%; }
        .fp-bash.ix .q-bashorat { padding-top: 8px; padding-bottom: 8px; }
        @media (min-width: 761px) { .fp-k .q-split { grid-template-columns: minmax(0,1.3fr) minmax(0,1fr); gap: 26px; } }
        .fp-k, .fp-yakun { display: flex; flex-direction: column; flex: 1 0 auto; }
        .fp-harakat { display: flex; flex-direction: column; gap: 10px; }
        .fp-qadamlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .fp-qadamlar .q-chip i { font-style: normal; font-weight: 800; color: ${T.accent}; margin-right: 7px; }
        .fp-qadamlar .q-chip.ok i { color: ${T.ok}; }
        .fp-qadamlar .q-chip.fp-joriy { animation: fp-puls 2.2s ease-out .3s 3; }
        p.fp-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.fp-nishon-q { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        p.fp-kulrang { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.fp-yana { margin: 0; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        p.fp-lead { margin: 0 0 8px; font-size: 15px; line-height: 1.5; color: ${T.ink2}; }
        .fp-kulyor { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; }
        .fp-kulq { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        /* Yashil xulosa qutisi: taxmin — birinchi kichik qator, QIzoh — oxirgi (E 42) */
        .q-xulosa .fp-xq-t { display: block; font-size: 12.5px; font-weight: 700; color: ${T.ok}; margin-bottom: 5px; }
        .q-xulosa .fp-xq-t.xato { color: ${T.ink2}; }
        .q-xulosa .fp-xq-m { display: block; }
        .q-xulosa .fp-xq-i { display: block; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; margin-top: 8px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.25)}; }
        /* FinalSahna */
        .fp-sahna { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 22px; align-items: start; }
        .fp-sahna.tel-yoq, .fp-sahna.fp-sjr { grid-template-columns: minmax(0,1fr); }
        .fp-sahna.fp-sjr { display: flex; flex-direction: column; align-items: stretch; gap: 10px; }
        .zoomable:not(.zoom-on) > .fp-sahna { padding-right: 40px; }
        .fp-sahna-ong { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .fp-sahna-y { align-self: flex-start; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; }
        .fp-tel { width: 170px; height: 272px; border-radius: 26px; background: #1E1B26; padding: 9px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.5); display: flex; flex: none; }
        .fp-tel-ekran { flex: 1; min-width: 0; background: ${T.paper}; border-radius: 18px; padding: 13px 12px 12px; display: flex; flex-direction: column; gap: 3px; }
        .fp-tel-nom { font-size: 13px; }
        .fp-tel-y { margin-top: 8px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: ${T.ink2}; }
        .fp-tel-vaqt { font-size: 14.5px; color: ${T.ink}; }
        .fp-tel-joy { font-size: 12px; color: ${T.ink2}; }
        .fp-tel-son { margin-top: 10px; font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .fp-tel-son.yangi { color: ${MJ_RANG}; animation: fp-pop .5s cubic-bezier(.3,1.5,.5,1); }
        .fp-tel-doira { display: flex; gap: 3px; flex-wrap: wrap; }
        .fp-tel-doira i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .fp-tel-doira i.bor { background: ${MJ_RANG}; }
        .fp-tel-tugma { margin-top: auto; text-align: center; font-size: 12px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border-radius: 10px; padding: 8px 6px; }
        /* Hakam — bitta urg'uli rol kartasi (P1) */
        .fp-hk { display: flex; align-items: center; gap: 12px; padding: 8px 14px; border-radius: 16px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 12px 28px -16px ${fon(T.accent, 0.6)}; animation: fp-kir .4s ease-out both; }
        .fp-hk.sj { padding-top: 6px; padding-bottom: 6px; }
        .fp-hk-ava { width: 40px; height: 40px; border-radius: 50%; background: ${T.accent}; color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 0 0 5px ${T.accentSoft}; }
        .fp-hk-ava svg { width: 22px; height: 22px; }
        .fp-hk-o { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; min-width: 0; flex: 1; }
        .fp-hk-bosh { display: inline-flex; align-items: center; gap: 8px; }
        .fp-hk-nom { font-size: 16px; font-weight: 800; color: ${T.ink}; letter-spacing: .01em; }
        .fp-hk-doira { display: inline-flex; gap: 3px; }
        .fp-hk-doira i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.accent, 0.45)}; }
        .fp-hk-s { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; line-height: 1.35; color: ${T.ink}; animation: fp-kir .35s ease-out both; }
        .fp-hk-s > i { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 13px; background: ${T.accentSoft}; color: ${T.accent}; flex: none; animation: fp-pop .4s ease-out; }
        .fp-hk-s.ok { color: ${T.ok}; }
        .fp-hk-s.ok > i { background: ${T.ok}; color: #fff; }
        .fp-hk-y { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 8px; white-space: nowrap; }
        .fp-hk-sj { font-style: normal; font-size: 12px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 10px; }
        .fp-hk-javob { flex-basis: 100%; align-self: flex-start; font-size: 14px; font-weight: 600; line-height: 1.4; color: ${T.ink}; background: ${T.bg}; border-radius: 12px 12px 4px 12px; padding: 6px 12px; animation: fp-kir .45s ease-out both; }
        /* Bo'lak qatori — nom va matn bir qatorda; matn ≥14px, «…» siz 3 qatorgacha (P5) */
        .fp-bolaklar { display: flex; flex-direction: row; flex-wrap: wrap; gap: 4px 6px; }
        .fp-bolaklar > .fp-bo { flex-basis: 100%; }
        .fp-bolaklar > .fp-bo.nomi { flex-basis: auto; order: -1; }
        .fp-bo { display: flex; align-items: flex-start; gap: 12px; padding: 5px 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 11px; min-width: 0; transition: border-color .3s, background .3s; animation: fp-kir .35s ease-out both; }
        .fp-bo-h { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 6px; flex: none; width: 124px; }
        .fp-bo.nomi .fp-bo-h { width: auto; }
        .fp-k .fp-bo-h { width: 106px; }
        .fp-k .fp-bo { padding-top: 4px; padding-bottom: 4px; gap: 10px; }
        .fp-bo-h b { font-size: 14px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .fp-bo-y { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 7px; white-space: nowrap; animation: fp-kir .4s ease-out both; }
        .fp-bo-b { font-style: normal; font-weight: 800; color: ${T.ok}; animation: fp-pop .4s ease-out; }
        .fp-bo-m { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
        .fp-bo-t { font-size: 14px; line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; }
        .fp-bo-t.yangi { animation: fp-sirg .55s ease-out .9s both, fp-yashil 1.4s ease-out 1.2s; border-radius: 4px; }
        .fp-bo-eski { display: block; overflow: hidden; font-size: 13px; line-height: 1.4; color: ${T.ink2}; background: linear-gradient(${T.err}, ${T.err}) no-repeat left center / 100% 2px; animation: fp-chiz .5s ease-out both, fp-eski 1.5s ease-in .4s both; }
        .fp-bo-eski.kor { animation: fp-chiz .5s ease-out both; opacity: .75; }
        .fp-bo-uz { margin-left: 8px; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .fp-pufak { align-self: flex-start; font-size: 13px; font-weight: 600; line-height: 1.35; border-radius: 12px 12px 12px 4px; padding: 4px 10px; animation: fp-kir .35s ease-out both; }
        .fp-pufak.xato { color: ${T.err}; background: ${T.errFon}; }
        .fp-pufak.hakam { color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; }
        .fp-bo.joriy { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.12)}; }
        .fp-bo.xato { border-color: ${T.err}; }
        .fp-bo.xato .fp-bo-b { color: ${T.err}; }
        .fp-bo.qollandi .fp-bo-y { color: ${T.ok}; background: ${T.okFon}; }
        .fp-bo.qollandi.yangi { animation: fp-pop .5s ease-out; }
        .fp-bo.nomi { padding: 4px 10px; }
        .fp-sahna.katta .fp-bo-h b { font-size: 15px; }
        .fp-sahna.katta .fp-bo-t { font-size: 15px; }
        /* Taymer chizig'i (reja) + savol-javob bo'lagi */
        .fp-tm { display: flex; align-items: flex-start; gap: 10px; }
        .fp-tm-ch { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .fp-tm-chiziq { display: flex; gap: 3px; align-items: flex-start; }
        .fp-tm-reja { flex: none; align-self: flex-start; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 0 7px; line-height: 12px; height: 12px; }
        .fp-tm-bo { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .fp-tm-t { display: block; height: 12px; border-radius: 4px; background: ${T.bg}; border: 1px solid ${T.line}; overflow: hidden; }
        .fp-tm-t > i { display: block; height: 100%; background: ${T.accent}; transform-origin: left; transform: scaleX(0); transition: transform .25s linear; }
        .fp-tm-bo.jor .fp-tm-t { border-color: ${T.accent}; box-shadow: 0 0 0 2px ${fon(T.accent, 0.18)}; }
        .fp-tm-bo em { display: flex; flex-direction: column; font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; text-align: center; line-height: 1.25; }
        .fp-tm-bo em small { font-size: 11px; font-weight: 600; }
        .fp-tm-bo.jor em { color: ${T.accent}; }
        .fp-tm-ortiq { display: flex; flex-direction: column; gap: 4px; min-width: 44px; }
        .fp-tm-ortiq .fp-tm-t { border-color: ${T.err}; }
        .fp-tm-ortiq .fp-tm-t > i { background: ${T.err}; transform: scaleX(1); }
        .fp-tm-ortiq em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.err}; white-space: nowrap; }
        .fp-tm-chet { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .fp-tm-chet b { color: ${T.ink}; font-size: 13px; }
        .fp-sj { flex: none; display: flex; flex-direction: column; gap: 5px; padding: 6px 8px; border-radius: 10px; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1px ${fon(T.accent, 0.35)}; }
        .fp-sj-y { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .fp-sj-hk { display: inline-flex; align-items: center; gap: 4px; color: ${T.ink}; animation: fp-kir .4s ease-out both; }
        .fp-sj-hk svg { width: 16px; height: 16px; color: ${T.accent}; }
        .fp-sj-kat { display: flex; gap: 5px; }
        .fp-kat { position: relative; display: flex; flex-direction: column; gap: 3px; min-width: 46px; padding: 4px 6px; border-radius: 8px; background: ${T.paper}; border: 1.5px dashed ${T.line}; transition: border-color .3s, background .3s; }
        .fp-kat > b { display: inline-flex; align-items: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.ink2}; white-space: nowrap; }
        .fp-kat-t { display: block; height: 4px; border-radius: 2px; background: ${T.bg}; overflow: hidden; }
        .fp-kat-t > i { display: block; height: 100%; background: ${T.accent}; transform-origin: left; transition: transform .25s linear; }
        .fp-kat.bosh { border-style: dashed; }
        .fp-kat.joriy { border-style: solid; border-color: ${T.accent}; }
        .fp-kat.joriy > b { color: ${T.accent}; }
        .fp-kat.ok { border-style: solid; border-color: ${T.ok}; background: ${T.okFon}; }
        .fp-kat.ok > b { color: ${T.ok}; }
        .fp-kat.ok .fp-kat-t > i { background: ${T.ok}; }
        .fp-kat.oshgan { border-style: solid; border-color: ${T.ink2}; }
        .fp-kat.oshgan .fp-kat-t > i { background: ${T.ink2}; }
        .fp-kat.yangi { animation: fp-pop .45s ease-out; }
        .fp-kat em { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink}; line-height: 1.3; }
        .fp-kat-m { font-size: 13px; line-height: 1.4; color: ${T.ink}; }
        .fp-soat { width: 11px; height: 11px; border-radius: 50%; border: 2px solid ${T.accent}; border-top-color: transparent; animation: fp-soat .9s ease-in-out 1 both; }
        .fp-sj.katta { padding: 10px 12px; gap: 8px; }
        .fp-sj.katta .fp-sj-y { font-size: 13px; }
        .fp-sj.katta .fp-sj-kat { gap: 8px; }
        .fp-sj.katta .fp-kat { flex: 1; min-width: 0; padding: 8px 10px; min-height: 54px; }
        .fp-sj.katta .fp-kat > b { font-size: 14px; }
        .fp-sj.katta .fp-kat em { font-size: 14px; }
        @media (max-width: 640px) { .fp-sahna { grid-template-columns: minmax(0,1fr); } .fp-sahna-tel { justify-self: center; } .fp-tm { flex-direction: column; align-items: stretch; } .fp-tm-bo em { display: none; } .fp-bo { flex-direction: column; gap: 2px; } .fp-bo-h { min-width: 0; } }
        /* Reja */
        .fp-reja { display: flex; flex-direction: column; gap: 12px; }
        .fp-reja-teg { align-self: flex-start; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 6px 10px; }
        .fp-skelet { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; }
        .fp-skelet-b { padding: 7px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-size: 13px; font-weight: 700; text-align: center; animation: fp-toq .5s ease-out both; }
        /* 2-ekran: javob kartalari juft */
        .fp-juft { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
        button.fp-jk { text-align: left; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 600; line-height: 1.45; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 12px 14px; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.25); transition: opacity .3s, border-color .2s, background .2s; animation: fp-kartakir .4s ease-out both; }
        button.fp-jk.cur { border-color: ${fon(T.accent, 0.6)}; animation: fp-kartakir .4s ease-out both, fp-chorla 1.8s ease-out .5s 2; }
        button.fp-jk.cur:nth-child(2) { animation-delay: 0s, .9s; }
        button.fp-jk:hover:not(:disabled) { border-color: ${T.accent}; }
        button.fp-jk:disabled { cursor: default; }
        button.fp-jk.silk { border-color: ${T.err}; background: ${T.errFon}; animation: q-silk .35s ease-in-out 2; }
        button.fp-jk.jo { opacity: .25; }
        .fp-uchar { position: fixed; z-index: 1300; pointer-events: none; display: flex; align-items: center; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 2px solid ${T.ink2}; box-shadow: 0 18px 36px -14px ${fon(T.ink, 0.35)}; font-size: 14px; font-weight: 600; line-height: 1.4; color: ${T.ink}; transform-origin: center; transition: transform .6s cubic-bezier(.45,.05,.3,1), opacity .6s ease-in; overflow: hidden; }
        .fp-uchar.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .fp-uchar.bor { opacity: .35; }
        /* Test vizuali */
        .fp-test-viz { margin-top: 2px; }
        .fp-mini { display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px 13px; animation: fp-kir .35s ease-out both; }
        .fp-mini-h { font-size: 13px; color: ${T.ink2}; }
        .fp-mini-h b { color: ${T.ink}; font-weight: 800; }
        .fp-mini-yangi { font-size: 14px; line-height: 1.45; color: ${T.ink}; animation: fp-sirg .5s ease-out .4s both; }
        .fp-mini-tm { display: flex; align-items: center; gap: 10px; }
        .fp-mini-ulush { width: 90px; height: 10px; border-radius: 4px; background: ${T.bg}; border: 1px solid ${T.line}; overflow: hidden; }
        .fp-mini-ulush i { display: block; width: 100%; height: 100%; background: ${fon(T.accent, 0.55)}; }
        .fp-mini-tm em { font-style: normal; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        /* Mustaqil ish: strip · karta · maydon */
        .q-mustaqil:has(.fp-karta), .q-mustaqil:has(.fp-fokus), .q-mustaqil:has(.fp-s7) { max-width: none; }
        .fp-strip { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .fp-strip-y { font-size: 12px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 5px 11px; margin-right: 4px; white-space: nowrap; }
        .fp-strip .q-chip.fp-tab { padding: 6px 10px; font-size: 12.5px; }
        .fp-strip .q-chip.fp-tab i { font-style: normal; font-weight: 800; margin-right: 6px; color: ${T.accent}; }
        .fp-strip .q-chip.fp-tab.ok i { color: ${T.ok}; }
        .fp-strip .q-chip.fp-tab small { margin-left: 6px; font-size: 11px; font-weight: 700; }
        .fp-strip .q-chip.fp-tab.keyin small { color: ${T.ink2}; }
        .fp-strip .q-chip.fp-tab.yangi { animation: fp-pop .5s ease-out, fp-yashil 1.1s ease-out; }
        .fp-strip-s { display: inline-flex; align-items: center; gap: 5px; max-width: 260px; font-size: 12px; font-weight: 600; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 8px; padding: 4px 9px; }
        .fp-strip-s > i { font-style: normal; font-weight: 800; color: ${T.accent}; }
        .fp-strip-s.ok { color: ${T.ok}; border-color: ${fon(T.ok, 0.5)}; }
        .fp-strip-s.ok > i { color: ${T.ok}; }
        .fp-art { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; margin-left: auto; white-space: nowrap; }
        .q-chip.fp-tg { font-size: 13.5px; }
        .fp-tanlov { display: flex; flex-direction: column; gap: 8px; }
        .fp-tanlov-c, .fp-rejim, .fp-bank { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .fp-bank.mentor { flex-direction: column; align-items: stretch; }
        .fp-bank-s { font-size: 15px; font-weight: 600; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 12px; }
        .fp-karta { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 10px; animation: fp-kartakir .4s ease-out both; }
        .fp-karta.uch { animation: fp-uch .38s ease-in both; }
        .fp-karta.err { box-shadow: inset 0 0 0 1.5px ${T.err}, 0 10px 26px -10px rgba(${T.shadowBase},0.22); }
        .fp-karta-bosh { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .fp-karta-h { font-size: 18px; font-weight: 800; color: ${T.ink}; }
        .fp-savol { font-size: 19px; font-weight: 800; line-height: 1.35; color: ${T.ink}; }
        .fp-maydon { position: relative; }
        .fp-maydon-n { position: absolute; left: 12px; top: 9px; font-style: normal; font-weight: 800; font-size: 11.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 6px; padding: 1px 8px; pointer-events: none; }
        textarea.fp-inp, input.fp-inp { display: block; width: 100%; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.5; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 12px; outline: none; }
        textarea.fp-inp { resize: vertical; min-height: 96px; padding: 32px 14px 26px; }
        input.fp-inp { padding: 30px 14px 9px; }
        .fp-inp:focus { border-color: ${T.accent}; }
        .fp-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        .fp-maydon.chorla .fp-inp { border-color: ${fon(T.accent, 0.6)}; animation: fp-chorla 1.8s ease-out .4s 2; }
        .fp-sanoq-b { position: absolute; right: 12px; bottom: 8px; display: inline-flex; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; }
        .fp-sanoq-b em { font-style: normal; color: ${T.ink2}; }
        .fp-sanoq-b.uzaydi { color: ${T.accent}; font-weight: 800; }
        .fp-sanoq-b.oshdi { color: ${T.err}; font-weight: 800; }
        .fp-yordam { background: ${T.bg}; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
        .fp-yordam p { margin: 0; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .fp-yordam p:last-child { font-size: 12.5px; color: ${T.ink2}; }
        .fp-karta-tug, .fp-tg-q { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .fp-karta-tug .fp-o { margin-left: auto; }
        .fp-fokus { display: flex; flex-direction: column; gap: 10px; }
        .fp-mt { display: flex; flex-direction: column; gap: 8px; }
        .fp-mt-q { display: flex; flex-direction: column; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px 14px; }
        .fp-mt-q b { font-size: 14px; font-weight: 800; }
        .fp-mt-yangi { font-size: 15px; line-height: 1.45; color: ${T.ink}; }
        /* 6-ekran */
        .fp-oldin { display: flex; flex-direction: column; gap: 4px; background: ${T.bg}; border-radius: 12px; padding: 10px 14px; }
        .fp-oldin-y { font-size: 12px; font-weight: 800; color: ${T.ink}; }
        .fp-oldin p { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        .fp-vaqt { font-size: 14px; font-weight: 700; color: ${T.ink}; }
        .fp-vaqt b { font-family: 'JetBrains Mono', monospace; color: ${T.ok}; }
        .fp-vaqt b.oshdi { color: ${T.err}; }
        .fp-oldingi { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        /* 7-ekran */
        .fp-s7 { display: grid; grid-template-columns: minmax(0,1.25fr) minmax(0,1fr); gap: 18px; align-items: start; }
        .fp-s7-ch { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .fp-ochish { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); }
        .fp-1d { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; min-width: 76px; }
        .fp-1d.yur { color: ${T.accent}; }
        .fp-1d.oshdi { color: ${T.err}; }
        .fp-maydon.kichik input.fp-inp { font-size: 14px; }
        .fp-javoblar { display: flex; flex-direction: column; gap: 6px; }
        .fp-jv { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.4fr) auto; gap: 12px; align-items: baseline; background: ${T.okFon}; border: 1.5px solid ${fon(T.ok, 0.5)}; border-radius: 11px; padding: 7px 12px; }
        .fp-jv.oshgan { background: ${T.paper}; border-color: ${T.line}; }
        .fp-jv b { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .fp-jv span { font-size: 15px; line-height: 1.4; color: ${T.ink}; }
        .fp-jv-tk { display: block; margin-top: 2px; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .fp-jv em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        @media (max-width: 760px) { .fp-s7 { grid-template-columns: 1fr; } .fp-s7 > .zoomable { order: -1; } .fp-juft { grid-template-columns: 1fr; } .fp-jv { grid-template-columns: 1fr; gap: 3px; } .fp-hk { padding: 8px 12px; gap: 10px; } .fp-hk-s { font-size: 14px; } .fp-skelet { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        /* Kartochka: birinchi bosishgacha yengil halqa va ipucha (SABOQ 16, E 49); orqa yuz neytral to'q (P10) */
        .fp-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: fp-puls 1.8s ease-out .4s 3; }
        .fp-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .fp-flash .fc-front { box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        p.fp-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        p.fp-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* Yakun: ✓ faqat to'liq holatda; uyga vazifa kartasi */
        .fp-yakun.belgisiz .done-chip .tick { display: none; }
        .fp-hw { display: flex; flex-direction: column; gap: 12px; }
        .fp-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .fp-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .fp-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .fp-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.fp-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .fp-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .fp-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .fp-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        @media (max-width: 560px) { .fp-hw-karta { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) {
          .fp-halqa, .fp-k.kutish .q-variant, .q-bashorat .q-chip, .q-chip.chorla, .fp-qadamlar .q-chip, .fp-hk, .fp-hk-s, .fp-hk-s > i, .fp-hk-javob, .fp-bo, .fp-bo-y, .fp-bo-b, .fp-bo-t.yangi, .fp-pufak, .fp-tel-son,
          .fp-skelet-b, button.fp-jk, .fp-kat, .fp-soat, .fp-mini, .fp-mini-yangi, .fp-strip .q-chip, .fp-karta, .fp-maydon.chorla .fp-inp, .fp-flash .fc-front, .fp-sj-hk { animation: none !important; transition: none !important; }
          .fp-tm-t > i, .fp-kat-t > i { transition: none !important; }
          .fp-bo-eski { animation: none !important; display: none; }
          .fp-bo-eski.kor { display: block; }
          .fp-skelet-b { color: ${T.ink}; }
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
