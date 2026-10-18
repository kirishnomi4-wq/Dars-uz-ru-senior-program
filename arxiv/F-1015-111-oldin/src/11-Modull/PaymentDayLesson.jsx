import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul 5-dars «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz» (m11-05) — skeletdan (08.10.2026, 2-to'lqin A); MD: feedback/F-1007-13modul/05-PaymentDay-v3.md (+ 05-FILTR.md)
// 12 ekran: QKirish · QReja · QTushuncha (to'rt usul) · amaliyot 1 (QBlok) · test · QTushuncha (buzish yozuvi) · amaliyot 2 · test · amaliyot 3 · podium · QKartochka · QYakun.
// Bitta vizual — TolovSahna (telefon chapda: ilova / «Mashq to'lov» sahifasi · Backend: «Mashq to'lov» → POST /tolov/webhook, tolovlar, Pro muddati).
// Saqlanadi: pm-m11d5-buzish (tayanch 8 aynan). O'qiydi: pm-m11d4-narx (ishlaydi, ekran.tugma), pm-m9d8-platforma (trek; yo'q bo'lsa — blokda tanlov, shu kalitga yoziladi — MD 3-ekran).
// Real pul yo'q (test rejim); karta maydoni hech qayerda chizilmaydi; TOLOV_KALITI qiymati yo'q — faqat nomi. ⛔ «qur» darvozalari (telefon, Expo Go, Render, Mentor repo) sinalmagan.
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

const LESSON_META = { lessonId: 'm11-05-v1', lessonTitle: { uz: 'Loyiha kuni: to\'lovni ulaymiz va buzib ko\'ramiz', ru: 'День проекта: подключаем оплату и ломаем её' } };
// 12 ekran (loyiha kuni, tayanch 4): kirish → reja → tushuncha (to'rt usul) → 1-amaliyot → 1-savol → tushuncha (buzish yozuvi) → 2-amaliyot → 2-savol → 3-amaliyot → podium → kartochkalar → yakun.
// Uyga vazifa yo'q (loyiha kuni) — HW_TOKENS QYakun'ga berilmaydi; so'zlar darsning o'zidan.
const HW_TOKENS = [
  { t: { uz: 'buzish', ru: 'поломка' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'yozuv', ru: 'запись' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'tekshiruv', ru: 'проверка' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'natija', ru: 'результат' }, l: 78, tp: 68, s: 13, d: 6.8 }
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
  // 199-qonun (SABOQ A4): kompyuterda ham tugash signalida natija pastki panel ostida qolmasin — faqat signal o'zgarganda, birinchi chizishda emas
  const deskOld = useRef(deskSignal);
  useEffect(() => {
    if (deskOld.current === deskSignal) return;
    deskOld.current = deskSignal;
    if (!deskSignal || isNarrow) return;
    const el = contentRef.current;
    if (!el) return;
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Final tartib-mashqi yo'q (loyiha kuni, 172). `practice: -1` — sentinel (uch blok).
// ⚠️ To'g'ri javob O'RNI (MD ✔) qurilgandan keyin o'zgarmaydi: s4 — C (2), s7 — A (0).
const INLINE_KEYS = { s4: 2, s7: 0, practice: -1 };
// 📖 RECAPS — har ballik testga 3 karta (kalit = ekran INDEKSI; S-026: koddan bitta qator yoki raqam)
const rcKod = (s) => <code className="qcode">{s}</code>;
const rcRaqam = (n) => <b className="pd-rc-n">{n}</b>;
const RECAPS = {
  4: {
    title: { uz: 'Pro bir marta uzayishi kerak', ru: 'Pro должен продлеваться один раз' },
    cards: [
      { ic: null, h: { uz: "Xabar to'lov xizmatidan kelganini tekshiradi.", ru: 'Проверяет, что сообщение пришло от платёжного сервиса.' }, body: { uz: rcKod('imzo'), ru: rcKod('imzo') } },
      { ic: null, h: { uz: 'Mentor misolida bu qator takror tekshiruvidan oldin turgan edi.', ru: 'В примере Ментора эта строка стояла до проверки повтора.' }, body: { uz: rcKod('Pro +30 kun'), ru: rcKod('Pro +30 kun') } },
      { ic: null, h: { uz: 'Ikkinchi xabar yozilmadi, lekin Pro ikkinchi marta uzaydi.', ru: 'Второе сообщение не записалось, но Pro продлился второй раз.' }, body: { uz: rcKod('raqam: bor'), ru: rcKod('raqam: bor') }, ask: { uz: "Shu kodda xabar uch marta kelsa, Pro muddati necha kun bo'lardi?", ru: 'Если в этом коде сообщение придёт трижды, сколько дней будет срок Pro?' } }
    ]
  },
  7: {
    title: { uz: 'Tuzatish qilindi va qayta tekshiruv', ru: '«Исправление сделано» и повторная проверка' },
    cards: [
      { ic: null, h: { uz: "Agent «tuzatdim» dedi — bu da'vo.", ru: 'Агент сказал «исправил» — это заявление.' }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: "Kod o'zgardi — «Tuzatish qilindi».", ru: 'Код изменился — «Tuzatish qilindi» (исправление сделано).' }, body: { uz: rcRaqam(2), ru: rcRaqam(2) } },
      { ic: null, h: { uz: "O'sha usul bilan qayta buzildi, muammo chiqmadi — «qayta tekshiruvda takrorlanmadi».", ru: 'Тем же способом сломали снова, проблемы нет — «при повторной проверке не повторилось».' }, body: { uz: rcRaqam(3), ru: rcRaqam(3) }, ask: { uz: "Kech kelgan xabarni «Ikki marta yuborish» bilan qayta tekshirsangiz, nima bilib olasiz?", ru: 'Что вы узнаете, если опоздавшее сообщение перепроверите кнопкой «Ikki marta yuborish»?' } }
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

// ===== BITTA VIZUAL — «telefon · Backend» to'lov sahnasi (163/180): bitta manba TOLOV_SAHNA + TOLOV_EKRANI + MASHQ_SAHIFA + ILOVA_HOLATLAR + USULLAR + MENTOR_YOZUV + NEON_SOROVLAR =====
// Telefon chapda (170×272, SABOQ 22), yorliq ramka ustida (SABOQ 23); o'ngda Backend: «Mashq to'lov» → to'lov xabari konverti → `POST /tolov/webhook` (to'rt tekshiruv qatori), `tolovlar`, Pro muddati.
// Karta maydoni (raqam, muddat, CVV) hech bir holatda chizilmaydi (TAQIQLAR 1). Mashq sahifasi — tanish to'lov sahifasi ko'rinishida (SABOQ P6). Odam chizilmaydi (SABOQ P1).
// qolip-maket: pd-qt pd-ai-btn pd-belgi pd-otish pd-tolash pd-rad pd-ikki pd-imzosiz pd-kech pd-imzo pd-tb pd-qtekshir pd-solishtir pd-agent pd-qayta pd-trek pd-nusxa pd-yz-chip pd-belgi pd-tuz pd-tk pd-halqa yangi on ok err
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const halqa = (on) => (on ? 'pd-halqa' : undefined);
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Sahna qadamlari ketma-ket: [[kechikish ms, fn], …]; ekran yopilsa taymerlar tozalanadi; reduced-motion — holatlar kechikishsiz (DE-200)
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

// «Maydon Jamoa» — 11-Modul 9.62 yashili (9–13-Modul darslaridagi rang bilan bir); mashq sahifasi sarlavhasi — Payme rangi (SABOQ P6, logotipsiz)
const MAYDON_RANG = '#2E9E4F';
const PAYME_RANG = '#00B5B5';
const TOLOV_SAHNA = {
  telefon: { uz: 'telefon', ru: 'телефон' },
  ilova: { uz: 'ilova', ru: 'приложение' },
  brauzer: { uz: 'brauzer', ru: 'браузер' },
  manzil: '…/tolov-mashq',
  yangiRaqam: { uz: "Pro yo'q — yangi to'lov raqami", ru: 'Pro нет — новый номер платежа' },
  proMuddati: { uz: 'Pro muddati', ru: 'Срок Pro' },
  kun: (n) => ({ uz: `${n} kun`, ru: `${n} дней` }),
  soniya: (n) => ({ uz: `${n} soniya`, ru: `${n} сек.` }),
  qatorSoni: (n) => ({ uz: `${n} qator`, ru: `${n} ${n === 1 ? 'строка' : n >= 2 && n <= 4 ? 'строки' : 'строк'}` }),
  yozilmadi: { uz: 'yozilmadi', ru: 'не записано' },
  eski: { uz: 'eski', ru: 'старое' },
  agent: 'Antigravity',
  siz: { uz: 'siz', ru: 'вы' }
};
// To'lov taklifi ekrani — 4-dars (tayanch 1.4), so'zma-so'z
const TOLOV_EKRANI = {
  sarlavha: { uz: "Doimiy o'yin — Pro'da", ru: 'Постоянная игра — в Pro' },
  matn: { uz: "Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.", ru: 'Каждую неделю в тот же день и час игра объявляется сама.' },
  narx: { uz: "30 kun — 15 000 so'm", ru: '30 дней — 15 000 сумов' },
  taxmin: { uz: 'Mentorning taxmini', ru: 'Оценка Ментора' },
  tugma: { uz: "To'lovga o'tish", ru: 'Перейти к оплате' },
  test: { uz: 'Test rejim: pul yechilmaydi', ru: 'Тестовый режим: деньги не списываются' }
};
// «Mashq to'lov» sahifasi (tayanch 1.3, 9.1; 1-amaliyotdan keyin — olti tugma)
const MASHQ_SAHIFA = {
  sarlavha: { uz: "Mashq to'lov", ru: 'Учебная оплата' },
  test: { uz: "Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.", ru: 'Это учебная страница. Карта не запрашивается, деньги не списываются.' },
  mahsulot: { uz: 'Pro, 30 kun', ru: 'Pro, 30 дней' },
  summa: { uz: "15 000 so'm", ru: '15 000 сумов' },
  tolash: { uz: "To'lash (mashq)", ru: 'Оплатить (учебно)' },
  rad: { uz: 'Rad etish (mashq)', ru: 'Отклонить (учебно)' },
  tekshiruv: { uz: 'Tekshiruv tugmalari', ru: 'Кнопки проверки' },
  ikki: { uz: 'Ikki marta yuborish', ru: 'Отправить дважды' },
  imzosiz: { uz: 'Imzosiz yuborish', ru: 'Отправить без подписи' },
  kech: { uz: 'Kechiktirib yuborish', ru: 'Отправить с задержкой' },
  imzo: { uz: "Noto'g'ri imzo", ru: 'Неверная подпись' },
  javob: {
    tolandi: { uz: "To'landi (mashq)", ru: 'Оплачено (учебно)' },
    otmadi: { uz: "To'lov o'tmadi", ru: 'Платёж не прошёл' },
    kutilmoqda: { uz: 'Javob kutilmoqda', ru: 'Ожидаем ответ' },
    401: '401',
    ok: '200 { ok: true }',
    takror: '200 { takror: true }'
  }
};
const JAVOB_RANG = { tolandi: 'ok', ok: 'ok', otmadi: 'err', 401: 'err', kutilmoqda: 'kul', takror: 'kul' };
// Ilova holatlari (A-bo'lim 4; 1-amaliyot)
const ILOVA_HOLATLAR = {
  otmadi: { uz: "To'lov o'tmadi — qayta urinib ko'ring", ru: 'Платёж не прошёл — попробуйте ещё раз' },
  kutilmoqda: { uz: 'Javob kutilmoqda', ru: 'Ожидаем ответ' },
  qtekshir: { uz: 'Qayta tekshirish', ru: 'Проверить снова' },
  elon: { uz: "E'lon berish", ru: 'Объявить игру' },
  oyin: { uz: 'Shanba, 18:00 · Mahalla maydoni', ru: 'Суббота, 18:00 · Поле махалли' },
  takrorlansin: { uz: 'Har hafta takrorlansin', ru: 'Повторять каждую неделю' }
};
// Buzish usullari (tayanch 1.5 tartibi): `usul` — barqaror kalit; «Nima qildim» shabloni va «Talab bo'yicha» qatori (F-1007-463; kalitga yozilmaydi)
const USULLAR = [
  { usul: 'ikki', nom: { uz: 'Ikki marta yuborish', ru: 'Отправить дважды' },
    qildim: (tg, w) => ({ uz: `«${tg.uz}» ni, keyin sahifada «Ikki marta yuborish» ni bosdim; javoblarga va Neon'ga qaradim.`, ru: `Нажал «${tg.ru}», потом на странице «Ikki marta yuborish»; посмотрел ответы и Neon.` }),
    talab: (w) => ({ uz: "to'lov bir marta yoziladi, pullik qulaylik bir marta yoqiladi", ru: 'платёж записывается один раз, платная возможность включается один раз' }),
    yol: { uz: "to'lov tugmasi → sahifada «Ikki marta yuborish» → sahifadagi ikki javobni o'qing → Neon: oxirgi to'lovlar va muddat.", ru: 'кнопка оплаты → на странице «Ikki marta yuborish» → прочтите два ответа на странице → Neon: последние платежи и срок.' } },
  { usul: 'kech', nom: { uz: 'Kechiktirib yuborish', ru: 'Отправить с задержкой' },
    qildim: (tg, w) => ({ uz: `«${tg.uz}» ni, keyin «Kechiktirib yuborish» ni bosdim; sahifaga qaradim, keyin ${w ? 'saytga' : 'ilovaga'} qaytib, undan chiqmay bir daqiqa kutdim.`, ru: `Нажал «${tg.ru}», потом «Kechiktirib yuborish»; посмотрел на страницу, потом вернулся в ${w ? 'сайт' : 'приложение'} и, не выходя, ждал минуту.` }),
    talab: (w) => ({ uz: `javob kelmaguncha «To'lov o'tmadi» deyilmaydi; xabar kelgach qulaylik ${w ? 'saytda' : 'ilovada'} ko'rinadi`, ru: `пока нет ответа, «Платёж не прошёл» не пишется; после сообщения возможность видна ${w ? 'на сайте' : 'в приложении'}` }),
    yol: { uz: "to'lov tugmasi → «Kechiktirib yuborish» → sahifaga 15 soniya qarang → ilovaga qayting va undan chiqmay bir daqiqa kuting (chiqib qaytsangiz, ilova natijani qayta so'raydi) → ilovaga va Neon'dagi muddatga qarang. Kutayotganda 1-urinish yozuvini qayta o'qing.", ru: 'кнопка оплаты → «Kechiktirib yuborish» → 15 секунд смотрите на страницу → вернитесь в приложение и, не выходя, ждите минуту (если выйдете и вернётесь, приложение снова запросит результат) → смотрите на приложение и срок в Neon. Пока ждёте, перечитайте запись 1-й попытки.' } },
  { usul: 'rad', nom: { uz: 'Rad etish', ru: 'Отклонить' },
    qildim: (tg, w) => ({ uz: `«${tg.uz}» ni, keyin «Rad etish (mashq)» ni bosdim va ${w ? 'saytga' : 'ilovaga'} qaytdim.`, ru: `Нажал «${tg.ru}», потом «Rad etish (mashq)» и вернулся в ${w ? 'сайт' : 'приложение'}.` }),
    talab: (w) => ({ uz: `qulaylik yoqilmaydi; ${w ? 'saytda' : 'ilovada'} «To'lov o'tmadi — qayta urinib ko'ring»`, ru: `возможность не включается; ${w ? 'на сайте' : 'в приложении'} «Платёж не прошёл — попробуйте ещё раз»` }),
    yol: { uz: "to'lov tugmasi → «Rad etish (mashq)» → ilovaga qayting → Neon: oxirgi to'lovlar va muddat.", ru: 'кнопка оплаты → «Rad etish (mashq)» → вернитесь в приложение → Neon: последние платежи и срок.' } },
  { usul: 'imzo', nom: { uz: "Noto'g'ri imzo", ru: 'Неверная подпись' },
    qildim: (tg, w) => ({ uz: `«${tg.uz}» ni, keyin «Noto'g'ri imzo» ni bosdim; sahifadagi javobga va Neon'ga qaradim.`, ru: `Нажал «${tg.ru}», потом «Неверная подпись»; посмотрел на ответ на странице и в Neon.` }),
    talab: (w) => ({ uz: '`401`, yangi yozuv yo\'q, qulaylik yoqilmaydi', ru: '`401`, новой записи нет, возможность не включается' }),
    yol: { uz: "to'lov tugmasi → «Noto'g'ri imzo» → sahifadagi javobni o'qing → Neon: oxirgi to'lovlar va muddat.", ru: 'кнопка оплаты → «Неверная подпись» → прочтите ответ на странице → Neon: последние платежи и срок.' } }
];
const usulNom = (u) => (USULLAR.find(x => x.usul === u) || USULLAR[0]).nom;
// Mentor misolining buzish yozuvi (A-bo'lim 4 jadvali; Mentorning o'z matni). ⛔ «qur» pilotida haqiqiy natija bilan almashadi.
const MENTOR_YOZUV = [
  { usul: 'ikki', belgi: 'buzildi', keyin: 'takrorlanmadi',
    qildim: { uz: "Pro yo'q edi. «To'lovga o'tish» ni, keyin sahifada «Ikki marta yuborish» ni bosdim; javoblarga va Neon'dagi to'lovlar bilan Pro muddatiga qaradim.", ru: 'Pro не было. Нажал «Перейти к оплате», потом на странице «Ikki marta yuborish»; посмотрел ответы, платежи в Neon и срок Pro.' },
    kutdim: { uz: "Ikki javob: `200 { ok: true }` va `200 { takror: true }`; `tolovlar` da bitta qator; Pro 30 kunga yoqiladi.", ru: 'Два ответа: `200 { ok: true }` и `200 { takror: true }`; в `tolovlar` одна строка; Pro включается на 30 дней.' },
    boldi: { uz: "Javoblar va `tolovlar` kutgandek, lekin Pro muddati 60 kun bo'ldi.", ru: 'Ответы и `tolovlar` как ожидал, но срок Pro стал 60 дней.' } },
  { usul: 'kech', belgi: 'buzildi', keyin: 'takrorlanmadi',
    qildim: { uz: "Pro yo'q edi. «To'lovga o'tish» ni, keyin «Kechiktirib yuborish» ni bosdim; sahifaga qaradim, keyin ilovaga qaytib, undan chiqmay bir daqiqa kutdim.", ru: 'Pro не было. Нажал «Перейти к оплате», потом «Kechiktirib yuborish»; посмотрел на страницу, потом вернулся в приложение и, не выходя, ждал минуту.' },
    kutdim: { uz: "Sahifa natijani kutadi; xabar kelgach ilovada Pro ko'rinadi.", ru: 'Страница ждёт результат; после сообщения в приложении виден Pro.' },
    boldi: { uz: "Sahifa 10 soniyadan keyin «To'lov o'tmadi» dedi. Bir daqiqadan keyin Neon'da Pro yozildi, ilovada esa «Javob kutilmoqda» qoldi.", ru: 'Страница через 10 секунд сказала «Платёж не прошёл». Через минуту в Neon записался Pro, а в приложении осталось «Ожидаем ответ».' },
    farq: [
      { kutdim: { uz: 'Sahifa natijani kutadi', ru: 'Страница ждёт результат' }, boldi: { uz: "10 soniyadan keyin «To'lov o'tmadi» dedi", ru: 'через 10 секунд сказала «Платёж не прошёл»' } },
      { kutdim: { uz: "ilovada Pro ko'rinadi", ru: 'в приложении виден Pro' }, boldi: { uz: "ilovada esa «Javob kutilmoqda» qoldi", ru: 'а в приложении осталось «Ожидаем ответ»' } }
    ] },
  { usul: 'rad', belgi: 'buzilmadi', keyin: null,
    qildim: { uz: "«To'lovga o'tish» ni, keyin «Rad etish (mashq)» ni bosdim va ilovaga qaytdim.", ru: 'Нажал «Перейти к оплате», потом «Rad etish (mashq)» и вернулся в приложение.' },
    kutdim: { uz: "Sahifada «To'lov o'tmadi»; `tolovlar` da «rad» qatori; Pro yo'q; ilovada «To'lov o'tmadi — qayta urinib ko'ring».", ru: 'На странице «Платёж не прошёл»; в `tolovlar` строка «rad»; Pro нет; в приложении «Платёж не прошёл — попробуйте ещё раз».' },
    boldi: { uz: "Sahifada «To'lov o'tmadi», `tolovlar` da «rad» qatori, Pro yo'q, ilovada «To'lov o'tmadi — qayta urinib ko'ring».", ru: 'На странице «Платёж не прошёл», в `tolovlar` строка «rad», Pro нет, в приложении «Платёж не прошёл — попробуйте ещё раз».' } },
  { usul: 'imzo', belgi: 'buzilmadi', keyin: null,
    qildim: { uz: "«To'lovga o'tish» ni, keyin «Noto'g'ri imzo» ni bosdim; sahifadagi javobga va Neon'ga qaradim.", ru: 'Нажал «Перейти к оплате», потом «Noto\'g\'ri imzo»; посмотрел на ответ на странице и в Neon.' },
    kutdim: { uz: "Sahifada `401`; `tolovlar` da yangi qator yo'q; Pro yo'q.", ru: 'На странице `401`; в `tolovlar` новой строки нет; Pro нет.' },
    boldi: { uz: "Sahifada `401`, yangi qator yo'q, Pro yo'q.", ru: 'На странице `401`, новой строки нет, Pro нет.' } }
];
// Neon so'rovlari (A-bo'lim 8: faqat o'z hisobi, faqat `WHERE id = …` bilan)
const NEON_SOROVLAR = {
  topish: "SELECT id, pro_gacha FROM oyinchilar WHERE login = '{loginingiz}';",
  kecha: 'UPDATE oyinchilar SET pro_gacha = CURRENT_DATE - 1 WHERE id = {hisob raqami};',
  qaytar: 'UPDATE oyinchilar SET pro_gacha = NULL WHERE id = {hisob raqami};',
  muddat: 'SELECT pro_gacha FROM oyinchilar WHERE id = {hisob raqami};',
  oxirgi: 'SELECT tolov_raqami, holat, yaratilgan FROM tolovlar WHERE oyinchi_id = {hisob raqami} ORDER BY yaratilgan DESC LIMIT 3;'
};
// Belgilar: buzildi — err · buzilmadi — ink2 · «Tuzatish qilindi» — accent · takrorlanmadi — ok · yana buzildi — err (A-bo'lim 11)
const BELGI = {
  buzildi: { uz: 'buzildi', ru: 'сломалось' },
  buzilmadi: { uz: 'buzilmadi', ru: 'не сломалось' },
  tuz: { uz: 'Tuzatish qilindi', ru: 'Исправление сделано' },
  takrorlanmadi: { uz: 'qayta tekshiruvda takrorlanmadi', ru: 'при повторной проверке не повторилось' },
  takrorlandi: { uz: 'qayta tekshiruvda yana buzildi', ru: 'при повторной проверке снова сломалось' }
};
const Belgi = ({ b }) => (b ? <em key={b} className={cx('pd-bb', b)}>{tr(BELGI[b])}</em> : <em className="pd-bb bosh" aria-hidden="true" />);
const YozuvIx = ({ no, usul, belgi, tuz, qayta, yangi }) => (
  <span className={cx('pd-yix', yangi && 'yangi')}><i>{no}</i><b>{tr(usulNom(usul))}</b>{belgi && <Belgi b={belgi} />}{tuz && <Belgi b="tuz" />}{qayta && <Belgi b={qayta} />}</span>
);

const SoatIc = ({ yur }) => <svg className={cx('pd-soat-ic', yur && 'yur')} viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.4" /><path className="pd-soat-mil" d="M8 8V4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 8h2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;

// Telefon ekrani — ilova: to'lov taklifi · «E'lon berish» · «To'lov o'tmadi» · «Javob kutilmoqda» (+ «Qayta tekshirish»)
const IlovaEkran = ({ t }) => {
  const on = t.on || {};
  const e = t.ilova || 'taklif';
  return (
    <div className="pd-ilova">
      <div className="pd-il-bosh"><span className="pd-tag">{tr(TOLOV_SAHNA.ilova)}</span><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b></div>
      {e === 'taklif' && <div className="pd-il-k">
        <b className="pd-il-sar">{tr(TOLOV_EKRANI.sarlavha)}</b>
        <span className="pd-il-matn">{tr(TOLOV_EKRANI.matn)}</span>
        <span className="pd-narx"><b>{tr(TOLOV_EKRANI.narx)}</b><em>{tr(TOLOV_EKRANI.taxmin)}</em></span>
        <button type="button" className={cx('pd-otish', halqa(t.joriy === 'otish'))} disabled={!on.otish} onClick={on.otish}>{tr(TOLOV_EKRANI.tugma)}</button>
        <span className="pd-il-test">{tr(TOLOV_EKRANI.test)}</span>
      </div>}
      {e === 'elon' && <div className="pd-il-k">
        <b className="pd-il-sar">{tr(ILOVA_HOLATLAR.elon)}</b>
        <span className="pd-il-oyin">{tr(ILOVA_HOLATLAR.oyin)}</span>
        <span key={t.elonYoq ? 'y' : 'n'} className={cx('pd-belgi-q', t.elonYoq && 'yoq')}><i>{t.elonYoq ? '✓' : ''}</i>{tr(ILOVA_HOLATLAR.takrorlansin)}</span>
        {t.elonYoq && <span className="pd-il-pro">Pro · {tr(TOLOV_SAHNA.kun(30))}</span>}
      </div>}
      {e === 'otmadi' && <div className="pd-il-k">
        <span className="pd-il-xabar err">{tr(ILOVA_HOLATLAR.otmadi)}</span>
        <button type="button" className={cx('pd-otish', halqa(t.joriy === 'otish'))} disabled={!on.otish} onClick={on.otish}>{tr(TOLOV_EKRANI.tugma)}</button>
      </div>}
      {e === 'kutilmoqda' && <div className="pd-il-k">
        <span className="pd-il-xabar kul">{tr(ILOVA_HOLATLAR.kutilmoqda)}{t.eski && <em className="pd-eski">{tr(TOLOV_SAHNA.eski)}</em>}</span>
        {t.qtekshir && <button type="button" className={cx('pd-qtekshir', halqa(t.joriy === 'qtekshir'))} disabled={!on.qtekshir} onClick={on.qtekshir}>{tr(ILOVA_HOLATLAR.qtekshir)}</button>}
      </div>}
    </div>
  );
};
// Telefon ekrani — brauzer: «Mashq to'lov» sahifasi (Payme ko'rinishi, SABOQ P6): ikki asosiy tugma, «Tekshiruv tugmalari» (to'rtta), javob qatori, test qatori
const BrauzerEkran = ({ t }) => {
  const on = t.on || {};
  const tb = (k, nom, sinf) => (
    <button type="button" key={k} className={cx('pd-tb', 'pd-' + k, sinf, halqa(t.joriy === k), t.yangi && (k === 'kech' || k === 'imzo') && 'yangi')} disabled={!on[k]} onClick={on[k]}>{tr(nom)}</button>
  );
  const jv = t.javob ? MASHQ_SAHIFA.javob[t.javob] : null;
  return (
    <>
      <div className="pd-br-bar"><span className="pd-tag">{tr(TOLOV_SAHNA.brauzer)}</span><code>{TOLOV_SAHNA.manzil}</code></div>
      <div className="pd-mashq">
        <div className="pd-pm-bosh"><b>Payme</b><span>{tr({ uz: 'mashq', ru: 'учебно' })}</span></div>
        <div className="pd-m-ich">
          <span className="pd-m-sar">{tr(MASHQ_SAHIFA.sarlavha)}</span>
          <span className="pd-m-nom"><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b> — {tr(MASHQ_SAHIFA.mahsulot)}</span>
          <span className="pd-m-summa"><b>{tr(MASHQ_SAHIFA.summa)}</b><em>{tr(TOLOV_EKRANI.taxmin)}</em></span>
          <div className="pd-m-asos">{tb('tolash', MASHQ_SAHIFA.tolash)}{tb('rad', MASHQ_SAHIFA.rad)}</div>
          <div className={cx('pd-m-tek', t.tekXira && 'xira')}>
            <span className="pd-m-tek-y">{tr(MASHQ_SAHIFA.tekshiruv)}</span>
            {tb('ikki', MASHQ_SAHIFA.ikki)}{tb('imzosiz', MASHQ_SAHIFA.imzosiz)}{!t.ikkiTugmaYoq && tb('kech', MASHQ_SAHIFA.kech)}{!t.ikkiTugmaYoq && tb('imzo', MASHQ_SAHIFA.imzo)}
          </div>
          <span key={t.javob || 'yoq'} className={cx('pd-m-javob', jv && JAVOB_RANG[t.javob])}>{jv ? tr(jv) : ' '}</span>
          <span className="pd-m-test">{tr(MASHQ_SAHIFA.test)}</span>
        </div>
      </div>
    </>
  );
};
// Telefon — o'lchami barqaror 170×272 hamma ekranda; yorliq ramka ustida; ekran tepasida «ilova» / «brauzer»
const Telefon = ({ t = {}, pufak }) => (
  <div className={cx('pd-tel-ust', t.ramka && 'pd-joriy')}>
    {pufak}
    <span className="pd-tel-yorliq">{tr(t.yorliq || TOLOV_SAHNA.telefon)}</span>
    <div className="pd-telefon"><div className="pd-tel-ekran" key={t.ekran === 'brauzer' ? 'br' : 'il-' + (t.ilova || 'taklif')}>{t.ekran === 'brauzer' ? <BrauzerEkran t={t} /> : <IlovaEkran t={t} />}</div></div>
    {t.osti}
  </div>
);
// Antigravity pufagi (T-008) — telefon ustida; javobdan keyin kulrang yorliq «da'vo · tekshirilmagan»
const AgentPufak = ({ matn, yorliq }) => (
  <div className="pd-pufak fade-step"><b>{TOLOV_SAHNA.agent}</b><span>{tr(matn)}</span>{yorliq && <em className="fade-step">{tr(yorliq)}</em>}</div>
);
const XabarOchiq = ({ x }) => (
  <div className="pd-xabar fade-step">
    <code>tolovRaqami: '{x.raqam}'</code>
    <code className={cx(x.holat === 'rad' && 'ajrat')}>holat: '{x.holat}'</code>
    <code className={cx('pd-xb-imzo', x.imzoXato && 'xato')}>X-Imzo: {x.imzoXato ? '0b7d…' : '3f9a…'}</code>
  </div>
);
const MiniJadval = ({ qatorlar = [] }) => (
  <div className="pd-jadval">
    <div className="pd-j-bosh"><code>tolovlar</code><span key={qatorlar.length} className={cx('pd-j-son', qatorlar.length > 0 && 'pd-pop')}>{tr(TOLOV_SAHNA.qatorSoni(qatorlar.length))}</span></div>
    {qatorlar.map((r, i) => <div key={r.r + i} className={cx('pd-j-q', r.h === 'rad' && 'rad', r.yangi && 'yangi')}><span>{r.r}</span><span>{r.h}</span></div>)}
  </div>
);
// Tekshiruv qatorlari — Mentor kodi tartibi: imzo → Pro (faqat `tolandi`) → raqam → yozuv; tuzatishdan keyin Pro qatori yozuv bilan birga oxirga ko'chadi
const tekMatn = (k, h, b) => (k === 'imzo' ? (h === 'err' ? 'imzo ✗' : h ? 'imzo ✓' : 'imzo')
  : k === 'raqam' ? (b.raqam ? `raqam: ${b.raqam}` : 'raqam')
    : k === 'yozuv' ? (h === 'otkaz' ? tr(TOLOV_SAHNA.yozilmadi) : 'yozuv') : 'Pro +30 kun');
const BackendTugun = ({ b = {} }) => {
  const q = b.qatorlar || {};
  const tartib = b.proKeyin ? ['imzo', 'raqam', 'yozuv', 'pro'] : ['imzo', 'pro', 'raqam', 'yozuv'];
  const pro = b.pro == null ? '—' : b.pro;
  return (
    <div className={cx('pd-backend', b.joriy && 'pd-joriy')}>
      <div className="pd-be-bosh"><b>Backend</b>{b.yangiRaqam && (b.pro == null || b.pro === '—') && <span key={b.yangiRaqam} className="pd-be-yangi">{tr(TOLOV_SAHNA.yangiRaqam)}</span>}</div>
      <div className="pd-bq"><b>{tr(MASHQ_SAHIFA.sarlavha)}</b>{b.soat != null && <span className={cx('pd-soat', b.soat >= 70 && 'tugadi')}><SoatIc yur={b.soat < 70} />{tr(TOLOV_SAHNA.soniya(b.soat))}</span>}</div>
      <div className="pd-ichki"><span className="pd-ichki-i" />{b.kv && <span key={b.kv} className={cx('pd-kv ichki', b.kvTur)}><i className="pd-kv-i" /></span>}</div>
      <div className="pd-bq wh">
        <code className="pd-wh">POST /tolov/webhook</code>
        {b.xabar && !b.ixcham && <XabarOchiq x={b.xabar} />}
        <div className="pd-tek">{tartib.map(k => <span key={k} className={cx('pd-tq', q[k], b.kochdi && k === 'pro' && 'kochdi')}>{tekMatn(k, q[k], b)}</span>)}</div>
      </div>
      <MiniJadval qatorlar={b.jadval || []} />
      <span className={cx('pd-pro', b.proErr ? 'err' : pro !== '—' && 'ok')}>{tr(TOLOV_SAHNA.proMuddati)}: <b key={String(pro)} className={cx(pro !== '—' && 'pd-pop')}>{pro === '—' ? '—' : tr(TOLOV_SAHNA.kun(pro))}</b></span>
    </div>
  );
};
// Konvert: so'rov · javob · `GET /men` — telefon va Backend orasidagi chiziq bo'ylab uchadi (reduced-motion — ko'rinmaydi)
const Konvert = ({ k }) => (k ? <span key={k.id} className={cx('pd-kv', k.tur, k.yon === 'ba' && 'ba')}><i className="pd-kv-i" />{k.yorliq && <b className="pd-kv-y">{tr(k.yorliq)}</b>}</span> : null);
const TolovSahna = ({ tel, be, k, pufak, sinf }) => {
  const mob = useIsMobile(640);
  return (
    <div className={cx('pd-sahna', mob ? 'tik' : 'yot', sinf)}>
      <div className="pd-s-tel"><Telefon t={tel} pufak={pufak} /></div>
      <div className="pd-s-ch"><div className={cx('pd-chiziq', mob ? 'tik' : 'yot')}><span className="pd-chiziq-i" /><Konvert k={k} /></div></div>
      <div className="pd-s-be"><BackendTugun b={be} /></div>
    </div>
  );
};

// Ballsiz bashorat: tanlangach ixcham qator bo'lib natijagacha turadi (SABOQ 11); har chipning o'z yengil chegarasi (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="pd-chorla"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="pd-bash-ix fade-step"><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosa qutisining birinchi kichik qatori; QIzoh — oxirgi kichik qatori (E 42)
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="pd-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="pd-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="pd-x-m">{matn}</span>{izoh && <span className="pd-x-iz">{izoh}</span>}</>;
const QADAMLAR_Y = { uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' };
const navYorliq = (taxmin, q, jami, done) => (done ? { uz: 'Davom etish', ru: 'Продолжить' }
  : !taxmin ? BASH_YORLIQ : { uz: `${QADAMLAR_Y.uz} (${q}/${jami})`, ru: `${QADAMLAR_Y.ru} (${q}/${jami})` });
const NomQator = ({ matn }) => (matn ? <p className="pd-nom fade-step" key={ou(matn).slice(0, 14)}>{tx(matn)}</p> : null);
const Ustoz = ({ satrlar }) => (useMentorLive() ? <div className="pd-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div> : null);
const QadamQator = ({ qadamlar, q }) => (
  <div className="pd-qchip">{qadamlar.map((c, i) => <span key={i} className={cx('pd-qc', i < q && 'ok', i === q && 'joriy')}><i>{i < q ? '✓' : i + 1}</i>{tr(c)}</span>)}</div>
);
// Sahna boshlang'ich holati: Pro yo'q, jadval bo'sh, tekshiruv qatorlari o'chiq
const BE_BOSH = { qatorlar: {}, jadval: [], pro: '—', proErr: false, kv: null, xabar: null, raqam: null, soat: null };

// ===== SCREEN 0 — KIRISH (QKirish): «To'lovga o'tish» → brauzer; «To'lash (mashq)» → konvert, Pro 30 kun, ilova «Har hafta takrorlansin» yoqiq; keyin variantlar =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Ha — bitta to'lov o'tdi, demak ishlaydi", ru: 'Да — один платёж прошёл, значит работает' } },
  { id: 'b', label: { uz: "Bilmayman — to'lov xabari kech kelsa-chi?", ru: 'Не знаю — а если сообщение о платеже придёт поздно?' } },
  { id: 'c', label: { uz: "Ha — agent ham «to'lov ishlaydi» dedi", ru: 'Да — агент тоже сказал «оплата работает»' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Bitta to'lov — bitta holat. To'lov xabari ikki marta, kech yoki noto'g'ri imzo bilan ham kelishi mumkin.</>, ru: <><b>Именно!</b> Один платёж — один случай. Сообщение о платеже может прийти дважды, поздно или с неверной подписью.</> },
  a: { uz: <><b>Qiziq fikr!</b> Bu oddiy holat edi. Xabar ikki marta yoki kech kelsa ham shunday bo'ladimi — hali ko'rilmagan.</>, ru: <><b>Интересная мысль!</b> Это был простой случай. Будет ли так же, если сообщение придёт дважды или поздно, — ещё не проверено.</> },
  c: { uz: <><b>Qiziq fikr!</b> Agentning «ishlaydi» degani — da'vo: kech yoki ikki marta kelgan xabar bilan hali tekshirilmagan.</>, ru: <><b>Интересная мысль!</b> «Работает» от агента — заявление: с поздним или двойным сообщением ещё не проверено.</> }
};
const AGENT_DAVO = { uz: "Tayyor! To'lov ishlaydi: to'langach Pro yoqiladi.", ru: 'Готово! Оплата работает: после оплаты включается Pro.' };
const DAVO_YORLIQ = { uz: "da'vo · tekshirilmagan", ru: 'заявление · не проверено' };
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [bosqich, setBosqich] = useState(avval ? 3 : 0); // 0 taklif · 1 brauzer · 2 yuryapti · 3 tayyor
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [tel, setTel] = useState(avval ? { ekran: 'ilova', ilova: 'elon', elonYoq: true } : { ekran: 'ilova', ilova: 'taklif' });
  const [be, setBe] = useState(avval ? { ...BE_BOSH, qatorlar: { imzo: 'ok', pro: 'ok', raqam: 'ok', yozuv: 'ok' }, raqam: 'yangi', jadval: [{ r: 'm-c41e…', h: 'tolandi' }], pro: 30 } : BE_BOSH);
  const [k, setK] = useState(null);
  const [sc, setSc] = useState(0);
  const ketma = useKetma();
  const upBe = (p) => setBe(o => ({ ...o, ...p }));
  const upQ = (kalit, h) => setBe(o => ({ ...o, qatorlar: { ...o.qatorlar, [kalit]: h } }));
  const otish = () => {
    if (bosqich !== 0) return;
    setBosqich(1); setSc(n => n + 1);
    setK({ id: 'o', tur: 'sorov', yon: 'ab' });
    ketma([[600, () => { setK(null); setTel({ ekran: 'brauzer', tekXira: true }); }]]);
  };
  const tolash = () => {
    if (bosqich !== 1) return;
    setBosqich(2);
    setTel(o => ({ ...o, javob: 'tolandi' }));
    ketma([[450, () => upBe({ kv: 'h1' })], [850, () => { upBe({ kv: null }); upQ('imzo', 'ok'); }], [330, () => upQ('pro', 'ok')],
      [330, () => { upQ('raqam', 'ok'); upBe({ raqam: 'yangi' }); }], [330, () => { upQ('yozuv', 'ok'); upBe({ jadval: [{ r: 'm-c41e…', h: 'tolandi', yangi: true }] }); }],
      [450, () => upBe({ pro: 30 })], [700, () => setK({ id: 'm', tur: 'men', yon: 'ba', yorliq: 'GET /men' })],
      [800, () => { setK(null); setTel({ ekran: 'ilova', ilova: 'elon', elonYoq: false }); }], [600, () => setTel({ ekran: 'ilova', ilova: 'elon', elonYoq: true })],
      [500, () => { setBosqich(3); setSc(n => n + 1); }]]);
  };
  const pick = (v) => {
    if (picked !== null || bosqich !== 3) return;
    setPicked(v); setSc(n => n + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
  };
  const javob = picked !== null;
  const telOn = bosqich === 0 ? { ...tel, on: { otish }, joriy: 'otish' } : bosqich === 1 ? { ...tel, on: { tolash }, joriy: 'tolash' } : tel;
  const mGap = bosqich === 0 ? { uz: "Mentor misolida tashkilotchi Pro'ni yoqmoqchi — «To'lovga o'tish» ni bosing.", ru: 'В примере Ментора организатор хочет включить Pro — нажмите «Перейти к оплате».' }
    : bosqich < 3 ? { uz: "Endi mashq sahifasida «To'lash (mashq)» ni bosing.", ru: 'Теперь на учебной странице нажмите «Оплатить (учебно)».' }
      : { uz: "Endi o'ngdagi javoblardan birini tanlang.", ru: 'Теперь выберите один из ответов справа.' };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!javob} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('pd-k', bosqich === 3 && !javob && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Bir marta to'landi — endi to'lov <span className="italic" style={{ color: T.accent }}>ishlaydimi?</span></>, ru: <>Один раз оплатили — <span className="italic" style={{ color: T.accent }}>теперь оплата работает?</span></> })}
          mentor={<Mentor>{tr(mGap)}</Mentor>}
          maket={<TolovSahna sinf="kirish" tel={telOn} be={be} k={k} pufak={<AgentPufak matn={AGENT_DAVO} yorliq={javob ? DAVO_YORLIQ : null} />} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={bosqich !== 3}
          javob={javob && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda dars oxiridagi holat — telefon uch kadr bir marta o'zi yuradi + `BUZISH.md` «To'lov» kartasi (belgi joyi bo'sh, U-041); o'ngda 3 qadam =====
const REJA = [
  { uz: "Test rejimdagi to'lov oqimining qolgan holatlari", ru: 'Остальные состояния потока оплаты в тестовом режиме' },
  { uz: "To'lovni to'rt usul bilan buzish va yozib borish", ru: 'Ломать оплату четырьмя способами и записывать' },
  { uz: "Topilganini tuzatish va o'sha usul bilan qayta tekshirish", ru: 'Исправить найденное и перепроверить тем же способом' }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [kadr, setKadr] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1300, () => setKadr(1)], [1500, () => setKadr(2)], [700, () => setKadr(3)]]); }, []); // eslint-disable-line
  const tel = kadr === 0 ? { ekran: 'ilova', ilova: 'otmadi' } : kadr === 1 ? { ekran: 'ilova', ilova: 'kutilmoqda', qtekshir: true } : { ekran: 'ilova', ilova: 'elon', elonYoq: kadr === 3 };
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun to'lov yo'lingizni <span className="italic" style={{ color: T.accent }}>buzasiz va tuzatasiz</span>.</>, ru: <>Сегодня вы <span className="italic" style={{ color: T.accent }}>сломаете и почините</span> путь оплаты.</> })}
        mentor={<Mentor>{tr({ uz: "Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingizda qilasiz. Buzish faqat o'z mahsulotingizda — mashq to'lov tugmalari bilan.", ru: 'Каждый шаг вы сначала увидите на примере «Maydon Jamoa», потом сделаете в своём продукте. Ломаем только свой продукт — кнопками учебной оплаты.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="pd-reja-chap">
          <Telefon t={tel} />
          <div className="pd-bmd fade-up">
            <span className="pd-bmd-bosh"><code>BUZISH.md</code><b>«To'lov»</b></span>
            {USULLAR.map((u, i) => <span key={u.usul} className="pd-bmd-q"><i>{i + 1}</i><span>{tr(u.nom)}</span><em className="pd-bb bosh" aria-hidden="true" /></span>)}
          </div>
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r) }))}
      >
        <p className="pd-reja-past">{tx({ uz: "o'z repo'ngiz — ilova, `backend/`, `BUZISH.md` «To'lov» · Mentor misoli `maydon-jamoa` · boshlang'ich holat `m13-dars-05-start` · namuna `m13-dars-05-done`", ru: 'ваш репозиторий — приложение, `backend/`, `BUZISH.md` «To\'lov» · пример Ментора `maydon-jamoa` · начальное состояние `m13-dars-05-start` · образец `m13-dars-05-done`' })}</p>
        <QIzoh>{tx({ uz: "Mentor misolida `m13-dars-05-start` — agent «to'lov ishlaydi» degan kod: to'rt usul bilan hali tekshirilmagan.", ru: 'В примере Ментора `m13-dars-05-start` — код, про который агент сказал «оплата работает»: четырьмя способами ещё не проверен.' })}</QIzoh>
        <Ustoz satrlar={[
          { uz: "Darsning og'ir qismlari — 1-amaliyot (Backend va ilova o'zgaradi, Render kutiladi) va 2-amaliyot (to'rt urinish, birida 70 soniya kutiladi). 3 va 6-ekranlarga ortiqcha vaqt bermang.", ru: 'Тяжёлые части урока — практика 1 (меняются Backend и приложение, ждём Render) и практика 2 (четыре попытки, в одной ждём 70 секунд). Не тратьте лишнее время на экраны 3 и 6.' },
          { uz: "Pul chegarasi: hech kim haqiqiy to'lov xizmatiga ro'yxatdan o'tmaydi, karta ma'lumotini yozmaydi; mashq sahifasi karta so'ramaydi. «Buzish» — faqat o'quvchining o'z mahsulotida: sinfdoshining sayti yoki Backend'i, Payme, Click — tekshirilmaydi.", ru: 'Денежная граница: никто не регистрируется в настоящем платёжном сервисе и не вводит данные карты; учебная страница карту не просит. «Ломаем» только свой продукт: сайт или Backend одноклассника, Payme, Click не проверяем.' },
          { uz: "Juftlikda ishlash qulay: biri telefonda tugmalarni bosadi, ikkinchisi Neon'da `tolovlar` va Pro muddatiga qaraydi — har kim baribir o'z mahsulotini buzadi.", ru: 'Удобно работать в паре: один нажимает кнопки на телефоне, второй смотрит `tolovlar` и срок Pro в Neon — но каждый ломает свой продукт.' }
        ]} />
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · to'rt usul (bashorat + 4 qadam, bittadan): har urinish oldidan sahna boshlang'ich holatga qaytadi =====
const S2_TAXMIN = [{ k: 'hech', t: { uz: 'Hech biri', ru: 'Ни один' } }, { k: 'ikki', t: { uz: 'Ikkitasi', ru: 'Два' } }, { k: 'tort', t: { uz: "To'rttalasi", ru: 'Все четыре' } }];
const S2_CHIP = [{ uz: 'Ikki marta', ru: 'Дважды' }, { uz: 'Kechiktirib', ru: 'С задержкой' }, { uz: 'Rad', ru: 'Отказ' }, { uz: "Noto'g'ri imzo", ru: 'Неверная подпись' }];
const S2_NATIJA = [
  { uz: 'buzildi — qator bitta, Pro ikki marta uzaydi', ru: 'сломалось — строка одна, Pro продлился дважды' },
  { uz: "buzildi — sahifa «o'tmadi» dedi, Pro esa yoqildi", ru: 'сломалось — страница сказала «не прошёл», а Pro включился' },
  { uz: 'buzilmadi', ru: 'не сломалось' },
  { uz: 'buzilmadi', ru: 'не сломалось' }
];
const S2_RAQAM = ['m-9b07…', 'm-5d2a…', 'm-e813…', 'm-07fb…'];
const S2_TEL_BOSH = { ekran: 'brauzer', javob: null };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 4 : 0);
  const [band, setBand] = useState(false);
  const [tel, setTel] = useState(S2_TEL_BOSH);
  const [be, setBe] = useState(avval ? { ...BE_BOSH, qatorlar: { imzo: 'err' }, xabar: { raqam: S2_RAQAM[3], holat: 'tolandi', imzoXato: true } } : { ...BE_BOSH, yangiRaqam: 1 });
  const ketma = useKetma();
  const done = q >= 4;
  const tugadi = useTugadi(done, 1100, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const upBe = (p) => setBe(o => ({ ...o, ...p }));
  const upQ = (kalit, h) => setBe(o => ({ ...o, qatorlar: { ...o.qatorlar, [kalit]: h } }));
  const bosh = (i) => { setTel(S2_TEL_BOSH); setBe({ ...BE_BOSH, yangiRaqam: i + 1 }); };
  const tugat = (n, ms = 500) => [ms, () => { setQ(n); setBand(false); }];
  const qaytar = (n) => [1700, () => { if (n < 4) bosh(n); }];
  const ikki = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true);
    const x = { raqam: S2_RAQAM[0], holat: 'tolandi' };
    ketma([[250, () => upBe({ kv: 'a1', xabar: x })], [850, () => { upBe({ kv: null }); upQ('imzo', 'ok'); }], [320, () => upQ('pro', 'ok')], [320, () => { upQ('raqam', 'ok'); upBe({ raqam: 'yangi' }); }],
      [320, () => { upQ('yozuv', 'ok'); upBe({ jadval: [{ r: x.raqam, h: 'tolandi', yangi: true }] }); }], [350, () => { upBe({ pro: 30 }); setTel(o => ({ ...o, javob: 'ok' })); }],
      [800, () => upBe({ kv: 'a2', qatorlar: {}, raqam: null })], [850, () => { upBe({ kv: null }); upQ('imzo', 'ok'); }], [340, () => upQ('pro', 'err')],
      [340, () => { upQ('raqam', 'bor'); upBe({ raqam: 'bor' }); }], [340, () => { upQ('yozuv', 'otkaz'); setTel(o => ({ ...o, javob: 'takror' })); }],
      [380, () => upBe({ pro: 60, proErr: true, jadval: [{ r: x.raqam, h: 'tolandi' }] })], tugat(1, 600), qaytar(1)]);
  };
  const kech = () => {
    if (q !== 1 || band) return;
    setBand(true);
    const x = { raqam: S2_RAQAM[1], holat: 'tolandi' };
    const soat = [0, 10, 20, 30, 40, 50, 60, 70].map((s, i) => [i === 0 ? 200 : 480, () => {
      upBe({ soat: s });
      if (s === 10) setTel(o => ({ ...o, javob: 'otmadi' }));
      if (s === 30) setTel({ ekran: 'ilova', ilova: 'kutilmoqda' });
    }]);
    ketma([...soat, [300, () => upBe({ kv: 'b1', xabar: x })], [850, () => { upBe({ kv: null }); upQ('imzo', 'ok'); }], [300, () => upQ('pro', 'ok')], [300, () => { upQ('raqam', 'ok'); upBe({ raqam: 'yangi' }); }],
      [300, () => { upQ('yozuv', 'ok'); upBe({ jadval: [{ r: x.raqam, h: 'tolandi', yangi: true }] }); }], [350, () => { upBe({ pro: 30 }); setTel({ ekran: 'ilova', ilova: 'kutilmoqda', eski: true }); }],
      tugat(2, 700), qaytar(2)]);
  };
  const rad = () => {
    if (q !== 2 || band) return;
    setBand(true);
    const x = { raqam: S2_RAQAM[2], holat: 'rad' };
    setTel(o => ({ ...o, javob: 'otmadi' }));
    ketma([[350, () => upBe({ kv: 'c1', kvTur: 'rad', xabar: x })], [850, () => { upBe({ kv: null }); upQ('imzo', 'ok'); }], [320, () => upQ('pro', 'otkaz')], [320, () => { upQ('raqam', 'ok'); upBe({ raqam: 'yangi' }); }],
      [320, () => { upQ('yozuv', 'ok'); upBe({ jadval: [{ r: x.raqam, h: 'rad', yangi: true }] }); }], [600, () => setTel({ ekran: 'ilova', ilova: 'otmadi' })], tugat(3, 700), qaytar(3)]);
  };
  const imzo = () => {
    if (q !== 3 || band) return;
    setBand(true);
    ketma([[250, () => upBe({ kv: 'd1', kvTur: 'xato', xabar: { raqam: S2_RAQAM[3], holat: 'tolandi', imzoXato: true } })], [850, () => { upBe({ kv: null }); upQ('imzo', 'err'); }],
      [450, () => setTel(o => ({ ...o, javob: '401' }))], tugat(4, 600)]);
  };
  const tugmalar = { ikki, kech, rad, imzo };
  const joriy = !taxmin || band || done ? null : ['ikki', 'kech', 'rad', 'imzo'][q];
  const telOn = tel.ekran === 'brauzer' && joriy ? { ...tel, on: { [joriy]: tugmalar[joriy] }, joriy } : tel;
  const nom = q >= 1 ? { uz: "12-Modulda ilovani uch usul bilan buzgansiz — bugun to'lov xabarini to'rt usul bilan.", ru: 'В 12-м модуле вы ломали приложение тремя способами — сегодня сообщение о платеже четырьмя.' } : null;
  const mGap = done ? { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' }
    : q === 0 ? { uz: "Mentor misolida agent «to'lov ishlaydi» degan — avval taxminingizni belgilang, keyin «Ikki marta yuborish» ni bosing.", ru: 'В примере Ментора агент сказал «оплата работает» — сначала отметьте предположение, потом нажмите «Ikki marta yuborish».' }
      : q === 1 ? { uz: "Endi «Kechiktirib yuborish» ni bosing va ilovaga qarang.", ru: 'Теперь нажмите «Kechiktirib yuborish» и смотрите на приложение.' }
        : q === 2 ? { uz: "Endi «Rad etish (mashq)» ni bosing.", ru: 'Теперь нажмите «Отклонить (учебно)».' }
          : { uz: "Oxirgisi — «Noto'g'ri imzo» ni bosing.", ru: 'Последняя — нажмите «Noto\'g\'ri imzo».' };
  const ost = { uz: "Bu tugmalar faqat o'z Backend'ingizni chaqiradi — boshqa odamning sayti yoki xizmati tekshirilmaydi.", ru: 'Эти кнопки вызывают только ваш Backend — чужой сайт или сервис не проверяется.' };
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · to'rt usul", ru: 'Понятие · четыре способа' })} screen={screen} scrollSignal={q + (tugadi ? 10 : 0)} deskSignal={tugadi ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 4, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>To'lov xabari <span className="italic" style={{ color: T.accent }}>kech yoki ikki marta</span> kelsa-chi?</>, ru: <>А если сообщение придёт <span className="italic" style={{ color: T.accent }}>поздно или дважды</span>?</> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={<Bashorat savol={{ uz: "To'rt usuldan nechtasi Mentor misolida to'lovni buzadi?", ru: 'Сколько из четырёх способов ломают оплату в примере Ментора?' }} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={tugadi
          ? <div className="pd-viz pd-yakun2">
            <TolovSahna tel={telOn} be={{ ...be, ixcham: true }} />
            <div className="pd-yp">
              <div className="pd-yix-l">{USULLAR.map((u, i) => <YozuvIx key={u.usul} no={i + 1} usul={u.usul} belgi={MENTOR_YOZUV[i].belgi} />)}</div>
              <NomQator matn={nom} />
              <p className="pd-ost">{tr(ost)}</p>
            </div>
          </div>
          : <div className="pd-viz">
            <QadamQator qadamlar={S2_CHIP} q={q} />{q > 0 && <span key={q} className={cx('pd-chip-n fade-step', q <= 2 ? 'err' : 'kul')}>{q} · {tr(S2_NATIJA[q - 1])}</span>}
            <TolovSahna tel={telOn} be={be} />
            <NomQator matn={nom} />
            <p className="pd-ost">{tr(ost)}</p>
          </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'ikki'} haqiqat={{ uz: 'ikkitasi', ru: 'два' }} />}
          matn={tr({ uz: "Bu misolda oddiy to'lov ishlagan, lekin ikki marta va kech kelgan xabar to'lovni buzdi.", ru: 'В этом примере обычная оплата работала, но двойное и опоздавшее сообщение её сломали.' })}
          izoh={tr({ uz: "«Kechiktirib yuborish» — mashq, uxlashning nusxasi emas: haqiqiy bepul Backend 15 daqiqa so'rovsiz qolsa uxlaydi.", ru: '«Kechiktirib yuborish» — упражнение, а не копия сна: настоящий бесплатный Backend засыпает после 15 минут без запросов.' })} />}
      >
        <Ustoz satrlar={[{ uz: "Haqiqiy to'lov xizmatlarida ham xabar ikki marta kelishi mumkin — Payme javob yo'qolsa xuddi shu so'rovni qayta yuboradi, uning test muhiti ba'zi so'rovlarni ataylab ikki marta yuboradi; Stripe — «bir xabar bir necha marta kelishi mumkin», xabarlar yaratilgan tartibda kelmasligi ham mumkin. Darsda brend tilga olinmaydi (3-darsda ko'rilgan).", ru: 'И в настоящих платёжных сервисах сообщение может прийти дважды — Payme при потере ответа повторяет тот же запрос, его тестовая среда некоторые запросы нарочно шлёт дважды; Stripe — «одно сообщение может прийти несколько раз», и не обязательно в порядке создания. На уроке бренд не называем (был на 3-м уроке).' }]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen; INLINE_KEYS.s4 = 2, C) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Ikki marta yuborildi: qator bitta, Pro esa 60 kun. Nega?"
    question={tr({ uz: <h2 className="title h-ask">Ikki marta yuborildi: qator bitta, Pro esa 60 kun. <span className="italic" style={{ color: T.accent }}>Nega?</span></h2>, ru: <h2 className="title h-ask">Отправили дважды: строка одна, а Pro — 60 дней. <span className="italic" style={{ color: T.accent }}>Почему?</span></h2> })}
    options={[
      { uz: 'Sahifa ikkinchi xabarga yangi raqam bergan', ru: 'Страница дала второму сообщению новый номер' },
      { uz: "Ikkinchi xabar imzosiz kelib o'tib ketgan", ru: 'Второе сообщение пришло без подписи и прошло' },
      { uz: 'Pro takror tekshiruvidan oldin uzaygan', ru: 'Pro продлился до проверки повтора' },
      { uz: "Ilova Pro holatini ikki marta so'ragan", ru: 'Приложение дважды запросило статус Pro' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Bu misolda Pro qatori takror tekshiruvidan oldin ishlaydi — ikkinchi xabar ham Pro qo'shadi.", ru: 'В этом примере строка Pro срабатывает до проверки повтора — второе сообщение тоже добавляет Pro.' }}
    explainWrong={{
      0: { uz: "Raqam yangi bo'lsa, `tolovlar` da ikki qator bo'lardi.", ru: 'Если бы номер был новый, в `tolovlar` было бы две строки.' },
      1: { uz: "Imzosiz xabarga `401` — u hech narsa yozmaydi.", ru: 'На сообщение без подписи — `401`, оно ничего не пишет.' },
      3: { uz: 'Ilova faqat o\'qiydi — Pro muddatini Backend yozadi.', ru: 'Приложение только читает — срок Pro пишет Backend.' },
      default: { uz: 'Pro qatori qayerda turganiga qarang.', ru: 'Посмотрите, где стоит строка Pro.' }
    }} />
);

// ===== SCREEN 5 — TUSHUNCHA · buzish yozuvi (bashorat + 4 qadam): solishtirish → agentga → qayta: kechiktirib → qayta: ikki marta =====
const S5_TAXMIN = [{ k: 'yoq', t: { uz: "Yo'q — Pro oxiri yoqildi, demak to'lov ishladi", ru: 'Нет — Pro в итоге включился, значит оплата сработала' } }, { k: 'ha', t: { uz: "Ha — foydalanuvchiga noto'g'ri holat ko'rsatildi", ru: 'Да — пользователю показали неверное состояние' } }];
const S5_CHIP = [{ uz: 'Solishtiring', ru: 'Сравните' }, { uz: 'Agentga bering', ru: 'Отдайте агенту' }, { uz: 'Qayta: kechiktirib', ru: 'Снова: с задержкой' }, { uz: 'Qayta: ikki marta', ru: 'Снова: дважды' }];
// «Nima kutdim» / «Nima bo'ldi» matnidagi mos kelmagan bo'laklar navbat bilan qizil ostiga chiziladi (MENTOR_YOZUV[1].farq)
const chizilgan = (matn, bolaklar, n) => {
  let qism = [matn];
  bolaklar.forEach((b, i) => {
    qism = qism.flatMap(p => {
      if (typeof p !== 'string' || !p.includes(b)) return [p];
      const [a, ...rest] = p.split(b);
      return [a, <span key={'f' + i} className={cx('pd-farq', i < n && 'on')}>{fmtCode(b)}</span>, rest.join(b)];
    });
  });
  return qism.map((p, i) => (typeof p === 'string' ? <React.Fragment key={i}>{fmtCode(p)}</React.Fragment> : p));
};
const AgentChat = ({ n }) => (
  <div className="pd-chat">
    {n >= 1 && <span className="pd-puf siz fade-step"><b>{tr(TOLOV_SAHNA.siz)}</b><span>{tr({ uz: 'Yozuvim pastda: ikki urinish kutganimdek emas. Tuzat, har muammoning sababini bir gap bilan ayt.', ru: 'Моя запись ниже: две попытки не как я ожидал. Исправь, причину каждой проблемы скажи одной фразой.' })}</span></span>}
    {n >= 2 && <span className="pd-puf ag fade-step"><b>{TOLOV_SAHNA.agent}</b><span>{tr({ uz: "Tuzatdim: Pro endi yozuvdan keyin uzayadi; javob kelmasa sahifa «Javob kutilmoqda» deydi, ilovada «Qayta tekshirish» bor.", ru: 'Исправил: Pro теперь продлевается после записи; если ответа нет, страница пишет «Ожидаем ответ», в приложении есть «Проверить снова».' })}</span></span>}
  </div>
);
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 4 : 0);
  const [band, setBand] = useState(false);
  const [kut, setKut] = useState(false); // 3-qadam: ilovada «Qayta tekshirish» bosilishi kutilmoqda
  const [chiz, setChiz] = useState(avval ? 2 : 0);
  const [belgi2, setBelgi2] = useState(avval ? 'buzildi' : null);
  const [chat, setChat] = useState(0);
  const [tuz, setTuz] = useState(avval);
  const [qayta, setQayta] = useState(avval ? { 1: 'takrorlanmadi', 2: 'takrorlanmadi' } : {});
  const [tel, setTel] = useState(avval ? { ekran: 'ilova', ilova: 'elon', elonYoq: true } : { ekran: 'ilova', ilova: 'kutilmoqda' });
  const [be, setBe] = useState(avval ? { ...BE_BOSH, proKeyin: true, pro: 30 } : BE_BOSH);
  const [k, setK] = useState(null);
  const ketma = useKetma();
  const done = q >= 4;
  const tugadi = useTugadi(done, 1100, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const upBe = (p) => setBe(o => ({ ...o, ...p }));
  const upQ = (kalit, h) => setBe(o => ({ ...o, qatorlar: { ...o.qatorlar, [kalit]: h } }));
  const solishtir = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true);
    ketma([[250, () => setChiz(1)], [800, () => setChiz(2)], [700, () => setBelgi2('buzildi')], [900, () => { setQ(1); setBand(false); }]]);
  };
  const agent = () => {
    if (q !== 1 || band) return;
    setBand(true);
    ketma([[200, () => setChat(1)], [900, () => setChat(2)], [700, () => setTuz(true)], [600, () => upBe({ proKeyin: true, kochdi: true })], [700, () => { setQ(2); setBand(false); }]]);
  };
  const qaytaKech = () => {
    if (q !== 2 || band) return;
    setBand(true);
    setTel({ ekran: 'brauzer', javob: null }); setBe({ ...BE_BOSH, proKeyin: true, yangiRaqam: 5 });
    const x = { raqam: 'm-a6c3…', holat: 'tolandi' };
    const soat = [0, 10, 20, 30, 40, 50, 60, 70].map((s, i) => [i === 0 ? 300 : 450, () => {
      upBe({ soat: s });
      if (s === 10) setTel(o => ({ ...o, javob: 'kutilmoqda' }));
      if (s === 30) setTel({ ekran: 'ilova', ilova: 'kutilmoqda', qtekshir: true });
    }]);
    ketma([...soat, [300, () => upBe({ kv: 'e1', xabar: x })], [850, () => { upBe({ kv: null }); upQ('imzo', 'ok'); }], [300, () => { upQ('raqam', 'ok'); upBe({ raqam: 'yangi' }); }],
      [300, () => { upQ('yozuv', 'ok'); upBe({ jadval: [{ r: x.raqam, h: 'tolandi', yangi: true }] }); }], [300, () => upQ('pro', 'ok')], [350, () => { upBe({ pro: 30 }); setKut(true); setBand(false); }]]);
  };
  const qtekshir = () => {
    if (!kut || band) return;
    setKut(false); setBand(true);
    setK({ id: 'men1', tur: 'men', yon: 'ab', yorliq: 'GET /men' });
    ketma([[800, () => setK({ id: 'men2', tur: 'javob', yon: 'ba', yorliq: 'Pro' })], [800, () => { setK(null); setTel({ ekran: 'ilova', ilova: 'elon', elonYoq: true }); }],
      [600, () => setQayta(o => ({ ...o, 2: 'takrorlanmadi' }))], [700, () => { setQ(3); setBand(false); }]]);
  };
  const qaytaIkki = () => {
    if (q !== 3 || band) return;
    setBand(true);
    setTel({ ekran: 'brauzer', javob: null }); setBe({ ...BE_BOSH, proKeyin: true, yangiRaqam: 6 });
    const x = { raqam: 'm-f19e…', holat: 'tolandi' };
    ketma([[350, () => upBe({ kv: 'f1', xabar: x })], [850, () => { upBe({ kv: null }); upQ('imzo', 'ok'); }], [300, () => { upQ('raqam', 'ok'); upBe({ raqam: 'yangi' }); }],
      [300, () => { upQ('yozuv', 'ok'); upBe({ jadval: [{ r: x.raqam, h: 'tolandi', yangi: true }] }); }], [300, () => { upQ('pro', 'ok'); upBe({ pro: 30 }); setTel(o => ({ ...o, javob: 'ok' })); }],
      [800, () => upBe({ kv: 'f2', qatorlar: {}, raqam: null })], [850, () => { upBe({ kv: null }); upQ('imzo', 'ok'); }], [320, () => { upQ('raqam', 'bor'); upBe({ raqam: 'bor' }); }],
      [320, () => { upQ('yozuv', 'otkaz'); setTel(o => ({ ...o, javob: 'takror' })); upBe({ jadval: [{ r: x.raqam, h: 'tolandi' }] }); }],
      [600, () => setQayta(o => ({ ...o, 1: 'takrorlanmadi' }))], [500, () => setTel({ ekran: 'ilova', ilova: 'elon', elonYoq: true })], [500, () => { setQ(4); setBand(false); }]]);
  };
  const telOn = kut ? { ...tel, on: { qtekshir }, joriy: 'qtekshir' } : tel;
  const nom = q >= 2 ? { uz: "«Tuzatish qilindi» — kod o'zgardi: bu ish fakti, natija emas.", ru: '«Tuzatish qilindi» (исправление сделано) — код изменился: это факт работы, а не результат.' }
    : q >= 1 ? { uz: "Har urinishga uch qator — 12-Moduldagi buzish yozuvi: nima qildim, nima kutdim, nima bo'ldi.", ru: 'На каждую попытку три строки — запись поломки из 12-го модуля: что сделал, что ожидал, что получилось.' } : null;
  const mGap = done ? { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' }
    : q === 0 ? { uz: "Avval taxminingizni belgilang, keyin «Solishtirish» ni bosing.", ru: 'Сначала отметьте предположение, потом нажмите «Сравнить».' }
      : q === 1 ? { uz: "Endi yozuvni agentga bering — «Agentga yuborish» ni bosing.", ru: 'Теперь отдайте запись агенту — нажмите «Отправить агенту».' }
        : q === 2 ? (kut ? { uz: "Ilovadagi «Qayta tekshirish» ni bosing.", ru: 'Нажмите «Проверить снова» в приложении.' } : { uz: "Kod o'zgardi — endi «Qayta: kechiktirib yuborish» ni bosing.", ru: 'Код изменился — теперь нажмите «Снова: с задержкой».' })
          : { uz: "Oxirgisi — «Qayta: ikki marta yuborish» ni bosing.", ru: 'Последнее — нажмите «Снова: дважды».' };
  const y2 = MENTOR_YOZUV[1];
  const farqN = (kalit) => y2.farq.map(f => tr(f[kalit]));
  const qatorlar = USULLAR.map((u, i) => ({ no: i + 1, usul: u.usul, belgi: i === 1 ? belgi2 : MENTOR_YOZUV[i].belgi, tuz: tuz && i < 2, qayta: qayta[i + 1] || null }));
  const harakat = !taxmin || done ? null
    : q === 1 ? <button type="button" className={cx('pd-agent', halqa(!band))} disabled={band} onClick={agent}>{tr({ uz: 'Agentga yuborish', ru: 'Отправить агенту' })}</button>
      : q === 2 && !kut ? <button type="button" className={cx('pd-qayta', halqa(!band))} disabled={band} onClick={qaytaKech}>{tr({ uz: 'Qayta: kechiktirib yuborish', ru: 'Снова: с задержкой' })}</button>
        : q === 3 ? <button type="button" className={cx('pd-qayta', halqa(!band))} disabled={band} onClick={qaytaIkki}>{tr({ uz: 'Qayta: ikki marta yuborish', ru: 'Снова: дважды' })}</button> : null;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · buzish yozuvi', ru: 'Понятие · запись поломки' })} screen={screen} scrollSignal={q + (kut ? 20 : 0) + (tugadi ? 10 : 0)} deskSignal={tugadi ? 2 : q === 3 && !done ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 4, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>«Buzildi» yonida <span className="italic" style={{ color: T.accent }}>yashil belgi</span> qachon chiqadi?</>, ru: <>Когда рядом с «сломалось» <span className="italic" style={{ color: T.accent }}>появится зелёная метка</span>?</> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={<Bashorat savol={{ uz: 'Kech kelgan xabarda Pro oxiri yoqildi. Bu urinish buzildimi?', ru: 'При опоздавшем сообщении Pro в итоге включился. Эта попытка сломалась?' }} variantlar={S5_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className={cx('pd-viz', 'pd-s5', tugadi && 'tugadi')}>
          {!tugadi && <QadamQator qadamlar={S5_CHIP} q={q} />}
          <div className="pd-s5-ust">
            <TolovSahna tel={telOn} be={tugadi ? { ...be, ixcham: true } : be} k={k} />
            <div className="pd-yp">
              {q === 0 && !tugadi
                ? <>
                  <div className="pd-yix-l">{[0, 2, 3].map(i => <YozuvIx key={i} {...qatorlar[i]} />)}</div>
                  <div className="pd-yk fade-step">
                    <span className="pd-yk-bosh"><i>2</i><b>{tr(usulNom('kech'))}</b><span className="pd-yk-belgi"><Belgi b={belgi2} /></span></span>
                    <span className="pd-yk-q"><em>{tr({ uz: 'Nima qildim', ru: 'Что сделал' })}</em><span>{tx(y2.qildim)}</span></span>
                    <span className="pd-yk-q"><em>{tr({ uz: 'Nima kutdim', ru: 'Что ожидал' })}</em><span>{chizilgan(tr(y2.kutdim), farqN('kutdim'), chiz)}</span></span>
                    <span className="pd-yk-q"><em>{tr({ uz: "Nima bo'ldi", ru: 'Что получилось' })}</em><span>{chizilgan(tr(y2.boldi), farqN('boldi'), chiz)}</span></span>
                    <button type="button" className={cx('pd-solishtir', halqa(!!taxmin && !band))} disabled={!taxmin || band} onClick={solishtir}>{tr({ uz: 'Solishtirish', ru: 'Сравнить' })}</button>
                  </div>
                </>
                : <div className="pd-yix-l">{qatorlar.map(r => <YozuvIx key={r.no} {...r} yangi={r.no === 2 && q === 1} />)}</div>}
              {!tugadi && chat > 0 && <AgentChat n={chat} />}
              {harakat}
              <NomQator matn={nom} />
            </div>
          </div>
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'ha'} haqiqat={{ uz: "ha, buzildi — kutilgani bo'lmadi", ru: 'да, сломалось — ожидаемого не было' }} />}
          matn={tr({ uz: "Bu misolda yashil belgi agentning javobidan keyin emas, o'sha tugma bilan qayta buzilmagandan keyin qo'yildi.", ru: 'В этом примере зелёную метку поставили не после ответа агента, а когда та же кнопка снова не сломала.' })}
          izoh={tr({ uz: "Qayta tekshiruvda yana buzilsa, belgi «qayta tekshiruvda yana buzildi» bo'ladi — yozuv agentga qayta beriladi.", ru: 'Если при повторной проверке снова сломается, метка будет «при повторной проверке снова сломалось» — запись отдаётся агенту снова.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 0, A) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Yozuvga «qayta tekshiruvda takrorlanmadi» ni qachon qo'yasiz?"
    question={tr({ uz: <h2 className="title h-ask">Yozuvga «qayta tekshiruvda takrorlanmadi» ni <span className="italic" style={{ color: T.accent }}>qachon qo'yasiz?</span></h2>, ru: <h2 className="title h-ask">Когда вы ставите в запись «при повторной проверке <span className="italic" style={{ color: T.accent }}>не повторилось</span>»?</h2> })}
    options={[
      { uz: "O'sha usul bilan qayta buzganda chiqmasa", ru: 'Если при повторе тем же способом не вышло' },
      { uz: "Agent «tuzatdim» deb javob yozib qo'yganda", ru: 'Когда агент ответил «исправил»' },
      { uz: "Kodda o'zgargan faylni ko'rib bo'lganingizda", ru: 'Когда посмотрели изменённый файл в коде' },
      { uz: 'Boshqa usul bilan qayta buzganda chiqmasa', ru: 'Если при повторе другим способом не вышло' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Natija o'sha usul bilan ko'rilgandagina yoziladi; agentning gapi — da'vo.", ru: 'Результат пишется, только когда проверили тем же способом; слова агента — заявление.' }}
    explainWrong={{
      1: { uz: "Agentning «tuzatdim» degani — da'vo, natija emas.", ru: '«Исправил» от агента — заявление, а не результат.' },
      2: { uz: "Fayl o'zgargani — «Tuzatish qilindi» belgisi.", ru: 'Изменение файла — это метка «Tuzatish qilindi».' },
      3: { uz: 'Muammo qaysi usulda chiqqan edi?', ru: 'Каким способом проявилась проблема?' },
      default: { uz: 'Muammo qaysi usulda chiqqan edi?', ru: 'Каким способом проявилась проблема?' }
    }} />
);

// ===== 🏅 BADGES (nishonlar) — 4 ta: ikki ballik savol (birinchi urinish) + Four Ways (2-amaliyot 4-qadam, to'rttala urinishda belgi) + Rechecked (bonus: 3-amaliyot 4-qadam, kamida bitta qayta tekshiruv) =====
const ACHIEVEMENTS = {
  proOnce: { icon: '🔂', name: 'Pro Once', desc: { uz: "Ikki marta kelgan xabar Pro'ni nega ikki marta uzaytirganini topdingiz", ru: 'Вы нашли, почему двойное сообщение дважды продлило Pro' } },
  sameButton: { icon: '🎯', name: 'Same Button', desc: { uz: "Qayta tekshiruv belgisi qachon qo'yilishini topdingiz", ru: 'Вы нашли, когда ставится метка повторной проверки' } },
  fourWays: { icon: '🔨', name: 'Four Ways', desc: { uz: "To'lovni to'rt usul bilan buzib, har urinishni yozdingiz", ru: 'Вы сломали оплату четырьмя способами и записали каждую попытку' } },
  rechecked: { icon: '✅', name: 'Rechecked', desc: { uz: "Tuzatishni o'sha usul bilan qayta tekshirdingiz", ru: 'Вы перепроверили исправление тем же способом' } }
};
// Ekran id → nishon: s4, s7 — ballik test (to'g'ri javob, birinchi urinish); a2, a3 — blok 4-qadam «Bajardim» (correct — shart bajarilganda, ScreenBlok extra)
const ACH_TRIGGERS = { s4: 'proOnce', s7: 'sameButton', a2: 'fourWays', a3: 'rechecked' };

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


// Podium savol yorliqlari (SCORED_IDX: 4, 7)
const Q_LABELS = {
  4: { uz: '1 — Pro ikki marta uzaydi', ru: '1 — Pro продлился дважды' },
  7: { uz: '2 — Qayta tekshiruv belgisi', ru: '2 — Метка повторной проверки' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — MD «Fon so'zlari» (R-008: o'quvchi so'zi {uz, ru}; kod so'zi o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: { uz: "to'lov xabari", ru: 'сообщение о платеже' }, l: 4, t: 8, s: 22, d: 19, dl: 0 },
  { ch: { uz: "mashq to'lov", ru: 'учебная оплата' }, l: 72, t: 6, s: 22, d: 23, dl: 1.5 },
  { ch: { uz: 'Ikki marta yuborish', ru: 'Отправить дважды' }, l: 6, t: 70, s: 20, d: 27, dl: 0.8 },
  { ch: { uz: 'Kechiktirib yuborish', ru: 'Отправить с задержкой' }, l: 64, t: 72, s: 20, d: 21, dl: 2.2 },
  { ch: { uz: "Noto'g'ri imzo", ru: 'Неверная подпись' }, l: 40, t: 88, s: 20, d: 25, dl: 1.1 },
  { ch: '401', l: 84, t: 30, s: 28, d: 17, dl: 0.4 },
  { ch: 'pro_gacha', l: 24, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'tolovlar', l: 50, t: 18, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'Javob kutilmoqda', ru: 'Ожидаем ответ' }, l: 12, t: 50, s: 20, d: 22, dl: 0.6 },
  { ch: { uz: 'buzish yozuvi', ru: 'запись поломки' }, l: 70, t: 50, s: 20, d: 24, dl: 1.3 },
  { ch: { uz: 'Tuzatish qilindi', ru: 'Исправление сделано' }, l: 30, t: 60, s: 20, d: 26, dl: 2.4 },
  { ch: 'BUZISH.md', l: 82, t: 86, s: 22, d: 19, dl: 0.2 },
  { ch: 'Maydon Jamoa', l: 46, t: 40, s: 20, d: 28, dl: 1.7 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob A·B·C·D ×3 (aylanma; MD ✔ o'rni)
const QUIZ_BANK = [
  { q: { uz: 'Agent «to\'lov ishlaydi» dedi. Bu nima?', ru: 'Агент сказал «оплата работает». Что это?' }, opts: [{ uz: 'Hali tekshirilmagan da\'vo', ru: 'Ещё не проверенное заявление' }, { uz: 'Kod yozilganining isboti', ru: 'Доказательство, что код написан' }, { uz: 'Pro yoqilganining dalili', ru: 'Подтверждение, что Pro включён' }, { uz: "To'rt usuldan o'tgan natija", ru: 'Результат, прошедший четыре способа' }], correct: 0 },
  { q: { uz: '«Kechiktirib yuborish» tugmasi nimaning mashqi?', ru: 'Упражнением чего служит кнопка «Kechiktirib yuborish»?' }, opts: [{ uz: 'Ikki marta kelgan xabarning', ru: 'Сообщения, пришедшего дважды' }, { uz: "Uxlab qolgan Backend'ning", ru: 'Уснувшего Backend' }, { uz: 'Soxta imzoli begona xabarning', ru: 'Чужого сообщения с поддельной подписью' }, { uz: "Rad etilgan to'lov xabarining", ru: 'Сообщения об отклонённом платеже' }], correct: 1 },
  { q: { uz: "To'lovni qayerda va nima bilan buzib tekshirasiz?", ru: 'Где и чем вы ломаете оплату для проверки?' }, opts: [{ uz: 'Sinfdoshingiz saytida, mashq tugmasi bilan', ru: 'На сайте одноклассника, учебной кнопкой' }, { uz: "Haqiqiy to'lov sahifasida, kartangiz bilan", ru: 'На настоящей странице оплаты, своей картой' }, { uz: "O'z mahsulotingizda, mashq tugmasi bilan", ru: 'В своём продукте, учебной кнопкой' }, { uz: "O'z mahsulotingizda, haqiqiy pul bilan", ru: 'В своём продукте, настоящими деньгами' }], correct: 2 },
  { q: { uz: "Imzosi noto'g'ri xabar keldi. Backend nima qilishi kerak?", ru: 'Пришло сообщение с неверной подписью. Что должен сделать Backend?' }, opts: [{ uz: "`200` qaytarib, to'lovni yozib qo'yadi", ru: 'Возвращает `200` и записывает платёж' }, { uz: "`200` qaytarib, faqat Pro'ni yoqadi", ru: 'Возвращает `200` и только включает Pro' }, { uz: "`401` qaytarib, lekin Pro'ni yoqadi", ru: 'Возвращает `401`, но включает Pro' }, { uz: '`401` qaytarib, hech narsa yozmaydi', ru: 'Возвращает `401` и ничего не пишет' }], correct: 3 },
  { q: { uz: "To'lov rad etildi. Pro nima bo'lishi kerak?", ru: 'Платёж отклонён. Что должно быть с Pro?' }, opts: [{ uz: "O'zgarmaydi, yoqilmaydi", ru: 'Не меняется, не включается' }, { uz: '30 kunga baribir yoqiladi', ru: 'Всё равно включается на 30 дней' }, { uz: 'Faqat bir kunga yoqiladi', ru: 'Включается только на один день' }, { uz: 'Yarim muddatga yoqiladi', ru: 'Включается на половину срока' }], correct: 0 },
  { q: { uz: 'Mentor misolida ikki marta kelgan xabar nimani buzdi?', ru: 'Что сломало двойное сообщение в примере Ментора?' }, opts: [{ uz: "`tolovlar` da ikki qator bo'ldi", ru: 'В `tolovlar` стало две строки' }, { uz: 'Pro muddati ikki marta uzaydi', ru: 'Срок Pro продлился дважды' }, { uz: "Imzo tekshiruvidan o'tmadi", ru: 'Не прошло проверку подписи' }, { uz: "Ilova Pro'ni ko'rsatmay qo'ydi", ru: 'Приложение перестало показывать Pro' }], correct: 1 },
  { q: { uz: 'Javob 10 soniyada kelmadi. Sahifa nima deyishi kerak?', ru: 'Ответ не пришёл за 10 секунд. Что должна сказать страница?' }, opts: [{ uz: "«To'lov o'tmadi» deyishi", ru: 'Сказать «Платёж не прошёл»' }, { uz: "«To'landi (mashq)» deyishi", ru: 'Сказать «Оплачено (учебно)»' }, { uz: '«Javob kutilmoqda» deyishi', ru: 'Сказать «Ожидаем ответ»' }, { uz: 'Hech narsa demasligi kerak', ru: 'Ничего не говорить' }], correct: 2 },
  { q: { uz: "Mentor talabida ilova Pro holatini qachon qayta so'raydi?", ru: 'Когда по требованию Ментора приложение снова запрашивает статус Pro?' }, opts: [{ uz: 'Faqat ilova birinchi ochilganda', ru: 'Только при первом открытии приложения' }, { uz: "Har soniyada, to'xtamasdan", ru: 'Каждую секунду, без остановки' }, { uz: "Faqat to'lov rad etilganda", ru: 'Только когда платёж отклонён' }, { uz: 'Qaytganda va tugma bosilganda', ru: 'При возврате и по нажатию кнопки' }], correct: 3 },
  { q: { uz: '«Nima kutdim» qatori qachon yoziladi?', ru: 'Когда пишется строка «Что ожидал»?' }, opts: [{ uz: 'Tugmani bosishdan oldin', ru: 'До нажатия кнопки' }, { uz: "Natija ko'ringandan keyin", ru: 'После того как виден результат' }, { uz: 'Agent tuzatgandan keyin', ru: 'После исправления агентом' }, { uz: 'Dars oxirida, birdaniga', ru: 'В конце урока, разом' }], correct: 0 },
  { q: { uz: '«Tuzatish qilindi» belgisi nimani aytadi?', ru: 'О чём говорит метка «Tuzatish qilindi»?' }, opts: [{ uz: 'Muammo endi takrorlanmasligini', ru: 'Что проблема больше не повторится' }, { uz: 'Kodda o\'zgartirish qilinganini', ru: 'Что в коде сделано изменение' }, { uz: "Agent yozuvni o'qib chiqqanini", ru: 'Что агент прочитал запись' }, { uz: 'Urinish umuman buzilmaganini', ru: 'Что попытка вообще не сломалась' }], correct: 1 },
  { q: { uz: "Pro muddati tugadi. E'lon qilingan o'yinlar nima bo'ladi?", ru: 'Срок Pro закончился. Что будет с объявленными играми?' }, opts: [{ uz: "O'chib ketadi, Pro bilan birga", ru: 'Удалятся вместе с Pro' }, { uz: 'Pro qaytguncha yashirinadi', ru: 'Скроются, пока Pro не вернётся' }, { uz: "Ro'yxatda qoladi, o'chmaydi", ru: 'Останутся в списке, не удалятся' }, { uz: "Keyingi haftaga o'zi ko'chadi", ru: 'Сами перенесутся на следующую неделю' }], correct: 2 },
  { q: { uz: "Kech urinishda Mentor Pro yoqilganini qayerdan ko'rdi?", ru: 'Где Ментор увидел, что Pro включился, в попытке с задержкой?' }, opts: [{ uz: 'Ilovada, ekran o\'zi yangilanib', ru: 'В приложении, экран обновился сам' }, { uz: "Sahifada, «To'landi» yozuvidan", ru: 'На странице, по надписи «Оплачено»' }, { uz: 'Agentning chatdagi javobidan', ru: 'По ответу агента в чате' }, { uz: "Neon'da, Pro muddati qatoridan", ru: 'В Neon, по строке срока Pro' }], correct: 3 }
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
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). Qolipda yo'q (qolip taklifi): {…} joyi maydoni va kulrang «masalan» (PdPrompt), qadam ichidagi «Yordam»,
// Neon so'rovlari kartasi, buzish yozuvi kartasi, «Tuzatish qilindi» / qayta tekshiruv tugmalari, «Ulgurmasangiz» qatori — shu faylda. Blok bajarilgani — faqat 4-qadam «Bajardim»idan
// (12-Modul 9.36 h); «Davom etish» — 3-qadamdan keyin (E 55), bayroq qo'yilmaydi. Qadam matni QBlok'da <p> ichida — faqat span (div/pre yo'q).
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
// Telefonda blok qadami (13-Modul sinf-supurish A): Stage eng pastga surmaydi — natija maketi ostida joriy band va tugash xulosasi ekrandan tepada qolardi.
// Joriy band boshi kontent tepasiga (16 px), tugash xulosasi markazga suriladi.
const telBlokSur = (tugadi) => {
  const bajarilgan = document.querySelectorAll('.q-blok-q.bajarildi');
  const el = tugadi ? document.querySelector('.q-blok-tugadi') || bajarilgan[bajarilgan.length - 1] : document.querySelector('.q-blok-q.joriy');
  const c = el && el.closest('.stage-content');
  if (!c) return;
  const cr = c.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const markaz = tugadi && r.height < cr.height - 32;
  const delta = markaz ? (r.top + r.bottom) / 2 - (cr.top + cr.bottom) / 2 : r.top - cr.top - 16;
  c.scrollTo({ top: c.scrollTop + delta, behavior: kamHarakat() ? 'auto' : 'smooth' });
};
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
const PLATFORMA_KALIT = 'pm-m9d8-platforma';
const trekOqi = () => { const o = lsOqi(PLATFORMA_KALIT); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
// Trek kaliti yo'q bo'lsa — blok boshida «Mobil trek» · «Web-trek» tugmalari, tanlov shu kalitga yoziladi (11-Modul 9.77; MD 3-ekran)
function useTrek() {
  const [trek, setTrek] = useState(trekOqi);
  const [sora] = useState(() => trekOqi() === null);
  const tanla = (t) => { const o = lsOqi(PLATFORMA_KALIT); lsYoz(PLATFORMA_KALIT, { ...(o && typeof o === 'object' ? o : {}), trek: t, savedAt: Date.now() }); setTrek(t); };
  return { web: trek === 'web', trek, sora, tanla };
}
const TrekTanlov = ({ tk }) => (tk.sora ? <span className="pd-trek-q">{['mobil', 'web'].map(t => (
  <button key={t} type="button" className={cx('pd-trek', tk.trek === t && 'on')} onClick={() => tk.tanla(t)}>{tr(t === 'mobil' ? { uz: 'Mobil trek', ru: 'Мобильный трек' } : { uz: 'Web-trek', ru: 'Веб-трек' })}</button>))}</span> : null);
// «{avvalgidek …}» tekshiruvi: kamida ikkita ish vergul bilan; «hammasi», «ilova» kabi bitta so'z emas (ikki tilli)
const BIR_SOZ = /^(hammasi|hamma|barchasi|barcha|ilova|loyiha|mahsulot|все|всё|приложение|проект|продукт)$/i;
const ikkiIsh = (s) => { const t = String(s || '').trim(); const b = t.split(/[,;]/).map(x => x.trim()).filter(x => x.length >= 2); return b.length >= 2 && !b.some(x => BIR_SOZ.test(x)); };
const IKKI_ISH_XATO = { uz: "Ikkita aniq ish yozing: masalan, kirish, e'lon berish.", ru: 'Напишите два конкретных дела: например, вход, объявление игры.' };
// 1-amaliyot qoralamasi — 3-amaliyot «{avvalgidek …}» joyiga oldindan qo'yiladi (dars ichidagi holat, kalitga yozilmaydi)
const QORALAMA = { avval: '' };
const nusxala = async (matn) => { try { await navigator.clipboard.writeText(matn); return true; } catch { return false; } };
const PdPrompt = ({ satrlar, joylar = [], qiymat = {}, onYoz, tekshir, oldindan = {} }) => {
  const [ok, setOk] = useState(false);
  const [xato, setXato] = useState(null);
  const almash = (s) => {
    let r = s;
    Object.entries(oldindan).forEach(([joy, v]) => { if (v) r = r.split(joy).join(v); });
    joylar.forEach(j => { const v = String(qiymat[j.id] || '').trim(); if (v) r = r.split(tr(j.joy)).join(v); });
    return r;
  };
  const matn = satrlar.map(l => almash(tr(l)));
  const joyli = (t, key) => t.split(/(\{[^}\s][^}]*\})/g).map((p, i) => (/^\{[^\s].*\}$/.test(p) ? <span key={key + '-' + i} className="q-joy">{p}</span> : <React.Fragment key={key + '-' + i}>{fmtCode(p)}</React.Fragment>));
  const bos = async () => {
    const x = tekshir ? tekshir(qiymat) : null;
    if (x) { setXato(x); return; }
    setXato(null);
    if (await nusxala(matn.join('\n'))) { setOk(true); setTimeout(() => setOk(false), 1600); }
  };
  return (
    <span className="q-prompt pd-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa pd-nusxa" onClick={bos}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="pd-ps">{l.split('\n').map((s, k) => <span key={k} className="pd-ps-q">{joyli(s, i + '-' + k)}</span>)}</span>)}
      {joylar.length > 0 && <span className="pd-joylar">{joylar.map(j => (
        <label key={j.id} className="pd-joy-m"><span className="pd-joy-n">{tr(j.joy)}</span>
          {j.kop ? <textarea rows={3} value={qiymat[j.id] || ''} placeholder={tr(j.namuna)} onChange={e => { setXato(null); onYoz(j.id, e.target.value); }} />
            : <input type="text" value={qiymat[j.id] || ''} maxLength={240} placeholder={tr(j.namuna)} onChange={e => { setXato(null); onYoz(j.id, e.target.value); }} />}</label>))}</span>}
      {xato && <span className="pd-xato" role="status">{tr(xato)}</span>}
    </span>
  );
};
const Yordam = ({ satrlar, sarlavha, ost }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <span className="pd-yordam-ust">
      <QTugma ikkinchi className="pd-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="pd-yordam fade-step">{sarlavha && <b>{tr(sarlavha)}</b>}{satrlar.map((l, i) => <span key={i} className="pd-yordam-s">{tx(l)}</span>)}{ost && <span className="pd-yordam-s pd-kulrang">{tx(ost)}</span>}</span>}
    </span>
  );
};
const Band = ({ children }) => <span className="pd-band">{children}</span>;
const Kulrang = ({ children }) => <span className="pd-kulrang">{children}</span>;
// Bitta SQL qatori «Nusxalash» bilan ({hisob raqami} — o'quvchi o'zi qo'yadi, kalitga yozilmaydi)
const SqlQator = ({ yorliq, sql }) => {
  const [ok, setOk] = useState(false);
  const bos = async () => { if (await nusxala(sql)) { setOk(true); setTimeout(() => setOk(false), 1500); } };
  return (
    <span className="pd-sql">{yorliq && <em>{tr(yorliq)}</em>}<code>{sql}</code><button type="button" className="pd-nusxa" onClick={bos}>{ok ? '✓' : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
  );
};
const WHERE_OGOH = { uz: '`WHERE` siz yubormang', ru: 'Не отправляйте без `WHERE`' };
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, izoh, ulgur, ulgurQadam = 99, qulf, ustoz, extra, avtoRef }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam;
  const qulfli = !done && !!qulf && qulf(stepN);
  const bajardim = () => {
    if (isMentorLive || done || qulfli) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, ...(extra ? extra() : {}) });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  if (avtoRef) avtoRef.current = { stepN, bajardim };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const birinchi = useRef(stepN); // oldingi qadam: StrictMode ikkinchi chaqiruvida ham ochilishda surilmaydi
  const tor = useIsMobile(768);
  useEffect(() => {
    if (birinchi.current === stepN) { return undefined; }
    birinchi.current = stepN;
    const t = setTimeout(() => { if (tor) { telBlokSur(done); return; } const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, tor ? 420 : 120); // telefonda — Mentor yig'ilish o'tishidan (0,38 s) keyin
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={tor ? 0 : stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cx('pd-blok', qulfli && 'qulf')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={steps.map(c => ({ h: tr(c.h), t: c.t, xato: c.xato }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={doneText ? tx(doneText) : null} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<>{done && izoh && <QIzoh>{tx(izoh)}</QIzoh>}<MentorPracticeStats live={_live} screen={screen} /></>}>
          {ortda && <p className="pd-ortda">{tx(ortda)}</p>}
          {ulgur && !done && <p className="pd-ulgur">{tx(ulgur)}</p>}
          {ustoz && isMentorLive && <div className="pd-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{ustoz.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>}
        </QBlok>
      </div>
    </Stage>
  );
}
// Kutilgan natija: telefon kadrlari bir marta o'zi yuradi + fayl kartasi
const useKadr = (soni, oraliq = 1500) => {
  const [kadr, setKadr] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma(Array.from({ length: soni - 1 }, (_, i) => [i === 0 ? 1100 : oraliq, () => setKadr(i + 1)])); }, []); // eslint-disable-line
  return kadr;
};
const FaylKarta = ({ fayllar }) => (
  <div className="pd-fayllar">{fayllar.map(([n, h]) => <span key={n} className="pd-fayl"><code>{n}</code><em>{tr(h)}</em></span>)}</div>
);
const OZGARDI = { uz: "o'zgardi", ru: 'изменён' };
const telYorliq = (web) => (web ? { uz: 'telefon · ….netlify.app', ru: 'телефон · ….netlify.app' } : { uz: 'telefon · Expo Go', ru: 'телефон · Expo Go' });

// --- 1-amaliyot: qolgan holatlar va ikki yangi tugma (tayyor talab + 3 joy)
const A1_PROMPT = [
  { uz: "Qayerda: `backend/` — to'lov natijasi va «Mashq to'lov» sahifasi; `mobil/` — to'lov taklifi ekrani va {pullik qulaylik} ishlatiladigan ekran.", ru: 'Где: `backend/` — результат оплаты и страница «Mashq to\'lov»; `mobil/` — экран предложения оплаты и экран, где используется {платная возможность}.' },
  { uz: "Nima qilsin: 1) To'lovdan ilovaga qaytganda ilova shu to'lovning natijasini Backend'dan so'rasin va ko'rsatsin: to'langan — {pullik qulaylik} yoqilgan (avvalgidek); rad etilgan — «To'lov o'tmadi — qayta urinib ko'ring» va to'lov tugmasi; natija hali yo'q — «Javob kutilmoqda».", ru: 'Что сделать: 1) При возврате из оплаты в приложение пусть приложение запросит у Backend результат этого платежа и покажет: оплачено — {платная возможность} включена (как раньше); отклонено — «To\'lov o\'tmadi — qayta urinib ko\'ring» и кнопка оплаты; результата ещё нет — «Javob kutilmoqda».' },
  { uz: "2) {pullik qulaylik} muddati tugaganda (Backend buni 4-darsdan biladi) ilova shunday ishlasin: {muddat tugaganda nima to'xtaydi va nima qoladi}. Pulni avtomatik yechadigan hech narsa qo'shma.", ru: '2) Когда срок {платная возможность} закончится (Backend знает это с 4-го урока), пусть приложение работает так: {что останавливается и что остаётся по окончании срока}. Ничего, что списывает деньги автоматически, не добавляй.' },
  { uz: "3) «Mashq to'lov» sahifasiga ikki tugma qo'sh: «Kechiktirib yuborish» — xabarni 70 soniya kutib yuboradi; «Noto'g'ri imzo» — xabarni `TOLOV_KALITI` bilan emas, boshqa kalit bilan imzolaydi. Ikkalasining javobi ham boshqa tugmalardek sahifada ko'rinsin.", ru: '3) Добавь на страницу «Mashq to\'lov» две кнопки: «Kechiktirib yuborish» — отправляет сообщение через 70 секунд; «Noto\'g\'ri imzo» — подписывает сообщение не `TOLOV_KALITI`, а другим ключом. Ответ обеих пусть виден на странице, как у других кнопок.' },
  { uz: "Nima buzilmasin: to'lov taklifi ekrani, to'lov tugmasi, sahifadagi eski tugmalar, `POST /tolov/webhook` dagi tekshiruvlar va {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: экран предложения оплаты, кнопка оплаты, старые кнопки страницы, проверки в `POST /tolov/webhook` и {что должно работать как раньше} работают как раньше. Значение `TOLOV_KALITI` никуда не пиши. `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_JOYLAR = [
  { id: 'pullik', joy: { uz: '{pullik qulaylik}', ru: '{платная возможность}' }, namuna: { uz: "masalan: Pro («Doimiy o'yin»)", ru: 'например: Pro («Doimiy o\'yin»)' } },
  { id: 'muddat', joy: { uz: "{muddat tugaganda nima to'xtaydi va nima qoladi}", ru: '{что останавливается и что остаётся по окончании срока}' }, namuna: { uz: "masalan: «Har hafta takrorlansin» yana to'lov taklifi ekranini ochsin, yangi o'yin o'zi e'lon qilinmasin; e'lon qilingan o'yinlar qolsin", ru: 'например: «Har hafta takrorlansin» снова открывает экран предложения оплаты, новая игра сама не объявляется; объявленные игры остаются' }, kop: true },
  { id: 'avval', joy: { uz: "{avvalgidek ishlashi kerak bo'lgan ishlar}", ru: '{что должно работать как раньше}' }, namuna: { uz: "masalan: kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar", ru: 'например: вход, объявление игры, присоединение, реальное время и напоминания' } }
];
const A1_YORDAM = [
  { uz: "Qayerda: `backend/` — `GET /men` va «Mashq to'lov» sahifasi; `mobil/` — to'lov taklifi ekrani va «E'lon berish».", ru: 'Где: `backend/` — `GET /men` и страница «Mashq to\'lov»; `mobil/` — экран предложения оплаты и «E\'lon berish».' },
  { uz: "Nima qilsin: 1) `GET /men` javobiga oxirgi to'lov holatini qo'sh: shu foydalanuvchining eng oxirgi `boshlangan_tolovlar` yozuvi `tolovlar` da `tolandi` yoki `rad` bo'lsa — shu holat, `tolovlar` da hali yo'q bo'lsa — `kutilmoqda`. To'lovdan ilovaga qaytganda ilova `GET /men` ni so'rasin va ko'rsatsin: `tolandi` — Pro (avvalgidek); `rad` — «To'lov o'tmadi — qayta urinib ko'ring» va «To'lovga o'tish» tugmasi; `kutilmoqda` — «Javob kutilmoqda».", ru: 'Что сделать: 1) Добавь в ответ `GET /men` статус последнего платежа: если последняя запись `boshlangan_tolovlar` этого пользователя в `tolovlar` — `tolandi` или `rad`, то этот статус; если в `tolovlar` её ещё нет — `kutilmoqda`. При возврате из оплаты приложение запрашивает `GET /men` и показывает: `tolandi` — Pro (как раньше); `rad` — «To\'lov o\'tmadi — qayta urinib ko\'ring» и кнопку «To\'lovga o\'tish»; `kutilmoqda` — «Javob kutilmoqda».' },
  { uz: "2) Pro muddati tugaganda (`GET /men` da `pro` 4-darsdan yolg'on bo'ladi): «Har hafta takrorlansin» yana to'lov taklifi ekranini ochsin, yangi o'yin o'zi e'lon qilinmasin; e'lon qilingan o'yinlar qolsin. Pulni avtomatik yechadigan hech narsa qo'shma.", ru: '2) Когда срок Pro закончится (в `GET /men` `pro` с 4-го урока станет ложным): «Har hafta takrorlansin» снова открывает экран предложения оплаты, новая игра сама не объявляется; объявленные игры остаются. Ничего, что списывает деньги автоматически, не добавляй.' },
  A1_PROMPT[3],
  { uz: "Nima buzilmasin: to'lov taklifi ekrani, «To'lovga o'tish», sahifadagi to'rtta eski tugma va `POST /tolov/webhook` dagi tekshiruvlar; kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar avvalgidek ishlasin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: экран предложения оплаты, «To\'lovga o\'tish», четыре старые кнопки страницы и проверки в `POST /tolov/webhook`; вход, объявление игры, присоединение, реальное время и напоминания работают как раньше. Значение `TOLOV_KALITI` никуда не пиши. `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_WEB = { uz: "Web-trekda: «Qayerda» — `prototip/` — to'lov taklifi ko'rinadigan sahifa; «To'lovdan ilovaga qaytganda» → «To'lov oynasidan saytga qaytganda»; Backend qismi ikkala trekda bir xil.", ru: 'В веб-треке: «Где» — `prototip/` — страница, где видно предложение оплаты; «При возврате из оплаты в приложение» → «При возврате из окна оплаты на сайт»; часть Backend в обоих треках одинакова.' };
// Web-trekda talab satrlari (MD: trek kalitidan o'zi almashadi)
const webSatr = (l, web) => (!web ? l : {
  uz: l.uz.replace("`mobil/` — to'lov taklifi ekrani va {pullik qulaylik} ishlatiladigan ekran", "`prototip/` — to'lov taklifi ko'rinadigan sahifa").replace("`mobil/` — to'lov taklifi ekrani va «E'lon berish»", "`prototip/` — to'lov taklifi ko'rinadigan sahifa").replace("To'lovdan ilovaga qaytganda", "To'lov oynasidan saytga qaytganda"),
  ru: l.ru.replace('`mobil/` — экран предложения оплаты и экран, где используется {платная возможность}', '`prototip/` — страница, где видно предложение оплаты').replace("`mobil/` — экран предложения оплаты и «E'lon berish»", '`prototip/` — страница, где видно предложение оплаты').replace('При возврате из оплаты в приложение', 'При возврате из окна оплаты на сайт')
});
const A1_KOD_PROMPT = [{ uz: "Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: ilova to'lov natijasini so'raydigan qator, pullik qulaylik muddati tekshiriladigan qator va «Kechiktirib yuborish» xabarni kutadigan joy. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в написанном коде три места с именем файла и номером строки: строку, где приложение запрашивает результат оплаты, строку проверки срока платной возможности и место, где «Kechiktirib yuborish» ждёт перед отправкой. Объясни одной фразой, что делает каждое. Код не меняй.' }];
const A1Natija = ({ web }) => {
  const kadr = useKadr(4, 1500);
  const tel = kadr === 0 ? { ekran: 'ilova', ilova: 'kutilmoqda' } : kadr === 1 ? { ekran: 'ilova', ilova: 'otmadi' } : kadr === 2 ? { ekran: 'ilova', ilova: 'taklif' } : { ekran: 'brauzer', yangi: true };
  return (
    <div className="pd-an">
      <Telefon t={{ ...tel, yorliq: telYorliq(web), osti: kadr === 2 ? <span className="pd-tel-iz fade-step">{tr({ uz: 'Pro muddati tugagan', ru: 'Срок Pro закончился' })}</span> : null }} />
      <FaylKarta fayllar={[['backend/src/tolov/…', OZGARDI], ['backend/src/men/…', OZGARDI], [web ? 'prototip/…' : 'mobil/src/…', { uz: "to'lov taklifi ekrani · o'zgardi", ru: 'экран предложения оплаты · изменён' }]]} />
    </div>
  );
};
const ScreenA1 = (props) => {
  const tk = useTrek();
  const [q, setQ] = useState({});
  const yoz = (k, v) => { setQ(o => ({ ...o, [k]: v })); if (k === 'avval') QORALAMA.avval = v; };
  const narx = lsOqi('pm-m11d4-narx');
  const ishlaydi = !!(narx && narx.ishlaydi === true);
  const w = tk.web;
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z repo'ngiz", ru: 'Практика 1 · ваш репозиторий' }}
      title={{ uz: <>Mahsulotingizda to'lovning <span className="italic" style={{ color: T.accent }}>qolgan holatlari</span> ko'rinsin.</>, ru: <>Пусть в продукте будут видны <span className="italic" style={{ color: T.accent }}>остальные состояния</span> оплаты.</> }}
      mentor={{ uz: "Talab tayyor — uch joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.", ru: 'Требование готово — три места заполните под свой продукт; начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <><TrekTanlov tk={tk} />{tx(w
          ? { uz: "Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin. Saytingiz brauzerda ochiq tursin.", ru: 'Откройте свой репозиторий в Antigravity. В терминале `git status`: файлов `.env` в списке быть не должно. Сайт пусть будет открыт в браузере.' }
          : { uz: "Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin. Mobil trekda `cd mobil`, `npx expo start` ishlab tursin va ilova telefoningizda ochiq bo'lsin.", ru: 'Откройте свой репозиторий в Antigravity. В терминале `git status`: файлов `.env` в списке быть не должно. В мобильном треке `cd mobil`, `npx expo start` пусть работает, приложение открыто на телефоне.' })}
          <Band>{tr({ uz: "4-darsdagi to'lov yo'li ishlab tursin: to'lov taklifi ekrani → to'lov tugmasi → «Mashq to'lov» sahifasi → pullik qulaylik yoqiladi.", ru: 'Путь оплаты из 4-го урока пусть работает: экран предложения оплаты → кнопка оплаты → страница «Mashq to\'lov» → платная возможность включается.' })}</Band>
          {!ishlaydi && <Band><b>{tr({ uz: "4-darsda to'lov yo'li tekshirilmagan ko'rinadi — avval o'shani tugating, keyin shu qadamga qayting.", ru: 'Похоже, путь оплаты в 4-м уроке не проверен — сначала закончите его, потом вернитесь к этому шагу.' })}</b></Band>}
          <Band>{tr({ uz: "Pullik qulaylik — 4-darsda to'lov taklifi ekraniga qo'yganingiz (Mentor misolida — Pro, «Doimiy o'yin»). Neon SQL Editor'da o'z hisob raqamingizni toping (3-darsdagidek):", ru: 'Платная возможность — то, что вы поставили на экран предложения оплаты в 4-м уроке (в примере Ментора — Pro, «Doimiy o\'yin»). В Neon SQL Editor найдите номер своего аккаунта (как в 3-м уроке):' })}</Band>
          <SqlQator sql={NEON_SOROVLAR.topish} />
          <Kulrang>{tx({ uz: "Jadval va ustun nomi mahsulotingizdagidek. Topa olmasangiz — agentga: «Foydalanuvchilar jadvalida {loginim} hisobining `id` sini va pullik qulaylik muddati qaysi ustunda turishini ayt. Hech narsani o'zgartirma.»", ru: 'Имена таблицы и столбца — как в вашем продукте. Не нашли — агенту: «Найди в таблице пользователей `id` аккаунта {мой логин} и в каком столбце хранится срок платной возможности. Ничего не меняй.»' })}</Kulrang></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' })}
          <PdPrompt satrlar={A1_PROMPT.map(l => webSatr(l, w))} joylar={A1_JOYLAR} qiymat={q} onYoz={yoz} tekshir={(v) => (ikkiIsh(v.avval) ? null : IKKI_ISH_XATO)} />
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq talab", ru: 'Полное требование из примера Ментора' }} satrlar={A1_YORDAM.map(l => webSatr(l, w))} ost={A1_WEB} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"tolov holatlari\"`, `git push`.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают со списком агента, `.env` в списке нет; каждый файл добавьте `git add <файл>`, `git commit -m "tolov holatlari"`, `git push`.' })}
          <Band>{tr({ uz: "Render Backend'ning yangi versiyasini chiqaradi — tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Kutayotganda agentdan uch joyni ko'rsatishni so'rang:", ru: 'Render выпустит новую версию Backend — дождитесь окончания (может занять несколько минут). Пока ждёте, попросите агента показать три места:' })}</Band>
          <PdPrompt satrlar={A1_KOD_PROMPT} />
          <Band>{tx(w ? { uz: "Web-trekda `git push` dan keyin Netlify saytni odatda o'zi yangilaydi.", ru: 'В веб-треке после `git push` Netlify обычно сам обновляет сайт.' } : { uz: "Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`).", ru: 'В мобильном треке Expo Go обычно сам перезагружает приложение (если нет — `r` в терминале).' })}</Band></>,
          xato: tx({ uz: "Xato chiqsa — faqat xato qatorini agentga yuboring (`.env` dagi kalit va tokenlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка — отправьте агенту только строку ошибки (не ключи и токены из `.env`): «Вышла такая ошибка: {ошибка}. Исправь.»' }) },
        { h: { uz: 'Telefonda tekshirish', ru: 'Проверить на телефоне' }, t: <>{tr({ uz: "talabning har gapini o'zingiz ko'ring (web-trekda — saytingizda, telefon brauzerida yoki kompyuterda). Mentor misolida:", ru: 'проверьте сами каждую фразу требования (в веб-треке — на сайте, в браузере телефона или на компьютере). В примере Ментора:' })}
          <Band><b>{tr({ uz: '(1) «Javob kutilmoqda»', ru: '(1) «Javob kutilmoqda»' })}</b>{tr({ uz: " — «To'lovga o'tish» → mashq sahifasi ochilgach hech narsa bosmang, ilovaga qayting: «Javob kutilmoqda» bo'lishi kerak. Bu — ilova; mashq sahifasi kech javobda nima deyishini 2-amaliyotda «Kechiktirib yuborish» bilan ko'rasiz.", ru: ' — «To\'lovga o\'tish» → когда откроется учебная страница, ничего не нажимайте, вернитесь в приложение: должно быть «Javob kutilmoqda». Это приложение; что скажет учебная страница при позднем ответе, увидите в практике 2 кнопкой «Kechiktirib yuborish».' })}</Band>
          <Band><b>{tr({ uz: "(2) «To'lov o'tmadi»", ru: "(2) «To'lov o'tmadi»" })}</b>{tr({ uz: " — brauzerdagi o'sha sahifaga qayting, «Rad etish (mashq)» ni bosing va ilovaga qayting: «To'lov o'tmadi — qayta urinib ko'ring» va to'lov tugmasi bo'lishi kerak.", ru: ' — вернитесь на ту же страницу в браузере, нажмите «Rad etish (mashq)» и вернитесь в приложение: должно быть «To\'lov o\'tmadi — qayta urinib ko\'ring» и кнопка оплаты.' })}</Band>
          <Band><b>{tr({ uz: '(3) Muddat tugashi', ru: '(3) Окончание срока' })}</b>{tr({ uz: " — «To'lovga o'tish» → «To'lash (mashq)» → ilovada Pro yoqilganini ko'ring. Keyin Neon SQL Editor'da Pro muddatini kechaga qo'ying:", ru: ' — «To\'lovga o\'tish» → «To\'lash (mashq)» → убедитесь, что в приложении включился Pro. Потом в Neon SQL Editor поставьте срок Pro на вчера:' })}</Band>
          <SqlQator sql={NEON_SOROVLAR.kecha} />
          <Band><b>{tx(WHERE_OGOH)}{tr({ uz: ': u hamma hisobni o\'zgartiradi.', ru: ': он изменит все аккаунты.' })}</b>{tr({ uz: " Ilovani yopib oching: Pro yo'q — «Har hafta takrorlansin» yana to'lov taklifi ekranini ochadi; e'lon qilingan o'yinlar ro'yxatda qoladi.", ru: ' Закройте и откройте приложение: Pro нет — «Har hafta takrorlansin» снова открывает экран предложения оплаты; объявленные игры остаются в списке.' })}</Band>
          <Kulrang>{tr({ uz: "Yangi o'yin o'zi e'lon qilinmasligi darsda ko'rinmaydi — buning uchun o'yin vaqti o'tishi kerak. Agentning «bajardim» degani — da'vo; bu qismni bugun tekshirmaysiz.", ru: 'То, что новая игра сама не объявится, на уроке не видно — для этого должно пройти время игры. «Сделал» от агента — заявление; эту часть сегодня не проверяете.' })}</Kulrang>
          <Band><b>{tr({ uz: '(4) Ikki yangi tugma', ru: '(4) Две новые кнопки' })}</b>{tr({ uz: " — mashq sahifasida oltita tugma: «To'lash (mashq)» · «Rad etish (mashq)» · «Ikki marta yuborish» · «Imzosiz yuborish» · «Kechiktirib yuborish» · «Noto'g'ri imzo». Yangi ikkitasini hozir bosmang — ular 2-amaliyotda.", ru: ' — на учебной странице шесть кнопок: «To\'lash (mashq)» · «Rad etish (mashq)» · «Ikki marta yuborish» · «Imzosiz yuborish» · «Kechiktirib yuborish» · «Noto\'g\'ri imzo». Новые две сейчас не нажимайте — они в практике 2.' })}</Band>
          <Band>{tr({ uz: "Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Несовпавшее напишите агенту: «{что} не как в требовании: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»' })}</Band></> }
      ]}
      natija={<A1Natija web={w} />}
      ortda={{ uz: "Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-05-start` (4-darsdagi to'lov yo'li) yoki `git checkout -f m13-dars-05-done` (bugungi tayyor holat) — oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz (`TOLOV_KALITI` ham).", ru: 'Отстали? Откройте пример Ментора вне своего репозитория, в новой папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-05-start` (путь оплаты из 4-го урока) или `git checkout -f m13-dars-05-done` (готовое состояние на сегодня) — последнюю команду запускайте только в этой новой папке: она удаляет изменения в папке. В `backend/.env` и `mobil/.env` впишите свои значения (и `TOLOV_KALITI`).' }}
      ulgur={{ uz: "Ulgurmasangiz: Render kutishi cho'zilsa — 3-qadamdan keyin «Davom etish» ochiladi: 2-amaliyotni «Ikki marta yuborish» va «Rad etish (mashq)» dan boshlang (bu tugmalar 3-darsdan bor), keyin shu yerga qaytib 4-qadamni bajarasiz — blok shundan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: затянулось ожидание Render — после шага 3 откроется «Продолжить»: начните практику 2 с «Ikki marta yuborish» и «Rad etish (mashq)» (эти кнопки есть с 3-го урока), потом вернитесь сюда и выполните шаг 4 — только тогда блок засчитается.' }}
      ulgurQadam={3}
      doneText={{ uz: "Uch holat ko'rindi, ikki tugma sahifada — endi to'lovni ular bilan buzasiz.", ru: 'Три состояния видны, две кнопки на странице — теперь будете ломать ими оплату.' }}
      ustoz={[
        { uz: "Pro muddati tugaganda yangi o'yin o'zi e'lon qilinmasligi — bir haftalik holat, darsda ko'rinmaydi (o'quvchiga «bugun tekshirmaysiz» deb aytilgan); va'da berilmaydi.", ru: 'То, что после окончания Pro новая игра сама не объявится, — недельная ситуация, на уроке не видна (ученику сказано «сегодня не проверяете»); не обещаем.' },
        { uz: "`UPDATE` ni o'quvchi `WHERE` siz yubormasligiga qarang — bitta qatorga tegishi kerak (Neon «1 row affected» ko'rsatadi; ko'rsatmasa — qayta ko'ring).", ru: 'Следите, чтобы ученик не отправил `UPDATE` без `WHERE` — он должен затронуть одну строку (Neon покажет «1 row affected»; если нет — проверьте снова).' }
      ]} />
  );
};

// --- 2-amaliyot: to'rt usul bilan buzish va yozuv (kod yozilmaydi). Saqlanadi: pm-m11d5-buzish (tayanch 8 aynan)
const BUZISH_KALIT = 'pm-m11d5-buzish';
const urBosh = (usul, qildim = '') => ({ usul, qildim, kutdim: '', boldi: '', buzildi: null, tuzatishQilindi: false, qayta: null });
const buzOqi = () => {
  const o = lsOqi(BUZISH_KALIT);
  const ur = o && Array.isArray(o.urinishlar) && o.urinishlar.length === 4 ? o.urinishlar : null;
  return ur ? ur.map((u, i) => ({ ...urBosh(USULLAR[i].usul), ...(u && typeof u === 'object' ? u : {}), usul: USULLAR[i].usul })) : null;
};
const buzYoz = (ur) => lsYoz(BUZISH_KALIT, { urinishlar: ur.map(u => ({ usul: u.usul, qildim: u.qildim, kutdim: u.kutdim, boldi: u.boldi, buzildi: u.buzildi, tuzatishQilindi: !!u.tuzatishQilindi, qayta: u.qayta ?? null })), savedAt: Date.now() });
const tolovTugma = () => { const o = lsOqi('pm-m11d4-narx'); const t = o && o.ekran && typeof o.ekran.tugma === 'string' ? o.ekran.tugma.trim() : ''; return t ? { uz: t, ru: t } : { uz: "To'lov tugmasi", ru: 'Кнопка оплаты' }; };
const nuqta = (s) => { const t = String(s || '').trim(); return !t ? '—' : /[.!?…»]$/.test(t) ? t : t + '.'; };
const YZ = { qildim: { uz: 'Nima qildim', ru: 'Что сделал' }, kutdim: { uz: 'Nima kutdim', ru: 'Что ожидал' }, boldi: { uz: "Nima bo'ldi", ru: 'Что получилось' }, belgi: { uz: 'Belgi', ru: 'Метка' } };
const urMatn = (u, i, { belgi = false, keyin = false } = {}) => {
  let s = `${i + 1} · ${tr(usulNom(u.usul))}. ${tr(YZ.qildim)}: ${nuqta(u.qildim)} ${tr(YZ.kutdim)}: ${nuqta(u.kutdim)} ${tr(YZ.boldi)}: ${nuqta(u.boldi)}`;
  if (belgi && u.buzildi !== null) s += ` ${tr(YZ.belgi)}: ${tr(BELGI[u.buzildi ? 'buzildi' : 'buzilmadi'])}.`;
  if (keyin && u.buzildi === true) s += u.tuzatishQilindi ? ` ${tr(BELGI.tuz)}. ${u.qayta ? tr(BELGI[u.qayta]) : tr({ uz: "qayta tekshiruv — hali yo'q", ru: 'повторная проверка — ещё нет' })}.` : '';
  return s;
};
const SHART_KUTDIM = { uz: "Avval «Nima kutdim» ni yozing, keyin tugmani bosing.", ru: 'Сначала напишите «Что ожидал», потом нажмите кнопку.' };
const SHART_BOLDI = { uz: "«Nima bo'ldi» bo'sh — ko'rganingizni yozing.", ru: '«Что получилось» пусто — напишите, что увидели.' };
// Buzish yozuvi: to'rt karta, bittadan (E 53); tepada ixcham chiziq 1–4 (bosib tanlanadi); yorliq maydon ichida (E 43)
// Buzish yozuvi maydoni: balandlik matnga moslashadi (ichki skroll yo'q) — oldindan to'ldirilgan 3–4 qatorli matn ham to'liq ko'rinadi
const AvtoMatn = (p) => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const moslash = () => { el.style.height = 'auto'; el.style.height = el.scrollHeight + 2 + 'px'; };
    moslash();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (ref.current) moslash(); });
    window.addEventListener('resize', moslash);
    return () => window.removeEventListener('resize', moslash);
  }, [p.value]);
  return <textarea ref={ref} rows={2} {...p} />;
};
const BuzishYozuvi = ({ ur, onUr, web, onToliq }) => {
  const tg = tolovTugma();
  const [joriy, setJoriy] = useState(() => { const i = ur.findIndex(u => u.buzildi === null); return i < 0 ? 0 : i; });
  const [shart, setShart] = useState(null);
  const u = ur[joriy];
  const yangila = (p, saqla = true) => {
    const yangi = ur.map((x, i) => (i === joriy ? { ...x, ...p } : x));
    onUr(yangi);
    if (saqla) buzYoz(yangi);
    return yangi;
  };
  const belgila = (b) => {
    if (!String(u.kutdim).trim()) { setShart(SHART_KUTDIM); return; }
    if (!String(u.boldi).trim()) { setShart(SHART_BOLDI); return; }
    setShart(null);
    const yangi = yangila({ buzildi: b });
    const keyingi = yangi.findIndex(x => x.buzildi === null);
    if (keyingi >= 0) setJoriy(keyingi);
    else if (onToliq) onToliq();
  };
  const talab = USULLAR[joriy].talab(web);
  const kutdimBosh = !String(u.kutdim).trim();
  return (
    <span className="pd-bz">
      <span className="pd-bz-chiziq">{ur.map((x, i) => (
        <button key={x.usul} type="button" className={cx('pd-yz-chip', i === joriy && 'on', x.buzildi === true && 'err', x.buzildi === false && 'ok')} onClick={() => { setShart(null); setJoriy(i); }}>
          <i>{x.buzildi === null ? i + 1 : '✓'}</i>{tr(usulNom(x.usul))}{x.buzildi !== null && <em>{tr(BELGI[x.buzildi ? 'buzildi' : 'buzilmadi'])}</em>}
        </button>))}</span>
      <span className="pd-bz-karta fade-step" key={u.usul}>
        <span className="pd-bz-bosh"><i>{joriy + 1}</i><b>{tr(usulNom(u.usul))}</b><span className="pd-bz-yol">{tr(USULLAR[joriy].yol)}</span></span>
        <label className="pd-bz-m"><span className="pd-bz-n">{tr({ uz: '1 · Nima qildim?', ru: '1 · Что сделал?' })}</span>
          <AvtoMatn value={u.qildim} onChange={e => yangila({ qildim: e.target.value }, false)} onBlur={() => buzYoz(ur)} /></label>
        <span className="pd-bz-talab">{tr({ uz: "Talab bo'yicha", ru: 'По требованию' })}: {tx(talab)}</span>
        <label className="pd-bz-m"><span className="pd-bz-n">{tr({ uz: '2 · Nima kutdim?', ru: '2 · Что ожидал?' })}</span>
          <AvtoMatn value={u.kutdim} placeholder={tr({ uz: "talabdagidek: ekranda va Neon'da nima ko'rinishi kerak?", ru: 'по требованию: что должно быть видно на экране и в Neon?' })} onChange={e => { setShart(null); yangila({ kutdim: e.target.value }, false); }} onBlur={() => buzYoz(ur)} /></label>
        <label className={cx('pd-bz-m', kutdimBosh && 'qulf')} onClick={() => { if (kutdimBosh) setShart(SHART_KUTDIM); }}><span className="pd-bz-n">{tr({ uz: "3 · Nima bo'ldi?", ru: '3 · Что получилось?' })}</span>
          <AvtoMatn value={u.boldi} disabled={kutdimBosh} placeholder={tr({ uz: "ko'rganingiz", ru: 'что увидели' })} onChange={e => { setShart(null); yangila({ boldi: e.target.value }, false); }} onBlur={() => buzYoz(ur)} /></label>
        <span className="pd-bz-btn">
          <button type="button" className={cx('pd-belgi', 'err', u.buzildi === true && 'on')} disabled={kutdimBosh} onClick={() => belgila(true)}>{tr({ uz: 'Buzildi', ru: 'Сломалось' })}</button>
          <button type="button" className={cx('pd-belgi', 'ok', u.buzildi === false && 'on')} disabled={kutdimBosh} onClick={() => belgila(false)}>{tr({ uz: 'Buzilmadi', ru: 'Не сломалось' })}</button>
          <Yordam sarlavha={{ uz: 'Mentor misolidagi yozuv', ru: 'Запись из примера Ментора' }} satrlar={[
            { uz: `${YZ.qildim.uz}: ${MENTOR_YOZUV[joriy].qildim.uz}`, ru: `${YZ.qildim.ru}: ${MENTOR_YOZUV[joriy].qildim.ru}` },
            { uz: `${YZ.kutdim.uz}: ${MENTOR_YOZUV[joriy].kutdim.uz}`, ru: `${YZ.kutdim.ru}: ${MENTOR_YOZUV[joriy].kutdim.ru}` },
            { uz: `${YZ.boldi.uz}: ${MENTOR_YOZUV[joriy].boldi.uz}`, ru: `${YZ.boldi.ru}: ${MENTOR_YOZUV[joriy].boldi.ru}` },
            { uz: `${YZ.belgi.uz}: ${BELGI[MENTOR_YOZUV[joriy].belgi].uz}`, ru: `${YZ.belgi.ru}: ${BELGI[MENTOR_YOZUV[joriy].belgi].ru}` }]} />
        </span>
        {shart && <span className="pd-xato" role="status">{tr(shart)}</span>}
      </span>
    </span>
  );
};
const A2_PROMPT = [
  { uz: "`BUZISH.md` ga «To'lov» bo'limini qo'sh: pastdagi yozuvimni so'zma-so'z ko'chir — har urinishning uch qatori va belgisi. Faylning boshqa bo'limlariga va boshqa fayllarga tegma. Fayl yo'q bo'lsa — repo ildizida yarat.", ru: 'Добавь в `BUZISH.md` раздел «To\'lov»: перенеси мою запись ниже дословно — три строки и метку каждой попытки. Другие разделы файла и другие файлы не трогай. Если файла нет — создай в корне репозитория.' },
  { uz: "{to'liq yozuv}", ru: '{полная запись}' }
];
const A2Natija = () => (
  <div className="pd-an">
    <div className="pd-mk">{MENTOR_YOZUV.map((y, i) => (
      <span key={y.usul} className="pd-mk-k"><span className="pd-mk-b"><i>{i + 1}</i><b>{tr(usulNom(y.usul))}</b><Belgi b={y.belgi} /></span>
        <span className="pd-mk-q"><em>{tr(YZ.qildim)}</em>{tx(y.qildim)}</span><span className="pd-mk-q"><em>{tr(YZ.kutdim)}</em>{tx(y.kutdim)}</span><span className="pd-mk-q"><em>{tr(YZ.boldi)}</em>{tx(y.boldi)}</span></span>))}</div>
    <FaylKarta fayllar={[['BUZISH.md', { uz: "«To'lov» · yangi bo'lim", ru: '«To\'lov» · новый раздел' }]]} />
    <div className="pd-term"><span className="buyruq">$ git status</span><span>modified: BUZISH.md</span></div>
  </div>
);
const ScreenA2 = (props) => {
  const tk = useTrek();
  const w = tk.web;
  const [ur, setUr] = useState(() => buzOqi() || USULLAR.map(x => urBosh(x.usul, tr(x.qildim(tolovTugma(), w)))));
  const avto = useRef(null);
  const birorBelgi = ur.some(u => u.buzildi !== null);
  const toliq = ur.every(u => u.buzildi !== null);
  const buzildiBor = ur.some(u => u.buzildi === true);
  const onToliq = () => setTimeout(() => { const a = avto.current; if (a && a.stepN === 1) a.bajardim(); }, 700);
  const yozuv = birorBelgi ? ur.map((u, i) => (u.buzildi !== null ? urMatn(u, i, { belgi: true }) : null)).filter(Boolean).join('\n') : '';
  return (
    <ScreenBlok {...props} avtoRef={avto} eyebrow={{ uz: "Amaliyot 2 · o'z mahsulotingiz", ru: 'Практика 2 · ваш продукт' }}
      title={{ uz: <>Mahsulotingizda to'lovni <span className="italic" style={{ color: T.accent }}>to'rt usul bilan</span> buzing.</>, ru: <>Сломайте оплату в продукте <span className="italic" style={{ color: T.accent }}>четырьмя способами</span>.</> }}
      mentor={{ uz: "Kod yozilmaydi: tugmani siz bosasiz, nima bo'lganini siz yozasiz; «1 · Ochish»dan boshlang.", ru: 'Код не пишем: кнопку нажимаете вы, что получилось — пишете вы; начните с «1 · Открыть».' }}
      qulf={(n) => n === 1 && !birorBelgi}
      extra={() => ({ correct: ur.every(u => u.buzildi !== null) })}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tx({ uz: "ilovangiz telefonda ochiq (web-trekda — saytingiz brauzerda), Neon SQL Editor ochiq. Terminalda `git status`: o'zgargan fayl yo'q — bu blokda kod o'zgarmaydi; `.env` ro'yxatda yo'q.", ru: 'приложение открыто на телефоне (в веб-треке — сайт в браузере), Neon SQL Editor открыт. В терминале `git status`: изменённых файлов нет — в этом блоке код не меняется; `.env` в списке нет.' })}
          <Band><b>{tr({ uz: "Buzish faqat o'z mahsulotingizda, «Mashq to'lov» tugmalari bilan: boshqa odamning sayti, Backend'i yoki to'lov xizmati tekshirilmaydi.", ru: 'Ломаем только свой продукт кнопками «Mashq to\'lov»: чужой сайт, Backend или платёжный сервис не проверяем.' })}</b></Band>
          <Band>{tx({ uz: "Neon so'rovlari (jadval va ustun nomi — mahsulotingizdagidek; `{hisob raqami}` — 1-amaliyotda topganingiz):", ru: 'Запросы Neon (имена таблицы и столбца — как в вашем продукте; `{hisob raqami}` — номер, найденный в практике 1):' })}</Band>
          <span className="pd-sqllar">
            <SqlQator yorliq={{ uz: "Pullik qulaylikni boshlang'ich holatga qaytarish", ru: 'Вернуть платную возможность в начальное состояние' }} sql={NEON_SOROVLAR.qaytar} />
            <span className="pd-sql-ogoh">{tx(WHERE_OGOH)}.</span>
            <SqlQator yorliq={{ uz: 'Muddat', ru: 'Срок' }} sql={NEON_SOROVLAR.muddat} />
            <SqlQator yorliq={{ uz: "Oxirgi to'lovlar", ru: 'Последние платежи' }} sql={NEON_SOROVLAR.oxirgi} />
          </span>
          <Band>{tr({ uz: "Har urinish oldidan ilovada pullik qulaylik yo'q bo'lsin: bo'lsa — birinchi so'rovni yuboring va ilovani yopib oching (to'lov tugmasi faqat shunda ko'rinadi).", ru: 'Перед каждой попыткой платной возможности в приложении быть не должно: если есть — отправьте первый запрос и закройте-откройте приложение (кнопка оплаты видна только тогда).' })}</Band></> },
        { h: { uz: 'Buzish', ru: 'Сломать' }, t: <>{tr({ uz: "to'rt urinish, bittadan.", ru: 'четыре попытки, по одной.' })}
          <Band><b>{tr({ uz: "«Nima kutdim» ni tugmani bosishdan oldin yozing", ru: '«Что ожидал» пишите до нажатия кнопки' })}</b>{tr({ uz: " — keyin natija bilan solishtirsa bo'ladi; u bo'sh bo'lsa, «Nima bo'ldi» ochilmaydi. ", ru: ' — тогда можно сравнить с результатом; если пусто, «Что получилось» не откроется. ' })}<b>{tr({ uz: '«Buzildi»', ru: '«Сломалось»' })}</b>{tr({ uz: " — ko'rganingiz «Talab bo'yicha» qatoridan farq qilsa; mos kelsa — ", ru: ' — если увиденное отличается от строки «По требованию»; если совпало — ' })}<b>{tr({ uz: '«Buzilmadi»', ru: '«Не сломалось»' })}</b>.</Band>
          <BuzishYozuvi ur={ur} onUr={setUr} web={w} onToliq={onToliq} />
          <Kulrang>{tx({ uz: "«Nima bo'ldi» — ekranda ko'rganingiz, taxmin emas. Xato chiqsa — faqat xato qatorini agentga yuboring (`.env` dagi kalit va tokenlarni emas): «Shu xato chiqdi: {xato}. Nima bo'lganini ayt. Kodni o'zgartirma.»", ru: '«Что получилось» — то, что вы увидели на экране, а не догадка. Если ошибка — отправьте агенту только строку ошибки (не ключи и токены из `.env`): «Вышла такая ошибка: {ошибка}. Скажи, что случилось. Код не меняй.»' })}</Kulrang></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "yozuvingiz pastdagi promptga o'zi qo'yilgan; o'qib chiqing, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'ваша запись уже подставлена в промпт ниже; прочтите, нажмите «Скопировать» и отправьте в Antigravity:' })}
          <PdPrompt satrlar={A2_PROMPT} oldindan={{ [tr(A2_PROMPT[1])]: yozuv }} />
          <Yordam sarlavha={{ uz: 'Mentor misolidagi yozuv', ru: 'Запись из примера Ментора' }} satrlar={MENTOR_YOZUV.map((y, i) => ({ uz: `${i + 1} · ${usulNom(y.usul).uz}. Nima qildim: ${y.qildim.uz} Nima kutdim: ${y.kutdim.uz} Nima bo'ldi: ${y.boldi.uz} Belgi: ${BELGI[y.belgi].uz}.`, ru: `${i + 1} · ${usulNom(y.usul).ru}. Что сделал: ${y.qildim.ru} Что ожидал: ${y.kutdim.ru} Что получилось: ${y.boldi.ru} Метка: ${BELGI[y.belgi].ru}.` }))} /></> },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tx({ uz: "`BUZISH.md` dagi «To'lov» bo'limini yozuvingiz bilan solishtiring: so'zlar bir xilmi, urinish tushib qolmaganmi. Farq bo'lsa — agentga: «Faqat `BUZISH.md` dagi «To'lov» bo'limini yozuvimdagidek qil.»", ru: 'Сравните раздел «To\'lov» в `BUZISH.md` со своей записью: слова те же, ни одна попытка не пропала? Если есть разница — агенту: «Сделай только раздел «To\'lov» в `BUZISH.md` как в моей записи.»' })}
          <Band>{tx({ uz: "`git status` — faqat `BUZISH.md` o'zgargan bo'lishi kerak; boshqa fayl ko'rinsa, uni `git add` qilmang va agentdan nega o'zgarganini so'rang. Keyin `git add BUZISH.md` → `git commit -m \"tolovni buzish\"` → `git push`.", ru: '`git status` — изменён должен быть только `BUZISH.md`; если виден другой файл, не делайте ему `git add` и спросите агента, почему он изменился. Потом `git add BUZISH.md` → `git commit -m "tolovni buzish"` → `git push`.' })}</Band></> }
      ]}
      natija={<A2Natija />}
      ulgur={{ uz: "Ulgurmasangiz: vaqt tugayaptimi — yozilgan urinishlar bilan 3-qadamga o'ting («Davom etish» 3-qadamdan keyin ochiladi); qolgan urinish kartasi bo'sh qoladi va yakun sarlavhasi buni aytadi. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: время кончается — переходите к шагу 3 с записанными попытками («Продолжить» откроется после шага 3); остальные карточки останутся пустыми, и заголовок итога это скажет. Блок засчитается после «Готово» на шаге 4.' }}
      ulgurQadam={3}
      doneText={buzildiBor && toliq ? { uz: "To'rt urinish yozildi: «buzildi» chiqqanlarini 3-amaliyotda tuzatasiz.", ru: 'Четыре попытки записаны: то, что «сломалось», исправите в практике 3.' } : toliq ? { uz: "To'rt urinish yozildi: to'lov yo'lingiz buzilmadi — bu ham natija.", ru: 'Четыре попытки записаны: путь оплаты не сломался — это тоже результат.' } : null}
      ustoz={[
        { uz: "«Kechiktirib yuborish» da o'quvchi ilovadan chiqib qaytsa, ilova natijani qayta so'raydi va 2-muammo ko'rinmasligi mumkin — shuning uchun «undan chiqmay bir daqiqa kuting». Mentor misolida natijani shu yo'l bilan olgan.", ru: 'Если в «Kechiktirib yuborish» ученик выйдет из приложения и вернётся, приложение снова запросит результат и 2-я проблема может не проявиться — поэтому «ждите минуту, не выходя». В примере Ментора результат получен так.' },
        { uz: "Bitta urinish bir nechta muammoni ko'rsatishi mumkin (kech: sahifa ham, ilova ham); muammo soni urinish soniga teng bo'lishi shart emas. «Buzilmadi» chiqqan o'quvchiga «ataylab buzing» deyilmaydi.", ru: 'Одна попытка может показать несколько проблем (поздняя: и страница, и приложение); число проблем не обязано равняться числу попыток. Ученику с «не сломалось» не говорим «сломайте нарочно».' },
        { uz: "«Nima kutdim» talabdan uzoq bo'lsa (masalan, «Pro 60 kun bo'ladi» deb yozsa) — «Talab bo'yicha» qatorini ko'rsating; hukm talab bo'yicha.", ru: 'Если «Что ожидал» далеко от требования (например, «Pro будет 60 дней») — покажите строку «По требованию»; решение — по требованию.' }
      ]} />
  );
};

// --- 3-amaliyot: tuzatish va o'sha usul bilan qayta tekshirish (tayyor talab + 2 joy)
const A3_PROMPT = [
  { uz: 'Qayerda: buzish yozuvidagi muammoga tegishli fayllar — avval sababini top, keyin faqat kerakli joyni o\'zgartir.', ru: 'Где: файлы, относящиеся к проблеме из записи поломки, — сначала найди причину, потом меняй только нужное место.' },
  { uz: "Nima qilsin: pastdagi yozuvda «buzildi» belgili har urinishni tuzat: mahsulot «Nima kutdim» qatoridagidek ishlasin. Har muammoning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.", ru: 'Что сделать: исправь каждую попытку с меткой «сломалось» в записи ниже: продукт должен работать, как в строке «Что ожидал». Причину каждой проблемы скажи одной фразой и назови, какой файл изменил.' },
  { uz: '{buzish yozuvi}', ru: '{запись поломки}' },
  { uz: "Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; `POST /tolov/webhook` dagi imzo va takror tekshiruvi, «Mashq to'lov» sahifasidagi oltita tugma qolsin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: {что должно работать как раньше} работает как раньше; проверка подписи и повтора в `POST /tolov/webhook`, шесть кнопок страницы «Mashq to\'lov» остаются. Значение `TOLOV_KALITI` никуда не пиши. `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' }
];
const A3_JOY = [{ id: 'avval', joy: { uz: "{avvalgidek ishlashi kerak bo'lgan ishlar}", ru: '{что должно работать как раньше}' }, namuna: { uz: "masalan: kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar", ru: 'например: вход, объявление игры, присоединение, реальное время и напоминания' } }];
const A3_YORDAM = [
  { uz: "Qayerda: `backend/` — `POST /tolov/webhook` va «Mashq to'lov» sahifasi; `mobil/` — to'lov natijasi ko'rinadigan joy.", ru: 'Где: `backend/` — `POST /tolov/webhook` и страница «Mashq to\'lov»; `mobil/` — место, где виден результат оплаты.' },
  { uz: "Nima qilsin: pastdagi yozuvda «buzildi» belgili ikki urinishni tuzat: ilova «Nima kutdim» qatoridagidek ishlasin. Pro faqat yangi yozilgan to'lovdan keyin uzaysin — yozuv va Pro bitta tranzaksiyada. Javob hali kelmagan bo'lsa, sahifa «To'lov o'tmadi» emas, «Javob kutilmoqda» desin; ilovada «Javob kutilmoqda» ostida «Qayta tekshirish» tugmasi bo'lsin — ilova qaytganda va shu tugma bosilganda `GET /men` ni qayta so'rasin. Har muammoning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.", ru: 'Что сделать: исправь две попытки с меткой «сломалось» в записи ниже: приложение должно работать, как в строке «Что ожидал». Pro продлевается только после новой записанной оплаты — запись и Pro в одной транзакции. Если ответа ещё нет, страница пишет не «To\'lov o\'tmadi», а «Javob kutilmoqda»; в приложении под «Javob kutilmoqda» кнопка «Qayta tekshirish» — при возврате и по этой кнопке приложение снова запрашивает `GET /men`. Причину каждой проблемы скажи одной фразой и назови, какой файл изменил.' },
  { uz: `1 · Ikki marta yuborish. Nima qildim: ${MENTOR_YOZUV[0].qildim.uz} Nima kutdim: ${MENTOR_YOZUV[0].kutdim.uz} Nima bo'ldi: ${MENTOR_YOZUV[0].boldi.uz}`, ru: `1 · Ikki marta yuborish. Что сделал: ${MENTOR_YOZUV[0].qildim.ru} Что ожидал: ${MENTOR_YOZUV[0].kutdim.ru} Что получилось: ${MENTOR_YOZUV[0].boldi.ru}` },
  { uz: `2 · Kechiktirib yuborish. Nima qildim: ${MENTOR_YOZUV[1].qildim.uz} Nima kutdim: ${MENTOR_YOZUV[1].kutdim.uz} Nima bo'ldi: ${MENTOR_YOZUV[1].boldi.uz}`, ru: `2 · Kechiktirib yuborish. Что сделал: ${MENTOR_YOZUV[1].qildim.ru} Что ожидал: ${MENTOR_YOZUV[1].kutdim.ru} Что получилось: ${MENTOR_YOZUV[1].boldi.ru}` },
  { uz: "Nima buzilmasin: kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar avvalgidek ishlasin; `POST /tolov/webhook` dagi imzo va takror tekshiruvi, «Mashq to'lov» sahifasidagi oltita tugma qolsin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход, объявление игры, присоединение, реальное время и напоминания работают как раньше; проверка подписи и повтора в `POST /tolov/webhook`, шесть кнопок страницы «Mashq to\'lov» остаются. Значение `TOLOV_KALITI` никуда не пиши. `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' }
];
const A3_WEB = { uz: "Web-trekda: `mobil/` o'rnida `prototip/`; «ilova qaytganda» → «sayt oynasiga qaytganda».", ru: 'В веб-треке: вместо `mobil/` — `prototip/`; «при возврате в приложение» → «при возврате в окно сайта».' };
const A3_KOD_PROMPT = [{ uz: "O'zgarishingda har muammo uchun o'zgargan qatorni fayl nomi va qator raqami bilan ko'rsat va nega aynan shu joy ekanini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'В своём изменении для каждой проблемы покажи изменённую строку с именем файла и номером строки и одной фразой объясни, почему именно это место. Код не меняй.' }];
const A3_TOLIQ = [{ uz: "`BUZISH.md` dagi «To'lov» bo'limiga har urinishning tuzatish va qayta tekshiruv natijasini qo'sh" + " — yozuvimdan so'zma-so'z. Boshqa joyga tegma. {to'liq yozuv}", ru: 'Добавь в раздел «To\'lov» в `BUZISH.md` результат исправления и повторной проверки каждой попытки — дословно из моей записи. Больше ничего не трогай. {полная запись}' }];
const A3Natija = ({ web }) => {
  const kadr = useKadr(3, 1400);
  const tel = kadr === 0 ? { ekran: 'brauzer', javob: 'kutilmoqda' } : kadr === 1 ? { ekran: 'ilova', ilova: 'kutilmoqda', qtekshir: true } : { ekran: 'ilova', ilova: 'elon', elonYoq: true };
  return (
    <div className="pd-an">
      <div className="pd-yix-l">{MENTOR_YOZUV.map((y, i) => <YozuvIx key={y.usul} no={i + 1} usul={y.usul} belgi={y.belgi} tuz={y.belgi === 'buzildi'} qayta={y.keyin} />)}</div>
      <div className="pd-an-ost">
        <Telefon t={{ ...tel, yorliq: telYorliq(web) }} />
        <FaylKarta fayllar={[['backend/src/tolov/…', OZGARDI], [web ? 'prototip/…' : 'mobil/src/…', { uz: "to'lov natijasi · o'zgardi", ru: 'результат оплаты · изменён' }], ['BUZISH.md', OZGARDI]]} />
      </div>
    </div>
  );
};
const ScreenA3 = (props) => {
  const tk = useTrek();
  const w = tk.web;
  const [ur, setUr] = useState(() => buzOqi() || USULLAR.map(x => urBosh(x.usul)));
  const [q, setQ] = useState(() => ({ avval: QORALAMA.avval }));
  const buzildi = ur.map((u, i) => ({ u, i })).filter(x => x.u.buzildi === true);
  const bor = buzildi.length > 0;
  const hammaButun = ur.every(u => u.buzildi === false); // F-1007: to'rttala urinish belgilangan va hech biri buzilmagan
  const yangila = (i, p) => setUr(o => { const y = o.map((x, k) => (k === i ? { ...x, ...p } : x)); buzYoz(y); return y; });
  const buzMatn = buzildi.map(x => urMatn(x.u, x.i)).join('\n');
  const toliqMatn = ur.map((u, i) => (u.buzildi !== null ? urMatn(u, i, { belgi: true, keyin: true }) : null)).filter(Boolean).join('\n');
  const tuzlar = buzildi.filter(x => x.u.tuzatishQilindi);
  const hammaTakrorlanmadi = tuzlar.length > 0 && tuzlar.every(x => x.u.qayta === 'takrorlanmadi');
  const yanaBor = buzildi.some(x => x.u.qayta === 'takrorlandi');
  const otkaz = { uz: "Hech biri «buzildi» bo'lmasa — 2 va 3-qadamni o'tkazib yuboring.", ru: 'Если «сломалось» нет ни у одной — пропустите шаги 2 и 3.' };
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 3 · o'z repo'ngiz", ru: 'Практика 3 · ваш репозиторий' }}
      title={{ uz: <>Topilganini tuzating va <span className="italic" style={{ color: T.accent }}>o'sha usul bilan</span> qayta buzing.</>, ru: <>Исправьте найденное и сломайте снова <span className="italic" style={{ color: T.accent }}>тем же способом</span>.</> }}
      mentor={{ uz: "Yozuvni agent oladi va kodni o'zgartiradi, to'g'riligini esa siz o'sha tugma bilan ko'rasiz; «1 · Ochish»dan boshlang.", ru: 'Запись получает агент и меняет код, а правильность вы проверяете той же кнопкой; начните с «1 · Открыть».' }}
      extra={() => ({ correct: ur.some(u => u.qayta !== null) })}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <><TrekTanlov tk={tk} />{tx(w
          ? { uz: "2-amaliyotdagi yozuvingizning «buzildi» belgili urinishlari pastdagi talabga o'zi qo'yilgan — o'qib chiqing. Saytingiz brauzerda ochiq tursin.", ru: 'Попытки с меткой «сломалось» из записи практики 2 уже подставлены в требование ниже — прочтите. Сайт пусть будет открыт в браузере.' }
          : { uz: "2-amaliyotdagi yozuvingizning «buzildi» belgili urinishlari pastdagi talabga o'zi qo'yilgan — o'qib chiqing. Ilovangiz telefonda ochiq tursin (mobil trekda `npx expo start` ishlab tursin).", ru: 'Попытки с меткой «сломалось» из записи практики 2 уже подставлены в требование ниже — прочтите. Приложение пусть будет открыто на телефоне (в мобильном треке `npx expo start` пусть работает).' })}
          <Band>{tx({ uz: "Hech biri «buzildi» bo'lmasa — 2 va 3-qadamni o'tkazib yuboring: 4-qadamda yozuvingiz `BUZISH.md` da turganini ko'rasiz, boshqa ish yo'q.", ru: 'Если «сломалось» нет ни у одной — пропустите шаги 2 и 3: на шаге 4 увидите, что запись лежит в `BUZISH.md`, больше делать нечего.' })}</Band></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: bor ? <>{tr({ uz: "qavslarni tekshiring (tahrirlasangiz bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'проверьте скобки (можно править), нажмите «Скопировать» и отправьте в Antigravity:' })}
          <PdPrompt satrlar={A3_PROMPT} joylar={A3_JOY} qiymat={q} onYoz={(k, v) => setQ(o => ({ ...o, [k]: v }))} oldindan={{ [tr(A3_PROMPT[2])]: buzMatn }} tekshir={(v) => (ikkiIsh(v.avval) ? null : IKKI_ISH_XATO)} />
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq talab", ru: 'Полное требование из примера Ментора' }} satrlar={A3_YORDAM.map(l => (w ? { uz: l.uz.replace('`mobil/`', '`prototip/`').replace('ilova qaytganda', 'sayt oynasiga qaytganda'), ru: l.ru.replace('`mobil/`', '`prototip/`').replace('при возврате', 'при возврате в окно сайта') } : l))} ost={A3_WEB} /></>
          : <Kulrang>{tr(otkaz)}</Kulrang> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: bor ? <>{tx({ uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; `git add <fayl>` → `git commit -m \"tolov tuzatish\"` → `git push`. Agent `backend/` ni o'zgartirgan bo'lsa — Render'da yangi versiya tugashini kuting.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают со списком агента, `.env` в списке нет; `git add <файл>` → `git commit -m "tolov tuzatish"` → `git push`. Если агент менял `backend/` — дождитесь новой версии в Render.' })}
          <Band>{tr({ uz: 'Kutayotganda agentga:', ru: 'Пока ждёте — агенту:' })}</Band>
          <PdPrompt satrlar={A3_KOD_PROMPT} />
          <Band>{tx({ uz: "Agent har muammo uchun qaysi faylni o'zgartirganini aytgan va u `git status` da ko'ringan bo'lsa — o'sha urinishga ", ru: 'Если агент назвал, какой файл изменил для каждой проблемы, и он виден в `git status`, — отметьте у этой попытки ' })}<b>{tr({ uz: '«Tuzatish qilindi»', ru: '«Tuzatish qilindi»' })}</b>{tr({ uz: " ni belgilang: bu ish fakti — kodda o'zgartirish qilindi; to'g'riligini 4-qadam ko'rsatadi.", ru: ' (исправление сделано): это факт работы — в коде сделано изменение; правильность покажет шаг 4.' })}</Band>
          <span className="pd-tk">{buzildi.map(({ u, i }) => (
            <span key={u.usul} className="pd-tk-q"><YozuvIx no={i + 1} usul={u.usul} belgi="buzildi" />
              <button type="button" className={cx('pd-tuz', u.tuzatishQilindi && 'on')} aria-pressed={!!u.tuzatishQilindi} onClick={() => yangila(i, { tuzatishQilindi: !u.tuzatishQilindi })}>{u.tuzatishQilindi ? '✓ ' : ''}{tr(BELGI.tuz)}</button></span>))}</span>
          <Band>{tx(w ? { uz: "Web-trekda Netlify saytni odatda o'zi yangilaydi.", ru: 'В веб-треке Netlify обычно сам обновляет сайт.' } : { uz: "Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`).", ru: 'В мобильном треке Expo Go обычно сам перезагружает приложение (если нет — `r` в терминале).' })}</Band></>
          : <Kulrang>{tr(otkaz)}</Kulrang>,
          xato: bor ? tx({ uz: "Xato chiqsa — faqat xato qatorini agentga yuboring (`.env` dagi kalit va tokenlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка — отправьте агенту только строку ошибки (не ключи и токены из `.env`): «Вышла такая ошибка: {ошибка}. Исправь.»' }) : null },
        { h: { uz: 'Qayta tekshirish va GitHub', ru: 'Перепроверка и GitHub' }, t: bor ? <>{tr({ uz: "«buzildi» belgili har urinishni ", ru: 'каждую попытку с меткой «сломалось» повторите ' })}<b>{tr({ uz: "o'sha usul bilan", ru: 'тем же способом' })}</b>{tr({ uz: " qaytaring (urinish oldidan pullik qulaylik yo'q bo'lsin — 2-amaliyotdagi birinchi so'rov). Tanlang:", ru: ' (перед попыткой платной возможности быть не должно — первый запрос из практики 2). Выберите:' })}
          <span className="pd-tk">{buzildi.map(({ u, i }) => (
            <span key={u.usul} className="pd-tk-q"><YozuvIx no={i + 1} usul={u.usul} belgi="buzildi" tuz={u.tuzatishQilindi} />
              <button type="button" className={cx('pd-qt', 'ok', u.qayta === 'takrorlanmadi' && 'on')} onClick={() => yangila(i, { qayta: 'takrorlanmadi' })}>{tr({ uz: 'Qayta tekshiruvda takrorlanmadi', ru: 'При повторной проверке не повторилось' })}</button>
              <button type="button" className={cx('pd-qt', 'err', u.qayta === 'takrorlandi' && 'on')} onClick={() => yangila(i, { qayta: 'takrorlandi' })}>{tr({ uz: 'Qayta tekshiruvda yana buzildi', ru: 'При повторной проверке снова сломалось' })}</button></span>))}</span>
          <Band>{tr({ uz: "Yana buzilsa — agentga: «{usul} qayta tekshiruvda yana buzildi: {nima bo'ldi}. Tuzat, o'zgargan fayllarni ayt.» va o'sha usulni yana bir marta qaytaring; yana buzilsa — yozuvda shunday qoladi.", ru: 'Если снова сломалось — агенту: «{способ} при повторной проверке снова сломался: {что получилось}. Исправь, назови изменённые файлы.» и повторите тот же способ ещё раз; если снова — так и остаётся в записи.' })}</Band>
          <Band>{tr({ uz: 'Keyin agentga:', ru: 'Потом агенту:' })}</Band>
          <PdPrompt satrlar={A3_TOLIQ} oldindan={{ [tr({ uz: "{to'liq yozuv}", ru: '{полная запись}' })]: toliqMatn ? '\n' + toliqMatn : '' }} />
          <Band>{tx({ uz: "`BUZISH.md` ni yozuvingiz bilan solishtiring; mos bo'lsa — `git status` → `git add BUZISH.md` va tuzatilgan fayllar (`git add .` emas) → `git commit -m \"tolov qayta tekshiruvi\"` → `git push`.", ru: 'Сравните `BUZISH.md` со своей записью; если совпадает — `git status` → `git add BUZISH.md` и исправленные файлы (не `git add .`) → `git commit -m "tolov qayta tekshiruvi"` → `git push`.' })}</Band></>
          : <>{tx({ uz: "yozuvingiz `BUZISH.md` da turganini ko'ring — boshqa ish yo'q.", ru: 'убедитесь, что запись лежит в `BUZISH.md`, — больше делать нечего.' })}</> }
      ]}
      natija={<A3Natija web={w} />}
      ulgur={{ uz: "Ulgurmasangiz: Render kutishi cho'zilsa — «Davom etish» 3-qadamdan keyin ochiladi; qayta tekshirilmagan urinish qatorida `BUZISH.md` da «qayta tekshiruv — hali yo'q» turadi va yakun sarlavhasi «qayta tekshirish qoldi» deydi.", ru: 'Если не успеваете: затянулось ожидание Render — «Продолжить» откроется после шага 3; у непроверенной попытки в `BUZISH.md` будет «повторная проверка — ещё нет», и заголовок итога скажет «осталась перепроверка».' }}
      ulgurQadam={3}
      doneText={hammaButun ? { uz: "Tuzatish kerak bo'lmadi: to'rt usul mahsulotingizni buzmadi.", ru: 'Исправлять не понадобилось: четыре способа не сломали ваш продукт.' }
        : yanaBor ? { uz: "Tuzatish qilindi, bitta urinish yana buzildi — bu ham `BUZISH.md` da.", ru: 'Исправление сделано, одна попытка снова сломалась — это тоже в `BUZISH.md`.' }
          : hammaTakrorlanmadi ? { uz: "Tuzatish qilindi va qayta tekshiruvda takrorlanmadi: natija `BUZISH.md` da.", ru: 'Исправление сделано, при повторной проверке не повторилось: результат в `BUZISH.md`.' } : null}
      ustoz={[
        { uz: "«bitta tranzaksiyada» — 11-Modul 14-darsidagi Database tranzaksiyasi (o'quvchi so'rasa: «yozuv va Pro birga yoziladi — biri o'tmasa, ikkalasi ham yozilmaydi»). Bu so'z 2-darsdagi model nomi bilan aralashmasin — o'quvchiga izohlamang, agar so'ramasa.", ru: '«в одной транзакции» — транзакция Database из 14-го урока 11-го модуля (если ученик спросит: «запись и Pro пишутся вместе — если одно не прошло, не пишется ни то, ни другое»). Не путать с названием модели из 2-го урока — не объясняйте, если не спросят.' }
      ]} />
  );
};

// 🃏 KARTOCHKALAR (12) — alohida ekran, Mentor yo'q (SABOQ 12, 16); qolip: QKartochka
const KARTALAR = [
  { front: { uz: "Agentning «to'lov ishlaydi» degani nima?", ru: 'Что значат слова агента «оплата работает»?' }, back: { uz: "Da'vo — hali tekshirilmagan gap", ru: 'Заявление — ещё не проверенные слова' }, note: { uz: "Natijani o'zingiz buzib ko'rib bilasiz", ru: 'Результат узнаёте, ломая сами' } },
  { front: { uz: "Bu darsdagi to'rt buzish usuli qaysilar?", ru: 'Какие четыре способа поломки на этом уроке?' }, back: { uz: 'Ikki marta yuborish, kechiktirib yuborish, rad etish, noto\'g\'ri imzo', ru: 'Отправить дважды, с задержкой, отклонить, неверная подпись' }, note: { uz: "Faqat o'z mahsulotingizda, mashq to'lov tugmalari bilan", ru: 'Только в своём продукте, кнопками учебной оплаты' } },
  { front: { uz: '«Kechiktirib yuborish» nima qiladi?', ru: 'Что делает «Kechiktirib yuborish»?' }, back: { uz: 'Xabarni 70 soniya kutib yuboradi', ru: 'Отправляет сообщение через 70 секунд' }, note: { uz: "Mashq, uxlashning nusxasi emas: haqiqiy bepul Backend 15 daqiqa so'rovsiz qolsa uxlaydi", ru: 'Упражнение, а не копия сна: настоящий бесплатный Backend засыпает после 15 минут без запросов' } },
  { front: { uz: "«Noto'g'ri imzo» bilan kelgan xabarga Backend nima qaytaradi?", ru: 'Что Backend возвращает на сообщение с «неверной подписью»?' }, back: { uz: '`401` — hech narsa yozilmaydi', ru: '`401` — ничего не записывается' }, note: { uz: '3-darsdagi imzo tekshiruvi shu holatni ushlaydi', ru: 'Этот случай ловит проверка подписи из 3-го урока' } },
  { front: { uz: 'Mentor misolida ikki marta kelgan xabar nimani buzdi?', ru: 'Что сломало двойное сообщение в примере Ментора?' }, back: { uz: "Pro muddatini: u 60 kun bo'ldi", ru: 'Срок Pro: он стал 60 дней' }, note: { uz: '`tolovlar` da qator bitta edi — takror tekshiruvi ishlagan', ru: 'В `tolovlar` была одна строка — проверка повтора сработала' } },
  { front: { uz: "Bitta to'lov Pro'ni necha marta uzaytirishi kerak?", ru: 'Сколько раз один платёж должен продлевать Pro?' }, back: { uz: "Bir marta — faqat yangi yozilgan to'lovdan keyin", ru: 'Один раз — только после новой записанной оплаты' }, note: { uz: "Takror xabarga ham `200` qaytadi, lekin ikkinchi Pro yo'q", ru: 'На повтор тоже возвращается `200`, но второго Pro нет' } },
  { front: { uz: 'Javob hali kelmagan bo\'lsa, mashq sahifasi nima deyishi kerak?', ru: 'Что должна сказать учебная страница, если ответа ещё нет?' }, back: { uz: '«Javob kutilmoqda»', ru: '«Ожидаем ответ»' }, note: { uz: "«To'lov o'tmadi» — faqat holat «rad» bo'lganda", ru: '«Платёж не прошёл» — только при статусе «rad»' } },
  { front: { uz: "Mentor misolida tuzatishdan keyin ilova Pro holatini qachon qayta so'raydi?", ru: 'Когда после исправления приложение Ментора снова запрашивает статус Pro?' }, back: { uz: 'Ilovaga qaytganda va «Qayta tekshirish» bosilganda', ru: 'При возврате в приложение и по нажатию «Проверить снова»' }, note: { uz: "So'rov — `GET /men`", ru: 'Запрос — `GET /men`' } },
  { front: { uz: "Rad etilgan to'lovdan keyin Mentor ilovasi nima ko'rsatadi?", ru: 'Что показывает приложение Ментора после отклонённого платежа?' }, back: { uz: "«To'lov o'tmadi — qayta urinib ko'ring»", ru: '«Платёж не прошёл — попробуйте ещё раз»' }, note: { uz: "`tolovlar` da «rad» qatori bor, Pro o'zgarmaydi", ru: 'В `tolovlar` есть строка «rad», Pro не меняется' } },
  { front: { uz: "Mentor talabida Pro muddati tugasa nima bo'ladi?", ru: 'Что будет по требованию Ментора, когда срок Pro закончится?' }, back: { uz: "Pro o'zi o'chadi, pul avtomatik yechilmaydi", ru: 'Pro выключается сам, деньги автоматически не списываются' }, note: { uz: "E'lon qilingan o'yinlar qoladi", ru: 'Объявленные игры остаются' } },
  { front: { uz: '«Nima kutdim» qatori qachon yoziladi?', ru: 'Когда пишется строка «Что ожидал»?' }, back: { uz: 'Tugmani bosishdan oldin', ru: 'До нажатия кнопки' }, note: { uz: "Shunda natija bilan solishtirsa bo'ladi", ru: 'Тогда можно сравнить с результатом' } },
  { front: { uz: '«Tuzatish qilindi» va «qayta tekshiruvda takrorlanmadi» qanday farq qiladi?', ru: 'Чем отличаются «Tuzatish qilindi» и «при повторной проверке не повторилось»?' }, back: { uz: "Birinchisi — kod o'zgargani, ikkinchisi — o'sha usul bilan qayta buzilmagani", ru: 'Первое — код изменился, второе — тем же способом снова не сломалось' }, note: { uz: 'Ikkalasi alohida belgi, alohida qadam', ru: 'Это две отдельные метки и два отдельных шага' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('pd-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="pd-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204, texnik darslar standarti; E 50 — «Bugungi asosiy fikr» yo'q). Uyga vazifa yo'q (loyiha kuni). Sarlavha — yetti holat, har biri rost (E 54) =====
// PM-109 (SABOQ P4): erta tugatgan o'quvchi yo'li — AI tekshiruvchi rolida buzish holatlarini beradi, o'quvchi yozuvni o'zi yozadi (MD da matn yo'q — «MD ga taklif»)
const AI_SOROV = { uz: "Sen tekshiruvchisan. Mahsulot: Maydon Jamoa — tashkilotchi Pro'ni (30 kun, 15 000 so'm, test rejim) oladi; to'lov xabari POST /tolov/webhook ga keladi. Menga navbat bilan 4 ta buzish holatini ber: ikki marta yuborish, kechiktirib yuborish, rad etish, noto'g'ri imzo. Har holat uchun men buzish yozuvini yozaman: nima qildim, nima kutdim, nima bo'ldi va belgi — buzildi yoki buzilmadi. Sen yozuvim talabga mosligini bir gap bilan ayt: «Nima kutdim» to'g'rimi, belgi to'g'ri qo'yilganmi. Karta ma'lumoti va kalit so'rama. Birinchi holatni ber.",
  ru: 'Ты проверяющий. Продукт: Maydon Jamoa — организатор берёт Pro (30 дней, 15 000 сумов, тестовый режим); сообщение о платеже приходит на POST /tolov/webhook. Дай мне по очереди 4 случая поломки: отправить дважды, с задержкой, отклонить, неверная подпись. Для каждого я пишу запись поломки: что сделал, что ожидал, что получилось и метку — сломалось или не сломалось. Скажи одной фразой, соответствует ли запись требованию: верно ли «Что ожидал», правильно ли поставлена метка. Данные карты и ключи не спрашивай. Дай первый случай.' };
const AiDavomCard = () => {
  const [ok, setOk] = useState(false);
  const kochir = async () => { if (await nusxala(tr(AI_SOROV))) { setOk(true); setTimeout(() => setOk(false), 1800); } };
  return (
    <div className="card pd-ai fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Erta tugatdingizmi? AI bilan davom eting', ru: 'Закончили раньше? Продолжите с AI' })}</div>
      <p className="pd-ai-m">{tr({ uz: "gemini.google.com'ni oching, pastdagi so'rovni yuboring — AI tekshiruvchi bo'lib to'rt buzish holatini beradi. Har biriga yozuvni o'zingiz yozing; adashgan joyingizni «Orqaga» bilan 3, 6-ekranlarda qayta ko'ring.", ru: 'Откройте gemini.google.com, отправьте запрос ниже — AI как проверяющий даст четыре случая поломки. Запись для каждого пишите сами; где ошиблись — посмотрите снова на экранах 3 и 6 через «Назад».' })}</p>
      <pre className="pd-ai-sorov">{tr(AI_SOROV)}</pre>
      <button type="button" className="q-chip pd-ai-btn" onClick={kochir}>{ok ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: "So'rovni nusxalash", ru: 'Скопировать запрос' })}</button>
    </div>
  );
};
const YAKUN_SARLAVHA = {
  takrorlanmadi: { uz: 'Tuzatish qilindi va qayta tekshiruvda takrorlanmadi.', ru: 'Исправление сделано, при перепроверке не повторилось.' },
  buzilmadi: { uz: "To'rt usul bajarildi — to'lov yo'lingiz buzilmadi.", ru: 'Четыре способа выполнены — путь оплаты не сломался.' },
  qaytaQoldi: { uz: 'Tuzatish qilindi — qayta tekshirish qoldi.', ru: 'Исправление сделано — осталась перепроверка.' },
  tuzatishQoldi: { uz: 'Urinishlar yozildi — tuzatish qoldi.', ru: 'Попытки записаны — осталось исправить.' },
  tugamagan: { uz: "To'lovni buzish hali tugamagan.", ru: 'Поломка оплаты ещё не закончена.' },
  buzishQoldi: { uz: 'Qolgan holatlar tekshirildi — buzish qoldi.', ru: 'Остальные состояния проверены — осталась поломка.' },
  yoq: { uz: "To'lov yo'li bugun hali tekshirilmagan.", ru: 'Путь оплаты сегодня ещё не проверен.' }
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
  const ur = buzOqi() || [];
  const boshlangan = ur.some(u => u.buzildi !== null || String(u.kutdim || '').trim() || String(u.boldi || '').trim());
  const tuzlar = ur.filter(u => u.buzildi === true && u.tuzatishQilindi);
  const buzildiBor = ur.some(u => u.buzildi === true);
  const hammaBuzilmadi = ur.length === 4 && ur.every(u => u.buzildi === false);
  // Birinchi holat — faqat kamida bitta «Tuzatish qilindi» bo'lsa (MD izohi); aks holda — keyingi rost holat
  const holat = a3 && tuzlar.length > 0 && tuzlar.every(u => u.qayta === 'takrorlanmadi') ? 'takrorlanmadi'
    : tuzlar.length > 0 ? 'qaytaQoldi'
      : a2 && hammaBuzilmadi ? 'buzilmadi'
        : a2 && buzildiBor ? 'tuzatishQoldi'
          : a2 || boshlangan ? 'tugamagan'
            : a1 ? 'buzishQoldi' : 'yoq';
  const RECAP = [
    { uz: "Agentning «to'lov ishlaydi» degani — da'vo: to'lovni o'zingiz to'rt usul bilan buzib ko'rasiz.", ru: 'Слова агента «оплата работает» — заявление: оплату вы сами ломаете четырьмя способами.' },
    { uz: "To'lov xabari ikki marta kelsa ham, to'lov bir marta yozilishi va Pro bir marta uzayishi kerak.", ru: 'Даже если сообщение о платеже пришло дважды, платёж записывается один раз и Pro продлевается один раз.' },
    { uz: "Javob kechiksa, sahifa «To'lov o'tmadi» emas, «Javob kutilmoqda» deyishi kerak.", ru: 'Если ответ задерживается, страница должна говорить не «Платёж не прошёл», а «Ожидаем ответ».' },
    { uz: "Rad etish va noto'g'ri imzo ham tekshiriladi — «buzilmadi» ham natija.", ru: 'Отклонение и неверная подпись тоже проверяются — «не сломалось» тоже результат.' },
    { uz: "«Tuzatish qilindi» — kod o'zgargani; yashil belgi — o'sha usul bilan qayta buzilmagani.", ru: '«Tuzatish qilindi» — код изменился; зелёная метка — тем же способом снова не сломалось.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className={cx('pd-yakun', !a2 && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tx({ uz: "`BUZISH.md` «To'lov» tayyor", ru: '`BUZISH.md` «To\'lov» готов' })}
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
          <p className="pd-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Pul haqida qanday gaplashasiz?»</b></>, ru: <>Следующий урок — <b>«Как говорить о деньгах?»</b></> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PaymentDayLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — «telefon · Backend» to'lov sahnasi (pd-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Telefon 170×272 hamma ekranda (SABOQ 22) === */
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .pd-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: pd-puls 2.2s ease-out .3s 3; }
        @keyframes pd-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .pd-joriy { outline: 2px solid ${T.accent}; outline-offset: 3px; border-radius: 14px; }
        /* Variantlar va bashorat chiplari: guruh ramkasi yo'q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .pd-k { display: contents; }
        .pd-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: pd-chorla-v 1.8s ease-out .5s 2; }
        @keyframes pd-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .pd-chorla .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: pd-chorla-c 1.8s ease-out .5s 2; }
        @keyframes pd-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .pd-k.faol .q-variant:nth-child(2), .pd-chorla .q-chip:nth-child(2) { animation-delay: .75s; }
        .pd-k.faol .q-variant:nth-child(3), .pd-chorla .q-chip:nth-child(3) { animation-delay: 1s; }
        /* SABOQ P2: kirish maketi ustunga sig'adi — maket o'z kengligida, variantlar yonida (zoom ishlatilmaydi — P5) */
        @media (min-width: 761px) { .pd-k .q-split { grid-template-columns: max-content minmax(0, 1fr); gap: 28px; } }
        .pd-pop { display: inline-block; animation: pd-pop .55s cubic-bezier(.3,1.5,.5,1); }
        @keyframes pd-pop { 0% { transform: scale(1.4); } 100% { transform: scale(1); } }
        @keyframes pd-kir { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        @keyframes pd-qator { 0% { opacity: 0; transform: translateY(-5px); background: ${T.okFon}; } 20% { opacity: 1; transform: none; } 75% { background: ${T.okFon}; } 100% { background: transparent; } }
        @keyframes pd-aylan { to { transform: rotate(360deg); } }
        .pd-viz { display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
        /* Sahna: telefon · chiziq · Backend; telefonda (≤640) — ustma-ust, chiziq tik */
        .pd-sahna.yot { display: grid; grid-template-columns: 170px minmax(44px, 90px) minmax(214px, 250px); align-items: center; justify-content: center; }
        .pd-s-tel, .pd-s-ch, .pd-s-be { min-width: 0; display: flex; align-items: center; justify-content: center; }
        .pd-sahna.tik { display: flex; flex-direction: column; align-items: center; }
        .pd-sahna.tik > div { width: 100%; display: flex; justify-content: center; }
        .pd-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 5px; width: 170px; flex: none; }
        .pd-tel-yorliq { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .pd-telefon { width: 170px; height: 272px; border-radius: 24px; background: ${T.ink}; padding: 5px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.55); flex: none; }
        .pd-tel-ekran { width: 100%; height: 100%; border-radius: 19px; background: ${T.paper}; overflow: hidden; display: flex; flex-direction: column; animation: fade-step .35s ease; }
        .pd-tel-iz { font-size: 11.5px; font-weight: 700; color: ${T.err}; background: ${T.errFon}; border-radius: 7px; padding: 1px 8px; }
        .pd-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 5px; white-space: nowrap; }
        /* Ilova ekranlari */
        .pd-ilova { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 6px; padding: 8px 9px; }
        .pd-il-bosh { display: flex; align-items: center; gap: 6px; font-size: 12.5px; }
        .pd-il-k { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 6px; animation: pd-kir .4s ease both; }
        .pd-il-sar { font-size: 13px; font-weight: 800; line-height: 1.25; color: ${T.ink}; }
        .pd-il-matn { font-size: 11px; line-height: 1.35; color: ${T.ink2}; }
        .pd-narx { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 6px; }
        .pd-narx b { font-size: 13px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .pd-narx em { font-style: normal; font-size: 10px; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 0 5px; }
        .pd-otish, .pd-qtekshir { font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 700; border: 0; border-radius: 9px; padding: 6px 8px; background: ${T.ink}; color: #fff; cursor: pointer; }
        .pd-otish:disabled, .pd-qtekshir:disabled { cursor: default; }
        .pd-il-test { font-size: 10px; line-height: 1.3; text-align: center; color: ${T.ink2}; }
        .pd-il-oyin { font-size: 11px; line-height: 1.35; color: ${T.ink}; padding: 6px; border-radius: 9px; border: 1px solid ${T.line}; }
        .pd-belgi-q { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 700; color: ${T.ink}; padding: 6px; border-radius: 9px; border: 1.5px solid ${T.line}; transition: all .3s; }
        .pd-belgi-q i { flex: none; width: 14px; height: 14px; border-radius: 4px; border: 1.5px solid ${T.line}; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 10px; color: #fff; }
        .pd-belgi-q.yoq { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pd-belgi-q.yoq i { background: ${T.accent}; border-color: ${T.accent}; animation: pd-pop .5s ease; }
        .pd-il-pro { font-size: 10.5px; font-weight: 800; color: ${T.ok}; }
        .pd-il-xabar { font-size: 12px; font-weight: 800; line-height: 1.3; padding: 8px; border-radius: 10px; }
        .pd-il-xabar.err { color: ${T.err}; background: ${T.errFon}; } .pd-il-xabar.kul { color: ${T.ink2}; background: ${T.bg}; }
        .pd-eski { margin-left: 6px; font-style: normal; font-size: 10px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1px dashed ${T.line}; border-radius: 6px; padding: 0 5px; white-space: nowrap; }
        /* Brauzer — «Mashq to'lov» sahifasi (Payme ko'rinishi, SABOQ P6) */
        .pd-br-bar { flex: none; display: flex; align-items: center; gap: 5px; padding: 2px 6px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .pd-br-bar code { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${T.ink2}; white-space: nowrap; }
        .pd-mashq { flex: 1; min-height: 0; display: flex; flex-direction: column; }
        .pd-pm-bosh { flex: none; display: flex; align-items: center; justify-content: space-between; padding: 2px 8px; background: ${PAYME_RANG}; color: #fff; font-size: 12.5px; font-weight: 900; }
        .pd-pm-bosh span { font-size: 10px; font-weight: 700; background: rgba(255,255,255,.28); border-radius: 6px; padding: 0 5px; }
        .pd-m-ich { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 2px; padding: 2px 6px 3px; }
        .pd-m-sar { font-size: 10px; font-weight: 700; color: ${T.ink2}; }
        .pd-m-nom { font-size: 10px; line-height: 1.25; color: ${T.ink}; }
        .pd-m-summa { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 5px; }
        .pd-m-summa b { font-size: 14px; line-height: 1.2; font-weight: 900; color: ${T.ink}; white-space: nowrap; }
        .pd-m-summa em { font-style: normal; font-size: 10px; color: ${T.ink2}; background: ${T.bg}; border-radius: 5px; padding: 0 4px; }
        .pd-m-asos { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .pd-tb { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; line-height: 1.15; border: 0; border-radius: 7px; padding: 3px; cursor: pointer; background: ${T.bg}; color: ${T.ink}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .pd-tb.pd-tolash { background: ${PAYME_RANG}; color: #fff; box-shadow: none; }
        .pd-tb:disabled { cursor: default; }
        .pd-m-tek { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-top: 4px; padding: 7px 3px 2px; border: 1px dashed ${T.line}; border-radius: 8px; }
        .pd-m-tek-y { position: absolute; top: -7px; left: 6px; font-size: 10px; font-weight: 700; line-height: 1; color: ${T.ink2}; background: ${T.paper}; padding: 0 3px; }
        .pd-m-tek .pd-tb { font-size: 10px; line-height: 1.1; padding: 1px 2px; }
        .pd-m-tek.xira .pd-tb { opacity: .5; }
        .pd-tb.yangi { box-shadow: inset 0 0 0 1.5px ${T.accent}; color: ${T.accent}; }
        .pd-m-javob { align-self: flex-start; min-height: 14px; line-height: 1.3; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 6px; animation: pd-kir .4s ease both; }
        .pd-m-javob.ok { color: ${T.ok}; background: ${T.okFon}; } .pd-m-javob.err { color: ${T.err}; background: ${T.errFon}; } .pd-m-javob.kul { color: ${T.ink2}; background: ${T.bg}; }
        .pd-m-test { margin-top: auto; font-size: 10px; line-height: 1.15; color: ${T.ink2}; }
        /* Backend tuguni: «Mashq to'lov» → ichki konvert → POST /tolov/webhook (to'rt qator) · tolovlar · Pro muddati */
        .pd-backend { width: 100%; display: flex; flex-direction: column; gap: 5px; padding: 9px 10px; border-radius: 14px; background: ${T.ink}; color: #fff; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.6); }
        .pd-be-bosh { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 8px; }
        .pd-be-bosh b { font-size: 13px; }
        .pd-be-yangi { font-size: 10px; color: ${fon(T.paper, 0.7)}; animation: pd-kir .4s ease both; }
        .pd-bq { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; padding: 5px 7px; border-radius: 8px; background: ${fon(T.paper, 0.1)}; font-size: 11.5px; }
        .pd-bq.wh { flex-direction: column; align-items: stretch; }
        .pd-soat { display: inline-flex; align-items: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; color: ${fon(T.paper, 0.85)}; }
        .pd-soat-ic.yur .pd-soat-mil { transform-origin: 8px 8px; animation: pd-aylan 1s linear infinite; }
        .pd-wh { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${fon(T.paper, 0.85)}; white-space: nowrap; }
        .pd-ichki { position: relative; width: 30px; height: 20px; margin: 0 auto; }
        .pd-ichki-i { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; margin-left: -1px; background: ${fon(T.paper, 0.3)}; }
        .pd-tek { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
        .pd-tq { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; padding: 2px 5px; border-radius: 6px; background: ${fon(T.paper, 0.08)}; color: ${fon(T.paper, 0.6)}; transition: background .3s, color .3s; white-space: nowrap; }
        .pd-tq.ok { background: ${fon(T.ok, 0.55)}; color: #fff; } .pd-tq.err { background: ${fon(T.err, 0.6)}; color: #fff; }
        .pd-tq.bor { background: ${fon(T.paper, 0.24)}; color: #fff; } .pd-tq.otkaz { opacity: .55; text-decoration: line-through; }
        .pd-tq.kochdi { animation: pd-kochdi .9s ease; }
        @keyframes pd-kochdi { 0% { transform: translateY(-14px); opacity: .3; } 100% { transform: none; opacity: 1; } }
        .pd-xabar { display: flex; flex-direction: column; padding: 4px 6px; border-radius: 7px; background: ${T.paper}; color: ${T.ink}; }
        .pd-xabar code { font-family: 'JetBrains Mono', monospace; font-size: 10px; line-height: 1.35; white-space: nowrap; }
        .pd-xabar code.ajrat { color: ${T.accent}; font-weight: 800; }
        .pd-xb-imzo { color: ${T.ink2}; } .pd-xb-imzo.xato { color: ${T.err}; font-weight: 800; }
        .pd-jadval { display: flex; flex-direction: column; border-radius: 8px; overflow: hidden; background: ${T.paper}; color: ${T.ink}; }
        .pd-j-bosh { display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 3px 7px; background: ${T.bg}; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; }
        .pd-j-bosh code { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        .pd-j-q { display: grid; grid-template-columns: 1fr auto; gap: 6px; padding: 2px 7px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; }
        .pd-j-q.rad { color: ${T.ink2}; } .pd-j-q.yangi { animation: pd-qator 1.4s ease both; }
        .pd-pro { font-size: 11.5px; font-weight: 700; padding: 4px 7px; border-radius: 7px; background: ${fon(T.paper, 0.1)}; transition: background .3s; white-space: nowrap; }
        .pd-pro.ok { background: ${fon(T.ok, 0.55)}; } .pd-pro.err { background: ${fon(T.err, 0.6)}; }
        /* Chiziq va konvert: so'rov · javob · GET /men; ichki — «Mashq to'lov» → webhook */
        .pd-chiziq { position: relative; display: flex; align-items: center; justify-content: center; }
        .pd-chiziq.yot { height: 30px; width: 100%; }
        .pd-chiziq.tik { width: 40px; height: 40px; }
        .pd-chiziq-i { position: absolute; background: ${T.line}; border-radius: 2px; }
        .pd-chiziq.yot .pd-chiziq-i { left: 4px; right: 4px; top: 50%; height: 2px; margin-top: -1px; }
        .pd-chiziq.tik .pd-chiziq-i { top: 2px; bottom: 2px; left: 50%; width: 2px; margin-left: -1px; }
        .pd-kv { position: absolute; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 1px; animation: pd-kv-x .85s ease-in-out both; }
        .pd-chiziq.yot .pd-kv { top: -12px; } .pd-chiziq.yot .pd-kv.ba { animation-name: pd-kv-xb; }
        .pd-chiziq.tik .pd-kv { left: 6px; flex-direction: row; gap: 6px; animation-name: pd-kv-y; } .pd-chiziq.tik .pd-kv.ba { animation-name: pd-kv-yb; }
        .pd-ichki .pd-kv { left: 5px; animation-name: pd-kv-y; }
        .pd-kv-i { width: 20px; height: 14px; border-radius: 3px; background: ${T.accent}; position: relative; box-shadow: 0 4px 10px -4px ${fon(T.accent, 0.7)}; }
        .pd-kv-i::after { content: ''; position: absolute; left: 3px; right: 3px; top: 2px; height: 6px; border-left: 1.5px solid #fff; border-bottom: 1.5px solid #fff; transform: rotate(-45deg) scale(.55); }
        .pd-kv.javob .pd-kv-i { background: ${T.ok}; } .pd-kv.men .pd-kv-i, .pd-kv.sorov .pd-kv-i { background: ${T.ink2}; }
        .pd-kv.rad .pd-kv-i { background: ${T.ink2}; } .pd-kv.xato .pd-kv-i { background: ${T.err}; }
        .pd-kv-y { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; white-space: nowrap; color: ${T.ink}; background: ${T.paper}; border-radius: 5px; padding: 0 4px; box-shadow: 0 2px 6px -3px rgba(${T.shadowBase},0.4); }
        .pd-chiziq.yot .pd-kv-y { order: -1; }
        @keyframes pd-kv-x { 0% { left: 0; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: calc(100% - 22px); opacity: 0; } }
        @keyframes pd-kv-xb { 0% { left: calc(100% - 22px); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: 0; opacity: 0; } }
        @keyframes pd-kv-y { 0% { top: 0; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { top: calc(100% - 14px); opacity: 0; } }
        @keyframes pd-kv-yb { 0% { top: calc(100% - 14px); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { top: 0; opacity: 0; } }
        /* Antigravity pufagi (0-ekran) va chat (5-ekran) */
        .pd-pufak { width: 170px; display: flex; flex-direction: column; gap: 2px; padding: 6px 9px; border-radius: 12px 12px 12px 4px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.4); font-size: 11.5px; line-height: 1.35; color: ${T.ink}; }
        .pd-pufak b { font-size: 10.5px; color: ${T.accent}; }
        .pd-pufak em { align-self: flex-start; margin-top: 3px; font-style: normal; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 6px; }
        .pd-chat { display: flex; flex-direction: column; gap: 6px; }
        .pd-puf { display: flex; flex-direction: column; gap: 2px; max-width: 94%; padding: 7px 10px; border-radius: 12px; font-size: 12.5px; line-height: 1.4; color: ${T.ink}; }
        .pd-puf b { font-size: 11px; }
        .pd-puf.siz { align-self: flex-end; background: ${T.accentSoft}; } .pd-puf.siz b { color: ${T.accent}; }
        .pd-puf.ag { align-self: flex-start; background: ${T.paper}; border: 1px solid ${T.line}; } .pd-puf.ag b { color: ${T.ink2}; }
        /* Bashorat ixcham qatori, xulosa qutisi qatorlari (E 42), nom qatori, ost qatori, qadam chiplari */
        .pd-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .pd-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        .q-xulosa .pd-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .pd-x-tx b { color: ${T.ink}; } .q-xulosa .pd-x-tx.ok, .q-xulosa .pd-x-tx.ok b { color: ${T.ok}; } .q-xulosa .pd-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .pd-x-m { display: block; }
        .q-xulosa .pd-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.pd-nom { margin: 0; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        p.pd-ost { margin: 0; font-size: 12.5px; line-height: 1.4; color: ${T.ink2}; text-align: center; }
        .pd-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .pd-ustoz b { color: ${T.ink}; }
        .pd-qchip { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
        .pd-qc { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 4px; border-radius: 999px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .pd-qc i { font-style: normal; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; background: ${T.bg}; color: ${T.ink2}; }
        .pd-qc.joriy { border-color: ${T.accent}; color: ${T.ink}; } .pd-qc.joriy i { background: ${T.accent}; color: #fff; }
        .pd-qc.ok { color: ${T.ink}; } .pd-qc.ok i { background: ${T.okFon}; color: ${T.ok}; }
        .pd-chip-n { align-self: center; font-size: 12.5px; font-weight: 700; padding: 3px 10px; border-radius: 8px; }
        .pd-chip-n.err { color: ${T.err}; background: ${T.errFon}; } .pd-chip-n.kul { color: ${T.ink2}; background: ${T.bg}; }
        /* Buzish yozuvi: ixcham qator, belgi, karta (5-ekran) */
        .pd-yix-l { display: flex; flex-direction: column; gap: 5px; }
        .pd-yix { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; padding: 6px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; color: ${T.ink}; }
        .pd-yix i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; color: ${T.accent}; }
        .pd-yix.yangi { animation: pd-qator 1.4s ease both; }
        .pd-bb { font-style: normal; font-size: 11.5px; font-weight: 700; padding: 1px 8px; border-radius: 999px; white-space: nowrap; animation: pd-kir .4s ease both; }
        .pd-bb.buzildi, .pd-bb.takrorlandi { color: ${T.err}; background: ${T.errFon}; } .pd-bb.buzilmadi { color: ${T.ink2}; background: ${T.bg}; }
        .pd-bb.tuz { color: ${T.accent}; background: ${T.accentSoft}; } .pd-bb.takrorlanmadi { color: ${T.ok}; background: ${T.okFon}; }
        .pd-bb.bosh { display: inline-block; width: 64px; height: 16px; border: 1.5px dashed ${T.line}; background: transparent; animation: none; }
        .pd-yakun2 { display: grid; grid-template-columns: minmax(0, 480px) minmax(240px, 1fr); gap: 18px; align-items: start; }
        .pd-s5-ust { display: grid; grid-template-columns: minmax(0, 480px) minmax(260px, 1fr); gap: 18px; align-items: start; }
        .pd-s5.tugadi .pd-s5-ust { grid-template-columns: minmax(0, 480px) minmax(240px, 380px); justify-content: center; }
        .pd-yp { display: flex; flex-direction: column; gap: 8px; }
        .pd-yk { display: flex; flex-direction: column; gap: 5px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.accent}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.45); }
        .pd-yk-bosh { display: flex; align-items: center; gap: 8px; font-size: 13.5px; }
        .pd-yk-bosh i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.accent}; }
        .pd-yk-belgi { margin-left: auto; }
        .pd-yk-q { display: flex; flex-direction: column; gap: 1px; font-size: 12.5px; line-height: 1.4; color: ${T.ink}; }
        .pd-yk-q em { font-style: normal; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: ${T.ink2}; }
        .pd-farq { border-radius: 3px; transition: background .3s, color .3s; }
        .pd-farq.on { color: ${T.err}; background: ${T.errFon}; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px; }
        .pd-solishtir, .pd-agent, .pd-qayta { align-self: flex-start; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; padding: 7px 14px; border-radius: 10px; border: 0; background: ${T.ink}; color: #fff; cursor: pointer; }
        .pd-solishtir:disabled, .pd-agent:disabled, .pd-qayta:disabled { opacity: .45; cursor: default; }
        /* Reja: telefon + BUZISH.md kartasi */
        .pd-reja-chap { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: center; }
        .pd-bmd { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; min-width: 196px; }
        .pd-bmd-bosh { display: flex; align-items: baseline; gap: 6px; font-size: 12px; color: ${T.ink2}; }
        .pd-bmd-bosh code { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; }
        .pd-bmd-q { display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: ${T.ink}; }
        .pd-bmd-q i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: ${T.accent}; }
        .pd-bmd-q span { flex: 1; }
        p.pd-reja-past { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink2}; }
        /* Amaliyot bloklari — qadam matni QBlok'da <p> ichida: faqat span (display: block bilan) */
        .pd-blok { display: contents; }
        .pd-blok.qulf .q-blok-q.joriy .q-blok-tana > .q-btn { opacity: .45; pointer-events: none; }
        .pd-band, .pd-kulrang, .pd-xato, .pd-ps, .pd-ps-q, .pd-yordam, .pd-yordam-s, .pd-sqllar, .pd-bz, .pd-bz-talab, .pd-sql-ogoh { display: block; }
        .pd-band { margin-top: 6px; }
        .pd-kulrang { margin-top: 6px; font-size: 12.5px; color: ${T.ink2}; }
        .pd-xato { margin-top: 6px; font-size: 13px; font-weight: 700; color: ${T.err}; }
        .q-blok-t .qcode, .pd-tk .qcode, .pd-mk-q .qcode, .pd-bz-talab .qcode { white-space: nowrap; } /* SABOQ P9 */
        .pd-yordam .qcode, .pd-ps .qcode { white-space: normal; overflow-wrap: anywhere; }
        .pd-prompt { display: block; margin-top: 8px; }
        .pd-ps { margin: 0; padding: 0 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink}; overflow-wrap: anywhere; }
        .pd-ps + .pd-ps { margin-top: 4px; }
        .pd-ps .q-joy { display: inline-block; max-width: 100%; }
        .pd-joylar { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .pd-joy-m { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; padding: 0 0 0 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .pd-joy-m:focus-within { border-color: ${T.accent}; }
        .pd-joy-n { flex: none; max-width: 100%; padding-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.accent}; }
        .pd-joy-m input, .pd-joy-m textarea { flex: 1 1 220px; min-width: 0; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.4; padding: 8px 10px 8px 0; color: ${T.ink}; resize: vertical; }
        .pd-yordam-ust { display: block; margin-top: 8px; }
        .pd-yordam { margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; }
        .pd-yordam b { display: block; margin-bottom: 4px; font-size: 12px; color: ${T.ink2}; }
        .pd-yordam-s + .pd-yordam-s { margin-top: 4px; }
        .pd-sqllar { margin-top: 6px; }
        .pd-sql { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin-top: 6px; padding: 6px 8px; border-radius: 9px; background: ${CODE.bg}; }
        .pd-sql em { width: 100%; font-style: normal; font-size: 11px; font-weight: 700; color: ${CODE.punct}; }
        .pd-sql code { flex: 1 1 200px; min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.45; color: ${CODE.attr}; overflow-wrap: anywhere; }
        .pd-sql .pd-nusxa { font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 700; border: 0; border-radius: 7px; padding: 4px 9px; background: ${fon(T.paper, 0.16)}; color: #fff; cursor: pointer; }
        .pd-sql-ogoh { margin-top: 4px; font-size: 12.5px; font-weight: 800; color: ${T.err}; }
        .pd-trek-q { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
        .pd-trek { font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 700; padding: 5px 12px; border-radius: 999px; border: 1.5px solid ${fon(T.accent, 0.6)}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .pd-trek.on { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .pd-tk { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .pd-tk-q { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; }
        .pd-tk-q .pd-yix { flex: 1 1 100%; }
        .pd-tk-q .pd-qt { font-size: 11.5px; padding: 5px 8px; }
        .pd-tuz, .pd-qt { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; padding: 5px 10px; border-radius: 9px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .pd-tuz.on { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; }
        .pd-qt.ok.on { border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; } .pd-qt.err.on { border-color: ${T.err}; background: ${T.errFon}; color: ${T.err}; }
        /* 2-amaliyot: buzish yozuvi kartasi — bittadan (E 53), yorliq maydon ichida (E 43) */
        .pd-bz { margin-top: 8px; }
        .pd-bz-chiziq { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
        .pd-yz-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; padding: 3px 10px 3px 4px; border-radius: 999px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; }
        .pd-yz-chip i { font-style: normal; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; background: ${T.bg}; }
        .pd-yz-chip em { font-style: normal; font-size: 11px; }
        .pd-yz-chip.on { border-color: ${T.accent}; color: ${T.ink}; } .pd-yz-chip.on i { background: ${T.accent}; color: #fff; }
        .pd-yz-chip.err em { color: ${T.err}; } .pd-yz-chip.err i { background: ${T.errFon}; color: ${T.err}; }
        .pd-yz-chip.ok em { color: ${T.ink2}; }
        .pd-bz-karta { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; }
        .pd-bz-bosh { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; font-size: 13.5px; }
        .pd-bz-bosh i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.accent}; }
        .pd-bz-yol { width: 100%; font-size: 12px; line-height: 1.45; color: ${T.ink2}; }
        .pd-bz-m { display: flex; flex-direction: column; align-items: stretch; gap: 0; padding: 0 0 0 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .pd-bz-m:focus-within { border-color: ${T.accent}; }
        .pd-bz-m.qulf { background: ${T.bg}; cursor: not-allowed; }
        .pd-bz-n { flex: none; padding-top: 7px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.accent}; white-space: nowrap; }
        .pd-bz-m textarea { flex: none; box-sizing: border-box; min-width: 0; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 13.5px; line-height: 1.4; padding: 3px 10px 8px 0; color: ${T.ink}; resize: none; overflow: hidden; }
        .pd-bz-m textarea:disabled { cursor: not-allowed; }
        .pd-bz-talab { font-size: 12px; line-height: 1.45; color: ${T.ink2}; padding: 0 2px; }
        .pd-bz-btn { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 8px; }
        .pd-bz-btn .pd-yordam-ust { margin-top: 0; margin-left: auto; }
        .pd-bz-btn .pd-yordam-ust:has(.pd-yordam) { flex-basis: 100%; margin-left: 0; }
        .pd-belgi { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; padding: 7px 14px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; cursor: pointer; }
        .pd-belgi.err { border-color: ${fon(T.err, 0.55)}; color: ${T.err}; } .pd-belgi.ok { color: ${T.ink2}; }
        .pd-belgi.err.on { background: ${T.errFon}; } .pd-belgi.ok.on { background: ${T.bg}; border-color: ${T.ink2}; }
        .pd-belgi:disabled { opacity: .45; cursor: not-allowed; }
        p.pd-ortda, p.pd-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        @media (max-width: 640px) { p.pd-ortda .qcode, p.pd-ulgur .qcode { white-space: normal; overflow-wrap: anywhere; } } /* 13-Modul sinf-supurish C: uzun buyruq (git clone URL) telefonda o'ng chetdan kesilmaydi */
        p.pd-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.bg}; }
        /* Kutilgan natija maketlari */
        .pd-an { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .pd-an-ost { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; justify-content: center; }
        .pd-an .pd-yix-l { align-self: stretch; }
        .pd-fayllar { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; align-self: stretch; }
        .pd-an-ost .pd-fayllar { align-self: center; flex: 1 1 180px; }
        .pd-fayl { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 8px; font-size: 12px; }
        .pd-fayl code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink}; }
        .pd-fayl em { font-style: normal; font-size: 11px; color: ${T.ink2}; }
        .pd-term { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${CODE.bg}; align-self: stretch; }
        .pd-term span { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${CODE.text}; } .pd-term .buyruq { color: ${CODE.attr}; }
        .pd-mk { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; align-self: stretch; }
        .pd-mk-k { display: flex; flex-direction: column; gap: 3px; padding: 7px 9px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 11px; line-height: 1.35; color: ${T.ink}; }
        .pd-mk-b { display: flex; flex-wrap: wrap; align-items: center; gap: 3px 6px; font-size: 12px; }
        .pd-mk-b i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.accent}; }
        .pd-mk-q em { display: block; font-style: normal; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: ${T.ink2}; }
        .pd-rc-n { font-family: 'JetBrains Mono', monospace; font-size: 34px; color: ${T.accent}; }
        /* Kartochkalar, AI kartasi, yakun */
        .pd-flash { display: flex; flex-direction: column; gap: 10px; }
        .pd-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: pd-puls 1.8s ease-out .4s 3; }
        p.pd-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.pd-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        p.pd-ai-m { margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .pd-ai-sorov { margin: 0 0 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; white-space: pre-wrap; }
        .pd-ai-btn { margin: 0; }
        .pd-ai { display: flex; flex-direction: column; }
        .pd-yordam-btn { margin: 0; }
        .pd-yakun { display: contents; }
        .pd-yakun.belgisiz .done-chip { display: none; }
        .pd-yakun .q-yakun > .ach-coll { order: 1; }
        p.pd-keyingi { margin: 0; font-size: 14.5px; line-height: 1.5; color: ${T.ink2}; }
        p.pd-keyingi b { color: ${T.ink}; }
        /* ⛶ kattalashtirish — skeletda yo'q qoida (SABOQ 38); ikki klassli selektor — keyingi «.zoomable position relative» oynani siljitmasin (E 48) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 96vw); max-height: 92vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        /* 13-Modul sinf-supurish B: ⛶ oynasi faqat ko'rish uchun — maket ichidagi tugma (telefon tugmasi, jadval katagi, belgi) oynada bosilmaydi, harakat ⛶ dan tashqarida qoladi. Kirish ekrani variantlari va maket tugmasi qolipniki — tegilmaydi. */
        .zoom-on button:not(.zoom-btn) { pointer-events: none; cursor: default; }
        .q-kirish .zoom-on button { pointer-events: auto; cursor: pointer; }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 1000px) { .pd-yakun2, .pd-s5-ust, .pd-s5.tugadi .pd-s5-ust { grid-template-columns: 1fr; justify-items: center; } .pd-yp { width: 100%; max-width: 520px; } }
        @media (max-width: 640px) {
          .pd-backend { max-width: 300px; }
          .pd-mk { grid-template-columns: 1fr; }
          .pd-reja-chap { flex-direction: column; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pd-halqa, .pd-k.faol .q-variant, .pd-chorla .q-chip, .pd-flash.yangi .fc-card .fc-front, .pd-pop, .pd-j-q.yangi, .pd-yix.yangi, .pd-tel-ekran, .pd-il-k, .pd-m-javob, .pd-tq.kochdi, .pd-soat-mil, .pd-be-yangi, .pd-belgi-q.yoq i, .pd-bb { animation: none !important; }
          .pd-kv { display: none !important; }
          .pd-farq, .pd-tq, .pd-pro, .pd-belgi-q { transition: none !important; }
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
