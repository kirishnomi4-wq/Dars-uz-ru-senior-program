import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul (kod src/9-Modull) · 14-dars «Loyiha kuni: 3-asosiy funksiya» (m9-14) — MD v3: feedback/F-1005-11modul/14-FeatureThree-v3.md (GATE M, 14-FILTR).
// Skeletdan (src/skelet/NamunaDars.jsx, konveyer 04.10) qurilgan: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletniki;
//   kontent — «O'yin sahnasi» (OYIN_SAHNA → Tel · BeQuti · IshJadval) va 12 ekran: kirish · reja · tushuncha · A1 · 1-savol · tushuncha · A2 · 2-savol · A3 · podium · kartochkalar · yakun.
// Saqlanadigan kalitlar (tayanch 8): o'qiydi pm-m9d6-roadmap (hozir[2]), pm-m9d8-platforma (trek); dars qoralamasi pm-m9d14-code (funksiya nomi, uch blok qatorlari).
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QIzoh, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm9-14-v1', lessonTitle: { uz: "Loyiha kuni: 3-asosiy funksiya", ru: 'День проекта: 3-я основная функция' } };
// 12 ekran (MD: 8 + 3 blok + kartochkalar) · oqim: kirish → reja → tushuncha → amaliyot 1 → 1-savol → tushuncha → amaliyot 2 → 2-savol → amaliyot 3 → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'navbat', ru: 'очередь' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'chiqish', ru: 'выход' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: 'qoshildi', l: 24, tp: 70, s: 12, d: 8.5 },
  { t: '409', l: 78, tp: 68, s: 13, d: 6.8 }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD: 1-savol (s3) — C, 2-savol (s5) — A. `practice: -1` — uch amaliyot bloki (variant yo'q).
const INLINE_KEYS = { s3: 2, s5: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI: 4 — 1-savol, 7 — 2-savol). Emoji o'rniga koddan bitta qator (S-026).
const RECAPS = {
  4: {
    title: { uz: "Joy bo'shasa, navbatdagi oladi", ru: 'Освободилось место — его берёт очередь' },
    cards: [
      { ic: <code className="f3-rc-kod">POST /oyinlar/:id/navbat</code>, h: { uz: 'Navbat', ru: 'Очередь' }, body: { uz: <>To'lgan o'yinda o'yinchi <code className="qcode">navbatda</code> bo'lib yoziladi.</>, ru: <>В заполненной игре игрок записывается как <code className="qcode">navbatda</code>.</> } },
      { ic: <code className="f3-rc-kod">POST /oyinlar/:id/chiqish</code>, h: { uz: "O'yindan chiqish", ru: 'Выход из игры' }, body: { uz: <>Qo'shilgan o'yinchi <code className="qcode">chiqdi</code> bo'ladi, joy bo'shaydi.</>, ru: <>Присоединившийся игрок становится <code className="qcode">chiqdi</code>, место освобождается.</> } },
      { ic: <code className="f3-rc-kod">holat: 'qoshildi'</code>, h: { uz: 'Navbatdagi', ru: 'Первый в очереди' }, body: { uz: "Navbatga birinchi yozilgan o'yinchi bo'shagan joyni oladi.", ru: 'Освободившееся место получает тот, кто первым встал в очередь.' }, ask: { uz: "Navbatda ikki kishi turibdi. Bitta joy bo'shasa, qaysi biri oladi?", ru: 'В очереди два человека. Освободилось одно место — кто его получит?' } }
    ]
  },
  7: {
    title: { uz: 'Oxirgi joy — bitta odamga', ru: 'Последнее место — одному человеку' },
    cards: [
      { ic: <code className="f3-rc-kod">9 / 10</code>, h: { uz: "Ikki so'rov", ru: 'Два запроса' }, body: { uz: "Bir lahzada kelsa, ikkalasi ham «joy bor» deb ko'rishi mumkin.", ru: 'Если придут в один миг, оба могут увидеть «место есть».' } },
      { ic: <code className="f3-rc-kod">409 · O'yin to'ldi</code>, h: { uz: 'Bitta ish', ru: 'Одно действие' }, body: { uz: "Ikkinchi so'rov kutadi, keyin joy qolmaganini ko'radi.", ru: 'Второй запрос ждёт, потом видит, что мест нет.' } },
      { ic: <code className="f3-rc-kod">Nima qilsin: …</code>, h: { uz: 'Talab', ru: 'Требование' }, body: { uz: "«Ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin.»", ru: '«Даже если двое нажмут одновременно, на одно место не должны записаться два человека.»' }, ask: { uz: 'Nega tugmani yashirish oxirgi joyni himoya qilmaydi?', ru: 'Почему скрытая кнопка не защищает последнее место?' } }
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

// ===== DARSNING O'Z VIZUALI — «O'yin sahnasi» (MD: OYIN_SAHNA → OyinSahna, 163/180). Bitta manba: OYIN_SAHNA → Tel, BeQuti, IshJadval, Sahna; 0, 1, 2, 4-ekran va bloklar maketlari shundan =====
// Holatlar (MD): kulrang — hali yo'q · oq — ishlaydi · accent — joriy / navbatda · yashil — qoshildi · qizil — «11 / 10», 409 · chiqdi — kulrang, ustidan chiziq. Konvert — so'rov.
// qolip-maket: f3-tel-btn f3-tortish — telefon ichidagi tugmalar va «↓ Pastga tortib yangilash» (MD: harakat tugmasi telefonning o'zida, SABOQ 21). Kam harakat rejimida uchish yo'q, holat birdan almashadi.
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
// Telefonda (bir ustun) harakatdan keyin o'zgargan joy ko'rinadigan joyga suriladi (MD KOD 5)
const korsat = (sel) => {
  if (typeof window === 'undefined' || window.innerWidth >= 768) return;
  const el = document.querySelector(sel);
  if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const OYIN_SAHNA = {
  ilova: 'Maydon Jamoa',
  // Namuna o'yin (tayanch 9.2): Yakshanba 17:00 · Mahalla maydoni — 4-o'yin (oyin_id = 4)
  oyin: { id: 4, kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, soat: '17:00', maydon: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, kerak: 10 },
  yol: { qoshilish: 'POST …/qoshilish', navbat: 'POST …/navbat', chiqish: 'POST …/chiqish' },
  rol: {
    qosh1: { uz: "1-telefon · qo'shilgan o'yinchi", ru: '1-й телефон · присоединившийся игрок' },
    yangi1: { uz: "1-telefon · yangi o'yinchi", ru: '1-й телефон · новый игрок' },
    yangi2: { uz: "2-telefon · yangi o'yinchi", ru: '2-й телефон · новый игрок' }
  },
  tugma: {
    qoshilaman: { uz: "Qo'shilaman", ru: 'Присоединяюсь' }, qoshildingiz: { uz: "Qo'shildingiz", ru: 'Вы присоединились' },
    toldi: { uz: "O'yin to'ldi", ru: 'Игра заполнена' }, navbatga: { uz: 'Navbatga yozilish', ru: 'Встать в очередь' },
    chiqish: { uz: "O'yindan chiqish", ru: 'Выйти из игры' }
  },
  yozuv: {
    navbatdasiz: { uz: 'Navbatdasiz', ru: 'Вы в очереди' }, navbatda: { uz: 'Navbatda:', ru: 'В очереди:' }, orqa: { uz: "O'yinlar", ru: 'Игры' },
    eski: { uz: 'eski holat', ru: 'старое состояние' }, pastga: { uz: 'Pastga tortib yangilash', ru: 'Потянуть вниз — обновить' },
    rostdan: { uz: 'Rostdan chiqasizmi?', ru: 'Точно выйти?' }, ha: { uz: 'Ha', ru: 'Да' }, yoq: { uz: "Yo'q", ru: 'Нет' },
    kutyapti: { uz: 'kutyapti', ru: 'ждёт' }, bittaIsh: { uz: 'bitta ish', ru: 'одно действие' }
  },
  ustun: [{ uz: "o'yinchi", ru: 'игрок' }, { uz: 'holat', ru: 'статус' }, { uz: 'yozilgan vaqti', ru: 'время записи' }],
  // Database qatori: yozilgan vaqti — Database ko'rinishida (sana va vaqt; tayanch 9.30 naqshi, namuna o'yinlar 2026-10-10 / 2026-10-11 — 10-dars bilan bir)
  oyinchi: { t1: { uz: "1-telefon o'yinchisi", ru: 'игрок 1-го телефона' }, t2: { uz: "2-telefon o'yinchisi", ru: 'игрок 2-го телефона' } }
};

// Uchish (SABOQ 19): konvert manbadan nishonga uchadi. Joylar DOM dan o'lchanadi — ⛶ kattalashganda ham, telefonda ustma-ust turganda ham to'g'ri.
const PARVOZ_MS = 800;
const useParvoz = () => {
  const box = useRef(null);
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [parvoz, setParvoz] = useState([]);
  const uchir = useCallback((dan, ga, t, tur, ms = PARVOZ_MS) => {
    const b = box.current; if (kam || !b) return;
    const s = b.querySelector(dan), n = b.querySelector(ga); if (!s || !n) return;
    const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
    const nuqta = (el) => { const r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - br.left) / z, y: (r.top + r.height / 2 - br.top) / z }; };
    const p = { k: Math.random().toString(36).slice(2), t, tur, a: nuqta(s), b: nuqta(n), ms };
    setParvoz(x => [...x, p]);
    keyin(() => setParvoz(x => x.filter(y => y.k !== p.k)), ms + 80);
  }, [kam, keyin]);
  return { box, parvoz, uchir, kam, keyin };
};
const Konvert = ({ p }) => (
  <span className={cxx('f3-konvert', p.tur, !p.t && 'nuqta')} aria-hidden="true"
    style={{ left: p.a.x + 'px', top: p.a.y + 'px', '--dx': (p.b.x - p.a.x) + 'px', '--dy': (p.b.y - p.a.y) + 'px', animationDuration: p.ms + 'ms' }}>{p.t}</span>
);

// Telefon = ilova (SABOQ 22–23): o'lchami barqaror 172×272, «Maydon Jamoa» nomi o'z rangida. Ustida rol yorlig'i — ramkadan tashqarida.
// «O'yin» ekrani: «‹ O'yinlar» · kun, soat · maydon · «N / 10» · ismsiz doiralar · «Navbatda: N» · holat yozuvi · tugmalar.
// tugmalar: [{ k (OYIN_SAHNA.tugma kaliti), h: 'off' | 'ikki', on, navbat, bos, silk, yangi }] · doira: { i, h: 'kul' | 'yangi' } · tort: 'tayyor' | 'yur' · oyna: 'ochiq' | 'ha'
const Tel = ({ id, rol, son = 10, doira, navbatda, yozuv, tugmalar = [], tort, onTort, tortNavbat, oyna, eski, fokus, children }) => {
  const o = OYIN_SAHNA.oyin, Y = OYIN_SAHNA.yozuv;
  const soni = Math.max(o.kerak, son);
  const tortYur = tort === 'yur';
  return (
    <div className={cxx('f3-tel-ust', fokus && 'fokus')} data-tel={id}>
      {rol && <span className="f3-rol">{tr(rol)}</span>}
      <div className="f3-telefon">
        {eski && <span className="f3-eski">{tr(Y.eski)}</span>}
        <span className="f3-tel-bar"><b className="f3-tel-nom">{OYIN_SAHNA.ilova}</b></span>
        {tort && (tortYur
          ? <span className="f3-aylan" aria-hidden="true"><i /></span>
          : <button type="button" className={cxx('f3-tortish', tortNavbat && 'f3-navbat')} disabled={!onTort} onClick={onTort}>↓ {tr(Y.pastga)}</button>)}
        <div className={cxx('f3-tel-ekran', tortYur && 'tort')}>
          <span className="f3-orqa">‹ {tr(Y.orqa)}</span>
          <b className="f3-sar">{tr(o.kun)}, {o.soat}</b>
          <span className="f3-joy">{tr(o.maydon)}</span>
          <b key={'s' + son} className={cxx('f3-son', son > o.kerak && 'qizil')}>{son} / {o.kerak}</b>
          <span className="f3-doiralar" aria-hidden="true">{Array.from({ length: soni }, (_, i) => (
            <i key={i} className={cxx(i < son && 'bor', i >= o.kerak && 'ortiq', doira && doira.i === i && doira.h)} />
          ))}</span>
          {navbatda !== undefined && <span className="f3-navbatda">{tr(Y.navbatda)} <b key={'n' + navbatda}>{navbatda}</b></span>}
          {yozuv && <span className="f3-yozuv">{tr(yozuv)}</span>}
          <span className="f3-tugmalar">{tugmalar.map(b => {
            const kl = cxx('f3-tel-btn', b.h, b.navbat && 'f3-navbat', b.yangi && 'yangi', b.bos && 'bos', b.silk && 'silk');
            const ich = <>{tr(OYIN_SAHNA.tugma[b.k])}{b.bos && <i className="f3-barmoq" aria-hidden="true" />}</>;
            return b.on
              ? <button key={b.k} type="button" className={kl} data-btn={b.k} onClick={b.on}>{ich}</button>
              : <span key={b.k} className={kl} data-btn={b.k}>{ich}</span>;
          })}</span>
        </div>
        {oyna && <span className="f3-oyna">
          <span className="f3-oyna-s">{tr(Y.rostdan)}</span>
          <span className="f3-oyna-q"><span className="f3-oyna-b">{tr(Y.yoq)}</span><span className={cxx('f3-oyna-b ha', oyna === 'ha' && 'bos')}>{tr(Y.ha)}</span></span>
        </span>}
      </div>
      {children}
    </div>
  );
};
// Telefon tugmalari holatdan: ichida — «Qo'shildingiz» + «O'yindan chiqish» · navbatda — «O'yindan chiqish» · tashqarida — «Navbatga yozilish»
const telTugma = (holat, x = {}) => holat === 'ichida'
  ? [{ k: 'qoshildingiz', h: 'off' }, { k: 'chiqish', h: 'ikki', ...x }]
  : holat === 'navbatda' ? [{ k: 'chiqish', h: 'ikki', ...x }]
    : [{ k: 'navbatga', ...x }];

// Backend qutisi: yo'l(lar) · so'rov kartalari «joy bormi?» (✓ / ✕) · «bitta ish» qulfi · eshik oldida «kutyapti»
const BeQuti = ({ yollar, joriy, holat, qulf, sorovlar = [], eshik, izoh }) => {
  const Y = OYIN_SAHNA.yozuv;
  return (
    <div className={cxx('f3-be', holat)} data-be="1">
      <span className="f3-be-h"><b>Backend</b>{qulf && <span className={cxx('f3-qulf', qulf)}><i aria-hidden="true" />{tr(Y.bittaIsh)}</span>}</span>
      {yollar.map(y => <code key={y} className={cxx('f3-yol', joriy === y && 'on')} data-yol={y}>{OYIN_SAHNA.yol[y]}</code>)}
      {(sorovlar.length > 0 || eshik) && <span className="f3-sorovlar">
        {sorovlar.map(s => <span key={s.k} className={cxx('f3-sorov', s.h)} data-sorov={s.k}><i>{s.h === 'ok' ? '✓' : s.h === 'no' ? '✕' : ''}</i>{tr(s.t)}</span>)}
        {eshik && <span className="f3-sorov kut" data-sorov="eshik"><i aria-hidden="true" />{tr(Y.kutyapti)}</span>}
      </span>}
      {izoh && <span className="f3-be-izoh" key={tr(izoh)}>{tr(izoh)}</span>}
    </div>
  );
};
// Database · ishtirokchilar — ixcham: harakatdagi o'yinchilar alohida qator, qolganlari bitta yig'ma qator (SABOQ 24, 27)
const IshJadval = ({ qatorlar = [], yigma, fokus, vaqtsiz }) => (
  <div className={cxx('f3-db', fokus && 'fokus')} data-db="1">
    <span className="f3-db-h">Database · <code>ishtirokchilar</code></span>
    <table className="f3-jt">
      <thead><tr>{(vaqtsiz ? OYIN_SAHNA.ustun.slice(0, 2) : OYIN_SAHNA.ustun).map((u, i) => <th key={i}>{tr(u)}</th>)}</tr></thead>
      <tbody>
        {qatorlar.map(q => (
          <tr key={q.k} data-q={q.k} className={cxx(q.kl)}>
            <td>{tr(q.o)}</td><td><code className={cxx('f3-holat', q.h)}>{q.h}</code></td>{!vaqtsiz && <td className="f3-vaqt">{q.t || ''}</td>}
          </tr>
        ))}
        {yigma && <tr className="f3-yigma"><td>{tr(yigma.o)}</td><td><code className={cxx('f3-holat', yigma.h)}>{yigma.h}</code></td>{!vaqtsiz && <td className="f3-vaqt" />}</tr>}
      </tbody>
    </table>
  </div>
);
// Sahna: telefon(lar) chapda, Backend va Database o'ngda (SABOQ 21). Yo'lak — so'rov yo'li
const Yolak = () => <span className="f3-yolak" aria-hidden="true" />;
const Sahna = ({ boxRef, parvoz = [], tur, children }) => (
  <div className={cxx('f3-sahna', tur)} ref={boxRef}>{children}{parvoz.map(p => <Konvert key={p.k} p={p} />)}</div>
);

// Bashorat (SABOQ 11/19): karta halqada, variantlar navbat bilan chiqadi; tanlangach ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi
const TaxminIxcham = ({ savol, javob }) => (
  <div className="f3-taxmin"><span className="f3-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="f3-taxmin-s">{savol}</span><b>{javob}</b></div>
);
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="f3-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <TaxminIxcham savol={savol} javob={tr((variantlar.find(v => v.k === tanlov) || {}).t)} />);
// Natija bloki (SABOQ 25): bitta yashil blok — birinchi qator taxmin, so'ng joriy qator va xulosa
const NatijaBlok = ({ togri, haqiqat, izoh, xulosa }) => (
  <div className="q-xulosa f3-nb">
    <span className={cxx('f3-nb-t', togri && 'ok')}>{togri ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение подтвердилось' })}</> : haqiqat}</span>
    {izoh && <span className="f3-nb-i">{izoh}</span>}
    <span className="f3-nb-x">{xulosa}</span>
  </div>
);
const Haqiqat = ({ taxmin, haqiqat }) => <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {taxmin} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></>;

// Odam (SABOQ 36): bosh, soch, ko'z, rangli kiyim — tayoqcha siluet emas
const ODAM_RANG = [{ k: T.accent, t: '#E9B48C' }, { k: '#2E9E4F', t: '#C98E62' }, { k: '#2F6FD6', t: '#E9B48C' }];
const Odam = ({ i }) => {
  const r = ODAM_RANG[i % ODAM_RANG.length];
  return (
    <svg className="f3-odam" style={{ '--i': i }} viewBox="0 0 26 34" aria-hidden="true">
      <path d="M3 34 Q3 21 13 21 Q23 21 23 34 Z" fill={r.k} />
      <circle cx="13" cy="12" r="7" fill={r.t} />
      <path d="M6 11 Q6 4 13 4 Q20 4 20 11 Q17 7.5 13 8 Q9 7.5 6 11 Z" fill="#3A2A22" />
      <circle cx="10.6" cy="13" r="0.95" fill="#3A2A22" /><circle cx="15.4" cy="13" r="0.95" fill="#3A2A22" />
    </svg>
  );
};
// 0-ekran kadri: «Yakshanba, 17:00 · maydonda» — o'nta o'rin, to'qqiztasi birin-ketin yonadi, bittasi uzuq chiziqli bo'sh (U-041)
const MaydonKadr = () => (
  <div className="f3-maydon">
    <span className="f3-maydon-h">{tr({ uz: 'Yakshanba, 17:00 · maydonda', ru: 'Воскресенье, 17:00 · на поле' })}</span>
    <div className="f3-maydon-q">{Array.from({ length: 10 }, (_, i) => (i < 9 ? <Odam key={i} i={i} /> : <span key={i} className="f3-bosh-joy" aria-hidden="true" />))}</div>
    <span className="f3-maydon-y">{tr({ uz: 'bu misolda: 10 kishi kerak edi — 9 kishi keldi', ru: 'в этом примере: нужно было 10 человек — пришли 9' })}</span>
  </div>
);

// Uchinchi funksiya nomi: pm-m9d6-roadmap (ishlar[hozir[2]].nom); kalit yo'q bo'lsa — A1 dagi qator, dars qoralamasi pm-m9d14-code (MD KOD 7)
const QORALAMA_KEY = 'pm-m9d14-code';
const qoralamaOl = () => { try { return JSON.parse(localStorage.getItem(QORALAMA_KEY) || '{}') || {}; } catch { return {}; } };
const qoralamaYoz = (k, v) => { try { const o = qoralamaOl(); o[k] = v; localStorage.setItem(QORALAMA_KEY, JSON.stringify(o)); } catch { /* xotira yopiq — qoralama faqat shu ekranda */ } };
const roadmapNom = () => {
  try {
    const r = JSON.parse(localStorage.getItem('pm-m9d6-roadmap') || 'null');
    const i = r && Array.isArray(r.hozir) ? r.hozir[2] : null;
    const ish = r && Array.isArray(r.ishlar) && Number.isInteger(i) ? r.ishlar[i] : null;
    return (ish && String(ish.nom || '').trim()) || '';
  } catch { return ''; }
};
const uchinchiNom = () => roadmapNom() || String(qoralamaOl().nom || '').trim();

// ===== SCREEN 0 — KIRISH (QKirish): qo'shilgan o'yinchi kela olmaydi, ilovada chiqish yo'q. Ballsiz (J-026) =====
const HOOK_OPTS = [
  { id: 'a', t: { uz: "Joy bo'shaydi — o'yin kuni «Kelaman» bosilmaydi", ru: 'Место освободится — в день игры не нажмут «Kelaman»' } },
  { id: 'b', t: { uz: "Joy band qoladi — ilovada o'yindan chiqish yo'q", ru: 'Место останется занятым — в приложении нет выхода из игры' } },
  { id: 'c', t: { uz: 'Joy band qoladi — tashkilotchi buni bilmaydi', ru: 'Место останется занятым — организатор об этом не узнает' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Ilovada o'yindan chiqish yo'li yo'q: joy band turadi, o'ynamoqchi bo'lgan o'yinchi esa «O'yin to'ldi»ni ko'radi.</>, ru: <><b>Именно!</b> В приложении нет выхода из игры: место остаётся занятым, а желающий играть видит «O'yin to'ldi».</> },
  a: { uz: <><b>Qiziq fikr!</b> «Kelaman» bosilmasa, tashkilotchi buni ko'radi, lekin joy band turaveradi. O'yindan chiqish yo'li yo'q.</>, ru: <><b>Интересная мысль!</b> Если не нажать «Kelaman», организатор это увидит, но место так и останется занятым. Выхода из игры нет.</> },
  c: { uz: <><b>Qiziq fikr!</b> O'yin kuni tashkilotchi kim tasdiqlaganini ko'radi. Lekin joyni bo'shatadigan tugma ilovada yo'q.</>, ru: <><b>Интересная мысль!</b> В день игры организатор видит, кто подтвердил. Но кнопки, которая освобождает место, в приложении нет.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [bos, setBos] = useState(false);
  const [kadr, setKadr] = useState(avval);
  const [sc, setSc] = useState(0);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); setSc(n => n + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    keyin(() => setBos(true), kam ? 0 : 300);
    keyin(() => setBos(false), kam ? 0 : 1050);
    keyin(() => { setKadr(true); setSc(n => n + 1); }, kam ? 0 : 1250);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Qo'shilgan o'yinchi kela olmasa, <span className="italic" style={{ color: T.accent }}>joyi nima bo'ladi</span>?</>, ru: <>Если присоединившийся игрок не сможет прийти, <span className="italic" style={{ color: T.accent }}>что будет с его местом</span>?</> })}
        mentor={<Mentor>{picked === null
          ? tr({ uz: "1-telefondagi o'yinchi Yakshanba 17:00 dagi o'yinga qo'shilgan, lekin endi kela olmaydi. 2-telefondagi o'yinchi shu o'yinda o'ynamoqchi — avval javobni tanlang.", ru: 'Игрок с 1-го телефона присоединился к игре в воскресенье в 17:00, но теперь не сможет прийти. Игрок со 2-го телефона хочет сыграть в этой игре — сначала выберите ответ.' })
          : tr({ uz: "«Davom etish»ni bosing — bugungi rejani ko'rasiz.", ru: 'Нажмите «Продолжить» — увидите план на сегодня.' })}</Mentor>}
        maket={<div className={cxx('f3-s0', picked === null && 'kutish')}>
          <div className="f3-ikki-tel">
            <Tel id="1" rol={OYIN_SAHNA.rol.qosh1} tugmalar={[{ k: 'qoshildingiz', h: 'off', bos, silk: bos }]} />
            <Tel id="2" rol={OYIN_SAHNA.rol.yangi2} tugmalar={[{ k: 'toldi', h: 'off' }]}>
              {kadr && <span className="f3-tel-kul">{tr({ uz: "o'ynamoqchi edi — joy yo'q edi", ru: 'хотел играть — мест не было' })}</span>}
            </Tel>
          </div>
          {kadr && <MaydonKadr />}
        </div>}
        savol={tr({ uz: 'Sizningcha, qaysi biri?', ru: 'Как вы думаете, какой вариант?' })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Dars oxirida» — O'yin sahnasi tayyor holatda bir marta o'zi yuradi (DE-200); o'ngda 3 qadam (tegsiz, 172) =====
const REJA = [
  { uz: "Backend yangi harakatni Database'ga yozadi", ru: 'Backend записывает новое действие в Database' },
  { uz: "Ikki so'rov bir lahzada kelsa ham yozuv to'g'ri qoladi", ru: 'Запись остаётся верной, даже если два запроса придут в один миг' },
  { uz: 'Funksiya telefonda ishlaydi, oldingi ikkitasi ham', ru: 'Функция работает на телефоне, и две прежние тоже' }
];
// Reja kashfiyotni oldindan aytmaydi: tugmalar faqat paydo bo'ladi, bosilmaydi (MD 1-ekran)
const RejaSahna = () => {
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [k, setK] = useState(kam ? 3 : 0);
  useEffect(() => { if (kam) return; keyin(() => setK(1), 900); keyin(() => setK(2), 1900); keyin(() => setK(3), 2900); }, []); // eslint-disable-line
  return (
    <div className="f3-ikki-tel f3-reja">
      <Tel id="1" rol={OYIN_SAHNA.rol.qosh1} navbatda={k >= 3 ? 0 : undefined} tugmalar={[{ k: 'qoshildingiz', h: 'off' }, ...(k >= 2 ? [{ k: 'chiqish', h: 'ikki', yangi: true }] : [])]} />
      <Tel id="2" rol={OYIN_SAHNA.rol.yangi2} navbatda={k >= 3 ? 0 : undefined} tugmalar={[k >= 1 ? { k: 'navbatga', yangi: true } : { k: 'toldi', h: 'off' }]} />
    </div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => {
  const nom = uchinchiNom();
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Dars oxirida <span className="italic" style={{ color: T.accent }}>uchinchi funksiya</span> telefonda ishlaydi.</>, ru: <>К концу урока <span className="italic" style={{ color: T.accent }}>третья функция</span> заработает на телефоне.</> })}
        mentor={<Mentor>{tr({ uz: "Bugun roadmap'dagi uchinchi funksiyani qurasiz — talabning uch qatorini har blokda o'zingiz yozasiz. Mentor misolida bu funksiya — o'yindan chiqish va navbat.", ru: 'Сегодня вы строите третью функцию из roadmap — три строки требования в каждом блоке пишете сами. В примере Ментора эта функция — выход из игры и очередь.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'К концу урока' })}
        chap={<RejaSahna />}
        ongYorliq={tr({ uz: 'Bugungi 3 qadam', ru: '3 шага на сегодня' })}
        qadamlar={REJA.map(t => ({ t: tr(t) }))}>
        <div className="f3-reja-past fade-up">
          <p className="f3-reja-repo">repo <code>maydon-jamoa</code> · {tr({ uz: "boshlang'ich holat", ru: 'начальное состояние' })} <code>m11-dars-14-start</code> · {tr({ uz: 'namuna', ru: 'образец' })} <code>m11-dars-14-done</code></p>
          <p className="f3-reja-izoh">{tr({ uz: "«Maydon Jamoa» — namuna; amaliyotlarni roadmap'ingizdagi uchinchi funksiyada bajarasiz", ru: '«Maydon Jamoa» — образец; практику вы делаете на третьей функции из своего roadmap' })}{nom ? <>: <b>«{nom}»</b>.</> : '.'}</p>
        </div>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA (QTushuncha keng): navbatga yozilish → o'yindan chiqish → pastga tortib yangilash. Holat bosishlardan chiziladi (P-046) =====
const S2_TAXMIN = [{ k: '9', t: { uz: '9 / 10', ru: '9 / 10' } }, { k: '10', t: { uz: '10 / 10', ru: '10 / 10' } }];
const S2_JORIY = { uz: "Navbat tartibi — yozilgan vaqti: birinchi yozilgan birinchi qo'shiladi.", ru: 'Порядок очереди — по времени записи: кто первым записался, тот первым присоединяется.' };
// t1 / t2: 'ichida' | 'navbatda' | 'tashqarida' · nav — telefondagi «Navbatda: N» (telefon o'z javobidagi sonni ko'rsatadi)
const S2_BOSH = { t1: 'ichida', t2: 'tashqarida', nav1: 0, nav2: 0, eski: false, oyna: null, tort: null, joriy: '', be: '', qulf: null, r1: 'qoshildi', kl1: '', r2: null, kl2: '', d1: null, d2: null, bos: null };
const S2_OXIR = { ...S2_BOSH, t1: 'tashqarida', t2: 'ichida', r1: 'chiqdi', kl1: 'chiq', r2: 'qoshildi' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 3 : 0);
  const [yur, setYur] = useState(false);
  const [h, setH] = useState(avval ? S2_OXIR : S2_BOSH);
  const qo = (p) => setH(x => ({ ...x, ...p }));
  const done = n >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const D = ms(PARVOZ_MS);
  const kut = (i) => !!taxmin && !yur && n === i;
  const navb = () => {
    if (!kut(0)) return;
    setYur(true); qo({ bos: 'navb' });
    uchir('[data-tel="2"] [data-btn="navbatga"]', '[data-yol="navbat"]', 'POST /oyinlar/4/navbat');
    keyin(() => { qo({ bos: null, joriy: 'navbat', be: 'on' }); korsat('[data-be]'); }, D);
    keyin(() => uchir('[data-be]', '[data-db]', ''), D + ms(350));
    keyin(() => { qo({ r2: 'navbatda', kl2: 'kir' }); korsat('[data-db]'); }, 2 * D + ms(350));
    keyin(() => uchir('[data-be]', '[data-tel="2"] .f3-telefon', '201 · navbatda', 'javob'), 2 * D + ms(800));
    keyin(() => { qo({ t2: 'navbatda', nav2: 1, joriy: '', be: '' }); setN(1); setYur(false); korsat('[data-tel="1"]'); }, 3 * D + ms(800));
  };
  const chiq = () => {
    if (!kut(1)) return;
    setYur(true); qo({ oyna: 'ochiq', bos: 'chiq' });
    keyin(() => qo({ oyna: 'ha', bos: null }), ms(800));
    const t0 = ms(1250);
    keyin(() => { qo({ oyna: null }); uchir('[data-tel="1"] [data-btn="chiqish"]', '[data-yol="chiqish"]', 'POST /oyinlar/4/chiqish'); }, t0);
    keyin(() => { qo({ joriy: 'chiqish', be: 'on', qulf: 'yopiq' }); korsat('[data-be]'); }, t0 + D);
    keyin(() => uchir('[data-be]', '[data-db]', ''), t0 + D + ms(450));
    keyin(() => { qo({ r1: 'chiqdi', kl1: 'chiq', r2: 'qoshildi', kl2: 'yon' }); korsat('[data-db]'); }, t0 + 2 * D + ms(450));
    keyin(() => qo({ qulf: 'ochiq' }), t0 + 2 * D + ms(1200));
    keyin(() => uchir('[data-be]', '[data-tel="1"] .f3-telefon', '201 · chiqdi', 'javob'), t0 + 2 * D + ms(1450));
    keyin(() => { qo({ t1: 'tashqarida', d1: { i: 0, h: 'kul' }, qulf: null, joriy: '', be: '', eski: true }); korsat('[data-tel="1"]'); }, t0 + 3 * D + ms(1450));
    keyin(() => qo({ d1: { i: 0, h: 'yangi' } }), t0 + 3 * D + ms(2000));
    keyin(() => { setN(2); setYur(false); korsat('[data-tel="2"]'); }, t0 + 3 * D + ms(2150));
  };
  const yangila = () => {
    if (!kut(2)) return;
    setYur(true); qo({ tort: 'yur' });
    uchir('[data-tel="2"] .f3-telefon', '[data-be]', 'GET /oyinlar');
    keyin(() => uchir('[data-be]', '[data-tel="2"] .f3-telefon', '', 'javob'), D + ms(300));
    keyin(() => { qo({ tort: null, t2: 'ichida', nav2: 0, eski: false, d2: { i: 9, h: 'yangi' } }); setN(3); setYur(false); }, 2 * D + ms(400));
  };
  const tx2 = S2_TAXMIN.find(x => x.k === taxmin);
  const qatorlar = [
    { k: 'r1', o: OYIN_SAHNA.oyinchi.t1, h: h.r1, t: '2026-10-09 18:10', kl: h.kl1 },
    ...(h.r2 ? [{ k: 'r2', o: OYIN_SAHNA.oyinchi.t2, h: h.r2, t: '2026-10-09 19:42', kl: h.kl2 }] : [])
  ];
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · chiqish va navbat', ru: 'Понятие · выход и очередь' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }) : !done ? tr({ uz: `Tugmalarni tartib bilan bosing (${n}/3)`, ru: `Нажимайте кнопки по порядку (${n}/3)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>O'yinchi chiqsa, bo'shagan joyni <span className="italic" style={{ color: T.accent }}>kim oladi</span>?</>, ru: <>Если игрок выйдет, <span className="italic" style={{ color: T.accent }}>кто займёт</span> освободившееся место?</> })}
        mentor={<Mentor>{!taxmin
          ? tr({ uz: "O'yin to'ldi — avval taxminingizni belgilang, keyin tugmalarni tartib bilan bosing.", ru: 'Игра заполнена — сначала отметьте предположение, потом нажимайте кнопки по порядку.' })
          : !done ? tr({ uz: <>Keyingi tugmani bosing va <code className="qcode">ishtirokchilar</code> jadvalida nima o'zgarishini kuzating.</>, ru: <>Нажмите следующую кнопку и следите, что меняется в таблице <code className="qcode">ishtirokchilar</code>.</> })
            : tr({ uz: 'Uchala qadam tugadi — natijani taxminingiz bilan solishtiring.', ru: 'Все три шага пройдены — сравните результат со своим предположением.' })}</Mentor>}
        bashorat={<Bashorat savol={tr({ uz: "Navbatda odam bor. Bir o'yinchi chiqsa, kartada qaysi son?", ru: 'В очереди есть человек. Если один игрок выйдет, какое число будет на карточке?' })} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<Sahna tur="qator" boxRef={box} parvoz={parvoz}>
          <div className="f3-ikki-tel">
            <Tel id="1" rol={OYIN_SAHNA.rol.qosh1} doira={h.d1} navbatda={h.nav1} oyna={h.oyna} fokus={tugadi}
              tugmalar={telTugma(h.t1, { on: kut(1) ? chiq : undefined, navbat: kut(1), bos: h.bos === 'chiq' })} />
            <Tel id="2" rol={OYIN_SAHNA.rol.yangi2} doira={h.d2} navbatda={h.nav2} eski={h.eski} fokus={tugadi}
              yozuv={h.t2 === 'navbatda' ? OYIN_SAHNA.yozuv.navbatdasiz : null}
              tugmalar={telTugma(h.t2, { on: kut(0) ? navb : undefined, navbat: kut(0), bos: h.bos === 'navb', yangi: n > 0 })}
              tort={h.tort === 'yur' ? 'yur' : n === 2 && !yur ? 'tayyor' : null} onTort={kut(2) ? yangila : undefined} tortNavbat={kut(2)} />
          </div>
          <Yolak />
          <div className="f3-sahna-ong">
            <BeQuti yollar={['navbat', 'chiqish']} joriy={h.joriy} holat={h.be} qulf={h.qulf} />
            <IshJadval qatorlar={qatorlar} yigma={{ o: { uz: 'yana 9 ta', ru: 'ещё 9' }, h: 'qoshildi' }} fokus={tugadi} />
          </div>
        </Sahna>}
        natija={done
          ? (tx2 && <NatijaBlok togri={taxmin === '10'}
            haqiqat={<Haqiqat taxmin={tr(tx2.t)} haqiqat={tr({ uz: "«10 / 10» — joyni navbatdagi oldi", ru: '«10 / 10» — место занял первый в очереди' })} />}
            izoh={tr(S2_JORIY)}
            xulosa={tr({ uz: "Qo'shilgan o'yinchi chiqsa, joyni navbatdagi birinchi o'yinchi oladi. U buni ekranni yangilaganda ko'radi.", ru: 'Если присоединившийся игрок выходит, место получает первый в очереди. Он видит это, когда обновляет экран.' })} />)
          : n >= 2 && <p className="f3-joriy">{tr(S2_JORIY)}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — TEST 1 (QuestionScreen → QTest; INLINE_KEYS.s3 = 2, C). Savol ustida yorliq yo'q (SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="«10 / 10», navbatda ikki kishi. Ikki o'yinchi chiqdi. Kartada nima?"
    question={tr({ uz: <h2 className="title h-ask"><span className="f3-nw">«10 / 10»</span>, navbatda ikki kishi. Ikki o'yinchi chiqdi. <span className="italic" style={{ color: T.accent }}>Kartada nima?</span></h2>, ru: <h2 className="title h-ask"><span className="f3-nw">«10 / 10»</span>, в очереди два человека. Вышли два игрока. <span className="italic" style={{ color: T.accent }}>Что на карточке?</span></h2> })}
    options={[
      { uz: '10 / 10 · navbatda: 2', ru: '10 / 10 · в очереди: 2' },
      { uz: '9 / 10 · navbatda: 1', ru: '9 / 10 · в очереди: 1' },
      { uz: '10 / 10 · navbatda: 0', ru: '10 / 10 · в очереди: 0' },
      { uz: '8 / 10 · navbatda: 2', ru: '8 / 10 · в очереди: 2' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Ikki joy bo'shadi — ularni navbatdagi ikkala o'yinchi oldi.", ru: 'Освободились два места — их заняли оба игрока из очереди.' }}
    explainWrong={{
      0: { uz: "Joylar to'ldi. Ularni kim oldi — navbatga qarang.", ru: 'Места заполнены. Кто их занял — посмотрите на очередь.' },
      1: { uz: "Navbatda odam kutyapti, joy esa bo'sh turibdi.", ru: 'В очереди ждёт человек, а место пустует.' },
      3: { uz: "Navbatda odam bo'lsa, bo'shagan joy bo'sh qolmaydi.", ru: 'Если в очереди есть люди, освободившееся место не пустует.' },
      default: { uz: 'Navbatga qarang.', ru: 'Посмотрите на очередь.' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA (QTushuncha keng): oxirgi joyga ikki so'rov — bir vaqtda bosish → talabga qator → yana bir vaqtda bosish =====
const S4_TAXMIN = [{ k: '1', t: { uz: 'Bittasi', ru: 'Один' } }, { k: '2', t: { uz: 'Ikkalasi', ru: 'Оба' } }];
const JOY = { bor9: { uz: 'joy bormi? · 9 / 10 — bor', ru: 'место есть? · 9 / 10 — есть' }, yoq10: { uz: "joy bormi? · 10 / 10 — yo'q", ru: 'место есть? · 10 / 10 — нет' } };
const S4_QATOR = { uz: 'Ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin.', ru: 'Даже если двое нажмут одновременно, на одно место не должны записаться два человека.' };
const S4_JORIY = { uz: "Bu misolda Backend joyni tekshirish va yozishni bitta ish qilib bajaradi: ikkinchi so'rov kutib turadi.", ru: 'В этом примере Backend проверяет место и записывает одним действием: второй запрос ждёт.' };
const S4_IZOH = { ikki: { uz: "Ikki so'rov ham «joy bor» deb ko'rdi.", ru: 'Оба запроса увидели «место есть».' }, kutdi: { uz: "Ikkinchi so'rov birinchisi tugashini kutdi.", ru: 'Второй запрос дождался, пока закончится первый.' } };
const r4 = (k, kl) => ({ k, o: OYIN_SAHNA.oyinchi[k === 'r1' ? 't1' : 't2'], h: 'qoshildi', t: '2026-10-09 19:42', kl });
const S4_BOSH = { t1: 'qoshilaman', t2: 'qoshilaman', son1: 9, son2: 9, bos: false, sorovlar: [], eshik: false, qulf: null, joriy: '', be: '', qatorlar: [], izoh: null, talab: 'yoq', agent: false };
const S4_OXIR = { ...S4_BOSH, t1: 'qoshildingiz', t2: 'toldi', son1: 10, son2: 10, sorovlar: [{ k: 's1', t: JOY.bor9, h: 'ok' }, { k: 's2', t: JOY.yoq10, h: 'no' }], qulf: 'ochiq', qatorlar: [r4('r1', '')], izoh: 'kutdi', talab: 'bor' };
const s4Tugma = (t, bos) => t === 'qoshilaman' ? [{ k: 'qoshilaman', bos }]
  : t === 'qoshildingiz' ? [{ k: 'qoshildingiz', h: 'off', yangi: true }]
    : [{ k: 'toldi', h: 'off', yangi: true }, { k: 'navbatga', yangi: true }];
// Talab kartasi (Mentor misoli, «bir vaqtda» qatorisiz) — qator qo'shilgach shu kartaga tushadi
const TalabKarta = ({ talab }) => (
  <div className={cxx('f3-talab', talab === 'bor' && 'tolgan')} data-talab="1">
    <span className="f3-talab-y">{tr(talab === 'bor' ? { uz: 'talab', ru: 'требование' } : { uz: 'talab — bu qatorsiz', ru: 'требование — без этой строки' })}</span>
    <span className="f3-talab-q">{tx({ uz: 'Qayerda: `…/qoshilish`', ru: 'Где: `…/qoshilish`' })}</span>
    <span className="f3-talab-q" data-talab-nima="1">{tr({ uz: "Nima qilsin: to'lmagan o'yinga qo'shsin", ru: 'Что сделать: добавлять в незаполненную игру' })}</span>
    {talab === 'bor' && <span className="f3-talab-q yangi">{tr(S4_QATOR)}</span>}
    <span className="f3-talab-q">{tr({ uz: 'Nima buzilmasin: «8 / 10» hisobi', ru: 'Что не сломать: счёт «8 / 10»' })}</span>
  </div>
);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 3 : 0);
  const [yur, setYur] = useState(false);
  const [h, setH] = useState(avval ? S4_OXIR : S4_BOSH);
  const qo = (p) => setH(x => ({ ...x, ...p }));
  const done = n >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const D = ms(PARVOZ_MS);
  const kut = (i) => !!taxmin && !yur && n === i;
  const ikkiKonvert = () => {
    uchir('[data-tel="1"] [data-btn="qoshilaman"]', '[data-yol="qoshilish"]', 'POST …/qoshilish');
    uchir('[data-tel="2"] [data-btn="qoshilaman"]', '[data-yol="qoshilish"]', 'POST …/qoshilish');
  };
  const bos1 = () => {
    if (!kut(0)) return;
    setYur(true); qo({ bos: true }); ikkiKonvert();
    keyin(() => { qo({ bos: false, joriy: 'qoshilish', be: 'on', sorovlar: [{ k: 's1', t: JOY.bor9, h: '' }, { k: 's2', t: JOY.bor9, h: '' }] }); korsat('[data-be]'); }, D);
    keyin(() => qo({ sorovlar: [{ k: 's1', t: JOY.bor9, h: 'ok' }, { k: 's2', t: JOY.bor9, h: 'ok' }] }), D + ms(550));
    keyin(() => { uchir('[data-sorov="s1"]', '[data-db]', ''); uchir('[data-sorov="s2"]', '[data-db]', ''); }, D + ms(950));
    keyin(() => { qo({ qatorlar: [r4('r1', 'kirok'), r4('r2', 'kirok')] }); korsat('[data-db]'); }, 2 * D + ms(950));
    keyin(() => { uchir('[data-be]', '[data-tel="1"] .f3-telefon', '201', 'javob'); uchir('[data-be]', '[data-tel="2"] .f3-telefon', '201', 'javob'); }, 2 * D + ms(1350));
    keyin(() => { qo({ t1: 'qoshildingiz', t2: 'qoshildingiz', son1: 11, son2: 11, izoh: 'ikki', joriy: '', be: 'xato', talab: 'karta' }); setN(1); setYur(false); keyin(() => korsat('.f3-harakat .q-btn'), 80); }, 3 * D + ms(1350));
  };
  const qosh = () => {
    if (!kut(1)) return;
    setYur(true);
    uchir('[data-talab-yangi]', '[data-talab-nima]', '');
    qo({ talab: 'uchdi' });
    keyin(() => qo({ talab: 'bor' }), D);
    keyin(() => qo({ agent: true }), D + ms(300));
    keyin(() => setH(x => ({ ...x, qatorlar: x.qatorlar.map(q => ({ ...q, kl: 'sondi' })) })), D + ms(700));
    keyin(() => { qo({ agent: false, t1: 'qoshilaman', t2: 'qoshilaman', son1: 9, son2: 9, qatorlar: [], sorovlar: [], izoh: null, be: '' }); setN(2); setYur(false); keyin(() => korsat('.f3-harakat .q-btn'), 80); }, D + ms(1300));
  };
  const bos2 = () => {
    if (!kut(2)) return;
    setYur(true); qo({ bos: true }); ikkiKonvert();
    keyin(() => { qo({ bos: false, joriy: 'qoshilish', be: 'on', qulf: 'yopiq', sorovlar: [{ k: 's1', t: JOY.bor9, h: '' }], eshik: true }); korsat('[data-be]'); }, D);
    keyin(() => qo({ sorovlar: [{ k: 's1', t: JOY.bor9, h: 'ok' }] }), D + ms(650));
    keyin(() => uchir('[data-sorov="s1"]', '[data-db]', ''), D + ms(1000));
    keyin(() => { qo({ qatorlar: [r4('r1', 'kirok')] }); korsat('[data-db]'); }, 2 * D + ms(1000));
    keyin(() => uchir('[data-be]', '[data-tel="1"] .f3-telefon', '201', 'javob'), 2 * D + ms(1350));
    keyin(() => qo({ t1: 'qoshildingiz', son1: 10, qulf: 'ochiq' }), 3 * D + ms(1350));
    keyin(() => qo({ eshik: false, sorovlar: [{ k: 's1', t: JOY.bor9, h: 'ok' }, { k: 's2', t: JOY.yoq10, h: '' }] }), 3 * D + ms(1750));
    keyin(() => qo({ sorovlar: [{ k: 's1', t: JOY.bor9, h: 'ok' }, { k: 's2', t: JOY.yoq10, h: 'no' }], be: 'xato' }), 3 * D + ms(2250));
    keyin(() => uchir('[data-be]', '[data-tel="2"] .f3-telefon', "409 · O'yin to'ldi", 'xato'), 3 * D + ms(2550));
    keyin(() => { qo({ t2: 'toldi', son2: 10, izoh: 'kutdi', joriy: '', be: '' }); setN(3); setYur(false); korsat('[data-tel="2"]'); }, 4 * D + ms(2550));
  };
  const tx4 = S4_TAXMIN.find(x => x.k === taxmin);
  const mentor = !taxmin ? { uz: "Ikkala telefonda «9 / 10» — bitta joy qoldi; avval taxminingizni belgilang.", ru: 'На обоих телефонах «9 / 10» — осталось одно место; сначала отметьте предположение.' }
    : done ? { uz: 'Ikkala urinish tugadi — natijani taxminingiz bilan solishtiring.', ru: 'Обе попытки сделаны — сравните результат со своим предположением.' }
      : n === 0 ? { uz: "«Bir vaqtda bosish»ni bosing va Backend'ga kelgan ikki so'rovni kuzating.", ru: 'Нажмите «Нажать одновременно» и следите за двумя запросами в Backend.' }
        : n === 1 ? { uz: "Bu talabda shu holat yozilmagan edi — qatorni talabga qo'shing.", ru: 'В этом требовании такой случай не был описан — добавьте строку в требование.' }
          : { uz: "Agent qaytadan qurdi — «Yana bir vaqtda bosish»ni bosing.", ru: 'Агент собрал заново — нажмите «Ещё раз нажать одновременно».' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · bir vaqtda bosish', ru: 'Понятие · одновременное нажатие' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }) : !done ? tr({ uz: `Tugmalarni tartib bilan bosing (${n}/3)`, ru: `Нажимайте кнопки по порядку (${n}/3)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Oxirgi joyni ikki kishi bir vaqtda bossa, <span className="italic" style={{ color: T.accent }}>nima bo'ladi</span>?</>, ru: <>Что будет, если на последнее место <span className="italic" style={{ color: T.accent }}>нажмут двое одновременно</span>?</> })}
        mentor={<Mentor>{tr(mentor)}</Mentor>}
        bashorat={<Bashorat savol={tr({ uz: "Ikkalasi bir lahzada bossa, nechta o'yinchi qo'shiladi?", ru: 'Если оба нажмут в один миг, сколько игроков присоединится?' })} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<Sahna tur="qator" boxRef={box} parvoz={parvoz}>
          <div className="f3-ikki-tel">
            <Tel id="1" rol={OYIN_SAHNA.rol.yangi1} son={h.son1} fokus={tugadi} tugmalar={s4Tugma(h.t1, h.bos)} />
            <Tel id="2" rol={OYIN_SAHNA.rol.yangi2} son={h.son2} fokus={tugadi} tugmalar={s4Tugma(h.t2, h.bos)} />
          </div>
          <Yolak />
          <div className="f3-sahna-ong f3-ong-keng">
            <div className="f3-ong-qator">
            <BeQuti yollar={['qoshilish']} joriy={h.joriy} holat={h.be} qulf={h.qulf} sorovlar={h.sorovlar} eshik={h.eshik} izoh={h.izoh && S4_IZOH[h.izoh]} />
            <IshJadval qatorlar={h.qatorlar} yigma={{ o: { uz: '9 ta', ru: '9' }, h: 'qoshildi' }} vaqtsiz />
            </div>
            {!tugadi && <div className="f3-harakat">
          <TalabKarta talab={h.talab} />
          <div className="f3-harakat-ong">
            {n === 0 && <QTugma className={cxx(kut(0) && 'f3-navbat')} disabled={!kut(0)} onClick={bos1}>{tr({ uz: 'Bir vaqtda bosish', ru: 'Нажать одновременно' })}</QTugma>}
            {n === 1 && h.talab === 'karta' && <>
              <span className="f3-qator-k" data-talab-yangi="1">{tr(S4_QATOR)}</span>
              <QTugma className={cxx(kut(1) && 'f3-navbat')} disabled={!kut(1)} onClick={qosh}>{tr({ uz: "Talabga qo'shish", ru: 'Добавить в требование' })}</QTugma>
            </>}
            {n === 1 && h.agent && <span className="f3-agent"><i aria-hidden="true" />{tr({ uz: 'agent qaytadan quryapti…', ru: 'агент собирает заново…' })}</span>}
            {n === 2 && <QTugma className={cxx(kut(2) && 'f3-navbat')} disabled={!kut(2)} onClick={bos2}>{tr({ uz: 'Yana bir vaqtda bosish', ru: 'Ещё раз нажать одновременно' })}</QTugma>}
              </div>
            </div>}
          </div>
        </Sahna>}
        natija={done && tx4 && <NatijaBlok togri={false}
          haqiqat={<Haqiqat taxmin={tr(tx4.t)} haqiqat={tr({ uz: 'qatorsiz — ikkalasi, qator bilan — bittasi', ru: 'без строки — оба, со строкой — один' })} />}
          izoh={tr(S4_JORIY)}
          xulosa={tr({ uz: 'Tekshirish va yozish bitta ish bo\'lsa, oxirgi joy bitta odamga tegadi. Buni talabda o\'zingiz yozasiz.', ru: 'Если проверка и запись — одно действие, последнее место достаётся одному человеку. Это вы пишете в требовании сами.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — TEST 2 (QuestionScreen → QTest; INLINE_KEYS.s5 = 0, A) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Oxirgi joyga ikki kishi yozildi: «11 / 10». Talabga nima qo'shasiz?"
    question={tr({ uz: <h2 className="title h-ask">Oxirgi joyga ikki kishi yozildi: <span className="f3-nw">«11 / 10»</span>. <span className="italic" style={{ color: T.accent }}>Talabga nima qo'shasiz?</span></h2>, ru: <h2 className="title h-ask">На последнее место записались двое: <span className="f3-nw">«11 / 10»</span>. <span className="italic" style={{ color: T.accent }}>Что вы добавите в требование?</span></h2> })}
    options={[
      { uz: 'Ikki kishi bir vaqtda bossa ham, joy bittasiga tegsin', ru: 'Даже если двое нажмут одновременно, место достанется одному' },
      { uz: "Tugma bir soniya o'chib tursin — bir vaqtda bosilmasin", ru: 'Кнопка пусть гаснет на секунду — чтобы не нажимали одновременно' },
      { uz: "O'yin to'lganda «Qo'shilaman» tugmasi ko'rinmasin", ru: 'Когда игра заполнена, кнопка «Qo\'shilaman» не видна' },
      { uz: "Ortiqcha o'yinchini tashkilotchi o'zi chiqarib yuborsin", ru: 'Лишнего игрока пусть убирает сам организатор' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Ikkala so'rov Backend'ga keladi — joyni u bittaga beradi.", ru: 'Оба запроса приходят в Backend — место он отдаёт одному.' }}
    explainWrong={{
      1: { uz: "Tugma bitta telefonda o'chadi — so'rovlar ikki telefondan.", ru: 'Кнопка гаснет на одном телефоне — а запросы с двух.' },
      2: { uz: 'Bosilgan payt ikkala telefonda ham «9 / 10» edi.', ru: 'В момент нажатия на обоих телефонах было «9 / 10».' },
      3: { uz: "Ikkalasi «Qo'shildingiz»ni ko'rgan — qaysi biri chiqadi?", ru: 'Оба увидели «Qo\'shildingiz» — кто из них выйдет?' },
      default: { uz: "So'rovlar qayerga kelishiga qarang.", ru: 'Посмотрите, куда приходят запросы.' }
    }} />
);

// ===== 🏅 BADGES (nishonlar, MD 3) — 1-savol, 2-savol (birinchi urinish) va A3 oxirgi «Bajardim» (bonus) =====
const ACHIEVEMENTS = {
  queueKeeper: { icon: '🎟️', name: 'Queue Keeper', desc: { uz: "Bo'shagan joyni navbatdagi olishini topdingiz", ru: 'Вы нашли, что освободившееся место берёт первый в очереди' } },
  lastSeat: { icon: '🪑', name: 'Last Seat', desc: { uz: 'Oxirgi joyni himoya qiladigan talab qatorini topdingiz', ru: 'Вы нашли строку требования, которая защищает последнее место' } },
  thirdFeature: { icon: '⚽', name: 'Third Feature', desc: { uz: 'Uch amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили все три блока практики до конца' } }
};
// Ekran id → nishon. Testlar — birinchi urinish; a3 — blok tugashi (bonus, MD).
const ACH_TRIGGERS = { s3: 'queueKeeper', s5: 'lastSeat', a3: 'thirdFeature' };

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


// Podium savol yorliqlari (kalitlar = SCORED_IDX: 4 — 1-savol, 7 — 2-savol; q22)
const Q_LABELS = {
  4: { uz: "1 — Bo'shagan joy", ru: '1 — Освободившееся место' },
  7: { uz: '2 — Oxirgi joy', ru: '2 — Последнее место' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'navbat', ru: 'очередь' }, l: 5, t: 10, s: 26, d: 19, dl: 0 },
  { ch: { uz: 'chiqish', ru: 'выход' }, l: 82, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: 'navbatda', l: 8, t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: 'qoshildi', l: 76, t: 66, s: 22, d: 21, dl: 2.2 },
  { ch: '409', l: 45, t: 86, s: 28, d: 25, dl: 1.1 },
  { ch: 'chiqdi', l: 64, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: 'Backend', l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: '10 / 10', l: 18, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'bitta ish', ru: 'одно действие' }, l: 52, t: 52, s: 18, d: 24, dl: 3.4 },
  { ch: 'Database', l: 30, t: 60, s: 18, d: 26, dl: 2.6 },
  { ch: 'Render', l: 88, t: 44, s: 18, d: 22, dl: 1.3 },
  { ch: 'Maydon Jamoa', l: 70, t: 44, s: 20, d: 22, dl: 0.2 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javoblar 4 pozitsiyaga TENG (MD: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12)
const QUIZ_BANK = [
  { q: { uz: "Qo'shilgan o'yinchi kela olmaydi. Ilovada nima qiladi?", ru: 'Присоединившийся игрок не сможет прийти. Что он делает в приложении?' }, opts: [
    { uz: "«O'yindan chiqish»ni bosadi", ru: "Нажимает «O'yindan chiqish»" }, { uz: "«Kelaman»ni bosmay kutadi", ru: 'Ждёт, не нажимая «Kelaman»' },
    { uz: 'Tashkilotchiga xabar yozadi', ru: 'Пишет сообщение организатору' }, { uz: "Ilovani telefondan o'chiradi", ru: 'Удаляет приложение с телефона' }], correct: 0 },
  { q: { uz: "To'lgan o'yinda o'ynamoqchisiz. Nimani bosasiz?", ru: 'Хотите сыграть в заполненной игре. Что нажмёте?' }, opts: [
    { uz: "«Qo'shilaman»ni qayta bosaman", ru: "Снова нажму «Qo'shilaman»" }, { uz: '«Navbatga yozilish»ni bosaman', ru: 'Нажму «Navbatga yozilish»' },
    { uz: "«Kelaman»ni o'yin kuni bosaman", ru: 'Нажму «Kelaman» в день игры' }, { uz: "«E'lon berish»ni yangidan bosaman", ru: "Заново нажму «E'lon berish»" }], correct: 1 },
  { q: { uz: "Bo'shagan joyni kim oladi?", ru: 'Кто получает освободившееся место?' }, opts: [
    { uz: "Ekranni birinchi yangilagan o'yinchi", ru: 'Игрок, первым обновивший экран' }, { uz: "Tashkilotchi o'zi tanlagan o'yinchi", ru: 'Игрок, которого выбрал организатор' },
    { uz: "Navbatga birinchi yozilgan o'yinchi", ru: 'Игрок, первым вставший в очередь' }, { uz: "Navbatga oxirgi yozilgan o'yinchi", ru: 'Игрок, последним вставший в очередь' }], correct: 2 },
  { q: { uz: "Navbat bo'sh, «10 / 10». Bir o'yinchi chiqdi — kartada nima?", ru: 'Очередь пуста, «10 / 10». Один игрок вышел — что на карточке?' }, opts: [
    { uz: "10 / 10 va «O'yin to'ldi»", ru: "10 / 10 и «O'yin to'ldi»" }, { uz: "9 / 10 va «O'yin to'ldi»", ru: "9 / 10 и «O'yin to'ldi»" },
    { uz: "10 / 10 va «Qo'shilaman»", ru: "10 / 10 и «Qo'shilaman»" }, { uz: "9 / 10 va «Qo'shilaman»", ru: "9 / 10 и «Qo'shilaman»" }], correct: 3 },
  { q: { uz: "Navbatdagi o'yinchi qo'shilganini qachon ko'radi?", ru: 'Когда игрок из очереди видит, что он присоединился?' }, opts: [
    { uz: 'Ekranni ochganda yoki yangilaganda', ru: 'Когда открывает или обновляет экран' }, { uz: "Tashkilotchi unga qo'ng'iroq qilganda", ru: 'Когда ему позвонит организатор' },
    { uz: "O'yin kuni maydonga borgan paytda", ru: 'Когда придёт на поле в день игры' }, { uz: "Navbatga yozilgan paytning o'zida", ru: 'В тот же момент, когда встал в очередь' }], correct: 0 },
  { q: { uz: "Jadvalda navbatdagi o'yinchi qanday turadi?", ru: 'Как в таблице записан игрок из очереди?' }, opts: [
    { uz: "`qoshildi` holatida, ro'yxatning oxirida", ru: 'В статусе `qoshildi`, в конце списка' }, { uz: '`navbatda` holatida, yozilgan vaqti bilan', ru: 'В статусе `navbatda`, со временем записи' },
    { uz: "`chiqdi` holatida, joy bo'shashini kutib", ru: 'В статусе `chiqdi`, ожидая места' }, { uz: "Alohida `navbat` jadvalida, o'z raqami bilan", ru: 'В отдельной таблице `navbat`, со своим номером' }], correct: 1 },
  { q: { uz: "Backend o'zgardi. Telefondagi ilova uni qachon ko'radi?", ru: 'Backend изменился. Когда приложение на телефоне это увидит?' }, opts: [
    { uz: 'Laptopda `npm run start:dev` qilgach', ru: 'После `npm run start:dev` на ноутбуке' }, { uz: "Telefonda Expo Go'ni qayta o'rnatgach", ru: 'После переустановки Expo Go на телефоне' },
    { uz: "Push'dan keyin Render yangilagach", ru: 'После push, когда Render обновит' }, { uz: "Neon'da jadvalni qayta ochib ko'rgach", ru: 'Когда заново откроете таблицу в Neon' }], correct: 2 },
  { q: { uz: "Talabda «bir vaqtda» yo'q. Ikki kishi oxirgi joyni bosdi — nima bo'lishi mumkin?", ru: 'В требовании нет «одновременно». Двое нажали на последнее место — что может случиться?' }, opts: [
    { uz: 'Ikkalasi ham rad etiladi, joy qoladi', ru: 'Обоим откажут, место останется' }, { uz: "Ilova ikkinchi bosishni o'zi o'chiradi", ru: 'Приложение само отключит второе нажатие' },
    { uz: 'Tashkilotchiga ikkalasidan xabar boradi', ru: 'Организатору придут сообщения от обоих' }, { uz: "Ikkalasi yoziladi, «11 / 10» bo'ladi", ru: 'Запишутся оба, станет «11 / 10»' }], correct: 3 },
  { q: { uz: 'Backend oxirgi joyni bitta odamga qanday beradi?', ru: 'Как Backend отдаёт последнее место одному человеку?' }, opts: [
    { uz: 'Tekshirish va yozishni bitta ish qiladi', ru: 'Делает проверку и запись одним действием' }, { uz: "Ikkalasini yozib, keyin birini o'chiradi", ru: 'Записывает обоих, потом одного удаляет' },
    { uz: "Yaqinroq telefonning so'rovini tanlaydi", ru: 'Выбирает запрос с ближайшего телефона' }, { uz: "Ikkala so'rovni ham rad etib qaytaradi", ru: 'Отклоняет оба запроса' }], correct: 0 },
  { q: { uz: "«Bitta ish» paytida ikkinchi so'rov nima qiladi?", ru: 'Что делает второй запрос во время «одного действия»?' }, opts: [
    { uz: "Birinchisidan oldin o'zi yoziladi", ru: 'Записывается раньше первого' }, { uz: 'Kutib turadi, keyin javob oladi', ru: 'Ждёт, потом получает ответ' },
    { uz: "Yo'qolib ketadi, javob kelmaydi", ru: 'Теряется, ответа нет' }, { uz: 'Birinchisi bilan birga yoziladi', ru: 'Записывается вместе с первым' }], correct: 1 },
  { q: { uz: "Bir lahzadagi ikki so'rovni qanday tekshirasiz?", ru: 'Как проверить два запроса в один миг?' }, opts: [
    { uz: "Ikki telefondan qo'lda bir vaqtda bosib", ru: 'Нажав вручную с двух телефонов одновременно' }, { uz: 'Bitta telefondan ikki marta tez bosib', ru: 'Быстро нажав дважды с одного телефона' },
    { uz: "Agentga bir vaqtda so'rov yubortirib", ru: 'Попросив агента отправить запросы одновременно' }, { uz: "Neon'da jadvalni qo'lda o'zgartirib", ru: 'Изменив таблицу в Neon вручную' }], correct: 2 },
  { q: { uz: "Uchinchi funksiyada «Nima buzilmasin»ga nima yoziladi?", ru: 'Что пишут в «Что не сломать» для третьей функции?' }, opts: [
    { uz: "Faqat yangi funksiyaning o'z tugmalari", ru: 'Только кнопки самой новой функции' }, { uz: '`README.md` va `.gitignore` fayllari', ru: 'Файлы `README.md` и `.gitignore`' },
    { uz: 'Render va Neon xizmatlaridagi sozlamalar', ru: 'Настройки в сервисах Render и Neon' }, { uz: "Oldingi ikki funksiyangiz va yo'llari", ru: 'Две ваши прежние функции и их пути' }], correct: 3 },
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4; tayanch 4, 9.1) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). steps [{ h, t, bandlar?, talab?, ipucha?, yordam?, err? }] · natija (kutilgan natija · namuna: Maydon Jamoa) · ortda (faqat A1).
// Talab: uch qatorni o'quvchi yozadi (tayanch 4: 11, 12, 14), har joy ostida kulrang savol-ipucha (KORPUS §32; QPrompt'da ipucha maydoni yo'q — qolip taklifi), namuna «Yordam» ortida.
// Qoralama — pm-m9d14-code (funksiya nomi va uch blok qatorlari; boshqa dars o'qimaydi). Trek — pm-m9d8-platforma (mobil | web); kalit yo'q — ikkala qator (M-q5).
const trekOqi = () => { try { const o = JSON.parse(localStorage.getItem('pm-m9d8-platforma') || 'null'); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; } catch { return null; } };
const NUSXA = { uz: 'Nusxalash', ru: 'Скопировать' };
const NUSXALANDI = { uz: '✓ Nusxalandi', ru: '✓ Скопировано' };
const TAYYOR_QATOR = { uz: "Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Больше ничего не трогай, назови изменённые файлы.' };
const TALAB_L = [
  { k: 'qayerda', l: { uz: 'Qayerda:', ru: 'Где:' }, joy: { uz: '{qayerda}', ru: '{где}' } },
  { k: 'nima', l: { uz: 'Nima qilsin:', ru: 'Что сделать:' }, joy: { uz: '{nima qilsin}', ru: '{что сделать}' } },
  { k: 'buz', l: { uz: 'Nima buzilmasin:', ru: 'Что не сломать:' }, joy: { uz: '{nima buzilmasin}', ru: '{что не сломать}' } }
];
const TalabPrompt = ({ blok, ipucha = [] }) => {
  const [q, setQ] = useState(() => { const o = qoralamaOl()[blok]; return Array.isArray(o) && o.length === 3 ? o : ['', '', '']; });
  const [ok, setOk] = useState(false);
  const toliq = q.every(x => String(x).trim());
  const yoz = (i, v) => setQ(x => { const y = x.map((z, j) => (j === i ? v : z)); qoralamaYoz(blok, y); return y; });
  const bosh = q.findIndex(x => !String(x).trim());
  const nusxa = async () => {
    if (!toliq) return;
    const matn = [...TALAB_L.map((j, i) => `${tr(j.l)} ${String(q[i]).trim()}`), tr(TAYYOR_QATOR)].join('\n');
    try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="q-prompt f3-talab-p">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa" disabled={!toliq} onClick={nusxa}>{ok ? tr(NUSXALANDI) : tr(NUSXA)}</button></span>
      {TALAB_L.map((j, i) => (
        <label key={j.k} className="f3-joy">
          <span className="f3-joy-q"><b className="f3-joy-l">{tr(j.l)}</b>
            <textarea className={cxx('f3-joy-i', i === bosh && 'bosh')} rows={1} value={q[i]} placeholder={tr(j.joy)} onChange={(e) => yoz(i, e.target.value)}
              onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }} /></span>
          {ipucha[i] && <span className="f3-joy-s">{tr(ipucha[i])}</span>}
        </label>
      ))}
      <span className="f3-ps">{tr(TAYYOR_QATOR)}</span>
    </span>
  );
};
const Yordam = ({ guruhlar }) => {
  const [ochiq, setOchiq] = useState(false);
  useEffect(() => { // ochilgan namuna va «Bajardim» bir ko'rinishda qolsin
    if (!ochiq) return;
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy .q-blok-tana > .q-btn') || document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 80);
    return () => clearTimeout(t);
  }, [ochiq]);
  return (
    <>
      <QTugma ikkinchi className="f3-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      {ochiq && <span className="f3-yordam fade-step">{guruhlar.map((g, gi) => (
        <React.Fragment key={gi}>
          {g.yorliq && <span className="f3-yordam-l">{tr(g.yorliq)}</span>}
          {(g.satrlar || []).map((l, i) => <span key={i} className="f3-yordam-s">{tx(l)}</span>)}
          {g.gap && <span className="f3-yordam-g">{tx(g.gap)}</span>}
        </React.Fragment>
      ))}</span>}
    </>
  );
};
// «Ortda qoldingizmi» — faqat A1 da, darsda bir marta (F-1006-271, SABOQ 39)
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'git checkout -f m11-dars-14-done'];
const Ortda = () => (
  <p className="f3-ortda">{tr({ uz: 'Ortda qoldingizmi — Mentor misolini oching:', ru: 'Отстали — откройте пример Ментора:' })} <code className="f3-buyruq">{ORTDA[0]}</code> · <code className="f3-buyruq">{ORTDA[1]}</code> — {tr({ uz: "qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.", ru: 'увидите, как это работает, и повторите шаг в своём репо по этому образцу.' })}</p>
);
// A1 tepasida: uchinchi funksiya nomi — kalitdan; yo'q bo'lsa bitta qatorli maydon (qoralama pm-m9d14-code, 1-ekran pastki qatori shundan o'qiydi)
const FunksiyaQator = () => {
  const [nom] = useState(roadmapNom);
  const [o, setO] = useState(() => String(qoralamaOl().nom || ''));
  return (
    <p className="f3-funk">{tr({ uz: 'Uchinchi funksiyangiz:', ru: 'Ваша третья функция:' })} {nom
      ? <b>{nom}</b>
      : <input className="f3-funk-i" value={o} placeholder={tr({ uz: "Roadmap'ingizdagi uchinchi funksiya nomi", ru: 'Название третьей функции из вашего roadmap' })} onChange={(e) => { setO(e.target.value); qoralamaYoz('nom', e.target.value); }} />}</p>
  );
};
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, tepa, steps, natija, ortda, doneText, izoh }) {
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
  // Yangi ochilgan qadam (uzun prompt) «Bajardim»i bilan birga ko'rinsin — kompyuterda ham
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 8: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<><Mentor>{tr(mGap)}</Mentor>{tepa}</>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: <>{tx(c.t)}{c.bandlar && c.bandlar.map((b, i) => <span key={i} className="f3-band">{tx(b)}</span>)}{c.talab && <TalabPrompt blok={c.talab} ipucha={c.ipucha} />}</>,
          xato: c.yordam ? <Yordam guruhlar={c.yordam} /> : (c.err && tx(c.err))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tx(doneText)} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
        pastki={<>{done && izoh && <QIzoh>{tr(izoh)}</QIzoh>}<MentorPracticeStats live={_live} screen={screen} /></>}>
        {ortda && <Ortda />}
      </QBlok>
    </Stage>
  );
}
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const QADAM = {
  ochish: { uz: 'Ochish', ru: 'Открыть' }, prompt: { uz: 'Prompt', ru: 'Промпт' }, ishga: { uz: 'Ishga tushirish', ru: 'Запуск' },
  neon: { uz: "Neon'da tekshirish", ru: 'Проверка в Neon' }, telefon: { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }
};
const XATO_GAP = { uz: "Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка — отправьте агенту строку ошибки (не значения `.env` и не токен): «Вышла такая ошибка: {ошибка}. Исправь.»' };
const MENTOR_MISOL = { uz: 'Mentor misoli', ru: 'Пример Ментора' };
const TEKSHIR_T = { uz: 'talabning har qatorini tekshiring:', ru: 'проверьте каждую строку требования:' };

// Kutilgan natija maketlari (o'ng) — bir marta o'zi yuradi (kam harakatda — oxirgi kadr)
const useKadr = (soni, qadam = 1700) => {
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [k, setK] = useState(kam ? soni - 1 : 0);
  useEffect(() => { if (kam) return; for (let i = 1; i < soni; i++) keyin(() => setK(i), i * qadam); }, []); // eslint-disable-line
  return k;
};
const Chat = ({ satrlar, d = 0 }) => (
  <div className="f3-chat f3-kir" style={{ '--d': d + 's' }}>
    <span className="f3-chat-h">Antigravity</span>
    {satrlar.map((s, i) => <code key={i} className={cxx('f3-chat-q', s.h)} style={{ '--d': (d + 0.3 + i * 0.32) + 's' }}>{s.t}</code>)}
  </div>
);
const SqlKarta = ({ sorov, natija, izoh, d = 0 }) => (
  <div className="f3-sql f3-kir" style={{ '--d': d + 's' }}>
    <span className="f3-sql-h">Neon · SQL Editor</span>
    <code className="f3-sql-k">{sorov}</code>
    <span className="f3-sql-n">{natija.map((r, i) => <code key={i} className={cxx('f3-holat', r.h)}>{r.t}</code>)}</span>
    {izoh && <span className="f3-sql-i">{tx(izoh)}</span>}
  </div>
);
const A1Natija = () => (
  <div className="f3-nat">
    <Chat d={0.1} satrlar={[{ t: "tekshiruv o'yini id 5 · 2 kishi kerak" }, { t: "o'yinchi 1, 2 · qoshilish → 201" }, { t: "o'yinchi 3 · navbat → 201 · navbatda", h: 'navbatda' }, { t: "o'yinchi 1 · chiqish → 201 · chiqdi" }, { t: "o'yinchi 3 → qoshildi", h: 'ok' }]} />
    <SqlKarta d={2.1} sorov="SELECT oyinchi_id, holat FROM ishtirokchilar WHERE oyin_id = 5;" natija={[{ t: '1 · chiqdi', h: 'chiqdi' }, { t: '2 · qoshildi', h: 'qoshildi' }, { t: '3 · qoshildi', h: 'qoshildi' }]}
      izoh={{ uz: "`5` — Mentor misolidagi tekshiruv o'yini; sizda — agent aytgan `id`.", ru: '`5` — проверочная игра из примера Ментора; у вас — `id`, который назвал агент.' }} />
  </div>
);
const A2Natija = () => (
  <div className="f3-nat">
    <Chat d={0.1} satrlar={[{ t: "tekshiruv o'yini id 6 · 2 kishi kerak · 1 joy qoldi" }, { t: "5 so'rov birga (Promise.all)" }, { t: '1 → 201 · qoshildi', h: 'ok' }, { t: "4 → 409 · O'yin to'ldi", h: 'xato' }]} />
    <SqlKarta d={1.8} sorov="SELECT holat, COUNT(*) FROM ishtirokchilar WHERE oyin_id = 6 GROUP BY holat;" natija={[{ t: 'qoshildi · 2', h: 'qoshildi' }]}
      izoh={{ uz: "oldin 1 + yangi 1; `6` — Mentor misolida, sizda — agent aytgan `id`.", ru: 'было 1 + новый 1; `6` — в примере Ментора, у вас — `id`, который назвал агент.' }} />
  </div>
);
// A3: telefon maketi (Expo Go) — «O'yinlar» → «O'yin» (2-akkaunt) → 1-akkaunt chiqadi → 2-akkauntda pastga tortiladi
const A3_ROYXAT = [
  { kun: { uz: 'Shanba', ru: 'Суббота' }, q: [{ s: '18:00', m: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, n: '8 / 10' }, { s: '20:00', m: { uz: 'Maktab maydoni', ru: 'Школьное поле' }, n: '6 / 10' }] },
  { kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, q: [{ s: '10:00', m: { uz: 'Park maydoni', ru: 'Поле в парке' }, n: '4 / 8' }, { s: '17:00', m: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, n: '10 / 10', nav: 1 }] }
];
const AKK = { a1: { uz: '1-akkaunt', ru: '1-й аккаунт' }, a2: { uz: '2-akkaunt', ru: '2-й аккаунт' } };
const RoyxatTel = () => (
  <div className="f3-tel-ust">
    <span className="f3-rol">{tr(AKK.a2)} · {tr(OYIN_SAHNA.yozuv.orqa)}</span>
    <div className="f3-telefon">
      <span className="f3-tel-bar"><b className="f3-tel-nom">{OYIN_SAHNA.ilova}</b></span>
      <div className="f3-tel-ekran f3-royxat">
        <b className="f3-sar">{tr(OYIN_SAHNA.yozuv.orqa)}</b>
        {A3_ROYXAT.map((g, gi) => (
          <React.Fragment key={gi}>
            <span className="f3-kun-h">{tr(g.kun)}</span>
            {g.q.map((o, i) => (
              <span key={i} className={cxx('f3-karta', o.nav !== undefined && 'joriy')}>
                <b>{o.s}</b><span className="f3-karta-m">{tr(o.m)}</span><code className="f3-karta-n">{o.n}</code>
                {o.nav !== undefined && <span className="f3-karta-nav">{tr(OYIN_SAHNA.yozuv.navbatda)} {o.nav}</span>}
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);
const A3Natija = () => {
  const k = useKadr(5, 1600);
  const Y = OYIN_SAHNA.yozuv;
  return (
    <div className="f3-nat f3-nat-tel" key={k}>
      {k === 0 && <RoyxatTel />}
      {k === 1 && <Tel rol={AKK.a2} navbatda={1} yozuv={Y.navbatdasiz} tugmalar={telTugma('navbatda')} />}
      {k === 2 && <Tel rol={AKK.a1} navbatda={1} tugmalar={telTugma('ichida')} oyna="ha" />}
      {k === 3 && <Tel rol={AKK.a2} navbatda={1} yozuv={Y.navbatdasiz} tugmalar={telTugma('navbatda')} tort="yur" />}
      {k >= 4 && <Tel rol={AKK.a2} navbatda={0} doira={{ i: 9, h: 'yangi' }} tugmalar={telTugma('ichida')} />}
    </div>
  );
};

const A1_STEPS = [
  { h: QADAM.ochish, t: { uz: "Antigravity'da o'z repo'ngizni oching (13-darsdagi holat). Terminalda `cd backend`, `npm run start:dev` — xato yo'q.", ru: 'Откройте свой репо в Antigravity (состояние после 13-го урока). В терминале `cd backend`, `npm run start:dev` — без ошибок.' },
    bandlar: [
      { uz: "`README.md` dagi arxitekturaga qarang: funksiyangiz qaysi jadvalga nima yozadi? Oldingi ikki funksiyadan biri tugamagan bo'lsa — avval uni tugating.", ru: 'Посмотрите архитектуру в `README.md`: что и в какую таблицу пишет ваша функция? Если одна из двух прежних функций не закончена — сначала закончите её.' },
      { uz: "Funksiyangiz Database'ga yozmasa (masalan, faqat ko'rsatadi) — bu blokda u ishlatadigan Backend yo'lini quring.", ru: 'Если ваша функция не пишет в Database (например, только показывает) — в этом блоке постройте путь в Backend, которым она пользуется.' }
    ] },
  { h: QADAM.prompt, t: { uz: "vazifa: funksiyangizga kerak Backend qismi ishlasin; harakat yangi holatni saqlasa — Database'ga yozilsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'задача: пусть заработает нужная вашей функции часть Backend; если действие сохраняет новое состояние — пусть записывается в Database. Напишите три строки сами, нажмите «Скопировать», отправьте в Antigravity:' },
    talab: 'a1',
    ipucha: [
      { uz: "qaysi papka, qaysi yo'l va jadval?", ru: 'какая папка, какой путь и таблица?' },
      { uz: 'foydalanuvchi nima qiladi, jadvalga nima yoziladi?', ru: 'что делает пользователь, что пишется в таблицу?' },
      { uz: "qaysi yo'llar va ustunlar o'zgarmasin?", ru: 'какие пути и столбцы не должны измениться?' }
    ],
    yordam: [{ yorliq: MENTOR_MISOL, satrlar: [
      { uz: "Qayerda: `backend/` — yangi yo'llar `POST /oyinlar/:id/navbat` va `POST /oyinlar/:id/chiqish`, ikkalasi token bilan; jadval `ishtirokchilar`.", ru: 'Где: `backend/` — новые пути `POST /oyinlar/:id/navbat` и `POST /oyinlar/:id/chiqish`, оба с токеном; таблица `ishtirokchilar`.' },
      { uz: "Nima qilsin: `navbat` — o'yin to'lgan bo'lsa, o'yinchini `navbatda` holatida yozsin; to'lmagan bo'lsa — `409`.", ru: 'Что сделать: `navbat` — если игра заполнена, записывает игрока со статусом `navbatda`; если нет — `409`.' },
      { uz: "`chiqish` — qo'shilgan yoki navbatdagi o'yinchini `chiqdi` qilsin. Qo'shilgan o'yinchi chiqsa va navbatda odam bo'lsa, navbatga eng birinchi yozilgan o'yinchi `qoshildi` bo'lsin.", ru: '`chiqish` — делает присоединившегося или стоящего в очереди игрока `chiqdi`. Если вышел присоединившийся и в очереди есть люди, первый вставший в очередь становится `qoshildi`.' },
      { uz: "`GET /oyinlar` har o'yinda `navbatda` (navbatdagilar soni) va `menNavbatdaman` ni ham bersin.", ru: '`GET /oyinlar` пусть в каждой игре отдаёт ещё `navbatda` (число в очереди) и `menNavbatdaman`.' },
      { uz: "Nima buzilmasin: `POST /oyinlar`, `…/qoshilish` va `…/tasdiq` yo'llari, «8 / 10» hisobi va jadval ustunlari. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: пути `POST /oyinlar`, `…/qoshilish` и `…/tasdiq`, счёт «8 / 10» и столбцы таблицы. Больше ничего не трогай, назови изменённые файлы.' }
    ] }] },
  { h: QADAM.ishga, t: { uz: "Backend terminali o'zi qayta yuklanadi, xato yo'q. Antigravity'ga yozing: «Yangi yo'llarni tekshir: tekshiruv uchun yangi yozuvlar yarat, ularning `id` larini ayt, so'rov yubor va har biri nima qaytarganini ayt.»", ru: 'Терминал Backend перезагружается сам, ошибок нет. Напишите в Antigravity: «Проверь новые пути: создай для проверки новые записи, назови их `id`, отправь запросы и скажи, что вернул каждый.»' }, err: XATO_GAP },
  { h: QADAM.neon, t: TEKSHIR_T,
    bandlar: [
      { uz: '(1) Agent aytgan javoblar talabingizdagidek.', ru: '(1) Ответы, которые назвал агент, — как в вашем требовании.' },
      { uz: "(2) Neon'dagi SQL Editor'da funksiyangiz yozadigan jadvalni oching — agent aytgan o'zgarish jadvalda ham bor. Agent nima desa ham, jadval shuni ko'rsatsin.", ru: '(2) В SQL Editor в Neon откройте таблицу, в которую пишет ваша функция, — изменение, о котором сказал агент, есть и в таблице. Что бы ни сказал агент, это должна показать таблица.' },
      { uz: "(3) Antigravity'ga yozing: «Faqat hozir yaratgan tekshiruv yozuvlarini — aytgan `id` laring bo'yicha — o'chir.» — jadvalda ular qolmasin, boshqa qatorlar joyida. Mos kelmagan qatorni uch qism bilan agentga yozing.", ru: '(3) Напишите в Antigravity: «Удали только что созданные проверочные записи — по названным тобой `id`.» — в таблице их не должно остаться, остальные строки на месте. Несовпавшую строку опишите агенту в трёх частях.' }
    ] }
];
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · Backend', ru: 'Практика 1 · Backend' }}
    title={{ uz: <>Uchinchi funksiyaning <span className="italic" style={{ color: T.accent }}>Backend qismi</span> ishlasin.</>, ru: <>Пусть <span className="italic" style={{ color: T.accent }}>часть Backend</span> третьей функции заработает.</> }}
    mentor={{ uz: "Uch qatorni o'zingiz yozasiz, Mentor misoli «Yordam»da; «1 · Ochish»dan boshlang.", ru: 'Три строки пишете сами, пример Ментора — в «Помощь»; начните с «1 · Открыть».' }}
    tepa={<FunksiyaQator />} steps={A1_STEPS} natija={<A1Natija />} ortda
    doneText={{ uz: "Backend yangi harakatni Database'ga yozadi. Bu misolda chiqqan o'yinchining joyini navbatdagi oldi.", ru: 'Backend записывает новое действие в Database. В этом примере место вышедшего игрока занял первый в очереди.' }} />
);

const A2_STEPS = [
  { h: QADAM.ochish, t: { uz: "Backend laptopda ishlab tursin. Funksiyangizda ikki holatni o'ylab ko'ring: bitta odam tugmani ikki marta tez bossa · ikki odam bir lahzada bossa.", ru: 'Пусть Backend работает на ноутбуке. Продумайте для своей функции два случая: один человек быстро нажал кнопку дважды · два человека нажали в один миг.' },
    bandlar: [{ uz: "Qaysi yozuv ikki marta tushishi yoki chegaradan oshishi mumkin? Funksiyangiz umumiy ma'lumotga yozmasa — tez ikki marta bosishda nima buzilishi mumkinligini toping; hech narsa buzilmasa — Mentor bilan funksiyangizga mos boshqa tekshiruvni tanlang.", ru: 'Какая запись может попасть дважды или превысить предел? Если ваша функция не пишет в общие данные — найдите, что может сломаться при быстром двойном нажатии; если ничего — выберите с Ментором другую подходящую проверку.' }] },
  { h: QADAM.prompt, t: { uz: "uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'напишите три строки сами, нажмите «Скопировать», отправьте в Antigravity:' },
    talab: 'a2',
    ipucha: [
      { uz: "qaysi yo'llar?", ru: 'какие пути?' },
      { uz: "ikki so'rov bir lahzada kelsa, nima bo'lsin?", ru: 'что должно быть, если два запроса придут в один миг?' },
      { uz: "qaysi javoblar va sonlar o'zgarmasin?", ru: 'какие ответы и числа не должны измениться?' }
    ],
    yordam: [{ yorliq: MENTOR_MISOL, satrlar: [
      { uz: "Qayerda: `backend/` — `POST /oyinlar/:id/qoshilish`, `…/navbat` va `…/chiqish`.", ru: 'Где: `backend/` — `POST /oyinlar/:id/qoshilish`, `…/navbat` и `…/chiqish`.' },
      { uz: 'Nima qilsin: ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin: joyni tekshirish va yozish bitta ish bo\'lsin, shu payt boshqa so\'rov kutib tursin.', ru: 'Что сделать: даже если двое нажмут одновременно, на одно место не должны записаться два человека: проверка места и запись — одно действие, в это время другой запрос ждёт.' },
      { uz: "Chiqqan o'yinchining joyini navbatdagi shu ishning ichida olsin. Bitta o'yinchi bir o'yinga ikki marta yozilmasin.", ru: 'Место вышедшего игрока первый в очереди получает внутри того же действия. Один игрок не записывается в одну игру дважды.' },
      { uz: "Nima buzilmasin: yo'llarning javoblari va «8 / 10» hisobi. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: ответы путей и счёт «8 / 10». Больше ничего не трогай, назови изменённые файлы.' }
    ] }] },
  { h: QADAM.ishga, t: { uz: "Backend terminali o'zi qayta yuklanadi, xato yo'q. Antigravity'ga yozing: «Birga yuboriladigan so'rovlar bilan tekshir: yangi tekshiruv yozuvi yarat (`id` sini ayt), oxirgi joyga beshta so'rovni birga yubor. Qaysi usul bilan yuborganingni va har javobni ayt.»", ru: 'Терминал Backend перезагружается сам, ошибок нет. Напишите в Antigravity: «Проверь запросами, отправленными вместе: создай новую проверочную запись (назови её `id`), отправь на последнее место пять запросов вместе. Скажи, каким способом отправил, и каждый ответ.»' }, err: XATO_GAP },
  { h: QADAM.neon, t: TEKSHIR_T,
    bandlar: [
      { uz: '(1) Agent javobida beshtadan faqat bittasi o\'tgan, qolganlari rad etilgan.', ru: '(1) В ответе агента из пяти прошёл только один, остальные отклонены.' },
      { uz: "(2) Neon'dagi SQL Editor'da jadvalingizni oching — tekshiruv yozuvlari soni chegaradan oshmagan, bitta odam ikki marta yozilmagan. Agent nima desa ham, jadval shuni ko'rsatsin.", ru: '(2) Откройте свою таблицу в SQL Editor в Neon — число проверочных записей не превысило предел, один человек не записан дважды. Что бы ни сказал агент, это должна показать таблица.' },
      { uz: "(3) Antigravity'ga yozing: «Faqat hozir yaratgan tekshiruv yozuvlarini — aytgan `id` laring bo'yicha — o'chir.» Mos kelmagan qatorni uch qism bilan agentga yozing.", ru: '(3) Напишите в Antigravity: «Удали только что созданные проверочные записи — по названным тобой `id`.» Несовпавшую строку опишите агенту в трёх частях.' }
    ] }
];
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · bir vaqtda bosish', ru: 'Практика 2 · одновременное нажатие' }}
    title={{ uz: <>Ikki kishi bir vaqtda bossa ham, <span className="italic" style={{ color: T.accent }}>yozuv to'g'ri qolsin</span>.</>, ru: <>Даже если двое нажмут одновременно, <span className="italic" style={{ color: T.accent }}>запись должна остаться верной</span>.</> }}
    mentor={{ uz: "Funksiyangizga ikki so'rov bir lahzada kelsa nima buzilishi mumkin — talabni shunga yozing; «1 · Ochish»dan boshlang.", ru: 'Что может сломаться, если в вашу функцию придут два запроса в один миг, — под это и пишите требование; начните с «1 · Открыть».' }}
    steps={A2_STEPS} natija={<A2Natija />}
    izoh={{ uz: "Qo'lda bosilganda so'rovlar bir lahzaga kamdan-kam tushadi — shuning uchun agent so'rovlari bilan tekshirasiz.", ru: 'При ручном нажатии запросы редко попадают в один миг — поэтому проверяете запросами агента.' }}
    doneText={{ uz: "Ikki so'rov bir lahzada kelsa ham, yozuv to'g'ri qoladi. Bu misolda oxirgi joy bitta odamga tegdi.", ru: 'Даже если два запроса придут в один миг, запись остаётся верной. В этом примере последнее место досталось одному человеку.' }} />
);

const A3_YORDAM_MOBIL = [
  { uz: "Qayerda: `mobil/` — «O'yin» ekrani (`src/app/oyin/[id].tsx`) va «O'yinlar» kartasi.", ru: 'Где: `mobil/` — экран «O\'yin» (`src/app/oyin/[id].tsx`) и карточка «O\'yinlar».' },
  { uz: "Nima qilsin: o'yin to'lgan bo'lsa, «O'yin to'ldi» o'rnida «Navbatga yozilish» tugmasi bo'lsin — `POST /oyinlar/:id/navbat`; navbatdagi o'yinchi «Navbatdasiz» yozuvini ko'rsin.", ru: 'Что сделать: если игра заполнена, вместо «O\'yin to\'ldi» — кнопка «Navbatga yozilish» — `POST /oyinlar/:id/navbat`; игрок в очереди видит надпись «Navbatdasiz».' },
  { uz: "Qo'shilgan va navbatdagi o'yinchida «O'yindan chiqish» tugmasi bo'lsin — `POST /oyinlar/:id/chiqish`, bosilganda «Rostdan chiqasizmi?» deb so'rasin.", ru: 'У присоединившегося и стоящего в очереди игрока — кнопка «O\'yindan chiqish» — `POST /oyinlar/:id/chiqish`, при нажатии спрашивает «Rostdan chiqasizmi?».' },
  { uz: "«O'yinlar» kartasida «Navbatda: N» chiqsin. «O'yin» ekranida ham pastga tortilsa, o'yin qayta so'ralsin.", ru: 'На карточке «O\'yinlar» показывается «Navbatda: N». На экране «O\'yin» тоже при оттягивании вниз игра запрашивается заново.' },
  { uz: "Nima buzilmasin: e'lon berish, «Qo'shilaman», o'yin kunidagi «Kelaman», kun sarlavhalari va animatsiyalar. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: создание объявления, «Qo\'shilaman», «Kelaman» в день игры, заголовки дней и анимации. Больше ничего не трогай, назови изменённые файлы.' }
];
const A3_WEB_GAP = { uz: "Web-trekda: «Qayerda» — o'yin sahifasi; pastga tortish o'rniga «Yangilash» tugmasi — sahifa ochilganda va shu tugma bosilganda so'raladi, «Rostdan chiqasizmi?» — brauzer oynasida.", ru: 'В веб-треке: «Где» — страница игры; вместо оттягивания вниз — кнопка «Yangilash»: запрос при открытии страницы и при нажатии этой кнопки, «Rostdan chiqasizmi?» — в окне браузера.' };
const TREK_YORLIQ = { mobil: { uz: 'Mentor misoli · mobil trek', ru: 'Пример Ментора · мобильный трек' }, web: { uz: 'web-trek', ru: 'веб-трек' } };
const a3Qadamlar = (trek) => [
  { h: QADAM.ochish, t: { uz: "ilova papkangizni oching. Ikkinchi akkaunt tayyorlang: o'zingizda «Hisobdan chiqish»dan keyin namuna ism va boshqa namuna telefon bilan ro'yxatdan o'ting (yoki sinfdoshingiz telefonida — 12-darsdagidek) — funksiyani ikki foydalanuvchi bilan tekshirasiz.", ru: 'откройте папку приложения. Подготовьте второй аккаунт: у себя после «Hisobdan chiqish» зарегистрируйтесь с образцовым именем и другим образцовым телефоном (или на телефоне одноклассника — как на 12-м уроке) — функцию проверите с двумя пользователями.' } },
  { h: QADAM.prompt, t: { uz: "vazifa: funksiyangiz ilovada ko'rinsin va Backend'dagi yangi yo'llarni chaqirsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'задача: функция видна в приложении и вызывает новые пути в Backend. Напишите три строки сами, нажмите «Скопировать», отправьте в Antigravity:' },
    talab: 'a3',
    ipucha: [
      { uz: 'qaysi ekran va qaysi tugma?', ru: 'какой экран и какая кнопка?' },
      { uz: "bosilganda nima bo'ladi, ekranda nima ko'rinadi?", ru: 'что происходит при нажатии, что видно на экране?' },
      { uz: 'oldingi ikki funksiya va animatsiyalar', ru: 'две прежние функции и анимации' }
    ],
    yordam: [
      { yorliq: trek === 'mobil' ? MENTOR_MISOL : TREK_YORLIQ.mobil, satrlar: A3_YORDAM_MOBIL },
      trek !== 'mobil' && { yorliq: TREK_YORLIQ.web, gap: A3_WEB_GAP }
    ].filter(Boolean) },
  { h: QADAM.ishga, t: { uz: "(a) Backend'ni yangilang: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"uchinchi funksiya\"`, `git push`. Render push'dan keyin Backend'ni o'zi qayta deploy qiladi — Render'dagi xizmatingizda yangi deploy tugashini kuting.", ru: '(a) Обновите Backend: `git status` — изменённые файлы совпадают со списком агента, `.env` в списке нет; каждый файл добавьте через `git add <fayl>`, `git commit -m "uchinchi funksiya"`, `git push`. После push Render сам заново деплоит Backend — дождитесь окончания нового деплоя в своём сервисе на Render.' },
    bandlar: [
      trek !== 'web' && { uz: "(b) Mobil trekda: `npx expo start`, QR'ni telefonda Expo Go bilan oching; QR ochilmasa — telefon va laptop bitta Wi-Fi'dami? Bo'lmasa: `npx expo start --tunnel`.", ru: '(b) В мобильном треке: `npx expo start`, откройте QR в Expo Go на телефоне; если QR не открывается — телефон и ноутбук в одной Wi-Fi? Если нет: `npx expo start --tunnel`.' },
      trek !== 'mobil' && { uz: "Web-trekda: push'dan keyin Netlify saytni o'zi yangilaydi.", ru: 'В веб-треке: после push Netlify сам обновляет сайт.' }
    ].filter(Boolean),
    err: XATO_GAP },
  { h: QADAM.telefon, t: TEKSHIR_T,
    bandlar: [
      { uz: "(1) Funksiyangizni ikki akkaunt bilan bajaring; ikkinchisida ekranni pastga torting (web-trekda sahifani yangilang) — o'zgarish u yerda ham ko'rinsin.", ru: '(1) Выполните функцию с двумя аккаунтами; во втором потяните экран вниз (в веб-треке обновите страницу) — изменение должно быть видно и там.' },
      { uz: '(2) Oldingi ikki funksiyangizni bir marta bajaring — avvalgidek ishlasin.', ru: '(2) Один раз выполните две прежние функции — пусть работают как раньше.' },
      { uz: "(3) Bepul Backend uxlab qolgan bo'lsa, birinchi javob bir daqiqagacha kechikishi mumkin. Oxirida yangi o'zgarish bo'lsa: `git status` → `git add <fayl>` → commit → `git push`.", ru: '(3) Если бесплатный Backend уснул, первый ответ может задержаться до минуты. Если в конце есть новые изменения: `git status` → `git add <fayl>` → commit → `git push`.' }
    ] }
];
const ScreenA3 = (props) => {
  const [trek] = useState(trekOqi);
  const steps = useMemo(() => a3Qadamlar(trek), [trek]);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 3 · ilova', ru: 'Практика 3 · приложение' }}
      title={{ uz: <>Uchinchi funksiya <span className="italic" style={{ color: T.accent }}>telefonda ishlasin</span>, oldingilari ham.</>, ru: <>Пусть третья функция <span className="italic" style={{ color: T.accent }}>работает на телефоне</span>, и прежние тоже.</> }}
      mentor={{ uz: "Endi «Nima buzilmasin» qatoriga oldingi ikki funksiyangizni yozing; «1 · Ochish»dan boshlang.", ru: 'Теперь в строку «Что не сломать» впишите две свои прежние функции; начните с «1 · Открыть».' }}
      steps={steps} natija={<A3Natija />}
      izoh={{ uz: "Navbatdagi o'yinchi qo'shilganini ekranni yangilaganda ko'radi. Eslatma Mentor roadmap'ida «keyinroq».", ru: 'Игрок из очереди видит, что присоединился, когда обновляет экран. Напоминание в roadmap Ментора — «позже».' }}
      doneText={{ uz: 'Uchinchi funksiya telefonda ishlaydi, oldingi ikkitasi ham joyida.', ru: 'Третья функция работает на телефоне, две прежние тоже на месте.' }} />
  );
};

// ===== 🃏 KARTOCHKALAR — alohida ekran (SABOQ 12, 16): Mentor yo'q, birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma =====
const KARTALAR = [
  { front: { uz: 'Mentor misolida uchinchi funksiya qaysi?', ru: 'Какая третья функция в примере Ментора?' }, back: { uz: "O'yindan chiqish va navbat", ru: 'Выход из игры и очередь' }, note: { uz: "Chiqqan o'yinchining joyi bo'shaydi, to'lgan o'yinda navbatga yoziladi", ru: 'Место вышедшего освобождается, в заполненной игре встают в очередь' } },
  { front: { uz: "Ilovada o'yindan chiqish yo'li bo'lmasa, nima bo'ladi?", ru: 'Что будет, если в приложении нет выхода из игры?' }, back: { uz: 'Kela olmaydigan o\'yinchining joyi band turadi', ru: 'Место игрока, который не придёт, остаётся занятым' }, note: { uz: "O'ynamoqchi bo'lgan odam «O'yin to'ldi»ni ko'radi", ru: "Желающий играть видит «O'yin to'ldi»" } },
  { front: { uz: "To'lgan o'yinda «O'yin to'ldi» o'rnida qaysi tugma chiqadi?", ru: "Какая кнопка появляется вместо «O'yin to'ldi» в заполненной игре?" }, back: { uz: '«Navbatga yozilish»', ru: '«Navbatga yozilish»' }, note: { uz: "Bosilsa, o'yinchi `navbatda` holatida yoziladi", ru: 'При нажатии игрок записывается со статусом `navbatda`' } },
  { front: { uz: "Qo'shilgan o'yinchi chiqsa, bo'shagan joyni kim oladi?", ru: 'Кто получает место, если присоединившийся игрок вышел?' }, back: { uz: "Navbatga birinchi yozilgan o'yinchi", ru: 'Игрок, первым вставший в очередь' }, note: { uz: "Navbat bo'sh bo'lsa — joy bo'sh qoladi, «Qo'shilaman» qaytadi", ru: "Если очередь пуста — место свободно, возвращается «Qo'shilaman»" } },
  { front: { uz: "Navbatdagi o'yinchi qo'shilganini qachon ko'radi?", ru: 'Когда игрок из очереди видит, что присоединился?' }, back: { uz: 'Ekranni ochganda yoki pastga tortib yangilaganda', ru: 'Когда открывает экран или тянет его вниз' }, note: { uz: "Navbat holati — real vaqt nuqtasi: bu modulda ilova uni ekran ochilganda va pastga tortilganda so'raydi", ru: 'Состояние очереди — точка реального времени: в этом модуле приложение запрашивает его при открытии экрана и оттягивании вниз' } },
  { front: { uz: '`ishtirokchilar` jadvalida o\'yinchi qaysi holatlarda turadi?', ru: 'В каких статусах игрок бывает в таблице `ishtirokchilar`?' }, back: { uz: '`qoshildi`, `keladi`, `navbatda`, `chiqdi`', ru: '`qoshildi`, `keladi`, `navbatda`, `chiqdi`' }, note: { uz: "`keladi` — o'yin kuni «Kelaman»ni bosgani", ru: '`keladi` — нажал «Kelaman» в день игры' } },
  { front: { uz: "Oxirgi joyga ikki so'rov bir lahzada kelsa, nima bo'lishi mumkin?", ru: 'Что может быть, если на последнее место придут два запроса в один миг?' }, back: { uz: "Ikkalasi «joy bor» deb ko'radi va ikkalasi yoziladi", ru: 'Оба увидят «место есть», и запишутся оба' }, note: { uz: "Bu misolda talabda yozilmagan edi — «11 / 10» bo'ldi", ru: 'В этом примере в требовании этого не было — стало «11 / 10»' } },
  { front: { uz: 'Backend oxirgi joyni bitta odamga qanday beradi?', ru: 'Как Backend отдаёт последнее место одному человеку?' }, back: { uz: 'Joyni tekshirish va yozishni bitta ish qiladi', ru: 'Делает проверку места и запись одним действием' }, note: { uz: "Shu payt ikkinchi so'rov kutib turadi. 5-Modulda bu nazorat tranzaksiya deb atalgan", ru: 'В это время второй запрос ждёт. В 5-м модуле такой контроль назывался транзакцией' } },
  { front: { uz: "9-Moduldagi katakdan bugungi joyning farqi nima?", ru: 'Чем сегодняшнее место отличается от ячейки из 9-го модуля?' }, back: { uz: 'Katak bitta edi, joylar esa son bilan', ru: 'Ячейка была одна, а места — числом' }, note: { uz: "«9 / 10» da ikki so'rov ham «joy bor» deb ko'rishi mumkin", ru: 'При «9 / 10» оба запроса могут увидеть «место есть»' } },
  { front: { uz: "Bir lahzadagi ikki so'rovni qanday tekshirasiz?", ru: 'Как проверить два запроса в один миг?' }, back: { uz: "Agentga bir vaqtda bir nechta so'rov yubortirasiz", ru: 'Просите агента отправить несколько запросов одновременно' }, note: { uz: "Qo'lda bosilganda so'rovlar bir lahzaga kamdan-kam tushadi; jadvalni Neon'da ko'rasiz", ru: 'При ручном нажатии запросы редко совпадают; таблицу смотрите в Neon' } },
  { front: { uz: "Uchinchi funksiya talabida «Nima buzilmasin»ga nima yoziladi?", ru: 'Что пишут в «Что не сломать» в требовании третьей функции?' }, back: { uz: 'Oldingi ikki funksiya', ru: 'Две прежние функции' }, note: { uz: "Mentor misolida: e'lon berish, «Qo'shilaman», «Kelaman»", ru: "В примере Ментора: создание объявления, «Qo'shilaman», «Kelaman»" } },
  { front: { uz: "Backend o'zgargach, telefondagi ilova uni qachon ko'radi?", ru: 'Когда приложение на телефоне увидит изменённый Backend?' }, back: { uz: '`git push` dan keyin, Render yangilagach', ru: 'После `git push`, когда Render обновит' }, note: { uz: "Render push'dan keyin xizmatni o'zi qayta deploy qiladi", ru: 'После push Render сам заново деплоит сервис' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cxx('f3-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="f3-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — qolipdan: QYakun (DE-204). Sarlavha bloklar holatiga qarab (P-046); belgi faqat A3 da; uyga vazifa yo'q (P-058) =====
const YAKUN_SARLAVHA = {
  a3: { uz: 'Uchinchi funksiya tayyor: oldingilari bilan ishlaydi.', ru: 'Третья функция готова: работает вместе с прежними.' },
  a2: { uz: 'Backend qismi tayyor — telefondagi qismi qoldi.', ru: 'Часть Backend готова — осталась часть на телефоне.' },
  a1: { uz: 'Backend harakati ishlaydi — bir vaqtda bosish qoldi.', ru: 'Действие в Backend работает — осталось одновременное нажатие.' },
  yoq: { uz: 'Uchinchi funksiya boshlandi — qolgan qadamni tugating.', ru: 'Третья функция начата — закончите оставшийся шаг.' }
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
  const holat = bajarildi('a3') ? 'a3' : bajarildi('a2') ? 'a2' : bajarildi('a1') ? 'a1' : 'yoq';
  const belgisiz = holat !== 'a3';
  const RECAP = [
    { uz: "Qo'shilgan o'yinchi chiqsa, bo'shagan joyni navbatga birinchi yozilgan o'yinchi oladi.", ru: 'Если присоединившийся игрок выходит, освободившееся место получает первый вставший в очередь.' },
    { uz: "Navbatdagi o'yinchi qo'shilganini ekranni yangilaganda ko'radi.", ru: 'Игрок из очереди видит, что присоединился, когда обновляет экран.' },
    { uz: 'Oxirgi joy bitta odamga tegishi uchun Backend tekshirish va yozishni bitta ish qiladi.', ru: 'Чтобы последнее место досталось одному человеку, Backend делает проверку и запись одним действием.' },
    { uz: "Uchinchi funksiyaning «Nima buzilmasin» qatorida oldingi ikki funksiya turadi.", ru: 'В строке «Что не сломать» третьей функции стоят две прежние функции.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      {/* Belgi «✓ Uchinchi funksiya tayyor» — faqat A3 bajarilganda (nishon Third Feature bilan bir). Tartib (MD): belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz */}
      <div className={cxx('f3-yakun', belgisiz && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Uchinchi funksiya tayyor', ru: 'Третья функция готова' })}
          togri={correct} jami={total}
          sarlavha={tr(YAKUN_SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tx)}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}>
          <p className="f3-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Roadmap bo'yicha qayerdasiz?»</b>: Mentor bilan yakkama-yakka: risklar va tuzatilgan reja.</>, ru: <>Следующий урок — <b>«Где вы по roadmap?»</b>: один на один с Ментором: риски и исправленный план.</> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};
// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function FeatureThreeLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === O'YIN SAHNASI (14-dars) — darsning o'z vizuali. Faqat qolip tokenlari (D3), emoji yo'q (D4); «Maydon Jamoa» nomi — #2E9E4F (tayanch 9.62) === */
        /* Halqa — yengil (SABOQ 32, B-10): kattalashish yo'q, shaffoflik ≤ 0.28, sikl 2.6 s; guruhda bitta */
        .f3-navbat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: f3-puls 2.6s ease-out infinite; }
        @keyframes f3-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.28)}; } 70% { box-shadow: 0 0 0 7px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        @keyframes f3-kot { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes f3-pop { 0% { transform: scale(1); } 40% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes f3-tush { from { opacity: 0; transform: translateY(-10px) scale(0.6); } to { opacity: 1; transform: none; } }
        @keyframes f3-yig { from { opacity: 0.3; transform: scaleY(1.6); } to { opacity: 1; transform: none; } }
        @keyframes f3-yonok { 0% { background: ${fon(T.ok, 0.3)}; } 100% { background: transparent; } }
        @keyframes f3-yonac { 0% { background: ${fon(T.accent, 0.22)}; } 100% { background: transparent; } }
        @keyframes f3-ayl { to { transform: rotate(360deg); } }
        @keyframes f3-silk { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(2px); } }
        @keyframes f3-uch { from { transform: translate(-50%,-50%); } to { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); } }
        @keyframes f3-sondi { to { opacity: 0; transform: translateX(10px); } }
        .f3-bash .q-bashorat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: f3-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both, f3-puls 2.6s ease-out 0.7s infinite; }
        .f3-bash .q-chip { animation: f3-kot 0.4s ease-out 0.15s both; }
        .f3-bash .q-chip:nth-child(2) { animation-delay: 0.27s; }
        .q-kirish:has(.f3-s0.kutish) .q-variantlar-kol { border-radius: 14px; outline: 2px solid ${T.accent}; outline-offset: 5px; animation: f3-puls 2.6s ease-out 0.9s infinite; }
        @media (min-width: 768px) {
          .q-kirish:has(.f3-s0) .q-split { grid-template-columns: auto minmax(0,1fr); gap: clamp(20px,3.4vw,40px); align-items: start; }
          .q-reja:has(.f3-reja) .q-split { grid-template-columns: auto minmax(0,1fr); gap: clamp(20px,3.4vw,40px); align-items: start; }
        }
        .f3-taxmin { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 9px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; transform-origin: top; animation: f3-yig 0.45s cubic-bezier(.2,.9,.3,1) both; }
        .f3-taxmin-y { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.accent}; }
        .f3-taxmin-s { color: ${T.ink2}; } .f3-taxmin b { color: ${T.ink}; }
        .f3-nb { display: flex; flex-direction: column; gap: 6px; }
        .f3-nb-t { font-size: 13.5px; font-weight: 600; color: ${T.ink2}; } .f3-nb-t.ok { color: ${T.ok}; font-weight: 700; } .f3-nb-t b { color: ${T.ink}; }
        .f3-nb-i { font-size: 13.5px; color: ${T.ink2}; }
        .f3-nb-x { font-weight: 600; color: ${T.ink}; }
        p.f3-joriy { margin: 0; padding: 9px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; font-weight: 600; color: ${T.ink}; animation: f3-kot 0.4s ease-out both; }

        /* Telefon (≈172×272, SABOQ 22) */
        .f3-ikki-tel { display: flex; gap: 12px; align-items: flex-start; flex: none; }
        .f3-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; }
        .f3-rol { display: block; width: 172px; min-height: 30px; padding: 3px 9px; border-radius: 10px; background: ${fon(T.ink, 0.07)}; color: ${T.ink}; font-size: 11px; font-weight: 700; line-height: 1.3; text-align: center; }
        .f3-telefon { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 3px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px 9px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; transition: box-shadow 0.3s; }
        .f3-tel-ust.fokus .f3-telefon { box-shadow: 0 0 0 4px ${fon(T.accent, 0.16)}, 0 12px 26px -14px rgba(${T.shadowBase},0.4); }
        .f3-eski { position: absolute; top: 92px; right: 8px; z-index: 3; padding: 2px 8px; border-radius: 999px; background: ${T.bg}; border: 1.5px dashed ${fon(T.ink, 0.3)}; color: ${T.ink2}; font-size: 10.5px; font-weight: 700; animation: f3-tush 0.35s ease-out both; }
        .f3-tel-bar { display: flex; align-items: center; justify-content: center; height: 15px; flex: none; }
        .f3-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: #2E9E4F; letter-spacing: 0.01em; }
        .f3-tortish { align-self: stretch; flex: none; height: 21px; padding: 0 4px; border-radius: 999px; border: 1px solid ${T.line}; background: ${T.bg}; color: ${T.ink}; font-family: 'Manrope', sans-serif; font-size: 10px; letter-spacing: -0.01em; font-weight: 800; white-space: nowrap; cursor: pointer; animation: f3-kot 0.35s ease-out both; }
        .f3-tortish:disabled { cursor: default; color: ${T.ink2}; }
        .f3-aylan { align-self: center; flex: none; display: flex; align-items: center; justify-content: center; height: 21px; }
        .f3-aylan i { width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${fon(T.ink, 0.15)}; border-top-color: ${T.accent}; animation: f3-ayl 0.7s linear infinite; }
        .f3-tel-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 1px; transition: transform 0.35s cubic-bezier(.3,1.2,.5,1); }
        .f3-tel-ekran.tort { transform: translateY(12px); }
        .f3-orqa { font-size: 10.5px; font-weight: 700; color: ${T.ink2}; }
        .f3-sar { font-size: 13.5px; font-weight: 800; color: ${T.ink}; }
        .f3-joy { font-size: 11.5px; color: ${T.ink2}; }
        .f3-son { display: inline-block; align-self: flex-start; margin-top: 3px; font-family: 'JetBrains Mono', monospace; font-size: 19px; font-weight: 800; color: ${T.ink}; }
        .f3-son.qizil { color: ${T.err}; animation: f3-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .f3-doiralar { display: grid; grid-template-columns: repeat(5, 15px); gap: 4px 5px; margin: 3px 0; }
        .f3-doiralar i { display: block; width: 15px; height: 15px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; transition: background 0.3s; }
        .f3-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.36)}; }
        .f3-doiralar i.kul { background: ${fon(T.ink, 0.1)}; }
        .f3-doiralar i.yangi { background: ${T.ok}; animation: f3-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .f3-doiralar i.ortiq { background: ${T.err}; animation: f3-tush 0.4s cubic-bezier(.3,1.4,.5,1) both; }
        .f3-navbatda { font-size: 11px; font-weight: 700; color: ${T.ink2}; animation: f3-kot 0.35s ease-out both; }
        .f3-navbatda b { display: inline-block; font-family: 'JetBrains Mono', monospace; color: ${T.ink}; animation: f3-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .f3-yozuv { display: block; margin-top: 2px; padding: 3px 7px; border-radius: 7px; background: ${T.accentSoft}; color: ${T.accent}; font-size: 11px; font-weight: 800; text-align: center; animation: f3-kot 0.35s ease-out both; }
        .f3-tugmalar { margin-top: auto; display: flex; flex-direction: column; gap: 4px; }
        .f3-tel-btn { position: relative; flex: none; display: flex; align-items: center; justify-content: center; height: 25px; padding: 0 6px; border: 0; border-radius: 9px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 800; white-space: nowrap; transition: transform 0.15s; }
        button.f3-tel-btn { cursor: pointer; }
        .f3-tel-btn.off { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .f3-tel-btn.ikki { background: ${T.paper}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${fon(T.ink, 0.25)}; }
        .f3-tel-btn.yangi { animation: f3-kot 0.4s ease-out both; }
        .f3-tel-btn.f3-navbat { animation: f3-puls 2.6s ease-out infinite; }
        .f3-tel-btn.bos { transform: scale(0.93); }
        .f3-tel-btn.silk { animation: f3-silk 0.5s ease-in-out; }
        .f3-barmoq { position: absolute; right: 16px; top: 50%; width: 22px; height: 22px; margin-top: -11px; border-radius: 50%; background: ${fon(T.ink, 0.22)}; box-shadow: 0 0 0 4px ${fon(T.ink, 0.08)}; pointer-events: none; animation: f3-tush 0.25s ease-out both; }
        .f3-oyna { position: absolute; left: 8px; right: 8px; bottom: 10px; z-index: 4; display: flex; flex-direction: column; gap: 6px; padding: 9px; border-radius: 12px; background: ${T.paper}; box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.45), 0 0 0 1px ${T.line}; animation: f3-kot 0.3s ease-out both; }
        .f3-oyna-s { font-size: 11.5px; font-weight: 800; color: ${T.ink}; text-align: center; }
        .f3-oyna-q { display: flex; gap: 6px; }
        .f3-oyna-b { flex: 1; display: flex; align-items: center; justify-content: center; height: 24px; border-radius: 8px; background: ${T.bg}; font-size: 11px; font-weight: 800; color: ${T.ink2}; transition: transform 0.15s; }
        .f3-oyna-b.ha { background: ${T.accent}; color: #fff; }
        .f3-oyna-b.bos { transform: scale(0.9); }
        .f3-tel-kul { display: inline-block; white-space: nowrap; padding: 3px 9px; border-radius: 999px; background: ${fon(T.ink, 0.06)}; color: ${T.ink2}; font-size: 11px; font-weight: 700; text-align: center; animation: f3-kot 0.4s ease-out 1.9s both; }

        /* Backend qutisi va Database kartasi (o'ngda, SABOQ 21) */
        .f3-be { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); min-width: 0; transition: border-color 0.3s, box-shadow 0.3s; }
        .f3-be.on { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.12)}; }
        .f3-be.xato { border-color: ${T.err}; box-shadow: 0 0 0 4px ${fon(T.err, 0.1)}; }
        .f3-be-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 20px; font-size: 13.5px; color: ${T.ink}; }
        .f3-yol { display: block; padding: 4px 8px; border-radius: 8px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; overflow-wrap: anywhere; transition: background 0.3s, color 0.3s; }
        .f3-yol.on { background: ${T.accentSoft}; color: ${T.accent}; }
        .f3-qulf { display: inline-flex; align-items: center; gap: 7px; padding: 2px 9px 2px 7px; border-radius: 999px; background: ${T.accentSoft}; font-size: 11.5px; font-weight: 800; color: ${T.accent}; animation: f3-tush 0.35s cubic-bezier(.3,1.4,.5,1) both; }
        .f3-qulf i { position: relative; display: block; width: 12px; height: 9px; margin-top: 5px; border-radius: 2px; background: ${T.accent}; }
        .f3-qulf i::before { content: ''; position: absolute; left: 2px; top: -7px; width: 4px; height: 6px; border: 2px solid ${T.accent}; border-bottom: 0; border-radius: 5px 5px 0 0; transition: transform 0.3s; }
        .f3-qulf.ochiq { background: ${T.bg}; color: ${T.ink2}; }
        .f3-qulf.ochiq i { background: ${T.ink2}; }
        .f3-qulf.ochiq i::before { border-color: ${T.ink2}; transform: translate(4px,-2px) rotate(20deg); }
        .f3-sorovlar { display: flex; flex-wrap: wrap; gap: 6px; }
        .f3-sorov { flex: 1 1 150px; display: flex; align-items: center; gap: 6px; padding: 5px 8px; border-radius: 9px; background: ${T.bg}; border: 1.5px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink}; animation: f3-kot 0.35s ease-out both; }
        .f3-sorov i { flex: none; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 5px; border: 1.5px dashed ${fon(T.ink, 0.3)}; font-style: normal; font-size: 10px; font-weight: 800; color: #fff; }
        .f3-sorov.ok { border-color: ${fon(T.ok, 0.5)}; } .f3-sorov.ok i { border: 0; background: ${T.ok}; animation: f3-tush 0.35s cubic-bezier(.3,1.4,.5,1) both; }
        .f3-sorov.no { border-color: ${fon(T.err, 0.5)}; color: ${T.err}; } .f3-sorov.no i { border: 0; background: ${T.err}; animation: f3-tush 0.35s cubic-bezier(.3,1.4,.5,1) both; }
        .f3-sorov.kut { color: ${T.ink2}; border-style: dashed; background: ${fon(T.ink, 0.04)}; font-family: 'Manrope', sans-serif; }
        .f3-sorov.kut i { border-radius: 50%; border: 2px solid ${fon(T.ink, 0.15)}; border-top-color: ${T.ink2}; animation: f3-ayl 1s linear infinite; }
        .f3-be-izoh { font-size: 12.5px; font-weight: 700; color: ${T.ink}; animation: f3-kot 0.35s ease-out both; }
        .f3-db { display: flex; flex-direction: column; gap: 5px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; min-width: 0; transition: box-shadow 0.3s, border-color 0.3s; }
        .f3-db.fokus { box-shadow: 0 0 0 4px ${fon(T.ok, 0.14)}; border-color: ${T.ok}; }
        .f3-db-h { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .f3-db-h code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; }
        .f3-jt { width: 100%; border-collapse: collapse; font-size: 12px; }
        .f3-jt th { text-align: left; padding: 3px 6px; border-bottom: 1px solid ${T.line}; font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .f3-jt td { padding: 4px 6px; border-bottom: 1px solid ${fon(T.ink, 0.06)}; color: ${T.ink}; white-space: nowrap; }
        .f3-jt td.f3-vaqt { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .f3-holat { display: inline-block; padding: 1px 6px; border-radius: 6px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .f3-holat.qoshildi { background: ${T.okFon}; color: ${T.ok}; }
        .f3-holat.navbatda { background: ${T.accentSoft}; color: ${T.accent}; }
        .f3-holat.chiqdi { text-decoration: line-through; }
        .f3-jt tr.kir td { animation: f3-kot 0.45s ease-out both, f3-yonac 1.4s ease-out 0.3s both; }
        .f3-jt tr.kirok td { animation: f3-kot 0.45s ease-out both, f3-yonok 1.4s ease-out 0.3s both; }
        .f3-jt tr.yon td { animation: f3-yonok 1.4s ease-out both; }
        .f3-jt tr.chiq td { color: ${T.ink2}; }
        .f3-jt tr.chiq td:first-child { text-decoration: line-through; }
        .f3-jt tr.sondi td { animation: f3-sondi 0.5s ease-in forwards; }
        .f3-jt tr.f3-yigma td { color: ${T.ink2}; }

        /* Sahna: telefon(lar) chapda, Backend va jadval o'ngda; konvert — so'rov */
        .f3-sahna { position: relative; display: flex; align-items: center; justify-content: center; min-width: 0; }
        .f3-sahna-ong { display: flex; flex-direction: column; gap: 10px; flex: 0 1 360px; min-width: 260px; }
        .f3-yolak { position: relative; flex: 0 0 clamp(22px,3.6vw,44px); height: 2px; background: ${T.line}; }
        .f3-konvert { position: absolute; z-index: 6; pointer-events: none; padding: 3px 9px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.accent}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 8px 18px -8px rgba(${T.shadowBase},0.4); animation-name: f3-uch; animation-timing-function: cubic-bezier(.5,0,.3,1); animation-fill-mode: both; }
        .f3-konvert.javob { border-color: ${T.ok}; color: ${T.ok}; }
        .f3-konvert.xato { border-color: ${T.err}; color: ${T.err}; background: ${T.errFon}; }
        .f3-konvert.nuqta { width: 14px; height: 14px; padding: 0; border-radius: 50%; background: ${T.accent}; }
        .f3-konvert.javob.nuqta { background: ${T.ok}; }

        /* 0-ekran: maydon kadri (odamlar real ko'rinishda, SABOQ 36) */
        .f3-s0 { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .f3-maydon { width: 356px; max-width: 100%; display: flex; flex-direction: column; gap: 6px; animation: f3-kot 0.45s ease-out both; }
        .f3-maydon-h { font-size: 12px; font-weight: 800; color: ${T.ink}; }
        .f3-maydon-q { position: relative; display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; padding: 10px 10px; border-radius: 14px; border: 2px solid ${fon(T.ink, 0.16)}; background: ${T.paper}; overflow: hidden; }
        .f3-maydon-q::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; margin-left: -1px; background: ${fon(T.ink, 0.08)}; }
        .f3-maydon-q::after { content: ''; position: absolute; left: 50%; top: 50%; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%; border: 2px solid ${fon(T.ink, 0.08)}; }
        .f3-odam { position: relative; z-index: 1; justify-self: center; width: 26px; height: 34px; animation: f3-tush 0.35s cubic-bezier(.3,1.4,.5,1) both; animation-delay: calc(var(--i) * 120ms + 200ms); }
        .f3-bosh-joy { position: relative; z-index: 1; justify-self: center; width: 26px; height: 34px; border-radius: 13px 13px 6px 6px; border: 2px dashed ${fon(T.ink, 0.35)}; animation: f3-kot 0.4s ease-out 1.4s both; }
        .f3-maydon-y { font-size: 12px; font-weight: 600; color: ${T.ink2}; animation: f3-kot 0.4s ease-out 1.6s both; }

        /* 1-ekran pastki qatorlari */
        .f3-reja-past { display: flex; flex-direction: column; gap: 4px; }
        p.f3-reja-repo { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        p.f3-reja-repo code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; background: ${fon(T.ink, 0.06)}; padding: 1px 6px; border-radius: 5px; }
        p.f3-reja-izoh { margin: 0; font-size: 13px; color: ${T.ink2}; }
        p.f3-reja-izoh b { color: ${T.ink}; }

        /* 4-ekran harakat paneli: talab kartasi + bitta tugma */
        .f3-sahna-ong.f3-ong-keng { flex: 1 1 560px; max-width: 600px; }
        .f3-ong-qator { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; align-items: start; }
        .f3-harakat { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-start; }
        .f3-ong-keng .f3-harakat .f3-talab { flex: 1 1 290px; }
        .f3-ong-keng .f3-harakat-ong { flex: 1 1 200px; }
        .f3-talab { flex: 0 1 356px; display: flex; flex-direction: column; gap: 3px; padding: 9px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: border-color 0.3s; }
        .f3-talab.tolgan { border-color: ${fon(T.accent, 0.5)}; }
        .f3-talab-y { font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .f3-talab-q { display: block; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.5; color: ${T.ink}; }
        .f3-talab-q.yangi { padding: 2px 6px; border-radius: 6px; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; animation: f3-tush 0.4s cubic-bezier(.3,1.4,.5,1) both; }
        .f3-harakat-ong { flex: 1 1 260px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
        .f3-qator-k { display: block; padding: 9px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px dashed ${T.accent}; font-size: 13px; font-weight: 700; line-height: 1.45; color: ${T.ink}; animation: f3-kot 0.4s ease-out both; }
        .f3-agent { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: ${T.ink2}; animation: f3-kot 0.3s ease-out both; }
        .f3-agent i { width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${fon(T.ink, 0.15)}; border-top-color: ${T.accent}; animation: f3-ayl 0.7s linear infinite; }

        /* Amaliyot bloklari */
        .f3-band { display: block; margin-top: 5px; }
        p.f3-funk { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; font-size: 13.5px; color: ${T.ink2}; }
        p.f3-funk b { color: ${T.ink}; }
        .f3-funk-i { flex: 1 1 240px; max-width: 380px; padding: 6px 10px; border-radius: 9px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 13.5px; color: ${T.ink}; }
        .f3-funk-i:focus { outline: 2px solid ${fon(T.accent, 0.5)}; outline-offset: 1px; }
        .f3-talab-p { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .f3-talab-p .q-prompt-nusxa:disabled { opacity: 0.45; cursor: not-allowed; }
        .f3-joy { display: flex; flex-direction: column; gap: 2px; }
        .f3-joy-q { display: flex; align-items: flex-start; gap: 8px; }
        .f3-joy-l { flex: none; padding-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .f3-joy-i { flex: 1; min-width: 0; min-height: 30px; resize: none; overflow: hidden; padding: 5px 9px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .f3-joy-i.bosh { border-color: ${fon(T.accent, 0.55)}; }
        .f3-joy-i:focus { outline: 2px solid ${fon(T.accent, 0.5)}; outline-offset: 1px; }
        .f3-joy-s { display: block; padding-left: 2px; font-size: 12px; color: ${T.ink2}; }
        .f3-ps { display: block; margin: 0; font-size: clamp(12.5px,1.5vw,13.5px); line-height: 1.55; color: ${T.ink}; font-weight: 500; }
        .f3-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
        .f3-yordam-s { display: block; padding: 5px 9px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; font-size: 12.5px; line-height: 1.45; }
        .f3-yordam-l { margin-top: 4px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .f3-yordam-g { display: block; font-size: 12.5px; color: ${T.ink2}; }
        .q-blok-xato .q-btn.f3-yordam-btn { padding: 5px 12px; font-size: 12.5px; }
        .q-blok-t .qcode, .q-blok-xato .qcode, .f3-yordam .qcode, .f3-ps .qcode, .q-blok-tugadi .qcode, p.f3-ortda .qcode, .f3-sql-i .qcode { white-space: normal; overflow-wrap: anywhere; }
        p.f3-ortda { margin: 0; font-size: 12.5px; line-height: 1.7; color: ${T.ink2}; overflow-wrap: anywhere; }
        .f3-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; background: ${fon(T.ink, 0.06)}; padding: 1px 6px; border-radius: 5px; }
        .f3-nat { display: flex; flex-direction: column; gap: 10px; }
        .f3-nat-tel { align-items: center; animation: f3-kot 0.35s ease-out both; }
        .f3-kir { animation: f3-kot 0.45s ease-out var(--d, 0s) both; }
        .f3-chat { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .f3-chat-h { font-size: 12px; font-weight: 800; color: ${T.ink2}; }
        .f3-chat-q { display: block; padding: 3px 8px; border-radius: 7px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.45; color: ${T.ink}; overflow-wrap: anywhere; animation: f3-kot 0.4s ease-out var(--d, 0s) both; }
        .f3-chat-q.ok { background: ${T.okFon}; color: ${T.ok}; font-weight: 700; }
        .f3-chat-q.xato { background: ${T.errFon}; color: ${T.err}; font-weight: 700; }
        .f3-chat-q.navbatda { background: ${T.accentSoft}; color: ${T.accent}; }
        .f3-sql { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .f3-sql-h { font-size: 12px; font-weight: 800; color: ${T.ink2}; }
        .f3-sql-k { display: block; padding: 6px 8px; border-radius: 8px; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.5; overflow-wrap: anywhere; }
        .f3-sql-n { display: flex; flex-wrap: wrap; gap: 6px; }
        .f3-sql-i { font-size: 12px; color: ${T.ink2}; }
        .f3-royxat { gap: 3px; }
        .f3-kun-h { margin-top: 3px; font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .f3-karta { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 6px; padding: 4px 7px; border-radius: 8px; background: ${T.bg}; font-size: 10.5px; color: ${T.ink2}; }
        .f3-karta b { font-size: 11px; color: ${T.ink}; }
        .f3-karta-m { flex: 1; min-width: 0; }
        .f3-karta-n { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 800; color: ${T.ink}; }
        .f3-karta-nav { flex-basis: 100%; font-size: 10px; font-weight: 700; color: ${T.accent}; }
        .f3-karta.joriy { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.4)}; background: ${T.paper}; }
        .f3-nw { white-space: nowrap; }
        .f3-rc-kod { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; padding: 6px 12px; border-radius: 10px; }

        /* Kartochkalar (SABOQ 16) va yakun */
        .f3-flash.yangi .fc-card:not(.flip) .fc-front { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: f3-puls 2.6s ease-out 3; }
        p.f3-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.f3-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .f3-yakun { flex: 1 0 auto; display: flex; flex-direction: column; min-height: 0; }
        .f3-yakun.belgisiz .done-chip { display: none; }
        .f3-yakun .q-yakun > .ach-coll { order: 1; }
        p.f3-keyingi { margin: 0; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
        p.f3-keyingi b { color: ${T.ink}; }

        @media (max-width: 767px) {
          .f3-sahna.qator { flex-direction: column; align-items: center; }
          .zoomable:not(.zoom-on) :is(.f3-sahna, .f3-s0, .f3-reja, .f3-nat) { padding-top: 34px; } /* ⛶ telefon yorlig'ini va natija kartasini yopmasin */
          .f3-sahna-ong { flex: none; width: 100%; max-width: 372px; min-width: 0; }
          .f3-yolak { flex: none; width: 2px; height: 18px; }
          .f3-ikki-tel { gap: 8px; }
          .f3-talab { flex-basis: 100%; }
          .f3-ong-qator { grid-template-columns: minmax(0,1fr); }
          .f3-sahna-ong.f3-ong-keng { flex: none; max-width: 372px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .f3-navbat, .f3-bash .q-bashorat, .q-kirish:has(.f3-s0.kutish) .q-variantlar-kol, .f3-flash.yangi .fc-card:not(.flip) .fc-front { animation: none !important; }
          .f3-konvert, .f3-taxmin, .f3-son.qizil, .f3-doiralar i, .f3-navbatda, .f3-navbatda b, .f3-yozuv, .f3-tel-btn, .f3-barmoq, .f3-oyna, .f3-tel-kul, .f3-eski, .f3-qulf, .f3-sorov, .f3-sorov i, .f3-be-izoh,
          .f3-jt tr td, .f3-maydon, .f3-odam, .f3-bosh-joy, .f3-maydon-y, .f3-talab-q.yangi, .f3-qator-k, .f3-agent, .f3-kir, .f3-chat-q, .f3-nat-tel, .f3-tortish, p.f3-joriy { animation: none !important; transition: none !important; }
          .f3-aylan i, .f3-agent i, .f3-sorov.kut i { animation: none !important; }
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
