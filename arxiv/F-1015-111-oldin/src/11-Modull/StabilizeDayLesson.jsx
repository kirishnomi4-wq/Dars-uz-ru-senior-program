import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul 12-dars «Loyiha kuni: barqarorlashtirish» — skeletdan (08.10.2026, 2-to'lqin); MD: feedback/F-1007-13modul/12-StabilizeDay-v3.md
// Skeletdan qurildi (08.10.2026, C-to'lqin): 12 ekran — s0 QKirish · s1 QReja · s2 QTushuncha (besh tekshiruv) · a1 blok · s4 test (C) · s5 QTushuncha (faqat topilma) ·
//   a2 blok · s7 test (A) · a3 blok · podium · QKartochka · QYakun (sakkiz holat). Bitta vizual — «yo'l sahnasi» (YOL_SAHNA + YOLLAR + MENTOR_TEKSHIRUV); dars holati `dars` (ccProgress).
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

const LESSON_META = { lessonId: 'm11-12-v1', lessonTitle: { uz: 'Loyiha kuni: barqarorlashtirish', ru: 'День проекта: стабилизация' } };
// 12 ekran (MD v3): kirish → reja → tushuncha (besh tekshiruv) → 1-amaliyot → 1-savol → tushuncha (faqat topilma) → 2-amaliyot → 2-savol → 3-amaliyot → podium → kartochkalar → yakun.
// Uyga vazifa yo'q (loyiha kuni) — HwCard va HW_TOKENS yo'q.
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
    if (deskOld.current === deskSignal) return undefined;
    deskOld.current = deskSignal;
    if (!deskSignal || isNarrow) return undefined;
    const el = contentRef.current;
    if (!el) return undefined;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => { if (el && el.scrollHeight > el.clientHeight + 1) el.scrollTo({ top: el.scrollHeight, behavior: kam ? 'auto' : 'smooth' }); }, 320);
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Final tartib-mashqi yo'q (loyiha kuni, 172). `practice: -1` — sentinel (uch blok).
// ⚠️ To'g'ri javob O'RNI (MD ✔) qurilgandan keyin o'zgarmaydi: s4 — C (2), s7 — A (0).
const INLINE_KEYS = { s4: 2, s7: 0, practice: -1 };
// 📖 RECAPS — har ballik testga 3 karta (kalit = ekran INDEKSI); «Sinfga savol» — oxirgi karta ostida
const RECAPS = {
  4: {
    title: { uz: "Belgi ko'rilgan narsani aytadi", ru: 'Метка говорит о том, что увидели' },
    cards: [
      { ic: null, h: { uz: '1 · Buzildi', ru: '1 · Сломалось' }, body: { uz: "Yo'l bor, kutilgani bo'lmadi.", ru: 'Путь есть, ожидаемое не произошло.' } },
      { ic: null, h: { uz: '2 · Buzilmadi', ru: '2 · Не сломалось' }, body: { uz: "Yo'l bor, kutilgani bo'ldi.", ru: 'Путь есть, ожидаемое произошло.' } },
      { ic: null, h: { uz: "3 · Mahsulotimda hali yo'q", ru: '3 · В моём продукте пока нет' }, body: { uz: <>Yo'l tekshirilmadi.<span className="sb-rc-savol">Sinfga savol: Bo'sh qolgan karta yozuvda nimani yashiradi?</span></>, ru: <>Путь не проверен.<span className="sb-rc-savol">Вопрос классу: что скрывает пустая карточка в записи?</span></> } }
    ]
  },
  7: {
    title: { uz: 'Bugun faqat tuzatish', ru: 'Сегодня только исправление' },
    cards: [
      { ic: null, h: { uz: '1', ru: '1' }, body: { uz: "O'zgarish yozuvdagi topilmaga bog'lanadi — bugun qilinadi.", ru: 'Изменение связано с находкой из записи — делается сегодня.' } },
      { ic: null, h: { uz: '2', ru: '2' }, body: { uz: "Topilmaga bog'lanmasa — yangi funksiya: bugun qo'shilmaydi.", ru: 'Не связано с находкой — новая функция: сегодня не добавляется.' } },
      { ic: null, h: { uz: '3', ru: '3' }, body: { uz: <>Ulgurmagan topilma — <code className="qcode">XATOLAR.md</code> da «qoldi», sababi bilan.<span className="sb-rc-savol">Sinfga savol: Agent «yana bir qulaylik qo'shay» desa, nima deysiz?</span></>, ru: <>Неуспетая находка — в <code className="qcode">XATOLAR.md</code> «осталось», с причиной.<span className="sb-rc-savol">Вопрос классу: что вы скажете, если агент предложит «добавить ещё одно удобство»?</span></> } }
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

// ===== BITTA VIZUAL — «yo'l sahnasi» (163/180): bitta manba YOL_SAHNA + YOLLAR + MENTOR_TEKSHIRUV + AGENT_TAKLIF + MENTOR_XATOLAR + BELGILAR =====
// Chapda telefon «1-telefon · siz» (170×272, o'lcham barqaror — SABOQ 22; yorliq ramka ustida — SABOQ 23), kerak bo'lsa kichik ikkinchi telefon va bir qatorli Neon kartasi;
// o'ngda bitta karta — buzish yozuvi · agent chati · `XATOLAR.md` fayl kartasi. Karta maydoni (raqam, muddat, CVV) hech bir kadrda chizilmaydi. Logotip va emoji yo'q (D4).
// qolip-maket: sb-och sb-korish sb-belgi sb-taklif sb-tanla sb-qayta sb-trek sb-nusxa sb-yz-chip sb-tuz sb-mobil sb-navbat sb-ai-btn sb-halqa on ok err
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const halqa = (on) => (on ? 'sb-halqa' : undefined);
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Sahna qadamlari ketma-ket: [[kechikish ms, fn], …]; ekran yopilsa taymerlar tozalanadi; reduced-motion — kechikishsiz (DE-200)
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
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };
const nusxala = async (matn) => { try { await navigator.clipboard.writeText(matn); return true; } catch { return false; } };

// «Maydon Jamoa» — 11-Modul 9.62 yashili; mashq sahifasi — Payme ko'rinishi (SABOQ P6), Telegram — o'z rangida (logotipsiz)
const MAYDON_RANG = '#2E9E4F';
const PAYME_RANG = '#00B5B5';
const TELEGRAM_RANG = '#229ED9';
const AGENT = 'Antigravity';
const TEL_YORLIQ = { uz: '1-telefon · siz', ru: '1-й телефон · вы' };
const TEL2_YORLIQ = { uz: '2-telefon · tekshiruv akkaunti', ru: '2-й телефон · тестовый аккаунт' };

// Besh yo'l (tayanch 1.12) — kalit barqaror; «Nima qilaman» — 1-amaliyotda oldindan yoziladi (tahrirlanadi)
const YOLLAR = [
  { k: 'kirish', nom: { uz: "Kirish va ro'yxat", ru: 'Вход и регистрация' },
    darslar: { uz: "12-Modul 7-dars (login) · 10-dars («Taklif kodi (bo'lsa)»)", ru: '12-й модуль, урок 7 (логин) · урок 10 («Taklif kodi (bo\'lsa)»)' },
    qilaman: { uz: "Yangi tekshiruv akkaunti bilan ro'yxatdan o'taman, hisobdan chiqaman va qayta kiraman.", ru: 'Регистрируюсь с новым тестовым аккаунтом, выхожу из аккаунта и вхожу снова.' } },
  { k: 'harakat', nom: { uz: 'Asosiy harakat', ru: 'Основное действие' },
    darslar: { uz: "11-Modul · 4-dars («Har hafta takrorlansin»)", ru: '11-й модуль · урок 4 («Har hafta takrorlansin»)' },
    qilaman: { uz: "Tekshiruv akkauntidan asosiy ishni qilaman; boshqa hisob uni ko'radi va o'z harakatini qiladi.", ru: 'С тестового аккаунта делаю основное дело; другой аккаунт видит его и делает своё действие.' } },
  { k: 'tolov', nom: { uz: "To'lov oqimi", ru: 'Поток оплаты' },
    darslar: { uz: "3, 4, 5-darslar · 10-dars (mukofot — Pro'ga 7 kun)", ru: 'Уроки 3, 4, 5 · урок 10 (награда — 7 дней Pro)' },
    qilaman: { uz: "Pullik qulaylikdan to'lov taklifi ekraniga, undan mashq to'lovga o'taman: avval «Rad etish (mashq)», keyin yana «To'lovga o'tish» va «Ikki marta yuborish».", ru: 'Из платной возможности перехожу на экран предложения оплаты, оттуда в учебную оплату: сначала «Rad etish (mashq)», потом снова «To\'lovga o\'tish» и «Ikki marta yuborish».' } },
  { k: 'taklif', nom: { uz: 'Taklif havolasi', ru: 'Пригласительная ссылка' },
    darslar: { uz: "10-dars (taklif kodi; ilovada kod qo'lda yoziladi)", ru: 'Урок 10 (код приглашения; в приложении код вводится вручную)' },
    qilaman: { uz: "Taklif havolamni ochaman; ikki yangi tekshiruv akkaunti bilan ro'yxatdan o'tib, kodni qo'lda yozaman: birida katta, birida kichik harf bilan.", ru: 'Открываю свою пригласительную ссылку; регистрирую два новых тестовых аккаунта и ввожу код вручную: в одном заглавными, в другом строчными.' } },
  { k: 'xabar', nom: { uz: 'Eslatma yoki Telegram xabari', ru: 'Напоминание или сообщение Telegram' },
    darslar: { uz: "12-Modul 4, 9-darslar (eslatma) · 4-dars («Doimiy o'yin» — keyingi o'yin «O'yinlar» so'ralganda) · 8-dars (Telegram xabari)", ru: '12-й модуль, уроки 4, 9 (напоминание) · урок 4 («Doimiy o\'yin» — следующая игра при запросе «O\'yinlar») · урок 8 (сообщение Telegram)' },
    qilaman: { uz: "Xabar chiqadigan holatni tekshiruv akkauntida yuzaga keltiraman va xabar necha marta kelganini sanayman; keyin shuni ikki qurilmada bir vaqtda qaytaraman. Vaqtni kerak bo'lsa agent suradi.", ru: 'Создаю на тестовом аккаунте ситуацию, когда приходит сообщение, и считаю, сколько раз оно пришло; потом повторяю это одновременно на двух устройствах. Время при необходимости сдвигает агент.' } }
];
// Mentorning besh tekshiruv yozuvi (MD A-4 jadvali, aynan; ⛔ «qur» pilotida haqiqiy natija bilan solishtiriladi)
const MENTOR_TEKSHIRUV = [
  { qildim: { uz: "Yangi tekshiruv akkaunti bilan ro'yxatdan o'tdim, hisobdan chiqib qayta kirdim; keyin shu loginni boshqa ro'yxatda yozib ko'rdim.", ru: 'Зарегистрировался с новым тестовым аккаунтом, вышел и вошёл снова; потом попробовал этот логин в другой регистрации.' },
    kutdim: { uz: "Kirgach «O'yinlar» ochiladi; band loginda «Bu login band» chiqadi.", ru: 'После входа открываются «O\'yinlar»; на занятом логине — «Bu login band».' },
    boldi: { uz: "Kirgach «O'yinlar» ochildi; band loginda «Bu login band» chiqdi.", ru: 'После входа открылись «O\'yinlar»; на занятом логине вышло «Bu login band».' }, belgi: 'buzilmadi' },
  { qildim: { uz: "Tekshiruv akkauntidan yangi o'yin e'lon qildim; ikkinchi telefonda boshqa tekshiruv akkaunti bilan «Shanba, 18:00» ga qo'shildim, keyin o'yindan chiqdim.", ru: 'С тестового аккаунта объявил новую игру; на втором телефоне другим тестовым аккаунтом присоединился к «Shanba, 18:00», потом вышел из игры.' },
    kutdim: { uz: "Yangi o'yin «O'yinlar» da chiqadi; qo'shilganda «9 / 10», chiqqanda yana «8 / 10» — ikkala telefonda.", ru: 'Новая игра появляется в «O\'yinlar»; при присоединении «9 / 10», при выходе снова «8 / 10» — на обоих телефонах.' },
    boldi: { uz: "Yangi o'yin chiqdi; «9 / 10», keyin «8 / 10» — ikkala telefonda.", ru: 'Новая игра появилась; «9 / 10», потом «8 / 10» — на обоих телефонах.' }, belgi: 'buzilmadi' },
  { qildim: { uz: "Tekshiruv akkauntida «Har hafta takrorlansin» ni bosib, to'lov taklifi ekranidan mashq to'lovga o'tdim: avval «Rad etish (mashq)», keyin yana «To'lovga o'tish» va «Ikki marta yuborish».", ru: 'На тестовом аккаунте нажал «Har hafta takrorlansin» и с экрана предложения оплаты перешёл в учебную оплату: сначала «Rad etish (mashq)», потом снова «To\'lovga o\'tish» и «Ikki marta yuborish».' },
    kutdim: { uz: "Rad etishda «To'lov o'tmadi — qayta urinib ko'ring», Pro yo'q; ikki marta yuborishda Pro 30 kunga bir marta yoqiladi.", ru: 'При отказе — «To\'lov o\'tmadi — qayta urinib ko\'ring», Pro нет; при двойной отправке Pro включается на 30 дней один раз.' },
    boldi: { uz: "Rad etishda «To'lov o'tmadi — qayta urinib ko'ring», Pro yo'q; ikki marta yuborishda Pro 30 kunga yoqildi, `tolovlar` da bitta «tolandi» qatori.", ru: 'При отказе — «To\'lov o\'tmadi — qayta urinib ko\'ring», Pro нет; при двойной отправке Pro включился на 30 дней, в `tolovlar` одна строка «tolandi».' }, belgi: 'buzilmadi' },
  { qildim: { uz: "Taklif havolamni ikkinchi telefonda ochdim — lendingda «Taklif kodi: AB12CD». Ikki yangi tekshiruv akkaunti bilan ro'yxatdan o'tdim: birida kodni «AB12CD», ikkinchisida «ab12cd» deb yozdim.", ru: 'Открыл свою пригласительную ссылку на втором телефоне — на лендинге «Taklif kodi: AB12CD». Зарегистрировал два новых тестовых аккаунта: в одном ввёл код «AB12CD», во втором «ab12cd».' },
    kutdim: { uz: "Ikkala hisobda ham taklif qilgan odam yoziladi (Neon'da `taklif_qilgan_id`).", ru: 'В обоих аккаунтах записывается пригласивший (в Neon — `taklif_qilgan_id`).' },
    boldi: { uz: 'Ikkala hisobda ham taklif qilgan odam yozildi.', ru: 'В обоих аккаунтах пригласивший записан.' }, belgi: 'buzilmadi' },
  { qildim: { uz: "Tekshiruv akkauntida «Doimiy o'yin» e'lon qildim; Telegram'i ulangan boshqa tekshiruv akkaunti unga qo'shildi. Agent o'yin vaqtini o'tgan haftaga qo'ydi; men ikki telefonda «O'yinlar» ni bir vaqtda ochdim.", ru: 'На тестовом аккаунте объявил «Doimiy o\'yin»; к ней присоединился другой тестовый аккаунт с подключённым Telegram. Агент поставил время игры на прошлую неделю; я одновременно открыл «O\'yinlar» на двух телефонах.' },
    kutdim: { uz: "Keyingi hafta o'yini bitta yaratiladi, Telegram xabari bitta keladi.", ru: 'Игра следующей недели создаётся одна, сообщение Telegram приходит одно.' },
    boldi: { uz: "Keyingi hafta o'yini ikki marta yaratildi; Telegram'ga «… yana e'lon qilindi» xabari ikki marta keldi.", ru: 'Игра следующей недели создана дважды; в Telegram сообщение «… yana e\'lon qilindi» пришло дважды.' }, belgi: 'buzildi', keyin: true }
];
// Belgilar va ularning rangi (MD A-12: faqat holat foni — D3)
const BELGI = {
  buzildi: { t: { uz: 'Buzildi', ru: 'Сломалось' }, q: { uz: 'buzildi', ru: 'сломалось' }, c: 'err' },
  buzilmadi: { t: { uz: 'Buzilmadi', ru: 'Не сломалось' }, q: { uz: 'buzilmadi', ru: 'не сломалось' }, c: 'kul' },
  yoq: { t: { uz: "Mahsulotimda hali yo'q", ru: 'В моём продукте пока нет' }, q: { uz: "hali yo'q", ru: 'пока нет' }, c: 'yoq' },
  tuz: { t: { uz: 'Tuzatish qilindi', ru: 'Исправление сделано' }, q: { uz: 'Tuzatish qilindi', ru: 'Исправление сделано' }, c: 'acc' },
  takrorlanmadi: { t: { uz: 'Qayta tekshiruvda takrorlanmadi', ru: 'При перепроверке не повторилось' }, q: { uz: 'qayta tekshiruvda takrorlanmadi', ru: 'при перепроверке не повторилось' }, c: 'ok' },
  takrorlandi: { t: { uz: 'Qayta tekshiruvda yana buzildi', ru: 'При перепроверке снова сломалось' }, q: { uz: 'qayta tekshiruvda yana buzildi', ru: 'при перепроверке снова сломалось' }, c: 'err' },
  qoldi: { t: { uz: 'qoldi', ru: 'осталось' }, q: { uz: 'qoldi', ru: 'осталось' }, c: 'kul' }
};
const BelgiY = ({ b, katta }) => (b ? <em className={cx('sb-bb', BELGI[b].c, katta && 'katta')}>{tr(katta ? BELGI[b].t : BELGI[b].q)}</em> : <em className="sb-bb bosh" aria-hidden="true" />);
// Agentning to'rt taklifi (5-ekran; aynan, shu tartibda)
const AGENT_TAKLIF = [
  { matn: { uz: "O'yinlar ro'yxatiga qidiruv qatori qo'shaman.", ru: 'Добавлю строку поиска в список игр.' }, tur: 'yangi', topilma: null },
  { matn: { uz: "Ro'yxatdan o'tish ekraniga yangi dizayn beraman.", ru: 'Сделаю новый дизайн экрана регистрации.' }, tur: 'yangi', topilma: null },
  { matn: { uz: "Bir sanaga keyingi o'yin ikki marta yaratilmasligi uchun Database'da cheklov qo'yaman.", ru: 'Поставлю ограничение в Database, чтобы следующая игра на одну дату не создавалась дважды.' }, tur: 'tuzatish', topilma: 5 },
  { matn: { uz: "Pro tugashidan oldin tashkilotchiga Telegram xabari yuboraman.", ru: 'Перед окончанием Pro отправлю организатору сообщение в Telegram.' }, tur: 'yangi', topilma: null }
];
// `XATOLAR.md` — Mentor misoli (fayl matni aynan)
const MENTOR_XATOLAR = [
  { k: 'h1', t: '# XATOLAR' },
  { k: 'p', t: { uz: "Barqarorlik tekshiruvi: besh yo'l, buzish yozuvi bilan.", ru: 'Проверка стабильности: пять путей, с записью поломки.' } },
  { k: 'h2', t: { uz: "## Telegram xabari — keyingi «Doimiy o'yin» ikki marta", ru: '## Сообщение Telegram — следующая «Doimiy o\'yin» дважды' } },
  { k: 'li', t: { uz: "- Usul: tekshiruv akkauntidagi «Doimiy o'yin» vaqti o'tgan haftaga qo'yildi; ikki telefonda «O'yinlar» bir vaqtda ochildi.", ru: '- Способ: время «Doimiy o\'yin» на тестовом аккаунте поставлено на прошлую неделю; «O\'yinlar» открыты одновременно на двух телефонах.' } },
  { k: 'li', t: { uz: "- Natija: kutdim — keyingi o'yin bitta, Telegram xabari bitta; bo'ldi — o'yin ikki marta yaratildi, xabar ikki marta keldi.", ru: '- Результат: ожидал — следующая игра одна, сообщение одно; получилось — игра создана дважды, сообщение пришло дважды.' } },
  { k: 'li', t: { uz: '- Holat: Tuzatish qilindi · qayta tekshiruvda takrorlanmadi.', ru: '- Состояние: Исправление сделано · при перепроверке не повторилось.' } },
  { k: 'p', t: { uz: "Buzilmagan yo'llar: kirish va ro'yxat · asosiy harakat · to'lov oqimi · taklif havolasi.", ru: 'Несломанные пути: вход и регистрация · основное действие · поток оплаты · пригласительная ссылка.' } },
  { k: 'p', t: { uz: "Tekshirilmagan yo'llar: yo'q.", ru: 'Непроверенные пути: нет.' } }
];
// Telefon ekranlari — matnlar (tayanch 1.4, 1.8, 1.10, 9.1; 12-Modul 1.7)
const ILOVA = {
  oyinlar: { uz: "O'yinlar", ru: 'Игры' },
  shanba: { uz: 'Shanba, 18:00 · Mahalla maydoni', ru: 'Суббота, 18:00 · Махаллинское поле' },
  juma: { uz: 'Juma, 18:00 · Mahalla maydoni', ru: 'Пятница, 18:00 · Махаллинское поле' },
  royxat: { uz: "Ro'yxatdan o'tish", ru: 'Регистрация' },
  kirish: { uz: 'Kirish', ru: 'Вход' },
  ism: { uz: 'Ism', ru: 'Имя' }, login: { uz: 'Login', ru: 'Логин' }, parol: { uz: 'Parol', ru: 'Пароль' }, kod: { uz: "Taklif kodi (bo'lsa)", ru: 'Код приглашения (если есть)' },
  band: { uz: 'Bu login band', ru: 'Этот логин занят' },
  chiqish: { uz: 'Hisobdan chiqish', ru: 'Выйти из аккаунта' },
  elon: { uz: "E'lon berish", ru: 'Объявить' },
  takrorlansin: { uz: 'Har hafta takrorlansin', ru: 'Повторять каждую неделю' },
  sarlavha: { uz: "Doimiy o'yin — Pro'da", ru: 'Постоянная игра — в Pro' },
  matn: { uz: "Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.", ru: 'Каждую неделю в тот же день и час игра объявляется сама.' },
  narx: { uz: "30 kun — 15 000 so'm", ru: '30 дней — 15 000 сумов' },
  taxmin: { uz: 'Mentorning taxmini', ru: 'Оценка Ментора' },
  otish: { uz: "To'lovga o'tish", ru: 'Перейти к оплате' },
  test: { uz: 'Test rejim: pul yechilmaydi', ru: 'Тестовый режим: деньги не списываются' },
  otmadi: { uz: "To'lov o'tmadi — qayta urinib ko'ring", ru: 'Платёж не прошёл — попробуйте ещё раз' },
  pro: { uz: 'Pro · 30 kun', ru: 'Pro · 30 дней' },
  mashq: { uz: "Mashq to'lov", ru: 'Учебная оплата' },
  mashqTest: { uz: "Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.", ru: 'Это учебная страница. Карта не запрашивается, деньги не списываются.' },
  mahsulot: { uz: "Pro, 30 kun · 15 000 so'm", ru: 'Pro, 30 дней · 15 000 сумов' },
  tolash: { uz: "To'lash (mashq)", ru: 'Оплатить (учебно)' },
  rad: { uz: 'Rad etish (mashq)', ru: 'Отклонить (учебно)' },
  ikki: { uz: 'Ikki marta yuborish', ru: 'Отправить дважды' },
  taklifKod: { uz: 'Taklif kodi: AB12CD', ru: 'Код приглашения: AB12CD' },
  xabar: { uz: "Juma, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni", ru: 'Игра в пятницу, 18:00 снова объявлена · Махаллинское поле' },
  ochish: { uz: 'Ilovani ochish', ru: 'Открыть приложение' }
};
// Telefon ekrani — yo'l kadri (e): yopiq · oyinlar · royxat · kirish · elon · tolovEkran · mashq · otmadi · pro · lending · telegram
const OyinK = ({ t, n, sinf }) => <span className={cx('sb-oyin', sinf)}><span>{tr(t)}</span><b>{n}</b></span>;
const Maydon = ({ m }) => (m ? <span className="sb-m-q"><em>{tr(m.y)}</em><b className={cx(m.err && 'err')}>{m.v || ' '}</b></span> : null);
const IlovaEkran = ({ t = {} }) => {
  const e = t.e || 'yopiq';
  const v = t.v || {};
  if (e === 'yopiq') return <div className="sb-il sb-il-yopiq"><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b></div>;
  if (e === 'lending') return (
    <div className="sb-il sb-il-lending">
      <span className="sb-br">….netlify.app</span>
      <b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b>
      <span className="sb-l-kod">{tr(ILOVA.taklifKod)}</span>
    </div>
  );
  if (e === 'telegram') return (
    <div className="sb-il sb-il-tg">
      <span className="sb-tg-bosh" style={{ background: TELEGRAM_RANG }}>Telegram · <b>Maydon Jamoa</b></span>
      <span className="sb-tg-ich">{Array.from({ length: t.son || 1 }, (_, i) => <span key={i} className={cx('sb-tg-x', i > 0 && 'takror')}>{tr(ILOVA.xabar)}</span>)}</span>
    </div>
  );
  if (e === 'mashq') return (
    <div className="sb-il sb-il-mashq">
      <div className="sb-pm-bosh" style={{ background: PAYME_RANG }}><b>Payme</b><span>{tr({ uz: 'mashq', ru: 'учебно' })}</span></div>
      <div className="sb-pm-ich">
        <span className="sb-pm-sar">{tr(ILOVA.mashq)}</span>
        <span className="sb-pm-nom"><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b> — {tr(ILOVA.mahsulot)}</span>
        <span className={cx('sb-pm-t', t.bos === 'tolash' && 'bos')} style={{ background: PAYME_RANG }}>{tr(ILOVA.tolash)}</span>
        <span className={cx('sb-pm-t ikki', t.bos === 'rad' && 'bos')}>{tr(ILOVA.rad)}</span>
        <span className={cx('sb-pm-t ikki', t.bos === 'ikki' && 'bos')}>{tr(ILOVA.ikki)}</span>
        <span className="sb-pm-test">{tr(ILOVA.mashqTest)}</span>
      </div>
    </div>
  );
  return (
    <div className="sb-il">
      <div className="sb-il-bosh"><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b>{t.pro && <em className="sb-pro">Pro</em>}</div>
      <div className="sb-il-k" key={e + (t.k || '')}>
        {e === 'oyinlar' && <>
          <span className="sb-il-sar">{tr(ILOVA.oyinlar)}</span>
          {!t.faqatJuma && <OyinK t={ILOVA.shanba} n={t.n1 || '8 / 10'} sinf={t.n1 && t.n1 !== '8 / 10' ? 'yangi' : null} />}
          {t.juma > 0 && <OyinK t={ILOVA.juma} n="0 / 10" sinf="kir" />}
          {t.juma > 1 && <OyinK t={ILOVA.juma} n="0 / 10" sinf="kir err" />}
          {t.chiqish && <span className="sb-il-tugma kul">{tr(ILOVA.chiqish)}</span>}
        </>}
        {(e === 'royxat' || e === 'kirish') && <>
          <span className="sb-il-sar">{tr(e === 'royxat' ? ILOVA.royxat : ILOVA.kirish)}</span>
          {e === 'royxat' && <Maydon m={{ y: ILOVA.ism, v: v.ism }} />}
          <Maydon m={{ y: ILOVA.login, v: v.login, err: t.band }} />
          {t.band && <span className="sb-il-xato">{tr(ILOVA.band)}</span>}
          <Maydon m={{ y: ILOVA.parol, v: v.login ? '••••••' : '' }} />
          {e === 'royxat' && <Maydon m={{ y: ILOVA.kod, v: v.kod }} />}
        </>}
        {e === 'elon' && <>
          <span className="sb-il-sar">{tr(ILOVA.elon)}</span>
          <Maydon m={{ y: { uz: 'Kun va soat', ru: 'День и время' }, v: tr({ uz: 'Juma, 18:00', ru: 'Пятница, 18:00' }) }} />
          <Maydon m={{ y: { uz: 'Joy', ru: 'Место' }, v: tr({ uz: 'Mahalla maydoni', ru: 'Махаллинское поле' }) }} />
          <span className="sb-il-tugma">{tr(ILOVA.elon)}</span>
        </>}
        {e === 'tolovEkran' && <>
          <span className="sb-il-sar">{tr(ILOVA.sarlavha)}</span>
          <span className="sb-il-matn">{tr(ILOVA.matn)}</span>
          <span className="sb-narx"><b>{tr(ILOVA.narx)}</b><em>{tr(ILOVA.taxmin)}</em></span>
          <span className="sb-il-tugma">{tr(ILOVA.otish)}</span>
          <span className="sb-il-test">{tr(ILOVA.test)}</span>
        </>}
        {e === 'otmadi' && <span className="sb-il-xabar err">{tr(ILOVA.otmadi)}</span>}
        {e === 'pro' && <>
          <span className="sb-il-sar">{tr(ILOVA.sarlavha)}</span>
          <span className="sb-il-pro">{tr(ILOVA.pro)}</span>
          <span className="sb-il-xabar ok">{tr(ILOVA.takrorlansin)} ✓</span>
        </>}
      </div>
    </div>
  );
};
const Telefon = ({ t = {}, kichik, yorliq, osti }) => (
  <div className={cx('sb-tel-ust', kichik && 'kichik')}>
    <span className="sb-tel-yorliq">{tr(yorliq || TEL_YORLIQ)}</span>
    <div className="sb-telefon"><div className="sb-tel-ekran" key={(t.e || 'yopiq') + (t.k || '')}><IlovaEkran t={t} /></div></div>
    {osti}
  </div>
);
// Bir qatorli Neon kartasi (jadval · qiymat; yashil — yozildi, qizil — kutilmagan)
const NeonQ = ({ n }) => (n ? <span key={n.j + n.k} className={cx('sb-neon fade-step', n.c)}><b>Neon</b><code>{n.j}</code><span>{tr(n.t)}</span>{n.y && <em>{tr(n.y)}</em>}</span> : null);
// Har yo'l — bir necha qisqa kadr (≈3 s; KOD 4): tel — 1-telefon, tel2 — kichik ikkinchi telefon, neon — bir qatorli karta
const YOL_SAHNA = {
  kirish: [
    { tel: { e: 'royxat', v: { ism: 'Tekshiruv', login: 'tekshiruv1' } } },
    { tel: { e: 'oyinlar', chiqish: true } },
    { tel: { e: 'kirish', v: { login: 'tekshiruv1' } } },
    { tel: { e: 'oyinlar', k: 2 } },
    { tel: { e: 'royxat', v: { ism: 'Tekshiruv', login: 'tekshiruv1' }, band: true, k: 2 } }
  ],
  harakat: [
    { tel: { e: 'elon' }, tel2: { e: 'oyinlar' } },
    { tel: { e: 'oyinlar', juma: 1 }, tel2: { e: 'oyinlar' } },
    { tel: { e: 'oyinlar', juma: 1, n1: '9 / 10' }, tel2: { e: 'oyinlar', n1: '9 / 10' } },
    { tel: { e: 'oyinlar', juma: 1, n1: '8 / 10', k: 2 }, tel2: { e: 'oyinlar', n1: '8 / 10', k: 2 } }
  ],
  tolov: [
    { tel: { e: 'tolovEkran' } },
    { tel: { e: 'mashq', bos: 'rad' } },
    { tel: { e: 'otmadi' } },
    { tel: { e: 'tolovEkran', k: 2 } },
    { tel: { e: 'mashq', bos: 'ikki', k: 2 } },
    { tel: { e: 'pro', pro: true }, neon: { j: 'tolovlar', k: 1, t: { uz: "bitta qator · «tolandi»", ru: 'одна строка · «tolandi»' }, c: 'ok' } }
  ],
  taklif: [
    { tel: { e: 'lending' } },
    { tel: { e: 'royxat', v: { ism: 'Tekshiruv', login: 'tekshiruv2', kod: 'AB12CD' } } },
    { tel: { e: 'royxat', v: { ism: 'Tekshiruv', login: 'tekshiruv2', kod: 'AB12CD' } }, neon: { j: 'taklif_qilgan_id', k: 1, t: { uz: 'yozildi', ru: 'записан' }, c: 'ok' } },
    { tel: { e: 'royxat', v: { ism: 'Tekshiruv', login: 'tekshiruv2', kod: 'AB12CD' } }, tel2: { e: 'royxat', v: { ism: 'Tekshiruv', login: 'tekshiruv3', kod: 'ab12cd' } }, neon: { j: 'taklif_qilgan_id', k: 2, t: { uz: "yozildi · «ab12cd» ham", ru: 'записан · и для «ab12cd»' }, c: 'ok' } }
  ],
  xabar: [
    { tel: { e: 'oyinlar' }, neon: { j: 'oyinlar', k: 1, t: { uz: "o'yin vaqti — o'tgan hafta", ru: 'время игры — прошлая неделя' }, y: { uz: "agent qo'ydi", ru: 'поставил агент' } } },
    { tel: { e: 'oyinlar', juma: 2, faqatJuma: true }, tel2: { e: 'oyinlar', juma: 2, faqatJuma: true }, neon: { j: 'oyinlar', k: 2, t: { uz: "Juma, 18:00 — ikki qator", ru: 'Пятница, 18:00 — две строки' }, c: 'err' } },
    { tel: { e: 'telegram', son: 2 }, tel2: { e: 'oyinlar', juma: 2, faqatJuma: true }, neon: { j: 'oyinlar', k: 2, t: { uz: "Juma, 18:00 — ikki qator", ru: 'Пятница, 18:00 — две строки' }, c: 'err' } }
  ]
};
// Sahna: chapda telefon(lar) + Neon qatori + «1 · 2 · 3 · 4 · 5» chizig'i (joriy — accent, tayyori — belgi rangida)
const YolChiziq = ({ belgilar = [], joriy }) => (
  <div className="sb-yc">{YOLLAR.map((y, i) => <span key={y.k} className={cx('sb-yc-n', i === joriy && 'joriy', belgilar[i] && BELGI[belgilar[i]].c)}>{i + 1}</span>)}</div>
);
const YolSahna = ({ kadr, belgilar, joriy }) => (
  <div className="sb-sahna">
    <div className="sb-tellar">
      <Telefon t={kadr.tel} />
      {kadr.tel2 && <Telefon kichik t={kadr.tel2} yorliq={TEL2_YORLIQ} />}
    </div>
    <NeonQ n={kadr.neon} />
    <YolChiziq belgilar={belgilar} joriy={joriy} />
  </div>
);

// ===== Umumiy yordamchilar (bashorat · xulosa · O'qituvchi eslatmasi) =====
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="sb-chorla"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="sb-bash-ix fade-step"><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosa qutisining birinchi kichik qatori; QIzoh — oxirgi kichik qatori (E 42)
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="sb-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="sb-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="sb-x-m">{matn}</span>{izoh && <span className="sb-x-iz">{izoh}</span>}</>;
const NomQator = ({ matn }) => (matn ? <p className="sb-nom fade-step">{tx(matn)}</p> : null);
// Joy so'zi haqiqiy joylashuvga mos (≤760 px da ustunlar ustma-ust): MD matni kompyuterda aynan, telefonda joy so'zi almashadi
const useTor = () => useIsMobile(761);
const Ustoz = ({ satrlar }) => (useMentorLive() ? <div className="sb-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div> : null);

// ===== SCREEN 0 — KIRISH (QKirish): uch «Tayyor!» pufagi navbat bilan → «Ilovani ochish» → «O'yinlar» → variantlar faol =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Ilova ochildi — demak, hammasi ishlaydi', ru: 'Приложение открылось — значит, всё работает' } },
  { id: 'b', label: { uz: "Muhim yo'llarni o'zim birma-bir tekshiraman", ru: 'Сам по очереди проверю важные пути' } },
  { id: 'c', label: { uz: "Agent uch marta «Tayyor!» dedi — shu yetadi", ru: 'Агент трижды сказал «Готово!» — этого хватит' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Ilova ochilishi — faqat bitta ish. Ro'yxat, to'lov va taklif kodi har biri alohida tekshiriladi.</>, ru: <><b>Именно!</b> Открытие приложения — только одно дело. Регистрация, оплата и код приглашения проверяются каждый отдельно.</> },
  a: { uz: <><b>Qiziq fikr!</b> Ochilish ishladi — bu rost. Ro'yxat, to'lov va taklif kodi esa boshqa joyda ishlaydi.</>, ru: <><b>Интересная мысль!</b> Открытие сработало — это правда. А регистрация, оплата и код приглашения работают в другом месте.</> },
  c: { uz: <><b>Qiziq fikr!</b> Agentning «Tayyor!» degani — da'vo. Uni har ishni o'zingiz bosib ko'rib tekshirasiz.</>, ru: <><b>Интересная мысль!</b> «Готово!» от агента — заявление. Вы проверяете его, сами нажимая каждое дело.</> }
};
const TAYYOR = [
  { uz: "Tayyor! To'lov taklifi ekrani ishlaydi.", ru: 'Готово! Экран предложения оплаты работает.' },
  { uz: 'Tayyor! Telegram xabari yuboriladi.', ru: 'Готово! Сообщение Telegram отправляется.' },
  { uz: "Tayyor! Taklif kodi formaga qo'shildi.", ru: 'Готово! Код приглашения добавлен в форму.' }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [ochiq, setOchiq] = useState(avval);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const och = () => { if (ochiq) return; setOchiq(true); setSc(n => n + 1); };
  const pick = (v) => {
    if (picked !== null || !ochiq) return;
    setPicked(v); setSc(n => n + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
  };
  const javob = picked !== null;
  const tor = useTor();
  // «Ilovani ochish» — harakat: kompyuterda ⛶ maketdan tashqarida (maket ostida); telefonda maket variantlardan oldin turadi — tugma maket ostida qoladi
  const ochTugma = <button type="button" className={cx('sb-och', halqa(!ochiq))} disabled={ochiq} onClick={och}>{tr(ILOVA.ochish)}</button>;
  const mGap = ochiq
    ? { uz: 'Ilova ochildi — endi javobingizni tanlang.', ru: 'Приложение открылось — теперь выберите ответ.' }
    : { uz: "Mentor misolida bu modulda ilovaga to'lov, Telegram xabari va taklif kodi qo'shildi — telefonda «Ilovani ochish» ni bosing.", ru: 'В примере Ментора в этом модуле в приложение добавили оплату, сообщение Telegram и код приглашения — нажмите на телефоне «Открыть приложение».' };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!javob} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('sb-k', ochiq && !javob && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Mahsulotingiz to'liq ishlashini <span className="italic" style={{ color: T.accent }}>qanday bilasiz?</span></>, ru: <>Как вы узнаете, что ваш продукт <span className="italic" style={{ color: T.accent }}>работает полностью?</span></> })}
          mentor={<Mentor>{tr(mGap)}</Mentor>}
          maket={<div className="sb-kirish">
            <div className="sb-chat">
              <span className="sb-chat-kim">{AGENT}</span>
              {TAYYOR.map((p, i) => <span key={i} className="sb-pufak" style={{ animationDelay: `${0.3 + i * 0.45}s` }}>{tr(p)}</span>)}
              {javob && <em className="sb-davo fade-step">{tr({ uz: "da'vo · birga tekshirilmagan", ru: 'заявление · вместе не проверено' })}</em>}
            </div>
            <Telefon t={ochiq ? { e: 'oyinlar' } : { e: 'yopiq' }} osti={tor ? ochTugma : null} />
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={!ochiq}
          javob={javob && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        >
          {!tor && <div className="sb-och-q">{ochTugma}</div>}
        </QKirish>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Dars oxirida» — besh yo'l chizig'i (belgi joyi uzuq — o'quvchi to'ldiradi) → `XATOLAR.md` kartasi → «yangi versiya» =====
const REJA = [
  { uz: "Besh yo'lni buzish yozuvi bilan tekshirish", ru: 'Проверить пять путей с записью поломки' },
  { uz: 'Eng muhim bir-ikki topilmani tuzatish', ru: 'Исправить одну-две самые важные находки' },
  { uz: "Qayta tekshirish, `XATOLAR.md` va yangi versiya", ru: 'Перепроверка, `XATOLAR.md` и новая версия' }
];
const Screen1 = ({ screen, onNext, onPrev }) => { const tor = useTor(); return (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun mahsulotingizni <span className="italic" style={{ color: T.accent }}>tekshirasiz va tuzatasiz</span>.</>, ru: <>Сегодня вы <span className="italic" style={{ color: T.accent }}>проверите и исправите</span> свой продукт.</> })}
      mentor={<Mentor>{tr({ uz: "Yangi funksiya bugun qo'shilmaydi — faqat bor narsa sinchiklab ko'riladi. Har blokda Mentor namunasi " + (tor ? "pastda" : "o'ng tomonda") + " turadi.", ru: 'Новых функций сегодня не добавляем — внимательно смотрим только то, что есть. В каждом блоке образец Ментора стоит ' + (tor ? 'ниже' : 'справа') + '.' })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
      chap={<div className="sb-reja-chap">
        <div className="sb-reja-yol">{YOLLAR.map((y, i) => <span key={y.k} className="sb-reja-q fade-up" style={{ animationDelay: `${0.15 + i * 0.12}s` }}><i>{i + 1}</i><span>{tr(y.nom)}</span><BelgiY /></span>)}</div>
        <div className="sb-fayl sb-reja-fayl fade-up" style={{ animationDelay: '0.85s' }}>
          <span className="sb-fayl-bosh"><code>XATOLAR.md</code></span>
          <span className="sb-fayl-ust">{[{ uz: 'Usul', ru: 'Способ' }, { uz: 'Natija', ru: 'Результат' }, { uz: 'Holat', ru: 'Состояние' }].map((u, i) => <b key={i}>{tr(u)}</b>)}</span>
        </div>
        <span className="sb-versiya fade-up" style={{ animationDelay: '1.15s' }}>{tr({ uz: 'yangi versiya', ru: 'новая версия' })}</span>
      </div>}
      qadamlar={REJA.map(r => ({ t: tx(r) }))}
    >
      <p className="sb-reja-past">{tx({ uz: "o'z repo'ngiz · Mentor misoli `maydon-jamoa` · boshlang'ich teg `m13-dars-12-start` · namuna `m13-dars-12-done`", ru: 'ваш репозиторий · пример Ментора `maydon-jamoa` · начальный тег `m13-dars-12-start` · образец `m13-dars-12-done`' })}</p>
      <p className="sb-reja-past2">{tr({ uz: "«Maydon Jamoa» — namuna; besh yo'lni o'z mahsulotingizda tekshirasiz.", ru: '«Maydon Jamoa» — образец; пять путей вы проверяете в своём продукте.' })}</p>
      <Ustoz satrlar={[
        { uz: "Og'ir qismlar — 1-amaliyot (besh tekshiruv, tekshiruv akkauntlari; 5-tekshiruvda agent vaqtni suradi) va 3-amaliyot (Render kutishi, o'rnatish fayli navbati). 3 va 6-ekranlarga ortiqcha vaqt bermang.", ru: 'Тяжёлые части — практика 1 (пять проверок, тестовые аккаунты; в 5-й проверке агент сдвигает время) и практика 3 (ожидание Render, очередь установочного файла). Не тратьте лишнее время на экраны 3 и 6.' },
        { uz: "Tekshiruv akkauntlari, tekshiruv o'yinlari va ular yozgan sanoq yozuvlari 3-amaliyot oxirida `id` bo'yicha o'chiriladi — haqiqiy sanoqqa qo'shilmasin. Tekshiruv o'yini haqiqiy foydalanuvchilarga ham ro'yxatda ko'rinadi — uni dars oxirigacha qoldirmang.", ru: 'Тестовые аккаунты, тестовые игры и записанные ими записи счёта удаляются в конце практики 3 по `id` — чтобы не попали в настоящий счёт. Тестовую игру в списке видят и настоящие пользователи — не оставляйте её до конца урока.' },
        { uz: "Taklif tekshiruvidagi hisoblar bilan asosiy ish qilinmaydi — aks holda o'quvchining o'ziga mukofot (Pro'ga 7 kun) yozilib qoladi. Performance va «investor ko'zi bilan» demo-test — 14-Modul ishi; o'quvchiga aytmang. Uyga vazifa yo'q.", ru: 'С аккаунтами проверки приглашения основное дело не делается — иначе самому ученику запишется награда (7 дней Pro). Производительность и демо-тест «глазами инвестора» — работа 14-го модуля; ученику не говорите. Домашнего задания нет.' }
      ]} />
    </QReja>
  </Stage>
); };

// ===== SCREEN 2 — TUSHUNCHA · besh tekshiruv (bashorat + 5 karta, bittadan — E 53): «Tekshiruvni ko'rish» → telefon yo'lni o'ynaydi → yozuv → belgi =====
const S2_TAXMIN = [{ k: 'bir', t: { uz: 'Bittasida', ru: 'В одной' } }, { k: 'ikki', t: { uz: 'Ikkitasida', ru: 'В двух' } }, { k: 'uch', t: { uz: 'Uchtasida', ru: 'В трёх' } }];
const YZ = { qildim: { uz: 'Nima qildim', ru: 'Что сделал' }, kutdim: { uz: 'Nima kutdim', ru: 'Что ожидал' }, boldi: { uz: "Nima bo'ldi", ru: 'Что получилось' } };
const IxchamQ = ({ i, b, uchdi }) => (
  <span className={cx('sb-ix', BELGI[b].c, uchdi && 'uchdi')}><i>{i + 1}</i><span>{tr(YOLLAR[i].nom)}</span><BelgiY b={b} /></span>
);
const S2Karta = ({ i, yoz, onBelgi, xatoK, xato }) => {
  const m = MENTOR_TEKSHIRUV[i];
  const qator = (n, y, v) => <span className={cx('sb-yz-q', yoz >= n && 'ochiq')}><b>{tr(y)}</b><span>{yoz >= n ? tx(v) : '…'}</span></span>;
  return (
    <div className={cx('sb-yz', xato && 'silk')} key={i + '-' + xatoK}>
      <span className="sb-yz-bosh"><i>{i + 1}</i><b>{tr(YOLLAR[i].nom)}</b></span>
      <span className="sb-yz-dars">{tr({ uz: "Bu yo'lga tekkan darslar", ru: 'Уроки, затронувшие этот путь' })}: {tr(YOLLAR[i].darslar)}</span>
      {qator(1, YZ.qildim, m.qildim)}
      {qator(1, YZ.kutdim, m.kutdim)}
      {qator(2, YZ.boldi, m.boldi)}
      {yoz >= 3 && <span className="sb-belgilar sb-chorla2">
          {['buzildi', 'buzilmadi'].map(b => <button key={b} type="button" className={cx('sb-belgi', BELGI[b].c)} onClick={() => onBelgi(b)}>{tr(BELGI[b].t)}</button>)}
        </span>}
    </div>
  );
};
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!(storedAnswer && storedAnswer.done);
  const [taxmin, setTaxmin] = useState(avval ? storedAnswer.taxmin ?? null : null);
  const [q, setQ] = useState(avval ? 5 : 0);
  const [yoz, setYoz] = useState(0);
  const [yurdi, setYurdi] = useState(false);
  const [kadr, setKadr] = useState(avval ? YOL_SAHNA.xabar.length - 1 : 0);
  const [belgilar, setBelgilar] = useState(avval ? MENTOR_TEKSHIRUV.map(m => m.belgi) : []);
  const [uchdi, setUchdi] = useState(-1);
  const [xato, setXato] = useState(0);
  const ketma = useKetma();
  const done = q >= 5;
  const tugadi = useTugadi(done, 900, avval);
  const yi = Math.min(q, 4);
  const frames = YOL_SAHNA[YOLLAR[yi].k];
  const korish = () => {
    if (!taxmin || yurdi || done || yoz >= 3) return;
    setYurdi(true); setXato(0);
    ketma([...frames.slice(1).map((_, n) => [700, () => setKadr(n + 1)]), [700, () => setYoz(1)], [650, () => setYoz(2)], [450, () => { setYoz(3); setYurdi(false); }]]);
  };
  const belgila = (b) => {
    if (yoz < 3 || done) return;
    if (b !== MENTOR_TEKSHIRUV[q].belgi) { setXato(n => n + 1); return; }
    const yangi = [...belgilar]; yangi[q] = b;
    setBelgilar(yangi); setUchdi(q); setXato(0);
    const n = q + 1;
    ketma([[750, () => { setQ(n); setYoz(0); setKadr(n >= 5 ? YOL_SAHNA.xabar.length - 1 : 0); setUchdi(-1); if (n >= 5) onAnswer(screen, { stage: 'explore', screenIdx: screen, done: true, taxmin, correct: false }); }]]);
  };
  const mGap = done ? { uz: "Besh belgi qo'yildi — natijani taxminingiz bilan solishtiring.", ru: 'Пять меток поставлены — сравните результат со своим предположением.' }
    : !taxmin ? { uz: "Mentor bugun besh yo'lni yozuv bilan qayta ko'rdi — avval taxminingizni belgilang.", ru: 'Сегодня Ментор заново просмотрел пять путей с записью — сначала отметьте своё предположение.' }
      : { uz: "Tekshiruvni ko'ring va kutilgani bilan bo'lganini solishtirib belgi qo'ying.", ru: 'Посмотрите проверку и, сравнив ожидаемое с тем, что получилось, поставьте метку.' };
  const nav = done ? { uz: 'Davom etish', ru: 'Продолжить' } : !taxmin ? BASH_YORLIQ : { uz: `Tekshiruvlarni ko'ring (${q}/5)`, ru: `Посмотрите проверки (${q}/5)` };
  const kd = frames[Math.min(kadr, frames.length - 1)];
  // xato chiqqanda u pastki panel ostida qolmasin (telefon 390/360)
  useEffect(() => {
    if (!xato) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.sb-s2-ong .q-xato'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [xato]);
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · besh yo'l", ru: 'Понятие · пять путей' })} screen={screen} scrollSignal={q * 4 + yoz + (tugadi ? 40 : 0) + (taxmin ? 100 : 0)} deskSignal={tugadi ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(nav)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Besh tekshiruvning qaysilarida <span className="italic" style={{ color: T.accent }}>ilova buzildi?</span></>, ru: <>В каких из пяти проверок <span className="italic" style={{ color: T.accent }}>приложение сломалось?</span></> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        harakat={!done && yoz < 3 && <div className="sb-harakat"><button type="button" className={cx('sb-korish', halqa(!!taxmin && !yurdi))} disabled={!taxmin || yurdi} onClick={korish}>{tr({ uz: "Tekshiruvni ko'rish", ru: 'Посмотреть проверку' })}</button></div>}
        bashorat={<Bashorat savol={{ uz: 'Besh tekshiruvdan nechtasida Mentor ilovasi buzildi?', ru: 'В скольких из пяти проверок сломалось приложение Ментора?' }} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className={cx('sb-s2', tugadi && 'tugadi')}>
          <YolSahna kadr={done ? YOL_SAHNA.xabar[YOL_SAHNA.xabar.length - 1] : kd} belgilar={belgilar} joriy={done ? -1 : q} />
          <div className="sb-s2-ong">
            {!done && <S2Karta i={q} yoz={yoz} onBelgi={belgila} xatoK={xato} xato={xato > 0} />}
            {!done && xato > 0 && <QXato>{tr({ uz: "Kutilgani va bo'lgani bir xilmi — yana o'qing.", ru: 'Ожидаемое и полученное совпадают? Прочтите ещё раз.' })}</QXato>}
            {belgilar.length > 0 && <div className="sb-ix-l">{belgilar.map((b, i) => (b ? <IxchamQ key={i} i={i} b={b} uchdi={i === uchdi} /> : null))}</div>}
            {done && <NomQator matn={{ uz: "Asosiy yo'llarni buzish yozuvi bilan tekshirish — barqarorlik tekshiruvi.", ru: 'Проверка основных путей с записью поломки — проверка стабильности.' }} />}
          </div>
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'bir'} haqiqat={{ uz: 'bittasida', ru: 'в одной' }} />}
          matn={tr({ uz: 'Mentor misolida beshtadan bittasida ilova buzildi: unda bir necha darsning ishi uchrashgan.', ru: 'В примере Ментора приложение сломалось в одной из пяти: там встретилась работа нескольких уроков.' })}
          izoh={tr({ uz: "Tekshirish — faqat o'z mahsulotingizda va tekshiruv uchun ochilgan hisoblarda.", ru: 'Проверять — только в своём продукте и в аккаунтах, открытых для проверки.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen; INLINE_KEYS.s4 = 2, C) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Mahsulotingizda eslatma ham, Telegram xabari ham yo'q. Beshinchi kartaga nima qo'yasiz?"
    question={tr({ uz: <h2 className="title h-ask">Mahsulotingizda eslatma ham, Telegram xabari ham yo'q. <span className="italic" style={{ color: T.accent }}>Beshinchi kartaga nima qo'yasiz?</span></h2>, ru: <h2 className="title h-ask">В вашем продукте нет ни напоминания, ни сообщения Telegram. <span className="italic" style={{ color: T.accent }}>Что вы поставите в пятой карточке?</span></h2> })}
    options={[
      { uz: "«Buzilmadi» — xato hech qayerda chiqmadi", ru: '«Не сломалось» — ошибки нигде не было' },
      { uz: "«Buzildi» — kutgan xabarim kelmadi", ru: '«Сломалось» — ожидаемое сообщение не пришло' },
      { uz: "«Mahsulotimda hali yo'q» — tekshirilmadi", ru: '«В моём продукте пока нет» — не проверено' },
      { uz: 'Hech narsa — kartani bo\'sh qoldiraman', ru: 'Ничего — оставлю карточку пустой' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Bu yo'l tekshirilmadi — uni «buzilmadi» deb bo'lmaydi.", ru: 'Этот путь не проверен — его нельзя назвать «не сломалось».' }}
    explainWrong={{
      0: { uz: "«Buzilmadi» — bor yo'l kutilganidek ishlaganda.", ru: '«Не сломалось» — когда существующий путь сработал как ожидалось.' },
      1: { uz: "«Buzildi» — bor yo'l kutilganidek ishlamaganda.", ru: '«Сломалось» — когда существующий путь сработал не так, как ожидалось.' },
      3: { uz: "Bo'sh karta bu yo'l haqida hech narsa aytmaydi.", ru: 'Пустая карточка ничего не говорит об этом пути.' },
      default: { uz: "Bu yo'l tekshirilmadi — uni «buzilmadi» deb bo'lmaydi.", ru: 'Этот путь не проверен — его нельзя назвать «не сломалось».' }
    }} />
);

// ===== SCREEN 5 — TUSHUNCHA · faqat topilma (bashorat + 4 taklif, bittadan): taklif topilmaga bog'lansa — «Bugun — tuzatish», bog'lanmasa — «Bugun emas» =====
const S5_TAXMIN = [{ k: 'bir', t: { uz: 'Bittasi', ru: 'Одно' } }, { k: 'ikki', t: { uz: 'Ikkitasi', ru: 'Два' } }, { k: 'uch', t: { uz: 'Uchtasi', ru: 'Три' } }];
const ROYXAT = { tuzatish: { uz: 'Bugun — tuzatish', ru: 'Сегодня — исправление' }, yangi: { uz: 'Bugun emas — yangi funksiya', ru: 'Не сегодня — новая функция' } };
const Topilma = ({ bogi }) => (
  <div className={cx('sb-topilma', bogi && 'bogi')}>
    <span className="sb-top-q"><i>5</i><b>{tr({ uz: 'Telegram xabari', ru: 'Сообщение Telegram' })}</b><BelgiY b="buzildi" /></span>
    <span className="sb-top-m">{tr({ uz: "keyingi o'yin ikki marta yaratildi", ru: 'следующая игра создана дважды' })}</span>
    {bogi && <em className="sb-tuzatadi fade-step">← {tr({ uz: 'tuzatadi', ru: 'исправляет' })}</em>}
  </div>
);
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!(storedAnswer && storedAnswer.done);
  const [taxmin, setTaxmin] = useState(avval ? storedAnswer.taxmin ?? null : null);
  const [q, setQ] = useState(avval ? 4 : 0);
  const [joy, setJoy] = useState(avval ? [0, 1, 2, 3] : []);
  const [uchyap, setUchyap] = useState(false);
  const [xato, setXato] = useState(0);
  const ketma = useKetma();
  const done = q >= 4;
  const tugadi = useTugadi(done, 900, avval);
  const bos = (tur) => {
    if (!taxmin || done || uchyap) return;
    if (tur !== AGENT_TAKLIF[q].tur) { setXato(n => n + 1); return; }
    setXato(0); setUchyap(true); setJoy(j => [...j, q]);
    const n = q + 1;
    ketma([[800, () => { setQ(n); setUchyap(false); if (n >= 4) onAnswer(screen, { stage: 'explore', screenIdx: screen, done: true, taxmin, correct: false }); }]]);
  };
  const bogi = joy.includes(2);
  const tor = useTor();
  const chapdagi = tor ? { uz: 'yuqoridagi', ru: 'выше' } : { uz: 'chapdagi', ru: 'слева' };
  const ro = (tur) => joy.filter(i => AGENT_TAKLIF[i].tur === tur);
  const mGap = done ? { uz: "To'rt taklif joylandi — natijani taxminingiz bilan solishtiring.", ru: 'Четыре предложения разложены — сравните результат со своим предположением.' }
    : !taxmin ? { uz: "Mentor topilmani agentga berdi, agent to'rt taklif yozdi — avval taxminingizni belgilang.", ru: 'Ментор передал находку агенту, агент написал четыре предложения — сначала отметьте своё предположение.' }
      : { uz: `Taklifni ${chapdagi.uz} topilma bilan solishtiring va ro'yxatini tanlang.`, ru: `Сравните предложение с находкой ${chapdagi.ru} и выберите его список.` };
  const nav = done ? { uz: 'Davom etish', ru: 'Продолжить' } : !taxmin ? BASH_YORLIQ : { uz: `Takliflarni joylang (${q}/4)`, ru: `Разложите предложения (${q}/4)` };
  const t = AGENT_TAKLIF[Math.min(q, 3)];
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · faqat tuzatish', ru: 'Понятие · только исправление' })} screen={screen} scrollSignal={q + (tugadi ? 10 : 0)} deskSignal={tugadi ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(nav)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Agentning qaysi taklifi <span className="italic" style={{ color: T.accent }}>bugun qilinadi?</span></>, ru: <>Какое предложение агента <span className="italic" style={{ color: T.accent }}>делается сегодня?</span></> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        harakat={!done && <div className="sb-harakat">
          <span className="sb-tanlov sb-chorla2">
            {['tuzatish', 'yangi'].map(tur => <button key={tur} type="button" className={cx('sb-taklif', tur)} disabled={!taxmin || uchyap} onClick={() => bos(tur)}>{tr(ROYXAT[tur])}</button>)}
          </span>
          {xato > 0 && <QXato>{tr({ uz: `Taklifni ${chapdagi.uz} topilma bilan yana solishtiring.`, ru: `Ещё раз сравните предложение с находкой ${chapdagi.ru}.` })}</QXato>}
        </div>}
        bashorat={<Bashorat savol={{ uz: "To'rt taklifdan nechtasi bugun qilinadi?", ru: 'Сколько из четырёх предложений делается сегодня?' }} variantlar={S5_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className={cx('sb-s5', tugadi && 'tugadi')}>
          <div className="sb-s5-chap">
            <Topilma bogi={bogi} />
            {['tuzatish', 'yangi'].map(tur => (
              <div key={tur} className={cx('sb-ro', tur)}>
                <span className="sb-ro-y">{tr(ROYXAT[tur])}</span>
                {ro(tur).map(i => <span key={i} className={cx('sb-ro-q fade-step', tur)}>{tr(AGENT_TAKLIF[i].matn)}{tur === 'yangi' && <em>{tr({ uz: "hech bir topilmaga bog'lanmaydi", ru: 'не связано ни с одной находкой' })}</em>}</span>)}
              </div>
            ))}
          </div>
          {!tugadi && <div className={cx('sb-s5-ch', bogi && 'on')} aria-hidden="true"><i /></div>}
          {!tugadi && <div className="sb-s5-ong">
            <div className="sb-agent">
              <span className="sb-chat-kim">{AGENT}</span>
              {!done && <>
                <span className="sb-t-n">{tr({ uz: `Taklif ${q + 1} / 4`, ru: `Предложение ${q + 1} / 4` })}</span>
                <span key={q + '-' + xato} className={cx('sb-pufak katta', xato > 0 && 'silk', uchyap && 'ketdi')}>{tr(t.matn)}</span>
              </>}
            </div>
          </div>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'bir'} haqiqat={{ uz: 'bittasi', ru: 'одно' }} />}
          matn={tr({ uz: "Bu darsda faqat topilmaga bog'langan o'zgarish qilinadi: yangi funksiya yana tekshirilmagan joy qo'shadi.", ru: 'На этом уроке делается только изменение, связанное с находкой: новая функция добавляет ещё одно непроверенное место.' })}
          izoh={tx({ uz: "Bugun ulgurmagan topilma ham `XATOLAR.md` ga «qoldi» deb, sababi bilan yoziladi.", ru: 'Находка, на которую сегодня не хватило времени, тоже записывается в `XATOLAR.md` как «осталось», с причиной.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 0, A) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Agent tuzatish bilan birga yangi tugma ham qo'shdi. Nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Agent tuzatish bilan birga yangi tugma ham qo'shdi. <span className="italic" style={{ color: T.accent }}>Nima qilasiz?</span></h2>, ru: <h2 className="title h-ask">Агент вместе с исправлением добавил и новую кнопку. <span className="italic" style={{ color: T.accent }}>Что вы сделаете?</span></h2> })}
    options={[
      { uz: 'Agentga tugmani olib tashlashni aytaman', ru: 'Скажу агенту убрать кнопку' },
      { uz: 'Tugmani qoldiraman — odamlarga qulay bo\'ladi', ru: 'Оставлю кнопку — людям будет удобно' },
      { uz: 'Tuzatishni ham, tugmani ham bekor qilaman', ru: 'Отменю и исправление, и кнопку' },
      { uz: "Tugmani topilma qilib yozuvga qo'shaman", ru: 'Добавлю кнопку в запись как находку' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Bugun faqat topilmaga bog'langan o'zgarish qoladi.", ru: 'Сегодня остаётся только изменение, связанное с находкой.' }}
    explainWrong={{
      1: { uz: "Qulay bo'lishi mumkin — lekin u tekshirilmagan yangi yo'l.", ru: 'Может быть удобно — но это новый непроверенный путь.' },
      2: { uz: "Tuzatish topilmaga bog'langan — u nega ketishi kerak?", ru: 'Исправление связано с находкой — зачем его убирать?' },
      3: { uz: "Topilma — tekshiruvda kutilgani bo'lmagan joy.", ru: 'Находка — место, где при проверке не произошло ожидаемое.' },
      default: { uz: "Bugun faqat topilmaga bog'langan o'zgarish qoladi.", ru: 'Сегодня остаётся только изменение, связанное с находкой.' }
    }} />
);

// ===== 🏅 BADGES (nishonlar) — 4 ta: ikki ballik savol (birinchi urinish) + Five Paths (1-amaliyot 4-band) + Bug Log (3-amaliyot 3-band) — ish uchun, tekin emas (P-048) =====
const ACHIEVEMENTS = {
  honestMark: { icon: '🏷️', name: 'Honest Mark', desc: { uz: "Mahsulotda yo'q yo'lga to'g'ri belgini tanladingiz", ru: 'Вы выбрали верную метку для пути, которого нет в продукте' } },
  fixOnly: { icon: '🎯', name: 'Fix Only', desc: { uz: 'Yangi tugmani olib tashlash kerakligini topdingiz', ru: 'Вы поняли, что новую кнопку нужно убрать' } },
  fivePaths: { icon: '🛣️', name: 'Five Paths', desc: { uz: "Besh yo'lni o'z mahsulotingizda tekshirib yozdingiz", ru: 'Вы проверили и записали пять путей в своём продукте' } },
  bugLog: { icon: '📒', name: 'Bug Log', desc: { uz: 'Topilmalarni XATOLAR.md ga holati bilan yozdingiz', ru: 'Вы записали находки в XATOLAR.md с их состоянием' } }
};
// Ekran id → nishon: s4, s7 — ballik test (birinchi urinish); a1, a3 — blok bandi «Bajardim» (bonus, birinchi urinish sharti yo'q — 152)
const ACH_TRIGGERS = { s4: 'honestMark', s7: 'fixOnly', a1: 'fivePaths', a3: 'bugLog' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 8, 11, 14, 15)
const Q_LABELS = {
  4: { uz: "1 — Yo'q yo'lning belgisi", ru: '1 — Метка отсутствующего пути' },
  7: { uz: '2 — Faqat tuzatish', ru: '2 — Только исправление' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning o'z so'zlari (MD «Fon so'zlari»; R-008: {uz, ru}; kod so'zi o'zgarmaydi; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'barqarorlik tekshiruvi', ru: 'проверка стабильности' }, l: 4, t: 9, s: 22, d: 19, dl: 0 },
  { ch: { uz: 'buzish yozuvi', ru: 'запись поломки' }, l: 70, t: 7, s: 22, d: 23, dl: 1.5 },
  { ch: { uz: "besh yo'l", ru: 'пять путей' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'buzildi', ru: 'сломалось' }, l: 78, t: 66, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'buzilmadi', ru: 'не сломалось' }, l: 44, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: "hali yo'q", ru: 'пока нет' }, l: 64, t: 28, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: 'Tuzatish qilindi', ru: 'Исправление сделано' }, l: 22, t: 36, s: 20, d: 20, dl: 1.9 },
  { ch: { uz: 'takrorlanmadi', ru: 'не повторилось' }, l: 18, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: 'XATOLAR.md', l: 52, t: 50, s: 22, d: 22, dl: 0.6 },
  { ch: { uz: 'yangi versiya', ru: 'новая версия' }, l: 84, t: 44, s: 20, d: 24, dl: 1.3 },
  { ch: { uz: 'taklif kodi', ru: 'код приглашения' }, l: 30, t: 58, s: 20, d: 26, dl: 2.5 },
  { ch: { uz: "«Doimiy o'yin»", ru: '«Doimiy o\'yin»' }, l: 6, t: 46, s: 20, d: 21, dl: 3.2 },
  { ch: 'Maydon Jamoa', l: 58, t: 18, s: 20, d: 18, dl: 1.7 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD aynan), to'g'ri javob A·B·C·D ×3 (aylanma)
const QUIZ_BANK = [
  { q: { uz: "Mentor besh yo'lni yozuv bilan qayta ko'rdi. Bu qanday ish?", ru: 'Ментор заново просмотрел пять путей с записью. Что это за работа?' }, opts: [{ uz: 'Barqarorlik tekshiruvi', ru: 'Проверка стабильности' }, { uz: "Yangi funksiya qo'shish", ru: 'Добавление новой функции' }, { uz: 'Pullik obunani yoqish', ru: 'Включение платной подписки' }, { uz: 'Taklif havolasi tarqatish', ru: 'Раздача пригласительной ссылки' }], correct: 0 },
  { q: { uz: "Mentor taklif kodini qo'shdi. Nega ro'yxatdan o'tish ham tekshirildi?", ru: 'Ментор добавил код приглашения. Почему проверили и регистрацию?' }, opts: [{ uz: "Ro'yxat har hafta o'zi o'zgaradi", ru: 'Список сам меняется каждую неделю' }, { uz: "Kod shu formaga qo'shilgan edi", ru: 'Код был добавлен в эту форму' }, { uz: "Login endi taklif kodi bo'lgan", ru: 'Логин теперь стал кодом приглашения' }, { uz: 'Telegram bot formani yangilagan', ru: 'Telegram-бот обновил форму' }], correct: 1 },
  { q: { uz: 'Tekshiruv uchun qaysi hisobdan foydalanasiz?', ru: 'Какой аккаунт вы используете для проверки?' }, opts: [{ uz: 'Sinfdoshingiz bergan login va paroldan', ru: 'Логин и пароль, которые дал одноклассник' }, { uz: "Ilovadagi eng faol o'yinchi hisobidan", ru: 'Аккаунт самого активного игрока в приложении' }, { uz: 'Tekshiruv uchun ochilgan yangi hisobdan', ru: 'Новый аккаунт, открытый для проверки' }, { uz: "Hisobsiz — kirmagan mehmon ko'rinishidan", ru: 'Без аккаунта — вид гостя без входа' }], correct: 2 },
  { q: { uz: 'Nima kutishingizni qachon yozasiz?', ru: 'Когда вы пишете, что ожидаете?' }, opts: [{ uz: "Natijani ko'rganingizdan keyin", ru: 'После того как увидели результат' }, { uz: 'Agent «Tayyor!» degan zahoti', ru: 'Как только агент сказал «Готово!»' }, { uz: 'Dars oxirida, yakun ekranida', ru: 'В конце урока, на итоговом экране' }, { uz: 'Tekshirishni boshlashdan oldin', ru: 'Перед началом проверки' }], correct: 3 },
  { q: { uz: "Nega barqarorlik kunida yangi funksiya qo'shilmaydi?", ru: 'Почему в день стабильности не добавляют новую функцию?' }, opts: [{ uz: "U tekshirilmagan yangi yo'l ochadi", ru: 'Она открывает новый непроверенный путь' }, { uz: 'Agent bugun yangi kod yoza olmaydi', ru: 'Агент сегодня не может писать новый код' }, { uz: "Yangi funksiya faqat pullik bo'ladi", ru: 'Новая функция будет только платной' }, { uz: 'Foydalanuvchilar uni umuman sezmaydi', ru: 'Пользователи её совсем не замечают' }], correct: 0 },
  { q: { uz: 'Uch topilma bor, vaqt ikkitasiga yetdi. Uchinchisi-chi?', ru: 'Есть три находки, времени хватило на две. А третья?' }, opts: [{ uz: '`XATOLAR.md` dan butunlay o\'chiriladi', ru: 'Полностью удаляется из `XATOLAR.md`' }, { uz: '`XATOLAR.md` da «qoldi» deb, sababi bilan', ru: 'В `XATOLAR.md` как «осталось», с причиной' }, { uz: 'Agentga «Tuzatish qilindi» deb yozdiriladi', ru: 'Агента просят написать «Исправление сделано»' }, { uz: 'Hech kimga aytilmay, keyinga qoladi', ru: 'Никому не говоря, откладывается' }], correct: 1 },
  { q: { uz: "Mentor misolida «Ikki marta yuborish»dan keyin Pro necha kunga yoqildi?", ru: 'В примере Ментора на сколько дней включился Pro после «Ikki marta yuborish»?' }, opts: [{ uz: '60 kunga — ikki marta', ru: 'На 60 дней — дважды' }, { uz: '7 kunga — mukofot kabi', ru: 'На 7 дней — как награда' }, { uz: '30 kunga — bir marta', ru: 'На 30 дней — один раз' }, { uz: 'Umuman yoqilmadi — rad', ru: 'Вообще не включился — отказ' }], correct: 2 },
  { q: { uz: '«Tuzatish qilindi» nimani bildiradi?', ru: 'Что означает «Tuzatish qilindi»?' }, opts: [{ uz: 'Qayta tekshiruvda takrorlanmaganini', ru: 'Что при перепроверке не повторилось' }, { uz: 'Topilma `XATOLAR.md` dan o\'chganini', ru: 'Что находка удалена из `XATOLAR.md`' }, { uz: 'Agent ishni endi boshlaganini', ru: 'Что агент только начал работу' }, { uz: 'Kodda o\'zgartirish qilinganini', ru: 'Что в коде сделано изменение' }], correct: 3 },
  { q: { uz: 'Mentor tuzatishi faqat `backend/` da. APK\'ni yangilash kerakmi?', ru: 'Исправление Ментора только в `backend/`. Нужно ли обновлять APK?' }, opts: [{ uz: "Yo'q — ilova o'sha Backend'ga ulanadi", ru: 'Нет — приложение подключается к тому же Backend' }, { uz: "Ha — APK har tuzatishda o'zi yangilanadi", ru: 'Да — APK сам обновляется при каждом исправлении' }, { uz: "Ha — Render APK'ni ham qayta yig'adi", ru: 'Да — Render пересобирает и APK' }, { uz: "Yo'q — APK'ni yangilab bo'lmaydi", ru: 'Нет — APK обновить нельзя' }], correct: 0 },
  { q: { uz: "Mentor misolida brauzer ko'rinishi push'dan keyin o'zi yangilanadimi?", ru: 'В примере Ментора браузерная версия обновляется сама после push?' }, opts: [{ uz: "Ha — Netlify uni har safar o'zi yig'adi", ru: 'Да — Netlify каждый раз собирает её сам' }, { uz: "Yo'q — qayta eksport va deploy kerak", ru: 'Нет — нужны повторный экспорт и deploy' }, { uz: "Ha — Expo Go uni o'zi yangilaydi", ru: 'Да — Expo Go обновляет её сам' }, { uz: "Yo'q — uni faqat APK almashtiradi", ru: 'Нет — её заменяет только APK' }], correct: 1 },
  { q: { uz: "Mentor misolida ikki telefon bir vaqtda «O'yinlar»ni ochganda nima bo'ldi?", ru: 'Что случилось в примере Ментора, когда два телефона одновременно открыли «O\'yinlar»?' }, opts: [{ uz: "Bitta o'yin yaratildi, xabar ham bitta", ru: 'Создана одна игра, сообщение тоже одно' }, { uz: 'Ikkala telefonda ilova yopilib qoldi', ru: 'На обоих телефонах приложение закрылось' }, { uz: "Keyingi o'yin ikki marta yaratildi", ru: 'Следующая игра создана дважды' }, { uz: "Hamma o'yinlar ro'yxatdan o'chib ketdi", ru: 'Все игры пропали из списка' }], correct: 2 },
  { q: { uz: 'Darsdan keyin tekshiruv akkauntlari nima qilinadi?', ru: 'Что делают с тестовыми аккаунтами после урока?' }, opts: [{ uz: 'Haqiqiy sanoqda qolaveradi', ru: 'Остаются в настоящем счёте' }, { uz: 'Sinfdoshlarga berib yuboriladi', ru: 'Отдаются одноклассникам' }, { uz: '`namuna` deb belgilanib qoladi', ru: 'Остаются с пометкой `namuna`' }, { uz: '`id` bo\'yicha o\'chiriladi', ru: 'Удаляются по `id`' }], correct: 3 }
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
// Har blok 4 band, hammasi o'quvchining o'z repo'sida (5-band yo'q). Qolipda yo'q (qolip taklifi): {…} joyi maydoni va kulrang «masalan» (SbPrompt), band ichidagi «Yordam»,
// tekshiruv kartalari, tanlov kartalari, «Tuzatish qilindi» / qayta tekshiruv tugmalari, «Ulgurmasangiz» qatori — shu faylda. Blok bayrog'i — faqat oxirgi band «Bajardim»idan (12-Modul 9.36 h).
// Dars holati (KOD 3) — `ccProgress` ichida (root `dars`); yangi `pm-…` kaliti yo'q (tayanch 8). Ism, login, parol, Telegram chat raqami holatga yozilmaydi.
const DarsCtx = createContext(null);
const yozBosh = () => YOLLAR.map(y => ({ yol: y.k, qilaman: null, kutaman: '', boldi: '', belgi: null, tanlandi: false, tuzatishQilindi: false, qayta: null, qoldiSabab: null }));
const darsBosh = () => ({ yozuv: yozBosh(), xatolarYozildi: false, navbatda: null, mobil: null });
const useDars = () => {
  const c = useContext(DarsCtx);
  const dars = c && c.dars && Array.isArray(c.dars.yozuv) && c.dars.yozuv.length === 5 ? c.dars : darsBosh();
  const yangila = (p) => c && c.setDars(d => ({ ...(d && Array.isArray(d.yozuv) ? d : darsBosh()), ...p }));
  const yozYangila = (i, p) => c && c.setDars(d => { const b = d && Array.isArray(d.yozuv) && d.yozuv.length === 5 ? d : darsBosh(); return { ...b, yozuv: b.yozuv.map((u, k) => (k === i ? { ...u, ...p } : u)) }; });
  return { dars, yozuv: dars.yozuv, yangila, yozYangila };
};
const qil = (u, i) => (u.qilaman == null ? tr(YOLLAR[i].qilaman) : u.qilaman);
const kichikNom = (i) => { const s = tr(YOLLAR[i].nom); return s.charAt(0).toLowerCase() + s.slice(1); };
const nuqta = (s) => { const t = String(s || '').trim(); return !t ? '—' : /[.!?…»]$/.test(t) ? t : t + '.'; };
const qoldimi = (u) => u.belgi === 'buzildi' && (!u.tuzatishQilindi || u.qayta === 'takrorlandi');

const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
const PLATFORMA_KALIT = 'pm-m9d8-platforma';
const trekOqi = () => { const o = lsOqi(PLATFORMA_KALIT); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
// Trek kaliti yo'q bo'lsa — 1-amaliyot boshida «Mobil trek» · «Web-trek», tanlov shu kalitga yoziladi (11-Modul 9.77)
function useTrek() {
  const [trek, setTrek] = useState(trekOqi);
  const [sora] = useState(() => trekOqi() === null);
  const tanla = (t) => { const o = lsOqi(PLATFORMA_KALIT); lsYoz(PLATFORMA_KALIT, { ...(o && typeof o === 'object' ? o : {}), trek: t, savedAt: Date.now() }); setTrek(t); };
  return { web: trek === 'web', trek, sora, tanla };
}
const TrekTanlov = ({ tk }) => (tk.sora ? <span className="sb-trek-q">{['mobil', 'web'].map(t => (
  <button key={t} type="button" className={cx('sb-trek', tk.trek === t && 'on')} onClick={() => tk.tanla(t)}>{tr(t === 'mobil' ? { uz: 'Mobil trek', ru: 'Мобильный трек' } : { uz: 'Web-trek', ru: 'Веб-трек' })}</button>))}</span> : null);
// Prompt: {…} joyi — kulrang «masalan: …» bilan maydon; «oldindan» — yozuvdan tayyor qiymat; «Nusxalash» — almashtirilgan matn
const SbPrompt = ({ satrlar, joylar = [], qiymat = {}, onYoz, oldindan = {} }) => {
  const [ok, setOk] = useState(false);
  const almash = (s) => {
    let r = s;
    Object.entries(oldindan).forEach(([joy, v]) => { if (v) r = r.split(joy).join(v); });
    joylar.forEach(j => { const v = String(qiymat[j.id] || '').trim(); if (v) r = r.split(tr(j.joy)).join(v); });
    return r;
  };
  const matn = satrlar.map(l => almash(tr(l)));
  const joyli = (t, key) => t.split(/(\{[^}\s][^}]*\})/g).map((p, i) => (/^\{[^\s].*\}$/.test(p) ? <span key={key + '-' + i} className="q-joy">{p}</span> : <React.Fragment key={key + '-' + i}>{fmtCode(p)}</React.Fragment>));
  const bos = async () => { if (await nusxala(matn.join('\n'))) { setOk(true); setTimeout(() => setOk(false), 1600); } };
  return (
    <span className="q-prompt sb-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa sb-nusxa" onClick={bos}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="sb-ps">{l.split('\n').map((s, k) => <span key={k} className="sb-ps-q">{joyli(s, i + '-' + k)}</span>)}</span>)}
      {joylar.length > 0 && <span className="sb-joylar">{joylar.map(j => (
        <label key={j.id} className="sb-joy-m"><span className="sb-joy-n">{tr(j.joy)}</span>
          <input type="text" value={qiymat[j.id] || ''} maxLength={240} placeholder={tr(j.namuna)} onChange={e => onYoz(j.id, e.target.value)} /></label>))}</span>}
    </span>
  );
};
const Yordam = ({ satrlar, sarlavha, ost }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <span className="sb-yordam-ust">
      <QTugma ikkinchi className="sb-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="sb-yordam fade-step">{sarlavha && <b>{tr(sarlavha)}</b>}{satrlar.map((l, i) => <span key={i} className="sb-yordam-s">{tx(l)}</span>)}{ost && <span className="sb-yordam-s sb-kulrang">{tx(ost)}</span>}</span>}
    </span>
  );
};
const Band = ({ children }) => <span className="sb-band">{children}</span>;
const Kulrang = ({ children }) => <span className="sb-kulrang">{children}</span>;
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, izoh, ulgur, ochiqShart = false, ochiqQadam = 99, qulf, qulfSabab, otkaz = [], ustoz, nishonShart, pastQator }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  // otkaz — o'tkazilgan bandlar (kulrang «o'tkazildi»; raqamlar saqlanadi): «Bajardim» ulardan sakrab o'tadi
  const otkazdan = (n) => { let k = n; while (k < steps.length && otkaz.includes(k)) k += 1; return k; };
  const [stepN, setStepN] = useState(() => (avval ? steps.length : otkazdan(Math.min(storedAnswer && Number.isInteger(storedAnswer.qadam) ? storedAnswer.qadam : 0, steps.length))));
  const done = stepN >= steps.length;
  const ochiq = done || ochiqShart || stepN >= ochiqQadam;
  const qulfli = !done && !!qulf && qulf(stepN);
  const bajardim = () => {
    if (isMentorLive || done || qulfli) return;
    const n = otkazdan(stepN + 1); setStepN(n);
    const tugadi = n >= steps.length;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), qadam: n, solved: tugadi || avval, correct: nishonShart ? nishonShart(n) : tugadi, picked: true });
    if (tugadi && !avval && _live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const qaytar = (i) => { if (done || isMentorLive || otkaz.includes(i)) return; setStepN(i); };
  const birinchi = useRef(true);
  const torB = useIsMobile(768);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return undefined; }
    // telefonda: joriy band tepaga, tugashda xulosa markazga (eng pastga emas — ostida natija va «Ortda» matni bor); kompyuterda — avvalgidek «nearest»
    const t = setTimeout(() => {
      const xul = done ? document.querySelector('.q-blok-tugadi') : null;
      const el = xul || document.querySelector('.q-blok-q.joriy') || (done ? [...document.querySelectorAll('.q-blok-q')].pop() : null);
      if (!el || !el.scrollIntoView) return;
      el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: torB ? (xul ? 'center' : 'start') : 'nearest' });
      // telefonda Mentor surishda yig'iladi va band yuqoriga siljiydi — bir marta tuzatamiz
      if (torB && !xul) t2 = setTimeout(() => { const box = el.closest('.stage-content'); if (box && el.getBoundingClientRect().top < box.getBoundingClientRect().top) el.scrollIntoView({ behavior: 'auto', block: 'start' }); }, 650);
    }, 120);
    let t2 = null;
    return () => { clearTimeout(t); if (t2) clearTimeout(t2); };
  }, [stepN]);
  // SABOQ 11: Mentor keyingi harakatni aytadi — boshida MD gapi, bandlar orasida keyingi band, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi band — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий пункт — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cx('sb-blok', qulfli && 'qulf')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={steps.map((c, i) => ({
            h: otkaz.includes(i) ? <span className="sb-otk">{tr(c.h)} <em>· {tr({ uz: "o'tkazildi", ru: 'пропущен' })}</em></span> : tr(c.h),
            t: c.t,
            xato: qulfli && i === stepN && qulfSabab ? <span className="sb-qulf-s">{tr(qulfSabab)}</span> : null }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={done && doneText ? tx(doneText) : null} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<>{done && izoh && <QIzoh>{tx(izoh)}</QIzoh>}{done && pastQator}<MentorPracticeStats live={_live} screen={screen} /></>}>
          {ortda && <p className="sb-ortda">{tx(ortda)}</p>}
          {ulgur && !done && <p className="sb-ulgur">{tx(ulgur)}</p>}
          {ustoz && isMentorLive && <div className="sb-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{ustoz.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>}
        </QBlok>
      </div>
    </Stage>
  );
}

// --- 1-amaliyot: besh tekshiruv (kod yozilmaydi; tayyor talab + bitta joy)
const A1_PROMPT = [
  { uz: "Qayerda: o'z loyiham — faqat o'qish uchun: kod va fayllarni o'zgartirma. Database'da yozish mumkin — faqat tekshiruv akkauntlari (sen ochganlari va men aytgan loginlar) va ularning yozuvlari.", ru: 'Где: мой проект — только для чтения: код и файлы не меняй. В Database писать можно — только тестовые аккаунты (открытые тобой и логины, которые я скажу) и их записи.' },
  { uz: "Nima qilsin: bugun men mahsulotimning besh yo'lini tekshiraman: kirish va ro'yxat · {asosiy harakat} · to'lov oqimi · taklif havolasi · eslatma yoki Telegram xabari. Har tekshiruvdan oldin senga nima kerakligini aytaman: tekshiruv akkaunti ochish (namuna ism va login bilan, haqiqiy emas), shu hisob nomidan so'rov yuborish yoki tekshiruv akkauntidagi vaqt va muddatni o'zgartirish. Avval nima qilishingni ayt; «Qil» desam — bajar va qaysi hisob, qaysi yozuv, qaysi `id` ekanini ayt.", ru: 'Что сделать: сегодня я проверяю пять путей своего продукта: вход и регистрация · {основное действие} · поток оплаты · пригласительная ссылка · напоминание или сообщение Telegram. Перед каждой проверкой скажу, что нужно: открыть тестовый аккаунт (с образцовым именем и логином, не настоящим), отправить запрос от имени этого аккаунта или изменить время и срок в тестовом аккаунте. Сначала скажи, что будешь делать; скажу «Делай» — выполни и скажи, какой аккаунт, какая запись, какой `id`.' },
  { uz: "Nima buzilmasin: kod, `.env` va haqiqiy foydalanuvchilarning hisoblari va yozuvlariga tegma. Hech narsani tuzatma va tuzatish taklif qilma — men hozir faqat tekshiryapman. Nima o'zgartirganingni ayt.", ru: 'Что не сломать: не трогай код, `.env` и аккаунты и записи настоящих пользователей. Ничего не исправляй и не предлагай исправлений — я сейчас только проверяю. Скажи, что изменил.' }
];
const A1_JOY = [{ id: 'harakat', joy: { uz: '{asosiy harakat}', ru: '{основное действие}' }, namuna: { uz: "masalan: o'yin e'lon qilish va o'yinga qo'shilish", ru: 'например: объявить игру и присоединиться к игре' } }];
const A1_YORDAM = [
  ...A1_PROMPT.map(l => ({ uz: l.uz.replace('{asosiy harakat}', "o'yin e'lon qilish va o'yinga qo'shilish"), ru: l.ru.replace('{основное действие}', 'объявить игру и присоединиться к игре') })),
  { uz: "Tekshiruv akkaunti och: namuna ism va login bilan, haqiqiy emas. Login va parolni menga ayt.", ru: 'Открой тестовый аккаунт: с образцовым именем и логином, не настоящим. Скажи мне логин и пароль.' },
  { uz: "Shu tekshiruv akkauntidagi «Doimiy o'yin» vaqtini o'tgan haftaga qo'y. Qaysi `id` ni o'zgartirganingni ayt.", ru: 'Поставь время «Doimiy o\'yin» в этом тестовом аккаунте на прошлую неделю. Скажи, какой `id` изменил.' }
];
const A1_LOGIN = [{ uz: "Bugun tekshiruv uchun ochilgan hisoblar — sen ochganlaring va men formadan ochganlarim: {tekshiruv loginlari} — va ular yaratgan yozuvlar ro'yxatini `id` lari bilan ko'rsat. Hozircha hech narsani o'chirma.", ru: 'Аккаунты, открытые сегодня для проверки, — твои и те, что я открыл через форму: {логины проверки} — и покажи список созданных ими записей с их `id`. Пока ничего не удаляй.' }];
const A1_LOGIN_JOY = [{ id: 'loginlar', joy: { uz: '{tekshiruv loginlari}', ru: '{логины проверки}' }, namuna: { uz: 'masalan: tekshiruv1, tekshiruv2', ru: 'например: tekshiruv1, tekshiruv2' } }];
// pm-m11d5-buzish — 3-karta tepasidagi bitta qator (faqat o'qiladi; kalit yo'q — qator ko'rinmaydi, KORPUS §69)
const USUL_NOMI = { ikki: { uz: 'ikki marta yuborish', ru: 'отправить дважды' }, kech: { uz: 'kechiktirib yuborish', ru: 'отправить с задержкой' }, rad: { uz: 'rad etish', ru: 'отклонить' }, imzo: { uz: "noto'g'ri imzo", ru: 'неверная подпись' } };
const QAYTA_NOMI = { takrorlanmadi: { uz: 'takrorlanmadi', ru: 'не повторилось' }, takrorlandi: { uz: 'yana buzildi', ru: 'снова сломалось' } };
const besDarsQator = () => {
  const o = lsOqi('pm-m11d5-buzish');
  const ur = o && Array.isArray(o.urinishlar) ? o.urinishlar.filter(u => u && USUL_NOMI[u.usul] && typeof u.buzildi === 'boolean') : [];
  if (!ur.length) return null;
  return ur.map(u => tr(USUL_NOMI[u.usul]) + ' — ' + tr(BELGI[u.buzildi ? 'buzildi' : 'buzilmadi'].q) + (u.qayta && QAYTA_NOMI[u.qayta] ? ' · ' + tr(QAYTA_NOMI[u.qayta]) : '')).join('; ');
};
// Avto-balandlik maydoni (ichki skroll yo'q)
const AvtoMatn = (p) => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const moslash = () => { el.style.height = 'auto'; el.style.height = el.scrollHeight + 2 + 'px'; };
    moslash();
    window.addEventListener('resize', moslash);
    return () => window.removeEventListener('resize', moslash);
  }, [p.value]);
  return <textarea ref={ref} rows={2} {...p} />;
};
const SHART_KUTAMAN = { uz: "Avval nima kutishingizni yozing: ekranda nima ko'rinadi?", ru: 'Сначала напишите, что ожидаете: что будет видно на экране?' };
const SHART_BOLDI = { uz: "Belgidan oldin nima ko'rganingizni yozing.", ru: 'Перед меткой напишите, что вы увидели.' };
// Tekshiruv kartalari — bittadan (SABOQ 9, E 53); tepada ixcham chiziq (bosib tahrirlanadi); belgi qo'yilgach yorliqlar «Nima qildim» · «Nima kutdim»
const TekshiruvKartalar = () => {
  const { yozuv, yozYangila } = useDars();
  const [joriy, setJoriy] = useState(() => yozuv.findIndex(u => !u.belgi));
  const [shart, setShart] = useState(null);
  const u = yozuv[joriy];
  const belgila = (b) => {
    if (b !== 'yoq') {
      if (!String(u.kutaman).trim()) { setShart(SHART_KUTAMAN); return; }
      if (!String(u.boldi).trim()) { setShart(SHART_BOLDI); return; }
    }
    setShart(null);
    yozYangila(joriy, { belgi: b, qilaman: qil(u, joriy), ...(b !== 'buzildi' ? { tanlandi: false, tuzatishQilindi: false, qayta: null } : {}) });
    const keyingi = yozuv.findIndex((x, k) => k !== joriy && !x.belgi);
    setJoriy(keyingi); // hammasi belgilansa — karta yopiladi, faqat ixcham chiziq qoladi (bosib tahrirlanadi, E 53)
  };
  if (!u) return (
    <span className="sb-tk">
      <span className="sb-tk-chiziq">{yozuv.map((x, i) => (
        <button key={x.yol} type="button" className={cx('sb-yz-chip', x.belgi && BELGI[x.belgi].c)} onClick={() => { setShart(null); setJoriy(i); }}>
          <i>{x.belgi ? '✓' : i + 1}</i>{tr(YOLLAR[i].nom)}{x.belgi && <em>{tr(BELGI[x.belgi].q)}</em>}
        </button>))}</span>
    </span>
  );
  const qoyilgan = !!u.belgi;
  const kutBosh = !String(u.kutaman).trim();
  const bes = joriy === 2 ? besDarsQator() : null;
  const m = MENTOR_TEKSHIRUV[joriy];
  return (
    <span className="sb-tk">
      <span className="sb-tk-chiziq">{yozuv.map((x, i) => (
        <button key={x.yol} type="button" className={cx('sb-yz-chip', i === joriy && 'on', x.belgi && BELGI[x.belgi].c)} onClick={() => { setShart(null); setJoriy(i); }}>
          <i>{x.belgi ? '✓' : i + 1}</i>{tr(YOLLAR[i].nom)}{x.belgi && <em>{tr(BELGI[x.belgi].q)}</em>}
        </button>))}</span>
      <span className="sb-tk-karta fade-step" key={x0(joriy)}>
        <span className="sb-tk-bosh"><i>{joriy + 1}</i><b>{tr(YOLLAR[joriy].nom)}</b></span>
        {bes && <span className="sb-tk-bes">{tr({ uz: '5-darsda', ru: 'На 5-м уроке' })}: {bes}</span>}
        <label className="sb-tk-m"><span className="sb-tk-n">{tr(qoyilgan ? YZ.qildim : { uz: 'Nima qilaman', ru: 'Что сделаю' })}</span>
          <AvtoMatn value={qil(u, joriy)} onChange={e => yozYangila(joriy, { qilaman: e.target.value })} /></label>
        <label className="sb-tk-m"><span className="sb-tk-n">{tr(qoyilgan ? YZ.kutdim : { uz: 'Nima kutaman', ru: 'Что ожидаю' })}</span>
          <AvtoMatn value={u.kutaman} placeholder={tr({ uz: "Talab bo'yicha: ekranda yoki Neon'da nima ko'rinadi?", ru: 'По требованию: что будет видно на экране или в Neon?' })} onChange={e => { setShart(null); yozYangila(joriy, { kutaman: e.target.value }); }} /></label>
        <label className={cx('sb-tk-m', kutBosh && 'qulf')} onClick={() => { if (kutBosh) setShart(SHART_KUTAMAN); }}><span className="sb-tk-n">{tr(YZ.boldi)}</span>
          <AvtoMatn value={u.boldi} disabled={kutBosh} placeholder={tr({ uz: "Ko'rganingiz — taxmin emas", ru: 'Что увидели — не догадка' })} onChange={e => { setShart(null); yozYangila(joriy, { boldi: e.target.value }); }} /></label>
        <span className="sb-tk-btn">
          {['buzildi', 'buzilmadi', 'yoq'].map(b => <button key={b} type="button" className={cx('sb-belgi', BELGI[b].c, u.belgi === b && 'on')} onClick={() => belgila(b)}>{tr(BELGI[b].t)}</button>)}
          <Yordam sarlavha={{ uz: 'Mentor misolidagi yozuv', ru: 'Запись из примера Ментора' }} satrlar={[
            { uz: `${YZ.qildim.uz}: ${m.qildim.uz}`, ru: `${YZ.qildim.ru}: ${m.qildim.ru}` },
            { uz: `${YZ.kutdim.uz}: ${m.kutdim.uz}`, ru: `${YZ.kutdim.ru}: ${m.kutdim.ru}` },
            { uz: `${YZ.boldi.uz}: ${m.boldi.uz}`, ru: `${YZ.boldi.ru}: ${m.boldi.ru}` },
            { uz: `Belgi: ${BELGI[m.belgi].q.uz}`, ru: `Метка: ${BELGI[m.belgi].q.ru}` }]} />
        </span>
        <span className="sb-tk-ost">{tr({ uz: "«Buzilmadi» — shu urinishda kutilgani bo'ldi; boshqa paytda chiqmaydi degani emas.", ru: '«Не сломалось» — в этой попытке произошло ожидаемое; это не значит, что в другой раз не проявится.' })}</span>
        {shart && <span className="sb-xato" role="status">{tr(shart)}</span>}
      </span>
    </span>
  );
};
const x0 = (i) => 'k' + i;
const MiniTel = ({ web }) => (
  <span className="sb-mini">{web ? <><span className="sb-br">….netlify.app</span><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b></> : <b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b>}</span>
);
const A1Natija = ({ web }) => (
  <div className="sb-nat">
    <MiniTel web={web} />
    {MENTOR_TEKSHIRUV.map((m, i) => (
      <div key={i} className={cx('sb-mk', m.belgi === 'buzildi' && 'err')}>
        <span className="sb-mk-b"><i>{i + 1}</i><b>{tr(YOLLAR[i].nom)}</b><BelgiY b={m.belgi} /></span>
        <span className="sb-mk-q"><em>{tr(YZ.qildim)}:</em> {tx(m.qildim)}</span>
        <span className="sb-mk-q"><em>{tr(YZ.kutdim)}:</em> {tx(m.kutdim)}</span>
        <span className="sb-mk-q"><em>{tr(YZ.boldi)}:</em> {tx(m.boldi)}</span>
      </div>
    ))}
  </div>
);
const ScreenA1 = (props) => {
  const tk = useTrek();
  const tor = useTor();
  const { yozuv } = useDars();
  const [joy, setJoy] = useState({});
  const [joy2, setJoy2] = useState({});
  const belgili = yozuv.filter(u => u.belgi).length;
  const buzildiSoni = yozuv.filter(u => u.belgi === 'buzildi').length;
  const buzilmadiSoni = yozuv.filter(u => u.belgi === 'buzilmadi').length;
  const yoqSoni = yozuv.filter(u => u.belgi === 'yoq').length;
  const toliq = belgili === 5;
  const doneText = !toliq ? null : buzildiSoni > 0 ? { uz: 'Tekshiruv yozildi: topilganlar keyingi blokda tuzatiladi.', ru: 'Проверка записана: найденное исправите в следующем блоке.' }
    : buzilmadiSoni > 0 ? { uz: "Tekshirilgan yo'llarda bu safar topilma chiqmadi — bu ham natija.", ru: 'На проверенных путях в этот раз находок нет — это тоже результат.' } : null;
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z mahsulotingiz", ru: 'Практика 1 · ваш продукт' }}
      title={{ uz: <>Mahsulotingizni <span className="italic" style={{ color: T.accent }}>besh yo'l bo'yicha</span> tekshirib yozing.</>, ru: <>Проверьте свой продукт <span className="italic" style={{ color: T.accent }}>по пяти путям</span> и запишите.</> }}
      mentor={{ uz: "Bu blokda kod yozilmaydi: agent faqat tekshiruvga yordam beradi, ko'rish va yozuv — sizda; «1 · Ochish»dan boshlang.", ru: 'В этом блоке код не пишем: агент только помогает с проверкой, смотрите и записываете вы; начните с «1 · Открыть».' }}
      qulf={(n) => n === 2 && !toliq}
      qulfSabab={{ uz: 'Besh karta belgilangach ochiladi.', ru: 'Откроется, когда отмечены пять карточек.' }}
      ochiqShart={belgili >= 3}
      nishonShart={(n) => n >= 4 && toliq}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tx({ uz: "Antigravity'da o'z repo'ngizni oching — 10-darsda to'xtagan joyingizdan (11-dars repo'ga yozmagan). Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.", ru: 'Откройте свой репозиторий в Antigravity — с того места, где остановились на 10-м уроке (11-й урок в репозиторий не писал). В терминале `git status`: файлов `.env` в списке быть не должно.' })}
          <Band><TrekTanlov tk={tk} />{tx({ uz: "Mobil trekda `npx expo start` ishlab tursin, ilova telefoningizda Expo Go'da ochiq bo'lsin; web-trekda saytingiz brauzerda ochiq tursin.", ru: 'В мобильном треке пусть работает `npx expo start`, приложение открыто на телефоне в Expo Go; в веб-треке сайт открыт в браузере.' })}</Band>
          <Band>{tr({ uz: "Besh yo'l — sizning mahsulotingizda: 1 kirish va ro'yxat · 2 asosiy harakat (mahsulotingizdagi asosiy ish) · 3 to'lov oqimi — mashq to'lovda to'landi, rad va ikki marta yuborish · 4 taklif havolasi · 5 eslatma yoki Telegram xabari — qaysi biri bo'lsa.", ru: 'Пять путей — в вашем продукте: 1 вход и регистрация · 2 основное действие (основное дело в вашем продукте) · 3 поток оплаты — в учебной оплате оплачено, отказ и двойная отправка · 4 пригласительная ссылка · 5 напоминание или сообщение Telegram — что есть.' })}</Band>
          <Band>{tr({ uz: "Biror yo'l mahsulotingizda hali bo'lmasa — kartasida ", ru: 'Если какого-то пути в продукте пока нет — в его карточке выберите ' })}<b>{tr(BELGI.yoq.t)}</b>{tr({ uz: " ni tanlaysiz: bu «buzilmadi» emas.", ru: ': это не «не сломалось».' })}</Band>
          <Band><b>{tr({ uz: "Tekshirish faqat o'z mahsulotingizda va tekshiruv uchun ochilgan hisoblarda: haqiqiy foydalanuvchining hisobi va boshqa odamning mahsuloti ishlatilmaydi.", ru: 'Проверять только в своём продукте и в аккаунтах, открытых для проверки: аккаунт настоящего пользователя и чужой продукт не используются.' })}</b> {tr({ uz: "Bugun kod o'zgarmaydi.", ru: 'Сегодня код не меняется.' })}</Band>
          <Band>{tr({ uz: "Taklif tekshiruvidagi yangi hisob bilan asosiy ishni qilmang — aks holda o'zingizga mukofot yozilib qoladi.", ru: 'Не делайте основное дело новым аккаунтом из проверки приглашения — иначе награда запишется вам самим.' })}</Band></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобку (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' })}
          <Band><b>{tr({ uz: "Har yo'lda avval nima kutishingizni yozasiz, keyin bajarib, ko'rganingizni yozasiz va belgi qo'yasiz.", ru: 'На каждом пути сначала записываете, чего ждёте, потом выполняете, записываете увиденное и ставите метку.' })}</b></Band>
          <SbPrompt satrlar={A1_PROMPT} joylar={A1_JOY} qiymat={joy} onYoz={(id, v) => setJoy(o => ({ ...o, [id]: v }))} />
          <Yordam sarlavha={{ uz: 'Mentor misolidagi prompt va keyingi ikki xabar', ru: 'Промпт из примера Ментора и два следующих сообщения' }} satrlar={A1_YORDAM} /></> },
        { h: { uz: 'Besh tekshiruv', ru: 'Пять проверок' }, t: <>{tr(tor ? { uz: "pastda kartalar bittadan: har kartada ", ru: 'ниже карточки по одной: в каждой ' } : { uz: "chapda kartalar bittadan: har kartada ", ru: 'слева карточки по одной: в каждой ' })}<b>{tr({ uz: '«Nima qilaman»', ru: '«Что сделаю»' })}</b>{tr({ uz: " (oldindan yozilgan, tahrirlanadi) va ", ru: ' (написано заранее, редактируется) и ' })}<b>{tr({ uz: '«Nima kutaman»', ru: '«Что ожидаю»' })}</b>{tr({ uz: " — ", ru: ' — ' })}<b>{tr({ uz: 'tekshirishdan oldin', ru: 'до проверки' })}</b>{tr({ uz: " yozing; keyin bajaring va ", ru: ' напишите; потом выполните и в строку ' })}<b>{tr(YZ.boldi)}</b>{tr({ uz: " qatoriga ko'rganingizni yozing; oxirida belgi: «Buzildi» · «Buzilmadi» · «Mahsulotimda hali yo'q».", ru: ' запишите увиденное; в конце метка: «Сломалось» · «Не сломалось» · «В моём продукте пока нет».' })}
          <Band>{tr({ uz: "O'zgarishni boshqa hisob qilishi kerak bo'lsa: sherik — o'z hisobidan, o'z telefonida · web-trekda — kompyuterdagi yashirin oynada ikkinchi tekshiruv akkaunti bilan · bo'lmasa — agent («Qil»).", ru: 'Если изменение должен сделать другой аккаунт: партнёр — со своего аккаунта, на своём телефоне · в веб-треке — вторым тестовым аккаунтом в скрытом окне на компьютере · иначе — агент («Делай»).' })}</Band>
          <Band>{tr({ uz: "Formadan o'zingiz ochgan tekshiruv akkauntlarining loginini yozib boring — 3-amaliyot oxirida ular o'chiriladi.", ru: 'Записывайте логины тестовых аккаунтов, которые вы открыли через форму, — в конце практики 3 они удаляются.' })}</Band>
          <TekshiruvKartalar />
          <Kulrang>{tx({ uz: "Xato chiqsa — bu ham natija: uni «Nima bo'ldi» qatoriga yozing. Agentga faqat xato qatorini yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Nima bo'lganini ayt, hech narsani o'zgartirma.»", ru: 'Если вышла ошибка — это тоже результат: запишите её в строку «Что получилось». Агенту отправляйте только строку ошибки (не значения `.env`, токены и ключи): «Вышла такая ошибка: {ошибка}. Скажи, что случилось, ничего не меняй.»' })}</Kulrang></> },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "besh yozuvni o'qing: «Nima bo'ldi» — ko'rganingiz; har «Buzildi» va «Buzilmadi» o'sha yo'l talabi bilan solishtirilgan («Nima kutdim» — talabdagi natija, taxmin emas); «Mahsulotimda hali yo'q» — faqat haqiqatan yo'q yo'lda.", ru: 'прочтите пять записей: «Что получилось» — увиденное; каждое «Сломалось» и «Не сломалось» сравнено с требованием пути («Что ожидал» — результат по требованию, не догадка); «В моём продукте пока нет» — только для пути, которого действительно нет.' })}
          <Band>{tr({ uz: 'Keyin agentga:', ru: 'Потом агенту:' })}</Band>
          <SbPrompt satrlar={A1_LOGIN} joylar={A1_LOGIN_JOY} qiymat={joy2} onYoz={(id, v) => setJoy2(o => ({ ...o, [id]: v }))} />
          <Kulrang>{tr({ uz: "Ro'yxat 3-amaliyot oxirida kerak bo'ladi.", ru: 'Список понадобится в конце практики 3.' })}</Kulrang></> }
      ]}
      natija={<A1Natija web={tk.web} />}
      ortda={{ uz: "Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-12-start` — oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. Bu — tekshiruvdan oldingi kod; tuzatilgan holati — `m13-dars-12-done`. `backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz.", ru: 'Отстали — откройте пример Ментора вне своего репозитория, в новой папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-12-start` — последнюю команду запускайте только в этой новой папке: она стирает изменения в папке. Это код до проверки; исправленное состояние — `m13-dars-12-done`. В `backend/.env` и `mobil/.env` впишите свои значения.' }}
      ulgur={{ uz: "Ulgurmasangiz: uchta karta belgilangach «Davom etish» ochiladi — qolganini 3-amaliyotdan oldin bajaring; ulgurmagan yo'l `XATOLAR.md` da «Tekshirilmagan yo'llar» qatoriga yoziladi. Blok besh karta va 4-band «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: «Продолжить» откроется после трёх отмеченных карточек — остальные сделайте до практики 3; неуспетый путь запишется в `XATOLAR.md` в строку «Непроверенные пути». Блок засчитается после пяти карточек и «Готово» в пункте 4.' }}
      doneText={doneText}
      pastQator={toliq && yoqSoni > 0 ? <p className="sb-ost">{tr({ uz: `Mahsulotingizda hali yo'q yo'llar tekshirilmadi: ${yoqSoni} ta.`, ru: `Пути, которых пока нет в продукте, не проверены: ${yoqSoni}.` })}</p> : null}
      ustoz={[
        { uz: "5-tekshiruvda agent Database'da tekshiruv o'yinining vaqtini suradi — Render va Neon bilan ishlashi pilotda tekshiriladi. «Bir vaqtda» ochish bir urinishda chiqmasligi mumkin — ikki-uch marta qaytarish mumkin, har urinish yozuvga kiradi. Web-trekda 5-yo'l — Telegram xabari (trekka bog'liq emas) yoki 12-Moduldagi «Siz yo'q paytingizda» qatori.", ru: 'В 5-й проверке агент сдвигает время тестовой игры в Database — работа с Render и Neon проверяется на пилоте. Одновременное открытие может не проявиться с одной попытки — можно повторить два-три раза, каждая попытка входит в запись. В веб-треке 5-й путь — сообщение Telegram (не зависит от трека) или строка «Siz yo\'q paytingizda» из 12-го модуля.' }
      ]} />
  );
};

// --- 2-amaliyot: eng muhim topilma (tayyor talab + 2 joy; biri yozuvdan oldindan)
const A2_PROMPT = [
  { uz: "Qayerda: yozuvdagi topilmaga tegishli fayllar — avval sababini top, keyin faqat kerakli joyni o'zgartir.", ru: 'Где: файлы, относящиеся к находке из записи, — сначала найди причину, потом меняй только нужное место.' },
  { uz: "Nima qilsin: pastdagi har topilmani tuzat: mahsulot «Nima kutdim» qatoridagidek ishlasin. Har topilmaning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.", ru: 'Что сделать: исправь каждую находку ниже: продукт должен работать как в строке «Что ожидал». Причину каждой находки скажи одной фразой и скажи, какой файл изменил.' },
  { uz: '{tanlangan topilmalar}', ru: '{выбранные находки}' },
  { uz: "Nima buzilmasin: yangi funksiya, yangi tugma yoki yangi ekran qo'shma — faqat topilmani tuzat. {avvalgidek ishlashi kerak bo'lgan yo'llar} avvalgidek ishlasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: не добавляй новую функцию, новую кнопку или новый экран — исправь только находку. {пути, которые должны работать как раньше} пусть работают как раньше. Не трогай файлы `.env`. Больше ничего не трогай, скажи, какие файлы изменились.' }
];
const A2_JOY = [{ id: 'avval', joy: { uz: "{avvalgidek ishlashi kerak bo'lgan yo'llar}", ru: '{пути, которые должны работать как раньше}' }, namuna: { uz: "masalan: kirish va ro'yxat, o'yin e'loni va qo'shilish, to'lov oqimi", ru: 'например: вход и регистрация, объявление игры и присоединение, поток оплаты' } }];
const A2_YORDAM = [
  { uz: "Qayerda: `backend/` — «O'yinlar» so'ralganda keyingi «Doimiy o'yin» yaratiladigan joy (va uning jadvali). Avval sababini top, keyin faqat kerakli joyni o'zgartir.", ru: 'Где: `backend/` — место, где при запросе «O\'yinlar» создаётся следующая «Doimiy o\'yin» (и её таблица). Сначала найди причину, потом меняй только нужное место.' },
  { uz: "Nima qilsin: pastdagi har topilmani tuzat: ilova «Nima kutdim» qatoridagidek ishlasin. Har topilmaning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.", ru: 'Что сделать: исправь каждую находку ниже: приложение должно работать как в строке «Что ожидал». Причину каждой находки скажи одной фразой и скажи, какой файл изменил.' },
  { uz: `5 · Telegram xabari. Nima qildim: ${MENTOR_TEKSHIRUV[4].qildim.uz} Nima kutdim: ${MENTOR_TEKSHIRUV[4].kutdim.uz} Nima bo'ldi: ${MENTOR_TEKSHIRUV[4].boldi.uz}`, ru: `5 · Сообщение Telegram. Что сделал: ${MENTOR_TEKSHIRUV[4].qildim.ru} Что ожидал: ${MENTOR_TEKSHIRUV[4].kutdim.ru} Что получилось: ${MENTOR_TEKSHIRUV[4].boldi.ru}` },
  { uz: "Nima buzilmasin: yangi funksiya, yangi tugma yoki yangi ekran qo'shma — faqat topilmani tuzat. Kirish va ro'yxat, o'yin e'loni va qo'shilish, to'lov oqimi, taklif havolasi avvalgidek ishlasin; Pro muddati ichidagi «Doimiy o'yin» har hafta e'lon qilinaversin, Telegram xabari har yangi o'yinga bitta ketsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: не добавляй новую функцию, новую кнопку или новый экран — исправь только находку. Вход и регистрация, объявление игры и присоединение, поток оплаты, пригласительная ссылка пусть работают как раньше; «Doimiy o\'yin» в пределах срока Pro пусть объявляется каждую неделю, сообщение Telegram — по одному на каждую новую игру. Не трогай файлы `.env`. Больше ничего не трогай, скажи, какие файлы изменились.' }
];
const A2_WEB = { uz: "Web-trekda «Qayerda» qatorida — topilma qayerda bo'lsa: sayt papkangiz (`prototip/`) yoki `backend/`; qolgani o'sha.", ru: 'В веб-треке в строке «Где» — там, где находка: папка сайта (`prototip/`) или `backend/`; остальное то же.' };
const A2_KUT = [{ uz: "Har tuzatishda o'zgargan qatorlarni fayl nomi va qator raqami bilan ko'rsat; har biri qaysi topilmaga tegishli — bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Для каждого исправления покажи изменённые строки с именем файла и номером строки; к какой находке относится каждая — скажи одной фразой. Код не меняй.' }];
const topilmaMatn = (u, i) => `${i + 1} · ${tr(YOLLAR[i].nom)}. ${tr(YZ.qildim)}: ${nuqta(qil(u, i))} ${tr(YZ.kutdim)}: ${nuqta(u.kutaman)} ${tr(YZ.boldi)}: ${nuqta(u.boldi)}`;
const A2Natija = () => (
  <div className="sb-nat">
    <div className="sb-agent ixcham">
      <span className="sb-chat-kim">{AGENT}</span>
      <span className="sb-pufak siz"><b>{tr({ uz: 'siz', ru: 'вы' })}</b>{tr({ uz: '5-tekshiruv kutganimdek emas — yozuvim pastda. Tuzat, sababini bir gap bilan ayt.', ru: '5-я проверка не как я ожидал — моя запись ниже. Исправь, причину скажи одной фразой.' })}</span>
      <span className="sb-pufak"><b>{AGENT}</b>{tr({ uz: "Sabab: ikki so'rov bir vaqtda kelganda ikkalasi ham keyingi o'yinni «hali yo'q» deb ko'rgan; endi Database bir sanaga bitta o'yinni qabul qiladi, ikkinchisi o'tkazib yuboriladi.", ru: 'Причина: когда два запроса пришли одновременно, оба увидели следующую игру как «ещё нет»; теперь Database принимает одну игру на одну дату, вторая пропускается.' })}</span>
    </div>
    <div className="sb-fayl">
      <span className="sb-fayl-bosh"><code>backend/</code><em className="sb-bb acc">{tr(BELGI.tuz.q)}</em></span>
      <span className="sb-fayl-q">{tr({ uz: "o'zgargan fayl — o'yinlar jadvalidagi cheklov", ru: 'изменённый файл — ограничение в таблице игр' })}</span>
      <span className="sb-fayl-q kul">{tr({ uz: "yangi tugma va ekran yo'q", ru: 'новых кнопок и экранов нет' })}</span>
    </div>
  </div>
);
const ScreenA2 = (props) => {
  const tk = useTrek();
  const { yozuv, yozYangila } = useDars();
  const buzildi = yozuv.map((u, i) => ({ u, i })).filter(x => x.u.belgi === 'buzildi');
  const bor = buzildi.length > 0;
  const tanlangan = buzildi.filter(x => x.u.tanlandi);
  const tuzBor = tanlangan.some(x => x.u.tuzatishQilindi);
  const [joy, setJoy] = useState(() => ({ avval: yozuv.map((u, i) => (u.belgi === 'buzilmadi' ? kichikNom(i) : null)).filter(Boolean).join(', ') }));
  const tanla = (i) => {
    const u = yozuv[i];
    if (!u.tanlandi && tanlangan.length >= 2) return;
    yozYangila(i, { tanlandi: !u.tanlandi, ...(u.tanlandi ? { tuzatishQilindi: false, qayta: null } : {}) });
  };
  const topilmalar = tanlangan.map(x => topilmaMatn(x.u, x.i)).join('\n');
  const ochish = { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tr({ uz: "1-amaliyotdagi «Buzildi» belgili kartalaringiz pastda. Bir yoki ikkitasini tanlang (tanlov kartalari, ko'pi bilan ikkita): bu kursda avval — maxfiy ma'lumot, pul yoki yozuvlarga zarar yetkazadigan topilma; keyin — odamning asosiy ishini to'xtatadigan; keyin — odamga noto'g'ri narsa ko'rsatadigan yoki yuboradigan (noto'g'ri Pro, keraksiz xabar, sanalmagan taklif).", ru: 'Ниже ваши карточки с меткой «Сломалось» из практики 1. Выберите одну или две (не больше двух): в этом курсе сначала — находка, вредящая секретным данным, деньгам или записям; потом — останавливающая основное дело человека; потом — показывающая или отправляющая человеку не то (неверный Pro, лишнее сообщение, неучтённое приглашение).' })}
    {bor && <span className="sb-tanla-l">{buzildi.map(({ u, i }) => (
      <button key={u.yol} type="button" className={cx('sb-tanla', u.tanlandi && 'on')} disabled={!u.tanlandi && tanlangan.length >= 2} onClick={() => tanla(i)}>
        <span className="sb-tanla-b"><i>{u.tanlandi ? '✓' : i + 1}</i><b>{tr(YOLLAR[i].nom)}</b><BelgiY b="buzildi" /></span>
        <span className="sb-tanla-m">{nuqta(u.boldi)}</span>
      </button>))}</span>}
    <Band>{tx({ uz: "Qolgani bugun tuzatilmaydi — 3-amaliyotda `XATOLAR.md` ga «qoldi» deb, sababi bilan yoziladi.", ru: 'Остальное сегодня не исправляется — в практике 3 записывается в `XATOLAR.md` как «осталось», с причиной.' })}</Band>
    <Band>{tx({ uz: "Hech biri «Buzildi» bo'lmasa — 2 va 3-bandni o'tkazib yuboring: 4-bandda faqat `git status` toza ekanini ko'rasiz.", ru: 'Если ни одной «Сломалось» нет — пропустите пункты 2 и 3: в пункте 4 только убедитесь, что `git status` чистый.' })}</Band></> };
  const prompt = { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni tekshiring (tahrirlasangiz bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'проверьте скобки (можно редактировать), нажмите «Скопировать» и отправьте в Antigravity:' })}
    <SbPrompt satrlar={A2_PROMPT} joylar={A2_JOY} qiymat={joy} onYoz={(id, v) => setJoy(o => ({ ...o, [id]: v }))} oldindan={{ [tr(A2_PROMPT[2])]: topilmalar }} />
    <Yordam sarlavha={{ uz: 'Mentor misolidagi prompt', ru: 'Промпт из примера Ментора' }} satrlar={A2_YORDAM} ost={tk.web || !tk.trek ? A2_WEB : null} /></> };
  const ishga = { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q. Agent aytgan sabablarni o'qing — ular uning so'zi.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают с тем, что сказал агент, `.env` в списке нет. Прочтите причины, названные агентом, — это его слова.' })}
    <Band>{tx({ uz: "Agent har topilma uchun qaysi faylni o'zgartirganini aytgan va u `git status` da ko'ringan bo'lsa — o'sha kartada «Tuzatish qilindi» ni belgilang: bu ish fakti — kodda o'zgartirish qilindi; to'g'riligini 3-amaliyot ko'rsatadi.", ru: 'Если агент сказал, какой файл изменил для каждой находки, и он виден в `git status`, — отметьте в этой карточке «Исправление сделано»: это факт работы — в коде сделано изменение; правильность покажет практика 3.' })}</Band>
    <span className="sb-tanla-l">{tanlangan.map(({ u, i }) => (
      <button key={u.yol} type="button" className={cx('sb-tuz', u.tuzatishQilindi && 'on')} onClick={() => yozYangila(i, { tuzatishQilindi: !u.tuzatishQilindi, qayta: null })}>
        <i>{u.tuzatishQilindi ? '✓' : i + 1}</i><b>{tr(YOLLAR[i].nom)}</b><em>{tr(BELGI.tuz.t)}</em>
      </button>))}</span>
    <Band>{tr({ uz: 'Kutayotganda agentga:', ru: 'Пока ждёте — агенту:' })}</Band>
    <SbPrompt satrlar={A2_KUT} />
    <Kulrang>{tx({ uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если вышла ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Вышла такая ошибка: {ошибка}. Исправь.»' })}</Kulrang></> };
  const tekshir = { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tx({ uz: "terminalda `git diff --stat`: o'zgargan fayllar faqat tanlangan topilmalarga tegishli. Keyin `git diff`: o'zgargan qatorlarni o'qing (agent ko'rsatgan qatorlar bilan solishtiring) — yangi tugma, yangi ekran yoki yangi jadval yo'q.", ru: 'в терминале `git diff --stat`: изменённые файлы относятся только к выбранным находкам. Потом `git diff`: прочтите изменённые строки (сравните со строками, которые показал агент) — новой кнопки, нового экрана или новой таблицы нет.' })}
    <Band>{tx({ uz: "Yangi narsa bo'lsa — agentga: «{nima} — yangi funksiya. Uni olib tashla, faqat tuzatish qolsin. O'zgargan fayllarni ayt.»", ru: 'Если есть что-то новое — агенту: «{что} — новая функция. Убери её, пусть останется только исправление. Скажи, какие файлы изменились.»' })}</Band>
    <Band>{tx({ uz: "Keyin `git add <fayl>` (`git add .` emas) → `git commit -m \"barqarorlik: tuzatish\"` → `git push`. `backend/` o'zgargan bo'lsa — Render'da yangi versiya tugashini kuting (bir necha daqiqa cho'zilishi mumkin); mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.", ru: 'Потом `git add <файл>` (не `git add .`) → `git commit -m "barqarorlik: tuzatish"` → `git push`. Если изменился `backend/` — дождитесь окончания новой версии на Render (может занять несколько минут); в мобильном треке Expo Go обычно перезагружает приложение сам (если нет — `r` в терминале); в веб-треке после push Netlify обычно обновляет сайт сам.' })}</Band></> };
  const steps = [ochish, prompt, ishga, tekshir];
  const doneText = tuzBor ? { uz: "Tuzatish qilindi, yangi narsa qo'shilmadi — natijani keyingi blok ko'rsatadi.", ru: 'Исправление сделано, нового не добавлено — результат покажет следующий блок.' }
    : !bor ? { uz: "Tuzatadigan topilma yo'q — kod o'zgarmadi.", ru: 'Находок для исправления нет — код не менялся.' } : null;
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z repo'ngiz", ru: 'Практика 2 · ваш репозиторий' }}
      title={{ uz: <>Eng muhim <span className="italic" style={{ color: T.accent }}>bir-ikki topilmani</span> tuzating.</>, ru: <>Исправьте <span className="italic" style={{ color: T.accent }}>одну-две самые важные</span> находки.</> }}
      mentor={{ uz: "Yozuvni agentga so'zma-so'z berasiz: tuzatishni u qiladi, yangi narsa qo'shilmaganini siz ko'rasiz; «1 · Ochish»dan boshlang.", ru: 'Запись вы передаёте агенту слово в слово: исправляет он, а что нового не добавлено — проверяете вы; начните с «1 · Открыть».' }}
      qulf={(n) => n === 0 && bor && tanlangan.length === 0}
      otkaz={bor ? [] : [1, 2]}
      steps={steps}
      natija={<A2Natija />}
      ulgur={{ uz: "Ulgurmasangiz: bitta topilmani tuzating — ikkinchisi 3-amaliyotda «qoldi» bo'ladi (sabab: vaqt yetmadi). «Davom etish» 4-band «Bajardim»idan keyin ochiladi (push bo'lmasa, 3-amaliyotdagi qayta tekshirish eski kodni ko'radi).", ru: 'Если не успеваете: исправьте одну находку — вторая в практике 3 станет «осталось» (причина: не хватило времени). «Продолжить» откроется после «Готово» в пункте 4 (без push перепроверка в практике 3 увидит старый код).' }}
      doneText={doneText} />
  );
};

// --- 3-amaliyot: qayta tekshiruv, `XATOLAR.md`, yangi versiya (tayyor talab + yozuv oldindan)
const A3_PROMPT = [
  { uz: "Loyiha ildizida `XATOLAR.md` yarat: pastdagi yozuvimni so'zma-so'z ko'chir. Har topilma — yo'l nomi va uch qator: usul (nima qildim), natija (nima kutdim va nima bo'ldi), holat — men yozgandek. Oxirida ikki qator: buzilmagan yo'llar va tekshirilmagan yo'llar. Boshqa faylga tegma.", ru: 'В корне проекта создай `XATOLAR.md`: перенеси мою запись ниже слово в слово. Каждая находка — название пути и три строки: способ (что сделал), результат (что ожидал и что получилось), состояние — как я написал. В конце две строки: несломанные пути и непроверенные пути. Другие файлы не трогай.' },
  { uz: "{to'liq yozuv}", ru: '{полная запись}' }
];
const holatMatn = (u) => {
  const tuz = tr(BELGI.tuz.q);
  const sabab = String(u.qoldiSabab || '').trim();
  if (u.tuzatishQilindi && u.qayta === 'takrorlanmadi') return `${tuz} · ${tr(BELGI.takrorlanmadi.q)}`;
  if (u.tuzatishQilindi && u.qayta === 'takrorlandi') return `${tuz} · ${tr(BELGI.takrorlandi.q)}` + (sabab ? ` · ${tr(BELGI.qoldi.q)} — ${sabab}` : '');
  return `${tr(BELGI.qoldi.q)} — ${sabab || '…'}`;
};
const toliqYozuv = (yozuv) => {
  const s = [];
  yozuv.forEach((u, i) => {
    if (u.belgi !== 'buzildi') return;
    s.push(`## ${i + 1} · ${tr(YOLLAR[i].nom)}`);
    s.push(`- ${tr({ uz: 'Usul', ru: 'Способ' })}: ${nuqta(qil(u, i))}`);
    s.push(`- ${tr({ uz: 'Natija', ru: 'Результат' })}: ${tr({ uz: 'kutdim', ru: 'ожидал' })} — ${String(u.kutaman || '').trim() || '—'}; ${tr({ uz: "bo'ldi", ru: 'получилось' })} — ${String(u.boldi || '').trim() || '—'}`);
    s.push(`- ${tr({ uz: 'Holat', ru: 'Состояние' })}: ${holatMatn(u)}`);
  });
  const buzilmagan = yozuv.map((u, i) => (u.belgi === 'buzilmadi' ? kichikNom(i) : null)).filter(Boolean);
  const tekshirilmagan = yozuv.map((u, i) => (u.belgi === 'yoq' || !u.belgi ? kichikNom(i) : null)).filter(Boolean);
  const yoq = tr({ uz: "yo'q", ru: 'нет' });
  s.push(`${tr({ uz: "Buzilmagan yo'llar", ru: 'Несломанные пути' })}: ${buzilmagan.length ? buzilmagan.join(' · ') : yoq}.`);
  s.push(`${tr({ uz: "Tekshirilmagan yo'llar", ru: 'Непроверенные пути' })}: ${tekshirilmagan.length ? tekshirilmagan.join(' · ') : yoq}.`);
  return s.join('\n');
};
const A3_REVERT = { uz: "Ikkinchi tuzatish ham yiqilsa (qayta tekshiruvda yana buzilsa) — agentga: «Oxirgi tuzatish commit'ini `git revert` bilan qaytar va push qil» — sinalmagan kod odamlarda qolmaydi; `XATOLAR.md` ga «qoldi — qaytarildi».", ru: 'Если и второе исправление не сработало (при перепроверке снова сломалось) — агенту: «Верни последний commit исправления через `git revert` и сделай push» — непроверенный код не остаётся у людей; в `XATOLAR.md` — «осталось — возвращено».' };
const A3_TOZALA = [{ uz: "1-amaliyotda ko'rsatgan tekshiruv akkauntlari va yozuvlari ro'yxatini yana ko'rsat. «O'chir» desam — faqat shu `id` lardagi yozuvlarni o'chir; haqiqiy foydalanuvchilarning yozuvlariga tegma.", ru: 'Снова покажи список тестовых аккаунтов и записей, который показывал в практике 1. Скажу «Удали» — удали только записи с этими `id`; записи настоящих пользователей не трогай.' }];
const A3_LENDING = [{ uz: "`lending/index.html` dagi «Android: ilovani o'rnatish» havolasini shu manzilga almashtir: {yangi havola}. Boshqa joyga tegma.", ru: 'Замени в `lending/index.html` ссылку «Android: ilovani o\'rnatish» на этот адрес: {новая ссылка}. Больше ничего не трогай.' }];
const A3Natija = () => (
  <div className="sb-nat">
    <div className="sb-mk">
      <span className="sb-mk-b"><i>5</i><b>{tr({ uz: 'Telegram xabari', ru: 'Сообщение Telegram' })}</b></span>
      <span className="sb-mk-bel"><BelgiY b="tuz" /><BelgiY b="takrorlanmadi" /></span>
    </div>
    <div className="sb-fayl sb-gh">
      <span className="sb-gh-bosh"><b>GitHub</b><code>maydon-jamoa</code><span>/</span><code>XATOLAR.md</code></span>
      <span className="sb-md">{MENTOR_XATOLAR.map((l, i) => <span key={i} className={cx('sb-md-q', l.k)}>{tr(l.t)}</span>)}</span>
    </div>
    <p className="sb-ost">{tx({ uz: "yangi versiya: Render — `backend/` · APK va brauzer ko'rinishi o'zgarmadi", ru: 'новая версия: Render — `backend/` · APK и браузерная версия не менялись' })}</p>
  </div>
);
const ScreenA3 = (props) => {
  const tk = useTrek();
  const { dars, yozuv, yozYangila, yangila } = useDars();
  const tuzlar = yozuv.map((u, i) => ({ u, i })).filter(x => x.u.belgi === 'buzildi' && x.u.tuzatishQilindi);
  const qoldilar = yozuv.map((u, i) => ({ u, i })).filter(x => qoldimi(x.u));
  const buzildiBor = yozuv.some(u => u.belgi === 'buzildi');
  const mobil = tk.trek !== 'web';
  const [joy, setJoy] = useState({});
  const qaytaTayyor = tuzlar.every(x => x.u.qayta) && qoldilar.every(x => String(x.u.qoldiSabab || '').trim());
  const doneText = !buzildiBor ? { uz: "`XATOLAR.md` tayyor: bu safar topilma chiqmadi.", ru: '`XATOLAR.md` готов: в этот раз находок нет.' }
    : qoldilar.length > 0 ? { uz: "`XATOLAR.md` tayyor: qolgan topilma sababi bilan yozildi.", ru: '`XATOLAR.md` готов: оставшаяся находка записана с причиной.' }
      : tuzlar.length > 0 && tuzlar.every(x => x.u.qayta === 'takrorlanmadi') ? { uz: "Qayta tekshirildi: topilmalar `XATOLAR.md` da, yangi versiya chiqdi.", ru: 'Перепроверено: находки в `XATOLAR.md`, новая версия вышла.' } : null;
  const steps = [
    { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tx({ uz: "«Tuzatish qilindi» belgili kartalaringiz pastda. Yangi kod ishlab turibdi: `backend/` o'zgargan bo'lsa — Render'da yangi versiya tugagan; mobil trekda Expo Go yangi kodni ko'rsatadi; web-trekda sayt yangilangan. Tekshiruv akkauntlari — 1-amaliyotdagilar.", ru: 'Ниже ваши карточки с меткой «Исправление сделано». Новый код работает: если изменился `backend/` — новая версия на Render готова; в мобильном треке Expo Go показывает новый код; в веб-треке сайт обновлён. Тестовые аккаунты — из практики 1.' })}
      {tuzlar.length > 0 && <span className="sb-tanla-l">{tuzlar.map(({ u, i }) => <span key={u.yol} className="sb-ix acc"><i>{i + 1}</i><span>{tr(YOLLAR[i].nom)}</span><BelgiY b="tuz" /></span>)}</span>}</> },
    { h: { uz: 'Qayta tekshirish', ru: 'Перепроверка' }, t: <>{tr({ uz: "har «Tuzatish qilindi» topilmani ", ru: 'каждую находку с «Исправление сделано» повторите ' })}<b>{tr({ uz: "o'sha usul bilan", ru: 'тем же способом' })}</b>{tr({ uz: " qaytaring — kartadagi «Nima qildim» qatori bo'yicha. Tanlang: «Qayta tekshiruvda takrorlanmadi» · «Qayta tekshiruvda yana buzildi».", ru: ' — по строке «Что сделал» в карточке. Выберите: «При перепроверке не повторилось» · «При перепроверке снова сломалось».' })}
      {tuzlar.length > 0 && <span className="sb-qk-l">{tuzlar.map(({ u, i }) => (
        <span key={u.yol} className="sb-qk">
          <span className="sb-qk-b"><i>{i + 1}</i><b>{tr(YOLLAR[i].nom)}</b></span>
          <span className="sb-qk-m">{tr(YZ.qildim)}: {nuqta(qil(u, i))}</span>
          <span className="sb-qk-btn sb-chorla2">{['takrorlanmadi', 'takrorlandi'].map(q => <button key={q} type="button" className={cx('sb-qayta', BELGI[q].c, u.qayta === q && 'on')} onClick={() => yozYangila(i, { qayta: q })}>{tr(BELGI[q].t)}</button>)}</span>
        </span>))}</span>}
      <Band>{tx({ uz: "Yana buzilsa — agentga bir marta: «{yo'l} qayta tekshiruvda yana buzildi: {nima bo'ldi}. Tuzat, yangi narsa qo'shma, o'zgargan fayllarni ayt.» → `git push` → o'sha usul bilan yana bir marta. Ikkinchi marta ham buzilsa — `XATOLAR.md` da «qoldi».", ru: 'Если снова сломалось — агенту один раз: «{путь} при перепроверке снова сломался: {что получилось}. Исправь, нового не добавляй, скажи, какие файлы изменились.» → `git push` → тем же способом ещё раз. Если и во второй раз сломалось — в `XATOLAR.md` «осталось».' })}</Band>
      <Band>{tr({ uz: "Har «qoldi» topilma uchun bitta qator yozing — «Nega qoldi?». Tanlanmagan topilmalar ham shu yerda «qoldi».", ru: 'Для каждой находки «осталось» напишите одну строку — «Почему осталось?». Невыбранные находки тоже здесь «осталось».' })}</Band>
      {qoldilar.length > 0 && <span className="sb-joylar">{qoldilar.map(({ u, i }) => (
        <label key={u.yol} className="sb-joy-m"><span className="sb-joy-n">{i + 1} · {tr(YOLLAR[i].nom)} — {tr({ uz: 'Nega qoldi?', ru: 'Почему осталось?' })}</span>
          <input type="text" value={u.qoldiSabab || ''} maxLength={160} placeholder={tr({ uz: 'masalan: vaqt yetmadi', ru: 'например: не хватило времени' })} onChange={e => yozYangila(i, { qoldiSabab: e.target.value })} /></label>))}</span>}</> },
    { h: { uz: 'XATOLAR.md', ru: 'XATOLAR.md' }, t: <>{tr({ uz: "«Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'нажмите «Скопировать» и отправьте в Antigravity:' })}
      <SbPrompt satrlar={A3_PROMPT} oldindan={{ [tr(A3_PROMPT[1])]: toliqYozuv(yozuv) }} />
      <Band>{tx({ uz: "`XATOLAR.md` ni yozuvingiz bilan solishtiring: har topilma bormi, «qoldi» topilma ham yozilganmi. Mos bo'lsa — `git add XATOLAR.md` → `git commit -m \"barqarorlik: XATOLAR.md\"` → `git push`.", ru: 'Сравните `XATOLAR.md` со своей записью: есть ли каждая находка, записана ли и находка «осталось». Если совпадает — `git add XATOLAR.md` → `git commit -m "barqarorlik: XATOLAR.md"` → `git push`.' })}</Band>
      <Kulrang>{tr({ uz: "Topilma yo'q bo'lsa ham fayl yoziladi — tekshirilgan yo'llar «buzilmagan» qatorida, «Mahsulotimda hali yo'q» va ulgurilmagan yo'llar «tekshirilmagan» qatorida.", ru: 'Файл пишется, даже если находок нет: проверенные пути — в строке «несломанные», «В моём продукте пока нет» и неуспетые — в строке «непроверенные».' })}</Kulrang></> },
    { h: { uz: 'Yangi versiya', ru: 'Новая версия' }, t: <>{tr({ uz: "odamlar ishlatadigan versiya o'zgargan qismga qarab chiqadi:", ru: 'версия, которой пользуются люди, выходит в зависимости от изменённой части:' })}
      <Band>{tx({ uz: "`backend/` — 2-amaliyotdagi `git push` bilan Render'da chiqdi; ilova va brauzer ko'rinishi o'sha Backend'ga ulanadi — ular uchun yangi fayl kerak emas.", ru: '`backend/` — вышел на Render с `git push` из практики 2; приложение и браузерная версия подключаются к тому же Backend — для них новый файл не нужен.' })}</Band>
      {mobil && <>
        <span className="sb-trek-q">{['ha', 'yoq'].map(v => <button key={v} type="button" className={cx('sb-mobil', dars.mobil === v && 'on')} onClick={() => yangila({ mobil: v, ...(v === 'yoq' ? { navbatda: null } : {}) })}>{tx(v === 'ha' ? { uz: '`mobil/` o\'zgardi', ru: '`mobil/` изменился' } : { uz: 'Faqat `backend/`', ru: 'Только `backend/`' })}</button>)}</span>
        {dars.mobil === 'ha' && <>
          <Band>{tx({ uz: "Mobil trekda `mobil/` o'zgargan bo'lsa — APK o'zi yangilanmaydi: `cd mobil` → `eas build -p android --profile preview` (bepul rejada Android build soni cheklangan — keraksiz qayta tayyorlamang). Navbatni kutmang: «Bajardim»ni bosing va davom eting.", ru: 'Если в мобильном треке изменился `mobil/` — APK сам не обновится: `cd mobil` → `eas build -p android --profile preview` (на бесплатном плане число Android-сборок ограничено — не пересобирайте зря). Очередь не ждите: нажмите «Готово» и продолжайте.' })}</Band>
          <Band>{tr({ uz: "Fayl tayyor bo'lgach agentga:", ru: 'Когда файл будет готов — агенту:' })}</Band>
          <SbPrompt satrlar={A3_LENDING} joylar={[{ id: 'havola', joy: { uz: '{yangi havola}', ru: '{новая ссылка}' }, namuna: { uz: 'masalan: expo.dev havolasi', ru: 'например: ссылка expo.dev' } }]} qiymat={joy} onYoz={(id, v) => setJoy(o => ({ ...o, [id]: v }))} />
          <Band>{tx({ uz: "→ `git push`. Dars oxirigacha tayyor bo'lmasa — keyingi dars boshida. Brauzer ko'rinishi (iPhone yo'li) push'dan keyin o'zi yangilanmaydi: `npx expo export -p web`, keyin `netlify deploy --prod --dir dist`.", ru: '→ `git push`. Если до конца урока не готово — в начале следующего урока. Браузерная версия (путь для iPhone) после push сама не обновляется: `npx expo export -p web`, потом `netlify deploy --prod --dir dist`.' })}</Band>
        </>}
      </>}
      {tk.trek !== 'mobil' && <Band>{tx({ uz: "web-trekda — push'dan keyin saytni telefonda oching: tuzatish ko'rinmasa, sayt buyruq bilan chiqarilgan — qayta `netlify deploy --prod`.", ru: 'в веб-треке — после push откройте сайт на телефоне: если исправления не видно, сайт выкладывался командой — снова `netlify deploy --prod`.' })}</Band>}
      <Band>{tx({ uz: "Odamlar ochadigan manzilda (brauzer ko'rinishi yoki saytingiz) tuzatilgan yo'lni bir marta qaytaring. `backend/` dan boshqa joy o'zgarmagan bo'lsa — shu yerdagi qaytarish yetadi.", ru: 'По адресу, который открывают люди (браузерная версия или ваш сайт), один раз повторите исправленный путь. Если кроме `backend/` ничего не менялось — этого повтора достаточно.' })}</Band>
      <Band>{tx(A3_REVERT)}</Band>
      <Band>{tr({ uz: 'Oxirida tozalash — agentga:', ru: 'В конце уборка — агенту:' })}</Band>
      <SbPrompt satrlar={A3_TOZALA} />
      <Kulrang>{tr({ uz: "Ro'yxatni o'qing, keyin «O'chir» deng.", ru: 'Прочтите список, потом скажите «Удали».' })}</Kulrang></> }
  ];
  const apk = mobil && dars.mobil === 'ha';
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 3 · qayta tekshiruv va yangi versiya', ru: 'Практика 3 · перепроверка и новая версия' }}
      title={{ uz: <>Qayta tekshiring va topilmalarni <span className="italic" style={{ color: T.accent }}><code className="qcode">XATOLAR.md</code> ga</span> yozing.</>, ru: <>Перепроверьте и запишите находки <span className="italic" style={{ color: T.accent }}>в <code className="qcode">XATOLAR.md</code></span>.</> }}
      mentor={{ uz: "Tuzatishni o'sha usul bilan qayta ko'rasiz, keyin hamma topilma faylga yoziladi; «1 · Ochish»dan boshlang.", ru: 'Исправление вы перепроверяете тем же способом, потом все находки записываются в файл; начните с «1 · Открыть».' }}
      qulf={(n) => n === 1 && !qaytaTayyor}
      qulfSabab={{ uz: "Har tuzatishga qayta tekshiruv belgisi va har «qoldi»ga sabab yozilgach ochiladi.", ru: 'Откроется, когда у каждого исправления есть метка перепроверки, а у каждого «осталось» — причина.' }}
      ochiqQadam={3}
      nishonShart={(n) => n >= 3}
      steps={steps}
      natija={<A3Natija />}
      ulgur={{ uz: "Ulgurmasangiz: `XATOLAR.md` birinchi, yangi versiya keyin; o'rnatish fayli havolasi — keyingi dars boshida. Tozalashni o'tkazib yubormang. «Davom etish» 3-band «Bajardim»idan keyin ochiladi (`XATOLAR.md` push qilingach); blok bayrog'i — 4-band «Bajardim»idan.", ru: 'Если не успеваете: сначала `XATOLAR.md`, новая версия потом; ссылка на установочный файл — в начале следующего урока. Не пропускайте уборку. «Продолжить» откроется после «Готово» в пункте 3 (когда `XATOLAR.md` запушен); флаг блока — после «Готово» в пункте 4.' }}
      doneText={doneText}
      izoh={apk ? { uz: "APK o'zi yangilanmaydi: eski faylni o'rnatganlar tuzatishni yangisini o'rnatgach ko'radi.", ru: 'APK сам не обновляется: установившие старый файл увидят исправление, когда установят новый.' } : null}
      pastQator={apk ? <span className="sb-trek-q sb-navbat-q">{[{ v: false, t: { uz: 'Havola almashtirildi', ru: 'Ссылка заменена' } }, { v: true, t: { uz: 'Fayl navbatda', ru: 'Файл в очереди' } }].map(o => (
        <button key={String(o.v)} type="button" className={cx('sb-navbat', dars.navbatda === o.v && 'on')} onClick={() => yangila({ navbatda: o.v })}>{tr(o.t)}</button>))}</span> : null}
      ustoz={[
        { uz: "O'rnatish fayli navbati podium va arena paytida yuradi. Tekshiruv akkauntlarini o'chirishdan oldin o'quvchi ro'yxatni o'qiganini ko'ring — ro'yxatda haqiqiy foydalanuvchi bo'lmasligi kerak.", ru: 'Очередь установочного файла идёт во время подиума и арены. Перед удалением тестовых аккаунтов убедитесь, что ученик прочитал список, — в нём не должно быть настоящих пользователей.' }
      ]} />
  );
};

// ===== TAKRORLASH — kartochkalar alohida ekran (SABOQ 12, 16): Mentor yo'q, «Kartani bosing — javob ochiladi» =====
const KARTALAR = [
  { front: { uz: 'Barqarorlik tekshiruvi nima?', ru: 'Что такое проверка стабильности?' }, back: { uz: "Asosiy yo'llarni buzish yozuvi bilan tekshirish", ru: 'Проверка основных путей с записью поломки' }, note: { uz: "Bu darsda besh yo'l: kirish va ro'yxat, asosiy harakat, to'lov oqimi, taklif havolasi, eslatma yoki Telegram xabari", ru: 'На этом уроке пять путей: вход и регистрация, основное действие, поток оплаты, пригласительная ссылка, напоминание или сообщение Telegram' } },
  { front: { uz: "Nega eski yo'llar ham qayta tekshiriladi?", ru: 'Почему старые пути тоже перепроверяются?' }, back: { uz: "Keyin qo'shilgan ish ularga tegishi mumkin", ru: 'Добавленная позже работа может их задеть' }, note: { uz: "Mentor misolida taklif kodi ro'yxatdan o'tish formasiga qo'shilgan", ru: 'В примере Ментора код приглашения добавлен в форму регистрации' } },
  { front: { uz: 'Buzish yozuvida qaysi uch qator bor?', ru: 'Какие три строки в записи поломки?' }, back: { uz: "Nima qildim, nima kutdim, nima bo'ldi", ru: 'Что сделал, что ожидал, что получилось' }, note: { uz: 'Oxirida belgi: buzildi yoki buzilmadi', ru: 'В конце метка: сломалось или не сломалось' } },
  { front: { uz: '«Nima kutaman» qachon yoziladi?', ru: 'Когда пишется «Что ожидаю»?' }, back: { uz: 'Tekshirishdan oldin', ru: 'До проверки' }, note: { uz: "Shunda natija bilan solishtirsa bo'ladi", ru: 'Тогда можно сравнить с результатом' } },
  { front: { uz: "Mahsulotingizda yo'q yo'lga qaysi belgi qo'yiladi?", ru: 'Какую метку ставят пути, которого нет в продукте?' }, back: { uz: "«Mahsulotimda hali yo'q»", ru: '«В моём продукте пока нет»' }, note: { uz: "U «buzilmadi» emas: bu yo'l tekshirilmagan", ru: 'Это не «не сломалось»: путь не проверен' } },
  { front: { uz: 'Mentor misolida besh tekshiruvdan nechtasida ilova buzildi?', ru: 'В скольких из пяти проверок сломалось приложение в примере Ментора?' }, back: { uz: 'Bittasida: Telegram xabari', ru: 'В одной: сообщение Telegram' }, note: { uz: "Kirish, asosiy harakat, to'lov oqimi va taklif havolasi — buzilmadi", ru: 'Вход, основное действие, поток оплаты и пригласительная ссылка — не сломались' } },
  { front: { uz: "«Buzilmadi» — bu yo'l hech qachon buzilmaydi degani-mi?", ru: '«Не сломалось» — значит, этот путь никогда не сломается?' }, back: { uz: "Yo'q — shu urinishda kutilgani bo'ldi", ru: 'Нет — в этой попытке произошло ожидаемое' }, note: { uz: "Shuning uchun har yangi ishdan keyin yo'l qayta tekshiriladi", ru: 'Поэтому после каждой новой работы путь перепроверяется' } },
  { front: { uz: "Mentor misolida ikki telefon bir vaqtda «O'yinlar»ni ochganda nima bo'ldi?", ru: 'Что случилось в примере Ментора, когда два телефона одновременно открыли «O\'yinlar»?' }, back: { uz: "Keyingi «Doimiy o'yin» ikki marta yaratildi, Telegram xabari ikki marta ketdi", ru: 'Следующая «Doimiy o\'yin» создана дважды, сообщение Telegram ушло дважды' }, note: { uz: "Tuzatish: Database bir sanaga bitta o'yinni qabul qiladi — 3-darsdagi takror xabar kabi: bitta ish bir marta", ru: 'Исправление: Database принимает одну игру на одну дату — как с повторным сообщением на 3-м уроке: одно дело — один раз' } },
  { front: { uz: "Barqarorlik kunida yangi funksiya qo'shiladimi?", ru: 'Добавляют ли новую функцию в день стабильности?' }, back: { uz: "Yo'q — faqat yozuvdagi topilma tuzatiladi", ru: 'Нет — исправляется только находка из записи' }, note: { uz: "Yangi funksiya yana tekshirilmagan joy qo'shadi", ru: 'Новая функция добавляет ещё одно непроверенное место' } },
  { front: { uz: 'Tuzatishga ulgurmagan topilma nima qilinadi?', ru: 'Что делают с находкой, которую не успели исправить?' }, back: { uz: "`XATOLAR.md` ga «qoldi» deb, sababi bilan yoziladi", ru: 'Записывают в `XATOLAR.md` как «осталось», с причиной' }, note: { uz: 'Qolgan topilma yashirilmaydi', ru: 'Оставшаяся находка не скрывается' } },
  { front: { uz: "«Tuzatish qilindi» va «qayta tekshiruvda takrorlanmadi» farqi nimada?", ru: 'Чем отличаются «Исправление сделано» и «при перепроверке не повторилось»?' }, back: { uz: "Birinchisi — kod o'zgargani, ikkinchisi — o'sha usul bilan ko'rilgan natija", ru: 'Первое — код изменился, второе — результат, увиденный тем же способом' }, note: { uz: 'Ikkalasi alohida belgilanadi', ru: 'Оба отмечаются отдельно' } },
  { front: { uz: "Ilova kodi o'zgarsa, APK o'rnatganlarga yangi versiya qanday yetadi?", ru: 'Если изменился код приложения, как новая версия дойдёт до установивших APK?' }, back: { uz: 'Yangi o\'rnatish fayli va lendingdagi yangi havola orqali', ru: 'Через новый установочный файл и новую ссылку на лендинге' }, note: { uz: "APK o'zi yangilanmaydi; faqat `backend/` o'zgarsa — Render'ning o'zi yetadi", ru: 'APK сам не обновляется; если изменился только `backend/` — хватает Render' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('sb-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="sb-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204, texnik darslar standarti; E 50 — «Bugungi asosiy fikr» yo'q). Uyga vazifa yo'q (loyiha kuni). Sarlavha — sakkiz holat, har biri rost (E 54) =====
// PM-109 (SABOQ P4): erta tugatgan o'quvchi — AI «tekshiruvchi» rolida buzish holatlarini beradi, o'quvchi natijani o'zi yozadi (MD da matn yo'q — «MD ga taklif»)
const AI_SOROV = { uz: "Sen tekshiruvchisan. Mahsulot: Maydon Jamoa — mahalladagi mini-futbol uchun jamoa yig'adigan ilova; unda kirish va ro'yxat, o'yin e'loni va qo'shilish, to'lov oqimi (test rejim), taklif havolasi va Telegram xabari bor. Menga navbat bilan besh yo'l uchun bittadan buzish holatini ber. Har holat uchun men buzish yozuvini yozaman: nima qildim, nima kutdim, nima bo'ldi va belgi — buzildi, buzilmadi yoki «Mahsulotimda hali yo'q». Sen yozuvim to'g'riligini bir gap bilan ayt: «Nima kutdim» talabga mosmi, belgi to'g'ri qo'yilganmi. Yangi funksiya taklif qilma. Karta ma'lumoti va kalit so'rama. Birinchi holatni ber.",
  ru: 'Ты проверяющий. Продукт: Maydon Jamoa — приложение для сбора команды на мини-футбол в махалле; в нём есть вход и регистрация, объявление игры и присоединение, поток оплаты (тестовый режим), пригласительная ссылка и сообщение Telegram. Дай мне по очереди по одному случаю поломки для пяти путей. Для каждого я пишу запись поломки: что сделал, что ожидал, что получилось и метку — сломалось, не сломалось или «В моём продукте пока нет». Скажи одной фразой, верна ли запись: соответствует ли «Что ожидал» требованию, правильно ли поставлена метка. Новых функций не предлагай. Данные карты и ключи не спрашивай. Дай первый случай.' };
const AiDavomCard = () => {
  const [ok, setOk] = useState(false);
  const kochir = async () => { if (await nusxala(tr(AI_SOROV))) { setOk(true); setTimeout(() => setOk(false), 1800); } };
  return (
    <div className="card sb-ai fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Erta tugatdingizmi? AI bilan davom eting', ru: 'Закончили раньше? Продолжите с AI' })}</div>
      <p className="sb-ai-m">{tr({ uz: "gemini.google.com'ni oching, pastdagi so'rovni yuboring — AI tekshiruvchi bo'lib besh yo'l uchun buzish holatlarini beradi. Har biriga yozuvni o'zingiz yozing; adashgan joyingizni «Orqaga» bilan 3, 5-ekranlarda qayta ko'ring.", ru: 'Откройте gemini.google.com, отправьте запрос ниже — AI как проверяющий даст случаи поломки для пяти путей. Запись для каждого пишите сами; где ошиблись — посмотрите снова на экранах 3, 5 через «Назад».' })}</p>
      <pre className="sb-ai-sorov">{tr(AI_SOROV)}</pre>
      <button type="button" className="q-chip sb-ai-btn" onClick={kochir}>{ok ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: "So'rovni nusxalash", ru: 'Скопировать запрос' })}</button>
    </div>
  );
};
const YAKUN_SARLAVHA = {
  takrorlanmadi: { uz: 'Tuzatish qilindi va qayta tekshiruvda takrorlanmadi.', ru: 'Исправление сделано, при перепроверке не повторилось.' },
  topilmaYoq: { uz: "Tekshirilgan yo'llarda bu safar topilma chiqmadi.", ru: 'На проверенных путях в этот раз находок нет.' },
  qoldi: { uz: '`XATOLAR.md` tayyor — qolgan topilma ochiq yozilgan.', ru: '`XATOLAR.md` готов — оставшаяся находка записана открыто.' },
  qaytaYoq: { uz: 'Tuzatish qilindi — qayta tekshirish hali qilinmagan.', ru: 'Исправление сделано — перепроверки ещё не было.' },
  tuzatishYoq: { uz: 'Tekshiruv yozildi — tuzatish hali qilinmagan.', ru: 'Проверка записана — исправления ещё не было.' },
  xatolarYoq: { uz: 'Tekshiruv yozildi — `XATOLAR.md` hali yozilmagan.', ru: 'Проверка записана — `XATOLAR.md` ещё не написан.' },
  tugamagan: { uz: "Tekshiruv hali tugamagan — qolgan yo'llar kutyapti.", ru: 'Проверка ещё не закончена — остальные пути ждут.' },
  hech: { uz: 'Besh tekshiruv hali yozilmagan.', ru: 'Пять проверок ещё не записаны.' }
};
const yakunHolat = (answers, yozuv) => {
  const blok = (id) => { const i = SCREEN_META.findIndex(m => m.id === id); return !!(answers[i] && answers[i].solved); };
  // besh karta belgilangan bo'lsa — 1-blok yozilgan (4-band «Bajardim»i bosilmagan bo'lsa ham)
  const a1 = blok('a1') || (yozuv.length === 5 && yozuv.every(u => u.belgi)), a2 = blok('a2'), a3 = blok('a3');
  const buzildi = yozuv.filter(u => u.belgi === 'buzildi');
  const tuzlar = buzildi.filter(u => u.tuzatishQilindi);
  const qoldiBor = buzildi.some(qoldimi);
  if (a1 && a3 && buzildi.length > 0 && qoldiBor) return 'qoldi';
  if (a1 && a3 && buzildi.length > 0 && tuzlar.length > 0 && tuzlar.every(u => u.qayta === 'takrorlanmadi')) return 'takrorlanmadi';
  if (a1 && a3 && buzildi.length === 0) return 'topilmaYoq';
  if (a1 && a2 && tuzlar.length > 0) return 'qaytaYoq';
  if (a1 && buzildi.length > 0) return 'tuzatishYoq';
  if (a1) return 'xatolarYoq';
  if (yozuv.some(u => u.belgi) && yozuv.some(u => !u.belgi)) return 'tugamagan';
  return 'hech';
};
const SummaryScreen = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
  const { dars, yozuv } = useDars();
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
  const a3i = SCREEN_META.findIndex(m => m.id === 'a3');
  const xatolar = !!(answers[a3i] && (answers[a3i].solved || (answers[a3i].qadam || 0) >= 3));
  const holat = yakunHolat(answers, yozuv);
  const navbat = dars.mobil === 'ha' && dars.navbatda === true;
  const RECAP = [
    { uz: "Barqarorlik tekshiruvi — asosiy yo'llarni buzish yozuvi bilan tekshirish.", ru: 'Проверка стабильности — проверка основных путей с записью поломки.' },
    { uz: "Keyin qo'shilgan ish eski yo'lga tegishi mumkin, shuning uchun besh yo'l ham qayta ko'riladi.", ru: 'Добавленная позже работа может задеть старый путь, поэтому все пять путей пересматриваются.' },
    { uz: "Mahsulotda yo'q yo'l «buzilmadi» deb emas, «hali yo'q» deb yoziladi.", ru: 'Путь, которого нет в продукте, записывается не как «не сломалось», а как «пока нет».' },
    { uz: "Barqarorlik kunida faqat yozuvdagi topilma tuzatiladi; qolgani `XATOLAR.md` da «qoldi» deb, sababi bilan turadi.", ru: 'В день стабильности исправляется только находка из записи; остальное стоит в `XATOLAR.md` как «осталось», с причиной.' },
    { uz: "Yangi versiya o'zgargan qismga qarab chiqadi: Backend — Render, ilova — yangi o'rnatish fayli, sayt — Netlify.", ru: 'Новая версия выходит по изменённой части: Backend — Render, приложение — новый установочный файл, сайт — Netlify.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className={cx('sb-yakun', !xatolar && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tx({ uz: '`XATOLAR.md` tayyor', ru: '`XATOLAR.md` готов' })}
          togri={correct} jami={total}
          sarlavha={tx(YAKUN_SARLAVHA[holat])}
          cta={<>
            {navbat && <p className="sb-navbat-y fade-up"><span>{tr({ uz: "O'rnatish fayli navbatda", ru: 'Установочный файл в очереди' })}</span>{tr({ uz: "Fayl tayyor bo'lgach, lendingdagi havolani keyingi dars boshida almashtirasiz.", ru: 'Когда файл будет готов, ссылку на лендинге замените в начале следующего урока.' })}</p>}
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
            {!isMentorL && <AiDavomCard />}
          </>}
          recap={RECAP.map(tx)}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}>
          <p className="sb-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Zaxira dars»</b></>, ru: <>Следующий урок — <b>«Резервный урок»</b></> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function StabilizeDayLesson({ lang: langProp, onFinished, liveToken }) {
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
  // Dars holati (KOD 3): besh tekshiruv kartasi, `XATOLAR.md` belgisi, o'rnatish fayli navbati — `ccProgress` ichida (yangi pm- kalit yo'q, tayanch 8)
  const [dars, setDars] = useState(() => (saved && saved.dars && Array.isArray(saved.dars.yozuv) && saved.dars.yozuv.length === 5 ? saved.dars : darsBosh()));
  const darsVal = useMemo(() => ({ dars, setDars }), [dars]);
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
    progWrite(LESSON_META.lessonId, { screen, answers, dars, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, dars, earned, missed, fpPractice]);

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
        /* === DARSNING O'Z VIZUALI — «yo'l sahnasi» (sb-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Telefon 170×272 hamma ekranda (SABOQ 22); maket ichida shrift ≥10px (P13) === */
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .sb-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: sb-puls 2.2s ease-out .3s 3; }
        @keyframes sb-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        /* Variantlar va bashorat chiplari: guruh ramkasi yo'q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .sb-k { display: contents; }
        .sb-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: sb-chorla-v 1.8s ease-out .5s 2; }
        @keyframes sb-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .sb-chorla .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: sb-chorla-c 1.8s ease-out .5s 2; }
        @keyframes sb-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .sb-k.faol .q-variant:nth-child(2), .sb-chorla .q-chip:nth-child(2) { animation-delay: .75s; }
        .sb-k.faol .q-variant:nth-child(3), .sb-chorla .q-chip:nth-child(3) { animation-delay: 1s; }
        .sb-chorla2 > button:not(:disabled) { animation: sb-chorla-c 1.8s ease-out .3s 2; }
        .sb-chorla2 > button:nth-child(2) { animation-delay: .55s; }
        /* SABOQ P2: kirish maketi o'z kengligida, variantlar yonida (zoom ishlatilmaydi — P5) */
        @media (min-width: 761px) { .sb-k .q-split { grid-template-columns: max-content minmax(0, 1fr); gap: 28px; } }
        @keyframes sb-kir { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        @keyframes sb-silk { 0%, 100% { transform: none; } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(3px); } }
        @keyframes sb-uch { 0% { background: ${T.okFon}; transform: translateY(-8px); opacity: 0; } 25% { opacity: 1; transform: none; } 100% { background: ${T.paper}; } }
        .silk { animation: sb-silk .45s ease; }
        /* Telefon */
        .sb-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 5px; width: 170px; flex: none; }
        .sb-tel-ust.kichik { width: 128px; }
        .sb-tel-yorliq { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .sb-tel-ust.kichik .sb-tel-yorliq { font-size: 10px; white-space: normal; text-align: center; line-height: 1.2; }
        .sb-telefon { width: 170px; height: 272px; border-radius: 24px; background: ${T.ink}; padding: 5px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.55); flex: none; }
        .sb-tel-ust.kichik .sb-telefon { width: 128px; height: 206px; border-radius: 20px; padding: 4px; }
        .sb-tel-ekran { width: 100%; height: 100%; border-radius: 19px; background: ${T.paper}; overflow: hidden; display: flex; flex-direction: column; animation: sb-kir .35s ease; }
        .sb-tel-ust.kichik .sb-tel-ekran { border-radius: 16px; }
        .sb-il { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 5px; padding: 8px 9px; }
        .sb-il-bosh { display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 12.5px; }
        .sb-pro { font-style: normal; font-size: 10px; font-weight: 800; color: ${T.ok}; background: ${T.okFon}; border-radius: 6px; padding: 0 5px; }
        .sb-il-k { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; gap: 5px; animation: sb-kir .4s ease both; }
        .sb-il-yopiq { align-items: center; justify-content: center; font-size: 15px; }
        .sb-il-sar { font-size: 12.5px; font-weight: 800; line-height: 1.25; color: ${T.ink}; }
        .sb-il-matn { font-size: 10.5px; line-height: 1.35; color: ${T.ink2}; }
        .sb-oyin { display: flex; flex-direction: column; gap: 1px; font-size: 10.5px; line-height: 1.3; color: ${T.ink}; padding: 5px 6px; border-radius: 8px; border: 1px solid ${T.line}; }
        .sb-oyin b { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; white-space: nowrap; }
        .sb-oyin.yangi b { color: ${T.accent}; }
        .sb-oyin.kir { animation: sb-uch .9s ease both; }
        .sb-oyin.err { border: 1.5px solid ${T.err}; }
        .sb-m-q { display: flex; flex-direction: column; gap: 0; padding: 2px 6px; border-radius: 7px; border: 1px solid ${T.line}; }
        .sb-m-q em { font-style: normal; font-size: 10px; color: ${T.ink2}; }
        .sb-m-q b { font-size: 10.5px; color: ${T.ink}; min-height: 13px; }
        .sb-m-q b.err { color: ${T.err}; }
        .sb-il-xato { font-size: 10px; font-weight: 700; color: ${T.err}; margin-top: -3px; }
        .sb-il-tugma { align-self: stretch; text-align: center; font-size: 11px; font-weight: 800; color: #fff; background: ${T.accent}; border-radius: 8px; padding: 5px; }
        .sb-il-tugma.kul { background: ${T.bg}; color: ${T.ink2}; }
        .sb-il-test { font-size: 10px; line-height: 1.3; text-align: center; color: ${T.ink2}; }
        .sb-narx { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 5px; }
        .sb-narx b { font-size: 12.5px; font-weight: 900; color: ${T.ink}; white-space: nowrap; }
        .sb-narx em { font-style: normal; font-size: 10px; color: ${T.ink2}; background: ${T.bg}; border-radius: 5px; padding: 0 4px; }
        .sb-il-xabar { font-size: 11.5px; font-weight: 800; line-height: 1.3; padding: 8px; border-radius: 10px; }
        .sb-il-xabar.err { color: ${T.err}; background: ${T.errFon}; } .sb-il-xabar.ok { color: ${T.ok}; background: ${T.okFon}; }
        .sb-il-pro { font-size: 13px; font-weight: 900; color: ${T.ok}; }
        .sb-il-mashq, .sb-il-tg, .sb-il-lending { padding: 0; gap: 0; }
        .sb-pm-bosh { flex: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; color: #fff; font-size: 12.5px; font-weight: 900; }
        .sb-pm-bosh span { font-size: 10px; font-weight: 700; background: rgba(255,255,255,.28); border-radius: 6px; padding: 0 5px; }
        .sb-pm-ich { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; padding: 5px 7px; }
        .sb-pm-sar { font-size: 10px; font-weight: 700; color: ${T.ink2}; }
        .sb-pm-nom { font-size: 10.5px; line-height: 1.25; color: ${T.ink}; }
        .sb-pm-t { text-align: center; font-size: 10.5px; font-weight: 800; color: #fff; border-radius: 7px; padding: 4px; }
        .sb-pm-t.ikki { background: ${T.paper}; color: ${T.ink}; border: 1px solid ${T.line}; }
        .sb-pm-t.bos { outline: 2px solid ${T.accent}; outline-offset: 1px; }
        .sb-pm-test { margin-top: auto; font-size: 10px; line-height: 1.2; color: ${T.ink2}; }
        .sb-tg-bosh { flex: none; padding: 5px 8px; color: #fff; font-size: 11px; }
        .sb-tg-ich { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 5px; padding: 8px; background: ${T.bg}; }
        .sb-tg-x { align-self: flex-start; max-width: 92%; font-size: 10.5px; line-height: 1.3; color: ${T.ink}; background: ${T.paper}; border-radius: 10px 10px 10px 3px; padding: 5px 7px; animation: sb-kir .4s ease both; }
        .sb-tg-x.takror { box-shadow: inset 0 0 0 1.5px ${T.err}; animation-delay: .35s; }
        .sb-br { display: block; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 6px; }
        .sb-il-lending { padding: 6px; gap: 10px; align-items: center; text-align: center; }
        .sb-il-lending b { font-size: 15px; margin-top: 18px; }
        .sb-l-kod { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink}; border: 1.5px dashed ${T.accent}; border-radius: 8px; padding: 6px 8px; }
        /* Neon qatori va yo'l chizig'i */
        .sb-neon { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 12px; padding: 5px 10px; border-radius: 9px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; }
        .sb-neon b { font-size: 11px; color: ${T.ink2}; }
        .sb-neon code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; white-space: nowrap; }
        .sb-neon em { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 0 6px; }
        .sb-neon.ok { background: ${T.okFon}; border-color: ${fon(T.ok, 0.3)}; } .sb-neon.err { background: ${T.errFon}; border-color: ${fon(T.err, 0.3)}; }
        .sb-sahna { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
        .sb-tellar { display: flex; align-items: flex-end; gap: 12px; }
        .sb-yc { display: flex; gap: 6px; }
        .sb-yc-n { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.ink2}; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: all .3s; }
        .sb-yc-n.joriy { border-color: ${T.accent}; color: ${T.accent}; }
        .sb-yc-n.err { background: ${T.errFon}; border-color: ${T.err}; color: ${T.err}; } .sb-yc-n.kul { background: ${T.bg}; color: ${T.ink2}; border-color: ${T.ink2}; } .sb-yc-n.ok { background: ${T.okFon}; border-color: ${T.ok}; color: ${T.ok}; }
        /* Belgilar */
        .sb-bb { display: inline-block; font-style: normal; font-size: 11.5px; font-weight: 800; line-height: 1.3; padding: 1px 8px; border-radius: 999px; white-space: nowrap; }
        .sb-bb.err { color: ${T.err}; background: ${T.errFon}; } .sb-bb.kul { color: ${T.ink2}; background: ${T.bg}; } .sb-bb.ok { color: ${T.ok}; background: ${T.okFon}; }
        .sb-bb.acc { color: ${T.accent}; background: ${T.accentSoft}; } .sb-bb.yoq { color: ${T.ink2}; background: transparent; border: 1px solid ${T.line}; }
        .sb-bb.bosh { width: 64px; height: 18px; border: 1.5px dashed ${T.line}; background: transparent; }
        /* Kirish: agent chati + telefon */
        .sb-kirish { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .sb-och-q { display: flex; justify-content: center; margin-top: 10px; }
        @media (min-width: 761px) { .sb-och-q { width: 230px; } }
        @media (min-width: 761px) and (max-height: 820px) { .sb-k .sb-telefon { height: 220px; } }
        @media (min-width: 761px) and (max-height: 740px) { .sb-k .sb-telefon { height: 180px; } .sb-k .sb-och-q { margin-top: 6px; } }
        .sb-s2-ong .q-xato { scroll-margin-bottom: 12px; }
        .sb-harakat { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 4px; }
        .sb-chat { width: 230px; display: flex; flex-direction: column; gap: 4px; }
        .sb-chat-kim { font-size: 11px; font-weight: 800; color: ${T.accent}; }
        .sb-pufak { align-self: flex-start; font-size: 12px; line-height: 1.35; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px 12px 12px 4px; padding: 4px 9px; box-shadow: 0 6px 16px -12px rgba(${T.shadowBase},0.4); animation: sb-kir .4s ease both; }
        .sb-pufak b { display: block; font-size: 10.5px; color: ${T.accent}; }
        .sb-pufak.katta { font-size: 14px; padding: 10px 14px; max-width: 100%; }
        .sb-pufak.ketdi { animation: none; opacity: .35; transform: translateX(-24px); transition: all .6s ease; }
        .sb-pufak.siz { align-self: flex-end; border-radius: 12px 12px 4px 12px; background: ${T.accentSoft}; border-color: transparent; }
        .sb-davo { align-self: flex-start; font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 8px; }
        .sb-och { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 800; color: #fff; background: ${T.accent}; border: 0; border-radius: 10px; padding: 7px 16px; cursor: pointer; }
        .sb-och:disabled { background: ${T.bg}; color: ${T.ink2}; cursor: default; }
        /* Reja */
        .sb-reja-chap { display: flex; flex-direction: column; gap: 10px; }
        .sb-reja-yol { display: flex; flex-direction: column; gap: 5px; }
        .sb-reja-q { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 600; color: ${T.ink}; padding: 5px 10px; border-radius: 9px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .sb-reja-q i, .sb-ix i, .sb-yz-bosh i, .sb-tk-bosh i, .sb-mk-b i, .sb-top-q i, .sb-tanla-b i, .sb-qk-b i, .sb-tuz i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.accent}; min-width: 14px; }
        .sb-reja-q .sb-bb { margin-left: auto; }
        .sb-fayl { display: flex; flex-direction: column; gap: 4px; padding: 9px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .sb-fayl-bosh { display: flex; align-items: center; gap: 8px; }
        .sb-fayl-bosh code, .sb-gh-bosh code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; color: ${T.ink}; white-space: nowrap; }
        .sb-fayl-ust { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .sb-fayl-ust b { font-size: 12px; color: ${T.ink2}; border-bottom: 1.5px dashed ${T.line}; padding-bottom: 3px; }
        .sb-fayl-q { font-size: 12.5px; color: ${T.ink}; } .sb-fayl-q.kul { color: ${T.ink2}; }
        .sb-versiya { align-self: flex-start; font-size: 12px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 12px; }
        p.sb-reja-past { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6; color: ${T.ink2}; }
        p.sb-reja-past2 { margin: 0; font-size: 13px; color: ${T.ink2}; }
        /* 2-ekran: yozuv kartasi */
        .sb-s2 { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 22px; align-items: start; }
        .sb-s2-ong { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .sb-yz { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.5); animation: sb-kir .4s ease both; }
        .sb-yz.silk { animation: sb-silk .45s ease; }
        .sb-yz-bosh { display: flex; align-items: center; gap: 8px; font-size: 15px; }
        .sb-yz-dars { font-size: 12px; line-height: 1.4; color: ${T.ink2}; }
        .sb-yz-q { display: flex; flex-direction: column; gap: 1px; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; padding: 4px 8px; border-radius: 8px; background: ${T.bg}; }
        .sb-yz-q b { font-size: 11.5px; color: ${T.ink2}; }
        .sb-yz-q.ochiq { color: ${T.ink}; animation: sb-kir .4s ease both; }
        .sb-korish { align-self: flex-start; font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 800; color: #fff; background: ${T.accent}; border: 0; border-radius: 10px; padding: 8px 16px; cursor: pointer; }
        .sb-korish:disabled { opacity: .5; cursor: default; }
        .sb-belgilar { display: flex; flex-wrap: wrap; gap: 8px; }
        .sb-belgi, .sb-taklif, .sb-qayta { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 800; padding: 7px 14px; border-radius: 10px; cursor: pointer; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${fon(T.accent, 0.6)}; }
        .sb-belgi:disabled, .sb-taklif:disabled { opacity: .5; cursor: default; animation: none; }
        .sb-belgi.on.err, .sb-qayta.on.err { background: ${T.errFon}; color: ${T.err}; border-color: ${T.err}; }
        .sb-belgi.on.kul { background: ${T.bg}; border-color: ${T.ink2}; }
        .sb-belgi.on.yoq { border-color: ${T.ink2}; }
        .sb-qayta.on.ok { background: ${T.okFon}; color: ${T.ok}; border-color: ${T.ok}; }
        .sb-ix-l { display: flex; flex-direction: column; gap: 5px; }
        .sb-ix { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: ${T.ink}; padding: 5px 10px; border-radius: 9px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .sb-ix .sb-bb { margin-left: auto; }
        .sb-ix.uchdi { animation: sb-uch 1s ease both; }
        .sb-s2.tugadi { grid-template-columns: auto minmax(0, 420px); justify-content: center; }
        p.sb-nom { margin: 0; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        /* Bashorat ixcham qatori va xulosa qutisi (E 42) */
        .sb-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .sb-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        .q-xulosa .sb-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .sb-x-tx b { color: ${T.ink}; } .q-xulosa .sb-x-tx.ok, .q-xulosa .sb-x-tx.ok b { color: ${T.ok}; } .q-xulosa .sb-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .sb-x-m { display: block; }
        .q-xulosa .sb-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        .sb-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .sb-ustoz b { color: ${T.ink}; }
        /* 5-ekran: topilma, ikki ro'yxat, agent chati */
        .sb-s5 { display: grid; grid-template-columns: minmax(0, 330px) 44px minmax(0, 1fr); gap: 0 10px; align-items: start; }
        .sb-s5.tugadi { grid-template-columns: minmax(0, 520px); justify-content: center; }
        .sb-s5-chap { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .sb-topilma { position: relative; display: flex; flex-direction: column; gap: 3px; padding: 9px 12px; border-radius: 11px; background: ${T.paper}; border: 1.5px solid ${fon(T.err, 0.45)}; }
        .sb-topilma.bogi { border-color: ${T.accent}; }
        .sb-top-q { display: flex; align-items: center; gap: 7px; font-size: 13.5px; }
        .sb-top-m { font-size: 12.5px; color: ${T.ink2}; }
        .sb-tuzatadi { align-self: flex-start; font-style: normal; font-size: 11.5px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 6px; padding: 1px 8px; }
        .sb-ro { display: flex; flex-direction: column; gap: 5px; min-height: 52px; padding: 8px 10px; border-radius: 10px; border: 1.5px dashed ${T.line}; }
        .sb-ro.tuzatish { border-color: ${fon(T.accent, 0.45)}; }
        .sb-ro-y { font-size: 11.5px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .04em; }
        .sb-ro-q { display: flex; flex-direction: column; gap: 2px; font-size: 12.5px; line-height: 1.35; color: ${T.ink}; padding: 5px 8px; border-radius: 8px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .sb-ro-q.tuzatish { border-color: ${T.accent}; }
        .sb-ro-q.yangi { color: ${T.ink2}; background: ${T.bg}; }
        .sb-ro-q em { font-style: normal; font-size: 11px; color: ${T.ink2}; }
        .sb-s5-ch { position: relative; height: 64px; }
        .sb-s5-ch i { position: absolute; top: 30px; right: 0; height: 2px; width: 0; background: ${T.accent}; transition: width .6s ease; }
        .sb-s5-ch.on i { width: 100%; }
        .sb-s5-ong { min-width: 0; }
        .sb-agent { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .sb-agent.ixcham { gap: 6px; padding: 10px 12px; }
        .sb-t-n { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .sb-tanlov { display: flex; flex-wrap: wrap; gap: 8px; }
        /* Amaliyot bloklari */
        .sb-blok { display: contents; }
        .sb-blok.qulf .q-blok-q.joriy .q-blok-tana > .q-btn { opacity: .45; pointer-events: none; }
        .sb-blok .q-blok-tana > .q-btn { order: 1; }
        .sb-blok .q-blok-tana > p.q-blok-xato { order: 2; margin-top: -4px; text-align: right; }
        .sb-qulf-s { font-size: 12.5px; color: ${T.ink2}; }
        .sb-blok .q-blok-qadamlar { counter-reset: sbq; }
        .sb-blok .q-blok-q { counter-increment: sbq; }
        .sb-blok .q-blok-q.bajarildi:has(.sb-otk) { opacity: .6; }
        .sb-blok .q-blok-q.bajarildi:has(.sb-otk) .q-blok-n { font-size: 0; }
        .sb-blok .q-blok-q.bajarildi:has(.sb-otk) .q-blok-n::after { content: counter(sbq); font-size: 13px; }
        .sb-blok .q-blok-q.bajarildi:has(.sb-otk) .q-blok-qaytar { display: none; }
        .sb-otk { color: ${T.ink2}; }
        .sb-otk em { font-style: normal; font-weight: 600; }
        .sb-band, .sb-kulrang, .sb-xato, .sb-ps, .sb-ps-q, .sb-yordam, .sb-yordam-s, .sb-tk, .sb-tk-ost, .sb-tk-bes { display: block; }
        .sb-band { margin-top: 6px; }
        .sb-kulrang { margin-top: 6px; font-size: 12.5px; color: ${T.ink2}; }
        .sb-xato { margin-top: 6px; font-size: 13px; font-weight: 700; color: ${T.err}; }
        .sb-yordam .qcode, .sb-ps .qcode { white-space: normal; overflow-wrap: anywhere; }
        .sb-prompt { display: block; margin-top: 8px; }
        .sb-ps { margin: 0; padding: 0 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink}; overflow-wrap: anywhere; white-space: pre-wrap; }
        .sb-ps + .sb-ps { margin-top: 4px; }
        .sb-ps .q-joy { display: inline-block; max-width: 100%; }
        .sb-joylar { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .sb-joy-m { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; padding: 0 0 0 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .sb-joy-m:focus-within { border-color: ${T.accent}; }
        .sb-joy-n { flex: none; max-width: 100%; padding-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.accent}; }
        .sb-joy-m input { flex: 1 1 220px; min-width: 0; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.4; padding: 8px 10px 8px 0; color: ${T.ink}; }
        .sb-yordam-ust { display: block; margin-top: 8px; }
        .sb-yordam { margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; }
        .sb-yordam b { display: block; margin-bottom: 4px; font-size: 12px; color: ${T.ink2}; }
        .sb-yordam-s + .sb-yordam-s { margin-top: 4px; }
        .sb-yordam-btn { margin: 0; }
        .sb-trek-q { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0; }
        .sb-trek, .sb-mobil, .sb-navbat { font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 700; padding: 5px 12px; border-radius: 999px; border: 1.5px solid ${fon(T.accent, 0.6)}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .sb-trek.on, .sb-mobil.on, .sb-navbat.on { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .sb-mobil .qcode { white-space: nowrap; }
        p.sb-ortda, p.sb-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        @media (max-width: 640px) { p.sb-ortda .qcode { white-space: normal; overflow-wrap: anywhere; } }
        p.sb-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.bg}; }
        p.sb-ost { margin: 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; }
        /* Tekshiruv kartalari (1-amaliyot) */
        .sb-tk { margin-top: 8px; }
        .sb-tk-chiziq { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
        .sb-yz-chip { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; padding: 3px 9px; border-radius: 999px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .sb-yz-chip i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .sb-yz-chip em { font-style: normal; font-size: 11px; color: ${T.ink2}; }
        .sb-yz-chip.on { border-color: ${T.accent}; }
        .sb-yz-chip.err em, .sb-yz-chip.err i { color: ${T.err}; } .sb-yz-chip.kul i { color: ${T.ink}; }
        .sb-tk-karta { display: flex; flex-direction: column; gap: 7px; padding: 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.35)}; }
        .sb-tk-bosh { display: flex; align-items: center; gap: 8px; font-size: 14.5px; }
        .sb-tk-bes { font-size: 12.5px; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 4px 8px; }
        .sb-tk-m { display: flex; flex-direction: column; gap: 2px; padding: 5px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .sb-tk-m:focus-within { border-color: ${T.accent}; }
        .sb-tk-m.qulf { opacity: .55; }
        .sb-tk-n { font-size: 11.5px; font-weight: 800; color: ${T.accent}; }
        .sb-tk-m textarea { border: 0; outline: 0; resize: none; overflow: hidden; background: transparent; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.45; color: ${T.ink}; padding: 0; }
        .sb-tk-btn { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .sb-tk-btn .sb-yordam-ust { margin-top: 0; margin-left: auto; }
        .sb-tk-btn .sb-yordam-ust:has(.sb-yordam) { flex-basis: 100%; margin-left: 0; }
        .sb-tk-ost { font-size: 12px; line-height: 1.45; color: ${T.ink2}; }
        /* Kutilgan natija (o'ng ustun) */
        .sb-nat { display: flex; flex-direction: column; gap: 7px; }
        .sb-mini { display: flex; align-items: center; gap: 8px; align-self: flex-start; padding: 5px 12px; border-radius: 12px; border: 4px solid ${T.ink}; background: ${T.paper}; font-size: 12.5px; }
        .sb-mk { display: flex; flex-direction: column; gap: 2px; padding: 7px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .sb-mk.err { border-color: ${fon(T.err, 0.45)}; }
        .sb-mk-b { display: flex; align-items: center; gap: 7px; font-size: 13px; }
        .sb-mk-b .sb-bb { margin-left: auto; }
        .sb-mk-q { font-size: 12px; line-height: 1.4; color: ${T.ink}; }
        .sb-mk-q em { font-style: normal; font-weight: 700; color: ${T.ink2}; }
        .sb-mk-bel { display: flex; flex-wrap: wrap; gap: 6px; }
        .sb-gh-bosh { display: flex; align-items: center; gap: 6px; font-size: 12px; color: ${T.ink2}; border-bottom: 1px solid ${T.line}; padding-bottom: 5px; }
        .sb-gh-bosh b { color: ${T.ink}; }
        .sb-md { display: flex; flex-direction: column; gap: 3px; }
        .sb-md-q { font-size: 12px; line-height: 1.45; color: ${T.ink}; }
        .sb-md-q.h1 { font-size: 15px; font-weight: 800; } .sb-md-q.h2 { font-size: 13px; font-weight: 800; margin-top: 4px; }
        .sb-md-q.li { padding-left: 8px; }
        /* 2-3-amaliyot: tanlov va qayta tekshiruv kartalari */
        .sb-tanla-l, .sb-qk-l { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .sb-tanla { display: flex; flex-direction: column; gap: 3px; text-align: left; font-family: 'Manrope', sans-serif; padding: 8px 12px; border-radius: 11px; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.6)}; box-shadow: 0 6px 16px -12px rgba(${T.shadowBase},0.5); cursor: pointer; color: ${T.ink}; }
        .sb-tanla.on { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .sb-tanla:disabled { opacity: .5; cursor: default; }
        .sb-tanla-b { display: flex; align-items: center; gap: 7px; font-size: 13.5px; }
        .sb-tanla-b .sb-bb { margin-left: auto; }
        .sb-tanla-m { font-size: 12.5px; color: ${T.ink2}; }
        .sb-tuz { display: flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-size: 13px; padding: 7px 12px; border-radius: 11px; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.6)}; cursor: pointer; color: ${T.ink}; text-align: left; }
        .sb-tuz em { margin-left: auto; font-style: normal; font-size: 12px; font-weight: 800; color: ${T.ink2}; }
        .sb-tuz.on { background: ${T.accentSoft}; border-color: ${T.accent}; } .sb-tuz.on em { color: ${T.accent}; }
        .sb-qk { display: flex; flex-direction: column; gap: 5px; padding: 9px 12px; border-radius: 11px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .sb-qk-b { display: flex; align-items: center; gap: 7px; font-size: 13.5px; }
        .sb-qk-m { font-size: 12.5px; color: ${T.ink2}; }
        .sb-qk-btn { display: flex; flex-wrap: wrap; gap: 8px; }
        .sb-ix.acc { border-color: ${fon(T.accent, 0.4)}; }
        /* Kartochkalar, yakun */
        .sb-flash { display: flex; flex-direction: column; gap: 10px; }
        .sb-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: sb-puls 1.8s ease-out .4s 3; }
        p.sb-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.sb-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        p.sb-ai-m { margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .sb-ai-sorov { margin: 0 0 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; white-space: pre-wrap; }
        .sb-ai-btn { margin: 0; }
        .sb-ai { display: flex; flex-direction: column; }
        .sb-yakun { display: contents; }
        .sb-yakun.belgisiz .done-chip { display: none; }
        .sb-yakun .q-yakun > .ach-coll { order: 1; }
        p.sb-keyingi { margin: 0; font-size: 14.5px; line-height: 1.5; color: ${T.ink2}; }
        p.sb-keyingi b { color: ${T.ink}; }
        p.sb-navbat-y { margin: 0; display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; font-size: 13px; color: ${T.ink2}; }
        p.sb-navbat-y span { font-size: 12px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 999px; padding: 2px 10px; }
        .sb-gh { gap: 6px; } .sb-reja-fayl { max-width: 360px; } .sb-navbat-q { margin-top: 8px; } .sb-nusxa { white-space: nowrap; }
        .sb-rc-savol { display: block; margin-top: 8px; font-weight: 700; color: ${T.ink}; }
        /* ⛶ kattalashtirish — ikki klassli selektor (E 48, SABOQ 38); fokus/voqea konteyneri animatsiyasi oynani siljitmasin */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 96vw); max-height: 92vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 760px) {
          .sb-s2, .sb-s2.tugadi { grid-template-columns: 1fr; justify-items: center; }
          .sb-s2-ong { width: 100%; }
          .sb-s5, .sb-s5.tugadi { grid-template-columns: 1fr; gap: 10px; }
          .sb-s5-ch { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sb-halqa, .sb-k.faol .q-variant, .sb-chorla .q-chip, .sb-chorla2 > button, .sb-flash.yangi .fc-card .fc-front, .sb-tel-ekran, .sb-il-k, .sb-oyin.kir, .sb-tg-x, .sb-pufak, .sb-yz, .sb-yz-q.ochiq, .sb-ix.uchdi, .silk { animation: none !important; }
          .sb-s5-ch i, .sb-pufak.ketdi, .sb-yc-n { transition: none !important; }
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
      <DarsCtx.Provider value={darsVal}>
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
      </DarsCtx.Provider>
    </LangContext.Provider>
  );
}
