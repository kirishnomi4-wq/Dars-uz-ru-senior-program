import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul (kod: src/9-Modull) · 11-dars «Loyiha kuni: 1-asosiy funksiya» (m9-11). Skeletdan (src/skelet/NamunaDars.jsx) qurildi, 06.10.2026.
// Manba-haqiqat: feedback/F-1005-11modul/11-FeatureOne-v3.md (GATE M). 8 ekran + 3 amaliyot bloki + kartochkalar = 12 (SABOQ 12).
// Oqim: s0 QKirish · s1 QReja · s2 QTushuncha (e'lon egasi — token) · a1 blok · s3 test · s4 QTushuncha (eskirgan son) · a2 blok · s5 test · a3 blok · podium · sflash · s7 QYakun.
// Bitta vizual — «Funksiya sahnasi» (JAMOA_F1 → FunksiyaSahna): telefon chapda (172×272, SABOQ 22), Backend va Database o'ngda; konvert — so'rov.
// Infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletdan o'zgarishsiz.
// ============================================================
// RU: agentga yuboriladigan PRD gapi (s0) — Mentor repo'sidagi real qiymat; Database ustunlari va SQL (s2, a1, a3) — kod nomlari.
// ru-qoldiq-istisno s0: qo'shilaman
// ru-qoldiq-istisno s2: ism kerak
// ru-qoldiq-istisno s3: kerak
// ru-qoldiq-istisno s8: kerak

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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QKarta, QBashorat, QKirish, QReja, QTushuncha, QTest, QTestJavob, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm9-11-v1', lessonTitle: { uz: "Loyiha kuni: 1-asosiy funksiya", ru: "День проекта: 1-я основная функция" } };
// 12 ekran · oqim: kirish → reja → tushuncha → amaliyot 1 → 1-savol → tushuncha → amaliyot 2 → 2-savol → amaliyot 3 → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'talab', ru: "требование" }, l: 8, tp: 22, s: 13, d: 6 },
  { t: 'token', l: 68, tp: 16, s: 12, d: 7.5 },
  { t: '8 / 10', l: 24, tp: 70, s: 12, d: 8.5 },
  { t: 'Backend', l: 78, tp: 68, s: 13, d: 6.8 }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD da belgilangan: 1-savol (s3) — C, 2-savol (s5) — D. `practice: -1` — sentinel (uch blok, variant yo'q).
const INLINE_KEYS = { s3: 2, s5: 3, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI: 4 — 1-savol, 7 — 2-savol). Emoji o'rniga koddan bitta qator (S-026).
const RECAPS = {
  4: {
    title: { uz: "E'lon egasi — tokendan", ru: "Владелец объявления — из токена" },
    cards: [
      { ic: <code className="fo-rc-kod">POST /oyinlar</code>, h: { uz: "E'lon", ru: "Объявление" }, body: { uz: "Kun, soat, maydon va odam soni Backend'ga ketadi.", ru: "День, время, поле и число людей уходят в Backend." } },
      { ic: <code className="fo-rc-kod">{'Authorization: Bearer <token>'}</code>, h: { uz: 'Token', ru: "Токен" }, body: { uz: "So'rov bilan birga kim yuborgani ham keladi.", ru: "Вместе с запросом приходит и то, кто его отправил." } },
      { ic: <code className="fo-rc-kod">tashkilotchi_id</code>, h: { uz: 'Egasi', ru: "Владелец" }, body: { uz: 'Backend uni tokendan yozadi, formadan emas.', ru: "Backend записывает его по токену, а не из формы." }, ask: { uz: "Formaga «Tashkilotchi» maydoni nega kerak emas?", ru: "Почему в форме не нужно поле «Организатор»?" } }
    ]
  },
  7: {
    title: { uz: "To'lgan o'yinni Backend tekshiradi", ru: "Заполненную игру проверяет Backend" },
    cards: [
      { ic: <code className="fo-rc-kod">9 / 10</code>, h: { uz: 'Ekran', ru: "Экран" }, body: { uz: "Telefon oxirgi so'ralgan sonni ko'rsatadi.", ru: "Телефон показывает число из последнего запроса." } },
      { ic: <code className="fo-rc-kod">POST /oyinlar/:id/qoshilish</code>, h: { uz: 'Backend', ru: "Backend" }, body: { uz: "Database'dagi sonni ko'rib, o'yin to'lganini biladi.", ru: "Смотрит число в Database и узнаёт, что игра заполнена." } },
      { ic: <code className="fo-rc-kod">409 · O'yin to'ldi</code>, h: { uz: 'Javob', ru: "Ответ" }, body: { uz: "Backend qo'shmaydi, ilova xabarni ko'rsatadi.", ru: "Backend не добавляет, приложение показывает сообщение." }, ask: { uz: "Ekranda joy bor edi — nega qo'shila olmadingiz?", ru: "На экране было место — почему не получилось присоединиться?" } }
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

// ===== DARSNING O'Z VIZUALI — «Funksiya sahnasi» (MD: bitta vizual, 163/180). Bitta manba: JAMOA_F1 + OYINLAR → Tel, OyinlarE, OyinE, ElonE, AgentChat, BackendQ, Db kartalari, FunksiyaSahna; bloklar maketlari ham shundan =====
// Holatlar (MD): kulrang — hali yo'q · oq — ishlaydi · accent — joriy · yashil — bugun qurildi / to'g'ri · qizil — aytilmagan holat / eskirgan son. Konvert — so'rov (joylari DOM dan o'lchanadi, ⛶ va telefonda ham to'g'ri).
// Bosiladigan maket qismlari — telefondagi tugma va SQL qatorining nusxa tugmasi (pastdagi izoh). Kam harakat rejimida uchish yo'q, holat birdan almashadi (DE-200).
// qolip-maket: fo-tel-btn fo-nusxa
const cxx = (...a) => a.filter(Boolean).join(' ');
const kamHarakat = () => typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
// Kechiktirilgan qadamlar: ekrandan chiqilganda hammasi bekor bo'ladi
const useKeyin = () => {
  const ids = useRef([]);
  useEffect(() => () => { ids.current.forEach(clearTimeout); ids.current = []; }, []);
  return useCallback((fn, ms) => { ids.current.push(setTimeout(fn, ms)); }, []);
};
const NUSXA = { uz: 'Nusxalash', ru: "Скопировать" };
const NUSXALANDI = { uz: '✓ Nusxalandi', ru: "✓ Скопировано" };
// SQL qatori (Neon SQL Editor) — mono, nusxalanadigan (MD KOD 7)
const SqlChip = ({ s }) => {
  const [ok, setOk] = useState(false);
  const tirik = useRef(true);
  useEffect(() => () => { tirik.current = false; }, []);
  const nusxa = async () => { try { await navigator.clipboard.writeText(s); setOk(true); setTimeout(() => { if (tirik.current) setOk(false); }, 1400); } catch { /* clipboard yopiq — o'quvchi qatorni qo'lda belgilaydi */ } };
  return <span className="fo-sql-q"><code className="fo-sql-k">{s}</code><button type="button" className="fo-nusxa" onClick={nusxa}>{ok ? '✓' : tr(NUSXA)}</button></span>;
};
// MD belgilari: `kod` — chip (SELECT / UPDATE — nusxalanadigan SQL qatori), **qalin** — <b>. Satr bo'lmasa (JSX) — o'zgarishsiz.
const SQL_RE = /^(SELECT|UPDATE)\b/;
const tx = (o) => {
  const s = tr(o);
  if (typeof s !== 'string' || (!s.includes('`') && !s.includes('**'))) return s;
  const out = [];
  s.split('`').forEach((p, i) => {
    if (i % 2) { out.push(SQL_RE.test(p) ? <SqlChip key={'k' + i} s={p} /> : <code className="qcode" key={'k' + i}>{p}</code>); return; }
    p.split('**').forEach((q, j) => { if (q) out.push(j % 2 ? <b key={'b' + i + '-' + j}>{q}</b> : q); });
  });
  return out;
};

const SHANBA = { uz: 'Shanba', ru: "Суббота" };
const YAKSH = { uz: 'Yakshanba', ru: "Воскресенье" };
const MAHALLA = { uz: 'Mahalla maydoni', ru: "Поле махалли" };
const MAKTAB = { uz: 'Maktab maydoni', ru: "Школьное поле" };
const PARK = { uz: 'Park maydoni', ru: "Поле в парке" };
const JAMOA_F1 = {
  ilova: { nom: 'Maydon Jamoa', tex: 'Expo Go' },
  ekran: { oyinlar: { uz: "O'yinlar", ru: "Игры" }, elon: { uz: "E'lon berish", ru: "Объявить игру" } },
  tugma: {
    qosh: { uz: "Qo'shilaman", ru: "Присоединяюсь" },
    qoshildi: { uz: "Qo'shildingiz", ru: "Вы присоединились" },
    toldi: { uz: "O'yin to'ldi", ru: "Игра заполнена" },
    yubor: { uz: 'Yuborish', ru: "Отправить" }
  },
  forma: [
    { k: 'kun', l: { uz: 'Kun', ru: "День" }, v: YAKSH },
    { k: 'soat', l: { uz: 'Soat', ru: "Время" }, v: '19:00' },
    { k: 'maydon', l: { uz: 'Maydon', ru: "Поле" }, v: MAKTAB },
    { k: 'kerak', l: { uz: 'Nechta odam', ru: "Сколько человек" }, v: '10' }
  ],
  backend: {
    joy: 'maydon-jamoa-….onrender.com · Render',
    yollar: [{ k: 'get', t: 'GET /oyinlar' }, { k: 'elon', t: 'POST /oyinlar' }, { k: 'qosh', t: 'POST /oyinlar/:id/qoshilish' }]
  },
  db: { nom: 'Database · Neon' }
};
// Namuna o'yinlar (tayanch 9.2 — hamma darsda bir xil): son — qo'shilganlar (A2 dan Backend'dan), kerak — nechta odam. id — 1…4 shu tartibda
const OYINLAR = [
  { id: 1, kun: SHANBA, sana: '2026-10-10', soat: '18:00', maydon: MAHALLA, kerak: 10, son: 8 },
  { id: 2, kun: SHANBA, sana: '2026-10-10', soat: '20:00', maydon: MAKTAB, kerak: 10, son: 6 },
  { id: 3, kun: YAKSH, sana: '2026-10-11', soat: '10:00', maydon: PARK, kerak: 8, son: 4 },
  { id: 4, kun: YAKSH, sana: '2026-10-11', soat: '17:00', maydon: MAHALLA, kerak: 10, son: 9 }
];
// Mentor misolidagi yangi e'lon (tayanch 9.8 — e'lon beruvchi Ali; tashkilotchi o'zi qo'shilmaydi — «0 / 10», 9.31)
const YANGI_OYIN = { id: 5, kun: YAKSH, sana: '2026-10-11', soat: '19:00', maydon: MAKTAB, kerak: 10, son: 0 };
// Ilova ro'yxati — eng yangisi tepada (9.29); o — o'zgartirishlar { id: { son, kerak } }
const royxat = (o = {}, yangisi = true) => [...(yangisi ? [YANGI_OYIN] : []), ...[...OYINLAR].reverse()].map(x => ({ ...x, ...(o[x.id] || {}) }));
const TOLDI_K = { uz: "to'ldi", ru: "заполнена" };
const SIZ = { uz: 'Siz', ru: 'Вы' };

// Uchish (SABOQ 19): konvert manbadan nishonga uchadi; joylar DOM dan o'lchanadi (⛶ va telefonda ustma-ust turganda ham to'g'ri)
const UCHISH_MS = 850;
const useUchish = () => {
  const box = useRef(null);
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [uchar, setUchar] = useState([]);
  const uchir = useCallback((dan, ga, o = {}) => {
    const b = box.current; if (kam || !b) return;
    const s = b.querySelector(dan), n = b.querySelector(ga); if (!s || !n) return;
    const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
    const nuqta = (el) => { const r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - br.left) / z, y: (r.top + r.height / 2 - br.top) / z }; };
    const ms = o.ms || UCHISH_MS;
    const p = { k: Math.random().toString(36).slice(2), t: o.t, tur: o.tur, token: o.token, a: nuqta(s), b: nuqta(n), ms };
    setUchar(x => [...x, p]);
    keyin(() => setUchar(x => x.filter(y => y.k !== p.k)), ms + 80);
  }, [kam, keyin]);
  return { box, uchar, uchir, kam, keyin };
};
const Konvert = ({ p }) => (
  <span className={cxx('fo-konvert', p.tur, !p.t && 'nuqta')} aria-hidden="true"
    style={{ left: p.a.x + 'px', top: p.a.y + 'px', '--dx': (p.b.x - p.a.x) + 'px', '--dy': (p.b.y - p.a.y) + 'px', animationDuration: p.ms + 'ms' }}>
    {p.t}{p.token && <small className="fo-k-token">token</small>}
  </span>
);
// Telefondagi tugma bosilgani — bir lahza (≈0.55 s) kichrayib qaytadi; barmoq izi bosish soni bilan qayta chiziladi
const useBosish = (bosildi) => {
  const [on, setOn] = useState(false);
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return undefined; }
    if (!bosildi) return undefined;
    setOn(true); const t = setTimeout(() => setOn(false), 560); return () => clearTimeout(t);
  }, [bosildi]);
  return on;
};
// Bir marta o'zi yuradigan kadrlar (Reja, kutilgan natija maketlari); kam harakatda — oxirgi kadr
const useKadr = (n, ms, kech = 600) => {
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [k, setK] = useState(kam ? n - 1 : 0);
  useEffect(() => { if (kam) return; for (let i = 1; i < n; i++) keyin(() => setK(i), kech + (i - 1) * ms); }, []); // eslint-disable-line
  return k;
};

// ---- Telefon = ilova (SABOQ 22–23): o'lchami barqaror 172×272, ustida «Expo Go» (yoki «1-telefon · o'yinchi») yorlig'i; ichida «Maydon Jamoa» nomi o'z rangida (tayanch 9.62), logotip yo'q ----
const Tel = ({ yorliq, data, tortish, className, past, children }) => (
  <div className={cxx('fo-tel-ust', className)} data-tel={data}>
    {yorliq || <span className="fo-tel-tex">{JAMOA_F1.ilova.tex}</span>}
    <div className="fo-tel">
      <span className="fo-tel-bar"><b className="fo-tel-nom">{JAMOA_F1.ilova.nom}</b></span>
      {tortish && <span className="fo-tortish" aria-hidden="true"><i /></span>}
      {children}
    </div>
    {past}
  </div>
);
// «O'yinlar»: kartalar (kun · soat · maydon · son). rejim 'kerak' — 10-darsdagidek «N kishi kerak» (A1 gacha), 'son' — «8 / 10» (A2 dan)
const OyinlarE = ({ oyinlar, rejim = 'son', yangiId, ajrat }) => (
  <span className="fo-ekran fo-oyinlar">
    <b className="fo-tel-sar">{tr(JAMOA_F1.ekran.oyinlar)}</b>
    <span className="fo-kartalar">
      {oyinlar.map((o, i) => {
        const toldi = rejim === 'son' && o.son >= o.kerak;
        return (
          <span key={o.id} className={cxx('fo-karta', o.id === yangiId && 'yangi', ajrat === o.id && 'ajrat', toldi && 'toldi')} style={{ '--d': (0.05 + i * 0.07) + 's' }}>
            <span className="fo-karta-1"><b>{tr(o.kun)}, {o.soat}</b>{toldi && <em className="fo-toldi-t">{tr(TOLDI_K)}</em>}</span>
            {rejim === 'son'
              ? <span className="fo-karta-2"><span>{tr(o.maydon)}</span><b className="fo-karta-son">{o.son} / {o.kerak}</b></span>
              : <span className="fo-karta-2 kerak">{tr(o.maydon)} · {tr({ uz: `${o.kerak} kishi kerak`, ru: `нужно ${o.kerak} чел.` })}</span>}
          </span>
        );
      })}
    </span>
  </span>
);
// «O'yin»: «‹ O'yinlar» · kun va soat · maydon · son · ismsiz doiralar (kerak ta joy; ortiqchasi qizil, chegaradan tashqarida) · tugma
const OyinE = ({ o, son, tugma = 'qosh', siz = 0, qizil, xatoQator, bosildi = 0, eski, onBos, halqa, disabled }) => {
  const birinchi = useRef(son);
  const pop = son !== birinchi.current;
  const kerak = o.kerak;
  const ortiq = Math.max(0, son - kerak);
  const btnT = tugma === 'qoshildi' ? JAMOA_F1.tugma.qoshildi : tugma === 'toldi' ? JAMOA_F1.tugma.toldi : JAMOA_F1.tugma.qosh;
  const bos = useBosish(bosildi);
  const btnK = cxx('fo-tel-btn', tugma === 'qoshildi' && 'off', tugma === 'toldi' && 'toldi', bos && 'bos', halqa && 'fo-halqa');
  const ichi = <>{tr(btnT)}{bos && <i key={bosildi} className="fo-barmoq" aria-hidden="true" />}</>;
  const sizdan = son - siz;
  return (
    <span className="fo-ekran fo-oyin">
      <span className="fo-orqa">‹ {tr(JAMOA_F1.ekran.oyinlar)}</span>
      <b className="fo-oyin-sar">{tr(o.kun)}, {o.soat}</b>
      <span className="fo-oyin-joy">{tr(o.maydon)}</span>
      <b key={son} className={cxx('fo-son', pop && 'yangi', ortiq > 0 && 'qizil')}>{son} / {kerak}</b>
      {eski && <small className="fo-eski">{tr({ uz: "oxirgi so'rovdagi son", ru: "число из последнего запроса" })}</small>}
      <span className={cxx('fo-doiralar', siz > 0 && 'sizli')} aria-hidden="true">
        <span className="fo-doira-quti">{Array.from({ length: kerak }, (_, i) => {
          const s = i >= sizdan && i < son;
          return <i key={i} className={cxx(i < son && 'bor', s && 'siz', s && pop && 'yangi', s && qizil && 'qizil')}>{s && <em>{tr(SIZ)}</em>}</i>;
        })}</span>
        {Array.from({ length: ortiq }, (_, i) => <i key={'o' + i} className="ortiq" />)}
      </span>
      {xatoQator && <span className="fo-oyin-xato">{tr(xatoQator)}</span>}
      {onBos ? <button type="button" className={btnK} disabled={disabled} onClick={onBos}>{ichi}</button> : <span className={btnK}>{ichi}</span>}
    </span>
  );
};
// «E'lon berish»: Kun · Soat · Maydon · Nechta odam · «Yuborish» (2-ekranda bosiladi)
const ElonE = ({ bosildi = 0, xato, onYubor, halqa, disabled }) => {
  const bos = useBosish(bosildi);
  const btnK = cxx('fo-tel-btn', bos && 'bos', halqa && 'fo-halqa');
  const ichi = <>{tr(JAMOA_F1.tugma.yubor)}{bos && <i key={bosildi} className="fo-barmoq" aria-hidden="true" />}</>;
  return (
    <span className="fo-ekran fo-elon">
      <b className="fo-tel-sar">{tr(JAMOA_F1.ekran.elon)}</b>
      {JAMOA_F1.forma.map(f => <span key={f.k} className="fo-maydon"><small>{tr(f.l)}</small>{tr(f.v)}</span>)}
      {xato && <code className="fo-tel-xato">401 · Unauthorized</code>}
      {onYubor ? <button type="button" className={btnK} disabled={disabled} onClick={onYubor}>{ichi}</button> : <span className={btnK}>{ichi}</span>}
    </span>
  );
};
// Agent chati (0-ekran, Antigravity — chizilgan): o'quvchi pufagi — PRD dagi funksiya gapi, agent javobi «Tayyor!»; javobdan keyin gap ostida bo'sh joy «ikki marta bosilsa — ?»
const PRD_GAP = { uz: "O'yin e'loni va qo'shilishni qur: tashkilotchi e'lon beradi, o'yinchi «Qo'shilaman»ni bosadi, «8 / 10» o'zgaradi.", ru: "Сделай объявление игры и присоединение: организатор объявляет, игрок нажимает «Qo'shilaman» («Присоединяюсь»), «8 / 10» меняется." };
const AgentChat = ({ bosh }) => (
  <div className="fo-chat">
    <span className="fo-chat-h"><i aria-hidden="true" />Antigravity</span>
    <span className="fo-pufak siz">{tr(PRD_GAP)}</span>
    {bosh && <span className="fo-bosh-q">{tr({ uz: 'ikki marta bosilsa — ?', ru: "если нажать дважды — ?" })}</span>}
    <span className="fo-pufak agent">{tr({ uz: 'Tayyor!', ru: "Готово!" })}</span>
  </div>
);
// Backend qutisi: joy yorlig'i (Render) va yo'llar; holat on (so'rov ichida) · xato (401) · children — token, «10 / 10 — to'lgan» belgisi
const BackendQ = ({ yol = {}, holat, nomlar, children }) => (
  <div className={cxx('fo-be', holat)} data-be="1">
    <span className="fo-be-h"><b>Backend</b></span>
    <code className="fo-be-joy">{JAMOA_F1.backend.joy}</code>
    {JAMOA_F1.backend.yollar.filter(y => !nomlar || nomlar.includes(y.k)).map(y => (
      <span key={y.k} className={cxx('fo-yol', yol[y.k])} data-yol={y.k}><code>{y.t}</code></span>
    ))}
    {children}
  </div>
);
const Jadval = ({ nom, ustun, qatorlar, yangiK, yon, children }) => (
  <div className={cxx('fo-jad', yon && 'yon')} data-j={nom}>
    <code className="fo-jad-n">{nom}</code>
    <table className="fo-jt">
      <thead><tr>{ustun.map(u => <th key={u}>{u.split('_').map((q, i) => (i ? <React.Fragment key={i}>_<wbr />{q}</React.Fragment> : q))}</th>)}</tr></thead>
      <tbody>{qatorlar.map(q => <tr key={q.k} className={cxx(q.k === yangiK && 'kir', q.yon && 'yon')}>{q.c.map((v, j) => <td key={j} className={q.td && q.td[j]}>{tr(v)}</td>)}</tr>)}</tbody>
    </table>
    {children}
  </div>
);
// Database · Neon — 2-ekran: oyinchilar (mini) va oyinlar (tashkilotchi_id bilan). yangi: null | 'kir' | 'bor' · yoq — tokensiz so'rovdan keyin «yangi qator yo'q»
const OYIN_USTUN = ['id', 'kun', 'soat', 'maydon', 'kerak', 'tashkilotchi_id'];
const OYINLAR_QATOR = OYINLAR.map(o => ({ k: 'o' + o.id, c: [String(o.id), o.sana, o.soat, o.maydon, String(o.kerak), '1'] })); // Database'da `kun` — sana, ekranda kun nomi (tayanch 9.30)
const YANGI_QATOR = { k: 'o5', c: ['5', '2026-10-11', '19:00', MAKTAB, '10', '2'], td: [null, null, null, null, null, 'egasi'] };
const DbElon = ({ aliYon, yangi, yoq, fokus }) => (
  <div className="fo-db">
    <span className="fo-db-h">{JAMOA_F1.db.nom}</span>
    {!fokus && <Jadval nom="oyinchilar" ustun={['id', 'ism']} qatorlar={[{ k: 'p1', c: ['1', { uz: 'Namuna tashkilotchi', ru: "Организатор-образец" }] }, { k: 'p2', c: ['2', 'Ali'], yon: aliYon }]} />}
    <Jadval nom="oyinlar" ustun={OYIN_USTUN} qatorlar={yangi ? [...OYINLAR_QATOR, YANGI_QATOR] : OYINLAR_QATOR} yangiK={yangi === 'kir' ? 'o5' : null}>
      {yangi && <span className="fo-egasi-y">{tr({ uz: "tokendan — formada yo'q", ru: "из токена — в форме нет" })}</span>}
      {yoq && <span className="fo-yoq-q">{tr({ uz: "yangi qator yo'q", ru: "новой строки нет" })}</span>}
    </Jadval>
  </div>
);
// Database · Neon — 4-ekran: Yakshanba 17:00 ga qo'shilganlar sanog'i (ishtirokchilar dan). holat: ok (yashil) · xato (qizil) · qarash (Backend qaradi)
const DbSanoq = ({ son, kerak = 10, holat }) => (
  <div className={cxx('fo-db', 'sanoq', holat)} data-db="son">
    <span className="fo-db-h">{JAMOA_F1.db.nom}</span>
    <span className="fo-sanoq-l">{tr({ uz: "Yakshanba 17:00 · qo'shilganlar", ru: "Воскресенье 17:00 · присоединились" })}</span>
    <b key={son} className={cxx('fo-sanoq', son > kerak && 'qizil', holat === 'ok' && 'yangi')}>{son} / {kerak}</b>
    <code className="fo-sanoq-j">ishtirokchilar</code>
  </div>
);
// Database · Neon — ixcham (Reja): uch jadval nomi, yozilgani bir lahza yashil
const DbIxcham = ({ yon = {} }) => (
  <div className="fo-db">
    <span className="fo-db-h">{JAMOA_F1.db.nom}</span>
    <span className="fo-db-kartalar">{['oyinchilar', 'oyinlar', 'ishtirokchilar'].map(n => <code key={n} data-j={n} className={cxx('fo-db-k', yon[n] && 'yon')}>{n}</code>)}</span>
  </div>
);
// Funksiya sahnasi: chapda telefon(lar) → o'ngda Backend va Database (SABOQ 21). ixcham — Backend va Database ustma-ust
const FunksiyaSahna = ({ boxRef, uchar = [], tel, be, db, ixcham, pastki }) => (
  <div className={cxx('fo-sahna', ixcham && 'ixcham')} ref={boxRef}>
    <div className="fo-sahna-q">
      <div className="fo-sahna-tel">{tel}</div>
      <i className="fo-yolak" aria-hidden="true" />
      {ixcham
        ? <div className="fo-sahna-ong">{be}<i className="fo-pastga" aria-hidden="true" />{db}</div>
        : <>{be}<i className="fo-yolak b2" aria-hidden="true" />{db}</>}
    </div>
    {pastki}
    {uchar.map(p => <Konvert key={p.k} p={p} />)}
  </div>
);

// Bashorat (SABOQ 11/19, 32): karta bitta halqada, variantlar navbat bilan; tanlangach ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi
const TaxminIxcham = ({ savol, javob }) => (
  <div className="fo-taxmin"><span className="fo-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="fo-taxmin-s">{savol}</span><b>{javob}</b></div>
);
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="fo-navbat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <TaxminIxcham savol={savol} javob={tr((variantlar.find(v => v.k === tanlov) || {}).t)} />);
// Natija bloki (SABOQ 25): bitta yashil blok — birinchi qator taxmin, so'ng joriy qator va xulosa
const NatijaBlok = ({ togri, haqiqat, izoh, xulosa }) => (
  <div className="q-xulosa fo-nb">
    <span className={cxx('fo-nb-t', togri && 'ok')}>{togri ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: "Ваше предположение подтвердилось" })}</> : haqiqat}</span>
    {izoh && <span className="fo-nb-i">{izoh}</span>}
    <span className="fo-nb-x">{xulosa}</span>
  </div>
);
const Haqiqat = ({ taxmin, haqiqat }) => <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {taxmin} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></>;

// ===== SCREEN 0 — KIRISH (QKirish): agent «Tayyor» dedi — «Qo'shilaman» ikki marta bosilsa? Ballsiz (J-026) =====
const HOOK_OPTS = [
  { id: 'a', t: { uz: "«9 / 10» — bitta o'yinchi faqat bitta joy oladi", ru: "«9 / 10» — один игрок занимает только одно место" } },
  { id: 'b', t: { uz: "«10 / 10» — har bosish yana bitta joy qo'shadi", ru: "«10 / 10» — каждое нажатие добавляет ещё одно место" } },
  { id: 'c', t: { uz: "«8 / 10» — ikkinchi bosish birinchisini bekor qiladi", ru: "«8 / 10» — второе нажатие отменяет первое" } }
];
const HOOK_JAVOB = {
  a: { uz: <><b>Qiziq fikr!</b> Shunday bo'lishi kerak edi, lekin PRD gapida bu holat yo'q. Agent har bosishni yangi joy deb sanadi.</>, ru: <><b>Интересная мысль!</b> Так и должно быть, но во фразе из PRD этого случая нет. Агент посчитал каждое нажатие новым местом.</> },
  b: { uz: <><b>Aynan!</b> Bu misolda PRD gapida ikki marta bosish aytilmagan edi. Agent har bosishni yangi joy deb sanadi.</>, ru: <><b>Именно!</b> В этом примере во фразе из PRD о двойном нажатии не было сказано. Агент посчитал каждое нажатие новым местом.</> },
  c: { uz: <><b>Qiziq fikr!</b> Bu misolda ikkinchi bosish ham joy qo'shdi: PRD gapida bu holat aytilmagan edi.</>, ru: <><b>Интересная мысль!</b> В этом примере второе нажатие тоже добавило место: во фразе из PRD об этом случае не было сказано.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [son, setSon] = useState(avval ? 10 : 8);
  const [bos, setBos] = useState(0);
  const [qizil, setQizil] = useState(avval);
  const [bosh, setBosh] = useState(avval);
  const [sc, setSc] = useState(0);
  const ms = (x) => (kam ? 0 : x);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); setSc(n => n + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    keyin(() => setBos(1), ms(350));
    keyin(() => setSon(9), ms(700));
    keyin(() => setBos(2), ms(1250));
    keyin(() => setSon(10), ms(1600));
    keyin(() => setQizil(true), ms(2200));
    keyin(() => { setBosh(true); setSc(n => n + 1); }, ms(2800));
  };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: "День проекта · введение" })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Tugmani ikki marta bossangiz, <span className="italic" style={{ color: T.accent }}>«8 / 10» nima bo'ladi</span>?</>, ru: <>Если нажать кнопку дважды, <span className="italic" style={{ color: T.accent }}>что станет с «8 / 10»</span>?</> })}
        mentor={<Mentor>{picked === null
          ? tr({ uz: "Mentor misolida agentga PRD dagi funksiya gapi o'zi yuborildi — agent «Tayyor» dedi. O'yinchi «Qo'shilaman»ni ikki marta bosmoqchi: avval javobni tanlang.", ru: "В примере Ментора агенту отправили саму фразу о функции из PRD — агент ответил «Готово». Игрок хочет нажать «Присоединяюсь» дважды: сначала выберите ответ." })
          : tr({ uz: "«Davom etish»ni bosing — bugungi rejani ko'rasiz.", ru: "Нажмите «Продолжить» — увидите план на сегодня." })}</Mentor>}
        maket={<div className={cxx('fo-hook', picked === null && 'kutish')}>
          <Tel><OyinE o={OYINLAR[0]} son={son} siz={son - 8} qizil={qizil} bosildi={bos} xatoQator={qizil && { uz: "bitta o'yinchi — ikki joy", ru: "один игрок — два места" }} /></Tel>
          <AgentChat bosh={bosh} />
        </div>}
        savol={tr({ uz: 'Sizningcha, qaysi biri?', ru: "Как вы думаете, какой вариант?" })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Dars oxirida» — Funksiya sahnasi tayyor holatda bir marta o'zi yuradi (DE-200); o'ngda 3 qadam (tegsiz, 172) =====
const REJA = [
  { uz: "E'lon berish: yangi o'yin ro'yxatda chiqadi", ru: "Объявление: новая игра появляется в списке" },
  { uz: "Qo'shilish: «8 / 10» Backend'dan keladi", ru: "Присоединение: «8 / 10» приходит из Backend" },
  { uz: "Yangilash: to'lgan o'yinda «O'yin to'ldi»", ru: "Обновление: у заполненной игры — «Игра заполнена»" }
];
const RejaSahna = () => {
  const { box, uchar, uchir, kam, keyin } = useUchish();
  const [b, setB] = useState(kam ? 9 : 0);
  useEffect(() => {
    if (kam) return;
    const D = UCHISH_MS;
    let t = 700;
    keyin(() => { setB(1); uchir('.fo-tel', '[data-yol="elon"]', { t: 'POST /oyinlar', token: true }); }, t);
    t += D; keyin(() => { setB(2); uchir('[data-yol="elon"]', '[data-j="oyinlar"]'); }, t);
    t += D; keyin(() => setB(3), t);
    t += 1500; keyin(() => setB(4), t);
    t += 900; keyin(() => { setB(5); uchir('.fo-tel', '[data-yol="qosh"]', { t: 'POST /oyinlar/:id/qoshilish', token: true }); }, t);
    t += D; keyin(() => { setB(6); uchir('[data-yol="qosh"]', '[data-j="ishtirokchilar"]'); }, t);
    t += 1500; keyin(() => { setB(7); uchir('.fo-tel', '[data-yol="get"]', { t: 'GET /oyinlar', token: true }); }, t);
    t += D + 300; keyin(() => setB(8), t);
    t += 1500; keyin(() => setB(9), t);
  }, []); // eslint-disable-line
  const r1 = royxat();
  const r2 = royxat({ 1: { son: 9 } });
  const r3 = royxat({ 1: { son: 9 }, 4: { son: 10 } });
  const tel = b <= 2 ? <ElonE bosildi={b >= 1 ? 1 : 0} />
    : b === 3 ? <OyinlarE oyinlar={r1} yangiId={5} ajrat={1} />
      : b <= 5 ? <OyinE o={OYINLAR[0]} son={8} bosildi={b === 5 ? 1 : 0} />
        : b === 6 ? <OyinE o={OYINLAR[0]} son={9} siz={1} tugma="qoshildi" />
          : b === 7 ? <OyinlarE oyinlar={r2} />
            : b === 8 ? <OyinlarE oyinlar={r3} ajrat={4} />
              : <OyinE o={OYINLAR[3]} son={10} tugma="toldi" />;
  const holat = (bosh, oxir) => (b === bosh ? 'on' : b >= oxir ? 'ok' : '');
  return (
    <FunksiyaSahna ixcham boxRef={box} uchar={uchar}
      tel={<Tel tortish={b === 7}>{tel}</Tel>}
      be={<BackendQ yol={{ elon: holat(1, 2), qosh: holat(5, 6), get: holat(7, 8) }} holat={[1, 5, 7].includes(b) ? 'on' : ''} />}
      db={<DbIxcham yon={{ oyinlar: b === 2 || b === 3, ishtirokchilar: b === 6 || b === 7 }} />} />
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: "Начинаем" })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Dars oxirida <span className="italic" style={{ color: T.accent }}>birinchi funksiya</span> telefonda ishlaydi.</>, ru: <>К концу урока <span className="italic" style={{ color: T.accent }}>первая функция</span> работает на телефоне.</> })}
      mentor={<Mentor>{tr({ uz: "Roadmap'dagi birinchi funksiya — talabni siz yozasiz, kodni agent yozadi. Mentor misoli — o'yin e'loni va qo'shilish, siz esa o'z funksiyangizni qurasiz.", ru: "Первая функция из roadmap — требование пишете вы, код пишет агент. Пример Ментора — объявление игры и присоединение, а вы строите свою функцию." })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida', ru: "К концу урока" })}
      chap={<RejaSahna />}
      ongYorliq={tr({ uz: 'Bugungi 3 qadam', ru: '3 шага на сегодня' })}
      qadamlar={REJA.map(t => ({ t: tr(t) }))}>
      <div className="fo-reja-past fade-up">
        <p className="fo-reja-repo">repo <code>maydon-jamoa</code> · {tr({ uz: "boshlang'ich holat", ru: "начальное состояние" })} <code>m11-dars-11-start</code> · {tr({ uz: 'namuna', ru: "образец" })} <code>m11-dars-11-done</code></p>
        <p className="fo-reja-izoh">{tr({ uz: "«Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda, roadmap'ingizdagi birinchi funksiya bilan bajarasiz.", ru: "«Maydon Jamoa» — образец; практику выполняете на своём продукте, с первой функцией из своего roadmap." })}</p>
      </div>
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — TUSHUNCHA (QTushuncha keng): formada «kim» yo'q — e'lon egasi tokendan. Bashorat → «Yuborish» (telefonda) → «Tokensiz yuborish» → natija =====
const S2_TAXMIN = [{ k: 'telefon', t: { uz: 'Telefon raqamidan', ru: "По номеру телефона" } }, { k: 'token', t: { uz: "So'rovdagi tokendan", ru: "По токену в запросе" } }];
const S2_BOSH = { tel: 'elon', bos: 0, yol: {}, be: '', token: false, aliYon: false, yangi: null, x401: false, telXato: false, yoq: false };
const S2_OXIRI = { ...S2_BOSH, tel: 'oyinlar', yol: { elon: 'ok' }, token: true, yangi: 'bor' };
const S2_SOROV = 'POST /oyinlar { kun, soat, maydon, kerak }';
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, uchar, uchir, kam, keyin } = useUchish();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 2 : 0);
  const [yur, setYur] = useState(false);
  const [v, setV] = useState(() => (avval ? S2_OXIRI : S2_BOSH));
  const qoy = (o) => setV(x => ({ ...x, ...o, yol: { ...x.yol, ...(o.yol || {}) } }));
  const done = n >= 2;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (tugadi) setV(S2_OXIRI); }, [tugadi]);
  const ms = (x) => (kam ? 0 : x);
  const D = ms(UCHISH_MS);
  const yubor = () => {
    if (yur || n !== 0 || !taxmin) return;
    setYur(true);
    qoy({ bos: 1, yol: { elon: 'on' }, be: 'on' });
    uchir('.fo-tel', '[data-yol="elon"]', { t: S2_SOROV, token: true });
    keyin(() => qoy({ token: true, aliYon: true }), D);
    keyin(() => { qoy({ aliYon: false, yol: { elon: 'ok' } }); uchir('[data-yol="elon"]', '[data-j="oyinlar"]'); }, D + ms(800));
    keyin(() => qoy({ yangi: 'kir', be: '' }), 2 * D + ms(800));
    keyin(() => uchir('[data-j="oyinlar"]', '.fo-tel', { tur: 'javob' }), 2 * D + ms(1700));
    keyin(() => { qoy({ tel: 'oyinlar' }); setN(1); setYur(false); }, 3 * D + ms(1700));
  };
  const tokensiz = () => {
    if (yur || n !== 1) return;
    setYur(true);
    qoy({ tel: 'elon', bos: 0, token: false, yangi: 'bor', yol: { elon: '' } });
    keyin(() => { qoy({ bos: 2, yol: { elon: 'on' }, be: 'on' }); uchir('.fo-tel', '[data-yol="elon"]', { t: S2_SOROV }); }, ms(450));
    keyin(() => qoy({ yol: { elon: 'xato' }, be: 'xato', x401: true }), ms(450) + D);
    keyin(() => uchir('[data-be="1"]', '.fo-tel', { t: '401', tur: 'qayt' }), ms(450) + D + ms(450));
    keyin(() => qoy({ telXato: true, yoq: true }), ms(450) + 2 * D + ms(450));
    keyin(() => { setN(2); setYur(false); }, ms(450) + 2 * D + ms(1100));
  };
  const tx2 = S2_TAXMIN.find(x => x.k === taxmin);
  const telEkran = v.tel === 'oyinlar'
    ? <OyinlarE oyinlar={royxat()} rejim="kerak" yangiId={5} />
    : <ElonE bosildi={v.bos} xato={v.telXato} onYubor={yubor} halqa={!!taxmin && n === 0 && !yur} disabled={!taxmin || n !== 0 || yur} />;
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · e'lon", ru: "Понятие · объявление" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }) : !done ? tr({ uz: `Ikkala yuborishni bosing (${n}/2)`, ru: `Выполните обе отправки (${n}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Formada «kim» qatori yo'q. <span className="italic" style={{ color: T.accent }}>E'lon kimniki bo'ladi</span>?</>, ru: <>В форме нет строки «кто». <span className="italic" style={{ color: T.accent }}>Чьим будет объявление</span>?</> })}
        mentor={<Mentor>{n === 0
          ? tr({ uz: "Avval taxminingizni belgilang, keyin telefonda «Yuborish»ni bosing.", ru: "Сначала отметьте предположение, потом нажмите «Отправить» на телефоне." })
          : !done ? tr({ uz: "Endi xuddi shu e'lonni tokensiz yuborib ko'ring — Backend nima qilishini kuzating.", ru: "Теперь отправьте то же объявление без токена — следите, что сделает Backend." })
            : tr({ uz: 'Ikkala yuborish tugadi — natijani taxminingiz bilan solishtiring.', ru: "Обе отправки сделаны — сравните результат со своим предположением." })}</Mentor>}
        bashorat={<Bashorat savol={tr({ uz: "Backend e'lon egasini qayerdan biladi?", ru: "Откуда Backend знает владельца объявления?" })} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<FunksiyaSahna boxRef={box} uchar={uchar}
          tel={<Tel yorliq={<span className="fo-tel-yorliq">{tr({ uz: 'kirgan: Ali', ru: "вошёл: Ali" })}</span>}
            past={n === 1 && !done && <QTugma ikkinchi className={yur ? undefined : 'fo-halqa'} disabled={yur} onClick={tokensiz}>{tr({ uz: 'Tokensiz yuborish', ru: "Отправить без токена" })}</QTugma>}>{telEkran}</Tel>}
          be={<BackendQ yol={v.yol} holat={v.be}>
            {v.token && <span className="fo-be-token"><i className="fo-qulf" aria-hidden="true" /><code>token</code> → <code>oyinchilar · 2</code></span>}
            {v.x401 && !tugadi && <b className="fo-be-401">401</b>}
          </BackendQ>}
          db={<DbElon aliYon={v.aliYon} yangi={v.yangi} yoq={v.yoq && !tugadi} fokus={tugadi} />} />}
        natija={done && tx2 && <NatijaBlok togri={taxmin === 'token'}
          haqiqat={<Haqiqat taxmin={tr(tx2.t)} haqiqat={tr({ uz: "so'rovdagi tokendan", ru: "по токену в запросе" })} />}
          izoh={tr({ uz: "Backend tokendan kirgan o'yinchini taniydi va e'lon egasini shundan yozadi.", ru: "Backend по токену узнаёт вошедшего игрока и записывает по нему владельца объявления." })}
          xulosa={tr({ uz: "E'lon Database'ga yoziladi, egasini Backend tokendan oladi. Formada «kim» so'ralmaydi.", ru: "Объявление записывается в Database, владельца Backend берёт из токена. В форме «кто» не спрашивают." })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — TEST 1 (QuestionScreen → QTest; INLINE_KEYS.s3 = 2, C). Savol ustida yorliq yo'q (SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Agent e'lon formasiga «Tashkilotchi» maydonini qo'shdi. Agentga nima yozasiz?"
    question={tr({ uz: <h2 className="title h-ask">Agent e'lon formasiga «Tashkilotchi» maydonini qo'shdi. <span className="italic" style={{ color: T.accent }}>Agentga nima yozasiz</span>?</h2>, ru: <h2 className="title h-ask">Агент добавил в форму объявления поле «Организатор». <span className="italic" style={{ color: T.accent }}>Что вы напишете агенту</span>?</h2> })}
    options={[
      { uz: "Maydonni qoldir, ismni o'yinchi o'zi yozsin", ru: "Оставь поле, пусть игрок сам пишет имя" },
      { uz: "Maydonni majburiy qil, bo'sh yuborilmasin", ru: "Сделай поле обязательным, чтобы не отправлялось пустым" },
      { uz: "Maydonni olib tashla, egasini tokendan ol", ru: "Убери поле, владельца бери из токена" },
      { uz: "Tokenni olib tashla, egasini formadan ol", ru: "Убери токен, владельца бери из формы" }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Backend egasini tokendan oladi — formada «kim» so'ralmaydi.", ru: "Backend берёт владельца из токена — в форме «кто» не спрашивают." }}
    explainWrong={{
      0: { uz: 'Ismni har kim istaganicha yozadi. Egasi qayerdan keladi?', ru: "Имя каждый пишет какое хочет. Откуда берётся владелец?" },
      1: { uz: "Bo'sh forma — boshqa holat. Bu maydonning o'zi kerakmi?", ru: "Пустая форма — другой случай. Нужно ли само это поле?" },
      3: { uz: 'Tokensiz Backend kim yuborganini bilmaydi.', ru: "Без токена Backend не знает, кто отправил." }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA (QTushuncha keng): ekrandagi son eskirgan bo'lsa. Bashorat → 2-telefonda «Qo'shilaman» → talab qatorlari bittadan (SABOQ 9, 13) =====
const S4_TAXMIN = [{ k: 'olmaydi', t: { uz: "Qo'shila olmaydi", ru: "Не сможет присоединиться" } }, { k: 'oladi', t: { uz: "Qo'shila oladi", ru: "Сможет присоединиться" } }];
const S4_QATOR = [
  { t: { uz: "Nima qilsin: o'yin to'lsa, ilova «Qo'shilaman»ni yashirsin.", ru: "Что сделать: если игра заполнена, приложение прячет «Qo'shilaman» («Присоединяюсь»)." }, y: { uz: 'Ekrandagi son eskirgan edi — ilova bilmadi.', ru: "Число на экране устарело — приложение не знало." } },
  { t: { uz: "Nima qilsin: o'yin to'lsa, Backend qo'shmasin, ilova «O'yin to'ldi» desin.", ru: "Что сделать: если игра заполнена, Backend не добавляет, приложение пишет «O'yin to'ldi» («Игра заполнена»)." }, y: { uz: "Backend Database'ga qaradi.", ru: "Backend посмотрел в Database." } }
];
const S4_SOROV = 'POST /oyinlar/:id/qoshilish';
const Y17 = OYINLAR[3];
const S4_T1 = { son: 9, tugma: 'qosh', bos: 0, eski: false, qizil: false };
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, uchar, uchir, kam, keyin } = useUchish();
  const isNarrow = useIsMobile(768);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [i, setI] = useState(avval ? 3 : 0);
  const [yur, setYur] = useState(false);
  const [t1, setT1] = useState(avval ? { ...S4_T1, son: 10, tugma: 'toldi' } : S4_T1);
  const [t2, setT2] = useState(avval ? { son: 10, tugma: 'qoshildi', bos: 0 } : { son: 9, tugma: 'qosh', bos: 0 });
  const [db, setDb] = useState({ son: avval ? 10 : 9, holat: '' });
  const [be, setBe] = useState({ yol: {}, holat: '', belgi: false });
  const [natija, setNatija] = useState(null);
  const [oldin, setOldin] = useState(avval ? [0, 1] : []);
  const done = i >= 3;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const D = ms(UCHISH_MS);
  const T1 = '[data-tel="1"] .fo-tel', T2 = '[data-tel="2"] .fo-tel', YOL = '[data-yol="qosh"]', SON = '[data-db="son"]';
  const korsat = () => { const el = isNarrow && box.current; if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'start' }); };
  const qosh2 = () => {
    if (yur || i !== 0 || !taxmin) return;
    setYur(true);
    setT2(x => ({ ...x, bos: 1 }));
    uchir(T2, YOL, { t: S4_SOROV, token: true });
    keyin(() => { setBe({ yol: { qosh: 'on' }, holat: 'on', belgi: false }); uchir(YOL, SON); }, D);
    keyin(() => setDb({ son: 10, holat: 'ok' }), 2 * D);
    keyin(() => { setBe({ yol: { qosh: 'ok' }, holat: '', belgi: false }); uchir(YOL, T2, { tur: 'javob' }); }, 2 * D + ms(500));
    keyin(() => { setT2({ son: 10, tugma: 'qoshildi', bos: 1 }); setT1(x => ({ ...x, eski: true })); setDb({ son: 10, holat: '' }); setI(1); setYur(false); }, 3 * D + ms(500));
  };
  const tekshir = () => {
    if (yur || i < 1 || i > 2) return;
    const r = i;
    setYur(true);
    korsat();
    setT1(x => ({ ...x, bos: x.bos + 1 }));
    keyin(() => uchir(T1, YOL, { t: S4_SOROV, token: true }), ms(250));
    if (r === 1) {
      keyin(() => { setBe({ yol: { qosh: 'on' }, holat: 'on', belgi: false }); uchir(YOL, SON); }, ms(250) + D);
      keyin(() => setDb({ son: 11, holat: 'xato' }), ms(250) + 2 * D);
      keyin(() => uchir(YOL, T1, { tur: 'javob' }), ms(250) + 2 * D + ms(300));
      keyin(() => { setT1({ son: 11, tugma: 'qoshildi', bos: 0, eski: false, qizil: true }); setBe({ yol: { qosh: 'xato' }, holat: '', belgi: false }); setNatija('xato'); }, ms(250) + 3 * D + ms(300));
      keyin(() => { setT1({ ...S4_T1, eski: true }); setDb({ son: 10, holat: '' }); setBe({ yol: {}, holat: '', belgi: false }); setNatija(null); setOldin([0]); setI(2); setYur(false); }, ms(250) + 3 * D + ms(3000));
    } else {
      keyin(() => { setBe({ yol: { qosh: 'on' }, holat: 'on', belgi: true }); setDb({ son: 10, holat: 'qarash' }); }, ms(250) + D);
      keyin(() => uchir(YOL, T1, { t: "409 · O'yin to'ldi", tur: 'qayt' }), ms(250) + D + ms(900));
      keyin(() => { setT1({ ...S4_T1, son: 10, tugma: 'toldi' }); setBe({ yol: { qosh: 'ok' }, holat: '', belgi: true }); setDb({ son: 10, holat: '' }); setNatija('ok'); }, ms(250) + 2 * D + ms(900));
      keyin(() => { setNatija(null); setOldin([0, 1]); setI(3); setYur(false); }, ms(250) + 2 * D + ms(2600));
    }
  };
  const tx4 = S4_TAXMIN.find(x => x.k === taxmin);
  const q = S4_QATOR[Math.min(Math.max(i - 1, 0), 1)];
  const telYorliq = (k) => <span className={cxx('fo-tel-yorliq', 'b' + k)}>{tr({ uz: `${k}-telefon · o'yinchi`, ru: `Телефон ${k} · игрок` })}</span>;
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · to'lgan o'yin", ru: "Понятие · заполненная игра" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }) : i === 0 ? tr({ uz: "2-telefonda qo'shiling", ru: "Присоединитесь на телефоне 2" }) : !done ? tr({ uz: `Qatorlarni tekshiring (${i - 1}/2)`, ru: `Проверьте строки (${i - 1}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ekranda «9 / 10», <span className="italic" style={{ color: T.accent }}>o'yin esa to'lgan</span> bo'lsa-chi?</>, ru: <>На экране «9 / 10», <span className="italic" style={{ color: T.accent }}>а игра уже заполнена</span>?</> })}
        mentor={<Mentor>{i === 0
          ? tr({ uz: "Ikki o'yinchi bitta o'yinni ochib turibdi — avval taxminingizni belgilang, keyin 2-telefonda «Qo'shilaman»ni bosing.", ru: "Двое игроков открыли одну игру — сначала отметьте предположение, потом нажмите «Присоединяюсь» на телефоне 2." })
          : !done ? tr({ uz: "Endi talab qatorlarini bittadan tekshiring — «Tekshirish»ni bosing va 1-telefonni kuzating.", ru: "Теперь проверьте строки требования по одной — нажмите «Проверить» и следите за телефоном 1." })
            : tr({ uz: 'Ikkala qator tekshirildi — natijani taxminingiz bilan solishtiring.', ru: "Обе строки проверены — сравните результат со своим предположением." })}</Mentor>}
        bashorat={<Bashorat savol={tr({ uz: "Ilova to'lgan o'yinda tugmani yashirsa, 1-telefon qo'shila oladimi?", ru: "Если приложение прячет кнопку у заполненной игры, сможет ли телефон 1 присоединиться?" })} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<FunksiyaSahna ixcham boxRef={box} uchar={uchar}
          tel={<div className="fo-ikki">
            <Tel data="1" yorliq={telYorliq(1)}><OyinE o={Y17} son={t1.son} tugma={t1.tugma} bosildi={t1.bos} eski={t1.eski && !tugadi} qizil={t1.qizil} /></Tel>
            <Tel data="2" yorliq={telYorliq(2)}><OyinE o={Y17} son={t2.son} tugma={t2.tugma} bosildi={t2.bos} onBos={qosh2} halqa={!!taxmin && i === 0 && !yur} disabled={!taxmin || i !== 0 || yur} /></Tel>
          </div>}
          be={<BackendQ yol={be.yol} holat={be.holat} nomlar={['qosh']}>
            {be.belgi && <span className="fo-be-qarash"><i aria-hidden="true" />{tr({ uz: "10 / 10 — to'lgan", ru: "10 / 10 — заполнена" })}</span>}
          </BackendQ>}
          db={<DbSanoq son={db.son} holat={db.holat} />} />}
        harakat={taxmin && i >= 1 && !done && (
          <div className="fo-qatorlar">
            {oldin.map(k => <span key={k} className={cxx('fo-qator-ix', k === 0 ? 'xato' : 'ok')}><b>{k === 0 ? '✗' : '✓'}</b>{tr(S4_QATOR[k].t)}</span>)}
            <QKarta className={cxx('fo-qk', natija)} key={i} yorliq={tr({ uz: `Qator ${i} / 2`, ru: `Строка ${i} / 2` })}>
              <span className="fo-qk-t">{tr(q.t)}</span>
              {natija
                ? <span className="fo-qk-n"><b>{natija === 'ok' ? '✓' : '✗'}</b><span>{tr(q.y)}</span></span>
                : <QTugma className={cxx(!yur && 'fo-halqa')} disabled={yur} onClick={tekshir}>{tr({ uz: 'Tekshirish', ru: 'Проверить' })}</QTugma>}
            </QKarta>
          </div>
        )}
        natija={done && tx4 && <NatijaBlok togri={taxmin === 'oladi'}
          haqiqat={<Haqiqat taxmin={tr(tx4.t)} haqiqat={tr({ uz: "qo'shila oladi — ekranida hali «9 / 10» edi", ru: "сможет — на его экране ещё было «9 / 10»" })} />}
          izoh={tr({ uz: "Telefon sonni oxirgi so'raganda olgan — boshqa o'yinchi undan keyin qo'shilgan bo'lishi mumkin.", ru: "Телефон получил число при последнем запросе — другой игрок мог присоединиться позже." })}
          xulosa={tr({ uz: "Telefondagi son eskirgan bo'lishi mumkin. To'lgan o'yinni Backend tekshiradi, ilova «O'yin to'ldi» deydi.", ru: "Число на телефоне может устареть. Заполненную игру проверяет Backend, приложение пишет «Игра заполнена»." })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — TEST 2 (QuestionScreen → QTest; INLINE_KEYS.s5 = 3, D) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: "Упражнение · вопрос 2" })}
    questionText="Ekranda «7 / 8». Oxirgi joyni boshqa o'yinchi oldi. Bossangiz nima bo'lishi kerak?"
    question={tr({ uz: <h2 className="title h-ask">Ekranda «7 / 8». Oxirgi joyni boshqa o'yinchi oldi. <span className="italic" style={{ color: T.accent }}>Bossangiz nima bo'lishi kerak</span>?</h2>, ru: <h2 className="title h-ask">На экране «7 / 8». Последнее место занял другой игрок. <span className="italic" style={{ color: T.accent }}>Что должно быть, если нажать</span>?</h2> })}
    options={[
      { uz: "Backend qo'shadi, ilova «8 / 8» ni ko'rsatadi", ru: "Backend добавит, приложение покажет «8 / 8»" },
      { uz: "Backend qo'shadi, ilova «9 / 8» ni ko'rsatadi", ru: "Backend добавит, приложение покажет «9 / 8»" },
      { uz: "Ilova qo'shmaydi, tugmani o'zi yashirib qo'yadi", ru: "Приложение не добавит, само спрячет кнопку" },
      { uz: "Backend qo'shmaydi, ilova «O'yin to'ldi» deydi", ru: "Backend не добавит, приложение напишет «Игра заполнена»" }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Backend Database'ga qaraydi — ekrandagi son eskirgan edi.", ru: "Backend смотрит в Database — число на экране устарело." }}
    explainWrong={{
      0: { uz: "Database'da o'yin to'lgan edi. Backend yana qo'shsinmi?", ru: "В Database игра уже была заполнена. Должен ли Backend добавить ещё?" },
      1: { uz: 'Bu — talabda aytilmagan holat. Kim tekshirishi kerak edi?', ru: "Это случай, не указанный в требовании. Кто должен был проверить?" },
      2: { uz: "Ekranda «7 / 8» turibdi — ilova joy bor deb biladi.", ru: "На экране «7 / 8» — приложение думает, что место есть." }
    }} />
);

// ===== 🏅 BADGES (nishonlar, 3) — ikki savol (birinchi urinish) + bonus: 3-amaliyot oxirgi «Bajardim» (birinchi urinish sharti yo'q) =====
const ACHIEVEMENTS = {
  rightOwner: { icon: '🪪', name: 'Right Owner', desc: { uz: "E'lon egasi tokendan olinishini topdingiz", ru: "Вы нашли, что владелец объявления берётся из токена" } },
  fullGame: { icon: '⚽', name: 'Full Game', desc: { uz: "To'lgan o'yinni Backend tekshirishini topdingiz", ru: "Вы нашли, что заполненную игру проверяет Backend" } },
  firstFeature: { icon: '🚀', name: 'First Feature', desc: { uz: 'Uch amaliyot blokini oxirigacha bajardingiz', ru: "Вы выполнили все три блока практики до конца" } }
};
// Ekran id → nishon. Savollar — birinchi urinishda to'g'ri; a3 — oxirgi «Bajardim» (bonus).
const ACH_TRIGGERS = { s3: 'rightOwner', s5: 'fullGame', a3: 'firstFeature' };

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


// Podium savol yorliqlari (SCORED_IDX: 4, 7)
const Q_LABELS = {
  4: { uz: "1 — E'lon egasi", ru: "1 — Владелец объявления" },
  7: { uz: "2 — To'lgan o'yin", ru: "2 — Заполненная игра" }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi fon so'zlari — darsning o'z atamalari (MD, R-008: o'quvchi so'zi {uz, ru}; kod-belgi va nom o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: { uz: 'talab', ru: "требование" }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: "e'lon", ru: "объявление" }, l: 80, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: "Qo'shilaman", ru: "Присоединяюсь" }, l: 8, t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: { uz: "O'yin to'ldi", ru: "Игра заполнена" }, l: 70, t: 66, s: 22, d: 21, dl: 2.2 },
  { ch: '8 / 10', l: 44, t: 86, s: 26, d: 25, dl: 1.1 },
  { ch: 'token', l: 58, t: 24, s: 24, d: 17, dl: 0.4 },
  { ch: 'Backend', l: 22, t: 40, s: 24, d: 20, dl: 1.9 },
  { ch: 'Database', l: 20, t: 18, s: 22, d: 18, dl: 2.9 },
  { ch: 'POST /oyinlar', l: 86, t: 40, s: 18, d: 22, dl: 0.6 },
  { ch: '409', l: 36, t: 58, s: 26, d: 24, dl: 1.3 },
  { ch: 'Render', l: 62, t: 82, s: 22, d: 26, dl: 2.5 },
  { ch: 'Maydon Jamoa', l: 4, t: 46, s: 20, d: 21, dl: 3.1 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD), to'g'ri javob o'rni A·B·C·D ×3 (3/3/3/3).
const QUIZ_BANK = [
  { q: { uz: "Roadmap'dagi funksiyani agentga qanday berasiz?", ru: "Как вы передаёте агенту функцию из roadmap?" }, opts: [{ uz: "Uch qatorli talab qilib, o'zingiz yozib", ru: "Трёхстрочным требованием, написав его сами" }, { uz: "Roadmap qatorini o'zgartirmay, o'zini", ru: "Саму строку roadmap, не меняя" }, { uz: 'PRD ning hamma bo\'limini birdaniga yuborib', ru: "Отправив сразу все разделы PRD" }, { uz: 'Faqat funksiya nomini, qisqa qilib yozib', ru: "Только название функции, коротко" }], correct: 0 },
  { q: { uz: 'Talabda ikki marta bosish aytilmagan. Agent nima qilishi mumkin?', ru: "В требовании не сказано о двойном нажатии. Что может сделать агент?" }, opts: [{ uz: 'Tugmani ekrandan butunlay olib tashlaydi', ru: "Полностью уберёт кнопку с экрана" }, { uz: "Bu holatni o'zicha taxmin qilib quradi", ru: "Сделает этот случай по своей догадке" }, { uz: 'Funksiyani umuman qurmasdan qoldiradi', ru: "Вообще не станет делать функцию" }, { uz: "Ilovani boshidan to'liq qayta yozadi", ru: "Полностью перепишет приложение с нуля" }], correct: 1 },
  { q: { uz: "Formada «kim» yo'q. E'lon egasi qayerdan olinadi?", ru: "В форме нет «кто». Откуда берётся владелец объявления?" }, opts: [{ uz: "Telefon raqamidan, so'rovdagi", ru: "Из номера телефона в запросе" }, { uz: 'Ilova ustidagi ism yozuvidan', ru: "Из надписи с именем над приложением" }, { uz: "So'rov bilan kelgan tokendan", ru: "Из токена, пришедшего с запросом" }, { uz: "Database'dagi oxirgi qatordan", ru: "Из последней строки в Database" }], correct: 2 },
  { q: { uz: "Ilova qayta yuklandi. Yangi e'lon nega yo'qolmadi?", ru: "Приложение перезагрузилось. Почему новое объявление не пропало?" }, opts: [{ uz: 'Telefon xotirasiga yozilgani uchun', ru: "Потому что записано в память телефона" }, { uz: "Agent uni namunaga qo'shgani uchun", ru: "Потому что агент добавил его в образцы" }, { uz: "Expo Go uni o'zida saqlagani uchun", ru: "Потому что Expo Go хранит его у себя" }, { uz: "U Database'ga yozilgani uchun", ru: "Потому что оно записано в Database" }], correct: 3 },
  { q: { uz: '«8 / 10» dagi 8 qayerdan keladi?', ru: "Откуда берётся 8 в «8 / 10»?" }, opts: [{ uz: "Database'dagi qo'shilganlar sonidan", ru: "Из числа присоединившихся в Database" }, { uz: "Telefonda bosilgan tugmalar sanog'idan", ru: "Из счёта нажатий на телефоне" }, { uz: 'Prototipdagi namuna fayl raqamidan', ru: "Из числа в файле-образце прототипа" }, { uz: 'Tashkilotchi formaga yozgan sondan', ru: "Из числа, которое организатор вписал в форму" }], correct: 0 },
  { q: { uz: "Bir o'yinchi «Qo'shilaman»ni ikki marta bosdi. Nima bo'lishi kerak?", ru: "Игрок дважды нажал «Присоединяюсь». Что должно быть?" }, opts: [{ uz: 'Son ikkiga oshadi, ikkala joy ham olinadi', ru: "Число вырастет на два, заняты оба места" }, { uz: 'Son bittaga oshadi, ikkinchisi yozilmaydi', ru: "Число вырастет на один, второе не запишется" }, { uz: "Son o'zgarmaydi, ikkala bosish ham bekor", ru: "Число не изменится, оба нажатия отменены" }, { uz: "O'yin o'chadi, qayta e'lon kerak bo'ladi", ru: "Игра удалится, нужно объявлять заново" }], correct: 1 },
  { q: { uz: "Ekranda «9 / 10», o'yin esa to'lgan. Nega shunday?", ru: "На экране «9 / 10», а игра уже заполнена. Почему так?" }, opts: [{ uz: "Backend sonni noto'g'ri sanab qo'ygan", ru: "Backend неправильно посчитал число" }, { uz: "Database'ga qo'shilganlar yozilmagan", ru: "В Database не записаны присоединившиеся" }, { uz: "Ekranda oxirgi so'ralgan son turibdi", ru: "На экране число из последнего запроса" }, { uz: "Agent ekranni noto'g'ri qurib qo'ygan", ru: "Агент неправильно сделал экран" }], correct: 2 },
  { q: { uz: "To'lgan o'yinga qo'shmaslikni qayerda tekshirish kerak?", ru: "Где нужно проверять, чтобы не добавлять в заполненную игру?" }, opts: [{ uz: 'Ilovada, tugmani ekrandan yashirib', ru: "В приложении, спрятав кнопку" }, { uz: "Talabda, agent o'zi bilsin deb", ru: "В требовании — пусть агент сам знает" }, { uz: "Neon'da, har kuni qo'lda sanab", ru: "В Neon, каждый день считая вручную" }, { uz: "Backend'da, Database'ga qarab", ru: "В Backend, глядя в Database" }], correct: 3 },
  { q: { uz: "Backend to'lgan o'yinga qo'shmadi. Ilova nima ko'rsatadi?", ru: "Backend не добавил в заполненную игру. Что покажет приложение?" }, opts: [{ uz: "«O'yin to'ldi» degan xabarni", ru: "Сообщение «Игра заполнена»" }, { uz: '«11 / 10» degan yangi sonni', ru: "Новое число «11 / 10»" }, { uz: 'Yozuvsiz, bo\'sh qolgan ekranni', ru: "Пустой экран без надписей" }, { uz: '«Kirish» ekranini qayta ochib', ru: "Снова откроет экран «Вход»" }], correct: 0 },
  { q: { uz: "Boshqa telefondagi «8 / 10» qachon yangilanadi?", ru: "Когда обновится «8 / 10» на другом телефоне?" }, opts: [{ uz: "Har soniyada o'zi, hech narsa so'ramasdan", ru: "Каждую секунду само, ничего не запрашивая" }, { uz: 'Ekran ochilganda yoki pastga tortilganda', ru: "Когда экран открыли или потянули вниз" }, { uz: "Faqat ilova qayta o'rnatilgandan keyin", ru: "Только после переустановки приложения" }, { uz: "Tashkilotchi o'yinga ruxsat berganda", ru: "Когда организатор разрешит игру" }], correct: 1 },
  { q: { uz: "Backend o'zgardi. Telefonda u qachon ishlaydi?", ru: "Backend изменился. Когда это заработает на телефоне?" }, opts: [{ uz: 'Agent «Tayyor» deb javob berishi bilan', ru: "Как только агент ответит «Готово»" }, { uz: "`git commit` qilinishi bilan, push'siz", ru: "Сразу после `git commit`, без push" }, { uz: "Push'dan keyin Render yangilangach", ru: "После push, когда Render обновится" }, { uz: "Telefon o'chib, qayta yoqilgandan keyin", ru: "После выключения и включения телефона" }], correct: 2 },
  { q: { uz: 'Agent «Tayyor» dedi. Keyin nima qilasiz?', ru: "Агент сказал «Готово». Что вы делаете дальше?" }, opts: [{ uz: "Shu zahoti keyingi blokka o'tasiz", ru: "Сразу переходите к следующему блоку" }, { uz: "Agentdan yana bir bor so'rab ko'rasiz", ru: "Ещё раз спрашиваете агента" }, { uz: "README'ga «tayyor» deb yozib qo'yasiz", ru: "Пишете в README «готово»" }, { uz: 'Talabning har gapini tekshirasiz', ru: "Проверяете каждую фразу требования" }], correct: 3 }
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
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). steps [{ h, t, bandlar?, prompt?, yordam?, err? }] · natija (kutilgan natija · namuna: Maydon Jamoa) · ortda (faqat 1-blok).
// Talab zinapoyasi (tayanch 4: 11-dars): uch qatorni o'quvchi o'zi yozadi — har joy ostida kulrang savol (uch blokda bir xil), oxirgi qator tayyor; «Nusxalash» uchala joy to'ldirilgach ochiladi.
// Qolipdagi QPrompt da yoziladigan joy va kulrang savol yo'q (qolip taklifi) — shu faylda TalabPrompt (q-prompt klasslari bilan).
// Trek — pm-m9d8-platforma (mobil | web); kalit yo'q — ikkala qator (M-q5). 1-funksiya nomi — pm-m9d6-roadmap (hozir[0] → ishlar[…].nom); yo'q bo'lsa — o'quvchi o'zi yozadi.
const trekOqi = () => { try { const o = JSON.parse(localStorage.getItem('pm-m9d8-platforma') || 'null'); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; } catch { return null; } };
const birinchiFunksiya = () => {
  try {
    const r = JSON.parse(localStorage.getItem('pm-m9d6-roadmap') || 'null');
    const i = r && Array.isArray(r.hozir) ? r.hozir[0] : null;
    const ish = r && Array.isArray(r.ishlar) && Number.isInteger(i) ? r.ishlar[i] : null;
    return (ish && String(ish.nom || '').trim()) || '';
  } catch { return ''; }
};
// Qoralama: o'quvchi yozgan talab qatorlari (faqat shu dars; boshqa dars o'qimaydi — kod oynasi qoralamasi pm-m9dN-code naqshi)
const QORALAMA_KEY = 'pm-m9d11-talab';
const qoralamaOl = () => { try { return JSON.parse(localStorage.getItem(QORALAMA_KEY) || '{}') || {}; } catch { return {}; } };
const qoralamaYoz = (k, v) => { try { const o = qoralamaOl(); o[k] = v; localStorage.setItem(QORALAMA_KEY, JSON.stringify(o)); } catch { /* xotira yopiq — qoralama faqat shu ekranda */ } };
const TALAB_JOY = [
  { k: 'qayerda', l: { uz: 'Qayerda:', ru: "Где:" }, joy: { uz: '{qayerda}', ru: "{где}" }, s: { uz: "Qaysi ekran, qaysi tugma va Backend'da qaysi yo'l?", ru: "Какой экран, какая кнопка и какой путь в Backend?" } },
  { k: 'nima', l: { uz: 'Nima qilsin:', ru: "Что сделать:" }, joy: { uz: '{nima qilsin}', ru: "{что сделать}" }, s: { uz: "Bosilganda nima bo'lsin — Backend'da va ekranda? Qachon bo'lmasin?", ru: "Что должно быть при нажатии — в Backend и на экране? Когда не должно?" } },
  { k: 'buzilmasin', l: { uz: 'Nima buzilmasin:', ru: "Что не сломать:" }, joy: { uz: '{nima buzilmasin}', ru: "{что не сломать}" }, s: { uz: 'Oldin ishlagan qaysi narsa joyida qolsin?', ru: "Что из работавшего раньше должно остаться на месте?" } }
];
const TAYYOR_QATOR = { uz: "Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: "Больше ничего не трогай, назови изменённые файлы." };
const TalabPrompt = ({ blok }) => {
  const [q, setQ] = useState(() => { const o = qoralamaOl()[blok]; return Array.isArray(o) ? o : ['', '', '']; });
  const [ok, setOk] = useState(false);
  const toliq = q.every(x => x.trim());
  const yoz = (i, v) => setQ(x => { const y = x.map((z, j) => (j === i ? v : z)); qoralamaYoz(blok, y); return y; });
  const birinchiBosh = q.findIndex(x => !x.trim());
  const nusxa = async () => {
    if (!toliq) return;
    const matn = [...TALAB_JOY.map((j, i) => `${tr(j.l)} ${q[i].trim()}`), tr(TAYYOR_QATOR)].join('\n');
    try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="q-prompt fo-talab">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa" disabled={!toliq} onClick={nusxa}>{ok ? tr(NUSXALANDI) : tr(NUSXA)}</button></span>
      {TALAB_JOY.map((j, i) => (
        <label key={j.k} className="fo-joy">
          <span className="fo-joy-q"><b className="fo-joy-l">{tr(j.l)}</b>
            <textarea className={cxx('fo-joy-i', i === birinchiBosh && 'fo-halqa-i')} rows={1} value={q[i]} placeholder={tr(j.joy)} onChange={(e) => yoz(i, e.target.value)}
              onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }} /></span>
          <span className="fo-joy-s">{tr(j.s)}</span>
        </label>
      ))}
      <span className="fo-ps">{tr(TAYYOR_QATOR)}</span>
    </span>
  );
};
// A1 «Ochish»: roadmap'dagi birinchi funksiya — kalitdan; yo'q bo'lsa tahrirlanadigan qator (M-q5)
const F1Qator = () => {
  const [nom] = useState(birinchiFunksiya);
  const [o, setO] = useState(() => qoralamaOl().f1 || '');
  return (
    <span className="fo-band">
      {tr({ uz: "Roadmap'ingizdagi birinchi funksiya:", ru: "Первая функция из вашего roadmap:" })} {nom
        ? <>«<b className="fo-f1">{nom}</b>»</>
        : <input className={cxx('fo-f1-i', !o.trim() && 'fo-halqa-i')} value={o} placeholder="{1-funksiya}" onChange={(e) => { setO(e.target.value); qoralamaYoz('f1', e.target.value); }} />} {tr({ uz: "(6-darsdagi roadmap'dan; bo'lmasa — shu qatorga o'zingiz yozing).", ru: "(из roadmap 6-го урока; если нет — впишите в эту строку сами)." })}
    </span>
  );
};
const Yordam = ({ guruhlar }) => {
  const [ochiq, setOchiq] = useState(false);
  useEffect(() => { // ochilgan namuna va «Bajardim» bir ko'rinishda qolsin
    if (!ochiq) return;
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 80);
    return () => clearTimeout(t);
  }, [ochiq]);
  return (
    <>
      <QTugma ikkinchi className="fo-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
      {ochiq && <span className="fo-yordam fade-step">{guruhlar.map((g, gi) => (
        <React.Fragment key={gi}>
          {g.yorliq && <span className="fo-yordam-l">{tr(g.yorliq)}</span>}
          {(g.satrlar || []).map((l, i) => <span key={i} className="fo-yordam-s">{tx(l)}</span>)}
          {g.gap && <span className="fo-yordam-g">{tx(g.gap)}</span>}
        </React.Fragment>
      ))}</span>}
    </>
  );
};
// «Ortda qoldingizmi» — darsda bir marta, birinchi blokda (F-1006-271; tayanch 3)
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'git checkout -f m11-dars-11-done'];
const Ortda = ({ oxiri }) => (
  <p className="fo-ortda">{tr({ uz: 'Ortda qoldingizmi — Mentor misolini oching:', ru: "Отстали — откройте пример Ментора:" })} <code className="fo-buyruq">{ORTDA[0]}</code> · <code className="fo-buyruq">{ORTDA[1]}</code>{oxiri && <> {tx(oxiri)}</>}</p>
);
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: "Блок завершён — нажмите «Продолжить»." }; // S3 (F-1006-287): 14-dars naqshi
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
  // Yangi ochilgan qadam (uzun prompt) «Bajardim»i bilan birga ko'rinsin — kompyuterda ham
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 8 / S3 (F-1006-287, 14-dars naqshi): Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${tr(steps[stepN].h)}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${tr(steps[stepN].h)}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: <>{tx(c.t)}{c.ichi}{c.bandlar && c.bandlar.map((b, i) => <span key={i} className="fo-band">{tx(b)}</span>)}{c.prompt}</>,
          xato: c.yordam ? <Yordam guruhlar={c.yordam} /> : (c.err && tx(c.err))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tx(doneText)} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
        pastki={<MentorPracticeStats live={_live} screen={screen} />}>
        {ortda && <Ortda oxiri={ortda} />}
      </QBlok>
    </Stage>
  );
}
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: "ожидаемый результат · образец: Maydon Jamoa" };
const QADAM = {
  ochish: { uz: 'Ochish', ru: 'Открыть' }, prompt: { uz: 'Prompt', ru: 'Промпт' }, ishga: { uz: 'Ishga tushirish', ru: "Запуск" },
  telefon: { uz: 'Telefonda tekshirish', ru: "Проверка на телефоне" }
};
const XATO_GAP = { uz: "Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: "Если ошибка — отправьте агенту строку ошибки (не значения `.env` и не токен): «Вышла такая ошибка: {ошибка}. Исправь.»" };
const MOS_KELMAGAN = { uz: 'Mos kelmagan gapni uch qism bilan agentga yozing.', ru: "Несовпавшую фразу напишите агенту тремя частями." };
// Yordam guruhlari (9.7): Mentor misolidagi to'liq talab — mobil trek; web-trekda — bir gap. Kalit yo'q bo'lsa — ikkalasi
const yordamGuruh = (trek, mobil, web) => [
  { yorliq: trek === null && { uz: 'mobil trek', ru: "мобильный трек" }, satrlar: mobil },
  trek !== 'mobil' && { gap: { uz: `Web-trekda: ${web.uz}`, ru: `В веб-треке: ${web.ru}` } }
].filter(Boolean);
const trekBand = (trek, mob, web) => [trek !== 'web' && mob, trek !== 'mobil' && web].filter(Boolean);

// Kutilgan natija maketlari (o'ng) — bitta manbadan (JAMOA_F1, OYINLAR, Tel); kirishda navbat bilan chiqadi, kadrlar bir marta o'zi yuradi
const SqlKarta = ({ sorov, jadval, maydonlar, yorliq, yon, d }) => (
  <div className={cxx('fo-sql', 'fo-kir', yon && 'yon')} style={{ '--d': d }}>
    <span className="fo-sql-h">Neon · SQL Editor{yorliq && <em>{tr(yorliq)}</em>}</span>
    {sorov && <code className="fo-sql-s">{sorov}</code>}
    {jadval && <code className="fo-jad-n">{jadval}</code>}
    {maydonlar && <span className="fo-yozuv">{maydonlar.map(([k, v, eg]) => <span key={k} className={cxx('fo-yozuv-q', eg && 'egasi')}><code>{k}</code><b>{tr(v)}</b></span>)}</span>}
  </div>
);
const A1Natija = () => {
  const k = useKadr(3, 1500, 900);
  return (
    <div className="fo-nat">
      <Tel className="fo-kir">{k < 2 ? <ElonE bosildi={k === 1 ? 1 : 0} /> : <OyinlarE oyinlar={royxat()} rejim="kerak" yangiId={5} />}</Tel>
      <SqlKarta d="0.15s" yon={k >= 2} sorov="SELECT * FROM oyinlar ORDER BY yaratilgan DESC;" jadval="oyinlar"
        maydonlar={[['id', '5'], ['kun', '2026-10-11'], ['soat', '19:00'], ['maydon', MAKTAB], ['kerak', '10'], ['tashkilotchi_id', '2', true]]} />
    </div>
  );
};
const A2Natija = () => {
  const k = useKadr(4, 1400, 900);
  const s20 = { ...OYINLAR[1], kerak: 6 };
  return (
    <div className="fo-nat">
      <Tel className="fo-kir" yorliq={k === 3 ? <span className="fo-tel-yorliq test">{tr({ uz: 'test holati', ru: "тестовое состояние" })}</span> : undefined}>
        {k < 3
          ? <OyinE o={OYINLAR[0]} son={k === 2 ? 9 : 8} siz={k === 2 ? 1 : 0} tugma={k === 2 ? 'qoshildi' : 'qosh'} bosildi={k >= 1 ? 1 : 0} />
          : <OyinE key="s20" o={s20} son={6} tugma="toldi" />}
      </Tel>
      <SqlKarta d="0.15s" yon={k === 2} jadval="ishtirokchilar" maydonlar={[['oyin_id', '1'], ['oyinchi_id', '2'], ['holat', 'qoshildi']]} />
    </div>
  );
};
const A3Natija = () => {
  const k = useKadr(3, 1700, 900);
  const r = royxat({ 1: { son: 9 }, 3: { son: 5 }, 4: { kerak: 9 } });
  return (
    <div className="fo-nat">
      <Tel className="fo-kir" tortish={k === 0}>
        {k < 2 ? <OyinlarE oyinlar={k === 0 ? royxat({ 1: { son: 9 }, 3: { son: 5 } }) : r} ajrat={k === 1 ? 4 : undefined} /> : <OyinE o={{ ...OYINLAR[3], kerak: 9 }} son={9} tugma="toldi" />}
      </Tel>
      <SqlKarta d="0.15s" yon={k === 0} yorliq={{ uz: ' · test holati', ru: " · тестовое состояние" }} sorov="UPDATE oyinlar SET kerak = 9 WHERE id = 4;" />
    </div>
  );
};

const ScreenA1 = (props) => {
  const [trek] = useState(trekOqi);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · e'lon berish", ru: "Практика 1 · объявление" }}
      title={{ uz: <>Funksiyangizning <span className="italic" style={{ color: T.accent }}>birinchi qismi</span> telefonda ishlasin.</>, ru: <>Запустите <span className="italic" style={{ color: T.accent }}>первую часть</span> функции на телефоне.</> }}
      mentor={{ uz: <>Uch qatorni o'zingiz yozasiz — har qator ostida kulrang savol, Mentor misoli «Yordam»da; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Три строки пишете сами — под каждой серый вопрос, пример Ментора — в «Подсказке»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
      steps={[
        { h: QADAM.ochish, t: { uz: "Antigravity'da o'z repo'ngizni oching (10-darsdagi holat: kirish ishlaydi, asosiy ro'yxat Backend'dan keladi).", ru: "Откройте свой репо в Antigravity (состояние после 10-го урока: вход работает, главный список приходит из Backend)." },
          ichi: <F1Qator />,
          bandlar: [
            { uz: "Uni uch blokda qurasiz; Mentor misolida: 1 — e'lon berish (ro'yxatga yangisi qo'shiladi) · 2 — qo'shilish (asosiy harakat) · 3 — ekran yangilanishi.", ru: "Строите её в трёх блоках; в примере Ментора: 1 — объявление (в список добавляется новое) · 2 — присоединение (главное действие) · 3 — обновление экрана." },
            { uz: "Funksiyangizda yangisini qo'shish bo'lmasa — bu blokda uning birinchi ko'rinadigan qismini quring.", ru: "Если в вашей функции нет добавления нового — в этом блоке постройте её первую видимую часть." }
          ] },
        { h: QADAM.prompt, t: { uz: "vazifa: funksiyangizning birinchi qismi ishlasin va natijasi ro'yxatda chiqsin (Mentor misolida — tashkilotchi o'yin e'lon qiladi, e'lon ro'yxatda chiqadi). Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: "задача: пусть первая часть вашей функции работает и её результат появляется в списке (в примере Ментора — организатор объявляет игру, объявление появляется в списке). Напишите три строки сами, нажмите «Скопировать», отправьте в Antigravity:" },
          prompt: <TalabPrompt blok="a1" />,
          yordam: yordamGuruh(trek, [
            { uz: "Qayerda: `mobil/` — «E'lon berish» ekrani (`src/app/elon.tsx`) va «O'yinlar» (`src/app/index.tsx`); `backend/` — yangi yo'l `POST /oyinlar`.", ru: "Где: `mobil/` — экран «E'lon berish» («Объявить игру», `src/app/elon.tsx`) и «O'yinlar» («Игры», `src/app/index.tsx`); `backend/` — новый путь `POST /oyinlar`." },
            { uz: "Nima qilsin: «Yuborish» bosilganda kun, soat, maydon va nechta odam kerakligi token bilan `POST /oyinlar` ga ketsin. Backend e'lonni `oyinlar` ga yozsin; tashkilotchi — token egasi, formada «kim» so'ralmasin.", ru: "Что сделать: при нажатии «Yuborish» («Отправить») день, время, поле и сколько нужно людей уходят с токеном в `POST /oyinlar`. Backend пишет объявление в `oyinlar`; организатор — владелец токена, в форме «кто» не спрашивать." },
            { uz: "Maydonlardan biri bo'sh bo'lsa — Backend yozmasin (`400`), ilova nima yetmaganini aytsin. Yuborilgach «O'yinlar» ochilsin, yangi o'yin ro'yxatda tursin.", ru: "Если одно из полей пустое — Backend не пишет (`400`), приложение говорит, чего не хватает. После отправки открывается «O'yinlar», новая игра стоит в списке." },
            { uz: "Nima buzilmasin: kirish, «O'yinlar» ro'yxati, «O'yin» ekrani va animatsiyalar.", ru: "Что не сломать: вход, список «O'yinlar», экран «O'yin» («Игра») и анимации." },
            TAYYOR_QATOR
          ], { uz: "forma `prototip/` dagi e'lon sahifasida, so'rov `VITE_API_URL` dagi Backend'ga, token `localStorage` dan; foydalanuvchi matni sahifaga HTML bo'lib chiqmasin (10-darsdagidek).", ru: "форма — на странице объявления в `prototip/`, запрос — в Backend из `VITE_API_URL`, токен — из `localStorage`; текст пользователя не выводится на страницу как HTML (как на 10-м уроке)." }) },
        { h: QADAM.ishga, t: { uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"e'lon berish\"`, `git push`.", ru: "когда агент закончит: `git status` — изменённые файлы совпадают с тем, что сказал агент, `.env` в списке нет; добавляйте каждый файл через `git add <fayl>`, `git commit -m \"e'lon berish\"`, `git push`." },
          bandlar: [
            { uz: 'Render yangi deploy qiladi — xizmatingizning Deploys sahifasida tugashini kuting.', ru: "Render сделает новый деплой — дождитесь окончания на странице Deploys вашего сервиса." },
            ...trekBand(trek,
              { uz: "Mobil trekda `npx expo start` ishlab tursin: fayl o'zgarsa, Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`).", ru: "В мобильном треке пусть работает `npx expo start`: если файл изменился, Expo Go обычно сам перезагружает приложение (если нет — `r` в терминале)." },
              { uz: "Web-trekda push'dan keyin Netlify o'zi yangilanadi.", ru: "В веб-треке после push Netlify обновится сам." })
          ],
          err: XATO_GAP },
        { h: QADAM.telefon, t: { uz: "talabingizning har gapini telefonda bajarib ko'ring. Mentor misolida:", ru: "выполните на телефоне каждую фразу своего требования. В примере Ментора:" },
          bandlar: [
            { uz: "(1) «E'lon berish»da formani to'ldirib yuboring — «O'yinlar» tepasida yangi o'yin chiqsin.", ru: "(1) Заполните форму на экране «Объявить игру» и отправьте — вверху экрана «Игры» появится новая игра." },
            { uz: "(2) Bitta maydonni bo'sh qoldirib yuboring — ilova nima yetmaganini aytsin, ro'yxatga bo'sh e'lon qo'shilmasin.", ru: "(2) Отправьте, оставив одно поле пустым, — приложение скажет, чего не хватает, пустое объявление в список не добавится." },
            { uz: "(3) Neon'dagi SQL Editor'da `SELECT * FROM oyinlar ORDER BY yaratilgan DESC;` — birinchi qator sizning e'loningiz, `tashkilotchi_id` to'ldirilgan.", ru: "(3) В SQL Editor на Neon `SELECT * FROM oyinlar ORDER BY yaratilgan DESC;` — первая строка — ваше объявление, `tashkilotchi_id` заполнен." },
            MOS_KELMAGAN
          ] }
      ]}
      natija={<A1Natija />}
      ortda={{ uz: "— qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).", ru: "— увидите, как это работает, и повторите шаг в своём репо по образцу (в `backend/.env` и `mobil/.env` пишете свои значения)." }}
      doneText={{ uz: "Birinchi qism ishlaydi: natija Database'ga yoziladi va ro'yxatda chiqadi.", ru: "Первая часть работает: результат записывается в Database и появляется в списке." }} />
  );
};

const ScreenA2 = (props) => {
  const [trek] = useState(trekOqi);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · qo'shilish", ru: "Практика 2 · присоединение" }}
      title={{ uz: <>Asosiy harakat ishlasin, <span className="italic" style={{ color: T.accent }}>natija Database'da qolsin</span>.</>, ru: <>Главное действие работает, <span className="italic" style={{ color: T.accent }}>итог — в Database</span>.</> }}
      mentor={{ uz: <>Endi talabga bo'lmasligi kerak bo'lgan holatni ham yozasiz, namuna «Yordam»da; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Теперь в требование пишете и случай, которого не должно быть, образец — в «Подсказке»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
      steps={[
        { h: QADAM.ochish, t: { uz: "e'lon berish ishlayapti. Funksiyangizning asosiy harakatini toping: foydalanuvchi ro'yxatdagi biriga nima qiladi? (Mentor misolida — o'yinchi o'yinga qo'shiladi.)", ru: "объявление работает. Найдите главное действие своей функции: что пользователь делает с одним из элементов списка? (В примере Ментора — игрок присоединяется к игре.)" },
          bandlar: [{ uz: "Qachon bu harakat bo'lmasligi kerak? (Mentor misolida — o'yin to'lgan yoki o'yinchi oldin qo'shilgan.)", ru: "Когда этого действия не должно быть? (В примере Ментора — игра заполнена или игрок уже присоединился.)" }] },
        { h: QADAM.prompt, t: { uz: "vazifa: asosiy harakat ishlasin, natija Database'da qolsin; bo'lmasligi kerak bo'lgan holatda Backend yozmasin, ilova nima bo'lganini aytsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: "задача: главное действие работает, результат остаётся в Database; в случае, которого не должно быть, Backend не пишет, приложение говорит, что случилось. Напишите три строки сами, нажмите «Скопировать», отправьте в Antigravity:" },
          prompt: <TalabPrompt blok="a2" />,
          yordam: yordamGuruh(trek, [
            { uz: "Qayerda: `backend/` — yangi yo'l `POST /oyinlar/:id/qoshilish` va `GET /oyinlar`; `mobil/` — «O'yin» ekrani (`src/app/oyin/[id].tsx`) va «O'yinlar» kartalari.", ru: "Где: `backend/` — новый путь `POST /oyinlar/:id/qoshilish` и `GET /oyinlar`; `mobil/` — экран «O'yin» («Игра», `src/app/oyin/[id].tsx`) и карточки «O'yinlar» («Игры»)." },
            { uz: "Nima qilsin: «Qo'shilaman» bosilganda token bilan `POST /oyinlar/:id/qoshilish` ketsin; Backend `ishtirokchilar` ga `qoshildi` qatorini yozsin.", ru: "Что сделать: при нажатии «Qo'shilaman» («Присоединяюсь») с токеном уходит `POST /oyinlar/:id/qoshilish`; Backend пишет в `ishtirokchilar` строку `qoshildi`." },
            { uz: "O'yin to'lgan bo'lsa yoki bu o'yinchi oldin qo'shilgan bo'lsa — yozmasin, `409` va xabar qaytarsin: «O'yin to'ldi» yoki «Siz bu o'yinga qo'shilgansiz»; ilova shu xabarni ko'rsatsin.", ru: "Если игра заполнена или этот игрок уже присоединился — не пишет, возвращает `409` и сообщение: «O'yin to'ldi» («Игра заполнена») или «Siz bu o'yinga qo'shilgansiz» («Вы уже присоединились к этой игре»); приложение показывает это сообщение." },
            { uz: 'Bitta o\'yinchi bitta o\'yinda bir marta yozilsin — Database qoidasi bilan ham.', ru: "Один игрок в одной игре записывается один раз — и правилом Database тоже." },
            { uz: "`GET /oyinlar` har o'yinga qo'shilganlar sonini va o'yinchining o'zi qo'shilganini bersin: kartada va «O'yin» ekranida «8 / 10» shu sondan chiqsin, qo'shilgan o'yinda tugma «Qo'shildingiz» (o'chiq).", ru: "`GET /oyinlar` отдаёт для каждой игры число присоединившихся и присоединился ли сам игрок: на карточке и на экране «O'yin» «8 / 10» берётся из этого числа, у игры, куда он присоединился, кнопка «Qo'shildingiz» («Вы присоединились», неактивна)." },
            { uz: "Tekshirish uchun 9 ta namuna o'yinchi qo'sh (kirgan o'yinchi ular qatorida bo'lmasin) va ulardan qo'shilishlar: Shanba 18:00 ga 8, Shanba 20:00 ga 6, Yakshanba 10:00 ga 4, Yakshanba 17:00 ga 9 — bitta namuna o'yinchi bir necha o'yinda bo'lishi mumkin; bor bo'lsa, qayta qo'shma.", ru: "Для проверки добавь 9 игроков-образцов (вошедший игрок не среди них) и их присоединения: в субботу 18:00 — 8, в субботу 20:00 — 6, в воскресенье 10:00 — 4, в воскресенье 17:00 — 9; один игрок-образец может быть в нескольких играх; если есть — не добавляй повторно." },
            { uz: "Nima buzilmasin: kirish, e'lon berish va «8 / 10» animatsiyasi.", ru: "Что не сломать: вход, объявление и анимацию «8 / 10»." },
            TAYYOR_QATOR
          ], { uz: "tugma va son `prototip/` dagi o'yin sahifasida, so'rov `VITE_API_URL` dagi Backend'ga, token `localStorage` dan — Backend qismi ikkala trekda bir xil.", ru: "кнопка и число — на странице игры в `prototip/`, запрос — в Backend из `VITE_API_URL`, токен — из `localStorage`; часть Backend в обоих треках одинаковая." }) },
        { h: QADAM.ishga, t: { uz: "`git status` → har faylni `git add <fayl>` → `git commit -m \"qo'shilish\"` → `git push`; Render'da yangi deploy tugashini kuting (Deploys sahifasi).", ru: "`git status` → каждый файл `git add <fayl>` → `git commit -m \"qo'shilish\"` → `git push`; дождитесь окончания нового деплоя на Render (страница Deploys)." },
          bandlar: [{ uz: "Expo Go ilovani odatda o'zi qayta yuklaydi, bo'lmasa — `r` (web-trekda — Netlify).", ru: "Expo Go обычно сам перезагружает приложение, если нет — `r` (в веб-треке — Netlify)." }],
          err: XATO_GAP },
        { h: QADAM.telefon, t: { uz: "talabingizning har gapini telefonda bajarib ko'ring. Mentor misolida:", ru: "выполните на телефоне каждую фразу своего требования. В примере Ментора:" },
          bandlar: [
            { uz: "(1) Shanba 18:00 dagi o'yinga qo'shiling — «8 / 10» → «9 / 10», tugma «Qo'shildingiz».", ru: "(1) Присоединитесь к игре в субботу 18:00 — «8 / 10» → «9 / 10», кнопка «Вы присоединились»." },
            { uz: "(2) Terminalda `r` ni bosing (web-trekda sahifani yangilang) — «9 / 10» va «Qo'shildingiz» joyida.", ru: "(2) Нажмите `r` в терминале (в веб-треке обновите страницу) — «9 / 10» и «Вы присоединились» на месте." },
            { uz: "(3) Yakshanba 10:00 dagi «Qo'shilaman»ni tez ikki marta bosing — «4 / 8» → «5 / 8»: son faqat bittaga oshsin.", ru: "(3) Быстро дважды нажмите «Присоединяюсь» у игры в воскресенье 10:00 — «4 / 8» → «5 / 8»: число должно вырасти только на один." },
            { uz: "(4) To'lgan o'yin — test holati: Neon'dagi SQL Editor'da kerakli odam sonini vaqtincha kamaytirasiz. `SELECT id, soat, maydon, kerak FROM oyinlar;` — Shanba 20:00 ning `id` sini toping, `UPDATE oyinlar SET kerak = 6 WHERE id = …;` → telefonda Shanba 20:00 dagi «Qo'shilaman»ni bosing — ilova «O'yin to'ldi» desin, son oshmasin. So'ng qaytaring: `UPDATE oyinlar SET kerak = 10 WHERE id = …;`", ru: "(4) Заполненная игра — тестовое состояние: в SQL Editor на Neon временно уменьшаете нужное число людей. `SELECT id, soat, maydon, kerak FROM oyinlar;` — найдите `id` игры в субботу 20:00, `UPDATE oyinlar SET kerak = 6 WHERE id = …;` → на телефоне нажмите «Присоединяюсь» у игры в субботу 20:00 — приложение должно написать «Игра заполнена», число не должно вырасти. Потом верните: `UPDATE oyinlar SET kerak = 10 WHERE id = …;`" },
            { uz: "O'z mahsulotingizda bo'lmasligi kerak bo'lgan holatni ham shunday yarating va tekshiring. Mos kelmagan gapni uch qism bilan agentga yozing.", ru: "В своём продукте так же создайте и проверьте случай, которого не должно быть. Несовпавшую фразу напишите агенту тремя частями." }
          ] }
      ]}
      natija={<A2Natija />}
      doneText={{ uz: "Asosiy harakat ishlaydi: natija Database'da qoladi, bo'lmasligi kerak bo'lgan holatda Backend yozmaydi.", ru: "Главное действие работает: результат остаётся в Database, в случае, которого не должно быть, Backend не пишет." }} />
  );
};

const ScreenA3 = (props) => {
  const [trek] = useState(trekOqi);
  const ishga = trek === 'mobil'
    ? { uz: "bu blokda Backend o'zgarmaydi: Expo Go ilovani odatda o'zi qayta yuklaydi, bo'lmasa — `r`.", ru: "в этом блоке Backend не меняется: Expo Go обычно сам перезагружает приложение, если нет — `r`." }
    : trek === 'web'
      ? { uz: "bu blokda Backend o'zgarmaydi: web-trekda — `git push`, Netlify saytni o'zi yangilaydi.", ru: "в этом блоке Backend не меняется: в веб-треке — `git push`, Netlify сам обновит сайт." }
      : { uz: "bu blokda Backend o'zgarmaydi: Expo Go ilovani odatda o'zi qayta yuklaydi, bo'lmasa — `r`; web-trekda — `git push`, Netlify saytni o'zi yangilaydi.", ru: "в этом блоке Backend не меняется: Expo Go обычно сам перезагружает приложение, если нет — `r`; в веб-треке — `git push`, Netlify сам обновит сайт." };
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 3 · yangilash', ru: "Практика 3 · обновление" }}
      title={{ uz: <>Ro'yxat yangilansin: <span className="italic" style={{ color: T.accent }}>Database'dagi o'zgarish ko'rinsin</span>.</>, ru: <>Список обновляется: <span className="italic" style={{ color: T.accent }}>видно изменение в Database</span>.</> }}
      mentor={{ uz: <>Oxirgi blok — ekran Database bilan bir xil bo'lsin, keyin butun funksiyani tekshirasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Последний блок — экран совпадает с Database, потом проверяете всю функцию; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
      steps={[
        { h: QADAM.ochish, t: { uz: "qo'shilish ishlayapti. 8-darsda `README.md` ga yozgan real vaqt nuqtangizni toping: ekranda boshqa foydalanuvchi tufayli o'zgaradigan joy (Mentor misolida — «8 / 10»).", ru: "присоединение работает. Найдите точку реального времени, которую записали в `README.md` на 8-м уроке: место на экране, которое меняется из-за другого пользователя (в примере Ментора — «8 / 10»)." } },
        { h: QADAM.prompt, t: { uz: "vazifa: shu joy ekran ochilganda va pastga tortilganda (web-trekda — «Yangilash» bosilganda) Backend'dan qayta kelsin; bo'lmasligi kerak bo'lgan holat ekranda oldindan ko'rinsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: "задача: пусть это место заново приходит из Backend, когда экран открыли и когда потянули вниз (в веб-треке — когда нажали «Обновить»); случай, которого не должно быть, виден на экране заранее. Напишите три строки сами, нажмите «Скопировать», отправьте в Antigravity:" },
          prompt: <TalabPrompt blok="a3" />,
          yordam: yordamGuruh(trek, [
            { uz: "Qayerda: `mobil/` — «O'yinlar» (`src/app/index.tsx`) va «O'yin» (`src/app/oyin/[id].tsx`) ekranlari.", ru: "Где: `mobil/` — экраны «O'yinlar» («Игры», `src/app/index.tsx`) и «O'yin» («Игра», `src/app/oyin/[id].tsx`)." },
            { uz: 'Nima qilsin: ikkala ekran ochilganda va pastga tortilganda ma\'lumotni `GET /oyinlar` dan qayta olsin.', ru: "Что сделать: оба экрана при открытии и при потягивании вниз заново берут данные из `GET /oyinlar`." },
            { uz: "O'yin to'lgan bo'lsa — kartada son yonida «to'ldi», «O'yin» ekranida «Qo'shilaman» o'rnida «O'yin to'ldi» tursin.", ru: "Если игра заполнена — на карточке рядом с числом «to'ldi» («заполнена»), на экране «O'yin» вместо «Qo'shilaman» («Присоединяюсь») — «O'yin to'ldi» («Игра заполнена»)." },
            { uz: "Nima buzilmasin: e'lon berish, qo'shilish, «Qo'shildingiz» va animatsiyalar.", ru: "Что не сломать: объявление, присоединение, «Qo'shildingiz» («Вы присоединились») и анимации." },
            TAYYOR_QATOR
          ], { uz: "pastga tortish o'rniga «Yangilash» tugmasi — ro'yxat va o'yin sahifasi ochilganda va shu tugma bosilganda `GET /oyinlar` dan qayta olinsin.", ru: "вместо потягивания вниз — кнопка «Yangilash» («Обновить»): список и страница игры заново берутся из `GET /oyinlar` при открытии и при нажатии этой кнопки." }) },
        { h: QADAM.ishga, t: ishga, err: XATO_GAP },
        { h: QADAM.telefon, t: { uz: 'butun funksiyani tekshiring. Mentor misolida:', ru: "проверьте всю функцию. В примере Ментора:" },
          bandlar: [
            { uz: "(1) Test holati: Neon'dagi SQL Editor'da siz qo'shilmagan Yakshanba 17:00 da kerakli sonni 9 ga tushiring: `UPDATE oyinlar SET kerak = 9 WHERE id = …;` → telefonda «O'yinlar»ni pastga torting (web-trekda — «Yangilash») — kartada «9 / 9 · to'ldi», «O'yin» ekranida «Qo'shilaman» o'rnida «O'yin to'ldi».", ru: "(1) Тестовое состояние: в SQL Editor на Neon у игры в воскресенье 17:00, куда вы не присоединялись, уменьшите нужное число до 9: `UPDATE oyinlar SET kerak = 9 WHERE id = …;` → на телефоне потяните «Игры» вниз (в веб-треке — «Обновить») — на карточке «9 / 9 · заполнена», на экране «Игра» вместо «Присоединяюсь» — «Игра заполнена»." },
            { uz: "(2) Qaytaring: `UPDATE oyinlar SET kerak = 10 WHERE id = …;` → yana pastga torting — «9 / 10» va «Qo'shilaman» qaytdi.", ru: "(2) Верните: `UPDATE oyinlar SET kerak = 10 WHERE id = …;` → снова потяните вниз — вернулись «9 / 10» и «Присоединяюсь»." },
            { uz: "(3) Uch blok talablarining har gapini yana bir marta bajaring: e'lon berish, qo'shilish, ikki marta bosish.", ru: "(3) Ещё раз выполните каждую фразу требований трёх блоков: объявление, присоединение, двойное нажатие." },
            { uz: 'Oxirida `git status` → `git add <fayl>` → `git commit -m "yangilash"` → `git push`.', ru: "В конце `git status` → `git add <fayl>` → `git commit -m \"yangilash\"` → `git push`." }
          ] }
      ]}
      natija={<A3Natija />}
      doneText={{ uz: "Birinchi funksiya ishlaydi: ekran yangilanadi, to'lgan holat oldindan ko'rinadi.", ru: "Первая функция работает: экран обновляется, заполненная игра видна заранее." }} />
  );
};

// 🃏 KARTOCHKALAR (12) — alohida ekran sflash (SABOQ 12, 16), qolipdagi QKartochka (DE-204). Orqa tomon — oddiy matn (kod-belgisiz); old va izoh — tx.
const KARTALAR = [
  { front: { uz: "Roadmap'dagi funksiyani agentga qanday berasiz?", ru: "Как передать агенту функцию из roadmap?" }, back: { uz: 'Uch qatorli talab qilib: qayerda, nima qilsin, nima buzilmasin', ru: "Трёхстрочным требованием: где, что сделать, что не сломать" }, note: { uz: "Bu darsda uchala qatorni o'zingiz yozdingiz", ru: "На этом уроке все три строки вы написали сами" } },
  { front: { uz: "PRD gapining o'zi agentga yuborilsa, nima bo'lishi mumkin?", ru: "Что может быть, если отправить агенту саму фразу из PRD?" }, back: { uz: "Aytilmagan holatni agent o'zi taxmin qiladi", ru: "Неуказанный случай агент додумает сам" }, note: { uz: 'Mentor misolida: ikki marta bosilganda «10 / 10»', ru: "В примере Ментора: при двойном нажатии «10 / 10»" } },
  { front: { uz: "E'lon egasini Backend qayerdan oladi?", ru: "Откуда Backend берёт владельца объявления?" }, back: { uz: "So'rovdagi tokendan", ru: "Из токена в запросе" }, note: { uz: "Formada «kim» so'ralmaydi", ru: "В форме «кто» не спрашивают" } },
  { front: { uz: "Ilova qayta yuklansa, yangi e'lon nega yo'qolmaydi?", ru: "Почему новое объявление не пропадает после перезагрузки приложения?" }, back: { uz: "U Database'ga yozilgan", ru: "Оно записано в Database" }, note: { uz: "7-darsdagi prototipda e'lon faqat ochiq sahifada edi", ru: "В прототипе 7-го урока объявление было только на открытой странице" } },
  { front: { uz: '«8 / 10» dagi 8 qayerdan keladi?', ru: "Откуда берётся 8 в «8 / 10»?" }, back: { uz: "Database'dagi qo'shilganlar sonidan", ru: "Из числа присоединившихся в Database" }, note: { uz: "Backend sanaydi — telefon o'zi qo'shib qo'ymaydi", ru: "Считает Backend — телефон сам не прибавляет" } },
  { front: { uz: "Bir o'yinchi «Qo'shilaman»ni ikki marta bossa, nima bo'lishi kerak?", ru: "Что должно быть, если игрок дважды нажал «Присоединяюсь»?" }, back: { uz: 'Son bittaga oshadi', ru: "Число вырастет на один" }, note: { uz: 'Backend ikkinchisiga `409` qaytaradi', ru: "На второе Backend вернёт `409`" } },
  { front: { uz: "Nega to'lgan o'yinni faqat ilova tekshirsa yetmaydi?", ru: "Почему недостаточно, чтобы заполненную игру проверяло только приложение?" }, back: { uz: "Ekrandagi son eskirgan bo'lishi mumkin", ru: "Число на экране может устареть" }, note: { uz: "Siz bosguncha boshqa o'yinchi qo'shilgan bo'lishi mumkin", ru: "Пока вы нажимали, мог присоединиться другой игрок" } },
  { front: { uz: "To'lgan o'yinda «Qo'shilaman» o'rnida nima turadi?", ru: "Что стоит вместо «Присоединяюсь» у заполненной игры?" }, back: { uz: "«O'yin to'ldi»", ru: "«Игра заполнена»" }, note: { uz: "Backend ham bu o'yinga qo'shmaydi", ru: "Backend тоже не добавит в эту игру" } },
  { front: { uz: 'Boshqa telefondagi «8 / 10» qachon yangilanadi?', ru: "Когда обновится «8 / 10» на другом телефоне?" }, back: { uz: 'Ekran ochilganda yoki pastga tortilganda', ru: "Когда экран открыли или потянули вниз" }, note: { uz: '«8 / 10» — real vaqt nuqtasi', ru: "«8 / 10» — точка реального времени" } },
  { front: { uz: "Backend o'zgarishi telefonga qachon yetadi?", ru: "Когда изменение Backend дойдёт до телефона?" }, back: { uz: "Push'dan keyin Render yangi deploy'ni tugatgach", ru: "После push, когда Render закончит новый деплой" }, note: { uz: "Xizmatning Deploys sahifasida ko'rinadi", ru: "Видно на странице Deploys сервиса" } },
  { front: { uz: "To'lgan o'yinni bitta telefon bilan qanday tekshirasiz?", ru: "Как проверить заполненную игру одним телефоном?" }, back: { uz: "Neon'dagi SQL Editor'da test holati bilan", ru: "Тестовым состоянием в SQL Editor на Neon" }, note: { uz: 'Kerakli sonni vaqtincha kamaytirasiz, keyin qaytarasiz', ru: "Временно уменьшаете нужное число, потом возвращаете" } },
  { front: { uz: 'Agent «Tayyor» desa, ishni qanday tekshirasiz?', ru: "Как проверить работу, если агент сказал «Готово»?" }, back: { uz: 'Talabning har gapini telefonda bajarib ko\'rib', ru: "Выполнив на телефоне каждую фразу требования" }, note: { uz: 'Agent talabga tayanib quradi, taxmin qilishi mumkin', ru: "Агент строит по требованию и может додумывать" } }
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
        <div className={cxx('fo-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tr(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="fo-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: "Нажмите на карточку — откроется ответ" })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204) + «Keyingi dars» qatori; kartochkalar — oldingi alohida ekranda; uyga vazifa yo'q (P-058). Sarlavha bloklar holatiga qarab (P-046; 11-FILTR 36) =====
const YAKUN_SARLAVHA = {
  a3: { uz: 'Birinchi funksiya ishlayapti: talabni siz yozdingiz.', ru: "Первая функция работает: требование написали вы." },
  a2: { uz: 'Asosiy harakat ishlaydi — yangilanish qoldi.', ru: "Главное действие работает — осталось обновление." },
  a1: { uz: 'Birinchi qism ishlaydi — asosiy harakat qoldi.', ru: "Первая часть работает — осталось главное действие." },
  yoq: { uz: 'Birinchi funksiya boshlandi — qolgan qadamni tugating.', ru: "Первая функция начата — завершите оставшийся шаг." }
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
    { uz: "Roadmap'dagi funksiyani uch qatorli talabga aylantirib, o'zingiz yozasiz.", ru: "Функцию из roadmap вы превращаете в трёхстрочное требование и пишете сами." },
    { uz: "Talabda aytilmagan holatni agent o'zi taxmin qilishi mumkin — uni talabda yozasiz.", ru: "Неуказанный в требовании случай агент может додумать сам — вы пишете его в требовании." },
    { uz: "E'lon egasini Backend tokendan oladi, «8 / 10» esa Database'dan sanaladi.", ru: "Владельца объявления Backend берёт из токена, а «8 / 10» считается по Database." },
    { uz: "Ekrandagi son eskirgan bo'lishi mumkin: to'lgan o'yinni Backend tekshiradi.", ru: "Число на экране может устареть: заполненную игру проверяет Backend." }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: "Итог" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: "Завершить" })}</button></>}>
      {/* Belgi «✓ Birinchi funksiya ishlaydi» — faqat 3-amaliyot bajarilganda; aks holda belgisiz (MD 7) */}
      <div className={cxx('fo-yakun', belgisiz && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Birinchi funksiya ishlaydi', ru: "Первая функция работает" })}
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
          <p className="fo-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: 2-asosiy funksiya»</b>: roadmap'dagi ikkinchi funksiya.</>, ru: <>Следующий урок — <b>«День проекта: 2-я основная функция»</b>: вторая функция из roadmap.</> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function FeatureOneLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — «Funksiya sahnasi» (fo-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Telefon 172×272 hamma ekranda (SABOQ 22); «Maydon Jamoa» nomi — #2E9E4F (tayanch 9.62) === */
        /* Navbatdagi harakat halqasi (SABOQ 32): kattalashish 3% gacha, shaffoflik 0.35 gacha, sikl 2.4 s, 3 marta; guruhda bitta */
        .fo-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .fo-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: fo-tolqin 2.4s ease-in-out 0.4s 3; }
        .fo-halqa-i { border-color: ${T.accent} !important; animation: fo-tolqin-i 2.4s ease-in-out 0.4s 3; }
        @keyframes fo-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes fo-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.35)}; } }
        @keyframes fo-kot { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes fo-pop { 0% { transform: scale(1); } 40% { transform: scale(1.35); } 100% { transform: scale(1); } }
        @keyframes fo-tush { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: none; } }
        @keyframes fo-yig { from { opacity: 0.3; transform: scaleY(1.6); } to { opacity: 1; transform: none; } }
        @keyframes fo-qator { 0% { background: ${T.okFon}; } 70% { background: ${T.okFon}; } 100% { background: transparent; } }
        @keyframes fo-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        @keyframes fo-uch { from { transform: translate(-50%, -50%); opacity: 0.2; } 12% { opacity: 1; } 88% { opacity: 1; } to { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); opacity: 0.4; } }
        @keyframes fo-iz { from { transform: translate(-50%, -50%) scale(0.3); opacity: 0.6; } to { transform: translate(-50%, -50%) scale(2.6); opacity: 0; } }
        @keyframes fo-aylan { to { transform: rotate(360deg); } }
        .fo-navbat-k .q-bashorat { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: fo-kot 0.45s cubic-bezier(.2,.9,.3,1.1) both; }
        .fo-navbat-k .q-bashorat::after { content: ''; position: absolute; inset: -5px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: fo-tolqin 2.4s ease-in-out 0.8s 3; }
        .fo-navbat-k .q-chip { animation: fo-kot 0.4s ease-out 0.15s both; }
        .fo-navbat-k .q-chip:nth-child(2) { animation-delay: 0.26s; }
        .q-kirish:has(.fo-hook.kutish) .q-variantlar-kol { position: relative; border-radius: 14px; outline: 2px solid ${T.accent}; outline-offset: 5px; }
        .q-kirish:has(.fo-hook.kutish) .q-variantlar-kol::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: fo-tolqin 2.4s ease-in-out 1s 3; }
        .fo-taxmin { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 9px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; transform-origin: top; animation: fo-yig 0.45s cubic-bezier(.2,.9,.3,1) both; }
        .fo-taxmin-y { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.accent}; }
        .fo-taxmin-s { color: ${T.ink2}; }
        .fo-taxmin b { color: ${T.ink}; }
        .fo-nb { display: flex; flex-direction: column; gap: 5px; }
        .fo-nb-t { font-size: 13.5px; font-weight: 600; color: ${T.ink2}; } .fo-nb-t.ok { color: ${T.ok}; font-weight: 700; } .fo-nb-t b { color: ${T.ink}; }
        .fo-nb-i { font-size: 13.5px; color: ${T.ink2}; }
        .fo-nb-x { font-weight: 600; color: ${T.ink}; }
        /* Telefon */
        .fo-tel-ust { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; flex: none; }
        .fo-tel-tex { display: inline-flex; align-items: center; height: 22px; padding: 0 11px; border: 1.5px solid ${T.line}; border-radius: 999px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .fo-tel-yorliq { display: inline-flex; align-items: center; height: 22px; font-size: 12px; font-weight: 700; padding: 0 10px; border-radius: 999px; white-space: nowrap; background: ${fon(T.ink, 0.07)}; color: ${T.ink}; }
        .fo-tel-yorliq.b1 { background: ${T.accentSoft}; color: ${T.accent}; }
        .fo-tel-yorliq.test { background: ${T.errFon}; color: ${T.err}; }
        .fo-tel { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 5px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px 7px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .fo-tel-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; }
        .fo-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: #2E9E4F; letter-spacing: 0.01em; }
        .fo-tel-sar { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.ink}; flex: none; }
        .fo-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 3px; animation: fo-ekran 0.35s ease-out both; }
        .fo-tortish { display: flex; justify-content: center; flex: none; height: 18px; animation: fo-tush 0.3s ease-out both; }
        .fo-tortish i { width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${fon(T.ink, 0.15)}; border-top-color: #2E9E4F; animation: fo-aylan 0.8s linear infinite; }
        .fo-kartalar { display: flex; flex-direction: column; gap: 4px; min-height: 0; overflow: hidden; -webkit-mask-image: linear-gradient(180deg, #000 86%, transparent); mask-image: linear-gradient(180deg, #000 86%, transparent); }
        .fo-karta { display: flex; flex-direction: column; gap: 1px; padding: 3px 7px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11px; line-height: 1.25; color: ${T.ink2}; flex: none; animation: fo-kot 0.4s ease-out var(--d, 0s) both; transition: border-color 0.3s, box-shadow 0.3s; }
        .fo-karta-1 { display: flex; align-items: baseline; justify-content: space-between; gap: 4px; }
        .fo-karta-1 b { font-size: 11.5px; color: ${T.ink}; white-space: nowrap; }
        .fo-karta-2 { display: flex; align-items: baseline; justify-content: space-between; gap: 4px; }
        .fo-karta-2.kerak { display: block; }
        .fo-karta-son { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink}; white-space: nowrap; }
        .fo-toldi-t { font-style: normal; font-size: 11px; font-weight: 800; color: ${T.err}; }
        .fo-karta.toldi { border-color: ${fon(T.err, 0.45)}; } .fo-karta.toldi .fo-karta-son { color: ${T.err}; }
        .fo-karta.yangi { border-color: ${T.ok}; animation: fo-kot 0.4s ease-out var(--d, 0s) both, fo-qator 1.6s ease-out 0.3s both; }
        .fo-karta.ajrat { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.18)}; }
        .fo-oyin { gap: 2px; }
        .fo-oyinlar { gap: 4px; }
        .fo-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .fo-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .fo-oyin-joy { font-size: 12px; color: ${T.ink2}; }
        .fo-son { display: inline-block; align-self: flex-start; margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: ${T.ink}; transform-origin: left center; }
        .fo-son.yangi { color: ${T.accent}; animation: fo-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .fo-son.qizil { color: ${T.err}; }
        .fo-eski { font-size: 11px; font-weight: 700; color: ${T.ink2}; animation: fo-kot 0.35s ease-out both; }
        .fo-doiralar { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 6px; margin: 3px 0 2px; }
        .fo-doira-quti { display: grid; grid-template-columns: repeat(5, 14px); gap: 6px; padding: 4px; margin: -4px; border-radius: 8px; border: 1px dashed transparent; }
        .fo-doiralar.sizli .fo-doira-quti { padding-bottom: 14px; }
        .fo-doiralar:has(.ortiq) .fo-doira-quti { border-color: ${fon(T.ink, 0.3)}; }
        .fo-doiralar i { position: relative; width: 14px; height: 14px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .fo-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.38)}; }
        .fo-doiralar i.siz { background: ${T.accent}; }
        .fo-doiralar i.yangi { animation: fo-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .fo-doiralar i.qizil { background: ${T.err}; box-shadow: 0 0 0 3px ${fon(T.err, 0.25)}; }
        .fo-doiralar i em { position: absolute; left: 50%; top: 16px; transform: translateX(-50%); font-style: normal; font-size: 11px; font-weight: 800; color: ${T.accent}; white-space: nowrap; }
        .fo-doiralar i.qizil em { color: ${T.err}; }
        .fo-doiralar i.ortiq { margin-top: 4px; border: 0; background: ${T.err}; box-shadow: 0 0 0 3px ${fon(T.err, 0.25)}; animation: fo-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .fo-oyin-xato { font-size: 11px; font-weight: 800; color: ${T.err}; animation: fo-kot 0.35s ease-out both; }
        .fo-tel-btn { position: relative; margin-top: auto; flex: none; display: flex; align-items: center; justify-content: center; width: 100%; height: 30px; border: 0; border-radius: 10px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; transition: transform 0.15s, background 0.3s, color 0.3s, box-shadow 0.2s; }
        button.fo-tel-btn { cursor: pointer; } button.fo-tel-btn:disabled { cursor: default; }
        .fo-tel-btn.bos { transform: scale(0.94); box-shadow: 0 0 0 4px ${fon(T.accent, 0.25)}; }
        .fo-tel-btn.off { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; transform: none; }
        .fo-tel-btn.toldi { background: ${T.errFon}; color: ${T.err}; box-shadow: inset 0 0 0 1px ${fon(T.err, 0.4)}; transform: none; animation: fo-kot 0.35s ease-out both; }
        .fo-barmoq { position: absolute; left: 50%; top: 50%; width: 22px; height: 22px; border-radius: 50%; background: ${fon(T.ink, 0.35)}; pointer-events: none; animation: fo-iz 0.6s ease-out both; }
        .fo-elon { gap: 4px; }
        .fo-maydon { display: flex; flex-direction: column; padding: 2px 8px 3px; border: 1px solid ${T.line}; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.3; color: ${T.ink}; flex: none; }
        .fo-maydon small { font-family: 'Manrope', sans-serif; font-size: 11px; color: ${T.ink2}; }
        .fo-tel-xato { display: block; padding: 4px 6px; border-radius: 8px; background: ${T.errFon}; color: ${T.err}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; animation: fo-kot 0.35s ease-out both; }
        .fo-tel-ust > .q-btn { align-self: center; white-space: nowrap; }
        /* Agent chati (0-ekran) */
        .fo-hook { display: grid; grid-template-columns: 172px minmax(0, 1fr); align-items: start; gap: 14px; }
        .fo-hook > .fo-chat { margin-top: 30px; }
        .fo-chat { display: flex; flex-direction: column; gap: 7px; width: 100%; max-width: 440px; padding: 10px 12px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); animation: fo-kot 0.4s ease-out both; }
        .fo-chat-h { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 800; color: ${T.ink2}; letter-spacing: 0.02em; }
        .fo-chat-h i { width: 8px; height: 8px; border-radius: 50%; background: ${T.ok}; }
        .fo-pufak { max-width: 92%; padding: 7px 11px; border-radius: 12px; font-size: 13px; line-height: 1.45; animation: fo-kot 0.4s ease-out both; }
        .fo-pufak.siz { align-self: flex-end; background: ${T.accentSoft}; color: ${T.ink}; border-bottom-right-radius: 4px; animation-delay: 0.15s; }
        .fo-pufak.agent { align-self: flex-start; background: ${T.bg}; color: ${T.ink}; font-weight: 700; border-bottom-left-radius: 4px; animation-delay: 0.35s; }
        .fo-bosh-q { align-self: flex-end; padding: 5px 11px; border-radius: 10px; border: 1.5px dashed ${T.err}; color: ${T.err}; font-size: 12.5px; font-weight: 700; animation: fo-tush 0.45s ease-out both; }
        /* Backend va Database */
        .fo-be { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); min-width: 0; transition: border-color 0.3s, box-shadow 0.3s; }
        .fo-be.on { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.14)}; }
        .fo-be.xato { border-color: ${T.err}; box-shadow: 0 0 0 4px ${fon(T.err, 0.14)}; }
        .fo-be-h { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: ${T.ink}; }
        .fo-be-joy { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; overflow-wrap: anywhere; }
        .fo-yol { display: flex; align-items: center; gap: 8px; padding: 5px 9px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; transition: border-color 0.3s, background 0.3s; }
        .fo-yol code { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; overflow-wrap: anywhere; }
        .fo-yol.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fo-yol.ok { border-color: ${fon(T.ok, 0.5)}; background: ${T.okFon}; }
        .fo-yol.xato { border-color: ${fon(T.err, 0.5)}; background: ${T.errFon}; }
        .fo-be-token { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: ${T.ok}; animation: fo-kot 0.35s ease-out both; }
        .fo-be-token code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 1px 7px; border-radius: 6px; background: ${T.okFon}; color: ${T.ok}; }
        .fo-qulf { position: relative; width: 10px; height: 8px; margin-top: 5px; border-radius: 2px; background: ${T.ok}; flex: none; }
        .fo-qulf::before { content: ''; position: absolute; left: 2px; top: -6px; width: 6px; height: 7px; border: 1.5px solid ${T.ok}; border-bottom: 0; border-radius: 4px 4px 0 0; box-sizing: border-box; transform: translateY(-3px) rotate(-25deg); transform-origin: right bottom; }
        .fo-be-401 { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 20px; color: ${T.err}; animation: fo-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .fo-be-qarash { display: flex; align-items: center; gap: 7px; padding: 5px 9px; border-radius: 8px; background: ${T.errFon}; color: ${T.err}; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; animation: fo-kot 0.35s ease-out both; }
        .fo-be-qarash i { width: 9px; height: 9px; border-radius: 50%; border: 2px solid ${T.err}; flex: none; }
        .fo-db { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${fon(T.ink, 0.025)}; min-width: 0; transition: border-color 0.3s, box-shadow 0.3s; }
        .fo-db-h { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        .fo-jad { position: relative; display: flex; flex-direction: column; gap: 4px; padding: 7px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; min-width: 0; }
        .fo-jad-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .fo-jt { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .fo-jt th { text-align: left; font-weight: 600; color: ${T.ink2}; padding: 2px 8px 3px 0; border-bottom: 1px solid ${T.line}; white-space: nowrap; }
        .fo-jt td { padding: 3px 8px 3px 0; color: ${T.ink}; border-bottom: 1px solid ${fon(T.ink, 0.06)}; white-space: nowrap; transition: background 0.3s, color 0.3s; }
        .fo-jt tr.kir { animation: fo-tush 0.5s ease-out both, fo-qator 1.8s ease-out 0.2s both; }
        .fo-jt tr.yon td { background: ${T.okFon}; color: ${T.ok}; }
        .fo-jt td.egasi { color: ${T.accent}; font-weight: 800; background: ${T.accentSoft}; border-radius: 4px; padding-left: 4px; }
        .fo-egasi-y { align-self: flex-end; font-size: 11.5px; font-weight: 700; color: ${T.accent}; padding: 2px 9px; border-radius: 999px; background: ${T.accentSoft}; animation: fo-kot 0.4s ease-out 0.3s both; }
        .fo-yoq-q { font-size: 12px; font-weight: 600; color: ${T.ink2}; animation: fo-kot 0.35s ease-out both; }
        .fo-db.sanoq { gap: 4px; }
        .fo-db.sanoq.ok { border-color: ${T.ok}; box-shadow: 0 0 0 4px ${fon(T.ok, 0.14)}; }
        .fo-db.sanoq.xato { border-color: ${T.err}; box-shadow: 0 0 0 4px ${fon(T.err, 0.14)}; }
        .fo-db.sanoq.qarash { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.14)}; }
        .fo-sanoq-l { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .fo-sanoq { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: clamp(30px,4vw,40px); font-weight: 800; color: ${T.ink}; transform-origin: left center; }
        .fo-sanoq.yangi { color: ${T.ok}; animation: fo-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .fo-sanoq.qizil { color: ${T.err}; animation: fo-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .fo-sanoq-j { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; padding: 1px 7px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .fo-db-kartalar { display: flex; flex-wrap: wrap; gap: 6px; }
        .fo-db-k { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; padding: 5px 10px; border-radius: 8px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; transition: border-color 0.3s, background 0.3s, color 0.3s; }
        .fo-db-k.yon { border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; }
        /* Sahna joylashuvi: telefon chapda → Backend → Database (SABOQ 21) */
        .fo-sahna { position: relative; display: flex; flex-direction: column; gap: 10px; }
        .fo-sahna-q { display: grid; grid-template-columns: 196px minmax(18px, 40px) minmax(232px, 0.95fr) minmax(16px, 30px) minmax(0, 1.5fr); align-items: start; }
        .fo-sahna.ixcham .fo-sahna-q { grid-template-columns: max-content minmax(16px, 40px) minmax(0, 1fr); }
        .fo-sahna-tel { display: flex; justify-content: center; min-width: 0; }
        .fo-sahna-ong { display: flex; flex-direction: column; min-width: 0; }
        .fo-yolak { position: relative; align-self: start; margin-top: 140px; height: 0; border-top: 2px dashed ${fon(T.ink, 0.28)}; }
        .fo-yolak.b2 { margin-top: 70px; }
        .fo-yolak::after { content: ''; position: absolute; right: 0; top: -6px; width: 7px; height: 7px; border-top: 2px solid ${fon(T.ink, 0.28)}; border-right: 2px solid ${fon(T.ink, 0.28)}; transform: rotate(45deg); }
        .fo-pastga { align-self: center; width: 0; height: 14px; margin: 3px 0; border-left: 2px dashed ${fon(T.ink, 0.28)}; }
        .fo-ikki { display: grid; grid-template-columns: 172px 172px; gap: 12px; }
        .fo-konvert { position: absolute; z-index: 6; pointer-events: none; transform: translate(-50%, -50%); display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px 4px 25px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.accent}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink}; white-space: nowrap; box-shadow: 0 8px 18px -8px rgba(${T.shadowBase},0.45); animation: fo-uch 850ms cubic-bezier(.45,0,.3,1) both; }
        .fo-konvert::before { content: ''; position: absolute; left: 7px; top: 50%; width: 12px; height: 9px; margin-top: -4.5px; border: 1.5px solid ${T.accent}; border-radius: 2px; box-sizing: border-box; }
        .fo-konvert::after { content: ''; position: absolute; left: 10px; top: 50%; width: 5px; height: 5px; margin-top: -5px; border-right: 1.5px solid ${T.accent}; border-bottom: 1.5px solid ${T.accent}; transform: rotate(45deg); }
        .fo-konvert.javob { border-color: ${T.ok}; } .fo-konvert.javob::before, .fo-konvert.javob::after { border-color: ${T.ok}; }
        .fo-konvert.qayt { border-color: ${T.err}; color: ${T.err}; } .fo-konvert.qayt::before, .fo-konvert.qayt::after { border-color: ${T.err}; }
        .fo-konvert.nuqta { padding: 0; width: 11px; height: 11px; border: 0; border-radius: 50%; background: ${T.accent}; box-shadow: none; }
        .fo-konvert.nuqta.javob { background: ${T.ok}; }
        .fo-konvert.nuqta::before, .fo-konvert.nuqta::after { display: none; }
        .fo-k-token { font-size: 11px; font-weight: 800; padding: 0 6px; border-radius: 5px; background: ${T.ok}; color: #fff; }
        /* 4-ekran: talab qatori kartasi (bittadan) va tekshirilganlari ixcham qatorda */
        .fo-qatorlar { display: flex; flex-direction: column; gap: 6px; }
        .fo-qator-ix { display: flex; align-items: baseline; gap: 8px; padding: 6px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; color: ${T.ink2}; animation: fo-yig 0.4s ease-out both; }
        .fo-qator-ix b { font-size: 14px; } .fo-qator-ix.xato b { color: ${T.err}; } .fo-qator-ix.ok b { color: ${T.ok}; }
        .q-karta.fo-qk { display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 10px 14px; padding: 12px 16px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); animation: fo-kot 0.4s ease-out both; }
        .fo-qk.xato { border-color: ${T.err}; background: ${T.errFon}; } .fo-qk.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .fo-qk > .q-yorliq { margin: 0; font-size: 11.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .fo-qk-t { flex: 1 1 300px; min-width: 0; font-size: clamp(14px, 1.6vw, 16px); font-weight: 700; color: ${T.ink}; line-height: 1.4; }
        .fo-qk-n { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: ${T.ink}; animation: fo-kot 0.3s ease-out both; }
        .fo-qk-n b { font-size: 17px; } .fo-qk.xato .fo-qk-n b { color: ${T.err}; } .fo-qk.ok .fo-qk-n b { color: ${T.ok}; }
        /* Reja */
        .fo-reja-past { display: flex; flex-direction: column; gap: 4px; }
        p.fo-reja-repo { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; overflow-wrap: anywhere; }
        p.fo-reja-repo code { color: ${T.ink}; font-weight: 700; }
        p.fo-reja-izoh { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        /* Amaliyot bloklari: talab joylari (uch qator o'quvchidan), Yordam, SQL qatori, kutilgan natija */
        .lesson-root .q-blok .q-split { align-items: start; }
        .fo-band { display: block; margin-top: 5px; }
        .fo-f1 { color: ${T.ink}; }
        .fo-f1-i { display: block; margin: 4px 0; font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 700; color: ${T.ink}; width: 100%; padding: 5px 9px; border-radius: 7px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .fo-talab { margin-top: 8px; gap: 6px; }
        .q-prompt-nusxa:disabled { opacity: 0.45; cursor: not-allowed; }
        .fo-joy { display: flex; flex-direction: column; gap: 2px; }
        .fo-joy-q { display: flex; align-items: flex-start; gap: 8px; }
        .fo-joy-l { flex: none; padding-top: 6px; font-size: 13px; font-weight: 700; color: ${T.ink}; min-width: 112px; }
        .fo-joy-i { flex: 1; min-width: 0; resize: none; overflow: hidden; min-height: 32px; font-family: 'Manrope', sans-serif; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; padding: 5px 9px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .fo-joy-i::placeholder { color: ${T.accent}; opacity: 0.75; font-weight: 700; }
        .fo-joy-i:focus, .fo-f1-i:focus { outline: none; border-color: ${T.accent}; }
        .fo-joy-s { padding-left: 120px; font-size: 12px; font-style: italic; color: ${T.ink2}; }
        .fo-ps { display: block; margin: 2px 0 0; font-size: clamp(12.5px,1.5vw,13.5px); line-height: 1.55; color: ${T.ink}; font-weight: 500; }
        .fo-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
        .fo-yordam-s { display: block; padding: 6px 10px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; font-size: 13px; line-height: 1.5; }
        .fo-yordam-l { margin-top: 4px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .fo-yordam-g { display: block; margin-top: 2px; font-size: 12.5px; color: ${T.ink2}; }
        .q-blok-xato .q-btn.fo-yordam-btn { padding: 5px 12px; font-size: 12.5px; }
        .q-blok-t .qcode, .q-blok-xato .qcode, .fo-yordam .qcode, .q-blok-tugadi .qcode, p.fo-ortda .qcode { white-space: normal; overflow-wrap: anywhere; }
        .fo-sql-q { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 6px; vertical-align: middle; margin: 2px 0; }
        .fo-sql-k { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: ${CODE.text}; background: ${CODE.bg}; border-radius: 6px; padding: 2px 8px; user-select: all; overflow-wrap: anywhere; }
        .fo-nusxa { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; padding: 2px 9px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; }
        .fo-nusxa:hover { background: ${T.accentSoft}; }
        p.fo-ortda { margin: 0; font-size: 12.5px; line-height: 1.7; color: ${T.ink2}; overflow-wrap: anywhere; }
        .fo-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; overflow-wrap: anywhere; }
        .fo-nat { display: flex; flex-direction: row; align-items: flex-start; gap: 14px; }
        .fo-nat > :last-child { flex: 1; min-width: 0; }
        @media (max-width: 1199px) { .q-blok-natija .fo-nat { padding-right: 38px; } }
        .fo-kir { animation: fo-kot 0.45s ease-out var(--d, 0s) both; }
        .fo-sql { display: flex; flex-direction: column; gap: 7px; padding: 10px 12px; border-radius: 12px; border: 1px solid ${T.line}; background: ${fon(T.ink, 0.025)}; min-width: 0; transition: border-color 0.3s, box-shadow 0.3s; }
        .fo-sql.yon { border-color: ${T.ok}; box-shadow: 0 0 0 3px ${fon(T.ok, 0.14)}; }
        .fo-sql-h { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .fo-sql-h em { font-style: normal; color: ${T.err}; }
        .fo-sql-s { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.45; color: ${CODE.text}; background: ${CODE.bg}; border-radius: 8px; padding: 6px 9px; overflow-wrap: anywhere; }
        .fo-yozuv { display: flex; flex-direction: column; gap: 3px; padding: 6px 9px; border-radius: 9px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .fo-sql.yon .fo-yozuv { animation: fo-qator 1.6s ease-out both; }
        .fo-yozuv-q { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; font-size: 12px; }
        .fo-yozuv-q code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .fo-yozuv-q b { color: ${T.ink}; font-weight: 700; text-align: right; }
        .fo-yozuv-q.egasi b { color: ${T.accent}; }
        /* Kartochkalar (SABOQ 16): birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */
        .fo-flash.yangi .fc-card:not(.flip) .fc-front { outline: 2px solid ${T.accent}; outline-offset: 3px; }
        p.fo-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.fo-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: fo-nuqta 2.4s ease-in-out 3; }
        @keyframes fo-nuqta { 50% { transform: scale(1.3); opacity: 0.5; } }
        /* Yakun: «Keyingi dars» nishonlardan oldin; belgi faqat 3-amaliyotdan keyin */
        .fo-yakun { flex: 1 0 auto; display: flex; flex-direction: column; min-height: 0; }
        .fo-yakun.belgisiz .done-chip { display: none; }
        .fo-yakun .q-yakun > .ach-coll { order: 1; }
        p.fo-keyingi { margin: 0; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
        p.fo-keyingi b { color: ${T.ink}; }
        .rc-ic .fo-rc-kod { display: inline-block; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(13px,2vw,18px); line-height: 1.4; color: ${CODE.text}; background: ${CODE.bg}; padding: 10px 16px; border-radius: 10px; overflow-wrap: anywhere; }
        @media (max-width: 860px) {
          .fo-sahna-q { grid-template-columns: 196px minmax(14px, 24px) minmax(0, 1fr); }
          .fo-sahna-q > .fo-yolak.b2 { display: none; }
          .fo-sahna-q > .fo-db { grid-column: 3; }
        }
        @media (max-width: 640px) {
          .fo-sahna-q, .fo-sahna.ixcham .fo-sahna-q { grid-template-columns: minmax(0, 1fr); justify-items: center; }
          .fo-sahna-q > .fo-db { grid-column: auto; }
          .fo-yolak, .fo-yolak.b2 { display: block; margin: 4px 0; width: 0; height: 16px; border-top: 0; border-left: 2px dashed ${fon(T.ink, 0.28)}; }
          .fo-yolak::after { display: none; }
          .fo-sahna-q > .fo-be, .fo-sahna-q > .fo-db, .fo-sahna-ong { width: 100%; }
          .fo-ikki { gap: 10px; }
          .fo-hook { grid-template-columns: minmax(0, 1fr); justify-items: center; }
          .fo-hook > .fo-chat { order: -1; margin-top: 0; }
          .fo-joy-q { flex-direction: column; gap: 3px; }
          .fo-joy-l { padding-top: 0; min-width: 0; }
          .fo-joy-i { width: 100%; }
          .fo-joy-s { padding-left: 0; }
          .fo-nat { flex-direction: column; align-items: center; }
          .fo-nat > :last-child { width: 100%; }
          .fo-jt { font-size: 10.5px; }
          .fo-jt th, .fo-jt td { padding-right: 5px; }
          .fo-jt th { white-space: normal; }
          .fo-jt td:nth-child(4) { white-space: normal; }
        }
        @media (max-width: 380px) { .fo-ikki { grid-template-columns: 172px; justify-content: center; } }
        @media (prefers-reduced-motion: reduce) {
          .fo-halqa::after, .fo-halqa-i, .fo-navbat-k .q-bashorat, .fo-navbat-k .q-bashorat::after, .fo-navbat-k .q-chip, .q-kirish .q-variantlar-kol::after, .fo-taxmin, .fo-konvert, .fo-ekran, .fo-tortish, .fo-tortish i,
          .fo-karta, .fo-son.yangi, .fo-doiralar i, .fo-eski, .fo-oyin-xato, .fo-tel-btn.toldi, .fo-barmoq, .fo-tel-xato, .fo-chat, .fo-pufak, .fo-bosh-q, .fo-be-token, .fo-be-401, .fo-be-qarash,
          .fo-jt tr.kir, .fo-egasi-y, .fo-yoq-q, .fo-sanoq.yangi, .fo-sanoq.qizil, .fo-qator-ix, .fo-qk, .fo-qk-n, .fo-kir, .fo-sql.yon .fo-yozuv, p.fo-fc-ipucha i { animation: none !important; }
          .fo-tel-btn, .fo-be, .fo-yol, .fo-db, .fo-db-k, .fo-karta, .fo-jt td, .fo-sql { transition: none !important; }
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
