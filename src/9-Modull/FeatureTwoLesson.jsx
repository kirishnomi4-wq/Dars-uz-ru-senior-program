import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul (kod: src/9-Modull) · 12-dars «Loyiha kuni: 2-asosiy funksiya» (m9-12). Skeletdan (src/skelet/NamunaDars.jsx) qurildi, 06.10.2026.
// Manba-haqiqat: feedback/F-1005-11modul/12-FeatureTwo-v3.md (GATE M). 8 ekran + 3 amaliyot bloki + kartochkalar = 12 (SABOQ 12).
// Oqim: s0 QKirish · s1 QReja · s2 QTushuncha (ruxsat) · a1 blok · s3 test · s4 QTushuncha (tashkilotchi ekrani) · a2 blok · s5 test · a3 blok · podium · sflash · s7 QYakun.
// Bitta vizual — «Tasdiq sahnasi» (TASDIQ → Tel, BeQuti, IshJadval, Hisob, Sahna): telefon chapda (172×272, SABOQ 22), Backend va Database o'ngda; konvert — so'rov.
// Infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletdan o'zgarishsiz.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QIzoh, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm9-12-v1', lessonTitle: { uz: "Loyiha kuni: 2-asosiy funksiya", ru: 'День проекта: 2-я основная функция' } };
// 12 ekran · oqim: kirish → reja → tushuncha → amaliyot 1 → 1-savol → tushuncha → amaliyot 2 → 2-savol → amaliyot 3 → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'sinov', ru: 'тест' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'tasdiq', ru: 'подтверждение' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: 'Kelaman', l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: "to'xtash", ru: 'остановка' }, l: 78, tp: 68, s: 13, d: 6.8 }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD da belgilangan: 1-savol (s3) — C, 2-savol (s5) — A. `practice: -1` — sentinel (uch blok, variant yo'q).
const INLINE_KEYS = { s3: 2, s5: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI: 4 — 1-savol, 7 — 2-savol). Emoji o'rniga koddan bitta qator (S-026).
const RECAPS = {
  4: {
    title: { uz: 'Ruxsatni Backend beradi', ru: 'Разрешение даёт Backend' },
    cards: [
      { ic: <code className="ft-rc-kod">POST /oyinlar/:id/tasdiq</code>, h: { uz: "So'rov", ru: 'Запрос' }, body: { uz: "O'yinchi «Kelaman»ni bosganda Backend'ga ketadi.", ru: 'Уходит в Backend, когда игрок нажимает «Kelaman».' } },
      { ic: <code className="ft-rc-kod">403 · Tasdiq faqat o'yin kuni</code>, h: { uz: 'Rad', ru: 'Отказ' }, body: { uz: "Ruxsat bo'lmasa, Database o'zgarmaydi.", ru: 'Если разрешения нет, Database не меняется.' } },
      { ic: <code className="ft-rc-kod">holat: keladi</code>, h: { uz: 'Database', ru: 'Database' }, body: { uz: "Faqat ruxsat bo'lsa yoziladi.", ru: 'Записывается только при разрешении.' }, ask: { uz: "Tugma noto'g'ri joyda chiqsa, Database'ga ruxsatsiz yozuv nega tushmaydi?", ru: 'Почему в Database не попадает запись без разрешения, даже если кнопка появилась не там?' } }
    ]
  },
  7: {
    title: { uz: "Son so'rov bilan keladi", ru: 'Число приходит с запросом' },
    cards: [
      { ic: <code className="ft-rc-kod">POST /oyinlar/1/tasdiq</code>, h: { uz: "O'yinchi", ru: 'Игрок' }, body: { uz: "Tasdiq Database'ga yoziladi.", ru: 'Подтверждение записывается в Database.' } },
      { ic: <code className="ft-rc-kod">GET /oyinlar</code>, h: { uz: 'Tashkilotchi', ru: 'Организатор' }, body: { uz: "Pastga tortganda yangi son so'raladi.", ru: 'При оттягивании вниз запрашивается новое число.' } },
      { ic: <code className="ft-rc-kod">Kelishini tasdiqladi: 7 / 9</code>, h: { uz: 'Natija', ru: 'Результат' }, body: { uz: 'Yangi son javob kelgach chiqadi.', ru: 'Новое число появляется, когда пришёл ответ.' }, ask: { uz: "Tashkilotchi ekrani ochiq tursa, son nega o'zgarmaydi?", ru: 'Почему число не меняется, пока экран организатора открыт?' } }
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

// ===== DARSNING O'Z VIZUALI — «Tasdiq sahnasi» (MD: bitta vizual, 163/180). Bitta manba: TASDIQ + OYIN → Tel, BeQuti, IshJadval, Hisob, Sahna; bloklar maketlari ham shundan =====
// Holatlar (MD): kulrang — hali yo'q · oq — ishlaydi · accent — joriy · yashil — yozildi / ruxsat · qizil — 403. Konvert — so'rov; uzuq chiziq — so'rov yo'q (U-041, faqat bo'sh joy).
// qolip-maket: ft-tel-btn ft-tortish — telefon ichidagi «Kelaman» va «↓ torting» (MD: harakat tugmasi telefonning o'zida). Kam harakat rejimida uchish yo'q, holat birdan almashadi.
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

const TASDIQ = {
  ilova: { nom: 'Maydon Jamoa', tex: 'Expo Go' },
  rol: { oyinchi: { uz: "o'yinchi", ru: 'игрок' }, tashkilotchi: { uz: 'tashkilotchi', ru: 'организатор' } },
  yol: { tasdiq: 'POST /oyinlar/:id/tasdiq', oyinlar: 'GET /oyinlar' },
  qoida: [{ k: 'kun', t: { uz: "O'yin kunimi?", ru: 'День игры?' } }, { k: 'qosh', t: { uz: "Qo'shilganmi?", ru: 'Присоединился?' } }],
  sabab: { kun: { uz: "Tasdiq faqat o'yin kuni", ru: 'Подтверждение только в день игры' }, qosh: { uz: "Siz bu o'yinga qo'shilmagansiz", ru: 'Вы не присоединились к этой игре' } },
  ustun: ['oyin_id', 'oyinchi_id', 'holat']
};
// Namuna o'yinlar (tayanch 9.2; oyin_id — shu tartibda). Shanba 18:00 — 8 namuna + oyinchi_id 2 (11-darsda qo'shilgan) = 9 / 10
const OYIN = {
  1: { id: 1, kun: { uz: 'Shanba', ru: 'Суббота' }, soat: '18:00', maydon: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, qoshilgan: 9, kerak: 10 },
  2: { id: 2, kun: { uz: 'Shanba', ru: 'Суббота' }, soat: '20:00', maydon: { uz: 'Maktab maydoni', ru: 'Школьное поле' }, qoshilgan: 6, kerak: 10 },
  3: { id: 3, kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, soat: '10:00', maydon: { uz: 'Park maydoni', ru: 'Поле в парке' }, qoshilgan: 4, kerak: 8 },
  4: { id: 4, kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, soat: '17:00', maydon: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, qoshilgan: 9, kerak: 10 }
};
const BUGUN = {
  shanba: { uz: 'Bugun: shanba', ru: 'Сегодня: суббота' },
  juma: { uz: 'Bugun: juma', ru: 'Сегодня: пятница' },
  s17: { uz: 'Bugun: shanba, 17:00', ru: 'Сегодня: суббота, 17:00' }
};
const TUGMA = {
  qoshildingiz: { uz: "Qo'shildingiz", ru: 'Вы присоединились' }, qoshilaman: { uz: "Qo'shilaman", ru: 'Присоединяюсь' },
  kelaman: { uz: 'Kelaman', ru: 'Приду' }, tasdiqladingiz: { uz: 'Tasdiqladingiz', ru: 'Вы подтвердили' }
};
const TASDIQ_Q = { uz: 'Kelishini tasdiqladi:', ru: 'Подтвердили приход:' };

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
  <span className={cxx('ft-konvert', p.tur, !p.t && 'nuqta')} aria-hidden="true"
    style={{ left: p.a.x + 'px', top: p.a.y + 'px', '--dx': (p.b.x - p.a.x) + 'px', '--dy': (p.b.y - p.a.y) + 'px', animationDuration: p.ms + 'ms' }}>{p.t}</span>
);

// Telefon = ilova (SABOQ 22–23): o'lchami barqaror 172×272. Ustida rol va «Bugun: …» yorliqlari — ramkadan tashqarida, ilova ekranining qismi emas (12-FILTR 9).
// «O'yin» ekrani: «‹ O'yinlar» · kun, soat · maydon · «N / M» · ismsiz doiralar · tugmalar (o'yinchida) yoki «Kelishini tasdiqladi: N / 9» (tashkilotchida)
// kel: undefined — tugma yo'q · 'bor' — «Kelaman» · 'bos' — bosilmoqda · 'tasdiq' — «Tasdiqladingiz» (o'chiq). tort: undefined | 'tayyor' | 'yur' — «↓ torting» tutqichi
const Tel = ({ rol, bugun, qosh, oyin = 1, son = true, qoshildi = true, kel, onKel, navbat, xato, tasdiq, yashil = 0, savol, yangi, tort, onTort, tortNavbat, fokus, className, children }) => {
  const o = OYIN[oyin] || OYIN[1];
  const tortYur = tort === 'yur';
  const surish = useRef(null);
  const pastga = (e) => { if (surish.current !== null && e.clientY - surish.current > 18 && onTort) { surish.current = null; onTort(); } };
  return (
    <div className={cxx('ft-tel-ust', className)} data-rol={rol}>
      <span className="ft-tel-yorliq">
        {rol && <span className={cxx('ft-rol', rol)}>{tr(TASDIQ.rol[rol])}</span>}
        {bugun && <span className="ft-bugun">{tr(bugun)}</span>}
        {qosh}
      </span>
      <div className={cxx('ft-telefon', fokus && 'fokus')}>
        <span className="ft-tel-bar"><b className="ft-tel-nom">{TASDIQ.ilova.nom}</b></span>
        {tort && (tortYur
          ? <span className="ft-aylan" aria-hidden="true"><i /></span>
          : <button type="button" className={cxx('ft-tortish', tortNavbat && 'ft-navbat')} disabled={!onTort}
            onClick={onTort} onPointerDown={e => { surish.current = e.clientY; }} onPointerMove={pastga} onPointerUp={() => { surish.current = null; }}>↓ {tr({ uz: 'torting', ru: 'потяните' })}</button>)}
        <div className={cxx('ft-tel-ekran', tortYur && 'tort')} key={o.id}>
          <span className="ft-orqa">‹ {tr({ uz: "O'yinlar", ru: 'Игры' })}</span>
          <b className="ft-sar">{tr(o.kun)}, {o.soat}</b>
          <span className="ft-joy">{tr(o.maydon)}</span>
          {son && <>
            <b className="ft-son">{o.qoshilgan} / {o.kerak}</b>
            <span className="ft-doiralar" aria-hidden="true">{Array.from({ length: o.kerak }, (_, i) => {
              const bor = i < o.qoshilgan, ok = bor && i < yashil, sv = savol && bor && !ok;
              return <i key={i} className={cxx(bor && 'bor', ok && 'ok', ok && yangi && i === yashil - 1 && 'yangi', sv && 'savol')} style={{ '--i': i }}>{ok ? '✓' : sv ? '?' : ''}</i>;
            })}</span>
          </>}
          {tasdiq !== undefined && <span className="ft-tq">{tr(TASDIQ_Q)} <b key={String(tasdiq)} className={cxx(yangi && 'yangi')}>{tasdiq}</b> / {o.qoshilgan}</span>}
          {rol === 'oyinchi' && <span className="ft-tugmalar">
            <span className={cxx('ft-tel-btn', qoshildi && 'off')}>{tr(qoshildi ? TUGMA.qoshildingiz : TUGMA.qoshilaman)}</span>
            {(kel === 'bor' || kel === 'bos') && <button type="button" className={cxx('ft-tel-btn kel', kel === 'bos' && 'bos', navbat && 'ft-navbat')} disabled={!onKel} onClick={onKel}>{tr(TUGMA.kelaman)}</button>}
            {kel === 'tasdiq' && <span className="ft-tel-btn off yangi">{tr(TUGMA.tasdiqladingiz)}</span>}
            {xato && <span className="ft-tel-xato">{tr(xato)}</span>}
          </span>}
        </div>
      </div>
      {children}
    </div>
  );
};

// Backend qutisi: yo'l(lar) · ikki qoida katagi «O'yin kunimi?» · «Qo'shilganmi?» (bo'sh → yashil ✓ / qizil ✕)
const BeQuti = ({ yollar = ['tasdiq'], joriy, kat, holat, children }) => (
  <div className={cxx('ft-be', holat)} data-be="1">
    <span className="ft-be-h"><b>Backend</b></span>
    {yollar.map(y => <code key={y} className={cxx('ft-yol', joriy === y && 'on')} data-yol={y}>{TASDIQ.yol[y]}</code>)}
    {kat && <span className="ft-kataklar">{TASDIQ.qoida.map(q => (
      <span key={q.k} className={cxx('ft-katak', kat[q.k])}><i>{kat[q.k] === 'ok' ? '✓' : kat[q.k] === 'no' ? '✕' : ''}</i>{tr(q.t)}</span>
    ))}</span>}
    {children}
  </div>
);
// Database · ishtirokchilar — 2–3 qator (oyin_id · oyinchi_id · holat)
const IshJadval = ({ qatorlar = [], fokus }) => (
  <div className={cxx('ft-db', fokus && 'fokus')} data-db="1">
    <span className="ft-db-h">Database · <code>ishtirokchilar</code></span>
    <table className="ft-jt">
      <thead><tr>{TASDIQ.ustun.map(u => <th key={u}>{u}</th>)}</tr></thead>
      <tbody>{qatorlar.map(q => (
        <tr key={q.k} data-q={q.k} className={cxx(q.yangi && 'kir')}>{q.c.map((v, j) => <td key={j} className={j === 2 ? cxx('ft-holat', v) : undefined}>{v}</td>)}</tr>
      ))}</tbody>
    </table>
  </div>
);
// Bitta jonli hisoblagich (SABOQ 24: to'liq jadval emas) — o'yin 1: keladi · qoshildi
const Hisob = ({ keladi, qoshildi, yangi }) => (
  <div className="ft-db ft-hisob" data-db="1">
    <span className="ft-db-h">Database · <code>ishtirokchilar</code> · {tr({ uz: "o'yin 1", ru: 'игра 1' })}</span>
    <span className="ft-hisob-q">
      <span className="ft-hisob-b ok"><code>keladi</code><b key={'k' + keladi} className={cxx(yangi && 'yangi')}>{keladi}</b></span>
      <span className="ft-hisob-b"><code>qoshildi</code><b key={'q' + qoshildi} className={cxx(yangi && 'yangi')}>{qoshildi}</b></span>
    </span>
  </div>
);
// Sahna: telefon(lar) chapda, Backend va Database o'ngda (SABOQ 21). Yo'lak — so'rov yo'li; 'uzuq' — so'rov yo'q
const Yolak = ({ uzuq, yozuv }) => (
  <span className={cxx('ft-yolak', uzuq && 'uzuq')} aria-hidden={!yozuv}>{yozuv && <span className="ft-yolak-y">{yozuv}</span>}</span>
);
const Sahna = ({ boxRef, parvoz = [], tur, children }) => (
  <div className={cxx('ft-sahna', tur)} ref={boxRef}>{children}{parvoz.map(p => <Konvert key={p.k} p={p} />)}</div>
);

// Bashorat (SABOQ 11/19): karta halqada, variantlar navbat bilan chiqadi; tanlangach ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi
const TaxminIxcham = ({ savol, javob }) => (
  <div className="ft-taxmin"><span className="ft-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="ft-taxmin-s">{savol}</span><b>{javob}</b></div>
);
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="ft-navbat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <TaxminIxcham savol={savol} javob={tr((variantlar.find(v => v.k === tanlov) || {}).t)} />);
// Natija bloki (SABOQ 25): bitta yashil blok — birinchi qator taxmin, so'ng joriy qator va xulosa
const NatijaBlok = ({ togri, haqiqat, izoh, xulosa }) => (
  <div className="q-xulosa ft-nb">
    <span className={cxx('ft-nb-t', togri && 'ok')}>{togri ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение подтвердилось' })}</> : haqiqat}</span>
    {izoh && <span className="ft-nb-i">{izoh}</span>}
    <span className="ft-nb-x">{xulosa}</span>
  </div>
);
const Haqiqat = ({ taxmin, haqiqat }) => <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {taxmin} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></>;

// ===== SCREEN 0 — KIRISH (QKirish): tashkilotchi telefonida 9 / 10 — kim aniq kelishi ko'rinmaydi. Ballsiz (J-026) =====
const HOOK_OPTS = [
  { id: 'a', t: { uz: "Ha — to'qqizalasi ham o'zi bosib qo'shilgan", ru: 'Да — все девять присоединились сами' } },
  { id: 'b', t: { uz: "Ha — kelolmasa, ilovaning o'zida xabar beradi", ru: 'Да — если не сможет, сообщит в самом приложении' } },
  { id: 'c', t: { uz: "Bilib bo'lmaydi — qo'shilish kelish degani emas", ru: 'Нельзя знать — присоединиться не значит прийти' } }
];
const HOOK_JAVOB = {
  a: { uz: <><b>Qiziq fikr!</b> Qo'shilgan kuni hamma kelmoqchi edi. O'yin kunigacha reja o'zgarishi mumkin — ilova buni ko'rsatmaydi.</>, ru: <><b>Интересная мысль!</b> В день записи все собирались прийти. До дня игры планы могут измениться — приложение этого не показывает.</> },
  b: { uz: <><b>Qiziq fikr!</b> Ilovada bunday joy hali yo'q — tashkilotchi kim aniq kelishini ko'rmaydi.</>, ru: <><b>Интересная мысль!</b> В приложении такого места пока нет — организатор не видит, кто точно придёт.</> },
  c: { uz: <><b>Aynan!</b> Qo'shilgan odamning rejasi o'zgarishi mumkin. Mentor intervyusida: «10 kishi kerak edi, 7 kishi keldi».</>, ru: <><b>Именно!</b> Планы присоединившегося могут измениться. В интервью Ментора: «Нужно было 10 человек, пришли 7».</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [savol, setSavol] = useState(avval);
  const [qator, setQator] = useState(avval);
  const [sc, setSc] = useState(0);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); setSc(n => n + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    keyin(() => setSavol(true), kam ? 0 : 250);
    keyin(() => { setQator(true); setSc(n => n + 1); }, kam ? 0 : 250 + 9 * 90 + 350);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Qo'shilgan o'yinchilarning hammasi <span className="italic" style={{ color: T.accent }}>maydonga keladimi</span>?</>, ru: <>Все ли присоединившиеся игроки <span className="italic" style={{ color: T.accent }}>придут на поле</span>?</> })}
        mentor={<Mentor>{picked === null
          ? tr({ uz: "Shanba kuni soat 17:00 da tashkilotchi telefonida 18:00 dagi o'yin turibdi, to'qqiz kishi qo'shilgan — avval javobni tanlang.", ru: 'В субботу в 17:00 на телефоне организатора открыта игра на 18:00, присоединились девять человек — сначала выберите ответ.' })
          : tr({ uz: "«Davom etish»ni bosing — bugungi rejani ko'rasiz.", ru: 'Нажмите «Продолжить» — увидите план на сегодня.' })}</Mentor>}
        maket={<div className={cxx('ft-s0', picked === null && 'kutish')}>
          <Tel rol="tashkilotchi" bugun={BUGUN.s17} oyin={1} savol={savol} />
          {qator && <div className="ft-hali"><span>{tr(TASDIQ_Q)} — / 9</span><span className="ft-hali-y">{tr({ uz: "hali yo'q", ru: 'пока нет' })}</span></div>}
        </div>}
        savol={tr({ uz: 'Sizningcha, qaysi biri?', ru: 'Как вы думаете, какой вариант?' })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Dars oxirida» — Tasdiq sahnasi tayyor holatda bir marta o'zi yuradi (DE-200); o'ngda 3 qadam (tegsiz, 172) =====
const REJA = [
  { uz: 'Asosiy harakat: ruxsatni Backend beradi', ru: 'Основное действие: разрешение даёт Backend' },
  { uz: "Natijani boshqa odam o'z telefonida ko'radi", ru: 'Результат другой человек видит на своём телефоне' },
  { uz: 'Tugma faqat ruxsat bor joyda chiqadi', ru: 'Кнопка появляется только там, где есть разрешение' }
];
const RejaSahna = () => {
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [b, setB] = useState(kam ? 9 : 0);
  useEffect(() => {
    if (kam) return;
    const D = PARVOZ_MS;
    const t1 = 700, t2 = t1 + 120 + D, t3 = t2 + 300, t4 = t3 + 300, t5 = t4 + D, t6 = t5 + 250, t7 = t6 + D, t8 = t7 + 600, t9 = t8 + 250 + D, t10 = t9 + D;
    keyin(() => setB(1), t1);
    keyin(() => uchir('[data-rol="oyinchi"] .ft-tel-btn.kel', '[data-yol="tasdiq"]', 'POST /oyinlar/1/tasdiq'), t1 + 120);
    keyin(() => setB(2), t2);
    keyin(() => setB(3), t3);
    keyin(() => uchir('[data-be]', '[data-q="r1"]', ''), t4);
    keyin(() => setB(4), t5);
    keyin(() => uchir('[data-be]', '[data-rol="oyinchi"] .ft-telefon', '', 'javob'), t6);
    keyin(() => setB(5), t7);
    keyin(() => setB(6), t8);
    keyin(() => uchir('[data-rol="tashkilotchi"] .ft-telefon', '[data-yol="tasdiq"]', 'GET /oyinlar'), t8 + 250);
    keyin(() => uchir('[data-be]', '[data-rol="tashkilotchi"] .ft-telefon', '', 'javob'), t9);
    keyin(() => setB(7), t10);
  }, []); // eslint-disable-line
  return (
    <Sahna tur="reja" boxRef={box} parvoz={parvoz}>
      <Tel rol="oyinchi" bugun={BUGUN.shanba} oyin={1} son={false} kel={b >= 5 ? 'tasdiq' : b === 1 ? 'bos' : 'bor'} />
      <div className="ft-sahna-ong">
        <BeQuti holat={b >= 1 && b < 5 ? 'on' : ''} joriy={b >= 1 && b < 5 ? 'tasdiq' : ''} kat={{ kun: b >= 2 ? 'ok' : '', qosh: b >= 3 ? 'ok' : '' }} />
        <IshJadval qatorlar={[{ k: 'r1', c: ['1', '2', b >= 4 ? 'keladi' : 'qoshildi'], yangi: b >= 4 && b < 7 }]} />
      </div>
      <Tel rol="tashkilotchi" bugun={BUGUN.shanba} oyin={1} tort={b === 6 ? 'yur' : 'tayyor'} tasdiq={b >= 7 ? 7 : 6} yashil={b >= 7 ? 7 : 6} yangi={b >= 7} />
    </Sahna>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Dars oxirida roadmap'dagi <span className="italic" style={{ color: T.accent }}>ikkinchi funksiya</span> ishlaydi.</>, ru: <>К концу урока заработает <span className="italic" style={{ color: T.accent }}>вторая функция</span> из roadmap.</> })}
      mentor={<Mentor>{tr({ uz: "Bugun roadmap'dagi ikkinchi funksiyani qurasiz. Mentor misolida bu — o'yin kuni tasdiq: o'yinchi «Kelaman»ni bosadi, tashkilotchi kim aniq kelishini ko'radi.", ru: 'Сегодня вы строите вторую функцию из roadmap. В примере Ментора это подтверждение в день игры: игрок нажимает «Kelaman», организатор видит, кто точно придёт.' })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida', ru: 'К концу урока' })}
      chap={<RejaSahna />}
      ongYorliq={tr({ uz: 'Bugungi 3 qadam', ru: '3 шага на сегодня' })}
      qadamlar={REJA.map(t => ({ t: tr(t) }))}>
      <div className="ft-reja-past fade-up">
        <p className="ft-reja-repo">repo <code>maydon-jamoa</code> · {tr({ uz: "boshlang'ich holat", ru: 'начальное состояние' })} <code>m11-dars-12-start</code> · {tr({ uz: 'namuna', ru: 'образец' })} <code>m11-dars-12-done</code></p>
        <p className="ft-reja-izoh">{tr({ uz: "«Maydon Jamoa» — namuna; amaliyotlarni roadmap'ingizdagi 2-funksiya bilan, o'z mahsulotingizda bajarasiz.", ru: '«Maydon Jamoa» — образец; практику вы делаете со 2-й функцией из своего roadmap, на своём продукте.' })}</p>
      </div>
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — TUSHUNCHA (QTushuncha keng): uch «Kelaman» bittadan — qaysi biri Database'ga yoziladi? Holat bosishlardan chiziladi (P-046) =====
const S2_TAXMIN = [{ k: '1', t: { uz: 'Bittasi', ru: 'Один' } }, { k: '2', t: { uz: 'Ikkitasi', ru: 'Два' } }, { k: '3', t: { uz: 'Uchalasi', ru: 'Все три' } }];
// Tartib (MD): 1 — Shanba 18:00 (qo'shilgan, bugun) · 3 — Yakshanba 10:00 (qo'shilgan, bugun emas) · 2 — Shanba 20:00 (qo'shilmagan)
const S2_OYIN = [{ oyin: 1, qoshildi: true, rad: null }, { oyin: 3, qoshildi: true, rad: 'kun' }, { oyin: 2, qoshildi: false, rad: 'qosh' }];
const S2_QATOR = (keladi) => [{ k: 'r1', c: ['1', '2', keladi ? 'keladi' : 'qoshildi'], yangi: keladi }, { k: 'r3', c: ['3', '2', 'qoshildi'] }];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 3 : 0);        // bosilgan o'yinlar
  const [oi, setOi] = useState(avval ? 2 : 0);      // telefondagi o'yin
  const [yur, setYur] = useState(false);
  const [kel, setKel] = useState(avval ? 'bor' : 'bor');
  const [kat, setKat] = useState(avval ? { kun: 'ok', qosh: 'no' } : { kun: '', qosh: '' });
  const [xato, setXato] = useState(avval ? TASDIQ.sabab.qosh : null);
  const [keladi, setKeladi] = useState(avval);
  const [beHolat, setBeHolat] = useState('');
  const done = n >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const D = ms(PARVOZ_MS);
  const bos = () => {
    if (yur || !taxmin || n !== oi || done) return;
    const g = S2_OYIN[oi];
    setYur(true); setKel('bos'); setKat({ kun: '', qosh: '' }); setXato(null);
    uchir('[data-rol="oyinchi"] .ft-tel-btn.kel', '[data-yol="tasdiq"]', `POST /oyinlar/${g.oyin}/tasdiq`);
    keyin(() => { setBeHolat('on'); korsat('[data-be]'); }, D);
    keyin(() => setKat(k => ({ ...k, kun: g.rad === 'kun' ? 'no' : 'ok' })), D + ms(300));
    if (g.rad === 'kun') {
      keyin(() => { setBeHolat('xato'); uchir('[data-be]', '[data-rol="oyinchi"] .ft-telefon', '403 · ' + ou(TASDIQ.sabab.kun), 'xato'); }, D + ms(700));
      keyin(() => { setKel('bor'); setXato(TASDIQ.sabab.kun); setBeHolat(''); setN(oi + 1); setYur(false); korsat('[data-rol="oyinchi"]'); }, 2 * D + ms(700));
      return;
    }
    keyin(() => setKat(k => ({ ...k, qosh: g.rad === 'qosh' ? 'no' : 'ok' })), D + ms(650));
    if (g.rad === 'qosh') {
      keyin(() => { setBeHolat('xato'); uchir('[data-be]', '[data-rol="oyinchi"] .ft-telefon', '403 · ' + ou(TASDIQ.sabab.qosh), 'xato'); }, D + ms(1000));
      keyin(() => { setKel('bor'); setXato(TASDIQ.sabab.qosh); setBeHolat(''); setN(oi + 1); setYur(false); korsat('[data-rol="oyinchi"]'); }, 2 * D + ms(1000));
      return;
    }
    keyin(() => { setBeHolat('ok'); uchir('[data-be]', '[data-q="r1"]', ''); }, D + ms(1000));
    keyin(() => { setKeladi(true); korsat('[data-db]'); }, 2 * D + ms(1000));
    keyin(() => uchir('[data-be]', '[data-rol="oyinchi"] .ft-telefon', '', 'javob'), 2 * D + ms(1500));
    keyin(() => { setKel('tasdiq'); setBeHolat(''); setN(oi + 1); setYur(false); korsat('[data-rol="oyinchi"]'); }, 3 * D + ms(1500));
  };
  const keyingi = () => { if (yur || n !== oi + 1 || n >= 3) return; setOi(n); setKel('bor'); setXato(null); setKat({ kun: '', qosh: '' }); };
  const g = S2_OYIN[oi];
  const tx2 = S2_TAXMIN.find(x => x.k === taxmin);
  const kutKel = taxmin && !done && n === oi && !yur;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ruxsat', ru: 'Понятие · разрешение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }) : !done ? (n === oi + 1 && n < 3 && !yur ? tr({ uz: "«Keyingi o'yin ›»ni bosing", ru: 'Нажмите «Следующая игра ›»' }) : tr({ uz: '«Kelaman»ni bosing', ru: 'Нажмите «Kelaman»' })) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Uch «Kelaman»dan qaysi biri <span className="italic" style={{ color: T.accent }}>Database'ga yoziladi</span>?</>, ru: <>Какое из трёх «Kelaman» <span className="italic" style={{ color: T.accent }}>запишется в Database</span>?</> })}
        mentor={<Mentor>{!taxmin
          ? tr({ uz: "Ilovada «Kelaman» hozircha har o'yinda turibdi — avval taxminingizni belgilang, keyin uchala o'yinda bosing.", ru: 'В приложении «Kelaman» пока есть в каждой игре — сначала отметьте предположение, потом нажмите во всех трёх играх.' })
          : !done && n === oi + 1 && n < 3 && !yur ? tr({ uz: "Endi «Keyingi o'yin ›»ni bosing va u yerda ham «Kelaman»ni sinab ko'ring.", ru: 'Теперь нажмите «Следующая игра ›» и там тоже попробуйте «Kelaman».' })
          : !done ? tr({ uz: "Telefondagi «Kelaman»ni bosing va Backend'dagi ikki katakni kuzating.", ru: 'Нажмите «Kelaman» на телефоне и следите за двумя клетками в Backend.' })
            : tr({ uz: 'Uchala bosish tugadi — natijani taxminingiz bilan solishtiring.', ru: 'Все три нажатия сделаны — сравните результат со своим предположением.' })}</Mentor>}
        bashorat={<Bashorat savol={tx({ uz: "Uch bosishdan nechtasi Database'ga `keladi` yozadi?", ru: 'Сколько из трёх нажатий запишут в Database `keladi`?' })} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<Sahna tur="qator" boxRef={box} parvoz={parvoz}>
          <Tel rol="oyinchi" bugun={BUGUN.shanba} qosh={taxmin && !tugadi && <span className="ft-oyin-y" key={oi}>{tr({ uz: `O'yin ${oi + 1} / 3`, ru: `Игра ${oi + 1} / 3` })}</span>}
            oyin={g.oyin} son={false} qoshildi={g.qoshildi} kel={kel} onKel={kutKel ? bos : undefined} navbat={kutKel} xato={xato} fokus={tugadi}>
            {!tugadi && n === oi + 1 && n < 3 && !yur && <QTugma className="ft-navbat ft-keyingi-o" onClick={keyingi}>{tr({ uz: "Keyingi o'yin ›", ru: 'Следующая игра ›' })}</QTugma>}
          </Tel>
          <Yolak />
          <BeQuti holat={beHolat} joriy={yur ? 'tasdiq' : ''} kat={kat} />
          <Yolak />
          <IshJadval qatorlar={S2_QATOR(keladi)} fokus={tugadi} />
        </Sahna>}
        natija={done && tx2 && <NatijaBlok togri={taxmin === '1'}
          haqiqat={<Haqiqat taxmin={tr(tx2.t)} haqiqat={tr({ uz: "bittasi — o'yin kuni va qo'shilgan o'yinchi", ru: 'одно — в день игры и от присоединившегося игрока' })} />}
          izoh={tx({ uz: "Token bor, lekin ruxsat yo'q bo'lsa — `403`. Token yo'q bo'lsa — `401`.", ru: 'Токен есть, но разрешения нет — `403`. Токена нет — `401`.' })}
          xulosa={tr({ uz: "Ruxsatni Backend beradi: tugma noto'g'ri joyda tursa ham, Database'ga faqat ruxsat bor tasdiq yoziladi.", ru: 'Разрешение даёт Backend: даже если кнопка стоит не там, в Database записывается только разрешённое подтверждение.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — TEST 1 (QuestionScreen → QTest; INLINE_KEYS.s3 = 2, C). Savol ustida yorliq yo'q (SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Tugma faqat o'yin kuni chiqsa, Backend'dagi qoida kerakmi?"
    question={tr({ uz: <h2 className="title h-ask">Tugma faqat o'yin kuni chiqsa, <span className="italic" style={{ color: T.accent }}>Backend'dagi qoida</span> kerakmi?</h2>, ru: <h2 className="title h-ask">Если кнопка появляется только в день игры, нужно ли <span className="italic" style={{ color: T.accent }}>правило в Backend</span>?</h2> })}
    options={[
      { uz: "Kerak emas — tugma yo'q joydan so'rov ham kelmaydi", ru: 'Не нужно — где нет кнопки, оттуда и запрос не придёт' },
      { uz: "Kerak — Backend tugmani o'yin kuni o'zi ko'rsatadi", ru: 'Нужно — Backend сам показывает кнопку в день игры' },
      { uz: "Kerak — ilova xato ko'rsatsa ham, qoida saqlanadi", ru: 'Нужно — даже если приложение покажет не то, правило сохранится' },
      { uz: "Kerak emas — endi ruxsatni ilovaning o'zi beradi", ru: 'Не нужно — теперь разрешение даёт само приложение' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Tugma — qulaylik; ruxsatni Backend har so'rovda beradi.", ru: 'Кнопка — удобство; разрешение Backend даёт при каждом запросе.' }}
    explainWrong={{
      0: { uz: "Mashqda tugma noto'g'ri joyda ham turdi — so'rov ketdi.", ru: 'В упражнении кнопка стояла и не там — запрос ушёл.' },
      1: { uz: 'Tugmani ilova chizadi; Backend so\'rovga javob beradi.', ru: 'Кнопку рисует приложение; Backend отвечает на запрос.' },
      3: { uz: "Ilova faqat ko'rsatadi. Database'ga kim yozadi?", ru: 'Приложение только показывает. Кто пишет в Database?' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA (QTushuncha keng): tashkilotchi yangi tasdiqni qachon ko'radi? Ikki telefon (o'lcham barqaror), Backend va hisoblagich =====
const S4_TAXMIN = [
  { k: 'zahoti', t: { uz: 'Bosgan zahoti', ru: 'Сразу после нажатия' } },
  { k: 'yangilash', t: { uz: 'Tashkilotchi ekranni yangilaganda', ru: 'Когда организатор обновит экран' } },
  { k: 'boshlanish', t: { uz: "O'yin boshlanganda", ru: 'Когда начнётся игра' } }
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 2 : 0);
  const [yur, setYur] = useState(false);
  const [kel, setKel] = useState(avval ? 'tasdiq' : 'bor');
  const [db, setDb] = useState(avval ? { k: 7, q: 2, yangi: false } : { k: 6, q: 3, yangi: false });
  const [uzuq, setUzuq] = useState(false);
  const [tort, setTort] = useState('tayyor');
  const [son, setSon] = useState(avval ? 7 : 6);
  const [beHolat, setBeHolat] = useState('');
  const [joriy, setJoriy] = useState('');
  const done = n >= 2;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const D = ms(PARVOZ_MS);
  const kelBos = () => {
    if (yur || !taxmin || n !== 0) return;
    setYur(true); setKel('bos');
    uchir('[data-rol="oyinchi"] .ft-tel-btn.kel', '[data-yol="tasdiq"]', 'POST /oyinlar/1/tasdiq');
    keyin(() => { setBeHolat('on'); setJoriy('tasdiq'); korsat('[data-be]'); }, D);
    keyin(() => { setDb({ k: 7, q: 2, yangi: true }); setBeHolat('ok'); }, D + ms(350));
    keyin(() => uchir('[data-be]', '[data-rol="oyinchi"] .ft-telefon', '', 'javob'), D + ms(800));
    keyin(() => { setKel('tasdiq'); setBeHolat(''); setJoriy(''); setUzuq(true); }, 2 * D + ms(800));
    keyin(() => { setDb(d => ({ ...d, yangi: false })); setN(1); setYur(false); korsat('[data-rol="tashkilotchi"]'); }, 2 * D + ms(1300));
  };
  const tortBos = () => {
    if (yur || n !== 1) return;
    setYur(true); setTort('yur');
    keyin(() => { uchir('[data-rol="tashkilotchi"] .ft-telefon', '[data-yol="oyinlar"]', 'GET /oyinlar'); }, ms(450));
    keyin(() => { setBeHolat('on'); setJoriy('oyinlar'); }, ms(450) + D);
    keyin(() => uchir('[data-be]', '[data-rol="tashkilotchi"] .ft-telefon', '', 'javob'), ms(450) + D + ms(300));
    keyin(() => { setUzuq(false); setTort('tayyor'); setSon(7); setBeHolat(''); setJoriy(''); }, ms(450) + 2 * D + ms(300));
    keyin(() => { setN(2); setYur(false); }, ms(450) + 2 * D + ms(1000));
  };
  const tx4 = S4_TAXMIN.find(x => x.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · tashkilotchi ekrani', ru: 'Понятие · экран организатора' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }) : !done ? tr({ uz: `Harakatlarni navbat bilan bajaring (${n}/2)`, ru: `Выполните действия по очереди (${n}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Tashkilotchi yangi tasdiqni <span className="italic" style={{ color: T.accent }}>qachon ko'radi</span>?</>, ru: <>Когда организатор <span className="italic" style={{ color: T.accent }}>увидит новое подтверждение</span>?</> })}
        mentor={<Mentor>{!taxmin
          ? tr({ uz: "Avval taxminingizni belgilang, keyin o'yinchi telefonida «Kelaman»ni bosing.", ru: 'Сначала отметьте предположение, потом нажмите «Kelaman» на телефоне игрока.' })
          : n === 0 ? tr({ uz: "O'yinchi telefonida «Kelaman»ni bosing.", ru: 'Нажмите «Kelaman» на телефоне игрока.' })
            : !done ? tr({ uz: 'Endi tashkilotchi telefonida ekranni pastga torting.', ru: 'Теперь потяните экран вниз на телефоне организатора.' })
              : tr({ uz: 'Ikkala harakat tugadi — natijani taxminingiz bilan solishtiring.', ru: 'Оба действия выполнены — сравните результат со своим предположением.' })}</Mentor>}
        bashorat={<Bashorat savol={tr({ uz: "O'yinchi bosgach, tashkilotchida son qachon o'zgaradi?", ru: 'Когда у организатора изменится число после нажатия игрока?' })} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<Sahna tur="ikki" boxRef={box} parvoz={parvoz}>
          <div className="ft-ikki-tel">
            <Tel rol="oyinchi" bugun={BUGUN.shanba} oyin={1} son={false} kel={kel} onKel={taxmin && n === 0 && !yur ? kelBos : undefined} navbat={taxmin && n === 0 && !yur} />
            <Tel rol="tashkilotchi" bugun={BUGUN.shanba} oyin={1} tasdiq={son} yashil={son} yangi={son === 7 && !avval} tort={tort} onTort={n === 1 && !yur ? tortBos : undefined} tortNavbat={n === 1 && !yur} fokus={tugadi} />
          </div>
          <Yolak uzuq={uzuq} yozuv={uzuq && tr({ uz: "so'rov yo'q", ru: 'запроса нет' })} />
          <div className="ft-sahna-ong">
            <BeQuti yollar={['tasdiq', 'oyinlar']} joriy={joriy} holat={beHolat} />
            <Hisob keladi={db.k} qoshildi={db.q} yangi={db.yangi} />
          </div>
        </Sahna>}
        natija={done && tx4 && <NatijaBlok togri={taxmin === 'yangilash'}
          haqiqat={<Haqiqat taxmin={tr(tx4.t)} haqiqat={tr({ uz: 'tashkilotchi ekranni yangilaganda', ru: 'когда организатор обновит экран' })} />}
          izoh={tr({ uz: '8-darsda shunday joyni real vaqt nuqtasi deb atagansiz.', ru: 'На 8-м уроке вы назвали такое место точкой реального времени.' })}
          xulosa={tr({ uz: "Bu modulda son o'zi yangilanmaydi: tashkilotchi ekranni ochganda yoki pastga tortganda keladi.", ru: 'В этом модуле число само не обновляется: оно приходит, когда организатор открывает экран или тянет его вниз.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — TEST 2 (QuestionScreen → QTest; INLINE_KEYS.s5 = 0, A) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Tashkilotchi ekrani ochiq, ikki o'yinchi tasdiqladi. U sonni qachon ko'radi?"
    question={tr({ uz: <h2 className="title h-ask">Tashkilotchi ekrani ochiq, ikki o'yinchi tasdiqladi. U sonni <span className="italic" style={{ color: T.accent }}>qachon ko'radi</span>?</h2>, ru: <h2 className="title h-ask">Экран организатора открыт, двое игроков подтвердили. <span className="italic" style={{ color: T.accent }}>Когда он увидит число</span>?</h2> })}
    options={[
      { uz: "Pastga tortganda — ilova Backend'dan qayta so'raydi", ru: 'Когда потянет вниз — приложение снова спросит Backend' },
      { uz: "Bosilgan zahoti — Backend sonni telefonga o'zi yuboradi", ru: 'Сразу после нажатия — Backend сам пришлёт число на телефон' },
      { uz: "Ertasi kuni — ilova kunda bir marta so'rab turadi", ru: 'На следующий день — приложение спрашивает раз в день' },
      { uz: 'Bir soatdan keyin — Backend sonni soatda yangilaydi', ru: 'Через час — Backend обновляет число раз в час' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Tortilganda ilova so'raydi va yangi son keladi.", ru: 'Когда тянут вниз, приложение спрашивает — и приходит новое число.' }}
    explainWrong={{
      1: { uz: "Bu modulda Backend telefonga o'zi xabar yubormaydi.", ru: 'В этом модуле Backend сам не отправляет сообщения на телефон.' },
      2: { uz: "Ilova soatga qarab so'ramaydi. Son nimadan keyin o'zgardi?", ru: 'Приложение не спрашивает по часам. После чего изменилось число?' },
      3: { uz: "Backend o'zi hech narsa yubormaydi. Kim so'raydi?", ru: 'Backend сам ничего не отправляет. Кто спрашивает?' }
    }} />
);

// ===== 🏅 BADGES (nishonlar, 3) — ikki savol (birinchi urinish) + bonus: 3-amaliyot oxirgi «Bajardim» (birinchi urinish sharti yo'q) =====
const ACHIEVEMENTS = {
  ruleKeeper: { icon: '🛡️', name: 'Rule Keeper', desc: { uz: "Tugma yashirilsa ham qoida Backend'da kerakligini topdingiz", ru: 'Вы нашли, что правило в Backend нужно, даже если кнопка скрыта' } },
  freshCount: { icon: '🔄', name: 'Fresh Count', desc: { uz: "Tashkilotchi yangi sonni pastga tortganda ko'rishini topdingiz", ru: 'Вы нашли, что организатор видит новое число, когда тянет экран вниз' } },
  secondFeature: { icon: '🏁', name: 'Second Feature', desc: { uz: 'Uch amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили все три блока практики до конца' } }
};
// Ekran id → nishon. Savollar — birinchi urinishda to'g'ri; a3 — oxirgi «Bajardim» (bonus).
const ACH_TRIGGERS = { s3: 'ruleKeeper', s5: 'freshCount', a3: 'secondFeature' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 7)
const Q_LABELS = {
  4: { uz: '1 — Ruxsatni Backend beradi', ru: '1 — Разрешение даёт Backend' },
  7: { uz: '2 — Pastga tortish', ru: '2 — Оттягивание вниз' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'tasdiq', ru: 'подтверждение' }, l: 5, t: 10, s: 26, d: 19, dl: 0 },
  { ch: 'Kelaman', l: 82, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'ruxsat', ru: 'разрешение' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'qoida', ru: 'правило' }, l: 76, t: 66, s: 24, d: 21, dl: 2.2 },
  { ch: '403', l: 45, t: 86, s: 28, d: 25, dl: 1.1 },
  { ch: 'keladi', l: 64, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: 'Backend', l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'pastga tortish', ru: 'потянуть вниз' }, l: 18, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: { uz: 'real vaqt nuqtasi', ru: 'точка реального времени' }, l: 52, t: 52, s: 18, d: 24, dl: 3.4 },
  { ch: 'POST /oyinlar/:id/tasdiq', l: 30, t: 60, s: 16, d: 26, dl: 2.6 },
  { ch: 'Maydon Jamoa', l: 70, t: 44, s: 20, d: 22, dl: 0.2 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javoblar 4 pozitsiyaga TENG (MD: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12)
const QUIZ_BANK = [
  { q: { uz: "O'yinchi «Kelaman»ni bosdi. Ruxsatni kim beradi?", ru: 'Игрок нажал «Kelaman». Кто даёт разрешение?' }, opts: [
    { uz: "Backend — har so'rovni qoida bilan ko'rib", ru: 'Backend — проверяя каждый запрос правилом' }, { uz: "Ilova — tugmani ko'rsatib yoki yashirib", ru: 'Приложение — показывая или скрывая кнопку' },
    { uz: "Database — yangi qatorni o'zi ko'rib", ru: 'Database — сама глядя на новую строку' }, { uz: "Tashkilotchi — har tasdiqni qo'lda ko'rib", ru: 'Организатор — вручную просматривая каждое подтверждение' }], correct: 0 },
  { q: { uz: "Token bor, lekin o'yinchi o'yinga qo'shilmagan. Backend nima qaytaradi?", ru: 'Токен есть, но игрок не присоединился к игре. Что вернёт Backend?' }, opts: [
    { uz: "`401` — kimligi noma'lum deb", ru: '`401` — потому что неизвестно, кто это' }, { uz: "`403` — bu ishga ruxsat yo'q deb", ru: '`403` — потому что на это нет разрешения' },
    { uz: "`201` — yangi qatorni yozib qo'yib", ru: '`201` — записав новую строку' }, { uz: '`404` — bunday yo\'l topilmadi deb', ru: '`404` — потому что такой путь не найден' }], correct: 1 },
  { q: { uz: "Shanbadagi o'yinga juma kuni «Kelaman» so'rovi keldi. Nima bo'ladi?", ru: 'Запрос «Kelaman» на субботнюю игру пришёл в пятницу. Что будет?' }, opts: [
    { uz: "Database'ga baribir `keladi` yozib qo'yiladi", ru: 'В Database всё равно запишут `keladi`' }, { uz: "O'yin o'zi juma kuniga ko'chadi", ru: 'Игра сама перенесётся на пятницу' },
    { uz: "Backend rad etadi, holat o'zgarmaydi", ru: 'Backend откажет, статус не изменится' }, { uz: "Tashkilotchi uni qo'lda tasdiqlaydi", ru: 'Организатор подтвердит его вручную' }], correct: 2 },
  { q: { uz: "«Kelishini tasdiqladi: 7 / 9» da 9 nimani bildiradi?", ru: 'Что означает 9 в «Kelishini tasdiqladi: 7 / 9»?' }, opts: [
    { uz: "Kelishini tasdiqlagan o'yinchilar", ru: 'Игроков, подтвердивших приход' }, { uz: "O'yinga kerak bo'lgan odamlar", ru: 'Людей, нужных для игры' },
    { uz: "Maydondagi bo'sh o'rinlar soni", ru: 'Число свободных мест на поле' }, { uz: "O'yinga qo'shilgan o'yinchilar", ru: 'Игроков, присоединившихся к игре' }], correct: 3 },
  { q: { uz: "Tashkilotchi ekrani ochiq. Yangi tasdiqni qanday ko'radi?", ru: 'Экран организатора открыт. Как он увидит новое подтверждение?' }, opts: [
    { uz: 'Ekranni pastga tortib yangilaydi', ru: 'Обновит экран, потянув вниз' }, { uz: "Ilovani telefondan o'chirib qo'yadi", ru: 'Удалит приложение с телефона' },
    { uz: "Har o'yinchiga qo'ng'iroq qiladi", ru: 'Позвонит каждому игроку' }, { uz: "O'yin boshlanishini kutib turadi", ru: 'Будет ждать начала игры' }], correct: 0 },
  { q: { uz: 'Bu modulda tashkilotchidagi son o\'zi yangilanadimi?', ru: 'В этом модуле число у организатора обновляется само?' }, opts: [
    { uz: 'Ha — Backend uni har soniyada yuboradi', ru: 'Да — Backend присылает его каждую секунду' }, { uz: "Yo'q — ilova so'ragandagina yangilanadi", ru: 'Нет — обновляется, только когда спросит приложение' },
    { uz: "Ha — o'yinchi bosgan zahoti o'zgaradi", ru: 'Да — меняется сразу после нажатия игрока' }, { uz: "Yo'q — son faqat o'yin kuni yangilanadi", ru: 'Нет — число обновляется только в день игры' }], correct: 1 },
  { q: { uz: "«Kelaman» endi faqat o'yin kuni chiqadi. Backend'dagi qoida-chi?", ru: '«Kelaman» теперь появляется только в день игры. А правило в Backend?' }, opts: [
    { uz: "O'chiriladi — endi u kerak emas", ru: 'Удаляется — теперь оно не нужно' }, { uz: 'Ilovaga ko\'chadi — endi u ruxsat beradi', ru: 'Переходит в приложение — теперь оно даёт разрешение' },
    { uz: "Qoladi — har so'rovga ruxsatni u beradi", ru: 'Остаётся — оно даёт разрешение на каждый запрос' }, { uz: "Database'ga ko'chadi — u eslab qoladi", ru: 'Переходит в Database — она запомнит' }], correct: 2 },
  { q: { uz: "Ekran ochiq turganda boshqa odam tufayli nima o'zgaradi?", ru: 'Что меняется из-за другого человека, пока экран открыт?' }, opts: [
    { uz: "«‹ O'yinlar» tugmasining joyi", ru: 'Место кнопки «‹ O\'yinlar»' }, { uz: 'Ilova nomi «Maydon Jamoa»', ru: 'Название приложения «Maydon Jamoa»' },
    { uz: "E'lon formasidagi «Soat» qatori", ru: 'Строка «Soat» в форме объявления' }, { uz: "«Kelishini tasdiqladi» dagi son", ru: 'Число в «Kelishini tasdiqladi»' }], correct: 3 },
  { q: { uz: "Tugmani yashirganda «Nima buzilmasin»ga nima yozasiz?", ru: 'Что вы напишете в «Что не сломать», когда скрываете кнопку?' }, opts: [
    { uz: "Backend'dagi qoida o'chirilmasin", ru: 'Правило в Backend не удалять' }, { uz: "Tugma har o'yinda turaversin", ru: 'Кнопка пусть остаётся в каждой игре' },
    { uz: "Database jadvali tozalab qo'yilsin", ru: 'Таблицу Database очистить' }, { uz: "Yo'l tokensiz ham ochilsin", ru: 'Путь пусть открывается и без токена' }], correct: 0 },
  { q: { uz: "Tasdiqni tekshirish kerak, lekin bugun o'yin yo'q. Nima qilasiz?", ru: 'Нужно проверить подтверждение, но сегодня игры нет. Что сделаете?' }, opts: [
    { uz: 'Backend qoidasini vaqtincha o\'chirasiz', ru: 'Временно отключите правило Backend' }, { uz: "Bugungi sana bilan yangi e'lon berasiz", ru: 'Дадите новое объявление с сегодняшней датой' },
    { uz: "Telefon soatini shanbaga o'tkazasiz", ru: 'Переведёте часы телефона на субботу' }, { uz: 'Shanba kelguncha kutib turasiz', ru: 'Подождёте до субботы' }], correct: 1 },
  { q: { uz: "Backend o'zgarishi Render'ga qanday chiqadi?", ru: 'Как изменение Backend попадает на Render?' }, opts: [
    { uz: "Render sahifasida kodni qo'lda yozasiz", ru: 'Пишете код вручную на странице Render' }, { uz: '`npx expo start` — ilovani qayta yoqasiz', ru: '`npx expo start` — заново запускаете приложение' },
    { uz: "`git push` — Render o'zi qayta chiqaradi", ru: '`git push` — Render сам выложит заново' }, { uz: "Neon'da jadvalni qaytadan yaratasiz", ru: 'Заново создаёте таблицу в Neon' }], correct: 2 },
  { q: { uz: 'Ikkinchi telefonda tekshirish nima uchun kerak?', ru: 'Зачем нужна проверка на втором телефоне?' }, opts: [
    { uz: 'Sizning telefoningiz tezroq ishlashi uchun', ru: 'Чтобы ваш телефон работал быстрее' }, { uz: 'Expo Go yangilanib olishi uchun', ru: 'Чтобы Expo Go обновился' },
    { uz: "Ikkala telefonda ekran bir xil ko'rinishi uchun", ru: 'Чтобы экран выглядел одинаково на обоих телефонах' }, { uz: "Natijani boshqa odam ko'rishini bilish uchun", ru: 'Чтобы знать, что результат видит другой человек' }], correct: 3 }
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
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). steps [{ h, t, bandlar?, kirish?, prompt?, vazifa?, yordam?, err? }] · natija (kutilgan natija · namuna: Maydon Jamoa) · ortda (faqat A1).
// Prompt: QPrompt ko'rinishi (q-prompt klasslari) — uch qatorni o'quvchi yozadi (tayanch 4: 11, 12, 14), namuna «Yordam» ortida. Ustida bitta qator «Vazifa: …».
// Trek — pm-m9d8-platforma (mobil | web); kalit yo'q — ikkala qator (M-q5). 2-funksiya nomi — pm-m9d6-roadmap (ishlar[hozir[1]].nom); kalit yo'q — 1-qadamda erkin qator (saqlanmaydi).
const trekOqi = () => { try { const o = JSON.parse(localStorage.getItem('pm-m9d8-platforma') || 'null'); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; } catch { return null; } };
const funksiyaOqi = () => {
  try {
    const o = JSON.parse(localStorage.getItem('pm-m9d6-roadmap') || 'null');
    const i = o && Array.isArray(o.hozir) ? o.hozir[1] : null;
    const ish = o && Array.isArray(o.ishlar) && Number.isInteger(i) ? o.ishlar[i] : null;
    return ish && typeof ish.nom === 'string' && ish.nom.trim() ? ish.nom.trim() : null;
  } catch { return null; }
};
const FtPrompt = ({ satrlar }) => {
  const [ok, setOk] = useState(false);
  const matn = satrlar.map(l => tr(l));
  const joy = (t, li) => t.split(/(\{[^}]+\})/g).map((p, i) => (/^\{.+\}$/.test(p) ? <span key={li + '-' + i} className="q-joy">{p}</span> : p));
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  return (
    <span className="q-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="ft-ps">{joy(l, i)}</span>)}
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
      <QTugma ikkinchi className="ft-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      {ochiq && <span className="ft-yordam fade-step">{guruhlar.map((g, gi) => (
        <React.Fragment key={gi}>
          {g.yorliq && <span className="ft-yordam-l">{tr(g.yorliq)}</span>}
          {(g.satrlar || []).map((l, i) => <span key={i} className="ft-yordam-s">{tx(l)}</span>)}
          {g.gap && <span className="ft-yordam-g">{tx(g.gap)}</span>}
        </React.Fragment>
      ))}</span>}
    </>
  );
};
// «Ortda qoldingizmi» — faqat A1 da, darsda bir marta (F-1006-271, SABOQ 39)
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'git checkout -f m11-dars-12-done'];
const Ortda = ({ oxiri }) => (
  <p className="ft-ortda">{tr({ uz: 'Ortda qoldingizmi — Mentor misolini oching:', ru: 'Отстали — откройте пример Ментора:' })} <code className="ft-buyruq">{ORTDA[0]}</code> · <code className="ft-buyruq">{ORTDA[1]}</code>{oxiri && <> {tx(oxiri)}</>}</p>
);
// 2-funksiya nomi kaliti yo'q bo'lsa — 1-qadamda erkin qator (yangi kalit yo'q, saqlanmaydi)
const FunksiyaKirish = () => {
  const [v, setV] = useState('');
  return (
    <span className="ft-funk-k">
      <span className="ft-funk-l">{tr({ uz: '2-funksiyangiz nomi', ru: 'Название вашей 2-й функции' })}</span>
      <input className="ft-funk-in" value={v} onChange={e => setV(e.target.value)} placeholder={tr({ uz: "o'yin kuni tasdiq", ru: 'подтверждение в день игры' })} />
    </span>
  );
};
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' }; // S3 (F-1006-287): 14-dars naqshi
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
  // SABOQ 8 / S3 (F-1006-287, 14-dars naqshi): Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${tr(steps[stepN].h)}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${tr(steps[stepN].h)}»: выполните и нажмите «Bajardim».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<><Mentor>{tr(mGap)}</Mentor>{tepa}</>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: <>{tx(c.t)}{c.bandlar && c.bandlar.map((b, i) => <span key={i} className="ft-band">{tx(b)}</span>)}{c.kirish}{c.vazifa && <span className="ft-vazifa"><b>{tr({ uz: 'Vazifa:', ru: 'Задача:' })}</b> {tx(c.vazifa)}</span>}{c.prompt && <FtPrompt satrlar={c.prompt} />}</>,
          xato: c.yordam ? <Yordam guruhlar={c.yordam} /> : (c.err && tx(c.err))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tx(doneText)} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
        pastki={<>{done && izoh && <QIzoh>{tr(izoh)}</QIzoh>}<MentorPracticeStats live={_live} screen={screen} /></>}>
        {ortda && <Ortda oxiri={ortda} />}
      </QBlok>
    </Stage>
  );
}
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const QADAM = {
  ochish: { uz: 'Ochish', ru: 'Открыть' }, prompt: { uz: 'Prompt', ru: 'Промпт' }, ishga: { uz: 'Ishga tushirish', ru: 'Запуск' },
  telefon: { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }, ikki: { uz: 'Ikki foydalanuvchi bilan tekshirish', ru: 'Проверка с двумя пользователями' }
};
const PROMPT_T = { uz: "uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'напишите три строки сами, нажмите «Скопировать», отправьте в Antigravity:' };
const PROMPT_UCH = [{ uz: 'Qayerda: {qayerda}', ru: 'Где: {где}' }, { uz: 'Nima qilsin: {nima qilsin}', ru: 'Что сделать: {что сделать}' }, { uz: 'Nima buzilmasin: {nima buzilmasin}', ru: 'Что не сломать: {что не сломать}' }];
const TEKSHIR_T = { uz: 'talabning har qatorini tekshiring:', ru: 'проверьте каждую строку требования:' };
const XATO_GAP = { uz: "Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка — отправьте агенту строку ошибки (не значения `.env` и не токен): «Вышла такая ошибка: {ошибка}. Исправь.»' };
const TREK_YORLIQ = { mobil: { uz: 'mobil trek', ru: 'мобильный трек' }, web: { uz: 'web-trek', ru: 'веб-трек' } };
// «Yordam»: Mentor misolidagi to'liq prompt (mobil trek) + web-trek gapi (faqat web-trekda yoki trek noma'lum bo'lsa)
const yordamGuruh = (trek, satrlar, webGap) => {
  const web = trek !== 'mobil';
  return [
    { yorliq: web && TREK_YORLIQ.mobil, satrlar },
    web && { yorliq: TREK_YORLIQ.web, gap: webGap }
  ].filter(Boolean);
};

// Kutilgan natija maketlari (o'ng) — bitta manbadan (TASDIQ, OYIN, Tel); bir marta o'zi yuradi (kam harakatda — oxirgi kadr)
const useKadr = (soni, qadam = 1700) => {
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [k, setK] = useState(kam ? soni - 1 : 0);
  useEffect(() => { if (kam) return; for (let i = 1; i < soni; i++) keyin(() => setK(i), i * qadam); }, []); // eslint-disable-line
  return k;
};
const SqlKarta = ({ qatorlar, d }) => (
  <div className="ft-sql ft-kir" style={{ '--d': d }}>
    <span className="ft-sql-h">Neon · SQL Editor</span>
    <IshJadval qatorlar={qatorlar} />
  </div>
);
// A1: kadr 1 — Shanba 18:00, «Kelaman» → «Tasdiqladingiz» · kadr 2 — Shanba 20:00, qo'shilmagan: «Kelaman» → qizil qator
const A1Natija = () => {
  const k = useKadr(4, 1300);
  const kadr2 = k >= 2;
  return (
    <div className="ft-nat">
      <Tel bugun={BUGUN.shanba} rol="oyinchi" oyin={kadr2 ? 2 : 1} qoshildi={!kadr2} kel={k === 1 ? 'tasdiq' : 'bor'} xato={k === 3 ? TASDIQ.sabab.qosh : null} className="ft-kir" />
      <SqlKarta d="0.18s" qatorlar={[{ k: 'r1', c: ['1', '2', k >= 1 ? 'keladi' : 'qoshildi'], yangi: k === 1 }]} />
    </div>
  );
};
// A2: ikki telefon — o'yinchi «Kelaman» → «Tasdiqladingiz»; tashkilotchi «6 / 9» → pastga tortish → «7 / 9»
const A2Natija = () => {
  const k = useKadr(4, 1200);
  return (
    <div className="ft-nat">
      <div className="ft-ikki-tel">
        <Tel rol="oyinchi" bugun={BUGUN.shanba} oyin={1} son={false} kel={k >= 1 ? 'tasdiq' : 'bor'} className="ft-kir" />
        <Tel rol="tashkilotchi" bugun={BUGUN.shanba} oyin={1} tort={k === 2 ? 'yur' : 'tayyor'} tasdiq={k >= 3 ? 7 : 6} yashil={k >= 3 ? 7 : 6} yangi={k >= 3} className="ft-kir" />
      </div>
    </div>
  );
};
// A3: uch kadr, har kadr ustida «Bugun: …» — juma: «Kelaman» yo'q · shanba: «Kelaman» → «Tasdiqladingiz» · shanba, qo'shilmagan o'yin: «Kelaman» yo'q.
// Yonida — GET /oyinlar javobidagi menTasdiqlayOlaman (tugma ko'rinishini Backend aytadi, 9.87)
const A3_KADR = [
  { bugun: BUGUN.juma, oyin: 1, qoshildi: true, kel: undefined, olaman: false },
  { bugun: BUGUN.shanba, oyin: 1, qoshildi: true, kel: 'bor', olaman: true },
  { bugun: BUGUN.shanba, oyin: 1, qoshildi: true, kel: 'tasdiq', olaman: false, men: true },
  { bugun: BUGUN.shanba, oyin: 2, qoshildi: false, kel: undefined, olaman: false }
];
const A3Natija = () => {
  const k = useKadr(4, 1500);
  const f = A3_KADR[k];
  return (
    <div className="ft-nat">
      <Tel rol="oyinchi" bugun={f.bugun} oyin={f.oyin} qoshildi={f.qoshildi} kel={f.kel} className="ft-kir" />
      <div className="ft-javob ft-kir" style={{ '--d': '0.18s' }} key={k}>
        <code className="ft-javob-h">GET /oyinlar</code>
        <span className="ft-javob-q"><code>id: {f.oyin}</code></span>
        <span className={cxx('ft-javob-q', f.olaman && 'ok')}><code>menTasdiqlayOlaman: {String(f.olaman)}</code></span>
        {f.men && <span className="ft-javob-q ok"><code>menTasdiqlaganman: {String(f.men)}</code></span>}
      </div>
    </div>
  );
};

const A1_YORDAM = [
  { uz: "Qayerda: `backend/` — yangi yo'l `POST /oyinlar/:id/tasdiq`; `mobil/` — «O'yin» ekrani (`src/app/oyin/[id].tsx`).", ru: 'Где: `backend/` — новый путь `POST /oyinlar/:id/tasdiq`; `mobil/` — экран «O\'yin» (`src/app/oyin/[id].tsx`).' },
  { uz: "Nima qilsin: «O'yin» ekranida «Kelaman» tugmasi bo'lsin — hozircha har o'yinda. Bosilsa, Backend o'yinchining `ishtirokchilar` dagi holatini `keladi` qilsin.", ru: 'Что сделать: на экране «O\'yin» пусть будет кнопка «Kelaman» — пока в каждой игре. При нажатии Backend пусть ставит игроку в `ishtirokchilar` статус `keladi`.' },
  { uz: "Ruxsat faqat o'yin kuni va faqat o'yinga qo'shilgan o'yinchiga; «bugun» — Toshkent vaqti bilan. Aks holda `403` va sabab qaytarsin: «Tasdiq faqat o'yin kuni» yoki «Siz bu o'yinga qo'shilmagansiz»; ilova shu gapni tugma ostida ko'rsatsin. Tasdiqlangach tugma o'rnida «Tasdiqladingiz» (o'chiq).", ru: 'Разрешение только в день игры и только присоединившемуся игроку; «сегодня» — по времени Ташкента. Иначе пусть вернёт `403` и причину: «Tasdiq faqat o\'yin kuni» или «Siz bu o\'yinga qo\'shilmagansiz»; приложение показывает эту фразу под кнопкой. После подтверждения на месте кнопки — «Tasdiqladingiz» (неактивна).' },
  { uz: "Nima buzilmasin: «Qo'shilaman», «8 / 10» va «O'yin to'ldi» avvalgidek ishlasin; yangi yo'l ham faqat token bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: «Qo\'shilaman», «8 / 10» и «O\'yin to\'ldi» работают как раньше; новый путь — тоже только с токеном. Больше ничего не трогай, назови изменённые файлы.' }
];
const a1Qadamlar = (trek, funksiya) => {
  const mob = trek !== 'web', web = trek !== 'mobil';
  return [
    { h: QADAM.ochish, t: { uz: "Antigravity'da o'z repo'ngizni oching (11-darsdagi holat: 1-funksiya ishlaydi). 2-funksiyangiz uchun ikki savolga javob toping: foydalanuvchi nimani bosadi? Kim va qachon bosa oladi? Javoblar «Nima qilsin» qatoriga kiradi (Mentor misolida: «Kelaman» · faqat o'yin kuni, faqat qo'shilgan o'yinchi).", ru: 'Откройте свой репо в Antigravity (состояние после 11-го урока: 1-я функция работает). Для своей 2-й функции ответьте на два вопроса: что нажимает пользователь? Кто и когда может нажать? Ответы войдут в строку «Что сделать» (в примере Ментора: «Kelaman» · только в день игры, только присоединившийся игрок).' },
      bandlar: [{ uz: "Funksiyangizda alohida qoida yoki natijani ko'radigan boshqa odam bo'lmasa — har blokda funksiyangizning mos qismini quring: harakat · natija qayerda ko'rinadi · tugma qachon chiqadi.", ru: 'Если в вашей функции нет отдельного правила или другого человека, который видит результат, — в каждом блоке стройте подходящую часть функции: действие · где виден результат · когда появляется кнопка.' }],
      kirish: !funksiya && <FunksiyaKirish /> },
    { h: QADAM.prompt, t: PROMPT_T,
      vazifa: { uz: "Foydalanuvchi asosiy harakatni bajaradi; kim va qachon qila olishini Backend hal qiladi — ruxsat bo'lmasa, rad etib sababini qaytaradi. Tugma hozircha ruxsat yo'q joyda ham tursin — rad javobini ko'rasiz.", ru: 'Пользователь выполняет основное действие; кто и когда может это сделать, решает Backend — без разрешения он отказывает и возвращает причину. Кнопка пока пусть стоит и там, где разрешения нет, — увидите отказ.' },
      prompt: PROMPT_UCH,
      yordam: yordamGuruh(trek, A1_YORDAM, { uz: "«Qayerda» qatorida ilova papkasi o'rniga sayt papkangiz va o'yin sahifasi turadi; Backend qismi o'sha.", ru: 'В строке «Где» вместо папки приложения — папка вашего сайта и страница игры; часть Backend — та же.' }) },
    { h: QADAM.ishga, t: { uz: "`git status` (ro'yxat agent aytgani bilan bir xil, `.env` yo'q) → har faylni `git add <fayl>` → `git commit -m \"2-funksiya: harakat va ruxsat\"` → `git push`.", ru: '`git status` (список совпадает с тем, что сказал агент, `.env` нет) → каждый файл `git add <fayl>` → `git commit -m "2-funksiya: harakat va ruxsat"` → `git push`.' },
      bandlar: [
        { uz: "Render Backend'ni push'dan keyin o'zi qayta chiqaradi — Render sahifangizda yangi deploy tugashini kuting.", ru: 'Render сам заново выкладывает Backend после push — дождитесь на своей странице Render окончания нового деплоя.' },
        mob && { uz: "Mobil trekda: `npx expo start`, QR'ni Expo Go bilan oching; QR ochilmasa — telefon va laptop bitta Wi-Fi'dami? Bo'lmasa: `npx expo start --tunnel`.", ru: 'В мобильном треке: `npx expo start`, откройте QR через Expo Go; если QR не открывается — телефон и ноутбук в одной Wi-Fi? Если нет: `npx expo start --tunnel`.' },
        web && { uz: "Web-trekda: push — Netlify o'zi yangilanadi.", ru: 'В веб-треке: push — Netlify обновится сам.' }
      ].filter(Boolean),
      err: XATO_GAP },
    { h: QADAM.telefon, t: TEKSHIR_T,
      bandlar: [
        { uz: "(1) Ruxsat bor holatda asosiy harakatni bajaring — ekranda yangi holat (Mentor misolida: bugungi sana bilan e'lon berib, unga qo'shilib, «Kelaman» → «Tasdiqladingiz»).", ru: '(1) В состоянии с разрешением выполните основное действие — на экране новое состояние (в примере Ментора: дать объявление с сегодняшней датой, присоединиться к нему, «Kelaman» → «Tasdiqladingiz»).' },
        { uz: "(2) Neon'dagi SQL Editor'da jadvalingizni oching — sizning qatoringizda yangi holat (Mentor misolida: `SELECT oyin_id, oyinchi_id, holat FROM ishtirokchilar;` → `keladi`).", ru: '(2) В SQL Editor на Neon откройте свою таблицу — в вашей строке новое состояние (в примере Ментора: `SELECT oyin_id, oyinchi_id, holat FROM ishtirokchilar;` → `keladi`).' },
        { uz: "(3) Ruxsat yo'q holatda bosing — ilova Backend'ning sababini ko'rsatadi, jadval o'zgarmaydi. «Nima buzilmasin» qatoringizni ham tekshiring. Mos kelmagan qatorni uch qism bilan agentga yozing.", ru: '(3) Нажмите в состоянии без разрешения — приложение показывает причину от Backend, таблица не меняется. Проверьте и свою строку «Что не сломать». Несовпавшую строку напишите агенту тремя частями.' }
      ] }
  ];
};
const ScreenA1 = (props) => {
  const [trek] = useState(trekOqi);
  const [funksiya] = useState(funksiyaOqi);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · harakat va ruxsat', ru: 'Практика 1 · действие и разрешение' }}
      title={{ uz: <>Asosiy harakat ishlasin, <span className="italic" style={{ color: T.accent }}>ruxsatni Backend bersin</span>.</>, ru: <>Действие работает, <span className="italic" style={{ color: T.accent }}>разрешение — от Backend</span>.</> }}
      mentor={{ uz: <>Uch qatorning hammasi sizdan, namuna «Yordam»da; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Все три строки — ваши, образец — в «Помощи»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
      tepa={funksiya && <p className="ft-funk">{tr({ uz: "Roadmap'ingizdagi 2-funksiya:", ru: '2-я функция из вашего roadmap:' })} <b>{funksiya}</b></p>}
      steps={a1Qadamlar(trek, funksiya)}
      natija={<A1Natija />}
      ortda={{ uz: "— qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.", ru: '— увидите, как это работает, и повторите шаг в своём репо по образцу.' }}
      izoh={{ uz: "Push'dan keyin Render yangi versiyani chiqarguncha eski Backend javob beradi — yangi yo'l hali yo'q.", ru: 'После push, пока Render не выложит новую версию, отвечает старый Backend — нового пути ещё нет.' }}
      doneText={{ uz: "Asosiy harakat ishlaydi; ruxsat bo'lmasa, Backend sababini qaytaradi.", ru: 'Основное действие работает; без разрешения Backend возвращает причину.' }} />
  );
};

const A2_YORDAM = [
  { uz: "Qayerda: `backend/` — `GET /oyinlar` javobi; `mobil/` — «O'yin» ekrani.", ru: 'Где: `backend/` — ответ `GET /oyinlar`; `mobil/` — экран «O\'yin».' },
  { uz: "Nima qilsin: `GET /oyinlar` javobida har o'yinga `tasdiqlagan` — kelishini tasdiqlaganlar soni qo'shilsin. O'yinni e'lon qilgan o'yinchi «O'yin» ekranida «Kelishini tasdiqladi: 7 / 9» ni ko'rsin — tasdiqlaganlar / qo'shilganlar; tasdiqlaganlar doirasi yashil. Ma'lumot ekran ochilganda va pastga tortilganda Backend'dan qayta olinsin.", ru: 'Что сделать: в ответе `GET /oyinlar` к каждой игре добавить `tasdiqlagan` — число подтвердивших приход. Игрок, объявивший игру, видит на экране «O\'yin» «Kelishini tasdiqladi: 7 / 9» — подтвердившие / присоединившиеся; кружки подтвердивших — зелёные. Данные заново берутся из Backend при открытии экрана и при оттягивании вниз.' },
  { uz: "Nima buzilmasin: «Kelaman» va Backend'dagi qoida avvalgidek; tasdiq soni faqat tashkilotchiga ko'rinsin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: «Kelaman» и правило в Backend — как раньше; число подтверждений видит только организатор. Больше ничего не трогай, назови изменённые файлы.' }
];
const a2Qadamlar = (trek) => [
  { h: QADAM.ochish, t: { uz: "o'z repo'ngizda 1-amaliyotdagi holat. Natijani kim va qayerda ko'radi — bir gap bilan o'ylang (Mentor misolida: tashkilotchi, «O'yin» ekranida).", ru: 'в своём репо — состояние после 1-й практики. Кто и где видит результат — продумайте одной фразой (в примере Ментора: организатор, на экране «O\'yin»).' },
    bandlar: [{ uz: "Ikkinchi foydalanuvchi — o'z telefoningizda «Hisobdan chiqish» bilan ikkinchi akkaunt; sinfdoshingiz telefoni ham bo'ladi (web-trekda — havola, mobil trekda — Android'dagi Expo Go).", ru: 'Второй пользователь — второй аккаунт на вашем телефоне через «Hisobdan chiqish»; подойдёт и телефон одноклассника (в веб-треке — ссылка, в мобильном — Expo Go на Android).' }] },
  { h: QADAM.prompt, t: PROMPT_T,
    vazifa: { uz: "Harakat natijasi boshqa foydalanuvchiga ko'rinadi va ekran ochilganda yoki pastga tortilganda Backend'dan qayta olinadi.", ru: 'Результат действия виден другому пользователю и заново берётся из Backend при открытии экрана или оттягивании вниз.' },
    prompt: PROMPT_UCH,
    yordam: yordamGuruh(trek, A2_YORDAM, { uz: "pastga tortish o'rniga «Yangilash» tugmasi — ma'lumot sahifa ochilganda va shu tugma bosilganda olinadi.", ru: 'вместо оттягивания вниз — кнопка «Yangilash»: данные берутся при открытии страницы и при нажатии этой кнопки.' }) },
  { h: QADAM.ishga, t: { uz: '`git status` → `git add <fayl>` → commit → `git push`; Render deploy tugashini kuting.', ru: '`git status` → `git add <fayl>` → commit → `git push`; дождитесь окончания деплоя на Render.' },
    bandlar: [
      { uz: "Ikkinchi akkaunt: «Hisobdan chiqish» → namuna ism va **boshqa** namuna telefon bilan ro'yxatdan o'ting (Mentor misolida `+998 90 000 00 02`; telefon takrorlansa, ro'yxatdan o'tish rad etiladi).", ru: 'Второй аккаунт: «Hisobdan chiqish» → зарегистрируйтесь с именем-образцом и **другим** телефоном-образцом (в примере Ментора `+998 90 000 00 02`; если телефон повторяется, регистрация отклоняется).' },
      { uz: "Sinfdosh telefoni bilan: web-trekda — Netlify havolangiz; mobil trekda — Android'dagi Expo Go QR'ni ochadi (bitta Wi-Fi). Expo akkauntingiz ma'lumotlarini boshqaga bermaysiz.", ru: 'С телефоном одноклассника: в веб-треке — ваша ссылка Netlify; в мобильном — Expo Go на Android открывает QR (одна Wi-Fi). Данные своего аккаунта Expo другим не даёте.' }
    ],
    err: XATO_GAP },
  { h: QADAM.ikki, t: TEKSHIR_T,
    bandlar: [
      { uz: "(1) Natijani ko'radigan — siz, harakatni bajaradigan — ikkinchi akkaunt (Mentor misolida: siz bugungi o'yinni e'lon qilasiz, ikkinchi akkaunt qo'shilib «Kelaman»ni bosadi).", ru: '(1) Результат видите вы, действие выполняет второй аккаунт (в примере Ментора: вы объявляете сегодняшнюю игру, второй аккаунт присоединяется и нажимает «Kelaman»).' },
      { uz: "(2) Bitta telefonda: harakatni ikkinchi akkauntda bajaring, o'z akkauntingizga qayting — ekran ochilganda yangi son. Sinfdosh telefoni bilan: ekraningiz ochiq turganda son o'zgarmaydi, pastga torting — yangi son keladi.", ru: '(2) На одном телефоне: выполните действие во втором аккаунте, вернитесь в свой — при открытии экрана новое число. С телефоном одноклассника: пока ваш экран открыт, число не меняется; потяните вниз — придёт новое число.' },
      { uz: "(3) «Nima buzilmasin» qatoringizni tekshiring (Mentor misolida: ikkinchi akkauntda tasdiq soni ko'rinmaydi). Sinfdosh bilan bo'lsangiz, keyin rollarni almashing.", ru: '(3) Проверьте свою строку «Что не сломать» (в примере Ментора: во втором аккаунте число подтверждений не видно). Если вы с одноклассником — потом поменяйтесь ролями.' }
    ] }
];
const ScreenA2 = (props) => {
  const [trek] = useState(trekOqi);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · boshqa odam ko'radi", ru: 'Практика 2 · видит другой человек' }}
      title={{ uz: <>Natijani boshqa odam <span className="italic" style={{ color: T.accent }}>o'z telefonida</span> ko'rsin.</>, ru: <>Результат видит другой человек <span className="italic" style={{ color: T.accent }}>на своём телефоне</span>.</> }}
      mentor={{ uz: <>Uch qatorni yana o'zingiz yozasiz, tekshirishga ikkinchi foydalanuvchi kerak; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Три строки снова пишете сами, для проверки нужен второй пользователь; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
      steps={a2Qadamlar(trek)}
      natija={<A2Natija />}
      izoh={trek !== 'web' && { uz: "Sinfdoshingiz telefoni ilova kodini sizning laptopingizdan oladi — o'yinlar esa Render'dagi Backend'dan.", ru: 'Телефон одноклассника берёт код приложения с вашего ноутбука, а игры — из Backend на Render.' }}
      doneText={{ uz: "Ikki foydalanuvchi bilan tekshirildi: boshqa odam harakatingiz natijasini o'z ekranida ko'radi.", ru: 'Проверено с двумя пользователями: другой человек видит результат вашего действия на своём экране.' }} />
  );
};

const A3_YORDAM = [
  { uz: "Qayerda: `mobil/` — «O'yin» ekrani; `backend/` — `GET /oyinlar` javobi.", ru: 'Где: `mobil/` — экран «O\'yin»; `backend/` — ответ `GET /oyinlar`.' },
  { uz: "Nima qilsin: javobda har o'yinga `menTasdiqlaganman` (kirgan o'yinchi tasdiqlaganmi) va `menTasdiqlayOlaman` qo'shilsin — Backend uni `…/tasdiq` dagi o'sha qoida bilan hisoblasin (o'yin kuni, qo'shilgan).", ru: 'Что сделать: в ответ к каждой игре добавить `menTasdiqlaganman` (подтвердил ли вошедший игрок) и `menTasdiqlayOlaman` — Backend считает его тем же правилом, что в `…/tasdiq` (день игры, присоединился).' },
  { uz: "«Kelaman» faqat `menTasdiqlayOlaman` bo'lsa chiqsin — ilova sanani o'zi solishtirmasin; tasdiqlagan bo'lsa — «Tasdiqladingiz» (o'chiq), ilova qayta ochilganda ham.", ru: '«Kelaman» появляется только при `menTasdiqlayOlaman` — приложение само даты не сравнивает; если уже подтвердил — «Tasdiqladingiz» (неактивна), и после перезапуска приложения тоже.' },
  { uz: "Nima buzilmasin: Backend'dagi qoida o'chirilmasin — tugma yashirilsa ham, har so'rovga ruxsatni u bersin. «Qo'shilaman», «O'yin to'ldi» va «Kelishini tasdiqladi» avvalgidek. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: правило в Backend не удалять — даже если кнопка скрыта, разрешение на каждый запрос даёт он. «Qo\'shilaman», «O\'yin to\'ldi» и «Kelishini tasdiqladi» — как раньше. Больше ничего не трогай, назови изменённые файлы.' }
];
const a3Qadamlar = (trek) => {
  const mob = trek !== 'web', web = trek !== 'mobil';
  const ishga = { uz: "push → Render deploy tugashini kuting" + (mob ? " · mobil trekda `npx expo start` (QR ochilmasa — bitta Wi-Fi yoki `--tunnel`)" : '') + (web ? (mob ? ', web-trekda' : ' · web-trekda') + " push — Netlify o'zi yangilanadi." : '.'),
    ru: 'push → дождитесь окончания деплоя на Render' + (mob ? ' · в мобильном треке `npx expo start` (если QR не открывается — одна Wi-Fi или `--tunnel`)' : '') + (web ? (mob ? ', в веб-треке' : ' · в веб-треке') + ' push — Netlify обновится сам.' : '.') };
  return [
    { h: QADAM.ochish, t: { uz: "1-amaliyotda tugma ruxsat yo'q joyda ham turgan edi. Ruxsat yo'q holatlarni sanab chiqing (Mentor misolida ikkita: o'yin bugun emas · o'yinchi qo'shilmagan).", ru: 'в 1-й практике кнопка стояла и там, где разрешения нет. Перечислите случаи без разрешения (в примере Ментора два: игра не сегодня · игрок не присоединился).' } },
    { h: QADAM.prompt, t: PROMPT_T,
      vazifa: { uz: "Tugma faqat qoida ruxsat bergan joyda chiqadi; bajarilgan harakat holati ilova qayta ochilganda ham ko'rinadi.", ru: 'Кнопка появляется только там, где разрешает правило; состояние выполненного действия видно и после перезапуска приложения.' },
      prompt: PROMPT_UCH,
      yordam: yordamGuruh(trek, A3_YORDAM, { uz: "o'sha uch qator sayt papkangizdagi o'yin sahifasi uchun; holat sahifa yangilanganda ham ko'rinsin.", ru: 'те же три строки — для страницы игры в папке вашего сайта; состояние видно и после обновления страницы.' }) },
    { h: QADAM.ishga, t: ishga, err: XATO_GAP },
    { h: QADAM.telefon, t: TEKSHIR_T,
      bandlar: [
        { uz: "(1) Ruxsat bor holat — tugma bor (Mentor misolida: bugungi, qo'shilgan o'yin — «Kelaman»).", ru: '(1) Есть разрешение — кнопка есть (в примере Ментора: сегодняшняя игра, где вы присоединились, — «Kelaman»).' },
        { uz: "(2) Har ruxsat yo'q holat — tugma yo'q (Mentor misolida: boshqa kungi o'yin; qo'shilmagan o'yin).", ru: '(2) В каждом случае без разрешения — кнопки нет (в примере Ментора: игра другого дня; игра, где вы не присоединились).' },
        { uz: "(3) Mobil trekda terminalda `r` ni bosing (web-trekda sahifani yangilang) — bajarilgan holat joyida turibdi. Oxirida `git status` → `git add <fayl>` → commit → `git push`.", ru: '(3) В мобильном треке нажмите `r` в терминале (в веб-треке обновите страницу) — выполненное состояние на месте. В конце `git status` → `git add <fayl>` → commit → `git push`.' }
      ] }
  ];
};
const ScreenA3 = (props) => {
  const [trek] = useState(trekOqi);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 3 · tugma faqat kerak joyda', ru: 'Практика 3 · кнопка только где нужно' }}
      title={{ uz: <>Tugma faqat <span className="italic" style={{ color: T.accent }}>ruxsat bor joyda</span> chiqsin.</>, ru: <>Кнопка появляется только <span className="italic" style={{ color: T.accent }}>там, где есть разрешение</span>.</> }}
      mentor={{ uz: <>Uch qatorni yozasiz, Backend'dagi qoida joyida qolishi — «Nima buzilmasin» qatoriga; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Три строки пишете сами, то, что правило в Backend остаётся, — в строку «Что не сломать»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
      steps={a3Qadamlar(trek)}
      natija={<A3Natija />}
      doneText={{ uz: "Tugma faqat ruxsat bor joyda chiqadi; bajarilgan holat qayta ochilganda ham ko'rinadi.", ru: 'Кнопка появляется только там, где есть разрешение; выполненное состояние видно и после перезапуска.' }} />
  );
};

// 🃏 KARTOCHKALAR (12) — alohida ekran sflash (SABOQ 12, 16), qolipdagi QKartochka (DE-204). Orqa tomon — oddiy matn (kod-belgisiz); old va izoh — tx.
const KARTALAR = [
  { front: { uz: 'Ikkinchi funksiya qayerdan olinadi?', ru: 'Откуда берётся вторая функция?' }, back: { uz: "Roadmap'ingizdagi «hozir» ufqidan", ru: 'Из горизонта «сейчас» вашего roadmap' }, note: { uz: "Mentor misolida — o'yin kuni tasdiq", ru: 'В примере Ментора — подтверждение в день игры' } },
  { front: { uz: "Mentor misolida «Kelaman»ni kim bosa oladi?", ru: 'Кто в примере Ментора может нажать «Kelaman»?' }, back: { uz: "O'yinga qo'shilgan o'yinchi — faqat o'yin kuni", ru: 'Присоединившийся к игре игрок — только в день игры' }, note: { uz: "Shu qoida bo'yicha ruxsatni Backend beradi", ru: 'По этому правилу разрешение даёт Backend' } },
  { front: { uz: 'Ruxsatni kim beradi: ilovami yoki Backend?', ru: 'Кто даёт разрешение: приложение или Backend?' }, back: { uz: "Backend — har so'rovda", ru: 'Backend — при каждом запросе' }, note: { uz: "Tugma faqat ko'rinish", ru: 'Кнопка — только вид' } },
  { front: { uz: "Token bor, lekin ruxsat yo'q bo'lsa, Backend nima qaytaradi?", ru: 'Что вернёт Backend, если токен есть, а разрешения нет?' }, back: { uz: '403', ru: '403' }, note: { uz: "Token yo'q bo'lsa — `401`", ru: 'Если токена нет — `401`' } },
  { front: { uz: "«Kelaman» bosilganda Database'da nima o'zgaradi?", ru: 'Что меняется в Database при нажатии «Kelaman»?' }, back: { uz: "ishtirokchilar dagi holat keladi bo'ladi", ru: 'статус в ishtirokchilar становится keladi' }, note: { uz: "Oldin `qoshildi` edi", ru: 'Раньше был `qoshildi`' } },
  { front: { uz: "«Tasdiq faqat o'yin kuni» degan javob qachon keladi?", ru: 'Когда приходит ответ «Tasdiq faqat o\'yin kuni»?' }, back: { uz: "O'yin bugun bo'lmasa", ru: 'Если игра не сегодня' }, note: { uz: "Mentor talabida «bugun» — Toshkent vaqti bilan", ru: 'В требовании Ментора «сегодня» — по времени Ташкента' } },
  { front: { uz: "«Kelishini tasdiqladi: 7 / 9» nimani bildiradi?", ru: 'Что означает «Kelishini tasdiqladi: 7 / 9»?' }, back: { uz: "Qo'shilgan to'qqiz kishidan yettitasi kelishini tasdiqladi", ru: 'Из девяти присоединившихся семеро подтвердили приход' }, note: { uz: "Mentor misolida faqat tashkilotchiga ko'rinadi", ru: 'В примере Ментора видно только организатору' } },
  { front: { uz: "Tashkilotchi yangi tasdiqni qachon ko'radi?", ru: 'Когда организатор видит новое подтверждение?' }, back: { uz: 'Ekranni ochganda yoki pastga tortganda', ru: 'Когда открывает экран или тянет вниз' }, note: { uz: "Bu modulda son o'zi yangilanmaydi", ru: 'В этом модуле число само не обновляется' } },
  { front: { uz: 'Real vaqt nuqtasi nima?', ru: 'Что такое точка реального времени?' }, back: { uz: "Ekran ochiq turganda boshqa odam tufayli o'zgaradigan joy", ru: 'Место, которое меняется из-за другого человека, пока экран открыт' }, note: { uz: "8-darsdan; tasdiq soni — shunday joy", ru: 'С 8-го урока; число подтверждений — такое место' } },
  { front: { uz: "Tugma yashirilsa, Backend'dagi qoida nega qoladi?", ru: 'Почему правило в Backend остаётся, если кнопку скрыли?' }, back: { uz: "Ilova xato ko'rsatsa ham, ruxsatsiz tasdiq yozilmasin deb", ru: 'Чтобы даже при ошибке приложения не записалось подтверждение без разрешения' }, note: { uz: "«Nima buzilmasin» qatoriga yoziladi", ru: 'Пишется в строку «Что не сломать»' } },
  { front: { uz: "Bugun o'yin bo'lmasa, tasdiqni qanday tekshirasiz?", ru: 'Как проверить подтверждение, если сегодня игры нет?' }, back: { uz: "Bugungi sana bilan yangi e'lon berasiz", ru: 'Даёте новое объявление с сегодняшней датой' }, note: { uz: '1-funksiya shu uchun ham kerak', ru: '1-я функция нужна и для этого' } },
  { front: { uz: 'Uyga sinovda siz nima qilasiz?', ru: 'Что вы делаете на домашнем тесте?' }, back: { uz: "Vazifani o'qib berasiz va to'xtashlarni yozasiz", ru: 'Зачитываете задание и записываете остановки' }, note: { uz: 'Tushuntirmaysiz, yordam bermaysiz', ru: 'Не объясняете и не помогаете' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */}
        <div className={cxx('ft-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tr(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="ft-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — istisno (Qaror-0 16): HwCard (P-025: «Kim bilan · Nechta · Muddat» + raqamli qadamlar; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: "mahsulotingiz kim uchun bo'lsa, shunday odamlar", ru: 'люди, для которых ваш продукт' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '3 ta sinov', ru: '3 теста' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Sinov vazifasini bitta gap qilib yozing: odam nimaga erishsin — qaysi tugmani bosishni emas. Vazifa — mahsulotingizdagi asosiy ish, faqat bugungi funksiya emas. Mentor misolida: «Shanba soat 18:00 dagi o'yinga qo'shiling.»", ru: 'Запишите задание теста одной фразой: чего должен добиться человек — а не какую кнопку нажать. Задание — основное дело в вашем продукте, не только сегодняшняя функция. В примере Ментора: «Присоединитесь к игре в субботу в 18:00.»' },
  { uz: "Har sinovchidan oldin «Hisobdan chiqish»ni bosing: sinovchi namuna ism va har biri boshqa namuna telefon bilan ro'yxatdan o'tadi — o'z raqamini yozmaydi. Telefoningizni bering — unga hech narsa o'rnatish shart emas; mobil trekda laptopda `npx expo start` ishlab tursin (bitta Wi-Fi).", ru: 'Перед каждым тестирующим нажимайте «Hisobdan chiqish»: тестирующий регистрируется с именем-образцом и каждый — с другим телефоном-образцом, свой номер не пишет. Дайте свой телефон — ему ничего не нужно устанавливать; в мобильном треке на ноутбуке пусть работает `npx expo start` (одна Wi-Fi).' },
  { uz: "Vazifani o'qib bering va kuzating: har to'xtashni vaqti bilan qog'ozga yozing, oxirida belgilang — vazifani bajara oldimi, ha yoki yo'q. Yozuvlarni keyingi darsga olib keling.", ru: 'Зачитайте задание и наблюдайте: каждую остановку записывайте на бумагу со временем, в конце отметьте — смог ли выполнить задание, да или нет. Принесите записи на следующий урок.' }
];
const HwCard = () => (
  <div className="card ft-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="ft-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="ft-hw-q"><span className="ft-hw-k">{tr(r.k)}</span><span className="ft-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="ft-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{tx(q)}</span></li>)}</ol>
    <span className="ft-hw-izoh">{tr({ uz: "9-Moduldagidek: vazifa berasiz, yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz va qayerda to'xtaganini yozasiz.", ru: 'Как в 9-м модуле: даёте задание, не объясняете путь, не показываете решение и записываете, где человек остановился.' })}</span>
  </div>
);

// ===== YAKUN — QYakun (DE-204) + uyga vazifa (istisno) + «Keyingi dars»; kartochkalar — oldingi alohida ekranda. Sarlavha holatga qarab (P-046; 12-FILTR 42) =====
const YAKUN_SARLAVHA = {
  a3: { uz: 'Ikkinchi funksiya tayyor: ruxsatni Backend beradi.', ru: 'Вторая функция готова: разрешение даёт Backend.' },
  a2: { uz: 'Harakat va natija ishlaydi — tugma qoidasi qoldi.', ru: 'Действие и результат работают — осталось правило кнопки.' },
  a1: { uz: "Harakat va ruxsat ishlaydi — natijani ko'rsatish qoldi.", ru: 'Действие и разрешение работают — осталось показать результат.' },
  yoq: { uz: 'Ikkinchi funksiya boshlandi — qolgan qadamni tugating.', ru: 'Вторая функция начата — завершите оставшийся шаг.' }
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
    { uz: 'Harakatga kim va qachon ruxsat olishini Backend hal qiladi.', ru: 'Кто и когда получает разрешение на действие, решает Backend.' },
    { uz: "Token bor, lekin ruxsat yo'q bo'lsa, Backend `403` qaytaradi.", ru: 'Если токен есть, а разрешения нет, Backend возвращает `403`.' },
    { uz: "Tugma yashirilsa ham, Backend'dagi qoida joyida qoladi.", ru: 'Даже если кнопку скрыть, правило в Backend остаётся на месте.' },
    { uz: "Bu modulda boshqa odam natijani ekranni ochganda yoki pastga tortganda ko'radi.", ru: 'В этом модуле другой человек видит результат, когда открывает экран или тянет его вниз.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      {/* Belgi «✓ 2-funksiya tayyor» — faqat 3-amaliyot bajarilganda; aks holda belgisiz (MD 7). «Keyingi dars» — uyga vazifadan keyin, nishonlardan oldin */}
      <div className={cxx('ft-yakun', belgisiz && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: '2-funksiya tayyor', ru: '2-я функция готова' })}
          togri={correct} jami={total}
          sarlavha={tr(YAKUN_SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tx)}
          uyga={<HwCard />}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}>
          <p className="ft-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Uch foydalanuvchidan keyin nimani tuzatasiz?»</b>: auditoriya bilan sinov va shu darsda tuzatish.</>, ru: <>Следующий урок — <b>«Что вы исправите после трёх пользователей?»</b>: тест с аудиторией и исправление на этом же уроке.</> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function FeatureTwoLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — «Tasdiq sahnasi» (ft-). Faqat qolip tokenlari (D3); brend rangi faqat nomda: Maydon Jamoa (#2E9E4F, tayanch 9.62). Emoji yo'q (D4). Telefon 172×272 hamma ekranda (SABOQ 22) === */
        /* Halqa (SABOQ 32): yengil — soya ≤ 0.3, sikl 2.2 s, guruhda bitta; kam harakatda statik */
        .ft-navbat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: ft-puls 2.2s ease-out infinite; }
        @keyframes ft-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.3)}; } 70% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        @keyframes ft-kot { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes ft-pop { 0% { transform: scale(1); } 40% { transform: scale(1.35); } 100% { transform: scale(1); } }
        @keyframes ft-tush { from { opacity: 0; transform: translateY(-10px) scale(0.6); } to { opacity: 1; transform: none; } }
        @keyframes ft-yig { from { opacity: 0.3; transform: scaleY(1.6); } to { opacity: 1; transform: none; } }
        @keyframes ft-yon { 0% { background: ${fon(T.ok, 0.32)}; } 100% { background: transparent; } }
        @keyframes ft-ayl { to { transform: rotate(360deg); } }
        .ft-navbat-k .q-bashorat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: ft-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both, ft-puls 2.2s ease-out 0.7s infinite; }
        .ft-navbat-k .q-chip { animation: ft-kot 0.4s ease-out 0.15s both; }
        .ft-navbat-k .q-chip:nth-child(2) { animation-delay: 0.25s; } .ft-navbat-k .q-chip:nth-child(3) { animation-delay: 0.35s; }
        .q-kirish:has(.ft-s0.kutish) .q-variantlar-kol { border-radius: 14px; outline: 2px solid ${T.accent}; outline-offset: 5px; animation: ft-puls 2.2s ease-out 0.9s infinite; }
        .q-kirish:has(.ft-s0) .q-split { grid-template-columns: auto minmax(0,1fr); gap: clamp(20px,3.4vw,40px); align-items: start; }
        .q-reja:has(.ft-sahna.reja) .q-split { grid-template-columns: minmax(0,1.42fr) minmax(0,0.58fr); }
        .ft-taxmin { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; transform-origin: top; animation: ft-yig 0.45s cubic-bezier(.2,.9,.3,1) both; }
        .ft-taxmin-y { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.accent}; }
        .ft-taxmin-s { color: ${T.ink2}; } .ft-taxmin b { color: ${T.ink}; }
        .ft-nb { display: flex; flex-direction: column; gap: 6px; }
        .ft-nb-t { font-size: 13.5px; font-weight: 600; color: ${T.ink2}; } .ft-nb-t.ok { color: ${T.ok}; font-weight: 700; } .ft-nb-t b { color: ${T.ink}; }
        .ft-nb-i { font-size: 13.5px; color: ${T.ink2}; }
        .ft-nb-x { font-weight: 600; color: ${T.ink}; }
        /* Kirish: telefon ustunini egallaydi, ostida bo'sh qator «hali yo'q» */
        .ft-s0 { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .ft-hali { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 196px; padding: 8px 10px; border-radius: 10px; border: 1.5px dashed ${fon(T.ink, 0.25)}; background: ${fon(T.ink, 0.04)}; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; text-align: center; animation: ft-kot 0.45s ease-out both; }
        .ft-hali-y { font-size: 11px; font-weight: 700; padding: 1px 9px; border-radius: 999px; background: ${fon(T.ink, 0.08)}; color: ${T.ink2}; }
        /* Telefon = ilova */
        .ft-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 7px; flex: none; }
        .ft-tel-yorliq { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; max-width: 290px; min-height: 22px; }
        .ft-rol, .ft-bugun { display: inline-flex; align-items: center; height: 22px; padding: 0 10px; border-radius: 999px; font-size: 11.5px; font-weight: 700; white-space: nowrap; }
        .ft-rol.oyinchi { background: ${T.accentSoft}; color: ${T.accent}; } .ft-rol.tashkilotchi { background: ${fon(T.ink, 0.08)}; color: ${T.ink}; }
        .ft-bugun { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .ft-telefon { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 4px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; transition: box-shadow 0.3s; }
        .ft-telefon.fokus { box-shadow: 0 0 0 4px ${fon(T.accent, 0.18)}, 0 12px 26px -14px rgba(${T.shadowBase},0.4); }
        .ft-tel-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; }
        .ft-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: #2E9E4F; letter-spacing: 0.01em; }
        .ft-tortish { align-self: center; flex: none; height: 19px; padding: 0 10px; border-radius: 999px; border: 1px solid ${T.line}; background: ${T.bg}; color: ${T.ink2}; font-family: 'Manrope', sans-serif; font-size: 10.5px; font-weight: 800; cursor: pointer; touch-action: none; }
        .ft-tortish:disabled { cursor: default; opacity: 0.8; }
        .ft-aylan { align-self: center; flex: none; display: flex; align-items: center; justify-content: center; height: 19px; }
        .ft-aylan i { width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${fon(T.ink, 0.15)}; border-top-color: ${T.accent}; animation: ft-ayl 0.7s linear infinite; }
        .ft-tel-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 2px; animation: ft-ekran 0.35s ease-out both; transition: transform 0.35s cubic-bezier(.3,1.2,.5,1); }
        .ft-tel-ekran.tort { transform: translateY(12px); }
        @keyframes ft-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        .ft-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .ft-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .ft-joy { font-size: 12px; color: ${T.ink2}; }
        .ft-son { display: inline-block; align-self: flex-start; margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; color: ${T.ink}; }
        .ft-doiralar { display: grid; grid-template-columns: repeat(5, 15px); gap: 5px; margin: 3px 0 4px; }
        .ft-doiralar i { display: flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; font-style: normal; font-size: 9.5px; font-weight: 800; line-height: 1; color: #fff; }
        .ft-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.36)}; }
        .ft-doiralar i.ok { background: ${T.ok}; }
        .ft-doiralar i.yangi { animation: ft-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .ft-doiralar i.savol { background: ${fon(T.ink, 0.12)}; color: ${T.ink}; animation: ft-tush 0.35s cubic-bezier(.3,1.4,.5,1) both; animation-delay: calc(var(--i) * 90ms); }
        .ft-tq { margin-top: auto; padding: 5px 7px; border-radius: 8px; background: ${T.bg}; font-size: 11px; font-weight: 700; color: ${T.ink}; line-height: 1.3; }
        .ft-tq b { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${T.ok}; }
        .ft-tq b.yangi { animation: ft-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .ft-tugmalar { margin-top: auto; display: flex; flex-direction: column; gap: 4px; }
        .ft-tel-btn { flex: none; display: flex; align-items: center; justify-content: center; height: 26px; padding: 0 6px; border: 0; border-radius: 9px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 800; white-space: nowrap; transition: transform 0.15s, background 0.3s, color 0.3s; }
        button.ft-tel-btn { cursor: pointer; } button.ft-tel-btn:disabled { cursor: default; }
        .ft-tel-btn.kel { box-shadow: 0 6px 14px -8px ${fon(T.accent, 0.6)}; }
        .ft-tel-btn.bos { transform: scale(0.92); }
        .ft-tel-btn.off { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .ft-tel-btn.off.yangi { animation: ft-kot 0.35s ease-out both; }
        .ft-tel-xato { display: block; padding: 4px 6px; border-radius: 7px; background: ${T.errFon}; color: ${T.err}; font-size: 10.5px; font-weight: 700; line-height: 1.3; text-align: center; animation: ft-kot 0.35s ease-out both; }
        .ft-oyin-y { display: inline-flex; align-items: center; height: 22px; padding: 0 9px; border-radius: 999px; background: ${fon(T.ink, 0.06)}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink}; animation: ft-kot 0.3s ease-out both; }
        .ft-tel-ust > .q-btn.ft-keyingi-o { align-self: center; padding: 7px 14px; font-size: 13px; white-space: nowrap; animation: ft-kot 0.35s ease-out both, ft-puls 2.2s ease-out 0.4s infinite; }
        /* Backend va Database */
        .ft-be { display: flex; flex-direction: column; gap: 7px; padding: 11px 13px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); min-width: 0; transition: border-color 0.3s, box-shadow 0.3s; }
        .ft-be.on { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.14)}; }
        .ft-be.ok { border-color: ${T.ok}; box-shadow: 0 0 0 4px ${fon(T.ok, 0.12)}; }
        .ft-be.xato { border-color: ${T.err}; box-shadow: 0 0 0 4px ${fon(T.err, 0.12)}; }
        .ft-be-h { font-size: 13.5px; color: ${T.ink}; }
        .ft-yol { display: block; padding: 4px 8px; border-radius: 8px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; overflow-wrap: anywhere; transition: background 0.3s, color 0.3s; }
        .ft-yol.on { background: ${T.accentSoft}; color: ${T.accent}; }
        .ft-kataklar { display: flex; flex-direction: column; gap: 5px; }
        .ft-katak { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .ft-katak i { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; flex: none; border-radius: 6px; border: 1.5px dashed ${fon(T.ink, 0.3)}; font-style: normal; font-size: 12px; font-weight: 800; color: #fff; }
        .ft-katak.ok i { border: 0; background: ${T.ok}; animation: ft-tush 0.4s cubic-bezier(.3,1.4,.5,1) both; }
        .ft-katak.no i { border: 0; background: ${T.err}; animation: ft-tush 0.4s cubic-bezier(.3,1.4,.5,1) both; }
        .ft-katak.no { color: ${T.err}; }
        .ft-db { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; min-width: 0; transition: box-shadow 0.3s; }
        .ft-db.fokus { box-shadow: 0 0 0 4px ${fon(T.ok, 0.14)}; border-color: ${T.ok}; }
        .ft-db-h { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ft-db-h code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; }
        table.ft-jt { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        table.ft-jt th { text-align: left; font-weight: 700; color: ${T.ink2}; padding: 3px 6px; border-bottom: 1px solid ${T.line}; }
        table.ft-jt td { padding: 4px 6px; color: ${T.ink}; border-bottom: 1px solid ${fon(T.ink, 0.06)}; }
        table.ft-jt tr.kir td { animation: ft-yon 1.2s ease-out both; }
        table.ft-jt td.ft-holat.keladi { color: ${T.ok}; font-weight: 800; }
        .ft-hisob { gap: 8px; }
        .ft-hisob-q { display: flex; gap: 10px; }
        .ft-hisob-b { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 7px 10px; border-radius: 10px; background: ${T.bg}; }
        .ft-hisob-b code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .ft-hisob-b b { display: inline-block; align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: ${T.ink}; }
        .ft-hisob-b.ok b { color: ${T.ok}; }
        .ft-hisob-b b.yangi { animation: ft-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        /* Sahna: telefon chapda, chizma o'ngda (SABOQ 21) */
        .ft-sahna { position: relative; display: flex; align-items: center; justify-content: center; min-width: 0; }
        .ft-sahna.qator > .ft-be, .ft-sahna.qator > .ft-db { flex: 0 1 270px; min-width: 228px; }
        .ft-sahna-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; flex: 0 1 280px; }
        .ft-sahna.reja { display: grid; grid-template-columns: auto minmax(0,1fr) auto; gap: 14px; align-items: center; }
        .ft-ikki-tel { display: flex; gap: 12px; align-items: flex-start; }
        .ft-yolak { position: relative; flex: 0 0 clamp(26px,4vw,56px); height: 2px; background: ${T.line}; }
        .ft-yolak.uzuq { background: transparent; border-top: 2px dashed ${fon(T.ink, 0.3)}; height: 0; flex-basis: clamp(70px,8vw,96px); }
        .ft-yolak-y { position: absolute; left: -12px; right: -12px; top: -22px; text-align: center; white-space: nowrap; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; animation: ft-kot 0.35s ease-out both; }
        .ft-konvert { position: absolute; z-index: 6; pointer-events: none; padding: 3px 9px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.accent}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 8px 18px -8px rgba(${T.shadowBase},0.4); transform: translate(-50%,-50%); animation: ft-uch linear both; }
        .ft-konvert.javob { border-color: ${T.ok}; color: ${T.ok}; }
        .ft-konvert.xato { border-color: ${T.err}; color: ${T.err}; background: ${T.errFon}; }
        .ft-konvert.nuqta { width: 14px; height: 14px; padding: 0; border-radius: 50%; background: ${T.accent}; }
        .ft-konvert.javob.nuqta { background: ${T.ok}; }
        @keyframes ft-uch { from { transform: translate(-50%,-50%); } to { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); } }
        /* Reja pastki qatorlari */
        .ft-reja-past { display: flex; flex-direction: column; gap: 4px; }
        p.ft-reja-repo { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        p.ft-reja-repo code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; background: ${fon(T.ink, 0.06)}; padding: 1px 6px; border-radius: 5px; }
        p.ft-reja-izoh { margin: 0; font-size: 13px; color: ${T.ink2}; }
        /* Amaliyot bloki */
        .ft-ps { display: block; margin: 0; font-size: clamp(12.5px,1.5vw,13.5px); line-height: 1.55; color: ${T.ink}; font-weight: 500; overflow-wrap: break-word; }
        .ft-band { display: block; margin-top: 5px; }
        .ft-vazifa { display: block; margin-top: 8px; padding: 7px 10px; border-radius: 9px; background: ${T.bg}; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .ft-vazifa b { color: ${T.ink}; }
        .ft-funk-k { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
        .ft-funk-l { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        input.ft-funk-in { font-family: 'Manrope', sans-serif; font-size: 14px; padding: 8px 11px; border-radius: 9px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; outline: none; }
        input.ft-funk-in:focus { border-color: ${T.accent}; }
        p.ft-funk { margin: 0; font-size: 13.5px; color: ${T.ink2}; }
        p.ft-funk b { color: ${T.ink}; }
        .ft-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
        .ft-yordam-s { display: block; padding: 5px 9px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; font-size: 12.5px; line-height: 1.45; }
        .ft-yordam-l { margin-top: 4px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .ft-yordam-g { display: block; font-size: 12.5px; color: ${T.ink2}; }
        .q-blok-xato .q-btn.ft-yordam-btn { padding: 5px 12px; font-size: 12.5px; }
        .q-blok-t .qcode, .q-blok-xato .qcode, .ft-yordam .qcode, .ft-ps .qcode, .q-blok-tugadi .qcode, p.ft-ortda .qcode { white-space: normal; overflow-wrap: anywhere; }
        p.ft-ortda { margin: 0; font-size: 12.5px; line-height: 1.7; color: ${T.ink2}; overflow-wrap: anywhere; }
        .ft-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; background: ${fon(T.ink, 0.06)}; padding: 1px 6px; border-radius: 5px; }
        .ft-nat { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; justify-content: center; }
        .ft-nat > .ft-sql, .ft-nat > .ft-javob { flex: 1 1 200px; max-width: 280px; margin-top: 29px; }
        .ft-kir { animation: ft-kot 0.45s ease-out var(--d, 0s) both; }
        .ft-sql { display: flex; flex-direction: column; gap: 6px; }
        .ft-sql-h { font-size: 12px; font-weight: 800; color: ${T.ink2}; }
        .ft-javob { display: flex; flex-direction: column; gap: 5px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .ft-javob-h { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ft-javob-q code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; }
        .ft-javob-q.ok code { color: ${T.ok}; font-weight: 800; }
        /* Kartochkalar (SABOQ 16) */
        .ft-flash.yangi .fc-card:not(.flip) .fc-front { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: ft-puls 2.2s ease-out 3; }
        p.ft-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.ft-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* Yakun */
        .ft-yakun { flex: 1 0 auto; display: flex; flex-direction: column; min-height: 0; }
        .ft-yakun.belgisiz .done-chip { display: none; }
        .ft-yakun .q-yakun > .ach-coll { order: 1; }
        p.ft-keyingi { margin: 0; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
        p.ft-keyingi b { color: ${T.ink}; }
        .ft-hw { display: flex; flex-direction: column; gap: 10px; }
        .ft-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .ft-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .ft-hw-k { font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .ft-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.ft-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.ft-hw-qadam li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        ol.ft-hw-qadam li i { flex-shrink: 0; font-style: normal; font-size: 17px; line-height: 1.3; color: ${T.accent}; }
        .ft-hw-izoh { font-size: 13px; color: ${T.ink2}; }
        .rc-ic .ft-rc-kod { display: inline-block; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(13px,2vw,18px); line-height: 1.4; color: ${CODE.text}; background: ${CODE.bg}; padding: 10px 16px; border-radius: 10px; overflow-wrap: anywhere; }
        @media (max-width: 860px) { .q-kirish:has(.ft-s0) .q-split, .q-reja:has(.ft-sahna.reja) .q-split { grid-template-columns: minmax(0,1fr); } }
        @media (max-width: 760px) {
          .ft-sahna.qator, .ft-sahna.ikki { flex-direction: column; align-items: center; gap: 0; }
          .ft-sahna.qator > .ft-be, .ft-sahna.qator > .ft-db, .ft-sahna-ong { flex: none; width: 100%; max-width: 340px; }
          .ft-yolak, .ft-yolak.uzuq { flex: none; width: 2px; height: 22px; border-top: 0; }
          .ft-yolak.uzuq { width: 0; height: 40px; border-left: 2px dashed ${fon(T.ink, 0.3)}; background: transparent; }
          .ft-yolak-y { left: 10px; right: auto; top: 12px; text-align: left; }
          .ft-sahna.reja { grid-template-columns: auto auto; justify-content: center; gap: 10px; }
          .ft-sahna.reja > .ft-sahna-ong { grid-column: 1 / -1; grid-row: 2; max-width: none; }
          .ft-ikki-tel { gap: 8px; }
          .ft-tel-yorliq { max-width: 176px; gap: 4px; }
          .ft-rol, .ft-bugun, .ft-oyin-y { height: 20px; padding: 0 7px; font-size: 10.5px; }
          .ft-bugun { font-size: 10px; }
          .zoomable:not(.zoom-on) > .ft-sahna.ikki, .zoomable:not(.zoom-on) .ft-nat:has(.ft-ikki-tel) { padding-top: 32px; } /* ⛶ yorliqlarni yopmasin */
          .ft-hw-karta { grid-template-columns: minmax(0,1fr); }
          .ft-nat > .ft-sql, .ft-nat > .ft-javob { margin-top: 0; max-width: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ft-navbat, .ft-navbat-k .q-bashorat, .q-kirish:has(.ft-s0.kutish) .q-variantlar-kol, .ft-flash.yangi .fc-card:not(.flip) .fc-front { animation: none !important; }
          .ft-navbat-k .q-chip, .ft-taxmin, .ft-hali, .ft-tel-ekran, .ft-doiralar i, .ft-tq b, .ft-tel-btn, .ft-tel-xato, .ft-katak i, table.ft-jt tr.kir td, .ft-hisob-b b, .ft-yolak-y, .ft-kir, .ft-aylan i { animation: none !important; transition: none !important; }
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
