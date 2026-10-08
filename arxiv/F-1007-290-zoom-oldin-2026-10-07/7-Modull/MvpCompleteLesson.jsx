import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 9-Modul · 9-dars «Loyiha kuni: MVP tayyor» (m7-09) — konveyer skeletidan (src/skelet/NamunaDars.jsx), MD v3: feedback/F-1005-9modul/09-MvpComplete-v3.md (GATE M ✓).
// TARKIB: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletdan, TEGILMAGAN;
//   kontent: s0 QKirish · s1 QReja · s2 QTushuncha (ikki telefon, 409) · a1 QBlok · s3 test · s4 QTushuncha (ega sahifasi, token) · a2 QBlok · s5 test ·
//   a3 QBlok (deploy) · podium · kartochkalar (alohida ekran, F-1005-88) · QYakun (uyga vazifasiz, 172.4).
// Bitta vizual — «Maydon» xaritasi (MAYDON): telefon · Backend · Database · ega sahifasi · Umami · MVP ro'yxati qatori.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm7-09-v1', lessonTitle: { uz: 'Loyiha kuni: MVP tayyor', ru: 'День проекта: MVP готов' } };
// 12 ekran: 8 ekran + 3 amaliyot bloki (172-qonun) + kartochkalar · final tartib-mashqi yo'q · uyga vazifa yo'q (172.4: ish repo'da)
// F-1005-88: kartochka alohida ekran (P-058 dan farq, foydalanuvchi qarori) — podium va yakun orasida (7-dars naqshi)
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
  { id: 's8',  type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Dars yangi — ✔ o'rni MD da belgilangan: s3 — B (1), s5 — C (2); keyin o'zgarmaydi.
// `practice: -1` — sentinel: amaliyot bloklari (a1 · a2 · a3) ball bermaydi, PRACTICE_BASE + ekran zonasida faqat mentor ko'radi.
const INLINE_KEYS = { s3: 1, s5: 2, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI: 4 — 1-savol, 7 — 2-savol). S-026: emoji o'rniga koddan bitta qator.
const RcKod = ({ t }) => <code className="mc-rc-kod">{tr(t)}</code>;
const fk = (s) => <>{fmtCode(s)}</>; // matndagi `kod` bo'laklari — tr() JSX ni o'tkazib yuboradi
const RECAPS = {
  4: {
    title: { uz: "Bo'sh katakni Backend tekshiradi", ru: 'Свободную ячейку проверяет Backend' },
    cards: [
      { ic: <RcKod t="POST /bandlar" />, h: { uz: "Band yo'li", ru: 'Путь брони' }, body: { uz: "Sayt bandni Backend'ga yuboradi, Backend uni Database'ga yozadi.", ru: 'Сайт отправляет бронь в Backend, Backend записывает её в Database.' } },
      { ic: <RcKod t="409 · Bu vaqt band" />, h: { uz: 'Rad javobi', ru: 'Ответ-отказ' }, body: { uz: "Katak band bo'lsa, ikkinchi band yozilmaydi.", ru: 'Если ячейка занята, вторая бронь не записывается.' } },
      { ic: <RcKod t="band-qildi" />, h: { uz: 'Hodisa', ru: 'Событие' }, body: { uz: "Band saqlangandan keyin Umami'ga yoziladi.", ru: 'Записывается в Umami после сохранения брони.' }, ask: { uz: "Nega telefondagi katak rangiga qarab tekshirib bo'lmaydi?", ru: 'Почему нельзя проверять по цвету ячейки на телефоне?' } }
    ]
  },
  7: {
    title: { uz: fk("Parol `.env` da, ro'yxat token bilan"), ru: fk('Пароль в `.env`, список — по токену') },
    cards: [
      { ic: <RcKod t="POST /kirish" />, h: { uz: 'Kirish', ru: 'Вход' }, body: { uz: "Parol to'g'ri bo'lsa, Backend token beradi.", ru: 'Если пароль верный, Backend выдаёт токен.' } },
      { ic: <RcKod t="GET /bandlar" />, h: { uz: 'Qulf', ru: 'Замок' }, body: { uz: fk("Tokensiz so'rovga `401` qaytadi."), ru: fk('На запрос без токена возвращается `401`.') } },
      { ic: <RcKod t="EGA_PAROLI=..." />, h: { uz: 'Parol joyi', ru: 'Место пароля' }, body: { uz: fk("`.env` da turadi: kodda ham, GitHub'da ham emas."), ru: fk('Хранится в `.env`: ни в коде, ни на GitHub.') }, ask: { uz: "Ega sahifasi kodini o'qigan odam ro'yxatni ocha oladimi?", ru: 'Сможет ли открыть список тот, кто прочитал код страницы владельца?' } }
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

// ===== DARSNING BITTA VIZUALI — «Maydon» xaritasi (163, 180): bitta manba MAYDON → MvpQator · Telefon · Yol · BackendQuti · DbJadval · EgaSahifa · UmamiQadam =====
// qolip-maket: mc-tel-btn mc-kirish-b
// Tayanch 5-bo'lim: K1 — 6 katak 16:00 … 21:00 · K2 — Shanba 2026-10-10 · K7 — /ega, EGA_PAROLI, «409 · Bu vaqt band», test bandlari 19:00 (A1) va 21:00 (A3).
// Holatlar (MD): kulrang — hali yo'q · oq — ishlaydi · accent — joriy · yashil — bugun qurildi · qizil — rad etildi / qulf. Konvert — so'rov yoki javob.
const MAYDON = {
  soatlar: ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
  kun: { nom: { uz: 'Shanba', ru: 'Суббота' }, sana: '2026-10-10' },
  mvp: {
    qilamiz: [
      { id: 'kataklar', t: { uz: 'Vaqt kataklari', ru: 'Ячейки времени' } },
      { id: 'band', t: { uz: 'Band qilish', ru: 'Бронирование' } },
      { id: 'ega', t: { uz: "Ega uchun bandlar ro'yxati", ru: 'Список броней для владельца' } }
    ],
    keyin: [{ uz: "To'lov", ru: 'Оплата' }, { uz: "Jamoa yig'ish", ru: 'Сбор команды' }, { uz: 'Eslatma', ru: 'Напоминание' }]
  },
  yollar: [
    { id: 'vaqtlar', t: 'GET /vaqtlar' },
    { id: 'bandlar', t: 'POST /bandlar' },
    { id: 'kirish', t: 'POST /kirish' },
    { id: 'royxat', t: 'GET /bandlar', qulf: true }
  ],
  // Namuna ma'lumot — jadval qatori, qahramon emas (MD TAYANCHGA SAVOL 9). 19:00 va 21:00 — MD 1-ekrani; 17:00, 20:00 — 4-ekran uchun qo'shildi (hisobotda).
  odam: {
    '17:00': { ism: 'Sardor', tel: '+998 90 000 00 01' },
    '18:00': { ism: 'Jasur', tel: '+998 90 000 00 03' },
    '19:00': { ism: 'Jasur', tel: '+998 90 000 00 03' },
    '20:00': { ism: 'Otabek', tel: '+998 90 000 00 02' },
    '21:00': { ism: 'Bekzod', tel: '+998 90 000 00 04' }
  },
  umami: [{ uz: 'ochdi', ru: 'открыл' }, { uz: 'vaqtni tanladi', ru: 'выбрал время' }, { uz: 'band qildi', ru: 'забронировал' }]
};
const SAHIFA = 'localhost:5173';
const NETLIFY = 'maydon-....netlify.app';
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Ketma-ket bosqichlar: [[kutish ms, fn], …] — kam harakat rejimida kutish qisqaradi; ekran yopilsa taymerlar tozalanadi
const useKetma = () => {
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  return useCallback((qadamlar) => {
    let t = 0;
    qadamlar.forEach(([ms, fn]) => { t += kamHarakat() ? Math.min(ms, 80) : ms; tm.current.push(setTimeout(fn, t)); });
  }, []);
};

// MVP ro'yxati qatori — holat: { kataklar | band | ega: 'ok' | 'on' }
const MvpQator = ({ holat = {} }) => (
  <div className="mc-mvp">
    <div className="mc-mvp-q">
      <span className="mc-mvp-l">{tr({ uz: 'qilamiz', ru: 'делаем' })}</span>
      {MAYDON.mvp.qilamiz.map(f => <span key={f.id} className={`mc-mvp-f ${holat[f.id] || ''}`}><i>{holat[f.id] === 'ok' ? '✓' : '○'}</i>{tr(f.t)}</span>)}
    </div>
    <div className="mc-mvp-k">
      <span className="mc-mvp-l">{tr({ uz: 'keyin', ru: 'потом' })}</span>
      {MAYDON.mvp.keyin.map((k, i) => <span key={i} className="mc-mvp-kf">{tr(k)}</span>)}
    </div>
  </div>
);
// Telefon yoki brauzer oynasi (ramka 'tel' | 'oyna'): kataklar · forma (ism, telefon) · «Band qilish» · belgi 'ok' | 'rad' · eski — «eski holat» yorlig'i
// tugma: 'xira' | 'navbat' (keyingi harakat, puls) | null
const Telefon = ({ ramka = 'tel', manzil = SAHIFA, yorliq, band = [], tanlangan, forma, tugma, onBand, belgi, eski, faol, katta }) => (
  <div className={`mc-tel-w ${ramka === 'oyna' ? 'oyna' : ''}`}>
    {yorliq && <span className="mc-tel-y">{yorliq}</span>}
    <div className={`mc-tel ${ramka} ${faol ? 'faol' : ''} ${katta ? 'katta' : ''}`}>
      <div className="mc-tel-bar">{ramka === 'oyna' && <><i /><i /><i /></>}<span>{manzil}</span></div>
      <div className="mc-tel-tana">
        <div className="mc-tel-bosh"><b className="mc-nom">Maydon</b><span className="mc-kun"><i>‹</i>{tr(MAYDON.kun.nom)}<i>›</i></span></div>
        <div className="mc-kataklar">
          {MAYDON.soatlar.map(s => {
            const b = band.includes(s);
            return (
              <span key={s} className={`mc-katak ${b ? 'band' : ''} ${tanlangan === s ? 'tanlangan' : ''}`}>
                {s}{b && <small>{tr({ uz: 'band', ru: 'занято' })}</small>}
                {eski === s && <small className="mc-eski">{tr({ uz: 'eski holat', ru: 'старое состояние' })}</small>}
              </span>
            );
          })}
        </div>
        {forma && (
          <div className="mc-forma">
            <span className="mc-input">{forma.ism}</span>
            <span className="mc-input">{forma.tel}</span>
          </div>
        )}
        {tugma && <button type="button" className={`mc-tel-btn ${tugma}`} disabled={tugma !== 'navbat'} onClick={onBand}>{tr({ uz: 'Band qilish', ru: 'Забронировать' })}</button>}
        {belgi === 'ok' && <p className="mc-belgi ok">✓ {tr({ uz: 'Band qilindi', ru: 'Забронировано' })}</p>}
        {belgi === 'rad' && <p className="mc-belgi rad">{tr({ uz: 'Bu vaqt band — boshqa vaqtni tanlang', ru: 'Это время занято — выберите другое' })}</p>}
      </div>
    </div>
  </div>
);
// Yo'l: konvert k = { id, yon: 'ong' | 'chap' | 'past' | 'tepa', t, h: 'ok' | 'err' } — id almashsa uchish qaytadan boshlanadi
const Yol = ({ k, tik = false }) => (
  <div className={`mc-yol ${tik ? 'tik' : ''}`}>
    <span className="mc-yol-ch" />
    {k && <span key={k.id} className={`mc-konvert ${k.yon} ${k.h || ''}`} />}
    {k && k.t && <span key={`t-${k.id}`} className={`mc-konvert-t ${k.h || ''}`}>{fmtCode(tr(k.t))}</span>}
  </div>
);
// Backend qutisi: korinadi — yo'llar · holat { yo'l id: 'on' | 'ok' | 'err' } · qulf 'err' | 'ok' · env — `.env` qatori holati · tekshiruv { k, h, t } · rad — quti qizil
const BackendQuti = ({ korinadi = MAYDON.yollar.map(y => y.id), holat = {}, qulf, env, tekshiruv, rad }) => (
  <div className={`mc-be ${rad ? 'err' : ''}`}>
    <span className="mc-tugun-n">Backend</span>
    {MAYDON.yollar.filter(y => korinadi.includes(y.id)).map(y => (
      <span key={y.id} className={`mc-yol-q ${holat[y.id] || ''}`}>
        <code>{y.t}</code>{y.qulf && <i className={`mc-qulf ${qulf || ''}`} aria-hidden="true" />}
      </span>
    ))}
    {env !== undefined && <span className={`mc-env ${env || ''}`}><code>.env</code><code>EGA_PAROLI</code></span>}
    {tekshiruv && <span key={tekshiruv.k} className={`mc-tekshir ${tekshiruv.h}`}>{tr(tekshiruv.t)}</span>}
  </div>
);
// Database `bandlar`: qatorlar — soatlar (ism va telefon MAYDON.odam dan) · yangi — ajralib kiradigan qator · belgi — tekshirilgan qator
const dbQiymat = (u, soat) => (u === 'kun' ? MAYDON.kun.sana : u === 'soat' ? soat : u === 'ism' ? MAYDON.odam[soat].ism : MAYDON.odam[soat].tel);
const DbJadval = ({ qatorlar = [], ustun = ['kun', 'soat', 'ism', 'telefon'], yangi, belgi, sarlavha }) => (
  <div className="mc-db">
    <span className="mc-tugun-n">{sarlavha || <>Database <code>bandlar</code></>}</span>
    <div className="mc-jadval-w">
      <table className="mc-jadval">
        <thead><tr>{ustun.map(u => <th key={u}>{u}</th>)}</tr></thead>
        <tbody>
          {qatorlar.length
            ? qatorlar.map(s => <tr key={s} className={`${(Array.isArray(yangi) ? yangi.includes(s) : yangi === s) ? 'yangi' : ''} ${belgi === s ? 'belgi' : ''}`}>{ustun.map(u => <td key={u}>{dbQiymat(u, s)}</td>)}</tr>)
            : <tr><td colSpan={ustun.length} className="mc-bosh">{tr({ uz: "bo'sh", ru: 'пусто' })}</td></tr>}
        </tbody>
      </table>
    </div>
  </div>
);
// Ega sahifasi (brauzer): parol '' | 'xato' | 'ok' · xabar 'kirish' | 'xato' · qatorlar — ro'yxat (soat · ism · telefon) · yangi — ajralib kirgan qator
const EgaSahifa = ({ manzil = `${SAHIFA}/ega`, parol, xabar, qatorlar = [], yangi, katta }) => (
  <div className={`mc-ega ${katta ? 'katta' : ''}`}>
    <div className="mc-tel-bar"><i /><i /><i /><span>{manzil}</span></div>
    <div className="mc-ega-tana">
      <span className={`mc-input mc-parol ${parol || ''}`}>{parol ? '••••••' : tr({ uz: 'parol', ru: 'пароль' })}</span>
      {xabar && <p key={xabar} className="mc-belgi rad">{xabar === 'kirish' ? tr({ uz: 'Avval parolni kiriting', ru: 'Сначала введите пароль' }) : tr({ uz: "Parol noto'g'ri", ru: 'Неверный пароль' })}</p>}
      <b className="mc-ega-h">{tr({ uz: 'Shanba · bandlar', ru: 'Суббота · брони' })}</b>
      {qatorlar.length
        ? <ul className="mc-ega-ro">{qatorlar.map(s => <li key={s} className={yangi === s ? 'yangi' : ''}>{s} · {MAYDON.odam[s].ism} · {MAYDON.odam[s].tel}</li>)}</ul>
        : <span className="mc-ega-bosh" />}
    </div>
  </div>
);
// Umami'dagi uch qadam: sonlar [n, n, n] · faqat — ko'rinadigan qadamlar · yondi — yangi son · navbat — sonlar navbat bilan yonadi
const UmamiQadam = ({ sonlar, yorliqlar = MAYDON.umami, faqat, yondi, navbat }) => (
  <div className={`mc-umami ${navbat ? 'navbat' : ''}`}>
    <span className="mc-tugun-n">Umami</span>
    <div className="mc-umami-q">
      {yorliqlar.map((y, i) => (!faqat || faqat.includes(i)) && (
        <React.Fragment key={i}>
          {i > 0 && !faqat && <span className="mc-umami-s">→</span>}
          <span className={`mc-umami-k ${yondi === i ? 'yondi' : ''}`} style={navbat ? { animationDelay: `${0.25 + i * 0.45}s` } : undefined}><small>{fmtCode(tr(y))}</small><b key={sonlar[i]}>{sonlar[i]}</b></span>
        </React.Fragment>
      ))}
    </div>
  </div>
);
// Ballsiz bashorat (181): tanlangach YOPILMAYDI — ixcham qator natija chiqquncha turadi (SABOQ 11)
const TaxminIxcham = ({ savol, variant }) => (
  <div className="mc-taxmin">
    <span className="q-yorliq">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span>
    <span className="mc-taxmin-s">{savol}</span>
    <b className="mc-taxmin-j">{variant}</b>
  </div>
);
const taxminQator = (variantlar, taxmin, togriK, haqiqat) => {
  const tx = variantlar.find(v => v.k === taxmin);
  if (!tx) return null;
  return (
    <QTaxmin togri={taxmin === togriK}>{taxmin === togriK
      ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение верно' })
      : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(haqiqat)}</b></>}</QTaxmin>
  );
};
const bashoratQismi = (savol, variantlar, taxmin, setTaxmin, done) => (!taxmin
  ? <div className="mc-navbat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
  : !done && <TaxminIxcham savol={tr(savol)} variant={tr(variantlar.find(v => v.k === taxmin).t)} />);

// ===== SCREEN 0 — KIRISH (QKirish: «Maydon» telefoni + MVP ro'yxati, agent to'lovni taklif qiladi → radio; sof so'rovnoma, J-026) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "To'lov va jamoa yig'ish ham qo'shilganda", ru: 'Когда добавятся ещё оплата и сбор команды' } },
  { id: 'b', label: { uz: "«Qilamiz» qutisidagi funksiyalar ishlaganda", ru: 'Когда работают функции из коробки «делаем»' } },
  { id: 'c', label: { uz: "Ko'rinishi namunadagidek mukammal bo'lganda", ru: 'Когда вид идеален, как в образце' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const pick = (v) => { if (picked !== null) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const tanlandi = picked !== null;
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!tanlandi} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>«Maydon»ni <span className="italic" style={{ color: T.accent }}>qachon tayyor</span> deyish mumkin?</>, ru: <>Когда <span className="italic" style={{ color: T.accent }}>можно назвать «Maydon» готовым</span>?</> })}
        mentor={<Mentor>{tr({ uz: "Kataklar Backend'dan keladi, lekin hali hech kim maydonni band qila olmaydi. Agent esa to'lov tugmasini ham qo'shishni taklif qilyapti.", ru: 'Ячейки приходят из Backend, но пока никто не может забронировать поле. А агент предлагает добавить ещё и кнопку оплаты.' })}</Mentor>}
        maket={(
          <div className={`mc-hook ${tanlandi ? '' : 'tanla'}`}>
            <div className="mc-hook-r">
              <Telefon tanlangan={tanlandi ? '18:00' : undefined} tugma="xira" />
              <div className="mc-chat">
                <span className="mc-chat-kim">Antigravity</span>
                <p className="mc-pufak">{tr({ uz: "To'lovni ham qo'shaymi?", ru: 'Добавить ещё и оплату?' })}</p>
              </div>
            </div>
            <MvpQator holat={{ kataklar: 'ok', band: tanlandi ? 'on' : undefined, ega: tanlandi ? 'on' : undefined }} />
          </div>
        )}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
        javob={tanlandi && <p className="hook-ack fade-step">{picked === 'b'
          ? tr({ uz: <><b>Aynan!</b> Biz belgilagan shu versiya «qilamiz» qutisi ishlaganda tayyor. Bugun qolgan ikkitasini quramiz.</>, ru: <><b>Именно!</b> Эта версия, которую мы наметили, готова, когда работает коробка «делаем». Сегодня строим оставшиеся две.</> })
          : picked === 'a'
            ? tr({ uz: <><b>Qiziq fikr!</b> To'lov va jamoa yig'ish — «keyin» qutisida. Avval odam maydonni band qila olishi kerak.</>, ru: <><b>Интересная мысль!</b> Оплата и сбор команды — в коробке «потом». Сначала человек должен суметь забронировать поле.</> })
            : tr({ uz: <><b>Qiziq fikr!</b> Ko'rinishni 8-darsda tanladingiz. Tayyorlikni esa «qilamiz» qutisi o'lchaydi.</>, ru: <><b>Интересная мысль!</b> Вид вы выбрали на 8-м уроке. А готовность измеряет коробка «делаем».</> })}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda dars oxiridagi «Maydon» — telefon, sayt → Backend → Database, ega sahifasi; bir marta o'zi yuradi, DE-200) =====
const REJA = [
  { h: { uz: 'Band qilish', ru: 'Бронирование' }, t: { uz: "o'yinchi bo'sh katakni bosadi, band Database'ga yoziladi", ru: 'игрок нажимает свободную ячейку, бронь записывается в Database' } },
  { h: { uz: 'Ega sahifasi', ru: 'Страница владельца' }, t: { uz: "bandlar ro'yxati faqat parol bilan ochiladi", ru: 'список броней открывается только по паролю' } },
  { h: { uz: 'Internetga chiqarish', ru: 'Выход в интернет' }, t: { uz: 'sayt va Backend internetda, telefondan ochiladi', ru: 'сайт и Backend в интернете, открываются с телефона' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [bosq, setBosq] = useState(0); // 0 — 19:00 bo'sh · 1 — bosildi · 2 — Backend'da · 3 — Database'da · 4 — band, ega ro'yxatida
  const [k, setK] = useState(null);
  const ketma = useKetma();
  useEffect(() => {
    ketma([
      [1300, () => setBosq(1)],
      [500, () => { setBosq(2); setK({ id: 'r1', yon: 'ong' }); }],
      [900, () => { setBosq(3); setK({ id: 'r2', yon: 'ong', h: 'ok' }); }],
      [900, () => { setBosq(4); setK(null); }]
    ]);
  }, []); // eslint-disable-line
  const tayyor = bosq >= 4;
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Dars oxirida «Maydon» <span className="italic" style={{ color: T.accent }}>telefonda shunday ishlaydi</span>.</>, ru: <>К концу урока «Maydon» <span className="italic" style={{ color: T.accent }}>так работает на телефоне</span>.</> })}
        mentor={<Mentor>{tr({ uz: "«Maydon»ni birga quramiz, har blok oxirida esa shu talabni o'z g'oyangizga yozasiz.", ru: '«Maydon» строим вместе, а в конце каждого блока пишете это требование для своей идеи.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={(
          <div className="mc-reja">
            <MvpQator holat={{ kataklar: 'ok', band: 'ok', ega: 'ok' }} />
            <div className="mc-reja-r">
              <Telefon manzil={NETLIFY} band={tayyor ? ['19:00', '21:00'] : ['21:00']} tanlangan={bosq >= 1 ? '19:00' : undefined} belgi={tayyor ? 'ok' : undefined} />
              <div className="mc-reja-o">
                <div className="mc-strip">
                  <span className={`mc-strip-n ${bosq === 2 ? 'on' : ''}`}>Backend</span>
                  <Yol k={k} />
                  <span className={`mc-strip-n ${bosq === 3 ? 'on' : ''}`}>Database</span>
                </div>
                <EgaSahifa manzil={`${NETLIFY}/ega`} parol="ok" qatorlar={tayyor ? ['19:00', '21:00'] : ['21:00']} yangi={tayyor ? '19:00' : undefined} />
              </div>
            </div>
          </div>
        )}
        ongYorliq={tr({ uz: 'Bugungi 3 qadam', ru: '3 шага на сегодня' })}
        qadamlar={REJA.map(r => ({ t: <><b>{tr(r.h)}</b> — {fmtCode(tr(r.t))}</> }))}
      >
        <p className="mc-repo">{tr({ uz: "repo maydon · boshlang'ich holat dars-09-start · tayyor namuna dars-09-done", ru: 'репо maydon · начальное состояние dars-09-start · готовый образец dars-09-done' })}</p>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA 1 · BAND QILISH (QTushuncha keng: bashorat → ikki telefondan navbat bilan band → Backend tekshiradi → 409; tugagach xarita fokusda, DE-199) =====
const S2_SAVOL = { uz: "Ikkinchi band ham Database'ga yoziladimi?", ru: 'Запишется ли вторая бронь в Database?' };
const S2_TAXMIN = [
  { k: 'ha', t: { uz: 'Ha, ikkalasi ham yoziladi', ru: 'Да, запишутся обе' } },
  { k: 'yoq', t: { uz: "Yo'q, bittasi rad etiladi", ru: 'Нет, одну отклонят' } }
];
const SOROV = '{ kun, soat, ism, telefon }';
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [t1, setT1] = useState(avval ? 2 : 0); // 1-telefon: 0 — kutadi · 1 — so'rov yo'lda · 2 — tugadi
  const [t2, setT2] = useState(avval ? 2 : 0);
  const [faol, setFaol] = useState(0);
  const [k1, setK1] = useState(null); // telefon ↔ Backend
  const [k2, setK2] = useState(null); // Backend ↔ Database
  const [be, setBe] = useState(avval ? { yol: 'err', rad: true, tek: { k: 2, h: 'err', t: { uz: '18:00 — band ✕', ru: '18:00 — занято ✕' } } } : {});
  const [db, setDb] = useState(avval ? ['18:00'] : []);
  const [dbYangi, setDbYangi] = useState(null);
  const [dbBelgi, setDbBelgi] = useState(null);
  const [umami, setUmami] = useState(avval ? 1 : 0);
  const ketma = useKetma();
  const done = t2 === 2;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const band1 = () => {
    if (!taxmin || t1) return;
    setT1(1); setFaol(1);
    ketma([
      [0, () => { setK1({ id: 'a1', yon: 'ong', t: SOROV }); setBe({ yol: 'on' }); }],
      [1000, () => { setK1(null); setK2({ id: 'b1', yon: 'past', t: '18:00 ?' }); }],
      [900, () => { setK2(null); setBe({ yol: 'on', tek: { k: 1, h: 'ok', t: { uz: "18:00 — bo'sh ✓", ru: '18:00 — свободно ✓' } } }); }],
      [700, () => { setDb(['18:00']); setDbYangi('18:00'); }],
      [800, () => setK1({ id: 'a2', yon: 'chap', t: { uz: 'javob', ru: 'ответ' }, h: 'ok' })],
      [1000, () => { setK1(null); setT1(2); setFaol(0); setUmami(1); setBe({ yol: 'ok', tek: { k: 1, h: 'ok', t: { uz: "18:00 — bo'sh ✓", ru: '18:00 — свободно ✓' } } }); }]
    ]);
  };
  const band2 = () => {
    if (t1 !== 2 || t2) return;
    setT2(1); setFaol(2); setDbYangi(null);
    ketma([
      [0, () => { setK1({ id: 'a3', yon: 'ong', t: SOROV }); setBe({ yol: 'on' }); }],
      [1000, () => { setK1(null); setK2({ id: 'b2', yon: 'past', t: '18:00 ?' }); }],
      [900, () => { setK2(null); setDbBelgi('18:00'); setBe({ yol: 'err', rad: true, tek: { k: 2, h: 'err', t: { uz: '18:00 — band ✕', ru: '18:00 — занято ✕' } } }); }],
      [900, () => setK1({ id: 'a4', yon: 'chap', t: '409 · Bu vaqt band', h: 'err' })],
      [1100, () => { setK1(null); setT2(2); setFaol(0); }]
    ]);
  };
  const tel1 = (
    <Telefon yorliq={tr({ uz: '1-telefon', ru: 'Телефон 1' })} band={t1 === 2 ? ['18:00'] : []} tanlangan="18:00" faol={faol === 1}
      forma={t1 < 2 && { ism: 'Jasur', tel: '+998 90 000 00 03' }} tugma={t1 === 2 ? null : taxmin && !t1 ? 'navbat' : 'xira'} onBand={band1} belgi={t1 === 2 ? 'ok' : undefined} />
  );
  const tel2 = (
    <Telefon yorliq={tr({ uz: '2-telefon', ru: 'Телефон 2' })} band={t2 === 2 ? ['18:00'] : []} tanlangan="18:00" faol={faol === 2} eski={t1 === 2 && t2 < 2 ? '18:00' : undefined}
      forma={t2 < 2 && { ism: 'Bekzod', tel: '+998 90 000 00 04' }} tugma={t2 === 2 ? null : t1 === 2 && !t2 ? 'navbat' : 'xira'} onBand={band2} belgi={t2 === 2 ? 'rad' : undefined} />
  );
  const xarita = (
    <div className="mc-xarita">
      <div className="mc-tellar">{tel1}{tel2}</div>
      <Yol k={k1} />
      <div className="mc-ustun">
        <BackendQuti korinadi={['bandlar']} holat={{ bandlar: be.yol }} tekshiruv={be.tek} rad={be.rad} />
        <Yol tik k={k2} />
        <DbJadval qatorlar={db} yangi={dbYangi} belgi={dbBelgi} />
        <UmamiQadam faqat={[2]} sonlar={[0, 0, umami]} yondi={umami ? 2 : undefined} />
      </div>
    </div>
  );
  const n = (t1 === 2 ? 1 : 0) + (t2 === 2 ? 1 : 0);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · band qilish', ru: 'Понятие · бронирование' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Ikkala telefondan band qiling (${n}/2)`, ru: `Забронируйте с обоих телефонов (${n}/2)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ikki o'yinchi bitta katakni band qilsa, <span className="italic" style={{ color: T.accent }}>kim oladi?</span></>, ru: <>Если два игрока бронируют одну ячейку, <span className="italic" style={{ color: T.accent }}>кому она достанется?</span></> })}
        mentor={<Mentor>{tr({ uz: "Ikkala telefonda 18:00 hozir bo'sh ko'rinadi. Avval birinchisidan, keyin ikkinchisidan band qiling.", ru: 'На обоих телефонах 18:00 сейчас выглядит свободным. Забронируйте сначала с первого, потом со второго.' })}</Mentor>}
        bashorat={bashoratQismi(S2_SAVOL, S2_TAXMIN, taxmin, setTaxmin, done)}
        vizual={xarita}
        natija={done && taxminQator(S2_TAXMIN, taxmin, 'yoq', { uz: 'ikkinchi band yozilmadi — Backend rad etdi', ru: 'вторая бронь не записалась — Backend отклонил' })}
        xulosa={done && fk(tr({ uz: "Backend tekshiradi, Database bir katakni ikki marta yozdirmaydi. `band-qildi` faqat band saqlangach yoziladi.", ru: 'Backend проверяет, Database не даст записать одну ячейку дважды. `band-qildi` пишется только после сохранения брони.' }))}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1 — B; variantlar bir shaklda «Qism — qanday») =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Ikki o'yinchi bir vaqtda 18:00 ni bosdi. Qaysi qism hal qiladi?"
    question={tr({ uz: <><h2 className="title h-ask">Ikki o'yinchi bir vaqtda 18:00 ni bosdi. <span className="italic" style={{ color: T.accent }}>Qaysi qism hal qiladi?</span></h2></>, ru: <><h2 className="title h-ask">Два игрока одновременно нажали 18:00. <span className="italic" style={{ color: T.accent }}>Какая часть решает?</span></h2></> })}
    options={[
      { uz: "Sayt — qaysi telefon birinchi bosganini ko'rib", ru: 'Сайт — глядя, какой телефон нажал первым' },
      { uz: "Backend — yozishdan oldin Database'ni ko'rib", ru: 'Backend — заглянув в Database перед записью' },
      { uz: 'Umami — har `vaqt-tanladi` hodisasini sanab', ru: 'Umami — посчитав каждое событие `vaqt-tanladi`' },
      { uz: "Maydon egasi — Database'dagi ro'yxatni ko'rib", ru: 'Владелец поля — посмотрев список в Database' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Backend tekshiradi; ikki so\'rov bir lahzada kelsa ham Database ikkinchisini yozdirmaydi.', ru: 'Проверяет Backend; даже если два запроса придут в одно мгновение, Database не даст записать второй.' }}
    explainWrong={{
      0: { uz: "Har telefon faqat o'zini biladi — boshqasini ko'rmaydi.", ru: 'Каждый телефон знает только себя — другого не видит.' },
      2: { uz: "Umami hodisani sanaydi, bandni to'xtatmaydi.", ru: 'Umami считает события, бронь не останавливает.' },
      3: { uz: "Ega ro'yxatni keyin ko'radi — o'shanda ikkalasi yozilgan.", ru: 'Владелец видит список потом — тогда обе уже записаны.' },
      default: { uz: "Har telefon faqat o'zini biladi — boshqasini ko'rmaydi.", ru: 'Каждый телефон знает только себя — другого не видит.' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA 2 · EGA SAHIFASI (QTushuncha keng: bashorat → uch xil kirish navbat bilan → qulf qizil / yashil → ro'yxat; tugagach qulf fokusda) =====
const S4_SAVOL = { uz: "Ega sahifasi manzilini bilgan odam bandlar ro'yxatini ko'radimi?", ru: 'Увидит ли список броней тот, кто знает адрес страницы владельца?' };
const S4_TAXMIN = [
  { k: 'ha', t: { uz: 'Ha, manzil yetadi', ru: 'Да, адреса достаточно' } },
  { k: 'yoq', t: { uz: "Yo'q, yana nimadir kerak", ru: 'Нет, нужно что-то ещё' } }
];
const KIRISH = [
  { id: 'parolsiz', t: { uz: 'Parolsiz', ru: 'Без пароля' } },
  { id: 'xato', t: { uz: "Noto'g'ri parol", ru: 'Неверный пароль' } },
  { id: 'togri', t: { uz: "To'g'ri parol", ru: 'Верный пароль' } }
];
const EGA_QATOR = ['17:00', '18:00', '20:00'];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qilindi, setQilindi] = useState(avval ? 3 : 0); // nechta kirish tugadi (navbat bilan)
  const [jarayon, setJarayon] = useState(false);
  const [k1, setK1] = useState(null); // ega sahifasi ↔ Backend
  const [k2, setK2] = useState(null); // Backend ↔ Database
  const [be, setBe] = useState(avval ? { kirish: 'ok', royxat: 'ok', qulf: 'ok', env: 'ok' } : { env: null });
  const [ega, setEga] = useState(avval ? { parol: 'ok', qatorlar: EGA_QATOR } : { qatorlar: [] });
  const [dbBelgi, setDbBelgi] = useState(null);
  const [oyinchi, setOyinchi] = useState(false);
  const ketma = useKetma();
  const done = qilindi >= 3;
  const tugadi = useTugadi(done, 1800, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const kir = (id) => {
    const i = KIRISH.findIndex(x => x.id === id);
    if (!taxmin || jarayon || i !== qilindi) return;
    setJarayon(true); setDbBelgi(null);
    const tamom = () => { setK1(null); setJarayon(false); setQilindi(i + 1); };
    if (id === 'parolsiz') ketma([
      [0, () => { setEga({ qatorlar: [] }); setBe({ env: null, royxat: 'on' }); setK1({ id: 'p1', yon: 'ong', t: 'GET /bandlar' }); }],
      [1000, () => { setK1(null); setBe({ env: null, royxat: 'err', qulf: 'err' }); }],
      [700, () => setK1({ id: 'p2', yon: 'chap', t: '401', h: 'err' })],
      [1000, () => { setEga({ xabar: 'kirish', qatorlar: [] }); tamom(); }]
    ]);
    if (id === 'xato') ketma([
      [0, () => { setEga({ parol: 'xato', qatorlar: [] }); setBe({ env: null, kirish: 'on' }); setK1({ id: 'x1', yon: 'ong', t: 'POST /kirish' }); }],
      [1000, () => { setK1(null); setBe({ env: 'err', kirish: 'err' }); }],
      [700, () => setK1({ id: 'x2', yon: 'chap', t: '401', h: 'err' })],
      [1000, () => { setEga({ parol: 'xato', xabar: 'xato', qatorlar: [] }); tamom(); }]
    ]);
    if (id === 'togri') ketma([
      [0, () => { setEga({ parol: 'ok', qatorlar: [] }); setBe({ env: null, kirish: 'on' }); setK1({ id: 't1', yon: 'ong', t: 'POST /kirish' }); }],
      [1000, () => { setK1(null); setBe({ env: 'ok', kirish: 'ok' }); }],
      [600, () => setK1({ id: 't2', yon: 'chap', t: 'token', h: 'ok' })],
      [1000, () => { setK1({ id: 't3', yon: 'ong', t: 'GET /bandlar + token' }); setBe({ env: 'ok', kirish: 'ok', royxat: 'on' }); }],
      [1000, () => { setK1(null); setBe({ env: 'ok', kirish: 'ok', royxat: 'ok', qulf: 'ok' }); setK2({ id: 't4', yon: 'past' }); }],
      [800, () => { setK2(null); setDbBelgi('all'); setK1({ id: 't5', yon: 'chap', t: { uz: 'uch qator', ru: 'три строки' }, h: 'ok' }); }],
      [1000, () => { setK1(null); setEga({ parol: 'ok', qatorlar: EGA_QATOR.slice(0, 1), yangi: '17:00' }); }],
      [380, () => setEga({ parol: 'ok', qatorlar: EGA_QATOR.slice(0, 2), yangi: '18:00' })],
      [380, () => setEga({ parol: 'ok', qatorlar: EGA_QATOR, yangi: '20:00' })],
      [700, () => { setOyinchi(true); tamom(); }]
    ]);
  };
  const navbatId = taxmin && !jarayon && !done ? KIRISH[qilindi].id : null;
  const xarita = (
    <div className="mc-xarita s4">
      <EgaSahifa parol={ega.parol} xabar={ega.xabar} qatorlar={ega.qatorlar} yangi={ega.yangi} />
      <Yol k={k1} />
      <div className="mc-ustun">
        <BackendQuti korinadi={['kirish', 'royxat']} holat={{ kirish: be.kirish, royxat: be.royxat }} qulf={be.qulf} env={be.env} />
        <Yol tik k={k2} />
        <DbJadval qatorlar={EGA_QATOR} yangi={dbBelgi === 'all' ? EGA_QATOR : undefined} />
      </div>
      <div className="mc-oyinchi">
        <span className="mc-tugun-n">{tr({ uz: "o'yinchi telefoni", ru: 'телефон игрока' })}</span>
        <code className="mc-oyinchi-y">GET /vaqtlar</code>
        <span key={oyinchi ? 'y' : 'n'} className={`mc-oyinchi-q ${oyinchi ? 'yondi' : ''}`}>18:00 · band</span>
      </div>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ega sahifasi', ru: 'Понятие · страница владельца' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Uch xil kiring (${qilindi}/3)`, ru: `Войдите тремя способами (${qilindi}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>O'yinchilarning telefon raqamini <span className="italic" style={{ color: T.accent }}>kim ko'ra oladi?</span></>, ru: <>Кто может видеть <span className="italic" style={{ color: T.accent }}>номера телефонов игроков?</span></> })}
        mentor={<Mentor>{fk(tr({ uz: "Ism va telefon `bandlar` jadvalida turadi, o'yinchi sahifasiga esa faqat soat va holat boradi. Ega sahifasiga uch xil kirib ko'ring.", ru: 'Имя и телефон лежат в таблице `bandlar`, а на страницу игрока уходят только час и состояние. Войдите на страницу владельца тремя способами.' }))}</Mentor>}
        bashorat={bashoratQismi(S4_SAVOL, S4_TAXMIN, taxmin, setTaxmin, done)}
        harakat={taxmin && (
          <div className="mc-kirish">
            {KIRISH.map((x, i) => (
              <QTugma key={x.id} ikkinchi className={`mc-kirish-b ${i < qilindi ? 'bajarildi' : ''} ${navbatId === x.id ? 'mc-navbat' : ''}`} disabled={navbatId !== x.id} onClick={() => kir(x.id)}>
                {i < qilindi ? '✓ ' : ''}{tr(x.t)}
              </QTugma>
            ))}
          </div>
        )}
        vizual={xarita}
        natija={done && taxminQator(S4_TAXMIN, taxmin, 'yoq', { uz: "manzil yetmadi — ro'yxat faqat token bilan keldi", ru: 'адреса не хватило — список пришёл только с токеном' })}
        xulosa={done && fk(tr({ uz: "Ega sahifasi manzili sir emas. Ro'yxatni Backend faqat token bilan beradi, parol `.env` da turadi.", ru: 'Адрес страницы владельца — не секрет. Список Backend отдаёт только по токену, пароль лежит в `.env`.' }))}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s5 = 2 — C; «Ha/Yo'q — sabab», Ha va Yo'q 2/2) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Ega sahifasi kodini kimdir GitHub'da o'qidi. Bandlar ro'yxatini ocha oladimi?"
    question={tr({ uz: <><h2 className="title h-ask">Ega sahifasi kodini kimdir GitHub'da o'qidi. <span className="italic" style={{ color: T.accent }}>Bandlar ro'yxatini ocha oladimi?</span></h2></>, ru: <><h2 className="title h-ask">Кто-то прочитал код страницы владельца на GitHub. <span className="italic" style={{ color: T.accent }}>Сможет ли он открыть список броней?</span></h2></> })}
    options={[
      { uz: 'Ha — sahifa kodida token ham yozilgan', ru: 'Да — в коде страницы записан и токен' },
      { uz: 'Ha — kodda `GET /bandlar` manzili bor', ru: 'Да — в коде есть адрес `GET /bandlar`' },
      { uz: "Yo'q — tokensiz `GET /bandlar` 401 qaytaradi", ru: 'Нет — без токена `GET /bandlar` вернёт 401' },
      { uz: "Yo'q — `.env` fayli kodni yashirib turadi", ru: 'Нет — файл `.env` прячет код' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Kodni o'qish yetmaydi: Backend ro'yxatni faqat to'g'ri token bilan beradi.", ru: 'Прочитать код мало: Backend отдаёт список только с верным токеном.' }}
    explainWrong={{
      0: { uz: 'Token kodda turmaydi — u kirgandan keyin beriladi.', ru: 'Токена в коде нет — его выдают после входа.' },
      1: { uz: 'Manzilni bilish yetmaydi — tokensiz `401` qaytadi.', ru: 'Знать адрес мало — без токена вернётся `401`.' },
      3: { uz: '`.env` parol kabi qiymatlarni saqlaydi, kodni emas.', ru: '`.env` хранит значения вроде пароля, а не код.' },
      default: { uz: 'Manzilni bilish yetmaydi — tokensiz `401` qaytadi.', ru: 'Знать адрес мало — без токена вернётся `401`.' }
    }} />
);

// ===== 🏅 BADGES (nishonlar, 3) — ikki test + bitta amaliyot-bonus (172.4: A3 oxirgi «Bajardim», birinchi urinish sharti yo'q) =====
const ACHIEVEMENTS = {
  oneBooking: { icon: '📅', name: 'One Booking', desc: { uz: 'Bitta katakka bitta band yozilishini topdingiz', ru: 'Вы нашли, что на одну ячейку записывается одна бронь' } },
  safePassword: { icon: '🔐', name: 'Safe Password', desc: { uz: 'Parol kodda emas, .env da turishini topdingiz', ru: 'Вы нашли, что пароль хранится не в коде, а в .env' } },
  mvpLive: { icon: '🚀', name: 'MVP Live', desc: { uz: 'Uch amaliyot blokini oxirigacha bajardingiz', ru: 'Вы прошли три блока практики до конца' } }
};
// Ekran id → nishon: s3, s5 — test (to'g'ri javob, birinchi urinish) · a3 — bonus (oxirgi «Bajardim»)
const ACH_TRIGGERS = { s3: 'oneBooking', s5: 'safePassword', a3: 'mvpLive' };

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
  4: { uz: "1 — Bo'sh katakni kim tekshiradi", ru: '1 — Кто проверяет свободную ячейку' },
  7: { uz: '2 — Parol qayerda turadi', ru: '2 — Где хранится пароль' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (MD «Fon so'zlari», R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'sayt', ru: 'сайт' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: 'Backend', l: 84, t: 8, s: 24, d: 23, dl: 1.5 },
  { ch: 'Database', l: 8, t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: { uz: 'vaqt katagi', ru: 'ячейка времени' }, l: 66, t: 70, s: 22, d: 21, dl: 2.2 },
  { ch: { uz: 'band', ru: 'бронь' }, l: 42, t: 86, s: 26, d: 25, dl: 1.1 },
  { ch: { uz: 'token', ru: 'токен' }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: '.env', l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'deploy', ru: 'деплой' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'hodisa', ru: 'событие' }, l: 90, t: 44, s: 22, d: 22, dl: 0.6 },
  { ch: { uz: 'talab', ru: 'требование' }, l: 50, t: 6, s: 22, d: 24, dl: 1.3 },
  { ch: 'MVP', l: 3, t: 46, s: 24, d: 19, dl: 2.4 },
  { ch: 'Umami', l: 34, t: 58, s: 22, d: 26, dl: 0.2 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol MD dan, ✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3, q23)
const QUIZ_BANK = [
  { q: { uz: 'MVP qachon tayyor deyiladi?', ru: 'Когда MVP называют готовым?' }, opts: [{ uz: '«Qilamiz» qutisidagi funksiyalar ishlaganda', ru: 'Когда работают функции из коробки «делаем»' }, { uz: '«Keyin» qutisidagi funksiyalar ham qo\'shilganda', ru: 'Когда добавлены и функции из коробки «потом»' }, { uz: "Har bir tugma va rang mukammal bo'lganda", ru: 'Когда каждая кнопка и цвет идеальны' }, { uz: "Birinchi o'yinchi pul to'lab bo'lganda", ru: 'Когда первый игрок уже заплатил' }], correct: 0 },
  { q: { uz: "Agent «To'lovni ham qo'shaymi?» desa, nima deysiz?", ru: 'Агент спрашивает «Добавить ещё и оплату?». Что ответите?' }, opts: [{ uz: "Ha — o'yinchiga qulayroq bo'ladi", ru: 'Да — игроку будет удобнее' }, { uz: "Yo'q — to'lov «keyin» qutisida", ru: 'Нет — оплата в коробке «потом»' }, { uz: "Ha — to'lovsiz band qilib bo'lmaydi", ru: 'Да — без оплаты не забронировать' }, { uz: "Yo'q — to'lov «qilmaymiz» qutisida", ru: 'Нет — оплата в коробке «не делаем»' }], correct: 1 },
  { q: { uz: "Bo'sh katakni band qilishdan oldin kim tekshiradi?", ru: 'Кто проверяет свободную ячейку перед бронью?' }, opts: [{ uz: 'Sayt — telefondagi katak rangiga qarab', ru: 'Сайт — по цвету ячейки на телефоне' }, { uz: 'Umami — `vaqt-tanladi` soniga qarab', ru: 'Umami — по числу `vaqt-tanladi`' }, { uz: "Backend — Database'dagi bandlarga qarab", ru: 'Backend — по броням в Database' }, { uz: "Maydon egasi — bandlar ro'yxatiga qarab", ru: 'Владелец поля — по списку броней' }], correct: 2 },
  { q: { uz: 'Katak band bo\'lsa, `POST /bandlar` nima qiladi?', ru: 'Что делает `POST /bandlar`, если ячейка занята?' }, opts: [{ uz: 'Ikkinchi bandni ham jadvalga yozadi', ru: 'Записывает в таблицу и вторую бронь' }, { uz: "Eski bandni o'chirib, yangisini yozadi", ru: 'Удаляет старую бронь и пишет новую' }, { uz: "Ikkala o'yinchiga «Band qilindi» deydi", ru: 'Говорит обоим игрокам «Забронировано»' }, { uz: '«Bu vaqt band» deb, bandni yozmaydi', ru: 'Отвечает «Это время занято» и не пишет бронь' }], correct: 3 },
  { q: { uz: '`band-qildi` hodisasi qachon yoziladi?', ru: 'Когда записывается событие `band-qildi`?' }, opts: [{ uz: "Band Database'ga saqlangandan keyin", ru: 'После сохранения брони в Database' }, { uz: '«Band qilish» tugmasi bosilishi bilan', ru: 'Как только нажата кнопка «Band qilish»' }, { uz: 'Sahifa birinchi marta ochilganda', ru: 'Когда страница открылась в первый раз' }, { uz: "Maydon egasi ro'yxatni ochganda", ru: 'Когда владелец поля открыл список' }], correct: 0 },
  { q: { uz: "O'yinchi sahifasida bandlar haqida nima ko'rinadi?", ru: 'Что о бронях видно на странице игрока?' }, opts: [{ uz: 'Har bandning ismi va telefoni', ru: 'Имя и телефон каждой брони' }, { uz: 'Har katakning soati va holati', ru: 'Час и состояние каждой ячейки' }, { uz: 'Ega paroli va kirish tokeni', ru: 'Пароль владельца и токен входа' }, { uz: "Hamma o'yinchining telefon raqami", ru: 'Номера телефонов всех игроков' }], correct: 1 },
  { q: { uz: "`GET /bandlar` ga tokensiz so'rov kelsa, nima bo'ladi?", ru: 'Что будет, если в `GET /bandlar` придёт запрос без токена?' }, opts: [{ uz: "Ro'yxatni to'liq qaytaradi", ru: 'Вернёт весь список' }, { uz: 'Faqat ismlarni qaytaradi', ru: 'Вернёт только имена' }, { uz: "401 qaytaradi, ro'yxat bermaydi", ru: 'Вернёт 401, список не отдаст' }, { uz: "Ega sahifasini o'zi ochadi", ru: 'Сам откроет страницу владельца' }], correct: 2 },
  { q: { uz: 'Maydon egasining paroli qayerda turadi?', ru: 'Где хранится пароль владельца поля?' }, opts: [{ uz: 'Saytning kodida, tugma yonida', ru: 'В коде сайта, рядом с кнопкой' }, { uz: "GitHub'dagi README faylida", ru: 'В файле README на GitHub' }, { uz: 'Talab matnida, agentga berilib', ru: 'В тексте требования, переданном агенту' }, { uz: '`.env` da va Render sozlamasida', ru: 'В `.env` и в настройках Render' }], correct: 3 },
  { q: { uz: 'Talab qaysi uch qismdan iborat?', ru: 'Из каких трёх частей состоит требование?' }, opts: [{ uz: 'Qayerda · nima qilsin · nima buzilmasin', ru: 'Где · что сделать · что не сломать' }, { uz: 'Kim · qachon · qancha vaqt oladi', ru: 'Кто · когда · сколько времени займёт' }, { uz: 'Muammo · yechim · foydalanuvchi', ru: 'Проблема · решение · пользователь' }, { uz: 'Rang · shrift · animatsiya turi', ru: 'Цвет · шрифт · тип анимации' }], correct: 0 },
  { q: { uz: "Talabdagi «nima buzilmasin» qatoriga nima yoziladi?", ru: 'Что пишут в строке «что не сломать»?' }, opts: [{ uz: "Yangi qo'shiladigan funksiya", ru: 'Новую добавляемую функцию' }, { uz: "O'zgarmay qolishi kerak bo'lgan ish", ru: 'Работу, которая должна остаться прежней' }, { uz: 'Terminalda chiqqan xato matni', ru: 'Текст ошибки из терминала' }, { uz: 'Ertaga qilinadigan ishlar rejasi', ru: 'План дел на завтра' }], correct: 1 },
  { q: { uz: 'MVP nega internetga chiqariladi?', ru: 'Зачем выкладывать MVP в интернет?' }, opts: [{ uz: 'Laptopda tezroq ishlashi uchun', ru: 'Чтобы быстрее работал на ноутбуке' }, { uz: "Kodi qisqaroq bo'lishi uchun", ru: 'Чтобы код стал короче' }, { uz: 'Boshqa odam telefonda ochishi uchun', ru: 'Чтобы другой человек открыл его на телефоне' }, { uz: 'Umami hodisalarni yozishi uchun', ru: 'Чтобы Umami записывал события' }], correct: 2 },
  { q: { uz: "Bepul Render'da birinchi javob nega kechikadi?", ru: 'Почему на бесплатном Render первый ответ запаздывает?' }, opts: [{ uz: "Neon Database'da joy tugab qolgan", ru: 'В Neon Database кончилось место' }, { uz: "Sayt kodi juda katta bo'lib ketgan", ru: 'Код сайта стал слишком большим' }, { uz: 'Netlify havolasi eskirib qolgan', ru: 'Ссылка Netlify устарела' }, { uz: "Jimlikdan keyin Backend uyg'onadi", ru: 'После простоя Backend просыпается' }], correct: 3 }
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
// Har blok — ScreenBlok'ga ma'lumot: steps [{ h, t, prompt?: [satr], kimga?, err?, forma?: true, ixtiyoriy?: true }] · natija (tugadi => maket) · ortda (K10).
// 9-Modul (qaror 8, GATE M M-q1): blok 5 qadam — 5-qadam «O'z g'oyangiz»: uch qatorli forma (talab qismlari). Qolipda forma turi yo'q — shu ulagichda (GoyaForma):
//   qiymat answers[ekran].goya da (ccProgress), «Nusxalash» bor, «Bajardim» uchala qator yozilgach ochiladi (JS qulf + CSS :has);
//   ixtiyoriy (A2: «yo'q bo'lsa, «Bajardim»ni bosing») — qulfsiz.
// «Ortda qoldingizmi» (K10, tayanch 3): birinchi blokda dars-09-start, keyingilarida dars-09-done. Signal 500+ zonasida — faqat mentor ko'radi (MentorPracticeStats).
const TALAB_QISM = [
  { id: 'qayerda', uz: 'Qayerda', ru: 'Где' },
  { id: 'nima', uz: 'Nima qilsin', ru: 'Что сделать' },
  { id: 'buzilmasin', uz: 'Nima buzilmasin', ru: 'Что не сломать' }
];
const GOYA_BOSH = { qayerda: '', nima: '', buzilmasin: '' };
const GoyaForma = ({ qiymat, onYoz, tola, ixtiyoriy }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => {
    try { await navigator.clipboard.writeText(TALAB_QISM.map(q => `${tr(q)}: ${String(qiymat[q.id] || '').trim()}`).join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="mc-goya" data-tola={tola || ixtiyoriy ? '1' : '0'}>
      {TALAB_QISM.map(q => (
        <label key={q.id} className="mc-goya-q">
          <span className="mc-goya-l">{tr(q)}:</span>
          <textarea rows={1} value={qiymat[q.id] || ''} placeholder="…" onChange={e => onYoz(q.id, e.target.value)} />
        </label>
      ))}
      <QTugma ikkinchi disabled={!tola} onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</QTugma>
    </span>
  );
};
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda = [], doneText }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const [goya, setGoya] = useState(() => ({ ...GOYA_BOSH, ...((storedAnswer && storedAnswer.goya) || {}) }));
  const formaN = steps.findIndex(c => c.forma);
  const ixtiyoriy = formaN >= 0 && !!steps[formaN].ixtiyoriy;
  const tola = TALAB_QISM.every(q => String(goya[q.id] || '').trim());
  const done = stepN >= steps.length;
  const goyaYoz = (id, v) => { const g = { ...goya, [id]: v }; setGoya(g); if (!avval) onAnswer(screen, { ...(storedAnswer || {}), goya: g }); };
  const bajardim = () => {
    if (isMentorLive || done) return;
    if (stepN === formaN && !tola && !ixtiyoriy) return; // 5-qadam: uchala qator yozilmaguncha «Bajardim» yopiq
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, goya });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  // Yangi ochilgan qadam (uzun prompt, 5-qadam formasi) «Bajardim»i bilan birga ko'rinsin — kompyuterda ham (telefonda Stage o'zi suradi)
  const birinchiRef = useRef(true);
  useEffect(() => {
    if (birinchiRef.current) { birinchiRef.current = false; return; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: c.forma ? <>{fmtCode(tr(c.t))}<GoyaForma qiymat={goya} onYoz={goyaYoz} tola={tola} ixtiyoriy={!!c.ixtiyoriy} /></> : fmtCode(tr(c.t)),
          prompt: c.prompt && c.prompt.map(l => tr(l)),
          kimga: c.prompt && tr(c.kimga || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }),
          xato: c.err && fmtCode(tr(c.err))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={fk(tr(doneText))} natija={typeof natija === 'function' ? natija(done) : natija} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortda}
        pastki={<MentorPracticeStats live={_live} screen={screen} />} />
    </Stage>
  );
}
const ORTDA_FETCH = 'git fetch https://github.com/Azizbekcrypto/maydon --tags';
const ortdaIzoh = (t) => <span className="mc-ortda-izoh">{fmtCode(tr(t))}</span>;
const XATO_YOLI = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
const NATIJA_YORLIQ = { uz: 'Kutilgan natija (namuna: «Maydon»)', ru: 'Ожидаемый результат (образец: «Maydon»)' };
const QADAM_OCHISH = { uz: 'Ochish', ru: 'Открыть' };
const QADAM_PROMPT = { uz: 'Prompt', ru: 'Промпт' };
const QADAM_ISHGA = { uz: 'Ishga tushirish', ru: 'Запуск' };
const QADAM_TEKSHIR = { uz: 'Tekshirish', ru: 'Проверка' };
const QADAM_GOYA = { uz: "O'z g'oyangiz", ru: 'Ваша идея' };
const TUGA = { uz: "Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Больше ничего не трогай, скажи, какие файлы изменились.' };
const blokMentor = (m) => ({ uz: <>{fmtCode(m.uz)} <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>{fmtCode(m.ru)} Начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> });

// A1 kutilgan natija — ikki brauzer oynasi yonma-yon + Neon SQL Editor jadvali (MAYDON dan)
const A1Natija = () => (
  <div className="mc-natija">
    <div className="mc-oynalar">
      <Telefon ramka="oyna" yorliq={tr({ uz: '1-oyna', ru: 'Окно 1' })} band={['17:00', '19:00', '20:00']} tanlangan="19:00" belgi="ok" />
      <Telefon ramka="oyna" yorliq={tr({ uz: '2-oyna', ru: 'Окно 2' })} band={['17:00', '19:00', '20:00']} tanlangan="19:00" belgi="rad" />
    </div>
    <DbJadval sarlavha="Neon · SQL Editor" ustun={['kun', 'soat', 'ism']} qatorlar={['19:00']} />
  </div>
);
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · band qilish', ru: 'Практика 1 · бронирование' }}
    title={{ uz: <>Bo'sh katakni bosgan o'yinchi <span className="italic" style={{ color: T.accent }}>uni band qila olsin</span>.</>, ru: <>Пусть игрок, нажавший свободную ячейку, <span className="italic" style={{ color: T.accent }}>сможет её забронировать</span>.</> }}
    mentor={blokMentor({ uz: "Talabdagi ikki qavsni o'zingiz to'ldirasiz — ikki telefonni eslang.", ru: 'Две скобки в требовании заполняете сами — вспомните два телефона.' })}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "Antigravity'da `maydon` papkasini oching. Ikki terminal: `cd backend && npm run start:dev` · `cd web && npm run dev`. Brauzerda `localhost:5173` — shanba kataklari ko'rinsin.", ru: 'Откройте папку `maydon` в Antigravity. Два терминала: `cd backend && npm run start:dev` · `cd web && npm run dev`. В браузере `localhost:5173` — пусть видны ячейки субботы.' } },
      { h: QADAM_PROMPT, t: { uz: "qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'заполните скобки, нажмите «Скопировать», отправьте в Antigravity:' }, prompt: [
        { uz: "Qayerda: saytdagi vaqt kataklari va Backend'dagi POST /bandlar.", ru: 'Где: ячейки времени на сайте и POST /bandlar в Backend.' },
        { uz: "Nima qilsin: bo'sh katak bosilsa, {o'yinchidan nima so'ralsin} so'rasin va bandni bandlar jadvaliga yozsin; javob kelgach katak band bo'lsin.", ru: 'Что сделать: при нажатии свободной ячейки пусть спросит {что спросить у игрока} и запишет бронь в таблицу bandlar; после ответа ячейка станет занятой.' },
        { uz: 'Band saqlangach band-qildi hodisasini yuborsin.', ru: 'После сохранения брони пусть отправит событие band-qildi.' },
        { uz: 'Nima buzilmasin: {band katak uchun qoida} — buni Backend tekshirsin. Animatsiyalar va vaqt-tanladi hodisasi qolsin.', ru: 'Что не сломать: {правило для занятой ячейки} — пусть это проверяет Backend. Анимации и событие vaqt-tanladi остаются.' },
        TUGA
      ] },
      { h: QADAM_ISHGA, t: { uz: "Antigravity o'zgargan fayllarni aytadi: ular `backend/` va `web/` ichida bo'lsin. Ikkala terminal xatosiz, sahifa o'zi yangilanadi.", ru: 'Antigravity назовёт изменённые файлы: пусть они будут внутри `backend/` и `web/`. Оба терминала без ошибок, страница обновляется сама.' }, err: XATO_YOLI },
      { h: QADAM_TEKSHIR, t: { uz: "saytni ikki oynada oching. Birinchisida shanba 19:00 ni o'z ismingiz bilan band qiling (18:00 ni band qilmang — 10-darsdagi sinov vazifasi shu vaqt uchun); ikkinchisida sahifani yangilamasdan o'sha katakni band qilib ko'ring — «Bu vaqt band» chiqsin. Neon'dagi SQL Editor'da: `SELECT kun, soat, ism FROM bandlar WHERE soat = '19:00';` — bitta qator (17:00 va 20:00 — 7-darsdagi namuna bandlar). Umami'da `band-qildi` — bitta.", ru: 'откройте сайт в двух окнах. В первом забронируйте субботу 19:00 на своё имя (18:00 не бронируйте — для этого времени задание проверки на 10-м уроке); во втором, не обновляя страницу, попробуйте забронировать ту же ячейку — пусть выйдет «Bu vaqt band». В SQL Editor в Neon: `SELECT kun, soat, ism FROM bandlar WHERE soat = \'19:00\';` — одна строка (17:00 и 20:00 — образцы броней с 7-го урока). В Umami `band-qildi` — одно.' } },
      { h: QADAM_GOYA, t: { uz: "MVP'ingizning asosiy harakati uchun shu talabni yozing: qayerda, nima qilsin, nima buzilmasin. Uyda o'z loyihangizda Antigravity'ga yuborasiz.", ru: 'напишите это требование для главного действия вашего MVP: где, что сделать, что не сломать. Дома отправите его в Antigravity в своём проекте.' }, forma: true }
    ]}
    natija={<A1Natija />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-09-start']}
    doneText={{ uz: 'Band qilish ishlayapti: bitta katakka faqat bitta band yoziladi.', ru: 'Бронирование работает: на одну ячейку записывается только одна бронь.' }} />
);

// A2 kutilgan natija — ega sahifasi (19:00) + tokensiz brauzer qatori 401 + QIzoh (audit)
const A2Natija = (tugadi) => (
  <div className="mc-natija">
    <EgaSahifa katta parol="ok" qatorlar={['19:00']} yangi={tugadi ? '19:00' : undefined} />
    <div className="mc-401">
      <div className="mc-tel-bar"><i /><i /><i /><span>localhost:3000/bandlar</span></div>
      <pre className="mc-json">{'{"statusCode":401,"message":"Unauthorized"}'}</pre>
    </div>
    <QIzoh>{tr({ uz: "Bu — bitta egali MVP uchun sodda kirish. Ko'p foydalanuvchili mahsulotda kirish boshqacha quriladi.", ru: 'Это простой вход для MVP с одним владельцем. В продукте со многими пользователями вход строят иначе.' })}</QIzoh>
  </div>
);
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · ega sahifasi', ru: 'Практика 2 · страница владельца' }}
    title={{ uz: <>Bandlar ro'yxati <span className="italic" style={{ color: T.accent }}>faqat maydon egasiga</span> ochilsin.</>, ru: <>Пусть список броней открывается <span className="italic" style={{ color: T.accent }}>только владельцу поля</span>.</> }}
    mentor={blokMentor({ uz: 'Parolni talabga yozmaysiz — u faqat `.env` da turadi.', ru: 'Пароль в требование не пишете — он лежит только в `.env`.' })}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "`backend/.env` ga ikki qator qo'shing: `EGA_PAROLI=` (o'zingiz o'ylagan parol) va `JWT_SECRET=` (tokenni imzolaydigan uzun tasodifiy qator). Ikkala terminal ishlab tursin.", ru: 'Добавьте в `backend/.env` две строки: `EGA_PAROLI=` (придуманный вами пароль) и `JWT_SECRET=` (длинная случайная строка, которой подписывается токен). Оба терминала пусть работают.' } },
      { h: QADAM_PROMPT, t: { uz: "qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'заполните скобки, нажмите «Скопировать», отправьте в Antigravity:' }, prompt: [
        { uz: "Qayerda: saytda yangi /ega sahifasi; Backend'da POST /kirish va GET /bandlar.", ru: 'Где: новая страница /ega на сайте; POST /kirish и GET /bandlar в Backend.' },
        { uz: "Nima qilsin: POST /kirish parolni .env dagi EGA_PAROLI bilan solishtirsin, to'g'ri bo'lsa token bersin; /ega sahifasi {egaga nima ko'rinsin} ko'rsatsin.", ru: 'Что сделать: POST /kirish пусть сравнит пароль с EGA_PAROLI из .env и при совпадении выдаст токен; страница /ega пусть покажет {что видит владелец}.' },
        { uz: "Nima buzilmasin: GET /bandlar tokensiz javob bermasin. Parol va JWT_SECRET kodda ham, repo'da ham bo'lmasin. {o'yinchi sahifasida nima ko'rinmasin}.", ru: 'Что не сломать: GET /bandlar без токена не отвечает. Пароля и JWT_SECRET нет ни в коде, ни в репо. {что не видно на странице игрока}.' },
        TUGA
      ] },
      { h: QADAM_ISHGA, t: { uz: "Backend yangi `.env` qatorini o'qishi uchun uni qayta ishga tushiring: Ctrl+C, keyin `npm run start:dev`.", ru: 'Чтобы Backend прочитал новую строку `.env`, перезапустите его: Ctrl+C, затем `npm run start:dev`.' }, err: XATO_YOLI },
      { h: QADAM_TEKSHIR, t: { uz: "`localhost:5173/ega`: avval noto'g'ri parol — «Parol noto'g'ri»; keyin to'g'risi — shanba ro'yxatida 19:00 va sizning ismingiz. Brauzerda `localhost:3000/bandlar` ni oching — ro'yxat emas, `401` chiqsin.", ru: '`localhost:5173/ega`: сначала неверный пароль — «Parol noto\'g\'ri»; потом верный — в списке субботы 19:00 и ваше имя. Откройте в браузере `localhost:3000/bandlar` — пусть выйдет не список, а `401`.' } },
      { h: QADAM_GOYA, t: { uz: "MVP'ingizda faqat bir kishi ko'radigan ma'lumot bormi? Bor bo'lsa, shu talabni unga yozing; yo'q bo'lsa, «Bajardim»ni bosing.", ru: 'Есть ли в вашем MVP данные, которые видит только один человек? Если есть — напишите это требование для них; если нет — нажмите «Готово».' }, forma: true, ixtiyoriy: true }
    ]}
    natija={A2Natija} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-09-done', ortdaIzoh({ uz: '(parolni `.env` ga o\'zingiz yozasiz)', ru: '(пароль в `.env` впишете сами)' })]}
    doneText={{ uz: "Ro'yxat faqat egada: token bilan ochiladi, tokensiz — `401`.", ru: 'Список только у владельца: открывается с токеном, без токена — `401`.' }} />
);

// A3 kutilgan natija — telefon (Netlify manzili, 21:00 band) + Umami'dagi uch qadam; tugagach sonlar navbat bilan yonadi
const A3_UMAMI = [{ uz: 'sahifa ochildi', ru: 'страница открыта' }, 'vaqt-tanladi', 'band-qildi'];
const A3Natija = (tugadi) => (
  <div className="mc-natija mc-a3">
    <Telefon manzil={NETLIFY} band={['17:00', '19:00', '20:00', '21:00']} tanlangan="21:00" belgi="ok" katta />
    <UmamiQadam yorliqlar={A3_UMAMI} sonlar={[1, 1, 1]} navbat={tugadi} />
  </div>
);
const ScreenA3 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 3 · deploy', ru: 'Практика 3 · деплой' }}
    title={{ uz: <>«Maydon»ni internetga chiqaring, <span className="italic" style={{ color: T.accent }}>telefondan oching</span>.</>, ru: <>Выложите «Maydon» в интернет, <span className="italic" style={{ color: T.accent }}>откройте с телефона</span>.</> }}
    mentor={blokMentor({ uz: '`localhost` faqat sizning laptopingizda ochiladi, boshqa odamning telefonida emas.', ru: '`localhost` открывается только на вашем ноутбуке, а не на телефоне другого человека.' })}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "avval `git push`. render.com → «New → Web Service» → `maydon` repo'ngiz; Root Directory — `backend`, tarif Free. «Environment» bo'limiga `DATABASE_URL`, `EGA_PAROLI` va `JWT_SECRET` — qiymatlari `.env` dan. «Deploy Web Service» — tayyor bo'lgach manzil chiqadi: `....onrender.com`.", ru: 'сначала `git push`. render.com → «New → Web Service» → ваш репо `maydon`; Root Directory — `backend`, тариф Free. В раздел «Environment» — `DATABASE_URL`, `EGA_PAROLI` и `JWT_SECRET`, значения из `.env`. «Deploy Web Service» — когда готово, появится адрес: `....onrender.com`.' } },
      { h: QADAM_PROMPT, t: { uz: "Render manzilini yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'впишите адрес Render, нажмите «Скопировать», отправьте в Antigravity:' }, prompt: [
        { uz: "Qayerda: saytdagi Backend manzili va Backend'ning ruxsat ro'yxati (CORS).", ru: 'Где: адрес Backend на сайте и список разрешений Backend (CORS).' },
        { uz: "Nima qilsin: sayt Backend manzilini VITE_API_URL dan olsin (laptopda http://localhost:3000, Netlify'da {Render manzilingiz});", ru: 'Что сделать: сайт пусть берёт адрес Backend из VITE_API_URL (на ноутбуке http://localhost:3000, на Netlify {ваш адрес Render});' },
        { uz: "Backend localhost:5173 dan va WEB_ORIGIN dagi Netlify manzilidan kelgan so'rovga ruxsat bersin.", ru: 'Backend пусть разрешает запросы с localhost:5173 и с адреса Netlify из WEB_ORIGIN.' },
        { uz: "Nima buzilmasin: sayt Netlify'da turganda /ega sahifasi to'g'ridan ochilsa ham ishlasin.", ru: 'Что не сломать: когда сайт на Netlify, страница /ega работает, даже если открыть её напрямую.' },
        TUGA
      ] },
      { h: QADAM_ISHGA, t: { uz: "app.netlify.com → yangi loyiha → GitHub'dan import → o'z `maydon` repo'ngiz. Base directory `web`, build `npm run build`, publish `dist` (base'ga nisbatan); sozlamada `VITE_API_URL` (Render manzili) va `VITE_UMAMI_ID`. Netlify manzilini Render'da `WEB_ORIGIN` ga yozing. Havola chiqadi: `....netlify.app`; keyin har push'da sayt o'zi yangilanadi.", ru: 'app.netlify.com → новый проект → импорт из GitHub → ваш репо `maydon`. Base directory `web`, build `npm run build`, publish `dist` (относительно base); в настройках `VITE_API_URL` (адрес Render) и `VITE_UMAMI_ID`. Адрес Netlify впишите в Render в `WEB_ORIGIN`. Появится ссылка `....netlify.app`; дальше сайт обновляется сам после каждого push.' }, err: XATO_YOLI },
      { h: QADAM_TEKSHIR, t: { uz: "telefonda `....netlify.app` ni oching: shanba 21:00 ni band qiling, keyin `/ega` da parol bilan kirib, bandni ko'ring. Umami'da uch qadam: sahifa ochildi → `vaqt-tanladi` → `band-qildi`. Bepul Backend 15 daqiqa ishlatilmasa uxlab qolishi mumkin — keyingi birinchi so'rov sekinroq javob beradi.", ru: 'откройте `....netlify.app` на телефоне: забронируйте субботу 21:00, потом войдите в `/ega` с паролем и посмотрите бронь. В Umami три шага: страница открыта → `vaqt-tanladi` → `band-qildi`. Бесплатный Backend может уснуть, если 15 минут им не пользоваться, — первый следующий запрос ответит медленнее.' } },
      { h: QADAM_GOYA, t: { uz: "shu talabni o'z MVP'ingizga yozing: Render manzili o'rniga o'zingizniki. Uyda o'z loyihangizni ham shu yo'l bilan chiqarasiz.", ru: 'напишите это требование для своего MVP: вместо адреса Render — свой. Дома выложите свой проект тем же путём.' }, forma: true }
    ]}
    natija={A3Natija} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-09-done', ortdaIzoh({ uz: "(Render manzilini o'zingiznikiga almashtiring) · bepul Render 15 daqiqa jimlikdan keyin uxlaydi, so'rov kelganda uyg'onadi.", ru: '(замените адрес Render на свой) · бесплатный Render засыпает после 15 минут тишины и просыпается, когда приходит запрос.' })]}
    doneText={{ uz: "«Maydon» internetda: telefondan band qilinadi, ega ro'yxatni parol bilan ko'radi.", ru: '«Maydon» в интернете: бронируют с телефона, владелец видит список по паролю.' }} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran sflash (F-1005-88), qolipdagi QKartochka (DE-204). Orqa — oddiy matn; old va izoh — fmtCode.
const KARTALAR = [
  { front: { uz: 'Shu MVP versiyasi qachon tayyor?', ru: 'Когда эта версия MVP готова?' }, back: { uz: '«Qilamiz» qutisidagi funksiyalar ishlaganda', ru: 'Когда работают функции из коробки «делаем»' }, note: { uz: "To'lov va jamoa yig'ish — «keyin» qutisida", ru: 'Оплата и сбор команды — в коробке «потом»' } },
  { front: { uz: "Bo'sh katak bosilganda band qayerga ketadi?", ru: 'Куда уходит бронь при нажатии свободной ячейки?' }, back: { uz: 'POST /bandlar ga', ru: 'В POST /bandlar' }, note: { uz: 'Backend uni `bandlar` jadvaliga yozadi', ru: 'Backend записывает её в таблицу `bandlar`' } },
  { front: { uz: "Bo'sh katakni kim tekshiradi?", ru: 'Кто проверяет свободную ячейку?' }, back: { uz: 'Backend', ru: 'Backend' }, note: { uz: "Telefondagi sahifa eskirgan bo'lishi mumkin", ru: 'Страница на телефоне может быть устаревшей' } },
  { front: { uz: "Katak band bo'lsa, Backend nima qaytaradi?", ru: 'Что вернёт Backend, если ячейка занята?' }, back: { uz: '«Bu vaqt band»', ru: '«Это время занято»' }, note: { uz: 'Ikkinchi band jadvalga yozilmaydi', ru: 'Вторая бронь в таблицу не записывается' } },
  { front: { uz: '`band-qildi` hodisasi qachon yoziladi?', ru: 'Когда пишется событие `band-qildi`?' }, back: { uz: 'Band saqlangandan keyin', ru: 'После сохранения брони' }, note: { uz: 'Rad etilgan urinish sanalmaydi', ru: 'Отклонённая попытка не считается' } },
  { front: { uz: 'Umami qaysi uch qadamni sanaydi?', ru: 'Какие три шага считает Umami?' }, back: { uz: 'Ochdi → vaqtni tanladi → band qildi', ru: 'Открыл → выбрал время → забронировал' }, note: { uz: "Oxirgi qadam bugun qo'shildi", ru: 'Последний шаг добавлен сегодня' } },
  { front: { uz: 'Ega parolni kiritsa, Backend nima beradi?', ru: 'Что выдаёт Backend, если владелец ввёл пароль?' }, back: { uz: 'Token', ru: 'Токен' }, note: { uz: "`POST /kirish` — parol to'g'ri bo'lsa", ru: '`POST /kirish` — если пароль верный' } },
  { front: { uz: '`GET /bandlar` tokensiz nima qaytaradi?', ru: 'Что вернёт `GET /bandlar` без токена?' }, back: { uz: '401', ru: '401' }, note: { uz: "Ro'yxat faqat egaga ochiladi", ru: 'Список открывается только владельцу' } },
  { front: { uz: "O'yinchi sahifasida bandlar haqida nima ko'rinadi?", ru: 'Что о бронях видно на странице игрока?' }, back: { uz: 'Soat va holat', ru: 'Час и состояние' }, note: { uz: 'Ism va telefon — faqat ega sahifasida', ru: 'Имя и телефон — только на странице владельца' } },
  { front: { uz: 'Ega paroli qayerda turadi?', ru: 'Где хранится пароль владельца?' }, back: { uz: ".env va Render'da", ru: 'В .env и в Render' }, note: { uz: "Kodda ham, GitHub'da ham emas", ru: 'Ни в коде, ни на GitHub' } },
  { front: { uz: 'Talab qaysi uch qismdan iborat?', ru: 'Из каких трёх частей состоит требование?' }, back: { uz: 'Qayerda · nima qilsin · nima buzilmasin', ru: 'Где · что сделать · что не сломать' }, note: { uz: '«Boshqa joyga tegma»', ru: '«Больше ничего не трогай»' } },
  { front: { uz: "MVP'ni internetga chiqarish nima deyiladi?", ru: 'Как называется выкладка MVP в интернет?' }, back: { uz: 'Deploy', ru: 'Деплой' }, note: { uz: 'Bizda: Backend — Render, sayt — Netlify', ru: 'У нас: Backend — Render, сайт — Netlify' } }
];

// ===== KARTOCHKALAR — alohida ekran (F-1005-88); SABOQ 16: Mentor yo'q (KORPUS §61), karta ostida birinchi bosishgacha yorliq, karta yuzi halqada =====
// Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi — root'dagi FLASH_IDX / flashHidden.
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={`mc-flash ${bosildi ? '' : 'yangi'}`} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: fmtCode(tr(c.front)), back: tr(c.back), note: c.note && fmtCode(tr(c.note)) }))} />
          {!bosildi && <p className="mc-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Keyingi dars» qatori; uyga vazifa yo'q (172.4). CODE STRIKE va arena — darsda =====
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
  const RECAP = [
    { uz: "Biz belgilagan shu MVP versiyasi «qilamiz» qutisidagi funksiyalar ishlaganda tayyor bo'ladi.", ru: 'Намеченная нами версия MVP готова, когда работают функции из коробки «делаем».' },
    { uz: 'Backend avval tekshiradi, Database esa bir katakni ikki marta yozdirmaydi.', ru: 'Backend сначала проверяет, а Database не даёт записать одну ячейку дважды.' },
    { uz: 'Hodisa harakat haqiqatan saqlangandan keyin yoziladi.', ru: 'Событие пишется после того, как действие действительно сохранено.' },
    { uz: "Shaxsiy ma'lumotni Backend faqat token bilan beradi; parol va sirlar `.env` da turadi.", ru: 'Личные данные Backend отдаёт только по токену; пароль и секреты лежат в `.env`.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · yakun', ru: 'День проекта · итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'MVP internetda', ru: 'MVP в интернете' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>MVP tayyor: <span className="italic" style={{ color: T.accent }}>boshqa odam ishlata oladi</span>.</>, ru: <>MVP готов: <span className="italic" style={{ color: T.accent }}>им может пользоваться другой человек</span>.</> })}
        cta={<>
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={RECAP.map(r => fk(tr(r)))}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      >
        <p className="next-lesson fade-up d4">{tr({ uz: <>Keyingi dars — <b>«Odam ilovangizda qayerda to'xtab qoladi?»</b>: MVP ni boshqa odam ishlatadi, siz esa tushuntirmasdan kuzatasiz.</>, ru: <>Следующий урок — <b>«Где человек застревает в вашем приложении?»</b>: вашим MVP пользуется другой человек, а вы наблюдаете, не объясняя.</> })}</p>
      </QYakun>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function MvpCompleteLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === «MAYDON» XARITASI — darsning bitta vizuali (MAYDON). Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .mc-xarita { display: flex; align-items: flex-start; gap: 0; min-width: 0; }
        .mc-tellar { display: flex; gap: 10px; flex: 0 0 auto; align-items: flex-start; }
        .mc-ustun { display: flex; flex-direction: column; flex: 1 1 280px; max-width: 400px; min-width: 0; }
        .mc-xarita > .mc-yol { align-self: flex-start; height: 64px; min-height: 0; margin-top: 4px; }
        .mc-ustun > .mc-umami { margin-top: 10px; }
        .mc-tugun-n { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .mc-tugun-n code { text-transform: none; letter-spacing: 0; font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        /* Telefon va brauzer oynasi */
        .mc-tel-w { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .mc-tel-w.oyna { flex: 1 1 0; }
        .mc-tel-y { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11.5px; color: ${T.ink2}; padding-left: 4px; }
        .mc-tel { position: relative; width: 190px; background: ${T.paper}; border: 2px solid ${T.ink}; border-radius: 22px; padding: 7px 7px 10px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 8px 22px -12px rgba(${T.shadowBase},0.3); transition: box-shadow 0.25s ease; }
        .mc-tel.katta { width: 236px; }
        .mc-tel.oyna { width: auto; border: 1px solid ${T.line}; border-radius: 12px; padding: 0 0 10px; }
        .mc-tel.faol { box-shadow: 0 0 0 3px ${T.accent}; }
        .mc-tel-bar { display: flex; align-items: center; gap: 5px; padding: 3px 8px; border-radius: 8px; background: ${T.bg}; min-width: 0; }
        .mc-tel.oyna .mc-tel-bar, .mc-ega .mc-tel-bar, .mc-401 .mc-tel-bar { border-radius: 0; border-bottom: 1px solid ${T.line}; padding: 5px 10px; }
        .mc-tel-bar i { width: 7px; height: 7px; border-radius: 50%; background: ${T.line}; flex-shrink: 0; }
        .mc-tel-bar span { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 10.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .mc-tel-tana { display: flex; flex-direction: column; gap: 7px; padding: 0 3px; }
        .mc-tel.oyna .mc-tel-tana { padding: 4px 10px 0; }
        .mc-tel-bosh { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .mc-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .mc-kun { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; color: ${T.ink}; }
        .mc-kun i { font-style: normal; color: ${T.ink2}; font-size: 12px; }
        .mc-kataklar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 5px; }
        .mc-katak { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 34px; padding: 3px 2px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; font-weight: 700; transition: background 0.55s ease, color 0.55s ease, border-color 0.3s ease; }
        .mc-katak small { font-family: 'Manrope', sans-serif; font-size: 9.5px; font-weight: 700; }
        .mc-katak.band { background: ${T.ink2}; border-color: ${T.ink2}; color: ${T.paper}; }
        .mc-katak.tanlangan:not(.band) { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .mc-katak.tanlangan.band { box-shadow: 0 0 0 2px ${T.accent}; }
        .mc-katak small.mc-eski { position: absolute; top: -9px; right: -6px; z-index: 1; background: ${T.line}; color: ${T.ink2}; font-size: 9px; line-height: 1.3; padding: 1px 5px; border-radius: 6px; white-space: nowrap; animation: q-kir 0.25s ease-out; }
        .mc-forma { display: flex; flex-direction: column; gap: 4px; }
        .mc-input { display: block; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 11.5px; color: ${T.ink}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 7px; padding: 5px 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: border-color 0.3s ease; }
        .mc-tel-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; padding: 8px 10px; border-radius: 9px; border: none; background: ${T.accent}; color: ${T.paper}; cursor: pointer; }
        .mc-tel-btn.xira { opacity: 0.4; cursor: not-allowed; }
        p.mc-belgi { margin: 0; padding: 6px 8px; border-radius: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; line-height: 1.35; text-align: center; animation: q-kir 0.3s ease-out; }
        p.mc-belgi.ok { background: ${T.okFon}; color: ${T.ok}; }
        p.mc-belgi.rad { background: ${T.errFon}; color: ${T.err}; }
        /* Yo'l va konvert (so'rov / javob) */
        .mc-yol { position: relative; flex: 0 0 104px; align-self: stretch; min-height: 64px; }
        .mc-yol-ch { position: absolute; left: 6px; right: 6px; top: 50%; border-top: 2px dashed ${T.line}; }
        .mc-yol.tik { flex: 0 0 auto; height: 44px; min-height: 0; align-self: stretch; }
        .mc-yol.tik .mc-yol-ch { left: 50%; right: auto; top: 4px; bottom: 4px; border-top: none; border-left: 2px dashed ${T.line}; }
        .mc-konvert { --kc: ${T.accent}; position: absolute; z-index: 2; left: 0; top: 50%; width: 22px; height: 15px; margin-top: -8px; border: 1.5px solid var(--kc); border-radius: 3px; background: linear-gradient(to bottom right, transparent 45%, var(--kc) 46%, var(--kc) 56%, transparent 57%) left top / 50% 64% no-repeat, linear-gradient(to bottom left, transparent 45%, var(--kc) 46%, var(--kc) 56%, transparent 57%) right top / 50% 64% no-repeat, ${T.paper}; animation: mc-ong 0.85s ease-in-out forwards; }
        .mc-konvert.ok { --kc: ${T.ok}; }
        .mc-konvert.err { --kc: ${T.err}; }
        .mc-konvert.chap { animation-name: mc-chap; }
        .mc-yol.tik .mc-konvert { left: 50%; top: 0; margin: 0 0 0 -11px; animation-name: mc-past; }
        .mc-yol.tik .mc-konvert.tepa { animation-name: mc-tepa; }
        @keyframes mc-ong { from { left: 0; } to { left: calc(100% - 22px); } }
        @keyframes mc-chap { from { left: calc(100% - 22px); } to { left: 0; } }
        @keyframes mc-past { from { top: 0; } to { top: calc(100% - 15px); } }
        @keyframes mc-tepa { from { top: calc(100% - 15px); } to { top: 0; } }
        .mc-konvert-t { position: absolute; left: 2px; right: 2px; top: calc(50% + 12px); text-align: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 10px; font-weight: 700; line-height: 1.3; color: ${T.accent}; overflow-wrap: anywhere; animation: q-kir 0.25s ease-out; }
        .mc-konvert-t.ok { color: ${T.ok}; } .mc-konvert-t.err { color: ${T.err}; }
        .mc-yol.tik .mc-konvert-t { top: 50%; left: calc(50% + 18px); right: auto; transform: translateY(-50%); text-align: left; white-space: nowrap; }
        /* Backend qutisi, qulf, Database jadvali */
        .mc-be { display: flex; flex-direction: column; gap: 5px; padding: 9px 10px; border: 1.5px solid ${T.line}; border-radius: 12px; background: ${T.paper}; transition: border-color 0.3s ease, box-shadow 0.3s ease; }
        .mc-be.err { border-color: ${T.err}; box-shadow: 0 0 0 3px ${T.errFon}; }
        .mc-yol-q, .mc-env { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 4px 8px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.bg}; transition: background 0.3s ease, border-color 0.3s ease; }
        .mc-yol-q { justify-content: flex-start; } .mc-yol-q > code { margin-right: auto; }
        .mc-yol-q code, .mc-env code { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; font-weight: 700; color: ${T.ink}; }
        .mc-env { border-style: dashed; justify-content: flex-start; }
        .mc-yol-q.on, .mc-env.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .mc-yol-q.ok, .mc-env.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .mc-yol-q.err, .mc-env.err { border-color: ${T.err}; background: ${T.errFon}; }
        .mc-yol-q.err::after { content: '✕'; color: ${T.err}; font-weight: 800; }
        .mc-yol-q.ok::after { content: '✓'; color: ${T.ok}; font-weight: 800; }
        .mc-tekshir { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; animation: q-kir 0.25s ease-out; }
        .mc-tekshir.ok { color: ${T.ok}; background: ${T.okFon}; } .mc-tekshir.err { color: ${T.err}; background: ${T.errFon}; }
        .mc-qulf { position: relative; display: inline-block; flex-shrink: 0; width: 11px; height: 8px; margin-top: 5px; border-radius: 2px; background: ${T.ink2}; transition: background 0.3s ease; }
        .mc-qulf::before { content: ''; position: absolute; left: 2px; top: -6px; width: 7px; height: 7px; box-sizing: border-box; border: 1.5px solid ${T.ink2}; border-bottom: none; border-radius: 4px 4px 0 0; transition: transform 0.35s ease, border-color 0.3s ease; }
        .mc-qulf.err { background: ${T.err}; } .mc-qulf.err::before { border-color: ${T.err}; }
        .mc-qulf.ok { background: ${T.ok}; } .mc-qulf.ok::before { border-color: ${T.ok}; transform: translate(4px, -2px); }
        .mc-db { display: flex; flex-direction: column; gap: 5px; padding: 9px 10px; border: 1.5px solid ${T.line}; border-radius: 12px; background: ${T.paper}; min-width: 0; }
        .mc-jadval-w { overflow-x: auto; min-width: 0; }
        table.mc-jadval { border-collapse: collapse; width: 100%; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink}; }
        table.mc-jadval th { text-align: left; font-weight: 700; color: ${T.ink2}; padding: 3px 6px; border-bottom: 1px solid ${T.line}; }
        table.mc-jadval td { padding: 3px 6px; white-space: nowrap; font-weight: 600; transition: background 0.3s ease; }
        table.mc-jadval tr.yangi td { animation: mc-qator 1.6s ease-out; }
        table.mc-jadval tr.belgi td { background: ${T.errFon}; }
        table.mc-jadval td.mc-bosh { color: ${T.ink2}; font-family: 'Manrope', sans-serif; font-style: italic; }
        @keyframes mc-qator { 0% { background: ${T.okFon}; opacity: 0; transform: translateX(-10px); } 25% { opacity: 1; transform: none; } 70% { background: ${T.okFon}; } 100% { background: transparent; } }
        /* Ega sahifasi, o'yinchi telefoni, Umami */
        .mc-ega { width: 290px; flex: 0 0 auto; display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 12px; background: ${T.paper}; overflow: hidden; box-shadow: 0 8px 22px -12px rgba(${T.shadowBase},0.3); }
        .mc-ega.katta { width: auto; }
        .mc-ega-tana { display: flex; flex-direction: column; gap: 7px; padding: 9px 12px 12px; }
        .mc-parol.xato { border-color: ${T.err}; } .mc-parol.ok { border-color: ${T.ok}; }
        .mc-ega-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        ul.mc-ega-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
        ul.mc-ega-ro li { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 10.5px; font-weight: 600; color: ${T.ink}; padding: 4px 8px; border-radius: 6px; background: ${T.bg}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        ul.mc-ega-ro li.yangi { animation: mc-qator 1.6s ease-out; }
        .mc-ega-bosh { display: block; min-height: 26px; border: 1.5px dashed ${T.line}; border-radius: 7px; }
        .mc-ega.katta ul.mc-ega-ro li { font-size: 12.5px; padding: 6px 10px; }
        .mc-oyinchi { flex: 0 0 150px; margin-left: 14px; display: flex; flex-direction: column; gap: 6px; padding: 10px; border: 2px solid ${T.ink}; border-radius: 18px; background: ${T.paper}; }
        code.mc-oyinchi-y { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .mc-oyinchi-q { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; font-weight: 700; color: ${T.ink}; padding: 5px 8px; border-radius: 7px; background: ${T.bg}; }
        .mc-oyinchi-q.yondi { animation: mc-yondi 2s ease-out; }
        @keyframes mc-yondi { 0%, 55% { background: ${T.accentSoft}; box-shadow: 0 0 0 2px ${T.accent}; } 100% { background: ${T.bg}; box-shadow: none; } }
        .mc-umami { display: flex; align-items: center; gap: 8px 10px; flex-wrap: wrap; padding: 7px 10px; border: 1px solid ${T.line}; border-radius: 10px; background: ${T.bg}; }
        .mc-umami-q { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
        .mc-umami-s { color: ${T.ink2}; font-weight: 700; }
        .mc-umami-k { display: inline-flex; align-items: baseline; gap: 6px; padding: 3px 9px; border-radius: 7px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .mc-umami-k small { font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 600; color: ${T.ink2}; }
        .mc-umami-k b { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .mc-umami-k.yondi b { color: ${T.accent}; animation: mc-son 0.4s cubic-bezier(.3,1.5,.5,1); }
        .mc-umami.navbat .mc-umami-k { animation: mc-yon 0.6s ease-out both; }
        @keyframes mc-son { from { transform: scale(1.5); } }
        @keyframes mc-yon { 0% { border-color: ${T.line}; } 40% { border-color: ${T.accent}; background: ${T.accentSoft}; } 100% { border-color: ${T.ok}; background: ${T.okFon}; } }
        /* MVP ro'yxati qatori */
        .mc-mvp { display: flex; flex-wrap: wrap; gap: 8px; align-items: stretch; }
        .mc-mvp-q, .mc-mvp-k { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; padding: 7px 9px; border-radius: 11px; border: 1px solid ${T.line}; background: ${T.paper}; }
        .mc-mvp-k { background: ${T.bg}; }
        .mc-mvp-l { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; margin-right: 2px; }
        .mc-mvp-f { display: inline-flex; align-items: center; gap: 4px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; color: ${T.ink}; padding: 3px 8px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.paper}; transition: background 0.35s ease, border-color 0.35s ease; }
        .mc-mvp-f i { font-style: normal; font-weight: 800; color: ${T.ink2}; }
        .mc-mvp-f.ok { border-color: ${T.ok}; background: ${T.okFon}; } .mc-mvp-f.ok i { color: ${T.ok}; }
        .mc-mvp-f.on { border-color: ${T.accent}; background: ${T.accentSoft}; } .mc-mvp-f.on i { color: ${T.accent}; }
        .mc-mvp-kf { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12px; color: ${T.ink2}; padding: 3px 8px; border-radius: 7px; border: 1px dashed ${T.line}; }
        /* Kirish: agent chati · Reja: sayt → Backend → Database */
        .mc-hook { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .mc-hook-r { display: flex; gap: 12px; align-items: flex-start; }
        .mc-chat { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 5px; padding: 6px 0 0; }
        .mc-chat-kim { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        p.mc-pufak { margin: 0; padding: 7px 11px; border-radius: 12px; border-bottom-left-radius: 4px; background: ${T.paper}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: 13.5px; line-height: 1.4; color: ${T.ink}; }
        .mc-reja { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .mc-reja-r { display: flex; gap: 12px; align-items: flex-start; min-width: 0; }
        .mc-reja-o { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
        .mc-reja-o .mc-ega { width: auto; }
        .mc-strip { display: flex; align-items: center; }
        .mc-strip .mc-yol { flex: 1 1 60px; min-height: 26px; }
        .mc-strip .mc-konvert-t { display: none; }
        .mc-strip-n { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 4px 9px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; transition: background 0.3s ease, border-color 0.3s ease; }
        .mc-strip-n.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        p.mc-repo { margin: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; color: ${T.ink2}; }
        /* 4-ekran: uch kirish tugmasi */
        .mc-kirish { display: flex; gap: 10px; flex-wrap: wrap; }
        .mc-kirish > .q-btn { flex: 0 1 auto; font-weight: 700; font-size: clamp(13.5px,1.5vw,14.5px); padding: 10px 18px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; }
        .mc-kirish > .q-btn:disabled:not(.bajarildi) { opacity: 0.5; color: ${T.ink2}; }
        .mc-kirish > .q-btn.bajarildi { border-color: ${T.ok}; color: ${T.ok}; background: ${T.okFon}; opacity: 1; }
        /* Amaliyot bloki: kutilgan natija maketlari */
        .mc-natija { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .mc-oynalar { display: flex; gap: 10px; min-width: 0; align-items: stretch; }
        .mc-tel-w.oyna > .mc-tel { flex: 1 1 auto; }
        .mc-a3 { align-items: flex-start; }
        .mc-401 { border: 1px solid ${T.line}; border-radius: 10px; background: ${T.paper}; overflow: hidden; }
        pre.mc-json { margin: 0; padding: 9px 12px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; font-weight: 600; color: ${T.err}; white-space: pre-wrap; overflow-wrap: anywhere; }
        .q-blok-buyruq:has(> .mc-ortda-izoh) { font-family: 'Manrope', sans-serif; font-size: 12px; background: none; border: none; padding: 2px 0 0; white-space: normal; color: ${T.ink2}; }
        .mc-goya { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .mc-goya-q { display: grid; grid-template-columns: 124px minmax(0,1fr); align-items: start; gap: 8px; }
        .mc-goya-l { padding-top: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; line-height: 1.3; color: ${T.ink2}; }
        .mc-goya textarea { display: block; width: 100%; min-height: 36px; resize: vertical; font-family: 'Manrope', sans-serif; font-size: 13.5px; line-height: 1.4; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 7px 10px; }
        .mc-goya textarea:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .mc-goya > .q-btn { padding: 6px 12px; font-size: 12.5px; align-self: flex-start; }
        .q-blok-q.joriy:has(.mc-goya[data-tola="0"]) > .q-blok-tana > .q-btn { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
        /* SABOQ 11: tanlangan bashorat — ixcham qator; navbatdagi element — halqa + yengil puls */
        .mc-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; animation: q-kir 0.3s ease-out; }
        .mc-taxmin-s { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .mc-taxmin-j { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.accent}; background: ${T.accentSoft}; border: 1.5px solid ${T.accent}; border-radius: 9px; padding: 3px 11px; }
        .mc-navbat, .mc-tel-btn.navbat { box-shadow: 0 0 0 2px ${T.accent}; animation: mc-navbat 1.6s ease-out infinite; }
        .mc-tel-btn.navbat { box-shadow: 0 0 0 2px ${T.paper}, 0 0 0 4px ${T.accent}; animation-name: mc-navbat-t; }
        @keyframes mc-navbat { 0% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 2px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 12px ${fon(T.accent, 0)}; } }
        @keyframes mc-navbat-t { 0% { box-shadow: 0 0 0 2px ${T.paper}, 0 0 0 4px ${T.accent}, 0 0 0 4px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 2px ${T.paper}, 0 0 0 4px ${T.accent}, 0 0 0 13px ${fon(T.accent, 0)}; } }
        .mc-navbat-k > .q-bashorat { box-shadow: 0 0 0 2px ${T.accent}; animation: mc-navbat 1.6s ease-out infinite; }
        .q-kirish:has(.mc-hook.tanla) .q-variantlar-kol { border-radius: 14px; box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}; animation: mc-navbat-g 1.6s ease-out infinite; }
        @keyframes mc-navbat-g { 0% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 9px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 19px ${fon(T.accent, 0)}; } }
        .mc-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: mc-navbat-fc 1.6s ease-out infinite; }
        @keyframes mc-navbat-fc { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        .mc-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .mc-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: mc-fc-nuqta 1.4s ease-in-out 3; }
        @keyframes mc-fc-nuqta { 50% { transform: scale(1.6); opacity: .4; } }
        /* Yakun: «Keyingi dars» nishonlardan oldin (MD tartibi; QYakun children oxirida chiziladi) */
        .q-yakun > .ach-coll { order: 1; }
        p.next-lesson { margin: 0; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
        p.next-lesson b { color: ${T.ink}; }
        .rc-ic .mc-rc-kod { display: inline-block; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(13px,2vw,18px); line-height: 1.4; color: ${CODE.text}; background: ${CODE.bg}; padding: 10px 16px; border-radius: 10px; overflow-wrap: anywhere; }
        @media (max-width: 760px) {
          .mc-xarita { flex-direction: column; align-items: stretch; }
          .mc-tellar { justify-content: center; }
          .mc-tellar .mc-tel-w { flex: 1 1 0; }
          .mc-tellar .mc-tel { width: auto; }
          .mc-xarita > .mc-yol { flex: 0 0 auto; align-self: stretch; height: 52px; min-height: 0; margin-top: 0; }
          .mc-xarita > .mc-yol .mc-yol-ch { left: 50%; right: auto; top: 4px; bottom: 4px; border-top: none; border-left: 2px dashed ${T.line}; }
          .mc-xarita > .mc-yol .mc-konvert { left: 50%; top: 0; margin: 0 0 0 -11px; animation-name: mc-past; }
          .mc-xarita > .mc-yol .mc-konvert.chap { animation-name: mc-tepa; }
          .mc-xarita > .mc-yol .mc-konvert-t { top: 50%; left: calc(50% + 18px); right: 0; transform: translateY(-50%); text-align: left; }
          .mc-ega { width: auto; }
          .mc-oyinchi { flex-basis: auto; margin: 12px 0 0; }
          .mc-hook-r, .mc-reja-r { flex-direction: column; align-items: stretch; }
          .mc-hook-r .mc-tel, .mc-reja-r .mc-tel { width: auto; }
        }
        @media (max-width: 520px) {
          .mc-oynalar { flex-direction: column; }
          .mc-goya-q { grid-template-columns: minmax(0,1fr); gap: 3px; } .mc-goya-l { padding-top: 0; }
          .mc-tel.katta { width: auto; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mc-konvert { animation-duration: 0.01s; }
          .mc-katak, .mc-mvp-f, .mc-yol-q, .mc-be { transition: none; }
          table.mc-jadval tr.yangi td, ul.mc-ega-ro li.yangi, .mc-oyinchi-q.yondi, .mc-umami-k.yondi b, .mc-umami.navbat .mc-umami-k { animation: none; }
          .mc-navbat, .mc-tel-btn.navbat, .mc-navbat-k > .q-bashorat, .q-kirish:has(.mc-hook.tanla) .q-variantlar-kol, .mc-flash.yangi .fc-card:not(.flip) .fc-front, .mc-fc-ipucha i { animation: none; }
          .mc-taxmin, .mc-konvert-t, .mc-tekshir, p.mc-belgi, .mc-katak small.mc-eski { animation: none; }
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
