import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 14-Modul (LMS) 10-dars «Birinchi buyurtmani qayerdan topasiz?» (PM, 2-tur, keyssiz) — MD feedback/F-1008-14modul/10-PmFreelance-v3.md (manba-haqiqat).
// Skeletdan (src/skelet/NamunaDars.jsx) qurildi: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skelet.
// 12 ekran: kirish → reja → uch yo'l → test → buyurtma rejasi → test → kompaniyaga xat → buyurtma va xatlar (mustaqil) → yakuniy test → podium → kartochkalar → yakun.
// Bitta vizual — IshVaraq (telefon · Yo'llar · Buyurtma · Xatlar). Saqlaydi: pm-m12d10-ish; o'qiydi: pm-m12d9-video (tayanch 8).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================

// D3// ============================================================

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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKartochka, QYakun, QMustaqil, QChip, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m12d10-v1', lessonTitle: { uz: "Birinchi buyurtmani qayerdan topasiz?", ru: 'Где найти первый заказ?' } }; // 14-Modul 10-dars (LMS), 2-to'lqin — MD feedback/F-1008-14modul/10-PmFreelance-v3.md
// 12 ekran (MD v3, tayanch 4 — keyssiz PM shakli).
const HW_TOKENS = [
  { t: { uz: 'reja', ru: 'план' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'xat', ru: 'письмо' }, l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'buyurtma', ru: 'заказ' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'kompaniya', ru: 'компания' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',        type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',        type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'yollar',    type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',        type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'buyurtma',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',        type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'xat',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'practice',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',        type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',    type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash',    type: 'flashcards',  template: 'custom',   scored: false, scope: null },
  { id: 's11',       type: 'summary',     template: 'custom',   scored: false, scope: null }
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
const NavNext = ({ disabled, label, onClick, optionalLive, halqa }) => {
  const lbl = tr(label) || tr({ uz: 'Davom etish', ru: 'Продолжить' });
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className={`btn-white-accent${halqa && !disabled && !locked ? ' fr-halqa' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). -1 — sentinel (variant yo'q; 7-ekran signali 'practice').
// MD KOD 10 dagi yollar/buyurtma/xat: -1 olindi — ballsiz ekranlar submitAnswer'ga uzatilmaydi, lint:jsx «o'lik kalit» deydi (pilot 01 naqshi).
const INLINE_KEYS = { s3: 2, s5: 0, s8: 3, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI; PM darsida emoji o'rniga raqam — S-026).
const RECAPS = {
  3: {
    title: { uz: 'Xalqaro saytda avval nima', ru: 'Что сначала на международном сайте' },
    cards: [
      { ic: '1', h: { uz: 'Upwork kabi xalqaro saytlarda yosh sharti bor.', ru: 'На международных сайтах вроде Upwork есть возрастное условие.' } },
      { ic: '2', h: { uz: "Shart ota-ona bilan saytning o'zidan o'qiladi.", ru: 'Условие читают на самом сайте вместе с родителями.' } },
      { ic: '3', h: { uz: 'Boshqa odam nomidan profil ochilmaydi — bu kurs qoidasi.', ru: 'Профиль от чужого имени не открывают — это правило курса.' }, ask: { uz: "Saytning shartini qayerdan o'qiysiz?", ru: 'Где вы прочитаете условие сайта?' } }
    ]
  },
  5: {
    title: { uz: 'Buyurtma rejasi', ru: 'План заказа' },
    cards: [
      { ic: '1', h: { uz: 'Kim — tanish doiradan, rol bilan, ismsiz.', ru: 'Кто — из круга знакомых, ролью, без имени.' } },
      { ic: '2', h: { uz: "Nima — kursda qurganingizga o'xshash ish.", ru: 'Что — работа, похожая на то, что вы строили на курсе.' } },
      { ic: '3', h: { uz: 'Qachon — gaplashish payti; pul va kelishuv — ota-ona orqali.', ru: 'Когда — момент разговора; деньги и договорённость — через родителей.' }, ask: { uz: 'Rejangizning qaysi qatori hali aniq emas?', ru: 'Какая строка вашего плана ещё не точная?' } }
    ]
  },
  8: {
    title: { uz: 'Javob kelmasa', ru: 'Если ответа нет' },
    cards: [
      { ic: '1', h: { uz: 'Har kompaniyaga alohida xat, bir marta.', ru: 'Каждой компании — отдельное письмо, один раз.' } },
      { ic: '2', h: { uz: "Bu kursda javob kelmasa yoki «yo'q» desa — qayta yozilmaydi.", ru: 'На этом курсе, если ответа нет или ответили «нет», — повторно не пишут.' } },
      { ic: '3', h: { uz: 'Uchrashuv taklifi kelsa — faqat kattalar bilan.', ru: 'Если предложат встретиться — только со взрослыми.' }, ask: { uz: 'Javob kelmasa, keyin nima qilasiz?', ru: 'Если ответа нет, что сделаете дальше?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="fr-test-viz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — IshVaraq: chapda telefon (JamoaTelefon) · o'ngda varaq «Buyurtma va xatlar» (Yo'llar · Buyurtma · Xatlar) =====
// Bitta manba: MENTOR_ISH · MENTOR_XAT · SOROV_GAP · XAVF_QATOR + o'quvchi ma'lumoti (pm-m12d10-ish, pm-m12d9-video).
// Odamlar — rol belgisi (doiracha) va rol yorlig'i, ismsiz; odam figurasi chizilmaydi (SABOQ P1). Rangli yon chiziq yo'q; reduced-motion — CSS va kamHarakat().
// Uchish (SABOQ P3): o'lchab, position: fixed nusxa (portal), ~0,65 s — qayerga borgani ko'rinadi.
// qolip-maket: fr-tahrir fr-sorov-b fr-kl-q
const cxx = (...a) => a.filter(Boolean).join(' ');
const NB = ' ';
const MJ_RANG = '#2E9E4F'; // «Maydon Jamoa» — 11-Modul 9.62 yashili (9–13-Modul darslari bilan bir), logotipsiz
const UPWORK_RANG = T.ink; // TAYANCHGA SAVOL 9 (qur): rasmiy brend rangi «qur»da tekshirilmagan — neytral ink
const MJ = () => <span className="fr-mj">Maydon Jamoa</span>;
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;

const ISH_KEY = 'pm-m12d10-ish';
const VIDEO_KEY = 'pm-m12d9-video';
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };

const SCREEN_INTENTS = [
  'kirish: birinchi buyurtma qayerdan — uch yo\'l', 'reja: buyurtma rejasi va ikki xat', 'uch yo\'l: xalqaro sayt (yosh sharti), tanish doira (frilans), kompaniya (stajirovka)',
  'test: xalqaro saytda avval nima', 'buyurtma rejasi: kim, nima, qachon; pul va kelishuv — ota-ona orqali', 'test: kurs qoidasiga mos reja',
  'kompaniyaga xat: kimman, nima qurdim, nima so\'rayman; bitta kompaniyaga bitta', 'o\'z rejasi va ikki xat: pm-m12d10-ish', 'yakuniy test: javob kelmasa',
  'podium', 'kartochkalar', 'yakun: 5 holat'
];

// --- Mentor misoli — bitta manba (A-6) ---
const QISM_NOM = { yollar: { uz: "Yo'llar", ru: 'Пути' }, buyurtma: { uz: 'Buyurtma', ru: 'Заказ' }, xatlar: { uz: 'Xatlar', ru: 'Письма' } };
const YOL_ID = ['xalqaro', 'tanish', 'kompaniya'];
const YOL_NOM = { xalqaro: { uz: 'Xalqaro sayt', ru: 'Международный сайт' }, tanish: { uz: 'Tanish doira', ru: 'Круг знакомых' }, kompaniya: { uz: 'Kompaniya', ru: 'Компания' } };
const MENTOR_ISH = {
  yollar: [
    { id: 'xalqaro', qator: { uz: 'Upwork kabi', ru: 'как Upwork' }, holat: { uz: 'uyda, ota-ona bilan', ru: 'дома, с родителями' }, bugun: false },
    { id: 'tanish', qator: { uz: "tanish do'kon · maktab · to'garak", ru: 'знакомый магазин · школа · кружок' }, holat: { uz: 'bugun: buyurtma rejasi', ru: 'сегодня: план заказа' }, bugun: true },
    { id: 'kompaniya', qator: { uz: 'stajirovka yoki maslahat', ru: 'стажировка или совет' }, holat: { uz: 'bugun: ikki xat', ru: 'сегодня: два письма' }, bugun: true }
  ],
  buyurtma: {
    kim: { uz: "maktabdagi futbol to'garagining murabbiyi", ru: 'тренер школьного футбольного кружка' },
    nima: { uz: "to'garak uchun lending: mashg'ulot kunlari va yozilish tartibi", ru: 'лендинг для кружка: дни занятий и порядок записи' },
    qachon: { uz: "keyingi mashg'ulotdan keyin — ota-onam bilan", ru: 'после следующего занятия — с родителями' }
  },
  xatlar: [
    { kompaniyaTuri: { uz: 'mobil ilova qiladigan kompaniya', ru: 'компания, которая делает мобильные приложения' }, soroq: 'stajirovka' },
    { kompaniyaTuri: { uz: 'sayt qiladigan kompaniya', ru: 'компания, которая делает сайты' }, soroq: 'maslahat' }
  ]
};
const MENTOR_XAT = {
  salom: { uz: 'Assalomu alaykum!', ru: 'Здравствуйте!' },
  kimman: { uz: "Men maktab o'quvchisiman, dasturlashni o'rganyapman.", ru: 'Я школьник, изучаю программирование.' },
  nimaQurdim: { uz: "Agent bilan \"Maydon Jamoa\" ilovasini qurdim: unda mahalladagi mini-futbolga o'yinchi yig'iladi. Hozir 51 foydalanuvchi bor.", ru: 'С агентом я построил приложение «Maydon Jamoa»: в нём собирают игроков на мини-футбол в махалле. Сейчас в нём 51 пользователь.' },
  oxiri: { uz: 'Hurmat bilan,', ru: 'С уважением,' }
};
const SOROV_ID = ['stajirovka', 'maslahat'];
const SOROV_NOM = { stajirovka: { uz: 'Stajirovka', ru: 'Стажировка' }, maslahat: { uz: 'Maslahat', ru: 'Совет' } };
const SOROV_GAP = {
  stajirovka: { uz: "Kompaniyangizda o'quvchilar uchun stajirovka bormi? Bo'lsa, qanday qatnashsam bo'ladi?", ru: 'Есть ли в вашей компании стажировка для школьников? Если есть, как мне в ней поучаствовать?' },
  maslahat: { uz: "Mahsulotimni ko'rib, bitta maslahat bera olasizmi: keyin nimani o'rganishim kerak?", ru: 'Можете посмотреть мой продукт и дать один совет: что мне изучать дальше?' }
};
const XAVF_QATOR = { uz: 'Uchrashuv taklifi kelsa — faqat kattalar bilan.', ru: 'Если предложат встретиться — только со взрослыми.' }; // 12-Modul XAVFSIZLIK ostidagi qator (src/10-Modull) — aynan
const PUL_QATOR = { uz: 'Pul va kelishuv — ota-ona orqali.', ru: 'Деньги и договорённость — через родителей.' };
const YUBORISH = { uz: 'yuborish — uyda', ru: 'отправка — дома' };
const ISM_UYDA = { uz: 'ism — xohlasangiz, uyda', ru: 'имя — по желанию, дома' };
const BUY_ID = ['kim', 'nima', 'qachon'];
const BUY_NOM = { kim: { uz: 'Kim', ru: 'Кто' }, nima: { uz: 'Nima', ru: 'Что' }, qachon: { uz: 'Qachon', ru: 'Когда' } };
const XAT_QISM = { kimman: { uz: 'Kimman', ru: 'Кто я' }, nimaQurdim: { uz: 'Nima qurdim', ru: 'Что я построил' }, soroq: { uz: "Nima so'rayman", ru: 'О чём прошу' } };
const XQ_ID = ['kimman', 'nimaQurdim', 'soroq'];
const mentorXatSatr = (i) => [tr(MENTOR_XAT.kimman), tr(MENTOR_XAT.nimaQurdim), tr(SOROV_GAP[MENTOR_ISH.xatlar[i].soroq])];

// --- Matn tekshiruvi (7-ekran): ikki tilli; apostrof shakllari normT bilan bir xil ---
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normT = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const HARF = "a-z'а-яёўқғҳ";
const soz = (r) => new RegExp('(^|[^' + HARF + '])(' + r + ')(?![' + HARF + '])');
const AKK_RE = /@|t\.me\/|\+998/;
const RAQAM_RE = /\d{7,}|(?:\d[\s-]?){9,}/;
const HAVOLA_RE = /https?:|www\.|\.uz\b|\.com\b/;
const XALQARO_RE = soz("upwork\\S*|xalqaro\\S*|notanish\\S*|международн\\S*|незнаком\\S*");
const PUL_REJA_RE = soz("pul|pulga|puli|pulni|puldan|pulim|so'm\\S*|dollar\\S*|narx\\S*|деньг\\S*|денег|сум|сумм\\S*|доллар\\S*|цен[аыуе]|ценой|стоимост\\S*");
const PUL_XAT_RE = soz("pul|pulga|puli|pulni|puldan|so'm\\S*|dollar\\S*|maosh\\S*|investitsiya\\S*|деньг\\S*|денег|сум|сумм\\S*|доллар\\S*|зарплат\\S*|инвестиц\\S*");
const NOANIQ_RE = soz("qachondir|bir kun|keyinroq|bilmayman|когда-нибудь|когда-то|потом|не знаю");
const SHOSHIL_RE = soz("tezroq|darhol|zudlik\\S*|javob bering\\S*|срочно|быстрее|немедленно|ответьте");
const FUNKSIYA_RE = /funksiya|функци/;
// bloklaydi: bo'sh · telefon/akkaunt/havola; yo'naltiradi (ikkinchi «Saqlash» bilan o'tadi): qolganlari
const tekshirBuy = (id, matn) => {
  const n = normT(matn);
  if (!n) return { x: 'bosh', blok: true };
  if (AKK_RE.test(n) || HAVOLA_RE.test(n)) return { x: id === 'nima' ? 'akkNima' : 'akk', blok: true };
  if (RAQAM_RE.test(n)) return { x: 'raqam' };
  if (id === 'kim' && XALQARO_RE.test(n)) return { x: 'xalqaro' };
  if (id !== 'kim' && PUL_REJA_RE.test(n)) return { x: 'pul' };
  if (id === 'qachon' && NOANIQ_RE.test(n)) return { x: 'noaniq' };
  return null;
};
const bir = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const xatMatn = (x) => [tr(MENTOR_XAT.salom), bir(x.kimman), bir(x.nimaQurdim), bir(x.soroqGap), tr(MENTOR_XAT.oxiri)].join('\n');
const xatAjrat = (matn) => { const q = String(matn || '').split('\n'); return { kimman: q[1] || '', nimaQurdim: q[2] || '', soroqGap: q[3] || '' }; };
const tekshirXat = (x, oldingiTur) => {
  const tur = normT(x.tur), a = normT(x.kimman), b = normT(x.nimaQurdim), c = normT(x.soroqGap);
  if (!tur) return { x: 'turBosh', blok: true };
  if (!a || !b || !c || !x.soroq) return { x: 'uchQism', blok: true };
  const hamma = [tur, a, b, c].join(' ');
  if (AKK_RE.test(hamma)) return { x: 'akk', blok: true };
  if (HAVOLA_RE.test(hamma)) return { x: 'havola', blok: true };
  if (xatMatn(x).length > 420) return { x: 'uzun', blok: true };
  if (RAQAM_RE.test(hamma)) return { x: 'raqam' };
  if (PUL_XAT_RE.test(hamma)) return { x: 'pul' };
  if (SHOSHIL_RE.test(hamma)) return { x: 'shoshil' };
  if (FUNKSIYA_RE.test(b)) return { x: 'funksiya' };
  if (oldingiTur && normT(oldingiTur) === tur) return { x: 'birXil' };
  return null;
};

// --- Saqlash (tayanch 8): pm-m12d10-ish = { buyurtma: { kim, nima, qachon }, xatlar: [{ kompaniyaTuri, soroq, matn }], savedAt } ---
const ishOl = () => {
  const v = lsO(ISH_KEY) || {}; const b = v.buyurtma && typeof v.buyurtma === 'object' ? v.buyurtma : {};
  const s = (x) => (typeof x === 'string' && x.trim() ? x : null);
  return { buyurtma: { kim: s(b.kim), nima: s(b.nima), qachon: s(b.qachon) }, xatlar: Array.isArray(v.xatlar) ? v.xatlar.filter(x => x && typeof x === 'object').slice(0, 2) : [] };
};
const ishYoz = (patch) => {
  const v = ishOl();
  const d = { buyurtma: { ...v.buyurtma, ...(patch.buyurtma || {}) }, xatlar: patch.xatlar || v.xatlar, savedAt: Date.now() };
  lsY(ISH_KEY, d); return d;
};
const rejaSoni = (b) => BUY_ID.filter(k => b && typeof b[k] === 'string' && b[k].trim()).length;
// 9-dars (tayanch 8): bolaklar.kimman, bolaklar.nimaQurdim; havola eslatmasi — bor === true va tekshiruv uchalasi true
const videoOl = () => {
  const v = lsO(VIDEO_KEY) || {}; const b = v.bolaklar && typeof v.bolaklar === 'object' ? v.bolaklar : {}; const t = v.tekshiruv && typeof v.tekshiruv === 'object' ? v.tekshiruv : {};
  const s = (x) => (typeof x === 'string' ? bir(x) : '');
  return { kimman: s(b.kimman), nimaQurdim: s(b.nimaQurdim), otdi: v.bor === true && t.ovozBor === true && t.maxfiyNarsaYoq === true && t.sigdi === true };
};

// --- Yordamchi ilgaklar ---
const kamHarakat = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useIpucha = (faol, kalit) => {
  const [k, setK] = useState(false);
  useEffect(() => { setK(false); if (!faol) return undefined; const t = setTimeout(() => setK(true), 40000); return () => clearTimeout(t); }, [faol, kalit]);
  return faol && k;
};
// Uchish: a elementdan b elementga nusxa uchadi (fixed, portal), so'ng keyin() — maqsad to'ladi
const useUchar = () => {
  const [u, setU] = useState(null);
  const tRef = useRef([]);
  useEffect(() => () => tRef.current.forEach(clearTimeout), []);
  const uchir = useCallback((a, b, ichi, keyin, tur) => {
    if (kamHarakat() || !a || !b) { if (keyin) keyin(); return; }
    const r = a.getBoundingClientRect(), t = b.getBoundingClientRect();
    if (!r.width || !t.width) { if (keyin) keyin(); return; }
    const s = Math.max(0.28, Math.min(1, Math.min(t.width / r.width, (t.height * 1.4) / r.height)));
    setU({ x: r.left, y: r.top, w: r.width, h: r.height, dx: t.left + t.width / 2 - (r.left + r.width / 2), dy: t.top + t.height / 2 - (r.top + r.height / 2), s, bor: false, ichi, tur });
    requestAnimationFrame(() => requestAnimationFrame(() => setU(v => (v ? { ...v, bor: true } : v))));
    tRef.current.push(setTimeout(() => { setU(null); if (keyin) keyin(); }, 700));
  }, []);
  const el = u && typeof document !== 'undefined' ? createPortal(<div className={cxx('fr-uchar', u.tur)} aria-hidden="true" style={{ left: u.x, top: u.y, width: u.w, height: u.h, transform: u.bor ? 'translate(' + u.dx + 'px, ' + u.dy + 'px) scale(' + u.s + ')' : 'none' }}>{u.ichi}</div>, document.body) : null;
  return [el, uchir];
};
// Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42)
const XulosaQ = ({ taxmin, matn, izoh }) => (<>
  {taxmin}
  <span className="fr-xq-m">{matn}</span>
  {izoh && <span className="fr-xq-i">{izoh}</span>}
</>);
const TaxminQ = ({ togri, aslida }) => (togri
  ? <span className="fr-xq-t">{tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение верно ✓' })}</span>
  : <span className="fr-xq-t xato">{tr({ uz: 'Taxminingiz ✕ — aslida:', ru: 'Ваше предположение ✕ — на деле:' })} {aslida}</span>);

// --- Belgilar (SVG; logotip emas) ---
const Svg = ({ children }) => <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
const Qulf = () => <Svg><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></Svg>;
const Dokon = () => <Svg><path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12v8h13v-8M10 20v-5h4v5" /></Svg>;
const Maktab = () => <Svg><path d="M3 10 12 5l9 5-9 5-9-5Z" /><path d="M7 12.2V17c2.8 2 7.2 2 10 0v-4.8" /></Svg>;
const Koptok = () => <Svg><circle cx="12" cy="12" r="8.5" /><path d="m12 7.5 3.6 2.6-1.4 4.2H9.8l-1.4-4.2L12 7.5ZM12 3.5v4M20.2 9.8l-4.6.3M17 19l-2.8-4.7M7 19l2.8-4.7M3.8 9.8l4.6.3" /></Svg>;
const Uy = () => <Svg><path d="M4 11 12 4.5 20 11M6 9.5V20h12V9.5M10 20v-5h4v5" /></Svg>;
const Bino = () => <Svg><path d="M5 21V4.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V21M15 9h3a1 1 0 0 1 1 1v11M3 21h18M8.5 7.5h1M11 7.5h1M8.5 11h1M11 11h1M8.5 14.5h1M11 14.5h1M9.5 21v-3h1.5v3" /></Svg>;
const KonvBelgi = () => <Svg><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></Svg>;

// --- Telefon: «Maydon Jamoa» — «O'yin» ekrani (≈170×272, o'lchami barqaror) ---
const JamoaTelefon = ({ ketdi }) => (
  <div className={cxx('fr-tel', ketdi && 'ketdi')}>
    <div className="fr-tel-ekran">
      <span className="fr-tel-nom"><MJ /></span>
      <span className="fr-tel-y">{tr({ uz: "O'yin", ru: 'Игра' })}</span>
      <b className="fr-tel-vaqt">{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
      <span className="fr-tel-joy">{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span>
      <b className="fr-tel-son">8{NB}/{NB}10</b>
      <span className="fr-tel-doira">{Array.from({ length: 10 }).map((_, i) => <i key={i} className={i < 8 ? 'bor' : ''} />)}</span>
      <span className="fr-tel-tugma">{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
    </div>
  </div>
);
// Kichik lending kartasi (4-ekran: telefon ostida; uchgach sarlavha «Futbol to'garagi»)
const LendingKarta = ({ togarak, refEl, className }) => (
  <div ref={refEl} className={cxx('fr-lend', className)}>
    <span className="fr-lend-bar"><i /><i /><i /></span>
    <b className="fr-lend-h" key={togarak ? 't' : 'm'}>{togarak ? tr({ uz: "Futbol to'garagi", ru: 'Футбольный кружок' }) : <MJ />}</b>
    <span className="fr-lend-q" /><span className="fr-lend-q q2" />
    <span className="fr-lend-t" />
  </div>
);
// Kichik brauzer: «upwork.com» · «Upwork» (logotipsiz) · qulf va «yosh sharti»
const BrauzerMini = ({ qulf, ixcham }) => (
  <div className={cxx('fr-br', ixcham && 'ix')}>
    <div className="fr-br-bar"><i /><i /><i /><span className="fr-br-url">upwork.com</span></div>
    <div className="fr-br-ich">
      <b className="fr-br-nom" style={{ color: UPWORK_RANG }}>Upwork</b>
      <span className="fr-br-q" /><span className="fr-br-q q2" />
      {qulf && <span className="fr-qulf"><Qulf />{tr({ uz: 'yosh sharti', ru: 'возрастное условие' })}</span>}
    </div>
  </div>
);
// Rol belgisi — doiracha + yorliq (ismsiz; odam figurasi emas — SABOQ P1)
const TANISH_ROL = [
  { id: 'dokon', B: Dokon, t: { uz: "tanish do'kon", ru: 'знакомый магазин' } },
  { id: 'maktab', B: Maktab, t: { uz: 'maktab', ru: 'школа' } },
  { id: 'togarak', B: Koptok, t: { uz: "to'garak", ru: 'кружок' } }
];
const Rol = ({ B, t, i = 0, refEl, belgi, sayt, katta }) => (
  <span className={cxx('fr-rol', katta && 'katta')} style={{ animationDelay: (i * 0.14) + 's' }}>
    <i ref={refEl} className="fr-rol-b"><B />{sayt && <em className="fr-rol-sayt" aria-hidden="true" />}</i>
    <span className="fr-rol-o">{belgi && <small>{belgi}</small>}<b>{t}</b></span>
  </span>
);

// --- Varaq bo'limlari ---
const Bolim = ({ id, joriy, toliq, children }) => (
  <div className={cxx('fr-bolim', joriy ? 'joriy' : toliq ? 'toliq' : 'ix')}>
    <span className="fr-bolim-h">{tr(QISM_NOM[id])}</span>
    <div className="fr-bolim-i">{children}</div>
  </div>
);
const IshVaraq = ({ rejim = 'mentor', telefon = true, telRef, telKetdi, telOsti, qism, toliq = [], yollar, buyurtma, xatlar, ostida, className }) => (
  <div className={cxx('fr-sahna', !telefon && 'tel-yoq', className)}>
    {telefon && <div className="fr-sahna-tel"><div ref={telRef}><JamoaTelefon ketdi={telKetdi} /></div>{telOsti}</div>}
    <div className="fr-varaq">
      <div className="fr-varaq-h">{tr(rejim === 'mentor' ? { uz: 'Mentor misoli · Buyurtma va xatlar', ru: 'Пример Ментора · Заказ и письма' } : { uz: 'Buyurtma va xatlarim', ru: 'Мой заказ и письма' })}</div>
      {yollar && <Bolim id="yollar" joriy={qism === 'yollar'} toliq={toliq.includes('yollar')}>{yollar}</Bolim>}
      {buyurtma && <Bolim id="buyurtma" joriy={qism === 'buyurtma'} toliq={toliq.includes('buyurtma')}>{buyurtma}</Bolim>}
      {xatlar && <Bolim id="xatlar" joriy={qism === 'xatlar'} toliq={toliq.includes('xatlar')}>{xatlar}</Bolim>}
      {ostida}
    </div>
  </div>
);
// Ixcham qatorlar (joriy bo'lmagan qism — kulrang)
const YollarIx = ({ ajrat = [] }) => <span className="fr-ix">{YOL_ID.map(id => <em key={id} className={cxx(ajrat.includes(id) && 'on')}>{tr(YOL_NOM[id])}</em>)}</span>;
const BuyurtmaIx = ({ b = {} }) => <span className="fr-ix">{BUY_ID.map(id => <em key={id} className={cxx(b[id] && 'ok')}>{b[id] ? '✓ ' : ''}{tr(BUY_NOM[id])}</em>)}</span>;
const XatlarIx = ({ n = 0 }) => <span className="fr-ix">{[0, 1].map(i => <em key={i} className={cxx(i < n && 'ok')}>{i < n ? '✓ ' : ''}{i + 1}-{tr({ uz: 'xat', ru: 'письмо' })}</em>)}</span>;
// Yo'l kartasi (2-ekran): yopiq — nomsiz uzuq karta; ochiq — belgisi, qatori va holati
const YolKarta = ({ id, ochiq, refs, sayt }) => {
  const y = MENTOR_ISH.yollar.find(v => v.id === id);
  if (!ochiq) return <div className="fr-yol bosh" />;
  return (
    <div className={cxx('fr-yol', y.bugun && 'bugun')}>
      <div className="fr-yol-ust"><b className="fr-yol-nom">{tr(YOL_NOM[id])}</b><em className={cxx('fr-yol-holat', y.bugun && 'acc')}>{tr(y.holat)}</em></div>
      {id === 'xalqaro' && <BrauzerMini qulf />}
      {id === 'tanish' && <div className="fr-rollar">{TANISH_ROL.map((r, i) => <Rol key={r.id} B={r.B} t={tr(r.t)} i={i} sayt={r.id === 'togarak' && sayt} refEl={r.id === 'togarak' && refs ? (el => { refs.togarak = el; }) : undefined} />)}</div>}
      {id === 'kompaniya' && <div className="fr-bq"><span ref={refs ? (el => { refs.bino = el; }) : undefined} className="fr-bino"><Bino /></span><span className="fr-yol-q">{tr(y.qator)}</span></div>}
    </div>
  );
};
// Buyurtma kataklari
const BuyKatak = ({ id, matn, holat, yon, refEl, tahrir }) => (
  <div ref={refEl} className={cxx('fr-katak', holat || (matn ? 'bor' : 'bosh'))}>
    <b className="fr-katak-n">{tr(BUY_NOM[id])}</b>
    {matn ? <span className="fr-katak-m" key={matn}>{matn}</span> : <span className="fr-katak-b" />}
    {yon}
    {tahrir && <button type="button" className="fr-tahrir" onClick={tahrir} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
  </div>
);
const BuyurtmaTo = ({ q = {}, holat = {}, yon = {}, refs, ajrat, tahrir }) => (
  <div className="fr-buy">
    {BUY_ID.map(id => <BuyKatak key={id} id={id} matn={q[id]} holat={holat[id]} yon={yon[id]} refEl={refs ? (el => { refs[id] = el; }) : undefined} tahrir={tahrir ? () => tahrir(id) : undefined} />)}
    <p className={cxx('fr-pul', ajrat && 'ajrat')}>{tr(PUL_QATOR)}</p>
  </div>
);
// Konvert-karta: bosh (uzuq, faqat nom) · ochiq (salom, uch qator, «Hurmat bilan,») · yopiq (belgi, «yuborish — uyda», qisqa matn) · kulrang
const Konvert = ({ n, tur, soroq, satrlar = [], holat = 'ochiq', osti = [], yorliq, refEl, tahrir, yangi, className, yIchida }) => {
  const sarl = <span className="fr-konv-h"><KonvBelgi /><b>{n}-{tr({ uz: 'xat', ru: 'письмо' })}</b>{tur && <span>· {tur}</span>}{soroq && <span>· {tr(SOROV_NOM[soroq]).toLowerCase()}</span>}
    {yIchida && <em className="fr-konv-y">{yorliq || tr(YUBORISH)}</em>}
    {tahrir && <button type="button" className="fr-tahrir" onClick={tahrir} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}</span>;
  if (holat === 'bosh') return <div ref={refEl} className={cxx('fr-konv bosh', className)}>{sarl}</div>;
  if (holat === 'yopiq' || holat === 'kulrang') return (
    <div ref={refEl} className={cxx('fr-konv yopiq', holat === 'kulrang' && 'kulrang', yangi && 'yangi', className)}>
      {sarl}
      {satrlar.filter(Boolean).length > 0 && <span className="fr-konv-qisqa">{satrlar.filter(Boolean).join(' ')}</span>}
      {!yIchida && <em className="fr-konv-y">{yorliq || tr(YUBORISH)}</em>}
    </div>
  );
  return (
    <div ref={refEl} className={cxx('fr-konv ochiq', yangi && 'yangi', className)}>
      {sarl}
      <span className="fr-xat-s">{tr(MENTOR_XAT.salom)}</span>
      {[0, 1, 2].map(i => (
        <div key={i} className="fr-xat-q">
          {satrlar[i] ? <span className="fr-xat-m" key={satrlar[i]}>{satrlar[i]}</span> : <span className="fr-xat-b"><small>{tr(XAT_QISM[XQ_ID[i]])}</small></span>}
          {osti[i]}
        </div>
      ))}
      <span className="fr-xat-o">{tr(MENTOR_XAT.oxiri)} <em>{tr(ISM_UYDA)}</em></span>
    </div>
  );
};
// Bosqich tugmalari (ixcham, bir qatorda; joriysi halqada, bosilgani ✓)
const Tugmalar3 = ({ nomlar, q, faol, onBos }) => (
  <div className="fr-qadamlar">
    {nomlar.map((n, i) => (
      <QChip key={i} holat={i < q ? 'ok' : i === q && faol ? 'on' : undefined} className={cxx(i === q && faol && 'fr-joriy')} disabled={!faol || i !== q} onClick={onBos}>
        <i>{i < q ? '✓' : i + 1}</i>{tr(n)}
      </QChip>
    ))}
  </div>
);
const IPUCHA = (t) => <p className="fr-ipucha fade-step">{t}</p>;
const ixchamBashorat = (taxmin, el) => <div className={cxx('fr-bash', taxmin && 'ix')}>{el}</div>;
const tugmaYorliq = (taxmin, q, done) => (done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: 'Tugmalarni bosing (' + q + '/3)', ru: 'Нажмите кнопки (' + q + '/3)' }));

// ===== SCREEN 0 — KIRISH (QKirish; sof so'rovnoma — J-026: correct false hammaga; javob «Aynan!» / «Qiziq fikr!» — T-028, T-067) =====
const HOOK_OPTS = [
  { id: 'xalqaro', t: { uz: "Xalqaro saytda, masalan Upwork'da", ru: 'На международном сайте, например на Upwork' } },
  { id: 'tanish', t: { uz: "Tanish do'kon yoki to'garakdan", ru: 'Через знакомый магазин или кружок' } },
  { id: 'kompaniya', t: { uz: 'Biror kompaniyaga xat yozib', ru: 'Написав письмо в какую-нибудь компанию' } }
];
const HOOK_JAVOB = {
  xalqaro: { uz: <><b>Qiziq fikr!</b> Bunday saytlarda yosh sharti bor — uni hozir birga ko'ramiz.</>, ru: <><b>Интересная мысль!</b> На таких сайтах есть возрастное условие — сейчас разберём его вместе.</> },
  tanish: { uz: <><b>Aynan!</b> Sizni va ota-onangizni taniydigan odam ishingizni ko'ra oladi — bugun shu yo'lga reja yozasiz.</>, ru: <><b>Именно!</b> Человек, который знает вас и ваших родителей, может увидеть вашу работу — сегодня напишете план для этого пути.</> },
  kompaniya: { uz: <><b>Qiziq fikr!</b> Kompaniyaga ham yozish mumkin — bugun bunday xatni ham tayyorlaysiz.</>, ru: <><b>Интересная мысль!</b> Компании тоже можно написать — сегодня подготовите и такое письмо.</> }
};
const YolBelgi = ({ id }) => (id === 'xalqaro' ? <span className="fr-kl-br"><i /><i /><i /></span>
  : id === 'tanish' ? <span className="fr-kl-dr"><i /><i /><i /></span>
    : <span className="fr-kl-bino"><Bino /></span>);
const KirishYollar = ({ tanlov }) => (
  <div className="fr-kl">
    <div className="fr-kl-tel"><span className="fr-sahna-y">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</span><JamoaTelefon /></div>
    <div className="fr-kl-yollar">
      {YOL_ID.map((id, i) => (
        <div key={id} className={cxx('fr-kl-q', tanlov === id && 'on')} style={{ animationDelay: (0.2 + i * 0.15) + 's' }}>
          <span className="fr-kl-chiziq"><i /></span>
          <span className="fr-kl-uch">{tanlov === id && <YolBelgi id={id} />}</span>
        </div>
      ))}
    </div>
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive halqa={picked !== null} disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('fr-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Birinchi buyurtmani <A>qayerdan topasiz?</A></>, ru: <>Где найти <A>первый заказ?</A></> })}
          mentor={<Mentor>{tr({ uz: "Kursda sayt, bot va o'z mahsulotingizni qurdingiz — shunday ishni boshqa odamga ham qilib berish mumkin.", ru: 'На курсе вы построили сайт, бота и свой продукт — такую работу можно сделать и для другого человека.' })}</Mentor>}
          maket={<KirishYollar tanlov={picked} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; varaq skeleti o'zi yoziladi, tugagach «Boshlaymiz» halqada) =====
const REJA = [
  { t: { uz: 'Birinchi buyurtma qayerdan chiqishi mumkinligini bilib olasiz', ru: 'Узнаете, откуда может прийти первый заказ' }, teg: { uz: "uch yo'l", ru: 'три пути' } },
  { t: { uz: "Buyurtma rejasini tuzishni o'rganasiz", ru: 'Научитесь составлять план заказа' }, teg: { uz: 'kim · nima · qachon', ru: 'кто · что · когда' } },
  { t: { uz: "Kompaniyaga hurmatli xat yozishni o'rganasiz", ru: 'Научитесь писать вежливое письмо в компанию' }, teg: { uz: 'xat', ru: 'письмо' } },
  { t: { uz: "O'zingiz uchun reja va ikki xat yozasiz", ru: 'Напишете план и два письма для себя' }, teg: { uz: 'buyurtma va xatlar', ru: 'заказ и письма' } }
];
const RejaSkelet = () => (
  <div className="fr-sahna fr-skelet">
    <div className="fr-sahna-tel"><JamoaTelefon /></div>
    <div className="fr-varaq">
      <div className="fr-varaq-h">{tr({ uz: 'Buyurtma va xatlar', ru: 'Заказ и письма' })}</div>
      {['yollar', 'buyurtma', 'xatlar'].map((id, i) => (
        <div key={id} className={cxx('fr-sk-q', id)} style={{ animationDelay: (0.5 + i * 0.8) + 's' }}>
          <b>{tr(QISM_NOM[id])}</b>
          <span className="fr-sk-uyalar">{Array.from({ length: id === 'xatlar' ? 2 : 3 }).map((_, k) => <i key={k} style={{ animationDelay: (0.8 + i * 0.8 + k * 0.12) + 's' }} />)}</span>
        </div>
      ))}
    </div>
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [tayyor, setTayyor] = useState(false);
  useEffect(() => { const t = setTimeout(() => setTayyor(true), kamHarakat() ? 0 : 3300); return () => clearTimeout(t); }, []);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={tayyor} label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun birinchi buyurtma rejasi <A>va ikki xat yozasiz.</A></>, ru: <>Сегодня напишете план первого заказа <A>и два письма.</A></> })}
        mentor={<Mentor>{tr({ uz: 'Xatlarni darsda yozasiz, yuborish esa — uyda, ota-onangiz bilan.', ru: 'Письма пишете на уроке, а отправляете — дома, вместе с родителями.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="fr-reja">
          <span className="fr-reja-teg">{tr({ uz: 'frilans va stajirovka: reja va ikki xat', ru: 'фриланс и стажировка: план и два письма' })}</span>
          <RejaSkelet />
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      />
    </Stage>
  );
};

// ===== SCREEN 2 — UCH YO'L (QTushuncha keng; bashorat → 3 tugma ketma-ket → Yo'llar kartalari ochiladi; markaziy) =====
const S2_TUGMA = [YOL_NOM.xalqaro, YOL_NOM.tanish, YOL_NOM.kompaniya];
const S2_IZOH = [
  { uz: 'Upwork kabi xalqaro saytlarda yosh sharti bor — uni ota-ona bilan saytning o\'zidan o\'qing.', ru: 'На международных сайтах вроде Upwork есть возрастное условие — прочитайте его на самом сайте вместе с родителями.' },
  { uz: 'Mustaqil, buyurtma bilan ishlash frilans deyiladi; ish beradigan odam yoki kompaniya — buyurtmachi.', ru: 'Самостоятельная работа по заказам называется фрилансом; человек или компания, которые дают работу, — заказчик.' },
  { uz: 'Kompaniyada o\'qib ishlash davri stajirovka deyiladi — uni xat bilan so\'raysiz.', ru: 'Период работы с обучением в компании называется стажировкой — о ней просят письмом.' }
];
const S2_TAXMIN = [{ k: '1', t: { uz: 'Bitta', ru: 'Один' } }, { k: '2', t: { uz: 'Ikkita', ru: 'Два' } }, { k: '3', t: { uz: 'Uchta', ru: 'Три' } }];
const KURS_QOIDA = { uz: "Bu kursda qoida: boshqa odam nomidan profil ochmang — faqat o'z nomingizdan.", ru: 'Правило этого курса: не открывайте профиль от чужого имени — только от своего.' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [sayt, setSayt] = useState(!!storedAnswer);
  const [xat1, setXat1] = useState(!!storedAnswer);
  const done = q >= 3 && xat1;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  const telRef = useRef(null); const refs = useRef({});
  const [uchEl, uchir] = useUchar();
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bos = () => {
    if (!taxmin || q >= 3) return;
    const n = q + 1; setQ(n);
    if (n === 2) setTimeout(() => uchir(telRef.current, refs.current.togarak, <LendingKarta />, () => setSayt(true), 'sayt'), kamHarakat() ? 0 : 520);
    if (n === 3) setTimeout(() => uchir(refs.current.bino, refs.current.xat1, <span className="fr-uchar-konv"><KonvBelgi /></span>, () => setXat1(true), 'konv'), kamHarakat() ? 0 : 520);
  };
  const yollar = <div className="fr-yollar-q">
    <div className="fr-yollar">{YOL_ID.map((id, i) => <YolKarta key={id} id={id} ochiq={q > i} refs={refs.current} sayt={sayt} />)}</div>
    {q >= 1 && <p className="fr-qoida">{tr(KURS_QOIDA)}</p>}
  </div>;
  const xatlar = q >= 3
    ? <span className="fr-ix"><span ref={el => { refs.current.xat1 = el; }} className={cxx('fr-konv-chip', xat1 && 'tushdi')}><KonvBelgi />1-{tr({ uz: 'xat', ru: 'письмо' })}</span></span>
    : <XatlarIx n={0} />;
  const sahna = <IshVaraq qism="yollar" telefon={!tugadi} className={cxx(tugadi && 'tugadi')} telRef={telRef} yollar={yollar} buyurtma={<BuyurtmaIx />} xatlar={xatlar} />;
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · uch yo'l", ru: 'Понятие · три пути' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={tugmaYorliq(taxmin, q, done)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Birinchi buyurtma <A>qayerdan chiqishi mumkin?</A></>, ru: <>Откуда может <A>прийти первый заказ?</A></> })}
        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va har yo'lning shartiga qarang.", ru: 'Нажимайте кнопки по одной и смотрите на условие каждого пути.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Mentor bugun nechta yo'lni rejalaydi?", ru: 'Сколько путей Ментор планирует сегодня?' })} variantlar={S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="fr-harakat">
          <Tugmalar3 nomlar={S2_TUGMA} q={q} faol={!!taxmin} onBos={bos} />
          {q > 0 && <QIzoh key={q}>{tr(S2_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing va yo'l kartasiga qarang.", ru: 'Нажмите активную кнопку и посмотрите на карточку пути.' }))}
        </div>}
        vizual={sahna}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === '2'} aslida={tr({ uz: 'ikkita', ru: 'два' })} />}
          matn={tr({ uz: "Bu misolda bugun ikki yo'l rejalanadi: tanish doiradan buyurtma va kompaniyaga xat.", ru: 'В этом примере сегодня планируются два пути: заказ через круг знакомых и письмо в компанию.' })}
          izoh={tr(S2_IZOH[2])} />}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 2; ikkinchi misol — sinfdosh, P-002) =====
const XalqaroMini = () => (
  <div className="fr-mini fr-mini-x">
    <BrauzerMini qulf ixcham />
    <span className="fr-mini-y">{tr({ uz: 'shartini saytdan o\'qing', ru: 'условие читайте на сайте' })}</span>
    <span className="fr-mini-y">{tr({ uz: 'ota-ona bilan', ru: 'с родителями' })}</span>
  </div>
);
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · xalqaro sayt', ru: 'Проверка · международный сайт' })}
    questionText="Sinfdoshingiz Upwork'da ishlamoqchi. U avval nima qiladi?"
    question={tr({ uz: <h2 className="title h-ask">Sinfdoshingiz Upwork'da ishlamoqchi. <A>U avval nima qiladi?</A></h2>, ru: <h2 className="title h-ask">Одноклассник хочет работать на Upwork. <A>Что он сделает сначала?</A></h2> })}
    options={[
      { uz: 'Akasining nomi bilan profil ochib qo\'yadi', ru: 'Откроет профиль на имя старшего брата' },
      { uz: 'Ota-onasiga aytmasdan o\'zi profil ochadi', ru: 'Сам откроет профиль, не сказав родителям' },
      { uz: 'Shartini ota-onasi bilan saytdan o\'qiydi', ru: 'Прочитает условие на сайте вместе с родителями' },
      { uz: 'Shartni o\'qimay, profilni to\'ldira boshlaydi', ru: 'Начнёт заполнять профиль, не читая условия' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Yosh sharti saytning o\'zidan, ota-ona bilan o\'qiladi.', ru: 'Возрастное условие читают на самом сайте, вместе с родителями.' }}
    explainWrong={{
      0: { uz: 'Bu profil kimniki bo\'lib qoladi — uning o\'zinikimi?', ru: 'Чьим будет этот профиль — его собственным?' },
      1: { uz: 'Bu haqda ota-onasi bilishi kerak emasmi?', ru: 'Разве родители не должны об этом знать?' },
      3: { uz: 'Shartni o\'qimasa, unga mosligini qayerdan biladi?', ru: 'Не прочитав условие, как он узнает, подходит ли он?' },
      default: { uz: 'Xalqaro sayt kartasida qaysi shartlar bor edi?', ru: 'Какие условия были на карточке международного сайта?' }
    }}
    vizual={<XalqaroMini />} />
);

// ===== SCREEN 4 — BUYURTMA REJASI (QTushuncha keng; bashorat → Kim · Nima · Qachon; Nima — lending kartasi katakka uchadi) =====
const S4_TUGMA = [BUY_NOM.kim, BUY_NOM.nima, BUY_NOM.qachon];
const S4_IZOH = [
  { uz: "Rejada ism emas, rol yoziladi: tanish do'kon, maktab yoki to'garak.", ru: 'В плане пишут не имя, а роль: знакомый магазин, школа или кружок.' },
  { uz: 'Bu darsda birinchi buyurtma — kursda qurganingizga o\'xshash ish: lending yoki bot.', ru: 'На этом уроке первый заказ — работа, похожая на то, что вы строили на курсе: лендинг или бот.' },
  { uz: 'Qachon — qaysi paytda gaplashasiz; pul va kelishuv esa ota-ona orqali.', ru: 'Когда — в какой момент вы поговорите; а деньги и договорённость — через родителей.' }
];
const S4_TAXMIN = [{ k: 'oxshash', t: { uz: "Kursda qurgan ishiga o'xshash", ru: 'Похожую на то, что строил на курсе' } }, { k: 'qisman', t: { uz: "Qisman o'rgangan boshqa ish", ru: 'Другую, которую знает частично' } }, { k: 'yangi', t: { uz: 'Hali umuman qilmagan ish', ru: 'Работу, которую ещё совсем не делал' } }];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [nima, setNima] = useState(!!storedAnswer);
  const [yashil, setYashil] = useState(null);
  const done = q >= 3 && nima;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  const lendRef = useRef(null); const refs = useRef({});
  const [uchEl, uchir] = useUchar();
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const yonib = (id) => { setYashil(id); setTimeout(() => setYashil(v => (v === id ? null : v)), 1100); };
  const bos = () => {
    if (!taxmin || q >= 3 || (q === 2 && !nima)) return;
    const n = q + 1; setQ(n);
    if (n === 1) yonib('kim');
    if (n === 2) setTimeout(() => uchir(lendRef.current, refs.current.nima, <LendingKarta />, () => { setNima(true); yonib('nima'); }, 'sayt'), kamHarakat() ? 0 : 620);
    if (n === 3) yonib('qachon');
  };
  const qiymat = { kim: q >= 1 ? tr(MENTOR_ISH.buyurtma.kim) : null, nima: nima ? tr(MENTOR_ISH.buyurtma.nima) : null, qachon: q >= 3 ? tr(MENTOR_ISH.buyurtma.qachon) : null };
  const holat = Object.fromEntries(BUY_ID.map(id => [id, yashil === id ? 'yangi' : done ? 'ok' : undefined]));
  const yon = {
    kim: q >= 1 && <span className="fr-katak-yon"><Rol B={Koptok} t={tr({ uz: 'murabbiy', ru: 'тренер' })} belgi={tr({ uz: 'tanish', ru: 'знакомый' })} />{q >= 3 && <Rol B={Uy} i={1} t={tr({ uz: 'ota-ona', ru: 'родители' })} />}</span>
  };
  const telOsti = q >= 2 && <LendingKarta refEl={lendRef} togarak={nima} className="osti" />;
  const sahna = <IshVaraq qism="buyurtma" telefon={!tugadi} className={cxx(tugadi && 'tugadi')} telOsti={telOsti}
    yollar={<YollarIx ajrat={['tanish']} />} buyurtma={<BuyurtmaTo q={qiymat} holat={holat} yon={yon} refs={refs.current} ajrat={q >= 3 && yashil === 'qachon'} />} xatlar={<XatlarIx n={0} />} />;
  const tx = S4_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · buyurtma rejasi', ru: 'Понятие · план заказа' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={tugmaYorliq(taxmin, q, done)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Birinchi buyurtma rejasida <A>nima yoziladi?</A></>, ru: <>Что пишут <A>в плане первого заказа?</A></> })}
        mentor={<Mentor>{tr({ uz: 'Tugmalarni birma-bir bosing va Mentor rejasi qanday to\'lishini ko\'ring.', ru: 'Нажимайте кнопки по одной и смотрите, как заполняется план Ментора.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Mentor buyurtmaga qanday ish tanlaydi?', ru: 'Какую работу Ментор выберет для заказа?' })} variantlar={S4_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="fr-harakat">
          <Tugmalar3 nomlar={S4_TUGMA} q={q} faol={!!taxmin && !(q === 2 && !nima)} onBos={bos} />
          {q > 0 && <QIzoh key={q}>{tr(S4_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: 'Yoqilgan tugmani bosing va reja katagiga qarang.', ru: 'Нажмите активную кнопку и посмотрите на ячейку плана.' }))}
        </div>}
        vizual={sahna}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === 'oxshash'} aslida={tr({ uz: "kursda qurgan ishiga o'xshash", ru: 'похожую на то, что строил на курсе' })} />}
          matn={tr({ uz: 'Bu darsda buyurtma rejasi uch qatordan iborat: kim, nima va qachon.', ru: 'На этом уроке план заказа состоит из трёх строк: кто, что и когда.' })}
          izoh={tr(S4_IZOH[2])} />}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 0; ikkinchi misol — tanish do'kon, P-002) =====
const BuyurtmaMini = () => (
  <div className="fr-mini">
    <span className="fr-ix">{BUY_ID.map(id => <em key={id} className="ok">✓ {tr(BUY_NOM[id])}</em>)}</span>
    <span className="fr-mini-y">{tr(PUL_QATOR)}</span>
  </div>
);
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · buyurtma rejasi', ru: 'Проверка · план заказа' })}
    questionText="Sinfdoshlaringiz buyurtma rejasini yozdi. Qaysi biri bu kurs qoidasiga mos?"
    question={tr({ uz: <h2 className="title h-ask">Sinfdoshlaringiz buyurtma rejasini yozdi. <A>Qaysi biri bu kurs qoidasiga mos?</A></h2>, ru: <h2 className="title h-ask">Одноклассники написали план заказа. <A>Какой подходит под правило этого курса?</A></h2> })}
    options={[
      { uz: "Tanish do'kon · lending · shanba, ota-onam bilan", ru: 'Знакомый магазин · лендинг · суббота, с родителями' },
      { uz: "Tanish do'kon · lending · shanba, ota-onamsiz", ru: 'Знакомый магазин · лендинг · суббота, без родителей' },
      { uz: "Tanish do'kon · qilmagan ish · shanba, ota-onam bilan", ru: 'Знакомый магазин · незнакомая работа · суббота, с родителями' },
      { uz: "Tanish do'kon · lending · qachondir, ota-onam bilan", ru: 'Знакомый магазин · лендинг · когда-нибудь, с родителями' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Tanish odam, kursdagidek ish, aniq payt va ota-ona bor.', ru: 'Есть знакомый человек, работа как на курсе, точный момент и родители.' }}
    explainWrong={{
      1: { uz: 'Pul va kelishuv haqida kim bilan gaplashiladi?', ru: 'С кем говорят о деньгах и договорённости?' },
      2: { uz: 'Bu ishni kursda qurganmisiz?', ru: 'Вы строили такое на курсе?' },
      3: { uz: '«Qachondir» — bu qaysi payt?', ru: '«Когда-нибудь» — это какой момент?' },
      default: { uz: 'Mentor rejasining uch qatorini eslang.', ru: 'Вспомните три строки плана Ментора.' }
    }}
    vizual={<BuyurtmaMini />} />
);

// ===== SCREEN 6 — KOMPANIYAGA XAT (QTushuncha keng; bashorat → Kimman · Nima qurdim · Nima so'rayman; telefon ekrani xatga uchadi) =====
const S6_TUGMA = [XAT_QISM.kimman, XAT_QISM.nimaQurdim, XAT_QISM.soroq];
const S6_IZOH = [
  { uz: 'Kimman — bitta gap: kim ekaningiz va nimani o\'rganayotganingiz.', ru: 'Кто я — одна фраза: кто вы и что изучаете.' },
  { uz: 'Nima qurdim — bitta mahsulot, u nima qilishi va, manbasi bo\'lsa, bitta son: ro\'yxat emas.', ru: 'Что я построил — один продукт, что он делает и, если есть источник, одно число: не список.' },
  { uz: 'Har kompaniyaga alohida xat; bu kursda javob kelmasa qayta yozmaysiz — boshqasiga alohida xat.', ru: 'Каждой компании — отдельное письмо; на этом курсе, если ответа нет, повторно не пишете — другой компании отдельное письмо.' }
];
const S6_TAXMIN = [{ k: '1', t: { uz: 'Bittaga', ru: 'Одну' } }, { k: '5', t: { uz: 'Beshtaga', ru: 'Пять' } }, { k: '10', t: { uz: "O'ntaga", ru: 'Десять' } }];
const S6_OSTI = [
  [{ uz: 'Ism — ixtiyoriy; telefon, manzil va maktab raqami yozilmaydi.', ru: 'Имя — по желанию; телефон, адрес и номер школы не пишут.' }],
  [{ uz: 'Video-portfolio bo\'lsa — havolasini uyda qo\'shasiz.', ru: 'Если есть видео-портфолио — ссылку добавите дома.' }, { uz: "Mentor misolida son bor; sizda manbali son bo'lsa yoziladi, bo'lmasa — yo'q.", ru: 'В примере Ментора есть число; у вас — пишется, если у числа есть источник, иначе — нет.' }]
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [qurdim, setQurdim] = useState(!!storedAnswer);
  const [ketdi, setKetdi] = useState(false);
  const done = q >= 3 && qurdim;
  const tugadi = useTugadi(done, 1500, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  const telRef = useRef(null); const refs = useRef({});
  const [uchEl, uchir] = useUchar();
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bos = () => {
    if (!taxmin || q >= 3 || (q === 2 && !qurdim)) return;
    const n = q + 1; setQ(n);
    if (n === 2) { setKetdi(true); uchir(telRef.current, refs.current.q2, <JamoaTelefon />, () => { setQurdim(true); setKetdi(false); }, 'tel'); }
  };
  const satr = mentorXatSatr(0);
  const satrlar = [q >= 1 ? satr[0] : null, qurdim ? satr[1] : null, q >= 3 ? satr[2] : null];
  const osti = [
    q >= 1 && <p className="fr-xat-k">{tr(S6_OSTI[0][0])}</p>,
    <span ref={el => { refs.current.q2 = el; }} className="fr-xat-nishon">{qurdim && S6_OSTI[1].map((t, i) => <p key={i} className="fr-xat-k">{tr(t)}</p>)}</span>,
    null
  ];
  const tur = tr(MENTOR_ISH.xatlar[0].kompaniyaTuri);
  const xatlar = q >= 3
    ? <div className="fr-konvlar-q">
      <div className="fr-konvlar ikki">
        <Konvert n={1} tur={tur} soroq="stajirovka" holat="yopiq" satrlar={satrlar} yangi />
        <Konvert n={2} tur={tr(MENTOR_ISH.xatlar[1].kompaniyaTuri)} soroq="maslahat" holat="kulrang" />
      </div>
      <p className="fr-xavf">{tr(XAVF_QATOR)}</p>
    </div>
    : <div className="fr-konvlar"><Konvert n={1} tur={tur} holat="ochiq" satrlar={satrlar} osti={osti} /></div>;
  const sahna = <IshVaraq qism="xatlar" telefon={!tugadi} className={cxx(tugadi && 'tugadi')} telRef={telRef} telKetdi={ketdi} yollar={<YollarIx ajrat={['kompaniya']} />} buyurtma={<BuyurtmaIx />} xatlar={xatlar} />;
  const tx = S6_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · kompaniyaga xat', ru: 'Понятие · письмо в компанию' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={tugmaYorliq(taxmin, q, done)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Kompaniyaga xatda <A>nimani aytasiz?</A></>, ru: <>Что вы скажете <A>в письме компании?</A></> })}
        mentor={<Mentor>{tr({ uz: 'Tugmalarni birma-bir bosing va Mentor xati qanday yig\'ilishini ko\'ring.', ru: 'Нажимайте кнопки по одной и смотрите, как собирается письмо Ментора.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Mentor bitta xatni nechta kompaniyaga yuboradi?', ru: 'В сколько компаний Ментор отправит одно письмо?' })} variantlar={S6_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="fr-harakat">
          <Tugmalar3 nomlar={S6_TUGMA} q={q} faol={!!taxmin && !(q === 2 && !qurdim)} onBos={bos} />
          {q > 0 && <QIzoh key={q}>{tr(S6_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: 'Yoqilgan tugmani bosing va xatga qarang.', ru: 'Нажмите активную кнопку и посмотрите на письмо.' }))}
        </div>}
        vizual={sahna}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === '1'} aslida={tr({ uz: 'bittaga', ru: 'в одну' })} />}
          matn={tr({ uz: 'Bu darsda kompaniyaga xat uch qismdan iborat: kimman, nima qurdim va nima so\'rayman.', ru: 'На этом уроке письмо в компанию состоит из трёх частей: кто я, что я построил и о чём прошу.' })}
          izoh={tr(S6_IZOH[2])} />}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 7 — BUYURTMA VA XATLAR (QMustaqil, USTAXONA — bittadan karta: reja 3 karta, har xat 1 karta; E 43, E 53) · yozadi pm-m12d10-ish · nishonlar orderPlan, twoLetters, oneAsk =====
const S7_PLACE = { kim: { uz: 'Kim? Rolini yozing, ismsiz', ru: 'Кто? Напишите роль, без имени' }, nima: { uz: 'Nima qilib berasiz?', ru: 'Что сделаете?' }, qachon: { uz: 'Qachon gaplashasiz? Qaysi payt', ru: 'Когда поговорите? В какой момент' } };
const S7_MAX = { kim: 40, nima: 80, qachon: 40 };
const S7_KULRANG = {
  kim: { uz: "Tanish doira: tanish do'kon, maktab yoki to'garak.", ru: 'Круг знакомых: знакомый магазин, школа или кружок.' },
  nima: { uz: "Kursda qurganingizga o'xshash ish.", ru: 'Работа, похожая на то, что вы строили на курсе.' },
  qachon: PUL_QATOR
};
const S7_XATO = {
  bosh: { uz: 'Bitta qisqa javob yozing.', ru: 'Напишите один короткий ответ.' },
  akk: { uz: 'Rol yozing — ism, telefon va akkaunt nomi emas.', ru: 'Напишите роль — не имя, телефон или аккаунт.' },
  akkNima: { uz: 'Bu yerga ish yoziladi — telefon va akkaunt emas.', ru: 'Здесь пишут работу — не телефон и не аккаунт.' },
  raqam: { uz: 'Bu yerga son emas, rol va ish yoziladi.', ru: 'Здесь пишут не число, а роль и работу.' },
  xalqaro: { uz: 'Birinchi buyurtma — tanish doiradan: kimni taniysiz?', ru: 'Первый заказ — из круга знакомых: кого вы знаете?' },
  pul: { uz: 'Narxni ota-onangiz bilan kelishasiz — bu yerga ishni yozing.', ru: 'Цену согласуете с родителями — здесь напишите работу.' },
  noaniq: { uz: 'Qaysi paytda gaplashasiz — aniq yozing.', ru: 'В какой момент поговорите — напишите точно.' }
};
const S7_XAT_XATO = {
  turBosh: { uz: 'Qanday kompaniya — turini yozing.', ru: 'Какая компания — напишите её тип.' },
  uchQism: { uz: "Xatning uch qismini to'ldiring.", ru: 'Заполните три части письма.' },
  akk: { uz: 'Xatga telefon va akkaunt nomi yozilmaydi.', ru: 'В письмо не пишут телефон и аккаунт.' },
  raqam: { uz: 'Bu son telefon emasmi? Tekshirib, yana bosing.', ru: 'Это число не телефон? Проверьте и нажмите ещё раз.' },
  havola: { uz: "Havolani uyda, yuborishdan oldin qo'shasiz.", ru: 'Ссылку добавите дома, перед отправкой.' },
  uzun: { uz: "Xat uzun — har qism bitta-ikkita gap bo'lsin.", ru: 'Письмо длинное — по одной-две фразы в каждой части.' },
  pul: { uz: "Bu xatda pul so'ralmaydi — stajirovka yoki maslahat so'rang.", ru: 'В этом письме не просят денег — попросите стажировку или совет.' },
  shoshil: { uz: "Xatda shoshiltirish yo'q — so'rov bir marta, hurmat bilan.", ru: 'В письме не торопят — просьба один раз, с уважением.' },
  funksiya: { uz: "Ro'yxat emas — bitta mahsulot va u nima qilishi.", ru: 'Не список — один продукт и что он делает.' },
  birXil: { uz: "1-xatdagi kompaniyaning o'zimi? Boshqasini yozing.", ru: 'Это та же компания, что в 1-м письме? Напишите другую.' }
};
const S7_YANA = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — нажмите «Сохранить» ещё раз.' };
const S7_XAT_PLACE = { tur: { uz: 'Qanday kompaniya? Nomi emas, turi', ru: 'Какая компания? Не название, а тип' }, kimman: { uz: 'Kimman? Bitta gap', ru: 'Кто я? Одна фраза' }, nimaQurdim: { uz: "Nima qurdingiz? Mahsulot, u nima qiladi; manbasi bor bo'lsa bitta son", ru: 'Что вы построили? Продукт, что он делает; если есть источник — одно число' }, soroq: XAT_QISM.soroq };
const S7_XAT_MAX = { tur: 40, kimman: 120, nimaQurdim: 160, soroqGap: 140 };
const S7_XAT_YORDAM = [
  { uz: "Mentor misolida: kompaniya turi — «mobil ilova qiladigan kompaniya», so'rov — stajirovka. Xat: «Assalomu alaykum! Men maktab o'quvchisiman, dasturlashni o'rganyapman. Agent bilan \"Maydon Jamoa\" ilovasini qurdim: unda mahalladagi mini-futbolga o'yinchi yig'iladi. Hozir 51 foydalanuvchi bor. Kompaniyangizda o'quvchilar uchun stajirovka bormi? Bo'lsa, qanday qatnashsam bo'ladi? Hurmat bilan, …»", ru: 'В примере Ментора: тип компании — «компания, которая делает мобильные приложения», просьба — стажировка. Письмо: «Здравствуйте! Я школьник, изучаю программирование. С агентом я построил приложение «Maydon Jamoa»: в нём собирают игроков на мини-футбол в махалле. Сейчас в нём 51 пользователь. Есть ли в вашей компании стажировка для школьников? Если есть, как мне в ней поучаствовать? С уважением, …»' },
  { uz: "Mentor misolida: kompaniya turi — «sayt qiladigan kompaniya», so'rov — maslahat: «Mahsulotimni ko'rib, bitta maslahat bera olasizmi: keyin nimani o'rganishim kerak?» Har kompaniyaga — alohida xat, bir marta.", ru: 'В примере Ментора: тип компании — «компания, которая делает сайты», просьба — совет: «Можете посмотреть мой продукт и дать один совет: что мне изучать дальше?» Каждой компании — отдельное письмо, один раз.' }
];
const S7_XAT_YORDAM_OXIR = { uz: "Xatni ota-onangiz biladigan pochtadan yuborasiz; javob kelmasa — qayta yozmaysiz.", ru: 'Письмо отправите с почты, о которой знают родители; если ответа нет — повторно не пишете.' };
const TARTIB7 = ['kim', 'nima', 'qachon', 'xat0', 'xat1'];
const QISM7 = [{ id: 'buyurtma', t: QISM_NOM.buyurtma }, { id: 'xat0', t: { uz: '1-xat', ru: '1-е письмо' } }, { id: 'xat1', t: { uz: '2-xat', ru: '2-е письмо' } }];
const bushXat = () => ({ tur: '', kimman: '', nimaQurdim: '', soroq: null, soroqGap: '' });
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const video = useMemo(() => videoOl(), []);
  const bosh = useMemo(() => ishOl(), []);
  const [buy, setBuy] = useState(bosh.buyurtma);
  const [buyQ, setBuyQ] = useState(() => Object.fromEntries(BUY_ID.map(k => [k, bosh.buyurtma[k] || ''])));
  const [xatSaq, setXatSaq] = useState(bosh.xatlar);
  const [xatQ, setXatQ] = useState(() => [0, 1].map(i => {
    const s = bosh.xatlar[i];
    if (s) return { ...xatAjrat(s.matn), tur: s.kompaniyaTuri || '', soroq: SOROV_ID.includes(s.soroq) ? s.soroq : null };
    return i === 0 ? { ...bushXat(), kimman: video.kimman, nimaQurdim: video.nimaQurdim } : null;
  }));
  const saqlangan = (k, b = buy, x = xatSaq) => (BUY_ID.includes(k) ? !!b[k] : !!x[+k.slice(3)]);
  const [joriy, setJoriy] = useState(() => TARTIB7.find(k => !saqlangan(k, bosh.buyurtma, bosh.xatlar)) || null);
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [yashil, setYashil] = useState(null);
  const [tanla, setTanla] = useState(0);
  const [nusxa, setNusxa] = useState(null);
  const [uchish, setUchish] = useState(false);
  const inpRef = useRef(null); const kartaRef = useRef(null); const refs = useRef({});
  const [uchEl, uchir] = useUchar();
  const rN = rejaSoni(buy);
  const n5 = rN + xatSaq.length;
  const qismN = (rN === 3 ? 1 : 0) + xatSaq.length;
  const yetarli = rN === 3 && xatSaq.length >= 1;
  const toliq = rN === 3 && xatSaq.length === 2;
  const earn = (id) => { if (achMiss && achMiss.earn) achMiss.earn(id); };
  const keyingisi = (k, b, x) => TARTIB7.slice(TARTIB7.indexOf(k) + 1).find(t => !saqlangan(t, b, x)) || TARTIB7.find(t => !saqlangan(t, b, x)) || null;
  const och = (k) => {
    if (uchish || (k === 'xat1' && !xatSaq[0])) return;
    if (k === 'buyurtma') k = BUY_ID.find(t => !buy[t]) || 'kim';
    if (k === 'xat1' && !xatQ[1]) { const a = xatQ[0] || bushXat(); setXatQ(q => [q[0], { ...bushXat(), kimman: a.kimman, nimaQurdim: a.nimaQurdim }]); }
    setJoriy(k); setXato(null); setYumshoq(null); setYordam(false); setNusxa(null);
  };
  const yonib = (k) => { setYashil(k); setTimeout(() => setYashil(v => (v === k ? null : v)), 1100); };
  const yumshoqmi = (k, t, matn) => !t.blok && yumshoq && yumshoq.k === k && yumshoq.x === t.x && yumshoq.matn === matn;
  const yakunla = (b, x) => {
    const ok = rejaSoni(b) === 3 && x.length >= 1;
    if (ok && storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'buyurtma va xatlar', solved: true, correct: true, picked: true });
  };
  const saqlaBuy = () => {
    if (uchish) return;
    const k = joriy; const matn = bir(buyQ[k]); const t = tekshirBuy(k, matn);
    if (t && !yumshoqmi(k, t, matn)) { setXato(t); if (!t.blok) setYumshoq({ k, x: t.x, matn }); return; }
    const yangi = { ...buy, [k]: matn };
    if (!isMentor) ishYoz({ buyurtma: { [k]: matn } });
    setXato(null); setYumshoq(null); setYordam(false);
    const nk = keyingisi(k, yangi, xatSaq);
    setUchish(true);
    const tush = () => { setBuy(yangi); yonib(k); setUchish(false); if (!nk) setJoriy(null); };
    uchir(inpRef.current, refs.current[k], <span className="fr-uchar-m">{matn}</span>, tush, 'matn');
    if (rejaSoni(yangi) === 3 && rejaSoni(buy) < 3) {
      earn('orderPlan');
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
    yakunla(yangi, xatSaq);
    if (nk) setJoriy(nk);
  };
  const saqlaXat = () => {
    if (uchish) return;
    const i = +joriy.slice(3); const x = xatQ[i] || bushXat(); const k = joriy;
    const oldingi = i === 1 ? (xatSaq[0] ? xatSaq[0].kompaniyaTuri : (xatQ[0] && xatQ[0].tur)) : null;
    const matn = xatMatn(x);
    const t = tekshirXat(x, oldingi);
    if (t && !yumshoqmi(k, t, matn)) { setXato(t); if (!t.blok) setYumshoq({ k, x: t.x, matn }); return; }
    const entry = { kompaniyaTuri: bir(x.tur), soroq: x.soroq, matn };
    const yangiX = [...xatSaq]; yangiX[i] = entry;
    if (!isMentor) ishYoz({ xatlar: yangiX });
    setXato(null); setYumshoq(null); setYordam(false);
    const nk = keyingisi(k, buy, yangiX);
    if (nk === 'xat1' && !xatQ[1]) setXatQ(q => [q[0], { ...bushXat(), kimman: x.kimman, nimaQurdim: x.nimaQurdim }]);
    setUchish(true);
    const tush = () => { setXatSaq(yangiX); yonib(k); setUchish(false); if (!nk) setJoriy(null); };
    uchir(kartaRef.current, refs.current[k], <span className="fr-uchar-konv"><KonvBelgi /><b>{i + 1}-{tr({ uz: 'xat', ru: 'письмо' })}</b></span>, tush, 'konv');
    if (yangiX.length === 2 && yangiX[0] && yangiX[1]) {
      if (normT(yangiX[0].kompaniyaTuri) !== normT(yangiX[1].kompaniyaTuri)) earn('twoLetters');
      if (yangiX.every(e => SOROV_ID.includes(e.soroq))) earn('oneAsk');
    }
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + 50 + screen, 'practice', 0, true, 0);
    yakunla(buy, yangiX);
    if (nk) setJoriy(nk);
  };
  const nusxala = () => {
    const i = +joriy.slice(3); const e = xatSaq[i]; if (!e) return;
    const quti = () => setNusxa({ i, quti: true });
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(e.matn).then(() => setNusxa({ i, ok: true }), quti); else quti(); } catch { quti(); }
  };
  const xatYoz = (maydon, v) => { const i = +joriy.slice(3); setXatQ(q => q.map((x, j) => (j === i ? { ...(x || bushXat()), [maydon]: v } : x))); setXato(null); setNusxa(null); };
  const tanlaSorov = (s) => { const i = +joriy.slice(3); setXatQ(q => q.map((x, j) => (j === i ? { ...(x || bushXat()), soroq: s, soroqGap: tr(SOROV_GAP[s]) } : x))); setXato(null); setTanla(t => t + 1); };
  const qoshSoz = (soz) => {
    setBuyQ(d => { const v = String(d.nima || '').replace(/^(lending|telegram bot|лендинг|telegram-бот):\s*/i, ''); return { ...d, nima: (soz + v).slice(0, S7_MAX.nima) }; });
    setXato(null); setTanla(t => t + 1);
    setTimeout(() => { const el = inpRef.current; if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }, 0);
  };
  // --- chap: varaq «Buyurtma va xatlarim» ---
  const xatKonv = (i, tahrir) => {
    const e = xatSaq[i];
    if (!e) return <Konvert key={i} n={i + 1} holat="bosh" refEl={el => { refs.current['xat' + i] = el; }} className={cxx(joriy === 'xat' + i && 'kutadi')} />;
    const p = xatAjrat(e.matn);
    return <Konvert key={i} n={i + 1} tur={e.kompaniyaTuri} soroq={e.soroq} holat="yopiq" satrlar={[p.nimaQurdim]} refEl={el => { refs.current['xat' + i] = el; }} yangi={yashil === 'xat' + i} tahrir={tahrir ? () => och('xat' + i) : undefined} yIchida={tahrir} />;
  };
  const qism = joriy ? (BUY_ID.includes(joriy) ? 'buyurtma' : 'xatlar') : null;
  const buyHolat = Object.fromEntries(BUY_ID.map(k => [k, yashil === k ? 'yangi' : joriy === k ? 'kutadi' : undefined]));
  const varaq = (yakun) => <IshVaraq rejim="oquvchi" telefon={false} qism={yakun ? null : qism} toliq={yakun ? ['buyurtma', 'xatlar'] : []} className={cxx(yakun && 'katta')}
    yollar={<YollarIx ajrat={['tanish', 'kompaniya']} />}
    buyurtma={qism === 'buyurtma' || yakun ? <BuyurtmaTo q={buy} holat={buyHolat} refs={refs.current} tahrir={yakun ? och : undefined} /> : <BuyurtmaIx b={buy} />}
    xatlar={qism === 'xatlar' || yakun ? <div className="fr-konvlar ikki">{[0, 1].map(i => xatKonv(i, yakun))}</div> : <XatlarIx n={xatSaq.length} />} />;
  // --- o'ng: joriy karta ---
  const buyKarta = joriy && BUY_ID.includes(joriy) && (() => {
    const k = joriy; const matn = String(buyQ[k] || ''); const uz = matn.trim().length; const ix = BUY_ID.indexOf(k);
    return (
      <div key={k} ref={kartaRef} className={cxx('fr-karta', xato && xato.blok && 'err')}>
        <span className="q-yorliq">{tr(QISM_NOM.buyurtma)} · {ix + 1}{NB}/{NB}3</span>
        <div className={cxx('fr-maydon', !uz && 'chorla')}>
          <i className="fr-maydon-n">{ix + 1}</i>
          <textarea ref={inpRef} className={cxx('fr-inp', xato && 'err', tanla && 'qoshildi')} key={'t' + tanla} rows={2} maxLength={S7_MAX[k]} value={matn} placeholder={tr(S7_PLACE[k])} aria-label={tr(BUY_NOM[k])}
            onChange={(e) => { const v = e.target.value.replace(/\n/g, ' '); setBuyQ(d => ({ ...d, [k]: v })); setXato(null); }} />
          <span className="fr-sanoq-b">{uz}{NB}/{NB}{S7_MAX[k]}</span>
        </div>
        {xato && <QXato key={xato.x}>{tr(S7_XATO[xato.x])}</QXato>}
        {xato && !xato.blok && <p className="fr-yana">{tr(S7_YANA)}</p>}
        <p className="fr-kulrang">{tr(S7_KULRANG[k])}</p>
        {yordam && <div className="fr-yordam fade-step"><p>{tr({ uz: 'Mentor misolida:', ru: 'В примере Ментора:' })} «{tr(MENTOR_ISH.buyurtma[k])}»</p></div>}
        <div className="fr-karta-tug">
          <QTugma className={cxx(uz > 0 && 'fr-halqa')} onClick={saqlaBuy}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
          {k === 'nima' && <><QTugma ikkinchi onClick={() => qoshSoz('lending: ')}>{tr({ uz: 'Lending', ru: 'Лендинг' })}</QTugma><QTugma ikkinchi onClick={() => qoshSoz('Telegram bot: ')}>Telegram bot</QTugma></>}
          <QTugma ikkinchi className="fr-o" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
        </div>
      </div>
    );
  })();
  const xatKarta = joriy && joriy.startsWith('xat') && (() => {
    const i = +joriy.slice(3); const x = xatQ[i] || bushXat(); const saq = !!xatSaq[i];
    const tayyor = bir(x.tur) && bir(x.kimman) && bir(x.nimaQurdim) && x.soroq && bir(x.soroqGap);
    const xm = (m) => xato && ((m === 'tur' && (xato.x === 'turBosh' || xato.x === 'birXil')) || (m !== 'tur' && xato.x === 'uchQism' && !bir(x[m])));
    const maydon = (m, n, rows) => (
      <div className={cxx('fr-maydon', !bir(x[m]) && 'chorla')}>
        {n && <i className="fr-maydon-n">{n}</i>}
        <textarea className={cxx('fr-inp', !n && 'nsiz', xm(m) && 'err', m === 'soroqGap' && tanla && 'qoshildi')} key={m === 'soroqGap' ? 's' + tanla : m} rows={rows} maxLength={S7_XAT_MAX[m]} value={x[m] || ''}
          placeholder={tr(S7_XAT_PLACE[m === 'soroqGap' ? 'soroq' : m])} aria-label={tr(m === 'tur' ? { uz: 'Kompaniya turi', ru: 'Тип компании' } : XAT_QISM[m === 'soroqGap' ? 'soroq' : m])}
          onChange={(e) => xatYoz(m, e.target.value.replace(/\n/g, ' '))} />
      </div>
    );
    return (
      <div key={joriy} ref={kartaRef} className={cxx('fr-karta xat', xato && xato.blok && 'err')}>
        <span className="q-yorliq">{i + 1}-{tr({ uz: 'xat', ru: 'письмо' })}{saq ? ' ✓' : ''}</span>
        {maydon('tur', null, 1)}
        <p className="fr-kulrang">{tr({ uz: "Kompaniyaning o'zini uyda, ota-onangiz bilan tanlaysiz.", ru: 'Саму компанию выберете дома, вместе с родителями.' })}</p>
        <div className={cxx('fr-sorov', !x.soroq && bir(x.tur) && 'kutadi')}>
          {SOROV_ID.map(s => <button key={s} type="button" className={cxx('fr-sorov-b', x.soroq === s && 'on')} aria-pressed={x.soroq === s} onClick={() => tanlaSorov(s)}>{tr(SOROV_NOM[s])}</button>)}
        </div>
        <div className="fr-xat-ich">
          <span className="fr-xat-s">{tr(MENTOR_XAT.salom)}</span>
          {maydon('kimman', 1, 2)}
          {maydon('nimaQurdim', 2, 2)}
          {maydon('soroqGap', 3, 2)}
          <span className="fr-xat-o">{tr(MENTOR_XAT.oxiri)} <em>{tr(ISM_UYDA)}</em></span>
        </div>
        {i === 1 && <p className="fr-kulrang">{tr({ uz: "«Kimman» va «Nima qurdim» o'sha bo'lishi mumkin; kompaniya turi va so'rovni moslang — har kompaniya uchun alohida nusxa.", ru: '«Кто я» и «Что я построил» могут быть теми же; тип компании и просьбу подберите — отдельная копия для каждой компании.' })}</p>}
        {i === 0 && video.otdi && <p className="fr-kulrang">{tr({ uz: "Ota-onangiz rozi bo'lsa, video havolasini uyda qo'shasiz.", ru: 'Если родители согласны, ссылку на видео добавите дома.' })}</p>}
        {xato && <QXato key={xato.x}>{tr(S7_XAT_XATO[xato.x])}</QXato>}
        {xato && !xato.blok && <p className="fr-yana">{tr(S7_YANA)}</p>}
        {yordam && <div className="fr-yordam fade-step"><p>{tr(S7_XAT_YORDAM[i])}</p><p>{tr(S7_XAT_YORDAM_OXIR)}</p></div>}
        {nusxa && nusxa.i === i && nusxa.quti && <textarea className="fr-nusxa" readOnly rows={4} value={xatSaq[i] ? xatSaq[i].matn : ''} onFocus={(e) => e.target.select()} aria-label={tr({ uz: 'Nusxalash', ru: 'Скопировать' })} />}
        <div className="fr-karta-tug">
          <QTugma className={cxx(tayyor && 'fr-halqa')} onClick={saqlaXat}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
          <QTugma ikkinchi disabled={!saq} onClick={nusxala}>{tr({ uz: 'Nusxalash', ru: 'Скопировать' })}{nusxa && nusxa.i === i && nusxa.ok ? ' ✓' : ''}</QTugma>
          <QTugma ikkinchi className="fr-o" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
        </div>
      </div>
    );
  })();
  const strip = <div className="fr-strip">
    <span className="fr-strip-y">{tr({ uz: 'Buyurtma va xatlarim', ru: 'Мой заказ и письма' })} · {n5}/5</span>
    {QISM7.map((p, ix) => {
      const ok = p.id === 'buyurtma' ? rN === 3 : !!xatSaq[+p.id.slice(3)];
      const on = p.id === 'buyurtma' ? BUY_ID.includes(joriy) : joriy === p.id;
      return <QChip key={p.id} holat={on ? 'on' : ok ? 'ok' : undefined} className={cxx('fr-tab', yashil && (p.id === yashil || (p.id === 'buyurtma' && BUY_ID.includes(yashil))) && 'yangi')} disabled={p.id === 'xat1' && !xatSaq[0]} onClick={() => och(p.id)}><i>{ok ? '✓' : ix + 1}</i>{tr(p.t)}</QChip>;
    })}
  </div>;
  const yakuniy = !joriy && (rN > 0 || xatSaq.length > 0);
  const mentorMatn = !joriy || BUY_ID.includes(joriy)
    ? (joriy ? { uz: 'Kartadagi savolga bitta qisqa javob yozing va «Saqlash»ni bosing.', ru: 'Напишите один короткий ответ на вопрос карточки и нажмите «Сохранить».' } : { uz: "Ikkinchi xat boshqa turdagi kompaniya uchun: turini yozing va so'rovni tanlang.", ru: 'Второе письмо — для компании другого типа: напишите тип и выберите просьбу.' })
    : joriy === 'xat0'
      ? (video.kimman || video.nimaQurdim ? { uz: "Video-portfolio uchun yozganlaringiz xatga qo'yildi: kompaniya turini yozing va so'rovni tanlang.", ru: 'То, что вы написали для видео-портфолио, уже в письме: напишите тип компании и выберите просьбу.' } : { uz: "Kompaniya turini yozing, so'rovni tanlang va xatning qolgan qismlarini to'ldiring.", ru: 'Напишите тип компании, выберите просьбу и заполните остальные части письма.' })
      : { uz: "Ikkinchi xat boshqa turdagi kompaniya uchun: turini yozing va so'rovni tanlang.", ru: 'Второе письмо — для компании другого типа: напишите тип и выберите просьбу.' };
  const mentorVaraq = <div className="fr-fokus"><Zoomable><IshVaraq telefon={false} toliq={['buyurtma', 'xatlar']}
    yollar={<YollarIx ajrat={['tanish', 'kompaniya']} />}
    buyurtma={<BuyurtmaTo q={Object.fromEntries(BUY_ID.map(k => [k, tr(MENTOR_ISH.buyurtma[k])]))} holat={{ kim: 'ok', nima: 'ok', qachon: 'ok' }} />}
    xatlar={<div className="fr-konvlar ikki">{[0, 1].map(i => <Konvert key={i} n={i + 1} tur={tr(MENTOR_ISH.xatlar[i].kompaniyaTuri)} soroq={MENTOR_ISH.xatlar[i].soroq} holat="ochiq" satrlar={mentorXatSatr(i)} />)}</div>} /></Zoomable>
    <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Reja yozdi', ru: 'Написали план' }} />
    <MentorPracticeStats live={_live} screen={screen} sig={PRACTICE_BASE + 50 + screen} yorliq={{ uz: 'Xat yozdi', ru: 'Написали письмо' }} /></div>;
  const forma = isMentor ? mentorVaraq
    : yakuniy
      ? <div className="fr-fokus"><Zoomable>{varaq(true)}</Zoomable>
        <QXulosa>{toliq ? tr({ uz: 'Buyurtma rejasi va ikki xat yozildi: yuborish — uyda, ota-ona bilan.', ru: 'План заказа и два письма написаны: отправка — дома, с родителями.' }) : tr({ uz: 'Yozilgani saqlandi — qolganini uyda yozasiz.', ru: 'Написанное сохранено — остальное допишете дома.' })}</QXulosa></div>
      : <div className="fr-ust"><div className="fr-ust-chap">{varaq(false)}</div><div className="fr-ust-ong">{buyKarta || xatKarta}</div></div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={n5 * 10 + (joriy ? TARTIB7.indexOf(joriy) : 9)} navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={yetarli && !joriy} disabled={!yetarli && !isMentor} label={yetarli || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Qismlarni bajaring (' + qismN + '/3)', ru: 'Выполните части (' + qismN + '/3)' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Buyurtma rejasi va <A>ikki xatingizni yozing.</A></>, ru: <>Напишите план заказа <A>и два своих письма.</A></> })}
        mentor={<Mentor>{tr(mentorMatn)}</Mentor>}
        qadamlar={!isMentor && !yakuniy && strip}
        forma={forma}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s8 = 3; ikkala trekka to'g'ri) =====
const XatlarMini = () => (
  <div className="fr-mini">
    <div className="fr-konvlar ikki">
      <Konvert n={1} holat="kulrang" yorliq={tr({ uz: "javob yo'q — qayta yozilmaydi", ru: 'ответа нет — повторно не пишут' })} />
      <Konvert n={2} holat="yopiq" className="acc" />
    </div>
  </div>
);
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Kompaniya xatingizga javob bermadi. Bu kursda nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Kompaniya xatingizga javob bermadi. <A>Bu kursda nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">Компания не ответила на ваше письмо. <A>Что вы сделаете на этом курсе?</A></h2> })}
    options={[
      { uz: 'Har kuni qayta yozib, javobini so\'rayman', ru: 'Буду каждый день писать снова и просить ответ' },
      { uz: 'Shu xatni ko\'p kompaniyaga bir xil yuboraman', ru: 'Отправлю это же письмо многим компаниям' },
      { uz: 'Ofisiga yolg\'iz borib, javobini kutaman', ru: 'Пойду в офис один и буду ждать ответа' },
      { uz: 'Qayta yozmayman, boshqa kompaniya tanlayman', ru: 'Не пишу повторно, выбираю другую компанию' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Bu kursda: javob kelmasa qayta yozmaysiz — boshqasiga xat.', ru: 'На этом курсе: если ответа нет, повторно не пишете — пишете другой.' }}
    explainWrong={{
      0: { uz: 'Har kuni yozish — hurmatmi yoki bosim?', ru: 'Писать каждый день — это уважение или давление?' },
      1: { uz: 'Bir xil xatni ko\'p joyga yuborish to\'g\'rimi?', ru: 'Правильно ли отправлять одно и то же письмо во много мест?' },
      2: { uz: 'Notanish joyga kim bilan boriladi?', ru: 'С кем идут в незнакомое место?' },
      default: { uz: 'Javob kelmasa nima qilinadi — eslang.', ru: 'Вспомните, что делают, если ответа нет.' }
    }}
    vizual={<XatlarMini />} />
);

// ===== 🏅 BADGES (nishonlar, 4 — PM: «!» bilan, 9.23) — faqat ish qilingan ekranlarda (S-034) =====
const ACHIEVEMENTS = {
  rulesFirst: { icon: '🔒', name: 'Rules First!', desc: { uz: "Yosh shartini qayerdan o'qishni topdingiz", ru: 'Вы нашли, где читать возрастное условие' } },
  orderPlan: { icon: '📋', name: 'Order Plan!', desc: { uz: 'Buyurtma rejasining uch qatorini yozdingiz', ru: 'Вы написали три строки плана заказа' } },
  twoLetters: { icon: '✉️', name: 'Two Letters!', desc: { uz: 'Ikki xil kompaniya uchun ikkita xat yozdingiz', ru: 'Вы написали два письма для двух разных компаний' } },
  oneAsk: { icon: '🎯', name: 'One Ask!', desc: { uz: "Ikki xatda bittadan so'rov tanladingiz", ru: 'В двух письмах вы выбрали по одной просьбе' } }
};
// Ekran id → nishon (birinchi urinish, faqat SCORED test). 7-ekran nishonlari — Screen7 ichida (saqlashga qarab), AchMissCtx.earn orqali.
const ACH_TRIGGERS = { s3: 'rulesFirst' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 8)
const Q_LABELS = {
  3: { uz: '1 — Xalqaro saytda avval nima', ru: '1 — Что сначала на международном сайте' },
  5: { uz: "2 — To'g'ri buyurtma rejasi", ru: '2 — Правильный план заказа' },
  8: { uz: 'Yakuniy — Javob kelmasa', ru: 'Итог — Если ответа нет' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'buyurtma', ru: 'заказ' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'reja', ru: 'план' }, l: 85, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'xat', ru: 'письмо' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'kompaniya', ru: 'компания' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'stajirovka', ru: 'стажировка' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'frilans', ru: 'фриланс' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'lending', ru: 'лендинг' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'bot', ru: 'бот' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'ota-ona', ru: 'родители' }, l: 56, t: 52, s: 20, d: 22, dl: 3.3 },
  { ch: { uz: "so'rov", ru: 'просьба' }, l: 90, t: 44, s: 20, d: 24, dl: 2.6 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (MD aynan)
const QUIZ_BANK = [
  { q: { uz: 'Mentor misolida buyurtmachi kim?', ru: 'Кто заказчик в примере Ментора?' }, opts: [{ uz: "Maktab to'garagi murabbiyi", ru: 'Тренер школьного кружка' }, { uz: 'Mahalladagi maydonning egasi', ru: 'Владелец площадки в махалле' }, { uz: 'Ilova qiladigan kompaniya', ru: 'Компания, которая делает приложения' }, { uz: "Upwork'dagi notanish odam", ru: 'Незнакомый человек на Upwork' }], correct: 0 },
  { q: { uz: 'Mentor buyurtmachiga nima qilib beradi?', ru: 'Что Ментор сделает для заказчика?' }, opts: [{ uz: "To'garak uchun o'yin", ru: 'Игру для кружка' }, { uz: "To'garak uchun lending", ru: 'Лендинг для кружка' }, { uz: "To'garak uchun kanal", ru: 'Канал для кружка' }, { uz: "To'garak uchun videolar", ru: 'Видео для кружка' }], correct: 1 },
  { q: { uz: 'Buyurtmada pul va kelishuv kim orqali bo\'ladi?', ru: 'Через кого в заказе деньги и договорённость?' }, opts: [{ uz: 'Sinfdoshingiz orqali', ru: 'Через одноклассника' }, { uz: 'Faqat o\'zingiz orqali', ru: 'Только через вас самих' }, { uz: 'Ota-onangiz orqali', ru: 'Через ваших родителей' }, { uz: 'Xalqaro sayt orqali', ru: 'Через международный сайт' }], correct: 2 },
  { q: { uz: 'Mentor birinchi xatida nimani so\'raydi?', ru: 'О чём Ментор просит в первом письме?' }, opts: [{ uz: 'Ilovasi uchun investitsiya', ru: 'Инвестиции в приложение' }, { uz: 'Kompaniyada doimiy ish', ru: 'Постоянную работу в компании' }, { uz: 'Ilovasini sotib olishni', ru: 'Купить его приложение' }, { uz: "Stajirovka bor-yo'qligini", ru: 'Есть ли стажировка' }], correct: 3 },
  { q: { uz: 'Uchrashuv taklifi kelsa, kim bilan borasiz?', ru: 'Если предложат встречу, с кем пойдёте?' }, opts: [{ uz: 'Faqat kattalar bilan', ru: 'Только со взрослыми' }, { uz: "Yolg'iz o'zim boraman", ru: 'Пойду один' }, { uz: 'Sinfdoshim bilan birga', ru: 'Вместе с одноклассником' }, { uz: 'Chatdagi tanishim bilan', ru: 'Со знакомым из чата' }], correct: 0 },
  { q: { uz: 'Upwork kabi saytning yosh shartini qayerdan bilasiz?', ru: 'Где узнать возрастное условие сайта вроде Upwork?' }, opts: [{ uz: 'Sinfdoshlarim aytgan gapdan', ru: 'Со слов одноклассников' }, { uz: "Saytdan, ota-ona bilan o'qib", ru: 'На сайте, прочитав с родителями' }, { uz: "Yoshimni kattaroq yozib ko'rib", ru: 'Указав возраст побольше' }, { uz: 'Kanaldagi reklama postidan', ru: 'Из рекламного поста в канале' }], correct: 1 },
  { q: { uz: 'Bitta xat nechta kompaniyaga yuboriladi?', ru: 'Скольким компаниям отправляют одно письмо?' }, opts: [{ uz: 'Ikkitaga', ru: 'Двум' }, { uz: 'Beshtaga', ru: 'Пяти' }, { uz: 'Bittaga', ru: 'Одной' }, { uz: "O'ntaga", ru: 'Десяти' }], correct: 2 },
  { q: { uz: "Kompaniya «hozir stajirovka yo'q» dedi. Keyin-chi?", ru: 'Компания ответила: «сейчас стажировки нет». Что дальше?' }, opts: [{ uz: "Har hafta yana so'rab turaman", ru: 'Буду спрашивать каждую неделю' }, { uz: "Xodimning telefonini so'rayman", ru: 'Попрошу телефон сотрудника' }, { uz: "Ofisiga borib, qayta so'rayman", ru: 'Пойду в офис и спрошу снова' }, { uz: 'Bu kompaniyaga qayta yozmayman', ru: 'Больше не пишу этой компании' }], correct: 3 },
  { q: { uz: 'Buyurtmachiga birinchi navbatda qanday ish qilib berasiz?', ru: 'Какую работу вы в первую очередь сделаете заказчику?' }, opts: [{ uz: "Kursda qurganimga o'xshash ish", ru: 'Похожую на то, что строил на курсе' }, { uz: 'Hali hech qilmagan katta ish', ru: 'Большую работу, которую ещё не делал' }, { uz: 'Buyurtmachi aytgan har qanday ish', ru: 'Любую работу, которую скажет заказчик' }, { uz: "Do'stim maslahat bergan ish", ru: 'Работу, которую посоветовал друг' }], correct: 0 },
  { q: { uz: 'Mentor buyurtmachi bilan qachon gaplashadi?', ru: 'Когда Ментор поговорит с заказчиком?' }, opts: [{ uz: "Lending to'liq tayyor bo'lgach", ru: 'Когда лендинг будет полностью готов' }, { uz: "Keyingi mashg'ulotdan keyin", ru: 'После следующего занятия' }, { uz: 'Kompaniyadan javob kelgandan keyin', ru: 'После ответа от компании' }, { uz: "Upwork'da profil ochilgandan keyin", ru: 'После открытия профиля на Upwork' }], correct: 1 },
  { q: { uz: "Xatning «Nima qurdim» qismiga nima yoziladi?", ru: 'Что пишут в часть письма «Что я построил»?' }, opts: [{ uz: 'Mahsulotning hamma funksiyasi', ru: 'Все функции продукта' }, { uz: 'Telefon raqami va uy manzili', ru: 'Номер телефона и домашний адрес' }, { uz: 'Mahsulot va u nima qilishi', ru: 'Продукт и что он делает' }, { uz: 'Kompaniyani maqtaydigan gap', ru: 'Фразу, хвалящую компанию' }], correct: 2 },
  { q: { uz: "Rejaning «Kim» qatoriga nima yoziladi?", ru: 'Что пишут в строку плана «Кто»?' }, opts: [{ uz: 'Ish tugaydigan kun', ru: 'День окончания работы' }, { uz: "Ishning narxi so'mda", ru: 'Цену работы в сумах' }, { uz: 'Buyurtmachining ismi', ru: 'Имя заказчика' }, { uz: 'Uning roli, ismsiz', ru: 'Его роль, без имени' }], correct: 3 },
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
const MentorPracticeStats = ({ live, screen, sig, yorliq }) => {
  const signal = sig ?? (PRACTICE_BASE + screen);
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        // Praktika signali 500+ zonasida (test <100, arena 100+ bilan to'qnashmaydi)
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, signal)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)) });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, signal]);
  if (!live || live.mode !== 'mentor') return null;
  const players = data.players || [];
  const doers = players.filter(p => data.doneIds.has(p.id));
  const waiting = players.filter(p => !data.doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.accent }}>{tr(yorliq || { uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
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

// 🃏 KARTOCHKALAR — 12 (MD jadvali aynan); ko'rinish qolipda (QKartochka), orqa yuz neytral (SABOQ P10)
const FLASHCARDS = [
  { front: { uz: 'Birinchi buyurtma qaysi uch yo\'ldan chiqishi mumkin?', ru: 'Из каких трёх путей может прийти первый заказ?' }, back: { uz: 'Xalqaro sayt, tanish doira va kompaniya', ru: 'Международный сайт, круг знакомых и компания' } },
  { front: { uz: 'Upwork kabi saytning yosh shartini qanday bilasiz?', ru: 'Как узнать возрастное условие сайта вроде Upwork?' }, back: { uz: "Ota-ona bilan, saytning o'zidan o'qiysiz", ru: 'Прочитать на самом сайте вместе с родителями' } },
  { front: { uz: 'Xalqaro saytda profil kimning nomidan ochiladi?', ru: 'От чьего имени открывают профиль на международном сайте?' }, back: { uz: "Faqat o'z nomingizdan — ota-ona yoki boshqa odam nomidan emas", ru: 'Только от своего имени — не от имени родителей или другого человека' } },
  { front: { uz: 'Frilans nima?', ru: 'Что такое фриланс?' }, back: { uz: 'Mustaqil, buyurtma bilan ishlash', ru: 'Самостоятельная работа по заказам' } },
  { front: { uz: 'Buyurtmachi kim?', ru: 'Кто такой заказчик?' }, back: { uz: 'Ish beradigan odam yoki kompaniya', ru: 'Человек или компания, которые дают работу' } },
  { front: { uz: 'Stajirovka nima?', ru: 'Что такое стажировка?' }, back: { uz: "Kompaniyada o'qib ishlash davri", ru: 'Период работы с обучением в компании' } },
  { front: { uz: 'Buyurtma rejasi qaysi uch qatordan iborat?', ru: 'Из каких трёх строк состоит план заказа?' }, back: { uz: 'Kim, nima va qachon', ru: 'Кто, что и когда' } },
  { front: { uz: "Birinchi buyurtmada pul va kelishuv kim orqali bo'ladi?", ru: 'Через кого в первом заказе деньги и договорённость?' }, back: { uz: 'Ota-ona orqali', ru: 'Через родителей' } },
  { front: { uz: 'Birinchi buyurtma uchun qanday ish tanlanadi?', ru: 'Какую работу выбирают для первого заказа?' }, back: { uz: "Kursda qurganingizga o'xshash ish: lending yoki bot", ru: 'Похожую на то, что вы строили на курсе: лендинг или бот' } },
  { front: { uz: 'Kompaniyaga xat qaysi uch qismdan iborat?', ru: 'Из каких трёх частей состоит письмо в компанию?' }, back: { uz: "Kimman, nima qurdim va nima so'rayman", ru: 'Кто я, что я построил и о чём прошу' } },
  { front: { uz: 'Kompaniya javob bermasa bu kursda nima qilinadi?', ru: 'Что делают на этом курсе, если компания не ответила?' }, back: { uz: 'Qayta yozilmaydi; boshqa kompaniyaga alohida xat yoziladi', ru: 'Повторно не пишут; другой компании пишут отдельное письмо' } },
  { front: { uz: 'Kompaniya uchrashuvga chaqirsa, kim bilan borasiz?', ru: 'Если компания позовёт на встречу, с кем пойдёте?' }, back: { uz: 'Faqat kattalar bilan', ru: 'Только со взрослыми' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('fr-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={FLASHCARDS.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="fr-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim uchun · Nechta · Muddat» + ①②③; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: 'buyurtma rejangiz va xatlaringiz', ru: 'ваш план заказа и письма' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '3 ish', ru: '3 дела' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_BANDLAR = [
  { uz: "Yozilmay qolgan qator yoki xat bo'lsa — uni yozing.", ru: 'Если осталась ненаписанная строка или письмо — допишите.' },
  { uz: "Buyurtma rejangizni ota-onangizga ko'rsating va buyurtmachi bilan qachon birga gaplashishingizni kelishing.", ru: 'Покажите план заказа родителям и договоритесь, когда вместе поговорите с заказчиком.' },
  { uz: "Ixtiyoriy: xohlasangiz — ota-onangiz bilan ikki kompaniyani tanlab, rasmiy aloqa manzilini topib, xatlarni yuboring; javob kelmasa, qayta yozmang.", ru: 'По желанию: вместе с родителями выберите две компании, найдите их официальный адрес для связи и отправьте письма; если ответа нет, повторно не пишите.' }
];
const HW_RAQAM = ['①', '②', '③'];
const HwCard = ({ keyingi }) => (
  <div className="card fr-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="fr-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="fr-hw-q"><span className="fr-hw-k">{tr(r.k)}</span><span className="fr-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="fr-hw-qadam">{HW_BANDLAR.map((b, i) => <li key={i}><i>{HW_RAQAM[i]}</i><span>{tr(b)}</span></li>)}</ol>
    {keyingi && <span className="fr-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (5 holat, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · keyingi dars · nishonlar =====
// «Bugungi asosiy fikr» qutisi va artefakt-strip — ko'rsatilmaydi (E 50). Belgi ✓ — faqat to'liq holatda.
const SARLAVHA = {
  toliq: { uz: 'Buyurtma rejasi va ikki xat yozildi.', ru: 'План заказа и два письма написаны.' },
  xatYoq: { uz: 'Buyurtma rejasi yozildi — xatlar hali tugamagan.', ru: 'План заказа написан — письма ещё не готовы.' },
  rejaYoq: { uz: 'Xat yozildi — buyurtma rejasi hali tugamagan.', ru: 'Письмо написано — план заказа ещё не готов.' },
  qisman: (n) => ({ uz: `Buyurtma rejasi hali tugamagan: ${n}${NB}/${NB}3 qator.`, ru: `План заказа ещё не готов: ${n}${NB}/${NB}3 строк${n === 1 ? 'а' : 'и'}.` }),
  bosh: { uz: 'Buyurtma rejasi va xatlar hali yozilmagan.', ru: 'План заказа и письма ещё не написаны.' }
};
const RECAP = [
  { uz: "Upwork kabi xalqaro saytlarning yosh shartini ota-ona bilan saytning o'zidan o'qiysiz.", ru: 'Возрастное условие международных сайтов вроде Upwork читаете на самом сайте вместе с родителями.' },
  { uz: 'Bu darsda buyurtma rejasi uch qatordan iborat: kim, nima va qachon.', ru: 'На этом уроке план заказа состоит из трёх строк: кто, что и когда.' },
  { uz: 'Birinchi buyurtma — tanish doiradan; pul va kelishuv — ota-ona orqali.', ru: 'Первый заказ — из круга знакомых; деньги и договорённость — через родителей.' },
  { uz: "Bu darsda kompaniyaga xat uch qismdan iborat: kimman, nima qurdim va nima so'rayman.", ru: 'На этом уроке письмо в компанию состоит из трёх частей: кто я, что я построил и о чём прошу.' },
  { uz: 'Har kompaniyaga alohida xat; bu kursda javob kelmasa — qayta yozmaysiz.', ru: 'Каждой компании — отдельное письмо; на этом курсе, если ответа нет, повторно не пишете.' }
];
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
  // Holat — o'quvchining saqlangan ishidan (pm-m12d10-ish); mentor proyektorida — Mentor misoli yozilgan (to'liq sarlavha)
  const ish = ishOl(); const n = rejaSoni(ish.buyurtma); const x = ish.xatlar.length;
  const holat = isMentorL ? 'toliq' : n === 3 ? (x === 2 ? 'toliq' : 'xatYoq') : x > 0 ? 'rejaYoq' : n > 0 ? 'qisman' : 'bosh';
  const sarlavha = holat === 'qisman' ? SARLAVHA.qisman(n) : SARLAVHA[holat];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Qaysi xalqaro dasturga ariza berasiz?»</b></>, ru: <>Следующий урок — <b>«В какую международную программу подать заявку?»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('fr-yakun', holat !== 'toliq' && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={tr(sarlavha)}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmFreelanceLesson({ lang: langProp, onFinished, liveToken }) {
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
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice, earn }), [missed, missTry, fpPractice, earn]); // earn — 7-ekran nishonlari (saqlashga qarab)
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === NAMUNA (skelet) — darsning o'z vizuali: almashtiriladi. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        /* === 14-Modul 10-dars — darsning o'z vizuali (prefiks fr-): IshVaraq (telefon · Yo'llar · Buyurtma · Xatlar) · uchish · reja va xat kartalari. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        .fr-mj { font-weight: 800; font-style: normal; color: ${MJ_RANG}; white-space: nowrap; }
        @keyframes fr-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes fr-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes fr-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: 0 0 0 7px ${fon(T.accent, 0)}; } }
        @keyframes fr-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes fr-yashil { 0% { background: ${T.okFon}; border-color: ${T.ok}; } 100% { background: ${T.paper}; } }
        @keyframes fr-pop { 0% { transform: scale(1.18); } 100% { transform: scale(1); } }
        @keyframes fr-sirg { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
        @keyframes fr-tush { 0% { transform: translateY(-14px); opacity: 0; } 60% { transform: translateY(2px); opacity: 1; } 100% { transform: none; } }
        @keyframes fr-toq { from { color: ${fon(T.ink, 0.18)}; border-color: ${T.line}; } to { color: ${T.ink}; border-color: ${fon(T.accent, 0.45)}; } }
        @keyframes fr-kartakir { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, scale yo'q (E 40) */
        .fr-halqa { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: fr-puls 2.2s ease-out .3s 3; }
        .btn-white-accent.fr-halqa { outline-offset: 3px; }
        /* Tanlov guruhi — har variantning o'z yengil chegarasi, navbatma-navbat 2 marta (E 40) */
        .fr-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: fr-chorla-v 1.8s ease-out .5s 2; }
        .fr-k.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .fr-k.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: fr-chorla 1.8s ease-out .5s 2; }
        .q-bashorat .q-chip:nth-child(2) { animation-delay: .75s; } .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        .fr-bash .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 14px; row-gap: 6px; padding: 10px 14px; }
        .fr-bash .q-bashorat > .q-yorliq { flex-basis: 100%; }
        @media (min-width: 761px) { .fr-k .q-split { grid-template-columns: minmax(0,1.25fr) minmax(0,1fr); gap: 28px; } }
        .fr-k, .fr-yakun { display: flex; flex-direction: column; flex: 1 0 auto; }
        .fr-harakat { display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 14px; row-gap: 8px; }
        .fr-qadamlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .fr-qadamlar .q-chip i { font-style: normal; font-weight: 800; color: ${T.accent}; margin-right: 7px; }
        .fr-qadamlar .q-chip.ok i { color: ${T.ok}; }
        .fr-qadamlar .q-chip.fr-joriy { animation: fr-puls 2.2s ease-out .3s 3; }
        p.fr-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        /* Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42) */
        .q-xulosa .fr-xq-t { display: block; font-size: 12.5px; font-weight: 700; color: ${T.ok}; margin-bottom: 5px; }
        .q-xulosa .fr-xq-t.xato { color: ${T.ink2}; }
        .q-xulosa .fr-xq-m { display: block; }
        .q-xulosa .fr-xq-i { display: block; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; margin-top: 8px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.25)}; }
        /* IshVaraq: chapda telefon, o'ngda varaq */
        .fr-sahna { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 22px; align-items: start; }
        .fr-sahna.tel-yoq { grid-template-columns: minmax(0,1fr); }
        .fr-sahna-tel { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .fr-sahna-y { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; }
        .fr-tel { width: 170px; height: 272px; border-radius: 26px; background: #1E1B26; padding: 9px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.5); display: flex; flex: none; }
        .fr-tel-ekran { flex: 1; min-width: 0; background: ${T.paper}; border-radius: 18px; padding: 13px 12px 12px; display: flex; flex-direction: column; gap: 3px; transition: opacity .3s; }
        .fr-tel.ketdi .fr-tel-ekran { opacity: .3; }
        .fr-tel-nom { font-size: 13px; }
        .fr-tel-y { margin-top: 8px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: ${T.ink2}; }
        .fr-tel-vaqt { font-size: 14.5px; color: ${T.ink}; }
        .fr-tel-joy { font-size: 12px; color: ${T.ink2}; }
        .fr-tel-son { margin-top: 10px; font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .fr-tel-doira { display: flex; gap: 3px; flex-wrap: wrap; }
        .fr-tel-doira i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .fr-tel-doira i.bor { background: ${MJ_RANG}; }
        .fr-tel-tugma { margin-top: auto; text-align: center; font-size: 12px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border-radius: 10px; padding: 8px 6px; }
        /* Kichik lending kartasi */
        .fr-lend { width: 170px; display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 0 0 9px; overflow: hidden; box-shadow: 0 10px 22px -14px rgba(${T.shadowBase},0.45); }
        .fr-lend.osti { animation: fr-kir .45s ease-out both; }
        .fr-lend-bar { display: flex; gap: 4px; padding: 6px 8px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .fr-lend-bar i { width: 6px; height: 6px; border-radius: 50%; background: ${T.line}; }
        .fr-lend-h { padding: 0 10px; font-size: 14px; font-weight: 800; color: ${T.ink}; white-space: nowrap; animation: fr-kir .4s ease-out both; }
        .fr-lend-q { margin: 0 10px; height: 6px; border-radius: 3px; background: ${T.bg}; }
        .fr-lend-q.q2 { width: 60%; }
        .fr-lend-t { margin: 2px 10px 0; width: 64px; height: 16px; border-radius: 6px; background: ${MJ_RANG}; }
        /* Kichik brauzer (Upwork, logotipsiz) */
        .fr-br { position: relative; border: 1.5px solid ${T.line}; border-radius: 10px; overflow: hidden; background: ${T.paper}; animation: fr-kir .4s ease-out both; }
        .fr-br-bar { display: flex; align-items: center; gap: 4px; padding: 5px 8px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .fr-br-bar i { width: 6px; height: 6px; border-radius: 50%; background: ${T.line}; }
        .fr-br-url { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; background: ${T.paper}; border-radius: 6px; padding: 1px 8px; }
        .fr-br-ich { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 8px 10px 10px; min-height: 64px; }
        .fr-br-nom { font-size: 16px; font-weight: 800; letter-spacing: -0.01em; }
        .fr-br-q { height: 7px; border-radius: 3px; background: ${T.bg}; } .fr-br-q.q2 { width: 65%; }
        .fr-qulf { position: absolute; right: 8px; bottom: 8px; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 10px 3px 6px; animation: fr-tush .55s ease-out .35s both; }
        .fr-qulf svg { width: 15px; height: 15px; }
        .fr-br.ix .fr-br-ich { min-height: 0; padding: 7px 10px 34px; }
        /* Rol belgisi — doiracha + yorliq (odam figurasi emas) */
        .fr-rol { display: inline-flex; align-items: center; gap: 8px; animation: fr-kir .4s ease-out both; }
        .fr-rol-b { position: relative; width: 38px; height: 38px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; display: inline-flex; align-items: center; justify-content: center; flex: none; }
        .fr-rol-b svg { width: 21px; height: 21px; }
        .fr-rol-sayt { position: absolute; right: -4px; bottom: -6px; width: 24px; height: 17px; border-radius: 4px; background: ${T.paper}; border: 1.5px solid ${MJ_RANG}; box-shadow: inset 0 4px 0 ${fon(MJ_RANG, 0.35)}; animation: fr-pop .45s ease-out; }
        .fr-rol-o { display: flex; flex-direction: column; line-height: 1.2; }
        .fr-rol-o b { font-size: 14px; font-weight: 700; color: ${T.ink}; white-space: nowrap; }
        .fr-rol-o small { font-size: 11px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .05em; }
        /* Varaq va bo'limlar */
        .fr-varaq { display: flex; flex-direction: column; gap: 8px; min-width: 0; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 16px; padding: 12px 14px; box-shadow: 0 12px 28px -18px rgba(${T.shadowBase},0.35); }
        .fr-varaq-h { font-size: 13px; font-weight: 800; color: ${T.ink2}; letter-spacing: .01em; }
        .fr-bolim { min-width: 0; border-radius: 12px; }
        .fr-bolim.joriy, .fr-bolim.toliq { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border: 2px solid ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}; }
        .fr-bolim.toliq { border: 1.5px solid ${T.line}; box-shadow: none; }
        .fr-bolim.joriy .fr-bolim-h, .fr-bolim.toliq .fr-bolim-h { font-size: 14px; font-weight: 800; color: ${T.accent}; }
        .fr-bolim.toliq .fr-bolim-h { color: ${T.ink}; }
        .fr-bolim.ix { display: flex; align-items: center; gap: 12px; padding: 4px 12px; background: ${T.bg}; }
        .fr-bolim.ix .fr-bolim-h { font-size: 13px; font-weight: 800; color: ${T.ink2}; min-width: 72px; }
        .fr-ix { display: flex; flex-wrap: wrap; gap: 6px 12px; }
        .fr-ix em { font-style: normal; font-size: 13px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .fr-ix em.on { color: ${T.accent}; }
        .fr-ix em.ok { color: ${T.ok}; }
        /* Yo'llar (2-ekran) */
        .fr-yollar-q { display: flex; flex-direction: column; gap: 8px; }
        .fr-yollar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; }
        .fr-yol { display: flex; flex-direction: column; gap: 7px; min-width: 0; min-height: 150px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px 11px; animation: fr-kir .4s ease-out both; }
        .fr-yol.bosh { border-style: dashed; background: ${T.bg}; animation: none; }
        .fr-yol.bugun { border-color: ${fon(T.accent, 0.55)}; }
        .fr-yol-nom { font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .fr-yol-ust { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 8px; }
        .fr-yol-holat { align-self: flex-start; font-style: normal; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; animation: fr-kir .4s ease-out .3s both; }
        .fr-yol-holat.acc { color: ${T.accent}; background: ${T.accentSoft}; }
        .fr-rollar { display: flex; flex-direction: column; gap: 6px; }
        .fr-sahna.tugadi .fr-rollar { flex-direction: row; flex-wrap: wrap; gap: 6px 14px; }
        .fr-sahna.tugadi .fr-yol { min-height: 0; }
        .fr-sahna.tugadi .fr-br-q.q2 { display: none; }
        .fr-sahna.tugadi .fr-br-ich { min-height: 0; padding-bottom: 12px; }
        .fr-sahna.tugadi .fr-bolim.joriy { gap: 6px; padding: 8px 12px; }
        .fr-sahna.tugadi .fr-buy { gap: 4px; }
        .fr-sahna.tugadi .fr-katak { min-height: 38px; padding: 4px 12px; }
        .fr-sahna.tugadi .fr-rol-b { width: 32px; height: 32px; }
        .fr-sahna.tugadi .fr-bino { width: 46px; height: 46px; }
        .fr-sahna.tugadi .fr-varaq { gap: 6px; padding: 10px 14px; }
        .fr-konv-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; color: ${T.ink}; border: 1.5px dashed ${fon(T.accent, 0.6)}; border-radius: 8px; padding: 2px 10px; background: ${T.paper}; animation: fr-kir .35s ease-out both; }
        .fr-konv-chip svg { width: 17px; height: 17px; color: ${T.accent}; }
        .fr-konv-chip.tushdi { animation: fr-pop .45s ease-out; }
        .fr-bq { display: flex; align-items: center; gap: 10px; }
        .fr-bino { width: 56px; height: 56px; border-radius: 12px; background: ${T.bg}; color: ${T.ink}; display: inline-flex; align-items: center; justify-content: center; flex: none; animation: fr-kir .4s ease-out both; }
        .fr-bino svg { width: 34px; height: 34px; }
        .fr-yol-q { font-size: 14px; font-weight: 600; color: ${T.ink}; line-height: 1.35; }
        p.fr-qoida { margin: 0; font-size: 14px; line-height: 1.45; color: ${T.ink2}; animation: fr-kir .4s ease-out .2s both; }
        /* Buyurtma kataklari */
        .fr-buy { display: flex; flex-direction: column; gap: 6px; }
        .fr-katak { position: relative; display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: border-color .3s, background .3s; }
        .fr-katak.bosh { border-style: dashed; background: ${T.bg}; }
        .fr-katak.kutadi { border-style: dashed; border-color: ${fon(T.accent, 0.6)}; background: ${T.bg}; }
        .fr-katak.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .fr-katak.yangi { animation: fr-yashil 1.1s ease-out both; }
        .fr-katak-n { flex: none; min-width: 64px; font-size: 13px; font-weight: 800; color: ${T.ink2}; }
        .fr-katak-m { flex: 1; min-width: 0; font-size: 15px; line-height: 1.4; color: ${T.ink}; animation: fr-sirg .45s ease-out both; }
        .fr-katak-b { flex: 1; }
        .fr-katak-yon { display: flex; flex-wrap: wrap; gap: 8px 14px; margin-left: auto; }
        p.fr-pul { margin: 2px 0 0; font-size: 14px; font-weight: 600; color: ${T.ink2}; transition: color .3s; }
        p.fr-pul.ajrat { color: ${T.accent}; font-weight: 800; }
        /* Xatlar — konvert-kartalar */
        .fr-konvlar { display: flex; flex-direction: column; gap: 8px; }
        .fr-konvlar.ikki { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; align-items: start; }
        .fr-konvlar-q { display: flex; flex-direction: column; gap: 8px; }
        .fr-konv { display: flex; flex-direction: column; gap: 6px; min-width: 0; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px 12px; animation: fr-kir .4s ease-out both; }
        .fr-konv.bosh { border-style: dashed; background: ${T.bg}; min-height: 46px; }
        .fr-konv.kutadi { border-color: ${fon(T.accent, 0.6)}; }
        .fr-konv.tushdi { animation: fr-pop .45s ease-out; }
        .fr-konv.yopiq { background: ${T.paper}; }
        .fr-konv.kulrang { background: ${T.bg}; }
        .fr-konv.kulrang .fr-konv-h, .fr-konv.kulrang .fr-konv-h svg { color: ${T.ink2}; }
        .fr-konv.acc { border: 2px solid ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}; }
        .fr-konv.yangi { animation: fr-yashil 1.1s ease-out both; }
        .fr-konv-h { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 13.5px; color: ${T.ink}; }
        .fr-konv-h svg { width: 19px; height: 19px; color: ${T.accent}; flex: none; }
        .fr-konv-h b { font-weight: 800; white-space: nowrap; }
        .fr-konv-h span { font-weight: 600; color: ${T.ink2}; }
        .fr-konv-qisqa { font-size: 14px; line-height: 1.45; color: ${T.ink}; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .fr-konv-y { align-self: flex-start; font-style: normal; font-size: 12px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 2px 10px; }
        .fr-konv.kulrang .fr-konv-y { color: ${T.ink2}; background: ${T.paper}; }
        .fr-xat-s { font-size: 14px; font-weight: 700; color: ${T.ink}; }
        .fr-xat-q { display: flex; flex-direction: column; gap: 3px; }
        .fr-xat-m { font-size: 14.5px; line-height: 1.45; color: ${T.ink}; animation: fr-sirg .45s ease-out both; }
        .fr-xat-b { display: flex; align-items: center; min-height: 28px; padding: 0 10px; border: 1.5px dashed ${T.line}; border-radius: 8px; }
        .fr-xat-b small { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        p.fr-xat-k { margin: 0; font-size: 13px; line-height: 1.4; color: ${T.ink2}; animation: fr-kir .35s ease-out both; }
        .fr-xat-o { font-size: 14px; font-weight: 600; color: ${T.ink}; }
        .fr-xat-o em { font-style: normal; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        p.fr-xavf { margin: 0; font-size: 14px; font-weight: 700; color: ${T.ink}; animation: fr-kir .4s ease-out .2s both; }
        .fr-tahrir { margin-left: auto; border: none; background: ${T.bg}; color: ${T.accent}; border-radius: 8px; width: 26px; height: 26px; cursor: pointer; font-size: 13px; flex: none; }
        .fr-tahrir:hover { background: ${T.accentSoft}; }
        /* Uchish — fixed nusxa (portal) */
        .fr-uchar { position: fixed; z-index: 1300; pointer-events: none; transform-origin: center; transition: transform .65s cubic-bezier(.45,.05,.3,1); display: flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; }
        .fr-uchar.matn { justify-content: flex-start; background: ${T.paper}; border: 2px solid ${T.ok}; border-radius: 10px; padding: 6px 12px; box-shadow: 0 18px 36px -14px ${fon(T.ink, 0.35)}; overflow: hidden; }
        .fr-uchar.konv { background: ${T.paper}; border: 2px solid ${T.accent}; border-radius: 14px; box-shadow: 0 18px 36px -14px ${fon(T.ink, 0.35)}; }
        .fr-uchar.sayt, .fr-uchar.tel { align-items: flex-start; }
        .fr-uchar-m { font-size: 15px; line-height: 1.4; color: ${T.ink}; }
        .fr-uchar-konv { display: inline-flex; align-items: center; gap: 8px; color: ${T.accent}; font-size: 18px; }
        .fr-uchar-konv svg { width: 40px; height: 40px; }
        .fr-uchar-konv b { color: ${T.ink}; }
        /* 0-ekran: uch nomsiz yo'l */
        .fr-kl { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 0; align-items: end; }
        .fr-kl-tel { display: flex; flex-direction: column; gap: 8px; }
        .fr-kl-yollar { display: flex; flex-direction: column; justify-content: space-around; height: 272px; padding: 26px 0; }
        .fr-kl-q { display: flex; align-items: center; animation: fr-kir .4s ease-out both; }
        .fr-kl-chiziq { position: relative; flex: 1; height: 4px; border-radius: 2px; background: ${fon(T.ink2, 0.28)}; overflow: hidden; }
        .fr-kl-chiziq i { position: absolute; inset: 0; background: ${T.accent}; transform-origin: left; transform: scaleX(0); transition: transform .6s ease-out; }
        .fr-kl-q.on .fr-kl-chiziq i { transform: scaleX(1); }
        .fr-kl-uch { width: 58px; height: 58px; flex: none; border-radius: 50%; border: 2px dashed ${fon(T.ink2, 0.4)}; display: inline-flex; align-items: center; justify-content: center; transition: border-color .3s, background .3s; }
        .fr-kl-q.on .fr-kl-uch { border: 2px solid ${T.accent}; background: ${T.accentSoft}; transition-delay: .45s; }
        .fr-kl-uch > span { animation: fr-pop .45s ease-out .5s both; color: ${T.accent}; }
        .fr-kl-br { display: flex; gap: 3px; width: 32px; height: 24px; border: 2px solid currentColor; border-radius: 5px; padding: 3px 4px; }
        .fr-kl-br i { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
        .fr-kl-dr { display: flex; gap: 3px; }
        .fr-kl-dr i { width: 10px; height: 10px; border-radius: 50%; background: currentColor; }
        .fr-kl-bino svg { width: 30px; height: 30px; display: block; }
        /* 1-ekran: varaq skeleti o'zi yoziladi */
        .fr-reja { display: flex; flex-direction: column; gap: 12px; }
        .fr-reja-teg { font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 6px 10px; }
        .fr-skelet .fr-varaq { gap: 10px; }
        .fr-sk-q { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; animation: fr-toq .5s ease-out both; }
        .fr-sk-q b { font-size: 13.5px; font-weight: 800; }
        .fr-sk-uyalar { display: flex; gap: 6px; }
        .fr-sk-uyalar i { flex: 1; height: 22px; border-radius: 6px; border: 1.5px dashed ${T.line}; animation: fr-kir .35s ease-out both; }
        .fr-sk-q.xatlar .fr-sk-uyalar i { height: 34px; }
        /* Testlardan keyingi kichik vizual */
        .fr-test-viz { margin-top: 2px; }
        .fr-mini { display: flex; flex-direction: column; gap: 8px; max-width: 520px; animation: fr-kir .35s ease-out both; }
        .fr-mini-x { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 8px; }
        .fr-mini-x .fr-br { width: 220px; }
        .fr-mini-y { align-self: flex-start; font-size: 13px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 10px; }
        /* 7-ekran: chiziq, varaq va karta */
        .fr-strip { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .fr-strip-y { font-size: 12px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 5px 11px; margin-right: 4px; white-space: nowrap; }
        .fr-strip .q-chip.fr-tab { padding: 6px 10px; font-size: 12.5px; }
        .fr-strip .q-chip.fr-tab i { font-style: normal; font-weight: 800; margin-right: 6px; color: ${T.accent}; }
        .fr-strip .q-chip.fr-tab.ok i { color: ${T.ok}; }
        .fr-strip .q-chip.fr-tab.yangi { animation: fr-pop .5s ease-out; }
        .fr-ust { display: grid; grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); gap: 18px; align-items: start; }
        .fr-ust-chap, .fr-ust-ong { min-width: 0; }
        .fr-xat-nishon { display: flex; flex-direction: column; gap: 2px; }
        .fr-konv.ochiq { background: ${T.paper}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); }
        .fr-karta { background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 9px; animation: fr-kartakir .4s ease-out both; }
        .fr-karta.err { box-shadow: inset 0 0 0 1.5px ${T.err}, 0 10px 26px -10px rgba(${T.shadowBase},0.22); }
        .fr-karta.xat { gap: 8px; }
        .fr-maydon { position: relative; }
        .fr-maydon-n { position: absolute; left: 11px; top: 10px; width: 22px; height: 22px; border-radius: 7px; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; }
        textarea.fr-inp { display: block; width: 100%; resize: vertical; min-height: 44px; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.45; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px 14px 22px 42px; outline: none; }
        textarea.fr-inp.nsiz { padding: 10px 14px; min-height: 0; resize: none; }
        .fr-xat-ich textarea.fr-inp { padding-bottom: 10px; background: ${T.paper}; }
        textarea.fr-inp:focus { border-color: ${T.accent}; }
        textarea.fr-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        textarea.fr-inp.qoshildi { animation: fr-yashil 1s ease-out; }
        .fr-maydon.chorla textarea.fr-inp { border-color: ${fon(T.accent, 0.6)}; animation: fr-chorla 1.8s ease-out .4s 2; }
        .fr-sanoq-b { position: absolute; right: 12px; bottom: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; }
        p.fr-kulrang { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.fr-yana { margin: 0; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .fr-yordam { background: ${T.bg}; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
        .fr-yordam p { margin: 0; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .fr-yordam p + p { font-size: 12.5px; color: ${T.ink2}; }
        .fr-karta-tug { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .fr-karta-tug .fr-o { margin-left: auto; }
        .fr-sorov { display: flex; gap: 8px; flex-wrap: wrap; }
        .fr-sorov-b { font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.45)}; border-radius: 10px; padding: 7px 16px; cursor: pointer; transition: background .2s, border-color .2s; }
        .fr-sorov-b:hover { background: ${T.accentSoft}; }
        .fr-sorov-b.on { color: ${T.accent}; background: ${T.accentSoft}; border-color: ${T.accent}; }
        .fr-sorov.kutadi .fr-sorov-b { animation: fr-chorla 1.8s ease-out .3s 2; }
        .fr-sorov.kutadi .fr-sorov-b + .fr-sorov-b { animation-delay: .6s; }
        .fr-xat-ich { display: flex; flex-direction: column; gap: 6px; background: ${T.bg}; border-radius: 12px; padding: 10px 12px; }
        textarea.fr-nusxa { width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 10px; resize: none; }
        .fr-fokus { display: flex; flex-direction: column; gap: 12px; }
        .q-mustaqil:has(.fr-ust), .q-mustaqil:has(.fr-fokus) { max-width: none; }
        .fr-sahna.katta .fr-katak-m { font-size: 15px; }
        .fr-sahna.katta .fr-varaq { gap: 6px; padding: 10px 14px; }
        .fr-sahna.katta .fr-bolim.toliq { flex-direction: row; align-items: flex-start; gap: 12px; padding: 8px 12px; }
        .fr-sahna.katta .fr-bolim.toliq .fr-bolim-h { min-width: 72px; padding-top: 9px; }
        .fr-sahna.katta .fr-bolim.toliq .fr-bolim-i { flex: 1; min-width: 0; }
        .fr-sahna.katta .fr-buy { gap: 4px; }
        .fr-sahna.katta .fr-katak { min-height: 38px; padding: 4px 8px 4px 12px; }
        .fr-sahna.katta .fr-konv { gap: 4px; padding: 8px 12px; }
        .fr-sahna.katta .fr-konv-qisqa { font-size: 14.5px; }
        /* Kartochka: birinchi bosishgacha yengil halqa va ipucha (SABOQ 16, E 49); orqa yuz neytral (F-1008-593) */
        .fr-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: fr-puls 1.8s ease-out .4s 3; }
        .fr-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .fr-flash .fc-front { box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        p.fr-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        p.fr-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* Yakun: ✓ faqat to'liq holatda; uyga vazifa kartasi */
        .fr-yakun.belgisiz .done-chip .tick { display: none; }
        .fr-hw { display: flex; flex-direction: column; gap: 12px; }
        .fr-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .fr-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .fr-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .fr-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.fr-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .fr-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .fr-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .fr-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        @media (max-width: 760px) { .fr-ust { grid-template-columns: minmax(0,1fr); } .fr-ust-ong { order: -1; } }
        @media (max-width: 640px) {
          .fr-sahna { grid-template-columns: minmax(0,1fr); } .fr-sahna-tel { justify-self: center; }
          .fr-yollar { grid-template-columns: minmax(0,1fr); } .fr-yol { min-height: 0; }
          .fr-konvlar.ikki { grid-template-columns: minmax(0,1fr); }
          .fr-kl { grid-template-columns: 150px minmax(0,1fr); } .fr-kl .fr-tel { transform: none; }
          .fr-katak { flex-wrap: wrap; } .fr-katak-yon { margin-left: 0; }
          .fr-hw-karta { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fr-yol, .fr-konv, .fr-katak, .fr-katak-m, .fr-xat-m, .fr-rol, .fr-qulf, .fr-br, .fr-lend.osti, .fr-sk-q, .fr-sk-uyalar i, .fr-kl-q, .fr-kl-uch > span, .fr-karta, textarea.fr-inp, .fr-maydon.chorla textarea.fr-inp, .fr-strip .q-chip, .fr-flash .fc-front, .fr-mini, p.fr-xat-k, p.fr-xavf, p.fr-qoida, .fr-yol-holat, .fr-rol-sayt, .fr-bino { animation: none !important; }
          .fr-kl-chiziq i, .fr-kl-uch, .fr-uchar { transition: none !important; }
          .fr-sk-q { color: ${T.ink}; }
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
        @media (min-width: 1200px) { .zoomable:not(.zoom-on) > .zoom-btn { top: 8px; right: 8px; } .zoomable.z-float:not(.zoom-on) > .zoom-btn { visibility: visible; } }
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
