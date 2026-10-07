import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 10-Modul 5-dars «Kiberxavfsizlik: zaiflikni topib yopamiz» (m8-05) — skeletdan qurildi (06.10.2026), MD v3: feedback/F-1005-10modul/05-SecurityBasics-v3.md.
// (Skelet sarlavhasi:) YANGI DARS SKELETI — «Namuna dars» (konveyer, 04.10.2026).
// Yangi dars shu fayldan boshlanadi (pilotdan emas): `cp src/skelet/NamunaDars.jsx src/<N>-Modull/<Nom>Lesson.jsx` (importlar o'zgarmaydi),
// keyin konveyer/2-QURUVCHI.md bo'yicha MD v3 (GATE M o'tgan) matni bilan to'ldiriladi.
// TARKIB: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — TEGILMAYDI;
//   kontent — har qolip turidan bitta namuna: s0 QKirish · s1 QReja · s2 QTushuncha (bashorat → harakat → vizual → xulosa) ·
//   s3 test (QuestionScreen → QTest) · s4 final QTartib · a1 amaliyot bloki (QBlok + ScreenBlok ulagichi, 172/173) · podium · QKartochka · QYakun.
// ALMASHTIRILADI: LESSON_META · HW_TOKENS · SCREEN_META · INLINE_KEYS · RECAPS · ekranlar (s0…) · ACHIEVEMENTS/ACH_TRIGGERS ·
//   Q_LABELS (kalitlar = ballik ekran indekslari, q22) · QZ_BG_SHAPES ({uz,ru}, R-008) · QUIZ_BANK (12 savol, to'g'ri javob 3/3/3/3) ·
//   NAMUNA_FLASHCARDS (darsda 10–12) · SummaryScreen matnlari · screens massivi · export nomi · .nd- CSS bo'limi.
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ru-qoldiq-istisno s13: kod
// (s13 — A1 kutilgan natija kod kartasi: totp.validate token kod va POST /kirish parol kod — repo maydon nomlari, tarjima qilinmaydi)
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QXulosa, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QKod, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';
// Kod oynasi (8-ekran): umumiy modul — ko'p fayl, runtime tekshiruvlar
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

const LESSON_META = { lessonId: 'm8-05-security-basics-v1', lessonTitle: { uz: 'Kiberxavfsizlik: zaiflikni topib yopamiz', ru: 'Кибербезопасность: находим и закрываем уязвимости' } };
// 18 ekran (MD v3, F-1005-10modul/05-SecurityBasics-v3.md): s0 QKirish · s1 QReja · s2/4/6/9/11 QTushuncha · s3/5/7/10 test (QuestionScreen → QTest) · s8 QKod (+ HtmlCompiler) ·
// s12 QTartib (final) · a1/a2 amaliyot bloki (QBlok + ScreenBlok) · podium · kartochkalar · yakun
const HW_TOKENS = [
  { t: 'SQL injection', l: 6, tp: 22, s: 13, d: 6 },
  { t: 'XSS', l: 72, tp: 16, s: 13, d: 7.5 },
  { t: { uz: 'maxfiy kalit', ru: 'секретный ключ' }, l: 14, tp: 70, s: 12, d: 8.5 },
  { t: '2FA', l: 76, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's17', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). s3 B · s5 C · s7 A · s10 D (MD ✔); s12 — final (picked 0/1 sentinel); `practice: -1` — sentinel (QKod va bloklar).
const INLINE_KEYS = { s3: 1, s5: 2, s7: 0, s10: 3, s12: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); emoji o'rniga koddan bitta qator (S-026)
const RcKod = ({ children }) => <code className="qcode">{children}</code>;
const RECAPS = {
  3: {
    title: { uz: 'SQL injection belgisi', ru: 'Признак SQL injection' },
    cards: [
      { ic: null, h: <RcKod>"... telefon = '" + telefon</RcKod>, body: { uz: "Matn so'rovga qo'shilgan — zaiflik shu yerda.", ru: 'Текст вставлен в запрос — уязвимость здесь.' } },
      { ic: null, h: <RcKod>{'find({ where: { telefon } })'}</RcKod>, body: { uz: "Parametrli so'rov — matn alohida uzatiladi.", ru: 'Параметризованный запрос — текст передаётся отдельно.' } },
      { ic: null, h: <RcKod>SQL injection</RcKod>, body: { uz: "Matn so'rovga buyruq bo'lib qo'shilib ketishi.", ru: 'Текст попадает в запрос как команда.' }, ask: { uz: "Matn qo'shilgan so'rov nega xavfli?", ru: 'Чем опасен запрос со вставленным текстом?' } }
    ]
  },
  5: {
    title: { uz: 'XSS yopish', ru: 'Закрываем XSS' },
    cards: [
      { ic: null, h: <RcKod>dangerouslySetInnerHTML</RcKod>, body: { uz: "Ism HTML bo'lib chiqadi — zaiflik shu yerda.", ru: 'Имя выводится как HTML — уязвимость здесь.' } },
      { ic: null, h: <RcKod>{'{b.ism}'}</RcKod>, body: { uz: "React matnni matn bo'lib chiqaradi — kod bo'lib ishlamaydi.", ru: 'React выводит текст как текст — он не работает как код.' } },
      { ic: null, h: <RcKod>XSS</RcKod>, body: { uz: "Matn boshqa odamning sahifasida kod bo'lib ishlab ketishi.", ru: 'Текст срабатывает как код на странице другого человека.' }, ask: { uz: 'Ismni butunlay olib tashlasak, ega nimani yo\'qotadi?', ru: 'Что потеряет владелец, если совсем убрать имя?' } }
    ]
  },
  7: {
    title: { uz: 'Maxfiy kalit', ru: 'Секретный ключ' },
    cards: [
      { ic: null, h: <RcKod>|| 'zaxira-kalit'</RcKod>, body: { uz: "Zaxira kalit kodda — kodni o'qigan ko'radi.", ru: 'Запасной ключ в коде — его видит любой, кто читает код.' } },
      { ic: null, h: <RcKod>process.env.JWT_SECRET</RcKod>, body: { uz: <>Kalit faqat <RcKod>.env</RcKod> dan olinadi.</>, ru: <>Ключ берётся только из <RcKod>.env</RcKod>.</> } },
      { ic: null, h: <RcKod>if (!kalit) throw</RcKod>, body: { uz: "Kalit yo'q bo'lsa — Backend ishga tushmaydi.", ru: 'Если ключа нет — Backend не запускается.' }, ask: { uz: 'Umami ID ham maxfiy kalitmi?', ru: 'Umami ID — тоже секретный ключ?' } }
    ]
  },
  10: {
    title: { uz: '2FA', ru: '2FA' },
    cards: [
      { ic: null, h: <RcKod>EGA_2FA_KALITI</RcKod>, body: { uz: 'Backend va telefon ilovasi kodni bir xil kalitdan hisoblaydi.', ru: 'Backend и приложение на телефоне вычисляют код из одного ключа.' } },
      { ic: null, h: { uz: '6 xonali kod', ru: '6-значный код' }, body: { uz: "Telefon ilovasida ko'rinadi, odatda 30 soniyada yangilanadi.", ru: 'Виден в приложении на телефоне, обычно обновляется каждые 30 секунд.' } },
      { ic: null, h: { uz: 'parol → kod → token', ru: 'пароль → код → токен' }, body: { uz: "Ikki qadam to'g'ri bo'lsa, token beriladi.", ru: 'Если оба шага верны, выдаётся токен.' }, ask: { uz: "Parol begona qo'lga o'tsa, kodsiz kira bo'ladimi?", ru: 'Если пароль попал в чужие руки, можно ли войти без кода?' } }
    ]
  },
  12: {
    title: { uz: 'Ega kirishi tartibi', ru: 'Порядок входа владельца' },
    cards: [
      { ic: null, h: <RcKod>EGA_PAROLI</RcKod>, body: { uz: <>Avval parol <RcKod>.env</RcKod> bilan tekshiriladi.</>, ru: <>Сначала пароль сверяется с <RcKod>.env</RcKod>.</> } },
      { ic: null, h: <RcKod>EGA_2FA_KALITI</RcKod>, body: { uz: 'Keyin 6 xonali kod hisoblab solishtiriladi.', ru: 'Затем 6-значный код вычисляется и сравнивается.' } },
      { ic: null, h: <RcKod>token</RcKod>, body: { uz: "Ikkisi mos kelsa — token beriladi, ro'yxat ochiladi.", ru: 'Если оба совпали — выдаётся токен, открывается список.' }, ask: { uz: "Parolni o'tkazib, to'g'ridan kodga o'tsa bo'ladimi?", ru: 'Можно ли пропустить пароль и сразу перейти к коду?' } }
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

// ===== BITTA VIZUAL — «Xavfsizlik ro'yxati» (163/180): XAVF_KARTALAR · KOD_NAMUNA · NAMUNA_BANDLAR → EgaTelefon · KodKarta · XavfKarta · XavfRuyxat; har ekran shu manbadan =====
// Joylashuv (SABOQ 21–23): telefon = sayt (ega sahifasi) doim CHAPDA, o'lchami barqaror 172×272; Backend / kod kartasi va zaiflik kartasi O'NGDA. Payload yo'q — faqat oddiy ma'lumot (tayanch 7).
// qolip-maket: xr-ega xr-kod xr-karta xr-2fa xr-qidir xr-kirish
const cxx = (...a) => a.filter(Boolean).join(' ');
const useKamHarakat = () => typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
// Ekrandan chiqilganda hamma kechiktirilgan qadamlar bekor bo'ladi
const useTaymer = () => {
  const ref = useRef([]);
  useEffect(() => () => ref.current.forEach(clearTimeout), []);
  return useCallback((fn, ms) => { ref.current.push(setTimeout(fn, ms)); }, []);
};
const NAMUNA_BANDLAR = [
  { soat: '18:00', ism: 'Ali', tel: '+998 90 000 00 01' },
  { soat: '17:00', ism: 'Bek', tel: '+998 90 000 00 02' }
];
const QIDIRUV_TEL = NAMUNA_BANDLAR[0].tel;
const KOD_2FA = '284 193'; // namuna ko'rinish (MD A-5, TAYANCHGA SAVOL 4)
// 3 zaiflik + 2FA qatori (MD KOD 2): nom · joy (agent o'zgarishi) · belgi (11-ekran tekshiruvi) · yopish (yopilgan kod)
const XAVF_KARTALAR = [
  { id: 'sql', nom: 'SQL injection', joy: { uz: 'ega qidiruvi', ru: 'поиск владельца' }, belgi: { uz: "Qidiruv so'rovida matn qo'shilmagan (parametrli)", ru: 'В запросе поиска текст не вставлен (параметризованный)' }, yopish: 'find({ where: { telefon } })' },
  { id: 'xss', nom: 'XSS', joy: { uz: "ro'yxatdagi ism", ru: 'имя в списке' }, belgi: { uz: 'Ism oddiy matn bo\'lib chiqadi', ru: 'Имя выводится обычным текстом' }, yopish: '{b.ism}' },
  { id: 'kalit', nom: { uz: 'Maxfiy kalit kodda', ru: 'Секретный ключ в коде' }, joy: 'JWT_SECRET', belgi: { uz: '`JWT_SECRET` faqat `.env` dan', ru: '`JWT_SECRET` только из `.env`' }, yopish: 'process.env.JWT_SECRET' }
];
const QATOR_2FA = { nom: '2FA', joy: { uz: 'ega kirishi', ru: 'вход владельца' } };
// Har zaiflikning «ochiq» va «yopilgan» kod kartasi (MD 2, 4, 6-ekran) — ikki ko'rinish
const KOD_NAMUNA = {
  sql: {
    nom: 'Backend · NestJS',
    qosh: ["const sql = \"... WHERE telefon = '\" + telefon + \"'\"", 'db.query(sql)'],
    param: ['bandlar.find({', '  where: { telefon }', '})']
  },
  xss: {
    nom: { uz: 'Sayt · Ega.jsx', ru: 'Сайт · Ega.jsx' },
    html: ['<li dangerouslySetInnerHTML={{ __html: b.ism }} />'],
    matn: ['<li>{b.ism}</li>']
  },
  kalit: {
    nom: 'Backend · NestJS',
    zaxira: ['const kalit = process.env.JWT_SECRET', "  || 'zaxira-kalit'"],
    env: ['const kalit = process.env.JWT_SECRET', "if (!kalit) throw new Error(\"JWT_SECRET yo'q\")"]
  }
};

// Uchish (SABOQ 19): konvert manbadan nishonga uchadi; joylar DOM dan o'lchanadi (⛶ va --lz zoom ichida ham to'g'ri). Kam harakat rejimida — uchmaydi.
const UCH_MS = 800;
const useUch = () => {
  const box = useRef(null);
  const kam = useKamHarakat();
  const taymer = useTaymer();
  const [uchlar, setUchlar] = useState([]);
  const uchir = useCallback((dan, ga, matn, tur) => {
    const b = box.current; if (kam || !b) return;
    const s = b.querySelector(dan), n = b.querySelector(ga); if (!s || !n) return;
    const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
    const o = (el) => { const r = el.getBoundingClientRect(); return [(r.left + r.width / 2 - br.left) / z, (r.top + r.height / 2 - br.top) / z]; };
    const [x1, y1] = o(s), [x2, y2] = o(n);
    const k = Math.random().toString(36).slice(2);
    setUchlar(a => [...a, { k, matn, tur, x1, y1, dx: x2 - x1, dy: y2 - y1 }]);
    taymer(() => setUchlar(a => a.filter(u => u.k !== k)), UCH_MS + 80);
  }, [kam, taymer]);
  return { box, uchlar, uchir, kam, taymer, d: kam ? 0 : UCH_MS };
};
const Konvert = ({ u }) => (
  <span className={cxx('xr-uch', u.tur, !u.matn && 'nuqta')} aria-hidden="true" style={{ left: u.x1 + 'px', top: u.y1 + 'px', '--dx': u.dx + 'px', '--dy': u.dy + 'px' }}>{u.matn}</span>
);

// Ega telefoni = «Maydon» ega sahifasi (191 ramka; SABOQ 22–23): ustida texnologiya yorlig'i, ostida o'z tugmasi (children).
// ekran: 'royxat' (kirilgan: qidiruv + bandlar) · 'kirish' (parol formasi; kod — 2FA maydoni) · yon: ajraladigan joy · ismTur: 4-ekran belgisi (html | matn)
const EgaTelefon = ({ ekran = 'royxat', qidiruv = '', topildi, yon, ismTur, kod, kodMaydon, parol = true, onQidir, kirdi, tex = true, className, children }) => {
  const yQid = yon === 'qidiruv', yIsm = yon === 'ism', yKod = yon === 'kod', yKir = yon === 'kirish';
  return (
  <div className={cxx('xr-tel-ust', className)}>
    {tex && <span className="xr-tel-tex"><b>{tr({ uz: 'Sayt · React', ru: 'Сайт · React' })}</b><code>/ega</code></span>}
    <div className="xr-telefon">
      <div className="xr-tel-manzil"><i /><span>maydon/ega</span></div>
      {ekran === 'royxat' ? (
        <div className="xr-tel-sahifa" key="royxat">
          <div className="xr-tel-bosh"><b>{tr({ uz: 'Bandlar', ru: 'Брони' })}</b>{kirdi && <span className="xr-kirdi">{tr({ uz: 'parol + kod ✓', ru: 'пароль + код ✓' })}</span>}</div>
          <div className={cxx('xr-qidiruv', yQid && 'yon')}>
            <span className={cxx('xr-input', qidiruv && 'tola')}>{qidiruv || tr({ uz: 'Telefon raqami', ru: 'Номер телефона' })}</span>
            <button type="button" className={cxx('xr-qidir', onQidir && 'xr-navbat')} disabled={!onQidir} onClick={onQidir}>{tr({ uz: 'Qidirish', ru: 'Искать' })}</button>
          </div>
          {NAMUNA_BANDLAR.map((b, i) => (
            <div key={b.soat} className={cxx('xr-qator', topildi && (i === 0 ? 'top' : 'xira'))}>
              <span className="xr-qator-1"><b>{b.soat}</b> · <span className={cxx('xr-ism', i === 0 && yIsm && 'yon', i === 0 && ismTur)}>{b.ism}{i === 0 && ismTur && <small key={ismTur}>{ismTur === 'html' ? 'HTML' : tr({ uz: 'matn', ru: 'текст' })}</small>}</span></span>
              <code>{b.tel}</code>
            </div>
          ))}
        </div>
      ) : (
        <div className="xr-tel-sahifa" key="kirish">
          <div className="xr-tel-bosh"><b>{tr({ uz: 'Ega kirishi', ru: 'Вход владельца' })}</b></div>
          <span className={cxx('xr-input xr-parol', parol && 'tola')}><small>{tr({ uz: 'Parol', ru: 'Пароль' })}</small>{parol ? '••••••' : ''}</span>
          {kodMaydon && <span className={cxx('xr-input xr-kodm', kod && 'tola', yKod && 'yon')} key="kodm"><small>{tr({ uz: '6 xonali kod', ru: '6-значный код' })}</small>{kod || '_ _ _ _ _ _'}</span>}
          <span className={cxx('xr-kirish', yKir && 'yon')}>{kodMaydon ? tr({ uz: 'Kirish', ru: 'Войти' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })}</span>
        </div>
      )}
    </div>
    {children}
  </div>
  );
};
// Telefon ilovasi (2FA kodi): xuddi shu o'lchamdagi ikkinchi telefon (SABOQ 22); taymer — sokin yoy, tinimsiz aylanmaydi
const IlovaTelefon = ({ kod, yon }) => (
  <div className="xr-tel-ust">
    <span className="xr-tel-tex"><b>{tr({ uz: 'Telefon ilovasi', ru: 'Приложение на телефоне' })}</b></span>
    <div className="xr-telefon ilova">
      <div className="xr-tel-manzil"><i /></div>
      <div className="xr-ilova">
        <span className="xr-ilova-n">Maydon · ega</span>
        {kod ? <b className={cxx('xr-ilova-kod', yon && 'yon')} key="kod">{KOD_2FA}</b> : <b className="xr-ilova-kod bosh">— — —</b>}
        <span className="xr-ilova-t"><i aria-hidden="true" />30 s</span>
      </div>
    </div>
  </div>
);
// Kod kartasi (fmtCode emas — satrlar o'zi kod): nom · satrlar · yon (ajraladigan satr va rangi) · skelet (tanlovdan oldin sokin)
const KodKarta = ({ nom, satrlar = [], eski = [], yon, skelet, className, children }) => (
  <div className={cxx('xr-kod', className)}>
    <span className="xr-kod-n">{tr(nom)}</span>
    {(skelet || satrlar.length > 0) && <div className="xr-kod-oyna" key={satrlar.join('|')}>
      {!skelet && eski.map((q, i) => <code key={'e' + i} className="xr-kod-q xr-eski">{q}</code>)}
      {skelet
        ? <><i className="xr-skelet" /><i className="xr-skelet q" /></>
        : satrlar.map((q, i) => <code key={i} className={cxx('xr-kod-q', 'k' + i, yon && yon.i === i && yon.t)}>{q}</code>)}
    </div>}
    {children}
  </div>
);
// Zaiflik kartasi: qizil «ochiq» → yashil «yopilgan» (rangli yon chiziq yo'q, SABOQ 7); ✓ belgi raqam o'rniga «tushadi»
const XavfKarta = ({ k, n, holat = 'ochiq', belgi, className, children }) => (
  <div className={cxx('xr-karta', holat, className)}>
    <span className="xr-karta-r" key={holat}>{holat === 'yopilgan' ? '✓' : n}</span>
    <span className="xr-karta-b"><b>{tr(k.nom)}</b><small>{tr(k.joy)}</small></span>
    <span className="xr-pill" key={'p' + holat}>{holat === 'yopilgan' ? tr({ uz: 'yopilgan', ru: 'закрыта' }) : tr({ uz: 'ochiq', ru: 'открыта' })}</span>
    {belgi}
    {children}
  </div>
);
const Qator2FA = ({ holat = 'yoq', className }) => {
  const qosh = holat === 'qoshildi';
  return (
  <div className={cxx('xr-karta xr-2fa', qosh ? 'yopilgan' : 'kul', className)}>
    <span className="xr-karta-r" key={holat}>{qosh ? '✓' : '+'}</span>
    <span className="xr-karta-b"><b>{QATOR_2FA.nom}</b><small>{tr(QATOR_2FA.joy)}</small></span>
    <span className="xr-pill" key={'p' + holat}>{qosh ? tr({ uz: "qo'shildi", ru: 'добавлен' }) : tr({ uz: "yo'q", ru: 'нет' })}</span>
  </div>
  );
};
// «Xavfsizlik ro'yxati»: uch karta + (ixtiyoriy) 2FA qatori; navbat — kirishda kartalar birin-ketin chiqadi
const XavfRuyxat = ({ holatlar = ['ochiq', 'ochiq', 'ochiq'], fa, navbat, belgilar, className }) => (
  <div className={cxx('xr-ruyxat', navbat && 'navbat', belgilar && 'ixcham', className)}>
    {XAVF_KARTALAR.map((k, i) => <XavfKarta key={k.id} k={k} n={i + 1} holat={holatlar[i]} belgi={belgilar && belgilar[i]} />)}
    {fa && <Qator2FA holat={fa} />}
  </div>
);
// Bashorat (SABOQ 11/19): karta yengil ko'tarilib kiradi, variantlar navbat bilan; tanlangach ixcham qatorga yig'iladi va natijagacha turadi
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="xr-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <div className="xr-taxmin"><span className="xr-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="xr-taxmin-s">{savol}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Natija bloki (SABOQ 25): bitta yashil blok — birinchi qator taxmin, keyin joriy qator (atama), xulosa va qo'shimcha qatorlar
const NatijaBlok = ({ tanlov, togri, variantlar, haqiqat, izoh, xulosa, qoshimcha = [] }) => {
  const tx = variantlar.find(v => v.k === tanlov);
  const ok = tanlov === togri;
  return (
    <div className="q-xulosa xr-nb">
      {tx && <span className={cxx('xr-nb-t', ok && 'ok')}>{ok
        ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })}</>
        : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(haqiqat)}</b></>}</span>}
      {izoh && <span className="xr-nb-i">{izoh}</span>}
      <span>{xulosa}</span>
      {qoshimcha.map((q, i) => <span key={i} className="xr-nb-q">{q}</span>)}
    </div>
  );
};
// Ikki ko'rinishli tushuncha-ekran holati (2, 4, 6): ko'rilganlar to'plami, joriy ko'rinish, uchish bosqichi
const useIkkiKorinish = (avval, oxirgi) => {
  const [korildi, setKorildi] = useState(() => new Set(avval ? ['a', 'b'] : []));
  const [joriy, setJoriy] = useState(avval ? oxirgi : null);
  const [bosqich, setBosqich] = useState(avval ? 3 : 0); // 0 — tanlanmagan · 1 — so'rov yo'lda · 2 — kod/so'rov ko'rindi · 3 — javob qaytdi
  const [yur, setYur] = useState(false);
  return { korildi, setKorildi, joriy, setJoriy, bosqich, setBosqich, yur, setYur };
};
const KorinishTugmalari = ({ variantlar, joriy, korildi, yur, onTanla }) => (
  <div className="xr-tanla">
    {variantlar.map(v => <QChip key={v.k} holat={joriy === v.k ? 'on' : undefined} className={cxx(!korildi.has(v.k) && !yur && 'xr-navbat')} disabled={yur} onClick={() => onTanla(v.k)}>{korildi.has(v.k) && joriy !== v.k ? '✓ ' : ''}{fmtCode(tr(v.t))}</QChip>)}
  </div>
);
const Gap = ({ t, children }) => <p className={cxx('xr-gap', t)} key={t}>{children}</p>;

// ===== SCREEN 0 — KIRISH (QKirish): ega sahifasi ishlaydi, agent «uchtasi ishlayapti» dedi =====
const HOOK_OPTS = [
  { id: 'a', t: { uz: "Sinab ko'rib — sahifa ochilsa, demak xavfsiz", ru: 'Проверив — если страница открылась, значит безопасно' } },
  { id: 'b', t: { uz: "Koddagi xavfli joylarni o'qib, tuzatib", ru: 'Прочитав и исправив опасные места в коде' } },
  { id: 'c', t: { uz: "Agentdan so'rab — u xavfsiz desa, yetadi", ru: 'Спросив агента — если скажет «безопасно», хватит' } }
];
const HOOK_JAVOB = {
  a: { uz: <><b>Qiziq fikr!</b> Sahifa ochilgani kod xavfsizligini bildirmaydi: zaiflik oddiy ma'lumotda ko'rinmasligi mumkin.</>, ru: <><b>Интересная мысль!</b> То, что страница открылась, не говорит о безопасности кода: на обычных данных уязвимость может быть не видна.</> },
  b: { uz: <><b>Aynan!</b> Bu misolda uchtasi oddiy ma'lumot bilan ishlaydi. Bu darsda zaiflikni xavfli joylarni o'qib topamiz va tuzatamiz.</>, ru: <><b>Именно!</b> В этом примере все три работают на обычных данных. На этом уроке мы найдём уязвимость, читая опасные места в коде, и исправим её.</> },
  c: { uz: <><b>Qiziq fikr!</b> Agent talabga tayanib quradi — kodni baribir o'zingiz o'qib tekshirasiz.</>, ru: <><b>Интересная мысль!</b> Агент строит по требованию — код всё равно читаете и проверяете вы сами.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const kam = useKamHarakat();
  const taymer = useTaymer();
  const avval = !!storedAnswer;
  const [qidiruv, setQidiruv] = useState(avval ? QIDIRUV_TEL : '');
  const [topildi, setTopildi] = useState(avval);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const qidir = () => {
    if (qidiruv) return;
    const qad = kam ? QIDIRUV_TEL.length : 6; // telefon raqami terilib boradi
    for (let j = 1; j <= qad; j++) taymer(() => setQidiruv(QIDIRUV_TEL.slice(0, Math.ceil(QIDIRUV_TEL.length * j / qad))), kam ? 0 : j * 70);
    taymer(() => { setTopildi(true); setSc(n => n + 1); }, kam ? 0 : qad * 70 + 250);
  };
  const pick = (v) => { if (picked !== null || !topildi) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Agent qo'shgan uch o'zgarish <span className="italic" style={{ color: T.accent }}>xavfsizmi</span>?</>, ru: <>Три изменения от агента — <span className="italic" style={{ color: T.accent }}>безопасны</span>?</> })}
        mentor={<Mentor>{tr({ uz: "O'tgan darsda B variant («18:00 ni band qilish») ishga tushdi — A: 9 dan 3, B: 8 dan 4. Bugun ega sahifasiga qarang: Antigravity uchta o'zgarish qo'shdi.", ru: 'На прошлом уроке запустили вариант B («Забронировать 18:00») — A: 3 из 9, B: 4 из 8. Сегодня посмотрите на страницу владельца: Antigravity добавил три изменения.' })}</Mentor>}
        maket={<div className="xr-kirish-m">
          <EgaTelefon qidiruv={qidiruv} topildi={topildi} onQidir={!qidiruv ? qidir : undefined} />
          {picked === null
            ? <div className="xr-chat">
                <span className="xr-chat-h">Antigravity</span>
                <p className="xr-puf siz">{tr({ uz: "Ega sahifasini yaxshila: telefon bo'yicha qidiruv, ism qalinroq ko'rinsin, Backend kalitsiz ham ishga tushaversin.", ru: 'Улучши страницу владельца: поиск по телефону, имя пожирнее, а Backend пусть запускается и без ключа.' })}</p>
                <p className="xr-puf agent">{tr({ uz: 'Tayyor! Uchtasi ham ishlayapti.', ru: 'Готово! Все три работают.' })}</p>
              </div>
            : <XavfRuyxat navbat className="xr-kirish-r" />}
        </div>}
        savol={tr({ uz: 'Uchtasi ishlayapti. Xavfsizligini qayerdan bilamiz?', ru: 'Все три работают. Откуда нам знать, что они безопасны?' })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={!topildi}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda ega sahifasi va «Xavfsizlik ro'yxati» — bir marta o'zi o'ynaydi: qizil → yashil, 2FA qo'shiladi =====
const REJA = [
  { t: { uz: 'Qidiruv so\'rovi matnni qo\'shmasin', ru: 'Запрос поиска не вставляет текст' }, teg: 'SQL injection' },
  { t: { uz: 'Ism kod emas, matn bo\'lib chiqsin', ru: 'Имя выводится текстом, а не кодом' }, teg: 'XSS' },
  { t: { uz: 'Maxfiy kalit kodda turmasin', ru: 'Секретный ключ не лежит в коде' }, teg: { uz: 'maxfiy kalitlar', ru: 'секретные ключи' } },
  { t: { uz: 'Ega kirishiga ikkinchi qadam', ru: 'Второй шаг для входа владельца' }, teg: '2FA' }
];
const REJA_YON = ['qidiruv', 'ism', null, null];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const kam = useKamHarakat();
  const taymer = useTaymer();
  const [n, setN] = useState(kam ? 4 : 0); // nechta qadam yopildi (kirishda bir marta o'ynaydi)
  useEffect(() => { if (kam) return; [1100, 1900, 2700, 3500].forEach((ms, i) => taymer(() => setN(i + 1), ms)); }, []); // eslint-disable-line
  const holatlar = [0, 1, 2].map(i => (n > i ? 'yopilgan' : 'ochiq'));
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun ega sahifasining <span className="italic" style={{ color: T.accent }}>uch zaifligini</span> yopasiz.</>, ru: <>Закроете <span className="italic" style={{ color: T.accent }}>три уязвимости</span> страницы владельца.</> })}
        mentor={<Mentor>{tr({ uz: "Har zaiflikni kodda topib, bitta o'zgarish bilan yopamiz. Oxirida ega kirishiga ikkinchi qadam — telefon ilovasidagi 6 xonali kod qo'shamiz.", ru: 'Каждую уязвимость найдём в коде и закроем одним изменением. В конце добавим ко входу владельца второй шаг — 6-значный код из приложения на телефоне.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida — uch karta yashil, ega kirishi 2FA bilan', ru: 'В конце урока — три зелёные карточки и вход владельца с 2FA' })}
        chap={<div className="xr-reja">
          <EgaTelefon yon={REJA_YON[n - 1] || undefined} kirdi={n >= 4} />
          <XavfRuyxat holatlar={holatlar} fa={n >= 4 ? 'qoshildi' : 'yoq'} navbat />
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <p className="xr-repo mono">{tr({ uz: 'repo', ru: 'репо' })} <code>maydon</code> · {tr({ uz: 'boshlanish', ru: 'начало' })} <code>m10-dars-05-start</code> · {tr({ uz: 'tayyor namuna', ru: 'готовый образец' })} <code>m10-dars-05-done</code></p>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA: SQL injection (bashorat + ikki ko'rinish). Telefon so'rov yuboradi → Backend kodi → Database'ga boradigan so'rov → Ali qaytadi =====
const S2_SAVOL = { uz: "Telefon matni to'g'ridan so'rov ichiga qo'shilsa, u qanday o'qiladi?", ru: 'Если текст телефона вставить прямо в запрос, как он прочитается?' };
const S2_TAXMIN = [{ k: 'matn', t: { uz: "Doim oddiy matn bo'lib", ru: 'Всегда как обычный текст' } }, { k: 'buyruq', t: { uz: "Ba'zan buyruq bo'lib", ru: 'Иногда как команда' } }];
const S2_KORINISH = [{ k: 'a', t: { uz: "Matnni qo'shib yasash", ru: 'Со вставкой текста' } }, { k: 'b', t: { uz: "Parametrli so'rov", ru: 'Параметризованный запрос' } }];
const S2_GAP = {
  a: { uz: "Telefon matni so'rovga qo'shilib ketadi — matn emas, buyruq bo'lib o'qilishi mumkin.", ru: 'Текст телефона вставляется в запрос — он может прочитаться не как текст, а как команда.' },
  b: { uz: "Telefon qiymati parametr bo'lib uzatiladi — SQL buyruq satriga qo'shilmaydi.", ru: 'Значение телефона передаётся параметром — в строку SQL-команды не вставляется.' }
};
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, taymer, d } = useUch();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const s = useIkkiKorinish(avval, 'b');
  const done = s.korildi.size >= 2 && !s.yur;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tanla = (v) => {
    if (s.yur || !taxmin) return;
    s.setYur(true); s.setJoriy(v); s.setBosqich(1);
    uchir('.xr-telefon', '.xr-kod', QIDIRUV_TEL);
    taymer(() => s.setBosqich(2), d);
    taymer(() => uchir('.xr-kod', '.xr-telefon', '18:00 · Ali', 'ok'), d + (d ? 700 : 0));
    taymer(() => { s.setBosqich(3); s.setKorildi(k => new Set([...k, v])); s.setYur(false); }, 2 * d + (d ? 700 : 0));
  };
  const v = tugadi ? 'b' : s.joriy;
  const bq = tugadi ? 3 : s.bosqich;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · SQL injection', ru: 'Понятие · SQL injection' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Ikki ko'rinishni ko'ring (${s.korildi.size}/2)`, ru: `Посмотрите оба варианта (${s.korildi.size}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Qidiruv so'rovi telefon matnini <span className="italic" style={{ color: T.accent }}>qanday ishlatadi</span>?</>, ru: <>Как запрос поиска <span className="italic" style={{ color: T.accent }}>использует</span> текст телефона?</> })}
        mentor={<Mentor>{tr({ uz: "Agent qidiruv so'rovini ikki xil yozishi mumkin. Ikkala ko'rinishni bosib, so'rovga nima tushishiga qarang.", ru: 'Агент может написать запрос поиска двумя способами. Нажмите оба варианта и посмотрите, что попадает в запрос.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="xr-chizma" ref={box}>
          <EgaTelefon qidiruv={QIDIRUV_TEL} topildi={bq >= 3} yon={bq === 1 ? 'qidiruv' : undefined}>
          </EgaTelefon>
          <div className={cxx('xr-yol', taxmin && !tugadi && 'tanla', bq >= 3 && 'chap')}>
            {taxmin && !tugadi && <KorinishTugmalari variantlar={S2_KORINISH} joriy={s.joriy} korildi={s.korildi} yur={s.yur} onTanla={tanla} />}
            <span className="xr-yol-c" aria-hidden="true"><span key={bq >= 3 ? 'j' : 's'}>{bq >= 3 ? tr({ uz: 'javob', ru: 'ответ' }) : 'GET /bandlar/qidir'}</span><i /></span>
          </div>
          <div className="xr-ong">
            <XavfKarta k={XAVF_KARTALAR[0]} n={1} holat={v === 'b' && bq >= 2 ? 'yopilgan' : 'ochiq'} />
            <KodKarta nom={KOD_NAMUNA.sql.nom} skelet={!v || bq < 2} satrlar={v === 'a' ? KOD_NAMUNA.sql.qosh : KOD_NAMUNA.sql.param} yon={v === 'a' ? { i: 0, t: 'err' } : { i: 1, t: 'ok' }}>
              {v && bq >= 2 && <div className={cxx('xr-db', v === 'a' ? 'err' : 'ok')} key={v}>
                <span className="xr-db-n">{tr({ uz: "Database'ga boradi", ru: 'Уходит в Database' })}</span>
                {v === 'a'
                  ? <code>SELECT * FROM bandlar WHERE telefon = '<mark>{QIDIRUV_TEL}</mark>'</code>
                  : <><code>SELECT * FROM bandlar WHERE telefon = <mark>$1</mark></code><code className="xr-db-qiymat">$1 = {QIDIRUV_TEL}</code></>}
              </div>}
            </KodKarta>
            {v && bq >= 2 && !tugadi && <Gap t={v === 'a' ? 'err' : 'ok'}>{tr(S2_GAP[v])}</Gap>}
          </div>
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
        natija={done && <NatijaBlok tanlov={taxmin} togri="buyruq" variantlar={S2_TAXMIN} haqiqat={{ uz: "ba'zan buyruq bo'lib", ru: 'иногда как команда' }}
          izoh={tr({ uz: <>Foydalanuvchi yozgan matn Database so'roviga buyruq bo'lib qo'shilib ketishi — <b>SQL injection</b> deyiladi.</>, ru: <>Когда текст пользователя попадает в запрос к Database как команда — это называется <b>SQL injection</b>.</> })}
          xulosa={tr({ uz: "Qidiruv so'rovida telefon matnini qo'shmang. Parametrli so'rovda alohida uzatiladi, buyruq bo'lib o'qilmaydi.", ru: 'Не вставляйте текст телефона в запрос поиска. В параметризованном запросе значение передаётся отдельно — как команда не читается.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — TEST 1 (INLINE_KEYS.s3 = 1, B) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Kodda qaysi belgi SQL injection zaifligini ko'rsatadi?"
    question={tr({ uz: <h2 className="title h-ask">Kodda qaysi belgi <span className="italic" style={{ color: T.accent }}>SQL injection</span> zaifligini ko'rsatadi?</h2>, ru: <h2 className="title h-ask">Какой признак в коде указывает на уязвимость <span className="italic" style={{ color: T.accent }}>SQL injection</span>?</h2> })}
    options={[
      { uz: "So'rov `GET` emas, `POST` bilan yuborilgan", ru: 'Запрос отправлен через `POST`, а не `GET`' },
      { uz: "Foydalanuvchi matni so'rov satriga qo'shilgan", ru: 'Текст пользователя вставлен в строку запроса' },
      { uz: "Qidiruv telefon bo'yicha, ism bo'yicha emas", ru: 'Поиск по телефону, а не по имени' },
      { uz: "So'rov `bandlar` jadvaliga yuborilgan", ru: 'Запрос отправлен в таблицу `bandlar`' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Matn so'rovga qo'shilsa, u buyruq bo'lib o'qilishi mumkin — shuni parametr bilan ajratamiz.", ru: 'Если текст вставлен в запрос, он может прочитаться как команда — поэтому отделяем его параметром.' }}
    explainWrong={{
      0: { uz: "`GET` yoki `POST` so'rov turi — zaiflik matnni qo'shishda.", ru: '`GET` или `POST` — тип запроса; уязвимость во вставке текста.' },
      2: { uz: "Qaysi ustun bo'yicha qidirish zaiflik emas — matnni qo'shish.", ru: 'Столбец поиска тут ни при чём — уязвимость во вставке текста.' },
      3: { uz: "Har so'rov bir jadvalga boradi — bu normal.", ru: 'Каждый запрос идёт к какой-то таблице — это нормально.' },
      default: { uz: "Zaiflik — matnni so'rovga qo'shishda.", ru: 'Уязвимость — во вставке текста в запрос.' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA: XSS (bashorat + ikki ko'rinish). Sayt kodi ismni telefondagi ro'yxatga chiqaradi: HTML bo'lib yoki matn bo'lib =====
const S4_SAVOL = { uz: 'Ism HTML sifatida chiqarilsa, uning ichidagi belgilar nima bo\'ladi?', ru: 'Если имя вывести как HTML, чем станут символы внутри него?' };
const S4_TAXMIN = [{ k: 'matn', t: { uz: "Oddiy matn bo'lib ko'rinadi", ru: 'Будут видны как обычный текст' } }, { k: 'kod', t: { uz: "Sahifa kodining bir qismi bo'ladi", ru: 'Станут частью кода страницы' } }];
const S4_KORINISH = [{ k: 'a', t: { uz: 'HTML sifatida chiqarish', ru: 'Вывести как HTML' } }, { k: 'b', t: { uz: 'Oddiy matn sifatida', ru: 'Как обычный текст' } }];
const S4_GAP = {
  a: { uz: "Ism HTML bo'lib qo'yiladi: ichidagi belgilar sahifa kodining bir qismi bo'lib ketishi mumkin.", ru: 'Имя вставляется как HTML: символы внутри могут стать частью кода страницы.' },
  b: { uz: "React ismni matn bo'lib chiqaradi: belgilar ekranda ko'rinadi, kod bo'lib ishlamaydi.", ru: 'React выводит имя как текст: символы видны на экране, кодом не работают.' }
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, taymer, d } = useUch();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const s = useIkkiKorinish(avval, 'b');
  const done = s.korildi.size >= 2 && !s.yur;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tanla = (v) => {
    if (s.yur || !taxmin) return;
    s.setYur(true); s.setJoriy(v); s.setBosqich(2);
    taymer(() => uchir('.xr-kod-oyna', '.xr-ism', 'Ali'), d ? 350 : 0);
    taymer(() => { s.setBosqich(3); s.setKorildi(k => new Set([...k, v])); s.setYur(false); }, d + (d ? 350 : 0));
  };
  const v = tugadi ? 'b' : s.joriy;
  const bq = tugadi ? 3 : s.bosqich;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · XSS', ru: 'Понятие · XSS' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Ikki ko'rinishni ko'ring (${s.korildi.size}/2)`, ru: `Посмотрите оба варианта (${s.korildi.size}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ism ekranda matn bo'lib chiqadimi yoki <span className="italic" style={{ color: T.accent }}>kod bo'lib</span>?</>, ru: <>Имя выходит на экран текстом или <span className="italic" style={{ color: T.accent }}>кодом</span>?</> })}
        mentor={<Mentor>{tr({ uz: "Agent ismni «qalinroq» ko'rsatish uchun ikki yo'ldan birini tanlagan. Ikki ko'rinishni bosib, ism qanday chiqishiga qarang.", ru: 'Чтобы показать имя «пожирнее», агент выбрал один из двух путей. Нажмите оба варианта и посмотрите, как выходит имя.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="xr-chizma" ref={box}>
          <EgaTelefon ismTur={v && bq >= 3 ? (v === 'a' ? 'html' : 'matn') : undefined} yon={bq === 2 ? 'ism' : undefined}>
          </EgaTelefon>
          <div className={cxx('xr-yol chap', taxmin && !tugadi && 'tanla')}>
            {taxmin && !tugadi && <KorinishTugmalari variantlar={S4_KORINISH} joriy={s.joriy} korildi={s.korildi} yur={s.yur} onTanla={tanla} />}
            <span className="xr-yol-c" aria-hidden="true"><span>b.ism</span><i /></span>
          </div>
          <div className="xr-ong">
            <XavfKarta k={XAVF_KARTALAR[1]} n={2} holat={v === 'b' && bq >= 2 ? 'yopilgan' : 'ochiq'} />
            <KodKarta nom={KOD_NAMUNA.xss.nom} skelet={!v} eski={tugadi ? KOD_NAMUNA.xss.html : []} satrlar={v === 'a' ? KOD_NAMUNA.xss.html : KOD_NAMUNA.xss.matn} yon={{ i: 0, t: v === 'a' ? 'err' : 'ok' }} />
            {v && bq >= 3 && !tugadi && <Gap t={v === 'a' ? 'err' : 'ok'}>{tr(S4_GAP[v])}</Gap>}
          </div>
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
        natija={done && <NatijaBlok tanlov={taxmin} togri="kod" variantlar={S4_TAXMIN} haqiqat={{ uz: 'sahifa kodi bo\'ladi', ru: 'станут кодом страницы' }}
          izoh={tr({ uz: <>Foydalanuvchi yozgan matn boshqa odamning sahifasida kod bo'lib ishlab ketishi — <b>XSS (Cross-Site Scripting)</b> deyiladi.</>, ru: <>Когда текст пользователя срабатывает как код на странице другого человека — это называется <b>XSS (Cross-Site Scripting)</b>.</> })}
          xulosa={tr({ uz: "Bu ro'yxatda xavf ismni HTML bo'lib chiqarishda edi. React matni sifatida chiqarsa, shu zaiflik yopiladi.", ru: 'В этом списке опасность была в выводе имени как HTML. Если React выводит его текстом, эта уязвимость закрыта.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — TEST 2 (INLINE_KEYS.s5 = 2, C) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Ega ro'yxatidagi ismni XSS'dan qanday yopasiz?"
    question={tr({ uz: <h2 className="title h-ask">Ega ro'yxatidagi ismni <span className="italic" style={{ color: T.accent }}>XSS'dan</span> qanday yopasiz?</h2>, ru: <h2 className="title h-ask">Как закрыть <span className="italic" style={{ color: T.accent }}>XSS</span> в имени из списка владельца?</h2> })}
    options={[
      { uz: "Ismni Database'da katta harf bilan saqlab", ru: 'Хранить имя в Database заглавными буквами' },
      { uz: "Ismni ro'yxatdan butunlay olib tashlab", ru: 'Совсем убрать имя из списка' },
      { uz: 'Ismni oddiy matn sifatida chiqarib', ru: 'Выводить имя обычным текстом' },
      { uz: "Ism uzunligini o'ttiz belgi bilan cheklab", ru: 'Ограничить длину имени тридцатью символами' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "React matnni matn bo'lib chiqaradi — ichidagi belgilar kod bo'lib ishlamaydi.", ru: 'React выводит текст как текст — символы внутри не работают как код.' }}
    explainWrong={{
      0: { uz: "Katta harf belgini kod bo'lishdan to'xtatmaydi.", ru: 'Заглавные буквы не мешают символу стать кодом.' },
      1: { uz: "Ismni olib tashlasak, ega kimligini ko'rmaydi.", ru: 'Без имени владелец не увидит, кто забронировал.' },
      3: { uz: 'Uzunlik cheklovi belgini matnga aylantirmaydi.', ru: 'Ограничение длины не превращает символ в текст.' },
      default: { uz: 'Ism oddiy matn bo\'lib chiqsin.', ru: 'Имя должно выводиться обычным текстом.' }
    }} />
);

// ===== SCREEN 6 — TUSHUNCHA: maxfiy kalit (bashorat + ikki ko'rinish). Ega kiradi → Backend tokenni imzolaydi: kalit koddagi zaxiradan yoki .env dan =====
const S6_SAVOL = { uz: "Kalit kodda zaxira qiymat bo'lib tursa, uni kim ko'radi?", ru: 'Если ключ лежит в коде как запасное значение, кто его видит?' };
const S6_TAXMIN = [{ k: 'backend', t: { uz: 'Faqat Backend', ru: 'Только Backend' } }, { k: 'harkim', t: { uz: "Kodni ochib ko'rgan har kim", ru: 'Любой, кто откроет код' } }];
const S6_KORINISH = [{ k: 'a', t: { uz: 'Zaxira qiymat bilan', ru: 'С запасным значением' } }, { k: 'b', t: { uz: 'Faqat `.env` dan', ru: 'Только из `.env`' } }];
const S6_GAP = {
  a: { uz: "Kalit topilmasa kodda turgan qiymat ishlatiladi — kodni o'qigan har kim uni biladi.", ru: 'Если ключ не найден, берётся значение из кода — его знает любой, кто читал код.' },
  b: { uz: "Kalit faqat `.env` dan olinadi; yo'q bo'lsa Backend ishga tushmaydi.", ru: 'Ключ берётся только из `.env`; если его нет — Backend не запускается.' }
};
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, taymer, d } = useUch();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const s = useIkkiKorinish(avval, 'b');
  const done = s.korildi.size >= 2 && !s.yur;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tanla = (v) => {
    if (s.yur || !taxmin) return;
    s.setYur(true); s.setJoriy(v); s.setBosqich(1);
    uchir('.xr-telefon', '.xr-kod', 'POST /kirish');
    taymer(() => { s.setBosqich(2); if (v === 'b') uchir('.xr-env', '.xr-kod-q.k0', ''); }, d);
    taymer(() => uchir('.xr-kod', '.xr-telefon', 'token', 'ok'), d + (d ? 800 : 0));
    taymer(() => { s.setBosqich(3); s.setKorildi(k => new Set([...k, v])); s.setYur(false); }, 2 * d + (d ? 800 : 0));
  };
  const v = tugadi ? 'b' : s.joriy;
  const bq = tugadi ? 3 : s.bosqich;
  const envHolat = v === 'a' ? 'yoq' : 'bor';
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · maxfiy kalit', ru: 'Понятие · секретный ключ' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Ikki ko'rinishni ko'ring (${s.korildi.size}/2)`, ru: `Посмотрите оба варианта (${s.korildi.size}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Kalit topilmasa, Backend <span className="italic" style={{ color: T.accent }}>qayerdan oladi</span>?</>, ru: <>Если ключ не найден, <span className="italic" style={{ color: T.accent }}>откуда его берёт</span> Backend?</> })}
        mentor={<Mentor>{fmtCode(tr({ uz: "«Autentifikatsiya va .env» darsida ko'rgansiz: butun himoya maxfiy kalitga bog'liq. Agent ikki yo'ldan birini yozgan — ikkisini bosib, kalit qayerdan kelishiga qarang.", ru: 'Вы видели на уроке «Аутентификация и .env»: вся защита держится на секретном ключе. Агент написал один из двух путей — нажмите оба и посмотрите, откуда приходит ключ.' }))}</Mentor>}
        bashorat={<Bashorat savol={tr(S6_SAVOL)} variantlar={S6_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="xr-chizma" ref={box}>
          <EgaTelefon ekran={bq >= 3 ? 'royxat' : 'kirish'} yon={bq === 1 ? 'kirish' : undefined}>
          </EgaTelefon>
          <div className={cxx('xr-yol', taxmin && !tugadi && 'tanla', bq >= 3 && 'chap')}>
            {taxmin && !tugadi && <KorinishTugmalari variantlar={S6_KORINISH} joriy={s.joriy} korildi={s.korildi} yur={s.yur} onTanla={tanla} />}
            <span className="xr-yol-c" aria-hidden="true"><span key={bq >= 3 ? 'j' : 's'}>{bq >= 3 ? 'token' : 'POST /kirish'}</span><i /></span>
          </div>
          <div className="xr-ong">
            <XavfKarta k={XAVF_KARTALAR[2]} n={3} holat={v === 'b' && bq >= 2 ? 'yopilgan' : 'ochiq'} />
            <KodKarta nom={KOD_NAMUNA.kalit.nom} skelet={!v || bq < 2} satrlar={v === 'a' ? KOD_NAMUNA.kalit.zaxira : KOD_NAMUNA.kalit.env} yon={v === 'a' ? { i: 1, t: 'err' } : { i: 0, t: 'ok' }}>
              <div className={cxx('xr-env', v && bq >= 2 && envHolat)}>
                <span className="xr-env-f">.env</span>
                <code>JWT_SECRET={v && bq >= 2 ? (v === 'a' ? '' : '••••••') : '…'}</code>
                {v === 'a' && bq >= 2 && <small>{tr({ uz: 'topilmadi', ru: 'не найден' })}</small>}
              </div>
            </KodKarta>
            {v && bq >= 2 && !tugadi && <Gap t={v === 'a' ? 'err' : 'ok'}>{fmtCode(tr(S6_GAP[v]))}</Gap>}
          </div>
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
        natija={done && <NatijaBlok tanlov={taxmin} togri="harkim" variantlar={S6_TAXMIN} haqiqat={{ uz: "har kim ko'radi", ru: 'видит любой' }}
          izoh={tr({ uz: <>Kalit topilmasa kodda turgan muqobil — <b>zaxira qiymat</b> deyiladi; maxfiy kalit uchun u xavfli.</>, ru: <>Значение в коде, которое берётся, если ключ не найден, называется <b>запасным значением</b>; для секретного ключа оно опасно.</> })}
          xulosa={fmtCode(tr({ uz: "Maxfiy kalitga zaxira qiymat yozmang. U faqat `.env` dan olinsin — yo'q bo'lsa Backend ishga tushmasin.", ru: 'Не пишите запасное значение для секретного ключа. Пусть он берётся только из `.env` — если его нет, Backend не запускается.' }))}
          qoshimcha={[fmtCode(tr({ uz: "`.env` GitHub'ga chiqmaydi; prodda shu qiymatlar Render sozlamasida beriladi.", ru: '`.env` не попадает на GitHub; в проде эти значения задаются в настройках Render.' }))]} />}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — TEST 3 (INLINE_KEYS.s7 = 0, A) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="Nega JWT_SECRET ga kodda zaxira qiymat yozilmaydi?"
    question={tr({ uz: <h2 className="title h-ask">Nega <code className="qcode">JWT_SECRET</code> ga kodda <span className="italic" style={{ color: T.accent }}>zaxira qiymat</span> yozilmaydi?</h2>, ru: <h2 className="title h-ask">Почему для <code className="qcode">JWT_SECRET</code> в коде не пишут <span className="italic" style={{ color: T.accent }}>запасное значение</span>?</h2> })}
    options={[
      { uz: "Kodni o'qigan har kim uni ko'radi", ru: 'Его видит любой, кто читает код' },
      { uz: 'Zaxira qiymat juda uzun bo\'lib ketadi', ru: 'Запасное значение получится слишком длинным' },
      { uz: "Backend uni `.env` dan o'qiy olmaydi", ru: 'Backend не сможет прочитать его из `.env`' },
      { uz: "Zaxira qiymat Database'ga yozib qo'yiladi", ru: 'Запасное значение записывается в Database' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Maxfiy kalit kodda turmasin: u faqat `.env` da bo'lsa, kodni ochgan odam ko'rmaydi.", ru: 'Секретный ключ не должен лежать в коде: если он только в `.env`, тот, кто откроет код, его не увидит.' }}
    explainWrong={{
      1: { uz: "Uzunlik muhim emas — kalit kodda ko'rinmasligi kerak.", ru: 'Длина не важна — ключ не должен быть виден в коде.' },
      2: { uz: "Backend `.env` dan o'qiydi — «Autentifikatsiya va .env» darsida shunday edi.", ru: 'Backend читает из `.env` — так было на уроке «Аутентификация и .env».' },
      3: { uz: "Kalit Database'ga emas, `.env` ga yoziladi.", ru: 'Ключ записывают не в Database, а в `.env`.' },
      default: { uz: "Maxfiy kalit kodda ko'rinmasin.", ru: 'Секретный ключ не должен быть виден в коде.' }
    }} />
);

// QKod (8-ekran) — pastda, ScreenKod (HtmlCompiler bilan)

// ===== SCREEN 9 — TUSHUNCHA: 2FA (bashorat + 3 qadam). Chapda ikki telefon (sayt va telefon ilovasi), o'ngda Backend ikkalasini bitta so'rovda tekshiradi =====
const S9_SAVOL = { uz: "Paroldan tashqari telefon ilovasidagi 6 xonali kod ham so'ralsa, parolning o'zi kirishga yetadimi?", ru: 'Если кроме пароля спрашивают и 6-значный код из приложения, хватит ли одного пароля для входа?' };
const S9_TAXMIN = [{ k: 'ha', t: { uz: 'Ha, parol yetadi', ru: 'Да, пароля хватит' } }, { k: 'yoq', t: { uz: "Yo'q, kod ham kerak", ru: 'Нет, нужен и код' } }];
const S9_QADAMLAR = [{ uz: 'Parol bilan kiring', ru: 'Войдите с паролем' }, { uz: 'Telefon ilovasidagi kodni yozing', ru: 'Введите код из приложения' }, { uz: 'Ichkariga kiring', ru: 'Войдите внутрь' }];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, taymer, d } = useUch();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 3 : 0); // bajarilgan qadamlar
  const [tek, setTek] = useState(avval ? 2 : 0); // Backend tekshiruvi: 0 · 1 parol ✓ · 2 kod ✓
  const [yur, setYur] = useState(false);
  const done = n >= 3 && !yur;
  const tugadi = useTugadi(done, 1500, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const qadam = () => {
    if (yur || !taxmin || n >= 3) return;
    setYur(true);
    if (n === 0) { taymer(() => { setN(1); setYur(false); }, d ? 300 : 0); return; }
    if (n === 1) { uchir('.xr-ilova-kod', '.xr-kodm', KOD_2FA); taymer(() => { setN(2); setYur(false); }, d); return; }
    uchir('.xr-tel-ust.sayt .xr-telefon', '.xr-kod', tr({ uz: 'parol + kod', ru: 'пароль + код' }));
    taymer(() => setTek(1), d + (d ? 250 : 0));
    taymer(() => setTek(2), d + (d ? 750 : 0));
    taymer(() => uchir('.xr-kod', '.xr-tel-ust.sayt .xr-telefon', 'token', 'ok'), d + (d ? 1150 : 0));
    taymer(() => { setN(3); setYur(false); }, 2 * d + (d ? 1150 : 0));
  };
  const nn = tugadi ? 3 : n;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · 2FA', ru: 'Понятие · 2FA' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Qadamlarni bajaring (${n}/3)`, ru: `Выполните шаги (${n}/3)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Parol begona qo'lga o'tsa, ega sahifasini <span className="italic" style={{ color: T.accent }}>kim ochadi</span>?</>, ru: <>Пароль в чужих руках: <span className="italic" style={{ color: T.accent }}>кто откроет страницу</span>?</> })}
        mentor={<Mentor>{tr({ uz: "Hozir ega faqat parol bilan kiradi. Qadamlarni bajaring va kirishga ikkinchi qadam qo'shilsa nima o'zgarishini ko'ring.", ru: 'Сейчас владелец входит только с паролем. Выполните шаги и посмотрите, что изменится, если добавить второй шаг.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S9_SAVOL)} variantlar={S9_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="xr-chizma s9" ref={box}>
          <div className="xr-ikki">
            <EgaTelefon className="sayt" ekran={nn >= 3 ? 'royxat' : 'kirish'} parol={nn >= 1} kodMaydon={nn >= 1} kod={nn >= 2 ? KOD_2FA : ''} yon={nn === 1 ? 'kod' : nn === 2 ? 'kirish' : undefined} kirdi={nn >= 3}>
              {taxmin && !tugadi && n < 3 && <QTugma className={cxx('xr-tel-btn', !yur && 'xr-navbat')} disabled={yur} onClick={qadam}>{tr(S9_QADAMLAR[n])}<small className="xr-qn">{n + 1}/3</small></QTugma>}
            </EgaTelefon>
            <IlovaTelefon kod={nn >= 1} yon={nn === 1} />
          </div>
          <div className={cxx('xr-yol', nn >= 3 && 'chap')} aria-hidden="true"><span key={nn >= 3 ? 'j' : 's'}>{nn >= 3 ? 'token' : 'POST /kirish'}</span><i /></div>
          <div className="xr-ong">
            <Qator2FA holat={nn >= 3 ? 'qoshildi' : 'yoq'} />
            <KodKarta nom="Backend · NestJS" className="xr-tek">
              <div className="xr-tek-q" data-on={tek >= 1 || nn >= 3}><span>{tr({ uz: 'parol', ru: 'пароль' })}</span><code>EGA_PAROLI</code><b>{tek >= 1 || nn >= 3 ? '✓' : '·'}</b></div>
              <div className="xr-tek-q" data-on={tek >= 2 || nn >= 3}><span>{tr({ uz: '6 xonali kod', ru: '6-значный код' })}</span><code>EGA_2FA_KALITI</code><b>{tek >= 2 || nn >= 3 ? '✓' : '·'}</b></div>
              {nn >= 3 && <div className="xr-tek-token">token →</div>}
            </KodKarta>
            {nn === 2 && !tugadi && <Gap t="ok">{tr({ uz: <>Parol + telefon ilovasidagi 6 xonali kod — <b>ikki bosqichli kirish (2FA)</b> deyiladi.</>, ru: <>Пароль + 6-значный код из приложения на телефоне — так называется <b>двухэтапный вход (2FA)</b>.</> })}</Gap>}
          </div>
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
        natija={done && <NatijaBlok tanlov={taxmin} togri="yoq" variantlar={S9_TAXMIN} haqiqat={{ uz: 'kod ham kerak', ru: 'нужен и код' }}
          izoh={tr({ uz: <>Parol + telefon ilovasidagi 6 xonali kod — <b>ikki bosqichli kirish (2FA)</b> deyiladi.</>, ru: <>Пароль + 6-значный код из приложения на телефоне — так называется <b>двухэтапный вход (2FA)</b>.</> })}
          xulosa={tr({ uz: "Parol begona qo'lga o'tsa ham, telefon ilovasidagi kodsiz ega sahifasi ochilmaydi.", ru: 'Даже если пароль попал в чужие руки, без кода из приложения страница владельца не откроется.' })}
          qoshimcha={[
            tr({ uz: 'Token faqat Backend parolni ham, kodni ham bitta so\'rovda tekshirgandan keyin beriladi.', ru: 'Токен выдаётся только после того, как Backend проверит и пароль, и код в одном запросе.' }),
            fmtCode(tr({ uz: "Kodni Backend va telefon ilovasi bir xil maxfiy kalitdan (`EGA_2FA_KALITI`) hisoblaydi — kalit `.env` da turadi.", ru: 'Код вычисляют Backend и приложение из одного секретного ключа (`EGA_2FA_KALITI`) — ключ лежит в `.env`.' }))
          ]} />}
      />
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 4 (INLINE_KEYS.s10 = 3, D) =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="2FA ega kirishini nega mustahkamlaydi?"
    question={tr({ uz: <h2 className="title h-ask">2FA ega kirishini nega <span className="italic" style={{ color: T.accent }}>mustahkamlaydi</span>?</h2>, ru: <h2 className="title h-ask">Почему 2FA <span className="italic" style={{ color: T.accent }}>укрепляет</span> вход владельца?</h2> })}
    options={[
      { uz: 'Parolni telefon ilovasida saqlab qo\'yadi', ru: 'Сохраняет пароль в приложении на телефоне' },
      { uz: "Backend'ni so'rovsiz uxlab qolishdan saqlaydi", ru: 'Не даёт Backend засыпать без запросов' },
      { uz: 'Har kirishda yangi parol o\'ylab topadi', ru: 'Придумывает новый пароль при каждом входе' },
      { uz: "Paroldan tashqari telefon ilovasidagi kodni so'raydi", ru: 'Кроме пароля спрашивает код из приложения на телефоне' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Parol begona qo'lga o'tsa ham, telefon ilovasidagi kodsiz kira bo'lmaydi.", ru: 'Даже если пароль в чужих руках, без кода из приложения войти нельзя.' }}
    explainWrong={{
      0: { uz: "2FA parolni saqlamaydi — qo'shimcha kod so'raydi.", ru: '2FA не хранит пароль — спрашивает дополнительный код.' },
      1: { uz: "Backend uxlashi 2FA bilan bog'liq emas.", ru: 'То, что Backend засыпает, с 2FA не связано.' },
      2: { uz: "Parol o'zgarmaydi — ikkinchi qadam qo'shiladi.", ru: 'Пароль не меняется — добавляется второй шаг.' },
      default: { uz: "2FA paroldan tashqari kod so'raydi.", ru: '2FA кроме пароля спрашивает код.' }
    }} />
);

// ===== SCREEN 11 — TUSHUNCHA: qanday tekshiramiz (bashorat + bitta harakat). Har zaiflik: kodni o'qidik → oddiy ma'lumot bilan to'g'ri ishlaydi =====
const S11_SAVOL = { uz: 'Zaiflik yopilganini qanday bilamiz?', ru: 'Как узнать, что уязвимость закрыта?' };
const S11_TAXMIN = [{ k: 'hujum', t: { uz: "Saytga hujum qilib ko'rib", ru: 'Атаковав сайт' } }, { k: 'oqib', t: { uz: "Kodni o'qib va oddiy ma'lumot bilan sinab", ru: 'Прочитав код и проверив на обычных данных' } }];
const S11_YON = ['qidiruv', 'ism', null];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, taymer, d } = useUch();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 6 : 0); // 0…6: har belgi ikki bosqich (kodni o'qidik · oddiy ma'lumot)
  const [yur, setYur] = useState(false);
  const done = q >= 6 && !yur;
  const tugadi = useTugadi(done, 1500, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tekshir = () => {
    if (yur || !taxmin || q > 0) return;
    setYur(true);
    const qad = d ? 420 : 0;
    [0, 1, 2].forEach(i => {
      taymer(() => setQ(2 * i + 1), qad * (3 * i) + (d ? 200 : 0));
      taymer(() => uchir('.xr-telefon', `.xr-belgi.b${i} .xr-belgi-o`, '', 'ok'), qad * (3 * i + 1) + (d ? 200 : 0));
      taymer(() => setQ(2 * i + 2), qad * (3 * i + 1) + d + (d ? 200 : 0));
    });
    taymer(() => setYur(false), qad * 7 + d + (d ? 300 : 0));
  };
  const qq = tugadi ? 6 : q;
  const joriyI = qq > 0 && qq < 6 ? Math.floor((qq - 1) / 2) : -1;
  const belgilar = XAVF_KARTALAR.map((k, i) => (
    <span key={k.id} className={cxx('xr-belgi', 'b' + i, qq >= 2 * i + 2 && 'ok')}>
      <span className="xr-belgi-t">{fmtCode(tr(k.belgi))}</span>
      <span className="xr-belgi-s">
        <span className={cxx('xr-belgi-k', qq >= 2 * i + 1 && 'on')}>{qq >= 2 * i + 1 ? '✓ ' : ''}{tr({ uz: "kodni o'qidik", ru: 'прочитали код' })}</span>
        <span className={cxx('xr-belgi-o', qq >= 2 * i + 2 && 'on')}>{qq >= 2 * i + 2 ? '✓ ' : ''}{tr({ uz: "oddiy ma'lumot bilan to'g'ri ishlaydi", ru: 'на обычных данных работает верно' })}</span>
      </span>
    </span>
  ));
  return (
    <Stage eyebrow={tr({ uz: 'Tajriba · tekshiruv', ru: 'Опыт · проверка' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: 'Tekshiring', ru: 'Проверьте' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Xavfli kod olib tashlanganini <span className="italic" style={{ color: T.accent }}>qanday bilasiz</span>?</>, ru: <>Как узнать, что опасный код <span className="italic" style={{ color: T.accent }}>убран</span>?</> })}
        mentor={<Mentor>{tr({ uz: "Bu darsda zaiflikni hujum qilmasdan tekshiramiz: kodni o'qiymiz va saytni oddiy ma'lumot bilan sinaymiz. «Tekshiring»ni bosing va uch belgiga qarang.", ru: 'На этом уроке проверяем уязвимость без атаки: читаем код и пробуем сайт на обычных данных. Нажмите «Проверьте» и посмотрите на три признака.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S11_SAVOL)} variantlar={S11_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="xr-chizma" ref={box}>
          <EgaTelefon qidiruv={qq >= 2 ? QIDIRUV_TEL : ''} topildi={qq >= 2} yon={joriyI >= 0 ? S11_YON[joriyI] || undefined : undefined} kirdi>
            {taxmin && !tugadi && q === 0 && <QTugma className={cxx('xr-tel-btn', !yur && 'xr-navbat')} disabled={yur} onClick={tekshir}>{tr({ uz: 'Tekshiring', ru: 'Проверьте' })}</QTugma>}
          </EgaTelefon>
          <div className="xr-yol" aria-hidden="true"><span>{tr({ uz: "oddiy ma'lumot", ru: 'обычные данные' })}</span><i /></div>
          <div className="xr-ong">
            <XavfRuyxat holatlar={['yopilgan', 'yopilgan', 'yopilgan']} fa="qoshildi" belgilar={belgilar} />
          </div>
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
        natija={done && <NatijaBlok tanlov={taxmin} togri="oqib" variantlar={S11_TAXMIN} haqiqat={{ uz: "kodni o'qib va sinab", ru: 'прочитав код и проверив' }}
          izoh={tr({ uz: 'Bu tekshiruvni faqat o\'z saytingizda qilasiz. Boshqa saytni egasining ruxsatisiz tekshirmaysiz.', ru: 'Такую проверку вы делаете только на своём сайте. Чужой сайт без разрешения владельца не проверяете.' })}
          xulosa={tr({ uz: "Bugungi uch xavfli naqsh olib tashlanganini kodni o'qib va oddiy ma'lumot bilan sinab tekshirdik.", ru: 'Мы прочитали код, попробовали сайт на обычных данных и убедились: три сегодняшних опасных шаблона убраны.' })}
          qoshimcha={[tr({ uz: 'Bu butun sayt xavfsiz degani emas — bugun topilgan uch zaiflik haqida.', ru: 'Это не значит, что весь сайт безопасен — речь о трёх найденных сегодня уязвимостях.' })]} />}
      />
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY TARTIB (QTartib, sentinel 0; ball — birinchi to'liq urinish) =====
const FINAL_BOLAKLAR = [
  { id: 'f1', label: { uz: 'Ega parolni yozadi', ru: 'Владелец вводит пароль' } },
  { id: 'f2', label: { uz: 'Ega telefon ilovasidagi 6 xonali kodni yozadi', ru: 'Владелец вводит 6-значный код из приложения' } },
  { id: 'f3', label: { uz: "Sayt parol va kodni birga Backend'ga yuboradi", ru: 'Сайт отправляет пароль и код вместе в Backend' } },
  { id: 'f4', label: { uz: 'Backend parolni ham, kodni ham tekshiradi', ru: 'Backend проверяет и пароль, и код' } },
  { id: 'f5', label: { uz: "Ikkalasi to'g'ri bo'lsa token beriladi, ro'yxat ochiladi", ru: 'Если оба верны — выдаётся токен, открывается список' } }
];
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
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
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'Ega 2FA bilan qanday kiradi?', options: FINAL_BOLAKLAR.map(z => ou(z.label)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · tartib', ru: 'Итог · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Tartibni yig'ing", ru: 'Соберите порядок' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ega 2FA bilan <span className="italic" style={{ color: T.accent }}>qanday kiradi</span>?</>, ru: <>Как владелец <span className="italic" style={{ color: T.accent }}>входит с 2FA</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni sodir bo'lish tartibida joylang.", ru: 'Разложите блоки в том порядке, в каком всё происходит.' })}</Mentor>
        <Zoomable>
          <QTartib onWrong={onWrong}
            items={FINAL_BOLAKLAR.map(z => ({ id: z.id, label: tr(z.label) }))}
            joyMatn={tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}
            onSolved={solve}
            xatoMatn={tr({ uz: "Tartib xato — bo'lakni bosib qaytaring.", ru: 'Порядок неверный — нажмите на блок, чтобы вернуть его.' })}
          />
        </Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Token faqat Backend parolni ham, kodni ham tekshirgandan keyin beriladi.', ru: 'Токен выдаётся только после того, как Backend проверит и пароль, и код.' })}</p>
          {wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 NISHONLAR (5) — inglizcha nom, o'zbekcha tavsif; bonus — bitta (Hardened, A2 oxirgi «Bajardim») =====
const ACHIEVEMENTS = {
  sqlShield: { icon: '🛡️', name: 'SQL Shield', desc: { uz: 'SQL injection belgisini kodda topdingiz', ru: 'Вы нашли в коде признак SQL injection' } },
  cleanOutput: { icon: '🧾', name: 'Clean Output', desc: { uz: "Ismni XSS'dan qanday yopishni bildingiz", ru: 'Вы узнали, как закрыть XSS в имени' } },
  keyKeeper: { icon: '🔑', name: 'Key Keeper', desc: { uz: 'Maxfiy kalit nega kodda turmasligini bildingiz', ru: 'Вы узнали, почему секретный ключ не хранят в коде' } },
  twoSteps: { icon: '📲', name: 'Two Steps', desc: { uz: '2FA ega kirishini nega mustahkamlashini bildingiz', ru: 'Вы узнали, почему 2FA укрепляет вход владельца' } },
  hardened: { icon: '🏁', name: 'Hardened', desc: { uz: 'Ikki amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили оба практических блока до конца' } }
};
// Ekran id → nishon: testlar (birinchi urinish) + A2 oxirgi «Bajardim» (bonus)
const ACH_TRIGGERS = { s3: 'sqlShield', s5: 'cleanOutput', s7: 'keyKeeper', s10: 'twoSteps', a2: 'hardened' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 7, 10, 12)
const Q_LABELS = {
  3: { uz: '1 — SQL injection belgisi', ru: '1 — Признак SQL injection' },
  5: { uz: '2 — XSS yopish', ru: '2 — Закрываем XSS' },
  7: { uz: '3 — Maxfiy kalit', ru: '3 — Секретный ключ' },
  10: { uz: '4 — 2FA', ru: '4 — 2FA' },
  12: { uz: 'Yakuniy — ega kirishi tartibi', ru: 'Итог — порядок входа владельца' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi); emoji yo'q
const QZ_BG_SHAPES = [
  { ch: 'SQL injection', l: 5, t: 10, s: 26, d: 19, dl: 0 },
  { ch: 'XSS', l: 84, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: 'dangerouslySetInnerHTML', l: 6, t: 72, s: 20, d: 27, dl: 0.8 },
  { ch: 'find({ where })', l: 72, t: 70, s: 22, d: 21, dl: 2.2 },
  { ch: '$1', l: 46, t: 86, s: 26, d: 25, dl: 1.1 },
  { ch: 'JWT_SECRET', l: 62, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: 'EGA_2FA_KALITI', l: 24, t: 40, s: 20, d: 20, dl: 1.9 },
  { ch: '.env', l: 20, t: 16, s: 24, d: 18, dl: 2.9 },
  { ch: '2FA', l: 88, t: 46, s: 24, d: 22, dl: 0.6 },
  { ch: 'token', l: 36, t: 6, s: 20, d: 24, dl: 1.3 },
  { ch: { uz: 'parol', ru: 'пароль' }, l: 54, t: 56, s: 20, d: 19, dl: 2.5 },
  { ch: { uz: 'zaiflik', ru: 'уязвимость' }, l: 12, t: 52, s: 22, d: 26, dl: 0.2 },
  { ch: { uz: 'yopish', ru: 'закрыть' }, l: 80, t: 88, s: 20, d: 18, dl: 1.7 },
  { ch: { uz: "parametrli so'rov", ru: 'параметризованный запрос' }, l: 30, t: 92, s: 18, d: 23, dl: 2.1 },
  { ch: { uz: 'maxfiy kalit', ru: 'секретный ключ' }, l: 66, t: 4, s: 18, d: 20, dl: 0.9 },
];
// ⚡ Mustahkamlash-jang — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (aylanma, MD); ekran testlarining nusxasi emas (§144)
const QUIZ_BANK = [
  { q: { uz: 'SQL injection nima?', ru: 'Что такое SQL injection?' }, opts: [{ uz: "Foydalanuvchi matni so'rovga buyruq bo'lib qo'shilishi", ru: 'Текст пользователя попадает в запрос как команда' }, { uz: "Database'dagi bitta jadvalning noto'g'ri nomlanishi", ru: 'Неверное название одной таблицы в Database' }, { uz: "Backend'ning so'rovga sekin javob berishi", ru: 'Backend медленно отвечает на запрос' }, { uz: "Saytning telefon raqamini xato ko'rsatishi", ru: 'Сайт неверно показывает номер телефона' }], correct: 0 },
  { q: { uz: "Qidiruvni SQL injection'dan nima yopadi?", ru: 'Что закрывает SQL injection в поиске?' }, opts: [{ uz: 'Telefonni katta harfga aylantirish', ru: 'Перевести телефон в заглавные буквы' }, { uz: "Parametrli so'rov", ru: 'Параметризованный запрос' }, { uz: "Qidiruvni butunlay o'chirish", ru: 'Совсем убрать поиск' }, { uz: "So'rovni `POST` bilan yuborish", ru: 'Отправлять запрос через `POST`' }], correct: 1 },
  { q: { uz: 'Kodda SQL injection belgisi qaysi?', ru: 'Какой признак SQL injection в коде?' }, opts: [{ uz: "So'rov `bandlar` jadvaliga yuborilgani", ru: 'Запрос отправлен в таблицу `bandlar`' }, { uz: "Qidiruv ism emas, telefon bo'yicha ekani", ru: 'Поиск идёт по телефону, а не по имени' }, { uz: "Foydalanuvchi matni so'rov satriga qo'shilgani", ru: 'Текст пользователя вставлен в строку запроса' }, { uz: "So'rov Database'dan bitta javob qaytargani", ru: 'Запрос вернул из Database один ответ' }], correct: 2 },
  { q: { uz: 'XSS (Cross-Site Scripting) nima?', ru: 'Что такое XSS (Cross-Site Scripting)?' }, opts: [{ uz: "Backend'ning ikki marta ketma-ket ishga tushishi", ru: 'Backend запускается дважды подряд' }, { uz: 'Parolning sayt kodida ochiq qolib ketishi', ru: 'Пароль остался открытым в коде сайта' }, { uz: "Database so'rovining sezilarli sekinlashuvi", ru: 'Запрос к Database заметно замедлился' }, { uz: "Foydalanuvchi matni sahifada kod bo'lib ishlashi", ru: 'Текст пользователя работает на странице как код' }], correct: 3 },
  { q: { uz: "Ega ro'yxatidagi ismni XSS'dan nima yopadi?", ru: 'Что закрывает XSS в имени из списка владельца?' }, opts: [{ uz: 'Oddiy matn sifatida chiqarish', ru: 'Вывод обычным текстом' }, { uz: "Ismni Database'dan o'chirish", ru: 'Удалить имя из Database' }, { uz: 'Ismni katta harf qilish', ru: 'Сделать имя заглавными' }, { uz: 'Ism uzunligini cheklash', ru: 'Ограничить длину имени' }], correct: 0 },
  { q: { uz: 'Kodda XSS belgisi qaysi?', ru: 'Какой признак XSS в коде?' }, opts: [{ uz: "Ism Database'da saqlangani (`bandlar` jadvalida)", ru: 'Имя хранится в Database (в таблице `bandlar`)' }, { uz: 'Ism HTML sifatida chiqarilgani (`dangerouslySetInnerHTML`)', ru: 'Имя выводится как HTML (`dangerouslySetInnerHTML`)' }, { uz: "Ism ro'yxatda ko'ringani (`Ega.jsx` sahifasida)", ru: 'Имя видно в списке (на странице `Ega.jsx`)' }, { uz: 'Ism token bilan kelgani (`GET /bandlar` javobida)', ru: 'Имя пришло с токеном (в ответе `GET /bandlar`)' }], correct: 1 },
  { q: { uz: 'Maxfiy kalit qayerda turishi kerak?', ru: 'Где должен лежать секретный ключ?' }, opts: [{ uz: '`app.module.ts` faylining boshida', ru: 'В начале файла `app.module.ts`' }, { uz: 'Sayt kodining ichida', ru: 'Внутри кода сайта' }, { uz: '`.env` faylida, kodda emas', ru: 'В файле `.env`, не в коде' }, { uz: "Database'dagi alohida jadvalda", ru: 'В отдельной таблице в Database' }], correct: 2 },
  { q: { uz: '`JWT_SECRET` ga zaxira qiymat nega yozilmaydi?', ru: 'Почему для `JWT_SECRET` не пишут запасное значение?' }, opts: [{ uz: "Backend uni o'qiy olmaydi", ru: 'Backend не сможет его прочитать' }, { uz: "Zaxira qiymat juda uzun bo'ladi", ru: 'Запасное значение слишком длинное' }, { uz: "Qiymat Database'ga ko'chadi", ru: 'Значение переедет в Database' }, { uz: "Kodni o'qigan har kim uni ko'radi", ru: 'Его видит любой, кто читает код' }], correct: 3 },
  { q: { uz: '2FA nima?', ru: 'Что такое 2FA?' }, opts: [{ uz: 'Parol va telefon ilovasidagi 6 xonali kod', ru: 'Пароль и 6-значный код из приложения на телефоне' }, { uz: 'Ikki xil parol bilan ketma-ket kirish', ru: 'Вход с двумя разными паролями подряд' }, { uz: 'Parolni ikki marta, ikki joyga yozish', ru: 'Ввести пароль дважды, в два места' }, { uz: "Database'ning ikki nusxasini saqlash", ru: 'Хранить две копии Database' }], correct: 0 },
  { q: { uz: '6 xonali kodni nima hisoblaydi?', ru: 'Кто вычисляет 6-значный код?' }, opts: [{ uz: "Faqat Backend o'zi, ilovasiz hisoblaydi", ru: 'Только сам Backend, без приложения' }, { uz: 'Telefon ilovasi va Backend bir kalitdan', ru: 'Приложение на телефоне и Backend из одного ключа' }, { uz: "Faqat telefon ilovasi, Backend'siz", ru: 'Только приложение на телефоне, без Backend' }, { uz: "Database har so'rovda yangidan yaratadi", ru: 'Database создаёт заново при каждом запросе' }], correct: 1 },
  { q: { uz: 'Zaiflik yopilganini qanday tekshiramiz?', ru: 'Как проверить, что уязвимость закрыта?' }, opts: [{ uz: "Boshqa odamning saytini sinab ko'rib", ru: 'Проверив сайт другого человека' }, { uz: "Agentdan so'rab, uning javobiga ishonib", ru: 'Спросив агента и поверив его ответу' }, { uz: "Kodni o'qib va oddiy ma'lumot bilan sinab", ru: 'Прочитав код и проверив на обычных данных' }, { uz: 'Sahifa xatosiz ochilishini kutib turib', ru: 'Дождавшись, что страница откроется без ошибок' }], correct: 2 },
  { q: { uz: 'Push qachon qilinadi?', ru: 'Когда делается push?' }, opts: [{ uz: 'Zaifliklardan oldin, keyin tuzatib', ru: 'До уязвимостей, потом исправив' }, { uz: 'Dars boshida, hammasidan avval', ru: 'В начале урока, раньше всего' }, { uz: 'Agent aytganda, tekshirmasdan', ru: 'Когда скажет агент, без проверки' }, { uz: 'Zaifliklar yopilgandan keyin', ru: 'После того как уязвимости закрыты' }], correct: 3 },
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok — ScreenBlok'ga ma'lumot: steps [{ h, t, prompt?: [satr], kimga?, err? }] · natija (kutilgan natija maketi) · ortda (M-q7/q8 buyruqlari).
// «Ortda qoldingizmi»: birinchi blokda dars-…-start, keyingilarida dars-…-done. Signal 500+ zonasida — faqat mentor ko'radi (MentorPracticeStats).
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda = [], doneText }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const bajardim = () => {
    if (isMentorLive || done) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({ h: tr(c.h), t: typeof c.t === 'function' ? c.t() : fmtCode(tr(c.t)), prompt: c.prompt && c.prompt.map(l => tr(l)), kimga: c.prompt && tr(c.kimga || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }), xato: c.err && fmtCode(tr(c.err)) }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={fmtCode(tr(doneText))} natija={natija} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortda}
        pastki={<MentorPracticeStats live={_live} screen={screen} />} />
    </Stage>
  );
}
// ===== SCREEN 8 — KOD YOZISH (QKod + HtmlCompiler): parametrli so'rovni o'quvchi qo'lda yozadi =====
// Kod oynasi bitta JS faylni ulaydi — shuning uchun db.js (tayyor qism) index.html ichida <script> (MD KOD 6; 2-dars bilan bir xil yo'l).
// Tekshiruv: 1–2 — app.js manbasi (izohlarsiz); 3 — index.html 'load' da qidir() ni oddiy telefon bilan chaqirib, natijani window.natija ga yozadi.
// Payload tekshirilmaydi — faqat shakl va oddiy telefon (MD KOD 6, tayanch 7).
const KOD_INDEX = {
  uz: `<h1>Maydon · ega</h1>
<input id="telefon" value="+998 90 000 00 01">
<button id="qidir">Qidirish</button>
<ul id="natija"></ul>

<script>
// db.js — tayyor qism, o'zgarmaydi
var bandlar = [
  { soat: '18:00', ism: 'Ali', telefon: '+998 90 000 00 01' },
  { soat: '17:00', ism: 'Bek', telefon: '+998 90 000 00 02' }
];
// db(sql, qiymatlar) — faqat parametrli so'rovni bajaradi: $1 va qiymatlar ro'yxati
function db(sql, qiymatlar) {
  if (String(sql).indexOf('$1') === -1 || !Array.isArray(qiymatlar)) {
    return { xabar: "So'rovni parametr bilan yozing" };
  }
  return bandlar.filter(function (b) { return b.telefon === String(qiymatlar[0]).trim(); });
}
// natija ro'yxatga oddiy matn bo'lib chiqadi (textContent)
function korsat(natija) {
  var ul = document.querySelector('#natija');
  while (ul.firstChild) ul.removeChild(ul.firstChild);
  var qatorlar = Array.isArray(natija)
    ? natija.map(function (b) { return b.soat + ' · ' + b.ism + ' · ' + b.telefon; })
    : [natija && natija.xabar ? natija.xabar : 'Hech narsa topilmadi'];
  if (!qatorlar.length) qatorlar = ['Hech narsa topilmadi'];
  qatorlar.forEach(function (q) {
    var li = document.createElement('li');
    li.textContent = q;
    ul.appendChild(li);
  });
}
// kod oynasi shartni shu yerda sinab ko'radi
window.addEventListener('load', function () {
  var r = null;
  try { r = qidir('+998 90 000 00 01'); } catch (e) { r = null; }
  window.natija = [Array.isArray(r) && r.length === 1 && r[0].ism === 'Ali'];
});
</script>`,
  ru: `<h1>Maydon · владелец</h1>
<input id="telefon" value="+998 90 000 00 01">
<button id="qidir">Искать</button>
<ul id="natija"></ul>

<script>
// db.js — готовая часть, не меняется
var bandlar = [
  { soat: '18:00', ism: 'Ali', telefon: '+998 90 000 00 01' },
  { soat: '17:00', ism: 'Bek', telefon: '+998 90 000 00 02' }
];
// db(sql, qiymatlar) — выполняет только параметризованный запрос: $1 и список значений
function db(sql, qiymatlar) {
  if (String(sql).indexOf('$1') === -1 || !Array.isArray(qiymatlar)) {
    return { xabar: 'Напишите запрос с параметром' };
  }
  return bandlar.filter(function (b) { return b.telefon === String(qiymatlar[0]).trim(); });
}
// результат выводится в список обычным текстом (textContent)
function korsat(natija) {
  var ul = document.querySelector('#natija');
  while (ul.firstChild) ul.removeChild(ul.firstChild);
  var qatorlar = Array.isArray(natija)
    ? natija.map(function (b) { return b.soat + ' · ' + b.ism + ' · ' + b.telefon; })
    : [natija && natija.xabar ? natija.xabar : 'Ничего не найдено'];
  if (!qatorlar.length) qatorlar = ['Ничего не найдено'];
  qatorlar.forEach(function (q) {
    var li = document.createElement('li');
    li.textContent = q;
    ul.appendChild(li);
  });
}
// окно кода само проверяет условие здесь
window.addEventListener('load', function () {
  var r = null;
  try { r = qidir('+998 90 000 00 01'); } catch (e) { r = null; }
  window.natija = [Array.isArray(r) && r.length === 1 && r[0].ism === 'Ali'];
});
</script>`
};
// app.js — boshlang'ich holat: matn qo'shib yasalgan eski qator ishlab turadi, o'quvchi uni o'chirib parametrli so'rov yozadi (MD 8-ekran vazifasi)
const KOD_APP = {
  uz: `function qidir(telefon) {
  // Eski qator (o'chiring): matn qo'shib yasalgan
  const sql = "SELECT * FROM bandlar WHERE telefon = '" + telefon + "'"
  return db(sql)

  // Shu yerga: parametrli so'rov
}

document.querySelector('#qidir').addEventListener('click', function () {
  const telefon = document.querySelector('#telefon').value
  korsat(qidir(telefon))
})`,
  ru: `function qidir(telefon) {
  // Старая строка (удалите): собрана вставкой текста
  const sql = "SELECT * FROM bandlar WHERE telefon = '" + telefon + "'"
  return db(sql)

  // Сюда: параметризованный запрос
}

document.querySelector('#qidir').addEventListener('click', function () {
  const telefon = document.querySelector('#telefon').value
  korsat(qidir(telefon))
})`
};
const KOD_VAZIFA = [
  { uz: "Matn qo'shib yasalgan `const sql = ...` qatorini o'chiring.", ru: 'Удалите строку `const sql = ...`, собранную вставкой текста.' },
  { uz: "`qidir(telefon)` ichida parametrli so'rov yozing: `db('... WHERE telefon = $1', [telefon])`.", ru: "Внутри `qidir(telefon)` напишите параметризованный запрос: `db('... WHERE telefon = $1', [telefon])`." },
  { uz: 'Oddiy telefon bilan sinang — Ali qatori chiqsin.', ru: 'Проверьте с обычным телефоном — должна выйти строка Ali.' }
];
const KOD_YORDAM = { uz: "Telefon matni so'rov satriga qo'shilmaydi. `$1` — so'rovdagi o'rin, qiymat alohida ro'yxatda (`[telefon]`) uzatiladi. Kodni o'zingiz terib yozasiz — qo'lda yozganda o'rganiladi.", ru: 'Текст телефона не вставляется в строку запроса. `$1` — место в запросе, значение передаётся отдельным списком (`[telefon]`). Код набираете сами — так он запоминается.' };
const KOD_SHARTLAR = [
  { uz: "Matn qo'shib yasalgan const sql qatori qolmasin.", ru: 'Строки const sql со вставкой текста не осталось.' },
  { uz: "So'rov $1 va [telefon] bilan yozilsin.", ru: 'Запрос написан с $1 и [telefon].' },
  { uz: 'Oddiy telefon bilan Ali qatori chiqsin.', ru: 'С обычным телефоном выходит строка Ali.' }
];
// app.js manbasi izohlarsiz (izoh ichidagi eski qator shartni buzmasin)
const IZOH_BELGI = '/' + '/';
function kodIzohsiz(s) {
  return String(s || '')
    .split('\n')
    .map(function (q) { const i = q.indexOf(IZOH_BELGI); return i >= 0 ? q.slice(0, i) : q; })
    .join('\n');
}
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: "app.js — qidiruvni parametrli so'rov qiling", ru: 'app.js — сделайте поиск параметризованным запросом' },
  files: [
    { name: 'app.js', lang: 'js', starter: KOD_APP },
    { name: 'index.html', lang: 'html', starter: KOD_INDEX }
  ],
  previewCss: '#telefon{font-family:monospace;padding:4px 6px;margin-right:6px}#natija li{font-family:monospace}',
  requirements: [
    { id: 'k0', label: KOD_SHARTLAR[0], check: C.custom((x) => { const s = kodIzohsiz(x.js); return (!/const\s+sql\s*=/.test(s) && !/['"]\s*\+\s*telefon\b/.test(s)) || tr(KOD_SHARTLAR[0]); }) },
    { id: 'k1', label: KOD_SHARTLAR[1], check: C.custom((x) => { const s = kodIzohsiz(x.js); return (s.includes('$1') && /\[\s*telefon\s*\]/.test(s)) || tr(KOD_SHARTLAR[1]); }) },
    { id: 'k2', label: KOD_SHARTLAR[2], check: C.evalEquals('(window.natija||[])[0]?"ha":"yoq"', 'ha', KOD_SHARTLAR[2]) }
  ]
};
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — u o'quvchi matni emas, qolip API nomi (9-Modul 1-dars yechimi)
const QKOD_ONG = 'muh\u0061rrir';
// Koddagi ikki joy (eski qator · shu yerga) — birinchi ikki izoh qatori 1, 2 raqamli accent belgi oladi; vazifa bandiga sichqoncha borsa yonadi
const IZOH_QATOR = /^(\s*)(\/\/ .*)$/;
const kodJoylari = (satrlar) => { let n = 0; return satrlar.map(q => (IZOH_QATOR.test(q) && n < 2 ? ++n : 0)); };
const KOD_YONISH = [
  { t: { uz: "eski qator o'chdi", ru: 'старая строка удалена' }, kod: 'const sql' },
  { t: { uz: 'qiymat alohida', ru: 'значение отдельно' }, kod: '$1 · [telefon]' },
  { t: { uz: 'Ali qatori chiqdi', ru: 'вышла строка Ali' }, kod: '18:00 · Ali' }
];
const KodSatr = ({ q, r, fokus }) => {
  const m = r ? IZOH_QATOR.exec(q) : null;
  if (m) { return <span className={cxx('xr-kq', 'xr-kq-joy', fokus === r - 1 && 'on')}>{m[1]}<b className="xr-kq-r">{r}</b><span className="xr-kq-izoh">{m[2]}</span></span>; }
  return <span className={cxx('xr-kq', fokus === 0 && /const sql|return db\(sql\)/.test(q) && 'eski')}>{q || ' '}</span>;
};
const ScreenKod = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [yordam, setYordam] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(() => (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const kam = useKamHarakat();
  const taymer = useTaymer();
  const [fokus, setFokus] = useState(null);
  const [demo, setDemo] = useState(kam ? 3 : 0); // mini-telefon: kirishda bir marta o'ynaydi
  useEffect(() => { if (kam) return; [700, 1700, 2700].forEach((ms, i) => taymer(() => setDemo(i + 1), ms)); }, []); // eslint-disable-line
  const yondi = (i) => (fokus === null ? i < demo : fokus === i);
  const finish = ({ codes, code: c2 } = {}) => {
    const yangi = (codes && codes['app.js']) || c2 || code || tr(KOD_APP);
    setOpen(false); setCode(yangi);
    if (!done) {
      setDone(true);
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: yangi, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  const fok = (i) => ({ tabIndex: 0, onMouseEnter: () => setFokus(i), onMouseLeave: () => setFokus(null), onFocus: () => setFokus(i), onBlur: () => setFokus(null), onClick: () => setFokus(i) });
  return (
    <Stage eyebrow={tr({ uz: "Kod yozish · parametrli so'rov", ru: 'Пишем код · параметризованный запрос' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Kodni yozing', ru: 'Напишите код' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Telefonni SQL'dan <span className="italic" style={{ color: T.accent }}>ajratadigan</span> kod yozamiz.</>, ru: <>Пишем код, который <span className="italic" style={{ color: T.accent }}>отделяет телефон</span> от SQL.</> })}
        mentor={<Mentor>{fmtCode(tr({ uz: "Kod oynasida parametrli so'rovning bir ko'rinishini `$1` bilan yozasiz. «Maydon» repo'sida TypeORM `find({ where: { telefon } })` ham qiymatni xuddi shunday alohida uzatadi.", ru: 'В окне кода вы напишете один из видов параметризованного запроса — с `$1`. В репо «Maydon» TypeORM `find({ where: { telefon } })` тоже передаёт значение отдельно.' }))}</Mentor>}
        vazifa={<>
          <ol className="xr-vazifa">{KOD_VAZIFA.map((v, i) => <li key={i} {...fok(i)} className={cxx(done && 'ok', fokus === i && 'on')}><i>{done ? '✓' : i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>
          <div className="xr-mini">
            <EgaTelefon qidiruv={QIDIRUV_TEL} topildi={yondi(2)} yon={yondi(2) ? undefined : 'qidiruv'} tex={false} />
            <ol className="xr-yonish">{KOD_YONISH.map((y, i) => <li key={i} className={cxx(yondi(i) && 'yon')}><i>{i + 1}</i><span>{tr(y.t)}</span><code>{y.kod}</code></li>)}</ol>
          </div>
        </>}
        yordam={<div className="xr-yordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
          {yordam && <QIzoh>{fmtCode(tr(KOD_YORDAM))}</QIzoh>}
        </div>}
        {...{ [QKOD_ONG]: <div className="xr-kodoyna">
          <pre className="xr-kodp" onCopy={(e) => e.preventDefault()} aria-label="app.js"><span className="xr-kodp-f">app.js</span>{(() => { const qs = (code || tr(KOD_APP)).split('\n'); const jj = kodJoylari(qs); return qs.map((q, i) => <KodSatr key={i} q={q} r={jj[i]} fokus={fokus} />); })()}</pre>
          {!isMentor && <div className="xr-amal">
            <QTugma className={!done ? 'xr-navbat' : undefined} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma>
            <span className="xr-amal-izoh">{tr({ uz: "Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Откроется окно кода — пишете код и сразу видите результат здесь.' })}</span>
          </div>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      >
        {done && <QXulosa>{tr({ uz: "Parametrli so'rovda telefon matni alohida uzatiladi — so'rovga qo'shilmaydi, buyruq bo'lib o'qilmaydi.", ru: 'В параметризованном запросе текст телефона передаётся отдельно — в запрос не вставляется и как команда не читается.' })}</QXulosa>}
      </QKod>
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz) — qobiq tashqi zoomni bekor qiladi */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={tr(KOD_APP)} storageKey="m8d5-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== AMALIYOT BLOKLARI (A1, A2) — QBlok + ScreenBlok; o'ng tomonda kutilgan natija «Xavfsizlik ro'yxati»dan (chizmaning kattasi) =====
const ORTDA_FETCH = 'git fetch https://github.com/Azizbekcrypto/maydon --tags';
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon', ru: 'ожидаемый результат · образец: Maydon' };
const XATO_YOLI = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
const QADAM_GOYA = { uz: "O'z g'oyangiz", ru: 'Ваша идея' };
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · Backend', ru: 'Практика 1 · Backend' }}
    title={{ uz: <>Uch zaiflikni yoping va <span className="italic" style={{ color: T.accent }}>2FA kalitini</span> qo'shing.</>, ru: <>Закройте три уязвимости и добавьте <span className="italic" style={{ color: T.accent }}>ключ 2FA</span>.</> }}
    mentor={{ uz: <>Tuzatishni Antigravity yozadi — kodni va <code className="qcode">.env</code> ni esa siz o'qib tekshirasiz. <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Исправление пишет Antigravity — а код и <code className="qcode">.env</code> читаете и проверяете вы. Начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: () => <>{fmtCode(tr({ uz: "Antigravity'da `maydon` papkasini oching. Terminalda `cd backend`, keyin `npm run start:dev`; brauzerda `localhost:3000` — «Maydon Backend ishlayapti».", ru: 'Откройте папку `maydon` в Antigravity. В терминале `cd backend`, затем `npm run start:dev`; в браузере `localhost:3000` — «Maydon Backend ishlayapti».' }))} <b>{tr({ uz: "Bu teg faqat laptopdagi mashq uchun: uni push qilmang va Render'ga chiqarmang — unda ataylab qoldirilgan zaifliklar bor.", ru: 'Этот тег — только для упражнения на ноутбуке: не делайте push и не выкладывайте его на Render — в нём специально оставлены уязвимости.' })}</b></> },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'Нажмите «Скопировать» и отправьте в Antigravity:' }, prompt: [
        { uz: 'Qayerda: backend/ — ega qidiruvi, imzo kaliti va app.module.ts.', ru: 'Где: backend/ — поиск владельца, ключ подписи и app.module.ts.' },
        { uz: "Nima qilsin: (1) ega telefon qidiruvi parametrli so'rov bo'lsin (TypeORM find({ where: { telefon } })), matn qo'shib yasalgan so'rov olib tashlansin. (2) JWT_SECRET ning kodda turgan zaxira qiymati olib tashlansin — kalit faqat .env dan olinsin, yo'q bo'lsa Backend ishga tushmasin. (3) Ega kirishiga ikkinchi qadam qo'shilsin: POST /kirish parol va 6 xonali kodni birga olsin; token faqat ikkalasi Backend'da tekshirilgandan keyin berilsin; kod .env dagi EGA_2FA_KALITI dan hisoblansin.", ru: 'Что сделать: (1) поиск владельца по телефону — параметризованный запрос (TypeORM find({ where: { telefon } })), запрос со вставкой текста убрать. (2) Убрать запасное значение JWT_SECRET из кода — ключ только из .env, если его нет — Backend не запускается. (3) Добавить второй шаг ко входу владельца: POST /kirish принимает пароль и 6-значный код вместе; токен выдаётся только после проверки обоих в Backend; код вычисляется из EGA_2FA_KALITI в .env.' },
        { uz: "Nima buzilmasin: bandlar va hodisalar yo'llari, 4-darsdagi variant ustuni o'zgarmasin. O'zgargan fayllarni ayt.", ru: 'Что не сломать: маршруты bandlar и hodisalar, столбец variant из 4-го урока не меняются. Назови изменённые файлы.' }
      ] },
      { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "`backend/.env` ga qator qo'shing: `EGA_2FA_KALITI=` va README'dagi buyruq bilan kalit yarating (kalitni telefon ilovasiga qo'shish ham README'da — bir martalik). Backend terminali o'zi qayta ishga tushadi, xato yo'q.", ru: 'Добавьте в `backend/.env` строку `EGA_2FA_KALITI=` и создайте ключ командой из README (добавить ключ в приложение на телефоне — тоже по README, один раз). Терминал Backend перезапустится сам, ошибок нет.' }, err: XATO_YOLI },
      { h: { uz: 'Kodni o\'qib tekshirish', ru: 'Проверка по коду' }, t: { uz: "uch belgini o'z ko'zingiz bilan ko'ring: (1) qidiruvda matn qo'shib yasalgan so'rov yo'q, `find({ where: { telefon } })` bor; (2) kodda `|| '…'` zaxira kalit yo'q; (3) `POST /kirish` parolni ham, kodni ham tekshiradi — noto'g'ri kod bilan token yo'q (401). Agent nima desa ham, kod shuni ko'rsatsin.", ru: "посмотрите своими глазами на три признака: (1) в поиске нет запроса со вставкой текста, есть `find({ where: { telefon } })`; (2) в коде нет запасного ключа `|| '…'`; (3) `POST /kirish` проверяет и пароль, и код — с неверным кодом токена нет (401). Что бы ни сказал агент, код должен показать это." } },
      { h: QADAM_GOYA, t: { uz: "qavs ichini o'z loyihangiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:", ru: 'заполните скобки своим проектом, нажмите «Скопировать» и сохраните — отправите дома в своей папке:' }, prompt: [
        { uz: 'Qayerda: {loyiha papkasi}/backend.', ru: 'Где: {папка проекта}/backend.' },
        { uz: "Nima qilsin: {aniq qidiruv yoki filtr} so'rovida foydalanuvchi matni SQL satriga qo'shilmasin — parametrli so'rov bo'lsin; maxfiy kalitlar faqat .env dan olinsin (zaxira qiymatsiz); {ega yoki admin} kirishida token faqat parol va 6 xonali kod birga tekshirilgandan keyin berilsin.", ru: 'Что сделать: в запросе {конкретный поиск или фильтр} текст пользователя не вставляется в строку SQL — параметризованный запрос; секретные ключи только из .env (без запасных значений); при входе {владельца или админа} токен выдаётся только после проверки пароля и 6-значного кода вместе.' },
        { uz: "Nima buzilmasin: boshqa yo'llar va jadvallar o'zgarmasin. O'zgargan fayllarni ayt.", ru: 'Что не сломать: другие маршруты и таблицы не меняются. Назови изменённые файлы.' }
      ] }
    ]}
    natijaYorliq={NATIJA_YORLIQ}
    natija={<div className="xr-natija">
      <KodKarta nom="Backend · NestJS" satrlar={['bandlar.find({ where: { telefon } })', 'secret: process.env.JWT_SECRET', 'totp.validate({ token: kod, window: 1 }) !== null', 'POST /kirish { parol, kod } → token']} />
      <XavfRuyxat holatlar={['yopilgan', 'ochiq', 'yopilgan']} fa="qoshildi" />
    </div>}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-05-start']}
    doneText={{ uz: 'Backend tayyor: qidiruv parametrli, maxfiy kalit faqat `.env` da, kirish ikki qadamli.', ru: 'Backend готов: поиск параметризованный, секретный ключ только в `.env`, вход в два шага.' }} />
);
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · sayt → push', ru: 'Практика 2 · сайт → push' }}
    title={{ uz: <>Ega sahifasini xavfsiz qiling va <span className="italic" style={{ color: T.accent }}>push qiling</span>.</>, ru: <>Защитите страницу владельца, <span className="italic" style={{ color: T.accent }}>затем push</span>.</> }}
    mentor={{ uz: <>Ism endi oddiy matn bo'lib chiqsin, kirishda kod so'ralsin — keyin push qilasiz. <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Пусть имя теперь выводится обычным текстом, а при входе спрашивается код — потом сделаете push. Начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: 'Backend terminali ishlab tursin. Ikkinchi terminalda `cd web`, keyin `npm run dev`; brauzerda `localhost:5173/ega`.', ru: 'Терминал Backend пусть работает. Во втором терминале `cd web`, затем `npm run dev`; в браузере `localhost:5173/ega`.' } },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'Нажмите «Скопировать» и отправьте в Antigravity:' }, prompt: [
        { uz: "Qayerda: web/src/Ega.jsx — bandlar ro'yxati va kirish formasi.", ru: 'Где: web/src/Ega.jsx — список броней и форма входа.' },
        { uz: "Nima qilsin: (1) ism oddiy matn sifatida chiqsin — dangerouslySetInnerHTML olib tashlansin, {b.ism} qolsin. (2) kirish formasi ikki qadamli bo'lsin: avval parol, keyin 6 xonali kod maydoni; «Kirish» parol va kodni birga POST /kirish ga yuborsin.", ru: 'Что сделать: (1) имя выводится обычным текстом — убрать dangerouslySetInnerHTML, оставить {b.ism}. (2) форма входа в два шага: сначала пароль, потом поле 6-значного кода; «Войти» отправляет пароль и код вместе на POST /kirish.' },
        { uz: "Nima buzilmasin: bandlar ro'yxati va kun almashtirgichi o'zgarmasin; kirish muvaffaqiyatsiz bo'lsa ro'yxat ochilmasin va xato ko'rsatilsin. O'zgargan fayllarni ayt.", ru: 'Что не сломать: список броней и переключатель дня не меняются; при неудачном входе список не открывается и показывается ошибка. Назови изменённые файлы.' }
      ], err: XATO_YOLI },
      { h: { uz: 'Kodni o\'qib tekshirish va sinash', ru: 'Проверка по коду и на сайте' }, t: { uz: "`Ega.jsx` da `dangerouslySetInnerHTML` yo'qligini ko'ring. Saytda parol bilan kiring: 6 xonali kod so'ralsin (telefon ilovasidagi kod). Noto'g'ri kod bilan ro'yxat ochilmasin. Oddiy ism bilan ro'yxat to'g'ri chiqsin.", ru: 'Убедитесь, что в `Ega.jsx` нет `dangerouslySetInnerHTML`. Войдите на сайте с паролем: должен спрашиваться 6-значный код (код из приложения). С неверным кодом список не открывается. С обычным именем список выходит верно.' } },
      { h: 'Push', t: { uz: "uch zaiflik yopilgani va 2FA ishlaganiga ishonch hosil qilgach: `git add .` yoki `git add -A` bilan hammasini emas — `git status` bilan o'zgargan fayllarni ko'rib, faqat shularni qo'shing, `git commit`, `git push`. Render va Netlify push'dan keyin o'zi yangilanadi. (`.env` push qilinmaydi — `.gitignore` da.)", ru: 'когда убедитесь, что три уязвимости закрыты и 2FA работает: не всё подряд через `git add .` или `git add -A` — посмотрите изменённые файлы через `git status` и добавьте только их, `git commit`, `git push`. Render и Netlify обновятся сами после push. (`.env` в push не попадает — он в `.gitignore`.)' } },
      { h: QADAM_GOYA, t: { uz: "qavs ichini to'ldiring, «Nusxalash» — uyda o'z loyihangizda yuborasiz:", ru: 'заполните скобки, «Скопировать» — отправите дома в своём проекте:' }, prompt: [
        { uz: "Qayerda: {loyiha papkasi}/web — foydalanuvchi matni ko'rinadigan joy.", ru: 'Где: {папка проекта}/web — место, где виден текст пользователя.' },
        { uz: "Nima qilsin: foydalanuvchi yozgan matn oddiy matn sifatida chiqsin (HTML bo'lib emas); {ega yoki admin} kirishi ikki qadamli bo'lsin — parol va kod birga yuborilsin.", ru: 'Что сделать: текст пользователя выводится обычным текстом (не как HTML); вход {владельца или админа} в два шага — пароль и код отправляются вместе.' },
        { uz: "Nima buzilmasin: qolgan sahifalar ishlayversin; kirish muvaffaqiyatsiz bo'lsa ichkari ochilmasin.", ru: 'Что не сломать: остальные страницы работают; при неудачном входе внутрь не пускает.' }
      ] }
    ]}
    natijaYorliq={NATIJA_YORLIQ}
    natija={<div className="xr-natija a2">
      <EgaTelefon kirdi ismTur="matn" />
      <ol className="xr-oqim">
        <li><i>1</i>{tr({ uz: 'parol', ru: 'пароль' })}</li>
        <li><i>2</i>{tr({ uz: '6 xonali kod maydoni', ru: 'поле 6-значного кода' })}</li>
        <li className="ok"><i>✓</i>{tr({ uz: "bandlar ro'yxati", ru: 'список броней' })}</li>
        <li className="xr-oqim-q"><code>18:00 · Ali · +998 90 000 00 01</code><small>{tr({ uz: '(ism oddiy matn)', ru: '(имя обычным текстом)' })}</small></li>
      </ol>
    </div>}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-05-done']}
    doneText={{ uz: "Ega sahifasi xavfsiz: ism matn bo'lib chiqadi, kirishda kod so'raladi — endi push qilsa bo'ladi.", ru: 'Страница владельца безопасна: имя выводится текстом, при входе спрашивается код — теперь можно делать push.' }} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran, Mentorsiz (SABOQ 12, 16)
const KARTOCHKALAR = [
  { front: { uz: 'Zaiflik nima?', ru: 'Что такое уязвимость?' }, back: { uz: 'Kodda begona odam foydalanishi mumkin bo\'lgan xato', ru: 'Ошибка в коде, которой может воспользоваться чужой человек' }, note: { uz: 'Yopish — uni tuzatish', ru: 'Закрыть — значит исправить её' } },
  { front: { uz: 'SQL injection nima?', ru: 'Что такое SQL injection?' }, back: { uz: "Foydalanuvchi yozgan matn Database so'roviga buyruq bo'lib qo'shilib ketishi", ru: 'Текст пользователя попадает в запрос к Database как команда' }, note: { uz: "Belgi: matn so'rov satriga qo'shilgan", ru: 'Признак: текст вставлен в строку запроса' } },
  { front: { uz: 'SQL injection qanday yopiladi?', ru: 'Как закрывается SQL injection?' }, back: { uz: "Parametrli so'rov bilan", ru: 'Параметризованным запросом' }, note: { uz: "Matn alohida uzatiladi, so'rovga qo'shilmaydi", ru: 'Текст передаётся отдельно, в запрос не вставляется' } },
  { front: { uz: 'XSS nima?', ru: 'Что такое XSS?' }, back: { uz: "Foydalanuvchi yozgan matn boshqa odamning sahifasida kod bo'lib ishlab ketishi", ru: 'Текст пользователя срабатывает как код на странице другого человека' }, note: { uz: 'XSS — Cross-Site Scripting', ru: 'XSS — Cross-Site Scripting' } },
  { front: { uz: "Bu ro'yxatdagi XSS qanday yopildi?", ru: 'Как закрыли XSS в этом списке?' }, back: { uz: 'Ismni oddiy matn sifatida chiqarib', ru: 'Выводя имя обычным текстом' }, note: { uz: "dangerouslySetInnerHTML o'rniga {b.ism}", ru: '{b.ism} вместо dangerouslySetInnerHTML' } },
  { front: { uz: 'XSS belgisi kodda qaysi?', ru: 'Какой признак XSS в коде?' }, back: 'dangerouslySetInnerHTML', note: { uz: "Foydalanuvchi matni HTML bo'lib chiqadi", ru: 'Текст пользователя выводится как HTML' } },
  { front: { uz: 'Maxfiy kalit qayerda turadi?', ru: 'Где лежит секретный ключ?' }, back: { uz: '.env faylida, kodda emas', ru: 'В файле .env, не в коде' }, note: 'JWT_SECRET, EGA_PAROLI, EGA_2FA_KALITI' },
  { front: { uz: 'Zaxira qiymat nega xavfli?', ru: 'Чем опасно запасное значение?' }, back: { uz: "Kodni o'qigan har kim kalitni ko'radi", ru: 'Ключ видит любой, кто читает код' }, note: { uz: "Belgi: || '…' maxfiy kalit yonida", ru: "Признак: || '…' рядом с секретным ключом" } },
  { front: { uz: '2FA nima?', ru: 'Что такое 2FA?' }, back: { uz: 'Ikki bosqichli kirish: parol + telefon ilovasidagi 6 xonali kod', ru: 'Двухэтапный вход: пароль + 6-значный код из приложения на телефоне' }, note: { uz: 'Token — Backend ikkalasini tekshirgandan keyin', ru: 'Токен — после того как Backend проверит оба' } },
  { front: { uz: '6 xonali kodni nima hisoblaydi?', ru: 'Кто вычисляет 6-значный код?' }, back: { uz: 'Telefon ilovasi va Backend — bir xil kalitdan', ru: 'Приложение на телефоне и Backend — из одного ключа' }, note: { uz: 'Kod odatda 30 soniyada yangilanadi', ru: 'Код обычно обновляется каждые 30 секунд' } },
  { front: { uz: 'Bu darsda zaiflik yopilganini qanday tekshirdik?', ru: 'Как на этом уроке мы проверили, что уязвимость закрыта?' }, back: { uz: "Kodni o'qib va saytni oddiy ma'lumot bilan sinab", ru: 'Прочитав код и проверив сайт на обычных данных' }, note: { uz: "Faqat o'z saytingizda; bu butun sayt xavfsizligi emas", ru: 'Только на своём сайте; это не безопасность всего сайта' } },
  { front: { uz: 'EGA_2FA_KALITI qayerda saqlanadi?', ru: 'Где хранится EGA_2FA_KALITI?' }, back: { uz: '.env faylida', ru: 'В файле .env' }, note: { uz: 'Backend va telefon ilovasi undan bir xil kod hisoblaydi', ru: 'Backend и приложение вычисляют из него один и тот же код' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); ko'rsatma karta ostida, birinchi bosishgacha, karta yuzi halqada */}
        <div className={cxx('xr-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="xr-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204). CODE STRIKE va arena — jonli o'yin qatlami; uyga vazifa — karta «kim uchun · nechta · muddat» =====
const YAKUN_RECAP = [
  { uz: "SQL injection — foydalanuvchi matni so'rovga qo'shilib ketishi; parametrli so'rov buni yopadi.", ru: 'SQL injection — текст пользователя вставляется в запрос; параметризованный запрос это закрывает.' },
  { uz: "XSS — foydalanuvchi matni sahifada kod bo'lib ishlab ketishi; bu ro'yxatda ism oddiy matn bo'lib chiqqach, shu zaiflik yopildi.", ru: 'XSS — текст пользователя срабатывает на странице как код; в этом списке, когда имя стало выводиться обычным текстом, эта уязвимость закрылась.' },
  { uz: "Maxfiy kalit kodda turmasin — faqat `.env` dan olinadi, yo'q bo'lsa Backend ishga tushmaydi.", ru: 'Секретный ключ не лежит в коде — берётся только из `.env`, если его нет — Backend не запускается.' },
  { uz: "2FA — parol va telefon ilovasidagi 6 xonali kod; parol begona qo'lga o'tsa ham kod kerak.", ru: '2FA — пароль и 6-значный код из приложения на телефоне; даже если пароль в чужих руках, нужен код.' },
  { uz: "Zaiflikni kodni o'qib va saytni oddiy ma'lumot bilan sinab tekshiramiz — faqat o'z saytingizda.", ru: 'Уязвимость проверяем, читая код и пробуя сайт на обычных данных, — только на своём сайте.' }
];
const UYGA = [
  { b: { uz: 'Zaifliklar', ru: 'Уязвимости' }, t: { uz: "A1 dagi «O'z g'oyangiz» promptini loyihangizda yuboring: foydalanuvchi matnli so'rovlar parametrli, maxfiy kalitlar faqat `.env` da.", ru: 'Отправьте в своём проекте промпт «Ваша идея» из A1: запросы с текстом пользователя параметризованы, секретные ключи только в `.env`.' } },
  { b: { uz: 'Ism', ru: 'Имя' }, t: { uz: 'A2 dagi promptni yuboring: foydalanuvchi yozgan matn oddiy matn bo\'lib chiqsin.', ru: 'Отправьте промпт из A2: текст пользователя выводится обычным текстом.' } },
  { b: { uz: 'Ikkinchi qadam', ru: 'Второй шаг' }, t: { uz: "ega yoki admin kirishiga 6 xonali kod qo'shing, kodni o'qib tekshiring va push qiling.", ru: 'добавьте ко входу владельца или админа 6-значный код, проверьте, читая код, и сделайте push.' } }
];
const HwKarta = () => (
  <div className="card hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="xr-hw-meta">
      <span><small>{tr({ uz: 'kim uchun', ru: 'для кого' })}</small>{tr({ uz: "o'z loyihangiz", ru: 'ваш проект' })}</span>
      <span><small>{tr({ uz: 'nechta', ru: 'сколько' })}</small>{tr({ uz: '3 zaiflik + 2FA', ru: '3 уязвимости + 2FA' })}</span>
      <span><small>{tr({ uz: 'muddat', ru: 'срок' })}</small>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</span>
    </div>
    <ol className="xr-hw-q">{UYGA.map((h, i) => <li key={i}><i>{i + 1}</i><span><b>{tr(h.b)}</b> — {fmtCode(tr(h.t))}</span></li>)}</ol>
    <p className="hw-note">{tr({ uz: <>Keyingi dars — <b>«Foydalanuvchi sizga ma'lumotini ishonadimi?»</b>. Ma'lumot sizib chiqsa nima bo'ladi: audit va maxfiylik siyosati.</>, ru: <>Следующий урок — <b>«Доверяет ли вам пользователь свои данные?»</b>. Что будет, если данные утекут: аудит и политика конфиденциальности.</> })}</p>
  </div>
);
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
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Uch zaiflik yopilgan', ru: 'Три уязвимости закрыты' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Uch zaiflik yopilgan, <span className="italic" style={{ color: T.accent }}>ega kirishi 2FA bilan</span>.</>, ru: <>Три уязвимости закрыты, <span className="italic" style={{ color: T.accent }}>вход владельца — с 2FA</span>.</> })}
        cta={<>
          <p className="small xr-fikr fade-up d1">{tr({ uz: "Bu darsda zaiflikni hujum qilmasdan, koddagi xavfli belgilarni o'qib topasiz: matn so'rovga qo'shilganmi, HTML bo'lib chiqqanmi, maxfiy kalit kodda turganmi.", ru: 'На этом уроке вы находите уязвимость без атаки, читая опасные признаки в коде: вставлен ли текст в запрос, выводится ли он как HTML, лежит ли секретный ключ в коде.' })}</p>
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={YAKUN_RECAP.map(r => fmtCode(tr(r)))}
        uyga={<HwKarta />}
        hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      />
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function SecurityBasicsLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenKod, Screen9, Screen10, Screen11, Screen12, ScreenA1, ScreenA2, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI — «Xavfsizlik ro'yxati» (xr-): telefon chapda, kod va zaiflik kartalari o'ngda. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .xr-navbat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: xr-puls 1.8s ease-out infinite; }
        @keyframes xr-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        /* Bashorat: karta ko'tarilib kiradi, variantlar navbat bilan; tanlangach ixcham qatorga yig'iladi */
        .xr-bash .q-bashorat { border-color: ${T.accent}; animation: xr-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both, xr-puls 1.8s ease-out 0.7s infinite; }
        .xr-bash .q-chip { animation: xr-chip 0.38s ease-out both; }
        .xr-bash .q-chip:nth-child(1) { animation-delay: 0.22s; } .xr-bash .q-chip:nth-child(2) { animation-delay: 0.34s; } .xr-bash .q-chip:nth-child(3) { animation-delay: 0.46s; }
        .xr-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; transform-origin: top center; animation: xr-yig 0.42s cubic-bezier(.2,.9,.3,1.1) both; }
        .xr-taxmin-y { font-weight: 800; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .xr-taxmin-s { font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .xr-taxmin b { font-size: 14px; color: ${T.ink}; }
        @keyframes xr-kot { from { opacity: 0; transform: translateY(14px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes xr-chip { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes xr-yig { from { opacity: 0.2; transform: scaleY(1.9); } to { opacity: 1; transform: none; } }
        /* Natija bloki: bitta yashil blok, birinchi qatori — taxmin */
        .q-xulosa.xr-nb { display: flex; flex-direction: column; gap: 4px; padding: 12px 18px; font-size: 14.5px; line-height: 1.45; }
        .xr-nb-t { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .xr-nb-t b { color: ${T.ink}; } .xr-nb-t.ok { color: ${T.ok}; font-weight: 700; }
        .xr-nb-i { font-weight: 600; color: ${T.ink}; }
        .xr-nb-q { font-size: 13.5px; color: ${T.ink2}; }
        p.xr-gap { margin: 0; padding: 9px 13px; border-radius: 12px; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; animation: xr-kir 0.4s ease-out both; }
        p.xr-gap.err { background: ${T.errFon}; } p.xr-gap.ok { background: ${T.okFon}; }
        p.xr-repo { margin: 6px 0 0; font-size: 12px; color: ${T.ink2}; }
        /* Telefon = sayt (ega sahifasi): o'lchami barqaror 172×272; ustida texnologiya yorlig'i, ostida o'z tugmasi */
        .xr-tel-ust { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; flex: none; }
        .xr-tel-tex { display: inline-flex; align-items: center; gap: 7px; padding: 3px 11px; border: 1.5px solid ${T.line}; border-radius: 999px; background: ${T.paper}; font-size: 12px; white-space: nowrap; }
        .xr-tel-tex b { font-weight: 700; color: ${T.ink}; }
        .xr-tel-tex code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.accent}; }
        .xr-telefon { position: relative; width: 172px; height: 272px; display: flex; flex-direction: column; border: 2px solid ${T.ink}; border-radius: 22px; padding: 8px 8px 10px; background: ${T.paper}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.35); overflow: hidden; }
        .xr-tel-manzil { display: flex; align-items: center; gap: 6px; height: 20px; padding: 0 8px; border-radius: 10px; background: ${T.bg}; margin-bottom: 8px; }
        .xr-tel-manzil i { width: 7px; height: 7px; border-radius: 50%; background: ${T.line}; flex: none; }
        .xr-tel-manzil span { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .xr-tel-sahifa { flex: 1; display: flex; flex-direction: column; gap: 6px; animation: xr-kir 0.35s ease-out both; }
        .xr-tel-bosh { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .xr-tel-bosh b { font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .xr-kirdi { font-size: 11px; font-weight: 700; color: ${T.ok}; background: ${T.okFon}; border-radius: 999px; padding: 1px 7px; white-space: nowrap; animation: xr-pop 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        .xr-qidiruv { display: flex; flex-direction: column; gap: 4px; padding: 3px; margin: -3px; border-radius: 10px; transition: background 0.3s; }
        .xr-qidiruv.yon, .xr-kodm.yon { box-shadow: 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
        .xr-kirish.yon { box-shadow: 0 0 0 2px ${T.paper}, 0 0 0 4px ${T.accent}; }
        .xr-input { display: flex; flex-direction: column; justify-content: center; min-height: 26px; padding: 3px 8px; border: 1px solid ${T.line}; border-radius: 7px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; }
        .xr-input.tola { color: ${T.ink}; background: ${T.paper}; padding-inline: 5px; } /* telefon raqami maydonga sig'sin (modul:yopish C; 8-ekran mini-telefonida qolgan 3px — kichraytirilgan maket o'lchovi, suratda sig'adi) */
        .xr-input small { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; color: ${T.ink2}; }
        .xr-parol { letter-spacing: 0.12em; }
        .xr-telefon.ilova { background: ${T.bg}; }
        .xr-kodm { animation: xr-kir 0.4s ease-out both; letter-spacing: 0.04em; }
        .xr-qidir { border: 0; border-radius: 8px; padding: 6px 0; background: ${T.accent}; color: ${T.paper}; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; cursor: pointer; }
        .xr-qidir:disabled { cursor: default; opacity: 0.8; }
        .xr-kirish { display: block; text-align: center; border-radius: 8px; padding: 6px 0; background: ${T.accent}; color: ${T.paper}; font-weight: 700; font-size: 12px; transition: box-shadow 0.3s; }
        .xr-qator { display: flex; flex-direction: column; gap: 1px; padding: 5px 7px; border: 1px solid ${T.line}; border-radius: 8px; background: ${T.paper}; transition: opacity 0.35s, background 0.35s, border-color 0.35s; }
        .xr-qator-1 { font-size: 12px; color: ${T.ink}; }
        .xr-qator-1 b { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        .xr-qator code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .xr-qator.top { border-color: ${T.accent}; background: ${T.accentSoft}; animation: xr-qator 0.6s ease-out; }
        .xr-qator.xira { opacity: 0.35; }
        .xr-ism { display: inline-flex; align-items: center; gap: 4px; font-weight: 700; border-radius: 6px; padding: 0 3px; transition: box-shadow 0.3s, background 0.3s; }
        .xr-ism.yon { box-shadow: 0 0 0 2px ${T.accent}; }
        .xr-ism.html { box-shadow: 0 0 0 1.5px ${T.err}; background: ${T.errFon}; }
        .xr-ism.matn { box-shadow: 0 0 0 1.5px ${T.ok}; background: ${T.okFon}; }
        .xr-ism small { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; line-height: 1; padding: 1px 4px; border-radius: 4px; animation: xr-pop 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        .xr-ism.html small { color: ${T.paper}; background: ${T.err}; } .xr-ism.matn small { color: ${T.paper}; background: ${T.ok}; }
        /* Telefon ilovasi: 6 xonali kod va sokin taymer yoyi (tinimsiz aylanmaydi) */
        .xr-ilova { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
        .xr-ilova-n { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .xr-ilova-kod { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; letter-spacing: 0.04em; color: ${T.accent}; animation: xr-pop 0.45s cubic-bezier(.3,1.5,.5,1) both; border-radius: 8px; padding: 2px 6px; }
        .xr-ilova-kod.bosh { color: ${T.line}; animation: none; }
        .xr-ilova-kod.yon { box-shadow: 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
        .xr-ilova-t { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .xr-ilova-t i { width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid ${T.line}; border-top-color: ${T.accent}; border-right-color: ${T.accent}; transform: rotate(-20deg); }
        /* Chizma: telefon | yo'lak | o'ng (zaiflik kartasi + kod kartasi) */
        .xr-chizma { position: relative; display: grid; grid-template-columns: 172px minmax(76px, 0.5fr) minmax(0, 1.6fr); align-items: start; gap: 0 14px; }
        .xr-chizma.s9 { grid-template-columns: auto minmax(64px, 0.4fr) minmax(0, 1.4fr); }
        .xr-ikki { display: flex; gap: 14px; align-items: flex-start; }
        .xr-yol { display: flex; flex-direction: column; gap: 5px; margin-top: 120px; min-width: 0; }
        .xr-yol > span:not(.xr-yol-c), .xr-yol-c > span { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: xr-kir 0.3s ease-out; }
        .xr-yol > i, .xr-yol-c > i { position: relative; display: block; height: 0; border-top: 2px dashed ${T.line}; }
        .xr-yol > i::after, .xr-yol-c > i::after { content: ''; position: absolute; right: -2px; top: -7px; border: 6px solid transparent; border-left: 8px solid ${T.line}; border-right-width: 0; }
        .xr-yol.chap i::after { right: auto; left: -2px; border-left: 0; border-right: 8px solid ${T.line}; border-left-width: 0; }
        .xr-yol-c { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .xr-yol.tanla { margin-top: 44px; gap: 18px; }
        .xr-yol.tanla .xr-tanla { width: 100%; }
        .xr-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; margin-top: 34px; }
        /* Uchuvchi konvert / nuqta (SABOQ 19) */
        .xr-uch { position: absolute; z-index: 5; pointer-events: none; transform: translate(-50%, -50%); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; white-space: nowrap; padding: 4px 10px 4px 24px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.accent}; color: ${T.ink}; box-shadow: 0 10px 20px -8px rgba(${T.shadowBase},0.45); animation: xr-uch 800ms cubic-bezier(.45,0,.25,1) both; }
        .xr-uch::before { content: ''; position: absolute; left: 7px; top: 50%; width: 11px; height: 8px; margin-top: -4px; border: 1.5px solid ${T.accent}; border-radius: 2px; }
        .xr-uch::after { content: ''; position: absolute; left: 10px; top: 50%; width: 5px; height: 5px; margin-top: -5px; border-right: 1.5px solid ${T.accent}; border-bottom: 1.5px solid ${T.accent}; transform: rotate(45deg); }
        .xr-uch.ok { border-color: ${T.ok}; } .xr-uch.ok::before, .xr-uch.ok::after { border-color: ${T.ok}; }
        .xr-uch.nuqta { padding: 0; width: 11px; height: 11px; border: 0; border-radius: 50%; background: ${T.accent}; box-shadow: none; }
        .xr-uch.nuqta.ok { background: ${T.ok}; }
        .xr-uch.nuqta::before, .xr-uch.nuqta::after { display: none; }
        @keyframes xr-uch { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.6); } 14% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 84% { opacity: 1; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.55); } }
        /* Kod kartasi */
        .xr-kod { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border: 1.5px solid ${T.line}; border-radius: 14px; background: ${T.paper}; min-width: 0; }
        .xr-kod-n { font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .xr-kod-oyna, .xr-db, .xr-env, .xr-tek-q, .xr-yonish, .xr-oqim, .xr-qator, .xr-input, .xr-ilova-kod { font-variant-ligatures: none; }
        .xr-kod-oyna { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: 10px; background: ${CODE.bg}; animation: xr-kir 0.35s ease-out both; }
        code.xr-kod-q { display: block; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.6; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; padding: 0 6px; margin: 0 -6px; border-radius: 5px; transition: background 0.3s; }
        code.xr-kod-q.err { background: ${fon(T.err, 0.35)}; }
        code.xr-kod-q.xr-eski { text-decoration: line-through; text-decoration-color: ${T.err}; opacity: 0.6; }
        code.xr-kod-q.ok { background: ${fon(T.ok, 0.32)}; }
        .xr-skelet { display: block; height: 10px; width: 82%; border-radius: 5px; background: ${fon(T.paper, 0.14)}; margin: 4px 0; }
        .xr-skelet.q { width: 46%; }
        .xr-db { display: flex; flex-direction: column; gap: 5px; padding: 8px 10px; border-radius: 10px; border: 1.5px dashed ${T.line}; background: ${T.bg}; animation: xr-kir 0.4s ease-out both; }
        .xr-db-n { font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink2}; }
        .xr-db code { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.5; color: ${T.ink}; overflow-wrap: anywhere; }
        .xr-db mark { padding: 0 3px; border-radius: 4px; color: ${T.ink}; animation: xr-pop 0.5s cubic-bezier(.3,1.5,.5,1) both; }
        .xr-db.err { border-color: ${T.err}; } .xr-db.err mark { background: ${T.errFon}; box-shadow: 0 0 0 1.5px ${T.err}; }
        .xr-db.ok { border-color: ${T.ok}; } .xr-db.ok mark { background: ${T.okFon}; box-shadow: 0 0 0 1.5px ${T.ok}; }
        .xr-db code.xr-db-qiymat { align-self: flex-start; padding: 2px 8px; border-radius: 7px; background: ${T.okFon}; color: ${T.ok}; font-weight: 700; animation: xr-tush 0.55s cubic-bezier(.3,1.4,.5,1) 0.15s both; }
        .xr-env { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; padding: 7px 10px; border-radius: 10px; border: 1.5px dashed ${T.line}; background: ${T.bg}; transition: border-color 0.3s, background 0.3s; }
        .xr-env-f { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; }
        .xr-env code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; }
        .xr-env small { font-size: 11px; font-weight: 700; color: ${T.err}; }
        .xr-env.yoq { border-color: ${T.err}; } .xr-env.bor { border-style: solid; border-color: ${T.ok}; background: ${T.okFon}; }
        .xr-tek-q { display: grid; grid-template-columns: minmax(0, 1fr) auto 22px; align-items: center; gap: 8px; padding: 7px 10px; border: 1px solid ${T.line}; border-radius: 9px; background: ${T.bg}; transition: all 0.35s; }
        .xr-tek-q span { font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .xr-tek-q code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .xr-tek-q b { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: ${T.line}; color: ${T.ink2}; font-size: 12px; }
        .xr-tek-q[data-on="true"] { border-color: ${T.ok}; background: ${T.okFon}; }
        .xr-tek-q[data-on="true"] b { background: ${T.ok}; color: ${T.paper}; animation: xr-tush 0.5s cubic-bezier(.3,1.4,.5,1) both; }
        .xr-tek-token { align-self: flex-end; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ok}; animation: xr-kir 0.4s ease-out both; }
        /* Zaiflik kartalari: qizil «ochiq» → yashil «yopilgan»; ✓ raqam o'rniga tushadi */
        .xr-ruyxat { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .xr-ruyxat.navbat > .xr-karta { animation: xr-kir 0.45s ease-out both; }
        .xr-ruyxat.navbat > .xr-karta:nth-child(2) { animation-delay: 0.1s; } .xr-ruyxat.navbat > .xr-karta:nth-child(3) { animation-delay: 0.2s; } .xr-ruyxat.navbat > .xr-karta:nth-child(4) { animation-delay: 0.3s; }
        .xr-karta { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; align-items: center; gap: 4px 10px; padding: 9px 12px; border: 1.5px solid ${fon(T.err, 0.45)}; border-radius: 12px; background: ${T.paper}; transition: border-color 0.4s, background 0.4s; }
        .xr-karta-r { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: ${T.errFon}; color: ${T.err}; font-size: 13px; font-weight: 800; }
        .xr-karta-b { display: flex; flex-direction: column; min-width: 0; }
        .xr-karta-b b { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        .xr-karta-b small { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .xr-pill { font-size: 11.5px; font-weight: 700; padding: 2px 9px; border-radius: 999px; background: ${T.errFon}; color: ${T.err}; white-space: nowrap; }
        .xr-karta.yopilgan { border-color: ${T.ok}; background: ${T.okFon}; }
        .xr-karta.yopilgan .xr-karta-r { background: ${T.ok}; color: ${T.paper}; animation: xr-tush 0.55s cubic-bezier(.3,1.4,.5,1) both; }
        .xr-karta.yopilgan .xr-pill { background: ${T.paper}; color: ${T.ok}; animation: xr-pop 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        .xr-ruyxat > .xr-2fa { margin-top: 4px; }
        .xr-kod.xr-tek { gap: 6px; }
        .xr-karta.kul { border-color: ${T.line}; border-style: dashed; }
        .xr-karta.kul .xr-karta-r { background: ${T.bg}; color: ${T.ink2}; }
        .xr-karta.kul .xr-pill { background: ${T.bg}; color: ${T.ink2}; }
        /* 11-ekran: har kartada belgi va ikki ✓ (kodni o'qidik · oddiy ma'lumot) */
        .xr-belgi { grid-column: 2 / 4; display: flex; flex-direction: column; gap: 4px; padding-top: 6px; margin-top: 2px; border-top: 1px dashed ${fon(T.ok, 0.4)}; }
        .xr-belgi-t { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; transition: color 0.3s; }
        .xr-belgi.ok .xr-belgi-t { color: ${T.ink}; }
        .xr-belgi-s { display: flex; flex-wrap: wrap; gap: 6px; }
        .xr-belgi-k, .xr-belgi-o { font-size: 11.5px; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: ${T.bg}; color: ${T.ink2}; border: 1px solid ${T.line}; transition: all 0.3s; }
        .xr-belgi-k.on, .xr-belgi-o.on { background: ${T.paper}; color: ${T.ok}; border-color: ${T.ok}; animation: xr-pop 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        .xr-ruyxat.ixcham { gap: 7px; }
        .xr-ruyxat.ixcham .xr-karta { grid-template-columns: 26px auto minmax(0, 1fr); padding: 8px 12px; gap: 4px 8px; }
        .xr-ruyxat.ixcham .xr-karta-b small, .xr-ruyxat.ixcham .xr-pill { display: none; }
        .xr-ruyxat.ixcham .xr-karta-r { grid-row: 1 / span 2; }
        .xr-ruyxat.ixcham .xr-2fa .xr-karta-r { grid-row: auto; }
        .xr-ruyxat.ixcham .xr-belgi { display: contents; }
        .xr-ruyxat.ixcham .xr-2fa .xr-karta-b { flex-direction: row; align-items: baseline; gap: 8px; }
        .xr-ruyxat.ixcham .xr-2fa .xr-karta-b small { display: inline; }
        .xr-ruyxat.ixcham .xr-belgi-t { grid-column: 3; grid-row: 1; align-self: center; }
        .xr-ruyxat.ixcham .xr-belgi-t::before { content: '— '; color: ${T.ink2}; }
        .xr-ruyxat.ixcham .xr-belgi-s { grid-column: 2 / 4; grid-row: 2; }
        /* 0-ekran: telefon yonida agent chati; javobdan keyin — uch qizil karta */
        .xr-kirish-m { position: relative; display: flex; align-items: flex-start; gap: 14px; }
        .xr-chat { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border: 1px solid ${T.line}; border-radius: 14px; background: ${T.paper}; margin-top: 34px; }
        .xr-chat-h { font-size: 12px; font-weight: 700; color: ${T.ink2}; padding-bottom: 6px; border-bottom: 1px solid ${T.line}; }
        p.xr-puf { margin: 0; padding: 8px 11px; border-radius: 12px; font-size: 13px; line-height: 1.45; color: ${T.ink}; max-width: 92%; animation: xr-kir 0.4s ease-out both; }
        p.xr-puf.siz { align-self: flex-end; background: ${T.accentSoft}; border-bottom-right-radius: 4px; animation-delay: 0.15s; }
        p.xr-puf.agent { align-self: flex-start; background: ${T.bg}; border: 1px solid ${T.line}; border-bottom-left-radius: 4px; animation-delay: 0.75s; }
        .xr-kirish-r { flex: 1 1 0; margin-top: 34px; }
        /* 1-ekran (reja): telefon va ro'yxat yonma-yon */
        .xr-reja { display: flex; align-items: flex-start; gap: 14px; }
        .xr-reja > .xr-ruyxat { flex: 1 1 0; margin-top: 34px; }
        .lesson-root .q-reja .q-split { grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr); }
        @media (max-width: 860px) { .lesson-root .q-reja .q-split { grid-template-columns: minmax(0, 1fr); } }
        .xr-tanla { display: flex; flex-direction: column; align-items: stretch; gap: 6px; width: 200px; }
        .xr-tanla .q-chip { justify-content: center; text-align: center; white-space: normal; }
        .xr-tel-ust > .q-btn { align-self: center; max-width: 220px; white-space: normal; }
        .xr-tel-ust > .q-btn.xr-tel-btn:disabled { opacity: 0.6; }
        .xr-qn { margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; opacity: 0.85; }
        /* 8-ekran: chap karta cho'zilmaydi; vazifa ostida mini-telefon; koddagi ikki joy raqamli */
        .lesson-root .q-kod { align-items: start; }
        .lesson-root .q-kod > .q-col > .q-karta { flex-grow: 0; }
        ol.xr-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .xr-vazifa li { display: flex; gap: 10px; align-items: flex-start; font-size: 14.5px; line-height: 1.5; color: ${T.ink}; border-radius: 10px; padding: 4px 6px; margin: -4px -6px; cursor: default; transition: background 0.2s; outline: none; }
        .xr-vazifa li.on { background: ${T.accentSoft}; }
        .xr-vazifa li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 700; background: ${T.accentSoft}; color: ${T.accent}; }
        .xr-vazifa li.ok i { background: ${T.okFon}; color: ${T.ok}; }
        .xr-mini { display: flex; align-items: center; gap: 16px; padding: 10px 12px; margin-top: 14px; border: 1px solid ${T.line}; border-radius: 14px; background: ${T.bg}; }
        .xr-mini .xr-tel-ust { zoom: 0.62; }
        ol.xr-yonish { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .xr-yonish li { display: grid; grid-template-columns: 22px 1fr; gap: 1px 8px; align-items: center; padding: 6px 10px 6px 6px; border: 1.5px solid ${T.line}; border-radius: 11px; background: ${T.paper}; opacity: 0.6; transition: all 0.35s; }
        .xr-yonish li i { grid-row: span 2; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 700; background: ${T.line}; color: ${T.ink2}; transition: all 0.35s; }
        .xr-yonish li span { font-size: 12px; color: ${T.ink2}; }
        .xr-yonish li code { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .xr-yonish li.yon { opacity: 1; border-color: ${T.accent}; animation: xr-yon 0.9s ease-out; }
        .xr-yonish li.yon i { background: ${T.accent}; color: ${T.paper}; }
        @keyframes xr-yon { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.5)}; } 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .xr-yordam { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 14px; }
        .xr-kodoyna { display: flex; flex-direction: column; gap: 12px; }
        pre.xr-kodp { font-variant-ligatures: none; margin: 0; padding: 12px 14px; border-radius: 12px; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; white-space: pre; overflow: auto; max-height: 340px; user-select: none; }
        .xr-kodp-f { display: block; color: ${CODE.attr}; font-weight: 700; }
        .xr-kq { display: block; white-space: pre-wrap; overflow-wrap: break-word; padding-left: 4ch; text-indent: -4ch; border-radius: 4px; transition: background 0.25s; }
        .xr-kq.eski { background: ${fon(T.err, 0.3)}; }
        .xr-kq-joy .xr-kq-r { display: inline-grid; place-items: center; width: 18px; height: 18px; margin-right: 6px; border-radius: 50%; background: ${T.accent}; color: ${T.paper}; font-size: 11px; font-weight: 800; text-indent: 0; vertical-align: 1px; }
        .xr-kq-joy .xr-kq-izoh { color: ${CODE.tag}; font-style: italic; padding: 1px 6px; border-radius: 6px; border: 1px dashed ${fon(T.accent, 0.6)}; transition: background 0.25s; }
        .xr-kq-joy.on .xr-kq-izoh { background: ${fon(T.accent, 0.28)}; border-style: solid; }
        .xr-amal { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .xr-amal-izoh { font-size: 12.5px; color: ${T.ink2}; text-align: right; }
        /* Amaliyot bloklari: kutilgan natija */
        .xr-natija { display: flex; flex-direction: column; gap: 10px; }
        .xr-natija.a2 { flex-direction: row; align-items: flex-start; gap: 16px; }
        ol.xr-oqim { list-style: none; margin: 34px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .xr-oqim li { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: ${T.ink}; padding: 6px 10px; border: 1px solid ${T.line}; border-radius: 10px; background: ${T.paper}; }
        .xr-oqim li i { flex: none; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 11px; font-weight: 700; background: ${T.accentSoft}; color: ${T.accent}; }
        .xr-oqim li.ok { border-color: ${T.ok}; background: ${T.okFon}; } .xr-oqim li.ok i { background: ${T.ok}; color: ${T.paper}; }
        .xr-oqim li.xr-oqim-q { flex-direction: column; align-items: flex-start; gap: 2px; border-style: dashed; }
        .xr-oqim-q code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; overflow-wrap: anywhere; }
        .xr-oqim-q small { font-size: 11px; color: ${T.ok}; font-weight: 700; }
        /* Kartochkalar va yakun */
        .xr-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: xr-puls 1.6s ease-out 3; }
        p.xr-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .xr-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: xr-nuqta 1.4s ease-in-out 3; }
        p.xr-fikr { margin: 4px auto 0; max-width: 640px; text-align: center; color: ${T.ink2}; line-height: 1.5; }
        .xr-hw-meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 4px 0 10px; }
        .xr-hw-meta span { display: flex; flex-direction: column; padding: 6px 12px; border: 1px solid ${T.line}; border-radius: 10px; background: ${T.bg}; font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .xr-hw-meta small { font-size: 11px; font-weight: 600; color: ${T.ink2}; }
        ol.xr-hw-q { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .xr-hw-q li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .xr-hw-q li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 700; background: ${T.accentSoft}; color: ${T.accent}; }
        @keyframes xr-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes xr-pop { from { opacity: 0; transform: scale(1.35); } to { opacity: 1; transform: none; } }
        @keyframes xr-tush { 0% { opacity: 0; transform: translateY(-14px) scale(0.7); } 60% { opacity: 1; transform: translateY(2px) scale(1.08); } 100% { transform: none; } }
        @keyframes xr-qator { 0% { background: ${T.okFon}; transform: translateX(-6px); } 40% { transform: none; } }
        @keyframes xr-nuqta { 50% { transform: scale(1.6); opacity: 0.4; } }
        @media (max-width: 640px) {
          .xr-chizma, .xr-chizma.s9 { grid-template-columns: minmax(0, 1fr); justify-items: center; gap: 0; }
          .xr-yol { width: 100%; margin: 8px 0; flex-direction: row; align-items: center; justify-content: center; gap: 10px; height: 46px; }
          .xr-yol.tanla { flex-direction: column; height: auto; gap: 10px; margin: 10px 0; }
          .xr-yol-c { flex-direction: row; align-items: center; justify-content: center; gap: 10px; height: 40px; }
          .xr-yol > span:not(.xr-yol-c), .xr-yol-c > span { order: 2; }
          .xr-yol > i, .xr-yol-c > i { order: 1; width: 0; height: 40px; border-top: 0; border-left: 2px dashed ${T.line}; }
          .xr-yol i::after, .xr-yol.chap i::after { right: auto; left: -7px; top: auto; bottom: -2px; border: 6px solid transparent; border-top: 8px solid ${T.line}; border-bottom-width: 0; }
          .xr-ong { width: 100%; margin-top: 0; }
          .xr-ikki { gap: 10px; }
          .xr-kirish-m { gap: 10px; }
          .xr-chat, .xr-kirish-r { margin-top: 0; }
          .xr-reja { flex-direction: column; align-items: center; }
          .xr-reja > .xr-ruyxat { width: 100%; margin-top: 4px; }
          .xr-natija.a2 { flex-direction: column; align-items: center; }
          ol.xr-oqim { margin-top: 0; width: 100%; }
          .xr-mini { gap: 10px; padding: 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .xr-navbat, .xr-bash .q-bashorat, .xr-bash .q-chip, .xr-taxmin, p.xr-gap, .xr-tel-sahifa, .xr-kirdi, .xr-kodm, .xr-qator.top, .xr-ism small, .xr-ilova-kod,
          .xr-kod-oyna, .xr-db, .xr-db mark, .xr-db code.xr-db-qiymat, .xr-tek-q[data-on="true"] b, .xr-tek-token, .xr-ruyxat.navbat > .xr-karta, .xr-karta.yopilgan .xr-karta-r,
          .xr-karta.yopilgan .xr-pill, .xr-belgi-k.on, .xr-belgi-o.on, p.xr-puf, .xr-yonish li.yon, .xr-yol span, .xr-flash.yangi .fc-card:not(.flip) .fc-front, .xr-fc-ipucha i { animation: none !important; }
          .xr-karta, .xr-qator, .xr-ism, .xr-env, .xr-tek-q, .xr-belgi-k, .xr-belgi-o, code.xr-kod-q { transition: none !important; }
          .xr-uch { display: none; }
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
        /* Telefonda (≤640) o'ngda joy yo'q — ⛶ mazmun ustida alohida qatorda turadi, matn va kartani yopmaydi (10-Modul pilot, F-1005-171) */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); } /* skeletda yo'q edi — ⛶ ishlamasdi (11-Modul seansi, F-1007-290; MEXANIZM-TAKLIF 10) */
        .q-fokus:has(.zoom-on) { animation: none; transform: none; } /* qolip .q-fokus (fill both) transform qoldiradi — yakuniy holatda ⛶ oynasi siljiydi (F-1007-290; MEXANIZM-TAKLIF 12) */
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
