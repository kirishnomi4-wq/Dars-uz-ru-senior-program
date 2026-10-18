import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 10-Modul · 7-dars «Production deploy: domen, SSL, monitoring» (m8-07) — MD v3: feedback/F-1005-10modul/07-ProductionDeploy-v3.md.
// Skeletdan (src/skelet/NamunaDars.jsx, 04.10.2026) qurildi: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — TEGILMAGAN;
//   kontent — 18 ekran: s0 QKirish · s1 QReja · s2/s4/s6/s8/s10 QTushuncha · s3/s5/s7/s9 test (QuestionScreen → QTest) · s11 QTartib ·
//   a1–a3 amaliyot bloki (QBlok + ScreenBlok, 172/173) · podium · QKartochka · QYakun.
// Bitta vizual — «Prod xaritasi» (PROD_TUGUNLAR): o'yinchi telefoni = sayt (chapda, 172×272) · Backend · Render · Database · Neon · UptimeRobot · sizning telefoningiz.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm8-07-production-deploy-v1', lessonTitle: { uz: 'Production deploy: domen, SSL, monitoring', ru: 'Production deploy: домен, SSL, мониторинг' } };
// 18 ekran: kirish → reja → 4 tushuncha + 4 test (navbat bilan) → o'z domeni → yakuniy tartib → 3 amaliyot bloki → podium → kartochkalar → yakun (MD v3, 07-ProductionDeploy-v3.md)
const HW_TOKENS = [
  { t: { uz: 'domen', ru: 'домен' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: 'HTTPS', l: 70, tp: 16, s: 12, d: 7.5 },
  { t: '/health', l: 22, tp: 70, s: 12, d: 8.5 },
  { t: 'UptimeRobot', l: 72, tp: 68, s: 13, d: 6.8 }
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
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `s15` — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi — shu map ular bilan sinxron bo'lsin.
// ⚡ To'g'ri javob pozitsiyalari ATAYIN har xil (3 · 0 · 2 · 3) — «doim A» naqshi yo'q, o'qimay bosgan ball to'plamaydi.
// s15 (yakuniy debug) — REAL kalit: picked=0 → 1-urinishda topdi (to'g'ri), picked=1 → 1-urinishda xato bosdi.
const INLINE_KEYS = { s3: 1, s5: 3, s7: 0, s9: 2, s11: 0, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI); emoji o'rniga koddan bitta qator (S-026)
const RcKod = ({ children }) => <code className="qcode">{children}</code>;
const RECAPS = {
  3: {
    title: { uz: <>Nom o'zgarsa — <RcKod>WEB_ORIGIN</RcKod></>, ru: <>Имя изменилось — <RcKod>WEB_ORIGIN</RcKod></> },
    cards: [
      { ic: null, h: <RcKod>maydon-mahalla.netlify.app</RcKod>, body: { uz: 'Yangi nom — manzil ham yangi.', ru: "Новое имя — и адрес новый." } },
      { ic: null, h: <RcKod>WEB_ORIGIN=https://maydon-mahalla.netlify.app</RcKod>, body: { uz: "Render'da — Backend shu saytdan kelgan so'rovga ruxsat beradi.", ru: 'В Render — Backend разрешает запросы с этого сайта.' } },
      { ic: null, h: <RcKod>Vaqtlarni yuklab bo'lmadi</RcKod>, body: { uz: "Eski manzil qolsa — ruxsat ro'yxati (CORS) yangi saytni to'sadi.", ru: 'Если остался старый адрес — список разрешений (CORS) блокирует новый сайт.' }, ask: { uz: <>Nega <RcKod>VITE_API_URL</RcKod> ni o'zgartirmaymiz?</>, ru: <>Почему не меняем <RcKod>VITE_API_URL</RcKod>?</> } }
    ]
  },
  5: {
    title: { uz: "HTTPS yo'lni himoya qiladi", ru: 'HTTPS защищает путь' },
    cards: [
      { ic: null, h: <RcKod>http://</RcKod>, body: { uz: "Ochiq — yo'ldagi tarmoq matnni o'qiy oladi.", ru: 'Открыто — сеть на пути может прочитать текст.' } },
      { ic: null, h: <RcKod>https://</RcKod>, body: { uz: "Shifrlangan — yo'ldagi tarmoq mazmunini o'qiy olmaydi.", ru: 'Зашифровано — сеть на пути не может прочитать содержимое.' } },
      { ic: null, h: <RcKod>*.netlify.app</RcKod>, body: { uz: 'Sertifikat — Netlify HTTPS ni o\'zi yoqqan.', ru: 'Сертификат — Netlify сам включил HTTPS.' }, ask: { uz: "HTTPS bor saytda zaiflik bo'lishi mumkinmi?", ru: 'Может ли на сайте с HTTPS быть уязвимость?' } }
    ]
  },
  7: {
    title: { uz: <><RcKod>/health</RcKod> Backend'ni aytadi</>, ru: <><RcKod>/health</RcKod> сообщает о Backend</> },
    cards: [
      { ic: null, h: <RcKod>{"{ holat: 'ok' }"}</RcKod>, body: { uz: "Backend javob berdi — Database so'ralmadi.", ru: 'Backend ответил — Database не запрашивали.' } },
      { ic: null, h: { uz: <RcKod>≈ 400 soat</RcKod>, ru: <RcKod>≈ 400 часов</RcKod> }, body: { uz: "Eng kichik o'lchamda bepul Neon oyiga taxminan shuncha uyg'oq turadi.", ru: 'В самом малом размере бесплатный Neon не спит примерно столько часов в месяц.' } },
      { ic: null, h: { uz: <RcKod>har 5 daqiqa</RcKod>, ru: <RcKod>каждые 5 минут</RcKod> }, body: { uz: "Database ham so'ralsa, u o'chishga ulgurmaydi.", ru: 'Если спрашивать и Database, она не успевает уснуть.' }, ask: { uz: 'Database to\'xtasa, buni qayerdan bilamiz?', ru: 'Если Database остановится, откуда мы это узнаем?' } }
    ]
  },
  9: {
    title: { uz: 'Ikki monitor', ru: 'Два монитора' },
    cards: [
      { ic: null, h: <RcKod>maydon-mahalla.netlify.app</RcKod>, body: { uz: 'Sayt monitori — sahifa ochiladimi.', ru: 'Монитор сайта — открывается ли страница.' } },
      { ic: null, h: <RcKod>/health</RcKod>, body: { uz: 'Backend monitori — Backend javob beradimi.', ru: 'Монитор Backend — отвечает ли Backend.' } },
      { ic: null, h: <RcKod>Down</RcKod>, body: { uz: 'Ogohlantirish — email va telefon ilovasiga.', ru: 'Оповещение — на email и в приложение на телефоне.' }, ask: { uz: 'Faqat sayt monitori bo\'lsa, kechasi nimani bilmay qolamiz?', ru: 'Если есть только монитор сайта, чего мы не узнаем ночью?' } }
    ]
  },
  11: {
    title: { uz: "Ogohlantirish yo'li", ru: 'Путь оповещения' },
    cards: [
      { ic: null, h: <RcKod>Backend</RcKod>, body: { uz: 'Javob bermay qoladi.', ru: 'Перестаёт отвечать.' } },
      { ic: null, h: <RcKod>/health</RcKod>, body: { uz: "Javob kelmaydi — monitor «Down».", ru: 'Ответа нет — монитор «Down».' } },
      { ic: null, h: { uz: <RcKod>email · ilova</RcKod>, ru: <RcKod>email · приложение</RcKod> }, body: { uz: 'Ogohlantirish sizga keladi.', ru: 'Оповещение приходит вам.' }, ask: { uz: 'Monitoring bo\'lmasa, buni kim birinchi biladi?', ru: 'Если мониторинга нет, кто узнает об этом первым?' } }
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

// ===== BITTA VIZUAL — «Prod xaritasi» (163/180): PROD_TUGUNLAR → Telefon · SizTelefon · Tugun · RobotKarta · NetlifyKarta · DnsPanel · NeonKalendar; har ekran shu manbadan =====
// SABOQ 21–23: o'yinchi telefoni = sayt — doim CHAPDA, o'lchami barqaror (172×272), ustida «Sayt · Netlify» yorlig'i va sayt nomi; alohida «Sayt» qutisi yo'q;
// so'rov konverti telefondan uchadi. Chizma O'NGDA. Kam harakat rejimida konvert uchmaydi, soat yurmaydi — holat birdan almashadi (DE-200).
// qolip-maket: px-belgi px-origin
const cxx = (...a) => a.filter(Boolean).join(' ');
const kamHarakat = () => typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
// Kechikishlar ekrandan chiqilganda tozalanadi
const useKechik = () => {
  const ref = useRef([]);
  useEffect(() => () => ref.current.forEach(clearTimeout), []);
  return useCallback((fn, ms) => { ref.current.push(setTimeout(fn, ms)); }, []);
};
const NOMLAR = { eski: 'maydon-x7k2p9', yangi: 'maydon-mahalla', render: 'maydon-….onrender.com', domen: 'maydon-mahalla.uz' };
const sayt = (nom) => nom + '.netlify.app';
const HEALTH_JAVOB = { holat: 'ok' };
const HEALTH_JSON = JSON.stringify(HEALTH_JAVOB);
// Neon bepul rejasi (tayanch 6): ≈ 400 soat eng kichik o'lchamda; kechki — o'yinchilar keladigan soatlar (soddalashtirilgan hisob, faqat kalendar uchun)
const LIMIT_HISOB = { neonSoat: 400, kun: 30, soatKuniga: 24, kechki: 6 };
const TUN = { boshi: '22:00', toxtash: '23:10', bilindi: '07:40' };
const daqiqa = (s) => { const [h, m] = s.split(':').map(Number); return (h * 60 + m - 22 * 60 + 1440) % 1440; };
const soatMatn = (d) => { const m = (22 * 60 + d) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
const SOATLAR = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const XATO_MATN = { uz: "Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.", ru: 'Не удалось загрузить время. Попробуйте чуть позже.' };
const ULANMADI = { uz: "Saytga ulanib bo'lmadi", ru: 'Не удаётся подключиться к сайту' };
const PROD_TUGUNLAR = {
  sayt: { nom: { uz: 'Sayt · Netlify', ru: 'Сайт · Netlify' } },
  backend: { nom: 'Backend · Render', yollar: ['GET /', 'GET /health'] },
  db: { nom: 'Database · Neon' },
  robot: { nom: 'UptimeRobot', izoh: { uz: 'saytlarni kuzatadigan xizmat', ru: 'сервис, который следит за сайтами' } },
  wifi: { nom: { uz: 'bepul Wi-Fi', ru: 'бесплатный Wi-Fi' } },
  dns: { nom: 'DNS' },
  siz: { nom: { uz: 'Sizning telefoningiz', ru: 'Ваш телефон' } }
};
const MONITORLAR = [
  { k: 'sayt', nom: { uz: 'Maydon · sayt', ru: 'Maydon · сайт' }, url: sayt(NOMLAR.yangi) },
  { k: 'health', nom: 'Maydon · /health', url: NOMLAR.render + '/health' }
];
// Paydo bo'lgan qator ko'rinadigan joyga suriladi (qolip QTestJavob naqshi) — pastda qolib ketmasin
const useKorin = () => {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => { if (ref.current && ref.current.scrollIntoView) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 380); return () => clearTimeout(t); }, []);
  return ref;
};
const Joriy = ({ children }) => { const ref = useKorin(); return <p ref={ref} className="pd-joriy fade-step">{children}</p>; };

// Konvert (SABOQ 19): so'rov manbadan nishonga uchadi; joylar DOM dan o'lchanadi (⛶ kattalashganda ham to'g'ri)
const UCH_MS = 800;
const useKonvert = () => {
  const box = useRef(null);
  const kam = kamHarakat();
  const kechik = useKechik();
  const [uchlar, setUchlar] = useState([]);
  const uch = useCallback((manba, nishon, matn, tur, ms = UCH_MS) => {
    const b = box.current; if (kam || !b) return;
    const s = b.querySelector(manba), n = b.querySelector(nishon); if (!s || !n) return;
    const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
    const markaz = (el) => { const r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - br.left) / z, y: (r.top + r.height / 2 - br.top) / z }; };
    const dav = tur && tur.includes('qayt') ? Math.round(ms * 1.7) : ms;
    const u = { k: Math.random().toString(36).slice(2), matn, tur, a: markaz(s), b: markaz(n), dav };
    setUchlar(x => [...x, u]);
    kechik(() => setUchlar(x => x.filter(y => y.k !== u.k)), dav + 60);
  }, [kam, kechik]);
  return { box, uchlar, uch, kam, kechik };
};
const Konvert = ({ u }) => (
  <span className={cxx('pd-konvert', u.tur, !u.matn && 'nuqta')} aria-hidden="true"
    style={{ left: u.a.x + 'px', top: u.a.y + 'px', '--dx': (u.b.x - u.a.x) + 'px', '--dy': (u.b.y - u.a.y) + 'px', animationDuration: u.dav + 'ms' }}>{u.matn}</span>
);

// Bashorat (SABOQ 11/19): karta yengil ko'tarilib kiradi, variantlar navbat bilan chiqadi; tanlangach ixcham qatorga yig'iladi va natijagacha turadi
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="pd-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: fmtCode(tr(v.t)) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <div className="pd-taxmin"><span className="pd-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="pd-taxmin-s">{savol}</span><b>{fmtCode(tr((variantlar.find(v => v.k === tanlov) || {}).t))}</b></div>);
// Natija bloki (SABOQ 25): bitta yashil blok — birinchi qator taxmin, keyin atama, xulosa va qo'shimcha qator
const NatijaBlok = ({ tanlov, togri, variantlar, haqiqat, haqYorliq, izoh, xulosa, qoshimcha }) => {
  const tx = variantlar.find(v => v.k === tanlov);
  const ok = tanlov === togri;
  const ref = useKorin();
  return (
    <div ref={ref} className="q-xulosa pd-nb">
      {tx && <span className={cxx('pd-nb-t', ok && 'ok')}>{ok
        ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })}</>
        : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {fmtCode(tr(tx.t))} · {haqYorliq || tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{fmtCode(tr(haqiqat))}</b></>}</span>}
      {izoh && <span className="pd-nb-i">{izoh}</span>}
      <span>{xulosa}</span>
      {qoshimcha && <span className="pd-nb-q">{qoshimcha}</span>}
    </div>
  );
};

// Manzil qatori: «https://» alohida — telefon eniga sig'adi; chetida belgi (Chrome 117+: sozlama belgisi, logotipsiz chizma)
const Belgi = () => <span className="pd-belgi-i" aria-hidden="true"><i /><i /></span>;
const Manzil = ({ url }) => { const m = /^(https?:\/\/)(.*)$/.exec(url || ''); return m ? <><span className={cxx('pd-proto', m[1] === 'http://' && 'ochiq')}>{m[1]}</span><wbr />{m[2]}</> : url; };
const TelSahifa = ({ sahifa, kKey }) => {
  if (sahifa === 'bosh') return <div className="pd-sah bosh" aria-hidden="true"><i /><i /><i className="k" /><i className="k" /></div>;
  const tanlangan = sahifa === 'forma' ? '18:00' : null;
  if (sahifa === 'ulanmadi') return <div className="pd-sah ulanmadi fade-step"><span className="pd-ulan-i" aria-hidden="true" /><b>{tr(ULANMADI)}</b></div>;
  return (
    <div className="pd-sah">
      <b className="pd-sah-sar">Maydon</b>
      {sahifa !== 'forma' && <span className="pd-sah-kun">{tr({ uz: 'Bugun', ru: 'Сегодня' })}</span>}
      {sahifa === 'xato' ? <p className="pd-sah-xato fade-step">{tr(XATO_MATN)}</p>
        : sahifa === 'yuklanmoqda' ? <div className="pd-kataklar yukl" aria-hidden="true">{SOATLAR.map(s => <span key={s} className="pd-katak" />)}</div>
          : <div className="pd-kataklar" key={kKey}>{SOATLAR.map((s, i) => <span key={s} className={cxx('pd-katak', s === tanlangan && 'on')} style={{ '--i': i }}>{s}</span>)}</div>}
      {sahifa === 'forma' && <div className="pd-forma">
        <span className="pd-input"><small>{tr({ uz: 'Ism', ru: 'Имя' })}</small>Ali</span>
        <span className="pd-input"><small>{tr({ uz: 'Telefon', ru: 'Телефон' })}</small>+998 90 000 00 01</span>
        <span className="pd-band">{tr({ uz: 'Band qilish', ru: 'Забронировать' })}</span>
      </div>}
    </div>
  );
};
// O'yinchi telefoni = «Maydon» sayti: nom — «Sayt · Netlify» yorlig'idagi sayt nomi · faraz — manzil yonida kulrang yorliq · onBelgi — manzil chetidagi belgi bosiladi · panel — belgi paneli · children — telefon ostidagi harakat
const Telefon = ({ manzil, nom, faraz, onBelgi, belgiOn, sahifa = 'kataklar', kKey, panel, className, u, children }) => {
  const birinchi = useRef(manzil);
  return (
  <div className={cxx('pd-tel-ust', className)} data-u={u}>
    <span className="pd-tel-tex"><b>{tr(PROD_TUGUNLAR.sayt.nom)}</b>{nom && <code key={nom}>{nom}</code>}</span>
    <div className="pd-tel">
      <div className="pd-manzil">
        {onBelgi ? <button type="button" className={cxx('px-belgi', belgiOn && 'on', !belgiOn && 'pd-navbat')} onClick={onBelgi} aria-label={tr({ uz: 'Manzil chetidagi belgi', ru: 'Значок у адреса' })}><Belgi /></button>
          : <span className="pd-belgi-q"><Belgi /></span>}
        <span className={cxx('pd-manzil-t', birinchi.current !== manzil && 'yangi')} key={manzil}><Manzil url={manzil} /></span>
      </div>
      <div className="pd-tel-ekran">{faraz && <span className="pd-faraz">{tr({ uz: 'faraz', ru: "допустим" })}</span>}<TelSahifa sahifa={sahifa} kKey={kKey} /></div>
      {panel}
    </div>
    {children}
  </div>
  );
};
// Sizning telefoningiz — qulflangan ekran: soat, ogohlantirish kartalari (ilova, email); joy — uzuq chiziqli bo'sh joy (U-041)
const SizTelefon = ({ soat, xabarlar = [], joy, className, u }) => (
  <div className={cxx('pd-tel-ust', className)} data-u={u}>
    <span className="pd-tel-tex siz"><b>{tr(PROD_TUGUNLAR.siz.nom)}</b></span>
    <div className="pd-tel siz">
      <span className="pd-qulf-soat">{soat}</span>
      <div className="pd-xabarlar">
        {xabarlar.length === 0 && <span className="pd-xabar-yoq">{tr({ uz: "Yangi xabar yo'q", ru: 'Новых сообщений нет' })}</span>}
        {xabarlar.map(x => <div key={x.k} className={cxx('pd-xabar', x.holat)}><span className="pd-xabar-y"><i className={'pd-xi ' + x.tur} aria-hidden="true" />{x.tur === 'email' ? 'email' : tr({ uz: 'ilova', ru: 'приложение' })}</span><b>{tr(x.matn)}</b></div>)}
        {joy && xabarlar.length === 0 && <div className="pd-joy fade-step" aria-hidden="true" />}
      </div>
    </div>
  </div>
);
const Tugun = ({ nom, holat, belgi, children, className, u }) => (
  <div className={cxx('pd-tugun', holat, className)} data-u={u}>
    <div className="pd-tugun-b"><span className="pd-tugun-n">{nom}</span>{belgi && <span className={cxx('pd-holat', holat)} key={holat || 'h'}>{belgi}</span>}</div>
    {children}
  </div>
);
const Yollar = ({ yon }) => <div className="pd-yollar">{PROD_TUGUNLAR.backend.yollar.map(y => <code key={y} className={y === yon ? 'yon' : undefined}>{y}</code>)}</div>;
const OynaBar = ({ manzil, izoh }) => <div className="pd-oyna-bar"><i /><i /><i /><span>{manzil}</span>{izoh && <small>{izoh}</small>}</div>;
// UptimeRobot — chizilgan dashboard (logotipsiz): monitor qatori · manzil · 5 daqiqalik katakchalar · Up/Down
const RobotKarta = ({ qatorlar, izoh, className, u }) => (
  <div className={cxx('pd-robot', className)} data-u={u}>
    <OynaBar manzil={PROD_TUGUNLAR.robot.nom} izoh={izoh && tr(PROD_TUGUNLAR.robot.izoh)} />
    <ul className="pd-mon">
      {qatorlar.map(q => (
        <li key={q.k} className={cxx('pd-mon-q', q.holat, q.xira && 'xira')}>
          <div className="pd-mon-b"><b>{tr(q.nom)}</b><span className={cxx('pd-pill', q.holat)} key={q.holat}>{q.holat === 'down' ? 'Down' : 'Up'}</span></div>
          {q.url && <code className="pd-mon-url">{q.url}</code>}
          {q.urish && <div className="pd-urish">{q.urish.map((u, i) => <i key={i} className={u} />)}</div>}
          {q.yorliq && <span className="pd-mon-yorliq">{q.yorliq}</span>}
        </li>
      ))}
    </ul>
  </div>
);
const urishlar = (n, down = -1) => Array.from({ length: n }, (_, i) => (down >= 0 && i >= down ? 'd' : 'u'));
// Chrome paneli (namuna yozuv, 07-FILTR 9): «Connection is secure» · sertifikat
const ChromePanel = ({ className }) => (
  <div className={cxx('pd-panel', className)}>
    <b><i className="pd-qulf" aria-hidden="true" />Connection is secure</b>
    <span>{tr({ uz: 'sertifikat', ru: 'сертификат' })}: <code>*.netlify.app</code></span>
  </div>
);

// ===== SCREEN 0 — KIRISH (QKirish): tun — 23:10 da Backend to'xtaydi, ertalab o'yinchi ko'radi =====
const HOOK_OPTS = [
  { id: 'a', t: { uz: 'Siz — telefoningizga xabar keladi', ru: 'Вы — на телефон придёт сообщение' } },
  { id: 'b', t: { uz: "Ertalab saytni ochgan o'yinchi", ru: 'Игрок, открывший сайт утром' } },
  { id: 'c', t: { uz: "Maydon egasi — bandlar ro'yxatidan", ru: 'Владелец поля — по списку броней' } }
];
const HOOK_JAVOB = {
  a: { uz: <><b>Qiziq fikr!</b> Bu misolda telefoningizga xabar yuboradigan hech narsa yo'q — u jim qoladi.</>, ru: <><b>Интересная мысль!</b> В этом примере ничто не отправит сообщение на ваш телефон — он молчит.</> },
  b: { uz: <><b>Aynan!</b> Bu misolda «Maydon»ni hech narsa kuzatmayapti. Xatoni birinchi bo'lib ertalab sayt ochgan o'yinchi ko'radi.</>, ru: <><b>Именно!</b> В этом примере за «Maydon» ничто не следит. Ошибку первым видит игрок, открывший сайт утром.</> },
  c: { uz: <><b>Qiziq fikr!</b> Ega sahifasi ham o'sha Backend'dan so'raydi — ega ham uni ochgandagina ko'radi.</>, ru: <><b>Интересная мысль!</b> Страница владельца спрашивает тот же Backend — владелец увидит, только когда откроет её.</> }
};
// Tun chizig'i: soat + chiziq (boshidan oxirigacha), to'xtash belgisi; harakat tugmasi chiziqning o'zida (SABOQ 21)
const TunChizigi = ({ daq, oxiri, belgi, chap, ong, children }) => (
  <div className="pd-tun">
    <span className="pd-tun-soat">{soatMatn(daq)}</span>
    <div className="pd-tun-yol">
      <div className="pd-tun-iz"><span style={{ width: Math.min(100, (daq / oxiri) * 100) + '%' }} />{belgi != null && <i className="pd-tun-belgi" style={{ left: (belgi / oxiri) * 100 + '%' }} />}</div>
      <div className="pd-tun-ch"><span>{chap}</span><span>{ong}</span></div>
    </div>
    {children}
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { box, uchlar, uch, kam, kechik } = useKonvert();
  const T1 = daqiqa(TUN.toxtash), T2 = daqiqa(TUN.bilindi);
  const [bosq, setBosq] = useState(storedAnswer ? 4 : 0); // 0 kutish · 1 tun yuradi · 2 to'xtadi (variantlar ochiq) · 3 tong yuradi · 4 ertalab
  const [daq, setDaq] = useState(storedAnswer ? T2 : 0);
  const [sahifa, setSahifa] = useState(storedAnswer ? 'xato' : 'kataklar');
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const yur = (dan, gacha, qadam, ms, tugadi) => {
    if (kam) { setDaq(gacha); tugadi(); return; }
    let d = dan;
    const t = () => { d = Math.min(gacha, d + qadam); setDaq(d); if (d < gacha) kechik(t, ms); else tugadi(); };
    kechik(t, ms);
  };
  const boshla = () => { if (bosq) return; setBosq(1); yur(0, T1, 5, 150, () => { setBosq(2); setSc(n => n + 1); }); };
  const pick = (v) => {
    if (picked !== null || bosq < 2) return;
    setPicked(v); setSc(n => n + 1); setBosq(3);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    yur(T1, T2, 15, 60, () => {
      uch('[data-u="s0-tel"] .pd-tel', '[data-u="s0-be"]', 'GET /vaqtlar', 'qayt');
      kechik(() => { setSahifa('xato'); setBosq(4); setSc(n => n + 1); }, kam ? 0 : Math.round(UCH_MS * 1.7));
    });
  };
  const beXato = bosq >= 2 || daq >= T1;
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={bosq === 0 ? tr({ uz: 'Tunni boshlang', ru: 'Запустите ночь' }) : picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>«Maydon» kechasi yiqilsa, buni <span className="italic" style={{ color: T.accent }}>birinchi kim biladi</span>?</>, ru: <>Если «Maydon» упадёт ночью, <span className="italic" style={{ color: T.accent }}>кто узнает первым</span>?</> })}
        mentor={<Mentor>{tr({ uz: "O'yinchilar «Maydon»ni kechasi ham ochadi, siz esa uxlaysiz. Tunni boshlang va soatga qarang.", ru: 'Игроки открывают «Maydon» и ночью, а вы спите. Запустите ночь и смотрите на часы.' })}</Mentor>}
        maket={<div className="pd-s0" ref={box}>
          <TunChizigi daq={daq} oxiri={600} belgi={bosq >= 2 ? T1 : null} chap={TUN.boshi} ong="08:00">
            {bosq === 0 && <QTugma className="pd-navbat" onClick={boshla}>▶ {tr({ uz: 'Tunni boshlang', ru: 'Запустите ночь' })}</QTugma>}
          </TunChizigi>
          <div className="pd-uch">
            <Telefon u="s0-tel" manzil={sayt(NOMLAR.eski)} nom={NOMLAR.eski} sahifa={sahifa} />
            <div className="pd-orta">
              <i className="pd-chiziq" aria-hidden="true" />
              <Tugun u="s0-be" nom={PROD_TUGUNLAR.backend.nom} holat={beXato ? 'err' : undefined} belgi={beXato ? tr({ uz: 'javob bermayapti', ru: 'не отвечает' }) : null} />
              <i className="pd-pastga" aria-hidden="true" />
              <Tugun nom={PROD_TUGUNLAR.db.nom} />
            </div>
            <SizTelefon soat={soatMatn(daq)} joy={picked !== null} />
          </div>
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
        savol={tr({ uz: 'Buni birinchi kim biladi?', ru: 'Кто узнает об этом первым?' })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={bosq < 2}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Prod xaritasi» tayyor holatda, bir marta o'zi o'ynaydi =====
const REJA = [
  { t: { uz: 'Saytga eslab qoladigan nom', ru: 'Запоминающееся имя для сайта' }, teg: { uz: 'domen', ru: 'домен' } },
  { t: { uz: 'Ulanish shifrlanganini tekshirish', ru: 'Проверить, что соединение зашифровано' }, teg: 'SSL' },
  { t: { uz: "Backend o'z holatini aytadi", ru: 'Backend сообщает своё состояние' }, teg: '/health' },
  { t: { uz: 'Yiqilsa, ogohlantirish keladi', ru: 'Если упадёт — придёт оповещение' }, teg: { uz: 'monitoring', ru: 'мониторинг' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const { box, uchlar, uch, kam, kechik } = useKonvert();
  const [f, setF] = useState(kam ? 5 : 0); // 0 bo'sh · 1 sahifa ochildi · 2 /health Down · 3 ogohlantirish · 4 yana Up · 5 tinch
  const [urish, setUrish] = useState(10);
  useEffect(() => {
    if (kam) return;
    kechik(() => setF(1), 500);
    kechik(() => setUrish(11), 1400);
    kechik(() => { setF(2); setUrish(12); uch('[data-u="s1-robot"] .pd-mon-q:nth-child(2)', '[data-u="s1-be"]', '', 'nuqta qayt'); }, 2300);
    kechik(() => uch('[data-u="s1-robot"]', '[data-u="s1-siz"] .pd-tel', 'Down', 'ogoh'), 3200);
    kechik(() => setF(3), 3200 + UCH_MS);
    kechik(() => { setF(4); setUrish(13); }, 5000);
    kechik(() => setF(5), 5600);
  }, []); // eslint-disable-line
  const down = f === 2 || f === 3;
  const qator = (m) => ({ ...m, holat: m.k === 'health' && down ? 'down' : 'up', urish: urishlar(urish).map((u, i) => (m.k === 'health' && i === 11 ? 'd' : u)) });
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun «Maydon»ga <span className="italic" style={{ color: T.accent }}>nom, HTTPS va monitoring</span> berasiz.</>, ru: <>Сегодня вы дадите «Maydon» <span className="italic" style={{ color: T.accent }}>имя, HTTPS и мониторинг</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Internetdagi «Maydon»ni o'yinchilar ishlatadi — bu production, qisqasi prod. Dars oxirida u yiqilsa, ogohlantirish sizga keladi.", ru: "«Maydon» в интернете используют игроки — это production, коротко — прод. К концу урока: если он упадёт, оповещение придёт вам." })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida — «Maydon» shunday ishlaydi', ru: 'В конце урока «Maydon» работает так' })}
        chap={<div className="pd-uch pd-s1" ref={box}>
          <Telefon manzil={'https://' + sayt(NOMLAR.yangi)} nom={NOMLAR.yangi} sahifa={f >= 1 ? 'kataklar' : 'bosh'} kKey="s1" />
          <div className="pd-orta">
            <Tugun u="s1-be" nom={PROD_TUGUNLAR.backend.nom} holat={down ? 'err' : 'ok'} belgi={down ? '✕' : '✓'}><Yollar yon="GET /health" /></Tugun>
            <RobotKarta u="s1-robot" izoh qatorlar={MONITORLAR.map(qator)} />
          </div>
          <SizTelefon u="s1-siz" soat="23:15" xabarlar={f >= 3 ? [{ k: 'd', tur: 'ilova', holat: 'down', matn: 'Down · Maydon · /health' }] : []} />
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <div className="pd-reja-past"><p className="pd-reja-izoh">{tr({ uz: "Bepul rejalar uzluksiz ishlashni va'da qilmaydi: Render bepul xizmatni prod uchun tavsiya qilmaydi.", ru: "Бесплатные тарифы не обещают непрерывной работы: Render не рекомендует бесплатный сервис для прода." })}</p>
        <p className="pd-repo mono">{tr({ uz: 'repo', ru: 'репо' })} <code>maydon</code> · {tr({ uz: 'boshlanish', ru: 'начало' })} <code>m10-dars-07-start</code> · {tr({ uz: 'tayyor namuna', ru: 'готовый образец' })} <code>m10-dars-07-done</code></p></div>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA: sayt nomi va WEB_ORIGIN (bashorat + 3 qadam; harakat telefon ostida, WEB_ORIGIN qatori maketning o'zida) =====
const S2_SAVOL = { uz: 'Nom o\'zgargach, saytda vaqt kataklari chiqadimi?', ru: "После смены имени на сайте появятся ячейки времени?" };
const S2_TAXMIN = [{ k: 'ha', t: { uz: 'Ha, hammasi avvalgidek ishlaydi', ru: 'Да, всё работает как раньше' } }, { k: 'yoq', t: { uz: "Yo'q, yana nimadir yangilanadi", ru: 'Нет, нужно обновить что-то ещё' } }];
const S2_QADAM = [{ uz: 'Yangi nom yozing', ru: 'Напишите новое имя' }, { uz: 'Saytni oching', ru: 'Откройте сайт' }, { uz: '`WEB_ORIGIN` ni yangilang', ru: 'Обновите `WEB_ORIGIN`' }];
const NOM_QOIDA = /^[a-z0-9-]+$/;
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uch, kam, kechik } = useKonvert();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const savedNom = storedAnswer ? (storedAnswer.nom || NOMLAR.yangi) : null; // eski saqlovda nom bo'lmasa — Mentor misolidagi nom
  const [kirit, setKirit] = useState(savedNom ?? NOMLAR.eski);
  const [nom, setNom] = useState(savedNom); // saqlangan yangi nom
  const [n, setN] = useState(avval ? 3 : 0); // bajarilgan qadamlar
  const [yur, setYur] = useState(false);
  const [sahifa, setSahifa] = useState(avval ? 'kataklar' : 'kataklar');
  const [be, setBe] = useState(avval ? 'ok' : null); // null · err · deploy · ok
  const [origin, setOrigin] = useState('https://' + sayt(savedNom || NOMLAR.eski));
  const done = n >= 3;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin, nom }); }, [done]); // eslint-disable-line
  const k = kirit.trim();
  const xato = k.length > 0 && (!NOM_QOIDA.test(k) || k.length > 40);
  const togri = k.length > 0 && !xato && k !== NOMLAR.eski;
  const saqla = () => { if (!togri || n > 0) return; setNom(k); setSahifa('bosh'); setN(1); };
  const och = () => {
    if (yur || n !== 1) return;
    setYur(true); setSahifa('yuklanmoqda');
    kechik(() => uch('.pd-s2 .pd-tel', '[data-u="s2-be"]', 'GET /vaqtlar', 'qayt'), kam ? 0 : 200);
    kechik(() => setBe('err'), kam ? 0 : 200 + UCH_MS * 0.85);
    kechik(() => { setSahifa('xato'); setN(2); setYur(false); }, kam ? 0 : 200 + UCH_MS * 1.7);
  };
  const yangila = () => {
    if (yur || n !== 2) return;
    const yangi = 'https://' + sayt(nom);
    setYur(true); setOrigin(yangi); setBe('deploy');
    kechik(() => { setBe('ok'); setSahifa('yuklanmoqda'); uch('.pd-s2 .pd-tel', '[data-u="s2-be"]', 'GET /vaqtlar', 'ok'); }, kam ? 0 : 1300);
    kechik(() => uch('[data-u="s2-be"]', '[data-u="s2-db"]', '', 'nuqta ok', 500), kam ? 0 : 1300 + UCH_MS);
    kechik(() => uch('[data-u="s2-be"]', '.pd-s2 .pd-tel', '', 'nuqta ok', 600), kam ? 0 : 1300 + UCH_MS + 520);
    kechik(() => { setSahifa('kataklar'); setN(3); setYur(false); }, kam ? 0 : 1300 + UCH_MS + 1150);
  };
  const joriyNom = nom || NOMLAR.eski;
  const qi = Math.min(n, 2);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · sayt nomi', ru: 'Понятие · имя сайта' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Qadamlarni bajaring (${n}/3)`, ru: `Выполните шаги (${n}/3)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Tasodifiy manzil o'rniga <span className="italic" style={{ color: T.accent }}>qanday nom</span> qo'yasiz?</>, ru: <>Какое <span className="italic" style={{ color: T.accent }}>имя</span> поставите вместо случайного адреса?</> })}
        mentor={<Mentor>{tr({ uz: "Manzil boshidagi nomni Netlify o'zi tanlagan — o'yinchi uni eslab qololmaydi. Yangi nom yozing va saytni telefonda oching.", ru: 'Имя в начале адреса Netlify выбрал сам — игрок его не запомнит. Напишите новое имя и откройте сайт на телефоне.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="pd-sahna pd-s2" ref={box}>
          <div className="pd-ust-chap">
            <Telefon manzil={'https://' + sayt(joriyNom)} sahifa={sahifa} kKey={'k' + n} />
            {taxmin && !done && n >= 1 && <QTugma className={cxx('pd-tel-btn', !yur && 'pd-navbat')} disabled={yur} onClick={n === 1 ? och : yangila}>{fmtCode(tr(S2_QADAM[qi]))}<small className="pd-qn">{qi + 1}/3</small></QTugma>}
          </div>
          <div className="pd-yol" aria-hidden="true"><span>GET /vaqtlar</span><i /></div>
          <div className="pd-ust-ong">
            <div className={cxx('pd-netlify', taxmin && n === 0 && 'pd-navbat-k')}>
              <OynaBar manzil="app.netlify.com" />
              {taxmin && n === 0 && <span className="pd-qadam-y">{tr(S2_QADAM[0])}<small className="pd-qn">1/3</small></span>}
              <label className="pd-nl-l" htmlFor="pd-s2-nom">Project name</label>
              {n === 0 ? <>
                <div className="pd-nl-q">
                  <input id="pd-s2-nom" className={cxx('pd-nl-in', xato && 'xato')} value={kirit} placeholder="maydon-…" maxLength={40} autoComplete="off" spellCheck={false} disabled={!taxmin}
                    onChange={e => setKirit(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') saqla(); }} />
                  <QTugma onClick={saqla} disabled={!taxmin || !togri}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
                </div>
                {xato && <p className="q-xato">{tr({ uz: 'Faqat kichik lotin harf, raqam va chiziqcha.', ru: 'Только строчные латинские буквы, цифры и дефис.' })}</p>}
              </> : <code className="pd-nl-nom" key={joriyNom}>{joriyNom}</code>}
            </div>
            <Tugun u="s2-be" nom={PROD_TUGUNLAR.backend.nom} holat={be}
              belgi={be === 'err' ? tr({ uz: "ruxsat ro'yxatida yo'q", ru: 'нет в списке разрешений' }) : be === 'deploy' ? 'deploy…' : be === 'ok' ? '✓ 200' : null}>
              <button type="button" className={cxx('px-origin', n === 2 && !yur && 'pd-navbat', be === 'deploy' && 'yangi')} disabled={n !== 2 || yur} onClick={yangila}>
                <span className="px-origin-k">WEB_ORIGIN</span><code key={origin}>{origin}</code>
              </button>
              <Yollar />
            </Tugun>
            <i className="pd-pastga" aria-hidden="true" />
            <Tugun u="s2-db" nom={PROD_TUGUNLAR.db.nom} />
            {n === 1 && <Joriy>{tr({ uz: "Nom o'zgarsa, manzil ham o'zgaradi.", ru: 'Меняется имя — меняется и адрес.' })}</Joriy>}
            {n === 2 && <Joriy>{tr({ uz: "Backend'ning ruxsat ro'yxatida (CORS) hali eski manzil turibdi.", ru: 'В списке разрешений Backend (CORS) всё ещё старый адрес.' })}</Joriy>}
            {done && <NatijaBlok tanlov={taxmin} togri="yoq" variantlar={S2_TAXMIN} haqiqat={{ uz: '`WEB_ORIGIN` yangilangach chiqdi', ru: 'появились после обновления `WEB_ORIGIN`' }}
              xulosa={fmtCode(tr({ uz: "Netlify nomi o'zgarsa, manzil ham o'zgaradi. Yangi manzil Render'dagi `WEB_ORIGIN` ga yoziladi.", ru: 'Меняется имя в Netlify — меняется и адрес. Новый адрес записывается в `WEB_ORIGIN` в Render.' }))}
              qoshimcha={fmtCode(tr({ uz: "Bu manzil bepul: `….netlify.app` ning boshini o'zingiz tanlaysiz.", ru: 'Этот адрес бесплатный: начало `….netlify.app` вы выбираете сами.' }))} />}
          </div>
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — TEST 1 (INLINE_KEYS.s3 = 1, B) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Netlify'da sayt nomini o'zgartirdingiz. Yana nimani yangilaysiz?"
    question={tr({ uz: <h2 className="title h-ask">Netlify'da sayt nomini o'zgartirdingiz. <span className="italic" style={{ color: T.accent }}>Yana nimani</span> yangilaysiz?</h2>, ru: <h2 className="title h-ask">Вы сменили имя сайта в Netlify. <span className="italic" style={{ color: T.accent }}>Что ещё</span> обновите?</h2> })}
    options={[
      { uz: "Netlify'dagi `VITE_API_URL` qiymatini", ru: 'Значение `VITE_API_URL` в Netlify' },
      { uz: "Render'dagi `WEB_ORIGIN` qiymatini", ru: 'Значение `WEB_ORIGIN` в Render' },
      { uz: "Render'dagi `DATABASE_URL` qiymatini", ru: 'Значение `DATABASE_URL` в Render' },
      { uz: 'Saytdagi `api.js` faylidagi manzilni', ru: 'Адрес в файле `api.js` на сайте' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "`WEB_ORIGIN` — Backend ruxsat beradigan sayt manzili; u yangi nom bilan bir xil bo'lsin.", ru: '`WEB_ORIGIN` — адрес сайта, которому Backend даёт доступ; он должен совпадать с новым именем.' }}
    explainWrong={{
      0: { uz: '`VITE_API_URL` — Render manzili, u o\'zgarmadi.', ru: '`VITE_API_URL` — адрес Render, он не менялся.' },
      2: { uz: '`DATABASE_URL` — Neon manzili, sayt nomiga bog\'liq emas.', ru: '`DATABASE_URL` — адрес Neon, от имени сайта не зависит.' },
      3: { uz: "`api.js` Render manzilini oladi — u o'zgarmadi.", ru: '`api.js` берёт адрес Render — он не менялся.' },
      default: { uz: 'Backend ruxsat beradigan manzil yangilanadi.', ru: 'Обновляется адрес, которому Backend даёт доступ.' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA: HTTPS (bashorat + 3 qadam). Telefon → bepul Wi-Fi → Backend; konvert ochiq yoki qulfli yuradi =====
const S4_SAVOL = { uz: '`https://` bilan yuborilsa, Wi-Fi telefon raqamini ko\'radimi?', ru: 'Если отправить через `https://`, увидит ли Wi-Fi номер телефона?' };
const S4_TAXMIN = [{ k: 'ha', t: { uz: "Ha, ko'radi", ru: 'Да, увидит' } }, { k: 'yoq', t: { uz: "Yo'q, ko'rmaydi", ru: 'Нет, не увидит' } }];
const S4_QADAM = [{ uz: '`http://` bilan yuboring', ru: 'Отправьте через `http://`' }, { uz: '`https://` bilan yuboring', ru: 'Отправьте через `https://`' }, { uz: 'Manzil chetidagi belgini bosing', ru: 'Нажмите значок у адреса' }];
const OCHIQ_MATN = 'ism: Ali · telefon: +998 90 000 00 01';
const SHIFR_MATN = 'k3#9Qz…';
const WifiBelgi = () => <span className="pd-wifi-i" aria-hidden="true"><i /><i /><i /></span>;
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uch, kam, kechik } = useKonvert();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 3 : 0);
  const [yur, setYur] = useState(false);
  const [proto, setProto] = useState(avval ? 'https://' : 'http://');
  const [wifi, setWifi] = useState(avval ? 'shifr' : null); // null · ochiq · shifr
  const [be, setBe] = useState(avval); // Backend ma'lumotni oldi
  const [panel, setPanel] = useState(avval);
  const done = n >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const yubor = (shifr) => {
    setYur(true); setBe(false); setWifi(null);
    if (shifr) setProto('https://');
    const t0 = kam ? 0 : (shifr ? 350 : 150);
    kechik(() => uch('.pd-s4 .pd-tel', '.pd-wifi', shifr ? 'POST /bandlar' : 'POST /bandlar', shifr ? 'qulf' : 'ochiq'), t0);
    kechik(() => { setWifi(shifr ? 'shifr' : 'ochiq'); uch('.pd-wifi', '[data-u="s4-be"]', '', shifr ? 'nuqta ok' : 'nuqta', 650); }, kam ? 0 : t0 + UCH_MS);
    kechik(() => { setBe(true); setN(shifr ? 2 : 1); setYur(false); }, kam ? 0 : t0 + UCH_MS + 700);
  };
  const harakat = () => { if (yur) return; if (n === 0) yubor(false); else if (n === 1) yubor(true); };
  const belgi = () => { if (n !== 2 || yur) return; setPanel(true); setN(3); };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · HTTPS', ru: 'Понятие · HTTPS' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Qadamlarni bajaring (${n}/3)`, ru: `Выполните шаги (${n}/3)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Telefon raqami Backend'ga yetguncha <span className="italic" style={{ color: T.accent }}>kim ko'ra oladi</span>?</>, ru: <>Кто видит номер <span className="italic" style={{ color: T.accent }}>на пути к Backend</span>?</> })}
        mentor={<Mentor>{tr({ uz: "O'yinchi bepul Wi-Fi'dan ham band qilishi mumkin — unda so'rov begona tarmoqdan o'tadi. Ikki xil manzil bilan yuborib, Wi-Fi tugunida nima ko'rinishiga qarang.", ru: "Игрок может бронировать и через бесплатный Wi-Fi — тогда запрос идёт через чужую сеть. Отправьте через два разных адреса и посмотрите, что видно в узле Wi-Fi." })}</Mentor>}
        bashorat={<Bashorat savol={fmtCode(tr(S4_SAVOL))} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="pd-sahna pd-s4" ref={box}>
          <div className="pd-ust-chap">
            <Telefon manzil={proto + sayt(NOMLAR.yangi)} nom={NOMLAR.yangi} faraz={proto === 'http://'} sahifa="forma"
              onBelgi={taxmin && (n >= 2) ? belgi : undefined} belgiOn={panel}
              panel={panel && <ChromePanel className="fade-step" />} />
            {taxmin && !done && n < 2 && <QTugma className={cxx('pd-tel-btn', !yur && 'pd-navbat')} disabled={yur} onClick={harakat}>{fmtCode(tr(S4_QADAM[n]))}<small className="pd-qn">{n + 1}/3</small></QTugma>}
            {taxmin && !done && n === 2 && <span className="pd-tel-ipucha">{tr(S4_QADAM[2])}<small className="pd-qn">3/3</small></span>}
          </div>
          <div className="pd-yol" aria-hidden="true"><i /></div>
          <div className="pd-ust-ong">
            <div className="pd-s4-qator">
              <div className={cxx('pd-wifi', wifi)}>
                <div className="pd-tugun-b"><span className="pd-tugun-n"><WifiBelgi />{tr(PROD_TUGUNLAR.wifi.nom)}</span></div>
                <code className="pd-wifi-m" key={wifi || 'b'}>{wifi === 'ochiq' ? OCHIQ_MATN : wifi === 'shifr' ? SHIFR_MATN : '·'}</code>
              </div>
              <div className="pd-yol" aria-hidden="true"><i /></div>
              <Tugun u="s4-be" nom={PROD_TUGUNLAR.backend.nom} holat={be ? 'ok' : undefined}>
                <code className={cxx('pd-be-m', be && 'bor')} key={be ? 'b' + n : 'y'}>{be ? OCHIQ_MATN : '·'}</code>
              </Tugun>
            </div>
            {n === 2 && <Joriy>{tr({ uz: "Yo'lda o'qib bo'lmaydigan ko'rinishga aylantirish — shifrlash. Shifrlangan ulanish HTTPS deyiladi.", ru: "Превратить данные в вид, который в пути не прочитать, — это шифрование. Зашифрованное соединение называется HTTPS." })}</Joriy>}
            {done && <NatijaBlok tanlov={taxmin} togri="yoq" variantlar={S4_TAXMIN} haqiqat={{ uz: "ko'rmaydi", ru: 'не увидит' }}
              izoh={tr({ uz: 'HTTPS ni yoqadigan, shu manzil uchun berilgan hujjat — SSL sertifikati.', ru: 'Документ, выданный для этого адреса и включающий HTTPS, — SSL-сертификат.' })}
              xulosa={fmtCode(tr({ uz: "HTTPS bilan ma'lumot yo'lda shifrlangan. Netlify'ning `*.netlify.app` manzilida u o'zi yoqilgan.", ru: 'С HTTPS данные в пути зашифрованы. На адресе `*.netlify.app` Netlify включил его сам.' }))} />}
          </div>
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — TEST 2 (INLINE_KEYS.s5 = 3, D) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="«Maydon» HTTPS bilan ochiladi. Bu nimani bildiradi?"
    question={tr({ uz: <h2 className="title h-ask">«Maydon» HTTPS bilan ochiladi. Bu <span className="italic" style={{ color: T.accent }}>nimani bildiradi</span>?</h2>, ru: <h2 className="title h-ask">«Maydon» открывается по HTTPS. <span className="italic" style={{ color: T.accent }}>Что это значит</span>?</h2> })}
    options={[
      { uz: 'Saytda bironta zaiflik qolmaganini', ru: 'Что на сайте не осталось уязвимостей' },
      { uz: 'Sayt egasi ishonchli odam ekanini', ru: 'Что владелец сайта — надёжный человек' },
      { uz: 'Backend kechasi yiqilmasligini', ru: 'Что Backend ночью не упадёт' },
      { uz: "Ma'lumot yo'lda shifrlanganini", ru: 'Что данные в пути зашифрованы' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "HTTPS yo'ldagi ma'lumotni shifrlaydi — saytning o'zini tekshirmaydi.", ru: 'HTTPS шифрует данные в пути — сам сайт он не проверяет.' }}
    explainWrong={{
      0: { uz: "Zaiflik kodda yopiladi — HTTPS uni ko'rmaydi.", ru: 'Уязвимость закрывают в коде — HTTPS её не видит.' },
      1: { uz: 'HTTPS ulanishni himoya qiladi, egasini tekshirmaydi.', ru: 'HTTPS защищает соединение, а не проверяет владельца.' },
      2: { uz: 'Backend kechasi yiqilsa ham, manzil `https://` qoladi.', ru: 'Даже если Backend ночью упадёт, адрес останется `https://`.' },
      default: { uz: "HTTPS yo'ldagi ma'lumotni himoya qiladi.", ru: 'HTTPS защищает данные в пути.' }
    }} />
);

// ===== SCREEN 6 — TUSHUNCHA: /health va bepul Neon (bashorat + kalit + ikki holat). Telefon chapda, Backend → Database va oy kalendari o'ngda =====
const S6_SAVOL = { uz: "Har 5 daqiqada Database ham so'ralsa, bepul Neon oy oxirigacha yetadimi?", ru: 'Если каждые 5 минут спрашивать и Database, хватит ли бесплатного Neon до конца месяца?' };
const S6_TAXMIN = [{ k: 'ha', t: { uz: 'Ha, yetadi', ru: 'Да, хватит' } }, { k: 'yoq', t: { uz: "Yo'q, oy tugamasdan to'xtaydi", ru: 'Нет, остановится до конца месяца' } }];
const S6_KALIT = [{ k: 'db', t: { uz: "`/health` Database'ni ham so'raydi", ru: '`/health` спрашивает и Database' } }, { k: 'be', t: { uz: 'Faqat Backend javob beradi', ru: 'Отвечает только Backend' } }];
const LIMIT_KUN = Math.ceil(LIMIT_HISOB.neonSoat / LIMIT_HISOB.soatKuniga); // ≈ 17-kun
const kunSoat = (tur, kun) => (tur === 'db' ? Math.min(kun, LIMIT_KUN) * LIMIT_HISOB.soatKuniga : kun * LIMIT_HISOB.kechki);
const NeonKalendar = ({ tur, kun, sarlavha, className }) => {
  const toxtadi = tur === 'db' && kun >= LIMIT_KUN;
  const max = LIMIT_HISOB.kun * LIMIT_HISOB.soatKuniga;
  const soat = kunSoat(tur, kun);
  return (
    <div className={cxx('pd-kal', tur, toxtadi && 'toxtadi', className)}>
      {sarlavha && <span className="pd-kal-sar">{sarlavha}</span>}
      <span className="pd-kal-yorliq">{tr({ uz: 'soddalashtirilgan hisob', ru: 'упрощённый расчёт' })}</span>
      <div className="pd-kal-kun">{Array.from({ length: LIMIT_HISOB.kun }, (_, i) => <i key={i} className={cxx(i < Math.min(kun, toxtadi ? LIMIT_KUN : kun) && 'on', toxtadi && i >= LIMIT_KUN && 'off')} />)}</div>
      <div className="pd-kal-bar"><span style={{ width: Math.min(100, (soat / max) * 100) + '%' }} /><i style={{ left: (LIMIT_HISOB.neonSoat / max) * 100 + '%' }} /></div>
      <div className="pd-kal-past"><span>{tr({ uz: "uyg'oq soatlar", ru: "часы без сна" })} · <b key={soat}>{soat} {tr({ uz: 'soat', ru: 'ч' })}</b></span><span className="pd-kal-lim">{tr({ uz: 'bepul limit ≈ 400 soat', ru: 'бесплатный лимит ≈ 400 ч' })}</span></div>
    </div>
  );
};
const HealthKod = () => (
  <div className="pd-kod">
    <span className="pd-kod-f">app.controller.ts</span>
    <pre><At>@Get</At>(<St>'health'</St>){'\n'}<Kw>health</Kw>() {'{'}{'\n'}  <Kw>return</Kw> {'{'} holat: <St>'ok'</St> {'}'}{'\n'}{'}'}</pre>
    <p className="pd-kod-ost">{fmtCode(tr({ uz: "`/health` faqat Backend javob berayotganini aytadi — Database'ga so'rov yubormaydi.", ru: '`/health` сообщает только, что Backend отвечает, — запрос в Database не отправляет.' }))}</p>
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { kam, kechik } = useKonvert();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [kalit, setKalit] = useState(null);
  const [korildi, setKorildi] = useState(avval ? ['db', 'be'] : []);
  const [yur, setYur] = useState(null); // yurayotgan holat
  const [kun, setKun] = useState(0);
  const [oxirgi, setOxirgi] = useState(null); // oxirgi ko'rilgan holat — kalendar shu bilan turadi
  const done = korildi.length >= 2;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const boshla = () => {
    if (!kalit || yur || korildi.includes(kalit)) return;
    const tur = kalit; setYur(tur); setOxirgi(tur); setKun(0);
    const oxiri = tur === 'db' ? LIMIT_KUN : LIMIT_HISOB.kun;
    const tamom = () => { setYur(null); setKorildi(x => [...x, tur]); setKalit(null); };
    if (kam) { setKun(tur === 'db' ? LIMIT_HISOB.kun : LIMIT_HISOB.kun); tamom(); return; }
    let d = 0;
    const t = () => { d += 1; setKun(d); if (d < oxiri) kechik(t, 95); else if (tur === 'db') { setKun(LIMIT_HISOB.kun); kechik(tamom, 500); } else kechik(tamom, 300); };
    kechik(t, 250);
  };
  const tur = yur || oxirgi;
  const dbToxtadi = tur === 'db' && kun >= LIMIT_KUN;
  const sahifa = !done && dbToxtadi ? 'xato' : 'kataklar';
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Backend holati', ru: 'Понятие · состояние Backend' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Ikki holatni ko'ring (${korildi.length}/2)`, ru: `Посмотрите оба случая (${korildi.length}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <><code className="qcode">/health</code> Database'ni ham so'rasa, <span className="italic" style={{ color: T.accent }}>nima bo'ladi</span>?</>, ru: <>Что будет, если <code className="qcode">/health</code> <span className="italic" style={{ color: T.accent }}>спросит и Database</span>?</> })}
        mentor={<Mentor>{fmtCode(tr({ uz: "UptimeRobot `/health` ni har 5 daqiqada so'raydi. Kalitni tanlab, oy davomida bepul Database'ga nima bo'lishiga qarang.", ru: "UptimeRobot спрашивает `/health` каждые 5 минут. Выберите положение переключателя и посмотрите, что за месяц будет с бесплатной Database." }))}</Mentor>}
        bashorat={<Bashorat savol={tr(S6_SAVOL)} variantlar={S6_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className={cxx('pd-sahna pd-s6', done && 'tugadi')}>
          <div className="pd-ust-chap">
            <Telefon manzil={'https://' + sayt(NOMLAR.yangi)} nom={NOMLAR.yangi} sahifa={sahifa} kKey={'s6' + korildi.length} />
            {taxmin && !done && <QTugma className={cxx('pd-tel-btn', kalit && !yur && 'pd-navbat')} disabled={!kalit || !!yur} onClick={boshla}>{tr({ uz: 'Oyni boshlang', ru: 'Запустите месяц' })}<small className="pd-qn">{Math.min(2, korildi.length + 1)}/2</small></QTugma>}
          </div>
          <div className="pd-yol" aria-hidden="true"><i /></div>
          <div className="pd-ust-ong">
            {!done ? <>
              <Tugun nom={PROD_TUGUNLAR.backend.nom} holat="ok">
                <code className={cxx('pd-sorov', yur && 'yon')}>GET /health</code>
                {taxmin && <div className="pd-kalit">
                  {S6_KALIT.map(v => {
                    const bor = korildi.includes(v.k);
                    return <QChip key={v.k} holat={bor ? 'ok' : kalit === v.k ? 'on' : undefined} className={cxx(!bor && !kalit && !yur && 'pd-navbat')} disabled={bor || !!yur} onClick={() => setKalit(v.k)}>{bor ? '✓ ' : ''}{fmtCode(tr(v.t))}</QChip>;
                  })}
                </div>}
              </Tugun>
              <i className={cxx('pd-pastga', tur === 'db' && yur && 'yon', tur === 'be' && 'uzuk')} aria-hidden="true" />
              <Tugun nom={PROD_TUGUNLAR.db.nom} holat={dbToxtadi ? 'err' : undefined} belgi={dbToxtadi ? tr({ uz: "bepul limit tugadi — oy oxirigacha to'xtadi", ru: 'бесплатный лимит закончился — стоп до конца месяца' }) : null}>
                <NeonKalendar tur={tur || 'db'} kun={tur ? kun : 0} />
              </Tugun>
              {korildi.includes('db') && !yur && <Joriy>{tr({ uz: "Har so'rov Database'ni uyg'otadi. Soddalashtirilgan hisob: bepul Neon oyiga taxminan 400 soat uyg'oq turadi — oyga yetmaydi.", ru: 'Каждый запрос будит Database. Упрощённый расчёт: бесплатный Neon не спит около 400 часов в месяц — на месяц не хватит.' })}</Joriy>}
            </> : <>
              <div className="pd-s6-tugadi">
                <NeonKalendar tur="db" kun={LIMIT_HISOB.kun} sarlavha={fmtCode(tr(S6_KALIT[0].t))} />
                <NeonKalendar tur="be" kun={LIMIT_HISOB.kun} sarlavha={tr(S6_KALIT[1].t)} />
                <HealthKod />
              </div>
              <NatijaBlok tanlov={taxmin} togri="yoq" variantlar={S6_TAXMIN} haqiqat={{ uz: "oy tugamasdan to'xtaydi", ru: 'остановится до конца месяца' }} haqYorliq={tr({ uz: "hisob bo'yicha", ru: 'по расчёту' })}
                xulosa={fmtCode(tr({ uz: "Bizning `/health` Backend'ni aytadi, Database'ni uyg'otmaydi — monitoring bepul limitni sarflamaydi.", ru: 'Наш `/health` сообщает о Backend и не будит Database — мониторинг не тратит бесплатный лимит.' }))}
                qoshimcha={tr({ uz: 'Narxi: Database to\'xtasa, monitoring buni sezmaydi — buni dashboard va o\'yinchi sahifasi ko\'rsatadi.', ru: 'Цена: если Database остановится, мониторинг этого не заметит — это покажут дашборд и страница игрока.' })} />
            </>}
          </div>
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — TEST 3 (INLINE_KEYS.s7 = 0, A) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="UptimeRobot /health dan 200 oldi. Bu nimani bildiradi?"
    question={tr({ uz: <h2 className="title h-ask">UptimeRobot <code className="qcode">/health</code> dan 200 oldi. Bu <span className="italic" style={{ color: T.accent }}>nimani bildiradi</span>?</h2>, ru: <h2 className="title h-ask">UptimeRobot получил 200 от <code className="qcode">/health</code>. <span className="italic" style={{ color: T.accent }}>Что это значит</span>?</h2> })}
    options={[
      { uz: 'Backend ishlab turibdi va javob berdi', ru: 'Backend работает и ответил' },
      { uz: 'Database ham tekshirilib, ishlab turibdi', ru: 'Database тоже проверена и работает' },
      { uz: "Sayt Netlify'da xatosiz ochilib turibdi", ru: 'Сайт в Netlify открывается без ошибок' },
      { uz: 'Ega paroli `.env` faylida to\'g\'ri yozilgan', ru: 'Пароль владельца верно записан в `.env`' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Bizning `/health` faqat Backend'ni aytadi — Database'ni so'ramaydi.", ru: 'Наш `/health` сообщает только о Backend — Database он не спрашивает.' }}
    explainWrong={{
      1: { uz: "Bu `/health` Database'ga so'rov yubormaydi.", ru: 'Этот `/health` не отправляет запрос в Database.' },
      2: { uz: '`/health` — Backend manzili, saytni ochmaydi.', ru: '`/health` — адрес Backend, сайт он не открывает.' },
      3: { uz: 'Parolni `/health` emas, `POST /kirish` tekshiradi.', ru: 'Пароль проверяет не `/health`, а `POST /kirish`.' },
      default: { uz: "`/health` Backend'ni aytadi.", ru: '`/health` сообщает о Backend.' }
    }} />
);

// ===== SCREEN 8 — TUSHUNCHA: monitoring (bashorat + bitta oqim). Tepada soat; telefon chapda, UptimeRobot o'rtada, sizning telefoningiz o'ngda =====
const S8_SAVOL = { uz: 'Backend javob bermasa, qaysi monitor «Down» bo\'ladi?', ru: 'Если Backend не отвечает, какой монитор станет «Down»?' };
const S8_TAXMIN = [{ k: 'sayt', t: { uz: 'Sayt monitori', ru: 'Монитор сайта' } }, { k: 'health', t: { uz: '`/health` monitori', ru: 'Монитор `/health`' } }, { k: 'ikki', t: { uz: 'Ikkalasi ham', ru: 'Оба' } }];
const S8_OXIRI = 80; // 23:20 (22:00 dan daqiqa)
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uch, kam, kechik } = useKonvert();
  const avval = !!storedAnswer;
  const T1 = daqiqa(TUN.toxtash);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [bosq, setBosq] = useState(avval ? 3 : 0); // 0 kutish · 1 tun yuradi · 2 23:20, Down · 3 tiklandi
  const [yur, setYur] = useState(false);
  const [daq, setDaq] = useState(avval ? S8_OXIRI + 5 : 0);
  const [beOk, setBeOk] = useState(avval);
  const [hDown, setHDown] = useState(false);
  const [xab, setXab] = useState(avval ? 3 : 0); // ogohlantirishlar soni
  const [sahifa, setSahifa] = useState('kataklar');
  const done = bosq >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tun = () => {
    if (yur || bosq !== 0) return;
    setYur(true); setBosq(1);
    if (kam) { setDaq(S8_OXIRI); setHDown(true); setXab(2); setSahifa('xato'); setBosq(2); setYur(false); return; }
    let d = 0;
    const t = () => {
      d += 5; setDaq(d);
      if (d === T1 + 5) {
        uch('[data-u="s8-robot"] .pd-mon-q:nth-child(2)', '[data-u="s8-be"]', '', 'nuqta qayt', 500);
        kechik(() => { setHDown(true); uch('[data-u="s8-robot"]', '[data-u="s8-siz"] .pd-tel', 'Down', 'ogoh'); }, 850);
        kechik(() => setXab(1), 850 + UCH_MS);
        kechik(() => setXab(2), 1000 + UCH_MS);
        kechik(() => uch('.pd-s8 .pd-tel', '[data-u="s8-be"]', 'GET /vaqtlar', 'qayt', 600), 1150 + UCH_MS);
        kechik(() => { setSahifa('xato'); t(); }, 1200 + UCH_MS * 2);
        return;
      }
      if (d < S8_OXIRI) kechik(t, 230); else { setBosq(2); setYur(false); }
    };
    kechik(t, 300);
  };
  const tikla = () => {
    if (yur || bosq !== 2) return;
    setYur(true); setBeOk(true);
    kechik(() => { setDaq(S8_OXIRI + 5); uch('[data-u="s8-robot"] .pd-mon-q:nth-child(2)', '[data-u="s8-be"]', '', 'nuqta ok', 500); }, kam ? 0 : 700);
    kechik(() => { setHDown(false); uch('[data-u="s8-robot"]', '[data-u="s8-siz"] .pd-tel', 'Up', 'ogoh ok'); }, kam ? 0 : 1250);
    kechik(() => { setXab(3); setSahifa('kataklar'); setBosq(3); setYur(false); }, kam ? 0 : 1250 + UCH_MS);
  };
  const beXato = !beOk && daq >= T1;
  const n = Math.floor(daq / 5) + 1; // 5 daqiqalik so'rovlar soni (22:00 dan)
  const downDan = (T1 + 5) / 5; // 23:15 — javobsiz birinchi so'rov
  const qator = (m) => {
    const h = m.k === 'health';
    return { ...m, holat: h && hDown ? 'down' : 'up', urish: urishlar(n).map((x, i) => (h && i >= downDan && i < downDan + 2 ? 'd' : x)) };
  };
  const xabarlar = [
    { k: 'd1', tur: 'ilova', holat: 'down', matn: 'Down · Maydon · /health' },
    { k: 'd2', tur: 'email', holat: 'down', matn: 'Down · Maydon · /health' },
    { k: 'u1', tur: 'ilova', holat: 'up', matn: 'Up · Maydon · /health' }
  ].slice(0, xab);
  return (
    <Stage eyebrow={tr({ uz: 'Tajriba · monitoring', ru: "Опыт · мониторинг" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : bosq < 2 ? tr({ uz: 'Tunni boshlang', ru: 'Запустите ночь' }) : !done ? tr({ uz: "Backend'ni tiklang", ru: 'Восстановите Backend' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Sayt yiqilsa, buni siz <span className="italic" style={{ color: T.accent }}>qanday bilib qolasiz</span>?</>, ru: <>Если сайт упадёт, <span className="italic" style={{ color: T.accent }}>как вы об этом узнаете</span>?</> })}
        mentor={<Mentor>{tr({ uz: "UptimeRobot — saytlarni kuzatadigan xizmat: u ikki manzilni har 5 daqiqada so'raydi. Tunni boshlang va telefoningizga qarang.", ru: 'UptimeRobot — сервис, который следит за сайтами: он спрашивает два адреса каждые 5 минут. Запустите ночь и смотрите на свой телефон.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S8_SAVOL)} variantlar={S8_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="pd-s8" ref={box}>
          <div className="pd-uch">
            <Telefon manzil={'https://' + sayt(NOMLAR.yangi)} sahifa={sahifa} kKey={'s8' + bosq}>
              {taxmin && bosq === 0 && <QTugma className={cxx('pd-tel-btn', !yur && 'pd-navbat')} disabled={yur} onClick={tun}>▶ {tr({ uz: 'Tunni boshlang', ru: 'Запустите ночь' })}</QTugma>}
              {bosq === 2 && <QTugma className={cxx('pd-tel-btn', !yur && 'pd-navbat')} disabled={yur} onClick={tikla}>{tr({ uz: "Backend'ni tiklang", ru: 'Восстановите Backend' })}</QTugma>}
            </Telefon>
            <div className="pd-orta">
              {!done && <TunChizigi daq={daq} oxiri={S8_OXIRI + 10} belgi={daq >= T1 ? T1 : null} chap={TUN.boshi} ong="23:30" />}
              {!done && <Tugun u="s8-be" nom={PROD_TUGUNLAR.backend.nom} holat={beXato ? 'err' : 'ok'} belgi={beXato ? tr({ uz: 'javob bermayapti', ru: 'не отвечает' }) : '✓'} />}
              <RobotKarta u="s8-robot" qatorlar={MONITORLAR.map(qator)} />
              {done && <NatijaBlok tanlov={taxmin} togri="health" variantlar={S8_TAXMIN} haqiqat={{ uz: 'faqat `/health` monitori', ru: 'только монитор `/health`' }}
                izoh={tr({ uz: "Saytni to'xtovsiz kuzatish — monitoring. Yiqilganda keladigan xabar — ogohlantirish.", ru: 'Непрерывное наблюдение за сайтом — мониторинг. Сообщение при падении — оповещение.' })}
                xulosa={fmtCode(tr({ uz: "Sayt monitori sahifani, `/health` monitori Backend'ni so'raydi. Javob bo'lmasa — ogohlantirish keladi.", ru: 'Монитор сайта спрашивает страницу, монитор `/health` — Backend. Нет ответа — приходит оповещение.' }))}
                qoshimcha={tr({ uz: "Narxi: so'rovlar bepul Backend'ni uyg'oq tutishi mumkin — Render'ning 750 soatlik umumiy limitidan sarflanadi.", ru: 'Цена: запросы могут не давать бесплатному Backend уснуть — это расходует общий лимит Render в 750 часов.' })} />}
            </div>
            <SizTelefon u="s8-siz" soat={soatMatn(daq)} xabarlar={xabarlar} joy />
          </div>
          {bosq === 2 && <div className="pd-s8-joriy">
            <Joriy>{tr({ uz: "Saytni to'xtovsiz kuzatish — monitoring. Yiqilganda keladigan xabar — ogohlantirish.", ru: 'Непрерывное наблюдение за сайтом — мониторинг. Сообщение при падении — оповещение.' })}</Joriy>
            <QIzoh>{tr({ uz: "«Saytingiz hozir ochilyaptimi?» darsidagi o'lchagich va signal — shu monitoring va ogohlantirish.", ru: "Измеритель и сигнал из урока «Ваш сайт сейчас открывается?» — это и есть мониторинг и оповещение." })}</QIzoh>
          </div>}
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 4 (INLINE_KEYS.s9 = 2, C) — savol ustida kichik UptimeRobot kartasi (8-ekrandan boshqa: vaqt va soat yo'q) =====
const Screen9 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="Sayt monitori «Up», /health «Down». O'yinchi nimani ko'radi?"
    question={<>
      <RobotKarta className="pd-savol-robot" qatorlar={[{ k: 'sayt', nom: { uz: 'Maydon · sayt', ru: 'Maydon · сайт' }, holat: 'up' }, { k: 'health', nom: 'Maydon · /health', holat: 'down' }]} />
      {tr({ uz: <h2 className="title h-ask">Sayt monitori «Up», <code className="qcode">/health</code> «Down». O'yinchi <span className="italic" style={{ color: T.accent }}>nimani ko'radi</span>?</h2>, ru: <h2 className="title h-ask">Монитор сайта «Up», <code className="qcode">/health</code> «Down». <span className="italic" style={{ color: T.accent }}>Что увидит игрок</span>?</h2> })}
    </>}
    options={[
      { uz: 'Sahifa umuman ochilmaydi, ekran bo\'sh', ru: 'Страница вообще не откроется, экран пуст' },
      { uz: 'Hamma narsa odatdagidek ishlab turibdi', ru: 'Всё работает как обычно' },
      { uz: 'Sahifa ochiladi, vaqtlar yuklanmaydi', ru: 'Страница откроется, время не загрузится' },
      { uz: 'Faqat egasining sahifasi ochilmay qoladi', ru: 'Не откроется только страница владельца' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Sahifa Netlify'dan keladi, vaqtlar esa Backend'dan.", ru: 'Страница приходит из Netlify, а время — из Backend.' }}
    explainWrong={{
      0: { uz: "Sayt monitori «Up» — sahifa Netlify'dan kelyapti.", ru: 'Монитор сайта «Up» — страница приходит из Netlify.' },
      1: { uz: '`/health` «Down» — Backend javob bermayapti.', ru: '`/health` «Down» — Backend не отвечает.' },
      3: { uz: "O'yinchi sahifasi ham vaqtlarni o'sha Backend'dan oladi.", ru: 'Страница игрока тоже берёт время из того же Backend.' },
      default: { uz: "Sahifa Netlify'dan, vaqtlar Backend'dan keladi.", ru: 'Страница — из Netlify, время — из Backend.' }
    }} />
);

// ===== SCREEN 10 — TUSHUNCHA: o'z domeni — Mentor misoli (bashorat + 3 qadam). Telefon-brauzer → DNS → Netlify; domen sotuvchisi paneli =====
const S10_SAVOL = { uz: "Domen Netlify'ga qo'shilgach, sayt HTTPS bilan shu zahoti ochiladimi?", ru: 'Как только домен добавлен в Netlify, сайт сразу откроется по HTTPS?' };
const S10_TAXMIN = [{ k: 'ha', t: { uz: 'Ha, shu zahoti ochiladi', ru: 'Да, сразу откроется' } }, { k: 'yoq', t: { uz: "Yo'q, avval DNS, keyin sertifikat", ru: 'Нет, сначала DNS, потом сертификат' } }];
const S10_QADAM = [{ uz: "Domenni Netlify'ga qo'shing", ru: 'Добавьте домен в Netlify' }, { uz: "DNS yozuvini qo'shing", ru: 'Добавьте DNS-запись' }, { uz: 'Sertifikatni tekshiring', ru: 'Проверьте сертификат' }];
const DnsBelgi = () => <span className="pd-dns-i" aria-hidden="true" />;
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uch, kam, kechik } = useKonvert();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 3 : 0);
  const [yur, setYur] = useState(false);
  const [sahifa, setSahifa] = useState(avval ? 'kataklar' : 'bosh');
  const [dnsXato, setDnsXato] = useState(false);
  const done = n >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const harakat = () => {
    if (yur || done) return;
    setYur(true);
    if (n === 0) {
      kechik(() => uch('.pd-s10 .pd-tel', '.pd-dns', 'www.maydon-mahalla.uz', 'qayt'), kam ? 0 : 500);
      kechik(() => setDnsXato(true), kam ? 0 : 500 + UCH_MS * 0.85);
      kechik(() => { setSahifa('ulanmadi'); setN(1); setYur(false); }, kam ? 0 : 500 + UCH_MS * 1.7);
    } else if (n === 1) {
      setDnsXato(false); setN(2);
      kechik(() => setYur(false), kam ? 0 : 900);
    } else {
      kechik(() => uch('.pd-s10 .pd-tel', '.pd-dns', '', 'nuqta ok', 500), kam ? 0 : 700);
      kechik(() => uch('.pd-dns', '[data-u="s10-nl"]', '', 'nuqta ok', 500), kam ? 0 : 1250);
      kechik(() => { setSahifa('kataklar'); setN(3); setYur(false); }, kam ? 0 : 1850);
    }
  };
  const https = n >= 3;
  return (
    <Stage eyebrow={tr({ uz: "Mentor misoli · o'z domeni", ru: 'Пример ментора · свой домен' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Qadamlarni bajaring (${n}/3)`, ru: `Выполните шаги (${n}/3)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Sotib olingan domen saytga <span className="italic" style={{ color: T.accent }}>qanday ulanadi</span>?</>, ru: <>Как купленный домен <span className="italic" style={{ color: T.accent }}>подключается к сайту</span>?</> })}
        mentor={<Mentor>{tr({ uz: "Bugun bepul manzil yetadi, o'z domeni esa pullik — shuning uchun uni Mentor misolida ko'ramiz. Qadamlarni bajaring va brauzerdagi belgiga qarang.", ru: 'Сегодня хватит бесплатного адреса, а свой домен платный — поэтому смотрим его на примере ментора. Выполните шаги и смотрите на значок в браузере.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S10_SAVOL)} variantlar={S10_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="pd-sahna pd-s10" ref={box}>
          <div className="pd-ust-chap">
            <Telefon manzil={(https ? 'https://www.' : 'www.') + NOMLAR.domen} nom={NOMLAR.yangi} sahifa={sahifa} kKey={'s10' + n} />
            {taxmin && !done && <QTugma className={cxx('pd-tel-btn', !yur && 'pd-navbat')} disabled={yur} onClick={harakat}>{tr(S10_QADAM[n])}<small className="pd-qn">{n + 1}/3</small></QTugma>}
          </div>
          <div className="pd-yol" aria-hidden="true"><i /></div>
          <div className={cxx('pd-dns', n >= 2 && 'ok', dnsXato && 'err')}>
            <DnsBelgi />
            <b>{PROD_TUGUNLAR.dns.nom}</b>
            {n >= 2 && <span className="pd-dns-ok">✓</span>}
          </div>
          <div className={cxx('pd-yol', n >= 2 && 'ulandi')} aria-hidden="true"><i /></div>
          <div className="pd-ust-ong">
            <div className="pd-netlify" data-u="s10-nl">
              <OynaBar manzil="app.netlify.com" />
              <span className="pd-nl-sar">Domain management</span>
              <ul className="pd-domen">
                <li className="ok"><code>{sayt(NOMLAR.yangi)}</code><span className="pd-dh ok">✓</span></li>
                {n >= 1 && <li className={cxx('yangi', n >= 2 && 'ok')}><code>www.{NOMLAR.domen}</code>{n >= 2 ? <span className="pd-dh ok" key="ok">✓</span> : <span className="pd-dh kut" key="kut"><i className="pd-soat-i" aria-hidden="true" />Pending DNS verification</span>}</li>}
              </ul>
              {https && <span className="pd-https fade-step">HTTPS · Let's Encrypt ✓</span>}
            </div>
            <div className="pd-sotuvchi">
              <div className="pd-sot-b"><b>{tr({ uz: 'Domen sotuvchisi paneli', ru: 'Панель продавца домена' })}</b><span className="pd-sot-y">{tr({ uz: 'Mentor misoli · maket · vaqt tezlashtirilgan', ru: 'Пример ментора · макет · время ускорено' })}</span></div>
              {n >= 2 ? <div className="pd-yozuv fade-step"><code>www</code><span aria-hidden="true">→</span><code>{sayt(NOMLAR.yangi)}</code><small>{tr({ uz: 'yozuv turi: CNAME', ru: 'тип записи: CNAME' })}</small></div>
                : <div className="pd-yozuv bosh" aria-hidden="true" />}
            </div>
            {n === 2 && <Joriy>{tr({ uz: 'Domen qaysi saytga olib borishini aytadigan yozuv — DNS yozuvi. DNS manzilni shu yozuvdan topadi.', ru: 'Запись, которая говорит, к какому сайту ведёт домен, — DNS-запись. DNS находит адрес по этой записи.' })}</Joriy>}
          </div>
          {uchlar.map(u => <Konvert key={u.k} u={u} />)}
        </div>}
        natija={done && <NatijaBlok tanlov={taxmin} togri="yoq" variantlar={S10_TAXMIN} haqiqat={{ uz: "avval DNS domenni Netlify'ga olib boradi, keyin sertifikat tayyorlanadi", ru: 'сначала DNS ведёт домен в Netlify, потом готовится сертификат' }}
          izoh={tr({ uz: 'Domen qaysi saytga olib borishini aytadigan yozuv — DNS yozuvi. DNS manzilni shu yozuvdan topadi.', ru: 'Запись, которая говорит, к какому сайту ведёт домен, — DNS-запись. DNS находит адрес по этой записи.' })}
          xulosa={tr({ uz: "DNS domenni Netlify'ga olib borgach, Netlify sertifikatni o'zi oladi. Bunga vaqt ketishi mumkin.", ru: 'Когда DNS приведёт домен в Netlify, Netlify сам получит сертификат. На это может уйти время.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 11 — YAKUNIY TARTIB (QTartib, sentinel 0; ball — birinchi to'liq urinish) =====
const FINAL_BOLAKLAR = [
  { id: 'f1', label: { uz: 'Backend javob bermay qoladi', ru: 'Backend перестаёт отвечать' } },
  { id: 'f2', label: { uz: 'UptimeRobot `/health` ni so\'raydi', ru: 'UptimeRobot спрашивает `/health`' } },
  { id: 'f3', label: { uz: 'Javob kelmaydi', ru: 'Ответ не приходит' } },
  { id: 'f4', label: { uz: '`/health` monitori «Down» bo\'ladi', ru: 'Монитор `/health` становится «Down»' } },
  { id: 'f5', label: { uz: 'Email va ilovaga ogohlantirish keladi', ru: 'На email и в приложение приходит оповещение' } }
];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
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
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'Backend to\'xtasa, ogohlantirish sizga qanday yetadi?', options: FINAL_BOLAKLAR.map(z => ou(z.label)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · tartib', ru: 'Итог · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Tartibni yig'ing", ru: 'Соберите порядок' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Backend to'xtasa, ogohlantirish <span className="italic" style={{ color: T.accent }}>sizga qanday yetadi</span>?</>, ru: <>Если Backend упадёт, <span className="italic" style={{ color: T.accent }}>как придёт оповещение</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni sodir bo'lish tartibida joylang.", ru: 'Разложите блоки в порядке, в котором всё происходит.' })}</Mentor>
        <Zoomable>
          <QTartib onWrong={onWrong}
            items={FINAL_BOLAKLAR.map(z => ({ id: z.id, label: fmtCode(tr(z.label)) }))}
            joyMatn={tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}
            onSolved={solve}
            xatoMatn={tr({ uz: "Tartib xato — bo'lakni bosib qaytaring.", ru: 'Порядок неверный — нажмите на блок, чтобы вернуть его.' })}
          />
        </Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{fmtCode(tr({ uz: "Ogohlantirish shu tartibda yetadi: Backend to'xtaydi, `/health` javob bermaydi, UptimeRobot sizga xabar beradi.", ru: 'Оповещение доходит в таком порядке: Backend останавливается, `/health` не отвечает, UptimeRobot сообщает вам.' }))}</p>
          {wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 NISHONLAR (5) — inglizcha nom, o'zbekcha tavsif; bonus — bitta (Night Watch, A3 oxirgi «Bajardim») =====
const ACHIEVEMENTS = {
  rightOrigin: { icon: '🔗', name: 'Right Origin', desc: { uz: "Nom o'zgargach WEB_ORIGIN ni yangilashni bildingiz", ru: 'Вы знаете, что после смены имени нужно обновить WEB_ORIGIN' } },
  secureLine: { icon: '🔒', name: 'Secure Line', desc: { uz: 'HTTPS nimani himoya qilishini bildingiz', ru: 'Вы знаете, что защищает HTTPS' } },
  healthCheck: { icon: '💚', name: 'Health Check', desc: { uz: '/health javobi nimani bildirishini bildingiz', ru: 'Вы знаете, что означает ответ /health' } },
  twoMonitors: { icon: '📟', name: 'Two Monitors', desc: { uz: "Ikki monitor holatini to'g'ri o'qidingiz", ru: 'Вы верно прочитали состояние двух мониторов' } },
  nightWatch: { icon: '🌙', name: 'Night Watch', desc: { uz: 'Uch amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили три практических блока до конца' } }
};
// Ekran id → nishon: testlar (birinchi urinish) + A3 oxirgi «Bajardim» (bonus)
const ACH_TRIGGERS = { s3: 'rightOrigin', s5: 'secureLine', s7: 'healthCheck', s9: 'twoMonitors', a3: 'nightWatch' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 7, 9, 11)
const Q_LABELS = {
  3: { uz: '1 — Yangi nom va WEB_ORIGIN', ru: '1 — Новое имя и WEB_ORIGIN' },
  5: { uz: '2 — HTTPS nimani bildiradi', ru: '2 — Что означает HTTPS' },
  7: { uz: '3 — /health 200', ru: '3 — /health 200' },
  9: { uz: '4 — Ikki monitor', ru: '4 — Два монитора' },
  11: { uz: "Yakuniy — ogohlantirish yo'li", ru: 'Итог — путь оповещения' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod so'zi o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: 'HTTPS',        l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: '/health',      l: 82, t: 8,  s: 28, d: 23, dl: 1.5 },
  { ch: 'UptimeRobot',  l: 6,  t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: 'Down',         l: 78, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: 'WEB_ORIGIN',   l: 42, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'domen', ru: 'домен' }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: 'SSL',          l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: 'DNS',          l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: '.netlify.app', l: 56, t: 52, s: 20, d: 22, dl: 0.6 },
  { ch: 'Up',           l: 90, t: 40, s: 22, d: 24, dl: 1.4 },
  { ch: { uz: 'monitoring', ru: 'мониторинг' }, l: 34, t: 62, s: 20, d: 26, dl: 2.5 },
  { ch: { uz: 'bepul limit', ru: 'бесплатный лимит' }, l: 70, t: 84, s: 18, d: 20, dl: 3.1 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
const QUIZ_BANK = [
  { q: { uz: 'Netlify sayt nomi nimani o\'zgartiradi?', ru: 'Что меняет имя сайта в Netlify?' }, opts: [{ uz: 'Netlify manzilining boshini', ru: 'Начало адреса в Netlify' }, { uz: "Render'dagi Backend manzilini ham", ru: 'И адрес Backend в Render' }, { uz: "Database'dagi jadvallarning nomini", ru: 'Названия таблиц в Database' }, { uz: 'Saytdagi «Band qilish» tugmasi matnini', ru: 'Текст кнопки «Band qilish» на сайте' }], correct: 0 },
  { q: { uz: 'Sayt nomi o\'zgargach kataklar chiqmadi. Sabab nima?', ru: "После смены имени сайта ячейки не появились. Почему?" }, opts: [{ uz: "Database'dagi bandlar o'chib ketgan", ru: 'Брони в Database удалились' }, { uz: 'WEB_ORIGIN da eski manzil qolgan', ru: 'В WEB_ORIGIN остался старый адрес' }, { uz: 'Netlify DNS ni hali yangilamagan', ru: 'Netlify ещё не обновил DNS' }, { uz: 'Brauzer yangi nomni tanimagan', ru: 'Браузер не узнал новое имя' }], correct: 1 },
  { q: { uz: "Render'dagi WEB_ORIGIN nima uchun kerak?", ru: 'Зачем нужен WEB_ORIGIN в Render?' }, opts: [{ uz: "Database'ga ulanish manzilini saqlash", ru: 'Хранить адрес подключения к Database' }, { uz: 'Ega parolini tekshirib, token berish', ru: 'Проверять пароль владельца и выдавать токен' }, { uz: "Sayt so'roviga ruxsat berish uchun", ru: 'Чтобы разрешать запросы сайта' }, { uz: 'Monitor intervalini belgilab berish', ru: 'Задавать интервал монитора' }], correct: 2 },
  { q: { uz: "Manzil https:// bilan bo'lsa, yo'ldagi Wi-Fi nimani ko'radi?", ru: 'Если адрес с https://, что видит Wi-Fi на пути?' }, opts: [{ uz: 'Ism va telefonni ochiq matnda', ru: 'Имя и телефон открытым текстом' }, { uz: "Faqat telefon raqamini ko'radi", ru: 'Видит только номер телефона' }, { uz: "Hech qanday so'rov o'tmaydi", ru: 'Ни один запрос не проходит' }, { uz: "O'qib bo'lmaydigan ma'lumotni", ru: 'Нечитаемые данные' }], correct: 3 },
  { q: { uz: 'SSL sertifikati nima qiladi?', ru: 'Что делает SSL-сертификат?' }, opts: [{ uz: 'Saytda HTTPS ni yoqadi', ru: 'Включает HTTPS на сайте' }, { uz: 'Saytni tezroq ochadi', ru: 'Открывает сайт быстрее' }, { uz: "Database'ni himoya qiladi", ru: 'Защищает Database' }, { uz: 'CORS ruxsatini o\'zi beradi', ru: 'Сам даёт разрешение CORS' }], correct: 0 },
  { q: { uz: '*.netlify.app manzilida HTTPS ni kim yoqadi?', ru: 'Кто включает HTTPS на адресе *.netlify.app?' }, opts: [{ uz: "O'quvchi sertifikat sotib oladi", ru: 'Ученик покупает сертификат' }, { uz: "Netlify uni o'zi yoqib qo'yadi", ru: 'Netlify включает его сам' }, { uz: 'Render WEB_ORIGIN orqali yoqadi', ru: 'Render включает через WEB_ORIGIN' }, { uz: 'UptimeRobot monitor orqali yoqadi', ru: 'UptimeRobot включает через монитор' }], correct: 1 },
  { q: { uz: "O'z domenida sertifikat qachon olinadi?", ru: 'Когда получают сертификат для своего домена?' }, opts: [{ uz: 'Domen sotib olingan zahotiyoq', ru: 'Сразу после покупки домена' }, { uz: 'WEB_ORIGIN yangilangan zahoti', ru: 'Сразу после обновления WEB_ORIGIN' }, { uz: "DNS yozuvi to'g'ri bo'lgach", ru: 'Когда DNS-запись верна' }, { uz: "Birinchi monitor qo'shilgach", ru: 'После добавления первого монитора' }], correct: 2 },
  { q: { uz: 'Database javob bermasa, GET / nima qaytaradi?', ru: 'Если Database не отвечает, что вернёт GET /?' }, opts: [{ uz: '503 — xizmat hozir ishlay olmaydi', ru: '503 — сервис сейчас не может работать' }, { uz: "404 — bunday yo'l Backend'da yo'q", ru: '404 — такого пути в Backend нет' }, { uz: '401 — avval parol bilan kiring', ru: '401 — сначала войдите с паролем' }, { uz: '200 — «Maydon Backend ishlayapti»', ru: '200 — «Maydon Backend ishlayapti»' }], correct: 3 },
  { q: { uz: "/health nega Database'ni so'ramaydi?", ru: 'Почему /health не спрашивает Database?' }, opts: [{ uz: 'Bepul Database limiti tugamasin', ru: 'Чтобы не кончился бесплатный лимит Database' }, { uz: "Database'ni Backend ko'rmaydi", ru: 'Backend не видит Database' }, { uz: 'Database javobi juda sekin keladi', ru: 'Ответ Database приходит слишком медленно' }, { uz: "UptimeRobot SQL'ni bilmaydi", ru: 'UptimeRobot не знает SQL' }], correct: 0 },
  { q: { uz: "Bepul UptimeRobot manzilni necha daqiqada so'raydi?", ru: 'Как часто бесплатный UptimeRobot спрашивает адрес?' }, opts: [{ uz: 'Har bir daqiqada', ru: 'Каждую минуту' }, { uz: 'Har 5 daqiqada', ru: 'Каждые 5 минут' }, { uz: 'Har bir soatda', ru: 'Каждый час' }, { uz: 'Kuniga bir marta', ru: 'Раз в день' }], correct: 1 },
  { q: { uz: 'Bepul rejada ogohlantirish qayerga keladi?', ru: 'Куда приходит оповещение на бесплатном тарифе?' }, opts: [{ uz: 'Telegram botiga va guruhiga', ru: 'В Telegram-бот и группу' }, { uz: "Tekin SMS va qo'ng'iroq bilan", ru: 'Бесплатными SMS и звонком' }, { uz: 'Email va telefon ilovasiga', ru: 'На email и в приложение на телефоне' }, { uz: 'Render boshqaruv sahifasiga', ru: 'На страницу управления Render' }], correct: 2 },
  { q: { uz: "UptimeRobot so'rovlari bepul Render'ga qanday ta'sir qiladi?", ru: 'Как запросы UptimeRobot влияют на бесплатный Render?' }, opts: [{ uz: 'Backend sekinlashib qoladi', ru: 'Backend замедляется' }, { uz: 'Render pullik bo\'lib qoladi', ru: 'Render становится платным' }, { uz: "Database to'lib qoladi", ru: 'Database переполняется' }, { uz: 'Backend uxlab qolmaydi', ru: 'Backend не засыпает' }], correct: 3 },
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
    // Arena tokenlari — SHU darsning mavzusidan (domen, SSL, monitoring): suzuvchi kod-bo'laklari
    const TOK = ['HTTPS', 'SSL', '/health', 'UptimeRobot', 'WEB_ORIGIN', 'DNS', 'Up', 'Down', '.netlify.app', 'prod'];
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
// Har blok — ScreenBlok'ga ma'lumot: steps [{ h, t, prompt?: [satr], kimga?, err? }] · natija(tugadi) — kutilgan natija maketi · ortda + ortdaIzoh (M-q7/q8).
// «Ortda qoldingizmi»: birinchi blokda m10-dars-07-start, keyingilarida m10-dars-07-done. Signal 500+ zonasida — faqat mentor ko'radi (MentorPracticeStats).
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda = [], ortdaIzoh, doneText }) {
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
  const ortdaQator = ortdaIzoh ? [...ortda, <span key="iz" className="pd-ortda-iz">{fmtCode(tr(ortdaIzoh))}</span>] : ortda;
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({ h: fmtCode(tr(c.h)), t: fmtCode(tr(c.t)), prompt: c.prompt && c.prompt.map(l => tr(l)), kimga: c.prompt && tr(c.kimga || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }), xato: c.err && fmtCode(tr(c.err)) }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={doneText && tr(doneText)} natija={natija(done)} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortdaQator}
        pastki={<MentorPracticeStats live={_live} screen={screen} />} />
    </Stage>
  );
}
const ORTDA_FETCH = 'git fetch https://github.com/Azizbekcrypto/maydon --tags';
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon', ru: 'ожидаемый результат · образец: Maydon' };
const XATO_YOLI = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
const QADAM_GOYA = { uz: "O'z g'oyangiz", ru: 'Ваша идея' };
// Yashil yakun: asosiy gap + ostida bitta kulrang qator (QIzoh) — bitta natija bloki (SABOQ 25)
const Tugadi = ({ asosiy, izoh }) => <>{fmtCode(tr(asosiy))}{izoh && <span className="pd-tugadi-iz">{fmtCode(tr(izoh))}</span>}</>;
// Render · Environment qatori (kutilgan natija maketi)
const RenderQator = () => (
  <div className="pd-render">
    <OynaBar manzil="render.com · Environment" />
    <div className="pd-env"><span>WEB_ORIGIN</span><code>{'https://' + sayt(NOMLAR.yangi)}</code></div>
  </div>
);
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · sayt nomi', ru: 'Практика 1 · имя сайта' }}
    title={{ uz: <>«Maydon»ga <span className="italic" style={{ color: T.accent }}>eslab qoladigan manzil</span> bering.</>, ru: <>Дайте «Maydon» <span className="italic" style={{ color: T.accent }}>запоминающийся адрес</span>.</> }}
    mentor={{ uz: <>Bu blokda kod yo'q — sozlamani o'zingiz o'zgartirasiz, natijani telefonda tekshirasiz. <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>В этом блоке кода нет — вы сами меняете настройку и проверяете результат на телефоне. Начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "app.netlify.com'da `maydon` loyihangizni oching. Telefonda hozirgi `….netlify.app` manzilini oching — kataklar chiqsin.", ru: "Откройте свой проект `maydon` на app.netlify.com. На телефоне откройте текущий адрес `….netlify.app` — должны появиться ячейки." }, err: { uz: "Loyiha Netlify'da yo'q bo'lsa — `README.md` dagi «Internetga chiqarish» bo'limi bo'yicha avval chiqaring.", ru: 'Если проекта нет в Netlify — сначала опубликуйте его по разделу «Internetga chiqarish» в `README.md`.' } },
      { h: { uz: 'Sayt nomi', ru: 'Имя сайта' }, t: { uz: "Netlify'da loyiha nomini o'zgartirish joyini oching (hozir: «Project overview» → «Customize» → «Manage project name and cover image»). Yangi nom: `maydon-` va o'zingiz tanlagan so'z (kichik lotin harf, raqam, chiziqcha). Saqlang — manzil `https://{yangi nom}.netlify.app` bo'ladi.", ru: 'Откройте в Netlify место смены имени проекта (сейчас: «Project overview» → «Customize» → «Manage project name and cover image»). Новое имя: `maydon-` и ваше слово (строчные латинские буквы, цифры, дефис). Сохраните — адрес станет `https://{новое имя}.netlify.app`.' }, err: { uz: "Nom band bo'lsa, Netlify uni qabul qilmaydi — oxiriga raqam qo'shing.", ru: 'Если имя занято, Netlify его не примет — добавьте в конце цифру.' } },
      { h: { uz: '`WEB_ORIGIN`', ru: '`WEB_ORIGIN`' }, t: { uz: "telefonda yangi manzilni oching: «Vaqtlarni yuklab bo'lmadi» — kutilgan holat. render.com'da Backend'ingiz → o'zgaruvchilar bo'limi («Environment») → `WEB_ORIGIN` qiymatini yangi manzilga almashtiring (`https://` bilan) → saqlash ro'yxatidan qayta deploy qiladiganini tanlang (hozir: «Save and deploy»). Deploy tugagach sahifani yangilang — kataklar chiqadi.", ru: "откройте на телефоне новый адрес: «Vaqtlarni yuklab bo'lmadi» — так и должно быть. На render.com ваш Backend → раздел переменных («Environment») → замените значение `WEB_ORIGIN` на новый адрес (с `https://`) → в списке сохранения выберите вариант с повторным деплоем (сейчас: «Save and deploy»). Когда деплой закончится, обновите страницу — появятся ячейки." }, err: { uz: "Chiqmasa — `WEB_ORIGIN` dagi nom Netlify'dagi bilan harfma-harf bir xilmi, qarang.", ru: 'Если не появились — проверьте, что имя в `WEB_ORIGIN` буква в букву совпадает с Netlify.' } },
      { h: { uz: 'HTTPS tekshiruvi', ru: 'Проверка HTTPS' }, t: { uz: "yangi manzil `https://` bilan ochilsin. Manzil qatori chetidagi belgini bosing: brauzer ulanish xavfsiz ekanini ko'rsatsin, ogohlantirish bo'lmasin (Chrome'da masalan «Connection is secure»; boshqa brauzer va tilda yozuv boshqacha).", ru: "новый адрес должен открываться с `https://`. Нажмите значок у адресной строки: браузер должен показать, что соединение безопасно, без предупреждений (в Chrome, например, «Connection is secure»; в других браузерах и языках надпись другая)." } },
      { h: QADAM_GOYA, t: { uz: "o'z MVP ingiz Netlify'da bo'lsa, uyda unga ham nom bering va Backend'ingizning ruxsat ro'yxatini (CORS) yangi manzilga moslang. Internetda bo'lmasa — «Bajardim»ni bosing.", ru: 'если ваш MVP есть в Netlify, дома дайте и ему имя и настройте список разрешений (CORS) вашего Backend на новый адрес. Если его нет в интернете — нажмите «Готово».' } }
    ]}
    natijaYorliq={NATIJA_YORLIQ}
    natija={(tugadi) => <div className={cxx('pd-natija', tugadi && 'tugadi')}>
      <Telefon manzil={'https://' + sayt(NOMLAR.yangi)} nom={NOMLAR.yangi} kKey="a1" />
      <div className="pd-natija-ong">
        <RenderQator />
        <ChromePanel className="pd-panel-st" />
        <span className="pd-namuna-y">{tr({ uz: 'Chrome · namuna yozuv', ru: 'Chrome · пример надписи' })}</span>
      </div>
    </div>}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-07-start']}
    ortdaIzoh={{ uz: "(bu blok repo'ni o'zgartirmaydi — Netlify va Render sozlamalari o'zingizda)", ru: '(этот блок не меняет репо — настройки Netlify и Render у вас)' }}
    doneText={<Tugadi asosiy={{ uz: 'Yangi manzil ishlayapti: kataklar chiqadi, ulanish HTTPS bilan.', ru: "Новый адрес работает: ячейки появляются, соединение по HTTPS." }} izoh={{ uz: "Eski havolani kimgadir yuborgan bo'lsangiz, yangisini qayta yuboring.", ru: 'Если вы кому-то отправляли старую ссылку, отправьте новую.' }} />} />
);
// A2 kutilgan natija: uch brauzer qatori (xaritadagi Backend tugunining kattasi); tugagach navbat bilan yonadi
const A2_QATORLAR = [
  { url: 'localhost:3000/health', javob: HEALTH_JSON },
  { url: 'localhost:3000/health', javob: ULANMADI, yorliq: { uz: "Backend to'xtatilgan", ru: 'Backend остановлен' }, xato: true },
  { url: NOMLAR.render + '/health', javob: HEALTH_JSON }
];
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · Backend holati', ru: 'Практика 2 · состояние Backend' }}
    title={{ uz: <>Backend o'z holatini <code className="qcode">/health</code> da <span className="italic" style={{ color: T.accent }}>aytsin</span>.</>, ru: <>Пусть Backend <span className="italic" style={{ color: T.accent }}>сообщает</span> своё состояние на <code className="qcode">/health</code>.</> }}
    mentor={{ uz: <>Kodni Antigravity yozadi — <code className="qcode">ok</code> va to'xtagan Backend'ni esa brauzerda o'zingiz tekshirasiz. <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Код пишет Antigravity — а <code className="qcode">ok</code> и остановленный Backend вы проверяете в браузере сами. Начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da `maydon` papkasini oching. Terminalda `cd backend`, keyin `npm run start:dev`; brauzerda `localhost:3000` — «Maydon Backend ishlayapti».", ru: 'Откройте папку `maydon` в Antigravity. В терминале `cd backend`, затем `npm run start:dev`; в браузере `localhost:3000` — «Maydon Backend ishlayapti».' } },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'Нажмите «Скопировать» и отправьте в Antigravity:' }, prompt: [
        { uz: "Qayerda: backend/src/app.controller.ts — yangi yo'l GET /health.", ru: 'Где: backend/src/app.controller.ts — новый путь GET /health.' },
        { uz: "Nima qilsin: { holat: 'ok' } qaytarsin. Database'ga so'rov yubormasin — bu yo'lni UptimeRobot har 5 daqiqada so'raydi.", ru: "Что сделать: пусть возвращает { holat: 'ok' }. Запрос в Database не отправлять — этот путь UptimeRobot спрашивает каждые 5 минут." },
        { uz: "Nima buzilmasin: GET / va boshqa yo'llar o'zgarmasin; javobda DATABASE_URL ham, maxfiy kalitlar ham bo'lmasin. O'zgargan fayllarni ayt.", ru: 'Что не сломать: GET / и другие пути не меняются; в ответе нет ни DATABASE_URL, ни секретных ключей. Назови изменённые файлы.' }
      ], err: XATO_YOLI },
      { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "Backend o'zi qayta ishga tushadi. Brauzerda `localhost:3000/health` — `{\"holat\":\"ok\"}`. Keyin Backend terminalida Ctrl+C bosing va sahifani yangilang: Backend to'xtagan — sahifa ochilmaydi. UptimeRobot buni «Down» deb ko'radi. `npm run start:dev` — yana `ok`.", ru: 'Backend сам перезапустится. В браузере `localhost:3000/health` — `{"holat":"ok"}`. Затем нажмите Ctrl+C в терминале Backend и обновите страницу: Backend остановлен — страница не открывается. UptimeRobot увидит это как «Down». `npm run start:dev` — снова `ok`.' } },
      { h: { uz: 'Internetda tekshirish', ru: 'Проверка в интернете' }, t: { uz: "`git status`: o'zgargan fayl — `backend/src/app.controller.ts`, agent aytgan ro'yxat bilan bir xil. `git add backend/src/app.controller.ts`, `git commit -m \"health\"`, `git push` — Render o'zi yangilanadi. Deploy tugagach brauzerda `https://{Render manzilingiz}/health` — `{\"holat\":\"ok\"}`. Bepul Backend uxlab qolgan bo'lsa, birinchi javob kechikishi mumkin — taxminan bir daqiqagacha.", ru: "`git status`: изменённый файл — `backend/src/app.controller.ts`, совпадает со списком агента. `git add backend/src/app.controller.ts`, `git commit -m \"health\"`, `git push` — Render обновится сам. Когда деплой закончится, в браузере `https://{ваш адрес Render}/health` — `{\"holat\":\"ok\"}`. Если бесплатный Backend уснул, первый ответ может задержаться — примерно до минуты." } },
      { h: QADAM_GOYA, t: { uz: "qavs ichini o'z loyihangiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:", ru: 'заполните скобки своим проектом, нажмите «Скопировать» и сохраните — отправите дома в своей папке:' }, prompt: [
        { uz: "Qayerda: {loyiha papkasi}/backend — yangi yo'l GET /health.", ru: 'Где: {папка проекта}/backend — новый путь GET /health.' },
        { uz: "Nima qilsin: { holat: 'ok' } qaytarsin; Database'ga so'rov yubormasin (bepul limit).", ru: "Что сделать: пусть возвращает { holat: 'ok' }; запрос в Database не отправлять (бесплатный лимит)." },
        { uz: "Nima buzilmasin: boshqa yo'llar o'zgarmasin; javobda maxfiy kalitlar bo'lmasin. O'zgargan fayllarni ayt.", ru: 'Что не сломать: другие пути не меняются; в ответе нет секретных ключей. Назови изменённые файлы.' }
      ] }
    ]}
    natijaYorliq={NATIJA_YORLIQ}
    natija={(tugadi) => <div className={cxx('pd-brauzer', tugadi && 'tugadi')}>
      <span className="pd-brauzer-n">{PROD_TUGUNLAR.backend.nom} · <code>GET /health</code></span>
      {A2_QATORLAR.map((q, i) => (
        <div key={i} className={cxx('pd-bq', q.xato ? 'err' : 'ok')} style={{ '--i': i }}>
          {q.yorliq && <span className="pd-bq-y">{tr(q.yorliq)}</span>}
          <div className="pd-bq-manzil"><Belgi /><code>{q.url}</code></div>
          <code className="pd-bq-javob">{typeof q.javob === 'string' ? q.javob : tr(q.javob)}</code>
        </div>
      ))}
    </div>}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-07-done']}
    ortdaIzoh={{ uz: '(`.env` fayllaringiz o\'zgarmaydi)', ru: '(ваши файлы `.env` не меняются)' }}
    doneText={<Tugadi asosiy={{ uz: "`/health` ishlayapti: Backend javob bersa — `ok`, to'xtasa — javob yo'q.", ru: '`/health` работает: Backend отвечает — `ok`, остановлен — ответа нет.' }} />} />
);
const ScreenA3 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 3 · monitoring', ru: 'Практика 3 · мониторинг' }}
    title={{ uz: <>«Maydon» yiqilsa, <span className="italic" style={{ color: T.accent }}>ogohlantirish sizga kelsin</span>.</>, ru: <>Если «Maydon» упадёт, <span className="italic" style={{ color: T.accent }}>пусть оповещение придёт вам</span>.</> }}
    mentor={{ uz: <>UptimeRobot'ning bepul rejasi «Maydon»ga yetadi. <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Бесплатного тарифа UptimeRobot хватит для «Maydon». Начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "uptimerobot.com'da bepul ro'yxatdan o'ting: ogohlantirish shu emailga keladi. Telefoningizga UptimeRobot ilovasini o'rnating (Android yoki iOS) va o'sha akkaunt bilan kiring — ilova ham ogohlantirish oladigan bo'ladi.", ru: 'бесплатно зарегистрируйтесь на uptimerobot.com: оповещения придут на этот email. Установите на телефон приложение UptimeRobot (Android или iOS) и войдите тем же аккаунтом — приложение тоже будет получать оповещения.' } },
      { h: { uz: 'Sayt monitori', ru: 'Монитор сайта' }, t: { uz: "yangi monitor qo'shing («+ Add New Monitor») → turi «HTTP(s)» → URL: `https://{yangi nom}.netlify.app` → interval — 5 daqiqa → ogohlantirish: email va telefoningiz belgilangan bo'lsin → «Create monitor».", ru: 'добавьте новый монитор («+ Add New Monitor») → тип «HTTP(s)» → URL: `https://{новое имя}.netlify.app` → интервал — 5 минут → оповещения: отмечены email и ваш телефон → «Create monitor».' } },
      { h: { uz: '`/health` monitori', ru: 'Монитор `/health`' }, t: { uz: 'xuddi shunday, URL: `https://{Render manzilingiz}/health`. Ikkala qator «Up» bo\'lsin.', ru: "так же, URL: `https://{ваш адрес Render}/health`. Обе строки должны быть «Up»." }, err: { uz: "«Down» bo'lsa — URL ni brauzerda ochib, `ok` qaytayotganini qarang.", ru: 'Если «Down» — откройте URL в браузере и проверьте, что возвращается `ok`.' } },
      { h: { uz: 'Ogohlantirishni tekshirish', ru: 'Проверка оповещения' }, t: { uz: "vaqtinchalik uchinchi monitor qo'shing: URL — Render manzilingiz va oxirida `/yoq` (bunday yo'l yo'q, Backend 404 qaytaradi). U «Down» bo'lib, email va ilovaga ogohlantirish kelguncha kuting. Keyin shu monitorni o'chiring.", ru: 'добавьте временный третий монитор: URL — ваш адрес Render и в конце `/yoq` (такого пути нет, Backend вернёт 404). Подождите, пока он станет «Down» и оповещение придёт на email и в приложение. Затем удалите этот монитор.' } },
      { h: QADAM_GOYA, t: { uz: "o'z MVP ingiz internetda bo'lsa, uyda unga ham ikki monitor qo'shing: sayt va Backend'ning `/health` yo'li. Bepul rejada 50 tagacha monitor bor.", ru: 'если ваш MVP есть в интернете, дома добавьте и ему два монитора: сайт и путь `/health` у Backend. На бесплатном тарифе — до 50 мониторов.' } }
    ]}
    natijaYorliq={NATIJA_YORLIQ}
    natija={(tugadi) => <div className={cxx('pd-natija', tugadi && 'tugadi')}>
      <SizTelefon soat="23:15" xabarlar={[{ k: 'i', tur: 'ilova', holat: 'down', matn: { uz: 'Down · tekshiruv · /yoq', ru: 'Down · проверка · /yoq' } }, { k: 'e', tur: 'email', holat: 'down', matn: { uz: 'Down · tekshiruv · /yoq', ru: 'Down · проверка · /yoq' } }]} />
      <RobotKarta className="pd-a3-robot" qatorlar={[
        { k: 'sayt', nom: { uz: 'Maydon · sayt', ru: 'Maydon · сайт' }, holat: 'up', urish: urishlar(8) },
        { k: 'health', nom: 'Maydon · /health', holat: 'up', urish: urishlar(8) },
        { k: 'yoq', nom: { uz: 'tekshiruv · /yoq', ru: 'проверка · /yoq' }, holat: 'down', urish: urishlar(8, 0), yorliq: tr({ uz: "o'chiriladi", ru: 'будет удалён' }), xira: tugadi }
      ]} />
    </div>}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-07-done']}
    ortdaIzoh={{ uz: "(UptimeRobot sozlamasi repo'da emas — monitorlarni o'zingiz qo'shasiz)", ru: '(настройки UptimeRobot не в репо — мониторы добавляете сами)' }}
    doneText={<Tugadi asosiy={{ uz: "Ikki monitor ishlayapti: «Maydon» yiqilsa, email va ilovaga ogohlantirish keladi.", ru: 'Два монитора работают: если «Maydon» упадёт, оповещение придёт на email и в приложение.' }} izoh={{ uz: "Telegram orqali ogohlantirish bepul rejada yo'q — email va telefon ilovasi yetadi.", ru: 'Оповещений через Telegram на бесплатном тарифе нет — хватит email и приложения.' }} />} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran, Mentorsiz (SABOQ 12, 16)
const KARTOCHKALAR = [
  { front: { uz: 'Production (prod) nima?', ru: "Что такое production (прод)?" }, back: { uz: 'Haqiqiy foydalanuvchilar ishlatadigan versiya', ru: 'Версия, которой пользуются настоящие пользователи' }, note: { uz: "Bizda — internetdagi «Maydon»; bepul reja uzluksizlikni va'da qilmaydi", ru: 'У нас — «Maydon» в интернете; бесплатный тариф не обещает непрерывности' } },
  { front: { uz: 'Netlify sayt nomi nimani belgilaydi?', ru: 'Что определяет имя сайта в Netlify?' }, back: { uz: '….netlify.app manzilining boshini', ru: 'Начало адреса ….netlify.app' }, note: { uz: "Nom o'zgarsa, manzil ham o'zgaradi", ru: 'Меняется имя — меняется и адрес' } },
  { front: { uz: "Sayt nomi o'zgargach Render'da nima yangilanadi?", ru: 'Что обновляется в Render после смены имени сайта?' }, back: { uz: 'WEB_ORIGIN', ru: 'WEB_ORIGIN' }, note: { uz: "Aks holda CORS so'rovni to'sadi, kataklar chiqmaydi", ru: "Иначе CORS блокирует запрос, ячейки не появятся" } },
  { front: { uz: 'HTTPS nimani bildiradi?', ru: 'Что означает HTTPS?' }, back: { uz: "Yo'ldagi ma'lumot shifrlangan — tarmoq mazmunini o'qiy olmaydi", ru: 'Данные в пути зашифрованы — сеть не может прочитать содержимое' }, note: { uz: 'Zaiflikni ham, sayt egasini ham tekshirmaydi', ru: 'Не проверяет ни уязвимости, ни владельца сайта' } },
  { front: { uz: 'SSL nima?', ru: 'Что такое SSL?' }, back: { uz: "HTTPS ni ta'minlaydigan sertifikat", ru: 'Сертификат, который обеспечивает HTTPS' }, note: { uz: "*.netlify.app da Netlify uni o'zi yoqqan", ru: 'На *.netlify.app Netlify включил его сам' } },
  { front: { uz: "O'z domeni saytga qanday ulanadi?", ru: 'Как свой домен подключается к сайту?' }, back: { uz: 'DNS yozuvi bilan', ru: 'С помощью DNS-записи' }, note: { uz: 'Yozuv domenni Netlify manziliga olib boradi', ru: 'Запись ведёт домен к адресу Netlify' } },
  { front: { uz: "O'z domenida sertifikatni kim oladi?", ru: 'Кто получает сертификат для своего домена?' }, back: { uz: "Netlify, o'zi", ru: 'Netlify, сам' }, note: { uz: "DNS domenni Netlify'ga olib borgach (Let's Encrypt); vaqt ketishi mumkin", ru: 'После того как DNS приведёт домен в Netlify (Let\'s Encrypt); может уйти время' } },
  { front: { uz: 'GET /health nima qaytaradi?', ru: 'Что возвращает GET /health?' }, back: { uz: "{ holat: 'ok' }", ru: "{ holat: 'ok' }" }, note: { uz: "Database'ni so'ramaydi", ru: 'Database не спрашивает' } },
  { front: { uz: "/health nega Database'ni so'ramaydi?", ru: 'Почему /health не спрашивает Database?' }, back: { uz: 'Monitoring bepul Database limitini sarflamasin', ru: 'Чтобы мониторинг не тратил бесплатный лимит Database' }, note: { uz: "Har 5 daqiqalik so'rov uni uxlatmaydi", ru: 'Запрос каждые 5 минут не даёт ей уснуть' } },
  { front: { uz: 'Monitoring nima?', ru: 'Что такое мониторинг?' }, back: { uz: 'Saytni to\'xtovsiz, kunu-tun kuzatish', ru: 'Непрерывное наблюдение за сайтом днём и ночью' }, note: { uz: 'Yiqilsa — ogohlantirish keladi', ru: 'Если упадёт — придёт оповещение' } },
  { front: { uz: "«Maydon» uchun nechta monitor qo'shamiz?", ru: 'Сколько мониторов добавляем для «Maydon»?' }, back: { uz: 'Ikkita: sayt va /health', ru: 'Два: сайт и /health' }, note: { uz: "Har biri 5 daqiqada so'raladi", ru: 'Каждый спрашивается раз в 5 минут' } },
  { front: { uz: 'UptimeRobot bepul rejada ogohlantirish qayerga keladi?', ru: 'Куда приходит оповещение UptimeRobot на бесплатном тарифе?' }, back: { uz: 'Email va telefon ilovasiga', ru: 'На email и в приложение на телефоне' }, note: { uz: "Telegram bepul rejada yo'q", ru: 'Telegram на бесплатном тарифе нет' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); ko'rsatma karta ostida, birinchi bosishgacha, karta yuzi halqada */}
        <div className={cxx('pd-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="pd-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204). CODE STRIKE va arena — jonli o'yin qatlami; uyga vazifa — karta «kim uchun · nechta · muddat» =====
const YAKUN_RECAP = [
  { uz: "Netlify nomi o'zgarsa, manzil o'zgaradi va Render'dagi `WEB_ORIGIN` yangilanadi.", ru: 'Меняется имя в Netlify — меняется адрес, и в Render обновляется `WEB_ORIGIN`.' },
  { uz: "HTTPS bilan ma'lumot yo'lda shifrlangan — tarmoq mazmunini o'qiy olmaydi; `*.netlify.app` da Netlify uni o'zi yoqqan.", ru: 'С HTTPS данные в пути зашифрованы — сеть не может прочитать содержимое; на `*.netlify.app` Netlify включил его сам.' },
  { uz: "Bizning `/health` Backend'ni aytadi va Database'ni uyg'otmaydi — monitoring bepul limitni sarflamaydi.", ru: 'Наш `/health` сообщает о Backend и не будит Database — мониторинг не тратит бесплатный лимит.' },
  { uz: "UptimeRobot sayt va `/health` ni har 5 daqiqada so'raydi; javob bo'lmasa email va ilovaga ogohlantirish yuboradi.", ru: 'UptimeRobot спрашивает сайт и `/health` каждые 5 минут; если ответа нет — отправляет оповещение на email и в приложение.' },
  { uz: "O'z domeni DNS yozuvi bilan ulanadi; DNS tayyor bo'lgach, sertifikatni Netlify o'zi oladi.", ru: 'Свой домен подключается DNS-записью; когда DNS готов, сертификат Netlify получает сам.' }
];
const UYGA = [
  { b: { uz: 'Manzil', ru: 'Адрес' }, t: { uz: "MVP ingiz internetda bo'lsa, Netlify'da unga nom bering va Backend ruxsat ro'yxatini yangilang. Internetda bo'lmasa — avval «Maydon» README'sidagi «Internetga chiqarish» yo'li bilan chiqaring.", ru: 'Если ваш MVP в интернете, дайте ему имя в Netlify и обновите список разрешений Backend. Если нет — сначала опубликуйте его по пути «Internetga chiqarish» из README «Maydon».' } },
  { b: '`/health`', t: { uz: "Amaliyot 2 dagi «O'z g'oyangiz» promptini yuboring; `ok` ni va to'xtagan Backend'ni brauzerda tekshiring.", ru: 'Отправьте промпт «Ваша идея» из Практики 2; проверьте в браузере `ok` и остановленный Backend.' } },
  { b: { uz: 'Monitoring', ru: 'Мониторинг' }, t: { uz: "UptimeRobot'da ikki monitor qo'shing va ogohlantirish kelishini bir marta tekshiring.", ru: 'Добавьте в UptimeRobot два монитора и один раз проверьте, что оповещение приходит.' } }
];
const HwKarta = () => (
  <div className="card hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="pd-hw-meta">
      <span><small>{tr({ uz: 'kim uchun', ru: 'для кого' })}</small>{tr({ uz: "o'z MVP ingiz", ru: 'ваш MVP' })}</span>
      <span><small>{tr({ uz: 'nechta', ru: 'сколько' })}</small>{tr({ uz: '3 qadam', ru: '3 шага' })}</span>
      <span><small>{tr({ uz: 'muddat', ru: 'срок' })}</small>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</span>
    </div>
    <ol className="pd-hw-q">{UYGA.map((h, i) => <li key={i}><i>{i + 1}</i><span><b>{fmtCode(tr(h.b))}</b> — {fmtCode(tr(h.t))}</span></li>)}</ol>
    <p className="hw-note">{tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: prodga ko'tarish — 1-qism»</b>. Eng yaxshi loyihangizni prodga tayyorlaysiz.</>, ru: <>Следующий урок — <b>«День проекта: вывод в прод — часть 1»</b>. Вы подготовите свой лучший проект к выводу в прод.</> })}</p>
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
        chip={tr({ uz: 'Ikki monitor ishlayapti', ru: 'Два монитора работают' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Endi «Maydon» yiqilsa, <span className="italic" style={{ color: T.accent }}>ogohlantirish sizga keladi</span>.</>, ru: <>Если «Maydon» упадёт, <span className="italic" style={{ color: T.accent }}>оповещение придёт вам</span>.</> })}
        cta={<>
          <p className="small pd-fikr fade-up d1">{tr({ uz: 'Monitoring saytni siz o\'rningizga so\'rab turadi va javob bo\'lmasa sizga xabar beradi; nimani so\'rashini esa bepul limitlarga qarab tanlaysiz.', ru: 'Мониторинг спрашивает сайт вместо вас и сообщает вам, если ответа нет; а что спрашивать, вы выбираете с оглядкой на бесплатные лимиты.' })}</p>
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
export default function ProductionDeployLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenA1, ScreenA2, ScreenA3, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === PROD XARITASI — darsning bitta vizuali (163/180). Faqat qolip tokenlari (D3), emoji yo'q (D4), ro'yxatlar list-style none (SABOQ 31) === */
        .lesson-root .q-kirish .q-split { grid-template-columns: minmax(0, 1.5fr) minmax(0, 0.8fr); }
        .lesson-root .q-reja .q-split { grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr); }
        @media (max-width: 1060px) { .lesson-root .q-kirish .q-split, .lesson-root .q-reja .q-split { grid-template-columns: minmax(0, 1fr); } }
        .lesson-root .q-tushuncha { gap: clamp(10px,1vw,13px); }
        .pd-navbat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: pd-puls 1.8s ease-out infinite; }
        .pd-navbat-k { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: pd-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both, pd-puls 1.8s ease-out 0.6s infinite; }
        .pd-bash .q-bashorat { border-color: ${T.accent}; animation: pd-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both, pd-puls 1.8s ease-out 0.7s infinite; }
        .pd-bash .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 16px; row-gap: 6px; padding-top: 10px; padding-bottom: 10px; }
        .pd-bash .q-bashorat > .q-yorliq { flex-basis: 100%; }
        .pd-bash .q-chip { animation: pd-kir 0.38s ease-out both; }
        .pd-bash .q-chip:nth-child(1) { animation-delay: 0.22s; } .pd-bash .q-chip:nth-child(2) { animation-delay: 0.32s; } .pd-bash .q-chip:nth-child(3) { animation-delay: 0.42s; }
        .pd-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; transform-origin: top center; animation: pd-yig 0.42s cubic-bezier(.2,.9,.3,1.1) both; }
        .pd-taxmin-y { font-weight: 800; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .pd-taxmin-s { font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .pd-taxmin b { font-size: 14px; color: ${T.ink}; }
        .q-xulosa.pd-nb { display: flex; flex-direction: column; gap: 3px; padding: 12px 18px; font-size: 14.5px; line-height: 1.45; }
        .pd-nb-t { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .pd-nb-t b { color: ${T.ink}; } .pd-nb-t.ok { color: ${T.ok}; font-weight: 700; }
        .pd-nb-i { font-weight: 700; color: ${T.ink}; }
        .pd-nb-q { font-size: 13.5px; color: ${T.ink2}; }
        p.pd-joriy { margin: 10px 0 0; padding: 10px 14px; border-radius: 12px; background: ${T.accentSoft}; color: ${T.ink}; font-size: 14px; line-height: 1.5; }

        /* O'yinchi telefoni = sayt: 172×272, barqaror (SABOQ 22); ustida «Sayt · Netlify» yorlig'i (SABOQ 23) */
        .pd-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; min-width: 0; }
        .pd-tel-tex { display: inline-flex; flex-wrap: nowrap; white-space: nowrap; justify-content: center; align-items: center; gap: 7px; padding: 3px 11px; border: 1.5px solid ${T.line}; border-radius: 999px; background: ${T.paper}; font-size: 12px; line-height: 1.35; }
        .pd-tel-tex b { font-weight: 700; color: ${T.ink}; white-space: nowrap; }
        .pd-tel-tex code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.accent}; animation: pd-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .pd-uch .pd-tel-tex > code { display: none; }
        .pd-tel { position: relative; width: 172px; height: 272px; display: flex; flex-direction: column; border: 2px solid ${T.ink}; border-radius: 22px; padding: 8px 8px 10px; background: ${T.paper}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.35); overflow: hidden; }
        .pd-manzil { display: flex; align-items: flex-start; gap: 6px; padding: 4px 7px; border-radius: 11px; background: ${T.bg}; margin-bottom: 6px; }
        .pd-manzil-t { flex: 1; min-width: 0; font-size: 11px; font-weight: 600; line-height: 1.3; color: ${T.ink}; overflow-wrap: anywhere; border-radius: 4px; }
        .pd-manzil-t.yangi { animation: pd-manzil 1.1s ease-out; }
        .pd-proto { color: ${T.ok}; font-weight: 800; } .pd-proto.ochiq { color: ${T.err}; }
        .pd-belgi-q, .px-belgi { flex: none; width: 18px; height: 16px; display: grid; place-items: center; border-radius: 5px; }
        .px-belgi { border: none; padding: 0; background: ${T.paper}; cursor: pointer; }
        .px-belgi.on { background: ${T.accentSoft}; }
        .pd-belgi-i { width: 11px; height: 9px; display: flex; flex-direction: column; justify-content: space-between; }
        .pd-belgi-i i { position: relative; display: block; height: 1.5px; border-radius: 1px; background: ${T.ink2}; }
        .pd-belgi-i i::after { content: ''; position: absolute; top: -2px; width: 5px; height: 5px; border-radius: 50%; background: ${T.paper}; border: 1.5px solid ${T.ink2}; box-sizing: border-box; }
        .pd-belgi-i i:first-child::after { left: 1px; } .pd-belgi-i i:last-child::after { right: 1px; }
        .pd-faraz { position: absolute; right: 2px; top: 2px; z-index: 1; padding: 1px 8px; border-radius: 999px; background: ${T.bg}; border: 1px dashed ${T.ink2}; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pd-tel-ekran { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; }
        .pd-sah { display: flex; flex-direction: column; gap: 6px; padding: 2px; }
        .pd-sah-sar { font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .pd-sah-kun { font-size: 11px; color: ${T.ink2}; }
        .pd-kataklar { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; }
        .pd-katak { display: grid; place-items: center; height: 26px; border-radius: 7px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: ${T.ink}; animation: pd-kir 0.35s ease-out both; animation-delay: calc(var(--i, 0) * 70ms); }
        .pd-katak.on { background: ${T.okFon}; border-color: ${T.ok}; color: ${T.ok}; }
        .pd-kataklar.yukl .pd-katak { background: ${T.line}; border-color: transparent; animation: pd-shim 0.9s ease-in-out infinite; }
        p.pd-sah-xato { margin: 4px 0 0; padding: 10px; border-radius: 10px; background: ${T.errFon}; color: ${T.err}; font-size: 12px; font-weight: 600; line-height: 1.4; animation: pd-silk 0.5s ease-out; }
        .pd-sah.bosh { gap: 8px; padding: 6px 2px; }
        .pd-sah.bosh i { display: block; height: 10px; width: 100%; border-radius: 5px; background: ${T.bg}; }
        .pd-sah.bosh i:first-child { width: 55%; height: 14px; } .pd-sah.bosh i:nth-child(2) { width: 35%; } .pd-sah.bosh i.k { height: 26px; }
        .pd-sah.ulanmadi { flex: 1; align-items: center; justify-content: center; text-align: center; gap: 10px; }
        .pd-sah.ulanmadi b { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .pd-ulan-i { position: relative; width: 34px; height: 34px; border-radius: 50%; border: 2px solid ${T.ink2}; }
        .pd-ulan-i::before, .pd-ulan-i::after { content: ''; position: absolute; left: 50%; top: 50%; width: 16px; height: 2px; margin: -1px 0 0 -8px; border-radius: 1px; background: ${T.ink2}; transform: rotate(45deg); }
        .pd-ulan-i::after { transform: rotate(-45deg); }
        .pd-forma { display: flex; flex-direction: column; gap: 5px; }
        .pd-input { display: flex; flex-direction: column; gap: 0; padding: 3px 8px; border-radius: 7px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; color: ${T.ink}; white-space: nowrap; overflow: hidden; }
        .pd-input small { font-size: 11px; line-height: 1.15; color: ${T.ink2}; }
        .pd-band { display: grid; place-items: center; height: 28px; border-radius: 8px; background: ${T.accent}; color: ${T.paper}; font-size: 12px; font-weight: 700; }

        /* Sizning telefoningiz — qulflangan ekran va ogohlantirishlar */
        .pd-tel-tex.siz b { color: ${T.ink2}; }
        .pd-tel.siz { background: linear-gradient(180deg, ${fon(T.ink, 0.07)}, ${T.paper} 60%); }
        .pd-qulf-soat { text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 800; color: ${T.ink}; margin: 12px 0 12px; font-variant-numeric: tabular-nums; }
        .pd-xabarlar { display: flex; flex-direction: column; gap: 6px; }
        .pd-xabar-yoq { text-align: center; font-size: 12px; color: ${T.ink2}; }
        .pd-xabar { display: flex; flex-direction: column; gap: 2px; padding: 6px 9px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.4); animation: pd-xabar 0.5s cubic-bezier(.2,.9,.3,1.2) both; }
        .pd-xabar.down { border-color: ${T.err}; } .pd-xabar.up { border-color: ${T.ok}; }
        .pd-xabar-y { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pd-xabar b { font-size: 11.5px; font-weight: 700; line-height: 1.35; color: ${T.ink}; }
        .pd-xabar.down b { color: ${T.err}; } .pd-xabar.up b { color: ${T.ok}; }
        .pd-xi { position: relative; display: inline-block; flex: none; width: 12px; height: 12px; border-radius: 3px; background: ${T.ink}; }
        .pd-xi.email { height: 9px; border-radius: 2px; background: transparent; border: 1.5px solid ${T.ink2}; overflow: hidden; }
        .pd-xi.email::after { content: ''; position: absolute; left: 1px; top: -4px; width: 6px; height: 6px; border-right: 1.5px solid ${T.ink2}; border-bottom: 1.5px solid ${T.ink2}; transform: rotate(45deg); }
        .pd-joy { height: 46px; border: 1.5px dashed ${T.ink2}; border-radius: 10px; opacity: 0.55; }

        /* Tugunlar — Backend · Render, Database · Neon */
        .pd-tugun { position: relative; padding: 9px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: border-color 0.3s, background 0.3s; }
        .pd-tugun-b { display: flex; align-items: center; justify-content: space-between; gap: 4px 8px; flex-wrap: wrap; }
        .pd-tugun-n { display: inline-flex; align-items: center; gap: 7px; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .pd-holat { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: ${T.bg}; color: ${T.ink2}; animation: pd-pop 0.4s cubic-bezier(.3,1.5,.5,1); }
        .pd-holat.ok { background: ${T.okFon}; color: ${T.ok}; } .pd-holat.err { background: ${T.paper}; color: ${T.err}; }
        .pd-tugun.ok { border-color: ${T.ok}; animation: pd-yon-ok 0.9s ease-out; }
        .pd-tugun.err { border-color: ${T.err}; background: ${T.errFon}; animation: pd-yon-err 0.7s ease-out; }
        .pd-tugun.deploy { border-color: ${T.ink2}; }
        .pd-tugun.deploy::after { content: ''; position: absolute; left: 12px; bottom: 5px; height: 3px; border-radius: 2px; background: ${T.ink2}; animation: pd-deploy 1.2s linear both; }
        .pd-yollar { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 7px; }
        .pd-yollar code, code.pd-sorov { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 2px 7px; border-radius: 6px; background: ${T.bg}; color: ${T.ink2}; }
        .pd-yollar code.yon, code.pd-sorov.yon { color: ${T.ink}; background: ${T.accentSoft}; }
        code.pd-sorov { display: inline-block; margin-top: 7px; }
        code.pd-sorov.yon { animation: pd-shim 0.5s ease-in-out infinite; }
        .px-origin { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; width: 100%; margin-top: 8px; padding: 6px 9px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.bg}; text-align: left; cursor: pointer; font: inherit; color: ${T.ink}; }
        .px-origin:disabled { cursor: default; opacity: 1; }
        .px-origin.yangi { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .px-origin-k { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .px-origin code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; overflow-wrap: anywhere; animation: pd-chiz 0.8s steps(16) both; }
        .pd-pastga { display: block; width: 0; height: 18px; margin: 2px 0 2px 24px; border-left: 2px dashed ${T.line}; }
        .pd-pastga.yon { border-color: ${T.accent}; animation: pd-shim 0.5s ease-in-out infinite; }
        .pd-pastga.uzuk { opacity: 0.3; }

        /* Sahna (2, 4, 6, 10-ekran): telefon CHAPDA, chizma O'NGDA (SABOQ 21) */
        .pd-sahna { position: relative; display: flex; align-items: flex-start; gap: 12px; }
        .pd-ust-chap { flex: none; width: 236px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .pd-ust-chap > .q-btn, .pd-tel-ust > .q-btn { align-self: center; margin-top: 0; max-width: 250px; }
        .pd-tel-btn { white-space: nowrap; font-size: 14px; padding-left: 18px; padding-right: 18px; }
        .pd-tel-btn:disabled { opacity: 0.6; }
        .pd-qn { margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; opacity: 0.85; }
        .pd-tel-ipucha { display: inline-flex; align-items: baseline; font-size: 13px; font-weight: 700; color: ${T.accent}; text-align: center; }
        .pd-ust-ong { flex: 1; min-width: 0; display: flex; flex-direction: column; margin-top: 96px; }
        .pd-yol { flex: none; width: 54px; margin-top: 128px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .pd-yol > span { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .pd-yol > i { position: relative; display: block; width: 100%; height: 0; border-top: 2px dashed ${T.line}; }
        .pd-yol > i::after { content: ''; position: absolute; right: -2px; top: -7px; border: 6px solid transparent; border-left: 8px solid var(--pd-uq, ${T.line}); border-right-width: 0; }
        .pd-yol.ulandi > i { border-top-color: ${T.ok}; --pd-uq: ${T.ok}; animation: pd-chiz 0.8s ease-out both; }
        .pd-s2 .pd-yol { width: 94px; margin-top: 150px; }
        .pd-s2 .pd-ust-ong { margin-top: 0; }
        .pd-ust-ong > .pd-netlify + .pd-tugun { margin-top: 12px; }
        .pd-qadam-y { display: inline-flex; align-items: baseline; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        code.pd-nl-nom { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: ${T.accent}; padding: 3px 9px; border-radius: 7px; background: ${T.accentSoft}; animation: pd-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .pd-nl-in:disabled { border-color: ${T.line}; color: ${T.ink2}; background: ${T.bg}; }
        .pd-ust-ong > .pd-nb { margin-top: 12px; }
        .pd-netlify { width: 100%; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.35); padding: 0 12px 12px; display: flex; flex-direction: column; gap: 6px; }
        .pd-oyna-bar { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; margin: 0 -12px 4px; padding: 7px 10px; border-bottom: 1px solid ${T.line}; background: ${T.bg}; border-radius: 12px 12px 0 0; }
        .pd-oyna-bar > i { width: 7px; height: 7px; border-radius: 50%; background: ${T.line}; }
        .pd-oyna-bar > span { margin-left: 4px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pd-oyna-bar > small { flex-basis: 100%; font-size: 11px; color: ${T.ink2}; }
        .pd-nl-l { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .pd-nl-q { display: flex; gap: 6px; align-items: stretch; }
        .pd-nl-in { flex: 1; min-width: 0; height: 38px; padding: 0 10px; border-radius: 8px; border: 1.5px solid ${T.accent}; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${T.ink}; background: ${T.paper}; outline: none; }
        .pd-nl-in.xato { border-color: ${T.err}; background: ${T.errFon}; }
        .pd-nl-q > .q-btn { flex: none; padding: 0 16px; min-height: 38px; height: 38px; }
        .pd-netlify > p.q-xato { margin: 0; }

        /* 4-ekran: bepul Wi-Fi tuguni */
        .pd-s4 .pd-ust-ong { margin-top: 118px; }
        .pd-s4 > .pd-yol { margin-top: 160px; }
        .pd-s4-qator { display: flex; align-items: flex-start; gap: 10px; }
        .pd-s4-qator > .pd-yol { margin-top: 36px; width: 40px; }
        .pd-s4-qator > .pd-tugun { flex: 1; min-width: 0; }
        .pd-wifi { flex: 1; min-width: 0; padding: 10px 12px; border-radius: 12px; border: 1.5px dashed ${T.ink2}; background: ${T.paper}; display: flex; flex-direction: column; gap: 8px; transition: background 0.3s, border-color 0.3s; }
        .pd-wifi.ochiq { background: ${T.errFon}; border-color: ${T.err}; border-style: solid; animation: pd-yon-err 0.7s ease-out; }
        .pd-wifi.shifr { background: ${T.okFon}; border-color: ${T.ok}; border-style: solid; animation: pd-yon-ok 0.9s ease-out; }
        .pd-wifi-m, .pd-be-m { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.45; color: ${T.ink2}; overflow-wrap: anywhere; animation: pd-kir 0.4s ease-out; }
        .pd-wifi.ochiq .pd-wifi-m { color: ${T.err}; font-weight: 700; }
        .pd-wifi.shifr .pd-wifi-m { color: ${T.ok}; font-weight: 800; letter-spacing: 0.08em; font-size: 14px; }
        .pd-be-m { display: block; margin-top: 7px; } .pd-be-m.bor { color: ${T.ink}; }
        .pd-wifi-i { position: relative; display: inline-block; width: 18px; height: 14px; }
        .pd-wifi-i i { position: absolute; left: 50%; border-radius: 50%; border: 2px solid transparent; border-top-color: ${T.ink2}; transform: translateX(-50%); }
        .pd-wifi-i i:nth-child(1) { top: 0; width: 18px; height: 18px; } .pd-wifi-i i:nth-child(2) { top: 4px; width: 11px; height: 11px; }
        .pd-wifi-i i:nth-child(3) { top: 9px; width: 4px; height: 4px; border: 0; background: ${T.ink2}; }
        .pd-panel { position: absolute; left: 6px; right: 6px; top: 42px; z-index: 3; padding: 9px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 12px 26px -10px rgba(${T.shadowBase},0.55); display: flex; flex-direction: column; gap: 4px; }
        .pd-panel.pd-panel-st { position: static; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.35); }
        .pd-panel b { display: flex; align-items: center; gap: 6px; font-size: 12px; color: ${T.ok}; }
        .pd-panel span { font-size: 11px; color: ${T.ink2}; } .pd-panel code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink}; }
        .pd-qulf { position: relative; display: inline-block; flex: none; width: 10px; height: 8px; margin-top: 4px; border-radius: 2px; background: ${T.ok}; }
        .pd-qulf::before { content: ''; position: absolute; left: 2px; top: -5px; width: 6px; height: 6px; border: 1.5px solid ${T.ok}; border-bottom: 0; border-radius: 4px 4px 0 0; box-sizing: border-box; }

        /* 6-ekran: kalit, oy kalendari, kod kartasi */
        .pd-kalit { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .pd-kalit > .q-chip { text-align: left; }
        .pd-s6 .pd-ust-ong { margin-top: 40px; }
        .pd-s6.tugadi .pd-ust-ong { margin-top: 30px; }
        .pd-kal { display: flex; flex-direction: column; gap: 7px; margin-top: 8px; }
        .pd-kal-sar { font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pd-kal-yorliq { align-self: flex-start; font-size: 11px; color: ${T.ink2}; padding: 1px 8px; border-radius: 999px; background: ${T.bg}; }
        .pd-kal-kun { display: grid; grid-template-columns: repeat(10, 18px); gap: 4px; }
        .pd-kal-kun i { width: 18px; height: 18px; border-radius: 4px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .pd-kal.db .pd-kal-kun i.on { background: ${T.ink2}; border-color: ${T.ink2}; animation: pd-pop 0.3s ease-out; }
        .pd-kal.be .pd-kal-kun i.on { background: linear-gradient(to top, ${T.ink2} 0 36%, ${T.bg} 36% 100%); border-color: ${T.ink2}; animation: pd-pop 0.3s ease-out; }
        .pd-kal-kun i.off { background: ${T.errFon}; border-color: ${fon(T.err, 0.45)}; }
        .pd-kal-bar { position: relative; height: 10px; border-radius: 5px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .pd-kal-bar > span { display: block; height: 100%; border-radius: 5px; background: ${T.ink2}; transition: width 0.1s linear; }
        .pd-kal.toxtadi .pd-kal-bar > span { background: ${T.err}; }
        .pd-kal-bar > i { position: absolute; top: -5px; bottom: -5px; width: 2px; margin-left: -1px; background: ${T.err}; }
        .pd-kal-past { display: flex; justify-content: space-between; gap: 4px 10px; flex-wrap: wrap; font-size: 11.5px; color: ${T.ink2}; }
        .pd-kal-past b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        .pd-kal-lim { color: ${T.err}; font-weight: 700; }
        .pd-s6-tugadi { display: flex; gap: 12px; align-items: stretch; flex-wrap: wrap; animation: pd-kir 0.5s ease-out both; }
        .pd-s6-tugadi > .pd-kal { flex: none; margin: 0; padding: 10px 12px; border: 1px solid ${T.line}; border-radius: 12px; background: ${T.paper}; max-width: 190px; }
        .pd-s6-tugadi > .pd-kal.toxtadi { border-color: ${fon(T.err, 0.5)}; } .pd-s6-tugadi > .pd-kal.be { border-color: ${T.ok}; }
        .pd-s6-tugadi > .pd-kal + .pd-kal .pd-kal-yorliq { visibility: hidden; }
        .pd-s6-tugadi .pd-kal-kun { grid-template-columns: repeat(10, 13px); gap: 3px; }
        .pd-s6-tugadi .pd-kal-kun i { width: 13px; height: 13px; border-radius: 3px; }
        .pd-s6-tugadi > .pd-kod { flex: 1; min-width: 210px; margin-top: 0; }
        .pd-kod { margin-top: 12px; border-radius: 12px; background: ${CODE.bg}; padding: 10px 14px 12px; display: flex; flex-direction: column; gap: 6px; animation: pd-kir 0.5s ease-out 0.25s both; }
        .pd-kod-f { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${CODE.punct}; }
        .pd-kod pre { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.55; color: ${CODE.text}; white-space: pre-wrap; }
        p.pd-kod-ost { margin: 0; font-size: 13px; line-height: 1.45; color: ${CODE.text}; }

        /* Uch ustunli sahna (0, 1, 8-ekran): o'yinchi telefoni · chizma · sizning telefoningiz */
        .pd-s0 { position: relative; display: flex; flex-direction: column; }
        .pd-uch { display: grid; grid-template-columns: 196px minmax(0, 1fr) 196px; align-items: start; gap: 0 10px; }
        .pd-orta { display: flex; flex-direction: column; min-width: 0; margin-top: 40px; }
        .pd-s0 .pd-orta { margin-top: 118px; padding-left: 12px; position: relative; }
        .pd-chiziq { position: absolute; left: -8px; top: 18px; width: 18px; height: 0; border-top: 2px dashed ${T.ink2}; }
        .pd-chiziq::after { content: ''; position: absolute; right: -3px; top: -6px; border: 5px solid transparent; border-left: 7px solid ${T.ink2}; border-right-width: 0; }
        .pd-orta > .pd-robot { margin-top: 10px; }
        .pd-orta > .pd-nb { margin-top: 12px; }
        .pd-s8 .pd-orta > .pd-robot:first-child { margin-top: 0; }
        .pd-s8 .pd-orta { margin-top: 0; }
        .pd-orta > .pd-tun { margin-bottom: 10px; padding: 8px 12px; }
        .pd-orta > .pd-tun .pd-tun-soat { font-size: 22px; min-width: 72px; }
        .pd-s8-joriy { margin-top: 10px; }
        .pd-s1, .pd-s8 { position: relative; }
        .pd-tun { display: flex; align-items: center; gap: 10px 14px; flex-wrap: wrap; padding: 10px 14px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; margin-bottom: 12px; }
        .pd-tun-soat { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; font-variant-numeric: tabular-nums; min-width: 86px; }
        .pd-tun-yol { flex: 1; min-width: 140px; display: flex; flex-direction: column; gap: 4px; }
        .pd-tun-iz { position: relative; height: 8px; border-radius: 4px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .pd-tun-iz > span { display: block; height: 100%; border-radius: 4px; background: ${T.ink2}; transition: width 0.15s linear; }
        .pd-tun-belgi { position: absolute; top: -6px; width: 3px; height: 18px; margin-left: -1px; border-radius: 2px; background: ${T.err}; animation: pd-pop 0.4s ease-out; }
        .pd-tun-ch { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .pd-tun > .q-btn { flex: none; }
        .pd-s8-joriy { display: flex; flex-direction: column; gap: 6px; }
        .pd-s8-joriy > p.q-izoh { margin: 0; }
        .pd-reja-past { display: flex; flex-direction: column; gap: 2px; }
        p.pd-reja-izoh { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.pd-repo { margin: 0; font-size: 12px; color: ${T.ink2}; }

        /* UptimeRobot — chizilgan dashboard (logotipsiz) */
        .pd-robot { border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; padding: 0 12px 10px; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.35); min-width: 0; }
        ul.pd-mon { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .pd-mon-q { display: flex; flex-direction: column; gap: 4px; padding: 7px 9px; border-radius: 9px; background: ${T.bg}; transition: background 0.3s, opacity 0.3s; min-width: 0; }
        .pd-mon-q.down { background: ${T.errFon}; animation: pd-silk 0.5s ease-out; }
        .pd-mon-q.xira { opacity: 0.55; }
        .pd-mon-b { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .pd-mon-b > b { font-size: 12.5px; color: ${T.ink}; }
        .pd-pill { flex: none; font-size: 11px; font-weight: 800; padding: 2px 9px; border-radius: 999px; animation: pd-pop 0.4s ease-out; }
        .pd-pill.up { background: ${T.okFon}; color: ${T.ok}; } .pd-pill.down { background: ${T.err}; color: ${T.paper}; }
        .pd-mon-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pd-urish { display: flex; gap: 3px; overflow: hidden; }
        .pd-urish > i { flex: none; width: 8px; height: 18px; border-radius: 3px; background: ${T.ok}; }
        .pd-urish > i.d { background: ${T.err}; }
        .pd-urish > i:last-child { transform-origin: bottom; animation: pd-urish 0.4s ease-out; }
        .pd-mon-yorliq { align-self: flex-start; font-size: 11px; font-weight: 700; color: ${T.ink2}; padding: 1px 8px; border-radius: 999px; border: 1px solid ${T.line}; background: ${T.paper}; }
        .pd-savol-robot { width: min(360px, 100%); margin: 0 auto 14px; }

        /* 10-ekran: DNS tuguni, Netlify domenlari, domen sotuvchisi paneli */
        .pd-dns { flex: none; width: 140px; margin-top: 118px; padding: 10px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; transition: border-color 0.3s, background 0.3s; }
        .pd-dns > b { font-size: 13px; color: ${T.ink}; }
        .pd-dns-ok { font-size: 16px; font-weight: 800; color: ${T.ok}; animation: pd-pop 0.45s cubic-bezier(.3,1.5,.5,1); }
        .pd-dns > code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ok}; overflow-wrap: anywhere; }
        .pd-dns.ok { border-color: ${T.ok}; animation: pd-yon-ok 0.9s ease-out; }
        .pd-dns.err { border-color: ${T.err}; background: ${T.errFon}; animation: pd-yon-err 0.7s ease-out; }
        .pd-dns-i { position: relative; width: 26px; height: 26px; border-radius: 50%; border: 2px solid ${T.ink2}; }
        .pd-dns-i::before { content: ''; position: absolute; left: 50%; top: -2px; bottom: -2px; width: 10px; margin-left: -5px; border-radius: 50%; border: 2px solid ${T.ink2}; box-sizing: border-box; }
        .pd-dns-i::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 2px; margin-top: -1px; background: ${T.ink2}; }
        .pd-s10 .pd-ust-ong { margin-top: 0; }
        .pd-s10 .pd-yol { width: 40px; margin-top: 150px; }
        .pd-nl-sar { font-size: 12px; font-weight: 800; color: ${T.ink}; }
        ul.pd-domen { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
        .pd-domen > li { display: flex; align-items: center; justify-content: space-between; gap: 4px 8px; flex-wrap: wrap; padding: 6px 8px; border-radius: 8px; background: ${T.bg}; }
        .pd-domen > li.yangi { animation: pd-qator 1.2s ease-out both; }
        .pd-domen code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; }
        .pd-dh { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; animation: pd-pop 0.4s ease-out; }
        .pd-dh.ok { color: ${T.ok}; } .pd-dh.kut { color: ${T.ink2}; }
        .pd-soat-i { position: relative; display: inline-block; width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid ${T.ink2}; }
        .pd-soat-i::after { content: ''; position: absolute; left: 3.5px; top: 1px; width: 3px; height: 3.5px; border-left: 1.5px solid ${T.ink2}; border-bottom: 1.5px solid ${T.ink2}; }
        .pd-https { align-self: flex-start; padding: 3px 10px; border-radius: 999px; background: ${T.okFon}; color: ${T.ok}; font-size: 12px; font-weight: 700; }
        .pd-sotuvchi { margin-top: 10px; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }
        .pd-sot-b { display: flex; flex-direction: column; gap: 2px; }
        .pd-sot-b > b { font-size: 13px; color: ${T.ink}; }
        .pd-sot-y { align-self: flex-start; font-size: 11px; color: ${T.ink2}; padding: 1px 8px; border-radius: 999px; background: ${T.bg}; }
        .pd-yozuv { display: flex; align-items: center; gap: 4px 8px; flex-wrap: wrap; padding: 7px 9px; border-radius: 8px; background: ${T.okFon}; animation: pd-qator 1.2s ease-out both; }
        .pd-yozuv > code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; }
        .pd-yozuv > span { color: ${T.ok}; font-weight: 700; }
        .pd-yozuv > small { flex-basis: 100%; font-size: 11px; color: ${T.ink2}; }
        .pd-yozuv.bosh { height: 34px; background: transparent; border: 1.5px dashed ${T.line}; animation: none; }

        /* Konvert — so'rov telefondan uchadi (SABOQ 19) */
        .pd-konvert { position: absolute; z-index: 6; pointer-events: none; transform: translate(-50%, -50%); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; white-space: nowrap; padding: 4px 10px 4px 24px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.accent}; color: ${T.ink}; box-shadow: 0 10px 20px -8px rgba(${T.shadowBase},0.45); animation: pd-uch 800ms cubic-bezier(.45,0,.25,1) both; }
        .pd-konvert::before { content: ''; position: absolute; left: 7px; top: 50%; width: 11px; height: 8px; margin-top: -4px; border: 1.5px solid ${T.accent}; border-radius: 2px; }
        .pd-konvert::after { content: ''; position: absolute; left: 10px; top: 50%; width: 5px; height: 5px; margin-top: -5px; border-right: 1.5px solid ${T.accent}; border-bottom: 1.5px solid ${T.accent}; transform: rotate(45deg); }
        .pd-konvert.nuqta { padding: 0; width: 12px; height: 12px; border: 0; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.2)}; }
        .pd-konvert.nuqta::before, .pd-konvert.nuqta::after { display: none; }
        .pd-konvert.ok { border-color: ${T.ok}; } .pd-konvert.ok::before, .pd-konvert.ok::after { border-color: ${T.ok}; }
        .pd-konvert.nuqta.ok { background: ${T.ok}; box-shadow: 0 0 0 4px ${fon(T.ok, 0.2)}; }
        .pd-konvert.qayt { animation-name: pd-uch-qayt; }
        .pd-konvert.ochiq { border-color: ${T.err}; color: ${T.err}; } .pd-konvert.ochiq::before, .pd-konvert.ochiq::after { border-color: ${T.err}; }
        .pd-konvert.ochiq::after { margin-top: -8px; transform: rotate(-135deg); }
        .pd-konvert.qulf { border-color: ${T.ok}; color: ${T.ok}; }
        .pd-konvert.qulf::before { left: 8px; width: 10px; height: 8px; margin-top: -2px; border: 0; border-radius: 2px; background: ${T.ok}; }
        .pd-konvert.qulf::after { left: 10px; width: 6px; height: 6px; margin-top: -7px; border: 1.5px solid ${T.ok}; border-bottom: 0; border-radius: 4px 4px 0 0; transform: none; }
        .pd-konvert.ogoh { border-color: ${T.err}; color: ${T.err}; background: ${T.errFon}; } .pd-konvert.ogoh::before, .pd-konvert.ogoh::after { border-color: ${T.err}; }
        .pd-konvert.ogoh.ok { border-color: ${T.ok}; color: ${T.ok}; background: ${T.okFon}; } .pd-konvert.ogoh.ok::before, .pd-konvert.ogoh.ok::after { border-color: ${T.ok}; }


        /* Amaliyot bloklari — kutilgan natija maketlari */
        .pd-tugadi-iz { display: block; margin-top: 4px; font-size: 13px; font-weight: 500; color: ${T.ink2}; }
        .q-blok-buyruq:has(.pd-ortda-iz) { font-family: 'Manrope', sans-serif; background: transparent; border: 0; padding-left: 0; }
        .pd-ortda-iz { font-size: 12px; color: ${T.ink2}; }
        .pd-natija { display: flex; gap: 12px; align-items: flex-start; justify-content: center; flex-wrap: wrap; }
        .pd-natija-ong { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 8px; }
        .pd-natija.tugadi .pd-tel, .pd-natija.tugadi .pd-render, .pd-natija.tugadi .pd-robot { animation: pd-yon-ok 1s ease-out; }
        .pd-natija.tugadi .pd-xabar { animation: pd-xabar 0.5s cubic-bezier(.2,.9,.3,1.2) both, pd-yon-err 0.9s ease-out 0.5s; }
        .pd-render { border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; padding: 0 12px 10px; }
        .pd-env { display: flex; flex-direction: column; gap: 3px; padding: 7px 9px; border-radius: 8px; background: ${T.bg}; }
        .pd-env > span { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pd-env > code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; overflow-wrap: anywhere; }
        .pd-namuna-y { font-size: 11px; color: ${T.ink2}; margin-top: -4px; }
        .pd-a3-robot { flex: 1; min-width: 220px; }
        .pd-brauzer { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .pd-brauzer-n { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .pd-brauzer-n > code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .pd-bq { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .pd-brauzer.tugadi .pd-bq.ok { animation: pd-bq-ok 1.2s ease-out both; animation-delay: calc(var(--i) * 0.4s); }
        .pd-brauzer.tugadi .pd-bq.err { animation: pd-bq-err 1.2s ease-out both; animation-delay: calc(var(--i) * 0.4s); }
        .pd-bq-y { font-size: 11px; font-weight: 700; color: ${T.err}; }
        .pd-bq-manzil { display: flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 8px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pd-bq-manzil > code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; overflow-wrap: anywhere; }
        .pd-bq-javob { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; }
        .pd-bq.ok .pd-bq-javob { color: ${T.ok}; } .pd-bq.err .pd-bq-javob { color: ${T.err}; font-family: 'Manrope', sans-serif; }

        /* Kartochkalar va yakun */
        .pd-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: pd-puls 1.6s ease-out 3; }
        p.pd-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .pd-fc-ipucha > i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: pd-nuqta 1.4s ease-in-out 3; }
        p.pd-fikr { margin: 4px auto 0; max-width: 640px; text-align: center; color: ${T.ink2}; line-height: 1.5; }
        .pd-hw-meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 4px 0 10px; }
        .pd-hw-meta > span { display: flex; flex-direction: column; padding: 6px 12px; border: 1px solid ${T.line}; border-radius: 10px; background: ${T.bg}; font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .pd-hw-meta small { font-size: 11px; font-weight: 600; color: ${T.ink2}; }
        ol.pd-hw-q { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .pd-hw-q > li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .pd-hw-q > li > i { flex: none; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-size: 12px; font-weight: 800; }

        @keyframes pd-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        @keyframes pd-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes pd-kot { from { opacity: 0; transform: translateY(14px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes pd-yig { from { opacity: 0.2; transform: scaleY(1.9); } to { opacity: 1; transform: none; } }
        @keyframes pd-pop { from { transform: scale(1.3); } }
        @keyframes pd-silk { 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(2px); } }
        @keyframes pd-yon-ok { 0% { box-shadow: 0 0 0 0 ${fon(T.ok, 0.45)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.ok, 0)}; } }
        @keyframes pd-yon-err { 0% { box-shadow: 0 0 0 0 ${fon(T.err, 0.45)}; } 30% { transform: translateX(-3px); } 50% { transform: translateX(3px); } 70% { transform: translateX(-2px); } 100% { box-shadow: 0 0 0 12px ${fon(T.err, 0)}; transform: none; } }
        @keyframes pd-qator { 0% { opacity: 0; transform: translateX(-12px); box-shadow: inset 0 0 0 2px ${T.ok}; } 25% { opacity: 1; transform: none; } 100% { box-shadow: inset 0 0 0 0 ${fon(T.ok, 0)}; } }
        @keyframes pd-xabar { from { opacity: 0; transform: translateY(-14px) scale(0.96); } to { opacity: 1; transform: none; } }
        @keyframes pd-shim { 50% { opacity: 0.45; } }
        @keyframes pd-urish { from { transform: scaleY(0.2); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes pd-nuqta { 50% { transform: scale(1.6); opacity: 0.4; } }
        @keyframes pd-chiz { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes pd-deploy { from { width: 0; } to { width: calc(100% - 24px); } }
        @keyframes pd-manzil { 0% { background: ${fon(T.accent, 0.28)}; } 100% { background: ${fon(T.accent, 0)}; } }
        @keyframes pd-bq-ok { 0% { opacity: 0.35; } 30% { opacity: 1; background: ${T.okFon}; } 100% { opacity: 1; } }
        @keyframes pd-bq-err { 0% { opacity: 0.35; } 30% { opacity: 1; background: ${T.errFon}; } 100% { opacity: 1; } }
        @keyframes pd-uch { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.6); } 14% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 84% { opacity: 1; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.55); } }
        @keyframes pd-uch-qayt { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.6); } 8% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 48% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); } 56% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.08); border-color: ${T.err}; color: ${T.err}; background: ${T.errFon}; } 94% { opacity: 1; transform: translate(-50%, -50%) scale(1); border-color: ${T.err}; color: ${T.err}; background: ${T.errFon}; } 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.7); border-color: ${T.err}; } }

        @media (max-width: 760px) {
          .pd-sahna { flex-direction: column; align-items: stretch; gap: 8px; }
          .pd-ust-chap { width: 100%; }
          .pd-netlify { max-width: 340px; align-self: center; }
          .pd-yol, .pd-s2 .pd-yol, .pd-s10 .pd-yol { width: auto; margin: 0 auto; flex-direction: row; gap: 8px; height: 26px; }
          .pd-yol > i { width: 0; height: 24px; border-top: 0; border-left: 2px dashed ${T.line}; }
          .pd-yol > i::after { right: auto; left: -7px; top: auto; bottom: -4px; border: 6px solid transparent; border-top: 8px solid var(--pd-uq, ${T.line}); border-bottom-width: 0; }
          .pd-yol.ulandi > i { border-color: ${T.ok}; } /* faqat chap chiziq ko'rinadi (border-top: 0); o'q rangi --pd-uq dan */
          .pd-wifi, .pd-dns, .pd-ust-ong, .pd-s6 .pd-ust-ong, .pd-s10 .pd-ust-ong { margin-top: 0; }
          .pd-dns { width: 100%; }
          .pd-s4-qator { flex-direction: column; align-items: stretch; }
          .pd-s4-qator > .pd-yol { margin: 0 auto; }
          .pd-s4 > .pd-yol, .pd-s2 .pd-yol, .pd-s10 .pd-yol, .pd-s4 .pd-ust-ong { margin-top: 0; }
        }
        @media (max-width: 640px) {
          .pd-uch { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 6px; }
          .pd-uch > .pd-orta { grid-column: 1 / -1; grid-row: 2; margin-top: 0; }
          .pd-s0 .pd-orta { margin-top: 0; padding-left: 0; }
          .pd-chiziq { display: none; }
          .pd-tun-soat { font-size: 22px; min-width: 72px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lesson-root [class*="pd-"], .lesson-root [class*="px-"], .pd-bash .q-bashorat, .pd-bash .q-chip { animation: none !important; transition: none !important; }
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
