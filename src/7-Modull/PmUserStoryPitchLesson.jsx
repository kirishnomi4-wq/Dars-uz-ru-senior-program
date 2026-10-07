import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 9-Modul · 12-dars (PM, 2-tur) «Pitchingizda kimning hikoyasi bor?» — kalit m7-12, 16 ekran.
// Manba-haqiqat: feedback/F-1005-9modul/12-PmUserStoryPitch-v3.md (GATE M 05.10.2026). Skelet: src/skelet/NamunaDars.jsx (konveyer).
// Ekranlar: s0 QKirish · s1 QReja · s2/s4/s8 QTushuncha · s3/s5/s7/s11 test (QuestionScreen → QTest) · s6 QVoqea (Canva) ·
//   s9/s12 QMustaqil · s10 QKod · podium · QKartochka · QYakun. Bitta vizual — PitchSahna (uch slayd + zal), keys-maketi — CanvaMock.
// Artefakt: pm-m7d12-pitch (s9 yozadi, s12 o'qiydi); 3-dars pm-m7d3-muammo — s9 da kulrang ma'lumot qatori.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QQadamlar, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';
// PM-082: kod ekrani — platforma kompilyatori (nomi va qobig'i tegilmaydi)
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';







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

const LESSON_META = { lessonId: 'm7-12-v1', lessonTitle: { uz: 'Pitchingizda kimning hikoyasi bor?', ru: 'Чья история в вашем питче?' } };
// 16 ekran · oqim: kirish → reja → raqam va hikoya → 1-savol → saralash → 2-savol → Canva → 3-savol → uch slayd → mustaqil ish → kod → yakuniy savol → repetitsiya → podium → kartochkalar → yakun
// «Uyga vazifa» banneri fon so'zlari (R-008, MD: pitch · hikoya · slayd · odam)
const HW_TOKENS = [
  { t: { uz: 'pitch', ru: 'питч' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'hikoya', ru: 'история' }, l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'slayd', ru: 'слайд' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'odam', ru: 'человек' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0  · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1  · QReja
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 2  · QTushuncha: raqam va hikoya
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 3  · 1-savol
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 4  · QTushuncha: saralash
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 5  · 2-savol
  { id: 's6',  type: 'case',        template: 'custom',   scored: false, scope: null },            // 6  · QVoqea: Canva
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 7  · 3-savol
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 8  · QTushuncha: uch slayd
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 9  · QMustaqil: pitch yozish
  { id: 's10', type: 'koding',      template: 'custom',   scored: false, scope: null },            // 10 · QKod
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 11 · yakuniy savol
  { id: 's12', type: 'reflection',  template: 'custom',   scored: false, scope: null },            // 12 · QMustaqil: repetitsiya
  { id: 'podium', type: 'stats',      template: 'custom', scored: false, scope: null },            // 13 · podium (QNatija — qolip standarti)
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },            // 14 · QKartochka
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }             // 15 · QYakun
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
  return <button className={`btn-white-accent${faol ? ' ps-bos-nav' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Dars yangi — ✔ o'rni MD bo'yicha: s3 = B · s5 = C · s7 = A · s11 = D.
// Qolgan kalitlar — mashq signallari (500+ zonasi, variant yo'q): -1 sentinel.
const INLINE_KEYS = { s3: 1, s5: 2, s7: 0, s11: 3, saralash: -1, slaydlar: -1, practice: -1, koding: -1, repetitsiya: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: 'Raqam yonida hikoya', ru: 'История рядом с числом' },
    cards: [
      { ic: '1', h: { uz: 'Raqam', ru: 'Число' }, body: { uz: "Raqam 5 suhbatda necha kishida chiqqanini ko'rsatadi.", ru: 'Число показывает, у скольких людей из 5 бесед это было.' } },
      { ic: '2', h: { uz: 'Hikoya', ru: 'История' }, body: { uz: "Hikoya bitta odamda u qanday bo'lganini ko'rsatadi.", ru: 'История показывает, как это было у одного человека.' } },
      { ic: '3', h: { uz: 'Birga', ru: 'Вместе' }, body: { uz: 'Pitchda ikkalasi bitta slaydda yonma-yon turadi.', ru: 'В питче они стоят рядом на одном слайде.' }, ask: { uz: "Slaydda «4 / 5» turibdi. Yoniga yana nima qo'yasiz?", ru: 'На слайде стоит «4 / 5». Что ещё поставите рядом?' } }
    ]
  },
  5: {
    title: { uz: "Hikoya — bo'lib o'tgan ish", ru: 'История — то, что произошло' },
    cards: [
      { ic: '1', h: { uz: 'Hikoya', ru: 'История' }, body: { uz: "Hikoya — bitta real odam bilan bo'lib o'tgan ish.", ru: 'История — то, что произошло с одним реальным человеком.' } },
      { ic: '2', h: { uz: "Fikr va va'da", ru: 'Мнение и обещание' }, body: { uz: "«Hammaga kerak» — fikr, «albatta ishlatadi» — va'da.", ru: '«Нужно всем» — мнение, «обязательно будут пользоваться» — обещание.' } },
      { ic: '3', h: { uz: 'Hikoya emas', ru: 'Не история' }, body: { uz: "Ikkalasida ham bo'lib o'tgan ish yo'q, ular hikoya emas.", ru: 'В обоих ничего не произошло, это не истории.' }, ask: { uz: "Navbat ilovasi pitchida qaysi gap hikoya bo'ladi?", ru: 'Какая фраза в питче приложения очереди будет историей?' } }
    ]
  },
  7: {
    title: { uz: "Canva'dagidek", ru: 'Как у Canva' },
    cards: [
      { ic: '1', h: { uz: 'Talabalarga dars', ru: 'Уроки студентам' }, body: { uz: "Melanie Perkins talabalarga dizayn dasturlarini o'rgatgan.", ru: 'Мелани Перкинс учила студентов дизайнерским программам.' } },
      { ic: '2', h: { uz: 'Muammo', ru: 'Проблема' }, body: { uz: "Talabalar tugmalar qayerdaligini o'rganishga qiynalgan.", ru: 'Студенты мучились, выучивая, где кнопки.' } },
      { ic: '3', h: { uz: 'Yangi slayd', ru: 'Новый слайд' }, body: { uz: "Investor tushunmaganda, u muammoni ko'rsatadigan slayd qo'shgan.", ru: 'Когда инвестор не понял, она добавила слайд, который показывает проблему.' }, ask: { uz: "Zal «Maydon» muammosini tushunmadi. Pitchga nima qo'shasiz?", ru: 'Зал не понял проблему «Maydon». Что добавите в питч?' } }
    ]
  },
  11: {
    title: { uz: 'Kimning hikoyasi qaysi slaydda', ru: 'Чья история на каком слайде' },
    cards: [
      { ic: '1', h: { uz: 'Muammo slaydi', ru: 'Слайд «Проблема»' }, body: { uz: 'Muammo slaydida — intervyudagi odamning hikoyasi.', ru: 'На слайде «Проблема» — история человека из интервью.' } },
      { ic: '2', h: { uz: 'Foydalanuvchi slaydi', ru: 'Слайд «Пользователь»' }, body: { uz: 'Foydalanuvchi slaydida — saytni sinovda ishlatgan odamning hikoyasi.', ru: 'На слайде «Пользователь» — история человека, который пользовался сайтом на тесте.' } },
      { ic: '3', h: { uz: 'Tuzatish', ru: 'Исправление' }, body: { uz: 'Sinov hikoyasi yonida tuzatilgan narsa turadi.', ru: 'Рядом с историей теста стоит то, что исправили.' }, ask: { uz: 'Navbat ilovasi pitchi: foydalanuvchi slaydiga nima chiqadi?', ru: 'Питч приложения очереди: что попадёт на слайд «Пользователь»?' } }
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

// ===== DARSNING BITTA VIZUALI — Sahna (PitchSahna, 163/180): 1–3 slayd tasmasi + zal (4 siluet, savol pufagi / ✓) =====
// 8-Modul 14-dars «Sahna ekrani» slaydining davomi. Bitta manba — MAYDON (s0, s2, s4, s8, s10, s12 shundan o'qiydi).
// qolip-maket: ps-tahrir
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const cxx = (...a) => a.filter(Boolean).join(' ');
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const yakkaMi = (live) => !live || (live.mode !== 'student' && live.mode !== 'mentor');
const norm = (s) => String(s || '').toLowerCase().replace(/[\u02BB\u02BC\u2018\u2019`]/g, "'").replace(/\s+/g, ' ').trim();
const KEY_PITCH = 'pm-m7d12-pitch';
const KEY_M3 = 'pm-m7d3-muammo';

// «Maydon» pitchi — bitta manba (tayanch 1, 3-darsdagi 1-yozuv, 10-dars kuzatuvi, 11-dars SINOV.md)
const MAYDON = {
  sarlavha: { uz: 'Maydonga kelasiz — band', ru: 'Приходите на поле — занято' },
  raqam: '4 / 5',
  raqamIzoh: { uz: "5 suhbatdan «maydon band edi» deganlar", ru: 'из 5 бесед сказали «поле было занято»' },
  raqamDemak: { uz: "demak bu bitta odamning gapi emas", ru: 'значит, это слова не одного человека' },
  hikoya: { uz: "O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.", ru: 'В прошлую пятницу пришли с друзьями — поле было занято. Перед приходом я звонил владельцу, чтобы забронировать время, — не взял трубку.' },
  yechim: { uz: "Sayt kun bo'yicha bo'sh vaqt kataklarini ko'rsatadi, katakni band qiladi", ru: 'Сайт показывает свободные ячейки времени по дням и бронирует ячейку' },
  sinov: { uz: "Sinovda o'yinchi shanba 18:00 ga band qilmoqchi bo'ldi, lekin «Band qilish» tugmasini topa olmadi", ru: 'На тесте игрок хотел забронировать субботу 18:00, но не нашёл кнопку «Band qilish»' },
  tuzatish: { uz: "Tugmani ekran pastiga qotirdik — qayta sinovda yangi o'yinchi birinchi urinishda band qildi", ru: 'Закрепили кнопку внизу экрана — на повторном тесте новый игрок забронировал с первой попытки' },
  intervyu: [
    { t: { uz: "oxirgi marta kelganimizda maydon band edi", ru: 'в прошлый раз, когда пришли, поле было занято' }, n: 4 },
    { t: { uz: "egasi telefonni ko'tarmadi", ru: 'владелец не взял трубку' }, n: 3 },
    { t: { uz: "jamoaga odam yetmadi", ru: 'не хватило людей в команду' }, n: 2 },
    { t: { uz: "pulni bo'lishish qiyin", ru: 'трудно делить деньги' }, n: 1 }
  ],
  kuzatuv: [
    { uz: "«Band qilish» tugmasini topa olmadi", ru: 'не нашёл кнопку «Band qilish»' },
    { uz: "band bo'lgandan keyin nima bo'lganini tushunmadi", ru: 'не понял, что произошло после брони' },
    { uz: "kunni almashtirishni sezmadi", ru: 'не заметил, как сменить день' }
  ]
};
const SLAYD = [
  { id: 'muammo', nom: { uz: 'Muammo', ru: 'Проблема' }, pufak: { uz: "Bu qanday bo'lgan?", ru: 'Как это было?' }, manba: { uz: 'intervyudan', ru: 'из интервью' } },
  { id: 'yechim', nom: { uz: 'Yechim', ru: 'Решение' }, pufak: { uz: 'Sayt nima qiladi?', ru: 'Что делает сайт?' }, manba: { uz: 'saytdan', ru: 'с сайта' } },
  { id: 'foyd', nom: { uz: 'Foydalanuvchi', ru: 'Пользователь' }, pufak: { uz: "Kimdir ishlatib ko'rdimi?", ru: 'Кто-нибудь пробовал?' }, manba: { uz: 'sinovdan', ru: 'с теста' } }
];
const NECHTA = { uz: "Bu nechta odamda bo'lgan?", ru: 'У скольких людей так было?' };
const Iqtibos = ({ children }) => <>«{children}»</>;
const Son = ({ children }) => <b className="ps-son">{children}</b>;

// slaydlar: [{ id, nom?, sarlavha?, qatorlar: [{ k, t?, holat: 'bosh'|'matn'|'yozildi'|'joriy'|'xato'|'ok'|'yopiq'|'demo', katta?, yorliq?, onTahrir? }], toliq?, manba?, kotar? }]
// pufak: { joy, t } | 'ok' | null · burilish: slayd indeksi (zal unga buriladi) · plus: ikki slayd orasida «+» (s0) · okKech: ✓ kechikib chiqadi (s1)
const PitchSahna = ({ slaydlar, pufak = null, burilish = null, yorliq, plus = false, okKech, jim = false, className }) => {
  const n = slaydlar.length;
  const chap = burilish != null && burilish < (n - 1) / 2;
  return (
    <div className={cxx('ps-sahna', className)} style={{ '--n': n }}>
      {yorliq && <span className="ps-sahna-l">{yorliq}</span>}
      <div className={cxx('ps-tasma', plus && 'plus')}>
        {slaydlar.map((s, i) => (
          <React.Fragment key={s.id}>
            {plus && i > 0 && <span className="ps-plus" aria-hidden="true">+</span>}
            <div className={cxx('ps-slayd', s.toliq && 'toliq', s.kotar && 'kotar')}>
              <div className="ps-slayd-bosh">
                <span className="ps-slayd-n">{i + 1}</span>
                {s.nom && <b className="ps-slayd-nom">{s.nom}</b>}
                {s.toliq && <span className="ps-slayd-ok" aria-hidden="true">✓</span>}
              </div>
              {s.manba && <span className="ps-manba">{s.manba}</span>}
              {s.sarlavha && <p className="ps-slayd-s">{s.sarlavha}</p>}
              <div className="ps-qatorlar">
                {s.qatorlar.map(q => (
                  <div key={q.k} className={cxx('ps-q', q.holat, q.katta && 'katta')} style={q.dd != null ? { '--dd': `${q.dd}s` } : undefined}>
                    {q.yorliq && <span className="ps-q-yorliq">{q.yorliq}</span>}
                    {q.holat === 'bosh' || q.holat === 'yopiq' || q.holat === 'demo' || !q.t ? <span className="ps-chiziq" aria-hidden="true" /> : <span className="ps-q-t">{q.t}</span>}
                    {q.onTahrir && <button type="button" className="ps-tahrir" onClick={q.onTahrir} aria-label={tr({ uz: 'Tahrirlash', ru: 'Изменить' })}>✎</button>}
                  </div>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className={cxx('ps-zal', jim && 'jim', burilish != null && (chap ? 'chap' : 'ong'))}>
        {pufak === 'ok'
          ? <span className={cxx('ps-pufak ok', okKech && 'kech')} style={okKech ? { '--dd': `${okKech}s` } : undefined} aria-label="✓">✓</span>
          : pufak ? <span key={`${pufak.joy}-${ou(pufak.t)}`} className="ps-pufak" style={{ '--x': `${((pufak.joy + 0.5) / n) * 100}%` }}>{tr(pufak.t)}</span> : null}
        <div className="ps-boshlar" aria-hidden="true">{[0, 1, 2, 3].map(k => <i key={k} className="ps-bosh" style={{ '--k': k }} />)}</div>
      </div>
    </div>
  );
};

// 40 soniya harakatsizlikda bitta ipucha (javobni aytmaydi)
const useIpucha = (faol, kalit, ms = 40000) => {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(false); if (!faol) return undefined; const t = setTimeout(() => setOn(true), ms); return () => clearTimeout(t); }, [faol, kalit, ms]);
  return on;
};
// Mashq tugagach xulosaga silliq skroll (P-051); boshidan tugagan ekranda — yo'q
const useXulosaSkroll = (on, boshdan) => {
  const bosh = useRef(!!boshdan);
  useEffect(() => {
    if (!on || bosh.current) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 420);
    return () => clearTimeout(t);
  }, [on]);
};
// Bir qatordan to'rt qatorgacha o'sadigan matn maydoni (DE-175)
const GrowInput = ({ value, onChange, onEnter, className, ...p }) => {
  const ref = useRef(null);
  useLayoutEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 112)}px`; }, [value]);
  return <textarea ref={ref} rows={1} value={value} onChange={onChange} className={cxx('ps-kirit', className)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && onEnter) { e.preventDefault(); onEnter(); } }} {...p} />;
};
// O'qituvchi eslatmasi — faqat mentor (proyektor) rejimida, bosib ochiladi
const MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const [open, setOpen] = useState(false);
  if (!gate.live || gate.live.mode !== 'mentor') return null;
  return open
    ? <div className="mnote fade-up" onClick={() => setOpen(false)} role="note"><span className="mnote-lbl">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span className="mnote-body">{children}</span></div>
    : <button type="button" className="mnote-chip" onClick={() => setOpen(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</button>;
};
// 151-qonun: birinchi urinish nishoni sharti oldindan aytiladi
const AchRule = ({ screen }) => {
  const earned = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || (gate.live && gate.live.mode === 'mentor') || (earned && earned.has(ach))) return null;
  const lost = am.missed.has(sid);
  return <span className={cxx('ach-rule', lost && 'lost')}>{lost ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</span>;
};
// Jonli dars: hook ovozlari chizig'i (har variant va ovozlar soni)
const OvozChizigi = ({ live, screen, variantlar, mening }) => {
  const [n, setN] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!pin) return undefined;
    let on = true, t = null;
    const tick = async () => { try { const rows = await liveAnswers(pin, screen); if (on) setN(variantlar.map((_, i) => rows.filter(r => r.picked === i).length)); } catch { /* keyingi aylanishda */ } if (on) t = setTimeout(tick, 3000); };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [pin, screen]); // eslint-disable-line
  if (!n) return null;
  const jami = n.reduce((a, b) => a + b, 0);
  return (
    <div className="ps-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={cxx('ps-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="ps-ovoz-yol"><i style={{ width: `${jami ? Math.round((n[i] / jami) * 100) : 0}%` }} /></span><b>{n[i]}</b></div>)}
    </div>
  );
};
// Bashorat (181): tanlov saqlanadi — tanlangach ixcham qator bo'lib natijagacha turadi (SABOQ 11)
const Bashorat = ({ savol, variantlar, tanlov, onTanla, yorliq }) => tanlov == null
  ? <QBashorat yorliq={yorliq || tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar} tanlov={tanlov} onTanla={onTanla} />
  : <p className="ps-taxmin-q fade-step">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{(variantlar.find(v => v.k === tanlov) || {}).t}</b></p>;
const Taxmin = ({ tanlov, togri, variantlar, haqiqat }) => tanlov === togri
  ? <QTaxmin togri>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })}</QTaxmin>
  : <QTaxmin>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {(variantlar.find(v => v.k === tanlov) || {}).t} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></QTaxmin>;
// «Pitchim» artefakt-strip (U-042): 9-ekranda yoziladi; 10, 12, 14, 15-ekranlarda ixcham ko'rinadi
const pitchSlaydlari = (p) => (p ? [!!(p.raqam && p.muammoHikoya), !!p.yechim, !!p.sinovHikoya] : [false, false, false]);
const PitchimStrip = () => {
  const p = lsGet(KEY_PITCH);
  if (!p) return null;
  const s = pitchSlaydlari(p);
  const n = s.filter(Boolean).length;
  return (
    <div className="ps-pitchim fade-up">
      <b>{tr({ uz: 'Pitchim', ru: 'Мой питч' })}</b>
      <span className="ps-pitchim-s" aria-hidden="true">{s.map((x, i) => <i key={i} className={x ? 'ok' : ''} />)}</span>
      <span className="ps-pitchim-n">{n}/3</span>
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish: ikki slayd · ikki teng variant, J-026 — maqtovsiz, hammaga correct: false) =====
const HOOK_OPTS = [
  { id: 'raqam', t: { uz: "Beshta suhbatdan to'rttasida shu holat chiqqani", ru: 'Что в четырёх беседах из пяти был этот случай' } },
  { id: 'hikoya', t: { uz: "To'rt odamning har biri boshidan kechirgan kun", ru: 'День, который пережил каждый из четырёх' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [plus, setPlus] = useState(!!storedAnswer || isMentor);
  useEffect(() => {
    if (picked === null || plus) return undefined;
    const t = setTimeout(() => setPlus(true), kamHarakat() ? 60 : 1300);
    return () => clearTimeout(t);
  }, [picked, plus]);
  const pi = HOOK_OPTS.findIndex(o => o.id === picked);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const slaydlar = [
    { id: 'raqam', kotar: pi === 0 && !plus, qatorlar: [{ k: 'r', t: MAYDON.raqam, holat: 'matn', katta: true }, { k: 'i', t: tr(MAYDON.raqamIzoh), holat: 'matn' }] },
    { id: 'hikoya', kotar: pi === 1 && !plus, qatorlar: [{ k: 'h', t: <Iqtibos>{tr(MAYDON.hikoya)}</Iqtibos>, holat: 'matn' }] }
  ];
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · «Maydon» pitchi', ru: 'Введение · питч «Maydon»' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>4 / 5 raqami ortida <A>nima bor?</A></>, ru: <>Что стоит <A>за числом 4 / 5?</A></> })}
        mentor={<Mentor>{tr({ uz: "Sahnada «Maydon» pitchi — loyihaning qisqa taqdimoti. Ikkala slayd ham intervyu yozuvlaridan olingan, ikkalasi ham rost.", ru: 'На сцене питч «Maydon» — короткая презентация проекта. Оба слайда взяты из записей интервью, оба правдивы.' })}</Mentor>}
        maket={<PitchSahna yorliq={tr({ uz: 'Sahna ekrani', ru: 'Экран сцены' })} slaydlar={slaydlar} plus={plus} burilish={pi >= 0 && !plus ? pi : null} jim className="ps-s0" />}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
        javob={<>
          {picked !== null && <p className="hook-ack fade-step">{tr({ uz: "Ikkalasi ham rost. Raqam suhbatlarda necha kishida chiqqanini aytadi, hikoya — o'sha kunlardan birini.", ru: 'Оба правдивы. Число говорит, у скольких людей это прозвучало в беседах, история — об одном из тех дней.' })}</p>}
          {isLive && (picked !== null || isMentor) && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={pi} />}
        </>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda uch slayd skeleti, qatorlar birma-bir to'q chiziqqa aylanadi — matnsiz, P-015) =====
const REJA = [
  { t: { uz: "Raqam yonida yana nima turishini ko'rasiz", ru: 'Увидите, что ещё стоит рядом с числом' }, teg: { uz: 'raqam', ru: 'число' } },
  { t: { uz: 'Pitchga qaysi gap chiqishini ajratasiz', ru: 'Отберёте, какая фраза попадёт в питч' }, teg: { uz: 'yozuv', ru: 'запись' } },
  { t: { uz: "Mashhur sayt muammoni qanday ko'rsatganini bilib olasiz", ru: 'Узнаете, как известный сайт показал проблему' }, teg: { uz: 'biznes', ru: 'бизнес' } },
  { t: { uz: 'Loyihangiz pitchini yozib, sinfdoshga aytasiz', ru: 'Напишете питч проекта и расскажете однокласснику' }, teg: { uz: 'repetitsiya', ru: 'репетиция' } }
];
const S1_QATOR = [2, 1, 2];
const Screen1 = ({ screen, onNext, onPrev }) => {
  let d = 0;
  const slaydlar = SLAYD.map((s, i) => ({ id: s.id, nom: tr(s.nom), qatorlar: Array.from({ length: S1_QATOR[i] }, (_, k) => ({ k: `q${k}`, holat: 'demo', dd: 0.5 + (d++) * 0.9 })) }));
  return (
    <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun loyihangiz pitchini <A>yozib, aytib ko'rasiz.</A></>, ru: <>Сегодня вы <A>напишете и проговорите</A> питч своего проекта.</> })}
        mentor={<Mentor>{tr({ uz: "Intervyu va kuzatuv yozuvlaringizni yoningizga oling — bugun ular kerak bo'ladi.", ru: 'Положите рядом записи интервью и наблюдений — сегодня они понадобятся.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida — pitch: muammo, yechim va real foydalanuvchi', ru: 'В конце урока — питч: проблема, решение и реальный пользователь' })}
        chap={<PitchSahna slaydlar={slaydlar} pufak="ok" okKech={0.5 + d * 0.9} className="ps-s1" />}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      />
    </Stage>
  );
};

// ===== SCREEN 2 — RAQAM VA HIKOYA (QTushuncha, markaziy: bashorat → QQadamlar (163.8) → slayd o'zgaradi, zal pufagi javob beradi → yorliqlar «raqam · hikoya») =====
const S2_TAXMIN = [
  { k: 'raqam', t: { uz: "Slaydda faqat raqam bo'lsa", ru: 'Если на слайде только число' } },
  { k: 'voqea', t: { uz: "Slaydda faqat bitta voqea bo'lsa", ru: 'Если на слайде только один случай' } },
  { k: 'birga', t: { uz: "Ikkalasi birga bo'lsa", ru: 'Если оба вместе' } }
];
const S2_QADAM = [
  { uz: "Raqamni qo'ying", ru: 'Поставьте число' },
  { uz: "Raqam o'rniga bitta odam bilan bo'lgan voqeani qo'ying", ru: 'Вместо числа поставьте случай с одним человеком' },
  { uz: "Ikkalasini birga qo'ying", ru: 'Поставьте оба вместе' }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const TX = S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }));
  const hik = { k: 'h', t: <Iqtibos>{tr(MAYDON.hikoya)}</Iqtibos>, holat: 'yozildi' };
  const qatorlar = q === 0 ? [{ k: 'a', holat: 'bosh' }, { k: 'b', holat: 'bosh' }]
    : q === 1 ? [{ k: 'r', t: MAYDON.raqam, holat: 'yozildi', katta: true }, { k: 'i', t: tr(MAYDON.raqamIzoh), holat: 'yozildi' }, { k: 'd', t: tr(MAYDON.raqamDemak), holat: 'yozildi' }]
      : q === 2 ? [hik]
        : [{ k: 'r', t: MAYDON.raqam, holat: 'yozildi', katta: true, yorliq: tr({ uz: 'raqam', ru: 'число' }) }, { k: 'i', t: tr(MAYDON.raqamIzoh), holat: 'matn' }, { ...hik, yorliq: tr({ uz: 'hikoya', ru: 'история' }) }];
  const pufak = q === 1 ? { joy: 0, t: SLAYD[0].pufak } : q === 2 ? { joy: 0, t: NECHTA } : q >= 3 ? 'ok' : null;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · raqam yonida', ru: 'Понятие · рядом с числом' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Raqamdan keyin zal <A>yana nimani so'raydi?</A></>, ru: <>Что ещё <A>спросит зал</A> после числа?</> })}
        mentor={<Mentor>{tr({ uz: "Raqam slaydini o'tgan modulda yozgansiz — endi unga yozuvdan bo'laklar qo'shib, zalga qarang.", ru: 'Слайд с числом вы писали в прошлом модуле — теперь добавляйте к нему куски из записей и смотрите на зал.' })}</Mentor>}
        bashorat={!done && <Bashorat savol={tr({ uz: "Qaysi holat muammoni aniqroq ko'rsatadi?", ru: 'Какой вариант точнее показывает проблему?' })} variantlar={TX} tanlov={taxmin} onTanla={setTaxmin} />}
        harakat={<div className={cxx('ps-s2-chap', !taxmin && 'ps-qulf')}>
          <QQadamlar qadamlar={S2_QADAM.map(tr)} joriy={done ? undefined : q} />
          {taxmin && !done && <div className="ps-amal"><QTugma className="ps-bos" key={q} onClick={() => setQ(n => Math.min(3, n + 1))}>{tr(S2_QADAM[q])}</QTugma></div>}
          {ipucha && <QIzoh>{tr({ uz: "Keyingi qadamni bosing — zal yana nima so'rashini ko'ring.", ru: 'Нажмите следующий шаг — посмотрите, что ещё спросит зал.' })}</QIzoh>}
        </div>}
        vizual={<PitchSahna slaydlar={[{ id: 'muammo', nom: tr(SLAYD[0].nom), sarlavha: tr(MAYDON.sarlavha), qatorlar, toliq: q >= 3 }]} pufak={pufak} className={cxx('ps-s2', `q${q}`)} />}
        natija={tugadi && taxmin && <Taxmin tanlov={taxmin} togri="birga" variantlar={TX} haqiqat={tr({ uz: "ikkalasi birga bo'lsa", ru: 'если оба вместе' })} />}
        xulosa={tugadi && tr({ uz: "Raqam — 5 suhbatda bu holat necha kishida chiqqani, hikoya — bitta odamda qanday bo'lgani.", ru: 'Число — у скольких людей из 5 бесед был этот случай, история — как это было у одного человека.' })}
      >
        <MentorNote>{tr({ uz: "2-qadamdan keyin sinfdan so'rang — shu gapni eshitib, muammo nechta odamda ekanini bildingizmi?", ru: 'После 2-го шага спросите класс: услышав эту фразу, вы поняли, у скольких людей эта проблема?' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · raqam yonida', ru: 'Проверка · рядом с числом' })}
    questionText="Slaydda «4 / 5» turibdi. Yoniga yana nima qo'yasiz?"
    question={tr({ uz: <h2 className="title h-ask">Slaydda «4 / 5» turibdi. <A>Yoniga yana nima qo'yasiz?</A></h2>, ru: <h2 className="title h-ask">На слайде стоит «4 / 5». <A>Что ещё поставите рядом?</A></h2> })}
    options={[
      { uz: "O'yinchilar sonini yana bir marta", ru: 'Число игроков ещё раз' },
      { uz: "Bitta o'yinchi bilan bo'lgan ishni", ru: 'Случай с одним игроком' },
      { uz: "O'yinchilarga bergan savollaringizni", ru: 'Вопросы, которые вы задали игрокам' },
      { uz: 'Saytning bosh sahifasidan rasmni', ru: 'Картинку с главной страницы сайта' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Raqam 5 suhbatda necha kishida chiqqanini aytdi, bitta odamning ishi — qanday bo'lganini.", ru: 'Число сказало, у скольких людей из 5 бесед это было, случай одного человека — как это было.' }}
    explainWrong={{
      0: { uz: "Son takrorlansa ham, qanday bo'lgani aytilmaydi.", ru: 'Даже если число повторить, не сказано, как это было.' },
      2: { uz: "Savollar ro'yxati muammo qanday bo'lganini aytmaydi.", ru: 'Список вопросов не говорит, как проявилась проблема.' },
      3: { uz: "Sayt rasmi yechimni ko'rsatadi, muammoni emas.", ru: 'Картинка сайта показывает решение, а не проблему.' },
      default: { uz: "Zal muammo qanday bo'lganini bilishi kerak.", ru: 'Залу нужно узнать, как проявилась проблема.' }
    }} />
);

// ===== SCREEN 4 — BO'LIB O'TGANMI? (QTushuncha, saralash; SABOQ 9 — bir vaqtda bitta gap katta karta bo'lib chiqadi; nishon storyFinder) =====
// To'g'ri «Bo'lib o'tgan ish» — yozuv kartasidagi mos qator yashil ajraladi, gap uning ostiga ixcham chip bo'lib o'tiradi.
// To'g'ri «Fikr yoki va'da» — karta o'ng ustunga tushadi, yozuv kartalari ustidan bir lahza kulrang chiziq o'tadi (mos qator topilmadi).
const GAPLAR = [
  { id: 'g1', matn: { uz: "«O'tgan juma do'stlar bilan keldik — maydon band edi»", ru: '«В прошлую пятницу пришли с друзьями — поле было занято»' }, tomon: 'ish', yozuv: ['intervyu', 0] },
  { id: 'g2', matn: { uz: "«Kelishdan oldin egasiga qo'ng'iroq qilgandim, ko'tarmadi»", ru: '«Перед приходом я звонил владельцу — не взял трубку»' }, tomon: 'ish', yozuv: ['intervyu', 1] },
  { id: 'g3', matn: { uz: "Sinovda o'yinchi «Band qilish» tugmasini topa olmadi", ru: 'На тесте игрок не нашёл кнопку «Band qilish»' }, tomon: 'ish', yozuv: ['kuzatuv', 0] },
  { id: 'g4', matn: { uz: "Bunday sayt hamma o'yinchiga kerak", ru: 'Такой сайт нужен каждому игроку' }, tomon: 'fikr' },
  { id: 'g5', matn: { uz: "O'yinchilar saytni albatta ishlatadi", ru: 'Игроки обязательно будут пользоваться сайтом' }, tomon: 'fikr' },
  { id: 'g6', matn: { uz: 'Sayt juda qulay chiqdi', ru: 'Сайт получился очень удобным' }, tomon: 'fikr' }
];
const S4_TARTIB = ['g4', 'g1', 'g6', 'g3', 'g5', 'g2'];
const TOMON = { ish: { uz: "Bo'lib o'tgan ish", ru: 'Что произошло' }, fikr: { uz: "Fikr yoki va'da", ru: 'Мнение или обещание' } };
const XATO4 = {
  ish: { uz: "Bu yerda odam bilan bo'lgan voqea bor — yozuvni o'qing.", ru: 'Здесь есть случай с человеком — прочитайте запись.' },
  fikr: { uz: "Bu fikr yoki va'da — yozuvda bunday voqea yo'q.", ru: 'Это мнение или обещание — такого случая в записи нет.' }
};
const S4_TAXMIN = [{ k: '2', t: '2' }, { k: '3', t: '3' }, { k: '4', t: '4' }];
const S4_UCH = 420;
const YozuvKarta = ({ sarlavha, qatorlar, joy, gaplar }) => (
  <div className="ps-yozuv">
    <span className="ps-yozuv-h">{sarlavha}</span>
    {qatorlar.map((q, i) => {
      const g = gaplar.filter(x => x.yozuv && x.yozuv[0] === joy && x.yozuv[1] === i);
      return (
        <div key={i} className={cxx('ps-yozuv-q', g.length > 0 && 'topildi')}>
          <span className="ps-yozuv-t">{q.t}</span>{q.n != null && <b className="ps-yozuv-n">{q.n}</b>}
          {g.map(x => <span key={x.id} className="ps-chip kir">{tr(x.matn)}</span>)}
        </div>
      );
    })}
  </div>
);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const live = (useContext(LiveGateCtx) || {}).live;
  const achMiss = useContext(AchMissCtx);
  const xatoRef = useRef(false);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [joylandi, setJoylandi] = useState(() => (storedAnswer ? S4_TARTIB.slice() : []));
  const [uchish, setUchish] = useState(null);
  const [xato, setXato] = useState(null);
  const [supur, setSupur] = useState(0);
  const done = joylandi.length >= GAPLAR.length;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) { onAnswer(screen, { stage: 'saralash', screenIdx: screen, correct: !xatoRef.current, solved: true, picked: true, taxmin }); if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'saralash', 0, true, 0); } }, [done]); // eslint-disable-line
  const byId = (id) => GAPLAR.find(g => g.id === id);
  const joriy = byId(S4_TARTIB.find(id => !joylandi.includes(id)));
  const hal = (tomon) => {
    if (!joriy || uchish || !taxmin) return;
    if (tomon === joriy.tomon) {
      setXato(null); setUchish(tomon);
      setTimeout(() => { setJoylandi(a => [...a, joriy.id]); setUchish(null); if (tomon === 'fikr') setSupur(k => k + 1); }, kamHarakat() ? 60 : S4_UCH);
    } else {
      xatoRef.current = true; if (achMiss) achMiss.miss(screen);
      setXato({ k: Date.now(), x: joriy.tomon });
    }
  };
  const tushgan = joylandi.map(byId);
  const ishlar = tushgan.filter(g => g.tomon === 'ish');
  const fikrlar = tushgan.filter(g => g.tomon === 'fikr');
  const vizual = (
    <div className={cxx('ps-tomonlar', tugadi && 'keng')}>
      <div className="ps-tomon ish">
        <span className="ps-tomon-h">{tr(TOMON.ish)}</span>
        <div className="ps-yozuvlar" key={`s${supur}`}>
          {supur > 0 && !done && <span className="ps-supur" aria-hidden="true" />}
          <YozuvKarta joy="intervyu" gaplar={ishlar} sarlavha={tr({ uz: 'Intervyu yozuvlari · 5', ru: 'Записи интервью · 5' })} qatorlar={MAYDON.intervyu.map(x => ({ t: tr(x.t), n: x.n }))} />
          <YozuvKarta joy="kuzatuv" gaplar={ishlar} sarlavha={tr({ uz: 'Kuzatuv yozuvi · sinov', ru: 'Запись наблюдения · тест' })} qatorlar={MAYDON.kuzatuv.map(x => ({ t: tr(x) }))} />
        </div>
        {done && <span className="ps-atama fade-step">{tr({ uz: "bo'lib o'tgan ish", ru: 'что произошло' })}</span>}
      </div>
      <div className="ps-tomon fikr">
        <span className="ps-tomon-h">{tr(TOMON.fikr)}</span>
        <div className="ps-fikr-joy">{fikrlar.map(g => <span key={g.id} className="ps-chip kir">{tr(g.matn)}</span>)}</div>
        {done && <span className="ps-atama fade-step">{tr({ uz: "fikr yoki va'da", ru: 'мнение или обещание' })}</span>}
      </div>
    </div>
  );
  const silk = xato && joriy;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · yozuvdan olingan gap', ru: 'Понятие · фраза из записи' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tugadi} label={tugadi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: '6 gapni joylang', ru: 'Разложите 6 фраз' })} (${joylandi.length}/6)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Qaysi gap <A>haqiqatan bo'lib o'tgan?</A></>, ru: <>Какая фраза <A>действительно произошла?</A></> })}
        mentor={<Mentor>{tr({ uz: 'Pitch uchun oltita gap yozildi. Yozuvni tekshirib, har birini o\'z tomoniga joylang.', ru: 'Для питча написали шесть фраз. Проверьте по записи и положите каждую на свою сторону.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={tr({ uz: "Olti gapdan nechtasi bo'lib o'tgan ish?", ru: 'Сколько из шести фраз — то, что произошло?' })} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        harakat={!done && <div className={cxx('ps-s4-chap', !taxmin && 'ps-qulf')}>
          {joriy && <div key={silk ? `${joriy.id}-${xato.k}` : joriy.id} className={cxx('ps-katta', silk && 'silk', uchish && `uch-${uchish}`)}>
            <span className="ps-katta-n">{joylandi.length + 1} / 6</span>
            <p className="ps-katta-t">{tr(joriy.matn)}</p>
          </div>}
          <div className="ps-amal ikki">
            <QTugma ikkinchi className={taxmin && !uchish ? 'ps-bos' : undefined} disabled={!taxmin || !!uchish} onClick={() => hal('ish')}>{tr(TOMON.ish)}</QTugma>
            <QTugma ikkinchi className={taxmin && !uchish ? 'ps-bos' : undefined} disabled={!taxmin || !!uchish} onClick={() => hal('fikr')}>{tr(TOMON.fikr)}</QTugma>
          </div>
          {xato && <QXato>{tr(XATO4[xato.x])}</QXato>}
          <AchRule screen={screen} />
        </div>}
        vizual={vizual}
        natija={tugadi && taxmin && <Taxmin tanlov={taxmin} togri="3" variantlar={S4_TAXMIN} haqiqat="3" />}
        xulosa={tugadi && tr({ uz: "Hikoya — bitta real odam bilan bo'lib o'tgan ish. U yozuvdan olinadi, o'ylab topilmaydi.", ru: 'История — то, что произошло с одним реальным человеком. Её берут из записи, а не придумывают.' })}
      >
        <MentorNote>{tr({ uz: "«Sayt juda qulay chiqdi» kuzatuv yozuviga hatto zid — sinovda o'yinchi tugmani topa olmagan. Shuni sinfdan so'rang.", ru: '«Сайт получился очень удобным» даже противоречит записи наблюдения — на тесте игрок не нашёл кнопку. Спросите об этом класс.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 2; boshqa tanish olam — navbat ilovasi, P-002) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · hikoya', ru: 'Проверка · история' })}
    questionText="Navbat ilovasi pitchida qaysi gap hikoya bo'ladi?"
    question={tr({ uz: <h2 className="title h-ask">Navbat ilovasi pitchida qaysi gap <A>hikoya bo'ladi?</A></h2>, ru: <h2 className="title h-ask">Какая фраза в питче приложения очереди <A>будет историей?</A></h2> })}
    options={[
      { uz: 'Bunday ilova hamma odamga kerak', ru: 'Такое приложение нужно всем' },
      { uz: 'Odamlar ilovani albatta ishlatadi', ru: 'Люди обязательно будут им пользоваться' },
      { uz: 'Kecha bir odam sartaroshda uzoq kutdi', ru: 'Вчера один человек долго ждал у парикмахера' },
      { uz: 'Ilova juda qulay va tushunarli chiqdi', ru: 'Приложение вышло очень удобным и понятным' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Unda bitta odam bilan bo'lib o'tgan ish bor.", ru: 'В ней есть то, что произошло с одним человеком.' }}
    explainWrong={{
      0: { uz: "Bu fikr: unda hech kim bilan bo'lgan ish yo'q.", ru: 'Это мнение: в нём ни с кем ничего не произошло.' },
      1: { uz: "Bu va'da: odamlar hali hech narsa qilmagan.", ru: 'Это обещание: люди ещё ничего не сделали.' },
      3: { uz: "«Qulay» degani fikr: kim, qachon, nima qildi — aytilmagan.", ru: '«Удобно» — это мнение: кто, когда, что сделал — не сказано.' },
      default: { uz: "Bitta odam bilan bo'lib o'tgan ishni toping.", ru: 'Найдите то, что произошло с одним человеком.' }
    }} />
);

// ===== SCREEN 6 — CANVA (QVoqea, PM-028: nuqtalar · bosqich nomi + CanvaMock · 2/6 va 5/6 da bashorat; SABOQ 8 — bosqich gapini Mentor aytadi) =====
// Manba (o'quvchi ko'rmaydi; MD 05.10.2026 ochib tekshirgan): Guy Kawasaki, «Remarkable People» — Melanie Perkins suhbati, https://guykawasaki.com/melanie-perkins-canva-ceo/
//   «I was teaching design programs and students would struggle learning the very basics…» · «It was like three years of pitching» ·
//   «Every time we were rejected, we would refine our pitch deck» · «I don't understand your industry» → «how the current design process works and how it's really complicated».
// Sahna (SABOQ 2–3): «Canva» nom-yorlig'i o'z rangida, logotip yo'q, son yo'q; maket har bosqichda o'zgaradi (dastur oynasi → kursor adashadi → rad belgilari → yangi slayd).
const CANVA_KIRISH = { uz: "Canva — taqdimot va rasm yasaydigan sayt. Uni boshlagan Melanie Perkins avval universitetda o'qigan.", ru: 'Canva — сайт, где делают презентации и картинки. Мелани Перкинс, которая его основала, сначала училась в университете.' };
const K_CANVA = [
  { h: { uz: 'Talabalarga dars bergan talaba', ru: 'Студентка, которая учила студентов' }, m: { uz: "Melanie universitetda o'qib yurib, boshqa talabalarga dizayn dasturlarini o'rgatgan.", ru: 'Мелани, пока училась в университете, учила других студентов дизайнерским программам.' }, sahna: 'kirish' },
  { savol: { uz: 'Talabalar nimaga qiynalgan?', ru: 'С чем мучились студенты?' }, sahna: 'kirish', togri: 'tugma',
    v: [{ k: 'rang', t: { uz: 'Chiroyli rang tanlashga', ru: 'С выбором красивого цвета' } }, { k: 'tugma', t: { uz: "Tugmalar qayerdaligini o'rganishga", ru: 'С тем, чтобы выучить, где кнопки' } }, { k: 'vaqt', t: { uz: 'Ishni vaqtida topshirishga', ru: 'Со сдачей работы вовремя' } }] },
  { h: { uz: "Tugma qidirib o'tgan vaqt", ru: 'Время на поиск кнопок' }, m: { uz: "Melanie aytishicha, tugmalar qayerdaligini o'rganishning o'ziga juda ko'p vaqt ketgan. Bu muammoni u talabalarda o'z ko'zi bilan ko'rgan.", ru: 'По словам Мелани, только на то, чтобы выучить, где кнопки, уходило очень много времени. Эту проблему она видела у студентов своими глазами.' }, sahna: 'qidiruv' },
  { h: { uz: 'Uch yil pitch', ru: 'Три года питча' }, m: { uz: "U g'oyasini investorlarga — loyihaga pul tikadigan odamlarga — uch yilga yaqin pitch qilgan. Har rad javobidan keyin taqdimotini yaxshilagan.", ru: 'Почти три года она питчила идею инвесторам — людям, которые вкладывают деньги в проект. После каждого отказа улучшала презентацию.' }, sahna: 'pitch' },
  { savol: { uz: "Investor «sohangizni tushunmayapman» degan. Melanie qanday slayd qo'shgan?", ru: 'Инвестор сказал: «Не понимаю вашу сферу». Какой слайд добавила Мелани?' }, sahna: 'pitch', togri: 'murakkab',
    v: [{ k: 'jamoa', t: { uz: 'Jamoasini tanishtiradigan slayd', ru: 'Слайд, знакомящий с командой' } }, { k: 'murakkab', t: { uz: "Dizayn qanchalik murakkabligini ko'rsatadigan slayd", ru: 'Слайд, показывающий, насколько сложен дизайн' } }, { k: 'daromad', t: { uz: "Kelajakdagi daromadni ko'rsatadigan slayd", ru: 'Слайд о будущей выручке' } }] },
  { h: { uz: "Muammo ko'rinadigan bo'ldi", ru: 'Проблему стало видно' }, m: { uz: "Yangi slayd hozirgi dizayn ishi qanday bo'lishini va qanchalik murakkabligini ko'rsatgan.", ru: 'Новый слайд показал, как сейчас устроена работа над дизайном и насколько она сложна.' }, sahna: 'yangi' }
];
const CanvaMock = ({ holat }) => (
  <div className={`ps-cv h-${holat}`} role="img" aria-label="Canva">
    <span className="ps-canva">Canva</span>
    {(holat === 'kirish' || holat === 'qidiruv') && <div className="ps-cv-ish">
      <div className="ps-cv-oyna">
        <span className="ps-cv-bar"><i /><i /><i /></span>
        <div className="ps-cv-ichi">
          <div className="ps-cv-tugmalar">{Array.from({ length: 28 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</div>
          <div className="ps-cv-qogoz"><span /><span /><span /></div>
        </div>
        {holat === 'qidiruv' && <span className="ps-cv-kursor" />}
      </div>
      <div className="ps-cv-talabalar">{[0, 1, 2].map(k => <i key={k} className="ps-cv-talaba" style={{ '--k': k }} />)}</div>
    </div>}
    {(holat === 'pitch' || holat === 'yangi') && <div className="ps-cv-deck">
      {[0, 1, 2].map(k => <span key={k} className="ps-cv-sl" style={{ '--k': k }}><i /><i /><i />{holat === 'pitch' && <b className="ps-cv-rad">✗</b>}</span>)}
      {holat === 'yangi' && <span className="ps-cv-sl yangi"><svg viewBox="0 0 140 70" preserveAspectRatio="none" aria-hidden="true"><path d="M6 60 C 18 8, 30 64, 42 26 S 58 58, 70 18 S 92 62, 104 22 S 122 50, 134 10" /></svg><span className="ps-cv-nuq">{[0, 1, 2, 3, 4, 5].map(k => <i key={k} style={{ '--k': k }} />)}</span></span>}
    </div>}
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? K_CANVA.length - 1 : 0);
  const [tx, setTx] = useState(() => storedAnswer?.taxmin || {});
  const N = K_CANVA.length;
  const done = b >= N - 1;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin: tx }); }, [done]); // eslint-disable-line
  useXulosaSkroll(done, storedAnswer);
  const bq = K_CANVA[b];
  const tanlov = bq.savol ? (tx[b] ?? null) : null;
  const kutish = !!bq.savol && tanlov == null;
  const yorliq = `Canva · ${b + 1}/${N}`;
  const keyingi = () => { if (b < N - 1) setB(b + 1); else onNext(); };
  const V = bq.v ? bq.v.map(x => ({ k: x.k, t: tanlov === x.k ? `${x.k === bq.togri ? '✓' : '✗'} ${tr(x.t)}` : tr(x.t) })) : [];
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={b < N - 1 ? `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/${N})` : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <>Canva muammosi <A>qayerdan chiqqan?</A></>, ru: <>Откуда <A>взялась проблема</A> Canva?</> })}
        nuqtalar={<>
          <Mentor key={`m${b}`}>{b === 0 ? <>{tr(CANVA_KIRISH)} {tr(bq.m)}</> : tr(bq.savol || bq.m)}</Mentor>
          <div className="ps-nuqtalar"><span className="ps-nuq-l">{yorliq}</span>{K_CANVA.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="ps-voqea" key={b}>
          {bq.h && <span className="ps-voqea-h">{tr(bq.h)}</span>}
          <Zoomable><CanvaMock holat={bq.sahna} /></Zoomable>
          {bq.savol && <QBashorat yorliq={yorliq} savol={null} variantlar={V} tanlov={tanlov} onTanla={(k) => setTx(o => ({ ...o, [b]: k }))} />}
          {bq.savol && tanlov != null && <Taxmin tanlov={tanlov} togri={bq.togri} variantlar={bq.v.map(x => ({ k: x.k, t: tr(x.t) }))} haqiqat={tr(bq.v.find(x => x.k === bq.togri).t)} />}
          {done && <QXulosa>{tr({ uz: "Canva muammosi o'ylab topilmagan — Melanie uni talabalarda ko'rgan va pitchda ko'rinadigan qilgan.", ru: 'Проблему Canva не придумали — Мелани увидела её у студентов и сделала видимой в питче.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Melanie gaplari — Guy Kawasaki bilan suhbatdan (manba pastda). «Rad javobi» — investor pul tikmaslikka qaror qilgani.", ru: 'Слова Мелани — из беседы с Гаем Кавасаки (источник ниже). «Отказ» — инвестор решил не вкладывать деньги.' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 0; Canva qoidasi «Maydon»ga) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Canva'dagidek", ru: 'Проверка · как у Canva' })}
    questionText="Zal «Maydon» muammosini tushunmadi. Pitchga nima qo'shasiz?"
    question={tr({ uz: <h2 className="title h-ask">Zal «Maydon» muammosini tushunmadi. <A>Pitchga nima qo'shasiz?</A></h2>, ru: <h2 className="title h-ask">Зал не понял проблему «Maydon». <A>Что добавите в питч?</A></h2> })}
    options={[
      { uz: "Maydon band bo'lgan kun haqida slayd", ru: 'Слайд о дне, когда поле было занято' },
      { uz: 'Saytni qurishga ketgan haftalar slaydi', ru: 'Слайд о неделях работы над сайтом' },
      { uz: 'Saytning yangi dizayni haqida slayd', ru: 'Слайд о новом дизайне сайта' },
      { uz: "Keyin qo'shiladigan to'lov slaydi", ru: 'Слайд об оплате, которую добавят позже' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Canva'dagidek: muammo qanday bo'lishini ko'rsatadigan slayd qo'shiladi.", ru: 'Как у Canva: добавляют слайд, который показывает, как проявляется проблема.' }}
    explainWrong={{
      1: { uz: "Qurishga ketgan vaqt — mehnat raqami, muammo emas.", ru: 'Время на создание — число труда, а не проблема.' },
      2: { uz: "Dizayn yechim haqida — muammoni ko'rsatmaydi.", ru: 'Дизайн — про решение, он не показывает проблему.' },
      3: { uz: "To'lov keyin qilinadi — u muammoni ko'rsatmaydi.", ru: 'Оплату сделают позже — она не показывает проблему.' },
      default: { uz: "Muammo qanday bo'lishini ko'rsating.", ru: 'Покажите, как проявляется проблема.' }
    }} />
);

// ===== SCREEN 8 — UCH SLAYD (QTushuncha: besh bo'lak bittadan katta karta bo'lib chiqadi → slayd tugmasi; zal pufagi to'lmagan birinchi slayd ustida; nishon pitchBuilder) =====
const BOLAKLAR = [
  { id: 'b2', tur: 'hikoyaI', slayd: 0, joy: 1 },
  { id: 'b4', tur: 'sinov', slayd: 2, joy: 0 },
  { id: 'b3', tur: 'yechim', slayd: 1, joy: 0 },
  { id: 'b1', tur: 'raqam', slayd: 0, joy: 0 },
  { id: 'b5', tur: 'tuzatish', slayd: 2, joy: 1 }
];
const BOLAK_MATN = (id) => id === 'b1' ? <><Son>{MAYDON.raqam}</Son> · {tr({ uz: "intervyuda «maydon band edi» deganlar", ru: 'в интервью сказали «поле было занято»' })}</>
  : id === 'b2' ? <Iqtibos>{tr(MAYDON.hikoya)}</Iqtibos>
    : id === 'b3' ? tr(MAYDON.yechim) : id === 'b4' ? tr(MAYDON.sinov) : tr(MAYDON.tuzatish);
const XATO8 = {
  hikoyaI: { uz: "Intervyuda sayt hali yo'q edi — bu muammo hikoyasi.", ru: 'Во время интервью сайта ещё не было — это история проблемы.' },
  sinov: { uz: 'Bu odam saytni ishlatgan — u foydalanuvchi haqida.', ru: 'Этот человек пользовался сайтом — это о пользователе.' },
  raqam: { uz: 'Bu raqam suhbatlarda necha kishida chiqqanini sanaydi.', ru: 'Это число считает, у скольких людей это прозвучало в беседах.' },
  yechim: { uz: 'Bu gap sayt nima qilishini aytadi.', ru: 'Эта фраза говорит, что делает сайт.' },
  tuzatish: { uz: 'Bu sinovdan keyin tuzatilgan narsa.', ru: 'Это то, что исправили после теста.' }
};
const S8_JOY = [2, 1, 2];
const S8_TAXMIN = SLAYD.map(s => ({ k: s.id, t: s.nom }));
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const live = (useContext(LiveGateCtx) || {}).live;
  const achMiss = useContext(AchMissCtx);
  const xatoRef = useRef(false);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [joylandi, setJoylandi] = useState(() => (storedAnswer ? BOLAKLAR.map(b => b.id) : []));
  const [yangi, setYangi] = useState(null);
  const [uchish, setUchish] = useState(false);
  const [xato, setXato] = useState(null);
  const done = joylandi.length >= BOLAKLAR.length;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) { onAnswer(screen, { stage: 'slaydlar', screenIdx: screen, correct: !xatoRef.current, solved: true, picked: true, taxmin }); if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'slaydlar', 0, true, 0); } }, [done]); // eslint-disable-line
  const joriy = BOLAKLAR.find(b => !joylandi.includes(b.id));
  const hal = (si) => {
    if (!joriy || uchish || !taxmin) return;
    if (si === joriy.slayd) {
      setXato(null); setUchish(true);
      setTimeout(() => { setJoylandi(a => [...a, joriy.id]); setYangi(joriy.id); setUchish(false); }, kamHarakat() ? 60 : S4_UCH);
    } else {
      xatoRef.current = true; if (achMiss) achMiss.miss(screen);
      setXato({ k: Date.now(), x: joriy.tur });
    }
  };
  const slaydlar = SLAYD.map((s, si) => {
    const qatorlar = Array.from({ length: S8_JOY[si] }, (_, j) => {
      const bl = BOLAKLAR.find(b => b.slayd === si && b.joy === j && joylandi.includes(b.id));
      return bl ? { k: bl.id, t: BOLAK_MATN(bl.id), holat: bl.id === yangi ? 'yozildi' : 'matn' } : { k: `b${j}`, holat: 'bosh' };
    });
    return { id: s.id, nom: tr(s.nom), qatorlar, toliq: qatorlar.every(q => q.holat !== 'bosh'), manba: done ? tr(s.manba) : null };
  });
  const birinchi = slaydlar.findIndex(s => !s.toliq);
  const pufak = birinchi < 0 ? 'ok' : { joy: birinchi, t: SLAYD[birinchi].pufak };
  const silk = xato && joriy;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · uch slayd', ru: 'Понятие · три слайда' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tugadi} label={tugadi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "5 bo'lakni joylang", ru: 'Разложите 5 кусков' })} (${joylandi.length}/5)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Qaysi hikoya <A>qaysi slaydga chiqadi?</A></>, ru: <>Какая история <A>попадёт на какой слайд?</A></> })}
        mentor={<Mentor>{tr({ uz: "Beshta bo'lak «Maydon» yozuvlaridan va saytidan — har birini o'z slaydiga joylang.", ru: 'Пять кусков — из записей и сайта «Maydon»: положите каждый на свой слайд.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={tr({ uz: "Sinovdagi o'yinchining hikoyasi qaysi slaydga chiqadi?", ru: 'На какой слайд попадёт история игрока с теста?' })} variantlar={S8_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />}
        harakat={!done && <div className={cxx('ps-s8-bosh', !taxmin && 'ps-qulf')}>
          {joriy && <div key={silk ? `${joriy.id}-${xato.k}` : joriy.id} className={cxx('ps-katta', silk && 'silk', uchish && 'uch-past')}>
            <span className="ps-katta-n">{joylandi.length + 1} / 5</span>
            <p className="ps-katta-t">{BOLAK_MATN(joriy.id)}</p>
          </div>}
          <div className="ps-amal uch">{SLAYD.map((s, si) => <QTugma key={s.id} ikkinchi className={taxmin && !uchish ? 'ps-bos' : undefined} disabled={!taxmin || uchish} onClick={() => hal(si)}>{tr(s.nom)}</QTugma>)}</div>
          {xato && <QXato>{tr(XATO8[xato.x])}</QXato>}
          <AchRule screen={screen} />
        </div>}
        vizual={<div className="ps-s8-viz">
          <QIzoh>{tr({ uz: "Foydalanuvchi slaydida kimligi emas, saytni ishlatganda nima bo'lgani ko'rinadi.", ru: 'На слайде «Пользователь» видно не кто это, а что случилось, когда он пользовался сайтом.' })}</QIzoh>
          <PitchSahna slaydlar={slaydlar} pufak={pufak} className="ps-s8" />
        </div>}
        natija={tugadi && taxmin && <Taxmin tanlov={taxmin} togri="foyd" variantlar={S8_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} haqiqat={tr(SLAYD[2].nom)} />}
        xulosa={tugadi && tr({ uz: "Muammo slaydiga intervyudagi odamning hikoyasi, foydalanuvchi slaydiga sinovdagi odamning hikoyasi chiqadi.", ru: 'На слайд «Проблема» идёт история человека из интервью, на слайд «Пользователь» — история человека с теста.' })}
      >
        <MentorNote>{tr({ uz: "Sinfdan so'rang — intervyudagi o'yinchi nega foydalanuvchi slaydiga chiqmaydi? (U paytda sayt hali yo'q edi.)", ru: 'Спросите класс: почему игрок из интервью не попадает на слайд «Пользователь»? (Тогда сайта ещё не было.)' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 9 — MUSTAQIL ISH (QMustaqil: Sahna — qatorlar = qadamlar 1–4 · forma · Yordam · «Slaydga chiqarish» o'ngda; artefakt pm-m7d12-pitch; nishon realVoice) =====
const S9_QADAM = [
  { k: 'raqam', slayd: 0, nom: { uz: 'raqam', ru: 'число' }, ph: { uz: 'Necha kishidan nechtasi shu muammoni aytdi?', ru: 'Сколько человек из скольких назвали эту проблему?' } },
  { k: 'muammoHikoya', slayd: 0, nom: { uz: 'muammo hikoyasi', ru: 'история проблемы' }, ph: { uz: "Kim edi, nima qilmoqchi edi, nima bo'ldi?", ru: 'Кто это был, что хотел сделать, что случилось?' } },
  { k: 'yechim', slayd: 1, nom: { uz: 'yechim', ru: 'решение' }, ph: { uz: 'Saytingiz shu muammoni qanday hal qiladi?', ru: 'Как ваш сайт решает эту проблему?' } },
  { k: 'sinovHikoya', slayd: 2, nom: { uz: 'sinov hikoyasi', ru: 'история теста' }, ph: { uz: 'Sinovda odam nimaga qoqildi, siz nimani tuzatdingiz?', ru: 'На чём споткнулся человек на тесте, что вы исправили?' } }
];
const XATO9 = {
  son: { uz: 'Raqam qatoriga intervyudagi sonni yozing.', ru: 'В строку числа напишите число из интервью.' },
  hamma: { uz: 'Hikoya bitta odam haqida — u kim edi?', ru: 'История — об одном человеке: кто это был?' },
  fikr: { uz: 'Fikrga o\'xshaydi — yozuvda aynan shunday gap bormi?', ru: 'Похоже на мнение — есть ли такая фраза в записи?' }
};
// PM-108: faqat 1-qadam bloklaydi (son yo'q), 2- va 4-qadamda yo'naltiradi («kerak» to'g'ri hikoyada ham chiqishi mumkin — MD shubhali joylar)
const RE_HAMMA = /(^|[^a-z'])(hamma|ko'pchilik|har kim)/;
const RE_FIKR = /(^|[^a-z'])(albatta|kerak|yoqadi|qulay|zo\u0027r)/;
const tekshir9 = (i, v) => {
  const s = norm(v);
  if (i === 0) return /\d/.test(s) ? null : 'son';
  if (i === 1 || i === 3) { if (RE_HAMMA.test(s)) return 'hamma'; if (RE_FIKR.test(s)) return 'fikr'; }
  return null;
};
const MAYDON_PITCH = {
  raqam: { uz: `${MAYDON.raqam} · 5 suhbatdan «maydon band edi» deganlar`, ru: `${MAYDON.raqam} · из 5 бесед сказали «поле было занято»` },
  muammoHikoya: MAYDON.hikoya, yechim: MAYDON.yechim, sinovHikoya: MAYDON.sinov
};
const maydonPitch = () => Object.fromEntries(Object.entries(MAYDON_PITCH).map(([k, v]) => [k, tr(v)]));
const toliqMi = (p) => !!p && S9_QADAM.every(q => String(p[q.k] || '').trim());
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [p, setP] = useState(() => ({ raqam: '', muammoHikoya: '', yechim: '', sinovHikoya: '', ...(lsGet(KEY_PITCH) || {}) }));
  const [tahrir, setTahrir] = useState(null);
  const [qoralama, setQoralama] = useState('');
  const [yordam, setYordam] = useState(false);
  const [m3] = useState(() => lsGet(KEY_M3));
  const sentRef = useRef(!!storedAnswer);
  const bosh = S9_QADAM.findIndex(q => !String(p[q.k] || '').trim());
  const done = isMentor || (bosh < 0 && tahrir == null);
  const faol = isMentor ? null : (tahrir != null ? tahrir : (bosh >= 0 ? bosh : null));
  useEffect(() => { setQoralama(faol != null ? String(p[S9_QADAM[faol].k] || '') : ''); }, [faol]); // eslint-disable-line
  useXulosaSkroll(done && !isMentor, toliqMi(p) && !!storedAnswer);
  const tek = faol != null && qoralama.trim().length >= 2 ? tekshir9(faol, qoralama) : null;
  const n = S9_QADAM.filter(q => String(p[q.k] || '').trim()).length;
  const chiqarish = () => {
    const v = qoralama.trim();
    if (faol == null || !v || tekshir9(faol, v) === 'son') return;
    const yangi = { ...p, [S9_QADAM[faol].k]: v, savedAt: Date.now() };
    setP(yangi); lsSet(KEY_PITCH, yangi); setTahrir(null); setYordam(false);
    if (toliqMi(yangi) && !sentRef.current) {
      sentRef.current = true;
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'pitch', solved: true, correct: true, picked: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const pp = isMentor ? maydonPitch() : p;
  const slaydlar = SLAYD.map((s, si) => {
    const qatorlar = S9_QADAM.map((q, i) => ({ q, i })).filter(x => x.q.slayd === si).map(({ q, i }) => {
      const v = String(pp[q.k] || '').trim();
      if (i === faol) return { k: q.k, holat: 'joriy', yorliq: `${i + 1} · ${tr(q.nom)}` };
      if (!v) return { k: q.k, holat: 'bosh', yorliq: `${i + 1} · ${tr(q.nom)}` };
      return { k: q.k, t: v, holat: isMentor ? 'matn' : (tekshir9(i, v) ? 'xato' : 'ok'), onTahrir: done && !isMentor ? () => setTahrir(i) : undefined };
    });
    return { id: s.id, nom: tr(s.nom), qatorlar, toliq: qatorlar.every(r => r.holat === 'ok' || r.holat === 'matn') };
  });
  const birinchi = slaydlar.findIndex(s => !s.toliq);
  const pufak = done ? 'ok' : birinchi < 0 ? null : { joy: birinchi, t: SLAYD[birinchi].pufak };
  const top3 = m3 && Array.isArray(m3.shikoyatlar) ? m3.shikoyatlar.filter(x => x && x.t).sort((a, b) => (b.n || 0) - (a.n || 0))[0] : null;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "To'rt qatorni yozing", ru: 'Напишите четыре строки' })} (${n}/4)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Loyihangiz pitchini <A>uch slaydda yozing.</A></>, ru: <>Напишите питч проекта <A>на трёх слайдах.</A></> })}
        mentor={<Mentor>{tr({ uz: 'Yozuvlaringizni yoningizga oching. Hikoyadagi odamning ismini emas, kimligini yozing.', ru: 'Откройте рядом свои записи. В истории пишите не имя человека, а кто он.' })}</Mentor>}
        qadamlar={<Zoomable><PitchSahna slaydlar={slaydlar} pufak={pufak} className={cxx('ps-s9', done && 'tayyor')} /></Zoomable>}
        forma={faol != null && <div className={cxx('ps-forma', tek && 'xato')} key={faol}>
          <span className="ps-forma-l">{faol + 1} · {tr(S9_QADAM[faol].nom)} <span className="ps-forma-s">· {tr(SLAYD[S9_QADAM[faol].slayd].nom)}</span></span>
          {faol === 0 && top3 && <QIzoh>«{top3.t}»{top3.n ? ` — ${top3.n} / ${m3.n || 5}` : ''}</QIzoh>}
          <GrowInput value={qoralama} onChange={e => setQoralama(e.target.value)} onEnter={chiqarish} placeholder={tr(S9_QADAM[faol].ph)} maxLength={220} aria-label={tr(S9_QADAM[faol].ph)} className="ps-bos-kirit" />
          {tek && <QXato>{tr(XATO9[tek])}</QXato>}
          <p className="ps-doimiy">{tr({ uz: "Hikoyani o'ylab topmaysiz — yozuvingizdan olasiz.", ru: 'Историю не придумывают — её берут из своей записи.' })}</p>
        </div>}
        yordam={faol != null && <>
          <div className="ps-amal">
            <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
            <QTugma className={qoralama.trim() && tek !== 'son' ? 'ps-bos' : undefined} disabled={!qoralama.trim() || tek === 'son'} onClick={chiqarish}>{tr({ uz: 'Slaydga chiqarish', ru: 'Вынести на слайд' })}</QTugma>
          </div>
          {yordam && <QIzoh>{tr({ uz: "Real odam bilan hali gaplashmagan bo'lsangiz — sinfdosh bilan mashqdagi yozuvni oling. Sinovdan keyin hali tuzatmagan bo'lsangiz — topilgan muammoni yozing.", ru: 'Если ещё не говорили с реальным человеком — возьмите запись из упражнения с одноклассником. Если после теста ещё не исправили — напишите найденную проблему.' })}</QIzoh>}
        </>}
      >
        {done && <QXulosa>{tr({ uz: "Pitchingizning uch slaydi tayyor: muammo, yechim va foydalanuvchi.", ru: 'Три слайда вашего питча готовы: проблема, решение и пользователь.' })}</QXulosa>}
        {isMentor && <MentorPracticeStats live={live} screen={screen} />}
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — KOD YOZISH (QKod + HtmlCompiler; darvoza-mashq PM-082 c/e; kod nusxalanmaydi; «kompilyator» ta'riflanmaydi) =====
const KOD_STARTER = { uz: `// «Maydon» pitchi uchun yozilgan gaplar (saralashdan tanish)
const gaplar = [
  { matn: "O'tgan juma keldik — maydon band edi", qism: "muammo", turi: "bo'lib o'tgan ish" },
  { matn: "Bunday sayt hamma o'yinchiga kerak", qism: "muammo", turi: "fikr" },
  { matn: "«Band qilish» tugmasini topa olmadi", qism: "foydalanuvchi", turi: "bo'lib o'tgan ish" },
  { matn: "Sayt juda qulay chiqdi", qism: "foydalanuvchi", turi: "fikr" }
];

function hikoyalar(royxat) {
  // bo'lib o'tgan ishlarning matni
  return [];   // shu joyni siz yozasiz
}

console.log(hikoyalar(gaplar));
// ["O'tgan juma keldik — maydon band edi", "«Band qilish» tugmasini topa olmadi"]
console.log(hikoyalar([gaplar[2]]));
// ["«Band qilish» tugmasini topa olmadi"]
console.log(hikoyalar([gaplar[1], gaplar[0]]));
// ["O'tgan juma keldik — maydon band edi"]`,
  ru: `// Фразы, написанные для питча «Maydon» (знакомы по сортировке)
const gaplar = [
  { matn: "В прошлую пятницу пришли — поле было занято", qism: "muammo", turi: "bo'lib o'tgan ish" },
  { matn: "Такой сайт нужен каждому игроку", qism: "muammo", turi: "fikr" },
  { matn: "Не нашёл кнопку «Band qilish»", qism: "foydalanuvchi", turi: "bo'lib o'tgan ish" },
  { matn: "Сайт получился очень удобным", qism: "foydalanuvchi", turi: "fikr" }
];

function hikoyalar(royxat) {
  // текст того, что произошло на самом деле
  return [];   // это место пишете вы
}

console.log(hikoyalar(gaplar));
// ["В прошлую пятницу пришли — поле было занято", "Не нашёл кнопку «Band qilish»"]
console.log(hikoyalar([gaplar[2]]));
// ["Не нашёл кнопку «Band qilish»"]
console.log(hikoyalar([gaplar[1], gaplar[0]]));
// ["В прошлую пятницу пришли — поле было занято"]` };
// Shartlar xulq-atvorga bog'langan (manba-regex emas): for...of ham, filter + map ham o'tadi; starter holatida uchalasi qizil (§140-B)
const KOD_DATA = `[{matn:"O'tgan juma keldik — maydon band edi",qism:"muammo",turi:"bo'lib o'tgan ish"},{matn:"Bunday sayt hamma o'yinchiga kerak",qism:"muammo",turi:"fikr"},{matn:"«Band qilish» tugmasini topa olmadi",qism:"foydalanuvchi",turi:"bo'lib o'tgan ish"},{matn:"Sayt juda qulay chiqdi",qism:"foydalanuvchi",turi:"fikr"}]`;
const KOD_VAZIFA = [
  { uz: "Funksiya ro'yxat (massiv) qaytaradi", ru: 'Функция возвращает список (массив)' },
  { uz: "Ro'yxatga faqat bo'lib o'tgan ishlar tushadi", ru: 'В список попадает только то, что произошло' },
  { uz: 'Uchala `console.log` kutilgandek chiqdi', ru: 'Все три `console.log` вывели ожидаемое' }
];
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: 'app.js — hikoyalar funksiyasini yakunlang', ru: 'app.js — допишите функцию hikoyalar' },
  files: [{ name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: { uz: "// bo'lib o'tgan ishlarni yig'ib qaytaring", ru: '// соберите и верните то, что произошло' } }],
  requirements: [
    { id: 'royxat', label: KOD_VAZIFA[0],
      check: C.evalEquals(`(function(){var a=hikoyalar(${KOD_DATA});return (Array.isArray(a)&&a.length===2)?"ha":"yoq";})()`, 'ha', { uz: "Funksiya ro'yxat qaytarsin: to'rt gapdan ikkitasi tushadi.", ru: 'Функция должна вернуть список: из четырёх фраз попадают две.' }) },
    { id: 'faqat', label: KOD_VAZIFA[1],
      check: C.evalEquals(`(function(){var a=hikoyalar(${KOD_DATA});if(!Array.isArray(a))return "";return a.join("|");})()`, "O'tgan juma keldik — maydon band edi|«Band qilish» tugmasini topa olmadi", { uz: "Ro'yxatga faqat bo'lib o'tgan ish tushsin, fikr emas.", ru: 'Пусть в список попадает только то, что произошло, а не мнение.' }) },
    { id: 'kichik', label: { uz: 'Uchala console.log kutilgandek chiqdi', ru: 'Все три console.log вывели ожидаемое' },
      check: C.evalEquals(`(function(){var d=${KOD_DATA};var b=hikoyalar([d[2]]),c=hikoyalar([d[1],d[0]]);if(!Array.isArray(b)||!Array.isArray(c))return "";return b.join("|")+"/"+c.join("|");})()`, "«Band qilish» tugmasini topa olmadi/O'tgan juma keldik — maydon band edi", { uz: "Kichik ro'yxatda ham faqat yozuvdan olingani qolsin.", ru: 'И в маленьком списке пусть останется только взятое из записи.' }) }
  ]
};
const KOD_DARVOZA = [
  { id: 'matn', ok: false, x: { uz: "`matn` — gapning o'zi; uning turi alohida yozilgan.", ru: '`matn` — сама фраза; её тип записан отдельно.' } },
  { id: 'qism', ok: false, x: { uz: '`qism` — slayd nomi; gapning turini aytmaydi.', ru: '`qism` — название слайда; тип фразы оно не говорит.' } },
  { id: 'turi', ok: true }
];
// Kod namunasi (o'qish uchun, nusxalanmaydi): darvozadan keyin `turi` qiymatlari bir lahza ajraladi — bo'lib o'tgan ish yashil, fikr kulrang
const KodNamuna = ({ ajrat }) => (
  <pre className={cxx('ps-kod', ajrat && 'ajrat')} onCopy={(e) => e.preventDefault()} aria-label="app.js">
    {tr(KOD_STARTER).split('\n').slice(0, 11).map((l, i) => {
      if (l.trim().startsWith('//')) return <span key={i} className="ps-kod-izoh">{l}{'\n'}</span>;
      const m = /^(.*turi: )"([^"]+)"(.*)$/.exec(l);
      if (!m) return <span key={i}>{l}{'\n'}</span>;
      return <span key={i}>{m[1]}<b className={cxx('ps-tur', m[2] === 'fikr' ? 'fikr' : 'ish')}>"{m[2]}"</b>{m[3]}{'\n'}</span>;
    })}
  </pre>
);
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — u o'quvchi matni emas, qolip API nomi (1-dars naqshi, MEXANIZM-TAKLIF 10)
const QKOD_ONG = 'muh\u0061rrir';
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'turi' : null));
  const [miss, setMiss] = useState(null);
  const [ajrat, setAjrat] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(() => (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const stage2 = !!gpick || isMentor || done;
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 2400); return () => clearTimeout(t); }, [ajrat]);
  const pickGate = (g) => { if (stage2) return; if (g.ok) { setGpick(g.id); setMiss(null); setAjrat(true); } else setMiss({ id: g.id, k: Date.now() }); };
  const finish = ({ codes, code: htmlCode }) => {
    const yangi = (codes && codes['app.js']) || htmlCode || code || tr(KOD_STARTER);
    setOpen(false); setCode(yangi);
    if (!done) {
      setDone(true);
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: yangi, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish', ru: 'Пишем код' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Qiymatni tanlang', ru: 'Выберите значение' }) : tr({ uz: 'Kodni yozing', ru: 'Напишите код' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Bo'lib o'tgan ishlarni ajratadigan <A>kod yozamiz.</A></>, ru: <>Пишем <A>код,</A> который отбирает то, что произошло.</> })}
        mentor={<Mentor>{!stage2
          ? tr({ uz: "Gaplarni qo'lda ajratgan edingiz — endi shu ishni kod bajaradi. Gaplar o'sha «Maydon» pitchidan.", ru: 'Вы разбирали фразы вручную — теперь эту работу сделает код. Фразы — из того же питча «Maydon».' })
          : tr({ uz: "Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Нажмите кнопку — откроется окно кода: вы пишете код и сразу видите результат здесь.' })}</Mentor>}
        vazifa={<>
          <div className="ps-darvoza">
            <span className="ps-darvoza-s">{tr({ uz: 'Kod gapni qaysi qiymatga qarab ajratadi?', ru: 'По какому значению код отделяет фразу?' })}</span>
            <div className="ps-tanlov">{KOD_DARVOZA.map(g => { const silk = miss && miss.id === g.id; return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} silk={silk} holat={gpick === g.id ? 'ok' : undefined} disabled={stage2 && gpick !== g.id} onClick={() => pickGate(g)}><span className="mono">{g.id}</span></QChip>; })}</div>
            {miss && <QXato>{fmtCode(tr(KOD_DARVOZA.find(g => g.id === miss.id).x))}</QXato>}
          </div>
          {stage2 && <ol className="ps-vazifa">{KOD_VAZIFA.map((v, i) => <li key={i}><i>{i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>}
        </>}
        yordam={stage2 && <div className="ps-yordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
          {yordam && <>
            <QIzoh>{fmtCode(tr({ uz: "Bitta gapdan boshlang: uning `turi` qiymati `\"bo'lib o'tgan ish\"` mi? Ishlagach qolganlariga o'ting.", ru: 'Начните с одной фразы: её значение `turi` — `"bo\'lib o\'tgan ish"`? Когда заработает, переходите к остальным.' }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: "Eslatma (JavaScript darslaridan): `function` — bitta vazifani bajaradigan kod bo'lagi · massiv — ro'yxat · `console.log` — qiymatni ekranga chiqaradi.", ru: 'Напоминание (из уроков JavaScript): `function` — кусочек кода, который выполняет одну задачу · массив — список · `console.log` — выводит значение на экран.' }))}</QIzoh>
          </>}
        </div>}
        {...{ [QKOD_ONG]: <div className="ps-kodoyna">
          <KodNamuna ajrat={ajrat} />
          {stage2 && <div className="ps-amal"><QTugma className={!done && !isMentor ? 'ps-bos' : undefined} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma></div>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      >
        <PitchimStrip />
      </QKod>
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), .hc-root ham o'zi qo'yadi — qobiq tashqi zoomni bekor qiladi */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_STARTER)} storageKey="pm-m7d12-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 11 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s11 = 3; ikki qoida birga, navbat ilovasi) =====
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Navbat ilovasi pitchi: foydalanuvchi slaydiga nima chiqadi?"
    question={tr({ uz: <h2 className="title h-ask">Navbat ilovasi pitchi: <A>foydalanuvchi slaydiga</A> nima chiqadi?</h2>, ru: <h2 className="title h-ask">Питч приложения очереди: что попадёт <A>на слайд «Пользователь»?</A></h2> })}
    options={[
      { uz: 'Intervyuda navbat kutib qiynalganlar soni', ru: 'Число тех, кто в интервью мучился в очереди' },
      { uz: 'Ilovani hamma albatta ishlatadi degan gap', ru: 'Фраза о том, что приложением будут пользоваться все' },
      { uz: 'Ilovani qurishga ketgan besh haftalik ish', ru: 'Пять недель работы над приложением' },
      { uz: 'Sinovda bir odam vaqt tanlay olmagani', ru: 'Как один человек на тесте не смог выбрать время' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Foydalanuvchi slaydiga ilovani sinovda ishlatgan odamning hikoyasi chiqadi.', ru: 'На слайд «Пользователь» идёт история человека, который пользовался приложением на тесте.' }}
    explainWrong={{
      0: { uz: 'Bu son intervyudan — u muammo slaydiga chiqadi.', ru: 'Это число из интервью — оно идёт на слайд «Проблема».' },
      1: { uz: "Bu va'da: hali bo'lib o'tmagan.", ru: 'Это обещание: этого ещё не произошло.' },
      2: { uz: 'Bu mehnat raqami — foydalanuvchi haqida emas.', ru: 'Это число труда — оно не о пользователе.' },
      default: { uz: 'Ilovani ishlatgan odamning hikoyasini toping.', ru: 'Найдите историю человека, который пользовался приложением.' }
    }} />
);

// ===== SCREEN 12 — REPETITSIYA (QMustaqil, 2 qadam): juftlik 2 daqiqa (A 1 + B 1), mustaqil 1 daqiqa · 9-ekran slaydlari yopiq → qator yozilgach ochiladi · nishon rehearsalDone =====
function PitchTaymer({ juft, onTugadi, onBoshla }) {
  const soniya = juft ? 120 : 60;
  const [st, setSt] = useState({ yur: false, qoldi: soniya, tugadi: false });
  useEffect(() => {
    if (!st.yur) return undefined;
    if (st.qoldi <= 0) { setSt({ yur: false, qoldi: 0, tugadi: true }); if (onTugadi) onTugadi(); return undefined; }
    const t = setTimeout(() => setSt(p => ({ ...p, qoldi: p.qoldi - 1 })), 1000);
    return () => clearTimeout(t);
  }, [st.yur, st.qoldi]); // eslint-disable-line
  const boshla = () => { setSt({ yur: true, qoldi: soniya, tugadi: false }); if (onBoshla) onBoshla(); };
  const holat = !st.yur ? null : juft ? (st.qoldi > 60 ? tr({ uz: 'Hozir A gapiradi', ru: 'Сейчас говорит A' }) : tr({ uz: 'Hozir B gapiradi', ru: 'Сейчас говорит B' })) : tr({ uz: 'Hozir ovoz chiqarib ayting', ru: 'Сейчас скажите вслух' });
  const BOSHLASH = juft ? { uz: '2 daqiqani boshlash', ru: 'Запустить 2 минуты' } : { uz: '1 daqiqani boshlash', ru: 'Запустить 1 минуту' };
  const YANA = juft ? { uz: 'Yana 2 daqiqa', ru: 'Ещё 2 минуты' } : { uz: 'Yana 1 daqiqa', ru: 'Ещё 1 минута' };
  return (
    <div className={cxx('ps-taymer', st.yur && 'yur', st.tugadi && 'tugadi')}>
      <span className="ps-taymer-son">{Math.floor(st.qoldi / 60)}:{String(st.qoldi % 60).padStart(2, '0')}</span>
      <span className="ps-taymer-yol" aria-hidden="true"><i style={{ width: `${Math.round((st.yur ? st.qoldi / soniya : (st.tugadi ? 0 : 1)) * 100)}%` }} /></span>
      {holat && <b className="ps-taymer-h" key={holat}>{holat}</b>}
      {st.yur
        ? <QTugma ikkinchi onClick={() => setSt({ yur: false, qoldi: soniya, tugadi: false })}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>
        : <QTugma className={!st.tugadi ? 'ps-bos' : undefined} ikkinchi={st.tugadi} onClick={boshla}>{tr(st.tugadi ? YANA : BOSHLASH)}</QTugma>}
    </div>
  );
}
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const yakka = yakkaMi(live);
  const [pitch] = useState(() => lsGet(KEY_PITCH));
  const ozi = !isMentor && !!pitch && S9_QADAM.some(q => String(pitch[q.k] || '').trim());
  const pp = ozi ? pitch : maydonPitch();
  const [qator, setQator] = useState(() => storedAnswer?.qator || '');
  const [vaqt, setVaqt] = useState(!!storedAnswer?.vaqt);
  const sentRef = useRef(!!(storedAnswer && storedAnswer.correct));
  const yozildi = qator.trim().length >= 8;
  const tayyor = isMentor || yozildi;
  useXulosaSkroll(yozildi && !isMentor, !!(storedAnswer && storedAnswer.qator));
  const joriy = yozildi ? 2 : (vaqt || qator.length > 0 ? 1 : 0);
  useEffect(() => {
    if (!yozildi || isMentor) return;
    onAnswer(screen, { stage: 'repetitsiya', screenIdx: screen, qator: qator.trim(), vaqt, picked: true, solved: true, correct: vaqt });
    if (vaqt && !sentRef.current) { sentRef.current = true; if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'repetitsiya', 0, true, 0); }
  }, [yozildi, vaqt]); // eslint-disable-line
  const QADAM = [yakka ? { uz: 'Ovoz chiqarib ayting', ru: 'Скажите вслух' } : { uz: 'Sinfdoshingizga ayting', ru: 'Скажите однокласснику' }, { uz: 'Endi bir qator yozing', ru: 'Теперь напишите одну строку' }];
  const ochiq = yozildi;
  const slaydlar = SLAYD.map((s, si) => ({ id: s.id, nom: tr(s.nom), toliq: ochiq,
    qatorlar: S9_QADAM.filter(q => q.slayd === si).map(q => ({ k: q.k, t: String(pp[q.k] || '').trim(), holat: ochiq ? (String(pp[q.k] || '').trim() ? 'yozildi' : 'bosh') : 'yopiq' })) }));
  const PH = yakka ? { uz: 'Qaysi odamning hikoyasini va muammosini aytdingiz?', ru: 'Историю какого человека и какую проблему вы рассказали?' } : { uz: 'Sinfdoshingiz qaysi odamni va uning qaysi muammosini eslab qoldi?', ru: 'Какого человека и какую его проблему запомнил одноклассник?' };
  return (
    <Stage eyebrow={tr({ uz: 'Mashq · sinfdosh oldida', ru: 'Упражнение · перед одноклассником' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tayyor} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Pitchingizni <A>1 daqiqada</A> tushuntira olasizmi?</>, ru: <>Сможете объяснить питч <A>за 1 минуту?</A></> })}
        mentor={<Mentor>{tr({ uz: <>Sahnadan oldin pitchni ovoz chiqarib aytib ko'rish repetitsiya deyiladi. Avval {yakka ? "o'zingizga" : 'sinfdoshingizga'} 1 daqiqada ayting, keyin bir qator yozing.</>, ru: <>Проговорить питч вслух перед сценой — это репетиция. Сначала расскажите {yakka ? 'себе' : 'однокласснику'} за 1 минуту, потом напишите одну строку.</> })}</Mentor>}
        qadamlar={<div className="ps-s12-bosh">
          <div className="ps-bosq">{QADAM.map((x, i) => <span key={i} className={cxx('ps-qchip', i === joriy && 'on', i < joriy && 'ok')}>{i < joriy ? '✓' : i + 1} {tr(x)}</span>)}</div>
          {!yakka && <QIzoh>{tr({ uz: 'Har biringizga 1 daqiqadan — avval A, keyin B.', ru: 'Каждому по 1 минуте — сначала A, потом B.' })}</QIzoh>}
          <PitchTaymer juft={!yakka} onTugadi={() => setVaqt(true)} />
        </div>}
        forma={<>
          <Zoomable><PitchSahna slaydlar={slaydlar} pufak={ochiq ? 'ok' : null} jim={!ochiq} className={cxx('ps-s12', ochiq && 'ochiq')} /></Zoomable>
          {!isMentor && <GrowInput value={qator} onChange={e => setQator(e.target.value)} placeholder={tr(PH)} maxLength={200} aria-label={tr(PH)} className={joriy === 1 ? 'ps-bos-kirit' : undefined} />}
        </>}
      >
        {yozildi && <QXulosa>{tr({ uz: 'Bugungi qoida: pitchda raqam yonida bitta real odamning hikoyasi turadi.', ru: 'Правило дня: в питче рядом с числом стоит история одного реального человека.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Tinglovchi baho bermaydi — faqat eslab qolgan odamini aytadi. Hikoya esda qolmagan bo'lsa, u raqam yonida turibdimi — birga tekshiring.", ru: 'Слушатель не ставит оценку — только называет человека, которого запомнил. Если история не запомнилась, проверьте вместе: стоит ли она рядом с числом.' })}</MentorNote>
        {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        <PitchimStrip />
      </QMustaqil>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — 4 ta, faqat REAL harakatga: s4 va s8 — birinchi urinish; s9 — 4/4; s12 — taymer tugagach va qator yozilgach (151-qonun, §184) =====
const ACHIEVEMENTS = {
  storyFinder: { icon: '🔎', name: 'Story Finder!', desc: { uz: 'Olti gapdan yozuvda borini ajratdingiz', ru: 'Вы отделили из шести фраз то, что есть в записи' } },
  pitchBuilder: { icon: '🧩', name: 'Pitch Builder!', desc: { uz: "«Maydon» pitchini uch slaydga yig'dingiz", ru: 'Вы собрали питч «Maydon» на трёх слайдах' } },
  realVoice: { icon: '🗣️', name: 'Real Voice!', desc: { uz: "Pitchingizning to'rt qatorini yozdingiz", ru: 'Вы написали четыре строки своего питча' } },
  rehearsalDone: { icon: '🎤', name: 'Rehearsal Done!', desc: { uz: 'Pitchingizni ovoz chiqarib aytdingiz', ru: 'Вы проговорили свой питч вслух' } }
};
// Ekran id → nishon. s4/s8: `correct` = xatosiz (birinchi urinish, AchMissCtx.miss) · s9: 4/4 · s12: taymer + qator.
const ACH_TRIGGERS = { s4: 'storyFinder', s8: 'pitchBuilder', s9: 'realVoice', s12: 'rehearsalDone' };

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


// Podium savol yorliqlari (SCORED_IDX: 3, 5, 7, 11)
const Q_LABELS = {
  3: { uz: '1 — Raqam yoniga nima', ru: '1 — Что рядом с числом' },
  5: { uz: '2 — Qaysi gap hikoya', ru: '2 — Какая фраза — история' },
  7: { uz: "3 — Canva'dagidek", ru: '3 — Как у Canva' },
  11: { uz: '4 — Foydalanuvchi slaydi', ru: '4 — Слайд «Пользователь»' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru}; MD: pitch · hikoya · raqam · slayd · yozuv · odam · sahna · sinov)
const QZ_BG_SHAPES = [
  { ch: { uz: 'pitch', ru: 'питч' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'hikoya', ru: 'история' }, l: 82, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'raqam', ru: 'число' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'slayd', ru: 'слайд' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'yozuv', ru: 'запись' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'odam', ru: 'человек' }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'sahna', ru: 'сцена' }, l: 24, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'sinov', ru: 'тест' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang — 12 savol (MD), to'g'ri javob: A — 1, 5, 9 · B — 2, 6, 10 · C — 3, 7, 11 · D — 4, 8, 12 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: '«5 kishidan 4 tasi» zalga nimani aytadi?', ru: 'Что говорит залу «4 из 5 человек»?' }, opts: [{ uz: 'Beshta intervyudan nechtasida chiqqanini', ru: 'В скольких из пяти интервью это было' }, { uz: 'Muammo bir odamda qanday kechganini', ru: 'Как проблема прошла у одного человека' }, { uz: 'Saytni nechta odam qurganini', ru: 'Сколько человек делали сайт' }, { uz: 'Intervyu qancha davom etganini', ru: 'Сколько длилось интервью' }], correct: 0 },
  { q: { uz: 'Pitchda faqat hikoya bor. Yoniga nima qo\'yiladi?', ru: 'В питче есть только история. Что ставят рядом?' }, opts: [{ uz: 'Yana bitta shunday hikoya', ru: 'Ещё одну такую историю' }, { uz: 'Intervyudan olingan raqam', ru: 'Число из интервью' }, { uz: 'Saytning rangli rasmi', ru: 'Цветную картинку сайта' }, { uz: "Jamoa a'zolari ro'yxati", ru: 'Список членов команды' }], correct: 1 },
  { q: { uz: "Pitch uchun to'rt gap. Qaysi biri fikr?", ru: 'Четыре фразы для питча. Какая из них — мнение?' }, opts: [{ uz: '«Kelganimizda maydon band edi»', ru: '«Когда пришли, поле было занято»' }, { uz: "«Egasi telefonni ko'tarmadi»", ru: '«Владелец не взял трубку»' }, { uz: '«Bu sayt juda yaxshi chiqdi»', ru: '«Этот сайт получился очень хорошим»' }, { uz: '«Tugmani topa olmadim»', ru: '«Я не нашёл кнопку»' }], correct: 2 },
  { q: { uz: "«O'yinchilar saytni albatta ishlatadi» — bu qanday gap?", ru: '«Игроки обязательно будут пользоваться сайтом» — что это за фраза?' }, opts: [{ uz: 'Intervyudan olingan hikoya', ru: 'История из интервью' }, { uz: 'Sinovda yozilgan kuzatuv', ru: 'Наблюдение, записанное на тесте' }, { uz: 'Muammoni sanagan raqam', ru: 'Число, посчитавшее проблему' }, { uz: "Hali bo'lib o'tmagan va'da", ru: 'Обещание, которое ещё не сбылось' }], correct: 3 },
  { q: { uz: "Yozuvda: «egasi telefonni ko'tarmadi». Pitchga nima yozasiz?", ru: 'В записи: «владелец не взял трубку». Что напишете в питч?' }, opts: [{ uz: "Yozuvdagi gapni o'zgartirmasdan", ru: 'Фразу из записи без изменений' }, { uz: "Maydon egalari telefon ko'tarmaydi", ru: 'Владельцы полей не берут трубку' }, { uz: 'Egasi o\'yinchilarni yoqtirmaydi', ru: 'Владелец не любит игроков' }, { uz: "Egasi bilan janjal bo'lib o'tgan", ru: 'С владельцем была ссора' }], correct: 0 },
  { q: { uz: "Intervyudagi o'yinchining hikoyasi qaysi slaydga chiqadi?", ru: 'На какой слайд попадёт история игрока из интервью?' }, opts: [{ uz: 'Foydalanuvchi slaydiga', ru: 'На слайд «Пользователь»' }, { uz: 'Muammo slaydiga', ru: 'На слайд «Проблема»' }, { uz: 'Yechim slaydiga', ru: 'На слайд «Решение»' }, { uz: 'Uchala slaydga ham', ru: 'На все три слайда' }], correct: 1 },
  { q: { uz: 'Pitch slaydlari qaysi tartibda boradi?', ru: 'В каком порядке идут слайды питча?' }, opts: [{ uz: 'Yechim → muammo → foydalanuvchi', ru: 'Решение → проблема → пользователь' }, { uz: 'Foydalanuvchi → muammo → yechim', ru: 'Пользователь → проблема → решение' }, { uz: 'Muammo → yechim → foydalanuvchi', ru: 'Проблема → решение → пользователь' }, { uz: 'Muammo → foydalanuvchi → yechim', ru: 'Проблема → пользователь → решение' }], correct: 2 },
  { q: { uz: "«Ko'pchilik bo'sh vaqtni bilmaydi» hikoya bo'lishi uchun nima kerak?", ru: 'Что нужно, чтобы «Многие не знают свободное время» стало историей?' }, opts: [{ uz: 'Muammoni boshqacha nomlash', ru: 'Назвать проблему иначе' }, { uz: 'Gapni ikki barobar uzaytirish', ru: 'Удлинить фразу вдвое' }, { uz: "Yoniga katta raqam qo'yish", ru: 'Поставить рядом большое число' }, { uz: 'Bitta odam va uning ishi', ru: 'Один человек и то, что с ним было' }], correct: 3 },
  { q: { uz: 'Melanie Perkins har rad javobidan keyin nima qilgan?', ru: 'Что делала Мелани Перкинс после каждого отказа?' }, opts: [{ uz: 'Taqdimotini yaxshilagan', ru: 'Улучшала презентацию' }, { uz: "Boshqa g'oyaga o'tgan", ru: 'Переходила к другой идее' }, { uz: "Pitch qilishni to'xtatgan", ru: 'Переставала питчить' }, { uz: "Faqat raqamlarni ko'paytirgan", ru: 'Только добавляла цифры' }], correct: 0 },
  { q: { uz: 'Sinovdagi odamni pitchda qanday tilga olasiz?', ru: 'Как вы упомянете человека с теста в питче?' }, opts: [{ uz: "To'liq ismi va familiyasi bilan", ru: 'С полным именем и фамилией' }, { uz: "Kimligi bilan, masalan o'yinchi", ru: 'Кто он, например игрок' }, { uz: 'Telefon raqami bilan birga', ru: 'Вместе с номером телефона' }, { uz: 'Sinfi va maktabi nomi bilan', ru: 'С классом и названием школы' }], correct: 1 },
  { q: { uz: 'Repetitsiyada sinfdoshingiz nima qiladi?', ru: 'Что делает одноклассник на репетиции?' }, opts: [{ uz: "Pitchingizga ball qo'yadi", ru: 'Ставит оценку вашему питчу' }, { uz: 'Pitchni siz uchun aytadi', ru: 'Рассказывает питч за вас' }, { uz: 'Eslab qolganini aytib beradi', ru: 'Пересказывает, что запомнил' }, { uz: 'Slaydlaringizni qayta yozadi', ru: 'Переписывает ваши слайды' }], correct: 2 },
  { q: { uz: "Sinovda o'yinchi tugmani topa olmadi. Pitchda keyin nima aytiladi?", ru: 'На тесте игрок не нашёл кнопку. Что говорят в питче дальше?' }, opts: [{ uz: 'Intervyudagi raqam qaytadan', ru: 'Ещё раз число из интервью' }, { uz: 'Saytni qurgan haftalar soni', ru: 'Сколько недель делали сайт' }, { uz: "Keyin qo'shiladigan to'lov", ru: 'Оплата, которую добавят позже' }, { uz: 'Tugma qanday tuzatilgani', ru: 'Как исправили кнопку' }], correct: 3 },
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

// 🃏 Kartochka mexanikasi va ko'rinishi — qolipda: QKartochka (DE-204). Ta'riflar so'zma-so'z (T-042). SABOQ 16 — Mentor yo'q.
const KARTOCHKALAR = [
  { front: { uz: 'Raqam va hikoya pitchda nimani ko\'rsatadi?', ru: 'Что показывают в питче число и история?' }, back: { uz: "Raqam — 5 suhbatda necha kishida chiqqani; hikoya — bitta odamda qanday bo'lgani", ru: 'Число — у скольких людей из 5 бесед это было; история — как это было у одного человека' } },
  { front: { uz: 'Hikoya nima?', ru: 'Что такое история?' }, back: { uz: "Bitta real odam bilan bo'lib o'tgan ish", ru: 'То, что произошло с одним реальным человеком' } },
  { front: { uz: 'Hikoya qayerdan olinadi?', ru: 'Откуда берут историю?' }, back: { uz: "Intervyu yoki kuzatuv yozuvidan — o'ylab topilmaydi", ru: 'Из записи интервью или наблюдения — её не придумывают' } },
  { front: { uz: '«Bunday sayt hammaga kerak» — hikoyami?', ru: '«Такой сайт нужен всем» — это история?' }, back: { uz: "Yo'q, bu fikr: unda bo'lib o'tgan ish yo'q", ru: 'Нет, это мнение: в нём ничего не произошло' } },
  { front: { uz: "Raqam yolg'iz tursa, zal nimani so'raydi?", ru: 'Если число стоит одно, что спросит зал?' }, back: { uz: "«Bu qanday bo'lgan?»", ru: '«Как это было?»' } },
  { front: { uz: 'Pitch qaysi uch slayddan iborat?', ru: 'Из каких трёх слайдов состоит питч?' }, back: { uz: 'Muammo, yechim va foydalanuvchi', ru: 'Проблема, решение и пользователь' } },
  { front: { uz: 'Muammo va foydalanuvchi slaydida kimning hikoyasi turadi?', ru: 'Чья история стоит на слайдах «Проблема» и «Пользователь»?' }, back: { uz: "Muammoda — intervyudagi odamning; foydalanuvchida — saytni sinovda ishlatgan odamning", ru: 'В «Проблеме» — человека из интервью; в «Пользователе» — человека, который пользовался сайтом на тесте' } },
  { front: { uz: 'Sinov hikoyasi yonida nima turadi?', ru: 'Что стоит рядом с историей теста?' }, back: { uz: 'Sinovdan keyin tuzatilgan narsa', ru: 'То, что исправили после теста' } },
  { front: { uz: "Canva g'oyasi qayerdan chiqqan?", ru: 'Откуда появилась идея Canva?' }, back: { uz: 'Melanie Perkins dars bergan talabalar tugma qidirib qiynalganidan', ru: 'Из того, что студенты, которых учила Мелани Перкинс, мучились в поисках кнопок' } },
  { front: { uz: "Investor tushunmaganda Canva pitchiga nima qo'shilgan?", ru: 'Что добавили в питч Canva, когда инвестор не понял?' }, back: { uz: "Dizayn qanchalik murakkabligini ko'rsatadigan slayd", ru: 'Слайд, показывающий, насколько сложен дизайн' } },
  { front: { uz: 'Repetitsiya nima?', ru: 'Что такое репетиция?' }, back: { uz: "Sahnadan oldin pitchni ovoz chiqarib aytib ko'rish", ru: 'Проговорить питч вслух перед сценой' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cxx('ps-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="ps-fc-ipucha">{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
        <PitchimStrip />
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «kim uchun · nechta · muddat» + raqamli qadamlar; GATE M M-q9 — alohida .homework.jsx YO'Q) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: 'sinovda saytingizni ishlatgan real odam', ru: 'реальный человек, который пользовался вашим сайтом на тесте' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '1 pitch', ru: '1 питч' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'zaxira darsgacha', ru: 'до резервного урока' } }
];
const HW_QADAM = [
  { uz: 'Sinovda saytingizni ishlatgan odamdan ruxsat so\'rang: hikoyasini ismsiz aytasiz.', ru: 'Спросите разрешения у человека, который пользовался сайтом на тесте: вы расскажете его историю без имени.' },
  { uz: "Uni pitchingizni tinglashga taklif qiling va 1 daqiqada aytib bering. Kelolmasa — ruxsati bilan hikoyani ismsiz boshqa tinglovchiga ayting.", ru: 'Пригласите его послушать питч и расскажите за 1 минуту. Если не сможет прийти — с его разрешения расскажите историю без имени другому слушателю.' },
  { uz: "Hikoya u bilan bo'lgandek aytildimi — so'rang; tuzatsa, slaydga yozing.", ru: 'Спросите, так ли рассказана история, как было с ним; если поправит — запишите на слайд.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card ps-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="ps-hw-karta">
      {HW_KARTA.map((r, i) => <div key={i} className="ps-hw-q"><span className="ps-hw-k">{tr(r.k)}</span><span className="ps-hw-v">{tr(r.v)}</span></div>)}
    </div>
    <ol className="ps-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
    <p className="ps-hw-izoh">{tr({ uz: 'Real odam hali sinamagan bo\'lsa — avval u bilan sinov o\'tkazing, keyin pitch.', ru: 'Если реальный человек ещё не пробовал — сначала проведите с ним тест, потом питч.' })}</p>
    {keyingi && <span className="ps-hw-keyingi">{keyingi}</span>}
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
  // «Endi siz bilasiz» — modul yo'li (MD 15-ekran, so'zma-so'z)
  const RECAP = [
    { uz: "Mahsulot — odamlar o'z muammosi uchun ishlatadigan narsa; u real odamning muammosidan boshlanadi.", ru: 'Продукт — то, чем люди пользуются для своей проблемы; он начинается с проблемы реального человека.' },
    { uz: "Muammoni o'rganadigan intervyuda odamning fikri emas, bo'lib o'tgan ishi so'raladi.", ru: 'В интервью о проблеме спрашивают не мнение человека, а то, что с ним произошло.' },
    { uz: 'Agent MVP qurishda talabingizga tayanadi, siz natijani tekshirasiz; animatsiya uni jonli qiladi.', ru: 'Агент строит MVP по вашему требованию, вы проверяете результат; анимация делает его живым.' },
    { uz: "Sinovda tushuntirilmaydi — odam qayerda to'xtashi kuzatiladi.", ru: 'На тесте ничего не объясняют — наблюдают, где человек остановится.' },
    { uz: 'Pitchda raqam yonida bitta real odamning hikoyasi turadi.', ru: 'В питче рядом с числом стоит история одного реального человека.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>Zaxira dars</b>: ortda qolgan ishni yetkazasiz va pitchni sayqallaysiz.</>, ru: <>Следующий урок — <b>Резервный урок</b>: доделаете отставшую работу и отшлифуете питч.</> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Pitchingizda endi <span className="italic" style={{ color: T.accent }}>real odamning hikoyasi</span> bor.</>, ru: <>Теперь в вашем питче есть <span className="italic" style={{ color: T.accent }}>история реального человека</span>.</> })}
        cta={<>
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
      >
        <PitchimStrip />
      </QYakun>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmUserStoryPitchLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARS VIZUALI — Sahna (ps-): uch slayd + zal · CanvaMock · ekran bo'laklari. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .ps-bos, .ps-bos-nav { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: ps-puls 1.6s ease-out .5s 3; }
        .ps-bos-kirit { animation: ps-puls 1.6s ease-out .4s 2; }
        @keyframes ps-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70%, 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        .q-kirish .q-variant:not(:disabled), .q-bashorat .q-chip:not(:disabled), .ps-tanlov .q-chip:not(:disabled):not(.q-silk) { animation: ps-puls 1.6s ease-out .7s 2; }
        .ps-qulf { opacity: .45; pointer-events: none; }
        .ps-amal { display: flex; justify-content: flex-end; align-items: center; gap: 10px; flex-wrap: wrap; }
        .ps-amal.ikki, .ps-amal.uch { justify-content: center; }
        .ps-kirit { width: 100%; resize: none; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 9px 11px; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.45; color: ${T.ink}; background: ${T.paper}; outline: none; min-height: 40px; }
        .ps-kirit:focus { border-color: ${T.accent}; }
        .ach-rule { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .ach-rule.lost { font-style: italic; }
        .mnote-chip { align-self: flex-end; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; padding: 6px 12px; border-radius: 999px; border: 1px dashed ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; }
        .mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; }
        .mnote-lbl { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.accent}; }
        .mnote-body { font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .ps-ovoz { display: flex; flex-direction: column; gap: 6px; }
        .ps-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 28px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink2}; }
        .ps-ovoz-q.men { color: ${T.ink}; font-weight: 700; }
        .ps-ovoz-yol { height: 8px; border-radius: 4px; background: ${T.bg}; overflow: hidden; }
        .ps-ovoz-yol i { display: block; height: 100%; background: ${T.accent}; border-radius: 4px; transition: width .5s; }
        .ps-ovoz-q b { font-family: 'JetBrains Mono', monospace; text-align: right; }
        p.ps-taxmin-q { align-self: flex-start; font-size: 13.5px; color: ${T.ink2}; background: ${T.paper}; border-radius: 10px; padding: 7px 12px; box-shadow: inset 0 0 0 1px ${T.line}; }
        p.ps-taxmin-q b { color: ${T.ink}; }
        @keyframes ps-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        /* Sahna: slayd tasmasi + zal */
        .ps-sahna { display: flex; flex-direction: column; gap: 10px; background: ${fon(T.accent, 0.06)}; border-radius: 16px; padding: clamp(10px,1.6vw,14px); min-width: 0; }
        .ps-sahna-l { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: ${T.ink2}; }
        .ps-tasma { display: grid; grid-template-columns: repeat(var(--n), minmax(0,1fr)); gap: 10px; align-items: stretch; }
        .ps-tasma.plus { grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); }
        .ps-plus { align-self: center; font-family: 'Manrope'; font-weight: 800; font-size: 24px; color: ${T.accent}; animation: ps-pop .45s cubic-bezier(.3,1.5,.5,1) both; }
        @keyframes ps-pop { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: scale(1); } }
        .ps-slayd { background: ${T.paper}; border-radius: 12px; padding: 10px 12px 12px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.25), inset 0 0 0 1px ${T.line}; display: flex; flex-direction: column; gap: 6px; min-width: 0; transition: transform .35s cubic-bezier(.3,1.3,.5,1), box-shadow .35s; }
        .ps-slayd.kotar { transform: translateY(-8px) scale(1.03); box-shadow: 0 16px 30px -12px rgba(${T.shadowBase},0.35), inset 0 0 0 2px ${T.accent}; }
        .ps-slayd.toliq { box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.25), inset 0 0 0 2px ${T.ok}; }
        .ps-slayd-bosh { display: flex; align-items: center; gap: 8px; min-height: 22px; }
        .ps-slayd-n { width: 20px; height: 20px; border-radius: 6px; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ps-slayd-nom { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; letter-spacing: .02em; }
        .ps-slayd-ok { margin-left: 2px; width: 20px; height: 20px; border-radius: 50%; background: ${T.ok}; color: ${T.paper}; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; animation: ps-pop .4s cubic-bezier(.3,1.5,.5,1) both; }
        .ps-manba { align-self: flex-start; font-size: 11px; font-weight: 700; color: ${T.ok}; background: ${T.okFon}; border-radius: 999px; padding: 2px 9px; animation: ps-kir .4s ease-out both; }
        p.ps-slayd-s { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .ps-qatorlar { display: flex; flex-direction: column; gap: 6px; }
        .ps-q { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 8px; min-height: 28px; padding: 4px 6px; border-radius: 8px; transition: background .3s, box-shadow .3s; }
        .ps-q-yorliq { flex-basis: 100%; font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: ${T.accent}; animation: ps-kir .4s ease-out both; }
        .ps-q-t { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; overflow-wrap: anywhere; }
        .ps-q.katta .ps-q-t { font-weight: 800; font-size: clamp(24px,3.2vw,32px); line-height: 1.1; color: ${T.accent}; font-variant-numeric: tabular-nums; }
        .ps-son { font-weight: 800; color: ${T.accent}; font-variant-numeric: tabular-nums; }
        .ps-chiziq { flex: 1; min-width: 40px; height: 6px; border-radius: 99px; background: repeating-linear-gradient(90deg, ${fon(T.ink2, 0.35)} 0 10px, transparent 10px 18px); } /* kesik-ok: slaydning bo'sh qatori (MD «bo'sh — kulrang uzuq chiziq», 8-Modul «Sahna ekrani» naqshi) — maket, bezak emas */
        .ps-q.yozildi { animation: ps-yoz 1s ease-out both; }
        @keyframes ps-yoz { 0% { opacity: 0; transform: translateX(-8px); background: ${T.accentSoft}; } 35% { opacity: 1; transform: none; background: ${T.accentSoft}; } 100% { background: ${fon(T.accentSoft, 0)}; } }
        .ps-q.joriy { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .ps-q.xato { background: ${T.errFon}; }
        .ps-q.ok { box-shadow: inset 0 -2px 0 ${T.ok}; }
        .ps-q.yopiq .ps-chiziq { background: ${fon(T.ink2, 0.22)}; }
        .ps-q.demo .ps-chiziq { animation: ps-demo .5s ease both; animation-delay: var(--dd, 0s); }
        @keyframes ps-demo { from { opacity: .45; } to { opacity: 1; background: ${fon(T.ink, 0.7)}; } }
        .ps-tahrir { margin-left: auto; background: none; border: none; cursor: pointer; color: ${T.ink2}; font-size: 14px; border-radius: 7px; padding: 2px 6px; }
        .ps-tahrir:hover { color: ${T.accent}; background: ${T.accentSoft}; }
        .ps-zal { position: relative; height: 76px; display: flex; align-items: flex-end; justify-content: center; }
        .ps-zal.jim { height: 46px; }
        .ps-boshlar { display: flex; gap: clamp(14px,3vw,30px); }
        .ps-bosh { position: relative; width: 34px; height: 40px; transition: transform .45s cubic-bezier(.3,1.3,.5,1); }
        .ps-bosh::before { content: ''; position: absolute; left: 50%; top: 0; width: 18px; height: 18px; margin-left: -9px; border-radius: 50%; background: ${fon(T.ink2, 0.45)}; }
        .ps-bosh::after { content: ''; position: absolute; left: 0; bottom: 0; width: 34px; height: 19px; border-radius: 17px 17px 4px 4px; background: ${fon(T.ink2, 0.3)}; }
        .ps-zal.chap .ps-bosh { transform: rotate(-12deg) translateX(-4px); }
        .ps-zal.ong .ps-bosh { transform: rotate(12deg) translateX(4px); }
        .ps-pufak { position: absolute; top: 0; left: var(--x, 50%); transform: translateX(-50%); max-width: 92%; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; padding: 6px 11px; border-radius: 12px; box-shadow: 0 6px 14px -6px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}; white-space: nowrap; animation: ps-pufak .45s cubic-bezier(.3,1.4,.5,1) both; }
        .ps-pufak::after { content: ''; position: absolute; bottom: -6px; left: 50%; margin-left: -6px; border: 6px solid transparent; border-bottom: 0; border-top-color: ${T.accent}; }
        .ps-pufak.ok { width: 32px; height: 32px; padding: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${T.ok}; color: ${T.paper}; font-size: 16px; box-shadow: 0 6px 14px -6px rgba(${T.shadowBase},0.3); }
        .ps-pufak.ok::after { border-top-color: ${T.ok}; }
        .ps-pufak.ok.kech { animation-delay: var(--dd, 0s); }
        @keyframes ps-pufak { from { opacity: 0; transform: translateX(-50%) translateY(6px) scale(.9); } to { opacity: 1; transform: translateX(-50%); } }

        /* s2 · s4 · s8 — harakat paneli va katta karta (SABOQ 9) */
        .ps-s2-chap, .ps-s4-chap, .ps-s8-bosh, .ps-s8-viz { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .ps-katta { background: ${T.paper}; border-radius: 14px; padding: 14px 18px; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.line}; display: flex; flex-direction: column; gap: 6px; animation: ps-kir .35s ease-out both; }
        .ps-katta-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        p.ps-katta-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(15px,1.8vw,17px); line-height: 1.45; color: ${T.ink}; }
        .ps-katta.silk { box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.err}; animation: ps-silk .32s ease-in-out 2; }
        @keyframes ps-silk { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        .ps-katta.uch-ish { animation: ps-uch-ish .42s ease-in forwards; }
        .ps-katta.uch-fikr { animation: ps-uch-fikr .42s ease-in forwards; }
        .ps-katta.uch-past { animation: ps-uch-past .42s ease-in forwards; }
        @keyframes ps-uch-ish { to { opacity: 0; transform: translate(60%, 30px) scale(.55); } }
        @keyframes ps-uch-fikr { to { opacity: 0; transform: translate(120%, 30px) scale(.55); } }
        @keyframes ps-uch-past { to { opacity: 0; transform: translateY(90px) scale(.6); } }
        .ps-amal.uch .q-btn { min-width: 128px; }
        .ps-tomonlar { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(0,1fr); gap: 10px; align-items: stretch; }
        .ps-tomon { display: flex; flex-direction: column; gap: 8px; border-radius: 14px; padding: 10px; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; min-width: 0; }
        .ps-tomon.fikr { background: ${fon(T.paper, 0.5)}; box-shadow: none; border: 1.5px dashed ${fon(T.ink2, 0.35)}; }
        .ps-tomon-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .ps-yozuvlar { position: relative; display: flex; flex-direction: column; gap: 8px; overflow: hidden; border-radius: 10px; }
        .ps-yozuv { border-radius: 10px; background: ${T.bg}; padding: 8px 10px; display: flex; flex-direction: column; gap: 3px; }
        .ps-yozuv-h { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.accent}; margin-bottom: 2px; }
        .ps-yozuv-q { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 12.5px; line-height: 1.4; color: ${T.ink}; padding: 3px 6px; border-radius: 7px; transition: background .4s; }
        .ps-yozuv-t { flex: 1; min-width: 0; }
        .ps-yozuv-n { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; color: ${T.ink2}; }
        .ps-yozuv-q.topildi { background: ${T.okFon}; }
        .ps-yozuv-q.topildi .ps-yozuv-n { color: ${T.ok}; }
        .ps-chip { flex-basis: 100%; font-size: 12px; font-weight: 600; line-height: 1.35; color: ${T.ink}; background: ${T.paper}; border-radius: 8px; padding: 4px 8px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .ps-chip.kir { animation: ps-kir .4s ease-out both; }
        .ps-fikr-joy { flex: 1; display: flex; flex-direction: column; gap: 6px; min-height: 60px; }
        .ps-fikr-joy .ps-chip { color: ${T.ink2}; flex-basis: auto; }
        .ps-supur { position: absolute; top: 0; bottom: 0; left: -30%; width: 30%; background: linear-gradient(90deg, ${fon(T.ink2, 0)}, ${fon(T.ink2, 0.28)}, ${fon(T.ink2, 0)}); animation: ps-supur .9s ease-in-out forwards; pointer-events: none; z-index: 2; }
        @keyframes ps-supur { 0%, 85% { opacity: 1; } 100% { left: 110%; opacity: 0; } }
        .ps-atama { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 10px; }

        /* s6 — Canva: nuqtalar · bosqich nomi · CanvaMock */
        .ps-nuqtalar { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .ps-nuq-l { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; margin-right: 6px; }
        .ps-nuqtalar i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; transition: background .3s, transform .3s; }
        .ps-nuqtalar i.ok { background: ${T.ok}; }
        .ps-nuqtalar i.cur { background: ${T.accent}; transform: scale(1.25); }
        .ps-voqea { display: flex; flex-direction: column; gap: 10px; align-items: stretch; width: 100%; animation: ps-kir .35s ease-out both; }
        .ps-voqea-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,1.9vw,19px); color: ${T.ink}; text-align: center; }
        .ps-voqea .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 8px 14px; }
        .ps-voqea .q-bashorat .q-bashorat-s:empty { display: none; }
        .ps-voqea .q-bashorat .q-variantlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .ps-voqea .q-taxmin { text-align: center; }
        .ps-cv { position: relative; height: 270px; padding-top: 34px; border-radius: 14px; background: ${T.bg}; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .ps-canva { position: absolute; top: 10px; left: 14px; z-index: 3; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -.01em; background: linear-gradient(90deg, #00C4CC, #7D2AE8); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .ps-cv-ish { position: relative; width: min(500px, 88%); height: 222px; }
        .ps-cv-oyna { position: absolute; inset: 0 0 40px 0; background: ${T.paper}; border-radius: 10px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.35), inset 0 0 0 1px ${T.line}; overflow: hidden; }
        .ps-cv-bar { display: flex; gap: 5px; padding: 7px 9px; background: ${fon(T.ink2, 0.08)}; }
        .ps-cv-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink2, 0.35)}; }
        .ps-cv-ichi { display: grid; grid-template-columns: 48% 1fr; gap: 8px; padding: 8px; height: calc(100% - 22px); }
        .ps-cv-tugmalar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; align-content: start; }
        .ps-cv-tugmalar i { height: 16px; border-radius: 4px; background: ${fon(T.ink2, 0.18)}; }
        .h-qidiruv .ps-cv-tugmalar i { animation: ps-yon 3.4s ease-in-out infinite; animation-delay: calc(var(--k) * .12s); }
        @keyframes ps-yon { 0%, 12%, 100% { background: ${fon(T.ink2, 0.18)}; } 6% { background: ${T.accent}; } }
        .ps-cv-qogoz { border-radius: 6px; background: ${T.bg}; display: flex; flex-direction: column; gap: 6px; padding: 10px; }
        .ps-cv-qogoz span { height: 8px; border-radius: 4px; background: ${fon(T.ink2, 0.2)}; }
        .ps-cv-qogoz span:nth-child(2) { width: 70%; } .ps-cv-qogoz span:nth-child(3) { width: 45%; }
        .ps-cv-kursor { position: absolute; top: 36px; left: 18px; z-index: 2; width: 14px; height: 20px; background: ${T.ink}; clip-path: polygon(0 0, 0 100%, 30% 72%, 52% 100%, 66% 92%, 44% 66%, 100% 66%); animation: ps-adash 3.4s ease-in-out infinite; }
        @keyframes ps-adash { 0%, 100% { transform: translate(0, 0); } 20% { transform: translate(64px, 30px); } 40% { transform: translate(18px, 66px); } 60% { transform: translate(120px, 8px); } 80% { transform: translate(40px, 48px); } }
        .ps-cv-talabalar { position: absolute; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; gap: 24px; }
        .ps-cv-talaba { position: relative; width: 30px; height: 36px; }
        .ps-cv-talaba::before { content: ''; position: absolute; left: 50%; top: 0; width: 16px; height: 16px; margin-left: -8px; border-radius: 50%; background: ${fon(T.accent, 0.5)}; }
        .ps-cv-talaba::after { content: ''; position: absolute; left: 0; bottom: 0; width: 30px; height: 17px; border-radius: 15px 15px 4px 4px; background: ${fon(T.accent, 0.32)}; }
        .h-qidiruv .ps-cv-talaba { animation: ps-qim 1.6s ease-in-out infinite; animation-delay: calc(var(--k) * .3s); }
        @keyframes ps-qim { 50% { transform: rotate(-8deg); } }
        .ps-cv-deck { position: relative; display: flex; gap: 12px; align-items: center; justify-content: center; width: 100%; padding: 0 16px; }
        .ps-cv-sl { position: relative; width: 124px; height: 82px; flex-shrink: 0; border-radius: 8px; background: ${T.paper}; box-shadow: 0 8px 18px -10px rgba(${T.shadowBase},0.35), inset 0 0 0 1px ${T.line}; display: flex; flex-direction: column; gap: 6px; padding: 10px; transition: opacity .4s, transform .4s; }
        .ps-cv-sl > i { height: 6px; border-radius: 3px; background: ${fon(T.ink2, 0.2)}; }
        .ps-cv-sl > i:first-child { width: 60%; background: ${fon(T.accent, 0.4)}; }
        .h-pitch .ps-cv-sl:nth-child(1) { animation: ps-t1 4.8s ease-in-out infinite; }
        .h-pitch .ps-cv-sl:nth-child(3) { animation: ps-t3 4.8s ease-in-out infinite; }
        @keyframes ps-t1 { 0%, 35%, 100% { transform: none; } 45%, 85% { transform: translateX(272px); } }
        @keyframes ps-t3 { 0%, 35%, 100% { transform: none; } 45%, 85% { transform: translateX(-272px); } }
        .ps-cv-rad { position: absolute; top: -10px; right: -8px; width: 24px; height: 24px; border-radius: 50%; background: ${T.err}; color: ${T.paper}; display: flex; align-items: center; justify-content: center; font-size: 13px; opacity: 0; animation: ps-rad 2.4s ease-in-out infinite; animation-delay: calc(var(--k) * .8s); }
        @keyframes ps-rad { 0%, 100% { opacity: 0; transform: scale(.4); } 15%, 45% { opacity: 1; transform: scale(1); } 60% { opacity: 0; } }
        .h-yangi .ps-cv-sl:not(.yangi) { opacity: .5; transform: scale(.86); }
        .ps-cv-sl.yangi { width: 184px; height: 118px; padding: 0; box-shadow: 0 14px 28px -12px rgba(${T.shadowBase},0.4), inset 0 0 0 2px ${T.accent}; animation: ps-yangi .7s cubic-bezier(.3,1.3,.5,1) both; }
        @keyframes ps-yangi { from { opacity: 0; transform: translateX(46px) scale(.8); } to { opacity: 1; transform: none; } }
        .ps-cv-sl.yangi svg { position: absolute; inset: 12px 10px 22px; width: calc(100% - 20px); height: calc(100% - 34px); }
        .ps-cv-sl.yangi path { fill: none; stroke: ${T.accent}; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 420; stroke-dashoffset: 420; animation: ps-chiz 2.2s ease-out .5s forwards; }
        @keyframes ps-chiz { to { stroke-dashoffset: 0; } }
        .ps-cv-nuq { position: absolute; left: 12px; right: 12px; bottom: 8px; display: flex; justify-content: space-between; }
        .ps-cv-nuq i { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; opacity: 0; animation: ps-pop .3s ease-out both; animation-delay: calc(.6s + var(--k) * .3s); }

        /* s9 · s12 — forma, taymer, qadam-chiplari */
        .ps-forma { display: flex; flex-direction: column; gap: 8px; }
        .ps-forma-l { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.accent}; }
        .ps-forma-s { color: ${T.ink2}; font-weight: 600; }
        .ps-forma.xato .ps-kirit { border-color: ${T.err}; }
        p.ps-doimiy { font-size: 12.5px; color: ${T.ink2}; font-style: italic; }
        .ps-s12-bosh { display: flex; flex-direction: column; gap: 10px; }
        .ps-bosq { display: flex; flex-wrap: wrap; gap: 8px; }
        .ps-qchip { display: inline-flex; align-items: center; gap: 4px; padding: 7px 12px; border-radius: 999px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .ps-qchip.on { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; }
        .ps-qchip.ok { border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; }
        .ps-taymer { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .ps-taymer-son { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 20px; color: ${T.ink}; min-width: 58px; }
        .ps-taymer.yur .ps-taymer-son { color: ${T.accent}; }
        .ps-taymer.tugadi .ps-taymer-son { color: ${T.ok}; }
        .ps-taymer-yol { flex: 1; min-width: 80px; height: 6px; border-radius: 3px; background: ${T.line}; overflow: hidden; }
        .ps-taymer-yol i { display: block; height: 100%; background: ${T.accent}; transition: width 1s linear; }
        .ps-taymer.tugadi .ps-taymer-yol i { background: ${T.ok}; }
        .ps-taymer-h { font-size: 13.5px; color: ${T.accent}; animation: ps-kir .35s ease-out both; }

        /* s10 — kod darvozasi, vazifa, namuna */
        .ps-darvoza { display: flex; flex-direction: column; gap: 8px; }
        .ps-darvoza-s { font-weight: 700; font-size: 14.5px; color: ${T.ink}; }
        .ps-tanlov { display: flex; flex-wrap: wrap; gap: 8px; }
        .ps-yordam { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .ps-kodoyna { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .ps-kod { margin: 0; background: ${CODE.bg}; color: ${CODE.text}; border-radius: 12px; padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere; user-select: none; -webkit-user-select: none; }
        .ps-kod-izoh { color: ${CODE.comment}; }
        .ps-tur { font-weight: 700; color: ${CODE.str}; border-radius: 4px; transition: background .4s, color .4s; }
        .ps-kod.ajrat .ps-tur.ish { background: ${T.ok}; color: ${T.paper}; }
        .ps-kod.ajrat .ps-tur.fikr { color: ${CODE.comment}; }
        .lesson-root ol.ps-vazifa, .lesson-root ol.ps-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .ps-vazifa li, .ps-hw-qadam li { display: flex; gap: 9px; align-items: flex-start; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .ps-vazifa li i, .ps-hw-qadam li i { flex: 0 0 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; background: ${T.accentSoft}; color: ${T.accent}; }

        /* «Pitchim» artefakt-strip (U-042) · kartochka ipuchasi (SABOQ 16) · uyga vazifa kartasi */
        .ps-pitchim { align-self: flex-start; display: inline-flex; align-items: center; gap: 9px; padding: 6px 13px; border-radius: 999px; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; font-size: 12.5px; color: ${T.ink2}; }
        .ps-pitchim b { color: ${T.ink}; }
        .ps-pitchim-s { display: inline-flex; gap: 3px; }
        .ps-pitchim-s i { width: 16px; height: 10px; border-radius: 3px; background: ${T.line}; }
        .ps-pitchim-s i.ok { background: ${T.ok}; }
        .ps-pitchim-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
        .ps-flash { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .ps-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: ps-puls 1.6s ease-out .5s 3; }
        p.ps-fc-ipucha { font-size: 13.5px; font-weight: 700; color: ${T.accent}; text-align: center; }
        .ps-hw { display: flex; flex-direction: column; gap: 12px; }
        .ps-hw-karta { display: flex; flex-direction: column; gap: 4px; background: ${T.bg}; border-radius: 12px; padding: 10px 12px; }
        .ps-hw-q { display: grid; grid-template-columns: 96px minmax(0,1fr); gap: 10px; font-size: 13.5px; line-height: 1.4; }
        .ps-hw-k { color: ${T.ink2}; font-weight: 700; }
        .ps-hw-v { color: ${T.ink}; font-weight: 600; }
        p.ps-hw-izoh { font-size: 12.5px; color: ${T.ink2}; }
        .ps-hw-keyingi { font-size: 13.5px; color: ${T.ink}; }

        @media (max-width: 560px) {
          .ps-tasma, .ps-tasma.plus { grid-template-columns: 1fr; }
          .ps-plus { justify-self: center; }
          .ps-pufak { left: 50%; white-space: normal; text-align: center; }
          .ps-tomonlar { grid-template-columns: 1fr; }
          .ps-cv { height: 230px; }
          .ps-cv-ish { height: 180px; }
          .h-pitch .ps-cv-sl:nth-child(1), .h-pitch .ps-cv-sl:nth-child(3) { animation: none; }
          .ps-cv-sl { width: 70px; height: 50px; }
          .ps-cv-sl.yangi { width: 120px; height: 80px; }
          .ps-amal.uch .q-btn { min-width: 0; flex: 1 1 30%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ps-bos, .ps-bos-nav, .ps-bos-kirit, .q-kirish .q-variant, .q-bashorat .q-chip, .ps-tanlov .q-chip, .ps-plus, .ps-slayd-ok, .ps-manba, .ps-q-yorliq, .ps-q.yozildi, .ps-q.demo .ps-chiziq,
          .ps-pufak, .ps-katta, .ps-chip.kir, .ps-supur, .ps-voqea, .ps-cv-tugmalar i, .ps-cv-kursor, .ps-cv-talaba, .ps-cv-sl, .ps-cv-rad, .ps-cv-sl.yangi path, .ps-cv-nuq i,
          .ps-taymer-h, .ps-flash.yangi .fc-front { animation: none !important; }
          .ps-q.demo .ps-chiziq { background: ${fon(T.ink, 0.7)}; opacity: 1; }
          .ps-cv-sl.yangi path { stroke-dashoffset: 0; }
          .ps-cv-nuq i, .ps-cv-rad { opacity: 1; }
          .ps-slayd, .ps-bosh { transition: none; }
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
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); } /* skeletda yo'q edi — ⛶ ishlamasdi (11-Modul seansi, F-1007-290; MEXANIZM-TAKLIF 10) */
        .q-fokus:has(.zoom-on) { animation: none; transform: none; } /* qolip .q-fokus (fill both) transform qoldiradi — yakuniy holatda ⛶ oynasi siljiydi (F-1007-290; MEXANIZM-TAKLIF 12) */
        .ps-voqea:has(.zoom-on) { animation: none; transform: none; } /* voqea kirish animatsiyasi (fill both) transform qoldiradi — ⛶ oynasi siljiydi (F-1007-290) */
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
