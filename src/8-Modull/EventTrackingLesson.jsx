import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 10-Modul · 2-dars «Hodisalar tizimi: har harakat jadvalga yoziladi» (m8-02) — skeletdan (src/skelet/NamunaDars.jsx, konveyer 04.10),
// manba-haqiqat: feedback/F-1005-10modul/02-EventTracking-v3.md (GATE M). TEX + 2 amaliyot bloki, palitra qolipRang('tex').
// 18 ekran: s0 QKirish · s1 QReja · s2/4/6/9/11 QTushuncha · s3/5/7/10 test (QuestionScreen → QTest) · s8 QKod (+ HtmlCompiler) ·
//   s12 final QTartib · a1/a2 amaliyot bloki (QBlok + ScreenBlok) · podium · sflash QKartochka (alohida, Mentorsiz) · s17 QYakun.
// Bitta vizual — «Hodisalar chizmasi» (HODISA_TUGUNLAR → Telefon · Tugun · Yolak · Jadval · Chizma), har ekran shundan.
// Infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletdagidek, TEGILMAGAN.
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ru-qoldiq-istisno s8: javob
// (s8 — app.js o'qish paneli: `const javob = await saqla(...)` — kod o'zgaruvchisi, tarjima qilinmaydi)
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QQadamlar, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QKod, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';
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

const LESSON_META = { lessonId: 'm8-02-event-tracking-v1', lessonTitle: { uz: 'Hodisalar tizimi: har harakat jadvalga yoziladi', ru: 'Система событий: каждое действие записывается в таблицу' } };
// 18 ekran · oqim: kirish → reja → (tushuncha → test) ×4 · kod · final → A1 · A2 → podium → kartochkalar → yakun (MD v3)
const HW_TOKENS = [
  { t: { uz: 'hodisa', ru: 'событие' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: 'hodisalar', l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'brauzer ID', ru: 'ID браузера' }, l: 20, tp: 70, s: 12, d: 8.5 },
  { t: 'POST /hodisalar', l: 70, tp: 68, s: 12, d: 6.8 }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). ✔ o'rni MD v3 dagidek: s3 B · s5 C · s7 A · s10 D; s12 — final sentinel 0
// (picked 0 → birinchi urinishda topdi). `practice: -1` — kod ekrani (8) va bloklar (13, 14) uchun sentinel (variant yo'q; signal PRACTICE_BASE + ekran).
const INLINE_KEYS = { s3: 1, s5: 2, s7: 0, s10: 3, s12: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); emoji o'rniga koddan bitta qator (S-026)
const RcKod = ({ children }) => <code className="qcode">{children}</code>;
const RECAPS = {
  3: {
    title: { uz: 'Hodisa Backend orqali yoziladi', ru: "Событие записывается через Backend" },
    cards: [
      { ic: null, h: <RcKod>hodisaYoz('vaqt-tanladi')</RcKod>, body: { uz: 'Sayt harakatni yuboradi — POST /hodisalar.', ru: 'Сайт отправляет действие — POST /hodisalar.' } },
      { ic: null, h: <RcKod>DATABASE_URL</RcKod>, body: { uz: "Backend'da turadi — Database'ga faqat Backend yozadi.", ru: 'Хранится в Backend — в Database пишет только Backend.' } },
      { ic: null, h: <RcKod>hodisalar</RcKod>, body: { uz: 'Jadvaldagi har qator — bitta hodisa.', ru: 'Каждая строка в таблице — одно событие.' }, ask: { uz: "Nega sayt Database'ga o'zi yozmaydi?", ru: 'Почему сайт не пишет в Database сам?' } }
    ]
  },
  5: {
    title: { uz: 'Uchta nom, boshqasi — 400', ru: 'Три названия, остальное — 400' },
    cards: [
      { ic: null, h: <RcKod>['ochdi', 'vaqt-tanladi', 'band-qildi']</RcKod>, body: { uz: "Backend'dagi ro'yxat — faqat shu nomlar yoziladi.", ru: 'Список в Backend — пишутся только эти названия.' } },
      { ic: null, h: <RcKod>400</RcKod>, body: { uz: "Nom ro'yxatda yo'q — so'rov rad etiladi, qator yozilmaydi.", ru: 'Названия нет в списке — запрос отклоняется, строка не пишется.' } },
      { ic: null, h: <RcKod>Band qildi</RcKod>, body: { uz: "Ro'yxat bo'lmasa — bitta harakat ikki nom bilan sanalardi.", ru: 'Без списка одно действие считалось бы под двумя названиями.' }, ask: { uz: 'Backend nomni nega o\'zi tuzatmaydi?', ru: 'Почему Backend сам не исправляет название?' } }
    ]
  },
  7: {
    title: { uz: 'Brauzer ID brauzerni ajratadi', ru: "ID браузера различает браузеры" },
    cards: [
      { ic: null, h: <RcKod>maydon-brauzer</RcKod>, body: { uz: "Brauzer xotirasida turadi — sahifa yangilansa ham o'sha.", ru: 'Хранится в памяти браузера — при обновлении страницы тот же.' } },
      { ic: null, h: <RcKod>7f3a… · c91e…</RcKod>, body: { uz: 'Boshqa brauzer — boshqa ID.', ru: 'Другой браузер — другой ID.' } },
      { ic: null, h: <RcKod>brauzer_id</RcKod>, body: { uz: "Ism ham, telefon ham yo'q — odamni emas, brauzerni ajratadi.", ru: 'Ни имени, ни телефона — различает не человека, а браузер.' }, ask: { uz: 'Bitta odam uch qurilmadan kirsa, nechta brauzer ID bo\'ladi?', ru: 'Если один человек зайдёт с трёх устройств, сколько будет ID браузера?' } }
    ]
  },
  10: {
    title: { uz: 'Turli brauzerlar soni', ru: 'Число разных браузеров' },
    cards: [
      { ic: null, h: <RcKod>vaqt-tanladi · 7f3a…</RcKod>, body: { uz: 'Uch marta kelsa ham — bir marta sanaladi.', ru: 'Даже если пришёл три раза — считается один раз.' } },
      { ic: null, h: <RcKod>COUNT(DISTINCT brauzer_id)</RcKod>, body: { uz: 'Takrorlanmagan brauzer ID lar soni.', ru: 'Число неповторяющихся ID браузера.' } },
      { ic: null, h: <RcKod>3 · 2 · 1</RcKod>, body: { uz: 'Uch qadam bitta qoida bilan — sonlar bir o\'lchovda.', ru: "Три шага по одному правилу — числа можно сравнивать." }, ask: { uz: 'Qatorlarni sanasak, qaysi qadamdagi to\'xtash yashirinib qoladi?', ru: "Если считать строки, на каком шаге спрячется остановка?" } }
    ]
  },
  12: {
    title: { uz: 'Avval band, keyin hodisa', ru: 'Сначала бронь, потом событие' },
    cards: [
      { ic: null, h: <RcKod>POST /bandlar</RcKod>, body: { uz: 'Sayt bandni yuboradi, Backend saqlaydi.', ru: 'Сайт отправляет бронь, Backend сохраняет.' } },
      { ic: null, h: <RcKod>hodisaYoz('band-qildi')</RcKod>, body: { uz: 'Saqlangandan keyin hodisa yuboriladi.', ru: 'После сохранения отправляется событие.' } },
      { ic: null, h: <RcKod>201</RcKod>, body: { uz: "Nom to'g'ri — hodisalar ga qator tushadi.", ru: 'Название верное — в hodisalar попадает строка.' }, ask: { uz: 'band-qildi 409 tekshiruvidan oldin yuborilsa nima bo\'ladi?', ru: 'Что будет, если band-qildi отправить до проверки на 409?' } }
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

// ===== BITTA VIZUAL — «Hodisalar chizmasi» (163/180): HODISA_TUGUNLAR → Telefon · Tugun · Yolak · Jadval → Chizma; har ekran shu manbadan =====
// qolip-maket: hc-telefon hc-ilova hc-katak hc-band hc-kalit hc-usul
const cxx = (...a) => a.filter(Boolean).join(' ');
const useKamHarakat = () => typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
// Taymerlar ekrandan chiqilganda tozalanadi
const useTaymer = () => {
  const ref = useRef([]);
  useEffect(() => () => ref.current.forEach(clearTimeout), []);
  return useCallback((fn, ms) => { ref.current.push(setTimeout(fn, ms)); }, []);
};
const HODISA_NOMLARI = ['ochdi', 'vaqt-tanladi', 'band-qildi'];
const SOATLAR = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const HODISA_TUGUNLAR = {
  sayt: { nom: { uz: 'Sayt · React', ru: 'Сайт · React' }, ichki: 'hodisaYoz' },
  backend: { nom: 'Backend · NestJS' },
  db: { nom: 'Database · PostgreSQL' },
  umami: { nom: 'Umami' }
};
const USTUN_3 = ['id', 'nom', 'yaratilgan'];
const USTUN_4 = ['id', 'nom', 'brauzer_id', 'yaratilgan'];
// Namuna brauzer ID lar — mashq uchun yozilgan jadval ma'lumoti (MD A-5); rang — faqat qolip tokenlari (CSS: b1 accent · b2 ink · b3 ink2)
const BRAUZER_RANG = { '7f3a…': 'b1', 'c91e…': 'b2', 'e05b…': 'b3' };
const Joriy = ({ children }) => <p className="et-joriy fade-step">{children}</p>;
// Bashorat (SABOQ 11/19): karta yengil ko'tarilib kiradi, variantlar navbat bilan chiqadi; tanlangach ixcham qatorga «yig'iladi» va natijagacha turadi
const TaxminIxcham = ({ savol, javob }) => (
  <div className="et-taxmin et-yig"><span className="et-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="et-taxmin-s">{savol}</span><b>{javob}</b></div>
);
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="et-navbat-k et-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <TaxminIxcham savol={savol} javob={tr((variantlar.find(v => v.k === tanlov) || {}).t)} />);
// Natija bloki (SABOQ 25): bitta yashil blok — birinchi qator taxmin, so'ng izoh, xulosa va qo'shimcha qator. Ustma-ust bloklar yo'q.
const NatijaBlok = ({ tanlov, togri, variantlar, haqiqat, izoh, xulosa, qoshimcha }) => {
  const tx = variantlar.find(v => v.k === tanlov);
  const ok = tanlov === togri;
  return (
    <div className="q-xulosa et-nb">
      {tx && <span className={cxx('et-nb-t', ok && 'ok')}>{ok
        ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })}</>
        : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(haqiqat)}</b></>}</span>}
      {izoh && <span className="et-nb-i">{izoh}</span>}
      <span>{xulosa}</span>
      {qoshimcha && <span className="et-nb-q">{qoshimcha}</span>}
    </div>
  );
};

// Uchish (SABOQ 19): konvert yoki nuqta manbadan nishonga uchadi. Joylar DOM dan o'lchanadi — ⛶ kattalashganda ham, telefon ustma-ust turganda ham to'g'ri.
// Kam harakat rejimida uchmaydi — holat birdan o'zgaradi (DE-200).
const UCH_MS = 850;
const useUchish = () => {
  const box = useRef(null);
  const kam = useKamHarakat();
  const taymer = useTaymer();
  const [uchlar, setUchlar] = useState([]);
  const uchir = useCallback((manba, nishon, t, tur, ms = UCH_MS) => {
    const b = box.current; if (kam || !b) return;
    const s = b.querySelector(manba), n = b.querySelector(nishon); if (!s || !n) return;
    const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
    const m = (el) => { const r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - br.left) / z, y: (r.top + r.height / 2 - br.top) / z }; };
    const dav = tur === 'qayt' ? Math.round(ms * 1.8) : ms;
    const u = { k: String(Math.random()).slice(2), t, tur, a: m(s), b: m(n), dav };
    setUchlar(x => [...x, u]);
    taymer(() => setUchlar(x => x.filter(y => y.k !== u.k)), dav + 60);
  }, [kam, taymer]);
  return { box, uchlar, uchir, kam };
};
const Uchar = ({ u }) => (
  <span className={cxx('hc-uchar', u.tur, !u.t && 'nuqta')} aria-hidden="true"
    style={{ left: u.a.x + 'px', top: u.a.y + 'px', '--dx': (u.b.x - u.a.x) + 'px', '--dy': (u.b.y - u.a.y) + 'px', animationDuration: u.dav + 'ms' }}>{u.t}</span>
);

// O'yinchi telefoni = «Maydon» sayti (191 ramka; SABOQ 22–23): o'lchami barqaror ≈172×272 — bosh ekranda ham, ikki telefonli ekranda ham kichraymaydi.
// tex — ramka ustida texnologiya yorlig'i («Sayt · React» · hodisaYoz; alohida «Sayt» qutisi yo'q) · yorliq — telefon nomi (6-ekran) ·
// ekran — sahifa o'rniga ekranga xos mazmun · xotira — ichida pastki qator «Brauzer xotirasi» · children — telefon ostidagi o'z tugmasi
const Telefon = ({ holat = 'ochiq', tosgich, onOch, onKatak, onBand, xotira, yorliq, rang, tex, yangila, aylana, ekran, className, children }) => (
  <div className={cxx('hc-tel-ust', className)}>
    {tex && <span className="hc-tel-tex"><b>{tr(HODISA_TUGUNLAR.sayt.nom)}</b><code>{HODISA_TUGUNLAR.sayt.ichki}</code></span>}
    {yorliq && <span className={cxx('hc-tel-yorliq', rang)}>{yorliq}</span>}
    <div className="hc-telefon">
      <div className="hc-tel-manzil">{aylana ? <span key={yangila} className="hc-aylana" aria-hidden="true" /> : null}<i />{tosgich && <span className="hc-tosgich fade-step">{tr({ uz: "Reklama to'sgichi: yoqilgan", ru: 'Блокировщик рекламы: включён' })}</span>}</div>
      <div className="hc-tel-ekran" key={yangila || 'e'}>
        {ekran || (holat === 'yopiq' ? (
          <div className="hc-tel-uy">
            <button type="button" className={cxx('hc-ilova', onOch && 'et-navbat')} disabled={!onOch} onClick={onOch}><i />Maydon</button>
          </div>
        ) : (
          <div className="hc-tel-sahifa fade-step">
            <b className="hc-tel-sar">Maydon</b>
            <span className="hc-tel-kun">{tr({ uz: 'Bugun', ru: 'Сегодня' })}</span>
            <div className="hc-kataklar">
              {SOATLAR.map(s => {
                const bu = s === '18:00' && holat !== 'ochiq';
                return <button key={s} type="button" className={cxx('hc-katak', bu && (holat === 'band' ? 'band' : 'on'), onKatak && s === '18:00' && 'et-navbat')} disabled={!onKatak} onClick={() => onKatak && onKatak(s)}>{s}</button>;
              })}
            </div>
            {(holat === 'forma' || holat === 'band') && <div className="hc-forma fade-step">
              <span className="hc-input"><small>{tr({ uz: 'Ism', ru: 'Имя' })}</small>Ali</span>
              <span className="hc-input"><small>{tr({ uz: 'Telefon', ru: 'Телефон' })}</small>+998 90 000 00 01</span>
              <button type="button" className={cxx('hc-band', onBand && 'et-navbat', holat === 'band' && 'tayyor')} disabled={!onBand} onClick={onBand}>{holat === 'band' ? '✓ ' : ''}{tr({ uz: 'Band qilish', ru: 'Забронировать' })}</button>
            </div>}
          </div>
        ))}
      </div>
      {xotira !== undefined && <div className={cxx('hc-xotira', xotira && 'bor')} key={xotira || 'bosh'}>
        <span className="hc-xotira-n">{tr({ uz: 'Brauzer xotirasi (localStorage)', ru: 'Память браузера (localStorage)' })}</span>
        <code>maydon-brauzer: {xotira || tr({ uz: "bo'sh", ru: 'пусто' })}</code>
      </div>}
    </div>
    {children}
  </div>
);
const Tugun = ({ nom, holat, children, className }) => (
  <div className={cxx('hc-tugun', holat, className)}>
    <span className="hc-tugun-n">{nom}</span>
    {holat === 'ok' && <span className="hc-holat ok" key="ok">✓ 201</span>}
    {holat === 'err' && <span className="hc-holat err" key="err">400</span>}
    {children}
  </div>
);
const NomRoyxat = ({ kulrang, yon }) => <div className={cxx('hc-nomlar', kulrang && 'kulrang')}>{HODISA_NOMLARI.map(n => <code key={n + (n === yon ? '-y' : '')} className={n === yon ? 'yon' : undefined}>{n}</code>)}</div>;
// Jadval: faqat yangi tushgan qator (yangiK) sirg'alib kirib ~1 s yashil yonadi; navbat — qatorlar kirishda birin-ketin chiqadi
const Jadval = ({ nom, ustunlar = [], qatorlar = [], bosh, yangiUstun, yangiK, navbat, children, className }) => (
  <div className={cxx('hc-jadval', bosh && 'bosh', className)}>
    <span className="hc-jadval-n"><code>{nom}</code></span>
    {!bosh && <table className="hc-jt">
      <thead><tr>{ustunlar.map(u => <th key={u} className={u === yangiUstun ? 'yangi' : undefined}>{u}</th>)}</tr></thead>
      <tbody>{qatorlar.map((q, i) => <tr key={q.k} data-k={q.k} style={navbat ? { '--d': (0.25 + i * 0.08) + 's' } : undefined} className={cxx(q.rang, q.qiz && 'qiz', q.xira && 'xira', q.yon && 'yon', yangiK != null && q.k === yangiK && 'kir', navbat && 'navbat')}>{q.c.map((v, j) => <td key={j} className={BRAUZER_RANG[v] ? 'br' : undefined}>{v}</td>)}</tr>)}</tbody>
    </table>}
    {children}
  </div>
);
// Hodisalar chizmasi (SABOQ 21/23/24): chapda telefon = sayt (ustida «Sayt · React» · hodisaYoz) → yo'lak → o'ngda Backend · NestJS → Database (faqat hodisalar).
// Konvert telefondan Backend'ga uchadi, Backend javobi chiqadi, jadvalga qator yashil kiradi. Umami — telefondan alohida ingichka kulrang chiziq.
// bandlar jadvali yo'q — dalil kerak bo'lsa bitta belgi «+1 band ✓».
const Chizma = ({ boxRef, uchlar = [], tel, telEkran, telBola, yolak = 'POST /hodisalar', umami, backend, beIchi, beOst, band, qatorlar = [], yangiK, ustunlar = USTUN_3, jadvalIchi, izoh, pastki }) => (
  <div className="hc-chizma-ust" ref={boxRef}>
    <div className="hc-chizma">
      <Telefon holat={tel} ekran={telEkran} tex>{telBola}</Telefon>
      <div className="hc-ch-yol" aria-hidden="true">
        <span className="hc-yol-matn" key={yolak}>{yolak}</span>
        <i className="hc-yol-chiziq" />
        {umami !== undefined && <span className="hc-um-yol"><i /><span className="hc-umami">{HODISA_TUGUNLAR.umami.nom}{Array.from({ length: Math.min(umami, 3) }, (_, i) => <b key={i} />)}</span></span>}
      </div>
      <div className="hc-ch-ong">
        <Tugun nom={HODISA_TUGUNLAR.backend.nom} holat={backend} className="hc-be">{beIchi}</Tugun>
        {beOst}
        <i className="hc-pastga" aria-hidden="true" />
        <div className="hc-db">
          <span className="hc-tugun-n">{HODISA_TUGUNLAR.db.nom}</span>
          {band && <span className="hc-band-son">bandlar <b>+1 band ✓</b></span>}
          <Jadval nom="hodisalar" ustunlar={ustunlar} qatorlar={qatorlar} yangiK={yangiK}>{jadvalIchi}</Jadval>
        </div>
        {izoh}
      </div>
    </div>
    {pastki}
    {uchlar.map(u => <Uchar key={u.k} u={u} />)}
  </div>
);
const S2_QATORLAR = [
  { k: 1, c: ['1', 'ochdi', '16:02'] },
  { k: 2, c: ['2', 'vaqt-tanladi', '16:03'] },
  { k: 3, c: ['3', 'band-qildi', '16:03'] }
];
// Uch harakat oqimi (1 va 2-ekran): telefon o'zgaradi → konvert telefondan Backend'ga uchadi → ✓ 201 → hodisalar ga qator yashil kiradi; Umami'ga alohida kulrang nuqta.
// 3-qadamda avval band saqlanadi (POST /bandlar → «+1 band ✓»), saqlangach — band-qildi.
const OQIM_TEL = ['ochiq', 'forma', 'band'];
const useOqim = (avval, uchir, taymer, kam) => {
  const [n, setN] = useState(avval ? 3 : 0);
  const [tel, setTel] = useState(avval ? 'band' : 'yopiq');
  const [band, setBand] = useState(avval);
  const [backend, setBackend] = useState(avval ? 'ok' : null);
  const [yangiK, setYangiK] = useState(null);
  const [umami, setUmami] = useState(avval ? 3 : 0);
  const [yolak, setYolak] = useState('POST /hodisalar');
  const [yur, setYur] = useState(false);
  const d = kam ? 0 : UCH_MS;
  const t0 = kam ? 0 : 160;
  const keyingi = () => {
    if (yur || n >= 3) return;
    const i = n; setYur(true); setTel(OQIM_TEL[i]); setBackend(null); setYangiK(null);
    const hodisa = (bosh) => {
      taymer(() => { setYolak('POST /hodisalar'); setBackend(null); uchir('.hc-telefon', '.hc-be', HODISA_NOMLARI[i]); uchir('.hc-telefon', '.hc-umami', '', 'kul'); }, bosh);
      taymer(() => { setBackend('ok'); setN(i + 1); setYangiK(i + 1); setUmami(u => u + 1); setYur(false); }, bosh + d);
    };
    if (i < 2) { hodisa(t0); return; }
    taymer(() => { setYolak('POST /bandlar'); uchir('.hc-telefon', '.hc-be', 'POST /bandlar'); }, t0);
    taymer(() => { setBackend('ok'); setBand(true); }, t0 + d);
    hodisa(t0 + d + (kam ? 0 : 600));
  };
  return { n, tel, band, backend, yangiK, umami, yolak, yur, keyingi, qatorlar: S2_QATORLAR.slice(0, n) };
};

// ===== SCREEN 0 — KIRISH (QKirish): band bor, Umami'da yo'q =====
const HOOK_OPTS = [
  { id: 'a', t: { uz: "Umami son ko'rsatishga ulgurmadi", ru: 'Umami не успел показать число' } },
  { id: 'b', t: { uz: 'Bu telefonda Umami skripti ishlamadi', ru: 'На этом телефоне скрипт Umami не сработал' } },
  { id: 'c', t: { uz: 'Band qilganda internet uzilib qoldi', ru: 'При бронировании пропал интернет' } }
];
const HOOK_JAVOB = {
  a: { uz: <><b>Qiziq fikr!</b> Kutsangiz ham son o'zgarmaydi: bu telefondan Umami'ga hech narsa kelmadi.</>, ru: <><b>Интересная мысль!</b> Даже если подождать, число не изменится: с этого телефона в Umami ничего не пришло.</> },
  b: { uz: <><b>Aynan!</b> Bu misolda reklama to'sgichi Umami skriptini to'sdi. Band esa Backend orqali Database'ga yozildi.</>, ru: <><b>Именно!</b> В этом примере блокировщик рекламы заблокировал скрипт Umami. А бронь записалась в Database через Backend.</> },
  c: { uz: <><b>Qiziq fikr!</b> Internet uzilsa, band ham yozilmasdi. Band esa jadvalda turibdi.</>, ru: <><b>Интересная мысль!</b> Если бы пропал интернет, бронь тоже не записалась бы. А она есть в таблице.</> }
};
// SABOQ 24: bandlar jadvali va Umami hisobot kartasi o'rniga — band qilingach telefon yonida ikki jonli hisoblagich
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { box, uchlar, uchir, kam } = useUchish();
  const taymer = useTaymer();
  const [tel, setTel] = useState(storedAnswer ? 'band' : 'yopiq'); // yopiq → ochiq → forma → band
  const [hisob, setHisob] = useState(storedAnswer ? 2 : 0); // 0 — hisoblagich yo'q · 1 — chiqdi, konvert yo'lda · 2 — yetib keldi
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const qadam = (h) => { setTel(h); setSc(n => n + 1); };
  const bandQil = () => {
    qadam('band'); setHisob(1);
    taymer(() => { uchir('.hc-telefon', '.hc-hb-k.maydon .hc-hb-son', 'POST /bandlar'); uchir('.hc-telefon', '.hc-hb-k.umami .hc-tosuv', '', 'tosildi'); }, kam ? 0 : 420);
    taymer(() => { setHisob(2); setSc(n => n + 1); }, kam ? 0 : 420 + UCH_MS);
  };
  const pick = (v) => { if (picked !== null || hisob < 2) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Band yozildi, Umami esa <span className="italic" style={{ color: T.accent }}>ko'rmadi</span>. Nega?</>, ru: <>Бронь записалась, а Umami её <span className="italic" style={{ color: T.accent }}>не увидел</span>. Почему?</> })}
        mentor={<Mentor>{tr({ uz: "O'tgan darsda bosh raqamni tanladingiz — haftada band qilingan vaqtlar. Shu telefonda «Maydon»ni oching va 18:00 ni band qiling.", ru: "На прошлом уроке вы выбрали главное число — брони за неделю. Откройте «Maydon» на этом телефоне и забронируйте 18:00." })}</Mentor>}
        maket={<div className="hc-kirish" ref={box}>
          <Telefon holat={tel} tosgich
            onOch={tel === 'yopiq' ? () => qadam('ochiq') : undefined}
            onKatak={tel === 'ochiq' ? (s) => { if (s === '18:00') qadam('forma'); } : undefined}
            onBand={tel === 'forma' ? bandQil : undefined} />
          {hisob > 0 && <div className="hc-hb">
            <div className={cxx('hc-hb-k maydon', hisob === 2 && 'tushdi')}>
              <span className="hc-hb-n">{tr({ uz: 'Maydon jadvali', ru: "Таблица «Maydon»" })}</span>
              <b className="hc-hb-son" key={hisob}>{hisob === 2 ? tr({ uz: '+1 band ✓', ru: '+1 бронь ✓' }) : '0'}</b>
            </div>
            <div className={cxx('hc-hb-k umami', hisob === 2 && 'tushdi')}>
              <span className="hc-hb-n"><i className="hc-tosuv" aria-hidden="true" />{HODISA_TUGUNLAR.umami.nom}</span>
              <b className="hc-hb-son" key={hisob}>0</b>
            </div>
            {picked !== null && <Jadval nom="hodisalar" bosh className="fade-step" />}
          </div>}
          {uchlar.map(u => <Uchar key={u.k} u={u} />)}
        </div>}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={hisob < 2}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda chizma tayyor holatda, bir marta o'zi o'ynaydi =====
const REJA = [
  { t: { uz: 'Harakat saytdan hodisa bo\'lib chiqadi', ru: "Действие уходит с сайта как событие" }, teg: 'hodisa' },
  { t: { uz: 'Backend hodisa nomini tekshiradi', ru: 'Backend проверяет название события' }, teg: 'Backend' },
  { t: { uz: 'Hodisa jadvalga ismsiz yoziladi', ru: 'Событие записывается в таблицу без имени' }, teg: 'Database' },
  { t: { uz: 'Uch hodisa Umami bilan solishtiriladi', ru: 'Три события сравниваются с Umami' }, teg: { uz: 'uch hodisa', ru: 'три события' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const { box, uchlar, uchir, kam } = useUchish();
  const taymer = useTaymer();
  const o = useOqim(kam, uchir, taymer, kam);
  useEffect(() => { if (o.n >= 3 || o.yur) return undefined; const t = setTimeout(o.keyingi, o.n === 0 ? 1000 : 700); return () => clearTimeout(t); }, [o.n, o.yur]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun «Maydon» uch hodisani <span className="italic" style={{ color: T.accent }}>o'z jadvaliga</span> yozadi.</>, ru: <>«Maydon» запишет три события <span className="italic" style={{ color: T.accent }}>в свою таблицу</span>.</> })}
        mentor={<Mentor>{tr({ uz: 'Umami qoladi — yonida o\'z jadvalimiz paydo bo\'ladi. Kodning bir qismini Antigravity yozadi, uch chaqiruvni esa o\'zingiz yozasiz.', ru: 'Umami остаётся — рядом появится наша таблица. Часть кода напишет Antigravity, а три вызова вы напишете сами.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida — «Maydon» shunday yozadi', ru: "В конце урока «Maydon» будет записывать так" })}
        chap={<Chizma boxRef={box} uchlar={uchlar} tel={o.tel} yolak={o.yolak} umami={o.umami} backend={o.backend} band={o.band} qatorlar={o.qatorlar} yangiK={o.yangiK} />}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <p className="et-repo mono">{tr({ uz: 'repo', ru: 'репо' })} <code>maydon</code> · {tr({ uz: 'boshlanish', ru: 'начало' })} <code>m10-dars-02-start</code> · {tr({ uz: 'tayyor namuna', ru: 'готовый образец' })} <code>m10-dars-02-done</code></p>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA: bitta bosish jadvalga (bashorat + 3 qadam; tugma telefon ostida) =====
const S2_SAVOL = { uz: "Uch harakatdan keyin `hodisalar` jadvalida nechta qator bo'ladi?", ru: 'Сколько строк будет в таблице `hodisalar` после трёх действий?' };
const S2_TAXMIN = [{ k: '1', t: { uz: 'Bitta', ru: 'Одна' } }, { k: '2', t: { uz: 'Ikkita', ru: 'Две' } }, { k: '3', t: { uz: 'Uchta', ru: 'Три' } }];
const S2_QADAMLAR = [{ uz: 'Saytni oching', ru: 'Откройте сайт' }, { uz: '18:00 ni tanlang', ru: 'Выберите 18:00' }, { uz: 'Band qiling', ru: 'Забронируйте' }];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, kam } = useUchish();
  const taymer = useTaymer();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const o = useOqim(!!storedAnswer, uchir, taymer, kam);
  const n = o.n;
  const done = n >= 3;
  const tugadi = useTugadi(done, 1200, !!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const qadamI = Math.min(n, 2);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · hodisa', ru: 'Понятие · событие' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Harakatlarni bajaring (${n}/3)`, ru: `Выполните действия (${n}/3)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Bitta bosish jadvalga <span className="italic" style={{ color: T.accent }}>qanday yetib boradi</span>?</>, ru: <>Как одно нажатие <span className="italic" style={{ color: T.accent }}>доходит до таблицы</span>?</> })}
        mentor={<Mentor>{tr({ uz: "Odam qaysi qadamda to'xtaganini ko'rish uchun har harakat yozib boriladi. Uch harakatni navbat bilan bajaring va chizmaga qarang.", ru: "Чтобы видеть, на каком шаге человек остановился, каждое действие записывается. Выполните три действия по очереди и следите за схемой." })}</Mentor>}
        bashorat={<Bashorat savol={fmtCode(tr(S2_SAVOL))} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<Chizma boxRef={box} uchlar={uchlar} tel={o.tel} yolak={o.yolak} umami={o.umami} backend={o.backend} band={o.band} qatorlar={o.qatorlar} yangiK={o.yangiK}
          telBola={taxmin && !done && <QTugma className={cxx('et-tel-btn', !o.yur && 'et-navbat')} disabled={o.yur} onClick={o.keyingi}>{tr(S2_QADAMLAR[qadamI])}<small className="et-qn">{qadamI + 1}/3</small></QTugma>}
          izoh={n >= 1 && !done && <Joriy>{fmtCode(tr({ uz: "Umami ochilishni o'zi yozardi. O'z jadvalimizga esa ochilish ham nom bilan keladi — `ochdi`.", ru: 'Umami записывал открытие сам. А в нашу таблицу открытие тоже приходит с названием — `ochdi`.' }))}</Joriy>} />}
        natija={done && <NatijaBlok tanlov={taxmin} togri="3" variantlar={S2_TAXMIN} haqiqat={{ uz: 'uchta', ru: 'три' }}
          izoh={tr({ uz: 'Jadvaldagi har qator — bitta hodisa.', ru: 'Каждая строка в таблице — одно событие.' })}
          xulosa={tr({ uz: "Biz tanlagan uch harakatni sayt Backend'ga yuboradi; so'rov o'tsa, Backend jadvalga bitta qator yozadi.", ru: 'Три выбранных нами действия сайт отправляет в Backend; если запрос прошёл, Backend пишет в таблицу одну строку.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — TEST 1 (INLINE_KEYS.s3 = 1, B) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="O'yinchi 18:00 ni tanladi. vaqt-tanladi jadvalga qanday yetadi?"
    question={tr({ uz: <h2 className="title h-ask">O'yinchi 18:00 ni tanladi. <code className="qcode">vaqt-tanladi</code> jadvalga <span className="italic" style={{ color: T.accent }}>qanday yetadi</span>?</h2>, ru: <h2 className="title h-ask">Игрок выбрал 18:00. Как <code className="qcode">vaqt-tanladi</code> <span className="italic" style={{ color: T.accent }}>доходит до таблицы</span>?</h2> })}
    options={[
      { uz: "Sayt uni to'g'ridan Database'ga yozadi", ru: 'Сайт сам пишет его прямо в Database' },
      { uz: 'Sayt yuboradi, Backend jadvalga yozadi', ru: 'Сайт отправляет, Backend пишет в таблицу' },
      { uz: "Umami uni jadvalga o'zi ko'chirib qo'yadi", ru: 'Umami сам переносит его в таблицу' },
      { uz: "Backend uni saytdan o'zi so'rab oladi", ru: 'Backend сам запрашивает его у сайта' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Sayt `POST /hodisalar` yuboradi, Database'ga esa faqat Backend yozadi.", ru: 'Сайт отправляет `POST /hodisalar`, а в Database пишет только Backend.' }}
    explainWrong={{
      0: { uz: "`DATABASE_URL` Backend'da — sayt Database'ni ko'rmaydi.", ru: '`DATABASE_URL` в Backend — сайт не видит Database.' },
      2: { uz: "Umami o'z hisobiga yozadi — bizning jadvalga tegmaydi.", ru: 'Umami пишет в свой аккаунт — нашу таблицу не трогает.' },
      3: { uz: "Backend kutib turadi — hodisani sayt o'zi yuboradi.", ru: 'Backend ждёт — событие сайт отправляет сам.' },
      default: { uz: "Database'ga faqat Backend yozadi.", ru: 'В Database пишет только Backend.' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA: nom tekshiruvi (bashorat + 2 bosqich). Bir vaqtda BITTA so'rov telefonda — «Yuborish» → konvert Backend'ga → 201 / 400 =====
const S4_SAVOL = { uz: 'Sayt `Band qildi` deb yuborsa, nima bo\'ladi?', ru: 'Что будет, если сайт отправит `Band qildi`?' };
const S4_TAXMIN = [{ k: 'yoz', t: { uz: 'Jadvalga yoziladi', ru: 'Запишется в таблицу' } }, { k: 'rad', t: { uz: 'Backend rad etadi', ru: 'Backend отклонит' } }];
const S4_SOROVLAR = [
  { nom: 'ochdi' },
  { nom: 'Band qildi', xato: { uz: "Ro'yxatda yo'q: katta harf va bo'sh joy.", ru: 'Нет в списке: заглавная буква и пробел.' } },
  { nom: 'vaqt-tanladi' },
  { nom: 'vaqt_tanladi', xato: { uz: "Ro'yxatda yo'q: chiziqcha o'rniga pastki chiziq.", ru: 'Нет в списке: подчёркивание вместо дефиса.' } },
  { nom: 'band-qildi' }
];
const S4_RAD = [1, 3]; // rad etiladigan so'rovlar — tekshiruv o'chsa qayta boradi
const S4_SANOQ = ['ochdi', 'vaqt-tanladi', 'vaqt_tanladi', 'band-qildi', 'Band qildi'];
// Telefon ekrani: sayt kodi chaqiruvi — hozir yuboriladigan bitta so'rov (katta)
const SorovEkran = ({ i }) => (
  <div className="hc-se fade-step" key={i}>
    <b className="hc-tel-sar">Maydon</b>
    <span className="hc-se-kod"><code>hodisaYoz(</code><code className="hc-se-nom">'{S4_SOROVLAR[i].nom}'</code><code>)</code></span>
    <span className="hc-se-yol">POST /hodisalar</span>
    <span className="hc-se-son">{i + 1} / {S4_SOROVLAR.length}</span>
  </div>
);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, kam } = useUchish();
  const taymer = useTaymer();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [yub, setYub] = useState(() => (avval ? S4_SOROVLAR.map((_, i) => i) : [])); // yuborilish tartibi
  const [kor, setKor] = useState(avval ? S4_SOROVLAR.length : 0); // telefonda ko'rinayotgan so'rov
  const [tek, setTek] = useState(true);
  const [ochirildi, setOchirildi] = useState(avval);
  const [qayta, setQayta] = useState(0); // tekshiruv o'chgach qayta borib yozilgan rad so'rovlar
  const [holat, setHolat] = useState(null);
  const [yon, setYon] = useState(null);
  const [rad, setRad] = useState(null);
  const [yangiK, setYangiK] = useState(null);
  const [yur, setYur] = useState(false);
  const d = kam ? 0 : UCH_MS;
  const hammasi = yub.length === S4_SOROVLAR.length;
  const done = hammasi && ochirildi && !yur;
  const tugadi = useTugadi(done, 1800, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tk = tek || tugadi; // tugagach — tekshiruv yoqilgan holat fokusga
  const yubor = () => {
    const i = yub.length;
    if (!taxmin || yur || i >= S4_SOROVLAR.length) return;
    const s = S4_SOROVLAR[i]; const ok = !s.xato;
    setYur(true); setHolat(null); setRad(null); setYangiK(null); setYon(null);
    uchir('.hc-telefon', '.hc-be', s.nom, ok ? undefined : 'qayt');
    taymer(() => { setHolat(ok ? 'ok' : 'err'); setYub(y => [...y, i]); if (ok) { setYangiK('q' + i); setYon(s.nom); } else setRad(i); }, d);
    taymer(() => { setKor(i + 1); setYur(false); }, ok ? d + 300 : Math.round(d * 1.8) + 300);
  };
  const kalit = () => {
    if (!hammasi || yur || tugadi) return;
    const yangi = !tek; setTek(yangi); setRad(null); setYon(null);
    if (yangi) { setQayta(0); setHolat(null); return; }
    setYur(true); setHolat(null);
    S4_RAD.forEach((ri, j) => {
      const t1 = j * Math.round(d * 0.75) + (kam ? 0 : 250);
      taymer(() => uchir('.hc-telefon', '.hc-be', S4_SOROVLAR[ri].nom, 'och'), t1);
      taymer(() => { setHolat('ok'); setQayta(j + 1); setYangiK('r' + ri); }, t1 + d);
    });
    taymer(() => { setOchirildi(true); setYur(false); }, Math.round(d * 0.75) + d + (kam ? 0 : 450));
  };
  let id = 0;
  const qatorlar = yub.filter(i => !S4_SOROVLAR[i].xato).map(i => { id += 1; return { k: 'q' + i, c: [String(id), S4_SOROVLAR[i].nom, '16:2' + id] }; });
  if (!tk) S4_RAD.slice(0, qayta).forEach(ri => { id += 1; qatorlar.push({ k: 'r' + ri, c: [String(id), S4_SOROVLAR[ri].nom, '16:2' + id], qiz: true }); });
  const birinchi400 = yub.some(i => S4_SOROVLAR[i].xato);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Backend tekshiruvi', ru: 'Понятие · проверка в Backend' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !hammasi ? tr({ uz: `So'rovlarni yuboring (${yub.length}/5)`, ru: `Отправьте запросы (${yub.length}/5)` }) : !done ? tr({ uz: "Tekshiruvni o'chirib ko'ring", ru: 'Попробуйте выключить проверку' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Nomi xato yozilgan hodisa <span className="italic" style={{ color: T.accent }}>jadvalga kiradimi</span>?</>, ru: <>Попадёт ли в таблицу событие <span className="italic" style={{ color: T.accent }}>с ошибкой в названии</span>?</> })}
        mentor={<Mentor>{tr({ uz: "Sayt kodida bitta harf adashsa, hodisa boshqa nom bilan keladi. Har so'rovni Backend'ga yuboring va jadvalga qarang.", ru: "Если в коде сайта ошибиться в одной букве, событие придёт с другим названием. Отправьте каждый запрос в Backend и следите за таблицей." })}</Mentor>}
        bashorat={<Bashorat savol={fmtCode(tr(S4_SAVOL))} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<Chizma boxRef={box} uchlar={uchlar} tel="ochiq" telEkran={kor < S4_SOROVLAR.length ? <SorovEkran i={kor} /> : null} backend={holat}
          telBola={taxmin && kor < S4_SOROVLAR.length && <QTugma className={cxx('et-tel-btn', !yur && 'et-navbat')} disabled={yur} onClick={yubor}>{tr({ uz: 'Yuborish', ru: 'Отправить' })}<small className="et-qn">{kor + 1}/5</small></QTugma>}
          beIchi={<>
            <NomRoyxat kulrang={!tk} yon={yon} />
            {hammasi && !tugadi && <div className="hc-kalit-ust fade-step">
              <button type="button" className={cxx('hc-kalit', !tek && 'off', !ochirildi && !yur && 'et-navbat')} onClick={kalit}><i />{tek ? tr({ uz: 'Tekshiruv: yoqilgan', ru: 'Проверка: включена' }) : tr({ uz: "Tekshiruv: o'chirilgan", ru: 'Проверка: выключена' })}</button>
              <span className="hc-kalit-izoh">{tr({ uz: 'faqat shu maketda', ru: 'только в этом макете' })}</span>
            </div>}
          </>}
          beOst={rad !== null && !tugadi && <QXato>{tr(S4_SOROVLAR[rad].xato)}</QXato>}
          qatorlar={qatorlar} yangiK={yangiK}
          jadvalIchi={!tk && qayta >= S4_RAD.length && <div className="hc-sanoq fade-step">{S4_SANOQ.map(nm => <span key={nm}><code>{nm}</code> 1</span>)}</div>}
          izoh={birinchi400 && !done && <Joriy>{tr({ uz: "Nom ro'yxatda bo'lmasa, Backend 400 qaytaradi — so'rov rad etiladi.", ru: 'Если названия нет в списке, Backend возвращает 400 — запрос отклоняется.' })}</Joriy>}
          pastki={yub.length > 0 && !tugadi && <div className="hc-otgan">{yub.map(i => <span key={i} className={S4_SOROVLAR[i].xato ? 'err' : 'ok'}><code>{S4_SOROVLAR[i].nom}</code> {S4_SOROVLAR[i].xato ? '✗' : '✓'}</span>)}</div>} />}
        natija={done && <NatijaBlok tanlov={taxmin} togri="rad" variantlar={S4_TAXMIN} haqiqat={{ uz: 'rad etildi', ru: 'отклонён' }}
          xulosa={tr({ uz: "«Maydon» Backend'i faqat shu uchta nomni qabul qiladi. Shunda bitta harakat ikki xil nom bilan sanalmaydi.", ru: 'Backend «Maydon» принимает только эти три названия. Так одно действие не считается под двумя разными названиями.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — TEST 2 (INLINE_KEYS.s5 = 2, C) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Sayt Band-qildi deb yubordi. Backend nima qiladi?"
    question={tr({ uz: <h2 className="title h-ask">Sayt <code className="qcode">Band-qildi</code> deb yubordi. Backend <span className="italic" style={{ color: T.accent }}>nima qiladi</span>?</h2>, ru: <h2 className="title h-ask">Сайт отправил <code className="qcode">Band-qildi</code>. Что <span className="italic" style={{ color: T.accent }}>сделает Backend</span>?</h2> })}
    options={[
      { uz: "Nomni o'zi tuzatib, jadvalga yozib qo'yadi", ru: 'Сам исправит название и запишет в таблицу' },
      { uz: "Yangi hodisa sifatida jadvalga qo'shadi", ru: 'Добавит в таблицу как новое событие' },
      { uz: '400 bilan rad etadi, qator yozilmaydi', ru: 'Отклонит с кодом 400, строка не запишется' },
      { uz: 'Saytni to\'xtatib, xato sahifasini ochadi', ru: 'Остановит сайт и откроет страницу ошибки' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Ro'yxatda kichik harfli `band-qildi` bor — katta harfli nom rad etiladi.", ru: 'В списке есть `band-qildi` со строчной буквы — название с заглавной отклоняется.' }}
    explainWrong={{
      0: { uz: 'Backend nomni tuzatmaydi — faqat ro\'yxat bilan solishtiradi.', ru: 'Backend не исправляет название — только сверяет со списком.' },
      1: { uz: 'Yangi nom yozilsa, bitta harakat ikki xil sanaladi.', ru: "Если записать новое название, одно действие посчитается под двумя названиями." },
      3: { uz: "Backend saytni to'xtatmaydi — so'rovni oladi yoki rad etadi.", ru: 'Backend не останавливает сайт — принимает запрос или отклоняет.' },
      default: { uz: "Backend nomni ro'yxat bilan solishtiradi.", ru: 'Backend сверяет название со списком.' }
    }} />
);

// ===== SCREEN 6 — TUSHUNCHA: brauzer ID (bashorat + 3 qadam). Ikki telefon CHAPDA to'liq o'lchamda, har biri ostida o'z tugmasi; jadval O'NGDA =====
const S6_SAVOL = { uz: '1-telefonda sahifa yangilansa, jadval uni yangi brauzer deb yozadimi?', ru: 'Если обновить страницу на телефоне 1, таблица запишет его как новый браузер?' };
const S6_TAXMIN = [{ k: 'ha', t: { uz: 'Ha, yangi brauzer', ru: 'Да, новый браузер' } }, { k: 'yoq', t: { uz: "Yo'q, o'sha brauzer", ru: 'Нет, тот же браузер' } }];
// Telefon ostidagi tugmalar: 1-telefon — «Ochish», keyin «Yangilash»; 2-telefon — «Ochish». Bajarilgani — oddiy izoh-matn (qolip q-2)
const S6_TUGMA = [{ uz: 'Ochish', ru: 'Открыть' }, { uz: 'Yangilash', ru: 'Обновить' }, { uz: 'Ochish', ru: 'Открыть' }];
const S6_BAJARILDI = [{ uz: 'Yangilandi', ru: 'Обновлено' }, { uz: 'Ochildi', ru: 'Открыто' }];
const S6_QATORLAR = [
  { k: 1, c: ['1', 'ochdi', '7f3a…', '16:10'], rang: 'b1' },
  { k: 2, c: ['2', 'ochdi', '7f3a…', '16:11'], rang: 'b1' },
  { k: 3, c: ['3', 'ochdi', 'c91e…', '16:12'], rang: 'b2' }
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, kam } = useUchish();
  const taymer = useTaymer();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0); // bosilgan qadamlar (telefonlar holati)
  const [n, setN] = useState(storedAnswer ? 3 : 0); // jadvalga tushgan qatorlar
  const [yur, setYur] = useState(false);
  const done = n >= 3;
  const tugadi = useTugadi(done, 1200, !!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bajar = () => {
    if (!taxmin || yur || q >= 3) return;
    const i = q; setQ(i + 1); setYur(true);
    const t1 = kam ? 0 : 520; // telefon ochilib, xotirada ID paydo bo'lgach konvert uchadi
    taymer(() => uchir(i < 2 ? '.hc-t1 .hc-telefon' : '.hc-t2 .hc-telefon', '.hc-s6-ong .hc-jt', 'ochdi · ' + S6_QATORLAR[i].c[2]), t1);
    taymer(() => { setN(i + 1); setYur(false); }, t1 + (kam ? 0 : UCH_MS));
  };
  const tugma = (tel) => {
    if (!taxmin || done) return null;
    const mening = tel === 1 ? q <= 1 : q === 2;
    const bajarildi = tel === 1 ? q >= 2 : q >= 3;
    if (bajarildi) return <QTugma ikkinchi disabled>✓ {tr(S6_BAJARILDI[tel - 1])}</QTugma>;
    const i = tel === 1 ? q : 2;
    return <QTugma ikkinchi={!mening} className={cxx('et-tel-btn', mening && !yur && 'et-navbat')} disabled={!mening || yur} onClick={bajar}>{tr(S6_TUGMA[i])}<small className="et-qn">{i + 1}/3</small></QTugma>;
  };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · brauzer ID', ru: 'Понятие · ID браузера' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Uchalasini bajaring (${n}/3)`, ru: `Выполните все три (${n}/3)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Qaysi brauzer ochganini <span className="italic" style={{ color: T.accent }}>qanday ajratamiz</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>различить</span>, какой браузер открыл?</> })}
        mentor={<Mentor>{tr({ uz: 'Ism va telefonni hodisaga yozmaymiz — sahifani ochgan odam ularni hali bermagan. Uch harakatni bajaring va jadvalning yangi ustuniga qarang.', ru: 'Имя и телефон в событие не пишем — человек, открывший страницу, их ещё не дал. Выполните три действия и смотрите на новый столбец таблицы.' })}</Mentor>}
        bashorat={<Bashorat savol={tr(S6_SAVOL)} variantlar={S6_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="hc-s6" ref={box}>
          <div className="hc-ikki">
            <Telefon className="hc-t1" holat={q >= 1 ? 'ochiq' : 'yopiq'} xotira={q >= 1 ? '7f3a…' : null} yorliq={tr({ uz: '1-telefon', ru: 'Телефон 1' })} rang="b1" yangila={q >= 2 ? 'y2' : undefined} aylana={q === 2}>{tugma(1)}</Telefon>
            <Telefon className="hc-t2" holat={q >= 3 ? 'ochiq' : 'yopiq'} xotira={q >= 3 ? 'c91e…' : null} yorliq={tr({ uz: '2-telefon', ru: 'Телефон 2' })} rang="b2">{tugma(2)}</Telefon>
          </div>
          <div className="hc-s6-yol" aria-hidden="true"><i className="hc-yol-chiziq" /></div>
          <div className="hc-s6-ong">
            <Jadval nom="hodisalar" ustunlar={USTUN_4} yangiUstun={n === 0 ? 'brauzer_id' : undefined} qatorlar={S6_QATORLAR.slice(0, n)} yangiK={n} />
            {n >= 1 && <Joriy>{tr({ uz: <>Brauzerni ajratadigan tasodifiy harf va raqamlar <b>brauzer ID</b> deyiladi. U odamning ismini ham, telefonini ham bildirmaydi.</>, ru: <>Случайные буквы и цифры, которые различают браузер, называются <b>ID браузера</b>. Он не сообщает ни имени человека, ни его телефона.</> })}</Joriy>}
          </div>
          {uchlar.map(u => <Uchar key={u.k} u={u} />)}
        </div>}
        natija={done && <NatijaBlok tanlov={taxmin} togri="yoq" variantlar={S6_TAXMIN} haqiqat={{ uz: "o'sha brauzer", ru: 'тот же браузер' }}
          xulosa={tr({ uz: 'Brauzer ID brauzer xotirasida turadi: sahifa yangilansa ham o\'zgarmaydi, boshqa brauzerda yangisi olinadi.', ru: 'ID браузера хранится в памяти браузера: при обновлении страницы не меняется, в другом браузере берётся новый.' })}
          qoshimcha={tr({ uz: 'Brauzer ID odamni emas, brauzerni ajratadi: bitta odam ikki telefonda — ikki brauzer.', ru: 'ID браузера различает не человека, а браузер: один человек на двух телефонах — два браузера.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — TEST 3 (INLINE_KEYS.s7 = 0, A) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="Bitta o'yinchi telefonda ham, laptopda ham ochdi. Nechta brauzer ID?"
    question={tr({ uz: <h2 className="title h-ask">Bitta o'yinchi telefonda ham, laptopda ham ochdi. <span className="italic" style={{ color: T.accent }}>Nechta brauzer ID</span>?</h2>, ru: <h2 className="title h-ask">Один игрок открыл и на телефоне, и на ноутбуке. <span className="italic" style={{ color: T.accent }}>Сколько ID браузера</span>?</h2> })}
    options={[
      { uz: 'Ikkita — har brauzerda o\'z ID si', ru: 'Два — у каждого браузера свой ID' },
      { uz: 'Bitta — chunki ochgan odam bitta', ru: 'Один — ведь открыл один человек' },
      { uz: "Bitta — Backend ID larni bog'laydi", ru: 'Один — Backend связывает ID' },
      { uz: 'Hech qancha — u hali band qilmagan', ru: 'Ни одного — он ещё не бронировал' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Brauzer ID odamni emas, brauzerni ajratadi — har brauzer o\'z ID sini saqlaydi.', ru: 'ID браузера различает не человека, а браузер — каждый браузер хранит свой ID.' }}
    explainWrong={{
      1: { uz: 'Brauzer ID ismni bilmaydi — odamni qayerdan taniydi?', ru: 'ID браузера не знает имени — откуда ему узнать человека?' },
      2: { uz: "Backend kelgan ID ni yozadi, ikkisini bog'lamaydi.", ru: 'Backend записывает пришедший ID и не связывает их.' },
      3: { uz: 'Brauzer ID sahifa ochilganda olinadi — band shart emas.', ru: 'ID браузера берётся при открытии страницы — бронь не нужна.' },
      default: { uz: 'Har brauzer o\'z ID sini saqlaydi.', ru: 'Каждый браузер хранит свой ID.' }
    }} />
);

// ===== SCREEN 8 — QKod (HtmlCompiler) — pastda, ScreenKod =====

// ===== SCREEN 9 — TUSHUNCHA: qator yoki brauzer (bashorat + ikki usul). Chapda jadval, o'ngda uch qadam sanog'i; har sanalgan qatordan nuqta o'z ustuniga uchadi =====
const NAMUNA_QATORLAR = [
  ['1', 'ochdi', '7f3a…'], ['2', 'ochdi', 'c91e…'], ['3', 'vaqt-tanladi', '7f3a…'], ['4', 'ochdi', 'e05b…'], ['5', 'vaqt-tanladi', '7f3a…'],
  ['6', 'ochdi', '7f3a…'], ['7', 'vaqt-tanladi', 'c91e…'], ['8', 'vaqt-tanladi', '7f3a…'], ['9', 'band-qildi', '7f3a…']
];
const UCH_QADAM = [{ nom: 'ochdi', t: { uz: 'ochdi', ru: 'открыл' } }, { nom: 'vaqt-tanladi', t: { uz: 'vaqtni tanladi', ru: 'выбрал время' } }, { nom: 'band-qildi', t: { uz: 'band qildi', ru: 'забронировал' } }];
// usul: 'qator' — har qator sanaladi · 'brauzer' — har nomda takrorlanmagan brauzer ID (takror qator — kulrang)
const sanoq = (qatorlar, k, usul) => {
  const bor = {}; const son = { ochdi: 0, 'vaqt-tanladi': 0, 'band-qildi': 0 }; const xira = [];
  qatorlar.slice(0, k).forEach((q, i) => {
    const kalit = q[1] + '|' + q[2];
    if (usul === 'brauzer' && bor[kalit]) { xira.push(i); return; }
    bor[kalit] = true; son[q[1]] += 1;
  });
  return { son, xira };
};
const S9_SAVOL = { uz: 'Bitta brauzerdan uchta katak tanlandi. «Vaqtni tanladi» qadamida u necha marta sanalsin?', ru: "В одном браузере выбрали три ячейки. Сколько раз считать его на шаге «выбрал время»?" };
const S9_TAXMIN = [{ k: 'uch', t: { uz: 'Uch marta', ru: 'Три раза' } }, { k: 'bir', t: { uz: 'Bir marta', ru: 'Один раз' } }];
const S9_USULLAR = [{ k: 'qator', t: { uz: 'Qatorlarni sanash', ru: 'Считать строки' } }, { k: 'brauzer', t: { uz: 'Turli brauzerlarni sanash', ru: 'Считать разные браузеры' } }];
const S9_QADAM_MS = 420;
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, kam } = useUchish();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [usul, setUsul] = useState(avval ? 'brauzer' : null);
  const [sinaldi, setSinaldi] = useState(() => (avval ? ['qator', 'brauzer'] : []));
  const [k, setK] = useState(avval ? NAMUNA_QATORLAR.length : 0); // o'qilgan qatorlar
  const bosildi = useRef(false); // nuqtalar faqat o'quvchi usulni bosgach uchadi (qaytib kelganda emas)
  const yurmoqda = !!usul && k < NAMUNA_QATORLAR.length;
  useEffect(() => { if (!yurmoqda) return undefined; const t = setTimeout(() => setK(x => x + 1), S9_QADAM_MS); return () => clearTimeout(t); }, [yurmoqda, k]);
  // sanalgan qatordan nuqta o'z ustuniga uchadi (takror — kulrang, uchmaydi)
  useEffect(() => {
    if (!bosildi.current || !usul || k === 0) return;
    const i = k - 1; const q = NAMUNA_QATORLAR[i];
    if (!sanoq(NAMUNA_QATORLAR, k, usul).xira.includes(i)) uchir(`tr[data-k="${q[0]}"] td:nth-child(2)`, `[data-n="${q[1]}"] b`, '', 'son', 520);
  }, [k, usul]); // eslint-disable-line
  const done = sinaldi.length === 2 && !yurmoqda;
  const tugadi = useTugadi(done, 1500, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bos = (u) => { if (!taxmin || yurmoqda) return; bosildi.current = true; setUsul(u); setK(kam ? NAMUNA_QATORLAR.length : 0); setSinaldi(s => (s.includes(u) ? s : [...s, u])); };
  const u = tugadi ? 'brauzer' : usul;
  const kk = tugadi ? NAMUNA_QATORLAR.length : k;
  // ustun soni nuqta yetib borgach o'sadi: joriy (uchayotgan) qator hali qo'shilmaydi
  const kSon = yurmoqda && !kam ? Math.max(0, kk - 1) : kk;
  const { son } = u ? sanoq(NAMUNA_QATORLAR, kSon, u) : { son: null };
  const { xira } = u ? sanoq(NAMUNA_QATORLAR, kk, u) : { xira: [] };
  const navbatUsul = S9_USULLAR.find(x => !sinaldi.includes(x.k));
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · sanoq', ru: 'Понятие · подсчёт' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Ikki usulni sinang (${sinaldi.length}/2)`, ru: `Попробуйте два способа (${sinaldi.length}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Qatorlarni sanaysizmi yoki <span className="italic" style={{ color: T.accent }}>brauzerlarni</span>?</>, ru: <>Считаете строки или <span className="italic" style={{ color: T.accent }}>браузеры</span>?</> })}
        mentor={<Mentor>{tr({ uz: "«Birinchi odam kirganda nimani ko'rasiz?» darsida uch son uch xil usulda sanalgan edi. Ikki usulni sinab, qaysi biri uch qadamni bir xil sanashini ko'ring.", ru: "На уроке «Что вы увидите, когда придёт первый человек?» три числа считались тремя разными способами. Попробуйте два способа и посмотрите, какой считает три шага одинаково." })}</Mentor>}
        bashorat={<Bashorat savol={tr(S9_SAVOL)} variantlar={S9_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="hc-s9" ref={box}>
          <Jadval nom="hodisalar" ustunlar={['id', 'nom', 'brauzer_id']} qatorlar={NAMUNA_QATORLAR.map((q, i) => ({ k: q[0], c: q, rang: BRAUZER_RANG[q[2]], xira: xira.includes(i), yon: yurmoqda && i === kk - 1 }))} />
          <div className="hc-s9-ong">
            <div className="hc-uch">
              {UCH_QADAM.map((q, i) => <div key={q.nom} data-n={q.nom} className={cxx('hc-uch-k', son && 'bor')}><span>{tr(q.t)}</span><b key={(u || '') + (son ? son[q.nom] : '?')}>{son ? son[q.nom] : '?'}</b>{i < 2 && <i aria-hidden="true">→</i>}</div>)}
            </div>
            {taxmin && !done && <div className="hc-usullar fade-step">
              {S9_USULLAR.map(x => <QTugma key={x.k} ikkinchi className={cxx('hc-usul', usul === x.k && 'on', navbatUsul && navbatUsul.k === x.k && !yurmoqda && 'et-navbat')} aria-disabled={yurmoqda} onClick={() => bos(x.k)}>{sinaldi.includes(x.k) ? '✓ ' : ''}{tr(x.t)}</QTugma>)}
            </div>}
            {done && <div className="hc-sql fade-step">
              <pre className="hc-sql-kod">{'SELECT nom, COUNT(DISTINCT brauzer_id)\nFROM hodisalar\nGROUP BY nom;'}</pre>
              <p className="hc-sql-izoh">{tr({ uz: 'Har hodisa nomi uchun takrorlanmagan brauzer ID lar sonini sanaydi.', ru: 'Считает число неповторяющихся ID браузера для каждого названия события.' })}</p>
            </div>}
          </div>
          {uchlar.map(x => <Uchar key={x.k} u={x} />)}
        </div>}
        natija={done && <NatijaBlok tanlov={taxmin} togri="bir" variantlar={S9_TAXMIN} haqiqat={{ uz: 'bir marta', ru: 'один раз' }}
          izoh={tr({ uz: 'Bu darsda sanoq sharti — har qadamda turli brauzerlar soni.', ru: 'Условие подсчёта на этом уроке — число разных браузеров на каждом шаге.' })}
          xulosa={tr({ uz: "Qatorlar bitta brauzerni bir necha marta sanaydi. O'z jadvalimizdagi uch qadam bitta sanoq qoidasida bo'ladi.", ru: 'Строки считают один браузер несколько раз. Три шага в нашей таблице считаются по одному правилу.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 4 (INLINE_KEYS.s10 = 3, D) — savol ustida kichik jadval (9-ekrandagidan boshqa) =====
const SAVOL4_QATORLAR = ['7f3a…', 'c91e…', '7f3a…', '7f3a…', 'e05b…'];
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="Jadvalga qarang. «Vaqtni tanladi» qadamida nechta brauzer sanaladi?"
    question={<>
      <Jadval nom="hodisalar" className="hc-savol-j" navbat ustunlar={['id', 'nom', 'brauzer_id']} qatorlar={SAVOL4_QATORLAR.map((b, i) => ({ k: i, c: [String(i + 1), 'vaqt-tanladi', b], rang: BRAUZER_RANG[b] }))} />
      {tr({ uz: <h2 className="title h-ask">Jadvalga qarang. «Vaqtni tanladi» qadamida <span className="italic" style={{ color: T.accent }}>nechta brauzer</span> sanaladi?</h2>, ru: <h2 className="title h-ask">Посмотрите на таблицу. <span className="italic" style={{ color: T.accent }}>Сколько браузеров</span> считается на шаге «выбрал время»?</h2> })}
    </>}
    options={[
      { uz: 'Beshta — har qator bitta brauzer', ru: 'Пять — каждая строка один браузер' },
      { uz: "Bitta — eng ko'p bosgan brauzer", ru: 'Один — браузер, нажавший больше всех' },
      { uz: 'Ikkita — faqat takrorlangan ID lar', ru: 'Два — только повторившиеся ID' },
      { uz: 'Uchta — har brauzer bir marta', ru: 'Три — каждый браузер один раз' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Uch xil ID bor: `7f3a…` uch marta kelgan bo\'lsa ham, bir marta sanaladi.', ru: 'Здесь три разных ID: `7f3a…` пришёл три раза, но считается один раз.' }}
    explainWrong={{
      0: { uz: '`7f3a…` uch marta keldi — bu uch brauzermi?', ru: '`7f3a…` пришёл три раза — это три браузера?' },
      1: { uz: "Bir brauzer ko'p bosgani boshqalarini o'chirmaydi.", ru: "Если один браузер нажимал много раз, другие от этого не исчезают." },
      2: { uz: 'Bir marta kelgan ID ham — alohida brauzer.', ru: 'ID, пришедший один раз, — тоже отдельный браузер.' },
      default: { uz: 'Har brauzer bir marta sanaladi.', ru: 'Каждый браузер считается один раз.' }
    }} />
);

// ===== SCREEN 11 — TUSHUNCHA: bir kun, ikki tizim. Chapda telefon = sayt; har brauzer kirganda ikki nuqta: Umami'ga va Backend'ga =====
const BIR_KUN = { umami: 31, biz: 36 };
// «to'sgich» li brauzerlar — ikki son farqi (Mentor misoli simulyatsiyasi, umumiy qoida emas)
const TOSGICH_DOIRALAR = [4, 11, 19, 26, 33].slice(0, BIR_KUN.biz - BIR_KUN.umami);
const S11_SAVOL = { uz: 'Saytni ochganlarni qaysi tizim ko\'proq sanaydi?', ru: 'Какая система насчитает больше открывших сайт?' };
const S11_TAXMIN = [{ k: 'umami', t: { uz: 'Umami', ru: 'Umami' } }, { k: 'biz', t: { uz: "O'z jadvalimiz", ru: 'Наша таблица' } }, { k: 'teng', t: { uz: 'Ikkalasi teng', ru: 'Поровну' } }];
const S11_MS = 150;
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const kam = useKamHarakat();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [k, setK] = useState(avval ? BIR_KUN.biz : 0);
  const [boshlandi, setBoshlandi] = useState(avval);
  const done = k >= BIR_KUN.biz;
  useEffect(() => { if (!boshlandi || done) return undefined; const t = setTimeout(() => setK(x => x + 1), S11_MS); return () => clearTimeout(t); }, [boshlandi, k, done]);
  const tugadi = useTugadi(done, 1600, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const boshla = () => { if (!taxmin || boshlandi) return; setBoshlandi(true); if (kam) setK(BIR_KUN.biz); };
  const umamiSon = Array.from({ length: k }, (_, i) => i).filter(i => !TOSGICH_DOIRALAR.includes(i)).length;
  const tosSon = k - umamiSon;
  const joriy = k > 0 && !done ? k - 1 : null;
  const joriyTos = joriy !== null && TOSGICH_DOIRALAR.includes(joriy);
  // so'nggi brauzerlarning nuqtalari (yo'lakda uchib boradi); tugagach — yo'q
  const oxirgi = done || kam ? [] : Array.from({ length: Math.min(k, 5) }, (_, j) => k - 1 - j);
  const ekran = (
    <div className="hc-kun">
      <b className="hc-tel-sar">Maydon</b>
      <span className="hc-kun-son"><b key={k}>{k}</b> / {BIR_KUN.biz}</span>
      <span className="hc-kun-n">{tr({ uz: 'brauzer', ru: 'браузеров' })}</span>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tajriba · ikki tizim', ru: "Опыт · две системы" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: 'Kunni boshlang', ru: 'Начните день' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ikki tizim nega <span className="italic" style={{ color: T.accent }}>bir xil son</span> bermadi?</>, ru: <>Почему две системы дали <span className="italic" style={{ color: T.accent }}>разные числа</span>?</> })}
        mentor={<Mentor>{tr({ uz: "Mentor misolida «Maydon»ning bir kuni ikki tizimda sanaldi. Kunni boshlang va har brauzer qayerga yetib borishiga qarang.", ru: "В примере Ментора день «Maydon» считают две системы. Начните день и следите за каждым браузером." })}</Mentor>}
        bashorat={<Bashorat savol={tr(S11_SAVOL)} variantlar={S11_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="hc-s11" aria-label={tr({ uz: 'brauzerlar', ru: 'браузеры' })}>
          <Telefon className="hc-s11-tel" tex ekran={ekran} tosgich={joriyTos}>
            {taxmin && !boshlandi && <QTugma className="et-tel-btn et-navbat" onClick={boshla}>{tr({ uz: 'Kunni boshlang', ru: 'Начните день' })}</QTugma>}
          </Telefon>
          <div className="hc-s11-yol um" aria-hidden="true">
            <i className="hc-yol-chiziq" />
            {oxirgi.map(i => <i key={i} className={cxx('hc-nq', TOSGICH_DOIRALAR.includes(i) && 'tos')} />)}
            {tosSon > 0 && <span className="hc-tos-chip" key={tosSon}><i className="hc-tosuv" />{tr({ uz: "to'sgich", ru: "блокировщик" })} · {tosSon}</span>}
          </div>
          <div className="hc-hisob-k um"><span className="hc-hisob-n">{tr({ uz: 'Umami · Visitors (Umami sessiyalari)', ru: 'Umami · Visitors (сессии Umami)' })}</span><b key={umamiSon}>{umamiSon}</b><small>{tr({ uz: "Umami: o'z usuli bilan", ru: 'Umami: своим способом' })}</small></div>
          <div className="hc-s11-yol biz" aria-hidden="true">
            <i className="hc-yol-chiziq" />
            {oxirgi.map(i => <i key={i} className="hc-nq" />)}
          </div>
          <div className="hc-hisob-k biz"><span className="hc-hisob-n">{fmtCode(tr({ uz: "O'z tizimimiz · `ochdi`, turli brauzer ID", ru: 'Наша система · `ochdi`, разные ID браузера' }))}</span><b key={k}>{k}</b><small>{tr({ uz: 'biz: brauzer xotirasidagi ID', ru: 'мы: ID из памяти браузера' })}</small></div>
        </div>}
        natija={done && <NatijaBlok tanlov={taxmin} togri="biz" variantlar={S11_TAXMIN} haqiqat={{ uz: "o'z jadvalimiz", ru: 'наша таблица' }}
          izoh={tr({ uz: 'Ikki tizim brauzerni turlicha taniydi: Umami — o\'z usuli bilan, biz — brauzer ID bilan. Shuning uchun sonlar teng bo\'lishi shart emas.', ru: 'Две системы узнают браузер по-разному: Umami — своим способом, мы — по ID браузера. Поэтому числа не обязаны совпадать.' })}
          xulosa={tr({ uz: "O'z jadvalimizda qoida aniq: har hodisada turli brauzer ID lar. Farq sabablaridan biri — reklama to'sgichi.", ru: "В нашей таблице правило чёткое: для каждого события — разные ID браузера. Одна из причин разницы — блокировщик рекламы." })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY TARTIB (QTartib, sentinel 0; ball — birinchi to'liq urinish) =====
const FINAL_BOLAKLAR = [
  { id: 'f1', label: { uz: "O'yinchi «Band qilish»ni bosadi", ru: 'Игрок нажимает «Забронировать»' } },
  { id: 'f2', label: { uz: 'Sayt `POST /bandlar` yuboradi', ru: 'Сайт отправляет `POST /bandlar`' } },
  { id: 'f3', label: { uz: 'Backend bandni `bandlar` ga saqlaydi', ru: 'Backend сохраняет бронь в `bandlar`' } },
  { id: 'f4', label: { uz: 'Sayt `band-qildi` ni brauzer ID bilan yuboradi', ru: 'Сайт отправляет `band-qildi` с ID браузера' } },
  { id: 'f5', label: { uz: 'Backend hodisa nomini tekshiradi', ru: 'Backend проверяет название события' } },
  { id: 'f6', label: { uz: '`hodisalar` jadvaliga yangi qator tushadi', ru: 'В таблицу `hodisalar` попадает новая строка' } }
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
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'Bitta band qilish jadvalga qanday yetadi?', options: FINAL_BOLAKLAR.map(z => ou(z.label)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · tartib', ru: 'Итог · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Tartibni yig'ing", ru: 'Соберите порядок' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta band qilish <span className="italic" style={{ color: T.accent }}>jadvalga qanday yetadi</span>?</>, ru: <>Как одна бронь <span className="italic" style={{ color: T.accent }}>доходит до таблицы</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni sodir bo'lish tartibida joylang.", ru: 'Разложите блоки в порядке, в котором всё происходит.' })}</Mentor>
        <Zoomable>
          <QTartib onWrong={onWrong}
            items={FINAL_BOLAKLAR.map(z => ({ id: z.id, label: fmtCode(tr(z.label)) }))}
            joyMatn={tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}
            onSolved={solve}
            xatoMatn={tr({ uz: "Tartib xato — bo'lakni bosib qaytaring.", ru: 'Порядок неверный — нажмите на блок, чтобы вернуть его.' })}
          />
        </Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Avval band yuboriladi va saqlanadi, keyin hodisa yuboriladi, tekshiriladi va yoziladi.', ru: 'Сначала бронь отправляется и сохраняется, потом событие отправляется, проверяется и записывается.' })}</p>
          {wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 NISHONLAR (5) — inglizcha nom, o'zbekcha tavsif; bonus — bitta (Own Events) =====
const ACHIEVEMENTS = {
  eventPath: { icon: '📨', name: 'Event Path', desc: { uz: 'Hodisa jadvalga Backend orqali borishini bildingiz', ru: 'Вы узнали, что событие попадает в таблицу через Backend' } },
  nameGuard: { icon: '🛡️', name: 'Name Guard', desc: { uz: 'Xato nomli hodisa nega yozilmasligini bildingiz', ru: 'Вы узнали, почему событие с ошибкой в названии не записывается' } },
  twoBrowsers: { icon: '📱', name: 'Two Browsers', desc: { uz: 'Brauzer ID odamni emas, brauzerni ajratishini bildingiz', ru: 'Вы узнали, что ID браузера различает не человека, а браузер' } },
  trueCount: { icon: '🔢', name: 'True Count', desc: { uz: 'Har qadamda turli brauzerlarni sanadingiz', ru: 'Вы посчитали разные браузеры на каждом шаге' } },
  ownEvents: { icon: '🏁', name: 'Own Events', desc: { uz: 'Ikki amaliyot blokini oxirigacha bajardingiz', ru: "Вы прошли оба блока практики до конца" } }
};
// Ekran id → nishon: testlar (birinchi urinish) + A2 oxirgi «Bajardim» (bonus)
const ACH_TRIGGERS = { s3: 'eventPath', s5: 'nameGuard', s7: 'twoBrowsers', s10: 'trueCount', a2: 'ownEvents' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 7, 10, 12 — q22)
const Q_LABELS = {
  3: { uz: '1 — Hodisa Backend orqali', ru: '1 — Событие через Backend' },
  5: { uz: '2 — Xato nom', ru: '2 — Ошибочное название' },
  7: { uz: '3 — Ikki brauzer', ru: '3 — Два браузера' },
  10: { uz: '4 — Turli brauzerlar', ru: '4 — Разные браузеры' },
  12: { uz: 'Yakuniy — band qilish tartibi', ru: 'Итог — порядок бронирования' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning o'z atamalari (R-008: o'quvchi so'zi {uz, ru}; kod so'zi o'zgarmaydi), emojisiz
const QZ_BG_SHAPES = [
  { ch: { uz: 'hodisa', ru: 'событие' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: 'hodisalar', l: 82, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: 'POST /hodisalar', l: 8, t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: 'hodisaYoz', l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'brauzer ID', ru: 'ID браузера' }, l: 44, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'brauzer_id', l: 64, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: 'maydon-brauzer', l: 24, t: 34, s: 20, d: 20, dl: 1.9 },
  { ch: 'localStorage', l: 18, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: 'ochdi', l: 88, t: 44, s: 22, d: 22, dl: 0.6 },
  { ch: 'vaqt-tanladi', l: 36, t: 58, s: 20, d: 24, dl: 1.4 },
  { ch: 'band-qildi', l: 56, t: 12, s: 20, d: 26, dl: 2.5 },
  { ch: 'COUNT(DISTINCT …)', l: 4, t: 46, s: 18, d: 28, dl: 3.1 },
  { ch: '400', l: 92, t: 84, s: 22, d: 19, dl: 0.2 },
  { ch: 'Umami', l: 30, t: 92, s: 20, d: 23, dl: 1.7 },
  { ch: 'Maydon', l: 52, t: 40, s: 20, d: 21, dl: 2.1 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (aylanma, MD v3)
const QUIZ_BANK = [
  { q: { uz: 'Hodisa nima?', ru: 'Что такое событие?' }, opts: [{ uz: 'Analitikaga yoziladigan bitta harakat', ru: "Одно действие, которое пишется в аналитику" }, { uz: "Database'dagi bitta yangi jadval ustuni", ru: 'Один новый столбец таблицы в Database' }, { uz: 'Saytdagi bitta bosiladigan katta tugma', ru: 'Одна большая кнопка на сайте' }, { uz: "Backend'dagi bitta yangi so'rov yo'li", ru: 'Один новый маршрут запроса в Backend' }], correct: 0 },
  { q: { uz: '`hodisalar` jadvalidagi bitta qator nimani bildiradi?', ru: 'Что означает одна строка в таблице `hodisalar`?' }, opts: [{ uz: 'Bitta brauzerni', ru: 'Один браузер' }, { uz: 'Bitta hodisani', ru: 'Одно событие' }, { uz: "Bitta o'yinchini", ru: 'Одного игрока' }, { uz: 'Bitta kunni', ru: 'Один день' }], correct: 1 },
  { q: { uz: "Sahifa ochilishini o'z jadvalimizga kim yuboradi?", ru: 'Кто отправляет открытие страницы в нашу таблицу?' }, opts: [{ uz: "Umami skripti uni o'zi yozib beradi", ru: 'Скрипт Umami сам его записывает' }, { uz: "Database uni o'zi qo'shib qo'yadi", ru: 'Database сама его добавляет' }, { uz: 'Sayt ochdi nomi bilan yuboradi', ru: 'Сайт отправляет с названием ochdi' }, { uz: "Backend har daqiqada o'zi qo'shadi", ru: 'Backend сам добавляет каждую минуту' }], correct: 2 },
  { q: { uz: 'Hodisaga nega telefon raqami yozilmaydi?', ru: 'Почему в событие не пишется номер телефона?' }, opts: [{ uz: "Telefon raqami jadvalga sig'maydi", ru: 'Номер не помещается в таблицу' }, { uz: "Backend raqamni o'qiy olmaydi", ru: 'Backend не может прочитать номер' }, { uz: "Umami raqamni o'zi yashiradi", ru: 'Umami сам скрывает номер' }, { uz: 'Ochganlar hali raqam bermagan', ru: 'Открывшие ещё не дали номер' }], correct: 3 },
  { q: { uz: 'Brauzer ID qayerda saqlanadi?', ru: 'Где хранится ID браузера?' }, opts: [{ uz: "Brauzer xotirasida, localStorage'da", ru: 'В памяти браузера, в localStorage' }, { uz: '`bandlar` jadvalining alohida ustunida', ru: 'В отдельном столбце таблицы `bandlar`' }, { uz: 'Umami hisobidagi sayt sozlamalarida', ru: 'В настройках сайта в аккаунте Umami' }, { uz: "Backend'dagi `.env` faylining ichida", ru: 'Внутри файла `.env` в Backend' }], correct: 0 },
  { q: { uz: "O'yinchi sahifani yangiladi. Brauzer ID nima bo'ladi?", ru: 'Игрок обновил страницу. Что будет с ID браузера?' }, opts: [{ uz: 'Har safar yangi ID olinadi', ru: 'Каждый раз берётся новый ID' }, { uz: "O'sha ID o'zgarmay qoladi", ru: 'Тот же ID остаётся без изменений' }, { uz: 'Telefon raqamiga almashadi', ru: 'Заменяется номером телефона' }, { uz: "Backend uni o'chirib yuboradi", ru: 'Backend его удаляет' }], correct: 1 },
  { q: { uz: '`band-qildi` qachon yuboriladi?', ru: 'Когда отправляется `band-qildi`?' }, opts: [{ uz: '«Band qilish» bosilishi bilan', ru: 'Сразу при нажатии «Забронировать»' }, { uz: 'Forma ochilgan zahoti', ru: 'Как только открылась форма' }, { uz: 'Band saqlangandan keyin', ru: 'После сохранения брони' }, { uz: "Ega ro'yxatni ochganda", ru: 'Когда владелец открыл список' }], correct: 2 },
  { q: { uz: '`COUNT(DISTINCT brauzer_id)` nimani sanaydi?', ru: 'Что считает `COUNT(DISTINCT brauzer_id)`?' }, opts: [{ uz: 'Jadvaldagi hamma qatorlar sonini', ru: 'Число всех строк в таблице' }, { uz: 'Turli hodisa nomlari sonini', ru: 'Число разных названий событий' }, { uz: "Bo'sh vaqt kataklari sonini", ru: "Число свободных ячеек" }, { uz: 'Har xil brauzerlar sonini', ru: 'Число разных браузеров' }], correct: 3 },
  { q: { uz: 'Qatorlarni sanasak, qanday xato chiqadi?', ru: 'Какая ошибка будет, если считать строки?' }, opts: [{ uz: 'Bir brauzer bir necha marta sanaladi', ru: 'Один браузер считается несколько раз' }, { uz: 'Band qilganlar umuman sanalmaydi', ru: 'Забронировавшие вообще не считаются' }, { uz: 'Umami sonlari ikki baravar bo\'ladi', ru: 'Числа Umami удвоятся' }, { uz: "Bo'sh kataklar ham qator bo'lib qoladi", ru: "Пустые ячейки тоже станут строками" }], correct: 0 },
  { q: { uz: 'Umami 31, jadval 36. Bu nimani bildiradi?', ru: 'Umami 31, таблица 36. Что это значит?' }, opts: [{ uz: 'Jadval xato — uni tuzatish kerak', ru: 'Таблица ошибается — её надо исправить' }, { uz: 'Ikki tizim har xil usulda sanaydi', ru: 'Две системы считают разными способами' }, { uz: 'Umami xato — uni olib tashlaymiz', ru: 'Umami ошибается — уберём его' }, { uz: 'Besh kishi saytni ikki marta ochgan', ru: 'Пять человек открыли сайт дважды' }], correct: 1 },
  { q: { uz: "Mentor misolida reklama to'sgichi nimani to'sdi?", ru: 'Что заблокировал блокировщик рекламы в примере Ментора?' }, opts: [{ uz: '`POST /bandlar` so\'rovini', ru: 'Запрос `POST /bandlar`' }, { uz: 'Saytdagi vaqt kataklarini', ru: "Ячейки времени на сайте" }, { uz: 'Umami skriptini', ru: 'Скрипт Umami' }, { uz: 'Brauzer xotirasini', ru: 'Память браузера' }], correct: 2 },
  { q: { uz: "Hodisalarni nega o'z Database'imizga ham yozamiz?", ru: 'Зачем писать события и в нашу Database?' }, opts: [{ uz: 'Umami endi umuman kerak emas', ru: 'Umami больше вообще не нужен' }, { uz: 'Sayt shunda tezroq ochiladi', ru: 'Так сайт открывается быстрее' }, { uz: 'Backend shunda hech uxlamaydi', ru: 'Так Backend никогда не засыпает' }, { uz: "Sonlarni o'zimiz sanay olamiz", ru: 'Мы сами можем считать числа' }], correct: 3 }
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
    const TOK = ['hodisa', 'hodisalar', 'POST /hodisalar', 'hodisaYoz', 'brauzer_id', 'ochdi', 'vaqt-tanladi', 'band-qildi', 'COUNT(DISTINCT)', 'Umami'];
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

// ===== SCREEN 8 — KOD YOZISH (QKod + HtmlCompiler): uch chaqiruvni o'quvchi qo'lda yozadi =====
// Kod oynasi bitta JS faylni ulaydi — shuning uchun maydon.js qismi index.html ichida <script> (MD KOD 6 zaxira yo'li).
// Tekshiruv: probe'lar 'load' + 50 ms da sinxron ishlaydi, band qilish esa async (await saqla) — uch holatni index.html dagi
// tayyor qism 'load' da o'zi sinab, natijani window.natija ga yozadi (sinov paytida ro'yxat va xabarga tegmaydi).
const KOD_INDEX = {
  uz: `<h1>Maydon</h1>
<div class="kataklar">
  <button class="katak" data-soat="18:00">18:00</button>
  <button class="katak" data-soat="19:00">19:00</button>
  <button class="katak" data-soat="20:00">20:00</button>
</div>
<button id="band">Band qilish</button>
<p id="xabar"></p>
<h3>hodisalar (namuna)</h3>
<p class="izoh">Bu oynada jadval o'rniga ro'yxat</p>
<ul id="hodisalar"></ul>

<script>
// maydon.js — tayyor qism, o'zgarmaydi
var tanlangan = null;
function tanla(soat) {
  tanlangan = soat;
  document.querySelectorAll('.katak').forEach(function (k) {
    k.classList.toggle('on', k.dataset.soat === soat);
  });
}
// namuna: 19:00 — 409, 20:00 — 500, boshqasi — 201
function saqla(soat) {
  var status = soat === '19:00' ? 409 : soat === '20:00' ? 500 : 201;
  return Promise.resolve({ status: status });
}
function xabar(matn) {
  if (window.sinov) return;
  document.querySelector('#xabar').textContent = matn;
}
// bu oynada Backend yo'q — hodisa pastdagi ro'yxatga yoziladi
function hodisaYoz(nom) {
  if (window.sinov) { window.sinov.push(nom); return; }
  var li = document.createElement('li');
  li.textContent = nom + ' · 7f3a…';
  document.querySelector('#hodisalar').appendChild(li);
}
// kod oynasi shartlarni shu yerda sinab ko'radi (ro'yxatga yozmaydi)
window.addEventListener('load', function () {
  var royxat = document.querySelectorAll('#hodisalar li');
  var ochdi = [].filter.call(royxat, function (li) { return li.textContent.indexOf('ochdi ') === 0; }).length;
  var n = {};
  function bos(s) { var el = document.querySelector(s); if (el) el.click(); }
  function kut() { return new Promise(function (r) { setTimeout(r, 0); }); }
  function sana(nom) { return window.sinov.filter(function (x) { return x === nom; }).length; }
  window.sinov = [];
  bos('.katak[data-soat="18:00"]');
  n.t = sana('vaqt-tanladi');
  window.sinov = [];
  bos('.katak[data-soat="19:00"]'); bos('#band');
  kut().then(function () {
    n.a = sana('band-qildi'); window.sinov = [];
    bos('.katak[data-soat="20:00"]'); bos('#band');
    return kut();
  }).then(function () {
    n.b = sana('band-qildi'); window.sinov = [];
    bos('.katak[data-soat="18:00"]'); bos('#band');
    return kut();
  }).then(function () {
    n.c = sana('band-qildi');
  }).finally(function () {
    window.sinov = null; tanla(null);
    window.natija = [ochdi === 1, n.t === 1, n.a === 0 && n.b === 0 && n.c > 0, n.c === 1];
  });
});
</script>`,
  ru: `<h1>Maydon</h1>
<div class="kataklar">
  <button class="katak" data-soat="18:00">18:00</button>
  <button class="katak" data-soat="19:00">19:00</button>
  <button class="katak" data-soat="20:00">20:00</button>
</div>
<button id="band">Забронировать</button>
<p id="xabar"></p>
<h3>hodisalar (образец)</h3>
<p class="izoh">В этом окне вместо таблицы — список</p>
<ul id="hodisalar"></ul>

<script>
// maydon.js — готовая часть, не меняется
var tanlangan = null;
function tanla(soat) {
  tanlangan = soat;
  document.querySelectorAll('.katak').forEach(function (k) {
    k.classList.toggle('on', k.dataset.soat === soat);
  });
}
// образец: 19:00 — 409, 20:00 — 500, остальные — 201
function saqla(soat) {
  var status = soat === '19:00' ? 409 : soat === '20:00' ? 500 : 201;
  return Promise.resolve({ status: status });
}
function xabar(matn) {
  if (window.sinov) return;
  document.querySelector('#xabar').textContent = matn;
}
// в этом окне нет Backend — событие пишется в список внизу
function hodisaYoz(nom) {
  if (window.sinov) { window.sinov.push(nom); return; }
  var li = document.createElement('li');
  li.textContent = nom + ' · 7f3a…';
  document.querySelector('#hodisalar').appendChild(li);
}
// окно кода само проверяет условия здесь (в список не пишет)
window.addEventListener('load', function () {
  var royxat = document.querySelectorAll('#hodisalar li');
  var ochdi = [].filter.call(royxat, function (li) { return li.textContent.indexOf('ochdi ') === 0; }).length;
  var n = {};
  function bos(s) { var el = document.querySelector(s); if (el) el.click(); }
  function kut() { return new Promise(function (r) { setTimeout(r, 0); }); }
  function sana(nom) { return window.sinov.filter(function (x) { return x === nom; }).length; }
  window.sinov = [];
  bos('.katak[data-soat="18:00"]');
  n.t = sana('vaqt-tanladi');
  window.sinov = [];
  bos('.katak[data-soat="19:00"]'); bos('#band');
  kut().then(function () {
    n.a = sana('band-qildi'); window.sinov = [];
    bos('.katak[data-soat="20:00"]'); bos('#band');
    return kut();
  }).then(function () {
    n.b = sana('band-qildi'); window.sinov = [];
    bos('.katak[data-soat="18:00"]'); bos('#band');
    return kut();
  }).then(function () {
    n.c = sana('band-qildi');
  }).finally(function () {
    window.sinov = null; tanla(null);
    window.natija = [ochdi === 1, n.t === 1, n.a === 0 && n.b === 0 && n.c > 0, n.c === 1];
  });
});
</script>`
};
const KOD_APP = {
  uz: `// 1) sahifa ochildi — shu yerga

document.querySelectorAll('.katak').forEach(function (k) {
  k.addEventListener('click', function () {
    tanla(k.dataset.soat)
    // 2) shu yerga
  })
})

document.querySelector('#band').addEventListener('click', async function () {
  const javob = await saqla(tanlangan)
  if (javob.status === 409) {
    xabar('Bu vaqt band')
    return
  }
  if (javob.status !== 201) {
    xabar("Band qilib bo'lmadi")
    return
  }
  // 3) shu yerga
  xabar('Band qilindi: ' + tanlangan)
})`,
  ru: `// 1) страница открылась — сюда

document.querySelectorAll('.katak').forEach(function (k) {
  k.addEventListener('click', function () {
    tanla(k.dataset.soat)
    // 2) сюда
  })
})

document.querySelector('#band').addEventListener('click', async function () {
  const javob = await saqla(tanlangan)
  if (javob.status === 409) {
    xabar('Это время занято')
    return
  }
  if (javob.status !== 201) {
    xabar('Не удалось забронировать')
    return
  }
  // 3) сюда
  xabar('Забронировано: ' + tanlangan)
})`
};
const KOD_VAZIFA = [
  { uz: "Faylning boshiga yozing: `hodisaYoz('ochdi')`", ru: "Напишите в начале файла: `hodisaYoz('ochdi')`" },
  { uz: "Katak bosilganda, `tanla(...)` dan keyin: `hodisaYoz('vaqt-tanladi')`", ru: "При нажатии на ячейку, после `tanla(...)`: `hodisaYoz('vaqt-tanladi')`" },
  { uz: "`hodisaYoz('band-qildi')` ni band saqlangan joyga yozing — ikkala tekshiruvdan keyin (faqat 201 da).", ru: "Напишите `hodisaYoz('band-qildi')` там, где бронь сохранена, — после обеих проверок (только при 201)." }
];
const KOD_YORDAM = { uz: "Nom qo'shtirnoq ichida, kichik harf va chiziqcha bilan yoziladi. `band-qildi` tekshiruvlardan oldin tursa, saqlanmagan urinish ham sanaladi.", ru: 'Название пишется в кавычках, строчными буквами и через дефис. Если `band-qildi` стоит до проверок, посчитается и несохранённая попытка.' };
const KOD_SHARTLAR = [
  { uz: 'Sahifa ochilganda ochdi bir marta yozilsin.', ru: 'При открытии страницы ochdi записывается один раз.' },
  { uz: 'Katak bosilganda vaqt-tanladi yozilsin.', ru: "При нажатии на ячейку записывается vaqt-tanladi." },
  { uz: 'Band saqlanmasa (409 yoki boshqa xato), band-qildi yozilmasin.', ru: 'Если бронь не сохранилась (409 или другая ошибка), band-qildi не пишется.' },
  { uz: 'Band saqlanganda band-qildi bir marta yozilsin.', ru: 'Когда бронь сохранена, band-qildi записывается один раз.' }
];
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: "app.js — uch hodisani to'g'ri joyda yozing", ru: 'app.js — запишите три события в нужных местах' },
  files: [
    { name: 'app.js', lang: 'js', starter: KOD_APP },
    { name: 'index.html', lang: 'html', starter: KOD_INDEX }
  ],
  previewCss: '.katak{margin-right:6px}.katak.on{outline:3px solid currentColor}.izoh{opacity:.6;font-size:13px}',
  requirements: KOD_SHARTLAR.map((s, i) => ({ id: 'h' + i, label: s, check: C.evalEquals('(window.natija||[])[' + i + ']?"ha":"yoq"', 'ha', s) }))
};
// QKod o'ng ustun propining qolip-nomi (Editor ma'nosidagi o'zbekcha so'z) til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi —
// u o'quvchi matni emas, qolip API nomi; propni shu doimiy orqali beramiz (9-Modul 1-dars yechimi, MEXANIZM-TAKLIF 10).
const QKOD_ONG = 'muh\u0061rrir';
// Kod ko'rinishida qator bo'linadigan joy — zanjir nuqtasi oldida (.forEach( · .addEventListener(): telefonda so'z o'rtasidan bo'linmaydi
const KOD_BOLAK = /(?=\.[A-Za-z_$][\w$]*\()/;
// Koddagi uch «shu yerga» joyi — 1, 2, 3 raqamli accent belgi (vazifa bandiga sichqoncha borsa yonadi)
const KOD_JOY = /^(\s*)(\/\/ ([123])\) .*)$/;
// Mini-telefon (SABOQ 20): uch chaqiruv qachon «yonadi» — sahifa ochildi → katak bosildi → band saqlandi (201)
const KOD_YONISH = [
  { t: { uz: 'sahifa ochildi', ru: 'страница открылась' }, nom: 'ochdi', tel: 'ochiq' },
  { t: { uz: 'katak bosildi', ru: "нажата ячейка" }, nom: 'vaqt-tanladi', tel: 'forma' },
  { t: { uz: 'band saqlandi (201)', ru: 'бронь сохранена (201)' }, nom: 'band-qildi', tel: 'band' }
];
const KodSatr = ({ q, fokus }) => {
  const m = KOD_JOY.exec(q);
  if (m) return <span className={cxx('et-kod-q', 'et-kod-joy', fokus === Number(m[3]) - 1 && 'on')}>{m[1]}<b className="et-kod-raqam">{m[3]}</b><span className="et-kod-izoh">{m[2]}</span></span>;
  return <span className="et-kod-q">{q ? q.split(KOD_BOLAK).map((b, j) => <React.Fragment key={j}>{j > 0 && <wbr />}{b}</React.Fragment>) : ' '}</span>;
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
  const [fokus, setFokus] = useState(null); // sichqoncha/fokus turgan vazifa bandi
  const [demo, setDemo] = useState(kam ? 3 : 0); // mini-telefon: nechta chaqiruv «yondi» (kirishda bir marta o'ynaydi)
  const taymer = useTaymer();
  useEffect(() => { if (kam) return; [700, 1900, 3100].forEach((ms, i) => taymer(() => setDemo(i + 1), ms)); }, []); // eslint-disable-line
  const telHolat = fokus !== null ? KOD_YONISH[fokus].tel : demo > 0 ? KOD_YONISH[demo - 1].tel : 'yopiq';
  const finish = ({ codes, code: c2 } = {}) => {
    const yangi = (codes && codes['app.js']) || c2 || code || tr(KOD_APP);
    setOpen(false); setCode(yangi);
    if (!done) {
      setDone(true);
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: yangi, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · uch hodisa', ru: 'Пишем код · три события' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Kodni yozing', ru: 'Напишите код' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Uch hodisani <span className="italic" style={{ color: T.accent }}>to'g'ri joyda</span> yozadigan kod yozamiz.</>, ru: <>Пишем код: три события <span className="italic" style={{ color: T.accent }}>в нужных местах</span>.</> })}
        mentor={<Mentor>{fmtCode(tr({ uz: '`hodisaYoz` tayyor — uni qayerda chaqirishni siz tanlaysiz. Kodni o\'zingiz terib yozasiz: qo\'lda yozganda o\'rganiladi.', ru: '`hodisaYoz` готова — где её вызывать, выбираете вы. Код набираете сами: так он запоминается.' }))}</Mentor>}
        vazifa={<>
          <ol className="et-vazifa">{KOD_VAZIFA.map((v, i) => <li key={i} tabIndex={0} className={cxx(done && 'ok', fokus === i && 'on')} onMouseEnter={() => setFokus(i)} onMouseLeave={() => setFokus(null)} onFocus={() => setFokus(i)} onBlur={() => setFokus(null)} onClick={() => setFokus(i)}><i>{done ? '✓' : i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>
          <div className="et-mini">
            <Telefon holat={telHolat} />
            <ol className="et-yonish">{KOD_YONISH.map((y, i) => <li key={i} className={cxx((fokus === null ? i < demo : fokus === i) && 'yon')}><i>{i + 1}</i><span>{tr(y.t)}</span><code>{y.nom}</code></li>)}</ol>
          </div>
        </>}
        yordam={<div className="et-yordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
          {yordam && <QIzoh>{fmtCode(tr(KOD_YORDAM))}</QIzoh>}
        </div>}
        {...{ [QKOD_ONG]: <div className="et-kodoyna">
          <pre className="et-kod" onCopy={(e) => e.preventDefault()} aria-label="app.js"><span className="et-kod-f">app.js</span>{(code || tr(KOD_APP)).split('\n').map((q, i) => <KodSatr key={i} q={q} fokus={fokus} />)}</pre>
          {!isMentor && <div className="et-amal">
            <QTugma className={!done ? 'et-navbat' : undefined} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma>
            <span className="et-amal-izoh">{tr({ uz: "Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Откроется окно кода — пишете код и сразу видите результат здесь.' })}</span>
          </div>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      >
        {done && <QXulosa>{fmtCode(tr({ uz: 'Hodisa harakat bo\'lgan joyda yoziladi; `band-qildi` — faqat band saqlangandan keyin.', ru: 'Событие пишется там, где произошло действие; `band-qildi` — только после сохранения брони.' }))}</QXulosa>}
      </QKod>
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), .hc-root ham o'zi qo'yadi — qobiq tashqi zoomni bekor qiladi */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={tr(KOD_APP)} storageKey="m8d2-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// steps [{ h, t, prompt?: [satr], err?, forma? }] · 5-qadam «O'z g'oyangiz»: A1 da uch hodisa nomi formasi (qolipda forma turi yo'q — shu ulagichda, HodisaForma).
const NOM_QOIDA = /^[a-z0-9']+(-[a-z0-9']+)*$/; // 9-Modul 6-dars nom qoidasi: kichik harf, so'zlar chiziqcha bilan
const nomTogri = (s) => NOM_QOIDA.test(s) && s.length <= 50;
// 9-Modul 6-dars natijasi `pm-m7d6-qadamlar` { asosiy, oldingi, hodisa } — bo'lsa, o'rtadagi qadamga o'zi qo'yiladi (tayanch 9.9); yangi kalit yozilmaydi
const oldingiHodisa = () => { try { const o = JSON.parse(localStorage.getItem('pm-m7d6-qadamlar') || 'null'); const h = o && typeof o.hodisa === 'string' ? o.hodisa.trim() : ''; return nomTogri(h) ? h : ''; } catch { return ''; } };
const HodisaForma = ({ qiymat, onYoz }) => (
  <span className="et-forma">
    {[0, 1, 2].map(i => {
      const v = qiymat[i] || '';
      const xato = !!v.trim() && !nomTogri(v.trim());
      return <label key={i} className={cxx('et-forma-q', xato && 'xato', v.trim() && !xato && 'ok')}><span className="et-forma-n">{i + 1}</span><input value={v} maxLength={50} placeholder={HODISA_NOMLARI[i]} onChange={e => onYoz(i, e.target.value)} /></label>;
    })}
    <span className="et-forma-yoriq">{tr({ uz: "Uch hodisa — loyihangizdagi uch qadam; oxirgisi — bosh raqam hodisasi. Umami darsida saqlangan hodisa nomi bo'lsa, o'rtadagi qadamga o'zi qo'yiladi.", ru: 'Три события — три шага вашего проекта; последнее — событие главного числа. Если на уроке Umami сохранено название события, оно само встанет в средний шаг.' })}</span>
  </span>
);
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda = [], doneText }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const formaN = steps.findIndex(c => c.forma);
  const [nomlar, setNomlar] = useState(() => (storedAnswer && Array.isArray(storedAnswer.nomlar) ? storedAnswer.nomlar : ['', formaN >= 0 ? oldingiHodisa() : '', '']));
  const tola = nomlar.every(v => nomTogri(String(v).trim()));
  const done = stepN >= steps.length;
  const bajardim = () => {
    if (isMentorLive || done) return;
    if (stepN === formaN && !tola) return; // 5-qadam: uch nom to'g'ri yozilmaguncha «Bajardim» yopiq
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, ...(formaN >= 0 ? { nomlar } : {}) });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const yoz = (i, v) => setNomlar(a => a.map((x, j) => (j === i ? v : x)));
  const uchNom = tola ? nomlar.map(v => v.trim()) : null;
  const promptSatr = (l) => { const s = tr(l); return uchNom ? s.replace(/\{uch hodisa nomi\}|\{названия трёх событий\}/, uchNom[0] + ', ' + uchNom[1] + tr({ uz: ' yoki ', ru: ' или ' }) + uchNom[2]) : s; };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: c.forma ? <>{fmtCode(tr(c.t))}<HodisaForma qiymat={nomlar} onYoz={yoz} /></> : (typeof c.t === 'function' ? c.t() : fmtCode(tr(c.t))),
          prompt: c.prompt && c.prompt.map(promptSatr),
          kimga: c.prompt && tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }),
          xato: c.err && fmtCode(tr(c.err))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortda}
        pastki={<MentorPracticeStats live={_live} screen={screen} />} />
    </Stage>
  );
}
// Kutilgan natija maketlari — chizilgan, logotipsiz: Antigravity terminali, Neon SQL Editor, Umami
const EtTerminal = ({ sarlavha, satrlar }) => (
  <div className="et-term"><span className="et-term-h">{sarlavha}</span>{satrlar.map((q, i) => <p key={i} className={cxx('et-term-q', q.k)}>{q.t}</p>)}</div>
);
const NeonKarta = ({ sorov, ustunlar, qatorlar, izoh }) => (
  <div className="et-neon">
    <div className="et-neon-bar"><i /><i /><i /><span>Neon · SQL Editor</span></div>
    <pre className="et-neon-sql">{sorov}</pre>
    <table className="hc-jt"><thead><tr>{ustunlar.map(u => <th key={u}>{u}</th>)}</tr></thead><tbody>{qatorlar.map((q, i) => <tr key={i}>{q.map((v, j) => <td key={j}>{v}</td>)}</tr>)}</tbody></table>
    {izoh && <p className="et-neon-izoh">{izoh}</p>}
  </div>
);
const ORTDA_FETCH = 'git fetch https://github.com/Azizbekcrypto/maydon --tags';
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon', ru: 'ожидаемый результат · образец: Maydon' };
const XATO_YOLI = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
const QADAM_GOYA = { uz: "O'z g'oyangiz", ru: 'Ваша идея' };
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · Backend → Database', ru: 'Практика 1 · Backend → Database' }}
    title={{ uz: <>Backend hodisani qabul qilib, <span className="italic" style={{ color: T.accent }}>jadvalga yozsin</span>.</>, ru: <>Backend принимает событие и <span className="italic" style={{ color: T.accent }}>пишет в таблицу</span>.</> }}
    mentor={{ uz: <>Kodni Antigravity yozadi — jadvalni va 400 ni esa siz terminal va Neon'da tekshirasiz. <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Код пишет Antigravity — а таблицу и 400 вы проверяете в терминале и в Neon. Начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da `maydon` papkasini oching. Terminalda `cd backend`, keyin `npm run start:dev`; brauzerda `localhost:3000` — «Maydon Backend ishlayapti».", ru: 'Откройте папку `maydon` в Antigravity. В терминале `cd backend`, затем `npm run start:dev`; в браузере `localhost:3000` — «Maydon Backend ishlayapti».' } },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'Нажмите «Скопировать» и отправьте в Antigravity:' }, prompt: [
        { uz: 'Qayerda: backend/ — band.entity.ts va bandlar.controller.ts dagidek.', ru: 'Где: backend/ — как в band.entity.ts и bandlar.controller.ts.' },
        { uz: "Nima qilsin: hodisalar jadvali — id, nom (matn), brauzer_id (matn), yaratilgan. POST /hodisalar { nom, brauzer_id } ni olsin: nom faqat ochdi, vaqt-tanladi yoki band-qildi, brauzer_id — satr, 1–64 belgi; aks holda 400. To'g'ri bo'lsa, jadvalga bitta qator yozsin.", ru: 'Что сделать: таблица hodisalar — id, nom (текст), brauzer_id (текст), yaratilgan. POST /hodisalar принимает { nom, brauzer_id }: nom только ochdi, vaqt-tanladi или band-qildi, brauzer_id — строка, 1–64 символа; иначе 400. Если верно — пишет в таблицу одну строку.' },
        { uz: "Nima buzilmasin: bandlar jadvali va boshqa yo'llar o'zgarmasin. O'zgargan fayllarni ayt.", ru: 'Что не сломать: таблица bandlar и другие маршруты не меняются. Назови изменённые файлы.' }
      ] },
      { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: { uz: "Backend terminali o'zi qayta ishga tushadi, xato yo'q. Antigravity'ga yozing: «`POST /hodisalar` ga ikki so'rov yuborib tekshir: `ochdi` va `Band qildi`, `brauzer_id` — `tekshiruv`. Qaytgan sonlarni ayt.» Kutilgani: `201` va `400`.", ru: 'Терминал Backend сам перезапустится, ошибок нет. Напишите Antigravity: «Отправь два запроса на `POST /hodisalar` и проверь: `ochdi` и `Band qildi`, `brauzer_id` — `tekshiruv`. Скажи, какие коды вернулись.» Ожидается: `201` и `400`.' }, err: XATO_YOLI },
      { h: { uz: "Neon'da tekshirish", ru: 'Проверка в Neon' }, t: { uz: "Neon'dagi SQL Editor'da: `SELECT * FROM hodisalar;` — bitta qator: `ochdi · tekshiruv`, `Band qildi` qatori yo'q. Agent nima desa ham, jadval shuni ko'rsatsin. So'ng tekshiruv qatorini o'chiring: `DELETE FROM hodisalar WHERE brauzer_id = 'tekshiruv';` — jadval bo'sh, sayt yozishga tayyor.", ru: "В SQL Editor в Neon: `SELECT * FROM hodisalar;` — одна строка: `ochdi · tekshiruv`, строки `Band qildi` нет. Что бы ни сказал агент, таблица должна показать это. Затем удалите проверочную строку: `DELETE FROM hodisalar WHERE brauzer_id = 'tekshiruv';` — таблица пуста, сайт готов писать." } },
      { h: QADAM_GOYA, forma: true, t: { uz: "qavs ichini o'z loyihangiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:", ru: 'заполните скобки своим проектом, нажмите «Скопировать» и сохраните — отправите дома в своей папке:' }, prompt: [
        { uz: 'Qayerda: {loyiha papkasi}/backend.', ru: 'Где: {папка проекта}/backend.' },
        { uz: "Nima qilsin: hodisalar jadvali — id, nom, brauzer_id, yaratilgan. POST /hodisalar: nom faqat {uch hodisa nomi} dan biri, brauzer_id — satr, 1–64 belgi; aks holda 400.", ru: 'Что сделать: таблица hodisalar — id, nom, brauzer_id, yaratilgan. POST /hodisalar: nom только одно из {названия трёх событий}, brauzer_id — строка, 1–64 символа; иначе 400.' },
        { uz: "Nima buzilmasin: boshqa jadvallar va yo'llar o'zgarmasin. O'zgargan fayllarni ayt.", ru: 'Что не сломать: другие таблицы и маршруты не меняются. Назови изменённые файлы.' }
      ] }
    ]}
    natijaYorliq={NATIJA_YORLIQ}
    natija={<div className="et-natija">
      <EtTerminal sarlavha={tr({ uz: 'Antigravity · terminal', ru: 'Antigravity · терминал' })} satrlar={[{ t: 'POST /hodisalar · ochdi → 201', k: 'ok' }, { t: 'POST /hodisalar · Band qildi → 400', k: 'err' }]} />
      <NeonKarta sorov="SELECT * FROM hodisalar;" ustunlar={USTUN_4} qatorlar={[['1', 'ochdi', 'tekshiruv', '…']]} />
    </div>}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-02-start']}
    doneText={{ uz: "Backend hodisani qabul qiladi: to'g'ri nom — jadvalga, xato nom — 400.", ru: 'Backend принимает событие: верное название — в таблицу, ошибочное — 400.' }} />
);
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · sayt → hodisalar', ru: 'Практика 2 · сайт → hodisalar' }}
    title={{ uz: <>Sayt uch hodisani <span className="italic" style={{ color: T.accent }}>o'z jadvalimizga</span> yuborsin.</>, ru: <>Пусть сайт отправляет три события <span className="italic" style={{ color: T.accent }}>в нашу таблицу</span>.</> }}
    mentor={{ uz: <>Yuborish funksiyasini Antigravity yozadi, uni qayerda chaqirishni — siz. <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Функцию отправки пишет Antigravity, а где её вызывать — решаете вы. Начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: 'Backend terminali ishlab tursin. Ikkinchi terminalda `cd web`, keyin `npm run dev`; brauzerda `localhost:5173` — kataklar chiqsin.', ru: "Терминал Backend пусть работает. Во втором терминале `cd web`, затем `npm run dev`; в браузере `localhost:5173` — должны появиться ячейки." } },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'Нажмите «Скопировать» и отправьте в Antigravity:' }, prompt: [
        { uz: "Qayerda: yangi fayl web/src/hodisa.js; Backend manzili — api.js dagi API.", ru: 'Где: новый файл web/src/hodisa.js; адрес Backend — API в api.js.' },
        { uz: "Nima qilsin: hodisaYoz(nom) POST /hodisalar ga { nom, brauzer_id } yuborsin. brauzer_id — localStorage'dagi maydon-brauzer; yo'q bo'lsa tasodifiy ID yaratib, shu kalitga saqlasin.", ru: 'Что сделать: hodisaYoz(nom) отправляет { nom, brauzer_id } на POST /hodisalar. brauzer_id — maydon-brauzer из localStorage; если нет — создать случайный ID и сохранить под этим ключом.' },
        { uz: "Nima buzilmasin: ism va telefon yuborilmasin; so'rov o'tmasa ham sayt ishlayversin, foydalanuvchiga xato ko'rsatilmasin — konsolda ogohlantirish qolsin. Boshqa fayllarga tegma — chaqiruvlarni men yozaman.", ru: 'Что не сломать: имя и телефон не отправлять; если запрос не прошёл, сайт работает дальше, пользователю ошибку не показывать — в консоли остаётся предупреждение. Другие файлы не трогай — вызовы напишу я.' }
      ], err: XATO_YOLI },
      { h: { uz: "Uch chaqiruv — qo'lda", ru: 'Три вызова — вручную' }, t: () => <>
        <span className="et-blok-satr">{fmtCode(tr({ uz: "`web/src/main.jsx` — tepaga `import { hodisaYoz } from './hodisa.js'`; `const egami = …` dan keyin: `if (!egami) hodisaYoz('ochdi')` — `/ega` sahifasi o'yinchi emas, sanalmaydi.", ru: "`web/src/main.jsx` — вверху `import { hodisaYoz } from './hodisa.js'`; после `const egami = …`: `if (!egami) hodisaYoz('ochdi')` — на странице `/ega` не игрок, она не считается." }))}</span>
        <span className="et-blok-satr">{fmtCode(tr({ uz: "`web/src/App.jsx` — tepaga o'sha import; `tanla` funksiyasi ichida: `hodisaYoz('vaqt-tanladi')`; `saqlandi` funksiyasi ichida (u band muvaffaqiyatli saqlangandan keyingina chaqiriladi), Umami'ning `band-qildi` chaqiruvi yonida: `hodisaYoz('band-qildi')`.", ru: "`web/src/App.jsx` — вверху тот же import; внутри функции `tanla`: `hodisaYoz('vaqt-tanladi')`; внутри функции `saqlandi` (она вызывается только после успешного сохранения брони), рядом с вызовом `band-qildi` для Umami: `hodisaYoz('band-qildi')`." }))}</span>
        <span className="et-blok-satr">{tr({ uz: "Saqlang — sayt o'zi yangilanadi.", ru: 'Сохраните — сайт обновится сам.' })}</span>
      </> },
      { h: { uz: 'Ikki tizimda tekshirish', ru: 'Проверка в двух системах' }, t: () => <>
        <span className="et-blok-satr">{fmtCode(tr({ uz: "avval Neon'dagi SQL Editor'da `SELECT nom, COUNT(DISTINCT brauzer_id) FROM hodisalar GROUP BY nom;` ni ishga tushirib, sonlarni yozib oling (bo'sh bo'lsa — 0).", ru: 'сначала запустите в SQL Editor в Neon `SELECT nom, COUNT(DISTINCT brauzer_id) FROM hodisalar GROUP BY nom;` и запишите числа (если пусто — 0).' }))}</span>
        <span className="et-blok-satr">{fmtCode(tr({ uz: "Saytda bo'sh vaqtni tanlang va band qiling (ism va telefon — namuna), SQL'ni qayta ishga tushiring: yangi brauzer bo'lsa uch nom ham oshadi. Umami'da «Events» bo'limida `vaqt-tanladi` va `band-qildi` ham oshdi.", ru: 'На сайте выберите свободное время и забронируйте (имя и телефон — образец), снова запустите SQL: если браузер новый, вырастут все три названия. В Umami в разделе «Events» выросли и `vaqt-tanladi`, и `band-qildi`.' }))}</span>
        <span className="et-blok-satr">{fmtCode(tr({ uz: "Keyin inkognito oynada (Chrome va Edge: Ctrl+Shift+N, Mac — Cmd+Shift+N) saytni oching va bitta vaqtni tanlang. SQL'ni qayta ishga tushiring: `ochdi` va `vaqt-tanladi` yana bittaga oshdi — yangi brauzer.", ru: 'Затем откройте сайт в окне инкогнито (Chrome и Edge: Ctrl+Shift+N, Mac — Cmd+Shift+N) и выберите одно время. Снова запустите SQL: `ochdi` и `vaqt-tanladi` выросли ещё на один — новый браузер.' }))}</span>
        <span className="et-blok-satr">{tr({ uz: "Aniq son emas, oshgani muhim: jadvalda oldingi urinishlar qolgan bo'lishi mumkin. Umami'da Visitors o'zgarmasligi mumkin — u brauzerni o'z usuli bilan taniydi. Jadvalda hech narsa yo'q bo'lsa — Backend terminali ishlayotganini tekshiring.", ru: "Важно не точное число, а рост: в таблице могли остаться прежние попытки. Visitors в Umami может не измениться — Umami узнаёт браузер своим способом. Если в таблице ничего нет — проверьте, что терминал Backend работает." })}</span>
      </> },
      { h: QADAM_GOYA, t: { uz: "qavs ichini to'ldiring, «Nusxalash» — uyda o'z loyihangizda yuborasiz:", ru: 'заполните скобки, «Скопировать» — отправите дома в своём проекте:' }, prompt: [
        { uz: 'Qayerda: {loyiha papkasi}/web — yangi fayl hodisa.js.', ru: 'Где: {папка проекта}/web — новый файл hodisa.js.' },
        { uz: "Nima qilsin: hodisaYoz(nom) POST /hodisalar ga { nom, brauzer_id } yuborsin; brauzer_id — localStorage'dagi {loyiha nomi}-brauzer (yo'q bo'lsa tasodifiy ID).", ru: 'Что сделать: hodisaYoz(nom) отправляет { nom, brauzer_id } на POST /hodisalar; brauzer_id — {название проекта}-brauzer из localStorage (если нет — случайный ID).' },
        { uz: "Nima buzilmasin: ism va telefon yuborilmasin; so'rov o'tmasa ham sayt ishlayversin, konsolda ogohlantirish qolsin. Chaqiruvlarni ({uch hodisa nomi}) men yozaman.", ru: 'Что не сломать: имя и телефон не отправлять; если запрос не прошёл, сайт работает дальше, в консоли остаётся предупреждение. Вызовы ({названия трёх событий}) напишу я.' }
      ] }
    ]}
    natijaYorliq={NATIJA_YORLIQ}
    natija={<div className="et-natija">
      <NeonKarta sorov="SELECT nom, COUNT(DISTINCT brauzer_id) FROM hodisalar GROUP BY nom;"
        ustunlar={['nom', tr({ uz: 'oldin', ru: 'до' }), tr({ uz: 'band qilgach', ru: 'после брони' }), tr({ uz: 'inkognitodan keyin', ru: 'после инкогнито' })]}
        qatorlar={[['ochdi', '0', '1', '2'], ['vaqt-tanladi', '0', '1', '2'], ['band-qildi', '0', '1', '1']]}
        izoh={tr({ uz: "toza jadvalda; sizda oldingi urinishlar bilan boshqacha bo'lishi mumkin", ru: 'в чистой таблице; у вас с прежними попытками может быть иначе' })} />
      <div className="hc-umami-k"><span className="hc-jadval-n">Umami · Events</span>
        <div className="hc-um-q"><span><code>vaqt-tanladi</code></span><b>2</b></div>
        <div className="hc-um-q"><span><code>band-qildi</code></span><b>1</b></div>
      </div>
    </div>}
    ortda={[ORTDA_FETCH, 'git checkout -f m10-dars-02-done']}
    doneText={{ uz: 'Uch hodisa o\'z jadvalimizga yoziladi — Umami ham yozishda davom etadi.', ru: 'Три события пишутся в нашу таблицу — Umami тоже продолжает записывать.' }} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran, Mentorsiz (SABOQ 12, 16)
const KARTOCHKALAR = [
  { front: { uz: 'Hodisa nima?', ru: 'Что такое событие?' }, back: { uz: 'Analitikaga yoziladigan bitta harakat', ru: "Одно действие, которое пишется в аналитику" }, note: { uz: 'Bizda — hodisalar jadvalidagi bitta qator', ru: 'У нас — одна строка в таблице hodisalar' } },
  { front: { uz: "«Maydon»ning uch hodisasi qaysi?", ru: 'Какие три события у «Maydon»?' }, back: { uz: 'ochdi · vaqt-tanladi · band-qildi', ru: 'ochdi · vaqt-tanladi · band-qildi' }, note: { uz: 'Uch qadam: ochdi, vaqtni tanladi, band qildi', ru: 'Три шага: открыл, выбрал время, забронировал' } },
  { front: { uz: 'Hodisa saytdan jadvalga qanday yetadi?', ru: 'Как событие доходит с сайта до таблицы?' }, back: { uz: 'Sayt POST /hodisalar yuboradi, Backend jadvalga yozadi', ru: 'Сайт отправляет POST /hodisalar, Backend пишет в таблицу' }, note: { uz: "Umami o'z hisobiga alohida yozadi", ru: 'Umami пишет отдельно в свой аккаунт' } },
  { front: { uz: "Nega o'z jadvalimizda sahifa ochilishi ham nom oladi?", ru: 'Почему в нашей таблице открытие страницы тоже получает название?' }, back: { uz: "Unga hech narsa o'zi yozilmaydi", ru: 'Туда ничего не пишется само' }, note: { uz: "Umami'da ochilish avtomatik yozilardi", ru: 'В Umami открытие записывалось автоматически' } },
  { front: { uz: 'Backend qaysi hodisa nomlarini yozadi?', ru: 'Какие названия событий пишет Backend?' }, back: { uz: 'Faqat uchtasini', ru: 'Только три' }, note: { uz: 'Boshqa nom — 400, qator yozilmaydi', ru: 'Другое название — 400, строка не пишется' } },
  { front: { uz: "Nomlar ro'yxati nega kerak?", ru: 'Зачем нужен список названий?' }, back: { uz: 'Bitta harakat ikki nom bilan sanalmasligi uchun', ru: 'Чтобы одно действие не считалось под двумя названиями' }, note: { uz: 'Masalan, Band qildi va band-qildi', ru: 'Например, Band qildi и band-qildi' } },
  { front: { uz: 'Brauzer ID nima?', ru: 'Что такое ID браузера?' }, back: { uz: 'Bitta brauzerni ajratadigan tasodifiy harf va raqamlar', ru: 'Случайные буквы и цифры, различающие один браузер' }, note: { uz: 'Ismni ham, telefonni ham bildirmaydi', ru: 'Не сообщает ни имени, ни телефона' } },
  { front: { uz: 'Brauzer ID qayerda saqlanadi?', ru: 'Где хранится ID браузера?' }, back: { uz: 'Brauzer xotirasida (localStorage)', ru: 'В памяти браузера (localStorage)' }, note: { uz: "Kalit maydon-brauzer — yangilansa ham o'sha", ru: 'Ключ maydon-brauzer — при обновлении тот же' } },
  { front: { uz: 'Bitta odam ikki telefonda ochsa, nechta brauzer ID bo\'ladi?', ru: 'Если один человек откроет на двух телефонах, сколько будет ID браузера?' }, back: { uz: 'Ikkita', ru: 'Два' }, note: { uz: 'Brauzer ID odamni emas, brauzerni ajratadi', ru: 'ID браузера различает не человека, а браузер' } },
  { front: { uz: 'band-qildi qachon yoziladi?', ru: 'Когда пишется band-qildi?' }, back: { uz: 'Band saqlangandan keyin', ru: 'После сохранения брони' }, note: { uz: '409 qaytsa, yozilmaydi', ru: 'Если вернулся 409 — не пишется' } },
  { front: { uz: 'Har qadamda nimani sanaymiz?', ru: 'Что считаем на каждом шаге?' }, back: { uz: 'Turli brauzerlar sonini', ru: 'Число разных браузеров' }, note: { uz: 'COUNT(DISTINCT brauzer_id)', ru: 'COUNT(DISTINCT brauzer_id)' } },
  { front: { uz: 'Umami va jadval soni nega farq qiladi?', ru: 'Почему числа Umami и таблицы различаются?' }, back: { uz: 'Ikki tizim har xil usulda sanaydi', ru: 'Две системы считают разными способами' }, note: { uz: "Sabablardan biri — reklama to'sgichi", ru: 'Одна из причин — блокировщик рекламы' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); ko'rsatma karta ostida, birinchi bosishgacha, karta yuzi halqada */}
        <div className={cxx('et-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="et-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204). CODE STRIKE va arena — jonli o'yin qatlami; uyga vazifa — karta «kim uchun · nechta · muddat» =====
const YAKUN_RECAP = [
  { uz: "Sayt hodisani Backend'ga yuboradi; so'rov o'tsa, Backend uni `hodisalar` jadvaliga bitta qator qilib yozadi.", ru: 'Сайт отправляет событие в Backend; если запрос прошёл, Backend записывает его одной строкой в таблицу `hodisalar`.' },
  { uz: "«Maydon» Backend'i faqat uchta nomni qabul qiladi, boshqa nomga 400 qaytaradi.", ru: 'Backend «Maydon» принимает только три названия, на другое возвращает 400.' },
  { uz: 'Brauzer ID brauzerni ajratadi va odamning ismini ham, telefonini ham bildirmaydi.', ru: 'ID браузера различает браузер и не сообщает ни имени человека, ни телефона.' },
  { uz: '`band-qildi` faqat band saqlangandan keyin yoziladi.', ru: '`band-qildi` пишется только после сохранения брони.' },
  { uz: "O'z jadvalimizda har qadamda turli brauzerlar sanaladi; Umami brauzerni boshqacha taniydi, shuning uchun farq tabiiy.", ru: 'В нашей таблице на каждом шаге считаются разные браузеры; Umami узнаёт браузер иначе, поэтому разница естественна.' }
];
const UYGA = [
  { b: 'Backend', t: { uz: "A1 dagi «O'z g'oyangiz» promptini loyihangizda yuboring: hodisalar jadvali va POST /hodisalar paydo bo'lsin.", ru: 'Отправьте в своём проекте промпт «Ваша идея» из A1: должны появиться таблица hodisalar и POST /hodisalar.' } },
  { b: { uz: 'Sayt', ru: 'Сайт' }, t: { uz: "A2 dagi promptni yuboring va uch chaqiruvni qo'lda yozing — har biri harakat bo'lgan joyda.", ru: 'Отправьте промпт из A2 и напишите три вызова вручную — каждый там, где происходит действие.' } },
  { b: { uz: 'Ikki tizim', ru: 'Две системы' }, t: { uz: "push qiling, internetdagi saytingizni ikki kishi ochsin. Neon'dagi sanoqni Umami bilan solishtiring va farqni bir gapda yozing.", ru: 'сделайте push, пусть ваш сайт в интернете откроют два человека. Сравните подсчёт в Neon с Umami и напишите разницу одним предложением.' } }
];
const HwKarta = () => (
  <div className="card hw fade-up d4">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="et-hw-meta">
      <span><small>{tr({ uz: 'kim uchun', ru: 'для кого' })}</small>{tr({ uz: "o'z loyihangiz", ru: 'ваш проект' })}</span>
      <span><small>{tr({ uz: 'nechta', ru: 'сколько' })}</small>{tr({ uz: '3 hodisa', ru: '3 события' })}</span>
      <span><small>{tr({ uz: 'muddat', ru: 'срок' })}</small>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</span>
    </div>
    <ol className="et-hw-q">{UYGA.map((h, i) => <li key={i}><i>{i + 1}</i><span><b>{tr(h.b)}</b> — {tr(h.t)}</span></li>)}</ol>
    <p className="hw-note">{tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: jonli dashboard»</b>. Talabni siz yozasiz, agent dashboard'ni (holat panelini) yig'adi: jadvaldagi hodisalar bir sahifada ko'rinadi.</>, ru: <>Следующий урок — <b>«День проекта: живой дашборд»</b>. Требование пишете вы, агент собирает дашборд (панель состояния): события из таблицы видны на одной странице.</> })}</p>
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
        chip={tr({ uz: 'Uch hodisa jadvalda', ru: 'Три события в таблице' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Hodisalar tizimi ishlayapti: <span className="italic" style={{ color: T.accent }}>uch hodisa jadvalda</span>.</>, ru: <>Система событий работает: <span className="italic" style={{ color: T.accent }}>три события в таблице</span>.</> })}
        cta={<>
          <p className="small et-fikr fade-up d1">{tr({ uz: 'Hodisalar o\'z jadvalimizda turgani uchun uch qadamni bitta qoida bilan sanaymiz: har qadamda turli brauzerlar soni.', ru: 'Поскольку события лежат в нашей таблице, три шага считаем по одному правилу: число разных браузеров на каждом шаге.' })}</p>
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
export default function EventTrackingLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — «Hodisalar chizmasi» (hc-) va ekran yordamchilari (et-). Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .et-navbat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: et-puls 1.8s ease-out infinite; }
        @keyframes et-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        .et-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; }
        .et-taxmin-y { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .et-taxmin-s { font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .et-taxmin b { font-size: 14px; color: ${T.ink}; }
        p.et-joriy { margin: 0; padding: 10px 14px; border-radius: 12px; background: ${T.accentSoft}; color: ${T.ink}; font-size: 14.5px; line-height: 1.5; }
        p.et-repo { margin: 6px 0 0; font-size: 12px; color: ${T.ink2}; }
        .hc-tel-manzil { display: flex; align-items: center; gap: 6px; height: 20px; padding: 0 8px; border-radius: 10px; background: ${T.bg}; margin-bottom: 6px; }
        .hc-tel-manzil i { flex: 1; height: 5px; border-radius: 3px; background: ${T.line}; }
        .hc-tosgich { font-size: 9.5px; font-weight: 700; color: ${T.err}; background: ${fon(T.err, 0.1)}; border: 1px dashed ${T.err}; border-radius: 6px; padding: 0 5px; white-space: nowrap; }
        .hc-ilova { display: flex; flex-direction: column; align-items: center; gap: 6px; background: none; border: 0; border-radius: 14px; padding: 6px; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink}; cursor: pointer; }
        .hc-ilova:disabled { cursor: default; }
        .hc-ilova i { width: 46px; height: 46px; border-radius: 13px; background: ${T.accent}; }
        .hc-tel-sahifa { display: flex; flex-direction: column; gap: 6px; padding: 2px 2px 0; }
        .hc-tel-sar { font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .hc-tel-kun { font-size: 11px; color: ${T.ink2}; }
        .hc-kataklar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
        .hc-katak { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; padding: 6px 0; border: 1px solid ${T.line}; border-radius: 7px; background: ${T.bg}; color: ${T.ink}; cursor: pointer; }
        .hc-katak:disabled { cursor: default; }
        .hc-katak.on { background: ${T.accentSoft}; border-color: ${T.accent}; color: ${T.accent}; font-weight: 700; }
        .hc-katak.band { background: ${fon(T.ok, 0.14)}; border-color: ${T.ok}; color: ${T.ok}; font-weight: 700; }
        .hc-forma { display: flex; flex-direction: column; gap: 4px; }
        .hc-input { display: flex; flex-direction: column; font-size: 11px; color: ${T.ink}; border: 1px solid ${T.line}; border-radius: 6px; padding: 2px 7px; background: ${T.bg}; }
        .hc-input small { font-size: 9px; color: ${T.ink2}; }
        .hc-band { margin-top: 2px; border: 0; border-radius: 8px; padding: 7px 0; background: ${T.accent}; color: ${T.paper}; font-family: 'Manrope'; font-weight: 700; font-size: 12px; cursor: pointer; }
        .hc-band:disabled { cursor: default; }
        .hc-band.tayyor { background: ${T.ok}; }
        .hc-tel-yorliq { font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 999px; }
        .hc-tel-yorliq.b1 { background: ${T.accentSoft}; color: ${T.accent}; }
        .hc-tel-yorliq.b2 { background: ${fon(T.ink, 0.1)}; color: ${T.ink}; }
        .hc-tugun { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; padding: 8px 10px; border: 1.5px solid ${T.line}; border-radius: 12px; background: ${T.paper}; transition: border-color 0.3s; }
        .hc-tugun.ok { border-color: ${T.ok}; } .hc-tugun.err { border-color: ${T.err}; }
        .hc-tugun-n { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink}; }
        .hc-holat { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 6px; animation: et-pop 0.35s cubic-bezier(.3,1.5,.5,1); }
        .hc-holat.ok { background: ${fon(T.ok, 0.14)}; color: ${T.ok}; } .hc-holat.err { background: ${fon(T.err, 0.12)}; color: ${T.err}; }
        .hc-nomlar { display: flex; flex-wrap: wrap; gap: 4px; width: 100%; }
        .hc-nomlar code { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 1px 7px; border-radius: 6px; background: ${fon(T.ok, 0.12)}; color: ${T.ok}; transition: all 0.3s; }
        .hc-nomlar.kulrang code { background: ${fon(T.ink2, 0.12)}; color: ${T.ink2}; }
        .hc-jadval { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; border: 1px solid ${T.line}; border-radius: 10px; background: ${T.paper}; min-width: 0; }
        .hc-jadval.bosh { border-style: dashed; border-width: 1.5px; background: transparent; min-height: 44px; }
        .hc-jadval-n code, .hc-jadval-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .hc-jt { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink}; }
        .hc-jt th { text-align: left; font-size: 10px; font-weight: 600; color: ${T.ink2}; padding: 2px 6px; border-bottom: 1px solid ${T.line}; white-space: nowrap; }
        .hc-jt th.yangi { color: ${T.accent}; outline: 1.5px dashed ${T.accent}; outline-offset: -2px; border-radius: 4px; }
        .hc-jt td { padding: 3px 6px; border-bottom: 1px solid ${T.line}; white-space: nowrap; transition: opacity 0.3s, background 0.3s; }
        .hc-jt tr.qiz td { background: ${fon(T.err, 0.1)}; color: ${T.err}; }
        .hc-jt tr.xira td { opacity: 0.32; }
        .hc-jt tr.yon td { background: ${T.accentSoft}; }
        .hc-jt td.br { font-weight: 700; }
        .hc-jt tr.b1 td.br { color: ${T.accent}; } .hc-jt tr.b2 td.br { color: ${T.ink}; text-decoration: underline; } .hc-jt tr.b3 td.br { color: ${T.ink2}; font-style: italic; }
        .hc-umami-k { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border: 1px solid ${T.line}; border-radius: 10px; background: ${T.paper}; color: ${T.ink2}; }
        .hc-umami-k.miltilla { animation: et-milt 0.45s ease-in-out 3; }
        .hc-um-q { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; }
        .hc-um-q code { font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .hc-um-q b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        .hc-db { display: flex; flex-direction: column; gap: 6px; padding: 8px; border: 1.5px solid ${T.line}; border-radius: 12px; background: ${T.bg}; }
        .hc-kalit-ust { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
        .hc-kalit { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border: 1.5px solid ${T.ok}; border-radius: 999px; background: ${fon(T.ok, 0.1)}; color: ${T.ok}; font-family: 'Manrope'; font-weight: 700; font-size: 13px; cursor: pointer; }
        .hc-kalit i { position: relative; width: 28px; height: 15px; border-radius: 999px; background: ${T.ok}; }
        .hc-kalit i::after { content: ''; position: absolute; top: 2px; right: 2px; width: 11px; height: 11px; border-radius: 50%; background: ${T.paper}; transition: right 0.2s; }
        .hc-kalit.off { border-color: ${T.ink2}; background: ${fon(T.ink2, 0.1)}; color: ${T.ink2}; }
        .hc-kalit.off i { background: ${T.ink2}; } .hc-kalit.off i::after { right: 15px; }
        .hc-kalit-izoh { font-size: 11px; color: ${T.ink2}; border: 1px dashed ${T.line}; border-radius: 6px; padding: 1px 7px; }
        .hc-sanoq { display: flex; flex-wrap: wrap; gap: 6px; font-size: 11px; color: ${T.ink}; }
        .hc-sanoq span { border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 7px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; }
        .hc-usul.on { border-color: ${T.accent}; color: ${T.accent}; }
        .hc-sql { background: ${CODE.bg}; border-radius: 12px; padding: 10px 14px; display: flex; flex-direction: column; gap: 6px; }
        .hc-sql-kod { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.55; color: ${CODE.attr}; white-space: pre-wrap; }
        p.hc-sql-izoh { margin: 0; font-size: 12.5px; color: ${CODE.text}; }
        .hc-savol-j { max-width: 380px; margin: 0 0 12px; }
        ol.et-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .et-vazifa li { display: flex; gap: 10px; align-items: flex-start; font-size: 14.5px; line-height: 1.5; color: ${T.ink}; }
        .et-vazifa li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 700; background: ${T.accentSoft}; color: ${T.accent}; }
        .et-vazifa li.ok i { background: ${fon(T.ok, 0.15)}; color: ${T.ok}; }
        .et-yordam { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 14px; }
        .et-kodoyna { display: flex; flex-direction: column; gap: 12px; }
        .et-kod { font-variant-ligatures: none; margin: 0; padding: 12px 14px; border-radius: 12px; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; white-space: pre; overflow: auto; max-height: 340px; user-select: none; }
        .et-kod-f { display: block; color: ${CODE.attr}; font-weight: 700; }
        /* Uzun qator kesilmaydi: keyingi qatorga 4 belgi chekinish bilan o'tadi — tanadagi 2 belgidan farqli (8-ekran, F-1005-171) */
        .et-kod-q { display: block; white-space: pre-wrap; overflow-wrap: break-word; padding-left: 4ch; text-indent: -4ch; }
        .et-amal { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .et-amal-izoh { font-size: 12.5px; color: ${T.ink2}; text-align: right; }
        .et-blok-satr { display: block; margin-top: 6px; }
        .et-forma { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
        .et-forma-q { display: flex; align-items: center; gap: 8px; }
        .et-forma-n { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; background: ${T.accentSoft}; color: ${T.accent}; }
        .et-forma-q input { flex: 1; min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; padding: 7px 10px; border: 1.5px solid ${T.line}; border-radius: 8px; background: ${T.paper}; color: ${T.ink}; }
        .et-forma-q.xato input { border-color: ${T.err}; background: ${fon(T.err, 0.06)}; }
        .et-forma-q.ok input { border-color: ${T.ok}; }
        .et-forma-yoriq { display: block; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .et-natija { display: flex; flex-direction: column; gap: 10px; }
        .et-term { display: flex; flex-direction: column; gap: 3px; padding: 10px 12px; border-radius: 12px; background: ${CODE.bg}; }
        .et-term-h { font-size: 11px; font-weight: 700; color: ${CODE.comment}; }
        p.et-term-q { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${CODE.text}; }
        p.et-term-q.ok { color: ${CODE.str}; } p.et-term-q.err { color: ${CODE.tag}; }
        .et-neon { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 12px; background: ${T.paper}; overflow: hidden; }
        .et-neon-bar { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .et-neon-bar i { width: 7px; height: 7px; border-radius: 50%; background: ${T.line}; }
        .et-neon-bar span { margin-left: 6px; }
        .et-neon-sql { margin: 0; padding: 8px 10px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; white-space: pre-wrap; border-bottom: 1px solid ${T.line}; }
        .et-neon .hc-jt { margin: 4px 0; }
        p.et-neon-izoh { margin: 0; padding: 4px 10px 8px; font-size: 11px; color: ${T.ink2}; }
        .et-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: et-puls 1.6s ease-out 3; }
        .et-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .et-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: et-nuqta 1.4s ease-in-out 3; }
        p.et-fikr { margin: 4px auto 0; max-width: 640px; text-align: center; color: ${T.ink2}; line-height: 1.5; }
        .et-hw-meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 4px 0 10px; }
        .et-hw-meta span { display: flex; flex-direction: column; padding: 6px 12px; border: 1px solid ${T.line}; border-radius: 10px; background: ${T.bg}; font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .et-hw-meta small { font-size: 10.5px; font-weight: 600; color: ${T.ink2}; }
        ol.et-hw-q { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .et-hw-q li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .et-hw-q li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 700; background: ${T.accentSoft}; color: ${T.accent}; }
        @keyframes et-milt { 50% { opacity: 0.35; } }
        @keyframes et-pop { from { transform: scale(1.35); } }
        @keyframes et-nuqta { 50% { transform: scale(1.6); opacity: 0.4; } }
        /* --- F-1005-174 qayta qurish (06.10): jonli ekran (SABOQ 19–27) --- */
        /* Bashorat: karta yengil ko'tarilib kiradi, variantlar navbat bilan; tanlangach ixcham qatorga yig'iladi */
        .et-navbat-k .q-bashorat { border-color: ${T.accent}; animation: et-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both, et-puls 1.8s ease-out 0.7s infinite; }
        .et-bash .q-chip { animation: et-chip 0.38s ease-out both; }
        .et-bash .q-chip:nth-child(1) { animation-delay: 0.22s; } .et-bash .q-chip:nth-child(2) { animation-delay: 0.32s; } .et-bash .q-chip:nth-child(3) { animation-delay: 0.42s; }
        .et-yig { transform-origin: top center; animation: et-yig 0.42s cubic-bezier(.2,.9,.3,1.1) both; }
        @keyframes et-kot { from { opacity: 0; transform: translateY(14px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes et-chip { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes et-yig { from { opacity: 0.2; transform: scaleY(1.9); } to { opacity: 1; transform: none; } }
        /* Natija bloki: bitta yashil blok, birinchi qatori — taxmin */
        .q-xulosa.et-nb { display: flex; flex-direction: column; gap: 3px; padding: 12px 18px; font-size: 14.5px; line-height: 1.45; }
        .et-nb-t { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .et-nb-t b { color: ${T.ink}; } .et-nb-t.ok { color: ${T.ok}; font-weight: 700; }
        .et-nb-i { font-weight: 700; color: ${T.ink}; }
        .et-nb-q { font-size: 13.5px; color: ${T.ink2}; }
        /* Telefon = sayt: o'lchami barqaror 172×272 (rasm 1); ustida texnologiya yorlig'i, ostida o'z tugmasi */
        .hc-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: none; }
        .hc-telefon { position: relative; width: 172px; height: 272px; display: flex; flex-direction: column; border: 2px solid ${T.ink}; border-radius: 22px; padding: 8px 8px 10px; background: ${T.paper}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.35); overflow: hidden; }
        .hc-tel-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; }
        .hc-tel-uy { flex: 1; display: grid; place-items: center; }
        .hc-tel-tex { display: inline-flex; align-items: center; gap: 7px; padding: 3px 11px; border: 1.5px solid ${T.line}; border-radius: 999px; background: ${T.paper}; font-size: 12px; white-space: nowrap; }
        .hc-tel-tex b { font-family: 'Manrope'; font-weight: 700; color: ${T.ink}; }
        .hc-tel-tex code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.accent}; }
        .hc-tel-ust > .q-btn { align-self: center; max-width: 200px; }
        .hc-tel-manzil:has(.hc-tosgich) { height: auto; min-height: 20px; padding: 2px 6px; }
        .hc-tel-manzil:has(.hc-tosgich) > i { display: none; }
        .hc-tel-manzil .hc-tosgich { flex: 1; min-width: 0; text-align: center; white-space: normal; line-height: 1.2; }
        .hc-tel-ust > .q-btn.et-tel-btn:disabled { opacity: 0.6; }
        .et-qn { margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; opacity: 0.85; }
        .hc-aylana { flex: none; width: 11px; height: 11px; border-radius: 50%; border: 2px solid ${T.accent}; border-right-color: transparent; animation: et-aylan 0.7s linear 1 both; }
        @keyframes et-aylan { from { transform: rotate(0); } 85% { opacity: 1; } to { transform: rotate(360deg); opacity: 0; } }
        .hc-xotira { margin-top: auto; display: flex; flex-direction: column; gap: 1px; padding: 5px 6px; border: 1px dashed ${T.line}; border-radius: 9px; background: ${T.bg}; }
        .hc-xotira.bor { border-style: solid; border-color: ${T.accent}; background: ${T.paper}; animation: et-yon 1.1s ease-out; }
        .hc-xotira-n { font-size: 11px; font-weight: 700; line-height: 1.25; color: ${T.ink2}; }
        .hc-xotira code { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: -0.35px; white-space: nowrap; color: ${T.ink}; }
        @keyframes et-yon { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.5)}; } 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        /* Uchuvchi konvert / nuqta */
        .hc-uchar { position: absolute; z-index: 5; pointer-events: none; transform: translate(-50%, -50%); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; white-space: nowrap; padding: 4px 10px 4px 24px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.accent}; color: ${T.ink}; box-shadow: 0 10px 20px -8px rgba(${T.shadowBase},0.45); animation: et-uch 850ms cubic-bezier(.45,0,.25,1) both; }
        .hc-uchar::before { content: ''; position: absolute; left: 7px; top: 50%; width: 11px; height: 8px; margin-top: -4px; border: 1.5px solid ${T.accent}; border-radius: 2px; }
        .hc-uchar::after { content: ''; position: absolute; left: 10px; top: 50%; width: 5px; height: 5px; margin-top: -5px; border-right: 1.5px solid ${T.accent}; border-bottom: 1.5px solid ${T.accent}; transform: rotate(45deg); }
        .hc-uchar.nuqta { padding: 0; width: 11px; height: 11px; border: 0; border-radius: 50%; background: ${T.accent}; box-shadow: none; }
        .hc-uchar.nuqta::before, .hc-uchar.nuqta::after { display: none; }
        .hc-uchar.kul { background: ${T.ink2}; width: 9px; height: 9px; }
        .hc-uchar.tosildi { background: ${T.ink2}; animation-name: et-uch-tos; }
        .hc-uchar.qayt { animation-name: et-uch-qayt; }
        .hc-uchar.och { border-color: ${T.err}; } .hc-uchar.och::before, .hc-uchar.och::after { border-color: ${T.err}; }
        @keyframes et-uch { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.6); } 14% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 84% { opacity: 1; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.55); } }
        @keyframes et-uch-qayt { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.6); } 8% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 48% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); border-color: ${T.accent}; } 56% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.08); border-color: ${T.err}; color: ${T.err}; background: ${T.errFon}; } 94% { opacity: 1; transform: translate(-50%,-50%) scale(1); border-color: ${T.err}; color: ${T.err}; background: ${T.errFon}; } 100% { opacity: 0; transform: translate(-50%,-50%) scale(0.7); border-color: ${T.err}; } }
        @keyframes et-uch-tos { 0% { opacity: 0; transform: translate(-50%,-50%); } 12% { opacity: 1; } 62% { transform: translate(calc(-50% + var(--dx) * 0.8), calc(-50% + var(--dy) * 0.8)); } 70% { transform: translate(calc(-50% + var(--dx) * 0.86), calc(-50% + var(--dy) * 0.86)); } 78% { transform: translate(calc(-50% + var(--dx) * 0.8), calc(-50% + var(--dy) * 0.8)); opacity: 1; } 100% { transform: translate(calc(-50% + var(--dx) * 0.8), calc(-50% + var(--dy) * 0.8)) scale(0.3); opacity: 0; } }
        /* Hodisalar chizmasi: telefon | yo'lak | Backend → Database */
        .hc-chizma-ust { position: relative; display: flex; flex-direction: column; gap: 10px; }
        .hc-chizma { display: grid; grid-template-columns: 172px minmax(72px, 0.5fr) minmax(0, 1.5fr); align-items: start; gap: 0 14px; }
        .hc-ch-yol { display: flex; flex-direction: column; gap: 5px; margin-top: 50px; min-width: 0; }
        .hc-yol-matn { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: fade-step 0.3s ease-out; }
        i.hc-yol-chiziq { position: relative; display: block; height: 0; border-top: 2px dashed ${T.line}; }
        i.hc-yol-chiziq::after { content: ''; position: absolute; right: -2px; top: -7px; border: 6px solid transparent; border-left: 8px solid ${T.line}; border-right-width: 0; }
        .hc-um-yol { display: flex; align-items: center; gap: 4px; margin-top: 40px; }
        .hc-um-yol > i { flex: 1; min-width: 12px; border-top: 1px dashed ${T.ink2}; opacity: 0.55; }
        .hc-umami { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border: 1px dashed ${T.ink2}; border-radius: 9px; background: ${T.bg}; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .hc-umami b { width: 6px; height: 6px; border-radius: 50%; background: ${T.ink2}; animation: et-pop 0.4s ease-out; }
        .hc-ch-ong { display: flex; flex-direction: column; min-width: 0; margin-top: 38px; }
        .hc-ch-ong > p.et-joriy { margin-top: 10px; font-size: 13.5px; }
        i.hc-pastga { display: block; width: 0; height: 14px; margin-left: 24px; border-left: 2px dashed ${T.line}; }
        .hc-be { animation: none; }
        .hc-tugun.ok, .hc-tugun.err { animation: et-yon-ok 0.9s ease-out; }
        .hc-tugun.err { animation-name: et-yon-err; }
        @keyframes et-yon-ok { 0% { box-shadow: 0 0 0 0 ${fon(T.ok, 0.45)}; } 100% { box-shadow: 0 0 0 10px ${fon(T.ok, 0)}; } }
        @keyframes et-yon-err { 0% { box-shadow: 0 0 0 0 ${fon(T.err, 0.45)}; } 30% { transform: translateX(-3px); } 50% { transform: translateX(3px); } 70% { transform: translateX(-2px); } 100% { box-shadow: 0 0 0 10px ${fon(T.err, 0)}; transform: none; } }
        .hc-tugun .hc-nomlar { order: 3; }
        .hc-tugun .hc-holat { order: 2; }
        .hc-tugun .hc-kalit-ust { order: 4; width: 100%; margin-top: 2px; }
        .hc-ch-ong > p.q-xato { margin: 6px 0 0; animation: fade-step 0.3s ease-out; }
        .hc-nomlar code.yon { background: ${T.ok}; color: ${T.paper}; animation: et-pop 0.4s ease-out; }
        .hc-band-son { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; padding: 2px 9px; border-radius: 7px; background: ${T.paper}; border: 1px solid ${T.line}; animation: et-kir 0.5s ease-out both; }
        .hc-band-son b { color: ${T.ok}; }
        .hc-jt tr.kir td { animation: et-qator 1.3s ease-out backwards; }
        .hc-jt tr.kir td { background: ${fon(T.ok, 0)}; }
        .hc-jt tr.kir.qiz td { animation-name: et-qator-qiz; }
        @keyframes et-qator-qiz { 0% { opacity: 0; transform: translateX(-14px); background: ${T.errFon}; } 22% { opacity: 1; transform: none; } }
        .hc-jt tr.navbat td { animation: et-kir 0.4s ease-out var(--d, 0s) backwards; }
        @keyframes et-qator { 0% { opacity: 0; transform: translateX(-14px); background: ${T.okFon}; } 22% { opacity: 1; transform: none; background: ${T.okFon}; } 70% { background: ${T.okFon}; } 100% { background: ${fon(T.ok, 0)}; } }
        @keyframes et-kir { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
        /* 0-ekran: telefon yonida ikki jonli hisoblagich */
        .hc-kirish { position: relative; display: flex; align-items: center; justify-content: center; gap: 16px; }
        .hc-hb { flex: 1 1 0; min-width: 0; max-width: 270px; display: flex; flex-direction: column; gap: 10px; animation: et-ochil 0.45s ease-out both; }
        @keyframes et-ochil { from { max-width: 0; opacity: 0; } to { max-width: 270px; opacity: 1; } }
        .hc-hb-k { display: flex; flex-direction: column; gap: 3px; padding: 10px 14px; border: 1.5px solid ${T.line}; border-radius: 14px; background: ${T.paper}; transition: border-color 0.3s, background 0.3s; }
        .hc-hb-n { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .hc-hb-son { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; color: ${T.ink2}; white-space: nowrap; }
        .hc-hb-k.maydon.tushdi { border-color: ${T.ok}; background: ${T.okFon}; }
        .hc-hb-k.maydon.tushdi .hc-hb-son { color: ${T.ok}; animation: et-qator-son 0.6s cubic-bezier(.2,.9,.3,1.2) both; }
        .hc-hb-k.umami { border-style: dashed; background: ${T.bg}; }
        .hc-hb-k.umami.tushdi .hc-hb-son { animation: et-silk 0.5s ease-in-out; }
        @keyframes et-qator-son { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: none; } }
        @keyframes et-silk { 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(2px); } }
        i.hc-tosuv { position: relative; flex: none; display: inline-block; width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${T.err}; }
        i.hc-tosuv::after { content: ''; position: absolute; left: 50%; top: -1px; width: 2px; height: 12px; margin-left: -1px; background: ${T.err}; transform: rotate(45deg); }
        /* 4-ekran: telefonda bitta so'rov */
        .hc-se { flex: 1; display: flex; flex-direction: column; gap: 8px; padding: 4px 2px 0; }
        .hc-se-kod { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 10px 9px; border: 1.5px solid ${T.accent}; border-radius: 10px; background: ${T.accentSoft}; }
        .hc-se-kod code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .hc-se-kod code.hc-se-nom { font-size: 14px; font-weight: 800; color: ${T.ink}; padding-left: 4px; white-space: nowrap; }
        .hc-se-yol { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .hc-se-son { margin-top: auto; align-self: flex-end; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .hc-otgan { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 0; font-size: 12.5px; color: ${T.ink2}; animation: fade-step 0.3s ease-out; }
        .hc-otgan span { white-space: nowrap; font-weight: 700; }
        .hc-otgan span + span::before { content: '·'; margin: 0 9px; color: ${T.line}; font-weight: 400; }
        .hc-otgan code { font-family: 'JetBrains Mono', monospace; font-weight: 500; color: ${T.ink}; }
        .hc-otgan .ok { color: ${T.ok}; } .hc-otgan .err { color: ${T.err}; }
        /* 6-ekran: ikki telefon chapda, jadval o'ngda */
        .hc-s6 { position: relative; display: grid; grid-template-columns: auto minmax(40px, 90px) minmax(0, 1fr); align-items: start; gap: 0 14px; }
        .hc-ikki { display: flex; gap: 14px; }
        .hc-s6-yol { margin-top: 150px; }
        .hc-s6-ong { display: flex; flex-direction: column; gap: 12px; margin-top: 74px; min-width: 0; }
        .hc-s6-ong .hc-jt { font-size: 12px; } .hc-s6-ong .hc-jt td { padding: 5px 7px; }
        /* 9-ekran: chapda jadval, o'ngda uch qadam sanog'i */
        .hc-s9 { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 16px; align-items: start; }
        .hc-s9 .hc-jt td { padding: 3px 8px; }
        .hc-s9-ong { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
        .hc-uch { display: flex; gap: 14px; }
        .hc-uch-k { position: relative; flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 14px 14px 12px; border: 1.5px solid ${T.line}; border-radius: 12px; background: ${T.paper}; min-width: 0; }
        .hc-uch-k span { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .hc-uch-k b { align-self: flex-start; transform-origin: left center; font-family: 'JetBrains Mono', monospace; font-size: 40px; line-height: 1.1; font-weight: 800; color: ${T.ink2}; animation: et-pop 0.3s ease-out; }
        .hc-uch-k.bor { border-color: ${T.accent}; } .hc-uch-k.bor b { color: ${T.accent}; }
        .hc-uch-k i { position: absolute; right: -13px; top: 40%; font-style: normal; color: ${T.accent}; font-weight: 700; }
        .hc-usullar { display: flex; flex-wrap: wrap; gap: 10px; }
        .hc-usullar .q-btn { margin-left: 0; flex: 1 1 180px; padding: 13px 16px; }
        .hc-usullar .q-btn[aria-disabled='true'] { cursor: default; }
        /* 11-ekran: telefon = sayt, ikki yo'lak, ikki hisoblagich */
        .hc-s11 { display: grid; grid-template-columns: 172px minmax(80px, 1fr) minmax(240px, 380px); grid-template-areas: 'tel y1 k1' 'tel y2 k2'; gap: 14px 14px; align-items: center; }
        .hc-s11-tel { grid-area: tel; align-self: start; }
        .hc-s11-yol.um { grid-area: y1; } .hc-hisob-k.um { grid-area: k1; }
        .hc-s11-yol.biz { grid-area: y2; } .hc-hisob-k.biz { grid-area: k2; }
        .hc-s11-yol { position: relative; height: 26px; display: flex; align-items: center; }
        .hc-s11-yol > i.hc-yol-chiziq { flex: 1; }
        .hc-s11-yol.um > i.hc-yol-chiziq { border-top-color: ${fon(T.ink2, 0.45)}; }
        i.hc-nq { position: absolute; left: 0; top: 50%; width: 11px; height: 11px; margin-top: -5.5px; border-radius: 50%; background: ${T.accent}; animation: et-yur 0.6s linear both; }
        .hc-s11-yol.um i.hc-nq { background: ${T.ink2}; }
        .hc-s11-yol.um i.hc-nq.tos { animation-name: et-yur-tos; }
        @keyframes et-yur { from { left: 0; opacity: 1; } 90% { opacity: 1; } to { left: calc(100% - 11px); opacity: 0; } }
        @keyframes et-yur-tos { from { left: 0; } 55% { left: 45%; opacity: 1; transform: scale(1); } to { left: 45%; opacity: 0; transform: scale(1.8); } }
        .hc-tos-chip { position: absolute; left: 45%; top: -16px; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 5px; padding: 1px 8px; border: 1px solid ${T.err}; border-radius: 8px; background: ${T.paper}; font-size: 11px; font-weight: 700; color: ${T.err}; white-space: nowrap; animation: et-pop 0.35s ease-out; }
        .hc-tos-chip i.hc-tosuv { width: 11px; height: 11px; border-width: 1.5px; } .hc-tos-chip i.hc-tosuv::after { height: 9px; top: -1px; }
        .hc-hisob-k { display: flex; flex-direction: column; gap: 2px; padding: 10px 14px; border: 1.5px solid ${T.line}; border-radius: 14px; background: ${T.paper}; min-width: 0; }
        .hc-hisob-k.um { border-style: dashed; background: ${T.bg}; }
        .hc-hisob-k.biz { border-color: ${T.accent}; }
        .hc-hisob-n { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .hc-hisob-n code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        .hc-hisob-k b { align-self: flex-start; transform-origin: left center; font-family: 'JetBrains Mono', monospace; font-size: 40px; font-weight: 800; line-height: 1.15; color: ${T.ink2}; animation: et-pop 0.25s ease-out; }
        .hc-hisob-k.biz b { color: ${T.accent}; }
        .hc-hisob-k small { font-size: 11px; color: ${T.ink2}; }
        .hc-kun { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; padding-top: 4px; }
        .hc-kun .hc-tel-sar { align-self: flex-start; }
        .hc-kun-son { margin-top: 36px; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${T.ink2}; }
        .hc-kun-son b { display: inline-block; font-size: 40px; color: ${T.accent}; animation: et-pop 0.2s ease-out; }
        .hc-kun-n { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .lesson-root .q-reja .q-split { grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr); }
        @media (max-width: 860px) { .lesson-root .q-reja .q-split { grid-template-columns: minmax(0, 1fr); } }
        /* 8-ekran: chap karta cho'zilmaydi; vazifa ostida mini-telefon; koddagi uch joy raqamli */
        .lesson-root .q-kod { align-items: start; }
        .lesson-root .q-kod > .q-col > .q-karta { flex-grow: 0; }
        .et-vazifa li { border-radius: 10px; padding: 4px 6px; margin: -4px -6px; cursor: default; transition: background 0.2s; outline: none; }
        .et-vazifa li.on { background: ${T.accentSoft}; }
        .et-mini { display: flex; align-items: center; gap: 16px; padding: 10px 12px; margin-top: 4px; border: 1px solid ${T.line}; border-radius: 14px; background: ${T.bg}; }
        .et-mini .hc-tel-ust { zoom: 0.62; }
        ol.et-yonish { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .et-yonish li { display: grid; grid-template-columns: 22px 1fr; gap: 1px 8px; align-items: center; padding: 6px 10px 6px 6px; border: 1.5px solid ${T.line}; border-radius: 11px; background: ${T.paper}; opacity: 0.6; transition: all 0.35s; }
        .et-yonish li i { grid-row: span 2; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 700; background: ${T.line}; color: ${T.ink2}; transition: all 0.35s; }
        .et-yonish li span { font-size: 12px; color: ${T.ink2}; }
        .et-yonish li code { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .et-yonish li.yon { opacity: 1; border-color: ${T.accent}; animation: et-yon 0.9s ease-out; }
        .et-yonish li.yon i { background: ${T.accent}; color: ${T.paper}; }
        .et-kod-joy .et-kod-raqam { display: inline-grid; place-items: center; width: 18px; height: 18px; margin-right: 6px; border-radius: 50%; background: ${T.accent}; color: ${T.paper}; font-size: 11px; font-weight: 800; text-indent: 0; vertical-align: 1px; }
        .et-kod-joy .et-kod-izoh { color: ${CODE.tag}; font-style: italic; padding: 1px 6px; border-radius: 6px; border: 1px dashed ${fon(T.accent, 0.6)}; transition: background 0.25s; }
        .et-kod-joy.on .et-kod-izoh { background: ${fon(T.accent, 0.28)}; border-style: solid; }
        @media (max-width: 640px) {
          .hc-chizma { grid-template-columns: minmax(0, 1fr); justify-items: center; gap: 0; }
          .hc-ch-yol { width: 100%; margin-top: 4px; flex-direction: row; align-items: center; justify-content: center; gap: 10px; height: 64px; }
          .hc-yol-matn { order: 2; }
          i.hc-yol-chiziq { order: 1; width: 0; height: 52px; border-top: 0; border-left: 2px dashed ${T.line}; }
          i.hc-yol-chiziq::after { right: auto; left: -7px; top: auto; bottom: -2px; border: 6px solid transparent; border-top: 8px solid ${T.line}; border-bottom-width: 0; }
          .hc-um-yol { order: 3; margin: 0 0 0 auto; }
          .hc-um-yol > i { display: none; }
          .hc-ch-ong { width: 100%; margin-top: 0; }
          .hc-kirish { gap: 10px; }
          .hc-hb-k { padding: 8px 10px; }
          .hc-hb-son { font-size: 17px; }
          .hc-s6 { grid-template-columns: minmax(0, 1fr); justify-items: center; gap: 12px; }
          .hc-ikki { gap: 10px; }
          .hc-s6-yol { display: none; }
          .hc-s6-ong { margin-top: 0; width: 100%; }
          .hc-s9 { grid-template-columns: minmax(0, 1fr); }
          .hc-uch { gap: 8px; }
          .hc-uch-k i { display: none; }
          .hc-s11 { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-areas: 'tel tel' 'y1 y2' 'k1 k2'; gap: 6px 10px; justify-items: stretch; }
          .hc-s11-tel { justify-self: center; }
          .hc-s11-yol { height: 54px; justify-content: center; }
          .hc-s11-yol > i.hc-yol-chiziq { flex: none; width: 0; height: 100%; border-top: 0; border-left: 2px dashed ${T.line}; }
          .hc-s11-yol.um > i.hc-yol-chiziq { border-color: ${fon(T.ink2, 0.45)}; } /* faqat chap chiziq ko'rinadi (border-top: 0) */
          .hc-s11-yol > i.hc-yol-chiziq::after { display: none; }
          i.hc-nq { left: 50%; top: 0; margin: 0 0 0 -5.5px; animation-name: et-yur-y; }
          .hc-s11-yol.um i.hc-nq.tos { animation-name: et-yur-y-tos; }
          @keyframes et-yur-y { from { top: 0; opacity: 1; } 90% { opacity: 1; } to { top: calc(100% - 11px); opacity: 0; } }
          @keyframes et-yur-y-tos { from { top: 0; } 55% { top: 45%; opacity: 1; transform: scale(1); } to { top: 45%; opacity: 0; transform: scale(1.8); } }
          .hc-tos-chip { left: auto; right: 0; top: 50%; transform: translateY(-50%); }
          .hc-hisob-k b { font-size: 26px; }
          .et-mini { gap: 10px; padding: 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .et-navbat, .et-navbat-k .q-bashorat, .et-bash .q-chip, .et-yig, .hc-jt tr.kir td, .hc-jt tr.navbat td, .hc-umami-k.miltilla, .hc-xotira.bor, .hc-aylana,
          .hc-holat, .hc-uch-k b, .hc-hisob-k b, .hc-umami b, .hc-tugun.ok, .hc-tugun.err, .hc-band-son, .hc-hb, .hc-hb-son, .hc-nomlar code.yon, .hc-tos-chip, .hc-kun-son b,
          .et-yonish li.yon, .hc-otgan, .hc-yol-matn, .et-flash.yangi .fc-card:not(.flip) .fc-front, .et-fc-ipucha i { animation: none !important; }
          .hc-uchar, i.hc-nq { display: none; }
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
