import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 10-Modul (LMS) · 11-dars (PM, 2-tur) «Besh daqiqada nimani ko'rsatasiz?» — kalit m8-11 · pitch repetitsiyasi va qattiq fidbek.
// Manba-haqiqat: feedback/F-1005-10modul/11-PmPitchRehearsal-v3.md (GATE M) · skelet src/skelet/NamunaDars.jsx · qolip src/qolip.
// Ekranlar: s0 QKirish · s1 QReja · s2/s6/s8 QTushuncha · s3/s5/s7/s9 test (QuestionScreen → QTest) · s4 QVoqea (K12 Airbnb) · s10 QKod (Neon) ·
//   s11/s12/s13 QMustaqil · podium · QKartochka · QYakun. Bitta vizual — PitchSahna (slaydlar · taymer · zal · baholash varag'i).
// Artefakt: pm-m8d11-pitch (s10–s13 yozadi); o'qiydi pm-m7d12-pitch, pm-m8d1-okr, pm-m8d4-gipoteza, pm-m8d10-yol (yo'q bo'lsa — bo'sh maydon).
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m8d11-pitch-v1', lessonTitle: { uz: "Besh daqiqada nimani ko'rsatasiz?", ru: "Что вы покажете за пять минут?" } };
// 17 ekran · PM 2-tur (artefakt yozma — besh slaydli pitch) · oqim: kirish → reja → besh slayd → 1-savol → Airbnb → 2-savol → raqamlar slaydi → 3-savol →
//   baholash varag'i → yakuniy savol → Neon SQL → mustaqil ish → repetitsiya → tuzatish → podium → kartochkalar → yakun. Manba-haqiqat: feedback/F-1005-10modul/11-PmPitchRehearsal-v3.md (GATE M).
const HW_TOKENS = [
  { t: { uz: 'pitch', ru: "питч" }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'slayd', ru: "слайд" }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'zal', ru: "зал" }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'daqiqa', ru: "минута" }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's10', type: 'koding',      template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
// Har ekranning vazifasi (Quruvchi + Jonli uchun xarita)
const SCREEN_INTENTS = [
  "hook: 1 daqiqalik pitch va bo'sh 4 daqiqa", 'reja: besh slayd skeleti + 4 qadam', "besh slayd: Raqamlar va Keyingi qadam qo'shiladi, vaqt beshga bo'linadi", '1-savol: raqamlar yoki keyingi qadam',
  'Airbnb: taqdimot muammodan boshlangan (bashorat)', "2-savol: «Maydon» pitchi qaysi slayddan", 'raqamlar slaydi: 17 + nimani sanadi, solishtirish, halol gap', '3-savol: raqam yonida nima',
  "baholash varag'i: besh gap saralanadi (atama)", 'yakuniy savol: qaysi fidbek yordam beradi', 'Neon SQL: bosh raqam Database\'dan', 'mustaqil: besh slaydli pitch',
  "repetitsiya: 5 daqiqa taymer + baholash varag'i", 'tuzatish: eng zaif slayd', 'podium', 'kartochkalar', 'yakun'
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi; MD: 3 — B, 5 — D, 7 — A, 9 — C). Ishtirok-kalitlar (-1) — amaliy ekranlar signali (500+ zona).
const INLINE_KEYS = { s3: 1, s5: 3, s7: 0, s9: 2, beshSlayd: -1, raqamlar: -1, fidbek: -1, neon: -1, practice: -1, repetitsiya: -1, tuzatish: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran indeksi; PM darsida emoji o'rniga raqam, S-026). Matn — MD «Qisqa takrorlash oynalari».
const RECAPS = {
  3: {
    title: { uz: 'Raqamlar yoki keyingi qadam', ru: "Цифры или следующий шаг" },
    cards: [
      { ic: '1', h: { uz: 'Raqamlar slaydi', ru: "Слайд «Цифры»" }, body: { uz: 'Raqamlar slaydida sayt ishga tushgach sanalgan raqam turadi.', ru: "На слайде «Цифры» — число, посчитанное после запуска сайта." } },
      { ic: '2', h: { uz: 'Keyingi qadam slaydi', ru: "Слайд «Следующий шаг»" }, body: { uz: "Keyingi qadam slaydida keyingi oyda o'sadigan raqam turadi.", ru: "На слайде «Следующий шаг» — число, которое вырастет в следующем месяце." } },
      { ic: '3', h: { uz: "Hali bo'lmagan son", ru: "Числа ещё нет" }, body: { uz: "Hali bo'lmagan son keyingi qadamga chiqadi.", ru: "Число, которого ещё нет, идёт в «Следующий шаг»." }, ask: { uz: "Mini-do'kon: «Oy oxirigacha buyurtmalar 30 taga yetsin». Qaysi slayd?", ru: "Мини-магазин: «Пусть к концу месяца будет 30 заказов». Какой слайд?" } }
    ]
  },
  5: {
    title: { uz: 'Airbnb tartibi', ru: "Порядок Airbnb" },
    cards: [
      { ic: '1', h: { uz: 'Oddiy slaydlar', ru: "Простые слайды" }, body: { uz: "Airbnb taqdimotida o'nga yaqin oddiy slayd bo'lgan.", ru: "В презентации Airbnb было около десятка простых слайдов." } },
      { ic: '2', h: { uz: 'Tartib', ru: "Порядок" }, body: { uz: 'Tartib: muammo, yechim, bozor, mahsulot, jamoa.', ru: "Порядок: проблема, решение, рынок, продукт, команда." } },
      { ic: '3', h: { uz: 'Bizning pitchda', ru: "В нашем питче" }, body: { uz: 'Bizning pitchda ham avval muammo, keyin yechim.', ru: "В нашем питче тоже сначала проблема, потом решение." }, ask: { uz: "Airbnb'dagidek, «Maydon» pitchi qaysi slayd bilan boshlanadi?", ru: "Как у Airbnb: с какого слайда начинается питч «Maydon»?" } }
    ]
  },
  7: {
    title: { uz: 'Raqam yonida nima', ru: "Что рядом с числом" },
    cards: [
      { ic: '1', h: { uz: 'Nimani sanadi', ru: "Что посчитано" }, body: { uz: 'Raqam nimani sanashi aytiladi.', ru: "Говорят, что считает число." } },
      { ic: '2', h: { uz: 'Solishtirish', ru: "Сравнение" }, body: { uz: 'U nima bilan solishtirilgani aytiladi.', ru: "Говорят, с чем его сравнили." } },
      { ic: '3', h: { uz: 'Halol gap', ru: "Честная фраза" }, body: { uz: 'Qanday sanalgani va xulosa chegarasi halol aytiladi.', ru: "Честно говорят, как посчитано и где граница вывода." }, ask: { uz: "AvtoPizza pitchida «haftada 30 buyurtma». Yoniga nima qo'shasiz?", ru: "В питче AvtoPizza «30 заказов в неделю». Что добавите рядом?" } }
    ]
  },
  9: {
    title: { uz: 'Qaysi fidbek yordam beradi', ru: "Какой фидбек помогает" },
    cards: [
      { ic: '1', h: { uz: 'Qaysi slayd', ru: "Какой слайд" }, body: { uz: 'Fidbek qaysi slayd haqida ekanini aytadi.', ru: "Фидбек говорит, о каком он слайде." } },
      { ic: '2', h: { uz: 'Nima yetishmadi', ru: "Чего не хватило" }, body: { uz: 'Unda nima yetishmaganini aytadi.', ru: "Говорит, чего на нём не хватило." } },
      { ic: '3', h: { uz: 'Nima yordam bermaydi', ru: "Что не помогает" }, body: { uz: "«Hammasi yoqdi» va odam haqidagi gap pitchni tuzatmaydi.", ru: "«Всё понравилось» и слова о человеке питч не исправят." }, ask: { uz: 'Qaysi fidbek sinfdoshingizga pitchini tuzatishga yordam beradi?', ru: "Какой фидбек поможет однокласснику исправить питч?" } }
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

// ===== DARSNING BITTA VIZUALI — Sahna (PitchSahna, 163/180): slayd tasmasi · taymer chizig'i · zal (4 siluet + savol pufagi) · baholash varag'i =====
// 9-Modul 12-dars Sahnasining davomi (u yerda uch slayd va zal) — besh slayd, taymer va varaq shu darsda qo'shildi; umumiy qolipga ko'chirilmagan (dars ichida).
// Bitta manba: SLAYDLAR (nomlar, MD A-5) · ZAL_SAVOL (P-063) · MAYDON (Mentor pitchi, MD A-6). F-1005 pilot saboqlari: jonli kirish, bitta natija bloki, ≤3 blok.
// qolip-maket: pr-sl-bos pr-joy pr-gap
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const cxx = (...a) => a.filter(Boolean).join(' ');
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const yakkaMi = (live) => !live || (live.mode !== 'student' && live.mode !== 'mentor');
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const norm = (s) => String(s || '').toLowerCase().replace(/[\u02BB\u02BC\u2018\u2019`]/g, "'").replace(/\s+/g, ' ').trim();
const mss = (s) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.floor(Math.max(0, s) % 60)).padStart(2, '0')}`;
// Harakatsizlikda bitta ipucha (javobni aytmaydi): kalit o'zgarsa sanoq qaytadan
const useIpucha = (faol, kalit, ms = 40000) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(false);
    if (!faol) return undefined;
    const t = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(t);
  }, [faol, kalit, ms]);
  return on;
};
// Son sanab o'sadi (SABOQ 19); kam harakatda — darhol
const useSanoq = (n, ms = 650) => {
  const [v, setV] = useState(n);
  const oldin = useRef(n);
  useEffect(() => {
    const dan = oldin.current;
    oldin.current = n;
    if (dan === n || kamHarakat() || typeof n !== 'number' || typeof dan !== 'number') { setV(n); return undefined; }
    let raf = 0;
    const t0 = performance.now();
    const qadam = (t) => { const k = Math.min(1, (t - t0) / ms); setV(Math.round(dan + (n - dan) * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(qadam); };
    raf = requestAnimationFrame(qadam);
    return () => cancelAnimationFrame(raf);
  }, [n, ms]);
  return v;
};
// Navbat bilan chiqish (SABOQ 19): 0 → n, har qadam ms; kam harakatda — darhol oxiri
const useNavbat = (n, ms = 110, boshla = true) => {
  const [k, setK] = useState(() => (kamHarakat() ? n : 0));
  useEffect(() => {
    if (!boshla || k >= n) return undefined;
    const t = setTimeout(() => setK(v => v + 1), k === 0 ? 220 : ms);
    return () => clearTimeout(t);
  }, [k, n, ms, boshla]);
  return k;
};
// Mashq tugagach natija blokiga silliq skroll (P-051); boshidan tugagan ekranda — yo'q
const useXulosaSkroll = (on, boshdan) => {
  const bosh = useRef(!!boshdan);
  useEffect(() => {
    if (!on || bosh.current) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 900);
    return () => clearTimeout(t);
  }, [on]);
};
// Uchish (SABOQ 19, FLIP): bosilgan narsa joyidan yangi joyiga uchib boradi; yangi element data-uch bilan topiladi
const uchir = (dan, el, ms = 560) => {
  if (!dan || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !dan.width) return;
  const z = (el.offsetWidth || g.width) / g.width;
  const dx = ((dan.left + dan.width / 2) - (g.left + g.width / 2)) * z;
  const dy = ((dan.top + dan.height / 2) - (g.top + g.height / 2)) * z;
  const s = Math.min(1.8, Math.max(0.6, dan.width / g.width));
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.8 }, { transform: 'translate(0, 0) scale(1)', opacity: 1 }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' });
};
const useUchish = () => {
  const q = useRef(null);
  useLayoutEffect(() => {
    const u = q.current;
    if (!u) return;
    q.current = null;
    uchir(u.r, document.querySelector(`.lesson-root [data-uch="${u.k}"]`), u.ms);
  });
  return useCallback((manba, k, ms) => { if (manba && manba.getBoundingClientRect) q.current = { r: manba.getBoundingClientRect(), k, ms }; }, []);
};

// --- Saqlanadigan natija (tayanch 8): o'qiydi pm-m7d12-pitch, pm-m8d1-okr, pm-m8d4-gipoteza, pm-m8d10-yol · yozadi pm-m8d11-pitch ---
const KEY_P7 = 'pm-m7d12-pitch';
const KEY_OKR = 'pm-m8d1-okr';
const KEY_GIP = 'pm-m8d4-gipoteza';
const KEY_YOL = 'pm-m8d10-yol';
const KEY_PITCH = 'pm-m8d11-pitch';

const SLAYDLAR = [
  { id: 'muammo', nom: { uz: 'Muammo', ru: "Проблема" } },
  { id: 'yechim', nom: { uz: 'Yechim', ru: "Решение" } },
  { id: 'foydalanuvchi', nom: { uz: 'Foydalanuvchi', ru: 'Пользователь' } },
  { id: 'raqamlar', nom: { uz: 'Raqamlar', ru: "Цифры" } },
  { id: 'keyingi', nom: { uz: 'Keyingi qadam', ru: "Следующий шаг" } }
];
// Zal savollari — bitta manba (P-063; birinchi uchtasi 9-Modul 12-dars aynan)
const ZAL_SAVOL = [
  { uz: "Bu qanday bo'lgan?", ru: "Как это было?" },
  { uz: 'Sayt nima qiladi?', ru: "Что делает сайт?" },
  { uz: "Kimdir ishlatib ko'rdimi?", ru: "Кто-нибудь пробовал?" },
  { uz: "Sayt ishga tushgach nima bo'ldi?", ru: "Что стало после запуска сайта?" },
  { uz: 'Endi nima qilasiz?', ru: "Что будете делать дальше?" }
];
const TUZATILDI = { uz: 'tuzatildi', ru: "исправлено" };
// «Maydon» pitchi — Mentor misoli (MD A-6; 9-Modul 12-dars matni aynan; sonlar tayanch 1)
const MAYDON = {
  raqam: '4 / 5',
  raqamIzoh: { uz: "5 suhbatdan «maydon band edi» deganlar", ru: "из 5 бесед сказали «поле было занято»" },
  hikoya: { uz: "O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.", ru: "В прошлую пятницу пришли с друзьями — поле было занято. Перед этим я звонил владельцу, чтобы забронировать время, но он не взял трубку." },
  yechim: { uz: "Sayt kun bo'yicha bo'sh vaqt kataklarini ko'rsatadi, katakni band qiladi.", ru: "Сайт показывает свободные ячейки времени по дням и бронирует ячейку." },
  sinov: { uz: "Sinovda o'yinchi shanba 18:00 ga band qilmoqchi bo'ldi, lekin «Band qilish» tugmasini topa olmadi.", ru: "На тесте игрок хотел забронировать субботу 18:00, но не нашёл кнопку «Забронировать»." },
  tuzatish: { uz: "Tugmani ekran pastiga qotirdik — qayta sinovda yangi o'yinchi birinchi urinishda band qildi.", ru: "Закрепили кнопку внизу экрана — на повторном тесте новый игрок забронировал с первой попытки." },
  bosh: { nima: 'haftada band', oldin: 6, hozir: 11, maqsad: 20 },
  ab: { A: { tanladi: 42, band: 12 }, B: { tanladi: 40, band: 17 } },
  boshQator: { uz: 'Bosh raqam: haftada 6 dan 11 ga (maqsad — 20)', ru: "Главное число: за неделю с 6 до 11 (цель — 20)" },
  abB: { uz: "«18:00 ni band qilish» tugmasi (B) — vaqtni tanlagan 40 brauzerdan 17 tasi band qildi", ru: "Кнопка «Забронировать 18:00» (B) — из 40 браузеров, выбравших время, забронировали 17" },
  abA: { uz: "«Band qilish» tugmasi (A) — 42 tadan 12", ru: "Кнопка «Забронировать» (A) — 12 из 42" },
  halol: { uz: "Farq bor, lekin 82 ta brauzer hali kam — raqamni kuzatib boramiz. Maqsad 20 edi — yetmadi.", ru: "Разница есть, но 82 браузера пока мало — будем следить за числом. Цель была 20 — не дотянули." },
  keyingi1: { uz: "Jamoa yig'ish — o'yinchi o'yinga sherik topa olsin", ru: "Сбор команды — чтобы игрок мог найти напарников для игры" },
  keyingi2: { uz: "Keyingi oyda: haftada band qilingan vaqtlar 20 ga yetsin", ru: "В следующем месяце — 20 броней в неделю" },
  keyingi2t: { uz: "Keyingi oyda: haftada band qilingan vaqtlar 20 ga yetsin (hozir 11)", ru: "В следующем месяце — 20 броней в неделю (сейчас 11)" }
};
const Son = ({ children }) => <b className="pr-son">{children}</b>;
// Mentor pitchi besh slaydi (tuzatilgan holat) — 12, 13-ekran mentor rejimi va o'quvchida saqlangan pitch yo'q bo'lsa
const maydonQatorlar = () => [
  [{ k: 'r', t: <><Son>{MAYDON.raqam}</Son> {tr(MAYDON.raqamIzoh)}</> }, { k: 'h', t: <>«{tr(MAYDON.hikoya)}»</> }],
  [{ k: 'y', t: tr(MAYDON.yechim) }],
  [{ k: 's', t: tr(MAYDON.sinov) }, { k: 't', t: tr(MAYDON.tuzatish) }],
  [{ k: 'b', t: tr(MAYDON.boshQator) }, { k: 'ab', t: tr(MAYDON.abB) }, { k: 'h', t: tr(MAYDON.halol) }],
  [{ k: 'k1', t: tr(MAYDON.keyingi1) }, { k: 'k2', t: tr(MAYDON.keyingi2t) }]
];

// Bitta slayd-karta: raqam · nom · burchakda belgi · qatorlar (holat: bosh — kulrang uzuq chiziq · yozildi — bir lahza ajralib kiradi · joriy · xato · ok)
// holat: oddiy | joy (bo'sh o'rin, uzuq chegara) | skelet | toliq (✓) | joriy | xato | tuzatildi
const Slayd = ({ s, i }) => {
  const El = s.onBos ? 'button' : 'div';
  const ok = s.holat === 'toliq' || s.holat === 'tuzatildi';
  return (
    <El {...(s.onBos ? { type: 'button', onClick: s.onBos } : {})} className={cxx('pr-sl', s.onBos && 'pr-sl-bos', s.holat && `h-${s.holat}`, s.yangi && 'yangi', s.yon && `yon-${s.yon}`, s.kutadi && 'kutadi')} style={{ '--i': i }} data-uch={s.uch}>
      <span className="pr-sl-bosh">
        <i className={cxx('pr-sl-n', ok && 'ok')}>{ok ? '✓' : i + 1}</i>
        {s.nom && <b className="pr-sl-nom">{s.nom}</b>}
        {s.belgi && <em key={s.belgi} className={cxx('pr-sl-bel', s.belgi === '✓' ? 'ok' : 'err')}>{s.belgi}</em>}
        {s.tahrir && <span className="pr-sl-ed" aria-hidden="true">✎</span>}
      </span>
      {s.holat === 'tuzatildi' && <span className="pr-sl-tuz">{tr(TUZATILDI)}</span>}
      {s.holat !== 'joy' && (
        <span className="pr-sl-ichi">
          {(s.qatorlar || []).map(q => (
            <span key={q.k} className={cxx('pr-q', `q-${q.holat || 'matn'}`, q.katta && 'katta')} data-uch={q.uch}>
              {q.yorliq && <em className="pr-q-y">{q.yorliq}</em>}
              {q.t ? <span className="pr-q-t">{q.t}</span> : <i className="pr-q-bo" />}
            </span>
          ))}
        </span>
      )}
    </El>
  );
};
// Taymer chizig'i: 5 daqiqa-katak (h: toq · uzuq · joriy · yonadi · jim) · ostida yorliq · 5:00 dan oshsa o'ngga qizil davom etadi, yonida «+m:ss»
const Taymer = ({ kat, ortiq = 0, yur = null, ustida, uchlar, oxir }) => (
  <div className={cxx('pr-tm', ortiq > 0 && 'oshdi')}>
    <div className="pr-tm-ch">
      {kat.map((c, i) => <span key={i} className={cxx('pr-tm-k', `h-${c.h}`)} style={{ '--i': i }} />)}
      {ortiq > 0 && <span className="pr-tm-ort" style={{ flexBasis: `${Math.min(26, (ortiq / 60) * 20)}%` }} />}
      {yur != null && <i className="pr-tm-yur" style={{ left: `${Math.min(1, yur) * (ortiq > 0 ? 100 - Math.min(26, (ortiq / 60) * 20) : 100)}%` }} />}
    </div>
    <div className="pr-tm-l">
      {ustida && <span key={ustida.t} className="pr-tm-ust" style={{ left: `${ustida.dan * 20}%`, width: `${(ustida.gacha - ustida.dan) * 20}%` }}>{ustida.t}</span>}
      {kat.map((c, i) => <span key={i} className={cxx(c.h === 'joriy' && 'on', c.h === 'toq' && 'toq')}>{c.l}{c.s && <em>{c.s}</em>}</span>)}
      {ortiq > 0 && <b className="pr-tm-plus">+{mss(ortiq)}</b>}
    </div>
    {uchlar && <div className="pr-tm-u"><span>0</span><span>{oxir || tr({ uz: '5 daqiqa', ru: "5 минут" })}</span></div>}
  </div>
);
// Zal: to'rt chizilgan bosh-siluet va bitta savol pufagi (pufak: { i, t } — slayd ustida · 'ok' — yashil ✓ · '?' — jim zal)
const Zal = ({ pufak, n = 5, bur = false, jim = false }) => (
  <div className={cxx('pr-zal', jim && 'jim', bur && 'bur')}>
    <div className="pr-zal-p">
      {pufak === 'ok' ? <span key="ok" className="pr-pf ok" aria-label="✓">✓</span>
        : pufak === '?' ? <span key="q" className="pr-pf savol" style={{ '--x': '50%' }}>?</span>
          : pufak ? <span key={`${pufak.i}-${ou(pufak.t)}`} className="pr-pf" style={{ '--x': `${((pufak.i + 0.5) / n) * 100}%` }}>{tr(pufak.t)}</span> : null}
    </div>
    <div className="pr-boshlar" aria-hidden="true">{[0, 1, 2, 3].map(k => <i key={k} className="pr-bosh" style={{ '--k': k }} />)}</div>
  </div>
);
// tur: tasma (gorizontal, telefonda — qatorlar) · ustun (tik ro'yxat) · bitta (bitta katta slayd)
const PitchSahna = ({ slaydlar, tur = 'tasma', taymer, zal, yorliq, bosh, className, children }) => (
  <div className={cxx('pr-sahna', `t-${tur}`, className)} style={{ '--n': slaydlar.length }}>
    {yorliq && <span className="pr-sahna-l">{yorliq}</span>}
    {bosh}
    <div className="pr-tasma">{slaydlar.map((s, i) => <Slayd key={s.id} s={s} i={s.n != null ? s.n : i} />)}</div>
    {taymer && <Taymer {...taymer} />}
    {zal && <Zal n={slaydlar.length} {...zal} />}
    {children}
  </div>
);
// Baholash varag'i: har qator — slayd nomi · zal savoli · ✓/✗ katagi · bitta izoh qatori; pastda «Vaqt: m:ss»
// qatorlar: [{ i, belgi, izoh, holat, tuzatildi, onBos, onDrop, kutadi, tanlangan, belgiEl, izohEl, uch, yorliq }]
const Varaq = ({ sarlavha, qatorlar, vaqt, className, children }) => (
  <div className={cxx('pr-vq', className)}>
    {sarlavha && <span key="h" className="pr-vq-h">{sarlavha}</span>}
    {qatorlar.map(q => {
      const El = q.onBos ? 'button' : 'div';
      const dr = q.onDrop ? { onDragOver: (e) => e.preventDefault(), onDrop: (e) => { e.preventDefault(); q.onDrop(); } } : {};
      return (
        <El key={q.i} {...(q.onBos ? { type: 'button', onClick: q.onBos } : {})} {...dr} className={cxx('pr-vq-q', q.onBos && 'pr-joy', q.holat && `h-${q.holat}`, q.kutadi && 'kutadi')} style={{ '--i': q.i }}>
          <span className="pr-vq-nom"><b>{tr(SLAYDLAR[q.i].nom)}</b><em>{tr(ZAL_SAVOL[q.i])}</em></span>
          {q.belgiEl || <span key={q.belgi || 'b'} className={cxx('pr-vq-bel', q.belgi === '✓' && 'ok', q.belgi === '✗' && 'err')}>{q.belgi || ''}</span>}
          <span className="pr-vq-iz">
            {q.izohEl || (q.izoh ? <span className="pr-vq-izt" data-uch={q.uch}>{q.izoh}</span> : <i className="pr-q-bo" />)}
            {q.tuzatildi && <em className="pr-tuz">{tr(TUZATILDI)}</em>}
            {q.yorliq && <em className="pr-vq-yor">{q.yorliq}</em>}
          </span>
        </El>
      );
    })}
    {vaqt != null && <div className={cxx('pr-vq-vaqt', vaqt > 300 && 'oshdi')}><span>{tr({ uz: 'Vaqt', ru: "Время" })}:</span> <b>{mss(vaqt)}</b></div>}
    {children}
  </div>
);
// Taxmin qatori (SABOQ 11): bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi
const TAXMIN_L = { uz: 'Taxminingiz', ru: 'Ваше предположение' };
const TaxminQator = ({ savol, javob }) => (
  <div className="pr-taxmin fade-step" role="status"><span className="pr-taxmin-l">{tr(TAXMIN_L)}</span><span className="pr-taxmin-s">{savol}</span><b>{javob}</b></div>
);
const Bashorat = ({ yorliq, savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="pr-bash"><QBashorat yorliq={yorliq || tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar} tanlov={tanlov} onTanla={onTanla} /></div>
  : <TaxminQator savol={savol} javob={(variantlar.find(v => v.k === tanlov) || {}).t} />);
// Bitta natija bloki (SABOQ 25): birinchi qatori — taxmin natijasi, keyin xulosa, oxirida kulrang izoh
const NatijaTx = ({ togri, children }) => <span className={cxx('pr-nat-tx', togri && 'ok')}>{children}</span>;
// Qadam ko'rsatkichi (SABOQ 21): alohida ustun emas — vizual ostida raqamli doiralar va joriy qadam tugmasi
const QadamQator = ({ jami, joriy, children }) => (
  <div className="pr-qadam">
    <span className="pr-qadam-d" aria-hidden="true">{Array.from({ length: jami }, (_, i) => <i key={i} className={cxx(i < joriy && 'ok', i === joriy && 'on')}>{i < joriy ? '✓' : i + 1}</i>)}</span>
    {children}
  </div>
);
// O'qituvchi eslatmasi — faqat mentor (proyektor) rejimida, bosilganda ochiladi
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="pr-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="pr-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: "Заметка ментору" })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="pr-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: "Заметка" })}</QTugma>;
};
// 151-qonun: nishon sharti qatori (birinchi urinish); nishon olingach yoki mashq-o'tishida ko'rinmaydi
const NishonQatori = ({ screen }) => {
  const olingan = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const { isMentor } = useJonli();
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || isMentor || (olingan && olingan.has(ach))) return null;
  const ketdi = am.missed.has(sid);
  return <p className={cxx('pr-nishon', ketdi && 'ketdi')}>{ketdi ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: "Значок был за первую попытку." }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: "Сделаете верно с первой попытки — значок ваш." })}</p>;
};
// Artefakt-strip «Pitchim» (U-042): 12, 13, 15, 16-ekranlarda — o'quvchining saqlangan pitchi ixcham («n/5»)
const pitchSoni = (p) => {
  if (!p || !p.slaydlar) return 0;
  const s = p.slaydlar;
  const t = (v) => !!String(v || '').trim();
  return [t(s.muammo && s.muammo.raqam) || t(s.muammo && s.muammo.hikoya), t(s.yechim), t(s.foydalanuvchi), t(s.raqamlar && s.raqamlar.bosh && s.raqamlar.bosh.nima), t(s.keyingi)].filter(Boolean).length;
};
const PitchimStrip = () => {
  const p = lsGet(KEY_PITCH);
  const n = pitchSoni(p);
  if (!n) return null;
  return (
    <div className="pr-strip fade-up">
      <span className="pr-strip-l">{tr({ uz: 'Pitchim', ru: "Мой питч" })}</span>
      <span className="pr-strip-d" aria-hidden="true">{SLAYDLAR.map((s, i) => <i key={s.id} className={cxx(i < n && 'on')} />)}</span>
      <span className="pr-strip-n">{n}/5</span>
    </div>
  );
};
// Jonli dars: hook ovozlari chizig'i (sof so'rovnoma, J-026)
const OvozChizigi = ({ live, screen, variantlar, mening }) => {
  const [son, setSon] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!pin) return undefined;
    let on = true, t = null;
    const ayl = async () => {
      try { const rows = await liveAnswers(pin, screen); if (on) setSon(variantlar.map((_, i) => rows.filter(r => r.picked === i).length)); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(ayl, 3000);
    };
    ayl();
    return () => { on = false; clearTimeout(t); };
  }, [pin, screen]); // eslint-disable-line
  if (!son) return null;
  const jami = son.reduce((a, b) => a + b, 0);
  return (
    <div className="pr-ovoz fade-step">
      {variantlar.map((v, i) => (
        <div key={i} className={cxx('pr-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="pr-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>
      ))}
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish: chapda Sahna — uch slayd, taymer 1 daqiqa to'q + 4 daqiqa uzuq, jim zal; o'ngda radio-variantlar; J-026 — ballsiz) =====
const HOOK_OPTS = [
  { id: 'batafsil', t: { uz: 'Uch slaydni batafsilroq, misollar bilan', ru: "Три слайда подробнее, с примерами" },
    j: { uz: <><b>Qiziq fikr!</b> Hikoyani to'liqroq aytish foydali, lekin zal sayt ishga tushgach nima bo'lganini ham kutadi.</>, ru: <><b>Интересная мысль!</b> Рассказать историю полнее полезно, но зал ждёт и того, что стало после запуска сайта.</> } },
  { id: 'raqam', t: { uz: 'Sayt ishga tushgach chiqqan raqamlarni', ru: "Цифры, которые появились после запуска" },
    j: { uz: <><b>Aynan!</b> Zal sayt ishga tushgach nima bo'lganini ko'rmoqchi. Yana bitta savol ham bor — keyingi ekranda.</>, ru: <><b>Именно!</b> Зал хочет увидеть, что стало после запуска сайта. Есть и ещё один вопрос — на следующем экране.</> } },
  { id: 'qurish', t: { uz: 'Saytni qanday qurganimni, qadamma-qadam', ru: "Как я строил сайт, шаг за шагом" },
    j: { uz: <><b>Qiziq fikr!</b> Mehnatingiz ko'rinadi, lekin zal odamlar saytni ishlatganini ham ko'rmoqchi.</>, ru: <><b>Интересная мысль!</b> Ваш труд виден, но зал хочет увидеть и то, что люди пользовались сайтом.</> } }
];
const uchSlayd = (kirdi = 3) => SLAYDLAR.slice(0, 3).map((s, i) => ({ id: s.id, nom: tr(s.nom), holat: i < kirdi ? 'oddiy' : 'jim', qatorlar: maydonQatorlar()[i] }));
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const k = useNavbat(5, 120);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const tanlov = HOOK_OPTS.find(o => o.id === picked);
  const ochiq = !!tanlov;
  const kat = [0, 1, 2, 3, 4].map(i => ({ h: i === 0 ? (k >= 4 ? 'toq' : 'jim') : ochiq ? 'yonadi' : (k >= 5 ? 'uzuq' : 'jim'), l: i === 0 && k >= 4 ? tr({ uz: '1 daqiqa', ru: "1 минута" }) : '' }));
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · «Maydon» pitchi', ru: "Введение · питч «Maydon»" })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: "Выберите один вариант" }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Besh daqiqada <A>nimani ko'rsatasiz?</A></>, ru: <>Что вы <A>покажете за пять минут?</A></> })}
        mentor={<Mentor>{tr({ uz: "«Maydon» pitchi o'tgan modulda bir daqiqa edi va uch slayddan iborat edi. Endi zal sizga besh daqiqa beradi.", ru: "В прошлом модуле питч «Maydon» длился одну минуту и состоял из трёх слайдов. Теперь зал даёт вам пять минут." })}</Mentor>}
        maket={<PitchSahna className="pr-s0" slaydlar={uchSlayd(Math.min(3, k))}
          taymer={{ kat, uchlar: true, ustida: ochiq ? { dan: 1, gacha: 5, t: tr({ uz: "4 daqiqa bo'sh", ru: "4 минуты свободны" }) } : null }}
          zal={{ pufak: '?', jim: !ochiq, bur: ochiq }} />}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
        javob={<>
          {tanlov && <p className="hook-ack fade-step">{tr(tanlov.j)}</p>}
          {isLive && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
        </>}
      />
      <MentorNote>{tr({ uz: "Bir daqiqalik pitch o'tgan modulning oxirgi darsida yozilgan (uch slayd, juftlikda 2 daqiqa). Sinfdan so'rang: zal sizdan yana nimani so'rashi mumkin?", ru: "Минутный питч написан на последнем уроке прошлого модуля (три слайда, в паре 2 минуты). Спросите класс: о чём ещё зал может вас спросить?" })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda beshta nomsiz slayd skeleti va taymer — kulrang chiziqlar 0.9 s oraliqda to'q bo'ladi, oxirida zal ustida ✓; o'ngda «01 · matn · teg») =====
const REJA = [
  { t: { uz: "Pitchga qaysi slaydlar qo'shilishini bilib olasiz", ru: "Узнаете, какие слайды добавятся в питч" }, teg: { uz: '5 daqiqa', ru: "5 минут" } },
  { t: { uz: "Mashhur taqdimot qanday boshlanganini ko'rasiz", ru: "Увидите, с чего начиналась знаменитая презентация" }, teg: { uz: 'biznes', ru: "бизнес" } },
  { t: { uz: 'Raqamni zal ishonadigan qilib yozasiz', ru: "Запишете число так, чтобы зал поверил" }, teg: { uz: 'raqamlar', ru: "цифры" } },
  { t: { uz: 'Pitchni sinfdoshga aytib, tuzatasiz', ru: "Расскажете питч однокласснику и исправите" }, teg: { uz: "baholash varag'i", ru: "лист оценки" } }
];
const RejaSahna = () => {
  const n = useNavbat(6, 900);
  return (
    <PitchSahna className="pr-s1"
      slaydlar={SLAYDLAR.map((s, i) => ({ id: s.id, holat: 'skelet', yangi: i === n - 1, qatorlar: [{ k: 'a', holat: i < n ? 'toq' : 'bosh' }, { k: 'b', holat: i < n ? 'toq' : 'bosh' }] }))}
      taymer={{ kat: [0, 1, 2, 3, 4].map(i => ({ h: i < n ? 'toq' : 'uzuq' })) }}
      zal={{ pufak: n > 5 ? 'ok' : null, jim: n <= 5 }} />
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: "Начинаем" })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun pitchingizni <A>5 daqiqaga kengaytirib</A>, tuzatasiz.</>, ru: <>Сегодня вы <A>расширите питч до 5 минут</A> и исправите его.</> })}
      mentor={<Mentor>{tr({ uz: "Bir daqiqalik pitchingiz, OKR'ingiz va A/B testingizning sonlari bugun kerak bo'ladi.", ru: "Сегодня понадобятся ваш минутный питч, ваш OKR и числа вашего A/B-теста." })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida — pitch repetitsiyasi va qattiq fidbek', ru: "В конце урока — репетиция питча и жёсткий фидбек" })}
      chap={<RejaSahna />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — BESH SLAYD (QTushuncha markaziy, keng: bashorat → 3 qadam → slayd 4, 5 qo'shiladi, taymer beshga bo'linadi, pufak slaydlar ustidan o'tadi) =====
const S2_SAVOL = { uz: "Besh daqiqaning qanchasi yangi slaydlarga ketadi?", ru: "Сколько из пяти минут уйдёт на новые слайды?" };
const S2_TAXMIN = [{ k: '1', t: { uz: '1 daqiqa', ru: "1 минута" } }, { k: '2', t: { uz: '2 daqiqa', ru: "2 минуты" } }, { k: '3', t: { uz: '3 daqiqa', ru: "3 минуты" } }];
const S2_QADAM = [
  { uz: "Raqamlar slaydini qo'shing", ru: "Добавьте слайд «Цифры»" },
  { uz: "Keyingi qadam slaydini qo'shing", ru: "Добавьте слайд «Следующий шаг»" },
  { uz: "Vaqtni slaydlarga bo'ling", ru: "Разделите время по слайдам" }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [yur, setYur] = useState(storedAnswer ? 5 : -1);
  const done = q >= 3 && yur >= 5;
  const tugadi = useTugadi(done, 900, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && q < 3, q, 40000);
  useXulosaSkroll(done, !!storedAnswer);
  useEffect(() => {
    if (q < 3 || yur >= 5) return undefined;
    const t = setTimeout(() => setYur(v => v + 1), kamHarakat() ? 0 : (yur < 0 ? 350 : 520));
    return () => clearTimeout(t);
  }, [q, yur]);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'beshSlayd', screenIdx: screen, correct: true, picked: true, solved: true, taxmin });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'beshSlayd', 0, true, 0);
  }, [done]); // eslint-disable-line
  const variantlar = S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }));
  const qator = maydonQatorlar();
  const slaydlar = SLAYDLAR.map((s, i) => {
    if (i < 3) return { id: s.id, nom: tr(s.nom), holat: 'toliq', qatorlar: qator[i] };
    if (q >= 3 && yur > i) return { id: s.id, nom: tr(s.nom), holat: 'toliq', qatorlar: i === 3 ? [{ k: 'b', t: tr({ uz: "«18:00 ni band qilish» tugmasi bilan — 40 tadan 17", ru: "С кнопкой «Забронировать 18:00» — 17 из 40" }) }] : [{ k: 'k1', t: tr(MAYDON.keyingi1) }, { k: 'k2', t: tr(MAYDON.keyingi2) }] };
    const bor = (i === 3 && q >= 1) || (i === 4 && q >= 2);
    if (!bor) return { id: s.id, holat: 'joy' };
    const qq = i === 3
      ? [{ k: 'b', t: tr({ uz: "«18:00 ni band qilish» tugmasi bilan — 40 tadan 17", ru: "С кнопкой «Забронировать 18:00» — 17 из 40" }), holat: q === 1 ? 'yozildi' : 'matn' }]
      : [{ k: 'k1', t: tr(MAYDON.keyingi1), holat: q === 2 ? 'yozildi' : 'matn' }, { k: 'k2', t: tr(MAYDON.keyingi2), holat: q === 2 ? 'yozildi' : 'matn' }];
    return { id: s.id, nom: tr(s.nom), holat: (i === 3 && q === 1) || (i === 4 && q === 2) ? 'joriy' : 'oddiy', yangi: (i === 3 && q === 1) || (i === 4 && q === 2), qatorlar: qq };
  });
  const toqN = q === 0 ? 1 : q === 1 ? 2 : 3;
  const kat = [0, 1, 2, 3, 4].map(i => (q >= 3
    ? { h: yur >= 5 || yur > i ? 'toq' : yur === i ? 'joriy' : 'uzuq', l: tr(SLAYDLAR[i].nom), s: tr({ uz: '≈1 daqiqa', ru: "≈1 минута" }) }
    : { h: i < toqN ? 'toq' : 'uzuq', l: '' }));
  const pufak = q === 0 ? '?' : q === 1 ? { i: 3, t: ZAL_SAVOL[3] } : q === 2 ? { i: 4, t: ZAL_SAVOL[4] } : yur >= 5 ? 'ok' : { i: Math.max(0, yur), t: ZAL_SAVOL[Math.max(0, yur)] };
  const tx = S2_TAXMIN.find(v => v.k === taxmin);
  const bos = () => { if (!taxmin || q >= 3) return; setQ(v => v + 1); };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · besh slayd', ru: "Понятие · пять слайдов" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }) : `${tr({ uz: 'Qadamlarni bajaring', ru: "Выполните шаги" })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng tugadi={tugadi}
        sarlavha={tr({ uz: <>Qolgan to'rt daqiqada <A>zal nimani so'raydi?</A></>, ru: <>О чём <A>спросит зал</A> в оставшиеся четыре минуты?</> })}
        mentor={<Mentor>{tr({ uz: "«Maydon» pitchining uch slaydi o'tgan modulda tayyor bo'lgan. Ikki slayd qo'shing va har slayd ustida zal nimani so'rashiga qarang.", ru: "Три слайда питча «Maydon» были готовы в прошлом модуле. Добавьте два слайда и посмотрите, о чём зал спрашивает над каждым." })}</Mentor>}
        bashorat={!done && <Bashorat savol={tr(S2_SAVOL)} variantlar={variantlar} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<PitchSahna className={cxx('pr-s2', `q${q}`)} slaydlar={slaydlar} taymer={{ kat, uchlar: q < 3 }} zal={{ pufak }} />}
        harakat={!done && taxmin && (
          <QadamQator jami={3} joriy={q}>
            {q < 3
              ? <QTugma className="pr-bos" onClick={bos}>{q + 1} · {tr(S2_QADAM[q])}</QTugma>
              : <span className="pr-qadam-t">{tr({ uz: "Zal savollari slaydlar ustidan o'tmoqda…", ru: "Вопросы зала проходят над слайдами…" })}</span>}
            {ipucha && <QIzoh>{tr({ uz: "Slaydlar ostidagi tugmani bosing — zal qaysi slaydda nimani so'rashini ko'ring.", ru: "Нажмите кнопку под слайдами — посмотрите, о чём зал спрашивает на каждом слайде." })}</QIzoh>}
          </QadamQator>
        )}
        xulosa={done && <>
          {tx && <NatijaTx togri={taxmin === '2'}>{taxmin === '2'
            ? tr({ uz: 'Taxminingiz mashqdagi taqsimotga mos', ru: "Ваше предположение совпало с разбивкой в упражнении" })
            : <>{tr(TAXMIN_L)}: {tr(tx.t)} · {tr({ uz: 'bu mashqda', ru: "в этом упражнении" })}: <b>{tr({ uz: 'taxminan 2 daqiqa', ru: "примерно 2 минуты" })}</b></>}</NatijaTx>}
          {tr({ uz: 'Besh daqiqalik pitchda besh slayd bor — har biri zalning bitta savoliga javob beradi.', ru: "В пятиминутном питче пять слайдов — каждый отвечает на один вопрос зала." })}
          <span className="pr-nat-iz">{tr({ uz: "Bu mashq uchun boshlang'ich taqsimot — bir slayd qisqaroq, boshqasi uzunroq bo'lishi mumkin; jami 5 daqiqa.", ru: "Это стартовая разбивка для упражнения — один слайд может быть короче, другой длиннее; всего 5 минут." })}</span>
        </>}
      />
      <MentorNote>{tr({ uz: "Raqamlar slaydida sanalgan, bo'lib o'tgan raqam turadi; Keyingi qadam slaydida — hali bo'lmagan raqam. Pufak savollarining zamoniga e'tibor bering: «nima bo'ldi?» va «nima qilasiz?». Besh bo'lakka teng bo'lish — darsdagi kelishuv; o'quvchi o'z pitchida vaqtni boshqacha bo'lishi mumkin, jami 5 daqiqa qoladi.", ru: "На слайде «Цифры» — посчитанное, уже случившееся число; на слайде «Следующий шаг» — число, которого ещё нет. Обратите внимание на время глаголов в вопросах-пузырях: «что стало?» и «что будете делать?». Деление на пять равных частей — договорённость урока; в своём питче ученик может распределить время иначе, всего остаётся 5 минут." })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1, ✔ B; ikkinchi olam — mini-do'kon, P-002) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · raqamlar yoki keyingi qadam', ru: "Проверка · цифры или следующий шаг" })}
    questionText="Mini-do'kon: «Oy oxirigacha buyurtmalar 30 taga yetsin». Qaysi slayd?"
    question={tr({ uz: <h2 className="title h-ask">Mini-do'kon: «Oy oxirigacha buyurtmalar 30 taga yetsin». <A>Qaysi slayd?</A></h2>, ru: <h2 className="title h-ask">Мини-магазин: «Пусть к концу месяца будет 30 заказов». <A>Какой слайд?</A></h2> })}
    options={[
      { uz: 'Raqamlar slaydi — unda aniq son bor', ru: "Слайд «Цифры» — в нём есть точное число" },
      { uz: "Keyingi qadam slaydi — hali bo'lmagan", ru: "Слайд «Следующий шаг» — этого ещё нет" },
      { uz: 'Muammo slaydi — bu buyurtmachilar soni', ru: "Слайд «Проблема» — это число заказчиков" },
      { uz: 'Yechim slaydi — buni sayt qilib beradi', ru: "Слайд «Решение» — это сделает сайт" }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Bu son hali bo'lmagan — u keyingi oyda yetiladigan raqam.", ru: "Этого числа ещё нет — его достигнут в следующем месяце." }}
    explainWrong={{
      0: { uz: "Son bor, lekin u hali sanalmagan — u oldinda.", ru: "Число есть, но его ещё не посчитали — оно впереди." },
      2: { uz: 'Muammo slaydi muammo nechta odamda chiqqanini aytadi.', ru: "Слайд «Проблема» говорит, у скольких людей была проблема." },
      3: { uz: 'Yechim slaydi sayt nima qilishini aytadi.', ru: "Слайд «Решение» говорит, что делает сайт." },
      default: { uz: "Bu son bo'lib o'tganmi yoki hali oldindami?", ru: "Это число уже случилось или ещё впереди?" }
    }} />
);

// ===== SCREEN 4 — AIRBNB (QVoqea, K12; PM-028): nuqtalar · bosqich nomi · jonli taqdimot maketi (katta slayd + 10 ta kichik slayd, ikki qator) · 2/4 bashorat =====
// Manba (o'quvchi ko'rmaydi): PM_Prompt_v8.md bank K12 — investorlar uchun birinchi taqdimot, o'nga yaqin oddiy slayd, muammo → yechim → bozor → mahsulot → jamoa;
//   eng ko'p o'rganiladigan pitchlardan biri, ochiq turadi. Raqamsiz keys: slaydlar soni, yil, pul yozilmaydi (maketda 10 ta karta — «o'nga yaqin», son yozilmaydi).
// SABOQ 8: bosqich gapi Mentorda (har bosqichda almashadi); sahnada — bosqich nomi va jonli maket. SABOQ 2: «Airbnb» o'z rangida, logotipsiz, tanish maket (taqdimot oynasi).
const AB_BOSQICH = [
  { h: { uz: 'Investorlar uchun taqdimot', ru: "Презентация для инвесторов" }, m: { uz: "Investor — loyihaga pul tikadigan odam. Airbnb investorlarga birinchi taqdimotini tayyorlagan. Unda o'nga yaqin oddiy slayd bo'lgan.", ru: "Инвестор — человек, который вкладывает деньги в проект. Airbnb подготовила свою первую презентацию для инвесторов. В ней было около десятка простых слайдов." } },
  { h: null, bashorat: true, m: null },
  { h: { uz: 'Muammodan jamoagacha', ru: "От проблемы до команды" }, m: { uz: "Tartib shunday: muammo, yechim, bozor, mahsulot, jamoa. Bozor — mahsulotni ishlatishi mumkin bo'lgan odamlar qanchaligi, jamoa — loyihani qilayotgan odamlar.", ru: "Порядок такой: проблема, решение, рынок, продукт, команда. Рынок — сколько людей могут пользоваться продуктом, команда — люди, которые делают проект." } },
  { h: { uz: "Ko'p o'rganiladigan pitch", ru: "Питч, который часто разбирают" }, m: { uz: "Bu taqdimot hammaga ochiq turadi va eng ko'p o'rganiladigan pitchlardan biri.", ru: "Эта презентация открыта для всех, и её разбирают чаще многих других питчей." } }
];
const AB_NOM = [{ uz: 'Muammo', ru: "Проблема" }, { uz: 'Yechim', ru: "Решение" }, { uz: 'Bozor', ru: "Рынок" }, { uz: 'Mahsulot', ru: "Продукт" }, { uz: 'Jamoa', ru: "Команда" }];
const AB_TAXMIN = [{ k: 'bosh', t: { uz: 'Boshida', ru: "В начале" } }, { k: 'orta', t: { uz: "O'rtasida", ru: "В середине" } }, { k: 'oxir', t: { uz: 'Oxirida', ru: "В конце" } }];
const AB_SAVOL = { uz: 'Muammo slaydi tartibda qayerda turgan?', ru: "Где по порядку стоял слайд «Проблема»?" };
const Airbnb = () => <span className="pr-airbnb">Airbnb</span>;
// Taqdimot oynasi: chapda katta joriy slayd, o'ngda o'nta kichik slayd (ikki qator, SABOQ 27). b — bosqich, yoz — yozilgan nomlar soni
const AirbnbMaket = ({ b, yoz }) => {
  const joriy = b >= 3 ? 0 : b === 2 ? Math.max(0, Math.min(4, yoz - 1)) : -1;
  return (
    <div className={cxx('pr-ab', `b${b}`)} aria-hidden="true">
      <div className="pr-ab-bar"><i /><i /><i /><Airbnb /></div>
      <div className="pr-ab-ichi">
        <div className={cxx('pr-ab-katta', joriy === 0 && b >= 3 && 'on')} key={b === 1 ? 'q' : joriy}>
          {b === 1 ? <span className="pr-ab-savol">?</span>
            : joriy >= 0 ? <b className="pr-ab-knom">{tr(AB_NOM[joriy])}</b>
              : <><i className="pr-ab-ch uzun" /><i className="pr-ab-ch" /><i className="pr-ab-ch qisqa" /></>}
        </div>
        <div className="pr-ab-kichik">
          {b === 1 && <span className="pr-ab-q">?</span>}
          {Array.from({ length: 10 }, (_, k) => {
            const nom = k < 5 && ((b === 2 && k < yoz) || b >= 3);
            return (
              <span key={k} className={cxx('pr-ab-k', nom && 'nom', b >= 3 && k === 0 && 'on', b === 2 && k === yoz - 1 && 'yangi')} style={{ '--k': k }}>
                {nom ? <b>{tr(AB_NOM[k])}</b> : <><i /><i /></>}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 3 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [yoz, setYoz] = useState(storedAnswer ? 5 : 0);
  const done = b >= 3;
  useEffect(() => {
    if (b !== 2 || yoz >= 5) return undefined;
    const t = setTimeout(() => setYoz(v => v + 1), kamHarakat() ? 0 : (yoz === 0 ? 300 : 420));
    return () => clearTimeout(t);
  }, [b, yoz]);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useXulosaSkroll(done, !!storedAnswer);
  const bq = AB_BOSQICH[b];
  const kutish = !!bq.bashorat && !taxmin;
  const keyingi = () => { if (b < 3) { setB(b + 1); if (b + 1 === 3) setYoz(5); } else onNext(); };
  const tx = AB_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Airbnb /> · {b + 1}/4</>;
  const mentorM = bq.m || AB_BOSQICH[0].m;
  const mk = bq.m ? b : 0;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: "Из мира бизнеса" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={kutish ? tr({ uz: 'Avval belgilang', ru: "Сначала отметьте" }) : b < 3 ? `${tr({ uz: 'Keyingi bosqich', ru: "Следующий этап" })} (${b + 1}/4)` : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Airbnb /> investorlarga birinchi <A>nimani ko'rsatgan?</A></>, ru: <>Что <Airbnb /> <A>показала инвесторам</A> первым делом?</> })}
        nuqtalar={<>
          <Mentor key={`m${mk}`}>{tr(mentorM)}</Mentor>
          <div className="pr-nuq"><span className="pr-nuq-l">{yorliq}</span>{AB_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="pr-voqea" key={b}>
          {b === 0 && <p className="pr-tanish"><Airbnb /> — {tr({ uz: 'begonaning uyida ijaraga turish xizmati', ru: "сервис, где можно пожить в чужом доме за плату" })}</p>}
          {bq.h && <span className="pr-voqea-h">{tr(bq.h)}</span>}
          <Zoomable><AirbnbMaket b={b} yoz={yoz} /></Zoomable>
          {bq.bashorat && !taxmin && <QBashorat yorliq={yorliq} savol={tr(AB_SAVOL)} variantlar={AB_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />}
          {taxmin && !done && <TaxminQator savol={tr(AB_SAVOL)} javob={<>{tr(tx.t)}{b >= 2 && yoz >= 5 && <em className={cxx('pr-tx-bel', taxmin === 'bosh' ? 'ok' : 'err')}>{taxmin === 'bosh' ? ' ✓' : ' ✗'}</em>}</>} />}
          {done && <QXulosa>{tx && <NatijaTx togri={taxmin === 'bosh'}>{taxmin === 'bosh'
            ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: "Ваше предположение оказалось верным" })
            : <>{tr(TAXMIN_L)}: {tr(tx.t).toLowerCase()} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: 'boshida', ru: "в начале" })}</b></>}</NatijaTx>}
            {tr({ uz: 'Airbnb taqdimoti oddiy slaydlardan iborat bo\'lgan va muammodan boshlangan.', ru: "Презентация Airbnb состояла из простых слайдов и начиналась с проблемы." })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Taqdimot internetda ochiq — vaqt bo'lsa, proyektorda bir marta varaqlab ko'rsating. O'quvchi pitchida bozor va jamoa slaydi yo'q: sinfdagi pitchda zal loyiha va odamlarni so'raydi. Investor bilan ishlash — bu darsning mavzusi emas. Airbnb — misol: hamma pitch muammodan boshlanadi degan qoida chiqarmang.", ru: "Презентация открыта в интернете — если будет время, один раз пролистайте её на проекторе. В питче ученика нет слайдов «рынок» и «команда»: в классе зал спрашивает о проекте и людях. Работа с инвесторами — не тема этого урока. Airbnb — пример: не выводите правило, что любой питч начинается с проблемы." })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 3, ✔ D; Airbnb tartibi «Maydon»ga) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Airbnb'dagidek", ru: "Проверка · как у Airbnb" })}
    questionText="Airbnb'dagidek, «Maydon» pitchi qaysi slayd bilan boshlanadi?"
    question={tr({ uz: <h2 className="title h-ask">Airbnb'dagidek, «Maydon» pitchi <A>qaysi slayd bilan</A> boshlanadi?</h2>, ru: <h2 className="title h-ask">Как у Airbnb: <A>с какого слайда</A> начинается питч «Maydon»?</h2> })}
    options={[
      { uz: 'Saytni qurgan jamoani tanishtirgan slayd bilan', ru: "Со слайда, где представлена команда сайта" },
      { uz: "Sayt vaqt kataklarini ko'rsatgan slayd bilan", ru: "Со слайда, где сайт показывает ячейки времени" },
      { uz: 'Saytda A/B testi sonlari yozilgan slayd bilan', ru: "Со слайда с числами A/B-теста сайта" },
      { uz: "O'yinchi band maydonga kelgan slayd bilan", ru: "Со слайда, где игрок пришёл на занятое поле" }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Bizning pitch tartibimizda ham avval muammo keladi, keyin yechim.', ru: "В нашем порядке питча тоже сначала проблема, потом решение." }}
    explainWrong={{
      0: { uz: 'Jamoa Airbnb tartibida oxirida turgan.', ru: "В порядке Airbnb команда стояла в конце." },
      1: { uz: 'Kataklar — yechim; zal hali muammoni bilmaydi.', ru: "Ячейки — это решение; зал ещё не знает проблему." },
      2: { uz: 'Raqamlar muammo va yechimdan keyin keladi.', ru: "Цифры идут после проблемы и решения." },
      default: { uz: 'Airbnb taqdimoti qaysi slayddan boshlangan edi?', ru: "С какого слайда начиналась презентация Airbnb?" }
    }} />
);

// ===== SCREEN 6 — RAQAMLAR SLAYDI (QTushuncha keng: bitta katta slayd — «17» → 3 bo'lak; «17» o'z ustuniga uchadi, zal pufagi har bo'lakda o'zgaradi; A/B bloki) =====
const S6_SAVOL = { uz: "«17» yonida yana nechta bo'lak kerak?", ru: "Сколько ещё частей нужно рядом с «17»?" };
const S6_TAXMIN = [{ k: '1', t: '1' }, { k: '2', t: '2' }, { k: '3', t: '3' }];
const S6_QADAM = [
  { uz: "U nimani sanashini qo'shing", ru: "Добавьте, что оно считает" },
  { uz: "Solishtirishni qo'shing", ru: "Добавьте сравнение" },
  { uz: "Halol gapni qo'shing", ru: "Добавьте честную фразу" }
];
const S6_QATOR = [
  { t: { uz: "«18:00 ni band qilish» tugmasi bilan vaqtni tanlagan 40 brauzerdan 17 tasi band qildi", ru: "С кнопкой «Забронировать 18:00» из 40 браузеров, выбравших время, забронировали 17" }, son: '17', y: { uz: 'nimani sanadi', ru: "что посчитано" } },
  { t: { uz: "«Band qilish» tugmasi bilan — 42 tadan 12", ru: "С кнопкой «Забронировать» — 12 из 42" }, son: '12', y: { uz: 'solishtirish', ru: "сравнение" } },
  { t: { uz: "Farq bor, lekin 82 ta brauzer hali kam — raqamni kuzatib boramiz.", ru: "Разница есть, но 82 браузера пока мало — будем следить за числом." }, y: { uz: 'halol gap', ru: "честная фраза" } }
];
const S6_PUFAK = [{ uz: '17 nima?', ru: "Что значит 17?" }, { uz: "Bu ko'pmi, kammi?", ru: "Это много или мало?" }, { uz: "Bunga ishonsa bo'ladimi?", ru: "Этому можно верить?" }];
const RaqamSlayd = ({ q }) => (
  <div className={cxx('pr-rs', q >= 3 && 'toliq')}>
    <div className="pr-rs-bosh"><i className={cxx('pr-sl-n', q >= 3 && 'ok')}>{q >= 3 ? '✓' : 4}</i><b className="pr-sl-nom">{tr(SLAYDLAR[3].nom)}</b><em className="pr-rs-blok">A/B</em></div>
    {q === 0 && <b className="pr-rs-17" data-uch="rs-17">17</b>}
    <div className="pr-rs-ro">
      {S6_QATOR.map((r, i) => (
        <div key={i} className={cxx('pr-rs-q', i < q ? (i === q - 1 && q < 3 ? 'yozildi' : 'matn') : 'bosh')}>
          {q >= 3 && <em className="pr-rs-y" style={{ '--j': i }}>{tr(r.y)}</em>}
          {i < q ? <span className="pr-rs-t">{tr(r.t)}</span> : <i className="pr-q-bo" />}
          {r.son && i < q && <b className="pr-rs-son" data-uch={i === 0 ? 'rs-17' : undefined}>{r.son}</b>}
        </div>
      ))}
    </div>
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q, 40000);
  const uch = useUchish();
  useXulosaSkroll(done, !!storedAnswer);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'raqamlar', screenIdx: screen, correct: true, picked: true, solved: true, taxmin });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'raqamlar', 0, true, 0);
  }, [done]); // eslint-disable-line
  const bos = () => {
    if (!taxmin || done) return;
    if (q === 0) uch(document.querySelector('.lesson-root .pr-rs-17'), 'rs-17', 640);
    setQ(v => v + 1);
  };
  const tx = S6_TAXMIN.find(v => v.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · raqamlar', ru: "Понятие · цифры" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }) : `${tr({ uz: "Bo'laklarni qo'shing", ru: "Добавьте части" })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng tugadi={tugadi}
        sarlavha={tr({ uz: <>A/B raqami <A>qachon tushunarli</A> bo'ladi?</>, ru: <>Когда число A/B <A>становится понятным</A>?</> })}
        mentor={<Mentor>{tr({ uz: "Raqamlar slaydiga «Maydon» A/B testidan bitta raqam qo'yildi. Bo'laklarni birma-bir qo'shib, zal savoliga qarang.", ru: "На слайд «Цифры» поставили одно число из A/B-теста «Maydon». Добавляйте части по одной и смотрите на вопрос зала." })}</Mentor>}
        bashorat={!done && <Bashorat savol={tr(S6_SAVOL)} variantlar={S6_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="pr-s6">
          <RaqamSlayd q={q} />
          <Zal pufak={done ? 'ok' : { i: 0, t: S6_PUFAK[q] }} n={1} />
        </div>}
        harakat={!done && taxmin && (
          <QadamQator jami={3} joriy={q}>
            <QTugma className="pr-bos" onClick={bos}>{q + 1} · {tr(S6_QADAM[q])}</QTugma>
            {ipucha && <QIzoh>{tr({ uz: "Keyingi bo'lakni qo'shing — zal savoli qanday o'zgarishini ko'ring.", ru: "Добавьте следующую часть — посмотрите, как меняется вопрос зала." })}</QIzoh>}
          </QadamQator>
        )}
        xulosa={done && <>
          {tx && <NatijaTx togri={taxmin === '3'}>{taxmin === '3' ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: "Ваше предположение оказалось верным" }) : <>{tr(TAXMIN_L)}: {tx.t} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>3</b></>}</NatijaTx>}
          {tr({ uz: "Bu misolda raqam tushunarli bo'lishi uchun nimani sanagani, solishtirish va halol gap kerak bo'ldi.", ru: "В этом примере, чтобы число стало понятным, понадобились: что посчитали, сравнение и честная фраза." })}
          <span className="pr-nat-iz"><b>{tr({ uz: 'Halol gap', ru: "Честная фраза" })}</b> — {tr({ uz: "raqam qanday sanalganini va undan qancha xulosa qilsa bo'lishini ochiq aytish.", ru: "открыто сказать, как посчитано число и какой вывод из него можно сделать." })}</span>
        </>}
      />
      <MentorNote>{tr({ uz: "O'tgan modulda gapiradigan slaydda uch qator bor edi: raqam, u nimani sanadi, u nimani ko'rsatadi. A/B raqamiga solishtirish va halol gap qo'shiladi. Bu ekran — A/B bloki; bosh raqam bloki 10-ekranda qo'shiladi (ikki o'lchov aralashmaydi). Sonlar — 8-darsdagi A/B yakuni (B ishga tushgandan beri): A taxminan 29 foiz, B taxminan 43 foiz; «82 ta brauzer» — Mentorning o'sha darsdagi gapi. Sinfdan so'rang: 17 ni yolg'iz ko'rsak, B yaxshiroqmi?", ru: "В прошлом модуле на говорящем слайде было три строки: число, что оно посчитало, что оно показывает. К числу A/B добавляются сравнение и честная фраза. Этот экран — блок A/B; блок главного числа добавится на 10-м экране (два измерения не смешиваются). Числа — итог A/B на 8-м уроке (с запуска B): A примерно 29 процентов, B примерно 43 процента; «82 браузера» — фраза Ментора на том уроке. Спросите класс: если видим только 17, B лучше?" })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 0, ✔ A; ikkinchi olam — AvtoPizza, P-002) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · raqam yonida', ru: "Проверка · рядом с числом" })}
    questionText="AvtoPizza pitchida «haftada 30 buyurtma». Yoniga nima qo'shasiz?"
    question={tr({ uz: <h2 className="title h-ask">AvtoPizza pitchida «haftada 30 buyurtma». <A>Yoniga nima</A> qo'shasiz?</h2>, ru: <h2 className="title h-ask">В питче AvtoPizza «30 заказов в неделю». <A>Что добавите</A> рядом?</h2> })}
    options={[
      { uz: "Nima sanalgani va o'tgan haftadagi soni", ru: "Что посчитано и сколько было на прошлой неделе" },
      { uz: 'Botni qurishga ketgan haftalar soni', ru: "Сколько недель ушло на создание бота" },
      { uz: 'Shu raqamning kattaroq va yorqinroq shrifti', ru: "Шрифт этого числа крупнее и ярче" },
      { uz: "Pitsalarning to'liq menyusi va narxlari", ru: "Полное меню пицц и цены" }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Raqam nimani sanagani va nima bilan solishtirilgani bilinadi.', ru: "Видно, что считает число и с чем его сравнили." }}
    explainWrong={{
      1: { uz: "Bu mehnat raqami — u jarayonni ko'rsatadi.", ru: "Это число о затраченном труде — оно показывает процесс." },
      2: { uz: "Shrift raqamni ko'rsatadi, lekin tushuntirmaydi.", ru: "Шрифт показывает число, но не объясняет его." },
      3: { uz: 'Menyu yechim haqida — raqamga izoh bermaydi.', ru: "Меню — о решении, числу оно пояснения не даёт." },
      default: { uz: 'Raqam nimani sanashi va nima bilan solishtirilgani kerak.', ru: "Нужно, что считает число и с чем его сравнили." }
    }} />
);

// ===== SCREEN 8 — BAHOLASH VARAG'I (QTushuncha saralash: gaplar bittadan katta karta → varaq qatoriga yoki «Yozilmaydi» qutisiga uchadi; o'ngda besh slayd, mos slayd yonadi · nishon feedbackSorter) =====
// FIDBEK_GAPLAR: joy — slayd indeksi (0 muammo · 1 yechim · 3 raqamlar) yoki 'yoz' («Yozilmaydi»); belgi — varaqdagi ✓/✗; yorliq — qutidagi kichik yorliq
const FIDBEK_GAPLAR = [
  { id: 1, joy: 0, belgi: '✓', matn: { uz: "Muammo slaydida 4 / 5 va o'yinchining hikoyasi bor — nima bo'lganini tushundim.", ru: "На слайде «Проблема» есть 4 / 5 и история игрока — я понял, что произошло." } },
  { id: 2, joy: 1, belgi: '✗', matn: { uz: "Yechim slaydida faqat React, NestJS va Neon aytildi — sayt o'yinchiga nima qilishi aytilmadi.", ru: "На слайде «Решение» названы только React, NestJS и Neon — не сказано, что сайт делает для игрока." } },
  { id: 3, joy: 3, belgi: '✗', matn: { uz: "Raqamlar slaydida A/B bor, lekin haftada nechta band bo'layotgani aytilmadi.", ru: "На слайде «Цифры» есть A/B, но не сказано, сколько броней в неделю." } },
  { id: 4, joy: 'yoz', matn: { uz: 'Yaxshi pitch, hammasi yoqdi.', ru: "Хороший питч, всё понравилось." }, yorliq: { uz: "qaysi slayd? nima yetishmadi?", ru: "какой слайд? чего не хватило?" } },
  { id: 5, joy: 'yoz', matn: { uz: 'Bu pitch hech kimga qiziq emas.', ru: "Этот питч никому не интересен." }, yorliq: { uz: 'odam haqida, slayd haqida emas', ru: "о человеке, а не о слайде" } }
];
const NAVBAT8 = [2, 4, 1, 5, 3]; // aralash tartib (MD: «aralash tartibda»)
const S8_XATO = {
  aniqYoz: { uz: "Bu gapda slayd ham, kamchilik ham bor — varaqqa yozing.", ru: "В этой фразе есть и слайд, и недостаток — запишите в лист." },
  umumiyQator: { uz: "Qaysi slayd? Nima yetishmadi? Bu gapda ikkalasi ham yo'q.", ru: "Какой слайд? Чего не хватило? В этой фразе нет ни того, ни другого." },
  boshqaQator: { uz: 'Gapda qaysi slayd aytilganini qayta o\'qing.', ru: "Перечитайте, какой слайд назван во фразе." }
};
const S8_SAVOL = { uz: 'Besh gapdan nechtasi varaqqa yoziladi?', ru: "Сколько из пяти фраз попадёт в лист?" };
const S8_TAXMIN = [{ k: '1', t: '1' }, { k: '2', t: '2' }, { k: '3', t: '3' }];
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const achMiss = useContext(AchMissCtx);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [joy, setJoy] = useState(() => (storedAnswer ? NAVBAT8.slice() : []));
  const [xato, setXato] = useState(null);
  const [yon, setYon] = useState(null);
  const xatoRef = useRef(false);
  const karRef = useRef(null);
  const uch = useUchish();
  const done = joy.length >= NAVBAT8.length;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const joriy = done ? null : FIDBEK_GAPLAR.find(g => g.id === NAVBAT8[joy.length]);
  const ipucha = useIpucha(!!taxmin && !done, joy.length, 40000);
  useXulosaSkroll(done, !!storedAnswer);
  useEffect(() => { if (!yon) return undefined; const t = setTimeout(() => setYon(null), 1000); return () => clearTimeout(t); }, [yon]);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    const first = !xatoRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'fidbek', screenIdx: screen, correct: first, picked: true, solved: true, taxmin });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'fidbek', 0, true, 0);
  }, [done]); // eslint-disable-line
  const qoy = (t) => {
    if (!joriy || !taxmin || isMentor) return;
    if (t === joriy.joy) {
      uch(karRef.current, t === 'yoz' ? `y-${joriy.id}` : `g-${joriy.id}`, 620);
      setJoy(j => [...j, joriy.id]);
      setXato(null);
      if (t !== 'yoz') setYon({ i: t, h: joriy.belgi === '✓' ? 'ok' : 'err' });
      return;
    }
    xatoRef.current = true;
    if (achMiss) achMiss.miss(screen);
    setXato({ k: Date.now(), t: joriy.joy === 'yoz' ? S8_XATO.umumiyQator : t === 'yoz' ? S8_XATO.aniqYoz : S8_XATO.boshqaQator });
  };
  const joylandi = (g) => joy.includes(g.id);
  const kutadi = !!(joriy && taxmin && !isMentor);
  const qatorlar = SLAYDLAR.map((s, i) => {
    const g = FIDBEK_GAPLAR.find(x => x.joy === i && joylandi(x));
    return { i, belgi: g ? g.belgi : null, izoh: g ? tr(g.matn) : '', uch: g ? `g-${g.id}` : undefined, holat: g ? (g.belgi === '✓' ? 'ok' : 'err') : null, onBos: kutadi ? () => qoy(i) : undefined, onDrop: kutadi ? () => qoy(i) : undefined, kutadi };
  });
  const yozilmas = FIDBEK_GAPLAR.filter(g => g.joy === 'yoz' && joylandi(g));
  const tx = S8_TAXMIN.find(v => v.k === taxmin);
  const qutiDr = kutadi ? { onDragOver: (e) => e.preventDefault(), onDrop: (e) => { e.preventDefault(); qoy('yoz'); } } : {};
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · fidbek', ru: "Понятие · фидбек" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }) : `${tr({ uz: 'Gaplarni joylang', ru: "Разложите фразы" })} (${joy.length}/5)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng tugadi={tugadi}
        sarlavha={tr({ uz: <>Qaysi gap bilan <A>pitchni tuzatsa</A> bo'ladi?</>, ru: <>С какой фразой <A>можно исправить питч</A>?</> })}
        mentor={<Mentor>{tr({ uz: "Sinfdosh «Maydon» pitchini tinglab, besh gap aytdi. Har gapni varaqdagi o'z slaydiga yoki «Yozilmaydi» qutisiga joylang.", ru: "Одноклассник послушал питч «Maydon» и сказал пять фраз. Положите каждую фразу к её слайду в листе или в коробку «Не записывается»." })}</Mentor>}
        bashorat={!done && <Bashorat savol={tr(S8_SAVOL)} variantlar={S8_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="pr-s8">
          <PitchSahna tur="qator" className="pr-s8-sl" slaydlar={SLAYDLAR.map((s, i) => ({ id: s.id, nom: tr(s.nom), yon: yon && yon.i === i ? yon.h : null }))} />
          <div className="pr-s8-ast">
            <Varaq className="pr-vq-s8" sarlavha={done ? tr({ uz: "Baholash varag'i", ru: "Лист оценки" }) : null} qatorlar={qatorlar} />
            <div className="pr-s8-ong">
              {!done && taxmin && joriy && <div className="pr-s8-h">
                <div className="pr-dasta">
                  {NAVBAT8.length - joy.length > 1 && <i className="pr-dasta-q q1" aria-hidden="true" />}
                  {NAVBAT8.length - joy.length > 2 && <i className="pr-dasta-q q2" aria-hidden="true" />}
                  <button type="button" ref={karRef} key={`${joriy.id}-${xato ? xato.k : 0}`} className={cxx('pr-gap', xato && 'silk')} draggable={!isMentor}
                    onDragStart={(e) => { try { e.dataTransfer.setData('text/plain', String(joriy.id)); } catch { /* sudrash ishlamasa — bosish yetadi */ } }}>
                    <span className="pr-gap-n">{joy.length + 1} / 5</span>
                    <span className="pr-gap-t">«{tr(joriy.matn)}»</span>
                  </button>
                </div>
                {xato && <QXato key={xato.k}>{tr(xato.t)}</QXato>}
                {!xato && ipucha && <QIzoh>{tr({ uz: "Gapda slayd nomi va nima yetishmagani bormi? Shunga qarab joyini tanlang.", ru: "Есть ли во фразе название слайда и чего не хватило? По этому выберите место." })}</QIzoh>}
                <NishonQatori screen={screen} />
              </div>}
              <button type="button" className={cxx('pr-joy', 'pr-quti', kutadi && 'kutadi', yozilmas.length && 'bor')} onClick={kutadi ? () => qoy('yoz') : undefined} disabled={!kutadi && !yozilmas.length} {...qutiDr}>
              <span className="pr-quti-l">{tr({ uz: 'Yozilmaydi', ru: "Не записывается" })}</span>
              {yozilmas.map(g => <span key={g.id} className="pr-quti-g" data-uch={`y-${g.id}`}><span>«{tr(g.matn)}»</span><em>{tr(g.yorliq)}</em></span>)}
            </button>
              {done && <QXulosa>
          {tx && <NatijaTx togri={taxmin === '3'}>{taxmin === '3' ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: "Ваше предположение оказалось верным" }) : <>{tr(TAXMIN_L)}: {tx.t} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>3</b></>}</NatijaTx>}
          {tr({ uz: "Fidbek — pitchdagi aniq joy haqidagi fikr yoki taklif. Slayd va kamchilik aytilsa, u qattiq, lekin hurmatli.", ru: "Фидбек — мнение или предложение о конкретном месте питча. Если назван слайд и недостаток, он жёсткий, но уважительный." })}
          <span className="pr-nat-iz">{tr({ uz: "Har slayd uchun zal savoli yozilgan bu varaq baholash varag'i deyiladi.", ru: "Этот лист, где для каждого слайда записан вопрос зала, называется листом оценки." })}</span>
              </QXulosa>}
            </div>
          </div>
        </div>}
      />
      <MentorNote>{tr({ uz: "«Qattiq» — kamchilik yashirilmaydi, ✗ qo'yiladi; «hurmatli» — gap slayd haqida, odam haqida emas. 1-gap ham foydali: ✓ ham sabab bilan aytiladi. 3-gap «Maydon» pitchining haqiqiy kamchiligi: bosh raqamning hozirgi qiymati slaydda yo'q — 10-ekranda o'quvchi o'z raqamini Database'dan oladi (aytib bermang).", ru: "«Жёсткий» — недостаток не скрывают, ставят ✗; «уважительный» — фраза о слайде, а не о человеке. Первая фраза тоже полезна: ✓ тоже ставят с причиной. Третья фраза — настоящий недостаток питча «Maydon»: текущего значения главного числа на слайде нет — на 10-м экране ученик возьмёт своё число из Database (не подсказывайте)." })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 9 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s9 = 2, ✔ C; slayd va kamchilik birga) =====
const Screen9 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: "Итоговая проверка" })}
    questionText="Qaysi fidbek sinfdoshingizga pitchini tuzatishga yordam beradi?"
    question={tr({ uz: <h2 className="title h-ask">Qaysi fidbek sinfdoshingizga <A>pitchini tuzatishga</A> yordam beradi?</h2>, ru: <h2 className="title h-ask">Какой фидбек поможет однокласснику <A>исправить питч</A>?</h2> })}
    options={[
      { uz: '«Slaydlaringiz menga juda yoqdi, rahmat»', ru: "«Ваши слайды мне очень понравились, спасибо»" },
      { uz: '«Siz yaxshi gapira olmaysiz, afsus»', ru: "«Вы не умеете хорошо говорить, жаль»" },
      { uz: '«Raqamlar slaydida nimani sanashi yo\'q»', ru: "«На слайде „Цифры“ не сказано, что считает число»" },
      { uz: '«Slaydlarni boshidan qayta yozib chiqing»', ru: "«Перепишите слайды с самого начала»" }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Unda slayd va undagi kamchilik aniq aytilgan.', ru: "В нём точно названы слайд и его недостаток." }}
    explainWrong={{
      0: { uz: 'Maqtov yoqimli, lekin qaysi slaydni tuzatish kerak?', ru: "Похвала приятна, но какой слайд исправлять?" },
      1: { uz: 'Bu odam haqida — qaysi slaydda nima yetishmadi?', ru: "Это о человеке — чего не хватило на каком слайде?" },
      3: { uz: 'Qaysi slaydda nima yetishmagani aytilmagan.', ru: "Не сказано, чего не хватило на каком слайде." },
      default: { uz: 'Slayd va kamchilik aytilgan fidbekni toping.', ru: "Найдите фидбек, где названы слайд и недостаток." }
    }} />
);

// ===== SCREEN 10 — KOD YOZISH: BOSH RAQAM (QKod, Neon varianti: chapda vazifa + son + darvoza, o'ngda Neon SQL Editor maketi + ixcham Raqamlar slaydi; tayanch 9.1) =====
// SQL bajarilmaydi va tekshirilmaydi (dars Neon'ga ulanmaydi) — signal: o'quvchi yozgan son + darvoza. Bo'sh joy maketda o'quvchi qo'li bilan yoziladi (bloklamaydi).
const S10_VAZIFA = [
  { uz: "Neon'da loyihangizni oching va SQL Editor'ga o'ting.", ru: "Откройте свой проект в Neon и перейдите в SQL Editor." },
  { uz: "Bo'sh joyni to'ldirib, SQL'ni o'zingiz yozing va «Run»ni bosing.", ru: "Заполните пропуск, напишите SQL сами и нажмите «Run»." },
  { uz: "Neon ko'rsatgan sonni pastdagi maydonga yozing.", ru: "Впишите число, которое показал Neon, в поле ниже." }
];
const S10_DARVOZA = [
  { k: 'son', t: { uz: 'Haftada 11 band', ru: "11 броней в неделю" }, x: { uz: "Zal o'sishni ko'rmaydi — boshlanish soni ham kerak.", ru: "Зал не видит роста — нужно и начальное число." } },
  { k: 'ok', t: { uz: 'Haftada 6 dan 11 ga', ru: "За неделю с 6 до 11" }, ok: true },
  { k: 'farq', t: { uz: "Haftada 5 ta ko'proq band", ru: "На 5 броней в неделю больше" }, x: { uz: 'Farq bor, lekin zal qayerdan boshlanganini bilmaydi.', ru: "Разница есть, но зал не знает, откуда начали." } }
];
const S10_DSAVOL = { uz: "OKR'da «hozir 6» edi, SQL bugun 11 ko'rsatdi. Slaydga nima yoziladi?", ru: "В OKR было «сейчас 6», сегодня SQL показал 11. Что пишем на слайд?" };
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — o'quvchi matni emas, qolip API nomi (9-Modul 1-dars yechimi)
const QKOD_ONG = 'muh\u0061rrir';
const okrHozir = () => { const o = lsGet(KEY_OKR); const h = o && Array.isArray(o.natijalar) && o.natijalar[0] ? String(o.natijalar[0].hozir ?? '').trim() : ''; return /^\d+$/.test(h) ? h : ''; };
// Neon SQL Editor maketi (chizilgan, logotipsiz): SQL — bo'sh joy o'quvchi qo'li bilan · «Run» · natija jadvali `count`
const NeonMaket = ({ ustun, setUstun, ustunOk, son, yopiq }) => {
  const k = useSanoq(son == null ? null : son, 700);
  return (
    <div className="pr-neon">
      <div className="pr-neon-bar"><i /><i /><i /><span className="pr-neon-tab">SQL Editor</span><span className={cxx('pr-neon-run', ustunOk && son == null && 'kutadi')}>Run</span></div>
      <pre className="pr-neon-sql"><span className="kw">SELECT</span> COUNT(*){'\n'}<span className="kw">FROM</span> bandlar{'\n'}<span className="kw">WHERE</span> <input type="text" value={ustun} disabled={yopiq} onChange={e => setUstun(e.target.value)} placeholder="______" aria-label={tr({ uz: "Bo'sh joy", ru: "Пропуск" })} spellCheck={false} maxLength={14} className={cxx('pr-neon-in', ustunOk && 'ok', !ustunOk && !ustun && !yopiq && 'kutadi')} /> {'>'}= NOW() - INTERVAL <span className="str">'7 days'</span>;</pre>
      <div className="pr-neon-jadval">
        <span className="pr-neon-th">count</span>
        <span key={son == null ? 'q' : 'n'} className={cxx('pr-neon-td', son != null && 'bor')}>{son == null ? '?' : k}</span>
      </div>
    </div>
  );
};
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [ustun, setUstun] = useState(() => (storedAnswer ? 'yaratilgan' : ''));
  const [oldin, setOldin] = useState(() => (storedAnswer && storedAnswer.oldin != null ? String(storedAnswer.oldin) : okrHozir()));
  const [son, setSon] = useState(() => (storedAnswer && storedAnswer.son != null ? String(storedAnswer.son) : ''));
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'ok' : null));
  const [miss, setMiss] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  useXulosaSkroll(done, !!storedAnswer);
  const ustunOk = norm(ustun) === 'yaratilgan';
  const sonT = son.trim();
  const sonOk = /^\d{1,7}$/.test(sonT);
  const oldinT = oldin.trim();
  const pick = (g) => {
    if (gpick || isMentor || !sonOk) return;
    if (g.ok) { setGpick(g.k); setMiss(null); } else setMiss({ k: g.k, n: Date.now() });
  };
  const bajardim = () => {
    if (done || !sonOk || !gpick) return;
    setDone(true);
    const o = /^\d{1,7}$/.test(oldinT) ? Number(oldinT) : null;
    const saq = lsGet(KEY_PITCH) || {};
    lsSet(KEY_PITCH, { ...saq, neon: { oldin: o, hozir: Number(sonT) }, savedAt: Date.now() });
    onAnswer(screen, { stage: 'neon', screenIdx: screen, son: Number(sonT), oldin: o, solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'neon', 0, true, 0);
  };
  const qulf = !sonOk ? tr({ uz: "Avval Neon ko'rsatgan sonni yozing", ru: "Сначала впишите число из Neon" }) : !gpick ? tr({ uz: 'Avval slayd savolini yeching', ru: "Сначала ответьте на вопрос о слайде" }) : null;
  const boshMatn = <>{tr({ uz: 'haftada', ru: "за неделю" })} <b>{oldinT || '…'}</b> {tr({ uz: 'dan', ru: "с" })} <b>{sonT}</b> {tr({ uz: 'ga', ru: "до" })}</>;
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · Neon', ru: "Пишем код · Neon" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bajardim — SQL ishladi, son yozildi', ru: "Готово — SQL сработал, число записано" })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Bosh raqamni Database'dan sanaydigan <A>SQL yozamiz</A>.</>, ru: <>Пишем <A>SQL</A>, который считает главное число в Database.</> })}
        mentor={<Mentor>{tr({ uz: "Bosh raqamni avval ham shu SQL bilan sanagansiz — endi bugungi sonni olib, OKR'dagi «hozir» bilan solishtirasiz. Mentor misolida oy boshida 6 edi.", ru: "Главное число вы уже считали этим SQL — теперь возьмёте сегодняшнее число и сравните со «сейчас» в OKR. В примере Ментора в начале месяца было 6." })}</Mentor>}
        vazifa={<>
          <ol className="pr-vazifa">{S10_VAZIFA.map((v, i) => <li key={i} className={cxx(((i === 0 && (ustunOk || sonOk)) || (i === 1 && ustunOk) || (i === 2 && sonOk)) && 'ok')}><i>{(i === 0 && (ustunOk || sonOk)) || (i === 1 && ustunOk) || (i === 2 && sonOk) ? '✓' : i + 1}</i><span>{tr(v)}</span></li>)}</ol>
          <div className="pr-son-ro">
            <label className="pr-son-m"><span>{tr({ uz: "OKR'dagi «hozir»:", ru: "«Сейчас» в OKR:" })}</span>
              <input type="text" inputMode="numeric" value={oldin} disabled={done || isMentor} onChange={e => setOldin(e.target.value)} placeholder="?" maxLength={7} /></label>
            <label className="pr-son-m"><span>{tr({ uz: 'Oxirgi 7 kunda:', ru: "За последние 7 дней:" })}</span>
              <input type="text" inputMode="numeric" value={son} disabled={done || isMentor} onChange={e => setSon(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') bajardim(); }} placeholder={tr({ uz: "Neon ko'rsatgan son", ru: "Число из Neon" })} maxLength={8} className={cxx(!sonT && !done && !isMentor && 'pr-kutadi')} /></label>
          </div>
          {sonT && !sonOk && <QXato>{tr({ uz: "Neon ko'rsatgan sonni shu yerga yozing.", ru: "Впишите сюда число, которое показал Neon." })}</QXato>}
          {sonOk && <div className={cxx('pr-darvoza', !gpick && 'pr-kutadi')}>
            <span className="pr-darvoza-s">{tr(S10_DSAVOL)}</span>
            <div className="pr-darvoza-t">{S10_DARVOZA.map(g => {
              const silk = miss && miss.k === g.k;
              return <QChip key={silk ? `${g.k}-${miss.n}` : g.k} silk={silk} holat={gpick === g.k ? 'ok' : silk ? 'err' : undefined} disabled={!!gpick && gpick !== g.k} onClick={() => pick(g)}>{tr(g.t)}</QChip>;
            })}</div>
            {miss && <QXato>{tr(S10_DARVOZA.find(g => g.k === miss.k).x)}</QXato>}
          </div>}
        </>}
        yordam={<div className="pr-yordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
          {yordam && <>
            <QIzoh>{fmtCode(tr({ uz: "Jadvalingiz nomi boshqacha bo'lsa — bosh raqamingiz yoziladigan jadval nomini qo'ying. SQL Editor'da `\\dt` yozsangiz, jadvallar ro'yxati chiqadi.", ru: "Если таблица называется иначе — поставьте имя таблицы, куда пишется ваше главное число. Если написать в SQL Editor `\\dt`, появится список таблиц." }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: "Eslatma: bo'sh joyga band qilingan paytni saqlaydigan ustun — `yaratilgan` yoziladi. SQL darslaridan: `SELECT` — ma'lumotni ko'rsatadi · `WHERE` — qaysi qatorlar olinishi · `COUNT(*)` — qatorlarni sanaydi · `NOW() - INTERVAL '7 days'` — hozirdan 7 kun oldin.", ru: "Напоминание: в пропуск пишется столбец, где хранится время брони, — `yaratilgan`. Из уроков SQL: `SELECT` — показывает данные · `WHERE` — какие строки берутся · `COUNT(*)` — считает строки · `NOW() - INTERVAL '7 days'` — 7 дней назад от текущего момента." }))}</QIzoh>
            <QIzoh>{tr({ uz: "Database'dan bosh raqamni ola olmasangiz — uni o'ylab topmang: Raqamlar slaydiga sizda bor raqamni va u qayerdan olinganini yozing (dashboard va Umami boshqa narsani sanaydi).", ru: "Если не получается взять главное число из Database — не придумывайте его: напишите на слайд «Цифры» число, которое у вас есть, и откуда оно (дашборд и Umami считают другое)." })}</QIzoh>
          </>}
        </div>}
        bajardim={done
          ? <QXulosa>{tr({ uz: "Bosh raqamingiz Database'dan olindi — u Raqamlar slaydiga yozildi.", ru: "Ваше главное число взято из Database — оно записано на слайд «Цифры»." })}</QXulosa>
          : <QTugma className={qulf ? undefined : 'pr-bos'} disabled={!!qulf || isMentor} onClick={bajardim}>{qulf || tr({ uz: 'Bajardim — SQL ishladi, son yozildi', ru: "Готово — SQL сработал, число записано" })}</QTugma>}
        {...{ [QKOD_ONG]: <div className="pr-kod-ong">
          <NeonMaket ustun={ustun} setUstun={setUstun} ustunOk={ustunOk} son={sonOk ? Number(sonT) : null} yopiq={done || isMentor} />
          <QIzoh>{tr({ uz: "Sizning soningiz shu katakda chiqadi — u sizning Database'ingizdan.", ru: "Ваше число появится в этой ячейке — оно из вашей Database." })}</QIzoh>
          {sonOk && <QIzoh>{tr({ uz: "Bu SQL o'yin kunini emas, band yozilgan vaqtni sanaydi. Sonda o'z tekshiruv bandlaringiz ham bo'lishi mumkin.", ru: "Этот SQL считает не день игры, а время записи брони. В числе могут быть и ваши проверочные брони." })}</QIzoh>}
          <div className={cxx('pr-mini', gpick && 'toliq')}>
            <span className="pr-sl-bosh"><i className={cxx('pr-sl-n', gpick && 'ok')}>{gpick ? '✓' : 4}</i><b className="pr-sl-nom">{tr(SLAYDLAR[3].nom)}</b></span>
            <span className={cxx('pr-q', gpick ? 'q-yozildi' : 'q-bosh')}><em className="pr-q-y">{tr({ uz: 'Bosh raqam', ru: "Главное число" })}</em>{gpick ? <span key="t" className="pr-q-t">{boshMatn}</span> : <span className="pr-q-t pr-q-kul">{tr({ uz: 'haftada … dan … ga', ru: "за неделю с … до …" })}</span>}</span>
          </div>
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      >
        <MentorNote>{fmtCode(tr({ uz: "Laptopdagi va Render'dagi Backend bitta Neon Database'ga yozadi — o'quvchining o'z tekshiruv bandlari ham sanaladi: «11 ta odam band qildi» emas — «oxirgi 7 kunda `bandlar` ga 11 ta band yozildi, ichida tekshiruvlarim ham bor». Mentor misolidagi 11 — kursdagi haqiqiy bosh raqam; o'quvchi SQL soni bilan aralashtirilmaydi. Telefon raqamlarini ekranga chiqarmang: `SELECT *` emas — faqat son. `NOW()` Database vaqtida ishlaydi; 7 kunlik oraliq uchun Toshkent vaqti farqi sezilmaydi. Tez tugatganlar: `SELECT kun, soat FROM bandlar WHERE yaratilgan >= NOW() - INTERVAL '7 days';` — qatorlar orasida o'z tekshiruv bandlari bormi, ko'rsin (ism va telefon so'ralmaydi).", ru: "Backend на ноутбуке и на Render пишет в одну Neon Database — считаются и проверочные брони ученика: не «11 человек забронировали», а «за 7 дней в `bandlar` записано 11 броней, среди них и мои проверки». 11 в примере Ментора — реальное главное число курса; с числом SQL ученика не смешивается. Не выводите номера телефонов: не `SELECT *` — только число. `NOW()` работает по времени Database; для 7 дней разница с Ташкентом незаметна. Кто закончил быстро: `SELECT kun, soat FROM bandlar WHERE yaratilgan >= NOW() - INTERVAL '7 days';` — пусть посмотрят, есть ли среди строк свои проверочные брони (имя и телефон не запрашиваются)." }))}</MentorNote>
      </QKod>
    </Stage>
  );
};

// ===== O'QUVCHI PITCHI — 11, 12, 13-ekran uchun bitta manba (forma ↔ saqlanadigan sxema pm-m8d11-pitch, tayanch 8) =====
const boshP = () => ({ muammo: { raqam: '', hikoya: '' }, yechim: '', foydalanuvchi: '', raqamlar: { bosh: '', ab: '', halol: '' }, keyingi: '' });
const pDan = (sl) => ({
  muammo: { raqam: (sl.muammo && sl.muammo.raqam) || '', hikoya: (sl.muammo && sl.muammo.hikoya) || '' },
  yechim: sl.yechim || '', foydalanuvchi: sl.foydalanuvchi || '',
  raqamlar: { bosh: (sl.raqamlar && sl.raqamlar.bosh && sl.raqamlar.bosh.nima) || '', ab: sl.raqamlar && sl.raqamlar.ab ? [sl.raqamlar.ab.a, sl.raqamlar.ab.b].filter(Boolean).join('\n') : '', halol: (sl.raqamlar && sl.raqamlar.halolGap) || '' },
  keyingi: sl.keyingi || ''
});
// A/B maydoni bitta: birinchi qatori — a, qolgani — b (11-FILTR 2: bosh raqam va A/B alohida)
const sxema = (p, neon) => {
  const ab = String(p.raqamlar.ab || '').split(/\n+/).map(x => x.trim()).filter(Boolean);
  return {
    muammo: { raqam: p.muammo.raqam.trim(), hikoya: p.muammo.hikoya.trim() }, yechim: p.yechim.trim(), foydalanuvchi: p.foydalanuvchi.trim(),
    raqamlar: { bosh: { nima: p.raqamlar.bosh.trim(), oldin: neon ? neon.oldin : null, hozir: neon ? neon.hozir : null }, ab: { a: ab[0] || '', b: ab.slice(1).join(' ') }, halolGap: p.raqamlar.halol.trim() },
    keyingi: p.keyingi.trim()
  };
};
const pitchYoz = (qism) => { const s = lsGet(KEY_PITCH) || {}; lsSet(KEY_PITCH, { ...s, ...qism, savedAt: Date.now() }); };
const pitchOqi = () => { const s = lsGet(KEY_PITCH); return s && s.slaydlar ? pDan(s.slaydlar) : null; };
const olish = (p, k) => k.split('.').reduce((o, x) => (o ? o[x] : ''), p) || '';
const qoyish = (p, k, v) => { const [a, b] = k.split('.'); return b ? { ...p, [a]: { ...p[a], [b]: v } } : { ...p, [a]: v }; };
const S11_MAYDON = [
  [{ k: 'muammo.raqam', l: { uz: 'Raqam', ru: "Число" }, ph: { uz: 'Necha kishidan nechtasi shu muammoni aytdi?', ru: "Сколько человек из скольких назвали эту проблему?" } },
    { k: 'muammo.hikoya', l: { uz: 'Hikoya', ru: "История" }, ph: { uz: "Kim edi, nima qilmoqchi edi, nima bo'ldi?", ru: "Кто это был, что хотел сделать, что случилось?" }, kop: true }],
  [{ k: 'yechim', l: { uz: 'Yechim', ru: "Решение" }, ph: { uz: 'Saytingiz shu muammoni qanday hal qiladi?', ru: "Как ваш сайт решает эту проблему?" }, kop: true }],
  [{ k: 'foydalanuvchi', l: { uz: 'Foydalanuvchi', ru: 'Пользователь' }, ph: { uz: 'Sinovda odam nimaga qoqildi, siz nimani tuzatdingiz?', ru: "На чём споткнулся человек на тесте, что вы исправили?" }, kop: true }],
  [{ k: 'raqamlar.bosh', l: { uz: 'Bosh raqam', ru: "Главное число" }, ph: { uz: 'Nima sanaldi, qanchadan qanchaga?', ru: "Что посчитано, со скольких до скольких?" } },
    { k: 'raqamlar.ab', l: { uz: 'A/B', ru: "A/B" }, ph: { uz: 'A va B sonlari, nimani sanaydi?', ru: "Числа A и B, что они считают?" }, kop: true, ixtiyoriy: true },
    { k: 'raqamlar.halol', l: { uz: 'Halol gap', ru: "Честная фраза" }, ph: { uz: 'Qanday sanaldi, xulosaga yetadimi?', ru: "Как посчитано, хватает ли для вывода?" }, kop: true }],
  [{ k: 'keyingi', l: { uz: 'Keyingi qadam', ru: "Следующий шаг" }, ph: { uz: "Keyingi oyda nima qilasiz va qaysi raqam o'sadi?", ru: "Что сделаете в следующем месяце и какое число вырастет?" }, kop: true }]
];
// Tekshiruv (PM-108; ≤60 belgi): blok — chiqarishni to'xtatadi · yo'naltiradi — slayd chiqadi, lekin `err` fon bilan. node sinovi: scratchpad 11-qurish/tekshir-sinov.mjs
const S11_XABAR = {
  son: { uz: 'Bosh raqamga bor soningizni va manbasini yozing.', ru: "Впишите в «Главное число» своё число и его источник." },
  halol: { uz: "Raqam qanday sanaldi va xulosaga yetadimi — yozing.", ru: "Напишите, как посчитано число и хватает ли для вывода." },
  hamma: { uz: 'Hikoya bitta odam haqida — u kim edi?', ru: "История об одном человеке — кто это был?" },
  texno: { uz: "Bu texnologiya — sayt odamga nima qilib beradi?", ru: "Это технология — что сайт делает для человека?" },
  keyinSon: { uz: "Qaysi raqam o'sadi — sonini ham yozing.", ru: "Какое число вырастет — напишите и его." }
};
const RE_HAMMA = /(^|[^a-z'])(hamma|ko'pchilik|har kim)|(^|[^а-яё])(все|всем|всех|многие|многим|каждый|любой)([^а-яё]|$)/; // ru rejimida o'quvchi ruscha yozadi
const RE_TEXNO = /(^|[^a-z])(react|nestjs|node|neon|postgresql|render|netlify)([^a-z]|$)/;
const tekshir11 = (i, p) => {
  const t = (k) => norm(olish(p, k));
  if (i === 3) {
    if (!/\d/.test(t('raqamlar.bosh'))) return { kod: 'son', blok: true };
    if (!t('raqamlar.halol')) return { kod: 'halol', blok: true };
    return null;
  }
  if (i === 0 && RE_HAMMA.test(t('muammo.hikoya'))) return { kod: 'hamma' };
  if (i === 2 && RE_HAMMA.test(t('foydalanuvchi'))) return { kod: 'hamma' };
  if (i === 1 && RE_TEXNO.test(t('yechim'))) return { kod: 'texno' };
  if (i === 4 && t('keyingi') && !/\d/.test(t('keyingi'))) return { kod: 'keyinSon' };
  return null;
};
const pQatorlar = (p, i) => {
  const t = (v) => String(v || '').trim();
  if (i === 0) return [{ k: 'r', t: t(p.muammo.raqam) }, { k: 'h', t: t(p.muammo.hikoya) ? `«${t(p.muammo.hikoya)}»` : '' }];
  if (i === 1) return [{ k: 'y', t: t(p.yechim) }];
  if (i === 2) return [{ k: 'f', t: t(p.foydalanuvchi) }];
  if (i === 3) return [{ k: 'b', t: t(p.raqamlar.bosh), yorliq: tr({ uz: 'Bosh raqam', ru: "Главное число" }) }, ...(t(p.raqamlar.ab) ? [{ k: 'ab', t: t(p.raqamlar.ab), yorliq: 'A/B' }] : []), { k: 'h', t: t(p.raqamlar.halol), yorliq: tr({ uz: 'Halol gap', ru: "Честная фраза" }) }];
  return [{ k: 'k', t: t(p.keyingi) }];
};
const s11Bosh = (answers) => {
  const saq = pitchOqi();
  if (saq) return saq;
  const p = boshP();
  const p7 = lsGet(KEY_P7) || {};
  p.muammo.raqam = p7.raqam || ''; p.muammo.hikoya = p7.muammoHikoya || ''; p.yechim = p7.yechim || ''; p.foydalanuvchi = p7.sinovHikoya || '';
  const n = (answers && answers[10]) || null;
  if (n && n.son != null) p.raqamlar.bosh = `${tr({ uz: 'haftada', ru: "за неделю" })} ${n.oldin != null ? n.oldin : '…'} ${tr({ uz: 'dan', ru: "с" })} ${n.son} ${tr({ uz: 'ga', ru: "до" })}`;
  const yol = lsGet(KEY_YOL);
  if (yol && yol.keyin) p.keyingi = yol.keyin;
  return p;
};
const maydonP = () => ({ muammo: { raqam: `${MAYDON.raqam} · ${tr(MAYDON.raqamIzoh)}`, hikoya: tr(MAYDON.hikoya) }, yechim: tr(MAYDON.yechim), foydalanuvchi: `${tr(MAYDON.sinov)} ${tr(MAYDON.tuzatish)}`, raqamlar: { bosh: tr(MAYDON.boshQator).replace(/^[^:]*:\s*/, ''), ab: `${tr(MAYDON.abB)}\n${tr(MAYDON.abA)}`, halol: tr(MAYDON.halol) }, keyingi: `${tr(MAYDON.keyingi1)}. ${tr(MAYDON.keyingi2t)}` });
const KulrangQator = ({ children }) => <p className="pr-kulrang">{children}</p>;
const MaydonInput = ({ value, onChange, placeholder, kopQator, xato, disabled, onEnter }) => {
  const ref = useRef(null);
  useLayoutEffect(() => { const el = ref.current; if (!el || !kopQator) return; el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 120)}px`; }, [value, kopQator]);
  return <textarea ref={ref} rows={1} value={value} placeholder={placeholder} disabled={disabled} className={cxx('pr-kirit', xato && 'err')} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !kopQator && onEnter) { e.preventDefault(); onEnter(); } }} />;
};
// Bitta slayd formasi (11 va 13-ekran): maydonlar · kulrang qatorlar · QXato · Yordam · «Slaydga chiqarish» o'ngda (187)
const SlaydForma = ({ i, qor, setQor, ogoh, ustida, yordamMatn, onChiqar, chiqarYoq, sarlavha, uchRef }) => {
  const [yordam, setYordam] = useState(false);
  return (
    <div className={cxx('pr-forma', ogoh && 'xato')} key={i}>
      <span className="pr-forma-h">{sarlavha}</span>
      {S11_MAYDON[i].map((m, j) => (
        <label key={m.k} className="pr-mayd" ref={j === 0 ? uchRef : undefined}>
          <span>{tr(m.l)}</span>
          <MaydonInput kopQator={m.kop} value={olish(qor, m.k)} placeholder={tr(m.ph)} xato={ogoh && ((ogoh.kod === 'son' && m.k === 'raqamlar.bosh') || (ogoh.kod === 'halol' && m.k === 'raqamlar.halol'))} onChange={(v) => setQor(q => qoyish(q, m.k, v))} onEnter={onChiqar} />
          {ustida && ustida[m.k] && <KulrangQator>{ustida[m.k]}</KulrangQator>}
        </label>
      ))}
      {ogoh && <QXato key={ogoh.kod}>{tr(ogoh.t)}</QXato>}
      <div className="pr-forma-t">
        {yordamMatn && <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>}
        <QTugma className={chiqarYoq ? undefined : 'pr-bos'} disabled={chiqarYoq} onClick={onChiqar}>{tr({ uz: 'Slaydga chiqarish', ru: "Вывести на слайд" })}</QTugma>
      </div>
      {yordam && yordamMatn && <QIzoh>{yordamMatn}</QIzoh>}
    </div>
  );
};

// ===== SCREEN 11 — MUSTAQIL ISH (QMustaqil: Sahna — besh slayd, joriysi accent, bosilsa o'sha slayd formasi; bir vaqtda bitta forma · artefakt pm-m8d11-pitch) =====
const Screen11 = ({ screen, storedAnswer, answers, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [p, setP] = useState(() => (storedAnswer && storedAnswer.p) || s11Bosh(answers));
  const [holat, setHolat] = useState(() => (storedAnswer && storedAnswer.holat) || [null, null, null, null, null]);
  const birinchi = (h) => h.findIndex(x => !x);
  const [faol, setFaol] = useState(() => (isMentor ? null : birinchi((storedAnswer && storedAnswer.holat) || [null])));
  const [qor, setQor] = useState(() => (storedAnswer && storedAnswer.p) || s11Bosh(answers));
  const [urindi, setUrindi] = useState(false);
  const [yangi, setYangi] = useState(null);
  const sentRef = useRef(!!(storedAnswer && storedAnswer.solved));
  const nomRef = useRef(null);
  const uch = useUchish();
  const n = holat.filter(Boolean).length;
  const done = n >= 5 && faol == null;
  useXulosaSkroll(done && !isMentor, !!(storedAnswer && storedAnswer.solved));
  useEffect(() => { if (!yangi) return undefined; const t = setTimeout(() => setYangi(null), 1100); return () => clearTimeout(t); }, [yangi]);
  const okr = useMemo(() => lsGet(KEY_OKR), []);
  const gip = useMemo(() => lsGet(KEY_GIP), []);
  const neon = useMemo(() => { const a = answers && answers[10]; return a && a.son != null ? { oldin: a.oldin ?? null, hozir: a.son } : ((lsGet(KEY_PITCH) || {}).neon || null); }, []); // eslint-disable-line
  const ogohH = faol != null ? tekshir11(faol, qor) : null;
  const ogoh = ogohH && (!ogohH.blok || urindi) ? { ...ogohH, t: S11_XABAR[ogohH.kod] } : null;
  const och = (i) => { if (isMentor) return; setFaol(i); setQor(p); setUrindi(false); };
  const chiqar = () => {
    if (faol == null) return;
    const r = tekshir11(faol, qor);
    if (r && r.blok) { setUrindi(true); return; }
    uch(nomRef.current, `sl-${faol}`, 620);
    const yp = { ...p };
    S11_MAYDON[faol].forEach(m => { Object.assign(yp, qoyish(yp, m.k, olish(qor, m.k))); });
    const yh = holat.map((h, i) => (i === faol ? (r ? 'xato' : 'ok') : h));
    setP(yp); setHolat(yh); setYangi(faol); setUrindi(false);
    const keyin = (() => { for (let s = 1; s <= 5; s++) { const j = (faol + s) % 5; if (!yh[j]) return j; } return null; })();
    setFaol(keyin); setQor(yp);
    pitchYoz({ slaydlar: sxema(yp, neon) });
    const tayyor = yh.every(Boolean);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, p: yp, holat: yh, picked: true, solved: tayyor, correct: tayyor });
    if (tayyor && !sentRef.current && live && live.mode === 'student') { sentRef.current = true; live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
  };
  const korP = isMentor ? maydonP() : p;
  const slaydlar = SLAYDLAR.map((s, i) => ({
    id: s.id, nom: tr(s.nom), uch: `sl-${i}`, yangi: yangi === i,
    holat: isMentor ? 'toliq' : faol === i ? 'joriy' : holat[i] === 'ok' ? 'toliq' : holat[i] === 'xato' ? 'xato' : 'oddiy',
    tahrir: done, onBos: !isMentor && faol !== i ? () => och(i) : undefined,
    qatorlar: pQatorlar(korP, i)
  }));
  const gipQator = gip && gip.agar ? tr({ uz: `Gipotezangiz: Agar ${gip.agar}, ${gip.ozgaradi || '…'}.`, ru: `Ваша гипотеза: Если ${gip.agar}, ${gip.ozgaradi || '…'}.` }) : null;
  const n0 = okr && Array.isArray(okr.natijalar) && okr.natijalar[0];
  const okrQator = okr && okr.maqsad && n0 ? tr({ uz: `OKR'ingiz: ${okr.maqsad} · ${n0.nima}: hozir ${n0.hozir} → oy oxirida ${n0.oyOxirida}`, ru: `Ваш OKR: ${okr.maqsad} · ${n0.nima}: сейчас ${n0.hozir} → к концу месяца ${n0.oyOxirida}` }) : null;
  const ustida = { 'raqamlar.ab': gipQator, keyingi: okrQator };
  const chiqarYoq = faol == null || !S11_MAYDON[faol].every(m => m.ixtiyoriy || m.k.startsWith('raqamlar.') || norm(olish(qor, m.k)));
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: "Самостоятельная работа" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Besh slaydni yozing', ru: "Напишите пять слайдов" })} (${n}/5)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Pitchingizni <A>besh slaydga</A> yozing.</>, ru: <>Напишите свой питч <A>на пять слайдов</A>.</> })}
        mentor={<Mentor>{tr({ uz: "O'tgan moduldagi uch slaydingiz shu yerda — tekshirib, ikki yangi slaydni yozing. Har slaydni yozib, «Slaydga chiqarish»ni bosing.", ru: "Ваши три слайда из прошлого модуля здесь — проверьте их и напишите два новых. Написав каждый слайд, нажмите «Вывести на слайд»." })}</Mentor>}
        qadamlar={<Zoomable><PitchSahna className={cxx('pr-s11', done && 'tayyor')} slaydlar={slaydlar} zal={{ pufak: isMentor || done ? 'ok' : faol != null ? { i: faol, t: ZAL_SAVOL[faol] } : null }} /></Zoomable>}
        forma={<>
          {!isMentor && faol != null && <SlaydForma key={faol} i={faol} qor={qor} setQor={setQor} ogoh={ogoh} ustida={ustida} uchRef={nomRef} onChiqar={chiqar} chiqarYoq={chiqarYoq}
            sarlavha={<>{faol + 1} · {tr(SLAYDLAR[faol].nom)} <em>{tr(ZAL_SAVOL[faol])}</em></>}
            yordamMatn={tr({ uz: "A/B testingiz bo'lmasa — «A/B» blokini bo'sh qoldiring; bosh raqamda solishtirish — OKR'dagi «hozir». Keyingi qadamni yillik yo'lingizdan oling — uni o'tgan darsda yozgansiz.", ru: "Если A/B-теста нет — оставьте блок «A/B» пустым; в главном числе сравнение — со «сейчас» из OKR. Следующий шаг возьмите из годового пути — вы писали его на прошлом уроке." })} />}
          {!isMentor && !done && <KulrangQator>{tr({ uz: "Yo'q raqamni o'ylab topmaysiz — bor raqamga izoh berasiz.", ru: "Не придумывайте число, которого нет, — объясните то, что есть." })}</KulrangQator>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </>}
      >
        {done && !isMentor && <QXulosa>{tr({ uz: 'Pitchingizning besh slaydi tayyor: muammodan keyingi qadamgacha.', ru: "Пять слайдов вашего питча готовы: от проблемы до следующего шага." })}</QXulosa>}
        <MentorNote>{tr({ uz: "A/B sonlarini 8-darsdagi SQL sonlaridan oling. Raqamlar slaydida o'z tekshiruv bandlari ham bor bo'lsa — halol gapda aytilsin. Jonli darsda bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: "Числа A/B берите из SQL 8-го урока. Если на слайде «Цифры» есть и свои проверочные брони — пусть скажут об этом в честной фразе. На живом уроке эту работу делают ученики, вы наблюдаете; «Продолжить» для вас открыто." })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 12 — REPETITSIYA (QMustaqil, 2 qadam bittadan: taymer → baholash varag'i; Sahna — taymer yurganda joriy daqiqaning slaydi accent · nishon fiveMinutes) =====
const BESH = 300;
const usePitchTaymer = (bosh) => {
  const [st, setSt] = useState(() => ({ yur: false, sek: bosh ?? 0, t0: 0, toxtadi: bosh != null }));
  useEffect(() => {
    if (!st.yur) return undefined;
    const iv = setInterval(() => setSt(p => ({ ...p, sek: Math.floor((Date.now() - p.t0) / 1000) })), 250);
    return () => clearInterval(iv);
  }, [st.yur]);
  return { ...st, boshla: () => setSt({ yur: true, sek: 0, t0: Date.now(), toxtadi: false }), toxtat: () => setSt(p => ({ ...p, yur: false, toxtadi: true })) };
};
const S12_XABAR = {
  belgi: { uz: "Har slaydga ✓ yoki ✗ qo'ying.", ru: "Поставьте каждому слайду ✓ или ✗." },
  izoh: { uz: "✗ qo'ydingiz — nima yetishmaganini bir qatorda yozing.", ru: "Вы поставили ✗ — напишите в одну строку, чего не хватило." },
  hammasi: { uz: 'Hammasi ✓ — eng zaif slaydni bir qatorda yozing.', ru: "Всё ✓ — напишите в одну строку самый слабый слайд." },
  odam: { uz: 'Odam haqida emas — slaydda nima yetishmadi?', ru: "Не о человеке — чего не хватило на слайде?" }
};
const RE_BAHO = /(yomon|zerikarli|yoqmadi|плохо|скучно|не понравил)/;
// Varaq tekshiruvi: blok — «Davom etish» yopiq · yo'naltiradi — ko'rinadi, to'xtatmaydi
const tekshir12 = (vq) => {
  if (vq.some(r => !r.belgi)) return { kod: 'belgi', blok: true };
  if (vq.some(r => r.belgi === '✗' && norm(r.izoh).length < 8)) return { kod: 'izoh', blok: true };
  if (vq.some(r => RE_BAHO.test(norm(r.izoh)))) return { kod: 'odam' };
  if (vq.every(r => r.belgi === '✓') && !vq.some(r => norm(r.izoh))) return { kod: 'hammasi' };
  return null;
};
const bushVaraq = () => SLAYDLAR.map(s => ({ slayd: s.id, belgi: null, izoh: '' }));
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const yakka = yakkaMi(live);
  const achMiss = useContext(AchMissCtx);
  const saq = useMemo(() => lsGet(KEY_PITCH), []);
  const p = saq && saq.slaydlar ? pDan(saq.slaydlar) : null;
  const tm = usePitchTaymer(storedAnswer && storedAnswer.vaqt != null ? storedAnswer.vaqt : null);
  const [vq, setVq] = useState(() => (storedAnswer && storedAnswer.varaq) || bushVaraq());
  const [teg, setTeg] = useState(false);
  const sentRef = useRef(!!(storedAnswer && storedAnswer.solved));
  const qadam = tm.toxtadi ? 1 : 0;
  const r = tekshir12(vq);
  const toldi = qadam === 1 && !(r && r.blok);
  useXulosaSkroll(toldi, !!(storedAnswer && storedAnswer.solved));
  useEffect(() => {
    if (!toldi || isMentor) return;
    pitchYoz({ vaqt: tm.sek, varaq: vq });
    onAnswer(screen, { stage: 'repetitsiya', screenIdx: screen, vaqt: tm.sek, varaq: vq, picked: true, solved: true, correct: !(achMiss && achMiss.missed.has(SCREEN_META[screen].id)) });
    if (!sentRef.current && live && live.mode === 'student') { sentRef.current = true; live.submitAnswer(PRACTICE_BASE + screen, 'repetitsiya', 0, true, 0); }
  }, [toldi, JSON.stringify(vq), tm.sek]); // eslint-disable-line
  const ogoh = r && (!r.blok || teg) ? S12_XABAR[r.kod] : null;
  const ortiq = Math.max(0, tm.sek - BESH);
  const jd = tm.yur ? Math.min(4, Math.floor(tm.sek / 60)) : -1;
  const korP = p || maydonP();
  const slaydlar = SLAYDLAR.map((s, i) => {
    const b = toldi ? vq[i].belgi : null;
    return { id: s.id, nom: tr(s.nom), holat: jd === i ? 'joriy' : b === '✓' ? 'toliq' : b === '✗' ? 'xato' : 'oddiy', qatorlar: pQatorlar(korP, i) };
  });
  const kat = [0, 1, 2, 3, 4].map(i => ({ h: tm.sek >= (i + 1) * 60 ? 'toq' : jd === i ? 'joriy' : 'uzuq' }));
  const qoy = (i, k, v) => { setTeg(true); setVq(a => a.map((x, j) => (j === i ? { ...x, [k]: v } : x))); };
  const QADAM = [tr({ uz: 'Pitchni ayting', ru: "Расскажите питч" }), tr({ uz: "Baholash varag'i", ru: "Лист оценки" })];
  return (
    <Stage eyebrow={tr({ uz: 'Mashq · sinfdosh oldida', ru: "Упражнение · перед одноклассником" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!toldi && !isMentor} label={toldi || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : qadam === 0 ? tr({ uz: 'Avval pitchni ayting', ru: "Сначала расскажите питч" }) : tr({ uz: "Varaqni to'ldiring", ru: "Заполните лист" })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Pitchingizni <A>5 daqiqada</A> aytib bera olasizmi?</>, ru: <>Сможете рассказать свой питч <A>за 5 минут</A>?</> })}
        mentor={<Mentor>{yakka
          ? tr({ uz: "Avval ovoz chiqarib 5 daqiqada ayting. Keyin baholash varag'ini o'zingiz to'ldiring.", ru: "Сначала расскажите вслух за 5 минут. Потом сами заполните лист оценки." })
          : tr({ uz: "Avval sinfdoshingizga 5 daqiqada ayting. Keyin qurilmangizni unga bering — u baholash varag'ini to'ldiradi.", ru: "Сначала расскажите однокласснику за 5 минут. Потом дайте ему своё устройство — он заполнит лист оценки." })}</Mentor>}
        qadamlar={<div className="pr-s12-ust"><Zoomable><PitchSahna className={cxx('pr-s12', qadam === 1 && 'pr-s12-q2')} tur={qadam === 1 ? 'qator' : 'tasma'} slaydlar={slaydlar}
          bosh={<div className={cxx('pr-soat', tm.yur && 'yur', ortiq > 0 && 'oshdi', qadam === 1 && 'bitdi')}>
            <span className="pr-soat-q"><i className={cxx('pr-q12-n', qadam === 1 && 'ok')}>{qadam === 1 ? '✓' : 1}</i>{QADAM[0]}<em>1 / 2</em></span>
            <span className="pr-soat-v"><b>{mss(Math.min(tm.sek, BESH))}</b>{ortiq > 0 && <em>+{mss(ortiq)}</em>}</span>
            <span className="pr-soat-b">
              {tm.yur && <span className="pr-soat-s">{tr({ uz: 'Hozir siz gapirasiz', ru: "Сейчас говорите вы" })}</span>}
              {tm.yur
                ? <QTugma ikkinchi onClick={tm.toxtat}>{tr({ uz: "To'xtatish", ru: "Остановить" })}</QTugma>
                : qadam === 1
                  ? <QTugma ikkinchi onClick={tm.boshla}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma>
                  : <QTugma className="pr-bos" onClick={tm.boshla}>{tr({ uz: '5 daqiqani boshlash', ru: "Запустить 5 минут" })}</QTugma>}
            </span>
          </div>}
          taymer={qadam === 0 ? { kat, ortiq, yur: tm.yur ? tm.sek / BESH : null } : null}
          zal={qadam === 0 ? { pufak: jd >= 0 ? { i: jd, t: ZAL_SAVOL[jd] } : null, jim: jd < 0 } : null} /></Zoomable>
          {qadam === 1 && <div className={cxx('pr-forma', 'pr-q12', toldi && 'saq')}>
            <div className="pr-q12-bosh"><i className={cxx('pr-q12-n', toldi && 'ok')}>{toldi ? '✓' : 2}</i><span>{QADAM[1]}</span><em>2 / 2</em></div>
            <Varaq className="pr-vq-s12" vaqt={tm.sek} qatorlar={vq.map((x, i) => ({
              i, holat: x.belgi === '✓' ? 'ok' : x.belgi === '✗' ? 'err' : null,
              belgiEl: <span className="pr-vq-tg">
                <QChip holat={x.belgi === '✓' ? 'ok' : undefined} disabled={isMentor} onClick={() => qoy(i, 'belgi', '✓')} aria-label="✓">✓</QChip>
                <QChip holat={x.belgi === '✗' ? 'err' : undefined} disabled={isMentor} onClick={() => qoy(i, 'belgi', '✗')} aria-label="✗">✗</QChip>
              </span>,
              izohEl: <input type="text" className={cxx('pr-vq-in', x.belgi === '✗' && norm(x.izoh).length < 8 && teg && 'err')} value={x.izoh} disabled={isMentor} maxLength={140} placeholder={tr({ uz: 'Nima yetishmadi?', ru: "Чего не хватило?" })} onChange={e => qoy(i, 'izoh', e.target.value)} />
            }))} />
            {ogoh && <QXato key={r.kod}>{tr(ogoh)}</QXato>}
          </div>}
        </div>}
        forma={<>
          {qadam === 0 && !yakka && <KulrangQator>{tr({ uz: 'Avval A gapiradi, B tinglaydi; keyin almashasiz.', ru: "Сначала говорит A, B слушает; потом меняетесь." })}</KulrangQator>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </>}
      >
        {toldi && <QXulosa>{tr({ uz: "Baholash varag'i to'ldi: qaysi slaydni tuzatish kerakligi endi ko'rinib turibdi.", ru: "Лист оценки заполнен: теперь видно, какой слайд нужно исправить." })}</QXulosa>}
        <MentorNote>{tr({ uz: "Tinglovchi slayd haqida yozadi, odam haqida emas. ✗ qo'yish — yordam: «hammasi yaxshi» pitchni tuzatmaydi. 5 daqiqadan oshgan pitchni to'xtatmang — vaqt varaqqa yoziladi. Pitch shu ko'rinishda keyingi modulda zalga chiqadi — o'quvchiga va'da qilib aytilmaydi. Taymerni sinf bo'ylab bir vaqtda boshlating: avval hamma A gapiradi, keyin hamma B — 18 daqiqaga shunday sig'adi.", ru: "Слушатель пишет о слайде, а не о человеке. Поставить ✗ — это помощь: «всё хорошо» питч не исправит. Если питч дольше 5 минут, не останавливайте его — время запишется в лист. В таком виде питч выйдет к залу в следующем модуле — ученикам это не обещают. Запускайте таймер всем классом одновременно: сначала говорят все A, потом все B — так всё уложится в 18 минут." })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 13 — TUZATISH (QMustaqil: chapda varaq ixcham — ✗ qatorlar tanlanadi, o'ngda besh slayd; ostida tanlangan slayd formasi · «tuzatildi» · nishon pitchFixed) =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const saq = useMemo(() => lsGet(KEY_PITCH) || {}, []);
  const [p, setP] = useState(() => (storedAnswer && storedAnswer.p) || (saq.slaydlar ? pDan(saq.slaydlar) : (isMentor ? maydonP() : boshP())));
  const vq = Array.isArray(saq.varaq) && saq.varaq.length === 5 ? saq.varaq : bushVaraq();
  const vaqt = typeof saq.vaqt === 'number' ? saq.vaqt : null;
  const xatolar = vq.map((r, i) => (r.belgi === '✗' ? i : -1)).filter(i => i >= 0);
  const engZaif = xatolar.length ? -1 : vq.findIndex(r => r.belgi === '✓' && norm(r.izoh));
  const tanlasaBo = (i) => !isMentor && (xatolar.length ? xatolar.includes(i) : (engZaif >= 0 ? i === engZaif : true));
  const [tuz, setTuz] = useState(() => (storedAnswer && storedAnswer.tuzatildi) || []);
  const [faol, setFaol] = useState(() => (isMentor || (storedAnswer && storedAnswer.solved) ? null : xatolar.length ? xatolar[0] : engZaif >= 0 ? engZaif : null));
  const [qor, setQor] = useState(p);
  const [urindi, setUrindi] = useState(false);
  const [yangi, setYangi] = useState(null);
  const nomRef = useRef(null);
  const uch = useUchish();
  const sentRef = useRef(!!(storedAnswer && storedAnswer.solved));
  const done = tuz.length > 0;
  useXulosaSkroll(done && faol == null, !!(storedAnswer && storedAnswer.solved));
  useEffect(() => { if (!yangi && yangi !== 0) return undefined; const t = setTimeout(() => setYangi(null), 1100); return () => clearTimeout(t); }, [yangi]);
  const ozgarmadi = faol != null && S11_MAYDON[faol].every(m => norm(olish(qor, m.k)) === norm(olish(p, m.k)));
  const och = (i) => { if (!tanlasaBo(i)) return; setFaol(i); setQor(p); setUrindi(false); };
  const chiqar = () => {
    if (faol == null) return;
    if (ozgarmadi) { setUrindi(true); return; }
    uch(nomRef.current, `tz-${faol}`, 620);
    const yp = { ...p };
    S11_MAYDON[faol].forEach(m => { Object.assign(yp, qoyish(yp, m.k, olish(qor, m.k))); });
    const yt = tuz.includes(SLAYDLAR[faol].id) ? tuz : [...tuz, SLAYDLAR[faol].id];
    setP(yp); setTuz(yt); setYangi(faol); setFaol(null); setUrindi(false);
    pitchYoz({ slaydlar: sxema(yp, saq.neon || null), tuzatildi: yt });
    onAnswer(screen, { stage: 'tuzatish', screenIdx: screen, p: yp, tuzatildi: yt, picked: true, solved: true, correct: true });
    if (!sentRef.current && live && live.mode === 'student') { sentRef.current = true; live.submitAnswer(PRACTICE_BASE + screen, 'tuzatish', 0, true, 0); }
  };
  const slaydlar = SLAYDLAR.map((s, i) => {
    const tz = tuz.includes(s.id);
    return {
      id: s.id, nom: tr(s.nom), uch: `tz-${i}`, yangi: yangi === i,
      holat: tz ? 'tuzatildi' : faol === i ? 'joriy' : vq[i].belgi === '✗' ? 'xato' : vq[i].belgi === '✓' ? 'oddiy' : 'oddiy',
      kutadi: faol == null && !tz && tanlasaBo(i) && !done,
      onBos: faol !== i && !tz && tanlasaBo(i) ? () => och(i) : undefined,
      qatorlar: []
    };
  });
  const qatorlar = vq.map((r, i) => ({
    i, belgi: r.belgi, izoh: r.izoh, holat: faol === i ? 'tanl' : r.belgi === '✗' && !tuz.includes(SLAYDLAR[i].id) ? 'acc' : null,
    tuzatildi: tuz.includes(SLAYDLAR[i].id), onBos: faol !== i && !tuz.includes(SLAYDLAR[i].id) && tanlasaBo(i) ? () => och(i) : undefined,
    yorliq: engZaif === i ? tr({ uz: 'eng zaif', ru: "самый слабый" }) : null
  }));
  return (
    <Stage eyebrow={tr({ uz: 'Mashq · tuzatish', ru: "Упражнение · исправление" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bitta slaydni tuzating', ru: "Исправьте один слайд" })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Fidbekdan keyin <A>qaysi slaydni</A> tuzatasiz?</>, ru: <>Какой <A>слайд</A> исправите после фидбека?</> })}
        mentor={<Mentor>{tr({ uz: "✗ qo'yilgan slaydni tanlang va varaqdagi izohga qarab qayta yozing.", ru: "Выберите слайд с ✗ и перепишите его, глядя на пояснение в листе." })}</Mentor>}
        qadamlar={<div className="pr-s13">
          <Zoomable><PitchSahna tur="qator" className="pr-s13-sl" slaydlar={slaydlar} /></Zoomable>
          <div className="pr-s13-ast">
            <Varaq className="pr-vq-s13" sarlavha={tr({ uz: "Baholash varag'i", ru: "Лист оценки" })} qatorlar={qatorlar} vaqt={vaqt} />
            <div className="pr-s13-ong">
              {vaqt != null && vaqt > BESH && faol != null && <QIzoh>{tr({ uz: 'Vaqt 5 daqiqadan oshdi — har slayddan bitta ortiqcha gapni oling.', ru: "Вышло больше 5 минут — уберите из каждого слайда одну лишнюю фразу." })}</QIzoh>}
              {faol != null && <SlaydForma key={faol} i={faol} qor={qor} setQor={setQor} uchRef={nomRef} onChiqar={chiqar} chiqarYoq={false}
                ogoh={urindi && ozgarmadi ? { kod: 'tez', t: { uz: "Matn o'zgarmadi — varaqdagi izohni qayta o'qing.", ru: "Текст не изменился — перечитайте пояснение в листе." } } : null}
                sarlavha={<>{faol + 1} · {tr(SLAYDLAR[faol].nom)}{vq[faol].izoh && <em>{vq[faol].izoh}</em>}</>} />}
              {done && faol == null && <QXulosa>{tr({ uz: "Pitchingizning eng zaif slaydi tuzatildi. Qolgan ✗ slaydlarni uyda tuzatasiz.", ru: "Самый слабый слайд вашего питча исправлен. Остальные слайды с ✗ исправите дома." })}</QXulosa>}
            </div>
          </div>
        </div>}
        forma={isMentor ? <MentorPracticeStats live={live} screen={screen} /> : null}
      >
        <MentorNote>{tr({ uz: "Vaqt bo'lsa — tuzatilgan slaydni sinfdoshga yana bir marta (1 daqiqa) ayttiring: endi zal savoliga javob bo'ldimi?", ru: "Если есть время — пусть ученик ещё раз (1 минута) расскажет исправленный слайд однокласснику: теперь это ответ на вопрос зала?" })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== 🏅 NISHONLAR (4) — 151-qonun: 8-ekran birinchi urinish; 10, 12, 13-ekran ish bajarilgani (tekin bonus yo'q, S-034; 2, 6, 11-ekran nishonsiz) =====
const ACHIEVEMENTS = {
  feedbackSorter: { icon: '🗂️', name: 'Feedback Sorter!', desc: { uz: 'Besh gapdan varaqqa yoziladiganlarini ajratdingiz', ru: "Из пяти фраз вы выбрали те, что попадут в лист" } },
  realNumber: { icon: '🔢', name: 'Real Number!', desc: { uz: "Bosh raqamingizni Database'dan oldingiz", ru: "Вы взяли главное число из Database" } },
  fiveMinutes: { icon: '⏱️', name: 'Five Minutes!', desc: { uz: 'Pitchingizni 5 daqiqada aytdingiz va baholatdingiz', ru: "Вы рассказали питч за 5 минут и получили оценку" } },
  pitchFixed: { icon: '🛠️', name: 'Pitch Fixed!', desc: { uz: 'Fidbekdan keyin slaydni qayta yozdingiz', ru: "После фидбека вы переписали слайд" } }
};
// Ekran id → nishon. s8: `correct` = xatosiz birinchi urinish · s10: «Bajardim» · s12: taymer to'xtatildi va varaq to'ldi · s13: birinchi tuzatilgan slayd
const ACH_TRIGGERS = { s8: 'feedbackSorter', s10: 'realNumber', s12: 'fiveMinutes', s13: 'pitchFixed' };

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


// Podium savol yorliqlari (kalitlar = SCORED_IDX: 3, 5, 7, 9 — q22)
const Q_LABELS = {
  3: { uz: '1 — Raqamlar yoki keyingi qadam', ru: "1 — Цифры или следующий шаг" },
  5: { uz: '2 — Airbnb tartibi', ru: "2 — Порядок Airbnb" },
  7: { uz: '3 — Raqam yonida nima', ru: "3 — Что рядом с числом" },
  9: { uz: '4 — Qaysi fidbek yordam beradi', ru: "4 — Какой фидбек помогает" }
};
const QUIZ_MS = 15000;
// Kapsula va arena foni — darsning o'z so'zlari (R-008, {uz, ru}; emojisiz)
const QZ_BG_SHAPES = [
  { ch: { uz: 'pitch', ru: "питч" }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'slayd', ru: "слайд" }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'zal', ru: "зал" }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'raqam', ru: "число" }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'fidbek', ru: "фидбек" }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'repetitsiya', ru: "репетиция" }, l: 62, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: 'muammo', ru: "проблема" }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'yechim', ru: "решение" }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'varaq', ru: "лист" }, l: 90, t: 44, s: 20, d: 22, dl: 1.3 },
  { ch: { uz: 'daqiqa', ru: "минута" }, l: 36, t: 58, s: 20, d: 24, dl: 2.5 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (MD; har biri 3 marta)
const QUIZ_BANK = [
  { q: { uz: '5 daqiqalik pitchda birinchi qaysi slayd turadi?', ru: "Какой слайд стоит первым в пятиминутном питче?" }, opts: [{ uz: 'Muammo slaydi', ru: "Слайд «Проблема»" }, { uz: 'Raqamlar slaydi', ru: "Слайд «Цифры»" }, { uz: 'Yechim slaydi', ru: "Слайд «Решение»" }, { uz: 'Foydalanuvchi slaydi', ru: "Слайд «Пользователь»" }], correct: 0 },
  { q: { uz: 'Zal «Endi nima qilasiz?» deb so\'radi. Qaysi slayd javob beradi?', ru: "Зал спросил «Что будете делать дальше?». Какой слайд отвечает?" }, opts: [{ uz: 'Foydalanuvchi slaydi', ru: "Слайд «Пользователь»" }, { uz: 'Keyingi qadam slaydi', ru: "Слайд «Следующий шаг»" }, { uz: 'Raqamlar slaydi', ru: "Слайд «Цифры»" }, { uz: 'Muammo slaydi', ru: "Слайд «Проблема»" }], correct: 1 },
  { q: { uz: '«B — 40 tadan 17» da 40 nimani sanaydi?', ru: "Что считает 40 в «B — 17 из 40»?" }, opts: [{ uz: 'Saytni ochgan hamma brauzerlarni', ru: "Все браузеры, открывшие сайт" }, { uz: 'Oxirida band qilgan brauzerlarni', ru: "Браузеры, которые в итоге забронировали" }, { uz: 'Vaqtni tanlagan brauzerlarni', ru: "Браузеры, выбравшие время" }, { uz: 'Sayt ishlagan kunlar sonini', ru: "Число дней работы сайта" }], correct: 2 },
  { q: { uz: 'Pitchdagi bosh raqam qayerdan olinadi?', ru: "Откуда берётся главное число в питче?" }, opts: [{ uz: 'Sinfdoshlar aytgan taxminiy sondan', ru: "Из примерного числа, которое назвали одноклассники" }, { uz: "Esda qolgan o'tgan haftalik sondan", ru: "Из запомнившегося числа прошлой недели" }, { uz: "Boshqa loyihadagi o'xshash raqamdan", ru: "Из похожего числа другого проекта" }, { uz: "O'z Database'ingizdagi jadvaldan", ru: "Из таблицы в вашей Database" }], correct: 3 },
  { q: { uz: '«82 ta brauzer hali kam» degan gap nimani aytadi?', ru: "О чём говорит фраза «82 браузера пока мало»?" }, opts: [{ uz: 'Xulosaga brauzer kamligini', ru: "Что для вывода мало браузеров" }, { uz: 'Backend sekin ishlayotganini', ru: "Что Backend работает медленно" }, { uz: 'Reklamaga kam pul ketganini', ru: "Что на рекламу ушло мало денег" }, { uz: 'B varianti yomon chiqqanini', ru: "Что вариант B оказался плохим" }], correct: 0 },
  { q: { uz: "Airbnb'ning birinchi taqdimotidagi slaydlar qanday bo'lgan?", ru: "Какими были слайды первой презентации Airbnb?" }, opts: [{ uz: 'Uzun matnli, rasmsiz sahifalar', ru: "Страницы с длинным текстом, без картинок" }, { uz: "Oddiy va o'nga yaqin", ru: "Простые, около десятка" }, { uz: 'Asosan raqam va jadvallar', ru: "В основном числа и таблицы" }, { uz: 'Har biri bir sahifa matn', ru: "Каждый — страница текста" }], correct: 1 },
  { q: { uz: 'Airbnb taqdimotida slaydlar qaysi tartibda kelgan?', ru: "В каком порядке шли слайды в презентации Airbnb?" }, opts: [{ uz: 'Jamoa, mahsulot, bozor, yechim, muammo', ru: "Команда, продукт, рынок, решение, проблема" }, { uz: 'Bozor, jamoa, muammo, mahsulot, yechim', ru: "Рынок, команда, проблема, продукт, решение" }, { uz: 'Muammo, yechim, bozor, mahsulot, jamoa', ru: "Проблема, решение, рынок, продукт, команда" }, { uz: 'Mahsulot, muammo, jamoa, yechim, bozor', ru: "Продукт, проблема, команда, решение, рынок" }], correct: 2 },
  { q: { uz: 'Qaysi fidbek qattiq, lekin hurmatli?', ru: "Какой фидбек жёсткий, но уважительный?" }, opts: [{ uz: '«Muammo slaydi yaxshi, hammasi yoqdi»', ru: "«Слайд „Проблема“ хороший, всё понравилось»" }, { uz: '«Raqamlarni aytganda siz qo\'rqdingiz»', ru: "«Вы испугались, когда говорили цифры»" }, { uz: '«Keyingi qadam slaydi umuman kerak emas»', ru: "«Слайд „Следующий шаг“ вообще не нужен»" }, { uz: '«Yechimda sayt nima qilishi aytilmadi»', ru: "«В решении не сказано, что делает сайт»" }], correct: 3 },
  { q: { uz: "Baholash varag'ida har slayd uchun nima yozilgan?", ru: "Что записано в листе оценки для каждого слайда?" }, opts: [{ uz: 'Zalning bitta savoli', ru: "Один вопрос зала" }, { uz: 'Slaydning rangi va shrifti', ru: "Цвет и шрифт слайда" }, { uz: "Gapiruvchining to'liq ismi", ru: "Полное имя выступающего" }, { uz: "Slayddagi so'zlar soni", ru: "Число слов на слайде" }], correct: 0 },
  { q: { uz: "Sinfdosh Yechim slaydiga ✗ qo'ydi. Keyin nima qilasiz?", ru: "Одноклассник поставил слайду «Решение» ✗. Что сделаете дальше?" }, opts: [{ uz: 'Yechim slaydini butunlay olib tashlaysiz', ru: "Полностью уберёте слайд «Решение»" }, { uz: 'Yechim slaydini izohga qarab yozasiz', ru: "Перепишете слайд «Решение» по пояснению" }, { uz: "Yechimdagi ✗ belgisini o'chirib qo'yasiz", ru: "Сотрёте знак ✗ у решения" }, { uz: "Yechim uchun sinfdoshdan ✓ so'raysiz", ru: "Попросите у одноклассника ✓ для решения" }], correct: 1 },
  { q: { uz: 'Yechim slaydiga nima yoziladi?', ru: "Что пишется на слайде «Решение»?" }, opts: [{ uz: "Saytdagi texnologiyalar ro'yxati", ru: "Список технологий сайта" }, { uz: 'Saytga ketgan haftalar soni', ru: "Сколько недель ушло на сайт" }, { uz: 'Sayt muammoni qanday hal qilishi', ru: "Как сайт решает проблему" }, { uz: 'A/B testidagi ikki variant foizi', ru: "Проценты двух вариантов A/B-теста" }], correct: 2 },
  { q: { uz: "Pitch 5 daqiqadan oshib ketdi. Nima qilasiz?", ru: "Питч длился больше 5 минут. Что сделаете?" }, opts: [{ uz: 'Oxirgi slaydlarni tezroq gapirib berasiz', ru: "Быстрее расскажете последние слайды" }, { uz: 'Bitta slaydni butunlay olib tashlaysiz', ru: "Полностью уберёте один слайд" }, { uz: "Taymerni o'chirib, vaqtni sanamaysiz", ru: "Выключите таймер и перестанете считать время" }, { uz: 'Har slayddan ortiqcha gapni olasiz', ru: "Уберёте лишнюю фразу из каждого слайда" }], correct: 3 }
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
    // Arena tokenlari — shu darsning so'zlari (pitch, slayd, zal): dekorativ suzuvchi so'zlar, emojisiz
    const TOK = ['pitch', 'slayd', 'zal', '5:00', 'fidbek', 'A/B', 'varaq', 'raqam', 'muammo', 'yechim'];
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

// 🃏 KARTOCHKALAR — 12 ta (MD 15-ekran jadvali; har old tomon — to'liq savol, S-027)
const KARTOCHKALAR = [
  { front: { uz: '5 daqiqalik pitchda qaysi besh slayd bor?', ru: "Какие пять слайдов в пятиминутном питче?" }, back: { uz: 'Muammo, yechim, foydalanuvchi, raqamlar va keyingi qadam', ru: "Проблема, решение, пользователь, цифры и следующий шаг" } },
  { front: { uz: 'Har slayd nimaga javob beradi?', ru: "На что отвечает каждый слайд?" }, back: { uz: 'Zalning bitta savoliga', ru: "На один вопрос зала" } },
  { front: { uz: 'Raqamlar slaydi zalning qaysi savoliga javob beradi?', ru: "На какой вопрос зала отвечает слайд «Цифры»?" }, back: { uz: "«Sayt ishga tushgach nima bo'ldi?»", ru: "«Что стало после запуска сайта?»" } },
  { front: { uz: '«Keyingi oyda haftada 20 band» qaysi slaydga chiqadi?', ru: "На какой слайд попадёт «В следующем месяце 20 броней в неделю»?" }, back: { uz: "Keyingi qadam slaydiga: bu son hali bo'lmagan", ru: "На слайд «Следующий шаг»: этого числа ещё нет" } },
  { front: { uz: "Raqam tushunarli bo'lishi uchun yonida nima turadi?", ru: "Что стоит рядом с числом, чтобы оно было понятным?" }, back: { uz: 'Nimani sanagani, nima bilan solishtirilgani va halol gap', ru: "Что посчитано, с чем сравнили и честная фраза" } },
  { front: { uz: '«Maydon» A/B testida B tugmasi bilan nechta brauzer band qildi?', ru: "Сколько браузеров забронировали с кнопкой B в A/B-тесте «Maydon»?" }, back: { uz: 'Vaqtni tanlagan 40 brauzerdan 17 tasi; A bilan — 42 tadan 12', ru: "17 из 40 браузеров, выбравших время; с A — 12 из 42" } },
  { front: { uz: 'Halol gap nimani aytadi?', ru: "О чём говорит честная фраза?" }, back: { uz: "Raqam qanday sanalganini va undan qancha xulosa qilsa bo'lishini", ru: "Как посчитано число и какой вывод из него можно сделать" } },
  { front: { uz: "Airbnb'ning birinchi taqdimoti qaysi slayddan boshlangan?", ru: "С какого слайда начиналась первая презентация Airbnb?" }, back: { uz: 'Muammodan: muammo, yechim, bozor, mahsulot, jamoa', ru: "С проблемы: проблема, решение, рынок, продукт, команда" } },
  { front: { uz: 'Fidbek nima?', ru: "Что такое фидбек?" }, back: { uz: 'Tinglovchining pitchdagi aniq joy haqidagi fikri yoki taklifi', ru: "Мнение или предложение слушателя о конкретном месте питча" } },
  { front: { uz: 'Qattiq, lekin hurmatli fidbekda nima aytiladi?', ru: "Что говорят в жёстком, но уважительном фидбеке?" }, back: { uz: "Qaysi slayd va unda nima yetishmagani; odam haqida gap yo'q", ru: "Какой слайд и чего в нём не хватило; ни слова о человеке" } },
  { front: { uz: "Baholash varag'ida nima yozilgan?", ru: "Что записано в листе оценки?" }, back: { uz: 'Har slayd uchun zalning bitta savoli — ✓ yoki ✗', ru: "Для каждого слайда — один вопрос зала, ✓ или ✗" } },
  { front: { uz: 'Bosh raqamni pitch uchun qayerdan olasiz?', ru: "Откуда вы берёте главное число для питча?" }, back: { uz: "O'z Database'ingizdan — masalan Neon'dagi SQL Editor'da", ru: "Из своей Database — например, в SQL Editor в Neon" } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        <PitchimStrip />
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */}
        <div className={cxx('pr-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="pr-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: "Нажмите на карточку — откроется ответ" })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «kim uchun · nechta · muddat» + raqamli qadamlar; alohida .homework.jsx yo'q — tayanch 4) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: "Для кого" }, v: { uz: "oila a'zosi yoki do'stingiz", ru: "член семьи или друг" } },
  { k: { uz: 'Nechta', ru: "Сколько" }, v: { uz: '1 repetitsiya', ru: "1 репетиция" } },
  { k: { uz: 'Muddat', ru: "Срок" }, v: { uz: 'zaxira darsgacha', ru: "до резервного урока" } }
];
const HW_QADAM = [
  { uz: 'Tuzatilgan pitchni bir kishiga 5 daqiqada, taymer bilan ayting.', ru: "Расскажите исправленный питч одному человеку за 5 минут, с таймером." },
  { uz: "Undan baholash varag'idagi besh savolni so'rang va qolgan ✗ slaydlarni tuzating.", ru: "Задайте ему пять вопросов из листа оценки и исправьте остальные слайды с ✗." },
  { uz: "Raqamlar slaydidagi sonni Database'dan yana bir marta oling va yangilang.", ru: "Ещё раз возьмите число для слайда «Цифры» из Database и обновите его." }
];
const HwCard = ({ keyingi }) => (
  <div className="card pr-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: "Что сделаете дома?" })}</div>
    <div className="pr-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="pr-hw-q"><span className="pr-hw-k">{tr(r.k)}</span><span className="pr-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="pr-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
    <KulrangQator>{tr({ uz: "Tinglovchi topilmasa — pitchni telefonga yozib oling va varaqni o'zingiz to'ldiring.", ru: "Если слушателя нет — запишите питч на телефон и заполните лист сами." })}</KulrangQator>
    {keyingi && <span className="pr-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Bugungi asosiy fikr» (P-013; kartochkaga qo'shilmaydi). CODE STRIKE va arena — darsda =====
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
    { uz: "5 daqiqalik pitch besh slayddan iborat: muammo, yechim, foydalanuvchi, raqamlar va keyingi qadam.", ru: "Пятиминутный питч состоит из пяти слайдов: проблема, решение, пользователь, цифры и следующий шаг." },
    { uz: 'Raqamlar slaydida bosh raqam va A/B alohida turadi; har birida nimani sanagani va halol gap bor.', ru: "На слайде «Цифры» главное число и A/B стоят отдельно; у каждого есть то, что посчитано, и честная фраза." },
    { uz: "Bosh raqamni o'ylab topmaysiz — o'z Database'ingizdan olasiz.", ru: "Главное число вы не придумываете — вы берёте его из своей Database." },
    { uz: 'Qattiq, lekin hurmatli fidbek slaydni va undagi kamchilikni aytadi.', ru: "Жёсткий, но уважительный фидбек называет слайд и его недостаток." }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Zaxira dars»</b>: ortda qolgan ishni yetkazasiz va pitchni sayqallaysiz.</>, ru: <>Следующий урок — <b>«Резервный урок»</b>: доделаете то, что не успели, и отшлифуете питч.</> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: "Итог урока" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: "Урок окончен" })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Pitch besh daqiqalik bo'ldi, <A>eng zaif slayd tuzatildi</A>.</>, ru: <>Питч — 5 минут, <A>слабый слайд исправлен</A>.</> })}
        cta={<>
          <div className="pr-fikr fade-up d1"><span className="pr-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: "Главная мысль урока" })}</span><p className="pr-fikr-t small">{tr({ uz: "Har slayd zalning bitta savoliga javob beradi; fidbek qaysi javob yetmaganini ko'rsatadi.", ru: "Каждый слайд отвечает на один вопрос зала; фидбек показывает, какого ответа не хватило." })}</p></div>
          <PitchimStrip />
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
export default function PmPitchRehearsalLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === PITCH SAHNA (darsning bitta vizuali) — faqat qolip tokenlari (D3), emoji yo'q (D4). F-1005 C: jonli kirish, katta va o'qiladigan, bitta natija bloki === */
        .pr-sahna { position: relative; display: flex; flex-direction: column; gap: 12px; padding: clamp(12px,1.8vw,16px); border-radius: 16px; background: ${fon(T.accent, 0.07)}; min-width: 0; }
        .pr-sahna-l { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.ink2}; }
        .pr-tasma { display: grid; grid-template-columns: repeat(var(--n, 5), minmax(0, 1fr)); gap: 10px; align-items: stretch; }
        .pr-sl { position: relative; display: flex; flex-direction: column; gap: 6px; min-width: 0; min-height: 92px; padding: 10px 11px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid transparent; text-align: left; font: inherit; color: ${T.ink}; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.35); animation: pr-kir .42s ease-out backwards; animation-delay: calc(var(--i, 0) * 90ms); transition: opacity .35s, transform .35s, box-shadow .25s, background .25s, border-color .25s; }
        .pr-sl.h-jim { animation: none; opacity: 0; transform: translateY(10px); }
        .pr-sl.h-joy { background: transparent; border: 2px dashed ${fon(T.ink2, 0.35)}; box-shadow: none; }
        .pr-sl.h-joy .pr-sl-n { background: transparent; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${fon(T.ink2, 0.4)}; }
        .pr-sl.h-joriy { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.18)}, 0 12px 26px -12px ${fon(T.accent, 0.55)}; transform: translateY(-2px); }
        .pr-sl.h-xato { background: ${T.errFon}; border-color: ${fon(T.err, 0.55)}; }
        .pr-sl.h-tuzatildi { border-color: ${T.ok}; box-shadow: 0 0 0 3px ${fon(T.ok, 0.16)}; }
        .pr-sl.pr-sl-bos { cursor: pointer; }
        .pr-sl.pr-sl-bos:hover { border-color: ${T.accent}; }
        .pr-sl::before, .pr-sl::after { content: ''; position: absolute; inset: -2px; border-radius: 13px; pointer-events: none; opacity: 0; }
        .pr-sl.yangi::before { box-shadow: 0 0 0 3px ${T.accent}; animation: pr-yon 1.1s ease-out; }
        .pr-sl.yon-ok::after { box-shadow: 0 0 0 3px ${T.ok}; background: ${fon(T.ok, 0.12)}; animation: pr-yon 1s ease-out; }
        .pr-sl.yon-err::after { box-shadow: 0 0 0 3px ${T.err}; background: ${fon(T.err, 0.1)}; animation: pr-yon 1s ease-out; }
        .pr-sl.kutadi::after { box-shadow: 0 0 0 2px ${fon(T.accent, 0.6)}; opacity: 1; animation: pr-puls-h 1.8s ease-out 3; }
        .pr-sl-bosh { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 7px; min-width: 0; }
        .pr-sl-n { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 99px; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-size: 11.5px; font-weight: 800; }
        .pr-sl-n.ok { background: ${T.ok}; color: ${T.paper}; animation: pr-pop .4s ease-out; }
        .pr-sl-nom { font-size: 13.5px; font-weight: 800; color: ${T.ink}; overflow-wrap: normal; line-height: 1.2; }
        .pr-sl-bel { margin-left: auto; font-style: normal; font-weight: 800; font-size: 14px; animation: pr-pop .4s ease-out; }
        .pr-sl-bel.ok { color: ${T.ok}; } .pr-sl-bel.err { color: ${T.err}; }
        .pr-sl-ed { margin-left: auto; font-size: 13px; color: ${T.ink2}; }
        .pr-sl-tuz { align-self: flex-start; font-size: 11px; font-weight: 800; color: ${T.ok}; background: ${T.okFon}; border-radius: 99px; padding: 2px 8px; animation: pr-pop .4s ease-out; }
        .pr-sl-ichi { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .pr-q { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .pr-q-t { font-size: 12.5px; line-height: 1.42; color: ${T.ink}; overflow-wrap: anywhere; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
        .pr-q.q-yozildi .pr-q-t { animation: pr-yoz .9s ease-out; }
        .pr-q.q-xato .pr-q-t { color: ${T.err}; }
        .pr-q-y { font-style: normal; font-size: 11px; font-weight: 800; letter-spacing: .04em; color: ${T.accent}; }
        .pr-q-kul { color: ${T.ink2}; }
        .pr-q-bo { display: block; height: 0; margin: 7px 0 3px; border-top: 2px dashed ${fon(T.ink2, 0.35)}; transition: border-color .5s; }
        .pr-q.q-toq .pr-q-bo { border-top-style: solid; border-color: ${fon(T.ink, 0.62)}; }
        .pr-son { display: block; margin-bottom: 2px; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; color: ${T.accent}; }
        .pr-q.q-bosh .pr-q-t { color: ${T.ink2}; }

        /* taymer chizig'i: besh daqiqa-katak, 5:00 dan keyin qizil davom */
        .pr-tm { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .pr-tm-ch { position: relative; display: flex; gap: 4px; height: 14px; }
        .pr-tm-k { flex: 1 1 0; min-width: 0; border-radius: 5px; background: repeating-linear-gradient(90deg, ${fon(T.ink2, 0.32)} 0 7px, transparent 7px 12px); transition: background .4s, opacity .4s, box-shadow .4s; } /* kesik-ok: shtrix = slayd hali aytilmagan (bo'sh vaqt), to'q = aytildi */
        .pr-tm-k.h-jim { opacity: .25; }
        .pr-tm-k.h-toq { background: ${T.ink}; opacity: .82; }
        .pr-tm-k.h-joriy { background: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.2)}; }
        .pr-tm-k.h-yonadi { background: ${fon(T.accent, 0.35)}; animation: pr-tm-yon 1.1s ease-out 2; }
        .pr-tm-ort { flex: 0 0 auto; border-radius: 5px; background: repeating-linear-gradient(135deg, ${T.err} 0 6px, ${fon(T.err, 0.7)} 6px 12px); animation: pr-kir .3s ease-out; } /* kesik-ok: qiya shtrix = 5 daqiqadan oshgan vaqt (ogohlantirish) */
        .pr-tm-yur { position: absolute; top: -5px; bottom: -5px; width: 3px; margin-left: -1px; border-radius: 2px; background: ${T.accent}; box-shadow: 0 0 0 2px ${T.paper}; transition: left .25s linear; }
        .pr-tm-ust { position: absolute; top: 0; display: flex; justify-content: center; font-size: 11.5px; font-weight: 800; color: ${T.accent}; white-space: nowrap; animation: pr-kir .4s ease-out .2s backwards; }
        .pr-tm-l { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; align-items: start; position: relative; min-height: 15px; }
        .pr-tm-l > span { display: flex; flex-direction: column; align-items: center; text-align: center; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; line-height: 1.2; min-width: 0; overflow-wrap: anywhere; }
        .pr-tm-l > span.toq { color: ${T.ink}; } .pr-tm-l > span.on { color: ${T.accent}; }
        .pr-tm-l em { font-style: normal; font-weight: 600; font-size: 11px; color: ${T.ink2}; }
        .pr-tm-plus { position: absolute; right: 0; top: 100%; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: ${T.err}; }
        .pr-tm.oshdi .pr-tm-l { margin-bottom: 14px; }
        .pr-tm-u { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: ${T.ink2}; }

        /* zal: to'rt bosh-siluet va bitta savol pufagi */
        .pr-zal { position: relative; display: flex; justify-content: center; padding-top: 38px; min-height: 72px; }
        .pr-zal-p { position: absolute; inset: 0 0 auto 0; height: 36px; }
        .pr-pf { position: absolute; top: 0; left: clamp(84px, var(--x, 50%), calc(100% - 84px)); transform: translateX(-50%); max-width: calc(100% - 8px); background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 6px 11px; font-size: 12.5px; font-weight: 700; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 8px 18px -10px ${fon(T.accent, 0.6)}; animation: pr-pf .38s cubic-bezier(.3,1.4,.5,1); transition: left .45s cubic-bezier(.3,1,.4,1); }
        .pr-pf.savol, .pr-pf.ok { left: 50%; width: 34px; height: 34px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 99px; font-size: 16px; font-weight: 800; }
        .pr-pf.savol { color: ${T.accent}; }
        .pr-pf.ok { color: ${T.paper}; background: ${T.ok}; border-color: ${T.ok}; }
        .pr-boshlar { display: flex; gap: 16px; align-items: flex-end; }
        .pr-bosh { position: relative; display: block; width: 28px; height: 33px; transform-origin: 50% 100%; animation: pr-kir .4s ease-out backwards; animation-delay: calc(var(--k) * 80ms + 200ms); transition: transform .5s cubic-bezier(.3,1.3,.5,1), opacity .4s; }
        .pr-bosh::before { content: ''; position: absolute; top: 0; left: 7px; width: 14px; height: 14px; border-radius: 50%; background: ${fon(T.ink2, 0.5)}; }
        .pr-bosh::after { content: ''; position: absolute; bottom: 0; left: 0; width: 28px; height: 16px; border-radius: 14px 14px 4px 4px; background: ${fon(T.ink2, 0.38)}; }
        .pr-zal.jim .pr-bosh { opacity: .75; }
        .pr-zal.bur .pr-bosh { transform: rotate(9deg) translateX(3px); }
        .pr-zal.bur .pr-bosh:nth-child(2) { transition-delay: .06s; } .pr-zal.bur .pr-bosh:nth-child(3) { transition-delay: .12s; } .pr-zal.bur .pr-bosh:nth-child(4) { transition-delay: .18s; }

        /* ixcham qator (8, 13-ekran): besh slayd — raqam, nom va holat; matn formada yoki varaqda */
        .pr-sahna.t-qator { background: none; padding: 0; }
        .pr-sahna.t-qator .pr-tasma { gap: 8px; }
        .pr-sahna.t-qator .pr-sl { min-height: 0; flex-direction: row; flex-wrap: wrap; align-items: center; padding: 9px 11px; gap: 4px 8px; }
        .pr-sahna.t-qator .pr-sl-ichi { display: none; }

        /* baholash varag'i */
        .pr-vq { display: flex; flex-direction: column; gap: 6px; min-width: 0; padding: 10px 12px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); }
        .pr-vq-h { font-size: 11.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.accent}; animation: pr-kir .4s ease-out; }
        .pr-vq-q { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "nom bel" "iz iz"; gap: 3px 10px; align-items: center; width: 100%; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; border: 1.5px solid transparent; text-align: left; font: inherit; color: ${T.ink}; animation: pr-kir .38s ease-out backwards; animation-delay: calc(var(--i, 0) * 70ms); transition: border-color .25s, background .25s, box-shadow .25s; }
        .pr-vq-q.pr-joy { cursor: pointer; }
        .pr-vq-q.kutadi { border: 1.5px dashed ${fon(T.accent, 0.55)}; }
        .pr-vq-q.pr-joy:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pr-vq-q.h-ok { box-shadow: inset 0 0 0 1.5px ${fon(T.ok, 0.45)}; }
        .pr-vq-q.h-err { box-shadow: inset 0 0 0 1.5px ${fon(T.err, 0.45)}; }
        .pr-vq-q.h-acc { border-color: ${fon(T.accent, 0.55)}; }
        .pr-vq-q.h-tanl { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pr-vq-nom { grid-area: nom; display: flex; align-items: baseline; flex-wrap: wrap; gap: 2px 8px; min-width: 0; }
        .pr-vq-nom b { font-size: 13.5px; font-weight: 800; color: ${T.ink}; }
        .pr-vq-nom em { font-style: normal; font-size: 12px; font-weight: 600; color: ${T.ink2}; }
        .pr-vq-bel { grid-area: bel; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; border: 1.5px dashed ${fon(T.ink2, 0.4)}; font-weight: 800; font-size: 15px; }
        .pr-vq-bel.ok { border: 1.5px solid ${T.ok}; background: ${T.okFon}; color: ${T.ok}; animation: pr-pop .4s ease-out; }
        .pr-vq-bel.err { border: 1.5px solid ${T.err}; background: ${T.errFon}; color: ${T.err}; animation: pr-pop .4s ease-out; }
        .pr-vq-iz { grid-area: iz; display: flex; align-items: center; gap: 8px; min-width: 0; min-height: 18px; }
        .pr-vq-iz .pr-q-bo { flex: 1; margin: 6px 0; }
        .pr-vq-izt { flex: 1; min-width: 0; font-size: 12.5px; line-height: 1.4; color: ${T.ink}; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
        .pr-tuz, .pr-vq-yor { flex-shrink: 0; font-style: normal; font-size: 11px; font-weight: 800; border-radius: 99px; padding: 2px 8px; }
        .pr-tuz { color: ${T.ok}; background: ${T.okFon}; animation: pr-pop .4s ease-out; }
        .pr-vq-yor { color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pr-vq-vaqt { align-self: flex-end; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .pr-vq-vaqt b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        .pr-vq-vaqt.oshdi b { color: ${T.err}; }
        .pr-vq-tg { grid-area: bel; display: flex; gap: 6px; }
        .pr-vq-tg .q-chip { padding: 4px 12px; font-size: 15px; font-weight: 800; }
        input.pr-vq-in { width: 100%; min-width: 0; font: 500 13px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 8px; padding: 6px 9px; outline: none; }
        input.pr-vq-in:focus { border-color: ${T.accent}; }
        input.pr-vq-in.err { border-color: ${T.err}; }

        /* bashorat, taxmin qatori, bitta natija bloki */
        .pr-bash > .q-bashorat { animation: pr-kart-kir .45s ease-out; }
        .pr-bash .q-chip { animation: pr-kir .35s ease-out backwards; }
        .pr-bash .q-chip:nth-child(2) { animation-delay: .1s; } .pr-bash .q-chip:nth-child(3) { animation-delay: .2s; }
        .pr-taxmin { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; }
        .pr-taxmin-l { font-size: 10.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.accent}; }
        .pr-taxmin-s { color: ${T.ink2}; }
        .pr-taxmin b { color: ${T.ink}; }
        .pr-tx-bel { font-style: normal; font-weight: 800; }
        .pr-tx-bel.ok { color: ${T.ok}; } .pr-tx-bel.err { color: ${T.err}; }
        .pr-nat-tx { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .pr-nat-tx.ok { color: ${T.ok}; } .pr-nat-tx b { color: ${T.ink}; }
        .pr-nat-iz { display: block; margin-top: 6px; font-size: 13px; font-weight: 500; color: ${T.ink2}; }
        .pr-nat-iz b { color: ${T.ink}; }

        /* qadam qatori va asosiy keyingi harakat (SABOQ 11) */
        .pr-qadam { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px 14px; }
        .pr-qadam .q-izoh { flex-basis: 100%; text-align: center; }
        .pr-qadam-d { display: flex; gap: 6px; }
        .pr-qadam-d i { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 99px; font-style: normal; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.line}; background: ${T.paper}; transition: background .3s, color .3s; }
        .pr-qadam-d i.ok { background: ${T.okFon}; color: ${T.ok}; box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        .pr-qadam-d i.on { background: ${T.accent}; color: ${T.paper}; box-shadow: none; }
        .pr-qadam-t { font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .q-btn.pr-bos { box-shadow: 0 0 0 3px ${fon(T.accent, 0.22)}; animation: pr-puls 1.7s ease-out .4s 3; }
        .pr-kutadi { box-shadow: 0 0 0 2px ${fon(T.accent, 0.35)}; animation: pr-puls 1.7s ease-out .3s 3; }
        .q-kod:has(.pr-kod-ong) { align-items: start; }
        .q-kod:has(.pr-kod-ong) > .q-col > .q-karta { flex-grow: 0; }
        .q-kod:has(.pr-kod-ong) .q-karta > .q-btn { margin-top: 4px; }

        /* 0, 1, 2-ekran sahnalari */
        .pr-s0 .pr-sl { min-height: 128px; }
        .pr-s1 .pr-sl { min-height: 74px; }
        .pr-s1 .pr-sl.yangi::before { animation-duration: .8s; }

        /* 4-ekran: Airbnb taqdimot oynasi */
        .pr-airbnb { font-weight: 800; color: #FF5A5F; white-space: nowrap; }
        .pr-nuq { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .pr-nuq-l { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .pr-nuq i { width: 9px; height: 9px; border-radius: 99px; background: ${T.line}; transition: background .3s; }
        .pr-nuq i.ok { background: ${T.ok}; } .pr-nuq i.cur { background: ${T.accent}; }
        .pr-voqea { align-self: stretch; width: 100%; display: flex; flex-direction: column; gap: 12px; animation: pr-kir .35s ease-out; }
        .pr-voqea-h { text-align: center; font-size: clamp(15px,1.8vw,17px); font-weight: 800; color: ${T.ink}; }
        p.pr-tanish { margin: 0; text-align: center; font-size: 14px; font-weight: 600; color: ${T.ink2}; }
        .pr-voqea > .zoomable { align-self: stretch; }
        .pr-ab { width: min(780px, 100%); margin: 0 auto; border-radius: 14px; overflow: hidden; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.5); }
        .pr-ab-bar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .pr-ab-bar > i { width: 9px; height: 9px; border-radius: 50%; background: ${fon(T.ink2, 0.3)}; }
        .pr-ab-bar .pr-airbnb { margin-left: 8px; font-size: 14px; }
        .pr-ab-ichi { display: grid; grid-template-columns: minmax(0, .82fr) minmax(0, 1.18fr); gap: 16px; padding: 14px; align-items: center; }
        .pr-ab-katta { aspect-ratio: 16 / 9; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.45); animation: pr-kir .4s ease-out; }
        .pr-ab-katta.on { border: 2px solid ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.14)}; }
        .pr-ab-ch { display: block; width: 60%; height: 9px; border-radius: 5px; background: ${T.line}; }
        .pr-ab-ch.uzun { width: 74%; height: 12px; } .pr-ab-ch.qisqa { width: 38%; }
        .pr-ab-savol { font-size: 54px; font-weight: 800; line-height: 1; color: ${T.accent}; animation: pr-pop .45s ease-out; }
        .pr-ab-knom { font-size: clamp(22px,3vw,32px); font-weight: 800; color: ${T.ink}; animation: pr-yoz .7s ease-out; }
        .pr-ab-katta.on .pr-ab-knom { color: ${T.accent}; }
        .pr-ab-kichik { position: relative; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
        .pr-ab-k { aspect-ratio: 16 / 10; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; padding: 4px; border-radius: 7px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 4px 10px -8px rgba(${T.shadowBase},0.5); animation: pr-kir .35s ease-out backwards; animation-delay: calc(var(--k) * 90ms); transition: border-color .3s, background .3s; }
        .pr-ab-k > i { display: block; width: 62%; height: 4px; border-radius: 2px; background: ${T.line}; }
        .pr-ab-k > i + i { width: 40%; }
        .pr-ab-k > b { font-size: 12px; font-weight: 800; color: ${T.ink}; text-align: center; overflow-wrap: anywhere; line-height: 1.15; }
        .pr-ab-k.yangi > b { animation: pr-yoz .6s ease-out; }
        .pr-ab-k.on { border: 2px solid ${T.accent}; background: ${T.accentSoft}; }
        .pr-ab-k.on > b { color: ${T.accent}; }
        .pr-ab-q { position: absolute; top: -16px; left: 50%; transform: translateX(-50%); z-index: 2; width: 30px; height: 30px; border-radius: 99px; display: flex; align-items: center; justify-content: center; background: ${T.accent}; color: ${T.paper}; font-weight: 800; animation: pr-pop .45s ease-out; }
        .pr-ab.b1 .pr-ab-kichik { padding-top: 18px; }

        /* 6-ekran: bitta katta Raqamlar slaydi */
        .pr-s6 { display: flex; flex-direction: row; align-items: stretch; gap: 12px; width: 100%; padding: clamp(12px,1.8vw,16px); border-radius: 16px; background: ${fon(T.accent, 0.07)}; }
        .pr-rs { flex: 1 1 auto; min-width: 0; position: relative; display: flex; flex-direction: column; gap: 8px; min-height: 204px; padding: 14px 18px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 12px 28px -16px rgba(${T.shadowBase},0.45); border: 1.5px solid transparent; transition: border-color .4s, box-shadow .4s; }
        .pr-rs.toliq { border-color: ${T.ok}; box-shadow: 0 0 0 3px ${fon(T.ok, 0.14)}; }
        .pr-rs-bosh { display: flex; align-items: center; gap: 8px; }
        .pr-rs-blok { margin-left: auto; font-style: normal; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 2px 9px; }
        .pr-rs-17 { display: block; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: clamp(52px,7vw,72px); font-weight: 800; line-height: 1; color: ${T.accent}; animation: pr-pop .5s ease-out; }
        .pr-rs-ro { display: flex; flex-direction: column; gap: 10px; }
        .pr-rs-q { display: grid; grid-template-columns: auto minmax(0, 1fr) 64px; align-items: center; gap: 4px 12px; min-height: 32px; }
        .pr-rs-y { grid-column: 1; font-style: normal; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 3px 9px; white-space: nowrap; animation: pr-kir .4s ease-out backwards; animation-delay: calc(var(--j) * 120ms + 150ms); }
        .pr-rs-t { grid-column: 2; font-size: clamp(13.5px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; overflow-wrap: anywhere; }
        .pr-rs-q.yozildi .pr-rs-t { animation: pr-yoz .9s ease-out; }
        .pr-rs-q > .pr-q-bo { grid-column: 1 / 3; }
        .pr-rs-son { grid-column: 3; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: clamp(24px,3vw,30px); font-weight: 800; color: ${T.ink}; }
        .pr-rs-q:first-child .pr-rs-son { color: ${T.accent}; }
        .pr-s6 .pr-zal { flex: 0 0 230px; flex-direction: column; justify-content: flex-end; align-items: center; padding-top: 0; }
        .pr-s6 .pr-zal-p { top: 18px; }
        .pr-s6 .pr-pf { white-space: normal; text-align: center; max-width: 220px; }

        /* 8-ekran: gap-karta, varaq, «Yozilmaydi» qutisi, o'ngda besh slayd */
        .pr-s8-h { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .pr-s8-ong { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .pr-dasta { position: relative; padding-bottom: 10px; }
        .pr-dasta-q { position: absolute; left: 10px; right: 10px; bottom: 4px; height: 14px; border-radius: 0 0 12px 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pr-dasta-q.q1 { z-index: 0; }
        .pr-dasta-q.q2 { left: 20px; right: 20px; bottom: -2px; opacity: .7; }
        .pr-gap { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 6px; width: 100%; text-align: left; padding: 14px 18px; border-radius: 14px; background: ${T.paper}; border: 2px solid ${T.accent}; font: inherit; color: ${T.ink}; cursor: grab; box-shadow: 0 0 0 4px ${fon(T.accent, 0.12)}, 0 14px 30px -16px ${fon(T.accent, 0.6)}; animation: pr-kart-kir .45s ease-out; }
        .pr-gap.silk { animation: pr-silk .42s ease-in-out; }
        .pr-gap-n { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; color: ${T.accent}; }
        .pr-gap-t { font-size: clamp(15px,1.6vw,16px); font-weight: 600; line-height: 1.45; }
        .pr-s8, .pr-s13 { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pr-s13-ast { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); gap: 14px; align-items: start; }
        .pr-s13-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pr-s8-ong .q-xulosa, .pr-s13-ong .q-xulosa { padding: 14px 16px; }
        .pr-s8-ast { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 12px; align-items: start; }
        .pr-s8-ast > .pr-quti { min-height: 120px; }
        .pr-quti { display: flex; flex-direction: column; gap: 6px; width: 100%; min-height: 54px; text-align: left; padding: 10px 12px; border-radius: 12px; border: 2px dashed ${fon(T.ink2, 0.35)}; background: transparent; font: inherit; color: ${T.ink2}; transition: border-color .25s, background .25s; }
        .pr-quti.kutadi { cursor: pointer; border-color: ${fon(T.accent, 0.55)}; }
        .pr-quti.kutadi:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pr-quti:disabled { cursor: default; }
        .pr-quti-l { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.ink2}; }
        .pr-quti-g { display: flex; flex-direction: column; gap: 2px; padding: 6px 9px; border-radius: 8px; background: ${T.bg}; font-size: 12.5px; color: ${T.ink2}; }
        .pr-quti-g em { font-style: normal; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; }
        .pr-s8-sl .pr-sl { animation-delay: calc(var(--i, 0) * 70ms + 150ms); }
        /* bir qatorli varaq (8, 12, 13-ekran, keng ekranda): nom va savol · izoh · belgi */
        @media (min-width: 900px) {
          .pr-vq-s8 .pr-vq-q, .pr-vq-s12 .pr-vq-q { grid-template-columns: 230px minmax(0, 1fr) auto; grid-template-areas: "nom iz bel"; padding: 6px 10px; }
          .pr-vq-s13 .pr-vq-q { grid-template-columns: 150px minmax(0, 1fr) auto; grid-template-areas: "nom iz bel"; padding: 6px 10px; }
          .pr-vq-s8 .pr-vq-nom, .pr-vq-s12 .pr-vq-nom, .pr-vq-s13 .pr-vq-nom { flex-direction: column; flex-wrap: nowrap; gap: 0; }
        }

        /* 10-ekran: vazifa, son, darvoza, Neon maketi, ixcham slayd */
        ol.pr-vazifa { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        ol.pr-vazifa li { display: flex; gap: 9px; align-items: flex-start; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        ol.pr-vazifa li > i { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 99px; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-size: 11.5px; font-weight: 800; transition: background .3s, color .3s; }
        ol.pr-vazifa li.ok > i { background: ${T.okFon}; color: ${T.ok}; }
        .pr-son-ro { display: flex; flex-wrap: wrap; gap: 10px 14px; }
        label.pr-son-m { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        label.pr-son-m input { width: 118px; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 11px; outline: none; }
        label.pr-son-m:first-child input { width: 64px; text-align: center; }
        label.pr-son-m input:focus { border-color: ${T.accent}; background: ${T.paper}; }
        label.pr-son-m input::placeholder { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 500; color: ${fon(T.ink2, 0.7)}; }
        .pr-darvoza { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; animation: pr-kart-kir .4s ease-out; }
        .pr-darvoza-s { font-size: 13.5px; font-weight: 700; color: ${T.ink}; line-height: 1.4; }
        .pr-darvoza-t { display: flex; flex-wrap: wrap; gap: 6px; }
        .pr-darvoza-t .q-chip { padding: 7px 10px; font-size: 13px; }
        .pr-yordam { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .pr-kod-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pr-neon { border-radius: 14px; overflow: hidden; background: ${CODE.bg}; border: 1px solid ${T.line}; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.5); animation: pr-kir .45s ease-out; }
        .pr-neon-bar { display: flex; align-items: center; gap: 6px; padding: 8px 10px; background: rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .pr-neon-bar > i { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.22); }
        .pr-neon-tab { margin-left: 6px; font-size: 12px; font-weight: 700; color: ${CODE.text}; background: rgba(255,255,255,0.08); border-radius: 6px; padding: 3px 9px; }
        .pr-neon-run { margin-left: auto; font-size: 12px; font-weight: 800; color: ${CODE.bg}; background: ${CODE.str}; border-radius: 6px; padding: 4px 12px; }
        .pr-neon-run.kutadi { animation: pr-puls-y 1.6s ease-out 3; }
        pre.pr-neon-sql { margin: 0; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-variant-ligatures: none; font-size: 13.5px; line-height: 1.8; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; }
        .pr-neon-sql .kw { color: ${CODE.punct}; font-weight: 700; }
        .pr-neon-sql .str { color: ${CODE.str}; }
        input.pr-neon-in { width: 11.5ch; font: 700 13.5px 'JetBrains Mono', monospace; color: ${CODE.attr}; background: rgba(255,255,255,0.08); border: none; border-bottom: 2px solid transparent; border-radius: 4px; padding: 1px 5px; outline: none; }
        input.pr-neon-in::placeholder { color: ${CODE.attr}; opacity: .8; }
        input.pr-neon-in:focus { background: rgba(255,255,255,0.14); }
        input.pr-neon-in.ok { color: ${CODE.str}; border-bottom: 2px solid ${CODE.str}; }
        input.pr-neon-in.kutadi { animation: pr-puls-y 1.6s ease-out .4s 3; }
        .pr-neon-jadval { display: grid; grid-template-columns: max-content; margin: 0 16px 16px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.14); }
        .pr-neon-th, .pr-neon-td { font-family: 'JetBrains Mono', monospace; font-size: 13px; padding: 6px 24px; text-align: center; }
        .pr-neon-th { color: ${CODE.punct}; background: rgba(255,255,255,0.06); font-weight: 700; }
        .pr-neon-td { color: ${fon(T.paper, 0.55)}; font-size: 18px; font-weight: 800; }
        .pr-neon-td.bor { color: ${CODE.str}; animation: pr-pop .45s ease-out; }
        .pr-mini { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: border-color .4s, box-shadow .4s; }
        .pr-mini.toliq { border-color: ${T.ok}; box-shadow: 0 0 0 3px ${fon(T.ok, 0.14)}; }
        .pr-mini .pr-q-t { font-size: 14px; -webkit-line-clamp: 2; }

        /* 11, 12, 13-ekran formalari */
        .pr-forma { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.08)}; animation: pr-kart-kir .4s ease-out; }
        .pr-forma.xato { border-color: ${T.err}; box-shadow: 0 0 0 4px ${fon(T.err, 0.08)}; }
        .pr-forma.saq { border-color: ${T.ok}; box-shadow: 0 0 0 4px ${fon(T.ok, 0.08)}; }
        .pr-forma-h { font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.accent}; }
        .pr-forma-h em { margin-left: 8px; font-style: normal; text-transform: none; letter-spacing: 0; font-weight: 600; font-size: 13px; color: ${T.ink2}; }
        label.pr-mayd { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        label.pr-mayd > span { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        textarea.pr-kirit { width: 100%; resize: none; font: 500 14.5px 'Manrope', sans-serif; line-height: 1.45; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 10px 12px; outline: none; transition: border-color .2s, background .2s; }
        textarea.pr-kirit:focus { border-color: ${T.accent}; background: ${T.paper}; }
        textarea.pr-kirit.err { border-color: ${T.err}; }
        .pr-forma-t { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; align-items: center; }
        p.pr-kulrang { margin: 0; font-size: 12.5px; font-style: italic; color: ${T.ink2}; }
        .pr-s12 .pr-q-t { -webkit-line-clamp: 2; }
        .pr-s12 .pr-q:has(.pr-q-y) .pr-q-t { -webkit-line-clamp: 1; }
        .pr-s11.tayyor .pr-sl { min-height: 110px; }
        .pr-s2.q3 .pr-tm-l { min-height: 30px; }
        .pr-s2 .pr-q-t { -webkit-line-clamp: 2; }
        .pr-s12-q2 .pr-sl { padding: 8px 11px; }
        .pr-s13-sl .pr-sl.h-xato .pr-sl-nom { color: ${T.err}; }
        .pr-soat { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 18px; padding: 9px 14px; border-radius: 12px; background: ${T.paper}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.4); }
        .pr-soat-q { display: flex; align-items: center; gap: 8px; font-size: 14.5px; font-weight: 800; color: ${T.ink}; }
        .pr-soat-q em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        .pr-soat-v { display: flex; align-items: baseline; gap: 8px; margin-left: auto; }
        .pr-soat-v b { font-family: 'JetBrains Mono', monospace; font-size: clamp(30px,4vw,40px); font-weight: 800; line-height: 1; color: ${T.ink}; }
        .pr-soat.yur .pr-soat-v b { color: ${T.accent}; }
        .pr-soat.bitdi .pr-soat-v b { color: ${T.ink2}; }
        .pr-soat-v em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: ${T.err}; }
        .pr-soat-b { display: flex; align-items: center; gap: 10px; }
        .pr-soat-s { font-size: 13px; font-weight: 800; color: ${T.accent}; }
        .pr-forma.pr-q12 { gap: 12px; }
        .pr-s12-ust { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .pr-q12 .pr-vq { border: none; box-shadow: none; padding: 0; }
        .pr-voqea .q-variantlar { justify-content: center; }
        .pr-q12-bosh { display: flex; align-items: center; gap: 10px; font-size: 14.5px; font-weight: 800; color: ${T.ink}; }
        .pr-q12-bosh em { margin-left: auto; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        .pr-q12-n { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 99px; background: ${T.accent}; color: ${T.paper}; font-style: normal; font-size: 12.5px; font-weight: 800; }
        .pr-q12-n.ok { background: ${T.ok}; }
        .pr-vaqt { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: center; gap: 4px 12px; padding: 4px 0; }
        .pr-vaqt > b { font-family: 'JetBrains Mono', monospace; font-size: clamp(46px,7vw,66px); font-weight: 800; line-height: 1.05; color: ${T.ink}; }
        .pr-vaqt.yur > b { color: ${T.accent}; }
        .pr-vaqt > em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: clamp(20px,3vw,26px); font-weight: 800; color: ${T.err}; }
        .pr-vaqt-s { flex-basis: 100%; text-align: center; font-size: 13px; font-weight: 800; color: ${T.accent}; }
        
        /* yordamchilar: eslatma, nishon, strip, ovoz, kartochka, uyga vazifa, asosiy fikr */
        .pr-mnote-c { align-self: flex-end; }
        .pr-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .pr-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.accent}; }
        p.pr-nishon { margin: 0; font-size: 12px; color: ${T.ink2}; text-align: center; }
        p.pr-nishon.ketdi { opacity: .75; }
        .pr-strip { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; align-self: flex-start; padding: 6px 12px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pr-strip-l { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.accent}; }
        .pr-strip-d { display: flex; gap: 4px; }
        .pr-strip-d i { width: 16px; height: 10px; border-radius: 3px; background: ${T.line}; }
        .pr-strip-d i.on { background: ${T.accent}; }
        .pr-strip-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .pr-ovoz { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .pr-ovoz-q { display: grid; grid-template-columns: minmax(0, 1fr) 90px 26px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink2}; }
        .pr-ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .pr-ovoz-y { height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .pr-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width .5s; }
        .pr-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: pr-halqa 1.8s ease-out .4s 3; }
        p.pr-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.pr-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: pr-puls 1.4s ease-out 3; }
        .pr-fikr { display: flex; flex-direction: column; gap: 3px; align-items: center; text-align: center; background: ${T.paper}; border-radius: 16px; padding: 10px 20px 14px; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .pr-fikr-l { font-weight: 800; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.pr-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        .pr-hw { display: flex; flex-direction: column; gap: 10px; }
        .pr-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .pr-hw-q { display: flex; flex-direction: column; gap: 2px; background: ${T.bg}; border-radius: 10px; padding: 8px 10px; }
        .pr-hw-k { font-size: 10.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .pr-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.pr-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        ol.pr-hw-qadam li { display: flex; gap: 9px; align-items: flex-start; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        ol.pr-hw-qadam li > i { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 99px; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-size: 11.5px; font-weight: 800; }
        .pr-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }

        @keyframes pr-kir { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes pr-kart-kir { from { opacity: 0; transform: translateY(16px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes pr-pop { 0% { transform: scale(.5); opacity: 0; } 70% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes pr-pf { 0% { opacity: 0; transform: translateX(-50%) translateY(8px) scale(.8); } 100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        @keyframes pr-yoz { 0% { opacity: 0; background: ${fon(T.accent, 0.22)}; transform: translateX(-6px); } 35% { opacity: 1; transform: none; } 100% { background: transparent; } }
        @keyframes pr-yon { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes pr-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.5)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        @keyframes pr-puls-h { 0% { box-shadow: 0 0 0 2px ${fon(T.accent, 0.7)}; } 100% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } }
        @keyframes pr-puls-y { 0% { box-shadow: 0 0 0 0 rgba(125,209,129,0.6); } 100% { box-shadow: 0 0 0 10px rgba(125,209,129,0); } }
        @keyframes pr-halqa { 0% { box-shadow: 0 0 0 3px ${T.accent}; } 50% { box-shadow: 0 0 0 7px ${fon(T.accent, 0.25)}; } 100% { box-shadow: 0 0 0 3px ${T.accent}; } }
        @keyframes pr-tm-yon { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; background: ${fon(T.accent, 0.6)}; } }
        @keyframes pr-silk { 0%, 100% { transform: none; } 20% { transform: translateX(-9px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-6px); } 80% { transform: translateX(4px); } }

        /* telefon (393): tasma — qatorlar; varaq slaydlar ostida; 8, 13-ekranda besh slayd — ixcham raqamli qator */
        @media (max-width: 640px) {
          .pr-sahna { padding: 10px; gap: 10px; }
          .pr-sahna.t-tasma:not(.pr-s1) .pr-tasma { grid-template-columns: minmax(0, 1fr); gap: 7px; }
          .pr-sahna.t-tasma:not(.pr-s1) .pr-sl { min-height: 0; padding: 8px 10px; }
          .pr-sahna.t-tasma .pr-q-t { -webkit-line-clamp: 2; }
          .pr-s1 .pr-tasma { gap: 6px; } .pr-s1 .pr-sl { min-height: 56px; padding: 7px; }
          .pr-tm-l > span { font-size: 11px; }
          .pr-tm-l em { display: none; }
          .pr-ab-ichi { grid-template-columns: minmax(0, 1fr); gap: 12px; padding: 12px; }
          .pr-ab-k > b { font-size: 11px; }
          .pr-rs { padding: 12px; min-height: 0; }
          .pr-rs-q { grid-template-columns: minmax(0, 1fr) 48px; }
          .pr-rs-y { grid-column: 1 / -1; justify-self: start; }
          .pr-rs-t { grid-column: 1; }
          .pr-rs-q > .pr-q-bo { grid-column: 1 / -1; }
          .pr-rs-son { grid-column: 2; }
          .pr-s8-ast, .pr-s13-ast { grid-template-columns: minmax(0, 1fr); }
          .pr-s8-ast > .pr-quti { min-height: 54px; }
          .pr-sahna.t-qator .pr-tasma { gap: 5px; }
          .pr-sahna.t-qator .pr-sl { justify-content: center; padding: 7px 4px; }
          .pr-sahna.t-qator .pr-sl-nom, .pr-sahna.t-qator .pr-sl-tuz { display: none; }
          .pr-sahna.t-qator .pr-sl-bosh { justify-content: center; }
          .pr-s6 { flex-direction: column; }
          .pr-s6 .pr-zal { flex-basis: auto; min-height: 86px; }
          .pr-soat-v { margin-left: 0; }
          .pr-s0 .pr-q + .pr-q { display: none; }
          .pr-s0 .pr-tm-u { display: none; }
          .q-kirish .q-split > .q-col:has(.q-variant) { order: -1; }
          .pr-hw-karta { grid-template-columns: minmax(0, 1fr); }
          .pr-vq-q { padding: 7px 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pr-sl, .pr-sl::before, .pr-sl::after, .pr-q-t, .pr-sl-n, .pr-sl-bel, .pr-sl-tuz, .pr-tm-k, .pr-tm-ort, .pr-tm-ust, .pr-pf, .pr-bosh, .pr-vq-h, .pr-vq-q, .pr-vq-bel, .pr-tuz,
          .pr-bash > .q-bashorat, .pr-bash .q-chip, .q-btn.pr-bos, .pr-kutadi, .pr-voqea, .pr-ab-katta, .pr-ab-savol, .pr-ab-knom, .pr-ab-k, .pr-ab-k > b, .pr-ab-q, .pr-rs-17, .pr-rs-y, .pr-rs-t,
          .pr-gap, .pr-darvoza, .pr-neon, .pr-neon-run, .pr-neon-in, .pr-neon-td, .pr-forma, .pr-flash .fc-front, .pr-fc-ipucha i { animation: none !important; transition: none !important; }
          .pr-zal.bur .pr-bosh { transform: none; }
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
