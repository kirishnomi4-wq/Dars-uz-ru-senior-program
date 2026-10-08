import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul (kod: src/9-Modull) · 10-dars «Loyiha kuni: poydevor — Database, kirish, deploy» (m9-10). Skeletdan (src/skelet/NamunaDars.jsx) qurildi, 06.10.2026.
// Manba-haqiqat: feedback/F-1005-11modul/10-FoundationDay-v3.md (GATE M). 8 ekran + 3 amaliyot bloki + kartochkalar = 12 (SABOQ 12).
// Oqim: s0 QKirish · s1 QReja · s2 QTushuncha (token) · a1 blok · s3 test · s4 QTushuncha (ilova manzili) · a2 blok · s5 test · a3 blok · podium · sflash · s7 QYakun.
// Bitta vizual — «Poydevor xaritasi» (POYDEVOR → PoydevorXarita): telefon chapda (172×272, SABOQ 22), Backend o'rtada, Database o'ngda; konvert — so'rov.
// Infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletdan o'zgarishsiz.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QKarta, QBashorat, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm9-10-v1', lessonTitle: { uz: "Loyiha kuni: poydevor — Database, kirish, deploy", ru: 'День проекта: фундамент — база данных, вход, деплой' } };
// 12 ekran · oqim: kirish → reja → tushuncha → amaliyot 1 → 1-savol → tushuncha → amaliyot 2 → 2-savol → amaliyot 3 → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'poydevor', ru: 'фундамент' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: 'token', l: 68, tp: 16, s: 12, d: 7.5 },
  { t: 'Database', l: 24, tp: 70, s: 12, d: 8.5 },
  { t: 'Render', l: 78, tp: 68, s: 13, d: 6.8 }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD da belgilangan: 1-savol (s3) — C, 2-savol (s5) — B. `practice: -1` — sentinel (uch blok, variant yo'q).
const INLINE_KEYS = { s3: 2, s5: 1, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI: 4 — 1-savol, 7 — 2-savol). Emoji o'rniga koddan bitta qator (S-026).
const RECAPS = {
  4: {
    title: { uz: 'Parol bir marta, keyin token', ru: 'Пароль один раз, потом токен' },
    cards: [
      { ic: <code className="fd-rc-kod">POST /kirish</code>, h: { uz: 'Kirish', ru: 'Вход' }, body: { uz: "Telefon va parol to'g'ri bo'lsa, Backend token beradi.", ru: 'Если телефон и пароль верны, Backend выдаёт токен.' } },
      { ic: <code className="fd-rc-kod">SecureStore.setItemAsync('token', token)</code>, h: { uz: 'Saqlash', ru: 'Хранение' }, body: { uz: 'Token telefonda shifrlab saqlanadi.', ru: 'Токен хранится на телефоне в зашифрованном виде.' } },
      { ic: <code className="fd-rc-kod">{'Authorization: Bearer <token>'}</code>, h: { uz: "So'rov", ru: 'Запрос' }, body: { uz: "Ilova yopiq so'rovlarga tokenni qo'shadi.", ru: 'Приложение добавляет токен к закрытым запросам.' }, ask: { uz: "Ilova qayta ochilganda parol nega so'ralmaydi?", ru: 'Почему при повторном открытии приложение не спрашивает пароль?' } }
    ]
  },
  7: {
    title: { uz: "Maxfiy kalit — faqat Backend'da", ru: 'Секретный ключ — только в Backend' },
    cards: [
      { ic: <code className="fd-rc-kod">EXPO_PUBLIC_API_URL=https://…</code>, h: { uz: 'Ilova', ru: 'Приложение' }, body: { uz: "Bu qiymat ilova ichida ochiq ko'rinadi.", ru: 'Это значение видно внутри приложения открыто.' } },
      { ic: <code className="fd-rc-kod">JWT_SECRET</code>, h: { uz: 'Maxfiy kalit', ru: 'Секретный ключ' }, body: { uz: <><code className="qcode">backend/.env</code> da va Render sozlamasida turadi.</>, ru: <>Хранится в <code className="qcode">backend/.env</code> и в настройках Render.</> } },
      { ic: <code className="fd-rc-kod">.gitignore</code>, h: { uz: 'Repo', ru: 'Репо' }, body: { uz: <><code className="qcode">.env</code> GitHub'ga chiqmaydi.</>, ru: <><code className="qcode">.env</code> не попадает на GitHub.</> }, ask: { uz: "Ilovani olgan odam qaysi qiymatni ko'ra oladi?", ru: 'Какое значение может увидеть человек, у которого есть приложение?' } }
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

// ===== DARSNING O'Z VIZUALI — «Poydevor xaritasi» (MD: bitta vizual, 163/180). Bitta manba: POYDEVOR + OYINLAR → Telefon, BackendQuti, DbQuti, PoydevorXarita, ManzilXarita va bloklar maketlari =====
// Holatlar (MD): kulrang — hali yo'q · oq — ishlaydi · accent — joriy · yashil — bugun qurildi · qizil — ulanmadi / 401. Konvert — so'rov (manba va nishon DOM dan o'lchanadi).
// Xaritada bosiladigan maket qismi yo'q (q14): harakat — QTugma (telefon ostida yoki qator kartasida). Kam harakat rejimida uchish yo'q, holat birdan almashadi (DE-200).
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

const POYDEVOR = {
  ilova: { nom: 'Maydon Jamoa', tex: 'Expo Go', qulf: 'expo-secure-store' },
  ekran: {
    royxat: { uz: "Ro'yxatdan o'tish", ru: 'Регистрация' },
    kirish: { uz: 'Kirish', ru: 'Вход' },
    oyinlar: { uz: "O'yinlar", ru: 'Игры' }
  },
  forma: [
    { k: 'ism', l: { uz: 'Ism', ru: 'Имя' }, v: 'Ali' },
    { k: 'telefon', l: { uz: 'Telefon', ru: 'Телефон' }, v: '+998 90 000 00 01' },
    { k: 'parol', l: { uz: 'Parol', ru: 'Пароль' }, v: '••••••••' }
  ],
  backend: {
    joy: { laptop: 'localhost:3000 · laptop', render: 'maydon-jamoa-….onrender.com · Render' },
    yollar: [{ k: 'royxat', t: 'POST /royxat' }, { k: 'kirish', t: 'POST /kirish' }, { k: 'oyinlar', t: 'GET /oyinlar', qulf: true }]
  },
  db: {
    nom: 'Database · Neon',
    oyinchilar: ['id', 'ism', 'telefon', 'parol_hash'],
    oyinlar: ['id', 'kun', 'soat', 'maydon', 'kerak'],
    tashkilotchi: ['1', { uz: 'Namuna tashkilotchi', ru: 'Организатор-образец' }, '+998 90 000 00 00', '$2b$10$…'],
    ali: ['2', 'Ali', '+998 90 000 00 01', '$2b$10$Qe…']
  },
  ichi: { nom: { uz: 'ilova ichi', ru: 'внутри приложения' }, fayl: 'mobil/.env' }
};
// Namuna o'yinlar (tayanch 9.2, 7/9-dars namuna.js bilan bir): Database'da yaratilish tartibida; ilova ro'yxati eng yangisini tepada ko'rsatadi (9.29). kun — sana (9.30)
const OYINLAR = [
  { id: 1, kun: { uz: 'Shanba', ru: 'Суббота' }, sana: '2026-10-10', soat: '18:00', maydon: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, kerak: 10 },
  { id: 2, kun: { uz: 'Shanba', ru: 'Суббота' }, sana: '2026-10-10', soat: '20:00', maydon: { uz: 'Maktab maydoni', ru: 'Школьное поле' }, kerak: 10 },
  { id: 3, kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, sana: '2026-10-11', soat: '10:00', maydon: { uz: 'Park maydoni', ru: 'Поле в парке' }, kerak: 8 },
  { id: 4, kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, sana: '2026-10-11', soat: '17:00', maydon: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, kerak: 10 }
];
const OYINLAR_YANGI = [...OYINLAR].reverse();
const OYINLAR_QATOR = OYINLAR.map(o => ({ k: 'o' + o.id, c: [String(o.id), o.sana, o.soat, o.maydon, String(o.kerak)] }));

// Uchish (SABOQ 19): konvert manbadan nishonga uchadi. Joylar DOM dan o'lchanadi — ⛶ kattalashganda ham, telefonda ustma-ust turganda ham to'g'ri.
const PARVOZ_MS = 850;
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
  <span className={cxx('fd-konvert', p.tur, !p.t && 'nuqta')} aria-hidden="true"
    style={{ left: p.a.x + 'px', top: p.a.y + 'px', '--dx': (p.b.x - p.a.x) + 'px', '--dy': (p.b.y - p.a.y) + 'px', animationDuration: p.ms + 'ms' }}>{p.t}</span>
);

// Ilova ekranlari (telefon ichida). «O'yin» — hook (9-darsdagi prototip): «8 / 10», ismsiz doiralar, «Qo'shilaman»
const OyinEkran = ({ qoshildi, bosildi }) => {
  const son = qoshildi ? 9 : 8;
  const o = OYINLAR[0];
  return (
    <span className="fd-oyin">
      <span className="fd-oyin-orqa">‹ {tr(POYDEVOR.ekran.oyinlar)}</span>
      <b className="fd-oyin-sar">{tr(o.kun)}, {o.soat}</b>
      <span className="fd-oyin-joy">{tr(o.maydon)}</span>
      <b key={son} className={cxx('fd-son', qoshildi && 'yangi')}>{son} / {o.kerak}</b>
      <span className="fd-doiralar" aria-hidden="true">{Array.from({ length: o.kerak }, (_, i) => <i key={i} className={cxx(i < son && 'bor', qoshildi && i === son - 1 && 'yangi')} />)}</span>
      <span className={cxx('fd-tel-btn', bosildi && 'bos', qoshildi && 'off')}>{qoshildi ? tr({ uz: "Qo'shildingiz", ru: 'Вы присоединились' }) : tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
    </span>
  );
};
const FormaEkran = ({ tur, bosildi }) => (
  <span className="fd-forma">
    <b className="fd-tel-sar">{tr(POYDEVOR.ekran[tur])}</b>
    {POYDEVOR.forma.filter(f => tur === 'royxat' || f.k !== 'ism').map(f => (
      <span key={f.k} className="fd-maydon"><small>{tr(f.l)}</small>{f.v}</span>
    ))}
    <span className={cxx('fd-tel-btn', bosildi && 'bos')}>{tr(POYDEVOR.ekran[tur])}</span>
  </span>
);
// royxat: 'bosh' — kulrang bo'sh joylar · 'xato' — Network request failed · 'tola' — to'rt karta (eng yangisi tepada); toliq — kartada «N kishi kerak» ham
const OyinlarEkran = ({ royxat, toliq }) => (
  <span className="fd-oyinlar">
    <b className="fd-tel-sar">{tr(POYDEVOR.ekran.oyinlar)}</b>
    {royxat === 'xato'
      ? <code className="fd-tel-xato">Network request failed</code>
      : OYINLAR_YANGI.map((o, i) => (royxat === 'bosh'
        ? <span key={o.id} className="fd-karta bosh" />
        : <span key={o.id} className="fd-karta" style={{ '--d': (0.06 + i * 0.1) + 's' }}>
          <b>{tr(o.kun)}, {o.soat}</b>
          <span>{tr(o.maydon)}{toliq && <> · {tr({ uz: `${o.kerak} kishi kerak`, ru: `нужно ${o.kerak} чел.` })}</>}</span>
        </span>))}
  </span>
);
// A2: telefon brauzeri — Render manzili, tokensiz 401
const BrauzerEkran = () => (
  <span className="fd-brauzer">
    <span className="fd-br-manzil">maydon-jamoa-….onrender.com/oyinlar</span>
    <span className="fd-br-tana"><b>401</b><span>Unauthorized</span></span>
  </span>
);

// Telefon = ilova (SABOQ 22–23): o'lchami barqaror 172×272 — hamma ekranda bir xil. Ustida «Expo Go» yorlig'i (alohida «ilova» qutisi yo'q),
// ichida «Maydon Jamoa» nomi o'z rangida (logotip yo'q). Pastda qulf-quti expo-secure-store (bo'sh / ichida token) — qulf berilgan ekranlarda.
const Telefon = ({ ekran, yorliq, tex = true, qulf, qulfYon, fokus, qora, bosildi, royxat = 'tola', toliq, qoshildi, children, className }) => (
  <div className={cxx('fd-tel-ust', className)}>
    {yorliq || (tex && <span className="fd-tel-tex">{POYDEVOR.ilova.tex}</span>)}
    <div className="fd-telefon">
      {ekran === 'brauzer' ? <BrauzerEkran /> : (
        <div className="fd-tel-ekran" key={ekran}>
          <span className="fd-tel-bar"><b className="fd-tel-nom">{POYDEVOR.ilova.nom}</b></span>
          {ekran === 'oyin' && <OyinEkran qoshildi={qoshildi} bosildi={bosildi} />}
          {(ekran === 'royxat' || ekran === 'kirish') && <FormaEkran tur={ekran} bosildi={bosildi} />}
          {ekran === 'oyinlar' && <OyinlarEkran royxat={royxat} toliq={toliq} />}
        </div>
      )}
      {qulf !== undefined && (
        <div className={cxx('fd-qulf', qulf && 'bor', qulfYon && 'yon', fokus && 'fokus')}>
          <span className="fd-qulf-n"><i className="fd-qulf-ic" aria-hidden="true" />{POYDEVOR.ilova.qulf}</span>
          <span className="fd-qulf-joy">{qulf && <code className="fd-token">token</code>}</span>
        </div>
      )}
      {qora && <span className="fd-tel-qora" aria-hidden="true" />}
    </div>
    {children}
  </div>
);

// Backend qutisi: uch yo'l (GET /oyinlar — qulf belgisi bilan) · joy yorlig'i (laptop / Render) · kirishda «parol ↔ parol_hash» solishtiruvi · Render'da JWT_SECRET qatori
const BackendQuti = ({ joy, yol = {}, yollar = true, solishtir, getOchiq, jwt, jwtYon, chiroq, holat, be }) => (
  <div className={cxx('fd-be', holat)} data-be={be}>
    <span className="fd-be-h"><b>Backend</b>{chiroq && <i className="fd-chiroq" aria-hidden="true" />}</span>
    {joy && <code className="fd-be-joy">{POYDEVOR.backend.joy[joy]}</code>}
    {yollar && POYDEVOR.backend.yollar.map(y => (
      <span key={y.k} className={cxx('fd-yol', yol[y.k])} data-yol={y.k}><code>{y.t}</code>{y.qulf && <i className={cxx('fd-qulf-b', getOchiq && 'ochiq')} aria-hidden="true" />}</span>
    ))}
    {solishtir && <span className="fd-solish">{tr({ uz: 'parol', ru: 'пароль' })} ↔ <code>parol_hash</code><b>✓</b></span>}
    {jwt && <span className={cxx('fd-jwt', jwtYon && 'yon')}><i className="fd-qulf-b" aria-hidden="true" /><code>JWT_SECRET</code></span>}
  </div>
);
const Jadval = ({ nom, ustun = [], qatorlar = [], yangiK, yon, xira, bosh, children }) => (
  <div className={cxx('fd-jad', yon && 'yon', xira && 'xira')} data-j={nom}>
    <code className="fd-jad-n">{nom}</code>
    {!bosh && <table className="fd-jt">
      <thead><tr>{ustun.map(u => <th key={u}>{u}</th>)}</tr></thead>
      <tbody>{qatorlar.map(q => <tr key={q.k} className={cxx(yangiK === q.k && 'kir')}>{q.c.map((v, j) => <td key={j} className={q.td && q.td[j]}>{tr(v)}</td>)}</tr>)}</tbody>
    </table>}
    {children}
  </div>
);
// Database · Neon: uch jadval. ixcham — faqat jadval kartalari (Reja chizmasi)
const DbQuti = ({ ixcham, ali, yangiK, hashYon, oyinlarYon, faqatOyinchi }) => {
  const bosh = 'ishtirokchilar'; // bu darsda bo'sh jadval (qo'shilish — keyingi darslar), kulrang
  if (ixcham) return (
    <div className="fd-db">
      <span className="fd-db-h">{POYDEVOR.db.nom}</span>
      <span className="fd-db-kartalar">{['oyinchilar', 'oyinlar', 'ishtirokchilar'].map(n => <code key={n} data-j={n} className={cxx('fd-db-k', n === 'oyinlar' && oyinlarYon && 'yon', n === bosh && 'xira')}>{n}</code>)}</span>
    </div>
  );
  const oq = [{ k: 'p1', c: POYDEVOR.db.tashkilotchi }];
  if (ali) oq.push({ k: 'p2', c: POYDEVOR.db.ali, td: [null, null, null, hashYon && 'hash'] });
  return (
    <div className="fd-db">
      <span className="fd-db-h">{POYDEVOR.db.nom}</span>
      <Jadval nom="oyinchilar" ustun={POYDEVOR.db.oyinchilar} qatorlar={oq} yangiK={yangiK}>
        {hashYon && <span className="fd-hash-y">{tr({ uz: "paroldan yasalgan satr — parolning o'zi emas", ru: 'строка, сделанная из пароля, — не сам пароль' })}</span>}
      </Jadval>
      <Jadval nom="oyinlar" ustun={POYDEVOR.db.oyinlar} qatorlar={OYINLAR_QATOR} yon={oyinlarYon} xira={faqatOyinchi} bosh={faqatOyinchi} />
      <Jadval nom="ishtirokchilar" bosh xira />
    </div>
  );
};
// Poydevor xaritasi: chapda telefon → o'rtada Backend → o'ngda Database (SABOQ 21: telefon doim chapda). ixcham — Backend va Database ustma-ust (Reja ustuni)
const PoydevorXarita = ({ boxRef, parvoz = [], tel, be, db, ixcham, pastki }) => (
  <div className={cxx('fd-xar-ust', ixcham && 'ixcham')} ref={boxRef}>
    <div className="fd-xar">
      <div className="fd-xar-tel">{tel}</div>
      <i className="fd-yolak" aria-hidden="true" />
      {ixcham
        ? <div className="fd-xar-ong">{be}<i className="fd-pastga" aria-hidden="true" />{db}</div>
        : <>{be}<i className="fd-yolak b2" aria-hidden="true" />{db}</>}
    </div>
    {pastki}
    {parvoz.map(p => <Konvert key={p.k} p={p} />)}
  </div>
);

// Bashorat (SABOQ 11/19): karta halqada, variantlar navbat bilan chiqadi; tanlangach ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi
const TaxminIxcham = ({ savol, javob }) => (
  <div className="fd-taxmin"><span className="fd-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="fd-taxmin-s">{savol}</span><b>{javob}</b></div>
);
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="fd-navbat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <TaxminIxcham savol={savol} javob={tr((variantlar.find(v => v.k === tanlov) || {}).t)} />);
// Natija bloki (SABOQ 25): bitta yashil blok — birinchi qator taxmin, so'ng joriy qator (bo'lsa) va xulosa
const NatijaBlok = ({ togri, haqiqat, izoh, xulosa }) => (
  <div className="q-xulosa fd-nb">
    <span className={cxx('fd-nb-t', togri && 'ok')}>{togri ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение подтвердилось' })}</> : haqiqat}</span>
    {izoh && <span className="fd-nb-i">{izoh}</span>}
    <span className="fd-nb-x">{xulosa}</span>
  </div>
);
const Haqiqat = ({ taxmin, haqiqat }) => <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {taxmin} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></>;

// ===== SCREEN 0 — KIRISH (QKirish): ikki telefonda prototip, «Qo'shilaman» — tashkilotchi ko'radimi? Ballsiz (J-026) =====
const HOOK_OPTS = [
  { id: 'a', t: { uz: "Ko'radi — ikkala telefonda bir xil ilova turibdi", ru: 'Увидит — на обоих телефонах одно и то же приложение' } },
  { id: 'b', t: { uz: "Ko'rmaydi — bosish faqat o'yinchi telefonida qoladi", ru: 'Не увидит — нажатие остаётся только на телефоне игрока' } },
  { id: 'c', t: { uz: "Ko'rmaydi — tashkilotchi ilovani qayta ochmaguncha", ru: 'Не увидит — пока организатор не откроет приложение заново' } }
];
const HOOK_JAVOB = {
  a: { uz: <><b>Qiziq fikr!</b> Ilova bir xil, lekin ma'lumot har telefonning o'zida. Ikkala telefon so'raydigan umumiy joy hali yo'q.</>, ru: <><b>Интересная мысль!</b> Приложение одно, но данные — на каждом телефоне свои. Общего места, к которому обращаются оба телефона, пока нет.</> },
  b: { uz: <><b>Aynan!</b> Prototipda o'yinlar har telefonning o'zida — namuna ma'lumot. Ikkala telefon so'raydigan umumiy joy hali yo'q.</>, ru: <><b>Именно!</b> В прототипе игры лежат на каждом телефоне — это образцы данных. Общего места для обоих телефонов пока нет.</> },
  c: { uz: <><b>Qiziq fikr!</b> Qayta ochilsa ham prototip o'z namuna ma'lumotini ko'rsatadi. Ikkala telefonga umumiy joy kerak.</>, ru: <><b>Интересная мысль!</b> Даже после перезапуска прототип показывает свои образцы данных. Обоим телефонам нужно общее место.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [bos, setBos] = useState(false);
  const [qoshildi, setQoshildi] = useState(avval);
  const [orada, setOrada] = useState(avval);
  const [sc, setSc] = useState(0);
  const ms = (x) => (kam ? 0 : x);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); setSc(n => n + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    keyin(() => setBos(true), ms(350));
    keyin(() => { setBos(false); setQoshildi(true); }, ms(750));
    keyin(() => { setOrada(true); setSc(n => n + 1); }, ms(1500));
  };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Qo'shilgan o'yinchini <span className="italic" style={{ color: T.accent }}>tashkilotchi telefoni</span> ko'radimi?</>, ru: <>Увидит ли <span className="italic" style={{ color: T.accent }}>телефон организатора</span> нового игрока?</> })}
        mentor={<Mentor>{picked === null
          ? tr({ uz: "Ikki telefonda 9-darsdagi prototip ochiq: chapda o'yinchi, o'ngda tashkilotchi. O'yinchi Shanba 18:00 dagi o'yinga qo'shilmoqchi — avval javobni tanlang.", ru: 'На двух телефонах открыт прототип из 9-го урока: слева игрок, справа организатор. Игрок хочет присоединиться к игре в субботу в 18:00 — сначала выберите ответ.' })
          : tr({ uz: "«Davom etish»ni bosing — bugungi rejani ko'rasiz.", ru: 'Нажмите «Продолжить» — увидите план на сегодня.' })}</Mentor>}
        maket={<div className={cxx('fd-ikki', picked === null && 'kutish')}>
          <Telefon ekran="oyin" tex={false} yorliq={<span className="fd-tel-yorliq b1">{tr({ uz: "1-telefon · o'yinchi", ru: 'Телефон 1 · игрок' })}</span>} qoshildi={qoshildi} bosildi={bos} className="fd-t1" />
          <Telefon ekran="oyin" tex={false} yorliq={<span className="fd-tel-yorliq b2">{tr({ uz: '2-telefon · tashkilotchi', ru: 'Телефон 2 · организатор' })}</span>} className="fd-t2" />
          {orada && <div className="fd-orada"><i className="fd-orada-ch" aria-hidden="true" /><span className="fd-orada-k">{tr({ uz: "umumiy joy — hali yo'q", ru: 'общего места — пока нет' })}</span></div>}
        </div>}
        savol={tr({ uz: 'Sizningcha, qaysi biri?', ru: 'Как вы думаете, какой вариант?' })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Dars oxirida» — xarita tayyor holatda bir marta o'zi yuradi (DE-200); o'ngda 3 qadam (tegsiz, 172) =====
const REJA = [
  { uz: "Database va kirish: o'yinchi kiradi va token oladi", ru: 'Database и вход: игрок входит и получает токен' },
  { uz: "Backend Render'da: telefon unga Internet orqali ulanadi", ru: 'Backend на Render: телефон подключается к нему через Интернет' },
  { uz: "Ilova Backend'ga ulanadi: o'yinlar Database'dan keladi", ru: 'Приложение подключается к Backend: игры приходят из Database' }
];
const RejaXarita = () => {
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [b, setB] = useState(kam ? 9 : 0);
  useEffect(() => {
    if (kam) return;
    const D = PARVOZ_MS;
    const t1 = 600, t2 = t1 + D, t3 = t2 + 200, t4 = t3 + D, t5 = t4 + 450, t6 = t5 + D, t7 = t6 + D, t8 = t7 + D;
    keyin(() => setB(1), t1);
    keyin(() => uchir('.fd-telefon', '[data-yol="kirish"]', 'POST /kirish'), t1 + 120);
    keyin(() => setB(2), t2 + 120);
    keyin(() => uchir('[data-yol="kirish"]', '.fd-qulf', 'token', 'javob'), t3);
    keyin(() => setB(3), t4);
    keyin(() => uchir('.fd-qulf', '[data-yol="oyinlar"]', 'GET /oyinlar + token'), t5);
    keyin(() => { setB(4); uchir('[data-yol="oyinlar"]', '[data-j="oyinlar"]', ''); }, t6);
    keyin(() => { setB(5); uchir('[data-j="oyinlar"]', '.fd-telefon', '', 'javob'); }, t7);
    keyin(() => setB(6), t8);
  }, []); // eslint-disable-line
  return (
    <PoydevorXarita ixcham boxRef={box} parvoz={parvoz}
      tel={<Telefon ekran={b >= 6 ? 'oyinlar' : 'kirish'} bosildi={b === 1} qulf={b >= 3 ? 'token' : ''} qulfYon={b === 3} />}
      be={<BackendQuti joy="render" yol={{ kirish: b >= 2 ? 'ok' : b === 1 ? 'on' : '', oyinlar: b >= 4 ? 'ok' : '' }} getOchiq={b >= 4} holat={b >= 1 && b < 6 ? 'on' : ''} />}
      db={<DbQuti ixcham oyinlarYon={b >= 5} />} />
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Dars oxirida ilova <span className="italic" style={{ color: T.accent }}>internetdagi Backend'ga</span> ulanadi.</>, ru: <>К концу урока приложение <span className="italic" style={{ color: T.accent }}>подключится к Backend</span> в сети.</> })}
      mentor={<Mentor>{tr({ uz: "Bugun tanlangan stekda ilova Backend'ga ulanadi. Database, kirish va deploy — har funksiyadan oldin kerak bo'lgan bu qism poydevor deyiladi.", ru: 'Сегодня в выбранном стеке приложение подключается к Backend. Database, вход и деплой — эта часть, нужная перед каждой функцией, называется фундаментом.' })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida', ru: 'К концу урока' })}
      chap={<RejaXarita />}
      ongYorliq={tr({ uz: 'Bugungi 3 qadam', ru: '3 шага на сегодня' })}
      qadamlar={REJA.map(t => ({ t: tr(t) }))}>
      <div className="fd-reja-past fade-up">
        <p className="fd-reja-repo">repo <code>maydon-jamoa</code> · {tr({ uz: "boshlang'ich holat", ru: 'начальное состояние' })} <code>m11-dars-10-start</code> · {tr({ uz: 'namuna', ru: 'образец' })} <code>m11-dars-10-done</code></p>
        <p className="fd-reja-izoh">{tr({ uz: "«Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz.", ru: '«Maydon Jamoa» — образец; практику вы делаете на своём продукте.' })}</p>
      </div>
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — TUSHUNCHA (QTushuncha keng): parol bir marta, keyin token. Bashorat → uch tugma navbat bilan (telefon ostida, SABOQ 21) → konvertlar → natija =====
const S2_TAXMIN = [{ k: 'kirish', t: { uz: '«Kirish» ekranini', ru: 'Экран «Вход»' } }, { k: 'oyinlar', t: { uz: "«O'yinlar» ro'yxatini", ru: 'Список «Игры»' } }];
const S2_QADAM = [{ uz: "Ro'yxatdan o'tish", ru: 'Регистрация' }, { uz: 'Kirish', ru: 'Вход' }, { uz: 'Ilovani qayta ochish', ru: 'Открыть приложение заново' }];
const S2_BOSH = { tel: 'royxat', bos: false, qulf: '', qulfYon: false, yol: {}, solish: false, getOchiq: false, ali: false, yangiK: null, hashYon: false, oyinlarYon: false, qora: false, royxat: 'tola', beHolat: '' };
const S2_OXIRI = { ...S2_BOSH, tel: 'oyinlar', qulf: 'token', yol: { royxat: 'ok', kirish: 'ok', oyinlar: 'ok' }, solish: true, getOchiq: true, ali: true, hashYon: true };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 3 : 0);
  const [yur, setYur] = useState(false);
  const [v, setV] = useState(() => (avval ? S2_OXIRI : S2_BOSH));
  const qoy = (o) => setV(x => ({ ...x, ...o, yol: { ...x.yol, ...(o.yol || {}) } }));
  const done = n >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const D = ms(PARVOZ_MS);
  const tugat = (k, t) => keyin(() => { setN(k); setYur(false); }, t);
  const qadam = () => {
    if (yur || n >= 3 || !taxmin) return;
    setYur(true);
    if (n === 0) {
      qoy({ bos: true, yol: { royxat: 'on' }, beHolat: 'on' });
      uchir('.fd-telefon', '[data-yol="royxat"]', 'POST /royxat { ism, telefon, parol }');
      keyin(() => { qoy({ bos: false }); uchir('[data-yol="royxat"]', '[data-j="oyinchilar"]', ''); }, D);
      keyin(() => qoy({ ali: true, yangiK: 'p2', hashYon: true, yol: { royxat: 'ok' } }), 2 * D);
      keyin(() => qoy({ tel: 'kirish', beHolat: '' }), 2 * D + ms(1100));
      tugat(1, 2 * D + ms(1100));
    } else if (n === 1) {
      qoy({ bos: true, yangiK: null, yol: { kirish: 'on' }, beHolat: 'on' });
      uchir('.fd-telefon', '[data-yol="kirish"]', 'POST /kirish { telefon, parol }');
      keyin(() => qoy({ bos: false, solish: true }), D);
      keyin(() => { qoy({ yol: { kirish: 'ok' } }); uchir('[data-yol="kirish"]', '.fd-qulf', 'token', 'javob'); }, D + ms(550));
      keyin(() => qoy({ qulf: 'token', qulfYon: true }), 2 * D + ms(550));
      keyin(() => { qoy({ qulfYon: false }); uchir('.fd-qulf', '[data-yol="oyinlar"]', 'GET /oyinlar + token'); }, 2 * D + ms(1000));
      keyin(() => { qoy({ getOchiq: true, yol: { oyinlar: 'ok' } }); uchir('[data-yol="oyinlar"]', '[data-j="oyinlar"]', ''); }, 3 * D + ms(1000));
      keyin(() => { qoy({ oyinlarYon: true }); uchir('[data-j="oyinlar"]', '.fd-telefon', '', 'javob'); }, 4 * D + ms(1000));
      keyin(() => qoy({ tel: 'oyinlar', beHolat: '' }), 5 * D + ms(1000));
      tugat(2, 5 * D + ms(1000));
    } else {
      qoy({ qora: true, oyinlarYon: false, getOchiq: false, yol: { oyinlar: '' } });
      keyin(() => qoy({ qora: false, royxat: 'bosh' }), ms(560));
      keyin(() => { qoy({ qulfYon: true, beHolat: 'on' }); uchir('.fd-qulf', '[data-yol="oyinlar"]', 'GET /oyinlar + token'); }, ms(820));
      keyin(() => { qoy({ qulfYon: false, getOchiq: true, yol: { oyinlar: 'ok' } }); uchir('[data-yol="oyinlar"]', '[data-j="oyinlar"]', ''); }, ms(820) + D);
      keyin(() => { qoy({ oyinlarYon: true }); uchir('[data-j="oyinlar"]', '.fd-telefon', '', 'javob'); }, ms(820) + 2 * D);
      keyin(() => qoy({ royxat: 'tola', beHolat: '' }), ms(820) + 3 * D);
      tugat(3, ms(820) + 3 * D);
    }
  };
  const qi = Math.min(n, 2);
  const tx2 = S2_TAXMIN.find(x => x.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · kirish', ru: 'Понятие · вход' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }) : !done ? tr({ uz: 'Tugmalarni navbat bilan bosing', ru: 'Нажимайте кнопки по очереди' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ilova qayta ochilsa, <span className="italic" style={{ color: T.accent }}>parol yana so'raladimi</span>?</>, ru: <>Если открыть приложение снова, <span className="italic" style={{ color: T.accent }}>спросит ли оно пароль</span>?</> })}
        mentor={<Mentor>{!taxmin
          ? tr({ uz: "Avval taxminingizni belgilang, keyin o'yinchi bo'lib ro'yxatdan o'ting.", ru: 'Сначала отметьте предположение, потом зарегистрируйтесь как игрок.' })
          : !done ? tr({ uz: 'Navbatdagi tugmani bosing va Database bilan telefonda nima o\'zgarishini kuzating.', ru: 'Нажмите следующую кнопку и следите, что меняется в Database и на телефоне.' })
            : tr({ uz: 'Uchala qadam tugadi — natijani taxminingiz bilan solishtiring.', ru: 'Все три шага пройдены — сравните результат со своим предположением.' })}</Mentor>}
        bashorat={<Bashorat savol={tr({ uz: 'Qayta ochilganda ilova nima ko\'rsatadi?', ru: 'Что покажет приложение при повторном открытии?' })} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<PoydevorXarita boxRef={box} parvoz={parvoz}
          tel={<Telefon ekran={v.tel} bosildi={v.bos} qulf={v.qulf} qulfYon={v.qulfYon} fokus={tugadi} qora={v.qora} royxat={v.royxat}>
            {taxmin && !done && <QTugma className={yur ? undefined : 'fd-navbat'} disabled={yur} onClick={qadam}>{tr(S2_QADAM[qi])}<small className="fd-qn">{qi + 1}/3</small></QTugma>}
          </Telefon>}
          be={<BackendQuti yol={v.yol} solishtir={v.solish} getOchiq={v.getOchiq} holat={v.beHolat} />}
          db={<DbQuti ali={v.ali} yangiK={v.yangiK} hashYon={v.hashYon} oyinlarYon={v.oyinlarYon} faqatOyinchi={tugadi} />}
          pastki={n >= 2 && !done && <p className="fd-joriy fade-step">{tx({ uz: 'Token telefonda `expo-secure-store` da turadi — u qiymatni shifrlab saqlaydi.', ru: 'Токен хранится на телефоне в `expo-secure-store` — он сохраняет значение в зашифрованном виде.' })}</p>} />}
        natija={done && tx2 && <NatijaBlok togri={taxmin === 'oyinlar'}
          haqiqat={<Haqiqat taxmin={tr(tx2.t)} haqiqat={tr({ uz: "«O'yinlar» — token telefonda saqlangan edi", ru: '«Игры» — токен был сохранён на телефоне' })} />}
          xulosa={tr({ uz: "Kirishda parol yoziladi; token telefonda saqlansa, qayta ochganda parol so'ralmaydi.", ru: 'При входе вводится пароль; если токен сохранён на телефоне, при повторном открытии пароль не спрашивается.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — TEST 1 (QuestionScreen → QTest; INLINE_KEYS.s3 = 2, C). Savol ustida yorliq yo'q (SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="O'yinchi ilovani yopib, kechqurun qayta ochdi. Ilova uni qanday taniydi?"
    question={tr({ uz: <h2 className="title h-ask">O'yinchi ilovani yopib, kechqurun qayta ochdi. Ilova uni <span className="italic" style={{ color: T.accent }}>qanday taniydi</span>?</h2>, ru: <h2 className="title h-ask">Игрок закрыл приложение и вечером открыл снова. <span className="italic" style={{ color: T.accent }}>Как приложение его узнаёт</span>?</h2> })}
    options={[
      { uz: "Telefon raqamini Database'dan qidirib topadi", ru: 'Ищет номер телефона в Database' },
      { uz: "Telefonda saqlangan parolni Backend'ga qayta yuboradi", ru: 'Снова отправляет в Backend пароль, сохранённый на телефоне' },
      { uz: "Telefonda saqlangan tokenni so'rovga qo'shadi", ru: 'Добавляет к запросу токен, сохранённый на телефоне' },
      { uz: "Database'dagi tokenni o'qib, o'zi tekshirib ko'radi", ru: 'Читает токен из Database и сам его проверяет' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Token telefonda saqlangan — ilova uni yopiq so'rovlarga qo'shadi.", ru: 'Токен сохранён на телефоне — приложение добавляет его к закрытым запросам.' }}
    explainWrong={{
      0: { uz: "Telefon raqami ochiq — u o'yinchi kimligini isbotlamaydi.", ru: 'Номер телефона открыт — он не доказывает, кто игрок.' },
      1: { uz: "Parol telefonda saqlanmaydi — u kirishda yoziladi.", ru: 'Пароль не хранится на телефоне — его вводят при входе.' },
      3: { uz: "Token Database'ga yozilmaydi. Backend uni kimga bergan edi?", ru: 'Токен не записывается в Database. Кому его выдал Backend?' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA (QTushuncha keng, harakat tepada): ilova .env iga qaysi qator? Qatorlar bittadan katta karta (SABOQ 9, 13) =====
const S4_TAXMIN = [{ k: '1', t: { uz: 'Bittasi', ru: 'Одна' } }, { k: '2', t: { uz: 'Ikkitasi', ru: 'Две' } }, { k: '3', t: { uz: 'Uchalasi', ru: 'Все три' } }];
const S4_QATORLAR = [
  { kalit: 'EXPO_PUBLIC_API_URL', qiymat: 'http://localhost:3000', natija: 'xato', yorliq: { uz: "Telefonda `localhost` — telefonning o'zi.", ru: 'На телефоне `localhost` — это сам телефон.' } },
  { kalit: 'EXPO_PUBLIC_JWT_SECRET', qiymat: 'k3J9…', natija: 'xato', yorliq: { uz: "Ilovani olgan har kim bu qiymatni o'qiy oladi.", ru: 'Любой, у кого есть приложение, может прочитать это значение.' } },
  { kalit: 'EXPO_PUBLIC_API_URL', qiymat: 'https://maydon-jamoa-….onrender.com', natija: 'ok', yorliq: { uz: "Internetdagi manzil — telefon uni topadi.", ru: 'Адрес в интернете — телефон его находит.' } }
];
const IlovaIchi = ({ qatorlar }) => (
  <div className="fd-ichi">
    <span className="fd-ichi-h"><b>{tr(POYDEVOR.ichi.nom)}</b><code>{POYDEVOR.ichi.fayl}</code></span>
    <span className="fd-ichi-joy">
      {qatorlar.length === 0 && <i className="fd-ichi-bosh" aria-hidden="true" />}
      {qatorlar.map(e => {
        const q = S4_QATORLAR[e.i];
        return (
          <span key={e.i} className={cxx('fd-env', e.holat, e.i === 1 && 'jwt-qator')}>
            <code>{q.kalit}=<span className="fd-env-v">{q.qiymat}</span></code>
            {e.i === 1 && e.holat === 'xato' && <i className="fd-koz" aria-hidden="true" />}
            {e.holat === 'xato' && <b className="fd-env-b">✗</b>}
            {e.holat === 'ok' && <b className="fd-env-b">✓</b>}
            {e.i === 1 && e.holat === 'xato' && <span className="fd-env-y">{tr(q.yorliq)}</span>}
          </span>
        );
      })}
    </span>
  </div>
);
// Chapda telefon («O'yinlar») → o'ngda laptopdagi Backend va Render'dagi Backend; pastda «ilova ichi» kartasi (mobil/.env)
const ManzilXarita = ({ boxRef, parvoz = [], tel, renderYon, jwtYon, ichi, tugadi }) => (
  <div className="fd-xar-ust" ref={boxRef}>
    <div className="fd-mz">
      <div className="fd-xar-tel">{tel}</div>
      <i className="fd-yolak" aria-hidden="true" />
      <div className="fd-mz-ong">
        <BackendQuti be="laptop" joy="laptop" yollar={false} chiroq holat={tugadi ? 'xira' : ''} />
        <BackendQuti be="render" joy="render" yollar={false} jwt jwtYon={jwtYon} holat={renderYon ? 'ok' : ''} />
        {ichi}
      </div>
    </div>
    {parvoz.map(p => <Konvert key={p.k} p={p} />)}
  </div>
);
const QatorKarta = ({ i, natija, yur, onYoz }) => {
  const q = S4_QATORLAR[i];
  return (
    <QKarta className={cxx('fd-qk', natija)} key={i} yorliq={tr({ uz: `Qator ${i + 1} / 3`, ru: `Строка ${i + 1} / 3` })}>
      <code className="fd-qk-t">{q.kalit}={q.qiymat}</code>
      {natija
        ? <span className="fd-qk-n"><b>{natija === 'ok' ? '✓' : '✗'}</b>{i !== 1 && <span>{tx(q.yorliq)}</span>}</span>
        : <QTugma className={cxx(!yur && 'fd-navbat')} disabled={yur} onClick={onYoz}>{tr({ uz: "Yozib ko'rish", ru: 'Записать' })}</QTugma>}
    </QKarta>
  );
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const isNarrow = useIsMobile(768);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [i, setI] = useState(avval ? 3 : 0);
  const [natija, setNatija] = useState(null);
  const [yur, setYur] = useState(false);
  const [env, setEnv] = useState(avval ? [{ i: 2, holat: 'ok' }] : []);
  const [royxat, setRoyxat] = useState(avval ? 'tola' : 'bosh');
  const [jwtYon, setJwtYon] = useState(false);
  const [renderYon, setRenderYon] = useState(avval);
  const done = i >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const yoz = () => {
    if (yur || done || !taxmin) return;
    const r = i;
    setYur(true);
    const qk = isNarrow && document.querySelector('.fd-qk'); // telefonda (bir ustun): qator kartasi, telefon va «ilova ichi» bir ko'rinishda
    if (qk && qk.scrollIntoView) qk.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'start' });
    if (r > 0) setRoyxat('bosh');
    uchir('.fd-qk-t', '.fd-ichi-joy', S4_QATORLAR[r].kalit);
    const D = ms(PARVOZ_MS);
    keyin(() => setEnv(e => [...e, { i: r, holat: 'yangi' }]), D);
    const yakun = (tur, t) => {
      keyin(() => { setNatija(tur); setEnv(e => e.map(x => (x.i === r ? { ...x, holat: tur } : x))); }, t);
      keyin(() => { setNatija(null); setYur(false); setI(r + 1); if (tur === 'xato') setEnv(e => e.filter(x => x.i !== r)); }, t + ms(r === 2 ? 1300 : 2800));
    };
    if (r === 0) {
      keyin(() => uchir('.fd-telefon', '[data-be="laptop"]', 'GET /oyinlar', 'qayt', 1500), D + ms(250));
      keyin(() => setRoyxat('xato'), D + ms(1750));
      yakun('xato', D + ms(1850));
    } else if (r === 1) {
      keyin(() => setJwtYon(true), D + ms(300));
      keyin(() => setJwtYon(false), D + ms(1700));
      yakun('xato', D + ms(300));
    } else {
      keyin(() => uchir('.fd-telefon', '[data-be="render"]', 'GET /oyinlar'), D + ms(250));
      keyin(() => { setRenderYon(true); uchir('[data-be="render"]', '.fd-telefon', '', 'javob'); }, 2 * D + ms(250));
      keyin(() => setRoyxat('tola'), 3 * D + ms(250));
      yakun('ok', 3 * D + ms(450));
    }
  };
  const tx4 = S4_TAXMIN.find(x => x.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ilova manzili', ru: 'Понятие · адрес приложения' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }) : !done ? tr({ uz: "Qatorlarni yozib ko'ring", ru: 'Запишите строки' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Ilovaning <code className="qcode">.env</code> fayliga <span className="italic" style={{ color: T.accent }}>qaysi qator</span> yoziladi?</>, ru: <>Какая строка пишется <span className="italic" style={{ color: T.accent }}>в файл <code className="qcode">.env</code></span> приложения?</> })}
        mentor={<Mentor>{!taxmin
          ? tr({ uz: "Avval taxminingizni belgilang, keyin qatorlarni bittadan yozib ko'ring.", ru: 'Сначала отметьте предположение, потом запишите строки по одной.' })
          : !done ? tr({ uz: "«Yozib ko'rish»ni bosing — telefon va «ilova ichi» kartasida nima bo'lishini kuzating.", ru: 'Нажмите «Записать» — следите, что происходит на телефоне и в карточке «внутри приложения».' })
            : tr({ uz: "Uchala qator yozib ko'rildi — natijani taxminingiz bilan solishtiring.", ru: 'Все три строки проверены — сравните результат со своим предположением.' })}</Mentor>}
        bashorat={<Bashorat savol={tr({ uz: 'Uch qatordan nechtasi ilovaga yoziladi?', ru: 'Сколько из трёх строк пишется в приложение?' })} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={taxmin && !done && <QatorKarta i={Math.min(i, 2)} natija={natija} yur={yur} onYoz={yoz} />}
        vizual={<ManzilXarita boxRef={box} parvoz={parvoz} renderYon={renderYon} jwtYon={jwtYon} tugadi={tugadi}
          tel={<Telefon ekran="oyinlar" royxat={royxat} />}
          ichi={<IlovaIchi qatorlar={env} />} />}
        natija={done && tx4 && <NatijaBlok togri={taxmin === '1'}
          haqiqat={<Haqiqat taxmin={tr(tx4.t)} haqiqat={tr({ uz: 'bittasi — internetdagi Backend manzili', ru: 'одна — адрес Backend в интернете' })} />}
          izoh={tx({ uz: "`EXPO_PUBLIC_` bilan boshlangan qiymat ilova ichiga ochiq matn bo'lib yoziladi.", ru: 'Значение, начинающееся с `EXPO_PUBLIC_`, записывается внутрь приложения открытым текстом.' })}
          xulosa={tr({ uz: "Ilovaga faqat internetdagi Backend manzili yoziladi. Maxfiy kalit faqat Backend'da turadi.", ru: 'В приложение пишется только адрес Backend в интернете. Секретный ключ хранится только в Backend.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — TEST 2 (QuestionScreen → QTest; INLINE_KEYS.s5 = 1, B) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Backend Render'ga chiqdi. JWT_SECRET qayerda turishi kerak?"
    question={tr({ uz: <h2 className="title h-ask">Backend Render'ga chiqdi. <code className="qcode">JWT_SECRET</code> <span className="italic" style={{ color: T.accent }}>qayerda turishi</span> kerak?</h2>, ru: <h2 className="title h-ask">Backend вышел на Render. <span className="italic" style={{ color: T.accent }}>Где должен храниться</span> <code className="qcode">JWT_SECRET</code>?</h2> })}
    options={[
      { uz: "Ilovaning `.env` ida — `EXPO_PUBLIC_` bilan boshlanib", ru: 'В `.env` приложения — с приставкой `EXPO_PUBLIC_`' },
      { uz: "Render'da — Backend'ning Environment bo'limida", ru: 'На Render — в разделе Environment у Backend' },
      { uz: 'Talab matnida — agent ham bilib tursin deb', ru: 'В тексте требования — чтобы агент тоже знал' },
      { uz: "`README.md` da — Render uni o'sha yerdan o'qisin deb", ru: 'В `README.md` — чтобы Render читал его оттуда' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Maxfiy kalit Backend'da turadi: ilova va repo uni ko'rmaydi.", ru: 'Секретный ключ хранится в Backend: ни приложение, ни репо его не видят.' }}
    explainWrong={{
      0: { uz: "`EXPO_PUBLIC_` qiymati ilova ichida ochiq ko'rinadi.", ru: 'Значение `EXPO_PUBLIC_` видно внутри приложения открыто.' },
      2: { uz: "Talab README'da va chatda qoladi — kalitga joy emas.", ru: 'Требование остаётся в README и в чате — это не место для ключа.' },
      3: { uz: "README'da faqat nomlar turadi — u GitHub'da ochiq.", ru: 'В README только названия — он открыт на GitHub.' }
    }} />
);

// ===== 🏅 BADGES (nishonlar, 3) — ikki savol (birinchi urinish) + bonus: 3-amaliyot oxirgi «Bajardim» (birinchi urinish sharti yo'q) =====
const ACHIEVEMENTS = {
  tokenKeeper: { icon: '🔑', name: 'Token Keeper', desc: { uz: "Ilova o'yinchini telefondagi token bilan tanishini topdingiz", ru: 'Вы нашли, что приложение узнаёт игрока по токену на телефоне' } },
  secretSafe: { icon: '🛡️', name: 'Secret Safe', desc: { uz: "Maxfiy kalit Backend'da turishini topdingiz", ru: 'Вы нашли, что секретный ключ хранится в Backend' } },
  foundationReady: { icon: '🧱', name: 'Foundation Ready', desc: { uz: 'Uch amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили все три блока практики до конца' } }
};
// Ekran id → nishon. Savollar — birinchi urinishda to'g'ri; a3 — oxirgi «Bajardim» (bonus).
const ACH_TRIGGERS = { s3: 'tokenKeeper', s5: 'secretSafe', a3: 'foundationReady' };

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
  4: { uz: '1 — Token telefonda', ru: '1 — Токен на телефоне' },
  7: { uz: '2 — Maxfiy kalit joyi', ru: '2 — Место секретного ключа' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi fon so'zlari — darsning o'z atamalari (MD, R-008: o'quvchi so'zi {uz, ru}; kod-belgi va nom o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: { uz: 'poydevor', ru: 'фундамент' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: 'Database', l: 80, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: 'Backend', l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'token', l: 74, t: 66, s: 26, d: 21, dl: 2.2 },
  { ch: 'hash', l: 44, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: 'expo-secure-store', l: 58, t: 24, s: 20, d: 17, dl: 0.4 },
  { ch: 'EXPO_PUBLIC_API_URL', l: 22, t: 40, s: 18, d: 20, dl: 1.9 },
  { ch: 'Render', l: 20, t: 18, s: 24, d: 18, dl: 2.9 },
  { ch: 'Neon', l: 88, t: 40, s: 24, d: 22, dl: 0.6 },
  { ch: '401', l: 36, t: 58, s: 26, d: 24, dl: 1.3 },
  { ch: 'POST /kirish', l: 62, t: 82, s: 20, d: 26, dl: 2.5 },
  { ch: 'Maydon Jamoa', l: 4, t: 46, s: 20, d: 21, dl: 3.1 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD), to'g'ri javob o'rni A·B·C·D ×3 (3/3/3/3).
const QUIZ_BANK = [
  { q: { uz: 'Ilova kirgan o\'yinchini keyingi so\'rovlarda qanday taniydi?', ru: 'Как приложение узнаёт вошедшего игрока в следующих запросах?' }, opts: [{ uz: 'Telefonda saqlangan token orqali', ru: 'По токену, сохранённому на телефоне' }, { uz: 'Har safar telefon raqamini so\'rab', ru: 'Каждый раз спрашивая номер телефона' }, { uz: 'Database\'dagi parolni o\'qib chiqib', ru: 'Прочитав пароль из Database' }, { uz: 'Expo Go akkauntining nomi orqali', ru: 'По имени аккаунта Expo Go' }], correct: 0 },
  { q: { uz: '`oyinchilar` jadvalida parol qanday turadi?', ru: 'Как хранится пароль в таблице `oyinchilar`?' }, opts: [{ uz: 'Parolning o\'zi, ochiq matn bo\'lib', ru: 'Сам пароль, открытым текстом' }, { uz: 'Paroldan yasalgan hash bo\'lib', ru: 'Хешем, сделанным из пароля' }, { uz: 'Telefon raqamiga qo\'shib yozilib', ru: 'Дописанным к номеру телефона' }, { uz: 'Token ichiga joylab qo\'yilib', ru: 'Вложенным внутрь токена' }], correct: 1 },
  { q: { uz: 'Tokensiz `GET /oyinlar` so\'rovi kelsa, Backend nima qiladi?', ru: 'Что делает Backend, если пришёл `GET /oyinlar` без токена?' }, opts: [{ uz: 'O\'yinlarning to\'liq ro\'yxatini beradi', ru: 'Отдаёт полный список игр' }, { uz: 'Faqat birinchi o\'yinni qaytaradi', ru: 'Возвращает только первую игру' }, { uz: '401 qaytaradi, ro\'yxatni bermaydi', ru: 'Возвращает 401, список не отдаёт' }, { uz: '«Kirish» ekranini o\'zi ochib beradi', ru: 'Сам открывает экран «Kirish»' }], correct: 2 },
  { q: { uz: 'Token telefonda qayerda saqlanadi?', ru: 'Где на телефоне хранится токен?' }, opts: [{ uz: 'Database\'dagi `oyinchilar` jadvalida', ru: 'В таблице `oyinchilar` в Database' }, { uz: 'Ilovaning `.env` faylidagi qatorda', ru: 'В строке файла `.env` приложения' }, { uz: 'Repo\'dagi `README.md` bo\'limida', ru: 'В разделе `README.md` в репо' }, { uz: '`expo-secure-store` da, shifrlab', ru: 'В `expo-secure-store`, зашифрованным' }], correct: 3 },
  { q: { uz: 'Telefondagi ilova uchun `localhost` nimani bildiradi?', ru: 'Что означает `localhost` для приложения на телефоне?' }, opts: [{ uz: 'Telefonning o\'zini', ru: 'Сам телефон' }, { uz: 'Laptopdagi Backend\'ni', ru: 'Backend на ноутбуке' }, { uz: 'Render\'dagi Backend\'ni', ru: 'Backend на Render' }, { uz: 'Neon\'dagi Database\'ni', ru: 'Database на Neon' }], correct: 0 },
  { q: { uz: 'Nega Backend shu darsda Render\'ga chiqadi?', ru: 'Почему на этом уроке Backend выходит на Render?' }, opts: [{ uz: 'Laptopda u sekin ishlagani uchun', ru: 'Потому что на ноутбуке он медленный' }, { uz: 'Telefon Internet orqali ulanishi uchun', ru: 'Чтобы телефон подключался через Интернет' }, { uz: 'Render Database\'ni o\'zi yaratgani uchun', ru: 'Потому что Render сам создаёт Database' }, { uz: 'Expo Go faqat Render bilan ishlagani uchun', ru: 'Потому что Expo Go работает только с Render' }], correct: 1 },
  { q: { uz: 'Ilovaning `EXPO_PUBLIC_API_URL` qatoriga nima yoziladi?', ru: 'Что пишется в строку `EXPO_PUBLIC_API_URL` приложения?' }, opts: [{ uz: '`http://localhost:3000` manzili', ru: 'Адрес `http://localhost:3000`' }, { uz: '`JWT_SECRET` kalitining qiymati', ru: 'Значение ключа `JWT_SECRET`' }, { uz: 'Render\'dagi Backend manzili', ru: 'Адрес Backend на Render' }, { uz: 'Neon\'dagi `DATABASE_URL` satri', ru: 'Строка `DATABASE_URL` из Neon' }], correct: 2 },
  { q: { uz: 'Nega `EXPO_PUBLIC_` qatoriga maxfiy kalit yozilmaydi?', ru: 'Почему в строку `EXPO_PUBLIC_` не пишут секретный ключ?' }, opts: [{ uz: 'Ilova ochilishi sekinlashib qoladi', ru: 'Приложение станет медленнее открываться' }, { uz: 'Expo Go bunday qatorni o\'chirib tashlaydi', ru: 'Expo Go удалит такую строку' }, { uz: 'Render bu qatorni o\'qiy olmay qoladi', ru: 'Render не сможет прочитать эту строку' }, { uz: 'U ilova ichida ochiq matn bo\'lib turadi', ru: 'Оно лежит внутри приложения открытым текстом' }], correct: 3 },
  { q: { uz: 'Internetdagi Backend uchun `JWT_SECRET` qayerda turadi?', ru: 'Где хранится `JWT_SECRET` для Backend в интернете?' }, opts: [{ uz: 'Render\'dagi Environment bo\'limida', ru: 'В разделе Environment на Render' }, { uz: 'Ilovaning `mobil/.env` faylidagi qatorda', ru: 'В строке файла `mobil/.env` приложения' }, { uz: 'GitHub\'dagi `README.md` faylida', ru: 'В файле `README.md` на GitHub' }, { uz: 'Agentga yozilgan talab matnida', ru: 'В тексте требования для агента' }], correct: 0 },
  { q: { uz: 'Telefon brauzerida Render manzili `/oyinlar` — 401 chiqdi. Bu nimani bildiradi?', ru: 'В браузере телефона адрес Render `/oyinlar` — вышло 401. Что это значит?' }, opts: [{ uz: 'Backend ishlamayapti — Render xato berdi', ru: 'Backend не работает — Render выдал ошибку' }, { uz: 'Backend internetda va tokensiz yopiq', ru: 'Backend в интернете и без токена закрыт' }, { uz: 'Database\'da o\'yinlar hali yozilmagan', ru: 'В Database ещё нет игр' }, { uz: 'Telefonning o\'zi Internetga ulanmagan', ru: 'Сам телефон не подключён к Интернету' }], correct: 1 },
  { q: { uz: 'Push\'dan oldin fayllarni qanday qo\'shasiz?', ru: 'Как добавить файлы перед push?' }, opts: [{ uz: '`git add .` bilan hammasini birdan', ru: 'Все сразу через `git add .`' }, { uz: '`.env` ni ham qo\'shib, hammasini', ru: 'Все, вместе с `.env`' }, { uz: 'Agent aytgan fayllarni bittadan', ru: 'По одному — файлы, которые назвал агент' }, { uz: 'Faqat `README.md` faylini qo\'shib', ru: 'Только файл `README.md`' }], correct: 2 },
  { q: { uz: 'Ilova `GET /oyinlar` dan `401` oldi. Ilova nima qiladi?', ru: 'Приложение получило `401` от `GET /oyinlar`. Что оно делает?' }, opts: [{ uz: 'O\'yinlarni namunadan ko\'rsataveradi', ru: 'Продолжает показывать игры из образца' }, { uz: 'Parolni o\'zi qayta yuborib turadi', ru: 'Само снова отправляет пароль' }, { uz: 'Render\'dagi Backend\'ni qayta yoqadi', ru: 'Перезапускает Backend на Render' }, { uz: 'Tokenni o\'chirib, «Kirish»ni ochadi', ru: 'Удаляет токен и открывает «Kirish»' }], correct: 3 },
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
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). steps [{ h, t, bandlar?, prompt?, namuna?, yordam?, err? }] · natija (kutilgan natija · namuna: Maydon Jamoa) · ortda (pastki qator).
// Prompt: QPrompt ko'rinishi (q-prompt klasslari) + {…} joyi yonida kulrang «masalan: …» namunasi — qolipda bu maydon yo'q (qolip taklifi), shu faylda FdPrompt.
// «Yordam» — Mentor misolidagi to'liq prompt, qadamning izoh-qatori joyida, bosilsa ochiladi. Trek — pm-m9d8-platforma (mobil | web); kalit yo'q — ikkala qator (M-q5).
const trekOqi = () => { try { const o = JSON.parse(localStorage.getItem('pm-m9d8-platforma') || 'null'); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; } catch { return null; } };
const FdPrompt = ({ satrlar, namuna = [] }) => {
  const [ok, setOk] = useState(false);
  const matn = satrlar.map(l => tr(l));
  const nm = {};
  namuna.forEach(x => { nm[tr(x.joy)] = x.n; });
  const korildi = new Set();
  const joy = (t, li) => t.split(/(\{[^}]+\})/g).map((p, i) => {
    if (!/^\{.+\}$/.test(p)) return p;
    const yangi = !!nm[p] && !korildi.has(p);
    if (yangi) korildi.add(p);
    return <React.Fragment key={li + '-' + i}><span className="q-joy">{p}</span>{yangi && <span className="fd-joy-n">{tx(nm[p])}</span>}</React.Fragment>;
  });
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  return (
    <span className="q-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="fd-ps">{joy(l, i)}</span>)}
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
      <QTugma ikkinchi className="fd-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      {ochiq && <span className="fd-yordam fade-step">{guruhlar.map((g, gi) => (
        <React.Fragment key={gi}>
          {g.yorliq && <span className="fd-yordam-l">{tr(g.yorliq)}</span>}
          {(g.satrlar || []).map((l, i) => <span key={i} className="fd-yordam-s">{tx(l)}</span>)}
          {g.gap && <span className="fd-yordam-g">{tx(g.gap)}</span>}
        </React.Fragment>
      ))}</span>}
    </>
  );
};
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'git checkout -f m11-dars-10-done'];
const Ortda = ({ oxiri }) => (
  <p className="fd-ortda">{tr({ uz: 'Ortda qoldingizmi — Mentor misolini oching:', ru: 'Отстали — откройте пример Ментора:' })} <code className="fd-buyruq">{ORTDA[0]}</code> · <code className="fd-buyruq">{ORTDA[1]}</code>{oxiri && <> {tx(oxiri)}</>}</p>
);
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' }; // S3 (F-1006-287): 14-dars naqshi
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, izoh }) {
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
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: <>{tx(c.t)}{c.bandlar && c.bandlar.map((b, i) => <span key={i} className="fd-band">{tx(b)}</span>)}{c.prompt && <FdPrompt satrlar={c.prompt} namuna={c.namuna} />}</>,
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
  brauzer: { uz: 'Brauzerda tekshirish', ru: 'Проверка в браузере' }, telefon: { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }
};
const XATO_GAP = { uz: "Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка — отправьте агенту строку ошибки (не значения `.env` и не токен): «Вышла такая ошибка: {ошибка}. Исправь.»' };

// Kutilgan natija maketlari (o'ng) — bitta manbadan (POYDEVOR, OYINLAR, Telefon); kirishda navbat bilan chiqadi
const SqlKarta = ({ ali, d }) => (
  <div className="fd-sql fd-kir" style={{ '--d': d }}>
    <span className="fd-sql-h">Neon · SQL Editor</span>
    <Jadval nom="oyinchilar" ustun={['ism', 'parol_hash']} qatorlar={[{ k: 'p1', c: [POYDEVOR.db.tashkilotchi[1], '$2b$10$…'] }, ...(ali ? [{ k: 'p2', c: ['Ali', '$2b$10$…'] }] : [])]} />
    {!ali && <Jadval nom="oyinlar" ustun={POYDEVOR.db.oyinlar} qatorlar={OYINLAR_QATOR} />}
  </div>
);
const A1Natija = () => (
  <div className="fd-nat">
    <div className="fd-nat-ust">
    <div className="fd-term fd-kir" style={{ '--d': '0.05s' }}>
      <span className="fd-term-q buyruq">$ npm run start:dev</span>
      <span className="fd-term-q ok">[Nest] LOG Nest application successfully started</span>
    </div>
    <div className="fd-br fd-kir" style={{ '--d': '0.18s' }}>
      <span className="fd-br-bar"><i /><i /><i /><span>localhost:3000/oyinlar</span></span>
      <span className="fd-br-401"><b>401</b> · Unauthorized</span>
    </div>
    </div>
    <SqlKarta d="0.31s" />
  </div>
);
const A2Natija = () => (
  <div className="fd-nat yon">
    <Telefon ekran="brauzer" tex={false} className="fd-kir" />
    <div className="fd-render fd-kir" style={{ '--d': '0.15s' }}>
      <span className="fd-render-h">Render <b>maydon-jamoa</b></span>
      <span className="fd-render-q"><small>Root Directory</small><code>backend</code></span>
      <span className="fd-render-q"><small>Environment</small><code>DATABASE_URL</code><code className="yop">********</code></span>
      <span className="fd-render-q"><code>JWT_SECRET</code><code className="yop">********</code></span>
    </div>
  </div>
);
// A3: uch kadr bir marta o'zi yuradi — «Ro'yxatdan o'tish» → «Kirish» (qulf-quti yashil) → «O'yinlar» (eng yangisi tepada, 9.29)
const A3Natija = () => {
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [k, setK] = useState(kam ? 2 : 0);
  useEffect(() => { if (kam) return; keyin(() => setK(1), 1800); keyin(() => setK(2), 3600); }, []); // eslint-disable-line
  return (
    <div className="fd-nat yon">
      <Telefon ekran={['royxat', 'kirish', 'oyinlar'][k]} qulf={k === 1 ? 'token' : undefined} toliq className="fd-kir" />
      <SqlKarta ali d="0.2s" />
    </div>
  );
};

const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · Database va kirish', ru: 'Практика 1 · Database и вход' }}
    title={{ uz: <>Foydalanuvchi ro'yxatdan o'tib, <span className="italic" style={{ color: T.accent }}>kira oladigan</span> bo'lsin.</>, ru: <>Пусть пользователь <span className="italic" style={{ color: T.accent }}>регистрируется и входит</span>.</> }}
    mentor={{ uz: <>Talab tayyor — kulrang namunalar o'rniga o'z mahsulotingiz nomlarini va parol qatorini yozasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Требование готово — вместо серых образцов пишете названия своего продукта и строку о пароле; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM.ochish, t: { uz: "Antigravity'da o'z repo'ngizni oching (9-darsdagi holat: ilova papkasi va `prototip/` bor, `backend/` hali yo'q). neon.tech'da mahsulotingiz uchun yangi loyiha oching, «Connect»ni bosing va ulanish satrini (connection string) nusxalang.", ru: 'Откройте свой репо в Antigravity (состояние после 9-го урока: есть папка приложения и `prototip/`, `backend/` ещё нет). На neon.tech откройте новый проект для своего продукта, нажмите «Connect» и скопируйте строку подключения (connection string).' } },
      { h: QADAM.prompt, t: { uz: "joylarni to'ldiring (har joy yonida kulrang namuna — Mentor misolidan), «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'заполните места (рядом с каждым — серый образец из примера Ментора), нажмите «Скопировать», отправьте в Antigravity:' },
        prompt: [
          { uz: "Qayerda: repo'da yangi backend/ — README.md dagi arxitektura bo'yicha, port 3000.", ru: 'Где: новый backend/ в репо — по архитектуре из README.md, порт 3000.' },
          { uz: "Nima qilsin: README'dagi jadvallarni yarat (ustunlari README'dagidek).", ru: 'Что сделать: создай таблицы из README (столбцы — как в README).' },
          { uz: "POST /royxat (ism, telefon, parol) foydalanuvchini {foydalanuvchilar jadvali} ga yozsin; parol jadvalda {parol jadvalda qanday tursin}. Bitta telefon ikki marta yozilmasin.", ru: 'POST /royxat (имя, телефон, пароль) пусть пишет пользователя в {таблица пользователей}; пароль в таблице {как хранится пароль}. Один телефон не записывается дважды.' },
          { uz: "POST /kirish (telefon, parol) to'g'ri bo'lsa token bersin. GET /{asosiy ro'yxat} ro'yxatni faqat token bilan bersin, tokensiz — 401; eng yangi yozuv tepada (yaratilgan bo'yicha kamayib).", ru: 'POST /kirish (телефон, пароль) при верных данных пусть выдаёт токен. GET /{главный список} отдаёт список только с токеном, без токена — 401; самая новая запись сверху (по yaratilgan, по убыванию).' },
          { uz: "Tekshirish uchun bitta namuna foydalanuvchi va to'rtta namuna {asosiy ro'yxat} yozuvi qo'sh; bor bo'lsa, qayta qo'shma.", ru: 'Для проверки добавь одного пользователя-образца и четыре записи-образца {главный список}; если есть — не добавляй повторно.' },
          { uz: "Nima buzilmasin: {ilova papkasi} va prototip/ papkalari. DATABASE_URL va JWT_SECRET faqat backend/.env da tursin, .env — .gitignore da. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: папки {папка приложения} и prototip/. DATABASE_URL и JWT_SECRET — только в backend/.env, .env — в .gitignore. Больше ничего не трогай, назови изменённые файлы.' }
        ],
        namuna: [
          { joy: { uz: '{foydalanuvchilar jadvali}', ru: '{таблица пользователей}' }, n: { uz: 'masalan: `oyinchilar`', ru: 'например: `oyinchilar`' } },
          { joy: { uz: "{parol jadvalda qanday tursin}", ru: '{как хранится пароль}' }, n: { uz: "ro'yxatdan o'tish mashqidagi `parol_hash` katagini eslang", ru: 'вспомните ячейку `parol_hash` из упражнения с регистрацией' } },
          { joy: { uz: "{asosiy ro'yxat}", ru: '{главный список}' }, n: { uz: 'masalan: `oyinlar`', ru: 'например: `oyinlar`' } },
          { joy: { uz: '{ilova papkasi}', ru: '{папка приложения}' }, n: { uz: 'masalan: `mobil/`', ru: 'например: `mobil/`' } }
        ],
        yordam: [{ satrlar: [
          { uz: "Qayerda: `maydon-jamoa` papkasida yangi `backend/` — `README.md` dagi arxitektura bo'yicha, port 3000.", ru: 'Где: новый `backend/` в папке `maydon-jamoa` — по архитектуре из `README.md`, порт 3000.' },
          { uz: "Nima qilsin: uch jadval yarat — `oyinchilar`, `oyinlar`, `ishtirokchilar` (ustunlari README'dagidek).", ru: 'Что сделать: создай три таблицы — `oyinchilar`, `oyinlar`, `ishtirokchilar` (столбцы — как в README).' },
          { uz: "`POST /royxat` (ism, telefon, parol) o'yinchini `oyinchilar` ga yozsin; parol jadvalda o'zi emas, faqat hash'i (`parol_hash`) tursin. Bitta telefon ikki marta yozilmasin.", ru: '`POST /royxat` (имя, телефон, пароль) пусть пишет игрока в `oyinchilar`; в таблице хранится не сам пароль, а только его хеш (`parol_hash`). Один телефон не записывается дважды.' },
          { uz: "`POST /kirish` (telefon, parol) to'g'ri bo'lsa token bersin. `GET /oyinlar` o'yinlar ro'yxatini faqat token bilan bersin, tokensiz — `401`; eng yangi o'yin tepada (`yaratilgan` bo'yicha kamayib).", ru: '`POST /kirish` (телефон, пароль) при верных данных пусть выдаёт токен. `GET /oyinlar` отдаёт список игр только с токеном, без токена — `401`; самая новая игра сверху (по `yaratilgan`, по убыванию).' },
          { uz: "Tekshirish uchun bitta namuna tashkilotchi va to'rtta namuna o'yin qo'sh; bor bo'lsa, qayta qo'shma.", ru: 'Для проверки добавь одного организатора-образца и четыре игры-образца; если есть — не добавляй повторно.' },
          { uz: "Nima buzilmasin: `mobil/` va `prototip/` papkalari. `DATABASE_URL` va `JWT_SECRET` faqat `backend/.env` da tursin, `.env` — `.gitignore` da. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: папки `mobil/` и `prototip/`. `DATABASE_URL` и `JWT_SECRET` — только в `backend/.env`, `.env` — в `.gitignore`. Больше ничего не трогай, назови изменённые файлы.' }
        ] }] },
      { h: QADAM.ishga, t: { uz: "`backend/.env` ga ikki qator yozing: `DATABASE_URL=` va Neon'dan nusxa · `JWT_SECRET=` va uzun tasodifiy satr (tokenni imzolaydi). Terminalda `cd backend`, `npm run start:dev` — xato yo'q.", ru: 'Запишите в `backend/.env` две строки: `DATABASE_URL=` и копия из Neon · `JWT_SECRET=` и длинная случайная строка (подписывает токен). В терминале `cd backend`, `npm run start:dev` — ошибок нет.' }, err: XATO_GAP },
      { h: QADAM.brauzer, t: { uz: 'talabning har qatorini tekshiring:', ru: 'проверьте каждую строку требования:' },
        bandlar: [
          { uz: "(1) Brauzerda `http://localhost:3000/{asosiy ro'yxat}` (masalan `/oyinlar`) — yozuvlar emas, `401` chiqsin: tokensiz yopiq.", ru: '(1) В браузере `http://localhost:3000/{главный список}` (например `/oyinlar`) — должно выйти не записи, а `401`: без токена закрыто.' },
          { uz: "(2) Neon'dagi SQL Editor'da foydalanuvchilar jadvalingizni oching (`SELECT ism, parol_hash FROM …;`) — namuna foydalanuvchi; `parol_hash` ustunida parolning o'zi yo'q — boshqa satr.", ru: '(2) В SQL Editor на Neon откройте таблицу пользователей (`SELECT ism, parol_hash FROM …;`) — пользователь-образец; в столбце `parol_hash` нет самого пароля — другая строка.' },
          { uz: "(3) Asosiy ro'yxat jadvalida — to'rtta namuna yozuv.", ru: '(3) В таблице главного списка — четыре записи-образца.' },
          { uz: "(4) Agent aytgan fayllarda README'dagi jadvallar va uch yo'l bor; `git status` da `backend/.env` ko'rinmaydi.", ru: '(4) В файлах, которые назвал агент, есть таблицы из README и три пути; в `git status` не видно `backend/.env`.' },
          { uz: 'Mos kelmagan qatorni uch qism bilan agentga yozing.', ru: 'Несовпавшую строку напишите агенту тремя частями.' }
        ] }
    ]}
    natija={<A1Natija />}
    ortda={{ uz: "— qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` ga o'z qiymatlaringizni yozasiz).", ru: '— увидите, как это работает, и повторите шаг в своём репо по образцу (в `backend/.env` пишете свои значения).' }}
    doneText={{ uz: "Backend ishlayapti: foydalanuvchi yoziladi, parolning faqat hash'i saqlanadi, ro'yxat token bilan beriladi.", ru: 'Backend работает: пользователь записывается, хранится только хеш пароля, список выдаётся по токену.' }} />
);

const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · deploy', ru: 'Практика 2 · деплой' }}
    title={{ uz: <>Backend internetga chiqsin: <span className="italic" style={{ color: T.accent }}>telefon uni topsin</span>.</>, ru: <>Backend выходит в интернет: <span className="italic" style={{ color: T.accent }}>телефон его находит</span>.</> }}
    mentor={{ uz: <>Endi «Nima buzilmasin» qatorini o'zingiz yozasiz, namuna «Yordam»da; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Теперь строку «Что не сломать» пишете сами, образец — в «Помощи»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM.ochish, t: { uz: "o'z Backend'ingiz laptopda ishlab tursin. render.com'ga GitHub akkauntingiz bilan kiring — 9-Modulda «Maydon»ni shu yerga chiqargansiz.", ru: 'пусть ваш Backend работает на ноутбуке. Войдите на render.com через аккаунт GitHub — в 9-м модуле вы выкладывали сюда «Maydon».' } },
      { h: QADAM.prompt, t: { uz: "`{nima buzilmasin}` qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'строку `{что не сломать}` напишите сами, нажмите «Скопировать», отправьте в Antigravity:' },
        prompt: [
          { uz: "Qayerda: backend/ — Render'ga chiqarish uchun.", ru: 'Где: backend/ — для выкладки на Render.' },
          { uz: "Nima qilsin: port PORT o'zgaruvchisidan olinsin, u bo'lmasa — 3000. README.md ga «Internetga chiqarish» bo'limini yoz: Render uchun Root Directory, Build Command, Start Command va kerakli o'zgaruvchilar nomi — qiymatsiz.", ru: 'Что сделать: порт бери из переменной PORT, если её нет — 3000. Напиши в README.md раздел «Internetga chiqarish»: для Render — Root Directory, Build Command, Start Command и названия нужных переменных — без значений.' },
          { uz: 'Nima buzilmasin: {nima buzilmasin}', ru: 'Что не сломать: {что не сломать}' }
        ],
        yordam: [{ satrlar: [
          { uz: "Nima buzilmasin: `DATABASE_URL` va `JWT_SECRET` kodda ham, repo'da ham bo'lmasin — faqat `.env` da va Render sozlamasida. Laptopda `npm run start:dev` avvalgidek ishlasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: `DATABASE_URL` и `JWT_SECRET` не должно быть ни в коде, ни в репо — только в `.env` и в настройках Render. На ноутбуке `npm run start:dev` работает как раньше. Больше ничего не трогай, назови изменённые файлы.' }
        ] }] },
      { h: QADAM.ishga, t: { uz: "(a) `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"backend: Render\"`, `git push`.", ru: '(a) `git status` — изменённые файлы совпадают с тем, что сказал агент, `.env` в списке нет; добавляйте каждый файл через `git add <fayl>`, `git commit -m "backend: Render"`, `git push`.' },
        bandlar: [
          { uz: "(b) Render'da «New > Web Service» → o'z repo'ngiz; Root Directory — `backend`; Build Command va Start Command — `README.md` dagi; tarif **Free**. Environment bo'limiga ikki qator: `DATABASE_URL` va `JWT_SECRET` — qiymatlari `backend/.env` dan. Keyin «Create Web Service» — tayyor bo'lgach manzil chiqadi: `….onrender.com`.", ru: '(b) На Render «New > Web Service» → свой репо; Root Directory — `backend`; Build Command и Start Command — из `README.md`; тариф **Free**. В раздел Environment две строки: `DATABASE_URL` и `JWT_SECRET` — значения из `backend/.env`. Затем «Create Web Service» — когда будет готово, появится адрес: `….onrender.com`.' }
        ],
        err: { uz: "Xato bo'lsa — Render'dagi log qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.» Web-trekda ham Backend shu yo'l bilan chiqadi.", ru: 'Если ошибка — отправьте агенту строку лога из Render (не значения `.env` и не токен): «Вышла такая ошибка: {ошибка}. Исправь.» В веб-треке Backend выходит тем же путём.' } },
      { h: QADAM.telefon, t: { uz: "telefon brauzerida Render manzilingizni va asosiy ro'yxatingiz nomini oching (`https://….onrender.com/…`) — `401` chiqsin: Backend internetda, tokensiz yopiq. Mobil internet bo'lsa, Wi-Fi'ni o'chirib ham oching — natija o'sha. Bepul Backend uxlab qolgan bo'lsa, birinchi javob bir daqiqagacha kechikishi mumkin.", ru: 'в браузере телефона откройте свой адрес Render и название главного списка (`https://….onrender.com/…`) — должно выйти `401`: Backend в интернете, без токена закрыт. Если есть мобильный интернет, откройте и с выключенным Wi-Fi — результат тот же. Если бесплатный Backend уснул, первый ответ может задержаться до минуты.' },
        bandlar: [
          { uz: "Render manzilingizni `README.md` ning «Internetga chiqarish» bo'limiga yozing — ilovangiz unga ulanadi (manzil — ochiq qiymat).", ru: 'Запишите свой адрес Render в раздел «Internetga chiqarish» в `README.md` — к нему подключится ваше приложение (адрес — открытое значение).' }
        ] }
    ]}
    natija={<A2Natija />}
    izoh={{ uz: 'Render bepul xizmatni prod uchun tavsiya qilmaydi. Bu modulda u ilovani tekshirish uchun ishlatiladi.', ru: 'Render не рекомендует бесплатный сервис для прода. В этом модуле он нужен, чтобы проверять приложение.' }}
    doneText={{ uz: 'Backend internetda: telefon uni Render manzili bilan topadi, tokensiz `401` oladi.', ru: 'Backend в интернете: телефон находит его по адресу Render и без токена получает `401`.' }} />
);

// A3 trek qatorlari (9.7): 1 va 3-qadamda bir qator, «Yordam» ostida — trek prompti; kalit yo'q bo'lsa ikkala qator ham
const A3_YORDAM_MOBIL = [
  { uz: "Qayerda: `mobil/` — yangi «Ro'yxatdan o'tish» va «Kirish» ekranlari; «O'yinlar» ekrani (`src/app/index.tsx`).", ru: 'Где: `mobil/` — новые экраны «Ro\'yxatdan o\'tish» и «Kirish»; экран «O\'yinlar» (`src/app/index.tsx`).' },
  { uz: "Nima qilsin: Backend manzilini `.env` dagi `EXPO_PUBLIC_API_URL` dan ol. «Ro'yxatdan o'tish» — `POST /royxat` (ism, telefon, parol), keyin «Kirish» ochilsin.", ru: 'Что сделать: адрес Backend бери из `EXPO_PUBLIC_API_URL` в `.env`. «Ro\'yxatdan o\'tish» — `POST /royxat` (имя, телефон, пароль), потом открывается «Kirish».' },
  { uz: "«Kirish» — `POST /kirish`; olingan tokenni `expo-secure-store` ga saqla. Ilova ochilganda token bo'lsa — «O'yinlar», bo'lmasa — «Kirish».", ru: '«Kirish» — `POST /kirish`; полученный токен сохрани в `expo-secure-store`. При открытии приложения: есть токен — «O\'yinlar», нет — «Kirish».' },
  { uz: "«O'yinlar» ro'yxatni `GET /oyinlar` dan token bilan olsin: kartada kun, soat, maydon va nechta odam kerakligi. Javob `401` bo'lsa — tokenni o'chirib, «Kirish»ni och. «O'yinlar» ekranida «Hisobdan chiqish» tugmasi — tokenni o'chirib, «Kirish»ni ochsin.", ru: '«O\'yinlar» берёт список из `GET /oyinlar` с токеном: в карточке день, время, поле и сколько людей нужно. Если ответ `401` — удали токен и открой «Kirish». На экране «O\'yinlar» кнопка «Hisobdan chiqish» — удаляет токен и открывает «Kirish».' },
  { uz: "Nima buzilmasin: «O'yin» va «E'lon berish» ekranlari, animatsiyalar. `.env` ga Backend manzilidan boshqa qiymat yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: экраны «O\'yin» и «E\'lon berish», анимации. В `.env` не пишется ничего, кроме адреса Backend. Больше ничего не трогай, назови изменённые файлы.' }
];
const A3_YORDAM_WEB = [
  { uz: "Qayerda: `prototip/` — yangi «Ro'yxatdan o'tish» va «Kirish» sahifalari; asosiy ro'yxat sahifasi. Backend'da `WEB_ORIGIN`.", ru: 'Где: `prototip/` — новые страницы «Ro\'yxatdan o\'tish» и «Kirish»; страница главного списка. В Backend — `WEB_ORIGIN`.' },
  { uz: "Nima qilsin: Backend manzilini `.env` dagi `VITE_API_URL` dan ol. «Ro'yxatdan o'tish» — `POST /royxat`, keyin «Kirish». «Kirish» — `POST /kirish`; token `localStorage` da tursin.", ru: 'Что сделать: адрес Backend бери из `VITE_API_URL` в `.env`. «Ro\'yxatdan o\'tish» — `POST /royxat`, потом «Kirish». «Kirish» — `POST /kirish`; токен хранится в `localStorage`.' },
  { uz: "Sahifa ochilganda token bo'lsa — ro'yxat `GET /{asosiy ro'yxat}` dan token bilan, bo'lmasa — «Kirish». `401` kelsa — tokenni o'chirib «Kirish»ni och. «Hisobdan chiqish» — tokenni o'chirsin.", ru: 'При открытии страницы: есть токен — список из `GET /{главный список}` с токеном, нет — «Kirish». Пришёл `401` — удали токен и открой «Kirish». «Hisobdan chiqish» — удаляет токен.' },
  { uz: 'Backend CORS faqat `WEB_ORIGIN` dagi Netlify manziliga ruxsat bersin.', ru: 'CORS в Backend разрешает только адрес Netlify из `WEB_ORIGIN`.' },
  { uz: "Nima buzilmasin: dizayn va animatsiyalar; foydalanuvchi matni sahifaga HTML bo'lib chiqmasin. `.env` ga Backend manzilidan boshqa qiymat yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: дизайн и анимации; текст пользователя не выводится на страницу как HTML. В `.env` не пишется ничего, кроме адреса Backend. Больше ничего не трогай, назови изменённые файлы.' }
];
const A3_WEB_GAP = { uz: "Render'da Environment'ga `WEB_ORIGIN` — Netlify manzilingiz (9-Moduldagidek).", ru: 'На Render в Environment добавьте `WEB_ORIGIN` — ваш адрес Netlify (как в 9-м модуле).' };
const a3Qadamlar = (trek) => {
  const mob = trek !== 'web', web = trek !== 'mobil', ikkala = mob && web;
  const env = [mob && { uz: 'mobil trekda `EXPO_PUBLIC_API_URL=`', ru: 'в мобильном треке `EXPO_PUBLIC_API_URL=`' }, web && { uz: 'web-trekda `VITE_API_URL=`', ru: 'в веб-треке `VITE_API_URL=`' }].filter(Boolean);
  const ishga = [
    mob && { uz: "mobil trekda: `npx expo start`, QR'ni telefonda Expo Go bilan oching (9-darsdagidek); QR ochilmasa — telefon va laptop bitta Wi-Fi'dami? Bo'lmasa: `npx expo start --tunnel`.", ru: 'в мобильном треке: `npx expo start`, откройте QR на телефоне через Expo Go (как на 9-м уроке); если QR не открывается — телефон и ноутбук в одной Wi-Fi? Если нет: `npx expo start --tunnel`.' },
    web && { uz: 'Web-trekda: `npm run dev`, keyin push — Netlify o\'zi yangilanadi.', ru: 'В веб-треке: `npm run dev`, потом push — Netlify обновится сам.' }
  ].filter(Boolean);
  const yordam = [
    mob && { yorliq: ikkala && { uz: 'mobil trek', ru: 'мобильный трек' }, satrlar: A3_YORDAM_MOBIL },
    web && { yorliq: ikkala && { uz: 'web-trek', ru: 'веб-трек' }, satrlar: A3_YORDAM_WEB, gap: A3_WEB_GAP }
  ].filter(Boolean);
  return [
    { h: QADAM.ochish, t: { uz: `ilova papkangizda \`.env\` fayl yarating, bitta qator: ${env.map(x => x.uz).join(', ')} — va Render manzilingiz (oxirida \`/\` siz).`, ru: `в папке приложения создайте файл \`.env\`, одна строка: ${env.map(x => x.ru).join(', ')} — и ваш адрес Render (без \`/\` в конце).` } },
    { h: QADAM.prompt, t: { uz: "vazifa: ilovangizda «Ro'yxatdan o'tish» va «Kirish» bo'lsin, token saqlansin, asosiy ro'yxat Backend'dan kelsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'задача: в приложении есть «Ro\'yxatdan o\'tish» и «Kirish», токен сохраняется, главный список приходит из Backend. Напишите три строки сами, нажмите «Скопировать», отправьте в Antigravity:' },
      prompt: [{ uz: 'Qayerda: {qayerda}', ru: 'Где: {где}' }, { uz: 'Nima qilsin: {nima qilsin}', ru: 'Что сделать: {что сделать}' }, { uz: 'Nima buzilmasin: {nima buzilmasin}', ru: 'Что не сломать: {что не сломать}' }],
      yordam },
    { h: QADAM.ishga, t: ishga[0], bandlar: ishga.slice(1), err: XATO_GAP },
    { h: QADAM.telefon, t: { uz: 'talabning har qatorini tekshiring:', ru: 'проверьте каждую строку требования:' },
      bandlar: [
        { uz: "(1) Ro'yxatdan o'ting, keyin kiring — asosiy ro'yxatda to'rtta namuna yozuv (eng yangisi tepada).", ru: '(1) Зарегистрируйтесь, потом войдите — в главном списке четыре записи-образца (самая новая сверху).' },
        { uz: "(2) Mobil trekda terminalda `r` ni bosing (web-trekda sahifani yangilang) — ilova qayta yuklanadi: «Kirish» so'ralmaydi, ro'yxat ochiladi.", ru: '(2) В мобильном треке нажмите `r` в терминале (в веб-треке обновите страницу) — приложение перезагрузится: «Kirish» не спрашивается, открывается список.' },
        { uz: "(3) «Hisobdan chiqish»ni bosing — «Kirish» ochiladi; qayta kiring (bu — kirish poydevorining qismi, roadmap funksiyasi emas).", ru: '(3) Нажмите «Hisobdan chiqish» — откроется «Kirish»; войдите снова (это часть фундамента входа, не функция из roadmap).' },
        { uz: "(4) Neon'dagi SQL Editor'da foydalanuvchilar jadvalingiz — sizning qatoringiz, `parol_hash` da parolingiz emas.", ru: '(4) В SQL Editor на Neon в таблице пользователей — ваша строка, в `parol_hash` не ваш пароль.' },
        { uz: "Bepul Backend uxlab qolgan bo'lsa, birinchi javob bir daqiqagacha kechikishi mumkin. Oxirida `git status` → `git add <fayl>` (`.env` emas) → commit → `git push`.", ru: 'Если бесплатный Backend уснул, первый ответ может задержаться до минуты. В конце `git status` → `git add <fayl>` (не `.env`) → commit → `git push`.' }
      ] }
  ];
};
const ScreenA3 = (props) => {
  const [trek] = useState(trekOqi);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 3 · ilova → Backend', ru: 'Практика 3 · приложение → Backend' }}
      title={{ uz: <>Ilova Backend'ga ulansin: <span className="italic" style={{ color: T.accent }}>kirish va asosiy ro'yxat</span>.</>, ru: <>Приложение подключается к Backend: <span className="italic" style={{ color: T.accent }}>вход и главный список</span>.</> }}
      mentor={{ uz: <>Uch qatorning hammasi sizdan, namuna «Yordam»da; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Все три строки — ваши, образец — в «Помощи»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
      steps={a3Qadamlar(trek)}
      natija={<A3Natija />}
      izoh={trek !== 'web' && { uz: "Expo Go'da ilova kodi hozircha laptopdan keladi, o'yinlar esa Render'dagi Backend'dan.", ru: 'В Expo Go код приложения пока приходит с ноутбука, а игры — из Backend на Render.' }}
      doneText={{ uz: "Ilova internetdagi Backend'ga ulandi: foydalanuvchi kiradi, ro'yxat Database'dan keladi.", ru: 'Приложение подключено к Backend в интернете: пользователь входит, список приходит из Database.' }} />
  );
};

// 🃏 KARTOCHKALAR (12) — alohida ekran sflash (SABOQ 12, 16), qolipdagi QKartochka (DE-204). Orqa tomon — oddiy matn (kod-belgisiz); old va izoh — tx.
const KARTALAR = [
  { front: { uz: 'Poydevor nima?', ru: 'Что такое фундамент?' }, back: { uz: "Database, kirish va deploy — har funksiyadan oldin kerak bo'lgan qism", ru: 'Database, вход и деплой — часть, нужная перед каждой функцией' }, note: { uz: "Mentor misolida: uch jadval, kirish yo'llari, Backend Render'da", ru: 'В примере Ментора: три таблицы, пути входа, Backend на Render' } },
  { front: { uz: "Prototipda bir telefondagi «Qo'shilaman»ni ikkinchisi nega ko'rmaydi?", ru: 'Почему в прототипе второй телефон не видит «Qo\'shilaman» с первого?' }, back: { uz: "Ma'lumot har telefonning o'zida", ru: 'Данные — на каждом телефоне свои' }, note: { uz: "Ikkala telefon so'raydigan umumiy Database yo'q", ru: 'Нет общей Database, к которой обращаются оба телефона' } },
  { front: { uz: "«Maydon Jamoa» Database'ida qaysi uch jadval bor?", ru: 'Какие три таблицы есть в Database «Maydon Jamoa»?' }, back: { uz: 'oyinchilar, oyinlar, ishtirokchilar', ru: 'oyinchilar, oyinlar, ishtirokchilar' }, note: { uz: "`ishtirokchilar` — kim qaysi o'yinga qo'shilgani", ru: '`ishtirokchilar` — кто к какой игре присоединился' } },
  { front: { uz: '`oyinchilar` jadvalida parol qanday turadi?', ru: 'Как хранится пароль в таблице `oyinchilar`?' }, back: { uz: "Hash bo'lib — parolning o'zi emas", ru: 'Хешем — не сам пароль' }, note: { uz: "Hash — paroldan yasalgan satr: undan parolni qaytarib bo'lmaydi", ru: 'Хеш — строка, сделанная из пароля: пароль из неё не восстановить' } },
  { front: { uz: '`POST /kirish` nima qaytaradi?', ru: 'Что возвращает `POST /kirish`?' }, back: { uz: 'Token', ru: 'Токен' }, note: { uz: "Telefon va parol to'g'ri bo'lsa", ru: 'Если телефон и пароль верны' } },
  { front: { uz: 'Token telefonda qayerda saqlanadi?', ru: 'Где на телефоне хранится токен?' }, back: { uz: 'expo-secure-store da', ru: 'в expo-secure-store' }, note: { uz: "Qiymatni shifrlab saqlaydi — 8-Moduldagi AsyncStorage'dan farqi shu", ru: 'Хранит значение зашифрованным — в этом отличие от AsyncStorage из 8-го модуля' } },
  { front: { uz: "Ilova qayta ochilganda «Kirish» nega so'ralmaydi?", ru: 'Почему при повторном открытии не спрашивается «Kirish»?' }, back: { uz: 'Token telefonda saqlangan', ru: 'Токен сохранён на телефоне' }, note: { uz: "Ilova uni yopiq so'rovlarga qo'shadi; muddati tugasa — yana «Kirish»", ru: 'Приложение добавляет его к закрытым запросам; срок истёк — снова «Kirish»' } },
  { front: { uz: '`GET /oyinlar` tokensiz nima qaytaradi?', ru: 'Что возвращает `GET /oyinlar` без токена?' }, back: { uz: '401', ru: '401' }, note: { uz: "Ilova tokenni o'chirib, «Kirish»ni ochadi", ru: 'Приложение удаляет токен и открывает «Kirish»' } },
  { front: { uz: 'Telefondagi ilova uchun `localhost` nima?', ru: 'Что такое `localhost` для приложения на телефоне?' }, back: { uz: "Telefonning o'zi", ru: 'Сам телефон' }, note: { uz: "So'rov laptopdagi Backend'ga yetmaydi", ru: 'Запрос не доходит до Backend на ноутбуке' } },
  { front: { uz: "Nega Backend shu darsda Render'ga chiqadi?", ru: 'Почему на этом уроке Backend выходит на Render?' }, back: { uz: 'Telefon unga Internet orqali ulanadi', ru: 'Телефон подключается к нему через Интернет' }, note: { uz: "Laptopdagi Backend'ga telefon ulana olmasligi mumkin", ru: 'К Backend на ноутбуке телефон может не подключиться' } },
  { front: { uz: '`EXPO_PUBLIC_API_URL` ga nima yoziladi?', ru: 'Что пишется в `EXPO_PUBLIC_API_URL`?' }, back: { uz: "Render'dagi Backend manzili", ru: 'Адрес Backend на Render' }, note: { uz: "Maxfiy emas — ilovada ochiq ko'rinadi", ru: 'Не секрет — в приложении виден открыто' } },
  { front: { uz: '`JWT_SECRET` va `DATABASE_URL` qayerda turadi?', ru: 'Где хранятся `JWT_SECRET` и `DATABASE_URL`?' }, back: { uz: "backend/.env da va Render'da", ru: 'в backend/.env и на Render' }, note: { uz: "Ilovada ham, GitHub'da ham emas", ru: 'Ни в приложении, ни на GitHub' } }
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
        <div className={cxx('fd-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tr(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="fd-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204) + «Keyingi dars» qatori; kartochkalar — oldingi alohida ekranda; uyga vazifa yo'q (P-058). Sarlavha holatga qarab (P-046; 10-FILTR 37) =====
const YAKUN_SARLAVHA = {
  a3: { uz: "Poydevor tayyor: ro'yxatingiz Backend'dan keladi.", ru: 'Фундамент готов: ваш список приходит из Backend.' },
  a2: { uz: 'Backend internetda — ilovaga ulash qoldi.', ru: 'Backend в интернете — осталось подключить приложение.' },
  a1: { uz: 'Database va kirish tayyor — deploy qoldi.', ru: 'Database и вход готовы — остался деплой.' },
  yoq: { uz: 'Poydevor boshlandi — qolgan qadamni tugating.', ru: 'Фундамент начат — завершите оставшийся шаг.' }
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
    { uz: "Ro'yxatdan o'tgan o'yinchi Database'da turadi; parolning o'zi emas, hash'i saqlanadi.", ru: 'Зарегистрированный игрок хранится в Database; сохраняется не сам пароль, а его хеш.' },
    { uz: "Kirishda parol yoziladi: token telefonda saqlanadi va yopiq so'rovlarga qo'shiladi.", ru: 'При входе вводится пароль: токен сохраняется на телефоне и добавляется к закрытым запросам.' },
    { uz: "Telefon `localhost` bilan laptopdagi Backend'ni topmaydi — bu darsda Backend barqaror manzil uchun internetga chiqadi.", ru: 'По `localhost` телефон не находит Backend на ноутбуке — на этом уроке Backend выходит в интернет ради постоянного адреса.' },
    { uz: "`EXPO_PUBLIC_` qiymati ilovada ochiq ko'rinadi: unga faqat Backend manzili yoziladi.", ru: 'Значение `EXPO_PUBLIC_` в приложении видно открыто: туда пишется только адрес Backend.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      {/* Belgi «✓ Poydevor tayyor» — faqat 3-amaliyot bajarilganda; aks holda belgisiz (MD 7) */}
      <div className={cxx('fd-yakun', belgisiz && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Poydevor tayyor', ru: 'Фундамент готов' })}
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
          <p className="fd-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: 1-asosiy funksiya»</b>: roadmap'dagi birinchi funksiya — talabni siz yozasiz.</>, ru: <>Следующий урок — <b>«День проекта: 1-я основная функция»</b>: первая функция из roadmap — требование пишете вы.</> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function FoundationDayLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — «Poydevor xaritasi» (fd-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Telefon 172×272 hamma ekranda (SABOQ 22) === */
        .fd-navbat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: fd-puls 1.8s ease-out infinite; }
        @keyframes fd-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        @keyframes fd-kot { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes fd-pop { 0% { transform: scale(1); } 40% { transform: scale(1.4); } 100% { transform: scale(1); } }
        @keyframes fd-tush { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
        @keyframes fd-yig { from { opacity: 0.3; transform: scaleY(1.7); } to { opacity: 1; transform: none; } }
        @keyframes fd-chiz { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .fd-navbat-k .q-bashorat { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: fd-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both, fd-puls 1.8s ease-out 0.7s infinite; }
        .fd-navbat-k .q-chip { animation: fd-kot 0.4s ease-out 0.15s both; }
        .fd-navbat-k .q-chip:nth-child(2) { animation-delay: 0.25s; } .fd-navbat-k .q-chip:nth-child(3) { animation-delay: 0.35s; }
        .q-kirish:has(.fd-ikki.kutish) .q-variantlar-kol { border-radius: 14px; outline: 2px solid ${T.accent}; outline-offset: 5px; animation: fd-puls 1.8s ease-out 0.9s infinite; }
        .fd-taxmin { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; transform-origin: top; animation: fd-yig 0.45s cubic-bezier(.2,.9,.3,1) both; }
        .fd-taxmin-y { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.accent}; }
        .fd-taxmin-s { color: ${T.ink2}; }
        .fd-taxmin b { color: ${T.ink}; }
        .fd-nb { display: flex; flex-direction: column; gap: 6px; }
        .fd-nb-t { font-size: 13.5px; font-weight: 600; color: ${T.ink2}; } .fd-nb-t.ok { color: ${T.ok}; font-weight: 700; } .fd-nb-t b { color: ${T.ink}; }
        .fd-nb-i { font-size: 13.5px; color: ${T.ink2}; }
        .fd-nb-x { font-weight: 600; color: ${T.ink}; }
        p.fd-joriy { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.ink2}; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        /* Telefon = ilova */
        .fd-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: none; }
        .fd-tel-tex { display: inline-flex; align-items: center; height: 22px; padding: 0 11px; border: 1.5px solid ${T.line}; border-radius: 999px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .fd-tel-yorliq { font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 999px; white-space: nowrap; }
        .fd-tel-yorliq.b1 { background: ${T.accentSoft}; color: ${T.accent}; } .fd-tel-yorliq.b2 { background: ${fon(T.ink, 0.08)}; color: ${T.ink}; }
        .fd-telefon { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 6px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px 8px 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .fd-tel-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; animation: fd-ekran 0.35s ease-out both; }
        @keyframes fd-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        .fd-tel-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; }
        .fd-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: ${T.ok}; letter-spacing: 0.01em; }
        .fd-tel-sar { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .fd-oyin { display: flex; flex-direction: column; gap: 3px; flex: 1; min-height: 0; }
        .fd-oyin-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .fd-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .fd-oyin-joy { font-size: 12px; color: ${T.ink2}; }
        .fd-son { display: inline-block; align-self: flex-start; margin-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: ${T.ink}; transform-origin: left center; }
        .fd-son.yangi { color: ${T.accent}; animation: fd-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .fd-doiralar { display: grid; grid-template-columns: repeat(5, 14px); gap: 6px; margin: 4px 0 6px; }
        .fd-doiralar i { width: 14px; height: 14px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .fd-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.38)}; }
        .fd-doiralar i.yangi { background: ${T.accent}; animation: fd-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .fd-tel-btn { margin-top: auto; flex: none; display: flex; align-items: center; justify-content: center; height: 30px; border-radius: 10px; background: ${T.accent}; color: #fff; font-size: 12px; font-weight: 800; transition: transform 0.15s, background 0.3s, color 0.3s, box-shadow 0.2s; }
        .fd-tel-btn.bos { transform: scale(0.92); box-shadow: 0 0 0 4px ${fon(T.accent, 0.25)}; }
        .fd-tel-btn.off { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .fd-forma { display: flex; flex-direction: column; gap: 4px; flex: 1; min-height: 0; }
        .fd-maydon { display: flex; flex-direction: column; padding: 2px 8px 3px; border: 1px solid ${T.line}; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.3; color: ${T.ink}; }
        .fd-maydon small { font-family: 'Manrope', sans-serif; font-size: 11px; color: ${T.ink2}; }
        .fd-oyinlar { display: flex; flex-direction: column; gap: 4px; flex: 1; min-height: 0; }
        .fd-oyinlar:has(.fd-karta + .fd-karta span:nth-child(2)) { gap: 3px; }
        .fd-karta { display: flex; flex-direction: column; padding: 2px 8px 3px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11px; line-height: 1.2; color: ${T.ink2}; animation: fd-kot 0.4s ease-out var(--d, 0s) both; }
        .fd-karta b { font-size: 11.5px; color: ${T.ink}; }
        .fd-karta.bosh { height: 33px; background: ${fon(T.ink, 0.06)}; border-color: transparent; animation: none; }
        .fd-tel-xato { display: block; margin-top: 6px; padding: 8px; border-radius: 8px; background: ${T.errFon}; color: ${T.err}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; line-height: 1.35; overflow-wrap: anywhere; animation: fd-kot 0.35s ease-out both; }
        .fd-tel-qora { position: absolute; inset: 0; z-index: 3; background: ${T.ink}; animation: fd-qora 0.56s ease-in-out both; }
        @keyframes fd-qora { 0% { opacity: 0; } 35%, 70% { opacity: 1; } 100% { opacity: 0; } }
        .fd-qulf { flex: none; display: flex; flex-direction: column; gap: 3px; padding: 4px 7px 5px; border-radius: 9px; border: 1.5px dashed ${T.line}; background: ${T.bg}; transition: border-color 0.3s, background 0.3s, box-shadow 0.3s; }
        .fd-qulf.bor { border-style: solid; border-color: ${T.ok}; background: ${T.okFon}; }
        .fd-qulf.yon { box-shadow: 0 0 0 4px ${fon(T.ok, 0.22)}; }
        .fd-qulf.fokus { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .fd-qulf-n { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .fd-qulf.bor .fd-qulf-n { color: ${T.ok}; }
        .fd-qulf-ic { position: relative; width: 9px; height: 7px; margin-top: 4px; border-radius: 2px; background: currentColor; flex: none; }
        .fd-qulf-ic::before { content: ''; position: absolute; left: 1.5px; top: -5px; width: 6px; height: 6px; border: 1.5px solid currentColor; border-bottom: 0; border-radius: 4px 4px 0 0; box-sizing: border-box; }
        .fd-qulf-joy { display: flex; align-items: center; height: 18px; border-radius: 6px; border: 1px dashed ${T.line}; padding: 0 5px; }
        .fd-qulf.bor .fd-qulf-joy { border-color: transparent; padding: 0; }
        .fd-token { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 1px 8px; border-radius: 6px; background: ${T.ok}; color: #fff; animation: fd-tush 0.5s cubic-bezier(.3,1.4,.5,1) both; }
        .fd-tel-ust > .q-btn { align-self: center; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
        .fd-qn { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; opacity: 0.85; }
        .fd-brauzer { flex: 1; display: flex; flex-direction: column; gap: 10px; min-height: 0; }
        .fd-br-manzil { padding: 5px 8px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.35; color: ${T.ink2}; overflow-wrap: anywhere; }
        .fd-br-tana { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; font-family: 'JetBrains Mono', monospace; }
        .fd-br-tana b { font-size: 34px; color: ${T.err}; } .fd-br-tana span { font-size: 12px; color: ${T.ink2}; }
        /* Backend va Database */
        .fd-be { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); min-width: 0; transition: border-color 0.3s, box-shadow 0.3s, opacity 0.3s; }
        .fd-be.on { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.14)}; }
        .fd-be.ok { border-color: ${T.ok}; box-shadow: 0 0 0 4px ${fon(T.ok, 0.12)}; }
        .fd-be.xira { opacity: 0.45; }
        .fd-be-h { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: ${T.ink}; }
        .fd-chiroq { width: 8px; height: 8px; border-radius: 50%; background: ${T.ok}; box-shadow: 0 0 0 3px ${fon(T.ok, 0.2)}; }
        .fd-be-joy { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; overflow-wrap: anywhere; }
        .fd-yol { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 5px 9px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; transition: border-color 0.3s, background 0.3s; }
        .fd-yol code { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .fd-yol.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fd-yol.ok { border-color: ${fon(T.ok, 0.5)}; background: ${T.okFon}; }
        .fd-qulf-b { position: relative; width: 10px; height: 8px; margin-top: 5px; border-radius: 2px; background: ${T.ink2}; flex: none; transition: background 0.3s; }
        .fd-qulf-b::before { content: ''; position: absolute; left: 2px; top: -6px; width: 6px; height: 7px; border: 1.5px solid ${T.ink2}; border-bottom: 0; border-radius: 4px 4px 0 0; box-sizing: border-box; transform-origin: right bottom; transition: transform 0.35s, border-color 0.3s; }
        .fd-qulf-b.ochiq { background: ${T.ok}; } .fd-qulf-b.ochiq::before { border-color: ${T.ok}; transform: translateY(-3px) rotate(-25deg); }
        .fd-solish { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: ${T.ok}; animation: fd-kot 0.35s ease-out both; }
        .fd-solish code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        .fd-solish b { margin-left: auto; width: 18px; height: 18px; border-radius: 50%; background: ${T.ok}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; animation: fd-pop 0.45s cubic-bezier(.3,1.5,.5,1) 0.15s both; }
        .fd-jwt { display: flex; align-items: center; gap: 8px; padding: 5px 9px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; transition: border-color 0.3s, background 0.3s, box-shadow 0.3s; }
        .fd-jwt code { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .fd-jwt.yon { border-color: ${T.accent}; background: ${T.accentSoft}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.16)}; }
        .fd-db { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${fon(T.ink, 0.025)}; min-width: 0; }
        .fd-db-h { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        .fd-jad { display: flex; flex-direction: column; gap: 4px; padding: 7px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; min-width: 0; transition: opacity 0.3s, border-color 0.3s, box-shadow 0.3s; }
        .fd-jad.yon { border-color: ${T.ok}; box-shadow: 0 0 0 3px ${fon(T.ok, 0.15)}; }
        .fd-jad.xira { opacity: 0.45; }
        .fd-jad-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .fd-jt { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .fd-jt th { text-align: left; font-weight: 600; color: ${T.ink2}; padding: 2px 8px 3px 0; border-bottom: 1px solid ${T.line}; }
        .fd-jt td { padding: 3px 8px 3px 0; color: ${T.ink}; border-bottom: 1px solid ${fon(T.ink, 0.06)}; overflow-wrap: anywhere; }
        .fd-jt tr.kir { animation: fd-qator 1.6s ease-out both; }
        @keyframes fd-qator { 0% { opacity: 0; transform: translateX(-12px); background: ${T.okFon}; } 25% { opacity: 1; transform: none; background: ${T.okFon}; } 100% { background: transparent; } }
        .fd-jad.yon .fd-jt td { color: ${T.ok}; }
        .fd-jt td.hash { color: ${T.accent}; font-weight: 700; background: ${T.accentSoft}; }
        .fd-hash-y { align-self: flex-end; font-size: 11.5px; font-weight: 700; color: ${T.accent}; padding: 2px 9px; border-radius: 999px; background: ${T.accentSoft}; animation: fd-kot 0.4s ease-out 0.3s both; }
        .fd-db-kartalar { display: flex; flex-wrap: wrap; gap: 6px; }
        .fd-db-k { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; padding: 5px 10px; border-radius: 8px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; transition: border-color 0.3s, background 0.3s, color 0.3s; }
        .fd-db-k.yon { border-color: ${T.ok}; background: ${T.okFon}; color: ${T.ok}; }
        .fd-db-k.xira { opacity: 0.5; }
        /* Xarita joylashuvi: telefon chapda → Backend → Database (SABOQ 21); ixcham — Backend va Database ustma-ust */
        .fd-xar-ust { position: relative; display: flex; flex-direction: column; gap: 10px; }
        .fd-xar { display: grid; grid-template-columns: 212px minmax(22px, 52px) minmax(200px, 0.85fr) minmax(18px, 36px) minmax(0, 1.5fr); align-items: start; }
        .fd-xar-ust.ixcham .fd-xar { grid-template-columns: minmax(172px, max-content) minmax(16px, 32px) minmax(0, 1fr); }
        .fd-xar-tel { display: flex; justify-content: center; min-width: 0; }
        .fd-xar-ong { display: flex; flex-direction: column; min-width: 0; }
        .fd-yolak { position: relative; align-self: start; margin-top: 128px; height: 0; border-top: 2px dashed ${fon(T.ink, 0.28)}; }
        .fd-yolak.b2 { margin-top: 56px; }
        .fd-yolak::after { content: ''; position: absolute; right: 0; top: -6px; width: 7px; height: 7px; border-top: 2px solid ${fon(T.ink, 0.28)}; border-right: 2px solid ${fon(T.ink, 0.28)}; transform: rotate(45deg); }
        .fd-pastga { align-self: center; width: 0; height: 14px; margin: 3px 0; border-left: 2px dashed ${fon(T.ink, 0.28)}; }
        .fd-mz { display: grid; grid-template-columns: minmax(172px, max-content) minmax(22px, 52px) minmax(0, 1fr); align-items: start; }
        .fd-mz-ong { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; align-items: start; min-width: 0; }
        .fd-mz-ong > .fd-ichi { grid-column: 1 / -1; }
        @media (max-width: 900px) { .fd-mz-ong { grid-template-columns: minmax(0, 1fr); } }
        /* Uchuvchi konvert — so'rov */
        .fd-konvert { position: absolute; z-index: 6; pointer-events: none; transform: translate(-50%, -50%); padding: 4px 10px 4px 25px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.accent}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink}; white-space: nowrap; box-shadow: 0 10px 20px -8px rgba(${T.shadowBase},0.45); animation: fd-uch 850ms cubic-bezier(.45,0,.25,1) both; }
        .fd-konvert::before { content: ''; position: absolute; left: 7px; top: 50%; width: 12px; height: 9px; margin-top: -4.5px; border: 1.5px solid ${T.accent}; border-radius: 2px; box-sizing: border-box; }
        .fd-konvert::after { content: ''; position: absolute; left: 10px; top: 50%; width: 5px; height: 5px; margin-top: -5px; border-right: 1.5px solid ${T.accent}; border-bottom: 1.5px solid ${T.accent}; transform: rotate(45deg); }
        .fd-konvert.javob { border-color: ${T.ok}; } .fd-konvert.javob::before, .fd-konvert.javob::after { border-color: ${T.ok}; }
        .fd-konvert.qayt { border-color: ${T.err}; animation-name: fd-uch-qayt; } .fd-konvert.qayt::before, .fd-konvert.qayt::after { border-color: ${T.err}; }
        .fd-konvert.nuqta { padding: 0; width: 11px; height: 11px; border: 0; border-radius: 50%; background: ${T.accent}; box-shadow: none; }
        .fd-konvert.nuqta.javob { background: ${T.ok}; }
        .fd-konvert.nuqta::before, .fd-konvert.nuqta::after { display: none; }
        @keyframes fd-uch { 0% { transform: translate(-50%, -50%) scale(0.7); opacity: 0; } 12% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); opacity: 1; } }
        @keyframes fd-uch-qayt { 0% { transform: translate(-50%, -50%); opacity: 0; } 10% { opacity: 1; } 45% { transform: translate(calc(-50% + var(--dx) * 0.42), calc(-50% + var(--dy) * 0.42 - 34px)); } 100% { transform: translate(-50%, -50%); opacity: 0.3; } }
        /* 0-ekran: ikki telefon, orada «umumiy joy — hali yo'q» */
        .fd-ikki { display: grid; grid-template-columns: 172px minmax(90px, 1fr) 172px; align-items: end; gap: 0 10px; }
        .fd-ikki > .fd-t1 { grid-column: 1; grid-row: 1; animation: fd-kot 0.45s ease-out both; }
        .fd-ikki > .fd-t2 { grid-column: 3; grid-row: 1; animation: fd-kot 0.45s ease-out 0.1s both; }
        .fd-orada { grid-column: 2; grid-row: 1; align-self: center; position: relative; display: flex; justify-content: center; margin-top: 30px; }
        .fd-orada-ch { position: absolute; left: -10px; right: -10px; top: 50%; border-top: 2px dashed ${fon(T.ink, 0.35)}; transform-origin: left; animation: fd-chiz 0.6s ease-out both; }
        .fd-orada-k { position: relative; z-index: 1; padding: 8px 10px; border-radius: 10px; border: 1.5px dashed ${T.ink2}; background: ${T.bg}; font-size: 12px; font-weight: 700; color: ${T.ink2}; text-align: center; line-height: 1.3; animation: fd-kot 0.4s ease-out 0.35s both; }
        /* 4-ekran: qator kartasi va «ilova ichi» */
        .q-karta.fd-qk { display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 10px 14px; padding: 12px 16px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); animation: fd-kot 0.4s ease-out both; }
        .fd-qk.xato { border-color: ${T.err}; background: ${T.errFon}; } .fd-qk.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .fd-qk > .q-yorliq { margin: 0; font-size: 11.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .fd-qk-t { flex: 1 1 260px; min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 1.6vw, 15.5px); font-weight: 700; color: ${T.ink}; overflow-wrap: anywhere; }
        .fd-qk-n { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 600; color: ${T.ink}; animation: fd-kot 0.3s ease-out both; }
        .fd-qk-n b { font-size: 17px; } .fd-qk.xato .fd-qk-n b { color: ${T.err}; } .fd-qk.ok .fd-qk-n b { color: ${T.ok}; }
        .fd-ichi { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; min-width: 0; }
        .fd-ichi-h { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; font-size: 13.5px; color: ${T.ink}; }
        .fd-ichi-h code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .fd-ichi-joy { display: flex; flex-direction: column; gap: 6px; min-height: 32px; }
        .fd-ichi-bosh { display: block; height: 32px; border-radius: 8px; border: 1.5px dashed ${T.line}; }
        .fd-env { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; padding: 6px 10px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; animation: fd-tush 0.45s ease-out both; }
        .fd-env code { flex: 1 1 auto; min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; overflow-wrap: anywhere; }
        .fd-env.xato { border-color: ${fon(T.err, 0.45)}; background: ${T.errFon}; }
        .fd-env.ok { border-color: ${fon(T.ok, 0.45)}; background: ${T.okFon}; }
        .fd-env.jwt-qator.xato .fd-env-v { color: ${T.err}; background: ${fon(T.err, 0.14)}; border-radius: 4px; padding: 0 3px; }
        .fd-env-b { font-size: 14px; } .fd-env.xato .fd-env-b { color: ${T.err}; } .fd-env.ok .fd-env-b { color: ${T.ok}; }
        .fd-env-y { flex-basis: 100%; font-size: 12.5px; font-weight: 600; color: ${T.err}; }
        .fd-koz { position: relative; width: 18px; height: 11px; flex: none; border: 1.5px solid ${T.err}; border-radius: 50%; }
        .fd-koz::after { content: ''; position: absolute; left: 50%; top: 50%; width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; border-radius: 50%; background: ${T.err}; }
        /* Reja pastki qatorlari */
        .fd-reja-past { display: flex; flex-direction: column; gap: 4px; }
        p.fd-reja-repo { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; overflow-wrap: anywhere; }
        p.fd-reja-repo code { color: ${T.ink}; font-weight: 700; }
        p.fd-reja-izoh { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        /* Amaliyot bloklari */
        .lesson-root .q-blok .q-split { align-items: start; }
        .fd-ps { display: block; margin: 0; font-size: clamp(12.5px,1.5vw,13.5px); line-height: 1.55; color: ${T.ink}; font-weight: 500; overflow-wrap: break-word; }
        .fd-joy-n { margin-left: 6px; font-size: 12px; font-weight: 500; font-style: italic; color: ${T.ink2}; }
        .fd-joy-n .qcode { background: transparent; padding: 0; font-style: normal; font-weight: 600; color: ${T.ink2}; }
        .fd-band { display: block; margin-top: 5px; }
        .fd-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
        .fd-yordam-s { display: block; padding: 6px 10px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; font-size: 13px; line-height: 1.5; }
        .fd-yordam-l { margin-top: 4px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .fd-yordam-g { display: block; font-size: 12.5px; color: ${T.ink2}; }
        .q-blok-xato .q-btn.fd-yordam-btn { padding: 5px 12px; font-size: 12.5px; }
        .q-blok-t .qcode, .q-blok-xato .qcode, .fd-yordam .qcode, .fd-ps .qcode, .q-blok-tugadi .qcode, p.fd-ortda .qcode { white-space: normal; overflow-wrap: anywhere; }
        p.fd-ortda { margin: 0; font-size: 12.5px; line-height: 1.7; color: ${T.ink2}; overflow-wrap: anywhere; }
        .fd-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; overflow-wrap: anywhere; }
        .fd-nat { display: flex; flex-direction: column; gap: 10px; }
        .fd-nat-ust { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; align-items: start; }
        @media (max-width: 560px) { .fd-nat-ust { grid-template-columns: minmax(0, 1fr); } }
        @media (max-width: 1199px) { .q-blok-natija .fd-nat-ust { padding-right: 38px; } }
        @media (max-width: 860px) { .fd-ikki { padding-top: 34px; } }
        .fd-nat.yon { flex-direction: row; align-items: flex-start; gap: 14px; }
        .fd-nat.yon > :last-child { flex: 1; min-width: 0; }
        @media (max-width: 560px) { .fd-nat.yon { flex-direction: column; align-items: center; } .fd-nat.yon > :last-child { width: 100%; } }
        .fd-kir { animation: fd-kot 0.45s ease-out var(--d, 0s) both; }
        .fd-term { background: ${CODE.bg}; border-radius: 12px; padding: 10px 14px; display: flex; flex-direction: column; gap: 3px; }
        .fd-term-q { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${CODE.text}; overflow-wrap: anywhere; }
        .fd-term-q.buyruq { color: ${CODE.attr}; } .fd-term-q.ok { color: ${CODE.str}; }
        .fd-br { display: flex; flex-direction: column; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; overflow: hidden; }
        .fd-br-bar { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .fd-br-bar i { width: 7px; height: 7px; border-radius: 50%; background: ${T.line}; flex: none; }
        .fd-br-bar span { margin-left: 6px; min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; background: ${T.paper}; border-radius: 6px; padding: 2px 8px; overflow-wrap: anywhere; }
        .fd-br-401 { padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: ${T.ink2}; } .fd-br-401 b { color: ${T.err}; font-size: 20px; }
        .fd-sql { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 12px; border: 1px solid ${T.line}; background: ${fon(T.ink, 0.025)}; min-width: 0; }
        .fd-sql-h { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .fd-render { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; }
        .fd-render-h { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; font-size: 12px; color: ${T.ink2}; } .fd-render-h b { font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: ${T.ink}; }
        .fd-render-q { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12px; color: ${T.ink2}; }
        .fd-render-q small { flex-basis: 100%; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
        .fd-render-q code { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; padding: 2px 7px; border-radius: 6px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .fd-render-q code.yop { color: ${T.ink2}; letter-spacing: 0.1em; }
        /* Kartochkalar (SABOQ 16): birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */
        .fd-flash.yangi .fc-card:not(.flip) .fc-front { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: fd-puls 1.6s ease-out 3; }
        p.fd-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.fd-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: fd-nuqta 1.4s ease-in-out 3; }
        @keyframes fd-nuqta { 50% { transform: scale(1.6); opacity: 0.4; } }
        /* Yakun: «Keyingi dars» nishonlardan oldin (MD tartibi; QYakun children oxirida chiziladi); belgi faqat 3-amaliyotdan keyin */
        .fd-yakun { flex: 1 0 auto; display: flex; flex-direction: column; min-height: 0; }
        .fd-yakun.belgisiz .done-chip { display: none; }
        .fd-yakun .q-yakun > .ach-coll { order: 1; }
        p.fd-keyingi { margin: 0; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
        p.fd-keyingi b { color: ${T.ink}; }
        .rc-ic .fd-rc-kod { display: inline-block; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(13px,2vw,18px); line-height: 1.4; color: ${CODE.text}; background: ${CODE.bg}; padding: 10px 16px; border-radius: 10px; overflow-wrap: anywhere; }
        @media (max-width: 640px) {
          .fd-xar, .fd-xar-ust.ixcham .fd-xar, .fd-mz { grid-template-columns: minmax(0, 1fr); justify-items: center; }
          .fd-yolak, .fd-yolak.b2 { margin: 4px 0; width: 0; height: 16px; border-top: 0; border-left: 2px dashed ${fon(T.ink, 0.28)}; }
          .fd-yolak::after { display: none; }
          .fd-xar > .fd-be, .fd-xar > .fd-db, .fd-xar-ong, .fd-mz-ong { width: 100%; }
          .fd-ikki { grid-template-columns: 172px 172px; justify-content: center; gap: 12px; }
          .fd-ikki > .fd-t2 { grid-column: 2; }
          .fd-orada { grid-column: 1 / -1; grid-row: 2; margin-top: 0; }
          .fd-orada-ch { display: none; }
          .fd-mz-ong { display: flex; flex-direction: column; }
          .fd-mz-ong > .fd-ichi { order: -1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fd-navbat, .fd-navbat-k .q-bashorat, .fd-navbat-k .q-chip, .q-kirish .q-variantlar-kol, .fd-taxmin, .fd-konvert, .fd-tel-ekran, .fd-son.yangi, .fd-doiralar i.yangi, .fd-karta, .fd-tel-xato, .fd-tel-qora,
          .fd-token, .fd-solish, .fd-solish b, .fd-jt tr.kir, .fd-hash-y, .fd-env, .fd-qk, .fd-qk-n, .fd-kir, .fd-orada-ch, .fd-orada-k, .fd-ikki > .fd-t1, .fd-ikki > .fd-t2,
          .fd-flash.yangi .fc-card:not(.flip) .fc-front, p.fd-fc-ipucha i { animation: none !important; }
          .fd-tel-btn, .fd-be, .fd-yol, .fd-qulf, .fd-qulf-b, .fd-qulf-b::before, .fd-jad, .fd-db-k, .fd-jwt { transition: none !important; }
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
