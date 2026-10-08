import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul · 7-dars «Jonli prototip: qog'ozdan bosiladigan ekrangacha» (m9-07, LMS 11-Modul) — konveyer, skeletdan (src/skelet/NamunaDars.jsx).
// Manba-haqiqat: feedback/F-1005-11modul/07-LivePrototype-v3.md (GATE M) · 07-FILTR.md · tayanch 00-MODUL-TAYANCH.md (1.6, 2, 3, 8, 9.2, 9.12–9.17, 9.62, 9.71, 9.73).
// 20 ekran: s0 QKirish · s1 QReja · s2 s3 QTushuncha (ekranlar, wireframe) · s4 1-savol · s5 QMustaqil (taymer, pm-m9d7-wireframe) · s6 QTushuncha (prototip) ·
//   s7 2-savol · s8 QTushuncha (talab) · s9 3-savol · s10 QTushuncha (tekshirish) · s11 QTushuncha (jonli prototip) · s12 QKod (HtmlCompiler) · s13 4-savol ·
//   s14 final QTartib · a1 a2 amaliyot bloklari (QBlok) · podium · kartochkalar · yakun.
// Bitta vizual — JamoaTelefon (qog'oz · prototip · jonli), bitta manba NAMUNA_OYINLAR + JAMOA_EKRANLAR + PROTOTIP_YOLI.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QQadamlar, QXato, QIzoh, QXulosa, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QKod, QMustaqil, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';
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

const LESSON_META = { lessonId: 'm9-07-v1', lessonTitle: { uz: "Jonli prototip: qog'ozdan bosiladigan ekrangacha", ru: 'Живой прототип: от бумаги до кликабельного экрана' } };
// 20 ekran (MD v3): kirish · reja · tushuncha ×2 · test · mustaqil · tushuncha · test · tushuncha · test · tekshirish · tushuncha · kod · test · final · 2 amaliyot bloki · podium · kartochkalar · yakun
const HW_TOKENS = [
  { t: 'wireframe', l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'prototip', ru: 'прототип' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'talab', ru: 'требование' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: 'Motion', l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's14', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's19', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). s14 — final (picked 0/1 sentinel). `practice: -1` — sentinel (QMustaqil 5, QKod 12, bloklar 15–16 — variant yo'q).
// To'g'ri javob o'rinlari (MD): s4 B · s7 C · s9 A · s13 D — qurilgandan keyin o'zgarmaydi.
const INLINE_KEYS = { s4: 1, s7: 2, s9: 0, s13: 3, s14: 0, practice: -1 };
// 📖 RECAPS — har ballik testga 3 karta (kalit = ekran INDEKSI); S-026: kod qatori bor joyda kod, qolganida raqam
const rcKod = (s) => <code className="jp-rc-kod">{s}</code>;
const rk = (o) => ({ uz: fmtCode(o.uz), ru: fmtCode(o.ru) }); // matn ichidagi `kod` — chip (RecapOverlay xom matnni chiqaradi)
const RECAPS = {
  4: {
    title: { uz: 'Wireframe — joy, rang emas', ru: 'Wireframe — место, а не цвет' },
    cards: [
      { ic: rcKod('1'), h: { uz: "Wireframe — ekranning qog'ozdagi sodda chizmasi: qayerda nima turadi.", ru: 'Wireframe — простой рисунок экрана на бумаге: что где стоит.' }, body: null },
      { ic: rcKod('2'), h: { uz: "Qog'ozga sarlavha, kartalar, tugmaning joyi va ekranlar orasidagi strelka chiziladi.", ru: 'На бумагу рисуют заголовок, карточки, место кнопки и стрелку между экранами.' }, body: null },
      { ic: rcKod('3'), h: { uz: 'Rang, shrift va logotip chizilmaydi — ular keyin tanlanadi.', ru: 'Цвет, шрифт и логотип не рисуют — их выбирают позже.' }, body: null, ask: { uz: "«Qo'shilaman» qayerda turishini qog'ozda qanday ko'rsatasiz?", ru: 'Как на бумаге показать, где стоит «Присоединяюсь»?' } }
    ]
  },
  7: {
    title: { uz: 'Prototip saqlamaydi', ru: 'Прототип не сохраняет' },
    cards: [
      { ic: rcKod('qoshilgan: 8, kerak: 10'), h: { uz: "Ma'lumot namuna fayldan keladi", ru: 'Данные приходят из файла-образца' }, body: null },
      { ic: null, h: { uz: "«Qo'shilaman» dan keyin «9 / 10» faqat ochiq sahifada turadi", ru: 'После «Присоединяюсь» «9 / 10» есть только на открытой странице' }, body: rk({ uz: "`src/namuna.js` o'zgarmaydi", ru: '`src/namuna.js` не меняется' }) },
      { ic: rcKod('prototip/src/namuna.js'), h: { uz: 'Yangilansa, namuna boshidan ochiladi — yana «8 / 10»', ru: 'После обновления образец открывается с начала — снова «8 / 10»' }, body: null, ask: { uz: 'Sahifa yangilanganda «8 / 10» qayerdan keladi?', ru: 'Откуда берётся «8 / 10» после обновления страницы?' } }
    ]
  },
  9: {
    title: { uz: 'Talabning uch qatori', ru: 'Три строки требования' },
    cards: [
      { ic: rcKod('prototip/'), h: { uz: 'Qayerda — papka', ru: 'Где — папка' }, body: null },
      { ic: rcKod('wireframe.jpg'), h: { uz: "Nima qilsin — wireframe suratidagidek uch ekran, namuna ma'lumot bilan, bosiladi", ru: 'Что сделать — три экрана как на снимке wireframe, с данными-образцами, нажимаются' }, body: null },
      { ic: rcKod("backend/ yo'q"), h: { uz: "Nima buzilmasin — haqiqiy ma'lumot va Backend yo'q", ru: 'Что не сломать — нет настоящих данных и Backend' }, body: null, ask: { uz: '«Nima buzilmasin» qatori bo\'lmasa, agent nima qilishi mumkin?', ru: 'Что может сделать агент, если нет строки «что не сломать»?' } }
    ]
  },
  13: {
    title: { uz: 'Son silliq qaytadi', ru: 'Число плавно возвращается' },
    cards: [
      { ic: rcKod('.son.yangi { transform: scale(1.3); }'), h: { uz: 'Son kattalashadi', ru: 'Число увеличивается' }, body: null },
      { ic: rcKod('.son { transition: transform 0.3s; }'), h: { uz: "O'zgarishga vaqt beriladi", ru: 'Изменению даётся время' }, body: null },
      { ic: rcKod('setTimeout(…, 300)'), h: rk({ uz: "`transition` `.son` da — o'sishda ham, qaytishda ham silliq", ru: '`transition` в `.son` — плавно и при росте, и при возврате' }), body: null, ask: rk({ uz: '`transition` faqat `.son.yangi` da tursa, qaytishda nima bo\'ladi?', ru: 'Что будет при возврате, если `transition` стоит только в `.son.yangi`?' }) }
    ]
  },
  14: {
    title: { uz: "Qog'ozdan jonli prototipgacha", ru: 'От бумаги до живого прототипа' },
    cards: [
      { ic: rcKod('1 · 2'), h: { uz: "Qog'ozda ekranlarni chizish · Surat bilan talab yozish", ru: 'Нарисовать экраны на бумаге · Написать требование со снимком' }, body: null },
      { ic: rcKod('3'), h: { uz: "Agent qurgan ekranlarni qog'ozdagi bilan solishtirish", ru: 'Сравнить экраны агента с бумажными' }, body: null },
      { ic: rcKod('4'), h: { uz: "Uch animatsiya qo'shish", ru: 'Добавить три анимации' }, body: null, ask: { uz: 'Nega animatsiya ekranlar tekshirilgandan keyin qo\'shiladi?', ru: 'Почему анимацию добавляют после проверки экранов?' } }
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

// ===== DARSNING O'Z VIZUALI — «Maydon Jamoa» telefoni (MD: bitta vizual, 163/180). Bitta manba: JAMOA_EKRANLAR + NAMUNA_OYINLAR + PROTOTIP_YOLI → JamoaTelefon =====
// Uch holat, bir xil joylashuv: qogoz (qalam chizig'i, rangsiz, qo'lyozma — tizim shrifti) · prototip (namuna ma'lumot, animatsiyasiz) · jonli (uch animatsiya alohida yoqiladi: karta · son · otish).
// Platformada motion paketi yo'q (KOD 4) — ekran o'tishi CSS bilan taqlid qilinadi; matndagi «Motion» — repo'dagi haqiqiy paket. prefers-reduced-motion da maket harakati to'xtaydi (DE-200).
// qolip-maket: jt-karta jt-qoshil jt-orqaga jt-elon jt-yubor jt-yangila jt-b jp-ramka jp-gap jp-kalit jp-doira jp-funk jp-vt
const cxx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => { const v = tr(o); return typeof v === 'string' ? fmtCode(v) : v; };
const kamHarakat = () => typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const useKeyin = () => {
  const r = useRef([]);
  useEffect(() => () => { r.current.forEach(clearTimeout); }, []);
  return useCallback((fn, ms) => { const id = setTimeout(fn, ms); r.current.push(id); return id; }, []);
};
const lsOl = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsQoy = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlov yopiq — dars ishlayveradi */ } };
const DAVOM = { uz: 'Davom etish', ru: 'Продолжить' };

const JAMOA_RANG = '#2E9E4F'; // tayanch 9.62 — «Maydon Jamoa» nomining yashili (PM ok yashilidan farqli)
const JAMOA_NOM = 'Maydon Jamoa';
// Namuna ma'lumot (tayanch 9.2, aynan): 4 o'yin, ikki kun; prototipdagi prototip/src/namuna.js ham shu
const NAMUNA_OYINLAR = [
  { id: '1', kun: { uz: 'Shanba', ru: 'Суббота' }, q: { uz: 'Sh', ru: 'Сб' }, soat: '18:00', maydon: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, mq: { uz: 'Mahalla', ru: 'Махалля' }, qoshilgan: 8, kerak: 10 },
  { id: '2', kun: { uz: 'Shanba', ru: 'Суббота' }, q: { uz: 'Sh', ru: 'Сб' }, soat: '20:00', maydon: { uz: 'Maktab maydoni', ru: 'Школьное поле' }, mq: { uz: 'Maktab', ru: 'Школа' }, qoshilgan: 6, kerak: 10 },
  { id: '3', kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, q: { uz: 'Ya', ru: 'Вс' }, soat: '10:00', maydon: { uz: 'Park maydoni', ru: 'Поле в парке' }, mq: { uz: 'Park', ru: 'Парк' }, qoshilgan: 4, kerak: 8 },
  { id: '4', kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, q: { uz: 'Ya', ru: 'Вс' }, soat: '17:00', maydon: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, mq: { uz: 'Mahalla', ru: 'Махалля' }, qoshilgan: 9, kerak: 10 }
];
// Uch ekran va ulardagi bo'laklar (tayanch 1.6, 9.15). Bo'lak id lari: o- O'yinlar · y- O'yin · e- E'lon berish
const JAMOA_EKRANLAR = {
  oyinlar: { uz: "O'yinlar", ru: 'Игры' },
  oyin: { uz: "O'yin", ru: 'Игра' },
  elon: { uz: "E'lon berish", ru: 'Объявить игру' },
  kirish: { uz: 'Kirish', ru: 'Вход' },
  chat: { uz: 'Chat', ru: 'Чат' },
  forma: [
    { k: 'e-kun', l: { uz: 'Kun', ru: 'День' } },
    { k: 'e-soat', l: { uz: 'Soat', ru: 'Время' } },
    { k: 'e-maydon', l: { uz: 'Maydon', ru: 'Поле' } },
    { k: 'e-nechta', l: { uz: 'Nechta odam', ru: 'Сколько человек' } }
  ],
  qoshil: { uz: "Qo'shilaman", ru: 'Присоединяюсь' },
  qoshildi: { uz: "Qo'shildingiz", ru: 'Вы присоединились' },
  yubor: { uz: 'Yuborish', ru: 'Отправить' },
  siz: { uz: 'Siz', ru: 'Вы' }
};
const KARTA_QISQA = (o) => `${tr(o.q)} ${o.soat} · ${tr(o.mq)}`;
// Prototip yo'li (P-063): 1-ekran qadamlari va 14-ekran finali — bitta manba
const PROTOTIP_YOLI = [
  { id: 'qogoz', t: { uz: "Qog'ozda ekranlarni chizish", ru: 'Нарисовать экраны на бумаге' }, teg: 'wireframe' },
  { id: 'talab', t: { uz: 'Surat bilan talab yozish', ru: 'Написать требование со снимком' }, teg: { uz: 'talab', ru: 'требование' } },
  { id: 'solish', t: { uz: "Agent qurgan ekranlarni qog'ozdagi bilan solishtirish", ru: 'Сравнить экраны агента с бумажными' }, teg: { uz: 'prototip', ru: 'прототип' } },
  { id: 'anim', t: { uz: "Uch animatsiya qo'shish", ru: 'Добавить три анимации' }, teg: 'Motion' }
];

// Bo'lak: f (faqat — ko'rinadigan bo'laklar to'plami) · yoq (prototipda yo'q) · joy (yo'q joyda uzuq chiziqli bo'sh to'rtburchak, U-041) · belgi (qizil/yashil) · onB (bosiladi — 10-ekran)
const bolakYasa = ({ f, yoq, joy, belgi = {}, onB, silk }) => (id, cls, ichi, el = 'span') => {
  if (f && !f.has(id)) return null;
  if (yoq && yoq.has(id)) return joy && joy.has(id) ? <span key={id} className={cxx('jt-joy', cls)} aria-hidden="true" /> : null;
  const k = cxx('jt-b', cls, belgi[id], silk === id && 'jt-silk');
  if (onB) return <button key={id} type="button" className={k} onClick={(e) => { e.stopPropagation(); onB(id); }}>{ichi}</button>;
  const Tag = el;
  return <Tag key={id} className={k}>{ichi}</Tag>;
};
// Doiralar: qo'shilganlar (ismsiz, tayanch 1) — n to'la, qolgani uzuq chiziqli bo'sh joy; «Siz» — qo'shilgandan keyin
const Doiralar = ({ son, kerak, yangi, siz }) => (
  <span className="jt-doiralar" aria-hidden="true">
    {Array.from({ length: kerak }, (_, i) => <i key={i} className={cxx(i < son && 'bor', yangi && i === son - 1 && 'yangi')}>{siz && i === son - 1 && <small>{tr(JAMOA_EKRANLAR.siz)}</small>}</i>)}
  </span>
);

const EkranIchi = ({ ekran, holat, qoshildi, ixcham, b, pop, bos, halqa, onKarta, onQoshil, onOrqaga, onElon, yoqKarta }) => {
  const qogoz = holat === 'qogoz';
  const o = NAMUNA_OYINLAR[0];
  const son = qoshildi ? o.qoshilgan + 1 : o.qoshilgan;
  const H = (k) => (halqa === k ? 'jp-halqa' : undefined);
  const hKarta = H('karta'), hQosh = H('qoshil'), hOrqa = H('orqaga'), hElon = H('elon');
  const kSilk = b.silk === 'o-karta';
  if (ekran === 'oyinlar') return (
    <span className="jt-ichi jt-oyinlar">
      {b('o-sar', 'jt-sar', tr(JAMOA_EKRANLAR.oyinlar), 'b')}
      {(!b.f || b.f.has('o-karta')) && NAMUNA_OYINLAR.map((g, i) => {
        const son = b('o-son', 'jt-k-son', `${g.qoshilgan} / ${g.kerak}`);
        const ichi = ixcham || qogoz
          ? <>{ixcham ? <span className="jt-k-t">{tr(g.q)} {g.soat}</span> : <span className="jt-k-t">{KARTA_QISQA(g)}</span>}{son}</>
          : <span className="jt-k-ikki"><b>{tr(g.kun)}, {g.soat}</b><span className="jt-k-r"><span>{tr(g.maydon)}</span>{son}</span></span>;
        const kls = cxx('jt-karta', bos === g.id && 'bos', i === 0 && hKarta);
        return onKarta && !qogoz
          ? <button key={g.id} type="button" className={kls} onClick={() => onKarta(g.id)} style={{ '--d': (0.05 + i * 0.07) + 's' }}>{ichi}</button>
          : <span key={g.id} className={cxx(kls, yoqKarta && 'jt-yoq', kSilk && 'jt-silk')} style={{ '--d': (0.05 + i * 0.07) + 's' }} onClick={b.onB ? (e) => { e.stopPropagation(); b.onB('o-karta'); } : undefined}>{ichi}</span>;
      })}
      {onElon && !qogoz
        ? <button type="button" className={cxx('jt-elon', hElon)} onClick={onElon}>{tr(JAMOA_EKRANLAR.elon)}</button>
        : b('o-elon', 'jt-elon jt-tugma', tr(JAMOA_EKRANLAR.elon))}
    </span>
  );
  if (ekran === 'oyin') return (
    <span className="jt-ichi jt-oyin">
      {onOrqaga && !qogoz
        ? <button type="button" className={cxx('jt-orqaga', hOrqa)} onClick={onOrqaga}>‹ {tr(JAMOA_EKRANLAR.oyinlar)}</button>
        : b('y-orqa', 'jt-orqaga', <>‹ {tr(JAMOA_EKRANLAR.oyinlar)}</>)}
      {b('y-sar', 'jt-y-sar', <><b>{qogoz ? KARTA_QISQA(o) : <>{tr(o.kun)}, {o.soat}</>}</b>{!qogoz && <span>{tr(o.maydon)}</span>}</>)}
      {b('y-son', 'jt-y-son', <><span className={cxx('jt-son', pop && 'pop')}>{son}</span> / {o.kerak}</>)}
      {b('y-doira', 'jt-y-doira', <Doiralar son={qogoz ? o.qoshilgan : son} kerak={o.kerak} yangi={qoshildi} siz={qoshildi && !ixcham} />)}
      {onQoshil && !qogoz
        ? <button type="button" className={cxx('jt-qoshil', qoshildi && 'off', hQosh)} disabled={qoshildi} onClick={onQoshil}>{tr(qoshildi ? JAMOA_EKRANLAR.qoshildi : JAMOA_EKRANLAR.qoshil)}</button>
        : b('y-qoshil', cxx('jt-qoshil jt-tugma', qoshildi && 'off'), tr(qoshildi ? JAMOA_EKRANLAR.qoshildi : JAMOA_EKRANLAR.qoshil))}
    </span>
  );
  if (ekran === 'elon') return (
    <span className="jt-ichi jt-elon-e">
      {b('e-orqa', 'jt-orqaga', <>‹ {tr(JAMOA_EKRANLAR.oyinlar)}</>)}
      {b('e-sar', 'jt-sar', tr(JAMOA_EKRANLAR.elon), 'b')}
      {JAMOA_EKRANLAR.forma.map(m => b(m.k, 'jt-maydon', tr(m.l)))}
      {b('e-yubor', 'jt-yubor jt-tugma', tr(JAMOA_EKRANLAR.yubor))}
    </span>
  );
  if (ekran === 'kirish') return (
    <span className="jt-ichi jt-elon-e">
      <b className="jt-sar">{tr(JAMOA_EKRANLAR.kirish)}</b>
      <span className="jt-maydon">{tr({ uz: 'Telefon', ru: 'Телефон' })}</span>
      <span className="jt-maydon">{tr({ uz: 'Parol', ru: 'Пароль' })}</span>
      <span className="jt-yubor jt-tugma">{tr(JAMOA_EKRANLAR.kirish)}</span>
    </span>
  );
  if (ekran === 'chat') return (
    <span className="jt-ichi jt-chat">
      <b className="jt-sar">{tr(JAMOA_EKRANLAR.chat)}</b>
      <span className="jt-pufak">{tr({ uz: 'Kim keladi?', ru: 'Кто придёт?' })}</span>
      <span className="jt-pufak siz">{tr({ uz: 'Men', ru: 'Я' })}</span>
      <span className="jt-pufak">{tr({ uz: 'Yana ikki kishi kerak', ru: 'Нужно ещё двое' })}</span>
    </span>
  );
  // agent: bitta uzun ekran — tepada forma, pastda har kartada «Qo'shilaman» (0-ekran)
  return (
    <span className="jt-ichi jt-agent">
      <span className="jt-a-forma">
        {JAMOA_EKRANLAR.forma.map(m => <span key={m.k} className="jt-maydon">{tr(m.l)}</span>)}
        <span className="jt-yubor jt-tugma">{tr(JAMOA_EKRANLAR.yubor)}</span>
      </span>
      {NAMUNA_OYINLAR.map((g, i) => {
        const ichi = <span className="jt-a-k"><span className="jt-a-r"><b>{tr(g.kun)}, {g.soat}</b><span className="jt-k-son">{g.qoshilgan} / {g.kerak}</span></span><span className="jt-a-r"><span className="jt-a-joy">{tr(g.mq)}</span><span className="jt-a-qosh">{tr(JAMOA_EKRANLAR.qoshil)}</span></span></span>;
        return i === 0 && onKarta
          ? <button key={g.id} type="button" className={cxx('jt-karta', bos === g.id && 'bos', hKarta)} onClick={() => onKarta(g.id)}>{ichi}</button>
          : <span key={g.id} className="jt-karta">{ichi}</span>;
      })}
    </span>
  );
};

// Telefon ramkasi (191): o'lchami barqaror (SABOQ 22); ixcham — solishtirish sahnasi va qog'ozdagi ramkalar uchun.
// anim: { karta, son, otish } — jonli holatning uch animatsiyasi. Ekran o'tishi: oldinga — yangi ekran o'ngdan kiradi; orqaga (O'yinlar) — chapdan.
function JamoaTelefon({ holat = 'prototip', ekran = 'oyinlar', qoshildi = false, anim = {}, halqa, onKarta, onQoshil, onOrqaga, onElon, f, yoq, joy, belgi, onB, silk, ixcham, bar = true, yorliq, ustBar, oqar, bosDoim, bosTash, yoqKarta, className, children }) {
  const keyin = useKeyin();
  const kam = kamHarakat();
  const [bos, setBos] = useState(null);
  const [pop, setPop] = useState(false);
  const [chiq, setChiq] = useState(null);
  const oldin = useRef(ekran);
  const oldinQosh = useRef(qoshildi);
  useLayoutEffect(() => {
    if (oldin.current !== ekran) {
      if (anim.otish && !kam) { const c = { e: oldin.current, orqa: ekran === 'oyinlar', k: Date.now() }; setChiq(c); keyin(() => setChiq(x => (x && x.k === c.k ? null : x)), 320); }
      oldin.current = ekran;
    }
  }, [ekran]); // eslint-disable-line
  useEffect(() => {
    if (qoshildi && !oldinQosh.current && anim.son && !kam) { setPop(true); keyin(() => setPop(false), 300); }
    oldinQosh.current = qoshildi;
  }, [qoshildi]); // eslint-disable-line
  const kartaBos = onKarta && ((id) => {
    if ((anim.karta || bosDoim) && !kam) { setBos(id); keyin(() => setBos(null), 150); keyin(() => onKarta(id), anim.karta ? 170 : 160); }
    else onKarta(id);
  });
  const b = bolakYasa({ f, yoq, joy, belgi, onB, silk });
  b.f = f; b.onB = onB; b.silk = silk;
  const p = { holat, qoshildi, ixcham, b, pop, bos: bosTash || bos, halqa, onKarta: kartaBos, onQoshil, onOrqaga, onElon, yoqKarta };
  const yangiKirish = chiq ? (chiq.orqa ? 'kir-chap' : 'kir-ong') : '';
  const uzun = ekran === 'agent';
  return (
    <div className={cxx('jt-ust', className)}>
      {yorliq}
      {ustBar}
      <div className={cxx('jt-tel', holat, ixcham && 'ixcham', anim.karta && 'a-karta', anim.son && 'a-son', uzun && 'uzun')}>
        {bar && holat !== 'qogoz' && <span className="jt-bar"><b className="jt-nom" style={{ color: JAMOA_RANG }}>{JAMOA_NOM}</b></span>}
        <div className="jt-ekranlar">
          {chiq && <div key={'c' + chiq.k} className={cxx('jt-ekran chiq', chiq.orqa ? 'chiq-ong' : 'chiq-chap')} aria-hidden="true"><EkranIchi ekran={chiq.e} {...p} onKarta={undefined} onQoshil={undefined} onOrqaga={undefined} onElon={undefined} /></div>}
          <div key={ekran} className={cxx('jt-ekran', yangiKirish)}><EkranIchi ekran={ekran} {...p} /></div>
        </div>
        {oqar && <span className="jt-oqar" aria-hidden="true" />}
      </div>
      {children}
    </div>
  );
}
// Qog'oz varag'i — qalam chizmalari foni (oq qog'oz, yengil katak)
const Qogoz = ({ className, children }) => <div className={cxx('jp-qogoz', className)}>{children}</div>;
// Uchish (SABOQ 19): bo'lak manbadan nishonga uchadi; joylar DOM dan o'lchanadi (--lz zoom hisobga olinadi)
const useUchish = () => {
  const box = useRef(null);
  const keyin = useKeyin();
  const [uch, setUch] = useState([]);
  const uchir = useCallback((dan, ga, t) => {
    const bx = box.current; if (kamHarakat() || !bx || !dan || !ga) return;
    const br = bx.getBoundingClientRect(); const z = bx.offsetWidth ? br.width / bx.offsetWidth : 1;
    const n = (el) => { const r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - br.left) / z, y: (r.top + r.height / 2 - br.top) / z }; };
    const a = n(dan), c = n(ga);
    const u = { k: Math.random().toString(36).slice(2), t, a, dx: c.x - a.x, dy: c.y - a.y };
    setUch(x => [...x, u]);
    keyin(() => setUch(x => x.filter(y => y.k !== u.k)), 720);
  }, [keyin]);
  const Uchar = () => <>{uch.map(u => <span key={u.k} className="jp-uchar" aria-hidden="true" style={{ left: u.a.x + 'px', top: u.a.y + 'px', '--dx': u.dx + 'px', '--dy': u.dy + 'px' }}>{u.t}</span>)}</>;
  return { box, uchir, Uchar };
};
// O'qituvchi eslatmasi — faqat mentor ko'rinishida (MD aytgan joylarda: 1, 5, 11-ekran)
const MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const [ochiq, setOchiq] = useState(false);
  if (!(gate.live && gate.live.mode === 'mentor')) return null;
  return ochiq
    ? <div className="jp-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="jp-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="jp-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
};
// Bashorat (SABOQ 11/19/32): karta yengil halqada, tanlangach ixcham qator «Taxminingiz · savol · tanlov» natijagacha turadi
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (!tanlov
  ? <div className="jp-bashorat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <p className="jp-taxmin-ix fade-step"><span>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span>{savol} · <b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></p>);

// Ochilgan yordam/izoh 1280×800 da panel ostida qolmasin — bir marta ko'rinadigan joyga suriladi (F-1007-289)
const Korinsin = ({ className, children }) => {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => { const el = ref.current; if (el && el.scrollIntoView) el.scrollIntoView({ behavior: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' }); }, 120); return () => clearTimeout(t); }, []);
  return <div ref={ref} className={className}>{children}</div>;
};
// ===== SCREEN 0 — KIRISH (QKirish): agent qurgan bitta uzun ekran — Shanba 18:00 kartasi bosiladi, hech narsa ochilmaydi. Ballsiz (J-026: correct false hammaga) =====
const HOOK_OPTS = [
  { id: 'a', t: { uz: 'Agent kodni hali oxirigacha yozmagan', ru: 'Агент ещё не дописал код' } },
  { id: 'b', t: { uz: "O'yin ekranini hech kim chizmagan", ru: 'Экран «Игра» никто не нарисовал' } },
  { id: 'c', t: { uz: 'Telefon bosilganini sezmay qoldi', ru: 'Телефон не заметил нажатия' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Bu misolda PRD da nima qilinishi yozilgan, ekranlar esa chizilmagan — ekranlar tuzilishini agent o'zi tanladi.</>, ru: <><b>Именно!</b> В этом примере в PRD написано, что делать, а экраны не нарисованы — устройство экранов агент выбрал сам.</> },
  a: { uz: <><b>Qiziq fikr!</b> Agent «Tayyor!» dedi va kod ishlayapti — lekin O'yin ekrani umuman yo'q.</>, ru: <><b>Интересная мысль!</b> Агент сказал «Готово!», и код работает — но экрана «Игра» нет вообще.</> },
  c: { uz: <><b>Qiziq fikr!</b> Bosish ishladi — lekin kartaga hech qanday ekran ulanmagan.</>, ru: <><b>Интересная мысль!</b> Нажатие сработало — но к карточке не подключён ни один экран.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [bosildi, setBosildi] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const pick = (v) => { if (picked !== null || !bosildi) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={DAVOM} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>O'yin kartasini bosdingiz — <span className="italic" style={{ color: T.accent }}>nega hech narsa ochilmadi?</span></>, ru: <>Вы нажали на карточку игры — <span className="italic" style={{ color: T.accent }}>почему ничего не открылось?</span></> })}
        mentor={<Mentor>{tr({ uz: "PRD dagi birinchi funksiyani agentga bitta gapda berdik — agent qurgan ekranda Shanba 18:00 dagi o'yin kartasini bosing.", ru: 'Мы дали агенту первую функцию из PRD одной фразой — на экране, который он собрал, нажмите на карточку игры в субботу в 18:00.' })}</Mentor>}
        maket={<div className="jp-kirish">
          <JamoaTelefon holat="prototip" ekran="agent" bosDoim halqa={bosildi ? undefined : 'karta'} onKarta={() => { setBosildi(true); setSc(n => n + 1); }} />
          <div className="jp-chat">
            <p className="jp-pf siz fade-up">{tr({ uz: "PRD dagi o'yin e'loni va qo'shilish funksiyasini ilova qilib ber.", ru: 'Сделай приложение из функции объявления игры и присоединения из PRD.' })}</p>
            <p className="jp-pf ag fade-up" style={{ animationDelay: '0.2s' }}><span className="jp-pf-kim">Antigravity</span>{tr({ uz: 'Tayyor! Ilova ochiladi.', ru: 'Готово! Приложение открывается.' })}</p>
            {bosildi && <p className="jp-kul fade-step">{tr({ uz: "O'yin ekrani yo'q — kim qo'shilgani ko'rinmaydi", ru: 'Экрана «Игра» нет — не видно, кто присоединился' })}</p>}
            {picked !== null && <p className="jp-kul fade-step">{tr({ uz: 'PRD: nima qilinadi ✓ · ekranlar: chizilmagan', ru: 'PRD: что делается ✓ · экраны: не нарисованы' })}</p>}
          </div>
        </div>}
        variantlar={(picked === null ? HOOK_OPTS : HOOK_OPTS.filter(o => o.id === picked)).map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={!bosildi}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Dars oxirida» — telefon bir marta o'zi o'ynaydi: qog'oz → prototip → «Qo'shilaman» → 8 → 9 (jonli) (DE-200) =====
const RejaTelefon = () => {
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [k, setK] = useState(kam ? 3 : 0);
  useEffect(() => { if (kam) return; keyin(() => setK(1), 1500); keyin(() => setK(2), 2900); keyin(() => setK(3), 3500); }, []); // eslint-disable-line
  return (
    <Qogoz className={cxx('jp-reja-q', k > 0 && 'toza')}>
      <JamoaTelefon holat={k === 0 ? 'qogoz' : k === 1 ? 'prototip' : 'jonli'} ekran="oyin" qoshildi={k >= 3} anim={{ son: true }} halqa={k === 2 ? 'qoshil' : undefined} onQoshil={() => {}} />
    </Qogoz>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz', ru: 'Начинаем' }} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun qog'ozdan <span className="italic" style={{ color: T.accent }}>bosiladigan ekrangacha</span> borasiz.</>, ru: <>Сегодня вы пройдёте путь от бумаги <span className="italic" style={{ color: T.accent }}>до кликабельного экрана</span>.</> })}
      mentor={<Mentor>{tr({ uz: "Avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingiz uchun o'z repo'ngizda qilasiz.", ru: 'Сначала посмотрите на примере Maydon Jamoa, потом сделаете для своего продукта в своём репо.' })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
      chap={<RejaTelefon />}
      qadamlar={PROTOTIP_YOLI.map(p => ({ t: tr(p.t), teg: tr(p.teg) }))}>
      <p className="jp-reja-past fade-up">{tr({ uz: "o'z repo'ngiz — bugun ochasiz", ru: 'свой репо — откроете сегодня' })} · {tr({ uz: 'Mentor misoli', ru: 'пример Ментора' })} <code>maydon-jamoa</code> · {tr({ uz: 'tayyor holat', ru: 'готовое состояние' })} <code>m11-dars-07-done</code></p>
      <MentorNote>{tr({ uz: 'Telefon ko\'rinishi — prototipni kichik ekranda tekshirish uchun; final platforma hali tanlanmagan. 5-ekranga (qog\'ozda chizish) 15 daqiqa taymer bor — vaqtdan oshirmang; A2 ulgurmasa, uyga vazifaning 1-bandi o\'sha.', ru: 'Вид телефона — чтобы проверить прототип на маленьком экране; итоговая платформа ещё не выбрана. На 5-м экране (рисуем на бумаге) таймер 15 минут — не выходите за время; если A2 не успели, это 1-й пункт домашнего задания.' })}</MentorNote>
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — TUSHUNCHA (QTushuncha): funksiya gaplari → uch ramka. Avval gap tanlanadi, so'ng ramka bosiladi (§16); to'g'risida gap uchib kirib qalam bo'lagiga aylanadi =====
const S2_GAPLAR = [
  { k: 1, ekran: 'elon', f: ['e-kun', 'e-soat', 'e-maydon', 'e-nechta', 'e-yubor'], t: { uz: 'Tashkilotchi kun, soat, maydon va nechta odamni yozadi', ru: 'Организатор пишет день, время, поле и сколько нужно людей' } },
  { k: 2, ekran: 'oyinlar', f: ['o-karta', 'o-son'], t: { uz: "O'yinchi kun bo'yicha o'yinlarni ko'radi", ru: 'Игрок смотрит игры по дням' } },
  { k: 3, ekran: 'oyin', f: ['y-doira'], t: { uz: "O'yinchi bitta o'yinni ochib, kim qo'shilganini ko'radi", ru: 'Игрок открывает одну игру и видит, кто присоединился' } },
  { k: 4, ekran: 'oyin', f: ['y-qoshil', 'y-son'], t: { uz: "O'yinchi «Qo'shilaman» ni bosadi va «8 / 10» o'zgaradi", ru: 'Игрок нажимает «Присоединяюсь», и «8 / 10» меняется' } }
];
const S2_RAMKA = ['oyinlar', 'oyin', 'elon'];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, uchir, Uchar } = useUchish();
  const keyin = useKeyin();
  const [tanlov, setTanlov] = useState(null);
  const [joy, setJoy] = useState(() => new Set(avval ? [1, 2, 3, 4] : []));
  const [silk, setSilk] = useState(null);
  const [xato, setXato] = useState(false);
  const done = joy.size >= 4;
  const tugadi = useTugadi(done, 1500, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const ramka = (e, el) => {
    if (tanlov === null || done) return;
    const g = S2_GAPLAR.find(x => x.k === tanlov);
    if (g.ekran !== e) { setSilk(e); setXato(true); keyin(() => setSilk(null), 420); return; }
    uchir(box.current && box.current.querySelector(`.jp-gap[data-k="${g.k}"]`), el, tr(g.t));
    setXato(false); setTanlov(null);
    keyin(() => setJoy(s => new Set([...s, g.k])), 380);
  };
  const qism = (e) => new Set(S2_GAPLAR.filter(g => joy.has(g.k) && g.ekran === e).flatMap(g => g.f).concat(done && e === 'oyinlar' ? ['o-elon'] : []));
  const qolgan = S2_GAPLAR.filter(g => !joy.has(g.k));
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ekranlar', ru: 'Понятие · экраны' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? DAVOM : { uz: `Gaplarni joylang (${joy.size}/4)`, ru: `Разложите фразы (${joy.size}/4)` }} onClick={onNext} /></>}>
      <div ref={box} className="jp-box">
        <QTushuncha zoom={Zoomable} tugadi={tugadi}
          sarlavha={tr({ uz: <>Bitta funksiya <span className="italic" style={{ color: T.accent }}>qaysi ekranlarga</span> bo'linadi?</>, ru: <>На какие <span className="italic" style={{ color: T.accent }}>экраны</span> делится одна функция?</> })}
          mentor={<Mentor>{tr({ uz: "Roadmap'dagi birinchi funksiya — o'yin e'loni va qo'shilish: avval gapni tanlang, so'ng mos ekranni bosing.", ru: 'Первая функция из roadmap — объявление игры и присоединение: сначала выберите фразу, потом нажмите подходящий экран.' })}</Mentor>}
          harakat={<div className="q-karta jp-funk-k">
            <b className="jp-funk-n">{tr({ uz: "O'yin e'loni va qo'shilish", ru: 'Объявление игры и присоединение' })}</b>
            <div className={cxx('jp-gaplar', tanlov === null && qolgan.length > 0 && 'jp-guruh')}>
              {S2_GAPLAR.map(g => joy.has(g.k)
                ? <span key={g.k} className="jp-gap-ok">✓ {tr(g.t)}</span>
                : <button key={g.k} type="button" data-k={g.k} className={cxx('jp-gap', tanlov === g.k && 'on')} onClick={() => { setTanlov(g.k); setXato(false); }}>{tr(g.t)}</button>)}
            </div>
            {xato && <QXato>{tr({ uz: 'Bu ish boshqa ekranda bajariladi.', ru: 'Это делается на другом экране.' })}</QXato>}
          </div>}
          vizual={<Qogoz className="jp-s2">
            <span className="jp-hisob">{tr({ uz: 'Joylandi', ru: 'Разложено' })}: <b>{joy.size} / 4</b></span>
            <div className="jp-ramkalar">
              {S2_RAMKA.map((e, i) => (
                <div key={e} className="jp-ramka-w">
                  <span className="jp-ramka-n">{tr(JAMOA_EKRANLAR[e])}</span>
                  <button type="button" className={cxx('jp-ramka', tanlov !== null && 'tanla', silk === e && 'jt-silk')} onClick={(ev) => ramka(e, ev.currentTarget)} disabled={done} aria-label={tr(JAMOA_EKRANLAR[e])}>
                    <JamoaTelefon holat="qogoz" ixcham ekran={e} f={qism(e)} />
                  </button>
                </div>
              ))}
              {done && <span className="jp-strelka-o" aria-hidden="true" />}
              {done && <span className="jp-strelka-ost" aria-hidden="true" />}
            </div>
          </Qogoz>}
          xulosa={done && tr({ uz: "Bu misolda funksiya gaplari O'yinlar, O'yin va E'lon berish ekranlariga bo'lindi.", ru: 'В этом примере фразы функции разошлись по экранам «Игры», «Игра» и «Объявить игру».' })}
        />
        <Uchar />
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — TUSHUNCHA (saralash): olti bo'lak bittadan (SABOQ 13) — «Qog'ozga» yoki «Chizilmaydi»; qog'ozda bo'lak qalam bilan chiziladi =====
const S3_BOLAK = [
  { k: 'sar', f: ['o-sar'], qogoz: true, t: { uz: '«O\'yinlar» sarlavhasi', ru: 'Заголовок «Игры»' } },
  { k: 'karta', f: ['o-karta', 'o-son'], qogoz: true, t: { uz: "O'yin kartasi: kun, soat, maydon, «8 / 10»", ru: 'Карточка игры: день, время, поле, «8 / 10»' } },
  { k: 'tugma', f: ['o-elon'], qogoz: true, t: { uz: "«E'lon berish» tugmasining joyi", ru: 'Место кнопки «Объявить игру»' } },
  { k: 'strelka', f: [], qogoz: true, t: { uz: "Kartadan O'yin ekraniga strelka", ru: 'Стрелка от карточки к экрану «Игра»' } },
  { k: 'rang', f: [], qogoz: false, t: { uz: 'Tugmaning yashil rangi', ru: 'Зелёный цвет кнопки' } },
  { k: 'shrift', f: [], qogoz: false, t: { uz: 'Sarlavhaning shrifti', ru: 'Шрифт заголовка' } }
];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const keyin = useKeyin();
  const [n, setN] = useState(avval ? 6 : 0);
  const [silk, setSilk] = useState(null);
  const [xato, setXato] = useState(null);
  const done = n >= 6;
  const tugadi = useTugadi(done, 1500, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const joriy = S3_BOLAK[n];
  const tanla = (qogozga) => {
    if (!joriy) return;
    if (joriy.qogoz !== qogozga) { setSilk(qogozga ? 'q' : 'c'); keyin(() => setSilk(null), 420); setXato(joriy.qogoz ? 'yoq' : 'rang'); return; }
    setXato(null); setN(x => x + 1);
  };
  const qilingan = S3_BOLAK.slice(0, n);
  const f = new Set(qilingan.filter(b => b.qogoz).flatMap(b => b.f));
  const strelka = qilingan.some(b => b.k === 'strelka');
  const tashqari = qilingan.filter(b => !b.qogoz);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · wireframe', ru: 'Понятие · wireframe' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? DAVOM : { uz: `Bo'laklarni saralang (${n}/6)`, ru: `Рассортируйте части (${n}/6)` }} onClick={onNext} /></>}>
      {/* Bo'sh ustun bo'lmasin (SABOQ 20): bitta bo'lak-karta tepada qator bo'lib, qog'oz butun enga */}
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>O'yinlar ekrani <span className="italic" style={{ color: T.accent }}>qog'ozda</span> qanday chiziladi?</>, ru: <>Как экран «Игры» <span className="italic" style={{ color: T.accent }}>рисуется на бумаге</span>?</> })}
        mentor={<Mentor>{tr({ uz: 'Har bo\'lak uchun tanlang: «Qog\'ozga» yoki «Chizilmaydi».', ru: 'Для каждой части выберите: «На бумагу» или «Не рисуется».' })}</Mentor>}
        harakat={joriy && <div key={joriy.k} className="q-karta jp-bolak-k fade-up">
          <span className="jp-bolak-n">{n + 1} / 6</span>
          <b className="jp-bolak-t">{tr(joriy.t)}</b>
          <div className="q-variantlar jp-guruh">
            <QChip silk={silk === 'q'} onClick={() => tanla(true)}>{tr({ uz: "Qog'ozga", ru: 'На бумагу' })}</QChip>
            <QChip silk={silk === 'c'} onClick={() => tanla(false)}>{tr({ uz: 'Chizilmaydi', ru: 'Не рисуется' })}</QChip>
          </div>
          {xato && <QXato>{xato === 'yoq' ? tr({ uz: 'Busiz ekranda qayerda nima turishi noma\'lum qoladi.', ru: 'Без этого неясно, что где стоит на экране.' }) : tr({ uz: 'Qog\'ozdagi chizma rangsiz — bu keyin tanlanadi.', ru: 'Рисунок на бумаге без цвета — это выбирают позже.' })}</QXato>}
        </div>}
        vizual={<Qogoz className="jp-s3">
          <span className="jp-hisob">{tr({ uz: 'Saralandi', ru: 'Рассортировано' })}: <b>{n} / 6</b></span>
          <div className="jp-s3-q">
            <JamoaTelefon holat="qogoz" ekran="oyinlar" f={f} />
            <span className="jp-strelka-t">{strelka && <span className="jp-chiz">→ {tr(JAMOA_EKRANLAR.oyin)}</span>}</span>
          </div>
          <div className="jp-tashqari"><span className="jp-tashqari-l">{tr({ uz: 'Chizilmaydi', ru: 'Не рисуется' })}</span>{tashqari.map(b => <span key={b.k} className="jp-tushdi">{tr(b.t)}</span>)}</div>
        </Qogoz>}
        natija={done && <p className="jp-nom fade-step">{tr({ uz: <>Ekranning qog'ozdagi bunday sodda chizmasi <b>wireframe</b> deyiladi: qayerda nima turadi.</>, ru: <>Такой простой рисунок экрана на бумаге называется <b>wireframe</b>: что где стоит.</> })}</p>}
        xulosa={done && tr({ uz: 'Bugungi wireframe joyni va o\'tishni ko\'rsatadi: kartalar, tugmalar, strelkalar; rang va shrift tanlanmaydi.', ru: 'Сегодняшний wireframe показывает место и переходы: карточки, кнопки, стрелки; цвет и шрифт не выбираются.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 (QuestionScreen → QTest; INLINE_KEYS.s4 = 1, B). Savol ustida yorliq yo'q (SABOQ 6) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Wireframe chizyapsiz. Unga nima kiradi?"
    question={tr({ uz: <h2 className="title h-ask">Wireframe chizyapsiz. <span className="italic" style={{ color: T.accent }}>Unga nima kiradi?</span></h2>, ru: <h2 className="title h-ask">Вы рисуете wireframe. <span className="italic" style={{ color: T.accent }}>Что в него входит?</span></h2> })}
    options={[
      { uz: "«Qo'shilaman» tugmasining rangi", ru: 'Цвет кнопки «Присоединяюсь»' },
      { uz: "«Qo'shilaman» tugmasining joyi", ru: 'Место кнопки «Присоединяюсь»' },
      { uz: "«O'yinlar» sarlavhasining shrifti", ru: 'Шрифт заголовка «Игры»' },
      { uz: '«Maydon Jamoa» logotipining shakli', ru: 'Форма логотипа «Maydon Jamoa»' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Wireframe qayerda nima turishini ko\'rsatadi — rang va shrift keyin tanlanadi.', ru: 'Wireframe показывает, что где стоит, — цвет и шрифт выбирают позже.' }}
    explainWrong={{
      0: { uz: 'Bugungi wireframe\'da rang tanlanmaydi — faqat joy.', ru: 'В сегодняшнем wireframe цвет не выбирают — только место.' },
      2: { uz: "Shrift — ko'rinish; wireframe uni ko'rsatmaydi.", ru: 'Шрифт — это вид; wireframe его не показывает.' },
      3: { uz: 'Logotip chizilmaydi: wireframe sodda shakllardan iborat.', ru: 'Логотип не рисуют: wireframe состоит из простых фигур.' },
      default: { uz: 'Wireframe qayerda nima turishini ko\'rsatadi.', ru: 'Wireframe показывает, что где стоит.' }
    }} />
);

// ===== SCREEN 5 — MUSTAQIL ISH (QMustaqil, 15 daqiqa taymer): o'z mahsulotingiz ekranlari qog'ozda → pm-m9d7-wireframe (tayanch 8, 9.13) =====
const WF_KALIT = 'pm-m9d7-wireframe';
const PRD_KALIT = 'pm-m9d5-prd';
const prdFunksiyalar = () => { const v = lsOl(PRD_KALIT); return v && Array.isArray(v.funksiyalar) ? v.funksiyalar.map(x => String(x || '').trim()).filter(Boolean).slice(0, 3) : []; };
const wfOqi = () => { const v = lsOl(WF_KALIT); return v && Array.isArray(v.ekranlar) ? v : null; };
const BOSH_EKRAN = () => ({ nom: '', nima: '', tugma: '' });
const useTaymer = (sekund) => {
  const [qoldi, setQoldi] = useState(sekund);
  const [yur, setYur] = useState(false);
  useEffect(() => {
    if (!yur) return undefined;
    const id = setInterval(() => setQoldi(q => { if (q <= 1) { setYur(false); return 0; } return q - 1; }), 1000);
    return () => clearInterval(id);
  }, [yur]);
  const mmss = `${String(Math.floor(qoldi / 60)).padStart(2, '0')}:${String(qoldi % 60).padStart(2, '0')}`;
  return { qoldi, yur, mmss, boshla: () => { setQoldi(sekund); setYur(true); } };
};
const WF_MAYDON = [
  { k: 'nom', l: { uz: 'Ekran nomi', ru: 'Название экрана' }, n: { uz: "masalan: O'yinlar", ru: 'например: Игры' } },
  { k: 'nima', l: { uz: 'Unda nima turadi', ru: 'Что на нём' }, n: { uz: "masalan: o'yinlar ro'yxati, har kartada soat", ru: 'например: список игр, в каждой карточке время' } },
  { k: 'tugma', l: { uz: 'Asosiy tugma va u qaysi ekranni ochadi', ru: 'Главная кнопка и какой экран она открывает' }, n: { uz: "masalan: karta → O'yin", ru: 'например: карточка → Игра' } }
];
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const saqlangan = useMemo(() => wfOqi(), []);
  const prd = useMemo(() => prdFunksiyalar(), []);
  const [fIdx, setFIdx] = useState(() => { const i = saqlangan ? prd.indexOf(saqlangan.funksiya) : 0; return i >= 0 ? i : 0; });
  const [fMatn, setFMatn] = useState(() => (saqlangan && !prd.length ? saqlangan.funksiya || '' : ''));
  const [ekranlar, setEkranlar] = useState(() => { const e = (saqlangan && saqlangan.ekranlar) || []; return [0, 1, 2].map(i => ({ ...BOSH_EKRAN(), ...(e[i] || {}) })); });
  const [joriy, setJoriy] = useState(0);
  const [yordam, setYordam] = useState(false);
  const [xabar, setXabar] = useState(false);
  const [saqlandi, setSaqlandi] = useState(!!storedAnswer);
  const taymer = useTaymer(15 * 60);
  const yaroqli = ekranlar.filter(e => e.nom.trim() && e.tugma.trim());
  const yoz = (k, v) => { setXabar(false); setEkranlar(a => a.map((e, i) => (i === joriy ? { ...e, [k]: v } : e))); };
  const saqla = () => {
    if (yaroqli.length < 2) { setXabar(true); return; }
    const funksiya = prd.length ? prd[fIdx] : fMatn.trim();
    lsQoy(WF_KALIT, { funksiya, ekranlar: ekranlar.filter(e => e.nom.trim()).map(e => ({ nom: e.nom.trim(), nima: e.nima.trim(), tugma: e.tugma.trim() })) });
    setSaqlandi(true);
    if (!storedAnswer) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'Mustaqil ish · qog\'ozda', solved: true, correct: true, picked: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const e = ekranlar[joriy];
  const nomli = ekranlar.filter(x => x.nom.trim()).length;
  return (
    <Stage eyebrow={tr({ uz: "Mustaqil ish · qog'ozda", ru: 'Самостоятельная работа · на бумаге' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!saqlandi} label={saqlandi ? DAVOM : { uz: 'Saqlang', ru: 'Сохраните' }} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Mahsulotingiz ekranlarini <span className="italic" style={{ color: T.accent }}>qog'ozga chizing</span></>, ru: <>Нарисуйте экраны своего продукта <span className="italic" style={{ color: T.accent }}>на бумаге</span></> })}
        mentor={<Mentor>{tr({ uz: "Ekranni Figma kabi dasturda ham chizish mumkin, bugun esa qog'oz va qalam yetadi — shu chizmadan prototip quramiz. Har ekranni chizgach, uni shu yerga yozing.", ru: 'Экран можно нарисовать и в программе вроде Figma, а сегодня хватит бумаги и карандаша — по этому рисунку соберём прототип. Нарисовав экран, запишите его сюда.' })}</Mentor>}
        qadamlar={!saqlandi && <div className="jp-wf-ust">
          <div className="jp-wf-funk">
            <span className="q-yorliq">{tr({ uz: 'Qaysi funksiya ekranlarini chizasiz?', ru: 'Экраны какой функции вы рисуете?' })}</span>
            {prd.length
              ? <div className="q-variantlar">{prd.map((p, i) => <QChip key={i} holat={fIdx === i ? 'on' : undefined} onClick={() => setFIdx(i)}>{p}</QChip>)}</div>
              : <label className="jp-wf-m"><span>{tr({ uz: 'Birinchi funksiyangizni bir gapda yozing', ru: 'Опишите свою первую функцию одной фразой' })}</span><input value={fMatn} onChange={ev => setFMatn(ev.target.value)} placeholder={tr({ uz: "masalan: o'yin e'loni va qo'shilish", ru: 'например: объявление игры и присоединение' })} /></label>}
          </div>
          <div className="jp-taymer">
            <b className={cxx('jp-taymer-s', taymer.qoldi === 0 && 'tugadi')}>{taymer.mmss}</b>
            {taymer.qoldi === 0
              ? <span className="jp-taymer-l">{tr({ uz: 'Vaqt tugadi — chizganingizni yozing', ru: 'Время вышло — запишите, что нарисовали' })}</span>
              : <QTugma ikkinchi className={!taymer.yur && yaroqli.length < 2 ? 'jp-halqa' : undefined} disabled={taymer.yur} onClick={taymer.boshla}>{tr({ uz: 'Taymerni boshlash', ru: 'Запустить таймер' })}</QTugma>}
          </div>
        </div>}
        forma={saqlandi
          ? <div className="jp-wf-yigma fade-step">
            <div className="jp-wf-qator"><b>{tr({ uz: 'Ekranlar', ru: 'Экраны' })}</b><span>·</span><b>{nomli}</b><span>·</span><span className="jp-ok">✓</span>
              <span className="jp-wf-nomlar">{ekranlar.filter(x => x.nom.trim()).map(x => x.nom.trim()).join(' → ')}</span></div>
            <QXulosa>{tr({ uz: "Wireframe'ingiz tayyor. Uni telefoningiz bilan suratga oling — amaliyotda kerak bo'ladi.", ru: 'Ваш wireframe готов. Сфотографируйте его телефоном — понадобится на практике.' })}</QXulosa>
          </div>
          : <div className="jp-wf">
            <div className="jp-wf-chap">
              <div className="jp-doiralar-q">
                {[0, 1, 2].map(i => <span key={i} className="jp-doira-w"><button type="button" className={cxx('jp-doira', joriy === i && 'on', ekranlar[i].nom.trim() && ekranlar[i].tugma.trim() && 'ok')} onClick={() => setJoriy(i)}>{i + 1}</button>{i === 2 && <small>{tr({ uz: "kerak bo'lsa", ru: 'если нужно' })}</small>}</span>)}
              </div>
              {WF_MAYDON.map(m => (
                <label key={m.k + joriy} className="jp-wf-m">
                  <span>{tr(m.l)}</span>
                  <input value={e[m.k]} onChange={ev => yoz(m.k, ev.target.value)} placeholder={tr(m.n)} />
                </label>
              ))}
              {xabar && <QXato>{tr({ uz: 'Kamida ikki ekranning nomi va tugmasini yozing.', ru: 'Запишите название и кнопку хотя бы двух экранов.' })}</QXato>}
              <div className="jp-wf-amal">
                <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
                <QTugma className={yaroqli.length >= 2 ? 'jp-halqa' : undefined} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
              </div>
              {yordam && <Korinsin><QIzoh>{tr({ uz: 'Qaysi ekranlar kerakligini bilmasangiz, funksiyangiz gaplarini oling: kim nima qiladi va bu qaysi ekranda bo\'ladi?', ru: 'Если не знаете, какие экраны нужны, возьмите фразы своей функции: кто что делает и на каком экране это будет?' })}</QIzoh></Korinsin>}
            </div>
            <Qogoz className="jp-wf-q">
              {ekranlar.map((x, i) => (
                <div key={i} className={cxx('jp-wf-r', joriy === i && 'on', !x.nom.trim() && 'bosh')}>
                  <span className="jp-wf-rn">{x.nom.trim() || (i + 1)}</span>
                  {x.nima.trim() && <span className="jp-wf-ri">{x.nima.trim()}</span>}
                  {x.tugma.trim() && <span className="jp-wf-rt">{x.tugma.trim()}</span>}
                  {i < 2 && x.tugma.trim() && <span className="jp-strelka wf" aria-hidden="true">→</span>}
                </div>
              ))}
            </Qogoz>
          </div>}
      />
      <MentorNote>{tr({ uz: "Chizishga 15 daqiqa; qog'oz va qalam darsdan oldin tayyor tursin. Surat tiniq bo'lsin — yozuvlar o'qilsin.", ru: 'На рисование 15 минут; бумага и карандаш должны быть готовы до урока. Снимок чёткий — надписи читаются.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 6 — TUSHUNCHA (bashorat + harakat): «Qo'shilaman» → 9 / 10; «Yangilash» → namuna boshidan, yana 8 / 10. Ma'lumot namuna.js da =====
const S6_TAXMIN = [{ k: '8', t: '«8 / 10»' }, { k: '9', t: '«9 / 10»' }];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const keyin = useKeyin();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qoshildi, setQoshildi] = useState(false);
  const [qosh1, setQosh1] = useState(avval);
  const [yangi, setYangi] = useState(avval);
  const [oqar, setOqar] = useState(false);
  const [yonish, setYonish] = useState(false);
  const done = qosh1 && yangi;
  const tugadi = useTugadi(done, 1600, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const qoshil = () => { if (!taxmin) return; setQoshildi(true); setQosh1(true); };
  const yangila = () => {
    if (!qoshildi) return;
    setOqar(true); keyin(() => { setQoshildi(false); }, 180); keyin(() => setOqar(false), 420);
    keyin(() => { setYonish(true); setYangi(true); }, 460); keyin(() => setYonish(false), 1700);
  };
  const qadam = (qosh1 ? 1 : 0) + (yangi ? 1 : 0);
  const SAVOL = tr({ uz: 'Sahifa yangilansa, nima ko\'rinadi?', ru: 'Что будет видно после обновления страницы?' });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · prototip', ru: 'Понятие · прототип' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? DAVOM : !taxmin ? { uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' } : { uz: `Qo'shiling va yangilang (${qadam}/2)`, ru: `Присоединитесь и обновите (${qadam}/2)` }} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Bosiladigan ekranlar uchun <span className="italic" style={{ color: T.accent }}>Backend kerakmi?</span></>, ru: <>Нужен ли <span className="italic" style={{ color: T.accent }}>Backend</span> для кликабельных экранов?</> })}
        mentor={<Mentor>{tr({ uz: "Bu misolda Maydon Jamoa ekranlari namuna ma'lumot bilan qurilgan — «Qo'shilaman» ni bosing, keyin sahifani yangilang.", ru: 'В этом примере экраны Maydon Jamoa собраны на данных-образцах — нажмите «Присоединяюсь», потом обновите страницу.' })}</Mentor>}
        bashorat={!done && <Bashorat savol={SAVOL} variantlar={S6_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="jp-sahna">
          <JamoaTelefon holat="prototip" ekran="oyin" qoshildi={qoshildi} oqar={oqar} halqa={taxmin && !qoshildi && !done ? 'qoshil' : undefined} onQoshil={qoshil}
            ustBar={<span className="jt-brauzer"><i /><i /><i /><button type="button" className={cxx('jt-yangila', qoshildi && !done && 'jp-halqa')} disabled={!qoshildi} onClick={yangila}>↻ {tr({ uz: 'Yangilash', ru: 'Обновить' })}</button></span>} />
          <div className="jp-fayl-u">
            <div className="jp-fayl">
              <span className="jp-fayl-h">prototip/src/namuna.js</span>
              <code className="jp-fq">export const oyinlar = [</code>
              <code className="jp-fq ich">{"{ kun: 'Shanba', soat: '18:00', maydon: 'Mahalla maydoni', "}<span className={cxx('jp-fq-son', yonish && 'yon')}>qoshilgan: 8</span>{', kerak: 10 },'}</code>
              <code className="jp-fq ich iz">{"// … yana 3 ta o'yin"}</code>
              <code className="jp-fq">];</code>
            </div>
            {qoshildi && <span className="jp-izoh-k fade-step">{tr({ uz: "fayl o'zgarmadi", ru: 'файл не изменился' })}</span>}
            <div className="jp-yoq-q"><span className="jp-yoq">Backend — {tr({ uz: "yo'q", ru: 'нет' })}</span><span className="jp-yoq">Database — {tr({ uz: "yo'q", ru: 'нет' })}</span></div>
            {/* Yakuniy holat — bitta natija bloki o'ng ustunda (SABOQ 25): nom qatori · taxmin · xulosa; 1280×800 ga sig'adi */}
            {done && <div className="jp-natija-b fade-step">
              <p className="jp-nom">{tr({ uz: <>Bosiladigan, lekin hali haqiqiy ma'lumotsiz ekranlar <b>prototip</b> deyiladi.</>, ru: <>Кликабельные, но пока без настоящих данных экраны называются <b>прототипом</b>.</> })}</p>
              {taxmin && <QTaxmin togri={taxmin === '8'}>{taxmin === '8' ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение верно' }) : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: «9 / 10» · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>8 / 10</b></>}</QTaxmin>}
              <QXulosa>{tx({ uz: "Bu prototip bosiladi, lekin ma'lumotni saqlamaydi: ma'lumot `namuna.js` da, Backend yo'q.", ru: 'Этот прототип нажимается, но данные не сохраняет: данные в `namuna.js`, Backend нет.' })}</QXulosa>
            </div>}
          </div>
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — TEST 2 (INLINE_KEYS.s7 = 2, C) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Prototipda yangi o'yin e'lon qildingiz. Sahifa yangilansa, e'lon nima bo'ladi?"
    question={tr({ uz: <h2 className="title h-ask">Prototipda yangi o'yin e'lon qildingiz. Sahifa yangilansa, <span className="italic" style={{ color: T.accent }}>e'lon nima bo'ladi?</span></h2>, ru: <h2 className="title h-ask">В прототипе вы объявили новую игру. Что будет <span className="italic" style={{ color: T.accent }}>с объявлением после обновления</span>?</h2> })}
    options={[
      { uz: "Ro'yxatda qoladi — Database'ga yozildi", ru: 'Останется в списке — записалось в Database' },
      { uz: "Ro'yxatda qoladi — brauzer eslab qoldi", ru: 'Останется в списке — браузер запомнил' },
      { uz: "Yo'qoladi — namuna boshidan ochiladi", ru: 'Исчезнет — образец откроется с начала' },
      { uz: "Hammaga ko'rinadi — Backend yubordi", ru: 'Будет видно всем — Backend разослал' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Bu prototip ma'lumotni saqlamaydi: yangilanganda ro'yxat `namuna.js` dan qayta ochiladi.", ru: 'Этот прототип не сохраняет данные: после обновления список заново открывается из `namuna.js`.' }}
    explainWrong={{
      0: { uz: "Bu prototipda Database yo'q — e'lon hech qayerga yozilmadi.", ru: 'В этом прототипе нет Database — объявление никуда не записалось.' },
      1: { uz: 'Bu prototipda brauzerga hech narsa yozilmaydi.', ru: 'В этом прототипе в браузер ничего не записывается.' },
      3: { uz: "Prototipda Backend yo'q — e'lonni hech kim olmaydi.", ru: 'В прототипе нет Backend — объявление никто не получит.' },
      default: { uz: "Bu prototip ma'lumotni saqlamaydi.", ru: 'Этот прототип не сохраняет данные.' }
    }} />
);

// ===== SCREEN 8 — TUSHUNCHA (uch qatorni tanlash): talab qismlari QQadamlar uslubida; har tanlovdan repo daraxti va telefon (agent natijasi — maket misol) o'zgaradi =====
// Telefon CHAPDA (SABOQ 21): sahna (telefon + daraxt) chap ustunda, talab qismlari o'ngda (.jp-oyna — ustunlar o'rni almashadi).
const S8_QISM = [
  { k: 'qayerda', h: { uz: 'Qayerda', ru: 'Где' }, v: [
    { t: { uz: 'Loyihada', ru: 'В проекте' }, aniq: false, xato: { uz: "Joy aytilmasa, agent fayllarni boshqa joyga qo'yishi mumkin.", ru: 'Если место не указано, агент может положить файлы в другое место.' } },
    { t: { uz: '`prototip/` papkasida', ru: 'В папке `prototip/`' }, aniq: true }] },
  { k: 'nima', h: { uz: 'Nima qilsin', ru: 'Что сделать' }, v: [
    { t: { uz: 'Chiroyli ilova qilsin', ru: 'Пусть сделает красивое приложение' }, aniq: false, xato: { uz: "Ish aniq aytilmasa, agent bo'sh joyni o'zi to'ldirishi mumkin.", ru: 'Если работа не указана точно, агент может сам заполнить пробелы.' } },
    { t: { uz: "Uch ekran suratdagidek, namuna ma'lumot bilan, bosiladi", ru: 'Три экрана как на снимке, с данными-образцами, нажимаются' }, aniq: true }] },
  { k: 'buzilmasin', h: { uz: 'Nima buzilmasin', ru: 'Что не сломать' }, v: [
    { t: { uz: 'Hech narsa yozilmagan', ru: 'Ничего не написано' }, aniq: false, xato: { uz: 'Aytilmasa, agent Backend ham qurib ketishi mumkin.', ru: 'Если не сказать, агент может построить и Backend.' } },
    { t: { uz: "Haqiqiy ma'lumot va Backend yo'q", ru: 'Нет настоящих данных и Backend' }, aniq: true }] }
];
const S8_TALAB = { uz: "Qayerda: `prototip/` papkasi. Nima qilsin: wireframe suratidagidek uch ekran — O'yinlar, O'yin, E'lon berish; namuna ma'lumot bilan; ekranlar bosiladi. Nima buzilmasin: haqiqiy ma'lumot va Backend yo'q.", ru: 'Где: папка `prototip/`. Что сделать: три экрана как на снимке wireframe — Игры, Игра, Объявить игру; с данными-образцами; экраны нажимаются. Что не сломать: нет настоящих данных и Backend.' };
// Repo daraxti: tanlovga qarab — fayllar ildizga sochiladi / `prototip/` bitta tugun / `backend/` paydo bo'ladi
const RepoDaraxt = ({ qayerda, buzilmasin, ixcham }) => (
  <div className={cxx('jp-daraxt', ixcham && 'ixcham')}>
    <span className="jp-d-q ildiz">maydon-jamoa/</span>
    <span className="jp-d-q">README.md</span>
    <span className="jp-d-q">wireframe.jpg</span>
    {qayerda === 'aniq' && <span className="jp-d-q papka ok fade-step">prototip/ <i>✓</i></span>}
    {qayerda === 'noaniq' && ['src/', 'index.html', 'package.json'].map((f, i) => <span key={f} className="jp-d-q xato jp-sochil" style={{ '--d': (i * 0.09) + 's' }}>{f}</span>)}
    {buzilmasin === 'noaniq' && <span className="jp-d-q papka xato fade-step">backend/</span>}
  </div>
);
// Telefon ekranlari o'zi almashadi (maket misol): aniq — wireframe'dagi uch ekran; noaniq — wireframe'da yo'q «Kirish», «Chat»
const AylanTelefon = ({ ekranlar, holat = 'prototip', ms = 1700, ...p }) => {
  const kam = kamHarakat();
  const [i, setI] = useState(0);
  useEffect(() => { setI(0); if (kam) return undefined; const id = setInterval(() => setI(x => (x + 1) % ekranlar.length), ms); return () => clearInterval(id); }, [ekranlar.join('|')]); // eslint-disable-line
  return <JamoaTelefon holat={holat} ekran={ekranlar[i % ekranlar.length]} anim={holat === 'jonli' ? { otish: true } : {}} {...p} />;
};
const WireframeSurat = () => (
  <span className="jp-surat">
    <span className="jp-surat-n">wireframe.jpg</span>
    <span className="jp-surat-q">{['oyinlar', 'oyin', 'elon'].map(e => <span key={e} className={cxx('jp-surat-r', e)}><i /><i /><i /></span>)}</span>
  </span>
);
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const keyin = useKeyin();
  const [tanlov, setTanlov] = useState(() => (avval ? { qayerda: 1, nima: 1, buzilmasin: 1 } : {}));
  const [silk, setSilk] = useState(null);
  const holat = (k) => { const q = S8_QISM.find(x => x.k === k); const v = tanlov[k]; return v === undefined ? null : q.v[v].aniq ? 'aniq' : 'noaniq'; };
  const joriy = S8_QISM.findIndex(q => holat(q.k) !== 'aniq');
  const done = joriy < 0;
  const tugadi = useTugadi(done, 1600, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const tanla = (k, vi) => { setTanlov(t => ({ ...t, [k]: vi })); if (!S8_QISM.find(x => x.k === k).v[vi].aniq) { setSilk(k + vi); keyin(() => setSilk(null), 420); } };
  const jq = joriy >= 0 ? S8_QISM[joriy] : null;
  const jv = jq && tanlov[jq.k] !== undefined ? jq.v[tanlov[jq.k]] : null;
  const nima = holat('nima');
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · talab', ru: 'Понятие · требование' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? DAVOM : { uz: `Uch qismni tanlang (${S8_QISM.filter(q => holat(q.k) === 'aniq').length}/3)`, ru: `Выберите три части (${S8_QISM.filter(q => holat(q.k) === 'aniq').length}/3)` }} onClick={onNext} /></>}>
      <div className="jp-oyna">
        <QTushuncha zoom={Zoomable} tugadi={tugadi}
          sarlavha={tr({ uz: <>Wireframe suratidan tashqari <span className="italic" style={{ color: T.accent }}>agentga nima yoziladi?</span></>, ru: <>Что пишут агенту <span className="italic" style={{ color: T.accent }}>кроме снимка wireframe</span>?</> })}
          mentor={<Mentor>{tr({ uz: 'Har qator uchun bittasini tanlang va agent nima qurishini ko\'ring.', ru: 'Для каждой строки выберите один вариант и посмотрите, что соберёт агент.' })}</Mentor>}
          harakat={<div className="q-karta jp-talab-k">
            <WireframeSurat />
            <QQadamlar joriy={done ? undefined : joriy} qadamlar={S8_QISM.map((q, i) => (i === joriy
              ? <span className="jp-qism"><b>{tr(q.h)}</b><span className="q-variantlar jp-guruh">{q.v.map((v, vi) => <QChip key={vi} holat={tanlov[q.k] === vi ? (v.aniq ? 'ok' : 'err') : undefined} silk={silk === q.k + vi} onClick={() => tanla(q.k, vi)}>{tx(v.t)}</QChip>)}</span></span>
              : <span className="jp-qism"><b>{tr(q.h)}</b>{holat(q.k) === 'aniq' && <span className="jp-qism-t">{tx(q.v[tanlov[q.k]].t)}</span>}</span>))} />
            {jv && !jv.aniq && <QXato>{tr(jv.xato)}</QXato>}
          </div>}
          vizual={<div className="jp-sahna s8">
            {/* Agent qurmaguncha telefonda — qog'ozdagi chizma (wireframe.jpg); «Nima qilsin» tanlangach — agent qurgan ekranlar (maket misol) */}
            {nima
              ? <AylanTelefon key={nima} ekranlar={nima === 'aniq' ? ['oyinlar', 'oyin', 'elon'] : ['kirish', 'chat', 'oyinlar']} className="jp-kir-chap" />
              : <AylanTelefon holat="qogoz" ekranlar={['oyinlar', 'oyin', 'elon']} ms={2200} yorliq={<span className="jp-tel-yorliq">wireframe.jpg</span>} />}
            <div className="jp-s8-ong">
              <RepoDaraxt qayerda={holat('qayerda')} buzilmasin={holat('buzilmasin')} />
              {/* Yakuniy holat — bitta natija bloki (SABOQ 25): talab qutisi · nom qatori · xulosa */}
              {done && <div className="jp-natija-b fade-step">
                <p className="jp-talab-q">{tx(S8_TALAB)}</p>
                <p className="jp-nom">{tr({ uz: <>Uch qatorli bu matn — 9-Moduldagi <b>talab</b>; wireframe surati unga ilova.</>, ru: <>Этот текст из трёх строк — <b>требование</b> из 9-го модуля; снимок wireframe — приложение к нему.</> })}</p>
                <QXulosa>{tr({ uz: "Surat ekranlarni ko'rsatadi, talab esa joyni, ishni va nimaga tegmaslikni aytadi.", ru: 'Снимок показывает экраны, а требование называет место, работу и то, чего не трогать.' })}</QXulosa>
              </div>}
            </div>
          </div>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 3 (INLINE_KEYS.s9 = 0, A) =====
const Screen9 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="Talabning «nima buzilmasin» qatoriga nimani yozasiz?"
    question={tr({ uz: <h2 className="title h-ask">Talabning «nima buzilmasin» qatoriga <span className="italic" style={{ color: T.accent }}>nimani yozasiz?</span></h2>, ru: <h2 className="title h-ask">Что вы напишете в строку требования <span className="italic" style={{ color: T.accent }}>«что не сломать»</span>?</h2> })}
    options={[
      { uz: "Haqiqiy ma'lumot va Backend bo'lmasin", ru: 'Пусть не будет настоящих данных и Backend' },
      { uz: "Uch ekran wireframe suratidagidek bo'lsin", ru: 'Пусть три экрана будут как на снимке wireframe' },
      { uz: 'Hamma fayl `prototip/` papkasida tursin', ru: 'Пусть все файлы лежат в папке `prototip/`' },
      { uz: "Ekranlar bir-biriga bosib o'tilsin", ru: 'Пусть между экранами переходят нажатием' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Bu qator agentga nimaga tegmaslikni aytadi: bugun haqiqiy ma'lumot ham, Backend ham yo'q.", ru: 'Эта строка говорит агенту, чего не трогать: сегодня нет ни настоящих данных, ни Backend.' }}
    explainWrong={{
      1: { uz: "Bu — «nima qilsin» qatori: ekranlar qanday bo'lishi.", ru: 'Это строка «что сделать»: какими будут экраны.' },
      2: { uz: 'Bu — «qayerda» qatori: fayllar qaysi papkada.', ru: 'Это строка «где»: в какой папке файлы.' },
      3: { uz: 'Bu ham «nima qilsin» qatorida: ekranlar bosilishi.', ru: 'Это тоже строка «что сделать»: экраны нажимаются.' },
      default: { uz: 'Bu qator agentga nimaga tegmaslikni aytadi.', ru: 'Эта строка говорит агенту, чего не трогать.' }
    }} />
);

// ===== SCREEN 10 — TEKSHIRISH (farqni topish, P-057): tepada wireframe (qog'oz), pastda agent qurgan prototip; uch farq yashirilgan =====
const S10_FARQ = [
  { id: 'o-son', ekran: 'oyinlar', t: { uz: "O'yinlar kartalariga «8 / 10»", ru: 'В карточки «Игр» — «8 / 10»' } },
  { id: 'y-doira', ekran: 'oyin', t: { uz: "O'yin ekraniga qo'shilganlar", ru: 'На экран «Игра» — присоединившихся' } },
  { id: 'e-nechta', ekran: 'elon', t: { uz: "E'lon berish formasiga «Nechta odam»", ru: 'В форму «Объявить игру» — «Сколько человек»' } }
];
const S10_TALAB = { uz: "`prototip/`: wireframe'dagidek qilinsin — O'yinlar kartalariga «8 / 10», O'yin ekraniga qo'shilganlar, E'lon berish formasiga «Nechta odam» qo'shilsin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: '`prototip/`: сделай как в wireframe — добавь в карточки «Игр» «8 / 10», на экран «Игра» присоединившихся, в форму «Объявить игру» «Сколько человек». Больше ничего не трогай, назови изменённые файлы.' };
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const keyin = useKeyin();
  const [topildi, setTopildi] = useState(() => new Set(avval ? S10_FARQ.map(f => f.id) : []));
  const [tuzatildi, setTuzatildi] = useState(avval);
  const [silk, setSilk] = useState(null);
  const [xato, setXato] = useState(false);
  const done = topildi.size >= 3;
  const tugadi = useTugadi(tuzatildi, 1300, avval);
  useEffect(() => { if (!done || avval) return; keyin(() => setTuzatildi(true), 1500); onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const bos = (id) => {
    if (done) return;
    if (S10_FARQ.some(f => f.id === id)) { setXato(false); setTopildi(s => new Set([...s, id])); return; }
    setSilk(id); setXato(true); keyin(() => setSilk(null), 420);
  };
  const belgi = Object.fromEntries([...topildi].map(id => [id, tuzatildi ? 'b-yashil' : 'b-qizil']));
  const yoq = tuzatildi ? new Set() : new Set(S10_FARQ.map(f => f.id));
  return (
    <Stage eyebrow={tr({ uz: 'Tekshirish', ru: 'Проверка' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tuzatildi} label={tuzatildi ? DAVOM : { uz: `Farqlarni toping (${topildi.size}/3)`, ru: `Найдите отличия (${topildi.size}/3)` }} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Agent qurgan ekranlar <span className="italic" style={{ color: T.accent }}>wireframe'ga mosmi?</span></>, ru: <>Совпадают ли экраны агента <span className="italic" style={{ color: T.accent }}>с wireframe</span>?</> })}
        mentor={<Mentor>{tr({ uz: "Agent ba'zi joyni taxmin qilishi mumkin — tepada bor, pastda yo'q bo'lakni bosing.", ru: 'Агент мог что-то додумать — нажмите часть, которая есть сверху, но нет снизу.' })}</Mentor>}
        vizual={<div className="jp-s10">
          <div className="jp-solish">
            <Qogoz className="jp-solish-q">
              {['oyinlar', 'oyin', 'elon'].map(e => <JamoaTelefon key={e} holat="qogoz" ixcham ekran={e} onB={tuzatildi ? undefined : bos} belgi={belgi} silk={silk} />)}
            </Qogoz>
            <div className="jp-solish-p">
              {['oyinlar', 'oyin', 'elon'].map(e => <JamoaTelefon key={e} holat="prototip" ixcham bar={false} ekran={e} yoq={yoq} joy={topildi} belgi={tuzatildi ? Object.fromEntries([...topildi].map(id => [id, 'b-keldi'])) : {}} />)}
            </div>
          </div>
          <div className="jp-s10-ong">
            <span className="jp-hisob">{tr({ uz: 'Farq', ru: 'Отличий' })}: <b>{topildi.size} / 3</b></span>
            <div className={cxx('jp-tuzat', done && 'toliq')}>
              <span className="q-yorliq">{tr({ uz: 'Tuzatish talabi', ru: 'Требование на исправление' })}</span>
              {done
                ? <p className="jp-tuzat-m fade-step">{tx(S10_TALAB)}</p>
                : S10_FARQ.filter(f => topildi.has(f.id)).map(f => <p key={f.id} className="jp-tuzat-q fade-step">{tr(f.t)}</p>)}
            </div>
            {xato && <QXato>{tr({ uz: 'Bu joy ekranda bor — boshqasini qidiring.', ru: 'Это место на экране есть — ищите другое.' })}</QXato>}
            {/* Yakuniy holat — bitta natija bloki o'ng ustunda (SABOQ 25), 1280×800 ga sig'adi */}
            {tuzatildi && <QXulosa>{tr({ uz: "Agent qurganini wireframe bilan solishtirasiz; farqlarni bitta tuzatish talabida yuborasiz.", ru: 'Вы сравниваете собранное агентом с wireframe; отличия отправляете одним требованием на исправление.' })}</QXulosa>}
          </div>
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 11 — TUSHUNCHA (uch kalit): har kalit jonli holatning bitta animatsiyasini yoqadi; yoqilmagan harakat birdan bo'ladi (farq ko'rinsin) =====
const S11_KALIT = [
  { k: 'karta', t: { uz: 'Karta kichrayib qaytadi', ru: 'Карточка сжимается и возвращается' }, teg: '`transform` + `transition`', halqa: 'karta' },
  { k: 'son', t: { uz: 'Son kattalashib, silliq qaytadi', ru: 'Число увеличивается и плавно возвращается' }, teg: '`transition`', halqa: 'qoshil' },
  { k: 'otish', t: { uz: 'Ekranlar silliq almashadi', ru: 'Экраны плавно сменяются' }, teg: 'Motion', halqa: 'orqaga' }
];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [yoq, setYoq] = useState(() => new Set(avval ? ['karta', 'son', 'otish'] : []));
  const [tek, setTek] = useState(() => new Set(avval ? ['karta', 'son', 'otish'] : []));
  const [ekran, setEkran] = useState('oyinlar');
  const [qoshildi, setQoshildi] = useState(false);
  const done = tek.size >= 3;
  const tugadi = useTugadi(done, 1700, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const joriy = S11_KALIT.find(x => !tek.has(x.k));
  const belgila = (k) => { if (yoq.has(k) && !tek.has(k)) setTek(s => new Set([...s, k])); };
  const anim = { karta: yoq.has('karta'), son: yoq.has('son'), otish: yoq.has('otish') };
  const halqa = joriy && yoq.has(joriy.k) ? joriy.halqa : undefined;
  const jonli = done;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · jonli prototip', ru: 'Понятие · живой прототип' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? DAVOM : { uz: `Uch kalitni tekshiring (${tek.size}/3)`, ru: `Проверьте три переключателя (${tek.size}/3)` }} onClick={onNext} /></>}>
      <div className="jp-oyna">
        <QTushuncha zoom={Zoomable} tugadi={tugadi}
          sarlavha={tr({ uz: <>Animatsiya prototipga <span className="italic" style={{ color: T.accent }}>nima qo'shadi?</span></>, ru: <>Что анимация <span className="italic" style={{ color: T.accent }}>добавляет прототипу</span>?</> })}
          mentor={<Mentor>{tr({ uz: '9-Modulda Maydon kataklariga animatsiya yozgansiz, usullari o\'sha — har kalitni yoqing va telefonda tekshirib ko\'ring.', ru: 'В 9-м модуле вы писали анимацию для ячеек Maydon, способы те же — включайте каждый переключатель и проверяйте на телефоне.' })}</Mentor>}
          harakat={<div className="jp-kalitlar">
            <span className="jp-hisob">{tr({ uz: 'Tekshirildi', ru: 'Проверено' })}: <b>{tek.size} / 3</b></span>
            {S11_KALIT.map((x, i) => {
              const on = yoq.has(x.k);
              const faol = joriy && joriy.k === x.k;
              return (
                <button key={x.k} type="button" className={cxx('jp-kalit', on && 'on', tek.has(x.k) && 'ok', faol && !on && 'jp-halqa')} disabled={!faol || on} onClick={() => setYoq(s => new Set([...s, x.k]))}>
                  <span className="jp-kalit-i" aria-hidden="true"><i /></span>
                  <span className="jp-kalit-t"><b>{i + 1}. {tr(x.t)}</b><code>{tx(x.teg)}</code></span>
                  {tek.has(x.k) && <span className="jp-ok">✓</span>}
                </button>
              );
            })}
          </div>}
          vizual={<div className="jp-sahna s11">
            <JamoaTelefon holat={yoq.size ? 'jonli' : 'prototip'} ekran={ekran} qoshildi={qoshildi} anim={anim} halqa={halqa}
              yorliq={<span key={jonli ? 'j' : 'p'} className={cxx('jp-tel-yorliq', jonli && 'jonli fade-step')}>{jonli ? tr({ uz: 'jonli prototip', ru: 'живой прототип' }) : tr({ uz: 'prototip', ru: 'прототип' })}</span>}
              onKarta={() => { setEkran('oyin'); belgila('karta'); }}
              onQoshil={() => { setQoshildi(true); belgila('son'); }}
              onOrqaga={() => { setEkran('oyinlar'); belgila('otish'); }} />
          </div>}
          natija={done && <p className="jp-nom fade-step">{tr({ uz: <>Animatsiyasi bor prototipni bu kursda <b>jonli prototip</b> deymiz.</>, ru: <>Прототип с анимацией в этом курсе мы называем <b>живым прототипом</b>.</> })}</p>}
          xulosa={done && tr({ uz: "Uch animatsiya o'yinchiga javob beradi: bosildi, son o'zgardi, yangi ekran ochildi.", ru: 'Три анимации отвечают игроку: нажато, число изменилось, открылся новый экран.' })}
        />
      </div>
      <MentorNote>{tx({ uz: "Bu yerda yangi qoida yo'q — 9-Modul 5 va 8-darslardagi `transform`, `transition`, Motion qayta ishlatiladi; 2–3 daqiqa yetadi.", ru: 'Здесь нет нового правила — повторяются `transform`, `transition` и Motion из 5-го и 8-го уроков 9-го модуля; хватит 2–3 минут.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 12 — KOD YOZISH (QKod + HtmlCompiler, ko'p fayl): index.html, app.js tayyor · style.css o'quvchi yozadi. Shartlar stylesheet tahlili bilan (regex emas) =====
// Kod nusxalanmaydi (qo'lda yoziladi). «Kompilyatorni ochish» — platforma tugmasi, nomi tegilmaydi. starter izohlarida backtik yo'q (CLAUDE.md).
const KOD_HTML = `<div class="oyin">
  <p>Shanba, 18:00 · Mahalla maydoni</p>
  <p class="hisob"><span class="son">8</span> / 10</p>
  <button class="tugma">Qo'shilaman</button>
</div>
`;
const KOD_JS = `const son = document.querySelector('.son');
const tugma = document.querySelector('.tugma');
tugma.addEventListener('click', () => {
  son.textContent = 9;
  son.classList.add('yangi');
  setTimeout(() => son.classList.remove('yangi'), 300);
  tugma.disabled = true;
  tugma.textContent = "Qo'shildingiz";
});
`;
const KOD_CSS = { uz: `.son {
  display: inline-block;
  /* 1) transition shu yerga */
}
/* 2) .son.yangi qoidasi shu yerga */
`, ru: `.son {
  display: inline-block;
  /* 1) transition сюда */
}
/* 2) правило .son.yangi сюда */
` };
const KOD_KALIT = 'pm-m9d7-code';
const cssQoida = (x, sel) => (x.cssRules || []).filter(r => String(r.selector).split(',').map(s => s.trim()).includes(sel));
// CSSOM `transition: all 0.3s` ni «0.3s» deb qaytaradi (all — standart qiymat) — xossa nomi yo'q bo'lsa «all» deb olinadi; vergul faqat qavsdan tashqarida bo'linadi (F-1007-289)
const sonTransition = (x) => cssQoida(x, '.son').some(r => String(r.props.transition || '').split(/,(?![^(]*\))/).some(p => {
  const s = p.trim(); if (!/(^|\s)\d*\.?\d+m?s(\s|$)/.test(s)) return false;
  const nom = s.replace(/(cubic-bezier|steps)\([^)]*\)/g, ' ').split(/\s+/).filter(t => t && !/^\d*\.?\d+m?s$/.test(t) && !/^(ease|linear|ease-in|ease-out|ease-in-out|step-start|step-end|normal|allow-discrete)$/.test(t))[0];
  return !nom || nom === 'transform' || nom === 'all';
}));
const yangiScale = (x) => cssQoida(x, '.son.yangi').some(r => { const m = /scale\(\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/.exec(r.props.transform || ''); if (!m) return false; const a = parseFloat(m[1]), b = m[2] !== undefined ? parseFloat(m[2]) : a; return a >= 1.1 && a <= 1.5 && b >= 1.1 && b <= 1.5; });
const KOD_VAZIFA = [
  { uz: '`.son` qoidasiga qo\'shing: `transition: transform 0.3s;`', ru: 'Добавьте в правило `.son`: `transition: transform 0.3s;`' },
  { uz: '`.son.yangi` qoidasini yozing: `transform: scale(1.3);`', ru: 'Напишите правило `.son.yangi`: `transform: scale(1.3);`' },
  { uz: "Natija oynasida «Qo'shilaman» ni bosing — son kattalashib, silliq qaytsin.", ru: 'В окне результата нажмите «Присоединяюсь» — число увеличится и плавно вернётся.' }
];
const bt = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v).replace(/`/g, '')]));
const shart = (id, label, fn, hint) => ({ id, label: bt(label), check: C.custom(x => fn(x) || tr(bt(hint))) });
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish · son', ru: 'Пишем код · число' },
  title: { uz: 'style.css — sonni silliq kattalashtiring', ru: 'style.css — плавно увеличьте число' },
  files: [
    { name: 'style.css', lang: 'css', starter: KOD_CSS },
    { name: 'index.html', lang: 'html', starter: KOD_HTML },
    { name: 'app.js', lang: 'js', starter: KOD_JS }
  ],
  requirements: [
    shart('transition', KOD_VAZIFA[0], sonTransition, { uz: '`.son` dagi `transition` da `transform` va vaqt bo\'lsin.', ru: 'Пусть в `transition` у `.son` будут `transform` и время.' }),
    shart('scale', KOD_VAZIFA[1], yangiScale, { uz: '`.son.yangi` ichida `transform: scale(1.3)` bo\'lsin.', ru: 'Пусть в `.son.yangi` будет `transform: scale(1.3)`.' })
  ]
};
// Natija oynasi — o'quvchining o'z kodi haqiqiy brauzerda (iframe): «Qo'shilaman» ni bosib, son kattalashib qaytishini o'zi ko'radi
const natijaHujjat = (codes) => `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;padding:16px;font-family:system-ui,sans-serif;color:#0E0E10}.oyin{border:1px solid #ddd;border-radius:12px;padding:12px 14px;max-width:260px}.oyin p{margin:0 0 8px}.hisob{font-family:monospace;font-size:22px;font-weight:700}.tugma{font:inherit;font-weight:700;padding:8px 14px;border-radius:9px;border:0;background:#2E9E4F;color:#fff;cursor:pointer}.tugma:disabled{background:#ccc;color:#555}</style><style>${codes['style.css'] || ''}</style></head><body>${codes['index.html'] || ''}<script>${codes['app.js'] || ''}<\/script></body></html>`;
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — o'quvchi matni emas, qolip API nomi (9-Modul QKOD_ONG naqshi)
const QKOD_ONG = 'muh\u0061rrir';
const useKodMashq = ({ screen, storedAnswer, onAnswer, fayllar }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [open, setOpen] = useState(false);
  const [codes, setCodes] = useState(() => (storedAnswer && storedAnswer.codes) || null);
  const [otdi, setOtdi] = useState(!!(storedAnswer && storedAnswer.solved));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const [yordam, setYordam] = useState(false);
  const finish = ({ codes: c }) => { setOpen(false); if (c) setCodes(c); setOtdi(true); };
  const bajardim = () => {
    if (done || !otdi) return;
    setDone(true);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, codes, code: codes && codes['style.css'], solved: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  return { live, isMentor, open, setOpen, codes: codes || fayllar, otdi, done, yordam, setYordam, finish, bajardim, screen };
};
const KodKorinish = ({ fayl, matn }) => (
  <div className="jp-kod" onCopy={e => e.preventDefault()}>
    <span className="jp-kod-h">{fayl}</span>
    <pre className="jp-kod-t">{matn}</pre>
  </div>
);
const KodOng = ({ m }) => (m.done
  ? <div className="jp-natija-q"><span className="q-yorliq">{tr({ uz: 'Natija oynasi', ru: 'Окно результата' })}</span><iframe className="jp-natija" title="natija" sandbox="allow-scripts" srcDoc={natijaHujjat(m.codes)} /></div>
  : <div className="jp-kodoyna">
    <KodKorinish fayl="style.css" matn={String(m.codes['style.css'] || '').trimEnd()} />
    <div className="jp-kod-amal">
      <QTugma className={!m.otdi && !m.isMentor ? 'jp-halqa' : undefined} onClick={() => m.setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma>
      <span className="jp-kod-iz">{tr({ uz: 'Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko\'rasiz.', ru: 'Откроется окно кода — вы пишете код и видите результат здесь.' })}</span>
    </div>
    {m.isMentor && <MentorPracticeStats live={m.live} screen={m.screen} />}
  </div>);
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const m = useKodMashq({ screen, storedAnswer, onAnswer, fayllar: { 'style.css': tr(KOD_CSS), 'index.html': KOD_HTML, 'app.js': KOD_JS } });
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · son', ru: 'Пишем код · число' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!m.done && !m.isMentor} label={m.done || m.isMentor ? DAVOM : { uz: 'Kodni yozing', ru: 'Напишите код' }} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>«9 / 10» ni <span className="italic" style={{ color: T.accent }}>silliq ko'rsatadigan</span> kod yozamiz.</>, ru: <>Пишем код, который <span className="italic" style={{ color: T.accent }}>плавно показывает</span> «9 / 10».</> })}
        mentor={<Mentor>{tr({ uz: "Shu animatsiyani kod oynasida CSS bilan o'zingiz terib yozasiz — nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi.", ru: 'Эту анимацию вы сами наберёте на CSS в окне кода — скопировать нельзя: учатся, когда пишут руками.' })}</Mentor>}
        vazifa={<ol className="jp-vazifa">{KOD_VAZIFA.map((v, i) => { const ok = i < 2 ? m.otdi : m.done; return <li key={i} className={ok ? 'ok' : undefined}><i>{ok ? '✓' : i + 1}</i><span>{tx(v)}</span></li>; })}</ol>}
        yordam={!m.done && <div className="jp-yordam">
          <QTugma ikkinchi aria-expanded={m.yordam} onClick={() => m.setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
          {m.yordam && <QIzoh>{tx({ uz: 'Son kattalashmasa, `.son.yangi` da ikki klass orasida bo\'sh joy yo\'qligini va `0.3s` da «s» harfi borligini tekshiring.', ru: 'Если число не увеличивается, проверьте, что в `.son.yangi` между двумя классами нет пробела и что в `0.3s` есть буква «s».' })}</QIzoh>}
        </div>}
        bajardim={!m.done && <div className="jp-bajardim"><QTugma className={m.otdi && !m.done ? 'jp-halqa' : undefined} disabled={!m.otdi || m.done} onClick={m.bajardim}>{tr({ uz: 'Bajardim', ru: 'Готово' })}</QTugma></div>}
        {...{ [QKOD_ONG]: <KodOng m={m} /> }}
      >
        {m.done && <QXulosa>{tr({ uz: 'Son almashganda bir lahza kattalashib qaytadi — o\'yinchi «9 / 10» bo\'lganini sezadi.', ru: 'Когда число меняется, оно на миг увеличивается и возвращается — игрок замечает, что стало «9 / 10».' })}</QXulosa>}
      </QKod>
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz) — qobiq tashqi zoomni bekor qiladi (9-Modul naqshi) */}
      {m.open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} storageKey={KOD_KALIT} onContinue={m.finish} onBack={() => m.setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 13 — TEST 4 (INLINE_KEYS.s13 = 3, D) =====
const Screen13 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="«Qo'shilaman» bosilganda son sakrab kattalashadi. Nimani qo'shasiz?"
    question={tr({ uz: <h2 className="title h-ask">«Qo'shilaman» bosilganda son sakrab kattalashadi. <span className="italic" style={{ color: T.accent }}>Nimani qo'shasiz?</span></h2>, ru: <h2 className="title h-ask">При нажатии «Присоединяюсь» число увеличивается скачком. <span className="italic" style={{ color: T.accent }}>Что вы добавите?</span></h2> })}
    options={[
      { uz: '`.son` ga `transition: opacity 0.3s`', ru: 'в `.son` — `transition: opacity 0.3s`' },
      { uz: '`.tugma` ga `transition: transform 0.3s`', ru: 'в `.tugma` — `transition: transform 0.3s`' },
      { uz: '`.son.yangi` ga `transform: scale(1)`', ru: 'в `.son.yangi` — `transform: scale(1)`' },
      { uz: '`.son` ga `transition: transform 0.3s`', ru: 'в `.son` — `transition: transform 0.3s`' }
    ]} correctIdx={3}
    explainCorrect={{ uz: '`transition` `.son` da tursa, son silliq kattalashadi va silliq qaytadi.', ru: 'Если `transition` стоит в `.son`, число плавно увеличивается и плавно возвращается.' }}
    explainWrong={{
      0: { uz: '`opacity` shaffoflikni silliq qiladi, o\'lcham esa sakraydi.', ru: '`opacity` делает плавной прозрачность, а размер скачет.' },
      1: { uz: 'Bu tugmaga vaqt beradi — son esa sakrashda qoladi.', ru: 'Это даёт время кнопке — число так и скачет.' },
      2: { uz: '`scale(1)` o\'lchamni o\'zgartirmaydi — son kattalashmaydi.', ru: '`scale(1)` не меняет размер — число не увеличивается.' },
      default: { uz: '`transition` `.son` da tursin.', ru: 'Пусть `transition` стоит в `.son`.' }
    }} />
);

// ===== SCREEN 14 — FINAL (QTartib · ball · sentinel 0): PROTOTIP_YOLI — 1-ekran qadamlari bilan bitta manba; uyalar «bu yerga qo'ying» =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
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
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Qog'ozdan jonli prototipgacha qaysi tartibda borasiz?", options: PROTOTIP_YOLI.map(z => ou(z.t)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · tartib', ru: 'Итог · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? DAVOM : { uz: "Avval bo'laklarni joylang", ru: 'Сначала разложите части' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qog'ozdan jonli prototipgacha <span className="italic" style={{ color: T.accent }}>qaysi tartibda</span> borasiz?</>, ru: <>В каком <span className="italic" style={{ color: T.accent }}>порядке</span> идти от бумаги до живого прототипа?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni bajariladigan tartibda joylang.", ru: 'Разложите части в том порядке, в каком их выполняют.' })}</Mentor>
        <Zoomable>
          <QTartib onWrong={onWrong}
            items={PROTOTIP_YOLI.map(z => ({ id: z.id, label: tr(z.t) }))}
            joyMatn={tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}
            onSolved={solve}
            doneText={tr({ uz: "Avval qog'oz va talab, keyin tekshirish; animatsiya ekranlar to'g'ri bo'lgandan keyin qo'shiladi.", ru: 'Сначала бумага и требование, потом проверка; анимацию добавляют, когда экраны уже верны.' })}
            xatoMatn={tr({ uz: "Tartib xato — bo'lakni bosib qaytaring.", ru: 'Порядок неверный — нажмите на часть, чтобы вернуть её.' })}
          />
        </Zoomable>
        {done && wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar, 4) — uch savol (birinchi urinish) + bonus: A2 oxirgi «Bajardim» (birinchi urinish sharti yo'q, 152) =====
const ACHIEVEMENTS = {
  paperFirst: { icon: '📝', name: 'Paper First', desc: { uz: "Wireframe'ga nima kirishini topdingiz", ru: 'Вы нашли, что входит в wireframe' } },
  sampleData: { icon: '🗂️', name: 'Sample Data', desc: { uz: 'Prototip nimani saqlamasligini bildingiz', ru: 'Вы поняли, что прототип не сохраняет' } },
  clearRequest: { icon: '🎯', name: 'Clear Request', desc: { uz: 'Talabning «nima buzilmasin» qatorini topdingiz', ru: 'Вы нашли строку требования «что не сломать»' } },
  livePrototype: { icon: '⚡', name: 'Live Prototype', desc: { uz: 'Ikkala amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили оба практических блока до конца' } }
};
// Ekran id → nishon. Savollar — birinchi urinishda to'g'ri; a2 — bonus (blok yakunida correct: true)
const ACH_TRIGGERS = { s4: 'paperFirst', s7: 'sampleData', s9: 'clearRequest', a2: 'livePrototype' };

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


// Podium savol yorliqlari (SCORED_IDX: 4, 7, 9, 13, 14)
const Q_LABELS = {
  4: { uz: "1 — Wireframe'da nima bor", ru: '1 — Что есть в wireframe' },
  7: { uz: '2 — Yangilangan prototip', ru: '2 — Обновлённый прототип' },
  9: { uz: '3 — Nima buzilmasin', ru: '3 — Что не сломать' },
  13: { uz: '4 — Silliq son', ru: '4 — Плавное число' },
  14: { uz: "Yakuniy — prototip yo'li", ru: 'Итог — путь прототипа' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: 'wireframe',  l: 5,  t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'talab', ru: 'требование' }, l: 82, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'prototip', ru: 'прототип' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'prototip/',  l: 74, t: 68, s: 22, d: 21, dl: 2.2 },
  { ch: 'namuna.js',  l: 44, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'transform',  l: 64, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: 'transition', l: 24, t: 36, s: 22, d: 20, dl: 1.9 },
  { ch: 'Motion',     l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: 'git clone',  l: 52, t: 6,  s: 20, d: 22, dl: 3.3 },
  { ch: 'README',     l: 88, t: 44, s: 20, d: 24, dl: 0.6 },
  { ch: '8 / 10',     l: 36, t: 58, s: 22, d: 19, dl: 2.6 },
  { ch: 'Maydon Jamoa', l: 60, t: 48, s: 18, d: 26, dl: 1.3 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javoblar A · B · C · D ×3 (MD, aylanma); ekran savollarining nusxasi emas (§144)
const QUIZ_BANK = [
  { q: { uz: 'Wireframe nimani ko\'rsatadi?', ru: 'Что показывает wireframe?' }, opts: [{ uz: 'Ekranda qayerda nima turishini', ru: 'Что где стоит на экране' }, { uz: 'Tugmalar qaysi rangda bo\'lishini', ru: 'Какого цвета будут кнопки' }, { uz: 'Sarlavha qaysi shriftda yozilishini', ru: 'Каким шрифтом написан заголовок' }, { uz: 'Ma\'lumot qayerda saqlanishini', ru: 'Где хранятся данные' }], correct: 0 },
  { q: { uz: 'Tashkilotchi kun va soatni qaysi ekranda yozadi?', ru: 'На каком экране организатор пишет день и время?' }, opts: [{ uz: "O'yinlar ekranida", ru: 'На экране «Игры»' }, { uz: "E'lon berish ekranida", ru: 'На экране «Объявить игру»' }, { uz: "O'yin ekranida", ru: 'На экране «Игра»' }, { uz: 'Kirish ekranida', ru: 'На экране «Вход»' }], correct: 1 },
  { q: { uz: 'Prototip qanday ekranlar?', ru: 'Какие экраны называют прототипом?' }, opts: [{ uz: "Do'konga chiqqan birinchi versiya", ru: 'Первая версия, вышедшая в магазин' }, { uz: "Qog'ozdagi rangsiz, sodda chizma", ru: 'Бесцветный простой рисунок на бумаге' }, { uz: "Bosiladigan, lekin haqiqiy ma'lumotsiz", ru: 'Кликабельные, но без настоящих данных' }, { uz: "Backend va Database'ning to'liq chizmasi", ru: 'Полная схема Backend и Database' }], correct: 2 },
  { q: { uz: "Prototipdagi o'yinlar ro'yxati qayerdan keladi?", ru: 'Откуда берётся список игр в прототипе?' }, opts: [{ uz: "Database'dagi `oyinlar` jadvalidan", ru: 'Из таблицы `oyinlar` в Database' }, { uz: "Backend'dagi yo'ldan", ru: 'Из пути в Backend' }, { uz: 'Telegram guruhidan', ru: 'Из группы в Telegram' }, { uz: '`namuna.js` faylidan', ru: 'Из файла `namuna.js`' }], correct: 3 },
  { q: { uz: 'Bu darsda talabning «qayerda» qatoriga nima yoziladi?', ru: 'Что на этом уроке пишут в строку требования «где»?' }, opts: [{ uz: '`prototip/` papkasi', ru: 'Папка `prototip/`' }, { uz: 'Telefon ekrani', ru: 'Экран телефона' }, { uz: 'GitHub sahifasi', ru: 'Страница GitHub' }, { uz: '`backend/` papkasi', ru: 'Папка `backend/`' }], correct: 0 },
  { q: { uz: 'Wireframe surati talabda nimaga kerak?', ru: 'Зачем в требовании снимок wireframe?' }, opts: [{ uz: 'Agentga ekran ranglarini tanlab beradi', ru: 'Выбирает агенту цвета экрана' }, { uz: "Ekranlar qanday joylashganini ko'rsatadi", ru: 'Показывает, как расположены экраны' }, { uz: "Agentga Backend'ni ulashga yordam beradi", ru: 'Помогает агенту подключить Backend' }, { uz: "Talabning uch qatori o'rniga yuboriladi", ru: 'Отправляется вместо трёх строк требования' }], correct: 1 },
  { q: { uz: 'Agent «Tayyor!» dedi. Keyin nima qilasiz?', ru: 'Агент сказал «Готово!». Что дальше?' }, opts: [{ uz: "Tekshirmasdan, uni GitHub'ga yuboraman", ru: 'Не проверяя, отправляю на GitHub' }, { uz: 'Talabni boshidan qayta yozaman', ru: 'Пишу требование заново' }, { uz: 'Bosib, wireframe bilan solishtiraman', ru: 'Нажимаю и сравниваю с wireframe' }, { uz: "Avval uch animatsiyani qo'shaman", ru: 'Сначала добавляю три анимации' }], correct: 2 },
  { q: { uz: 'Uchta farq topdingiz. Agentga qanday yozasiz?', ru: 'Вы нашли три отличия. Как написать агенту?' }, opts: [{ uz: "Loyihani o'chirib, boshidan yozdiraman", ru: 'Удаляю проект и прошу написать заново' }, { uz: 'Faqat eng kattasini yozaman', ru: 'Пишу только самое большое' }, { uz: "Hech narsa — agent o'zi topadi", ru: 'Ничего — агент найдёт сам' }, { uz: 'Uchalasini bitta tuzatish talabida', ru: 'Все три одним требованием на исправление' }], correct: 3 },
  { q: { uz: 'Jonli prototip qanday prototip?', ru: 'Какой прототип называют живым?' }, opts: [{ uz: 'Animatsiyasi bor prototip', ru: 'Прототип с анимацией' }, { uz: "Telefonga o'rnatilgan prototip", ru: 'Прототип, установленный на телефон' }, { uz: "Backend'ga ulangan prototip", ru: 'Прототип, подключённый к Backend' }, { uz: 'Rangli chizilgan prototip', ru: 'Прототип, нарисованный в цвете' }], correct: 0 },
  { q: { uz: 'Karta bosilganda kichrayib qaytishi uchun nima kerak?', ru: 'Что нужно, чтобы карточка при нажатии сжималась и возвращалась?' }, opts: [{ uz: '`transition` va `font-size`', ru: '`transition` и `font-size`' }, { uz: '`transform` va `transition`', ru: '`transform` и `transition`' }, { uz: '`initial` va `exit`', ru: '`initial` и `exit`' }, { uz: '`display` va `width`', ru: '`display` и `width`' }], correct: 1 },
  { q: { uz: "Bu prototipda ekrandan ekranga silliq o'tishni nima qiladi?", ru: 'Что в этом прототипе делает плавный переход между экранами?' }, opts: [{ uz: '`:active` holati', ru: 'Состояние `:active`' }, { uz: '`scale(1.3)` qiymati', ru: 'Значение `scale(1.3)`' }, { uz: 'Motion kutubxonasi', ru: 'Библиотека Motion' }, { uz: '`setTimeout` funksiyasi', ru: 'Функция `setTimeout`' }], correct: 2 },
  { q: { uz: "GitHub'dagi repo'ni kompyuterga qaysi buyruq ko'chiradi?", ru: 'Какая команда копирует репо с GitHub на компьютер?' }, opts: [{ uz: '`git push`', ru: '`git push`' }, { uz: '`git commit`', ru: '`git commit`' }, { uz: '`git status`', ru: '`git status`' }, { uz: '`git clone`', ru: '`git clone`' }], correct: 3 }
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4; tayanch 4, 9.1, 9.12) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). steps [{ h, t, kul?, bandlar?, prompt?, namuna?, yordam?, err? }] · natija (kutilgan natija · namuna: Maydon Jamoa).
// Prompt: QPrompt ko'rinishi (q-prompt klasslari) + {…} joylari tahrirlanadigan maydon, bo'sh bo'lsa yonida kulrang «masalan: …» — qolipda bu maydon yo'q (qolip taklifi), shu faylda JpPrompt.
// A1 da ikki joy mustaqil ishdagi yozuvdan (pm-m9d7-wireframe) oldindan yoziladi, tahrirlanadi. «Yordam» — Mentor misolidagi to'liq talab (ochiladigan). «Ortda qoldingizmi» — faqat A1 (SABOQ 39).
const JpPrompt = ({ satrlar, namuna = [], boshlang = {} }) => {
  const [ok, setOk] = useState(false);
  const [qiymat, setQiymat] = useState(() => ({ ...boshlang }));
  const nm = {};
  namuna.forEach(x => { nm[tr(x.joy)] = x.n; });
  const matn = satrlar.map(l => tr(l));
  const toliq = matn.map(l => l.replace(/\{[^}]+\}/g, (j) => (qiymat[j] && qiymat[j].trim()) || j));
  const nusxa = async () => { try { await navigator.clipboard.writeText(toliq.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  const korildi = new Set();
  const joy = (t, li) => t.split(/(\{[^}]+\})/g).map((p, i) => {
    if (!/^\{.+\}$/.test(p)) return <React.Fragment key={li + '-' + i}>{fmtCode(p)}</React.Fragment>;
    const birinchi = !korildi.has(p); korildi.add(p);
    const v = qiymat[p] || '';
    if (!birinchi) return <span key={li + '-' + i} className="q-joy">{v.trim() || p}</span>;
    return <React.Fragment key={li + '-' + i}>
      <input className={cxx('jp-joy-in', v.trim() && 'bor')} value={v} placeholder={p} aria-label={p} style={{ width: `min(100%, ${Math.max(p.length, v.length) + 3}ch)` }} onChange={e => { const x = e.target.value; setQiymat(q => ({ ...q, [p]: x })); }} />
      {!v.trim() && nm[p] && <span className="jp-joy-n">{tx(nm[p])}</span>}
    </React.Fragment>;
  });
  return (
    <span className="q-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="jp-ps">{joy(l, i)}</span>)}
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  useEffect(() => {
    if (!ochiq) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy .jp-yordam-b'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 80);
    return () => clearTimeout(t);
  }, [ochiq]);
  return (
    <>
      <QTugma ikkinchi className="jp-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      {ochiq && <span className="jp-yordam-b fade-step">{satrlar.map((l, i) => <span key={i} className="jp-yordam-s">{tx(l)}</span>)}</span>}
    </>
  );
};
const XATO_GAP = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' }; // S3 (F-1006-287): 14-dars naqshi
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText }) {
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
  const birinchi = useRef(true);
  useEffect(() => { // yangi ochilgan qadam (uzun prompt) «Bajardim»i bilan birga ko'rinsin
    if (birinchi.current) { birinchi.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 8 / S3 (F-1006-287, 14-dars naqshi): Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${tr(steps[stepN].h)}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${tr(steps[stepN].h)}»: выполните и нажмите «Bajardim».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? DAVOM : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: <>{c.kul && <span className="jp-kul-q">{tx(c.kul)}</span>}{tx(c.t)}{c.bandlar && c.bandlar.map((b, i) => <span key={i} className={cxx('jp-band', b.kul && 'kul', b.yon && 'yon')}>{tx(b.kul || b.yon || b)}</span>)}{c.prompt && <JpPrompt satrlar={c.prompt} namuna={c.namuna} boshlang={c.boshlang ? c.boshlang() : {}} />}</>,
          xato: c.yordam ? <><Yordam satrlar={c.yordam} />{c.err && <span className="jp-err">{tx(c.err)}</span>}</> : (c.err && tx(c.err))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tx(doneText)} natija={<>{natija}{ortda && <p className="jp-ortda">{tx(ortda)}</p>}</>} natijaYorliq={tr({ uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' })}
        pastki={<MentorPracticeStats live={_live} screen={screen} />} />
    </Stage>
  );
}
const QADAM = { ochish: { uz: 'Ochish', ru: 'Открыть' }, prompt: { uz: 'Prompt', ru: 'Промпт' }, ishga: { uz: 'Ishga tushirish', ru: 'Запуск' }, tekshirish: { uz: 'Tekshirish', ru: 'Проверка' } };
// Kutilgan natija maketlari (o'ng) — bitta manbadan (JamoaTelefon, NAMUNA_OYINLAR); kirishda navbat bilan chiqadi
const A1Natija = () => (
  <div className="jp-nat">
    <AylanTelefon ekranlar={['oyinlar', 'oyin', 'elon']} ms={2000} className="jp-kir" />
    <div className="jp-daraxt ixcham jp-kir" style={{ '--d': '0.15s' }}>
      <span className="jp-d-q ildiz">maydon-jamoa/</span>
      <span className="jp-d-q">README.md</span>
      <span className="jp-d-q">PRD.md</span>
      <span className="jp-d-q">wireframe.jpg</span>
      <span className="jp-d-q papka">prototip/</span>
      <span className="jp-d-q ich">src/namuna.js</span>
    </div>
  </div>
);
// A2: jonli holat bir xil siklda o'zi yuradi — karta kichrayib qaytadi → O'yin silliq kiradi → «Qo'shilaman» → 8 → 9 kattalashib qaytadi → «‹ O'yinlar» → ro'yxat silliq qaytadi
const A2_SIKL = [{ ms: 1200, k: 0 }, { ms: 160, k: 0, bos: '1' }, { ms: 1400, k: 1 }, { ms: 1400, k: 2 }, { ms: 1400, k: 3 }];
const A2Natija = () => {
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [q, setQ] = useState(kam ? 3 : 0);
  useEffect(() => { if (kam) return; keyin(() => setQ(x => (x + 1) % A2_SIKL.length), A2_SIKL[q].ms); }, [q]); // eslint-disable-line
  const k = A2_SIKL[q].k;
  return (
    <div className="jp-nat">
      <JamoaTelefon holat="jonli" ekran={k === 1 || k === 2 ? 'oyin' : 'oyinlar'} qoshildi={k === 2} anim={{ karta: true, son: true, otish: true }} bosTash={A2_SIKL[q].bos} className="jp-kir" />
      <div className="jp-gh jp-kir" style={{ '--d': '0.15s' }}>
        <span className="jp-gh-h"><b>maydon-jamoa</b></span>
        <span className="jp-gh-f">README.md</span>
        <span className="jp-gh-t">{tr({ uz: 'Talab', ru: 'Требование' })}</span>
        <WireframeSurat />
      </div>
    </div>
  );
};
const A1_YORDAM = [
  { uz: "Qayerda: `prototip/` papkasi — yangi React + Vite loyihasi; `README.md`.", ru: 'Где: папка `prototip/` — новый проект React + Vite; `README.md`.' },
  { uz: "Nima qilsin: `wireframe.jpg` dagi ekranlar — O'yinlar: o'yin kartalari, har birida kun, soat, maydon, «8 / 10», pastda «E'lon berish»; O'yin: «‹ O'yinlar», kun, soat, maydon, «8 / 10», qo'shilganlar (10 ta joy, ismsiz doiralar), «Qo'shilaman»;", ru: 'Что сделать: экраны из `wireframe.jpg` — O\'yinlar: карточки игр, в каждой день, время, поле, «8 / 10», внизу «E\'lon berish»; O\'yin: «‹ O\'yinlar», день, время, поле, «8 / 10», присоединившиеся (10 мест, кружки без имён), «Qo\'shilaman»;' },
  { uz: "E'lon berish: kun, soat, maydon, nechta odam, «Yuborish». Ma'lumot `prototip/src/namuna.js` da: 4 ta o'yin, Shanba va Yakshanba.", ru: 'E\'lon berish: день, время, поле, сколько человек, «Yuborish». Данные в `prototip/src/namuna.js`: 4 игры, суббота и воскресенье.' },
  { uz: "Ekranlar bir-biriga bosib o'tilsin: karta → O'yin, «E'lon berish» → E'lon berish, «Yuborish» → O'yinlar; «Qo'shilaman» sonni bittaga oshirsin. `README.md` ga shu talabni va `wireframe.jpg` suratini qo'sh.", ru: 'Пусть между экранами переходят нажатием: карточка → O\'yin, «E\'lon berish» → E\'lon berish, «Yuborish» → O\'yinlar; «Qo\'shilaman» увеличивает число на один. Добавь в `README.md` это требование и снимок `wireframe.jpg`.' },
  { uz: "Nima buzilmasin: haqiqiy ma'lumot va Backend yo'q — hammasi faqat ochiq sahifada. `prototip/` va `README.md` dan tashqariga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: нет настоящих данных и Backend — всё только на открытой странице. Не трогай ничего вне `prototip/` и `README.md`, назови изменённые файлы.' }
];
const A1_JOY = { ekranlar: { uz: '{ekranlar va ulardagi narsalar}', ru: '{экраны и что на них}' }, namuna: { uz: "{namuna ma'lumot}", ru: '{данные-образцы}' }, tugma: { uz: '{qaysi tugma qaysi ekranni ochadi}', ru: '{какая кнопка какой экран открывает}' } };
// Mustaqil ish yozuvidan (pm-m9d7-wireframe) ikki joy: ekran nomi + «nima turadi»; «asosiy tugma». Yozuv yo'q bo'lsa — hamma qavs bo'sh, faqat kulrang «masalan»
const a1Boshlang = () => {
  const w = wfOqi(); if (!w || !w.ekranlar.length) return {};
  const ekr = w.ekranlar.filter(e => e && e.nom).map(e => (e.nima ? `${e.nom} — ${e.nima}` : e.nom)).join('; ');
  const tug = w.ekranlar.map(e => e && e.tugma).filter(Boolean).join(', ');
  return { [tr(A1_JOY.ekranlar)]: ekr, [tr(A1_JOY.tugma)]: tug };
};
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z repo'ngiz", ru: 'Практика 1 · ваш репо' }}
    title={{ uz: <>Repo oching va ekranlaringizni <span className="italic" style={{ color: T.accent }}>bosiladigan qiling</span>.</>, ru: <>Откройте репо и сделайте свои экраны <span className="italic" style={{ color: T.accent }}>кликабельными</span>.</> }}
    mentor={{ uz: <>Hamma qadamni o'z mahsulotingiz bilan qilasiz, o'ngda — namuna; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Все шаги делаете со своим продуктом, справа — образец; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM.ochish, t: { uz: "GitHub'da o'ng yuqoridagi «+» ni bosing va «New repository» ni tanlang. «Repository name» — mahsulotingiz nomi, lotin harfida, bo'sh joysiz", ru: 'На GitHub нажмите «+» справа вверху и выберите «New repository». «Repository name» — название вашего продукта, латиницей, без пробелов' },
        bandlar: [
          { yon: { uz: 'masalan: maydon-jamoa', ru: 'например: maydon-jamoa' } },
          { uz: "Public; README qo'shishni yoqing; «Create repository». Nom band desa — oxiriga raqam qo'shing.", ru: 'Public; включите добавление README; «Create repository». Если имя занято — добавьте в конце цифру.' },
          { kul: { uz: "Repo ochiq — unga telefon raqami, manzil kabi shaxsiy ma'lumot yozmang.", ru: 'Репо открытый — не пишите в него личные данные вроде номера телефона и адреса.' } },
          { uz: "Terminalda: `git clone https://github.com/{login}/{repo}.git` · `cd {repo}` — papkani Antigravity'da oching.", ru: 'В терминале: `git clone https://github.com/{login}/{repo}.git` · `cd {repo}` — откройте папку в Antigravity.' },
          { uz: "Wireframe suratini telefoningizdan kompyuterga o'tkazing va repo papkasiga `wireframe.jpg` nomi bilan qo'ying. 5-darsda yozgan `PRD.md` ni ham shu papkaga ko'chiring.", ru: 'Перенесите снимок wireframe с телефона на компьютер и положите в папку репо под именем `wireframe.jpg`. `PRD.md` из 5-го урока тоже скопируйте в эту папку.' }
        ] },
      { h: QADAM.prompt, kul: { uz: "Prototip brauzerda quriladi; telefon ko'rinishi — kichik ekranda tekshirish uchun, final platforma hali tanlanmagan.", ru: 'Прототип собирается в браузере; вид телефона — чтобы проверить на маленьком экране, итоговая платформа ещё не выбрана.' },
        t: { uz: "qavslar mustaqil ishdagi yozuvingizdan to'ldirilgan; tekshiring, bo'sh qavsni yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'скобки заполнены из вашей самостоятельной работы; проверьте, заполните пустую скобку, нажмите «Скопировать» и отправьте в Antigravity:' },
        prompt: [
          { uz: 'Qayerda: `prototip/` papkasi — yangi React + Vite loyihasi; `README.md`.', ru: 'Где: папка `prototip/` — новый проект React + Vite; `README.md`.' },
          { uz: "Nima qilsin: `wireframe.jpg` dagi ekranlar — {ekranlar va ulardagi narsalar}. Ma'lumot `prototip/src/namuna.js` da: {namuna ma'lumot}.", ru: 'Что сделать: экраны из `wireframe.jpg` — {экраны и что на них}. Данные в `prototip/src/namuna.js`: {данные-образцы}.' },
          { uz: "Ekranlar bir-biriga bosib o'tilsin: {qaysi tugma qaysi ekranni ochadi}. `README.md` ga shu talabni va `wireframe.jpg` suratini qo'sh.", ru: 'Пусть между экранами переходят нажатием: {какая кнопка какой экран открывает}. Добавь в `README.md` это требование и снимок `wireframe.jpg`.' },
          { uz: "Nima buzilmasin: haqiqiy ma'lumot va Backend yo'q — hammasi faqat ochiq sahifada. `prototip/` va `README.md` dan tashqariga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: нет настоящих данных и Backend — всё только на открытой странице. Не трогай ничего вне `prototip/` и `README.md`, назови изменённые файлы.' }
        ],
        namuna: [
          { joy: A1_JOY.ekranlar, n: { uz: "masalan: O'yinlar — o'yin kartalari: kun, soat, maydon, «8 / 10»; O'yin — qo'shilganlar, «Qo'shilaman»; E'lon berish — forma", ru: 'например: O\'yinlar — карточки игр: день, время, поле, «8 / 10»; O\'yin — присоединившиеся, «Qo\'shilaman»; E\'lon berish — форма' } },
          { joy: A1_JOY.namuna, n: { uz: "masalan: 4 ta o'yin, Shanba va Yakshanba", ru: 'например: 4 игры, суббота и воскресенье' } },
          { joy: A1_JOY.tugma, n: { uz: "masalan: karta → O'yin, «E'lon berish» → forma; «Qo'shilaman» sonni bittaga oshirsin", ru: 'например: карточка → O\'yin, «E\'lon berish» → форма; «Qo\'shilaman» увеличивает число на один' } }
        ],
        boshlang: a1Boshlang,
        yordam: A1_YORDAM },
      { h: QADAM.ishga, t: { uz: "terminalda `cd prototip`, `npm install`, `npm run dev` — xato yo'q. Brauzerda terminal ko'rsatgan manzilni oching (odatda `localhost:5173`).", ru: 'в терминале `cd prototip`, `npm install`, `npm run dev` — ошибок нет. Откройте в браузере адрес, который показал терминал (обычно `localhost:5173`).' }, err: XATO_GAP },
      { h: QADAM.tekshirish, t: { uz: 'telefon ko\'rinishi: F12, keyin Ctrl+Shift+M (Mac: Cmd+Option+I, keyin Cmd+Shift+M). Talabning har qatorini tekshiring:', ru: 'вид телефона: F12, затем Ctrl+Shift+M (Mac: Cmd+Option+I, затем Cmd+Shift+M). Проверьте каждую строку требования:' },
        bandlar: [
          { uz: "qayerda — repo'da `prototip/` papkasi bor, `README.md` da talab va surat", ru: 'где — в репо есть папка `prototip/`, в `README.md` требование и снимок' },
          { uz: 'nima qilsin — har tugma kerakli ekranni ochadi, ekranlar wireframe suratingizdagidek', ru: 'что сделать — каждая кнопка открывает нужный экран, экраны как на вашем снимке wireframe' },
          { uz: "nima buzilmasin — `backend/` papkasi yo'q, sahifa yangilansa namuna boshidan ochiladi.", ru: 'что не сломать — папки `backend/` нет, после обновления страницы образец открывается с начала.' },
          { uz: "Farq bo'lsa, agentga: «{nima} wireframe'dagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Если есть отличие, агенту: «{что} не как в wireframe: {каким должно быть}. Больше ничего не трогай, назови изменённые файлы.»' }
        ] }
    ]}
    natija={<A1Natija />}
    ortda={{ uz: "Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-07-done`, keyin `prototip/` da `npm install`, `npm run dev`. Qanday ishlashini ko'rasiz va o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.", ru: 'Отстали — откройте пример Ментора в отдельной папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-07-done`, затем в `prototip/` — `npm install`, `npm run dev`. Увидите, как это работает, и повторите шаг в своём репо по образцу.' }}
    doneText={{ uz: 'Repo ochildi, ekranlar bosiladi va wireframe bilan bir xil.', ru: 'Репо открыт, экраны нажимаются и совпадают с wireframe.' }} />
);
const A2_JOY = { bos: { uz: '{bosiladigan karta yoki tugma}', ru: '{нажимаемая карточка или кнопка}' }, son: { uz: "{o'zgaradigan son yoki yozuv}", ru: '{меняющееся число или надпись}' } };
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · jonli prototip', ru: 'Практика 2 · живой прототип' }}
    title={{ uz: <>Prototipingizga <span className="italic" style={{ color: T.accent }}>uch animatsiya</span> qo'shing.</>, ru: <>Добавьте в свой прототип <span className="italic" style={{ color: T.accent }}>три анимации</span>.</> }}
    mentor={{ uz: <>Animatsiyani agent yozadi, talabni siz berasiz — <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Анимацию пишет агент, требование даёте вы — начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM.ochish, t: { uz: '`prototip/` ishlab tursin (`npm run dev`), brauzerda telefon ko\'rinishi ochiq.', ru: 'пусть `prototip/` работает (`npm run dev`), в браузере открыт вид телефона.' } },
      { h: QADAM.prompt, t: { uz: "qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки, нажмите «Скопировать» и отправьте в Antigravity:' },
        prompt: [
          { uz: 'Qayerda: `prototip/` — `motion` paketini o\'rnat.', ru: 'Где: `prototip/` — установи пакет `motion`.' },
          { uz: "Nima qilsin: {bosiladigan karta yoki tugma} bosilganda kichrayib qaytsin — `transform` va `transition`, 0,15 soniya. {o'zgaradigan son yoki yozuv} o'zgarganda bir lahza kattalashib, 0,3 soniyada silliq qaytsin.", ru: 'Что сделать: пусть {нажимаемая карточка или кнопка} при нажатии сжимается и возвращается — `transform` и `transition`, 0,15 секунды. Пусть {меняющееся число или надпись} при изменении на миг увеличивается и за 0,3 секунды плавно возвращается.' },
          { uz: 'Ekrandan ekranga o\'tish Motion bilan silliq bo\'lsin — 0,3 soniya.', ru: 'Пусть переход с экрана на экран будет плавным через Motion — 0,3 секунды.' },
          { uz: "Nima buzilmasin: ekranlar, namuna ma'lumot va bosish yo'llari o'zgarmasin; qurilmada harakat kamaytirilgan bo'lsa, kichrayish va surilish bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: экраны, данные-образцы и пути нажатий не меняются; если на устройстве уменьшено движение — без сжатия и сдвига. Больше ничего не трогай, назови изменённые файлы.' }
        ],
        namuna: [
          { joy: A2_JOY.bos, n: { uz: "masalan: o'yin kartasi", ru: 'например: карточка игры' } },
          { joy: A2_JOY.son, n: { uz: 'masalan: «8 / 10» dagi son', ru: 'например: число в «8 / 10»' } }
        ],
        yordam: [
          { uz: 'Qayerda: `prototip/` — `motion` paketini o\'rnat.', ru: 'Где: `prototip/` — установи пакет `motion`.' },
          { uz: "Nima qilsin: o'yin kartasi bosilganda kichrayib qaytsin — `transform` va `transition`, 0,15 soniya. «8 / 10» dagi son o'zgarganda bir lahza kattalashib, 0,3 soniyada silliq qaytsin.", ru: 'Что сделать: пусть карточка игры при нажатии сжимается и возвращается — `transform` и `transition`, 0,15 секунды. Пусть число в «8 / 10» при изменении на миг увеличивается и за 0,3 секунды плавно возвращается.' },
          { uz: 'Ekrandan ekranga o\'tish Motion bilan silliq bo\'lsin — 0,3 soniya.', ru: 'Пусть переход с экрана на экран будет плавным через Motion — 0,3 секунды.' },
          { uz: "Nima buzilmasin: ekranlar, namuna ma'lumot va bosish yo'llari o'zgarmasin; qurilmada harakat kamaytirilgan bo'lsa, kichrayish va surilish bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: экраны, данные-образцы и пути нажатий не меняются; если на устройстве уменьшено движение — без сжатия и сдвига. Больше ничего не трогай, назови изменённые файлы.' }
        ] },
      { h: QADAM.ishga, t: { uz: "sahifa o'zi yangilandi, terminalda xato yo'q.", ru: 'страница обновилась сама, в терминале нет ошибок.' }, err: XATO_GAP },
      { h: QADAM.tekshirish, t: { uz: "talabning har qatori: bosiladigan joy kichrayib qaytadimi · son yoki yozuv kattalashib qaytadimi · ekranlar silliq almashadimi · ekranlar va bosish yo'llari o'sha-o'shami.", ru: 'каждая строка требования: сжимается ли и возвращается нажимаемое место · увеличивается ли и возвращается число или надпись · плавно ли сменяются экраны · те же ли экраны и пути нажатий.' },
        bandlar: [
          { uz: "Hammasi mos bo'lsa — GitHub'ga: repo papkasida `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni qo'shing:", ru: 'Если всё совпадает — на GitHub: в папке репо `git status` — изменённые файлы совпадают со списком агента; добавьте их:' },
          { uz: '`git add README.md PRD.md wireframe.jpg prototip`, `git commit -m "jonli prototip"`, `git push`. GitHub\'da repo sahifasini yangilang — README\'da talab va wireframe surati ko\'rinadi.', ru: '`git add README.md PRD.md wireframe.jpg prototip`, `git commit -m "jonli prototip"`, `git push`. Обновите страницу репо на GitHub — в README видны требование и снимок wireframe.' }
        ],
        err: { uz: '`git push` xato bersa: «Shu xato chiqdi: {xato}. Tuzat.»', ru: 'Если `git push` выдаст ошибку: «Вышла такая ошибка: {ошибка}. Исправь.»' } }
    ]}
    natija={<A2Natija />}
    doneText={{ uz: "Prototip jonli: karta, son va ekranlar bosishga javob beradi; README'da talab va surat.", ru: 'Прототип живой: карточка, число и экраны отвечают на нажатие; в README требование и снимок.' }} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran (SABOQ 12, 16): Mentor yo'q; birinchi bosishgacha karta yuzi halqada, ostida «Kartani bosing — javob ochiladi»
const KARTALAR = [
  { front: { uz: 'Wireframe nima?', ru: 'Что такое wireframe?' }, back: { uz: "Ekranning qog'ozdagi sodda chizmasi", ru: 'Простой рисунок экрана на бумаге' }, note: { uz: 'Qayerda nima turadi', ru: 'Что где стоит' } },
  { front: { uz: "Wireframe'ga nima chizilmaydi?", ru: 'Что не рисуют в wireframe?' }, back: { uz: 'Rang, shrift va logotip', ru: 'Цвет, шрифт и логотип' }, note: { uz: "Ular wireframe'dan keyin tanlanadi", ru: 'Их выбирают после wireframe' } },
  { front: { uz: "Bu misolda o'yin e'loni funksiyasi qaysi ekranlarga bo'lindi?", ru: 'На какие экраны в этом примере разошлась функция объявления игры?' }, back: { uz: "O'yinlar, O'yin va E'lon berish", ru: 'Игры, Игра и Объявить игру' }, note: { uz: "Har gap — o'zi bajariladigan ekranda", ru: 'Каждая фраза — на том экране, где её выполняют' } },
  { front: { uz: 'Prototip nima?', ru: 'Что такое прототип?' }, back: { uz: "Bosiladigan, lekin hali haqiqiy ma'lumotsiz ekranlar", ru: 'Кликабельные, но пока без настоящих данных экраны' }, note: { uz: "Ma'lumot — `namuna.js` da", ru: 'Данные — в `namuna.js`' } },
  { front: { uz: 'Prototipda sahifa yangilansa, «9 / 10» nima bo\'ladi?', ru: 'Что станет с «9 / 10» после обновления страницы в прототипе?' }, back: { uz: '«8 / 10» ga qaytadi', ru: 'Вернётся к «8 / 10»' }, note: { uz: "Bu prototip ma'lumotni saqlamaydi", ru: 'Этот прототип не сохраняет данные' } },
  { front: { uz: 'Talab qaysi uch qatordan iborat?', ru: 'Из каких трёх строк состоит требование?' }, back: { uz: 'Qayerda · nima qilsin · nima buzilmasin', ru: 'Где · что сделать · что не сломать' }, note: { uz: 'Wireframe surati — talabga ilova', ru: 'Снимок wireframe — приложение к требованию' } },
  { front: { uz: 'Bu darsda «nima buzilmasin» qatoriga nima yoziladi?', ru: 'Что на этом уроке пишут в строку «что не сломать»?' }, back: { uz: "Haqiqiy ma'lumot va Backend yo'q", ru: 'Нет настоящих данных и Backend' }, note: { uz: "Prototip Backend'siz ishlaydi", ru: 'Прототип работает без Backend' } },
  { front: { uz: 'Agent «Tayyor!» degach nima qilasiz?', ru: 'Что делать, когда агент сказал «Готово!»?' }, back: { uz: 'Bosib, wireframe bilan solishtiraman', ru: 'Нажимаю и сравниваю с wireframe' }, note: { uz: 'Farqlar — bitta tuzatish talabida', ru: 'Отличия — одним требованием на исправление' } },
  { front: { uz: 'Bu kursda jonli prototip nima?', ru: 'Что в этом курсе называют живым прототипом?' }, back: { uz: 'Animatsiyasi bor prototip', ru: 'Прототип с анимацией' }, note: { uz: "Karta, son va ekranlar orasidagi o'tish", ru: 'Карточка, число и переход между экранами' } },
  { front: { uz: 'Son silliq kattalashib qaytishi uchun `.son` ga nima yoziladi?', ru: 'Что пишут в `.son`, чтобы число плавно увеличивалось и возвращалось?' }, back: { uz: '`transition: transform 0.3s;`', ru: '`transition: transform 0.3s;`' }, note: { uz: '`.son.yangi` da — `transform: scale(1.3)`', ru: 'в `.son.yangi` — `transform: scale(1.3)`' } },
  { front: { uz: 'Bu prototipda ekrandan ekranga silliq o\'tishni nima qiladi?', ru: 'Что в этом прототипе делает плавный переход между экранами?' }, back: { uz: 'Motion', ru: 'Motion' }, note: { uz: 'Paket `motion` — 9-Modulda tanishgansiz', ru: 'Пакет `motion` — знаком по 9-му модулю' } },
  { front: { uz: "GitHub'da yangi repo qayerdan ochiladi?", ru: 'Где на GitHub открывается новый репо?' }, back: { uz: '«+» → «New repository»', ru: '«+» → «New repository»' }, note: { uz: 'Keyin kompyuterga `git clone`', ru: 'Потом на компьютер — `git clone`' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  const kod = (s) => { const v = tr(s); return typeof v === 'string' ? v.replace(/`/g, '') : v; };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */}
        <div className={cxx('jp-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: kod(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="jp-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204): sarlavha va yuqori yorliq holatga qarab (P-046; 07-FILTR 36) · «Bugungi asosiy fikr» (P-013) · uyga vazifa (kim uchun · muddat + 3 band) =====
const YAKUN = {
  a2: { chip: { uz: 'Jonli prototip tayyor', ru: 'Живой прототип готов' }, s: { uz: <>Qog'ozdagi ekranlaringiz endi <span className="italic" style={{ color: T.accent }}>bosiladi va jonli</span>.</>, ru: <>Ваши бумажные экраны теперь <span className="italic" style={{ color: T.accent }}>нажимаются и живые</span>.</> } },
  a1: { chip: { uz: 'Prototip bosiladi', ru: 'Прототип нажимается' }, s: { uz: <>Bosiladigan prototipingiz tayyor — <span className="italic" style={{ color: T.accent }}>animatsiya uyda</span>.</>, ru: <>Ваш кликабельный прототип готов — <span className="italic" style={{ color: T.accent }}>анимация дома</span>.</> } },
  yoq: { chip: null, s: { uz: <>Prototip boshlandi — <span className="italic" style={{ color: T.accent }}>qolgan qadamlar uyda</span>.</>, ru: <>Прототип начат — <span className="italic" style={{ color: T.accent }}>остальные шаги дома</span>.</> } }
};
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z mahsulotingiz", ru: 'ваш продукт' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_BAND = [
  { b: { uz: 'Tugatish', ru: 'Завершить' }, t: { uz: "darsda ulgurmagan qadamlarni o'z repo'ngizda bajaring: ekranlar bosilsin, uch animatsiya ishlasin.", ru: 'выполните в своём репо шаги, на которые не хватило урока: экраны нажимаются, три анимации работают.' } },
  { b: { uz: 'README', ru: 'README' }, t: { uz: "`README.md` da talab va wireframe surati tursin, GitHub'ga yuborilgan bo'lsin.", ru: 'в `README.md` есть требование и снимок wireframe, и всё отправлено на GitHub.' } },
  { b: { uz: 'Tekshirish', ru: 'Проверка' }, t: { uz: "prototipni telefon ko'rinishida bosib chiqing: wireframe'dagi har tugma kerakli ekranni ochadimi?", ru: 'пройдите прототип в виде телефона: открывает ли каждая кнопка из wireframe нужный экран?' } }
];
const HwCard = ({ keyingi }) => (
  <div className="card jp-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div>
    <div className="jp-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="jp-hw-q"><span className="jp-hw-k">{tr(r.k)}</span><span className="jp-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="jp-hw-band">{HW_BAND.map((h, i) => <li key={i}><i>{i + 1}</i><span><b>{tr(h.b)}</b> — {tx(h.t)}</span></li>)}</ol>
    {keyingi && <p className="jp-hw-keyingi">{keyingi}</p>}
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
  const bajarildi = (id) => { const i = SCREEN_META.findIndex(m => m.id === id); return !!(answers[i] && answers[i].solved); };
  const holat = bajarildi('a2') ? 'a2' : bajarildi('a1') ? 'a1' : 'yoq';
  const Y = YAKUN[holat];
  const RECAP = [
    { uz: "Wireframe — ekranning qog'ozdagi sodda chizmasi: qayerda nima turadi.", ru: 'Wireframe — простой рисунок экрана на бумаге: что где стоит.' },
    { uz: 'Talab uch qatordan iborat: qayerda, nima qilsin, nima buzilmasin; wireframe surati unga ilova.', ru: 'Требование состоит из трёх строк: где, что сделать, что не сломать; снимок wireframe — приложение к нему.' },
    { uz: "Bu prototip bosiladi, lekin ma'lumotni saqlamaydi: ma'lumot namuna, Backend yo'q.", ru: 'Этот прототип нажимается, но данные не сохраняет: данные — образец, Backend нет.' },
    { uz: 'Agent qurganini wireframe bilan solishtirib, farqlarni bitta tuzatish talabida yuborasiz.', ru: 'Вы сравниваете собранное агентом с wireframe и отправляете отличия одним требованием на исправление.' },
    { uz: "Uch animatsiya prototipni jonli qiladi: karta, son va ekranlar orasidagi o'tish.", ru: 'Три анимации делают прототип живым: карточка, число и переход между экранами.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Arxitektura va platforma: web yoki mobil ilova»</b>: prototip tayyor, endi uning ortida qanday qismlar turishi va qaysi platforma kerakligi navbati.</>, ru: <>Следующий урок — <b>«Архитектура и платформа: веб или мобильное приложение»</b>: прототип готов, теперь очередь того, какие части стоят за ним и какая платформа нужна.</> });
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      {/* Yuqori yorliq: A2 — «✓ Jonli prototip tayyor», A1 — «✓ Prototip bosiladi», A1 yo'q — yorliqsiz (MD 19) */}
      <div className={cxx('jp-yakun', !Y.chip && 'belgisiz')}>
        <QYakun til={__lang}
          chip={Y.chip ? tr(Y.chip) : ''}
          togri={correct} jami={total}
          sarlavha={tr(Y.s)}
          cta={<>
            <div className="jp-fikr fade-up d1"><span className="jp-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><p className="jp-fikr-t small">{tr({ uz: "Qog'ozdagi wireframe ekranni agentga aniq ko'rsatadi; namuna ma'lumot va animatsiya uni Backend'siz bosiladigan, jonli prototipga aylantiradi.", ru: 'Бумажный wireframe точно показывает агенту экран; данные-образцы и анимация превращают его в кликабельный живой прототип без Backend.' })}</p></div>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard keyingi={keyingi} />}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function LivePrototypeLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, ScreenA1, ScreenA2, ScreenPodium, ScreenFlashcards, SummaryScreen];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
/* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&family=Comic+Neue:wght@400;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }
        ${qolipCss(T)}
        /* === DARSNING O'Z VIZUALI — «Maydon Jamoa» telefoni va sahnalar (jt- telefon, jp- dars). Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        /* Halqa (SABOQ 32): kattalashish 1.03, shaffoflik 0.35, sikl 2.4 s; guruhda bitta halqa */
        .jp-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .jp-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: jp-tolqin 2.4s ease-in-out 0.4s infinite; }
        .jp-guruh { position: relative; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 12px; }
        .jp-guruh::after { content: ''; position: absolute; inset: -9px; border-radius: 16px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: jp-tolqin 2.4s ease-in-out 0.5s infinite; }
        @keyframes jp-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        .jp-bashorat-k .q-bashorat { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: jp-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both; }
        .jp-bashorat-k .q-chip { animation: jp-kot 0.4s ease-out 0.15s both; } .jp-bashorat-k .q-chip:nth-child(2) { animation-delay: 0.27s; }
        @keyframes jp-kot { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        p.jp-taxmin-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 10px; font-size: 13.5px; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 9px 14px; }
        p.jp-taxmin-ix > span { font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        p.jp-nom { font-size: 14.5px; line-height: 1.5; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 14px; }
        p.jp-nom b { color: ${T.accent}; }

        /* Telefon ramkasi (191): o'lchami barqaror 172×272 (SABOQ 22) */
        .jt-ust { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: none; }
        .jt-tel { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 5px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; text-align: left; font-family: 'Manrope', sans-serif; color: ${T.ink}; }
        .jt-tel.ixcham { width: 140px; height: 190px; border-width: 1.5px; border-radius: 16px; padding: 7px; box-shadow: none; }
        .jt-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; }
        .jt-nom { font-weight: 800; font-size: 12.5px; letter-spacing: 0.01em; }
        .jt-ekranlar { position: relative; flex: 1; min-height: 0; overflow: hidden; }
        .jt-ekran { height: 100%; display: flex; flex-direction: column; }
        .jt-ekran.chiq { position: absolute; inset: 0; pointer-events: none; }
        .jt-ekran.kir-ong { animation: jt-kir-ong 0.3s ease-out both; } .jt-ekran.kir-chap { animation: jt-kir-chap 0.3s ease-out both; }
        .jt-ekran.chiq-chap { animation: jt-chiq-chap 0.3s ease-in both; } .jt-ekran.chiq-ong { animation: jt-chiq-ong 0.3s ease-in both; }
        @keyframes jt-kir-ong { from { transform: translateX(100%); } to { transform: none; } }
        @keyframes jt-kir-chap { from { transform: translateX(-100%); } to { transform: none; } }
        @keyframes jt-chiq-chap { from { transform: none; } to { transform: translateX(-100%); } }
        @keyframes jt-chiq-ong { from { transform: none; } to { transform: translateX(100%); } }
        .jt-ichi { display: flex; flex-direction: column; gap: 5px; min-height: 0; height: 100%; }
        .jt-oyinlar, .jt-oyin, .jt-elon-e { justify-content: flex-start; }
        .jt-oyinlar { gap: 4px; }
        .jt-tel.uzun .jt-ekranlar { mask-image: linear-gradient(to bottom, #000 82%, transparent); -webkit-mask-image: linear-gradient(to bottom, #000 82%, transparent); }
        .jp-sahna.s8 { align-items: start; }
        .jp-s8-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .jp-s8-ong .jp-daraxt { align-self: flex-start; }
        .jt-b.jt-tugma { text-align: center; }
        .jt-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .jt-karta { display: flex; align-items: center; justify-content: space-between; gap: 6px; width: 100%; text-align: left; font: inherit; color: inherit; border: 1px solid ${T.line}; border-radius: 10px; padding: 4px 8px; background: ${T.bg}; cursor: default; animation: jp-kir 0.35s ease-out var(--d, 0s) both; }
        button.jt-karta { cursor: pointer; }
        .jt-tel.a-karta .jt-karta { transition: transform 0.15s; }
        .jt-karta.bos { transform: scale(0.95); }
        .jt-k-t { display: flex; flex-direction: column; min-width: 0; font-size: 12px; line-height: 1.3; }
        .jt-k-t b { font-size: 12px; } .jt-k-t span { font-size: 11px; color: ${T.ink2}; }
        @media (max-width: 560px) { .jt-k-t, .jt-k-t > * { white-space: nowrap; } .jt-k-t b { font-size: 11px; } } /* 393: «Sh 18:00» bir qatorda (F-1007-289) */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } } /* 393: ⛶ maket sarlavhasini yopmasin — PM darslardagi qoida (F-1007-289) */
        .jt-k-ikki { display: flex; flex-direction: column; gap: 1px; width: 100%; min-width: 0; }
        .jt-k-ikki > b { font-size: 12px; white-space: nowrap; }
        .jt-k-r { display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 11px; color: ${T.ink2}; }
        .jt-k-r .jt-k-son { color: ${T.ink}; font-size: 11.5px; }
        .jt-k-son { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; white-space: nowrap; }
        .jt-elon, .jt-qoshil, .jt-yubor { margin-top: auto; width: 100%; font: inherit; font-weight: 800; font-size: 12px; text-align: center; border: 0; border-radius: 9px; padding: 6px 8px; background: ${JAMOA_RANG}; color: ${T.paper}; cursor: pointer; }
        .jt-qoshil.off { background: ${T.line}; color: ${T.ink2}; cursor: default; }
        .jt-tugma { display: block; }
        .jt-orqaga { align-self: flex-start; font: inherit; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: none; border: 0; padding: 2px 4px; border-radius: 6px; cursor: pointer; }
        span.jt-orqaga, span.jt-b.jt-orqaga { cursor: default; }
        .jt-y-sar { display: flex; flex-direction: column; font-size: 13px; line-height: 1.3; } .jt-y-sar span { font-size: 11px; color: ${T.ink2}; }
        .jt-y-son { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; }
        .jt-son { display: inline-block; transform-origin: center; }
        .jt-tel.a-son .jt-son { transition: transform 0.3s; }
        .jt-son.pop { transform: scale(1.3); color: ${T.accent}; }
        .jt-doiralar { display: grid; grid-template-columns: repeat(5, 14px); gap: 6px 7px; margin: 2px 0 4px; }
        .jt-doiralar i { position: relative; width: 14px; height: 14px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .jt-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.38)}; }
        .jt-doiralar i.yangi { background: ${T.accent}; animation: jp-pop 0.45s cubic-bezier(.3,1.5,.5,1); }
        .jt-doiralar i small { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: ${T.accent}; white-space: nowrap; }
        @keyframes jp-pop { 0% { transform: scale(0.4); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .jt-maydon { display: block; font-size: 11.5px; color: ${T.ink2}; border: 1px solid ${T.line}; border-radius: 7px; padding: 5px 7px; background: ${T.bg}; }
        .jt-agent { gap: 4px; }
        .jt-a-forma { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding-bottom: 4px; border-bottom: 1px dashed ${T.line}; }
        .jt-a-forma .jt-yubor { grid-column: 1 / -1; margin-top: 0; padding: 4px; }
        .jt-agent .jt-karta { padding: 4px 6px; flex: none; }
        .jt-agent .jt-maydon { font-size: 11px; padding: 3px 6px; white-space: nowrap; overflow: hidden; }
        .jt-a-k { display: flex; flex-direction: column; gap: 2px; width: 100%; }
        .jt-a-r { display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 11.5px; }
        .jt-a-joy { font-size: 11px; color: ${T.ink2}; }
        .jt-a-qosh { flex: none; font-size: 11px; font-weight: 800; color: ${T.paper}; background: ${JAMOA_RANG}; border-radius: 7px; padding: 2px 6px; }
        .jt-chat { gap: 6px; }
        .jt-pufak { align-self: flex-start; font-size: 11.5px; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 10px 10px 10px 3px; padding: 5px 8px; }
        .jt-pufak.siz { align-self: flex-end; background: ${T.accentSoft}; border-radius: 10px 10px 3px 10px; }
        .jt-joy { display: inline-block; min-width: 38px; min-height: 16px; border: 1.5px dashed ${T.err}; border-radius: 6px; background: ${T.errFon}; }
        .jt-y-doira.jt-joy, .jt-maydon.jt-joy { display: block; min-height: 26px; }
        .jt-b { text-align: left; }
        :where(button.jt-b) { font: inherit; color: inherit; background: transparent; border: 1px solid transparent; border-radius: 7px; cursor: pointer; padding: 1px 3px; }
        button.jt-b:hover { border-color: ${T.ink2}; }
        .jt-b.b-qizil { outline: 2px solid ${T.err}; outline-offset: 1px; border-radius: 7px; background: ${T.errFon}; }
        .jt-b.b-yashil { outline: 2px solid ${T.ok}; outline-offset: 1px; border-radius: 7px; background: ${T.okFon}; transition: outline-color 0.4s, background 0.4s; }
        .jt-b.b-keldi { animation: jp-keldi 1.2s ease-out both; border-radius: 7px; }
        @keyframes jp-keldi { 0% { opacity: 0; transform: scale(0.85); background: ${T.okFon}; } 30% { opacity: 1; transform: none; background: ${T.okFon}; } 100% { background: transparent; } }
        .jt-silk { animation: jp-silk 0.4s ease-in-out; }
        @keyframes jp-silk { 0%, 100% { transform: none; } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .jt-oqar { position: absolute; inset: 0; background: ${T.paper}; animation: jt-oqar 0.42s ease-out both; pointer-events: none; }
        @keyframes jt-oqar { 0% { opacity: 0; } 40% { opacity: 1; } 100% { opacity: 0; } }
        .jt-brauzer { display: flex; align-items: center; gap: 5px; width: 172px; padding: 5px 8px; border: 1px solid ${T.line}; border-radius: 10px; background: ${T.paper}; }
        .jt-brauzer i { width: 7px; height: 7px; border-radius: 50%; background: ${T.line}; }
        .jt-yangila { margin-left: auto; font: inherit; font-size: 12px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border: 0; border-radius: 8px; padding: 4px 9px; cursor: pointer; }
        .jt-yangila:disabled { opacity: 0.45; cursor: not-allowed; }
        .jt-yoq { opacity: 1; }
        /* Ixcham ekran (solishtirish, qog'ozdagi ramkalar): kartalar bir qatorda, shrift 11 px dan kichik emas */
        .jt-tel.ixcham .jt-ichi { gap: 4px; }
        .jt-tel.ixcham .jt-sar { font-size: 12.5px; }
        .jt-tel.ixcham .jt-karta { padding: 3px 5px; border-radius: 7px; }
        .jt-tel.ixcham .jt-k-t, .jt-tel.ixcham .jt-k-son { font-size: 11px; }
        .jt-tel.ixcham .jt-elon, .jt-tel.ixcham .jt-qoshil, .jt-tel.ixcham .jt-yubor { font-size: 11px; padding: 4px 6px; border-radius: 7px; }
        .jt-tel.ixcham .jt-maydon { font-size: 11px; padding: 3px 6px; }
        .jt-tel.ixcham .jt-y-son { font-size: 16px; }
        .jt-tel.ixcham .jt-doiralar { grid-template-columns: repeat(5, 11px); gap: 4px 6px; }
        .jt-tel.ixcham .jt-doiralar i { width: 11px; height: 11px; }
        /* Qog'oz holati: qalam chizig'i, rangsiz, qo'lyozma (tizim shrifti — tashqi shrift yuklanmaydi) */
        .jt-tel.qogoz { background: transparent; border: 1.8px solid ${fon(T.ink2, 0.75)}; border-radius: 22px 26px 24px 20px / 26px 22px 24px 20px; box-shadow: none; font-family: 'Segoe Print', 'Ink Free', 'Bradley Hand', 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive; color: ${T.ink2}; }
        .jt-tel.qogoz.ixcham { border-radius: 14px 17px 15px 13px / 17px 14px 16px 13px; }
        .jt-tel.qogoz .jt-sar, .jt-tel.qogoz .jt-y-sar, .jt-tel.qogoz .jt-y-son, .jt-tel.qogoz .jt-k-son, .jt-tel.qogoz .jt-orqaga { color: ${T.ink2}; font-weight: 700; }
        .jt-tel.qogoz .jt-karta, .jt-tel.qogoz .jt-maydon { background: transparent; border: 1.3px solid ${fon(T.ink2, 0.8)}; border-radius: 6px 9px 7px 8px / 8px 6px 9px 7px; }
        .jt-tel.qogoz .jt-elon, .jt-tel.qogoz .jt-qoshil, .jt-tel.qogoz .jt-yubor { background: transparent; color: ${T.ink2}; border: 1.5px solid ${fon(T.ink2, 0.85)}; border-radius: 8px 6px 9px 7px; }
        .jt-tel.qogoz .jt-doiralar i { border: 1.4px solid ${fon(T.ink2, 0.7)}; }
        .jt-tel.qogoz .jt-doiralar i.bor { background: ${fon(T.ink2, 0.3)}; }
        .jt-tel.qogoz .jt-b, .jt-tel.qogoz .jt-karta { animation: jp-chiz 0.6s ease-out both; }
        .jp-chiz { animation: jp-chiz 0.6s ease-out both; }
        @keyframes jp-chiz { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        .jp-kir { animation: jp-kir 0.4s ease-out var(--d, 0s) both; }
        @keyframes jp-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        /* Qog'oz varag'i */
        .jp-qogoz { position: relative; background-color: ${T.paper}; background-image: linear-gradient(${fon(T.line, 0.55)} 1px, transparent 1px), linear-gradient(90deg, ${fon(T.line, 0.55)} 1px, transparent 1px); background-size: 22px 22px; border: 1px solid ${T.line}; border-radius: 14px; padding: 14px; transition: background-color 0.6s; }
        .jp-qogoz.toza { background-image: none; background-color: ${T.bg}; }
        .jp-hisob { align-self: flex-end; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; } .jp-hisob b { color: ${T.accent}; }
        .jp-qogoz > .jp-hisob { position: absolute; top: 10px; left: 14px; }
        /* 0-ekran */
        .jp-kirish { display: grid; grid-template-columns: 172px minmax(0, 1fr); gap: 14px; align-items: start; }
        .jp-chat { display: flex; flex-direction: column; gap: 8px; }
        p.jp-pf { font-size: 13px; line-height: 1.45; padding: 8px 11px; border-radius: 12px; max-width: 100%; }
        p.jp-pf.siz { align-self: flex-end; background: ${T.accentSoft}; color: ${T.ink}; border-radius: 12px 12px 3px 12px; }
        p.jp-pf.ag { align-self: flex-start; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px 12px 12px 3px; display: flex; flex-direction: column; gap: 2px; }
        .jp-pf-kim { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        p.jp-kul { font-size: 12.5px; color: ${T.ink2}; background: ${T.bg}; border: 1px dashed ${T.line}; border-radius: 10px; padding: 7px 10px; }
        /* 1-ekran */
        .jp-reja-q { display: flex; justify-content: center; align-items: center; flex: 1; min-height: 300px; }
        p.jp-reja-past { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        p.jp-reja-past code { color: ${T.ink}; font-weight: 700; }
        /* Uchish */
        .jp-box { position: relative; }
        .jp-uchar { position: absolute; z-index: 30; max-width: 220px; transform: translate(-50%, -50%); font-size: 12px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; border: 1px solid ${T.accent}; border-radius: 10px; padding: 5px 9px; pointer-events: none; animation: jp-uch 0.66s cubic-bezier(.5,0,.5,1) both; }
        @keyframes jp-uch { 0% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3); opacity: 0.2; } }
        /* 2-ekran */
        .jp-funk-k { gap: 10px; }
        .jp-funk-n { font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .jp-gaplar { display: flex; flex-direction: column; gap: 8px; }
        .jp-gap { font: inherit; font-size: 13.5px; text-align: left; line-height: 1.4; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 11px; padding: 9px 12px; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
        .jp-gap:hover { border-color: ${T.accent}; }
        .jp-gap.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .jp-gap-ok { font-size: 13px; color: ${T.ok}; background: ${T.okFon}; border-radius: 11px; padding: 7px 12px; }
        .jp-s2 { padding-top: 30px; }
        .jp-ramkalar { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; justify-items: center; padding-bottom: 18px; }
        .jp-ramka-w { position: relative; display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .jp-ramka-n { font-size: 12px; font-weight: 800; color: ${T.ink2}; }
        .jp-ramka { padding: 0; background: none; border: 0; border-radius: 18px; cursor: pointer; }
        .jp-ramka:disabled { cursor: default; }
        .jp-ramka.tanla .jt-tel { border-color: ${T.accent}; }
        .jp-strelka { font-family: 'Segoe Print', 'Comic Sans MS', 'Comic Neue', cursive; font-size: 18px; color: ${T.ink2}; }
        .jp-strelka-o { position: absolute; left: calc(16.67% + 64px); right: calc(50% + 72px); top: 42%; height: 0; border-top: 1.6px solid ${fon(T.ink2, 0.75)}; animation: jp-chiz 0.6s ease-out both; }
        .jp-strelka-o::after { content: ''; position: absolute; right: -2px; top: -6px; border: 5px solid transparent; border-left: 8px solid ${fon(T.ink2, 0.75)}; }
        .jp-strelka-ost { position: absolute; left: 16.6%; right: 16.6%; bottom: 2px; height: 16px; border: 1.6px solid ${fon(T.ink2, 0.75)}; border-top: 0; border-radius: 0 0 16px 16px; animation: jp-chiz 0.8s ease-out 0.2s both; }
        .jp-strelka-ost::after { content: ''; position: absolute; right: -6px; top: -6px; border: 6px solid transparent; border-bottom: 8px solid ${fon(T.ink2, 0.75)}; }
        /* 3-ekran */
                .jp-bolak-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        .jp-bolak-t { font-size: 16px; line-height: 1.4; color: ${T.ink}; }
        .jp-s3 { display: grid; grid-template-columns: auto minmax(170px, 230px); justify-content: center; align-items: stretch; gap: 22px; padding-top: 26px; }
        .jp-s3-q { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .jp-s3-q .jp-strelka-t { min-width: 64px; }
        .jp-s3 .jp-tashqari { flex-direction: column; align-items: stretch; align-content: flex-start; }
        .jp-bolak-k { flex-direction: row !important; flex-wrap: wrap; align-items: center; gap: 10px 16px !important; }
        .jp-bolak-k .jp-bolak-t { flex: 1 1 260px; }
        .jp-strelka-t { font-family: 'Segoe Print', 'Comic Sans MS', 'Comic Neue', cursive; font-size: 14px; font-weight: 700; color: ${T.ink2}; }
        .jp-tashqari { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-height: 42px; border: 1.5px dashed ${T.line}; border-radius: 12px; padding: 8px 12px; background: ${T.bg}; }
        .jp-tashqari-l { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .jp-tushdi { font-size: 12.5px; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 9px; padding: 4px 9px; animation: jp-tush 0.45s cubic-bezier(.3,1.4,.5,1) both; }
        @keyframes jp-tush { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: none; } }
        /* 5-ekran — mustaqil ish */
        .jp-wf-ust { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px; }
        .jp-wf-funk { display: flex; flex-direction: column; gap: 6px; min-width: 0; flex: 1; }
        .jp-wf-m { display: flex; flex-direction: column; gap: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .jp-wf-m input { font: inherit; font-weight: 500; font-size: 14px; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 9px 12px; width: 100%; }
        .jp-wf-m input:focus { outline: none; border-color: ${T.accent}; }
        .jp-taymer { display: flex; align-items: center; gap: 10px; }
        .jp-taymer-s { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: ${T.ink}; }
        .jp-taymer-s.tugadi { color: ${T.err}; }
        .jp-taymer-l { font-size: 13px; font-weight: 700; color: ${T.err}; }
        .jp-wf { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr); gap: 16px; align-items: start; }
        .jp-wf-chap { display: flex; flex-direction: column; gap: 9px; }
        .jp-doiralar-q { display: flex; gap: 12px; }
        .jp-doira-w { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .jp-doira-w small { font-size: 11px; color: ${T.ink2}; }
        .jp-doira { width: 32px; height: 32px; border-radius: 50%; font: inherit; font-weight: 800; font-size: 14px; color: ${T.ink2}; background: ${T.paper}; border: 1.5px solid ${T.line}; cursor: pointer; }
        .jp-doira.on { color: ${T.accent}; border-color: ${T.accent}; background: ${T.accentSoft}; }
        .jp-doira.ok { color: ${T.paper}; background: ${T.ok}; border-color: ${T.ok}; }
        .jp-wf-amal { display: flex; justify-content: space-between; gap: 10px; }
        .jp-wf-q { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; padding: 14px 18px 14px 14px; }
        .jp-wf-r { position: relative; display: flex; flex-direction: column; gap: 4px; min-height: 150px; border: 1.6px solid ${fon(T.ink2, 0.75)}; border-radius: 12px 15px 13px 11px / 15px 12px 14px 11px; padding: 8px 7px; font-family: 'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive; color: ${T.ink2}; overflow-wrap: anywhere; transition: border-color 0.2s; }
        .jp-wf-r.on { border-color: ${T.accent}; }
        .jp-wf-r.bosh { border-style: dashed; }
        .jp-wf-rn { font-size: 13px; font-weight: 700; animation: jp-chiz 0.5s ease-out both; }
        .jp-wf-ri { font-size: 11px; line-height: 1.35; }
        .jp-wf-rt { margin-top: auto; font-size: 11px; border: 1.3px solid ${fon(T.ink2, 0.7)}; border-radius: 6px; padding: 2px 5px; }
        .jp-strelka.wf { position: absolute; right: -15px; top: 42%; animation: jp-chiz 0.5s ease-out both; }
        .jp-wf-yigma { display: flex; flex-direction: column; gap: 12px; }
        .jp-wf-qator { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 14px; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 10px 14px; animation: jp-yig 0.45s ease-out both; }
        @keyframes jp-yig { from { opacity: 0.3; transform: scaleY(1.6); } to { opacity: 1; transform: none; } }
        .jp-wf-nomlar { margin-left: auto; font-size: 12.5px; color: ${T.ink2}; }
        .jp-ok { color: ${T.ok}; font-weight: 800; }
        /* 6, 8, 11-ekran sahnasi: telefon CHAPDA, chizma O'NGDA (SABOQ 21) */
        .jp-sahna { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: clamp(14px, 3vw, 28px); align-items: start; }
        .jp-sahna.s11 { grid-template-columns: minmax(0, 1fr); justify-items: center; }
        .jp-fayl-u { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .jp-fayl { display: flex; flex-direction: column; gap: 2px; background: ${CODE.bg}; border-radius: 12px; padding: 12px 14px; }
        .jp-fayl-h { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${CODE.comment}; margin-bottom: 4px; }
        .jp-fq { display: block; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.55; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; }
        .jp-fq.ich { padding-left: 16px; } .jp-fq.iz { color: ${CODE.comment}; font-style: italic; }
        .jp-fq-son { color: ${CODE.attr}; border-radius: 4px; padding: 0 2px; transition: background 0.3s; }
        .jp-fq-son.yon { background: ${fon(T.accent, 0.45)}; color: ${T.paper}; animation: jp-yon 1.2s ease-out both; }
        @keyframes jp-yon { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.5)}; } 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .jp-natija-b { display: flex; flex-direction: column; gap: 8px; }
        .jp-izoh-k { align-self: flex-start; font-size: 12px; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 3px 9px; }
        .jp-yoq-q { display: flex; flex-wrap: wrap; gap: 8px; }
        .jp-yoq { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px dashed ${T.line}; border-radius: 9px; padding: 5px 10px; }
        /* Ustunlar o'rni almashadi: sahna (telefon) chapda, harakat o'ngda — faqat keng ekranda */
        @media (min-width: 761px) { .jp-oyna .q-tushuncha > .q-split > .q-col:first-child { order: 2; } }
        /* 8-ekran */
        .jp-talab-k { gap: 10px; }
        .jp-qism { display: flex; flex-direction: column; gap: 6px; }
        .jp-qism b { font-size: 14px; }
        .jp-qism .q-variantlar { width: fit-content; max-width: 100%; }
        .jp-qism-t { font-size: 12.5px; color: ${T.ink2}; }
        .jp-surat { display: flex; align-items: center; gap: 10px; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 10px; padding: 6px 10px; width: fit-content; }
        .jp-surat-n { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .jp-surat-q { display: flex; gap: 6px; background: ${T.paper}; border-radius: 6px; padding: 4px; }
        .jp-surat-r { display: flex; flex-direction: column; gap: 3px; width: 26px; height: 42px; border: 1.2px solid ${fon(T.ink2, 0.7)}; border-radius: 5px; padding: 4px 3px; }
        .jp-surat-r i { display: block; height: 5px; border: 1px solid ${fon(T.ink2, 0.6)}; border-radius: 2px; }
        .jp-surat-r.oyin i:nth-child(2) { height: 9px; border-radius: 50%; width: 9px; } .jp-surat-r.oyin i:nth-child(3) { margin-top: auto; }
        .jp-surat-r.elon i:nth-child(3) { margin-top: auto; }
        .jp-daraxt { display: flex; flex-direction: column; gap: 3px; min-width: 150px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 10px 12px; }
        .jp-daraxt.ixcham { font-size: 12px; padding: 8px 10px; min-width: 0; }
        .jp-d-q { padding: 2px 6px 2px 18px; border-radius: 6px; color: ${T.ink}; }
        .jp-d-q.ildiz { padding-left: 4px; font-weight: 800; color: ${T.ink2}; }
        .jp-d-q.papka { font-weight: 700; } .jp-d-q.ich { padding-left: 32px; color: ${T.ink2}; }
        .jp-d-q.ok { color: ${T.ok}; background: ${T.okFon}; } .jp-d-q.ok i { font-style: normal; }
        .jp-d-q.xato { color: ${T.err}; background: ${T.errFon}; }
        .jp-sochil { animation: jp-tush 0.5s cubic-bezier(.3,1.4,.5,1) var(--d, 0s) both; }
        .jp-tel-joy { display: none; }
        .jp-kir-chap { animation: jp-kir-chap 0.45s ease-out both; }
        @keyframes jp-kir-chap { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: none; } }
        p.jp-talab-q { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.6; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-left: 0; border-radius: 12px; padding: 10px 14px; }
        /* 10-ekran */
        .jp-s10 { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 16px; align-items: start; }
        .jp-solish { display: flex; flex-direction: column; gap: 10px; }
        .jp-solish-q, .jp-solish-p { display: grid; grid-template-columns: repeat(3, 140px); gap: 10px; }
        .jp-solish-q { padding: 10px; }
        .jp-solish-p { padding: 0 10px; }
        .jp-s10-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .jp-tuzat { display: flex; flex-direction: column; gap: 6px; min-height: 120px; background: ${T.paper}; border: 1.5px dashed ${T.line}; border-radius: 12px; padding: 10px 12px; }
        .jp-tuzat.toliq { border-style: solid; border-color: ${T.accent}; }
        p.jp-tuzat-q { font-size: 13px; color: ${T.ink}; padding-left: 10px; border-left: 2px solid ${T.err}; }
        p.jp-tuzat-m { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.6; color: ${T.ink}; }
        /* 11-ekran */
        .jp-kalitlar { display: flex; flex-direction: column; gap: 10px; }
        .jp-kalitlar .jp-hisob { align-self: flex-end; }
        .jp-kalit { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; font: inherit; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px 12px; cursor: pointer; }
        .jp-kalit:disabled { cursor: default; }
        .jp-kalit:disabled:not(.on) { opacity: 0.55; }
        .jp-kalit.on { border-color: ${T.accent}; }
        .jp-kalit.ok { border-color: ${T.ok}; background: ${T.okFon}; opacity: 1; }
        .jp-kalit-i { position: relative; flex: none; width: 34px; height: 20px; border-radius: 10px; background: ${T.line}; transition: background 0.25s; }
        .jp-kalit-i i { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: ${T.paper}; transition: transform 0.25s; }
        .jp-kalit.on .jp-kalit-i { background: ${T.accent}; } .jp-kalit.ok .jp-kalit-i { background: ${T.ok}; }
        .jp-kalit.on .jp-kalit-i i { transform: translateX(14px); }
        .jp-kalit-t { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
        .jp-kalit-t b { font-size: 14px; } .jp-kalit-t code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        .jp-tel-yorliq { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 8px; padding: 3px 10px; }
        .jp-tel-yorliq.jonli { color: ${T.accent}; border-color: ${T.accent}; background: ${T.accentSoft}; }
        /* 12-ekran — kod */
        .jp-vazifa { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .jp-vazifa li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.5; }
        .jp-vazifa li i { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; font-style: normal; font-size: 12px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; }
        .jp-vazifa li.ok i { color: ${T.paper}; background: ${T.ok}; }
        .jp-yordam { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 12px; }
        .jp-bajardim { display: flex; justify-content: flex-end; margin-top: auto; padding-top: 12px; }
        .jp-kodoyna { display: flex; flex-direction: column; gap: 12px; height: 100%; }
        .jp-kod { display: flex; flex-direction: column; background: ${CODE.bg}; border-radius: 12px; padding: 10px 14px; user-select: none; }
        .jp-kod-h { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${CODE.comment}; margin-bottom: 6px; }
        .jp-kod-t { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.6; color: ${CODE.text}; white-space: pre-wrap; }
        .jp-kod-amal { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .jp-kod-iz { font-size: 12.5px; color: ${T.ink2}; text-align: right; }
        .jp-natija-q { display: flex; flex-direction: column; gap: 6px; height: 100%; }
        .jp-natija { width: 100%; min-height: 220px; flex: 1; border: 1px solid ${T.line}; border-radius: 12px; background: ${T.paper}; }
        /* O'qituvchi eslatmasi */
        .jp-mnote { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; font-size: 13px; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 14px; cursor: pointer; }
        .jp-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
        .jp-mnote-c { align-self: flex-start; margin-top: 8px; }
        /* Amaliyot bloklari */
        /* Amaliyot bloki: qadamlar ustuni kengroq (uzun prompt bir ko'rinishda), kutilgan natija ixcham o'ngda — blok shakli o'sha (SABOQ 14) */
        @media (min-width: 761px) { .q-blok > .q-split { grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr); } .jp-nat { flex-wrap: nowrap; } }
        .q-blok .qcode, .jp-ps .qcode { white-space: normal; overflow-wrap: anywhere; }
        .jp-ps { display: block; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6; color: ${T.ink}; overflow-wrap: anywhere; }
        .jp-joy-in { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border: 1px dashed ${T.accent}; border-radius: 6px; padding: 1px 6px; max-width: 100%; }
        .jp-joy-in.bor { border-style: solid; color: ${T.ink}; }
        .jp-joy-in::placeholder { color: ${T.accent}; }
        .jp-joy-n { margin-left: 6px; font-family: 'Manrope', sans-serif; font-size: 12px; color: ${T.ink2}; }
        .jp-kul-q, .jp-band.kul { display: block; font-size: 12.5px; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 5px 9px; margin: 4px 0; }
        .jp-band { display: block; margin-top: 4px; }
        .jp-band.yon { display: inline; margin: 0 0 0 6px; font-size: 12.5px; color: ${T.ink2}; }
        .jp-band.yon::before { content: '('; } .jp-band.yon::after { content: ')'; }
        .jp-err { display: block; margin-top: 6px; }
        .jp-yordam-btn { margin-top: 4px; }
        .jp-yordam-b { display: flex; flex-direction: column; gap: 3px; margin-top: 6px; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 10px; padding: 8px 10px; }
        .jp-yordam-s { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink}; }
        p.jp-ortda { margin-top: 10px; font-size: 12px; line-height: 1.55; color: ${T.ink2}; text-align: left; }
        p.jp-ortda code, p.jp-ortda .qcode { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; white-space: normal; overflow-wrap: anywhere; }
        .jp-nat { display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .jp-nat > .jp-daraxt, .jp-nat > .jp-gh { flex: 1 1 140px; min-width: 0; }
        .jp-gh { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 10px 12px; }
        .jp-gh-h { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${T.ink}; padding-bottom: 6px; border-bottom: 1px solid ${T.line}; }
        .jp-gh-f { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .jp-gh-t { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .jp-gh .jp-surat { flex-wrap: wrap; width: 100%; gap: 6px; }
        /* Kartochkalar (SABOQ 16): birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */
        .jp-flash { display: flex; flex-direction: column; gap: 10px; }
        .jp-flash.yangi .fc-card:not(.flip) .fc-front { outline: 2px solid ${T.accent}; outline-offset: 3px; }
        p.jp-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.jp-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: jp-nuqta 2.4s ease-in-out infinite; }
        @keyframes jp-nuqta { 50% { transform: scale(1.3); opacity: 0.5; } }
        /* Yakun */
        .jp-yakun.belgisiz .done-chip { display: none; }
        .jp-fikr { display: flex; flex-direction: column; gap: 4px; background: ${T.accentSoft}; border-radius: 14px; padding: 12px 16px; }
        .jp-fikr-l { font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
        p.jp-fikr-t { font-weight: 600; color: ${T.ink}; line-height: 1.5; }
        .jp-hw { display: flex; flex-direction: column; gap: 10px; }
        .jp-hw-karta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        .jp-hw-q { display: flex; flex-direction: column; gap: 2px; background: ${T.bg}; border-radius: 10px; padding: 8px 10px; }
        .jp-hw-k { font-size: 11px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.05em; } .jp-hw-v { font-size: 13.5px; font-weight: 700; }
        .jp-hw-band { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .jp-hw-band li { display: flex; gap: 10px; font-size: 14px; line-height: 1.5; }
        .jp-hw-band li i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        p.jp-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .jp-rc-kod { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 8px; padding: 4px 10px; }
        @media (max-width: 760px) {
          .jp-kirish { grid-template-columns: 1fr; justify-items: center; }
          .jp-sahna { grid-template-columns: 1fr; justify-items: center; }
          .jp-s10 { grid-template-columns: 1fr; }
          .jp-solish-q, .jp-solish-p { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; padding: 6px; }
          .jp-solish .jt-tel.ixcham, .jp-ramkalar .jt-tel.ixcham { width: 100%; }
          .jp-ramkalar { gap: 8px; }
          .jp-wf { grid-template-columns: 1fr; }
          .jp-hw-karta { grid-template-columns: 1fr; }
          .jp-s3 { grid-template-columns: 1fr; }
          .jp-ramka-w, .jp-ramka { width: 100%; }
          .jp-wf-ust { flex-direction: column; align-items: stretch; }
          .jp-taymer { justify-content: space-between; }
        }
        @media (prefers-reduced-motion: reduce) {
          .jp-halqa::after, .jp-guruh::after, .jp-bashorat-k .q-bashorat, .jp-bashorat-k .q-chip, .jt-karta, .jt-doiralar i.yangi, .jt-b.b-keldi, .jt-silk, .jt-oqar, .jt-ekran.kir-ong, .jt-ekran.kir-chap, .jt-ekran.chiq-chap, .jt-ekran.chiq-ong, .jt-tel.qogoz .jt-b, .jt-tel.qogoz .jt-karta, .jp-chiz, .jp-kir, .jp-uchar, .jp-strelka-o, .jp-strelka-ost, .jp-tushdi, .jp-wf-rn, .jp-strelka.wf, .jp-wf-qator, .jp-fq-son.yon, .jp-sochil, .jp-kir-chap, p.jp-fc-ipucha i { animation: none !important; }
          .jt-tel.a-karta .jt-karta, .jt-tel.a-son .jt-son, .jp-kalit-i, .jp-kalit-i i, .jp-qogoz { transition: none !important; }
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
