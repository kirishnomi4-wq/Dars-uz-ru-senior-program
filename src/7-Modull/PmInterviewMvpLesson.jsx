import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 9-Modul · 3-dars (PM) «Besh suhbatdan qaysi muammo chiqdi?» — kalit m7-03. Manba-haqiqat: feedback/F-1005-9modul/03-PmInterviewMvp-v3.md (GATE M).
// Skeletdan (src/skelet/NamunaDars.jsx, konveyer 05.10.2026): infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — o'zgarmagan.
// Darsning bitta vizuali — SanoqDoska (besh yozuv → shikoyatlar sanog'i → muammo kartasi → uch quti). 17 ekran:
//   s0 QKirish · s1 QReja · s2/s4 QTushuncha · s3/s5/s7/s12 test (QuestionScreen → QTest) · s6 QVoqea (Burbn → Instagram) ·
//   s8/s10/s13 QMustaqil · s9 QTushuncha (mashq) · s11 QKod (VS Code, qo'lda yoziladi) · podium · QKartochka · QYakun (+ PM HwCard, M-q9).
// Darslararo natija: pm-m7d3-muammo (s8) · pm-m7d3-mvp (s10) — 00-MODUL-TAYANCH 6-bo'lim.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m7d3-v1', lessonTitle: { uz: 'Besh suhbatdan qaysi muammo chiqdi?', ru: 'Какая проблема вышла из пяти разговоров?' } };
// 17 ekran (MD v3) · oqim: kirish → maqsad → besh yozuv → test → muammo gapi → test → Burbn → test → o'z muammo gapi → uch quti → o'z qutilari → kod → yakuniy test → o'ylab ko'ring → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'yozuv', ru: 'запись' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'muammo', ru: 'проблема' }, l: 66, tp: 14, s: 12, d: 7.5 },
  { t: 'MVP', l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'quti', ru: 'коробка' }, l: 80, tp: 66, s: 13, d: 6.8 },
  { t: { uz: 'sanoq', ru: 'подсчёт' }, l: 46, tp: 40, s: 12, d: 7.2 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0  · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1  · QReja
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 2  · QTushuncha: besh yozuv
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 3  · 1-savol
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 4  · QTushuncha: muammo gapi
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 5  · 2-savol
  { id: 's6',  type: 'case',        template: 'custom',   scored: false, scope: null },            // 6  · QVoqea: Burbn
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 7  · 3-savol
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 8  · QMustaqil: muammo gapingiz
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 9  · QTushuncha (mashq): uch quti
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },            // 10 · QMustaqil: uch qutingiz
  { id: 's11', type: 'koding',      template: 'custom',   scored: false, scope: null },            // 11 · QKod
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 12 · yakuniy savol
  { id: 's13', type: 'reflection',  template: 'custom',   scored: false, scope: null },            // 13 · QMustaqil: 2 qadam
  { id: 'podium', type: 'stats',      template: 'custom', scored: false, scope: null },            // 14 · podium
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },            // 15 · QKartochka
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }             // 16 · QYakun
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
  const faol = !((freeRide ? false : disabled) || locked); // SABOQ 11: yoqilgan tugma — keyingi bosiladigan joy (halqa + qisqa puls)
  return <button className={`btn-white-accent${faol ? ' im-bos-nav' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). O'rni MD v3 da belgilangan va o'zgarmaydi: s3 = B, s5 = D, s7 = A, s12 = C.
const INLINE_KEYS = { s3: 1, s5: 3, s7: 0, s12: 2 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); PM darsida belgi o'rniga raqam (S-026)
const RECAPS = {
  3: {
    title: { uz: 'Bitta yozuv — bir odamning gapi', ru: 'Одна запись — слова одного человека' },
    cards: [
      { ic: '1', h: { uz: 'Qattiq gap', ru: 'Резкие слова' }, body: { uz: <>Pul haqidagi gap eng qattiq aytilgan edi, lekin u faqat <b>bitta yozuvda</b> chiqdi.</>, ru: <>Слова о деньгах были самыми резкими, но встретились только <b>в одной записи</b>.</> } },
      { ic: '2', h: { uz: 'Sanoq', ru: 'Подсчёт' }, body: { uz: <>Har shikoyat nechta yozuvda chiqqanini sanaymiz: «Maydon band edi» — <b>5 yozuvdan 4 tasida</b>.</>, ru: <>Считаем, в скольких записях встретилась каждая жалоба: «Поле было занято» — <b>в 4 записях из 5</b>.</> } },
      { ic: '3', h: { uz: 'Muammo', ru: 'Проблема' }, body: { uz: <>Bitta yozuvdagi gap bir odamniki. Ko'p yozuvda chiqqani — kuchli belgi; keyin uning og'irligini ham qaraymiz.</>, ru: <>Слова из одной записи — мнение одного человека. Встретившееся во многих записях — сильный знак; потом оценим и его тяжесть.</> }, ask: { uz: 'Yozuvlaringizda qaysi shikoyat eng ko\'p chiqdi?', ru: 'Какая жалоба чаще всего встречалась в ваших записях?' } }
    ]
  },
  5: {
    title: { uz: 'Muammo gapi qiyinchilikni aytadi', ru: 'Формулировка проблемы говорит о трудности' },
    cards: [
      { ic: '1', h: { uz: 'Ikki shikoyat, bitta qiyinchilik', ru: 'Две жалобы, одна трудность' }, body: { uz: <>«Band edi» va «telefonni ko'tarmadi» bitta asosiy qiyinchilikni ko'rsatdi: bo'sh vaqtni oldindan bilib, band qilib bo'lmaydi.</>, ru: <>«Было занято» и «не брал трубку» показали одну главную трудность: заранее нельзя узнать и занять свободное время.</> } },
      { ic: '2', h: { uz: "Uch bo'lak", ru: 'Три части' }, body: { uz: <><b>kim</b>, <b>qachon</b>, <b>nimadan qiynaladi</b>: «O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.»</>, ru: <><b>кто</b>, <b>когда</b>, <b>с чем трудно</b>: «Игрокам трудно перед походом на поле узнать свободное время и занять его.»</> } },
      { ic: '3', h: { uz: "Yechim yo'q", ru: 'Нет решения' }, body: { uz: <>Muammo gapida sayt ham, ilova ham yo'q: yechim qutilarda tanlanadi.</>, ru: <>В формулировке проблемы нет ни сайта, ни приложения: решение выбирается в коробках.</> }, ask: { uz: 'Muammo gapingizga yechim kirib qolmadimi?', ru: 'Не попало ли решение в вашу формулировку проблемы?' } }
    ]
  },
  7: {
    title: { uz: 'Burbn odamlar ko\'p qilgan ishni qoldirdi', ru: 'Burbn оставил то, что люди делали чаще всего' },
    cards: [
      { ic: '1', h: { uz: "To'rt imkoniyat", ru: 'Четыре возможности' }, body: { uz: <>Burbn'da joy belgilash, uchrashuv rejasi, ball va surat joylash bor edi.</>, ru: <>В Burbn были отметка места, план встречи, баллы и публикация фото.</> } },
      { ic: '2', h: { uz: 'Odamlar nima qildi', ru: 'Что делали люди' }, body: { uz: <>Jamoa kuzatdi: odamlar <b>surat joylashga</b> ko'proq tortilardi.</>, ru: <>Команда наблюдала: людей больше тянуло <b>публиковать фото</b>.</> } },
      { ic: '3', h: { uz: 'Qaror', ru: 'Решение' }, body: { uz: <>Suratdan boshqasi olib tashlandi — ilova <b>Instagram</b> bo'ldi (2010).</>, ru: <>Всё, кроме фото, убрали — приложение стало <b>Instagram</b> (2010).</> }, ask: { uz: 'Yozuvlaringizda odamlar ko\'pincha nima qilgani aytilgan?', ru: 'Что, по вашим записям, люди делают чаще всего?' } }
    ]
  },
  12: {
    title: { uz: '«Qilamiz»ga busiz muammo hal bo\'lmaydigani kiradi', ru: 'В «Делаем» входит то, без чего проблема не решится' },
    cards: [
      { ic: '1', h: { uz: 'Birinchi savol', ru: 'Первый вопрос' }, body: { uz: <>Busiz muammo hal bo'ladimi? «Yo'q» — <b>Qilamiz</b>.</>, ru: <>Без этого проблема решится? «Нет» — <b>Делаем</b>.</> } },
      { ic: '2', h: { uz: 'Ikkinchi savol', ru: 'Второй вопрос' }, body: { uz: <>«Ha» bo'lsa: yozuvlarda unga sabab bormi? Bor — <b>Keyin</b>, yo'q — <b>Qilmaymiz</b>.</>, ru: <>Если «да»: есть ли для этого причина в записях? Есть — <b>Потом</b>, нет — <b>Не делаем</b>.</> } },
      { ic: '3', h: { uz: '«Maydon»da', ru: 'В «Maydon»' }, body: { uz: <>«Qilamiz»da uchta: vaqt kataklari · band qilish · egasi uchun bandlar ro'yxati.</>, ru: <>В «Делаем» три: ячейки времени · бронь · список броней для владельца.</> }, ask: { uz: '«Qilamiz» qutingizdagi qaysi imkoniyat birinchi savoldan o\'tmaydi?', ru: 'Какая возможность в вашей коробке «Делаем» не проходит первый вопрос?' } }
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

// ===== DARSNING BITTA VIZUALI — SanoqDoska (163/180): «Maydon» besh yozuvi → shikoyatlar sanog'i → muammo kartasi → uch quti =====
// Bitta manba: YOZUVLAR · SHIKOYATLAR · MUAMMO_GAP · IMKONIYATLAR · QUTILAR · IKKI_SAVOL (MD v3 A-bo'lim, TAYANCHGA SAVOL 1).
// Doska bosilmaydi (o'qiladi); bosiladigan narsa — QTugma / QChip (q14).
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const yakkaMi = (live) => !live || (live.mode !== 'student' && live.mode !== 'mentor');
const norm = (s) => String(s || '').toLowerCase().replace(/[\u02BB\u02BC\u2018\u2019`]/g, "'").replace(/\s+/g, ' ').trim();
const fmtSon = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// Darslararo natija (00-MODUL-TAYANCH 6-bo'lim): s8 → muammo gapi, s10 → uch quti (6, 7, 12-darslar o'qiydi)
const KEY_MUAMMO = 'pm-m7d3-muammo';
const KEY_MVP = 'pm-m7d3-mvp';
const SAQLASH = { uz: 'Saqlash', ru: 'Сохранить' };
const QOSHISH = { uz: "Qo'shish", ru: 'Добавить' };
const YORDAM = { uz: 'Yordam', ru: 'Подсказка' };
const TAHRIR = { uz: 'Tahrirlash', ru: 'Изменить' };
// Pilot (1-dars) naqshi: javob-qatori bloklamaydi — ikkinchi «Saqlash» shu matnni qabul qiladi
const QOLDIR = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставить так — нажмите «Сохранить» ещё раз.' };
const yozuvNomi = (n) => tr({ uz: `${n}-yozuv · o'yinchi`, ru: `Запись ${n} · игрок` });
const nechtaTa = (n) => tr({ uz: `${n} ta`, ru: `${n} шт.` });
const dalilMatn = (n) => tr({ uz: `5 yozuvdan ${n} tasida`, ru: `в ${n} записях из 5` });

// Besh yozuv (bitta manba). q — gap bo'laklari: s — shu bo'lak qaysi shikoyat; b — qalin (5-yozuvning birinchi gapi, 0-ekran).
const YOZUVLAR = [
  { n: 1, sh: ['band', 'telefon'], q: [
    { t: { uz: "O'tgan juma do'stlar bilan keldik — ", ru: 'В прошлую пятницу пришли с друзьями — ' } },
    { t: { uz: 'maydon band edi', ru: 'поле было занято' }, s: 'band' },
    { t: { uz: ". Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ", ru: '. Перед приходом хотел занять время и звонил владельцу — ' } },
    { t: { uz: "ko'tarmadi", ru: 'не ответил' }, s: 'telefon' },
    { t: { uz: '.', ru: '.' } }] },
  { n: 2, sh: ['band', 'telefon'], q: [
    { t: { uz: 'Shanba kuni bordik, ', ru: 'В субботу пришли, ' } },
    { t: { uz: 'maydon band ekan', ru: 'а поле занято' }, s: 'band' },
    { t: { uz: ". Egasiga ikki marta qo'ng'iroq qildim — ", ru: '. Дважды звонил владельцу — ' } },
    { t: { uz: "telefonni ko'tarmadi", ru: 'трубку не взял' }, s: 'telefon' },
    { t: { uz: '.', ru: '.' } }] },
  { n: 3, sh: ['band'], q: [
    { t: { uz: 'Kecha kechqurun keldik, ', ru: 'Вчера вечером пришли, ' } },
    { t: { uz: 'maydon band edi', ru: 'поле было занято' }, s: 'band' },
    { t: { uz: ". Bir soat kutdik, so'ng uyga qaytdik.", ru: '. Час ждали, потом ушли домой.' } }] },
  { n: 4, sh: ['band', 'telefon', 'jamoa'], q: [
    { t: { uz: 'Yakshanba ', ru: 'В воскресенье ' } },
    { t: { uz: 'maydon band edi', ru: 'поле было занято' }, s: 'band' },
    { t: { uz: ', ', ru: ', ' } },
    { t: { uz: "egasi telefonni ko'tarmadi", ru: 'владелец не брал трубку' }, s: 'telefon' },
    { t: { uz: '. Ertasiga keldik — endi ', ru: '. Пришли на следующий день — теперь ' } },
    { t: { uz: 'jamoaga odam yetmadi', ru: 'не хватило людей в команду' }, s: 'jamoa' },
    { t: { uz: '.', ru: '.' } }] },
  { n: 5, sh: ['jamoa', 'pul'], q: [
    { t: { uz: "Eng yomoni — pulni bo'lishish!", ru: 'Хуже всего — делить деньги!' }, s: 'pul', b: true },
    { t: { uz: ' Har safar kimdir "keyin beraman" deydi. ', ru: ' Каждый раз кто-то говорит «потом отдам». ' } },
    { t: { uz: 'Jamoaga odam ham yetmadi', ru: 'И людей в команду не хватило' }, s: 'jamoa' },
    { t: { uz: ': guruhda yozdik, ikki kishi kelmadi.', ru: ': написали в группе, двое не пришли.' } }] }
];
const SHIKOYATLAR = [
  { k: 'band', t: { uz: 'Maydon band edi', ru: 'Поле было занято' }, nega: { uz: "Kelishdan oldin bo'sh vaqtni bilishmagan va uni band qila olishmagan.", ru: 'До прихода не знали свободное время и не могли его занять.' } },
  { k: 'telefon', t: { uz: "Egasi telefonni ko'tarmadi", ru: 'Владелец не брал трубку' }, nega: { uz: "Vaqtni bilish va band qilishning yo'li bitta — qo'ng'iroq. U ishlamadi.", ru: 'Узнать и занять время можно только звонком. Он не сработал.' } },
  { k: 'jamoa', t: { uz: 'Jamoaga odam yetmadi', ru: 'Не хватило людей в команду' } },
  { k: 'pul', t: { uz: "Pulni bo'lishish qiyin", ru: 'Трудно делить деньги' } }
];
const TELEFON_YOZUV = [0, 1, 3]; // «telefon» nuqtalari (1, 2, 4-yozuv) — 4-ekranda «band» nuqtalari ustiga tushadi
// Muammo gapi (GATE M 03-q0, so'zma-so'z) — butun dars bo'yi bitta manba
const MUAMMO_GAP = {
  bolaklar: [
    { y: { uz: 'kim', ru: 'кто' }, t: { uz: "O'yinchilar", ru: 'Игроки' } },
    { y: { uz: 'qachon', ru: 'когда' }, t: { uz: 'maydonga borishdan oldin', ru: 'перед тем как идти на поле' } },
    { y: { uz: 'nimadan qiynaladi', ru: 'с чем трудно' }, t: { uz: "bo'sh vaqtni bilish va uni band qilishda", ru: 'узнать свободное время и занять его' } }
  ],
  gap: { uz: "O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.", ru: 'Игрокам трудно перед походом на поле узнать свободное время и занять его.' },
  n: 4
};
const QUTILAR = [
  { k: 'qilamiz', t: { uz: 'Qilamiz', ru: 'Делаем' } },
  { k: 'keyin', t: { uz: 'Keyin', ru: 'Потом' } },
  { k: 'qilmaymiz', t: { uz: 'Qilmaymiz', ru: 'Не делаем' } }
];
const qutiNomi = (k) => tr(QUTILAR.find(q => q.k === k).t);
// Ikki savol (P-063): 9, 10-ekran va 4-recap — bitta manba
const IKKI_SAVOL = [
  { uz: "Busiz muammo hal bo'ladimi?", ru: 'Без этого проблема решится?' },
  { uz: 'Yozuvlarda unga sabab bormi?', ru: 'Есть ли для этого причина в записях?' }
];
// Sakkiz imkoniyat (navbat aralash) — quti va sabab-qatori
const IMKONIYATLAR = [
  { k: 'chat', t: { uz: "O'yinchilar chati", ru: 'Чат игроков' }, q: 'qilmaymiz', sabab: { uz: 'Gaplashishdan shikoyat yo\'q — jamoa guruhda yozishadi.', ru: 'На общение не жаловались — команда пишет в группе.' } },
  { k: 'kataklar', t: { uz: "Kun bo'yicha vaqt kataklari", ru: 'Ячейки времени по дням' }, q: 'qilamiz', sabab: { uz: "Bo'sh vaqtni aynan shu kataklar ko'rsatadi.", ru: 'Свободное время показывают именно эти ячейки.' } },
  { k: 'tolov', t: { uz: "To'lov", ru: 'Оплата' }, q: 'keyin', sabab: { uz: "Pul haqida bitta yozuv bor, lekin band qilish pulsiz ham ishlaydi.", ru: 'О деньгах одна запись, но бронь работает и без оплаты.' } },
  { k: 'royxat', t: { uz: "Egasi uchun bandlar ro'yxati", ru: 'Список броней для владельца' }, q: 'qilamiz', sabab: { uz: "Egasi bandlarni ko'rmasa, maydonni boshqaga berib yuborishi mumkin.", ru: 'Если владелец не видит брони, он может отдать поле другим.' } },
  { k: 'baho', t: { uz: 'Maydonga baho', ru: 'Оценка поля' }, q: 'qilmaymiz', sabab: { uz: "Besh yozuvda maydon sifatidan shikoyat yo'q.", ru: 'В пяти записях нет жалоб на качество поля.' } },
  { k: 'jamoa', t: { uz: "Jamoa yig'ish", ru: 'Сбор команды' }, q: 'keyin', sabab: { uz: "Jamoa haqida ikki yozuv bor, lekin bo'sh vaqtni busiz ham bilib, band qilsa bo'ladi.", ru: 'О команде две записи, но узнать и занять время можно и без этого.' } },
  { k: 'band', t: { uz: 'Katakni band qilish', ru: 'Занять ячейку' }, q: 'qilamiz', sabab: { uz: "Bo'sh vaqtni ko'rib band qila olmasa, kelguncha boshqa odam egallaydi.", ru: 'Если нельзя занять свободное время, пока идёшь, его займёт другой.' } },
  { k: 'eslatma', t: { uz: "Vaqt bo'shasa — eslatma", ru: 'Напоминание, когда время освободится' }, q: 'keyin', sabab: { uz: "Muammoga yordam beradi, lekin kataklar busiz ham bo'sh vaqtni ko'rsatadi.", ru: 'Помогает, но ячейки и без этого показывают свободное время.' } }
];

// Sanoq: ochilgan yozuvlardan shikoyat qatorlari (son bo'yicha saralanadi; teng bo'lsa — birinchi chiqqani tepada)
const sanoqQatorlar = (ochiq, yangi) => {
  const rows = [];
  SHIKOYATLAR.forEach(s => {
    const nuqta = YOZUVLAR.map(y => ochiq.includes(y.n) && y.sh.includes(s.k));
    const n = nuqta.filter(Boolean).length;
    if (!n) return;
    const bir = ochiq.findIndex(o => YOZUVLAR[o - 1].sh.includes(s.k));
    const yangiN = yangi && YOZUVLAR[yangi - 1].sh.includes(s.k) ? [yangi - 1] : [];
    rows.push({ k: s.k, t: s.t, nuqta, n, bir, yangiNuqta: yangiN, holat: yangiN.length ? 'hozir' : undefined, yangi: yangiN.length > 0 && n === 1 });
  });
  return rows.sort((a, b) => b.n - a.n || a.bir - b.bir);
};

// Muammo kartasi: kulrang yorliqlar + qiymat; yozilmoqda — bo'laklar ketma-ket o'zi yoziladi (4-ekran)
const MuammoKarta = ({ bolaklar, dalil, gap, yozilmoqda, kul, children }) => (
  <div className={cxx('im-mk', yozilmoqda && 'yoz', kul && 'kul')}>
    <div className="im-mk-b">
      {bolaklar.map((b, i) => <span key={i} className="im-mk-q" style={{ '--i': i }}><span className="im-mk-y">{b.y}</span><span className="im-mk-t">{b.t}</span></span>)}
    </div>
    {gap && <span className="im-mk-gap" style={{ '--i': bolaklar.length }}>«{gap}»</span>}
    {dalil && <span className="im-mk-d" style={{ '--i': bolaklar.length + (gap ? 1 : 0) }}>{dalil}</span>}
    {children}
  </div>
);
const MaydonMuammo = ({ yozilmoqda, kul }) => (
  <MuammoKarta yozilmoqda={yozilmoqda} kul={kul} bolaklar={MUAMMO_GAP.bolaklar.map(b => ({ y: tr(b.y), t: tr(b.t) }))} dalil={dalilMatn(MUAMMO_GAP.n)} />
);

// SanoqDoska — uch qavat: yozuvlar · shikoyatlar (+ muammo kartasi) · uch quti. Qavat prop berilmasa — chizilmaydi (bo'sh qavat yo'q, SABOQ 4).
// qatorlar: [{ k, t, nuqta[5], n, holat: 'hozir'|'kul'|'ok', nega, yangiNuqta[], yangi }] · qutilar: { qilamiz:[{t,holat}], …, joriy, xato }
const SanoqDoska = ({ nom, yozuvlar, yangiYozuv, qatorlar, muammo, qutilar, birlash, className }) => {
  const refs = useRef({});
  const pos = useRef({});
  // Qatorlar saralanganda silliq suriladi (FLIP); reduced-motion — darhol
  useLayoutEffect(() => {
    const harakat = !kamHarakat();
    Object.entries(refs.current).forEach(([k, el]) => {
      if (!el) { delete pos.current[k]; return; }
      const top = el.offsetTop; const old = pos.current[k];
      if (harakat && old !== undefined && old !== top) {
        el.style.transition = 'none'; el.style.transform = `translateY(${old - top}px)`;
        requestAnimationFrame(() => { el.style.transition = 'transform .45s cubic-bezier(.3,1.2,.4,1)'; el.style.transform = ''; });
      }
      pos.current[k] = top;
    });
  });
  const qatorBor = qatorlar && qatorlar.length > 0;
  return (
    <div className={cxx('im-doska', className)}>
      <span className="im-doska-nom">{nom}</span>
      {yozuvlar && <div className="im-yq" aria-label={tr({ uz: 'Yozuvlar', ru: 'Записи' })}>
        {[1, 2, 3, 4, 5].map(n => <span key={n} className={cxx('im-yq-n', yozuvlar.includes(n) && 'on', yangiYozuv === n && 'yangi')}>{n}</span>)}
      </div>}
      {(muammo || qatorBor) && <div className="im-sh">
        {muammo}
        {qatorBor && qatorlar.map(q => (
          <div key={q.k} ref={el => { refs.current[q.k] = el; }} className={cxx('im-sq', q.holat, q.yangi && 'yangi', birlash && q.k === 'telefon' && 'birlash')}>
            <span className="im-sq-t">«{tr(q.t)}»</span>
            <span className="im-nuq" aria-hidden="true">{q.nuqta.map((on, i) => <i key={i} className={cxx(on && 'on', q.yangiNuqta && q.yangiNuqta.includes(i) && 'yangi', birlash && q.k === 'band' && TELEFON_YOZUV.includes(i) && 'tushdi')} />)}</span>
            <span className="im-sq-n">{q.n} / 5</span>
            {q.nega && <span className="im-sq-nega"><b>{tr({ uz: 'Nega?', ru: 'Почему?' })}</b> {tr(q.nega)}</span>}
          </div>
        ))}
      </div>}
      {qutilar && <div className="im-qutilar">
        {QUTILAR.map(qt => {
          const el = qutilar[qt.k] || [];
          return (
            <div key={qt.k} className={cxx('im-quti', qutilar.joriy === qt.k && 'on', qutilar.xato === qt.k && 'xato')}>
              <span className="im-quti-h"><b>{tr(qt.t)}</b><span className="im-quti-n">{nechtaTa(el.length)}</span></span>
              <div className={cxx('im-quti-ichi', !el.length && 'bosh')}>
                {el.map((x, i) => <span key={`${x.t}-${i}`} className={cxx('im-quti-el', x.holat)}>{x.holat === 'ok' && <i>✓</i>}{x.t}</span>)}
              </div>
            </div>
          );
        })}
      </div>}
    </div>
  );
};

// Bitta yozuv-kartasi: «N-yozuv · o'yinchi» + odam aytgani (u aytganidek). belgi — shikoyat ostida kulrang chiziq va «? / 5» (0-ekran)
const YozuvKarta = ({ y, belgi, ajrat, qalin, className, children }) => (
  <div className={cxx('im-yk', className)}>
    <span className="im-yk-h">{yozuvNomi(y.n)}</span>
    <p className="im-yk-t">«{y.q.map((b, i) => b.s
      ? <span key={i} className={cxx('im-yk-sh', belgi && 'chiz', ajrat && 'ajrat', b.b && qalin && 'qalin')}>{tr(b.t)}{belgi && <span className="im-yk-s">? / 5</span>}</span>
      : <span key={i}>{tr(b.t)}</span>)}»</p>
    {children}
  </div>
);

// F-1005-85 (qat'iy, pilot naqshi): bashorat tanlangach karta yopilmaydi — ixcham qator natija (QTaxmin) chiqquncha turadi
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="im-kut"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="im-taxmin-q" role="status"><span className="im-taxmin-s">{savol}</span><span className="im-taxmin-b">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{(variantlar.find(v => v.k === tanlov) || {}).t}</b></span></div>);

// P-051: mashq yakuni ochilganda xulosaga silliq skroll (boshidan tugagan ekranda — yo'q)
const useXulosaSkroll = (on, boshdanTugagan) => {
  const bosh = useRef(!!boshdanTugagan);
  useEffect(() => {
    if (!on || bosh.current) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 400);
    return () => clearTimeout(t);
  }, [on]);
};
// 0 → N sanoq; reduced-motion — darhol
const useSanoq = (n, faol) => {
  const [v, setV] = useState(faol && !kamHarakat() ? 0 : n);
  useEffect(() => {
    if (!faol || kamHarakat()) { setV(n); return undefined; }
    let raf = 0; const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1600); setV(Math.round(n * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [n, faol]);
  return v;
};
// Bir qatordan to'rt qatorgacha o'sadigan matn maydoni (DE-175)
const GrowInput = ({ value, onChange, onEnter, className, ...p }) => {
  const ref = useRef(null);
  useLayoutEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 112)}px`; }, [value]);
  return <textarea ref={ref} rows={1} value={value} onChange={onChange} className={cxx('im-kirit', className)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && onEnter) { e.preventDefault(); onEnter(); } }} {...p} />;
};
// Taymer: boshlash · to'xtatish · ↻ yana (13-ekran, platforma standarti)
function Taymer({ soniya, matn, onTugadi, chorla, onBoshla }) {
  const [st, setSt] = useState({ yur: false, qoldi: soniya, tugadi: false });
  useEffect(() => { setSt({ yur: false, qoldi: soniya, tugadi: false }); }, [soniya]);
  useEffect(() => {
    if (!st.yur) return undefined;
    if (st.qoldi <= 0) { setSt({ yur: false, qoldi: 0, tugadi: true }); if (onTugadi) onTugadi(); return undefined; }
    const t = setTimeout(() => setSt(p => ({ ...p, qoldi: p.qoldi - 1 })), 1000);
    return () => clearTimeout(t);
  }, [st.yur, st.qoldi]); // eslint-disable-line
  const ulush = st.yur ? st.qoldi / soniya : (st.tugadi ? 0 : 1);
  return (
    <div className={cxx('im-taymer', st.yur && 'yur', st.tugadi && 'tugadi')}>
      <span className="im-taymer-son">{Math.floor(st.qoldi / 60)}:{String(st.qoldi % 60).padStart(2, '0')}</span>
      <span className="im-taymer-yol" aria-hidden="true"><i style={{ width: `${Math.round(ulush * 100)}%` }} /></span>
      {st.yur
        ? <QTugma ikkinchi onClick={() => setSt({ yur: false, qoldi: soniya, tugadi: false })}>{matn.toxtatish}</QTugma>
        : <QTugma ikkinchi className={chorla ? 'im-bos' : undefined} onClick={() => { setSt({ yur: true, qoldi: soniya, tugadi: false }); if (onBoshla) onBoshla(); }}>{st.tugadi ? matn.yana : matn.boshlash}</QTugma>}
    </div>
  );
}
// O'qituvchi eslatmasi — faqat mentor (proyektor) rejimida, bosib ochiladi
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
// 151-qonun: birinchi urinish nishoni — shart oldindan aytiladi (platforma yozuvi)
const AchRule = ({ screen }) => {
  const earned = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || (gate.live && gate.live.mode === 'mentor') || (earned && earned.has(ach))) return null;
  const lost = am.missed.has(sid);
  return <span className={cxx('ach-rule', lost && 'lost')}>{lost
    ? tr({ uz: 'Nishon birinchi urinish uchun edi — endi bemalol to\'g\'risini toping.', ru: 'Значок был за первую попытку — теперь спокойно найдите верный ответ.' })
    : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</span>;
};
// Jonli dars: hook ovozlari (J-026 — hammaga correct: false)
const OvozChizigi = ({ live, screen, variantlar, mening }) => {
  const [n, setN] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!pin) return undefined;
    let on = true, t = null;
    const tick = async () => {
      try { const rows = await liveAnswers(pin, screen); if (on) setN(variantlar.map((_, i) => rows.filter(r => r.picked === i).length)); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [pin, screen]); // eslint-disable-line
  if (!n) return null;
  const jami = n.reduce((a, b) => a + b, 0);
  return (
    <div className="im-ovoz fade-step" aria-label={tr({ uz: 'Jonli natija', ru: 'Живой результат' })}>
      {variantlar.map((v, i) => {
        const foiz = jami ? Math.round((n[i] / jami) * 100) : 0;
        return (
          <div key={i} className={cxx('im-ovoz-q', mening === i && 'men')}>
            <span className="im-ovoz-t">{v}</span>
            <span className="im-ovoz-yol"><i style={{ width: `${foiz}%` }} /></span>
            <span className="im-ovoz-n">{foiz}%</span>
          </div>
        );
      })}
    </div>
  );
};
// Jonli dars, kod ekrani: «Sinfda: N bajardi · N hali bajarmoqda» (signal 500+ zonasida)
const SinfSanoq = ({ live, screen }) => {
  const [d, setD] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!pin) return undefined;
    let on = true, t = null;
    const tick = async () => {
      try { const [pl, rows] = await Promise.all([livePlayers(pin), liveAnswers(pin, PRACTICE_BASE + screen)]); if (on) setD({ jami: pl.length, ok: new Set(rows.map(r => r.player_id)).size }); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [pin, screen]);
  if (!d) return null;
  return <p className="im-sinf">{tr({ uz: `Sinfda: ${d.ok} bajardi · ${Math.max(0, d.jami - d.ok)} hali bajarmoqda`, ru: `В классе: ${d.ok} выполнили · ${Math.max(0, d.jami - d.ok)} ещё выполняют` })}</p>;
};

// Bo'sh doska shakli (1-ekran): muammo qatori «? / 5» + uch quti; ichida matnsiz skelet-chiziqlar navbat bilan (P-015 — kashfiyot ochilmaydi)
const DoskaShakl = () => (
  <div className="im-doska im-shakl" aria-hidden="true">
    <div className="im-shakl-mq"><span className="im-sk" style={{ '--k': 0 }} /><span className="im-sk qisqa" style={{ '--k': 1 }} /><span className="im-sq-n">? / 5</span></div>
    <div className="im-qutilar">
      {QUTILAR.map((qt, i) => (
        <div key={qt.k} className="im-quti">
          <span className="im-quti-h"><b>{tr(qt.t)}</b></span>
          <div className="im-quti-ichi bosh">{[0, 1].map(j => <span key={j} className={cxx('im-sk', j && 'qisqa')} style={{ '--k': 2 + i * 2 + j }} />)}</div>
        </div>
      ))}
    </div>
  </div>
);

// ===== SCREEN 0 — KIRISH (QKirish: sof so'rovnoma, J-026 — hammaga correct: false, maqtov yo'q) =====
const HOOK_OPTS = [
  { id: 'qattiq', t: { uz: "Eng qattiq aytilganini — odam juda qiynalgan", ru: 'Самое резкое — человеку очень трудно' } },
  { id: 'kop', t: { uz: "Eng ko'p aytilganini — ko'p odam qiynalgan", ru: 'Самое частое — трудно многим' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const belgi = picked !== null || isMentor;
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('im-ekran', picked === null && !isMentor && 'im-kut')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Qaysi muammoni <A>birinchi hal qilardingiz?</A></>, ru: <>Какую проблему вы бы <A>решили первой?</A></> })}
          mentor={<Mentor>{tr({ uz: "«Maydon» uchun besh o'yinchi bilan intervyu qilindi — yozuvlar shu yerda. Uyga vazifadagi o'z yozuvlaringiz ham bugun kerak bo'ladi.", ru: 'Для «Maydon» провели интервью с пятью игроками — записи здесь. Сегодня понадобятся и ваши записи из домашнего задания.' })}</Mentor>}
          maket={<div className="im-kir">{YOZUVLAR.map(y => <YozuvKarta key={y.n} y={y} qalin belgi={belgi} className={y.n === 5 ? 'uzun' : undefined} />)}</div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
          javob={<>
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: "Ikkalasining ham sababi bor. Lekin yozuvning o'zi buni aytmaydi — avval har shikoyat nechta yozuvda borligini sanaymiz.", ru: 'У обоих вариантов есть причина. Но сама запись этого не скажет — сначала посчитаем, в скольких записях есть каждая жалоба.' })}</p>}
            {isLive && belgi && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        >
          <MentorNote>{tr({ uz: "Uyga vazifani qilmagan o'quvchilarga ayting: mustaqil ishda sinfdoshining yozuvlari bilan ishlaydi. Hook'da to'g'ri javob yo'q — ikkala tanlovni ham qo'llang.", ru: 'Скажите тем, кто не сделал домашнее задание: в самостоятельной работе они возьмут записи одноклассника. Здесь нет верного ответа — поддержите оба выбора.' })}</MentorNote>
        </QKirish>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD (QReja: chapda doskaning bo'sh shakli, o'ngda «01 · matn · teg») =====
const REJA = [
  { t: { uz: 'Besh yozuvdagi shikoyatlarni sanaysiz', ru: 'Посчитаете жалобы в пяти записях' }, teg: { uz: 'sanoq', ru: 'подсчёт' } },
  { t: { uz: "Eng ko'p chiqqanini bitta gapga yozasiz", ru: 'Самую частую запишете одной фразой' }, teg: { uz: 'muammo', ru: 'проблема' } },
  { t: { uz: 'Imkoniyatlarni uch qutiga ajratasiz', ru: 'Разложите возможности по трём коробкам' }, teg: { uz: 'MVP', ru: 'MVP' } },
  { t: { uz: 'Shikoyatlarni kod bilan sanaysiz', ru: 'Посчитаете жалобы кодом' }, teg: { uz: 'kod', ru: 'код' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun yozuvlardan <A>muammo va MVP ro'yxatini</A> tuzasiz</>, ru: <>Сегодня по записям составите <A>проблему и список MVP</A></> })}
      mentor={<Mentor>{tr({ uz: 'Besh yozuvda gap ko\'p, lekin birinchi versiya bitta muammoni hal qiladi.', ru: 'В пяти записях много всего, но первая версия решает одну проблему.' })}</Mentor>}
      chapYorliq={tr({ uz: "Dars oxirida o'z g'oyangiz uchun shu doskani to'ldirasiz", ru: 'В конце урока заполните эту доску для своей идеи' })}
      chap={<DoskaShakl />}
      ongYorliq={tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — BESH YOZUV (QTushuncha: bashorat → «Ochish» → shikoyatlar doskaga tushadi, sanaladi, saralanadi → xulosa; nishon patternSpotter) =====
// SABOQ 9: yozuvlar bittadan — oxirgi ochilgani to'liq, keyingisi «Ochish» bilan; natija doskaga ko'chadi
const S2_TAXMIN = [
  { k: '1', t: { uz: 'Bittasida', ru: 'В одной' } },
  { k: '23', t: { uz: 'Ikki-uchtasida', ru: 'В двух-трёх' } },
  { k: '45', t: { uz: "To'rt-beshtasida", ru: 'В четырёх-пяти' } }
];
const OCHISH = { uz: 'Ochish', ru: 'Открыть' };
const DOSKA_NOM = { uz: '"Maydon" · besh yozuv', ru: '«Maydon» · пять записей' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [ochiq, setOchiq] = useState(storedAnswer ? [1, 2, 3, 4, 5] : []);
  const [yangi, setYangi] = useState(null);
  const done = ochiq.length >= 5;
  const tugadi = useTugadi(done, 1500, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'exploration', screenIdx: screen, correct: true, picked: true, solved: true, taxmin }); }, [done]); // eslint-disable-line
  const och = () => { if (ochiq.length >= 5) return; const n = ochiq.length + 1; setOchiq([...ochiq, n]); setYangi(n); };
  const tx = S2_TAXMIN.find(x => x.k === taxmin);
  const variantlar = S2_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }));
  const oxirgi = yangi ? YOZUVLAR[yangi - 1] : null;
  const keyingi = YOZUVLAR[ochiq.length];
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · sanoq', ru: 'Понятие · подсчёт' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: "Avval o'zingiz belgilang", ru: 'Сначала отметьте сами' }) : tr({ uz: `Yozuvlarni oching (${ochiq.length}/5)`, ru: `Откройте записи (${ochiq.length}/5)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Bitta shikoyat <A>nechta yozuvda</A> chiqadi?</>, ru: <>В <A>скольких записях</A> встречается одна жалоба?</> })}
        mentor={<Mentor>{tr({ uz: 'Har intervyu — bitta odam bilan suhbat. Yozuvlarni birma-bir oching va doskaga qarang.', ru: 'Каждое интервью — разговор с одним человеком. Открывайте записи по одной и смотрите на доску.' })}</Mentor>}
        bashorat={!done && <Bashorat savol={tr({ uz: 'Pul haqidagi qattiq gap nechta yozuvda chiqadi?', ru: 'В скольких записях встретятся резкие слова о деньгах?' })} variantlar={variantlar} tanlov={taxmin} onTanla={setTaxmin} />}
        harakat={taxmin && <div className="im-s2-h">
          {oxirgi && <YozuvKarta key={oxirgi.n} y={oxirgi} ajrat className="kir" />}
          {keyingi && <div key={`k${keyingi.n}`} className="im-yk yopiq kir">
            <span className="im-yk-h">{yozuvNomi(keyingi.n)}</span>
            <QTugma className="im-bos" onClick={och}>{tr(OCHISH)}</QTugma>
          </div>}
        </div>}
        vizual={<SanoqDoska nom={tr(DOSKA_NOM)} yozuvlar={ochiq} yangiYozuv={yangi} qatorlar={sanoqQatorlar(ochiq, done && tugadi ? null : yangi)} />}
        natija={done && tx && <QTaxmin togri={taxmin === '1'}>{taxmin === '1'
          ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
          : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t).toLowerCase()} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: 'bittasida', ru: 'в одной' })}</b></>}</QTaxmin>}
        xulosa={tugadi && tr({ uz: "Bitta yozuvdagi gap bir odamniki. Ko'p yozuvda chiqqani — kuchli belgi; keyin uning og'irligini ham qaraymiz.", ru: 'Слова из одной записи — мнение одного человека. То, что встречается во многих записях, — сильный знак; потом оценим и его тяжесть.' })}
      >
        <MentorNote>{tr({ uz: "Sinfdan so'rang: «Qaysi yozuvni ochganda doska eng ko'p o'zgardi?» Javob — yangi qator chiqqanda emas, bor qatorga nuqta qo'shilganda.", ru: 'Спросите класс: «Какая запись сильнее всего изменила доску?» Ответ — не когда появилась новая строка, а когда к строке добавилась точка.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · bitta yozuv', ru: 'Проверка · одна запись' })}
    questionText="Bir o'yinchi qattiq shikoyat qildi — bu nima degani?"
    question={tr({ uz: <h2 className="title h-ask">Bir o'yinchi qattiq shikoyat qildi — <A>bu nima degani?</A></h2>, ru: <h2 className="title h-ask">Один игрок резко пожаловался — <A>что это значит?</A></h2> })}
    options={[
      { uz: 'Bu maydonning eng katta muammosi ekan', ru: 'Это самая большая проблема поля' },
      { uz: 'Bu hozircha faqat shu odamning gapi', ru: 'Пока это слова только этого человека' },
      { uz: 'Boshqa o\'yinchilar ham shunday o\'ylaydi', ru: 'Другие игроки думают так же' },
      { uz: 'Sayt aynan shu shikoyatdan boshlanadi', ru: 'Сайт начинается именно с этой жалобы' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Qattiq gap ham bitta yozuvda chiqsa, bir odamniki bo\'lib qoladi.', ru: 'Даже резкие слова из одной записи — мнение одного человека.' }}
    explainWrong={{
      0: { uz: 'Qattiq aytilgani — ko\'p odamda borligi emas.', ru: 'Резко сказано — не значит, что это есть у многих.' },
      2: { uz: 'Boshqalar nima degani — ularning yozuvlarida.', ru: 'Что сказали другие — в их записях.' },
      3: { uz: 'Bitta gapdan boshlansa, qolgan to\'rt kishi-chi?', ru: 'Если начать с одной фразы, а как же остальные четверо?' },
      default: { uz: 'Doskani eslang: qattiq gap nechta yozuvda chiqdi?', ru: 'Вспомните доску: в скольких записях были резкие слова?' }
    }} />
);

// ===== SCREEN 4 — IKKI SHIKOYAT — BITTA MUAMMO (QTushuncha: ikki qator «Nega?» → bashorat → qatorlar birlashadi → muammo kartasi o'zi yoziladi) =====
// «Muammo gapi» nomi shu yerda, karta yozilgandan keyin bir marta (PM-107)
const S4_TAXMIN = [
  { k: '3', t: { uz: '3 tasida', ru: 'в 3' } },
  { k: '4', t: { uz: '4 tasida', ru: 'в 4' } },
  { k: '7', t: { uz: '7 tasida', ru: 'в 7' } }
];
const S2_NATIJA = sanoqQatorlar([1, 2, 3, 4, 5], null);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [ochiq, setOchiq] = useState(storedAnswer ? ['band', 'telefon'] : []);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [faza, setFaza] = useState(storedAnswer ? 2 : 0); // 0 qatorlar · 1 birlashmoqda · 2 muammo kartasi
  useEffect(() => {
    if (!taxmin || faza !== 0) return undefined;
    setFaza(1);
    const t = setTimeout(() => setFaza(2), kamHarakat() ? 0 : 1400);
    return () => clearTimeout(t);
  }, [taxmin]); // eslint-disable-line
  const done = faza === 2;
  const tugadi = useTugadi(done, 3600, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'exploration', screenIdx: screen, correct: true, picked: true, solved: true, taxmin }); }, [done]); // eslint-disable-line
  const ikkala = ochiq.length >= 2;
  const qatorlar = S2_NATIJA
    .filter(q => faza < 2 || (q.k !== 'band' && q.k !== 'telefon'))
    .map(q => {
      const top = q.k === 'band' || q.k === 'telefon';
      return { ...q, yangiNuqta: [], yangi: false, holat: top && faza < 2 ? 'hozir' : 'kul', nega: top && faza === 0 && ochiq.includes(q.k) ? shikoyatNega(q.k) : null };
    });
  const tx = S4_TAXMIN.find(x => x.k === taxmin);
  const variantlar = S4_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }));
  const navLabel = done ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !ikkala ? tr({ uz: `① Ikki qatorni oching (${ochiq.length}/2)`, ru: `① Откройте две строки (${ochiq.length}/2)` })
    : tr({ uz: '② Taxminingizni belgilang', ru: '② Отметьте предположение' });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · muammo gapi', ru: 'Понятие · формулировка проблемы' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tugadi} label={tugadi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Ikki shikoyat ortida <A>qanday bitta muammo</A> bor?</>, ru: <>Какая <A>одна проблема</A> стоит за двумя жалобами?</> })}
        mentor={<Mentor>{tr({ uz: 'Ikki qatorni bosib, har biri nega bo\'lganini o\'qing.', ru: 'Нажмите на две строки и прочитайте, почему так случилось.' })}</Mentor>}
        harakat={<div className="im-s4-h">
          <div className={cxx('im-s4-tug', !ikkala && 'im-kut')}>
            {['band', 'telefon'].map(k => {
              const on = ochiq.includes(k);
              return <QChip key={k} holat={on ? 'ok' : undefined} disabled={on || !!taxmin} onClick={() => setOchiq(o => (o.includes(k) ? o : [...o, k]))}>«{tr(SHIKOYATLAR.find(s => s.k === k).t)}» <span className="im-ch-b">{on ? '✓' : '›'}</span></QChip>;
            })}
          </div>
          {ikkala && <Bashorat savol={tr({ uz: 'Ikki qator bitta muammoga qo\'shilsa, u nechta yozuvda bo\'ladi?', ru: 'Если две строки объединить в одну проблему, в скольких записях она будет?' })} variantlar={variantlar} tanlov={taxmin} onTanla={setTaxmin} />}
          {tx && done && <>
            <QTaxmin togri={taxmin === '4'}>{taxmin === '4'
              ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
              : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: '4 tasida', ru: 'в 4' })}</b></>}</QTaxmin>
            <QIzoh>{tr({ uz: 'Telefon haqida gapirgan uch kishi «band edi» ham degan — ular o\'sha to\'rt yozuvda.', ru: 'Трое, кто жаловался на телефон, сказали и «было занято» — они в тех же четырёх записях.' })}</QIzoh>
          </>}
        </div>}
        vizual={<SanoqDoska nom={tr(DOSKA_NOM)} birlash={faza === 1} qatorlar={qatorlar} muammo={done && <MaydonMuammo yozilmoqda={!storedAnswer} />} />}
        natija={tugadi && tx && <>
          <QTaxmin togri={taxmin === '4'}>{taxmin === '4'
            ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
            : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: '4 tasida', ru: 'в 4' })}</b></>}</QTaxmin>
          <QIzoh>{tr({ uz: 'Telefon haqida gapirgan uch kishi «band edi» ham degan — ular o\'sha to\'rt yozuvda.', ru: 'Трое, кто жаловался на телефон, сказали и «было занято» — они в тех же четырёх записях.' })}</QIzoh>
        </>}
        xulosa={tugadi && tr({ uz: "Ikki shikoyat bitta asosiy qiyinchilikni ko'rsatdi. Muammo gapi shuni aytadi — unda sayt ham, ilova ham yo'q.", ru: 'Две жалобы показали одну главную трудность. Формулировка проблемы говорит именно о ней — в ней нет ни сайта, ни приложения.' })}
      />
    </Stage>
  );
};
const shikoyatNega = (k) => (SHIKOYATLAR.find(s => s.k === k) || {}).nega;

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 3; ikkinchi olam — maktab oshxonasi, P-002) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · muammo gapi', ru: 'Проверка · формулировка проблемы' })}
    questionText="Oshxona haqidagi qaysi gap muammo gapi?"
    question={tr({ uz: <h2 className="title h-ask">Oshxona haqidagi qaysi gap <A>muammo gapi?</A></h2>, ru: <h2 className="title h-ask">Какая фраза о столовой — <A>формулировка проблемы?</A></h2> })}
    options={[
      { uz: 'Oshxonaga oldindan buyurtma ilovasi kerak', ru: 'Для столовой нужно приложение предзаказа' },
      { uz: 'Tanaffusda oshxonada odam juda ko\'p bo\'ladi', ru: 'На перемене в столовой очень много людей' },
      { uz: 'Menga oshxonadagi somsa umuman yoqmaydi', ru: 'Мне совсем не нравится самса в столовой' },
      { uz: 'O\'quvchilar tanaffusda ovqat ola olmaydi', ru: 'Ученики не успевают взять еду на перемене' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Gapda kim, qachon va nimadan qiynalgani bor — yechim yo\'q.', ru: 'В фразе есть кто, когда и с чем трудно — решения нет.' }}
    explainWrong={{
      0: { uz: 'Bu yechim — muammo gapida ilova bo\'lmaydi.', ru: 'Это решение — в формулировке проблемы нет приложения.' },
      1: { uz: 'Odam ko\'pligi rost, lekin kim nimadan qiynaldi?', ru: 'Людей много, но кому и с чем трудно?' },
      2: { uz: 'Bu bitta odamga yoqmagani, ko\'pchilikning muammosi emas.', ru: 'Это не нравится одному человеку, это не проблема многих.' },
      default: { uz: 'Muammo kartasini eslang: unda qanday uch bo\'lak bor edi?', ru: 'Вспомните карту проблемы: какие три части в ней были?' }
    }} />
);

// ===== SCREEN 6 — BURBN (QVoqea, PM-028: nuqtalar · slayd-karta · telefon maketi · 2 bashorat ballsiz, S-015) =====
// Manba (o'quvchi ko'rmaydi):
//   M. G. Siegler, «A Pivotal Pivot», TechCrunch, 2010-11-08 — https://techcrunch.com/?p=241149 (Systrom: Burbn'da «check in to locations, make plans,
//     earn points for hanging out with friends, post pictures»; «basically cut everything in the Burbn app except for its photo, comment, and like capabilities. What remained was Instagram»).
//   Wikipedia, «Instagram» (History) — https://en.wikipedia.org/wiki/Instagram (photo-sharing «had become a popular feature among its users»; 2010-10-06 App Store).
//   TechCrunch, 2010-12-21 — 1 million foydalanuvchi uch oydan kam vaqtda (MD: «uch oyga yetmay» — xavfsizroq ifoda).
// F-1005-81 (qaror A): kartaning gapini Mentor aytadi; sahnada — bosqich nomi va jonli maket. Bashorat kartasida Mentor va sahna oldingi kartadagidek (pre) — javob ochilmaydi.
// Logotip chizilmaydi (PM-028/029): «Instagram» nom-yorlig'i o'z rangida, faqat 5-kartada (sir-brend — ochilish qadamida).
const BURBN_IMK = [
  { k: 'joy', t: { uz: 'Joyni belgilash', ru: 'Отметить место' } },
  { k: 'reja', t: { uz: 'Uchrashuv rejasi', ru: 'План встречи' } },
  { k: 'ball', t: { uz: "Ball yig'ish", ru: 'Сбор баллов' } },
  { k: 'surat', t: { uz: 'Surat joylash', ru: 'Публикация фото' } }
];
const BURBN_B1 = [{ k: 'bir', t: { uz: 'Bittasidan', ru: 'Одной' } }, { k: 'ikki', t: { uz: 'Ikki-uchtasidan', ru: 'Двумя-тремя' } }, { k: 'tort', t: { uz: "To'rttalasidan", ru: 'Всеми четырьмя' } }];
const BURBN_B2 = [{ k: 'bir', t: { uz: 'Bittasini', ru: 'Одну' } }, { k: 'ikki', t: { uz: 'Ikki-uchtasini', ru: 'Две-три' } }, { k: 'tort', t: { uz: "To'rttalasini", ru: 'Все четыре' } }];
const BURBN_KARTA = [
  { h: { uz: 'Burbn', ru: 'Burbn' }, m: { uz: "Ikki kishi Burbn degan telefon ilovasini qildi. Unda do'stlar qayerdaligini belgilar, uchrashuv rejasini tuzar, uchrashgani uchun ball yig'ar va surat joylar edi.", ru: 'Двое сделали приложение для телефона под названием Burbn. В нём друзья отмечали, где они, планировали встречи, получали баллы за встречи и публиковали фото.' } },
  { b: 't1', savol: { uz: "Ishlatganlar ko'pincha nechta imkoniyatdan foydalandi?", ru: 'Сколькими возможностями чаще всего пользовались люди?' }, vs: BURBN_B1, haqiqat: { uz: 'bittasidan — surat joylashdan', ru: 'одной — публикацией фото' } },
  { h: { uz: 'Odamlar nima qildi', ru: 'Что делали люди' }, m: { uz: "Ikkalasi odamlar ilovada nima qilayotganini kuzatdi. Jamoa odamlar surat joylashga ko'proq tortilayotganini ko'rdi.", ru: 'Двое наблюдали, что люди делают в приложении. Команда увидела, что людей больше тянет публиковать фото.' } },
  { b: 't2', savol: { uz: "Jamoa to'rt imkoniyatdan nechtasini qoldirdi?", ru: 'Сколько из четырёх возможностей оставила команда?' }, vs: BURBN_B2, haqiqat: { uz: 'bittasini', ru: 'одну' } },
  { h: { uz: 'Qaror', ru: 'Решение' }, m: { uz: 'Jamoa suratdan boshqa hamma narsani olib tashladi: surat, unga izoh va layk qoldi. Ilovaga yangi nom berildi — Instagram.', ru: 'Команда убрала всё, кроме фото: остались фото, комментарии к нему и лайки. Приложению дали новое имя — Instagram.' } },
  { h: { uz: '2010-yil 6-oktabr', ru: '6 октября 2010 года' }, m: { uz: "Instagram chiqdi. Uch oyga yetmay unda bir million odam ro'yxatdan o'tdi.", ru: 'Instagram вышел. Меньше чем за три месяца в нём зарегистрировался миллион человек.' } }
];
// Chizilgan belgilar (emoji emas): joy · reja · ball · surat · layk · izoh
const BurbnBelgi = ({ k }) => (
  <svg className="im-bb" viewBox="0 0 24 24" aria-hidden="true">
    {k === 'joy' && <path d="M12 21s-6.5-6.2-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.8-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />}
    {k === 'reja' && <><rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>}
    {k === 'ball' && <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8Z" />}
    {k === 'surat' && <><rect x="3.5" y="7" width="17" height="12.5" rx="2.5" /><path d="M8.5 7l1.6-2.5h3.8L15.5 7" /><circle cx="12" cy="13.2" r="3.2" /></>}
    {k === 'layk' && <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />}
    {k === 'izoh' && <path d="M4.5 6.5h15v9.5h-8l-4.5 3.5V16h-2.5Z" />}
  </svg>
);
// Sahna: b — karta indeksi (0…5). 0–1: to'rt qatorli menyu · 2–3: «Surat joylash» ajraladi, odamlar unga oqadi · 4: uch qator chizilib yo'qoladi, surat-izoh-layk qoladi, nom → Instagram · 5: sana va 1 000 000
const BurbnSahna = ({ b }) => {
  const insta = b >= 4;
  const son = useSanoq(1000000, b === 5);
  return (
    <div className={`im-bs b${b}`} role="img" aria-label={insta ? 'Instagram' : 'Burbn'}>
      <div className="im-tel">
        <span className="im-tel-kesik" />
        <div className="im-tel-ekran">
          <span key={insta ? 'i' : 'b'} className={cxx('im-tel-nom', insta && 'insta')}>{insta ? 'Instagram' : 'Burbn'}</span>
          {!insta && <div className="im-bm">
            {BURBN_IMK.map((m, i) => (
              <div key={m.k} className={cxx('im-bm-q', b >= 2 && (m.k === 'surat' ? 'ajr' : 'xira'))} style={{ '--i': i }}>
                <BurbnBelgi k={m.k} /><span>{tr(m.t)}</span>
                {b >= 2 && m.k === 'surat' && <span className="im-bm-oqim" aria-hidden="true">{[0, 1, 2, 3, 4].map(j => <i key={j} style={{ '--j': j }} />)}</span>}
              </div>
            ))}
          </div>}
          {insta && <div className="im-ig">
            <div className="im-bm ket">{BURBN_IMK.filter(m => m.k !== 'surat').map((m, i) => <div key={m.k} className="im-bm-q chiz" style={{ '--i': i }}><BurbnBelgi k={m.k} /><span>{tr(m.t)}</span></div>)}</div>
            <div className="im-ig-post">
              <span className="im-ig-surat"><i className="quyosh" /><i className="tog" /><i className="tog2" /></span>
              <span className="im-ig-amal"><BurbnBelgi k="layk" /><BurbnBelgi k="izoh" /></span>
              <span className="im-ig-iz"><b /><i /></span>
            </div>
            <span className="im-ig-yorliq">{tr({ uz: 'Surat · Izoh · Layk', ru: 'Фото · Комментарий · Лайк' })}</span>
          </div>}
        </div>
      </div>
      {b === 4 && <span className="im-bs-izoh">{tr({ uz: 'Instagram — surat va video joylanadigan ilova.', ru: 'Instagram — приложение, где публикуют фото и видео.' })}</span>}
      {b === 5 && <div className="im-bs-sana">
        <span className="im-bs-sana-t">{tr({ uz: '2010 · 6-oktabr', ru: '2010 · 6 октября' })}</span>
        <span className="im-bs-son"><span>{tr({ uz: '3 oyga yetmay', ru: 'меньше 3 месяцев' })}</span><b>{fmtSon(son)}</b></span>
      </div>}
    </div>
  );
};
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 5 : 0);
  const [tx, setTx] = useState(() => storedAnswer?.taxmin || {});
  const done = b >= 5;
  const k = BURBN_KARTA[b];
  const kutish = !!k.b && !tx[k.b];
  useXulosaSkroll(done, storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin: tx }); }, [done]); // eslint-disable-line
  const keyingi = () => { if (b < 5) setB(b + 1); else onNext(); };
  // Bashorat kartasida sahna va Mentor oldingi kartadagidek (pre)
  const sahnaB = k.b ? b - 1 : b;
  const mk = BURBN_KARTA[sahnaB];
  const yorliq = `Burbn · ${b + 1}/6`;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={kutish ? tr({ uz: "Avval o'zingiz belgilang", ru: 'Сначала отметьте сами' }) : b < 5 ? `${tr({ uz: 'Keyingi', ru: 'Дальше' })} (${b + 1}/6)` : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <>Ko'p imkoniyatli ilovadan <A>nima qoldi?</A></>, ru: <>Что осталось от <A>приложения со многими возможностями?</A></> })}
        nuqtalar={<>
          <Mentor key={`m${sahnaB}`}>{tr(mk.m)}</Mentor>
          <div className="im-nuqtalar"><span className="im-nuq-l">{yorliq}</span>{BURBN_KARTA.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="im-voqea" key={b}>
          {!k.b && <span className="im-voqea-h">{tr(k.h)}</span>}
          <Zoomable><BurbnSahna b={sahnaB} /></Zoomable>
          {k.b && !tx[k.b] && <Bashorat savol={tr(k.savol)} variantlar={k.vs.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={tx[k.b] ?? null} onTanla={(v) => setTx(o => ({ ...o, [k.b]: v }))} />}
          {k.b && tx[k.b] && <QTaxmin togri={tx[k.b] === 'bir'}>{tx[k.b] === 'bir'
            ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
            : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(k.vs.find(x => x.k === tx[k.b]).t).toLowerCase()} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(k.haqiqat)}</b></>}</QTaxmin>}
          {done && <QXulosa>{tr({ uz: "Bu misolda jamoa odamlar ko'p qilgan bitta ishni qoldirdi, qolganini olib tashladi.", ru: 'В этом примере команда оставила одно дело, которое люди делали чаще всего, остальное убрала.' })}</QXulosa>}
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 0) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · Burbn qarori', ru: 'Проверка · решение Burbn' })}
    questionText="Burbn jamoasi suratni nega qoldirdi?"
    question={tr({ uz: <h2 className="title h-ask">Burbn jamoasi suratni <A>nega qoldirdi?</A></h2>, ru: <h2 className="title h-ask">Почему команда Burbn <A>оставила фото?</A></h2> })}
    options={[
      { uz: 'Odamlar ilovada shunga ko\'p tortilardi', ru: 'Людей в приложении больше тянуло к этому' },
      { uz: 'Jamoaning o\'zi suratni yaxshi ko\'rardi', ru: 'Команде самой нравились фото' },
      { uz: 'Suratni qurish eng kam vaqt olgan edi', ru: 'Фото было быстрее всего сделать' },
      { uz: 'Bitta foydalanuvchi shuni so\'ragan edi', ru: 'Об этом попросил один пользователь' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Jamoa odamlar ilovada ko\'pincha nima qilganiga qaradi.', ru: 'Команда смотрела, что люди чаще всего делали в приложении.' }}
    explainWrong={{
      1: { uz: 'Voqeani eslang: jamoa kimni kuzatdi?', ru: 'Вспомните историю: за кем наблюдала команда?' },
      2: { uz: 'Voqeada vaqt haqida gap bo\'lmadi — jamoa nimaga qaradi?', ru: 'В истории не было речи о времени — на что смотрела команда?' },
      3: { uz: 'Bitta odam so\'ragani — bir kishining gapi.', ru: 'Просьба одного человека — мнение одного.' },
      default: { uz: 'Uchinchi kartani eslang: odamlar ilovada nima qilardi?', ru: 'Вспомните третью карточку: что люди делали в приложении?' }
    }} />
);

// ===== SCREEN 8 — SIZNING MUAMMO GAPINGIZ (QMustaqil, USTAXONA 1): shikoyatlar sanog'i → kim → qachon va nimadan · artefakt pm-m7d3-muammo · nishon problemWriter =====
const S8_QADAM = [{ uz: 'Shikoyatlar', ru: 'Жалобы' }, { uz: 'Kim', ru: 'Кто' }, { uz: 'Qachon va nimadan qiynaladi', ru: 'Когда и с чем трудно' }];
const XABAR8 = {
  yechim: { uz: 'Bu yechim. Odam nimadan qiynalishini yozing.', ru: 'Это решение. Напишите, с чем человеку трудно.' },
  hamma: { uz: '«Hamma» — juda keng. Yozuvlarda kim gapirgan edi?', ru: '«Все» — слишком широко. Кто говорил в записях?' },
  bir: { uz: "Bu bitta yozuvda chiqdi — ko'proq yozuvda chiqqanini oling.", ru: 'Это было в одной записи — возьмите то, что встречалось чаще.' },
  qisqa: { uz: "Qisqa qoldi: to'liq yozing.", ru: 'Слишком коротко: напишите полностью.' }
};
const RE_YECHIM8 = /(^|[^a-z'\u0430-\u044f])(sayt|ilova|bot|kerak|\u0441\u0430\u0439\u0442|\u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438|\u0431\u043e\u0442|\u043d\u0443\u0436\u043d)/;
const RE_HAMMA = /(^|\s)(hamma|\u0432\u0441\u0435)(\s|[.,!?]|$)/;
const s8Tekshir = (qadam, v, n) => {
  const s = norm(v);
  if (qadam === 1 && RE_HAMMA.test(s)) return 'hamma';
  if (qadam === 1 && s.length < 4) return 'qisqa';
  if (qadam === 2 && RE_YECHIM8.test(s)) return 'yechim';
  if (qadam === 2 && n === 1) return 'bir';
  if (qadam === 2 && s.length < 12) return 'qisqa';
  return null;
};
// O'quvchining doskasi: qatorlar son bo'yicha; nuqtalar — n tasi bo'yalgan (qaysi yozuvda — o'quvchining o'zi biladi)
const ozQatorlar = (sh) => sh.map((x, i) => ({ k: `o${i}-${x.t}`, t: x.t, n: x.n, nuqta: [0, 1, 2, 3, 4].map(j => j < x.n), bir: i, yangiNuqta: [] })).sort((a, b) => b.n - a.n || a.bir - b.bir);
const ozGap = (m) => `${m.kim.trim()} ${m.nima.trim().replace(/[.!]+$/, '')}.`;
const ozMuammo = (m, kul) => m && m.kim && m.nima && (
  <MuammoKarta kul={kul} bolaklar={[{ y: tr({ uz: 'kim', ru: 'кто' }), t: m.kim }, { y: tr({ uz: 'qachon va nimadan qiynaladi', ru: 'когда и с чем трудно' }), t: m.nima }]} dalil={dalilMatn(m.n)} />
);
const DOSKAM = { uz: 'Doskam', ru: 'Моя доска' };
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [saved] = useState(() => { const v = lsGet(KEY_MUAMMO); return v && Array.isArray(v.shikoyatlar) && v.kim && v.nima ? v : null; });
  const [sh, setSh] = useState(() => (saved ? saved.shikoyatlar : []));
  const [kim, setKim] = useState(() => (saved ? saved.kim : ''));
  const [nima, setNima] = useState(() => (saved ? saved.nima : ''));
  const [n, setN] = useState(() => (saved ? saved.n : null));
  const [qadam, setQadam] = useState(() => (saved ? 3 : 0));
  const [shMatn, setShMatn] = useState('');
  const [shN, setShN] = useState(null);
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const done = qadam >= 3;
  useXulosaSkroll(done, storedAnswer || saved);
  const engKop = sh.reduce((m, x) => Math.max(m, x.n), 0);
  const qosh = () => {
    const t = shMatn.trim();
    if (!t || !shN || sh.length >= 5) return;
    if (norm(t).length < 6 && !(xato && xato.tur === 'qisqa' && xato.v === t)) { setXato({ tur: 'qisqa', v: t }); return; }
    setXato(null); setSh([...sh, { t, n: shN }]); setShMatn(''); setShN(null);
  };
  const saqla = () => {
    if (qadam === 0) { if (sh.length < 2) return; setXato(null); setQadam(1); return; }
    const v = qadam === 1 ? kim : nima;
    const nn = n ?? engKop;
    if (!v.trim()) return;
    const tur = s8Tekshir(qadam, v, nn);
    if (tur && !(xato && xato.tur === tur && xato.v === v)) { setXato({ tur, v }); return; }
    setXato(null);
    if (qadam === 1) { setQadam(2); if (n == null) setN(engKop); return; }
    const m = { shikoyatlar: sh, kim: kim.trim(), nima: nima.trim(), n: nn };
    setN(nn); lsSet(KEY_MUAMMO, m); setQadam(3);
    if (storedAnswer === undefined) {
      onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'muammo', correct: true, picked: true, solved: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const tahrirla = () => { setQadam(0); setXato(null); };
  const qMatn = qadam === 1 ? kim : nima;
  const qSet = qadam === 1 ? setKim : setNima;
  const ipucha = qadam === 1 ? { uz: 'Kim qiynaladi?', ru: 'Кому трудно?' } : { uz: 'Qachon va nimadan qiynaladi?', ru: 'Когда и с чем трудно?' };
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : qadam === 0 ? tr({ uz: "① Kamida ikki shikoyat qo'shing", ru: '① Добавьте хотя бы две жалобы' })
    : qadam === 1 ? tr({ uz: '② Kim qiynalishini yozing', ru: '② Напишите, кому трудно' })
    : tr({ uz: '③ Nimadan qiynalishini yozing', ru: '③ Напишите, с чем трудно' });
  const m = { kim, nima, n: n ?? engKop };
  const forma = (
    <div className="q-karta im-forma">
      {qadam === 0 && <>
        <span className="q-yorliq">{tr({ uz: 'Shikoyat', ru: 'Жалоба' })}</span>
        <GrowInput value={shMatn} onChange={e => setShMatn(e.target.value)} onEnter={qosh} placeholder={tr({ uz: 'Odam aytgan shikoyat…', ru: 'Жалоба, которую сказал человек…' })} maxLength={120} aria-label={tr({ uz: 'Shikoyat', ru: 'Жалоба' })} />
        <div className="im-nechta">
          <span className="im-nechta-l">{tr({ uz: 'Nechta yozuvda?', ru: 'В скольких записях?' })}</span>
          <div className="im-nechta-t">{[1, 2, 3, 4, 5].map(k => <QChip key={k} holat={shN === k ? 'on' : undefined} onClick={() => setShN(k)}>{k}</QChip>)}</div>
          <QTugma ikkinchi className={shMatn.trim() && shN && sh.length < 5 ? 'im-bos' : undefined} disabled={!shMatn.trim() || !shN || sh.length >= 5} onClick={qosh}>{tr(QOSHISH)}</QTugma>
        </div>
      </>}
      {qadam > 0 && <>
        <span className="q-yorliq">{tr(ipucha)}</span>
        <GrowInput key={qadam} value={qMatn} onChange={e => qSet(e.target.value)} onEnter={saqla} placeholder={tr(ipucha)} maxLength={140} aria-label={tr(ipucha)} />
        {qadam === 2 && <div className="im-nechta">
          <span className="im-nechta-l">{tr({ uz: '5 yozuvdan', ru: 'Из 5 записей' })}</span>
          <div className="im-nechta-t">{[1, 2, 3, 4, 5].map(k => <QChip key={k} holat={(n ?? engKop) === k ? 'on' : undefined} onClick={() => setN(k)}>{k}</QChip>)}</div>
          <span className="im-nechta-l">{tr({ uz: 'tasida', ru: 'раз' })}</span>
        </div>}
      </>}
      {xato && <div className="im-xato"><QXato>{tr(XABAR8[xato.tur])}</QXato><QIzoh>{tr(QOLDIR)}</QIzoh></div>}
      <div className="im-amal">
        <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)} {yordam ? '▾' : '▸'}</QTugma>
        <QTugma className={(qadam === 0 ? sh.length >= 2 : qMatn.trim()) ? 'im-bos' : undefined} disabled={qadam === 0 ? sh.length < 2 : !qMatn.trim()} onClick={saqla}>{tr(SAQLASH)}</QTugma>
      </div>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Besh yozuvingiz <A>qaysi muammoni</A> aytyapti?</>, ru: <>О какой <A>проблеме</A> говорят ваши пять записей?</> })}
        mentor={<Mentor>{tr({ uz: "Uyga vazifadagi besh yozuvingizni oching; yo'q bo'lsa, sinfdoshingiznikini oling. Avval sanang, so'ng yozing.", ru: 'Откройте пять своих записей из домашнего задания; если их нет — возьмите записи одноклассника. Сначала посчитайте, потом пишите.' })}</Mentor>}
        qadamlar={!done && !isMentor && <div className="im-bosq">{S8_QADAM.map((x, i) => <span key={i} className={cxx('im-qchip', i === qadam && 'on', i < qadam && 'ok')}>{i < qadam ? '✓' : i + 1} {tr(x)}</span>)}</div>}
        forma={isMentor
          ? <SanoqDoska nom={tr(DOSKA_NOM)} qatorlar={S2_NATIJA.filter(q => q.k !== 'band' && q.k !== 'telefon').map(q => ({ ...q, holat: 'kul' }))} muammo={<MaydonMuammo />} />
          : !done && forma}
        yordam={!done && !isMentor && yordam && <QIzoh>{tr({ uz: "Yozuvlarni birma-bir o'qing va har shikoyat yoniga chiziqcha qo'ying. Ikki shikoyat bitta asosiy qiyinchilikni ko'rsatsa, ularni bitta qatorga yozing.", ru: 'Прочитайте записи по одной и ставьте чёрточку у каждой жалобы. Если две жалобы показывают одну главную трудность — запишите их одной строкой.' })}</QIzoh>}
      >
        {!isMentor && (sh.length > 0 || done) && <div className={cxx('im-ozdoska', done && 'q-fokus')}>
          <SanoqDoska nom={tr(DOSKAM)} qatorlar={ozQatorlar(sh)} muammo={done && ozMuammo(m)} />
          {done && <p className="im-yiggap">«{ozGap(m)} {tr({ uz: `5 yozuvdan ${m.n} tasida chiqdi.`, ru: `Встретилось в ${m.n} записях из 5.` })}»</p>}
          {done && <div className="im-amal"><QTugma ikkinchi onClick={tahrirla}>{tr(TAHRIR)}</QTugma></div>}
        </div>}
        {isMentor && <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Muammo gapini yozganlar', ru: 'Написали формулировку проблемы' }} />}
        {done && !isMentor && <QXulosa>{tr({ uz: 'Muammo gapingiz saqlandi — imkoniyatlar endi shu gapga qarab tanlanadi.', ru: 'Формулировка проблемы сохранена — теперь возможности выбираются по ней.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Yozuvi yo'q o'quvchini yozuvi bor sherigi bilan juftlang — bitta yozuvlar to'plami, ikki muammo gapi. Ikki shikoyatni birlashtirgan o'quvchidan qaysi qiyinchilik ularni birlashtirganini so'rang.", ru: 'Ученика без записей посадите с партнёром, у которого они есть: один набор записей — две формулировки. Тех, кто объединил две жалобы, спросите, какая трудность их объединила.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 9 — UCH QUTI (QTushuncha, mashq: sakkiz imkoniyat bittadan → quti; xato bo'lsa quti qizil, karta o'z qutisiga ko'chadi; nishon scopeKeeper — birinchi urinish) =====
const S9_JAVOB = {
  ok: { uz: 'Shu qutida turadi.', ru: 'Стоит в этой коробке.' },
  kerakQilamiz: { uz: "Busiz muammo hal bo'lmaydi — u MVP'da kerak.", ru: 'Без этого проблема не решится — это нужно в MVP.' },
  emasQilamiz: { uz: "Muammo busiz ham hal bo'ladi — MVP'ga shart emas.", ru: 'Проблема решится и без этого — в MVP не обязательно.' },
  kerakKeyin: { uz: "Yozuvlarda bunga sabab bor — o'chirmang, keyinga suring.", ru: 'В записях есть причина — не удаляйте, отложите на потом.' },
  kerakQilmaymiz: { uz: 'Besh yozuvda bunga sabab topilmadi.', ru: 'В пяти записях причины для этого не нашлось.' }
};
const s9Javob = (kerak, tanlov) => (kerak === tanlov ? 'ok' : kerak === 'qilamiz' ? 'kerakQilamiz' : tanlov === 'qilamiz' ? 'emasQilamiz' : kerak === 'keyin' ? 'kerakKeyin' : 'kerakQilmaymiz');
const IkkiSavol = () => <ol className="im-ikki">{IKKI_SAVOL.map((s, i) => <li key={i}><i>{i + 1}</i><span>{tr(s)}</span></li>)}</ol>;
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [i, setI] = useState(storedAnswer ? IMKONIYATLAR.length : 0);
  const [joy, setJoy] = useState(() => (storedAnswer ? IMKONIYATLAR.map(m => m.k) : []));
  const [javob, setJavob] = useState(null); // { tanlov, tur }
  const [xatoBor, setXatoBor] = useState(false);
  const [qizil, setQizil] = useState(null);
  const done = i >= IMKONIYATLAR.length;
  const tugadi = useTugadi(done, 600, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  useEffect(() => { if (!qizil) return undefined; const t = setTimeout(() => setQizil(null), 900); return () => clearTimeout(t); }, [qizil]);
  const m = IMKONIYATLAR[i];
  const tanla = (q) => {
    if (!m || javob) return;
    const tur = s9Javob(m.q, q);
    setJavob({ tanlov: q, tur });
    setJoy(j => [...j, m.k]);
    if (tur !== 'ok') { setQizil(q); if (!xatoBor) { setXatoBor(true); if (achMiss) achMiss.miss(screen); } }
  };
  const keyingi = () => {
    const n = i + 1; setJavob(null); setI(n);
    if (n >= IMKONIYATLAR.length && storedAnswer === undefined) {
      const first = !xatoBor && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
      onAnswer(screen, { stage: 'mashq', screenIdx: screen, practice: 'qutilar', correct: first, firstAttemptCorrect: first, picked: true, solved: true });
    }
  };
  const qutilar = Object.fromEntries(QUTILAR.map(q => [q.k, IMKONIYATLAR.filter(x => x.q === q.k && joy.includes(x.k)).map(x => ({ t: tr(x.t), holat: !done && m && javob && x.k === m.k ? 'yangi' : 'ok' }))]));
  qutilar.xato = qizil;
  const nechta = joy.length;
  return (
    <Stage eyebrow={tr({ uz: 'Mashq · MVP chegarasi', ru: 'Упражнение · граница MVP' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tugadi} label={tugadi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Imkoniyatlarni qutilarga qo'ying (${nechta}/8)`, ru: `Разложите возможности по коробкам (${nechta}/8)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Maydonning birinchi versiyasiga <A>nima kiradi?</A></>, ru: <>Что войдёт в <A>первую версию</A> Maydon?</> })}
        mentor={<Mentor>{tr({ uz: "«Qilamiz» qutisi — MVP: mahsulotning ish beradigan eng sodda birinchi versiyasi. Ikki savol — bugun birinchi versiyani kichik saqlash uchun; universal qoida emas.", ru: 'Коробка «Делаем» — это MVP: самая простая работающая первая версия продукта. Два вопроса — чтобы сегодня первая версия осталась маленькой; это не универсальное правило.' })}</Mentor>}
        harakat={m && <div className="im-s9-h">
          <IkkiSavol />
          <div key={m.k} className="q-karta im-imk kir">
            <span className="im-imk-n">{i + 1} / 8</span>
            <span className="im-imk-t">{tr(m.t)}</span>
            {!javob && <div className="im-s9-tug im-kut">{QUTILAR.map(q => <QTugma key={q.k} ikkinchi onClick={() => tanla(q.k)}>{tr(q.t)}</QTugma>)}</div>}
            {javob && <>
              <span className={cxx('im-imk-j', javob.tur === 'ok' ? 'ok' : 'xato')}>{javob.tur === 'ok' ? '✓' : '✗'} {qutiNomi(javob.tanlov)}{javob.tur !== 'ok' && <> → <b>{qutiNomi(m.q)}</b></>}</span>
              {javob.tur === 'ok' ? <QIzoh>{tr(S9_JAVOB.ok)}</QIzoh> : <QXato>{tr(S9_JAVOB[javob.tur])}</QXato>}
              <span className="im-imk-sabab">{tr(m.sabab)}</span>
              <div className="im-amal"><QTugma className="im-bos" onClick={keyingi}>{i < IMKONIYATLAR.length - 1 ? tr({ uz: 'Keyingi imkoniyat →', ru: 'Следующая возможность →' }) : tr({ uz: "Qutilarni ko'rish", ru: 'Посмотреть коробки' })}</QTugma></div>
            </>}
          </div>
          {xatoBor && <QIzoh>{tr({ uz: "Ikki savolni tartib bilan bering: avval — busiz muammo hal bo'ladimi? «Ha» bo'lsa — yozuvlarda unga sabab bormi?", ru: 'Задавайте два вопроса по порядку: сначала — решится ли проблема без этого? Если «да» — есть ли для этого причина в записях?' })}</QIzoh>}
          <AchRule screen={screen} />
        </div>}
        vizual={<SanoqDoska nom={tr(DOSKA_NOM)} muammo={<MaydonMuammo />} qutilar={qutilar} />}
        xulosa={tugadi && tr({ uz: "Bu misolda MVP'ga uchta imkoniyat kirdi: ularsiz muammo hal bo'lmaydi.", ru: 'В этом примере в MVP вошли три возможности: без них проблема не решится.' })}
      >
        {tugadi && <QIzoh>{tr({ uz: "«Keyin» — «Dekompozitsiya» darsidagi keyinga qoldirilganlar: hech narsa o'chirilmaydi, navbati suriladi.", ru: '«Потом» — это отложенное из урока «Декомпозиция»: ничего не удаляется, очередь сдвигается.' })}</QIzoh>}
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 10 — SIZNING UCH QUTINGIZ (QMustaqil, USTAXONA 2): «Qilamiz · Keyin · Qilmaymiz» · artefakt pm-m7d3-mvp =====
const S10_IPUCHA = {
  qilamiz: { uz: "Qaysi imkoniyatsiz muammo hal bo'lmaydi?", ru: 'Без какой возможности проблема не решится?' },
  keyin: { uz: "Qaysi imkoniyat keyin kerak bo'ladi?", ru: 'Какая возможность понадобится потом?' },
  qilmaymiz: { uz: "Yozuvlarda qaysi imkoniyatga sabab yo'q?", ru: 'Для какой возможности нет причины в записях?' }
};
const XABAR10 = {
  takror: { uz: 'Bu imkoniyat boshqa qutida bor — bittasini tanlang.', ru: 'Эта возможность уже есть в другой коробке — выберите одну.' },
  boshSoz: { uz: 'Bu hali imkoniyat emas: mahsulot nima qila olsin?', ru: 'Это ещё не возможность: что должен уметь продукт?' },
  qisqa: { uz: "Qisqa qoldi: imkoniyatni to'liq yozing.", ru: 'Слишком коротко: напишите возможность полностью.' }
};
const RE_BOSH_SOZ = /^(yaxshi|chiroyli|qulay|\u043a\u0440\u0430\u0441\u0438\u0432\S*|\u0443\u0434\u043e\u0431\u043d\S*|\u0445\u043e\u0440\u043e\u0448\S*)[.!]?$/;
const s10Tekshir = (v, qutilar, joriy) => {
  const s = norm(v);
  if (QUTILAR.some(q => q.k !== joriy && (qutilar[q.k] || []).some(x => norm(x) === s))) return 'takror';
  if (RE_BOSH_SOZ.test(s)) return 'boshSoz';
  if (s.length < 4) return 'qisqa';
  return null;
};
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [muammo] = useState(() => lsGet(KEY_MUAMMO));
  const [saved] = useState(() => { const v = lsGet(KEY_MVP); return v && QUTILAR.every(q => Array.isArray(v[q.k]) && v[q.k].length) ? v : null; });
  const [qt, setQt] = useState(() => (saved ? { qilamiz: saved.qilamiz, keyin: saved.keyin, qilmaymiz: saved.qilmaymiz } : { qilamiz: [], keyin: [], qilmaymiz: [] }));
  const [qadam, setQadam] = useState(() => (saved ? 3 : 0));
  const [val, setVal] = useState('');
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const done = qadam >= 3;
  useXulosaSkroll(done, storedAnswer || saved);
  const joriy = QUTILAR[Math.min(qadam, 2)].k;
  const qosh = () => {
    const v = val.trim(); if (!v) return;
    const tur = s10Tekshir(v, qt, joriy);
    if (tur && !(xato && xato.tur === tur && xato.v === v)) { setXato({ tur, v }); return; }
    setXato(null); setQt(o => ({ ...o, [joriy]: [...o[joriy], v] })); setVal('');
  };
  const saqla = () => {
    if (!qt[joriy].length) return;
    setXato(null); setVal('');
    if (qadam < 2) { setQadam(qadam + 1); return; }
    lsSet(KEY_MVP, qt); setQadam(3);
    if (storedAnswer === undefined) {
      onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'mvp', correct: true, picked: true, solved: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : qadam === 0 && !qt.qilamiz.length ? tr({ uz: '① «Qilamiz»ga imkoniyat yozing', ru: '① Впишите возможность в «Делаем»' })
    : tr({ uz: `② Yana ${3 - qadam} quti qoldi`, ru: `② Осталось коробок: ${3 - qadam}` });
  const doskaQutilar = { ...Object.fromEntries(QUTILAR.map(q => [q.k, qt[q.k].map(t => ({ t, holat: done ? 'ok' : undefined }))])), joriy: done ? null : joriy };
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Hozir nimani <A>qurmaslik</A> kerak?</>, ru: <>Что сейчас <A>не нужно</A> строить?</> })}
        mentor={<Mentor>{tr({ uz: 'Muammo gapingiz tepada turibdi — har imkoniyatni unga solishtiring.', ru: 'Ваша формулировка проблемы вверху — сравнивайте с ней каждую возможность.' })}</Mentor>}
        qadamlar={<>
          {!isMentor && ozMuammo(muammo, true)}
          {!done && !isMentor && <div className="im-bosq">{QUTILAR.map((x, i) => <span key={x.k} className={cxx('im-qchip', i === qadam && 'on', i < qadam && 'ok')}>{i < qadam ? '✓' : i + 1} {tr(x.t)}</span>)}</div>}
        </>}
        forma={isMentor
          ? <SanoqDoska nom={tr(DOSKA_NOM)} muammo={<MaydonMuammo />} qutilar={maydonQutilar()} />
          : !done && <div className="q-karta im-forma">
            <span className="q-yorliq">{qutiNomi(joriy)}</span>
            <div className="im-qator">
              <GrowInput key={joriy} value={val} onChange={e => setVal(e.target.value)} onEnter={qosh} placeholder={tr(S10_IPUCHA[joriy])} maxLength={90} aria-label={tr(S10_IPUCHA[joriy])} />
              <QTugma ikkinchi className={val.trim() ? 'im-bos' : undefined} disabled={!val.trim()} onClick={qosh}>{tr(QOSHISH)}</QTugma>
            </div>
            {xato && <div className="im-xato"><QXato>{tr(XABAR10[xato.tur])}</QXato><QIzoh>{tr({ uz: "Shunday qoldirsangiz — yana «Qo'shish»ni bosing.", ru: 'Если оставить так — нажмите «Добавить» ещё раз.' })}</QIzoh></div>}
            {qt.qilamiz.length > 3 && <QIzoh>{tr({ uz: '«Qilamiz»da uchtadan ko\'p: har biriga birinchi savolni qayta bering.', ru: 'В «Делаем» больше трёх: задайте каждой первый вопрос ещё раз.' })}</QIzoh>}
            <div className="im-amal">
              <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)} {yordam ? '▾' : '▸'}</QTugma>
              <QTugma className={qt[joriy].length && !val.trim() ? 'im-bos' : undefined} disabled={!qt[joriy].length} onClick={saqla}>{tr(SAQLASH)}</QTugma>
            </div>
          </div>}
        yordam={!done && !isMentor && yordam && <QIzoh>{tr({ uz: "Har imkoniyatga ikki savol bering: busiz muammo hal bo'ladimi? «Ha» bo'lsa — yozuvlarda unga sabab bormi?", ru: 'Задайте каждой возможности два вопроса: решится ли проблема без неё? Если «да» — есть ли для неё причина в записях?' })}</QIzoh>}
      >
        {!isMentor && <div className={cxx('im-ozdoska', done && 'q-fokus')}>
          <SanoqDoska nom={tr(DOSKAM)} qutilar={doskaQutilar} />
          {done && <div className="im-amal"><QTugma ikkinchi onClick={() => { setQadam(0); setXato(null); }}>{tr(TAHRIR)}</QTugma></div>}
        </div>}
        {isMentor && <MentorPracticeStats live={live} screen={screen} label={{ uz: "Uch qutini to'ldirganlar", ru: 'Заполнили три коробки' }} />}
        {done && !isMentor && <QXulosa>{tr({ uz: "Uch qutingiz saqlandi: «Qilamiz» — sizning MVP'ingiz.", ru: 'Три коробки сохранены: «Делаем» — это ваш MVP.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "«Qilamiz»da beshta-oltita imkoniyat bo'lsa, bittasini oling va so'rang: busiz muammo hal bo'ladimi?", ru: 'Если в «Делаем» пять-шесть возможностей, возьмите одну и спросите: решится ли проблема без неё?' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};
const maydonQutilar = () => Object.fromEntries(QUTILAR.map(q => [q.k, IMKONIYATLAR.filter(m => m.q === q.k).map(m => ({ t: tr(m.t), holat: 'ok' }))]));

// ===== SCREEN 11 — KOD YOZISH (QKod: darvoza-savol → vazifa + Yordam + «Bajardim» · VS Code oynasi qo'lda yoziladi; terminal «Kutilgan natija» boshidan xira, 12-q1 A) =====
// 87-qonun: kod-atamalar o'tilgan bo'lsa ham birinchi uchraganda bir qatorlik eslatma (Yordam ichida).
const KD_CODE = {
  uz: `// sanoq.js — «Maydon» intervyulari: har shikoyat nechta yozuvda chiqdi

// Kodda shikoyatlarni bitta so'z bilan yozamiz: band, telefon, jamoa, pul
const yozuvlar = [
  ["band", "telefon"],
  ["band", "telefon"],
  ["band"],
  ["band", "telefon", "jamoa"],
  ["jamoa", "pul"],
];

const shikoyatlar = ["band", "telefon", "jamoa", "pul"];

for (let i = 0; i < shikoyatlar.length; i++) {
  const s = shikoyatlar[i];   // s — shu aylanishda sanalayotgan shikoyat
  let son = 0;
  // Shu yerga: yozuvlar'ni ikkinchi sikl bilan aylanib chiqing,
  // yozuvda s bo'lsa, son'ga bitta qo'shing (Yordam ▸)
  console.log(s + " — " + son + " / " + yozuvlar.length);
}`,
  ru: `// sanoq.js — интервью «Maydon»: в скольких записях встретилась каждая жалоба

// В коде пишем жалобы одним словом: band, telefon, jamoa, pul
const yozuvlar = [
  ["band", "telefon"],
  ["band", "telefon"],
  ["band"],
  ["band", "telefon", "jamoa"],
  ["jamoa", "pul"],
];

const shikoyatlar = ["band", "telefon", "jamoa", "pul"];

for (let i = 0; i < shikoyatlar.length; i++) {
  const s = shikoyatlar[i];   // s — жалоба, которую считаем в этом проходе
  let son = 0;
  // Сюда: пройдите по yozuvlar вторым циклом,
  // если в записи есть s — прибавьте к son единицу (Подсказка ▸)
  console.log(s + " — " + son + " / " + yozuvlar.length);
}`
};
const KD_NATIJA = ['band — 4 / 5', 'telefon — 3 / 5', 'jamoa — 2 / 5', 'pul — 1 / 5'];
const KD_SHART = [
  { uz: "To'rt shikoyat, har biri alohida qatorda", ru: 'Четыре жалобы, каждая на отдельной строке' },
  { uz: 'Har qator yonida — nechta yozuvda', ru: 'Рядом с каждой строкой — в скольких записях' },
  { uz: 'Sonlar doskadagi bilan bir xil', ru: 'Числа такие же, как на доске' }
];
const KD_ESLATMA = [
  { k: 'yozuvlar[j]', t: { uz: 'j-indeksdagi yozuv (indeks 0 dan boshlanadi)', ru: 'запись с индексом j (индекс начинается с 0)' } },
  { k: '.includes(s)', t: { uz: "ro'yxatda s bormi (5-Modulda ishlatgansiz)", ru: 'есть ли s в списке (вы использовали в 5-м модуле)' } },
  { k: 'for', t: { uz: "yozuvlarni birma-bir ko'rib chiqadi (sikl)", ru: 'перебирает записи по одной (цикл)' } },
  { k: 'if (...)', t: { uz: 'shart rost bo\'lsa, qavs ichidagi qator ishlaydi', ru: 'если условие верно, срабатывает строка в скобках' } },
  { k: 'son = son + 1', t: { uz: "songa bitta qo'shadi", ru: 'прибавляет к числу единицу' } },
  { k: 'terminal', plain: true, t: { uz: <><code className="qcode">node sanoq.js</code> yozib natijani ko'radigan oyna</>, ru: <>окно, где пишете <code className="qcode">node sanoq.js</code> и видите результат</> } }
];
const KD_QADAM = [
  { uz: <>Ichkariga ikkinchi sikl: <code className="qcode">{'for (let j = 0; j < yozuvlar.length; j++)'}</code></>, ru: <>Внутрь — второй цикл: <code className="qcode">{'for (let j = 0; j < yozuvlar.length; j++)'}</code></> },
  { uz: <>Ichida shart: <code className="qcode">{'if (yozuvlar[j].includes(s))'}</code></>, ru: <>Внутри условие: <code className="qcode">{'if (yozuvlar[j].includes(s))'}</code></> },
  { uz: <>Shart rost bo'lsa: <code className="qcode">son = son + 1;</code></>, ru: <>Если условие верно: <code className="qcode">son = son + 1;</code></> }
];
const GATE_OPTS = [
  { t: { uz: "To'rtinchi yozuvdagi shikoyatlar", ru: 'Жалобы из четвёртой записи' }, ok: false },
  { t: { uz: 'Beshinchi yozuvdagi shikoyatlar', ru: 'Жалобы из пятой записи' }, ok: true },
  { t: { uz: 'Yozuvlarning umumiy soni', ru: 'Общее число записей' }, ok: false }
];
const JS_TOKEN = /(\/\/[^\n]*|"[^"]*"|\b(?:const|let|for)\b)/g;
const jsHl = (ln) => ln.split(JS_TOKEN).filter(p => p !== undefined && p !== '').map((p, i) => {
  if (p.startsWith('//')) return <span key={i} className="im-kd-iz">{p}</span>;
  if (p.startsWith('"')) return <span key={i} className="im-kd-str">{p}</span>;
  if (/^(const|let|for)$/.test(p)) return <span key={i} className="im-kd-kw">{p}</span>;
  return <span key={i}>{p}</span>;
});
// VS Code oynasi: kod o'qiladi, nusxalanmaydi (PM-082 d); terminal — kutilgan natija, «Bajardim»dan keyin to'liq rangda, qatorlar ketma-ket ajraladi
const VsOyna = ({ tayyor }) => (
  <div className="im-vsc" onCopy={e => e.preventDefault()} onCut={e => e.preventDefault()} onContextMenu={e => e.preventDefault()} title={tr({ uz: "Kod nusxalanmaydi — o'zingiz terib yozasiz", ru: 'Код не копируется — наберите сами' })}>
    <div className="im-vsc-bar"><span className="im-vsc-fayl"><b>JS</b> sanoq.js</span><span className="im-vsc-lock">{tr({ uz: "qo'lda yoziladi", ru: 'пишется вручную' })}</span></div>
    <div className="im-vsc-body">{tr(KD_CODE).split('\n').map((ln, i) => <div key={i} className="im-vsc-q"><span className="im-vsc-n">{i + 1}</span><span className="im-vsc-k">{ln ? jsHl(ln) : ' '}</span></div>)}</div>
    <div className={cxx('im-term', tayyor && 'tayyor')}>
      <span className="im-term-l">{tr({ uz: 'Kutilgan natija', ru: 'Ожидаемый результат' })}</span>
      <span className="im-term-q buyruq">$ node sanoq.js</span>
      {KD_NATIJA.map((q, i) => <span key={i} className="im-term-q" style={{ '--i': i }}>{q}</span>)}
    </div>
  </div>
);
// QKod o'ng ustun propining qolip-nomi (Editor ma'nosidagi o'zbekcha so'z) til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi —
// u o'quvchi matni emas, qolip API nomi; prop shu doimiy orqali beriladi (1-dars yechimi; MEXANIZM-TAKLIF 10).
const QKOD_ONG = 'muh\u0061rrir';
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const [gateOk, setGateOk] = useState(!!storedAnswer);
  const [miss, setMiss] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const stage2 = gateOk || isMentor || done;
  const pickGate = (i) => {
    if (stage2) return;
    if (GATE_OPTS[i].ok) { setGateOk(true); setMiss(null); }
    else setMiss({ i, k: Date.now() });
  };
  const bajardim = () => {
    if (done || isMentor) return;
    setDone(true);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Avval kod-savolini yeching', ru: 'Сначала ответьте на вопрос о коде' }) : tr({ uz: '② Kodni yozing va tugmani bosing', ru: '② Напишите код и нажмите кнопку' });
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · VS Code', ru: 'Пишем код · VS Code' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Shikoyatlarni sanaydigan <A>kod</A> yozamiz.</>, ru: <>Пишем <A>код</A>, который считает жалобы.</> })}
        mentor={<Mentor key={stage2 ? 'k2' : 'k1'}>{!stage2
          ? tr({ uz: "Avval bitta savol — so'ng kod yoziladi.", ru: 'Сначала один вопрос — потом пишем код.' })
          : tr({ uz: 'Doskada qo\'lingiz bilan sanagan shikoyatlarni endi kod xuddi shunday sanaydi.', ru: 'Жалобы, которые вы считали руками на доске, теперь точно так же посчитает код.' })}</Mentor>}
        vazifa={!stage2
          ? <div className="im-darvoza">
              <span className="im-darvoza-s">{tr({ uz: <>Kod <code className="qcode">yozuvlar[4]</code> ni chiqarsa, terminalda nima ko'rinadi?</>, ru: <>Если код выведет <code className="qcode">yozuvlar[4]</code>, что появится в терминале?</> })}</span>
              <div className="im-darvoza-v im-kut">{GATE_OPTS.map((g, i) => { const silk = miss && miss.i === i; return <QChip key={silk ? `${i}-${miss.k}` : i} silk={silk} onClick={() => pickGate(i)}>{tr(g.t)}</QChip>; })}</div>
              {miss && <QXato>{tr({ uz: "Ro'yxatda sanash 0 dan boshlanadi.", ru: 'В списке счёт начинается с 0.' })}</QXato>}
            </div>
          : <>
              <span className="q-yorliq">{tr({ uz: 'Kod nima chiqarsin', ru: 'Что должен вывести код' })}</span>
              <ol className="im-vazifa">{KD_SHART.map((v, i) => <li key={i}><i>{i + 1}</i><span>{tr(v)}</span></li>)}</ol>
            </>}
        yordam={stage2 && <div className="im-yordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)} {yordam ? '▾' : '▸'}</QTugma>
          {yordam && <div className="im-yordam-b">
            <span className="im-yordam-h">{tr({ uz: 'Eslatma (JavaScript darslaridan)', ru: 'Напоминание (из уроков JavaScript)' })}</span>
            <ul className="im-esl">{KD_ESLATMA.map((e, k) => <li key={k}>{e.plain ? <b>{e.k}</b> : <code className="qcode">{e.k}</code>} — {tr(e.t)}</li>)}</ul>
            <span className="im-yordam-h">{tr({ uz: 'Uch qadam', ru: 'Три шага' })}</span>
            <ol className="im-vazifa">{KD_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
          </div>}
        </div>}
        bajardim={stage2 && <div className="im-amal">
          <QTugma className={!done && !isMentor ? 'im-bos' : undefined} disabled={done || isMentor} onClick={bajardim}>{done ? '✓ ' : ''}{tr({ uz: "Bajardim — to'rt qator chiqdi", ru: 'Готово — вывелись четыре строки' })}</QTugma>
        </div>}
        {...{ [QKOD_ONG]: <div className="im-kodoyna"><VsOyna tayyor={done} /></div> }}
      >
        {isLive && stage2 && <SinfSanoq live={live} screen={screen} />}
        {isMentor && <MentorPracticeStats live={live} screen={screen} label={{ uz: "Kodni yozib bo'lganlar", ru: 'Дописали код' }} />}
      </QKod>
    </Stage>
  );
};

// ===== SCREEN 12 — 4-SAVOL, YAKUNIY (QuestionScreen; INLINE_KEYS.s12 = 2) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Imkoniyatni «Qilamiz» qutisiga nima kiritadi?"
    question={tr({ uz: <h2 className="title h-ask">Imkoniyatni <A>«Qilamiz» qutisiga</A> nima kiritadi?</h2>, ru: <h2 className="title h-ask">Что отправляет возможность <A>в коробку «Делаем»?</A></h2> })}
    options={[
      { uz: "Muammoni ko'p o'yinchi aytgani", ru: 'О проблеме сказали многие игроки' },
      { uz: 'Uni jamoaning o\'zi yoqtirgani', ru: 'Она нравится самой команде' },
      { uz: "Busiz muammo hal bo'lmasligi", ru: 'Без неё проблема не решится' },
      { uz: 'Uni yozuvda kimdir aytgani', ru: 'О ней кто-то сказал в записи' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "«Qilamiz»ga faqat busiz muammo hal bo'lmaydigan imkoniyat kiradi.", ru: 'В «Делаем» попадает только то, без чего проблема не решится.' }}
    explainWrong={{
      0: { uz: "Ko'p aytilgani muammoni tanlaydi, imkoniyatni emas.", ru: 'Частота выбирает проблему, а не возможность.' },
      1: { uz: 'Burbn jamoasi o\'z xohishiga emas, odamlarga qaradi.', ru: 'Команда Burbn смотрела не на свои желания, а на людей.' },
      3: { uz: "Yozuvda bor bo'lsa ham, u «Keyin»da turishi mumkin.", ru: 'Даже если это есть в записи, оно может стоять в «Потом».' },
      default: { uz: 'Qutilarga ajratishdagi birinchi savolni eslang.', ru: 'Вспомните первый вопрос при раскладке по коробкам.' }
    }} />
);

// ===== SCREEN 13 — O'ZINGIZ O'YLAB KO'RING (QMustaqil, 2 qadam: ayting → bir qatorda yozing; yozgach — muammo kartangiz solishtirish uchun) =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const yakka = yakkaMi(live);
  const [muammo] = useState(() => lsGet(KEY_MUAMMO));
  const [matn, setMatn] = useState(() => (storedAnswer && storedAnswer.matn) || '');
  const [vaqt, setVaqt] = useState(!!storedAnswer);
  const yozildi = norm(matn).length >= 20;
  useEffect(() => { if (yozildi && storedAnswer === undefined) onAnswer(screen, { stage: 'reflection', screenIdx: screen, correct: true, picked: true, solved: true, matn: matn.trim() }); }, [yozildi]); // eslint-disable-line
  useXulosaSkroll(yozildi, storedAnswer);
  const joriy = yozildi ? 2 : (vaqt || matn.length > 0 ? 1 : 0);
  const QADAM = [yakka ? { uz: 'Ovoz chiqarib o\'zingizga ayting', ru: 'Скажите вслух самому себе' } : { uz: 'Sherigingizga ayting', ru: 'Скажите партнёру' }, { uz: 'Endi shu gapni bir qatorda yozing', ru: 'Теперь запишите эту фразу одной строкой' }];
  const timerMatn = yakka
    ? { boshlash: tr({ uz: '30 soniyani boshlash', ru: 'Запустить 30 секунд' }), toxtatish: tr({ uz: "To'xtatish", ru: 'Остановить' }), yana: tr({ uz: '↻ Yana 30 soniya', ru: '↻ Ещё 30 секунд' }) }
    : { boshlash: tr({ uz: '1 daqiqani boshlash', ru: 'Запустить 1 минуту' }), toxtatish: tr({ uz: "To'xtatish", ru: 'Остановить' }), yana: tr({ uz: '↻ Yana 1 daqiqa', ru: '↻ Ещё 1 минута' }) };
  const ipucha = tr({ uz: '… … qiynaladi. 5 yozuvdan … tasida chiqdi.', ru: '… трудно … Встретилось в … записях из 5.' });
  return (
    <Stage eyebrow={tr({ uz: "O'zingiz o'ylab ko'ring", ru: 'Подумайте сами' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!yozildi} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Siz aslida <A>qaysi muammoni</A> hal qilyapsiz?</>, ru: <>Какую проблему вы <A>на самом деле</A> решаете?</> })}
        mentor={<Mentor>{tr({ uz: 'Ekranga qaramasdan ayting: kim, qachon, nimadan qiynaladi va bu nechta yozuvda chiqdi?', ru: 'Скажите, не глядя на экран: кому, когда и с чем трудно и в скольких записях это встретилось?' })}</Mentor>}
        qadamlar={<div className="im-s13-bosh">
          <div className="im-bosq">{QADAM.map((x, i) => <span key={i} className={cxx('im-qchip', i === joriy && 'on', i < joriy && 'ok')}>{i < joriy ? '✓' : i + 1} {tr(x)}</span>)}</div>
          <Taymer soniya={yakka ? 30 : 60} matn={timerMatn} chorla={joriy === 0} onTugadi={() => setVaqt(true)} onBoshla={() => setVaqt(true)} />
        </div>}
        forma={<div className={cxx('q-karta im-forma', joriy === 1 && 'im-faol')}>
          <span className="q-yorliq">{tr(QADAM[1])}</span>
          <GrowInput value={matn} onChange={e => setMatn(e.target.value)} placeholder={ipucha} maxLength={200} aria-label={tr(QADAM[1])} />
        </div>}
      >
        {yozildi && muammo && muammo.kim && <div className="im-ozdoska kir">{ozMuammo(muammo, true)}</div>}
        {yozildi && <QXulosa>{tr({ uz: "Ko'p yozuvda chiqqan shikoyat — kuchli belgi; birinchi versiya shu bitta muammoni hal qiladi.", ru: 'Жалоба, которая встречается во многих записях, — сильный знак; первая версия решает эту одну проблему.' })}</QXulosa>}
      </QMustaqil>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — 4 ta: s9 — birinchi urinish (AchMissCtx); s2, s8, s11 — ish tugaganda (151-qonun, MD «Nishonlar») =====
const ACHIEVEMENTS = {
  patternSpotter: { icon: '🔎', name: 'Pattern Spotter!', desc: { uz: 'Besh yozuvni ochib, shikoyatlarni sanadingiz', ru: 'Вы открыли пять записей и посчитали жалобы' } },
  problemWriter: { icon: '📝', name: 'Problem Writer!', desc: { uz: "O'z muammo gapingizni yozdingiz", ru: 'Вы написали свою формулировку проблемы' } },
  scopeKeeper: { icon: '📦', name: 'Scope Keeper!', desc: { uz: 'Sakkizta imkoniyatni uch qutiga ajratdingiz', ru: 'Вы разложили восемь возможностей по трём коробкам' } },
  codeCounter: { icon: '💻', name: 'Code Counter!', desc: { uz: 'Shikoyatlarni kod bilan sanadingiz', ru: 'Вы посчитали жалобы кодом' } }
};
const ACH_TRIGGERS = { s2: 'patternSpotter', s8: 'problemWriter', s9: 'scopeKeeper', s11: 'codeCounter' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 7, 12 — q22)
const Q_LABELS = {
  3: { uz: '1 — Bitta yozuv', ru: '1 — Одна запись' },
  5: { uz: '2 — Muammo gapi', ru: '2 — Формулировка проблемы' },
  7: { uz: '3 — Burbn qarori', ru: '3 — Решение Burbn' },
  12: { uz: '4 — «Qilamiz» qutisi', ru: '4 — Коробка «Делаем»' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi so'zlar — darsning lug'ati (R-008: {uz, ru}); arena foni ham shu ro'yxatdan
const QZ_BG_SHAPES = [
  { ch: { uz: 'yozuv', ru: 'запись' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'shikoyat', ru: 'жалоба' }, l: 80, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'muammo', ru: 'проблема' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'sanoq', ru: 'подсчёт' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: 'MVP', l: 45, t: 86, s: 26, d: 25, dl: 1.1 },
  { ch: { uz: 'qilamiz', ru: 'делаем' }, l: 64, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: 'keyin', ru: 'потом' }, l: 26, t: 36, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'qilmaymiz', ru: 'не делаем' }, l: 18, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'intervyu', ru: 'интервью' }, l: 56, t: 52, s: 22, d: 22, dl: 3.4 }
];
// ⚡ Mustahkamlash-jang — 12 savol, to'g'ri javob: A — 1, 6, 12 · B — 3, 5, 10 · C — 2, 8, 11 · D — 4, 7, 9 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'Oshxona haqida besh intervyu qildingiz, deylik. Qaysi shikoyatdan boshlaysiz?', ru: 'Допустим, вы провели пять интервью о столовой. С какой жалобы начнёте?' }, opts: [{ uz: "To'rt yozuvda chiqqanidan", ru: 'С той, что в четырёх записях' }, { uz: 'Eng qattiq aytilganidan', ru: 'С самой резкой' }, { uz: "O'zingizga qiziq bo'lganidan", ru: 'С интересной вам' }, { uz: 'Oxirgi yozuvdagisidan', ru: 'С той, что в последней записи' }], correct: 0 },
  { q: { uz: "Qaysi gap muammo gapi bo'la oladi?", ru: 'Какая фраза может быть формулировкой проблемы?' }, opts: [{ uz: 'Maydonni band qiladigan sayt kerak', ru: 'Нужен сайт для брони поля' }, { uz: "Shanba kuni futbol o'ynash juda yoqadi", ru: 'В субботу очень нравится играть в футбол' }, { uz: "O'yinchilar bo'sh vaqtni bila olmaydi", ru: 'Игроки не могут узнать свободное время' }, { uz: "Mahallada futbol o'ynaydiganlar ko'p", ru: 'В махалле много футболистов' }], correct: 2 },
  { q: { uz: 'Bitta o\'yinchi «chat kerak» dedi. Bu nimani bildiradi?', ru: 'Один игрок сказал «нужен чат». Что это значит?' }, opts: [{ uz: "Chat — MVP'ning eng muhim qismi", ru: 'Чат — главная часть MVP' }, { uz: "Hozircha bu bir odamning gapi", ru: 'Пока это слова одного человека' }, { uz: "Hamma o'yinchiga chat kerak ekan", ru: 'Чат нужен всем игрокам' }, { uz: 'Chatni bugunoq qurish kerak', ru: 'Чат нужно строить сегодня же' }], correct: 1 },
  { q: { uz: 'MVP nima?', ru: 'Что такое MVP?' }, opts: [{ uz: 'Mahsulotning eng chiroyli to\'liq versiyasi', ru: 'Самая красивая полная версия продукта' }, { uz: 'Barcha imkoniyati bor oxirgi versiyasi', ru: 'Последняя версия со всеми возможностями' }, { uz: 'Faqat rasmi chizilgan birinchi versiyasi', ru: 'Первая версия, где есть только рисунок' }, { uz: 'Ish beradigan eng sodda birinchi versiya', ru: 'Самая простая работающая первая версия' }], correct: 3 },
  { q: { uz: '«Keyin» qutisidagi imkoniyat bilan nima bo\'ladi?', ru: 'Что происходит с возможностью в коробке «Потом»?' }, opts: [{ uz: "Butunlay o'chirib tashlanadi", ru: 'Полностью удаляется' }, { uz: 'Saqlanadi, navbati suriladi', ru: 'Сохраняется, очередь сдвигается' }, { uz: "Bugunoq MVP'ga qo'shiladi", ru: 'Сегодня же добавляется в MVP' }, { uz: 'Boshqa mahsulotga beriladi', ru: 'Отдаётся другому продукту' }], correct: 1 },
  { q: { uz: "«Jamoa yig'ish» nega «Keyin» qutisida?", ru: 'Почему «Сбор команды» в коробке «Потом»?' }, opts: [{ uz: 'Yozuvda bor, lekin MVP busiz ishlaydi', ru: 'Есть в записях, но MVP работает без него' }, { uz: 'Uni hech bir yozuvda hech kim aytmagan', ru: 'О нём никто не сказал ни в одной записи' }, { uz: "Busiz MVP bo'sh vaqtni ko'rsatmaydi", ru: 'Без него MVP не покажет свободное время' }, { uz: 'Uni besh yozuvning hammasida aytishgan', ru: 'О нём сказали во всех пяти записях' }], correct: 0 },
  { q: { uz: '«Maydonga baho» nega «Qilmaymiz» qutisida?', ru: 'Почему «Оценка поля» в коробке «Не делаем»?' }, opts: [{ uz: 'Uni qurish juda qiyin bo\'lgani uchun', ru: 'Потому что её очень трудно сделать' }, { uz: 'Jamoaning o\'ziga u yoqmagani uchun', ru: 'Потому что она не нравится команде' }, { uz: "Uni ko'p o'yinchi so'ragani uchun", ru: 'Потому что её просили многие игроки' }, { uz: "Yozuvlarda unga sabab yo'qligi uchun", ru: 'Потому что в записях нет для неё причины' }], correct: 3 },
  { q: { uz: "«Egasi uchun bandlar ro'yxati»siz nima bo'ladi?", ru: 'Что будет без «Списка броней для владельца»?' }, opts: [{ uz: "Hech narsa — bu ro'yxat o'yinchilarga kerak emas", ru: 'Ничего — игрокам этот список не нужен' }, { uz: "O'yinchilar sayt kataklarini umuman ko'ra olmaydi", ru: 'Игроки совсем не увидят ячейки сайта' }, { uz: 'Egasi maydonni boshqaga berib yuborishi mumkin', ru: 'Владелец может отдать поле другим' }, { uz: 'Sayt ochilmaydi va hech kim band qila olmaydi', ru: 'Сайт не откроется, и никто не забронирует' }], correct: 2 },
  { q: { uz: 'Burbn jamoasi qaysi imkoniyatni qoldirdi?', ru: 'Какую возможность оставила команда Burbn?' }, opts: [{ uz: 'Joyni belgilashni', ru: 'Отметку места' }, { uz: 'Uchrashuv rejasini', ru: 'План встречи' }, { uz: "Ball yig'ishni", ru: 'Сбор баллов' }, { uz: 'Surat joylashni', ru: 'Публикацию фото' }], correct: 3 },
  { q: { uz: 'Burbn jamoasi qarorni nimaga qarab qildi?', ru: 'На что смотрела команда Burbn, принимая решение?' }, opts: [{ uz: "Jamoaning o'z xohishiga qarab", ru: 'На своё желание' }, { uz: 'Odamlar nima qilganiga qarab', ru: 'На то, что делали люди' }, { uz: 'Eng oson imkoniyatga qarab', ru: 'На самую простую возможность' }, { uz: 'Bitta odamning gapiga qarab', ru: 'На слова одного человека' }], correct: 1 },
  { q: { uz: 'Kodda `yozuvlar[j].includes("band")` nimani tekshiradi?', ru: 'Что проверяет в коде `yozuvlar[j].includes("band")`?' }, opts: [{ uz: 'Yozuvlar soni nechtaligini', ru: 'Сколько всего записей' }, { uz: 'Birinchi yozuv nimaligini', ru: 'Что в первой записи' }, { uz: 'j-yozuvda «band» bormi', ru: 'Есть ли «band» в записи j' }, { uz: '«band» so\'zi uzunligini', ru: 'Длину слова «band»' }], correct: 2 },
  { q: { uz: "Ikki shikoyat bitta qiyinchilikni ko'rsatsa, nima qilasiz?", ru: 'Если две жалобы показывают одну трудность, что вы сделаете?' }, opts: [{ uz: 'Ikkalasini bitta muammo gapiga yozaman', ru: 'Запишу обе в одну формулировку проблемы' }, { uz: "Ulardan birini o'chirib, bittasini qoldiraman", ru: 'Одну удалю, другую оставлю' }, { uz: 'Har biri uchun alohida sayt qilaman', ru: 'Сделаю отдельный сайт для каждой' }, { uz: "Ikkalasini ham «Keyin» qutisiga qo'yaman", ru: 'Положу обе в коробку «Потом»' }], correct: 0 }
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
    const TOK = QZ_BG_SHAPES.map(sh => tr(sh.ch)); // arena foni — darsning o'z so'zlari (emoji yo'q)
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
const MentorPracticeStats = ({ live, screen, label }) => {
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
      <div className="card-lbl" style={{ color: T.accent }}>{tr(label || { uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
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

// 🃏 Kartochka mexanikasi va ko'rinishi — qolipda: QKartochka (DE-204). 11 karta, MD v3 15-ekran (ta'riflar so'zma-so'z, T-042).
const KARTOCHKALAR = [
  { front: { uz: 'Shikoyat qachon kuchli belgi bo\'ladi?', ru: 'Когда жалоба — сильный знак?' }, back: { uz: "Ko'p yozuvda chiqqanda — keyin uning og'irligi ham qaraladi", ru: 'Когда встречается во многих записях — потом оценивают и её тяжесть' } },
  { front: { uz: 'Bitta yozuvdagi qattiq gap kimniki?', ru: 'Чьи резкие слова из одной записи?' }, back: { uz: 'Bir odamniki', ru: 'Одного человека' } },
  { front: { uz: '«Maydon»da qaysi shikoyat eng ko\'p chiqdi?', ru: 'Какая жалоба чаще всего встречалась в «Maydon»?' }, back: { uz: '«Maydon band edi» — 5 yozuvdan 4 tasida', ru: '«Поле было занято» — в 4 записях из 5' } },
  { front: { uz: '«Maydon» muammo gapi qanday?', ru: 'Какая формулировка проблемы у «Maydon»?' }, back: { uz: "O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi", ru: 'Игрокам трудно перед походом на поле узнать свободное время и занять его' } },
  { front: { uz: "Muammo gapida qanday uch bo'lak bor?", ru: 'Какие три части есть в формулировке проблемы?' }, back: { uz: 'Kim · qachon · nimadan qiynaladi', ru: 'Кто · когда · с чем трудно' } },
  { front: { uz: "Muammo gapida nima bo'lmaydi?", ru: 'Чего не бывает в формулировке проблемы?' }, back: { uz: 'Yechim — sayt ham, ilova ham', ru: 'Решения — ни сайта, ни приложения' } },
  { front: { uz: 'MVP nima?', ru: 'Что такое MVP?' }, back: { uz: 'Mahsulotning ish beradigan eng sodda birinchi versiyasi', ru: 'Самая простая работающая первая версия продукта' } },
  { front: { uz: '«Qilamiz» qutisiga qanday imkoniyat kiradi?', ru: 'Какая возможность входит в коробку «Делаем»?' }, back: { uz: "Busiz muammo hal bo'lmaydigani", ru: 'Та, без которой проблема не решится' } },
  { front: { uz: '«Keyin» bilan «Qilmaymiz» farqi nima?', ru: 'Чем «Потом» отличается от «Не делаем»?' }, back: { uz: "«Keyin»ga yozuvlarda sabab bor, «Qilmaymiz»ga yo'q", ru: 'Для «Потом» в записях есть причина, для «Не делаем» — нет' } },
  { front: { uz: "Burbn'dan nima qoldi?", ru: 'Что осталось от Burbn?' }, back: { uz: "Surat, izoh va layk — ilova Instagram bo'ldi (2010)", ru: 'Фото, комментарии и лайки — приложение стало Instagram (2010)' } },
  { front: { uz: '`yozuvlar[j].includes(s)` nima qiladi?', ru: 'Что делает `yozuvlar[j].includes(s)`?' }, back: { uz: "j-indeksdagi yozuvda s bor-yo'qligini tekshiradi", ru: 'Проверяет, есть ли s в записи с индексом j' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        {/* SABOQ 16 (F-1005-91): Mentor yo'q (KORPUS §61); ko'rsatma karta ostida, birinchi bosishgacha, karta yuzi halqada */}
        <div className={cxx('im-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: fmtCode(tr(c.front)), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="im-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «kim uchun · nechta · muddat» + raqamli qadamlar; GATE M M-q9 — alohida .homework.jsx YO'Q) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z g'oyangiz", ru: 'ваша идея' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '1 muammo gapi va uch quti', ru: '1 формулировка проблемы и три коробки' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "O'z besh yozuvingizni qayta o'qing va har shikoyat nechta yozuvda chiqqanini sanang.", ru: 'Перечитайте свои пять записей и посчитайте, в скольких записях встретилась каждая жалоба.' },
  { uz: "Eng ko'p chiqqanini bitta muammo gapiga yozing: kim, qachon, nimadan qiynaladi.", ru: 'Самую частую запишите одной формулировкой проблемы: кому, когда и с чем трудно.' },
  { uz: "Imkoniyatlarni uch qutiga ajrating — «Qilamiz»da faqat busiz muammo hal bo'lmaydiganlari qolsin.", ru: 'Разложите возможности по трём коробкам — в «Делаем» пусть останется только то, без чего проблема не решится.' }
];
// Artefakt-strip «Doskam» (U-042): darsda yozilgan muammo gapi va «Qilamiz» qutisi — uyga vazifa shu doskadan davom etadi
const DoskamStrip = () => {
  const [d] = useState(() => ({ m: lsGet(KEY_MUAMMO), v: lsGet(KEY_MVP) }));
  if (!d.m || !d.m.kim || !d.m.nima) return null;
  return (
    <div className="im-strip">
      <span className="im-strip-l">{tr(DOSKAM)}</span>
      <span className="im-strip-t">{ozGap(d.m)}</span>
      {d.v && Array.isArray(d.v.qilamiz) && <span className="im-strip-q">{qutiNomi('qilamiz')}: {nechtaTa(d.v.qilamiz.length)}</span>}
    </div>
  );
};
const HwCard = ({ keyingi }) => (
  <div className="card im-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="im-hw-karta">
      {HW_KARTA.map((r, i) => <div key={i} className="im-hw-q"><span className="im-hw-k">{tr(r.k)}</span><span className="im-hw-v">{tr(r.v)}</span></div>)}
    </div>
    <ol className="im-vazifa">{HW_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
    <DoskamStrip />
    {keyingi && <span className="im-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204). CODE STRIKE va arena — jonli o'yin qatlami, darsda =====
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
  // «Endi siz bilasiz» — MD v3 16-ekran, so'zma-so'z
  const RECAP = [
    { uz: "Bitta yozuvdagi gap bir odamniki. Ko'p yozuvda chiqqani — kuchli belgi; keyin uning og'irligini ham qaraymiz.", ru: 'Слова из одной записи — мнение одного человека. Встретившееся во многих записях — сильный знак; потом оценим и его тяжесть.' },
    { uz: "Muammo gapi kim, qachon va nimadan qiynalishini aytadi — unda yechim yo'q.", ru: 'Формулировка проблемы говорит, кому, когда и с чем трудно, — решения в ней нет.' },
    { uz: "MVP — mahsulotning ish beradigan eng sodda birinchi versiyasi; «Qilamiz»ga busiz muammo hal bo'lmaydigan imkoniyat kiradi.", ru: 'MVP — самая простая работающая первая версия продукта; в «Делаем» входит возможность, без которой проблема не решится.' },
    { uz: "Burbn jamoasi odamlar ko'p qilgan bitta ishni qoldirdi — ilova Instagram bo'ldi.", ru: 'Команда Burbn оставила одно дело, которое люди делали чаще всего, — приложение стало Instagram.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Mini-MVP arxitekturasi»</b>. «Maydon»ning «Qilamiz» qutisidagi uch imkoniyat uchun sayt, Backend va Database'ni bitta chizmaga chizasiz.</>, ru: <>Следующий урок — <b>«Архитектура мини-MVP»</b>. Для трёх возможностей из коробки «Делаем» в «Maydon» нарисуете сайт, Backend и Database на одной схеме.</> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Muammo gapingiz va <A>MVP chegarangiz</A> tayyor.</>, ru: <>Ваша формулировка проблемы и <A>граница MVP</A> готовы.</> })}
        cta={<>
          <div className="im-asosiy fade-up d1"><span className="im-asosiy-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><span className="im-asosiy-t">{tr({ uz: "Ko'p yozuvda chiqqan shikoyat — kuchli belgi; birinchi versiya shu bitta muammoni hal qiladi.", ru: 'Жалоба, которая встречается во многих записях, — сильный знак; первая версия решает эту одну проблему.' })}</span></div>
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={RECAP.map(tr)}
        uyga={<HwCard keyingi={keyingi} />}
        keyingi={keyingi}
        hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      />
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmInterviewMvpLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === m7-03 «Besh suhbatdan qaysi muammo chiqdi?» — darsning o'z vizuali (im-). Faqat qolip tokenlari (D3); brend ranglari faqat Instagram nom-yorlig'ida; emoji yo'q (D4) === */
        .im-ekran { display: contents; }
        @keyframes im-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70%, 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        @keyframes im-kir { from { opacity: 0; transform: translateY(8px) scale(.97); } }
        .im-bos, .im-bos-nav { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: im-puls 1.6s ease-out .5s 3; }
        .im-kut .q-variant:not(:disabled), .im-kut .q-chip:not(:disabled), .im-kut .q-btn:not(:disabled) { outline: 2px solid ${fon(T.accent, 0.55)}; outline-offset: 2px; animation: im-puls 1.6s ease-out .6s 3; }
        .kir { animation: im-kir .35s ease-out both; }
        /* doska */
        .im-doska { width: 100%; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px; padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 24px -18px rgba(${T.shadowBase},0.45); }
        .im-doska-nom { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; letter-spacing: .04em; color: ${T.ink2}; }
        .im-yq { display: flex; gap: 8px; }
        .im-yq-n { width: 30px; height: 30px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; color: ${T.ink2}; background: ${T.bg}; border: 1.5px solid ${T.line}; transition: all .3s; }
        .im-yq-n.on { color: ${T.accent}; border-color: ${T.accent}; background: ${T.paper}; }
        .im-yq-n.yangi { animation: im-pop .45s cubic-bezier(.3,1.6,.5,1); }
        @keyframes im-pop { 0% { transform: scale(.6); } 60% { transform: scale(1.18); } }
        .im-sh { display: flex; flex-direction: column; gap: 7px; }
        .im-sq { display: grid; grid-template-columns: minmax(0,1fr) auto 48px; align-items: center; gap: 4px 12px; padding: 8px 12px; border-radius: 11px; border: 1.5px solid ${T.line}; background: ${T.paper}; position: relative; }
        .im-sq.hozir { border-color: ${T.accent}; }
        .im-sq.kul { opacity: .62; }
        .im-sq.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .im-sq.yangi { animation: im-qkir .5s ease-out both; }
        @keyframes im-qkir { from { opacity: 0; transform: translateX(-26px); } }
        .im-sq.birlash { animation: im-birlash 1.2s ease-in forwards; z-index: 0; }
        @keyframes im-birlash { 0% { transform: none; } 60% { transform: translateY(calc(-100% - 7px)); opacity: .85; } 100% { transform: translateY(calc(-100% - 7px)); opacity: 0; } }
        .im-sq-t { font-weight: 700; font-size: 14px; color: ${T.ink}; min-width: 0; }
        .im-nuq { display: inline-flex; gap: 5px; }
        .im-nuq i { width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid ${T.line}; background: ${T.paper}; transition: background .3s, border-color .3s; }
        .im-nuq i.on { background: ${T.accent}; border-color: ${T.accent}; }
        .im-nuq i.yangi { animation: im-pop .45s cubic-bezier(.3,1.6,.5,1); }
        .im-nuq i.tushdi { animation: im-tushdi 1.2s ease-out; }
        @keyframes im-tushdi { 0%, 55% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 75% { box-shadow: 0 0 0 6px ${fon(T.accent, 0.35)}; transform: scale(1.25); } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        .im-sq-n { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px; color: ${T.ink}; text-align: right; }
        .im-sq.hozir .im-sq-n { color: ${T.accent}; }
        .im-sq-nega { grid-column: 1 / -1; font-size: 13px; line-height: 1.45; color: ${T.ink2}; padding-top: 6px; border-top: 1px dashed ${T.line}; animation: im-kir .35s ease-out both; }
        .im-sq-nega b { font-weight: 800; color: ${T.accent}; }
        /* muammo kartasi */
        .im-mk { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 13px; border: 2px solid ${T.accent}; background: ${T.paper}; animation: im-kir .4s ease-out both; }
        .im-mk.kul { border-color: ${T.line}; background: ${T.bg}; }
        .im-mk-b { display: flex; flex-wrap: wrap; gap: 6px 10px; }
        .im-mk-q { display: inline-flex; flex-direction: column; gap: 2px; min-width: 0; }
        .im-mk-y { font-size: 10.5px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; color: ${T.ink2}; }
        .im-mk-t { font-weight: 700; font-size: 14.5px; line-height: 1.35; color: ${T.ink}; }
        .im-mk-gap { font-size: 14px; font-weight: 600; line-height: 1.45; color: ${T.ink}; }
        .im-mk-d { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; padding: 3px 10px; border-radius: 999px; }
        .im-mk.kul .im-mk-d { color: ${T.ink2}; background: ${T.paper}; }
        .im-mk.yoz .im-mk-q, .im-mk.yoz .im-mk-d, .im-mk.yoz .im-mk-gap { animation: im-yoz .55s ease-out both; animation-delay: calc(var(--i) * .55s + .2s); }
        @keyframes im-yoz { from { opacity: 0; clip-path: inset(0 100% 0 0); } to { opacity: 1; clip-path: inset(0 0 0 0); } }
        /* uch quti */
        .im-qutilar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .im-quti { display: flex; flex-direction: column; gap: 6px; padding: 9px 10px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.bg}; transition: border-color .25s, box-shadow .25s; min-width: 0; }
        .im-quti.on { border-color: ${T.accent}; background: ${T.paper}; }
        .im-quti.xato { border-color: ${T.err}; box-shadow: 0 0 0 3px ${fon(T.err, 0.18)}; }
        .im-quti-h { display: flex; justify-content: space-between; align-items: baseline; gap: 6px; font-size: 13.5px; color: ${T.ink}; }
        .im-quti-n { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .im-quti-ichi { display: flex; flex-direction: column; gap: 5px; min-height: 30px; }
        .im-quti-ichi.bosh { border: 1.5px dashed ${T.line}; border-radius: 9px; padding: 8px; }
        .im-quti-el { display: flex; gap: 5px; align-items: flex-start; font-size: 12.5px; font-weight: 600; line-height: 1.35; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 8px; padding: 5px 7px; overflow-wrap: anywhere; }
        .im-quti-el i { font-style: normal; color: ${T.ok}; font-weight: 800; }
        .im-quti-el.ok { border-color: ${fon(T.ok, 0.4)}; }
        .im-quti-el.yangi { border-color: ${T.accent}; animation: im-uch .5s cubic-bezier(.3,1.3,.5,1) both; }
        @keyframes im-uch { from { opacity: 0; transform: translateY(-22px) scale(.9); } }
        .im-sk { display: block; height: 9px; border-radius: 5px; background: ${T.line}; width: 82%; animation: im-sk .5s ease-out both; animation-delay: calc(var(--k) * .22s + .3s); }
        .im-sk.qisqa { width: 54%; }
        @keyframes im-sk { from { opacity: 0; transform: scaleX(.3); transform-origin: left; } }
        .im-shakl-mq { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,.6fr) 48px; align-items: center; gap: 10px; padding: 12px; border: 1.5px dashed ${T.line}; border-radius: 12px; }
        .im-shakl .im-quti-ichi { gap: 7px; }
        /* yozuv-kartalari */
        .im-kir { display: flex; flex-direction: column; gap: 7px; }
        .im-yk { display: flex; flex-direction: column; gap: 4px; padding: 9px 12px; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; }
        .im-yk.yopiq { flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; border-style: dashed; }
        .im-yk-h { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; letter-spacing: .03em; color: ${T.ink2}; }
        p.im-yk-t { margin: 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .im-kir p.im-yk-t { font-size: 12.5px; line-height: 1.45; }
        .im-yk-sh.qalin { font-weight: 800; }
        .im-yk-sh.chiz { text-decoration: underline; text-decoration-color: ${T.ink2}; text-decoration-thickness: 2px; text-underline-offset: 3px; }
        .im-yk-sh.ajrat { background: ${T.accentSoft}; border-radius: 4px; padding: 0 3px; animation: im-ajrat .6s ease-out both; }
        @keyframes im-ajrat { from { background: ${T.accent}; color: ${T.paper}; } }
        .im-yk-s { display: inline-block; margin-left: 5px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 0 5px; text-decoration: none; animation: im-kir .3s ease-out both; }
        .im-s2-h, .im-s4-h, .im-s9-h { display: flex; flex-direction: column; gap: 10px; }
        .im-s4-tug { display: flex; flex-direction: column; gap: 8px; align-items: stretch; }
        .im-s4-tug .q-chip { justify-content: space-between; text-align: left; }
        .im-ch-b { font-weight: 800; margin-left: 8px; }
        .im-taxmin-q { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 14px; padding: 9px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; animation: im-kir .3s ease-out both; }
        .im-taxmin-s { font-size: 13.5px; font-weight: 600; color: ${T.ink2}; min-width: 0; }
        .im-taxmin-b { font-size: 13.5px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 12px; border-radius: 999px; }
        /* Burbn sahnasi — chizilgan telefon, logotip yo'q */
        .im-bs { display: flex; align-items: center; justify-content: center; gap: 18px; flex-wrap: wrap; padding: 6px 0; min-height: 250px; }
        .im-tel { position: relative; width: 186px; height: 272px; flex-shrink: 0; background: linear-gradient(160deg,#2A2933,#16151C); border-radius: 26px; padding: 7px; box-shadow: 0 16px 30px -14px rgba(${T.shadowBase},0.6), inset 0 0 0 1px rgba(255,255,255,0.08); }
        .im-tel-kesik { position: absolute; top: 7px; left: 50%; transform: translateX(-50%); width: 34%; height: 11px; border-radius: 0 0 8px 8px; background: #16151C; z-index: 3; }
        .im-tel-ekran { position: relative; width: 100%; height: 100%; border-radius: 20px; overflow: hidden; background: #FAFAFA; display: flex; flex-direction: column; gap: 8px; padding: 22px 10px 10px; font-family: 'Manrope', sans-serif; color: #1B1630; }
        .im-tel-nom { font-weight: 800; font-size: 17px; letter-spacing: -.01em; animation: im-kir .45s ease-out both; }
        .im-tel-nom.insta { background: linear-gradient(90deg,#F58529,#DD2A7B 55%,#8134AF); -webkit-background-clip: text; background-clip: text; color: transparent; font-size: 19px; }
        .im-bm { display: flex; flex-direction: column; gap: 7px; }
        .im-bm-q { position: relative; display: flex; align-items: center; gap: 8px; padding: 8px 9px; text-align: left; line-height: 1.25; border-radius: 10px; background: #FFFFFF; border: 1px solid #E6E3EE; font-size: 12px; font-weight: 700; transition: opacity .5s, background .5s, border-color .5s; animation: im-kir .35s ease-out both; animation-delay: calc(var(--i) * .08s); }
        .im-bm-q.xira { opacity: .38; }
        .im-bm-q.ajr { background: ${T.accentSoft}; border-color: ${T.accent}; color: ${T.accent}; }
        .im-bb { width: 18px; height: 18px; flex-shrink: 0; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; stroke-linecap: round; }
        .im-bm-oqim { position: absolute; right: -2px; top: 50%; width: 0; height: 0; }
        .im-bm-oqim i { position: absolute; width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; opacity: 0; animation: im-oqim 2.2s ease-in infinite; animation-delay: calc(var(--j) * .42s); }
        @keyframes im-oqim { 0% { transform: translate(46px, -30px); opacity: 0; } 20% { opacity: .9; } 100% { transform: translate(-6px, -4px); opacity: 0; } }
        .im-ig { display: flex; flex-direction: column; gap: 8px; flex: 1; min-height: 0; position: relative; }
        .im-bm.ket { position: absolute; inset: 0 0 auto 0; z-index: 2; animation: im-ket 1.6s ease-in forwards; }
        .im-bm-q.chiz::after { content: ''; position: absolute; left: 8px; right: 8px; top: 50%; height: 2px; background: ${T.err}; transform-origin: left; animation: im-chiz .5s ease-out both; animation-delay: calc(var(--i) * .15s + .1s); }
        @keyframes im-chiz { from { transform: scaleX(0); } }
        @keyframes im-ket { 0%, 55% { opacity: 1; } 100% { opacity: 0; transform: translateY(-14px); visibility: hidden; } }
        .im-ig-post { display: flex; flex-direction: column; gap: 6px; animation: im-kir .5s ease-out 1.2s both; }
        .im-ig-surat { position: relative; display: block; height: 104px; border-radius: 10px; overflow: hidden; background: linear-gradient(180deg,#BFE3F7,#E9F6FD); }
        .im-ig-surat .quyosh { position: absolute; top: 14px; right: 18px; width: 22px; height: 22px; border-radius: 50%; background: #FFC94D; }
        .im-ig-surat .tog { position: absolute; bottom: -10px; left: -10px; width: 110px; height: 70px; background: #6FB98F; transform: rotate(45deg) translate(30px, 30px); }
        .im-ig-surat .tog2 { position: absolute; bottom: -24px; right: -20px; width: 110px; height: 80px; background: #4C9A72; transform: rotate(45deg) translate(30px, 20px); }
        .im-ig-amal { display: flex; gap: 8px; color: #1B1630; }
        .im-ig-amal .im-bb:first-child { color: #DD2A7B; fill: #DD2A7B; }
        .im-ig-iz { display: flex; flex-direction: column; gap: 4px; }
        .im-ig-iz b, .im-ig-iz i { display: block; height: 7px; border-radius: 4px; background: #E3E0EA; }
        .im-ig-iz b { width: 70%; } .im-ig-iz i { width: 46%; }
        .im-ig-yorliq { font-size: 11px; font-weight: 800; letter-spacing: .03em; color: #1B1630; text-align: center; animation: im-kir .4s ease-out 1.5s both; }
        .im-bs-izoh { max-width: 220px; font-size: 13px; line-height: 1.45; color: ${T.ink2}; animation: im-kir .4s ease-out 1.6s both; }
        .im-bs-sana { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: im-kir .45s ease-out both; }
        .im-bs-sana-t { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; letter-spacing: .04em; padding: 5px 12px; border-radius: 999px; background: ${T.accentSoft}; color: ${T.accent}; }
        .im-bs-son { display: flex; flex-direction: column; gap: 2px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .im-bs-son span { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .im-bs-son b { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; }
        .im-nuqtalar { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .im-nuq-l { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; margin-right: 6px; }
        .im-nuqtalar i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; transition: background .3s, transform .3s; }
        .im-nuqtalar i.ok { background: ${T.ok}; }
        .im-nuqtalar i.cur { background: ${T.accent}; transform: scale(1.25); }
        .im-voqea { display: flex; flex-direction: column; gap: 8px; align-items: stretch; width: 100%; animation: im-kir .35s ease-out both; }
        .im-voqea-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,1.9vw,19px); color: ${T.ink}; text-align: center; }
        .im-voqea .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 8px 14px; }
        .im-voqea .q-bashorat .q-yorliq { margin: 0; }
        .im-voqea .q-taxmin { text-align: center; }
        /* mustaqil ish */
        .im-forma { display: flex; flex-direction: column; gap: 10px; }
        .im-forma.im-faol { border-color: ${T.accent}; }
        .im-kirit { width: 100%; resize: none; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 10px; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.45; color: ${T.ink}; background: ${T.paper}; outline: none; min-height: 38px; }
        .im-kirit:focus { border-color: ${T.accent}; }
        .im-nechta { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; }
        .im-nechta-l { font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .im-nechta-t { display: flex; gap: 6px; }
        .im-nechta .q-chip { min-width: 36px; justify-content: center; }
        .im-nechta > .q-btn { margin-left: auto; }
        .im-qator { display: flex; gap: 8px; align-items: flex-start; }
        .im-qator .q-btn { flex-shrink: 0; }
        .im-xato { display: flex; flex-direction: column; gap: 4px; }
        .im-amal { display: flex; justify-content: flex-end; align-items: center; gap: 10px; flex-wrap: wrap; }
        .im-bosq { display: flex; flex-wrap: wrap; gap: 8px; }
        .im-qchip { display: inline-flex; align-items: center; gap: 4px; padding: 7px 12px; border-radius: 999px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .im-qchip.on { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; }
        .im-qchip.ok { border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; }
        .im-ozdoska { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        p.im-yiggap { margin: 0; font-size: 15px; font-weight: 700; line-height: 1.45; color: ${T.ink}; padding: 10px 14px; border-radius: 12px; background: ${T.accentSoft}; }
        .q-mustaqil > .im-mk { margin-bottom: 2px; }
        .q-mustaqil:empty { display: none; }
        /* uch quti mashqi */
        .lesson-root ol.im-ikki, .lesson-root ol.im-vazifa { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .im-ikki li, .im-vazifa li { display: flex; gap: 9px; align-items: flex-start; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .im-ikki li i, .im-vazifa li i { flex: 0 0 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; background: ${T.accentSoft}; color: ${T.accent}; }
        .im-ikki li { font-weight: 700; }
        .im-imk { display: flex; flex-direction: column; gap: 9px; }
        .im-imk-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.ink2}; }
        .im-imk-t { font-size: 18px; font-weight: 800; color: ${T.ink}; }
        .im-s9-tug { display: flex; flex-wrap: wrap; gap: 8px; }
        .im-s9-tug .q-btn { flex: 1 1 0; min-width: 96px; }
        .im-imk-j { font-size: 13.5px; font-weight: 700; }
        .im-imk-j.ok { color: ${T.ok}; } .im-imk-j.xato { color: ${T.err}; }
        .im-imk-j.xato b { color: ${T.ok}; }
        .im-imk-sabab { font-size: 13.5px; line-height: 1.45; color: ${T.ink}; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        /* kod */
        .im-darvoza { display: flex; flex-direction: column; gap: 10px; }
        .im-darvoza-s { font-weight: 700; font-size: 14.5px; line-height: 1.45; color: ${T.ink}; }
        .im-darvoza-v { display: flex; flex-direction: column; gap: 8px; align-items: stretch; }
        .im-yordam { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; margin-top: 10px; }
        .im-yordam-b { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; width: 100%; }
        .im-yordam-h { font-size: 11.5px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; color: ${T.ink2}; }
        .lesson-root ul.im-esl { list-style: none; display: flex; flex-direction: column; gap: 4px; }
        .im-esl li { font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .im-kodoyna { display: flex; flex-direction: column; gap: 10px; height: 100%; }
        .im-vsc { display: flex; flex-direction: column; border-radius: 12px; overflow: hidden; background: #1E1E1E; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.7); user-select: none; -webkit-user-select: none; flex: 1; }
        .im-vsc-bar { display: flex; justify-content: space-between; align-items: center; background: #252526; padding: 0 10px 0 0; }
        .im-vsc-fayl { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: #1E1E1E; color: #E8E5DD; font-family: 'JetBrains Mono', monospace; font-size: 12px; border-top: 2px solid ${T.accent}; }
        .im-vsc-fayl b { color: #E8C547; font-size: 10.5px; }
        .im-vsc-lock { font-size: 11px; color: #9DA3AE; font-family: 'Manrope', sans-serif; }
        .im-vsc-body { padding: 8px 0; overflow-x: auto; }
        .im-vsc-q { display: flex; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.42; color: #D4D4D4; white-space: pre; }
        .im-vsc-n { width: 34px; flex-shrink: 0; text-align: right; padding-right: 12px; color: #6E7681; }
        .im-kd-iz { color: #6A9955; } .im-kd-str { color: #CE9178; } .im-kd-kw { color: #C586C0; }
        .im-term { display: flex; flex-direction: column; gap: 1px; padding: 8px 14px 10px; background: #141414; border-top: 1px solid #333; opacity: .42; transition: opacity .6s; }
        .im-term.tayyor { opacity: 1; }
        .im-term-l { font-size: 10.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #9DA3AE; margin-bottom: 3px; }
        .im-term-q { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #7DD181; }
        .im-term-q.buyruq { color: #FFD380; }
        .im-term.tayyor .im-term-q:not(.buyruq) { animation: im-tq .7s ease-out both; animation-delay: calc(var(--i) * .3s + .3s); }
        @keyframes im-tq { 0% { background: transparent; } 40% { background: rgba(125,209,129,0.22); } 100% { background: transparent; } }
        p.im-sinf { margin: 0; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        /* o'ylab ko'ring */
        .im-s13-bosh { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .im-taymer { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .im-taymer-son { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 20px; color: ${T.ink}; min-width: 58px; }
        .im-taymer.yur .im-taymer-son { color: ${T.accent}; }
        .im-taymer.tugadi .im-taymer-son { color: ${T.ok}; }
        .im-taymer-yol { flex: 1; min-width: 80px; height: 6px; border-radius: 3px; background: ${T.line}; overflow: hidden; }
        .im-taymer-yol i { display: block; height: 100%; background: ${T.accent}; transition: width 1s linear; }
        .im-taymer.tugadi .im-taymer-yol i { background: ${T.ok}; }
        /* mentor eslatmasi, nishon yozuvi, jonli ovozlar */
        .ach-rule { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .ach-rule.lost { font-style: italic; }
        .mnote-chip { align-self: flex-end; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; padding: 6px 12px; border-radius: 999px; border: 1px dashed ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; }
        .mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; }
        .mnote-lbl { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.accent}; }
        .mnote-body { font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .im-ovoz { display: flex; flex-direction: column; gap: 6px; }
        .im-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 40px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink2}; }
        .im-ovoz-q.men { color: ${T.ink}; font-weight: 700; }
        .im-ovoz-yol { height: 8px; border-radius: 4px; background: ${T.bg}; overflow: hidden; }
        .im-ovoz-yol i { display: block; height: 100%; background: ${T.accent}; border-radius: 4px; transition: width .5s; }
        .im-ovoz-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; text-align: right; }
        /* kartochka (SABOQ 16) */
        .im-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: im-fc-halqa 1.6s ease-out 3; }
        @keyframes im-fc-halqa { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        p.im-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .im-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: im-fc-nuqta 1.4s ease-in-out 3; }
        @keyframes im-fc-nuqta { 50% { transform: scale(1.6); opacity: .4; } }
        /* yakun: asosiy fikr, uyga vazifa, artefakt-strip */
        .im-asosiy { display: flex; flex-direction: column; gap: 4px; padding: 14px 18px; border-radius: 14px; background: ${T.okFon}; }
        .im-asosiy-l { font-size: 11.5px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; color: ${T.ok}; }
        .im-asosiy-t { font-size: 15.5px; font-weight: 700; line-height: 1.45; color: ${T.ink}; }
        .im-hw { display: flex; flex-direction: column; gap: 12px; }
        .im-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .im-hw-q { display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .im-hw-k { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .im-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; line-height: 1.35; }
        .im-hw-keyingi { font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .im-strip { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 12px; padding: 9px 12px; border-radius: 10px; border: 1px solid ${T.accent}; background: ${T.paper}; }
        .im-strip-l { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.accent}; }
        .im-strip-t { flex: 1; min-width: 0; font-size: 13.5px; font-weight: 600; color: ${T.ink}; }
        .im-strip-q { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        @media (max-width: 640px) {
          .im-qutilar, .im-hw-karta { grid-template-columns: minmax(0,1fr); }
          .im-sq { grid-template-columns: minmax(0,1fr) 44px; }
          .im-sq .im-nuq { grid-column: 1 / -1; grid-row: 2; }
          .im-tel { width: 156px; height: 262px; }
          .im-ig-surat { height: 96px; }
          .im-bs { gap: 12px; }
          .im-nechta > .q-btn { margin-left: 0; }
          .im-qator { flex-direction: column; align-items: stretch; }
        }
        @media (prefers-reduced-motion: reduce) {
          .im-bos, .im-bos-nav, .im-kut .q-variant, .im-kut .q-chip, .im-kut .q-btn, .kir, .im-yq-n.yangi, .im-sq.yangi, .im-nuq i.yangi, .im-nuq i.tushdi, .im-sq-nega, .im-mk, .im-mk.yoz .im-mk-q, .im-mk.yoz .im-mk-d, .im-mk.yoz .im-mk-gap,
          .im-quti-el.yangi, .im-sk, .im-yk-sh.ajrat, .im-yk-s, .im-taxmin-q, .im-tel-nom, .im-bm-q, .im-bm-oqim i, .im-bm-q.chiz::after, .im-ig-post, .im-ig-yorliq, .im-bs-izoh, .im-bs-sana, .im-voqea, .im-term.tayyor .im-term-q,
          .im-flash.yangi .fc-card:not(.flip) .fc-front, .im-fc-ipucha i { animation: none !important; }
          .im-sq.birlash { animation: none !important; opacity: 0; }
          .im-bm.ket { animation: none !important; display: none; }
          .im-bm-oqim { display: none; }
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
