import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 9-MODUL · 2-DARS (PM) — «Besh odamdan nimani bilib olasiz?» (kalit m7-02). Skeletdan (src/skelet/NamunaDars.jsx) qurildi — konveyer 3-bosqich, 05.10.2026.
// Manba-haqiqat: feedback/F-1005-9modul/02-PmFiveInterviews-v3.md (GATE M). 16 ekran · PM 2-tur · real odam bilan ish — s9 (juftlik), uyga — 5 intervyu.
// TARKIB: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletdan;
//   kontent: s0 QKirish · s1 QReja · s2/s4 QTushuncha · s3/s5/s7/s11 test (QuestionScreen → QTest) · s6 QVoqea («Kitobdan») ·
//   s8/s9/s12 QMustaqil · s10 QKod (+ HtmlCompiler) · podium · QKartochka · QYakun (+ PM HwCard, M-q9).
// Bitta vizual — «Suhbat va shablon» (Suhbatdosh + ShablonKarta, manba SHABLON, 180); kitob voqeasi — o'z maketi KitobSahna (PM-029).
// Saqlash kalitlari (tayanch 6-bo'lim): o'qiydi pm-m7d1-tanlangan, pm-m7d1-muammolar (s8) · yozadi pm-m7d2-shablon (s8), pm-m7d2-mashq (s9).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================

// D3: palitra umumiy qolipdan — neytral 5 · modul rangi 2 · holat 2 (shadowBase — soya, rang tokeni emas)
const T = { ...qolipRang('pm'), shadowBase: '58, 53, 48' };
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
// Kod oynasi — umumiy modul (s10; PM-082, «Kompilyatorni ochish» platforma tugmasi)
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

const LESSON_META = { lessonId: 'm7-02-v1', lessonTitle: { uz: 'Besh odamdan nimani bilib olasiz?', ru: 'Что вы узнаете от пяти человек?' } };
// 16 ekran · oqim: kirish → reja → ikki xil savol → 1-savol → bitta intervyu → 2-savol → kitobdan → 3-savol → shablon → juftlik → kod → 4-savol → mustahkamlash → podium → kartochkalar → yakun
// Uyga vazifa banneri fonidagi so'zlar (R-008)
const HW_TOKENS = [
  { t: { uz: 'intervyu', ru: 'интервью' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'yozuv', ru: 'запись' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'savol', ru: 'вопрос' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'odam', ru: 'человек' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0  · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1  · QReja
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 2  · QTushuncha: ikki xil savol
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 3  · 1-savol
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 4  · QTushuncha: bitta intervyu
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 5  · 2-savol
  { id: 's6',  type: 'case',        template: 'custom',   scored: false, scope: null },            // 6  · QVoqea: The Mom Test
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 7  · 3-savol
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 8  · QMustaqil: shablon
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 9  · QMustaqil: juftlikda intervyu
  { id: 's10', type: 'koding',      template: 'custom',   scored: false, scope: null },            // 10 · QKod
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 11 · 4-savol (yakuniy)
  { id: 's12', type: 'reflection',  template: 'custom',   scored: false, scope: null },            // 12 · QMustaqil: 2 qadam
  { id: 'podium', type: 'stats',      template: 'custom', scored: false, scope: null },            // 13 · podium
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
  return <button className={`btn-white-accent${faol ? ' fi-bos-nav' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD v3: s3 = C · s5 = A · s7 = D · s11 = B.
const INLINE_KEYS = { s3: 2, s5: 0, s7: 3, s11: 1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI); S-026: PM darsida raqam 1/2/3
const RECAPS = {
  3: {
    title: { uz: "Voqea savoli va bo'sh savol", ru: 'Вопрос о событии и пустой вопрос' },
    cards: [
      { ic: '1', h: { uz: 'Voqea savoli', ru: 'Вопрос о событии' }, body: { uz: <>Bo'lib o'tgan ishni so'ragan savol — <b>voqea savoli</b>. Javobida kun va qilingan ish bo'ladi.</>, ru: <>Вопрос о том, что уже было, — <b>вопрос о событии</b>. В ответе есть день и сделанное дело.</> } },
      { ic: '2', h: { uz: "G'oya haqidagi savol", ru: 'Вопрос об идее' }, body: { uz: <>Sayt hali yo'q: «ishlatarmidingiz?» savoliga javob <b>va'da</b> bo'ladi.</>, ru: <>Сайта ещё нет: на вопрос «пользовались бы?» ответом будет <b>обещание</b>.</> } },
      { ic: '3', h: { uz: 'Javob savolda', ru: 'Ответ в вопросе' }, body: { uz: <>«…, shundaymi?» savoliga odam shunchaki <b>«ha»</b> deydi.</>, ru: <>На вопрос «…, правда?» человек просто скажет <b>«да»</b>.</> }, ask: { uz: "Maydon egasidan kechagi kun haqida nimani so'rardingiz?", ru: 'О чём бы вы спросили владельца поля про вчерашний день?' } }
    ]
  },
  5: {
    title: { uz: 'Voqeani davom ettiring', ru: 'Продолжайте событие' },
    cards: [
      { ic: '1', h: { uz: 'Keyingi savol', ru: 'Следующий вопрос' }, body: { uz: <>Odam voqeani aytdi: endi <b>«O'shanda nima qildingiz?»</b> deb so'raysiz.</>, ru: <>Человек рассказал событие: теперь спрашиваете <b>«Что вы тогда сделали?»</b>.</> } },
      { ic: '2', h: { uz: 'Keyingi qator', ru: 'Следующая строка' }, body: { uz: <>Har voqea savoli shablonning <b>keyingi qatorini</b> to'ldiradi.</>, ru: <>Каждый вопрос о событии заполняет <b>следующую строку</b> шаблона.</> } },
      { ic: '3', h: { uz: 'Chiqib ketish', ru: 'Уход в сторону' }, body: { uz: <>«Keyingi safar…» savoli gapni <b>kelajakka</b> olib ketadi — qator yozilmaydi.</>, ru: <>Вопрос «В следующий раз…» уводит разговор <b>в будущее</b> — строка не пишется.</> }, ask: { uz: "O'yinchi «maydon band ekan» dedi. Keyin nimani so'raysiz?", ru: 'Игрок сказал: «поле было занято». Что спросите дальше?' } }
    ]
  },
  7: {
    title: { uz: 'Onangiz ham rostini aytadi', ru: 'Даже мама скажет правду' },
    cards: [
      { ic: '1', h: { uz: 'Birinchi suhbat', ru: 'Первый разговор' }, body: { uz: <>G'oyani eshitgan ona o'g'lini xafa qilmaslik uchun <b>maqtadi</b>.</>, ru: <>Услышав идею, мама <b>похвалила</b>, чтобы не обидеть сына.</> } },
      { ic: '2', h: { uz: 'Ikkinchi suhbat', ru: 'Второй разговор' }, body: { uz: <>G'oya aytilmadi: ona <b>oxirgi marta</b> nima bo'lganini aytdi.</>, ru: <>Идею не назвали: мама рассказала, что было <b>в последний раз</b>.</> } },
      { ic: '3', h: { uz: '«Odatda» savoli', ru: 'Вопрос «обычно»' }, body: { uz: <>Unga <b>umumiy javob</b> keladi, «oxirgi marta» savoliga esa voqea.</>, ru: <>На него приходит <b>общий ответ</b>, а на вопрос «в последний раз» — событие.</> }, ask: { uz: "Do'stingiz g'oyangizni maqtasa, bundan nima bilinadi?", ru: 'Если друг хвалит вашу идею, что из этого понятно?' } }
    ]
  },
  11: {
    title: { uz: 'Yozuvga nima tushadi', ru: 'Что попадает в запись' },
    cards: [
      { ic: '1', h: { uz: 'Eshitgan javob', ru: 'Услышанный ответ' }, body: { uz: <>Yozuvga <b>eshitgan javob</b> tushadi — u aytganidek.</>, ru: <>В запись попадает <b>услышанный ответ</b> — так, как он сказал.</> } },
      { ic: '2', h: { uz: 'Xulosa va taxmin', ru: 'Вывод и догадка' }, body: { uz: <>Sizning <b>xulosangiz</b> ham, taxminingiz ham yozuvga tushmaydi.</>, ru: <>Ни ваш <b>вывод</b>, ни ваша догадка в запись не попадают.</> } },
      { ic: '3', h: { uz: 'Bitta odam', ru: 'Один человек' }, body: { uz: <>Bitta odamning gapi <b>hammaga yoyilmaydi</b>: u o'zi haqida gapirdi.</>, ru: <>Слова одного человека <b>не распространяются на всех</b>: он говорил о себе.</> }, ask: { uz: 'Sinfdoshingizning javobini u aytganidek ayta olasizmi?', ru: 'Сможете повторить ответ одноклассника так, как он сказал?' } }
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

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, ustVizual, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
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
        savol={<>{ustVizual && ustVizual({ picked, solved, waiting, togri: picked === correctIdx })}{tr(question)}</>}
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

// ===== DARSNING BITTA VIZUALI — «Suhbat va shablon» (SuhbatShablon, 163/180): suhbatdosh + pufak + javob turi · shablon kartasi (4 qator) · «n / 5» izlari =====
// qolip-maket: fi-tomon fi-tahrir fi-ro-q fi-nuq
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
// SHABLON — bitta manba (180): to'rt qator, dars bo'yi aynan shu nom. savol — 8, 9-ekranda qator ostida turadigan tayyor savol
const SHABLON = [
  { kalit: 'kim', nom: { uz: 'Kim bilan', ru: 'С кем' }, savol: null },
  { kalit: 'voqea', nom: { uz: "Oxirgi marta nima bo'ldi?", ru: 'Что было в последний раз?' }, savol: null },
  { kalit: 'qildi', nom: { uz: "O'shanda nima qildi?", ru: 'Что он тогда сделал?' }, savol: { uz: "O'shanda nima qildingiz?", ru: 'Что вы тогда сделали?' } },
  { kalit: 'qiyin', nom: { uz: "Nima qiyin bo'ldi?", ru: 'Что было трудно?' }, savol: { uz: "Eng qiyini nima bo'ldi?", ru: 'Что было труднее всего?' } }
];
const ROL = {
  oyinchi: { uz: "o'yinchi", ru: 'игрок' }, ega: { uz: 'maydon egasi', ru: 'владелец поля' }, sinfdosh: { uz: 'sinfdosh', ru: 'одноклассник' },
  yonida: { uz: 'yoningizdagi odam', ru: 'человек рядом' }, dost: { uz: "do'stingiz", ru: 'ваш друг' }
};
const TUR = { voqea: { uz: 'voqea', ru: 'событие' }, vada: { uz: "va'da", ru: 'обещание' }, savolda: { uz: 'javob savolda', ru: 'ответ в вопросе' }, baho: { uz: 'baho', ru: 'оценка' }, fikr: { uz: 'fikr', ru: 'мнение' } };
const TAHRIR = { uz: 'Tahrirlash', ru: 'Изменить' };
const YORDAM = { uz: 'Yordam', ru: 'Подсказка' };
const SHABLON_Y = { uz: 'Shablon', ru: 'Шаблон' };

// Chizilgan bosh-siluet (CSS doira + yarim doira, emoji emas)
const Siluet = ({ kichik }) => <span className={cxx('fi-siluet', kichik && 'kichik')} aria-hidden="true"><i /><b /></span>;
// Suhbatdosh: siluet + rol yorlig'i · pufaklar [{ t, tur?, men?, k }] — tur: pufak ostidagi kulrang yorliq (voqea — yashil)
const Suhbatdosh = ({ rol, pufaklar = [], className }) => (
  <div className={cxx('fi-sd', className)}>
    <div className="fi-sd-odam"><Siluet /><span className="fi-sd-rol">{tr(ROL[rol])}</span></div>
    {pufaklar.length > 0 && <div className="fi-sd-gap">
      {pufaklar.map((p, i) => (
        <div key={p.k || i} className={cxx('fi-sd-q', p.men && 'men')}>
          <span className={cxx('fi-pufak', p.men && 'men', 'kir')}>{p.men ? tr(p.t) : <>«{tr(p.t)}»</>}</span>
          {p.tur && <span className={cxx('fi-tur', p.tur === 'voqea' && 'ok')}>{tr(TUR[p.tur])}</span>}
        </div>
      ))}
    </div>}
  </div>
);
// Shablon kartasi: bosh — sarlavha-qatorlar [{ k, v, holat, onTahrir }] · qatorlar { kalit: matn } · holat { kalit: 'joriy'|'xato'|'ok' } ·
// savollar { kalit: matn } — qator ostidagi savol (kulrang kursiv) · onTahrir { kalit: fn } — ✎ · toliq — to'liq yozuv (yashil chegara, SABOQ 7: yon chiziq yo'q)
const ShablonKarta = ({ yorliq, bosh = [], qatorlar = {}, holat = {}, savollar = {}, onTahrir = {}, yangi, toliq, ixcham, className, children }) => (
  <div className={cxx('fi-sh', toliq && 'toliq', ixcham && 'ixcham', className)}>
    <div className="fi-sh-bosh"><span className="fi-sh-yorliq">{yorliq || tr(SHABLON_Y)}</span>{toliq && <span className="fi-sh-ok" aria-hidden="true">✓</span>}</div>
    {bosh.map((b, i) => (
      <p key={i} className={cxx('fi-sh-sar', b.holat)}><span className="fi-sh-sar-k">{b.k}:</span> <span className="fi-sh-sar-v">{b.v}</span>
        {b.onTahrir && <button type="button" className="fi-tahrir" title={tr(TAHRIR)} aria-label={tr(TAHRIR)} onClick={b.onTahrir}>✎</button>}</p>
    ))}
    <div className="fi-sh-qatorlar">
      {SHABLON.map(q => {
        const v = qatorlar[q.kalit];
        const s = savollar[q.kalit];
        const ed = onTahrir[q.kalit];
        return (
          <div key={q.kalit} className={cxx('fi-sh-q', holat[q.kalit], v && 'yozildi', yangi === q.kalit && 'yangi')}>
            <span className="fi-sh-nom">{tr(q.nom)}</span>
            <span className="fi-sh-joy">
              {s && <span className="fi-sh-savol">{s}</span>}
              {v ? <span key={v} className="fi-sh-matn">{q.kalit === 'kim' ? v : <>«{v}»</>}</span> : <i className="fi-sh-uzuq" aria-hidden="true" />}
            </span>
            {ed && <button type="button" className="fi-tahrir" title={tr(TAHRIR)} aria-label={tr(TAHRIR)} onClick={ed}>✎</button>}
          </div>
        );
      })}
    </div>
    {children}
  </div>
);
// Beshta karta-izi: «1 / 5» (bittasi yozilgan, qolgani uzuq chiziq — P-056)
const Izlar = ({ n = 1 }) => (
  <div className="fi-izlar fade-step">
    <span className="fi-iz-k" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <i key={i} className={i < n ? 'ok' : ''} />)}</span>
    <span className="fi-iz-n">{n} / 5</span>
  </div>
);

// --- umumiy yordamchilar ---
const KEY_MUAMMOLAR = 'pm-m7d1-muammolar';
const KEY_TANLANGAN = 'pm-m7d1-tanlangan';
const KEY_SHABLON = 'pm-m7d2-shablon';
const KEY_MASHQ = 'pm-m7d2-mashq';
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const yakkaMi = (live) => !live || (live.mode !== 'student' && live.mode !== 'mentor');
const norm = (s) => String(s || '').toLowerCase().replace(/[\u02BB\u02BC\u2018\u2019`]/g, "'").replace(/\s+/g, ' ').trim();
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// 42 soniya harakatsizlikda bitta ipucha (javobni aytmaydi)
const useIpucha = (faol, kalit, ms = 42000) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(false);
    if (!faol) return undefined;
    const t = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(t);
  }, [faol, kalit, ms]);
  return on;
};
// P-051: mashq yakuni ochilganda xulosaga silliq skroll (boshidan tugagan ekranda — yo'q)
const useXulosaSkroll = (on, boshdanTugagan) => {
  const bosh = useRef(!!boshdanTugagan);
  useEffect(() => {
    if (!on || bosh.current) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 400);
    return () => clearTimeout(t);
  }, [on]);
};
// Bir qatordan to'rt qatorgacha o'sadigan matn joyi (DE-175)
const GrowInput = ({ value, onChange, onEnter, className, ...p }) => {
  const ref = useRef(null);
  useLayoutEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 112)}px`; }, [value]);
  return <textarea ref={ref} rows={1} value={value} onChange={onChange} className={cxx('fi-kirit', className)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && onEnter) { e.preventDefault(); onEnter(); } }} {...p} />;
};
// F-1005-85 (qat'iy): bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: N» natijagacha turadi
const Bashorat = ({ yorliq, savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <QBashorat yorliq={yorliq} savol={savol} variantlar={variantlar} tanlov={tanlov} onTanla={onTanla} />
  : <div className="fi-taxmin-q" role="status"><span className="fi-taxmin-s">{savol}</span><span className="fi-taxmin-b">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{(variantlar.find(v => v.k === tanlov) || {}).t}</b></span></div>);
const BASH_Y = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
// togriMi — taxmin to'g'ri chiqdimi · tanlov, haqiqat — tayyor (tarjima qilingan) matn
const Taxmin = ({ togriMi, tanlov, haqiqat }) => (togriMi
  ? <QTaxmin togri>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })}</QTaxmin>
  : <QTaxmin>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tanlov} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></QTaxmin>);
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
    ? tr({ uz: 'Nishon birinchi urinish uchun edi — endi bemalol to\'g\'risini toping.', ru: 'Значок был за первую попытку — теперь спокойно найдите верный.' })
    : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</span>;
};
// Jonli dars: hook ovozlari chizig'i — har variant va foizi (J-026, hammaga correct: false)
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
    <div className="fi-ovoz fade-step" aria-label={tr({ uz: 'Jonli natija', ru: 'Живой результат' })}>
      {variantlar.map((v, i) => {
        const pct = jami ? Math.round((n[i] / jami) * 100) : 0;
        return (
          <div key={i} className={cxx('fi-ovoz-q', mening === i && 'men')}>
            <span className="fi-ovoz-t">{v}</span>
            <span className="fi-ovoz-yol"><i style={{ width: `${pct}%` }} /></span>
            <span className="fi-ovoz-n">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
};
// Qadam-chiplari 1/2/3 (QMustaqil)
const QadamChip = ({ nomlar, joriy, tugadi }) => (
  <div className="fi-bosq">{nomlar.map((x, i) => {
    const ok = tugadi || i < joriy;
    return <span key={i} className={cxx('fi-qchip', !tugadi && i === joriy && 'on', ok && 'ok')}>{ok ? '✓' : i + 1} {x}</span>;
  })}</div>
);

// ===== SCREEN 0 — KIRISH (QKirish: chat maketi · sof so'rovnoma, J-026 — maqtovsiz, hammaga correct: false) =====
const HOOK_GAP = { uz: 'Maydonni oldindan band qiladigan sayt qilsam, ishlatarmidingiz?', ru: 'Если я сделаю сайт, где поле можно забронировать заранее, ты бы пользовался?' };
const HOOK_OPTS = [
  { id: 'ha', t: { uz: "«Ha, men ham ishlatardim» deydi", ru: 'Скажет: «Да, я бы тоже пользовался»' }, javob: { uz: 'Ha, men ham ishlatardim', ru: 'Да, я бы тоже пользовался' }, tur: 'vada' },
  { id: 'bilmadim', t: { uz: "«Bilmadim, ko'rish kerak» deydi", ru: 'Скажет: «Не знаю, надо посмотреть»' }, javob: { uz: "Bilmadim, ko'rish kerak", ru: 'Не знаю, надо посмотреть' }, tur: 'fikr' }
];
const ChatOyna = ({ children }) => (
  <div className="fi-chat">
    <div className="fi-chat-bar"><Siluet kichik /><span className="fi-chat-nom">{tr(ROL.dost)}</span></div>
    <div className="fi-chat-ichi">{children}</div>
  </div>
);
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
  const o = HOOK_OPTS.find(x => x.id === picked);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · bitta savol', ru: 'Введение · один вопрос' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked !== null || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>«Ishlatarmidingiz?» desangiz, <A>do'stingiz nima deydi?</A></>, ru: <>Если спросить «Ты бы пользовался?», <A>что ответит друг?</A></> })}
        mentor={<Mentor>{tr({ uz: "Bugungi misol — mahalladagi futbol maydoni: kelasiz, u esa band. Shu muammo uchun sayt g'oyasini do'stingizga aytdingiz.", ru: 'Сегодняшний пример — футбольное поле в махалле: приходите, а оно занято. Вы рассказали другу идею сайта для этой проблемы.' })}</Mentor>}
        maket={<ChatOyna>
          <span className="fi-pufak men kir">{tr(HOOK_GAP)}</span>
          {o
            ? <div className="fi-chat-javob"><span key={o.id} className="fi-pufak tush">{tr(o.javob)}</span><span className="fi-tur">{tr(TUR[o.tur])}</span></div>
            : <span className="fi-pufak uch" role="img" aria-label={tr({ uz: 'yozmoqda', ru: 'печатает' })}><i /><i /><i /></span>}
        </ChatOyna>}
        variantlar={HOOK_OPTS.map(x => ({ id: x.id, t: tr(x.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
        javob={<>
          {picked !== null && <p className="hook-ack fade-step">{tr({ uz: "Ikkalasi ham bo'lishi mumkin. Lekin ikkalasi ham kelajak haqida: maydonda oxirgi marta nima bo'lgani aytilmadi.", ru: 'Возможны оба ответа. Но оба — о будущем: что было на поле в последний раз, не сказано.' })}</p>}
          {isLive && (picked !== null || isMentor) && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(x => tr(x.t))} mening={HOOK_OPTS.findIndex(x => x.id === picked)} />}
        </>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda shablon qatorlari 0.9 s oraliqda o'zi yoziladi — maydon egasi namunasi; o'ngda «01 · matn · teg», bosilmaydi — P-015) =====
const REJA = [
  { t: { uz: "Qaysi savol bo'lib o'tgan ishni so'rashini ajratasiz", ru: 'Отличите, какой вопрос спрашивает о том, что уже было' }, teg: { uz: 'savol', ru: 'вопрос' } },
  { t: { uz: "O'yinchi bilan suhbatni to'rt qatorga yozasiz", ru: 'Запишете разговор с игроком в четыре строки' }, teg: { uz: 'shablon', ru: 'шаблон' } },
  { t: { uz: "Kitobdagi ona qaysi savolga voqeani aytganini ko'rasiz", ru: 'Увидите, на какой вопрос мама из книги рассказала случай' }, teg: { uz: 'voqea', ru: 'событие' } },
  { t: { uz: "O'z muammongiz bo'yicha sinfdoshingiz bilan suhbatlashasiz", ru: 'Поговорите с одноклассником о своей проблеме' }, teg: { uz: 'juftlik', ru: 'в паре' } }
];
const EGA_NAMUNA = {
  kim: ROL.ega,
  voqea: { uz: "Kecha bir soatga uch kishi qo'ng'iroq qildi", ru: 'Вчера на один час позвонили три человека' },
  qildi: { uz: "Hammasiga «ha» dedim, keyin ikkitasiga qayta qo'ng'iroq qildim", ru: 'Всем сказал «да», потом двоим перезвонил' },
  qiyin: { uz: "Kim birinchi qo'ng'iroq qilganini eslay olmadim", ru: 'Не смог вспомнить, кто позвонил первым' }
};
const RejaShablon = () => {
  const [n, setN] = useState(() => (kamHarakat() ? 4 : 0));
  useEffect(() => {
    if (n >= 4) return undefined;
    const t = setTimeout(() => setN(x => x + 1), n === 0 ? 500 : 900);
    return () => clearTimeout(t);
  }, [n]);
  const q = {};
  SHABLON.slice(0, n).forEach(s => { q[s.kalit] = tr(EGA_NAMUNA[s.kalit]); });
  return <ShablonKarta qatorlar={q} holat={n < 4 ? { [SHABLON[n].kalit]: 'joriy' } : {}} yangi={n > 0 && n <= 4 ? SHABLON[n - 1].kalit : null} toliq={n >= 4} />;
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun bitta suhbatni <A>to'rt qatorga</A> yozib olasiz.</>, ru: <>Сегодня запишете один разговор <A>в четыре строки</A>.</> })}
      mentor={<Mentor>{tr({ uz: 'Darsda sinfdoshingiz bilan mashq qilasiz, uyda — besh odam bilan.', ru: 'На уроке потренируетесь с одноклассником, дома — с пятью людьми.' })}</Mentor>}
      chapYorliq={tr({ uz: "Dars oxirida — to'rt qatorga yozilgan bitta suhbat", ru: 'В конце урока — один разговор, записанный в четыре строки' })}
      chap={<RejaShablon />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — IKKI XIL SAVOL (QTushuncha, takror m5-08: bashorat → savol-kartalar bittadan, tomonga joylanadi → o'yinchi pufagida javob → 6/6 da tomon nomlari) =====
// SABOQ 9/13: olti karta bir vaqtda to'kilmaydi — bittasi katta karta bo'lib chiqadi, tanlangan tomonga uchib kiradi.
const S2_SAVOLLAR = [
  { id: 1, s: { uz: 'Oxirgi marta maydonga qachon bordingiz?', ru: 'Когда вы в последний раз ходили на поле?' }, j: { uz: "O'tgan shanba, kechqurun.", ru: 'В прошлую субботу, вечером.' }, tur: 'voqea' },
  { id: 2, s: { uz: "O'sha kuni maydon bo'shligini qanday bildingiz?", ru: 'Как вы в тот день узнали, что поле свободно?' }, j: { uz: "Bilmadik — borib ko'rdik.", ru: 'Не знали — пошли и посмотрели.' }, tur: 'voqea' },
  { id: 3, s: { uz: "Oxirgi marta egasiga qachon qo'ng'iroq qildingiz?", ru: 'Когда вы в последний раз звонили владельцу?' }, j: { uz: "O'tgan shanba, maydon oldida turib.", ru: 'В прошлую субботу, стоя у поля.' }, tur: 'voqea' },
  { id: 4, s: { uz: "Band qiladigan sayt bo'lsa, ishlatarmidingiz?", ru: 'Если бы был сайт для брони, вы бы пользовались?' }, j: { uz: 'Ha, ishlatardim.', ru: 'Да, пользовался бы.' }, tur: 'vada', x: { uz: "Bu sayt hali yo'q — javobi va'da bo'ladi.", ru: 'Этого сайта ещё нет — ответ будет обещанием.' } },
  { id: 5, s: { uz: 'Maydon topish qiyin, shundaymi?', ru: 'Найти поле трудно, правда?' }, j: { uz: 'Ha, qiyin.', ru: 'Да, трудно.' }, tur: 'savolda', x: { uz: "Javobni savolning o'zi aytib qo'ydi.", ru: 'Ответ уже сказал сам вопрос.' } },
  { id: 6, s: { uz: "Shunday sayt yaxshi g'oyami?", ru: 'Такой сайт — хорошая идея?' }, j: { uz: "Ha, ajoyib g'oya!", ru: 'Да, отличная идея!' }, tur: 'baho', x: { uz: "Bu savol g'oyangizga baho so'rayapti.", ru: 'Этот вопрос просит оценить вашу идею.' } }
];
const S2_TARTIB = [2, 4, 1, 6, 3, 5]; // aralash tartib
const S2_XATO_VOQEA = { uz: "Bu savol bo'lib o'tgan kunni so'rayapti.", ru: 'Этот вопрос спрашивает о прошедшем дне.' };
const S2_TAXMIN = [{ k: '2', t: '2' }, { k: '3', t: '3' }, { k: '4', t: '4' }];
const S2_UCH = 420;
const s2Byid = (id) => S2_SAVOLLAR.find(q => q.id === id);
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [joy, setJoy] = useState(() => (storedAnswer ? Object.fromEntries(S2_SAVOLLAR.map(q => [q.id, q.tur === 'voqea' ? 'chap' : 'ong'])) : {}));
  const [oxirgi, setOxirgi] = useState(storedAnswer ? 5 : null);
  const [uchish, setUchish] = useState(null);
  const [xato, setXato] = useState(null);
  const soni = Object.keys(joy).length;
  const done = soni >= 6;
  const tugadi = useTugadi(done, 1200, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  const joriy = S2_TARTIB.map(s2Byid).find(q => !joy[q.id]);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'saralash', screenIdx: screen, correct: true, picked: true, solved: true, taxmin }); }, [done]); // eslint-disable-line
  const hal = (tomon) => {
    if (!joriy || uchish || !taxmin) return;
    if ((joriy.tur === 'voqea') !== (tomon === 'chap')) { setXato({ id: joriy.id, k: Date.now(), x: joriy.tur === 'voqea' ? S2_XATO_VOQEA : joriy.x }); return; }
    const q = joriy;
    setXato(null); setUchish(tomon);
    setTimeout(() => { setJoy(j => ({ ...j, [q.id]: tomon })); setOxirgi(q.id); setUchish(null); }, kamHarakat() ? 60 : S2_UCH);
  };
  const ox = oxirgi && s2Byid(oxirgi);
  const silk = xato && joriy && xato.id === joriy.id;
  const karta = joriy && (
    <div key={silk ? `${joriy.id}-${xato.k}` : joriy.id} draggable={!!taxmin && !uchish}
      onDragStart={e => { try { e.dataTransfer.setData('text/plain', String(joriy.id)); } catch { /* sudrash yo'q — bosish ishlaydi */ } }}
      className={cxx('fi-s2-karta', silk && 'silk', uchish && `uch-${uchish}`, !taxmin && 'kut')}>
      <span className="fi-s2-n">{soni + 1} / 6</span>
      <p className="fi-s2-t">«{tr(joriy.s)}»</p>
    </div>
  );
  const TOMON = {
    chap: { h: { uz: "Bo'lib o'tgan ishni so'raydi", ru: 'Спрашивает о том, что уже было' }, nom: { uz: 'voqea savoli', ru: 'вопрос о событии' } },
    ong: { h: { uz: "Bo'lib o'tgan ishni so'ramaydi", ru: 'Не спрашивает о том, что уже было' }, nom: { uz: "bo'sh savol", ru: 'пустой вопрос' } }
  };
  const tomon = (t) => {
    const faol = !!joriy && !!taxmin && !uchish;
    return (
      <button type="button" className={cxx('fi-tomon', t, faol && 'chorla')} disabled={!faol} onClick={() => hal(t)}
        onDragOver={e => { if (faol) e.preventDefault(); }} onDrop={e => { e.preventDefault(); hal(t); }}>
        {done && <span className="fi-tomon-nom">{tr(TOMON[t].nom)}</span>}
        <span className="fi-tomon-h">{tr(TOMON[t].h)}</span>
        <span className="fi-tomon-ro">{S2_TARTIB.filter(id => joy[id] === t).map(id => <span key={id} className={cxx('fi-tomon-q', id === oxirgi && 'yangi')}>{tr(s2Byid(id).s)}</span>)}</span>
      </button>
    );
  };
  return (
    <Stage eyebrow={tr({ uz: 'Takror · ikki xil savol', ru: 'Повтор · два вида вопросов' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tugadi} label={tugadi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: '6 savolni joylang', ru: 'Разложите 6 вопросов' })} (${soni}/6)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Qaysi savol maydonda bo'lgan <A>voqeani ochadi?</A></>, ru: <>Какой вопрос <A>открывает событие</A>, которое было на поле?</> })}
        mentor={<Mentor>{tr({ uz: "Botingizni ishlatgan odamdan nimani so'raganingizni eslang — o'sha qoida maydonda ham ishlaydi. Har savolni o'z tomoniga joylang.", ru: 'Вспомните, о чём вы спрашивали человека, который пользовался вашим ботом, — то же правило работает и на поле. Разложите каждый вопрос на свою сторону.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat yorliq={tr(BASH_Y)} savol={tr({ uz: 'Bu savollardan nechtasi voqeani ochadi?', ru: 'Сколько из этих вопросов открывают событие?' })} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        harakat={!done && <div className="fi-s2-harakat">{karta}{xato && <QXato>{tr(xato.x)}</QXato>}</div>}
        vizual={<div className={cxx('fi-s2', done && 'tola')}>
          {tomon('chap')}{tomon('ong')}
          <Suhbatdosh rol="oyinchi" className="fi-s2-sd" pufaklar={ox ? [{ t: tr(ox.j), tur: ox.tur, k: ox.id }] : []} />
        </div>}
        natija={tugadi && taxmin && <Taxmin togriMi={taxmin === '3'} tanlov={taxmin} haqiqat="3" />}
        xulosa={tugadi && tr({ uz: "G'oya haqidagi savol ham bo'sh savol: javobida maydonda bo'lgan voqea yo'q.", ru: 'Вопрос об идее — тоже пустой вопрос: в ответе нет события, которое было на поле.' })}
      >
        <MentorNote>{tr({ uz: "6-savoldagi maqtovni «yomon» demang — u rost his, faqat maydonda nima bo'lganini aytmaydi. Kitob voqeasi (6-ekran) shu haqda.", ru: 'Не называйте похвалу в 6-м вопросе «плохой» — это искреннее чувство, просто оно не говорит, что было на поле. История из книги (6-й экран) — об этом.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 2) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · maydon egasi', ru: 'Проверка · владелец поля' })}
    questionText="Maydon egasiga qaysi savol voqea savoli?"
    question={tr({ uz: <h2 className="title h-ask">Maydon egasiga qaysi savol <A>voqea savoli</A>?</h2>, ru: <h2 className="title h-ask">Какой вопрос владельцу поля — <A>вопрос о событии</A>?</h2> })}
    options={[
      { uz: '«Band qiladigan sayt sizga kerak bo\'ladimi?»', ru: '«Вам понадобится сайт для брони?»' },
      { uz: "«Kelasi oy odam ko'payadi deb o'ylaysizmi?»", ru: '«Думаете, в следующем месяце людей станет больше?»' },
      { uz: "«Kecha qaysi soatga ko'p qo'ng'iroq bo'ldi?»", ru: '«На какой час вчера было больше всего звонков?»' },
      { uz: "«Kecha ham qo'ng'iroq ko'p bo'ldi, shundaymi?»", ru: '«Вчера тоже было много звонков, правда?»' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Savol kechagi kunni so'rayapti — egasi bo'lgan voqeani aytadi.", ru: 'Вопрос спрашивает о вчерашнем дне — владелец расскажет, что было.' }}
    explainWrong={{
      0: { uz: "Bu savol g'oyani so'rayapti — javobi baho bo'ladi.", ru: 'Этот вопрос спрашивает об идее — ответ будет оценкой.' },
      1: { uz: 'Kelasi oy hali kelmagan — javobi taxmin bo\'ladi.', ru: 'Следующий месяц ещё не наступил — ответ будет догадкой.' },
      3: { uz: "Javobni savolning o'zi aytdi — egasi «ha» deydi.", ru: 'Ответ сказал сам вопрос — владелец скажет «да».' },
      default: { uz: "Qaysi savol bo'lib o'tgan kunni so'rayapti — shuni qarang.", ru: 'Посмотрите, какой вопрос спрашивает о прошедшем дне.' }
    }} />
);

// ===== SCREEN 4 — BITTA INTERVYU (QTushuncha, markaziy: QQadamlar 163.8 · savol → o'yinchi javobi → shablon qatori · 3/3 da atama, misoldan KEYIN — PM-030/T-011 · nishon firstRecord) =====
const S4_QADAMLAR = [
  { kalit: 'voqea', savollar: [
    { s: { uz: 'Maydon topish sizga qiyinmi?', ru: 'Вам трудно найти поле?' }, j: { uz: "Ha, ba'zan qiyin.", ru: 'Да, иногда трудно.' }, tur: 'savolda' },
    { s: { uz: "Oxirgi marta borganingizda nima bo'ldi?", ru: 'Что было, когда вы ходили в последний раз?' }, j: { uz: "O'tgan shanba sinfdoshlar bilan bordik — maydon band ekan.", ru: 'В прошлую субботу пошли с одноклассниками — а поле занято.' }, ok: true }
  ] },
  { kalit: 'qildi', savollar: [
    { s: { uz: "O'shanda nima qildingiz?", ru: 'Что вы тогда сделали?' }, j: { uz: "Egasiga qo'ng'iroq qildik — ko'tarmadi. Hovlida o'ynadik.", ru: 'Позвонили владельцу — не взял трубку. Играли во дворе.' }, ok: true },
    { s: { uz: "Sayt bo'lsa, oldindan band qilarmidingiz?", ru: 'Если бы был сайт, бронировали бы заранее?' }, j: { uz: 'Ha, band qilardim.', ru: 'Да, бронировал бы.' }, tur: 'vada' }
  ] },
  { kalit: 'qiyin', savollar: [
    { s: { uz: 'Maydonlar umuman yetishmaydimi?', ru: 'Полей вообще не хватает?' }, j: { uz: 'Bilmadim, balki yetishmaydi.', ru: 'Не знаю, может, не хватает.' }, tur: 'fikr' },
    { s: { uz: "O'sha kuni eng qiyini nima bo'ldi?", ru: 'Что было труднее всего в тот день?' }, j: { uz: "Yarim soat yo'l yurib keldik — bekorga.", ru: 'Полчаса шли пешком — зря.' }, ok: true }
  ] }
];
const s4Nom = (k) => SHABLON.find(s => s.kalit === k).nom;
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const xatoRef = useRef(false);
  const [qadam, setQadam] = useState(storedAnswer ? 3 : 0);
  const [ochiq, setOchiq] = useState({});
  const [pufak, setPufak] = useState(null);
  const [tush, setTush] = useState(false);
  const [yangi, setYangi] = useState(null);
  const done = qadam >= 3;
  const tugadi = useTugadi(done, 1500, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  const ipucha = useIpucha(!done && !tush, `${qadam}-${Object.keys(ochiq).length}`);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tajriba', screenIdx: screen, correct: !xatoRef.current, picked: true, solved: true }); }, [done]); // eslint-disable-line
  const bos = (i) => {
    if (done || tush) return;
    const st = S4_QADAMLAR[qadam];
    const q = st.savollar[i];
    const k = `${qadam}-${i}`;
    setPufak({ t: q.j, tur: q.ok ? 'voqea' : q.tur, k });
    if (!q.ok) { xatoRef.current = true; if (achMiss) achMiss.miss(screen); setOchiq(o => ({ ...o, [k]: true })); return; }
    setTush(true);
    setTimeout(() => { setYangi(st.kalit); setQadam(n => n + 1); setTush(false); }, kamHarakat() ? 80 : 1000);
  };
  const qatorlar = { kim: tr(ROL.oyinchi) };
  S4_QADAMLAR.slice(0, qadam).forEach(s => { qatorlar[s.kalit] = tr(s.savollar.find(x => x.ok).j); });
  const joriyK = !done ? S4_QADAMLAR[qadam].kalit : null;
  return (
    <Stage eyebrow={tr({ uz: 'Tajriba · bitta suhbat', ru: 'Опыт · один разговор' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tugadi} label={tugadi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Savolni tanlang', ru: 'Выберите вопрос' })} (${qadam}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Bitta o'yinchidan <A>nimani bilib olasiz?</A></>, ru: <>Что вы <A>узнаете</A> от одного игрока?</> })}
        mentor={<Mentor>{tr({ uz: "Savolni siz tanlaysiz, o'sha o'yinchi javob beradi. Javob shablonning qaysi qatoriga tushishini kuzating.", ru: 'Вопрос выбираете вы, тот же игрок отвечает. Следите, в какую строку шаблона попадёт ответ.' })}</Mentor>}
        harakat={!done && <div className="fi-s4-chap">
          <QQadamlar qadamlar={S4_QADAMLAR.map(s => tr(s4Nom(s.kalit)))} joriy={qadam} />
          <div className="fi-tanlov">{S4_QADAMLAR[qadam].savollar.map((q, i) => {
            const k = `${qadam}-${i}`;
            return <QChip key={k} holat={ochiq[k] ? 'err' : (tush && pufak && pufak.k === k ? 'ok' : undefined)} disabled={!!ochiq[k] || tush} onClick={() => bos(i)}>«{tr(q.s)}»</QChip>;
          })}</div>
          {ipucha && <QIzoh>{tr({ uz: "Qaysi savolning javobida kun yoki qilingan ish bo'ladi?", ru: 'В ответе на какой вопрос будет день или сделанное дело?' })}</QIzoh>}
          <AchRule screen={screen} />
        </div>}
        vizual={<div className={cxx('fi-s4', done && 'tola')}>
          {!done && <Suhbatdosh rol="oyinchi" pufaklar={pufak ? [pufak] : []} />}
          <div className="fi-s4-karta">
            <ShablonKarta yorliq={done ? tr({ uz: 'intervyu yozuvi', ru: 'запись интервью' }) : null} qatorlar={qatorlar} holat={joriyK ? { [joriyK]: 'joriy' } : {}} yangi={yangi} toliq={done} />
            {done && <Izlar n={1} />}
          </div>
        </div>}
        natija={done && <QIzoh>{tr({ uz: <>Bitta odam bilan shunday suhbat — <b>intervyu</b>. To'ldirilgan shablon — <b>yozuv</b>.</>, ru: <>Такой разговор с одним человеком — <b>интервью</b>. Заполненный шаблон — <b>запись</b>.</> })}</QIzoh>}
        xulosa={tugadi && tr({ uz: "Bitta yozuv — bitta odamning voqeasi. Bu modulda besh odam bilan gaplashib, takrorini qidiramiz.", ru: 'Одна запись — событие одного человека. В этом модуле поговорим с пятью людьми и поищем повторы.' })}
      >
        <MentorNote>{tr({ uz: "«Suhbat» so'zi «Botingizni ishlatgan odamdan nimani so'raysiz?» darsidagi ma'noda; bu yerda u nom oladi — intervyu.", ru: 'Слово «разговор» — в том же смысле, что на уроке «Что спросить у человека, который пользовался вашим ботом?»; здесь он получает имя — интервью.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 0): iqtibos o'yinchi pufagida · tanlagach kichik shablonda «O'shanda nima qildi?» qatori yonadi =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · keyingi savol', ru: 'Проверка · следующий вопрос' })}
    ustVizual={(st) => <div className="fi-iqtibos">
      <Suhbatdosh rol="oyinchi" pufaklar={[{ t: tr({ uz: 'Kelsak, maydon band ekan.', ru: 'Пришли — а поле занято.' }), k: 's5' }]} />
      {st.picked !== null && <ShablonKarta ixcham key={`${st.picked}-${st.solved}`} qatorlar={{ kim: tr(ROL.oyinchi), voqea: tr({ uz: 'Kelsak, maydon band ekan.', ru: 'Пришли — а поле занято.' }) }}
        holat={{ qildi: st.waiting ? 'joriy' : st.togri ? 'ok' : 'xato' }} />}
    </div>}
    questionText="Keyingi savolingiz qaysi?"
    question={tr({ uz: <h2 className="title h-ask">Keyingi <A>savolingiz</A> qaysi?</h2>, ru: <h2 className="title h-ask">Какой ваш <A>следующий вопрос</A>?</h2> })}
    options={[
      { uz: "«Maydon band ekan — o'shanda nima qildingiz?»", ru: '«Поле было занято — что вы тогда сделали?»' },
      { uz: "«Sayt bo'lsa, maydonni band qilarmidingiz?»", ru: '«Если бы был сайт, вы бы бронировали поле?»' },
      { uz: "«Maydonlar ko'pincha band bo'ladi, shundaymi?»", ru: '«Поля часто заняты, правда?»' },
      { uz: "«Keyingi safar qachon borishni o'ylayapsiz?»", ru: '«Когда думаете пойти в следующий раз?»' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Savol o'sha voqeani davom ettiradi — shablonning keyingi qatori yoziladi.", ru: 'Вопрос продолжает то же событие — пишется следующая строка шаблона.' }}
    explainWrong={{
      1: { uz: "Bu sayt hali yo'q — javobi va'da bo'ladi.", ru: 'Этого сайта ещё нет — ответ будет обещанием.' },
      2: { uz: "Javobni savolning o'zi aytdi — u «ha» deydi.", ru: 'Ответ сказал сам вопрос — он скажет «да».' },
      3: { uz: "Bu kelajakni so'rayapti — voqeadan chiqib ketdingiz.", ru: 'Это вопрос о будущем — вы ушли от события.' },
      default: { uz: "O'sha voqeani davom ettiradigan savolni toping.", ru: 'Найдите вопрос, который продолжает то же событие.' }
    }} />
);

// ===== SCREEN 6 — KITOBDAN · THE MOM TEST (QVoqea, PM-028 ramkasi «Kitobdan»: nuqtalar · bosqich gapi Mentorda (SABOQ 8) · KitobSahna · 2 bashorat, S-015) =====
// manba: Rob Fitzpatrick, «The Mom Test: how to talk to customers and learn if your business is a good idea when everyone is lying to you», v1.06
// (Launched: August, 2013; Revised: August, 2014), foundercentric.com; 1-bob «The Mom Test», 11–17-betlar: «digital cookbooks for the iPad» ·
// «that sounds amazing. And you're right, $40 is a good deal» · «nobody (even his mom) buys it» · «What do you usually do on it?» → «Read the news, play sudoku…» ·
// «What's the last cookbook you did buy for yourself?» → «I bought a vegan cookbook about 3 months ago» · «Mom was unable to lie to us because we never talked about our idea».
// «vegan» → «go'shtsiz» (MD 6-ekran izohi). Kitobdagi ona — muallif tuzgan misol.
const MOM_INTRO = { uz: "«The Mom Test» — Rob Fitzpatrick degan tadbirkorning odamlar bilan qanday gaplashish haqidagi kitobi. U 2013-yilda chiqqan.", ru: '«The Mom Test» — книга предпринимателя Роба Фитцпатрика о том, как разговаривать с людьми. Она вышла в 2013 году.' };
const MOM_SLIDES = [
  { h: { uz: 'Kitob bitta misol bilan boshlanadi', ru: 'Книга начинается с одного примера' }, m: { uz: "Muallif o'zi ham odamlar bilan noto'g'ri gaplashganini yozadi. Kitobda o'g'il onasi bilan ikki marta gaplashadi.", ru: 'Автор пишет, что и сам неправильно разговаривал с людьми. В книге сын дважды говорит с мамой.' }, cap: { uz: 'Kitob · 2013', ru: 'Книга · 2013' } },
  { m: { uz: "O'g'il g'oyasini aytadi: planshetda ochiladigan taomlar kitobi.", ru: 'Сын рассказывает идею: книга рецептов, которая открывается на планшете.' }, savol: { uz: 'Onasi nima deydi?', ru: 'Что скажет мама?' }, togri: 'c',
    v: [{ k: 'a', t: { uz: '«Menga kerak emas»', ru: '«Мне это не нужно»' } }, { k: 'b', t: { uz: "«Bilmadim, ko'rish kerak»", ru: '«Не знаю, надо посмотреть»' } }, { k: 'c', t: { uz: '«Ajoyib ekan, narxi ham yaxshi»', ru: '«Здорово, и цена хорошая»' } }], cap: { uz: 'Birinchi suhbat', ru: 'Первый разговор' } },
  { h: { uz: "Ona g'oyani maqtadi", ru: 'Мама похвалила идею' }, m: { uz: "Ona yolg'on gapirmoqchi emas edi: o'g'lini xafa qilmaslik uchun maqtadi. O'g'il ilovani qurdi — uni hech kim, hatto onasi ham olmadi.", ru: 'Мама не хотела врать: похвалила, чтобы не обидеть сына. Сын сделал приложение — его никто не купил, даже мама.' }, cap: { uz: 'Maqtov', ru: 'Похвала' } },
  { m: { uz: "Ikkinchi suhbatda o'g'il boshqa savollar beradi.", ru: 'Во втором разговоре сын задаёт другие вопросы.' }, savol: { uz: "Qaysi biri ko'proq narsa ochadi?", ru: 'Какой из них откроет больше?' }, togri: 'c',
    v: [{ k: 'a', t: { uz: '«Taomlar ilovasi sizga kerakmi?»', ru: '«Вам нужно приложение с рецептами?»' } }, { k: 'b', t: { uz: '«Planshetda odatda nima qilasiz?»', ru: '«Что вы обычно делаете на планшете?»' } }, { k: 'c', t: { uz: '«O\'zingizga oxirgi marta qaysi kitobni oldingiz?»', ru: '«Какую книгу вы в последний раз купили себе?»' } }],
    izoh: { uz: "«Odatda» savoliga ona umumiy javob bergan: yangiliklar, o'yinlar.", ru: 'На вопрос «обычно» мама ответила общими словами: новости, игры.' }, cap: { uz: 'Ikkinchi suhbat', ru: 'Второй разговор' } },
  { h: { uz: "«Oxirgi marta» savoli voqeani ochdi", ru: 'Вопрос «в последний раз» открыл событие' }, m: { uz: "Uch oy oldin ona o'zi uchun go'shtsiz taomlar kitobini olgan. G'oya aytilmagani uchun u maqtamadi — voqeani aytdi.", ru: 'Три месяца назад мама купила себе книгу блюд без мяса. Идею ей не рассказали, поэтому она не хвалила — рассказала случай.' }, cap: { uz: '3 oy oldin', ru: '3 месяца назад' } }
];
const KITOB_ARIA = [
  { uz: "Kitob muqovasi: The Mom Test, Rob Fitzpatrick. Muqova ochilib, oshxona ko'rinadi", ru: 'Обложка книги: The Mom Test, Rob Fitzpatrick. Обложка открывается — видна кухня' },
  { uz: "Oshxona: o'g'il onasiga planshetdagi taomlar kitobini ko'rsatyapti", ru: 'Кухня: сын показывает маме книгу рецептов на планшете' },
  { uz: "Ona «Ajoyib ekan!» deydi — bu baho", ru: 'Мама говорит «Здорово!» — это оценка' },
  { uz: "O'g'il planshetni qo'ydi va javondagi kitoblarga ishora qilyapti", ru: 'Сын положил планшет и показывает на книги на полке' },
  { uz: 'Javonda bitta kitob ochildi: uch oy oldin olingan', ru: 'На полке открылась одна книга: куплена три месяца назад' }
];
const KitobSahna = ({ b }) => (
  <div className={cxx('fi-ks', `b${b}`)} role="img" aria-label={tr(KITOB_ARIA[b])}>
    <div className="fi-ks-oshxona">
      <div className="fi-ks-deraza" aria-hidden="true"><i /><i /></div>
      <div className="fi-ks-javon"><i /><i /><i /><i className="tanla" /><i /><i /><i /></div>
      {b >= 4 && <div className="fi-ks-ochkitob"><span className="fi-ks-varaq" /><span className="fi-ks-varaq" /><span className="fi-ks-belgi">{tr({ uz: '3 oy oldin', ru: '3 месяца назад' })}</span></div>}
      {b === 3 && <span className="fi-ks-ishora" aria-hidden="true" />}
      <div className="fi-ks-stol"><span className="fi-ks-piyola" /></div>
      <div className="fi-ks-odam ona"><Siluet /><span className="fi-ks-rol">{tr({ uz: 'ona', ru: 'мама' })}</span></div>
      <div className="fi-ks-odam ogil"><Siluet /><span className="fi-ks-rol">{tr({ uz: "o'g'il", ru: 'сын' })}</span></div>
      <div className="fi-ks-planshet"><i /><i /><i /><i /></div>
      {b === 2 && <div className="fi-ks-pufak"><span className="fi-pufak">«{tr({ uz: 'Ajoyib ekan!', ru: 'Здорово!' })}»</span><span className="fi-tur">{tr(TUR.baho)}</span></div>}
    </div>
    {b === 0 && <div className="fi-ks-muqova" aria-hidden="true"><span className="fi-ks-m-t">The Mom Test</span><span className="fi-ks-m-c" /><span className="fi-ks-m-s">Rob Fitzpatrick</span></div>}
    <span key={b} className="fi-ks-cap">{tr(MOM_SLIDES[b].cap)}</span>
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 4 : 0);
  const [tx, setTx] = useState(() => ({ 1: storedAnswer?.taxmin1 ?? null, 3: storedAnswer?.taxmin2 ?? null }));
  const done = b >= 4;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin1: tx[1], taxmin2: tx[3] }); }, [done]); // eslint-disable-line
  useXulosaSkroll(done, storedAnswer);
  const bq = MOM_SLIDES[b];
  const kutish = !!bq.savol && !tx[b];
  const keyingi = () => { if (b < 4) setB(b + 1); else onNext(); };
  const yorliq = `The Mom Test · ${b + 1}/5`;
  const tanlov = bq.savol ? tx[b] : null;
  const tv = bq.savol && bq.v.find(x => x.k === tanlov);
  return (
    <Stage eyebrow={tr({ uz: 'Kitobdan', ru: 'Из книги' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={b < 4 ? `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/5)` : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <>Onangiz ham <A>rostini aytadigan</A> savol qanday bo'ladi?</>, ru: <>Какой вопрос заставит <A>даже маму сказать правду</A>?</> })}
        nuqtalar={<>
          <Mentor key={`m${b}`}>{b === 0 ? <>{tr(MOM_INTRO)}<br />{tr(bq.m)}</> : tr(bq.m)}</Mentor>
          <div className="fi-nuqtalar"><span className="fi-nuq-l">{yorliq}</span>{MOM_SLIDES.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} title={i > b ? tr({ uz: 'Avval shu bosqichni tugating', ru: 'Сначала завершите этот этап' }) : undefined} />)}</div>
        </>}
        karta={<div className="fi-voqea" key={b}>
          {bq.h && <span className="fi-voqea-h">{tr(bq.h)}</span>}
          <Zoomable><KitobSahna b={b} /></Zoomable>
          {bq.savol && <QBashorat yorliq={yorliq} savol={tr(bq.savol)}
            variantlar={bq.v.map(x => ({ k: x.k, t: tanlov === x.k ? `${x.k === bq.togri ? '✓' : '✗'} ${tr(x.t)}` : tr(x.t) }))} tanlov={tanlov} onTanla={(k) => setTx(o => ({ ...o, [b]: k }))} />}
          {tv && <Taxmin togriMi={tanlov === bq.togri} tanlov={tr(tv.t)} haqiqat={tr(bq.v.find(x => x.k === bq.togri).t)} />}
          {tv && bq.izoh && <QIzoh>{tr(bq.izoh)}</QIzoh>}
          {done && <QXulosa>{tr({ uz: "Kitob nomi shundan: ona ham rostini aytadigan savollar. Maydon intervyusida ham oxirgi voqea so'raladi.", ru: 'Отсюда название книги: вопросы, на которые даже мама скажет правду. В интервью о поле тоже спрашивают о последнем событии.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "«Rostini aytadi» — kitob nomidan; gap yolg'onda emas: g'oyani eshitgan odam muloyimlik qilib maqtaydi yoki kelajakni taxmin qiladi, o'tgan voqeani so'rasangiz — aniqroq javob olasiz. Kitobdagi ona — muallif tuzgan misol, real voqea emas; bashoratlardan keyin buni sinfga ayting. Kitobdagi qoidalar real: g'oya o'rniga odamning hayoti, kelajak o'rniga o'tgan aniq voqea, kamroq gapirib ko'proq tinglash.", ru: '«Скажет правду» — из названия книги; дело не во лжи: услышав идею, человек из вежливости хвалит или гадает о будущем, а спросив о прошлом событии, вы получите более точный ответ. Мама в книге — пример, придуманный автором, не реальный случай; скажите это классу после предсказаний. Правила книги реальны: вместо идеи — жизнь человека, вместо будущего — конкретное прошлое событие, говорить меньше и больше слушать.' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 3; kitob qoidasi maydon egasiga) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · kitobdagidek', ru: 'Проверка · как в книге' })}
    questionText="Kitobdagi o'g'ildek, maydon egasiga qaysi savolni berasiz?"
    question={tr({ uz: <h2 className="title h-ask">Kitobdagi o'g'ildek, maydon egasiga <A>qaysi savolni</A> berasiz?</h2>, ru: <h2 className="title h-ask">Какой вопрос, как сын из книги, вы <A>зададите владельцу поля</A>?</h2> })}
    options={[
      { uz: "«Band qilish saytim sizga foydali bo'ladimi?»", ru: '«Мой сайт для брони будет вам полезен?»' },
      { uz: "«Saytim bo'lsa, unga pul to'lab turarmidingiz?»", ru: '«Если будет мой сайт, вы бы за него платили?»' },
      { uz: '«Odatda kim band qilganini qayerga yozasiz?»', ru: '«Куда вы обычно записываете, кто забронировал?»' },
      { uz: '«Kecha kim band qilganini qayerga yozdingiz?»', ru: '«Куда вы вчера записали, кто забронировал?»' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Kitobdagidek: g'oya aytilmadi, kechagi voqea so'raldi.", ru: 'Как в книге: идею не назвали, спросили о вчерашнем событии.' }}
    explainWrong={{
      0: { uz: "Bu savol g'oyangizga baho so'rayapti.", ru: 'Этот вопрос просит оценить вашу идею.' },
      1: { uz: "Bu sayt hali yo'q — javobi va'da bo'ladi.", ru: 'Этого сайта ещё нет — ответ будет обещанием.' },
      2: { uz: '«Odatda» savoliga umumiy javob keladi.', ru: 'На вопрос «обычно» приходит общий ответ.' },
      default: { uz: "G'oyasiz, o'tgan kunni so'raydigan savolni toping.", ru: 'Найдите вопрос без идеи — о прошедшем дне.' }
    }} />
);

// ===== SCREEN 8 — SHABLONNI TAYYORLASH (QMustaqil): 1-dars natijasini o'qiydi · uch qadam · RegExp tekshiruv · artefakt pm-m7d2-shablon · nishon readyToAsk =====
const RE_KELAJAK = /(bo'lsa|rmidingiz|kelasi|keyingi)/;
const RE_GOYA = /(^|[^a-z'])(sayt|ilova|bot|g'oya)/;
const RE_HA = /(shundaymi|to'g'rimi)/;
const RE_KENG = /(^|[^a-z'])(hamma|odamlar|har kim)([^a-z']|$)/;
const RE_XULOSA = /(^|[^a-z'])(kerak|hamma|ko'pchilik|odatda)/;
const XABAR = {
  keng: { uz: '"Hamma" — juda keng. Aynan kim duch keladi?', ru: '«Все» — слишком широко. Кто именно с этим сталкивается?' },
  kelajak: { uz: "Bu ish hali bo'lmagan — o'tgan kunni so'rang.", ru: 'Этого ещё не было — спросите о прошедшем дне.' },
  goya: { uz: "Savolda g'oyangiz bor — odamning o'zi haqida so'rang.", ru: 'В вопросе есть ваша идея — спросите о самом человеке.' },
  ha: { uz: 'Bunga odam shunchaki «ha» deydi.', ru: 'На это человек просто скажет «да».' },
  xulosa: { uz: "Bu xulosaga o'xshaydi — u aytganidek yozing.", ru: 'Похоже на вывод — запишите так, как он сказал.' }
};
const savolTuri = (v) => { const n = norm(v); if (RE_KELAJAK.test(n)) return 'kelajak'; if (RE_GOYA.test(n)) return 'goya'; if (RE_HA.test(n)) return 'ha'; return null; };
const QADAM8 = [
  { k: 'muammo', nom: { uz: 'Muammo', ru: 'Проблема' }, ip: { uz: 'Qaysi muammo haqida so\'raysiz?', ru: 'О какой проблеме спросите?' } },
  { k: 'kimdan', nom: { uz: "Kimdan so'raysiz", ru: 'Кого спросите' }, ip: { uz: 'Bu muammoga kim duch keladi?', ru: 'Кто сталкивается с этой проблемой?' } },
  { k: 'savol1', nom: { uz: 'Birinchi savol', ru: 'Первый вопрос' }, ip: { uz: "Oxirgi marta nima bo'lganini qanday so'raysiz?", ru: 'Как спросите, что было в последний раз?' } }
];
const SAR_MUAMMO = { uz: 'Muammo', ru: 'Проблема' };
const SAR_KIMDAN = { uz: "Kimdan so'rayman", ru: 'Кого спрошу' };
const MAYDON_SHABLON = { muammo: { uz: "Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak.", ru: 'Приходите на поле — занято; чтобы узнать свободное время, нужно звонить владельцу.' }, kimdan: { uz: "o'yinchi va maydon egasi", ru: 'игрок и владелец поля' }, savol1: S2_SAVOLLAR[0].s };
const shablonSavollar = (savol1) => ({ voqea: savol1, qildi: tr(SHABLON[2].savol), qiyin: tr(SHABLON[3].savol) });
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [tanlangan] = useState(() => { const v = lsGet(KEY_TANLANGAN); return v && v.matn ? v : null; });
  const [royxat] = useState(() => { const v = lsGet(KEY_MUAMMOLAR); return v && Array.isArray(v.muammolar) ? v.muammolar.filter(m => m && m.matn).map(m => m.matn).slice(0, 10) : []; });
  const [d, setD] = useState(() => { const v = lsGet(KEY_SHABLON); return v && v.savol1 ? v : {}; });
  const [r, setR] = useState(() => (d.savol1 ? 3 : 0));
  const [tahrir, setTahrir] = useState(false);
  const [val, setVal] = useState(() => (d.savol1 ? '' : (tanlangan ? tanlangan.matn : '')));
  const [xato, setXato] = useState(null);
  const [otdi, setOtdi] = useState(false);
  const [yordam, setYordam] = useState(false);
  const done = r >= 3;
  useXulosaSkroll(done && !tahrir, storedAnswer || d.savol1);
  const ochQadam = (i) => { setR(i); setTahrir(true); setVal(d[QADAM8[i].k] || ''); setXato(null); setOtdi(false); };
  const yoz = () => {
    const q = QADAM8[r];
    const v = val.trim();
    if (!v) return;
    let tur = null;
    if (q.k === 'kimdan' && RE_KENG.test(norm(v))) tur = 'keng';
    if (q.k === 'savol1') tur = savolTuri(v);
    if (tur) { setXato(tur); return; }
    setXato(null);
    const nd = { ...d, [q.k]: v };
    setD(nd);
    if (q.k === 'savol1') setOtdi(true);
    if (tahrir || r === 2) {
      setR(3); setTahrir(false); setVal('');
      if (nd.muammo && nd.kimdan && nd.savol1) {
        lsSet(KEY_SHABLON, { muammo: nd.muammo, kimdan: nd.kimdan, savol1: nd.savol1 });
        if (storedAnswer === undefined) {
          onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'shablon', correct: true, picked: true, solved: true });
          if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
        }
      }
      return;
    }
    setR(r + 1); setVal(d[QADAM8[r + 1].k] || '');
  };
  const qk = QADAM8[Math.min(r, 2)].k;
  const ed = done && !tahrir && !isMentor;
  const bosh = isMentor
    ? [{ k: tr(SAR_MUAMMO), v: tr(MAYDON_SHABLON.muammo) }, { k: tr(SAR_KIMDAN), v: tr(MAYDON_SHABLON.kimdan) }]
    : [
      d.muammo && { k: tr(SAR_MUAMMO), v: d.muammo, holat: !done || tahrir ? (qk === 'muammo' ? 'joriy' : undefined) : undefined, onTahrir: ed ? () => ochQadam(0) : undefined },
      d.kimdan && { k: tr(SAR_KIMDAN), v: d.kimdan, holat: qk === 'kimdan' && (!done || tahrir) ? (xato ? 'xato' : 'joriy') : undefined, onTahrir: ed ? () => ochQadam(1) : undefined }
    ].filter(Boolean);
  const karta = (
    <ShablonKarta bosh={bosh} className={cxx(done && !tahrir && !isMentor ? 'q-fokus' : 'ustun')}
      savollar={shablonSavollar(isMentor ? tr(MAYDON_SHABLON.savol1) : d.savol1)}
      holat={!isMentor && qk === 'savol1' && (!done || tahrir) ? { voqea: xato ? 'xato' : 'joriy' } : {}}
      onTahrir={ed ? { voqea: () => ochQadam(2) } : {}} />
  );
  const kirishQ = tanlangan
    ? tr({ uz: <>O'tgan darsda tanlagan muammongiz: «{tanlangan.matn}». Shu bilan davom etasiz yoki ro'yxatingizdan boshqasini tanlaysiz.</>, ru: <>Проблема, которую вы выбрали на прошлом уроке: «{tanlangan.matn}». Продолжите с ней или выберите другую из своего списка.</> })
    : tr({ uz: 'Atrofingizdagi bitta muammoni yozing.', ru: 'Напишите одну проблему вокруг вас.' });
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!(done && !tahrir) && !isMentor} label={(done && !tahrir) || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Uch qadamni yozing', ru: 'Напишите три шага' })} (${Math.min(r, 3)}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Muammongiz bo'yicha <A>kimdan nimani</A> so'raysiz?</>, ru: <>Кого и о чём <A>вы спросите</A> по своей проблеме?</> })}
        mentor={<Mentor>{tr({ uz: "Muammoga kim duch kelsa, o'shandan so'raysiz — maydonda bular o'yinchi va maydon egasi edi. Savolda g'oyangiz bo'lmasin.", ru: 'Спрашиваете того, кто сталкивается с проблемой, — на поле это были игрок и владелец поля. В вопросе не должно быть вашей идеи.' })}</Mentor>}
        qadamlar={!isMentor && (!done || tahrir) && <div className="fi-mus-bosh">
          {r === 0 && !tahrir && <p className="fi-kirish-q">{kirishQ}</p>}
          <QadamChip nomlar={QADAM8.map(q => tr(q.nom))} joriy={r} />
        </div>}
        forma={!isMentor && (!done || tahrir) && <div className="fi-forma">
          <label className="fi-forma-l">{tr(QADAM8[r].ip)}</label>
          <GrowInput key={r} value={val} onChange={e => { setVal(e.target.value); setXato(null); }} onEnter={yoz} placeholder={tr(QADAM8[r].ip)} maxLength={160} aria-label={tr(QADAM8[r].ip)} className={cxx(xato && 'xato', !val.trim() && 'chorla')} />
          {r === 0 && royxat.length > 0 && <div className="fi-ro">{royxat.map((m, i) => <button key={i} type="button" className={cxx('fi-ro-q', norm(val) === norm(m) && 'on')} title={m} onClick={() => setVal(m)}>{m}</button>)}</div>}
          {xato && <QXato>{tr(XABAR[xato])}</QXato>}
          <div className="fi-amal"><QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma><QTugma className={val.trim() ? 'fi-bos' : undefined} disabled={!val.trim()} onClick={yoz}>{tr({ uz: 'Shablonga yozish', ru: 'Записать в шаблон' })}</QTugma></div>
        </div>}
        yordam={!isMentor && (!done || tahrir) && yordam && <QIzoh>{tr({ uz: "Savolni «Oxirgi marta … qachon bo'ldi?» yoki «Oxirgi marta … bo'lganda nima bo'ldi?» deb boshlang. Muammoning ikki tomoni bo'lsa, ikkalasidan ham so'rang.", ru: 'Начните вопрос с «Когда в последний раз …?» или «Что было в последний раз, когда …?». Если у проблемы две стороны, спросите обе.' })}</QIzoh>}
      >
        {(d.muammo || isMentor) && karta}
        {(d.savol1 || isMentor) && <QIzoh>{tr({ uz: "Uch savol — boshlash uchun tayanch. Odam qiziq narsa aytsa, o'sha joyni davom ettiring: «Keyin nima bo'ldi?» · «Nega shunday qildingiz?»", ru: 'Три вопроса — опора для начала. Если человек скажет что-то интересное, продолжайте с этого места: «А что было потом?» · «Почему вы так сделали?»' })}</QIzoh>}
        {otdi && !isMentor && <p className="fi-ok fade-step">{tr({ uz: "Savol o'tgan voqeani so'rayapti — shablonga yozildi.", ru: 'Вопрос спрашивает о прошедшем событии — записано в шаблон.' })}</p>}
        {done && !tahrir && !isMentor && <QXulosa>{tr({ uz: "Shablon tayyor: savolingiz g'oyani emas, odamning oxirgi voqeasini so'raydi.", ru: 'Шаблон готов: ваш вопрос спрашивает не об идее, а о последнем событии человека.' })}</QXulosa>}
        {isMentor && <MentorPracticeStats live={live} screen={screen} />}
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 9 — JUFTLIKDA INTERVYU (QMustaqil): 8-ekran shabloni bilan · eshitgan javob — u aytganidek · artefakt pm-m7d2-mashq · nishon interviewer =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const yakka = yakkaMi(live);
  const [shablon] = useState(() => lsGet(KEY_SHABLON) || {});
  const [y, setY] = useState(() => { const v = lsGet(KEY_MASHQ); return v && v.qiyin ? v : { kim: null }; });
  const KAL = ['voqea', 'qildi', 'qiyin'];
  const [r, setR] = useState(() => (y.qiyin ? 3 : 0));
  const [tahrir, setTahrir] = useState(false);
  const [kimEd, setKimEd] = useState(false);
  const [val, setVal] = useState('');
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [yangi, setYangi] = useState(null);
  const done = r >= 3;
  useXulosaSkroll(done && !tahrir, storedAnswer || y.qiyin);
  const kimV = y.kim || tr(yakka ? ROL.yonida : ROL.sinfdosh); // standart qiymat rejimga qarab (o'zgartirilmaguncha joriy tilda)
  const savol1 = shablon.savol1 || tr(SHABLON[1].nom);
  const SAVOL9 = [savol1, tr(SHABLON[2].savol), tr(SHABLON[3].savol)];
  const saqla = (ny) => {
    lsSet(KEY_MASHQ, { kim: ny.kim || kimV, voqea: ny.voqea, qildi: ny.qildi, qiyin: ny.qiyin });
    if (storedAnswer === undefined) {
      onAnswer(screen, { stage: 'juftlik', screenIdx: screen, practice: 'mashq', correct: true, picked: true, solved: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qosh = () => {
    const v = val.trim();
    if (!v) return;
    if (RE_XULOSA.test(norm(v)) && !(xato && xato.v === v)) { setXato({ v }); return; }
    setXato(null);
    const k = KAL[r];
    const ny = { ...y, [k]: v };
    setY(ny); setYangi(k);
    if (tahrir || r === 2) { setR(3); setTahrir(false); setVal(''); if (ny.voqea && ny.qildi && ny.qiyin) saqla(ny); return; }
    setR(r + 1); setVal(ny[KAL[r + 1]] || '');
  };
  const ochQadam = (i) => { setR(i); setTahrir(true); setVal(y[KAL[i]] || ''); setXato(null); };
  const ed = done && !tahrir && !isMentor;
  const qatorlar = isMentor ? {} : { kim: kimEd ? undefined : kimV, voqea: y.voqea, qildi: y.qildi, qiyin: y.qiyin };
  const holat = {};
  if (!isMentor && (!done || tahrir)) holat[KAL[r]] = xato ? 'xato' : 'joriy';
  KAL.forEach(k => { if (y[k] && !holat[k]) holat[k] = 'ok'; });
  return (
    <Stage eyebrow={tr({ uz: 'Juftlikda · mashq intervyu', ru: 'В паре · тренировочное интервью' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!(done && !tahrir) && !isMentor} label={(done && !tahrir) || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Uch qatorni yozing', ru: 'Напишите три строки' })} (${Math.min(r, 3)}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Sinfdoshingizdan <A>nimani eshitasiz?</A></>, ru: <>Что вы <A>услышите</A> от одноклассника?</> })}
        mentor={<Mentor>{yakka
          ? tr({ uz: 'Yoningizdagi bir odamga savollaringizni bering. Javobni o\'sha zahoti, u aytganidek yozing.', ru: 'Задайте свои вопросы человеку рядом. Ответ записывайте сразу, так, как он сказал.' })
          : tr({ uz: "Avval siz so'raysiz, keyin sherigingiz sizdan so'raydi. Javobni o'sha zahoti, u aytganidek yozing.", ru: 'Сначала спрашиваете вы, потом партнёр спрашивает вас. Ответ записывайте сразу, так, как он сказал.' })}</Mentor>}
        qadamlar={!isMentor && (!done || tahrir) && <div className="fi-mus-bosh"><QadamChip nomlar={KAL.map(k => tr(s4Nom(k)))} joriy={r} /></div>}
        forma={!isMentor && (!done || tahrir) && <div className="fi-forma">
          <p className="fi-forma-savol">«{SAVOL9[r]}»</p>
          <GrowInput key={r} value={val} onChange={e => { setVal(e.target.value); }} onEnter={qosh} placeholder={tr({ uz: 'U nima dedi?', ru: 'Что он сказал?' })} maxLength={200} aria-label={tr({ uz: 'U nima dedi?', ru: 'Что он сказал?' })} className={cxx(xato && 'xato', !val.trim() && 'chorla')} />
          {xato && <QXato>{tr(XABAR.xulosa)}</QXato>}
          <div className="fi-amal">
            <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma>
            {!val.trim() && <span className="fi-qulf">{tr({ uz: 'Sinfdoshingiz nima dedi — shuni yozing.', ru: 'Что сказал одноклассник — это и запишите.' })}</span>}
            <QTugma className={val.trim() ? 'fi-bos' : undefined} onClick={qosh}>{tr({ uz: "Yozuvga qo'shish", ru: 'Добавить в запись' })}</QTugma>
          </div>
        </div>}
        yordam={!isMentor && (!done || tahrir) && yordam && <QIzoh>{tr({ uz: "Sinfdoshingizda bu voqea bo'lmagan bo'lsa — shuni yozing: bu ham javob. Kitobdagi yana bir qoida: kamroq gapiring, ko'proq tinglang.", ru: 'Если у одноклассника такого не было — так и запишите: это тоже ответ. Ещё одно правило из книги: говорите меньше, слушайте больше.' })}</QIzoh>}
      >
        <ShablonKarta className={cxx(done && !tahrir && !isMentor ? 'q-fokus' : 'ustun')} yorliq={done && !tahrir ? tr({ uz: 'mashq yozuvi', ru: 'тренировочная запись' }) : null}
          savollar={shablonSavollar(isMentor ? tr(MAYDON_SHABLON.savol1) : savol1)} qatorlar={qatorlar} holat={holat} yangi={yangi} toliq={done && !tahrir && !isMentor}
          onTahrir={isMentor ? {} : { kim: () => setKimEd(true), ...(ed ? { voqea: () => ochQadam(0), qildi: () => ochQadam(1), qiyin: () => ochQadam(2) } : {}) }}>
          {kimEd && <div className="fi-kim-ed"><GrowInput value={y.kim ?? kimV} autoFocus onChange={e => setY(o => ({ ...o, kim: e.target.value }))} onEnter={() => { setKimEd(false); if (done) lsSet(KEY_MASHQ, { ...y, kim: y.kim || kimV }); }} onBlur={() => { setKimEd(false); if (done) lsSet(KEY_MASHQ, { ...y, kim: y.kim || kimV }); }} aria-label={tr(SHABLON[0].nom)} maxLength={60} /></div>}
        </ShablonKarta>
        {done && !tahrir && !isMentor && <QXulosa>{tr({ uz: 'Mashq yozuvi tayyor: har qatorda eshitgan javob, u aytganidek.', ru: 'Тренировочная запись готова: в каждой строке — услышанный ответ, так, как он сказал.' })}</QXulosa>}
        {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        <MentorNote>{tr({ uz: "Juftlikka 6 daqiqa — 3 daqiqa birinchisi so'raydi, 3 daqiqa ikkinchisi. Sherigida voqea bo'lmasa, bu ham yozuv: «muammo unda yo'q» degani.", ru: 'На пару 6 минут — 3 минуты спрашивает первый, 3 минуты второй. Если у партнёра такого события не было, это тоже запись: значит, «у него этой проблемы нет».' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — KOD YOZISH (QKod + HtmlCompiler; darvoza-mashq PM-082 c/e; kod nusxalanmaydi PM-082 d; «kompilyator» ta'riflanmaydi) =====
const KOD_STARTER = { uz: `// Maydon intervyulari — uchta yozuv
const yozuvlar = [
  { kim: "o'yinchi",
    voqea: "O'tgan shanba bordik — maydon band ekan",
    qildi: "Egasiga qo'ng'iroq qildik — ko'tarmadi",
    qiyin: "Yarim soat yo'l yurib keldik — bekorga" },
  { kim: "maydon egasi",
    voqea: "Kecha bir soatga uch kishi qo'ng'iroq qildi",
    qildi: "",
    qiyin: "Kim birinchi qo'ng'iroq qilganini eslay olmadim" },
  { kim: "o'yinchi", voqea: "", qildi: "", qiyin: "" }
];

function yozilmagan(yozuv) {
  // yozilmagan qatorlarning nomini ro'yxatga yig'ing
  return [];   // shu joyni siz yozasiz
}

console.log(yozilmagan(yozuvlar[0]));
// []
console.log(yozilmagan(yozuvlar[1]));
// ["qildi"]
console.log(yozilmagan(yozuvlar[2]));
// ["voqea", "qildi", "qiyin"]
`, ru: `// Интервью о поле — три записи
const yozuvlar = [
  { kim: "o'yinchi",
    voqea: "O'tgan shanba bordik — maydon band ekan",
    qildi: "Egasiga qo'ng'iroq qildik — ko'tarmadi",
    qiyin: "Yarim soat yo'l yurib keldik — bekorga" },
  { kim: "maydon egasi",
    voqea: "Kecha bir soatga uch kishi qo'ng'iroq qildi",
    qildi: "",
    qiyin: "Kim birinchi qo'ng'iroq qilganini eslay olmadim" },
  { kim: "o'yinchi", voqea: "", qildi: "", qiyin: "" }
];

function yozilmagan(yozuv) {
  // соберите в список названия незаполненных строк
  return [];   // это место пишете вы
}

console.log(yozilmagan(yozuvlar[0]));
// []
console.log(yozilmagan(yozuvlar[1]));
// ["qildi"]
console.log(yozilmagan(yozuvlar[2]));
// ["voqea", "qildi", "qiyin"]
` };
const KOD_DATA = `[{kim:"o'yinchi",voqea:"O'tgan shanba bordik",qildi:"Egasiga qo'ng'iroq qildik",qiyin:"Yarim soat yo'l yurib keldik"},{kim:"maydon egasi",voqea:"Kecha bir soatga uch kishi qo'ng'iroq qildi",qildi:"",qiyin:"Kim birinchi qo'ng'iroq qilganini eslay olmadim"},{kim:"o'yinchi",voqea:"",qildi:"",qiyin:""}]`;
const KOD_VAZIFA = [
  { uz: "Funksiya ro'yxat (massiv) qaytaradi", ru: 'Функция возвращает список (массив)' },
  { uz: "Ro'yxatda faqat yozilmagan qatorlar nomi", ru: 'В списке — только названия незаполненных строк' },
  { uz: 'Uchala `console.log` kutilgandek chiqdi', ru: 'Все три `console.log` вывели ожидаемое' }
];
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: 'app.js — yozilmagan funksiyasini yakunlang', ru: 'app.js — допишите функцию yozilmagan' },
  files: [{ name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: { uz: '// yozilmagan qatorlar nomini qaytaring', ru: '// верните названия незаполненных строк' } }],
  requirements: [
    { id: 'royxat', label: KOD_VAZIFA[0],
      check: C.evalEquals(`(function(){var a=yozilmagan(${KOD_DATA}[0]);return (Array.isArray(a)&&a.length===0)?"ha":"yoq";})()`, 'ha', { uz: "Funksiya ro'yxat qaytarsin: to'liq yozuvga — bo'sh ro'yxat.", ru: 'Функция должна вернуть список: для полной записи — пустой список.' }) },
    { id: 'faqat', label: KOD_VAZIFA[1],
      check: C.evalEquals(`(function(){var a=yozilmagan(${KOD_DATA}[1]);if(!Array.isArray(a))return "";return a.join("|");})()`, 'qildi', { uz: 'Ro\'yxatga faqat qiymati "" bo\'lgan qator nomi tushsin.', ru: 'В список должно попасть только название строки со значением "".' }) },
    { id: 'uch', label: { uz: 'Uchala console.log kutilgandek chiqdi', ru: 'Все три console.log вывели ожидаемое' },
      check: C.evalEquals(`(function(){var a=yozilmagan(${KOD_DATA}[2]);if(!Array.isArray(a))return "";return a.join("|");})()`, 'voqea|qildi|qiyin', { uz: 'Uchinchi yozuvda uch qator yozilmagan — uchalasi chiqsin.', ru: 'В третьей записи три пустые строки — пусть выйдут все три.' }) }
  ]
};
const KOD_DARVOZA = [
  { id: 'qilmagan', ok: false, t: { uz: 'Odam hech narsa qilmagan', ru: 'Человек ничего не сделал' }, x: { uz: "Bo'sh qator — odam emas, siz yozmagan joy.", ru: 'Пустая строка — это не человек, а место, которое вы не записали.' } },
  { id: 'yozilmagan', ok: true, t: { uz: 'Bu qator hali yozilmagan', ru: 'Эта строка ещё не записана' } },
  { id: 'bolmagan', ok: false, t: { uz: "Intervyu umuman bo'lmagan", ru: 'Интервью вообще не было' }, x: { uz: "Boshqa qatorlar yozilgan — intervyu bo'lgan.", ru: 'Другие строки записаны — интервью было.' } }
];
// Kod namunasi (o'qish uchun; nusxalanmaydi): darvozadan keyin "" qiymatlar bir lahza ajraladi
const KodNamuna = ({ ajrat }) => (
  <pre className={cxx('fi-kod', ajrat && 'ajrat')} onCopy={(e) => e.preventDefault()} aria-label="app.js">
    {tr(KOD_STARTER).split('\n').slice(0, 13).map((l, i) => {
      if (l.trim().startsWith('//')) return <span key={i} className="fi-kod-izoh">{l}{'\n'}</span>;
      const qism = l.split(/("")/g);
      return <span key={i}>{qism.map((p, j) => (p === '""' ? <b key={j} className="fi-bosh-q">""</b> : p))}{'\n'}</span>;
    })}
  </pre>
);
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — 1-darsdagi QKOD_ONG naqshi (MEXANIZM-TAKLIF 10)
const QKOD_ONG = 'muh\u0061rrir';
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'yozilmagan' : null));
  const [miss, setMiss] = useState(null);
  const [ajrat, setAjrat] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [open, setOpen] = useState(false);
  const [ochildi, setOchildi] = useState(!!storedAnswer);
  const [code, setCode] = useState(() => (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const stage2 = !!gpick || isMentor || done;
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 2400); return () => clearTimeout(t); }, [ajrat]);
  const pickGate = (g) => {
    if (stage2) return;
    if (g.ok) { setGpick(g.id); setMiss(null); setAjrat(true); }
    else setMiss({ id: g.id, k: Date.now() });
  };
  const bitir = (yangi) => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, code: yangi, solved: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  const finish = ({ codes, code: htmlCode }) => {
    const yangi = (codes && codes['app.js']) || htmlCode || code || tr(KOD_STARTER);
    setOpen(false); setCode(yangi); bitir(yangi);
  };
  const darvoza = (
    <div className="fi-darvoza">
      <span className="fi-darvoza-s">{fmtCode(tr({ uz: '`yozuv.qildi` qiymati `""` bo\'lsa, nima bilinadi?', ru: 'Если значение `yozuv.qildi` равно `""`, что это значит?' }))}</span>
      <div className="fi-tanlov">
        {KOD_DARVOZA.map(g => {
          const silk = miss && miss.id === g.id;
          return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} silk={silk} holat={gpick === g.id ? 'ok' : undefined} disabled={stage2 && gpick !== g.id} onClick={() => pickGate(g)}>{tr(g.t)}</QChip>;
        })}
      </div>
      {miss && <QXato>{tr(KOD_DARVOZA.find(g => g.id === miss.id).x)}</QXato>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish', ru: 'Пишем код' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: '① Kod-savolini yeching', ru: '① Решите вопрос о коде' }) : tr({ uz: '② Kodni yozing', ru: '② Напишите код' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Yozuvning bo'sh qatorlarini topadigan <A>kod</A> yozamiz.</>, ru: <>Пишем <A>код</A>, который находит пустые строки записи.</> })}
        mentor={<Mentor>{!stage2
          ? tr({ uz: "Uyda besh yozuv yig'asiz — har birida to'rt qator yozilganini endi kod tekshiradi. Yozuvlar Maydon intervyularidan.", ru: 'Дома вы соберёте пять записей — теперь код проверит, что в каждой записаны четыре строки. Записи — из интервью о поле.' })
          : tr({ uz: "Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Нажмите кнопку — откроется окно кода: вы пишете код и сразу видите результат здесь.' })}</Mentor>}
        vazifa={<>
          {darvoza}
          {stage2 && <ol className="fi-vazifa">{KOD_VAZIFA.map((v, i) => <li key={i}><i>{i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>}
        </>}
        yordam={stage2 && <div className="fi-yordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma>
          {yordam && <>
            <QIzoh>{fmtCode(tr({ uz: 'Bitta qatordan boshlang: `yozuv.voqea === ""` bo\'lsa, ro\'yxatga `"voqea"` ni qo\'shing. Ishlagach qolgan ikkitasiga o\'ting.', ru: 'Начните с одной строки: если `yozuv.voqea === ""`, добавьте в список `"voqea"`. Когда заработает, переходите к двум остальным.' }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: "Eslatma (JavaScript darslaridan): `function` — bitta vazifani bajaradigan kod bo'lagi · massiv — ro'yxat · `if` — shart · `push` — ro'yxat oxiriga qo'shadi · `console.log` — qiymatni ekranga chiqaradi.", ru: 'Напоминание (из уроков JavaScript): `function` — кусочек кода, который выполняет одну задачу · массив — список · `if` — условие · `push` — добавляет в конец списка · `console.log` — выводит значение на экран.' }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: "Qo'shimcha: `yozuvlar` ga sinfdoshingizdan olgan mashq yozuvini qo'shing va tekshiring.", ru: 'Дополнительно: добавьте в `yozuvlar` тренировочную запись от одноклассника и проверьте.' }))}</QIzoh>
          </>}
        </div>}
        bajardim={!isMentor && <div className="fi-amal">
          <QTugma className={stage2 && ochildi && !done ? 'fi-bos' : undefined} disabled={!stage2 || !ochildi || done} onClick={() => bitir(code || tr(KOD_STARTER))}>{!stage2 ? tr({ uz: 'Avval kod-savolini yeching', ru: 'Сначала решите вопрос о коде' }) : tr({ uz: '✓ Bajardim — kod ishladi', ru: '✓ Готово — код работает' })}</QTugma>
        </div>}
        {...{ [QKOD_ONG]: <div className="fi-kodoyna">
          <KodNamuna ajrat={ajrat} />
          {stage2 && <div className="fi-amal"><QTugma className={!done && !ochildi && !isMentor ? 'fi-bos' : undefined} onClick={() => { setOpen(true); setOchildi(true); }}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma></div>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      />
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), .hc-root ham o'zi qo'yadi — qobiq tashqi zoomni bekor qiladi (PmLesson25 naqshi). */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_STARTER)} storageKey="pm-m7d2-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 11 — 4-SAVOL (QuestionScreen; INLINE_KEYS.s11 = 1; yakuniy): iqtibos o'yinchi pufagida =====
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    ustVizual={() => <div className="fi-iqtibos"><Suhbatdosh rol="oyinchi" pufaklar={[{ t: tr({ uz: "Juma kuni egasiga uch marta qo'ng'iroq qildim — ko'tarmadi.", ru: 'В пятницу три раза звонил владельцу — не взял трубку.' }), k: 's11' }]} /></div>}
    questionText="Yozuvga qanday yozasiz?"
    question={tr({ uz: <h2 className="title h-ask">Yozuvga <A>qanday</A> yozasiz?</h2>, ru: <h2 className="title h-ask"><A>Как</A> вы запишете это в запись?</h2> })}
    options={[
      { uz: '«O\'yinchilar egasiga ko\'p qo\'ng\'iroq qilib, qattiq qiynaladi»', ru: '«Игроки много звонят владельцу и сильно мучаются»' },
      { uz: "«Juma kuni egasiga uch marta qo'ng'iroq qildim — ko'tarmadi»", ru: '«В пятницу три раза звонил владельцу — не взял трубку»' },
      { uz: '«Egasi juma kunlari telefoniga deyarli qaramasa kerak»', ru: '«Владелец, наверное, по пятницам почти не смотрит в телефон»' },
      { uz: '«Egasining o\'rniga band qilish sayti kerakligi aytildi»', ru: '«Сказали, что вместо владельца нужен сайт для брони»' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Yozuvga eshitgan javob tushadi — u aytganidek.', ru: 'В запись попадает услышанный ответ — так, как он сказал.' }}
    explainWrong={{
      0: { uz: "Siz gapini hammaga yoydingiz — u o'zi haqida gapirdi.", ru: 'Вы распространили его слова на всех — он говорил о себе.' },
      2: { uz: 'Bu sizning taxminingiz — u buni aytmadi.', ru: 'Это ваша догадка — он этого не говорил.' },
      3: { uz: 'Bu sizning xulosangiz — u sayt haqida gapirmadi.', ru: 'Это ваш вывод — он не говорил о сайте.' },
      default: { uz: 'U aytgan gapni toping.', ru: 'Найдите то, что он сказал.' }
    }} />
);

// ===== SCREEN 12 — MUSTAHKAMLASH (QMustaqil, 2 qadam): avval ayting (taymer), keyin yozing · tekshiruv 8-ekran RegExp lari bilan =====
const EGA1 = { uz: "Kecha ko'p qo'ng'iroq bo'ldi.", ru: 'Вчера было много звонков.' };
const EGA2 = { uz: "Hammasiga «ha» dedim, keyin ikkitasiga qayta qo'ng'iroq qildim.", ru: 'Всем сказал «да», потом двоим перезвонил.' };
const S12_YORLIQ = { kelajak: 'vada', goya: 'baho', ha: 'savolda' };
function Taymer12({ yakka, chorla, onBoshla, onTugadi }) {
  const SON = yakka ? 30 : 60;
  const [st, setSt] = useState({ yur: false, qoldi: SON, tugadi: false });
  useEffect(() => {
    if (!st.yur) return undefined;
    if (st.qoldi <= 0) { setSt({ yur: false, qoldi: 0, tugadi: true }); if (onTugadi) onTugadi(); return undefined; }
    const t = setTimeout(() => setSt(p => ({ ...p, qoldi: p.qoldi - 1 })), 1000);
    return () => clearTimeout(t);
  }, [st.yur, st.qoldi]); // eslint-disable-line
  const ulush = st.yur ? st.qoldi / SON : (st.tugadi ? 0 : 1);
  const holatMatn = st.yur
    ? (yakka ? tr({ uz: 'Hozir ovoz chiqarib ayting', ru: 'Сейчас скажите вслух' }) : st.qoldi > 30 ? tr({ uz: 'Hozir A gapiradi', ru: 'Сейчас говорит A' }) : tr({ uz: 'Hozir B gapiradi', ru: 'Сейчас говорит B' }))
    : st.tugadi && yakka ? tr({ uz: 'Vaqt tugadi — aytib bo\'ldingiz. Barakalla!', ru: 'Время вышло — вы сказали. Молодец!' }) : null;
  return (
    <div className={cxx('fi-taymer', st.yur && 'yur', st.tugadi && 'tugadi')}>
      {!yakka && <span className="fi-taymer-iz">{tr({ uz: 'Har biringizga 30 soniyadan — avval A, keyin B.', ru: 'Каждому по 30 секунд — сначала A, потом B.' })}</span>}
      <div className="fi-taymer-q">
        <span className="fi-taymer-son">{Math.floor(st.qoldi / 60)}:{String(st.qoldi % 60).padStart(2, '0')}</span>
        <span className="fi-taymer-yol" aria-hidden="true"><i style={{ width: `${Math.round(ulush * 100)}%` }} /></span>
        {st.yur
          ? <QTugma ikkinchi onClick={() => setSt({ yur: false, qoldi: SON, tugadi: false })}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>
          : <QTugma ikkinchi className={chorla && !st.tugadi ? 'fi-bos' : undefined} onClick={() => { setSt({ yur: true, qoldi: SON, tugadi: false }); if (onBoshla) onBoshla(); }}>{st.tugadi
            ? (yakka ? tr({ uz: '↻ Yana 30 soniya', ru: '↻ Ещё 30 секунд' }) : tr({ uz: '↻ Yana 1 daqiqa', ru: '↻ Ещё 1 минута' }))
            : (yakka ? tr({ uz: '30 soniyani boshlash', ru: 'Запустить 30 секунд' }) : tr({ uz: '1 daqiqani boshlash', ru: 'Запустить 1 минуту' }))}</QTugma>}
      </div>
      {holatMatn && <span className="fi-taymer-h" role="status">{holatMatn}</span>}
    </div>
  );
}
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const yakka = yakkaMi(live);
  const [aytdi, setAytdi] = useState(!!storedAnswer);
  const [val, setVal] = useState(() => storedAnswer?.savol || '');
  const [yuborilgan, setYuborilgan] = useState(() => storedAnswer?.savol || null);
  const [tur, setTur] = useState(null);
  const [otdi, setOtdi] = useState(!!storedAnswer);
  const [yordam, setYordam] = useState(false);
  useXulosaSkroll(otdi, storedAnswer);
  const saqla = () => {
    const v = val.trim();
    if (!v) return;
    const t = savolTuri(v);
    setYuborilgan(v); setTur(t);
    if (t) { setOtdi(false); return; }
    setOtdi(true);
    if (storedAnswer === undefined) onAnswer(screen, { stage: 'reflection', screenIdx: screen, savol: v, correct: true, picked: true, solved: true });
  };
  const joriy = otdi ? 2 : (aytdi || val.length > 0 ? 1 : 0);
  const pufaklar = [{ t: tr(EGA1), k: 'e1', tur: tur ? S12_YORLIQ[tur] : undefined }];
  if (yuborilgan) pufaklar.push({ t: yuborilgan, men: true, k: `m-${yuborilgan}` });
  if (otdi) pufaklar.push({ t: tr(EGA2), tur: 'voqea', k: 'e2' });
  return (
    <Stage eyebrow={tr({ uz: "O'zingiz o'ylab ko'ring", ru: 'Подумайте сами' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!otdi} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Odam qisqa javob bersa, <A>keyin nima so'raysiz?</A></>, ru: <>Если человек ответил коротко, <A>что спросите дальше?</A></> })}
        mentor={<Mentor>{yakka
          ? tr({ uz: 'Maydon egasi bitta gap bilan javob berdi. Avval ovoz chiqarib o\'zingizga keyingi savolni ayting, keyin yozing.', ru: 'Владелец поля ответил одной фразой. Сначала скажите следующий вопрос вслух самому себе, потом напишите.' })
          : tr({ uz: 'Maydon egasi bitta gap bilan javob berdi. Avval sherigingizga keyingi savolni ayting, keyin yozing.', ru: 'Владелец поля ответил одной фразой. Сначала скажите следующий вопрос партнёру, потом напишите.' })}</Mentor>}
        qadamlar={<div className="fi-mus-bosh">
          <QadamChip nomlar={[yakka ? tr({ uz: 'Ovoz chiqarib ayting', ru: 'Скажите вслух' }) : tr({ uz: 'Sherigingizga ayting', ru: 'Скажите партнёру' }), tr({ uz: 'Keyingi savolni yozing', ru: 'Напишите следующий вопрос' })]} joriy={joriy} tugadi={otdi} />
          {!otdi && <Taymer12 yakka={yakka} chorla={!aytdi && !val} onBoshla={() => setAytdi(true)} onTugadi={() => setAytdi(true)} />}
        </div>}
        forma={<div className="fi-s12">
          <div className="fi-s12-vis">
          <Suhbatdosh rol="ega" pufaklar={pufaklar} />
          <ShablonKarta ixcham qatorlar={{ kim: tr(ROL.ega), voqea: tr(EGA1).replace(/\.$/, ''), qildi: otdi ? tr(EGA2).replace(/\.$/, '') : undefined }} holat={{ qildi: otdi ? 'ok' : 'joriy' }} yangi={otdi ? 'qildi' : null} />
          </div>
          {!otdi && <div className="fi-forma">
            <GrowInput value={val} onChange={e => { setVal(e.target.value); setTur(null); }} onEnter={saqla} placeholder={tr({ uz: "O'sha kun haqida nimani so'raysiz?", ru: 'Что спросите о том дне?' })} maxLength={160} aria-label={tr({ uz: "O'sha kun haqida nimani so'raysiz?", ru: 'Что спросите о том дне?' })} className={cxx(tur && 'xato', !val.trim() && aytdi && 'chorla')} />
            {tur && <QXato>{tr(XABAR[tur])}</QXato>}
            <div className="fi-amal"><QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma><QTugma className={val.trim() ? 'fi-bos' : undefined} disabled={!val.trim()} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>
          </div>}
          {otdi && <p className="fi-ok fade-step">{tr({ uz: "Savol o'sha voqeani davom ettiryapti.", ru: 'Вопрос продолжает то же событие.' })}</p>}
        </div>}
        yordam={!otdi && yordam && <QIzoh>{tr({ uz: "O'sha kunni so'rang: «O'shanda nima qildingiz?» yoki «Keyin nima bo'ldi?»", ru: 'Спросите о том дне: «Что вы тогда сделали?» или «А что было потом?»' })}</QIzoh>}
      >
        {otdi && <QXulosa>{tr({ uz: "Qisqa javobdan keyin o'sha voqeani davom ettirasiz — yozuvning keyingi qatori shunday yoziladi.", ru: 'После короткого ответа вы продолжаете то же событие — так пишется следующая строка записи.' })}</QXulosa>}
      </QMustaqil>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — 4 ta: s4 — uchala qadamda birinchi bosishda voqea savoli (151-qonun); s8, s9, s10 — ish tugaganda =====
const ACHIEVEMENTS = {
  firstRecord: { icon: '📝', name: 'First Record!', desc: { uz: "O'yinchi bilan suhbatda shablonning uch qatorini birinchi urinishda to'ldirdingiz", ru: 'В разговоре с игроком заполнили три строки шаблона с первой попытки' } },
  readyToAsk: { icon: '🎯', name: 'Ready to Ask!', desc: { uz: 'Muammongiz uchun shablonni tayyorladingiz', ru: 'Подготовили шаблон для своей проблемы' } },
  interviewer: { icon: '🎙️', name: 'Interviewer!', desc: { uz: "Sinfdoshingizdan intervyu olib, mashq yozuvini to'ldirdingiz", ru: 'Взяли интервью у одноклассника и заполнили тренировочную запись' } },
  recordChecker: { icon: '🔍', name: 'Record Checker!', desc: { uz: 'Yozuvning yozilmagan qatorlarini kod bilan topdingiz', ru: 'Нашли незаполненные строки записи с помощью кода' } },
};
// Ekran id → nishon (151-qonun: s4 — birinchi urinish; s8–s10 — haqiqiy ish tugaganda)
const ACH_TRIGGERS = { s4: 'firstRecord', s8: 'readyToAsk', s9: 'interviewer', s10: 'recordChecker' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 7, 11 — q22)
const Q_LABELS = {
  3: { uz: '1 — Egasiga voqea savoli', ru: '1 — Вопрос о событии владельцу' },
  5: { uz: '2 — Keyingi savol', ru: '2 — Следующий вопрос' },
  7: { uz: '3 — Kitobdagidek savol', ru: '3 — Вопрос как в книге' },
  11: { uz: '4 — Yozuvga tushadigan gap', ru: '4 — Фраза для записи' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi so'zlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}); 🎙️ ✅ — o'yin qatlami
const QZ_BG_SHAPES = [
  { ch: { uz: 'intervyu', ru: 'интервью' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'yozuv', ru: 'запись' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'savol', ru: 'вопрос' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'voqea', ru: 'событие' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'shablon', ru: 'шаблон' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'maydon', ru: 'поле' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'odam', ru: 'человек' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: '🎙️', l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: '✅', l: 56, t: 52, s: 20, d: 22, dl: 3.4 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A/B/C/D — har biri 3 marta (A 1·6·10 · B 2·5·12 · C 3·8·11 · D 4·7·9)
const QUIZ_BANK = [
  { q: { uz: 'Intervyu nima?', ru: 'Что такое интервью?' }, opts: [{ uz: 'Bitta odam bilan suhbat', ru: 'Разговор с одним человеком' }, { uz: "Ko'p odamga bitta e'lon", ru: 'Одно объявление для многих' }, { uz: "Sinfga g'oyani aytish", ru: 'Рассказать идею классу' }, { uz: 'Odamni jim kuzatib turish', ru: 'Молча наблюдать за человеком' }], correct: 0 },
  { q: { uz: 'Yozuv nima?', ru: 'Что такое запись?' }, opts: [{ uz: "Intervyu savollari ro'yxati", ru: 'Список вопросов интервью' }, { uz: "To'ldirilgan shablon", ru: 'Заполненный шаблон' }, { uz: 'Intervyudan chiqqan xulosa', ru: 'Вывод из интервью' }, { uz: "G'oyangiz haqidagi matn", ru: 'Текст о вашей идее' }], correct: 1 },
  { q: { uz: "«Sayt bo'lsa, ishlatarmidingiz?» — bu qanday savol?", ru: '«Если бы был сайт, пользовались бы?» — что это за вопрос?' }, opts: [{ uz: "Voqea savoli — maydonni so'radi", ru: 'Вопрос о событии — спросил о поле' }, { uz: 'Voqea savoli — javobi qisqa', ru: 'Вопрос о событии — ответ короткий' }, { uz: "Bo'sh savol — javobi va'da", ru: 'Пустой вопрос — ответ-обещание' }, { uz: "Bo'sh savol — savoli qisqa", ru: 'Пустой вопрос — сам вопрос короткий' }], correct: 2 },
  { q: { uz: '«Oxirgi marta maydonga qachon bordingiz?» — bu qanday savol?', ru: '«Когда вы в последний раз ходили на поле?» — что это за вопрос?' }, opts: [{ uz: "Bo'sh savol — kelajakni so'radi", ru: 'Пустой вопрос — спросил о будущем' }, { uz: "Bo'sh savol — javobi «ha» bo'ladi", ru: 'Пустой вопрос — ответ будет «да»' }, { uz: "Voqea savoli — g'oyani so'radi", ru: 'Вопрос о событии — спросил об идее' }, { uz: "Voqea savoli — o'tgan kunni so'radi", ru: 'Вопрос о событии — спросил о прошедшем дне' }], correct: 3 },
  { q: { uz: "Shablondagi to'rt qatordan biri qaysi?", ru: 'Какая из этих — одна из четырёх строк шаблона?' }, opts: [{ uz: 'Sayt sizga yoqdimi?', ru: 'Вам понравился сайт?' }, { uz: "Nima qiyin bo'ldi?", ru: 'Что было трудно?' }, { uz: 'Kelasi safar nima qilasiz?', ru: 'Что сделаете в следующий раз?' }, { uz: "Narxi qancha bo'lsin?", ru: 'Какой должна быть цена?' }], correct: 1 },
  { q: { uz: "O'yinchi: «Maydon band ekan». Keyingi savol qaysi?", ru: 'Игрок: «Поле было занято». Какой следующий вопрос?' }, opts: [{ uz: "O'shanda nima qildingiz?", ru: 'Что вы тогда сделали?' }, { uz: "Sayt bo'lsa, band qilasizmi?", ru: 'Если бы был сайт, бронировали бы?' }, { uz: "Maydon ko'p band bo'ladimi?", ru: 'Поле часто бывает занято?' }, { uz: 'Keyin qachon borasiz?', ru: 'Когда пойдёте в следующий раз?' }], correct: 0 },
  { q: { uz: 'Yozuvga qaysi gap tushadi?', ru: 'Какая фраза попадает в запись?' }, opts: [{ uz: 'Intervyudan siz chiqargan xulosa', ru: 'Вывод, который вы сделали из интервью' }, { uz: 'Odam haqida sizning taxminingiz', ru: 'Ваша догадка о человеке' }, { uz: 'Hammaga taalluqli umumiy gap', ru: 'Общая фраза обо всех' }, { uz: 'Eshitgan javob, u aytganidek', ru: 'Услышанный ответ, так, как он сказал' }], correct: 3 },
  { q: { uz: "Kitobdagi ona g'oyani nega maqtadi?", ru: 'Почему мама из книги похвалила идею?' }, opts: [{ uz: 'U shunday ilovani qidirgan edi', ru: 'Она искала такое приложение' }, { uz: "Planshetda ko'p o'tirardi", ru: 'Она много сидела в планшете' }, { uz: "O'g'lini xafa qilmaslik uchun", ru: 'Чтобы не обидеть сына' }, { uz: 'Taomlar kitobi unga kerak edi', ru: 'Ей была нужна книга рецептов' }], correct: 2 },
  { q: { uz: "Kitobda qaysi savol ko'proq narsa ochdi?", ru: 'Какой вопрос в книге открыл больше?' }, opts: [{ uz: "«Taomlar ilovasi sizga kerak bo'ladimi?»", ru: '«Вам понадобится приложение с рецептами?»' }, { uz: '«Planshetda odatda nima qilasiz?»', ru: '«Что вы обычно делаете на планшете?»' }, { uz: '«Shunday ilovani sotib olarmidingiz?»', ru: '«Вы бы купили такое приложение?»' }, { uz: '«Oxirgi marta qaysi kitobni oldingiz?»', ru: '«Какую книгу вы купили в последний раз?»' }], correct: 3 },
  { q: { uz: 'Kitob nomi nimani anglatadi?', ru: 'Что означает название книги?' }, opts: [{ uz: 'Onangiz ham rostini aytadigan savollar', ru: 'Вопросы, на которые даже мама скажет правду' }, { uz: 'Faqat onangizga beriladigan savollar', ru: 'Вопросы, которые задают только маме' }, { uz: "Onangizga g'oyani aytib ko'rish usuli", ru: 'Способ рассказать идею маме' }, { uz: 'Onangiz bilan maslahatlashish qoidasi', ru: 'Правило совета с мамой' }], correct: 0 },
  { q: { uz: "Maydon muammosi bo'yicha kimdan intervyu olasiz?", ru: 'У кого возьмёте интервью о проблеме поля?' }, opts: [{ uz: "Futbol o'ynamaydigan qo'shnidan", ru: 'У соседа, который не играет в футбол' }, { uz: 'Sayt yasay oladigan do\'stdan', ru: 'У друга, который умеет делать сайты' }, { uz: "O'yinchidan va maydon egasidan", ru: 'У игрока и владельца поля' }, { uz: "G'oyani maqtaydigan sinfdoshdan", ru: 'У одноклассника, который хвалит идею' }], correct: 2 },
  { q: { uz: 'Nega bitta intervyu yetmaydi?', ru: 'Почему одного интервью мало?' }, opts: [{ uz: "Bitta odam ko'p gapira olmaydi", ru: 'Один человек не может много говорить' }, { uz: 'Bitta yozuv — bitta odamning voqeasi', ru: 'Одна запись — событие одного человека' }, { uz: "Shablonda to'rtta qator bor xolos", ru: 'В шаблоне всего четыре строки' }, { uz: "Ko'p odam maqtasa — g'oya to'g'ri", ru: 'Хвалят многие — идея верная' }], correct: 1 },
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
    // Arena tokenlari — SHU darsning lug'atidan (QZ_BG_SHAPES, R-008): intervyu · yozuv · savol · voqea · shablon · maydon · odam
    const TOK = QZ_BG_SHAPES.map(sh => tr(sh.ch));
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
      <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Sinfda', ru: 'В классе' })}: {doers.length} {tr({ uz: 'bajardi', ru: 'выполнили' })} · {waiting.length} {tr({ uz: 'hali bajarmoqda', ru: 'ещё выполняют' })}</div>
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

// 🃏 Kartochka mexanikasi va ko'rinishi — qolipda: QKartochka (DE-204). Ta'riflar so'zma-so'z (T-042).
const KARTOCHKALAR = [
  { front: { uz: 'Intervyu nima?', ru: 'Что такое интервью?' }, back: { uz: 'Bitta odam bilan suhbat', ru: 'Разговор с одним человеком' } },
  { front: { uz: 'Yozuv nima?', ru: 'Что такое запись?' }, back: { uz: "To'ldirilgan shablon", ru: 'Заполненный шаблон' } },
  { front: { uz: "Shablonda qaysi to'rt qator bor?", ru: 'Какие четыре строки есть в шаблоне?' }, back: { uz: "Kim bilan · Oxirgi marta nima bo'ldi · O'shanda nima qildi · Nima qiyin bo'ldi", ru: 'С кем · Что было в последний раз · Что он тогда сделал · Что было трудно' } },
  { front: { uz: 'Voqea savoli nima?', ru: 'Что такое вопрос о событии?' }, back: { uz: "Bo'lib o'tgan ishni so'ragan savol", ru: 'Вопрос о том, что уже было' } },
  { front: { uz: "Bo'sh savol nima?", ru: 'Что такое пустой вопрос?' }, back: { uz: "Javobidan bo'lib o'tgan ish bilinmaydigan savol", ru: 'Вопрос, из ответа на который не видно, что уже было' } },
  { front: { uz: "«Sayt bo'lsa, ishlatarmidingiz?» — nima xato?", ru: '«Если бы был сайт, пользовались бы?» — в чём ошибка?' }, back: { uz: "Sayt hali yo'q: javobi va'da bo'ladi", ru: 'Сайта ещё нет: ответ будет обещанием' } },
  { front: { uz: "Muammoni o'rganadigan intervyuda g'oyangizni avval aytasizmi?", ru: 'В интервью, где изучаете проблему, вы сначала рассказываете идею?' }, back: { uz: "Yo'q — avval odamning oxirgi voqeasini so'raysiz", ru: 'Нет — сначала спрашиваете о последнем событии человека' } },
  { front: { uz: 'Yozuvga nima tushadi?', ru: 'Что попадает в запись?' }, back: { uz: 'Eshitgan javob — u aytganidek', ru: 'Услышанный ответ — так, как он сказал' } },
  { front: { uz: 'Nega bitta intervyu yetmaydi?', ru: 'Почему одного интервью мало?' }, back: { uz: "Bitta yozuv — bitta odamning voqeasi; takrorni ko'rish uchun bir necha odam kerak", ru: 'Одна запись — событие одного человека; чтобы увидеть повтор, нужно несколько людей' } },
  { front: { uz: "Maydon muammosi bo'yicha kimdan so'raysiz?", ru: 'Кого спросите о проблеме поля?' }, back: { uz: "O'yinchidan va maydon egasidan", ru: 'Игрока и владельца поля' } },
  { front: { uz: "Kitobdagi ona g'oyani nega maqtadi?", ru: 'Почему мама из книги похвалила идею?' }, back: { uz: "O'g'lini xafa qilmaslik uchun — bu baho, voqea emas", ru: 'Чтобы не обидеть сына — это оценка, а не событие' } },
  { front: { uz: "Muammoni odamlar bilan intervyu orqali o'rganish inglizcha qanday ataladi?", ru: 'Как по-английски называется изучение проблемы через интервью с людьми?' }, back: { uz: 'Custdev (customer development)', ru: 'Custdev (customer development)' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* SABOQ 16 (F-1005-91): Mentor jim (KORPUS §61); ko'rsatma karta ostida, birinchi bosishgacha */}
        <div className={cxx('fi-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="fi-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: karta «kimdan · nechta · muddat» + raqamli qadamlar; GATE M M-q9 — alohida .homework.jsx YO'Q) =====
const HW_KARTA = [
  { k: { uz: 'Kimdan', ru: 'У кого' }, v: { uz: 'muammongizga duch keladigan odamlardan', ru: 'у людей, которые сталкиваются с вашей проблемой' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '5 ta intervyu', ru: '5 интервью' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Muammongizga duch keladigan besh odamni toping; muammoning ikki tomoni bo'lsa — ikkalasidan ham.", ru: 'Найдите пять человек, которые сталкиваются с вашей проблемой; если у проблемы две стороны — с обеих.' },
  { uz: "Har biriga shablondagi savollarni bering, g'oyangizni aytmang.", ru: 'Задайте каждому вопросы из шаблона, свою идею не рассказывайте.' },
  { uz: "Javobni o'sha zahoti, u aytganidek yozing: har intervyu — bitta yozuv.", ru: 'Записывайте ответ сразу, так, как он сказал: каждое интервью — одна запись.' },
  { uz: 'Besh yozuvni keyingi darsga olib keling.', ru: 'Принесите пять записей на следующий урок.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card fi-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="fi-hw-karta">
      {HW_KARTA.map((r, i) => <div key={i} className="fi-hw-q"><span className="fi-hw-k">{tr(r.k)}</span><span className="fi-hw-v">{tr(r.v)}</span></div>)}
    </div>
    <ol className="fi-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
    {keyingi && <span className="fi-hw-keyingi">{keyingi}</span>}
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
  // «Endi siz bilasiz» — A-3 ta'riflari so'zma-so'z (T-042)
  const RECAP = [
    { uz: "Bitta odam bilan suhbat — intervyu, to'ldirilgan shablon — yozuv.", ru: 'Разговор с одним человеком — интервью, заполненный шаблон — запись.' },
    { uz: "Muammoni o'rganadigan intervyuda avval g'oyangiz emas, odamning oxirgi voqeasi so'raladi.", ru: 'В интервью, где изучают проблему, сначала спрашивают не об идее, а о последнем событии человека.' },
    { uz: "Shablonda to'rt qator bor: kim bilan, oxirgi marta nima bo'ldi, o'shanda nima qildi, nima qiyin bo'ldi.", ru: 'В шаблоне четыре строки: с кем, что было в последний раз, что он тогда сделал, что было трудно.' },
    { uz: 'Yozuvga eshitgan javob tushadi — u aytganidek.', ru: 'В запись попадает услышанный ответ — так, как он сказал.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Besh suhbatdan qaysi muammo chiqdi?»</b> Besh yozuvingizdagi takrorlardan bitta muammoni tanlaysiz.</>, ru: <>Следующий урок — <b>«Какая проблема вышла из пяти разговоров?»</b> По повторам в пяти записях выберете одну проблему.</> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Shablon va mashq yozuvingiz <span className="italic" style={{ color: T.accent }}>tayyor</span>.</>, ru: <>Шаблон и тренировочная запись <span className="italic" style={{ color: T.accent }}>готовы</span>.</> })}
        cta={<>
          <p className="small fi-fikr fade-up d1">{tr({ uz: "G'oya haqida so'rasangiz baho eshitasiz, oxirgi voqea haqida so'rasangiz — muammoni bilasiz.", ru: 'Спросите об идее — услышите оценку, спросите о последнем событии — узнаете проблему.' })}</p>
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
export default function PmFiveInterviewsLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === 9-MODUL 2-DARS — darsning o'z vizuali «Suhbat va shablon» (fi-). Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        /* --- siluet · suhbatdosh · pufak --- */
        .fi-siluet { display: inline-flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; }
        .fi-siluet i { width: 22px; height: 22px; border-radius: 50%; background: ${T.ink2}; }
        .fi-siluet b { width: 40px; height: 20px; border-radius: 20px 20px 4px 4px; background: ${T.accent}; }
        .fi-siluet.kichik i { width: 12px; height: 12px; } .fi-siluet.kichik b { width: 22px; height: 11px; border-radius: 11px 11px 2px 2px; }
        .fi-sd { display: flex; gap: 12px; align-items: flex-start; min-width: 0; }
        .fi-sd-odam { display: flex; flex-direction: column; align-items: center; gap: 5px; flex-shrink: 0; width: 84px; }
        .fi-sd-rol { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 2px 8px; text-align: center; line-height: 1.3; }
        .fi-sd-gap { display: flex; flex-direction: column; gap: 8px; min-width: 0; flex: 1; }
        .fi-sd-q { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; min-width: 0; }
        .fi-sd-q.men { align-items: flex-end; }
        .fi-pufak { display: inline-block; max-width: 100%; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 4px 14px 14px 14px; padding: 9px 13px; font-size: 14.5px; line-height: 1.45; color: ${T.ink}; font-weight: 600; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.18); }
        .fi-pufak.men { background: ${T.accentSoft}; border-color: ${fon(T.accent, 0.25)}; border-radius: 14px 4px 14px 14px; align-self: flex-end; }
        .fi-pufak.kir { animation: fi-kir .35s ease-out both; }
        .fi-pufak.tush { animation: fi-tush .5s cubic-bezier(.2,.9,.3,1.2) both; }
        .fi-pufak.uch { display: inline-flex; gap: 5px; align-items: center; padding: 12px 14px; }
        .fi-pufak.uch i { width: 7px; height: 7px; border-radius: 50%; background: ${T.ink2}; animation: fi-nuqta 1.2s ease-in-out infinite; }
        .fi-pufak.uch i:nth-child(2) { animation-delay: .2s; } .fi-pufak.uch i:nth-child(3) { animation-delay: .4s; }
        .fi-tur { display: inline-block; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 999px; padding: 2px 9px; animation: fi-kir .3s ease-out .15s both; }
        .fi-tur.ok { color: ${T.ok}; background: ${T.okFon}; border-color: ${fon(T.ok, 0.3)}; }
        @keyframes fi-kir { from { opacity: 0; transform: translateY(8px) scale(.97); } }
        @keyframes fi-tush { from { opacity: 0; transform: translateY(-14px) scale(.9); } }
        @keyframes fi-nuqta { 0%, 100% { opacity: .3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-3px); } }
        /* --- shablon kartasi --- */
        .fi-sh { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; padding: 12px 14px; min-width: 0; transition: border-color .4s, box-shadow .4s; }
        .fi-sh.toliq { border-color: ${T.ok}; box-shadow: 0 8px 22px -10px ${fon(T.ok, 0.45)}; }
        .fi-sh-bosh { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .fi-sh-yorliq { font-size: 11.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.accent}; }
        .fi-sh.toliq .fi-sh-yorliq { color: ${T.ok}; }
        .fi-sh-ok { width: 22px; height: 22px; border-radius: 50%; background: ${T.ok}; color: ${T.paper}; font-size: 12px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; animation: fi-kir .3s ease-out both; }
        p.fi-sh-sar { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; padding: 6px 8px; border-radius: 8px; background: ${T.bg}; animation: fi-kir .3s ease-out both; }
        p.fi-sh-sar.joriy { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        p.fi-sh-sar.xato { background: ${T.errFon}; }
        .fi-sh-sar-k { font-weight: 800; color: ${T.ink2}; }
        .fi-sh-sar-v { font-weight: 600; flex: 1; min-width: 0; overflow-wrap: anywhere; }
        .fi-sh-qatorlar { display: flex; flex-direction: column; gap: 4px; }
        .fi-sh-q { display: grid; grid-template-columns: 150px minmax(0,1fr) auto; gap: 10px; align-items: start; padding: 7px 8px; border-radius: 8px; transition: background .3s, box-shadow .3s; }
        .fi-sh-q.joriy { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .fi-sh-q.xato { background: ${T.errFon}; }
        .fi-sh-q.ok { background: ${T.okFon}; }
        .fi-sh-nom { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; line-height: 1.4; padding-top: 1px; }
        .fi-sh-joy { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .fi-sh-savol { font-size: 13px; font-style: italic; color: ${T.ink2}; line-height: 1.4; overflow-wrap: anywhere; }
        .fi-sh-matn { font-size: 14px; font-weight: 600; color: ${T.ink}; line-height: 1.45; overflow-wrap: anywhere; }
        .fi-sh-q.yangi .fi-sh-matn { animation: fi-yoz .9s ease-out both; border-radius: 6px; }
        @keyframes fi-yoz { 0% { opacity: 0; transform: translateY(-10px); background: ${T.accentSoft}; } 40% { opacity: 1; transform: none; background: ${T.accentSoft}; } 100% { background: transparent; } }
        .fi-sh-uzuq { display: block; height: 0; border-bottom: 2px dashed ${T.line}; margin-top: 10px; width: 100%; }
        .fi-sh-q.joriy .fi-sh-uzuq { border-bottom-color: ${fon(T.accent, 0.5)}; }
        .fi-sh.ustun { max-width: 640px; width: 100%; }
        .fi-sh.ixcham { padding: 9px 11px; gap: 5px; max-width: 520px; }
        .fi-sh.ixcham .fi-sh-q { padding: 4px 6px; grid-template-columns: 130px minmax(0,1fr) auto; }
        .fi-sh.ixcham .fi-sh-matn { font-size: 13px; }
        .fi-tahrir { border: none; background: transparent; color: ${T.ink2}; cursor: pointer; font-size: 14px; padding: 0 4px; border-radius: 6px; line-height: 1.4; }
        .fi-tahrir:hover { color: ${T.accent}; background: ${T.accentSoft}; }
        .fi-izlar { display: flex; align-items: center; gap: 10px; }
        .fi-iz-k { display: inline-flex; gap: 6px; }
        .fi-iz-k i { width: 20px; height: 26px; border-radius: 4px; border: 1.5px dashed ${T.line}; background: ${T.paper}; }
        .fi-iz-k i.ok { border: 1.5px solid ${T.ok}; background: ${T.okFon}; }
        .fi-iz-n { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px; color: ${T.ink}; }
        /* --- 0: chat oynasi --- */
        .fi-chat { border: 1px solid ${T.line}; border-radius: 14px; overflow: hidden; background: ${T.bg}; }
        .fi-chat-bar { display: flex; align-items: center; gap: 8px; padding: 9px 12px; background: ${T.paper}; border-bottom: 1px solid ${T.line}; }
        .fi-chat-nom { font-weight: 800; font-size: 13.5px; color: ${T.ink}; }
        .fi-chat-ichi { display: flex; flex-direction: column; gap: 10px; padding: 14px 12px; min-height: 168px; }
        .fi-chat-ichi > .fi-pufak.uch { align-self: flex-start; }
        .fi-chat-javob { display: flex; flex-direction: column; align-items: flex-start; gap: 5px; }
        /* --- 2: savol-kartalar ikki tomonga --- */
        .fi-s2-harakat { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .fi-s2-karta { width: 100%; max-width: 560px; background: ${T.paper}; border: 2px solid ${T.accent}; border-radius: 16px; padding: 14px 20px; display: flex; flex-direction: column; gap: 6px; cursor: grab; box-shadow: 0 10px 26px -12px ${fon(T.accent, 0.5)}; animation: fi-kir .35s ease-out both; transition: transform .42s cubic-bezier(.4,0,.2,1), opacity .42s; }
        .fi-s2-karta.kut { border-color: ${T.line}; box-shadow: none; cursor: default; }
        .fi-s2-karta.silk { animation: fi-silk .4s ease-in-out; }
        .fi-s2-karta.uch-chap { transform: translate(-28%, 110px) scale(.55); opacity: 0; }
        .fi-s2-karta.uch-ong { transform: translate(28%, 110px) scale(.55); opacity: 0; }
        .fi-s2-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        p.fi-s2-t { font-size: clamp(16px,1.9vw,19px); font-weight: 700; color: ${T.ink}; line-height: 1.4; }
        @keyframes fi-silk { 0%, 100% { transform: none; } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } }
        .fi-s2 { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr) minmax(0,200px); gap: 12px; align-items: stretch; }
        .fi-tomon { display: flex; flex-direction: column; gap: 8px; align-items: stretch; text-align: left; background: ${T.paper}; border: 1.5px dashed ${T.line}; border-radius: 14px; padding: 12px; min-height: 168px; font-family: 'Manrope', sans-serif; color: ${T.ink}; cursor: pointer; transition: border-color .2s, background .2s; }
        .fi-tomon:disabled { cursor: default; opacity: 1; }
        .fi-tomon:not(:disabled):hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fi-s2.tola .fi-tomon { border-style: solid; }
        .fi-tomon-h { font-size: 13.5px; font-weight: 800; color: ${T.ink2}; }
        .fi-tomon-nom { align-self: flex-start; font-size: 12px; font-weight: 800; padding: 3px 10px; border-radius: 999px; animation: fi-kir .35s ease-out both; }
        .fi-tomon.chap .fi-tomon-nom { color: ${T.ok}; background: ${T.okFon}; }
        .fi-tomon.ong .fi-tomon-nom { color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; }
        .fi-tomon-ro { display: flex; flex-direction: column; gap: 5px; }
        .fi-tomon-q { font-size: 13px; font-weight: 600; line-height: 1.4; padding: 6px 9px; border-radius: 8px; background: ${T.bg}; color: ${T.ink}; }
        .fi-tomon-q.yangi { animation: fi-yoz .8s ease-out both; }
        .fi-s2-sd { flex-direction: column; align-items: center; }
        .fi-s2-sd .fi-sd-gap { width: 100%; }
        /* --- 4: bitta intervyu --- */
        .fi-s4-chap { display: flex; flex-direction: column; gap: 12px; }
        .fi-tanlov { display: flex; flex-direction: column; gap: 8px; }
        .fi-tanlov .q-chip { text-align: left; justify-content: flex-start; white-space: normal; line-height: 1.4; }
        .fi-s4 { display: flex; flex-direction: column; gap: 14px; }
        .fi-s4-karta { display: flex; flex-direction: column; gap: 10px; }
        .fi-iqtibos { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
        /* --- 6: kitob sahnasi (KitobSahna) --- */
        .fi-voqea { display: flex; flex-direction: column; gap: 10px; align-items: stretch; width: 100%; animation: fi-kir .35s ease-out both; }
        .fi-voqea-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,1.9vw,19px); color: ${T.ink}; text-align: center; }
        .fi-voqea .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 8px 14px; }
        .fi-voqea .q-bashorat .q-yorliq { margin: 0; }
        .fi-voqea .q-bashorat .q-variantlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .fi-voqea .q-taxmin { text-align: center; }
        .fi-nuqtalar { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .fi-nuq-l { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; margin-right: 6px; }
        .fi-nuqtalar i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; transition: background .3s, transform .3s; }
        .fi-nuqtalar i.ok { background: ${T.ok}; } .fi-nuqtalar i.cur { background: ${T.accent}; transform: scale(1.25); }
        .fi-ks { position: relative; height: clamp(210px, 24vw, 250px); border-radius: 14px; overflow: hidden; background: ${T.paper}; border: 1px solid ${T.line}; perspective: 900px; }
        .fi-ks-oshxona { position: absolute; inset: 0; }
        .fi-ks-oshxona::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 22%; background: ${T.bg}; border-top: 1px solid ${T.line}; }
        .fi-ks-deraza { position: absolute; top: 10%; left: 30%; width: 15%; height: 30%; border: 4px solid ${T.line}; border-radius: 6px; background: ${T.bg}; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; }
        .fi-ks-deraza i { background: ${T.paper}; border-radius: 2px; }
        .fi-ks-javon { position: absolute; top: 12%; right: 7%; width: 22%; height: 22%; display: flex; align-items: flex-end; gap: 3px; padding: 0 6px; border-bottom: 5px solid ${T.ink2}; transition: box-shadow .4s; }
        .fi-ks-javon i { width: 9px; flex-shrink: 0; border-radius: 2px 2px 0 0; background: ${T.line}; height: 70%; transition: transform .4s; }
        .fi-ks-javon i:nth-child(1) { background: ${T.ink2}; height: 84%; } .fi-ks-javon i:nth-child(2) { background: ${T.accentSoft}; height: 66%; box-shadow: inset 0 0 0 1px ${T.line}; }
        .fi-ks-javon i:nth-child(3) { background: ${T.accent}; height: 92%; } .fi-ks-javon i:nth-child(4) { background: ${T.ok}; height: 78%; width: 11px; }
        .fi-ks-javon i:nth-child(5) { background: ${T.ink2}; height: 62%; } .fi-ks-javon i:nth-child(6) { background: ${T.line}; height: 88%; } .fi-ks-javon i:nth-child(7) { background: ${T.accentSoft}; height: 72%; box-shadow: inset 0 0 0 1px ${T.line}; }
        .fi-ks.b3 .fi-ks-javon { box-shadow: 0 0 0 6px ${fon(T.accent, 0.12)}, 0 0 22px ${fon(T.accent, 0.3)}; border-radius: 6px; }
        .fi-ks.b4 .fi-ks-javon i.tanla { transform: translateY(-8px); box-shadow: 0 0 0 2px ${T.paper}, 0 0 0 4px ${T.ok}; }
        .fi-ks-ochkitob { position: absolute; top: 38%; right: 9%; display: flex; flex-direction: column; align-items: center; gap: 5px; z-index: 3; animation: fi-pop .6s cubic-bezier(.2,.9,.3,1.3) .2s both; }
        .fi-ks-ochkitob::before { content: ''; display: block; width: 78px; height: 42px; border-radius: 4px; background: linear-gradient(90deg, ${T.paper} 0 48%, ${T.line} 48% 52%, ${T.paper} 52%); border: 2px solid ${T.ok}; box-shadow: 0 8px 18px -8px ${fon(T.ok, 0.6)}; }
        .fi-ks-varaq { display: none; }
        .fi-ks-belgi { font-size: 11.5px; font-weight: 800; color: ${T.paper}; background: ${T.ok}; border-radius: 999px; padding: 2px 9px; white-space: nowrap; }
        @keyframes fi-pop { from { opacity: 0; transform: translateY(30px) scale(.5); } }
        .fi-ks-stol { position: absolute; bottom: 30%; left: 30%; width: 34%; height: 8px; border-radius: 4px; background: ${T.ink2}; z-index: 1; }
        .fi-ks-stol::before, .fi-ks-stol::after { content: ''; position: absolute; top: 8px; width: 6px; height: calc(8% + 30px); min-height: 34px; background: ${T.ink2}; border-radius: 0 0 2px 2px; }
        .fi-ks-stol::before { left: 8%; } .fi-ks-stol::after { right: 8%; }
        .fi-ks-piyola { position: absolute; bottom: 8px; left: 16%; width: 16px; height: 13px; border-radius: 2px 2px 7px 7px; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.ink2}; }
        .fi-ks-odam { position: absolute; bottom: 21%; display: flex; flex-direction: column; align-items: center; gap: 3px; z-index: 2; }
        .fi-ks-odam .fi-siluet i { width: 30px; height: 30px; } .fi-ks-odam .fi-siluet b { width: 58px; height: 46px; border-radius: 29px 29px 6px 6px; }
        .fi-ks-odam.ona { left: 15%; } .fi-ks-odam.ona .fi-siluet b { background: ${T.ok}; }
        .fi-ks-odam.ogil { left: 66%; } .fi-ks-odam.ogil .fi-siluet i { width: 26px; height: 26px; } .fi-ks-odam.ogil .fi-siluet b { width: 50px; height: 38px; background: ${T.accent}; }
        .fi-ks-rol { font-size: 11px; font-weight: 800; color: ${T.ink2}; background: ${T.paper}; border-radius: 999px; padding: 1px 8px; border: 1px solid ${T.line}; }
        .fi-ks-planshet { position: absolute; z-index: 3; width: 58px; height: 40px; border-radius: 6px; background: ${T.ink}; padding: 4px; display: grid; grid-template-columns: 1fr 1fr; gap: 3px; left: calc(66% - 34px); bottom: 42%; transform: rotate(-8deg); transition: left .6s, bottom .6s, transform .6s; }
        .fi-ks-planshet i { border-radius: 2px; background: ${T.accentSoft}; }
        .fi-ks-planshet i:nth-child(2), .fi-ks-planshet i:nth-child(3) { background: ${T.paper}; }
        .fi-ks.b1 .fi-ks-planshet { left: calc(66% - 58px); bottom: 48%; transform: rotate(-14deg) scale(1.15); box-shadow: 0 0 0 4px ${fon(T.accent, 0.2)}; }
        .fi-ks.b3 .fi-ks-planshet, .fi-ks.b4 .fi-ks-planshet { left: 42%; bottom: calc(30% + 6px); transform: perspective(200px) rotateX(62deg); }
        .fi-ks-pufak { position: absolute; left: 4%; top: 7%; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; z-index: 4; animation: fi-pop .5s cubic-bezier(.2,.9,.3,1.2) .2s both; }
        .fi-ks-ishora { position: absolute; z-index: 2; left: 71%; top: 46%; width: 9%; border-top: 2.5px dashed ${T.accent}; transform: rotate(-32deg); transform-origin: left center; animation: fi-chiz .7s ease-out .2s both; }
        .fi-ks-ishora::after { content: ''; position: absolute; right: -2px; top: -7px; border: 6px solid transparent; border-left: 9px solid ${T.accent}; }
        @keyframes fi-chiz { from { width: 0; } }
        .fi-ks-muqova { position: absolute; z-index: 5; top: 8%; bottom: 8%; left: 34%; width: 32%; border-radius: 4px 12px 12px 4px; background: ${T.ink}; color: ${T.paper}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 10px; box-shadow: -6px 0 0 ${T.ink2} inset, 0 14px 30px -12px rgba(${T.shadowBase},0.6); transform-origin: left center; animation: fi-muqova 2.8s ease-in-out .3s forwards; }
        .fi-ks-m-t { font-family: 'Fraunces', serif; font-size: clamp(17px, 2vw, 22px); line-height: 1.1; text-align: center; font-weight: 400; }
        .fi-ks-m-c { width: 40%; height: 3px; border-radius: 2px; background: ${T.accent}; }
        .fi-ks-m-s { font-size: 11px; font-weight: 700; letter-spacing: .06em; opacity: .8; }
        @keyframes fi-muqova { 0%, 50% { transform: none; opacity: 1; } 100% { transform: perspective(900px) rotateY(-100deg); opacity: 0; } }
        .fi-ks-cap { position: absolute; z-index: 6; bottom: 8px; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 2px 10px; white-space: nowrap; animation: fi-kir .3s ease-out both; }
        /* --- bashorat ixcham qatori (F-1005-85) --- */
        .fi-taxmin-q { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 14px; padding: 9px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; animation: fi-kir .3s ease-out both; }
        .fi-taxmin-s { font-size: 13.5px; font-weight: 600; color: ${T.ink2}; min-width: 0; }
        .fi-taxmin-b { font-size: 13.5px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 12px; border-radius: 999px; white-space: nowrap; }
        .fi-taxmin-b b { font-family: 'JetBrains Mono', monospace; font-weight: 800; }
        /* --- 8, 9, 12: mustaqil ish formasi --- */
        .fi-mus-bosh { display: flex; flex-direction: column; gap: 10px; }
        p.fi-kirish-q { font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 8px 12px; }
        .fi-bosq { display: flex; flex-wrap: wrap; gap: 8px; }
        .fi-qchip { display: inline-flex; align-items: center; gap: 4px; padding: 7px 12px; border-radius: 999px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .fi-qchip.on { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; }
        .fi-qchip.ok { border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; }
        .fi-forma { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 14px; }
        .fi-forma-l { font-size: 14px; font-weight: 700; color: ${T.ink}; }
        p.fi-forma-savol { font-size: 15px; font-weight: 700; color: ${T.ink}; line-height: 1.45; }
        .fi-kirit { width: 100%; resize: none; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 9px 11px; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.45; color: ${T.ink}; background: ${T.paper}; outline: none; min-height: 40px; }
        .fi-kirit:focus { border-color: ${T.accent}; }
        .fi-kirit.xato { border-color: ${T.err}; background: ${T.errFon}; }
        .fi-ro { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; }
        .fi-ro-q { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600; color: ${T.ink}; text-align: left; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 8px; padding: 6px 10px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fi-ro-q:hover { border-color: ${T.accent}; }
        .fi-ro-q.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fi-amal { display: flex; justify-content: flex-end; align-items: center; gap: 10px; flex-wrap: wrap; }
        .fi-qulf { font-size: 12.5px; font-style: italic; color: ${T.ink2}; }
        p.fi-ok { font-size: 13.5px; font-weight: 700; color: ${T.ok}; }
        .fi-kim-ed { margin-top: 4px; }
        .fi-s12 { display: flex; flex-direction: column; gap: 12px; }
        .fi-s12-vis { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px; align-items: start; }
        .fi-s12-vis .fi-sh.ixcham { max-width: none; }
        .fi-taymer { display: flex; flex-direction: column; gap: 6px; }
        .fi-taymer-iz, .fi-taymer-h { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .fi-taymer-h { color: ${T.accent}; }
        .fi-taymer.tugadi .fi-taymer-h { color: ${T.ok}; }
        .fi-taymer-q { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .fi-taymer-son { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 20px; color: ${T.ink}; min-width: 58px; }
        .fi-taymer.yur .fi-taymer-son { color: ${T.accent}; } .fi-taymer.tugadi .fi-taymer-son { color: ${T.ok}; }
        .fi-taymer-yol { flex: 1; min-width: 80px; height: 6px; border-radius: 3px; background: ${T.line}; overflow: hidden; }
        .fi-taymer-yol i { display: block; height: 100%; background: ${T.accent}; transition: width 1s linear; }
        .fi-taymer.tugadi .fi-taymer-yol i { background: ${T.ok}; }
        /* --- 10: kod --- */
        .fi-darvoza { display: flex; flex-direction: column; gap: 8px; }
        .fi-darvoza-s { font-weight: 700; font-size: 14.5px; color: ${T.ink}; }
        .fi-vazifa { list-style: none; display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
        .fi-vazifa li { display: flex; gap: 8px; align-items: flex-start; font-size: 14px; line-height: 1.45; }
        .fi-vazifa i { font-style: normal; width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; background: ${T.accentSoft}; color: ${T.accent}; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
        .fi-yordam { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; margin-top: 10px; }
        .fi-kodoyna { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .fi-kod { margin: 0; background: ${CODE.bg}; color: ${CODE.text}; border-radius: 12px; padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere; user-select: none; -webkit-user-select: none; }
        .fi-kod-izoh { color: ${CODE.comment}; }
        .fi-bosh-q { font-weight: 700; border-radius: 4px; padding: 0 2px; transition: background .4s, color .4s; }
        .fi-kod.ajrat .fi-bosh-q { background: ${T.accent}; color: ${T.paper}; }
        /* --- uyga vazifa (PM HwCard) · yakun --- */
        .fi-hw { display: flex; flex-direction: column; gap: 12px; }
        .fi-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .fi-hw-q { display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .fi-hw-k { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .fi-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; line-height: 1.35; }
        .fi-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 7px; }
        .fi-hw-qadam li { display: flex; gap: 9px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .fi-hw-qadam i { font-style: normal; width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; background: ${T.accent}; color: ${T.paper}; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
        .fi-hw-keyingi { font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        p.fi-fikr { font-size: 14.5px; font-weight: 600; line-height: 1.5; color: ${T.ink}; }
        /* --- kartochka ko'rsatmasi (SABOQ 16) --- */
        .fi-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: fi-fc-halqa 1.6s ease-out 3; }
        @keyframes fi-fc-halqa { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        .fi-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .fi-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: fi-fc-nuqta 1.4s ease-in-out 3; }
        @keyframes fi-fc-nuqta { 50% { transform: scale(1.6); opacity: .4; } }
        /* --- jonli: ovoz chizig'i · mentor eslatmasi · nishon sharti --- */
        .fi-ovoz { display: flex; flex-direction: column; gap: 6px; }
        .fi-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 40px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink2}; }
        .fi-ovoz-q.men { color: ${T.ink}; font-weight: 700; }
        .fi-ovoz-yol { height: 8px; border-radius: 4px; background: ${T.bg}; overflow: hidden; }
        .fi-ovoz-yol i { display: block; height: 100%; background: ${T.accent}; border-radius: 4px; transition: width .5s; }
        .fi-ovoz-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; text-align: right; }
        .ach-rule { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .ach-rule.lost { font-style: italic; }
        .mnote-chip { align-self: flex-end; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; padding: 6px 12px; border-radius: 999px; border: 1px dashed ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; }
        .mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; }
        .mnote-lbl { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.accent}; }
        .mnote-body { font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        /* --- SABOQ 11 (qat'iy): keyingi bosiladigan joy — halqa doim, puls 2–3 marta; reduced-motion da faqat halqa --- */
        .fi-bos, .fi-bos-nav { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: fi-puls 1.6s ease-out .5s 3; }
        @keyframes fi-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70%, 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        .q-kirish .q-variantlar-kol:not(:has(.q-variant.on)) .q-variant:not(:disabled),
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled),
        .q-test-ro:not(:has(.q-test-v.xato, .q-test-v.ok, .q-test-v.kutish, .q-test-v.xira)) .q-test-v:not(:disabled),
        .fi-tanlov .q-chip:not(:disabled):not(.q-silk):not(.err),
        .fi-tomon.chorla, .fi-kirit.chorla,
        .fi-ro:not(:has(.on)) .fi-ro-q {
          box-shadow: 0 0 0 2px ${fon(T.accent, 0.32)}; animation: fi-chorla 1.7s ease-out .6s 2;
        }
        .fi-tomon.chorla { border-color: ${T.accent}; }
        .q-variant:nth-child(2), .q-chip:not(.q-silk):nth-child(2), .q-test-v:nth-child(2), .fi-tomon.ong { animation-delay: .78s; }
        .q-variant:nth-child(3), .q-chip:not(.q-silk):nth-child(3), .q-test-v:nth-child(3) { animation-delay: .96s; }
        .q-test-v:nth-child(4) { animation-delay: 1.14s; }
        @keyframes fi-chorla { 0% { box-shadow: 0 0 0 2px ${fon(T.accent, 0.32)}, 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 2px ${fon(T.accent, 0.32)}, 0 0 0 10px ${fon(T.accent, 0)}; } }
        @media (prefers-reduced-motion: reduce) {
          .fi-bos, .fi-bos-nav, .q-variant, .q-chip:not(.q-silk), .q-test-v, .fi-tomon, .fi-kirit, .fi-ro-q, .fi-pufak, .fi-tur, .fi-sh-matn, .fi-s2-karta, .fi-tomon-q, .fi-sh-sar,
          .fi-ks-ochkitob, .fi-ks-pufak, .fi-ks-ishora, .fi-ks-cap, .fi-voqea, .fi-taxmin-q, .fi-flash .fc-front, .fi-fc-ipucha i, .fi-pufak.uch i, .fi-sh-ok { animation: none !important; }
          .fi-s2-karta, .fi-ks-planshet, .fi-sh, .fi-taymer-yol i { transition: none !important; }
          .fi-ks-muqova { animation: none !important; transform: scale(.42); transform-origin: top left; left: 3%; top: 4%; bottom: auto; height: 150px; }
        }
        @media (max-width: 1199px) { .fi-sh-bosh { padding-right: 40px; } }
        @media (max-width: 760px) {
          .fi-s2 { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
          .fi-s2-sd { grid-column: 1 / -1; order: -1; flex-direction: row; align-items: flex-start; }
          .fi-tomon { min-height: 120px; padding: 10px; }
          .fi-sh-q, .fi-sh.ixcham .fi-sh-q { grid-template-columns: minmax(0,1fr) auto; gap: 2px 8px; }
          .fi-sh-nom { grid-column: 1 / -1; }
          .fi-hw-karta, .fi-ro, .fi-s12-vis { grid-template-columns: minmax(0,1fr); }
          .fi-sd-odam { width: 64px; }
          .fi-ks-javon { width: 30%; right: 3%; } .fi-ks-deraza { left: 26%; width: 18%; } .fi-ks-javon i { width: 7px; }
          .fi-ks-odam.ogil { left: 64%; } .fi-ks-odam.ona { left: 8%; } .fi-ks-stol { left: 26%; width: 36%; }
          .fi-ks-muqova { left: 26%; width: 48%; }
          .fi-kod { max-height: 190px; overflow-y: auto; }
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
