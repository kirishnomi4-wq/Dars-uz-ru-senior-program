import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 12-Modul · 6-dars (PM, 2-tur) «Birinchi foydalanuvchilar sizni qayerdan topadi?» — kalit m10-06, 16 ekran.
// Manba-haqiqat: feedback/F-1006-12modul/06-PmChannels-v3.md (GATE M 06.10.2026) + 06-FILTR.md. Kod — skelet yo'li (1-pilot PmLandingLesson infrasi), darslar mustaqil (nusxa, import emas).
// Bitta vizual — ChatTelefon (ro'yxat · chat · qoralama · yuborildi), bitta manba MENTOR_JOYLAR + MENTOR_POST. Saqlaydi: pm-m10d6-kanallar, pm-m10d6-code (tayanch 8).
// O'qiydi: pm-m9d3-intervyu, pm-m10d1-lending, pm-m9d8-platforma (yo'q bo'lsa ham ekran ishlaydi). PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QKartochka, QYakun, QVoqea, QMustaqil, QQadamlar, QXato, QIzoh, QXulosa, QPrompt } from '../qolip/index.jsx';
// Kod oynasi — umumiy modul (11-Modul darslaridagidek)
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

const LESSON_META = { lessonId: 'pm-m10d6-v1', lessonTitle: { uz: "Birinchi foydalanuvchilar sizni qayerdan topadi?", ru: "Где вас найдут первые пользователи?" } };
// 16 ekran (MD v3): kirish → reja → uch savol → 1-savol → to'rt qator → 2-savol → olti band → Facebook → 3-savol → kanallaringiz → birinchi post → kod yozish → yakuniy savol → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'kanal', ru: 'канал' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'post', ru: 'пост' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'ruxsat', ru: 'разрешение' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'belgi', ru: 'метка' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Yangi dars — ✔ o'rni MD dagidek: s3 C · s5 A · s8 D · s12 B (yakuniy).
const INLINE_KEYS = { s3: 2, s5: 0, s8: 3, s12: 1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: 'Kanal: uch savol', ru: 'Канал: три вопроса' },
    cards: [
      { ic: '1', h: { uz: "Auditoriyangiz shu yerdami? Dalil — intervyudagi «Hozir nima bilan» javobi.", ru: 'Ваша аудитория здесь? Доказательство — ответ «Чем сейчас» в интервью.' } },
      { ic: '2', h: { uz: "Siz u yerda a'zomisiz?", ru: 'Вы там состоите?' } },
      { ic: '3', h: { uz: "U yerda post yozishga ruxsat bormi? Bittasiga «yo'q» — tanlanmaydi.", ru: 'Есть ли там разрешение писать пост? На один ответ «нет» — не выбирается.' }, ask: { uz: "Siz a'zo bo'lmagan katta guruhga post yozsa bo'ladimi?", ru: 'Можно ли писать пост в большую группу, где вы не состоите?' } }
    ]
  },
  5: {
    title: { uz: "Post: to'rt qator", ru: 'Пост: четыре строки' },
    cards: [
      { ic: '1', h: { uz: 'Kim uchun — postning birinchi qatori.', ru: 'Для кого — первая строка поста.' } },
      { ic: '2', h: { uz: 'Nima foyda — odam nima oladi, bir gap.', ru: 'Какая польза — что получит человек, одна фраза.' } },
      { ic: '3', h: { uz: 'Bitta harakat — havola; halol holat — hozir nima tayyor.', ru: 'Одно действие — ссылка; честное состояние — что готово сейчас.' }, ask: { uz: "Mentor postida «Ilova ishlayapti, o'rnatish havolasi hozircha yo'q» qaysi qator?", ru: 'Какая строка в посте Ментора — «Приложение работает, ссылки для установки пока нет»?' } }
    ]
  },
  8: {
    title: { uz: 'Facebook: kichik, yopiq auditoriya', ru: 'Facebook: маленькая закрытая аудитория' },
    cards: [
      { ic: '1', h: { uz: '2004-yilda Facebook faqat Garvard talabalari uchun ochilgan.', ru: 'В 2004 году Facebook открылся только для студентов Гарварда.' } },
      { ic: '2', h: { uz: "Xizmatni tez orada «o'zinikilarning hammasi» ishlata boshlagan.", ru: 'Сервисом быстро начали пользоваться «все свои».' } },
      { ic: '3', h: { uz: 'Hamma uchun — ikki yildan keyin. Auditoriyaning zichligi hajmidan muhimroq.', ru: 'Для всех — через два года. Плотность аудитории важнее размера.' }, ask: { uz: 'Sizning auditoriyangiz qaysi bitta joyda zich turibdi?', ru: 'В каком одном месте ваша аудитория собрана плотно?' } }
    ]
  },
  12: {
    title: { uz: 'Yuborishdan oldin', ru: 'Перед отправкой' },
    cards: [
      { ic: '1', h: { uz: "Faqat o'zingiz a'zo bo'lgan joyga.", ru: 'Только туда, где состоите сами.' } },
      { ic: '2', h: { uz: "Guruhga — egasidan ruxsat so'rab.", ru: 'В группу — спросив разрешения у владельца.' } },
      { ic: '3', h: { uz: "Postni yuborishdan oldin ota-onangizga ko'rsatasiz.", ru: 'Перед отправкой показываете пост родителям.' }, ask: { uz: "Mahalla guruhiga post yuborishdan oldin kimlar ko'radi?", ru: 'Кто смотрит пост перед отправкой в группу махалли?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="kn-tviz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — ChatTelefon: telefondagi chatlar (ro'yxat · chat · qoralama · yuborildi); bitta manba MENTOR_JOYLAR + MENTOR_POST + pm-m10d6-kanallar =====
// qolip-maket: kn-tanlov kn-yorl kn-bolak kn-tur kn-javob kn-band kn-tahrir kn-bor kn-darvoza kn-ok-q kl-tugma
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const KANAL_KEY = 'pm-m10d6-kanallar';
const LEND_KEY = 'pm-m10d1-lending';
const TREK_KEY = 'pm-m9d8-platforma';
const INTERVYU_KEY = 'pm-m9d3-intervyu';
// Brend — nom o'z rangida, logotipsiz (PM-028/029, S-018)
const Tg = () => <span className="kn-tg">Telegram</span>;
const Fb = () => <span className="kn-fb">Facebook</span>;
const MJ = () => <span className="kn-mj">Maydon Jamoa</span>;
// Matndagi «Maydon Jamoa» — o'z rangida (post maketida)
const mjAjrat = (s) => (typeof s === 'string' && s.includes('Maydon Jamoa')
  ? s.split('Maydon Jamoa').map((p, i, a) => <React.Fragment key={i}>{p}{i < a.length - 1 && <MJ />}</React.Fragment>)
  : s);

// --- Bitta manbalar (P-063; tayanch 1.6 aynan) ---
const UCH_SAVOL = [
  { uz: 'Auditoriyangiz shu yerdami?', ru: 'Ваша аудитория здесь?' },
  { uz: "Siz u yerda a'zomisiz?", ru: 'Вы там состоите?' },
  { uz: 'U yerda post yozishga ruxsat bormi?', ru: 'Есть ли там разрешение писать пост?' }
];
// togri: true — «Ha» · false — «Yo'q» · '?' — dalil yo'q (06-FILTR 5: javob tanlanmaydi)
const MENTOR_JOYLAR = [
  { id: 'guruh', nom: { uz: 'Mahalla futbol guruhi', ru: 'Футбольная группа махалли' }, tur: { uz: 'Telegram guruhi · 60 kishi', ru: 'Telegram-группа · 60 человек' },
    javoblar: [
      { yozuv: { uz: "11-Modul intervyusi, «Hozir nima bilan»: 5 o'yinchidan 5 tasi Telegram guruhida «kim keladi?» deb yozishadi.", ru: 'Интервью 11-го модуля, «Чем сейчас»: 5 игроков из 5 пишут в Telegram-группе «кто придёт?».' }, togri: true },
      { yozuv: { uz: "Mentor shu guruh a'zosi.", ru: 'Ментор состоит в этой группе.' }, togri: true },
      { yozuv: { uz: 'Guruh egasidan ruxsat olingan.', ru: 'Разрешение владельца группы получено.' }, togri: true }
    ] },
  { id: 'shahar', nom: { uz: 'Shahar futbol kanali', ru: 'Городской футбольный канал' }, tur: { uz: 'Telegram kanali · katta', ru: 'Telegram-канал · большой' },
    javoblar: [
      { yozuv: { uz: "Intervyuda bu kanal tilga olinmagan — dalil yo'q.", ru: 'В интервью этот канал не упоминался — доказательства нет.' }, togri: '?' },
      { yozuv: { uz: "Mentor bu kanalda a'zo emas.", ru: 'Ментор не состоит в этом канале.' }, togri: false },
      { yozuv: { uz: "Kanalga post yozishga ruxsat yo'q.", ru: 'Разрешения писать пост в канал нет.' }, togri: false }
    ] }
];
const MENTOR_KANALLAR = [
  { uz: 'Mahalla futbol guruhi', ru: 'Футбольная группа махалли' },
  { uz: 'Sinf chati', ru: 'Чат класса' },
  { uz: "O'z Instagram sahifasi", ru: 'Своя страница в Instagram' }
];
// Post qatorlari — tayanch 1.6 tartibi (kim uchun — birinchi)
const POST_QATORLAR = [
  { id: 'kim', nom: { uz: 'kim uchun', ru: 'для кого' }, izoh: { uz: 'post kimga qaratilgan', ru: 'кому адресован пост' } },
  { id: 'foyda', nom: { uz: 'nima foyda', ru: 'какая польза' }, izoh: { uz: 'odam nima oladi', ru: 'что получит человек' } },
  { id: 'harakat', nom: { uz: 'bitta harakat', ru: 'одно действие' }, izoh: { uz: 'odam endi nima qiladi', ru: 'что человек сделает дальше' } },
  { id: 'holat', nom: { uz: 'halol holat', ru: 'честное состояние' }, izoh: { uz: 'hozir nima tayyor', ru: 'что готово сейчас' } }
];
const qNom = (id) => tr((POST_QATORLAR.find(q => q.id === id) || {}).nom);
const MANZIL_NAMUNA = 'maydon-jamoa-….netlify.app';
// Mentor posti (tayanch 1.6 so'zma-so'z; maketda {lending manzili} — 1-dars namunasi). bolaklar birlashtirilsa — matn (quruvchi tekshirdi: scratchpad 06-qurish/sinov.mjs)
const MENTOR_POST = {
  bolaklar: [
    { qator: 'kim', matn: { uz: "Mahalla futbolchilari, Shanba o'yiniga kim kelishini bitta joyda ko'rish uchun «Maydon Jamoa» ilovasini qurdim:", ru: 'Футболисты махалли, чтобы видеть в одном месте, кто придёт на субботнюю игру, я построил приложение «Maydon Jamoa»:' } },
    { qator: 'foyda', matn: { uz: "o'yin e'lon qilinadi, «Qo'shilaman» bosiladi, nechta odam yig'ilgani ko'rinib turadi.", ru: 'объявляется игра, нажимают «Присоединяюсь», видно, сколько людей собралось.' } },
    { qator: 'holat', matn: { uz: "Ilova ishlayapti, o'rnatish havolasi hozircha yo'q —", ru: 'Приложение работает, ссылки для установки пока нет —' } },
    { qator: 'harakat', matn: { uz: "sahifasini ko'ring: " + MANZIL_NAMUNA, ru: 'посмотрите страницу: ' + MANZIL_NAMUNA } }
  ]
};
MENTOR_POST.matn = { uz: MENTOR_POST.bolaklar.map(b => b.matn.uz).join(' '), ru: MENTOR_POST.bolaklar.map(b => b.matn.ru).join(' ') };
// Olti bandli ro'yxat (tayanch 1.6, 9.12 — so'zma-so'z; 7-dars ham shu matnni ishlatadi — TAYANCHGA SAVOL 11: har darsda bir xil const)
const XAVFSIZLIK = {
  bandlar: [
    { uz: "Faqat o'zim a'zo bo'lgan joyga yuboraman.", ru: 'Отправляю только туда, где состою сам.' },
    { uz: "Guruhga yuborishdan oldin egasidan ruxsat so'radim.", ru: 'Перед отправкой в группу спросил разрешения у владельца.' },
    { uz: "Postda familiya, maktab raqami, telefon va uy manzili yo'q.", ru: 'В посте нет фамилии, номера школы, телефона и домашнего адреса.' },
    { uz: "Postni yuborishdan oldin ota-onamga ko'rsatdim.", ru: 'Перед отправкой показал пост родителям.' },
    { uz: "Bitta xabarni ko'p guruhga tashlamayman, notanish odamga shaxsiy xabar yozmayman.", ru: 'Не рассылаю одно сообщение во много групп, не пишу личных сообщений незнакомым.' },
    { uz: 'Soxta akkaunt va sotib olingan obunachi ishlatmayman.', ru: 'Не использую фейковые аккаунты и купленных подписчиков.' }
  ],
  ostQator: { uz: 'Uchrashuv taklifi kelsa — faqat kattalar bilan. Yangi akkaunt ochish shart emas.', ru: 'Если предложат встретиться — только со взрослыми. Новый аккаунт открывать не нужно.' }
};
// Umami — Mentor misoli (tayanch 1.6, 1.13); instagram belgisining soni tayanchda yo'q — ko'rsatilmaydi (TAYANCHGA SAVOL 5)
const UMAMI_MENTOR = { oldin: { tashrif: 6, bosish: 2 }, keyin: { tashrif: 31, bosish: 17 }, kanal: [{ k: 'guruh', n: 19 }, { k: 'sinf', n: 9 }, { k: null, n: 3 }] };
// Joy turlari (KOD 3; egaliksiz tur-nomi, KORPUS §13) — belgi tur bo'yicha; «Boshqa» — yozuvdan
const KANAL_TURLARI = [
  { id: 'sinf', nom: { uz: 'Sinf chati', ru: 'Чат класса' }, belgi: 'sinf' },
  { id: 'maktab', nom: { uz: 'Maktab chati', ru: 'Чат школы' }, belgi: 'maktab' },
  { id: 'guruh', nom: { uz: 'Mahalla guruhi', ru: 'Группа махалли' }, belgi: 'guruh' },
  { id: 'togarak', nom: { uz: "To'garak guruhi", ru: 'Группа кружка' }, belgi: 'togarak' },
  { id: 'dostlar', nom: { uz: "Do'stlar", ru: 'Друзья' }, belgi: 'dostlar' },
  { id: 'instagram', nom: { uz: "O'z Instagram sahifasi", ru: 'Своя страница в Instagram' }, belgi: 'instagram' },
  { id: 'boshqa', nom: { uz: 'Boshqa', ru: 'Другое' }, belgi: null }
];
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normS = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const belgiYoz = (s) => normS(s).replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20);

// --- Telefon: belgi-katak, chat qatori, ChatTelefon (o'lchami barqaror 170×272 — SABOQ 22; «Telegram» o'z rangida, logotipsiz) ---
// v: null — bo'sh · true — ✓ yashil · false — ✕ kulrang · '?' — dalil yo'q · 'uyda' — ruxsat kutilmoqda
const Katak = ({ v, yangi, kRef }) => (
  <i ref={kRef} className={cxx('ct-k', v === true && 'ok', v === false && 'yoq', v === '?' && 'sav', v === 'uyda' && 'uyda', yangi && 'yangi')}>
    {v === true ? '✓' : v === false ? '✕' : v === '?' ? '?' : v === 'uyda' ? '…' : ''}
  </i>
);
// q: { k, nom, tur, belgilar?, belgi?, holat?: 'kanal'|'yoq'|'joriy'|'kutish', yorliq?, yangi?, onTahrir?, kRefs? }
const ChatQator = ({ q, mini }) => (
  <div className={cxx('ct-q', q.holat && 'h-' + q.holat, q.yangi && 'yangi', mini && 'mini', q.joy && 'joy')}>
    {q.yorliq && <span className="ct-q-y" key={String(q.yorliq)}>{q.yorliq}</span>}
    <span className="ct-ava" aria-hidden="true">{q.joy ? q.joy : String(q.nom || '?').charAt(0)}</span>
    <b className="ct-q-nom">{q.nom}</b>
    {(q.tur || q.belgi) && <span className="ct-q-alt">{q.tur && <span>{q.tur}</span>}{q.belgi && <code>?kanal={q.belgi}</code>}</span>}
    {q.belgilar && <span className="ct-kk">{q.belgilar.map((v, i) => <Katak key={i} v={v} yangi={q.yangiK === i || (q.yangi && v !== null)} kRef={q.kRefs ? (el) => { q.kRefs[i] = el; } : undefined} />)}</span>}
    {q.onTahrir && <button type="button" className="kn-tahrir" onClick={q.onTahrir} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
  </div>
);
// bolaklar: [{ k, matn, qator, holat?: 'joy'|'ok'|'yangi'|'faol'|'xato', yorliq?, onClick?, bRef?, belgi? }]
const PostPufak = ({ bolaklar = [], holat = 'chat', tepa }) => (
  <>
    {tepa}
    <div className={cxx('ct-puf', holat === 'qoralama' && 'qoralama', holat === 'yuborildi' && 'yuborildi')}>
      {bolaklar.map((b) => {
        const Tag = b.onClick ? 'button' : 'span';
        return (
          <Tag key={b.k} ref={b.bRef} type={b.onClick ? 'button' : undefined} onClick={b.onClick}
            className={cxx('ct-b', b.qator && 'q-' + b.qator, b.holat, b.onClick && 'kn-bolak')}>
            <span className="ct-b-m">{mjAjrat(b.matn)}</span>
            {(b.yorliq || b.belgi) && <em className="ct-b-y">{[b.yorliq, b.belgi].filter(Boolean).join(' ')}</em>}
          </Tag>
        );
      })}
    </div>
    {holat === 'qoralama' && <span className="ct-holat">{tr({ uz: 'Yuborilmagan', ru: 'Не отправлено' })}</span>}
    {holat === 'yuborildi' && <span className="ct-holat ok">✓ {tr({ uz: 'Yuborildi', ru: 'Отправлено' })}</span>}
  </>
);
const ChatTelefon = ({ ustYorliq, holat = 'royxat', sarlavha, qatorlar = [], chatNom, bolaklar, tepa, yashil, telRef, ostida, className, children }) => (
  <div className={cxx('ct-wrap', className)}>
    {ustYorliq && <span className="ct-ust">{ustYorliq}</span>}
    <div className={cxx('ct-tel', yashil && 'yashil')} ref={telRef}>
      <span className="ct-bar"><Tg /></span>
      {holat === 'royxat' ? (
        <div className="ct-royxat" key="r">
          {sarlavha && <span className="ct-sar" key={String(sarlavha)}>{sarlavha}</span>}
          {qatorlar.map(q => <ChatQator key={q.k} q={q} />)}
          {children}
        </div>
      ) : (
        <div className="ct-chat" key="c">
          <div className="ct-chat-h"><span aria-hidden="true">‹</span><b>{chatNom}</b></div>
          <div className="ct-chat-ichi"><PostPufak bolaklar={bolaklar} holat={holat} tepa={tepa} /></div>
        </div>
      )}
    </div>
    {ostida}
  </div>
);

// --- Umami hisoblagichi (9-Modul ko'rinishi, chizilgan, logotipsiz; SABOQ 24 — bitta jonli hisoblagich) ---
const Sanagich = ({ dan = 0, gacha }) => {
  const [n, setN] = useState(kamHarakat() ? gacha : dan);
  useEffect(() => {
    if (kamHarakat() || dan === gacha) { setN(gacha); return undefined; }
    let raf = 0; const t0 = performance.now();
    const qadam = (t) => { const p = Math.min(1, (t - t0) / 1400); setN(Math.round(dan + (gacha - dan) * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(qadam); };
    raf = requestAnimationFrame(qadam);
    return () => cancelAnimationFrame(raf);
  }, [dan, gacha]);
  return <>{n}</>;
};
const UmamiSanoq = ({ yorliq, tashrif, bosish, dan, halqa, davr, tepa, children }) => (
  <div className="kn-umami">
    <span className="kn-umami-h"><b>Umami</b><span>{yorliq}</span></span>
    {tepa}
    <span className="kn-umami-r">{davr && <span className="kn-umami-d">{davr}</span>}
      <span className={cxx('kn-umami-s', halqa && 'halqa')}>{tr({ uz: 'Tashriflar', ru: 'Посещения' })}: <b key={'t' + tashrif}><Sanagich dan={dan ? dan.tashrif : tashrif} gacha={tashrif} /></b></span>
      <span className="kn-umami-s">{tr({ uz: "«Qo'shilmoqchiman»", ru: '«Хочу присоединиться»' })}: <b key={'b' + bosish}><Sanagich dan={dan ? dan.bosish : bosish} gacha={bosish} /></b></span>
    </span>
    {children}
  </div>
);

// --- Mentor lendingi ixcham (1-dars LendingSahifa yo'li bilan, nusxa — JR-14): brauzer ramkasi · nom · sarlavha · tugma · telefon (zoom — kesilmaydi, E 41) ---
const Qulf = () => <svg className="kl-qulf" viewBox="0 0 12 14" aria-hidden="true"><rect x="1.5" y="6" width="9" height="7" rx="1.6" /><path d="M3.6 6V4.2a2.4 2.4 0 0 1 4.8 0V6" fill="none" strokeWidth="1.5" /></svg>;
const Brauzer = ({ manzil, children, className }) => (
  <div className={cxx('kl-oyna', className)}>
    <div className="kl-bar"><i /><i /><i /><span className="kl-url"><Qulf /><span className="kl-url-t" key={manzil}>{manzil}</span></span></div>
    <div className="kl-kor">{children}</div>
  </div>
);
const Doiralar = ({ bor, kerak }) => <span className="kj-doiralar" aria-hidden="true">{Array.from({ length: kerak }, (_, i) => <i key={i} className={cxx(i < bor && 'bor')} />)}</span>;
const JamoaTelefon = () => (
  <div className="kj-tel" aria-hidden="true">
    <span className="kj-bar"><b className="kj-nom">Maydon Jamoa</b></span>
    <span className="kj-ekran">
      <b className="kj-sar">{tr({ uz: "O'yinlar", ru: 'Игры' })}</b>
      <span className="kj-kun">{tr({ uz: 'Shanba', ru: 'Суббота' })}</span>
      <span className="kj-karta"><b>{tr({ uz: 'Shanba', ru: 'Суббота' })}, 18:00</b><span>{tr({ uz: 'Mahalla maydoni', ru: 'Поле махалли' })}</span><b className="kj-son">8 / 10</b><Doiralar bor={8} kerak={10} /></span>
    </span>
  </div>
);
const LENDING_MENTOR = {
  sarlavha: { uz: "Mahalla futboliga jamoani bir joyda yig'ing", ru: 'Соберите команду для футбола в махалле в одном месте' },
  tugma: { uz: "Qo'shilmoqchiman", ru: 'Хочу присоединиться' }
};
const LendingSahifa = ({ manzil = MANZIL_NAMUNA }) => (
  <Brauzer manzil={manzil}>
    <div className="kl-ichi">
      <div className="kl-chap">
        <span className="kl-nom">Maydon Jamoa</span>
        <h3 className="kl-sar">{tr(LENDING_MENTOR.sarlavha)}</h3>
        <span className="kl-tugma">{tr(LENDING_MENTOR.tugma)}</span>
      </div>
      <JamoaTelefon />
    </div>
  </Brauzer>
);

// Bosish → narsa uchadi (SABOQ 19): portal — transformli ota-blokka bog'lanmasin
function useUchish() {
  const [uchlar, setUchlar] = useState([]);
  const kRef = useRef(0);
  const uch = useCallback((fromEl, toEl, matn) => {
    if (!fromEl || !toEl || kamHarakat() || typeof document === 'undefined') return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const k = ++kRef.current;
    setUchlar(u => [...u, { k, matn, x: a.left, y: a.top, dx: b.left - a.left, dy: b.top - a.top }]);
    setTimeout(() => setUchlar(u => u.filter(z => z.k !== k)), 820);
  }, []);
  const qatlam = typeof document !== 'undefined' && uchlar.length > 0
    ? createPortal(uchlar.map(z => <span key={z.k} className="kn-uch" style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
    : null;
  return [uch, qatlam];
}
// Ipucha: 40 s harakatsizlikda bitta qator (javobni aytmaydi)
const useIpucha = (faol, dep) => {
  const [ko, setKo] = useState(false);
  useEffect(() => { setKo(false); if (!faol) return undefined; const t = setTimeout(() => setKo(true), 40000); return () => clearTimeout(t); }, [faol, dep]);
  return ko && faol;
};
// Bir lahza yonadigan belgi (yangi qator ~1 s yashil)
const useYangi = (ms = 1100) => {
  const [y, setY] = useState(null);
  useEffect(() => { if (y === null) return undefined; const t = setTimeout(() => setY(null), ms); return () => clearTimeout(t); }, [y, ms]);
  return [y, setY];
};
// Taxmin natijasi — yashil xulosaning birinchi kichik qatori (E 42): tanlangan javob qaytarilmaydi
const TaxminQ = ({ togri, haqiqat }) => (
  <span className={cxx('kn-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>
);
// Bitta yashil quti: taxmin qatori · xulosa · izoh (E 42 — izoh o'sha qutining oxirgi kichik qatori)
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="kn-x-m">{matn}</span>{izoh && <span className="kn-x-iz">{izoh}</span>}</>;
const BashoratQ = ({ savol, javob }) => <div className="kn-bashq fade-step"><span>{savol}</span><span className="kn-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;
const Atama = ({ y, children }) => <div className="kn-atama fade-step"><span className="kn-atama-y">{y}</span>{children && <QIzoh>{children}</QIzoh>}</div>;

// ===== SCREEN 0 — KIRISH (QKirish; ballsiz — J-026: correct false hammaga; «Aynan!» / «Qiziq fikr!») =====
const HOOK_OPTS = [
  { id: 'qidiruv', label: { uz: 'Qidiruvga mahsulot nomini yozib', ru: 'Набрав название продукта в поиске' } },
  { id: 'guruh', label: { uz: 'Tanish guruhdagi havolani bosib', ru: 'Нажав на ссылку в знакомой группе' } },
  { id: 'tasodif', label: { uz: 'Tasodifan sahifaga kirib qolib', ru: 'Случайно попав на страницу' } }
];
const HOOK_JAVOB = {
  guruh: { uz: <><b>Aynan!</b> Mentor misolida odamlar tanish guruhda allaqachon yig'ilgan — havolani o'sha yerda ko'radi.</>, ru: <><b>Именно!</b> В примере Ментора люди уже собрались в знакомой группе — там они и увидят ссылку.</> },
  qidiruv: { uz: <><b>Qiziq fikr!</b> Qidiruvga odam nom yozadi — «Maydon Jamoa» nomini esa hali kam odam biladi.</>, ru: <><b>Интересная мысль!</b> В поиск человек пишет название — а название «Maydon Jamoa» пока знают немногие.</> },
  tasodif: { uz: <><b>Qiziq fikr!</b> Tasodif ham bo'ladi, lekin uni kutib bo'lmaydi — havolani odamlarga o'zingiz ko'rsatasiz.</>, ru: <><b>Интересная мысль!</b> Случайность тоже бывает, но на неё не рассчитаешь — ссылку людям показываете вы сами.</> }
};
// Yo'l belgisi: qidiruv qatori · chat pufagi · «?»
const YolBelgi = ({ id }) => (
  <span className={cxx('kn-yol-m', id)} aria-hidden="true">
    {id === 'qidiruv' && <><svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" fill="none" strokeWidth="1.8" /><path d="M10.5 10.5 14 14" strokeWidth="1.8" /></svg><i>Maydon Jamoa</i></>}
    {id === 'guruh' && <><svg viewBox="0 0 16 16"><path d="M2 3h12v8H6l-3 3v-3H2z" /></svg><i>{MANZIL_NAMUNA}</i></>}
    {id === 'tasodif' && <b>?</b>}
  </span>
);
const HookMaket = ({ tanlov }) => (
  <div className="kn-hook">
    {tanlov && <div className="kn-yol" key={tanlov}><YolBelgi id={tanlov} /><i className="kn-yol-ch" /></div>}
    <LendingSahifa />
    <UmamiSanoq yorliq={tr({ uz: 'Mentor misolida · bir kun', ru: 'В примере Ментора · один день' })} tashrif={UMAMI_MENTOR.oldin.tashrif} bosish={UMAMI_MENTOR.oldin.bosish} halqa={!!tanlov} />
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('kn-s0', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Birinchi foydalanuvchilar sizni <A>qayerdan topadi?</A></>, ru: <>Где вас <A>найдут первые пользователи?</A></> })}
          mentor={<Mentor>{tr({ uz: "Lending internetda, ochilishi esa hali kam — o'zingizga yaqin javobni belgilang.", ru: 'Лендинг в интернете, но открывают его пока редко — отметьте близкий вам ответ.' })}</Mentor>}
          maket={<HookMaket tanlov={picked} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual — ChatTelefon: Mentor misolidagi joy nomlari bilan, bo'sh chiziq yo'q — SABOQ 33; kashfiyot ochilmaydi) =====
const REJA = [
  { t: { uz: 'Mahsulotingiz haqida qayerda yozishni tanlaysiz', ru: 'Выберете, где писать о своём продукте' }, teg: { uz: 'kanal', ru: 'канал' } },
  { t: { uz: 'Yuborishdan oldin nimani tekshirishni bilib olasiz', ru: 'Узнаете, что проверять перед отправкой' }, teg: { uz: 'xavfsizlik', ru: 'безопасность' } },
  { t: { uz: <><Fb /> kimlardan boshlanganini ko'rasiz</>, ru: <>Увидите, с кого начинался <Fb /></> }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: 'Birinchi postni yozib, sinf chatiga yuborasiz', ru: 'Напишете первый пост и отправите в чат класса' }, teg: { uz: 'post', ru: 'пост' } }
];
const RejaTelefon = () => (
  <div className="kn-reja">
    <ChatTelefon holat="royxat" qatorlar={[]}>
      {[MENTOR_JOYLAR[0], MENTOR_JOYLAR[1]].map((j, i) => <div key={j.id} className="kn-rj" style={{ '--d': (i * 0.4) + 's' }}><ChatQator q={{ k: j.id, nom: tr(j.nom), tur: tr(j.tur) }} /></div>)}
      <div className="kn-rj" style={{ '--d': '0.8s' }}><ChatQator q={{ k: 'sinf', nom: tr(MENTOR_KANALLAR[1]), tur: tr({ uz: 'Telegram guruhi', ru: 'Telegram-группа' }) }} /></div>
      <div className="kn-rj kn-rj-puf" style={{ '--d': '1.3s' }}><span className="ct-puf qoralama"><span className="ct-b"><span className="ct-b-m">…</span></span></span><span className="ct-holat">{tr({ uz: 'Yuborilmagan', ru: 'Не отправлено' })}</span></div>
    </ChatTelefon>
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun mahsulotingizni <A>birinchi odamlarga tanishtirasiz.</A></>, ru: <>Сегодня вы представите продукт <A>первым людям.</A></> })}
      mentor={<Mentor>{tr({ uz: "Lending bor — endi uni odamlar ko'rishi kerak. Qayerda ko'rishini o'zingiz tanlaysiz, matnni ham o'zingiz yozasiz.", ru: 'Лендинг есть — теперь его должны увидеть люди. Где увидят, выбираете вы, и текст тоже пишете сами.' })}</Mentor>}
      chapYorliq={tr({ uz: <>Dars oxirida: <code className="kn-teg">kanallar</code> va birinchi <code className="kn-teg">post</code></>, ru: <>В конце урока: <code className="kn-teg">каналы</code> и первый <code className="kn-teg">пост</code></> })}
      chap={<RejaTelefon />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — UCH SAVOL (QTushuncha markaziy: 6 javob ketma-ket, javob telefondagi katakka uchadi; atama «kanal» — misoldan keyin) =====
const S2_XATO = [
  { uz: 'Dalil — intervyudagi javob: unda shu joy bormi?', ru: 'Доказательство — ответ из интервью: есть ли там это место?' },
  { uz: "Yozuvni qayta o'qing: Mentor u yerda a'zomi?", ru: 'Перечитайте запись: состоит ли там Ментор?' },
  { uz: 'Yozuvda ruxsat haqida nima deyilgan?', ru: 'Что сказано в записи о разрешении?' }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [qi, setQi] = useState(storedAnswer ? 6 : 0);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(0);
  const [yangiK, setYangiK] = useYangi();
  const done = qi >= 6;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  const ipucha = useIpucha(!done, qi);
  const [uch, qatlam] = useUchish();
  const btnRef = useRef({}), kRefs = useRef([[], []]);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true }); }, [done]); // eslint-disable-line
  const ji = Math.min(Math.floor(qi / 3), 1), si = qi % 3;
  const joy = MENTOR_JOYLAR[ji], jav = joy.javoblar[si];
  const javobBer = (v, el) => {
    if (done) return;
    if (jav.togri !== '?' && v !== jav.togri) { setXato(si); setSilk(s => s + 1); return; }
    const belgi = jav.togri === '?' ? '?' : jav.togri ? '✓' : '✕';
    uch(el, kRefs.current[ji][si], belgi);
    setXato(null); setYangiK(qi); setQi(qi + 1);
  };
  const belgilar = (j) => [0, 1, 2].map(i => { const n = j * 3 + i; return n < qi ? MENTOR_JOYLAR[j].javoblar[i].togri : null; });
  const guruhOk = qi >= 3, shaharOk = qi >= 6;
  const javobSoni = qi > 3 ? qi - 1 : qi;
  const qatorlar = [
    { k: 'guruh', nom: tr(MENTOR_JOYLAR[0].nom), tur: tr(MENTOR_JOYLAR[0].tur), belgilar: belgilar(0), kRefs: kRefs.current[0], yangiK: yangiK !== null && yangiK < 3 ? yangiK : undefined,
      holat: guruhOk ? 'kanal' : ji === 0 ? 'joriy' : undefined, yorliq: guruhOk ? tr({ uz: 'kanal', ru: 'канал' }) : undefined },
    ...(tugadi ? [
      { k: 'sinf', nom: tr(MENTOR_KANALLAR[1]), tur: tr({ uz: 'Telegram guruhi', ru: 'Telegram-группа' }), yangi: true },
      { k: 'insta', nom: tr(MENTOR_KANALLAR[2]), tur: 'Instagram', yangi: true }
    ] : []),
    { k: 'shahar', nom: tr(MENTOR_JOYLAR[1].nom), tur: tr(MENTOR_JOYLAR[1].tur), belgilar: belgilar(1), kRefs: kRefs.current[1], yangiK: yangiK !== null && yangiK >= 3 ? yangiK - 3 : undefined,
      holat: shaharOk ? 'yoq' : ji === 1 ? 'joriy' : undefined, yorliq: shaharOk ? tr({ uz: 'tanlanmadi', ru: 'не выбран' }) : undefined }
  ];
  const telefon = (
    <ChatTelefon ustYorliq={tr({ uz: 'Mentor telefoni', ru: 'Телефон Ментора' })} holat="royxat" qatorlar={qatorlar}
      sarlavha={tugadi ? tr({ uz: 'Mentorning uch kanali', ru: 'Три канала Ментора' }) : undefined} />
  );
  const izohlar = (
    <div className="kn-izohlar">
      {guruhOk && <Atama y={tr({ uz: 'kanal', ru: 'канал' })}>{tr({ uz: 'Odamlar mahsulot haqida eshitadigan joy — kanal deyiladi.', ru: 'Место, где люди слышат о продукте, называется каналом.' })}</Atama>}
      {shaharOk && <QIzoh>{tr({ uz: "Dalil yo'q — «yo'q» degani emas: bu joyni a'zolik va ruxsat to'xtatdi.", ru: 'Нет доказательства — не значит «нет»: это место остановили членство и разрешение.' })}</QIzoh>}
    </div>
  );
  const karta = !done && (
    <div key={qi} className={cxx('kn-karta', 'kn-kirish', xato !== null && 'err')}>
      <div className="kn-uch-q">
        <span className="q-yorliq">{tr({ uz: 'Uch savol', ru: 'Три вопроса' })} · {tr(joy.nom)}</span>
        <span className="kn-uch-n">{[0, 1, 2].map(i => { const v = i < si ? jav && joy.javoblar[i].togri : null; return <i key={i} className={cxx(i === si && 'cur', i < si && (v === true ? 'ok' : 'yoq'))}>{i < si ? (v === true ? '✓' : v === '?' ? '?' : '✕') : i + 1}</i>; })}</span>
      </div>
      <b className="kn-karta-nom">{tr(UCH_SAVOL[si])}</b>
      <p className="kn-yozuv"><span>{tr({ uz: 'Mentor yozuvi', ru: 'Запись Ментора' })}:</span> {tr(jav.yozuv)}</p>
      {jav.togri === '?'
        ? <div className="kn-javoblar"><i className="ct-k sav katta" aria-hidden="true">?</i><button type="button" ref={el => { btnRef.current.k = el; }} className="kn-javob kn-halqa" onClick={() => javobBer('?', btnRef.current.k)}>{tr({ uz: 'Keyingi savol', ru: 'Следующий вопрос' })}</button></div>
        : <div key={silk} className={cxx('kn-javoblar', 'kn-chorla', silk > 0 && 'silk')}>
            <button type="button" ref={el => { btnRef.current.ha = el; }} className="kn-javob" onClick={() => javobBer(true, btnRef.current.ha)}>{tr({ uz: 'Ha', ru: 'Да' })}</button>
            <button type="button" ref={el => { btnRef.current.yoq = el; }} className="kn-javob" onClick={() => javobBer(false, btnRef.current.yoq)}>{tr({ uz: "Yo'q", ru: 'Нет' })}</button>
          </div>}
      {xato !== null && <QXato>{tr(S2_XATO[xato])}</QXato>}
      {ipucha && <p className="kn-ipucha fade-step">{tr({ uz: "Kulrang yozuvni o'qing — u savolga nima deydi?", ru: 'Прочитайте серую запись — что она говорит о вопросе?' })}</p>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · kanal', ru: 'Понятие · канал' })} screen={screen} scrollSignal={qi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Savollarga javob bering', ru: 'Ответьте на вопросы' })} (${javobSoni}/5)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mentor mahsuloti haqida <A>qayerda yozadi?</A></>, ru: <>Где Ментор <A>пишет о своём продукте?</A></> })}
        mentor={<Mentor>{tr({ uz: "Ikki joydan birini tanlayapman: har savolga kulrang yozuvga qarab «Ha» yoki «Yo'q»ni bosing.", ru: 'Я выбираю одно из двух мест: на каждый вопрос нажмите «Да» или «Нет», глядя на серую запись.' })}</Mentor>}
        vizual={tugadi
          ? <div className="kn-fokus kn-yon">{telefon}{izohlar}</div>
          : <div className="kn-split">{<div className="kn-chap">{telefon}{izohlar}</div>}{karta}</div>}
        xulosa={done && tr({ uz: "Bizda kanal uch savol bilan tanlanadi: bittasiga «yo'q» bo'lsa, u joy tanlanmaydi.", ru: 'У нас канал выбирают по трём вопросам: если на один ответ «нет», место не выбирается.' })}
      />
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ C, INLINE_KEYS.s3 = 2; savol ustida yorliq yo'q — SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · uch savol', ru: 'Проверка · три вопроса' })}
    questionText="Sport to'garagining Telegram guruhida a'zo emassiz. Nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Sport to'garagining Telegram guruhida a'zo emassiz. <A>Nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">Вы не состоите в Telegram-группе спортивного кружка. <A>Что сделаете?</A></h2> })}
    options={[
      { uz: "Guruhga qo'shilib, o'sha kuni post yozasiz", ru: 'Вступите в группу и в тот же день напишете пост' },
      { uz: "Guruh a'zolariga birma-bir shaxsiy yozasiz", ru: 'Напишете участникам группы лично по одному' },
      { uz: "O'zingiz a'zo bo'lgan joydan boshlaysiz", ru: 'Начнёте с места, где состоите сами' },
      { uz: 'Yangi akkaunt ochib, guruhga post yozasiz', ru: 'Откроете новый аккаунт и напишете пост в группу' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Ikkinchi savolga javob «yo'q» — bu joy kanalingiz emas.", ru: 'Ответ на второй вопрос — «нет»: это место не ваш канал.' }}
    explainWrong={{
      0: { uz: "Qo'shilgan zahoti yozish — egasidan ruxsat so'ralmagan.", ru: 'Писать сразу после вступления — разрешения у владельца не спросили.' },
      1: { uz: 'Ular sizni tanimaydi — notanishga shaxsiy yozilmaydi.', ru: 'Они вас не знают — незнакомым лично не пишут.' },
      3: { uz: "Yangi akkaunt ham ruxsat bermaydi — egasi so'ralmagan.", ru: 'Новый аккаунт тоже не даёт разрешения — владельца не спросили.' },
      default: { uz: "Uch savolni shu guruhga bering: qaysi biri «yo'q»?", ru: 'Задайте этой группе три вопроса: на какой ответ «нет»?' }
    }}
    vizual={<div className="kn-tviz-q"><ChatQator mini q={{ k: 'sport', nom: tr({ uz: "Sport to'garagi", ru: 'Спортивный кружок' }), tur: tr({ uz: 'Telegram guruhi', ru: 'Telegram-группа' }), belgilar: [null, false, false] }} /></div>} />
);

// ===== SCREEN 4 — TO'RT QATOR (QTushuncha: yorliqni tanlash → matndagi joyini bosish, KORPUS §16; atama «post» — misoldan keyin) =====
const S4_TARTIB = ['holat', 'kim', 'harakat', 'foyda']; // o'ngda aralash tartibda (MD)
const S4_XATO = {
  kim: { uz: 'Kim uchun — post kimga qaratilgan. Bu joyda shu bormi?', ru: 'Для кого — кому адресован пост. Есть ли это здесь?' },
  foyda: { uz: 'Foyda — odam nima oladi. Bu joyda shu bormi?', ru: 'Польза — что получит человек. Есть ли это здесь?' },
  harakat: { uz: 'Harakat — odam endi nima qiladi. Bu joyda shu bormi?', ru: 'Действие — что человек сделает дальше. Есть ли это здесь?' },
  holat: { uz: 'Holat — hozir nima tayyor. Bu joyda shu bormi?', ru: 'Состояние — что готово сейчас. Есть ли это здесь?' }
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [joyda, setJoyda] = useState(() => (storedAnswer ? S4_TARTIB.slice() : []));
  const [tanlangan, setTanlangan] = useState(null);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(0);
  const [yangi, setYangi] = useYangi();
  const done = joyda.length >= 4;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  const ipucha = useIpucha(!done, joyda.length + (tanlangan || ''));
  const [uch, qatlam] = useUchish();
  const yRef = useRef({}), bRef = useRef({});
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true }); }, [done]); // eslint-disable-line
  const tanla = (id) => { if (done || joyda.includes(id)) return; setTanlangan(t => (t === id ? null : id)); setXato(null); };
  const bos = (qator) => {
    if (!tanlangan || joyda.includes(qator)) return;
    if (qator !== tanlangan) { setXato(tanlangan); setSilk(s => s + 1); setTanlangan(null); return; }
    uch(yRef.current[tanlangan], bRef.current[qator], qNom(qator));
    setJoyda(j => [...j, qator]); setYangi(qator); setTanlangan(null); setXato(null);
  };
  // Telefonda — rangli chiziq (yorliq telefonga sig'maydi); yorliqlar — natijadagi keng chat oynasida («pufak butun enga», MD)
  const bolaklar = (yorliqli) => MENTOR_POST.bolaklar.map(b => {
    const ok = joyda.includes(b.qator);
    return { k: b.qator, qator: ok ? b.qator : null, matn: tr(b.matn), bRef: yorliqli ? undefined : (el) => { bRef.current[b.qator] = el; },
      holat: ok ? (yangi === b.qator ? 'ok yangi' : 'ok') : tanlangan ? 'joy faol' : 'joy',
      yorliq: ok && yorliqli ? qNom(b.qator) : null, onClick: !ok && tanlangan && !done ? () => bos(b.qator) : undefined };
  });
  const chatNom = tr({ uz: 'Mahalla futbol guruhi · 60 kishi', ru: 'Футбольная группа махалли · 60 человек' });
  const telefon = (
    <ChatTelefon ustYorliq={tr({ uz: 'Mentor telefoni', ru: 'Телефон Ментора' })} holat="chat" chatNom={chatNom}
      bolaklar={bolaklar(false)} tepa={done && <span className="ct-atama fade-step">post</span>} />
  );
  const izoh = done && <Atama y="post">{tr({ uz: 'Kanalga yoziladigan matn — post deyiladi.', ru: 'Текст, который пишут в канал, называется постом.' })}</Atama>;
  const yorliqlar = !done && (
    <div className="kn-karta kn-yorlar">
      <span className="q-yorliq">{tr({ uz: "To'rt yorliq", ru: 'Четыре ярлыка' })} · {joyda.length} / 4</span>
      <div key={silk} className={cxx('kn-yorl-ro', !tanlangan && 'kn-chorla')}>
        {S4_TARTIB.map(id => {
          const q = POST_QATORLAR.find(x => x.id === id);
          const ok = joyda.includes(id);
          return (
            <button key={id} type="button" ref={el => { yRef.current[id] = el; }} disabled={ok} onClick={() => tanla(id)}
              className={cxx('kn-yorl', 'q-' + id, ok && 'ok', tanlangan === id && 'on', xato === id && 'silk')}>
              <b>{ok ? '✓ ' : ''}{tr(q.nom)}</b><span>{tr(q.izoh)}</span>
            </button>
          );
        })}
      </div>
      {xato && <QXato>{tr(S4_XATO[xato])}</QXato>}
      {ipucha && <p className="kn-ipucha fade-step">{tr({ uz: "Tanlangan yorliq ostidagi kulrang izohni o'qing — matnning qaysi joyi shuni aytadi?", ru: 'Прочитайте серую подсказку под выбранным ярлыком — какое место текста говорит об этом?' })}</p>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · post', ru: 'Понятие · пост' })} screen={screen} scrollSignal={joyda.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Yorliqlarni joylang', ru: 'Расставьте ярлыки' })} (${joyda.length}/4)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mahalla guruhiga Mentor <A>nima deb yozdi?</A></>, ru: <>Что Ментор <A>написал в группу махалли?</A></> })}
        mentor={<Mentor>{tr({ uz: "Avval o'ngdagi yorliqni tanlang, so'ng chapdagi matnda uning joyini bosing.", ru: 'Сначала выберите ярлык справа, затем нажмите его место в тексте слева.' })}</Mentor>}
        vizual={tugadi
          ? <div className="kn-fokus"><ChatOyna nom={chatNom} keng><PostPufak bolaklar={bolaklar(true)} tepa={<span className="ct-atama">post</span>} /></ChatOyna>{izoh}</div>
          : <div className="kn-split"><div className="kn-chap">{telefon}{izoh}</div>{yorliqlar}</div>}
        xulosa={done && tr({ uz: "Bizda post to'rt qatordan iborat: kim uchun, nima foyda, bitta harakat va halol holat.", ru: 'У нас пост состоит из четырёх строк: для кого, какая польза, одно действие и честное состояние.' })}
      />
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; ✔ A, INLINE_KEYS.s5 = 0; iqtibos — chat maketida, TAYANCHGA SAVOL 7) =====
const S5_POST = [
  { qator: 'kim', matn: { uz: 'Sinfdoshlar,', ru: 'Одноклассники,' } },
  { qator: 'foyda', matn: { uz: "uy vazifalari bir joyda turadigan sayt: har fan alohida ro'yxatda.", ru: 'сайт, где домашние задания лежат в одном месте: каждый предмет отдельным списком.' } },
  { qator: 'holat', matn: null },
  { qator: 'harakat', matn: { uz: 'Sahifani oching: …', ru: 'Откройте страницу: …' } }
];
const ChatOyna = ({ nom, keng, yashil, children }) => (
  <div className={cxx('kn-chatoyna', keng && 'keng', yashil && 'yashil')}>
    <div className="ct-chat-h"><span aria-hidden="true">‹</span><b>{nom}</b><Tg /></div>
    <div className="kn-chatoyna-i">{children}</div>
  </div>
);
const S5Iqtibos = () => (
  <ChatOyna nom={tr({ uz: 'Sinf chati', ru: 'Чат класса' })}>
    <div className="ct-puf"><span className="ct-b"><span className="ct-b-m">{S5_POST.filter(b => b.matn).map(b => tr(b.matn)).join(' ')}</span></span></div>
  </ChatOyna>
);
const S5Javob = () => (
  <div className="kn-chatoyna kn-s5j"><div className="kn-chatoyna-i">
    <PostPufak bolaklar={S5_POST.map(b => (b.matn
      ? { k: b.qator, qator: b.qator, matn: tr(b.matn), holat: 'ok', yorliq: qNom(b.qator) }
      : { k: b.qator, matn: '', holat: 'joy bosh', yorliq: qNom('holat') + '?' }))} />
  </div></div>
);
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · to'rt qator", ru: 'Проверка · четыре строки' })}
    questionText="Bu postda to'rt qatordan qaysi biri yo'q?"
    question={tr({ uz: <><S5Iqtibos /><h2 className="title h-ask">Bu postda to'rt qatordan <A>qaysi biri yo'q?</A></h2></>, ru: <><S5Iqtibos /><h2 className="title h-ask">Какой из четырёх строк <A>нет в этом посте?</A></h2></> })}
    options={[
      { uz: 'Sayt hozir qanday holatda ekani', ru: 'В каком состоянии сайт сейчас' },
      { uz: 'Post kimlarga qaratib yozilgani', ru: 'Кому адресован пост' },
      { uz: 'Odam saytdan nima foyda olishi', ru: 'Какую пользу человек получит от сайта' },
      { uz: 'Odam endi nima qilishi kerakligi', ru: 'Что человеку делать дальше' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Sayt hozir ishlaydimi yoki hali yo'qmi — postda yozilmagan.", ru: 'Работает ли сайт сейчас или его ещё нет — в посте не написано.' }}
    explainWrong={{
      1: { uz: "Birinchi so'zni o'qing: post kimga qaratilgan?", ru: 'Прочитайте первое слово: кому адресован пост?' },
      2: { uz: "«Bir joyda turadigan» — odam oladigan narsa emasmi?", ru: '«Лежат в одном месте» — разве это не то, что получает человек?' },
      3: { uz: 'Oxirgi gapda odamga nima qilish aytilgan?', ru: 'Что в последней фразе сказано сделать человеку?' },
      default: { uz: "To'rt qatorni birma-bir izlang: qaysi biri topilmadi?", ru: 'Ищите четыре строки по одной: какая не нашлась?' }
    }}
    vizual={<S5Javob />} />
);

// ===== SCREEN 6 — OLTI BAND (QTushuncha ketma-ket, bitta katta karta — SABOQ 9/13; to'g'ri javob ro'yxatga uchib band bo'ladi) =====
// VAZIYATLAR — namoyish matnlari (TAYANCHGA SAVOL 8); band — XAVFSIZLIK.bandlar indeksi
const VAZIYATLAR = [
  { matn: { uz: "Postni o'zingiz a'zo bo'lgan sinf chatiga Mentor ko'rgach yuborasiz.", ru: 'Отправляете пост в чат класса, где состоите, после того как его посмотрел Ментор.' }, mumkin: true, band: 0,
    xato: { uz: "A'zo bo'lgan chat, Mentor ko'rgan — qaysi band to'sadi?", ru: 'Чат, где вы состоите, Ментор посмотрел — какой пункт мешает?' } },
  { matn: { uz: "Mahalla guruhiga egasidan so'ramasdan post yuborasiz.", ru: 'Отправляете пост в группу махалли, не спросив владельца.' }, mumkin: false, band: 1,
    xato: { uz: "Guruhning egasi bor — avval undan so'raladi.", ru: 'У группы есть владелец — сначала спрашивают его.' } },
  { matn: { uz: 'Postga maktabingiz raqami va telefoningizni yozasiz.', ru: 'Пишете в пост номер своей школы и телефон.' }, mumkin: false, band: 2,
    xato: { uz: "Postni ko'p odam ko'radi — unda nima turibdi?", ru: 'Пост увидят многие — что в нём написано?' } },
  { matn: { uz: "Yuborishdan oldin postni ota-onangizga ko'rsatasiz.", ru: 'Перед отправкой показываете пост родителям.' }, mumkin: true, band: 3,
    xato: { uz: "Ota-ona ko'rishi — sizning xavfsizligingiz uchun.", ru: 'Родители смотрят — ради вашей безопасности.' } },
  { matn: { uz: "Bitta postni o'nta guruhga birdaniga yuborasiz.", ru: 'Отправляете один пост сразу в десять групп.' }, mumkin: false, band: 4,
    xato: { uz: "O'nta guruh — hammasida a'zomisiz, ruxsat bormi?", ru: 'Десять групп — во всех состоите, разрешение есть?' } },
  { matn: { uz: "Ko'proq ko'rinsin deb obunachi sotib olasiz.", ru: 'Покупаете подписчиков, чтобы вас больше видели.' }, mumkin: false, band: 5,
    xato: { uz: 'Sotib olingan obunachi — halol son emas.', ru: 'Купленные подписчики — нечестное число.' } }
];
const BandRoyxat = ({ n, yangi, ost, rRef, kataklar, onKatak, yorliqlar = {}, yopiq = [], ixcham, faqat }) => (
  <div className={cxx('kn-royxat', ixcham && 'ixcham')} ref={rRef}>
    <div className="kn-royxat-h"><b>{tr({ uz: 'Yuborishdan oldin', ru: 'Перед отправкой' })}</b>{n != null && <span className="kn-royxat-n" key={n}>{n} / 6</span>}</div>
    <ul className="kn-bandlar">
      {XAVFSIZLIK.bandlar.map((b, i) => {
        if ((n != null && i >= n) || (faqat && !faqat.includes(i))) return null;
        const v = kataklar ? !!kataklar[i] : false;
        const qulf = yopiq.includes(i);
        return (
          <li key={i} className={cxx(yangi === i && 'yangi', v && 'ok')}>
            {onKatak
              ? <button type="button" className={cxx('kn-band', v && 'ok')} disabled={qulf} aria-pressed={v} onClick={() => onKatak(i)}><i>{v ? '✓' : ''}</i></button>
              : <i className={cxx('kn-band-k', v && 'ok')} aria-hidden="true">{v ? '✓' : ''}</i>}
            <span className="kn-band-t">{i + 1}) {tr(b)}{yorliqlar[i] && <em>{yorliqlar[i]}</em>}</span>
          </li>
        );
      })}
    </ul>
    {ost && <p className="kn-ost fade-step">{tr(XAVFSIZLIK.ostQator)}</p>}
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [vi, setVi] = useState(storedAnswer ? 6 : 0);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(0);
  const [yangi, setYangi] = useYangi();
  const wrongRef = useRef(false);
  const done = vi >= 6;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null), royxatRef = useRef(null);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    const first = !wrongRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: first, firstAttemptCorrect: first, solved: true, picked: true });
  }, [done]); // eslint-disable-line
  const v = VAZIYATLAR[Math.min(vi, 5)];
  const javob = (m) => {
    if (done) return;
    if (m !== v.mumkin) { wrongRef.current = true; if (achMiss) achMiss.miss(screen); setXato(vi); setSilk(s => s + 1); return; }
    uch(kartaRef.current, royxatRef.current, `${v.band + 1}) ${tr(XAVFSIZLIK.bandlar[v.band]).slice(0, 34)}…`);
    setXato(null); setYangi(vi); setVi(vi + 1);
  };
  const royxat = <BandRoyxat n={tugadi ? null : vi} yangi={yangi} ost={done} rRef={royxatRef} />;
  const karta = !done && (
    <div key={vi} ref={kartaRef} className={cxx('kn-karta', 'kn-kirish', xato !== null && 'err')}>
      <span className="kn-raqamlar">{VAZIYATLAR.map((_, i) => <i key={i} className={cxx(i < vi && 'ok', i === vi && 'cur')}>{i < vi ? '✓' : i + 1}</i>)}</span>
      <b className="kn-karta-nom">{tr(v.matn)}</b>
      <div key={silk} className={cxx('kn-javoblar', 'kn-chorla', silk > 0 && 'silk')}>
        <button type="button" className="kn-javob" onClick={() => javob(true)}>{tr({ uz: 'Mumkin', ru: 'Можно' })}</button>
        <button type="button" className="kn-javob" onClick={() => javob(false)}>{tr({ uz: 'Mumkin emas', ru: 'Нельзя' })}</button>
      </div>
      {xato !== null && <QXato>{tr(VAZIYATLAR[xato].xato)}</QXato>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · xavfsizlik', ru: 'Понятие · безопасность' })} screen={screen} scrollSignal={vi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Vaziyatlarga javob bering', ru: 'Ответьте на ситуации' })} (${vi}/6)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Postni yuborishdan oldin <A>nimani tekshirasiz?</A></>, ru: <>Что вы <A>проверяете</A> перед отправкой поста?</> })}
        mentor={<Mentor>{tr({ uz: "Har vaziyatga «Mumkin» yoki «Mumkin emas» deb javob bering.", ru: 'На каждую ситуацию ответьте «Можно» или «Нельзя».' })}</Mentor>}
        vizual={tugadi ? <div className="kn-fokus">{royxat}</div> : <div className="kn-split kn-s6">{royxat}{karta}</div>}
        xulosa={done && tr({ uz: 'Bu kursda post olti band tekshirilgandan keyin yuboriladi.', ru: 'В этом курсе пост отправляют после проверки по шести пунктам.' })}
      />
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 7 — FACEBOOK (QVoqea, PM keys K8 — faqat bank matni; SABOQ 2, 3, 8, 26). Manba: PM_Prompt_v8.md K8 (208–211) · tayanch 5 =====
// Sahna: brauzer oynasi, tepada «Facebook» o'z rangida; ichida auditoriya doirasi. Son, asoschi, sabab chizilmaydi (bankda yo'q).
const FACEBOOK_KADR = [
  { h: { uz: 'Garvard', ru: 'Гарвард' }, m: { uz: '2004-yilda Facebook faqat Garvard talabalari uchun ochilgan — kichik, yopiq auditoriya. Garvard — Amerikadagi universitet.', ru: 'В 2004 году Facebook открылся только для студентов Гарварда — маленькая закрытая аудитория. Гарвард — университет в Америке.' } },
  { h: { uz: "O'zinikilar", ru: '«Все свои»' }, m: { uz: "Xizmatni tez orada «o'zinikilarning hammasi» ishlata boshlagan.", ru: 'Сервисом быстро начали пользоваться «все свои».' } },
  { h: { uz: 'Hamma uchun', ru: 'Для всех' }, m: { uz: 'Keyin universitet ketidan universitetga ochilgan, hamma uchun — ikki yildan keyin. Auditoriyaning zichligi hajmidan muhimroq.', ru: 'Потом открывался университет за университетом, для всех — через два года. Плотность аудитории важнее размера.' } }
];
const FB_TAXMIN = [
  { k: 'bir', t: { uz: 'Bir nechta qiziquvchi', ru: 'Несколько любопытных' } },
  { k: 'qism', t: { uz: 'Talabalarning bir qismi', ru: 'Часть студентов' } },
  { k: 'hamma', ok: true, t: { uz: "O'zinikilarning hammasi", ru: '«Все свои»' } }
];
const FB_SAVOL = { uz: 'Yopiq auditoriyada xizmatni kimlar ishlata boshlagan?', ru: 'Кто начал пользоваться сервисом в закрытой аудитории?' };
// Real ko'rinishdagi odam (SABOQ 36): bosh, soch, yuz belgisi, rangli kiyim
const ODAM_RANG = ['#E07A5F', '#3D8BD9', '#E8A13A', '#5FA37A', '#B5679E', '#4A90A4'];
const SOCH_RANG = ['#2E2019', '#5A3A22', '#1E1E24', '#7A4A2A'];
const Odamcha = ({ i = 0 }) => (
  <svg className="fb-odam" viewBox="0 0 24 30" aria-hidden="true" style={{ '--i': i }}>
    <rect x="4" y="17" width="16" height="13" rx="6" fill={ODAM_RANG[i % ODAM_RANG.length]} />
    <circle cx="12" cy="10.5" r="6.2" fill="#E3A87C" />
    <path d="M5.8 10 C5 3, 19 3, 18.2 10 C16 6.6, 9 6.4, 5.8 10 Z" fill={SOCH_RANG[i % SOCH_RANG.length]} />
    <circle cx="9.8" cy="11.2" r="0.9" fill="#2A2730" /><circle cx="14.2" cy="11.2" r="0.9" fill="#2A2730" />
    <path d="M10 13.8 Q12 15.2 14 13.8" stroke="#8A4B3A" strokeWidth="0.9" fill="none" strokeLinecap="round" />
  </svg>
);
const FbDoira = ({ son = 6, yon, yashil, qulf, yorliq, className, dan = 0 }) => (
  <div className={cxx('fb-doira', yon && 'yon', yashil && 'yashil', className)}>
    <span className="fb-odamlar">{Array.from({ length: son }, (_, i) => <Odamcha key={i} i={i + dan} />)}</span>
    {qulf && <span className="fb-qulf"><Qulf /></span>}
    {yorliq && <span className="fb-yorliq">{yorliq}</span>}
  </div>
);
const FacebookSahna = ({ b }) => (
  <div className="fb-sahna">
    <div className="fb-oyna">
      <div className="kl-bar"><i /><i /><i /><span className="kl-url" /></div>
      <div className="fb-h"><Fb /></div>
      <div className="fb-maydon">
        <FbDoira className="asosiy" yon={b >= 1} yashil={b >= 1} qulf yorliq={tr({ uz: 'faqat Garvard talabalari', ru: 'только студенты Гарварда' })} />
        {b >= 2 && [0, 1, 2].map(i => <FbDoira key={i} className="yangi" son={4} dan={i + 2} yon yashil />)}
        {b >= 2 && <span className="fb-katta"><span className="fb-yorliq">{tr({ uz: 'hamma uchun · ikki yildan keyin', ru: 'для всех · через два года' })}</span></span>}
      </div>
    </div>
  </div>
);
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const kadr = FACEBOOK_KADR[b];
  const kutish = b === 0 && !taxmin;
  const tx = FB_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Fb /> · {b + 1}/3</>;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} scrollSignal={b} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Voqea davomi', ru: 'Продолжение истории' })} (${b + 1}/3)`} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Fb /> <A>kimlardan boshlangan?</A></>, ru: <>С кого <A>начинался</A> <Fb />?</> })}
        nuqtalar={<>
          <Mentor key={'m' + b}>{tr(kadr.m)}</Mentor>
          <div className="kn-nuq"><span className="kn-nuq-l">{yorliq}</span>{FACEBOOK_KADR.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="kn-voqea">
          {b === 0 && <p className="kn-tanish"><Fb /> — {tr({ uz: "do'stlar bilan yozishadigan va yangilik ulashadigan ijtimoiy tarmoq.", ru: 'социальная сеть, где переписываются с друзьями и делятся новостями.' })}</p>}
          <span className="kn-voqea-h" key={'h' + b}>{tr(kadr.h)}</span>
          {taxmin && !done && <BashoratQ savol={tr(FB_SAVOL)} javob={tr(tx.t)} />}
          <div className={cxx('kn-voqea-qator', (kutish || done) && 'ikki')}>
            <Zoomable><FacebookSahna b={b} /></Zoomable>
            {done && <QXulosa><XulosaQ natija={tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: "o'zinikilarning hammasi", ru: '«все свои»' })} />}
              matn={tr({ uz: "Bu voqeada xizmat avval kichik, yopiq auditoriyada ochilgan. Mentorning birinchi kanali ham — o'zi a'zo guruh.", ru: 'В этой истории сервис сначала открылся в маленькой закрытой аудитории. Первый канал Ментора — тоже группа, где он состоит.' })}
              izoh={tr({ uz: "Zich auditoriya — mahsulot kerak bo'lgan odamlar bir joyda ko'p yig'ilgani.", ru: 'Плотная аудитория — когда люди, которым нужен продукт, собрались в одном месте.' })} /></QXulosa>}
              {kutish && <div className="kn-chorla-b"><QBashorat yorliq={yorliq} savol={tr(FB_SAVOL)} variantlar={FB_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>}
          </div>
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 8 — 3-SAVOL (QuestionScreen; ✔ D, INLINE_KEYS.s8 = 3) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Facebook'dagidek", ru: 'Проверка · как в Facebook' })}
    questionText="Facebook voqeasi birinchi kanal haqida nimani eslatadi?"
    question={tr({ uz: <h2 className="title h-ask"><Fb /> voqeasi birinchi kanal haqida <A>nimani eslatadi?</A></h2>, ru: <h2 className="title h-ask">О чём история <Fb /> <A>напоминает</A> про первый канал?</h2> })}
    options={[
      { uz: 'Auditoriyasi eng katta joydan boshlashni', ru: 'Начинать с места с самой большой аудиторией' },
      { uz: 'Bir kunda hamma guruhga yozib chiqishni', ru: 'За один день написать во все группы' },
      { uz: 'Avval universitet talabalariga yozishni', ru: 'Сначала писать студентам университета' },
      { uz: 'Auditoriya zich turgan joydan boshlashni', ru: 'Начинать с места, где аудитория плотная' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Bu voqeada xizmat avval kichik, yopiq auditoriyada ochilgan.', ru: 'В этой истории сервис сначала открылся в маленькой закрытой аудитории.' }}
    explainWrong={{
      0: { uz: 'Facebook eng katta auditoriyadan boshlaganmi?', ru: 'Facebook начинал с самой большой аудитории?' },
      1: { uz: 'Bu voqeada hamma uchun ochilish — ikki yildan keyin.', ru: 'В этой истории для всех открылись — через два года.' },
      2: { uz: 'Garvard — Facebook auditoriyasi edi. Siznikichi?', ru: 'Гарвард был аудиторией Facebook. А ваша?' },
      default: { uz: 'Facebook avval kimlar uchun ochilganini eslang.', ru: 'Вспомните, для кого сначала открылся Facebook.' }
    }}
    vizual={<div className="kn-tviz-q"><FbDoira className="mini" son={5} yon yashil qulf /></div>} />
);

// ===== SCREEN 9 — KANALLARINGIZ (QMustaqil, USTAXONA — bittadan karta, ko'pi bilan 3 joy; SABOQ 9, 13, 17, 29) · yozadi pm-m10d6-kanallar.kanallar · nishon myChannels =====
const kichik = (s) => (typeof s === 'string' && s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const kanallarOl = () => lsO(KANAL_KEY) || {};
const kanallarYoz = (patch) => { const d = { ...kanallarOl(), ...patch, savedAt: Date.now() }; lsY(KANAL_KEY, d); return d; };
const BOSHQA_RE = /@|t\.me\/|http|\d{7,}/i;
const S9_XATO = {
  tur: { uz: 'Avval joy turini tanlang.', ru: 'Сначала выберите тип места.' },
  boshqa: { uz: 'Guruh nomi va havolasi yozilmaydi — faqat turini yozing.', ru: 'Название и ссылку группы не пишут — только тип.' },
  takror: { uz: "Bu tur ro'yxatda bor — boshqa joyni tanlang.", ru: 'Этот тип уже в списке — выберите другое место.' }
};
const ruxsatQator = (turId) => (turId === 'sinf'
  ? { uz: "Sinf chatiga ruxsatni darsda Mentor beradi — postni ko'rgach.", ru: 'Разрешение для чата класса на уроке даёт Ментор — после того как посмотрит пост.' }
  : turId === 'instagram'
    ? { uz: "O'z sahifangiz: ruxsat sizda. Sahifa bo'lmasa — yangi akkaunt ochish shart emas.", ru: 'Ваша страница: разрешение у вас. Нет страницы — новый аккаунт открывать не нужно.' }
    : { uz: "Guruh egasidan so'raladi.", ru: 'Спрашивают у владельца группы.' });
const joyOtdi = (j) => j[0] === true && j[1] === true && (j[2] === 'bor' || j[2] === 'soraladi');
const joyNomi = (p) => (p.turId === 'boshqa' ? p.boshqa : tr(KANAL_TURLARI.find(t => t.id === p.turId).nom));
const joyBelgi = (p) => (p.turId === 'boshqa' ? belgiYoz(p.boshqa) : KANAL_TURLARI.find(t => t.id === p.turId).belgi);
const yangiKarta = (id) => ({ id, turId: null, boshqa: '', j: [null, null, null] });
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [intervyu] = useState(() => lsO(INTERVYU_KEY));
  const [royxat, setRoyxat] = useState(() => (storedAnswer && Array.isArray(storedAnswer.royxat) ? storedAnswer.royxat : []));
  const [yetarli, setYetarli] = useState(!!(storedAnswer && storedAnswer.yopildi));
  const yopildi = royxat.length >= 3 || yetarli;
  const [karta, setKarta] = useState(() => (yopildi ? null : yangiKarta('k' + (royxat.length + 1))));
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [yangiI, setYangiI] = useYangi(1400);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null), telRef = useRef(null);
  const otganlar = royxat.filter(p => joyOtdi(p.j));
  const hozirlar = (intervyu && Array.isArray(intervyu.yozuvlar) ? intervyu.yozuvlar : [])
    .filter(y => y && String(y.hozir || '').trim())
    .map(y => ({ hozir: String(y.hozir).trim(), goya: intervyu.goyalar && Number.isInteger(y.goya) && intervyu.goyalar[y.goya] ? String(intervyu.goyalar[y.goya].matn || '').trim() : '' }));
  // Natija: faqat o'tgan joylar (tayanch 8; 06-FILTR 2) — `nom` tur yozuvi, guruhning haqiqiy nomi emas
  const saqlaKalit = (ro) => {
    kanallarYoz({ kanallar: ro.filter(p => joyOtdi(p.j)).slice(0, 3).map(p => ({ id: p.id, nom: p.turId === 'boshqa' ? String(p.boshqa).trim() : kichik(KANAL_TURLARI.find(t => t.id === p.turId).nom.uz), auditoriya: true, azo: true, ruxsat: p.j[2] })) });
  };
  const javobYoz = (ro, yop) => {
    const otdi = ro.some(p => joyOtdi(p.j));
    const data = { stage: 'practice', screenIdx: screen, practice: 'Kanallar', royxat: ro, yopildi: yop, solved: true, picked: true, correct: otdi };
    if (storedAnswer === undefined || (otdi && !(storedAnswer && storedAnswer.correct)) || yop !== !!(storedAnswer && storedAnswer.yopildi) || ro.length !== ((storedAnswer && storedAnswer.royxat) || []).length) onAnswer(screen, data);
    if (otdi && live && live.mode === 'student' && !(storedAnswer && storedAnswer.correct)) live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const turTanla = (id) => {
    if (!karta) return;
    if (id !== 'boshqa' && royxat.some(p => p.turId === id && p.id !== karta.id)) { setXato('takror'); return; }
    setKarta(k => ({ ...k, turId: id, j: k.turId === id ? k.j : [null, null, null] })); setXato(null);
  };
  const boshqaOk = !karta || karta.turId !== 'boshqa' || String(karta.boshqa).trim().length > 0;
  const qadam = !karta || !karta.turId || !boshqaOk ? 0 : karta.j[0] === null ? 1 : karta.j[1] === null ? 2 : karta.j[2] === null ? 3 : 4;
  const javob = (i, v) => setKarta(k => ({ ...k, j: k.j.map((x, n) => (n === i ? v : n > i ? null : x)) }));
  const saqla = () => {
    if (!karta || !karta.turId) { setXato('tur'); return; }
    if (karta.turId === 'boshqa') {
      const b = String(karta.boshqa).trim();
      if (!b) { setXato('tur'); return; }
      if (BOSHQA_RE.test(b)) { setXato('boshqa'); return; }
      if (royxat.some(p => p.id !== karta.id && joyBelgi(p) === belgiYoz(b))) { setXato('takror'); return; }
    }
    if (qadam < 4) return;
    const p = { ...karta, boshqa: String(karta.boshqa).trim() };
    const bor = royxat.findIndex(x => x.id === p.id);
    const ro = bor >= 0 ? royxat.map(x => (x.id === p.id ? p : x)) : [...royxat, p];
    uch(kartaRef.current, telRef.current, joyNomi(p));
    setRoyxat(ro); setYangiI(p.id); setXato(null); setYordam(false);
    saqlaKalit(ro);
    const yop = ro.length >= 3 || yetarli;
    setKarta(yop ? null : yangiKarta('k' + (ro.length + 1)));
    javobYoz(ro, yop);
  };
  const yetarliBos = () => { setYetarli(true); setKarta(null); setXato(null); javobYoz(royxat, true); };
  const tahrir = (p) => { setKarta({ ...p, j: [...p.j] }); setXato(null); setYordam(false); };
  const tahrirda = !!(karta && royxat.some(p => p.id === karta.id));
  const formaOchiq = !!karta;
  const qatorlar = royxat.map(p => {
    const otdi = joyOtdi(p.j);
    return { k: p.id, nom: joyNomi(p), tur: otdi ? (p.j[2] === 'soraladi' ? tr({ uz: 'ruxsat kutilmoqda', ru: 'ждёт разрешения' }) : tr({ uz: 'kanal', ru: 'канал' })) : tr({ uz: "uch savoldan o'tmadi", ru: 'не прошло три вопроса' }),
      belgilar: [p.j[0], p.j[1], p.j[2] === 'bor' ? true : p.j[2] === 'soraladi' ? 'uyda' : false], belgi: otdi ? joyBelgi(p) : null,
      holat: otdi ? (p.j[2] === 'soraladi' ? 'kutish' : 'kanal') : 'yoq', yangi: yangiI === p.id,
      onTahrir: yopildi && !formaOchiq ? () => tahrir(p) : undefined };
  });
  const telefon = isMentor
    ? <ChatTelefon ustYorliq={tr({ uz: 'Mentor telefoni', ru: 'Телефон Ментора' })} holat="royxat" sarlavha={tr({ uz: 'Mentorning uch kanali', ru: 'Три канала Ментора' })}
        qatorlar={MENTOR_KANALLAR.map((n, i) => ({ k: 'm' + i, nom: tr(n), tur: i === 0 ? tr(MENTOR_JOYLAR[0].tur) : i === 1 ? tr({ uz: 'Telegram guruhi', ru: 'Telegram-группа' }) : 'Instagram', belgilar: i === 0 ? [true, true, true] : undefined, holat: 'kanal' }))} />
    : <ChatTelefon ustYorliq={tr({ uz: 'sizning telefoningiz', ru: 'ваш телефон' })} holat="royxat" telRef={telRef}
        sarlavha={<>{tr({ uz: 'Kanallarim', ru: 'Мои каналы' })} · <b key={royxat.length}>{royxat.length} / 3</b></>}
        qatorlar={yopildi ? qatorlar : [...qatorlar, ...[0, 1, 2].slice(royxat.length).map(i => ({ k: 'joy' + i, joy: String(i + 1), holat: i === royxat.length && karta ? 'joriy' : undefined }))]}
        ostida={royxat.some(p => p.j[2] === 'soraladi' && joyOtdi(p.j)) && <QIzoh>{tr({ uz: 'Ruxsat olingach bu joyga post yuboriladi — hozircha u kanal emas.', ru: 'Когда разрешение получено, сюда отправляют пост — пока это не канал.' })}</QIzoh>} />;
  const SAVOL_ROW = (i, val) => (
    <button key={'s' + i} type="button" className="kn-ok-q fade-step" onClick={() => javob(i, null)}>
      <i>{i + 1}</i><span>{tr(UCH_SAVOL[i])}</span><b>{val === true || val === 'bor' ? tr({ uz: 'Ha', ru: 'Да' }) : val === 'soraladi' ? tr({ uz: "Uyda so'rayman", ru: 'Спрошу дома' }) : tr({ uz: "Yo'q", ru: 'Нет' })}</b>
    </button>
  );
  const oTmadi = karta && (karta.j[0] === false || karta.j[1] === false || karta.j[2] === false);
  const kartaEl = karta && (
    <div key={karta.id} ref={kartaRef} className={cxx('kn-karta', 'kn-kirish', 'kn-s9-karta', xato && 'err')}>
      <span className="q-yorliq">{tahrirda ? tr({ uz: 'Tahrirlash', ru: 'Редактирование' }) : `${royxat.length + 1} / 3`}</span>
      <div className="kn-qism">
        <b className="kn-qism-h">{tr({ uz: 'Joy turi', ru: 'Тип места' })}</b>
        <div className={cxx('kn-turlar', !karta.turId && 'kn-chorla')}>
          {KANAL_TURLARI.map(t => <QChip key={t.id} className="kn-tur" holat={karta.turId === t.id ? 'on' : undefined} onClick={() => turTanla(t.id)}>{tr(t.nom)}</QChip>)}
        </div>
        {karta.turId === 'boshqa' && <input className={cxx('kn-inp', !String(karta.boshqa).trim() && 'kn-halqa-i', xato === 'boshqa' && 'err')} value={karta.boshqa} maxLength={30} aria-label={tr({ uz: 'Joy turi', ru: 'Тип места' })} placeholder={tr({ uz: 'Joy turi — guruh nomi emas', ru: 'Тип места — не название группы' })} onChange={(e) => { const v = e.target.value; setKarta(k => ({ ...k, boshqa: v })); setXato(null); }} />}
        <span className="kn-kulrang">{tr({ uz: 'Guruhning nomini emas — turini tanlang.', ru: 'Выбирайте не название группы, а её тип.' })}</span>
      </div>
      {qadam >= 1 && <div className="kn-savollar">
        {[0, 1, 2].map(i => {
          if (i < qadam - 1 || (qadam === 4 && i <= 2)) return karta.j[i] !== null ? SAVOL_ROW(i, karta.j[i]) : null;
          if (i !== qadam - 1) return null;
          return (
            <div key={'q' + i} className="kn-qism kn-kirish">
              <b className="kn-karta-nom">{tr(UCH_SAVOL[i])}</b>
              <div className="kn-javoblar kn-chorla">
                <button type="button" className="kn-javob" onClick={() => javob(i, i === 2 ? 'bor' : true)}>{tr({ uz: 'Ha', ru: 'Да' })}</button>
                {i === 2 && <button type="button" className="kn-javob" onClick={() => javob(i, 'soraladi')}>{tr({ uz: "Uyda so'rayman", ru: 'Спрошу дома' })}</button>}
                <button type="button" className="kn-javob" onClick={() => javob(i, false)}>{tr({ uz: "Yo'q", ru: 'Нет' })}</button>
              </div>
              {i === 0 && <span className="kn-kulrang kn-dalil">{hozirlar.length > 0
                ? <>{tr({ uz: '11-Modul intervyularingiz, «Hozir nima bilan»:', ru: 'Ваши интервью 11-го модуля, «Чем сейчас»:' })} {hozirlar.slice(0, 3).map((h, n) => <React.Fragment key={n}>{n > 0 && ' · '}«{h.hozir}»{h.goya && <em> ({h.goya})</em>}</React.Fragment>)}</>
                : tr({ uz: "Intervyu qog'ozingizdagi «Hozir nima bilan» qatoriga qarang.", ru: 'Посмотрите строку «Чем сейчас» в своём листе интервью.' })}</span>}
              {i === 2 && <span className="kn-kulrang">{tr(ruxsatQator(karta.turId))}</span>}
            </div>
          );
        })}
      </div>}
      {oTmadi && <QIzoh>{tr({ uz: "Bu joy uch savoldan o'tmadi — kanallaringizga kirmaydi.", ru: 'Это место не прошло три вопроса — в ваши каналы не входит.' })}</QIzoh>}
      {xato && <QXato>{tr(S9_XATO[xato])}</QXato>}
      {yordam && <p className="kn-yordam fade-step">{tr({ uz: "Mentor misolida: mahalla futbol guruhi — ha · ha · ha (intervyuda 5 o'yinchidan 5 tasi Telegram guruhida; a'zo; egasidan ruxsat olingan). Shahar futbol kanali — a'zo emas, ruxsat yo'q: tanlanmadi.", ru: 'В примере Ментора: футбольная группа махалли — да · да · да (в интервью 5 игроков из 5 — в Telegram-группе; состоит; разрешение владельца получено). Городской футбольный канал — не состоит, разрешения нет: не выбран.' })}</p>}
      <div className="kn-karta-tug">
        <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
        {!tahrirda && otganlar.length > 0 && <QTugma ikkinchi onClick={yetarliBos}>{tr({ uz: 'Yetarli', ru: 'Достаточно' })}</QTugma>}
        <QTugma className={cxx(qadam === 4 && 'kn-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
      </div>
    </div>
  );
  const xulosa = yopildi && !formaOchiq && (otganlar.length > 0
    ? tr({ uz: "Kanallaringiz tanlandi: «yo'q» bo'lgan joyga post yuborilmaydi.", ru: 'Ваши каналы выбраны: туда, где ответ «нет», пост не отправляют.' })
    : tr({ uz: "Hozircha uch savoldan o'tgan joy yo'q — bugun postni yozib, Mentorga ko'rsatasiz.", ru: 'Пока нет места, прошедшего три вопроса, — сегодня вы напишете пост и покажете Ментору.' }));
  const n = royxat.length;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · kanallar', ru: 'Самостоятельная работа · каналы' })} screen={screen} scrollSignal={n * 10 + qadam} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={n < 1 && !isMentor} label={n >= 1 || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Kamida bitta joyni tekshiring', ru: 'Проверьте хотя бы одно место' })} (${n}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Kanallaringizni <A>uch savol bilan tanlang.</A></>, ru: <>Выберите свои каналы <A>по трём вопросам.</A></> })}
        mentor={<Mentor>{intervyu
          ? tr({ uz: "Joy turini tanlang va uch savolga javob bering — birinchisiga dalil 11-Modul intervyularingizda.", ru: 'Выберите тип места и ответьте на три вопроса — доказательство для первого в ваших интервью 11-го модуля.' })
          : tr({ uz: "Joy turini tanlang va uch savolga javob bering — birinchisiga dalil intervyu qog'ozingizda.", ru: 'Выберите тип места и ответьте на три вопроса — доказательство для первого в вашем листе интервью.' })}</Mentor>}
        forma={isMentor
          ? <div className="kn-fokus">{telefon}</div>
          : (yopildi && !formaOchiq)
            ? <div className="kn-fokus">{telefon}{xulosa && <QXulosa>{xulosa}</QXulosa>}</div>
            : <div className="kn-split">{telefon}{kartaEl}</div>}
      >
        <MentorPracticeStats live={live} screen={screen} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 10 — BIRINCHI POST (QMustaqil, juftlik + yakka rejim; 4 qism ketma-ket, bittadan karta — E 53) · yozadi pm-m10d6-kanallar.post/tekshiruv/mentorga/yuborildi · nishon postReady =====
const POST_MAYDON = [
  { id: 'kim', h: { uz: 'Kim uchun', ru: 'Для кого' }, savol: { uz: 'Post kimga qaratilgan?', ru: 'Кому адресован пост?' }, ph: { uz: 'Birinchi qator', ru: 'Первая строка' }, max: 100,
    yordam: { uz: "Mentor misolida: «Mahalla futbolchilari, Shanba o'yiniga kim kelishini bitta joyda ko'rish uchun «Maydon Jamoa» ilovasini qurdim» — kimga qaratilgani birinchi so'zlarda.", ru: 'В примере Ментора: «Футболисты махалли, чтобы видеть в одном месте, кто придёт на субботнюю игру, я построил приложение «Maydon Jamoa»» — кому адресован, видно по первым словам.' } },
  { id: 'foyda', h: { uz: 'Nima foyda', ru: 'Какая польза' }, savol: { uz: 'Odam nima oladi?', ru: 'Что получит человек?' }, ph: { uz: 'Bir gap', ru: 'Одно предложение' }, max: 120,
    yordam: { uz: "Mentor misolida: «o'yin e'lon qilinadi, «Qo'shilaman» bosiladi, nechta odam yig'ilgani ko'rinib turadi» — lending foydalaridan.", ru: 'В примере Ментора: «объявляется игра, нажимают «Присоединяюсь», видно, сколько людей собралось» — из польз лендинга.' } },
  { id: 'harakat', h: { uz: 'Bitta harakat', ru: 'Одно действие' }, savol: { uz: 'Odam nima qiladi?', ru: 'Что сделает человек?' }, ph: { uz: 'Bir qisqa gap', ru: 'Одна короткая фраза' }, max: 60,
    yordam: { uz: "Mentor misolida: «sahifasini ko'ring» — bitta ish, bitta havola.", ru: 'В примере Ментора: «посмотрите страницу» — одно дело, одна ссылка.' } },
  { id: 'holat', h: { uz: 'Halol holat', ru: 'Честное состояние' }, savol: { uz: 'Hozir nima tayyor?', ru: 'Что готово сейчас?' }, ph: { uz: 'Bir gap', ru: 'Одно предложение' }, max: 80,
    yordam: { uz: "Mentor misolida: «Ilova ishlayapti, o'rnatish havolasi hozircha yo'q». Web-trekda sayt allaqachon ishlasa — shuni yozing.", ru: 'В примере Ментора: «Приложение работает, ссылки для установки пока нет». В веб-треке, если сайт уже работает, — так и напишите.' } }
];
// Tekshiruv (PM-032: bo'sh, telefon/akkaunt, maktab raqami — bloklaydi; va'da va bo'sh sifat — yumshoq, ikkinchi «Saqlash» bilan o'tadi). Namuna sinovi: scratchpad 06-qurish/sinov.mjs
const S10_SHAXSIY_RE = /\d{7,}|\+\s*998|@|t\.me\//i;
const S10_MAKTAB_RE = /\d+\s*-?\s*maktab|maktab\s*№/i;
const S10_VADA_RE = /(^|[^a-z'])(tez orada|yaqinda|albatta)(?![a-z'])/;
const S10_SIFAT_RE = /(^|[^a-z'])(eng yaxshi|zo[']r|ajoyib|qulay)(?![a-z'])/;
const S10_XABAR = {
  bosh: { uz: "Bu qator bo'sh — postda joyi ko'rinmay qoladi.", ru: 'Эта строка пуста — в посте её место останется пустым.' },
  shaxsiy: { uz: 'Postga telefon va akkaunt nomi yozilmaydi.', ru: 'В пост не пишут телефон и имя аккаунта.' },
  maktab: { uz: 'Maktab raqami postga yozilmaydi.', ru: 'Номер школы в пост не пишут.' },
  vada: { uz: "Hali yo'q narsa bo'lsa — postga yozilmaydi.", ru: 'Если этого ещё нет — в пост не пишется.' },
  sifat: { uz: "Bu umumiy so'z — odam aynan nima oladi?", ru: 'Это общее слово — что именно получит человек?' }
};
function s10Tekshir(k, v) {
  const s = String(v || '');
  if (!s.trim()) return { x: 'bosh', blok: true };
  if (S10_SHAXSIY_RE.test(s)) return { x: 'shaxsiy', blok: true };
  const n = normS(s);
  if (S10_MAKTAB_RE.test(n)) return { x: 'maktab', blok: true };
  if ((k === 'foyda' || k === 'holat') && S10_VADA_RE.test(n)) return { x: 'vada' };
  if ((k === 'kim' || k === 'foyda') && S10_SIFAT_RE.test(n)) return { x: 'sifat' };
  return null;
}
const havolaYasa = (manzil) => { const m = String(manzil || '').trim(); if (!m) return ''; return m + (m.includes('?') ? '&' : '?') + 'kanal=sinf'; };
const postMatni = (post, havola) => [post.kim, post.foyda, [post.harakat, havola].filter(Boolean).join(' '), post.holat].filter(Boolean).join('\n');
const MAJBURIY_BAND = [0, 2, 4, 5];
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isStudent, isMentor } = useJonli();
  const juft = isStudent;
  const [lend] = useState(() => lsO(LEND_KEY) || {});
  const havola = havolaYasa(lend.manzil);
  const foydalar = (Array.isArray(lend.foydalar) ? lend.foydalar : []).map(f => String(f || '').trim()).filter(Boolean);
  const [d0] = useState(() => { const k = kanallarOl(); const s = storedAnswer || {}; return { post: s.post || k.post || {}, kataklar: s.kataklar || k.tekshiruv || [false, false, false, false, false, false], mentorga: s.mentorga ?? k.mentorga ?? false, yuborildi: s.yuborildi !== undefined ? s.yuborildi : (k.yuborildi ?? null), qism: s.qism || 1 }; });
  const [post, setPost] = useState(() => ({ kim: '', foyda: '', harakat: '', holat: '', ...d0.post, harakat: String((d0.post && d0.post.harakat) || '').replace(havola, '').trim() }));
  const [qism, setQism] = useState(d0.qism);
  const [tahrirK, setTahrirK] = useState(null);
  const toliq = POST_MAYDON.every(m => String(post[m.id] || '').trim());
  const fiBosh = POST_MAYDON.findIndex(m => !String(post[m.id] || '').trim());
  const joriyK = tahrirK || (qism === 1 && fiBosh >= 0 ? POST_MAYDON[fiBosh].id : null);
  const [qiyH, setQiyH] = useState({ k: null, v: '' });
  const qiy = qiyH.k === joriyK ? qiyH.v : String(post[joriyK] || '');
  const setQiy = (v) => setQiyH({ k: joriyK, v });
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [sherik, setSherik] = useState({});
  const [kataklar, setKataklar] = useState(d0.kataklar);
  const [mentorga, setMentorga] = useState(!!d0.mentorga);
  const [yuborildi, setYuborildi] = useState(d0.yuborildi);
  const [nusxa, setNusxa] = useState(false);
  const [yangiK, setYangiK] = useYangi();
  const [yashil, setYashil] = useYangi(1200);
  const [uch, qatlam] = useUchish();
  const inpRef = useRef(null), bRef = useRef({});
  const done = qism >= 5;
  const majburiy = MAJBURIY_BAND.every(i => kataklar[i]);
  const tayyorRef = useRef(!!(storedAnswer && storedAnswer.correct));
  useEffect(() => { setXato(null); setYumshoq(null); setYordam(false); }, [joriyK]);
  // Natija har o'zgarishda kalitga yoziladi (tayanch 8): post · tekshiruv · mentorga · yuborildi
  useEffect(() => {
    if (isMentor) return;
    kanallarYoz({ post: { kim: String(post.kim || '').trim(), foyda: String(post.foyda || '').trim(), harakat: [String(post.harakat || '').trim(), havola].filter(Boolean).join(' '), holat: String(post.holat || '').trim() }, tekshiruv: kataklar.map(Boolean), mentorga, yuborildi });
  }, [post, kataklar, mentorga, yuborildi]); // eslint-disable-line
  const javobYoz = (patch = {}) => {
    const data = { stage: 'practice', screenIdx: screen, practice: 'Birinchi post', post, kataklar, mentorga, yuborildi, qism, solved: true, picked: true, correct: tayyorRef.current, ...patch };
    onAnswer(screen, data);
  };
  // Nishon «Post Ready!» — to'rt qator va 1, 3, 5, 6-band (juftlikda ham, yakka rejimda ham)
  useEffect(() => {
    if (!toliq || !majburiy || tayyorRef.current) return;
    tayyorRef.current = true;
    javobYoz({ correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  }, [toliq, majburiy]); // eslint-disable-line
  const saqla = () => {
    if (!joriyK) return;
    const t = s10Tekshir(joriyK, qiy);
    const imzo = joriyK + '|' + qiy;
    if (t && (t.blok || !(yumshoq && yumshoq.imzo === imzo && yumshoq.x === t.x))) { setXato(t); if (!t.blok) setYumshoq({ x: t.x, imzo }); return; }
    const yangi = { ...post, [joriyK]: String(qiy).trim() };
    uch(inpRef.current, bRef.current.puf, String(qiy).slice(0, 36));
    setPost(yangi); setYangiK(joriyK); setXato(null); setYumshoq(null); setQiyH({ k: null, v: '' });
    if (tahrirK) setTahrirK(null);
    else if (POST_MAYDON.every(m => String(yangi[m.id] || '').trim())) setQism(q => Math.max(q, 2));
  };
  const sherikBos = (id, v) => {
    const s = { ...sherik, [id]: v }; setSherik(s);
    if (POST_MAYDON.every(m => s[m.id])) setTimeout(() => setQism(q => Math.max(q, 3)), 650);
  };
  const katakBos = (i) => { if (i === 1) return; setKataklar(k => k.map((x, n) => (n === i ? !x : x))); };
  const mentorgaBos = () => { setMentorga(true); setKataklar(k => k.map((x, n) => (n === 1 ? true : x))); setYangiK('band2'); };
  const nusxala = async () => { try { await navigator.clipboard.writeText(postMatni(post, havola)); setNusxa(true); setTimeout(() => setNusxa(false), 1600); } catch { /* clipboard yopiq */ } };
  const yakunla = (tanlov) => {
    const yb = tanlov === 'yubordim' ? { qayerda: 'sinf chati' } : null;
    setYuborildi(yb); setQism(5); if (yb) setYashil(1);
    javobYoz({ yuborildi: yb, qism: 5, tanlov });
  };
  // Telefon: qoralama · yuborildi; qatorlar yozilgan sari pufakka tushadi (4-ekrandagidek rangli chiziq va yorliq)
  const bolaklar = POST_MAYDON.filter(m => String(post[m.id] || '').trim()).map(m => ({
    k: m.id, qator: m.id, matn: m.id === 'harakat' && havola ? `${post.harakat} ${havola}` : post[m.id],
    holat: yangiK === m.id ? 'ok yangi' : 'ok', yorliq: done ? tr(m.h).toLowerCase() : null, belgi: done ? '' : qism === 2 || (qism > 2 && sherik[m.id]) ? (sherik[m.id] === 'bor' ? '✓' : sherik[m.id] === 'yoq' ? '✎' : '') : ''
  }));
  const telHolat = yuborildi ? 'yuborildi' : 'qoralama';
  const telefon = isMentor
    ? <ChatTelefon ustYorliq={tr({ uz: 'Mentor telefoni', ru: 'Телефон Ментора' })} holat="chat" chatNom={tr({ uz: 'Mahalla futbol guruhi · 60 kishi', ru: 'Футбольная группа махалли · 60 человек' })}
        bolaklar={MENTOR_POST.bolaklar.map(b => ({ k: b.qator, qator: b.qator, matn: tr(b.matn), holat: 'ok', yorliq: qNom(b.qator) }))} />
    : <div ref={el => { bRef.current.puf = el; }}><ChatTelefon ustYorliq={tr({ uz: 'sizning telefoningiz', ru: 'ваш телефон' })} holat={bolaklar.length ? telHolat : 'qoralama'} yashil={!!yashil}
        chatNom={tr({ uz: 'Sinf chati', ru: 'Чат класса' })} bolaklar={bolaklar.length ? bolaklar : [{ k: 'bosh', matn: '…', holat: 'joy' }]} /></div>;
  const ok = POST_MAYDON.filter(m => m.id !== joriyK && String(post[m.id] || '').trim());
  const M = joriyK && POST_MAYDON.find(m => m.id === joriyK);
  const yozishKarta = M && (
    <div key={joriyK} className={cxx('kn-karta', 'kn-s10-karta', xato && 'err')}>
      {qism === 1 && ok.length > 0 && <div className="kn-oklar">{ok.map(m => (
        <button key={m.id} type="button" className="kn-ok-q fade-step" onClick={() => setTahrirK(m.id)} aria-label={`${tr(m.h)} · ${tr({ uz: 'tahrirlash', ru: 'редактировать' })}`}><i>✓</i><span>{tr(m.h)}</span><b>{post[m.id]}</b></button>
      ))}</div>}
      <div className="kn-kirish kn-qism" key={'f' + joriyK}>
        <span className="q-yorliq">{tr(M.h)} · {POST_MAYDON.findIndex(m => m.id === joriyK) + 1} / 4</span>
        <b className="kn-karta-nom">{tr(M.savol)}</b>
        {joriyK === 'foyda' && foydalar.length > 0 && <span className="kn-kulrang">{tr({ uz: 'Lendingdagi foydalaringiz:', ru: 'Пользы на вашем лендинге:' })} {foydalar.slice(0, 3).map((f, i) => <React.Fragment key={i}>{i > 0 && ' · '}«{f}»</React.Fragment>)}</span>}
        <label className="kn-maydon">
          <input ref={inpRef} className={cxx('kn-inp', 'katta', xato && 'err', !String(qiy).trim() && 'kn-halqa-i')} value={qiy} maxLength={M.max} placeholder={tr(M.ph)} aria-label={tr(M.h)}
            onChange={(e) => setQiy(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saqla(); }} />
          <span className={cxx('kn-hisob', String(qiy).length >= M.max && 'chek')}>{String(qiy).length} / {M.max}</span>
        </label>
        {joriyK === 'harakat' && (havola
          ? <code className="kn-havola">{havola}</code>
          : <span className="kn-kulrang">{tr({ uz: "Lending manzili hali yo'q — Netlify'ga chiqargach havola shu yerga qo'shiladi.", ru: 'Адреса лендинга ещё нет — ссылка добавится сюда после публикации на Netlify.' })}</span>)}
        {joriyK === 'holat' && <span className="kn-kulrang">{tr({ uz: "Hali yo'q narsa va'da qilinmaydi.", ru: 'То, чего ещё нет, не обещают.' })}</span>}
      </div>
      {xato && <QXato>{tr(S10_XABAR[xato.x])}</QXato>}
      {xato && !xato.blok && <span className="kn-kulrang">{tr({ uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставить так — снова нажмите «Сохранить».' })}</span>}
      {yordam && <p className="kn-yordam fade-step">{tr(M.yordam)}</p>}
      <div className="kn-karta-tug">
        <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
        <QTugma className={cxx(String(qiy).trim() && 'kn-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
      </div>
    </div>
  );
  const sherikKarta = qism === 2 && !joriyK && (
    <div className="kn-karta kn-kirish">
      <span className="q-yorliq">{juft ? tr({ uz: '2 · Sherik', ru: '2 · Партнёр' }) : tr({ uz: "2 · O'qish", ru: '2 · Чтение' })}</span>
      <p className="kn-matn">{juft
        ? tr({ uz: "Sherigingiz postni chapdagi telefondan o'qib, har qator yonida «Bor» yoki «Topilmadi»ni bosadi.", ru: 'Партнёр читает пост на телефоне слева и у каждой строки нажимает «Есть» или «Не нашёл».' })
        : tr({ uz: "Postni ovoz chiqarib o'qing va har qator yonida «Bor» yoki «Topilmadi»ni bosing.", ru: 'Прочитайте пост вслух и у каждой строки нажмите «Есть» или «Не нашёл».' })}</p>
      <ul className="kn-sherik">
        {POST_MAYDON.map((m, i) => {
          const v = sherik[m.id];
          const faol = !v && POST_MAYDON.findIndex(x => !sherik[x.id]) === i;
          return (
            <li key={m.id} className={cxx('q-' + m.id, v && 'bor')}>
              <span className="kn-sherik-n">{tr(m.h).toLowerCase()}</span>
              {v
                ? <span className="kn-sherik-v">{v === 'bor' ? <b className="okc">✓ {tr({ uz: 'Bor', ru: 'Есть' })}</b> : <><b>{tr({ uz: 'Topilmadi', ru: 'Не нашёл' })}</b><button type="button" className="kn-tahrir" onClick={() => setTahrirK(m.id)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button></>}</span>
                : <span className={cxx('kn-javoblar', 'ixcham', faol && 'kn-chorla')}>
                    <button type="button" className="kn-javob kn-bor" onClick={() => sherikBos(m.id, 'bor')}>{tr({ uz: 'Bor', ru: 'Есть' })}</button>
                    <button type="button" className="kn-javob kn-bor" onClick={() => sherikBos(m.id, 'yoq')}>{tr({ uz: 'Topilmadi', ru: 'Не нашёл' })}</button>
                  </span>}
            </li>
          );
        })}
      </ul>
      {juft && <span className="kn-kulrang">{tr({ uz: 'Sherigingiz ismini hech qayerga yozmang.', ru: 'Нигде не пишите имя партнёра.' })}</span>}
    </div>
  );
  const royxatKarta = qism === 3 && !joriyK && (
    <div className="kn-karta kn-kirish">
      <span className="q-yorliq">{tr({ uz: "3 · Ro'yxat", ru: '3 · Список' })}</span>
      <BandRoyxat ixcham kataklar={kataklar} onKatak={katakBos} yopiq={[1]} ost
        yorliqlar={{ 1: tr({ uz: "sinf chatida — Mentorga ko'rsatganda", ru: 'в чате класса — когда покажете Ментору' }), 3: tr({ uz: 'sinf chatiga shart emas — boshqa kanallardan oldin', ru: 'для чата класса не обязательно — перед другими каналами' }) }} />
      {majburiy && <div className="kn-karta-tug"><QTugma className="kn-halqa" onClick={() => setQism(4)}>{tr({ uz: '4 · Yuborish', ru: '4 · Отправка' })}</QTugma></div>}
    </div>
  );
  const yuborishKarta = qism === 4 && !joriyK && (
    <div className="kn-karta kn-kirish">
      <span className="q-yorliq">{tr({ uz: '4 · Yuborish', ru: '4 · Отправка' })}</span>
      <div className={cxx('kn-band2', kataklar[1] && 'ok', yangiK === 'band2' && 'yangi')}><i>{kataklar[1] ? '✓' : ''}</i><span>2) {tr(XAVFSIZLIK.bandlar[1])}</span></div>
      {juft ? (!mentorga
        ? <>
            <b className="kn-karta-nom">{tr({ uz: "Mentorga ko'rsating", ru: 'Покажите Ментору' })}</b>
            <span className="kn-kulrang">{tr({ uz: 'Mentor postni o\'qiydi va sinf chatiga yuborish-yubormaslikni aytadi', ru: 'Ментор прочитает пост и скажет, отправлять ли его в чат класса' })}</span>
            <div className="kn-karta-tug"><QTugma className="kn-halqa" onClick={mentorgaBos}>{tr({ uz: "Mentorga ko'rsatdim", ru: 'Показал Ментору' })}</QTugma></div>
          </>
        : <div className="kn-karta-tug chap">
            {havola && <QTugma ikkinchi onClick={nusxala}>{nusxa ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: 'Nusxalash', ru: 'Копировать' })}</QTugma>}
            {havola && <QTugma className="kn-halqa" onClick={() => yakunla('yubordim')}>{tr({ uz: 'Yubordim', ru: 'Отправил' })}</QTugma>}
            <QTugma ikkinchi onClick={() => yakunla('uyda')}>{havola ? tr({ uz: 'Kanallarimga uyda yuboraman', ru: 'Отправлю в свои каналы дома' }) : tr({ uz: 'Uyda yuboraman', ru: 'Отправлю дома' })}</QTugma>
          </div>)
        : <>
            <span className="kn-kulrang">{tr({ uz: "Mentorga hali ko'rsatilmagan — post saqlanadi.", ru: 'Ментору ещё не показан — пост сохранится.' })}</span>
            <div className="kn-karta-tug"><QTugma className="kn-halqa" onClick={() => yakunla('uyda')}>{tr({ uz: 'Uyda yuboraman', ru: 'Отправлю дома' })}</QTugma></div>
          </>}
    </div>
  );
  const xulosa = done && (yuborildi
    ? tr({ uz: "Post sinf chatida: to'rt qatori yozilgan, Mentorga ko'rsatilgan.", ru: 'Пост в чате класса: четыре строки написаны, Ментору показан.' })
    : mentorga
      ? tr({ uz: 'Post tayyor — kanallaringizga uyda, ruxsat bilan yuborasiz.', ru: 'Пост готов — отправите в свои каналы дома, с разрешением.' })
      : tr({ uz: "Post tayyor — avval Mentorga ko'rsatasiz.", ru: 'Пост готов — сначала покажете Ментору.' }));
  const chip = juft ? [{ uz: 'Yozish', ru: 'Запись' }, { uz: 'Sherik', ru: 'Партнёр' }, { uz: "Ro'yxat", ru: 'Список' }, { uz: 'Yuborish', ru: 'Отправка' }]
    : [{ uz: 'Yozish', ru: 'Запись' }, { uz: "O'qish", ru: 'Чтение' }, { uz: "Ro'yxat", ru: 'Список' }, { uz: 'Yuborish', ru: 'Отправка' }];
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish', ru: 'Работа в паре' }) : tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={qism * 10 + (fiBosh + 1)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "To'rt qismni bajaring", ru: 'Выполните четыре части' })} (${Math.min(qism - 1, 4)}/4)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Birinchi postni <A>yozing va tekshiring.</A></>, ru: <>Напишите первый пост <A>и проверьте его.</A></> })}
        mentor={<Mentor>{juft
          ? tr({ uz: "Post avval Mentorga ko'rsatiladi: to'rt qatorni yozing, keyin sherigingizga o'qiting.", ru: 'Пост сначала показывают Ментору: напишите четыре строки, потом дайте прочитать партнёру.' })
          : tr({ uz: "Post avval Mentorga ko'rsatiladi: to'rt qatorni yozing, keyin ovoz chiqarib o'qing.", ru: 'Пост сначала показывают Ментору: напишите четыре строки, потом прочитайте вслух.' })}</Mentor>}
        qadamlar={!isMentor && !done && <QQadamlar qadamlar={chip.map((c, i) => `${i + 1} ${tr(c)}`)} joriy={Math.min(qism, 4) - 1} />}
        forma={isMentor
          ? <div className="kn-fokus">{telefon}</div>
          : done
            ? <div className="kn-fokus"><ChatOyna nom={tr({ uz: 'Sinf chati', ru: 'Чат класса' })} keng yashil={!!yashil}><PostPufak bolaklar={bolaklar} holat={telHolat} /></ChatOyna><QXulosa>{xulosa}</QXulosa></div>
            : <div className="kn-split">{telefon}{yozishKarta || sherikKarta || royxatKarta || yuborishKarta}</div>}
      >
        <MentorPracticeStats live={live} screen={screen} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 11 — KOD YOZISH (QKod + HtmlCompiler; tayanch 4, PM-082): havoladan kanal belgisini o'qiydigan funksiya =====
// Starter oddiy satrlardan yig'iladi (backtick yo'q). Qatorlar ≤ 70 belgi (SABOQ 37): MD dagi ikki uzun qator izohi alohida satrga olindi.
// Tekshiruv ma'lumotdan mustaqil (SABOQ 37): kanalniOl o'z namuna havolasi bilan chaqiriladi; sahifa sharti — #kanallar li soni va «kanal: <qiymat> · ».
const KOD_IZ = {
  bosh1: { uz: '// Namuna havolalar: lending manzili va oxiridagi kanal belgisi.', ru: '// Примеры ссылок: адрес лендинга и метка канала в конце.' },
  bosh2: { uz: '// Manzil — namuna (haqiqiy sayt emas); sizda — o\'z lendingingiz manzili.', ru: '// Адрес — пример (не настоящий сайт); у вас — адрес вашего лендинга.' },
  masalan: { uz: '  // masalan: "?kanal=sinf" yoki ""', ru: '  // например: "?kanal=sinf" или ""' },
  fn: { uz: '  // belgilar ichidan kanal qiymatini oling;', ru: '  // возьмите из меток значение канала;' },
  fn2: { uz: '  // belgi bo\'lmasa — "belgisiz"', ru: '  // если метки нет — "belgisiz"' },
  siz: { uz: '   // shu joyni siz yozasiz', ru: '   // это место пишете вы' },
  tayyor: { uz: '// har havola — sahifada bitta qator (bu qism tayyor)', ru: '// каждая ссылка — одна строка на странице (эта часть готова)' }
};
const KOD_HAVOLALAR = ['const havolalar = [', '  "https://maydon-jamoa.example/?kanal=guruh",', '  "https://maydon-jamoa.example/?kanal=sinf",', '  "https://maydon-jamoa.example/?kanal=instagram",', '  "https://maydon-jamoa.example/"', '];', ''];
const kodStarter = (t) => [KOD_IZ.bosh1[t], KOD_IZ.bosh2[t], ...KOD_HAVOLALAR,
  'function kanalniOl(havola) {', KOD_IZ.masalan[t], '  const belgilar = new URL(havola).search;', KOD_IZ.fn[t], KOD_IZ.fn2[t], '  return "";' + KOD_IZ.siz[t], '}', '',
  KOD_IZ.tayyor[t], 'const joy = document.getElementById("kanallar");', 'havolalar.forEach(function (havola) {', '  const qator = document.createElement("li");',
  '  qator.textContent = "kanal: " + kanalniOl(havola) + " · " + havola;', '  joy.appendChild(qator);', '});', ''].join('\n');
const KOD_STARTER = { uz: kodStarter('uz'), ru: kodStarter('ru') };
const KOD_INDEX = { uz: '<h1>Havola qaysi kanaldan?</h1>\n<ul id="kanallar"></ul>\n', ru: '<h1>Havola qaysi kanaldan?</h1>\n<ul id="kanallar"></ul>\n' };
const KOD_SHART_IFODA = [
  ['kanalniOl("https://maydon-jamoa.example/?kanal=guruh")', 'guruh'],
  ['kanalniOl("https://maydon-jamoa.example/")', 'belgisiz'],
  ['(function(){var l=document.querySelectorAll("#kanallar li");if(l.length!==4)return "yoq";for(var i=0;i<l.length;i++){if(!/^kanal: [^ ]+ · /.test(l[i].textContent))return "yoq";}return "ha";})()', 'ha']
];
const KOD_VAZIFA = [
  { uz: '`kanalniOl` havoladan `kanal` qiymatini qaytaradi', ru: '`kanalniOl` возвращает из ссылки значение `kanal`' },
  { uz: 'Belgi bo\'lmasa — `"belgisiz"`', ru: 'Если метки нет — `"belgisiz"`' },
  { uz: "Namuna sahifada to'rt havola, har birining kanali bilan", ru: 'На странице-примере четыре ссылки, у каждой — свой канал' }
];
// Kod oynasi shart yorliqlarida kod-chip yo'q — belgisiz matn
const kodYorliq = (v) => ({ uz: v.uz.split(String.fromCharCode(96)).join(''), ru: v.ru.split(String.fromCharCode(96)).join('') });
const KOD_SHART = [
  { uz: "1 — «guruh» belgili havoladan «guruh» chiqsin.", ru: '1 — из ссылки с меткой «guruh» пусть выйдет «guruh».' },
  { uz: '2 — Belgisiz havoladan «belgisiz» chiqsin.', ru: '2 — из ссылки без метки пусть выйдет «belgisiz».' },
  { uz: "3 — Namuna sahifada to'rt qator, har birida kanal bo'lsin.", ru: '3 — на странице-примере четыре строки, в каждой — канал.' }
];
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: 'app.js — kanalniOl funksiyasini yakunlang', ru: 'app.js — допишите функцию kanalniOl' },
  files: [
    { name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: { uz: '// belgilardan kanalni oling; bo\'lmasa — "belgisiz"', ru: '// возьмите канал из меток; если нет — "belgisiz"' } },
    { name: 'index.html', lang: 'html', starter: KOD_INDEX }
  ],
  previewCss: '#kanallar{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}#kanallar li{background:#fff;border:1px solid #E7E3F4;border-radius:8px;padding:8px 12px;font-size:14px;overflow-wrap:anywhere}#kanallar li::first-line{font-weight:400}',
  requirements: [
    { id: 'guruh', label: kodYorliq(KOD_VAZIFA[0]), check: C.evalEquals(KOD_SHART_IFODA[0][0], KOD_SHART_IFODA[0][1], KOD_SHART[0]) },
    { id: 'belgisiz', label: kodYorliq(KOD_VAZIFA[1]), check: C.evalEquals(KOD_SHART_IFODA[1][0], KOD_SHART_IFODA[1][1], KOD_SHART[1]) },
    { id: 'sahifa', label: KOD_VAZIFA[2], check: C.evalEquals(KOD_SHART_IFODA[2][0], KOD_SHART_IFODA[2][1], KOD_SHART[2]) }
  ]
};
const KOD_DARVOZA = [
  { id: 'kanal', t: { uz: 'Tashrif qaysi kanaldan kelganini', ru: 'Из какого канала пришло посещение' }, ok: true },
  { id: 'odam', t: { uz: 'Havolani bosgan odam kimligini', ru: 'Кто нажал на ссылку' }, x: { uz: 'Belgi odamni emas — kanalni bildiradi: ism yozilmaydi.', ru: 'Метка обозначает не человека, а канал: имя не пишут.' } },
  { id: 'til', t: { uz: 'Sahifa qaysi tilda ochilishini', ru: 'На каком языке откроется страница' }, x: { uz: 'Til boshqa narsa: belgi kanal nomini olib keladi.', ru: 'Язык — другое: метка приносит название канала.' } }
];
// Kod namunasi (o'qish uchun; nusxalanmaydi — PM-082 d): darvozadan keyin ?kanal=guruh va kanalniOl bir lahza ajraladi
const KodNamuna = ({ ajrat }) => {
  const L = tr(KOD_STARTER).split('\n');
  const fn = L.findIndex(l => l.startsWith('function kanalniOl'));
  const qism = [...L.slice(2, 4), '  …', '];', '', ...L.slice(fn, fn + 7)];
  return (
    <pre className={cxx('kn-kod', ajrat && 'ajrat')} onCopy={(e) => e.preventDefault()} aria-label="app.js">
      {qism.map((l, i) => {
        if (l.trim().startsWith('//')) return <span key={i} className="kn-kod-iz">{l}{'\n'}</span>;
        const m = l.match(/^(.*?)(\?kanal=guruh|kanalniOl)(.*)$/);
        if (!m) return <span key={i}>{l}{'\n'}</span>;
        return <span key={i}>{m[1]}<b className="kn-kod-b">{m[2]}</b>{m[3]}{'\n'}</span>;
      })}
    </pre>
  );
};
const MentorSanoq = () => (
  <div className="kn-msanoq fade-step">
    <Brauzer manzil={MANZIL_NAMUNA + '/?kanal=guruh'} className="ixcham" />
    <UmamiSanoq yorliq={tr({ uz: 'Mentor misolida · Umami, lending', ru: 'В примере Ментора · Umami, лендинг' })} tashrif={UMAMI_MENTOR.keyin.tashrif} bosish={UMAMI_MENTOR.keyin.bosish} dan={UMAMI_MENTOR.oldin}
      davr={tr({ uz: 'Postdan keyingi kun —', ru: 'День после поста —' })}
      tepa={<span className="kn-kulrang">{tr({ uz: "Postdan oldingi kun — tashriflar: 6 · «Qo'shilmoqchiman»: 2", ru: 'День до поста — посещения: 6 · «Хочу присоединиться»: 2' })}</span>}>
      <span className="kn-umami-k">{tr({ uz: "kanal bo'yicha —", ru: 'по каналам —' })} {UMAMI_MENTOR.kanal.map((k, i) => <span key={i} className="kn-kq" style={{ '--i': i }}>{i > 0 && '· '}{k.k ? <><code>{k.k}</code> {k.n} <em>?kanal={k.k}</em></> : <>{tr({ uz: 'belgisiz', ru: 'без метки' })} {k.n}</>}</span>)}</span>
      <span className="kn-kulrang">{tr({ uz: 'Bir kishi ikki marta ochsa — ikki tashrif. Bir kunlik son — kam: farq bor, lekin isbot emas.', ru: 'Если один человек откроет дважды — два посещения. Число за один день — мало: разница есть, но это не доказательство.' })}</span>
      <span className="kn-kulrang">{fmtCode(tr({ uz: "Umami sahifa ochilishini o'zi ham sanaydi; kanal bo'yicha son — `tashrif` hodisasidan: unda kanal belgisi bor.", ru: 'Umami и сам считает открытия страницы; число по каналам — из события `tashrif`: в нём есть метка канала.' }))}</span>
    </UmamiSanoq>
  </div>
);
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — u o'quvchi matni emas, qolip API nomi (9-Modul 1-dars yechimi)
const QKOD_ONG = ['muh', 'arrir'].join('');
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'kanal' : null));
  const [miss, setMiss] = useState(null);
  const [ajrat, setAjrat] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(() => (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const stage2 = !!gpick || isMentor || done;
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 2400); return () => clearTimeout(t); }, [ajrat]);
  const pickGate = (g) => {
    if (stage2) return;
    if (g.ok) { setGpick(g.id); setMiss(null); setAjrat(true); } else setMiss({ id: g.id, k: Date.now() });
  };
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
    <Stage eyebrow={tr({ uz: 'Kod yozish', ru: 'Пишем код' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: '① Kod-savolini yeching', ru: '① Решите вопрос о коде' }) : tr({ uz: '② Kodni yozing', ru: '② Напишите код' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Havoladan kanalni topadigan <A>kod yozamiz.</A></>, ru: <>Пишем <A>код,</A> который находит канал по ссылке.</> })}
        mentor={<Mentor>{tr({ uz: 'Har kanalga havola oxiriga belgi qo\'shiladi — kod shu belgini o\'qiydi.', ru: 'К ссылке для каждого канала в конце добавляют метку — код читает эту метку.' })}</Mentor>}
        vazifa={<>
          {!gpick && !isMentor && !done ? (
            <div className="kn-darvoza-q">
              <span className="kn-darvoza-s">{fmtCode(tr({ uz: 'Havola oxiridagi `?kanal=sinf` nimani bildiradi?', ru: 'Что означает `?kanal=sinf` в конце ссылки?' }))}</span>
              <div className="kn-darvoza-ro kn-chorla">
                {KOD_DARVOZA.map(g => {
                  const silk = miss && miss.id === g.id;
                  return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} className="kn-darvoza" silk={silk} holat={silk ? 'err' : undefined} onClick={() => pickGate(g)}>{tr(g.t)}</QChip>;
                })}
              </div>
              {miss && <QXato>{tr(KOD_DARVOZA.find(g => g.id === miss.id).x)}</QXato>}
            </div>
          ) : <>
            <QIzoh>{tr({ uz: 'Havola oxiridagi belgi — kanal belgisi. Tashrif — sahifaning bir marta ochilishi.', ru: 'Метка в конце ссылки — метка канала. Посещение — одно открытие страницы.' })}</QIzoh>
            <MentorSanoq />
          </>}
          <ol className={cxx('kn-vazifa', !stage2 && 'xira')}>{KOD_VAZIFA.map((v, i) => <li key={i} className={cxx(done && 'ok')}><i>{done ? '✓' : i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>
          {done && <QXulosa>{tr({ uz: "Kod to'rt havolaning kanalini topdi; belgisi yo'q havola — «belgisiz».", ru: 'Код нашёл канал у четырёх ссылок; ссылка без метки — «belgisiz».' })}</QXulosa>}
        </>}
        yordam={stage2 && <div className="kn-kyordam">
          <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
          {yordam && <>
            <QIzoh>{fmtCode(tr({ uz: '`new URLSearchParams(belgilar)` belgilarni o\'qiydi, `.get("kanal")` esa `kanal` qiymatini beradi; belgi bo\'lmasa `get` — `null` qaytaradi.', ru: '`new URLSearchParams(belgilar)` читает метки, а `.get("kanal")` даёт значение `kanal`; если метки нет, `get` возвращает `null`.' }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: '`null` bo\'lsa `"belgisiz"` qaytaring — `||` yoki `if` bilan.', ru: 'Если `null` — верните `"belgisiz"` через `||` или `if`.' }))}</QIzoh>
          </>}
        </div>}
        {...{ [QKOD_ONG]: <div className="kn-kodoyna">
          {stage2 && !done && <div className="kn-mgap fade-step"><img src={MENTOR_IMG} alt="" aria-hidden="true" /><span>{tr({ uz: "Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Нажмите кнопку — откроется окно кода: вы пишете код и сразу видите результат.' })}</span></div>}
          {stage2 && <div className="kn-amal"><QTugma className={cxx(!done && !isMentor && 'kn-halqa')} ikkinchi={done} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma></div>}
          {done
            ? <ul className="kn-kod-natija fade-step">{['guruh', 'sinf', 'instagram', 'belgisiz'].map((k, i) => <li key={k} style={{ '--i': i }}><b>kanal: {k}</b> · https://maydon-jamoa.example/{k === 'belgisiz' ? '' : '?kanal=' + k}</li>)}</ul>
            : <KodNamuna ajrat={ajrat} />}
          <span className="kn-kulrang">{fmtCode(tr({ uz: 'Lendingning o\'zida belgi sahifa ochilgan havoladan olinadi (`location.search`) — bu oynada esa namuna havolalardan.', ru: 'На самом лендинге метку берут из ссылки, по которой открыли страницу (`location.search`), — а в этом окне из ссылок-примеров.' }))}</span>
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      />
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), kod oynasi qobig'i tashqi zoomni bekor qiladi */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_STARTER)} storageKey="pm-m10d6-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; ✔ B, INLINE_KEYS.s12 = 1; scope final; ikkala trekka to'g'ri) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Postingiz tayyor. Mahalla guruhiga uni qachon yuborasiz?"
    question={tr({ uz: <h2 className="title h-ask">Postingiz tayyor. Mahalla guruhiga uni <A>qachon yuborasiz?</A></h2>, ru: <h2 className="title h-ask">Ваш пост готов. <A>Когда отправите</A> его в группу махалли?</h2> })}
    options={[
      { uz: 'Hozir, darsda: guruh baribir tanish joy', ru: 'Сейчас, на уроке: группа всё равно знакомая' },
      { uz: "Ota-onaga ko'rsatib, egasi ruxsat bergach", ru: 'Показав родителям и после разрешения владельца' },
      { uz: "Ruxsatsiz: post foydali bo'lgani uchun", ru: 'Без разрешения: пост ведь полезный' },
      { uz: 'Ertaga, hamma guruhlarga bir kunda yuborib', ru: 'Завтра, разослав во все группы за один день' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Guruhga post — ota-ona ko'rgach va egasi ruxsat bergach.", ru: 'Пост в группу — после того как посмотрели родители и разрешил владелец.' }}
    explainWrong={{
      0: { uz: 'Tanish guruhning ham egasi bor — u rozimi?', ru: 'У знакомой группы тоже есть владелец — он согласен?' },
      2: { uz: 'Foydali post ham ruxsat bilan yuboriladi.', ru: 'Полезный пост тоже отправляют с разрешения.' },
      3: { uz: "Bir xil post ko'p guruhda — ro'yxatning qaysi bandi?", ru: 'Один пост во многих группах — какой это пункт списка?' },
      default: { uz: "Ro'yxatning 2 va 4-bandini eslang.", ru: 'Вспомните 2-й и 4-й пункты списка.' }
    }}
    vizual={<div className="kn-tviz-q"><BandRoyxat ixcham faqat={[1, 3]} kataklar={[false, true, false, true, false, false]} /></div>} />
);

// ===== 🏅 BADGES (nishonlar) — to'rttasi ham ish qilingan ekranda (S-034, tekin bonus yo'q) =====
const ACHIEVEMENTS = {
  safeCheck: { icon: '🛡️', name: 'Safe Check!', desc: { uz: "Olti vaziyatni birinchi urinishda to'g'ri ajratdingiz", ru: 'С первой попытки верно разобрали шесть ситуаций' } },
  myChannels: { icon: '📣', name: 'My Channels!', desc: { uz: 'Mahsulotingiz uchun kanalni uch savol bilan tanladingiz', ru: 'Выбрали канал для своего продукта по трём вопросам' } },
  postReady: { icon: '✍️', name: 'Post Ready!', desc: { uz: "Birinchi postingizni to'rt qator bilan yozib, ro'yxat bo'yicha tekshirdingiz", ru: 'Написали первый пост из четырёх строк и проверили его по списку' } },
  linkReader: { icon: '🔗', name: 'Link Reader!', desc: { uz: "Havoladan kanal belgisini o'qiydigan kod yozdingiz", ru: 'Написали код, который читает метку канала из ссылки' } },
};
// Ekran id → nishon: s6 — olti vaziyat birinchi urinishda (to'g'ri/xato bor) · s9, s10, s11 — qilingan ish
const ACH_TRIGGERS = { s6: 'safeCheck', s9: 'myChannels', s10: 'postReady', s11: 'linkReader' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 8, 12)
const Q_LABELS = {
  3: { uz: '1 — Uch savol', ru: '1 — Три вопроса' },
  5: { uz: "2 — To'rt qator", ru: '2 — Четыре строки' },
  8: { uz: '3 — Facebook', ru: '3 — Facebook' },
  12: { uz: '4 — Qachon yuboriladi', ru: '4 — Когда отправлять' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning o'z atamalari (MD «Fon so'zlari», R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'kanal', ru: 'канал' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'post', ru: 'пост' }, l: 82, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'auditoriya', ru: 'аудитория' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'ruxsat', ru: 'разрешение' }, l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'tashrif', ru: 'посещение' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'belgi', ru: 'метка' }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: 'Umami', l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'lending', ru: 'лендинг' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang — 12 savol, ✔ o'rni MD dagidek: A 2·5·10 · B 3·7·11 · C 1·6·8 · D 4·9·12 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'Intervyuda hamma «Telegram guruhida yozamiz» dedi. Bu qaysi savolga dalil?', ru: 'В интервью все сказали «пишем в Telegram-группе». Доказательство для какого вопроса?' }, opts: [{ uz: "Siz bu guruhda a'zomisiz?", ru: 'Вы состоите в этой группе?' }, { uz: 'Bu guruhda ruxsat bormi?', ru: 'Есть ли разрешение в этой группе?' }, { uz: 'Auditoriyangiz shu yerdami?', ru: 'Ваша аудитория здесь?' }, { uz: 'Bu guruhda necha kishi bor?', ru: 'Сколько людей в группе?' }], correct: 2 },
  { q: { uz: 'Mentor misolida shahar futbol kanali nega tanlanmadi?', ru: 'Почему в примере Ментора не выбран городской футбольный канал?' }, opts: [{ uz: "A'zo emas va ruxsat ham yo'q", ru: 'Не состоит и разрешения нет' }, { uz: 'Futbol haqida yozilmas ekan', ru: 'Там не пишут о футболе' }, { uz: 'Kanalda odam juda kam ekan', ru: 'В канале очень мало людей' }, { uz: 'Kanal endigina ochilgan ekan', ru: 'Канал только что открыт' }], correct: 0 },
  { q: { uz: "Sinfdoshingiz guruhga qo'shilgan kuniyoq post yubordi. Nima qilinmadi?", ru: 'Одноклассник отправил пост в день вступления в группу. Что не сделано?' }, opts: [{ uz: "Postda birorta rasm yo'q edi", ru: 'В посте не было картинки' }, { uz: "Egasidan ruxsat so'ralmadi", ru: 'Не спросили разрешения владельца' }, { uz: 'Post qisqaroq qilib yozilmadi', ru: 'Пост не написали короче' }, { uz: 'Havola eng oxiriga yozilmadi', ru: 'Ссылку не поставили в самый конец' }], correct: 1 },
  { q: { uz: 'Postning qaysi qatori odamni sahifaga olib boradi?', ru: 'Какая строка поста ведёт человека на страницу?' }, opts: [{ uz: 'Kim uchun — postdagi birinchi gap', ru: 'Для кого — первая фраза поста' }, { uz: 'Nima foyda — odam nimani olishi', ru: 'Какая польза — что получит человек' }, { uz: 'Halol holat — hozir nima tayyor', ru: 'Честное состояние — что готово сейчас' }, { uz: 'Bitta harakat — lending havolasi', ru: 'Одно действие — ссылка на лендинг' }], correct: 3 },
  { q: { uz: 'Postingizda «Tez orada hamma narsa bo\'ladi» deb yozdingiz. Nima qilasiz?', ru: 'Вы написали в посте «Скоро будет всё». Что сделаете?' }, opts: [{ uz: 'Hozir tayyor narsani yozasiz', ru: 'Напишете, что готово сейчас' }, { uz: 'Gapni oxirgi qatorga surasiz', ru: 'Перенесёте фразу в последнюю строку' }, { uz: "Gap oxiriga undov qo'yasiz", ru: 'Поставите восклицательный знак' }, { uz: 'Gapni qalin harfda yozasiz', ru: 'Напишете фразу жирным' }], correct: 0 },
  { q: { uz: "Postga qaysi ma'lumot yozilmaydi?", ru: 'Какие данные не пишут в пост?' }, opts: [{ uz: 'Mahsulotning nomi', ru: 'Название продукта' }, { uz: 'Lendingning havolasi', ru: 'Ссылку на лендинг' }, { uz: 'Maktabingiz raqami', ru: 'Номер вашей школы' }, { uz: 'Mahsulotning foydasi', ru: 'Пользу продукта' }], correct: 2 },
  { q: { uz: 'Guruhda notanish odam uchrashishni taklif qildi. Nima qilasiz?', ru: 'Незнакомец в группе предложил встретиться. Что сделаете?' }, opts: [{ uz: "Yolg'iz o'zingiz borib ko'rasiz", ru: 'Пойдёте один посмотреть' }, { uz: 'Faqat kattalar bilan hal qilasiz', ru: 'Решите только со взрослыми' }, { uz: 'Sinfdosh bilan ikkovlashib borasiz', ru: 'Пойдёте вдвоём с одноклассником' }, { uz: 'Unga uy manzilingizni yozasiz', ru: 'Напишете ему домашний адрес' }], correct: 1 },
  { q: { uz: 'Facebook voqeasida nima hajmdan muhimroq?', ru: 'Что в истории Facebook важнее размера?' }, opts: [{ uz: "Saytdagi rasmlar ko'pligi", ru: 'Много картинок на сайте' }, { uz: "Funksiyalarning ko'pligi", ru: 'Много функций' }, { uz: 'Auditoriyaning zichligi', ru: 'Плотность аудитории' }, { uz: 'Asoschilarning tajribasi', ru: 'Опыт основателей' }], correct: 2 },
  { q: { uz: 'Facebook hamma uchun qachon ochilgan?', ru: 'Когда Facebook открылся для всех?' }, opts: [{ uz: 'Birinchi kuniyoq', ru: 'В первый же день' }, { uz: 'Bir oydan keyin', ru: 'Через месяц' }, { uz: 'Besh yildan keyin', ru: 'Через пять лет' }, { uz: 'Ikki yildan keyin', ru: 'Через два года' }], correct: 3 },
  { q: { uz: "Guruh egasidan ruxsat so'radingiz, javob yo'q. Nima qilasiz?", ru: 'Вы спросили разрешения у владельца группы, ответа нет. Что сделаете?' }, opts: [{ uz: 'Boshqa kanalingizdan boshlaysiz', ru: 'Начнёте с другого своего канала' }, { uz: 'Javob kutmay guruhga yuborasiz', ru: 'Отправите в группу, не дожидаясь' }, { uz: "A'zolarga alohida yozib chiqasiz", ru: 'Напишете участникам по отдельности' }, { uz: 'Boshqa akkauntdan guruhga yozasiz', ru: 'Напишете в группу с другого аккаунта' }], correct: 0 },
  { q: { uz: 'Havolada «?kanal=sinf» bor. Bu belgi nimani ko\'rsatadi?', ru: 'В ссылке есть «?kanal=sinf». Что показывает эта метка?' }, opts: [{ uz: 'Havolani bosgan odamning ismini', ru: 'Имя человека, нажавшего ссылку' }, { uz: 'Tashrif sinf chatidan kelganini', ru: 'Что посещение пришло из чата класса' }, { uz: "Sinfdagi o'quvchilar sonini", ru: 'Число учеников в классе' }, { uz: 'Sinf chatidagi postlar sonini', ru: 'Число постов в чате класса' }], correct: 1 },
  { q: { uz: 'Mentor misolida postdan keyingi kun tashriflar — 31. Bu nima?', ru: 'В примере Ментора на следующий день после поста посещений — 31. Что это?' }, opts: [{ uz: "Ro'yxatdan o'tgan odamlar soni", ru: 'Число зарегистрировавшихся' }, { uz: "Ilovani o'rnatgan odamlar soni", ru: 'Число установивших приложение' }, { uz: "Postni o'qigan odamlar soni", ru: 'Число прочитавших пост' }, { uz: 'Sahifa necha marta ochilgani', ru: 'Сколько раз открыли страницу' }], correct: 3 },
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

// ===== KARTOCHKALAR — alohida ekran, Mentorsiz (SABOQ 12, 16); birinchi bosishgacha karta yuzi halqada (E 49) =====
const KARTOCHKALAR = [
  { front: { uz: 'Kanal nima?', ru: 'Что такое канал?' }, back: { uz: 'Odamlar mahsulot haqida eshitadigan joy', ru: 'Место, где люди слышат о продукте' } },
  { front: { uz: 'Bizda kanal qaysi uch savol bilan tanlanadi?', ru: 'По каким трём вопросам у нас выбирают канал?' }, back: { uz: "Auditoriyangiz shu yerdami? Siz u yerda a'zomisiz? U yerda post yozishga ruxsat bormi?", ru: 'Ваша аудитория здесь? Вы там состоите? Есть ли там разрешение писать пост?' } },
  { front: { uz: "«Auditoriyangiz shu yerdami?» savoliga dalil qayerdan olinadi?", ru: 'Откуда берут доказательство для вопроса «Ваша аудитория здесь?»' }, back: { uz: "Intervyudagi «Hozir nima bilan» javobidan", ru: 'Из ответа «Чем сейчас» в интервью' } },
  { front: { uz: "Uch savoldan biriga «yo'q» bo'lsa, nima bo'ladi?", ru: 'Что будет, если на один из трёх вопросов ответ «нет»?' }, back: { uz: 'U joy kanal sifatida tanlanmaydi', ru: 'Это место не выбирают каналом' } },
  { front: { uz: 'Post nima?', ru: 'Что такое пост?' }, back: { uz: 'Kanalga yoziladigan matn', ru: 'Текст, который пишут в канал' } },
  { front: { uz: "Bizda post qaysi to'rt qatordan iborat?", ru: 'Из каких четырёх строк у нас состоит пост?' }, back: { uz: 'Kim uchun, nima foyda, bitta harakat va halol holat', ru: 'Для кого, какая польза, одно действие и честное состояние' } },
  { front: { uz: "«Halol holat» qatoriga nima yoziladi?", ru: 'Что пишут в строку «честное состояние»?' }, back: { uz: "Hozir nima tayyorligi; hali yo'q narsa va'da qilinmaydi", ru: 'Что готово сейчас; то, чего ещё нет, не обещают' } },
  { front: { uz: "Guruhga post yuborishdan oldin kimdan ruxsat so'raladi?", ru: 'У кого спрашивают разрешения перед отправкой поста в группу?' }, back: { uz: 'Guruh egasidan', ru: 'У владельца группы' } },
  { front: { uz: 'Sinf chatiga yuborishdan oldin nima qilinadi?', ru: 'Что делают перед отправкой в чат класса?' }, back: { uz: "Post Mentorga ko'rsatiladi; ota-ona bandi — boshqa kanallardan oldin", ru: 'Пост показывают Ментору; пункт о родителях — перед другими каналами' } },
  { front: { uz: 'Facebook avval qanday auditoriyada ochilgan?', ru: 'В какой аудитории сначала открылся Facebook?' }, back: { uz: 'Kichik, yopiq auditoriyada: faqat Garvard talabalari uchun', ru: 'В маленькой закрытой аудитории: только для студентов Гарварда' } },
  { front: { uz: "Kanal belgisi havolaning qayeriga qo'shiladi?", ru: 'Куда в ссылке добавляют метку канала?' }, back: { uz: 'Oxiriga, masalan: ?kanal=sinf', ru: 'В конец, например: ?kanal=sinf' } },
  { front: { uz: "Mentor misolida postdan keyingi kun eng ko'p tashrif qaysi kanaldan bo'lgan?", ru: 'Из какого канала в примере Ментора было больше всего посещений на следующий день после поста?' }, back: { uz: 'Mahalla futbol guruhidan (guruh)', ru: 'Из футбольной группы махалли (guruh)' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('kn-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="kn-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + ①②③; prompt qutisi — QPrompt, karta ichida; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'ota-onangiz va guruh egasi', ru: 'родители и владелец группы' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: 'kamida bitta haqiqiy kanalingiz', ru: 'хотя бы один ваш настоящий канал' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
// Agentga talab — MD aynan (agentga matn buyruq shaklida, T-002; lint:til ogohlantirishi kutilgan)
const HW_PROMPT1 = [
  { uz: 'Qayerda: lending/index.html. Boshqa fayl va papkalarga tegma.', ru: 'Где: lending/index.html. Другие файлы и папки не трогай.' },
  { uz: "Nima qilsin: sahifa ochilganda havoladagi kanal belgisini o'qisin (masalan, ?kanal=sinf) va Umami'ga tashrif hodisasini yozsin, ma'lumotida kanal bo'lsin. Belgi bo'lmasa — kanal qiymati \"belgisiz\".", ru: 'Что сделать: при открытии страницы прочитай метку kanal из ссылки (например, ?kanal=sinf) и запиши в Umami событие tashrif, в данных — kanal. Если метки нет — значение kanal "belgisiz".' },
  { uz: "Nima buzilmasin: sahifa matni, asosiy tugma va uning Umami hodisasi o'zgarmasin. Sahifa hech qanday shaxsiy ma'lumot yig'masin. Umami yuklanmasa ham sahifa ishlasin. O'zgargan fayllarni ayt.", ru: 'Что не сломать: текст страницы, главная кнопка и её событие Umami не должны меняться. Страница не должна собирать никаких личных данных. Страница должна работать, даже если Umami не загрузился. Назови изменённые файлы.' }
];
const HW_PROMPT3 = [
  { uz: "eas.json ga preview profili: Android uchun buildType — apk; env da EXPO_PUBLIC_API_URL — Render manzili. Boshqa fayllarga tegma. O'zgargan fayllarni ayt.", ru: 'В eas.json профиль preview: для Android buildType — apk; в env EXPO_PUBLIC_API_URL — адрес Render. Другие файлы не трогай. Назови изменённые файлы.' }
];
const HwCard = ({ keyingi, trek }) => (
  <div className="card kn-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="kn-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="kn-hw-q"><span className="kn-hw-k">{tr(r.k)}</span><span className="kn-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="kn-hw-qadam">
      <li><i>①</i><div>
        <b>{tr({ uz: 'Lendingga kanal belgisini qo\'shing', ru: 'Добавьте метку канала на лендинг' })}</b> <span className="kn-hw-iz">({tr({ uz: 'ikkala trek', ru: 'оба трека' })})</span>
        <p>{fmtCode(tr({ uz: "Antigravity'da o'z repo'ngizni oching; `git status` — `.env` ko'rinmasin. Agentga talab:", ru: 'Откройте свой репозиторий в Antigravity; `git status` — `.env` не должен быть виден. Требование агенту:' }))}</p>
        <QPrompt til={__lang} satrlar={HW_PROMPT1.map(tr)} />
        <p>{fmtCode(tr({ uz: "Keyin: `git status` — faqat `lending/index.html` → `git add lending/index.html` → commit → `git push`; Netlify odatda o'zi yangilanadi. Lending havolasini oxiriga `?kanal=sinf` qo'shib oching — Umami'da `tashrif` hodisasi ko'rinishi kerak (bir daqiqa kutib yangilang; ba'zi brauzer sozlamalarida Umami yozmasligi mumkin). Umami sahifa ochilishini o'zi ham sanaydi — `tashrif` o'sha ochilishni kanal belgisi bilan yozadi. Agentning hisobotiga emas — Umami'ga qarang.", ru: 'Затем: `git status` — только `lending/index.html` → `git add lending/index.html` → commit → `git push`; Netlify обычно обновляется сам. Откройте ссылку лендинга, добавив в конец `?kanal=sinf`, — в Umami должно появиться событие `tashrif` (подождите минуту и обновите; при некоторых настройках браузера Umami может не записать). Umami и сам считает открытия страницы — `tashrif` записывает это открытие с меткой канала. Смотрите не на отчёт агента, а в Umami.' }))}</p>
        <p>{fmtCode(tr({ uz: "Ishlamasa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas). Lending hali internetda bo'lmasa — avval uni Netlify'ga chiqaring (1-dars uyga vazifasi).", ru: 'Не работает — отправьте агенту строку ошибки (не значения `.env`, токены и ключи). Если лендинга ещё нет в интернете — сначала опубликуйте его на Netlify (домашнее задание 1-го урока).' }))}</p>
      </div></li>
      <li><i>②</i><div>
        <b>{tr({ uz: 'Haqiqiy kanalingizga post.', ru: 'Пост в ваш настоящий канал.' })}</b>
        <p>{fmtCode(tr({ uz: "Postni ota-onangizga ko'rsating (4-band). Guruh egasidan ruxsat so'rang («ruxsat kutilmoqda» bo'lgan joylar); ruxsat bo'lsa — yuboring, havola oxirida o'sha kanal belgisi bilan (kanallaringiz ro'yxatidagi kulrang qator, masalan `?kanal=guruh`).", ru: 'Покажите пост родителям (4-й пункт). Спросите разрешения у владельца группы (места с пометкой «ждёт разрешения»); если разрешили — отправьте, в конце ссылки метка этого канала (серая строка в списке ваших каналов, например `?kanal=guruh`).' }))}</p>
        <p>{tr({ uz: 'Har joyga bir marta; notanish odamga shaxsiy xabar yozmang; uchrashuv taklifi kelsa — faqat kattalar bilan.', ru: 'В каждое место — один раз; не пишите личных сообщений незнакомым; если предложат встретиться — только со взрослыми.' })}</p>
      </div></li>
      {trek !== 'web' && <li><i>③</i><div>
        <b>{tr({ uz: 'Mobil trek — tekshiruv fayli', ru: 'Мобильный трек — проверочный файл' })}</b> <span className="kn-hw-iz">({tr({ uz: "web-trekda yo'q", ru: 'в веб-треке нет' })})</span>
        <p>{tr({ uz: <>O'rnatish faylini tayyorlab, faqat <b>o'z telefoningizga</b> o'rnating — odamlarga yubormang: unda hali telefon so'raydigan eski ro'yxatdan o'tish bor.</>, ru: <>Подготовьте установочный файл и установите его только <b>на свой телефон</b> — людям не отправляйте: в нём ещё старая регистрация, которая спрашивает телефон.</> })}</p>
        <p>{fmtCode(tr({ uz: "Terminalda, ilova papkasida (Mentor misolida `mobil/`): `npm install --global eas-cli` → `eas login` (Expo akkauntingiz bilan; akkaunt ma'lumotini hech kimga bermang) → `eas build:configure` → agentga talab:", ru: 'В терминале, в папке приложения (в примере Ментора `mobil/`): `npm install --global eas-cli` → `eas login` (со своим аккаунтом Expo; данные аккаунта никому не давайте) → `eas build:configure` → требование агенту:' }))}</p>
        <QPrompt til={__lang} satrlar={HW_PROMPT3.map(tr)} />
        <p>{fmtCode(tr({ uz: "→ `eas build -p android --profile preview` — kalit (keystore) so'ralsa, EAS o'zi yaratadi va saqlaydi. Tayyor bo'lgach havola chiqadi: telefoningizda oching va o'rnating — Android ogohlantirish ko'rsatadi: ilova do'kondan emas, to'g'ridan-to'g'ri o'rnatiladi.", ru: '→ `eas build -p android --profile preview` — если спросят ключ (keystore), EAS создаст и сохранит его сам. Когда будет готово, появится ссылка: откройте на телефоне и установите — Android покажет предупреждение: приложение ставится не из магазина, а напрямую.' }))}</p>
        <p>{fmtCode(tr({ uz: "Bepul navbat sekin bo'lishi mumkin; bepul hisobda oyiga 15 tagacha Android o'rnatish fayli tayyorlash mumkin. Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas).", ru: 'Бесплатная очередь может быть медленной; на бесплатном аккаунте можно готовить до 15 установочных файлов Android в месяц. Если ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи).' }))}</p>
      </div></li>}
    </ol>
    {keyingi && <span className="kn-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + holatga qarab sarlavha (sinf 1, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
// «Bugungi asosiy fikr», ro'yxat chipi va artefakt-strip — ko'rsatilmaydi (E 50)
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
    { uz: 'Kanal — odamlar mahsulot haqida eshitadigan joy.', ru: 'Канал — место, где люди слышат о продукте.' },
    { uz: "Bizda kanal uch savol bilan tanlanadi: auditoriya shu yerdami, siz a'zomisiz, post yozishga ruxsat bormi.", ru: 'У нас канал выбирают по трём вопросам: здесь ли аудитория, состоите ли вы, есть ли разрешение писать пост.' },
    { uz: "Bizda post to'rt qatordan iborat: kim uchun, nima foyda, bitta harakat va halol holat.", ru: 'У нас пост состоит из четырёх строк: для кого, какая польза, одно действие и честное состояние.' },
    { uz: 'Facebook voqeasida xizmat avval kichik, yopiq auditoriyada ochilgan.', ru: 'В истории Facebook сервис сначала открылся в маленькой закрытой аудитории.' },
    { uz: "Havoladagi kanal belgisi tashrif qaysi kanaldan kelganini ko'rsatadi, odamni emas.", ru: 'Метка канала в ссылке показывает, из какого канала пришло посещение, а не человека.' }
  ];
  const k = kanallarOl();
  const post = k.post || {};
  const postToliq = POST_MAYDON.every(m => String(post[m.id] || '').trim());
  const postBor = POST_MAYDON.some(m => String(post[m.id] || '').trim());
  const kanalSoni = Array.isArray(k.kanallar) ? k.kanallar.length : 0;
  const s9 = answers[9];
  const tekshirildi = !!(s9 && Array.isArray(s9.royxat) && s9.royxat.length > 0);
  const trek = (lsO(TREK_KEY) || {}).trek;
  // Sarlavha holatga qarab va rost (E 54): MD dagi besh holat + hech narsa qilinmagan / post qisman (MD ga taklif)
  const holat = isMentorL || k.yuborildi ? 'yuborildi' : postToliq && k.mentorga ? 'mentorga' : postToliq ? 'yozildi'
    : kanalSoni > 0 ? 'kanallar' : tekshirildi ? 'boshlandi' : postBor ? 'qisman' : 'yoq';
  const SARLAVHA = {
    yuborildi: { uz: <>Postingiz <A>sinf chatiga yuborildi.</A></>, ru: <>Ваш пост <A>отправлен в чат класса.</A></> },
    mentorga: { uz: <>Post tayyor va <A>Mentorga ko'rsatildi.</A></>, ru: <>Пост готов и <A>показан Ментору.</A></> },
    yozildi: { uz: <>Post yozildi — <A>Mentorga ko'rsatish qoldi.</A></>, ru: <>Пост написан — <A>осталось показать Ментору.</A></> },
    kanallar: { uz: <>Kanallar tanlandi — <A>postni yozib tugating.</A></>, ru: <>Каналы выбраны — <A>допишите пост.</A></> },
    boshlandi: { uz: <>Kanal tanlash boshlandi — <A>qolganini tugating.</A></>, ru: <>Выбор каналов начат — <A>завершите остальное.</A></> },
    qisman: { uz: <>Post hali tugamagan — <A>to'rt qatorni yozib chiqing.</A></>, ru: <>Пост ещё не закончен — <A>допишите четыре строки.</A></> },
    yoq: { uz: <>Kanal hali tanlanmagan — <A>uch savol bilan tanlab chiqing.</A></>, ru: <>Канал ещё не выбран — <A>выберите по трём вопросам.</A></> }
  };
  const toliq = holat === 'yuborildi' || holat === 'mentorga';
  const keyingi = tr({ uz: <>Keyingi dars — <b>«50 foydalanuvchiga qanday yetasiz?»</b></>, ru: <>Следующий урок — <b>«Как дойти до 50 пользователей?»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('kn-yakun', !toliq && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={tr(SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard keyingi={keyingi} trek={trek} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(t => ({ ...t, t: tr(t.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmChannelsLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* ikki klassli selektor: keyingi «.zoomable position relative» qoidasi oynani joyidan siljitib, ekran chetidan kesardi (F-1006-386) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        /* ⛶ oynasi ekran markazida: ota-blokdagi animatsiya/transform «position: fixed»ni o'ziga bog'lab, oynani siljitib kesardi (A2 natijasi — F-1006-386) */
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 1199px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .lesson-root .q-ekran > ol.q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .lesson-root .q-mustaqil { max-width: none; }
        /* === DARSNING O'Z VIZUALI — ChatTelefon (ct-), lending maketi (kl-, kj-), Facebook sahnasi (fb-), dars elementlari (kn-). Faqat qolip tokenlari (D3); brend rangi — faqat nom yorlig'ida === */
        .kn-tg { font-weight: 800; font-style: normal; color: #229ED9; letter-spacing: 0.01em; }
        .kn-fb { font-weight: 800; font-style: normal; color: #1877F2; }
        .kn-mj { font-weight: 800; color: ${T.ok}; }
        .kn-teg { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; text-transform: none; letter-spacing: 0; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .kn-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: kn-puls 2.2s ease-out .3s 3; }
        @keyframes kn-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .kn-halqa-i { border-color: ${T.accent} !important; animation: kn-tolqin-i 2.4s ease-in-out 0.4s 3; }
        @keyframes kn-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        /* Variantlar, tanlov chiplari va javob tugmalari: guruh atrofida ramka yo'q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .kn-s0 { display: contents; }
        .kn-s0.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: kn-chorla-v 1.8s ease-out .5s 2; }
        @keyframes kn-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .kn-s0.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .kn-s0.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled), .kn-chorla > .q-chip:not(:disabled), .kn-chorla > .kn-javob, .kn-chorla > .kn-yorl:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: kn-chorla-c 1.8s ease-out .5s 2; }
        @keyframes kn-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .q-bashorat .q-chip:nth-child(2), .kn-chorla > :nth-child(2) { animation-delay: .75s; }
        .q-bashorat .q-chip:nth-child(3), .kn-chorla > :nth-child(3) { animation-delay: 1s; }
        .kn-chorla > :nth-child(4) { animation-delay: 1.25s; } .kn-chorla > :nth-child(5) { animation-delay: 1.5s; } .kn-chorla > :nth-child(6) { animation-delay: 1.75s; } .kn-chorla > :nth-child(7) { animation-delay: 2s; }
        .kn-chorla-b { min-width: 0; }
        /* --- ChatTelefon: o'lchami barqaror 170×272 (SABOQ 22), tepada «Telegram» o'z rangida --- */
        .ct-wrap { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; flex: none; min-width: 0; }
        .ct-wrap > .q-izoh { max-width: 230px; }
        .kn-s5j .ct-puf { box-shadow: none; }
        .ct-ust { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .ct-tel { position: relative; width: 170px; height: 272px; flex: none; display: flex; flex-direction: column; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px 7px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; transition: box-shadow 0.4s; }
        .ct-tel.yashil { box-shadow: 0 0 0 5px ${fon(T.ok, 0.35)}, 0 12px 26px -14px rgba(${T.shadowBase},0.4); }
        .ct-bar { display: flex; justify-content: center; align-items: center; height: 16px; flex: none; font-size: 12px; }
        .ct-royxat { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 5px; margin-top: 5px; }
        .ct-sar { font-size: 10px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .04em; padding: 0 2px; animation: kn-kir .4s ease-out both; }
        .ct-sar b { color: ${T.accent}; display: inline-block; animation: kn-pop .5s cubic-bezier(.3,1.5,.5,1); }
        .ct-q { position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr); grid-template-areas: "ava nom" "ava alt" "ava kk"; column-gap: 6px; row-gap: 1px; align-items: center; padding: 4px 6px; border-radius: 10px; border: 1.5px solid transparent; background: ${T.bg}; transition: border-color .3s, background .3s; }
        .ct-q.mini { width: 300px; max-width: 100%; grid-template-columns: auto minmax(0, 1fr) auto; grid-template-areas: "ava nom kk" "ava alt kk"; padding: 8px 10px; column-gap: 10px; background: ${T.paper}; border-color: ${T.line}; }
        .ct-q.joy { min-height: 34px; background: none; border: 1.5px dashed ${fon(T.ink, 0.22)}; }
        .ct-q.joy .ct-ava { background: ${T.bg}; color: ${T.ink2}; }
        .ct-q.h-joriy { border-color: ${T.accent}; }
        .ct-q.joy.h-joriy { border-style: dashed; }
        .ct-q.h-kanal { border-color: ${T.ok}; background: ${T.okFon}; }
        .ct-q.h-kutish { border-color: ${fon(T.ink, 0.3)}; border-style: dashed; }
        .ct-q.h-yoq { opacity: .62; }
        .ct-q.h-yoq .ct-q-nom { text-decoration: line-through; }
        .ct-q.yangi { animation: kn-kir .45s ease-out both, kn-yashil 1.2s ease-out; }
        .ct-q-y { position: absolute; top: -7px; right: 6px; z-index: 1; font-size: 9px; font-weight: 800; color: #fff; background: ${T.ok}; border-radius: 99px; padding: 0 6px; line-height: 14px; animation: kn-tush .45s cubic-bezier(.3,1.4,.5,1) both; }
        .ct-q.h-yoq .ct-q-y, .ct-q.h-kutish .ct-q-y { background: ${T.ink2}; }
        .ct-ava { grid-area: ava; align-self: start; width: 20px; height: 20px; border-radius: 50%; flex: none; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #fff; background: #229ED9; }
        .ct-q.mini .ct-ava { width: 30px; height: 30px; font-size: 13px; align-self: center; }
        .ct-q-nom { grid-area: nom; min-width: 0; font-size: 10.5px; line-height: 1.2; font-weight: 800; color: ${T.ink}; overflow-wrap: anywhere; }
        .ct-q-alt { grid-area: alt; min-width: 0; display: flex; flex-direction: column; line-height: 1.2; }
        .ct-q-alt span { font-size: 9.5px; color: ${T.ink2}; }
        .ct-q.mini .ct-q-nom { font-size: 14px; } .ct-q.mini .ct-q-alt span { font-size: 12px; }
        .ct-q-alt code { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: ${T.ink2}; overflow-wrap: anywhere; }
        .ct-q .kn-tahrir { position: absolute; right: 4px; bottom: 4px; width: 22px; height: 22px; font-size: 11px; }
        .ct-kk { grid-area: kk; display: flex; gap: 3px; flex: none; }
        .ct-k { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid ${fon(T.ink, 0.25)}; background: ${T.paper}; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 9px; font-weight: 800; color: #fff; flex: none; }
        .ct-q.mini .ct-k { width: 20px; height: 20px; font-size: 11px; }
        .ct-k.ok { background: ${T.ok}; border-color: ${T.ok}; }
        .ct-k.yoq { background: ${fon(T.ink, 0.42)}; border-color: transparent; }
        .ct-k.sav, .ct-k.uyda { color: ${T.ink2}; background: ${T.bg}; border-style: dashed; }
        .ct-k.yangi { animation: kn-tush .45s cubic-bezier(.3,1.4,.5,1) both; }
        .ct-k.katta { width: 40px; height: 40px; font-size: 18px; border-radius: 10px; }
        .ct-chat { flex: 1; min-height: 0; display: flex; flex-direction: column; margin-top: 4px; }
        .ct-chat-h { display: flex; align-items: center; gap: 6px; padding: 3px 4px 5px; border-bottom: 1px solid ${T.line}; font-size: 10px; color: ${T.ink2}; flex: none; }
        .ct-chat-h b { flex: 1; min-width: 0; font-size: 10px; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ct-chat-ichi { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: stretch; gap: 3px; padding: 5px 2px 2px; background: ${T.bg}; border-radius: 0 0 16px 16px; overflow-y: auto; scrollbar-width: none; }
        .ct-chat-ichi > :first-child { margin-top: auto; }
        .ct-puf { display: flex; flex-direction: column; gap: 2px; padding: 6px 7px; border-radius: 12px 12px 4px 12px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 4px 10px -8px rgba(${T.shadowBase},0.4); transition: background .4s, border-color .4s; }
        .ct-puf.qoralama { background: ${fon(T.ink, 0.05)}; border-style: dashed; border-color: ${fon(T.ink, 0.25)}; }
        .ct-puf.yuborildi { border-color: ${fon(T.ok, 0.5)}; }
        .ct-b { display: block; text-align: left; font-family: 'Manrope', sans-serif; font-size: 9.5px; line-height: 1.3; color: ${T.ink}; padding: 1px 2px 2px; margin: 0; border: 0; border-bottom: 1.5px solid transparent; background: none; border-radius: 3px; transition: border-color .4s, box-shadow .3s; }
        button.ct-b { width: 100%; cursor: pointer; }
        .ct-b.joy { border-bottom: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .ct-b.joy.bosh { min-height: 16px; }
        .ct-b.faol { box-shadow: 0 0 0 1.5px ${fon(T.accent, 0.55)}; }
        .ct-b.faol:hover { background: ${T.accentSoft}; }
        .ct-b.ok.q-kim { border-bottom-color: ${T.accent}; } .ct-b.ok.q-foyda { border-bottom-color: ${T.ok}; } .ct-b.ok.q-harakat { border-bottom-color: #B86E00; } .ct-b.ok.q-holat { border-bottom-color: #0E7C8C; }
        .ct-b.yangi { animation: kn-yashil 1.1s ease-out; }
        .ct-b-y { display: inline-block; margin-left: 3px; font-style: normal; font-size: 8px; font-weight: 800; line-height: 1.3; padding: 0 4px; border-radius: 99px; background: ${T.bg}; color: ${T.ink2}; animation: kn-tush .45s cubic-bezier(.3,1.4,.5,1) both; }
        .ct-b.q-kim .ct-b-y { color: ${T.accent}; } .ct-b.q-foyda .ct-b-y { color: ${T.ok}; } .ct-b.q-harakat .ct-b-y { color: #B86E00; } .ct-b.q-holat .ct-b-y { color: #0E7C8C; }
        .ct-holat { align-self: flex-end; font-size: 8.5px; font-weight: 700; color: ${T.ink2}; }
        .ct-holat.ok { color: ${T.ok}; animation: kn-tush .45s both; }
        .ct-atama { align-self: flex-start; font-size: 9.5px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 1px 8px; }
        .ct-b-m { overflow-wrap: anywhere; }
        .kn-bolak { cursor: pointer; }
        .kn-bor { min-width: 64px; }
        .kn-darvoza { text-align: left; }
        .kn-s9-karta, .kn-s10-karta { gap: 12px; }
        .kn-tur { font-size: 12.5px; }
        .kn-yorlar { gap: 12px; }
        .fb-doira.asosiy { z-index: 1; }
        /* --- Mentor lendingi ixcham (1-dars ko'rinishi): brauzer + nom + sarlavha + tugma + telefon (zoom — kesilmaydi, E 41) --- */
        .kl-oyna { background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px -16px rgba(${T.shadowBase},0.35); display: flex; flex-direction: column; min-width: 0; width: 100%; }
        .kl-oyna.ixcham { box-shadow: none; }
        .kl-oyna.ixcham .kl-kor { display: none; }
        .kl-bar { display: flex; align-items: center; gap: 6px; height: 30px; padding: 0 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; flex: none; }
        .kl-oyna.ixcham .kl-bar { border-bottom: 0; }
        .kl-bar > i { width: 9px; height: 9px; border-radius: 50%; background: ${fon(T.ink, 0.16)}; flex: none; }
        .kl-url { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; height: 22px; margin-left: 6px; padding: 0 10px; border-radius: 999px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; }
        .kl-qulf { width: 10px; height: 12px; flex: none; fill: ${T.ok}; stroke: ${T.ok}; }
        .kl-url-t { overflow: hidden; text-overflow: ellipsis; animation: kn-kir .35s ease-out both; }
        .kl-kor { position: relative; }
        .kl-ichi { display: flex; gap: 14px; align-items: center; padding: 14px 16px; }
        .kl-chap { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 9px; align-items: flex-start; }
        .kl-nom { font-weight: 800; font-size: 13px; color: ${T.ok}; }
        h3.kl-sar { margin: 0; font-size: clamp(18px,2vw,22px); line-height: 1.2; font-weight: 800; color: ${T.ink}; letter-spacing: -0.01em; }
        .kl-tugma { font-weight: 800; font-size: 13px; border-radius: 10px; padding: 8px 14px; background: ${T.accent}; color: #fff; }
        .kj-tel { position: relative; width: 170px; height: 272px; flex: none; zoom: 0.62; display: flex; flex-direction: column; gap: 6px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .kj-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; }
        .kj-nom { font-weight: 800; font-size: 12.5px; color: ${T.ok}; }
        .kj-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; }
        .kj-sar { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .kj-kun { margin-top: 4px; font-size: 11px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.05em; }
        .kj-karta { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; color: ${T.ink2}; }
        .kj-karta b { font-size: 12.5px; color: ${T.ink}; }
        .kj-son { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; margin-top: 4px; }
        .kj-doiralar { display: grid; grid-template-columns: repeat(5, 12px); gap: 5px; margin: 4px 0; }
        .kj-doiralar i { width: 12px; height: 12px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .kj-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.38)}; }
        /* --- 0-ekran: tanlangan yo'ldan sahifaga ingichka chiziq; Umami hisoblagichi (chizilgan, logotipsiz) --- */
        .kn-hook { position: relative; display: flex; flex-direction: column; gap: 10px; }
        .kn-yol { display: flex; flex-direction: column; align-items: flex-start; margin-bottom: -10px; padding-left: 24px; animation: kn-kir .4s ease-out both; }
        .kn-yol-m { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 999px; background: ${T.paper}; border: 1.5px solid ${T.accent}; font-size: 11.5px; color: ${T.ink2}; }
        .kn-yol-m svg { width: 14px; height: 14px; stroke: ${T.ink2}; fill: none; flex: none; }
        .kn-yol-m.guruh svg { stroke: #229ED9; }
        .kn-yol-m i { font-style: normal; font-family: 'JetBrains Mono', monospace; }
        .kn-yol-m b { font-size: 15px; color: ${T.accent}; padding: 0 4px; }
        .kn-yol-ch { display: block; width: 0; height: 18px; margin-left: 22px; border-left: 2px dashed ${T.accent}; transform-origin: top; animation: kn-chiz-y .5s ease-out .25s both; }
        .kn-umami { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 8px 22px -14px rgba(${T.shadowBase},0.3); min-width: 0; }
        .kn-umami-h { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; }
        .kn-umami-h b { font-size: 12px; font-weight: 800; color: ${T.ink}; letter-spacing: 0.03em; }
        .kn-umami-h span { font-size: 11.5px; color: ${T.ink2}; }
        .kn-umami-r { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 14px; }
        .kn-umami-d { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .kn-umami-s { font-size: 13px; color: ${T.ink2}; border-radius: 8px; padding: 2px 6px; }
        .kn-umami-s b { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; color: ${T.ink}; margin-left: 4px; }
        .kn-umami-s.halqa { outline: 2px solid ${T.accent}; outline-offset: 1px; animation: kn-puls 2.2s ease-out .3s 3; }
        .kn-umami-s.halqa b { color: ${T.accent}; }
        .kn-umami-k { font-size: 12.5px; line-height: 1.6; color: ${T.ink}; }
        .kn-kq { display: inline-block; margin-left: 4px; animation: kn-kir .4s ease-out calc(1.4s + var(--i) * .25s) both; }
        .kn-kq code { font-family: 'JetBrains Mono', monospace; font-weight: 700; background: ${T.bg}; border-radius: 4px; padding: 0 4px; }
        .kn-kq em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; }
        .kn-msanoq { display: flex; flex-direction: column; gap: 6px; }
        .kn-msanoq .kn-umami { padding: 10px 12px; gap: 4px; }
        .kn-msanoq .kn-umami-s { padding: 0 4px; font-size: 12.5px; }
        .kn-msanoq .kn-umami-s b { font-size: 18px; }
        .kn-msanoq .kn-kulrang { font-size: 12px; line-height: 1.4; }
        .kn-msanoq .kl-bar { height: 26px; }
        /* --- Joylashuv --- */
        .kn-split { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: clamp(16px,2.6vw,28px); align-items: start; }
        .kn-split.kn-s6 { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
        .kn-chap { display: flex; flex-direction: column; gap: 10px; min-width: 0; max-width: 300px; }
        .kn-fokus { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; max-width: 680px; margin: 0 auto; }
        .kn-fokus.kn-yon { flex-direction: row; justify-content: center; align-items: center; flex-wrap: wrap; gap: 14px 26px; }
        .kn-fokus > .kn-royxat { max-width: 640px; }
        .kn-izohlar { display: flex; flex-direction: column; gap: 8px; max-width: 330px; min-width: 0; }
        .kn-atama { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; animation: kn-kir .5s ease-out both; }
        .kn-atama-y { font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 11px; }
        .kn-tviz { margin-top: 4px; }
        .kn-tviz-q { display: flex; }
        .kn-uch { position: fixed; z-index: 1200; pointer-events: none; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 4px 10px; white-space: nowrap; max-width: 260px; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); animation: kn-uch .8s cubic-bezier(.4,0,.2,1) forwards; }
        .kn-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .kn-tx b { color: ${T.ink}; } .kn-tx.ok, .kn-tx.ok b { color: ${T.ok}; } .kn-tx b.yoq { color: ${T.err}; }
        .q-xulosa .kn-x-m { display: block; }
        .q-xulosa .kn-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .kn-bashq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 9px 14px; border-radius: 12px; background: ${T.accentSoft}; font-size: 13px; color: ${T.ink2}; }
        .kn-bashq-t b { color: ${T.accent}; }
        /* --- Karta (bittadan; E 53) --- */
        .kn-karta { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 10px; min-width: 0; animation: kn-karta .4s ease-out both; transition: background .3s; }
        .kn-karta.err { background: ${T.errFon}; }
        .kn-kirish { animation: kn-juft-kir .45s cubic-bezier(.3,1.2,.5,1) both; }
        .kn-karta-nom { font-size: clamp(16px,1.9vw,19px); font-weight: 800; color: ${T.ink}; line-height: 1.3; }
        p.kn-yozuv { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 8px 12px; }
        p.kn-yozuv span { font-weight: 700; color: ${T.ink}; }
        .kn-uch-q { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
        .kn-uch-n, .kn-raqamlar { display: flex; gap: 5px; flex-wrap: wrap; }
        .kn-uch-n i, .kn-raqamlar i { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.bg}; color: ${T.ink2}; }
        .kn-uch-n i.cur, .kn-raqamlar i.cur { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .kn-uch-n i.ok, .kn-raqamlar i.ok { background: ${T.ok}; color: #fff; }
        .kn-uch-n i.yoq { background: ${fon(T.ink, 0.4)}; color: #fff; }
        .kn-javoblar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .kn-javoblar.silk { animation: kn-silk .4s ease-in-out; }
        .kn-javob { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; padding: 10px 20px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: background .2s, border-color .2s; }
        .kn-javob:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .kn-javoblar.ixcham { gap: 6px; }
        .kn-javoblar.ixcham .kn-javob { font-size: 12.5px; padding: 6px 12px; }
        p.kn-ipucha { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .kn-kulrang { display: block; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        p.kn-yordam { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink}; background: ${T.bg}; border-radius: 10px; padding: 8px 12px; }
        p.kn-matn { margin: 0; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        .kn-karta-tug { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 8px; }
        .kn-karta-tug.chap { justify-content: flex-start; }
        .kn-tahrir { width: 24px; height: 24px; flex: none; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; font-size: 12px; line-height: 1; padding: 0; }
        /* --- 4-ekran: yorliqlar (kartada rangli yon chiziq yo'q — nom rangida) --- */
        .kn-yorl-ro { display: flex; flex-direction: column; gap: 8px; }
        .kn-yorl { display: flex; flex-direction: column; gap: 2px; text-align: left; padding: 9px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; cursor: pointer; font-family: 'Manrope', sans-serif; transition: border-color .2s, background .2s; }
        .kn-yorl b { font-size: 14px; font-weight: 800; }
        .kn-yorl span { font-size: 12px; color: ${T.ink2}; }
        .kn-yorl.q-kim b { color: ${T.accent}; } .kn-yorl.q-foyda b { color: ${T.ok}; } .kn-yorl.q-harakat b { color: #B86E00; } .kn-yorl.q-holat b { color: #0E7C8C; }
        .kn-yorl.on { border-color: ${T.accent}; background: ${T.accentSoft}; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .kn-yorl.ok { opacity: .5; cursor: default; }
        .kn-yorl.silk { animation: kn-silk .4s ease-in-out; }
        /* --- 5-ekran: chat oynasi (iqtibos) --- */
        .kn-chatoyna { max-width: 470px; border: 1.5px solid ${T.line}; border-radius: 14px; overflow: hidden; background: ${T.bg}; margin-bottom: 12px; }
        .kn-chatoyna .ct-chat-h { background: ${T.paper}; padding: 7px 12px; font-size: 12px; }
        .kn-chatoyna .ct-chat-h b { font-size: 13px; }
        .kn-chatoyna-i { padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; }
        .kn-chatoyna .ct-puf { max-width: 400px; padding: 8px 10px; }
        .kn-chatoyna .ct-b { font-size: 13px; }
        .kn-chatoyna .ct-b-y { font-size: 10.5px; }
        .kn-chatoyna .ct-b.joy.bosh { min-height: 20px; }
        .kn-chatoyna.keng { width: 100%; max-width: 560px; margin: 0; box-shadow: 0 12px 30px -16px rgba(${T.shadowBase},0.35); transition: box-shadow .4s; animation: kn-kir .45s ease-out both; }
        .kn-chatoyna.keng .ct-puf { max-width: none; }
        .kn-chatoyna.keng .ct-b { font-size: 14px; line-height: 1.45; padding: 2px 3px 4px; }
        .kn-chatoyna.keng .ct-b-y { font-size: 11px; }
        .kn-chatoyna.keng .ct-holat { font-size: 11.5px; }
        .kn-chatoyna.keng .ct-atama { font-size: 11px; }
        .kn-chatoyna.yashil { box-shadow: 0 0 0 5px ${fon(T.ok, 0.35)}, 0 12px 30px -16px rgba(${T.shadowBase},0.35); }
        /* --- 6, 10, 12-ekranlar: olti bandli ro'yxat --- */
        .kn-royxat { background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 8px; min-width: 0; width: 100%; }
        .kn-royxat.ixcham { padding: 0; box-shadow: none; background: none; }
        .kn-royxat-h { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .kn-royxat-h b { font-size: 15px; color: ${T.ink}; }
        .kn-royxat-n { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.accent}; animation: kn-pop .5s cubic-bezier(.3,1.5,.5,1); }
        ul.kn-bandlar { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .kn-bandlar li { display: flex; gap: 8px; align-items: flex-start; padding: 6px 8px; border-radius: 10px; animation: kn-kir .4s ease-out both; }
        .kn-bandlar li.yangi { animation: kn-kir .45s ease-out both, kn-yashil 1.2s ease-out; }
        .kn-band-k, .kn-band i, .kn-band2 i { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid ${fon(T.ink, 0.3)}; background: ${T.paper}; flex: none; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; color: #fff; }
        .kn-band-k.ok, .kn-band.ok i, .kn-band2.ok i { background: ${T.ok}; border-color: ${T.ok}; }
        .kn-band { padding: 0; margin-top: 1px; border: 0; background: none; cursor: pointer; flex: none; }
        .kn-band:disabled { cursor: default; opacity: .55; }
        .kn-band-t { font-size: 13px; line-height: 1.4; color: ${T.ink}; }
        .kn-band-t em { display: block; font-style: normal; font-size: 11.5px; color: ${T.ink2}; }
        p.kn-ost { margin: 2px 0 0; padding-top: 7px; border-top: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .kn-band2 { display: flex; gap: 8px; align-items: flex-start; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; font-size: 13px; line-height: 1.4; color: ${T.ink}; }
        .kn-band2.yangi { animation: kn-yashil 1.2s ease-out; }
        /* --- 9, 10-ekranlar: mustaqil ish kartasi --- */
        .kn-qism { display: flex; flex-direction: column; gap: 8px; }
        .kn-qism-h { font-size: 11.5px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .05em; }
        .kn-turlar { display: flex; flex-wrap: wrap; gap: 6px; }
        .kn-savollar { display: flex; flex-direction: column; gap: 8px; }
        .kn-oklar { display: flex; flex-direction: column; gap: 6px; }
        .kn-ok-q { display: grid; grid-template-columns: auto auto minmax(0, 1fr); gap: 8px; align-items: center; text-align: left; padding: 7px 10px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 12.5px; cursor: pointer; }
        .kn-ok-q:hover { border-color: ${T.ok}; }
        .kn-ok-q i { font-style: normal; font-weight: 800; color: ${T.ok}; }
        .kn-ok-q span { color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 210px; }
        .kn-ok-q b { color: ${T.ink}; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; }
        .kn-dalil em { font-style: normal; opacity: .8; }
        .kn-maydon { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .kn-inp { width: 100%; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 500; color: ${T.ink}; padding: 10px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; outline: none; }
        .kn-inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.15)}; }
        .kn-inp::placeholder { color: ${fon(T.ink, 0.42)}; }
        .kn-inp.katta { font-size: 16px; padding: 12px 14px; }
        .kn-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        .kn-hisob { align-self: flex-end; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .kn-hisob.chek { color: ${T.accent}; }
        code.kn-havola { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 4px 8px; overflow-wrap: anywhere; }
        ul.kn-sherik { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .kn-sherik li { display: flex; justify-content: space-between; align-items: center; gap: 8px 10px; flex-wrap: wrap; padding: 6px 10px; border-radius: 10px; background: ${T.bg}; animation: kn-kir .4s ease-out both; }
        .kn-sherik li.bor { background: ${T.paper}; border: 1px solid ${T.line}; }
        .kn-sherik-n { font-weight: 800; font-size: 13px; }
        .kn-sherik .q-kim .kn-sherik-n, li.q-kim .kn-sherik-n { color: ${T.accent}; } li.q-foyda .kn-sherik-n { color: ${T.ok}; } li.q-harakat .kn-sherik-n { color: #B86E00; } li.q-holat .kn-sherik-n { color: #0E7C8C; }
        .kn-sherik-v { display: inline-flex; align-items: center; gap: 6px; }
        .kn-sherik-v b { font-size: 12.5px; color: ${T.ink2}; }
        .kn-sherik-v b.okc { color: ${T.ok}; }
        /* --- 7-ekran: Facebook sahnasi (chizilgan; son, asoschi, sabab yo'q) --- */
        .kn-voqea { display: flex; flex-direction: column; gap: 12px; }
        p.kn-tanish { margin: 0; font-size: 14px; color: ${T.ink2}; }
        .kn-voqea-h { font-weight: 800; font-size: 15px; color: ${T.ink}; animation: kn-kir .4s ease-out both; }
        .kn-nuq { display: flex; align-items: center; gap: 8px; margin: 2px 0; }
        .kn-nuq-l { font-weight: 800; font-size: 12px; color: ${T.ink2}; margin-right: 4px; }
        .kn-nuq > i { width: 26px; height: 6px; border-radius: 99px; background: ${T.line}; }
        .kn-nuq > i.ok { background: ${T.ok}; } .kn-nuq > i.cur { background: ${T.accent}; }
        .kn-voqea-qator { display: flex; justify-content: center; }
        .kn-voqea-qator.ikki { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 18px; align-items: center; }
        .kn-voqea-qator.ikki .fb-maydon { min-height: 0; padding: 26px 10px 34px; }
        .fb-sahna { display: flex; justify-content: center; padding: 4px; }
        .fb-oyna { width: min(540px, 100%); background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px -16px rgba(${T.shadowBase},0.35); }
        .fb-h { padding: 8px 14px; border-bottom: 1px solid ${T.line}; font-size: 18px; }
        .fb-maydon { position: relative; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px; padding: 30px 18px 38px; min-height: 220px; }
        .fb-doira { position: relative; width: 132px; height: 132px; flex: none; border-radius: 50%; border: 2px dashed ${fon(T.ink, 0.3)}; background: ${T.bg}; display: flex; align-items: center; justify-content: center; transition: background .8s, border-color .8s; }
        .fb-doira.yashil { border: 2px solid ${T.ok}; background: ${T.okFon}; }
        .fb-odamlar { display: flex; flex-wrap: wrap; justify-content: center; gap: 2px 4px; width: 88px; }
        .fb-odam { width: 24px; height: 30px; filter: grayscale(1) opacity(.5); }
        .fb-doira.yon .fb-odam { filter: none; animation: kn-yon .5s ease-out calc(.2s + var(--i) * .18s) both; }
        .fb-qulf { position: absolute; top: 4px; right: 8px; width: 26px; height: 26px; border-radius: 50%; background: ${T.paper}; border: 1.5px solid ${T.ink}; display: flex; align-items: center; justify-content: center; }
        .fb-qulf .kl-qulf { fill: ${T.ink}; stroke: ${T.ink}; }
        .fb-yorliq { position: absolute; bottom: -26px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 99px; padding: 2px 9px; }
        .fb-doira.yangi { width: 92px; height: 92px; animation: kn-rasm .5s ease-out .3s both; }
        .fb-maydon .fb-doira.yangi:nth-child(3) { animation-delay: .6s; } .fb-maydon .fb-doira.yangi:nth-child(4) { animation-delay: .9s; }
        .fb-doira.yangi .fb-odamlar { width: 56px; } .fb-doira.yangi .fb-odam { width: 20px; height: 25px; }
        .fb-katta { position: absolute; inset: 12px 8px 14px; border: 2.5px dashed ${T.accent}; border-radius: 120px; pointer-events: none; animation: kn-rasm .6s ease-out 1.4s both; }
        .fb-katta .fb-yorliq { top: -13px; bottom: auto; color: ${T.accent}; border-color: ${T.accent}; }
        .fb-doira.mini { width: 100px; height: 100px; } .fb-doira.mini .fb-odamlar { width: 66px; } .fb-doira.mini .fb-odam { width: 18px; height: 23px; }
        /* --- 11-ekran: kod --- */
        .kn-darvoza-q { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 8px 22px -14px rgba(${T.shadowBase},0.3); }
        .kn-darvoza-s { font-weight: 800; font-size: 15px; color: ${T.ink}; }
        .kn-darvoza-ro { display: flex; flex-wrap: wrap; gap: 8px; }
        ol.kn-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; transition: opacity .3s; }
        ol.kn-vazifa.xira { opacity: .5; }
        .kn-vazifa li { display: flex; gap: 8px; align-items: flex-start; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        .kn-vazifa li i { width: 22px; height: 22px; flex: none; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        .kn-vazifa li.ok i { background: ${T.ok}; color: #fff; }
        .kn-kyordam { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .kn-kodoyna { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .kn-mgap { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .kn-mgap img { width: 28px; height: 28px; border-radius: 50%; flex: none; }
        .kn-amal { display: flex; }
        pre.kn-kod { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; background: ${CODE.bg}; color: ${CODE.text}; padding: 12px 14px; border-radius: 12px; overflow-x: auto; white-space: pre; user-select: none; -webkit-user-select: none; }
        .kn-kod-iz { color: ${CODE.comment}; }
        .kn-kod-b { color: ${CODE.attr}; font-weight: 700; border-radius: 3px; transition: background .5s, color .5s; }
        .kn-kod.ajrat .kn-kod-b { background: ${fon(T.accent, 0.55)}; color: #fff; }
        ul.kn-kod-natija { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .kn-kod-natija li { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 8px; padding: 7px 10px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; overflow-wrap: anywhere; animation: kn-kir .4s ease-out calc(var(--i) * .12s) both; }
        .kn-kod-natija li b { font-family: 'Manrope', sans-serif; color: ${T.ink}; }
        /* --- 1-ekran: reja telefoni --- */
        .kn-reja { display: flex; justify-content: center; }
        .kn-rj { animation: kn-kir .45s ease-out var(--d, 0s) both; }
        .kn-rj-puf { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; margin-top: auto; }
        .kn-rj-puf .ct-puf { width: 80%; }
        /* --- Kartochkalar, uyga vazifa, yakun --- */
        .kn-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: kn-puls 1.8s ease-out .4s 3; }
        p.kn-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.kn-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: kn-nuqta 2.4s ease-in-out 3; }
        .kn-hw { display: flex; flex-direction: column; gap: 12px; }
        .kn-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .kn-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .kn-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .kn-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.kn-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .kn-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .kn-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .kn-hw-qadam li > div { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
        .kn-hw-qadam p { margin: 0; }
        .kn-hw-iz { font-size: 12.5px; color: ${T.ink2}; }
        .kn-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .kn-yakun { display: contents; }
        .kn-yakun.belgisiz .done-chip .tick { display: none; }
        @keyframes kn-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes kn-yashil { 0%, 45% { background-color: ${T.okFon}; } 100% { background-color: transparent; } }
        @keyframes kn-tush { from { opacity: 0; transform: translateY(-12px) scale(0.6); } to { opacity: 1; transform: none; } }
        @keyframes kn-pop { from { transform: scale(1.35); } to { transform: none; } }
        @keyframes kn-karta { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes kn-juft-kir { from { opacity: 0; transform: translateX(18px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes kn-silk { 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
        @keyframes kn-uch { to { transform: translate(var(--dx), var(--dy)) scale(0.92); opacity: 0.15; } }
        @keyframes kn-chiz-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes kn-yon { from { filter: grayscale(1) opacity(.5); transform: translateY(3px); } to { filter: none; transform: none; } }
        @keyframes kn-rasm { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: none; } }
        @keyframes kn-nuqta { 0%, 100% { opacity: 1; } 50% { opacity: 0.65; } }
        @media (max-width: 760px) {
          .kn-split, .kn-split.kn-s6 { grid-template-columns: 1fr; }
          .kn-chap { max-width: none; }
          .kn-voqea-qator.ikki { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .kl-ichi { padding: 12px; gap: 10px; }
          .kn-fokus.kn-yon { flex-direction: column; }
          .kn-hw-karta { grid-template-columns: 1fr; }
          .fb-doira { width: 112px; height: 112px; } .fb-doira.yangi { width: 80px; height: 80px; }
          .fb-maydon { gap: 8px; padding: 30px 10px 38px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .kn-halqa, .kn-halqa-i, .kn-s0.kutish .q-variant, .q-bashorat .q-chip, .kn-chorla > *, .ct-sar, .ct-sar b, .ct-q.yangi, .ct-q-y, .ct-k.yangi, .ct-b.yangi, .ct-b-y, .ct-holat.ok,
          .kl-url-t, .kn-yol, .kn-yol-ch, .kn-umami-s.halqa, .kn-kq, .kn-atama, .kn-uch, .kn-karta, .kn-kirish, .kn-javoblar.silk, .kn-yorl.silk, .kn-royxat-n, .kn-bandlar li, .kn-band2.yangi,
          .kn-sherik li, .kn-voqea-h, .fb-doira.yon .fb-odam, .fb-doira.yangi, .fb-katta, .kn-kod-natija li, .kn-rj, .kn-flash.yangi .fc-card .fc-front, p.kn-fc-ipucha i { animation: none !important; }
          .fb-doira.yon .fb-odam { filter: none; }
          .ct-tel, .ct-q, .ct-puf, .ct-b, .fb-doira, .kn-kod-b, .kn-karta { transition: none !important; }
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
