import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// YANGI DARS SKELETI — «Namuna dars» (konveyer, 04.10.2026). App.jsx ga ULANMAGAN — faqat nusxa olish uchun.
// Yangi dars shu fayldan boshlanadi (pilotdan emas): `cp src/skelet/NamunaDars.jsx src/<N>-Modull/<Nom>Lesson.jsx` (importlar o'zgarmaydi),
// keyin konveyer/2-QURUVCHI.md bo'yicha MD v3 (GATE M o'tgan) matni bilan to'ldiriladi.
// TARKIB: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — TEGILMAYDI;
//   kontent — har qolip turidan bitta namuna: s0 QKirish · s1 QReja · s2 QTushuncha (bashorat → harakat → vizual → xulosa) ·
//   s3 test (QuestionScreen → QTest) · s4 final QTartib · a1 amaliyot bloki (QBlok + ScreenBlok ulagichi, 172/173) · podium · QKartochka · QYakun.
// ALMASHTIRILADI: LESSON_META · HW_TOKENS · SCREEN_META · INLINE_KEYS · RECAPS · ekranlar (s0…) · ACHIEVEMENTS/ACH_TRIGGERS ·
//   Q_LABELS (kalitlar = ballik ekran indekslari, q22) · QZ_BG_SHAPES ({uz,ru}, R-008) · QUIZ_BANK (12 savol, to'g'ri javob 3/3/3/3) ·
//   NAMUNA_FLASHCARDS (darsda 10–12) · SummaryScreen matnlari · screens massivi · export nomi · .nd- CSS bo'limi.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QXato, QIzoh, QXulosa, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m9d16-v1', lessonTitle: { uz: "G'oyangiz va ilovangiz guruhni ishontiradimi?", ru: 'Убедят ли группу ваша идея и приложение?' } };
// 16 ekran · PM 2-tur (artefakt — to'rt bo'lakli 3 daqiqalik pitch va juftlikdagi repetitsiyasi) · ballik testlar 3, 5, 7, 12 (✔ D · B · C · A) · keys K19 iPhone
const HW_TOKENS = [
  { t: { uz: 'pitch', ru: 'питч' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'zal', ru: 'зал' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'telefon', ru: 'телефон' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'daqiqa', ru: 'минута' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'koding',      template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const SCREEN_INTENTS = [
  "hook: zal 3 daqiqada nimani ko'rmoqchi (telefon, taymer, zal)", "reja: to'rt bo'lak qatorlari yoziladi, taymer 3:00 gacha yetadi", "to'rt bo'lak: Mentor pitchi yig'iladi, taymer bo'linadi, jonli demo eng uzun bo'lak", '1-savol: sanoq qaysi bo\'lakka',
  "muammo va dalil: sanoq va harakat belgisi jadvaldan bo'lakka", '2-savol: ish bilan dalil', "iPhone: ko'p tugma → bitta ekran → uch qurilma bittada (bashorat)", '3-savol: yechim bir gapda',
  "jonli demo: kutish yozuvi, asosiy harakat, sinovdagi tuzatish", "Neon SQL: ikki son va songa nima kirgani", "mustaqil: pitch to'rt bo'lakka yoziladi", "juftlik: 3 daqiqa taymer, baholash varag'i, bitta bo'lak tuzatiladi",
  'yakuniy savol: son va unga nima kirgani', 'podium', 'kartochkalar', 'yakun'
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Yangi dars — ✔ o'rni MD dagidek: s3 D · s5 B · s7 C · s12 A (final). `-1` — sentinel (variant yo'q: tushuncha, Neon, mustaqil ish, juftlik).
const INLINE_KEYS = { s3: 3, s5: 1, s7: 2, s12: 0, bolaklar: -1, dalil: -1, demo: -1, neon: -1, practice: -1, juftlik: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: { title: { uz: "Qaysi bo'lak", ru: 'Какая часть' }, cards: [
    { ic: '1', h: { uz: "Muammo bo'lagida muammo gapi va dalil turadi.", ru: 'В части «Проблема» стоят фраза о проблеме и довод.' } },
    { ic: '2', h: { uz: "Dalil — necha kishidan nechtasida muammo bo'lgani.", ru: 'Довод — у скольких из скольких была проблема.' } },
    { ic: '3', h: { uz: 'Jonli demo va keyingi qadam boshqa savolga javob beradi.', ru: 'Живое демо и следующий шаг отвечают на другие вопросы.' }, ask: { uz: "«Sinfdoshlarning 5 tadan 4 tasi …» — bu qaysi bo'lak?", ru: '«У 4 из 5 одноклассников …» — это какая часть?' } }
  ] },
  5: { title: { uz: 'Ish bilan dalil', ru: 'Довод делом' }, cards: [
    { ic: '1', h: { uz: "«Kerak», «yuklab olaman» — fikr yoki va'da.", ru: '«Нужно», «скачаю» — мнение или обещание.' } },
    { ic: '2', h: { uz: "Sinab ko'rishga kun belgilash — ish: bu harakat belgisi.", ru: 'Назначить день, чтобы попробовать, — дело: это знак действия.' } },
    { ic: '3', h: { uz: '10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas.', ru: '10 интервью — маленькое число; это довод для выбора, а не доказательство.' }, ask: { uz: "Sizning intervyuingizda kim ish bilan qiziqish ko'rsatdi?", ru: 'Кто в ваших интервью показал интерес делом?' } }
  ] },
  7: { title: { uz: 'Bir gapda yechim', ru: 'Решение одной фразой' }, cards: [
    { ic: '1', h: { uz: "Stiv Jobs iPhone'ni «uch qurilma bittada» deb taqdim etgan.", ru: 'Стив Джобс представил iPhone как «три устройства в одном».' } },
    { ic: '2', h: { uz: "Yechim bo'lagi ham bir gapda: mahsulot odamga nima qiladi.", ru: 'Часть «Решение» тоже одной фразой: что продукт делает для человека.' } },
    { ic: '3', h: { uz: "Ekranlar, texnologiya va «kim uchun» — yechim emas.", ru: 'Экраны, технология и «для кого» — не решение.' }, ask: { uz: 'Mahsulotingizni bir nafasda ayta olasizmi?', ru: 'Можете назвать свой продукт на одном дыхании?' } }
  ] },
  12: { title: { uz: 'Songa nima kirgan', ru: 'Что входит в число' }, cards: [
    { ic: '1', h: { uz: 'Shartsiz SQL hamma qatorni sanaydi.', ru: 'SQL без условия считает все строки.' } },
    { ic: '2', h: { uz: 'Unda namuna va tekshiruv yozuvlari ham bor.', ru: 'В нём есть и образцы, и проверочные записи.' } },
    { ic: '3', h: { uz: 'Pitchda son va unga nima kirgani birga aytiladi.', ru: 'В питче число и то, что в него входит, называют вместе.' }, ask: { uz: 'Sizning soningizda tekshiruvlaringiz bormi?', ru: 'Есть ли в вашем числе ваши проверки?' } }
  ] }
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
        {/* MD: javob topilgach (jonli darsda — natija ochilgandan keyin) savol ostida kichik karta */}
        {vizual && ((solved && revealed) || (isMentorLive && mReveal)) && <TestViz>{vizual}</TestViz>}
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

// ===== DARSNING O'Z QATLAMI — 11-Modul 16-dars «G'oyangiz va ilovangiz guruhni ishontiradimi?» (MD v3: feedback/F-1005-11modul/16-PmPrototypePitch-v3.md, GATE M) =====
// Bitta vizual (163/180): UchDaqiqaSahna — telefon (JamoaTelefon) · to'rt bo'lak (BolakKarta) · taymer chizig'i (Taymer) · zal (Zal) · baholash varag'i (Varaq).
// Bitta manba: JAMOA_PITCH · ZAL_SAVOL · NAMUNA_OYINLAR · BOLAK va o'quvchi pitchi (pm-m9d16-pitch). 10-Modul PitchSahna dan ko'chirilmagan (K-020).
// qolip-maket: pt-vq-bel pt-bl-ed pt-reja-tug
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const mss = (s) => { const v = Math.max(0, Math.round(s || 0)); return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`; };
const halqa = (on) => (on ? 'pt-halqa' : undefined);
// Harakatsizlikda bitta ipucha (javobni aytmaydi): kalit o'zgarsa sanoq qaytadan boshlanadi
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
// Son sanab o'sadi (SABOQ 19); kam harakat rejimida — birdan
const useSanoq = (son, ms = 60) => {
  const [k, setK] = useState(son);
  useEffect(() => {
    if (son == null || k == null || !Number.isFinite(son) || !Number.isFinite(k)) { setK(son); return undefined; }
    if (k === son) return undefined;
    if (kamHarakat() || Math.abs(son - k) > 60) { setK(son); return undefined; }
    const t = setTimeout(() => setK(v => v + (son > v ? 1 : -1)), ms);
    return () => clearTimeout(t);
  }, [k, son, ms]);
  return k;
};
// Ketma-ket holatlar (telefon o'zi o'ynaydi): run yoqilganda qadamlar [kechikish ms, holat] navbat bilan; kam harakatda — oxirgisi birdan
const useKetma = (qadamlar, run, oxirida) => {
  const [i, setI] = useState(-1);
  useEffect(() => {
    if (!run) { setI(-1); return undefined; }
    if (kamHarakat()) { setI(qadamlar.length - 1); if (oxirida) oxirida(); return undefined; }
    const tl = [];
    let jami = 0;
    qadamlar.forEach((q, n) => { jami += q[0]; tl.push(setTimeout(() => { setI(n); if (n === qadamlar.length - 1 && oxirida) oxirida(); }, jami)); });
    return () => tl.forEach(clearTimeout);
  }, [run]); // eslint-disable-line
  return i < 0 ? null : qadamlar[i][1];
};
// Uchish (SABOQ 19, FLIP): narsa joyidan yangi joyiga uchib boradi; yangi joydagi element (data-uch) chizilgach shu nuqtadan suriladi
const uchir = (dan, el, ms = 620) => {
  if (!dan || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !dan.width) return;
  const z = (el.offsetWidth || g.width) / g.width;
  const dx = ((dan.left + dan.width / 2) - (g.left + g.width / 2)) * z;
  const dy = ((dan.top + dan.height / 2) - (g.top + g.height / 2)) * z;
  const s = Math.min(2.4, Math.max(0.3, dan.width / g.width));
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.8 }, { transform: 'translate(0, 0) scale(1)', opacity: 1 }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' });
};
const useUchish = () => {
  const q = useRef([]);
  useLayoutEffect(() => {
    if (!q.current.length) return;
    const navbat = q.current; q.current = [];
    navbat.forEach(u => uchir(u.r, document.querySelector(`.lesson-root [data-uch="${u.k}"]`), u.ms));
  });
  return useCallback((manba, k, ms) => {
    const el = typeof manba === 'string' ? document.querySelector(manba) : manba;
    const r = el && (el.getBoundingClientRect ? el.getBoundingClientRect() : el);
    if (r) q.current.push({ r, k, ms });
  }, []);
};
// O'qituvchi eslatmasi — faqat mentor ko'rinishida (MD aytgan joylarda), bosilganda ochiladi
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="pt-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="pt-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="pt-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
};
// 151-qonun: nishon sharti qatori (birinchi urinish) — nishon olingach yoki mashq-o'tishida ko'rinmaydi
const NishonQatori = ({ screen }) => {
  const olingan = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const { isMentor } = useJonli();
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || isMentor || (olingan && olingan.has(ach))) return null;
  const ketdi = am.missed.has(sid);
  return <p className={cxx('pt-nishon', ketdi && 'ketdi')}>{ketdi ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</p>;
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
    <div className="pt-ovoz fade-step">
      {variantlar.map((v, i) => (
        <div key={i} className={cxx('pt-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="pt-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>
      ))}
    </div>
  );
};
// Mentor statistikasi (10, 11-ekran): o'quvchilar yuborgan ishtirok-signali (500+ zona) bo'yicha sonlar
const MentorSanoq = ({ zonalar, yorliqlar, hisob }) => {
  const { live, isMentor } = useJonli();
  const pin = live && live.pin;
  const [d, setD] = useState(null);
  useEffect(() => {
    if (!isMentor || !pin) return undefined;
    let on = true, t = null;
    const ayl = async () => {
      try { const r = await Promise.all(zonalar.map(z => liveAnswers(pin, z))); if (on) setD(r); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(ayl, 3000);
    };
    ayl();
    return () => { on = false; clearTimeout(t); };
  }, [isMentor, pin]); // eslint-disable-line
  if (!isMentor) return null;
  const sonlar = d ? hisob(d) : yorliqlar.map(() => '—');
  return <div className="pt-mstat fade-up">{yorliqlar.map((y, i) => <div key={i} className="pt-mstat-q"><b>{sonlar[i]}</b><span>{tr(y)}</span></div>)}</div>;
};

// ----- Ma'lumot: Mentor misoli «Maydon Jamoa» pitchi (A-6, tayanch 1, 1.3, 1.4, 1.8, 1.9, 9.98 aynan) -----
const JAMOA_RANG = '#2E9E4F'; // tayanch 9.62 — «Maydon Jamoa» nomi (PM ok yashilidan farqli)
const Jamoa = () => <span className="pt-jamoa">Maydon Jamoa</span>;
const BOLAK = [
  { k: 'muammo', nom: { uz: 'Muammo', ru: 'Проблема' } },
  { k: 'yechim', nom: { uz: 'Yechim', ru: 'Решение' } },
  { k: 'demo', nom: { uz: 'Jonli demo', ru: 'Живое демо' } },
  { k: 'keyingi', nom: { uz: 'Keyingi qadam', ru: 'Следующий шаг' } }
];
// Zal savollari — bitta manba (P-063): Sahna pufagi va baholash varag'i qatorlari ham shular
const ZAL_SAVOL = [
  { uz: 'Bu muammo borligini qayerdan bilasiz?', ru: 'Откуда вы знаете, что эта проблема есть?' },
  { uz: 'Mahsulot nima qiladi?', ru: 'Что делает продукт?' },
  { uz: "Ishlayotganini ko'rsata olasizmi?", ru: 'Можете показать, что это работает?' },
  { uz: 'Endi nima qilasiz?', ru: 'Что будете делать дальше?' }
];
const JAMOA_PITCH = {
  muammo: {
    gap: { uz: "O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.", ru: 'Игрокам перед игрой трудно собрать достаточно людей в команду и узнать, кто точно придёт.' },
    sanoq: { uz: "5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.", ru: 'У 4 из 5 игроков в последней игре не хватило людей или кто-то не пришёл.' },
    belgi: { uz: "5 o'yinchidan 4 tasi birinchi versiyani sinab ko'rishga kun belgiladi.", ru: '4 из 5 игроков назначили день, чтобы попробовать первую версию.' },
    halol: { uz: "10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas.", ru: '10 интервью — маленькое число; это довод для выбора, а не доказательство.' }
  },
  yechim: { uz: "Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.", ru: 'Организатор объявляет игру, игроки присоединяются в одно нажатие и в день игры подтверждают, что придут.' },
  demo: { harakat: 'Shanba 18:00', tuzatish: { uz: "Sinovda 3 kishidan 3 tasi bu o'yinni topishda to'xtadi — ro'yxatni kun bo'yicha qildik.", ru: 'На тесте 3 из 3 человек застряли на поиске этой игры — мы сделали список по дням.' } },
  keyingi: { uz: "Mahalla futbol guruhidan 10 kishini sinovga chaqiraman, keyin o'yindan oldin eslatma qo'shaman.", ru: 'Позову на тест 10 человек из футбольной группы махалли, потом добавлю напоминание перед игрой.' },
  vaqt: [40, 20, 90, 30]
};
const JAMI_VAQT = 180;
const VAQT_YORLIQ = [{ uz: '≈40 s', ru: '≈40 с' }, { uz: '≈20 s', ru: '≈20 с' }, { uz: '≈1,5 daqiqa', ru: '≈1,5 минуты' }, { uz: '≈30 s', ru: '≈30 с' }];
// Namuna o'yinlar (tayanch 9.2 — 7/9-dars namuna.js bilan bir; 13-dars tuzatishidan keyin kun sarlavhalari bilan)
const SHANBA = { uz: 'Shanba', ru: 'Суббота' };
const YAKSHANBA = { uz: 'Yakshanba', ru: 'Воскресенье' };
const MAHALLA = { uz: 'Mahalla maydoni', ru: 'Поле махалли' };
const NAMUNA_OYINLAR = [
  { id: '1', kun: SHANBA, soat: '18:00', maydon: MAHALLA, son: 8, kerak: 10 },
  { id: '2', kun: SHANBA, soat: '20:00', maydon: { uz: 'Maktab maydoni', ru: 'Школьное поле' }, son: 6, kerak: 10 },
  { id: '3', kun: YAKSHANBA, soat: '10:00', maydon: { uz: 'Park maydoni', ru: 'Поле в парке' }, son: 4, kerak: 8 },
  { id: '4', kun: YAKSHANBA, soat: '17:00', maydon: MAHALLA, son: 9, kerak: 10 }
];
const TEL = {
  oyinlar: { uz: "O'yinlar", ru: 'Игры' },
  qosh: { uz: "Qo'shilaman", ru: 'Присоединяюсь' },
  qoshildi: { uz: "Qo'shildingiz", ru: 'Вы присоединились' },
  kutish: { uz: "O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.", ru: 'Игры загружаются — это может занять до минуты.' }
};
const PITCH_KEY = 'pm-m9d16-pitch';
const TUZATILDI = { uz: 'tuzatildi', ru: 'исправлено' };

// ----- Telefon: «Maydon Jamoa» (ekran: royxat · oyin · kutish); o'lcham 172×272 barqaror (SABOQ 22) -----
// h: { ekran, son, qosh (tugma bosildi), ajrat (karta id), tap ('karta' | 'tugma'), shanba (kun sarlavhasi halqada), kutYur }
const JamoaTelefon = ({ h = {}, yorliq, className }) => {
  const ekran = h.ekran || 'royxat';
  const son = h.son ?? 8;
  const birinchi = useRef(son);
  const pop = son !== birinchi.current;
  const kunlar = [SHANBA, YAKSHANBA];
  return (
    <div className={cxx('pt-tel-ust', className)}>
      {yorliq && <span className="pt-tel-yor fade-step">{yorliq}</span>}
      <div className="pt-tel" aria-hidden="true">
        <span className="pt-tel-bar"><b className="pt-tel-nom">Maydon Jamoa</b></span>
        {ekran === 'kutish' && <span className="pt-ekran pt-kut" key="k">
          <span className="pt-kut-t">{tr(TEL.kutish)}</span>
          <span className="pt-kut-ch"><i className={cxx(h.kutYur && 'yur')} /></span>
        </span>}
        {ekran === 'royxat' && <span className="pt-ekran pt-royxat" key="r">
          <b className="pt-tel-sar">{tr(TEL.oyinlar)}</b>
          {kunlar.map((kun, ki) => (
            <React.Fragment key={ki}>
              <span className={cxx('pt-kun', ki === 0 && h.shanba && 'ajrat')}>{tr(kun)}</span>
              {NAMUNA_OYINLAR.filter(o => o.kun === kun).map((o, i) => (
                <span key={o.id} className={cxx('pt-oyin-k', h.ajrat === o.id && 'ajrat')} style={{ '--d': `${0.05 + (ki * 2 + i) * 0.07}s` }}>
                  <span className="pt-oyin-k1"><b>{o.soat}</b><b className="pt-oyin-son">{o.id === '1' ? son : o.son} / {o.kerak}</b></span>
                  <span className="pt-oyin-k2">{tr(o.maydon)}</span>
                  {h.tap === 'karta' && h.ajrat === o.id && <i className="pt-tap" />}
                </span>
              ))}
            </React.Fragment>
          ))}
        </span>}
        {ekran === 'oyin' && <span className="pt-ekran pt-oyin" key="o">
          <span className="pt-orqa">‹ {tr(TEL.oyinlar)}</span>
          <b className="pt-oyin-sar">{tr(SHANBA)}, 18:00</b>
          <span className="pt-oyin-joy">{tr(MAHALLA)}</span>
          <b key={son} className={cxx('pt-son', pop && 'yangi')}>{son} / 10</b>
          <span className="pt-doiralar">{Array.from({ length: 10 }, (_, i) => <i key={i} className={cxx(i < son && 'bor', i === 8 && son === 9 && 'yangi')} />)}</span>
          <span className={cxx('pt-tel-btn', h.qosh && 'off')}>{tr(h.qosh ? TEL.qoshildi : TEL.qosh)}{h.tap === 'tugma' && <i className="pt-tap" />}</span>
        </span>}
      </div>
    </div>
  );
};
// Telefon o'zi o'ynaydi: O'yinlar → «Shanba 18:00» bosiladi → O'yin → «Qo'shilaman» → «9 / 10»
const DEMO_KETMA = [
  [500, { ekran: 'royxat', ajrat: '1', tap: 'karta' }],
  [800, { ekran: 'oyin', son: 8 }],
  [700, { ekran: 'oyin', son: 8, tap: 'tugma' }],
  [450, { ekran: 'oyin', son: 9, qosh: true }]
];
const DEMO_OXIR = DEMO_KETMA[DEMO_KETMA.length - 1][1];

// ----- Zal: to'rt tomoshabin (bosh, soch, yuz, rangli kiyim — SABOQ 36) va bitta savol pufagi -----
const ZAL_RANG = [
  { teri: '#EDC39C', soch: '#2E2019', kiyim: '#E07A5F' },
  { teri: '#C98E62', soch: '#1F1A19', kiyim: '#3E7CB1' },
  { teri: '#E3A87C', soch: '#5B3A24', kiyim: '#E9A23B' },
  { teri: '#EDC39C', soch: '#1F1A19', kiyim: '#7B61C9' }
];
const Tomoshabin = ({ r, uzun }) => (
  <svg className="pt-tom" viewBox="0 0 40 46" aria-hidden="true">
    <rect x="6" y="30" width="28" height="18" rx="9" fill={r.kiyim} />
    <rect x="17" y="25" width="6" height="7" rx="2" fill={r.teri} />
    <g className="pt-tom-b">
      <circle cx="20" cy="17" r="10" fill={r.teri} />
      {uzun && <path d="M 10 17 C 9 28, 12 30, 15 29 L 13 18 Z" fill={r.soch} />}
      <path d="M 9.5 16 C 8.5 2, 31.5 2, 30.5 16 C 26 11, 15 10, 9.5 16 Z" fill={r.soch} />
      <g className="pt-tom-k"><circle cx="16.5" cy="18" r="1.3" fill="#2A2730" /><circle cx="23.5" cy="18" r="1.3" fill="#2A2730" /></g>
      <path d="M 17 22.5 Q 20 24.8 23 22.5" stroke="#8A4B3A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);
// pufak: matn | 'ok' | '?' | null · bur — zal telefonga qaraydi
const Zal = ({ pufak, bur }) => (
  <div className={cxx('pt-zal', bur && 'bur')}>
    <span className="pt-zal-b">{ZAL_RANG.map((r, i) => <Tomoshabin key={i} r={r} uzun={i === 2} />)}</span>
    {pufak === 'ok' ? <span key="ok" className="pt-pf ok">✓</span>
      : pufak === '?' ? <span key="q" className="pt-pf savol">?</span>
        : pufak ? <span key={ou(pufak)} className="pt-pf">{tr(pufak)}</span> : null}
  </div>
);

// ----- Bo'lak kartasi: holat bosh (uzuq chegara) · joriy (accent) · yoz (sirg'alib kiradi, ~1 s yashil) · ok (✓) · err · tuz (✓ + «tuzatildi») -----
// qatorlar: [{ k, t, kichik, yorliq, uch }] · nom: false — hali nomsiz (2-ekran 3-qadam) · ichi — qatorlar o'rniga tayyor element
const BolakKarta = ({ i, holat = 'bosh', nom = true, qatorlar = [], ichi, onEd, katta, ixcham, bosh = 0, uch }) => {
  const b = BOLAK[i];
  const ok = holat === 'ok' || holat === 'tuz';
  return (
    <div className={cxx('pt-bl', `h-${holat}`, katta && 'katta', ixcham && 'ixcham')} data-uch={uch} style={{ '--i': i }}>
      <span className="pt-bl-h">
        <i className={cxx('pt-bl-n', ok && 'ok')}>{i + 1}</i>
        {nom && <b key="n" className="pt-bl-nom">{tr(b.nom)}</b>}
        {ok && <em key="ok" className="pt-bl-ok">✓</em>}
        {onEd && <button type="button" className="pt-bl-ed" onClick={onEd} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
      </span>
      {holat === 'tuz' && <span className="pt-bl-tuz">{tr(TUZATILDI)}</span>}
      {ichi}
      {qatorlar.map(q => (
        <span key={q.k} className={cxx('pt-bl-q', q.kichik && 'kichik', q.yangi && 'yangi')} data-uch={q.uch}>
          {q.t}{q.yorliq && <em className="pt-bl-y fade-step">{q.yorliq}</em>}
        </span>
      ))}
      {Array.from({ length: bosh }, (_, k) => <span key={'b' + k} className="pt-bl-bo" />)}
    </div>
  );
};

// ----- Taymer chizig'i 0–3:00, to'rt bo'lakka bo'lingan (40 · 20 · 90 · 30 s); fill — har bo'lak 0..1 · joriy — accent · ortiq — 3:00 dan keyingi soniyalar -----
const Taymer = ({ fill = [0, 0, 0, 0], joriy = -1, ortiq = 0, nomlar = [], kulrang, flash }) => {
  const ort = ortiq > 0 ? Math.min(22, (ortiq / 60) * 14) : 0;
  return (
    <div className={cxx('pt-tm', kulrang && 'kulrang', flash && 'flash', ortiq > 0 && 'oshdi')}>
      <div className="pt-tm-ch">
        <span className="pt-tm-asosiy" style={{ flexBasis: `${100 - ort}%` }}>
          {JAMOA_PITCH.vaqt.map((v, i) => (
            <span key={i} className={cxx('pt-tm-k', joriy === i && 'on', fill[i] >= 1 && 'toliq')} style={{ flexBasis: `${(v / JAMI_VAQT) * 100}%` }}>
              <i style={{ width: `${Math.min(1, Math.max(0, fill[i])) * 100}%` }} />
            </span>
          ))}
        </span>
        {ortiq > 0 && <span className="pt-tm-ort" style={{ flexBasis: `${ort}%` }} />}
      </div>
      <div className="pt-tm-l">
        <span className="pt-tm-asosiy" style={{ flexBasis: `${100 - ort}%` }}>
          {JAMOA_PITCH.vaqt.map((v, i) => (
            <span key={i} className={cxx(joriy === i && 'on')} style={{ flexBasis: `${(v / JAMI_VAQT) * 100}%` }}>
              {nomlar[i] && <b key={'n' + i} className="fade-step">{nomlar[i]}</b>}
              {nomlar[i] && <em>{tr(VAQT_YORLIQ[i])}</em>}
            </span>
          ))}
        </span>
        {ortiq > 0 && <b className="pt-tm-plus" style={{ flexBasis: `${ort}%` }}>+{mss(ortiq)}</b>}
      </div>
      <div className="pt-tm-u"><span>0</span><span>3:00</span></div>
    </div>
  );
};
// Uch daqiqa sahnasi: chapda telefon (bo'lsa), o'ngda zal · to'rt bo'lak · taymer
const UchDaqiqaSahna = ({ tel, zal, bolaklar, taymer, ostida, className }) => (
  <div className={cxx('pt-sahna', !tel && 'teltsiz', className)}>
    {tel && <div className="pt-sahna-tel">{tel}</div>}
    <div className="pt-sahna-ong">
      {zal}
      {bolaklar && <div className="pt-bolaklar">{bolaklar}</div>}
      {taymer && <Taymer {...taymer} />}
      {ostida}
    </div>
  </div>
);
// Ketma-ket qadamlar qatori (SABOQ 34): bajarilgani ✓ ixcham, joriysi — katta halqali tugma, keyingilari kulrang
const QadamQatori = ({ qadamlar, joriy, onBos, yopiq }) => (
  <div className="pt-qq fade-step">
    {qadamlar.map((q, i) => i < joriy
      ? <span key={i} className="pt-qq-ok"><i>✓</i>{q}</span>
      : i === joriy
        ? <QTugma key={i} className={halqa(!yopiq)} disabled={yopiq} onClick={onBos}><b className="pt-qq-n">{i + 1}</b> {q}</QTugma>
        : <span key={i} className="pt-qq-kut"><i>{i + 1}</i>{q}</span>)}
  </div>
);
// Bashorat: tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi (SABOQ 11)
const TAXMIN_L = { uz: 'Taxminingiz', ru: 'Ваше предположение' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla, yopiq }) => (tanlov == null
  ? <div className="pt-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar} tanlov={tanlov} onTanla={onTanla} /></div>
  : (yopiq ? null : <div className="pt-bashq fade-step"><span>{savol}</span><span className="pt-bashq-t">{tr(TAXMIN_L)}: <b>{(variantlar.find(v => v.k === tanlov) || {}).t}</b></span></div>));
// Natija bloki (SABOQ 25): birinchi qatori — taxmin natijasi, keyin xulosa
const NatijaTx = ({ togri, children }) => <span className={cxx('pt-tx', togri && 'ok')}>{children}</span>;
// Testdan keyingi karta (MD: javob topilgach savol ostida) — paydo bo'lgach ko'rinadigan joyga silliq suriladi
const TestViz = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => { if (ref.current && ref.current.scrollIntoView) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 650); return () => clearTimeout(t); }, []);
  return <div ref={ref} className="pt-test-viz fade-step">{children}</div>;
};
// O'quvchi pitchi (pm-m9d16-pitch) → bo'lak matnlari; yo'q bo'lsa — Mentor misoli
const pitchLs = () => { const p = lsGet(PITCH_KEY); return p && typeof p === 'object' ? p : null; };
const pitchToliq = (p) => !!(p && p.muammo && p.muammo.gap && p.yechim && p.demo && p.demo.harakat && p.keyingi);
const pitchMatn = (p) => p ? [
  [p.muammo && p.muammo.gap, p.muammo && p.muammo.dalil].filter(Boolean),
  [p.yechim].filter(Boolean),
  [p.demo && p.demo.harakat, p.demo && p.demo.tuzatish, p.demo && p.demo.son].filter(Boolean),
  [p.keyingi].filter(Boolean)
] : [
  [tr(JAMOA_PITCH.muammo.gap), tr(JAMOA_PITCH.muammo.sanoq), tr(JAMOA_PITCH.muammo.belgi)],
  [tr(JAMOA_PITCH.yechim)],
  [`${tr(SHANBA)} 18:00 · ${tr(MAHALLA)} · «${tr(TEL.qosh)}»`, tr(JAMOA_PITCH.demo.tuzatish)],
  [tr(JAMOA_PITCH.keyingi)]
];
// Artefakt-strip (U-042): «Pitchim · n/4» — 10, 11 va yakun ekranlarida
const PitchimStrip = ({ p }) => {
  const m = pitchMatn(p || pitchLs() || {});
  const n = m.filter(x => x.length > 0).length;
  if (!p && !pitchLs()) return null;
  return (
    <div className="pt-strip fade-step">
      <span className="pt-strip-l">{tr({ uz: 'Pitchim', ru: 'Мой питч' })} · <b>{n}/4</b></span>
      {BOLAK.map((b, i) => <span key={b.k} className={cxx('pt-strip-q', m[i].length > 0 && 'ok')} data-uch={'strip' + i}>{m[i].length > 0 && <i>✓</i>}{tr(b.nom)}</span>)}
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish: chapda Sahna — telefon, bo'sh taymer, zal «?»; o'ngda radio-variantlar; J-026 — ballsiz, hammaga correct: false) =====
const HOOK_OPTS = [
  { id: 'a', t: { uz: 'Ilova telefonda qanday ishlab turganini', ru: 'Как приложение работает на телефоне' }, j: { uz: <><b>Aynan!</b> Zal ilova ishlab turganini o'zi ko'rmoqchi. Lekin avval u nega kerakligini ham eshitadi.</>, ru: <><b>Именно!</b> Зал хочет сам увидеть, как работает приложение. Но сначала он услышит и то, зачем оно нужно.</> } },
  { id: 'b', t: { uz: 'Ilovaning hamma ekranlarini birma-bir', ru: 'Все экраны приложения по очереди' }, j: { uz: <><b>Qiziq fikr!</b> Hamma ekran 3 daqiqaga sig'maydi — zal ilova ishlab turganini ko'rmoqchi.</>, ru: <><b>Интересная мысль!</b> Все экраны не поместятся в 3 минуты — зал хочет увидеть, что приложение работает.</> } },
  { id: 'c', t: { uz: 'Ilova qaysi texnologiyada qurilganini', ru: 'На какой технологии построено приложение' }, j: { uz: <><b>Qiziq fikr!</b> Texnologiya sizga muhim, zal esa ilova odamga nima qilishini ko'rmoqchi.</>, ru: <><b>Интересная мысль!</b> Технология важна вам, а зал хочет увидеть, что приложение делает для человека.</> } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [flash, setFlash] = useState(false);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id); setFlash(true);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  useEffect(() => { if (!flash) return undefined; const t = setTimeout(() => setFlash(false), 1400); return () => clearTimeout(t); }, [flash]);
  const op = HOOK_OPTS.find(o => o.id === picked);
  return (
    <Stage eyebrow={tr({ uz: <>Kirish · «Maydon Jamoa» pitchi</>, ru: <>Введение · питч «Maydon Jamoa»</> })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('pt-s0', picked === null && !isMentor && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>G'oyangiz va ilovangiz <A>guruhni ishontiradimi?</A></>, ru: <>Убедят ли <A>группу</A> ваша идея и приложение?</> })}
          mentor={<Mentor>{picked === null || isMentor
            ? tr({ uz: "Guruh — bugun sizning zalingiz, pitchga esa 3 daqiqa beriladi: sizningcha, zal eng ko'p nimani ko'rmoqchi?", ru: 'Группа — сегодня ваш зал, а на питч дают 3 минуты: как вы думаете, что зал хочет увидеть больше всего?' })
            : tr({ uz: "Javobingiz yozildi: «Davom etish»ni bosing.", ru: 'Ответ записан: нажмите «Продолжить».' })}</Mentor>}
          maket={<UchDaqiqaSahna className="pt-s0-sahna"
            tel={<JamoaTelefon h={{ ekran: 'royxat' }} />}
            zal={<Zal pufak="?" bur={picked !== null} />}
            taymer={{ fill: [0, 0, 0, 0], flash }} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
          javob={<>
            {op && <p className="hook-ack fade-step">{tr(op.j)}</p>}
            {isLive && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        />
      </div>
      <MentorNote>{tr({ uz: "O'tgan modulda pitch 5 daqiqa edi va yillik loyiha haqida edi. Bugun — yangi mahsulot va 3 daqiqa. Sinfdan so'rang: 3 daqiqada nimani aytmay qoldirardingiz?", ru: 'В прошлом модуле питч длился 5 минут и был о годовом проекте. Сегодня — новый продукт и 3 минуты. Спросите класс: что бы вы не стали говорить за 3 минуты?' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda «Dars oxirida» — telefon va to'rtta nomsiz bo'lak, qatorlar birma-bir yoziladi, taymer 3:00 gacha to'ladi, zal ustida ✓; o'ngda «01 · matn · teg») =====
const REJA = [
  { t: { uz: 'Muammoni dalil bilan aytishni bilib olasiz', ru: 'Научитесь говорить о проблеме с доводом' }, teg: { uz: 'muammo', ru: 'проблема' } },
  { t: { uz: "Mahsulotni bir gapda aytishni o'rganasiz", ru: 'Научитесь говорить о продукте одной фразой' }, teg: { uz: 'yechim', ru: 'решение' } },
  { t: { uz: "Ilovani telefonda ko'rsatishga tayyorlanasiz", ru: 'Подготовитесь показать приложение на телефоне' }, teg: { uz: 'jonli demo', ru: 'живое демо' } },
  { t: { uz: 'Pitchni sherigingizga aytib, baholatasiz', ru: 'Расскажете питч партнёру и получите оценку' }, teg: { uz: "baholash varag'i", ru: 'лист оценки' } }
];
const RejaSahna = () => {
  const [n, setN] = useState(kamHarakat() ? 6 : 0);
  useEffect(() => { if (n >= 6) return undefined; const t = setTimeout(() => setN(v => v + 1), n === 0 ? 500 : 600); return () => clearTimeout(t); }, [n]);
  const matn = pitchMatn(null);
  return (
    <UchDaqiqaSahna className="pt-reja-sahna"
      tel={<JamoaTelefon h={{ ekran: 'royxat' }} />}
      zal={<Zal pufak={n >= 6 ? 'ok' : null} />}
      bolaklar={BOLAK.map((b, i) => <BolakKarta key={b.k} i={i} nom={false} holat={n > i ? 'yoz' : 'bosh'} ixcham
        qatorlar={n > i ? [{ k: 'q', t: matn[i][0] }] : []} bosh={n > i ? 0 : 1} />)}
      taymer={{ fill: n >= 5 ? [1, 1, 1, 1] : [0, 0, 0, 0] }} />
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun <A>3 daqiqalik pitch</A> yozib, sherigingizga aytasiz.</>, ru: <>Сегодня напишете <A>питч на 3 минуты</A> и расскажете его партнёру.</> })}
      mentor={<Mentor>{tr({ uz: "PRD, sinov yozuvlari va tuzatilgan rejangiz bugun kerak bo'ladi — ilovangiz telefonda ochilib tursin.", ru: 'Сегодня понадобятся PRD, записи теста и исправленный план — пусть приложение будет открыто на телефоне.' })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
      chap={<RejaSahna />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — TO'RT BO'LAK (QTushuncha markaziy: bashorat → 4 qadam → bo'lak yoziladi, taymerga bo'lagi qo'shiladi, zal pufagi savol beradi va ✓; 3-qadamda telefon o'zi o'ynaydi, nom «Jonli demo» misoldan keyin) =====
const S2_SAVOL = { uz: "Uch daqiqaning qanchasi ilovani ko'rsatishga ketadi?", ru: 'Сколько из трёх минут уйдёт на показ приложения?' };
const S2_TAXMIN = [{ k: '30', t: { uz: '30 soniya', ru: '30 секунд' } }, { k: '60', t: { uz: '1 daqiqa', ru: '1 минута' } }, { k: '90', t: { uz: '1,5 daqiqa', ru: '1,5 минуты' } }];
const S2_QADAM = [{ uz: "Muammoni qo'shing", ru: 'Добавьте проблему' }, { uz: "Yechimni qo'shing", ru: 'Добавьте решение' }, { uz: "Ilovani ko'rsating", ru: 'Покажите приложение' }, { uz: "Keyingi qadamni qo'shing", ru: 'Добавьте следующий шаг' }];
const DemoQator = ({ son }) => (
  <span className="pt-demo-q"><span>{tr(SHANBA)} 18:00</span><i>›</i><span>«{tr(TEL.qosh)}»</span><i>›</i><b>{son} / 10</b></span>
);
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 4 : 0); // qo'shilgan bo'laklar soni
  const [pf, setPf] = useState(avval ? 'ok' : '?'); // zal pufagi: savol → ✓
  const [nom3, setNom3] = useState(avval);
  const [demoYur, setDemoYur] = useState(false);
  const telH = useKetma(DEMO_KETMA, demoYur, () => setTimeout(() => { setPf('ok'); setNom3(true); }, kamHarakat() ? 0 : 900));
  const done = q >= 4 && pf === 'ok';
  const tugadi = useTugadi(done, 1500, avval);
  const ipucha = useIpucha(!!taxmin && !done, q);
  const { live } = useJonli();
  useEffect(() => { if (done && storedAnswer === undefined) { onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, solved: true, taxmin }); if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'bolaklar', 0, true, 0); } }, [done]); // eslint-disable-line
  // pufak savoldan keyin ✓ ga aylanadi (3-qadamda — telefon ishini tugatgach)
  useEffect(() => { if (q === 0 || q === 3 || pf === 'ok' || avval) return undefined; const t = setTimeout(() => setPf('ok'), kamHarakat() ? 0 : 1300); return () => clearTimeout(t); }, [q, pf]); // eslint-disable-line
  const bos = () => {
    if (q >= 4 || (q > 0 && pf !== 'ok')) return;
    setPf(ZAL_SAVOL[q]);
    if (q === 2) setDemoYur(true);
    setQ(q + 1);
  };
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  const band = q > 0 && pf !== 'ok'; // joriy bo'lak hali javob bermoqda
  const holat = (i) => (i < q ? ((i < q - 1 || pf === 'ok') ? 'ok' : (i === 2 && !nom3 ? 'joriy' : 'yoz')) : 'bosh');
  const qatorlar = (i) => {
    if (i >= q) return [];
    if (i === 0) return [{ k: 'g', t: tr(JAMOA_PITCH.muammo.gap) }, { k: 's', t: tr(JAMOA_PITCH.muammo.sanoq), kichik: true }];
    if (i === 1) return [{ k: 'g', t: tr(JAMOA_PITCH.yechim) }];
    if (i === 2) return [{ k: 'd', t: <DemoQator son={(telH && telH.son) || (avval || nom3 ? 9 : 8)} /> }];
    return [{ k: 'g', t: tr(JAMOA_PITCH.keyingi) }];
  };
  const mentorT = done
    ? { uz: "To'rt bo'lak taymerga joylandi: «Davom etish»ni bosing.", ru: 'Четыре части легли на таймер: нажмите «Продолжить».' }
    : { uz: "O'tgan modulda pitch besh daqiqalik edi: bo'laklarni birma-bir qo'shib, taymerga qarang.", ru: 'В прошлом модуле питч был пятиминутным: добавляйте части по одной и смотрите на таймер.' };
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · to'rt bo'lak", ru: 'Понятие · четыре части' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Bo'laklarni qo'shing", ru: 'Добавьте части' })} (${q}/4)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Zal 3 daqiqada <A>nimani eshitadi va ko'radi?</A></>, ru: <>Что зал <A>услышит и увидит</A> за 3 минуты?</> })}
        mentor={<Mentor>{tr(mentorT)}</Mentor>}
        bashorat={<Bashorat savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} yopiq={done} />}
        harakat={taxmin && !done && <QadamQatori qadamlar={S2_QADAM.map(tr)} joriy={q} onBos={bos} yopiq={band} />}
        vizual={<UchDaqiqaSahna
          tel={<JamoaTelefon h={telH || (avval || nom3 ? DEMO_OXIR : { ekran: 'royxat' })} />}
          zal={<Zal pufak={pf} bur={q === 3 && !nom3} />}
          bolaklar={BOLAK.map((b, i) => <BolakKarta key={b.k} i={i} nom={i < q && (i !== 2 || nom3)} holat={holat(i)} qatorlar={qatorlar(i)} />)}
          taymer={{ fill: [0, 1, 2, 3].map(i => (i < q ? (i === 2 && !nom3 ? (telH ? (telH.qosh ? 1 : 0.55) : 0.2) : 1) : 0)), joriy: band ? q - 1 : -1, nomlar: BOLAK.map((b, i) => (i < q && (i !== 2 || nom3) ? tr(b.nom) : null)) }}
          ostida={nom3 && !tugadi && <QIzoh>{tr({ uz: "Jonli demo bo'lagida ilova zal oldida telefonda ishlatib ko'rsatiladi.", ru: 'В части «Живое демо» приложение показывают перед залом прямо на телефоне.' })}</QIzoh>} />}
        natija={!done && ipucha && <QIzoh>{tr({ uz: "Yoqilgan qadamni bosing — zal qaysi bo'lakda nimani so'rashini ko'ring.", ru: 'Нажмите активный шаг — посмотрите, что зал спросит в каждой части.' })}</QIzoh>}
        xulosa={done && <>{tx && <NatijaTx togri={taxmin === '90'}>{taxmin === '90'
          ? tr({ uz: 'Taxminingiz mashqdagi taqsimotga mos', ru: 'Ваше предположение совпало с раскладкой упражнения' })
          : <>{tr(TAXMIN_L)}: {tr(tx.t)} · {tr({ uz: 'bu mashqda', ru: 'в этом упражнении' })}: <b>{tr({ uz: 'taxminan 1,5 daqiqa', ru: 'примерно 1,5 минуты' })}</b></>}</NatijaTx>}
          {tr({ uz: "Uch daqiqalik pitch to'rt bo'lakdan iborat: muammo, yechim, jonli demo va keyingi qadam.", ru: 'Трёхминутный питч состоит из четырёх частей: проблема, решение, живое демо и следующий шаг.' })}</>}
      />
      <MentorNote>{tr({ uz: "Taymer bo'laklari — mashq uchun boshlang'ich taqsimot: o'z pitchida bo'lak qisqaroq yoki uzunroq bo'lishi mumkin, jami 3 daqiqa qoladi. O'tgan moduldagi besh slaydning Foydalanuvchi va Raqamlar slaydlari bugun jonli demo bo'lagiga sig'adi: zal ilovani o'zi ko'radi. Muammo va yechim nega birinchi — sinfdan so'rang.", ru: 'Части таймера — стартовая раскладка для упражнения: в своём питче часть может быть короче или длиннее, всего остаётся 3 минуты. Слайды «Пользователь» и «Цифры» из пяти слайдов прошлого модуля сегодня помещаются в живое демо: зал сам видит приложение. Спросите класс, почему проблема и решение идут первыми.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ D, INLINE_KEYS.s3 = 3; ikkinchi olam — uy vazifalari ilovasi, P-002; savol ustida yorliq yo'q — SABOQ 6) =====
const MiniBolaklar = ({ ajrat, children }) => (
  <div className="pt-mini">{BOLAK.map((b, i) => <span key={b.k} className={cxx('pt-mini-b', ajrat === i && 'on')}><b>{tr(b.nom)}</b>{ajrat === i && children}</span>)}</div>
);
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · to'rt bo'lak", ru: 'Проверка · четыре части' })}
    questionText="Uy vazifalari ilovasi: «5 sinfdoshdan 4 tasi vazifani chatda yo'qotgan». Qaysi bo'lakka?"
    question={tr({ uz: <h2 className="title h-ask">Uy vazifalari ilovasi: «5 sinfdoshdan 4 tasi vazifani chatda yo'qotgan». <A>Qaysi bo'lakka?</A></h2>, ru: <h2 className="title h-ask">Приложение для домашних заданий: «у 4 из 5 одноклассников задание потерялось в чате». <A>В какую часть?</A></h2> })}
    options={[
      { uz: "Jonli demoga — sonni telefonda ko'rsatadi", ru: 'В живое демо — число показывают на телефоне' },
      { uz: 'Keyingi qadamga — bu sonni kamaytirish kerak', ru: 'В следующий шаг — это число надо уменьшить' },
      { uz: 'Yechimga — ilova aynan shuni hal qiladi', ru: 'В решение — приложение решает именно это' },
      { uz: "Muammoga — u muammo borligini ko'rsatadi", ru: 'В проблему — оно показывает, что проблема есть' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Bu sanoq muammo nechta odamda bo'lganini ko'rsatadi — u muammo bo'lagidagi dalil.", ru: 'Этот подсчёт показывает, у скольких людей была проблема, — это довод в части «Проблема».' }}
    explainWrong={{
      0: { uz: 'Jonli demoda ilova ishlaydi, bu sanoq esa intervyudan.', ru: 'В живом демо работает приложение, а этот подсчёт — из интервью.' },
      1: { uz: "Keyingi qadam reja haqida, bu sanoq esa bo'lib o'tgan.", ru: 'Следующий шаг — о плане, а этот подсчёт — о том, что уже было.' },
      2: { uz: "Yechim ilova nima qilishini aytadi, muammo sanog'ini emas.", ru: 'Решение говорит, что делает приложение, а не подсчёт проблемы.' },
      default: { uz: 'Bu sanoq nimani ko\'rsatadi: muammonimi yoki ilovanimi?', ru: 'Что показывает этот подсчёт: проблему или приложение?' }
    }}
    vizual={<MiniBolaklar ajrat={0}><em className="pt-mini-son">4 / 5</em></MiniBolaklar>} />
);

// ===== SCREEN 4 — MUAMMO VA DALIL (QTushuncha ketma-ket, 3 qadam; SABOQ 24, 35): chapda Muammo bo'lagi va zal · o'ngda sanoq jadvali — qator jadvaldan bo'lakka uchadi =====
const S4_SAVOL = { uz: 'Bu misolda muammo gapi yonida nechta dalil turadi?', ru: 'Сколько доводов в этом примере стоит рядом с фразой о проблеме?' };
const S4_TAXMIN = [{ k: '1', t: '1' }, { k: '2', t: '2' }, { k: '3', t: '3' }];
const S4_QADAM = [{ uz: "Muammo gapini qo'ying", ru: 'Поставьте фразу о проблеме' }, { uz: "Sanoqni qo'shing", ru: 'Добавьте подсчёт' }, { uz: "Harakat belgisini qo'shing", ru: 'Добавьте знак действия' }];
// Sanoq jadvali (tayanch 1.3 aynan; «eng qiyini» — 3 / 5 · 3 / 5)
const SANOQ_JADVAL = [
  { k: 'oxirgi', l: { uz: "oxirgi marta muammo bo'lgan", ru: 'в последний раз была проблема' }, a: '4 / 5', b: '3 / 5' },
  { k: 'hozir', l: { uz: 'hozir nima bilan', ru: 'чем решают сейчас' }, a: '5 / 5', b: '3 / 5' },
  { k: 'qiyin', l: { uz: 'eng qiyini', ru: 'самое трудное' }, a: '3 / 5', b: '3 / 5' },
  { k: 'belgi', l: { uz: 'harakat belgisi', ru: 'знак действия' }, a: '4 / 5', b: '1 / 5' }
];
const S4_PUFAK = [ZAL_SAVOL[0], { uz: 'Ular bu ilovaga qiziqadimi?', ru: 'Им интересно это приложение?' }, 'ok'];
const SanoqJadval = ({ yonik }) => (
  <div className="pt-jad">
    <span className="pt-jad-h" />
    <span className="pt-jad-h">{tr({ uz: "Jamoa yig'ish (5)", ru: 'Сбор команды (5)' })}</span>
    <span className="pt-jad-h kul">{tr({ uz: "Mahalla to'garaklari (5)", ru: 'Кружки махалли (5)' })}</span>
    {SANOQ_JADVAL.map((r, i) => (
      <React.Fragment key={r.k}>
        <span className="pt-jad-l" style={{ '--i': i }}>{tr(r.l)}</span>
        <span className={cxx('pt-jad-a', yonik.includes(r.k) && 'yon')} data-jad={r.k} style={{ '--i': i }}>{r.a}</span>
        <span className="pt-jad-b" style={{ '--i': i }}>{r.b}</span>
      </React.Fragment>
    ))}
  </div>
);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const uch = useUchish();
  const done = q >= 3;
  const tugadi = useTugadi(done, 2200, avval);
  const ipucha = useIpucha(!!taxmin && !done, q);
  const { live } = useJonli();
  useEffect(() => { if (done && storedAnswer === undefined) { onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, solved: true, taxmin }); if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'dalil', 0, true, 0); } }, [done]); // eslint-disable-line
  const bos = () => {
    if (q >= 3) return;
    if (q === 1) uch('.lesson-root [data-jad="oxirgi"]', 's4q2', 700);
    if (q === 2) uch('.lesson-root [data-jad="belgi"]', 's4q3', 700);
    setQ(q + 1);
  };
  const tx = S4_TAXMIN.find(t => t.k === taxmin);
  const qatorlar = [];
  if (q >= 1) qatorlar.push({ k: 'g', t: tr(JAMOA_PITCH.muammo.gap), yangi: q === 1 && !avval });
  if (q >= 2) qatorlar.push({ k: 's', t: tr(JAMOA_PITCH.muammo.sanoq), uch: 's4q2', yangi: q === 2 && !avval, yorliq: q >= 3 && tr({ uz: 'sanoq', ru: 'подсчёт' }) });
  if (q >= 3) qatorlar.push({ k: 'b', t: tr(JAMOA_PITCH.muammo.belgi), uch: 's4q3', yangi: q === 3 && !avval, yorliq: tr({ uz: 'harakat belgisi', ru: 'знак действия' }) });
  const bolak = (
    <div className="pt-s4-bl">
      <Zal pufak={q === 0 ? '?' : S4_PUFAK[q - 1]} />
      <BolakKarta i={0} katta holat={done ? 'ok' : q > 0 ? 'joriy' : 'bosh'} qatorlar={qatorlar} bosh={3 - q} />
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · dalil', ru: 'Понятие · довод' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Dalillarni qo'shing", ru: 'Добавьте доводы' })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Muammo borligini zalga <A>qanday ko'rsatasiz?</A></>, ru: <>Как показать залу, <A>что проблема есть?</A></> })}
        mentor={<Mentor>{tr(done
          ? { uz: "Dalillar bo'lakda turibdi: «Davom etish»ni bosing.", ru: 'Доводы уже в части: нажмите «Продолжить».' }
          : { uz: "Muammo gapi intervyulardan keyin yozilgan edi: yoniga jadvaldan dalil qo'shib, zal savoliga qarang.", ru: 'Фраза о проблеме была написана после интервью: добавьте рядом довод из таблицы и посмотрите на вопрос зала.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} yopiq={done} />}
        harakat={<div className="pt-s4-ch">{taxmin && !done && <QadamQatori qadamlar={S4_QADAM.map(tr)} joriy={q} onBos={bos} />}{bolak}</div>}
        vizual={tugadi ? bolak : <div className="pt-s4-jw"><SanoqJadval yonik={[q >= 2 && 'oxirgi', q >= 3 && 'belgi'].filter(Boolean)} /></div>}
        natija={<>
          {q >= 3 && !tugadi && <QIzoh>{tr(JAMOA_PITCH.muammo.halol)}</QIzoh>}
          {!done && ipucha && <QIzoh>{tr({ uz: "Yoqilgan qadamni bosing — zal savoli qanday o'zgarishini ko'ring.", ru: 'Нажмите активный шаг — посмотрите, как меняется вопрос зала.' })}</QIzoh>}
        </>}
        xulosa={tugadi && <>{tx && <NatijaTx togri={taxmin === '2'}>{taxmin === '2'
          ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
          : <>{tr(TAXMIN_L)}: {tx.t} · {tr({ uz: 'bu misolda', ru: 'в этом примере' })}: <b>2</b></>}</NatijaTx>}
          {tr({ uz: "Bu misolda muammoni ikki dalil ko'rsatdi: necha kishida bo'lgani va kim sinovga kun belgilagani.", ru: 'В этом примере проблему показали два довода: у скольких людей она была и кто назначил день теста.' })}</>}
      />
      <MentorNote>{tr({ uz: "Harakat belgisi 3-darsda o'tilgan: «Birinchi versiya tayyor bo'lganda, uni sinab ko'rishga 10 daqiqa vaqt berasizmi? Qaysi kunni belgilaysiz?». Zal «Nega to'garaklar emas?» deb so'rasa — o'sha ustunda kun belgilagan 5 tadan 1 tasi. 9-Modulda o'tilgan hikoya (bitta odam bilan bo'lib o'tgan ish) ham 3 daqiqaga sig'adi — bitta jumla bilan, masalan 3-darsdagi 1-yozuv: «o'tgan shanba: 10 kishi kerak edi, 7 kishi keldi». Halol qatorni o'tkazib yubormang: 10 intervyu — isbot emas.", ru: 'Знак действия проходили на 3-м уроке: «Когда первая версия будет готова, дадите 10 минут, чтобы её попробовать? Какой день назначите?». Если зал спросит «Почему не кружки?» — в том столбце день назначил 1 из 5. История из 9-го модуля (случай с одним человеком) тоже помещается в 3 минуты — одной фразой, например запись 1 с 3-го урока: «в прошлую субботу нужно было 10 человек, пришли 7». Не пропускайте честную строку: 10 интервью — не доказательство.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; ✔ B, INLINE_KEYS.s5 = 1; ikkinchi olam — uy vazifalari ilovasi) =====
const SozIsh = () => (
  <div className="pt-sozish">
    <span className="pt-sozish-u"><b>{tr({ uz: "So'z", ru: 'Слово' })}</b><i>A</i><i>C</i></span>
    <span className="pt-sozish-u ish"><b>{tr({ uz: 'Ish', ru: 'Дело' })}</b><i>B</i></span>
    <span className="pt-sozish-u kul"><b>{tr({ uz: 'muammo haqida', ru: 'о проблеме' })}</b><i>D</i></span>
  </div>
);
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · dalil', ru: 'Проверка · довод' })}
    questionText="Uy vazifalari ilovasiga qiziqishni qaysi dalil ishonarliroq ko'rsatadi?"
    question={tr({ uz: <h2 className="title h-ask">Uy vazifalari ilovasiga qiziqishni qaysi dalil <A>ishonarliroq ko'rsatadi?</A></h2>, ru: <h2 className="title h-ask">Какой довод <A>убедительнее показывает</A> интерес к приложению для домашних заданий?</h2> })}
    options={[
      { uz: '5 kishidan 4 tasi «Albatta yuklab olaman» dedi', ru: '4 из 5 человек сказали «Обязательно скачаю»' },
      { uz: "5 kishidan 3 tasi sinab ko'rishga kun belgiladi", ru: '3 из 5 человек назначили день, чтобы попробовать' },
      { uz: "5 kishidan 5 tasi «G'oya juda yaxshi ekan» dedi", ru: '5 из 5 человек сказали «Идея очень хорошая»' },
      { uz: '5 kishidan 4 tasi muammo haqida uzoq gapirdi', ru: '4 из 5 человек долго говорили о проблеме' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Sinab ko'rishga kun belgilash — so'z emas, ish: bu harakat belgisi.", ru: 'Назначить день, чтобы попробовать, — не слово, а дело: это знак действия.' }}
    explainWrong={{
      0: { uz: 'Bu va\'da: odam hali hech narsa qilmadi.', ru: 'Это обещание: человек ещё ничего не сделал.' },
      2: { uz: "Bu fikr: maqtov qiziqishni ish bilan ko'rsatmaydi.", ru: 'Это мнение: похвала не показывает интерес делом.' },
      3: { uz: "Uzoq gap muammoni ko'rsatadi, ilovaga qiziqishni emas.", ru: 'Долгий разговор показывает проблему, а не интерес к приложению.' },
      default: { uz: "So'z bilan aytilganmi yoki qilinganmi — shunga qarang.", ru: 'Смотрите, сказано это словами или сделано.' }
    }}
    vizual={<SozIsh />} />
);

// ===== SCREEN 6 — IPHONE (QVoqea, PM keys K19 — bank matni aynan, raqamsiz; nomlar o'z rangida, logotipsiz; bosqich gapi Mentorda — SABOQ 2, 3, 8, 26) =====
// Manba (o'quvchi ko'rmaydi): PM_Prompt_v8.md K19 · tayanch 5 · brend izohlari — tayanch 9.97 (S-018). Bankda yo'q narsa (sotuv, narx, zal, son) chizilmaydi.
const IPHONE_BOSQICH = [
  { h: { uz: "Ko'p tugma", ru: 'Много кнопок' }, m: { uz: "2007-yilda telefon kompaniyalari tugmasi ko'proq telefon qilishda bellashgan. Nokia va BlackBerry kabi telefonlarda klaviatura yoki stilus bo'lgan.", ru: 'В 2007 году телефонные компании соревновались, у кого больше кнопок. У телефонов вроде Nokia и BlackBerry были клавиатура или стилус.' } },
  { h: { uz: 'Bitta ekran', ru: 'Один экран' }, m: { uz: "Apple esa klaviatura, stilus va deyarli hamma tugmani olib tashlagan. Telefonda bitta ekran va Home tugmasi qolgan.", ru: 'А Apple убрала клавиатуру, стилус и почти все кнопки. В телефоне остались один экран и кнопка Home.' } },
  { h: { uz: 'Uch qurilma bittada', ru: 'Три устройства в одном' }, m: { uz: "Stiv Jobs iPhone'ni «uch qurilma bittada» deb taqdim etgan: iPod, telefon va internet. iPod — Apple'ning musiqa pleeri.", ru: 'Стив Джобс представил iPhone как «три устройства в одном»: iPod, телефон и интернет. iPod — музыкальный плеер Apple.' } }
];
const IP_SAVOL = { uz: "Stiv Jobs iPhone'ni nechta qurilma deb taqdim etgan?", ru: 'Сколькими устройствами Стив Джобс представил iPhone?' };
const IP_TAXMIN = [{ k: '1', t: '1' }, { k: '2', t: '2' }, { k: '3', t: '3' }];
const Brend = ({ r, children }) => <b className={cxx('pt-brend', r)}>{children}</b>;
const KLAV = Array.from({ length: 20 }, (_, i) => [8 + (i % 5) * 11, 92 + Math.floor(i / 5) * 9]);
const IphoneSahna = ({ b }) => (
  <div className={cxx('pt-ip', `b${b}`)} aria-hidden="true">
    <svg viewBox="0 0 440 210" className="pt-ip-svg">
      <rect x="0" y="196" width="440" height="14" rx="4" className="pt-ip-pol" />
      {/* 1-bosqich: klaviaturali telefon (tugmalar birma-bir yonadi) va stilusli telefon */}
      <g className="pt-ip-eski">
        <g transform="translate(96 40)">
          <rect x="0" y="0" width="66" height="140" rx="12" className="pt-ip-tana" />
          <rect x="8" y="12" width="50" height="62" rx="4" className="pt-ip-ekr" />
          {KLAV.map(([x, y], i) => <rect key={i} x={x} y={y} width="8" height="6" rx="1.5" className="pt-ip-tug" style={{ '--i': i }} />)}
        </g>
        <g transform="translate(250 30)">
          <rect x="0" y="0" width="72" height="150" rx="12" className="pt-ip-tana" />
          <rect x="8" y="12" width="56" height="88" rx="4" className="pt-ip-ekr" />
          {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={12 + (i % 3) * 17} y={110 + Math.floor(i / 3) * 14} width="13" height="9" rx="2" className="pt-ip-tug" style={{ '--i': i + 20 }} />)}
          <g className="pt-ip-stilus"><rect x="84" y="22" width="5" height="120" rx="2.5" transform="rotate(10 86 82)" /><polygon points="84,142 89,142 86.5,152" transform="rotate(10 86 82)" /></g>
        </g>
      </g>
      {/* 2–3-bosqich: bitta katta ekran va Home tugmasi */}
      <g className="pt-ip-yangi" transform="translate(175 8)">
        <rect x="0" y="0" width="90" height="182" rx="16" className="pt-ip-tana iphone" />
        <rect x="7" y="18" width="76" height="140" rx="5" className="pt-ip-ekr katta" />
        <circle cx="45" cy="170" r="7" className="pt-ip-home" />
        <g className="pt-ip-ichi">
          <rect x="16" y="34" width="26" height="26" rx="6" className="pt-ip-i1" />
          <rect x="48" y="34" width="26" height="26" rx="6" className="pt-ip-i2" />
          <rect x="16" y="68" width="26" height="26" rx="6" className="pt-ip-i3" />
        </g>
      </g>
      {/* 3-bosqich: uch qurilma iPhone ekraniga uchib kiradi */}
      <g className="pt-ip-uch">
        <g className="pt-ip-arvoh"><g transform="translate(40 70)"><rect x="0" y="0" width="40" height="62" rx="7" /><circle cx="20" cy="44" r="11" className="ichi" /></g><g transform="translate(52 150)"><path d="M 0 8 Q 0 0 8 0 L 12 0 Q 16 0 16 6 L 16 12 Q 16 16 12 16 L 10 16 Q 18 30 30 34 L 30 32 Q 30 28 34 28 L 40 28 Q 46 28 46 34 L 46 38 Q 46 46 38 46 Q 4 40 0 8 Z" /></g><g transform="translate(330 84)"><rect x="0" y="0" width="74" height="54" rx="6" /><rect x="0" y="0" width="74" height="12" rx="6" className="ichi" /></g></g>
        <g className="pt-ip-q q1" transform="translate(40 70)"><rect x="0" y="0" width="40" height="62" rx="7" /><rect x="6" y="6" width="28" height="20" rx="2" className="ichi" /><circle cx="20" cy="44" r="11" className="ichi" /><circle cx="20" cy="44" r="4" /></g>
        <g className="pt-ip-q q2" transform="translate(52 150)"><path d="M 0 8 Q 0 0 8 0 L 12 0 Q 16 0 16 6 L 16 12 Q 16 16 12 16 L 10 16 Q 18 30 30 34 L 30 32 Q 30 28 34 28 L 40 28 Q 46 28 46 34 L 46 38 Q 46 46 38 46 Q 4 40 0 8 Z" /></g>
        <g className="pt-ip-q q3" transform="translate(330 84)"><rect x="0" y="0" width="74" height="54" rx="6" /><rect x="0" y="0" width="74" height="12" rx="6" className="ichi" /><circle cx="8" cy="6" r="2" /><circle cx="15" cy="6" r="2" /><rect x="8" y="20" width="58" height="5" rx="2" className="ichi" /><rect x="8" y="30" width="40" height="5" rx="2" className="ichi" /><rect x="8" y="40" width="50" height="5" rx="2" className="ichi" /></g>
      </g>
    </svg>
    {b === 0 && <span className="pt-ip-nomlar fade-step"><Brend r="nokia">Nokia</Brend> · <Brend r="bb">BlackBerry</Brend></span>}
    {b >= 1 && <span className="pt-ip-home-l fade-step">Home</span>}
    {b >= 1 && <span className="pt-ip-nom fade-step"><Brend r="iphone">iPhone</Brend></span>}
    {b === 2 && <>
      <span className="pt-ip-ql l1 fade-step">iPod</span>
      <span className="pt-ip-ql l2 fade-step">{tr({ uz: 'telefon', ru: 'телефон' })}</span>
      <span className="pt-ip-ql l3 fade-step">{tr({ uz: 'internet', ru: 'интернет' })}</span>
      <span className="pt-ip-ibora">{tr({ uz: 'uch qurilma bittada', ru: 'три устройства в одном' })}</span>
    </>}
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [xulosaVaqt, setXulosaVaqt] = useState(!!storedAnswer);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!done || xulosaVaqt) return undefined; const t = setTimeout(() => setXulosaVaqt(true), kamHarakat() ? 0 : 2600); return () => clearTimeout(t); }, [done, xulosaVaqt]);
  const bq = IPHONE_BOSQICH[b];
  const kutish = b === 0 && !taxmin;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  const tx = IP_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Brend r="iphone">iPhone</Brend> · {b + 1}/3</>;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish || (done && !xulosaVaqt)} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Brend r="iphone">iPhone</Brend> birinchi marta <A>qanday taqdim etilgan?</A></>, ru: <>Как <Brend r="iphone">iPhone</Brend> <A>представили впервые?</A></> })}
        nuqtalar={<>
          <Mentor key={`m${b}`}>{tr(bq.m)}</Mentor>
          <div className="pt-nuq"><span className="pt-nuq-l">{yorliq}</span>{IPHONE_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="pt-voqea">
          {b === 0 && <p className="pt-tanish"><Brend r="iphone">iPhone</Brend> — {tr({ uz: "Apple kompaniyasining telefoni.", ru: 'телефон компании Apple.' })} <Brend r="nokia">Nokia</Brend> {tr({ uz: 'va', ru: 'и' })} <Brend r="bb">BlackBerry</Brend> — {tr({ uz: '2007-yilda telefon chiqargan kompaniyalar.', ru: 'компании, выпускавшие телефоны в 2007 году.' })}</p>}
          <span className="pt-voqea-h" key={`h${b}`}>{tr(bq.h)}</span>
          <Zoomable><IphoneSahna b={b} /></Zoomable>
          {kutish && <p className="pt-kul-q">{tr({ uz: "Stiv Jobs — o'sha paytdagi Apple rahbari.", ru: 'Стив Джобс — тогдашний руководитель Apple.' })}</p>}
          {kutish && <div className="pt-bash"><QBashorat yorliq={yorliq} savol={tr(IP_SAVOL)} variantlar={IP_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} /></div>}
          {taxmin && !(done && xulosaVaqt) && <div className="pt-bashq fade-step"><span>{tr(IP_SAVOL)}</span><span className="pt-bashq-t">{tr(TAXMIN_L)}: <b>{tx.t}</b></span></div>}
          {done && xulosaVaqt && <QXulosa>{tx && <NatijaTx togri={taxmin === '3'}>{taxmin === '3'
            ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
            : <>{tr(TAXMIN_L)}: {tx.t} <b className="yoq">✕</b> · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>3</b></>}</NatijaTx>}
            {tr({ uz: "Apple tugmalarni olib tashlagan, Jobs esa iPhone'ni bitta ibora bilan taqdim etgan: «uch qurilma bittada».", ru: 'Apple убрала кнопки, а Джобс представил iPhone одной фразой: «три устройства в одном».' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Taqdimot 9-yanvar 2007 da bo'lgan, yozuvi ochiq — vaqt bo'lsa, «uch qurilma» qismini proyektorda qisqa ko'rsating. Ko'prik: pitchdagi Yechim bo'lagi ham shunday — mahsulot bir gapda. Bankdan tashqari fakt qo'shmang: sotuv, narx, «jonli ko'rsatdi» — yo'q. Bu misoldan «hamma pitch shunday» degan qoida chiqarmang.", ru: 'Презентация прошла 9 января 2007 года, запись открыта — если есть время, коротко покажите на проекторе часть про «три устройства». Мостик: часть «Решение» в питче такая же — продукт одной фразой. Не добавляйте фактов вне банка: продаж, цены, «показал вживую» — нет. Не делайте из примера правило «все питчи такие».' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; ✔ C, INLINE_KEYS.s7 = 2; iPhone qoidasi — «Maydon Jamoa»da) =====
const YechimViz = () => (
  <div className="pt-yv"><BolakKarta i={1} holat="ok" qatorlar={[{ k: 'g', t: <>{tr({ uz: "Tashkilotchi o'yinni e'lon qiladi,", ru: 'Организатор объявляет игру,' })} <mark>{tr({ uz: "o'yinchilar bir bosishda qo'shiladi", ru: 'игроки присоединяются в одно нажатие' })}</mark> {tr({ uz: "va o'yin kuni kelishini tasdiqlaydi.", ru: 'и в день игры подтверждают, что придут.' })}</> }]} /></div>
);
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · bir gapda', ru: 'Проверка · одной фразой' })}
    questionText="Zal «Maydon Jamoa nima qiladi?» deb so'radi. Qaysi javob mos?"
    question={tr({ uz: <h2 className="title h-ask">Zal «<Jamoa /> nima qiladi?» deb so'radi. <A>Qaysi javob mos?</A></h2>, ru: <h2 className="title h-ask">Зал спросил: «Что делает <Jamoa />?» <A>Какой ответ подходит?</A></h2> })}
    options={[
      { uz: "«Unda o'yinlar, o'yin va e'lon berish ekranlari bor»", ru: '«В нём есть экраны игр, игры и подачи объявления»' },
      { uz: '«U Expo, NestJS va Neon Database yordamida qurilgan»', ru: '«Он построен на Expo, NestJS и Neon Database»' },
      { uz: "«O'yinchi e'londagi o'yinga bir bosishda qo'shiladi»", ru: '«Игрок присоединяется к объявленной игре в одно нажатие»' },
      { uz: "«U mahalladagi mini-futbol o'yinchilari uchun qilingan»", ru: '«Он сделан для игроков в мини-футбол из махалли»' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Bu gap ilova o'yinchiga nima qilib berishini bitta gapda aytadi.", ru: 'Эта фраза одним предложением говорит, что приложение делает для игрока.' }}
    explainWrong={{
      0: { uz: "Ekranlar ro'yxati ilova nima qilishini aytmaydi.", ru: 'Список экранов не говорит, что делает приложение.' },
      1: { uz: 'Texnologiya zalga ilova nima qilishini aytmaydi.', ru: 'Технология не говорит залу, что делает приложение.' },
      3: { uz: "Bu — kim uchun; ilova nima qilishi aytilmagan.", ru: 'Это — для кого; что делает приложение, не сказано.' },
      default: { uz: 'Ilova odamga nima qilib berishini aytgan javobni toping.', ru: 'Найдите ответ, который говорит, что приложение делает для человека.' }
    }}
    vizual={<YechimViz />} />
);

// ===== SCREEN 8 — JONLI DEMO (QTushuncha ketma-ket, 3 qadam): chapda telefon · o'ngda to'rt bo'lak ixcham va taymer; kutish yozuvi → asosiy harakat → sinovdagi tuzatish =====
const S8_SAVOL = { uz: 'Bepul Backend uxlab qolgan bo\'lsa, ilova birinchi ochilishda qancha kutadi?', ru: 'Если бесплатный Backend уснул, сколько приложение ждёт при первом открытии?' };
const S8_TAXMIN = [{ k: 'soniya', t: { uz: 'bir necha soniya', ru: 'несколько секунд' } }, { k: 'yarim', t: { uz: 'yarim daqiqa', ru: 'полминуты' } }, { k: 'daqiqa', t: { uz: 'bir daqiqagacha', ru: 'до минуты' } }];
const S8_QADAM = [{ uz: 'Ilovani oldindan oching', ru: 'Откройте приложение заранее' }, { uz: "Asosiy harakatni ko'rsating", ru: 'Покажите главное действие' }, { uz: 'Sinovdagi tuzatishni ayting', ru: 'Расскажите об исправлении после теста' }];
const S8_IZOH = [
  { uz: "Bu kutish pitchdan oldin o'tdi — taymer hali boshlanmagan.", ru: 'Это ожидание прошло до питча — таймер ещё не запущен.' },
  { uz: "Asosiy harakat — sinov vazifasidagi ish: «Shanba soat 18:00 dagi o'yinga qo'shiling.»", ru: 'Главное действие — дело из задания теста: «Присоединитесь к игре в субботу в 18:00».' }
];
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0); // bosilgan qadamlar
  const [tayyor, setTayyor] = useState(avval ? 3 : 0); // tugagan qadamlar (harakat oxiriga yetgani)
  const [kut, setKut] = useState(false);
  const [shanba, setShanba] = useState(false);
  const telDemo = useKetma(DEMO_KETMA, q >= 2 && !avval, () => setTimeout(() => setTayyor(2), kamHarakat() ? 0 : 700));
  // 1-qadam: kutish yozuvi va chiziq (~2 s, tezlashtirilgan) → O'yinlar ro'yxati
  useEffect(() => {
    if (q !== 1 || tayyor >= 1) return undefined;
    const t0 = setTimeout(() => setKut(true), 60);
    const t1 = setTimeout(() => setTayyor(1), kamHarakat() ? 0 : 2300);
    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, [q, tayyor]);
  // 3-qadam: telefon ro'yxatga qaytadi, «Shanba» bir lahza ajraladi, bo'lakka qator yoziladi
  useEffect(() => {
    if (q !== 3 || tayyor >= 3) return undefined;
    setShanba(true);
    const t1 = setTimeout(() => setTayyor(3), kamHarakat() ? 0 : 1100);
    const t2 = setTimeout(() => setShanba(false), kamHarakat() ? 0 : 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [q]); // eslint-disable-line
  const done = tayyor >= 3;
  const tugadi = useTugadi(done, 2000, avval);
  const ipucha = useIpucha(!!taxmin && !done, q);
  const { live } = useJonli();
  useEffect(() => { if (done && storedAnswer === undefined) { onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, solved: true, taxmin }); if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'demo', 0, true, 0); } }, [done]); // eslint-disable-line
  const band = q > tayyor;
  const bos = () => { if (band || q >= 3) return; setQ(q + 1); };
  let telH = { ekran: 'royxat' };
  if (avval || q === 3) telH = { ekran: 'royxat', son: 9, shanba };
  else if (q === 2) telH = tayyor >= 2 ? DEMO_OXIR : (telDemo || { ekran: 'royxat' });
  else if (q === 1 && tayyor < 1) telH = { ekran: 'kutish', kutYur: kut };
  const yorliq = q === 1 && tayyor < 1 ? tr({ uz: 'pitchdan oldin', ru: 'до питча' }) : null;
  const demoFill = tayyor >= 3 ? 1 : q === 3 ? 0.9 : tayyor >= 2 ? 0.75 : q === 2 && telDemo ? (telDemo.qosh ? 0.7 : 0.35) : 0;
  const tx = S8_TAXMIN.find(t => t.k === taxmin);
  const izoh = !tugadi && (tayyor === 1 && q === 1 ? S8_IZOH[0] : tayyor === 2 && q === 2 ? S8_IZOH[1] : null);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · jonli demo', ru: 'Понятие · живое демо' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' })} (${tayyor}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Telefonda zalga <A>qaysi harakatni</A> ko'rsatasiz?</>, ru: <>Какое <A>действие</A> покажете залу на телефоне?</> })}
        mentor={<Mentor>{tr(done
          ? { uz: "Jonli demo bo'lagi tayyor: «Davom etish»ni bosing.", ru: 'Часть «Живое демо» готова: нажмите «Продолжить».' }
          : { uz: "Pitch boshlanganda ilova kutib qolsa, zal ham kutadi: qadamlarni birma-bir bosing.", ru: 'Если в начале питча приложение зависнет на ожидании, зал тоже будет ждать: нажимайте шаги по одному.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S8_SAVOL)} variantlar={S8_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} yopiq={done} />}
        harakat={taxmin && !done && <QadamQatori qadamlar={S8_QADAM.map(tr)} joriy={tayyor >= q ? q : q - 1} onBos={bos} yopiq={band} />}
        vizual={<UchDaqiqaSahna
          tel={<JamoaTelefon h={telH} yorliq={yorliq} />}
          zal={<Zal pufak={tayyor >= 2 ? 'ok' : ZAL_SAVOL[2]} bur={q >= 2 && tayyor < 3} />}
          bolaklar={BOLAK.map((b, i) => <BolakKarta key={b.k} i={i} ixcham
            holat={i < 2 ? 'ok' : i === 2 ? (tayyor >= 3 ? 'ok' : 'joriy') : 'bosh'}
            qatorlar={i === 2 && tayyor >= 3 ? [{ k: 't', t: tr(JAMOA_PITCH.demo.tuzatish), yangi: !avval }] : []} />)}
          taymer={{ fill: [q >= 2 ? 1 : 0, q >= 2 ? 1 : 0, demoFill, 0], joriy: q >= 2 && !done ? 2 : -1, kulrang: q < 2, nomlar: BOLAK.map(b => tr(b.nom)) }}
          ostida={izoh && <QIzoh key={ou(izoh)}>{tr(izoh)}</QIzoh>} />}
        natija={!done && ipucha && <QIzoh>{tr({ uz: "Yoqilgan qadamni bosing — telefonda nima o'zgarishini ko'ring.", ru: 'Нажмите активный шаг — посмотрите, что изменится на телефоне.' })}</QIzoh>}
        xulosa={tugadi && <>{tx && <NatijaTx togri={taxmin === 'daqiqa'}>{taxmin === 'daqiqa'
          ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
          : <>{tr(TAXMIN_L)}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: 'bir daqiqagacha', ru: 'до минуты' })}</b></>}</NatijaTx>}
          {tr({ uz: "Bu misolda jonli demo — oldindan ochilgan ilovada bitta asosiy harakat va sinovdagi tuzatish.", ru: 'В этом примере живое демо — одно главное действие в заранее открытом приложении и исправление после теста.' })}</>}
      />
      <MentorNote>{tr({ uz: "Render bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈ 1 daqiqa — 15-darsdagi 1-risk shu edi. Pitchdan 2–3 daqiqa oldin ilovani bir marta oching. Mobil trekda Expo Go laptopdagi npx expo start ga ulanadi: laptop yoniq, telefon va laptop bitta Wi-Fi'da (ishlamasa — npx expo start --tunnel). Web-trekda mahsulot telefon brauzerida yoki bosh ekrandagi PWA'da ochiladi. Zaxira: ilovani ishlatayotgan ekran videosi (telefonning ekran yozuvi bilan oldindan) — jonli ko'rsatish ishlamasa, shuni ko'rsatadi; bu Demo Day 7 da ham asqotadi (o'quvchiga va'da qilib aytilmaydi).", ru: 'Бесплатный сервис Render засыпает после 15 минут без запросов, просыпается ≈ 1 минуту — это и был 1-й риск на 15-м уроке. Откройте приложение один раз за 2–3 минуты до питча. В мобильном треке Expo Go подключается к npx expo start на ноутбуке: ноутбук включён, телефон и ноутбук в одной Wi-Fi (если не работает — npx expo start --tunnel). В веб-треке продукт открывается в браузере телефона или в PWA на главном экране. Запасной вариант: видео экрана с работой приложения (заранее, записью экрана телефона) — если живой показ не работает, показывают его; это пригодится и на Demo Day 7 (ученику не обещается).' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 9 — KOD YOZISH: DATABASE'DAN SON (QKod, Neon varianti: chapda vazifa + ikki son + darvoza, o'ngda Neon SQL Editor maketi + Jonli demo bo'lagi; tayanch 4 «16», 9.99) =====
// Manba (o'quvchi ko'rmaydi): neon.com/docs/get-started/query-with-neon-sql-editor (06.10 qayta ochildi: «click Run», meta-buyruqlar \dt, har SQL — alohida natija). SQL bajarilmaydi — signal: darvoza + o'quvchi yozgan son.
const S9_VAZIFA = [
  { uz: "Neon'da loyihangizni oching va SQL Editor'ga o'ting.", ru: 'Откройте свой проект в Neon и перейдите в SQL Editor.' },
  { uz: "Avval 1-SQL'ni yozib «Run»ni bosing va sonni yozib oling; keyin uni 2-SQL bilan almashtiring (bo'sh joyni to'ldirib) va yana «Run».", ru: 'Сначала напишите 1-й SQL, нажмите «Run» и запишите число; потом замените его 2-м SQL (заполнив пропуск) и снова «Run».' },
  { uz: "Neon ko'rsatgan ikki sonni pastdagi maydonlarga yozing.", ru: 'Впишите два числа, которые показал Neon, в поля ниже.' }
];
const S9_DARVOZA = [
  { k: 'sinov', t: { uz: 'Faqat sinovchilar qilgan ishlar', ru: 'Только то, что сделали тестировщики' }, x: { uz: "Sinovchini ajratadigan shart yo'q — hamma qator sanaldi.", ru: 'Условия, которое отделяет тестировщиков, нет — посчитаны все строки.' } },
  { k: 'hamma', ok: true, t: { uz: 'Namuna va tekshiruv qatorlari ham', ru: 'И строки-образцы, и проверочные' } },
  { k: 'hafta', t: { uz: 'Faqat oxirgi haftadagi qatorlar', ru: 'Только строки за последнюю неделю' }, x: { uz: "SQL'da vaqt sharti yo'q — hamma kunlar sanaldi.", ru: 'В SQL нет условия по времени — посчитаны все дни.' } }
];
const S9_DSAVOL = { uz: "Neon ko'rsatgan songa nimalar kiradi?", ru: 'Что входит в число, которое показал Neon?' };
const QKOD_ONG = ['muh', 'arrir'].join('');
const NeonNatija = ({ v, k, n }) => <span className="pt-neon-jad"><span className="pt-neon-th">count</span><span key={v === '' ? 'q' : 'n'} className={cxx('pt-neon-td', v !== '' && 'bor')} data-neon={n}>{v === '' ? '?' : k}</span></span>;
const NeonMaket = ({ a, b }) => {
  const ka = useSanoq(a === '' ? null : Number(a));
  const kb = useSanoq(b === '' ? null : Number(b));
  const Natija = NeonNatija;
  return (
    <div className="pt-neon">
      <div className="pt-neon-bar"><i /><i /><i /><span className="pt-neon-tab">SQL Editor</span><span className="pt-neon-run">Run</span></div>
      <pre className="pt-neon-sql"><span className="cm">-- 1) {tr({ uz: "nechta o'yin e'lon qilingan", ru: 'сколько игр объявлено' })}</span>{'\n'}<span className="kw">SELECT</span> COUNT(*) <span className="kw">FROM</span> oyinlar;{'\n\n'}<span className="cm">-- 2) {tr({ uz: "hozir o'yinlarda nechta joy band", ru: 'сколько мест в играх занято сейчас' })}</span>{'\n'}<span className="kw">SELECT</span> COUNT(*) <span className="kw">FROM</span> <span className="bo">______</span>{'\n'}<span className="kw">WHERE</span> holat <span className="kw">IN</span> (<span className="str">'qoshildi'</span>, <span className="str">'keladi'</span>);</pre>
      <div className="pt-neon-nat"><Natija v={a} k={ka} n="1" /><Natija v={b} k={kb} n="2" /></div>
    </div>
  );
};
const SON_RE = /^\d+$/;
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const achMiss = useContext(AchMissCtx);
  const avval = !!storedAnswer;
  const [a, setA] = useState(storedAnswer?.a ?? '');
  const [na, setNa] = useState(storedAnswer?.na ?? '');
  const [b, setB] = useState(storedAnswer?.b ?? '');
  const [nb, setNb] = useState(storedAnswer?.nb ?? '');
  const [dv, setDv] = useState(avval && storedAnswer.darvoza ? 'hamma' : null);
  const [dvXato, setDvXato] = useState(null);
  const [silk, setSilk] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [holat, setHolat] = useState(storedAnswer ? (storedAnswer.kirolmadi ? 'kirolmadi' : 'bajardi') : null);
  const [qulf, setQulf] = useState(null);
  const birinchiRef = useRef(true);
  const uch = useUchish();
  const sA = a.trim(), sB = b.trim();
  const sonlarOk = SON_RE.test(sA) && SON_RE.test(sB);
  const xatoSon = (sA !== '' && !SON_RE.test(sA)) || (sB !== '' && !SON_RE.test(sB));
  const dvOk = dv === 'hamma';
  const done = holat !== null;
  const nimaA = na.trim() || tr({ uz: "o'yin", ru: 'игр' });
  const nimaB = nb.trim() || tr({ uz: 'band joy', ru: 'занятых мест' });
  const qator = tr({ uz: `Database'da ${sA} ta ${nimaA} va ${sB} ta ${nimaB} bor — ichida namuna va tekshiruv yozuvlari ham bor.`, ru: `В Database ${sA} ${nimaA} и ${sB} ${nimaB} — внутри есть и образцы, и проверочные записи.` });
  const tanlaDv = (k) => {
    if (dvOk || done || isMentor) return;
    const v = S9_DARVOZA.find(x => x.k === k);
    if (v.ok) {
      setDv(k); setDvXato(null);
      uch('.lesson-root [data-neon="2"]', 's9son', 760);
    } else {
      birinchiRef.current = false; setDvXato(k); setSilk(k + Date.now());
      if (achMiss) achMiss.miss(screen);
    }
  };
  const bajardim = () => {
    if (done || isMentor) return;
    if (!sonlarOk) { setQulf({ uz: "Avval Neon ko'rsatgan sonni yozing", ru: 'Сначала впишите число, которое показал Neon' }); return; }
    if (!dvOk) { setQulf({ uz: 'Avval son savolini yeching', ru: 'Сначала ответьте на вопрос о числе' }); return; }
    setHolat('bajardi'); setQulf(null);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, solved: true, picked: true, correct: birinchiRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id)), a: sA, na: na.trim(), b: sB, nb: nb.trim(), darvoza: true, qator });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'neon', 0, true, 0);
  };
  const kirolmadi = () => {
    if (done || isMentor) return;
    setHolat('kirolmadi'); setQulf(null);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, solved: true, picked: true, correct: false, kirolmadi: true });
  };
  const mentorT = done
    ? { uz: "Tayyor: «Davom etish»ni bosing.", ru: 'Готово: нажмите «Продолжить».' }
    : dvOk ? { uz: "Son bo'lakka yozildi: «Bajardim»ni bosing.", ru: 'Число записано в часть: нажмите «Готово».' }
      : sonlarOk ? { uz: "Endi pastdagi savolga javob bering: songa nimalar kiradi?", ru: 'Теперь ответьте на вопрос ниже: что входит в число?' }
        : { uz: "Jonli demo bo'lagiga Database'dagi son qo'shiladi: SQL'ni o'zingiz yozib, Neon ko'rsatgan sonni oling.", ru: 'В часть «Живое демо» добавляется число из Database: напишите SQL сами и возьмите число, которое показал Neon.' };
  const SonQator = ({ n, v, setV, nm, setNm, ph }) => (
    <label className="pt-son-q">
      <span className="pt-son-l">{n}-son:</span>
      <input className={cxx('pt-inp son', v.trim() !== '' && !SON_RE.test(v.trim()) && 'xato', !done && !isMentor && v.trim() === '' && n === (sA === '' ? 1 : 2) && 'pt-halqa-i')} inputMode="numeric" value={v} disabled={done || dvOk || isMentor} placeholder={tr({ uz: 'son', ru: 'число' })} onChange={(e) => setV(e.target.value)} />
      <span className="pt-son-l">{tr({ uz: 'ta', ru: '' })}</span>
      <input className="pt-inp" value={nm} disabled={done || dvOk || isMentor} placeholder={tr(ph)} onChange={(e) => setNm(e.target.value)} />
    </label>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · Neon', ru: 'Пишем код · Neon' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval sonni oling', ru: 'Сначала получите число' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Pitch uchun sonni Database'dan <A>oladigan SQL yozamiz.</A></>, ru: <>Пишем SQL, <A>который берёт число для питча</A> из Database.</> })}
        mentor={<Mentor>{tr(mentorT)}</Mentor>}
        vazifa={<div className="pt-s9-v">
          {!sonlarOk && holat === null && !yordam && <ol className="pt-vz">{S9_VAZIFA.map((v, i) => <li key={i}><i>{i + 1}</i><span>{tr(v)}</span></li>)}</ol>}
          {holat !== 'kirolmadi' && <div className="pt-sonlar">
            {SonQator({ n: 1, v: a, setV: setA, nm: na, setNm: setNa, ph: { uz: "masalan: o'yin", ru: 'например: игр' } })}
            {SonQator({ n: 2, v: b, setV: setB, nm: nb, setNm: setNb, ph: { uz: 'masalan: band joy', ru: 'например: занятых мест' } })}
            {xatoSon && <QXato>{tr({ uz: "Neon ko'rsatgan sonni shu yerga yozing.", ru: 'Впишите сюда число, которое показал Neon.' })}</QXato>}
          </div>}
          {sonlarOk && holat !== 'kirolmadi' && <div className="pt-dv fade-step">
            <span className="pt-dv-s">{tr(S9_DSAVOL)}</span>
            <div className={cxx('pt-dv-v', !dvOk && !done && 'pt-guruh')}>{S9_DARVOZA.filter(v => !dvOk || v.ok).map(v => <QChip key={v.k} holat={dv === v.k ? 'ok' : dvXato === v.k ? 'err' : undefined} silk={silk && silk.startsWith(v.k)} disabled={dvOk || done || isMentor} onClick={() => tanlaDv(v.k)}>{v.ok && dvOk ? '✓ ' : ''}{tr(v.t)}</QChip>)}</div>
            {dvXato && !dvOk && <QXato>{tr(S9_DARVOZA.find(x => x.k === dvXato).x)}</QXato>}
          </div>}
          <NishonQatori screen={screen} />
        </div>}
        yordam={null}
        bajardim={<div className="pt-bajar">
          {holat === 'bajardi' && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Son Database'dan olindi — u jonli demo bo'lagiga yozildi.", ru: 'Число взято из Database — оно записано в часть «Живое демо».' })}</p></div>}
          {yordam && !dvOk && !done && <div className="pt-yordam-t fade-step">
            <p>{tr({ uz: <>Jadvallaringiz nomi <code className="qcode">README.md</code> dagi «Arxitektura» bo'limida; SQL Editor'da <code className="qcode">\dt</code> yozsangiz, jadvallar ro'yxati chiqadi. Holat ustuni bo'lmasa — <code className="qcode">WHERE</code> qatorini olib tashlang.</>, ru: <>Названия ваших таблиц — в разделе «Архитектура» файла <code className="qcode">README.md</code>; если в SQL Editor написать <code className="qcode">\dt</code>, появится список таблиц. Если столбца holat нет — уберите строку <code className="qcode">WHERE</code>.</> })}</p>
            <p>{tr({ uz: <>Eslatma: bo'sh joyga kim qaysi o'yinga qo'shilganini saqlaydigan jadval — <code className="qcode">ishtirokchilar</code> yoziladi. SQL darslaridan: <code className="qcode">COUNT(*)</code> — qatorlarni sanaydi · <code className="qcode">WHERE</code> — qaysi qatorlar olinishi · <code className="qcode">IN (…)</code> — qiymat qavsdagilardan biri bo'lsa.</>, ru: <>Напоминание: в пропуск пишется таблица, где хранится, кто к какой игре присоединился, — <code className="qcode">ishtirokchilar</code>. Из уроков SQL: <code className="qcode">COUNT(*)</code> — считает строки · <code className="qcode">WHERE</code> — какие строки взять · <code className="qcode">IN (…)</code> — значение одно из тех, что в скобках.</> })}</p>
            <p>{tr({ uz: "Database'ga kira olmasangiz — sonni o'ylab topmang: jonli demo bo'lagi sonsiz ham to'liq (pastdagi «Database'ga kira olmadim»).", ru: 'Если не получается зайти в Database — не придумывайте число: часть «Живое демо» полна и без него (кнопка ниже «Не смог зайти в Database»).' })}</p>
          </div>}
          {!done && <div className="pt-bajar-t">
            {!dvOk && <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>}
            <QTugma ikkinchi disabled={isMentor} onClick={kirolmadi}>{tr({ uz: "Database'ga kira olmadim", ru: 'Не смог зайти в Database' })}</QTugma>
          </div>}
          {!done && <div className="pt-bajar-t">
            <QTugma className={halqa(dvOk && !isMentor)} disabled={isMentor} onClick={bajardim}>{tr({ uz: 'Bajardim — SQL ishladi, son yozildi', ru: 'Готово — SQL сработал, число записано' })}</QTugma>
          </div>}
          {qulf && !done && <QXato>{tr(qulf)}</QXato>}
        </div>}
        {...{ [QKOD_ONG]: <div className="pt-s9-o">
          <Zoomable><NeonMaket a={SON_RE.test(sA) ? sA : ''} b={SON_RE.test(sB) ? sB : ''} /></Zoomable>
          <QIzoh>{tr({ uz: "Sizning soningiz shu katakda chiqadi — u sizning Database'ingizdan.", ru: 'Ваше число появится в этой ячейке — оно из вашей Database.' })}</QIzoh>
          <BolakKarta i={2} ixcham holat={dvOk && holat !== 'kirolmadi' ? 'ok' : 'joriy'}
            qatorlar={[{ k: 'd', uch: 's9son', t: dvOk && holat !== 'kirolmadi' ? qator : <span className="pt-kul-t">{tr({ uz: "Database'da: …", ru: 'В Database: …' })}</span> }]} />
        </div> }}
      >
        <MentorNote>{tr({ uz: "SELECT * emas — faqat son: telefon raqamlari ekranga chiqmasin (10-Modul qoidasi). Laptop va Render bitta Neon Database'ga yozadi — o'quvchining o'z tekshiruvlari ham sanaladi. ishtirokchilar qatori — bitta qo'shilish: bitta o'yinchi ikki o'yinga qo'shilsa, ikki marta sanaladi; shuning uchun «o'yinchi» emas, «band joy». chiqdi, navbatda sanalmaydi — son butun tarixni emas, hozirgi holatni ko'rsatadi. Tez tugatganlar: SELECT holat, COUNT(*) FROM ishtirokchilar GROUP BY holat; — qaysi holatda nechta.", ru: 'Не SELECT * — только число: номера телефонов не должны появиться на экране (правило 10-го модуля). Ноутбук и Render пишут в одну Neon Database — проверки самого ученика тоже считаются. Строка ishtirokchilar — одно присоединение: если игрок присоединился к двум играм, он посчитан дважды; поэтому не «игрок», а «занятое место». chiqdi и navbatda не считаются — число показывает не всю историю, а текущее состояние. Кто закончил быстро: SELECT holat, COUNT(*) FROM ishtirokchilar GROUP BY holat; — сколько в каждом состоянии.' })}</MentorNote>
      </QKod>
    </Stage>
  );
};

// ===== SCREEN 10 — PITCH YOZISH (QMustaqil, USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29) · artefakt pm-m9d16-pitch · nishon fourParts =====
// O'qiydi (P-046, M-q5): pm-m9d5-prd (muammo, dalil, yechim) · pm-m9d4-final (muammoGapi — PRD bo'lmasa) · pm-m9d13-sinov (eng, toxtashlar, bajardi, tuzatildi, qaytaSinov, tur — 9.90) ·
// 9-ekran qatori (Son) · pm-m9d15-reja (risklar[].qadam, birinchi, holatlar — 9.96). Kalit yo'q bo'lsa — maydon bo'sh, o'quvchi o'zi yozadi.
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
// <tekshiruv> — node da sinaladi (PM-108): har bo'lak uchun xabarlar tartibi — avval bloklaydiganlar, keyin yo'naltiruvchilar
const RE_HAMMA = /(^|[^a-z'])(hamma|ko'pchilik|har kim)([^a-z']|$)|(^|[^а-яё])(все|всем|всех|многие|каждый)([^а-яё]|$)/;
const RE_XOHISH = /(xohlaydi|xohlardi|yoqadi|bo'lsa yaxshi|хочет|хотят|нравится|было бы хорошо)/;
const RE_TEXNO = /(^|[^a-z])(react|expo|nestjs|neon|render|netlify)([^a-z]|$)/;
const normT = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'");
const gaplarSoni = (s) => String(s || '').split(/[.!?]+/).filter(x => x.trim().length > 0).length;
const tekshirBolak = (i, f) => {
  const r = [];
  if (i === 0) {
    const d = normT(f.muammo.dalil);
    if (!/\d/.test(d)) r.push({ k: 'sonYoq', blok: true, joy: 'dalil' });
    if (RE_HAMMA.test(d)) r.push({ k: 'hamma', joy: 'dalil' });
    if (RE_XOHISH.test(normT(f.muammo.gap))) r.push({ k: 'xohish', joy: 'gap' });
  } else if (i === 1) {
    if (gaplarSoni(f.yechim) >= 2) r.push({ k: 'ikkiGap', joy: 'yechim' });
    if (RE_TEXNO.test(normT(f.yechim))) r.push({ k: 'texno', joy: 'yechim' });
  } else if (i === 2) {
    if (!String(f.demo.harakat || '').trim()) r.push({ k: 'harakatYoq', blok: true, joy: 'harakat' });
  } else if (!String(f.keyingi || '').trim()) r.push({ k: 'keyingiYoq', blok: true, joy: 'keyingi' });
  return r;
};
// </tekshiruv>
const S10_XABAR = {
  sonYoq: { uz: 'Dalilga sanoqni yozing: necha kishidan nechtasi?', ru: 'Добавьте в довод подсчёт: сколько из скольких?' },
  hamma: { uz: "Bu so'z sanoq emas — necha kishidan nechtasi?", ru: 'Это слово — не подсчёт: сколько из скольких?' },
  xohish: { uz: "Bu xohish — kim nimadan qiynalgani ko'rinmaydi.", ru: 'Это желание — не видно, кому и от чего трудно.' },
  ikkiGap: { uz: "Yechimni bitta gapga sig'diring.", ru: 'Уместите решение в одну фразу.' },
  texno: { uz: 'Bu texnologiya — mahsulot odamga nima qiladi?', ru: 'Это технология — а что продукт делает для человека?' },
  harakatYoq: { uz: "Telefonda ko'rsatadigan bitta harakatni yozing.", ru: 'Напишите одно действие, которое покажете на телефоне.' },
  keyingiYoq: { uz: 'Rejangizdan bitta keyingi qadamni yozing.', ru: 'Напишите один следующий шаг из своего плана.' }
};
const QOLDIR = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставить так — снова нажмите «Сохранить».' };
const SAQLASH = { uz: 'Saqlash', ru: 'Сохранить' };
// Har bo'lak maydonlari (MD 10-ekran): yo'l · yorliq · placeholder · ko'p qatorli
const MAYDON = [
  [{ p: ['muammo', 'gap'], j: 'gap', maj: true, l: { uz: 'Muammo gapi', ru: 'Фраза о проблеме' }, ph: { uz: 'Kim nimadan qiynaladi?', ru: 'Кому и от чего трудно?' }, kop: true },
    { p: ['muammo', 'dalil'], j: 'dalil', maj: true, l: { uz: 'Dalil', ru: 'Довод' }, ph: { uz: 'Necha kishidan nechtasida? Kim sinovga kun belgiladi?', ru: 'У скольких из скольких? Кто назначил день теста?' }, kop: true }],
  [{ p: ['yechim'], j: 'yechim', maj: true, l: { uz: 'Bir gap', ru: 'Одна фраза' }, ph: { uz: 'Mahsulot odamga nima qiladi?', ru: 'Что продукт делает для человека?' }, kop: true }],
  [{ p: ['demo', 'harakat'], j: 'harakat', maj: true, l: { uz: 'Asosiy harakat', ru: 'Главное действие' }, ph: { uz: "Telefonda qaysi harakatni ko'rsatasiz?", ru: 'Какое действие покажете на телефоне?' } },
    { p: ['demo', 'tuzatish'], j: 'tuzatish', l: { uz: 'Sinovdagi tuzatish', ru: 'Исправление после теста' }, ph: { uz: 'Sinovda nima topildi, nimani tuzatdingiz?', ru: 'Что нашли на тесте, что исправили?' }, kop: true },
    { p: ['demo', 'son'], j: 'son', l: { uz: 'Son', ru: 'Число' }, ixt: true, ph: { uz: '', ru: '' } }],
  [{ p: ['keyingi'], j: 'keyingi', maj: true, l: { uz: 'Keyingi qadam', ru: 'Следующий шаг' }, ph: { uz: 'Rejangizdagi birinchi ish', ru: 'Первое дело из вашего плана' }, kop: true }]
];
const fGet = (f, p) => p.reduce((o, k) => (o ? o[k] : ''), f) || '';
const fSet = (f, p, v) => { const n = JSON.parse(JSON.stringify(f)); let o = n; p.slice(0, -1).forEach(k => { o[k] = o[k] || {}; o = o[k]; }); o[p[p.length - 1]] = v; return n; };
const BOSH_F = { muammo: { gap: '', dalil: '' }, yechim: '', demo: { harakat: '', tuzatish: '', son: '' }, keyingi: '' };
const matnOl = (v) => (typeof v === 'string' ? v : '');
// pm-m9d13-sinov → «Sinovdagi tuzatish» qatori (fakt: nima topildi + «o'zgartirdim» + qayta sinov; isbot so'zi yo'q — 16-FILTR 2)
const sinovQator = (s) => {
  if (!s || s.tuzatildi !== true || !Array.isArray(s.toxtashlar)) return '';
  const e = s.toxtashlar.find(t => t && t.id === s.eng) || s.toxtashlar[0];
  if (!e || !e.matn) return '';
  const n = Array.isArray(s.bajardi) ? s.bajardi.length : 0;
  const k = Array.isArray(e.kishilar) ? e.kishilar.length : 0;
  const bosh = s.tur === 'mashq' ? tr({ uz: 'Mashq sinovida', ru: 'На тренировочном тесте' }) : tr({ uz: 'Sinovda', ru: 'На тесте' });
  let q = n && k ? tr({ uz: `${bosh} ${n} kishidan ${k} tasi «${e.matn}» joyida to'xtadi — o'zgartirdim.`, ru: `${bosh} ${k} из ${n} человек застряли на месте «${e.matn}» — я изменил это.` })
    : tr({ uz: `${bosh} «${e.matn}» joyida to'xtashdi — o'zgartirdim.`, ru: `${bosh} застряли на месте «${e.matn}» — я изменил это.` });
  const qs = s.qaytaSinov && s.qaytaSinov.natija;
  if (qs === 'toxtamadi') q += ' ' + tr({ uz: 'Qayta sinovda bu safar takrorlanmadi.', ru: 'На повторном тесте на этот раз не повторилось.' });
  if (qs === 'toxtadi') q += ' ' + tr({ uz: "Qayta sinovda yana to'xtadi.", ru: 'На повторном тесте снова застряли.' });
  return q;
};
const rejaTugmalar = (r) => {
  if (!r || typeof r !== 'object') return [];
  const ris = Array.isArray(r.risklar) ? r.risklar.map((x, i) => ({ t: matnOl(x && x.qadam), i, ufq: x && x.ufq })).filter(x => x.t.trim()) : [];
  // «Avval» (birinchi) belgilangani birinchi va halqada; belgilanmagan bo'lsa — hozir ufqidagi birinchi (tayanch 9.96)
  const hz = ris.find(x => x.ufq === 'hozir');
  const bi = Number.isInteger(r.birinchi) ? r.birinchi : (hz ? hz.i : (ris[0] ? ris[0].i : -1));
  ris.sort((x, y) => (x.i === bi ? -1 : y.i === bi ? 1 : 0));
  const hol = Array.isArray(r.holatlar) ? r.holatlar.filter(h => h && (h.holat === 'boshlanmadi' || h.holat === 'kechikdi')).map(h => ({ t: matnOl(h.ish) })).filter(x => x.t.trim()) : [];
  return [...ris.map(x => ({ t: x.t, avval: x.i === bi })), ...hol];
};
const boshlangF = (answers) => {
  const eski = pitchLs() || {};
  const prd = lsGet('pm-m9d5-prd') || {};
  const fin = lsGet('pm-m9d4-final') || {};
  const sin = lsGet('pm-m9d13-sinov');
  const a9 = answers && answers[9];
  const e = (p) => matnOl(fGet(eski, p));
  return {
    muammo: { gap: e(['muammo', 'gap']) || matnOl(prd.muammo) || matnOl(fin.muammoGapi), dalil: e(['muammo', 'dalil']) || matnOl(prd.dalil) },
    yechim: e(['yechim']) || matnOl(prd.yechim),
    demo: { harakat: e(['demo', 'harakat']), tuzatish: e(['demo', 'tuzatish']) || sinovQator(sin), son: (a9 && a9.qator) || e(['demo', 'son']) },
    keyingi: e(['keyingi'])
  };
};
const manbaBor = () => !!(lsGet('pm-m9d5-prd') || lsGet('pm-m9d4-final') || lsGet('pm-m9d13-sinov') || lsGet('pm-m9d15-reja'));
const pitchSaqla = (qism) => { const eski = pitchLs() || {}; lsSet(PITCH_KEY, { ...eski, ...qism, savedAt: Date.now() }); };
const bolakMatn = (f) => pitchMatn(f);
// Bitta bo'lak formasi (10-ekran ustaxonasi va 11-ekran tuzatishi uchun bitta komponent)
const BolakForma = ({ i, f, setF, xato, onSaqla, tayyor, ustida, maydonlar, uchK, oniz, halqasiz }) => {
  const fl = maydonlar || MAYDON[i];
  const birinchiBo = fl.find(m => m.maj && !fGet(f, m.p).trim());
  return (
  <div className={cxx('pt-forma fade-step', oniz && 'ikki')} data-uch={uchK}>
    {ustida}
    <div className="pt-forma-g"><div className="pt-forma-m">
    {fl.map(m => {
      const v = fGet(f, m.p);
      const xq = xato && xato.joy === m.j;
      const P = { className: cxx('pt-inp', xq && 'xato', !halqasiz && birinchiBo === m && 'pt-halqa-i'), value: v, placeholder: tr(m.ph), onChange: (e) => setF(fSet(f, m.p, e.target.value)) };
      return (
        <label key={m.j} className="pt-maydon">
          <span className="pt-maydon-l">{tr(m.l)}{m.ixt && <em> · {tr({ uz: 'ixtiyoriy', ru: 'необязательно' })}</em>}</span>
          {m.kop ? <textarea rows={2} {...P} /> : <input {...P} />}
          {xq && <QXato>{tr(S10_XABAR[xato.k] || S11_XABAR[xato.k])}</QXato>}
          {xq && !xato.blok && S10_XABAR[xato.k] && <span className="pt-qoldir">{tr(QOLDIR)}</span>}
        </label>
      );
    })}
    </div>{oniz && <div className="pt-forma-o">{oniz}</div>}</div>
    <div className="pt-forma-t"><QTugma className={halqa(tayyor && !birinchiBo)} disabled={!tayyor} onClick={onSaqla}>{tr(SAQLASH)}</QTugma></div>
  </div>
  );
};
const tayyorMi = (i, f) => (i === 0 ? !!(f.muammo.gap.trim() && f.muammo.dalil.trim()) : i === 1 ? !!f.yechim.trim() : true);
const Screen10 = ({ screen, storedAnswer, answers, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const avval = !!storedAnswer;
  const [f, setF] = useState(() => boshlangF(answers));
  const [saq, setSaq] = useState(() => (avval ? [true, true, true, true] : [false, false, false, false]));
  const [joriy, setJoriy] = useState(avval ? -1 : 0);
  const [xato, setXato] = useState(null);
  const [otdi, setOtdi] = useState({});
  const [yordam, setYordam] = useState(false);
  const [yashil, setYashil] = useState(-1);
  const [manba] = useState(manbaBor);
  const [rt] = useState(() => rejaTugmalar(lsGet('pm-m9d15-reja')));
  const [trek] = useState(() => { const p = lsGet('pm-m9d8-platforma'); return p && (p.trek === 'web' || p.trek === 'mobil') ? p.trek : null; });
  const uch = useUchish();
  const n = saq.filter(Boolean).length;
  const toliq = n === 4;
  useEffect(() => { if (yashil < 0) return undefined; const t = setTimeout(() => setYashil(-1), 1100); return () => clearTimeout(t); }, [yashil]);
  const saqla = () => {
    const i = joriy;
    const bor = tekshirBolak(i, f);
    const blok = bor.find(x => x.blok);
    if (blok) { setXato(blok); return; }
    const ogoh = bor.find(x => !otdi[i + ':' + x.k]);
    if (ogoh) { setXato(ogoh); setOtdi(o => ({ ...o, [i + ':' + ogoh.k]: true })); return; }
    setXato(null);
    pitchSaqla({ muammo: { ...f.muammo }, yechim: f.yechim, demo: { ...f.demo }, keyingi: f.keyingi });
    uch('.lesson-root .pt-forma', 'strip' + i, 640);
    const yangi = saq.map((s, k) => s || k === i);
    setSaq(yangi); setYashil(i);
    const keyin = yangi.findIndex(s => !s);
    setJoriy(keyin);
    if (keyin < 0 && !avval && !(storedAnswer && storedAnswer.solved)) {
      const sanoqBor = /\d/.test(f.muammo.dalil) && !RE_HAMMA.test(normT(f.muammo.dalil));
      onAnswer(screen, { stage: 'practice', screenIdx: screen, solved: true, correct: true, picked: true, sanoq: sanoqBor, nishon: ['fourParts'] });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', sanoqBor ? 1 : 0, true, 0);
    }
  };
  const p = isMentor ? null : f;
  const matn = pitchMatn(p);
  const sanoqYoq = toliq && (RE_HAMMA.test(normT(f.muammo.dalil)) || !/\d/.test(f.muammo.dalil));
  const mentorT = isMentor
    ? { uz: "Oldingi darslarda yozganlaringiz shu yerda: har bo'lakni tekshirib, «Saqlash»ni bosing.", ru: 'То, что вы писали на прошлых уроках, уже здесь: проверьте каждую часть и нажмите «Сохранить».' }
    : toliq && joriy < 0 ? { uz: "To'rt bo'lak saqlandi: «Davom etish»ni bosing.", ru: 'Четыре части сохранены: нажмите «Продолжить».' }
      : manba ? { uz: "Oldingi darslarda yozganlaringiz shu yerda: har bo'lakni tekshirib, «Saqlash»ni bosing.", ru: 'То, что вы писали на прошлых уроках, уже здесь: проверьте каждую часть и нажмите «Сохранить».' }
        : { uz: "Har bo'lakni yozib, «Saqlash»ni bosing.", ru: 'Напишите каждую часть и нажмите «Сохранить».' };
  const kartaUstida = joriy >= 0 && <span className="pt-bosq">{BOLAK.map((b, k) => <span key={b.k} className={cxx('pt-bosq-c', k === joriy && 'on', saq[k] && k !== joriy && 'ok')}>{saq[k] && k !== joriy ? <i>✓</i> : <i>{k + 1}</i>}{tr(b.nom)}</span>)}</span>;
  const rejaQism = joriy === 3 && rt.length > 0 && <div className="pt-reja-t">
    <span className="pt-kul-t">{tr({ uz: "Uyda «Avval» qadamini bajargan bo'lsangiz — keyingisini tanlang.", ru: 'Если дома вы уже сделали шаг «Сначала» — выберите следующий.' })}</span>
    <span className="pt-reja-tl">{rt.map((r, k) => <button key={k} type="button" className={cxx('pt-reja-tug', r.avval && !f.keyingi.trim() && 'pt-halqa', f.keyingi === r.t && 'on')} onClick={() => { setF(fSet(f, ['keyingi'], r.t)); setXato(null); }}>{r.t}</button>)}</span>
  </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!toliq && !isMentor} label={toliq || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "To'rt bo'lakni yozing", ru: 'Напишите четыре части' })} (${n}/4)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Pitchingizni <A>to'rt bo'lakka</A> yozing.</>, ru: <>Запишите свой питч <A>в четыре части</A>.</> })}
        mentor={<Mentor>{tr(mentorT)}</Mentor>}
        qadamlar={!isMentor && <div className="pt-strip fade-step">
          <span className="pt-strip-l">{tr({ uz: 'Pitchim', ru: 'Мой питч' })} · <b>{n}/4</b></span>
          {BOLAK.map((b, i) => <span key={b.k} className={cxx('pt-strip-q', saq[i] && 'ok', yashil === i && 'yashil')} data-uch={'strip' + i}>{saq[i] && <i>✓</i>}{tr(b.nom)}</span>)}
        </div>}
        forma={isMentor || joriy < 0
          ? <div className="pt-s10-sahna fade-step">
            <Zoomable><UchDaqiqaSahna bolaklar={BOLAK.map((b, i) => <BolakKarta key={b.k} i={i} holat="ok" qatorlar={matn[i].map((t, k) => ({ k: 'q' + k, t, kichik: k > 0 }))} onEd={isMentor ? undefined : () => { setJoriy(i); setXato(null); }} />)} /></Zoomable>
            {!isMentor && toliq && <QXulosa>{sanoqYoq
              ? tr({ uz: "To'rt bo'lak tayyor — dalilga sanoq qo'shing.", ru: 'Четыре части готовы — добавьте подсчёт в довод.' })
              : tr({ uz: "To'rt bo'lak tayyor: dalilda sanoq bor, yechim — bir gapda, telefonda — bitta harakat.", ru: 'Четыре части готовы: в доводе есть подсчёт, решение — одной фразой, на телефоне — одно действие.' })}</QXulosa>}
          </div>
          : <BolakForma key={joriy} i={joriy} f={f} setF={(v) => { setF(v); if (xato && xato.blok) setXato(null); }} xato={xato} onSaqla={saqla} tayyor={tayyorMi(joriy, f)} halqasiz={joriy === 3 && rt.length > 0} ustida={<>{kartaUstida}{rejaQism}</>}
            oniz={<div className="pt-oniz"><Zal pufak={ZAL_SAVOL[joriy]} /><BolakKarta i={joriy} katta holat="joriy" qatorlar={matn[joriy].map((t, k) => ({ k: 'q' + k, t, kichik: k > 0 }))} bosh={matn[joriy].length ? 0 : 1} /></div>} />}
        yordam={!isMentor && joriy >= 0 && <div className="pt-yordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
          {yordam && <div className="pt-yordam-t fade-step"><p>{tr({ uz: "Yechimni tekshiring: uni bir nafasda ayta olasizmi? Dalilda sanoq bo'lsin; harakat belgisi bo'lsa — uni ham yozing. Asosiy harakat — sinov vazifangizdagi ish. Keyingi qadamni tuzatilgan rejangizdan oling.", ru: 'Проверьте решение: можете сказать его на одном дыхании? В доводе должен быть подсчёт; если есть знак действия — допишите и его. Главное действие — дело из вашего задания теста. Следующий шаг возьмите из исправленного плана.' })}</p>
            {trek !== 'mobil' && <p>{tr({ uz: "Web-trekda ham shunday: jonli demo — mahsulotingiz telefon brauzerida.", ru: 'В веб-треке так же: живое демо — ваш продукт в браузере телефона.' })}</p>}</div>}
        </div>}
      >
        <MentorSanoq zonalar={[PRACTICE_BASE + screen]} yorliqlar={[{ uz: "To'rt bo'lakni yozganlar", ru: 'Написали четыре части' }, { uz: 'Dalilida sanoq borlar', ru: 'С подсчётом в доводе' }]} hisob={([r]) => [r.length, r.filter(x => x.picked === 1).length]} />
        <MentorNote>{tr({ uz: "Eng ko'p xato — yechim o'rniga texnologiya yoki ekranlar ro'yxati: «Mahsulot odamga nima qiladi?» deb so'rang. 12 daqiqadan keyin juftlikka o'ting; ulgurmagan bo'lak uyda yoziladi.", ru: 'Самая частая ошибка — вместо решения технология или список экранов: спросите «Что продукт делает для человека?». Через 12 минут переходите к работе в парах; что не успели — допишут дома.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 11 — JUFTLIKDA PITCH (QMustaqil, 3 qadam: Ayting → Baholang → Tuzating; yakka rejim bor) · pm-m9d16-pitch · nishonlar threeMinutes, fixedIt =====
const S11_QADAM = [{ uz: 'Ayting', ru: 'Расскажите' }, { uz: 'Baholang', ru: 'Оцените' }, { uz: 'Tuzating', ru: 'Исправьте' }];
const RE_BAHO = /(yomon|zerikarli|yoqmadi|плохо|скучно|не понравил)/;
const S11_XABAR = {
  belgisiz: { uz: "Har bo'lakka ✓ yoki ✗ qo'ying.", ru: 'Поставьте каждой части ✓ или ✗.' },
  izohQisqa: { uz: "✗ qo'ydingiz — nima yetishmaganini bir qatorda yozing.", ru: 'Вы поставили ✗ — напишите в одну строку, чего не хватило.' },
  hammaOk: { uz: "Hammasi ✓ — qaysi bo'lak yanada aniqroq bo'lishi mumkin?", ru: 'Везде ✓ — какая часть может быть ещё точнее?' },
  baho: { uz: "Odam haqida emas — bo'lakda nima yetishmadi?", ru: 'Не о человеке — чего не хватило в части?' },
  ozgarmadi: { uz: "Matn o'zgarmadi — varaqdagi izohni qayta o'qing.", ru: 'Текст не изменился — перечитайте замечание в листе.' }
};
const CHEGARA = [40, 60, 150, 180];
const joriyBolak = (v) => { const i = CHEGARA.findIndex(c => v < c); return i < 0 ? 3 : i; };
const taymerFill = (v) => JAMOA_PITCH.vaqt.map((d, i) => { const bosh = i === 0 ? 0 : CHEGARA[i - 1]; return Math.min(1, Math.max(0, (v - bosh) / d)); });
const JAMOA_F = () => ({ muammo: { gap: tr(JAMOA_PITCH.muammo.gap), dalil: `${tr(JAMOA_PITCH.muammo.sanoq)} ${tr(JAMOA_PITCH.muammo.belgi)}` }, yechim: tr(JAMOA_PITCH.yechim), demo: { harakat: `${tr(SHANBA)} 18:00 · ${tr(MAHALLA)} · «${tr(TEL.qosh)}»`, tuzatish: tr(JAMOA_PITCH.demo.tuzatish), son: '' }, keyingi: tr(JAMOA_PITCH.keyingi) });
const BOSH_VARAQ = () => BOLAK.map(b => ({ qism: b.k, belgi: null, izoh: '', tuzatildi: false }));
const Varaq = ({ varaq, setQ, faol, onBos, tanlov, vaqt, halqaI }) => (
  <div className="pt-vq">
    <span className="pt-vq-h">{tr({ uz: "Baholash varag'i", ru: 'Лист оценки' })}</span>
    {varaq.map((r, i) => {
      const ichi = <>
        <span className="pt-vq-nom"><b>{tr(BOLAK[i].nom)}</b><em>{tr(ZAL_SAVOL[i])}</em></span>
        {faol
          ? <span className="pt-vq-b">{['✓', '✗'].map(b => <button key={b} type="button" className={cxx('pt-vq-bel', r.belgi === b && (b === '✓' ? 'ok' : 'err'))} onClick={() => setQ(i, { belgi: b })}>{b}</button>)}</span>
          : <span key={r.belgi || 'b'} className={cxx('pt-vq-bb', r.belgi === '✓' && 'ok', r.belgi === '✗' && 'err')}>{r.belgi || ''}</span>}
        <span className="pt-vq-iz">
          {faol ? <input className="pt-inp" value={r.izoh} placeholder={tr({ uz: 'Nima yetishmadi?', ru: 'Чего не хватило?' })} onChange={(e) => setQ(i, { izoh: e.target.value })} />
            : (r.izoh ? <span className="pt-vq-izt">{r.izoh}</span> : <span className="pt-kul-t">—</span>)}
          {r.tuzatildi && <em className="pt-tuz">{tr(TUZATILDI)}</em>}
        </span>
      </>;
      return onBos && onBos(i)
        ? <button key={i} type="button" className={cxx('pt-vq-q', 'pt-vq-bos', tanlov === i && 'on', halqaI === i && 'pt-halqa')} onClick={() => onBos(i)(i)}>{ichi}</button>
        : <div key={i} className={cxx('pt-vq-q', r.belgi === '✗' && !r.tuzatildi && 'x')}>{ichi}</div>;
    })}
    <div className={cxx('pt-vq-vaqt', vaqt > JAMI_VAQT && 'oshdi')}><span>{tr({ uz: 'Vaqt', ru: 'Время' })}:</span> <b>{mss(vaqt)}</b></div>
  </div>
);
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const juft = isStudent;
  const st = storedAnswer || {};
  const [f, setF] = useState(() => { const p = pitchLs(); return pitchToliq(p) && !isMentor ? { ...BOSH_F, ...p, muammo: { ...BOSH_F.muammo, ...(p.muammo || {}) }, demo: { ...BOSH_F.demo, ...(p.demo || {}) } } : JAMOA_F(); });
  const [qadam, setQadam] = useState(st.qadam ?? 0);
  const [vaqt, setVaqt] = useState(st.vaqt ?? 0);
  const [yur, setYur] = useState(false);
  const [toxtadi, setToxtadi] = useState(!!st.vaqt);
  const [varaq, setVaraq] = useState(st.varaq || BOSH_VARAQ());
  const [xato, setXato] = useState(null);
  const [otdi, setOtdi] = useState({});
  const [ochiq, setOchiq] = useState(null);
  const [tahrir, setTahrir] = useState(null);
  const [done, setDone] = useState(!!st.solved);
  const [trek] = useState(() => { const p = lsGet('pm-m9d8-platforma'); return p && (p.trek === 'web' || p.trek === 'mobil') ? p.trek : null; });
  useEffect(() => { if (!yur) return undefined; const t = setInterval(() => setVaqt(v => v + 1), 1000); return () => clearInterval(t); }, [yur]);
  const matn = pitchMatn(f);
  const boshla = () => { setVaqt(0); setYur(true); setToxtadi(false); };
  const toxtat = () => { setYur(false); setToxtadi(true); if (qadam === 0) setQadam(1); };
  const qayta = () => { setYur(false); setVaqt(0); setToxtadi(false); setQadam(0); };
  const setQ = (i, d) => { setVaraq(v => v.map((r, k) => (k === i ? { ...r, ...d } : r))); setXato(null); };
  const saqlaVaraq = () => {
    if (varaq.some(r => !r.belgi)) { setXato({ k: 'belgisiz', blok: true }); return; }
    if (varaq.some(r => r.belgi === '✗' && r.izoh.trim().length < 8)) { setXato({ k: 'izohQisqa', blok: true }); return; }
    const ogoh = [varaq.every(r => r.belgi === '✓') && 'hammaOk', varaq.some(r => RE_BAHO.test(normT(r.izoh))) && 'baho'].filter(Boolean).find(k => !otdi[k]);
    if (ogoh) { setXato({ k: ogoh }); setOtdi(o => ({ ...o, [ogoh]: true })); return; }
    setXato(null); setQadam(2);
    if (isMentor) return;
    pitchSaqla({ vaqt, varaq });
    onAnswer(screen, { stage: 'juftlik', screenIdx: screen, solved: false, correct: true, picked: true, qadam: 2, vaqt, varaq, nishon: ['threeMinutes'] });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'juftlik', vaqt <= JAMI_VAQT ? 1 : 0, true, 0);
  };
  const hammaOk = varaq.every(r => r.belgi === '✓');
  const ochiladi = (i) => (qadam === 2 && ochiq === null && !isMentor && (varaq[i].belgi === '✗' ? !varaq[i].tuzatildi : (hammaOk && !varaq[i].tuzatildi && (varaq.some(r => r.izoh.trim()) ? !!varaq[i].izoh.trim() : true))));
  const och = (i) => { setOchiq(i); setTahrir(JSON.parse(JSON.stringify(f))); setXato(null); };
  const saqlaTuz = () => {
    const i = ochiq;
    const eski = bolakMatn(f)[i].join(' ');
    const yangi = bolakMatn(tahrir)[i].join(' ');
    if (eski.trim() === yangi.trim()) { setXato({ k: 'ozgarmadi', blok: true, joy: MAYDON[i][0].j }); return; }
    const bl = tekshirBolak(i, tahrir).find(x => x.blok);
    if (bl) { setXato(bl); return; }
    const nv = varaq.map((r, k) => (k === i ? { ...r, tuzatildi: true } : r));
    setF(tahrir); setVaraq(nv); setOchiq(null); setTahrir(null); setXato(null);
    pitchSaqla({ muammo: { ...tahrir.muammo }, yechim: tahrir.yechim, demo: { ...tahrir.demo }, keyingi: tahrir.keyingi, vaqt, varaq: nv });
    const birinchi = !done;
    setDone(true);
    onAnswer(screen, { stage: 'juftlik', screenIdx: screen, solved: true, correct: true, picked: true, qadam: 2, vaqt, varaq: nv, nishon: ['threeMinutes', 'fixedIt'] });
    if (birinchi && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + 40 + screen, 'juftlik', 0, true, 0);
  };
  const joriyB = yur ? joriyBolak(vaqt) : -1;
  const ortiq = Math.max(0, vaqt - JAMI_VAQT);
  const holatB = (i) => (varaq[i].tuzatildi ? 'tuz' : qadam >= 1 && varaq[i].belgi === '✓' ? 'ok' : qadam >= 1 && varaq[i].belgi === '✗' ? 'err' : joriyB === i ? 'joriy' : 'matn');
  const sahna = <UchDaqiqaSahna className="pt-s11-sahna"
    bolaklar={BOLAK.map((b, i) => <BolakKarta key={b.k} i={i} ixcham={qadam > 0} holat={holatB(i)} qatorlar={matn[i].slice(0, qadam > 0 ? 1 : 2).map((t, k) => ({ k: 'q' + k, t, kichik: k > 0 }))} />)}
    taymer={{ fill: taymerFill(vaqt), joriy: joriyB, ortiq, nomlar: BOLAK.map(b => tr(b.nom)) }}
    ostida={qadam === 1 && !isMentor ? <div className="pt-tmr"><b className={cxx('pt-tmr-s', ortiq > 0 && 'oshdi')}>{mss(vaqt)}</b><span className="pt-tmr-t"><QTugma ikkinchi onClick={qayta}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma></span></div> : qadam === 0 && <div className="pt-tmr">
      <b className={cxx('pt-tmr-s', yur && 'yur', ortiq > 0 && 'oshdi')}>{mss(vaqt)}</b>
      {yur && <span className="pt-tmr-h fade-step">{tr({ uz: 'Hozir siz gapirasiz', ru: 'Сейчас говорите вы' })}</span>}
      <span className="pt-tmr-t">
        {!yur && toxtadi && <QTugma ikkinchi onClick={qayta}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma>}
        {!yur && !toxtadi && <QTugma className="pt-halqa" onClick={boshla}>{tr({ uz: '3 daqiqani boshlash', ru: 'Запустить 3 минуты' })}</QTugma>}
        {yur && <QTugma className="pt-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
      </span>
    </div>} />;
  const mentorT = done ? { uz: "Bo'lak tuzatildi: «Davom etish»ni bosing.", ru: 'Часть исправлена: нажмите «Продолжить».' }
    : qadam === 2 ? (hammaOk ? { uz: "Varaqdagi izohga qarab bitta bo'lakni aniqroq qilib yozing.", ru: 'По замечанию в листе перепишите одну часть точнее.' } : { uz: "✗ olgan bo'lakni varaqdagi izohga qarab qayta yozing.", ru: 'Перепишите часть с ✗ по замечанию в листе.' })
      : qadam === 1 ? (juft ? { uz: "Gap tugagach, dars ochiq turgan qurilmangizni sherigingizga bering — u har bo'lakka ✓ yoki ✗ qo'yadi.", ru: 'Когда закончите, дайте партнёру устройство с открытым уроком — он поставит каждой части ✓ или ✗.' } : { uz: "Har bo'lakka o'zingiz ✓ yoki ✗ qo'ying, keyin «Saqlash»ni bosing.", ru: 'Сами поставьте каждой части ✓ или ✗, потом нажмите «Сохранить».' })
        : yur ? { uz: "Gapiring; pitch tugagach «To'xtatish»ni bosing.", ru: 'Говорите; когда питч закончится, нажмите «Остановить».' }
          : juft ? { uz: "Ilovani telefonda ochib qo'ying, keyin «3 daqiqani boshlash»ni bosib, sherigingizga ayting.", ru: 'Откройте приложение на телефоне, потом нажмите «Запустить 3 минуты» и расскажите партнёру.' }
            : { uz: "Ilovani telefonda ochib qo'ying, keyin «3 daqiqani boshlash»ni bosib, pitchni ovoz chiqarib ayting.", ru: 'Откройте приложение на телефоне, потом нажмите «Запустить 3 минуты» и расскажите питч вслух.' };
  const tahrirForma = ochiq !== null && tahrir && <BolakForma key={'t' + ochiq} i={ochiq} f={tahrir} setF={(v) => { setTahrir(v); setXato(null); }} xato={xato} onSaqla={saqlaTuz} tayyor={tayyorMi(ochiq, tahrir)} maydonlar={MAYDON[ochiq].filter(m => m.j !== 'son')}
    ustida={<span className="pt-forma-h"><b>{tr(BOLAK[ochiq].nom)}</b>{varaq[ochiq].izoh && <em>«{varaq[ochiq].izoh}»</em>}</span>} />;
  const birinchiX = qadam === 2 && ochiq === null && !done ? varaq.findIndex((r, i) => ochiladi(i)) : -1;
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish', ru: 'Работа в парах' }) : tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Bitta bo'lakni tuzating", ru: 'Исправьте одну часть' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={juft ? tr({ uz: <>Pitchingizni sherigingizga <A>3 daqiqada ayta olasizmi?</A></>, ru: <>Сможете рассказать питч партнёру <A>за 3 минуты?</A></> }) : tr({ uz: <>Pitchingizni <A>3 daqiqada ayta olasizmi?</A></>, ru: <>Сможете рассказать питч <A>за 3 минуты?</A></> })}
        mentor={<Mentor>{tr(mentorT)}</Mentor>}
        qadamlar={<span className="pt-bosq">{S11_QADAM.map((s, k) => <span key={k} className={cxx('pt-bosq-c', k === qadam && !done && 'on', (k < qadam || done) && 'ok')}>{k < qadam || done ? <i>✓</i> : <i>{k + 1}</i>}{tr(s)}</span>)}</span>}
        forma={qadam === 0
          ? <div className="pt-s11-1">
            <div className="pt-oldin">
              <span className="pt-oldin-h">{tr({ uz: 'Pitchdan oldin', ru: 'Перед питчем' })}</span>
              {trek !== 'web' && <span>{tr({ uz: <>Mobil trekda: laptopda <code className="qcode">npx expo start</code> ishlab turibdi, ilova telefonda Expo Go'da ochiq.</>, ru: <>В мобильном треке: на ноутбуке работает <code className="qcode">npx expo start</code>, приложение открыто на телефоне в Expo Go.</> })}</span>}
              {trek !== 'mobil' && <span>{tr({ uz: 'Web-trekda: mahsulot telefon brauzerida ochiq.', ru: 'В веб-треке: продукт открыт в браузере телефона.' })}</span>}
              <span>{tr({ uz: 'Ilovani bir marta ochdingiz — birinchi ekran chiqdi.', ru: 'Вы уже открыли приложение один раз — появился первый экран.' })}</span>
            </div>
            <Zoomable>{sahna}</Zoomable>
            {juft && <p className="pt-kul-q">{tr({ uz: 'Avval A gapiradi, B tinglaydi; keyin almashasiz.', ru: 'Сначала говорит A, B слушает; потом меняетесь.' })}</p>}
            <p className="pt-kul-q">{tr({ uz: "Ilova ochilmasa — ekran videosini ko'rsating yoki jonli demo bo'lagini og'zaki aytib bering.", ru: 'Если приложение не открылось — покажите видео экрана или расскажите часть «Живое демо» на словах.' })}</p>
          </div>
          : <div className="pt-s11-2">
            <div className="pt-s11-ch">{tahrirForma || <Zoomable>{sahna}</Zoomable>}</div>
            <div className="pt-s11-on">
              <Varaq varaq={varaq} setQ={setQ} faol={qadam === 1} vaqt={vaqt} tanlov={ochiq} halqaI={birinchiX}
                onBos={qadam === 2 ? (i) => (ochiladi(i) ? och : null) : null} />
              {qadam === 1 && <div className="pt-forma-t">
                {xato && <QXato>{tr(S11_XABAR[xato.k])}</QXato>}
                {xato && !xato.blok && <span className="pt-qoldir">{tr(QOLDIR)}</span>}
                <QTugma className={halqa(varaq.every(r => r.belgi))} onClick={saqlaVaraq}>{tr(SAQLASH)}</QTugma>
              </div>}
              {qadam >= 1 && vaqt > JAMI_VAQT && !done && <QIzoh>{tr({ uz: "Vaqt 3 daqiqadan oshdi — ortiqcha gapni oling, telefonda bitta harakat qoldiring.", ru: 'Время больше 3 минут — уберите лишнее, на телефоне оставьте одно действие.' })}</QIzoh>}
              {done && <QXulosa>{tr({ uz: "Varaq to'ldi va bitta bo'lak tuzatildi. Qolgan ✗ bo'laklar — uyga vazifada.", ru: 'Лист заполнен, и одна часть исправлена. Остальные части с ✗ — в домашнем задании.' })}</QXulosa>}
            </div>
          </div>}
      >
        <MentorSanoq zonalar={[PRACTICE_BASE + screen, PRACTICE_BASE + 40 + screen]} yorliqlar={[{ uz: 'Pitchni aytganlar', ru: 'Рассказали питч' }, { uz: "3 daqiqaga sig'ganlar", ru: 'Уложились в 3 минуты' }, { uz: "Bo'lak tuzatganlar", ru: 'Исправили часть' }]} hisob={([a, b]) => [a.length, a.filter(x => x.picked === 1).length, b.length]} />
        <MentorNote>{tr({ uz: "Taymerni sinf bo'ylab bir vaqtda boshlating: avval hamma A, keyin hamma B (2 × 3 daqiqa + varaq ≈ 10 daqiqa). Vaqt qolsa — 1–2 ko'ngilli guruh oldida, Mentor rejimida (har biri ≈ 4 daqiqa; 90 daqiqa hisobida yo'q): proyektorda katta taymer, guruh har bo'lakka qo'l ko'tarib ✓ yoki ✗ beradi, Mentor varaqni ekranda to'ldiradi. Tinglovchi bo'lak haqida yozadi, odam haqida emas (qattiq, lekin hurmatli fidbek — 10-Modulda o'tilgan). Pitch shu ko'rinishda Demo Day 7 ga boradi — o'quvchiga va'da qilib aytilmaydi.", ru: 'Запускайте таймер по всему классу одновременно: сначала все A, потом все B (2 × 3 минуты + лист ≈ 10 минут). Если останется время — 1–2 добровольца перед группой в режиме ментора (каждый ≈ 4 минуты; в 90 минут не входит): на проекторе большой таймер, группа поднятием руки ставит каждой части ✓ или ✗, ментор заполняет лист на экране. Слушатель пишет о части, а не о человеке (жёсткий, но уважительный фидбек — проходили в 10-м модуле). В таком виде питч пойдёт на Demo Day 7 — ученику это не обещается.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; ✔ A, INLINE_KEYS.s12 = 0; ikkinchi olam — kitob almashish ilovasi, P-002) =====
const SonViz = () => (
  <div className="pt-yv"><BolakKarta i={2} holat="ok" ixcham qatorlar={[{ k: 'd', t: tr({ uz: "Database'da: 12 ta kitob · ichida 5 ta tekshiruv", ru: 'В Database: 12 книг · из них 5 проверочных' }) }]} /></div>
);
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Kitob ilovangiz Database'ida 12 ta kitob; 5 tasi — tekshiruv yozuvingiz. Nima deysiz?"
    question={tr({ uz: <h2 className="title h-ask">Kitob ilovangiz Database'ida 12 ta kitob; 5 tasi — tekshiruv yozuvingiz. <A>Nima deysiz?</A></h2>, ru: <h2 className="title h-ask">В Database вашего книжного приложения 12 книг; 5 из них — ваши проверочные записи. <A>Что скажете?</A></h2> })}
    options={[
      { uz: "«12 ta kitob bor, 5 tasini o'zim qo'shganman»", ru: '«Есть 12 книг, 5 из них добавил я сам»' },
      { uz: "«Ilovamga hozircha 12 ta kitob qo'shilib bo'ldi»", ru: '«В моё приложение уже добавлено 12 книг»' },
      { uz: "«Ilovamga 12 ta o'quvchi o'z kitobini qo'shgan»", ru: '«12 учеников добавили в моё приложение свои книги»' },
      { uz: "«Ilovamga allaqachon juda ko'p kitob qo'shildi»", ru: '«В моё приложение уже добавили очень много книг»' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Son va unga nima kirgani birga aytildi — zal xulosani o\'zi chiqaradi.', ru: 'Число и то, что в него входит, сказаны вместе — зал сам сделает вывод.' }}
    explainWrong={{
      1: { uz: 'Son rost, lekin ichida tekshiruvlaringiz ham bor.', ru: 'Число верное, но внутри есть и ваши проверки.' },
      2: { uz: "SQL kitoblarni sanadi, o'quvchilarni emas.", ru: 'SQL посчитал книги, а не учеников.' },
      3: { uz: 'Zal aniq sonni eshitmadi.', ru: 'Зал не услышал точного числа.' },
      default: { uz: 'Son va unga nima kirganini birga ayting.', ru: 'Назовите число и то, что в него входит, вместе.' }
    }}
    vizual={<SonViz />} />
);

// ===== 🏅 NISHONLAR (4) — ish qilingan ekranlarda (S-034: tekin bonus yo'q; 2, 4, 8-ekran nishonsiz). 9-ekran — birinchi urinish; 10, 11 — ish bajarilgani (data.nishon) =====
const ACHIEVEMENTS = {
  honestCount: { icon: '🔢', name: 'Honest Count!', desc: { uz: "Database'dan son olib, unga nimalar kirganini aniqladingiz", ru: 'Вы взяли число из Database и выяснили, что в него входит' } },
  fourParts: { icon: '🧩', name: 'Four Parts!', desc: { uz: "Pitchingizni to'rt bo'lakka yozdingiz", ru: 'Вы записали свой питч в четыре части' } },
  threeMinutes: { icon: '⏱️', name: 'Three Minutes!', desc: { uz: 'Pitchingizni 3 daqiqada aytib, baholatdingiz', ru: 'Вы рассказали питч за 3 минуты и получили оценку' } },
  fixedIt: { icon: '🛠️', name: 'Fixed It!', desc: { uz: "Varaqdagi izohdan keyin bo'lakni qayta yozdingiz", ru: 'После замечания в листе вы переписали часть' } }
};
// Ekran id → nishon (birinchi urinish sharti bilan; NishonQatori shu ro'yxatdan): faqat 9-ekran
const ACH_TRIGGERS = { s9: 'honestCount' };

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


// Podium savol yorliqlari (kalitlar = SCORED_IDX: 3, 5, 7, 12 — q22)
const Q_LABELS = {
  3: { uz: "1 — Qaysi bo'lak", ru: '1 — Какая часть' },
  5: { uz: '2 — Ish bilan dalil', ru: '2 — Довод делом' },
  7: { uz: '3 — Bir gapda yechim', ru: '3 — Решение одной фразой' },
  12: { uz: '4 — Songa nima kirgan', ru: '4 — Что входит в число' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning o'z so'zlari (R-008: {uz, ru}; emojisiz, «Frontend/Backend» yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'pitch', ru: 'питч' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'zal', ru: 'зал' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'muammo', ru: 'проблема' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'dalil', ru: 'довод' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'yechim', ru: 'решение' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'telefon', ru: 'телефон' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'taymer', ru: 'таймер' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'son', ru: 'число' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'varaq', ru: 'лист' }, l: 56, t: 52, s: 22, d: 22, dl: 3.3 },
  { ch: { uz: "bo'lak", ru: 'часть' }, l: 36, t: 62, s: 22, d: 24, dl: 2.6 },
];
// ⚡ Mustahkamlash-jang — 12 savol (MD aynan), to'g'ri javob o'rni: A 1·6·11 · B 2·7·10 · C 3·5·12 · D 4·8·9 (har biri 3 marta)
const QUIZ_BANK = [
  { q: { uz: "Zal «Ishlayotganini ko'rsata olasizmi?» deb so'radi. Nima qilasiz?", ru: 'Зал спросил: «Можете показать, что это работает?» Что сделаете?' }, opts: [{ uz: "Telefonda asosiy harakatni ko'rsatasiz", ru: 'Покажете главное действие на телефоне' }, { uz: 'Mahsulot nima qilishini bir gapda aytasiz', ru: 'Одной фразой скажете, что делает продукт' }, { uz: 'Intervyudagi sanoqni tartib bilan aytasiz', ru: 'По порядку назовёте подсчёт из интервью' }, { uz: 'Rejangizdagi birinchi ishni aytib berasiz', ru: 'Расскажете первое дело из плана' }], correct: 0 },
  { q: { uz: "Muammo gapidan keyin zal «Qayerdan bilasiz?» dedi. Nima aytasiz?", ru: 'После фразы о проблеме зал спросил: «Откуда знаете?» Что скажете?' }, opts: [{ uz: 'Ilova qaysi texnologiyalarda qurilganini', ru: 'На каких технологиях построено приложение' }, { uz: "Necha kishidan nechtasida muammo bo'lganini", ru: 'У скольких из скольких была проблема' }, { uz: 'Ilovada nechta ekran va nechta tugma borligini', ru: 'Сколько в приложении экранов и кнопок' }, { uz: 'Keyingi oyda qaysi ishni qilmoqchi ekaningizni', ru: 'Что собираетесь делать в следующем месяце' }], correct: 1 },
  { q: { uz: "Harakat belgisi nimani ko'rsatadi?", ru: 'Что показывает знак действия?' }, opts: [{ uz: 'Odam intervyuda uzoq va qiziqib gapirganini', ru: 'Что человек долго и увлечённо говорил на интервью' }, { uz: "Odam g'oyani juda maqtab, yaxshi baho berganini", ru: 'Что человек очень хвалил идею и хорошо её оценил' }, { uz: "Odam qiziqishni ish bilan ko'rsatganini", ru: 'Что человек показал интерес делом' }, { uz: 'Odam ilovani do\'stlariga aytib berishini', ru: 'Что человек расскажет о приложении друзьям' }], correct: 2 },
  { q: { uz: "«10 intervyu — kichik son» degan gap nimani aytadi?", ru: 'О чём говорит фраза «10 интервью — маленькое число»?' }, opts: [{ uz: 'Intervyular foydasiz, ularni tashlash kerak', ru: 'Интервью бесполезны, их надо бросить' }, { uz: "Yuzta intervyusiz g'oyani tanlab bo'lmaydi", ru: 'Без ста интервью идею не выбрать' }, { uz: "To'garaklar g'oyasi yaxshiroq ekanini", ru: 'Что идея с кружками лучше' }, { uz: 'Bu tanlov uchun dalil, isbot emasligini', ru: 'Что это довод для выбора, а не доказательство' }], correct: 3 },
  { q: { uz: "Stiv Jobs iPhone'ni qaysi uch qurilma bittada deb taqdim etgan?", ru: 'Какими тремя устройствами в одном Стив Джобс представил iPhone?' }, opts: [{ uz: 'Kamera, telefon va soat', ru: 'Камера, телефон и часы' }, { uz: 'Klaviatura, stilus va telefon', ru: 'Клавиатура, стилус и телефон' }, { uz: 'iPod, telefon va internet', ru: 'iPod, телефон и интернет' }, { uz: 'iPod, radio va kompyuter', ru: 'iPod, радио и компьютер' }], correct: 2 },
  { q: { uz: "Apple iPhone'da nimani qoldirgan?", ru: 'Что Apple оставила в iPhone?' }, opts: [{ uz: 'Bitta ekran va Home tugmasini', ru: 'Один экран и кнопку Home' }, { uz: 'Klaviatura va stilus qalamini', ru: 'Клавиатуру и стилус' }, { uz: "Ko'p tugma va to'liq klaviaturani", ru: 'Много кнопок и полную клавиатуру' }, { uz: 'Stilus va ikkita katta ekranni', ru: 'Стилус и два больших экрана' }], correct: 0 },
  { q: { uz: 'Yechim bo\'lagida zalga nima aytiladi?', ru: 'Что говорят залу в части «Решение»?' }, opts: [{ uz: "Ilova qurilgan texnologiyalarning ro'yxati", ru: 'Список технологий, на которых построено приложение' }, { uz: 'Mahsulot odamga nima qilishi, bir gapda', ru: 'Что продукт делает для человека, одной фразой' }, { uz: 'Ilovadagi hamma ekranlarning to\'liq nomlari', ru: 'Полные названия всех экранов приложения' }, { uz: 'Mahsulotni qurishga ketgan haftalar soni', ru: 'Сколько недель ушло на продукт' }], correct: 1 },
  { q: { uz: 'Nega ilovani pitchdan 2–3 daqiqa oldin ochasiz?', ru: 'Зачем открывать приложение за 2–3 минуты до питча?' }, opts: [{ uz: "Telefon ekrani yorqinroq bo'lishi uchun", ru: 'Чтобы экран телефона был ярче' }, { uz: "Zal ilovani oldindan ko'rib turishi uchun", ru: 'Чтобы зал заранее видел приложение' }, { uz: 'Ilova yangi versiyani yuklab olishi uchun', ru: 'Чтобы приложение скачало новую версию' }, { uz: "Uxlab qolgan Backend uyg'onishi uchun", ru: 'Чтобы уснувший Backend проснулся' }], correct: 3 },
  { q: { uz: "Jonli demoda qaysi harakatni ko'rsatasiz?", ru: 'Какое действие покажете в живом демо?' }, opts: [{ uz: 'Ilovadagi hamma tugmalarni birma-bir', ru: 'Все кнопки приложения по очереди' }, { uz: 'Kod yozilgan fayllarni birma-bir', ru: 'Файлы с кодом по очереди' }, { uz: 'Ilovaning sozlamalar sahifasini', ru: 'Страницу настроек приложения' }, { uz: 'Sinov vazifasidagi asosiy harakatni', ru: 'Главное действие из задания теста' }], correct: 3 },
  { q: { uz: "Keyingi qadam bo'lagiga nima yoziladi?", ru: 'Что пишут в часть «Следующий шаг»?' }, opts: [{ uz: "Keyinroq qilinadigan hamma ishlar ro'yxati", ru: 'Список всех дел на потом' }, { uz: 'Tuzatilgan rejangizdagi birinchi ish', ru: 'Первое дело из исправленного плана' }, { uz: "Sinovda topilgan hamma to'xtashlar", ru: 'Все остановки, найденные на тесте' }, { uz: 'Ilova qanday qurilgani haqida hikoya', ru: 'Рассказ о том, как построено приложение' }], correct: 1 },
  { q: { uz: "Varaqda «Jonli demo» qatoriga ✗ va «uzoq kutdik» yozildi. Nima qilasiz?", ru: 'В листе в строке «Живое демо» стоит ✗ и «долго ждали». Что сделаете?' }, opts: [{ uz: 'Keyingi safar ilovani oldindan ochasiz', ru: 'В следующий раз откроете приложение заранее' }, { uz: "Jonli demo bo'lagini pitchdan olasiz", ru: 'Уберёте живое демо из питча' }, { uz: 'Kutish paytida zalga hazil aytib berasiz', ru: 'Пока ждёте, расскажете залу шутку' }, { uz: "Sherigingizdan ✓ qo'yishini so'raysiz", ru: 'Попросите партнёра поставить ✓' }], correct: 0 },
  { q: { uz: 'Pitch 3:40 davom etdi. Nima qilasiz?', ru: 'Питч длился 3:40. Что сделаете?' }, opts: [{ uz: 'Taymerni o\'chirib, vaqtni umuman sanamaysiz', ru: 'Выключите таймер и вообще не будете считать время' }, { uz: "Muammo bo'lagini pitchdan butunlay olib tashlaysiz", ru: 'Полностью уберёте из питча часть «Проблема»' }, { uz: 'Ortiqcha gapni olib, bitta harakat qoldirasiz', ru: 'Уберёте лишнее и оставите одно действие' }, { uz: "Oxirgi bo'lakni ancha tezroq gapirib berasiz", ru: 'Последнюю часть проговорите гораздо быстрее' }], correct: 2 },
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

// 🃏 KARTOCHKALAR — MD 14-ekran jadvali aynan (12 ta); mexanika va ko'rinish — qolipda QKartochka (DE-204)
const KARTOCHKALAR = [
  { front: { uz: 'Uch daqiqalik pitch qaysi to\'rt bo\'lakdan iborat?', ru: 'Из каких четырёх частей состоит трёхминутный питч?' }, back: { uz: 'Muammo, yechim, jonli demo va keyingi qadam', ru: 'Проблема, решение, живое демо и следующий шаг' } },
  { front: { uz: "Muammo bo'lagida muammo gapi yonida nima turadi?", ru: 'Что стоит рядом с фразой о проблеме в части «Проблема»?' }, back: { uz: "Dalil: necha kishida bo'lgani va harakat belgisi", ru: 'Довод: у скольких людей она была и знак действия' } },
  { front: { uz: "Harakat belgisi nimani ko'rsatadi?", ru: 'Что показывает знак действия?' }, back: { uz: "Odam qiziqishni so'z bilan emas, ish bilan ko'rsatganini — masalan, sinovga kun belgilagani", ru: 'Что человек показал интерес не словом, а делом — например, назначил день теста' } },
  { front: { uz: "10 intervyu natijasi isbot bo'ladimi?", ru: 'Результат 10 интервью — это доказательство?' }, back: { uz: "Yo'q: 10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas", ru: 'Нет: 10 интервью — маленькое число; это довод для выбора, а не доказательство' } },
  { front: { uz: "Yechim bo'lagida nima aytiladi?", ru: 'Что говорят в части «Решение»?' }, back: { uz: 'Mahsulot odamga nima qilishi — bir gapda', ru: 'Что продукт делает для человека — одной фразой' } },
  { front: { uz: "Stiv Jobs iPhone'ni qanday taqdim etgan?", ru: 'Как Стив Джобс представил iPhone?' }, back: { uz: '«Uch qurilma bittada»: iPod, telefon va internet', ru: '«Три устройства в одном»: iPod, телефон и интернет' } },
  { front: { uz: "Apple iPhone'dan nimalarni olib tashlagan?", ru: 'Что Apple убрала из iPhone?' }, back: { uz: 'Klaviatura, stilus va deyarli hamma tugmani: bitta ekran va Home tugmasi qolgan', ru: 'Клавиатуру, стилус и почти все кнопки: остались один экран и кнопка Home' } },
  { front: { uz: "Jonli demo bo'lagida nima qilinadi?", ru: 'Что делают в части «Живое демо»?' }, back: { uz: "Ilova zal oldida telefonda ishlatib ko'rsatiladi — bitta asosiy harakat", ru: 'Приложение показывают перед залом на телефоне — одно главное действие' } },
  { front: { uz: 'Nega ilovani pitchdan oldin bir marta ochasiz?', ru: 'Зачем открывать приложение один раз до питча?' }, back: { uz: "Bepul Backend uxlab qolgan bo'lsa, birinchi ochilish bir daqiqagacha kutadi", ru: 'Если бесплатный Backend уснул, первое открытие ждёт до минуты' } },
  { front: { uz: "Database'dagi songa nimalar kiradi?", ru: 'Что входит в число из Database?' }, back: { uz: "Namuna va o'z tekshiruv yozuvlaringiz ham — pitchda shuni aytasiz", ru: 'И образцы, и ваши проверочные записи — об этом и скажете в питче' } },
  { front: { uz: "Keyingi qadam bo'lagiga nima yoziladi?", ru: 'Что пишут в часть «Следующий шаг»?' }, back: { uz: 'Tuzatilgan rejangizdagi birinchi ish', ru: 'Первое дело из исправленного плана' } },
  { front: { uz: "Baholash varag'ida har bo'lak uchun nima bor?", ru: 'Что есть в листе оценки для каждой части?' }, back: { uz: "Zalning bitta savoli — sherik ✓ yoki ✗ qo'yadi va izoh yozadi", ru: 'Один вопрос зала — партнёр ставит ✓ или ✗ и пишет замечание' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q; birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */}
        <div className={cxx('pt-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="pt-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + raqamli qadamlar; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: "oila a'zosi yoki do'stingiz", ru: 'член семьи или друг' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '1 repetitsiya', ru: '1 репетиция' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Pitchni bir kishiga 3 daqiqada, taymer bilan, ilovani telefonda ko'rsatib ayting.", ru: 'Расскажите питч одному человеку за 3 минуты, с таймером, показывая приложение на телефоне.' },
  { uz: "Undan varaqdagi to'rt savolni so'rang va qolgan ✗ bo'laklarni tuzating.", ru: 'Задайте ему четыре вопроса из листа и исправьте оставшиеся части с ✗.' },
  { uz: "Ilovangizni ishlatayotgan qisqa ekran videosini yozib qo'ying — jonli ko'rsatish ishlamasa, shuni ko'rsatasiz.", ru: 'Запишите короткое видео экрана, где вы пользуетесь приложением, — если живой показ не сработает, покажете его.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card pt-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="pt-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="pt-hw-q"><span className="pt-hw-k">{tr(r.k)}</span><span className="pt-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="pt-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{tr(q)}</span></li>)}</ol>
    <span className="pt-kul-t">{tr({ uz: "Tinglovchi topilmasa — pitchni telefonga yozib oling va varaqni o'zingiz to'ldiring.", ru: 'Если слушателя не нашлось — запишите питч на телефон и заполните лист сами.' })}</span>
    {keyingi && <span className="pt-hw-keyingi">{keyingi}</span>}
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
    { uz: "Muammo bo'lagida sanoq va harakat belgisi turadi; 10 intervyu — dalil, isbot emas.", ru: 'В части «Проблема» стоят подсчёт и знак действия; 10 интервью — довод, а не доказательство.' },
    { uz: 'Yechimni bir gapda aytasiz: mahsulot odamga nima qiladi.', ru: 'Решение вы говорите одной фразой: что продукт делает для человека.' },
    { uz: "Ilovani pitchdan oldin ochib qo'yasiz va telefonda bitta asosiy harakatni ko'rsatasiz.", ru: 'Вы заранее открываете приложение и показываете на телефоне одно главное действие.' },
    { uz: "Database'dagi sonni aytganda, unga nimalar kirganini ham aytasiz.", ru: 'Называя число из Database, вы говорите и о том, что в него входит.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Demo Day 7»</b></>, ru: <>Следующий урок — <b>«Demo Day 7»</b></> });
  const baholandi = !!(answers[11] && answers[11].solved);
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={baholandi || isMentorL
          ? tr({ uz: <>3 daqiqalik pitchingiz <A>tayyor va baholandi</A>.</>, ru: <>Ваш питч на 3 минуты <A>готов и оценён</A>.</> })
          : tr({ uz: <>Pitchingiz <A>to'rt bo'lakka</A> yozildi.</>, ru: <>Ваш питч записан <A>в четыре части</A>.</> })}
        cta={<>
          <div className="pt-fikr fade-up d1"><span className="pt-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><p className="pt-fikr-t small">{tr({ uz: "Uch daqiqada zal muammoni dalil bilan eshitadi, yechimni bir gapda tushunadi va ilovani telefonda ko'radi.", ru: 'За три минуты зал слышит проблему с доводом, понимает решение одной фразой и видит приложение на телефоне.' })}</p></div>
          {!isMentorL && <PitchimStrip />}
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
export default function PmPrototypePitchLesson({ lang: langProp, onFinished, liveToken }) {
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
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]);
    if (data && Array.isArray(data.nishon)) data.nishon.forEach(id => earn(id)); // 10, 11-ekran: ish bajarilgani (S-034 — tekin emas) //  nishon (faqat SCORED test — REAL solve)
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
        /* === 11-Modul 16-dars — darsning o'z vizuali (prefiks pt-). Faqat qolip tokenlari (D3); brend ranglari — faqat nomlarda: «Maydon Jamoa» #2E9E4F (tayanch 9.62), iPhone · Nokia · BlackBerry (9.97) === */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .pt-jamoa { color: #2E9E4F; font-weight: 800; font-style: normal; }
        .pt-brend { font-weight: 800; font-style: normal; } .pt-brend.iphone { color: #3A3A3C; } .pt-brend.nokia { color: #124191; } .pt-brend.bb { color: #111111; }
        .pt-kul-t { font-size: 12.5px; color: ${T.ink2}; line-height: 1.45; }
        p.pt-kul-q { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        /* Navbatdagi harakat halqasi (SABOQ 32, To'lqin B 10): kattalashish 3% gacha, shaffoflik 0.35 gacha, sikl 2.4 s, 3 marta; guruhda bitta; kam harakatda — statik */
        .pt-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .pt-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pt-tolqin 2.4s ease-in-out 0.4s 3; }
        .pt-guruh { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .pt-guruh::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pt-tolqin 2.4s ease-in-out 0.5s 3; }
        .pt-halqa-i { border-color: ${T.accent} !important; animation: pt-tolqin-i 2.4s ease-in-out 0.4s 3; }
        .stage-nav .btn-white-accent:not(:disabled) { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .stage-nav .btn-white-accent:not(:disabled)::after { content: ''; position: absolute; inset: -5px; border-radius: 15px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pt-tolqin 2.4s ease-in-out 0.5s 3; }
        .lesson-root:has(.pt-flash.yangi) .stage-nav .btn-white-accent { outline: none; }
        .lesson-root:has(.pt-flash.yangi) .stage-nav .btn-white-accent::after { display: none; }
        .q-kirish:has(.pt-s0.kutish) .q-variantlar-kol, .pt-s0.kutish .q-variantlar-kol { position: relative; border-radius: 14px; outline: 2px solid ${T.accent}; outline-offset: 5px; }
        .pt-s0.kutish .q-variantlar-kol::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pt-tolqin 2.4s ease-in-out 1s 3; }
        @keyframes pt-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes pt-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.35)}; } }
        @keyframes pt-kir { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes pt-yigil { from { opacity: 0.3; transform: scaleY(1.5); } to { opacity: 1; transform: none; } }
        @keyframes pt-pop { 0% { transform: scale(1); } 40% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes pt-yashil { 0% { background: ${T.okFon}; } 70% { background: ${T.okFon}; } 100% { background: ${T.paper}; } }
        @keyframes pt-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        @keyframes pt-tap { from { transform: translate(-50%, -50%) scale(0.3); opacity: 0.7; } to { transform: translate(-50%, -50%) scale(2.4); opacity: 0; } }
        @keyframes pt-chiz { from { width: 0; } to { width: 100%; } }
        @keyframes pt-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        /* Bashorat: karta kirishda yengil ko'tariladi, variantlar navbat bilan; guruhda bitta halqa; tanlangach ixcham qator */
        .pt-bash .q-bashorat { animation: pt-kir 0.45s ease-out both; }
        .pt-bash .q-chip { animation: pt-kir 0.35s ease-out both; }
        .pt-bash .q-chip:nth-child(2) { animation-delay: 0.09s; } .pt-bash .q-chip:nth-child(3) { animation-delay: 0.18s; }
        .pt-bash .q-variantlar { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .pt-bash .q-variantlar::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pt-tolqin 2.4s ease-in-out 0.6s 3; }
        .pt-bashq { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 9px 14px; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; transform-origin: top; animation: pt-yigil 0.4s ease-out both; }
        .pt-bashq-t { white-space: nowrap; } .pt-bashq-t b { color: ${T.accent}; }
        .pt-tx { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .pt-tx.ok { color: ${T.ok}; } .pt-tx b { color: ${T.ok}; } .pt-tx b.yoq { color: ${T.err}; }
        /* Qadamlar qatori (SABOQ 34): bajarilgani ✓, joriysi katta halqali tugma, keyingilari kulrang */
        .pt-qq { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; }
        .pt-qq-ok, .pt-qq-kut { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; padding: 7px 11px; border-radius: 10px; }
        .pt-qq-ok { color: ${T.ok}; background: ${T.okFon}; } .pt-qq-ok i { font-style: normal; }
        .pt-qq-kut { color: ${T.ink2}; background: ${T.paper}; border: 1px dashed ${T.line}; opacity: 0.8; }
        .pt-qq-kut i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .pt-qq-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; margin-right: 2px; }
        .pt-test-viz { display: flex; flex-direction: column; }
        p.pt-nishon { margin: 0; font-size: 12px; color: ${T.ink2}; } p.pt-nishon.ketdi { opacity: 0.75; }
        .pt-mnote-c { align-self: flex-end; }
        .pt-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .pt-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .pt-mstat { display: flex; flex-wrap: wrap; gap: 10px; }
        .pt-mstat-q { display: flex; align-items: baseline; gap: 8px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 8px 14px; }
        .pt-mstat-q b { font-family: 'JetBrains Mono', monospace; font-size: 20px; color: ${T.accent}; }
        .pt-mstat-q span { font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .pt-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pt-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 28px; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .pt-ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .pt-ovoz-y { height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .pt-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.6s ease-out; }
        .pt-ovoz-q b { font-family: 'JetBrains Mono', monospace; text-align: right; color: ${T.ink}; }
        /* === SAHNA: chapda telefon, o'ngda zal · to'rt bo'lak · taymer === */
        .pt-sahna { display: grid; grid-template-columns: 172px minmax(0,1fr); gap: 20px; align-items: start; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
        .pt-sahna.teltsiz { grid-template-columns: minmax(0,1fr); }
        .pt-sahna-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pt-bolaklar { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; align-items: stretch; }
        .q-kirish .pt-sahna, .q-reja .pt-sahna { grid-template-columns: 172px minmax(0,1fr); gap: 14px; padding: 12px; }
        .q-kirish .pt-bolaklar, .pt-reja-sahna .pt-bolaklar { grid-template-columns: minmax(0,1fr); gap: 6px; }
        /* Telefon 172×272 (SABOQ 22) */
        .pt-tel-ust { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .pt-tel-yor { position: absolute; top: -4px; left: 50%; transform: translate(-50%, -100%); white-space: nowrap; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 8px; }
        .pt-tel { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 4px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .pt-tel-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; }
        .pt-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: #2E9E4F; letter-spacing: 0.01em; }
        .pt-tel-sar { font-weight: 800; font-size: 13px; color: ${T.ink}; flex: none; }
        .pt-sahna-tel { display: flex; justify-content: center; padding-top: 4px; }
        .pt-royxat { gap: 3px; } .pt-oyin { gap: 2px; }
        .pt-oyin-k2 { font-size: 11px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pt-s11-sahna .pt-bl-q.kichik { -webkit-line-clamp: 1; }
        .pt-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 3px; animation: pt-ekran 0.35s ease-out both; }
        .pt-kun { font-size: 11px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink2}; margin-top: 2px; border-radius: 5px; padding: 0 3px; width: fit-content; transition: background 0.3s, color 0.3s; }
        .pt-kun.ajrat { color: ${T.accent}; background: ${T.accentSoft}; outline: 2px solid ${T.accent}; outline-offset: 1px; }
        .pt-oyin-k { position: relative; display: flex; flex-direction: column; gap: 1px; padding: 4px 7px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11px; line-height: 1.25; color: ${T.ink2}; animation: pt-kir 0.4s ease-out var(--d, 0s) both; transition: border-color 0.3s, box-shadow 0.3s; }
        .pt-oyin-k1 { display: flex; justify-content: space-between; gap: 4px; } .pt-oyin-k1 b { font-size: 11.5px; color: ${T.ink}; }
        .pt-oyin-son { font-family: 'JetBrains Mono', monospace; font-size: 11px !important; }
        .pt-oyin-k.ajrat { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.18)}; }
        .pt-tap { position: absolute; left: 50%; top: 50%; width: 22px; height: 22px; border-radius: 50%; background: ${fon(T.accent, 0.4)}; transform: translate(-50%, -50%); pointer-events: none; animation: pt-tap 0.7s ease-out both; }
        .pt-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pt-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .pt-oyin-joy { font-size: 12px; color: ${T.ink2}; }
        .pt-son { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 800; color: ${T.ink}; margin: 6px 0 2px; }
        .pt-son.yangi { color: #2E9E4F; animation: pt-pop 0.5s ease-out; }
        .pt-doiralar { display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 8px; }
        .pt-doiralar i { width: 12px; height: 12px; border-radius: 50%; border: 1.5px dashed ${T.line}; }
        .pt-doiralar i.bor { border: none; background: ${fon(T.ink, 0.25)}; } .pt-doiralar i.yangi { background: #2E9E4F; animation: pt-pop 0.5s ease-out; }
        .pt-tel-btn { position: relative; margin-top: auto; text-align: center; font-size: 12.5px; font-weight: 800; color: #fff; background: #2E9E4F; border-radius: 10px; padding: 8px 6px; }
        .pt-tel-btn.off { background: ${T.line}; color: ${T.ink2}; }
        .pt-kut { align-items: center; justify-content: center; gap: 10px; text-align: center; }
        .pt-kut-t { font-size: 12px; font-weight: 600; color: ${T.ink2}; line-height: 1.4; padding: 0 4px; }
        .pt-kut-ch { width: 80%; height: 4px; border-radius: 2px; background: ${T.line}; overflow: hidden; }
        .pt-kut-ch i { display: block; height: 100%; width: 0; background: #2E9E4F; }
        .pt-kut-ch i.yur { animation: pt-chiz 2.1s linear both; }
        /* Zal */
        .pt-zal { display: flex; align-items: center; gap: 12px; min-height: 46px; }
        .pt-zal-b { display: flex; gap: 2px; flex: none; }
        .pt-tom { width: 34px; height: 40px; }
        .pt-tom-b, .pt-tom-k { transition: transform 0.6s cubic-bezier(.3,.8,.3,1); transform-box: fill-box; transform-origin: 50% 90%; }
        .pt-zal.bur .pt-tom-b { transform: rotate(-9deg); } .pt-zal.bur .pt-tom-k { transform: translateX(-2px); }
        .pt-pf { position: relative; max-width: 100%; font-size: 13px; font-weight: 700; line-height: 1.35; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 6px 11px; animation: pt-kir 0.35s ease-out both; }
        .pt-pf::before { content: ''; position: absolute; left: -7px; top: 50%; width: 10px; height: 10px; background: inherit; border-left: 1.5px solid ${T.line}; border-bottom: 1.5px solid ${T.line}; transform: translateY(-50%) rotate(45deg); }
        .pt-pf.savol { font-size: 16px; font-weight: 800; color: ${T.ink2}; padding: 3px 12px; }
        .pt-pf.ok { color: #fff; background: ${T.ok}; border-color: ${T.ok}; font-size: 15px; padding: 3px 11px; animation: pt-pop 0.45s ease-out; }
        .pt-pf.ok::before { border-color: ${T.ok}; }
        /* Bo'lak kartasi — rangli yon chiziq yo'q (SABOQ 7) */
        .pt-bl { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 8px 10px 9px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: border-color 0.3s, box-shadow 0.3s; animation: pt-kir 0.4s ease-out calc(var(--i, 0) * 0.08s) both; }
        .pt-bl.h-bosh { border-style: dashed; background: ${T.bg}; }
        .pt-bl.h-joriy { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.12)}; }
        .pt-bl.h-yoz { animation: pt-kir 0.4s ease-out both, pt-yashil 1.2s ease-out 0.2s both; border-color: ${fon(T.ok, 0.5)}; }
        .pt-bl.h-ok, .pt-bl.h-tuz { border-color: ${fon(T.ok, 0.45)}; }
        .pt-bl.h-err { border-color: ${T.err}; box-shadow: 0 0 0 3px ${fon(T.err, 0.1)}; }
        .pt-bl-h { display: flex; align-items: center; gap: 6px; min-height: 20px; }
        .pt-bl-n { flex: none; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: ${T.ink2}; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .pt-bl-n.ok { color: ${T.ok}; border-color: ${fon(T.ok, 0.5)}; }
        .pt-bl-nom { font-size: 13px; font-weight: 800; color: ${T.ink}; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; animation: pt-kir 0.35s ease-out both; }
        .pt-bl-ok { margin-left: auto; font-style: normal; font-weight: 800; color: #fff; background: ${T.ok}; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; animation: pt-pop 0.45s ease-out; }
        .pt-bl-ed { margin-left: 4px; width: 24px; height: 24px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; font-size: 12px; flex: none; }
        .pt-bl-ed:hover { color: ${T.accent}; border-color: ${T.accent}; }
        .pt-bl-tuz { align-self: flex-start; font-size: 11px; font-weight: 800; color: ${T.ok}; background: ${T.okFon}; border-radius: 6px; padding: 1px 7px; }
        .pt-bl-q { font-size: 12.5px; line-height: 1.4; color: ${T.ink}; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
        .pt-bl-q.kichik { font-size: 12px; color: ${T.ink2}; -webkit-line-clamp: 2; }
        .pt-bl-q.yangi { animation: pt-kir 0.45s ease-out both, pt-yashil 1.2s ease-out 0.2s both; border-radius: 6px; }
        .pt-bl-y { display: inline-block; margin-left: 6px; font-style: normal; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 6px; padding: 0 6px; vertical-align: 1px; }
        .pt-bl-bo { height: 10px; border-radius: 5px; border: 1.5px dashed ${T.line}; }
        .pt-bl.ixcham .pt-bl-q { -webkit-line-clamp: 2; }
        .pt-bl.katta { padding: 14px 16px; gap: 8px; }
        .pt-bl.katta .pt-bl-nom { font-size: 15px; } .pt-bl.katta .pt-bl-q { font-size: 14px; -webkit-line-clamp: unset; display: block; }
        .pt-bl.katta .pt-bl-bo { height: 22px; }
        .zoom-on .pt-bl-q { -webkit-line-clamp: unset; display: block; }
        .pt-demo-q { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; }
        .pt-demo-q span { background: ${T.bg}; border-radius: 6px; padding: 1px 6px; } .pt-demo-q i { font-style: normal; color: ${T.ink2}; } .pt-demo-q b { color: #2E9E4F; font-family: 'JetBrains Mono', monospace; }
        /* Taymer chizig'i */
        .pt-tm { display: flex; flex-direction: column; gap: 3px; }
        .pt-tm-ch { display: flex; height: 12px; gap: 0; }
        .pt-tm-asosiy { display: flex; gap: 3px; min-width: 0; }
        .pt-tm-k { position: relative; height: 12px; border-radius: 4px; background: ${T.bg}; border: 1px dashed ${T.line}; overflow: hidden; min-width: 0; }
        .pt-tm-k i { position: absolute; left: 0; top: 0; bottom: 0; background: ${fon(T.ink, 0.55)}; transition: width 0.8s cubic-bezier(.3,.8,.3,1); }
        .pt-tm-k.toliq { border-style: solid; border-color: transparent; }
        .pt-tm-k.on { border-color: ${T.accent}; } .pt-tm-k.on i { background: ${T.accent}; }
        .pt-tm.kulrang .pt-tm-k i { background: ${T.line}; }
        .pt-tm.flash .pt-tm-k { border-style: solid; background: ${T.accentSoft}; transition: background 0.3s; }
        .pt-tm-ort { height: 12px; margin-left: 3px; border-radius: 4px; background: ${T.err}; animation: pt-kir 0.3s ease-out; }
        .pt-tm-l { display: flex; font-size: 11px; line-height: 1.25; color: ${T.ink2}; }
        .pt-tm-l .pt-tm-asosiy > span { display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
        .pt-tm-l b { font-weight: 800; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .pt-tm-l span.on b { color: ${T.accent}; }
        .pt-tm-l em { font-style: normal; white-space: nowrap; }
        .pt-tm-plus { margin-left: 3px; color: ${T.err}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        .pt-tm-u { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        /* 0-ekran va reja */
        .pt-s0-sahna .pt-sahna-ong { align-self: center; gap: 26px; }
        .pt-s0-sahna .pt-tom { width: 50px; height: 58px; } .pt-s0-sahna .pt-pf.savol { font-size: 22px; padding: 4px 16px; }
        .pt-s0-sahna .pt-tm-ch, .pt-s0-sahna .pt-tm-k { height: 16px; }
        .pt-reja-sahna .pt-bl { padding: 6px 9px; }
        .pt-reja-sahna .pt-bl-q { -webkit-line-clamp: 1; }
        /* 3, 5, 7, 12-ekran: javobdan keyingi kichik karta */
        .pt-mini { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 6px; }
        .pt-mini-b { position: relative; display: flex; flex-direction: column; gap: 3px; align-items: flex-start; padding: 8px 10px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; font-size: 12.5px; }
        .pt-mini-b.on { border-color: ${fon(T.ok, 0.5)}; background: ${T.okFon}; }
        .pt-mini-son { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.ok}; animation: pt-tush 0.6s cubic-bezier(.3,1.3,.5,1) 0.4s both; }
        @keyframes pt-tush { from { opacity: 0; transform: translateY(-26px); } to { opacity: 1; transform: none; } }
        .pt-sozish { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .pt-sozish-u { display: flex; align-items: center; gap: 6px; padding: 9px 12px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; font-size: 13px; animation: pt-kir 0.4s ease-out both; }
        .pt-sozish-u.ish { border-color: ${fon(T.ok, 0.5)}; background: ${T.okFon}; animation-delay: 0.12s; }
        .pt-sozish-u.kul { opacity: 0.6; animation-delay: 0.24s; }
        .pt-sozish-u i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; width: 22px; height: 22px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; background: ${T.bg}; }
        .pt-yv { display: flex; flex-direction: column; }
        .pt-yv mark { background: ${T.okFon}; color: ${T.ok}; font-weight: 700; border-radius: 4px; padding: 0 2px; }
        /* 4-ekran: Muammo bo'lagi + sanoq jadvali */
        .pt-s4-ch { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pt-s4-bl { display: flex; flex-direction: column; gap: 8px; }
        .q-split .pt-s4-jw { flex-grow: 0 !important; }
        .pt-s4-jw { background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
        .pt-jad { display: grid; grid-template-columns: minmax(0,1.3fr) minmax(0,0.9fr) minmax(0,0.9fr); gap: 6px 10px; align-items: center; font-size: 13px; }
        .pt-jad-h { font-size: 11px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink}; } .pt-jad-h.kul { color: ${T.ink2}; }
        .pt-jad-l { color: ${T.ink}; animation: pt-kir 0.35s ease-out calc(var(--i) * 0.08s) both; }
        .pt-jad-a, .pt-jad-b { font-family: 'JetBrains Mono', monospace; font-weight: 700; padding: 5px 8px; border-radius: 8px; background: ${T.bg}; width: fit-content; animation: pt-kir 0.35s ease-out calc(var(--i) * 0.08s + 0.05s) both; }
        .pt-jad-b { color: ${T.ink2}; }
        .pt-jad-a.yon { color: ${T.ok}; background: ${T.okFon}; box-shadow: 0 0 0 2px ${fon(T.ok, 0.35)}; }
        /* 6-ekran: iPhone sahnasi */
        .pt-nuq { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .pt-nuq-l { margin-right: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .pt-nuq i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; } .pt-nuq i.ok { background: ${T.ok}; } .pt-nuq i.cur { background: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .pt-voqea { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .pt-voqea > .zoomable { width: 100%; }
        p.pt-tanish { margin: 0; font-size: 13.5px; color: ${T.ink2}; text-align: center; }
        .pt-voqea-h { font-weight: 800; font-size: clamp(16px,1.8vw,19px); color: ${T.ink}; animation: pt-kir 0.35s ease-out both; }
        .pt-voqea .pt-bash, .pt-voqea .pt-bashq, .pt-voqea p.q-xulosa, .pt-voqea p.pt-kul-q { width: 100%; max-width: 660px; text-align: left; }
        .pt-ip { position: relative; width: 100%; max-width: 340px; margin: 0 auto; background: ${T.bg}; border-radius: 14px; overflow: hidden; }
        .pt-ip-svg { display: block; width: 100%; height: auto; }
        .pt-ip-pol { fill: ${T.line}; }
        .pt-ip-tana { fill: #2A2730; } .pt-ip-tana.iphone { fill: #1F1D24; }
        .pt-ip-ekr { fill: #8FA3B8; } .pt-ip-ekr.katta { fill: #DDE6F0; }
        .pt-ip-tug { fill: #C9CED6; opacity: 0; animation: pt-ip-yon 0.3s ease-out calc(0.3s + var(--i) * 0.07s) both; }
        @keyframes pt-ip-yon { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
        .pt-ip-tug { transform-box: fill-box; transform-origin: center; }
        .pt-ip-stilus rect, .pt-ip-stilus polygon { fill: #B98552; }
        .pt-ip-home { fill: none; stroke: #8C8F99; stroke-width: 2; }
        .pt-ip-yangi { opacity: 0; transition: opacity 0.6s ease 0.9s; }
        .pt-ip-eski { transition: opacity 0.6s ease 0.6s; }
        .pt-ip.b1 .pt-ip-tug, .pt-ip.b2 .pt-ip-tug { animation: pt-ip-son 0.3s ease-in calc(var(--i) * 0.03s) both; }
        @keyframes pt-ip-son { from { opacity: 1; } to { opacity: 0; transform: scale(0.3); } }
        .pt-ip.b1 .pt-ip-stilus, .pt-ip.b2 .pt-ip-stilus { transform: translateY(-140px); opacity: 0; transition: transform 0.7s ease-in 0.2s, opacity 0.5s ease 0.4s; }
        .pt-ip.b1 .pt-ip-eski, .pt-ip.b2 .pt-ip-eski { opacity: 0; }
        .pt-ip.b1 .pt-ip-yangi, .pt-ip.b2 .pt-ip-yangi { opacity: 1; }
        .pt-ip.b2 .pt-ip-yangi { transition: none; }
        .pt-ip-ichi rect { fill: ${fon(T.ink, 0.12)}; opacity: 0; }
        .pt-ip.b2 .pt-ip-ichi .pt-ip-i1 { fill: #E07A5F; animation: pt-ip-kel 0.4s ease-out 1.1s both; } .pt-ip.b2 .pt-ip-ichi .pt-ip-i2 { fill: #2E9E4F; animation: pt-ip-kel 0.4s ease-out 1.6s both; } .pt-ip.b2 .pt-ip-ichi .pt-ip-i3 { fill: #3E7CB1; animation: pt-ip-kel 0.4s ease-out 2.1s both; }
        @keyframes pt-ip-kel { from { opacity: 0; } to { opacity: 1; } }
        .pt-ip-uch { opacity: 0; } .pt-ip.b2 .pt-ip-uch { opacity: 1; }
        .pt-ip-arvoh { opacity: 0; } .pt-ip.b2 .pt-ip-arvoh { opacity: 0.22; transition: opacity 0.6s ease 1.8s; } .pt-ip-arvoh, .pt-ip-arvoh path, .pt-ip-arvoh rect { fill: #4A4E5A; } .pt-ip-arvoh .ichi { fill: #DDE6F0; }
        .pt-ip-q { fill: #4A4E5A; } .pt-ip-q .ichi { fill: #DDE6F0; }
        .pt-ip-q { transform-box: fill-box; }
        .pt-ip.b2 .pt-ip-q.q1 { animation: pt-ip-q1 0.8s cubic-bezier(.5,0,.5,1) 0.4s both; }
        .pt-ip.b2 .pt-ip-q.q2 { animation: pt-ip-q2 0.8s cubic-bezier(.5,0,.5,1) 0.9s both; }
        .pt-ip.b2 .pt-ip-q.q3 { animation: pt-ip-q3 0.8s cubic-bezier(.5,0,.5,1) 1.4s both; }
        @keyframes pt-ip-q1 { 0% { transform: translate(40px, 70px); opacity: 1; } 100% { transform: translate(191px, 42px) scale(0.5); opacity: 0; } }
        @keyframes pt-ip-q2 { 0% { transform: translate(52px, 150px); opacity: 1; } 100% { transform: translate(223px, 42px) scale(0.5); opacity: 0; } }
        @keyframes pt-ip-q3 { 0% { transform: translate(330px, 84px); opacity: 1; } 100% { transform: translate(191px, 76px) scale(0.35); opacity: 0; } }
        .pt-ip-nomlar, .pt-ip-nom, .pt-ip-home-l, .pt-ip-ql, .pt-ip-ibora { position: absolute; font-size: 13px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .pt-ip-nomlar { left: 50%; bottom: 3px; transform: translateX(-50%); font-size: 13px; } /* 340 px sahnada telefonlar ostida (F-1007-289) */
        .pt-ip-nom { left: calc(50% + 56px); top: 38%; font-size: 15px; }
        .pt-ip-home-l { left: calc(50% + 56px); top: 76%; font-size: 12px; }
        .pt-ip-ql.l1 { left: 5%; top: 24%; } .pt-ip-ql.l2 { left: 5%; top: 66%; } .pt-ip-ql.l3 { right: 4%; top: 32%; }
        .pt-ip-ibora { left: 4%; top: 6px; color: ${T.accent}; font-size: 13.5px; font-weight: 800; background: ${T.paper}; border-radius: 8px; padding: 1px 9px; animation: pt-kir 0.4s ease-out 2.3s both; }
        /* 9-ekran: Neon SQL Editor maketi */
        .pt-s9-v { display: flex; flex-direction: column; gap: 10px; }
        ol.pt-vz { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        ol.pt-vz li { display: flex; gap: 9px; align-items: flex-start; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        ol.pt-vz li i { flex: none; font-style: normal; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; }
        .pt-sonlar { display: flex; flex-direction: column; gap: 6px; }
        .pt-son-q { display: grid; grid-template-columns: 52px 76px 18px minmax(0,1fr); align-items: center; gap: 6px; }
        .pt-son-l { font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .pt-inp { width: 100%; font: 500 13.5px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 8px 10px; outline: none; resize: vertical; }
        .pt-inp:focus { border-color: ${T.accent}; } .pt-inp.xato { border-color: ${T.err}; background: ${T.errFon}; } .pt-inp:disabled { background: ${T.bg}; }
        .pt-inp.son { font-family: 'JetBrains Mono', monospace; font-weight: 700; text-align: center; }
        .pt-dv { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; }
        .pt-dv-s { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        .pt-dv-v { display: flex; flex-wrap: wrap; gap: 6px; } .pt-dv-v .q-chip { padding: 7px 11px; }
        .pt-yordam { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
        .pt-yordam-t { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; }
        .pt-yordam-t p { margin: 0; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .pt-bajar { display: flex; flex-direction: column; gap: 8px; }
        .pt-bajar-t { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
        .pt-s9-o { display: flex; flex-direction: column; gap: 10px; }
        .pt-neon { border-radius: 14px; overflow: hidden; background: ${CODE.bg}; border: 1px solid ${T.line}; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.5); animation: pt-kir .45s ease-out; }
        .pt-neon-bar { display: flex; align-items: center; gap: 6px; padding: 8px 10px; background: rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .pt-neon-bar > i { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.22); }
        .pt-neon-tab { margin-left: 6px; font-size: 12px; font-weight: 700; color: ${CODE.text}; background: rgba(255,255,255,0.08); border-radius: 6px; padding: 3px 9px; }
        .pt-neon-run { margin-left: auto; font-size: 12px; font-weight: 800; color: ${CODE.bg}; background: ${CODE.str}; border-radius: 6px; padding: 4px 12px; }
        pre.pt-neon-sql { margin: 0; padding: 12px 16px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-variant-ligatures: none; font-size: 13px; line-height: 1.7; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; }
        .pt-neon-sql .kw { color: ${CODE.punct}; font-weight: 700; } .pt-neon-sql .str { color: ${CODE.str}; } .pt-neon-sql .cm { color: ${CODE.comment}; font-style: italic; } .pt-neon-sql .bo { color: ${CODE.attr}; font-weight: 700; }
        .pt-neon-nat { display: flex; gap: 12px; padding: 0 16px 14px; }
        .pt-neon-jad { display: grid; grid-template-columns: max-content; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.14); }
        .pt-neon-th, .pt-neon-td { font-family: 'JetBrains Mono', monospace; font-size: 13px; padding: 5px 22px; text-align: center; }
        .pt-neon-th { color: ${CODE.punct}; background: rgba(255,255,255,0.06); font-weight: 700; }
        .pt-neon-td { color: ${fon(T.paper, 0.55)}; font-size: 18px; font-weight: 800; }
        .pt-neon-td.bor { color: ${CODE.str}; animation: pt-pop .45s ease-out; }
        /* 10-ekran: ixcham chiziq «Pitchim · n/4», bitta katta karta, bosqich chiplari */
        .pt-strip { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; padding: 8px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pt-strip-l { font-size: 12px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; margin-right: 4px; } .pt-strip-l b { color: ${T.accent}; }
        .pt-strip-q { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; padding: 3px 9px; border-radius: 8px; background: ${T.bg}; }
        .pt-strip-q.ok { color: ${T.ok}; } .pt-strip-q i { font-style: normal; }
        .pt-strip-q.yashil { animation: pt-yashil 1.1s ease-out both; }
        .pt-bosq { display: flex; flex-wrap: wrap; gap: 6px; }
        .pt-bosq-c { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; padding: 4px 10px 4px 5px; border-radius: 99px; background: ${T.paper}; border: 1.5px solid ${T.line}; }
        .pt-bosq-c i { font-style: normal; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-family: 'JetBrains Mono', monospace; background: ${T.bg}; }
        .pt-bosq-c.on { color: ${T.accent}; border-color: ${T.accent}; background: ${T.accentSoft}; } .pt-bosq-c.ok { color: ${T.ok}; border-color: ${fon(T.ok, 0.4)}; }
        .pt-forma { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.24); animation: pt-kir 0.4s ease-out both; }
        .pt-forma-h { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; } .pt-forma-h b { font-size: 15px; color: ${T.ink}; } .pt-forma-h em { font-style: normal; font-size: 13px; color: ${T.err}; }
        .pt-maydon { display: flex; flex-direction: column; gap: 4px; }
        .pt-maydon-l { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; } .pt-maydon-l em { font-style: normal; text-transform: none; letter-spacing: 0; font-weight: 600; }
        .pt-qoldir { font-size: 12px; color: ${T.ink2}; }
        .pt-forma-t { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .pt-reja-t { display: flex; flex-direction: column; gap: 6px; }
        .pt-reja-tl { display: flex; flex-wrap: wrap; gap: 6px; }
        .pt-reja-tug { font: 600 13px 'Manrope', sans-serif; text-align: left; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 7px 11px; cursor: pointer; max-width: 100%; }
        .pt-reja-tug:hover { border-color: ${T.accent}; } .pt-reja-tug.on { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; }
        .pt-s10-sahna { display: flex; flex-direction: column; gap: 12px; }
        .q-mustaqil:has(.pt-forma.ikki), .q-mustaqil:has(.pt-s10-sahna), .q-mustaqil:has(.pt-s11-1), .q-mustaqil:has(.pt-s11-2) { max-width: none; }
        .pt-forma-g { display: flex; flex-direction: column; gap: 10px; }
        .pt-forma.ikki .pt-forma-g { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,0.9fr); gap: 18px; align-items: start; }
        .pt-forma-m { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pt-forma-o { min-width: 0; }
        .pt-oniz { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 14px; background: ${T.bg}; }
        /* 11-ekran: pitchdan oldin · taymer · baholash varag'i */
        .pt-s11-1 { display: flex; flex-direction: column; gap: 10px; }
        .pt-oldin { display: flex; flex-direction: column; gap: 3px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        .pt-oldin-h { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink}; }
        .pt-tmr { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }
        .pt-tmr-s { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; min-width: 72px; } .pt-tmr-s.yur { color: ${T.accent}; } .pt-tmr-s.oshdi { color: ${T.err}; }
        .pt-tmr-h { font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .pt-tmr-t { margin-left: auto; display: flex; gap: 8px; }
        .pt-s11-2 { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 16px; align-items: start; }
        .pt-s11-ch, .pt-s11-on { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pt-s11-ch .zoomable:not(.zoom-on) > .zoom-btn { top: 6px !important; right: 6px !important; }
        .pt-s11-ch .pt-sahna { padding-top: 40px; }
        .pt-s11-2 .pt-bolaklar { grid-template-columns: repeat(2, minmax(0,1fr)); }
        .pt-vq { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
        .pt-vq-h { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .pt-vq-q { display: grid; grid-template-columns: minmax(0,1.1fr) 70px minmax(0,1fr); gap: 8px; align-items: center; width: 100%; text-align: left; padding: 6px 8px; border-radius: 10px; background: ${T.bg}; border: 1.5px solid transparent; font: inherit; color: inherit; animation: pt-kir 0.35s ease-out both; }
        .pt-vq-q.x { border-color: ${fon(T.err, 0.5)}; }
        .pt-vq-bos { cursor: pointer; border-color: ${fon(T.err, 0.5)}; } .pt-vq-bos:hover { border-color: ${T.accent}; } .pt-vq-q.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pt-vq-nom { display: flex; flex-direction: column; gap: 1px; min-width: 0; } .pt-vq-nom b { font-size: 13px; color: ${T.ink}; } .pt-vq-nom em { font-style: normal; font-size: 11.5px; color: ${T.ink2}; line-height: 1.3; }
        .pt-vq-b { display: flex; gap: 4px; }
        .pt-vq-bel { width: 32px; height: 30px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-size: 15px; font-weight: 800; color: ${T.ink2}; cursor: pointer; }
        .pt-vq-bel.ok { background: ${T.ok}; border-color: ${T.ok}; color: #fff; animation: pt-pop 0.35s ease-out; } .pt-vq-bel.err { background: ${T.err}; border-color: ${T.err}; color: #fff; animation: pt-pop 0.35s ease-out; }
        .pt-vq-bb { width: 30px; height: 26px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; } .pt-vq-bb.ok { color: #fff; background: ${T.ok}; } .pt-vq-bb.err { color: #fff; background: ${T.err}; }
        .pt-vq-iz { display: flex; flex-direction: column; gap: 2px; min-width: 0; } .pt-vq-izt { font-size: 12.5px; color: ${T.ink}; overflow-wrap: anywhere; }
        .pt-vq-iz .pt-inp { padding: 6px 8px; font-size: 12.5px; }
        .pt-tuz { align-self: flex-start; font-style: normal; font-size: 11px; font-weight: 800; color: ${T.ok}; background: ${T.okFon}; border-radius: 6px; padding: 0 6px; }
        .pt-vq-vaqt { align-self: flex-end; font-size: 13px; color: ${T.ink2}; } .pt-vq-vaqt b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; } .pt-vq-vaqt.oshdi b { color: ${T.err}; }
        /* Kartochkalar va yakun */
        .pt-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: pt-halqa-k 2.4s ease-in-out 0.4s 3; }
        @keyframes pt-halqa-k { 0%, 100% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 3px ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 7px ${fon(T.accent, 0.3)}; } }
        p.pt-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.pt-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: pt-puls 1.4s ease-out 3; }
        .pt-fikr { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 20px 14px; border-radius: 16px; text-align: center; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .pt-fikr-l { font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.pt-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        .pt-hw { display: flex; flex-direction: column; gap: 10px; }
        .pt-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .pt-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .pt-hw-k { font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .pt-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.pt-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.pt-hw-qadam li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        ol.pt-hw-qadam li i { flex-shrink: 0; font-style: normal; font-size: 17px; line-height: 1.3; color: ${T.accent}; }
        .pt-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        /* Telefon kengligi (393): telefon tepada, bo'laklar ostida (2×2) */
        @media (max-width: 760px) {
          .pt-sahna, .q-kirish .pt-sahna, .q-reja .pt-sahna { grid-template-columns: minmax(0,1fr); justify-items: center; padding: 12px; }
          .pt-sahna-ong { width: 100%; }
          .pt-bolaklar { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .pt-s11-2, .pt-forma.ikki .pt-forma-g { grid-template-columns: minmax(0,1fr); }
          .pt-forma-o { display: none; }
          .pt-mini { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .pt-sozish { grid-template-columns: minmax(0,1fr); }
          .pt-hw-karta { grid-template-columns: minmax(0,1fr); }
          .pt-vq-q { grid-template-columns: minmax(0,1fr) 70px; } .pt-vq-iz { grid-column: 1 / -1; }
          .pt-son-q { grid-template-columns: 48px 70px 16px minmax(0,1fr); }
          .pt-tm-l em { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pt-halqa::after, .pt-guruh::after, .stage-nav .btn-white-accent::after, .pt-s0.kutish .q-variantlar-kol::after, .pt-bash .q-variantlar::after { animation: none !important; }
          .pt-halqa-i, .pt-bash .q-bashorat, .pt-bash .q-chip, .pt-bashq, .pt-bl, .pt-bl-q.yangi, .pt-bl-nom, .pt-bl-ok, .pt-pf, .pt-oyin-k, .pt-ekran, .pt-son.yangi, .pt-doiralar i, .pt-tap, .pt-kut-ch i.yur,
          .pt-jad-l, .pt-jad-a, .pt-jad-b, .pt-mini-son, .pt-sozish-u, .pt-ip-tug, .pt-ip-q, .pt-ip-ichi rect, .pt-ip-ibora, .pt-neon, .pt-neon-td.bor, .pt-strip-q.yashil, .pt-forma, .pt-vq-q, .pt-vq-bel, .pt-voqea-h, .pt-flash .fc-front, p.pt-fc-ipucha i, .pt-tm-ort { animation: none !important; }
          .pt-tm-k i, .pt-tom-b, .pt-tom-k, .pt-ip-eski, .pt-ip-yangi, .pt-ip-stilus { transition: none !important; }
          .pt-ip.b2 .pt-ip-ichi rect { opacity: 1; } .pt-ip.b2 .pt-ip-q { opacity: 0; } .pt-kut-ch i.yur { width: 100%; }
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
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); } /* skeletda tushib qolgan edi — ⛶ ishlamasdi (F-1006-271) */
        .q-fokus:has(.zoom-on) { animation: none; transform: none; } /* qolip .q-fokus (fill both) transform qoldiradi — ⛶ oynasi blokka bog'lanib qolardi (F-1006-286, MEXANIZM-TAKLIF 12) */
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
