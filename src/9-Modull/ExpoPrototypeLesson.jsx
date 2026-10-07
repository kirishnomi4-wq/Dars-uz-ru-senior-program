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
// ru-qoldiq-istisno s9: gap
// ru-qoldiq-istisno s10: gap

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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun, QChip, QXato, QIzoh, QXulosa, QKod } from '../qolip/index.jsx';
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

const LESSON_META = { lessonId: 'm9-09-v1', lessonTitle: { uz: "React Native va Expo: prototip telefonda", ru: 'React Native и Expo: прототип на телефоне' } };
// 19 ekran · oqim: kirish → reja → 2 tushuncha → 1-savol → 2 tushuncha → 2-savol → tushuncha → 3-savol → web-trek: tushuncha → kod → tushuncha → 4-savol → final → 2 amaliyot bloki → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: 'Expo Go', l: 8, tp: 22, s: 13, d: 6 },
  { t: 'QR', l: 70, tp: 16, s: 13, d: 7.5 },
  { t: 'PWA', l: 22, tp: 70, s: 12, d: 8.5 },
  { t: 'mobil/', l: 78, tp: 66, s: 12, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's18', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD: s3 B · s6 D · s8 A · s12 C · s13 final (picked 0/1 sentinel). `practice: -1` — sentinel (kod oynasi va ikki blok, variant yo'q).
const INLINE_KEYS = { s3: 1, s6: 3, s8: 0, s12: 2, s13: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI: 3, 6, 8, 12, 13). Kod qatori bor joyda kod (S-026); oxirgi kartada «Sinfga savol»
const RECAPS = {
  3: {
    title: { uz: 'Matn — Text ichida', ru: 'Текст — внутри Text' },
    cards: [
      { ic: null, h: { uz: 'Quti', ru: 'Коробка' }, body: { uz: '`View` · `<View style={s.karta}>`', ru: '`View` · `<View style={s.karta}>`' } },
      { ic: null, h: { uz: 'Matn', ru: 'Текст' }, body: { uz: '`Text` · `<Text>Shanba, 18:00</Text>`', ru: '`Text` · `<Text>Shanba, 18:00</Text>`' } },
      { ic: null, h: { uz: 'Bosiladigan joy', ru: 'Нажимаемое место' }, body: { uz: '`Pressable` · `<Pressable onPress={ochish}>`', ru: '`Pressable` · `<Pressable onPress={ochish}>`' }, ask: { uz: "`View` ichiga to'g'ridan matn yozilsa, telefonda nima bo'ladi?", ru: 'Что будет на телефоне, если написать текст прямо внутри `View`?' } }
    ]
  },
  6: {
    title: { uz: 'Ekran fayli va manzil', ru: 'Файл экрана и адрес' },
    cards: [
      { ic: null, h: { uz: "O'yinlar", ru: "Игры" }, body: { uz: '`src/app/index.tsx` · manzil `/`', ru: '`src/app/index.tsx` · адрес `/`' } },
      { ic: null, h: { uz: "E'lon berish", ru: "Объявить игру" }, body: { uz: '`src/app/elon.tsx` · manzil `/elon`', ru: '`src/app/elon.tsx` · адрес `/elon`' } },
      { ic: null, h: { uz: "Ekranlar Stack'da", ru: 'Экраны в Stack' }, body: { uz: '`src/app/_layout.tsx` · `<Stack />`', ru: '`src/app/_layout.tsx` · `<Stack />`' }, ask: { uz: '«Kirish» ekrani qaysi manzilda ochiladi?', ru: 'По какому адресу откроется экран «Вход»?' } }
    ]
  },
  8: {
    title: { uz: 'QR ochilmasa', ru: 'Если QR не открывается' },
    cards: [
      { ic: null, h: { uz: 'Bitta Wi-Fi', ru: 'Одна Wi-Fi' }, body: { uz: 'telefon kompyuterni tarmoqda topadi · `npx expo start`', ru: 'телефон находит компьютер в сети · `npx expo start`' } },
      { ic: null, h: { uz: "Bitta tarmoq yo'q yoki u to'sadi", ru: 'Общей сети нет или она блокирует' }, body: { uz: 'internet orqali · `npx expo start --tunnel`', ru: 'через интернет · `npx expo start --tunnel`' } },
      { ic: null, h: { uz: 'iPhone', ru: 'iPhone' }, body: { uz: 'ikkalasida bitta Expo akkaunti · `npx expo login`', ru: 'один аккаунт Expo на обоих · `npx expo login`' }, ask: { uz: 'Tunnel bilan ilova nega sekinroq yangilanadi?', ru: "Почему через tunnel приложение обновляется медленнее?" } }
    ]
  },
  12: {
    title: { uz: 'PWA uchun nima kerak', ru: 'Что нужно для PWA' },
    cards: [
      { ic: null, h: { uz: 'Manifest', ru: "Manifest" }, body: { uz: 'nom, ikonkalar, ochiladigan sahifa · `"start_url": "/"`', ru: 'имя, иконки, открываемая страница · `"start_url": "/"`' } },
      { ic: null, h: { uz: 'Ilova kabi ochilish', ru: 'Открытие как приложение' }, body: { uz: '`"display": "standalone"`', ru: '`"display": "standalone"`' } },
      { ic: null, h: { uz: 'HTTPS manzil', ru: "HTTPS-адрес" }, body: { uz: "Netlify'da o'zi bor · `….netlify.app`", ru: "Netlify даёт его сам · `….netlify.app`" }, ask: { uz: "Nega telefon `localhost` dagi saytni o'rnata olmaydi?", ru: 'Почему телефон не может установить сайт с `localhost`?' } }
    ]
  },
  13: {
    title: { uz: "Telefonga yo'l", ru: 'Путь на телефон' },
    cards: [
      { ic: null, h: { uz: '1 · 2', ru: '1 · 2' }, body: { uz: "Expo loyihasini yaratish · QR'ni telefonda Expo Go bilan ochish", ru: 'Создать проект Expo · открыть QR на телефоне в Expo Go' } },
      { ic: null, h: { uz: '3', ru: '3' }, body: { uz: "Ekranlarni `src/app/` fayllariga ko'chirish", ru: 'Перенести экраны в файлы `src/app/`' } },
      { ic: null, h: { uz: '4', ru: '4' }, body: { uz: 'Uch ekranni telefonda bosib tekshirish', ru: 'Проверить три экрана нажатиями на телефоне' }, ask: { uz: 'Nega ulanish ekranlarni ko\'chirishdan oldin tekshiriladi?', ru: 'Почему подключение проверяют до переноса экранов?' } }
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
        <h2 className="rc-h">{tx(card.h)}</h2>
        <p className="rc-body">{tx(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">{tr({ uz: 'Sinfga savol:', ru: 'Вопрос классу:' })} {tx(card.ask)}</div>}
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

// ===== DARSNING O'Z VIZUALI — «Maydon Jamoa» telefoni (MD: bitta vizual, 163/180). Bitta manba: NAMUNA_OYINLAR · JAMOA_EKRANLAR · TELEFON_YOLI · DARS_YOLI =====
// JamoaTelefon — uch holat: brauzer (manzil qatori) · expo (manzil qatorisiz, ustida «Expo Go») · pwa (bosh ekran). O'lchami 172×272 hamma ekranda (SABOQ 22), doim chapda (SABOQ 21).
// Stack: yangi ekran o'ngdan suriladi, «‹» bilan qaytadi. Kam harakat rejimida harakat yo'q — yakuniy holat birdan (DE-200). Logotip va emoji yo'q (D4).
// qolip-maket: ep-bolak ep-fayl ep-karta-btn
const cxx = (...a) => a.filter(Boolean).join(' ');
// MD belgilari: `kod` — chip, **qalin** — <b>. Satr bo'lmasa (JSX) — o'zgarishsiz.
const tx = (o) => {
  const s = tr(o);
  if (typeof s !== 'string' || (!s.includes('`') && !s.includes('**'))) return s;
  const out = [];
  s.split('`').forEach((p, i) => {
    if (i % 2) { out.push(<code className="qcode" key={'k' + i}>{p}</code>); return; }
    p.split('**').forEach((q, j) => { if (q) out.push(j % 2 ? <b key={'b' + i + '-' + j}>{q}</b> : q); });
  });
  return out;
};
const kamHarakat = () => typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
// Kechiktirilgan qadamlar: ekrandan chiqilganda hammasi bekor bo'ladi
const useKeyin = () => {
  const ids = useRef([]);
  useEffect(() => () => { ids.current.forEach(clearTimeout); ids.current = []; }, []);
  return useCallback((fn, ms) => { ids.current.push(setTimeout(fn, ms)); }, []);
};
// Trek — yagona manba pm-m9d8-platforma.trek (tayanch 9.77); kalit yo'q bo'lsa null
const TREK_KALIT = 'pm-m9d8-platforma';
const trekOqi = () => { try { const o = JSON.parse(localStorage.getItem(TREK_KALIT) || 'null'); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; } catch { return null; } };
const trekYoz = (trek) => { try { const o = JSON.parse(localStorage.getItem(TREK_KALIT) || 'null'); localStorage.setItem(TREK_KALIT, JSON.stringify({ ...(o && typeof o === 'object' ? o : {}), trek })); } catch { /* saqlash yopiq — tanlov shu ekranda qoladi */ } };
// 7-darsdagi wireframe yozuvi (tayanch 8): { funksiya, ekranlar: [{ nom, nima, tugma }] }; yo'q bo'lsa null
const wireframeOqi = () => { try { const o = JSON.parse(localStorage.getItem('pm-m9d7-wireframe') || 'null'); const e = o && Array.isArray(o.ekranlar) ? o.ekranlar.filter(x => x && String(x.nom || '').trim()) : []; return e.length ? e : null; } catch { return null; } };

const JAMOA_NOM = 'Maydon Jamoa';
const JAMOA_EKRANLAR = {
  oyinlar: { uz: "O'yinlar", ru: 'Игры' },
  oyin: { uz: "O'yin", ru: 'Игра' },
  elon: { uz: "E'lon berish", ru: 'Объявить игру' }
};
// Namuna o'yinlar (tayanch 9.2, aynan; id — satr, TAYANCHGA SAVOL 7): bor / kerak
const NAMUNA_OYINLAR = [
  { id: '1', kun: { uz: 'Shanba', ru: 'Суббота' }, soat: '18:00', maydon: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, bor: 8, kerak: 10 },
  { id: '2', kun: { uz: 'Shanba', ru: 'Суббота' }, soat: '20:00', maydon: { uz: 'Maktab maydoni', ru: 'Школьное поле' }, bor: 6, kerak: 10 },
  { id: '3', kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, soat: '10:00', maydon: { uz: 'Park maydoni', ru: 'Поле в парке' }, bor: 4, kerak: 8 },
  { id: '4', kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, soat: '17:00', maydon: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, bor: 9, kerak: 10 }
];
const oyinTop = (id) => NAMUNA_OYINLAR.find(o => o.id === id) || NAMUNA_OYINLAR[0];
const ELON_MAYDONLAR = [{ uz: 'Kun', ru: 'День' }, { uz: 'Soat', ru: 'Время' }, { uz: 'Maydon', ru: 'Поле' }, { uz: 'Nechta odam', ru: 'Сколько человек' }];
// Telefonga yo'l (mobil trek) — 13-ekran finali, 5-takrorlash va A1 mobil qadamlari tartibi shundan (P-063)
const TELEFON_YOLI = [
  { id: 'yarat', label: { uz: 'Expo loyihasini yaratish', ru: 'Создать проект Expo' } },
  { id: 'qr', label: { uz: "QR'ni telefonda Expo Go bilan ochish", ru: 'Открыть QR на телефоне в Expo Go' } },
  { id: 'kochir', label: { uz: "Ekranlarni `src/app/` fayllariga ko'chirish", ru: 'Перенести экраны в файлы `src/app/`' } },
  { id: 'tekshir', label: { uz: 'Uch ekranni telefonda bosib tekshirish', ru: 'Проверить три экрана нажатиями на телефоне' } }
];
const DARS_YOLI = [
  { t: { uz: "Ekranlarni React Native'ga ko'chirish", ru: 'Перенести экраны на React Native' }, teg: 'Expo' },
  { t: { uz: "Har ekranni alohida faylga qo'yish", ru: 'Положить каждый экран в отдельный файл' }, teg: { uz: 'navigatsiya', ru: 'навигация' } },
  { t: { uz: 'QR orqali telefonda ochish', ru: 'Открыть на телефоне через QR' }, teg: 'Expo Go' },
  { t: { uz: 'Web-trekda: telefonga moslashgan sayt', ru: 'В веб-треке: сайт под телефон' }, teg: { uz: 'adaptiv sayt · PWA', ru: 'адаптивный сайт · PWA' } }
];

// Ilova ekranlari (telefon ichida). web — hali prototip (React) ko'rinishidagi qismlar (2-ekran): royxat · karta · matn · rang
const WEB_KLASS = { royxat: 'w-royxat', karta: 'w-karta', matn: 'w-matn', rang: 'w-rang' };
const OyinlarEkran = ({ web = [], bosilgan, halqa, onKarta, ochilgan = [], xira }) => (
  <div className={cxx('ep-oy', ...web.map(w => WEB_KLASS[w]), xira && 'xira')}>
    <b className="ep-ekran-sar">{tr(JAMOA_EKRANLAR.oyinlar)}</b>
    <div className="ep-oy-ro">
      {NAMUNA_OYINLAR.map((o, i) => {
        const ichi = <><span className="ep-k-q"><b className="ep-k-vaqt">{tr(o.kun)}, {o.soat}</b><span className="ep-k-son">{o.bor} / {o.kerak}</span></span><span className="ep-k-joy">{tr(o.maydon)}</span></>;
        const cls = cxx('ep-karta', bosilgan === o.id && 'bos', halqa === o.id && 'ep-halqa', ochilgan.includes(o.id) && 'ochildi');
        return onKarta
          ? <button key={o.id} type="button" className={cxx('ep-karta-btn', cls)} style={{ '--d': (0.05 + i * 0.08) + 's' }} disabled={xira} onClick={() => onKarta(o.id)}>{ichi}</button>
          : <span key={o.id} className={cls} style={{ '--d': (0.05 + i * 0.08) + 's' }}>{ichi}</span>;
      })}
    </div>
    <span className="ep-tel-btn">{tr(JAMOA_EKRANLAR.elon)}</span>
  </div>
);
const OyinEkran = ({ id = '1', qoshildi, bosildi }) => {
  const o = oyinTop(id);
  const son = o.bor + (qoshildi ? 1 : 0);
  return (
    <div className="ep-oyin">
      <span className="ep-orqa">‹ {tr(JAMOA_EKRANLAR.oyinlar)}</span>
      <b className="ep-oyin-sar">{tr(o.kun)}, {o.soat}</b>
      <span className="ep-oyin-joy">{tr(o.maydon)}</span>
      <b key={son} className={cxx('ep-son', qoshildi && 'yangi')}>{son} / {o.kerak}</b>
      <span className="ep-doiralar" aria-hidden="true">{Array.from({ length: o.kerak }, (_, i) => <i key={i} className={cxx(i < son && 'bor', qoshildi && i === son - 1 && 'yangi')} />)}</span>
      <span className={cxx('ep-tel-btn', bosildi && 'bos', qoshildi && 'off')}>{qoshildi ? tr({ uz: "Qo'shildingiz", ru: 'Вы присоединились' }) : tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
    </div>
  );
};
const ElonEkran = () => (
  <div className="ep-elon">
    <span className="ep-orqa">‹ {tr(JAMOA_EKRANLAR.oyinlar)}</span>
    <b className="ep-ekran-sar">{tr(JAMOA_EKRANLAR.elon)}</b>
    {ELON_MAYDONLAR.map((m, i) => <span key={i} className="ep-elon-m">{tr(m)}</span>)}
    <span className="ep-tel-btn">{tr({ uz: 'Yuborish', ru: 'Отправить' })}</span>
  </div>
);
const JamoaEkran = ({ e, ...p }) => (e.k === 'oyin' ? <OyinEkran id={e.id} qoshildi={e.qoshildi} bosildi={e.bosildi} /> : e.k === 'elon' ? <ElonEkran /> : <OyinlarEkran {...p} />);
// Bosh ekran (pwa): kulrang ikonka kataklari, bitta bo'sh joy uzuq chiziqda (U-041) → «Maydon Jamoa» ikonkasi (accent kvadrat, harfsiz)
const PWA_KATAK = 16, PWA_JOY = 9;
const BoshEkran = ({ nom, ikonka, tushdi, bosildi }) => (
  <div className="ep-bosh">
    {Array.from({ length: PWA_KATAK }, (_, i) => (i === PWA_JOY
      ? <span key={i} className={cxx('ep-joy', ikonka && 'bor')}>
        {ikonka && <i key={tushdi ? 't' : 'i'} className={cxx('ep-ikonka', tushdi && 'tush', bosildi && 'bos')} aria-hidden="true" />}
        {nom && <b className="ep-ik-nom">{JAMOA_NOM}</b>}
      </span>
      : <i key={i} className="ep-katak" aria-hidden="true" />))}
  </div>
);
// Telefon. stack — ekranlar (oxirgisi tepada); chiq — tepadagisi chiqib ketmoqda; qiya — hammasi ustma-ust, sal qiya (4-ekran, _layout);
// ichki — ekran ichidagi qo'shimcha qatlam; children — ramka ustidagi (kesilmaydigan) qatlam: konvert, kamera ramkasi; past — telefon ostida
const JamoaTelefon = ({ holat = 'expo', manzil = 'localhost:5173', qulf, yorliq, yorliqsiz, stack = [], chiq, qiya, bosh, ichki, past, children, className, ...p }) => {
  const top = stack[stack.length - 1];
  const ost = stack.length > 1 ? stack[stack.length - 2] : null;
  const yl = yorliq === undefined ? (holat === 'expo' ? 'Expo Go' : null) : yorliq;
  return (
    <div className={cxx('ep-tel-ust', className)}>
      {yorliqsiz ? null : yl ? <span className="ep-tel-yorliq" key={typeof yl === 'string' ? yl : 'y'}>{yl}</span> : <span className="ep-tel-yorliq bosh" aria-hidden="true" />}
      <div className="ep-tel-qob">
        <div className={cxx('ep-telefon', holat)}>
          {holat === 'brauzer' && <span className="ep-manzil">{qulf && <i className="ep-qulf" aria-hidden="true" />}<span>{manzil}</span></span>}
          {bosh ? bosh : (
            <div className="ep-tel-ekran">
              {top && <span className="ep-tel-bar"><b className="ep-tel-nom">{JAMOA_NOM}</b></span>}
              <div className={cxx('ep-qatlamlar', qiya && 'qiya')}>
                {qiya
                  ? stack.map((e, i) => <div key={'q' + i + e.k} className="ep-qatlam" style={{ '--i': i }}><JamoaEkran e={e} /></div>)
                  : <>
                    {ost && <div key={'o' + (stack.length - 1) + ost.k + (ost.id || '')} className="ep-qatlam ost"><JamoaEkran e={ost} /></div>}
                    {top && <div key={'t' + stack.length + top.k + (top.id || '')} className={cxx('ep-qatlam', stack.length > 1 && 'sur', chiq && 'chiq')}><JamoaEkran e={top} {...p} /></div>}
                  </>}
              </div>
            </div>
          )}
          {ichki}
        </div>
        {children}
      </div>
      {past}
    </div>
  );
};
// Kompyuter brauzeri oynasi (0-ekran, A1 web): prototip, kartalar yonma-yon
const KompOyna = ({ manzil = 'localhost:5173', kichik, ixcham, className }) => (
  <div className={cxx('ep-komp', kichik && 'kichik', ixcham && 'ixcham', className)}>
    <span className="ep-komp-bar"><i /><i /><i /><span>{manzil}</span></span>
    <div className="ep-komp-tana">
      <b className="ep-tel-nom">{JAMOA_NOM}</b>
      <b className="ep-komp-sar">{tr(JAMOA_EKRANLAR.oyinlar)}</b>
      <div className="ep-komp-ro">
        {NAMUNA_OYINLAR.map(o => <span key={o.id} className="ep-komp-k"><b>{ixcham ? o.soat : <>{tr(o.kun)}, {o.soat}</>}</b>{!ixcham && <span>{tr(o.maydon)}</span>}<span className="ep-k-son">{o.bor} / {o.kerak}</span></span>)}
      </div>
    </div>
  </div>
);
// So'rov konverti: manbadan nishonga uchadi. Joylar DOM dan o'lchanadi (⛶ ichida ham, telefonda ham to'g'ri)
const PARVOZ_MS = 800;
const useParvoz = () => {
  const box = useRef(null);
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [parvoz, setParvoz] = useState([]);
  const uchir = useCallback((dan, ga, tur, ms = PARVOZ_MS) => {
    const b = box.current; if (kam || !b) return;
    const s = b.querySelector(dan), n = b.querySelector(ga); if (!s || !n) return;
    const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
    const nuqta = (el) => { const r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - br.left) / z, y: (r.top + r.height / 2 - br.top) / z }; };
    const p = { k: Math.random().toString(36).slice(2), tur, a: nuqta(s), b: nuqta(n), ms };
    setParvoz(x => [...x, p]);
    keyin(() => setParvoz(x => x.filter(y => y.k !== p.k)), ms + 60);
  }, [kam, keyin]);
  return { box, parvoz, uchir, kam, keyin };
};
const Konvert = ({ p }) => (
  <span className={cxx('ep-konvert', 'uch', p.tur)} aria-hidden="true"
    style={{ left: p.a.x + 'px', top: p.a.y + 'px', '--dx': (p.b.x - p.a.x) + 'px', '--dy': (p.b.y - p.a.y) + 'px', animationDuration: p.ms + 'ms' }} />
);
// Bashorat (SABOQ 11/19): karta halqada, variantlar navbat bilan chiqadi; tanlangach ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi
const TaxminIxcham = ({ savol, javob }) => (
  <div className="ep-taxmin"><span className="ep-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="ep-taxmin-s">{savol}</span><b>{javob}</b></div>
);
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="ep-navbat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <TaxminIxcham savol={savol} javob={tr((variantlar.find(v => v.k === tanlov) || {}).t)} />);
// Natija bloki (SABOQ 25): bitta yashil blok — birinchi qator taxmin, so'ng nom qatori (bo'lsa) va xulosa
const NatijaBlok = ({ togri, haqiqat, izoh, xulosa }) => (
  <div className="q-xulosa ep-nb">
    <span className={cxx('ep-nb-t', togri && 'ok')}>{togri ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение подтвердилось' })}</> : haqiqat}</span>
    {izoh && <span className="ep-nb-i">{izoh}</span>}
    <span className="ep-nb-x">{xulosa}</span>
  </div>
);
const Haqiqat = ({ taxmin, haqiqat }) => <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {taxmin} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></>;
const Sanoq = ({ yorliq, n, jami }) => <span className="ep-sanoq">{tr(yorliq)}: <b key={n}>{n} / {jami}</b></span>;
// Kod kartasi: fayl nomi + o'qiladigan qisqa bo'lak (ishga tushirilmaydi)
const KodKarta = ({ fayl, yon, children, className }) => (
  <div className={cxx('ep-kod', yon && 'yon', className)}>
    {fayl && <span className="ep-kod-f">{fayl}</span>}
    <pre className="ep-kod-t">{children}</pre>
  </div>
);

// ===== SCREEN 0 — KIRISH (QKirish): telefonda localhost:5173 — so'rov telefondan chiqib, o'ziga qaytadi. Ballsiz (J-026) =====
const HOOK_OPTS = [
  { id: 'a', t: { uz: 'Prototip chiqadi — manzil kompyuterdagi bilan bir xil', ru: 'Прототип откроется — адрес такой же, как на компьютере' } },
  { id: 'b', t: { uz: "Prototip chiqmaydi — telefon manzilni o'zidan qidiradi", ru: 'Прототип не откроется — телефон ищет адрес у себя' } },
  { id: 'c', t: { uz: "Prototip chiqadi — ikkalasi bitta Wi-Fi'da bo'lsa", ru: 'Прототип откроется — если оба в одной Wi-Fi' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Telefon uchun <code className="qcode">localhost</code> — telefonning o'zi. Prototip kompyuterda, telefon unga boshqa yo'l bilan yetadi.</>, ru: <><b>Именно!</b> Для телефона <code className="qcode">localhost</code> — это сам телефон. Прототип на компьютере, телефон доберётся до него другим путём.</> },
  a: { uz: <><b>Qiziq fikr!</b> Manzil bir xil, lekin <code className="qcode">localhost</code> har qurilmada o'zini bildiradi: telefon prototipni o'zidan qidiradi.</>, ru: <><b>Интересная мысль!</b> Адрес тот же, но <code className="qcode">localhost</code> на каждом устройстве означает само устройство: телефон ищет прототип у себя.</> },
  c: { uz: <><b>Qiziq fikr!</b> Bitta Wi-Fi'da ham <code className="qcode">localhost</code> telefonning o'zi bo'lib qoladi — kompyuter boshqa manzil bilan topiladi.</>, ru: <><b>Интересная мысль!</b> И в одной Wi-Fi <code className="qcode">localhost</code> остаётся самим телефоном — компьютер находят по другому адресу.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [bosq, setBosq] = useState(avval ? 2 : 0); // 0 — kutish · 1 — so'rov telefon atrofida aylanmoqda · 2 — natija
  const [sc, setSc] = useState(0);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); setSc(n => n + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
  };
  const och = () => {
    if (picked === null || bosq) return;
    setBosq(1);
    keyin(() => { setBosq(2); setSc(n => n + 1); }, kam ? 0 : 2100);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={bosq < 2} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Telefonda <code className="qcode">localhost:5173</code> ni ochsangiz, <span className="italic" style={{ color: T.accent }}>nima chiqadi</span>?</>, ru: <><code className="qcode">localhost:5173</code> на телефоне — <span className="italic" style={{ color: T.accent }}>что появится</span>?</> })}
        mentor={<Mentor>{picked === null
          ? tx({ uz: "Jonli prototipingiz kompyuterda `localhost:5173` da ishlayapti, endi uni telefonda ochmoqchisiz — avval javobni tanlang.", ru: 'Ваш живой прототип работает на компьютере на `localhost:5173`, теперь вы хотите открыть его на телефоне — сначала выберите ответ.' })
          : bosq < 2 ? tr({ uz: "Endi telefon ostidagi «Ochib ko'rish»ni bosing.", ru: 'Теперь нажмите «Открыть» под телефоном.' })
            : tr({ uz: "«Davom etish»ni bosing — bugungi rejani ko'rasiz.", ru: 'Нажмите «Продолжить» — увидите план на сегодня.' })}</Mentor>}
        maket={<div className={cxx('ep-s0', picked === null && 'kutish')}>
          <KompOyna kichik className="ep-s0-komp" />
          <JamoaTelefon holat="brauzer" yorliq={null} className="ep-s0-tel"
            bosh={<div className={cxx('ep-bosh-sahifa', bosq === 2 && 'kul')} />}
            past={bosq < 2
              ? <QTugma className={picked !== null && !bosq ? 'ep-halqa' : undefined} disabled={picked === null || bosq > 0} onClick={och}>{tr({ uz: "Ochib ko'rish", ru: 'Открыть' })}</QTugma>
              : <p className="ep-tel-izoh fade-step">{tx({ uz: "`localhost` — telefonning o'zi: bu yerda prototip yo'q", ru: '`localhost` — это сам телефон: прототипа здесь нет' })}</p>}>
            {bosq === 1 && <span className="ep-konvert aylan" aria-hidden="true" />}
          </JamoaTelefon>
        </div>}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
        javob={bosq === 2 && picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Dars oxirida» — telefon (expo) bir marta o'zi o'ynaydi (DE-200); o'ngda 4 qadam «01 · matn · teg» =====
const RejaTelefon = () => {
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [b, setB] = useState(kam ? 4 : 0); // 0 O'yinlar · 1 karta bosildi · 2 O'yin suriladi · 3 «Qo'shilaman» bosildi · 4 «9 / 10»
  useEffect(() => {
    if (kam) return;
    keyin(() => setB(1), 1000); keyin(() => setB(2), 1300); keyin(() => setB(3), 2500); keyin(() => setB(4), 2750);
  }, []); // eslint-disable-line
  const stack = b >= 2 ? [{ k: 'oyinlar' }, { k: 'oyin', id: '1', bosildi: b === 3, qoshildi: b >= 4 }] : [{ k: 'oyinlar' }];
  return <JamoaTelefon holat="expo" stack={stack} bosilgan={b === 1 ? '1' : null} className="ep-reja-tel" />;
};
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [trek] = useState(trekOqi);
  const trekMatn = trek === 'mobil' ? { uz: 'Trekingiz: mobil', ru: 'Ваш трек: мобильный' } : trek === 'web' ? { uz: 'Trekingiz: web', ru: 'Ваш трек: веб' } : { uz: 'Trekni amaliyotda tanlaysiz', ru: 'Трек выберете на практике' };
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun prototipingizni <span className="italic" style={{ color: T.accent }}>o'z telefoningizda</span> ochasiz.</>, ru: <>Сегодня вы откроете прототип <span className="italic" style={{ color: T.accent }}>на своём телефоне</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Mobil trekda prototip Expo ilovasiga aylanadi, web-trekda — telefonga moslashgan saytga. Avval Maydon Jamoa misolida ko'rasiz, keyin o'z trekingizda, o'z repo'ngizda qilasiz.", ru: 'В мобильном треке прототип становится приложением Expo, в веб-треке — сайтом под телефон. Сначала посмотрите на примере Maydon Jamoa, потом сделаете в своём треке, в своём репо.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'К концу урока' })}
        chap={<RejaTelefon />}
        qadamlar={DARS_YOLI.map(q => ({ t: tr(q.t), teg: tr(q.teg) }))}>
        <p className="ep-reja-past fade-up">{tr(trekMatn)} · {tr({ uz: 'Mentor misoli', ru: 'пример Ментора' })} <code>maydon-jamoa</code> · {tr({ uz: 'tayyor holat', ru: 'готовое состояние' })} <code>m11-dars-09-done</code></p>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA (QTushuncha keng, juftlash): kodda bo'lakni tanlang → React Native juftini bosing. Telefon CHAPDA, kod kartasi o'ngda =====
const RN_JUFT = [
  { k: 'royxat', rn: 'View' },
  { k: 'karta', rn: 'Pressable' },
  { k: 'matn', rn: 'Text' },
  { k: 'rang', rn: 'StyleSheet' }
];
// Xato juftlik (QXato, ≤60) — MD dagi to'rt qator; MD da yo'q juftlik — eng yaqin qator (hisobotda)
const RN_XATO = {
  view: { uz: '`View` — quti: matn uchun boshqa komponent kerak.', ru: '`View` — коробка: для текста нужен другой компонент.' },
  text: { uz: "`Text` faqat matnni o'raydi — bu yerda quti kerak.", ru: '`Text` оборачивает только текст — здесь нужна коробка.' },
  pressable: { uz: "Ro'yxat qutisi bosilmaydi — bosiladigani karta.", ru: 'Коробку списка не нажимают — нажимают карточку.' },
  style: { uz: "`StyleSheet` ko'rinish beradi — u teg o'rnida turmaydi.", ru: '`StyleSheet` задаёт вид — он не встаёт на место тега.' }
};
const rnXato = (rn, k) => (k === 'matn' ? RN_XATO.view : k === 'rang' ? RN_XATO.style : rn === 'Text' ? RN_XATO.text : rn === 'StyleSheet' ? RN_XATO.style : RN_XATO.pressable);
const S2Kod = ({ ok, tanlov, halqa, onSeg, tugadi }) => {
  const B = ({ k, children, birinchi }) => (ok.includes(k) || tugadi
    ? <span key={'r' + k} className="ep-rn-q">{children}</span>
    : <button type="button" className={cxx('ep-bolak', tanlov === k && 'on', halqa === k && birinchi && 'ep-halqa')} onClick={() => onSeg(k)}>{children}</button>);
  const r = ok.includes('royxat'), ka = ok.includes('karta'), m = ok.includes('matn'), s = ok.includes('rang');
  return (
    <KodKarta fayl={r && ka && m && s ? 'OyinKarta · React Native' : 'OyinKarta · React'} className="ep-s2-kod">
      {'<'}<B k="royxat" birinchi>{r ? 'View' : 'div'}</B>{' '}<B k="rang" birinchi>{s ? 'style={s.oyinlar}' : 'className="oyinlar"'}</B>{'>\n'}
      {'  <'}<B k="karta" birinchi>{ka ? 'Pressable' : 'div'}</B>{' '}<B k="rang">{s ? 'style={s.karta}' : 'className="karta"'}</B>{' '}<B k="karta">{ka ? 'onPress={ochish}' : 'onClick={ochish}'}</B>{'>\n'}
      {'    '}<B k="matn" birinchi>{m ? '<Text>' : '<p>'}</B>{'Shanba, 18:00'}<B k="matn">{m ? '</Text>' : '</p>'}</B>{'\n'}
      {'  </'}<B k="karta">{ka ? 'Pressable' : 'div'}</B>{'>\n'}
      {'</'}<B k="royxat">{r ? 'View' : 'div'}</B>{'>'}
      {s && <span className="ep-rn-q">{'\nconst s = StyleSheet.create({ … })'}</span>}
    </KodKarta>
  );
};
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [ok, setOk] = useState(avval ? RN_JUFT.map(j => j.k) : []);
  const [tanlov, setTanlov] = useState(null);
  const [xato, setXato] = useState(null); // { rn, k, n }
  const done = ok.length >= 4;
  const tugadi = useTugadi(done, 1100, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const halqa = !tanlov ? (RN_JUFT.find(j => !ok.includes(j.k)) || {}).k : null;
  const bos = (rn) => {
    if (!tanlov || done) return;
    const j = RN_JUFT.find(x => x.k === tanlov);
    if (j.rn === rn) { setOk(o => [...o, tanlov]); setTanlov(null); setXato(null); }
    else setXato({ rn, k: tanlov, n: Date.now() });
  };
  const web = RN_JUFT.map(j => j.k).filter(k => !ok.includes(k));
  return (
    <Stage eyebrow={tr({ uz: 'Takror · React Native', ru: 'Повторение · React Native' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Juftlarni toping (${ok.length}/4)`, ru: `Найдите пары (${ok.length}/4)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Prototipdagi karta <span className="italic" style={{ color: T.accent }}>React Native'da</span> qanday yoziladi?</>, ru: <>Как карточка из прототипа пишется <span className="italic" style={{ color: T.accent }}>на React Native</span>?</> })}
        mentor={<Mentor>{tx({ uz: "8-Modulda `View` va `Text` bilan tanishgansiz — avval kodda bo'lakni tanlang, so'ng uning React Native juftini bosing.", ru: 'В 8-м модуле вы познакомились с `View` и `Text` — сначала выберите фрагмент в коде, потом нажмите его пару в React Native.' })}</Mentor>}
        vizual={<div className="ep-yonma">
          <JamoaTelefon holat={done ? 'expo' : 'brauzer'} stack={[{ k: 'oyinlar' }]} web={web}
            yorliq={done ? 'Expo Go · React Native' : tr({ uz: 'prototip · React', ru: 'прототип · React' })} />
          <div className="ep-ong">
            <S2Kod ok={ok} tanlov={tanlov} halqa={halqa} onSeg={(k) => { setTanlov(k); setXato(null); }} tugadi={tugadi} />
            {!tugadi && <Sanoq yorliq={{ uz: 'Almashdi', ru: 'Заменено' }} n={ok.length} jami={4} />}
          </div>
        </div>}
        harakat={!tugadi && <div className="ep-harakat">
          <div className={cxx('ep-rn-tugmalar', tanlov && 'ep-halqa')}>
            {RN_JUFT.map(j => {
              const silk = xato && xato.rn === j.rn;
              return <QChip key={silk ? j.rn + xato.n : j.rn} silk={silk} holat={ok.includes(j.k) ? 'ok' : undefined} disabled={!tanlov || ok.includes(j.k)} onClick={() => bos(j.rn)}><span className="mono">{j.rn}</span></QChip>;
            })}
          </div>
          {xato && <QXato>{tx(rnXato(xato.rn, xato.k))}</QXato>}
        </div>}
        xulosa={done && tx({ uz: "Bu misolda karta o'sha, faqat komponentlari `View`, `Pressable` va `Text`, ko'rinishi — `StyleSheet` da.", ru: 'В этом примере карточка та же, только компоненты — `View`, `Pressable` и `Text`, а вид — в `StyleSheet`.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1, B). Savol ustida kod bo'lagi (KOD 14), yorliq yo'q (SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Bu karta telefonda xato beradi. Nimani tuzatasiz?"
    question={tr({ uz: <><pre className="ep-savol-kod">{'<View style={s.karta}>\n  Shanba, 18:00\n</View>'}</pre><h2 className="title h-ask">Bu karta telefonda xato beradi. <span className="italic" style={{ color: T.accent }}>Nimani tuzatasiz?</span></h2></>, ru: <><pre className="ep-savol-kod">{'<View style={s.karta}>\n  Shanba, 18:00\n</View>'}</pre><h2 className="title h-ask">Эта карточка на телефоне выдаст ошибку. <span className="italic" style={{ color: T.accent }}>Что исправите?</span></h2></> })}
    options={[
      { uz: '`View` ni `div` bilan almashtiraman', ru: 'Заменю `View` на `div`' },
      { uz: 'Matnni `<Text>` ichiga olaman', ru: 'Помещу текст внутрь `<Text>`' },
      { uz: '`style` ni `className` qilaman', ru: "Заменю `style` на `className`" },
      { uz: 'Matnni `<p>` ichiga olaman', ru: 'Помещу текст внутрь `<p>`' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "React Native'da matn `<Text>` ichida turadi — `View` faqat quti.", ru: 'В React Native текст стоит внутри `<Text>` — `View` только коробка.' }}
    explainWrong={{
      0: { uz: "`div` — web tegi: telefondagi ilovada u yo'q.", ru: '`div` — веб-тег: в приложении на телефоне его нет.' },
      2: { uz: "`className` — web'niki; React Native'da ko'rinish `style` da.", ru: '`className` — из веба; в React Native вид задаётся в `style`.' },
      3: { uz: '`<p>` ham web tegi — React Native uni tanimaydi.', ru: '`<p>` тоже веб-тег — React Native его не знает.' },
      default: { uz: "React Native'da matn `<Text>` ichida turadi.", ru: 'В React Native текст стоит внутри `<Text>`.' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA (QTushuncha keng): src/app/ fayllarini birma-bir bosing → telefonda o'sha ekran ochiladi; _layout.tsx — Stack =====
const FAYL_DARAXT = [
  { t: 'mobil/', d: 0 },
  { t: 'src/app/', d: 1 },
  { t: 'index.tsx', d: 2, k: 'index', manzil: '/' },
  { t: 'elon.tsx', d: 2, k: 'elon', manzil: '/elon' },
  { t: 'oyin/', d: 2 },
  { t: '[id].tsx', d: 3, k: 'oyin', manzil: '/oyin/1' },
  { t: '_layout.tsx', d: 2, k: 'layout' }
];
const FAYL_TARTIB = ['index', 'elon', 'oyin', 'layout'];
const S4_STACK = [[], [{ k: 'oyinlar' }], [{ k: 'oyinlar' }, { k: 'elon' }], [{ k: 'oyinlar' }, { k: 'elon' }, { k: 'oyin', id: '1' }]];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [n, setN] = useState(avval ? 4 : 0);
  const [stack, setStack] = useState(avval ? [{ k: 'oyinlar' }, { k: 'elon' }] : []);
  const [qiya, setQiya] = useState(false);
  const [chiq, setChiq] = useState(false);
  const [yur, setYur] = useState(false);
  const done = n >= 4 && !yur;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const och = (k) => {
    if (yur || FAYL_TARTIB[n] !== k) return;
    if (k !== 'layout') { setStack(S4_STACK[n + 1]); setN(n + 1); return; }
    setN(4); setYur(true);
    if (kam) { setStack(S4_STACK[2]); setYur(false); return; }
    keyin(() => setQiya(true), 350);
    keyin(() => setQiya(false), 1900);
    keyin(() => setChiq(true), 2300);
    keyin(() => { setChiq(false); setStack(S4_STACK[2]); setYur(false); }, 2700);
  };
  const ochildi = (k) => FAYL_TARTIB.indexOf(k) < n;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · navigatsiya', ru: 'Понятие · навигация' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Fayllarni oching (${n}/4)`, ru: `Откройте файлы (${n}/4)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ilovaning har ekrani <span className="italic" style={{ color: T.accent }}>qaysi faylda</span> turadi?</>, ru: <>В каком <span className="italic" style={{ color: T.accent }}>файле</span> живёт каждый экран приложения?</> })}
        mentor={<Mentor>{n < 4
          ? tx({ uz: "`src/app/` papkasidagi fayllarni birma-bir bosing — telefonda qaysi ekran ochilishini ko'rasiz.", ru: 'Нажимайте на файлы в папке `src/app/` по одному — увидите, какой экран откроется на телефоне.' })
          : tr({ uz: "8-Modulda Stack Navigator bilan ekrandan ekranga o'tgansiz — Expo Router'da ham Stack bor, faqat har ekran — alohida fayl.", ru: 'В 8-м модуле вы переходили между экранами через Stack Navigator — в Expo Router тоже есть Stack, только каждый экран — отдельный файл.' })}</Mentor>}
        vizual={<div className="ep-yonma">
          <JamoaTelefon holat="expo" stack={qiya ? S4_STACK[3] : stack} qiya={qiya} chiq={chiq} bosh={stack.length === 0 && !qiya ? <div className="ep-bosh-sahifa" /> : undefined} />
          <div className="ep-ong">
            <div className="ep-daraxt">
              {FAYL_DARAXT.map((f, i) => {
                const st = { paddingLeft: (10 + f.d * 16) + 'px' };
                if (!f.k) return <span key={i} className="ep-papka" style={st}>{f.t}</span>;
                const o = ochildi(f.k), joriy = !tugadi && FAYL_TARTIB[n] === f.k;
                return (
                  <span key={i} className="ep-fayl-q" style={st}>
                    <button type="button" className={cxx('ep-fayl', o && 'ok', joriy && 'ep-halqa')} disabled={!joriy || yur} onClick={() => och(f.k)}>
                      <i className="ep-fayl-b" aria-hidden="true">{o ? '✓' : ''}</i>{f.t}
                    </button>
                    {o && f.manzil && <code className="ep-yol-y fade-step">{f.manzil}</code>}
                    {o && f.k === 'layout' && <code className="ep-pufak fade-step">{'<Stack />'}</code>}
                    {n >= 4 && f.k === 'layout' && !yur && <span className="ep-bog fade-step">{tr({ uz: "ekran emas — ularni bog'laydi", ru: 'не экран — связывает их' })}</span>}
                  </span>
                );
              })}
            </div>
            {!tugadi && <p className="ep-izoh">{tx({ uz: "`.tsx` — TypeScript'dagi React fayli: kodni agent yozadi, siz o'qiysiz", ru: '`.tsx` — файл React на TypeScript: код пишет агент, вы читаете' })}</p>}
            {!tugadi && <Sanoq yorliq={{ uz: 'Ochildi', ru: 'Открыто' }} n={n} jami={4} />}
            {done && <p className="ep-nom fade-step">{tr({ uz: <>Ekranlarni fayllar bilan tuzadigan bu navigatsiya <b>Expo Router</b> deyiladi: bu misolda har ekran o'z faylida.</>, ru: <>Эта навигация, где экраны собираются из файлов, называется <b>Expo Router</b>: в этом примере каждый экран в своём файле.</> })}</p>}
          </div>
        </div>}
        xulosa={done && tx({ uz: "Bu misolda uch ekran — uch fayl; `_layout.tsx` ularni Stack qilib ustma-ust qo'yadi.", ru: 'В этом примере три экрана — три файла; `_layout.tsx` складывает их стопкой (Stack).' })}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — TUSHUNCHA (bashorat + harakat): to'rt kartani bosing — har safar o'sha bitta oyin/[id].tsx ochiladi =====
const S5_TAXMIN = [{ k: '1', t: { uz: '1 ta', ru: '1' } }, { k: '2', t: { uz: '2 ta', ru: '2' } }, { k: '4', t: { uz: '4 ta', ru: '4' } }];
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [ochilgan, setOchilgan] = useState(avval ? NAMUNA_OYINLAR.map(o => o.id) : []);
  const [joriy, setJoriy] = useState(null); // { id, b } — b: 1 push · 2 manzil · 3 fayl · 4 O'yin ekrani · 5 qaytish
  const done = ochilgan.length >= 4 && !joriy;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const bos = (id) => {
    if (!taxmin || joriy || ochilgan.includes(id)) return;
    setJoriy({ id, b: 1 });
    keyin(() => setJoriy({ id, b: 2 }), ms(380));
    keyin(() => setJoriy({ id, b: 3 }), ms(760));
    keyin(() => setJoriy({ id, b: 4 }), ms(1100));
    keyin(() => setJoriy({ id, b: 5 }), ms(2300));
    keyin(() => { setJoriy(null); setOchilgan(o => (o.includes(id) ? o : [...o, id])); }, ms(2650));
  };
  const keyingi = (NAMUNA_OYINLAR.find(o => !ochilgan.includes(o.id)) || {}).id;
  const b = joriy ? joriy.b : 0;
  const stack = joriy && b >= 4 ? [{ k: 'oyinlar' }, { k: 'oyin', id: joriy.id }] : [{ k: 'oyinlar' }];
  const tx5 = S5_TAXMIN.find(x => x.k === taxmin);
  const savol = tr({ uz: "To'rt o'yin uchun nechta O'yin fayli kerak?", ru: 'Сколько файлов «Игра» нужно для четырёх игр?' });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · [id]', ru: 'Понятие · [id]' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `To'rt o'yinni oching (${ochilgan.length}/4)`, ru: `Откройте четыре игры (${ochilgan.length}/4)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>To'rt o'yin uchun <span className="italic" style={{ color: T.accent }}>nechta O'yin fayli</span> kerak?</>, ru: <>Сколько <span className="italic" style={{ color: T.accent }}>файлов «Игра»</span> нужно для четырёх игр?</> })}
        mentor={<Mentor>{tr({ uz: "Avval javobni belgilang, keyin O'yinlar ekranidagi to'rt kartani birma-bir bosing.", ru: 'Сначала отметьте ответ, потом нажмите по очереди четыре карточки на экране «Игры».' })}</Mentor>}
        bashorat={<Bashorat savol={savol} variantlar={S5_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="ep-yonma">
          <JamoaTelefon holat="expo" stack={stack} chiq={b === 5}
            onKarta={tugadi ? undefined : bos} halqa={taxmin && !joriy && !tugadi ? keyingi : null} bosilgan={b === 1 ? joriy.id : null} ochilgan={ochilgan} xira={!taxmin} />
          <div className="ep-ong">
            <KodKarta fayl="src/app/index.tsx" yon={b >= 1 && b < 4}>
              {'const router = useRouter();\n'}
              <span className={cxx(b >= 1 && b < 4 && 'ep-yon')}>{'<Pressable onPress={() => router.push(`/oyin/${o.id}`)}>'}</span>
              {'\n  <Text>{o.kun}, {o.soat}</Text>\n</Pressable>'}
            </KodKarta>
            {!done
              ? <code className={cxx('ep-yol-yorliq', b >= 2 && 'bor')} key={joriy ? joriy.id + (b >= 2) : 'bo'}>{b >= 2 ? '/oyin/' + joriy.id : '/oyin/…'}</code>
              : <div className="ep-ulash fade-step">
                <div className="ep-ulash-chap">{NAMUNA_OYINLAR.map(o => <code key={o.id} className="ep-yol-yorliq bor">{'/oyin/' + o.id}</code>)}</div>
                <svg className="ep-ulash-ch" viewBox="0 0 60 120" preserveAspectRatio="none" aria-hidden="true">{[15, 45, 75, 105].map((y, i) => <path key={i} d={`M0 ${y} C 30 ${y}, 30 60, 60 60`} />)}</svg>
                <code className="ep-fayl-yorliq">oyin/[id].tsx</code>
              </div>}
            <KodKarta fayl="src/app/oyin/[id].tsx" yon={b >= 3 && b < 5} className={cxx(b >= 3 && b < 5 && 'ep-fayl-yon')}>
              {'const { id } = useLocalSearchParams();'}{b >= 3 && joriy && <span className="ep-qiymat" key={joriy.id}>{" = '" + joriy.id + "'"}</span>}
              {'\nconst oyin = oyinlar.find((o) => o.id === id);'}
            </KodKarta>
            {!tugadi && <Sanoq yorliq={{ uz: 'Ochildi', ru: 'Открыто' }} n={ochilgan.length} jami={4} />}
          </div>
        </div>}
        natija={done && tx5 && <NatijaBlok togri={taxmin === '1'}
          haqiqat={<Haqiqat taxmin={tr(tx5.t)} haqiqat={tr({ uz: '1 ta', ru: '1' })} />}
          xulosa={tx({ uz: "Bu misolda to'rt o'yin bitta `oyin/[id].tsx` faylidan ochiladi: `router.push` manzilga o'yin raqamini qo'yadi.", ru: 'В этом примере четыре игры открываются из одного файла `oyin/[id].tsx`: `router.push` подставляет номер игры в адрес.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 6 — 2-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s6 = 3, D) =====
const Screen6 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Ilovaga «Kirish» ekrani kerak. Expo Router'da nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Ilovaga «Kirish» ekrani kerak. <span className="italic" style={{ color: T.accent }}>Expo Router'da nima qilasiz?</span></h2>, ru: <h2 className="title h-ask">Приложению нужен экран «Вход». <span className="italic" style={{ color: T.accent }}>Что сделаете в Expo Router?</span></h2> })}
    options={[
      { uz: '`_layout.tsx` fayliga ekran kodini yozaman', ru: 'Напишу код экрана в файл `_layout.tsx`' },
      { uz: "`index.tsx` faylining oxiriga qo'shaman", ru: 'Добавлю в конец файла `index.tsx`' },
      { uz: "`App.js` da yangi Stack ekranini e'lon qilaman", ru: 'Объявлю новый экран Stack в `App.js`' },
      { uz: '`src/app/` da `kirish.tsx` faylini ochaman', ru: 'Создам файл `kirish.tsx` в `src/app/`' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Expo Router'da ekran fayli o'z manzilida ochiladi: `kirish.tsx` — `/kirish`.", ru: 'В Expo Router файл экрана открывается по своему адресу: `kirish.tsx` — `/kirish`.' }}
    explainWrong={{
      0: { uz: '`_layout.tsx` ekranlarni Stack qiladi — o\'zi ekran emas.', ru: '`_layout.tsx` складывает экраны в Stack — сам он не экран.' },
      1: { uz: "`index.tsx` — bitta ekran: O'yinlar ro'yxati.", ru: '`index.tsx` — один экран: список «Игры».' },
      2: { uz: "Bu — 8-Moduldagi yo'l; Expo Router boshqacha ishlaydi.", ru: 'Это путь из 8-го модуля; Expo Router работает иначе.' },
      default: { uz: "Expo Router'da ekran fayli o'z manzilida ochiladi.", ru: 'В Expo Router файл экрана открывается по своему адресу.' }
    }} />
);

// ===== SCREEN 7 — TUSHUNCHA (uch holat ketma-ket, SABOQ 8): telefon CHAPDA → Wi-Fi → kompyuter terminali va QR =====
const S7_HOLAT = [
  { yorliq: { uz: '1-holat · bitta Wi-Fi', ru: 'Случай 1 · одна Wi-Fi' }, tel: 'Android',
    mentor: { uz: "Telefon va kompyuter bitta Wi-Fi'da — telefonda «QR'ni skanerlash»ni bosing.", ru: 'Телефон и компьютер в одной Wi-Fi — нажмите на телефоне «Сканировать QR».' } },
  { yorliq: { uz: "2-holat · maktab Wi-Fi'i", ru: 'Случай 2 · школьная Wi-Fi' }, tel: 'Android',
    mentor: { uz: "Endi ikkalasi maktab Wi-Fi'ida, lekin QR ochilmadi — yechimni tanlang.", ru: 'Теперь оба в школьной Wi-Fi, но QR не открылся — выберите решение.' },
    yechim: [{ k: 'qayta', t: { uz: 'Kompyuterni qayta yoqish', ru: 'Перезагрузить компьютер' } }, { k: 'tunnel', t: { uz: '`npx expo start --tunnel`', ru: '`npx expo start --tunnel`' }, togri: true }],
    xato: { uz: 'Kompyuter joyida — umumiy tarmoq ulanishni to\'sib qo\'ydi.', ru: 'Компьютер в порядке — общая сеть заблокировала подключение.' } },
  { yorliq: { uz: '3-holat · iPhone', ru: 'Случай 3 · iPhone' }, tel: 'iPhone',
    mentor: { uz: "Endi telefon iPhone, Expo Go esa akkaunt so'radi — yechimni tanlang.", ru: 'Теперь телефон — iPhone, а Expo Go просит аккаунт — выберите решение.' },
    yechim: [{ k: 'ornat', t: { uz: "Expo Go'ni qayta o'rnatish", ru: 'Переустановить Expo Go' } }, { k: 'akkaunt', t: { uz: 'Ikkalasida bitta Expo akkaunti', ru: 'Один аккаунт Expo на обоих' }, togri: true }],
    xato: { uz: 'Ilova joyida — u kompyuter bilan bitta akkaunt kutadi.', ru: 'Приложение в порядке — оно ждёт тот же аккаунт, что на компьютере.' } }
];
// QR — chizilgan (tasodifiy kataklar, haqiqiy havola emas; KOD 7). urug' — ikki xil naqsh (tunnel bilan yangi QR)
const QrRasm = ({ urug = 1, className }) => {
  const N = 17;
  let s = urug * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const burch = (x, y) => (x < 5 && y < 5) || (x > N - 6 && y < 5) || (x < 5 && y > N - 6);
  const kat = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!burch(x, y) && rnd() > 0.52) kat.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" />);
  const ko = (x, y) => <g key={'b' + x + y}><rect x={x} y={y} width="5" height="5" className="o" /><rect x={x + 1} y={y + 1} width="3" height="3" className="i" /><rect x={x + 2} y={y + 2} width="1" height="1" /></g>;
  return <svg className={cxx('ep-qr', className)} viewBox={`-1 -1 ${N + 2} ${N + 2}`} aria-hidden="true"><rect x="-1" y="-1" width={N + 2} height={N + 2} className="fon" />{kat}{ko(0, 0)}{ko(N - 5, 0)}{ko(0, N - 5)}</svg>;
};
const WifiBelgi = ({ holat }) => (
  <svg className={cxx('ep-wifi', holat)} viewBox="0 0 32 24" aria-hidden="true">
    <path d="M2 8.5a20 20 0 0 1 28 0" /><path d="M7 13.5a13 13 0 0 1 18 0" /><path d="M11.8 18.2a6 6 0 0 1 8.4 0" /><circle cx="16" cy="21.5" r="1.8" />
  </svg>
);
const BulutBelgi = () => (
  <svg className="ep-bulut" viewBox="0 0 40 26" aria-hidden="true"><path d="M11 24h19a8 8 0 0 0 1-16 10 10 0 0 0-19-2A9 9 0 0 0 11 24z" /></svg>
);
const ExpoGoOyna = ({ akk }) => (
  <div className="ep-expogo">
    <span className="ep-expogo-bar"><b>Expo Go</b><i className={cxx('ep-akk', akk)} aria-hidden="true" /></span>
    <span className="ep-expogo-t">{tr({ uz: 'Loyihalar', ru: 'Проекты' })}</span>
  </div>
);
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [h, setH] = useState(avval ? 2 : 0);
  const [faza, setFaza] = useState(avval ? 'ok' : 'kut'); // kut · uch · xato · ok
  const [ulandi, setUlandi] = useState(avval ? 3 : 0);
  const [xato, setXato] = useState(null);
  const [kamera, setKamera] = useState(false);
  const [uzildi, setUzildi] = useState(false);
  const [tunnel, setTunnel] = useState(avval);
  const [login, setLogin] = useState(avval);
  const [nom, setNom] = useState(avval);
  const done = ulandi >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const D = ms(PARVOZ_MS);
  const ulan = (yangiH) => {
    setFaza('ok'); setUlandi(u => u + 1);
    if (yangiH < 3) keyin(() => { setH(yangiH); setFaza('kut'); setXato(null); setUzildi(false); }, ms(1700));
  };
  const skaner = () => {
    if (faza !== 'kut') return;
    setFaza('uch'); setKamera(true);
    keyin(() => setKamera(false), ms(700));
    if (h === 0) {
      keyin(() => uchir('.ep-telefon', '.ep-wifi', ''), ms(700));
      keyin(() => uchir('.ep-wifi', '.ep-qr', ''), ms(700) + D);
      keyin(() => uchir('.ep-qr', '.ep-telefon', 'javob', D * 2 || PARVOZ_MS), ms(700) + 2 * D);
      keyin(() => ulan(1), ms(700) + 4 * D);
    } else if (h === 1) {
      keyin(() => uchir('.ep-telefon', '.ep-wifi', ''), ms(700));
      keyin(() => { setUzildi(true); setFaza('xato'); }, ms(700) + D);
    } else keyin(() => setFaza('xato'), ms(800));
  };
  const yech = (y) => {
    if (faza !== 'xato') return;
    if (!y.togri) { setXato({ k: y.k, n: Date.now() }); return; }
    setXato(null); setFaza('uch');
    if (h === 1) {
      setTunnel(true); setUzildi(false);
      keyin(() => uchir('.ep-telefon', '.ep-bulut', ''), ms(500));
      keyin(() => uchir('.ep-bulut', '.ep-qr', ''), ms(500) + D);
      keyin(() => uchir('.ep-qr', '.ep-telefon', 'javob', D * 2 || PARVOZ_MS), ms(500) + 2 * D);
      keyin(() => { setNom(true); ulan(2); }, ms(500) + 4 * D);
    } else {
      setLogin(true);
      keyin(() => uchir('.ep-telefon', '.ep-qr', ''), ms(500));
      keyin(() => ulan(3), ms(500) + D + ms(300));
    }
  };
  const H = S7_HOLAT[Math.min(h, 2)];
  const okH = faza === 'ok';
  const akk = h === 2 ? (login ? 'ok' : faza === 'xato' ? 'xato' : '') : '';
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Expo Go', ru: 'Понятие · Expo Go' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Uch holatni tekshiring (${ulandi}/3)`, ru: `Проверьте три случая (${ulandi}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Telefon kompyuterdagi ilovani <span className="italic" style={{ color: T.accent }}>qanday topadi</span>?</>, ru: <>Как телефон <span className="italic" style={{ color: T.accent }}>находит приложение</span> на компьютере?</> })}
        mentor={<Mentor>{tr(H.mentor)}</Mentor>}
        vizual={<div className="ep-s7" ref={box}>
          {!tugadi && <div className="ep-holatlar">
            {S7_HOLAT.map((x, i) => <span key={i} className={cxx('ep-holat', i < h || (i === h && okH) ? 'ok' : i === h ? 'on' : '')}>{(i < h || (i === h && okH)) && '✓ '}{tr(x.yorliq)}</span>)}
            {okH && <b className="ep-ulandi fade-step">{h === 1 ? tr({ uz: 'Ulandi ✓ · sekinroq', ru: 'Подключено ✓ · медленнее' }) : tr({ uz: 'Ulandi ✓', ru: 'Подключено ✓' })}</b>}
          </div>}
          <div className="ep-s7-qator">
            <JamoaTelefon holat="expo" yorliq={H.tel}
              stack={okH || done ? [{ k: 'oyinlar' }] : []}
              bosh={okH || done ? undefined : (uzildi ? <div className="ep-ulanmadi"><span>{tr({ uz: 'ulanmadi', ru: 'не подключено' })}</span></div> : <ExpoGoOyna akk={akk} />)}
              past={!tugadi && <QTugma className={faza === 'kut' ? 'ep-halqa' : undefined} disabled={faza !== 'kut'} onClick={skaner}>{tr({ uz: "QR'ni skanerlash", ru: 'Сканировать QR' })}</QTugma>} />
            <div className="ep-tarmoq">
              {(h >= 1 && tunnel) && <span className="ep-bulut-q fade-step"><BulutBelgi /><small>{tr({ uz: 'internet', ru: 'интернет' })}</small></span>}
              <span className={cxx('ep-chiziq', uzildi && 'uzildi')} aria-hidden="true" />
              <WifiBelgi holat={uzildi ? 'xato' : okH && h === 0 ? 'ok' : ''} />
              {!tugadi && faza === 'xato' && H.yechim && <div className="ep-tarmoq-past fade-step">
                <div className="ep-yechimlar ep-halqa">
                  {H.yechim.map(y => {
                    const silk = xato && xato.k === y.k;
                    return <QChip key={silk ? y.k + xato.n : y.k} silk={silk} onClick={() => yech(y)}>{tx(y.t)}</QChip>;
                  })}
                </div>
                {xato && <QXato>{tr(H.xato)}</QXato>}
              </div>}
            </div>
            <div className="ep-term">
              <span className="ep-term-q buyruq" key={tunnel ? 't' : 's'}>{tunnel ? '$ npx expo start --tunnel' : '$ npx expo start'}</span>
              <span className="ep-qr-q"><QrRasm urug={tunnel ? 7 : 3} key={tunnel ? 'q7' : 'q3'} className={cxx(tunnel && 'yangi')} />{kamera && <i className="ep-kamera" aria-hidden="true" />}</span>
              {login && <span className="ep-term-q buyruq fade-step">$ npx expo login</span>}
            </div>
          </div>
          {parvoz.map(p => <Konvert key={p.k} p={p} />)}
        </div>}
        natija={nom && <p className="ep-nom fade-step">{tr({ uz: <><b>Tunnel</b> — telefon kompyuterga internet orqali ulanadigan yo'l: sekinroq, lekin umumiy tarmoqda yordam berishi mumkin.</>, ru: <><b>Tunnel</b> — путь, по которому телефон подключается к компьютеру через интернет: медленнее, но в общей сети может помочь.</> })}</p>}
        xulosa={done && tx({ uz: "Bu darsda QR odatda bitta Wi-Fi'da ochiladi; ochilmasa — `--tunnel`, iPhone'da — bitta Expo akkaunti.", ru: 'На этом уроке QR обычно открывается в одной Wi-Fi; если нет — `--tunnel`, на iPhone — один аккаунт Expo.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 8 — 3-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s8 = 0, A) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="Telefonni Wi-Fi'ga ulab bo'lmaydi, u mobil internetda. QR'ni qanday ochasiz?"
    question={tr({ uz: <h2 className="title h-ask">Telefonni Wi-Fi'ga ulab bo'lmaydi, u mobil internetda. <span className="italic" style={{ color: T.accent }}>QR'ni qanday ochasiz?</span></h2>, ru: <h2 className="title h-ask">Телефон нельзя подключить к Wi-Fi, он в мобильном интернете. <span className="italic" style={{ color: T.accent }}>Как откроете QR?</span></h2> })}
    options={[
      { uz: '`npx expo start --tunnel` bilan qayta ochaman', ru: 'Перезапущу через `npx expo start --tunnel`' },
      { uz: "Expo Go'ni o'chirib, qaytadan o'rnataman", ru: 'Удалю Expo Go и установлю заново' },
      { uz: 'Loyihani boshqa nom bilan qayta yarataman', ru: 'Создам проект заново под другим именем' },
      { uz: "QR'ni kompyuter kamerasi bilan skanerlayman", ru: 'Отсканирую QR камерой компьютера' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Tunnel telefonni kompyuterga internet orqali ulaydi — bitta Wi-Fi shart emas.', ru: "Tunnel подключает телефон к компьютеру через интернет — одна Wi-Fi не нужна." }}
    explainWrong={{
      1: { uz: 'Expo Go joyida: telefon kompyuterga yetib bormayapti.', ru: 'Expo Go в порядке: телефон не достаёт до компьютера.' },
      2: { uz: "Loyiha nomi ulanishga ta'sir qilmaydi.", ru: 'Имя проекта не влияет на подключение.' },
      3: { uz: 'QR\'ni telefon skanerlaydi, kompyuter uni faqat ko\'rsatadi.', ru: 'QR сканирует телефон, компьютер его только показывает.' },
      default: { uz: 'Tunnel telefonni kompyuterga internet orqali ulaydi.', ru: "Tunnel подключает телефон к компьютеру через интернет." }
    }} />
);

// ===== SCREEN 9 — TUSHUNCHA (bashorat + kenglik): surgich bilan brauzer oynasini toraytiring → «Telefon uchun qoida» =====
const S9_TAXMIN = [{ k: 'qisil', t: { uz: 'Yonma-yon qisilib qoladi', ru: 'Сожмутся рядом' } }, { k: 'ust', t: { uz: "O'zi ustma-ust tushadi", ru: 'Сами встанут друг под другом' } }];
const K_MIN = 390, K_MAX = 1200, K_CHEGARA = 600;
const BrauzerOyna = ({ kenglik = K_MAX, qoida }) => {
  const t = (kenglik - K_MIN) / (K_MAX - K_MIN);
  const tartib = kenglik < K_CHEGARA ? (qoida ? 'ustun' : 'qisiq') : 'qator';
  return (
    <div className="ep-br" style={{ width: `calc(272px + (100% - 272px) * ${t.toFixed(3)})` }}>
      <span className="ep-komp-bar"><i /><i /><i /><span>localhost:5173</span></span>
      <div className={cxx('ep-br-tana', tartib)}>
        <b className="ep-komp-sar">{tr(JAMOA_EKRANLAR.oyinlar)}</b>
        <div className="ep-br-ro">
          {NAMUNA_OYINLAR.map(o => <span key={o.id} className="ep-br-k"><b>{tr(o.kun)}, {o.soat}</b><span>{tr(o.maydon)}</span><span className="ep-k-son">{o.bor} / {o.kerak}</span></span>)}
        </div>
      </div>
    </div>
  );
};
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [kenglik, setKenglik] = useState(avval ? K_MIN : K_MAX);
  const [toraydi, setToraydi] = useState(avval);
  const [qoida, setQoida] = useState(avval);
  const done = toraydi && qoida;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const sur = (v) => { setKenglik(v); if (v < K_CHEGARA) setToraydi(true); };
  const tx9 = S9_TAXMIN.find(x => x.k === taxmin);
  const savol = tr({ uz: "Telefon kengligida o'yin kartalari qanday turadi?", ru: 'Как встанут карточки игр на ширине телефона?' });
  const kYorliq = kenglik <= K_MIN ? tr({ uz: '390 px · telefon', ru: '390 px · телефон' }) : (kenglik >= K_MAX ? tr({ uz: 'Kenglik: 1200 px', ru: 'Ширина: 1200 px' }) : `${kenglik} px`);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · web-trek', ru: 'Понятие · веб-трек' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Toraytiring va qoidani yoqing (${(toraydi ? 1 : 0) + (qoida ? 1 : 0)}/2)`, ru: `Сузьте и включите правило (${(toraydi ? 1 : 0) + (qoida ? 1 : 0)}/2)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Telefon kengligida o'yin kartalari <span className="italic" style={{ color: T.accent }}>qanday turadi</span>?</>, ru: <>Как встанут карточки игр <span className="italic" style={{ color: T.accent }}>на ширине телефона</span>?</> })}
        mentor={<Mentor>{!toraydi
          ? tr({ uz: "Web-trekda prototip telefon brauzerida ochiladi — avval javobni belgilang, keyin surgich bilan sahifani telefon kengligigacha toraytiring.", ru: 'В веб-треке прототип открывается в браузере телефона — сначала отметьте ответ, потом ползунком сузьте страницу до ширины телефона.' })
          : tr({ uz: "Endi «Telefon uchun qoida» kalitini yoqing.", ru: 'Теперь включите переключатель «Правило для телефона».' })}</Mentor>}
        bashorat={<Bashorat savol={savol} variantlar={S9_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="ep-yonma ep-s9">
          <div className={cxx('ep-s9-chap', !taxmin && 'xira')}>
            <BrauzerOyna kenglik={kenglik} qoida={qoida} />
            <label className={cxx('ep-surgich', taxmin && !toraydi && 'ep-halqa')}>
              <span className="ep-surgich-y">{kYorliq}</span>
              <input type="range" min={K_MIN} max={K_MAX} step={10} value={kenglik} disabled={!taxmin} onChange={e => sur(Number(e.target.value))} aria-label={tr({ uz: 'Kenglik', ru: 'Ширина' })} />
            </label>
          </div>
          <div className="ep-ong">
            <KodKarta fayl="style.css">
              {'.oyinlar { display: flex; gap: 12px; }'}
              {qoida && <span className="ep-css-yangi">{'\n@media (max-width: 600px) {\n  .oyinlar { flex-direction: column; }\n}'}</span>}
            </KodKarta>
          </div>
        </div>}
        harakat={!tugadi && <div className="ep-harakat">
          <QTugma className={cxx('ep-kalit', qoida && 'on', toraydi && !qoida && 'ep-halqa')} disabled={!toraydi || qoida} aria-pressed={qoida} onClick={() => setQoida(true)}><i className="ep-kalit-i" aria-hidden="true" />{tr({ uz: 'Telefon uchun qoida', ru: 'Правило для телефона' })}</QTugma>
        </div>}
        natija={done && tx9 && <NatijaBlok togri={taxmin === 'qisil'}
          haqiqat={<Haqiqat taxmin={tr(tx9.t)} haqiqat={tr({ uz: 'yonma-yon qisiladi', ru: 'сжимаются рядом' })} />}
          izoh={tr({ uz: <>Telefon kengligiga moslashadigan sayt <b>adaptiv sayt</b> deyiladi.</>, ru: <>Сайт, который подстраивается под ширину телефона, называется <b>адаптивным сайтом</b>.</> })}
          xulosa={tx({ uz: "Bu misolda `@media` oyna kengligini so'raydi: 600 px dan tor oynada kartalar ustma-ust turadi.", ru: "В этом примере `@media` спрашивает ширину окна: в окне меньше 600 px карточки стоят друг под другом." })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 10 — KOD YOZISH (QKod + HtmlCompiler, ko'p fayl: index.html tayyor · style.css o'quvchi). Shartlar — stylesheet tahlili (regex emas); «Bajardim» shartlar ✓ bo'lgach =====
// Natija oynasi kengligi («Kompyuter» 900 px · «Telefon» 390 px) — HtmlCompiler da yo'q (TAYANCHGA SAVOL 8), shuning uchun darsning o'z natija oynasida (kompilyatordan qaytgach)
const KOD_HTML = `<div class="oyinlar">
  <div class="karta">Shanba, 18:00 · Mahalla maydoni · 8 / 10</div>
  <div class="karta">Shanba, 20:00 · Maktab maydoni · 6 / 10</div>
  <div class="karta">Yakshanba, 10:00 · Park maydoni · 4 / 8</div>
  <div class="karta">Yakshanba, 17:00 · Mahalla maydoni · 9 / 10</div>
</div>
`;
const KOD_CSS = { uz: `.oyinlar {
  display: flex;
  gap: 12px;
}
.karta {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
}
/* telefon uchun qoida shu yerga */
`, ru: `.oyinlar {
  display: flex;
  gap: 12px;
}
.karta {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
}
/* правило для телефона — сюда */
` };
const KOD_KALIT = 'pm-m9d9-code';
// @media tahlili: brauzerning o'z stylesheet parseri (CSSOM) — media sharti va ichidagi qoida alohida ko'riladi
const cssVaraq = (css) => {
  try {
    if (typeof CSSStyleSheet !== 'undefined' && CSSStyleSheet.prototype.replaceSync) { const s = new CSSStyleSheet(); s.replaceSync(String(css || '').replace(/@import[^;]*;?/gi, '')); return [...s.cssRules]; }
  } catch { /* yaroqsiz CSS — qoida yo'q */ }
  return [];
};
const mediaKenglik = (r) => { const m = /max-width\s*:\s*(\d+(?:\.\d+)?)px/.exec((r.media && r.media.mediaText) || ''); return m ? Number(m[1]) : NaN; };
const telefonMedia = (css) => cssVaraq(css).filter(r => r.media && r.cssRules && (() => { const w = mediaKenglik(r); return w >= 320 && w <= 768; })());
const ustunQoida = (css) => telefonMedia(css).some(r => [...r.cssRules].some(q => q.selectorText && q.selectorText.split(',').map(x => x.trim()).includes('.oyinlar') && q.style && q.style.flexDirection === 'column'));
const KOD_VAZIFA = [
  { uz: 'Faylning oxiriga yozing: `@media (max-width: 600px) { }`', ru: 'Допишите в конец файла: `@media (max-width: 600px) { }`' },
  { uz: 'Qavslar ichiga: `.oyinlar { flex-direction: column; }`', ru: 'Внутрь скобок: `.oyinlar { flex-direction: column; }`' },
  { uz: 'Natija oynasida «Telefon» kengligini tanlang — kartalar ustma-ust tursin.', ru: 'В окне результата выберите ширину «Телефон» — карточки должны встать друг под другом.' }
];
// HtmlCompiler shart yorlig'i va maslahatini xom matn qilib chiqaradi — backtik olib tashlanadi (matn o'zi o'zgarmaydi)
const bt = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v).replace(/`/g, '')]));
const shart = (id, label, fn, hint) => ({ id, label: bt(label), check: C.custom(x => fn(x) || tr(bt(hint))) });
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish · adaptiv sayt', ru: 'Пишем код · адаптивный сайт' },
  title: { uz: 'style.css — telefonda kartalar ustma-ust', ru: 'style.css — на телефоне карточки друг под другом' },
  files: [
    { name: 'style.css', lang: 'css', starter: KOD_CSS },
    { name: 'index.html', lang: 'html', starter: KOD_HTML }
  ],
  requirements: [
    shart('media', KOD_VAZIFA[0], x => telefonMedia(x.css).length > 0, { uz: "`@media` da `max-width` va px bilan kenglik bo'lsin.", ru: 'Пусть в `@media` будет `max-width` и ширина в px.' }),
    shart('ustun', KOD_VAZIFA[1], x => ustunQoida(x.css), { uz: "`@media` ichida `.oyinlar` ga `flex-direction: column` bo'lsin.", ru: 'Пусть внутри `@media` у `.oyinlar` будет `flex-direction: column`.' })
  ]
};
const natijaHujjat = (codes) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;padding:16px;font-family:system-ui,sans-serif;font-size:15px;line-height:1.35;color:#0E0E10;background:#fff}</style><style>${codes['style.css'] || ''}</style></head><body>${codes['index.html'] || KOD_HTML}</body></html>`;
// Natija oynasi: iframe haqiqiy kenglikda (900 / 390 px) ochiladi va ustunga sig'guncha kichraytiriladi — @media o'quvchining o'z kodida ishlaydi
const NATIJA_H = 250;
const NatijaOyna = ({ codes, kenglik }) => {
  const ref = useRef(null);
  const [w, setW] = useState(480);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const upd = () => setW(el.clientWidth || 480);
    upd();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(upd); ro.observe(el); return () => ro.disconnect();
  }, []);
  const k = kenglik === 'telefon' ? 390 : 900;
  const z = Math.min(1, w / k);
  return (
    <div className="ep-natija" ref={ref} style={{ height: NATIJA_H + 'px' }}>
      <iframe key={k} className="ep-natija-f" title="natija" sandbox="" srcDoc={natijaHujjat(codes)} style={{ width: k + 'px', height: (NATIJA_H / z) + 'px', transform: `scale(${z})`, left: Math.max(0, (w - k * z) / 2) + 'px' }} />
    </div>
  );
};
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — o'quvchi matni emas, qolip API nomi (9-Modul QKOD_ONG naqshi; MEXANIZM-TAKLIF 10)
const QKOD_ONG = 'muh\u0061rrir';
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [open, setOpen] = useState(false);
  const [codes, setCodes] = useState(() => (storedAnswer && storedAnswer.codes) || null);
  const [otdi, setOtdi] = useState(avval);
  const [kenglik, setKenglik] = useState(avval ? 'telefon' : 'komp');
  const [telKordi, setTelKordi] = useState(avval);
  const [done, setDone] = useState(avval);
  const [yordam, setYordam] = useState(false);
  const fayllar = codes || { 'style.css': tr(KOD_CSS), 'index.html': KOD_HTML };
  const finish = ({ codes: c }) => { setOpen(false); if (c) setCodes(c); setOtdi(true); };
  const tanla = (k) => { setKenglik(k); if (k === 'telefon') setTelKordi(true); };
  const bajardim = () => {
    if (done || !otdi || !telKordi) return;
    setDone(true);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, codes: fayllar, code: fayllar['style.css'], solved: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  const bandOk = [otdi, otdi, otdi && telKordi];
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · adaptiv sayt', ru: 'Пишем код · адаптивный сайт' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Telefonda kartalarni <span className="italic" style={{ color: T.accent }}>ustma-ust qo'yadigan</span> kod yozamiz.</>, ru: <>Пишем код: на телефоне карточки <span className="italic" style={{ color: T.accent }}>друг под другом</span>.</> })}
        mentor={<Mentor>{tx({ uz: "9-Modulda `@media` bilan harakatni o'chirgansiz, bugun u oyna kengligini so'raydi — kodni o'zingiz terib yozasiz, nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi.", ru: 'В 9-м модуле вы отключали движение через `@media`, сегодня он спрашивает ширину окна — код набираете сами, скопировать нельзя: учатся, когда пишут руками.' })}</Mentor>}
        vazifa={<ol className="ep-vazifa">{KOD_VAZIFA.map((v, i) => <li key={i} className={bandOk[i] ? 'ok' : undefined}><i>{bandOk[i] ? '✓' : i + 1}</i><span>{tx(v)}</span></li>)}</ol>}
        yordam={<div className="ep-yordam-k">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
          {yordam && <QIzoh>{tx({ uz: "Kartalar o'zgarmasa, `max-width` dan keyin ikki nuqta borligini va `.oyinlar` qoidasi `@media` qavslari ichida turganini tekshiring.", ru: 'Если карточки не меняются, проверьте двоеточие после `max-width` и что правило `.oyinlar` стоит внутри скобок `@media`.' })}</QIzoh>}
        </div>}
        bajardim={<div className="ep-bajardim"><QTugma className={otdi && telKordi && !done ? 'ep-halqa' : undefined} disabled={!otdi || !telKordi || done} onClick={bajardim}>{tr({ uz: 'Bajardim', ru: 'Готово' })}</QTugma></div>}
        {...{ [QKOD_ONG]: otdi
          ? <div className={cxx('ep-natija-q', done && 'q-fokus')}>
            <span className="q-yorliq">{tr({ uz: 'Natija oynasi', ru: 'Окно результата' })}</span>
            {!done && <div className={cxx('ep-kenglik', !telKordi && 'ep-halqa')}>
              <QChip holat={kenglik === 'komp' ? 'on' : undefined} onClick={() => tanla('komp')}>{tr({ uz: 'Kompyuter', ru: 'Компьютер' })} <small className="mono">900 px</small></QChip>
              <QChip holat={kenglik === 'telefon' ? 'on' : undefined} onClick={() => tanla('telefon')}>{tr({ uz: 'Telefon', ru: 'Телефон' })} <small className="mono">390 px</small></QChip>
            </div>}
            <NatijaOyna codes={fayllar} kenglik={kenglik} />
            {!done && <QTugma ikkinchi onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma>}
            {isMentor && <MentorPracticeStats live={live} screen={screen} />}
          </div>
          : <div className="ep-kodoyna">
            <KodKarta fayl="style.css">{String(fayllar['style.css'] || '').trimEnd()}</KodKarta>
            <div className="ep-amal">
              <QTugma className={!isMentor ? 'ep-halqa' : undefined} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma>
              <p className="ep-izoh">{tr({ uz: "Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Откроется окно кода — вы пишете код и видите результат здесь.' })}</p>
            </div>
            {isMentor && <MentorPracticeStats live={live} screen={screen} />}
          </div> }}
      >
        {done && <QXulosa>{tx({ uz: "Bitta `@media` qoidasi bilan o'sha sahifa telefonda ustma-ust, kompyuterda yonma-yon turadi.", ru: 'Одно правило `@media` — и та же страница на телефоне стоит столбиком, на компьютере — рядом.' })}</QXulosa>}
      </QKod>
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz) — qobiq tashqi zoomni bekor qiladi (9-Modul naqshi) */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} storageKey={KOD_KALIT} onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 11 — TUSHUNCHA (to'rt maydon + HTTPS, ketma-ket; SABOQ 13): manifest.webmanifest → bosh ekranda «Maydon Jamoa» =====
const MANIFEST = [
  { k: 'name', q: '"name": "Maydon Jamoa"' },
  { k: 'icons', q: '"icons": [192 px, 512 px]' },
  { k: 'start_url', q: '"start_url": "/"' },
  { k: 'display', q: '"display": "standalone"' }
];
const NETLIFY = 'maydon-jamoa-….netlify.app';
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [n, setN] = useState(avval ? 5 : 0);
  const [b, setB] = useState(avval ? 4 : 0); // Netlify: 1 sayt HTTPS da · 2 ikonka joyiga tushadi · 3 ikonka bosiladi · 4 manzil qatorisiz ochildi
  const done = n >= 5 && b >= 4;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const qosh = (i) => { if (i !== n || n >= 4) return; setN(n + 1); };
  const chiqar = () => {
    if (n !== 4) return;
    setN(5); setB(1);
    keyin(() => setB(2), ms(1500));
    keyin(() => setB(3), ms(2700));
    keyin(() => setB(4), ms(3100));
  };
  const tel = b === 1
    ? <JamoaTelefon holat="brauzer" yorliq={null} qulf manzil={'https://' + NETLIFY} stack={[{ k: 'oyinlar' }]} />
    : b >= 4
      ? <JamoaTelefon holat="expo" yorliq={null} stack={[{ k: 'oyinlar' }]} />
      : <JamoaTelefon holat="pwa" yorliq={null} bosh={<BoshEkran nom={n >= 1} ikonka={n >= 2 && (n < 5 || b >= 2)} tushdi={b === 2} bosildi={b === 3} />} />;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · PWA', ru: 'Понятие · PWA' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Shartlarni qo'shing (${n}/5)`, ru: `Добавьте условия (${n}/5)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Sayt telefonning bosh ekraniga <span className="italic" style={{ color: T.accent }}>qanday qo'shiladi</span>?</>, ru: <>Как сайт <span className="italic" style={{ color: T.accent }}>попадает на главный экран</span> телефона?</> })}
        mentor={<Mentor>{n < 4
          ? tr({ uz: "Chrome saytni o'rnatishni taklif qilishi uchun sayt o'zi haqida kichik fayl beradi — uning maydonlarini birma-bir qo'shing.", ru: 'Чтобы Chrome предложил установить сайт, сайт отдаёт небольшой файл о себе — добавьте его поля по одному.' })
          : tr({ uz: "Endi «Netlify'ga chiqarish»ni bosing — telefon saytni HTTPS manzilda ochadi.", ru: "Теперь нажмите «Выложить на Netlify» — телефон откроет сайт по HTTPS-адресу." })}</Mentor>}
        vizual={<div className="ep-yonma">
          <div className="ep-s11-chap">
            {tel}
            <div className="ep-pwa-yon">
              {n >= 2 && <span className="ep-o-ch fade-step"><i className="ep-ikonka kichik" aria-hidden="true" /><code>192</code><code>512</code></span>}
              {n >= 3 && <div className="ep-mini fade-step">
                {n < 4 && <span className="ep-mini-bar">maydon-jamoa…/</span>}
                <span className="ep-mini-t"><b className="ep-tel-nom">{JAMOA_NOM}</b><b>{tr(JAMOA_EKRANLAR.oyinlar)}</b>{NAMUNA_OYINLAR.slice(0, 2).map(o => <span key={o.id} className="ep-mini-k">{tr(o.kun)}, {o.soat}</span>)}</span>
              </div>}
            </div>
          </div>
          <div className="ep-ong">
            <div className="ep-manifest">
              <span className="ep-kod-f">manifest.webmanifest</span>
              <span className="ep-manifest-i">{tr({ uz: "sayt o'zi haqida yozgan fayl", ru: 'файл, который сайт пишет о себе' })}</span>
              {MANIFEST.map((m, i) => (
                <span key={m.k} className={cxx('ep-mf', i < n ? 'ok' : i === n ? 'joriy' : 'xira')}>
                  <code>{m.q}</code>
                  {i < n ? <b className="ep-mf-ok">✓</b> : !tugadi && <QTugma ikkinchi className={i === n ? 'ep-halqa' : undefined} disabled={i !== n} onClick={() => qosh(i)}>{tr({ uz: "Qo'shish", ru: 'Добавить' })}</QTugma>}
                </span>
              ))}
              <span className={cxx('ep-mf', 'netlify', n >= 5 ? 'ok' : n === 4 ? 'joriy' : 'xira')}>
                {n >= 5 ? <><i className="ep-qulf" aria-hidden="true" /><code>{'https://' + NETLIFY}</code><b className="ep-mf-ok">✓</b></> : !tugadi && <QTugma className={n === 4 ? 'ep-halqa' : undefined} disabled={n !== 4} onClick={chiqar}>{tr({ uz: "Netlify'ga chiqarish", ru: 'Выложить на Netlify' })}</QTugma>}
              </span>
            </div>
            {!tugadi && <Sanoq yorliq={{ uz: 'Shart', ru: 'Условие' }} n={n} jami={5} />}
          </div>
        </div>}
        natija={done && <p className="ep-nom fade-step">{tr({ uz: <>Bosh ekranga ilova kabi qo'shiladigan sayt <b>PWA (Progressive Web App)</b> deyiladi.</>, ru: <>Сайт, который добавляется на главный экран как приложение, называется <b>PWA (Progressive Web App)</b>.</> })}</p>}
        xulosa={done && tr({ uz: "Bu misolda manifestdagi to'rt maydon va HTTPS manzil saytni telefonga o'rnatiladigan qildi.", ru: "В этом примере четыре поля manifest и HTTPS-адрес сделали сайт устанавливаемым на телефон." })}
      />
    </Stage>
  );
};

// ===== SCREEN 12 — 4-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s12 = 2, C) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="Bugungi web-trekda saytni bosh ekranga qo'shish uchun nima tayyorlaysiz?"
    question={tr({ uz: <h2 className="title h-ask">Bugungi web-trekda saytni bosh ekranga qo'shish uchun <span className="italic" style={{ color: T.accent }}>nima tayyorlaysiz?</span></h2>, ru: <h2 className="title h-ask">Что подготовите в сегодняшнем веб-треке, чтобы <span className="italic" style={{ color: T.accent }}>добавить сайт на главный экран?</span></h2> })}
    options={[
      { uz: 'Sayt kompyuterdagi `localhost:5173` da ishlab tursin', ru: "Пусть сайт работает на компьютере на `localhost:5173`" },
      { uz: "Telefonga Expo Go ilovasi o'rnatilgan bo'lsin", ru: 'На телефоне пусть стоит приложение Expo Go' },
      { uz: 'Sayt manifesti bilan HTTPS manzilda tursin', ru: "Пусть сайт с manifest будет на HTTPS-адресе" },
      { uz: "Sayt Play Market'ga ilova bo'lib yuklansin", ru: "Пусть сайт загрузят в Play Market как приложение" }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Bugun manifest va HTTPS manzil tayyorlanadi — telefon saytni bosh ekranga shundan qo'shadi.", ru: "Сегодня готовят manifest и HTTPS-адрес — по ним телефон добавляет сайт на главный экран." }}
    explainWrong={{
      0: { uz: "`localhost` — telefonning o'zi: sayt u yerda yo'q.", ru: '`localhost` — это сам телефон: сайта там нет.' },
      1: { uz: 'Expo Go — React Native ilovasi uchun, sayt uchun emas.', ru: 'Expo Go — для приложения React Native, не для сайта.' },
      3: { uz: "PWA do'kondan emas, brauzerdan qo'shiladi.", ru: 'PWA добавляют не из магазина, а из браузера.' },
      default: { uz: 'Bugun manifest va HTTPS manzil tayyorlanadi.', ru: "Сегодня готовят manifest и HTTPS-адрес." }
    }} />
);

// ===== SCREEN 13 — FINAL (QTartib: TELEFON_YOLI dan; uyalar «bu yerga qo'ying» — tartibni ochmaydi; ball — birinchi to'liq urinish, sentinel 0) =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const wrongEverRef = useRef(false);
  const onWrong = () => { wrongEverRef.current = true; if (achMiss) achMiss.miss(screen); };
  const firedRef = useRef(!!storedAnswer);
  const [done, setDone] = useState(!!storedAnswer);
  const [recapOpen, setRecapOpen] = useState(false);
  const solve = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setDone(true);
    const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'Prototipni telefonga qaysi tartibda olib borasiz?', options: TELEFON_YOLI.map(z => ou(z.label).replace(/`/g, '')), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · tartib', ru: 'Итог · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Prototipni telefonga <span className="italic" style={{ color: T.accent }}>qaysi tartibda</span> olib borasiz?</>, ru: <>В каком <span className="italic" style={{ color: T.accent }}>порядке</span> вы донесёте прототип до телефона?</> })}</h2></div>
        <Mentor>{tr({ uz: "Mobil trekdagi bo'laklarni bajariladigan tartibda joylang.", ru: 'Разложите шаги мобильного трека в порядке выполнения.' })}</Mentor>
        <Zoomable>
          <QTartib onWrong={onWrong}
            items={TELEFON_YOLI.map(z => ({ id: z.id, label: tx(z.label) }))}
            joyMatn={tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}
            onSolved={solve}
            xatoMatn={tr({ uz: "Tartib xato — bo'lakni bosib qaytaring.", ru: 'Порядок неверный — нажмите на блок, чтобы вернуть его.' })}
          />
        </Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Avval loyiha va ulanish, keyin ekranlar: telefonda shablon ochilsa, ulanish joyida ekanini bilasiz.', ru: 'Сначала проект и подключение, потом экраны: если на телефоне открылся шаблон, значит подключение в порядке.' })}</p>
          {wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar, 4) — uch savol (birinchi urinish) + bonus: 2-amaliyot oxirgi «Bajardim» (ikkala trekda, birinchi urinish sharti yo'q — 152) =====
const ACHIEVEMENTS = {
  nativeCard: { icon: '🧩', name: 'Native Card', desc: { uz: 'Matn <Text> ichida turishini topdingiz', ru: "Вы поняли: текст стоит внутри <Text>" } },
  fileRouter: { icon: '🗂️', name: 'File Router', desc: { uz: 'Yangi ekran uchun yangi fayl ochishni bildingiz', ru: 'Вы знаете: для нового экрана — новый файл' } },
  tunnelFix: { icon: '🛰️', name: 'Tunnel Fix', desc: { uz: "Wi-Fi'siz QR'ni tunnel bilan ochishni bildingiz", ru: "Вы знаете, как открыть QR без Wi-Fi через tunnel" } },
  pocketPrototype: { icon: '📱', name: 'Pocket Prototype', desc: { uz: 'Ikkala amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили оба блока практики до конца' } }
};
// Ekran id → nishon. Savollarda — birinchi urinish; a2 — bonus (152)
const ACH_TRIGGERS = { s3: 'nativeCard', s6: 'fileRouter', s8: 'tunnelFix', a2: 'pocketPrototype' };

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


// Podium savol yorliqlari (kalitlar = SCORED_IDX: 3, 6, 8, 12, 13)
const Q_LABELS = {
  3: { uz: '1 — Matn qayerda', ru: '1 — Где текст' },
  6: { uz: '2 — Yangi ekran', ru: '2 — Новый экран' },
  8: { uz: "3 — Wi-Fi'siz QR", ru: '3 — QR без Wi-Fi' },
  12: { uz: '4 — PWA uchun nima kerak', ru: '4 — Что нужно для PWA' },
  13: { uz: "Yakuniy — telefonga yo'l", ru: 'Итог — путь на телефон' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (kod so'zlari ru'da ham o'sha; R-008)
const QZ_BG_SHAPES = [
  { ch: 'React Native', l: 4, t: 9, s: 24, d: 19, dl: 0 },
  { ch: 'Expo Router', l: 72, t: 7, s: 24, d: 23, dl: 1.5 },
  { ch: 'src/app/', l: 6, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: '<Stack />', l: 76, t: 70, s: 24, d: 21, dl: 2.2 },
  { ch: '[id].tsx', l: 44, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'Expo Go', l: 62, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: '--tunnel', l: 24, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: '@media', l: 18, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: 'PWA', l: 88, t: 44, s: 24, d: 22, dl: 0.6 },
  { ch: { uz: 'manifest', ru: "manifest" }, l: 36, t: 58, s: 20, d: 24, dl: 1.3 },
  { ch: 'QR', l: 54, t: 4, s: 22, d: 20, dl: 2.5 },
  { ch: 'Wi-Fi', l: 90, t: 84, s: 20, d: 26, dl: 0.2 },
  { ch: 'Expo', l: 2, t: 46, s: 22, d: 21, dl: 1.7 },
  { ch: 'Maydon Jamoa', l: 30, t: 2, s: 20, d: 28, dl: 2.1 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (MD aynan)
const QUIZ_BANK = [
  { q: { uz: "React Native'da ekrandagi matn qayerga yoziladi?", ru: 'Куда в React Native пишется текст на экране?' }, opts: [{ uz: '`<Text>` ichiga', ru: 'внутрь `<Text>`' }, { uz: '`<View>` ichiga', ru: 'внутрь `<View>`' }, { uz: '`<div>` ichiga', ru: 'внутрь `<div>`' }, { uz: '`<span>` ichiga', ru: 'внутрь `<span>`' }], correct: 0 },
  { q: { uz: "Prototipdagi `onClick` React Native'da nimaga almashadi?", ru: 'На что в React Native меняется `onClick` из прототипа?' }, opts: [{ uz: '`onChange`', ru: '`onChange`' }, { uz: '`onPress`', ru: '`onPress`' }, { uz: '`onSubmit`', ru: '`onSubmit`' }, { uz: '`onInput`', ru: '`onInput`' }], correct: 1 },
  { q: { uz: 'Ilova `/oyin/3` manzilini ochdi. Qaysi fayl ishlaydi?', ru: 'Приложение открыло адрес `/oyin/3`. Какой файл работает?' }, opts: [{ uz: '`src/app/oyin/index.tsx`', ru: '`src/app/oyin/index.tsx`' }, { uz: '`src/app/oyin/3.tsx`', ru: '`src/app/oyin/3.tsx`' }, { uz: '`src/app/oyin/[id].tsx`', ru: '`src/app/oyin/[id].tsx`' }, { uz: '`src/app/oyinlar.tsx`', ru: '`src/app/oyinlar.tsx`' }], correct: 2 },
  { q: { uz: '`_layout.tsx` dagi `<Stack />` nima qiladi?', ru: 'Что делает `<Stack />` в `_layout.tsx`?' }, opts: [{ uz: 'Ekranlarni pastdagi tablarga joylaydi', ru: 'Раскладывает экраны по нижним вкладкам' }, { uz: 'Har ekranga o\'z rangi va shriftini beradi', ru: 'Даёт каждому экрану свой цвет и шрифт' }, { uz: '`src/app/` da yangi fayllar yaratadi', ru: 'Создаёт новые файлы в `src/app/`' }, { uz: "Ekranlarni ustma-ust qo'yib boshqaradi", ru: 'Складывает экраны стопкой и управляет ими' }], correct: 3 },
  { q: { uz: "`router.push('/elon')` ishlaganda nima bo'ladi?", ru: "Что произойдёт, когда сработает `router.push('/elon')`?" }, opts: [{ uz: "E'lon berish ekrani ustiga ochiladi", ru: 'Сверху откроется экран «Объявить игру»' }, { uz: 'Ilova butunlay boshidan qayta yuklanadi', ru: 'Приложение полностью перезагрузится' }, { uz: '`elon.tsx` fayli yangidan yaratiladi', ru: 'Файл `elon.tsx` создастся заново' }, { uz: "O'yinlar ro'yxati qaytadan chiziladi", ru: 'Список игр нарисуется заново' }], correct: 0 },
  { q: { uz: 'Telefonda QR ochilishi uchun odatda nima kerak?', ru: 'Что обычно нужно, чтобы QR открылся на телефоне?' }, opts: [{ uz: 'Telefonda Chrome brauzeri ochiq tursin', ru: 'Пусть на телефоне будет открыт Chrome' }, { uz: "Telefon va kompyuter bitta Wi-Fi'da tursin", ru: "Пусть телефон и компьютер будут в одной Wi-Fi" }, { uz: "Kompyuterga ham Expo Go o'rnatilsin", ru: 'Пусть Expo Go установят и на компьютер' }, { uz: "Telefonda mobil internet ham yoqilgan bo'lsin", ru: 'Пусть на телефоне ещё включат мобильный интернет' }], correct: 1 },
  { q: { uz: '`--tunnel` bilan ulanish qanday ishlaydi?', ru: 'Как работает подключение через `--tunnel`?' }, opts: [{ uz: 'Faqat bitta Wi-Fi ichida, tezroq ulanadi', ru: 'Только внутри одной Wi-Fi, быстрее' }, { uz: 'Faqat iPhone telefonlarida ulanadi', ru: 'Подключается только на iPhone' }, { uz: 'Internet orqali ulanadi, lekin sekinroq', ru: 'Через интернет, но медленнее' }, { uz: "Kompyutersiz, to'g'ridan telefonda ishlaydi", ru: 'Без компьютера, прямо на телефоне' }], correct: 2 },
  { q: { uz: "iPhone'da Expo Go akkaunt so'radi. Nima qilasiz?", ru: 'Expo Go на iPhone просит аккаунт. Что сделаете?' }, opts: [{ uz: "Expo Go ilovasini o'chirib, qayta o'rnataman", ru: 'Удалю Expo Go и установлю заново' }, { uz: 'Loyihani boshqa nom bilan yarataman', ru: 'Создам проект под другим именем' }, { uz: "QR'ni boshqa telefon bilan ochaman", ru: 'Открою QR другим телефоном' }, { uz: 'Ikkalasida bitta Expo akkauntiga kiraman', ru: 'Войду в один аккаунт Expo на обоих' }], correct: 3 },
  { q: { uz: "Expo Go'dagi ilova kodi qayerdan keladi?", ru: 'Откуда приходит код приложения в Expo Go?' }, opts: [{ uz: 'Kompyuterdagi npx expo start dan', ru: 'Из npx expo start на компьютере' }, { uz: "Play Market'dagi ilova sahifasidan", ru: 'Со страницы приложения в Play Market' }, { uz: "Netlify'dagi sayt manzilidan", ru: 'С адреса сайта на Netlify' }, { uz: 'Telefon xotirasidagi papkadan', ru: 'Из папки в памяти телефона' }], correct: 0 },
  { q: { uz: 'Adaptiv sayt nima?', ru: 'Что такое адаптивный сайт?' }, opts: [{ uz: 'Faqat telefonda ochiladigan sayt', ru: 'Сайт, который открывается только на телефоне' }, { uz: 'Telefon kengligiga moslashadigan sayt', ru: 'Сайт, который подстраивается под ширину телефона' }, { uz: "Telefonga o'rnatiladigan do'kon ilovasi", ru: 'Приложение из магазина для телефона' }, { uz: 'Animatsiyalari bor, bosiladigan sayt', ru: 'Сайт с анимациями, который можно нажимать' }], correct: 1 },
  { q: { uz: "PWA telefonga qayerdan qo'shiladi?", ru: 'Откуда PWA добавляется на телефон?' }, opts: [{ uz: "Play Market do'konidan yuklab", ru: "Скачав из магазина Play Market" }, { uz: 'Expo Go ilovasidagi QR orqali', ru: 'Через QR в приложении Expo Go' }, { uz: "Brauzerdan, saytning o'zidan", ru: 'Из браузера, с самого сайта' }, { uz: "App Store do'konidan yuklab", ru: "Скачав из магазина App Store" }], correct: 2 },
  { q: { uz: "Telefon saytni o'rnatishi uchun manzil qanday bo'ladi?", ru: 'Каким должен быть адрес, чтобы телефон установил сайт?' }, opts: [{ uz: "Kompyuterdagi `localhost` manzil", ru: 'Адрес `localhost` на компьютере' }, { uz: "Uydagi Wi-Fi tarmog'idagi manzil", ru: 'Адрес в домашней сети Wi-Fi' }, { uz: '`http://` bilan boshlanadigan manzil', ru: 'Адрес, начинающийся с `http://`' }, { uz: "HTTPS manzil, masalan Netlify'da", ru: "HTTPS-адрес, например на Netlify" }], correct: 3 }
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4; tayanch 4, 9.12) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). Ikki trek: pm-m9d8-platforma.trek (mobil | web) — sarlavha, qadamlar, prompt, kutilgan natija va yashil yakun almashadi;
// kalit yo'q bo'lsa — blok tepasida ikki tugma (tanlanmaguncha qadamlar qulf), tanlov shu kalitga yoziladi (TAYANCHGA SAVOL 1, tayanch 9.77).
// Prompt: QPrompt ko'rinishi (q-prompt klasslari) + {…} joyi tahrirlanadi, yonida kulrang «masalan: …» — qolipda bu maydon yo'q (qolip taklifi), shu faylda EpPrompt.
// «Yordam» — Mentor misolidagi to'liq talab, ochiladigan. «Ortda qoldingizmi» — faqat A1 da (SABOQ 39).
const promptMatn = (s, qiymat, joylar) => tr(s).replace(/\{([a-z0-9_]+)\}/g, (m, id) => {
  const v = String((qiymat && qiymat[id]) || '').trim();
  const j = joylar.find(x => x.id === id);
  return v || (j ? '{' + tr(j.nom) + '}' : m);
});
const EpPrompt = ({ satrlar, joylar = [] }) => {
  const [qiymat, setQiymat] = useState(() => Object.fromEntries(joylar.map(j => [j.id, j.boshi || ''])));
  const [ok, setOk] = useState(false);
  const korildi = new Set();
  const qator = (s, li) => tr(s).split(/(\{[a-z0-9_]+\})/g).map((p, i) => {
    const m = /^\{([a-z0-9_]+)\}$/.exec(p);
    if (!m) return <React.Fragment key={li + '-' + i}>{p.replace(/`/g, '')}</React.Fragment>;
    const j = joylar.find(x => x.id === m[1]); if (!j) return p;
    const birinchi = !korildi.has(j.id); korildi.add(j.id);
    const v = qiymat[j.id] || '';
    const ph = '{' + tr(j.nom) + '}';
    return (
      <React.Fragment key={li + '-' + i}>
        <input className={cxx('ep-joy-in', !v && 'bosh')} value={v} placeholder={ph} aria-label={tr(j.nom)} style={{ width: Math.min(46, Math.max(10, (v || ph).length + 2)) + 'ch' }} onChange={e => { const t = e.target.value; setQiymat(q => ({ ...q, [j.id]: t })); }} />
        {birinchi && j.namuna && <span className="ep-joy-n">{tr(j.namuna).replace(/`/g, '')}</span>}
      </React.Fragment>
    );
  });
  const nusxa = async () => {
    const matn = satrlar.map(s => promptMatn(s, qiymat, joylar).replace(/`/g, '')).join('\n');
    try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="q-prompt ep-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {satrlar.map((s, i) => <span key={i} className="ep-ps">{qator(s, i)}</span>)}
    </span>
  );
};
const Yordam = ({ satrlar, gap }) => {
  const [ochiq, setOchiq] = useState(false);
  useEffect(() => { // ochilgan namuna va «Bajardim» bir ko'rinishda qolsin
    if (!ochiq) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 80);
    return () => clearTimeout(t);
  }, [ochiq]);
  return (
    <>
      <QTugma ikkinchi className="ep-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
      {ochiq && <span className="ep-yordam fade-step">
        <span className="ep-yordam-l">{tr({ uz: "Mentor misolidagi to'liq talab", ru: 'Полное требование в примере Ментора' })}</span>
        {satrlar.map((l, i) => <span key={i} className="ep-yordam-s">{tx(l)}</span>)}
        {gap && <span className="ep-yordam-g">{tx(gap)}</span>}
      </span>}
    </>
  );
};
const ORTDA = { uz: "Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-09-done`; mobil trekda `cd mobil`, `npm install`, `npx expo start`; web-trekda `cd prototip`, `npm install`, `npm run dev`. Qanday ishlashini ko'rasiz va o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.", ru: 'Отстали — откройте пример Ментора в отдельной папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-09-done`; в мобильном треке `cd mobil`, `npm install`, `npx expo start`; в веб-треке `cd prototip`, `npm install`, `npm run dev`. Увидите, как это работает, и повторите шаг в своём репо по образцу.' };
const TREKLAR = [{ k: 'mobil', t: { uz: 'Mobil trek', ru: 'Мобильный трек' } }, { k: 'web', t: { uz: 'Web-trek', ru: 'Веб-трек' } }];
const TrekTanlov = ({ trek, onTanla, qulf }) => (
  <div className={cxx('ep-treklar fade-up', !trek && 'ep-halqa')} role="group" aria-label={tr({ uz: 'Trek', ru: 'Трек' })}>
    {TREKLAR.map(x => <QChip key={x.k} holat={trek === x.k ? 'on' : undefined} disabled={qulf} onClick={() => onTanla(x.k)}>{tr(x.t)}</QChip>)}
  </div>
);
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' }; // S3 (F-1006-287): 14-dars naqshi
const TREK_AVVAL = { uz: "Avval trekingizni tanlang: «Mobil trek» yoki «Web-trek».", ru: "Сначала выберите трек: «Мобильный трек» или «Веб-трек»." };
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, izoh }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [trek, setTrek] = useState(() => (storedAnswer && storedAnswer.trek) || trekOqi());
  const [stepN, setStepN] = useState(() => (avval ? 4 : 0));
  const T_ = trek || 'mobil';
  const qadamlar = steps[T_];
  const done = stepN >= qadamlar.length;
  const tanla = (k) => { if (done || k === trek) return; setTrek(k); trekYoz(k); setStepN(0); };
  const bajardim = () => {
    if (isMentorLive || done || !trek) return;
    const n = stepN + 1; setStepN(n);
    if (n >= qadamlar.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), trek, solved: true, correct: true, picked: true });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  // Yangi ochilgan qadam (uzun prompt) «Bajardim»i bilan birga ko'rinsin — kompyuterda ham
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  const izohT = izoh && izoh[T_];
  // SABOQ 8 / S3 (F-1006-287, 14-dars naqshi): Mentor har holatda keyingi harakatni aytadi — trek tanlanmagan bo'lsa avval trek, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = !trek && !isMentorLive ? TREK_AVVAL : done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${tr(qadamlar[stepN].h)}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${tr(qadamlar[stepN].h)}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cxx('ep-blok', !trek && !isMentorLive && 'qulf')}>
        <QBlok til={__lang} sarlavha={tr(title[T_])} mentor={<div className="ep-mentor-q"><Mentor>{tr(mGap)}</Mentor><TrekTanlov trek={trek} onTanla={tanla} qulf={done || isMentorLive} /></div>} zoom={Zoomable}
          qadamlar={qadamlar.map(c => ({
            h: tr(c.h),
            t: <>{tx(c.t)}{c.bandlar && c.bandlar.map((b, i) => <span key={i} className="ep-band">{tx(b)}</span>)}{c.prompt && <EpPrompt key={T_ + screen} satrlar={c.prompt} joylar={typeof c.joylar === 'function' ? c.joylar() : c.joylar} />}</>,
            xato: c.yordam ? <Yordam satrlar={c.yordam} gap={c.yordamGap} /> : (c.err && tx(c.err))
          }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={tx(doneText[T_])} natija={natija(T_)} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<>{done && izohT && <QIzoh>{tx(izohT)}</QIzoh>}<MentorPracticeStats live={_live} screen={screen} /></>}>
          {ortda && <p className="ep-ortda">{tx(ortda)}</p>}
        </QBlok>
      </div>
    </Stage>
  );
}
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: "результат · образец: Maydon Jamoa" };
const QADAM = {
  ochish: { uz: 'Ochish', ru: 'Открыть' }, prompt: { uz: 'Prompt', ru: 'Промпт' }, ishga: { uz: 'Ishga tushirish', ru: 'Запуск' },
  tekshir: { uz: 'Tekshirish', ru: 'Проверка' }, telefon: { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }
};
const XATO_GAP = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
// Prompt joylari: wireframe yozuvidan oldindan yoziladi (A1), tahrirlanadi; yozuv yo'q bo'lsa — bo'sh, faqat kulrang «masalan»
const a1Joylar = (trek) => {
  const w = wireframeOqi();
  if (trek === 'web') return [
    { id: 'ekranlar', nom: { uz: 'ekranlar', ru: 'экраны' }, boshi: w ? w.map(e => String(e.nom).trim()).join(', ') : '', namuna: { uz: "masalan: O'yinlar, O'yin va E'lon berish ekranlari", ru: "например: экраны «Игры», «Игра» и «Объявить игру»" } },
    { id: 'qismlar', nom: { uz: 'ustma-ust turadigan qismlar', ru: 'части, которые встанут столбиком' }, namuna: { uz: "masalan: O'yinlar ekranidagi o'yin kartalari", ru: "например: карточки игр на экране «Игры»" } }
  ];
  return [
    { id: 'ekranlar', nom: { uz: 'ekranlar va ularning fayllari', ru: 'экраны и их файлы' }, boshi: w ? w.map(e => String(e.nom).trim() + ' — ').join(', ') : '', namuna: { uz: "masalan: O'yinlar — `index.tsx`, O'yin — `oyin/[id].tsx`, E'lon berish — `elon.tsx`", ru: "например: Игры — `index.tsx`, Игра — `oyin/[id].tsx`, Объявить игру — `elon.tsx`" } },
    { id: 'yollar', nom: { uz: 'qaysi tugma qaysi ekranni ochadi', ru: 'какая кнопка какой экран открывает' }, boshi: w ? w.map(e => String(e.tugma || '').trim()).filter(Boolean).join(', ') : '', namuna: { uz: "masalan: karta → O'yin, «E'lon berish» → E'lon berish, «Yuborish» → O'yinlar", ru: "например: карточка → Игра, «Объявить игру» → Объявить игру, «Отправить» → Игры" } }
  ];
};
const A1_PROMPT = {
  mobil: [
    { uz: "Qayerda: `mobil/` — Expo Router, ekranlar `src/app/` da. `prototip/` ni faqat o'qi.", ru: 'Где: `mobil/` — Expo Router, экраны в `src/app/`. `prototip/` только читай.' },
    { uz: "Nima qilsin: `prototip/` dagi ekranlarni React Native'ga ko'chir: {ekranlar}. `src/app/_layout.tsx` da `<Stack />` bo'lsin; shablondagi namuna ekranlar va pastki tablar olib tashlansin (hozirgi shablonda — `explore` ekrani) — `src/app/` da faqat mahsulot ekranlari va `_layout.tsx` qolsin.", ru: 'Что сделать: перенеси экраны из `prototip/` на React Native: {ekranlar}. В `src/app/_layout.tsx` пусть будет `<Stack />`; образцовые экраны шаблона и нижние вкладки убери (в текущем шаблоне — экран `explore`) — в `src/app/` останутся только экраны продукта и `_layout.tsx`.' },
    { uz: "Ma'lumot `prototip/src/namuna.js` dagidek, `mobil/` ichida. Bosish yo'llari prototipdagidek: {yollar}.", ru: 'Данные — как в `prototip/src/namuna.js`, внутри `mobil/`. Пути нажатий — как в прототипе: {yollar}.' },
    { uz: "Nima buzilmasin: `prototip/` o'zgarmasin; haqiqiy ma'lumot va Backend yo'q. Paket kerak bo'lsa — faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: `prototip/` не меняется; настоящих данных и Backend нет. Нужен пакет — только через `npx expo install`. Больше ничего не трогай, назови изменённые файлы.' }
  ],
  web: [
    { uz: 'Qayerda: `prototip/` — CSS fayllari.', ru: 'Где: `prototip/` — файлы CSS.' },
    { uz: 'Nima qilsin: {ekranlar} telefon kengligiga moslashsin: 600 px dan tor oynada {qismlar} bitta ustunda, har biri to\'liq enida tursin. Kompyuterda ko\'rinish o\'zgarmasin.', ru: "Что сделать: пусть {ekranlar} подстраиваются под ширину телефона: в окне меньше 600 px {qismlar} стоят в один столбец, на всю ширину. На компьютере вид не меняется." },
    { uz: "Nima buzilmasin: ekranlar, namuna ma'lumot, bosish yo'llari va animatsiyalar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: "Что не сломать: экраны, данные-образцы, пути нажатий и анимации не меняются. Больше ничего не трогай, назови изменённые файлы." }
  ]
};
const A1_YORDAM = {
  mobil: [
    A1_PROMPT.mobil[0],
    { uz: "Nima qilsin: `prototip/` dagi ekranlarni React Native'ga ko'chir: O'yinlar — `src/app/index.tsx`, O'yin — `src/app/oyin/[id].tsx`, E'lon berish — `src/app/elon.tsx`.", ru: "Что сделать: перенеси экраны из `prototip/` на React Native: O'yinlar («Игры») — `src/app/index.tsx`, O'yin («Игра») — `src/app/oyin/[id].tsx`, E'lon berish («Объявить игру») — `src/app/elon.tsx`." },
    { uz: "`src/app/_layout.tsx` da `<Stack />` bo'lsin; shablondagi namuna ekranlar va pastki tablar olib tashlansin (hozirgi shablonda — `explore` ekrani) — `src/app/` da faqat mahsulot ekranlari va `_layout.tsx` qolsin.", ru: 'В `src/app/_layout.tsx` пусть будет `<Stack />`; образцовые экраны шаблона и нижние вкладки убери (в текущем шаблоне — экран `explore`) — в `src/app/` останутся только экраны продукта и `_layout.tsx`.' },
    { uz: "Ma'lumot `prototip/src/namuna.js` dagidek (4 ta o'yin, har biriga `id`), `mobil/` ichida. Bosish yo'llari prototipdagidek: karta → O'yin, «E'lon berish» → E'lon berish, «Yuborish» → O'yinlar; «Qo'shilaman» sonni bittaga oshirsin.", ru: "Данные — как в `prototip/src/namuna.js` (4 игры, у каждой `id`), внутри `mobil/`. Пути нажатий — как в прототипе: карточка → O'yin, «E'lon berish» → E'lon berish, «Yuborish» («Отправить») → O'yinlar; «Qo'shilaman» («Присоединяюсь») увеличивает число на один." },
    A1_PROMPT.mobil[3]
  ],
  web: [
    A1_PROMPT.web[0],
    { uz: "Nima qilsin: O'yinlar, O'yin va E'lon berish ekranlari telefon kengligiga moslashsin: 600 px dan tor oynada O'yinlar ekranidagi o'yin kartalari bitta ustunda, har biri to'liq enida tursin. Kompyuterda ko'rinish o'zgarmasin.", ru: "Что сделать: пусть экраны O'yinlar («Игры»), O'yin («Игра») и E'lon berish («Объявить игру») подстраиваются под ширину телефона: в окне меньше 600 px карточки игр на экране O'yinlar стоят в один столбец, на всю ширину. На компьютере вид не меняется." },
    A1_PROMPT.web[2]
  ]
};
const A1_QADAMLAR = {
  mobil: [
    { h: QADAM.ochish, t: { uz: "telefoningizda Expo Go bo'lsin (iPhone'da — Expo akkauntingizga kirilgan). Antigravity'da o'z repo'ngizni oching, terminalda repo papkasida:", ru: 'на телефоне должен быть Expo Go (на iPhone — с входом в ваш аккаунт Expo). Откройте свой репо в Antigravity, в терминале в папке репо:' },
      bandlar: [
        { uz: "`npx create-expo-app@latest mobil` (terminal «Skip initializing a new git repository?» deb so'rasa — Enter: yangi git ochilmaydi, `mobil/` repo'ingiz ichida qoladi), keyin `cd mobil` va `npx expo start`.", ru: '`npx create-expo-app@latest mobil` (если терминал спросит «Skip initializing a new git repository?» — Enter: новый git не создаётся, `mobil/` остаётся внутри вашего репо), потом `cd mobil` и `npx expo start`.' },
        { uz: "Terminaldagi QR'ni skanerlang: Android'da — Expo Go'dagi «Scan QR code» bilan, iPhone'da — standart kamera ilovasi bilan. Telefonda shablon ilovasi ochiladi.", ru: 'Отсканируйте QR из терминала: на Android — через «Scan QR code» в Expo Go, на iPhone — стандартной камерой. На телефоне откроется приложение-шаблон.' },
        { uz: "Ochilmasa: telefon va kompyuter bitta Wi-Fi'dami? Bitta bo'lsa ham ochilmasa — tunnel bilan urinib ko'ring: `npm i -g @expo/ngrok`, keyin `npx expo start --tunnel`.", ru: "Не открылось: телефон и компьютер в одной Wi-Fi? Если в одной, но не открывается — попробуйте tunnel: `npm i -g @expo/ngrok`, потом `npx expo start --tunnel`." },
        { uz: "iPhone'da akkaunt so'rasa — kompyuterda `npx expo login`, Expo Go'da o'ng yuqoridagi akkaunt belgisi orqali o'sha akkauntga kiring.", ru: 'Если iPhone просит аккаунт — на компьютере `npx expo login`, в Expo Go войдите в тот же аккаунт через значок аккаунта справа вверху.' }
      ] },
    { h: QADAM.prompt, get t() { return wireframeOqi()
      ? { uz: "qavslar 7-darsdagi wireframe yozuvingizdan to'ldirilgan; tekshiring, bo'sh qavsni yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'скобки заполнены из вашей записи wireframe с 7-го урока; проверьте, допишите пустые, нажмите «Скопировать» и отправьте в Antigravity:' }
      : { uz: "qavslarga o'z ekranlaringizni yozing (7-darsdagi qog'oz chizmangizdan), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'впишите в скобки свои экраны (с бумажного наброска 7-го урока), нажмите «Скопировать» и отправьте в Antigravity:' }; },
      prompt: A1_PROMPT.mobil, joylar: () => a1Joylar('mobil'), yordam: A1_YORDAM.mobil },
    { h: QADAM.ishga, t: { uz: "`npx expo start` ishlab tursa, saqlangan o'zgarish telefonda o'zi ko'rinadi; ko'rinmasa — terminalda `r` ni bosing.", ru: 'пока работает `npx expo start`, сохранённое изменение само появится на телефоне; не появилось — нажмите `r` в терминале.' }, err: XATO_GAP },
    { h: QADAM.telefon, t: { uz: 'talabning har qatorini tekshiring:', ru: 'проверьте каждую строку требования:' },
      bandlar: [
        { uz: 'qayerda — ekranlaringiz `mobil/src/app/` da, `git status` da `prototip/` o\'zgarmagan', ru: 'где — ваши экраны в `mobil/src/app/`, в `git status` `prototip/` не изменён' },
        { uz: "nima qilsin — ekranlar prototipdagidek, har tugma kerakli ekranni ochadi, «‹» orqaga qaytaradi", ru: 'что сделать — экраны как в прототипе, каждая кнопка открывает нужный экран, «‹» возвращает назад' },
        { uz: "nima buzilmasin — Backend yo'q: terminalda `r` bosilsa, namuna boshidan ochiladi.", ru: "что не сломать — Backend нет: если нажать `r` в терминале, данные-образцы откроются с начала." },
        { uz: "Farq bo'lsa, agentga: «{nima} prototipdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: "Если есть отличие — агенту: «{что} не как в прототипе: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»" }
      ] }
  ],
  web: [
    { h: QADAM.ochish, t: { uz: "Antigravity'da o'z repo'ngizni oching, terminalda `cd prototip` va `npm run dev`. Chrome'da terminal ko'rsatgan manzilni oching va telefon ko'rinishini yoqing: F12, keyin Ctrl+Shift+M (Mac: Cmd+Option+I, keyin Cmd+Shift+M). Qaysi ekranda nima qisilib qolganini ko'ring.", ru: 'откройте свой репо в Antigravity, в терминале `cd prototip` и `npm run dev`. Откройте в Chrome адрес из терминала и включите вид телефона: F12, потом Ctrl+Shift+M (Mac: Cmd+Option+I, потом Cmd+Shift+M). Посмотрите, что и на каком экране сжалось.' } },
    { h: QADAM.prompt, t: { uz: "qavslarni tekshiring (birinchisi wireframe yozuvingizdan), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'проверьте скобки (первая — из вашей записи wireframe), нажмите «Скопировать» и отправьте в Antigravity:' },
      prompt: A1_PROMPT.web, joylar: () => a1Joylar('web'), yordam: A1_YORDAM.web },
    { h: QADAM.ishga, t: { uz: "sahifa o'zi yangilanadi, terminalda xato yo'q.", ru: 'страница обновляется сама, в терминале нет ошибок.' }, err: XATO_GAP },
    { h: QADAM.tekshir, t: { uz: 'telefon ko\'rinishida (390 px) va oddiy oynada:', ru: 'в виде телефона (390 px) и в обычном окне:' },
      bandlar: [
        { uz: "qayerda — o'zgarish faqat `prototip/` da", ru: 'где — изменения только в `prototip/`' },
        { uz: "nima qilsin — telefon kengligida kartalar bitta ustunda, yozuvlar uzilmagan; kompyuterda — avvalgidek", ru: 'что сделать — на ширине телефона карточки в один столбец, надписи не разорваны; на компьютере — как раньше' },
        { uz: 'nima buzilmasin — har tugma kerakli ekranni ochadi, animatsiyalar ishlaydi.', ru: 'что не сломать — каждая кнопка открывает нужный экран, анимации работают.' },
        { uz: "Farq bo'lsa, agentga: «{nima} telefon kengligida {qanday}: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: "Если есть отличие — агенту: «{что} на ширине телефона {как}: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»" }
      ] }
  ]
};
// A1 kutilgan natija — mobil: telefon (uch ekran navbat bilan, bir marta) + kichik daraxt · web: telefon 390 px (ustma-ust) va kompyuter oynasi (yonma-yon)
const A1Natija = ({ trek }) => {
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [b, setB] = useState(kam ? 2 : 0);
  useEffect(() => { if (kam || trek !== 'mobil') return; keyin(() => setB(1), 1500); keyin(() => setB(2), 3300); }, [trek]); // eslint-disable-line
  if (trek === 'web') return (
    <div className="ep-nat">
      <JamoaTelefon holat="brauzer" yorliqsiz stack={[{ k: 'oyinlar' }]} className="ep-kir" />
      <KompOyna ixcham className="ep-kir" />
    </div>
  );
  const stack = b === 0 ? [{ k: 'oyinlar' }] : b === 1 ? [{ k: 'oyinlar' }, { k: 'oyin', id: '1' }] : [{ k: 'oyinlar' }, { k: 'elon' }];
  return (
    <div className="ep-nat">
      <JamoaTelefon holat="expo" stack={stack} className="ep-kir" />
      <p className="ep-mini-daraxt ep-kir" style={{ '--d': '0.2s' }}><code>mobil/src/app/</code> › <code>_layout.tsx</code> · <code>index.tsx</code> · <code>elon.tsx</code> · <code>oyin/[id].tsx</code></p>
    </div>
  );
};
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z trekingiz", ru: 'Практика 1 · ваш трек' }}
    title={{
      mobil: { uz: <>Prototip ekranlarini <span className="italic" style={{ color: T.accent }}>Expo ilovasiga</span> ko'chiring.</>, ru: <>Перенесите экраны прототипа <span className="italic" style={{ color: T.accent }}>в приложение Expo</span>.</> },
      web: { uz: <>Prototipingizni <span className="italic" style={{ color: T.accent }}>telefon kengligiga</span> moslang.</>, ru: <>Подстройте прототип <span className="italic" style={{ color: T.accent }}>под ширину телефона</span>.</> }
    }}
    mentor={{ uz: <>Hamma qadamni o'z trekingizda, o'z mahsulotingiz bilan qilasiz; Maydon Jamoa — namuna. <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Все шаги делаете в своём треке, со своим продуктом; Maydon Jamoa — образец. Начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={A1_QADAMLAR}
    natija={(trek) => <A1Natija trek={trek} />}
    ortda={ORTDA}
    doneText={{
      mobil: { uz: "Prototip telefonda ilova bo'lib ochiladi: uch ekran — uch fayl, bosish yo'llari o'sha.", ru: 'Прототип открывается на телефоне как приложение: три экрана — три файла, пути нажатий те же.' },
      web: { uz: "Prototip telefon kengligiga moslashdi: kartalar ustma-ust, kompyuterda — avvalgidek.", ru: 'Прототип подстроился под ширину телефона: карточки друг под другом, на компьютере — как раньше.' }
    }} />
);

const A2_JOYLAR = {
  mobil: [
    { id: 'bosiladigan', nom: { uz: 'bosiladigan karta yoki tugma', ru: 'нажимаемая карточка или кнопка' }, namuna: { uz: "masalan: o'yin kartasi", ru: 'например: карточка игры' } },
    { id: 'ozgaradigan', nom: { uz: "o'zgaradigan son yoki yozuv", ru: 'меняющееся число или надпись' }, namuna: { uz: "masalan: «8 / 10» dagi son", ru: 'например: число в «8 / 10»' } }
  ],
  web: [
    { id: 'nom', nom: { uz: 'mahsulot nomi', ru: 'название продукта' }, namuna: { uz: 'masalan: Maydon Jamoa', ru: 'например: Maydon Jamoa' } },
    { id: 'rang', nom: { uz: 'ikonka rangi', ru: 'цвет иконки' }, namuna: { uz: 'masalan: yashil', ru: 'например: зелёный' } }
  ]
};
const A2_PROMPT = {
  mobil: [
    { uz: '`mobil/src/app/` — mavjud ekranlar.', ru: '`mobil/src/app/` — существующие экраны.' },
    { uz: "{bosiladigan} bosilganda kichrayib qaytsin — 0,15 soniya. {ozgaradigan} o'zgarganda bir lahza kattalashib, 0,3 soniyada silliq qaytsin. Ekrandan ekranga o'tish Stack'nikidek silliq qolsin.", ru: '{bosiladigan} при нажатии уменьшается и возвращается — 0,15 секунды. {ozgaradigan} при изменении на миг увеличивается и плавно возвращается за 0,3 секунды. Переход между экранами остаётся плавным, как у Stack.' },
    { uz: "ekranlar, namuna ma'lumot va bosish yo'llari o'zgarmasin; telefonda harakatni kamaytirish yoqilgan bo'lsa, kichrayish va kattalashish bo'lmasin. Paket kerak bo'lsa — faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: "экраны, данные-образцы и пути нажатий не меняются; если на телефоне уменьшено движение — пусть ничего не уменьшается и не увеличивается. Нужен пакет — только через `npx expo install`. Больше ничего не трогай, назови изменённые файлы." }
  ],
  web: [
    { uz: '`prototip/` — `public/manifest.webmanifest`, ikonkalar `public/` da, `index.html` da manifestga havola.', ru: "`prototip/` — `public/manifest.webmanifest`, иконки в `public/`, в `index.html` ссылка на manifest." },
    { uz: "manifestda `name` va `short_name` — {nom}, `start_url` — `/`, `display` — `standalone`, `icons` — 192 va 512 piksel PNG ({rang}, matnsiz oddiy shakl). Ikonka faylini yarata olmasang — bitta kvadrat rasmdan shu ikki o'lchamni qanday tayyorlashni menga ayt.", ru: "в manifest `name` и `short_name` — {nom}, `start_url` — `/`, `display` — `standalone`, `icons` — PNG 192 и 512 пикселей ({rang}, простая фигура без текста). Если не можешь создать файл иконки — скажи мне, как подготовить эти два размера из одной квадратной картинки." },
    { uz: "ekranlar, namuna ma'lumot, bosish yo'llari va animatsiyalar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: "экраны, данные-образцы, пути нажатий и анимации не меняются. Больше ничего не трогай, назови изменённые файлы." }
  ]
};
// Talab satrlari «Qayerda · Nima qilsin · Nima buzilmasin» (MD aynan): yorliq + matn
const TALAB_Y = [{ uz: 'Qayerda: ', ru: 'Где: ' }, { uz: 'Nima qilsin: ', ru: 'Что сделать: ' }, { uz: 'Nima buzilmasin: ', ru: 'Что не сломать: ' }];
const talab = (satrlar) => satrlar.map((s, i) => ({ uz: TALAB_Y[i].uz + s.uz, ru: TALAB_Y[i].ru + s.ru }));
const toldir = (satrlar, q) => satrlar.map(s => ({ uz: s.uz.replace(/\{([a-z0-9_]+)\}/g, (m, id) => (q[id] ? q[id].uz : m)), ru: s.ru.replace(/\{([a-z0-9_]+)\}/g, (m, id) => (q[id] ? q[id].ru : m)) }));
const A2_QADAMLAR = {
  mobil: [
    { h: QADAM.ochish, t: { uz: '`npx expo start` ishlab tursin, ilova telefoningizda ochiq.', ru: 'пусть работает `npx expo start`, приложение открыто на телефоне.' } },
    { h: QADAM.prompt, t: { uz: "qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки, нажмите «Скопировать» и отправьте в Antigravity:' },
      prompt: talab(A2_PROMPT.mobil), joylar: A2_JOYLAR.mobil,
      yordam: talab(toldir(A2_PROMPT.mobil, { bosiladigan: { uz: "o'yin kartasi", ru: 'карточка игры' }, ozgaradigan: { uz: '«8 / 10» dagi son', ru: 'число в «8 / 10»' } })),
      yordamGap: { uz: 'Motion — web uchun; ilovada animatsiyani agent React Native vositasi bilan yozadi.', ru: "Motion — для веба; в приложении анимацию агент пишет средствами React Native." } },
    { h: QADAM.ishga, t: { uz: 'ilova telefonda o\'zi yangilanadi; yangilanmasa — terminalda `r`.', ru: 'приложение на телефоне обновляется само; не обновилось — `r` в терминале.' }, err: XATO_GAP },
    { h: QADAM.telefon, t: { uz: "talabning har qatori: karta kichrayib qaytadimi · son kattalashib qaytadimi · ekranlar silliq almashadimi · ekranlar va bosish yo'llari o'sha-o'shami.", ru: 'каждая строка требования: карточка уменьшается и возвращается? · число увеличивается и возвращается? · экраны сменяются плавно? · экраны и пути нажатий те же?' },
      bandlar: [
        { uz: "Hammasi mos bo'lsa — GitHub'ga: repo papkasida `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil, `mobil/` fayllari ko'rinsin; `git add mobil`, `git commit -m \"telefonda prototip\"`, `git push`.", ru: 'Всё совпало — на GitHub: в папке репо `git status` — изменённые файлы совпадают со списком агента, видны файлы `mobil/`; `git add mobil`, `git commit -m "telefonda prototip"`, `git push`.' },
        { uz: "`git push` xato bersa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если `git push` выдаст ошибку: «Вышла такая ошибка: {ошибка}. Исправь.»' }
      ] }
  ],
  web: [
    { h: QADAM.ochish, t: { uz: '`prototip/` ishlab tursin (`npm run dev`); app.netlify.com da akkauntingizga kiring (2-Modulda ochgansiz).', ru: 'пусть работает `prototip/` (`npm run dev`); войдите в свой аккаунт на app.netlify.com (вы открыли его во 2-м модуле).' } },
    { h: QADAM.prompt, t: { uz: "qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки, нажмите «Скопировать» и отправьте в Antigravity:' },
      prompt: talab(A2_PROMPT.web), joylar: A2_JOYLAR.web,
      yordam: talab(toldir(A2_PROMPT.web, { nom: { uz: 'Maydon Jamoa', ru: 'Maydon Jamoa' }, rang: { uz: 'yashil', ru: 'зелёный' } })) },
    { h: QADAM.ishga, t: { uz: "GitHub'ga: `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil; `git add prototip`, `git commit -m \"PWA\"`, `git push`.", ru: 'на GitHub: `git status` — изменённые файлы совпадают со списком агента; `git add prototip`, `git commit -m "PWA"`, `git push`.' },
      bandlar: [{ uz: "Keyin app.netlify.com → yangi loyiha → GitHub'dan import → o'z repo'ngiz. Base directory `prototip`, build `npm run build`, publish `dist`. Havola chiqadi: `….netlify.app`; keyingi har push'da sayt o'zi yangilanadi.", ru: 'Потом app.netlify.com → новый проект → импорт из GitHub → ваш репо. Base directory `prototip`, build `npm run build`, publish `dist`. Появится ссылка: `….netlify.app`; при каждом следующем push сайт обновится сам.' }], err: XATO_GAP },
    { h: QADAM.telefon, t: { uz: 'telefonda `….netlify.app` ni oching.', ru: 'откройте на телефоне `….netlify.app`.' },
      bandlar: [
        { uz: "Android'da Chrome: manzil qatori o'ngidagi «⋮» → «Install and create shortcut» → «Install» (telefon tili boshqa bo'lsa — o'sha tildagi nomi).", ru: 'На Android в Chrome: «⋮» справа от адресной строки → «Install and create shortcut» → «Install» (если язык телефона другой — название на этом языке).' },
        { uz: "iPhone'da Safari: «Share» → «Add to Home Screen»; ro'yxatda bo'lmasa — pastdagi «Edit Actions» dan qo'shing (telefon tili boshqa bo'lsa — o'sha tildagi nomi).", ru: 'На iPhone в Safari: «Share» → «Add to Home Screen»; если нет в списке — добавьте через «Edit Actions» внизу (если язык телефона другой — название на этом языке).' },
        { uz: 'Bosh ekrandagi ikonkani bosing: sayt manzil qatorisiz ochiladi, har tugma kerakli ekranni ochadi.', ru: 'Нажмите иконку на главном экране: сайт откроется без адресной строки, каждая кнопка открывает нужный экран.' }
      ] }
  ]
};
// A2 kutilgan natija — mobil: jonli telefon (bir marta) + GitHub'ning kichik ko'rinishi · web: pwa telefon (bir marta) + manifest fayli
const A2Natija = ({ trek }) => {
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [b, setB] = useState(kam ? 9 : 0);
  useEffect(() => {
    if (kam) return;
    if (trek === 'web') { keyin(() => setB(1), 1600); keyin(() => setB(2), 2700); keyin(() => setB(3), 3100); return; }
    keyin(() => setB(1), 900); keyin(() => setB(2), 1200); keyin(() => setB(3), 2300); keyin(() => setB(4), 2550); keyin(() => setB(5), 3900); keyin(() => setB(6), 4250);
  }, [trek]); // eslint-disable-line
  if (trek === 'web') {
    const tel = b === 0
      ? <JamoaTelefon holat="brauzer" yorliqsiz qulf manzil={NETLIFY} stack={[{ k: 'oyinlar' }]} className="ep-kir" />
      : b >= 3 ? <JamoaTelefon holat="expo" yorliqsiz stack={[{ k: 'oyinlar' }]} />
        : <JamoaTelefon holat="pwa" yorliqsiz bosh={<BoshEkran nom ikonka bosildi={b === 2} />} />;
    return (
      <div className="ep-nat yon">
        {tel}
        <KodKarta fayl="prototip/public/manifest.webmanifest" className="ep-kir ep-json">{'{ "name": "Maydon Jamoa", "short_name": "Maydon Jamoa", "start_url": "/", "display": "standalone",\n  "icons": [{ "src": "/ikonka-192.png", "sizes": "192x192" }, { "src": "/ikonka-512.png", "sizes": "512x512" }] }'}</KodKarta>
      </div>
    );
  }
  const yakun = b >= 9;
  const stack = (b >= 2 && b < 6) && !yakun ? [{ k: 'oyinlar' }, { k: 'oyin', id: '1', bosildi: b === 3, qoshildi: b >= 4 }] : [{ k: 'oyinlar' }];
  return (
    <div className="ep-nat yon">
      <JamoaTelefon holat="expo" stack={stack} chiq={b === 5} bosilgan={b === 1 ? '1' : null} className="ep-kir" />
      <div className="ep-gh ep-kir" style={{ '--d': '0.2s' }}>
        <span className="ep-komp-bar"><i /><i /><i /><span>github.com/…/maydon-jamoa</span></span>
        <span className="ep-gh-q yangi"><i className="ep-papka-b" aria-hidden="true" />mobil/</span>
        <span className="ep-gh-q"><i className="ep-papka-b" aria-hidden="true" />prototip/</span>
        <span className="ep-gh-q">README.md</span>
      </div>
    </div>
  );
};
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z trekingiz", ru: 'Практика 2 · ваш трек' }}
    title={{
      mobil: { uz: <>Telefondagi ilovangiz ham <span className="italic" style={{ color: T.accent }}>jonli bo'lsin</span>.</>, ru: <>Пусть приложение на телефоне тоже <span className="italic" style={{ color: T.accent }}>оживёт</span>.</> },
      web: { uz: <>Saytingizni telefonga <span className="italic" style={{ color: T.accent }}>ilova kabi</span> o'rnating.</>, ru: <>Установите сайт на телефон <span className="italic" style={{ color: T.accent }}>как приложение</span>.</> }
    }}
    mentor={{ uz: <>Talab tayyor — bir-ikki joyni o'z mahsulotingiz bilan to'ldirasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Требование готово — впишите свой продукт в пару мест; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={A2_QADAMLAR}
    natija={(trek) => <A2Natija trek={trek} />}
    izoh={{ mobil: { uz: "Expo Go'da ilova kompyuteringizdan keladi: `npx expo start` to'xtasa, telefonda ham ochilmaydi.", ru: 'В Expo Go приложение приходит с вашего компьютера: если `npx expo start` остановится, на телефоне оно тоже не откроется.' } }}
    doneText={{
      mobil: { uz: "Ilova telefonda jonli: karta, son va ekranlar bosishga javob beradi; `mobil/` GitHub'da.", ru: 'Приложение на телефоне живое: карточка, число и экраны отвечают на нажатия; `mobil/` на GitHub.' },
      web: { uz: 'Sayt telefonda ilova kabi o\'rnatildi: bosh ekrandan manzil qatorisiz ochiladi.', ru: 'Сайт установлен на телефон как приложение: открывается с главного экрана без адресной строки.' }
    }} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran sflash (SABOQ 12, 16), qolipdagi QKartochka (DE-204). Orqa tomon — oddiy matn (kod-belgisiz); old va izoh — tx.
const KARTALAR = [
  { front: { uz: "React Native'da ekrandagi matn qayerda turadi?", ru: 'Где в React Native стоит текст на экране?' }, back: { uz: '<Text> ichida', ru: 'внутри <Text>' }, note: { uz: '`View` — faqat quti', ru: '`View` — только коробка' } },
  { front: { uz: "Prototipdagi bosiladigan `div` React Native'da nima bo'ladi?", ru: 'Чем становится нажимаемый `div` из прототипа в React Native?' }, back: { uz: 'Pressable', ru: 'Pressable' }, note: { uz: '`onClick` o\'rniga — `onPress`', ru: 'вместо `onClick` — `onPress`' } },
  { front: { uz: 'Expo Router nima?', ru: 'Что такое Expo Router?' }, back: { uz: "Expo'ning navigatsiyasi: ekranlar fayllar bilan tuziladi", ru: 'Навигация Expo: экраны собираются из файлов' }, note: { uz: "Bu misolda har ekran o'z faylida, `src/app/` da", ru: 'В этом примере каждый экран в своём файле, в `src/app/`' } },
  { front: { uz: '`_layout.tsx` dagi `<Stack />` nima qiladi?', ru: 'Что делает `<Stack />` в `_layout.tsx`?' }, back: { uz: "Ekranlarni ustma-ust qo'yadi", ru: 'Складывает экраны стопкой' }, note: { uz: '«‹» ustki ekranni olib tashlaydi', ru: '«‹» убирает верхний экран' } },
  { front: { uz: "To'rt o'yin uchun nechta O'yin fayli kerak?", ru: 'Сколько файлов «Игра» нужно для четырёх игр?' }, back: { uz: 'Bitta — oyin/[id].tsx', ru: 'Один — oyin/[id].tsx' }, note: { uz: '`id` manzildan keladi: `/oyin/2`', ru: '`id` приходит из адреса: `/oyin/2`' } },
  { front: { uz: "Boshqa ekranga qaysi qator o'tkazadi?", ru: 'Какая строка переводит на другой экран?' }, back: { uz: "router.push('/elon')", ru: "router.push('/elon')" }, note: { uz: '`router` — `useRouter()` dan', ru: '`router` — из `useRouter()`' } },
  { front: { uz: "QR ochilishi uchun telefon va kompyuter qayerda bo'ladi?", ru: 'Где должны быть телефон и компьютер, чтобы открылся QR?' }, back: { uz: "Bitta Wi-Fi'da", ru: 'В одной Wi-Fi' }, note: { uz: 'Ochilmasa — `npx expo start --tunnel`', ru: 'Не открылся — `npx expo start --tunnel`' } },
  { front: { uz: "iPhone'da Expo Go loyihani ochishi uchun nima kerak?", ru: 'Что нужно, чтобы Expo Go на iPhone открыл проект?' }, back: { uz: "Kompyuterda va Expo Go'da bitta Expo akkaunti", ru: 'Один аккаунт Expo на компьютере и в Expo Go' }, note: { uz: 'Kompyuterda — `npx expo login`', ru: 'На компьютере — `npx expo login`' } },
  { front: { uz: "Expo Go'dagi ilova kodi qayerdan keladi?", ru: 'Откуда приходит код приложения в Expo Go?' }, back: { uz: 'Kompyuterdagi npx expo start dan', ru: 'Из npx expo start на компьютере' }, note: { uz: "U to'xtasa, ilova ham ochilmaydi", ru: 'Остановится он — не откроется и приложение' } },
  { front: { uz: 'Adaptiv sayt nima?', ru: 'Что такое адаптивный сайт?' }, back: { uz: 'Telefon kengligiga moslashadigan sayt', ru: 'Сайт, который подстраивается под ширину телефона' }, note: { uz: 'Bu darsda 600 px dan tor oynada bitta ustun', ru: "На этом уроке в окне меньше 600 px — один столбец" } },
  { front: { uz: 'PWA nima?', ru: 'Что такое PWA?' }, back: { uz: "Telefonning bosh ekraniga ilova kabi qo'shiladigan sayt", ru: 'Сайт, который добавляется на главный экран телефона как приложение' }, note: { uz: "Do'kondan emas, brauzerdan qo'shiladi", ru: 'Добавляют не из магазина, а из браузера' } },
  { front: { uz: 'Sayt telefonda manzil qatorisiz ochilishi uchun manifestda nima yoziladi?', ru: "Что пишут в manifest, чтобы сайт открывался на телефоне без адресной строки?" }, back: { uz: '"display": "standalone"', ru: '"display": "standalone"' }, note: { uz: 'Yana kerak: nom, ikonkalar, `start_url`', ru: 'Ещё нужны: имя, иконки, `start_url`' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */}
        <div className={cxx('ep-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tr(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="ep-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204) + «Keyingi dars» qatori. Sarlavha holatga qarab (P-046; 09-FILTR 34); yorliq «✓ Prototip telefonda» — A1 bajarilganda =====
const YAKUN_SARLAVHA = {
  a2: { uz: 'Prototipingiz endi o\'z telefoningizda ochiladi.', ru: 'Теперь ваш прототип открывается на вашем телефоне.' },
  a1: { uz: 'Prototip telefonda ochildi — oxirgi qadam uyda.', ru: 'Прототип открылся на телефоне — последний шаг дома.' },
  yoq: { uz: 'Telefonga chiqarish boshlandi — qolgani uyda.', ru: 'Вывод на телефон начат — остальное дома.' }
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
  const holat = bajarildi('a2') ? 'a2' : bajarildi('a1') ? 'a1' : 'yoq';
  const belgisiz = !bajarildi('a1') && !bajarildi('a2');
  const RECAP = [
    { uz: "React Native'da quti `View` bilan, matn `Text` bilan, bosiladigan joy `Pressable` bilan yoziladi.", ru: 'В React Native коробка пишется через `View`, текст — через `Text`, нажимаемое место — через `Pressable`.' },
    { uz: "Expo Router'da ekranlar fayllar bilan tuziladi: bu misolda har ekran o'z faylida, `_layout.tsx` ularni Stack qiladi.", ru: 'В Expo Router экраны собираются из файлов: в этом примере каждый экран в своём файле, `_layout.tsx` складывает их в Stack.' },
    { uz: "Bitta `oyin/[id].tsx` fayli har o'yinni manzildagi raqami bilan ochadi.", ru: 'Один файл `oyin/[id].tsx` открывает каждую игру по номеру в адресе.' },
    { uz: "QR odatda bitta Wi-Fi'da ochiladi, ochilmasa `--tunnel` bilan urinib ko'rasiz; iPhone'da ikkalasida bitta Expo akkaunti kerak.", ru: 'QR обычно открывается в одной Wi-Fi, если нет — пробуете `--tunnel`; на iPhone нужен один аккаунт Expo на обоих.' },
    { uz: "Adaptiv sayt telefon kengligiga moslashadi, PWA esa bosh ekranga ilova kabi qo'shiladi.", ru: 'Адаптивный сайт подстраивается под ширину телефона, а PWA добавляется на главный экран как приложение.' }
  ];
  const HOMEWORK = [
    { b: { uz: 'Tugatish', ru: 'Завершить' }, t: { uz: "— darsda ulgurmagan qadamlarni o'z trekingizda bajaring: prototip telefoningizda ochilsin.", ru: '— выполните в своём треке шаги, которые не успели на уроке: прототип должен открываться на телефоне.' } },
    { b: { uz: 'Tekshirish', ru: 'Проверить' }, t: { uz: "— telefonda bosib chiqing: wireframe'dagi har tugma kerakli ekranni ochadimi? Farq bo'lsa — agentga bitta tuzatish talabi.", ru: '— пройдите нажатиями на телефоне: каждая кнопка из wireframe открывает нужный экран? Есть отличие — одно требование-исправление агенту.' } },
    { b: { uz: 'GitHub', ru: 'GitHub' }, t: { uz: '— o\'zgarishlar GitHub\'da tursin: mobil trekda `mobil/`, web-trekda `prototip/` va `README.md` da Netlify havolasi.', ru: '— изменения должны быть на GitHub: в мобильном треке `mobil/`, в веб-треке `prototip/` и ссылка Netlify в `README.md`.' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className={cxx('ep-yakun', belgisiz && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Prototip telefonda', ru: 'Прототип на телефоне' })}
          togri={correct} jami={total}
          sarlavha={tr(YAKUN_SARLAVHA[holat])}
          cta={<>
            <p className="ep-fikr small fade-up">{tr({ uz: "Mobil trekda prototip Expo ilovasiga ko'chadi — har ekran o'z faylida — va QR orqali Expo Go'da ochiladi; web-trekda u adaptiv sayt va PWA bo'lib, telefonning bosh ekraniga qo'shiladi.", ru: 'В мобильном треке прототип переезжает в приложение Expo — каждый экран в своём файле — и открывается в Expo Go через QR; в веб-треке он становится адаптивным сайтом и PWA и добавляется на главный экран телефона.' })}</p>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tx)}
          uyga={HOMEWORK.map(h => ({ b: tr(h.b), t: tx(h.t) }))}
          keyingi={tr({ uz: "Kim uchun — o'z mahsulotingiz · Muddat — keyingi darsgacha", ru: 'Для кого — ваш продукт · Срок — до следующего урока' })}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}>
          <p className="ep-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: poydevor — Database, kirish, deploy»</b>: prototip telefonda ochiladi, endi uning ortidagi umumiy Database va kirish navbati.</>, ru: <>Следующий урок — <b>«День проекта: фундамент — Database, вход, деплой»</b>: прототип открывается на телефоне, теперь очередь общей Database и входа, которые стоят за ним.</> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function ExpoPrototypeLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, ScreenA1, ScreenA2, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI — «Maydon Jamoa» telefoni (ep-). Faqat qolip tokenlari (D3), emoji yo'q (D4); nom rangi — #2E9E4F (tayanch 9.62). Telefon 172×272 hamma ekranda (SABOQ 22) === */
        /* Halqa — navbatdagi element (SABOQ 32): kattalashish yo'q, shaffoflik 0.3 dan oshmaydi, sikl 2.4 s; guruhda bitta */
        .ep-halqa { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: ep-puls 2.4s ease-in-out infinite; }
        @keyframes ep-puls { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.3)}; } 50% { box-shadow: 0 0 0 6px ${fon(T.accent, 0)}; } }
        @keyframes ep-kir { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes ep-pop { 0% { transform: scale(1); } 40% { transform: scale(1.35); } 100% { transform: scale(1); } }
        @keyframes ep-sur { from { transform: translateX(100%); } to { transform: none; } }
        @keyframes ep-chiq { from { transform: none; } to { transform: translateX(100%); } }
        @keyframes ep-qiya { from { transform: none; } }
        @keyframes ep-rn { from { opacity: 0; filter: blur(2px); } to { opacity: 1; filter: none; } }
        @keyframes ep-yonish { 0% { background: ${fon(T.accent, 0.45)}; } 100% { background: ${fon(T.accent, 0.14)}; } }
        @keyframes ep-css { 0% { background: ${fon(CODE.str, 0.35)}; } 100% { background: transparent; } }
        @keyframes ep-yig { from { opacity: 0.3; transform: scaleY(1.7); } to { opacity: 1; transform: none; } }
        @keyframes ep-chiz { to { stroke-dashoffset: 0; } }
        @keyframes ep-tush { from { transform: translateY(-120px) scale(1.2); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes ep-kamera { 0% { opacity: 0; transform: scale(1.45); } 55% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1); } }
        @keyframes ep-aylan { 0% { transform: translate(0,0); opacity: 0; } 8% { opacity: 1; } 14% { transform: translate(0,-38px); } 32% { transform: translate(104px,-38px); } 50% { transform: translate(104px,262px); } 68% { transform: translate(-104px,262px); } 84% { transform: translate(-104px,-38px); } 92% { transform: translate(0,-38px); } 100% { transform: translate(0,0); opacity: 0.4; } }
        @keyframes ep-uch { from { transform: translate(0,0); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } to { transform: translate(var(--dx), var(--dy)); opacity: 0; } }
        /* Telefon */
        .ep-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: none; }
        .ep-tel-ust > .q-btn { align-self: center; white-space: nowrap; }
        .ep-tel-yorliq { display: inline-flex; align-items: center; height: 22px; max-width: 180px; padding: 0 8px; border: 1.5px solid ${T.line}; border-radius: 999px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; overflow: hidden; animation: ep-kir 0.35s ease-out both; }
        .ep-tel-yorliq.bosh { visibility: hidden; animation: none; }
        .ep-tel-qob { position: relative; width: 172px; height: 272px; flex: none; }
        .ep-telefon { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 5px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .ep-telefon.pwa { background: linear-gradient(165deg, ${T.paper}, ${T.accentSoft}); }
        .ep-manzil { flex: none; display: flex; align-items: center; gap: 5px; height: 20px; padding: 0 8px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; }
        .ep-manzil span { overflow: hidden; text-overflow: ellipsis; }
        .ep-qulf { position: relative; flex: none; display: inline-block; width: 8px; height: 6px; margin-top: 4px; border-radius: 1.5px; background: ${T.ok}; }
        .ep-qulf::before { content: ''; position: absolute; left: 1px; top: -5px; width: 6px; height: 6px; border: 1.5px solid ${T.ok}; border-bottom: 0; border-radius: 4px 4px 0 0; box-sizing: border-box; }
        .ep-tel-ekran { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; }
        .ep-tel-bar { flex: none; display: flex; justify-content: center; align-items: center; height: 16px; }
        .ep-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: #2E9E4F; letter-spacing: 0.01em; }
        .ep-qatlamlar { position: relative; flex: 1; min-height: 0; }
        .ep-qatlam { position: absolute; inset: 0; display: flex; flex-direction: column; background: ${T.paper}; }
        .ep-qatlam.ost { z-index: 0; }
        .ep-qatlam.sur { animation: ep-sur 0.38s cubic-bezier(.2,.8,.3,1) both; }
        .ep-qatlam.chiq { animation: ep-chiq 0.36s ease-in both; }
        .ep-qatlamlar.qiya .ep-qatlam { padding: 5px; border: 1px solid ${T.line}; border-radius: 10px; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.45); transform: translate(calc(var(--i) * 9px), calc(var(--i) * -8px)) rotate(calc(var(--i) * 3deg)) scale(0.82); animation: ep-qiya 0.5s ease-out both; }
        .ep-ekran-sar { flex: none; font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .ep-oy { display: flex; flex-direction: column; gap: 4px; flex: 1; min-height: 0; transition: opacity 0.3s; }
        .ep-oy.xira { opacity: 0.55; }
        .ep-oy-ro { display: flex; flex-direction: column; gap: 4px; flex: 1; min-height: 0; transition: gap 0.3s; }
        .ep-karta, .ep-karta-btn { display: flex; flex-direction: column; gap: 1px; width: 100%; padding: 4px 6px; border-radius: 9px; background: ${T.bg}; border: 1px solid ${T.line}; font: inherit; text-align: left; color: ${T.ink2}; font-size: 11px; line-height: 1.25; animation: ep-kir 0.4s ease-out var(--d, 0s) both; transition: transform 0.15s, border-radius 0.3s, background 0.3s, border-color 0.3s; }
        .ep-karta-btn { cursor: pointer; }
        .ep-karta-btn:disabled { cursor: default; }
        .ep-karta.bos { transform: scale(0.93); }
        .ep-karta.ochildi { border-color: ${fon(T.ok, 0.5)}; background: ${T.okFon}; }
        .ep-k-q { display: flex; justify-content: space-between; align-items: baseline; gap: 4px; white-space: nowrap; }
        .ep-k-vaqt { font-size: 11px; color: ${T.ink}; }
        .ep-k-son { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: #2E9E4F; white-space: nowrap; }
        .ep-k-joy { font-size: 11px; }
        .ep-tel-btn { margin-top: auto; flex: none; display: flex; align-items: center; justify-content: center; height: 26px; border-radius: 9px; background: ${T.accent}; color: #fff; font-size: 11.5px; font-weight: 800; transition: transform 0.15s, background 0.3s, color 0.3s, border-radius 0.3s; }
        .ep-tel-btn.bos { transform: scale(0.92); }
        .ep-tel-btn.off { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        /* 2-ekran: hali prototip (React, web) ko'rinishidagi qismlar */
        .ep-oy.w-royxat .ep-oy-ro { gap: 0; }
        .ep-oy.w-karta .ep-karta { border-radius: 0; background: ${T.paper}; border-color: ${fon(T.ink, 0.45)}; }
        .ep-oy.w-matn .ep-karta, .ep-oy.w-matn .ep-ekran-sar, .ep-oy.w-matn .ep-k-vaqt { font-family: 'Times New Roman', serif; font-weight: 400; }
        .ep-oy.w-rang .ep-k-son { color: ${T.ink}; }
        .ep-oy.w-rang .ep-tel-btn { background: ${fon(T.ink, 0.12)}; color: ${T.ink}; border-radius: 2px; }
        .ep-oyin, .ep-elon { display: flex; flex-direction: column; gap: 3px; flex: 1; min-height: 0; }
        .ep-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .ep-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .ep-oyin-joy { font-size: 12px; color: ${T.ink2}; }
        .ep-son { display: inline-block; align-self: flex-start; margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: ${T.ink}; transform-origin: left center; }
        .ep-son.yangi { color: #2E9E4F; animation: ep-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .ep-doiralar { display: grid; grid-template-columns: repeat(5, 14px); gap: 6px; margin: 4px 0 6px; }
        .ep-doiralar i { width: 14px; height: 14px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .ep-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.38)}; }
        .ep-doiralar i.yangi { background: #2E9E4F; animation: ep-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .ep-elon-m { padding: 4px 8px; border: 1px solid ${T.line}; border-radius: 8px; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; }
        .ep-bosh-sahifa { flex: 1; border-radius: 10px; background: ${T.paper}; transition: background 0.5s; }
        .ep-bosh-sahifa.kul { background: ${fon(T.ink, 0.08)}; }
        p.ep-tel-izoh { margin: 0; max-width: 210px; text-align: center; font-size: 12.5px; line-height: 1.4; color: ${T.ink2}; }
        /* Konvert — so'rov */
        .ep-konvert { position: absolute; z-index: 6; width: 20px; height: 14px; margin: -7px 0 0 -10px; border-radius: 3px; background: ${T.paper}; border: 1.5px solid ${T.accent}; box-shadow: 0 4px 10px -4px rgba(${T.shadowBase},0.5); pointer-events: none; overflow: hidden; }
        .ep-konvert::before { content: ''; position: absolute; left: 4px; top: -5px; width: 9px; height: 9px; border-right: 1.5px solid ${T.accent}; border-bottom: 1.5px solid ${T.accent}; transform: rotate(45deg); }
        .ep-konvert.aylan { left: 86px; top: 22px; animation: ep-aylan 2s ease-in-out both; }
        .ep-konvert.uch { animation-name: ep-uch; animation-timing-function: cubic-bezier(.45,.05,.4,1); animation-fill-mode: both; }
        .ep-konvert.javob { border-color: ${T.ok}; }
        .ep-konvert.javob::before { border-color: ${T.ok}; }
        /* 0-ekran: telefon oldinda, kompyuter brauzeri orqaroqda */
        .ep-s0 { position: relative; display: flex; align-items: flex-end; min-height: 340px; padding-top: 10px; }
        .ep-s0-tel { position: relative; z-index: 2; align-items: flex-start; }
        .ep-s0-tel > .q-btn { align-self: flex-start; margin-left: 22px; }
        .ep-s0-tel p.ep-tel-izoh { text-align: left; }
        .ep-s0-komp { position: absolute; left: 132px; top: 0; z-index: 1; }
        .q-kirish:has(.ep-s0) .q-variant:disabled:not(.on) { display: none; }
        .q-kirish:has(.ep-s0) .q-variant.on { animation: ep-yig 0.45s cubic-bezier(.2,.9,.3,1) both; transform-origin: top; }
        .q-kirish:has(.ep-s0.kutish) .q-variantlar-kol { border-radius: 14px; outline: 2px solid ${T.accent}; outline-offset: 5px; animation: ep-puls 2.4s ease-in-out 0.9s infinite; }
        .ep-komp { display: flex; flex-direction: column; width: 100%; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.45); overflow: hidden; }
        .ep-komp.kichik { width: 250px; }
        .ep-komp-bar { display: flex; align-items: center; gap: 5px; padding: 6px 9px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; }
        .ep-komp-bar i { width: 7px; height: 7px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; flex: none; }
        .ep-komp-bar span { margin-left: 6px; overflow: hidden; text-overflow: ellipsis; }
        .ep-komp-tana { display: flex; flex-direction: column; gap: 5px; padding: 8px 10px 10px; }
        .ep-komp-sar { font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .ep-komp-ro { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 5px; }
        .ep-komp.kichik .ep-komp-ro { grid-template-columns: repeat(2, minmax(0,1fr)); }
        .ep-komp.ixcham { max-width: 300px; }
        .ep-komp.ixcham .ep-komp-k { padding: 3px 5px; }
        .ep-komp.ixcham .ep-komp-tana { padding: 6px 8px 8px; gap: 3px; }
        .ep-telefon.brauzer .ep-oy-ro { gap: 3px; }
        .ep-telefon.brauzer .ep-karta { padding: 2px 6px; }
        .ep-komp-k { display: flex; flex-direction: column; gap: 1px; min-width: 0; padding: 4px 6px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.bg}; font-size: 11px; line-height: 1.25; color: ${T.ink2}; }
        .ep-komp-k b { font-size: 11px; color: ${T.ink}; }
        /* Telefon chapda + o'ng panel */
        .ep-yonma { display: flex; align-items: flex-start; gap: clamp(14px,2.4vw,28px); }
        .ep-ong { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
        .ep-harakat { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
        .ep-rn-tugmalar, .ep-yechimlar, .ep-treklar, .ep-kenglik { display: flex; flex-wrap: wrap; gap: 8px; border-radius: 12px; padding: 4px; }
        .ep-treklar { align-self: flex-start; }
        .ep-sanoq { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        .ep-sanoq b { display: inline-block; color: ${T.accent}; animation: ep-pop 0.45s ease; }
        /* Kod kartasi */
        .ep-kod, pre.ep-savol-kod, .ep-term, .ep-daraxt, .ep-manifest, code.ep-yol-yorliq, code.ep-fayl-yorliq { font-feature-settings: "liga" 0, "calt" 0; }
        .ep-kod { display: flex; flex-direction: column; gap: 6px; min-width: 0; background: ${CODE.bg}; border-radius: 12px; padding: 10px 12px 12px; transition: box-shadow 0.3s; }
        .ep-kod.yon { box-shadow: 0 0 0 3px ${fon(T.accent, 0.35)}; }
        .ep-kod-f { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${CODE.comment}; overflow-wrap: anywhere; }
        pre.ep-kod-t { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.6; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; }
        pre.ep-savol-kod { margin: 0 0 10px; display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.6; color: ${CODE.text}; background: ${CODE.bg}; border-radius: 10px; padding: 9px 14px; white-space: pre; }
        .ep-s2-kod { min-height: 150px; }
        .ep-bolak { font: inherit; color: ${CODE.attr}; background: ${fon(CODE.text, 0.06)}; border: 1px dashed ${fon(CODE.text, 0.3)}; border-radius: 5px; padding: 0 3px; cursor: pointer; transition: background 0.2s, border-color 0.2s; }
        .ep-bolak:hover { background: ${fon(CODE.text, 0.14)}; }
        .ep-bolak.on { background: ${fon(T.accent, 0.45)}; border: 1px solid ${T.accent}; color: #fff; }
        .ep-rn-q { color: ${CODE.str}; animation: ep-rn 0.5s ease-out both; }
        .ep-yon { border-radius: 4px; animation: ep-yonish 0.9s ease-out both; }
        .ep-fayl-yon .ep-kod-f { color: ${CODE.attr}; }
        .ep-qiymat { display: inline-block; color: ${CODE.comment}; animation: ep-kir 0.35s ease-out both; }
        .ep-css-yangi { color: ${CODE.str}; animation: ep-css 1.2s ease-out both; }
        /* 4-ekran: fayl daraxti */
        .ep-daraxt { display: flex; flex-direction: column; gap: 3px; padding: 10px 12px; background: ${CODE.bg}; border-radius: 12px; }
        .ep-papka { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.7; color: ${CODE.punct}; }
        .ep-fayl-q { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
        .ep-fayl { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${CODE.text}; background: ${fon(CODE.text, 0.06)}; border: 1px solid ${fon(CODE.text, 0.22)}; border-radius: 7px; padding: 2px 9px; cursor: pointer; }
        .ep-fayl:disabled { cursor: default; opacity: 0.55; }
        .ep-fayl.ok, .ep-fayl.ep-halqa { opacity: 1; }
        .ep-fayl.ok { border-color: ${fon(CODE.str, 0.6)}; color: ${CODE.str}; }
        .ep-fayl-b { width: 12px; font-style: normal; color: ${CODE.str}; }
        .ep-yol-y { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${CODE.comment}; }
        .ep-pufak { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${CODE.tag}; background: ${fon(CODE.tag, 0.14)}; border-radius: 6px; padding: 1px 6px; }
        .ep-bog { font-size: 11.5px; font-style: italic; color: ${CODE.comment}; }
        p.ep-izoh { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        p.ep-nom { margin: 0; padding: 9px 13px; border-radius: 11px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        /* 5-ekran: manzil yorliqlari va bitta fayl */
        code.ep-yol-yorliq { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; padding: 3px 10px; border-radius: 999px; border: 1.5px dashed ${T.line}; background: ${T.paper}; }
        code.ep-yol-yorliq.bor { color: ${T.accent}; border: 1.5px solid ${T.accent}; background: ${T.accentSoft}; animation: ep-pop 0.45s ease; }
        .ep-ulash { display: flex; align-items: center; }
        .ep-ulash-chap { display: flex; flex-direction: column; justify-content: space-between; height: 120px; }
        .ep-ulash-ch { width: 60px; height: 120px; flex: none; }
        .ep-ulash-ch path { fill: none; stroke: ${T.accent}; stroke-width: 1.5; stroke-dasharray: 90; stroke-dashoffset: 90; animation: ep-chiz 0.7s ease-out 0.15s forwards; }
        code.ep-fayl-yorliq { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.paper}; background: ${T.ink}; padding: 5px 10px; border-radius: 8px; }
        /* Bashorat: halqada karta → ixcham qator; natija bloki */
        .ep-navbat-k .q-bashorat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: ep-kir 0.5s cubic-bezier(.2,.9,.3,1.1) both, ep-puls 2.4s ease-in-out 0.7s infinite; }
        .ep-navbat-k .q-chip { animation: ep-kir 0.4s ease-out 0.15s both; }
        .ep-navbat-k .q-chip:nth-child(2) { animation-delay: 0.25s; } .ep-navbat-k .q-chip:nth-child(3) { animation-delay: 0.35s; }
        .ep-taxmin { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 8px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; transform-origin: top; animation: ep-yig 0.45s cubic-bezier(.2,.9,.3,1) both; }
        .ep-taxmin-y { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.accent}; }
        .ep-taxmin-s { color: ${T.ink2}; }
        .ep-taxmin b { color: ${T.ink}; }
        .ep-nb { display: flex; flex-direction: column; gap: 6px; }
        .ep-nb-t { font-size: 13.5px; font-weight: 600; color: ${T.ink2}; } .ep-nb-t.ok { color: ${T.ok}; font-weight: 700; } .ep-nb-t b { color: ${T.ink}; }
        .ep-nb-i { font-size: 13.5px; color: ${T.ink}; }
        .ep-nb-x { font-weight: 600; color: ${T.ink}; }
        /* 7-ekran: telefon → Wi-Fi → terminal */
        .ep-s7 { position: relative; display: flex; flex-direction: column; gap: 10px; }
        .ep-holatlar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; }
        .ep-holat { font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink2}; opacity: 0.7; }
        .ep-holat.on { opacity: 1; color: ${T.accent}; border-color: ${T.accent}; background: ${T.accentSoft}; }
        .ep-holat.ok { opacity: 1; color: ${T.ok}; border-color: ${fon(T.ok, 0.4)}; background: ${T.okFon}; }
        .ep-ulandi { font-size: 13px; color: ${T.ok}; }
        .ep-s7-qator { display: flex; align-items: center; max-width: 760px; }
        .ep-tarmoq-past { position: absolute; top: calc(50% + 32px); left: 6px; right: 6px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .ep-tarmoq-past .ep-yechimlar { flex-direction: column; align-items: stretch; }
        .ep-tarmoq-past .q-xato { text-align: center; }
        .ep-tarmoq { position: relative; flex: 1; min-width: 90px; align-self: stretch; display: flex; align-items: center; justify-content: center; }
        .ep-chiziq { position: absolute; left: 0; right: 0; top: 50%; border-top: 2px solid ${fon(T.ink, 0.22)}; }
        .ep-chiziq.uzildi { border-top: 2px dashed ${T.err}; }
        .ep-wifi { position: relative; z-index: 1; width: 48px; height: 40px; padding: 7px 7px 5px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; fill: none; stroke: ${T.ink2}; stroke-width: 2.4; stroke-linecap: round; transition: stroke 0.3s, border-color 0.3s; }
        .ep-wifi circle { fill: ${T.ink2}; stroke: none; }
        .ep-wifi.ok { stroke: ${T.ok}; border-color: ${fon(T.ok, 0.5)}; } .ep-wifi.ok circle { fill: ${T.ok}; }
        .ep-wifi.xato { stroke: ${T.err}; border-color: ${T.err}; } .ep-wifi.xato circle { fill: ${T.err}; }
        .ep-bulut-q { position: absolute; top: 6px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 1px; }
        .ep-bulut-q small { font-size: 11px; color: ${T.ink2}; }
        .ep-bulut { width: 46px; height: 30px; }
        .ep-bulut path { fill: ${T.paper}; stroke: ${T.accent}; stroke-width: 1.6; }
        .ep-term { flex: none; width: 210px; display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 12px; background: ${CODE.bg}; }
        .ep-term-q { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${CODE.text}; overflow-wrap: anywhere; }
        .ep-term-q.buyruq { color: ${CODE.attr}; animation: ep-kir 0.35s ease-out both; }
        .ep-qr-q { position: relative; align-self: center; width: 112px; height: 112px; }
        .ep-qr { display: block; width: 112px; height: 112px; border-radius: 6px; }
        .ep-qr rect { fill: ${T.ink}; } .ep-qr rect.fon, .ep-qr rect.i { fill: #fff; }
        .ep-qr.yangi { animation: ep-kir 0.5s ease-out both; }
        .ep-kamera { position: absolute; inset: -8px; border: 3px solid ${T.accent}; border-radius: 12px; animation: ep-kamera 0.7s ease-out both; }
        .ep-expogo { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .ep-expogo-bar { display: flex; align-items: center; justify-content: space-between; height: 20px; }
        .ep-expogo-bar b { font-size: 12.5px; color: ${T.ink}; }
        .ep-akk { width: 16px; height: 16px; border-radius: 50%; border: 2px solid ${T.ink2}; transition: background 0.3s, border-color 0.3s, box-shadow 0.3s; }
        .ep-akk.xato { border-color: ${T.err}; background: ${T.errFon}; box-shadow: 0 0 0 4px ${fon(T.err, 0.2)}; }
        .ep-akk.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .ep-expogo-t { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .ep-ulanmadi { flex: 1; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: ${fon(T.ink, 0.07)}; }
        .ep-ulanmadi span { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        /* 9-ekran: brauzer oynasi va surgich */
        .ep-yonma.ep-s9 { align-items: flex-start; }
        .ep-s9-chap { flex: 1.35; min-width: 0; display: flex; flex-direction: column; gap: 10px; transition: opacity 0.3s; }
        .ep-s9-chap.xira { opacity: 0.5; }
        .ep-br { display: flex; flex-direction: column; max-width: 100%; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.45); overflow: hidden; transition: width 0.12s; }
                .ep-br-tana { display: flex; flex-direction: column; gap: 6px; padding: 10px; }
        .ep-br-ro { display: flex; gap: 6px; }
        .ep-br-k { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; padding: 6px 7px; border-radius: 9px; border: 1px solid ${T.line}; background: ${T.bg}; font-size: 11.5px; line-height: 1.25; color: ${T.ink2}; overflow: hidden; }
        .ep-br-k b { font-size: 11.5px; color: ${T.ink}; }
        .ep-br-tana.qisiq .ep-br-ro { gap: 4px; }
        .ep-br-tana.qisiq .ep-br-k { padding: 4px 3px; overflow-wrap: anywhere; }
        .ep-br-tana.qisiq .ep-k-son { white-space: normal; }
        .ep-br-tana.ustun .ep-br-ro { flex-direction: column; }
        .ep-br-tana.ustun .ep-br-k { flex: none; }
        .ep-br-tana.ustun .ep-br-k { flex-direction: row; align-items: baseline; gap: 6px; padding: 5px 8px; white-space: nowrap; font-size: 11px; animation: ep-kir 0.4s ease-out both; }
        .ep-br-tana.ustun .ep-br-k b { font-size: 11px; }
        .ep-br-tana.ustun .ep-k-son { margin-left: auto; }
        .ep-surgich { display: flex; flex-direction: column; gap: 4px; padding: 6px 10px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ep-surgich-y { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .ep-surgich input { width: 100%; accent-color: ${T.accent}; cursor: pointer; }
        .q-btn.ep-kalit { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; }
        .ep-kalit-i { position: relative; flex: none; width: 30px; height: 17px; border-radius: 999px; background: ${fon(T.paper, 0.45)}; transition: background 0.25s; }
        .ep-kalit-i::after { content: ''; position: absolute; left: 2px; top: 2px; width: 13px; height: 13px; border-radius: 50%; background: #fff; transition: transform 0.25s; }
        .ep-kalit.on .ep-kalit-i { background: ${T.ok}; }
        .ep-kalit.on .ep-kalit-i::after { transform: translateX(13px); }
        /* 10-ekran: vazifa, natija oynasi */
        ol.ep-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .ep-vazifa li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .ep-vazifa li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; background: ${T.bg}; border: 1.5px solid ${T.line}; color: ${T.ink2}; }
        .ep-vazifa li.ok i { background: ${T.ok}; border-color: ${T.ok}; color: #fff; animation: ep-pop 0.4s ease; }
        .ep-yordam-k { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 10px; }
        .ep-yordam-k > .q-btn { align-self: flex-start; }
        .ep-bajardim { display: flex; justify-content: flex-end; margin-top: auto; padding-top: 12px; }
        .ep-kodoyna, .ep-natija-q { display: flex; flex-direction: column; gap: 10px; }
        .ep-natija-q > .q-btn { align-self: flex-start; }
        .ep-amal { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .ep-amal > .q-btn { align-self: flex-start; }
        .ep-kenglik { align-self: flex-start; }
        .ep-kenglik small { margin-left: 4px; font-size: 11px; color: ${T.ink2}; }
        @media (min-width: 861px) { .q-split.q-kod:has(.ep-natija-q) { grid-template-columns: minmax(0,0.85fr) minmax(0,1.15fr); } }
        .ep-natija { position: relative; width: 100%; overflow: hidden; border-radius: 12px; border: 1.5px solid ${T.line}; background: #fff; }
        .ep-natija-f { position: absolute; top: 0; border: 0; transform-origin: top left; background: #fff; }
        /* 11-ekran: bosh ekran, manifest */
        .ep-s11-chap { flex: none; display: flex; align-items: flex-start; gap: 12px; }
        .ep-bosh { flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 44px; gap: 6px 4px; padding: 16px 2px 4px; align-content: start; }
        .ep-katak { justify-self: center; width: 30px; height: 30px; border-radius: 9px; background: ${fon(T.ink, 0.12)}; }
        .ep-joy { position: relative; justify-self: center; display: flex; justify-content: center; width: 30px; height: 30px; border-radius: 9px; border: 1.5px dashed ${fon(T.ink, 0.38)}; }
        .ep-joy.bor { border-color: transparent; }
        .ep-ikonka { display: block; width: 30px; height: 30px; border-radius: 9px; background: ${T.accent}; box-shadow: 0 4px 10px -4px ${fon(T.accent, 0.6)}; animation: ep-pop 0.45s ease; transition: transform 0.15s; }
        .ep-ikonka.tush { animation: ep-tush 0.7s cubic-bezier(.3,1.3,.5,1) both; }
        .ep-ikonka.bos { transform: scale(0.86); }
        .ep-ikonka.kichik { width: 16px; height: 16px; border-radius: 5px; animation: none; }
        .ep-ik-nom { position: absolute; top: 33px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 11px; font-weight: 800; color: #2E9E4F; animation: ep-kir 0.35s ease-out both; }
        .ep-pwa-yon { display: flex; flex-direction: column; gap: 10px; padding-top: 70px; width: 128px; }
        .ep-o-ch { display: flex; align-items: center; gap: 5px; }
        .ep-o-ch code { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 6px; background: ${T.accentSoft}; color: ${T.accent}; }
        .ep-mini { width: 128px; display: flex; flex-direction: column; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; overflow: hidden; box-shadow: 0 8px 18px -12px rgba(${T.shadowBase},0.45); }
        .ep-mini-bar { padding: 3px 7px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .ep-mini-t { display: flex; flex-direction: column; gap: 3px; padding: 6px 7px; font-size: 11px; color: ${T.ink}; }
        .ep-mini-k { padding: 2px 6px; border-radius: 6px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink2}; }
        .ep-manifest { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ep-manifest .ep-kod-f { color: ${T.ink}; font-size: 12px; }
        .ep-manifest-i { margin-top: -4px; font-size: 12px; color: ${T.ink2}; }
        .ep-mf { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 40px; padding: 5px 8px 5px 10px; border-radius: 9px; border: 1px solid ${T.line}; background: ${T.bg}; transition: opacity 0.3s, background 0.3s; }
        .ep-mf code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; overflow-wrap: anywhere; }
        .ep-mf.xira { opacity: 0.45; }
        .ep-mf.ok { background: ${T.okFon}; border-color: ${fon(T.ok, 0.35)}; animation: ep-kir 0.35s ease-out both; }
        .ep-mf.netlify { justify-content: flex-start; }
        .ep-mf .q-btn { align-self: center; padding: 6px 12px; font-size: 12.5px; }
        .ep-mf-ok { margin-left: auto; color: ${T.ok}; font-size: 14px; }
        /* Reja */
        p.ep-reja-past { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6; color: ${T.ink2}; }
        p.ep-reja-past code { color: ${T.ink}; }
        @media (min-width: 861px) { .q-reja:has(.ep-reja-tel) .q-split { grid-template-columns: minmax(0,0.8fr) minmax(0,1.2fr); } }
        .q-reja:has(.ep-reja-tel) .q-split > .q-col:first-child { align-items: center; }
        /* Amaliyot bloklari */
        .ep-blok { display: flex; flex-direction: column; flex: 1 0 auto; }
        @media (min-width: 861px) { .ep-blok .q-split { grid-template-columns: minmax(0,1.6fr) minmax(0,0.66fr); } }
        .ep-mentor-q { display: flex; align-items: flex-end; gap: 14px; }
        .ep-mentor-q > .mentor { flex: 1; min-width: 0; }
        .ep-mentor-q > .ep-treklar { flex: none; align-self: flex-end; }
        .ep-blok .q-blok-q.joriy p.q-blok-t { font-size: 13.5px; line-height: 1.45; }
        .ep-treklar .q-chip { padding: 6px 14px; }
        .ep-blok .q-blok-q.joriy .q-blok-tana { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: end; gap: 8px 12px; }
        .ep-blok .q-blok-q.joriy .q-blok-tana > p.q-blok-t { grid-column: 1 / -1; }
        .ep-blok .q-blok-q.joriy .q-blok-tana > .q-btn:only-of-type { grid-column: 2; }
        .ep-blok .q-blok-q.joriy .q-blok-tana > p.q-blok-t + .q-btn { grid-column: 2; }
        .ep-blok.qulf .q-blok-qadamlar, .ep-blok.qulf .q-blok-natija { opacity: 0.45; pointer-events: none; filter: saturate(0.4); }
        .ep-band { display: block; margin-top: 3px; font-size: 12.5px; line-height: 1.45; }
        .ep-band::before { content: '· '; color: ${T.accent}; font-weight: 800; }
        .ep-prompt { margin-top: 6px; }
        .ep-ps { display: block; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; font-weight: 500; overflow-wrap: break-word; }
        .ep-joy-in { font-family: 'JetBrains Mono', monospace; font-size: 12px; max-width: 100%; margin: 1px 2px; padding: 1px 6px; border-radius: 6px; border: 1.5px solid ${T.accent}; background: ${T.accentSoft}; color: ${T.ink}; }
        .ep-joy-in.bosh { border-style: dashed; background: ${T.paper}; }
        .ep-joy-in:focus { outline: 2px solid ${T.accent}; outline-offset: 1px; }
        .ep-joy-n { margin-left: 4px; font-size: 12px; font-style: italic; color: ${T.ink2}; }
        .ep-yordam-btn { align-self: flex-start; margin-top: 2px; }
        .ep-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; border: 1px dashed ${T.line}; }
        .ep-yordam-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .ep-yordam-s, .ep-yordam-g { display: block; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; }
        .ep-yordam-g { color: ${T.ink2}; font-style: italic; }
        p.ep-ortda { margin: 0; font-size: 11.5px; line-height: 1.5; color: ${T.ink2}; }
        p.ep-ortda .qcode { font-size: 11px; padding: 0 3px; background: transparent; color: ${T.ink}; white-space: normal; overflow-wrap: anywhere; }
        .ep-nat { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .ep-nat.yon { flex-direction: row; align-items: flex-start; justify-content: center; flex-wrap: wrap; }
        .ep-kir { animation: ep-kir 0.45s ease-out var(--d, 0s) both; }
        p.ep-mini-daraxt { margin: 0; font-size: 11.5px; line-height: 1.6; text-align: center; color: ${T.ink2}; }
        p.ep-mini-daraxt code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink}; }
        .ep-gh { flex: 1; min-width: 160px; max-width: 240px; align-self: center; display: flex; flex-direction: column; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; overflow: hidden; }
        .ep-gh-q { display: flex; align-items: center; gap: 7px; padding: 5px 10px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; border-top: 1px solid ${T.line}; }
        .ep-gh-q.yangi { background: ${T.okFon}; color: ${T.ok}; font-weight: 700; }
        .ep-papka-b { flex: none; width: 12px; height: 9px; border-radius: 2px; background: ${fon(T.ink, 0.35)}; }
        .ep-json { flex: 1; min-width: 160px; max-width: 300px; align-self: center; padding: 8px 10px; gap: 4px; }
        .ep-json pre.ep-kod-t { font-size: 11px; line-height: 1.45; }
        /* Kartochkalar, yakun */
        .ep-flash { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .ep-flash.yangi .fc-card:not(.flip) { border-radius: 18px; outline: 2px solid ${T.accent}; outline-offset: 4px; animation: ep-puls 2.4s ease-in-out infinite; }
        p.ep-fc-ipucha { margin: 0; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .ep-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .ep-yakun { display: flex; flex-direction: column; flex: 1 0 auto; }
        .ep-yakun.belgisiz .done-chip { display: none; }
        p.ep-fikr { margin: 0; max-width: 780px; font-size: 13.5px; line-height: 1.55; color: ${T.ink2}; }
        p.ep-keyingi { margin: 0; font-size: 14px; line-height: 1.5; color: ${T.ink2}; }
        p.ep-keyingi b { color: ${T.ink}; }
        @media (max-width: 640px) {
          .ep-yonma { flex-direction: column; align-items: center; }
          .ep-mentor-q { flex-direction: column; align-items: stretch; }
          .ep-mentor-q > .ep-treklar { align-self: flex-start; }
          .ep-ong { width: 100%; }
          .ep-s9-chap { width: 100%; }
          .ep-s7-qator { flex-direction: column; gap: 6px; }
          .ep-tarmoq { width: 100%; min-height: 64px; }
          .ep-chiziq { left: 50%; right: auto; top: 0; bottom: 0; border-top: 0; border-left: 2px solid ${fon(T.ink, 0.22)}; }
          .ep-chiziq.uzildi { border-top: 0; border-left: 2px dashed ${T.err}; }
          .ep-bulut-q { top: 50%; left: auto; right: 8px; transform: translateY(-50%); }
          .ep-s11-chap { flex-direction: column; align-items: center; }
          .ep-pwa-yon { padding-top: 0; flex-direction: row; width: auto; align-items: center; }
          .ep-s0 { min-height: 360px; }
          .ep-s0-komp { left: auto; right: 0; }
          .ep-komp.kichik { width: 200px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ep-halqa, .ep-navbat-k .q-bashorat, .ep-flash.yangi .fc-card, .q-kirish:has(.ep-s0.kutish) .q-variantlar-kol { animation: none !important; }
          .ep-qatlam.sur, .ep-qatlam.chiq, .ep-qatlamlar.qiya .ep-qatlam, .ep-konvert, .ep-kir, .ep-karta, .ep-karta-btn, .ep-son.yangi, .ep-doiralar i.yangi, .ep-rn-q, .ep-css-yangi, .ep-ikonka, .ep-ik-nom, .ep-mf.ok, .ep-tel-yorliq, .ep-qr.yangi, .ep-kamera, .ep-ulash-ch path, .ep-taxmin, .ep-sanoq b, .ep-term-q.buyruq, .ep-qiymat, code.ep-yol-yorliq.bor, .ep-vazifa li.ok i, .ep-yon, .ep-br-tana.ustun .ep-br-k, .q-kirish:has(.ep-s0) .q-variant.on { animation: none !important; }
          .ep-ulash-ch path { stroke-dashoffset: 0; }
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
