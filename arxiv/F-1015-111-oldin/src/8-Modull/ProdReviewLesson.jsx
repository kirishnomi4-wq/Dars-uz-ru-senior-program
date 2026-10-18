import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 10-Modul (src/8-Modull) · 9-dars «Loyiha kuni: prodga ko'tarish — 2-qism» (m8-09) — MD v3: feedback/F-1005-10modul/09-ProdReview-v3.md
// Skeletdan (src/skelet/NamunaDars.jsx) qurildi: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletniki.
// Oqim (12): kirish → reja → tushuncha (ikki yo'l) → amaliyot 1 → 1-savol → tushuncha (izoh va javob) → amaliyot 2 → 2-savol → amaliyot 3 → podium → kartochkalar → yakun.
// Bitta vizual — «Maydon» PR maketi: PR_NAMUNA + IZOHLAR → PrMaket (GitHub ko'rinishi chizilgan, logotipsiz); yon qismlar — TarmoqChizma, EgaSahifa (telefon, chapda).
// Uyga vazifa yo'q (P-058: loyiha kuni, ish repo'da). Matn — MD dan so'zma-so'z; ru — qisqa (6-RU bosqichida sayqal).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ru-qoldiq-istisno s5: yuklanmoqda bu bir cho'zilishi mumkin
// (s5 — diff ichidagi sayt kodi qatori: «Maydon» sayti o'zbekcha, kod tarjima qilinmaydi)
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QXato, QKirish, QReja, QTushuncha, QTest, QTestJavob, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm8-09-v1', lessonTitle: { uz: "Loyiha kuni: prodga ko'tarish — 2-qism", ru: "День проекта: вывод в прод — часть 2" } }; // ru — MD da yo'q (6-RU bosqichida tasdiqlanadi)
// 12 ekran (MD v3): 8 + 3 amaliyot bloki + kartochkalar (SABOQ 12). Uyga vazifa yo'q — HW_TOKENS yakunda ishlatilmaydi.
const HW_TOKENS = [
  { t: 'Pull Request', l: 8, tp: 22, s: 13, d: 6 },
  { t: 'code review', l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'izoh', ru: "комментарий" }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: 'Merge', l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'a3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's7',  type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD v3: 1-savol C (2), 2-savol A (0) — o'rni keyin o'zgarmaydi. `practice: -1` — amaliyot bloklari signali (variant yo'q).
const INLINE_KEYS = { s3: 2, s5: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI: 4 — 1-savol, 7 — 2-savol). S-026: emoji o'rniga koddan / GitHub'dan bitta qator.
const RcKod = ({ t }) => <code className="pr-rc-kod">{tr(t)}</code>;
const RECAPS = {
  4: {
    title: { uz: fmtCode('Sayt `main` dan chiqadi'), ru: fmtCode('Сайт берётся из `main`') },
    cards: [
      { ic: <RcKod t="base: main ← compare: prod" />, h: 'PR', body: { uz: fmtCode("`prod` dagi o'zgarish `main` ga birlashtirishga so'raladi."), ru: fmtCode('Изменение из `prod` предлагается объединить с `main`.') } },
      { ic: <RcKod t="git push" />, h: { uz: 'PR ochiq', ru: "PR открыт" }, body: { uz: "Yangi commit PR'ga qo'shiladi, sayt o'zgarmaydi.", ru: "Новый commit добавляется в PR, сайт не меняется." } },
      { ic: <RcKod t="Merge pull request" />, h: { uz: 'Birlashtirish', ru: "Объединение" }, body: { uz: fmtCode("`main` o'zgaradi, Render va Netlify yangilanadi."), ru: fmtCode('`main` меняется, Render и Netlify обновляются.') }, ask: { uz: "O'tgan darsdagi chegara nega hali internetda ishlamayapti?", ru: "Почему лимит из прошлого урока ещё не работает в интернете?" } }
    ]
  },
  7: {
    title: { uz: 'Sabab — sizdan', ru: "Причина — от вас" },
    cards: [
      { ic: <RcKod t="git diff" />, h: { uz: 'Kod', ru: 'Код' }, body: { uz: 'Sabab kodda tekshiriladi.', ru: "Причина проверяется в коде." } },
      { ic: <RcKod t={{ uz: 'Sabab:', ru: 'Причина:' }} />, h: { uz: 'Javob', ru: "Ответ" }, body: { uz: 'Nega shunday qilganingizni aytadi.', ru: "Объясняет, почему вы сделали именно так." } },
      { ic: <RcKod t={{ uz: 'Qaror: qoldi / tuzataman', ru: 'Решение: оставлено / исправлю' }} />, h: { uz: 'Qaror', ru: "Решение" }, body: { uz: "O'zgarmaydi yoki tuzatiladi.", ru: "Не меняется или исправляется." }, ask: { uz: '«Agent shunday yozgan» nega javob emas?', ru: "Почему «так написал агент» — не ответ?" } }
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

// ===== BITTA VIZUAL — «Maydon» PR maketi (163/180): PR_NAMUNA + IZOHLAR → PrMaket; yon qismlar TarmoqChizma · EgaSahifa — bitta manbadan =====
// GitHub ko'rinishi chizilgan (CSS), logotipsiz (D4); GitHub yozuvlari inglizcha (T-033). Rang — faqat holat: «Open» ok, «Merged» accent (MD A-9).
// Joylashuv (SABOQ 21–23): sayt (ega sahifasi, telefon ≈172×272) doim CHAPDA, chizma/PR O'NGDA; telefon kichraymaydi.
// qolip-maket: pr-yol
const cxx = (...a) => a.filter(Boolean).join(' ');
const useKamHarakat = () => typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
// Taymerlar ekrandan chiqilganda tozalanadi
const useTaymer = () => {
  const ref = useRef([]);
  useEffect(() => () => ref.current.forEach(clearTimeout), []);
  return useCallback((fn, ms) => { ref.current.push(setTimeout(fn, ms)); }, []);
};
// Uchish (SABOQ 19): nuqta, konvert yoki tanlangan bo'lak manbadan nishonga uchadi. Joylar DOM dan o'lchanadi (⛶ kattalashganda ham to'g'ri); kam harakat rejimida uchmaydi.
const UCH_MS = 800;
const useUchish = () => {
  const box = useRef(null);
  const kam = useKamHarakat();
  const taymer = useTaymer();
  const [uchlar, setUchlar] = useState([]);
  const uchir = useCallback((manba, nishon, t, tur, ms = UCH_MS) => {
    const b = box.current; if (kam || !b) return;
    const s = typeof manba === 'string' ? b.querySelector(manba) : manba;
    const n = typeof nishon === 'string' ? b.querySelector(nishon) : nishon;
    if (!s || !n) return;
    const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
    const m = (el) => { const r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - br.left) / z, y: (r.top + r.height / 2 - br.top) / z }; };
    const u = { k: String(Math.random()).slice(2), t, tur, a: m(s), b: m(n), ms };
    setUchlar(x => [...x, u]);
    taymer(() => setUchlar(x => x.filter(y => y.k !== u.k)), ms + 60);
  }, [kam, taymer]);
  return { box, uchlar, uchir, kam };
};
const Uchar = ({ u }) => (
  <span className={cxx('pr-uchar', u.tur, !u.t && 'nuqta')} aria-hidden="true"
    style={{ left: u.a.x + 'px', top: u.a.y + 'px', '--dx': (u.b.x - u.a.x) + 'px', '--dy': (u.b.y - u.a.y) + 'px', animationDuration: u.ms + 'ms' }}>{u.t}</span>
);

const PR_NAMUNA = {
  sarlavha: { uz: "Prod ro'yxati: chegara, xato holatlari, A/B yakuni", ru: 'Прод-список: лимит, состояния ошибок, итог A/B' }, raqam: 1, base: 'main', compare: 'prod',
  manzil: 'github.com/…/maydon/pull/1',
  // PR tavsifi (A1 kutilgan natija, MD aynan) — uch bo'lim: Nima o'zgardi · Sabab · Qanday tekshirdim
  tavsif: [
    { h: { uz: "Nima o'zgardi", ru: "Что изменилось" }, q: [
      { uz: "So'rovlar chegarasi: POST /bandlar, POST /kirish, POST /hodisalar — backend/", ru: "Лимит запросов: POST /bandlar, POST /kirish, POST /hodisalar — backend/" },
      { uz: 'Xato va kutish holatlari — web/', ru: "Состояния ошибки и ожидания — web/" },
      { uz: "A/B yakuni: hamma B ni ko'radi («18:00 ni band qilish») — web/src/BandForma.jsx", ru: "Итог A/B: все видят B («Забронировать 18:00») — web/src/BandForma.jsx" },
      { uz: 'README — olti qism — README.md', ru: "README — шесть частей — README.md" }
    ] },
    { h: { uz: 'Sabab', ru: "Причина" }, q: [
      { uz: 'Chegara: parolni qayta-qayta taxmin qilishni va soxta bandlarni sekinlatadi', ru: "Лимит: замедляет подбор пароля и фальшивые брони" },
      { uz: "Kutish holati: Backend kechiksa yoki javob bermasa — o'yinchi kutishni bilsin, sayt o'zi qayta so'raydi", ru: "Состояние ожидания: Backend задерживается или не отвечает — игрок знает, что надо ждать, сайт сам запрашивает снова" },
      { uz: "B: kuzatilgan foiz yuqoriroq (A — 42 tadan 12, B — 40 tadan 17); 82 ta brauzer hali kam — hozircha qoladi, kuzatiladi", ru: "B: наблюдаемый процент выше (A — 12 из 42, B — 17 из 40); 82 браузера ещё мало — пока остаётся, следим" }
    ] },
    { h: { uz: 'Qanday tekshirdim', ru: "Как я проверил" }, q: [
      { uz: "Laptopda noto'g'ri parolni ketma-ket yozdim — chegara ishladi", ru: "На ноутбуке вводил неверный пароль подряд — лимит сработал" },
      { uz: "Backend'ni to'xtatdim — «Vaqtlar yuklanmoqda…», bir daqiqadan keyin «Qayta urinish» chiqdi", ru: "Остановил Backend — «Время загружается…», через минуту появилось «Повторить»" }
    ] }
  ]
};
// «Files changed» — o'tgan darsda qo'shilgan qatorlar (namuna; matn 8-dars MD sidan). on — izoh qo'yiladigan qator.
const DIFF = {
  chegara: { fayl: 'backend/src/app.module.ts', qatorlar: [
    { t: '+', k: 'ThrottlerModule.forRoot({' },
    { t: '+', k: '  throttlers: [{ ttl: 60_000, limit: 60 }],', on: true }
  ] },
  kutish: { fayl: 'web/src/App.jsx', qatorlar: [
    { t: '+', k: '{kechikdi && (' },
    { t: '+', k: "  <p className=\"xabar\">Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.</p>", on: true }
  ] }
};
// Uch izoh (A-bo'lim, aynan): har biri o'z fayli va qatori; javob — Sabab · Qaror. review — REVIEW.md qatori (A3 kutilgan natija).
const IZOHLAR = [
  { fayl: 'web/src/BandForma.jsx', qator: { uz: 'tugma matni', ru: "текст кнопки" },
    joy: { uz: "tugma matni, endi hamma B ni ko'radi", ru: "текст кнопки, теперь все видят B" },
    negaMuhim: { uz: "A va B farqi kichik ko'rinadi", ru: "разница между A и B кажется небольшой" },
    taklif: { uz: 'qaysi raqamlarga tayanganingizni yozing', ru: "напишите, на какие числа вы опирались" },
    sabab: { uz: 'B ishga tushgandan beri A — vaqt tanlagan 42 brauzerdan 12 tasi, B — 40 tadan 17 tasi band qildi; farq bor, lekin 82 ta brauzer hali kam — hozircha B qoladi, raqamni kuzatib boramiz.', ru: "С запуска B: в A забронировали 12 из 42 браузеров, выбравших время, в B — 17 из 40; разница есть, но 82 браузера ещё мало — пока остаётся B, следим за числом." },
    qaror: 'qoldi',
    review: { joy: { uz: 'web/src/BandForma.jsx, tugma', ru: 'web/src/BandForma.jsx, кнопка' }, izoh: { uz: "Nega B qoldi? Farq kichik ko'rinadi", ru: "Почему остался B? Разница кажется небольшой" }, sabab: { uz: 'A — 42 tadan 12, B — 40 tadan 17; 82 ta brauzer hali kam — hozircha B, kuzatamiz', ru: "A — 12 из 42, B — 17 из 40; 82 браузера ещё мало — пока B, следим" }, qaror: 'qoldi' } },
  { fayl: 'backend/src/app.module.ts', qator: { uz: 'chegara', ru: "лимит" },
    joy: { uz: "so'rovlar chegarasi Backend'da", ru: "лимит запросов в Backend" },
    negaMuhim: { uz: "chegara saytda bo'lsa, Backend'ga keraksiz so'rov bormaydi", ru: "если лимит на сайте, лишний запрос не дойдёт до Backend" },
    taklif: { uz: "tugma bir daqiqaga o'chsin", ru: "пусть кнопка отключается на минуту" },
    sabab: { uz: "so'rovni saytsiz ham, to'g'ridan Backend'ga yuborsa bo'ladi; chegara Backend'da tursa, Backend'ga kelgan har so'rovga ishlaydi.", ru: "запрос можно отправить и без сайта, прямо в Backend; лимит в Backend работает для каждого пришедшего к нему запроса." },
    qaror: 'qoldi',
    review: { joy: { uz: "backend, so'rovlar chegarasi", ru: 'backend, лимит запросов' }, izoh: { uz: "Saytda tugma bir daqiqaga o'chsa-chi?", ru: "А если на сайте отключать кнопку на минуту?" }, sabab: { uz: "So'rovni saytsiz ham yuborsa bo'ladi; chegara Backend'ga kelgan har so'rovga ishlaydi", ru: "Запрос можно отправить и без сайта; лимит работает для каждого запроса в Backend" }, qaror: 'qoldi' } },
  { fayl: 'web/src/App.jsx', qator: { uz: '«yuklanmoqda» qatori', ru: "строка «yuklanmoqda»" },
    joy: { uz: "`/ega` dagi bandlar ro'yxati (`web/src/Ega.jsx`)", ru: "список броней на `/ega` (`web/src/Ega.jsx`)" },
    negaMuhim: { uz: "Backend kechiksa, ro'yxat joyi bo'sh turadi — ega «band yo'q» deb o'ylashi mumkin", ru: "если Backend задержится, место списка пустует — владелец может решить, что броней нет" },
    taklif: { uz: "o'yinchi sahifasidagi «yuklanmoqda» holatini bu yerga ham qo'shing", ru: "добавьте сюда состояние загрузки со страницы игрока" },
    sabab: { uz: "tekshirdim, shunday — holat faqat o'yinchi sahifasiga qo'shilgan edi.", ru: "проверил, так и есть — состояние было добавлено только на страницу игрока." },
    qaror: 'tuzataman',
    review: { joy: { uz: 'web/src/Ega.jsx, bandlar', ru: 'web/src/Ega.jsx, брони' }, izoh: { uz: "Backend kechiksa, ro'yxat bo'sh — «yuklanmoqda» holati kerak", ru: "Если Backend задержится, список пуст — нужно состояние загрузки" }, sabab: { uz: "Tekshirdim, shunday: holat faqat o'yinchi sahifasida edi", ru: "Проверил, так и есть: состояние было только на странице игрока" }, qaror: 'tuzatildi' } }
];
const KIM = { sinfdosh: { uz: 'sinfdosh', ru: "одноклассник" }, muallif: { uz: 'muallif', ru: "автор" } };
const QAROR = { qoldi: { uz: 'qoldi', ru: "оставлено" }, tuzataman: { uz: 'tuzataman', ru: "исправлю" }, tuzatildi: { uz: 'tuzatildi', ru: "исправлено" } };
const QISM = { joy: { uz: 'Joy', ru: "Место" }, nega: { uz: 'Nega muhim', ru: "Почему важно" }, taklif: { uz: 'Taklif', ru: "Предложение" }, sabab: { uz: 'Sabab', ru: "Причина" } };
const YUK_MATN = { uz: "Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.", ru: "Брони загружаются — это может занять до минуты." };

// Qaror belgisi: qoldi — neytral (acc bilan accent) · tuzataman — accent · tuzatildi — yashil ✓. yalang — faqat qiymat (REVIEW.md ustuni)
const QarorBelgi = ({ q, acc, yalang }) => {
  const tuzatildi = q === 'tuzatildi';
  const urg = acc || q === 'tuzataman';
  return <span className={cxx('pr-qaror', urg && 'acc', tuzatildi && 'ok')}>{tuzatildi ? '✓ ' : ''}{!yalang && <>{tr({ uz: 'Qaror', ru: "Решение" })}: </>}{tr(QAROR[q])}</span>;
};
// GitHub izoh pufagi: avatar (ismsiz doira) + kim + matn. muallif — PR'ni ochgan odam (siz)
const Pufak = ({ kim = 'sinfdosh', className, children }) => (
  <div className={cxx('pr-pufak', kim === 'muallif' && 'muallif', className)}>
    <i className="pr-ava" aria-hidden="true" />
    <div className="pr-pufak-ich"><span className="pr-kim">{tr(KIM[kim])}</span>{children}</div>
  </div>
);
// PR sahifasi (brauzer oynasi): sarlavha #1 · holat belgisi · main ← prod · yorliqlar «Conversation» / «Files changed»
// ixcham — kutilgan natija va 4-ekranda: manzil qatorisiz, sarlavha va holat bir qatorda (ekranga sig'sin, SABOQ 25)
const PrMaket = ({ holat = 'Open', korinish = 'fayllar', ixcham, meta = true, tabOng, className, children }) => {
  const birlashdi = holat === 'Merged';
  const suhbatda = korinish === 'suhbat';
  return (
    <div className={cxx('pr-oyna', ixcham && 'ixcham', className)}>
      {!ixcham && <div className="pr-bar"><i /><i /><i /><span className="pr-manzil">{PR_NAMUNA.manzil}</span></div>}
      <div className="pr-bosh">
        <p className="pr-sar">{tr(PR_NAMUNA.sarlavha)} <span className="pr-sar-n">#{PR_NAMUNA.raqam}</span></p>
        {meta && <div className="pr-meta">
          <span className={cxx('pr-holat', birlashdi ? 'merged' : 'open')} key={holat}><i aria-hidden="true" />{holat}</span>
          <span className="pr-tarmoqlar"><code>{PR_NAMUNA.base}</code><b aria-hidden="true">←</b><code>{PR_NAMUNA.compare}</code></span>
        </div>}
        <div className="pr-tablar"><span className={cxx('pr-tab', suhbatda && 'on')}>Conversation</span><span className={cxx('pr-tab', !suhbatda && 'on')}>Files changed</span>{tabOng}</div>
      </div>
      {children && <div className="pr-tana">{children}</div>}
    </div>
  );
};
// «Files changed» dagi bitta fayl: qatorlar navbat bilan chiqadi; ip — izoh-suhbat, GitHub'dagidek izohli qator ostida
const PrFayl = ({ diff, ip, xira, className, children }) => (
  <div className={cxx('pr-fayl', xira && 'xira', className)}>
    <div className="pr-fayl-h"><code>{diff.fayl}</code></div>
    <div className="pr-diff">
      {diff.qatorlar.map((q, i) => (
        <React.Fragment key={i}>
          <span className={cxx('pr-d', q.t === '+' ? 'qosh' : 'ayir', q.on && 'on')} style={{ '--d': (0.12 + i * 0.09) + 's' }}><b>{q.t}</b>{q.k}</span>
          {q.on && ip}
        </React.Fragment>
      ))}
    </div>
    {children}
  </div>
);
// Ega sahifasi — telefon = sayt (`/ega`); manzil telefon brauzerining manzil qatorida. Ro'yxat joyi: royxat · yangi (yashil) · bosh · joy (accent ramka) · xato (qizil uzuq) · yuklanmoqda · namuna (uzuq)
const BANDLAR = ['17:00', '20:00'];
const EgaSahifa = ({ holat = 'royxat', kalit, soat, className, children }) => (
  <div className={cxx('pr-tel-ust', className)}>
    <div className="pr-telefon">
      <div className="pr-tel-bar"><code>maydon-….netlify.app/ega</code></div>
      <div className="pr-tel-ekran" key={kalit || 'e'}>
        <b className="pr-tel-sar">Maydon · ega</b>
        <span className="pr-kun"><i aria-hidden="true">‹</i>{tr({ uz: 'Shanba', ru: "Суббота" })}<i aria-hidden="true">›</i></span>
        <span className="pr-kun-sar">{tr({ uz: 'Shanba · bandlar', ru: "Суббота · брони" })}</span>
        <div className="pr-royxat" data-h={holat}>
          {(holat === 'royxat' || holat === 'yangi') && BANDLAR.map((s, i) => <span key={s} className="pr-band" style={{ '--d': (0.08 + i * 0.12) + 's' }}><b>{s}</b><i /><i /></span>)}
          {(holat === 'yuklanmoqda' || holat === 'namuna') && <span className="pr-yuk"><i className="pr-halqa" aria-hidden="true" />{tr(YUK_MATN)}</span>}
          {soat && <span className="pr-soat"><i aria-hidden="true" />{tr({ uz: '40 soniya', ru: "40 секунд" })}</span>}
        </div>
      </div>
    </div>
    {children}
  </div>
);
// Bashorat (181; SABOQ 11/19): karta yengil ko'tarilib kiradi, variantlar navbat bilan; tanlangach ixcham qatorga yig'iladi va natijagacha turadi
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="pr-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <div className="pr-taxmin"><span className="pr-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="pr-taxmin-s">{savol}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Natija bloki (SABOQ 25): bitta yashil blok — birinchi qator taxmin (yoki izoh), so'ng xulosa
const NatijaBlok = ({ tanlov, togri, variantlar, haqiqat, izoh, xulosa }) => {
  const tx = variantlar && variantlar.find(v => v.k === tanlov);
  const ok = tanlov === togri;
  return (
    <div className="q-xulosa pr-nb">
      {tx && <span className={cxx('pr-nb-t', ok && 'ok')}>{ok
        ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: "Ваше предположение оказалось верным" })}</>
        : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>}
      {izoh && <span className="pr-nb-i">{izoh}</span>}
      <span>{xulosa}</span>
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish): sinfdosh «Nega?» deb yozdi. Variant tanlangach bo'sh javob joyiga Mentor misolining javobi yoziladi =====
const HOOK_IZOH = { uz: "Nega chegara Backend'da? Saytda tugma bir daqiqaga o'chsa, Backend'ga keraksiz so'rov bormaydi.", ru: "Почему лимит в Backend? Если на сайте отключать кнопку на минуту, лишний запрос не дойдёт до Backend." };
const HOOK_OPTS = [
  { id: 'a', t: { uz: 'Agent shunday yozgan, men tegmaganman', ru: "Так написал агент, я не трогал" } },
  { id: 'b', t: { uz: "So'rovni saytsiz ham yuborsa bo'ladi", ru: "Запрос можно отправить и без сайта" } },
  { id: 'c', t: { uz: "Mayli, aytganingizdek saytga ko'chiraman", ru: "Ладно, перенесу на сайт, как вы сказали" } }
];
const HOOK_JAVOB = {
  a: { uz: <><b>Qiziq fikr!</b> Kodni agent yozgan bo'lsa ham, qaror sizniki. Sabab: so'rovni saytsiz ham yuborsa bo'ladi.</>, ru: <><b>Интересная мысль!</b> Даже если код написал агент, решение ваше. Причина: запрос можно отправить и без сайта.</> },
  b: { uz: <><b>Aynan!</b> Bu — qaror sababi: so'rovni saytsiz ham yuborsa bo'ladi, chegara esa Backend'ga kelgan har so'rovga ishlaydi.</>, ru: <><b>Именно!</b> Это причина решения: запрос можно отправить и без сайта, а лимит работает для каждого запроса в Backend.</> },
  c: { uz: <><b>Qiziq fikr!</b> Rozi bo'lishdan oldin sababni o'ylang: so'rovni saytsiz ham yuborsa bo'ladi.</>, ru: <><b>Интересная мысль!</b> Прежде чем соглашаться, подумайте о причине: запрос можно отправить и без сайта.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const pick = (v) => { if (picked !== null) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: "День проекта · введение" })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: "Выберите один" }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Sinfdosh kodingizga «Nega?» deb yozdi. <span className="italic" style={{ color: T.accent }}>Nima deysiz?</span></>, ru: <>Одноклассник: «Почему?» <span className="italic" style={{ color: T.accent }}>Что ответите?</span></> })}
        mentor={<Mentor>{tr({ uz: "Boshqa odam kodni o'qib izoh yozishi code review deyiladi. Uch variantdan bittasini tanlang.", ru: "Когда другой человек читает код и пишет комментарий, это называется code review. Выберите один из трёх вариантов." })}</Mentor>}
        maket={<PrMaket korinish="fayllar">
          <PrFayl diff={DIFF.chegara} ip={<div className={cxx('pr-ip', picked !== null && 'javobli')}>
            <Pufak className="kir"><p className="pr-pt">{tr(HOOK_IZOH)}</p></Pufak>
            {picked === null
              ? <div className="pr-javob-joy" aria-hidden="true"><i /><i /></div>
              : <Pufak kim="muallif" className="javob kir"><p className="pr-pt"><b>{tr(QISM.sabab)}:</b> {tr(IZOHLAR[1].sabab)}</p><QarorBelgi q="qoldi" acc /></Pufak>}
          </div>} />
        </PrMaket>}
        savol={tr({ uz: 'Sizningcha, qaysi biri?', ru: "Как вы думаете, какой?" })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda PR tayyor holatda, bir marta o'zi yuradi (javoblar → «Tuzatildi» → «Merged»); o'ngda 3 qadam (tegsiz) =====
const REJA = [
  { uz: "O'tgan darsdagi o'zgarishlar sinfdoshga ko'rsatiladi", ru: "Изменения прошлого урока показываются однокласснику" },
  { uz: 'Code review: har qarorni tushuntirasiz', ru: "Code review: объясняете каждое решение" },
  { uz: 'Topilgan kamchilik tuzatilib, kod birlashtiriladi', ru: "Найденный недостаток исправляется, и код объединяется" }
];
// Izoh-suhbat ixcham kartasi: fayl · sinfdosh izohi (qisqa — Joy; toliq — uch qator) · muallif javobi (Qaror)
// Izoh-suhbat ixcham kartasi: tepada fayl va muallif javobi (Qaror) yonma-yon, ostida sinfdosh izohi (qisqa — Joy; toliq — uch qator)
const Suhbat = ({ iz, i, javob, tuzatildi, toliq, navbat }) => (
  <div className={cxx('pr-suhbat', navbat && 'navbat')} style={{ '--d': (0.15 + i * 0.12) + 's' }}>
    <div className="pr-suhbat-h">
      <code className="pr-suhbat-f">{iz.fayl}</code>
      {javob && <span className="pr-javob-ix"><i className="pr-ava muallif" aria-hidden="true" /><QarorBelgi q={iz.qaror} />{tuzatildi && <span className="pr-tuzatildi">✓ {tr({ uz: 'Tuzatildi', ru: "Исправлено" })}</span>}</span>}
    </div>
    <div className="pr-suhbat-izoh">
      <i className="pr-ava" aria-hidden="true" />
      <span className="pr-suhbat-t">
        <p className={cxx('pr-pt', !toliq && 'qisqa')}><b>{tr(QISM.joy)}:</b> {fmtCode(tr(iz.joy))}</p>
        {toliq && <p className="pr-pt"><b>{tr(QISM.nega)}:</b> {tr(iz.negaMuhim)}</p>}
        {toliq && <p className="pr-pt"><b>{tr(QISM.taklif)}:</b> {tr(iz.taklif)}</p>}
      </span>
    </div>
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => {
  const kam = useKamHarakat();
  const [b, setB] = useState(kam ? 5 : 0); // 0 — izohlar · 1–3 — javoblar · 4 — «Tuzatildi» · 5 — «Merged»
  useEffect(() => { if (b >= 5) return undefined; const t = setTimeout(() => setB(x => x + 1), b === 0 ? 1300 : 800); return () => clearTimeout(t); }, [b]);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: "Начинаем" })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Dars oxirida ko'rib chiqilgan kod <span className="italic" style={{ color: T.accent }}>internetga chiqadi</span>.</>, ru: <>В конце урока проверенный код <span className="italic" style={{ color: T.accent }}>выйдет в интернет</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Kodni sinfdosh o'qiydi, kamchilikni agent tuzatadi, qarorni esa siz tushuntirasiz. «Maydon» — namuna: har amaliyot oxirida shu ishni o'z eng yaxshi loyihangiz uchun ham yozasiz.", ru: "Код читает одноклассник, недостаток исправляет агент, а решение объясняете вы. «Maydon» — образец: в конце каждой практики вы напишете то же для своего лучшего проекта." })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: "В конце урока" })}
        chap={<PrMaket holat={b >= 5 ? 'Merged' : 'Open'} korinish="suhbat" ixcham>
          <div className="pr-suhbatlar">{IZOHLAR.map((iz, i) => <Suhbat key={i} iz={iz} i={i} javob={b >= i + 1} tuzatildi={i === 2 && b >= 4} />)}</div>
        </PrMaket>}
        qadamlar={REJA.map(r => ({ t: tr(r) }))}
      >
        <p className="pr-repo">{tr({ uz: 'repo', ru: "репо" })} <code>maydon</code> · {tr({ uz: "boshlang'ich holat", ru: "начальное состояние" })} <code>m10-dars-09-start</code> · {tr({ uz: 'namuna', ru: "образец" })} <code>m10-dars-09-done</code></p>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA: o'zgarish internetga qanday chiqadi. Bashorat → ikki yo'l (push / PR) → telefon (ega sahifasi) CHAPDA, tarmoq chizmasi O'NGDA =====
// Har yo'l bitta bosishda o'ynaydi: commit nuqtalari main ga uchadi → «Render · Netlify» yonadi → konvert telefonga uchadi → ro'yxat joyi o'zgaradi.
// 2/2 dan keyin yo'l tugmalari natija-kartaga aylanadi (chapda ✗, o'ngda ✓ — P-057), sahna PR yo'lida qoladi.
const S2_SAVOL = { uz: "O'tgan darsdagi so'rovlar chegarasi hozir qayerda ishlayapti?", ru: "Где сейчас работает лимит запросов из прошлого урока?" };
const S2_TAXMIN = [{ k: 'hech', t: { uz: 'Hech qayerda', ru: 'Нигде' } }, { k: 'laptop', t: { uz: 'Faqat laptopda', ru: "Только на ноутбуке" } }, { k: 'ikkala', t: { uz: 'Laptopda ham, internetda ham', ru: "И на ноутбуке, и в интернете" } }];
const YOLLAR = [
  { k: 'push', t: { uz: "To'g'ridan `main` ga push", ru: "Push прямо в `main`" }, natija: { uz: "Hech kim o'qimadi — kamchilik internetga chiqdi.", ru: "Никто не прочитал — недостаток ушёл в интернет." } },
  { k: 'pr', t: { uz: 'PR orqali birlashtirish', ru: "Объединение через PR" }, natija: { uz: "Sinfdosh o'qidi — kamchilik birlashtirishdan oldin tuzatildi.", ru: "Одноклассник прочитал — недостаток исправлен до объединения." } }
];
// Bosqichlar (ms): push — 1 nuqtalar uchadi · 2 main da · 3 hosting yonadi, konvert · 4 sahifa yangilandi · 5 ro'yxat bo'sh (qizil)
//                  pr — 1 PR kartasi · 2 izoh · 3 «tuzatish» nuqtasi · 4 «Merge» bosildi, nuqtalar uchadi · 5 main da, hosting, konvert · 6 «yuklanmoqda» · 7 ro'yxat (yashil)
const YOL_VAQT = { push: [60, 850, 1150, 2000, 2700], pr: [60, 750, 1450, 2150, 2950, 3850, 4750] }; // bosqich 1…N vaqti
const YOL_TUGASH = { push: 3100, pr: 5150 };
const TarmoqChizma = ({ yol, b }) => {
  const pr = yol === 'pr';
  const prodUchdi = (yol === 'push' && b >= 1) || (pr && b >= 4);
  const mainYangi = yol === 'push' && b >= 2 ? 3 : pr && b >= 5 ? 1 : 0;
  const yondi = (yol === 'push' && b >= 3) || (pr && b >= 5);
  return (
    <div className="pr-tc">
      <code className="pr-tc-n">prod</code>
      <div className="pr-tc-chiziq prod">
        {[0, 1, 2].map(i => <i key={i} className={cxx('pr-nuqta acc', prodUchdi && 'uchdi')} />)}
        {pr && b >= 3 && <i className={cxx('pr-nuqta ok yangi', prodUchdi && 'uchdi')}><em>{tr({ uz: 'tuzatish', ru: "исправление" })}</em></i>}
      </div>
      <span className={cxx('pr-laptop', mainYangi > 0 && 'xira')}><i aria-hidden="true" />{tr({ uz: 'laptopda ishlayapti', ru: "работает на ноутбуке" })}</span>
      <div className="pr-tc-orta">
        {pr && b >= 1 && <div className="pr-tc-pr">
          <span className="pr-tc-pr-h"><b>Pull Request</b> · Files changed</span>
          <span className="pr-tc-pr-q"><code>web/src/App.jsx</code><span className="pr-d qosh"><b>+</b>{'{kechikdi && (…)}'}</span></span>
          <span className="pr-tc-pr-alt">
            {b >= 2 && <span className="pr-tc-izoh"><i className="pr-ava" aria-hidden="true" />{fmtCode(tr({ uz: '`/ega` da-chi?', ru: 'А на `/ega`?' }))}</span>}
            <span className={cxx('pr-tc-merge', b >= 4 && 'bosildi')}>Merge pull request</span>
          </span>
        </div>}
      </div>
      <code className="pr-tc-n">main</code>
      <div className="pr-tc-chiziq main">
        <i className="pr-nuqta" /><i className="pr-nuqta" />
        {Array.from({ length: mainYangi }, (_, i) => <i key={i} className={cxx('pr-nuqta acc yangi', pr && 'merge')} style={{ '--d': (i * 0.1) + 's' }} />)}
        <b className="pr-strelka" aria-hidden="true" />
      </div>
      <span className={cxx('pr-host', yondi && 'yondi')} key={yondi ? 'y' : 'n'}>Render · Netlify</span>
    </div>
  );
};
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, kam } = useUchish();
  const taymer = useTaymer();
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [tugal, setTugal] = useState(avval ? ['push', 'pr'] : []);
  const tugalRef = useRef(tugal);
  const [yol, setYol] = useState(avval ? 'pr' : null);
  const [b, setB] = useState(avval ? 7 : 0);
  const [jim, setJim] = useState(avval); // 2/2 dan keyin — sahna PR yo'lida turadi
  const done = tugal.length >= 2;
  const tugadi = useTugadi(done && jim, 900, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const yuryapti = !!yol && !jim && !tugal.includes(yol);
  // Yo'l tugadi: natija-karta; 2/2 dan keyin sahna PR yo'lida qoladi (yakuniy holat)
  const yakunla = (k, kechik) => {
    const n = tugalRef.current.includes(k) ? tugalRef.current : [...tugalRef.current, k];
    tugalRef.current = n; setTugal(n);
    if (n.length >= 2) { if (kechik) taymer(() => { setYol('pr'); setB(7); setJim(true); }, kechik); else { setYol('pr'); setB(7); setJim(true); } }
  };
  const boshla = (k) => {
    if (!taxmin || yuryapti || tugalRef.current.includes(k)) return;
    const v = YOL_VAQT[k];
    setJim(false); setYol(k); setB(0);
    if (kam) { setB(v.length); yakunla(k, 0); return; }
    v.forEach((ms, i) => taymer(() => setB(i + 1), ms));
    // Nuqtalar prod dan main ga uchadi (push — darrov, PR — «Merge» bosilganda), konvert hostingdan telefonga
    taymer(() => { const el = box.current; if (!el) return; el.querySelectorAll('.pr-tc-chiziq.prod .pr-nuqta').forEach((nq, i) => taymer(() => uchir(nq, '.pr-strelka', '', 'nuqta', 700), i * 90)); }, k === 'push' ? v[0] : v[3] + 60);
    taymer(() => uchir('.pr-host', '.pr-telefon', 'main', 'konvert', 760), (k === 'push' ? v[2] : v[4]) + 100);
    taymer(() => yakunla(k, 1300), YOL_TUGASH[k]);
  };
  const telHolat = !yol ? 'royxat'
    : yol === 'push' ? (b >= 5 ? 'xato' : b >= 4 ? 'bosh' : 'royxat')
    : (b >= 7 ? 'yangi' : b >= 6 ? 'yuklanmoqda' : 'royxat');
  const telKalit = yol && ((yol === 'push' && b >= 4) || (yol === 'pr' && b >= 6)) ? yol : 'eski';
  const navbatK = YOLLAR.find(y => !tugal.includes(y.k));
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Pull Request', ru: "Понятие · Pull Request" })} screen={screen} scrollSignal={tugal.length + (taxmin ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Ikki yo'lni bosing (${tugal.length}/2)`, ru: `Нажмите оба пути (${tugal.length}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>O'zgarish internetdagi saytga <span className="italic" style={{ color: T.accent }}>qanday yetib boradi?</span></>, ru: <>Как изменение <span className="italic" style={{ color: T.accent }}>доходит до сайта</span> в интернете?</> })}
        mentor={<Mentor>{tr({ uz: "O'zgarishni birlashtirishdan oldin ko'rsatish so'rovi Pull Request (PR) deyiladi — ikki yo'lni ham bosib ko'ring.", ru: "Запрос показать изменение до объединения называется Pull Request (PR) — нажмите на оба пути." })}</Mentor>}
        bashorat={<Bashorat savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className="pr-sahna pr-s2" ref={box}>
          <EgaSahifa holat={telHolat} kalit={telKalit} />
          <div className="pr-s2-ong">
            <TarmoqChizma yol={yol} b={b} />
            <div className="pr-yollar">
              {YOLLAR.map(y => {
                const bajarildi = tugal.includes(y.k);
                const faol = !!taxmin && !yuryapti && !bajarildi;
                return (
                  <button key={y.k} type="button" className={cxx('pr-yol', y.k, bajarildi && 'tugal', faol && navbatK && navbatK.k === y.k && 'pr-navbat', yol === y.k && yuryapti && 'yur')} disabled={!faol} onClick={() => boshla(y.k)}>
                    <b aria-hidden="true">{bajarildi ? (y.k === 'pr' ? '✓' : '✗') : '▶'}</b>
                    <span className="pr-yol-m">
                      {bajarildi && <small>{fmtCode(tr(y.t))}</small>}
                      <span className="pr-yol-t">{bajarildi ? tr(y.natija) : fmtCode(tr(y.t))}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {uchlar.map(u => <Uchar key={u.k} u={u} />)}
        </div>}
        natija={done && jim && <NatijaBlok tanlov={taxmin} togri="laptop" variantlar={S2_TAXMIN} haqiqat={fmtCode(tr({ uz: 'faqat laptopda — `prod` hali birlashtirilmagan', ru: "только на ноутбуке — ветка `prod` ещё не объединена" }))}
          xulosa={fmtCode(tr({ uz: "Bu repo'da sayt `main` dan chiqadi. PR'da kod oldindan o'qiladi, kamchilikni ertaroq ko'rish mumkin.", ru: "В этом репо сайт берётся из `main`. В PR код читают заранее, недостаток можно заметить раньше." }))} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (INLINE_KEYS.s3 = 2, C) — test yorlig'i yozilmaydi (SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="PR ochiq turibdi, prod ga yana push qildingiz. Internetdagi sayt-chi?"
    question={tr({ uz: <h2 className="title h-ask">PR ochiq turibdi, <code className="qcode">prod</code> ga yana push qildingiz. <span className="italic" style={{ color: T.accent }}>Internetdagi sayt-chi?</span></h2>, ru: <h2 className="title h-ask">PR открыт, вы снова сделали push в <code className="qcode">prod</code>. <span className="italic" style={{ color: T.accent }}>А сайт в интернете?</span></h2> })}
    options={[
      { uz: 'Yangilanadi, chunki yangi push qilindi', ru: "Обновится, потому что был новый push" },
      { uz: "To'xtaydi, chunki PR birlashtirilmagan", ru: "Остановится, потому что PR не объединён" },
      { uz: "Eskicha qoladi, chunki main o'zgarmadi", ru: "Останется прежним, потому что main не изменился" },
      { uz: 'Yangilanadi, chunki PR ochiq turibdi', ru: "Обновится, потому что PR открыт" }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Push PR'ga qo'shildi; sayt `main` dan chiqadi — u o'zgarmadi.", ru: "Push добавился в PR; сайт берётся из `main` — он не изменился." }}
    explainWrong={{
      0: { uz: 'Push `prod` ga ketdi. Sayt qaysi tarmoqdan chiqadi?', ru: "Push ушёл в `prod`. Из какой ветки берётся сайт?" },
      1: { uz: 'Ishlab turgan sayt `main` dan. U o\'zgardimi?', ru: "Работающий сайт — из `main`. Он изменился?" },
      3: { uz: "PR — ko'rsatish so'rovi. U `main` ni o'zgartiradimi?", ru: "PR — запрос на показ. Он меняет `main`?" },
      default: { uz: 'Push `prod` ga ketdi. Sayt qaysi tarmoqdan chiqadi?', ru: "Push ушёл в `prod`. Из какой ветки берётся сайт?" }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA: kamchilik izohga aylanadi. Bir vaqtda bitta qator katta karta (SABOQ 9/29): to'g'ri bo'lak izohga uchadi, telefon javob beradi =====
// Tuzoqlar bitta xato-sinf — kodga emas, odamga qaratilgan gap (S-040). Bo'laklar tartibi aralash (har qatorda o'zicha).
const S4_QATORLAR = [
  { k: 'joy', nom: QISM.joy, avval: 'tuzoq',
    togri: { uz: "`/ega` dagi bandlar ro'yxati (`Ega.jsx`)", ru: "список броней на `/ega` (`Ega.jsx`)" },
    tuzoq: { uz: 'Siz yozgan hamma kod', ru: "Весь код, который вы написали" },
    xato: { uz: 'Hamma kod — qaysi qator tuzatiladi?', ru: "Весь код — какую строку исправлять?" } },
  { k: 'nega', nom: QISM.nega, avval: 'togri',
    togri: { uz: "Backend kechiksa, ro'yxat bo'sh — ega «band yo'q» deb o'ylaydi", ru: "Если Backend задержится, список пуст — владелец решит, что броней нет" },
    tuzoq: { uz: "Siz bu yerni o'ylamasdan yozgansiz", ru: "Вы написали это, не подумав" },
    xato: { uz: "Bu odam haqida. Kodda nima bo'ladi?", ru: "Это о человеке. Что происходит в коде?" } },
  { k: 'taklif', nom: QISM.taklif, avval: 'tuzoq',
    togri: { uz: "O'yinchi sahifasidagi «yuklanmoqda» holati bu yerda ham bo'lsin", ru: "Пусть состояние загрузки со страницы игрока будет и здесь" },
    tuzoq: { uz: "Keyingi safar e'tiborliroq bo'ling", ru: "В следующий раз будьте внимательнее" },
    xato: { uz: 'Bu maslahat odamga. Kodda nima qilinadi?', ru: "Это совет человеку. Что делать в коде?" } },
  { k: 'javob', nom: { uz: 'Javob', ru: "Ответ" }, avval: 'tuzoq',
    togri: { uz: "Sabab: tekshirdim, shunday — holat faqat o'yinchi sahifasida edi. Qaror: tuzataman.", ru: "Причина: проверил, так и есть — состояние было только на странице игрока. Решение: исправлю." },
    tuzoq: { uz: "Siz tushunmabsiz, kod to'g'ri ishlaydi.", ru: "Вы не поняли, код работает правильно." },
    xato: { uz: 'Bu sinfdosh haqida. Kod haqida nima dedingiz?', ru: "Это об однокласснике. Что вы сказали о коде?" } }
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { box, uchlar, uchir, kam } = useUchish();
  const taymer = useTaymer();
  const avval = !!storedAnswer;
  const [n, setN] = useState(avval ? 4 : 0); // yig'ilgan qatorlar: joy · nega · taklif · javob
  const [xato, setXato] = useState(null); // { k, i } — oxirgi tuzoq (silkinish kaliti)
  const [yur, setYur] = useState(false);
  const done = n >= 4;
  const tugadi = useTugadi(done, 1300, avval);
  // Silkinish (MD: «silkinadi») — har xato bosishda qayta o'ynaydi; kam harakatda yo'q
  const silkit = (t) => { const el = typeof t === 'string' ? (box.current && box.current.querySelector(t)) : t; if (el && el.animate && !kam) el.animate([{ transform: 'none' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 380, easing: 'ease-out' }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  // Keyingi qator kartasi (navbatdagi harakat) ekrandan tushib qolmasin — izoh o'sgan sari karta ko'rinishga suriladi (SABOQ 11)
  useEffect(() => {
    if ((n === 0 && !xato) || done) return undefined;
    const t = setTimeout(() => { const el = box.current && box.current.querySelector('.pr-qadam'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 300);
    return () => clearTimeout(t);
  }, [n, xato]); // eslint-disable-line
  const q = S4_QATORLAR[Math.min(n, 3)];
  const tanla = (v, e) => {
    if (done || yur) return;
    if (v === 'tuzoq') { setXato({ k: q.k }); silkit(e.currentTarget); silkit(q.k === 'joy' ? '.pr-fayl' : '.pr-pufak.izoh'); return; }
    setXato(null); setYur(true);
    const nishon = q.k === 'joy' ? '.pr-d.on' : q.k === 'javob' ? '.pr-ip' : '.pr-pufak.izoh';
    uchir(e.currentTarget, nishon, '', 'bolak');
    taymer(() => { setN(x => x + 1); setYur(false); }, kam ? 0 : UCH_MS - 60);
  };
  const egaHolat = n >= 3 ? 'namuna' : n === 2 ? 'xato' : n === 1 ? 'joy' : 'bosh';
  const izohQatorlar = n >= 3
    ? [['joy', IZOHLAR[2].joy], ['nega', IZOHLAR[2].negaMuhim], ['taklif', IZOHLAR[2].taklif]]
    : S4_QATORLAR.slice(0, n).map(r => [r.k, r.togri]);
  const izoh = (
    <Pufak className={cxx('izoh', n === 0 ? 'xom' : 'ulandi')} key={n === 0 ? 'xom' : n >= 3 ? 'yigildi' : 'ulandi'}>
      {n < 3 && <p className={cxx('pr-pt', 'pr-xom', n > 0 && 'chizildi')}>{tr({ uz: 'Bu yer yomon, qayta yozing.', ru: "Здесь плохо, перепишите." })}</p>}
      {izohQatorlar.map(([k, t]) => <p key={k} className={cxx('pr-pt', 'pr-yangi-q', n >= 3 && 'yigildi')}><b>{tr(QISM[k])}:</b> {fmtCode(tr(t))}</p>)}
    </Pufak>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · izoh va javob', ru: "Понятие · комментарий и ответ" })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!done ? tr({ uz: `Izohni yig'ing (${n}/4)`, ru: `Соберите комментарий (${n}/4)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Sinfdosh topgan kamchilik qanday <span className="italic" style={{ color: T.accent }}>izohga aylanadi?</span></>, ru: <>Как недостаток <span className="italic" style={{ color: T.accent }}>становится комментарием?</span></> })}
        mentor={<Mentor>{tr({ uz: "Izohni o'qigan muallif nimani tuzatishni bilishi kerak — «Joy» qatoridan boshlab har qatorga bitta bo'lak tanlang.", ru: "Автор, прочитав комментарий, должен понять, что исправить — начиная со строки «Место», выберите по одному фрагменту на строку." })}</Mentor>}
        vizual={<div className="pr-sahna pr-s4" ref={box}>
          <EgaSahifa holat={egaHolat} soat={n === 2} />
          <PrMaket korinish="fayllar" ixcham>
            <PrFayl diff={DIFF.kutish} xira={!!(xato && xato.k === 'joy')}
              ip={n >= 1 && <div className={cxx('pr-ip', n >= 4 && 'javobli')}>
                {izoh}
                {n >= 4 && <Pufak kim="muallif" className="javob kir"><p className="pr-pt"><b>{tr(QISM.sabab)}:</b> {tr(IZOHLAR[2].sabab)} <QarorBelgi q="tuzataman" /></p></Pufak>}
              </div>}>
              {n === 0 && <div className="pr-ip pr-ip-xom">{izoh}</div>}
            </PrFayl>
          </PrMaket>
          {!done && <div className="pr-qadam" key={n}>
            <span className="pr-qadam-n">{tr(q.nom)}</span>
            <div className="pr-qadam-ch">
              {(q.avval === 'togri' ? ['togri', 'tuzoq'] : ['tuzoq', 'togri']).map(v => (
                <QChip key={v} holat={xato && v === 'tuzoq' ? 'err' : undefined} disabled={yur} onClick={(e) => tanla(v, e)}>{fmtCode(tr(q[v]))}</QChip>
              ))}
            </div>
            {xato && <QXato>{tr(q.xato)}</QXato>}
          </div>}
          {uchlar.map(u => <Uchar key={u.k} u={u} />)}
        </div>}
        natija={done && <NatijaBlok izoh={tr({ uz: "Qattiq izoh ham hurmatli bo'ladi, agar u kodga qaratilsa.", ru: "Даже жёсткий комментарий уважителен, если он про код." })}
          xulosa={tr({ uz: "Izohda joy, nega muhimligi va taklif bor, javobda — qaror sababi. Ikkalasi odamga emas, kodga qaratilgan.", ru: "В комментарии есть место, почему это важно и предложение, в ответе — причина решения. Оба — про код, а не про человека." })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (INLINE_KEYS.s5 = 0, A) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: "Упражнение · вопрос 2" })}
    questionText="Sinfdosh: «Bu qatorni nega qo'shdingiz?» Kodni agent yozgan. Nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Sinfdosh: «Bu qatorni nega qo'shdingiz?» Kodni agent yozgan. <span className="italic" style={{ color: T.accent }}>Nima qilasiz?</span></h2>, ru: <h2 className="title h-ask">Одноклассник: «Зачем вы добавили эту строку?» Код написал агент. <span className="italic" style={{ color: T.accent }}>Что сделаете?</span></h2> })}
    options={[
      { uz: "Kodni o'qib tekshiraman, keyin sababni yozaman", ru: "Прочитаю и проверю код, потом напишу причину" },
      { uz: "«Agent shunday yozgan» deb javobga yozib qo'yaman", ru: "Напишу в ответе «так написал агент»" },
      { uz: "Agentdan so'rab, javobini tekshirmay qo'yaman", ru: "Спрошу агента и вставлю ответ без проверки" },
      { uz: "Izohni javobsiz qoldirib, PR'ni birlashtiraman", ru: "Оставлю комментарий без ответа и объединю PR" }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Qaror sizniki: sababni kodda tekshirib, o'zingiz yozasiz.", ru: "Решение ваше: проверяете причину в коде и пишете сами." }}
    explainWrong={{
      1: { uz: "Sinfdosh agentdan emas, sizdan so'radi. Sabab qani?", ru: "Одноклассник спросил вас, а не агента. Где причина?" },
      2: { uz: 'Agent taxmin qilishi mumkin. Uning gapi kodga mosmi?', ru: "Агент может предполагать. Его слова совпадают с кодом?" },
      3: { uz: 'Savol ochiq qoldi. Birlashtirishdan oldin nima kerak?', ru: "Вопрос остался открытым. Что нужно до объединения?" },
      default: { uz: "Sinfdosh agentdan emas, sizdan so'radi. Sabab qani?", ru: "Одноклассник спросил вас, а не агента. Где причина?" }
    }} />
);

// ===== 🏅 NISHONLAR (3, MD v3) — 2 ta ballik testga (birinchi urinish), 1 ta bonus (A3 oxirgi «Bajardim»; birinchi urinish sharti yo'q) =====
const ACHIEVEMENTS = {
  branchAware: { icon: '🔀', name: 'Branch Aware', desc: { uz: "Sayt main dan chiqishini, push PR'ga qo'shilishini bildingiz", ru: "Вы знаете, что сайт берётся из main, а push добавляется в PR" } },
  ownAnswer: { icon: '💬', name: 'Own Answer', desc: { uz: "Sababni kodda tekshirib, o'zingiz yozishni tanladingiz", ru: "Вы выбрали проверить причину в коде и написать её сами" } },
  merged: { icon: '🏁', name: 'Merged', desc: { uz: "PR'ni code review'dan keyin birlashtirdingiz", ru: "Вы объединили PR после code review" } },
};
// Ekran id → nishon (s3, s5 — ballik test, birinchi urinish; a3 — bonus)
const ACH_TRIGGERS = { s3: 'branchAware', s5: 'ownAnswer', a3: 'merged' };

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


// Podium savol yorliqlari (SCORED_IDX: 4 — 1-savol, 7 — 2-savol)
const Q_LABELS = {
  4: { uz: '1 — Sayt main dan', ru: "1 — Сайт из main" },
  7: { uz: '2 — Sabab sizdan', ru: "2 — Причина от вас" }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; GitHub yozuvi va kod-belgi o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: 'Pull Request', l: 5, t: 10, s: 26, d: 19, dl: 0 },
  { ch: 'code review', l: 76, t: 8, s: 24, d: 23, dl: 1.5 },
  { ch: 'main', l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'prod', l: 78, t: 66, s: 26, d: 21, dl: 2.2 },
  { ch: 'Files changed', l: 42, t: 86, s: 20, d: 25, dl: 1.1 },
  { ch: 'Merge pull request', l: 58, t: 24, s: 18, d: 17, dl: 0.4 },
  { ch: 'REVIEW.md', l: 22, t: 36, s: 20, d: 20, dl: 1.9 },
  { ch: '/ega', l: 18, t: 16, s: 24, d: 18, dl: 2.9 },
  { ch: 'Approve', l: 88, t: 44, s: 22, d: 22, dl: 0.6 },
  { ch: { uz: 'Joy', ru: "Место" }, l: 34, t: 58, s: 22, d: 24, dl: 1.4 },
  { ch: { uz: 'Nega muhim', ru: "Почему важно" }, l: 56, t: 12, s: 18, d: 26, dl: 2.5 },
  { ch: { uz: 'Taklif', ru: "Предложение" }, l: 4, t: 46, s: 20, d: 28, dl: 3.1 },
  { ch: 'Netlify', l: 30, t: 80, s: 20, d: 22, dl: 2.0 },
  { ch: 'Maydon', l: 90, t: 82, s: 22, d: 19, dl: 0.9 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD v3, aynan), to'g'ri javob o'rni A·B·C·D ×3
const QUIZ_BANK = [
  { q: { uz: 'Pull Request (PR) nima?', ru: "Что такое Pull Request (PR)?" }, opts: [{ uz: "O'zgarishni birlashtirishdan oldin ko'rsatish so'rovi", ru: "Запрос показать изменение до объединения" }, { uz: 'Kodni internetga chiqaradigan, terminaldagi buyruq', ru: "Команда в терминале, которая выводит код в интернет" }, { uz: "Asosiy repo'dan o'zingizga nusxa oladigan GitHub tugmasi", ru: "Кнопка GitHub, которая копирует основной репо себе" }, { uz: 'Sinfdosh kodning bir qatoriga yozgan bitta izohi', ru: "Один комментарий одноклассника к строке кода" }], correct: 0 },
  { q: { uz: 'Code review nima?', ru: "Что такое code review?" }, opts: [{ uz: "O'zgarishni main'ga birlashtirish tugmasi", ru: "Кнопка, которая объединяет изменение с main" }, { uz: "Boshqa odam kodni o'qib izoh yozishi", ru: "Другой человек читает код и пишет комментарий" }, { uz: "Agent kodni o'zi o'qib tuzatib qo'yishi", ru: "Агент сам читает и исправляет код" }, { uz: "Saytni telefonda ochib tekshirib ko'rish", ru: "Открыть сайт на телефоне и проверить" }], correct: 1 },
  { q: { uz: "Bu repo'da Netlify qaysi tarmoqdan (branch) yangilanadi?", ru: "Из какой ветки (branch) обновляется Netlify в этом репо?" }, opts: [{ uz: "prod'dan, har push qilinganda", ru: "Из prod, при каждом push" }, { uz: "Ochiq PR'ning o'zidan, har safar", ru: "Из самого открытого PR, каждый раз" }, { uz: "main'dan, PR birlashtirilgach", ru: "Из main, после объединения PR" }, { uz: 'Laptopdagi web/ papkasidan', ru: "Из папки web/ на ноутбуке" }], correct: 2 },
  { q: { uz: "PR ochiq. prod'ga yana push qildingiz. Nima bo'ladi?", ru: "PR открыт. Вы снова сделали push в prod. Что будет?" }, opts: [{ uz: 'Internetdagi sayt shu zahoti yangilanadi', ru: "Сайт в интернете сразу обновится" }, { uz: 'PR yopilib, o\'rniga yangisi ochiladi', ru: "PR закроется, вместо него откроется новый" }, { uz: 'Push rad etiladi, chunki PR ochiq', ru: "Push отклонят, потому что PR открыт" }, { uz: "Yangi commit PR'ning o'ziga qo'shiladi", ru: "Новый commit добавится в сам PR" }], correct: 3 },
  { q: { uz: 'Yaxshi izoh qaysi uch qismdan iborat?', ru: "Из каких трёх частей состоит хороший комментарий?" }, opts: [{ uz: 'Joy, nega muhim, taklif', ru: "Место, почему важно, предложение" }, { uz: "Ism, sana va qo'yilgan baho", ru: "Имя, дата и поставленная оценка" }, { uz: 'Fayl, tarmoq va commit nomi', ru: "Файл, ветка и название commit" }, { uz: 'Savol, javob va olingan ball', ru: "Вопрос, ответ и полученный балл" }], correct: 0 },
  { q: { uz: 'Qaysi izoh kodga qaratilgan?', ru: "Какой комментарий — про код?" }, opts: [{ uz: '«Siz bu yerni umuman o\'ylamasdan yozgansiz»', ru: "«Вы написали это совсем не подумав»" }, { uz: "«Ro'yxat yuklanguncha xabar yo'q, qo'shing»", ru: "«Пока список грузится, сообщения нет — добавьте»" }, { uz: "«Keyingi safar ancha e'tiborliroq bo'ling»", ru: "«В следующий раз будьте гораздо внимательнее»" }, { uz: '«Sizga bu mavzuni qaytadan o\'qish kerak»', ru: "«Вам нужно заново изучить эту тему»" }], correct: 1 },
  { q: { uz: 'Sinfdosh taklifiga rozi emassiz. Nima yozasiz?', ru: "Вы не согласны с предложением одноклассника. Что напишете?" }, opts: [{ uz: "«Yo'q» deb yozib, suhbatni yopib qo'yasiz", ru: "Напишете «нет» и закроете обсуждение" }, { uz: "Javobsiz qoldirib, PR'ni birlashtirasiz", ru: "Оставите без ответа и объедините PR" }, { uz: 'Sababni yozib, «qoldi» deb javob berasiz', ru: "Напишете причину и ответите «оставлено»" }, { uz: "Taklifni o'ylab ko'rmasdan qabul qilasiz", ru: "Примете предложение, не подумав" }], correct: 2 },
  { q: { uz: 'Kodni agent yozgan. Sinfdosh «Nega?» dedi. Nima qilasiz?', ru: "Код написал агент. Одноклассник спросил «Почему?». Что сделаете?" }, opts: [{ uz: '«Agent shunday yozgan» deb yozasiz', ru: "Напишете «так написал агент»" }, { uz: "Agent gapini tekshirmasdan qo'yasiz", ru: "Вставите слова агента без проверки" }, { uz: "Izohni javobsiz yopib qo'yasiz", ru: "Закроете комментарий без ответа" }, { uz: 'Kodni tekshirib, sababni yozasiz', ru: "Проверите код и напишете причину" }], correct: 3 },
  { q: { uz: 'PR tavsifidagi «Sabab» bo\'limini kim yozadi?', ru: "Кто пишет раздел «Причина» в описании PR?" }, opts: [{ uz: "Kod muallifi, o'zingiz", ru: "Автор кода, вы сами" }, { uz: 'Agent, kod farqiga qarab', ru: "Агент, по разнице кода" }, { uz: 'Izoh yozadigan sinfdosh', ru: "Одноклассник, который пишет комментарий" }, { uz: "GitHub o'zi, avtomatik", ru: "Сам GitHub, автоматически" }], correct: 0 },
  { q: { uz: 'Izohlar «Submit review»dan oldin kimga ko\'rinadi?', ru: "Кому видны комментарии до «Submit review»?" }, opts: [{ uz: "Faqat PR'ni ochgan muallifga", ru: "Только автору, открывшему PR" }, { uz: 'Faqat izohni yozgan odamga', ru: "Только тому, кто написал комментарий" }, { uz: "Repo'ni ochgan har qanday odamga", ru: "Любому, кто открыл репо" }, { uz: 'Mentor va PR muallifiga', ru: "Ментору и автору PR" }], correct: 1 },
  { q: { uz: "Maydon PR'ida nega B varianti qoldi?", ru: "Почему в PR «Maydon» остался вариант B?" }, opts: [{ uz: "B tugmasining matni chiroyliroq ko'rindi", ru: "Текст кнопки B выглядел красивее" }, { uz: 'Sinfdoshlar B ni ko\'proq maqtab yozdi', ru: "Одноклассники больше хвалили B" }, { uz: 'Hozircha B foizi yuqoriroq chiqdi', ru: "Пока у B процент вышел выше" }, { uz: "A ni Netlify ko'rsatmay qo'ygan edi", ru: "Netlify перестал показывать A" }], correct: 2 },
  { q: { uz: 'Kamchilik tuzatildi, sinfdosh «Approve» berdi. Keyin-chi?', ru: "Недочёт исправлен, одноклассник поставил «Approve». Дальше?" }, opts: [{ uz: "PR'ni yopib, o'rniga yangisini ochasiz", ru: "Закроете PR и откроете новый" }, { uz: "main'ga kodni qo'lda ko'chirib qo'yasiz", ru: "Скопируете код в main вручную" }, { uz: "prod'ni o'chirib, kodni qaytadan yozasiz", ru: "Удалите prod и напишете код заново" }, { uz: "PR'ni birlashtirib, saytni tekshirasiz", ru: "Объедините PR и проверите сайт" }], correct: 3 }
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
// steps [{ h, t (matn yoki satrlar ro'yxati), prompt?: [satr], kimga?, err?, yordam?: [satr], forma?: true }] · natija · ortda (tayanch 3 buyruqlari).
// Blok 5 qadam (9-Modul naqshi): 5-qadam «O'z g'oyangiz» — uch qatorli forma (qolipda forma turi yo'q — shu ulagichda, GoyaForma; maydonlari blokka qarab):
//   qiymat answers[ekran].goya da (ccProgress), «Nusxalash» bor, «Bajardim» uchala qator yozilgach ochiladi (JS qulf + CSS :has).
// «Yordam» (namuna talab / izoh / javob) qolipdagi QPrompt'da yo'q — QBlok qadamining izoh-qatori joyida, bosilsa ochiladi.
// «Ortda qoldingizmi» — MD: accent ogohlantirish «faqat mentor bilan (-f …)», keyin buyruqlar: ogohlantirish ortda ro'yxatining birinchi bandi (pr-ortda-ogoh), qolip yorlig'i uning o'rniga yashirinadi.
const TALAB_QISMLAR = [
  { id: 'qayerda', qism: { uz: 'Qayerda', ru: "Где" } },
  { id: 'nima', qism: { uz: 'Nima qilsin', ru: "Что сделать" } },
  { id: 'buzilmasin', qism: { uz: 'Nima buzilmasin', ru: "Что не сломать" } }
];
const A1_GOYA = [
  { id: 'nima', qism: { uz: "Nima o'zgardi", ru: "Что изменилось" } },
  { id: 'sabab', qism: QISM.sabab },
  { id: 'tekshir', qism: { uz: 'Qanday tekshirdim', ru: "Как я проверил" } }
];
const A2_GOYA = [
  { id: 'savol', qism: { uz: 'Savol', ru: 'Вопрос' } },
  { id: 'sabab', qism: QISM.sabab },
  { id: 'qaror', qism: { uz: 'Qaror', ru: "Решение" } }
];
const GoyaForma = ({ qismlar, qiymat, onYoz, tola }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => {
    try { await navigator.clipboard.writeText(qismlar.map(q => `${tr(q.qism)}: ${String(qiymat[q.id] || '').trim()}`).join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="pr-goya" data-tola={tola ? '1' : '0'}>
      {qismlar.map(q => (
        <label key={q.id} className="pr-goya-q">
          <span className="pr-goya-l">{tr(q.qism)}:</span>
          <textarea rows={1} value={qiymat[q.id] || ''} placeholder="…" onChange={e => onYoz(q.id, e.target.value)} />
        </label>
      ))}
      <QTugma ikkinchi disabled={!tola} onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: "✓ Скопировано" }) : tr({ uz: 'Nusxalash', ru: "Скопировать" })}</QTugma>
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  useEffect(() => { // ochilgan namuna va «Bajardim» bir ko'rinishda qolsin
    if (!ochiq) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 80);
    return () => clearTimeout(t);
  }, [ochiq]);
  return (
    <>
      <QTugma ikkinchi className="pr-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="pr-yordam fade-step">{satrlar.map((l, i) => <span key={i} className="pr-yordam-s">{fmtCode(tr(l))}</span>)}</span>}
    </>
  );
};
// Qadam matni: `kod` — chip, **…** — qalin (MD dagi ajratish: «**Sabab** va **Qaror**»)
const fmtMatn = (s) => ((typeof s === 'string' && s.includes('**'))
  ? s.split('**').map((p, i) => (i % 2 ? <b key={i}>{p}</b> : <React.Fragment key={i}>{fmtCode(p)}</React.Fragment>))
  : fmtCode(s));
const qadamMatn = (t) => (Array.isArray(t) ? t.map((l, i) => <span key={i} className="pr-satr">{fmtMatn(tr(l))}</span>) : fmtMatn(tr(t)));
const KIMGA = {
  agent: { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' },
  tavsif: { uz: 'Shablon → PR tavsifi', ru: "Шаблон → описание PR" },
  izoh: { uz: 'Siz → GitHub izohi', ru: "Вы → комментарий GitHub" },
  review: { uz: 'Shablon → REVIEW.md', ru: "Шаблон → REVIEW.md" }
};
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, goya = TALAB_QISMLAR, natija, natijaYorliq, ortda = [], doneText }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const bosh = Object.fromEntries(goya.map(q => [q.id, '']));
  const [qiymat, setQiymat] = useState(() => ({ ...bosh, ...((storedAnswer && storedAnswer.goya) || {}) }));
  const formaN = steps.findIndex(c => c.forma);
  const tola = goya.every(q => String(qiymat[q.id] || '').trim());
  const done = stepN >= steps.length;
  const goyaYoz = (id, v) => { const g = { ...qiymat, [id]: v }; setQiymat(g); if (!avval) onAnswer(screen, { ...(storedAnswer || {}), goya: g }); };
  const bajardim = () => {
    if (isMentorLive || done) return;
    if (stepN === formaN && !tola) return; // 5-qadam: uchala qator yozilmaguncha «Bajardim» yopiq
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, goya: qiymat });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  // Yangi ochilgan qadam (uzun prompt, 5-qadam formasi) «Bajardim»i bilan birga ko'rinsin — kompyuterda ham (telefonda Stage o'zi suradi)
  const birinchiRef = useRef(true);
  useEffect(() => {
    if (birinchiRef.current) { birinchiRef.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: c.forma ? <>{qadamMatn(c.t)}<GoyaForma qismlar={goya} qiymat={qiymat} onYoz={goyaYoz} tola={tola} /></> : qadamMatn(c.t),
          prompt: c.prompt && c.prompt.map(l => tr(l)),
          kimga: c.prompt && tr(c.kimga || KIMGA.agent),
          xato: c.yordam ? <Yordam satrlar={c.yordam} /> : (c.err && fmtCode(tr(c.err)))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortda}
        pastki={<MentorPracticeStats live={_live} screen={screen} />} />
    </Stage>
  );
}

// Kutilgan natija maketlari — bitta manbadan (PrMaket, Suhbat, EgaSahifa): chizilgan, logotipsiz
// A1: «Conversation» — PR tavsifi uch bo'limi navbat bilan chiqadi
const NatijaA1 = () => (
  <PrMaket korinish="suhbat" ixcham className="pr-natija">
    <div className="pr-tavsif">
      {PR_NAMUNA.tavsif.map((bl, i) => (
        <div key={i} className="pr-tv-b">
          <b className="pr-tv-h" style={{ '--d': (0.2 + i * 0.35) + 's' }}>{tr(bl.h)}</b>
          {bl.q.map((q, j) => <span key={j} className="pr-tv-q" style={{ '--d': (0.28 + i * 0.35 + j * 0.08) + 's' }}>{tr(q)}</span>)}
        </div>
      ))}
    </div>
  </PrMaket>
);
// A2: «Files changed» — tepada sinfdoshning review'i (Comment), uch izoh-suhbat; javoblar navbat bilan
const NatijaA2 = () => (
  <PrMaket korinish="fayllar" ixcham meta={false} className="pr-natija" tabOng={<span className="pr-review"><i className="pr-ava" aria-hidden="true" />{tr(KIM.sinfdosh)} · review<b>Comment</b></span>}>
    <div className="pr-suhbatlar">{IZOHLAR.map((iz, i) => <Suhbat key={i} iz={iz} i={i} toliq javob navbat />)}</div>
  </PrMaket>
);
// A3: «Merged» · ega sahifasi (yuklanmoqda → ro'yxat yashil) · REVIEW.md fayl-kartasi (IZOHLAR.review dan)
const ReviewFayl = () => (
  <div className="pr-rv">
    <div className="pr-fayl-h"><code>REVIEW.md</code></div>
    <div className="pr-rv-ich">
      <b className="pr-rv-sar"># REVIEW — Maydon · PR #1 (prod → main)</b>
      <span className="pr-rv-kim">{tr({ uz: "Ko'rib chiqdi: sinfdosh", ru: "Проверил: одноклассник" })}</span>
      {IZOHLAR.map((iz, i) => (
        <div key={i} className="pr-rv-q" style={{ '--d': (0.3 + i * 0.15) + 's' }}>
          <span className="pr-rv-n">{i + 1}</span>
          <span className="pr-rv-m"><span className="pr-rv-j"><code>{tr(iz.review.joy)}</code><QarorBelgi q={iz.review.qaror} yalang /></span><span className="pr-rv-iz" title={tr(iz.review.izoh)}>{tr(iz.review.izoh)}</span><span className="pr-rv-s" title={tr(iz.review.sabab)}>{tr(iz.review.sabab)}</span></span>
        </div>
      ))}
    </div>
  </div>
);
const NatijaA3 = () => {
  const kam = useKamHarakat();
  const [h, setH] = useState(kam ? 'yangi' : 'yuklanmoqda');
  useEffect(() => { if (kam) return undefined; const t = setTimeout(() => setH('yangi'), 1900); return () => clearTimeout(t); }, [kam]);
  return (
    <div className="pr-natija-a3">
      <PrMaket holat="Merged" korinish="suhbat" ixcham className="pr-natija" />
      <div className="pr-a3-past">
        <EgaSahifa holat={h} />
        <ReviewFayl />
      </div>
    </div>
  );
};
const ORTDA_FETCH = 'git fetch https://github.com/Azizbekcrypto/maydon --tags';
const ORTDA_PUSH = 'git push -f -u origin prod';
const OrtdaOgoh = () => <span className="pr-ortda-ogoh">{tr({ uz: <>Ortda qoldingizmi — <b>faqat mentor bilan</b> (<code className="qcode">-f</code> <code className="qcode">prod</code> dagi commitlaringizni o'chiradi):</>, ru: <>Отстали — <b>только вместе с ментором</b> (<code className="qcode">-f</code> удалит ваши commit в <code className="qcode">prod</code>):</> })}</span>;
const OrtdaIzoh = ({ t }) => <span className="pr-ortda-izoh">{fmtCode(tr(t))}</span>;
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon', ru: "ожидаемый результат · образец: Maydon" };
const XATO_YOLI = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
const QADAM_GOYA = { uz: "O'z g'oyangiz", ru: "Ваша идея" };
const A3_JOY = TALAB_QISMLAR.map(q => ({ uz: `${q.qism.uz}: {${q.qism.uz.toLowerCase()}}`, ru: `${q.qism.ru}: {${q.qism.ru.toLowerCase()}}` }));

const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · Pull Request', ru: "Практика 1 · Pull Request" }} goya={A1_GOYA}
    title={{ uz: <>PR oching: har o'zgarish yonida <span className="italic" style={{ color: T.accent }}>sababi tursin</span>.</>, ru: <>Откройте PR: <span className="italic" style={{ color: T.accent }}>у каждого изменения — причина</span>.</> }}
    mentor={{ uz: <>Nima o'zgarganini agent kod farqidan o'qiy oladi, nega — faqat siz bilasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Что изменилось, агент прочитает из разницы кода, а почему — знаете только вы; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: [
        { uz: "Antigravity'da `maydon` papkasini oching. Terminalda: `git checkout prod` (`git branch` — `* prod`), keyin `git push -u origin prod` — `prod` GitHub'dagi repo'ngizda ham bo'lsin.", ru: "Откройте папку `maydon` в Antigravity. В терминале: `git checkout prod` (`git branch` — `* prod`), затем `git push -u origin prod` — пусть `prod` будет и в вашем репо на GitHub." },
        { uz: "Brauzerda o'z repo'ngizni oching (`github.com/{login}/maydon`) → «Pull requests» → «New pull request».", ru: "Откройте свой репо в браузере (`github.com/{login}/maydon`) → «Pull requests» → «New pull request»." },
        { uz: "Repo fork bo'lgani uchun «base repository» asosiy repo'ni (`Azizbekcrypto/maydon`) ko'rsatadi — uni o'z repo'ngizga almashtiring. Keyin base: `main`, compare: `prod`.", ru: "Репо — это fork, поэтому «base repository» показывает основной репо (`Azizbekcrypto/maydon`) — замените его на свой. Затем base: `main`, compare: `prod`." },
        { uz: "Pastda o'zgargan fayllar chiqadi.", ru: "Ниже появятся изменённые файлы." }
      ] },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "talabning uch qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: "напишите три строки требования сами, нажмите «Скопировать», отправьте в Antigravity:" }, prompt: A3_JOY, yordam: [
        { uz: 'Qayerda: `main` va `prod` tarmoqlari farqi (`git diff main...prod`).', ru: "Где: разница веток `main` и `prod` (`git diff main...prod`)." },
        { uz: "Nima qilsin: har o'zgarish uchun bitta qator yozsin — nima o'zgardi va qaysi faylda. Sababini yozmasin.", ru: "Что сделать: на каждое изменение одна строка — что изменилось и в каком файле. Причину не писать." },
        { uz: "Nima buzilmasin: hech qaysi faylni o'zgartirma, commit qilma — ro'yxatni faqat menga yoz.", ru: "Что не сломать: не меняй ни одного файла, не делай commit — список напиши только мне." }
      ] },
      { h: { uz: 'Solishtirish', ru: "Сравнение" }, t: [
        { uz: "agent ro'yxatini GitHub'dagi o'zgargan fayllar bilan solishtiring: har qator kodda bormi, tushib qolgan fayl yo'qmi. Kodda yo'q qatorni o'chiring.", ru: "сравните список агента с изменёнными файлами на GitHub: есть ли каждая строка в коде, не пропущен ли файл. Строку, которой нет в коде, удалите." },
        { uz: "Keyin «Sabab» va «Qanday tekshirdim» bo'limlarini o'zingiz yozing. Agentdan sabab so'rasangiz, uning gapini kod bilan solishtiring: faqat o'zingiz tekshirgan sababni yozasiz.", ru: "Затем разделы «Причина» и «Как я проверил» напишите сами. Если спросите причину у агента, сверьте его слова с кодом: пишете только проверенную вами причину." }
      ], kimga: KIMGA.tavsif, prompt: [
        { uz: "## Nima o'zgardi", ru: "## Что изменилось" },
        { uz: "- {o'zgarish} — {fayl}", ru: "- {изменение} — {файл}" },
        { uz: '## Sabab', ru: "## Причина" },
        { uz: "- {o'zgarish}: {nega shunday qildingiz}", ru: "- {изменение}: {почему вы так сделали}" },
        { uz: '## Qanday tekshirdim', ru: "## Как я проверил" },
        { uz: "- {nima qildingiz va nima ko'rdingiz}", ru: "- {что сделали и что увидели}" }
      ] },
      { h: { uz: 'PR ochish', ru: "Открыть PR" }, t: [
        { uz: "«Create pull request» → sarlavha (masalan: `Prod ro'yxati: chegara, xato holatlari, A/B yakuni`) → tavsifga shablonni qo'ying → yana «Create pull request».", ru: "«Create pull request» → заголовок (например: `Прод-список: лимит, состояния ошибок, итог A/B`) → вставьте шаблон в описание → снова «Create pull request»." },
        { uz: "PR havolasini sinfdoshingizga Telegram'da yuboring. PR ostida Netlify'ning «Deploy Preview» qatori chiqishi mumkin — bu alohida manzil, bugun kerak emas.", ru: "Отправьте ссылку на PR однокласснику в Telegram. Под PR может появиться строка Netlify «Deploy Preview» — это отдельный адрес, сегодня он не нужен." }
      ], err: { uz: "PR `Azizbekcrypto/maydon` da ochilib qolsa — uni «Close pull request» bilan yoping va 1-qadamdagi «base repository»ni qayta tanlang.", ru: "Если PR открылся в `Azizbekcrypto/maydon` — закройте его через «Close pull request» и заново выберите «base repository» из шага 1." } },
      { h: QADAM_GOYA, t: { uz: "shu tavsifni o'tgan darsda tanlagan eng yaxshi loyihangiz uchun yozing: unda nima o'zgardi va nega? Uch qatorni to'ldiring.", ru: "напишите это описание для лучшего проекта, выбранного на прошлом уроке: что в нём изменилось и почему? Заполните три строки." }, forma: true }
    ]}
    natija={<NatijaA1 />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[<OrtdaOgoh key="o" />, ORTDA_FETCH, 'git checkout -f -B prod m10-dars-09-start', ORTDA_PUSH]}
    doneText={{ uz: 'PR ochildi: har o\'zgarish yonida sababi bor, havola sinfdoshingizda.', ru: "PR открыт: рядом с каждым изменением есть причина, ссылка у одноклассника." }} />
);

const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · code review', ru: "Практика 2 · code review" }} goya={A2_GOYA}
    title={{ uz: <>Sinfdosh PR'ini o'qing, <span className="italic" style={{ color: T.accent }}>o'zingiznikiga javob bering</span>.</>, ru: <>Прочитайте PR одноклассника, <span className="italic" style={{ color: T.accent }}>ответьте в своём</span>.</> }}
    mentor={{ uz: <>Juftlikda ikki PR bor: birini siz o'qiysiz, ikkinchisiga siz javob berasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>В паре два PR: один читаете вы, на второй отвечаете вы; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: [
        { uz: "sinfdoshingiz yuborgan PR havolasini oching → «Files changed». Har faylni oxirigacha o'qing, o'qib bo'lgan faylga «Viewed» belgisini qo'ying.", ru: "откройте ссылку на PR от одноклассника → «Files changed». Читайте каждый файл до конца, прочитанный отмечайте «Viewed»." },
        { uz: "Uch savol bilan o'qing: tavsifdagi sabab kodga mosmi? Xato bo'lsa, o'yinchi yoki ega nimani ko'radi? Maxfiy kalit (`JWT_SECRET`, `EGA_PAROLI`, `EGA_2FA_KALITI`) kodda ochiq turibdimi?", ru: "Читайте с тремя вопросами: совпадает ли причина из описания с кодом? Что увидит игрок или владелец при ошибке? Не лежит ли секретный ключ (`JWT_SECRET`, `EGA_PAROLI`, `EGA_2FA_KALITI`) открыто в коде?" }
      ] },
      { h: { uz: 'Izoh', ru: "Комментарий" }, t: [
        { uz: "kamida ikkita izoh yozing: savol, taklif yoki haqiqiy kamchilik bo'lishi mumkin — kamchilik bo'lmasa, uni o'ylab topmang. Qator yonidagi ko'k «+» belgisini bosing va izohning uch qatorini yozing (bu darsdagi qolip; savol bo'lsa — «Taklif» o'rniga savolingiz).", ru: "напишите минимум два комментария: это может быть вопрос, предложение или настоящий недостаток — если недостатка нет, не выдумывайте его. Нажмите синий «+» у строки и напишите три строки комментария (шаблон этого урока; если вопрос — вместо «Предложение» ваш вопрос)." },
        { uz: 'Birinchi izohdan keyin «Start a review», keyingisida «Add review comment».', ru: "После первого комментария — «Start a review», для следующих — «Add review comment»." }
      ], kimga: KIMGA.izoh, prompt: [
        { uz: 'Joy: {qaysi qator}', ru: "Место: {какая строка}" },
        { uz: 'Nega muhim: {bu kimga va nima xalaqit beradi}', ru: "Почему важно: {кому и чему это мешает}" },
        { uz: 'Taklif: {nima qilish kerak}', ru: "Предложение: {что нужно сделать}" }
      ], yordam: [
        { uz: "Joy: `/ega` dagi bandlar ro'yxati (`web/src/Ega.jsx`).", ru: "Место: список броней на `/ega` (`web/src/Ega.jsx`)." },
        { uz: "Nega muhim: Backend kechiksa, ro'yxat joyi bo'sh turadi — ega «band yo'q» deb o'ylashi mumkin.", ru: "Почему важно: если Backend задержится, место списка пустует — владелец может решить, что броней нет." },
        { uz: "Taklif: o'yinchi sahifasidagi «yuklanmoqda» holatini bu yerga ham qo'shing.", ru: "Предложение: добавьте сюда состояние загрузки со страницы игрока." }
      ] },
      { h: { uz: 'Yuborish', ru: "Отправка" }, t: { uz: '«Review changes» → bitta umumiy gap yozing → «Comment» → «Submit review». Izohlaringiz sinfdoshingizga shundan keyin ko\'rinadi.', ru: "«Review changes» → напишите одну общую фразу → «Comment» → «Submit review». Только после этого однокласснику видны ваши комментарии." } },
      { h: { uz: 'Javob', ru: "Ответ" }, t: [
        { uz: "o'z PR'ingizga qayting: sinfdoshingizning har izohi ostiga javob yozing — **Sabab** va **Qaror** (qoldi yoki tuzataman). Tuzatish kerak bo'lgan kamchilik topilgan bo'lsa — 3-amaliyotda uni tuzatasiz; topilmagan bo'lsa — Mentor bergan kamchilikni (`/ega` yuklanish holati) tuzatasiz.", ru: "вернитесь в свой PR: под каждым комментарием одноклассника напишите ответ — **Причина** и **Решение** (оставлено или исправлю). Если найден недостаток, который надо исправить, — исправите его в практике 3; если нет — исправите недостаток от Ментора (состояние загрузки `/ega`)." },
        { uz: "Sababini bilmasangiz — kodni o'qing; agentdan so'rasangiz, uning gapini kod bilan solishtiring. «Agent shunday yozgan» — javob emas.", ru: "Не знаете причину — читайте код; если спросите агента, сверьте его слова с кодом. «Так написал агент» — не ответ." }
      ], yordam: [
        { uz: "Sabab: so'rovni saytsiz ham, to'g'ridan Backend'ga yuborsa bo'ladi; chegara Backend'da tursa, Backend'ga kelgan har so'rovga ishlaydi. Qaror: qoldi.", ru: "Причина: запрос можно отправить и без сайта, прямо в Backend; лимит в Backend работает для каждого пришедшего к нему запроса. Решение: оставлено." },
        { uz: "Sabab: tekshirdim, shunday — holat faqat o'yinchi sahifasiga qo'shilgan edi. Qaror: tuzataman.", ru: "Причина: проверил, так и есть — состояние было добавлено только на страницу игрока. Решение: исправлю." }
      ] },
      { h: QADAM_GOYA, t: { uz: "eng yaxshi loyihangizda sinfdosh qaysi qaroringizni so'rashi mumkin? Uch qatorni yozing.", ru: "о каком вашем решении в лучшем проекте может спросить одноклассник? Напишите три строки." }, forma: true }
    ]}
    natija={<NatijaA2 />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[<OrtdaOgoh key="o" />, ORTDA_FETCH, 'git checkout -f -B prod m10-dars-09-start', ORTDA_PUSH, <OrtdaIzoh key="i" t={{ uz: "(PR'ni mentor bilan ochasiz)", ru: "(PR откроете вместе с ментором)" }} />]}
    doneText={{ uz: 'Review yuborildi, har izohga sabab bilan javob berildi.', ru: "Review отправлен, на каждый комментарий дан ответ с причиной." }} />
);

const ScreenA3 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 3 · tuzatish va «Merge»', ru: "Практика 3 · исправление и «Merge»" }} goya={TALAB_QISMLAR}
    title={{ uz: <>Kamchilikni tuzating, keyin <span className="italic" style={{ color: T.accent }}>PR'ni birlashtiring</span>.</>, ru: <>Исправьте недостаток, затем <span className="italic" style={{ color: T.accent }}>объедините PR</span>.</> }}
    mentor={{ uz: <>Tuzatish ham <code className="qcode">prod</code> ga push qilinadi — PR o'zi yangilanadi; <b style={{ color: T.ink }}>«1 · Talab»</b>dan boshlang.</>, ru: <>Исправление тоже идёт в <code className="qcode">prod</code> через push — PR обновится сам; начните с <b style={{ color: T.ink }}>«1 · Требование»</b>.</> }}
    steps={[
      { h: { uz: 'Talab', ru: "Требование" }, t: { uz: "«tuzataman» degan izoh uchun talabning uch qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: "для комментария с ответом «исправлю» напишите три строки требования сами, нажмите «Скопировать», отправьте в Antigravity:" }, prompt: A3_JOY, yordam: [
        { uz: "Qayerda: `/ega` sahifasidagi bandlar ro'yxati (`web/src/Ega.jsx`).", ru: "Где: список броней на странице `/ega` (`web/src/Ega.jsx`)." },
        { uz: "Nima qilsin: ro'yxat 5 soniyada kelmasa yoki so'rov o'tmasa, «Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» chiqsin. So'rov o'tmasa — 5 soniyadan keyin qayta so'rasin; oldingi so'rov tugamasdan yangisi ketmasin. Bir daqiqadan keyin ham bo'lmasa — «Bandlarni yuklab bo'lmadi» va «Qayta urinish» tugmasi. O'yinchi sahifasidagi qayta so'rash kodini qayta ishlat.", ru: "Что сделать: если список не пришёл за 5 секунд или запрос не прошёл, пусть появится «Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.». Если запрос не прошёл — спросить снова через 5 секунд; новый не отправлять, пока не закончился прежний. Если и через минуту не вышло — «Bandlarni yuklab bo'lmadi» и кнопка «Qayta urinish». Используй код повторного запроса со страницы игрока." },
        { uz: "Nima buzilmasin: parol va kod bilan kirish, `401` da parol formasi qaytishi, o'yinchi sahifasi. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: "Что не сломать: вход по паролю и коду, возврат формы пароля при `401`, страницу игрока. Больше ничего не трогай, скажи, какие файлы изменились." }
      ] },
      { h: { uz: 'Tekshirish', ru: "Проверка" }, t: [
        { uz: 'agentning hisobotiga emas, haqiqiy o\'zgarishga qarang: `git diff` — faqat `web/src/Ega.jsx` o\'zgarganmi.', ru: "смотрите не на отчёт агента, а на реальное изменение: `git diff` — изменился ли только `web/src/Ega.jsx`." },
        { uz: "Keyin `localhost:5173/ega` ga kiring. Backend terminalida Ctrl+C bilan uni to'xtating va kunni almashtiring («›»): «Bandlar yuklanmoqda…» chiqadi.", ru: "Затем зайдите на `localhost:5173/ega`. Остановите Backend в его терминале через Ctrl+C и переключите день («›»): появится «Bandlar yuklanmoqda…»." },
        { uz: "Bu tekshiruvda Backend umuman javob bermaydi; sekin javob holati o'tgan darsdagi sahnada ko'rilgan.", ru: "В этой проверке Backend вообще не отвечает; медленный ответ мы видели в сцене прошлого урока." },
        { uz: "Shu daqiqa ichida Backend'ni qayta yoqing (`npm run start:dev`) — sahifani yangilamasangiz ham ro'yxat o'zi chiqadi.", ru: "В течение этой минуты снова запустите Backend (`npm run start:dev`) — список появится сам, даже без обновления страницы." }
      ], err: XATO_YOLI },
      { h: { uz: 'Push', ru: "Push" }, t: [
        { uz: "repo ildizida `REVIEW.md` yarating (shablon) va izoh-javoblarni yozing. Keyin `git status` — o'zgargan fayllar: agent aytgan ro'yxat va `REVIEW.md`; shularni `git add` bilan qo'shing, `git commit -m \"review: /ega yuklanish holati, REVIEW.md\"`, `git push` — yangi commit PR'da ko'rinadi.", ru: "в корне репо создайте `REVIEW.md` (шаблон) и запишите комментарии и ответы. Затем `git status` — изменённые файлы: список агента и `REVIEW.md`; добавьте их через `git add`, `git commit -m \"review: /ega yuklanish holati, REVIEW.md\"`, `git push` — новый commit появится в PR." },
        { uz: '«tuzataman» degan izoh ostiga «Tuzatildi» deb yozing.', ru: "Под комментарием с ответом «исправлю» напишите «Исправлено»." }
      ], kimga: KIMGA.review, prompt: [
        { uz: '# REVIEW — {loyiha nomi} · PR #{raqam} (prod → main)', ru: "# REVIEW — {название проекта} · PR #{номер} (prod → main)" },
        { uz: "Ko'rib chiqdi: {sinfdoshingizning GitHub logini}", ru: "Проверил: {GitHub-логин одноклассника}" },
        { uz: '| № | Joy | Izoh | Sabab (nega shunday qildim) | Qaror |', ru: "| № | Место | Комментарий | Причина (почему я так сделал) | Решение |" },
        { uz: '|---|---|---|---|---|', ru: "|---|---|---|---|---|" },
        { uz: '| 1 | {fayl va qator} | {izoh} | {sabab} | qoldi / tuzatildi |', ru: "| 1 | {файл и строка} | {комментарий} | {причина} | оставлено / исправлено |" }
      ] },
      { h: { uz: 'Birlashtirish', ru: "Объединение" }, t: [
        { uz: "sinfdoshingiz yangi commitni ko'rib, «Review changes» → «Approve» → «Submit review» qiladi. Bu repo'da «Approve» birlashtirish uchun shart emas — u tuzatishni qayta ko'rganining belgisi.", ru: "одноклассник смотрит новый commit и делает «Review changes» → «Approve» → «Submit review». В этом репо «Approve» для объединения не обязателен — это знак, что исправление просмотрено ещё раз." },
        { uz: "Sinfdosh ulgurmasa yoki GitHub ochilmasa — mentor ko'rib, «ko'rdim» izohini qoldiradi. Siz suhbatlarni «Resolve conversation» bilan yopasiz.", ru: "Если одноклассник не успел или GitHub не открывается — ментор посмотрит и оставит комментарий «посмотрел». Обсуждения вы закрываете через «Resolve conversation»." },
        { uz: "Birlashtirishdan oldin «Files changed»ga qarang: Database jadvali fayli (`….entity.ts`) o'zgarmagan bo'lsin. O'zgargan bo'lsa — birlashtirmang, mentorga ayting.", ru: "Перед объединением посмотрите «Files changed»: файл таблицы Database (`….entity.ts`) не должен измениться. Если изменился — не объединяйте, скажите ментору." },
        { uz: "Keyin PR pastida «Merge pull request» → «Confirm merge». Render va Netlify `main` dan oladi — bir necha daqiqada internetdagi sayt yangilanadi.", ru: "Затем внизу PR «Merge pull request» → «Confirm merge». Render и Netlify берут из `main` — через несколько минут сайт в интернете обновится." },
        { uz: "Netlify manzilingizga `/ega` qo'shib oching va kiring — bandlar ro'yxati chiqadi. Bepul Backend uxlab qolgan bo'lsa, birinchi so'rov kechikishi mumkin — taxminan bir daqiqagacha.", ru: "Откройте свой адрес Netlify с `/ega` и войдите — появится список броней. Если бесплатный Backend уснул, первый запрос может задержаться — примерно до минуты." },
        { uz: "Netlify yoki Render yangilanmasa — tekshiruvni laptopda qiling, deploy'ni mentor bilan ko'rasiz.", ru: "Если Netlify или Render не обновились — проверьте на ноутбуке, деплой разберёте с ментором." }
      ] },
      { h: QADAM_GOYA, t: { uz: 'eng yaxshi loyihangizda code review topishi mumkin bo\'lgan bitta kamchilik uchun talab yozing. Uch qatorni to\'ldiring.', ru: "напишите требование для одного недостатка, который code review может найти в вашем лучшем проекте. Заполните три строки." }, forma: true }
    ]}
    natija={<NatijaA3 />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[<OrtdaOgoh key="o" />, ORTDA_FETCH, 'git checkout -f -B prod m10-dars-09-done', ORTDA_PUSH, <OrtdaIzoh key="i" t={{ uz: "(`REVIEW.md` ni o'z izohlaringiz bilan almashtiring; Render va Netlify o'zingizniki — o'tgan moduldagi deploy'dan)", ru: "(замените `REVIEW.md` своими комментариями; Render и Netlify — ваши, с деплоя в прошлом модуле)" }} />]}
    doneText={{ uz: "Kamchilik tuzatildi, PR birlashtirildi — ko'rib chiqilgan kod internetda.", ru: "Недостаток исправлен, PR объединён — проверенный код в интернете." }} />
);

// 🃏 KARTOCHKALAR (12, MD v3 aynan) — alohida ekran sflash (SABOQ 12), qolipdagi QKartochka (DE-204). Old va izoh — fmtCode; orqa — oddiy matn.
const KARTALAR = [
  { front: { uz: 'Pull Request (PR) nima?', ru: "Что такое Pull Request (PR)?" }, back: { uz: "O'zgarishni birlashtirishdan oldin ko'rsatish so'rovi", ru: "Запрос показать изменение до объединения" }, note: { uz: '«Maydon» da — `prod` dan `main` ga', ru: "В «Maydon» — из `prod` в `main`" } },
  { front: { uz: 'Code review nima?', ru: "Что такое code review?" }, back: { uz: "Boshqa odam kodni o'qib izoh yozishi", ru: "Другой человек читает код и пишет комментарий" }, note: { uz: "Izoh savol ham bo'lishi mumkin; har review kamchilik topmaydi", ru: "Комментарий может быть и вопросом; не каждый review находит недостаток" } },
  { front: { uz: 'Tarmoq (branch) nima?', ru: "Что такое ветка (branch)?" }, back: { uz: "Repo'dagi alohida yo'l: o'zgarishlar main ga tegmasdan shu yerda yig'iladi", ru: "Отдельный путь в репо: изменения собираются здесь, не трогая main" }, note: { uz: '«Maydon» da — `prod`; PR bilan `main` ga birlashtiriladi', ru: "В «Maydon» — `prod`; через PR объединяется с `main`" } },
  { front: { uz: 'PR ochiq turganda `prod` ga push qilsangiz nima bo\'ladi?', ru: "Что будет, если сделать push в `prod`, пока PR открыт?" }, back: { uz: "Yangi commit PR'ga qo'shiladi", ru: "Новый commit добавится в PR" }, note: { uz: "Internetdagi sayt `main` birlashtirilguncha o'zgarmaydi", ru: "Сайт в интернете не меняется, пока изменения не объединены с `main`" } },
  { front: { uz: 'Yaxshi izoh qaysi uch qismdan iborat?', ru: "Из каких трёх частей состоит хороший комментарий?" }, back: { uz: 'Joy, nega muhim, taklif', ru: "Место, почему важно, предложение" }, note: { uz: '«Bu yer yomon» da joy ham, sabab ham yo\'q', ru: "В «Здесь плохо» нет ни места, ни причины" } },
  { front: { uz: 'Izoh kimga qaratiladi?', ru: "На что направлен комментарий?" }, back: { uz: 'Kodga, odamga emas', ru: "На код, а не на человека" }, note: { uz: '«Siz o\'ylamay yozgansiz» o\'rniga — qator va sabab', ru: "Вместо «вы написали не подумав» — строка и причина" } },
  { front: { uz: 'Yaxshi javobda nima bo\'ladi?', ru: "Что есть в хорошем ответе?" }, back: { uz: 'Qaror sababi, kerak bo\'lsa — tuzatish', ru: "Причина решения, если нужно — исправление" }, note: { uz: 'Qaror: qoldi yoki tuzataman', ru: "Решение: оставлено или исправлю" } },
  { front: { uz: 'Taklifga rozi bo\'lmasangiz, nima yozasiz?', ru: "Если вы не согласны с предложением, что напишете?" }, back: { uz: 'Sababini', ru: "Причину" }, note: { uz: "Chegara Backend'da qoldi: so'rovni saytsiz ham yuborsa bo'ladi", ru: "Лимит остался в Backend: запрос можно отправить и без сайта" } },
  { front: { uz: 'Kodni agent yozgan. Sinfdosh «Nega?» desa-chi?', ru: "Код написал агент. А если одноклассник спросит «Почему?»?" }, back: { uz: 'Kodni tekshirib, sababni o\'zingiz yozasiz', ru: "Проверяете код и пишете причину сами" }, note: { uz: "Agentdan so'rasangiz ham, uning gapini kod bilan solishtirasiz", ru: "Даже если спросите агента, сверяете его слова с кодом" } },
  { front: { uz: 'PR tavsifining qaysi bo\'limini agent yozib bera olmaydi?', ru: "Какой раздел описания PR агент не может написать за вас?" }, back: { uz: '«Sabab» bo\'limini', ru: "Раздел «Причина»" }, note: { uz: "Nima o'zgarganini agent kod farqidan o'qiy oladi", ru: "Что изменилось, агент прочитает из разницы кода" } },
  { front: { uz: "Maydon PR'ida nega B qoldi?", ru: "Почему в PR «Maydon» остался B?" }, back: { uz: "B'da band qilganlar foizi yuqoriroq chiqdi", ru: "У B процент забронировавших вышел выше" }, note: { uz: 'Hozircha qoladi — isbot emas: 82 ta brauzer hali kam, raqam kuzatiladi', ru: "Пока остаётся — это не доказательство: 82 браузера ещё мало, за числом следим" } },
  { front: { uz: "PR'ni birlashtirish uchun nima bosiladi?", ru: "Что нажать, чтобы объединить PR?" }, back: { uz: '«Merge pull request», keyin «Confirm merge»', ru: "«Merge pull request», затем «Confirm merge»" }, note: { uz: 'Shundan keyin Render va Netlify `main` dan yangilanadi', ru: "После этого Render и Netlify обновляются из `main`" } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); ko'rsatma karta ostida, birinchi bosishgacha, karta yuzi halqada */}
        <div className={cxx('pr-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: fmtCode(tr(c.front)), back: tr(c.back), note: c.note && fmtCode(tr(c.note)) }))} />
          {!bosildi && <p className="pr-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: "Нажмите на карточку — откроется ответ" })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — qolipdan: QYakun (DE-204). CODE STRIKE va arena — jonli o'yin qatlami; uyga vazifa yo'q (P-058: loyiha kuni, ish repo'da) =====
const YAKUN_RECAP = [
  { uz: fmtCode("Bu repo'da `prod` dagi o'zgarish PR orqali birlashtirilgach internetga chiqadi."), ru: fmtCode('В этом репо изменение из `prod` выходит в интернет после объединения через PR.') },
  { uz: "Yaxshi izohda joy, nega muhimligi va taklif bor.", ru: "В хорошем комментарии есть место, почему это важно, и предложение." },
  { uz: 'Izoh odamga emas, kodga qaratiladi.', ru: "Комментарий направлен на код, а не на человека." },
  { uz: 'Javobda qaror sababi yoziladi, kerak bo\'lsa tuzatish ham.', ru: "В ответе пишется причина решения, если нужно — и исправление." },
  { uz: "Kodni agent yozgan bo'lsa ham, sababni kodda tekshirib, o'zingiz yozasiz.", ru: "Даже если код написал агент, причину вы проверяете в коде и пишете сами." }
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
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: "Итог" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Loyiha kuni tugadi', ru: "День проекта завершён" })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>PR birlashtirildi — har qaror <span className="italic" style={{ color: T.accent }}>sababi bilan yozilgan</span>.</>, ru: <>PR объединён — каждое решение <span className="italic" style={{ color: T.accent }}>записано с причиной</span>.</> })}
        cta={<>
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={YAKUN_RECAP.map(tr)}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      >
        <p className="pr-keyingi fade-up">{tr({ uz: <>Keyingi dars — <b>«Bir yilda nimalarni qurdingiz?»</b>: yil bo'yi qurgan loyihalaringizni vaqt chizig'iga qo'yasiz, «Maydon» — oxirgisi.</>, ru: <>Следующий урок — <b>«Что вы построили за год?»</b>: проекты за год вы разместите на линии времени, «Maydon» — последний.</> })}</p>
      </QYakun>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function ProdReviewLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, ScreenA1, Screen3, Screen4, ScreenA2, Screen5, ScreenA3, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === «Maydon» PR maketi — darsning o'z vizuali (pr-). Faqat qolip tokenlari (D3), emoji yo'q (D4), logotip yo'q === */
        @media (min-width: 861px) { .q-kirish .q-split { grid-template-columns: minmax(0,1.45fr) minmax(0,1fr); } .q-kirish .q-split > .q-col:last-child { justify-content: center; } .q-reja .q-split { grid-template-columns: minmax(0,1.5fr) minmax(0,1fr); } }
        .pr-sahna { position: relative; min-width: 0; }
        /* Uchuvchi nuqta / konvert / bo'lak (SABOQ 19) */
        .pr-uchar { position: absolute; z-index: 6; pointer-events: none; transform: translate(-50%, -50%); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; white-space: nowrap; padding: 4px 10px 4px 24px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.accent}; color: ${T.ink}; box-shadow: 0 10px 20px -8px rgba(${T.shadowBase},0.45); animation: pr-uch 800ms cubic-bezier(.45,0,.25,1) both; }
        .pr-uchar::before { content: ''; position: absolute; left: 7px; top: 50%; width: 11px; height: 8px; margin-top: -4px; border: 1.5px solid ${T.accent}; border-radius: 2px; }
        .pr-uchar::after { content: ''; position: absolute; left: 10px; top: 50%; width: 5px; height: 5px; margin-top: -5px; border-right: 1.5px solid ${T.accent}; border-bottom: 1.5px solid ${T.accent}; transform: rotate(45deg); }
        .pr-uchar.nuqta { padding: 0; width: 13px; height: 13px; border: 3px solid ${T.accent}; border-radius: 50%; background: ${T.paper}; box-shadow: 0 4px 10px -4px ${fon(T.accent, 0.6)}; }
        .pr-uchar.nuqta::before, .pr-uchar.nuqta::after { display: none; }
        .pr-uchar.nuqta.bolak { width: 54px; height: 16px; border-radius: 8px; border: 0; background: ${T.accent}; }
        @keyframes pr-uch { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.6); } 14% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 84% { opacity: 1; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.55); } }
        /* PR sahifasi (brauzer oynasi) */
        .pr-oyna { display: flex; flex-direction: column; min-width: 0; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; overflow: hidden; box-shadow: 0 14px 30px -20px rgba(${T.shadowBase},0.45); }
        .pr-bar { display: flex; align-items: center; gap: 6px; min-height: 34px; padding: 4px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .pr-bar > i { flex: none; width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; }
        .pr-manzil { flex: 1; min-width: 0; margin-left: 6px; padding: 3px 10px; border-radius: 8px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pr-bosh { display: flex; flex-direction: column; gap: 6px; padding: 11px 16px 0; border-bottom: 1px solid ${T.line}; }
        p.pr-sar { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14.5px,1.6vw,16.5px); line-height: 1.3; color: ${T.ink}; }
        .pr-sar-n { font-weight: 500; color: ${T.ink2}; }
        .pr-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .pr-holat { display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px 4px 9px; border-radius: 999px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: #fff; background: ${T.ok}; animation: pr-pop 0.45s cubic-bezier(.2,.9,.3,1.3) both; }
        .pr-holat.open { background: ${T.ok}; }
        .pr-holat.merged { background: ${T.accent}; box-shadow: 0 0 0 0 ${fon(T.accent, 0.5)}; animation: pr-pop 0.5s cubic-bezier(.2,.9,.3,1.3) both, pr-yon 1.1s ease-out 0.3s both; }
        .pr-holat i { width: 9px; height: 9px; border-radius: 50%; border: 2px solid #fff; }
        .pr-holat.merged i { background: #fff; }
        .pr-tarmoqlar { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: ${T.ink2}; }
        .pr-tarmoqlar code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; }
        .pr-tarmoqlar b { font-weight: 800; color: ${T.ink2}; }
        .pr-tablar { display: flex; align-items: center; gap: 18px; min-width: 0; }
        .pr-tab { white-space: nowrap; padding: 4px 2px 7px; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600; color: ${T.ink2}; border-bottom: 2px solid transparent; }
        .pr-tab.on { color: ${T.ink}; font-weight: 800; border-bottom-color: ${T.accent}; }
        .pr-tana { display: flex; flex-direction: column; gap: 10px; min-width: 0; padding: 10px 12px 12px; }
        .pr-oyna.ixcham .pr-bosh { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 12px; row-gap: 6px; padding: 10px 14px 0; }
        .pr-oyna.ixcham p.pr-sar { font-size: 14.5px; }
        .pr-oyna.ixcham .pr-tablar { flex-basis: 100%; }
        .pr-oyna.ixcham .pr-tana { padding: 8px 10px 10px; gap: 8px; }
        .pr-oyna.ixcham .pr-tab { padding: 4px 2px 6px; }
        .pr-oyna.ixcham .pr-fayl-h { padding: 4px 10px; }
        .pr-oyna.ixcham .pr-pufak-ich { padding: 5px 10px 6px; gap: 2px; }
        .pr-oyna.pr-natija { box-shadow: none; }
        /* «Files changed» — fayl va qatorlar (yashil «+»), izohli qator accent fonda */
        .pr-fayl { min-width: 0; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; overflow: hidden; transition: box-shadow 0.2s; }
        .pr-fayl.xira { box-shadow: 0 0 0 2px ${fon(T.ink2, 0.35)}; }
        .pr-fayl.xira .pr-diff { opacity: 0.55; }
        .pr-fayl-h { padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .pr-fayl-h code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink}; }
        .pr-diff { display: flex; flex-direction: column; padding: 4px 0 6px; transition: opacity 0.2s; }
        .pr-d { display: block; position: relative; padding: 2px 10px 2px 28px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; color: ${T.ink}; animation: pr-qator 0.4s ease-out both; animation-delay: var(--d, 0s); }
        .pr-d b { position: absolute; left: 11px; top: 2px; font-weight: 800; color: ${T.ok}; }
        .pr-d.qosh { background: ${T.okFon}; }
        .pr-d.ayir { background: ${T.errFon}; } .pr-d.ayir b { color: ${T.err}; }
        .pr-d.on { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.accent}; border-radius: 4px; margin: 1px 4px; }
        /* Izoh-suhbat: sinfdosh izohi, ostida muallif javobi; orasida ingichka chiziq chiziladi */
        .pr-ip { position: relative; display: flex; flex-direction: column; gap: 6px; margin: 4px 10px 6px 22px; min-width: 0; }
        .pr-ip.javobli::before { content: ''; position: absolute; left: 12px; top: 28px; bottom: 26px; width: 2px; border-radius: 1px; background: ${T.line}; transform-origin: top; animation: pr-chiz 0.5s ease-out both; }
        .pr-pufak { position: relative; display: flex; align-items: flex-start; gap: 9px; min-width: 0; }
        .pr-ava { flex: none; display: block; width: 26px; height: 26px; border-radius: 50%; background: ${T.line}; box-shadow: inset 0 0 0 2px ${T.paper}, 0 0 0 1px ${T.line}; }
        .pr-pufak.muallif .pr-ava, .pr-ava.muallif { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.paper}, 0 0 0 1px ${fon(T.accent, 0.35)}; }
        .pr-pufak-ich { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; padding: 6px 11px 7px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 4px 12px 12px 12px; box-shadow: 0 6px 14px -10px rgba(${T.shadowBase},0.4); }
        .pr-pufak.muallif .pr-pufak-ich { background: ${T.bg}; }
        .pr-pufak.javob .pr-pufak-ich { border-color: ${fon(T.accent, 0.3)}; }
        .pr-kim { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.04em; color: ${T.ink2}; }
        p.pr-pt { margin: 0; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; overflow-wrap: anywhere; }
        p.pr-pt b { font-weight: 800; }
        p.pr-pt .pr-qaror { margin: 0 0 0 4px; vertical-align: 1px; }
        p.pr-pt.qisqa { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pr-pufak.kir { animation: pr-kir 0.45s cubic-bezier(.2,.9,.3,1.1) both; animation-delay: var(--d, 0s); }
        .pr-javob-joy { display: flex; flex-direction: column; justify-content: center; gap: 7px; height: 52px; margin-left: 35px; padding: 0 12px; border: 1.5px dashed ${T.line}; border-radius: 4px 12px 12px 12px; }
        .pr-javob-joy i { display: block; width: 70%; height: 6px; border-radius: 3px; background: ${T.line}; }
        .pr-javob-joy i + i { width: 40%; }
        .pr-qaror { align-self: flex-start; display: inline-flex; align-items: center; gap: 4px; margin-top: 3px; padding: 2px 9px; border-radius: 999px; font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 700; white-space: nowrap; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink2}; }
        .pr-qaror.acc { background: ${T.accentSoft}; border-color: transparent; color: ${T.accent}; }
        .pr-qaror.ok { background: ${T.okFon}; border-color: transparent; color: ${T.ok}; }
        .pr-tuzatildi { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; color: ${T.ok}; animation: pr-tush 0.5s ease-out both; }
        /* Ixcham izoh-suhbat kartalari (reja, A2) */
        .pr-suhbatlar { display: flex; flex-direction: column; gap: 7px; }
        .pr-suhbat { display: flex; flex-direction: column; gap: 5px; padding: 6px 9px 7px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; animation: pr-kir 0.45s ease-out both; animation-delay: var(--d, 0s); }
        .pr-suhbat-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-width: 0; min-height: 22px; }
        .pr-suhbat-f { min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pr-javob-ix { flex: none; display: inline-flex; align-items: center; gap: 6px; animation: pr-kir 0.45s cubic-bezier(.2,.9,.3,1.1) both; }
        .pr-javob-ix .pr-ava { width: 20px; height: 20px; }
        .pr-javob-ix .pr-qaror { margin-top: 0; }
        .pr-suhbat.navbat .pr-javob-ix { animation-delay: calc(var(--d, 0s) + 0.55s); }
        .pr-suhbat-izoh { display: flex; align-items: flex-start; gap: 8px; min-width: 0; }
        .pr-suhbat-izoh .pr-ava { width: 22px; height: 22px; }
        .pr-suhbat-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; padding: 4px 10px; background: ${T.bg}; border-radius: 4px 10px 10px 10px; }
        .pr-suhbat-t p.pr-pt { font-size: 12.5px; line-height: 1.38; }
        .pr-natija .pr-suhbat-t p.pr-pt { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } /* kutilgan natija ixcham (SABOQ 29) — ⛶ da to'liq */
        .zoom-on .pr-natija .pr-suhbat-t p.pr-pt, .zoom-on .pr-rv-iz, .zoom-on .pr-rv-s, .zoom-on .pr-rv-m code { white-space: normal; }
        p.pr-repo { margin: 4px 0 0; font-size: 12px; color: ${T.ink2}; }
        p.pr-repo code { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        /* Ega sahifasi — telefon = sayt (≈172×272, kichraymaydi); manzil ramka ustida */
        .pr-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: none; min-width: 0; }
        .pr-telefon { position: relative; display: flex; flex-direction: column; width: 172px; height: 272px; padding: 8px 8px 10px; background: ${T.paper}; border: 2px solid ${T.ink}; border-radius: 22px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.35); overflow: hidden; }
        .pr-tel-bar { display: flex; align-items: center; justify-content: center; height: 22px; margin-bottom: 8px; padding: 0 6px; border-radius: 11px; background: ${T.bg}; }
        .pr-tel-bar code { min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: -0.02em; color: ${T.accent}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pr-tel-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 5px; padding: 0 3px; animation: pr-sahifa 0.45s ease-out both; }
        .pr-tel-sar { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .pr-kun { display: flex; align-items: center; justify-content: space-between; padding: 3px 8px; border: 1px solid ${T.line}; border-radius: 8px; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .pr-kun i { font-style: normal; font-weight: 800; color: ${T.ink2}; }
        .pr-kun-sar { margin-top: 2px; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pr-royxat { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 6px; padding: 6px; border: 1.5px solid transparent; border-radius: 10px; transition: border-color 0.3s, background 0.3s; }
        .pr-royxat[data-h="bosh"] { border: 1.5px dashed ${T.line}; }
        .pr-royxat[data-h="joy"] { border: 2px solid ${T.accent}; background: ${fon(T.accent, 0.05)}; animation: pr-yon 0.9s ease-out both; }
        .pr-royxat[data-h="xato"] { border: 2px dashed ${T.err}; background: ${fon(T.err, 0.05)}; }
        .pr-royxat[data-h="yuklanmoqda"] { border: 1.5px solid ${fon(T.accent, 0.45)}; }
        .pr-royxat[data-h="namuna"] { border: 1.5px dashed ${T.accent}; }
        .pr-band { display: grid; grid-template-columns: 40px minmax(0,1fr); grid-template-rows: auto auto; column-gap: 6px; row-gap: 4px; align-items: center; padding: 6px 8px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 8px; animation: pr-qator 0.4s ease-out both; animation-delay: var(--d, 0s); }
        .pr-band b { grid-row: 1 / 3; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; }
        .pr-band i { display: block; height: 5px; border-radius: 3px; background: ${T.line}; }
        .pr-band i + i { width: 60%; }
        .pr-royxat[data-h="yangi"] .pr-band { background: ${T.okFon}; border-color: ${fon(T.ok, 0.35)}; }
        .pr-royxat[data-h="yangi"] .pr-band b { color: ${T.ok}; }
        .pr-yuk { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 8px 2px; text-align: center; font-size: 12px; line-height: 1.4; font-weight: 600; color: ${T.accent}; animation: pr-kir 0.4s ease-out both; }
        .pr-royxat[data-h="namuna"] .pr-yuk { color: ${T.ink2}; }
        .pr-halqa { display: block; width: 22px; height: 22px; border-radius: 50%; border: 3px solid ${T.accentSoft}; border-top-color: ${T.accent}; animation: pr-aylan 1s linear infinite; }
        .pr-royxat[data-h="namuna"] .pr-halqa { animation: none; border-color: ${T.line}; border-top-color: ${T.ink2}; }
        .pr-soat { position: absolute; left: 50%; bottom: 8px; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; animation: pr-tush 0.45s ease-out both; }
        .pr-soat i { position: relative; width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid ${T.ink2}; }
        .pr-soat i::after { content: ''; position: absolute; left: 3.5px; top: 1px; width: 1.5px; height: 4px; background: ${T.ink2}; }
        /* Bashorat (181; SABOQ 11/19) va natija bloki (SABOQ 25) */
        .pr-bash .q-bashorat { border-color: ${T.accent}; animation: pr-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both, pr-puls 1.8s ease-out 0.7s infinite; }
        .pr-bash .q-chip { animation: pr-chip 0.38s ease-out both; }
        .pr-bash .q-chip:nth-child(1) { animation-delay: 0.22s; } .pr-bash .q-chip:nth-child(2) { animation-delay: 0.32s; } .pr-bash .q-chip:nth-child(3) { animation-delay: 0.42s; }
        .pr-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; transform-origin: top center; animation: pr-yig 0.42s cubic-bezier(.2,.9,.3,1.1) both; }
        .pr-taxmin-y { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .pr-taxmin-s { font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .pr-taxmin b { font-size: 14px; color: ${T.ink}; }
        .q-xulosa.pr-nb { display: flex; flex-direction: column; gap: 3px; padding: 10px 18px; font-size: 14.5px; line-height: 1.45; }
        .pr-nb-t { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .pr-nb-t b { color: ${T.ink}; } .pr-nb-t.ok { color: ${T.ok}; font-weight: 700; }
        .pr-nb-i { font-weight: 700; color: ${T.ink}; }
        .pr-navbat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: pr-puls 1.8s ease-out infinite; }
        /* 2-ekran: telefon CHAPDA, tarmoq chizmasi va ikki yo'l O'NGDA */
        .pr-s2, .pr-s4 { display: grid; grid-template-columns: 172px minmax(0,1fr); gap: 20px; align-items: start; }
        .pr-s2-ong { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .pr-tc { display: grid; grid-template-columns: 48px minmax(0,1fr) auto; align-items: center; column-gap: 12px; row-gap: 6px; padding: 14px 16px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; min-width: 0; }
        .pr-tc-n { justify-self: start; padding: 2px 7px; border-radius: 6px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pr-tc-chiziq { position: relative; display: flex; align-items: center; gap: 24px; height: 24px; padding-left: 6px; min-width: 0; }
        .pr-tc-chiziq::before { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 3px; margin-top: -1.5px; border-radius: 2px; background: ${T.line}; }
        .pr-tc-chiziq.prod::before { background: ${fon(T.accent, 0.3)}; }
        .pr-tc-chiziq.main::before { background: ${T.line}; height: 4px; margin-top: -2px; }
        .pr-nuqta { position: relative; z-index: 1; flex: none; display: block; width: 14px; height: 14px; border-radius: 50%; background: ${T.paper}; border: 3px solid ${T.ink2}; transition: opacity 0.3s; }
        .pr-nuqta.acc { border-color: ${T.accent}; }
        .pr-nuqta.ok { border-color: ${T.ok}; }
        .pr-nuqta.yangi { animation: pr-pop 0.45s cubic-bezier(.2,.9,.3,1.4) both; animation-delay: var(--d, 0s); }
        .pr-nuqta.merge { width: 18px; height: 18px; border-width: 4px; }
        .pr-nuqta.uchdi { opacity: 0.25; }
        .pr-nuqta em { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); font-style: normal; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; color: ${T.ok}; white-space: nowrap; }
        .pr-strelka { position: relative; z-index: 1; flex: none; margin-left: auto; width: 0; height: 0; border-top: 7px solid transparent; border-bottom: 7px solid transparent; border-left: 11px solid ${T.ink2}; }
        .pr-laptop { justify-self: start; display: inline-flex; align-items: center; gap: 8px; padding: 4px 11px; border-radius: 999px; background: ${T.accentSoft}; color: ${T.accent}; font-size: 12px; font-weight: 700; white-space: nowrap; transition: opacity 0.3s; }
        .pr-laptop i { position: relative; width: 15px; height: 10px; margin-bottom: 3px; border: 2px solid currentColor; border-radius: 2px; }
        .pr-laptop i::after { content: ''; position: absolute; left: -5px; right: -5px; bottom: -5px; height: 2px; border-radius: 1px; background: currentColor; }
        .pr-laptop.xira { opacity: 0.4; }
        .pr-tc-orta { grid-column: 1 / -1; display: flex; align-items: center; justify-content: center; min-height: 72px; }
        .pr-tc-pr { display: flex; flex-direction: column; gap: 5px; width: min(420px, 100%); padding: 10px 12px; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 12px; box-shadow: 0 12px 24px -16px ${fon(T.accent, 0.7)}; animation: pr-kir 0.45s ease-out both; }
        .pr-tc-pr-h { font-size: 12px; color: ${T.ink2}; }
        .pr-tc-pr-h b { color: ${T.ink}; }
        .pr-tc-pr-q { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 8px; overflow: hidden; }
        .pr-tc-pr-q code { padding: 3px 8px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink}; }
        .pr-tc-pr-q .pr-d { animation: none; }
        .pr-tc-pr-alt { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; min-height: 26px; }
        .pr-tc-izoh { display: inline-flex; align-items: center; gap: 7px; padding: 3px 11px 3px 3px; border-radius: 999px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 12.5px; font-weight: 600; color: ${T.ink}; animation: pr-kir 0.4s ease-out both; }
        .pr-tc-izoh .pr-ava { width: 20px; height: 20px; }
        .pr-tc-merge { margin-left: auto; padding: 5px 12px; border-radius: 8px; background: ${T.ok}; color: #fff; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; }
        .pr-tc-merge.bosildi { animation: pr-bos 0.55s ease-out both; }
        .pr-host { justify-self: start; padding: 8px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.bg}; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.ink}; white-space: nowrap; }
        .pr-host.yondi { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; animation: pr-yon 1s ease-out both; }
        .pr-yollar { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; }
        .pr-yol { display: flex; align-items: flex-start; gap: 10px; min-width: 0; padding: 12px 14px; text-align: left; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700; line-height: 1.35; color: ${T.ink}; cursor: pointer; transition: border-color 0.15s, background 0.2s, opacity 0.2s; }
        .pr-yol:hover:not(:disabled) { border-color: ${T.accent}; }
        .pr-yol:disabled { cursor: default; }
        .pr-yol:disabled:not(.tugal):not(.yur) { opacity: 0.5; }
        .pr-yol b { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-size: 11px; }
        .pr-yol-m { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .pr-yol-t { display: block; overflow-wrap: anywhere; }
        .pr-yol small { display: block; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .pr-yol.yur { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pr-yol.tugal { font-weight: 600; animation: pr-tush 0.5s ease-out both; }
        .pr-yol.tugal.push { background: ${T.errFon}; border-color: ${fon(T.err, 0.35)}; }
        .pr-yol.tugal.push b { background: ${T.err}; color: #fff; }
        .pr-yol.tugal.pr { background: ${T.okFon}; border-color: ${fon(T.ok, 0.35)}; }
        .pr-yol.tugal.pr b { background: ${T.ok}; color: #fff; }
        /* 4-ekran: telefon CHAPDA, PR fayli O'NGDA, ostida bitta qator katta karta (SABOQ 9/29) */
        .pr-s4 > .pr-qadam { grid-column: 1 / -1; }
        .pr-ip-xom { margin-top: 8px; }
        .pr-pufak.xom .pr-pufak-ich { border-style: dashed; transform: rotate(-1deg); }
        .pr-pufak.ulandi { animation: pr-yopish 0.5s cubic-bezier(.2,.9,.3,1.1) both; }
        p.pr-pt.pr-xom.chizildi { color: ${T.ink2}; text-decoration: line-through; opacity: 0.6; }
        p.pr-pt.pr-yangi-q { animation: pr-qator 0.4s ease-out both; }
        p.pr-pt.yigildi { animation-duration: 0.5s; }
        .pr-qadam { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 14px; box-shadow: 0 10px 22px -16px ${fon(T.accent, 0.6)}; animation: pr-kot 0.45s cubic-bezier(.2,.9,.3,1.1) both; }
        .pr-qadam-n { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .pr-qadam-ch { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; }
        .pr-qadam-ch .q-chip { font-size: 14px; padding: 11px 14px; animation: pr-chip 0.38s ease-out both; }
        .pr-qadam-ch .q-chip:nth-child(2) { animation-delay: 0.1s; }
        .pr-qadam .q-xato { margin: 0; }
        /* Amaliyot bloki: «O'z g'oyangiz» formasi, «Yordam», «Ortda qoldingizmi» ogohlantirishi */
        .pr-satr + .pr-satr { display: block; margin-top: 6px; }
        .pr-goya { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .pr-goya-q { display: grid; grid-template-columns: 132px minmax(0,1fr); align-items: start; gap: 8px; }
        .pr-goya-l { padding-top: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; line-height: 1.3; color: ${T.ink2}; }
        .pr-goya textarea { display: block; width: 100%; min-height: 36px; resize: vertical; font-family: 'Manrope', sans-serif; font-size: 13.5px; line-height: 1.4; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 7px 10px; }
        .pr-goya textarea:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .pr-goya > .q-btn { align-self: flex-start; padding: 6px 12px; font-size: 12.5px; }
        .q-blok-q.joriy:has(.pr-goya[data-tola="0"]) > .q-blok-tana > .q-btn { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
        .pr-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
        .pr-yordam-s { display: block; padding: 7px 10px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; font-size: 13px; line-height: 1.5; }
        .q-blok-xato > .q-btn.pr-yordam-btn { align-self: flex-start; padding: 5px 12px; font-size: 12.5px; }
        .q-blok-ortda:has(.pr-ortda-ogoh) > span:first-child { display: none; }
        .q-blok-buyruq:has(> .pr-ortda-ogoh), .q-blok-buyruq:has(> .pr-ortda-izoh) { font-family: 'Manrope', sans-serif; background: none; border: 0; padding: 0; white-space: normal; overflow: visible; }
        .pr-ortda-ogoh { font-size: 12.5px; line-height: 1.5; font-weight: 600; color: ${T.accent}; }
        .pr-ortda-ogoh b { font-weight: 800; }
        .pr-ortda-izoh { font-size: 12px; line-height: 1.5; color: ${T.ink2}; }
        /* Kutilgan natija maketlari */
        .pr-tavsif { display: flex; flex-direction: column; gap: 8px; }
        .pr-tavsif { gap: 6px; }
        .pr-tv-b { display: flex; flex-direction: column; gap: 1px; }
        .pr-tv-h { padding-bottom: 2px; margin-bottom: 2px; border-bottom: 1px solid ${T.line}; font-size: 13px; font-weight: 800; color: ${T.ink}; animation: pr-qator 0.4s ease-out both; animation-delay: var(--d, 0s); }
        .pr-tv-q { position: relative; padding-left: 14px; font-size: 12px; line-height: 1.4; color: ${T.ink}; animation: pr-qator 0.4s ease-out both; animation-delay: var(--d, 0s); }
        .pr-tv-q::before { content: ''; position: absolute; left: 3px; top: 8px; width: 4px; height: 4px; border-radius: 50%; background: ${T.ink2}; }
        .pr-review { display: flex; align-items: center; gap: 7px; margin-left: auto; padding-bottom: 4px; font-size: 12px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; animation: pr-kir 0.45s ease-out 0.1s both; }
        .pr-review .pr-ava { width: 22px; height: 22px; }
        .pr-review b { padding: 2px 10px; border-radius: 999px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; color: ${T.ink}; }
        .pr-natija-a3 { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pr-a3-past { display: grid; grid-template-columns: 172px minmax(0,1fr); align-items: start; gap: 12px; }
        .pr-rv { min-width: 0; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; overflow: hidden; }
        .pr-rv-ich { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px 10px; }
        .pr-rv-sar { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; }
        .pr-rv-kim { font-size: 12px; color: ${T.ink2}; }
        .pr-rv-q { display: grid; grid-template-columns: 14px minmax(0,1fr); gap: 4px 6px; padding-top: 6px; border-top: 1px solid ${T.line}; animation: pr-qator 0.4s ease-out both; animation-delay: var(--d, 0s); }
        .pr-rv-j { display: flex; align-items: center; justify-content: space-between; gap: 6px; min-width: 0; }
        .pr-rv-j .pr-qaror { flex: none; margin-top: 0; padding: 1px 8px; }
        .pr-rv-n { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pr-rv-m { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .pr-rv-m code { min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pr-rv-iz, .pr-rv-s { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px; line-height: 1.4; }
        .pr-rv-iz { color: ${T.ink}; }
        .pr-rv-s { color: ${T.ink2}; }
        /* Kartochkalar: birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma (SABOQ 16) */
        .pr-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: pr-puls 1.6s ease-out infinite; }
        p.pr-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.pr-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        p.pr-keyingi { margin: 0; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
        p.pr-keyingi b { color: ${T.ink}; }
        .rc-ic .pr-rc-kod { display: inline-block; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(13px,2vw,18px); line-height: 1.4; color: ${CODE.text}; background: ${CODE.bg}; padding: 10px 16px; border-radius: 10px; overflow-wrap: anywhere; }
        @keyframes pr-qator { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
        @keyframes pr-kir { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes pr-kot { from { opacity: 0; transform: translateY(14px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes pr-chip { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes pr-yig { from { opacity: 0.2; transform: scaleY(1.9); } to { opacity: 1; transform: none; } }
        @keyframes pr-pop { 0% { opacity: 0; transform: scale(0.4); } 70% { opacity: 1; transform: scale(1.15); } 100% { transform: scale(1); } }
        @keyframes pr-tush { 0% { opacity: 0; transform: translateY(-8px) scale(1.04); } 60% { opacity: 1; transform: translateY(1px); } 100% { transform: none; } }
        @keyframes pr-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        @keyframes pr-yon { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.5)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        @keyframes pr-chiz { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes pr-sahifa { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes pr-aylan { to { transform: rotate(360deg); } }
        @keyframes pr-bos { 0% { transform: scale(1); box-shadow: 0 0 0 0 ${fon(T.ok, 0.5)}; } 35% { transform: scale(0.9); } 100% { transform: scale(1); box-shadow: 0 0 0 10px ${fon(T.ok, 0)}; } }
        @keyframes pr-yopish { from { opacity: 0.3; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        /* Tor ekran: sahnalar ustma-ust, telefon o'lchami o'zgarmaydi */
        @media (max-width: 640px) {
          .pr-s2, .pr-s4, .pr-a3-past { grid-template-columns: minmax(0,1fr); }
          .pr-s2 > .pr-tel-ust, .pr-s4 > .pr-tel-ust, .pr-a3-past > .pr-tel-ust { justify-self: center; }
          .pr-tc { grid-template-columns: 42px minmax(0,1fr); padding: 12px; }
          .pr-laptop, .pr-host { grid-column: 2; }
          .pr-tc-chiziq { gap: 18px; }
          .pr-yollar, .pr-qadam-ch { grid-template-columns: minmax(0,1fr); }
          .pr-goya-q { grid-template-columns: minmax(0,1fr); gap: 3px; }
          .pr-goya-l { padding-top: 0; }
          .pr-ip { margin-left: 12px; margin-right: 6px; }
          .pr-bosh { padding: 10px 12px 0; }
          .pr-tablar { flex-wrap: wrap; column-gap: 14px; row-gap: 0; }
          .pr-review { margin-left: 0; padding-bottom: 6px; }
          .pr-tana { padding: 10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pr-oyna *, .pr-telefon *, .pr-tc *, .pr-holat, .pr-javob-ix, .pr-suhbat, .pr-navbat, .pr-bash .q-bashorat, .pr-bash .q-chip, .pr-taxmin, .pr-qadam, .pr-qadam .q-chip, .pr-yol, .pr-host, .pr-tel-ekran, .pr-uchar, .pr-flash.yangi .fc-card .fc-front, .pr-tv-h, .pr-tv-q, .pr-rv-q { animation: none !important; transition: none !important; }
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
