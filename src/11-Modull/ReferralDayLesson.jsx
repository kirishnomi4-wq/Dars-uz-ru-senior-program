import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul 10-dars «Loyiha kuni: taklif havolasi va mukofot» (m11-10) — skeletdan (08.10.2026, 2-to'lqin C); MD: feedback/F-1007-13modul/10-ReferralDay-v3.md (+ 10-FILTR.md)
// 12 ekran: QKirish · QReja · QTushuncha (havola yo'li) · amaliyot 1 (QBlok) · test · QTushuncha (mukofot qoidasi) · amaliyot 2 · test · amaliyot 3 · podium · QKartochka · QYakun.
// Bitta vizual — TaklifSahna (1-telefon · brauzer/lending · Backend `oyinchilar` · 2-telefon; konvert havola · apk · sorov).
// Yangi saqlash kaliti yo'q (tayanch 8: loyiha kuni). O'qiydi: pm-m9d8-platforma.trek (yozmaydi). Blok holati, {ulashish joyi}, tekshiruv kartalari, «Fayl navbatda» — dars holatida (ccProgress).
// Real pul yo'q: mukofot — test rejimdagi Pro muddati; karta maydoni hech qayerda chizilmaydi. ⛔ «qur» darvozalari (telefon, Expo Go, Render, brauzer ko'rinishi, Mentor repo) sinalmagan.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QIzoh, QXato, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm11-10-v1', lessonTitle: { uz: 'Loyiha kuni: taklif havolasi va mukofot', ru: 'День проекта: ссылка-приглашение и награда' } };
// 12 ekran (loyiha kuni, tayanch 4): kirish → reja → tushuncha (havola yo'li) → 1-amaliyot → 1-savol → tushuncha (mukofot qoidasi) → 2-amaliyot → 2-savol → 3-amaliyot → podium → kartochkalar → yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'a3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal, deskSignal }) => {
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
  // 199-qonun (SABOQ P11): kompyuterda ham tugash signalida natija pastki panel ostida qolmasin — faqat signal o'zgarganda, birinchi chizishda emas
  const deskOld = useRef(deskSignal);
  useEffect(() => {
    if (deskOld.current === deskSignal) return;
    deskOld.current = deskSignal;
    if (!deskSignal || isNarrow) return;
    const el = contentRef.current;
    if (!el) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => { if (el && el.scrollHeight > el.clientHeight + 1) el.scrollTo({ top: el.scrollHeight, behavior: kam ? 'auto' : 'smooth' }); }, 320);
    return () => clearTimeout(t);
  }, [deskSignal, isNarrow]);
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Final tartib-mashqi yo'q (loyiha kuni, 172). `practice: -1` — sentinel (uch blok, PRACTICE_BASE signali).
// ⚠️ To'g'ri javob O'RNI (MD ✔) qurilgandan keyin o'zgarmaydi: s4 — C (2), s7 — A (0).
const INLINE_KEYS = { s4: 2, s7: 0, practice: -1 };
// 📖 RECAPS — har ballik testga 3 karta (kalit = ekran INDEKSI; S-026: raqam)
const rcRaqam = (n) => <b className="rf-rc-n">{n}</b>;
const RECAPS = {
  4: {
    title: { uz: "Taklif kodi APK'ga havoladan o'tmaydi", ru: 'Код приглашения не переходит из ссылки в APK' },
    cards: [
      { ic: null, h: { uz: 'Havola lendingni ochadi: «Taklif kodi: AB12CD».', ru: 'Ссылка открывает лендинг: «Taklif kodi: AB12CD».' }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: "APK o'rnatiladi — taklif kodi ilovaga o'tmaydi.", ru: 'Устанавливается APK — код приглашения в приложение не переходит.' }, body: { uz: rcRaqam(2), ru: rcRaqam(2) } },
      { ic: null, h: { uz: "Yangi o'yinchi taklif kodini formaga o'zi yozadi.", ru: 'Новый игрок сам вводит код приглашения в форму.' }, body: { uz: rcRaqam(3), ru: rcRaqam(3) }, ask: { uz: "Taklif kodisiz ham ro'yxatdan o'tsa bo'ladimi?", ru: 'Можно ли зарегистрироваться и без кода приглашения?' } }
    ]
  },
  7: {
    title: { uz: 'Mukofot qoidasining uch sharti', ru: 'Три условия правила награды' },
    cards: [
      { ic: null, h: { uz: 'Yangi hisob asosiy harakat qildi.', ru: 'Новый аккаунт сделал основное действие.' }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: 'Taklif qilgan bilan boshqa qurilmada ochilgan.', ru: 'Открыт на другом устройстве, чем у пригласившего.' }, body: { uz: rcRaqam(2), ru: rcRaqam(2) } },
      { ic: null, h: { uz: "Namuna hisob emas; haftasiga ko'pi bilan 2 mukofot.", ru: 'Не образцовый аккаунт; не больше 2 наград в неделю.' }, body: { uz: rcRaqam(3), ru: rcRaqam(3) }, ask: { uz: 'Oiladagi bitta telefondan ochilgan hisob sanaladimi?', ru: 'Засчитывается ли аккаунт, открытый с одного семейного телефона?' } }
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

// ===== BITTA VIZUAL — «taklif yo'li» sahnasi (163/180): bitta manba TAKLIF_SAHNA + NAMUNA_KOD + NAMUNA_HAVOLA + ESKI_HAVOLA + MENTOR_SANOQ + HISOBLAR + QOIDA_KATAKLAR + QOIDA_QATORI + XABAR_TOPILMADI =====
// Chapda «1-telefon · tashkilotchi» (170×272, yorliq ramka ustida) · o'rtada tepada «brauzer · lending», pastda «Backend» tuguni (mini-jadval `oyinchilar`) · o'ngda «2-telefon · yangi o'yinchi».
// Konvert turlari: havola (1-telefon → brauzer) · apk (brauzer → 2-telefon) · sorov (2-telefon → Backend). Odam chizilmaydi (SABOQ P1); karta maydoni hech bir holatda chizilmaydi; logotip yo'q.
// qolip-maket: rf-ulash rf-och rf-apk rf-yoz rf-sanoq rf-qoida rf-halqa rf-trek rf-nusxa rf-tk-btn rf-fayl-btn rf-ai-btn on ok err
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const halqa = (on) => (on ? 'rf-halqa' : undefined);
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Sahna qadamlari ketma-ket: [[kechikish ms, fn], …]; ekran yopilsa taymerlar tozalanadi; reduced-motion — holatlar kechikishsiz (DE-200)
function useKetma() {
  const taymer = useRef([]);
  useEffect(() => () => taymer.current.forEach(clearTimeout), []);
  return useCallback((qadamlar) => {
    const tez = kamHarakat();
    let vaqt = 0;
    for (const [ms, fn] of qadamlar) { vaqt += tez ? 0 : ms; taymer.current.push(setTimeout(fn, vaqt)); }
  }, []);
}
const lsOqi = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };

// «Maydon Jamoa» — 11-Modul 9.62 yashili (9–13-Modul darslaridagi rang bilan bir)
const MAYDON_RANG = '#2E9E4F';
const NAMUNA_KOD = 'AB12CD';
const LENDING = 'maydon-jamoa-….netlify.app';
const NAMUNA_HAVOLA = LENDING + '/?taklif=' + NAMUNA_KOD + '&kanal=taklif';
const ESKI_HAVOLA = LENDING + '/?kanal=ilova';
const TAKLIF_SAHNA = {
  t1: { uz: '1-telefon · tashkilotchi', ru: 'телефон 1 · организатор' },
  t2: { uz: "2-telefon · yangi o'yinchi", ru: 'телефон 2 · новый игрок' },
  brauzer: { uz: 'brauzer · lending', ru: 'браузер · лендинг' },
  ilova: { uz: 'ilova', ru: 'приложение' },
  oyin: { uz: "O'yin", ru: 'Игра' },
  oyinQator: { uz: 'Shanba, 18:00 · Mahalla maydoni · 8 / 10', ru: 'Суббота, 18:00 · Махаллинская площадка · 8 / 10' },
  ulash: { uz: 'Havolani ulashish', ru: 'Havolani ulashish (поделиться ссылкой)' },
  ochish: { uz: 'Havolani ochish', ru: 'Открыть ссылку' },
  yozish: { uz: 'Taklif kodini yozish', ru: 'Ввести код приглашения' },
  qanday: { uz: "Qanday qo'shilaman", ru: 'Как присоединиться' },
  kodQator: (k) => ({ uz: `Taklif kodi: ${k}`, ru: `Код приглашения: ${k}` }),
  kodOsti: { uz: "Ro'yxatdan o'tishda shu taklif kodini yozing.", ru: 'При регистрации введите этот код приглашения.' },
  android: { uz: "Android: ilovani o'rnatish", ru: 'Android: установить приложение' },
  iphone: { uz: 'iPhone: brauzerda ochish', ru: 'iPhone: открыть в браузере' },
  ornatilmagan: { uz: "Maydon Jamoa o'rnatilmagan", ru: 'Maydon Jamoa не установлено' },
  royxat: { uz: "Ro'yxatdan o'tish", ru: 'Регистрация' },
  ism: { uz: 'Ism', ru: 'Имя' },
  login: { uz: 'Login', ru: 'Логин' },
  parol: { uz: 'Parol', ru: 'Пароль' },
  kodMaydon: { uz: "Taklif kodi (bo'lsa)", ru: 'Код приглашения (если есть)' },
  otmadi: { uz: "taklif kodi ilovaga o'tmadi", ru: 'код приглашения не перешёл в приложение' },
  tanish: { uz: 'tanish chati', ru: 'чат знакомых' },
  tashkilotchi: { uz: 'tashkilotchi', ru: 'организатор' },
  yangiHisob: { uz: 'yangi hisob · taklif qilgan: tashkilotchi', ru: 'новый аккаунт · пригласил: организатор' },
  umami: { uz: 'Umami · kanal', ru: 'Umami · канал' },
  umamiTaklif: { uz: 'Umami · kanal: taklif · +1 tashrif', ru: 'Umami · канал: taklif · +1 визит' }
};
// Mentor misolining sonlari (tayanch 1.10, 1.13 — aynan; har son yonida birligi)
const MENTOR_SANOQ = { tashrif: 18, hisob: 7, harakat: 4, jami: 51, eski: 44, mukofot: 3, tashkilotchi: 2, birQurilma: 1 };
// 5-ekran: to'rt hisob kartasi (tartib — sahna uchun); kataklar: yangi hisob · boshqa qurilma · namuna emas
const HISOBLAR = [
  { q: { uz: 'qurilma: taklif qilganniki emas', ru: 'устройство: не пригласившего' }, k: [true, true, true] },
  { q: { uz: 'qurilma: taklif qilganniki emas', ru: 'устройство: не пригласившего' }, k: [true, true, true] },
  { q: { uz: 'qurilma: taklif qilganniki bilan bir xil', ru: 'устройство: то же, что у пригласившего' }, k: [true, false, true] },
  { q: { uz: 'qurilma: taklif qilganniki emas', ru: 'устройство: не пригласившего' }, k: [true, true, true] }
];
const QOIDA_KATAKLAR = [
  { uz: 'Yangi hisob, asosiy harakat qildi', ru: 'Новый аккаунт, сделал основное действие' },
  { uz: 'Taklif qilgan bilan boshqa qurilmada', ru: 'На другом устройстве, чем пригласивший' },
  { uz: 'Namuna hisob emas', ru: 'Не образцовый аккаунт' }
];
const CHEKLOV_QATORI = { uz: 'Bir hisobga — haftasiga ko\'pi bilan 2', ru: 'Одному аккаунту — не больше 2 в неделю' };
const QOIDA_QATORI = { uz: "Siz taklif qilgan yangi o'yinchi o'yinga qo'shilsa yoki o'yin e'lon qilsa — Pro'ga 7 kun qo'shiladi (haftasiga ko'pi bilan 2 marta).", ru: 'Если приглашённый вами новый игрок присоединится к игре или объявит игру — к Pro добавится 7 дней (не больше 2 раз в неделю).' };
const XABAR_TOPILMADI = { uz: "Bunday taklif kodi topilmadi — tekshiring yoki maydonni bo'sh qoldiring.", ru: 'Такой код приглашения не найден — проверьте или оставьте поле пустым.' };

// Havola qatori: taklif kodi qismi accent bilan (2-ekran 1-harakat)
const HavolaQator = ({ havola = NAMUNA_HAVOLA, sinf }) => {
  const i = havola.indexOf(NAMUNA_KOD);
  return <code className={cx('rf-havola', sinf)}>{i < 0 ? havola : <>{havola.slice(0, i)}<b>{NAMUNA_KOD}</b>{havola.slice(i + NAMUNA_KOD.length)}</>}</code>;
};
// 1-telefon ekrani — ilova «O'yin»: e'lon qatori, «Havolani ulashish» (bosiladigan yoki maket), ostida havola (ulashish oynasi) yoki qoida qatori
const Ilova1 = ({ t }) => (
  <div className="rf-ilova">
    <div className="rf-il-bosh"><span className="rf-tag">{tr(TAKLIF_SAHNA.ilova)}</span><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b></div>
    <span className="rf-il-sar">{tr(TAKLIF_SAHNA.oyin)}</span>
    <span className="rf-il-oyin">{tr(TAKLIF_SAHNA.oyinQator)}</span>
    <button type="button" className={cx('rf-ulash', halqa(t.joriy === 'ulash'), t.yondi && 'yondi')} disabled={!t.onUlash} onClick={t.onUlash}>{tr(TAKLIF_SAHNA.ulash)}</button>
    {t.havola && <span className="rf-ulash-oyna fade-step"><HavolaQator havola={t.havola} /></span>}
    {t.qoida && <span className="rf-il-qoida fade-step">{tr(QOIDA_QATORI)}</span>}
  </div>
);
// 2-telefon ekrani — o'rnatilmagan · «Ro'yxatdan o'tish» formasi (to'rt maydon; karta maydoni yo'q)
const Ilova2 = ({ t }) => {
  if (!t.ornatildi) return <div className="rf-ilova bosh"><span className="rf-il-yoq">{tr(TAKLIF_SAHNA.ornatilmagan)}</span></div>;
  const f = t.forma || {};
  const maydon = (nom, v, sinf) => <span className={cx('rf-maydon', sinf)}><em>{tr(nom)}</em><b>{v || ' '}</b></span>;
  return (
    <div className="rf-ilova">
      <div className="rf-il-bosh"><span className="rf-tag">{tr(TAKLIF_SAHNA.ilova)}</span><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b></div>
      <span className="rf-il-sar">{tr(TAKLIF_SAHNA.royxat)}</span>
      {maydon(TAKLIF_SAHNA.ism, f.ism)}{maydon(TAKLIF_SAHNA.login, f.login)}{maydon(TAKLIF_SAHNA.parol, f.parol)}
      {maydon(TAKLIF_SAHNA.kodMaydon, f.kod, cx('kod', f.kodJoriy && 'joriy', f.xato && 'xato'))}
      {f.xato && <span className="rf-f-xato fade-step">{tr(XABAR_TOPILMADI)}</span>}
      <span className={cx('rf-f-btn', f.bosildi && 'bosildi')}>{tr(TAKLIF_SAHNA.royxat)}</span>
    </div>
  );
};
const Telefon = ({ yorliq, children, sinf, osti }) => (
  <div className={cx('rf-tel-ust', sinf)}>
    <span className="rf-tel-yorliq">{tr(yorliq)}</span>
    <div className="rf-telefon"><div className="rf-tel-ekran">{children}</div></div>
    {osti}
  </div>
);
// Brauzer — lending «Qanday qo'shilaman»: manzil satri (bo'sh — kulrang), taklif kodi qatori, ikki havola, burchakda Umami qutisi
const Brauzer = ({ b }) => (
  <div className={cx('rf-brauzer', b.joriy && 'rf-joriy')}>
    <span className="rf-tel-yorliq">{tr(b.yorliq || TAKLIF_SAHNA.brauzer)}</span>
    <div className="rf-br-oyna">
      <span className="rf-br-bar"><i /><i /><i /><span className={cx('rf-br-manzil', !b.manzil && 'bosh', b.sondi && 'sondi')}>{b.manzil ? <HavolaQator havola={b.manzil} /> : ' '}</span></span>
      {b.sondi && <span className="rf-otmadi br fade-step">{tr(TAKLIF_SAHNA.otmadi)}</span>}
      {!b.lending && <div className="rf-br-tana bosh" />}
      {b.lending && <div className="rf-br-tana fade-step">
        <b className="rf-br-sar">{tr(TAKLIF_SAHNA.qanday)}</b>
        {b.kod && <span className="rf-br-kod fade-step"><b>{tr(TAKLIF_SAHNA.kodQator(NAMUNA_KOD))}</b><em>{tr(TAKLIF_SAHNA.kodOsti)}</em></span>}
        <button type="button" className={cx('rf-apk', halqa(b.joriy === 'apk'))} disabled={!b.onApk} onClick={b.onApk}>{tr(TAKLIF_SAHNA.android)}</button>
        <span className="rf-br-ios">{tr(TAKLIF_SAHNA.iphone)}</span>
      </div>}
      {b.umami && <span key={b.umami} className={cx('rf-umami', b.umami === 'taklif' && 'ok')}>{tr(b.umami === 'taklif' ? TAKLIF_SAHNA.umamiTaklif : TAKLIF_SAHNA.umami)}</span>}
    </div>
  </div>
);
// Backend tuguni: mini-jadval `oyinchilar` (taklif_kodi · taklif_qilgan_id); yangi qator bir lahza yashil
const Backend = ({ be }) => (
  <div className={cx('rf-backend', be.yondi && 'yondi')}>
    <b className="rf-be-sar">Backend</b>
    <div className="rf-jadval">
      <span className="rf-j-bosh"><code>oyinchilar</code></span>
      <span className="rf-j-q ust"><code>taklif_kodi</code><code>taklif_qilgan_id</code></span>
      <span className={cx('rf-j-q', be.kodYondi && 'yondi')}><span><em>{tr(TAKLIF_SAHNA.tashkilotchi)}</em> <code>{NAMUNA_KOD}</code></span><span>—</span></span>
      {be.yangi && <span className="rf-j-q yangi"><span className="rf-j-to">{tr(TAKLIF_SAHNA.yangiHisob)}</span></span>}
    </div>
  </div>
);
// Konvert: yo'nalish — t1-br · br-t2 · t2-be (reduced-motion — ko'rinmaydi)
const Konvert = ({ k }) => (k ? <span key={k.id} className={cx('rf-kv', k.yol, k.tur)}><i className="rf-kv-i" />{k.yorliq && <b className="rf-kv-y">{tr(k.yorliq)}</b>}</span> : null);
const TaklifSahna = ({ t1, br, be, t2, k, sinf }) => {
  const mob = useIsMobile(640);
  return (
    <div className={cx('rf-sahna', mob ? 'tik' : 'yot', !t2 && 'ikki', sinf)}>
      {t1 && <div className="rf-s-t1"><Telefon yorliq={TAKLIF_SAHNA.t1}><Ilova1 t={t1} /></Telefon></div>}
      {br && <div className="rf-s-br"><Brauzer b={br} /></div>}
      {be && <div className="rf-s-be"><Backend be={be} /></div>}
      {t2 && <div className="rf-s-t2"><Telefon yorliq={TAKLIF_SAHNA.t2}><Ilova2 t={t2} /></Telefon></div>}
      <Konvert k={k} />
    </div>
  );
};

// Ballsiz bashorat: tanlangach ixcham qator bo'lib natijagacha turadi (SABOQ 11); har chipning o'z yengil chegarasi (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="rf-chorla"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="rf-bash-ix fade-step"><span className="rf-bash-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosa qutisining birinchi kichik qatori; QIzoh — oxirgi kichik qatori (E 42)
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="rf-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="rf-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="rf-x-m">{matn}</span>{izoh && <span className="rf-x-iz">{izoh}</span>}</>;
const Ustoz = ({ satrlar }) => (useMentorLive() ? <div className="rf-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div> : null);
const JoriyQator = ({ matn }) => <p className="rf-joriy-q fade-step">{tx(matn)}</p>;

// ===== SCREEN 0 — KIRISH (QKirish): 1-telefon «O'yin» + ikki chat pufagi (bir xil havola) + Umami qutisi; javobdan keyin havolalar yonib ustma-ust tushadi =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Havolada — unda kim yuborgani yozilgan', ru: 'В ссылке — в ней записано, кто отправил' } },
  { id: 'b', label: { uz: 'Hech qayerda — havola hammada bir xil', ru: 'Нигде — ссылка у всех одинаковая' } },
  { id: 'c', label: { uz: "Formada — yangi o'yinchi o'zi yozadi", ru: 'В форме — новый игрок пишет сам' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Mentor ilovasida hamma tashkilotchi bir xil havolani ulashadi — kim yuborgani hech qayerda yozilmaydi.</>, ru: <><b>Именно!</b> В приложении Ментора все организаторы делятся одной и той же ссылкой — кто отправил, нигде не записано.</> },
  a: { uz: <><b>Qiziq fikr!</b> Hozirgi havolada faqat <code className="qcode">?kanal=ilova</code> bor: u kanalni aytadi, kim yuborganini emas.</>, ru: <><b>Интересная мысль!</b> В нынешней ссылке есть только <code className="qcode">?kanal=ilova</code>: он говорит о канале, а не о том, кто отправил.</> },
  c: { uz: <><b>Qiziq fikr!</b> O'yinchi aytsa bilinardi — lekin hozir formada buni yozadigan joy yo'q.</>, ru: <><b>Интересная мысль!</b> Если бы игрок сказал, стало бы известно — но сейчас в форме для этого нет места.</> }
};
const Pufak = ({ yorliq, ust, yondi }) => (
  <span className={cx('rf-pufak', ust && 'ust')}><em>{tr(yorliq)}</em><code className={cx(yondi && 'yondi')}>{ESKI_HAVOLA}</code></span>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [bosqich, setBosqich] = useState(storedAnswer ? 2 : 0); // 0 tanlovgacha · 1 havolalar yonadi · 2 ustma-ust + kulrang qator
  const [sc, setSc] = useState(0);
  const ketma = useKetma();
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); setSc(n => n + 1); setBosqich(1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    ketma([[700, () => { setBosqich(2); setSc(n => n + 1); }]]);
  };
  const javob = picked !== null;
  const mGap = javob ? { uz: "Bugun har hisobga o'z havolasi beriladi — «Davom etish»ni bosing.", ru: 'Сегодня каждому аккаунту дадут свою ссылку — нажмите «Продолжить».' }
    : { uz: "12-Modulda Mentor ilovasiga «Havolani ulashish» qo'shildi — tashkilotchilar havolani o'z jamoasiga yuboradi; javobni tanlang.", ru: 'В 12-м модуле в приложение Ментора добавили «Havolani ulashish» — организаторы отправляют ссылку своей команде; выберите ответ.' };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!javob} label={javob ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Bittasini tanlang', ru: 'Выберите один' }} onClick={onNext} />}>
      <div className={cx('rf-k', !javob && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Yangi o'yinchini kim taklif qilgani <span className="italic" style={{ color: T.accent }}>qayerda ko'rinadi?</span></>, ru: <>Где видно, <span className="italic" style={{ color: T.accent }}>кто пригласил</span> нового игрока?</> })}
          mentor={<Mentor>{tr(mGap)}</Mentor>}
          maket={<div className="rf-kirish">
            <Telefon yorliq={TAKLIF_SAHNA.t1}><Ilova1 t={{}} /></Telefon>
            <div className="rf-k-ong">
              <Pufak yorliq={{ uz: 'bir tashkilotchi', ru: 'один организатор' }} yondi={bosqich >= 1} />
              <Pufak yorliq={{ uz: 'boshqa tashkilotchi', ru: 'другой организатор' }} yondi={bosqich >= 1} ust={bosqich >= 2} />
              <span className="rf-umami-k">{tr({ uz: 'Umami · kanal: ilova', ru: 'Umami · канал: ilova' })}</span>
              {bosqich >= 2 && <span className="rf-k-kul fade-step">{tr({ uz: 'kanal: ilova · kim yuborgani — yozilmagan', ru: 'канал: ilova · кто отправил — не записано' })}</span>}
            </div>
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={javob && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        >
          <Ustoz satrlar={[{ uz: "Sinfdan so'rang: «Siz ishlatadigan ilovalarda «do'stingizni chaqiring» degan joy bormi — u kim chaqirganini qayerdan biladi?» Javoblarni sanamang va to'g'ri-noto'g'ri demang — 3-ekranda ko'rinadi.", ru: 'Спросите класс: «Есть ли в приложениях, которыми вы пользуетесь, место «позовите друга» — откуда оно знает, кто позвал?» Ответы не считайте и не оценивайте — это видно на 3-м экране.' }]} />
        </QKirish>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda sahna tayyor holatda bir marta o'zi yuradi (1-telefon → havola → lendingda taklif kodi; forma va mukofot yo'q — 2, 5-ekran kashfiyoti) =====
const REJA = [
  { uz: "Har hisobning o'z havolasi", ru: 'У каждого аккаунта своя ссылка' },
  { uz: 'Havola bilan kelganlar sanaladi', ru: 'Пришедшие по ссылке считаются' },
  { uz: "Mukofot — faqat qoidaga mos taklifga", ru: 'Награда — только за приглашение по правилу' }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [kadr, setKadr] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[1100, () => setKadr(1)], [900, () => setKadr(2)], [900, () => setKadr(3)]]); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun har hisobning <span className="italic" style={{ color: T.accent }}>o'z taklif kodi</span> bo'ladi.</>, ru: <>Сегодня у каждого аккаунта будет <span className="italic" style={{ color: T.accent }}>свой код приглашения</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Havola, sanoq va mukofotni uch blokda qurasiz — talab tayyor, qavslarini o'z mahsulotingiz bilan to'ldirasiz.", ru: 'Ссылку, подсчёт и награду вы построите в трёх блоках — требование готово, скобки заполните под свой продукт.' })}</Mentor>}
        chapYorliq={<>{tr({ uz: 'Dars oxirida', ru: 'В конце урока' })} <span className="rf-reja-teg">{tr({ uz: 'unikal havola, sanoq va mukofot', ru: 'уникальная ссылка, подсчёт и награда' })}</span></>}
        chap={<TaklifSahna sinf="reja"
          t1={{ yondi: kadr === 1, havola: kadr >= 2 ? NAMUNA_HAVOLA : null }}
          br={{ manzil: kadr >= 3 ? NAMUNA_HAVOLA : null, lending: kadr >= 3, kod: kadr >= 3 }}
          k={kadr === 2 ? { id: 'r1', yol: 't1-br', tur: 'havola', yorliq: TAKLIF_SAHNA.tanish } : null} />}
        qadamlar={REJA.map(r => ({ t: tr(r) }))}
      >
        <p className="rf-reja-past">{tx({ uz: "o'z repo'ngiz · Mentor misoli `maydon-jamoa` · boshlang'ich teg `m13-dars-10-start` · namuna `m13-dars-10-done`", ru: 'ваш репозиторий · пример Ментора `maydon-jamoa` · начальный тег `m13-dars-10-start` · образец `m13-dars-10-done`' })}</p>
        <p className="rf-reja-past2">{tr({ uz: "«Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz. Bu darsda pul yo'q: mukofot — test rejimdagi Pro muddati.", ru: '«Maydon Jamoa» — образец; практику выполняете в своём продукте. На этом уроке денег нет: награда — срок Pro в тестовом режиме.' })}</p>
        <Ustoz satrlar={[
          { uz: "Eng og'ir qism — 3-amaliyot (ikki tekshiruv akkaunti, brauzer ko'rinishini yangilash, tozalash). Sinfda havolalarni bir-biriga yubortirmang va kim nechta odam taklif qilganini so'ramang (qo'l ko'tartirmang) — sherikning tekshiruvi tekshiruv akkaunti bilan, keyin o'chiriladi.", ru: 'Самая тяжёлая часть — практика 3 (два проверочных аккаунта, обновление браузерной версии, очистка). Не давайте в классе пересылать ссылки друг другу и не спрашивайте, кто сколько людей пригласил (без поднятия рук) — проверка с напарником идёт через проверочный аккаунт, потом он удаляется.' },
          { uz: "Mukofot — pul emas: test rejimdagi Pro muddati. «Do'stingizni taklif qiling — sovg'a oling» kabi gap aytmang. Mentor misolidagi 51 ni bayram qilmang: unda 11 sinfdosh va bir qurilmadagi hisob ham bor; bu o'quvchilarga me'yor emas.", ru: 'Награда — не деньги: срок Pro в тестовом режиме. Не говорите фраз вроде «Пригласи друга — получи подарок». Не празднуйте 51 из примера Ментора: там и 11 одноклассников, и аккаунт с того же устройства; для учеников это не норма.' },
          { uz: "Talabda kod bo'shliqsiz va katta harfga o'tkazilib solishtiriladi — kichik harf 12-darsga ataylab qoldirilmaydi; o'quvchi o'zi topsa — o'z mahsulotida tuzatsin.", ru: 'В требовании код сравнивается без пробелов и в верхнем регистре — строчные буквы на 12-й урок нарочно не оставляются; если ученик сам найдёт ошибку — пусть исправит в своём продукте.' }
        ]} />
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · havola yo'li (bashorat + 4 harakat): ulashish → ochish → APK → taklif kodini yozish; holat bosishlar ro'yxatidan (P-046) =====
const S2_TAXMIN = [{ k: 'ha', t: { uz: 'Ha — havoladan biladi', ru: 'Да — узнаёт из ссылки' } }, { k: 'yoq', t: { uz: "Yo'q — o'yinchi o'zi yozadi", ru: 'Нет — игрок вводит сам' } }];
const S2_SAVOL = { uz: "Yangi o'yinchi havola orqali APK o'rnatdi. Ilova kim taklif qilganini biladimi?", ru: 'Новый игрок установил APK по ссылке. Знает ли приложение, кто его пригласил?' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 4 : 0);
  const [band, setBand] = useState(false);
  const [t1, setT1] = useState(avval ? { havola: NAMUNA_HAVOLA } : {});
  const [br, setBr] = useState(avval ? { manzil: NAMUNA_HAVOLA, sondi: true, lending: true, kod: true, umami: 'taklif' } : { umami: 'bosh' });
  const [be, setBe] = useState(avval ? { yangi: true } : {});
  const [t2, setT2] = useState(avval ? { ornatildi: true, forma: { kod: NAMUNA_KOD, bosildi: true } } : {});
  const [k, setK] = useState(null);
  const ketma = useKetma();
  const done = q >= 4;
  const tugadi = useTugadi(done, 1100, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tugat = (n, ms = 450) => [ms, () => { setQ(n); setBand(false); }];
  const ulash = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true);
    ketma([[150, () => setBe({ kodYondi: true })], [650, () => { setBe({}); setT1({ havola: NAMUNA_HAVOLA }); }],
      [500, () => setK({ id: 'a', yol: 't1-br', tur: 'havola', yorliq: TAKLIF_SAHNA.tanish })], [950, () => setK(null)], tugat(1, 50)]);
  };
  const och = () => {
    if (q !== 1 || band) return;
    setBand(true);
    ketma([[150, () => setBr(o => ({ ...o, manzil: NAMUNA_HAVOLA }))], [450, () => setBr(o => ({ ...o, lending: true }))], [450, () => setBr(o => ({ ...o, kod: true }))],
      [450, () => setBr(o => ({ ...o, umami: 'taklif' }))], tugat(2)]);
  };
  const apk = () => {
    if (q !== 2 || band) return;
    setBand(true);
    ketma([[150, () => setK({ id: 'b', yol: 'br-t2', tur: 'apk', yorliq: { uz: 'APK', ru: 'APK' } })], [950, () => { setK(null); setT2({ ornatildi: true, forma: {} }); }],
      [600, () => { setBr(o => ({ ...o, sondi: true })); }], tugat(3, 500)]);
  };
  const yoz = () => {
    if (q !== 3 || band) return;
    setBand(true);
    const harf = NAMUNA_KOD.split('').map((_, i) => [140, () => setT2(o => ({ ...o, forma: { kod: NAMUNA_KOD.slice(0, i + 1), kodJoriy: true } }))]);
    ketma([[200, () => setT2(o => ({ ...o, forma: { kod: '', kodJoriy: true } }))], ...harf, [450, () => setT2(o => ({ ...o, forma: { kod: NAMUNA_KOD, bosildi: true } }))],
      [350, () => setK({ id: 'c', yol: 't2-be', tur: 'sorov', yorliq: { uz: 'POST /royxat', ru: 'POST /royxat' } })], [950, () => { setK(null); setBe({ yangi: true, yondi: true }); }],
      [1000, () => setBe({ yangi: true })], tugat(4, 50)]);
  };
  const joriy = !taxmin || band || done ? null : ['ulash', 'och', 'apk', 'yoz'][q];
  const faol = (n) => joriy === n;
  const mGap = done ? { uz: "To'rt harakat tugadi — natijani taxminingiz bilan solishtiring.", ru: 'Четыре действия закончились — сравните результат со своим предположением.' }
    : q === 0 ? { uz: "Avval taxminingizni belgilang, keyin chap telefonda «Havolani ulashish»ni bosing.", ru: 'Сначала отметьте предположение, потом на левом телефоне нажмите «Havolani ulashish».' }
      : q === 1 ? { uz: "Endi har tashkilotchining o'z havolasi bor — u taklif havolasi deyiladi; brauzerda «Havolani ochish»ni bosing.", ru: 'Теперь у каждого организатора своя ссылка — она называется ссылкой-приглашением; в браузере нажмите «Открыть ссылку».' }
        : q === 2 ? { uz: "Havoladagi olti belgi — taklif kodi; endi lendingdagi «Android: ilovani o'rnatish»ni bosing.", ru: 'Шесть символов в ссылке — код приглашения; теперь нажмите на лендинге «Android: установить приложение».' }
          : { uz: "Ilova o'rnatildi — endi o'ng telefonda «Taklif kodini yozish»ni bosing.", ru: 'Приложение установлено — теперь на правом телефоне нажмите «Ввести код приглашения».' };
  // Sahna tugmalari ⛶ dan tashqarida — harakat qatorida (07 5-ekran naqshi)
  const harakat = !tugadi && (<div className="rf-harakat">
    <button type="button" className={cx('rf-och q-chip', halqa(faol('och')))} disabled={!faol('och')} onClick={och}>{tr(TAKLIF_SAHNA.ochish)}</button>
    <button type="button" className={cx('rf-yoz q-chip', halqa(faol('yoz')))} disabled={!faol('yoz')} onClick={yoz}>{tr(TAKLIF_SAHNA.yozish)}</button>
  </div>);
  const nav = done ? { uz: 'Davom etish', ru: 'Продолжить' } : !taxmin ? { uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }
    : { uz: `Harakatlarni navbat bilan bajaring (${q}/4)`, ru: `Выполните действия по очереди (${q}/4)` };
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · havola yo'li", ru: 'Понятие · путь ссылки' })} screen={screen} scrollSignal={q + (tugadi ? 10 : 0)} deskSignal={tugadi ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={nav} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>O'rnatilgan ilova <span className="italic" style={{ color: T.accent }}>kim taklif qilganini</span> biladimi?</>, ru: <>Знает ли установленное приложение, <span className="italic" style={{ color: T.accent }}>кто пригласил</span>?</> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={<Bashorat savol={S2_SAVOL} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        harakat={harakat}
        vizual={<div className={cx('rf-viz', tugadi && 'tugadi')}>
          <TaklifSahna
            t1={{ ...t1, onUlash: faol('ulash') ? ulash : null, joriy: faol('ulash') ? 'ulash' : null }}
            br={{ ...br, onApk: faol('apk') ? apk : null, joriy: faol('apk') ? 'apk' : null }}
            be={be} t2={t2} k={k} sinf={tugadi ? 'fokus-be' : null} />
          {done && <JoriyQator matn={{ uz: 'Umami faqat kanalni sanaydi; kim taklif qilganini Database biladi.', ru: 'Umami считает только канал; кто пригласил, знает Database.' }} />}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'yoq'} haqiqat={{ uz: "yo'q, o'yinchi taklif kodini o'zi yozadi", ru: 'нет, игрок вводит код приглашения сам' }} />}
          matn={tr({ uz: "Mentor ilovasida havoladagi taklif kodi o'rnatilgan APK'ga o'tmaydi — shuning uchun formada maydon bor.", ru: 'В приложении Ментора код приглашения из ссылки не переходит в установленный APK — поэтому в форме есть поле.' })} />}
      >
        <Ustoz satrlar={[{ uz: "iPhone'dagi brauzer ko'rinishida ham Mentor ilovasi taklif kodini qo'lda so'raydi — bitta qoida. Web-trekda havola va forma bitta brauzerda ochilsa, sayt taklif kodini havoladan formaga o'zi qo'yishi mumkin — bu 2-amaliyotda o'quvchining tanlovi.", ru: 'И в браузерной версии на iPhone приложение Ментора просит код приглашения вручную — одно правило. В веб-треке, если ссылка и форма открываются в одном браузере, сайт может сам перенести код из ссылки в форму — это выбор ученика в практике 2.' }]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen; INLINE_KEYS.s4 = 2, C) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Mentor formasida nega «Taklif kodi (bo'lsa)» maydoni bor?"
    question={tr({ uz: <h2 className="title h-ask">Mentor formasida nega <span className="italic" style={{ color: T.accent }}>«Taklif kodi (bo'lsa)»</span> maydoni bor?</h2>, ru: <h2 className="title h-ask">Зачем в форме Ментора поле <span className="italic" style={{ color: T.accent }}>«Код приглашения (если есть)»</span>?</h2> })}
    options={[
      { uz: 'Umami faqat `kanal` belgisini sanagani uchun', ru: 'Потому что Umami считает только метку `kanal`' },
      { uz: 'Taklif kodi olti belgidan iborat bo\'lgani uchun', ru: 'Потому что код приглашения из шести символов' },
      { uz: "APK'ga havoladagi taklif kodi o'tmagani uchun", ru: 'Потому что код из ссылки не переходит в APK' },
      { uz: "Taklif kodi majburiy maydon bo'lgani uchun", ru: 'Потому что код приглашения — обязательное поле' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Taklif kodi APK'ga o'tmaydi — yangi o'yinchi uni yozadi.", ru: 'Код приглашения не переходит в APK — новый игрок вводит его сам.' }}
    explainWrong={{
      0: { uz: 'Umami kanalni sanaydi — bu rost. Maydon nega formada?', ru: 'Umami считает канал — это правда. А зачем поле в форме?' },
      1: { uz: 'Taklif kodi olti belgili — bu rost. Ilovaga qanday yetadi?', ru: 'Код приглашения из шести символов — правда. Как он попадает в приложение?' },
      3: { uz: "Maydon nomidagi «(bo'lsa)» nimani aytadi?", ru: 'О чём говорит «(если есть)» в названии поля?' },
      default: { uz: "Taklif kodi ilovaga qanday yetishini eslang.", ru: 'Вспомните, как код приглашения попадает в приложение.' }
    }} />
);

// ===== SCREEN 5 — TUSHUNCHA · mukofot qoidasi (bashorat + 5 harakat): «Sanoqni ochish» → to'rt hisob kartasi bittadan «Qoidadan o'tkazish» (E 53) =====
const S5_TAXMIN = [{ k: 'kam', t: { uz: 'Yarmidan kami', ru: 'Меньше половины' } }, { k: 'kop', t: { uz: "Ko'pi", ru: 'Большинство' } }, { k: 'hammasi', t: { uz: 'Hammasi', ru: 'Все' } }];
const S5_SAVOL = { uz: 'Asosiy harakat qilgan hisoblarning nechtasi uchun mukofot beriladi?', ru: 'За сколько аккаунтов, сделавших основное действие, дают награду?' };
const SANOQ_QUTI = [
  { id: 'tashrif', y: { uz: 'Umami · tashrif', ru: 'Umami · визиты' }, son: { uz: `${MENTOR_SANOQ.tashrif} tashrif`, ru: `${MENTOR_SANOQ.tashrif} визитов` } },
  { id: 'hisob', y: { uz: 'Database · taklif kodi bilan ochilgan hisob', ru: 'Database · аккаунты, открытые с кодом приглашения' }, son: { uz: `${MENTOR_SANOQ.hisob} hisob`, ru: `${MENTOR_SANOQ.hisob} аккаунтов` } },
  { id: 'harakat', y: { uz: 'asosiy harakat qilgan hisob', ru: 'аккаунты с основным действием' }, son: { uz: `${MENTOR_SANOQ.harakat} hisob`, ru: `${MENTOR_SANOQ.harakat} аккаунта` } }
];
const HisobKarta = ({ i, holat, kataklar }) => {
  const h = HISOBLAR[i];
  return (
    <div key={i} className={cx('rf-hk fade-step', holat)}>
      <b className="rf-hk-n">{tr({ uz: `Hisob ${i + 1} / 4`, ru: `Аккаунт ${i + 1} / 4` })}</b>
      <span>{tr({ uz: 'taklif kodi bilan ochilgan · asosiy harakat: bor', ru: 'открыт с кодом приглашения · основное действие: есть' })}</span>
      <span className={cx(!h.k[1] && 'rf-hk-ajrat')}>{tr(h.q)}</span>
      <span>{tr({ uz: "namuna: yo'q", ru: 'образец: нет' })}</span>
      {holat === 'err' && kataklar >= 3 && <QXato>{tr({ uz: "Bir qurilmada — mukofot yo'q.", ru: 'Одно устройство — награды нет.' })}</QXato>}
    </div>
  );
};
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 5 : 0); // 0 sanoqgacha · 1..4 — joriy karta (q-1) · 5 tugadi
  const [band, setBand] = useState(false);
  const [sanoq, setSanoq] = useState(avval ? 3 : 0);
  const [kataklar, setKataklar] = useState(0);
  const [holat, setHolat] = useState(null);
  const [mukofot, setMukofot] = useState(avval ? MENTOR_SANOQ.mukofot : 0);
  const [pop, setPop] = useState(0);
  const ketma = useKetma();
  const done = q >= 5;
  const tugadi = useTugadi(done, 1100, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const sanoqOch = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true);
    ketma([[200, () => setSanoq(1)], [550, () => setSanoq(2)], [550, () => setSanoq(3)], [500, () => { setQ(1); setBand(false); }]]);
  };
  const otkaz = () => {
    if (q < 1 || q > 4 || band) return;
    const i = q - 1;
    const k = HISOBLAR[i].k;
    const ok = k.every(Boolean);
    setBand(true); setKataklar(0); setHolat(null);
    ketma([[120, () => setKataklar(1)], [120, () => setKataklar(2)], [120, () => setKataklar(3)],
      [350, () => { setHolat(ok ? 'ok' : 'err'); if (ok) { setMukofot(m => m + 1); setPop(p => p + 1); } }],
      [ok ? 900 : 1500, () => { setQ(i + 2); setKataklar(0); setHolat(null); setBand(false); }]]);
  };
  const joriyKarta = q >= 1 && q <= 4 ? q - 1 : null;
  const otgan = Array.from({ length: Math.min(Math.max(q - 1, 0), 4) }, (_, i) => i);
  const sanoqFaol = !!taxmin && q === 0 && !band;
  const qoidaFaol = q >= 1 && q <= 4 && !band;
  const mGap = done ? { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' }
    : q === 0 ? { uz: "Mentor misolida bir haftalik sanoq bor — avval taxminingizni belgilang, keyin «Sanoqni ochish»ni bosing.", ru: 'В примере Ментора есть подсчёт за неделю — сначала отметьте предположение, потом нажмите «Открыть подсчёт».' }
      : { uz: "Endi to'rt hisobni bittadan «Qoidadan o'tkazish» bilan tekshiring.", ru: 'Теперь проверьте четыре аккаунта по одному кнопкой «Провести через правило».' };
  const nav = done ? { uz: 'Davom etish', ru: 'Продолжить' } : !taxmin ? { uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }
    : q === 0 ? { uz: 'Sanoqni oching', ru: 'Откройте подсчёт' } : { uz: `Hisoblarni tekshiring (${q - 1}/4)`, ru: `Проверьте аккаунты (${q - 1}/4)` };
  const katak = (j) => {
    if (joriyKarta == null || kataklar <= j) return null;
    return HISOBLAR[joriyKarta].k[j];
  };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · mukofot qoidasi', ru: 'Понятие · правило награды' })} screen={screen} scrollSignal={q + sanoq + (tugadi ? 10 : 0)} deskSignal={tugadi ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={nav} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Qaysi hisob uchun <span className="italic" style={{ color: T.accent }}>mukofot beriladi?</span></>, ru: <>За какой аккаунт <span className="italic" style={{ color: T.accent }}>дают награду?</span></> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={<Bashorat savol={S5_SAVOL} variantlar={S5_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        harakat={!tugadi && <div className="rf-harakat">
          {q === 0 && <button type="button" className={cx('rf-sanoq q-chip', halqa(sanoqFaol))} disabled={!sanoqFaol} onClick={sanoqOch}>{tr({ uz: 'Sanoqni ochish', ru: 'Открыть подсчёт' })}</button>}
          <button type="button" className={cx('rf-qoida q-chip', halqa(qoidaFaol))} disabled={!qoidaFaol} onClick={otkaz}>{tr({ uz: "Qoidadan o'tkazish", ru: 'Провести через правило' })}</button>
        </div>}
        vizual={<div className={cx('rf-s5', tugadi && 'tugadi')}>
          <div className="rf-s5-chap">
            <span className="rf-s5-y">{tr({ uz: 'Mentor misolida · bir hafta', ru: 'В примере Ментора · одна неделя' })}</span>
            <div className="rf-quti-q">{SANOQ_QUTI.map((s, i) => (
              <span key={s.id} className={cx('rf-quti', sanoq > i && 'bor')}><em>{tr(s.y)}</em><b key={sanoq > i ? 'b' : 'y'} className={cx(sanoq === i + 1 && 'rf-pop')}>{sanoq > i ? tr(s.son) : ' '}</b></span>))}</div>
            {sanoq >= 3 && <span className="rf-quti-kul fade-step">{tr({ uz: `Jami ro'yxatdan o'tgan: ${MENTOR_SANOQ.jami} (${MENTOR_SANOQ.eski} + ${MENTOR_SANOQ.hisob})`, ru: `Всего зарегистрировано: ${MENTOR_SANOQ.jami} (${MENTOR_SANOQ.eski} + ${MENTOR_SANOQ.hisob})` })} · {tr({ uz: 'tashrif va hisob — har xil o\'lchov, ayirilmaydi', ru: 'визиты и аккаунты — разные единицы, не вычитаются' })}</span>}
            {otgan.length > 0 && <div className="rf-hk-ix">{otgan.map(i => {
              const ok = HISOBLAR[i].k.every(Boolean);
              return <span key={i} className={cx('rf-hk-q', ok ? 'ok' : 'err')}><i>{ok ? '✓' : '✕'}</i>{tr({ uz: `Hisob ${i + 1} / 4`, ru: `Аккаунт ${i + 1} / 4` })}</span>;
            })}</div>}
            {!tugadi && <div className="rf-hk-joy">
              {joriyKarta != null ? <HisobKarta i={joriyKarta} holat={holat} kataklar={kataklar} /> : <div className="rf-hk bosh"><b className="rf-hk-n">{tr({ uz: 'Hisob 1 / 4', ru: 'Аккаунт 1 / 4' })}</b></div>}
            </div>}
          </div>
          <div className="rf-qk">
            <b className="rf-qk-sar">{tr({ uz: 'Mukofot qoidasi', ru: 'Правило награды' })}</b>
            <span className="rf-qk-y">{tr({ uz: 'Mentor misolida', ru: 'В примере Ментора' })}</span>
            {QOIDA_KATAKLAR.map((kq, j) => { const v = katak(j); return (
              <span key={j} className={cx('rf-katak', v === true && 'ok', v === false && 'err')}><i key={String(v)} className={cx(v != null && 'tushdi')}>{v === true ? '✓' : v === false ? '✕' : ''}</i>{tr(kq)}</span>); })}
            <span className="rf-mukofot"><b key={pop} className={cx(pop > 0 && 'rf-pop')}>{tr({ uz: `Mukofot: ${mukofot}`, ru: `Награда: ${mukofot}` })}</b>{done && <em className="fade-step">{tr({ uz: `${MENTOR_SANOQ.tashkilotchi} tashkilotchiga`, ru: `${MENTOR_SANOQ.tashkilotchi} организаторам` })}</em>}</span>
            <span className="rf-cheklov">{tr(CHEKLOV_QATORI)}{done && <em className="fade-step"> ✓ {tr({ uz: 'cheklovdan oshmadi', ru: 'лимит не превышен' })}</em>}</span>
          </div>
          {done && <JoriyQator matn={{ uz: "Bir qurilma — o'zini taklif qilish ham, oiladagi bitta telefon ham bo'lishi mumkin: qoida ajratmaydi.", ru: 'Одно устройство — это может быть и самоприглашение, и один телефон на семью: правило их не различает.' }} />}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'kop'} haqiqat={{ uz: "ko'pi (to'rttadan uchtasi)", ru: 'большинство (три из четырёх)' }} />}
          matn={tr({ uz: 'Bu misolda mukofot yangi hisob asosiy harakat qilgach beriladi; bir qurilmadagi va namuna hisob sanalmaydi.', ru: 'В этом примере награду дают после основного действия нового аккаунта; аккаунт с того же устройства и образцовый не считаются.' })}
          izoh={tr({ uz: "Bir hafta va 7 hisob — kichik son: taklif yo'li ishlaganini ko'rsatadi, o'sishni isbotlamaydi.", ru: 'Неделя и 7 аккаунтов — маленькое число: показывает, что путь приглашения работает, но рост не доказывает.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "51 — 50 ga yetganini bayram qilmang: sonda 11 sinfdosh va mukofotga sanalmagan bir qurilmadagi hisob ham bor. «Bir hafta va 7 hisob — kichik son» gapini o'qib bering.", ru: '51 — не празднуйте, что дошли до 50: в числе и 11 одноклассников, и не засчитанный в награду аккаунт с того же устройства. Прочитайте вслух фразу «Неделя и 7 аккаунтов — маленькое число».' },
          { uz: "Haftalik cheklov bu misolda mukofotni to'xtatmadi (uch mukofot — ikki tashkilotchiga); u qanday ishlashi — 3-amaliyotda, kod qatorida.", ru: 'Недельный лимит в этом примере награду не остановил (три награды — двум организаторам); как он работает — в практике 3, в строке кода.' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 7 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 0, A) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Mentor qoidasida taklif qilganning telefonida ochilgan hisob o'yinga qo'shildi. Mukofot?"
    question={tr({ uz: <h2 className="title h-ask">Mentor qoidasida taklif qilganning telefonida ochilgan hisob o'yinga qo'shildi. <span className="italic" style={{ color: T.accent }}>Mukofot?</span></h2>, ru: <h2 className="title h-ask">По правилу Ментора аккаунт, открытый на телефоне пригласившего, присоединился к игре. <span className="italic" style={{ color: T.accent }}>Награда?</span></h2> })}
    options={[
      { uz: 'Berilmaydi — bir qurilmadagi hisob sanalmaydi', ru: 'Не дают — аккаунт с того же устройства не считается' },
      { uz: 'Beriladi — asosiy harakat qilgani yetarli', ru: 'Дают — достаточно основного действия' },
      { uz: "Beriladi — taklif kodi formaga to'g'ri yozilgan", ru: 'Дают — код приглашения введён в форму верно' },
      { uz: "Berilmaydi — o'yinga qo'shilish sanalmaydi", ru: 'Не дают — присоединение к игре не считается' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Taklif qilgan bilan bir qurilmada — bu hisob sanalmaydi.', ru: 'Одно устройство с пригласившим — этот аккаунт не считается.' }}
    explainWrong={{
      1: { uz: 'Asosiy harakat bor. Hisob qaysi qurilmada ochilgan?', ru: 'Основное действие есть. На каком устройстве открыт аккаунт?' },
      2: { uz: "Taklif kodi to'g'ri — lekin qurilma-chi?", ru: 'Код приглашения верный — а устройство?' },
      3: { uz: "Mentor misolida o'yinga qo'shilish — asosiy harakat.", ru: 'В примере Ментора присоединение к игре — основное действие.' },
      default: { uz: 'Hisob qaysi qurilmada ochilganiga qarang.', ru: 'Посмотрите, на каком устройстве открыт аккаунт.' }
    }} />
);

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  ownLink: { icon: '🔗', name: 'Own Link', desc: { uz: 'Formada taklif kodi maydoni nega kerakligini topdingiz', ru: 'Вы поняли, зачем в форме поле для кода приглашения' } },
  fairReward: { icon: '⚖️', name: 'Fair Reward', desc: { uz: 'Bir qurilmadagi hisob mukofotga sanalmasligini topdingiz', ru: 'Вы поняли, что аккаунт с того же устройства не засчитывается в награду' } },
  codeCounted: { icon: '📊', name: 'Code Counted', desc: { uz: "Taklif kodi bilan ochilgan tekshiruv akkauntini sanab, o'chirdingiz", ru: 'Вы посчитали и удалили проверочный аккаунт, открытый с кодом приглашения' } },
  ruleChecked: { icon: '🛡️', name: 'Rule Checked', desc: { uz: 'Bir xil ID va boshqa ID holatini tekshirdingiz', ru: 'Вы проверили случаи с тем же ID и с другим ID' } }
};
// Ekran id → nishon: ikki ballik savol (birinchi urinish) + ikki blok nishoni (ish uchun — oxirgi «Bajardim»; a3 — ikkala tekshiruv belgilangan bo'lsa)
const ACH_TRIGGERS = { s4: 'ownLink', s7: 'fairReward', a2: 'codeCounted', a3: 'ruleChecked' };

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


// Podium savol yorliqlari (ballik ekran indekslari: 4, 7)
const Q_LABELS = {
  4: { uz: '1 — Formadagi taklif kodi', ru: '1 — Код приглашения в форме' },
  7: { uz: '2 — Bir qurilma', ru: '2 — Одно устройство' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: '?taklif=',   l: 5,  t: 10, s: 26, d: 19, dl: 0 },
  { ch: { uz: 'taklif kodi', ru: 'код приглашения' }, l: 80, t: 8, s: 24, d: 23, dl: 1.5 },
  { ch: 'kanal=taklif', l: 6, t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: { uz: 'mukofot', ru: 'награда' }, l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: { uz: 'qurilma ID', ru: 'ID устройства' }, l: 44, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'tashrif', ru: 'визит' }, l: 64, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: 'hisob', ru: 'аккаунт' }, l: 26, t: 36, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'sanoq', ru: 'подсчёт' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: 'Pro', l: 88, t: 44, s: 24, d: 22, dl: 0.6 },
  { ch: 'Maydon Jamoa', l: 36, t: 58, s: 20, d: 26, dl: 2.5 },
  { ch: { uz: 'taklif havolasi', ru: 'ссылка-приглашение' }, l: 42, t: 4, s: 20, d: 24, dl: 1.7 },
  { ch: { uz: 'Havolani ulashish', ru: 'Havolani ulashish' }, l: 4, t: 50, s: 20, d: 21, dl: 3.2 },
  { ch: { uz: "Taklif kodi (bo'lsa)", ru: 'Код приглашения (если есть)' }, l: 58, t: 80, s: 20, d: 25, dl: 0.3 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob A·B·C·D ×3 (aylanma, MD aynan); ekran savollarining nusxasi emas (§144).
const QUIZ_BANK = [
  { q: { uz: "Ikki tashkilotchi 12-Moduldagi bir xil havolani yubordi. Umami nimani ko'radi?", ru: 'Два организатора отправили одинаковую ссылку из 12-го модуля. Что видит Umami?' }, opts: [{ uz: 'Tashrif «ilova» kanalidan kelganini', ru: 'Что визит пришёл из канала «ilova»' }, { uz: 'Havolani qaysi tashkilotchi yuborganini', ru: 'Какой организатор отправил ссылку' }, { uz: 'Tashkilotchining login va ismini', ru: 'Логин и имя организатора' }, { uz: "Kim ro'yxatdan o'tib, o'ynaganini", ru: 'Кто зарегистрировался и играл' }], correct: 0 },
  { q: { uz: 'Mentor misolida taklif kodi nimadan iborat?', ru: 'Из чего состоит код приглашения в примере Ментора?' }, opts: [{ uz: 'Ismdan va oxirida ikki raqamdan', ru: 'Из имени и двух цифр в конце' }, { uz: 'Olti belgidan: katta harf va raqam', ru: 'Из шести символов: заглавные буквы и цифры' }, { uz: 'Telefon raqamining oxirgi qismidan', ru: 'Из последней части номера телефона' }, { uz: "O'yin raqamidan va e'lon kunidan", ru: 'Из номера игры и дня объявления' }], correct: 1 },
  { q: { uz: "Taklif havolasi ochilganda Mentor lendingi Umami'ga nima yuboradi?", ru: 'Что лендинг Ментора отправляет в Umami при открытии ссылки-приглашения?' }, opts: [{ uz: 'Taklif kodini va kanal belgisini', ru: 'Код приглашения и метку канала' }, { uz: 'Taklif qilgan hisobning loginini', ru: 'Логин пригласившего аккаунта' }, { uz: 'Faqat kanal belgisini: «taklif»', ru: 'Только метку канала: «taklif»' }, { uz: "Hech narsa — Umami havolani ko'rmaydi", ru: 'Ничего — Umami ссылку не видит' }], correct: 2 },
  { q: { uz: "Taklif kodisiz kelgan odam Mentor ilovasida ro'yxatdan o'ta oladimi?", ru: 'Может ли человек без кода приглашения зарегистрироваться в приложении Ментора?' }, opts: [{ uz: "Yo'q — taklif kodi majburiy maydon", ru: 'Нет — код приглашения обязательное поле' }, { uz: "Yo'q — faqat havola orqali kirsa bo'ladi", ru: 'Нет — можно войти только по ссылке' }, { uz: "Ha — lekin faqat iPhone'dagi brauzerda", ru: 'Да — но только в браузере на iPhone' }, { uz: "Ha — maydon «(bo'lsa)», majburiy emas", ru: 'Да — поле «(если есть)», не обязательное' }], correct: 3 },
  { q: { uz: 'Mentor misolida taklif uchun mukofot nima?', ru: 'Что награда за приглашение в примере Ментора?' }, opts: [{ uz: "Pro'ning bepul haftasi, test rejimda", ru: 'Бесплатная неделя Pro в тестовом режиме' }, { uz: "Taklif qilgan odamga so'mda pul", ru: 'Деньги в сумах пригласившему' }, { uz: 'Keyingi pullik obunaga chegirma', ru: 'Скидка на следующую платную подписку' }, { uz: "Yangi hisobga Pro'ning bir oylik muddati", ru: 'Месяц Pro новому аккаунту' }], correct: 0 },
  { q: { uz: 'Taklif kodi bilan ochilgan hisob hali hech narsa qilmagan. Mukofot-chi?', ru: 'Аккаунт, открытый с кодом, ещё ничего не сделал. А награда?' }, opts: [{ uz: "Bor — ro'yxatdan o'tgani yetarli", ru: 'Есть — регистрации достаточно' }, { uz: 'Hali yo\'q — asosiy harakat kutiladi', ru: 'Пока нет — ждём основного действия' }, { uz: "Bor — taklif kodi to'g'ri yozilgan", ru: 'Есть — код приглашения введён верно' }, { uz: "Yo'q — bu hisob endi umuman sanalmaydi", ru: 'Нет — этот аккаунт теперь вообще не считается' }], correct: 1 },
  { q: { uz: 'Mentor qoidasida bir hisobga haftasiga nechta mukofot?', ru: 'Сколько наград в неделю одному аккаунту по правилу Ментора?' }, opts: [{ uz: 'Har taklif uchun — hech cheklovsiz', ru: 'За каждое приглашение — без лимита' }, { uz: 'Bitta — oyiga faqat bir marta', ru: 'Одна — только раз в месяц' }, { uz: "Ko'pi bilan ikkita — haftasiga", ru: 'Не больше двух — в неделю' }, { uz: 'Faqat birinchi taklif uchun', ru: 'Только за первое приглашение' }], correct: 2 },
  { q: { uz: "Ikkinchi telefoni bor odam o'zini taklif qildi. «Bir qurilma» qoidasi-chi?", ru: 'Человек со вторым телефоном пригласил сам себя. А правило «одно устройство»?' }, opts: [{ uz: 'Ushlaydi — taklif kodi bir xil', ru: 'Поймает — код приглашения тот же' }, { uz: "Ushlaydi — ikki login o'xshash", ru: 'Поймает — два логина похожи' }, { uz: "Ushlamaydi — asosiy harakat yo'q", ru: 'Не поймает — нет основного действия' }, { uz: 'Ushlamaydi — qurilmalar har xil', ru: 'Не поймает — устройства разные' }], correct: 3 },
  { q: { uz: "Mentor misolida 18 tashrif va 7 hisob. Ayirsa bo'ladimi?", ru: 'В примере Ментора 18 визитов и 7 аккаунтов. Можно ли вычитать?' }, opts: [{ uz: "Yo'q — biri tashrif, biri hisob", ru: 'Нет — одно визиты, другое аккаунты' }, { uz: "Ha — 11 kishi ro'yxatdan o'tmagan", ru: 'Да — 11 человек не зарегистрировались' }, { uz: "Ha — 11 qurilma ilovani o'chirgan", ru: 'Да — 11 устройств удалили приложение' }, { uz: "Yo'q — Umami sonlari ishonchsiz", ru: 'Нет — цифры Umami ненадёжны' }], correct: 0 },
  { q: { uz: "Mentor misolida jami ro'yxatdan o'tgan — 51. Bu son nima?", ru: 'В примере Ментора всего зарегистрировано — 51. Что это за число?' }, opts: [{ uz: "Har hafta o'yinga keladigan odamlar", ru: 'Люди, приходящие на игру каждую неделю' }, { uz: 'Avvalgi 44 va taklif kodi bilan ochilgan 7 hisob', ru: 'Прежние 44 и 7 аккаунтов, открытых с кодом' }, { uz: 'Faqat taklif havolasi orqali ochilgan hamma hisob', ru: 'Все аккаунты, открытые только по ссылке-приглашению' }, { uz: '50 maqsadiga yetildi — endi ish tugadi', ru: 'Цель 50 достигнута — работа закончена' }], correct: 1 },
  { q: { uz: 'Sinfda tekshiruv akkaunti ochdingiz. Keyin nima qilasiz?', ru: 'Вы открыли в классе проверочный аккаунт. Что дальше?' }, opts: [{ uz: 'Sanoqda qoldirasiz — u ham hisob', ru: 'Оставите в подсчёте — это тоже аккаунт' }, { uz: "Login va parolini o'zgartirasiz", ru: 'Смените логин и пароль' }, { uz: "«Hisobni o'chirish» bilan o'chirasiz", ru: 'Удалите через «Hisobni o\'chirish»' }, { uz: 'Sherigingizga berib, ishlatib turasiz', ru: 'Отдадите напарнику пользоваться' }], correct: 2 },
  { q: { uz: 'Havolangizni qayerga yuborasiz?', ru: 'Куда вы отправите свою ссылку?' }, opts: [{ uz: "Shahar futbol kanaliga — odam ko'p", ru: 'В городской футбольный канал — там много людей' }, { uz: "Mahalla guruhiga — egasidan so'ramay", ru: 'В группу махалли — не спросив владельца' }, { uz: 'Tanimagan tashkilotchilarga — shaxsiyga', ru: 'Незнакомым организаторам — в личку' }, { uz: "O'z jamoangizga — siz a'zo guruhga", ru: 'Своей команде — в группу, где вы состоите' }], correct: 3 },
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

// ===== AMALIYOT BLOKI (172/173) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok 4 band, hammasi o'quvchining o'z repo'sida (5-band yo'q). Qolipda yo'q (qolip taklifi): {…} joyi maydoni va kulrang «masalan» (RfPrompt), band ichidagi «Yordam»,
// «Nusxalash»li Neon so'rovi (SqlQator), tekshiruv kartasi «Kutilganidek» / «Boshqacha» (dars holatida — ccProgress, yangi pm- kaliti yo'q), «Ulgurmasangiz» qatori — shu faylda.
// Blok bajarilgani — faqat 4-band «Bajardim»idan (12-Modul 9.36 h); 4-band «Bajardim»i tekshiruv kartasi tanlanmaguncha qulf. Qadam matni QBlok'da <p> ichida — faqat span (div/pre yo'q).
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
const TK_BOSHQA = { uz: "Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring.", ru: 'Напишите агенту, что не совпало с требованием, и проверьте снова.' };
const XATO_YOLI = { uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если вышла ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Вышла такая ошибка: {ошибка}. Исправь.»' };
// Trek — pm-m9d8-platforma.trek dan faqat O'QILADI (MD A-bo'lim 14: yozilmaydi); yo'q bo'lsa — ikkala trek gapi ko'rinadi
const PLATFORMA_KALIT = 'pm-m9d8-platforma';
const trekOqi = () => { const o = lsOqi(PLATFORMA_KALIT); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
const useTrek = () => { const [trek] = useState(trekOqi); return { trek, web: trek === 'web', mobil: trek !== 'web', ikkala: trek === null }; };
// Trek bo'yicha gap: kalit bor — faqat o'sha trek; yo'q — ikkala gap (pilot 03 naqshi)
const TrekGap = ({ tk, mobil, web }) => (<>
  {mobil && (tk.ikkala || !tk.web) && <span className="rf-band">{tx(mobil)}</span>}
  {web && (tk.ikkala || tk.web) && <span className="rf-band rf-kulrang">{tx(web)}</span>}
</>);
// «{avvalgidek …}» tekshiruvi (2-amaliyot, MD): kamida ikkita ish vergul bilan; «hammasi», «ilova» kabi bitta so'z emas (ikki tilli)
const BIR_SOZ = /^(hammasi|hamma|barchasi|barcha|ilova|loyiha|mahsulot|все|всё|приложение|проект|продукт)$/i;
const ikkiIsh = (s) => { const t = String(s || '').trim(); const b = t.split(/[,;]/).map(x => x.trim()).filter(x => x.length >= 2); return b.length >= 2 && !b.some(x => BIR_SOZ.test(x)); };
const IKKI_ISH_XATO = { uz: "Ikkita aniq ish yozing: masalan, kirish, e'lon berish.", ru: 'Напишите два конкретных дела: например, вход, объявление игры.' };
const nusxala = async (matn) => { try { await navigator.clipboard.writeText(matn); return true; } catch { return false; } };
const joyli = (t, key) => String(t).split(/(\{[^}\s][^}]*\})/g).map((p, i) => (/^\{[^\s].*\}$/.test(p) ? <span key={key + '-' + i} className="q-joy">{p}</span> : <React.Fragment key={key + '-' + i}>{fmtCode(p)}</React.Fragment>));
// Prompt qutisi: {…} joylari maydonga yoziladi (yorliq — joy nomi, kulrang «masalan» — placeholder), «Nusxalash» to'ldirilgan matnni oladi
const RfPrompt = ({ satrlar, joylar = [], qiymat = {}, onYoz, onBlur, tekshir }) => {
  const [ok, setOk] = useState(false);
  const [xato, setXato] = useState(null);
  const almash = (s) => { let r = s; joylar.forEach(j => { const v = String(qiymat[j.id] || '').trim(); if (v) r = r.split(tr(j.joy)).join(v); }); return r; };
  const matn = satrlar.map(l => almash(tr(l)));
  const bos = async () => {
    const x = tekshir ? tekshir(qiymat) : null;
    if (x) { setXato(x); return; }
    setXato(null);
    if (await nusxala(matn.join('\n'))) { setOk(true); setTimeout(() => setOk(false), 1600); }
  };
  return (
    <span className="q-prompt rf-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa rf-nusxa" onClick={bos}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="rf-ps">{joyli(l, i)}</span>)}
      {joylar.length > 0 && <span className="rf-joylar">{joylar.map(j => (
        <label key={j.id} className="rf-joy-m"><span className="rf-joy-n">{tr(j.joy)}</span>
          <input type="text" value={qiymat[j.id] || ''} maxLength={240} placeholder={tr(j.namuna).replace(/`/g, '')} onChange={e => { setXato(null); onYoz(j.id, e.target.value); }} onBlur={onBlur} /></label>))}</span>}
      {xato && <span className="rf-xato" role="status">{tr(xato)}</span>}
    </span>
  );
};
const Yordam = ({ satrlar, sarlavha, ost }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <span className="rf-yordam-ust">
      <QTugma ikkinchi className="rf-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="rf-yordam fade-step">{sarlavha && <b>{tr(sarlavha)}</b>}{satrlar.map((l, i) => <span key={i} className="rf-yordam-s">{tx(l)}</span>)}{ost && <span className="rf-yordam-s rf-kulrang">{tx(ost)}</span>}</span>}
    </span>
  );
};
const Band = ({ children }) => <span className="rf-band">{children}</span>;
const Kulrang = ({ children }) => <span className="rf-band rf-kulrang">{children}</span>;
// Bitta Neon so'rovi «Nusxalash» bilan ({…} — o'quvchi o'zi qo'yadi, kalitga yozilmaydi)
const SqlQator = ({ sql, izoh }) => {
  const [ok, setOk] = useState(false);
  const bos = async () => { if (await nusxala(sql)) { setOk(true); setTimeout(() => setOk(false), 1500); } };
  return (
    <span className="rf-sql-ust"><span className="rf-sql"><code>{sql}</code><button type="button" className="rf-nusxa" onClick={bos}>{ok ? '✓' : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>{izoh && <span className="rf-sql-iz">{tx(izoh)}</span>}</span>
  );
};
// Tekshiruv kartasi (4-band oxirida, «Bajardim»dan oldin): «Kutilganidek» · «Boshqacha» (3, 8-darslar naqshi); 3-amaliyotda — ikkitasi, bittadan
const KUT = { uz: 'Kutilganidek', ru: 'Как ожидалось' };
const BOSH = { uz: 'Boshqacha', ru: 'По-другому' };
const TkKarta = ({ nom, matn, tk, onTanla, qulf }) => (
  <span className={cx('rf-tk', tk && 'tanlandi')}>
    {nom && <b className="rf-tk-nom">{tx(nom)}</b>}
    {matn && <span className="rf-tk-m">{tx(matn)}</span>}
    <span className={cx('rf-tk-btnlar', tk == null && 'rf-chorla')}>
      <button type="button" className={cx('q-chip rf-tk-btn', tk === 'ok' && 'ok')} disabled={qulf} onClick={() => onTanla('ok')}>{tr(KUT)}</button>
      <button type="button" className={cx('q-chip rf-tk-btn', tk === 'boshqa' && 'err')} disabled={qulf} onClick={() => onTanla('boshqa')}>{tr(BOSH)}</button>
    </span>
  </span>
);
// kartalar: [{ id, nom?, matn? }] — bittadan ko'rinadi; minKarta — «Bajardim» qulfi ochiladigan belgilangan kartalar soni
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, ulgur, ulgurQadam = 99, kartalar = [{ id: 'natija' }], minKarta = 1, yashil, pastQator, izoh, extra, ostida }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const [tk, setTk] = useState(() => (storedAnswer && storedAnswer.tekshiruv) || {});
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam;
  const oxirgi = steps.length - 1;
  const belgilangan = kartalar.filter(c => tk[c.id] != null).length;
  const qulfli = !done && stepN === oxirgi && belgilangan < minKarta;
  const bajardim = () => {
    if (isMentorLive || done || qulfli) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { ...(storedAnswer || {}), stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, tekshiruv: tk, ...(extra ? extra(tk) : {}) });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const tanla = (id, v) => setTk(o => ({ ...o, [id]: v }));
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const birinchi = useRef(true);
  const tor = useIsMobile(768);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return undefined; }
    // telefonda tugash signalida xulosa markazga suriladi (eng pastga emas — sarlavha paneli ostiga kirmasin; 08 naqshi)
    const t = setTimeout(() => { const xul = done && tor ? document.querySelector('.q-blok-tugadi') : null; const el = xul || document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: xul ? 'center' : 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor keyingi harakatni aytadi — boshida MD gapi, bandlar orasida keyingi band, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : stepN === oxirgi && belgilangan < minKarta ? { uz: `Keyingi band — «${stepN + 1} · ${steps[stepN].h.uz}»: tekshirib, «Kutilganidek» yoki «Boshqacha»ni tanlang.`, ru: `Следующий пункт — «${stepN + 1} · ${steps[stepN].h.ru}»: проверьте и выберите «Как ожидалось» или «По-другому».` }
      : { uz: `Keyingi band — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий пункт — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  // Kartalar bittadan: oldingisi belgilangach keyingisi chiqadi (E 53)
  const korin = kartalar.filter((c, i) => i === 0 || tk[kartalar[i - 1].id] != null);
  const kartaQism = <>{korin.map(c => <TkKarta key={c.id} nom={c.nom} matn={c.matn} tk={tk[c.id]} qulf={isMentorLive} onTanla={(v) => tanla(c.id, v)} />)}</>;
  const qadamlar = steps.map((c, i) => ({ h: tr(c.h), t: i === oxirgi ? <>{c.t}{kartaQism}</> : c.t, xato: c.xato }));
  const holat = done ? yashil(storedAnswer && storedAnswer.tekshiruv ? storedAnswer.tekshiruv : tk) : null; // { matn, yashil: bool }
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} deskSignal={done ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cx('rf-blok', qulfli && 'qulf')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={qadamlar}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={holat && holat.yashil ? tx(holat.matn) : null} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<>{holat && !holat.yashil && <p className="rf-boshqa fade-step">{tx(holat.matn)}</p>}{done && pastQator && <p className="rf-past fade-step">{tx(pastQator)}</p>}{done && izoh && <QIzoh>{tx(izoh)}</QIzoh>}{done && ostida}<MentorPracticeStats live={_live} screen={screen} /></>}>
          {ortda && <p className="rf-ortda">{tx(ortda)}</p>}
          {ulgur && !done && <p className="rf-ulgur">{tx(ulgur)}</p>}
        </QBlok>
      </div>
    </Stage>
  );
}
// Kutilgan natija: kadrlar bir marta o'zi yuradi (DE-200)
const useKadr = (soni, oraliq = 1500) => {
  const [kadr, setKadr] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma(Array.from({ length: soni - 1 }, (_, i) => [i === 0 ? 1100 : oraliq, () => setKadr(i + 1)])); }, []); // eslint-disable-line
  return kadr;
};
// Neon natijasi kartasi (kutilgan natija): so'rov · natija
const NeonKarta = ({ qatorlar, yorliq }) => (
  <div className="rf-neon">
    <span className="rf-neon-bosh"><b>Neon</b>{yorliq && <em>{tr(yorliq)}</em>}</span>
    {qatorlar.map((q, i) => <span key={i} className={cx('rf-neon-q fade-step', q.k)}><code>{q.s}</code><b>{tr(q.v)}</b></span>)}
  </div>
);
// Web-trekda telefon o'rnida brauzer oynasi (sayt)
const SaytOyna = ({ manzil, children }) => (
  <div className="rf-brauzer sayt"><div className="rf-br-oyna"><span className="rf-br-bar"><i /><i /><i /><span className="rf-br-manzil"><code className="rf-havola">{manzil}</code></span></span><div className="rf-br-tana">{children}</div></div></div>
);

// --- 1-amaliyot: taklif kodi va havola (tayyor talab + 3 joy)
const A1_VAZIFA = { uz: "Har hisobga taklif kodi beriladi; ulashiladigan havolada shu taklif kodi turadi va havola ochgan sahifa uni ko'rsatadi.", ru: 'Каждому аккаунту даётся код приглашения; в ссылке для отправки стоит этот код, а страница по ссылке его показывает.' };
const A1_NIMA = { uz: "Nima qilsin: har hisobga taklif kodi bo'lsin — yangi ustun `taklif_kodi`: 6 belgi, katta harf va raqam, jadvalda noyob. Yangi hisobga ro'yxatdan o'tishda berilsin (noyoblik to'qnashsa — yangi kod bilan qayta yozilsin, oldindan tekshirib emas), mavjud hisoblarning har biriga bir marta berilsin (qayta ishga tushsa ham bor kod almashmasin). Kod maxfiy emas: u bo'yicha hisob haqida hech narsa ko'rsatilmasin. `GET /men` javobiga `taklifKodi` qo'sh.", ru: 'Что сделать: у каждого аккаунта будет код приглашения — новый столбец `taklif_kodi`: 6 символов, заглавные буквы и цифры, уникальный в таблице. Новому аккаунту выдавать при регистрации (при конфликте уникальности — записать заново с новым кодом, а не проверять заранее), каждому существующему — один раз (при повторном запуске существующий код не менять). Код не секретный: по нему ничего об аккаунте не показывать. Добавь `taklifKodi` в ответ `GET /men`.' };
const A1_BUZILMASIN = { uz: "Nima buzilmasin: ro'yxatdan o'tish, kirish, Pro va boshqa `?kanal=` havolalar avvalgidek ishlasin; mavjud hisoblar o'chmasin va o'zgarmasin (faqat taklif kodi qo'shilsin); taklif kodida ism va login bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: регистрация, вход, Pro и другие ссылки `?kanal=` работают как раньше; существующие аккаунты не удаляются и не меняются (добавляется только код приглашения); в коде приглашения нет имени и логина. Больше ничего не трогай, назови изменённые файлы.' };
const A1_PROMPT = [
  { uz: "Qayerda: `backend/` — foydalanuvchilar jadvali va `GET /men`; {ulashish joyi}; {havola ochadigan sahifa}.", ru: 'Где: `backend/` — таблица пользователей и `GET /men`; {место отправки}; {страница по ссылке}.' },
  A1_NIMA,
  { uz: "{ulashish joyi} shu havolani ulashsin: {havola manzili}`?taklif=`taklif kodi`&kanal=taklif`. Tugma nomi va joyi o'zgarmasin.", ru: '{место отправки} пусть делится этой ссылкой: {адрес ссылки}`?taklif=`код приглашения`&kanal=taklif`. Название и место кнопки не меняются.' },
  { uz: "{havola ochadigan sahifa} manzilda `taklif` bo'lsa, qator ko'rsatsin: «Taklif kodi: …» va ostida «Ro'yxatdan o'tishda shu taklif kodini yozing.» `kanal` belgisi avvalgidek Umami'ga ketsin; taklif kodi Umami'ga yuborilmasin.", ru: '{страница по ссылке}: если в адресе есть `taklif`, пусть покажет строку «Taklif kodi: …» и под ней «Ro\'yxatdan o\'tishda shu taklif kodini yozing.» Метка `kanal` уходит в Umami как раньше; код приглашения в Umami не отправлять.' },
  A1_BUZILMASIN
];
const A1_JOYLAR = [
  { id: 'ulashish', joy: { uz: '{ulashish joyi}', ru: '{место отправки}' }, namuna: { uz: "masalan: `mobil/` — «O'yin» ekranidagi «Havolani ulashish» tugmasi", ru: 'например: `mobil/` — кнопка «Havolani ulashish» на экране «O\'yin»' } },
  { id: 'sahifa', joy: { uz: '{havola ochadigan sahifa}', ru: '{страница по ссылке}' }, namuna: { uz: "masalan: `lending/` — bosh sahifadagi «Qanday qo'shilaman» bo'limi", ru: 'например: `lending/` — раздел «Qanday qo\'shilaman» на главной' } },
  { id: 'manzil', joy: { uz: '{havola manzili}', ru: '{адрес ссылки}' }, namuna: { uz: 'masalan: lending manzili (Netlify)', ru: 'например: адрес лендинга (Netlify)' } }
];
const A1_YORDAM = [
  { uz: "Qayerda: `backend/` — `oyinchilar` jadvali va `GET /men`; `mobil/` — «O'yin» ekranidagi «Havolani ulashish» tugmasi; `lending/` — bosh sahifadagi «Qanday qo'shilaman» bo'limi.", ru: 'Где: `backend/` — таблица `oyinchilar` и `GET /men`; `mobil/` — кнопка «Havolani ulashish» на экране «O\'yin»; `lending/` — раздел «Qanday qo\'shilaman» на главной.' },
  A1_NIMA,
  { uz: "«Havolani ulashish» shu havolani ulashsin: lending manzili + `?taklif=`taklif kodi`&kanal=taklif`. Tugma nomi va joyi o'zgarmasin.", ru: '«Havolani ulashish» пусть делится этой ссылкой: адрес лендинга + `?taklif=`код приглашения`&kanal=taklif`. Название и место кнопки не меняются.' },
  { uz: "Lending manzilda `taklif` bo'lsa, «Qanday qo'shilaman» bo'limida qator ko'rsatsin: «Taklif kodi: …» va ostida «Ro'yxatdan o'tishda shu taklif kodini yozing.» `kanal` belgisi avvalgidek Umami'ga ketsin; taklif kodi Umami'ga yuborilmasin.", ru: 'Если в адресе лендинга есть `taklif`, пусть в разделе «Qanday qo\'shilaman» покажет строку «Taklif kodi: …» и под ней «Ro\'yxatdan o\'tishda shu taklif kodini yozing.» Метка `kanal` уходит в Umami как раньше; код приглашения в Umami не отправлять.' },
  A1_BUZILMASIN
];
const A1_WEB = { uz: "Web-trekda: «Qayerda» qatorida «O'yin» ekrani o'rniga saytingizdagi ulashish yoki «Nusxalash» joyi turadi; havola saytingizga olib borsa — taklif kodini sayt ko'rsatadi, qolgani o'sha.", ru: 'В веб-треке: в строке «Где» вместо экрана «O\'yin» — место отправки или «Скопировать» на вашем сайте; если ссылка ведёт на сайт — код приглашения показывает сайт, остальное то же.' };
const A1_KOD = { uz: "Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: taklif kodi yasaladigan qator, mavjud hisoblarga taklif kodi beriladigan joy va havola yig'iladigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в написанном коде три места с именем файла и номером строки: строку, где создаётся код приглашения, место, где код выдаётся существующим аккаунтам, и строку, где собирается ссылка. Объясни одной фразой, что делает каждое. Код не меняй.' };
const A1Natija = ({ tk }) => {
  const kadr = useKadr(3, 1500);
  return (
    <div className="rf-an">
      <div className="rf-an-q">
        {tk.web && !tk.ikkala
          ? <SaytOyna manzil={LENDING}><span className="rf-sayt-q">{tr(TAKLIF_SAHNA.ulash)}</span><HavolaQator /><span className="rf-sayt-btn">{tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</span></SaytOyna>
          : <Telefon yorliq={TAKLIF_SAHNA.t1}><Ilova1 t={{ yondi: kadr === 0, havola: kadr >= 1 ? NAMUNA_HAVOLA : null }} /></Telefon>}
        {kadr >= 1 && <div className="fade-step"><Brauzer b={{ manzil: NAMUNA_HAVOLA, lending: true, kod: true }} /></div>}
      </div>
      {kadr >= 2 && <NeonKarta qatorlar={[{ s: 'COUNT(*) … taklif_kodi IS NULL', v: { uz: '0', ru: '0' }, k: 'ok' }]} yorliq={{ uz: "taklif kodisiz hisob yo'q", ru: 'аккаунтов без кода нет' }} />}
    </div>
  );
};
const ScreenA1 = (props) => {
  const tk = useTrek();
  const st = props.storedAnswer || {};
  const [q, setQ] = useState(() => ({ ulashish: st.ulashish || '' }));
  const yoz = (k, v) => setQ(o => ({ ...o, [k]: v }));
  // {ulashish joyi} — dars holatida saqlanadi (3-amaliyot promptiga oldindan qo'yiladi); boshqa joylar saqlanmaydi
  const saqla = () => { const v = String(q.ulashish || '').trim(); if (v !== (st.ulashish || '')) props.onAnswer(props.screen, { ...st, ulashish: v }); };
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z repo'ngiz", ru: 'Практика 1 · ваш репозиторий' }}
      title={{ uz: <>Har hisobning o'z taklif kodi <span className="italic" style={{ color: T.accent }}>va havolasi</span> bo'lsin.</>, ru: <>Пусть у каждого аккаунта будет свой код приглашения <span className="italic" style={{ color: T.accent }}>и ссылка</span>.</> }}
      mentor={{ uz: "Talab tayyor — uchta qavsni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.", ru: 'Требование готово — три скобки заполните под свой продукт; начните с «1 · Открыть».' }}
      extra={() => ({ ulashish: String(q.ulashish || '').trim() })}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tx({ uz: "Antigravity'da o'z repo'ngizni oching — oxirgi loyiha kunidan (8-dars) keyingi holat. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin; ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»", ru: 'Откройте свой репозиторий в Antigravity — состояние после прошлого дня проекта (8-й урок). В терминале `git status`: файлов `.env` в списке быть не должно; если есть — агенту: «Добавь файлы `.env` в `.gitignore`.»' })}
          <Band>{tx({ uz: "Ikki savolga javob toping: mahsulotingizda havola qayerdan ulashiladi? Havola kimni qayerga olib boradi — lendingga yoki to'g'ri saytingizga? (Mentor misolida: «O'yin» ekranidagi «Havolani ulashish» — lending manzili.)", ru: 'Найдите ответы на два вопроса: откуда в вашем продукте отправляется ссылка? Куда она ведёт — на лендинг или прямо на сайт? (В примере Ментора: «Havolani ulashish» на экране «O\'yin» — адрес лендинга.)' })}</Band>
          <Band>{tx({ uz: "Mahsulotingizda ulashish tugmasi bo'lmasa — havola hisob sahifasida «Nusxalash» bilan tursin: qayerda turishini qavsga o'zingiz yozasiz.", ru: 'Если в продукте нет кнопки отправки — пусть ссылка стоит на странице аккаунта с «Скопировать»: где она будет, напишете в скобке сами.' })}</Band>
          <Band>{tx({ uz: "Bugun havolani faqat o'zingizda tekshirasiz. Keyin ulashsangiz — faqat tanishlaringizga: 12-Moduldagi olti bandli ro'yxat kuchda (bitta xabarni ko'p guruhga tashlamaslik, notanishga yozmaslik).", ru: 'Сегодня проверяете ссылку только на себе. Если потом будете делиться — только со знакомыми: список из шести пунктов из 12-го модуля в силе (не рассылать одно сообщение по многим группам, не писать незнакомым).' })}</Band>
          <TrekGap tk={tk} web={{ uz: "Web-trekda: «Havolani ulashish» o'rnida — saytingizdagi ulashish yoki «Nusxalash» joyi; havola lendingga yoki saytingizga olib borishi mumkin — tanlov sizda.", ru: 'В веб-треке: вместо «Havolani ulashish» — место отправки или «Скопировать» на сайте; ссылка может вести на лендинг или на сайт — выбор за вами.' }} /></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' })}
          <span className="rf-vazifa">{tr(A1_VAZIFA)}</span>
          <RfPrompt satrlar={A1_PROMPT} joylar={A1_JOYLAR} qiymat={q} onYoz={yoz} onBlur={saqla} />
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq prompt (mobil trek)", ru: 'Полный промпт из примера Ментора (мобильный трек)' }} satrlar={A1_YORDAM} ost={tk.ikkala || tk.web ? A1_WEB : null} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"taklif kodi va havola\"`, `git push`.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают со списком агента, `.env` в списке нет; каждый файл добавьте `git add <файл>`, `git commit -m "taklif kodi va havola"`, `git push`.' })}
          <Band>{tx({ uz: "Backend o'zgardi — Render sahifangizda yangi deploy tugashini kuting (bir necha daqiqa cho'zilishi mumkin); lending Netlify'da odatda o'zi yangilanadi.", ru: 'Backend изменился — дождитесь на странице Render окончания нового деплоя (может занять несколько минут); лендинг на Netlify обычно обновляется сам.' })}</Band>
          <TrekGap tk={tk} mobil={{ uz: "Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`).", ru: 'В мобильном треке Expo Go обычно сам перезагружает приложение (если нет — `r` в терминале).' }} />
          <Band>{tx({ uz: "Kutayotganda agentdan yozgan kodini ko'rsatishni so'rang:", ru: 'Пока ждёте, попросите агента показать написанный код:' })}</Band>
          <RfPrompt satrlar={[A1_KOD]} /></>,
          xato: tx(XATO_YOLI) },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "talabning har gapini o'zingiz ko'ring (jadval va ustun nomlari — mahsulotingizdagidek):", ru: 'проверьте сами каждую фразу требования (имена таблиц и столбцов — как в вашем продукте):' })}
          <Band><b>(1)</b> {tx({ uz: "Neon SQL Editor'da — «Run»: `0` bo'lishi kerak (taklif kodisiz hisob yo'q).", ru: 'В Neon SQL Editor — «Run»: должно быть `0` (аккаунтов без кода нет).' })}</Band>
          <SqlQator sql="SELECT COUNT(*) FROM oyinchilar WHERE taklif_kodi IS NULL;" />
          <SqlQator sql="SELECT taklif_kodi FROM oyinchilar GROUP BY taklif_kodi HAVING COUNT(*) > 1;" izoh={{ uz: "natija bo'sh bo'lishi kerak (bir xil taklif kodi ikki hisobda yo'q)", ru: 'результат должен быть пустым (одинакового кода у двух аккаунтов нет)' }} />
          <Band><b>(2)</b> {tx({ uz: "O'z taklif kodingizni ko'ring:", ru: 'Посмотрите свой код приглашения:' })}</Band>
          <SqlQator sql="SELECT taklif_kodi FROM oyinchilar WHERE login = '{loginingiz}';" />
          <Band><b>(3)</b> {tx({ uz: "Ilovada «Havolani ulashish»ni bosing va havolani faqat o'zingizga yuboring yoki nusxalang. Havolada `?taklif=` va olti belgi bo'lishi kerak — (2) dagi taklif kodingiz bilan bir xil.", ru: 'В приложении нажмите «Havolani ulashish» и отправьте ссылку только себе или скопируйте. В ссылке должны быть `?taklif=` и шесть символов — те же, что ваш код в (2).' })}</Band>
          <Band><b>(4)</b> {tx({ uz: "Havolani telefon brauzerida oching: «Qanday qo'shilaman» bo'limida «Taklif kodi: …» — o'sha olti belgi turishi kerak.", ru: 'Откройте ссылку в браузере телефона: в разделе «Qanday qo\'shilaman» должно стоять «Taklif kodi: …» — те же шесть символов.' })}</Band>
          <Kulrang>{tx({ uz: "Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Несовпавшее напишите агенту: «{что} не как в требовании: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»' })}</Kulrang></> }
      ]}
      natija={<A1Natija tk={tk} />}
      yashil={(t) => (t.natija === 'boshqa' ? { matn: TK_BOSHQA, yashil: false } : { matn: { uz: "Har hisobda taklif kodi bor; havola uni olib boradi va sahifa uni ko'rsatadi.", ru: 'У каждого аккаунта есть код приглашения; ссылка его несёт, а страница показывает.' }, yashil: true })}
      izoh={{ uz: "Umami'ga faqat kanal ketadi: taklif kodi va uni kim ochgani u yerda yozilmaydi.", ru: 'В Umami уходит только канал: код приглашения и кто его открыл, там не записываются.' }}
      ortda={{ uz: "Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-10-done` — oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. Qanday ishlashini ko'rasiz, o'z repo'ngizdagi ishni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).", ru: 'Отстали? Откройте пример Ментора вне своего репозитория, в новой папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-10-done` — последнюю команду запускайте только в этой новой папке: она удаляет изменения в папке. Посмотрите, как работает, и повторите в своём репозитории (в `backend/.env` и `mobil/.env` впишите свои значения).' }}
      ulgur={{ uz: "Ulgurmasangiz: Render kutilganda agent ko'rsatgan qatorlarni o'qing. Tekshiruvni 2-amaliyotdan keyinga surmang — u ham ro'yxatdan o'tish kodiga tegadi, keyin qaysi o'zgarish buzganini ajratish qiyin. «Davom etish» 4-band «Bajardim»idan keyin ochiladi.", ru: 'Если не успеваете: пока ждёте Render, читайте строки, которые показал агент. Не переносите проверку на после практики 2 — она тоже трогает код регистрации, потом трудно понять, какое изменение сломало. «Продолжить» откроется после «Готово» в пункте 4.' }} />
  );
};

// --- 2-amaliyot: formadagi taklif kodi va sanoq (tayyor talab + 3 joy; tekshiruv akkaunti — keyin o'chiriladi)
const A2_VAZIFA = { uz: "Ro'yxatdan o'tish formasida majburiy bo'lmagan «Taklif kodi (bo'lsa)» maydoni bor; to'g'ri taklif kodi bilan ochilgan hisobda taklif qilgan yoziladi va u sanoqda ko'rinadi.", ru: 'В форме регистрации есть необязательное поле «Taklif kodi (bo\'lsa)»; у аккаунта, открытого с верным кодом, записывается пригласивший, и он виден в подсчёте.' };
const A2_NIMA = (xabar) => ({ uz: `Nima qilsin: formada yangi maydon «Taklif kodi (bo'lsa)» — majburiy emas. Taklif kodi yozilsa, bo'shliqlari olib tashlanib katta harfga o'tkazilsin (ab12cd ham AB12CD), keyin Backend shu \`taklif_kodi\` li hisobni topsin va yangi hisobga yozsin: \`taklif_qilgan_id\`. Topilmasa — hisob ochilmasin va maydon ostida chiqsin: «${xabar.uz}». Bo'sh qolsa — hisob avvalgidek ochilsin.`, ru: `Что сделать: в форме новое поле «Taklif kodi (bo'lsa)» — необязательное. Если код введён, убрать пробелы и перевести в верхний регистр (ab12cd тоже AB12CD), затем Backend находит аккаунт с этим \`taklif_kodi\` и записывает в новый аккаунт: \`taklif_qilgan_id\`. Если не найден — аккаунт не открывается, под полем выводится: «${xabar.ru}». Если пусто — аккаунт открывается как раньше.` });
const A2_PROMPT = [
  { uz: "Qayerda: `backend/` — ro'yxatdan o'tish yo'li va foydalanuvchilar jadvali; {forma joyi}.", ru: 'Где: `backend/` — путь регистрации и таблица пользователей; {место формы}.' },
  A2_NIMA({ uz: '{topilmasa xabar}', ru: '{сообщение, если не найден}' }),
  { uz: "Nima buzilmasin: taklif kodisiz ro'yxatdan o'tish, kirish va {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; mavjud hisoblar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: регистрация без кода, вход и {что должно работать как раньше} работают как раньше; существующие аккаунты не меняются. Больше ничего не трогай, назови изменённые файлы.' }
];
const A2_JOYLAR = [
  { id: 'forma', joy: { uz: '{forma joyi}', ru: '{место формы}' }, namuna: { uz: "masalan: `mobil/` — «Ro'yxatdan o'tish» ekrani, «Parol» maydoni ostida", ru: 'например: `mobil/` — экран «Ro\'yxatdan o\'tish», под полем «Parol»' } },
  { id: 'xabar', joy: { uz: '{topilmasa xabar}', ru: '{сообщение, если не найден}' }, namuna: { uz: "masalan: Bunday taklif kodi topilmadi — tekshiring yoki maydonni bo'sh qoldiring.", ru: 'например: Такой код приглашения не найден — проверьте или оставьте поле пустым.' } },
  { id: 'avval', joy: { uz: "{avvalgidek ishlashi kerak bo'lgan ishlar}", ru: '{что должно работать как раньше}' }, namuna: { uz: "masalan: o'yin e'loni, qo'shilish, Pro va Telegram xabari", ru: 'например: объявление игры, присоединение, Pro и сообщение в Telegram' } }
];
const A2_YORDAM = [
  { uz: "Qayerda: `backend/` — `POST /royxat` va `oyinchilar` jadvali; `mobil/` — «Ro'yxatdan o'tish» ekrani, «Parol» maydoni ostida.", ru: 'Где: `backend/` — `POST /royxat` и таблица `oyinchilar`; `mobil/` — экран «Ro\'yxatdan o\'tish», под полем «Parol».' },
  A2_NIMA(XABAR_TOPILMADI),
  { uz: "Nima buzilmasin: taklif kodisiz ro'yxatdan o'tish, kirish va o'yin e'loni, qo'shilish, Pro va Telegram xabari avvalgidek ishlasin; mavjud hisoblar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: регистрация без кода, вход и объявление игры, присоединение, Pro и сообщение в Telegram работают как раньше; существующие аккаунты не меняются. Больше ничего не трогай, назови изменённые файлы.' }
];
const A2_WEB = { uz: "Web-trekda: «Qayerda» — saytingizdagi ro'yxatdan o'tish formasi; manzilda `taklif` bo'lsa, maydon shu taklif kodi bilan to'lib turishi mumkin — qolgani o'sha.", ru: 'В веб-треке: «Где» — форма регистрации на вашем сайте; если в адресе есть `taklif`, поле может быть заполнено этим кодом — остальное то же.' };
const A2_KOD = { uz: "Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: taklif kodi bo'yicha hisob qidiriladigan qator va `taklif_qilgan_id` yoziladigan qator. Kodni o'zgartirma.", ru: 'Покажи в написанном коде два места с именем файла и номером строки: строку, где ищется аккаунт по коду приглашения, и строку, где записывается `taklif_qilgan_id`. Код не меняй.' };
const SQL_HARAKAT = "SELECT COUNT(*) FROM oyinchilar o WHERE o.namuna = false AND o.taklif_qilgan_id IS NOT NULL AND (EXISTS (SELECT 1 FROM ishtirokchilar i WHERE i.oyinchi_id = o.id AND i.holat IN ('qoshildi', 'keladi')) OR EXISTS (SELECT 1 FROM oyinlar g WHERE g.tashkilotchi_id = o.id));";
const A2Natija = ({ tk }) => {
  const kadr = useKadr(3, 1700);
  const forma = kadr === 0 ? { kod: 'ZZZZZZ', xato: true } : { ism: 'Tekshiruv', login: 'tekshiruv1', parol: '••••••', kod: NAMUNA_KOD };
  return (
    <div className="rf-an">
      <div className="rf-an-q">
        {tk.web && !tk.ikkala
          ? <SaytOyna manzil={NAMUNA_HAVOLA}><span className="rf-sayt-q">{tr(TAKLIF_SAHNA.royxat)}</span><span className="rf-maydon kod"><em>{tr(TAKLIF_SAHNA.kodMaydon)}</em><b>{NAMUNA_KOD}</b></span></SaytOyna>
          : <Telefon yorliq={{ uz: 'telefon · Expo Go', ru: 'телефон · Expo Go' }}><Ilova2 t={{ ornatildi: true, forma }} /></Telefon>}
        {kadr >= 1 && <NeonKarta yorliq={{ uz: "tekshiruv akkaunti — keyin o'chiriladi", ru: 'проверочный аккаунт — потом удаляется' }} qatorlar={[
          { s: 'taklif_qilgan_id', v: { uz: 'tashkilotchi hisobining id si', ru: 'id аккаунта организатора' } },
          { s: { uz: 'taklif kodi bilan ochilgan', ru: 'открыто с кодом' }, v: { uz: '1', ru: '1' } },
          { s: { uz: 'asosiy harakat qilgan', ru: 'с основным действием' }, v: { uz: '0', ru: '0' } },
          ...(kadr >= 2 ? [{ s: { uz: "o'chirilgandan keyin", ru: 'после удаления' }, v: { uz: '0', ru: '0' }, k: 'ok' }] : [])
        ].map(r => ({ ...r, s: typeof r.s === 'string' ? r.s : tr(r.s) }))} />}
      </div>
    </div>
  );
};
const ScreenA2 = (props) => {
  const tk = useTrek();
  const [q, setQ] = useState({});
  const yoz = (k, v) => setQ(o => ({ ...o, [k]: v }));
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z repo'ngiz", ru: 'Практика 2 · ваш репозиторий' }}
      title={{ uz: <>Formadagi taklif kodi <span className="italic" style={{ color: T.accent }}>taklif qilgan hisobni</span> topsin.</>, ru: <>Пусть код в форме <span className="italic" style={{ color: T.accent }}>находит пригласившего</span>.</> }}
      mentor={{ uz: "Havoladagi taklif kodi ilovaga o'tmaydi — formaga maydon qo'shasiz; «1 · Ochish»dan boshlang.", ru: 'Код из ссылки не переходит в приложение — добавите поле в форму; начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tr({ uz: "ro'yxatdan o'tish formangizni oching (ilovada yoki saytda). Ikki savolga javob toping: maydon formaning qayerida turadi? Taklif kodi topilmasa, odam nimani ko'radi?", ru: 'откройте свою форму регистрации (в приложении или на сайте). Ответьте на два вопроса: где в форме будет поле? Что увидит человек, если код не найден?' })}
          <Band>{tx({ uz: "(Mentor misolida: maydon «Parol» ostida; xabar — «Bunday taklif kodi topilmadi — tekshiring yoki maydonni bo'sh qoldiring.»)", ru: '(В примере Ментора: поле под «Parol»; сообщение — «Bunday taklif kodi topilmadi — tekshiring yoki maydonni bo\'sh qoldiring.»)' })}</Band>
          <TrekGap tk={tk} web={{ uz: "Web-trekda: havola va forma bitta brauzerda ochilsa, saytingiz taklif kodini havoladan maydonga o'zi qo'yishi mumkin — xohlasangiz, buni qavsga yozing; maydon baribir tahrirlanadi.", ru: 'В веб-треке: если ссылка и форма открываются в одном браузере, сайт может сам перенести код из ссылки в поле — если хотите, напишите это в скобке; поле всё равно редактируется.' }} /></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки, нажмите «Скопировать» и отправьте в Antigravity:' })}
          <span className="rf-vazifa">{tr(A2_VAZIFA)}</span>
          <RfPrompt satrlar={A2_PROMPT} joylar={A2_JOYLAR} qiymat={q} onYoz={yoz} tekshir={(v) => (ikkiIsh(v.avval) ? null : IKKI_ISH_XATO)} />
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq prompt (mobil trek)", ru: 'Полный промпт из примера Ментора (мобильный трек)' }} satrlar={A2_YORDAM} ost={tk.ikkala || tk.web ? A2_WEB : null} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "`git status` → `git add <fayl>` → `git commit -m \"formada taklif kodi\"` → `git push`. Render'da yangi deploy tugashini kuting.", ru: '`git status` → `git add <файл>` → `git commit -m "formada taklif kodi"` → `git push`. Дождитесь окончания нового деплоя на Render.' })}
          <Band>{tx({ uz: 'Kutayotganda agentga:', ru: 'Пока ждёте — агенту:' })}</Band>
          <RfPrompt satrlar={[A2_KOD]} /></>,
          xato: tx(XATO_YOLI) },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "tekshiruv akkaunti bilan; oxirida uni o'chirasiz:", ru: 'с проверочным аккаунтом; в конце удалите его:' })}
          <Band><b>(1)</b> {tx({ uz: "Ilovada (Expo Go) «Hisobdan chiqish» → «Ro'yxatdan o'tish»: «Taklif kodi (bo'lsa)» maydoni turibdi. Avval yo'q taklif kodini yozing (masalan, `ZZZZZZ`) — hisob ochilmasligi va xabar chiqishi kerak.", ru: 'В приложении (Expo Go) «Hisobdan chiqish» → «Ro\'yxatdan o\'tish»: поле «Taklif kodi (bo\'lsa)» на месте. Сначала введите несуществующий код (например, `ZZZZZZ`) — аккаунт не должен открыться, должно появиться сообщение.' })}</Band>
          <Band><b>(2)</b> {tx({ uz: "Tekshiruv akkaunti oching: ism — «Tekshiruv», login — `tekshiruv1` (haqiqiy emas), taklif kodi — 1-amaliyotda lendingda ko'rgan taklif kodingiz, aynan o'sha ko'rinishda.", ru: 'Откройте проверочный аккаунт: имя — «Tekshiruv», логин — `tekshiruv1` (не настоящий), код приглашения — тот, что вы видели на лендинге в практике 1, в точности.' })}</Band>
          <Band><b>(3)</b> {tx({ uz: "Neon SQL Editor'da — sizning hisobingiz `id` si chiqishi kerak:", ru: 'В Neon SQL Editor — должен выйти `id` вашего аккаунта:' })}</Band>
          <SqlQator sql="SELECT taklif_qilgan_id FROM oyinchilar WHERE login = 'tekshiruv1';" izoh={{ uz: "o'zingiznikini: `SELECT id FROM oyinchilar WHERE login = '{loginingiz}';`", ru: "свой: `SELECT id FROM oyinchilar WHERE login = '{ваш логин}';`" }} />
          <Band><b>(4)</b> {tx({ uz: "Sanoq — Mentor misolidagi so'rovlar (nomlar — mahsulotingizdagidek; asosiy harakat — 12-Modulda sanagan so'rovingizga `taklif_qilgan_id IS NOT NULL` sharti qo'shiladi):", ru: 'Подсчёт — запросы из примера Ментора (имена — как в вашем продукте; основное действие — к вашему запросу из 12-го модуля добавляется условие `taklif_qilgan_id IS NOT NULL`):' })}</Band>
          <SqlQator sql="SELECT COUNT(*) FROM oyinchilar WHERE namuna = false AND taklif_qilgan_id IS NOT NULL;" izoh={{ uz: 'taklif kodi bilan ochilgan hisoblar: hozir tekshiruv akkaunti ham shu yerda (1).', ru: 'аккаунты, открытые с кодом: сейчас здесь и проверочный аккаунт (1).' }} />
          <SqlQator sql={SQL_HARAKAT} izoh={{ uz: 'ulardan asosiy harakat qilgani: hozir `0`.', ru: 'из них с основным действием: сейчас `0`.' }} />
          <Band>{tx({ uz: "Umami'da `tashrif` yozuvlarini kanal bo'yicha oching — «taklif» kanalida 1-amaliyotda ochgan havolangiz ko'rinishi kerak (ko'rinmasa — biroz kutib, sahifani yangilang).", ru: 'В Umami откройте записи `tashrif` по каналам — в канале «taklif» должна быть видна ссылка, открытая в практике 1 (если не видно — подождите и обновите страницу).' })}</Band>
          <Band><b>(5)</b> {tx({ uz: "Tekshiruv akkauntini o'chiring: ilovada «Hisobni o'chirish» → «Rostdan o'chirasizmi?» — tasdiqlang. Birinchi so'rovni qayta yurgizing — son bittaga kamayishi kerak. Keyin o'z hisobingizga qayta kiring.", ru: 'Удалите проверочный аккаунт: в приложении «Hisobni o\'chirish» → «Rostdan o\'chirasizmi?» — подтвердите. Запустите первый запрос снова — число должно уменьшиться на один. Потом снова войдите в свой аккаунт.' })}</Band>
          <TrekGap tk={tk} web={{ uz: "Web-trekda: shu tekshiruv — saytingizda, kompyuterdagi yashirin oynada; «Hisobni o'chirish» — saytdagi o'sha tugma.", ru: 'В веб-треке: та же проверка — на сайте, в скрытом окне на компьютере; «Hisobni o\'chirish» — та же кнопка на сайте.' }} /></> }
      ]}
      natija={<A2Natija tk={tk} />}
      yashil={(t) => (t.natija === 'boshqa' ? { matn: TK_BOSHQA, yashil: false } : { matn: { uz: "Taklif kodi bilan ochilgan hisob taklif qilganga bog'landi va sanoqda ko'rindi; tekshiruv akkaunti o'chirildi.", ru: 'Аккаунт, открытый с кодом, связан с пригласившим и виден в подсчёте; проверочный аккаунт удалён.' }, yashil: true })}
      izoh={{ uz: "Sinfdagi tekshiruv akkaunti haqiqiy sanoqqa qo'shilmaydi — shuning uchun u o'chiriladi.", ru: 'Проверочный аккаунт из класса не входит в настоящий подсчёт — поэтому его удаляют.' }}
      ulgur={{ uz: "Ulgurmasangiz: Umami tekshiruvini dars oxiriga qoldiring; tekshiruv akkauntini o'chirishni o'tkazib yubormang. «Davom etish» 4-band «Bajardim»idan keyin ochiladi — 3-amaliyot ham ro'yxatdan o'tish kodiga tegadi.", ru: 'Если не успеваете: проверку Umami оставьте на конец урока; не пропускайте удаление проверочного аккаунта. «Продолжить» откроется после «Готово» в пункте 4 — практика 3 тоже трогает код регистрации.' }} />
  );
};

// --- 3-amaliyot: mukofot va uch shart (tayyor talab + 4 joy + {ulashish joyi} 1-amaliyotdan oldindan)
const A3_VAZIFA = { uz: "Taklif kodi bilan ochilgan hisob birinchi marta asosiy harakat qilganda mukofot bir marta tekshiriladi: bir qurilma va namuna hisob sanalmaydi, haftalik cheklov bor.", ru: 'Когда аккаунт, открытый с кодом, впервые делает основное действие, награда проверяется один раз: то же устройство и образцовый аккаунт не считаются, есть недельный лимит.' };
const A3_SIYOSAT = { uz: "`lending/maxfiylik.html` dagi «Qaysi ma'lumot?» va «Nima uchun?» javoblariga qo'sh: «Taklif kodi bilan kelgan hisoblarda kim kimni taklif qilgani, mukofot natijasi va vaqti, hisob ishlatilgan qurilma ID lari saqlanadi — mukofotni qoidaga ko'ra berish va bir qurilma ID li hisoblarni ajratish uchun.» Mukofot bo'lsa — `lending/oferta.html` ga (7-dars) «Taklif mukofoti» bandi: qoida qatori va qachon berilmasligi (namuna hisob, bir qurilma ID, taklif qilganning qurilmasi noma'lum, haftalik cheklov). Gapni kod bilan solishtir: kodda shu ish uchun saqlanadigan, lekin gapda yo'q ma'lumot bo'lsa — uni ayt, o'zing qo'shma.", ru: 'В ответы «Qaysi ma\'lumot?» и «Nima uchun?» в `lending/maxfiylik.html` добавь: «Taklif kodi bilan kelgan hisoblarda kim kimni taklif qilgani, mukofot natijasi va vaqti, hisob ishlatilgan qurilma ID lari saqlanadi — mukofotni qoidaga ko\'ra berish va bir qurilma ID li hisoblarni ajratish uchun.» Если награда есть — в `lending/oferta.html` (7-й урок) пункт «Taklif mukofoti»: строка правила и когда награда не даётся (образцовый аккаунт, один ID устройства, устройство пригласившего неизвестно, недельный лимит). Сравни текст с кодом: если в коде для этого хранится что-то, чего нет в тексте, — скажи, сам не добавляй.' };
const A3_PROMPT = [
  { uz: "Qayerda: `backend/` — foydalanuvchilar jadvali, ro'yxatdan o'tish va asosiy harakat yo'llari; {ulashish joyi}; `lending/maxfiylik.html`.", ru: 'Где: `backend/` — таблица пользователей, пути регистрации и основного действия; {место отправки}; `lending/maxfiylik.html`.' },
  { uz: "Nima qilsin: ilova ro'yxatdan o'tishda, hisobga kirishda va havola ulashilganda shu qurilma ID sini Backend'ga yuborsin; Backend uni hisobning qurilmalari ro'yxatiga yozsin (yangi jadval: hisob va qurilma ID jufti noyob; eskisi o'chmaydi — hisob bir nechta qurilmada ishlatilishi mumkin).", ru: 'Что сделать: при регистрации, входе в аккаунт и отправке ссылки приложение отправляет ID этого устройства в Backend; Backend записывает его в список устройств аккаунта (новая таблица: пара аккаунт и ID устройства уникальна; старая не удаляется — аккаунт может использоваться на нескольких устройствах).' },
  { uz: "Taklif kodi bilan ochilgan hisob birinchi marta {asosiy harakat} — asosiy harakat avval saqlansin; keyin alohida Database ishida Backend bir marta tekshirsin: 1) ikkala hisob ham namuna emas; 2) yangi hisob ochilgan qurilma ID si taklif qilganning qurilmalari ichida yo'q (taklif qilganning qurilmasi hali yozilmagan bo'lsa — mukofot yo'q); 3) taklif qilgan hisob shu hafta (dushanbadan yakshanbagacha, Toshkent vaqti) {haftalik cheklov} tadan kam mukofot olgan — sanashda taklif qilgan hisob qatori qulflansin (bir vaqtdagi ikki so'rov ham cheklovdan oshirmasin).", ru: 'Когда аккаунт, открытый с кодом, впервые {основное действие} — сначала сохранить основное действие; затем отдельной операцией Database Backend один раз проверяет: 1) оба аккаунта не образцовые; 2) ID устройства, где открыт новый аккаунт, нет среди устройств пригласившего (если устройство пригласившего ещё не записано — награды нет); 3) пригласивший аккаунт на этой неделе (с понедельника по воскресенье, время Ташкента) получил меньше {недельный лимит} наград — при подсчёте строка пригласившего аккаунта блокируется (и два одновременных запроса не превысят лимит).' },
  { uz: "Natijani yangi jadvalga yoz: taklif natijalari — kim taklif qilgan, kim taklif qilingan (bitta hisobga bitta yozuv, noyob), natija — `berildi`, `bir-qurilma`, `namuna`, `nomalum` yoki `cheklov`, va vaqti. `berildi` bo'lsa, shu Database ishining ichida: {mukofot}. Taklif qilingan hisob o'chirilsa — yozuv qoladi, undagi hisob havolasi bo'shatiladi (haftalik sanoq buzilmasin). Tekshiruvda xato bo'lsa — asosiy harakat buzilmasin: xato logga yozilsin, yozuv qo'shilmasin, keyingi asosiy harakatda yana tekshirilsin.", ru: 'Запиши результат в новую таблицу — результаты приглашений: кто пригласил, кого пригласили (одна запись на аккаунт, уникальная), результат — `berildi`, `bir-qurilma`, `namuna`, `nomalum` или `cheklov`, и время. Если `berildi` — в той же операции Database: {награда}. Если приглашённый аккаунт удалят — запись остаётся, ссылка на аккаунт в ней очищается (недельный подсчёт не ломается). Если при проверке ошибка — основное действие не ломается: ошибка пишется в лог, запись не добавляется, при следующем основном действии проверка повторяется.' },
  { uz: "{ulashish joyi} ostida bitta kulrang qator: «{qoida qatori}».", ru: '{место отправки}: под ним одна серая строка: «{строка правила}».' },
  A3_SIYOSAT,
  { uz: "Nima buzilmasin: pul, chegirma yoki boshqa narsa berilmasin — faqat {mukofot}; asosiy harakat avvalgidek ishlasin; qurilma ID dan boshqa ma'lumot so'ralmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: деньги, скидки или что-то другое не выдавать — только {награда}; основное действие работает как раньше; кроме ID устройства, ничего не запрашивать. Больше ничего не трогай, назови изменённые файлы.' }
];
const A3_JOYLAR = [
  { id: 'ulashish', joy: { uz: '{ulashish joyi}', ru: '{место отправки}' }, namuna: { uz: "masalan: `mobil/` — «O'yin» ekranidagi «Havolani ulashish» tugmasi", ru: 'например: `mobil/` — кнопка «Havolani ulashish» на экране «O\'yin»' } },
  { id: 'harakat', joy: { uz: '{asosiy harakat}', ru: '{основное действие}' }, namuna: { uz: "masalan: o'yinga qo'shilsa yoki o'yin e'lon qilsa", ru: 'например: присоединится к игре или объявит игру' } },
  { id: 'cheklov', joy: { uz: '{haftalik cheklov}', ru: '{недельный лимит}' }, namuna: { uz: 'masalan: 2', ru: 'например: 2' } },
  { id: 'mukofot', joy: { uz: '{mukofot}', ru: '{награда}' }, namuna: { uz: "masalan: taklif qilganning `pro_gacha` si 7 kunga uzaysin (o'tgan yoki bo'sh bo'lsa — bugundan)", ru: 'например: `pro_gacha` пригласившего продлевается на 7 дней (если прошёл или пуст — с сегодня)' } },
  { id: 'qoida', joy: { uz: '{qoida qatori}', ru: '{строка правила}' }, namuna: { uz: 'masalan: ' + QOIDA_QATORI.uz, ru: 'например: ' + QOIDA_QATORI.ru } }
];
const A3_YORDAM = [
  { uz: "Qayerda: `backend/` — `oyinchilar` jadvali, `POST /royxat`, `POST /oyinlar` va `POST /oyinlar/:id/qoshilish`; `mobil/` — «Ro'yxatdan o'tish» ekrani va «O'yin» ekranidagi «Havolani ulashish» tugmasi; `lending/maxfiylik.html`.", ru: 'Где: `backend/` — таблица `oyinchilar`, `POST /royxat`, `POST /oyinlar` и `POST /oyinlar/:id/qoshilish`; `mobil/` — экран «Ro\'yxatdan o\'tish» и кнопка «Havolani ulashish» на экране «O\'yin»; `lending/maxfiylik.html`.' },
  { uz: "Nima qilsin: ilova ro'yxatdan o'tishda, hisobga kirishda va «Havolani ulashish» bosilganda shu qurilma ID sini Backend'ga yuborsin; Backend uni `oyinchi_qurilmalari` ga yozsin (`oyinchi_id` va `qurilma_id` jufti noyob; eskisi o'chmaydi).", ru: 'Что сделать: при регистрации, входе в аккаунт и нажатии «Havolani ulashish» приложение отправляет ID этого устройства в Backend; Backend записывает его в `oyinchi_qurilmalari` (пара `oyinchi_id` и `qurilma_id` уникальна; старая не удаляется).' },
  { uz: "Taklif kodi bilan ochilgan hisob birinchi marta o'yinga qo'shilsa yoki o'yin e'lon qilsa — qo'shilish yoki e'lon avval saqlansin; keyin alohida Database ishida Backend bir marta tekshirsin: 1) ikkala hisob ham namuna emas; 2) yangi hisob ochilgan qurilma ID si taklif qilganning `oyinchi_qurilmalari` ichida yo'q (taklif qilganniki hali yozilmagan bo'lsa — mukofot yo'q); 3) taklif qilgan hisob shu hafta (dushanbadan yakshanbagacha, Toshkent vaqti) 2 tadan kam mukofot olgan — sanashda taklif qilganning `oyinchilar` qatori qulflansin (`FOR UPDATE`).", ru: 'Когда аккаунт, открытый с кодом, впервые присоединится к игре или объявит игру — сначала сохранить присоединение или объявление; затем отдельной операцией Database Backend один раз проверяет: 1) оба аккаунта не образцовые; 2) ID устройства нового аккаунта нет в `oyinchi_qurilmalari` пригласившего (если у пригласившего ещё не записано — награды нет); 3) пригласивший на этой неделе (с понедельника по воскресенье, время Ташкента) получил меньше 2 наград — при подсчёте строка `oyinchilar` пригласившего блокируется (`FOR UPDATE`).' },
  { uz: "Natijani yangi jadvalga yoz: `taklif_natijalari` — `id`, `taklif_qilgan_id`, `taklif_qilingan_id` (noyob; hisob o'chirilsa — bo'shatiladi, yozuv qoladi), `natija` (`berildi` · `bir-qurilma` · `namuna` · `nomalum` · `cheklov`), `yaratilgan`. `berildi` bo'lsa, shu Database ishining ichida taklif qilganning `pro_gacha` si 7 kunga uzaysin (o'tgan yoki bo'sh bo'lsa — bugundan). Tekshiruvda xato bo'lsa — qo'shilish va e'lon buzilmasin: xato logga yozilsin, yozuv qo'shilmasin, keyingi harakatda yana tekshirilsin.", ru: 'Запиши результат в новую таблицу: `taklif_natijalari` — `id`, `taklif_qilgan_id`, `taklif_qilingan_id` (уникальный; если аккаунт удалят — очищается, запись остаётся), `natija` (`berildi` · `bir-qurilma` · `namuna` · `nomalum` · `cheklov`), `yaratilgan`. Если `berildi` — в той же операции Database `pro_gacha` пригласившего продлевается на 7 дней (если прошёл или пуст — с сегодня). Если при проверке ошибка — присоединение и объявление не ломаются: ошибка в лог, запись не добавляется, при следующем действии проверка повторяется.' },
  { uz: "«Havolani ulashish» ostida bitta kulrang qator: «" + QOIDA_QATORI.uz + "»", ru: 'Под «Havolani ulashish» одна серая строка: «' + QOIDA_QATORI.uz + '»' },
  A3_SIYOSAT,
  { uz: "Nima buzilmasin: pul, chegirma yoki boshqa narsa berilmasin — faqat Pro muddati; o'yin e'loni va qo'shilish avvalgidek ishlasin; qurilma ID dan boshqa ma'lumot so'ralmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: деньги, скидки или что-то другое не выдавать — только срок Pro; объявление игры и присоединение работают как раньше; кроме ID устройства, ничего не запрашивать. Больше ничего не трогай, назови изменённые файлы.' }
];
const A3_WEB = { uz: "Web-trekda: qurilma ID o'rnida — brauzer ID (10-Modulda yasagansiz); «Havolani ulashish» o'rnida — 1-amaliyotdagi ulashish joyingiz; qolgani o'sha.", ru: 'В веб-треке: вместо ID устройства — ID браузера (делали в 10-м модуле); вместо «Havolani ulashish» — ваше место отправки из практики 1; остальное то же.' };
const A3_KOD = { uz: "Yozgan kodingda to'rt joyni fayl nomi va qator raqami bilan ko'rsat: namuna tekshiriladigan qator, qurilma ID lar solishtiriladigan qator, haftalik cheklov sanaladigan qator va mukofot beriladigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в написанном коде четыре места с именем файла и номером строки: строку проверки образца, строку сравнения ID устройств, строку подсчёта недельного лимита и строку выдачи награды. Объясни одной фразой, что делает каждое. Код не меняй.' };
const A3_ZAXIRA = { uz: "Tekshiruv uchun ro'yxatdan o'tish yo'li bilan bitta hisob och (namuna ism va login, haqiqiy emas), taklif kodi — {tekshiruv1 kodi}, qurilma ID — yangi tasodifiy; namuna o'yinga qo'shil. Qaysi hisob va qaysi `id` ekanini ayt.", ru: 'Для проверки открой через регистрацию один аккаунт (образцовые имя и логин, не настоящие), код приглашения — {код tekshiruv1}, ID устройства — новый случайный; присоединись к образцовой игре. Скажи, какой это аккаунт и какой `id`.' };
const A3_TOZALASH = { uz: "Bugungi tekshiruv hisoblari (`tekshiruv1`, `tekshiruv2`, `tekshiruv3`) va ularning taklif natijalari, qurilma yozuvlarini `id` lari bilan ko'rsat. Men «Davom et» desam — faqat shularni o'chir.", ru: 'Покажи сегодняшние проверочные аккаунты (`tekshiruv1`, `tekshiruv2`, `tekshiruv3`), их результаты приглашений и записи устройств с `id`. Когда я скажу «Davom et» — удали только их.' };
const A3_BOSHQACHA = { uz: "{tekshiruv}: kutganim {nima kutdim}, bo'ldi {nima bo'ldi}. Tuzat, o'zgargan fayllarni ayt.", ru: '{проверка}: ожидал {что ожидал}, получилось {что получилось}. Исправь, назови изменённые файлы.' };
const A3Natija = ({ tk }) => {
  const kadr = useKadr(4, 1500);
  const qatorlar = [
    kadr >= 1 && { a: 'tekshiruv1', b: 'tekshiruv2', n: 'bir-qurilma', k: 'err' },
    kadr >= 2 && { a: 'tekshiruv1', b: 'tekshiruv3', n: 'berildi', k: 'ok' }
  ].filter(Boolean);
  return (
    <div className="rf-an">
      <div className="rf-neon">
        <span className="rf-neon-bosh"><b>Neon</b><code>taklif_natijalari</code></span>
        <span className="rf-tn ust"><span>{tr({ uz: 'taklif qilgan', ru: 'пригласил' })}</span><span>{tr({ uz: 'taklif qilingan', ru: 'приглашён' })}</span><code>natija</code></span>
        {qatorlar.map(r => <span key={r.b} className={cx('rf-tn fade-step', r.k)}><code>{r.a}</code><code>{r.b}</code><b>{r.n}</b></span>)}
        {kadr >= 3 && <span className="rf-tn pro fade-step"><code>tekshiruv1</code><span><code>pro_gacha</code> <b className="rf-pop">{tr({ uz: '+7 kun', ru: '+7 дней' })}</b></span><em>{tr({ uz: "tekshiruv hisobi — keyin o'chiriladi", ru: 'проверочный аккаунт — потом удаляется' })}</em></span>}
      </div>
      {tk.web && !tk.ikkala
        ? <SaytOyna manzil={LENDING}><span className="rf-sayt-q">{tr(TAKLIF_SAHNA.ulash)}</span><span className="rf-il-qoida">{tr(QOIDA_QATORI)}</span></SaytOyna>
        : <Telefon yorliq={{ uz: 'telefon · Expo Go', ru: 'телефон · Expo Go' }}><Ilova1 t={{ qoida: true }} /></Telefon>}
    </div>
  );
};
// 3-amaliyot yashil qatori — holatga qarab (sinf 6, E 54): ikkalasi «Kutilganidek» · birortasi «Boshqacha» · faqat bir xil ID
const a3Holat = (t) => (t.bir === 'boshqa' || t.boshqa === 'boshqa' ? 'boshqacha' : t.bir === 'ok' && t.boshqa === 'ok' ? 'toliq' : t.bir === 'ok' ? 'birXil' : 'yoq');
const ScreenA3 = (props) => {
  const tk = useTrek();
  const st = props.storedAnswer || {};
  const a1 = props.answers ? props.answers[SCREEN_META.findIndex(m => m.id === 'a1')] : null;
  const [q, setQ] = useState(() => ({ ulashish: (a1 && a1.ulashish) || '' }));
  const yoz = (k, v) => setQ(o => ({ ...o, [k]: v }));
  const [fayl, setFayl] = useState(st.fayl || null);
  const faylTanla = (v) => { setFayl(v); props.onAnswer(props.screen, { ...st, fayl: v }); };
  const faylQator = tk.mobil ? (
    <div className="rf-fayl fade-step">
      {[['almashtirildi', { uz: 'Havola almashtirildi', ru: 'Ссылка заменена' }], ['navbat', { uz: 'Fayl navbatda', ru: 'Файл в очереди' }]].map(([k, t]) => (
        <button key={k} type="button" className={cx('q-chip rf-fayl-btn', fayl === k && 'on', fayl == null && 'rf-chorla-b')} onClick={() => faylTanla(k)}>{tr(t)}</button>))}
    </div>) : null;
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 3 · o'z repo'ngiz", ru: 'Практика 3 · ваш репозиторий' }}
      title={{ uz: <>Mukofot faqat <span className="italic" style={{ color: T.accent }}>qoidaga mos taklif</span> uchun berilsin.</>, ru: <>Награда — только за <span className="italic" style={{ color: T.accent }}>приглашение по правилу</span>.</> }}
      mentor={{ uz: "Mukofot qoidasini o'z mahsulotingiz uchun qavslarda yozasiz; «1 · Ochish»dan boshlang.", ru: 'Правило награды для своего продукта напишете в скобках; начните с «1 · Открыть».' }}
      kartalar={[
        { id: 'bir', nom: { uz: '(3) Bir xil ID', ru: '(3) Тот же ID' }, matn: { uz: "nima qilinadi: shu telefonda `tekshiruv2` → asosiy harakat · nima kutiladi: `bir-qurilma`, `tekshiruv1` ning `pro_gacha` si o'zgarmagan", ru: 'что делаем: на этом телефоне `tekshiruv2` → основное действие · что ожидаем: `bir-qurilma`, `pro_gacha` у `tekshiruv1` не изменился' } },
        { id: 'boshqa', nom: { uz: '(4) Boshqa ID', ru: '(4) Другой ID' }, matn: { uz: "nima qilinadi: boshqa brauzerda `tekshiruv3` → asosiy harakat · nima kutiladi: `berildi`, `tekshiruv1` ning `pro_gacha` si 7 kunga uzaygan", ru: 'что делаем: в другом браузере `tekshiruv3` → основное действие · что ожидаем: `berildi`, `pro_gacha` у `tekshiruv1` продлён на 7 дней' } }
      ]}
      extra={(t) => ({ correct: t.bir != null && t.boshqa != null })}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tr({ uz: "uch savolga javob toping: mahsulotingizda asosiy harakat nima (12-Modulda sanagansiz)? Mukofot nima bo'ladi? Bir hisobga haftasiga nechta?", ru: 'ответьте на три вопроса: что в вашем продукте основное действие (считали в 12-м модуле)? Что будет наградой? Сколько в неделю одному аккаунту?' })}
          <Band>{tx({ uz: "(Mentor misolida: asosiy harakat — o'yinga qo'shilish yoki o'yin e'lon qilish; mukofot — Pro'ning bepul haftasi, test rejimda; haftasiga ko'pi bilan 2.)", ru: '(В примере Ментора: основное действие — присоединиться к игре или объявить игру; награда — бесплатная неделя Pro в тестовом режиме; не больше 2 в неделю.)' })}</Band>
          <Band>{tx({ uz: "Mukofot — pul, chegirma yoki narsa emas. Mahsulotingizda pullik qulaylik bo'lsa (4-darsda qurgansiz) — mukofot uning bepul muddati; bo'lmasa — mukofot qavsiga «hozircha yo'q — faqat natija yozilsin» deb yozing: qoida baribir har taklifning natijasini yozadi.", ru: 'Награда — не деньги, не скидка и не вещь. Если в продукте есть платная возможность (строили на 4-м уроке) — награда это её бесплатный срок; если нет — в скобку награды напишите «пока нет — пусть пишется только результат»: правило всё равно записывает результат каждого приглашения.' })}</Band>
          <Band>{tx({ uz: "Qoida qurilmani taniydi: ilova hisob ochilgan va havola ulashilgan qurilmaning ID sini Backend'ga yuboradi.", ru: 'Правило узнаёт устройство: приложение отправляет в Backend ID устройства, где открыт аккаунт и откуда отправлена ссылка.' })}</Band>
          <TrekGap tk={tk} web={{ uz: 'Web-trekda — brauzer ID (10-Modul).', ru: 'В веб-треке — ID браузера (10-й модуль).' }} /></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring ({ulashish joyi} — 1-amaliyotda yozganingiz, oldindan qo'yiladi):", ru: 'заполните скобки, нажмите «Скопировать» и отправьте в Antigravity ({место отправки} — то, что написали в практике 1, подставлено заранее):' })}
          <span className="rf-vazifa">{tr(A3_VAZIFA)}</span>
          <RfPrompt satrlar={A3_PROMPT} joylar={A3_JOYLAR} qiymat={q} onYoz={yoz} />
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq prompt (mobil trek)", ru: 'Полный промпт из примера Ментора (мобильный трек)' }} satrlar={A3_YORDAM} ost={tk.ikkala || tk.web ? A3_WEB : null} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "`git status` → `git add <fayl>` → `git commit -m \"taklif mukofoti va qoida\"` → `git push`. Render'da yangi deploy tugashini kuting; maxfiylik sahifasi Netlify'da odatda o'zi yangilanadi.", ru: '`git status` → `git add <файл>` → `git commit -m "taklif mukofoti va qoida"` → `git push`. Дождитесь окончания нового деплоя на Render; страница конфиденциальности на Netlify обычно обновляется сама.' })}
          <TrekGap tk={tk} mobil={{ uz: "Mobil trekda brauzer ko'rinishini ham yangilang — 2-tekshiruvga kerak: `npx expo export -p web` → `netlify deploy --prod --dir dist` (12-Moduldagi yo'l).", ru: 'В мобильном треке обновите и браузерную версию — нужна для 2-й проверки: `npx expo export -p web` → `netlify deploy --prod --dir dist` (путь из 12-го модуля).' }} web={{ uz: "Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.", ru: 'В веб-треке после push Netlify обычно сам обновляет сайт.' }} />
          <Band>{tx({ uz: 'Kutayotganda agentga:', ru: 'Пока ждёте — агенту:' })}</Band>
          <RfPrompt satrlar={[A3_KOD]} /></>,
          xato: tx(XATO_YOLI) },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "uch tekshiruv akkaunti bilan; o'z hisobingiz ishlatilmaydi — haqiqiy Pro muddatingiz o'zgarmaydi. Har biridan keyin tekshiruv kartasida «Kutilganidek» yoki «Boshqacha»ni tanlang:", ru: 'с тремя проверочными аккаунтами; ваш аккаунт не используется — настоящий срок Pro не меняется. После каждой проверки выберите в карточке «Как ожидалось» или «По-другому»:' })}
          <Band><b>(1)</b> {tx({ uz: "Agent ko'rsatgan to'rt qatorni o'qing: avval namuna, qurilma va cheklov tekshiriladi, mukofot — eng oxirida; asosiy harakat mukofot tekshiruvidan oldin saqlanadi.", ru: 'Прочитайте четыре строки, которые показал агент: сначала проверяются образец, устройство и лимит, награда — в самом конце; основное действие сохраняется до проверки награды.' })}</Band>
          <Band><b>(2) {tr({ uz: 'Taklif qiluvchi', ru: 'Приглашающий' })}</b> — {tx({ uz: "telefoningizda «Hisobdan chiqish» → ro'yxatdan o'tish formasida tekshiruv akkaunti `tekshiruv1` (shu qurilma ID si yoziladi). Neon — kodni yozib oling:", ru: 'на телефоне «Hisobdan chiqish» → в форме регистрации проверочный аккаунт `tekshiruv1` (записывается ID этого устройства). Neon — запишите код:' })}</Band>
          <SqlQator sql="SELECT id, taklif_kodi FROM oyinchilar WHERE login = 'tekshiruv1';" />
          <Band><b>(3) {tr({ uz: 'Bir xil ID', ru: 'Тот же ID' })}</b> — {tx({ uz: "shu telefonda «Hisobdan chiqish» → `tekshiruv1` kodi bilan `tekshiruv2` → asosiy harakat — real foydalanuvchilarga tegmaydigan joyda (Mentor misolida — namuna o'yinga «Qo'shilaman»).", ru: 'на этом телефоне «Hisobdan chiqish» → `tekshiruv2` с кодом `tekshiruv1` → основное действие — там, где нет настоящих пользователей (в примере Ментора — «Qo\'shilaman» в образцовой игре).' })}</Band>
          <Kulrang>{tx({ uz: "Neon (jadval nomi — agent aytganidek; Mentor misolida `taklif_natijalari`): `tekshiruv2` ning natijasi — `bir-qurilma`; `tekshiruv1` ning `pro_gacha` si o'zgarmagan. Kartada belgilang.", ru: 'Neon (имя таблицы — как сказал агент; в примере Ментора `taklif_natijalari`): результат `tekshiruv2` — `bir-qurilma`; `pro_gacha` у `tekshiruv1` не изменился. Отметьте в карточке.' })}</Kulrang>
          <Band><b>(4) {tr({ uz: 'Boshqa ID', ru: 'Другой ID' })}</b> — {tx({ uz: "sherigingiz o'z telefoni brauzerida ilovangizning brauzer ko'rinishini ochadi (web-trekda — saytingizni), `tekshiruv1` kodi bilan `tekshiruv3` ochadi va xuddi shu asosiy harakatni qiladi.", ru: 'напарник открывает в браузере своего телефона браузерную версию вашего приложения (в веб-треке — ваш сайт), создаёт `tekshiruv3` с кодом `tekshiruv1` и делает то же основное действие.' })}</Band>
          <Kulrang>{tx({ uz: "Sherik bo'lmasa — o'zingiz kompyuterdagi yashirin oynada: bu boshqa qurilma emas, boshqa brauzer ID (alohida xotira) — qoida uchun shunisi yetadi.", ru: 'Если напарника нет — сами в скрытом окне на компьютере: это не другое устройство, а другой ID браузера (отдельная память) — для правила этого достаточно.' })}</Kulrang>
          <Kulrang>{tx({ uz: "Neon: `tekshiruv3` ning natijasi — `berildi`; `tekshiruv1` ning `pro_gacha` si 7 kunga uzaygan. Kartada belgilang.", ru: 'Neon: результат `tekshiruv3` — `berildi`; `pro_gacha` у `tekshiruv1` продлён на 7 дней. Отметьте в карточке.' })}</Kulrang>
          <Band>{tx({ uz: "Ikkalasi ham bo'lmasa — agentga:", ru: 'Если нет ни того, ни другого — агенту:' })}</Band>
          <RfPrompt satrlar={[A3_ZAXIRA]} />
          <Band><b>(5) {tr({ uz: 'Tozalash', ru: 'Очистка' })}</b> — {tx({ uz: 'agentga:', ru: 'агенту:' })}</Band>
          <RfPrompt satrlar={[A3_TOZALASH]} />
          <Band>{tx({ uz: "Ro'yxatni o'qing, keyin «Davom et». Neon:", ru: 'Прочитайте список, потом «Davom et». Neon:' })}</Band>
          <SqlQator sql="SELECT COUNT(*) FROM oyinchilar WHERE login LIKE 'tekshiruv%';" izoh={{ uz: '→ `0`', ru: '→ `0`' }} />
          <Band><b>(6)</b> {tx({ uz: "Maxfiylik sahifangizni va ofertangizni oching — yangi gap va «Taklif mukofoti» bandi turibdi. Namuna va haftalik cheklov — (1) da kodda ko'rdingiz; bugun tekshiruv akkaunti bilan sinalmaydi.", ru: 'Откройте свою страницу конфиденциальности и оферту — новая фраза и пункт «Taklif mukofoti» на месте. Образец и недельный лимит вы видели в коде в (1); сегодня проверочным аккаунтом они не проверяются.' })}</Band>
          <Band>{tx({ uz: "«Boshqacha» bo'lsa — agentga (keyin push va o'sha tekshiruvni qayta qiling: tekshiruv akkauntini yana oching va o'chiring):", ru: 'Если «По-другому» — агенту (потом push и повторите ту же проверку: снова откройте и удалите проверочный аккаунт):' })}</Band>
          <RfPrompt satrlar={[A3_BOSHQACHA]} />
          <TrekGap tk={tk} mobil={{ uz: "Oxirida (mobil trek): odamlardagi ilova uchun yangi o'rnatish fayli kerak — `eas build -p android --profile preview`. Navbatni kutmang: «Bajardim»ni bosing va davom eting. Fayl dars oxirigacha tayyor bo'lsa — lendingdagi «Android: ilovani o'rnatish» havolasini almashtiring; bo'lmasa — keyingi dars boshida.", ru: 'В конце (мобильный трек): для приложения у людей нужен новый установочный файл — `eas build -p android --profile preview`. Очередь не ждите: нажмите «Готово» и продолжайте. Если файл будет готов до конца урока — замените на лендинге ссылку «Android: ilovani o\'rnatish»; если нет — в начале следующего урока.' }} /></> }
      ]}
      minKarta={1}
      natija={<A3Natija tk={tk} />}
      yashil={(t) => {
        const h = a3Holat(t);
        return h === 'toliq' ? { matn: { uz: "Bir xil ID dagi hisob sanalmadi, boshqa ID dagisi mukofot berdi; tekshiruv izlari tozalandi.", ru: 'Аккаунт с тем же ID не засчитан, с другим ID — дал награду; следы проверки удалены.' }, yashil: true }
          : h === 'boshqacha' ? { matn: { uz: "Tekshiruv tugamagan: «Boshqacha» chiqqanini tuzatib, qayta tekshiring.", ru: 'Проверка не закончена: исправьте то, что вышло «По-другому», и проверьте снова.' }, yashil: false }
            : { matn: { uz: 'Bir xil ID tekshirildi; boshqa ID tekshiruvi qoldi.', ru: 'Тот же ID проверен; осталась проверка другого ID.' }, yashil: false };
      }}
      pastQator={{ uz: 'Namuna va haftalik cheklov — kodda bor, tekshiruv akkaunti bilan sinalmagan.', ru: 'Образец и недельный лимит — в коде есть, проверочным аккаунтом не проверены.' }}
      izoh={{ uz: "Qoida bir xil qurilma ID ni ushlaydi; boshqa ID dagi hisobni ajratmaydi — shuning uchun haftalik cheklov bor.", ru: 'Правило ловит тот же ID устройства; аккаунт с другим ID не отличает — поэтому и есть недельный лимит.' }}
      ostida={faylQator}
      ulgurQadam={3}
      ulgur={{ uz: "Ulgurmasangiz: (4) boshqa ID tekshiruvini keyingi dars boshiga qoldiring — (5) tozalash ham o'sha paytda; tekshiruv akkauntlarini o'chirishni o'tkazib yubormang. «Davom etish» 3-banddan keyin ochiladi.", ru: 'Если не успеваете: проверку (4) с другим ID оставьте на начало следующего урока — очистку (5) тоже; не пропускайте удаление проверочных аккаунтов. «Продолжить» откроется после пункта 3.' }} />
  );
};

// 🃏 Kartochka mexanikasi va ko'rinishi — qolipda: QKartochka (DE-204, texnik darslar standarti aynan). Alohida ekran, Mentorsiz (SABOQ 12, 16)
const KARTALAR = [
  { front: { uz: 'Taklif havolasi nima?', ru: 'Что такое ссылка-приглашение?' }, back: { uz: "Har foydalanuvchining o'z havolasi: unda uning taklif kodi bor", ru: 'Своя ссылка каждого пользователя: в ней его код приглашения' }, note: { uz: 'Inglizchasi: referral', ru: 'По-английски: referral' } },
  { front: { uz: "Taklif havolasi ochilsa, lendingda nima ko'rinadi?", ru: 'Что видно на лендинге, если открыть ссылку-приглашение?' }, back: { uz: '«Taklif kodi: …» qatori', ru: 'Строка «Taklif kodi: …»' }, note: { uz: "Ostida: «Ro'yxatdan o'tishda shu taklif kodini yozing.»", ru: 'Под ней: «Ro\'yxatdan o\'tishda shu taklif kodini yozing.»' } },
  { front: { uz: '12-Modulda «Havolani ulashish» bilan nima ulashilardi?', ru: 'Чем делились через «Havolani ulashish» в 12-м модуле?' }, back: { uz: 'Hammada bir xil lending havolasi — `?kanal=ilova` bilan', ru: 'У всех одинаковой ссылкой на лендинг — с `?kanal=ilova`' }, note: { uz: 'Kim ulashgani bilinmasdi', ru: 'Кто поделился, не было известно' } },
  { front: { uz: "Mentor ilovasida havoladagi taklif kodi APK'ga o'tadimi?", ru: 'Переходит ли в приложении Ментора код из ссылки в APK?' }, back: { uz: "Yo'q — shuning uchun formada «Taklif kodi (bo'lsa)» maydoni bor", ru: 'Нет — поэтому в форме есть поле «Taklif kodi (bo\'lsa)»' }, note: { uz: "Yangi o'yinchi uni lendingdan ko'rib yozadi", ru: 'Новый игрок видит его на лендинге и вводит' } },
  { front: { uz: 'Kim kimni taklif qilgani qayerda yoziladi?', ru: 'Где записывается, кто кого пригласил?' }, back: { uz: "Database'da — yangi hisobda taklif qilgan yoziladi", ru: 'В Database — в новом аккаунте записывается пригласивший' }, note: { uz: "Umami'ga faqat kanal ketadi", ru: 'В Umami уходит только канал' } },
  { front: { uz: "Mukofot pul yoki chegirma bo'la oladimi?", ru: 'Может ли награда быть деньгами или скидкой?' }, back: { uz: "Yo'q — Mentor misolida u Pro'ning bepul haftasi", ru: 'Нет — в примере Ментора это бесплатная неделя Pro' }, note: { uz: 'Test rejimdagi pullik obuna muddati', ru: 'Срок платной подписки в тестовом режиме' } },
  { front: { uz: 'Mukofot qachon beriladi?', ru: 'Когда даётся награда?' }, back: { uz: 'Taklif kodi bilan ochilgan yangi hisob asosiy harakat qilgach', ru: 'После основного действия нового аккаунта, открытого с кодом' }, note: { uz: "Mentor misolida: o'yinga qo'shilsa yoki o'yin e'lon qilsa", ru: 'В примере Ментора: присоединится к игре или объявит игру' } },
  { front: { uz: 'Mentor qoidasida qaysi hisob mukofotga sanalmaydi?', ru: 'Какой аккаунт по правилу Ментора не засчитывается в награду?' }, back: { uz: 'Taklif qilgan bilan bir qurilmadagi va namuna hisob', ru: 'Аккаунт на том же устройстве, что и пригласивший, и образцовый' }, note: { uz: "Bir hisobga haftasiga ko'pi bilan 2 mukofot", ru: 'Одному аккаунту — не больше 2 наград в неделю' } },
  { front: { uz: '«Bir qurilma» qoidasi nimani ajrata olmaydi?', ru: 'Что не может различить правило «одно устройство»?' }, back: { uz: 'Ikkinchi qurilmadan ochilgan hisobni', ru: 'Аккаунт, открытый со второго устройства' }, note: { uz: 'Shuning uchun haftalik cheklov ham bor', ru: 'Поэтому есть и недельный лимит' } },
  { front: { uz: 'Mentor misolida bir haftada taklif kodi bilan nechta hisob ochildi?', ru: 'Сколько аккаунтов открыли с кодом за неделю в примере Ментора?' }, back: { uz: '7 ta; 4 tasi asosiy harakat qildi', ru: '7; 4 из них сделали основное действие' }, note: { uz: 'Mukofot — 3 ta: bitta hisob taklif qilgan bilan bir qurilmada edi', ru: 'Наград — 3: один аккаунт был на одном устройстве с пригласившим' } },
  { front: { uz: "Umami'dagi tashrif va Database'dagi hisob — bir o'lchovmi?", ru: 'Визит в Umami и аккаунт в Database — одна единица?' }, back: { uz: "Yo'q — biri sahifa ochilishi, biri ro'yxatdan o'tgan hisob", ru: 'Нет — одно открытие страницы, другое зарегистрированный аккаунт' }, note: { uz: 'Shuning uchun ular ayirilmaydi', ru: 'Поэтому их не вычитают' } },
  { front: { uz: "Nega sinfdagi tekshiruv akkaunti o'chiriladi?", ru: 'Зачем удаляют проверочный аккаунт из класса?' }, back: { uz: "U haqiqiy foydalanuvchi emas — sanoqqa qo'shilmasin", ru: 'Это не настоящий пользователь — пусть не входит в подсчёт' }, note: { uz: "«Hisobni o'chirish» bilan", ru: 'Через «Hisobni o\'chirish»' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('rf-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="rf-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (texnik darslar standarti; E 50 — «Bugungi asosiy fikr» yo'q). Uyga vazifa yo'q (loyiha kuni). Sarlavha — yetti holat, har biri rost (E 54) =====
// PM-109 (SABOQ P4): erta tugatgan o'quvchi yo'li — AI tekshiruvchi rolida taklif holatlarini beradi, o'quvchi natijani o'zi yozadi (MD yakunida matn yo'q — «MD ga taklif»)
const AI_SOROV = { uz: "Sen tekshiruvchisan. Mahsulot: Maydon Jamoa — mini-futbol o'yini uchun jamoa yig'adigan ilova. Taklif mukofoti qoidasi: taklif kodi bilan ochilgan yangi hisob asosiy harakat qilgach (o'yinga qo'shilsa yoki o'yin e'lon qilsa) taklif qilganga Pro'ning 7 kuni qo'shiladi; taklif qilgan bilan bir xil qurilma ID dagi hisob va namuna hisob sanalmaydi; taklif qilganning qurilmasi noma'lum bo'lsa — mukofot yo'q; bitta hisobga haftasiga ko'pi bilan 2 mukofot. Menga navbat bilan 5 ta taklif holatini ber. Har biriga men natijani yozaman: berildi, bir-qurilma, namuna, nomalum yoki cheklov — va sababini bir gap bilan. Sen javobim qoidaga mosligini bir gap bilan ayt. Haqiqiy ism, telefon va karta ma'lumotini so'rama. Birinchi holatni ber.",
  ru: 'Ты проверяющий. Продукт: Maydon Jamoa — приложение для сбора команды на мини-футбол. Правило награды за приглашение: после основного действия нового аккаунта, открытого с кодом приглашения (присоединился к игре или объявил игру), пригласившему добавляется 7 дней Pro; аккаунт с тем же ID устройства, что у пригласившего, и образцовый аккаунт не считаются; если устройство пригласившего неизвестно — награды нет; одному аккаунту — не больше 2 наград в неделю. Дай мне по очереди 5 случаев приглашения. Для каждого я пишу результат: berildi, bir-qurilma, namuna, nomalum или cheklov — и причину одной фразой. Скажи одной фразой, соответствует ли мой ответ правилу. Не спрашивай настоящие имена, телефоны и данные карты. Дай первый случай.' };
const AiDavomCard = () => {
  const [ok, setOk] = useState(false);
  const kochir = async () => { if (await nusxala(tr(AI_SOROV))) { setOk(true); setTimeout(() => setOk(false), 1800); } };
  return (
    <div className="card rf-ai fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Erta tugatdingizmi? AI bilan davom eting', ru: 'Закончили раньше? Продолжите с AI' })}</div>
      <p className="rf-ai-m">{tr({ uz: "gemini.google.com'ni oching, pastdagi so'rovni yuboring — AI tekshiruvchi bo'lib beshta taklif holatini beradi. Har biriga natijani o'zingiz yozing; adashgan joyingizni «Orqaga» bilan 6-ekranda qayta ko'ring.", ru: 'Откройте gemini.google.com, отправьте запрос ниже — AI как проверяющий даст пять случаев приглашения. Результат для каждого пишите сами; где ошиблись — посмотрите снова на 6-м экране через «Назад».' })}</p>
      <pre className="rf-ai-sorov">{tr(AI_SOROV)}</pre>
      <button type="button" className="q-chip rf-ai-btn" onClick={kochir}>{ok ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: "So'rovni nusxalash", ru: 'Скопировать запрос' })}</button>
    </div>
  );
};
const YAKUN_SARLAVHA = {
  toliq: { uz: 'Havola, sanoq va mukofotning ikki holati tekshirildi.', ru: 'Ссылка, подсчёт и два случая награды проверены.' },
  tuzatish: { uz: "Taklif yo'li qurildi — bitta joyni tuzatish qoldi.", ru: 'Путь приглашения построен — осталось исправить одно место.' },
  mukofotTugamagan: { uz: 'Havola va sanoq tayyor — mukofot tekshiruvi tugamagan.', ru: 'Ссылка и подсчёт готовы — проверка награды не закончена.' },
  mukofotQoldi: { uz: 'Havola va sanoq tayyor — mukofot qoidasi qoldi.', ru: 'Ссылка и подсчёт готовы — осталось правило награды.' },
  havolaTayyor: { uz: 'Havola tayyor — formadagi taklif kodi va mukofot qoldi.', ru: 'Ссылка готова — остались код в форме и награда.' },
  oldingilar: { uz: 'Mukofot qoidasi bor — oldingi bloklarni tugating.', ru: 'Правило награды есть — закончите предыдущие блоки.' },
  yoq: { uz: 'Taklif havolasi hali qurilmagan — bloklarni tugating.', ru: 'Ссылка-приглашение ещё не построена — закончите блоки.' }
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
  const blok = (id) => { const i = SCREEN_META.findIndex(m => m.id === id); return answers[i] && answers[i].solved ? answers[i] : null; };
  const b1 = blok('a1'), b2 = blok('a2'), b3 = blok('a3');
  const tk = (b) => (b && b.tekshiruv) || {};
  const h1 = !!b1 && tk(b1).natija === 'ok';
  const h2 = !!b2 && tk(b2).natija === 'ok';
  const a3h = b3 ? a3Holat(tk(b3)) : null;
  // Har holat rost (E 54): «tayyor» — o'sha blok kartasi «Kutilganidek»; «tekshirildi» — hamma kartalar «Kutilganidek»
  const holat = h1 && h2 && a3h === 'toliq' ? 'toliq'
    : b1 && b2 && (tk(b1).natija === 'boshqa' || tk(b2).natija === 'boshqa') ? 'tuzatish'
      : h1 && h2 && b3 ? 'mukofotTugamagan'
        : h1 && h2 ? 'mukofotQoldi'
          : b3 ? 'oldingilar'
            : h1 && !b2 ? 'havolaTayyor' : 'yoq';
  const navbat = trekOqi() !== 'web' && b3 && b3.fayl === 'navbat';
  const RECAP = [
    { uz: "Taklif havolasi — hisobning o'z taklif kodi yozilgan havola.", ru: 'Ссылка-приглашение — ссылка, в которой записан собственный код приглашения аккаунта.' },
    { uz: "Mentor ilovasida havoladagi taklif kodi APK'ga o'tmaydi — shuning uchun formada maydon bor.", ru: 'В приложении Ментора код из ссылки не переходит в APK — поэтому в форме есть поле.' },
    { uz: 'Bu darsda Umami tashrifni kanal bilan sanaydi; kim taklif qilganini Database biladi.', ru: 'На этом уроке Umami считает визиты по каналу; кто пригласил, знает Database.' },
    { uz: 'Bu misolda mukofot yangi hisob asosiy harakat qilgach beriladi; bir qurilmadagi va namuna hisob sanalmaydi.', ru: 'В этом примере награду дают после основного действия нового аккаунта; аккаунт с того же устройства и образцовый не считаются.' },
    { uz: "Mentor misolidagi bir haftalik 7 hisob taklif yo'li ishlaganini ko'rsatadi, o'sishni isbotlamaydi.", ru: '7 аккаунтов за неделю в примере Ментора показывают, что путь приглашения работает, но рост не доказывают.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className={cx('rf-yakun', holat !== 'toliq' && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Uch blok bajarildi', ru: 'Три блока выполнены' })}
          togri={correct} jami={total}
          sarlavha={tr(YAKUN_SARLAVHA[holat])}
          cta={<>
            {navbat && <p className="rf-navbat fade-up"><span>{tr({ uz: "O'rnatish fayli navbatda", ru: 'Установочный файл в очереди' })}</span>{tr({ uz: "Fayl tayyor bo'lgach, lendingdagi havolani keyingi dars boshida almashtirasiz.", ru: 'Когда файл будет готов, замените ссылку на лендинге в начале следующего урока.' })}</p>}
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
            {!isMentorL && <AiDavomCard />}
          </>}
          recap={RECAP.map(tr)}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}>
          <p className="rf-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Mahsulotingiz hozir qayerda?»</b>: roadmap bilan solishtirish va shaxsiy hisobot.</>, ru: <>Следующий урок — <b>«Где сейчас ваш продукт?»</b>: сравнение с роадмапом и личный отчёт.</> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function ReferralDayLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, ScreenA1, Screen4, Screen5, ScreenA2, Screen7, ScreenA3, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI — «taklif yo'li» sahnasi (rf-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Telefon 170×272 hamma ekranda (SABOQ 22) === */
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .rf-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: rf-puls 2.2s ease-out .3s 3; }
        @keyframes rf-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .rf-joriy { outline: 2px solid ${T.accent}; outline-offset: 3px; border-radius: 12px; }
        /* Variantlar va bashorat chiplari: har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .rf-k { display: contents; }
        .rf-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: rf-chorla-v 1.8s ease-out .5s 2; }
        @keyframes rf-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .rf-chorla .q-chip:not(:disabled), .rf-chorla-b:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: rf-chorla-c 1.8s ease-out .5s 2; }
        @keyframes rf-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .rf-k.faol .q-variant:nth-child(2), .rf-chorla .q-chip:nth-child(2) { animation-delay: .75s; }
        .rf-k.faol .q-variant:nth-child(3), .rf-chorla .q-chip:nth-child(3) { animation-delay: 1s; }
        /* SABOQ P2: kirish maketi ustunga sig'adi — maket aniq kenglikda (P5: max-content + zoom yo'q) */
        @media (min-width: 761px) { .rf-k .q-split { grid-template-columns: 384px minmax(0, 1fr); gap: 28px; } }
        .rf-pop { display: inline-block; animation: rf-pop .55s cubic-bezier(.3,1.5,.5,1); }
        @keyframes rf-pop { 0% { transform: scale(1.4); } 100% { transform: scale(1); } }
        @keyframes rf-kir { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        @keyframes rf-qator { 0% { opacity: 0; transform: translateY(-5px); background: ${T.okFon}; } 20% { opacity: 1; transform: none; } 75% { background: ${T.okFon}; } 100% { background: transparent; } }
        /* Sahna: 1-telefon · (brauzer / Backend) · 2-telefon; telefonda (≤640) — ikki telefon yonma-yon, ostida brauzer va Backend */
        .rf-sahna { position: relative; }
        .rf-sahna.yot { display: grid; grid-template-columns: 170px minmax(220px, 268px) 170px; grid-template-rows: auto 1fr; gap: 8px 22px; align-items: start; justify-content: center; }
        .rf-sahna.yot.ikki { grid-template-columns: 170px minmax(200px, 250px); }
        .rf-sahna.yot .rf-s-t1 { grid-column: 1; grid-row: 1 / span 2; }
        .rf-sahna.yot .rf-s-br { grid-column: 2; grid-row: 1; }
        .rf-sahna.yot .rf-s-be { grid-column: 2; grid-row: 2; }
        .rf-sahna.yot .rf-s-t2 { grid-column: 3; grid-row: 1 / span 2; }
        .rf-sahna.tik { display: grid; grid-template-columns: 170px 170px; gap: 10px 8px; justify-content: center; padding-top: 26px; }
        @media (max-width: 760px) { .zoomable:not(.zoom-on) .rf-sahna.tik:not(.ikki) { padding-top: 40px; } } /* tor ekranda ikki ustun 348 px — o'ngda bo'sh joy yo'q, «2-telefon» yorlig'i ⛶ ostiga tushadi */
        .rf-sahna.tik .rf-tel-yorliq { font-size: 10px; }
        .rf-sahna.tik.ikki { grid-template-columns: minmax(0, 300px); }
        .rf-sahna.tik .rf-s-t1 { grid-column: 1; grid-row: 1; } .rf-sahna.tik .rf-s-t2 { grid-column: 2; grid-row: 1; }
        .rf-sahna.tik .rf-s-br { grid-column: 1 / -1; grid-row: 2; } .rf-sahna.tik .rf-s-be { grid-column: 1 / -1; grid-row: 3; }
        .rf-sahna.tik.ikki .rf-s-t1 { grid-column: 1; justify-self: center; } .rf-sahna.tik.ikki .rf-s-br { grid-column: 1; }
        .rf-s-t1, .rf-s-t2, .rf-s-br, .rf-s-be { min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .rf-s-br, .rf-s-be { align-items: stretch; }
        .rf-sahna.fokus-be .rf-backend { outline: 2px solid ${T.ok}; outline-offset: 3px; }
        .rf-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 5px; width: 170px; flex: none; }
        .rf-tel-yorliq { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .rf-telefon { width: 170px; height: 272px; border-radius: 24px; background: ${T.ink}; padding: 5px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.55); flex: none; }
        .rf-tel-ekran { width: 100%; height: 100%; border-radius: 19px; background: ${T.paper}; overflow: hidden; display: flex; flex-direction: column; }
        .rf-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 5px; white-space: nowrap; }
        .rf-ilova { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 5px; padding: 8px 9px; animation: rf-kir .35s ease both; }
        .rf-ilova.bosh { align-items: center; justify-content: center; background: ${T.bg}; }
        .rf-il-yoq { font-size: 12px; font-weight: 700; color: ${T.ink2}; text-align: center; }
        .rf-il-bosh { display: flex; align-items: center; gap: 6px; font-size: 12.5px; }
        .rf-il-sar { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .rf-il-oyin { font-size: 11px; line-height: 1.35; color: ${T.ink}; padding: 6px; border-radius: 9px; border: 1px solid ${T.line}; }
        .rf-ulash { font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 700; border: 0; border-radius: 9px; padding: 6px 8px; background: ${T.ink}; color: #fff; cursor: pointer; transition: background .3s; }
        .rf-ulash:disabled { cursor: default; }
        .rf-ulash.yondi { background: ${T.accent}; }
        .rf-ulash-oyna { display: block; padding: 5px 6px; border-radius: 8px; background: ${T.bg}; border: 1px dashed ${T.line}; }
        .rf-havola { font-family: 'JetBrains Mono', monospace; font-size: 10px; line-height: 1.35; color: ${T.ink}; overflow-wrap: anywhere; }
        .rf-havola b { color: ${T.accent}; font-weight: 800; }
        .rf-ulash-oyna .rf-havola, .rf-br-manzil .rf-havola { display: block; }
        .rf-il-qoida { display: block; font-size: 10px; line-height: 1.35; color: ${T.ink2}; }
        .rf-maydon { display: flex; flex-direction: column; gap: 0; padding: 2px 6px; border-radius: 7px; border: 1px solid ${T.line}; min-height: 26px; }
        .rf-maydon em { font-style: normal; font-size: 10px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .rf-maydon b { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink}; line-height: 1.2; }
        .rf-maydon.kod { border-color: ${fon(T.accent, 0.5)}; }
        .rf-maydon.joriy { border-color: ${T.accent}; box-shadow: 0 0 0 2px ${fon(T.accent, 0.18)}; }
        .rf-maydon.xato { border-color: ${T.err}; }
        .rf-f-xato { font-size: 10px; line-height: 1.3; font-weight: 700; color: ${T.err}; }
        .rf-f-btn { margin-top: auto; text-align: center; font-size: 11.5px; font-weight: 700; border-radius: 9px; padding: 5px 8px; background: ${T.ink}; color: #fff; transition: background .3s; }
        .rf-f-btn.bosildi { background: ${T.accent}; }
        .rf-otmadi { font-size: 10.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px dashed ${T.line}; border-radius: 7px; padding: 1px 7px; text-align: center; }
        /* Brauzer — lending */
        .rf-brauzer { display: flex; flex-direction: column; align-items: stretch; gap: 5px; min-width: 0; }
        .rf-brauzer > .rf-tel-yorliq { align-self: center; }
        .rf-br-oyna { position: relative; display: flex; flex-direction: column; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; overflow: hidden; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.45); }
        .rf-br-bar { display: flex; align-items: center; gap: 4px; padding: 4px 7px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .rf-br-bar i { flex: none; width: 6px; height: 6px; border-radius: 50%; background: ${T.line}; }
        .rf-br-manzil { flex: 1; min-width: 0; margin-left: 4px; padding: 1px 6px; border-radius: 6px; background: ${T.paper}; transition: opacity .5s; }
        .rf-br-manzil.bosh { background: ${fon(T.ink2, 0.12)}; }
        .rf-br-manzil.sondi { opacity: .4; }
        .rf-otmadi.br { align-self: flex-end; margin: 4px 6px 0; }
        .rf-br-tana { display: flex; flex-direction: column; gap: 4px; padding: 7px 9px 9px; }
        .rf-br-tana.bosh { min-height: 58px; }
        .rf-br-sar { font-size: 12px; font-weight: 800; color: ${T.ink}; }
        .rf-br-kod { display: flex; flex-direction: column; gap: 1px; padding: 4px 7px; border-radius: 8px; background: ${T.accentSoft}; animation: rf-kir .4s ease both; }
        .rf-br-kod b { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; }
        .rf-br-kod em { font-style: normal; font-size: 10.5px; line-height: 1.3; color: ${T.ink2}; }
        .rf-apk { align-self: flex-start; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; border: 0; border-radius: 8px; padding: 4px 9px; background: ${MAYDON_RANG}; color: #fff; cursor: pointer; }
        .rf-apk:disabled { cursor: default; }
        .rf-br-ios { font-size: 11px; font-weight: 700; color: ${T.ink2}; text-decoration: underline; }
        .rf-umami { align-self: flex-end; margin: 0 7px 7px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; animation: rf-kir .4s ease both; }
        .rf-umami.ok { color: ${T.ok}; background: ${T.okFon}; border-color: ${fon(T.ok, 0.35)}; }
        .rf-brauzer.sayt { width: 100%; max-width: 280px; }
        .rf-sayt-q { font-size: 12px; font-weight: 800; color: ${T.ink}; }
        .rf-sayt-btn { align-self: flex-start; font-size: 11px; font-weight: 700; border-radius: 8px; padding: 3px 9px; background: ${T.ink}; color: #fff; }
        /* Backend tuguni — mini-jadval oyinchilar */
        .rf-backend { display: flex; flex-direction: column; gap: 5px; padding: 8px 10px; border-radius: 14px; background: ${T.ink}; color: #fff; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.6); transition: box-shadow .4s; }
        .rf-backend.yondi { box-shadow: 0 0 0 3px ${fon(T.ok, 0.55)}; }
        .rf-be-sar { font-size: 13px; }
        .rf-jadval { display: flex; flex-direction: column; border-radius: 8px; overflow: hidden; background: ${T.paper}; color: ${T.ink}; }
        .rf-j-bosh { padding: 2px 7px; background: ${T.bg}; font-size: 10.5px; font-weight: 700; }
        .rf-j-bosh code, .rf-j-q code { font-family: 'JetBrains Mono', monospace; }
        .rf-j-q { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 2px 7px; font-size: 10.5px; align-items: center; }
        .rf-j-q.ust { color: ${T.ink2}; font-size: 10px; border-bottom: 1px solid ${T.line}; }
        .rf-j-q em { font-style: normal; font-size: 10px; color: ${T.ink2}; }
        .rf-j-q.yondi { background: ${T.accentSoft}; transition: background .3s; }
        .rf-j-q.yangi { animation: rf-qator 1.6s ease both; }
        .rf-j-to { grid-column: 1 / -1; font-weight: 700; color: ${T.ok}; }
        /* Konvert: sahna ustida bir nuqtadan ikkinchisiga uchadi (reduced-motion — ko'rinmaydi) */
        .rf-kv { position: absolute; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 1px; pointer-events: none; animation: rf-kv .9s ease-in-out both; }
        .rf-kv-i { width: 20px; height: 14px; border-radius: 3px; background: ${T.accent}; position: relative; box-shadow: 0 4px 10px -4px ${fon(T.accent, 0.7)}; }
        .rf-kv-i::after { content: ''; position: absolute; left: 3px; right: 3px; top: 2px; height: 6px; border-left: 1.5px solid #fff; border-bottom: 1.5px solid #fff; transform: rotate(-45deg) scale(.55); }
        .rf-kv.apk .rf-kv-i { background: ${MAYDON_RANG}; } .rf-kv.sorov .rf-kv-i { background: ${T.ink2}; }
        .rf-kv-y { order: -1; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; white-space: nowrap; color: ${T.ink}; background: ${T.paper}; border-radius: 5px; padding: 0 4px; box-shadow: 0 2px 6px -3px rgba(${T.shadowBase},0.4); }
        .rf-sahna.yot .rf-kv.t1-br { --x0: 150px; --y0: 120px; --x1: 50%; --y1: 18px; }
        .rf-sahna.yot .rf-kv.br-t2 { --x0: 50%; --y0: 90px; --x1: calc(100% - 160px); --y1: 120px; }
        .rf-sahna.yot .rf-kv.t2-be { --x0: calc(100% - 160px); --y0: 230px; --x1: 52%; --y1: 220px; }
        .rf-sahna.tik .rf-kv.t1-br { --x0: 25%; --y0: 230px; --x1: 50%; --y1: 300px; }
        .rf-sahna.tik .rf-kv.br-t2 { --x0: 50%; --y0: 300px; --x1: 75%; --y1: 220px; }
        .rf-sahna.tik .rf-kv.t2-be { --x0: 75%; --y0: 230px; --x1: 50%; --y1: 470px; }
        @keyframes rf-kv { 0% { left: var(--x0); top: var(--y0); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: var(--x1); top: var(--y1); opacity: 0; } }
        /* 0-ekran: telefon + ikki chat pufagi + Umami */
        .rf-kirish { display: flex; gap: 12px; align-items: center; }
        .rf-k-ong { display: flex; flex-direction: column; gap: 8px; width: 200px; }
        .rf-pufak { display: flex; flex-direction: column; gap: 3px; padding: 7px 9px; border-radius: 12px 12px 12px 4px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.4); transition: transform .5s ease, margin .5s ease; }
        .rf-pufak em { font-style: normal; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; }
        .rf-pufak code { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; line-height: 1.35; color: ${T.ink}; overflow-wrap: anywhere; border-radius: 5px; transition: background .3s, color .3s; }
        .rf-pufak code.yondi { background: ${T.accentSoft}; color: ${T.accent}; }
        .rf-pufak.ust { margin-top: -34px; transform: translateX(10px); }
        .rf-umami-k { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 7px; padding: 2px 8px; }
        .rf-k-kul { font-size: 11.5px; line-height: 1.35; color: ${T.ink2}; }
        /* Reja */
        .rf-reja-teg { margin-left: 6px; font-family: 'Manrope', sans-serif; text-transform: none; letter-spacing: 0; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 7px; padding: 1px 8px; }
        p.rf-reja-past { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink2}; }
        p.rf-reja-past2 { margin: 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; }
        /* Bashorat ixcham qatori, xulosa qutisi qatorlari (E 42), joriy qator */
        .rf-viz { display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
        .rf-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .rf-bash-y { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .rf-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        .q-xulosa .rf-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .rf-x-tx b { color: ${T.ink}; } .q-xulosa .rf-x-tx.ok, .q-xulosa .rf-x-tx.ok b { color: ${T.ok}; } .q-xulosa .rf-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .rf-x-m { display: block; }
        .q-xulosa .rf-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.rf-joriy-q { margin: 0; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        .rf-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .rf-ustoz b { color: ${T.ink}; }
        .rf-och, .rf-yoz, .rf-sanoq, .rf-qoida { align-self: center; font-size: 12.5px; }
        .rf-harakat { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        /* 5-ekran: sanoq qutilari, hisob kartasi (bittadan), qoida kartasi */
        .rf-s5 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(230px, 300px); gap: 10px 18px; align-items: start; }
        .rf-s5 > .rf-joriy-q { grid-column: 1 / -1; }
        .rf-s5-chap { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
        .rf-s5-y { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .rf-quti-q { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .rf-quti { display: flex; flex-direction: column; gap: 2px; padding: 7px 9px; min-height: 64px; background: ${T.bg}; transition: background .3s; }
        .rf-quti + .rf-quti { border-left: 1px solid ${T.line}; }
        .rf-quti.bor { background: ${T.paper}; }
        .rf-quti em { font-style: normal; font-size: 10.5px; line-height: 1.3; color: ${T.ink2}; }
        .rf-quti b { font-size: 17px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .rf-quti-kul { font-size: 12px; line-height: 1.4; color: ${T.ink2}; }
        .rf-hk-ix { display: flex; flex-wrap: wrap; gap: 6px; }
        .rf-hk-q { display: inline-flex; align-items: center; gap: 5px; padding: 2px 9px 2px 3px; border-radius: 999px; font-size: 12px; font-weight: 700; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .rf-hk-q i { font-style: normal; width: 17px; height: 17px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10.5px; }
        .rf-hk-q.ok i { background: ${T.okFon}; color: ${T.ok}; } .rf-hk-q.err { opacity: .7; } .rf-hk-q.err i { background: ${T.errFon}; color: ${T.err}; }
        .rf-hk-joy { display: flex; flex-direction: column; gap: 8px; align-items: stretch; }
        .rf-hk { display: flex; flex-direction: column; gap: 2px; padding: 9px 12px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; font-size: 12.5px; line-height: 1.4; color: ${T.ink}; transition: border-color .3s, opacity .3s; }
        .rf-hk.bosh { border-color: ${T.line}; color: ${T.ink2}; }
        .rf-hk.ok { border-color: ${T.ok}; background: ${T.okFon}; } .rf-hk.err { border-color: ${T.err}; }
        .rf-hk-n { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${T.accent}; }
        .rf-hk-ajrat { font-weight: 800; }
        .rf-hk .q-xato { margin-top: 4px; }
        .rf-qk { display: flex; flex-direction: column; gap: 6px; padding: 11px 13px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.45); }
        .rf-qk-sar { font-size: 14px; color: ${T.ink}; }
        .rf-qk-y { margin-top: -5px; font-size: 11px; color: ${T.ink2}; }
        .rf-katak { display: flex; align-items: center; gap: 8px; font-size: 12.5px; line-height: 1.35; color: ${T.ink}; }
        .rf-katak i { flex: none; width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid ${T.line}; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; }
        .rf-katak.ok i { border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; } .rf-katak.err i { border-color: ${T.err}; background: ${T.errFon}; color: ${T.err}; }
        .rf-katak i.tushdi { animation: rf-tush .3s ease both; }
        @keyframes rf-tush { from { transform: translateY(-8px); opacity: 0; } to { transform: none; opacity: 1; } }
        .rf-mukofot { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding-top: 6px; border-top: 1px solid ${T.line}; }
        .rf-mukofot b { font-size: 16px; color: ${T.ink}; }
        .rf-mukofot em { font-style: normal; font-size: 12.5px; font-weight: 700; color: ${T.ok}; }
        .rf-cheklov { font-size: 12px; line-height: 1.35; color: ${T.ink2}; }
        .rf-cheklov em { font-style: normal; font-weight: 700; color: ${T.ok}; }
        .rf-s5.tugadi { grid-template-columns: minmax(0, 1fr) minmax(230px, 320px); }
        .rf-s5.tugadi .rf-mukofot { outline: 2px solid ${T.ok}; outline-offset: 2px; border-radius: 8px; padding: 4px 6px; }
        /* Amaliyot bloklari — qadam matni QBlok'da <p> ichida: faqat span (display: block bilan) */
        .rf-blok { display: contents; }
        .rf-blok.qulf .q-blok-q.joriy .q-blok-tana > .q-btn { opacity: .45; pointer-events: none; }
        .rf-band, .rf-xato, .rf-ps, .rf-yordam, .rf-yordam-s, .rf-vazifa, .rf-sql-ust, .rf-sql-iz, .rf-tk, .rf-tk-nom, .rf-tk-m { display: block; }
        .rf-band { margin-top: 6px; }
        .rf-kulrang { font-size: 12.5px; color: ${T.ink2}; }
        .rf-vazifa { margin-top: 6px; padding: 6px 10px; border-radius: 9px; background: ${T.bg}; font-weight: 700; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .rf-xato { margin-top: 6px; font-size: 13px; font-weight: 700; color: ${T.err}; }
        .q-blok-t .qcode, .rf-tk .qcode, .rf-sql-iz .qcode { white-space: nowrap; } /* SABOQ P9 */
        .rf-yordam .qcode, .rf-ps .qcode { white-space: normal; overflow-wrap: anywhere; }
        .rf-prompt { display: block; margin-top: 8px; }
        .rf-ps { margin: 0; padding: 0 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink}; overflow-wrap: anywhere; }
        .rf-ps + .rf-ps { margin-top: 4px; }
        .rf-ps .q-joy { display: inline-block; max-width: 100%; }
        .rf-joylar { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .rf-joy-m { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; padding: 0 0 0 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .rf-joy-m:focus-within { border-color: ${T.accent}; }
        .rf-joy-n { flex: none; max-width: 100%; padding-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.accent}; }
        .rf-joy-m input { flex: 1 1 220px; min-width: 0; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.4; padding: 8px 10px 8px 0; color: ${T.ink}; }
        .rf-yordam-ust { display: block; margin-top: 8px; }
        .rf-yordam-btn { margin: 0; }
        .rf-yordam { margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; }
        .rf-yordam b { display: block; margin-bottom: 4px; font-size: 12px; color: ${T.ink2}; }
        .rf-yordam-s + .rf-yordam-s { margin-top: 4px; }
        .rf-sql-ust { margin-top: 6px; }
        .rf-sql { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; padding: 6px 8px; border-radius: 9px; background: ${CODE.bg}; }
        .rf-sql code { flex: 1 1 200px; min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.45; color: ${CODE.attr}; overflow-wrap: anywhere; }
        .rf-sql .rf-nusxa { font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 700; border: 0; border-radius: 7px; padding: 4px 9px; background: ${fon(T.paper, 0.16)}; color: #fff; cursor: pointer; }
        .rf-sql-iz { margin-top: 3px; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .rf-tk { margin-top: 10px; padding: 9px 11px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; animation: rf-kir .35s ease both; }
        .rf-tk.tanlandi { border-color: ${T.line}; }
        .rf-tk-nom { font-size: 13px; color: ${T.ink}; }
        .rf-tk-m { margin-top: 2px; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .rf-tk-btnlar { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 7px; }
        .rf-tk-btn.ok { border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; } .rf-tk-btn.err { border-color: ${T.err}; background: ${T.errFon}; color: ${T.err}; }
        p.rf-boshqa { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.bg}; font-size: 13.5px; line-height: 1.45; color: ${T.ink2}; }
        p.rf-past { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        p.rf-ortda, p.rf-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        @media (max-width: 640px) { p.rf-ortda .qcode { white-space: normal; overflow-wrap: anywhere; } }
        p.rf-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.bg}; }
        .rf-fayl { display: flex; flex-wrap: wrap; gap: 8px; }
        .rf-fayl-btn.on { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.ink}; }
        /* Kutilgan natija maketlari */
        .rf-an { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .rf-an-q { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; justify-content: center; }
        .rf-an-q > .fade-step { flex: 1 1 200px; max-width: 260px; }
        .rf-neon { align-self: stretch; display: flex; flex-direction: column; gap: 3px; padding: 8px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .rf-an-q > .rf-neon { flex: 1 1 200px; max-width: 280px; align-self: flex-start; }
        @media (max-width: 760px) { .zoomable:not(.zoom-on) .rf-an > .rf-neon { margin-right: 46px; } }
        .rf-neon-bosh { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 8px; font-size: 12px; }
        .rf-neon-bosh em { font-style: normal; font-size: 11px; color: ${T.ink2}; }
        .rf-neon-bosh code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; }
        .rf-neon-q { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2px 10px; font-size: 11.5px; }
        .rf-neon-q code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .rf-neon-q b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; } .rf-neon-q.ok b { color: ${T.ok}; }
        .rf-tn { display: grid; grid-template-columns: 1fr 1fr auto; gap: 6px; padding: 2px 4px; border-radius: 6px; font-size: 11px; align-items: center; }
        .rf-tn code { font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .rf-tn.ust { color: ${T.ink2}; font-size: 10.5px; border-bottom: 1px solid ${T.line}; }
        .rf-tn b { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 0 6px; border-radius: 6px; }
        .rf-tn.err b { color: ${T.err}; background: ${T.errFon}; } .rf-tn.ok b { color: ${T.ok}; background: ${T.okFon}; }
        .rf-tn.pro { grid-template-columns: auto 1fr; }
        .rf-tn.pro b { color: ${T.ok}; background: ${T.okFon}; }
        .rf-tn.pro em { grid-column: 1 / -1; font-style: normal; font-size: 10.5px; color: ${T.ink2}; }
        .rf-rc-n { font-family: 'JetBrains Mono', monospace; font-size: 34px; color: ${T.accent}; }
        /* Kartochkalar, AI kartasi, yakun */
        .rf-flash { display: flex; flex-direction: column; gap: 10px; }
        .rf-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: rf-puls 1.8s ease-out .4s 3; }
        p.rf-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.rf-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        p.rf-ai-m { margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .rf-ai-sorov { margin: 0 0 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; white-space: pre-wrap; }
        .rf-ai-btn { margin: 0; }
        .rf-ai { display: flex; flex-direction: column; }
        .rf-yakun { display: contents; }
        .rf-yakun.belgisiz .done-chip { display: none; }
        .rf-yakun .q-yakun > .ach-coll { order: 1; }
        p.rf-keyingi { margin: 0; font-size: 14.5px; line-height: 1.5; color: ${T.ink2}; }
        p.rf-keyingi b { color: ${T.ink}; }
        p.rf-navbat { margin: 0; display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.rf-navbat span { font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 999px; padding: 1px 10px; }
        /* ⛶ kattalashtirish — skeletda yo'q qoida (SABOQ 38); ikki klassli selektor — keyingi «.zoomable position relative» oynani siljitmasin (E 48) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 96vw); max-height: 92vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 900px) { .rf-s5, .rf-s5.tugadi { grid-template-columns: 1fr; } }
        @media (max-width: 640px) {
          .rf-kirish { flex-direction: column; }
          .rf-k-ong { width: 100%; max-width: 300px; }
          .rf-s5 { padding-top: 26px; }
          .rf-quti { padding: 6px 7px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rf-halqa, .rf-k.faol .q-variant, .rf-chorla .q-chip, .rf-chorla-b, .rf-flash.yangi .fc-card .fc-front, .rf-pop, .rf-j-q.yangi, .rf-ilova, .rf-br-kod, .rf-umami, .rf-katak i.tushdi, .rf-tk { animation: none !important; }
          .rf-kv { display: none !important; }
          .rf-pufak, .rf-br-manzil, .rf-ulash, .rf-f-btn, .rf-hk, .rf-backend { transition: none !important; }
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
