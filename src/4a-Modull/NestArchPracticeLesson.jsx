import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom'; // F-1015-362: «Avval tayyorlaning» oynasi .lesson-root ga (fade-up transform ichida fixed ishlamaydi)
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// NEST ARXITEKTURA MODULI (4a) · PRAKTIKA — "KitobShop" MINI-LOYIHA — PLATFORM STANDARD v18 (AUDIOSIZ)
// Maqsad (YOU-DO): o'quvchi AI agentni boshqarib, 3 bog'langan resursli real backend quradi: Category, Book, Order.
// Boshqaruv sikli: REJALASHTIR (reja) -> YO'NALTIR (agentga aniq buyruq) -> TEKSHIR (natijani tekshir).
// Metafora (modul bo'ylab izchil): restoran -> do'kon. Bo'lim=Module · sotuvchi/ofitsiant=Controller · omborchi/oshpaz=Service
//   · javon chizmasi=Entity · ombor=PostgreSQL · anketa=DTO · kirish taxtasi=AppModule.imports · eshik qo'riqchisi=Guard/@Roles
//   · YORLIQ=@ManyToOne bog'lanishi (ko'p kitob -> bitta yorliq; yorliq KITOBDA saqlanadi).
// Jonli qatlam: PIN + Kahoot-reveal + podium + CodeStrike arena + jonli praktika (500+ signal zonasi).
// Ekranlar: 9 (s0 kirish · s1 reja · s3 aniq buyruq · a2 Copilot agent · s7 @Roles · s14 eshik sinovi · s15 test · spod podium · s20 yakun) — F-1015-353/401.
// F-1015-353 (17.10, avtopilot, foydalanuvchi qarori 6 — Copilot agent): 23 → 9 ekran. a1 — aniq buyruq (eski s3), a2 — Copilot Chat «Agent» rejimi:
//        3 playbook (Category, Book, Order) + tekshiruv + Swagger, a3 — @Roles (eski s7), a4 — eshik sinovi (eski s14), s15 — yagona ballik test.
//        Oldingi 23 ekranli: arxiv/F-1015-nestarch-oldin/.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  danger: '#C2362B', dangerSoft: '#FAE3E0', amber: '#B45309', amberSoft: '#FBEBD8',
  nest: '#E0234E', line: '#E9E6DF',
  shadowBase: '58, 53, 48'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };

// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext, FinishBtn, liveToast } from '../live/index.js';







const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const AchMissCtx = createContext(null); // 🏅 151-qonun: { missed:Set<ekran id>, miss(idx), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi
// Matn ichidagi `kod` bo'laklarini chip qilib ko'rsatadi (qcode)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

// AUDIOSIZ dars — useAudio/getAudioEngine zaglushkasi (imzo saqlanadi, TTS yo'q)
const getAudioEngine = () => null;
const useAudio = () => ({ muted: true, isPlaying: false, currentSegment: null, waitingFor: null, triggerEvent: () => {}, replay: () => {}, toggleMute: () => {} });

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
// Analytics-payload uchun UZ-etalon (options/javob matnlari serverga doim UZ ketadi)
const ou = (o) => (o && o.uz) || o;

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

const LESSON_META = { lessonId: 'nest-arch-practice-4a-03-v18', lessonTitle: { uz: 'Praktika — KitobShop backend', ru: 'Практика — бэкенд KitobShop' } };
const HW_TOKENS = [
  { t: { uz: 'amaliyot', ru: 'практика' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'loyiha', ru: 'проект' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'mashq', ru: 'упражнение' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'natija', ru: 'результат' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-353: a1 — aniq buyruq
  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // Copilot agent playbook
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // a3 — @Roles
  { id: 's14', type: 'case',        template: 'custom',   scored: false, scope: null }, // a4 — eshik sinovi
  { id: 's15', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'spod', type: 'stats',      template: 'custom',   scored: false, scope: null },
  { id: 's20', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const Split = ({ children }) => <div className="split">{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;


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
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-nm">{a.name}</span></div>
          ); })}
        </div>
      )}
    </div>
  );
}


const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic; // F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi
  const padH = isMobile ? 12 : 60; // layout standarti: 1100px + 60px (11.11)
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]);
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
    const tgt = e.target;
    if (tgt && tgt.closest && tgt.closest('.mentor')) return;
    setMCollapsed(true);
    const isControl = tgt && tgt.closest && tgt.closest('button, input, a, .vcard, .option, .hook-option, .swg-row, .tree-row, .pick-row, .bk, .sh, .cl-row, .lg-card');
    if (!isControl) {
      const el = contentRef.current;
      if (el) setTimeout(() => { if (el) el.scrollTo({ top: 0, behavior: 'smooth' }); }, 80);
    }
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
            <div className="chrome-left eyebrow"><span className="dot" /><span>{eyebrow}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AchCounter />
              <div className="mono small" style={{ color: T.ink3 }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
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
// 5.5 — optionalLive: jonli darsda mentor oldinga o'tsa, o'quvchi gate'da qolib ketmaydi (freeRide). Testlarga BERILMAYDI.
const NavNext = ({ disabled, label = { uz: 'Davom etish', ru: 'Продолжить' }, onClick, optionalLive, mentorLock }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  // F-1012: mentor (jonli dars va LMS preview) topshiriqqa qulflanmaydi; o'quvchi allaqachon o'tgan ekranga qaytsa ham qulf yo'q
  // F-1013-02: test ekrani (mentorLock) — mentor avval «Natijani ochish» bosadi, keyin o'tadi (odatiy tartib saqlanadi)
  const freeRide = !!((optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive) || (live && live.mode === 'mentor' && !mentorLock) || (gate && gate.passed));
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(label))}</button>;
};

const FeedbackBlock = ({ show, isCorrect, neutral, children }) => {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (show) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => { setVisible(true); setTimeout(() => { if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 350); })); }
    else { setVisible(false); const t = setTimeout(() => setMounted(false), 400); return () => clearTimeout(t); }
  }, [show]);
  if (!mounted) return null;
  return <div ref={ref} className={`feedback-block ${visible ? 'visible' : ''}`}><div className={neutral ? 'frame-wait' : isCorrect ? 'frame-success' : 'frame-soft'}>{children}</div></div>;
};


// ============================================================
// 📖 QAYTA TUSHUNTIRISH (recap) — scored testda xato chiqsa mavzuni qisqa kartalarda yana ko'rsatish.
// Kalitlar — scored test ekranlarining screens[]-indekslari (5, 8, 12, 15).
// SKELET: kontent «eshik + qo'riqchi», «yorliq», «kirish taxtasi» metaforasida — 🎓 Metodist sayqallaydi.
// ============================================================

const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
const RECAPS = {
  6: {
    title: { uz: "Debug — qo'riqchiga noto'g'ri ro'yxat", ru: 'Дебаг — стражу дали не тот список' },
    cards: [
      { ic: "🧍", h: { uz: "Mijozni o'z do'koningizga kiritmaslik", ru: 'Не пускать клиента в собственный магазин' }, body: { uz: <>Agent <span className="mono">POST /order</span>'ga <span className="mono">@Roles(ADMIN)</span> qo'ygan — mijoz buyurtma bera olmaydi (<b>403</b>).</>, ru: <>Агент поставил на <span className="mono">POST /order</span> <span className="mono">@Roles(ADMIN)</span> — клиент не может сделать заказ (<b>403</b>).</> }, vis: <RcFlow items={[{ uz: 'mijoz', ru: 'клиент' }, "POST /order", "403"]} /> },
      { ic: "🔍", h: { uz: 'Dalil avval, kod keyin', ru: 'Сначала улики, потом код' }, body: { uz: <>Avval eshikni ikki rolda sinab, <b>dalil</b> yig'asiz, keyin kodni ochasiz.</>, ru: <>Сначала вы проверяете дверь в двух ролях и собираете <b>улики</b>, потом открываете код.</> } },
      { ic: "🔧", h: { uz: "Faqat o'sha qator tuzatiladi", ru: 'Правится только эта строка' }, body: { uz: <>Qo'riqchini o'chirmaysiz — faqat <span className="mono">POST /order</span>'ni <span className="mono">@Roles('public')</span> qilasiz.</>, ru: <>Стража вы не убираете — только ставите на <span className="mono">POST /order</span> <span className="mono">@Roles('public')</span>.</> }, ask: { uz: 'Mijoz buyurtma berolsin desak, qatorni qanday tuzatamiz?', ru: 'Как исправить строку, чтобы клиент мог оформить заказ?' } },
    ]
  }
};

// Overlay — ekran USTIDA ochiladi (indekslarga tegmaydi), slayd-slayd o'tiladi.
function RecapOverlay({ screenIdx, onClose, showAsk }) {
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
        <span className="rc-tag">{tr({ uz: '📖 Eslatma', ru: '📖 Напоминание' })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && showAsk && <div className="rc-ask">{tr({ uz: '🗣️ Sinfga savol:', ru: '🗣️ Вопрос классу:' })} {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Назад' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `карточка ${k + 1}` })} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: 'Tushunarli', ru: 'Понятно' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Дальше →' })}</button>}
      </div>
    </div>
  );
}

// ===== 📊 MENTOR STATISTIKASI (jonli test) — proyektorda jonli natija, Kahoot-reveal =====
const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60, RECAP_GOOD_PCT = 75, RECAP_MIN_ANSWERS = 3;
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
        <span className="mstats-lbl">{tr({ uz: '📊 Jonli natija', ru: '📊 Живой результат' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri ✅", ru: 'верно ✅' })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'xato ❌', ru: 'ошибка ❌' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и число ✅/❌ скрыты — по кнопке «Открыть результат» всё появится сразу и у вас, и на экранах учеников.' })}</p>
      )}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
          const n = data.rows.filter(a => a.picked === i).length;
          const pct = answered ? Math.round((n / answered) * 100) : 0;
          const isC = i === correctIdx;
          const col = isC ? T.success : MSTATS_COLORS[i % 4];
          return (
            <div key={i} className={`mstats-row ${!isC ? 'dimmed' : ''}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? '✓' : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round((n / maxN) * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? `${n} ${tr({ uz: "o'quvchi", ru: 'уч.' })} · ${pct}%` : '—'}</span>
            </div>
          );
        })}
      </div>}
      {reveal && answered >= RECAP_MIN_ANSWERS && (() => {
        const pct = Math.round((ok / answered) * 100);
        const level = pct < RECAP_NEED_PCT ? 'need' : pct < RECAP_GOOD_PCT ? 'maybe' : 'good';
        return (
          <div className={`mstats-verdict ${level}`}>
            {level === 'need' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Верно только у <b>{pct}%</b> — класс эту тему не понял. Перед тем как идти дальше, коротко повторите.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: 'Eslatma', ru: 'Напоминание' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr({ uz: '⏳ Kutilmoqda:', ru: '⏳ Ждём:' })}</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Объясните её ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}


// ══ KLAPAN — IPUCHA-ZINAPOYA + RESCUE (KATTA_TOZALASH 13-band) ══
//
// Uch daraja (138-qonun): QULF-YORLIQ aytadi -> IPUCHA chuqurlashtiradi -> RESCUE yo'l ochadi.
// Bu darsda 1-daraja TUG'MA bajarilgan (16 qulf-joyining hammasida yorliq harakatni
// aytadi), shuning uchun 2 va 3-daraja qo'shiladi.
//
// 🔴 BALLIK EKRANLAR (s5·s8·s12·s15) `QuestionScreen` ni ULASHADI — klapan komponent
// ichida BITTA joyda turadi, ipucha esa har wrapper'dan `tip` propi bilan keladi.
// Shunday qilib 138-qonun 2-darajasi («darsning O'Z mazmunidan aniq keyingi qadam»)
// umumiy komponentda ham bajariladi. Rescue-yorlig'i u yerda «Davom etish» EMAS
// (138-qonun qo'shimchasi: ballik ekranda harakat-nom).
//
// IKKI O'LCHOV: `sec` — ekran ochiq turgan vaqt · `idle` — oxirgi HAQIQIY siljishdan beri.
// 🔴 MUSTAQILLIK: hook komponent ICHIDA — setInterval faqat o'sha ekran ochiq turganda
// yuradi va ekran almashganda cleanup bilan to'xtaydi.
const VALVE_TIP_SEC = 40, VALVE_TIP_IDLE = 25;
const VALVE_RES_SEC = 110, VALVE_RES_IDLE = 60;
function useStuckValve(done, progress = 0) {
  const _gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(_gate.live && _gate.live.mode === 'mentor');
  const [sec, setSec] = useState(0);
  const [idle, setIdle] = useState(0);
  const lastProg = useRef(progress);
  useEffect(() => {
    if (lastProg.current !== progress) { lastProg.current = progress; setIdle(0); }
  }, [progress]);
  useEffect(() => {
    if (done || isMentor) return;
    const t = setInterval(() => { setSec(v => v + 1); setIdle(v => v + 1); }, 1000);
    return () => clearInterval(t);
  }, [done, isMentor]);
  const live = !done && !isMentor;
  return {
    tip: live && (sec >= VALVE_TIP_SEC || idle >= VALVE_TIP_IDLE),
    rescue: live && (sec >= VALVE_RES_SEC || idle >= VALVE_RES_IDLE),
    isMentor,
  };
}

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev, tip }) => {
  const _am = useContext(AchMissCtx);
  const fpPractice = !!(_am && _am.practice); // 151-qonun 6-band: «Qaytadan» mashq-o'tishi — hech qayerga yozilmaydi
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student'); // jonli dars: BITTA urinish
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now());
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const { tip: _tip, rescue: _resc } = useStuckValve(solved, picked === null ? -1 : picked);   // 13-band klapan
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  const [recapOpen, setRecapOpen] = useState(false);
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect(() => { if (isMentorLive && liveRevealScreen === screen) setMReveal(true); }, [isMentorLive, liveRevealScreen, screen]);
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === correctIdx;
    setPicked(i);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect;
    if (oneShot) {
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    // Har urinish tarixga (LMS analitika, 0005): ball emas, yozuv; modulsiz eski darsda recordAttempt yo'q
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: options.map(ou), picked: ou(options[i]), correct: ou(options[correctIdx]), lang: (typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz' });
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext mentorLock disabled={isMentorLive ? !mReveal : (!solved && !_resc)} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : _resc ? tr({ uz: "Javobni birga ko'ramiz →", ru: 'Разберём ответ вместе →' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: 'flex-start', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, подумайте перед нажатием!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: picked !== null ? 8 : 11 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; }
            } else if (solved) {
              if (waiting) { if (i === picked) cls += ' option-wait'; }
              else { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; if (wrongLocked && i === picked) cls += ' option-picked-wrong'; }
            }
            else if (i === picked) cls += ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(tr(opt))}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          {(isMentorLive || waiting || wrongLocked) && (<p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? <>{tr({ uz: "✓ To'g'ri javob:", ru: '✓ Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>{tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>)}
          <p className="body" style={{ margin: 0 }}>
            {!isMentorLive && !waiting && !wrongLocked && <b className="fb-mark" style={{ color: solved ? T.success : T.accent, marginRight: 6 }}>{solved ? tr({ uz: "✓ To'g'ri.", ru: '✓ Верно.' }) : tr({ uz: '✗ Xato.', ru: '✗ Неверно.' })}</b>}
            {isMentorLive
              ? fmtCode(tr(explainCorrect))
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете правильный ответ.' })
                : wrongLocked
                  ? fmtCode(tr(explainWrong[picked] ?? explainWrong.default))
                  : solved ? fmtCode(tr(explainCorrect)) : fmtCode(tr(explainWrong[picked] ?? explainWrong.default))}
          </p>
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: '📖 Eslatma', ru: '📖 Напоминание' })}</button>
          )}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} showAsk={isMentorLive} />}
        {_tip && !solved && tip && <p className="bhint fade-step">{tr(tip)}</p>}
        {_resc && !solved && <p className="bhint calm fade-step">{tr({ uz: "Bu savolni keyinroq birga ko'rib chiqamiz — hozir davom etsangiz bo'ladi.", ru: 'Этот вопрос разберём вместе позже — сейчас можно продолжить.' })}</p>}
      </div>
    </Stage>
  );
};

function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.success : T.accent;
  const R = 50, ST = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState(C);
  useEffect(() => { const t = setTimeout(() => setOff(C * (1 - PCT)), 200); return () => clearTimeout(t); }, [C, PCT]);
  return (
    <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink3 + '40'} strokeWidth={ST} />
        <circle cx="64" cy="64" r={R} fill="none" stroke={col} strokeWidth={ST} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 64 64)" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr({ uz: "to'g'ri javob", ru: 'правильных ответов' })}</div></div>
    </div>
  );
}

const Zoomable = ({ children, off = false }) => { /* F-0926-06: off — zoom-tugma bo'sh ustun ustida yolg'iz qolmasin (159/3) */
  const [big, setBig] = useState(false);
  // bo'sh ustunda ⛶ va yorliq yolg'iz osilmasin (F-0926-01, 111-qonun): mazmun DOM bo'yicha o'lchanadi
  const zref = useRef(null);
  const [hasContent, setHasContent] = useState(true);
  useEffect(() => {
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
      <div ref={zref} className={`zoomable ${big ? 'zoom-on' : ''}${hasContent ? '' : ' z-empty'}`}>
        {hasContent && !off && <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>}
        {children}
      </div>
    </>
  );
};
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> {tr({ uz: "· ko'rsatmani ochish ▾", ru: '· открыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};
const Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;

const CodeFile = ({ name, children, minH }) => (
  <div className="editor">
    <div className="editor-bar"><span className="bb-dots"><i /><i /><i /></span><span className="editor-tab">{name}</span></div>
    <div className="editor-body" style={{ minHeight: minH }}><pre className="editor-code">{children}</pre></div>
  </div>
);
const AgentCard = ({ children, title = { uz: "Agentni shunday yo'naltiring", ru: 'Направьте агента так' } /* F-0926-06: sarlavha emojisi olindi (H3) */ }) => (
  <div className="agent-card"><span className="agent-lbl">{tr(title)}</span><p className="agent-msg">{children}</p></div>
);
// ===== MOCK SWAGGER (KitobShop, lock = faqat admin) =====
const M_COLOR = { GET: '#0B6E8F', POST: T.success, PATCH: T.amber, DELETE: T.danger }; // F-1015-352: GET kontrasti
const SHOP_EPS = [
  { m: 'POST', path: '/category', lock: true, sum: { uz: "Kategoriya qo'shish", ru: 'Добавить категорию' }, resp: '{ "statusCode": 201, "data": { "id": "ct1...", "name": "Detektiv" } }' },
  { m: 'GET', path: '/category', lock: false, sum: { uz: 'Kategoriyalar', ru: 'Категории' }, resp: '{ "statusCode": 200, "data": [ { "name": "Detektiv" }, { "name": "Ilmiy" } ] }' },
  { m: 'POST', path: '/book', lock: true, sum: { uz: "Kitob qo'shish", ru: 'Добавить книгу' }, resp: '{ "statusCode": 201, "data": { "title": "Sherlok Holms", "price": 45000 } }' },
  { m: 'GET', path: '/book', lock: false, sum: { uz: 'Barcha kitoblar', ru: 'Все книги' }, resp: '{ "statusCode": 200, "data": [ { "title": "Sherlok Holms", "author": "Doyl", "price": 45000 } ] }' },
  { m: 'GET', path: '/book/featured', lock: false, sum: { uz: '⭐ Top kitoblar', ru: '⭐ Топ-книги' }, resp: '{ "statusCode": 200, "data": [ { "title": "Sherlok Holms", "is_featured": true } ] }' },
  { m: 'POST', path: '/order', lock: false, sum: { uz: 'Buyurtma berish', ru: 'Оформить заказ' }, resp: '{ "statusCode": 201, "data": { "bookId": "bk1...", "quantity": 2 } }' },
  { m: 'GET', path: '/order', lock: true, sum: { uz: 'Buyurtmalar', ru: 'Заказы' }, resp: '{ "statusCode": 200, "data": [ { "customer_name": "Ali", "quantity": 2 } ] }' }
];
const ShopSwagger = ({ eps = SHOP_EPS, openId, onToggle, triedIds, onTry }) => (
  <div className="swg">
    <div className="swg-top"><span className="swg-dot" /> KitobShop API <span className="swg-ver">/api/v1</span></div>
    {eps.map(e => {
      const id = e.m + e.path;
      const open = openId === id;
      const tried = triedIds.has(id);
      return (
        <div key={id} className="swg-row">
          <button className={`swg-head ${!tried && !open ? 'tap-hint' : ''}`} onClick={() => onToggle(id)}>
            <span className="swg-m" style={{ background: M_COLOR[e.m] }}>{e.m}</span>
            <span className="swg-path">{e.path}</span>
            <span className="swg-sum">{tr(e.sum)}</span>
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span title={e.lock ? tr({ uz: 'faqat admin', ru: 'только админ' }) : tr({ uz: 'ochiq', ru: 'открыто' })} style={{ fontSize: 12 }}>{e.lock ? '🔒' : '🌐'}</span>
              <span className="swg-chev">{open ? '▾' : '▸'}</span>
            </span>
          </button>
          {open && (
            <div className="swg-detail el-in">
              {!tried
                ? <button className="btn-soft" onClick={() => onTry(id)} style={{ alignSelf: 'flex-start' }}>▶ Try it out</button>
                : <><div className="swg-code-lbl">{tr({ uz: 'Javob', ru: 'Ответ' })} · <span style={{ color: T.success }}>{e.m === 'POST' ? '201' : '200'}</span></div><pre className="json">{e.resp}</pre></>}
            </div>
          )}
        </div>
      );
    })}
  </div>
);
// ===== PICK LINES (Dars 2 dan) =====
const PickLines = ({ fileName, scaffoldTop, scaffoldBottom, candidates, agent, instruction, onComplete, completedInit, onWrong }) => {
  const correct = candidates.filter(c => c.correct);
  const [picked, setPicked] = useState(() => completedInit ? new Set(correct.map(c => c.id)) : new Set());
  const [shakeId, setShakeId] = useState(null);
  const [why, setWhy] = useState(null);
  const done = correct.every(c => picked.has(c.id));
  const fired = useRef(false);
  useEffect(() => { if (done && !fired.current) { fired.current = true; onComplete && onComplete(); } }, [done]);
  const tap = (c) => {
    if (picked.has(c.id) || done) return;
    if (c.correct) { setPicked(p => { const s = new Set(p); s.add(c.id); return s; }); setWhy(null); }
    else { if (onWrong) onWrong(); setShakeId(c.id); setWhy(c.why); setTimeout(() => setShakeId(x => (x === c.id ? null : x)), 450); }
  };
  const pickedCorrect = correct.filter(c => picked.has(c.id));
  return (
    <Zoomable>
    <div className="split">
      <Col>
        {/* F-0926-06: fayl-nomi yorlig'i olindi — oyna tab'ida bor (159/7) */}
        <CodeFile name={fileName} minH={120}>
          {scaffoldTop}{'\n'}
          {pickedCorrect.length === 0
            ? <span className="line-empty">{'  ' + tr({ uz: "// qatorlarni tanlang", ru: '// выберите строки' }) /* F-0926-06: joy so'zi olindi (159/11) */}</span>
            : pickedCorrect.map((c, i) => <React.Fragment key={c.id}>{i > 0 ? '\n' : ''}{'  '}{c.node}</React.Fragment>)}
          {'\n'}{scaffoldBottom}
        </CodeFile>
        {agent && <AgentCard>{tr(agent)}</AgentCard>}
      </Col>
      <Col>
        {/* F-0926-06: variantlar ustidagi savol-yorliq olindi — mentor «tanlang» deydi (G1) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {candidates.map(c => (
            <button key={c.id} className={`pick-row ${picked.has(c.id) ? 'picked' : ''} ${shakeId === c.id ? 'shake' : ''}`} disabled={picked.has(c.id)} onClick={() => tap(c)}>
              <span style={{ flex: 1 }}>{c.label}</span>
              <span className="pick-plus">{picked.has(c.id) ? '✓' : '+'}</span>
            </button>
          ))}
        </div>
        {why && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr(why)}</p></div>}
        {/* F-0926-06: ichki «✓ Fayl tayyor» olindi — natija ekran ostidagi kartada bir marta (I3) */}
      </Col>
    </div>
    </Zoomable>
  );
};

// ===== AGENT FAYL GENERATSIYASI (Dars 2 s16 dan) =====
const FileGen = ({ files, running, n }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    {files.map((file, i) => {
      const ready = i < n;
      const active = running && i === n;
      if (!ready && !active) return <div key={i} className="gen-file" style={{ opacity: 0.4 }}><span className="gen-ico">·</span><span className="mono" style={{ flex: 1 }}>{file.f}</span></div>;
      return (
        <div key={i} className={`gen-file ${ready ? 'ready' : ''} el-in`}>
          <span className="gen-ico" style={{ color: ready ? T.success : T.amber }}>{ready ? '✓' : '⏳'}</span>
          <span className="mono" style={{ flex: 1 }}>{file.f}</span>
          <span className="gen-d">{ready ? tr(file.d) : tr({ uz: 'yozilmoqda…', ru: 'пишется…' })}</span>
        </div>
      );
    })}
  </div>
);
function useFileGen(total, storedAnswer) {
  const [n, setN] = useState(storedAnswer ? total : 0);
  const [running, setRunning] = useState(false);
  const done = n >= total;
  useEffect(() => {
    if (!running) return;
    if (n >= total) { setRunning(false); return; }
    const t = setTimeout(() => setN(x => x + 1), 560);
    return () => clearTimeout(t);
  }, [running, n, total]);
  const run = () => { if (running || done) return; setN(0); setRunning(true); };
  return { n, running, done, run };
}
// ===== TEKSHIRUV CHECKLIST (TEKSHIRUVCHI roli) =====
const Checklist = ({ items, doneInit, onComplete }) => {
  const [seen, setSeen] = useState(() => doneInit ? new Set(items.map((_, i) => i)) : new Set());
  const done = seen.size >= items.length;
  const fired = useRef(false);
  useEffect(() => { if (done && !fired.current) { fired.current = true; onComplete && onComplete(); } }, [done]);
  const tap = (i) => setSeen(prev => { const s = new Set(prev); s.add(i); return s; });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {items.map((it, i) => {
        const on = seen.has(i);
        return (
          <button key={i} className={`vcard ${on ? '' : 'tap-hint'}`} onClick={() => tap(i)} style={{ background: on ? T.successSoft : undefined, alignItems: 'flex-start' }} /* F-0926-06: bajarilgan — ✓ + yumshoq fon, yashil ramka olindi (G3) */>
            <span className="vseen" style={{ marginLeft: 0, marginRight: 2, color: on ? T.success : T.ink3, minWidth: 18 }}>{on ? '✓' : '☐'}</span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
              <span className="vlbl" style={{ fontFamily: "'Manrope'", fontSize: 13 }}>{tr(it.t)}</span>
              {on && <span className="role-r el-in">{tr(it.ok)}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
};
// ===== SO'ROV YO'LI (Integration) =====
const SHOP_FLOW = [
  { k: { uz: 'Admin', ru: 'Админ' }, icon: '🔒', r: 'POST /book', d: { uz: "Admin token bilan yangi kitob qo'shadi (guard ruxsat beradi).", ru: 'Админ добавляет новую книгу с токеном (страж пропускает).' } },
  { k: { uz: 'Mijoz', ru: 'Клиент' }, icon: '🌐', r: 'GET /book/featured', d: { uz: "Mijoz top kitoblarni ko'radi — token kerakmas (public).", ru: 'Клиент смотрит топ-книги — токен не нужен (public).' } },
  { k: { uz: 'Buyurtma', ru: 'Заказ' }, icon: '🛒', r: 'POST /order', d: { uz: "Mijoz bookId bilan buyurtma beradi (Order → Book bog'lanishi).", ru: 'Клиент оформляет заказ с bookId (связь Order → Book).' } },
  { k: { uz: 'Tekshiruv', ru: 'Проверка' }, icon: '📋', r: 'GET /order', d: { uz: "Admin kelgan buyurtmalarni ko'radi (faqat admin).", ru: 'Админ просматривает поступившие заказы (только админ).' } },
  { k: { uz: 'Tayyor', ru: 'Готово' }, icon: '✅', r: { uz: 'KitobShop ishlaydi', ru: 'KitobShop работает' }, d: { uz: "Admin + mijoz oqimi to'liq — real do'kon backendi!", ru: 'Поток админа и клиента замкнулся — бэкенд настоящего магазина!' } }
];

// ===== 🧵 BEAT 0 — MEROS TASMASI: restoran -> bitta bo'lim -> KitobShop (xodimlar bir xil) =====
// ===== SCREEN 0 — HOOK: tayyor KitobShop + meros tasmasi =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [openId, setOpenId] = useState(null);
  const [tried, setTried] = useState(storedAnswer ? new Set(['GET/book/featured']) : new Set());
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const triedOne = tried.size >= 1;
  const OPTS = [
    { id: 'a', label: { uz: 'Hammasini bitta ulkan faylga yozamiz', ru: 'Запишем всё в один огромный файл' } },
    { id: 'b', label: { uz: '3 resurs — har biri 5 qadam, agent bilan tez quramiz', ru: '3 ресурса — по 5 шагов на каждый, быстро строим с агентом' } },
    { id: 'c', label: { uz: "Bunday do'kon backendini faqat katta jamoa quradi", ru: 'Такой бэкенд магазина под силу только большой команде' } }
  ];
  const toggle = (id) => { setOpenId(o => o === id ? null : id); setSc(n => n + 1); };
  const onTry = (id) => { setTried(prev => { const s = new Set(prev); s.add(id); return s; }); setSc(n => n + 1); };
  // F-1015-398 (216-qonun): variantga bitta qisqa gap + «Bugun…» qatori (eski uzun matn o'qilmasdi)
  const ACK = {
    a: { uz: 'Bitta ulkan fayl — har o\'zgarish uni chalkashtiradi.', ru: 'Один огромный файл — каждая правка его запутывает.' },
    b: { uz: 'Aynan!', ru: 'Именно!' },
    c: { uz: 'Katta jamoa emas — tartib kerak.', ru: 'Нужна не команда — порядок.' }
  };
  const pick = (v) => { if (picked !== null || !triedOne) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: v === 'b' }); };
  return (
    <Stage eyebrow={tr({ uz: 'Praktika · kirish', ru: 'Практика · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr({ uz: <>Mana siz quradigan narsa — haqiqiy <span className="italic" style={{ color: T.accent }}>onlayn kitob do'koni</span>.</>, ru: <>Вот что вы построите — настоящий <span className="italic" style={{ color: T.accent }}>онлайн-магазин книг</span>.</> })}</h1>
        <Mentor>{tr({ uz: <>Bu — <b style={{ color: T.ink }}>KitobShop</b>: admin kitob qo'shadi, mijoz ko'radi va buyurtma beradi. Har qator — bitta <b style={{ color: T.ink }}>eshik</b> (endpoint): 🔒 faqat admin, 🌐 hamma. Bittasini ochib <b style={{ color: T.ink }}>«Try it out»</b> bilan sinang.</>, ru: <>Это — <b style={{ color: T.ink }}>KitobShop</b>: админ добавляет книги, клиент смотрит и заказывает. Каждая строка — одна <b style={{ color: T.ink }}>дверь</b> (endpoint): 🔒 только админ, 🌐 все. Откройте одну и проверьте через <b style={{ color: T.ink }}>«Try it out»</b>.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <ShopSwagger openId={openId} onToggle={toggle} triedIds={tried} onTry={onTry} />
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Bunday backendni qanday quramiz?', ru: 'Как построить такой бэкенд?' })}</p>
            <div className="s0-opts fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null || !triedOne} style={{ opacity: !triedOne ? 0.55 : 1 }} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>);
              })}
            </div>
            {picked !== null && <p className="hook-ack fade-step"><b>{tr(ACK[picked])}</b> {tr({ uz: "Bugun 3 resursni agent bilan qurasiz: siz buyurasiz, tekshirasiz.", ru: 'Сегодня строите 3 ресурса с агентом: Вы даёте команду и проверяете.' })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== F-1015-353: 23 → 9 ekran. KitobShop: Copilot Chat «Agent» rejimi — playbook (Category, Book, Order) → tekshiruv → @Roles → eshik sinovi =====
// F-1015-372: «Qadamlar» pastga ochilmaydi — o'rtada oyna («Avval tayyorlaning» kabi); ✕, Esc yoki fon bilan yopiladi, fokus tugmaga qaytadi
const QadamTugma = ({ b }) => {
  const [ochiq, setOchiq] = useState(false);
  const btnRef = useRef(null);
  const yopRef = useRef(null);
  const yop = () => { setOchiq(false); setTimeout(() => btnRef.current && btnRef.current.focus(), 0); };
  useEffect(() => {
    if (!ochiq) return;
    const onKey = (e) => { if (e.key === 'Escape') yop(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    yopRef.current && yopRef.current.focus();
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [ochiq]);
  const sarlavha = <>{tr({ uz: 'Qadamlar', ru: 'Шаги' })} · {b.length}</>;
  return (
    <div className={`am-karta am-qt`}>
      <button ref={btnRef} type="button" className="am-qt-btn" aria-haspopup="dialog" aria-expanded={ochiq} onClick={() => setOchiq(true)}>
        <span>{sarlavha}</span><span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && createPortal(<>
        <div className="zoom-backdrop" onClick={yop} />
        <div className="am-tt-oyna" role="dialog" aria-modal="true" aria-label={tr({ uz: 'Qadamlar', ru: 'Шаги' })}>
          <div className="am-tt-oyna-h"><span className="am-tayyor-h">{sarlavha}</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button></div>
          <ol className="am-qadam">{b.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
        </div>
      </>, (btnRef.current && btnRef.current.closest('.lesson-root')) || document.body)}
    </div>
  );
};
const TAYYOR = [
  { uz: "O'tgan darsdagi Nest loyihasini (IntroNestArxitechture) VS Code'da oching, terminalda `npm run start:dev` — Swagger localhost:3000/api da ochiladimi?", ru: 'Откройте в VS Code Nest-проект с прошлого урока (IntroNestArxitechture), в терминале `npm run start:dev` — Swagger открывается на localhost:3000/api?' },
  { uz: "Copilot Chat'ni oching (`Ctrl+Alt+I`) va chat ostidagi ro'yxatdan «Agent» rejimini tanlang.", ru: 'Откройте Copilot Chat (`Ctrl+Alt+I`) и в списке под чатом выберите режим «Agent».' },
  { uz: "PostgreSQL ishlab turganini tekshiring (loyihaning `.env` faylidagi baza).", ru: 'Проверьте, что PostgreSQL работает (база из файла `.env` проекта).' }
];
// F-1015-362: pastga ochilmaydi — o'rtada oyna (⛶ kabi); ✕, Esc yoki fon bilan yopiladi, fokus tugmaga qaytadi; portal — .lesson-root (zoom va CSS shu yerda)
const TayyorTugma = () => {
  const [ochiq, setOchiq] = useState(false);
  const [korgan, setKorgan] = useState(false);
  const btnRef = useRef(null);
  const yopRef = useRef(null);
  const yop = () => { setOchiq(false); setTimeout(() => btnRef.current && btnRef.current.focus(), 0); };
  useEffect(() => {
    if (!ochiq) return;
    const onKey = (e) => { if (e.key === 'Escape') yop(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    yopRef.current && yopRef.current.focus();
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [ochiq]);
  const sarlavha = <>{tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })} · {tr({ uz: `${TAYYOR.length} qadam`, ru: `${TAYYOR.length} шага` })}</>;
  return (
    <div className="fade-up delay-1"><div className={`am-tayyor am-tt ${korgan ? '' : 'am-tt-nafas'}`}>
      <button ref={btnRef} type="button" className="am-tt-btn" aria-haspopup="dialog" aria-expanded={ochiq} onClick={() => { setOchiq(true); setKorgan(true); }}>
        <span className="am-tayyor-h">{sarlavha}</span>
        <span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && createPortal(<>
        <div className="zoom-backdrop" onClick={yop} />
        <div className="am-tt-oyna" role="dialog" aria-modal="true" aria-label={tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })}>
          <div className="am-tt-oyna-h"><span className="am-tayyor-h">{sarlavha}</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button></div>
          <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
          <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: 'Готово — «Начинаем».' })}</p>
        </div>
      </>, (btnRef.current && btnRef.current.closest('.lesson-root')) || document.body)}
    </div></div>
  );
};
const KodNusxa = ({ yorliq, kod }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(kod); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-karta">
      <div className="am-prompt-h"><p className="flow-label">{tr(yorliq)}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></div>
      <pre className="am-masalan">{kod}</pre>
    </div>
  );
};
const BLOK4 = [
  { t: { uz: 'Aniq buyruq — Category', ru: 'Точная команда — Category' }, tag: { uz: 'siz', ru: 'Вы' } },
  { t: { uz: '3 resurs — playbook', ru: '3 ресурса — playbook' }, tag: 'Copilot Agent' },
  { t: { uz: 'Eshiklar: ochiq yoki admin', ru: 'Двери: открыто или админ' }, tag: '@Roles' },
  { t: { uz: 'Eshik sinovi — xatoni topish', ru: 'Проверка дверей — поиск ошибки' }, tag: { uz: 'siz', ru: 'Вы' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz', ru: 'Начинаем' }} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun KitobShop'ni <span className="italic" style={{ color: T.accent }}>agent</span> bilan qurasiz.</>, ru: <>Сегодня строите KitobShop вместе с <span className="italic" style={{ color: T.accent }}>агентом</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>O'tgan darsda mashinalar resursini qo'lda qo'shdingiz — 5 fayl va AppModule. Bugun xuddi shu ishni <b style={{ color: T.ink }}>Copilot agenti</b> qiladi: u bir nechta faylni o'zi yozadi. Sizning ishingiz — aniq buyruq berish va natijani tekshirish.</>, ru: <>На прошлом уроке Вы вручную добавили ресурс машин — 5 файлов и AppModule. Сегодня ту же работу делает <b style={{ color: T.ink }}>агент Copilot</b>: он сам пишет несколько файлов. Ваша работа — дать точную команду и проверить результат.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · KitobShop API', ru: 'К концу урока · KitobShop API' })}</p>
          <ShopSwagger openId={null} onToggle={() => {}} triedIds={new Set(SHOP_EPS.map(e => e.m + e.path))} onTry={() => {}} />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · KitobShop API', ru: 'К концу урока · KitobShop API' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: '3 resurs', ru: '3 ресурса' })}</p>
            <ul className="cr-jadval">
              <li><code className="qcode">Category</code><span>{tr({ uz: 'kitob turlari', ru: 'жанры книг' })}</span></li>
              <li><code className="qcode">Book</code><span>{tr({ uz: '@ManyToOne → Category', ru: '@ManyToOne → Category' })}</span></li>
              <li><code className="qcode">Order</code><span>{tr({ uz: '@ManyToOne → Book', ru: '@ManyToOne → Book' })}</span></li>
            </ul>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK4.length} blok`, ru: `${BLOK4.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK4.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a2 — Copilot Chat «Agent» rejimi: 3 ta playbook, tekshiruv ro'yxati, Swagger'da sinash =====
const PLAYBOOK = [
  { id: 'cat', nom: 'Category', uz: "Category resursini qo'sh: Entity (name) → Create/Update DTO (@IsString) → BaseService'dan CategoryService → CRUD controller → CategoryModule va AppModule'ga ula. POST, PATCH, DELETE — @Roles('admin'); GET — ochiq.", ru: "Добавь ресурс Category: Entity (name) → Create/Update DTO (@IsString) → CategoryService от BaseService → CRUD controller → CategoryModule и подключи в AppModule. POST, PATCH, DELETE — @Roles('admin'); GET — открыто." },
  { id: 'book', nom: 'Book', uz: "Book resursini qo'sh: Entity (title, author, price, is_featured — boolean, default false) va Category bilan @ManyToOne (ko'p kitob → bitta kategoriya) → Create/Update DTO (@IsString, @IsNumber, categoryId) → BaseService'dan BookService → CRUD controller + GET /book/featured (faqat is_featured: true) → BookModule va AppModule'ga ula. POST, PATCH, DELETE — @Roles('admin'); GET — ochiq.", ru: "Добавь ресурс Book: Entity (title, author, price, is_featured — boolean, default false) и @ManyToOne с Category (много книг → одна категория) → Create/Update DTO (@IsString, @IsNumber, categoryId) → BookService от BaseService → CRUD controller + GET /book/featured (только is_featured: true) → BookModule и подключи в AppModule. POST, PATCH, DELETE — @Roles('admin'); GET — открыто." },
  { id: 'order', nom: 'Order', uz: "Order resursini qo'sh: Entity (customer_name, quantity) va Book bilan @ManyToOne (har buyurtma — bitta kitob) → Create DTO (@IsString, @IsInt, bookId) → BaseService'dan OrderService → controller: POST /order — ochiq (mijoz), GET /order — @Roles('admin') → OrderModule va AppModule'ga ula.", ru: "Добавь ресурс Order: Entity (customer_name, quantity) и @ManyToOne с Book (каждый заказ — одна книга) → Create DTO (@IsString, @IsInt, bookId) → OrderService от BaseService → controller: POST /order — открыто (клиент), GET /order — @Roles('admin') → OrderModule и подключи в AppModule." }
];
const AGENT_QADAM = [
  { uz: "Playbookni nusxalang va Copilot Chat'ga («Agent» rejimida) qo'ying, Enter.", ru: 'Скопируйте playbook и вставьте в Copilot Chat (режим «Agent»), Enter.' },
  { uz: "Agent qaysi fayllarni yaratganini va o'zgartirganini ro'yxatdan ko'ring — har birini oching va o'qing.", ru: 'Посмотрите в списке, какие файлы агент создал и изменил, — откройте и прочитайте каждый.' },
  { uz: "Tekshiruv ro'yxatidan o'tsa — «Keep» (saqlash); noto'g'ri bo'lsa — «Undo» va buyruqni aniqlashtiring.", ru: 'Если проходит список проверки — «Keep» (сохранить); если неверно — «Undo» и уточните команду.' },
  { uz: "`npm run start:dev` — Swagger'da yangi eshiklarni «Try it out» bilan sinang. Keyingi resursga o'ting.", ru: '`npm run start:dev` — испытайте новые двери в Swagger через «Try it out». Переходите к следующему ресурсу.' }
];
const TEKSHIRUV = [
  { uz: "5 fayl bor: entity, dto, service, controller, module", ru: 'Есть 5 файлов: entity, dto, service, controller, module' },
  { uz: "Modul AppModule'ning imports ro'yxatiga yozilgan (usiz — 404)", ru: 'Модуль вписан в imports в AppModule (без него — 404)' },
  { uz: "Service BaseService'dan meros oladi — CRUD qayta yozilmagan", ru: 'Service наследует BaseService — CRUD не переписан заново' },
  { uz: "@Roles('admin') faqat kerakli eshiklarda (POST/PATCH/DELETE)", ru: "@Roles('admin') только на нужных дверях (POST/PATCH/DELETE)" }
];
const ScreenAgent = ({ screen, onNext, onPrev }) => {
  const [res, setRes] = useState('cat');
  const [belgi, setBelgi] = useState(() => new Set());
  const [openId, setOpenId] = useState(null);
  const [tried, setTried] = useState(() => new Set());
  const pb = PLAYBOOK.find(x => x.id === res);
  const tog = (i) => setBelgi(b => { const n = new Set(b); const k = res + i; if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const tayyor = PLAYBOOK.filter(x => TEKSHIRUV.every((_, i) => belgi.has(x.id + i))).length;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Copilot Agent', ru: 'Практика 2 · Copilot Agent' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>3 resursni <span className="italic" style={{ color: T.accent }}>agentga</span> qurdiring.</>, ru: <>Пусть <span className="italic" style={{ color: T.accent }}>агент</span> построит 3 ресурса.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har resurs — bitta playbook: Entity → DTO → Service → Controller → Module va AppModule. Agent aynan aytganingizni yozadi, shuning uchun har natijani tekshiruv ro'yxati bilan solishtiring va faqat keyin «Keep» bosing.</>, ru: <>Каждый ресурс — один playbook: Entity → DTO → Service → Controller → Module и AppModule. Агент пишет ровно то, что Вы сказали, поэтому сверяйте каждый результат со списком проверки и только потом жмите «Keep».</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-chips">{PLAYBOOK.map(x => <button key={x.id} type="button" className={`am-chip ${res === x.id ? 'on' : ''}`} aria-pressed={res === x.id} onClick={() => setRes(x.id)}>{TEKSHIRUV.every((_, i) => belgi.has(x.id + i)) ? '✓ ' : ''}{x.nom}</button>)}</div>
            <KodNusxa yorliq={{ uz: `Playbook · ${pb.nom}`, ru: `Playbook · ${pb.nom}` }} kod={tr(pb)} />
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: `Tekshiruv · ${pb.nom}`, ru: `Проверка · ${pb.nom}` })}</p>
              <div className="ag-tek">{TEKSHIRUV.map((t, i) => <label key={i} className="ag-tek-q"><input type="checkbox" checked={belgi.has(res + i)} onChange={() => tog(i)} /><span>{tr(t)}</span></label>)}</div>
              <p className="ql-xabar info" role="status">{tr({ uz: `Tekshirilgan resurslar: ${tayyor} / 3`, ru: `Проверено ресурсов: ${tayyor} / 3` })}</p>
            </div>
          </Col>
          <Col>
            <QadamTugma b={AGENT_QADAM} />
            <p className="flow-label">{tr({ uz: "Swagger · sinab ko'ring", ru: 'Swagger · попробуйте' })}</p>
            <ShopSwagger openId={openId} onToggle={(id) => setOpenId(o => (o === id ? null : id))} triedIds={tried} onTry={(id) => setTried(t => new Set([...t, id]))} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — 🎯 BEAT 1: agent AYNAN aytganingizni yozadi (3 neytral buyruq · oqibat = kirish taxtasi) =====
const CMDS = [
  { id: 'c1', label: { uz: '1-buyruq', ru: 'Команда 1' }, text: { uz: '"kategoriya qil"', ru: '«сделай категорию»' }, wired: false,
    files: [{ f: 'category.ts', d: { uz: 'hammasi bitta faylda', ru: 'всё в одном файле' } }],
    note: { uz: "Agent nima so'ralganini o'zi taxmin qildi — bitta chalkash fayl. Qaysi ustun? Qaysi qatlam? Noma'lum.", ru: 'Агент сам догадывался, что от него хотят — один запутанный файл. Какие колонки? Какой слой? Неизвестно.' } },
  { id: 'c2', label: { uz: '2-buyruq', ru: 'Команда 2' }, text: { uz: '"category.entity.ts yoz: name ustuni."', ru: '«напиши category.entity.ts: колонка name»' }, wired: false,
    files: [{ f: 'category.entity.ts', d: 'name' }],
    note: { uz: "Buyruq aniq — lekin TO'LIQ emas. Agent aynan so'ralganini yozdi: bitta fayl. DTO, service, controller, module va ulanish yo'q.", ru: 'Команда чёткая — но НЕ полная. Агент написал ровно то, что просили: один файл. Ни DTO, ни service, ни controller, ни module, ни подключения.' } },
  { id: 'c3', label: { uz: '3-buyruq', ru: 'Команда 3' }, text: { uz: '"Category resursini qo\'sh: Entity (name) -> DTO -> BaseService\'dan service -> CRUD controller -> module va AppModule\'ga ula."', ru: '«Добавь ресурс Category: Entity (name) -> DTO -> service от BaseService -> CRUD-controller -> module и подключи к AppModule»' }, wired: true,
    files: [{ f: 'category.entity.ts', d: 'name' }, { f: 'create/update-category.dto.ts', d: { uz: 'anketa', ru: 'анкета' } }, { f: 'category.service.ts', d: 'BaseService' }, { f: 'category.controller.ts', d: 'CRUD' }, { f: 'category.module.ts', d: { uz: "bo'lim", ru: 'отдел' } }, { f: 'AppModule.imports += CategoryModule', d: { uz: 'kirish taxtasi', ru: 'входная вывеска' } }],
    note: { uz: "To'liq playbook: 5 fayl + bo'lim kirish taxtasiga yozildi. Endi /category tirik.", ru: 'Полный плейбук: 5 файлов + отдел вписан на входную вывеску. Теперь /category живой.' } }
];
function useAgentRun(files, initDone) {
  const total = files.length;
  const [n, setN] = useState(initDone ? 99 : 0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (n >= total) { setRunning(false); return; }
    const t = setTimeout(() => setN(x => x + 1), 460);
    return () => clearTimeout(t);
  }, [running, n, total]);
  const start = () => { setN(0); setRunning(true); };
  return { n, running, done: total > 0 && n >= total, start };
}
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [pickId, setPickId] = useState(storedAnswer ? 'c3' : null);
  const [sc, setSc] = useState(0);
  const cmd = CMDS.find(c => c.id === pickId) || null;
  const gen = useAgentRun(cmd ? cmd.files : [], !!storedAnswer);
  const shown = !!cmd && gen.done;
  const wired = shown && cmd.wired;
  const done = pickId === 'c3' && gen.done;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, (pickId ? 1 : 0) + (gen.done ? 1 : 0));   // 13-band klapan
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: 'c3' }); }, [done]); // eslint-disable-line
  const send = (id) => { if (done) return; setPickId(id); setSc(n => n + 1); gen.start(); };
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot 1 · aniq buyruq", ru: 'Практика 1 · точная команда' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={_resc && !done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : ((done || _resc) ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "To'liq playbookni yuboring", ru: 'Отправьте полный плейбук' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Agent <span className="italic" style={{ color: T.accent }}>aynan</span> aytganingizni yozadi — ko'proq emas.</>, ru: <>Агент пишет <span className="italic" style={{ color: T.accent }}>ровно</span> то, что вы сказали — и не больше.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Birinchi resurs — <b style={{ color: T.ink }}>Category</b>. Uchta buyruq bor, uchalasi ham ishonarli ko'rinadi. Bittasini yuboring va <b style={{ color: T.ink }}>oqibatini</b> ko'ring: bo'lim <b style={{ color: T.ink }}>kirish taxtasiga</b> yozilmasa, mijoz eshikni topa olmaydi.</>, ru: <>Первый ресурс — <b style={{ color: T.ink }}>Category</b>. Есть три команды, и все три звучат убедительно. Отправьте одну и посмотрите на <b style={{ color: T.ink }}>последствия</b>: если отдел не вписан на <b style={{ color: T.ink }}>входную вывеску</b>, клиент не найдёт дверь.</> })}</Mentor>
        <Zoomable off={!cmd}>{/* F-0926-06: buyruq tanlanguncha ⛶ yo'q (159/3) */}
        <div className="split">
          <Col>
            {CMDS.map(c => (
              <button key={c.id} className={`vcard ${pickId === c.id ? 'on' : ''} ${pickId ? '' : 'tap-hint'}`} onClick={() => send(c.id)} disabled={done && c.id !== 'c3'} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4, boxShadow: pickId === c.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : undefined }}>
                <span className="vlbl" style={{ fontFamily: "'Manrope'" }}>{tr(c.label)}</span>
                <span className="agent-msg">{tr(c.text)}</span>
              </button>
            ))}
            {shown && <div className={wired ? 'frame-success fade-step' : 'frame-warn fade-step'}><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cmd.note)}</p></div>}
          </Col>
          <Col>
            {/* F-1015-399: o'ng ustun boshidanoq to'la — kutilmoqda-qatori + taxtaning haqiqiy boshlang'ich holati (CategoryModule yo'q, 404) */}
            <p className="flow-label">{tr({ uz: 'Agent yaratayotgan fayllar', ru: 'Файлы, которые создаёт агент' })}</p>
            {cmd
              ? <FileGen files={cmd.files} running={gen.running} n={gen.n} />
              : <div className="gen-file" style={{ opacity: 0.5 }}><span className="gen-ico">·</span><span className="mono" style={{ flex: 1 }}>{tr({ uz: 'buyruq kutilmoqda — chapdan bittasini yuboring', ru: 'жду команду — отправьте одну слева' })}</span></div>}
            <>
              <p className="flow-label" style={{ marginTop: 4 }}>{tr({ uz: 'Restoran kirish taxtasi — AppModule.imports', ru: 'Входная вывеска ресторана — AppModule.imports' }) /* F-0926-06: yorliq emojisi olindi (H3) */}</p>
              <div className="frame" style={{ padding: 13 }}>
                <div className="ent-row free">TypeOrmModule · AuthModule <span>{tr({ uz: 'bor', ru: 'есть' })}</span></div>
                {wired
                  ? <div className="ent-row free el-in">CategoryModule <span>{tr({ uz: 'yozildi', ru: 'вписан' })}</span></div>
                  : <div className="ent-row siz">CategoryModule <span>{tr({ uz: "yo'q", ru: 'нет' })}</span></div>}
                <div className={`ev-row ${wired ? 'is-fixed' : 'hot'}`} style={{ marginTop: 8, marginBottom: 0 }}>
                  <span className="ev-m">GET</span><span style={{ flex: 1 }}>/category</span>
                  <b style={{ color: wired ? T.success : T.danger }}>{wired ? '200 ✓' : '404'}</b>
                </div>
              </div>
              {shown && !wired && <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Bo'lim taxtada yo'q — mijoz uchun bu eshik <b>mavjud emas</b>. Boshqa buyruqni sinang.</>, ru: <>Отдела нет на вывеске — для клиента этой двери <b>не существует</b>. Попробуйте другую команду.</> })}</p></div>}
              {wired && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Category tirik! Farq "aniq/noaniq"da emas edi — <b>TO'LIQmi</b> shunda edi. Endi tekshiruvchi bo'lib ko'rib chiqamiz.</>, ru: <>Category живой! Дело было не в «чёткая/нечёткая» — а в том, <b>ПОЛНАЯ ли</b> команда. Теперь пройдёмся по ней как проверяющий.</> })}</p></div>}
            </>
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr({ uz: "💡 Buyruq agentga hamma qadamni aytyaptimi — yoki bir qismini taxminga qoldiryaptimi?", ru: '💡 Говорит ли команда агенту про все шаги — или часть оставляет на его догадку?' })}</p>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — AUTH apply: qaysi eshik ochiq/admin =====
const AUTH_ROWS = [
  { id: 'getbook', label: 'GET /book', correct: 'public', hint: { uz: "Kitoblarni hamma ko'rishi kerak — ochiq (public).", ru: 'Книги должны видеть все — открыто (public).' } },
  { id: 'featured', label: 'GET /book/featured', correct: 'public', hint: { uz: "Top kitoblar — vitrina, hamma ko'radi (public).", ru: 'Топ-книги — витрина, её видят все (public).' } },
  { id: 'order', label: 'POST /order', correct: 'public', hint: { uz: "Mijoz buyurtma beradi — ro'yxatdan o'tmasdan ham (public).", ru: 'Клиент делает заказ — даже без регистрации (public).' } },
  { id: 'postbook', label: 'POST /book', correct: 'admin', hint: { uz: "Kitob qo'shish — faqat admin.", ru: 'Добавлять книги — только админ.' } },
  { id: 'delbook', label: 'DELETE /book/:id', correct: 'admin', hint: { uz: "O'chirish — faqat admin.", ru: 'Удалять — только админ.' } },
  { id: 'getorder', label: 'GET /order', correct: 'admin', hint: { uz: "Buyurtmalarni ko'rish — faqat admin.", ru: 'Смотреть заказы — только админ.' } }
];
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [chosen, setChosen] = useState(storedAnswer ? Object.fromEntries(AUTH_ROWS.map(r => [r.id, r.correct])) : {});
  const [shakeId, setShakeId] = useState(null);
  const [hint, setHint] = useState(null);
  const [sc, setSc] = useState(0);
  const done = AUTH_ROWS.every(r => chosen[r.id] === r.correct);
  const { tip: _tip, rescue: _resc } = useStuckValve(done, Object.keys(chosen).length);   // 13-band klapan
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const set = (row, val) => {
    if (chosen[row.id] === row.correct) return;
    if (val === row.correct) { setChosen(c => ({ ...c, [row.id]: val })); setHint(null); setSc(n => n + 1); }
    else { setShakeId(row.id); setHint({ id: row.id, txt: row.hint }); setTimeout(() => setShakeId(x => (x === row.id ? null : x)), 450); }
  };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 3 · @Roles', ru: 'Практика 3 · @Roles' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={_resc && !done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : ((done || _resc) ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Har eshikni belgilang', ru: 'Отметьте каждую дверь' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi eshik <span className="italic" style={{ color: T.accent }}>ochiq</span>, qaysi biri faqat <span className="italic" style={{ color: T.accent }}>admin</span> uchun?</>, ru: <>Какая дверь <span className="italic" style={{ color: T.accent }}>открыта</span>, а какая — только для <span className="italic" style={{ color: T.accent }}>админа</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har endpoint uchun <span className="mono">@Roles</span> ni to'g'ri tanlang: 🌐 <b style={{ color: T.ink }}>public</b> (hamma) yoki 🔒 <b style={{ color: T.ink }}>admin</b>. O'ylang: bu amalni begona odam qila olsa, xavfli emasmi?</>, ru: <>Для каждого эндпоинта выберите верный <span className="mono">@Roles</span>: 🌐 <b style={{ color: T.ink }}>public</b> (все) или 🔒 <b style={{ color: T.ink }}>admin</b>. Подумайте: если это действие сможет сделать посторонний — не опасно ли?</> })}</Mentor>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {AUTH_ROWS.map(r => {
            const val = chosen[r.id];
            const locked = val === r.correct;
            return (
              <div key={r.id} className={`auth-row ${shakeId === r.id ? 'shake' : ''}`}>
                <span className="mono" style={{ flex: 1, fontSize: 13, color: T.ink }}>{r.label}</span>
                <button className={`auth-btn ${val === 'public' ? (r.correct === 'public' ? 'ok' : 'bad') : ''}`} disabled={locked} onClick={() => set(r, 'public')}>🌐 public</button>
                <button className={`auth-btn ${val === 'admin' ? (r.correct === 'admin' ? 'ok' : 'bad') : ''}`} disabled={locked} onClick={() => set(r, 'admin')}>🔒 admin</button>
              </div>
            );
          })}
        </div>
        {hint && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr(hint.txt)}</p></div>}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Mukammal! Ko'rish/buyurtma — ochiq, qo'shish/o'chirish/buyurtmalar ro'yxati — admin. <span className="mono">@Roles('public')</span> tokenni o'tkazib yuboradi, qolgani himoyalangan.</>, ru: <>✓ Отлично! Просмотр и заказ — открыты, добавление/удаление/список заказов — админ. <span className="mono">@Roles('public')</span> пропускает без токена, остальное защищено.</> })}</p></div>}
        {_tip && !done && <p className="bhint fade-step">{tr({ uz: "💡 Har eshik uchun o'ylang: bu ishni kim qila oladi — hamma, ro'yxatdan o'tgan mijoz, yoki faqat admin?", ru: '💡 Подумайте про каждую дверь: кто может это сделать — все, зарегистрированный клиент или только админ?' })}</p>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — 🚪 BEAT 3: ESHIK SINOVI (dalil avval, kod keyin — marker/tooltip YO'Q) =====
const DOOR_ROLES = [{ id: 'guest', ic: '🧍', t: { uz: 'Mijoz', ru: 'Клиент' } }, { id: 'admin', ic: '🔑', t: { uz: 'Admin', ru: 'Админ' } }];
const DOORS = [
  { id: 'getbook',   m: 'GET',  p: '/book',   guest: '200', admin: '200', want: 'open' },
  { id: 'postorder', m: 'POST', p: '/order',  guest: '403', admin: '201', want: 'open' },
  { id: 'getorder',  m: 'GET',  p: '/order',  guest: '403', admin: '200', want: 'admin' }
];
const BAD_LINE = 'l2';
const OC_LINES = [
  { id: 'l1', why: { uz: 'Bu qator faqat manzilni belgilaydi (/order). Uni olib tashlasak ham mijoz baribir 403 oladi — demak muammo bunda emas.', ru: 'Эта строка лишь задаёт адрес (/order). Уберём её — клиент всё равно получит 403, значит дело не в ней.' } },
  { id: 'l2', why: '' },
  { id: 'l3', why: { uz: "Bu qator buyurtmani qabul qiladi. U bo'lmasa 404 chiqardi, 403 emas — demak muammo bunda emas.", ru: 'Эта строка принимает заказ. Без неё было бы 404, а не 403 — значит дело не в ней.' } },
  { id: 'l4', why: { uz: "Bu qator buyurtmalar RO'YXATI uchun — uni admin ko'rishi to'g'ri. Uni o'zgartirsak ham mijoz POST'da baribir 403 oladi.", ru: 'Эта строка — для СПИСКА заказов, и его правильно видит админ. Поменяем её — клиент на POST всё равно получит 403.' } },
  { id: 'l5', why: { uz: "Bu — yopiluvchi qavs. Ruxsatga aloqasi yo'q.", ru: 'Это закрывающая скобка. К правам отношения не имеет.' } }
];
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [tried, setTried] = useState(() => storedAnswer ? new Set(DOORS.flatMap(d => ['guest:' + d.id, 'admin:' + d.id])) : new Set());
  const [found, setFound] = useState(!!storedAnswer);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const [why, setWhy] = useState(null);
  const [shakeId, setShakeId] = useState(null);
  const [sc, setSc] = useState(0);
  const evidence = DOORS.every(d => tried.has('guest:' + d.id));
  const done = fixed;
  const achMiss = useContext(AchMissCtx); // 🏅 151-qonun: dalildan keyin aybsiz qator — nishon birinchi urinishga
  const { tip: _tip, rescue: _resc } = useStuckValve(done, (found ? 1 : 0) + (fixed ? 1 : 0));   // 13-band klapan
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const knock = (roleId, d) => {
    const k = roleId + ':' + d.id;
    if (tried.has(k)) return;
    setTried(prev => { const s = new Set(prev); s.add(k); return s; });
    setSc(n => n + 1);
  };
  const tapLine = (ln) => {
    if (!evidence || found) return;
    if (ln.id === BAD_LINE) { setFound(true); setWhy(null); setSc(n => n + 1); return; }
    if (achMiss) achMiss.miss(screen);
    setShakeId(ln.id); setWhy(tr(ln.why)); setSc(n => n + 1);
    setTimeout(() => setShakeId(x => (x === ln.id ? null : x)), 450);
  };
  const fix = () => { setFixed(true); setSc(n => n + 1); };
  const cellVal = (roleId, d) => (roleId === 'guest' ? (fixed && d.id === 'postorder' ? '201' : d.guest) : d.admin);
  const cellBad = (roleId, d) => roleId === 'guest' && d.want === 'open' && cellVal(roleId, d) === '403';
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 4 · eshik sinovi', ru: 'Практика 4 · проверка дверей' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={_resc && !done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : ((done || _resc) ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (found ? tr({ uz: 'Endi tuzating', ru: 'Теперь исправьте' }) : (evidence ? tr({ uz: 'Xato qatorni toping', ru: 'Найдите строку с ошибкой' }) : tr({ uz: 'Eshiklarni sinang', ru: 'Испытайте двери' }))))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Do'kon ochildi — lekin <span className="italic" style={{ color: T.accent }}>bironta buyurtma kelmayapti</span>.</>, ru: <>Магазин открылся — но <span className="italic" style={{ color: T.accent }}>не пришло ни одного заказа</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Sabab aytilmaydi — <b style={{ color: T.ink }}>o'zingiz topasiz</b>. Avval mijoz bo'lib, keyin admin bo'lib eshiklarni taqillatib ko'ring: qaysi eshik kimga ochilyapti? Dalil yig'ilgach, kodni ochamiz.</>, ru: <>Причину вам не скажут — <b style={{ color: T.ink }}>вы найдёте её сами</b>. Постучитесь в двери сначала как клиент, потом как админ: какая дверь кому открывается? Соберёте улики — откроем код.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Eshik sinovi — ikki rolda taqillatib ko'ring", ru: 'Испытание дверей — постучитесь в двух ролях' })}</p>
            <div className="dr-tbl fade-up delay-1">
              <div className="dr-head">
                <span className="dr-ep">{tr({ uz: 'Eshik', ru: 'Дверь' })}</span>
                {DOOR_ROLES.map(r => <span key={r.id} className="dr-hc">{r.ic} {tr(r.t)}</span>)}
              </div>
              {DOORS.map(d => (
                <div key={d.id} className="dr-row">
                  <span className="dr-ep">{d.m} {d.p}</span>
                  {DOOR_ROLES.map(r => {
                    const k = r.id + ':' + d.id;
                    const on = tried.has(k);
                    const bad = on && cellBad(r.id, d);
                    const rej = on && /^4/.test(String(cellVal(r.id, d))); // 401/403 — qo'riqchi ORQAGA ITARADI (harakat bilan ko'rinadi)
                    return (
                      <button key={r.id} className={`dr-cell ${on ? (bad ? 'bad' : 'ok') : ''} ${rej ? 'rej' : ''} ${on ? '' : 'tap-hint'}`} disabled={on} onClick={() => knock(r.id, d)}>
                        {on ? <>{r.ic} {cellVal(r.id, d)}{bad ? ' ❗' : ''}</> : <>{r.ic} {tr({ uz: 'sinash', ru: 'пробовать' })}</>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            {evidence && !found && <div className="frame-wait fade-step"><p className="note-h" style={{ color: T.blue }}>{tr({ uz: "Dalil yig'ildi", ru: 'Улики собраны' }) /* F-0926-06: sarlavha emojisi olindi (H3) */}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Dalil: mijoz <span className="mono">POST /order</span> da <b>403</b> olyapti — bu eshik ochiq bo'lishi kerak edi. Admin esa 201 oladi. Demak muammo — <b>ruxsatda</b>. Endi kodni oching →</>, ru: <>Улика: клиент получает <b>403</b> на <span className="mono">POST /order</span> — а эта дверь должна быть открытой. Админ же получает 201. Значит, дело — <b>в правах</b>. Теперь откройте код →</> })}</p></div>}
          </Col>
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: 'OrderController tayyor!', ru: 'OrderController готов!' })}</span></div>
              <div className={`ai-code ${evidence ? '' : 'locked'}`}>{/* F-1015-400: dalil yig'ilguncha qatorlar blur-qulf ostida — javob oldindan o'qilmasin */}
                <div className="ai-code-h"><span className="bb-dots"><i /><i /><i /></span><span className="ai-code-t">order.controller.ts</span></div>
                <div className={`ai-line ${shakeId === 'l1' ? 'shake' : ''}`} onClick={() => tapLine(OC_LINES[0])}><span style={{ color: CODE.attr }}>@Controller</span>{"('order') {"}</div>
                <div className={`ai-line ${found ? (fixed ? 'ok' : 'bad') : ''} ${shakeId === 'l2' ? 'shake' : ''}`} onClick={() => tapLine(OC_LINES[1])}><span style={{ color: CODE.attr }}>@Roles</span>{fixed ? "('public')" : '(UserRole.ADMIN)'}</div>
                <div className={`ai-line ${shakeId === 'l3' ? 'shake' : ''}`} onClick={() => tapLine(OC_LINES[2])}><span style={{ color: CODE.attr }}>@Post</span>{'()  create(@Body() dto) { ... }'}</div>
                <div className={`ai-line ${shakeId === 'l4' ? 'shake' : ''}`} onClick={() => tapLine(OC_LINES[3])}><span style={{ color: CODE.attr }}>@Roles</span>{'(UserRole.ADMIN)  '}<span style={{ color: CODE.attr }}>@Get</span>{'()  findAll()'}</div>
                <div className={`ai-line ${shakeId === 'l5' ? 'shake' : ''}`} onClick={() => tapLine(OC_LINES[4])}>{'}'}</div>
              </div>
              {!evidence && <p className="ai-prompt">{tr({ uz: "Avval dalil yig'ing — uch eshikni mijoz sifatida sinang ←", ru: 'Сначала соберите улики — попробуйте три двери как клиент ←' })}</p>}
              {evidence && !found && <p className="ai-prompt">{tr({ uz: "Qaysi qator mijozni to'sib qo'ygan? Bosing.", ru: 'Какая строка не пускает клиента? Нажмите на неё.' })}</p>}
              {!done && <AchRule screen={screen} />}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={fix}>{tr({ uz: "POST'ni @Roles('public') ga o'zgartirish", ru: "Поменять POST на @Roles('public')" })}</button>}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: 'normal', fontWeight: 600 }}>{tr({ uz: '✓ Tuzatildi — buyurtma endi ochiq!', ru: '✓ Исправлено — заказы снова открыты!' })}</p>}
            </div>
            {why && !found && <div className="hint fade-step"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr(why)}</p></div>}
            {found && !fixed && <div className="frame-success fade-step"><p className="note-h" style={{ color: T.success }}>{tr({ uz: '✓ Topdingiz!', ru: '✓ Нашли!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>Qo'riqchiga noto'g'ri ro'yxat berilgan</b> — u sizning MIJOZINGIZNI do'koningizga kiritmayapti. To'g'risi: <span className="mono">@Roles('public')</span>. Chap tugma bilan tuzating →</>, ru: <><b>Стражу дали не тот список</b> — он не пускает ВАШЕГО КЛИЕНТА в ваш же магазин. Правильно: <span className="mono">@Roles('public')</span>. Исправьте кнопкой слева →</> })}</p></div>}
            {fixed && <div className="takeaway fade-step"><div className="ta-bulb">🔍</div><p className="ta-h">{tr({ uz: 'Dalil bilan topdingiz!', ru: 'Нашли по уликам!' })}</p><p className="ta-sub">{tr({ uz: 'Mijoz endi buyurtma bera oladi — 201', ru: 'Клиент снова может оформить заказ — 201' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr({ uz: "💡 Kod qatorlarini birma-bir oching: qaysi biri bu resursga tegishli emas?", ru: '💡 Открывайте строки кода по одной: какая из них не относится к этому ресурсу?' })}</p>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — TEST 4 (debug) =====
const Screen15 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" tip={{ uz: "💡 Savol qo'riqchini olib tashlash haqida emas — kimga ruxsat berilishi kerakligini o'ylang.", ru: '💡 Вопрос не о том, чтобы убрать стража — подумайте, кому должен быть доступ.' }} eyebrow={tr({ uz: 'Test', ru: 'Тест' })}
    questionText="POST /order'ga xato bilan @Roles(ADMIN) qo'yilgan. To'g'ri tuzatish qaysi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Mijoz buyurtma berolsin desak, qatorni <span className="italic" style={{ color: T.accent }}>qanday</span> tuzatamiz?</>, ru: <>Чтобы клиент мог заказать — <span className="italic" style={{ color: T.accent }}>как</span> исправить строку?</> })}</h2></>}
    options={[{ uz: "Qo'riqchini (`@UseGuards()`) butunlay olib tashlaymiz", ru: 'Полностью убрать стража (`@UseGuards()`)' }, { uz: "`@Roles('public')` ga o'zgartiramiz", ru: "Поменять на `@Roles('public')`" }, { uz: "Har bir mijozga `@Roles(ADMIN)` beramiz", ru: 'Дать каждому клиенту `@Roles(ADMIN)`' }, { uz: "Tugmani frontend'da yashiramiz", ru: 'Спрятать кнопку на фронтенде' }]} correctIdx={1}
    explainCorrect={{ uz: "`POST /order` hammaga ochiq, qolgan eshiklar admin'da qoladi.", ru: "`POST /order` открыт всем, остальные двери остаются админскими." }}
    explainWrong={{
      0: { uz: "Qo'riqchi ketsa, admin eshiklari ham ochilib qoladi.", ru: 'Уберёте стража — распахнутся и админские двери.' },
      2: { uz: "Har mijoz admin bo'lsa, u kitob ham qo'sha oladi — xavfli.", ru: 'Если каждый клиент — админ, он сможет и книги добавлять.' },
      3: { uz: 'Tugmani yashirish himoya emas — server baribir 403 beradi.', ru: 'Спрятать кнопку — не защита: сервер всё равно вернёт 403.' },
      default: { uz: "`POST /order` kimlar uchun ochiq bo'lishi kerak — o'ylang.", ru: "Подумайте: для кого должен быть открыт `POST /order`?" }
    }} />
);


// ===== 🏅 ACHIEVEMENTS (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  shelf:   { icon: '📚', name: 'Shelf Master!', desc: { uz: "3 resursni Copilot agenti bilan qurib tekshirdingiz", ru: 'Вы построили и проверили 3 ресурса с агентом Copilot' } },
  guard:   { icon: '🛡️', name: 'Guard Up!',    desc: { uz: "Qaysi eshik ochiq, qaysi biri qulf — aniq bilasiz.", ru: 'Вы точно знаете, какая дверь открыта, а какая под замком.' } },
  catcher: { icon: '🔍', name: 'Nice Catch!',   desc: { uz: "AI qo'yib yuborgan xatoni dalil bilan topdingiz.", ru: 'Вы нашли ошибку ИИ по уликам.' } },
  owner:   { icon: '🏪', name: 'Shop Owner!',   desc: { uz: "Ochiq qolishi kerak eshikni birinchi urinishda topdingiz — KitobShop ochildi!", ru: 'Вы с первой попытки нашли дверь, которая должна быть открыта, — KitobShop открылся!' } },
};
// Ekran id -> nishon. FAQAT ma'noli ekran: s8 = scored test · s10 = PickLines · s14 = debug (Beat 3) · s19 = audit (Beat 4).
// ❌ «Bajardim» tugmasiga va passiv «bosdim=to'g'ri» gate'larga BOG'LANMAYDI.
const ACH_TRIGGERS = { s14: 'catcher', s15: 'owner' };
// F-1015-353: blok nishonlari «Davom etish»da (bonus; ustoz ko'rib turadi)
const BLOK_ACH = { a2: 'shelf', s7: 'guard' };

// 🏅 151-qonun: amaliy topshiriq nishoni faqat BIRINCHI urinishga beriladi. Shart OLDINDAN aytiladi; birinchi urinish
// xato bo'lsa — jazosiz qisqa xabar (`once` — qayta urinishi yo'q ekran). Mentor ekranida, «Qaytadan» mashq-o'tishida va
// nishon olingach ko'rinmaydi. Matn — MATN_KORPUS §183 (hamma darsda aynan bir xil).
const AchRule = ({ screen, once }) => {
  const earned = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || (gate.live && gate.live.mode === 'mentor') || (earned && earned.has(ach))) return null;
  const lost = am.missed.has(sid);
  return <p className={`ach-rule ${lost ? 'lost' : ''}`}>{lost
    ? (once ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок давался за первую попытку.' }) : tr({ uz: "Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.", ru: 'Значок давался за первую попытку — теперь спокойно найдите верный ответ.' }))
    : tr({ uz: "🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: '🏅 Справитесь с первой попытки — значок ваш.' })}</p>;
};

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr({ uz: `Yangi nishon: ${ach.name}`, ru: `Новый значок: ${ach.name}` })}>
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
      <Confetti />
    </div>
  );
}

function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}

const Confetti = () => {
  const COLORS = [T.accent, T.success, T.blue, '#FFD380', '#FF7755', '#7DD181'];
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

// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 5, 8, 12, 15)
const Q_LABELS = { 6: { uz: '1 — Debug (public)', ru: '1 — Дебаг (public)' } }; // F-1015-353: yagona ballik — s15
// ⚡ Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi). SCORED_IDX ekranlari correctIdx'laridan 1:1.
// s5=2 · s8=0 · s12=3 · s15=1 — to'g'ri javob pozitsiyalari aralash (birinchi variantni bosib ball olib bo'lmaydi).
// practice: -1 — sentinel: «Bajardim» signali (500+ zonasi) hech qachon xato deb yozilmasin.
const INLINE_KEYS = { s15: 1 }; // F-1015-353: s5, s8, s12 olindi

// ===== ⚡ CODE STRIKE — CTA kapsulasi + ARENA =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C'];
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
const QZ_BG_SHAPES = [
  { ch: '@ManyToOne',  l: 5,  t: 10, s: 24, c: 'rgba(120,235,175,0.16)', d: 19, dl: 0 },
  { ch: '@Roles',      l: 84, t: 7,  s: 30, c: 'rgba(80,200,255,0.14)',  d: 23, dl: 1.5 },
  { ch: '@UseGuards',  l: 8,  t: 72, s: 24, c: 'rgba(232,161,58,0.15)',  d: 27, dl: 0.8 },
  { ch: 'findAll',     l: 80, t: 68, s: 30, c: 'rgba(255,110,70,0.14)',  d: 21, dl: 2.2 },
  { ch: 'where',       l: 44, t: 86, s: 28, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: '201',         l: 62, t: 26, s: 32, c: 'rgba(80,200,255,0.13)',  d: 17, dl: 0.4 },
  { ch: '403',         l: 26, t: 34, s: 32, c: 'rgba(255,110,70,0.14)',  d: 20, dl: 1.9 },
  { ch: 'DTO',         l: 55, t: 5,  s: 30, c: 'rgba(203,173,255,0.12)', d: 22, dl: 0.6 },
  { ch: 'BaseService', l: 89, t: 42, s: 20, c: 'rgba(232,161,58,0.13)',  d: 24, dl: 1.3 },
  { ch: 'Entity',      l: 2,  t: 45, s: 26, c: 'rgba(80,200,255,0.10)',  d: 26, dl: 2.6 },
  { ch: 'Module',      l: 36, t: 58, s: 24, c: 'rgba(255,110,70,0.11)',  d: 28, dl: 0.9 },
  { ch: '404',         l: 70, t: 90, s: 28, c: 'rgba(203,173,255,0.12)', d: 18, dl: 2.0 },
];
// JONLI: mustahkamlash-jang savollari — KitobShop qamrovi. To'g'ri javoblar 4 pozitsiyaga TENG (3/3/3/3), ARALASH tartibda.
// ⚡ Jonli roli: `correct` qiymatlarini tekshiradi/tasdiqlaydi.
const QUIZ_BANK = [
  { q: { uz: "Yangi resurs uchun nechta fayl kerak?", ru: "Сколько файлов нужно для нового ресурса?" }, opts: [{ uz: "2 — entity va controller", ru: "2 — entity и controller" }, { uz: "3 — entity, service, module", ru: "3 — entity, service, module" }, { uz: "5 — har qatlamga bittadan", ru: "5 — по одному на слой" }, { uz: "1 — hammasi bitta faylda", ru: "1 — всё в одном файле" }], correct: 2 },
  { q: { uz: "Bo'lim AppModule'ga ulanmasa nima bo'ladi?", ru: "Что будет, если раздел не подключить к AppModule?" }, opts: [{ uz: "Eshik topilmaydi — 404", ru: "Дверь не найдена — 404" }, { uz: "Server ishga tushmaydi", ru: "Сервер не запустится" }, { uz: "Ma'lumot saqlanmaydi", ru: "Данные не сохранятся" }, { uz: "Swagger'da 500 chiqadi", ru: "В Swagger будет 500" }], correct: 0 },
  { q: { uz: "Kitobni kategoriyaga qaysi dekorator bog'laydi?", ru: "Какой декоратор связывает книгу с категорией?" }, opts: [{ uz: "`@Column()`", ru: "`@Column()`" }, { uz: "`@UseGuards()`", ru: "`@UseGuards()`" }, { uz: "`@Roles()`", ru: "`@Roles()`" }, { uz: "`@ManyToOne()`", ru: "`@ManyToOne()`" }], correct: 3 },
  { q: { uz: '`@ManyToOne` qaysi faylga yoziladi?', ru: 'В какой файл пишется `@ManyToOne`?' }, opts: ["`category.entity.ts`", "`book.entity.ts`", "`book.controller.ts`", "`app.module.ts`"], correct: 1 },
  { q: { uz: "Tokensiz mijoz `POST /book` qilsa?", ru: "Клиент без токена делает `POST /book` — что будет?" }, opts: [{ uz: "401/403 — qo'riqchi rad etadi", ru: "401/403 — страж отказывает" }, { uz: "201 — kitob baribir qo'shiladi", ru: "201 — книга всё равно добавится" }, { uz: "404 — eshik topilmadi", ru: "404 — дверь не найдена" }, { uz: "200 — bo'sh ro'yxat", ru: "200 — пустой список" }], correct: 0 },
  { q: { uz: "Eshikka qo'riqchi qo'yadigan dekorator qaysi?", ru: 'Какой декоратор ставит стража у двери?' }, opts: ["`@Injectable()`", "`@Entity()`", "`@UseGuards()`", "`@Controller()`"], correct: 2 },
  { q: { uz: "`GET /book` hamma uchun ochiq bo'lsin desak?", ru: "Как сделать `GET /book` открытым для всех?" }, opts: [{ uz: "`@Roles(UserRole.ADMIN)`", ru: "`@Roles(UserRole.ADMIN)`" }, { uz: "`@Roles('public')`", ru: "`@Roles('public')`" }, { uz: "Qo'riqchini o'chiramiz", ru: "Уберём стража" }, { uz: "Frontend'da yashiramiz", ru: "Спрячем во фронтенде" }], correct: 1 },
  { q: { uz: "Agent yozgan kodni qachon «Keep» qilasiz?", ru: "Когда вы нажимаете «Keep» для кода агента?" }, opts: [{ uz: "Darhol, o'qimasdan", ru: "Сразу, не читая" }, { uz: "Agent tugatishi bilan", ru: "Как только агент закончит" }, { uz: "Server yoqilmasdan oldin", ru: "До запуска сервера" }, { uz: "Tekshiruvdan o'tganda", ru: "Когда прошёл проверку" }], correct: 3 },
  { q: { uz: '`BaseService` ni meros olgan service nimani tekin oladi?', ru: 'Что бесплатно получает service, унаследовавший `BaseService`?' }, opts: [{ uz: "Eshik qo'riqchisini (guard)", ru: 'Стража двери (guard)' }, { uz: 'Swagger hujjatini', ru: 'Документацию Swagger' }, { uz: 'Bazaga ulanishni', ru: 'Подключение к базе' }, { uz: 'Tayyor CRUD metodlarini', ru: 'Готовые CRUD-методы' }], correct: 3 },
  { q: { uz: "Muvaffaqiyatli POST qaysi kodni qaytaradi?", ru: "Какой код возвращает успешный POST?" }, opts: ["200 OK", "201 Created", "204 No Content", "301 Moved"], correct: 1 },
  { q: { uz: "DTO nima uchun kerak?", ru: "Зачем нужен DTO?" }, opts: [{ uz: "Kelgan so'rovni tekshirish", ru: "Проверять входящий запрос" }, { uz: "Jadval ustunlarini belgilash", ru: "Задавать столбцы таблицы" }, { uz: "Bo'limni AppModule'ga ulash", ru: "Подключать раздел к AppModule" }, { uz: "Bazaga ulanishni sozlash", ru: "Настраивать подключение к базе" }], correct: 0 },
  { q: { uz: "Mijoz `POST /order` da 403 oldi. Sabab?", ru: "Клиент получил 403 на `POST /order`. Причина?" }, opts: ["`@Controller('order')`", "`@Post()`", "`@Roles(UserRole.ADMIN)`", "`@Get()`"], correct: 2 },
];

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
          <span key={i} className={`cs-tok ${i % 2 ? 'back' : 'front'}`} style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: `clamp(9px, ${Math.round(s.s * 0.4)}px, ${Math.round(s.s * 0.6)}px)`, '--d': `${s.d}s`, animationDelay: `-${s.dl * 3}s` }}>{s.ch}</span>
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
          <span className="cs-hud-i">{tr({ uz: '🏆 PODIUM', ru: '🏆 ПОДИУМ' })}</span>
        </div>
      )}
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>
  );
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

// Jonli fon: suzuvchi uchqunlar + «web» chiziqlari + DARS MAVZUSIDAGI kod tokenlari (canvas)
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['@ManyToOne', '@Roles', '@UseGuards', 'findAll', 'where', 'DTO', 'BaseService', '201', '403'];
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

// ===== ⚡ CODE STRIKE ARENA — mustahkamlash-jang (mentor/student/solo). Kahoot uslubi: savol→taymer→reveal→podium. =====
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

  // Taymer — 100ms aniqlikda; vaqt tugasa javob ochiladi.
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚡ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nПотом можно вернуться ровно к этому месту через «⚡ Продолжить».\n\nВсё равно закрыть?' }))) return;
    }
    onClose();
  };

  return (
    <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => (
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>
        ))}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>

      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест сами:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Серия верных ответов подряд даёт 🔥 бонус!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>{tr({ uz: '▶ Testni boshlash', ru: '▶ Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Подождите, пока ментор начнёт тест…' })}</p>}
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Побыстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
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
          {/* 141-qonun (F-0820-338): yakun-marosimi BITTA — konfetti podiumda qoladi.
              Bu yerda tasdiq: o'quvchi yakunni ko'radi, bayram takrorlanmaydi. */}
          <h2 className="qz-h">{tr({ uz: 'Test yakunlandi', ru: 'Тест завершён' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верных' })}{soloScore.maxStreak >= 2 ? tr({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучшая серия 🔥x${soloScore.maxStreak}` }) : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>{tr({ uz: '↻ Qayta ishlash', ru: '↻ Пройти ещё раз' })}</button>
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
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: <>Siz — <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</>, ru: <>Вы — <b>{myRank + 1}-е место</b> · {board[myRank].pts} баллов</> })}</p>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест ещё раз — тренировка (в таблицу не пишется)' })}</button>}
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
        // DARS javoblari (<100): livePlayers + liveAnswers(pin) [screen_idx<100] — podium reyting
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
            <div className="frame-wait" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-wait fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не присоединился.' })}</p></div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верных)</> })}</p>}
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

// ===== SCREEN 20 — YAKUN (4.2: ScoreRing + ⚡ CodeStrike CTA + RECAP/uyga vazifa + 🏅 kolleksiya) =====
const Screen20 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  // F-0803-08: uyga vazifa kapsulasi — bosilganda topshiriq kartasi ochiladi
  const [hwOpen, setHwOpen] = useState(false);
  const [hwCharge, setHwCharge] = useState(false);
  const fireHw = () => { if (hwCharge || hwOpen) return; setHwCharge(true); setTimeout(() => { setHwOpen(true); setHwCharge(false); }, 500); };
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
    if (isMentorL && quizSt === 'off') { try { await _live.quizControl('lobby', -1); } catch (e) { console.warn('[arena]', e); liveToast({ uz: "Jonli arena ochilmadi: server javob bermadi. Mashq rejimida ochildi — o'quvchilar ekranida ko'rinmaydi.", ru: 'Живая арена не открылась: сервер не ответил. Открыта в режиме тренировки — на экранах учеников не видна.' }); setArenaSolo(true); setArena(true); return; } }
    setArenaSolo(studentSolo); setArena(true);
  };
  const RECAP = [
    { uz: "3 bog'langan resursli real backend qurdingiz (Category · Book · Order)", ru: 'Вы построили настоящий бэкенд с 3 связанными ресурсами (Category · Book · Order)' },
    { uz: "Bosh dasturchi sikli: Rejalashtirish → Yo'naltirish → Tekshirish", ru: 'Цикл главного разработчика: Планирование → Направление → Проверка' },
    { uz: "Eshik va qo'riqchi: @UseGuards + @Roles — 🌐 public (mijoz) vs 🔒 admin", ru: 'Дверь и страж: @UseGuards + @Roles — 🌐 public (клиент) vs 🔒 admin' },
    { uz: "Yorliq: @ManyToOne — ko'p kitob → bitta yorliq (yorliq kitobda saqlanadi)", ru: 'Ярлык: @ManyToOne — много книг → один ярлык (ярлык хранится на книге)' },
    { uz: "Kirish taxtasi: AppModule'ga ulanmagan bo'lim = 404", ru: 'Входная вывеска: отдел, не подключённый к AppModule, = 404' },
    { uz: "AI yo'l qo'ygan xatoni dalil bilan topdingiz (403 — mijozga yopiq qolgan eshik)", ru: 'Ошибку ИИ вы нашли по уликам (403 — дверь, закрытая для клиента)' } // F-1015-401: bitta xato (Screen19 audit kesilgan)
  ];
  const HOMEWORK = [
    { b: { uz: "O'z marketplace'ingiz", ru: 'Свой маркетплейс' }, t: { uz: "— elektronika/kiyim do'koni: 3 resursni rejaga soling", ru: '— магазин электроники/одежды: распланируйте 3 ресурса' } },
    { b: 'Playbook', t: { uz: "— har resurs uchun Copilot agentiga beradigan aniq playbook yozing (5 qadam + AppModule'ga ulash)", ru: '— напишите чёткий промпт для ИИ на каждый ресурс (5 шагов + подключение к AppModule)' } },
    { b: { uz: 'Tekshiruv', ru: 'Проверка' }, t: { uz: '— har eshikni ikki rolda sinang: mijoz va admin', ru: '— испытайте каждую дверь в двух ролях: клиент и админ' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><FinishBtn className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</FinishBtn></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><div className="hero-chips"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Real backend qurdingiz', ru: 'Вы построили настоящий бэкенд' })}</span><span className="score-chip fade-up">{correct}/{total} {tr({ uz: "to'g'ri", ru: 'верно' })}</span></div><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi siz <span className="italic" style={{ color: T.accent }}>backend dasturchisi</span>siz.</>, ru: <>Теперь вы — <span className="italic" style={{ color: T.accent }}>бэкенд-разработчик</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={(isMentorL && arenaSolo) ? { mode: 'self' } : (_live || { mode: 'self' })} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${hwCharge ? 'charging' : ''}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{tr(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
            <span className="hw-big-s">{tr({ uz: 'Amaliy topshiriqni bajarish →', ru: 'Выполнить практическое задание →' })}</span>
          </button>
        </div>
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "🚀 Siz endi istalgan g'oyani backendga aylantira olasiz — agentni boshqarib, har eshikni tekshirib!", ru: '🚀 Теперь вы можете превратить любую идею в бэкенд — управляя агентом и проверяя каждую дверь!' })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏅 Nishonlaringiz', ru: '🏅 Ваши значки' })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
              <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={tr(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : '🔒'}</span>
                <span className="ach-badge-name">{a.name}</span>
                {got && <span className="ach-badge-desc">{tr(a.desc)}</span>}
              </div>
            ); })}
          </div>
        </div>}
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT
export default function NestArchPracticeLesson({ lang: langProp, onFinished, liveToken }) {
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
  const [maxReached, setMaxReached] = useState(() => (saved ? Math.max(saved.maxReached || 0, saved.screen || 0) : 0)); // F-1012-03
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
    if (!ach || missedRef.current.has(sid) || earnedRef.current.has(ach)) return;
    missedRef.current.add(sid);
    setMissed(new Set(missedRef.current));
  }, []);
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);
  // ETALON — 1920px: keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // 🃏 Flashcard ekrani jonli darsda (mentor boshqaruvida) o'quvchida ko'rsatilmaydi — o'tkazib yuboriladi
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => {
    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-353: blok «Davom etish»da nishon
    if (blokAch && live.mode !== 'mentor') earn(blokAch);
    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  };
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
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat REAL solve)
  };
  // Javob kaliti: inline testlar + praktika sentineli + jang savollari (QUIZ_BANK'dan) — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken }); // liveToken — LMS'dan (avval null, keyin keladi)
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS }); // server-progress: davom / ko'rish / toza boshlash
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  // F-1012-03: eng uzoq yetilgan ekran (qayta boshlashda 0) — undan oldingi ekranlarda «Davom etish» qulflanmaydi
  useEffect(() => { setMaxReached(m => (screen === 0 && !Object.keys(answers || {}).length) ? 0 : Math.max(m, screen)); }, [screen, answers]);
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  const reset = () => { if (!firstPassRef.current) { firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000) }; setFpPractice(true); } progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + nishonlar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, maxReached, answers, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
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
      nickname: live.nickname || null, livePin: live.pin || null, liveMode: live.mode, // F-1012-05: jonli/mustaqil belgisi (1–2-Modul naqshi)
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

  const screens = [Screen0, Screen1, Screen3, ScreenAgent, Screen7, Screen14, Screen15, ScreenPodium, Screen20];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }
        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }
        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        .btn { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.accent}; color: #fff; border: none; border-radius: 12px; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: #E03E1B; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 14px; font-size: 12.5px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.6; cursor: not-allowed; }
        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: default; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); }
        .tagpill { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); }

        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope'; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .vcard { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover:not(:disabled) { transform: translateY(-1px); }
        .vcard:disabled { cursor: default; }
        .vlbl { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }
        .role-ico { font-size: 20px; flex-shrink: 0; } .role-r { font-size: 11.5px; color: ${T.ink2}; font-weight: 600; }

        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band) */
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }

        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope'; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .hook-option:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope'; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; } .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(255,79,40,0.55); }

        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(15px,2.5vw,22px); box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        /* 11.6 RANG SEMANTIKASI — bir ma'no, bir rang:
           frame-warn/frame-soft = XATO-OGOHLANTIRISH (qizil) · frame-success = xulosa/muvaffaqiyat (yashil) · frame-wait = neytral DALIL/yo'riq (ko'k) */
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.dangerSoft}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(194,54,43,0.24); }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .head-c { text-align: center; align-items: center; } /* F-1003-04: natija ekrani — bitta o'q */
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        @media (min-width: 761px) { .split:has(> .col > .flow-label:first-child) > .col:not(:has(> .flow-label:first-child))::before { content: "."; visibility: hidden; font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; } } /* F-1015-371: ikki ustun bloklari bir chiziqdan boshlanadi */

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; color: ${T.accent}; flex-shrink: 0; min-width: 38px; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 600; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .note-h { font-weight: 700; font-size: 13.5px; margin: 0 0 5px; display: flex; align-items: center; }
        .hint { background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11.5px,1.5vw,13px); line-height: 1.55; padding: clamp(12px,2.2vw,15px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        /* VS CODE EDITOR — oyna-chrome (yassi karta emas) */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .editor { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .editor-bar { background: #2D2D2D; padding: 7px 11px; display: flex; align-items: center; gap: 9px; }
        .editor-tab { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: #C9D1D9; background: #1E1E1E; padding: 4px 11px; border-radius: 6px 6px 0 0; word-break: break-all; }
        .editor-body { background: ${CODE.bg}; padding: 12px 14px; }
        .editor-code { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.75; color: ${CODE.text}; white-space: pre-wrap; word-break: break-word; margin: 0; }
        .line-empty { color: ${CODE.comment}; font-style: italic; }

        /* PICK LINES */
        .pick-row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 10px; padding: 10px 12px; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: ${T.ink}; }
        .pick-row:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.22); }
        .pick-row.picked { background: ${T.successSoft}; color: ${T.success}; cursor: default; } /* F-0926-06: tanlangan — yumshoq fon, yashil ramka olindi (G3) */
        .pick-row:disabled { cursor: default; }
        .zoomable > .split > .col:last-child > div:first-child > .pick-row:first-child { padding-right: 44px; } /* F-0926-06: yorliq olingach ⛶ birinchi qatordagi belgini yopmasin */
        .pick-plus { margin-left: auto; font-weight: 700; color: ${T.ink3}; } .pick-row.picked .pick-plus { color: ${T.success}; }

        /* AGENT CARD */
        .agent-card { background: ${T.blueSoft}; border-radius: 10px; padding: 11px 14px; }
        .zoomable > .split > .col:last-child > .agent-card:first-child { padding-right: 44px; } /* F-0926-06: ⛶ o'ng ustun kartasidagi matnni yopmasin (s4) */
        .agent-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.blue}; display: block; margin-bottom: 4px; }
        .agent-msg { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; color: ${T.ink}; margin: 0; line-height: 1.55; }
        .prompt-box { background: ${T.blueSoft}; border-radius: 10px; padding: 12px 15px; }

        /* AGENT FILE GENERATION */
        .gen-file { display: flex; align-items: center; gap: 9px; background: ${T.paper}; border-radius: 9px; padding: 9px 12px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); font-size: 12px; transition: all 0.2s; }
        .gen-file.ready { box-shadow: inset 0 0 0 1.5px ${T.success}33, 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .gen-ico { font-weight: 800; min-width: 16px; text-align: center; }
        .gen-file .mono { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: ${T.ink}; }
        .gen-d { font-size: 10px; color: ${T.ink2}; font-weight: 600; margin-left: auto; text-align: right; }

        /* AI DEBUG CARD */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); display: flex; flex-direction: column; gap: 11px; }
        .ai-row { display: flex; gap: 8px; align-items: flex-start; }
        .ai-badge { background: ${T.nest}; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 10px; padding: 4px 8px; border-radius: 6px; flex-shrink: 0; }
        .ai-bubble { background: ${T.bg}; border-radius: 4px 12px 12px 12px; padding: 9px 12px; font-size: 13px; color: ${T.ink}; }
        .ai-code { background: ${CODE.bg}; border-radius: 10px; padding: 10px 11px; display: flex; flex-direction: column; gap: 2px; transition: opacity 0.3s ease; }
        .ai-code.locked .ai-line { filter: blur(5px); opacity: 0.55; user-select: none; pointer-events: none; cursor: default; } /* F-1015-400: blur-qulf, fayl nomi ochiq qoladi */
        .ai-line { transition: filter 0.4s ease, opacity 0.4s ease; }
        .ai-code-h { display: flex; align-items: center; gap: 9px; margin: -10px -11px 8px; padding: 7px 11px; background: rgba(255,255,255,0.06); border-radius: 10px 10px 0 0; }
        .ai-code-t { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 10.5px; font-weight: 700; color: ${CODE.punct}; }
        .ai-line { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: ${CODE.text}; padding: 5px 7px; border-radius: 6px; cursor: pointer; transition: all 0.16s; }
        .ai-line:hover { background: rgba(255,255,255,0.07); }
        .ai-line.bad { background: rgba(194,54,43,0.26); box-shadow: inset 0 0 0 1.5px ${T.danger}; }
        .ai-line.ok { opacity: 0.4; text-decoration: line-through; cursor: default; }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; font-style: italic; margin: 0; }
        .takeaway { background: ${T.successSoft}; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; align-items: center; gap: 3px; text-align: center; }
        .ta-bulb { font-size: 26px; } .ta-h { font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: ${T.ink}; margin: 0; } .ta-sub { font-size: 12px; color: ${T.ink2}; margin: 0; }


        /* AUTH ROW (s7) */
        .auth-row { display: flex; align-items: center; gap: 8px; background: ${T.paper}; border-radius: 10px; padding: 9px 12px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .auth-btn { font-family: 'Manrope'; font-weight: 700; font-size: 12px; padding: 7px 12px; border-radius: 8px; border: none; background: ${T.bg}; color: ${T.ink2}; cursor: pointer; transition: all 0.16s; }
        .auth-btn:hover:not(:disabled) { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.25); }
        .auth-btn:disabled { cursor: default; }
        .auth-btn.ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .auth-btn.bad { background: ${T.accentSoft}; color: ${T.danger}; }

        /* SWAGGER */
        .swg { border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.18); }
        .swg-top { background: #173647; color: #fff; padding: 10px 13px; font-family: 'Manrope'; font-weight: 800; font-size: 13px; display: flex; align-items: center; gap: 8px; } .swg-dot { width: 8px; height: 8px; border-radius: 50%; background: #49cc90; } .swg-ver { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 400; font-size: 11px; color: #9FB4D8; margin-left: auto; }
        .swg-row { border-bottom: 1px solid #eee; }
        .swg-head { width: 100%; display: flex; align-items: center; gap: 9px; padding: 6px 11px; /* F-0916-01 Q9: 7 qator × 6px — s0 chap ustun 33px ortiq edi */ background: #fff; border: none; cursor: pointer; text-align: left; }
        .swg-head:hover { background: #FBFAF7; }
        .swg-m { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 10px; color: #fff; padding: 3px 8px; border-radius: 5px; min-width: 52px; text-align: center; }
        .swg-path { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .swg-sum { font-size: 11px; color: ${T.ink2}; margin-left: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .swg-chev { color: ${T.ink3}; font-size: 11px; }
        .swg-detail { padding: 11px; background: #F8FAFB; display: flex; flex-direction: column; gap: 8px; }
        .swg-code-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.ink2}; }
        .json { background: ${CODE.bg}; color: ${CODE.text}; border-radius: 9px; padding: 10px 12px; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; white-space: pre-wrap; word-break: break-word; line-height: 1.6; margin: 0; }

        /* SO'ROV YO'LI */
        .flow-rail { display: flex; flex-direction: column; gap: 2px; }
        .flow-stop { display: flex; flex-direction: column; align-items: flex-start; transition: opacity 0.3s; }
        .flow-stop > span { display: inline-flex; }
        .flow-ico { width: 34px; height: 34px; border-radius: 9px; align-items: center; justify-content: center; font-size: 17px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.2); transition: all 0.3s; }
        .flow-k { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; margin: 3px 0 0 6px; }
        .flow-down { font-size: 15px; margin: 1px 0 1px 9px; line-height: 1; transition: color 0.3s; }

        /* ENTITY ROWS */
        .ent-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; padding: 7px 10px; border-radius: 8px; margin-bottom: 5px; }
        .ent-row span { font-size: 10px; font-weight: 700; }
        .ent-row.siz { background: ${T.accentSoft}; color: ${T.ink}; } .ent-row.siz span { color: ${T.accent}; }
        .ent-row.free { background: ${T.successSoft}; color: ${T.ink}; } .ent-row.free span { color: ${T.success}; }

        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: shake 0.4s ease; }

        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .hero-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .score-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; font-variant-numeric: tabular-nums; color: ${T.accent}; background: ${T.accentSoft}; padding: 5px 12px; border-radius: 999px; } /* F-1003-04/05: yakunda halqa o'rniga yorliq */
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; }
        /* F-0803-08 — UYGA VAZIFA KAPSULASI (PmLesson2 etaloni): yakun sahifasida
           «Endi siz bilasiz» dan KEYIN turadi, bosilganda topshiriq kartasi ochiladi. */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.03); } 100% { filter: brightness(1); } }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent); transform: rotate(8deg); animation: hw-shine 4.6s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(120,60,220,.6), 0 0 40px rgba(124,58,237,.72), 0 0 96px rgba(124,58,237,.4), inset 0 0 60px rgba(124,58,237,.44); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none !important; } }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }

        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; }
        /* === 👆 TAP-HINT — bosilmagan joy "meni bos" deb chaqiradi (11.7) === */
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16), 0 0 0 0 rgba(255,79,40,0.32); } 65%,100% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16), 0 0 0 9px rgba(255,79,40,0); } }
        .tap-hint { animation: tap-hint-pulse 2.2s ease-out infinite; }
        .tap-hint:hover { animation-play-state: paused; }
        /* bosilgani ✓ bilan "muhrlanadi" — jonli progress signali */
        @keyframes tap-tick-pop { 0% { transform: scale(0) rotate(-25deg); opacity: 0; } 55% { transform: scale(1.45) rotate(6deg); opacity: 1; } 78% { transform: scale(0.92); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .vseen.tick { display: inline-block; animation: tap-tick-pop 0.44s cubic-bezier(.34,1.56,.44,1) both; }

        /* === ♿ TINCH VARIANT — har og'ir/takrorlanuvchi harakat bilan BIRGA tug'iladi (keyin emas) === */
        @media (prefers-reduced-motion: reduce) {
          .tap-hint, .ev-row.hot, .shop-sign.open, .mstats-reveal.ready { animation: none !important; }
          .vseen.tick, .bk-tag, .sh.catch, .dr-cell.rej, .dr-cell.ok, .ev-row.is-fixed, .cl-row.liar, .shake { animation: none !important; }
          .bk.drag, .sh, .bk { transition: none !important; }
          .bk:hover, .sh:hover, .sh.over { transform: none; }
          .fade-up, .fade-step, .el-in { animation-duration: 0.01ms !important; }
        }


        /* === 🧵 MEROS TASMASI (Beat 0) === */
        .s0-opts .hook-option { padding: 11px 15px; } /* F-0916-01 Q9: ru da o'ng ustun 17px ortiq edi */

        /* === 🏷️ YORLIQ — kitoblar va rastalar (Beat 2) === */
        .bk-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        @media (max-width: 640px) { .bk-grid { grid-template-columns: repeat(2, 1fr); } }
        /* BEAT 2 — kitob (muqova + tikuv) va rasta (do'kon peshtaxtasi) */
        /* touch-action:none — barmoq bilan sudraganda sahifa SILJIMAYDI (mobil sudrash shu bilan tiriladi) */
        .bk { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; background: linear-gradient(135deg, ${T.paper} 60%, #FBF8F2); border: none; border-radius: 4px 10px 10px 4px; padding: 10px 10px 9px 9px; cursor: grab; text-align: left; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.18); transition: all 0.16s; min-height: 80px; touch-action: none; user-select: none; -webkit-user-select: none; }
        .bk:hover { transform: translateY(-2px); }
        .bk.sel { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.28); }
        .bk.done { background: linear-gradient(135deg, ${T.successSoft} 60%, ${T.paper}); cursor: pointer; }
        .bk.lit { box-shadow: inset 0 0 0 2px ${T.success}, 0 8px 22px -6px rgba(31,122,77,0.32); }
        /* qo'lda ko'tarilgan kitob — hover transform o'chadi (inline DOM-transform bilan urishmasin) */
        .bk.drag { cursor: grabbing; transition: none !important; box-shadow: 0 18px 34px -10px rgba(${T.shadowBase},0.34), inset 0 0 0 2px ${T.accent}; }
        .bk.drag:hover { transform: none; }
        .bk-t { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink}; line-height: 1.25; }
        .bk-a { font-size: 10px; color: ${T.ink3}; font-weight: 600; }
        /* 🏷️ yorliq MUQOVAGA muhrlanadi — darsning eng muhim kadri (ko'zga tashlansin) */
        .bk-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 9.5px; font-weight: 700; color: ${T.success}; background: ${T.paper}; border-radius: 99px; padding: 2px 7px; margin-top: auto; box-shadow: inset 0 0 0 1px ${T.success}66; animation: bk-stamp 0.52s cubic-bezier(.3,1.25,.4,1) both; }
        @keyframes bk-stamp { 0% { transform: scale(2.2) rotate(-15deg); opacity: 0; } 40% { opacity: 1; } 62% { transform: scale(0.9) rotate(3deg); opacity: 1; } 80% { transform: scale(1.06) rotate(-1deg); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .sh { display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; border: none; border-bottom: 5px solid rgba(180,83,9,0.28); border-radius: 12px 12px 5px 5px; padding: 11px 13px 10px; width: 100%; text-align: left; cursor: pointer; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); transition: all 0.16s; }
        .sh:hover { transform: translateY(-1px); }
        .sh.on { border-bottom-color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}, 0 8px 20px -6px rgba(31,122,77,0.22); }
        /* kitob ustida turibdi — rasta "og'zini ochadi" */
        .sh.over { transform: translateY(-3px) scale(1.015); border-bottom-color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 14px 28px -8px rgba(255,79,40,0.3); }
        /* rasta kitobni ushlab oldi */
        .sh.catch { animation: sh-catch 0.43s cubic-bezier(.34,1.5,.4,1); }
        @keyframes sh-catch { 0% { transform: scale(1); } 34% { transform: scale(1.045) translateY(-3px); } 68% { transform: scale(0.985) translateY(1px); } 100% { transform: scale(1); } }
        .sh-h { display: flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .sh-n { margin-left: auto; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 10.5px; color: ${T.ink3}; font-weight: 700; }
        .sh-b { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 10.5px; color: ${T.ink2}; line-height: 1.5; }

        /* === 🚪 ESHIK SINOVI (Beat 3) === */
        .dr-tbl { display: flex; flex-direction: column; gap: 6px; }
        .dr-head { display: flex; align-items: center; gap: 8px; padding: 0 10px 1px; }
        .dr-head .dr-ep { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink3}; }
        .dr-hc { flex: 0 0 auto; width: 92px; text-align: center; font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .dr-row { display: flex; align-items: center; gap: 8px; background: ${T.paper}; border-radius: 10px; padding: 8px 10px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .dr-ep { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; font-weight: 700; color: ${T.ink}; flex: 1; min-width: 0; }
        .dr-cell { flex: 0 0 auto; width: 92px; box-sizing: border-box; font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; border: none; border-radius: 8px; padding: 6px 8px; background: ${T.bg}; color: ${T.ink2}; cursor: pointer; transition: all 0.16s; }
        .dr-cell:hover:not(:disabled) { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.25); }
        .dr-cell:disabled { cursor: default; }
        .dr-cell.ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .dr-cell.bad { background: ${T.dangerSoft}; color: ${T.danger}; box-shadow: inset 0 0 0 1.5px ${T.danger}66; }
        /* 🚪 401/403 = qo'riqchi eshikdan ORQAGA ITARADI · 200/201 = ichkariga kiritadi (oqibat ko'rinadi, o'qilmaydi) */
        .dr-cell.rej { animation: dr-reject 0.58s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes dr-reject { 0% { transform: translateX(0) scale(1); } 16% { transform: translateX(7px) scale(1.05); } 40% { transform: translateX(-8px) scale(0.96); } 60% { transform: translateX(5px); } 78% { transform: translateX(-3px); } 100% { transform: none; } }
        .dr-cell.ok:not(.rej) { animation: dr-enter 0.42s cubic-bezier(.34,1.5,.4,1) both; }
        @keyframes dr-enter { 0% { transform: scale(0.88); } 55% { transform: scale(1.07); } 100% { transform: scale(1); } }

        /* === 🔓 OCHILISH TEKSHIRUVI (Beat 4) === */
        .ev-row { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; padding: 7px 9px; border-radius: 8px; background: ${T.bg}; margin-bottom: 5px; transition: all 0.3s ease; }
        /* 03/09 taxtasi: ulanmagan bo'lim (404) SIGNAL BERADI — ulangach yashil (F-1015-401: Screen19 bilan birga o'chirilib, qaytarildi) */
        .ev-row.hot { background: ${T.dangerSoft}; box-shadow: inset 0 0 0 1.5px ${T.danger}66; animation: ev-alarm 1.7s ease-in-out infinite; }
        @keyframes ev-alarm { 0%, 62%, 100% { transform: translateX(0); } 68% { transform: translateX(-3px); } 74% { transform: translateX(3px); } 80% { transform: translateX(-2px); } 86% { transform: translateX(1px); } }
        .ev-row.is-fixed { background: ${T.successSoft}; animation: ev-lock 0.5s cubic-bezier(.34,1.5,.4,1) both; }
        @keyframes ev-lock { 0% { transform: scale(0.97); } 45% { transform: scale(1.025); } 100% { transform: scale(1); } }
        .ev-m { font-weight: 700; color: ${T.ink}; min-width: 58px; }
        /* eshik chipi: 🌐 public — ochiq (neytral-ko'k, XATO EMAS) · 🔒 admin — qulflangan (yashil = himoyalangan) */
        .ev-tag { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 99px; padding: 3px 9px; white-space: nowrap; }
        .ev-tag.open { background: ${T.blueSoft}; color: ${T.blue}; box-shadow: inset 0 0 0 1px ${T.blue}55; }
        .ev-tag.lock { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1px ${T.success}66; }
        /* BEAT 4 — peshtaxta yozuvi (yopiq: xira taxta · OCHIQ: yashil neon) */
        .shop-sign { display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: 14px; padding: 17px 14px; font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.7vw,15px); letter-spacing: 0.1em; text-transform: uppercase; background: ${T.bg}; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.ink3}44; transition: all 0.45s ease; }
        .shop-sign.open { background: linear-gradient(160deg, ${T.successSoft}, ${T.paper}); color: ${T.success}; text-shadow: 0 0 14px rgba(31,122,77,0.35); box-shadow: inset 0 0 0 2px ${T.success}, 0 0 34px -6px rgba(31,122,77,0.55), 0 10px 26px -10px rgba(${T.shadowBase},0.3);
          animation: sign-ignite 1.15s ease-out both, sign-hum 3.6s ease-in-out 1.15s infinite; }
        /* neon peshtaxta YONADI: bir-ikki pirillaydi, so'ng barqaror nafas oladi = "KitobShop ochildi" */
        @keyframes sign-ignite { 0% { opacity: 0.45; filter: brightness(0.55) saturate(0.5); transform: scale(0.985); } 10% { opacity: 1; filter: brightness(1.55) saturate(1.1); } 17% { opacity: 0.5; filter: brightness(0.6) saturate(0.6); } 27% { opacity: 1; filter: brightness(1.45); transform: scale(1.012); } 35% { opacity: 0.62; filter: brightness(0.75); } 46% { opacity: 1; filter: brightness(1.3); } 58% { opacity: 0.85; filter: brightness(0.95); transform: scale(1); } 72%, 100% { opacity: 1; filter: none; transform: scale(1); } }
        @keyframes sign-hum { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.11); } }

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }


        /* === 🛠️ JONLI PRAKTIKA (VS Code-uslub, self-report) === */
        /* «✅ Bajardim» → mentor-gate: tugma MUHRLANADI (pop + yorug'lik supurgisi) — o'quvchi tasdiqni KO'RADI */
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done, .lp-done-btn.is-done::after { animation: none !important; } .lp-done-btn.is-done::after { display: none; } }
        .bhint.bhint { margin: 0; align-self: flex-start; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 14px; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
        .bhint.bhint.calm { color: ${T.ink2}; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; font-style: italic; }

        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
        /* F-0803-13/14: javob uzunlikka moslashadi — 4 pog'ona + kod/gap shrift ajrimi */

        /* === 🏅 ACHIEVEMENTS — hisoblagich + to'liq-ekran bayram === */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(255,79,40,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
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
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }
        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #FFF3EC); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
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
        .acu-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 900; font-size: clamp(12px,1.8vw,14px); letter-spacing: 0.2em; text-transform: uppercase; color: #FFD35A; text-shadow: 0 2px 12px rgba(0,0,0,0.5); animation: acu-rise 0.5s ease-out 0.35s both; }
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
        .pod-col { display: flex; flex-direction: column; align-items: center; gap: 5px; width: clamp(88px,22vw,150px); }
        .pod-medal { font-size: clamp(26px,4vw,38px); line-height: 1; }
        .pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: ${T.ink}; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-score { font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; }
        .pod-bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, ${T.accent}, ${T.accent}BB); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); }
        .pod-1 .pod-bar { height: clamp(74px,11vw,120px); }
        .pod-2 .pod-bar { height: clamp(52px,8vw,86px); background: linear-gradient(180deg, ${T.ink2}, ${T.ink3}); }
        .pod-3 .pod-bar { height: clamp(38px,6vw,62px); background: linear-gradient(180deg, #C98A3D, #DDA55C); }
        .pod-col.me .pod-name { color: ${T.success}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.accent}; }
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: ${T.successSoft}; outline: 1.5px solid ${T.success}66; }
        .pod-rank { min-width: 22px; font-size: 12px; font-weight: 700; color: ${T.ink3}; }
        .pod-row-name { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-row-dots { display: flex; gap: 4px; }
        .pod-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(${T.shadowBase},0.15); }
        .pod-dot.ok { background: ${T.success}; }
        .pod-dot.bad { background: ${T.accent}; }
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink3}; }

        /* === ⚡ CODE STRIKE — CTA neon-kapsula (arena STRUKTURASI ⚡ Jonliniki) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
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
        .cs-clickable { cursor: pointer; user-select: none; transition: transform .18s cubic-bezier(.2,1,.3,1); outline: none; }
        .cs-clickable:hover { transform: scale(1.015); --spd: 2.2; }
        .cs-clickable:active { transform: scale(.99); }
        .cs-clickable:focus-visible { outline: 2px dashed rgba(186,140,255,.8); outline-offset: 6px; }
        .cs-off { filter: saturate(.45) brightness(.74); animation: cs-ignite 1.5s ease-out both, cs-breathe 6.5s ease-in-out 1.5s infinite; }
        .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
        .cs-live { animation: cs-ignite 1.2s ease-out both, cs-breathe 1.7s ease-in-out 1.2s infinite; }
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .cs-charging { animation: cs-charge .45s ease-in forwards !important; }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none; background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%); animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }
        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }

        /* ===================== ⚡ JONLI QATLAM CSS (ReactIntro etalonidan) ===================== */
        /* === MENTOR STATISTIKASI (jonli test + yozma ish panellari) === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
        .mstats-reveal.ready { background: ${T.accent}; color: #fff; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(255,79,40,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(255,79,40,0.55); } }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.blue}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.success}; }
        .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
        .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
        .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
        .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .mstats-chip.okc  { background: ${T.successSoft}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.success}; }
        .mstats-chip.badc { background: ${T.accentSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.accent}; }
        .mstats-chip.waitc { background: rgba(${T.shadowBase},0.06); } .mstats-chip.waitc .mstats-chip-n, .mstats-chip.waitc .mstats-chip-t { color: ${T.ink2}; }
        .mstats-chip.ansc { background: rgba(1,154,203,0.10); } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.blue}; }
        .mstats-hidden { margin: 0; font-family: 'Manrope'; font-size: 12.5px; font-style: italic; color: ${T.ink3}; }
        .mstats-bars { display: flex; flex-direction: column; gap: 8px; }
        .mstats-row { display: flex; align-items: center; gap: 10px; transition: opacity 0.4s; }
        .mstats-row.dimmed { opacity: 0.4; }
        .mstats-abc { width: 28px; height: 28px; border-radius: 9px; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); }
        .mstats-track { flex: 1; height: 16px; background: rgba(${T.shadowBase},0.07); border-radius: 99px; overflow: hidden; }
        .mstats-fill { display: block; height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1); opacity: 0.85; }
        .mstats-count { min-width: 108px; text-align: right; font-size: 12px; font-weight: 600; color: ${T.ink2}; white-space: nowrap; }
        .mstats-waitrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .mstats-wait-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; }
        .mstats-wait-chip { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.07); border-radius: 99px; padding: 3px 10px; }
        .mstats-wait-chip.more { color: ${T.ink3}; }
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); }
        .mstats-verdict.good { background: ${T.successSoft}; }
        .mstats-verdict.few { background: rgba(167,166,162,0.12); }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }

        /* ===== 📖 QAYTA TUSHUNTIRISH (recap) ===== */
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(255,79,40,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.55); }
        .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
        .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .rc-open-mini:hover { transform: translateY(-1px); }
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
        .rc-dot.fill { background: ${T.ink3}; }
        .rc-dot.cur { background: ${T.accent}; width: 26px; }
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.accent}; color: #fff; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover:not(:disabled) { background: #E03E1B; }
        .rc-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
        .rc-btn.ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
        .rc-btn.ghost:hover:not(:disabled) { background: ${T.paper}; color: ${T.ink}; }
        .rc-btn.done { background: ${T.success}; color: #fff; }
        .rc-btn.done:hover { background: #17603C; }
        @media (max-width: 560px) {
          .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; }
          .rc-dots { width: 100%; order: -1; }
          .rc-btn { font-size: 13px; padding: 11px 16px; }
        }

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
        .qz-brand { display: flex; align-items: center; gap: 12px; }
        .qz-brand.sm { gap: 9px; }
        .qz-wm { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,5vw,46px); letter-spacing: -0.03em; color: #F2ECFF; line-height: 1; text-shadow: 0 0 22px rgba(150,95,255,0.4); }
        .qz-wm-h { color: #FF6A3D; }
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
        @media (max-width: 560px) { .qz-grid { grid-template-columns: 1fr; } .qz-wm { font-size: clamp(24px,7vw,34px); } }
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
        /* 11.8 — .qcode chipi qorong'i arena yuzasida: yorug' fon, oq matn (aks holda ko'rinmaydi) */
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
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
        .qz-pod-col { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; width: clamp(92px,24vw,170px); }
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


        /* option-wait (jonli test kutish holati) — sekin nafas pulsatsiyasi (natija ochilishini kutmoqda) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; animation: ow-breathe 1.9s ease-in-out infinite; }
        @keyframes ow-breathe { 0%,100% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3); } 50% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 30px -6px rgba(1,154,203,0.5); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

        /* === 🛠️ JONLI PRAKTIKA — mentor «kim bajardi» chiplari === */

        /* === ⚡ LIVE BADGE — sekundar UI: kerak bo'lguncha xira (L1 etalon) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
        .ach-rule { margin: 8px 0 0; text-align: center; font-size: 13px; line-height: 1.4; color: ${T.ink2}; }
        .ach-rule.lost { font-style: italic; }
        /* ===== F-1015-303/309 · praktika qolipi: amaliyot bloklari va DemoSahifa (izohda backtick yo'q) ===== */
        .am-karta { background: ${T.paper}; border-radius: 14px; padding: clamp(12px,1.8vw,16px) clamp(14px,2vw,18px); display: flex; flex-direction: column; gap: 8px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .lesson-root .am-band { margin: 0; padding-left: 20px; list-style: disc outside; display: flex; flex-direction: column; gap: 5px; font-size: clamp(13px,1.55vw,15px); color: ${T.ink}; line-height: 1.5; }
        .am-masalan { margin: 0; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.35vw,13px); line-height: 1.6; border-radius: 10px; padding: 12px 14px; white-space: pre-wrap; word-break: break-word; }
        .am-qadam { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .am-qadam li { display: flex; gap: 10px; align-items: flex-start; font-size: clamp(13px,1.55vw,15px); color: ${T.ink}; line-height: 1.5; }
        .am-qn { flex: none; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.ink}; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
        .am-osti { margin: 0; color: ${T.ink2}; line-height: 1.5; }
        .lesson-root .am-hw { margin: 0 0 6px; padding-left: 22px; list-style: decimal outside; display: flex; flex-direction: column; gap: 6px; color: ${T.ink}; }
        .am-uslub { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
        .am-uslub-btn { display: flex; flex-direction: column; gap: 2px; text-align: left; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 10px 12px; font-family: 'Manrope', sans-serif; font-size: 14px; color: ${T.ink}; cursor: pointer; }
        .am-uslub-btn span { font-size: 12.5px; color: ${T.ink2}; }
        .am-uslub-btn.on { border-color: ${T.ink}; background: ${T.paper}; box-shadow: 0 0 0 2px ${T.ink}; }
        .am-javob-joy { min-height: 104px; }
        .am-nusxa { align-self: flex-start; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 9px 16px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }
        .am-nusxa:hover { background: ${T.accentSoft}; }
        .am-prompt-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .am-tayyor { background: ${T.paper}; border: 1.5px solid rgba(255,79,40,0.35); border-radius: 16px; padding: clamp(14px,2vw,18px); display: flex; flex-direction: column; gap: 10px; box-shadow: 0 10px 24px -10px rgba(255,79,40,0.35); }
        .am-tayyor-h { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,2vw,19px); color: ${T.ink}; }
        .lesson-root .am-tayyor-l { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .am-tayyor-l li { display: flex; gap: 12px; align-items: flex-start; font-size: clamp(14px,1.6vw,15.5px); color: ${T.ink}; line-height: 1.5; }
        .am-tayyor-n { flex: none; width: 28px; height: 28px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }
        .am-tayyor-s { margin: 0; font-size: 13px; color: ${T.ink2}; }
        .am-maydon { display: flex; flex-direction: column; gap: 5px; font-size: 13px; font-weight: 600; color: ${T.ink}; }
        .am-input { width: 100%; font: 500 14px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 10px 12px; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .am-input::placeholder { color: ${T.ink2}; opacity: 0.85; }
        .am-input:hover { border-color: #cfcabe; }
        .am-input:focus { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}; }
        .am-saqla { align-self: flex-start; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 9px 18px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }
        .am-saqla:hover:not(:disabled) { background: ${T.accentSoft}; }
        .am-saqla:disabled { border-color: ${T.line}; color: ${T.ink2}; cursor: default; }
        .am-loyiha-nom { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 18px; color: ${T.ink}; }
        .am-soni { font: 700 12px 'Manrope', sans-serif; color: ${T.success}; background: ${T.successSoft}; border-radius: 999px; padding: 3px 10px; }
        .am-tayyor-ok { margin: 0; font-weight: 700; color: ${T.success}; font-size: 14px; }
        .am-ochil { animation: am-ochil 0.45s cubic-bezier(.2,.7,.3,1) both; }
        @keyframes am-ochil { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .am-ochil { animation: none; } }
        /* ===== F-1015-330 · qadamlar tugmasi (a2, a3) ===== */
        .am-qt { padding: 0; overflow: hidden; }
        .am-qt-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: none; border: none; cursor: pointer; padding: 14px 18px; font: 700 14px 'Manrope', sans-serif; color: ${T.ink}; text-align: left; }
        .am-qt-btn:hover { background: ${T.accentSoft}; }
        .am-qt-btn:focus-visible { outline: 2px solid ${T.accent}; outline-offset: -2px; }
        .am-qt-ic { color: ${T.accent}; font-size: 16px; transition: transform 0.2s; }
        .am-qt.on .am-qt-ic { transform: rotate(180deg); }
        .am-qt > .am-qadam { padding: 0 18px 16px; }
        .am-tt { padding: 0; gap: 0; }
        .am-tt-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; cursor: pointer; text-align: left; padding: clamp(14px,2vw,18px); border-radius: 14px; font: inherit; }
        .am-tt-btn:hover { background: ${T.accentSoft}; }
        .am-tt-btn:focus-visible { outline: 2px solid ${T.accent}; outline-offset: -2px; }
        .am-tt.on .am-qt-ic { transform: rotate(180deg); }
        .am-tt-ich { display: flex; flex-direction: column; gap: 10px; padding: 0 clamp(14px,2vw,18px) clamp(14px,2vw,18px); }
        .am-tt-nafas { animation: am-nafas 2.4s ease-in-out infinite; }
        .am-tayyor.am-tt { box-shadow: none; } /* F-1015-362: yordamchi blok — yumshoq ramka, soyasiz */
        @keyframes am-nafas { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,79,40,0.18); } 50% { box-shadow: 0 0 0 6px rgba(255,79,40,0); } }
        .am-tt-oyna { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(560px,92vw); max-height: calc(88vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(18px,3vw,28px); display: flex; flex-direction: column; gap: 14px; box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        .am-tt-oyna-h { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .am-tt-yop { flex: none; width: 34px; height: 34px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .am-tt-yop:hover { color: ${T.accent}; border-color: ${T.accent}; }
        .am-tt-yop:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .am-yig { width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 12px; border: none; cursor: pointer; text-align: left; font: inherit; padding: 14px 18px; }
        .am-yig-ok { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .am-yig-k { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 13.5px; color: ${T.ink2}; }
        .am-yig:hover .am-yig-k { color: ${T.accent}; }
        .am-yig:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .sk-kotar { animation: sk-kotar 0.5s cubic-bezier(.2,.7,.3,1) both; } /* F-1015-363: prompt yig'ilgach kod oynasi yuqoriga ko'tariladi */
        @keyframes sk-kotar { from { opacity: 0.4; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .sk-bar-nur { animation: sk-bar-nur 1.1s ease-out; }
        @keyframes sk-bar-nur { from { box-shadow: inset 0 -2px 0 rgba(250,204,21,0.9); background: rgba(250,204,21,0.22); } to { box-shadow: inset 0 -2px 0 rgba(250,204,21,0); } }
        @media (prefers-reduced-motion: reduce) { .sk-kotar, .sk-bar-nur, .am-tt-oyna { animation: none !important; } }
        @media (prefers-reduced-motion: reduce) { .am-tt-nafas { animation: none; } }
        .screen > .head + .split { margin-top: clamp(6px,1vw,10px); } /* F-1015-333: mentorsiz ekranda sarlavha bloklarga yopishmasin */
        .am-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .am-chip { display: inline-flex; align-items: center; gap: 6px; font: 600 12.5px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 999px; padding: 6px 12px; cursor: pointer; }
        .am-chip:hover { border-color: ${T.ink2}; }
        .am-chip.on { border-color: ${T.ink}; background: ${T.paper}; box-shadow: 0 0 0 1.5px ${T.ink}; }
        .am-chip:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .am-reja-k { gap: 10px; }
        .am-yorliq-joy { visibility: hidden; } /* F-1015-338: o'ng karta chapdagi namuna-sayt bilan bir balandlikdan boshlansin */
        @media (max-width: 760px) { .am-yorliq-joy { display: none; } }
        .am-chiziq { border: none; border-top: 1px solid ${T.line}; margin: 4px 0; }
        .lesson-root .am-blok-qator { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .am-blok-qator li { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 15px; color: ${T.ink}; }
        .am-kod { display: flex; flex-direction: column; gap: 6px; }
        .am-kod + .am-kod { margin-top: 6px; }
        .am-yordam { background: ${T.paper}; border-radius: 12px; padding: 10px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .am-yordam summary { cursor: pointer; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .am-yordam p, .am-yordam pre { margin: 8px 0 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .lesson-root .am-blok-ro { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .am-blok-ro li { flex-direction: row; align-items: center; gap: 12px; flex-wrap: wrap; }
        .am-blok-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${T.accent}; }
        .am-blok-teg { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }
        /* ===== F-1015-340 · REJA.md maketi, do'kon maketi va reja formasi (izohda backtick yo'q) ===== */
        .bb-dots { display: flex; gap: 5px; } .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .am-qoida-m { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(18px,2.4vw,22px); line-height: 1.3; color: ${T.ink}; }
        .am-satr { margin: 0; font-size: 14px; color: ${T.ink2}; }
        .rj-qator { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .rj-qator .am-input { flex: 1 1 150px; width: auto; min-width: 0; padding: 8px 10px; }
        .rj-qator .dk-narx-in { flex: 0 0 104px; }
        .rj-qator .dk-toifa-in { flex: 0 0 118px; padding: 8px 8px; }
        .rj-oyna { border-radius: 12px; overflow: hidden; background: ${CODE.bg}; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.3); }
        .rj-bar { display: flex; align-items: center; gap: 10px; background: #111827; padding: 7px 12px; }
        .rj-fayl { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #cbd5e1; }
        .rj-body { padding: 12px 16px 14px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.75; color: ${CODE.text}; }
        .rj-h1 { color: ${CODE.tag}; font-weight: 700; }
        .rj-h2 { color: ${CODE.attr}; font-weight: 700; margin-top: 6px; }
        .rj-li { white-space: pre-wrap; overflow-wrap: anywhere; }
        .rj-yoq { color: #94a3b8; font-style: italic; }
        .dk-sayt { border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.3); font-family: 'Manrope', Arial, sans-serif; }
        .dk-bar { display: flex; align-items: center; gap: 10px; background: #ECE9E1; padding: 7px 12px; }
        .dk-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .dk-body { display: flex; flex-direction: column; gap: 10px; padding: 14px; background: #f8fafc; }
        .lesson-root .dk-h1 { margin: 0; font-size: 18px; font-weight: 800; line-height: 1.2; color: #0f172a; }
        .dk-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
        .dk-6 .dk-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
        .dk-karta { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 3px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; font-size: 12.5px; color: #0f172a; overflow-wrap: anywhere; }
        .dk-karta b { font-weight: 800; }
        .dk-rasm { align-self: stretch; height: 34px; border-radius: 7px; background: linear-gradient(135deg, #dbeafe, #e0e7ff); margin-bottom: 4px; }
        .dk-narx { font-weight: 700; color: #1d4ed8; }
        .dk-yoq { display: inline-flex; border: 1.5px dashed #94a3b8; border-radius: 7px; padding: 1px 8px; color: #475569; font-weight: 700; font-size: 12px; font-style: normal; }
        .dk-teg { position: absolute; top: 6px; right: 6px; font: 700 9.5px 'JetBrains Mono', monospace; background: ${T.success}; color: #fff; padding: 1px 6px; border-radius: 5px; }
        /* F-1015-341/342: a1 «Do'konni yig'ing» — qismlar qatori + Shart (4 ta joy) / Keyin ustunlari */
        .ql-taxta { gap: 10px; }
        .ql-zona { border: 1.5px solid ${T.line}; background: ${T.paper}; border-radius: 12px; padding: 10px; display: flex; flex-direction: column; gap: 8px; min-height: 64px; transition: border-color 0.2s, background 0.2s; }
        .ql-zona-pool { background: ${T.bg}; border-color: transparent; }
        .ql-zona-shart { border-color: #9cc9b0; }
        .ql-zona-shart .ql-zona-h { color: ${T.success}; }
        .ql-zona.ql-kut { border-color: ${T.ink2}; cursor: pointer; }
        .ql-zona.ql-kut:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .ql-zona.ql-ust { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .ql-zona-shart.ql-ust { border-color: ${T.success}; background: ${T.successSoft}; }
        .ql-zona-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; font: 800 11px 'JetBrains Mono', monospace; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .ql-izoh { font: 600 11px 'Manrope', sans-serif; letter-spacing: 0; text-transform: none; color: ${T.ink2}; }
        .ql-ikki { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 560px) { .ql-ikki { grid-template-columns: 1fr; } }
        .ql-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .ql-ustun { flex-direction: column; align-items: stretch; }
        .ql-chip { display: inline-flex; align-items: center; gap: 7px; font: 700 13px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 7px 10px; cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; box-shadow: 0 2px 6px -3px rgba(${T.shadowBase},0.25); transition: box-shadow 0.15s, border-color 0.15s; text-align: left; }
        .ql-chip b { font-weight: 700; }
        .ql-chip:hover { border-color: ${T.ink2}; }
        .ql-chip:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .ql-chip.ql-tan { border-color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accent}, 0 10px 18px -8px rgba(${T.shadowBase},0.4); }
        .ql-chip.ql-sudr { cursor: grabbing; position: relative; z-index: 30; pointer-events: none; box-shadow: 0 18px 30px -10px rgba(${T.shadowBase},0.5); }
        .ql-zona-shart .ql-chip { border-color: #9cc9b0; }
        .ql-n { flex: none; width: 18px; height: 18px; border-radius: 50%; background: ${T.success}; color: #fff; font: 800 10.5px 'JetBrains Mono', monospace; display: inline-flex; align-items: center; justify-content: center; }
        .ql-joy { display: flex; align-items: center; gap: 7px; min-height: 37px; padding: 0 10px; border: 1.5px dashed #c9d9cf; border-radius: 10px; }
        .ql-joy .ql-n { background: transparent; color: ${T.success}; box-shadow: inset 0 0 0 1.5px #9cc9b0; }
        .ql-sanoq { font: 700 12px 'JetBrains Mono', monospace; letter-spacing: 0; color: ${T.success}; }
        .ql-bosh { font-size: 12.5px; color: ${T.ink2}; font-style: italic; }
        .ql-silk { animation: ql-silk 0.45s; }
        @keyframes ql-silk { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(3px); } }
        .ql-xabar.ql-xabar { margin: 0; font-size: 13.5px; font-weight: 600; line-height: 1.45; padding: 8px 12px; border-radius: 10px; animation: ql-kir 0.3s ease-out; }
        .ql-xabar.xato { color: #b42318; background: #fdecea; }
        .ql-xabar.info { color: ${T.success}; background: ${T.successSoft}; }
        @keyframes ql-kir { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        /* Jonli do'kon maketi — qismlar paydo bo'lganda sirg'alib kiradi, kartochkalar «pop» */
        .dk-bosh { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
        .dk-ong { display: flex; gap: 6px; flex-wrap: wrap; }
        .dk-pill { display: inline-flex; align-items: center; gap: 4px; font: 700 11px 'Manrope', sans-serif; color: #0f172a; background: #fff; border: 1px solid #cbd5e1; border-radius: 999px; padding: 4px 10px; }
        .dk-savat { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
        .dk-tolov { background: #15803d; color: #fff; border-color: #15803d; }
        .dk-rel { position: relative; }
        .dk-qidir { width: 100%; font: 500 13px 'Manrope', sans-serif; color: #0f172a; background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 7px 10px; outline: none; }
        .dk-qidir::placeholder { color: #64748b; }
        .dk-qidir:focus { border-color: #1d4ed8; box-shadow: 0 0 0 3px #dbeafe; }
        .dk-filtr { display: flex; gap: 6px; flex-wrap: wrap; }
        .dk-tf { font: 700 11.5px 'Manrope', sans-serif; color: #334155; background: #fff; border: 1px solid #cbd5e1; border-radius: 999px; padding: 5px 11px; cursor: pointer; transition: background 0.15s, color 0.15s; }
        .dk-tf:hover { border-color: #64748b; }
        .dk-tf.on { background: #dbeafe; color: #1e40af; border-color: #1d4ed8; }
        .dk-tf:focus-visible, .dk-sev:focus-visible, .dk-savatga:focus-visible { outline: 2px solid #1d4ed8; outline-offset: 2px; }
        .lesson-root .dk-royxat { margin: 0; padding-left: 18px; font: 500 12.5px 'JetBrains Mono', monospace; color: #0f172a; line-height: 1.7; }
        .dk-bosh-sahifa { border: 1.5px dashed #cbd5e1; border-radius: 10px; padding: 28px 12px; text-align: center; font-size: 12.5px; color: #475569; }
        .dk-toifa { font: 700 10px 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.04em; }
        .dk-amal { display: flex; align-items: center; gap: 6px; margin-top: 4px; align-self: stretch; }
        .dk-sev { flex: none; border: 1px solid #cbd5e1; background: #fff; border-radius: 7px; width: 28px; height: 26px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; }
        .dk-savatga { flex: 1; font: 700 11px 'Manrope', sans-serif; color: #1e40af; background: #eff6ff; border: 1px solid #93c5fd; border-radius: 7px; padding: 6px; cursor: pointer; }
        .dk-yoq-t.dk-yoq-t { margin: 0; font-size: 12.5px; color: #475569; text-align: center; padding: 14px 0; }
        .dk-kir { animation: dk-kir 0.45s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes dk-kir { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .dk-pop { animation: dk-pop 0.4s cubic-bezier(.2,.9,.3,1.3) both; }
        @keyframes dk-pop { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: none; } }
        .dk-yangi-q { border-radius: 10px; animation: dk-kir 0.45s cubic-bezier(.2,.8,.2,1) both, dk-nur 1.1s 0.35s 2; }
        @keyframes dk-nur { 0% { box-shadow: 0 0 0 0 rgba(31,122,77,0.55); } 100% { box-shadow: 0 0 0 10px rgba(31,122,77,0); } }
        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar, .dk-kir, .dk-pop, .dk-yangi-q { animation: none !important; } }
        /* ===== F-1015-353 · m4a-04: agent tekshiruvi (izohda backtick yo'q) ===== */
        .sk-izoh { color: #94a3b8; }
        .sk-nur { border-radius: 6px; animation: sk-nur 1.2s ease-out; }
        @keyframes sk-nur { 0%, 35% { background: rgba(250,204,21,0.38); } 100% { background: transparent; } }
        .cr-son { font: 800 12.5px 'Manrope', sans-serif; color: ${T.ink}; }
        .lesson-root .cr-jadval { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 7px; }
        .cr-jadval li { display: grid; grid-template-columns: minmax(62px, auto) 1fr auto; align-items: center; gap: 10px; font-size: 14px; color: ${T.ink}; }
        .cr-jadval li span { color: ${T.ink2}; }
        .cr-jadval .qcode { white-space: nowrap; }
        @media (max-width: 560px) { .cr-jadval li { grid-template-columns: 58px 1fr; } .cr-jadval .qcode { grid-column: 1 / -1; justify-self: start; } }
        .am-yordam pre.am-masalan { color: ${CODE.text}; }
        .sk-mos { background: rgba(74,222,128,0.16); border-radius: 6px; box-shadow: inset 3px 0 0 #4ade80; }
        .rt-oyin { display: flex; flex-direction: column; gap: 6px; }
        .rt-rasm { border-radius: 12px; height: 70px; display: flex; align-items: center; justify-content: center; font-size: 34px; }
        .rt-nom.rt-nom { margin: 0; font-family: "Source Serif 4", serif; font-weight: 600; font-size: 18px; color: ${T.ink}; }
        .rt-forma { display: flex; flex-direction: column; gap: 10px; }
        .ag-tek { display: flex; flex-direction: column; gap: 8px; }
        .ag-tek-q { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; color: ${T.ink}; cursor: pointer; }
        .ag-tek-q input { margin-top: 3px; accent-color: ${T.success}; width: 16px; height: 16px; }
        @media (prefers-reduced-motion: reduce) { .sk-nur { animation: none !important; } }
      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live, passed: screen < maxReached }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'KitobShop praktikasi', ru: 'Практика KitobShop' }} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
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
